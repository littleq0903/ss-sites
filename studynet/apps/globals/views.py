# Create your views here.
import json
import xmltodict
from urllib import urlopen
from django.http import HttpResponse

def yknow_api(request):
    p = request.GET['p']
    API_LOCATION = "http://tw.knowledge.yahooapis.com/v1/SEARCH?appid=Fbn2UILIkYoPqtaNTG6aFYgkHY9piA2A8A--&p=%s&intl=tw" % p
    opener = urlopen(API_LOCATION)
    content = opener.read()

    d = xmltodict.parse(content)

    rtn = json.dumps(d)

    return HttpResponse(rtn, mimetype="application/json")
