from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.certificates.models import Certificate
from apps.certificates.services import CertificateService
from apps.courses.models import Enrollment


class GenerateCertificateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, enrollment_id):
        enrollment = Enrollment.objects.get(id=enrollment_id, tenant=request.tenant)
        certificate = CertificateService.generate(tenant=request.tenant, enrollment=enrollment)
        return Response(
            {
                "id": certificate.id,
                "certificate_number": certificate.certificate_number,
                "object_key": certificate.object_key,
            },
            status=status.HTTP_201_CREATED,
        )


class MyCertificatesView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        certificates = Certificate.objects.filter(tenant=request.tenant, user=request.user)
        payload = [
            {
                "id": item.id,
                "certificate_number": item.certificate_number,
                "object_key": item.object_key,
                "issued_at": item.issued_at,
                "expires_at": item.expires_at,
            }
            for item in certificates
        ]
        return Response(payload)
