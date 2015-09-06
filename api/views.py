import subprocess
from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .forms import *

@csrf_exempt
def accept(request):
	h = str('1')
	if request.method == 'POST':
		h = h + str(request.FILES)
		if 'uploadedfile' in request.FILES:
			a = Attachment(file=request.FILES['uploadedfile'])
			a.save()
			return HttpResponse('Done')
		if 'file' in request.FILES:
			a = Attachment(file=request.FILES['file'])
			a.save()
			if (a.file.name[-1] == 'p'):
		 		name = a.file.name				
				cmd = "sudo ffmpeg -i ../media" + name + " -acodec pcm_u8 out.wav;"
				p = subprocess.Popen(cmd , shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
				p.wait()
				cmd = "sudo ipython pd2.py ../media/out.wav"
				p = subprocess.Popen(cmd , shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
				p.wait()
	
;
			return HttpResponse('Done')
	form = UploadFileForm()
	return render(request, 'form.html', {'form': form, 'h': h})

def handle_uploaded_file(f):
	print('c')
	with open('motion.txt', 'wb+') as destination:
		for chunk in f.chunks():
			destination.write(chunk)

# Create your views here.

def home(request):
	return HttpResponse('Hello')
