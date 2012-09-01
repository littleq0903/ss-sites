from django.db import models

# Create your models here.

class Department(models.Model):
    name = models.CharField(max_length = 30)
    school = models.CharField(max_length = 30)
    is_general_cate = models.BooleanField(default=False)

    uuid = models.AutoField(primary_key=True)

    def __unicode__(self):
        return self.name

