from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.users.views import CurrentTenantView, LogoutView, MeView, SiteListView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/logout/", LogoutView.as_view(), name="logout"),
    path("api/auth/me/", MeView.as_view(), name="me"),
    path("api/tenants/current/", CurrentTenantView.as_view(), name="current_tenant"),
    path("api/sites/", SiteListView.as_view(), name="sites"),
    path("api/", include("apps.courses.urls")),
    path("api/", include("apps.assessments.urls")),
    path("api/", include("apps.monitoring.urls")),
    path("api/", include("apps.analytics.urls")),
    path("api/", include("apps.certificates.urls")),
]
