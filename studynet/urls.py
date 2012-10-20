from django.conf.urls.defaults import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
from django.conf import settings
from django.views.generic import TemplateView

admin.autodiscover()

urlpatterns = patterns('',
    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),

    # Module View
    (r'^courses/', include('courses.urls')),
)

urlpatterns += patterns('',
    (r'^prototype/', TemplateView.as_view(template_name="prototype.html")),
    (r'^channel\.html', TemplateView.as_view(template_name="fb/channel.html")),
    (r'^favicon\.ico', 'django.views.generic.simple.redirect_to', {'url': '/static/img/favicon.ico'}),
    (r'^$', TemplateView.as_view(template_name="home.html")),
)

# for django_facebook
urlpatterns += patterns('',
        (r'^facebook/', include('django_facebook.urls')),
        (r'^accounts/', include('django_facebook.auth_urls')),
        )

urlpatterns += staticfiles_urlpatterns()
