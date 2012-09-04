# -*- coding: utf-8 -*-
# Create your views here.

from django.http import HttpResponseRedirect, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render_to_response
from django.template import RequestContext

from courses.utils import save_a_course
from departments.models import Department
from courses.models import CourseData

import simplejson as json
import random

def all_course_page(request, depart_id=''):
    if not depart_id:
        ALL = True
        depart_id = 'all'
    dataContext = {
        "non_general_departments": Department.objects.filter(is_general_cate=False),
        "general_departments": Department.objects.filter(is_general_cate=True),
        "current_uuid": depart_id,
        "courses": CourseData.objects.get_by_click(depart_id)
    }

    return render_to_response("courses.html", dataContext, context_instance=RequestContext(request))


@csrf_exempt
def forward(request, school, course_id):
    try:
        m_course = CourseData.objects.get(fs_course_number=course_id, school=school)
    except CourseData.DoesNotExist:
        raise Http404
    else:
        redirect_url = "/courses/depart-%s?course_uuid=%s" % (m_course.department.uuid, m_course.uuid)
        return HttpResponseRedirect(redirect_url)


@csrf_exempt
def batch_update(request):
    try:
        data = json.loads(request.body)
    except Exception as e:
        print "[batch_update: json.loads] error:", e
        return HttpResponse("false", content_type="text/plain")

    print "[batch_update: recieve data]"
    print json.dumps(data, sort_keys=True, indent=2)

    for course in data:
        try:
            save_a_course(course['courseId'], course)
        except Exception as e:
            print "[batch_update] course ID: %s exception occurred: %s" % (course['courseId'], e)
            import traceback, os.pth
            top = traceback.extract_stack()[-1]
            print ", ".join([type(e).__name__, os.path.basename(top[0]), str(top[1])])

    return HttpResponse("true", content_type="text/plain")

def courses_page(request):
    return HttpResponseRedirect("/courses/")
