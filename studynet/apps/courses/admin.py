from django.contrib import admin
from courses.models import CourseData


class CourseDataAdmin(admin.ModelAdmin):
    list_display = ('fs_semester', 'fs_course_number', 'fs_teacher', 'department', 'fs_is_common_course')

admin.site.register(CourseData, CourseDataAdmin)
