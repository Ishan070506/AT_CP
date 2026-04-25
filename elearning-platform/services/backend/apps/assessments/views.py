from django.db.models import Sum
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.assessments.models import AssessmentAttempt, QuestionBankItem
from apps.assessments.serializers import (
    AdaptiveAnswerSerializer,
    AdaptiveStartSerializer,
    AssessmentAttemptSerializer,
    QuestionBankItemSerializer,
)
from apps.assessments.services import AdaptiveQuizEngine
from apps.courses.models import Course, Enrollment


class AdaptiveAssessmentStartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AdaptiveStartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        course = Course.objects.get(id=serializer.validated_data["course_id"], tenant=request.tenant)
        enrollment = Enrollment.objects.get(course=course, user=request.user, tenant=request.tenant)
        attempt, question = AdaptiveQuizEngine.start_adaptive_attempt(
            tenant=request.tenant,
            user=request.user,
            course=course,
            enrollment=enrollment,
            question_count=serializer.validated_data["question_count"],
        )
        return Response(
            {
                "attempt": AssessmentAttemptSerializer(attempt).data,
                "question": QuestionBankItemSerializer(question).data if question else None,
            },
            status=status.HTTP_201_CREATED,
        )


class AdaptiveAssessmentAnswerView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AdaptiveAnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        attempt = AssessmentAttempt.objects.get(
            id=serializer.validated_data["attempt_id"],
            tenant=request.tenant,
            user=request.user,
        )
        question = QuestionBankItem.objects.get(id=serializer.validated_data["question_id"], tenant=request.tenant)
        response_record, next_question = AdaptiveQuizEngine.submit_answer(
            tenant=request.tenant,
            attempt=attempt,
            question=question,
            submitted_answer=serializer.validated_data["submitted_answer"],
        )
        return Response(
            {
                "is_correct": response_record.is_correct,
                "score": attempt.score,
                "next_question": QuestionBankItemSerializer(next_question).data if next_question else None,
                "suggested_revision": response_record.remediation_unit_id,
                "state": attempt.state,
            }
        )


class FinalAssessmentStartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AdaptiveStartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        course = Course.objects.get(id=serializer.validated_data["course_id"], tenant=request.tenant)
        enrollment = Enrollment.objects.get(course=course, user=request.user, tenant=request.tenant)
        attempt, question = AdaptiveQuizEngine.start_final_exam(
            tenant=request.tenant,
            user=request.user,
            course=course,
            enrollment=enrollment,
            question_count=serializer.validated_data["question_count"],
        )
        return Response(
            {
                "attempt": AssessmentAttemptSerializer(attempt).data,
                "question": QuestionBankItemSerializer(question).data if question else None,
            },
            status=status.HTTP_201_CREATED,
        )


class LeaderboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        course_id = request.query_params.get("course_id")
        attempts = AssessmentAttempt.objects.filter(tenant=request.tenant, state=AssessmentAttempt.COMPLETED)
        if course_id:
            attempts = attempts.filter(course_id=course_id)
        ranking = (
            attempts.values("user__id", "user__first_name", "user__last_name")
            .annotate(total_score=Sum("score"))
            .order_by("-total_score")[:20]
        )
        return Response(list(ranking))
