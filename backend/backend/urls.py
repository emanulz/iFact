from django.conf.urls import url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from apps.profiles.views import profile_get


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^profile/', profile_get),
    url(r'^$', login_required(TemplateView.as_view(template_name='app.pug'))),

    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
