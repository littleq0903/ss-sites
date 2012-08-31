from django.conf.urls.defaults import *

from django.views.generic import TemplateView

urlpatterns = patterns('courses.views',
    url(r'^(?P<course_id>\w+)/$', 'courses_page', name="course-page"),
    url(r'^input$', 'input_view'),
    url(r'^$', TemplateView.as_view(template_name="courses.html")),
)
