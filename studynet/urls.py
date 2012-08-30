from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
from django.conf import settings
from django.views.generic import TemplateView

admin.autodiscover()

urlpatterns = patterns('',
    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)

urlpatterns += patterns('',
    (r'^prototype/', TemplateView.as_view(template_name="prototype.html")),
    (r'^channel.html', TemplateView.as_view(template_name="fb/channel.html")),
)


urlpatterns += staticfiles_urlpatterns()
