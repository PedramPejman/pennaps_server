from django.db import models

# Create your models here.
class Attachment(models.Model):
	file = models.FileField(blank=True)