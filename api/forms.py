from django import forms
from django.forms import ModelForm
from .models import *

class UploadFileForm(ModelForm):
    class Meta:
    	model = Attachment
    	fields=['file']