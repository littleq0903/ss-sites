from django.db import models
from departments.models import Department

# Create your models here.

class CourseData(models.Model):
    """
        Model for courses data from school
        fs_: prefix stands for this attribute came from school data.
    """
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
    uuid = models.CharField(max_length=50)
    school = models.CharField(max_length=10)
    department = models.ForeignKey('departments.Department')
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

    def to_json(self, detail=False, lang='chinese', *args, **kwargs):
        resp = {
                'semester': self.fs_semester,
                'course_number': self.fs_course_number,
                'course_name': self.get_attr('fs_course_name'),
                'teacher': self.get_attr('fs_teacher'),
                'credit': self.fs_credit_point,
                'time': self.fs_class_time,
                'classroom': self.fs_class_room,
                'department': self.fs_creater}
        if detail:
            resp.update({
                'syllabus_link': self.fs_syllabus_link,
                'way': self.fs_choose_method,
                'is_general_course': self.fs_is_common_course,
            })
        return resp

    def save(self, *args, **kwargs):
        uuid_form = "%s_%s_%s" % (self.school, self.fs_semester.replace('/',''), self.fs_course_number)
        if not self.school:
            self.school = 'nccu'
        self.uuid = uuid_form
        self.fs_syllabus_link = "http://wa.nccu.edu.tw/qrytor/schmtpe.aspx?yy=%s&smt=%s&sub=%s" % (self.get_year(), self.get_semester(), self.fs_course_number)

        if self.fs_is_common_course:
            depart_name = self.fs_common_course_category
            is_g = True
        else:
            depart_name = self.fs_creater
            is_g = False
        m_department, status = Department.objects.get_or_create(name=depart_name, school=self.school, is_general_cate=is_g)
        print "QQ"
        print m_department
        m_department.save()
        print "QQ"
        self.department = m_department
        super(CourseData, self).save(*args, **kwargs)

