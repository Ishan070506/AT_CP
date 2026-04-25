import uuid

from django.conf import settings
from django.db import models

from apps.common.tenancy import get_current_tenant_id


class UUIDModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Tenant(UUIDModel, TimestampedModel):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    subdomain = models.SlugField(unique=True)
    logo_url = models.URLField(blank=True)
    primary_color = models.CharField(max_length=32, default="#0F766E")
    accent_color = models.CharField(max_length=32, default="#F97316")
    support_email = models.EmailField(blank=True)
    theme_tokens = models.JSONField(default=dict, blank=True)
    storage_prefix = models.CharField(max_length=255, default="")
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name


class Site(UUIDModel, TimestampedModel):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="sites")
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=64)
    domain = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ("tenant", "code")

    def __str__(self) -> str:
        return f"{self.tenant.slug}:{self.code}"


class TenantScopedQuerySet(models.QuerySet):
    def for_current_tenant(self):
        tenant_id = get_current_tenant_id()
        return self.filter(tenant_id=tenant_id) if tenant_id else self.none()


class TenantOwnedModel(UUIDModel, TimestampedModel):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)

    objects = TenantScopedQuerySet.as_manager()

    class Meta:
        abstract = True


class PermissionDefinition(TenantOwnedModel):
    slug = models.CharField(max_length=128)
    resource = models.CharField(max_length=128)
    action = models.CharField(max_length=128)
    description = models.TextField(blank=True)

    class Meta:
        unique_together = ("tenant", "slug")


class AccessPolicy(TenantOwnedModel):
    name = models.CharField(max_length=128)
    description = models.TextField(blank=True)

    class Meta:
        unique_together = ("tenant", "name")


class PolicyPermission(UUIDModel):
    policy = models.ForeignKey(AccessPolicy, on_delete=models.CASCADE, related_name="policy_permissions")
    permission = models.ForeignKey(PermissionDefinition, on_delete=models.CASCADE, related_name="permission_policies")

    class Meta:
        unique_together = ("policy", "permission")


class UserPolicyAssignment(UUIDModel, TimestampedModel):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="policy_assignments")
    policy = models.ForeignKey(AccessPolicy, on_delete=models.CASCADE, related_name="user_assignments")

    class Meta:
        unique_together = ("tenant", "user", "policy")
