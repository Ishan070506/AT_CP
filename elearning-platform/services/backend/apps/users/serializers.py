from rest_framework import serializers

from apps.common.models import Site, Tenant
from apps.users.models import UserAccount


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ("id", "name", "slug", "logo_url", "primary_color", "accent_color", "theme_tokens")


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = ("id", "name", "code", "domain")


class UserSerializer(serializers.ModelSerializer):
    tenant = TenantSerializer(read_only=True)
    site = SiteSerializer(read_only=True)

    class Meta:
        model = UserAccount
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "employee_code",
            "must_capture_master_face",
            "tenant",
            "site",
        )
