from rest_framework import serializers

from apps.courses.models import Course, CourseModule, Enrollment, LearningUnit, ProgressCheckpoint


class LearningUnitSerializer(serializers.ModelSerializer):
    locked = serializers.BooleanField(read_only=True)
    unlock_reason = serializers.CharField(read_only=True)

    class Meta:
        model = LearningUnit
        fields = (
            "id",
            "title",
            "sequence",
            "kind",
            "asset_key",
            "duration_seconds",
            "slide_count",
            "interrupt_quiz_at_second",
            "locked",
            "unlock_reason",
        )


class CourseModuleSerializer(serializers.ModelSerializer):
    units = LearningUnitSerializer(many=True, read_only=True)

    class Meta:
        model = CourseModule
        fields = ("id", "title", "sequence", "summary", "drip_unlock_days", "units")


class CourseCatalogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = (
            "id",
            "title",
            "slug",
            "summary",
            "duration_minutes",
            "difficulty",
            "hero_image_key",
            "thumbnail_key",
            "low_bandwidth_enabled",
        )


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseCatalogSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = (
            "id",
            "course",
            "status",
            "enrolled_at",
            "due_at",
            "completed_at",
            "expires_at",
            "last_resume_unit",
            "last_resume_second",
            "last_resume_slide",
            "progress_percent",
            "requires_admin_review",
        )


class ProgressCheckpointSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressCheckpoint
        fields = (
            "id",
            "enrollment",
            "unit",
            "last_watched_second",
            "last_slide_index",
            "completion_percent",
            "attention_score",
        )
