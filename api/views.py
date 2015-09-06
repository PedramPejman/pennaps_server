from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .forms import *

@csrf_exempt
def accept(request):
	print('1')
	if request.method == 'POST':
		print(request.FILES)
		if 'uploadedfile' in request.FILES:
			a = Attachment(file=request.FILES['uploadedfile'])
			a.save()
			return HttpResponse('Done')
		if 'file' in request.FILES:
			a = Attachment(file=request.FILES['file'])
			a.save()
			return HttpResponse('Done')
	form = UploadFileForm()
	return render(request, 'form.html', {'form': form})

def handle_uploaded_file(f):
	print('c')
	with open('motion.txt', 'wb+') as destination:
		for chunk in f.chunks():
			destination.write(chunk)

# Create your views here.

def home(request):
	return HttpResponse('Hello')

def show(request):
	return render(request, 'show1.html', {})
