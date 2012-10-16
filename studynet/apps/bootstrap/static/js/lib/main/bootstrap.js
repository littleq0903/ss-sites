
// Bootstraping the application.


fluorine.Notifier.init()

// How to use 3rd libraries in context-based app ?
// Wrapped them with new contexts.
//
// But this app at least this version, can't wait the State context done.
// So I violated my principles and them should be completed in fluorine's demo projects.
//

// Render an activity object into a template.
//
// ISSUE: Template related to UI, make it impure and different from templates shipped by hard-coding templates ?
// ISSUE: Return context or value ? -- Return context is DEFINITELY RIGHT. But I haven't make it elegant enough.
//
// Activity:: Activity Name Category
//
// :: Activity -> UI DOM
self.app.renderActivity = function(act)
{
    return fluorine.UI('#template .activity').$()
            .clone()
            .find('p')
                .text(act.Name)
                .end()
            .find('h3')
                .text(act.Category)
                .end()
            .done()
            .run()
}

// Calculate how many offsets the activity should move.
//
// ISSUES: Context extracting value should be a monadic value, but UI can't accept non-dom value...
// Or I should re-think about the contexted value ( any value handled ( side-effected ) by any context )
// Or the $() naturally become a way to distinguish between UI DOM and UI a. Once $() called, selecting DOM chain begin.
//
// overlab:: Boolean. Overlap acitivities or not.
self.app.offsetNewActivity = function(overlap)
{
    if( 1 == $('.activities .activity').length )
    {
        // Offset must add margins of the container.
        return $('.activities').eq(0).offset().left + Number($('.activities').eq(0).css('padding-left').replace('px',""))
    }
    else 
    {
        var offset_overlap = 0
        var width_last = $('.activities .activity.last').width() 
        if( overlap ) 
        {   var left = 40   // left 40 px for bottom activity.
            offset_overlap = width_last - 40 
        } 
        return $('.activities .activity.last').data('offset')+$('.activities .activity.last').width()-offset_overlap
    }
}

self.app.offsetCalibration = function(dom_act)
{
    return $('.activities').outerWidth()-$(dom_act).width()
}

fluorine.Event('app.bootstrap')
        ._
         (  function()  // note: Pure prinples violated.
         {
            (function () {
                var converter2 = new Markdown.Converter();

                converter2.hooks.chain("preConversion", function (text) {
                    return text.replace(/\b(a\w*)/gi, "$1");
                });

                converter2.hooks.chain("plainLinkText", function (url) {
                    return "This is a link to " + url.replace(/^https?:\/\//, "");
                });
                
                var help = function () { alert("Do you need help?"); }
                var options = {
                    strings: { quoteexample: "whatever you're quoting, put it right here" }
                };
                var editor2 = new Markdown.Editor(converter2, "", options);
                
                editor2.run();
            })();
         }
         )
        .out('app.bootstrap.done')(function(){return {}})
        .done()
        .run()

// Nested Event context will cause problem. (Fluorine#1)
// Calculate how many activities alread hold before this activity and their length; 
// use whole track's length to minus it, then use the result as the left+ length.
fluorine.Event('app.activities.new')
        ._
         (  function(name, act) // Violate pureness principles to make app finished. 
         {  
            var dom = self.app.renderActivity(act).extract()

            // Append to right-most.
            $(dom).appendTo('.activities .thumbnails').offset({'left': self.app.offsetCalibration() })
            var offset = self.app.offsetNewActivity()   // pass `true` if overlapping activities are needed. 
            $('.activities .activity.last').removeClass('last')
            $(dom).addClass('last').data('offset', offset)  // or if another activity coming, the left will get wrong offset.

            return fluorine.UI(dom).$()
                        .animate
                        (
                        {  left: offset
                        ,  marginLeft: 0    // or left margin will cause position wrong... sucks.   
                        } 
                        ,  5000
                        )
                        .done().run()
          }
          )
         .out('_')(function(){return {}})
         .done()
         .run()

// Forward all needed events to app level.
fluorine.UI('document').$()
        .forward('ready')
         (  function()
         {
            return 'app.bootstrap'
         }
         )
        .done()
        .run()

/*
fluorine.UI('body').$()
        .forward()
*/

//fluorine.Notifier.trigger({name: 'app.activities.new', activity:{Name: 'foobar', Category: 'comment'} })
