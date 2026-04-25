from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.monitoring.views import AttentionEventView, IntegrityAlertViewSet, MasterFaceUploadView, VerifyFaceView


router = DefaultRouter()
router.register("monitoring/alerts", IntegrityAlertViewSet, basename="monitoring-alert")

urlpatterns = [
    path("monitoring/master-face/", MasterFaceUploadView.as_view(), name="master-face"),
    path("monitoring/verify/", VerifyFaceView.as_view(), name="verify-face"),
    path("monitoring/attention/", AttentionEventView.as_view(), name="attention"),
    path("", include(router.urls)),
]
