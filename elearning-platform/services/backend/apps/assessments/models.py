from django.conf import settings
from django.db import models

from apps.common.models import TenantOwnedModel
from apps.courses.models import Course, Enrollment, LearningUnit


class QuestionBankItem(TenantOwnedModel):
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    QUESTION_TYPES = (
        (MULTIPLE_CHOICE, "Multiple choice"),
        (TRUE_FALSE, "True/False"),
    )

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="question_bank")
    remediation_unit = models.ForeignKey(LearningUnit, on_delete=models.SET_NULL, null=True, blank=True, related_name="remediation_questions")
    prompt = models.TextField()
    question_type = models.CharField(max_length=32, choices=QUESTION_TYPES, default=MULTIPLE_CHOICE)
    options = models.JSONField(default=list, blank=True)
    correct_answer = models.JSONField(default=dict)
    explanation = models.TextField(blank=True)
    difficulty = models.PositiveSmallIntegerField(default=3)
    is_final_exam_eligible = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)


class AssessmentAttempt(TenantOwnedModel):
    ADAPTIVE = "adaptive"
    FINAL = "final"
    ATTEMPT_TYPES = ((ADAPTIVE, "Adaptive"), (FINAL, "Final"))

    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    STATE_CHOICES = ((IN_PROGRESS, "In progress"), (COMPLETED, "Completed"))

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="assessment_attempts")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="assessment_attempts")
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name="assessment_attempts")
    attempt_type = models.CharField(max_length=32, choices=ATTEMPT_TYPES)
    state = models.CharField(max_length=32, choices=STATE_CHOICES, default=IN_PROGRESS)
    current_difficulty = models.PositiveSmallIntegerField(default=3)
    target_question_count = models.PositiveSmallIntegerField(default=5)
    current_index = models.PositiveSmallIntegerField(default=0)
    question_order = models.JSONField(default=list, blank=True)
    score = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    max_score = models.DecimalField(max_digits=6, decimal_places=2, default=0)


class AssessmentResponse(TenantOwnedModel):
    attempt = models.ForeignKey(AssessmentAttempt, on_delete=models.CASCADE, related_name="responses")
    question = models.ForeignKey(QuestionBankItem, on_delete=models.CASCADE, related_name="responses")
    submitted_answer = models.JSONField(default=dict)
    is_correct = models.BooleanField(default=False)
    awarded_points = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    remediation_unit = models.ForeignKey(LearningUnit, on_delete=models.SET_NULL, null=True, blank=True, related_name="assessment_responses")
    answered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("attempt", "question")
