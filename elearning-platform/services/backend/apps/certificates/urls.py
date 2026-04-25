from django.urls import path

from apps.certificates.views import GenerateCertificateView, MyCertificatesView


urlpatterns = [
    path("certificates/<uuid:enrollment_id>/generate/", GenerateCertificateView.as_view(), name="generate-certificate"),
    path("certificates/me/", MyCertificatesView.as_view(), name="my-certificates"),
]
