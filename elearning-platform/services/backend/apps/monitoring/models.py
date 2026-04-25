import uuid

from django.conf import settings
from django.contrib.gis.db import models as gis_models
from django.db import models

from apps.common.models import TenantOwnedModel
from apps.courses.models import Course, Enrollment, LearningUnit


class FaceProfile(TenantOwnedModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="face_profile")
    master_image_key = models.CharField(max_length=512)
    encrypted_embedding = models.TextField()
    capture_device = models.CharField(max_length=128, blank=True)
    is_active = models.BooleanField(default=True)


class FaceVerificationLog(TenantOwnedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="face_logs")
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name="face_logs")
    unit = models.ForeignKey(LearningUnit, on_delete=models.SET_NULL, null=True, blank=True, related_name="face_logs")
    enrollment = models.ForeignKey(Enrollment, on_delete=models.SET_NULL, null=True, blank=True, related_name="face_logs")
    source = models.CharField(max_length=64, default="web")
    similarity_score = models.DecimalField(max_digits=5, decimal_places=4, default=0)
    liveness_score = models.DecimalField(max_digits=5, decimal_places=4, default=0)
    attention_score = models.DecimalField(max_digits=5, decimal_places=4, default=0)
    face_count = models.PositiveIntegerField(default=1)
    matched = models.BooleanField(default=False)
    is_spoof_suspected = models.BooleanField(default=False)
    metadata = models.JSONField(default=dict, blank=True)
    origin_point = gis_models.PointField(null=True, blank=True, geography=True)


class IntegrityAlert(TenantOwnedModel):
    OPEN = "open"
    REVIEWED = "reviewed"
    STATUS_CHOICES = ((OPEN, "Open"), (REVIEWED, "Reviewed"))

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"
    SEVERITY_CHOICES = ((LOW, "Low"), (MEDIUM, "Medium"), (HIGH, "High"), (CRITICAL, "Critical"))

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="integrity_alerts")
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name="integrity_alerts")
    enrollment = models.ForeignKey(Enrollment, on_delete=models.SET_NULL, null=True, blank=True, related_name="integrity_alerts")
    verification_log = models.ForeignKey(FaceVerificationLog, on_delete=models.CASCADE, related_name="alerts")
    reason = models.CharField(max_length=128)
    severity = models.CharField(max_length=16, choices=SEVERITY_CHOICES, default=MEDIUM)
    confidence_score = models.DecimalField(max_digits=5, decimal_places=4, default=0)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=OPEN)
    resolution_notes = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="reviewed_integrity_alerts")
    reviewed_at = models.DateTimeField(null=True, blank=True)


class AttentionSample(TenantOwnedModel):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name="attention_samples")
    unit = models.ForeignKey(LearningUnit, on_delete=models.CASCADE, related_name="attention_samples")
    attention_score = models.DecimalField(max_digits=5, decimal_places=4)
    looked_away_seconds = models.PositiveIntegerField(default=0)
    face_count = models.PositiveIntegerField(default=1)
