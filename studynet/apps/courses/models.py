from django.db import models

# Create your models here.

class CourseData(models.Model):
    """
        Model for courses data from school
        fs_: prefix stands for this attribute came from school data.
    """
# From school data
    fs_semester = models.CharField(max_length=5)
    fs_course_number = models.CharField(max_length=20)
    fs_teacher = models.CharField(max_length=40)
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
    uuid = models.CharField(max_length=40)
    school = models.CharField(max_length=10)

    def save(self, *args, **kwargs):
        uuid_form = "%s_%s_%s" % (self.school, self.fs_semester, self.fs_course_number)
        self.uuid = uuid_form
        super(CourseData, self).save(*args, **kwargs)




