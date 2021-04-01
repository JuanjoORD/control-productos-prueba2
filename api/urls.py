from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from django.conf.urls import url
from api import viewsets


router = DefaultRouter()
router.register(r'user', viewsets.UserViewset)
router.register(r'producto', viewsets.ProductoViewset)
router.register(r'lote', viewsets.LoteViewset)
router.register(r'venta', viewsets.VentaViewset)
router.register(r'detalle-venta', viewsets.DetalleVentaViewset)


urlpatterns = [
    path('api/', include(router.urls)),
    url(r"^api/token", obtain_auth_token, name="api-token"),
    path('api-auth/', include('rest_framework.urls')),
]
