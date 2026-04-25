from rest_framework import serializers

from apps.monitoring.models import FaceProfile, FaceVerificationLog, IntegrityAlert


class MasterFaceSerializer(serializers.Serializer):
    image_key = serializers.CharField(required=False, allow_blank=True)
    image_base64 = serializers.CharField(required=False)
    embedding = serializers.ListField(child=serializers.FloatField(), min_length=32, required=False)
    capture_device = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        if not attrs.get("image_base64") and not attrs.get("embedding"):
            raise serializers.ValidationError("Provide either image_base64 or embedding.")
        return attrs


class FaceVerificationSerializer(serializers.Serializer):
    course_id = serializers.UUIDField(required=False)
    enrollment_id = serializers.UUIDField(required=False)
    unit_id = serializers.UUIDField(required=False)
    source = serializers.CharField(default="web")
    image_base64 = serializers.CharField(required=False)
    challenge_frames = serializers.ListField(child=serializers.CharField(), required=False, allow_empty=True)
    embedding = serializers.ListField(child=serializers.FloatField(), min_length=32, required=False)
    face_count = serializers.IntegerField(min_value=0, default=1, required=False)
    liveness_score = serializers.FloatField(min_value=0, max_value=1, required=False)
    attention_score = serializers.FloatField(min_value=0, max_value=1, required=False)
    latitude = serializers.FloatField(required=False)
    longitude = serializers.FloatField(required=False)

    def validate(self, attrs):
        if not attrs.get("image_base64") and not attrs.get("embedding"):
            raise serializers.ValidationError("Provide either image_base64 or embedding.")
        return attrs


class FaceProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FaceProfile
        fields = ("id", "master_image_key", "capture_device", "created_at")


class FaceVerificationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = FaceVerificationLog
        fields = (
            "id",
            "course",
            "unit",
            "source",
            "similarity_score",
            "liveness_score",
            "attention_score",
            "face_count",
            "matched",
            "is_spoof_suspected",
            "metadata",
            "created_at",
        )


class IntegrityAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntegrityAlert
        fields = (
            "id",
            "user",
            "course",
            "enrollment",
            "reason",
            "severity",
            "confidence_score",
            "status",
            "resolution_notes",
            "reviewed_by",
            "reviewed_at",
            "created_at",
        )
