from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.analytics.services import DashboardAnalyticsService


class DashboardAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(DashboardAnalyticsService.tenant_dashboard(tenant=request.tenant))


class DropoffAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(DashboardAnalyticsService.dropoff_report(tenant=request.tenant))
