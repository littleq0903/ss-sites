from courses.models import CourseData


def save_a_course(course_id, **kwargs):
    try:
        m_course = CourseData.objects.get(fs_course_id = course_id)
    except CourseData.DoesNotExist:
        return False
    else:
        params = {
                'fs_semester': '',
                'fs_course_number':'',
                'fs_teacher':'',
                'fs_credit_point':'',
                'fs_class_time':'',
                'fs_class_room':'',
                'fs_is_common_course':'',
                'fs_common_course_category':'',
                'fs_choose_method':'',
                'fs_syllabus_link':'',
                'fs_creater':'',
                'fs_full_times':'',
            }
        m_course = CourseData(**params)
        m_course.save()


