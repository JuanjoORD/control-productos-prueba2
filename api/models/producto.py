from django.db import models
from .profile import Profile


class Producto(models.Model):

    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="producto_profile")
    nombre = models.CharField(max_length=70)
    descripcion = models.TextField(null=True, blank=True)
    precioCompra = models.FloatField()
    precioVenta = models.FloatField()
    codigoBarras = models.CharField(max_length=70)
    foto = models.ImageField(upload_to="Producto", null=True, blank=True)

    activo = models.BooleanField(default=True)
    creado = models.DateTimeField(auto_now_add=True)
    modificado = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.nombre

    def delete(self, *args):        
        self.activo = False
        self.save()
        return True
