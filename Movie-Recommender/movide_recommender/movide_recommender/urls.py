from django.contrib import admin
from django.urls import path
from django.urls import include
from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('', include('django_prometheus.urls')),
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
    # Include the URLs from the imdb app
    path('imdb/', include('imdb_picker.urls')),
]

