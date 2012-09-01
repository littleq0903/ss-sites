# -*- coding: utf-8 -*-
from courses.models import CourseData

import simplejson as json

def save_a_course(course_id, kwargs):
    print "[save_a_course] Trying to save a course: %s" % course_id
    print "[save_a_course:data]"
    print json.dumps(kwargs, sort_keys = True, indent=2)
    try:
        m_course = CourseData.objects.get(fs_course_number = course_id)
    except CourseData.DoesNotExist:
        print '[save_a_course] Course ID: %s, does not exist, create this course.' % course_id
        params = {
                'fs_semester': kwargs['semester'],
                'fs_course_number': kwargs['courseId'],
                'fs_course_name': kwargs['courseName'],
                'fs_teacher': kwargs['teacher'],
                'fs_credit_point': kwargs['credit'],
                'fs_class_time': kwargs['dateTime'],
                'fs_class_room': kwargs['place'],
                'fs_is_common_course': True if kwargs['classGECL'] else False,
                'fs_common_course_category': kwargs['classGECL'] if kwargs['classGECL'] else kwargs['department'],
                'fs_choose_method': kwargs['way'],
                'fs_creater': kwargs['department'],
                'fs_full_times': kwargs['volume'],
        }
        if not params['fs_creater']:
            params['fs_creater'] = u'其它'
            params['fs_is_common_course'] = True
            m_course = CourseData(**params)
            m_course.save()
            return True


        creater_text = params['fs_creater']
        name_exception = [u"體育", u"創新", u"第三", u"教務", u"商學", u"商院", u"學務", u"軍訓", u"國合", u"遠距", u"華文", u"政大"]
        for name in name_exception:
            if creater_text[0:2] == name:
                if name == u'商學' or name == u'商院':
                    print '[name = %s] matched name exception, break.' % name
                    params['fs_common_course_category'] = u'商學院'
                params['fs_is_common_course'] = True
                break
        else:
            if (not params['fs_is_common_course']) and creater_text[2:3] != u"系":
                if u"所" in creater_text: replace_text = u"所"
                elif u"系" in creater_text: replace_text = u"系"
                elif u"博" in creater_text: replace_text = u"所"
                elif u"碩" in creater_text: replace_text = u"所"
                else: replace_text = u"系"
                print "[%s => %s] creater not match, replaced." % (params['fs_creater'], params['fs_creater'][0:2]+ replace_text)
                params['fs_creater'] = params['fs_creater'][0:2] + replace_text

        m_course = CourseData(**params)
        m_course.save()
        print '[save_a_course] data saved.'
        return True
    else:
        print '[save_a_course:log] m_course = %s' % m_course
        print '[save_a_course] Course does exist, do nothing.'
        return False
