import base64
import binascii
import os
from dataclasses import dataclass
from typing import Any

from django.conf import settings

try:
    import cv2
    import numpy as np
except Exception:  # pragma: no cover - handled at runtime when deps are unavailable
    cv2 = None
    np = None


class FaceAIError(Exception):
    pass


class FaceAINotConfigured(FaceAIError):
    pass


class FaceDetectionError(FaceAIError):
    pass


@dataclass
class FaceFrameAnalysis:
    embedding: list[float]
    face_count: int
    attention_score: float
    liveness_score: float
    quality_score: float
    warnings: list[str]
    bbox: dict[str, float]
    landmarks: dict[str, tuple[float, float]]


class OpenCVFaceRecognitionEngine:
    _detector = None
    _recognizer = None

    @classmethod
    def ensure_ready(cls) -> None:
        if cv2 is None or np is None:
            raise FaceAINotConfigured("OpenCV AI dependencies are not installed.")
        if not hasattr(cv2, "FaceDetectorYN") or not hasattr(cv2, "FaceRecognizerSF"):
            raise FaceAINotConfigured("Current OpenCV build does not expose FaceDetectorYN / FaceRecognizerSF.")
        if not os.path.exists(settings.FACE_DETECTOR_MODEL_PATH):
            raise FaceAINotConfigured(f"Missing face detector model: {settings.FACE_DETECTOR_MODEL_PATH}")
        if not os.path.exists(settings.FACE_RECOGNIZER_MODEL_PATH):
            raise FaceAINotConfigured(f"Missing face recognizer model: {settings.FACE_RECOGNIZER_MODEL_PATH}")

    @classmethod
    def _get_detector(cls, width: int, height: int):
        cls.ensure_ready()
        if cls._detector is None:
            cls._detector = cv2.FaceDetectorYN.create(
                settings.FACE_DETECTOR_MODEL_PATH,
                "",
                (width, height),
                settings.FACE_DETECTOR_SCORE_THRESHOLD,
                0.3,
                5000,
            )
        cls._detector.setInputSize((width, height))
        return cls._detector

    @classmethod
    def _get_recognizer(cls):
        cls.ensure_ready()
        if cls._recognizer is None:
            cls._recognizer = cv2.FaceRecognizerSF.create(settings.FACE_RECOGNIZER_MODEL_PATH, "")
        return cls._recognizer

    @staticmethod
    def decode_image(image_base64: str):
        if np is None or cv2 is None:
            raise FaceAINotConfigured("OpenCV AI dependencies are unavailable.")
        payload = image_base64.split(",", 1)[1] if "," in image_base64 else image_base64
        try:
            raw = base64.b64decode(payload)
        except binascii.Error as exc:
            raise FaceDetectionError("Invalid base64 image payload.") from exc
        image_array = np.frombuffer(raw, dtype=np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        if image is None:
            raise FaceDetectionError("Could not decode image.")
        return image, raw

    @classmethod
    def detect_faces(cls, image):
        height, width = image.shape[:2]
        detector = cls._get_detector(width, height)
        result = detector.detect(image)
        faces = result[1] if isinstance(result, tuple) else result
        if faces is None:
            return np.empty((0, 15), dtype=np.float32)
        return faces

    @staticmethod
    def _select_primary_face(faces):
        if faces.shape[0] == 0:
            raise FaceDetectionError("No face detected in the frame.")
        scores = faces[:, 14]
        return faces[int(np.argmax(scores))]

    @classmethod
    def _extract_embedding(cls, image, face):
        recognizer = cls._get_recognizer()
        aligned = recognizer.alignCrop(image, face)
        feature = recognizer.feature(aligned)
        return np.asarray(feature).flatten().astype(float).tolist()

    @staticmethod
    def _face_bbox(face) -> dict[str, float]:
        return {
            "x": float(face[0]),
            "y": float(face[1]),
            "width": float(face[2]),
            "height": float(face[3]),
            "score": float(face[14]),
        }

    @staticmethod
    def _landmarks(face) -> dict[str, tuple[float, float]]:
        return {
            "right_eye": (float(face[4]), float(face[5])),
            "left_eye": (float(face[6]), float(face[7])),
            "nose": (float(face[8]), float(face[9])),
            "right_mouth": (float(face[10]), float(face[11])),
            "left_mouth": (float(face[12]), float(face[13])),
        }

    @staticmethod
    def _estimate_quality(image, face) -> float:
        x, y, w, h = [int(value) for value in face[:4]]
        crop = image[max(0, y) : max(0, y) + max(1, h), max(0, x) : max(0, x) + max(1, w)]
        if crop.size == 0:
            return 0.0
        gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
        sharpness = min(cv2.Laplacian(gray, cv2.CV_64F).var() / 180.0, 1.0)
        contrast = min(float(np.std(gray)) / 64.0, 1.0)
        exposure = min((np.percentile(gray, 95) - np.percentile(gray, 5)) / 180.0, 1.0)
        return round(float((sharpness * 0.45) + (contrast * 0.25) + (exposure * 0.30)), 4)

    @staticmethod
    def _estimate_attention(face) -> float:
        x, y, w, h = [float(value) for value in face[:4]]
        landmarks = OpenCVFaceRecognitionEngine._landmarks(face)
        right_eye = landmarks["right_eye"]
        left_eye = landmarks["left_eye"]
        nose = landmarks["nose"]
        mouth_center = (
            (landmarks["right_mouth"][0] + landmarks["left_mouth"][0]) / 2,
            (landmarks["right_mouth"][1] + landmarks["left_mouth"][1]) / 2,
        )
        face_center = (x + (w / 2), y + (h / 2))
        horizontal_offset = min(abs(nose[0] - face_center[0]) / max(w / 2, 1), 1.0)
        vertical_offset = min(abs((right_eye[1] + left_eye[1]) / 2 - (y + h * 0.38)) / max(h, 1), 1.0)
        roll = min(abs(left_eye[1] - right_eye[1]) / max(abs(left_eye[0] - right_eye[0]), 1), 1.0)
        mouth_balance = min(abs(mouth_center[0] - face_center[0]) / max(w / 2, 1), 1.0)
        score = 1 - ((horizontal_offset * 0.45) + (vertical_offset * 0.2) + (roll * 0.2) + (mouth_balance * 0.15))
        return round(float(max(0.0, min(score, 1.0))), 4)

    @classmethod
    def _estimate_liveness(cls, image, primary_face, challenge_faces: list[Any]) -> tuple[float, list[str]]:
        warnings: list[str] = []
        quality = cls._estimate_quality(image, primary_face)
        motion_score = 0.0
        if challenge_faces:
            nose_positions = [cls._landmarks(primary_face)["nose"], *[cls._landmarks(face)["nose"] for face in challenge_faces]]
            deltas = []
            for previous, current in zip(nose_positions, nose_positions[1:]):
                deltas.append(abs(current[0] - previous[0]) + abs(current[1] - previous[1]))
            if deltas:
                motion_score = min(float(sum(deltas) / len(deltas)) / max(primary_face[2] * 0.08, 1.0), 1.0)
            if motion_score < 0.12:
                warnings.append("challenge_motion_low")
        else:
            warnings.append("challenge_frames_missing")
        if quality < 0.35:
            warnings.append("face_quality_low")
        if primary_face[14] < settings.FACE_DETECTOR_SCORE_THRESHOLD:
            warnings.append("detector_confidence_low")
        liveness = max(0.0, min((quality * 0.6) + (motion_score * 0.4), 1.0))
        return round(float(liveness), 4), warnings

    @classmethod
    def analyze_frame(cls, image_base64: str, challenge_frames: list[str] | None = None) -> FaceFrameAnalysis:
        image, _ = cls.decode_image(image_base64)
        faces = cls.detect_faces(image)
        primary_face = cls._select_primary_face(faces)
        challenge_face_rows: list[Any] = []
        if challenge_frames:
            for frame in challenge_frames:
                challenge_image, _ = cls.decode_image(frame)
                challenge_faces = cls.detect_faces(challenge_image)
                if challenge_faces.shape[0] > 0:
                    challenge_face_rows.append(cls._select_primary_face(challenge_faces))
        attention = cls._estimate_attention(primary_face)
        liveness, warnings = cls._estimate_liveness(image, primary_face, challenge_face_rows)
        quality = cls._estimate_quality(image, primary_face)
        return FaceFrameAnalysis(
            embedding=cls._extract_embedding(image, primary_face),
            face_count=int(faces.shape[0]),
            attention_score=attention,
            liveness_score=liveness,
            quality_score=quality,
            warnings=warnings,
            bbox=cls._face_bbox(primary_face),
            landmarks=cls._landmarks(primary_face),
        )
