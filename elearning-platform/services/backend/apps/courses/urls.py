from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.courses.views import CourseViewSet, MyEnrollmentsView, ProgressCheckpointViewSet


router = DefaultRouter()
router.register("courses", CourseViewSet, basename="course")
router.register("progress/checkpoints", ProgressCheckpointViewSet, basename="progress-checkpoint")

urlpatterns = [
    path("", include(router.urls)),
    path("enrollments/me/", MyEnrollmentsView.as_view(), name="my-enrollments"),
]
