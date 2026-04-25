from django.conf import settings
from django.db import models

from apps.common.models import Site, TenantOwnedModel


class Course(TenantOwnedModel):
    title = models.CharField(max_length=255)
    slug = models.SlugField()
    summary = models.TextField()
    description = models.TextField(blank=True)
    hero_image_key = models.CharField(max_length=512, blank=True)
    thumbnail_key = models.CharField(max_length=512, blank=True)
    duration_minutes = models.PositiveIntegerField(default=0)
    difficulty = models.CharField(max_length=32, default="intermediate")
    language = models.CharField(max_length=32, default="en")
    is_published = models.BooleanField(default=False)
    validity_days = models.PositiveIntegerField(default=365)
    low_bandwidth_enabled = models.BooleanField(default=True)
    sites = models.ManyToManyField(Site, blank=True, related_name="courses")

    class Meta:
        unique_together = ("tenant", "slug")


class CourseModule(TenantOwnedModel):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="modules")
    title = models.CharField(max_length=255)
    sequence = models.PositiveIntegerField()
    summary = models.TextField(blank=True)
    drip_unlock_days = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("tenant", "course", "sequence")
        ordering = ("sequence",)


class LearningUnit(TenantOwnedModel):
    VIDEO = "video"
    SLIDES = "slides"
    DOCUMENT = "document"
    KIND_CHOICES = ((VIDEO, "Video"), (SLIDES, "Slides"), (DOCUMENT, "Document"))

    module = models.ForeignKey(CourseModule, on_delete=models.CASCADE, related_name="units")
    title = models.CharField(max_length=255)
    sequence = models.PositiveIntegerField()
    kind = models.CharField(max_length=16, choices=KIND_CHOICES, default=VIDEO)
    asset_key = models.CharField(max_length=512)
    duration_seconds = models.PositiveIntegerField(default=0)
    slide_count = models.PositiveIntegerField(default=0)
    interrupt_quiz_at_second = models.PositiveIntegerField(default=0)
    prerequisite_unit = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True, related_name="unlocks")
    is_previewable = models.BooleanField(default=False)

    class Meta:
        unique_together = ("tenant", "module", "sequence")
        ordering = ("sequence",)


class ModulePrerequisite(TenantOwnedModel):
    module = models.ForeignKey(CourseModule, on_delete=models.CASCADE, related_name="prerequisites")
    prerequisite = models.ForeignKey(CourseModule, on_delete=models.CASCADE, related_name="required_for")

    class Meta:
        unique_together = ("tenant", "module", "prerequisite")


class Enrollment(TenantOwnedModel):
    ACTIVE = "active"
    COMPLETED = "completed"
    EXPIRED = "expired"
    PENDING_REVIEW = "pending_review"
    STATUS_CHOICES = (
        (ACTIVE, "Active"),
        (COMPLETED, "Completed"),
        (EXPIRED, "Expired"),
        (PENDING_REVIEW, "Pending review"),
    )

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="enrollments")
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default=ACTIVE)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    due_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    last_resume_unit = models.ForeignKey(LearningUnit, on_delete=models.SET_NULL, null=True, blank=True, related_name="+")
    last_resume_second = models.PositiveIntegerField(default=0)
    last_resume_slide = models.PositiveIntegerField(default=0)
    progress_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    requires_admin_review = models.BooleanField(default=False)

    class Meta:
        unique_together = ("tenant", "course", "user")


class ProgressCheckpoint(TenantOwnedModel):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name="checkpoints")
    unit = models.ForeignKey(LearningUnit, on_delete=models.CASCADE, related_name="checkpoints")
    last_watched_second = models.PositiveIntegerField(default=0)
    last_slide_index = models.PositiveIntegerField(default=0)
    completion_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    attention_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    checkpointed_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("tenant", "enrollment", "unit")
