# Not real BigPipe yet, but HTTP streaming only. 

from django.http import HttpResponse
from django.template.loader import render_to_string
from django.views.decorators.http import condition
from django.template import RequestContext

@condition(etag_func=None)  # for HTTP streaming
def ship(request):

    resp = HttpResponse(do_ship(request), mimetype='text/html')

    return resp

def do_ship(request):

    # '.' will cause empty content.
    resources = { 
      'home_css': "/** Merged and Compiled LESS file here **/",
      'home_js' : "/** Merged Javascript file here **/",
      'course_css': "/** Merged and Compiled LESS file here **/",
      'course_js' : "/** Merged Javascript file here **/",
      'course_css': "/** Merged and Compiled LESS file here **/",
      'course_js' : "/** Merged Javascript file here **/",
      'application_css': "/** Merged and Compiled LESS file here **/",
      'application_js' : "/** Merged Javascript file here **/"+APPLICATION_JS,
    }

    # context_instance for STATIC_URL in templates.
    yield render_to_string("application/initialize.html", resources, context_instance=RequestContext(request) ).ljust(4096) 
    yield render_to_string("home/home.html", resources, context_instance=RequestContext(request) ).ljust(4096)
    #yield render_to_string("course/course.html", resources ).ljust(4096)
    #yield render_to_string("courses/courses.html", resources ).ljust(4096) 
    yield render_to_string("application/finalize.html", resources, context_instance=RequestContext(request) ).ljust(4096) 

# Temporarily bootstraping Javascript should be replaced in application.js .
APPLICATION_JS = """
    self.app = {}
    self.app.settings  = { 'DEBUG': true }
    self.app.bootstrap = {}
    self.app.bootstrap.onArrive = function(id)
    {   
        $('script[subpage="'+id+'"]').remove()
        if( true == self.app.settings.DEBUG ){ console.log("[DEBUG] Subpage arrived: ",id) }
        $('#'+id).replaceWith($('[subpage="'+id+'"]'))
        $('[subpage="'+id+'"]').attr('id',id)

    }

"""
