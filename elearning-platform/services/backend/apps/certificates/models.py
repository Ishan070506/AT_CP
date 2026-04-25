from django.conf import settings
from django.db import models

from apps.common.models import TenantOwnedModel
from apps.courses.models import Enrollment


class Certificate(TenantOwnedModel):
    enrollment = models.OneToOneField(Enrollment, on_delete=models.CASCADE, related_name="certificate")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="certificates")
    certificate_number = models.CharField(max_length=64)
    object_key = models.CharField(max_length=512)
    sha256_digest = models.CharField(max_length=64)
    issued_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("tenant", "certificate_number")
