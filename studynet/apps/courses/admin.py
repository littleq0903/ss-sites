from django.contrib import admin
from courses.models import CourseData


class CourseDataAdmin(admin.ModelAdmin):
    pass

admin.site.register(CourseData, CourseDataAdmin)
