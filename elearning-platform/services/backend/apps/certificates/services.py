from hashlib import sha256
from io import BytesIO

from django.conf import settings
from django.utils import timezone
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from apps.certificates.models import Certificate
from apps.common.storage import get_s3_client


class CertificateService:
    @staticmethod
    def _render_pdf(enrollment) -> bytes:
        buffer = BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=A4)
        pdf.setTitle("Course Certificate")
        pdf.setFont("Helvetica-Bold", 24)
        pdf.drawCentredString(300, 760, "Certificate of Completion")
        pdf.setFont("Helvetica", 14)
        pdf.drawCentredString(300, 710, f"This certifies {enrollment.user.get_full_name() or enrollment.user.email}")
        pdf.drawCentredString(300, 680, f"completed {enrollment.course.title}")
        pdf.drawCentredString(300, 650, timezone.now().strftime("%Y-%m-%d"))
        pdf.showPage()
        pdf.save()
        return buffer.getvalue()

    @staticmethod
    def generate(*, tenant, enrollment):
        pdf_bytes = CertificateService._render_pdf(enrollment)
        digest = sha256(pdf_bytes).hexdigest()
        object_key = f"{tenant.storage_prefix or tenant.slug}/certificates/{enrollment.id}.pdf"
        client = get_s3_client()
        client.put_object(
            Bucket=settings.S3_BUCKET,
            Key=object_key,
            Body=pdf_bytes,
            ContentType="application/pdf",
        )
        certificate, _ = Certificate.objects.update_or_create(
            tenant=tenant,
            enrollment=enrollment,
            defaults={
                "user": enrollment.user,
                "certificate_number": digest[:16].upper(),
                "object_key": object_key,
                "sha256_digest": digest,
                "expires_at": enrollment.expires_at,
            },
        )
        return certificate
