from django.db import models

# Create your models here.

class CourseData(models.Model):
    """
        Model for courses
        fs_: prefix stands for this attribute came from school data.
    """
# From school data
    fs_semester = models.CharField(max_length=5)
    fs_course_number = models.CharField(max_length=20)
    fs_teacher_chinese = models.CharField(max_length=40)
    fs_teacher_english = models.CharField(max_length=40)
    fs_credit_point = models.CharField(max_length=20, blank=True)
    fs_class_time = models.CharField(max_length=40, blank=True)
    fs_class_room = models.CharField(max_length=40, blank=True)
    fs_is_common_course = models.BooleanField(default=False)
    fs_common_course_category = models.CharField(max_length=20, blank=True)
    fs_syllabus_link = models.URLField(blank=True)
    fs_creater = models.CharField(max_length=50)
    fs_full_times = models.IntegerField()

    # attribute
    uuid = models.CharField(max_length=40)

