from django.db import models


class Venta(models.Model):

    fecha = models.DateTimeField()
    nombreCliente = models.CharField(max_length=200)
    direccionCliente = models.TextField()
    correoCliente = models.CharField(max_length=100)
    nit = models.CharField(max_length=9)
    anulada = models.BooleanField()
    total = models.FloatField()

    activo = models.BooleanField(default=True)
    creado = models.DateTimeField(auto_now_add=True)
    modificado = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.nombreCliente

    def delete(self, *args):        
        self.activo = False
        self.save()
        return True
