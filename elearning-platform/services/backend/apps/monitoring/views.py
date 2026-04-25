from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.courses.models import Enrollment, LearningUnit
from apps.monitoring.models import IntegrityAlert
from apps.monitoring.ai import FaceAIError
from apps.monitoring.serializers import FaceProfileSerializer, FaceVerificationSerializer, IntegrityAlertSerializer, MasterFaceSerializer
from apps.monitoring.services import AttentionMonitoringService, FaceVerificationService


class MasterFaceUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = MasterFaceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            profile, analysis = FaceVerificationService.store_master_face(
                tenant=request.tenant,
                user=request.user,
                image_key=serializer.validated_data.get("image_key"),
                embedding=serializer.validated_data.get("embedding"),
                image_base64=serializer.validated_data.get("image_base64"),
                capture_device=serializer.validated_data.get("capture_device", ""),
            )
        except FaceAIError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        payload = FaceProfileSerializer(profile).data
        if analysis:
            payload["analysis"] = {
                "face_count": analysis.face_count,
                "attention_score": analysis.attention_score,
                "liveness_score": analysis.liveness_score,
                "quality_score": analysis.quality_score,
                "warnings": analysis.warnings,
            }
        return Response(payload, status=status.HTTP_201_CREATED)


class VerifyFaceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = FaceVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            result = FaceVerificationService.verify(
                tenant=request.tenant,
                user=request.user,
                payload=serializer.validated_data,
            )
        except FaceAIError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response(result, status=status.HTTP_200_OK)


class AttentionEventView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        enrollment = Enrollment.objects.get(id=request.data["enrollment_id"], tenant=request.tenant, user=request.user)
        unit = LearningUnit.objects.get(id=request.data["unit_id"], tenant=request.tenant)
        sample = AttentionMonitoringService.record(
            tenant=request.tenant,
            enrollment=enrollment,
            unit=unit,
            attention_score=float(request.data["attention_score"]),
            looked_away_seconds=int(request.data.get("looked_away_seconds", 0)),
            face_count=int(request.data.get("face_count", 1)),
        )
        return Response({"id": sample.id}, status=status.HTTP_201_CREATED)


class IntegrityAlertViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = IntegrityAlertSerializer

    def get_queryset(self):
        return IntegrityAlert.objects.filter(tenant=self.request.tenant).select_related("user", "course", "enrollment", "verification_log")

    @action(detail=True, methods=["post"])
    def review(self, request, pk=None):
        alert = self.get_object()
        alert.status = IntegrityAlert.REVIEWED
        alert.reviewed_by = request.user
        alert.reviewed_at = timezone.now()
        alert.resolution_notes = request.data.get("resolution_notes", "")
        alert.save(update_fields=["status", "reviewed_by", "reviewed_at", "resolution_notes", "updated_at"])
        return Response(self.get_serializer(alert).data)
