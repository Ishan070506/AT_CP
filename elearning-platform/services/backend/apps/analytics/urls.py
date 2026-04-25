from django.urls import path

from apps.analytics.views import DashboardAnalyticsView, DropoffAnalyticsView


urlpatterns = [
    path("analytics/dashboard/", DashboardAnalyticsView.as_view(), name="analytics-dashboard"),
    path("analytics/dropoff/", DropoffAnalyticsView.as_view(), name="analytics-dropoff"),
]
