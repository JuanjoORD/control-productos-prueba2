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
from api.models import Lote, Producto
from api.serializers import LoteRegisterSerializer, LoteSerializer, ProductoSerializer


class LoteViewset(viewsets.ModelViewSet):
    queryset = Lote.objects.filter(activo=True)

    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filter_fields = ("producto__nombre",)
    search_fields = ("producto__nombre",)
    ordering_fields = ("producto__nombre",)

    def get_serializer_class(self):
        """Define serializer for API"""
        if self.action == 'list' or self.action == 'retrieve':
            return LoteSerializer
        else:
            return LoteRegisterSerializer

    def get_permissions(self):
        permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    

    @action(methods=["post"], detail=False)
    def listByProduct(self, request):
        data = request.data
        try:
            user = request.user

            with transaction.atomic():
                queryset = Producto.objects.filter(
                    id=data.get("idProducto"),
                    activo=True
                ).prefetch_related(
                    'lote_producto'
                )

                producto = ProductoSerializer(queryset[0])
                activeLotes = queryset[0].lote_producto.filter(activo=True).order_by('fechaVencimiento')
                serializerLote = LoteSerializer(activeLotes, many=True)

                lotes = {
                    "count": queryset[0].lote_producto.count(),
                    "results": serializerLote.data
                }                

                return Response({"producto": producto.data, "lotes": lotes}, status=status.HTTP_200_OK)

            return Response({"detail": "Hubo un error al actualizar el producto"}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError as e:
            return Response({"detail": "{} is a required field".format(str(e))}, status=status.HTTP_400_BAD_REQUEST)
    

    def create(self, request):
        data = request.data
        user = request.user
        try:            
            with transaction.atomic():
                serializer = LoteSerializer(data)

                if serializer.is_valid:
                    try:
                        Lote.objects.get(numeroLote=data.get("numeroLote"), producto__profile=user.profile.id)
                        return Response(
                            {"detail": "Ya tiene un Lote con el mismo número."},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    except Lote.DoesNotExist:
                        pass

                    producto = Producto.objects.get(id=data.get("producto"))

                    loteNew = Lote.objects.create(
                        producto=producto,
                        cantidad=data.get("cantidad"),
                        fechaVencimiento=data.get("fechaVencimiento"),
                        numeroLote=data.get("numeroLote")
                    )

                    loteNew.save()
                    return Response({"detail": "Lote creado correctamente"}, status=status.HTTP_200_OK)
                else:                
                    return Response({"detail": "No envio todos los datos necesarios"}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"detail": "Hubo un error al crear el Lote"}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError as e:
            return Response({"detail": "{} is a required field".format(str(e))}, status=status.HTTP_400_BAD_REQUEST)
    

    def update(self, request, pk):
        data = request.data
        user = request.user
        try:
            with transaction.atomic():
                serializer = LoteSerializer(data)

                if serializer.is_valid and data.get("id") is not None:
                    lote = Lote.objects.get(
                        id=data.get("id"),
                        activo=True
                    )

                    if lote.numeroLote != data.get("numeroLote"):
                        try:
                            Lote.objects.get(numeroLote=data.get("numeroLote"), producto__profile=user.profile.id)
                            return Response(
                                {"detail": "Ya tiene otro lote con el mismo Número"},
                                status=status.HTTP_400_BAD_REQUEST
                            )
                        except Lote.DoesNotExist:
                            pass

                    lote.cantidad = data.get("cantidad", lote.cantidad)
                    lote.fechaVencimiento = data.get("fechaVencimiento", lote.fechaVencimiento)
                    lote.numeroLote = data.get("numeroLote", lote.numeroLote)
                    lote.save()
                    return Response({"detail": "Lote actualizado correctamente"}, status=status.HTTP_200_OK)
                else:
                    return Response({"detail": "No envio todos los datos necesarios"}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"detail": "Hubo un error al actualizar el Lote"}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError as e:
            return Response({"detail": "{} is a required field".format(str(e))}, status=status.HTTP_400_BAD_REQUEST)
