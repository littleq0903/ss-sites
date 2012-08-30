# Create your views here.
from django.http import HttpResponseRedirect

def input_view(request):
    return HttpResponseRedirect("/")
