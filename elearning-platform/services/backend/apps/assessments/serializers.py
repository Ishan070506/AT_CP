from rest_framework import serializers

from apps.assessments.models import AssessmentAttempt, AssessmentResponse, QuestionBankItem


class QuestionBankItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionBankItem
        fields = ("id", "prompt", "question_type", "options", "difficulty", "remediation_unit")


class AdaptiveStartSerializer(serializers.Serializer):
    course_id = serializers.UUIDField()
    question_count = serializers.IntegerField(required=False, min_value=3, max_value=20, default=5)


class AdaptiveAnswerSerializer(serializers.Serializer):
    attempt_id = serializers.UUIDField()
    question_id = serializers.UUIDField()
    submitted_answer = serializers.JSONField()


class AssessmentAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentAttempt
        fields = (
            "id",
            "attempt_type",
            "state",
            "current_difficulty",
            "target_question_count",
            "current_index",
            "question_order",
            "score",
            "max_score",
        )


class AssessmentResponseSerializer(serializers.ModelSerializer):
    question = QuestionBankItemSerializer(read_only=True)

    class Meta:
        model = AssessmentResponse
        fields = ("id", "question", "submitted_answer", "is_correct", "awarded_points", "remediation_unit", "answered_at")
