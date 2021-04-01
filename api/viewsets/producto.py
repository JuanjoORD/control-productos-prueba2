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
from api.models import Producto
from api.serializers import ProductoRegisterSerializer, ProductoSerializer


class ProductoViewset(viewsets.ModelViewSet):
    queryset = Producto.objects.filter(activo=True)

    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filter_fields = ("nombre",)
    search_fields = ("nombre",)
    ordering_fields = ("nombre",)

    def get_serializer_class(self):
        """Define serializer for API"""
        if self.action == 'list' or self.action == 'retrieve':
            return ProductoSerializer
        else:
            return ProductoRegisterSerializer

    def get_permissions(self):
        permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    

    def create(self, request):
        data = request.data
        try:
            foto = data.get("foto")
            data = json.loads(data["data"])
            user = request.user

            with transaction.atomic():

                dataSerializer = ProductoRegisterSerializer(data=data)

                if dataSerializer.is_valid:
                    try:
                        Producto.objects.get(nombre=data.get("nombre"), profile=user.profile.id)
                        return Response(
                            {"detail": "Ya tiene un producto con el mismo nombre, verifique si es así y realice las modificaciones sobre el mismo, a su conveniencia."},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    except Producto.DoesNotExist:
                        pass

                    productoNew = Producto.objects.create(
                        nombre=data.get("nombre"),
                        descripcion=data.get("descripcion"),
                        profile=user.profile,
                        precioCompra=data.get("precioCompra"),
                        precioVenta=data.get("precioVenta"),
                        codigoBarras=data.get("codigoBarras"),
                    )

                    if foto is not None:
                        productoNew.foto = File(foto)

                    productoNew.save()

                    return Response({"detail": "Producto creado correctamente"}, status=status.HTTP_200_OK)
                else:
                    return Response({"detail": "No envio todos los datos necesarios"}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"detail": "Hubo un error al crear el producto"}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError as e:
            return Response({"detail": "{} is a required field".format(str(e))}, status=status.HTTP_400_BAD_REQUEST)
    

    def update(self, request, pk):
        data = request.data
        try:
            foto = data.get("foto")
            data = json.loads(data["data"])
            user = request.user

            with transaction.atomic():

                dataSerializer = ProductoRegisterSerializer(data=data)

                if dataSerializer.is_valid:
                    producto = Producto.objects.get(id=data.get("id"))

                    producto.nombre = data.get("nombre", producto.nombre)
                    producto.descripcion = data.get("descripcion", producto.descripcion)
                    producto.precioCompra = data.get("precioCompra", producto.precioCompra)
                    producto.precioVenta = data.get("precioVenta", producto.precioVenta)
                    producto.codigoBarras = data.get("codigoBarras", producto.codigoBarras)

                    if producto.foto is not None and foto is not None:
                        producto.foto.delete()

                    if foto is not None:
                        producto.foto = File(foto)

                    producto.save()

                    return Response({"detail": "Producto actualizado correctamente"}, status=status.HTTP_200_OK)
                else:
                    return Response({"detail": "No envio todos los datos necesarios"}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"detail": "Hubo un error al actualizar el producto"}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError as e:
            return Response({"detail": "{} is a required field".format(str(e))}, status=status.HTTP_400_BAD_REQUEST)
    

    @action(methods=["post"], detail=False)
    def listMyProducts(self, request):
        user = request.user
        try:

            with transaction.atomic():

                if user.profile is not None:
                    queryset = Producto.objects.filter(
                        activo=True,
                        profile=user.profile.id
                    ).annotate(
                        total = models.Sum(
                            'lote_producto__cantidad',
                            filter=models.Q(lote_producto__activo=True)
                        )
                    )

                    productos = ProductoSerializer(queryset, many=True)

                    data = {
                        "count": len(productos.data),
                        "results": productos.data
                    }

                    return Response({"productos": data}, status=status.HTTP_200_OK)
                else:
                    return Response({"detail": "No envio todos los datos necesarios"}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"detail": "Hubo un error al actualizar el producto"}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError as e:
            return Response({"detail": "{} is a required field".format(str(e))}, status=status.HTTP_400_BAD_REQUEST)
