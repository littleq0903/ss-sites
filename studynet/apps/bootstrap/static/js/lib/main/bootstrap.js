
// Bootstraping the application.


fluorine.Notifier.init()

// How to use 3rd libraries in context-based app ?
// Wrapped them with new contexts.
//
// But this app at least this version, can't wait the State context done.
// So I violated my principles and them should be completed in fluorine's demo projects.
//

// Activity:: Activity Id Name Categories

// Active corresponding activities channel.
//
// :: ChannelType -> UI ()
self.app.activeChannel = function(type)
{
    $('.activities.active').removeClass('active')
    $('.activities').find('[channel="'+type+'"]').addClass('.active')
}

// Find a filter to match the activity.
//
// :: ChannelType -> ( Activity -> Boolean )
self.app.makeFilter = function(type)
{
    var simpleMatch = function(type)
    {
        return function(act)
        {
            return ( undefined != _.find(act.Categories, function(cat){ return cat == type} )) 
        }
    }

    var dispatch = 
    {   'all': function(act){ return true } 
    ,   'friend': simpleMatch('friend')
    ,   'system': simpleMatch('system')
    }

    return dispatch[type]
}

// Render an activity object into a template.
//
// ISSUE: Template related to UI, make it impure and different from templates shipped by hard-coding templates ?
// ISSUE: Return context or value ? -- Return context is DEFINITELY RIGHT. But I haven't make it elegant enough.

// :: Activity -> UI DOM
self.app.renderActivity = function(act)
{
    return $('#template .activity')
            .clone()
            .find('p')
                .text(act.Name)
                .end()
            .find('h3')
                .text(act.Category)
                .end()
            .click
             (  function(e)
             {  var act_dom = this

                $('body').bind
                 ( 'click.unfocus'
                 , function(e)
                 {    if( ! $(e.target).parents().andSelf().hasClass('activity') )
                      { $(act_dom).removeClass('active') }
                 } 
                 )
                $(this).siblings('.active').removeClass('active')
                $(this).addClass('active') 
             }
             )
}

// Calculate how many offsets the activity should move.
//
// ISSUES: Context extracting value should be a monadic value, but UI can't accept non-dom value...
// Or I should re-think about the contexted value ( any value handled ( side-effected ) by any context )
// Or the $() naturally become a way to distinguish between UI DOM and UI a. Once $() called, selecting DOM chain begin.
//
// overlap:: Boolean. Overlap acitivities or not.
//
// :: UI DOM Channel -> Boolean -> Offset
self.app.offsetNewActivity = function(channel, overlap)
{
    // css class ".active" is for multi channel activities.
    if( 1 == $(channel).find('.activity').length )
    {
        // Offset must add margins of the container.
        return $(channel).offset().left + Number($(channel).css('padding-left').replace('px',""))
    }
    else 
    {
        var offset_overlap = 0
        var width_last = $(channel).find('.activity.last').width() 
        if( overlap ) 
        {   var left = 40   // left 40 px for bottom activity.
            offset_overlap = width_last - 40 
        } 
        return $(channel).find('.activity.last').data('offset')+$(channel).find('.activity.last').width()-offset_overlap
    }
}

// **Not Implemented yet **
// Read in an activity.
//
// :: Id -> Callback Activity -> IO ()
self.app.readActivity = function(id, fn)
{
    return self.app.Table[id]
}

// :: Id -> IO Activity
self.app.readActivitySync = function(id)
{
    // Use big object to construct key/value storage unless Web Stroage can storage real object,
    // or I finished the async IndexedDB's APIs.
}

// **Not Implemented yet **
// Write out an activity.
//
// :: Id -> Activity -> Callback -> IO ()
self.app.writeActivity = function(id, act, fn)
{

}

// :: Id -> Activity -> IO ()
self.app.writeActivitySync = function(id, act)
{
    self.app.Table[id] = act
}

// If merge with last activity in the channel ?
//
// :: UI DOM Channel -> UI DOM Activity -> Boolean
self.app.ifMerge = function(channel, act)
{
    // Find last activity.
    var last = $(channel).find('.activity.last')
    var id = $(last).data('Id')
    return true
}

//
// :: UI DOM Channel -> DOM Activity -> Offset
self.app.offsetCalibration = function(channel, dom_act)
{
    return $(channel).outerWidth()-$(dom_act).width()
}

fluorine.Event('app.bootstrap')
        ._
         (  function()
         {
            // Prepare data storage. Even though the IndexedDB is a perfect way to storage things,
            // but I have no time to construct a context to fit it's async IO.
            self.app.Table = {}

            /*
            self.indexedDB = self.indexedDB || self.webkitIndexedDB || self.mozIndexedDB;
            var request = self.indexedDB.open('socialstudy')
            request.onerror = function(e){ console.error('[ERROR] Open database got wrong.'); throw e }
            request.onsuccess = function()
            {
                var db = request
            }
            */
         }
         )
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
            // Note: These codes consider only one channel, and will be refactored to multiple channels version.
            var channel = $('.activities.active') 


            // 1. Render DOM
            // 2. Filter it with n channels, and pickup fitted channels.
            // 3. Detect if merge, bind the result with those channels
            // 4. Append the DOM into those channels, simulateously, and pass if merge to let channels do merge.

            var dom = self.app.renderActivity(act)


            // Append to right-most.
            $(dom).appendTo($(channel).find('.thumbnails')).offset({'left': self.app.offsetCalibration(channel, dom) })
            // pass `true` if overlapping activities are needed. 
            var offset = self.app.offsetNewActivity($('.activities.active'), self.app.ifMerge(channel, dom) )   
            $(channel).find('.activity.last').removeClass('last')
            $(dom).addClass('last').data('offset', offset)  // or if another activity coming, the left will get wrong offset.

            return fluorine.UI(dom).$()
                        .animate
                        (
                        {  left: offset
                        ,  marginLeft: 0    // or left margin will cause position wrong... sucks.   
                        } 
                        ,  $(channel).hasClass('active') ? 2000 : 0 // set to 0 if animation isn't important.
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

//fluorine.Notifier.trigger({name: 'app.activities.new', activity:{Name: 'foobar', Categories: ['friend','comment']} })
