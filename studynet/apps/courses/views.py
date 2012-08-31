# Create your views here.
from django.http import HttpResponseRedirect, HttpResponse
from django.views.decorators.csrf import csrf_exempt

from courses.models import CourseData

@csrf_exempt
def input_view(request, course_id):
    print "Recieve course_id: %s" % course_id
    for i in request.POST.keys():
        print "%s:%s" % (i, request.POST[i])



    return HttpResponse("OK", content_type="text/plain")
