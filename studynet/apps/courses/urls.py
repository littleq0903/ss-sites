from django.conf.urls.defaults import *

from django.views.generic import TemplateView

urlpatterns = patterns('courses.views',
    url(r'^forward/$', 'input_view'),
    url(r'^update/batch/$', 'batch_update'),
    url(r'^depart-(?P<depart_id>\w+)/$', 'all_course_page', name="all-course-page"),
    url(r'^(?P<course_id>\w+)/$', 'courses_page', name="course-page"),
    url(r'^$', 'all_course_page'),
)
