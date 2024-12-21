from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from .views import UserQuotaViewSet, TranscriptionView



admin.site.site_header = 'Kateb Admin'
admin.site.site_title = 'Kateb Admin Portal'
admin.site.index_title = 'Welcome to Kateb Admin Portal'

router = DefaultRouter()
router.register(r'quota', UserQuotaViewSet, basename='quota')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/transcribe/', TranscriptionView.as_view(), name='transcribe'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)