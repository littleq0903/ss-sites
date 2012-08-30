from django.conf.urls.defaults import *


urlpatterns = patterns('courses.views',
    url(r'^(?P<course_id>\w+)/$', 'courses_page', name="course-page"),
    url(r'^input$', 'input_view')
)
