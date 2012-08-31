# -*- coding: utf-8 -*-
from courses.models import CourseData

def save_a_course(course_id, kwargs):
    print "Trying to save a course: %s" % course_id
    try:
        m_course = CourseData.objects.get(fs_course_number = course_id)
    except CourseData.DoesNotExist:
        params = {
                'fs_semester': kwargs['semester'],
                'fs_course_number': kwargs['courseId'],
                'fs_course_name': kwargs['courseName'],
                'fs_teacher': kwargs['teacher'],
                'fs_credit_point': kwargs['credit'],
                'fs_class_time': kwargs['dateTime'],
                'fs_class_room': kwargs['place'],
                'fs_is_common_course': True if kwargs['classGECL'] else False,
                'fs_common_course_category': kwargs['classGECL'],
                'fs_choose_method': kwargs['way'],
                'fs_creater': kwargs['department'],
                'fs_full_times': kwargs['volume'],
        }
        m_course = CourseData(**params)
        m_course.save()
        return True
    else:
        return False
