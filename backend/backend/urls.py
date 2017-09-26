from django.conf.urls import url
from django.contrib.auth import views as auth_views
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from apps.profiles.views import profile_get


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^profile/', profile_get),
    # url(r'^accounts/login/$', auth_views.LoginView.as_view()),
    url(r'^$', login_required(TemplateView.as_view(template_name='app.pug'))),
    url(r'^login/$', auth_views.LoginView.as_view()),
    url(r'^logout/$', auth_views.LogoutView.as_view()),

    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
