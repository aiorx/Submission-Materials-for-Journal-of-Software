from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

# Aided with basic GitHub coding tools
router = DefaultRouter()
router.register('users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]