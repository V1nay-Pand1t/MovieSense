from django.urls import path, include
from rest_framework.routers import DefaultRouter
from imdb_picker.views import MovieViewSet
from imdb_picker import views

router = DefaultRouter()
router.register(r'movies', MovieViewSet, basename='movie')
### lets expose metrics endpoint for prometheus

urlpatterns = [
    path('metrics/', include('django_prometheus.urls')),
    path('', include(router.urls)),
]

