from django.conf.urls.defaults import *

from django.views.generic import TemplateView

urlpatterns = patterns('courses.views',
    url(r'^forward/$', 'input_view'),
    url(r'^update/batch/$', 'batch_update'),
    url(r'^depart-(?P<depart_id>\w+)/$', 'all_course_page', name="all-course-page"),
    url(r'^(?P<course_id>\w+)/$', 'courses_page', name="course-page"),
    url(r'^$', 'all_course_page'),
)

urlpatterns += patterns('courses.ajax',
    # query by department
    url(r'^ajax/by_depart/(?P<depart_id>\w+)/$', 'query_course_by_department'),
    url(r'^ajax/by_depart/(?P<depart_id>\w+)/(?P<limit>\d+)/$', 'query_course_by_department'),
    url(r'^ajax/by_depart/(?P<depart_id>\w+)/(?P<limit>\d+)/(?P<offset>\d+)/$', 'query_course_by_department'),
    # query course detail
    url(r'^ajax/detail/(?P<course_id>\w+)/$', 'query_course_detail')
)
