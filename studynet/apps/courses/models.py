# -*- coding: utf-8 -*-
from django.db import models
from departments.models import Department

# Create your models here.
class CourseDataManager(models.Manager):
    def get_by_click(self, depart_id):
        return sorted(super(CourseDataManager, self).filter(department=depart_id), key=lambda x:x.click, reverse=True)


class CourseData(models.Model):
    """
        Model for courses data from school
        fs_: prefix stands for this attribute came from school data.
    """

    objects = CourseDataManager()

    # From school data
    fs_semester = models.CharField(max_length=5)
    fs_course_number = models.CharField(max_length=20)
    fs_course_name = models.CharField(max_length=100)
    fs_teacher = models.CharField(max_length=100, blank=True)
    fs_credit_point = models.CharField(max_length=20, blank=True)
    fs_class_time = models.CharField(max_length=40, blank=True)
    fs_class_room = models.CharField(max_length=40, blank=True)
    fs_is_common_course = models.BooleanField(default=False)
    fs_common_course_category = models.CharField(max_length=20, blank=True)
    fs_choose_method = models.CharField(max_length=20, blank=True)
    fs_syllabus_link = models.URLField(blank=True)
    fs_creater = models.CharField(max_length=50)
    fs_full_times = models.IntegerField()


    # property
    uuid = models.AutoField(primary_key=True)
    school = models.CharField(max_length=10)
    department = models.ForeignKey('departments.Department', null=True, on_delete=models.SET_NULL)
    create_time = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.fs_course_name

    def get_attr(self, attr, lang='chinese'):
        text = getattr(self, attr)
        if lang == 'english':
            try:
                return text.split('/')[1]
            except:
                pass
        try:
            return text.split('/')[0]
        except:
            return text

    def count_click(self):
        m_click, status = CourseClick.objects.get_or_create(course=self)
        if status:
            m_click.save()
        return m_click.click
    click = property(count_click)

    def get_name(self, lang='chinese'):
        return self.get_attr('fs_course_name', lang)

    def get_teacher(self, lang='chinese'):
        return self.get_attr('fs_teacher', lang)

    def get_creater(self):
        return self.get_attr('fs_common_course_category') if self.fs_is_common_course else self.get_attr('fs_creater')

    def get_year(self):
        return self.fs_semester.split('/')[0]

    def get_semester(self):
        return self.fs_semester.split('/')[1]

    def get_fb_target_link(self):
        return 'http://socialstudy.tw/courses/depart-%s/?course_uuid=%s' % (self.department.uuid, self.uuid)

    def click_one(self):
        m_click, status = CourseClick.objects.get_or_create(course=self)
        m_click.click += 1
        m_click.save()
        return m_click

    def to_json(self, detail=False, lang='chinese', *args, **kwargs):
        resp = {
                'semester': self.fs_semester,
                'course_number': self.fs_course_number,
                'course_name': self.get_attr('fs_course_name'),
                'teacher': self.get_attr('fs_teacher'),
                'credit': self.fs_credit_point,
                'time': self.fs_class_time,
                'classroom': self.fs_class_room,
                'department': self.fs_creater,
                'school': self.school,
                'uuid': self.uuid,
                'click': self.click,
                }
        if detail:
            resp.update({
                'fb_target_link': self.get_fb_target_link(),
                'syllabus_link': self.fs_syllabus_link,
                'way': self.fs_choose_method,
                'is_general_course': self.fs_is_common_course,
            })
        return resp

    def save(self, *args, **kwargs):

        # TODO: remove this in the future going global
        if not self.school:
            self.school = 'nccu'

        self.fs_syllabus_link = "http://wa.nccu.edu.tw/qrytor/schmtpe.aspx?yy=%s&smt=%s&sub=%s" % (self.get_year(), self.get_semester(), self.fs_course_number)

        if self.fs_is_common_course:
            depart_name = self.fs_common_course_category
            is_g = True
        else:
            depart_name = self.fs_creater
            is_g = False

        m_department, status = Department.objects.get_or_create(name=depart_name, school=self.school, is_general_cate=is_g)
        m_department.save()
        self.department = m_department
        super(CourseData, self).save(*args, **kwargs)

class CourseClick(models.Model):
    click = models.PositiveIntegerField(default=0)
    course = models.ForeignKey(CourseData, related_name='+')
