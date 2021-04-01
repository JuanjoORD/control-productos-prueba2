from rest_framework import serializers
from api.models import Venta


class VentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venta
        fields = '__all__'


class VentaRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model: Venta
        fields = (
            'fecha',
            'nombreCliente',
            'direccionCliente',
            'correoCliente',
            'nit'
        )
