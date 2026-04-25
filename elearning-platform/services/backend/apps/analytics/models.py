from django.conf import settings
from django.db import models

from apps.common.models import TenantOwnedModel
from apps.courses.models import Course


class LearningAnalyticsSnapshot(TenantOwnedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="analytics_snapshots")
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name="analytics_snapshots")
    snapshot_date = models.DateField()
    learning_velocity = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    dropoff_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    average_attention = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    unresolved_alerts = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("tenant", "user", "course", "snapshot_date")
