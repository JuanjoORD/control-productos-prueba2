from rest_framework import serializers
from api.models import Lote
from api.serializers import ProductoSerializer


class LoteSerializer(serializers.ModelSerializer):    

    class Meta:
        model = Lote
        fields = '__all__'


class LoteRegisterSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Lote
        fields = (
            'cantidad',
            'fechaVencimiento',
            'numeroLote',
            'producto'
        )
