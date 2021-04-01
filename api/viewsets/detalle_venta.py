import json

from django.core.files import File
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, filters, viewsets
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.settings import api_settings

from django.db import transaction, models
from api.models import DetalleVenta
from api.serializers import DetalleVentaRegisterSerializer, DetalleVentaSerializer


class DetalleVentaViewset(viewsets.ModelViewSet):
    queryset = DetalleVenta.objects.filter(activo=True)

    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filter_fields = ("venta__nit",)
    search_fields = ("venta__nit",)
    ordering_fields = ("venta__nit",)

    def get_serializer_class(self):
        """Define serializer for API"""
        if self.action == 'list' or self.action == 'retrieve':
            return DetalleVentaSerializer
        else:
            return DetalleVentaRegisterSerializer

    def get_permissions(self):
        permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]    
