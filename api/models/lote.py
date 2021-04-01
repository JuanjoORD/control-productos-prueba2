from django.db import models
from .producto import Producto


class Lote(models.Model):

    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name="lote_producto")
    cantidad = models.IntegerField()
    fechaVencimiento = models.DateTimeField()
    numeroLote = models.CharField(max_length=15)

    activo = models.BooleanField(default=True)
    creado = models.DateTimeField(auto_now_add=True)
    modificado = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.producto.nombre

    def delete(self, *args):        
        self.activo = False
        self.save()
        return True
