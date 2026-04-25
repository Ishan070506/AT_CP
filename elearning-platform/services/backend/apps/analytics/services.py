from datetime import timedelta

from django.db.models import Avg, Count, Q
from django.utils import timezone

from apps.courses.models import Enrollment, ProgressCheckpoint
from apps.monitoring.models import IntegrityAlert


class DashboardAnalyticsService:
    @staticmethod
    def tenant_dashboard(*, tenant) -> dict:
        now = timezone.now()
        active_enrollments = Enrollment.objects.filter(tenant=tenant, status=Enrollment.ACTIVE)
        checkpoints = ProgressCheckpoint.objects.filter(tenant=tenant)
        unresolved_alerts = IntegrityAlert.objects.filter(tenant=tenant, status=IntegrityAlert.OPEN)
        return {
            "active_learners": active_enrollments.values("user_id").distinct().count(),
            "active_enrollments": active_enrollments.count(),
            "avg_progress": checkpoints.aggregate(avg=Avg("completion_percent"))["avg"] or 0,
            "avg_attention": checkpoints.aggregate(avg=Avg("attention_score"))["avg"] or 0,
            "unresolved_alerts": unresolved_alerts.count(),
            "expiring_soon": Enrollment.objects.filter(
                tenant=tenant,
                expires_at__lte=now + timedelta(days=14),
                completed_at__isnull=False,
            ).count(),
            "flagged_for_review": Enrollment.objects.filter(tenant=tenant, requires_admin_review=True).count(),
        }

    @staticmethod
    def dropoff_report(*, tenant) -> list[dict]:
        rows = (
            ProgressCheckpoint.objects.filter(tenant=tenant, completion_percent__lt=100)
            .values("unit__id", "unit__title", "unit__module__course__title")
            .annotate(drop_count=Count("id"), avg_completion=Avg("completion_percent"))
            .order_by("-drop_count")[:20]
        )
        return list(rows)
