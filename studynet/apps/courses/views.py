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
        depart_id = random.sample(Department.objects.filter(), 1)[0]
    dataContext = {
        "non_general_departments": Department.objects.filter(is_general_cate=False),
        "general_departments": Department.objects.filter(is_general_cate=True),
        "current_uuid": depart_id,
        "courses": CourseData.objects.filter(department=depart_id)
    }
    return render_to_response("courses.html", dataContext, context_instance=RequestContext(request))


@csrf_exempt
def input_view(request):
    return HttpResponse("OK", content_type="text/plain")


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
            print save_a_course(course['courseId'], course)
        except Exception as e:
            print "[batch_update] course ID: %s exception occurred: %s" % (course['courseId'], e)

    return HttpResponse("true", content_type="text/plain")

def courses_page(request):
    return HttpResponseRedirect("/courses/")
