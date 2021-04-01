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
from datetime import datetime
from api.models import Venta, Profile, Producto, DetalleVenta, Lote
from api.serializers import (
    VentaRegisterSerializer, VentaSerializer, UserReadSerializer, ProductoSerializer, LoteSerializer
)


class VentaViewset(viewsets.ModelViewSet):
    queryset = Venta.objects.filter(activo=True)

    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filter_fields = ("nit",)
    search_fields = ("nit",)
    ordering_fields = ("nit",)

    def get_serializer_class(self):
        """Define serializer for API"""
        if self.action == 'list' or self.action == 'retrieve':
            return VentaSerializer
        else:
            return VentaRegisterSerializer

    def get_permissions(self):
        if self.action == "listVendedores" or self.action=="listProductBySeller" or self.action=="confirmarCompra":
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    

    @action(methods=["post"], detail=False)
    def listVendedores(self, request):
        data = request.data
        try:
            with transaction.atomic():
                querysetSellers = None

                if data.get("isSeller") == True:
                    querysetSellers = User.objects.filter(is_active=True).exclude(id=data.get("user").get("id"))
                else:
                    querysetSellers = User.objects.filter(is_active=True)                

                respuesta = []
                if querysetSellers is not None:
                    serializerSellers = UserReadSerializer(querysetSellers, many=True)
                    respuesta = serializerSellers.data

                return Response({"vendedores": respuesta}, status=status.HTTP_200_OK)

            return Response({"detail": "Hubo un error al actualizar el producto"}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError as e:
            return Response({"detail": "{} is a required field".format(str(e))}, status=status.HTTP_400_BAD_REQUEST)
    

    @action(methods=["post"], detail=False)
    def listProductBySeller(self, request):
        data = request.data
        try:
            with transaction.atomic():

                profile = Profile.objects.get(
                    id=data.get("profileId"),
                    activo=True
                )

                productos = Producto.objects.filter(
                    profile=data.get("profileId"),
                    activo=True
                ).annotate(
                    total = models.Sum(
                        'lote_producto__cantidad',
                        filter=models.Q(lote_producto__activo=True)
                    )
                )
                
                productData = ProductoSerializer(productos, many=True)
                user = UserReadSerializer(profile.user)

                return Response({"productos": productData.data, "vendedor": user.data}, status=status.HTTP_200_OK)

            return Response({"detail": "Hubo un error al actualizar el producto"}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError as e:
            return Response({"detail": "{} is a required field".format(str(e))}, status=status.HTTP_400_BAD_REQUEST)
    

    @action(methods=["post"], detail=False)
    def confirmarCompra(self, request):
        data = request.data
        try:
            with transaction.atomic():
                cliente = data.get("cliente")
                detalle = data.get("detalle")
                total = 0

                if cliente is not None and detalle is not None:

                    venta = Venta.objects.create(
                        fecha=datetime.now(),
                        nombreCliente=cliente.get("nombreCliente"),
                        direccionCliente=cliente.get("direccionCliente"),
                        correoCliente=cliente.get("correoCliente"),
                        nit=cliente.get("nit"),
                        anulada=False,
                        total=0
                    )

                    detalle_list = []
                    for producto in detalle:
                        milote = Lote.objects.filter(
                            producto=producto.get("id"),
                            activo=True,
                            cantidad__gt=0
                        ).order_by(
                            'fechaVencimiento'
                        ).first()
                        
                        newCantidadLote = milote.cantidad - int(producto.get("inCarrito"))
                        cantidadDetalle = 0
                        upCantidadLote = None
                        resto = None
                        #5-2
                        #3

                        #2-4
                        #-2
                        if newCantidadLote > -1:
                            cantidadDetalle = int(producto.get("inCarrito"))                            
                            upCantidadLote = newCantidadLote
                            milote.cantidad = upCantidadLote                            
                        else:
                            cantidadDetalle = milote.cantidad
                            resto = int(producto.get("inCarrito")) - milote.cantidad
                            producto["inCarrito"] = resto                            
                            detalle.append(producto)
                            milote.cantidad = 0

                        milote.save()
                        subtotal = float(producto.get("precioVenta")) * float(cantidadDetalle)  
                        total += subtotal
                        
                        detalle_list.append(
                            DetalleVenta(
                                venta=venta,
                                lote=milote,
                                cantidad=cantidadDetalle,
                                descuento=0,
                                subtotal=subtotal
                            )
                        )

                    
                    print("total", total)
                    venta.total = total
                    DetalleVenta.objects.bulk_create(detalle_list)
                    venta.save()
                    return Response({"detail": 'Compra realizada correctamente'}, status=status.HTTP_200_OK)
                else:
                    return Response({"detail": "No envio todos los datos necesarios"}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"detail": "Hubo un error al actualizar el producto"}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError as e:
            return Response({"detail": "{} is a required field".format(str(e))}, status=status.HTTP_400_BAD_REQUEST)
    

    @action(methods=["post"], detail=False)
    def resultados(self, request):
        data = request.data
        user = request.user
        try:
            with transaction.atomic():

                querysetTotal = DetalleVenta.objects.filter(
                    activo=True,
                    lote__producto__profile=user.profile.id
                ).aggregate(
                    total = models.Sum(
                        'subtotal'
                    )
                )

                querysetPromedio = Producto.objects.filter(
                    activo=True,
                    profile=user.profile.id
                ).aggregate(
                    promedio = models.Avg(
                        'precioVenta'
                    )
                )
                
                queryPorProducto = Producto.objects.filter(
                    activo=True,
                    profile=user.profile.id
                ).annotate(
                    vendido = models.Sum(
                        'lote_producto__detalleventa_lote__subtotal'                        
                    )
                )
                
                serializer = ProductoSerializer(queryPorProducto, many=True)

                return Response(
                    {"total": querysetTotal.get("total"), "promedioPrecio": querysetPromedio.get("promedio"), "porProducto": serializer.data}, 
                    status=status.HTTP_200_OK
                )

            return Response({"detail": "Hubo un error al actualizar el producto"}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError as e:
            return Response({"detail": "{} is a required field".format(str(e))}, status=status.HTTP_400_BAD_REQUEST)
