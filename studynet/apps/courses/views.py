# Create your views here.
from django.http import HttpResponseRedirect, HttpResponse
from django.views.decorators.csrf import csrf_exempt

from courses.utils import save_a_course

import json

@csrf_exempt
def input_view(request):
    return HttpResponse("OK", content_type="text/plain")


@csrf_exempt
def batch_update(request):
    try:
        data = json.loads(request.body)
    except Exception as e:
        print e
        return HttpResponse("OK", content_type="text/plain")

    print "==recieve data=="
    print data

    print '++length: %s' % len(data)
    for course in data:
        print '===each data==='
        print course
        try:
            print save_a_course(course['courseId'], course)
        except Exception as e:
            print e
            print "exception occurred!"

    return HttpResponse("OK2", content_type="text/plain")

def courses_page(request):
    return HttpResponseRedirect("/courses/")
