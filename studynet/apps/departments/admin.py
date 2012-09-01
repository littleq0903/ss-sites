from django.contrib import admin
from departments.models import Department

class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('school', 'name', 'is_general_cate', 'uuid')

admin.site.register(Department, DepartmentAdmin)
