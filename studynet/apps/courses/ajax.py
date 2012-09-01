from django.http import HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt

from courses.models import CourseData
from departments.models import Department

import simplejson as json

@csrf_exempt
def query_course_by_department(request, depart_id, limit=0, offset=0):
    try:
        m_depart = Department.objects.get(uuid = depart_id)
    except Department.DoesNotExist:
        raise Http404
    else:
        m_course = CourseData.objects.filter(department = m_depart)
        resp_data = [ m.to_json() for m in m_course ]
        if limit:
            resp_data = resp_data[offset:offset+limit]
        else:
            resp_data = resp_data

        resp = {
            'data': resp_data,
            'length': len(resp_data),
            }

        return HttpResponse(json.dumps(resp, indent=2, sort_keys=True), content_type='application/json')

@csrf_exempt
def query_course_detail(request, course_id):
    try:
        m_course = CourseData.objects.get(uuid = course_id)
    except CourseData.DoesNotExist:
        raise Http404
    else:
        m_course.click_one()
        resp = {
            'data': m_course.to_json(detail=True),
        }

        return HttpResponse(json.dumps(resp, indent=2, sort_keys=True), content_type='application/json')

