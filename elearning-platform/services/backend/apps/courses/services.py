from datetime import timedelta

from django.db import transaction
from django.utils import timezone

from apps.courses.models import Course, Enrollment, LearningUnit, ModulePrerequisite, ProgressCheckpoint


class LearningPathService:
    @staticmethod
    def enroll(*, tenant, user, course: Course) -> Enrollment:
        enrollment, _ = Enrollment.objects.get_or_create(
            tenant=tenant,
            user=user,
            course=course,
            defaults={
                "due_at": timezone.now() + timedelta(days=course.validity_days),
                "expires_at": timezone.now() + timedelta(days=course.validity_days),
            },
        )
        return enrollment

    @staticmethod
    def build_path(*, enrollment: Enrollment) -> list[dict]:
        modules = []
        completed_unit_ids = set(
            enrollment.checkpoints.filter(completion_percent__gte=100).values_list("unit_id", flat=True)
        )
        completed_module_ids = set()
        for module in enrollment.course.modules.all().prefetch_related("units"):
            module_unit_ids = list(module.units.values_list("id", flat=True))
            if module_unit_ids and all(unit_id in completed_unit_ids for unit_id in module_unit_ids):
                completed_module_ids.add(module.id)
        for module in enrollment.course.modules.all().prefetch_related("units", "prerequisites"):
            drip_locked = timezone.now() < enrollment.enrolled_at + timedelta(days=module.drip_unlock_days)
            prereq_locked = ModulePrerequisite.objects.filter(
                module=module,
                tenant=enrollment.tenant,
            ).exclude(prerequisite_id__in=completed_module_ids).exists()
            unit_payload = []
            for unit in module.units.all():
                unit_locked = drip_locked or prereq_locked
                if unit.prerequisite_unit_id and unit.prerequisite_unit_id not in completed_unit_ids:
                    unit_locked = True
                unit_payload.append(
                    {
                        "id": unit.id,
                        "title": unit.title,
                        "sequence": unit.sequence,
                        "kind": unit.kind,
                        "asset_key": unit.asset_key,
                        "duration_seconds": unit.duration_seconds,
                        "slide_count": unit.slide_count,
                        "interrupt_quiz_at_second": unit.interrupt_quiz_at_second,
                        "locked": unit_locked,
                        "unlock_reason": "Drip schedule or prerequisite unmet" if unit_locked else "Available",
                    }
                )
            modules.append(
                {
                    "id": module.id,
                    "title": module.title,
                    "sequence": module.sequence,
                    "summary": module.summary,
                    "drip_unlock_days": module.drip_unlock_days,
                    "units": unit_payload,
                }
            )
        return modules


class ProgressService:
    @staticmethod
    @transaction.atomic
    def save_checkpoint(*, tenant, enrollment: Enrollment, unit: LearningUnit, payload: dict) -> ProgressCheckpoint:
        checkpoint, _ = ProgressCheckpoint.objects.update_or_create(
            tenant=tenant,
            enrollment=enrollment,
            unit=unit,
            defaults={
                "last_watched_second": payload.get("last_watched_second", 0),
                "last_slide_index": payload.get("last_slide_index", 0),
                "completion_percent": payload.get("completion_percent", 0),
                "attention_score": payload.get("attention_score", 0),
            },
        )
        enrollment.last_resume_unit = unit
        enrollment.last_resume_second = checkpoint.last_watched_second
        enrollment.last_resume_slide = checkpoint.last_slide_index
        enrollment.progress_percent = max(
            checkpoint.completion_percent,
            enrollment.progress_percent,
        )
        enrollment.save(update_fields=["last_resume_unit", "last_resume_second", "last_resume_slide", "progress_percent", "updated_at"])
        return checkpoint
