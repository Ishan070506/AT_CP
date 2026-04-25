from django.urls import path

from apps.assessments.views import AdaptiveAssessmentAnswerView, AdaptiveAssessmentStartView, FinalAssessmentStartView, LeaderboardView


urlpatterns = [
    path("assessments/adaptive/start/", AdaptiveAssessmentStartView.as_view(), name="adaptive-start"),
    path("assessments/adaptive/answer/", AdaptiveAssessmentAnswerView.as_view(), name="adaptive-answer"),
    path("assessments/final/start/", FinalAssessmentStartView.as_view(), name="final-start"),
    path("leaderboard/", LeaderboardView.as_view(), name="leaderboard"),
]
