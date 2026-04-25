from django.http import JsonResponse

from apps.common.models import Tenant
from apps.common.tenancy import set_current_tenant_id


class TenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        tenant = self._resolve_tenant(request)
        if tenant:
            request.tenant = tenant
            set_current_tenant_id(str(tenant.id))
        elif request.path.startswith("/api/") and request.path not in {
            "/api/auth/token/",
            "/api/auth/token/refresh/",
        }:
            return JsonResponse({"detail": "Tenant context is required."}, status=400)

        response = self.get_response(request)
        set_current_tenant_id(None)
        return response

    def _resolve_tenant(self, request):
        header_tenant = request.headers.get("X-Tenant-ID")
        if header_tenant:
            return Tenant.objects.filter(id=header_tenant, is_active=True).first()
        hostname = request.get_host().split(":")[0]
        subdomain = hostname.split(".")[0] if "." in hostname else None
        if subdomain and subdomain not in {"localhost", "127"}:
            return Tenant.objects.filter(subdomain=subdomain, is_active=True).first()
        return None
