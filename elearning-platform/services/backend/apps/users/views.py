from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.common.models import Site
from apps.users.serializers import SiteSerializer, TenantSerializer, UserSerializer


class MeView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class CurrentTenantView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(TenantSerializer(request.tenant).data)


class SiteListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SiteSerializer

    def get_queryset(self):
        return Site.objects.filter(tenant=self.request.tenant, is_active=True)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response(status=status.HTTP_204_NO_CONTENT)
