from django.contrib import admin
from courses.models import CourseData, CourseClick


class CourseDataAdmin(admin.ModelAdmin):
    list_display = ('fs_semester', 'fs_course_number', 'fs_teacher', 'department', 'fs_is_common_course')


class CourseClickAdmin(admin.ModelAdmin):
    list_display = ('course', 'click')

admin.site.register(CourseClick, CourseClickAdmin)
admin.site.register(CourseData, CourseDataAdmin)
