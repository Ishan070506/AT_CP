import random

from django.db import transaction

from apps.assessments.models import AssessmentAttempt, AssessmentResponse, QuestionBankItem
from apps.courses.models import Course, Enrollment


class AdaptiveQuizEngine:
    @staticmethod
    def _question_queryset(*, tenant, course: Course, answered_ids: list[str], difficulty: int):
        queryset = QuestionBankItem.objects.filter(
            tenant=tenant,
            course=course,
            is_active=True,
            difficulty=difficulty,
        )
        if answered_ids:
            queryset = queryset.exclude(id__in=answered_ids)
        return queryset

    @staticmethod
    def _pick_question(*, tenant, course: Course, answered_ids: list[str], difficulty: int):
        question = AdaptiveQuizEngine._question_queryset(
            tenant=tenant,
            course=course,
            answered_ids=answered_ids,
            difficulty=difficulty,
        ).order_by("?").first()
        if question:
            return question
        return QuestionBankItem.objects.filter(tenant=tenant, course=course, is_active=True).exclude(id__in=answered_ids).order_by("?").first()

    @staticmethod
    def _is_correct(question: QuestionBankItem, submitted_answer) -> bool:
        expected = question.correct_answer
        return submitted_answer == expected

    @staticmethod
    @transaction.atomic
    def start_adaptive_attempt(*, tenant, user, course: Course, enrollment: Enrollment, question_count: int) -> tuple[AssessmentAttempt, QuestionBankItem]:
        attempt = AssessmentAttempt.objects.create(
            tenant=tenant,
            user=user,
            course=course,
            enrollment=enrollment,
            attempt_type=AssessmentAttempt.ADAPTIVE,
            target_question_count=question_count,
            max_score=question_count,
        )
        first_question = AdaptiveQuizEngine._pick_question(
            tenant=tenant,
            course=course,
            answered_ids=[],
            difficulty=attempt.current_difficulty,
        )
        attempt.question_order = [str(first_question.id)] if first_question else []
        attempt.save(update_fields=["question_order"])
        return attempt, first_question

    @staticmethod
    @transaction.atomic
    def submit_answer(*, tenant, attempt: AssessmentAttempt, question: QuestionBankItem, submitted_answer):
        is_correct = AdaptiveQuizEngine._is_correct(question, submitted_answer)
        response, _ = AssessmentResponse.objects.update_or_create(
            tenant=tenant,
            attempt=attempt,
            question=question,
            defaults={
                "submitted_answer": submitted_answer,
                "is_correct": is_correct,
                "awarded_points": 1 if is_correct else 0,
                "remediation_unit": question.remediation_unit,
            },
        )
        attempt.score = sum(item.awarded_points for item in attempt.responses.all())
        attempt.current_index = attempt.responses.count()
        next_difficulty = max(1, min(5, attempt.current_difficulty + (1 if is_correct else -1)))
        attempt.current_difficulty = next_difficulty
        answered_ids = [str(item.question_id) for item in attempt.responses.select_related("question")]
        next_question = None
        if attempt.current_index < attempt.target_question_count:
            next_question = AdaptiveQuizEngine._pick_question(
                tenant=tenant,
                course=attempt.course,
                answered_ids=answered_ids,
                difficulty=next_difficulty,
            )
            if next_question:
                attempt.question_order = [*attempt.question_order, str(next_question.id)]
        else:
            attempt.state = AssessmentAttempt.COMPLETED
        attempt.save(update_fields=["score", "current_index", "current_difficulty", "question_order", "state"])
        return response, next_question

    @staticmethod
    def start_final_exam(*, tenant, user, course: Course, enrollment: Enrollment, question_count: int = 20):
        pool = list(
            QuestionBankItem.objects.filter(
                tenant=tenant,
                course=course,
                is_active=True,
                is_final_exam_eligible=True,
            )[:100]
        )
        random.shuffle(pool)
        question_ids = [str(question.id) for question in pool[:question_count]]
        attempt = AssessmentAttempt.objects.create(
            tenant=tenant,
            user=user,
            course=course,
            enrollment=enrollment,
            attempt_type=AssessmentAttempt.FINAL,
            target_question_count=min(question_count, len(question_ids)),
            question_order=question_ids,
            max_score=min(question_count, len(question_ids)),
        )
        first_question = pool[0] if pool else None
        return attempt, first_question
