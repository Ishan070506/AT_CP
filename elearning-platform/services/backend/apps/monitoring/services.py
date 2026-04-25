import uuid

from asgiref.sync import async_to_sync
from django.contrib.gis.geos import Point
from django.conf import settings
from django.utils import timezone
import django_rq

from apps.common.encryption import AESCipher
from apps.common.storage import put_object_bytes
from apps.courses.models import Course, Enrollment, LearningUnit
from apps.monitoring.ai import FaceAINotConfigured, OpenCVFaceRecognitionEngine
from apps.monitoring.models import AttentionSample, FaceProfile, FaceVerificationLog, IntegrityAlert
from config.realtime import publish_tenant_event


class FaceVerificationService:
    similarity_threshold = settings.FACE_MATCH_THRESHOLD
    liveness_threshold = settings.FACE_LIVENESS_THRESHOLD
    attention_threshold = settings.FACE_ATTENTION_THRESHOLD

    @staticmethod
    def _upload_reference_image(*, tenant, user, image_base64: str) -> str:
        _, raw = OpenCVFaceRecognitionEngine.decode_image(image_base64)
        object_key = f"{tenant.storage_prefix or tenant.slug}/master-faces/{user.id}/{uuid.uuid4()}.jpg"
        return put_object_bytes(key=object_key, body=raw, content_type="image/jpeg")

    @staticmethod
    def store_master_face(*, tenant, user, image_key: str | None, embedding: list[float] | None, image_base64: str | None, capture_device: str):
        cipher = AESCipher()
        analysis = None
        resolved_embedding = embedding
        resolved_image_key = image_key or ""
        if image_base64:
            analysis = OpenCVFaceRecognitionEngine.analyze_frame(image_base64)
            resolved_embedding = analysis.embedding
            resolved_image_key = resolved_image_key or FaceVerificationService._upload_reference_image(
                tenant=tenant,
                user=user,
                image_base64=image_base64,
            )
        if not resolved_embedding:
            raise FaceAINotConfigured("No face embedding available for master face registration.")
        profile, _ = FaceProfile.objects.update_or_create(
            tenant=tenant,
            user=user,
            defaults={
                "master_image_key": resolved_image_key,
                "encrypted_embedding": cipher.encrypt_json(resolved_embedding),
                "capture_device": capture_device,
                "is_active": True,
            },
        )
        user.must_capture_master_face = False
        user.save(update_fields=["must_capture_master_face"])
        return profile, analysis

    @staticmethod
    def verify(*, tenant, user, payload: dict) -> dict:
        cipher = AESCipher()
        profile = FaceProfile.objects.get(tenant=tenant, user=user, is_active=True)
        stored_embedding = cipher.decrypt_json(profile.encrypted_embedding)
        derived = None
        if payload.get("image_base64"):
            derived = OpenCVFaceRecognitionEngine.analyze_frame(
                payload["image_base64"],
                challenge_frames=payload.get("challenge_frames") or [],
            )
            payload = {
                **payload,
                "embedding": derived.embedding,
                "face_count": derived.face_count,
                "liveness_score": derived.liveness_score,
                "attention_score": derived.attention_score,
            }
        payload.setdefault("face_count", 1)
        payload.setdefault("liveness_score", 1.0)
        payload.setdefault("attention_score", 1.0)
        similarity = FaceVerificationService._cosine_similarity(stored_embedding, payload["embedding"])
        spoof_suspected = payload["liveness_score"] < FaceVerificationService.liveness_threshold
        multi_face = payload["face_count"] > 1
        looked_away = payload["attention_score"] < FaceVerificationService.attention_threshold
        matched = similarity >= FaceVerificationService.similarity_threshold and not spoof_suspected and not multi_face
        course = Course.objects.filter(id=payload.get("course_id"), tenant=tenant).first()
        enrollment = Enrollment.objects.filter(id=payload.get("enrollment_id"), tenant=tenant, user=user).first()
        unit = LearningUnit.objects.filter(id=payload.get("unit_id"), tenant=tenant).first()
        origin_point = None
        if payload.get("longitude") is not None and payload.get("latitude") is not None:
            origin_point = Point(payload["longitude"], payload["latitude"], srid=4326)
        metadata = {"looked_away": looked_away}
        if derived:
            metadata.update(
                {
                    "provider": "opencv_yunet_sface",
                    "warnings": derived.warnings,
                    "quality_score": derived.quality_score,
                    "bbox": derived.bbox,
                    "landmarks": derived.landmarks,
                }
            )
        log = FaceVerificationLog.objects.create(
            tenant=tenant,
            user=user,
            course=course,
            unit=unit,
            enrollment=enrollment,
            source=payload.get("source", "web"),
            similarity_score=similarity,
            liveness_score=payload["liveness_score"],
            attention_score=payload["attention_score"],
            face_count=payload["face_count"],
            matched=matched,
            is_spoof_suspected=spoof_suspected,
            metadata=metadata,
            origin_point=origin_point,
        )
        alert = None
        if not matched or looked_away:
            reasons = []
            if not matched:
                reasons.append("face_mismatch")
            if spoof_suspected:
                reasons.append("anti_spoof_failed")
            if multi_face:
                reasons.append("multi_face_detected")
            if looked_away:
                reasons.append("attention_drift")
            severity = IntegrityAlert.CRITICAL if spoof_suspected or multi_face else IntegrityAlert.HIGH
            alert = IntegrityAlert.objects.create(
                tenant=tenant,
                user=user,
                course=course,
                enrollment=enrollment,
                verification_log=log,
                reason=",".join(reasons),
                severity=severity,
                confidence_score=1 - similarity if similarity <= 1 else 1,
            )
            if enrollment:
                enrollment.requires_admin_review = True
                enrollment.status = Enrollment.PENDING_REVIEW
                enrollment.save(update_fields=["requires_admin_review", "status", "updated_at"])
            django_rq.get_queue("notifications").enqueue(FaceVerificationService._broadcast_alert, str(tenant.id), str(alert.id))
        return {
            "matched": matched,
            "pause_session": bool(alert),
            "confidence_score": round(similarity, 4),
            "alert_id": str(alert.id) if alert else None,
            "verification_log_id": str(log.id),
            "attention_score": round(float(payload["attention_score"]), 4),
            "liveness_score": round(float(payload["liveness_score"]), 4),
            "face_count": int(payload["face_count"]),
            "warnings": derived.warnings if derived else [],
        }

    @staticmethod
    def _broadcast_alert(tenant_id: str, alert_id: str) -> None:
        async_to_sync(publish_tenant_event)(
            tenant_id,
            "integrity.alert",
            {"alert_id": alert_id, "timestamp": timezone.now().isoformat()},
        )

    @staticmethod
    def _cosine_similarity(a: list[float], b: list[float]) -> float:
        numerator = sum(x * y for x, y in zip(a, b))
        denominator_a = sum(x * x for x in a) ** 0.5
        denominator_b = sum(y * y for y in b) ** 0.5
        denominator = denominator_a * denominator_b
        return numerator / denominator if denominator else 0


class AttentionMonitoringService:
    @staticmethod
    def record(*, tenant, enrollment, unit, attention_score: float, looked_away_seconds: int, face_count: int):
        return AttentionSample.objects.create(
            tenant=tenant,
            enrollment=enrollment,
            unit=unit,
            attention_score=attention_score,
            looked_away_seconds=looked_away_seconds,
            face_count=face_count,
        )
