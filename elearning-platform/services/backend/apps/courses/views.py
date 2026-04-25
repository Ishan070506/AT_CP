from django.db.models import Q
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.permissions import RequiresTenantPermission
from apps.courses.models import Course, Enrollment, LearningUnit
from apps.courses.serializers import CourseCatalogSerializer, EnrollmentSerializer, ProgressCheckpointSerializer
from apps.courses.services import LearningPathService, ProgressService


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticated, RequiresTenantPermission]
    required_permission = "courses.view_catalog"
    serializer_class = CourseCatalogSerializer

    def get_queryset(self):
        queryset = Course.objects.filter(tenant=self.request.tenant, is_published=True).prefetch_related("modules__units")
        if getattr(self.request.user, "site_id", None):
            queryset = queryset.filter(Q(sites=self.request.user.site_id) | Q(sites__isnull=True))
        return queryset.distinct()

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def enroll(self, request, pk=None):
        course = self.get_object()
        enrollment = LearningPathService.enroll(tenant=request.tenant, user=request.user, course=course)
        return Response(EnrollmentSerializer(enrollment).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def learning_path(self, request, pk=None):
        course = self.get_object()
        enrollment = Enrollment.objects.get(tenant=request.tenant, course=course, user=request.user)
        payload = LearningPathService.build_path(enrollment=enrollment)
        return Response(payload)


class ProgressCheckpointViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProgressCheckpointSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        enrollment = Enrollment.objects.get(id=serializer.validated_data["enrollment"].id, tenant=request.tenant, user=request.user)
        unit = LearningUnit.objects.get(id=serializer.validated_data["unit"].id, tenant=request.tenant)
        checkpoint = ProgressService.save_checkpoint(
            tenant=request.tenant,
            enrollment=enrollment,
            unit=unit,
            payload=serializer.validated_data,
        )
        return Response(self.get_serializer(checkpoint).data, status=status.HTTP_201_CREATED)


class MyEnrollmentsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        enrollments = Enrollment.objects.filter(tenant=request.tenant, user=request.user).select_related("course", "last_resume_unit")
        return Response(EnrollmentSerializer(enrollments, many=True).data)
