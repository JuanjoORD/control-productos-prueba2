from rest_framework import serializers
from api.models import Producto, Profile


class ProductoSerializer(serializers.ModelSerializer):
    total = serializers.IntegerField(required=False)
    inCarrito = serializers.IntegerField(default=0)
    vendido = serializers.FloatField(default=0)
    
    class Meta:
        model = Producto
        fields = '__all__'


class ProductoRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model: Producto
        fields = (
            'nombre',
            'descripcion',
            'precioCompra',
            'precioVenta',
            'codigoBarras',
        )
