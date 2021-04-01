from django.db import models
from .venta import Venta
from .lote import Lote


class DetalleVenta(models.Model):

    lote = models.ForeignKey(Lote, on_delete=models.CASCADE, related_name="detalleventa_lote")
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE, related_name="detalleventa_venta")
    cantidad = models.FloatField()
    descuento = models.FloatField()
    subtotal = models.FloatField()

    activo = models.BooleanField(default=True)
    creado = models.DateTimeField(auto_now_add=True)
    modificado = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.venta.nombreCliente

    def delete(self, *args):        
        self.activo = False
        self.save()
        return True
