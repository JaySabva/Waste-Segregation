from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views
from . import views

from .views import PredictAPIView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('predict/', PredictAPIView.as_view(), name='predict_api'),
    # Add other URL patterns as needed
]