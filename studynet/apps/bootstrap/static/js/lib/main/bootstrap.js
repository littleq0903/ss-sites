
// Bootstraping the application.


fluorine.Notifier.init()

// How to use 3rd libraries in context-based app ?
// Wrapped them with new contexts.
//
// But this app at least this version, can't wait the State context done.
// So I violated my principles and them should be completed in fluorine's demo projects.
//

// Activity:: Activity Id Name Categories
// CourseInfo:: CourseInfo CourseId Name Semester Teacher Students Location 
// Students:: [User] {- friends of the user -}
// User:: User UserId GravatarURL Name 
// Note:: Note NoteId Name Author DateTime Content

// Active corresponding activities channel.
//
// :: ChannelType -> UI ()
self.app.activeChannel = function(type)
{
    $('.activities.active').removeClass('active')
    $('.activities').find('[channel="'+type+'"]').addClass('.active')
}

// :: Action -> UI DOM Channel
self.app.filterChannels = function(act)
{
    var channels = $('.activities').toArray()
    var result = _.filter
    (  channels
    ,  function(ch)
    {
        var attr = $(ch).attr('channel')
        if( 'all' == attr ) { return true; } 
        return ( undefined != _.find(act.Categories, function(cat){ return cat == attr }) )
    }
    )
    return result
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
            .data('Id',act.Id)
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
        // Invisible activities can't detect offset ( will be 0 )... 
        // return $(channel).offset().left + Number($(channel).css('padding-left').replace('px',""))
        // Fortunately our activities are in the same place.
        //    
        // Offset must add margins of the container.
        return ($('.activities:visible').eq(0).offset().left + Number($(channel).css('padding-left').replace('px',"")) )
    }
    else 
    {
        var offset_overlap = 0
        var gap = overlap ? 0 : 5   // gap between not merge activity.
        var width_last = $(channel).find('.activity.last').width() 
        if( overlap ) 
        {   var left = 40   // left 40 px for bottom activity.
            offset_overlap = width_last - 40 
        } 
        return $(channel).find('.activity.last').data('offset')+$(channel).find('.activity.last').width()-offset_overlap+gap
    }
}

// **Not Implemented yet **
// Read in an activity.
//
// :: Id -> Callback Activity -> IO ()
self.app.readActivity = function(id, fn)
{

}

// :: Id -> IO Activity
self.app.readActivitySync = function(id)
{
    // Use big object to construct key/value storage unless Web Stroage can storage real object,
    // or I finished the async IndexedDB's APIs.
    return self.app.TableActivity[id]
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
    self.app.TableActivity[id] = act
}

// :: CourseId -> IO Course
self.app.readCourseSync = function(cid)
{
    return self.app.TableCourse[cid]
}

// :: CourseId -> CourseInfo -> IO ()
self.app.writeCourseSync = function(cid, info)
{
    self.app.TableCourse[cid] = info
}

// If merge with last activity in the channel ?
//
// :: UI DOM Channel -> Activity -> Boolean
self.app.ifMerge = function(channel, act)
{
    // Find last activity.
    var last = $(channel).find('.activity.last').get(0)
    if( undefined == last )
    {
        return false
    } 
    var id = $(last).data('Id')
    var act_last = self.app.readActivitySync(id)

    // Mutiple merge strategies ?
    // 
    // This strategy is find same tags in both act.
    return ( 0 != _.intersection( act_last.Categories, act.Categories ).length )

    // TODO: shouldn't intersect channel cat !!
}

//
// :: UI DOM Channel -> DOM Activity -> Offset
self.app.offsetCalibration = function(channel, dom_act)
{
    return $(channel).outerWidth()-$(dom_act).width()
}

self.app.queryYouTube = function SearchYouTube(query, callback) 
{
        $.ajax({
        url: 'http://gdata.youtube.com/feeds/mobile/videos?alt=json-in-script&q=' + query,
        dataType: 'jsonp',
        success: function (data) {
            callback(data)
        },
        error: function () {
            throw new Error("Error loading youtube video results");
        }
        });
        return false
}

fluorine.Event('app.bootstrap')
        ._
         (  function()
         {
            // Prepare data storage. Even though the IndexedDB is a perfect way to storage things,
            // but I have no time to construct a context to fit it's async IO.
            self.app.TableActivity = {}
            self.app.TableCourse = {}

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
         (  function()
         {
             var course = 
             {   'Name'    : '編譯器設計'
              ,   'CourseId': 'c1'
              ,   'Semester': '101/1'
              ,   'Teacher' : 'CK'
              ,   'DateTime': '周三456'
              ,   'Students': []
              ,   'Location': 'nccu'
              ,   'Department':  'nccu'
              ,   'Notes'   : ['n1','n2','n3','n4','n5']
              ,   'Comments': ['c1','c2','c3','c4','c5','c6','c7','c8']
              ,   'Media'   : ['Complier Desig','開放式課程 Compiler', 'Coursera Compiler']
             }

             self.app.writeCourseSync('c1', course)
             fluorine.Notifier.trigger({name: 'app.course.switch', cid: course.CourseId})
         }
         )
        ._
         (  function()
         {
             // Fill course navs up. Initializing step, and should replace the dummy course with a new one.
             // sections -- name:type
             var sections =
             [
             {   'name'   : "編譯器設計"
             ,   'subpage': "media"
             ,   'id-data': "compiler_design"
             ,   'type'   : "app.tabs.course.active"
             }
             ]

             fluorine.Notifier.trigger({name: 'app.course-nav.put', sections: sections })
         }
         )
        ._
         (  function()
         {
            $('#home-container .home-tabs-nav')
                .find('li a')
                .click
                 (  function(e)
                 {  event.preventDefault();
                    var $tab_active = $(this).parent('li')
                    if( $tab_active.hasClass('active') ){ return }     // click on actived tab, do nothing.

                    fluorine.Notifier.trigger({'name': 'app.tabs.active', 'tab': $tab_active.find('a').attr('href').replace(/#/, "") }) 
                 
                    var $tab_deactive = $('#home-container .home-tabs-nav li.active').add('#course-nav li.active')
                    var name_deactive = $tab_deactive.find('a').attr('href').replace(/#/,"")
                    $tab_deactive.removeClass('active')
                    $tab_active.addClass('active')
                    fluorine.Notifier.trigger({'name': 'app.tabs.deactive', 'tab': name_deactive })
                 }
                 )
                .end()
         }
         )
        ._
         (  function()  // note: Pure prinples violated. Initialize note.
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
         ._
         (  function()
         {   $('#side-chatroom')
                .find('.handler')
                    .toggle(    function(){ fluorine.Notifier.trigger('app.chatroom.side.active')}
                           ,    function(){ fluorine.Notifier.trigger('app.chatroom.side.deactive')}
                           )
                    .end()
                .find('.toggle-list')
                    .click( function(){ fluorine.Notifier.trigger('app.chatroom.side.list.active') })
                    .end()
                .find('.toggle-room')
                    .click( function(){ fluorine.Notifier.trigger('app.chatroom.side.room.active') })
                    .end()
                .find('.list tr')
                    .find('td')
                        .click( function(){ fluorine.Notifier.trigger('app.chatroom.side.room.switch') } )
                        .end()
                    .end()
                .find('.room .input')
                    .click
                     ( function(e)
                     {   e.stopPropagation() 
                         fluorine.Notifier.trigger('app.chatroom.side.room.input.prepare')
                     } 
                     )
                    .keypress
                     (  function(e)
                     {
                         if( e.which == 13 && ! e.shiftKey )
                         {
                             fluorine.Notifier.trigger('app.chatroom.side.room.input.done')
                             event.preventDefault();
                         }
                     }
                     )
                     .end()

                $('body').bind
                 ( 'click.unfocus'
                 , function(e)
                 {    if( ! $(e.target).parents().andSelf().is('[id="#side-chatroom"]') )
                      {   $input = $('#side-chatroom .room .input')
                          if( "" == $input.text() )
                          {
                              $input.addClass('tipon') 
                          }
                      }
                 } 
                 )
         }
         )
        .out('app.bootstrap.done')(function(){return {}})
        .done()
        .run()

fluorine.Event('app.tabs.active')
        ._
         (  function(nname, name)
         {
             var dispatch =
             {  'note-editor': 'app.tabs.note-editor.active'
             ,  'user-guide' : 'app.tabs.user-guide.active'
             ,  'course'     : 'app.tabs.course.active'
             }
             fluorine.Notifier.trigger(dispatch[name])
         }
         )
        .out('_')(function(){return {}})
        .done()
        .run()

fluorine.Event('app.tabs.deactive')
        ._
         (  function(nname, name)
         {
             var dispatch =
             {  'note-editor': 'app.tabs.note-editor.deactive'
             ,  'user-guide' : 'app.tabs.user-guide.deactive'
             ,  'comments'   : 'app.tabs.course.deactive'       // course-nav tabs should be delegated to another functions.
             ,  'map'        : 'app.tabs.course.deactive'       // course-nav tabs should be delegated to another functions.
             ,  'notes'      : 'app.tabs.course.deactive'       // course-nav tabs should be delegated to another functions.
             ,  'media'      : 'app.tabs.course.deactive'       // course-nav tabs should be delegated to another functions.
             }
             fluorine.Notifier.trigger(dispatch[name])
         }
         )
        .out('_')(function(){return {}})
        .done()
        .run()

fluorine.Event('app.tabs.note-editor.active')
        ._
         (  function(name)
         {
             $('#note-editor').addClass('active')
         }
         )
        .out('_')(function(){return {}})
        .done()
        .run()

fluorine.Event('app.tabs.note-editor.deactive')
        ._
         (  function(name)
         {
             $('#note-editor').removeClass('active')
         }
         )
        .out('_')(function(){return {}})
        .done()
        .run()

fluorine.Event('app.tabs.user-guide.active')
        ._
         (  function(name)
         {
             $('#user-guide').addClass('active')
         }
         )
        .out('_')(function(){return {}})
        .done()
        .run()

fluorine.Event('app.tabs.user-guide.deactive')
        ._
         (  function(name)
         {
             $('#user-guide').removeClass('active')
         }
         )
        .out('_')(function(){return {}})
        .done()
        .run()

// TODO: a lots of work to do...
fluorine.Event('app.course.switch')
        ._
         (  function(name, cid)
         {  
             // Write the current course id.
             $('#template [subpage="course"]').data('course-id', cid)
         }
         )
        //.out('app.tabs.course.active')(function(){ return {} }) // Delegate to active to render page.
        .out('_')(function(){ return {} }) // Delegate to active to render page.
        .done()
        .run()

// TODO: course name data
fluorine.Event('app.tabs.course.active')
        ._ 
         (  function(name)
         {  
            // Incoming course should add the info into the preparing to clone template. 
            var info = self.app.readCourseSync($('#template [subpage="course"]').data('course-id'))
            var simpleText = function(el, txt)
            {
                $(el).text(txt)
            }

            var students = function(ul, students)
            {
                $(ul).find('li')
                     .each
                      (  function($el)
                      {
                         var user = students.pop()
                         $el.find('.gravatar').append('<img src="'+user.GravatarURL+'" />')
                         $el.find('.name').text(user.Name)
                      }
                      )
            }

            var bindOpenMain = function(h3, data)
            {
                // Prevent double binding. Lazy way... ( detect bound events more better )
                $(h3).unbind('click.note')
                $(h3).bind
                (   'click.note'
                ,   function($e)
                {
                    // Cancel all actived subpages.
                    $('#home-tabs div[subpage="course"] .subpage.active').removeClass('active')
                    fluorine.Notifier.trigger({'name': 'app.course.subpage.active', 'subpage': $(h3).attr('class'), 'data': data})
                }
                )
            }

            // data become like tags.
            var queryMedia = function(h3, data)
            {
                var qry_success = function(data) 
                {
                    $('[subpage="course"] h3.Media').attr('data-num',data.feed.entry.length)
                    _.each
                    (   data.feed.entry
                    ,   function(ent)
                    {   // No paging yet. TODO.

                        var img_src = ent.media$group.media$thumbnail[0].url
                        var src =  ent.media$group.media$player[0].url
                        var title =  ent.media$group.media$title.$t
                        var count = ent.yt$statistics.viewCount
                        var author = ent.author[0].name.$t 

                        $('[subpage="course-main-media"] .wall .wrapper').append('<div><a href="'+src+'" target="_blank"><img src="'+img_src+'"></a></div>')
                    }
                    ) 
                }
                
                _.each( data , function(name){ self.app.queryYouTube(name, qry_success)})
            }

            var updateNav = function(name, subpage, id_data, type)
            {
                //TODO: Rese before new one.
                // These label all second level label, so ignore before labels is safe.
                /*
                var sections = _.map
                (   $('#course-nav li')
                ,   function(li)
                {
                    return $(li).data('data-sec')
                }
                )
                */

                sections = [ $('#course-nav li:first').data('data-sec') ]
                sections.push
                (
                 {   'name'   : name
                 ,   'subpage': subpage
                 ,   'id-data': id_data
                 ,   'type'   : type
                 }
                )

                fluorine.Notifier.trigger({name: 'app.course-nav.put', sections: sections })
            }

            var dispatch = 
            {   'Name'    : simpleText  
            ,   'Semester': simpleText
            ,   'Teacher' : simpleText
            ,   'DateTime': simpleText
            ,   'Location': function(el, data)
                            {  $(el).attr('data-num', data.length )
                               $(el).click
                               (    function()
                               {    updateNav('地點', 'Map', info.CourseId, 'app.course.subpage.media.active') 

                                   // Because click from sidebar won't go though normal click way.
                                   // FIXME: Duplicated paths.
                                   $('#course-nav li:last').addClass('active').find('a').attr('href','map')
                               }
                               )
                               bindOpenMain(el, data)  

                            }
            ,   'Department': simpleText
            ,   'Students': students 
            ,   'Notes'   : function(el, data)
                            {  $(el).attr('data-num', data.length ) 
                               $(el).click
                               (    function()
                               {    updateNav('筆記', 'Notes', info.CourseId, 'app.course.subpage.note.active') 
                                    $('#course-nav li:last').addClass('active')

                                   // Because click from sidebar won't go though normal click way.
                                   // FIXME: Duplicated paths.
                                   $('#course-nav li:last').addClass('active').find('a').attr('href','notes')
                               }
                               )
                                bindOpenMain(el, data)  
                            }
            ,   'Comments': function(el, data)
                            {  $(el).attr('data-num', data.length )
                               $(el).click
                               (    function()
                               {    updateNav('留言', 'Comments', info.CourseId, 'app.course.subpage.comment.active') 
                                    $('#course-nav li:last').addClass('active')

                                   // Because click from sidebar won't go though normal click way.
                                   // FIXME: Duplicated paths.
                                   $('#course-nav li:last').addClass('active').find('a').attr('href','comments')
                               }
                               )
                                bindOpenMain(el, data)  

                            }
            ,   'Media'   : function(el, data)
                            {  queryMedia(el, data)
                               $(el).click
                                (   function()
                                    {  updateNav('影音', 'Media', info.CourseId, 'app.course.subpage.media.active') 

                                       // Because click from sidebar won't go though normal click way.
                                       // FIXME: Duplicated paths.
                                       $('#course-nav li:last').addClass('active').find('a').attr('href','media')
                                    }
                                )
                               bindOpenMain(el, data)  
                            }
            }

            /* Badge ugly...
            ,   'Notes'   : function(el, data){  $(el).find('.badge.badge-info').text(data.length) ; bindOpenMain(el, data)  }
            ,   'Comments': function(el, data){  $(el).find('.badge.badge-info').text(data.length) ; bindOpenMain(el, data)  }
            */

            return [info, dispatch]
         }
         )
        ._
         (  function(info, dispatch)
         {
            var $course = $('#template [subpage="course"]').clone().addClass('active')
            $course.appendTo('#home-tabs')

            $course.find('.sidebar ul.sections .info li')
                .add('ul.sections h2.Name')
                .add('ul.sections h3.Notes')
                .add('ul.sections h3.Comments')
                .add('ul.sections h3.Media')
                .each
                 (   function()
                 {
                     if( undefined === dispatch[$(this).attr('class')] ) { return }
                     dispatch[$(this).attr('class')]($(this), info[$(this).attr('class')])
                 }
                 )
         }
         )
        .out('_')(function(){return {}})
        .done()
        .run()


// a Namespaced active notification.
fluorine.Event('app.tabs.course.deactive')
        ._
         (  function(name)
         {
            $('#home-tabs [subpage="course"]').removeClass('active')
            $('#home-tabs .subpage.template').remove()


             // Reset the nav.
             var sections =
             [
             {   'name'   : "編譯器設計"
             ,   'subpage': "media"
             ,   'id-data': "compiler_design"
             ,   'type'   : "app.tabs.course.active"
             }
             ]

             fluorine.Notifier.trigger({name: 'app.course-nav.put', sections: sections })
         }
         )
        .out('_')(function(){return {}})
        .done()
        .run()

fluorine.Event('app.course.subpage.active')
        ._
         (  function(name, subpage, data)
         {
             // Clone and fill course page first.
             $('#template [subpage="course"]').clone().appendTo('#home-tabs')

             // TODO: fill data in.
             $('#course-main-'+subpage.toLowerCase()).addClass('active')  
             var dispatch =
             {  'Notes'    : 'app.course.subpage.note.active'
             ,  'Comments' : 'app.course.subpage.comment.active'
             ,  'Map'     : 'app.course.subpage.map.active'
             ,  'Media'   : 'app.course.subpage.media.active'
             }
             fluorine.Notifier.trigger({'name': dispatch[subpage], 'data': data})
         }
         )
        .out('_')(function(){return {}})
        .done()
        .run()

//TODO: DEACTIVE.
fluorine.Event('app.course.subpage.note.active')
        ._
         (  function(name, data)
         {
            var $row_tpl   = $('#template [subpage="course-main-note-row"] tr')
            var $table = $('#course-main-note table') 

            var sdata = _.sortBy
            ( data
            , function(d)
            {
                return Number(d.DateTime)
            }
            )
            
            _.each
            ( sdata
            , function(d)
            {
                $row_tpl.clone()
                    .find('td.noteid').text(d.NoteId)
                    .end()
                    .find('td.author').text(d.Author)
                    .end()
                    .find('td.name').text(d.Name)
                    .end()
                    .find('td.date').text((new Date(d.DateTime)).toISOString())
                    .end()
                    .appendTo($table)
            }
            )
         }
         )
        .out('_')(function(){return {}})
        .done()
        .run()

fluorine.Event('app.course.subpage.media.active')
        ._
         (  function(name, names)
         {
             //TODO: wrapper width follow contents, not parent.
                 $(function(){$( "#course-main-media .slider" ).slider({slide: function(e, ui){
                     var wrapw   = $('#course-main-media .wrapper').width()
                     var current = ( wrapw / 100 ) * (-ui.value)
                     if( wrapw + current < 800 )
                 {
                     current += 800     // The last one should not be hidden.
                 }
                     $( "#course-main-media .wrapper" ).css('left', current)
                 }});})



         }
         )
        .out('_')(function(){return {}})
        .done()
        .run()





fluorine.Event('app.course-nav.put')
        ._
         (  function(name, sections)
         {
             var $li  = $('#template [subpage="course-nav-section"] li')
             var $sep = $('#template [subpage="course-nav-section"] span') 
             $('#course-nav').children().not('i').remove()
             _.each
             (  sections
             ,  function(sec)
             {
                 if( 1 < sections.length ) // no need sep if only one section.
                 {
                     if( $('#course-nav li').length != 0 )
                     {
                         $('#course-nav').append($sep.clone())
                     }
                 }
                 $li.clone()
                    .find('a').text(sec.name)
                    .end()
                    .data('data-sec', sec)
                    .click
                     (  function(e)
                     {
                        var $tab_deactive = $('#home-container .home-tabs-nav li.active').add('#course-nav li.active')
                        var name_deactive = $tab_deactive.find('a').attr('href').replace(/#/,"")
                        $tab_deactive.removeClass('active')
                        fluorine.Notifier.trigger({'name': 'app.tabs.deactive', 'tab': name_deactive })

                        $(this).addClass('active').find('a').attr('href','#'+sec.subpage)
                        fluorine.Notifier.trigger({'name': sec.type, 'subpage': sec.subpage, 'data': self.app.readCourseSync(sec['id-data'])})
                     } 
                     )
                    .appendTo('#course-nav')
             }
             )
         }
         )
        .out('_')(function(){return {}})
        .done()
        .run()

fluorine.Event('app.chatroom.side.active')
        ._
         (  function(name)
         {
            $('#side-chatroom').addClass('active')

             // Start chat
         }
         )
        .out('_')(function(){return {}})
        .done()
        .run()


fluorine.Event('app.chatroom.side.deactive')
        ._
         (  function(name)
         {
            $('#side-chatroom').removeClass('active')
         }
         )
        .out('_')(function(){return {}})
        .done()
        .run()

fluorine.Event('app.chatroom.side.room.active')
        ._
         (  function(name)
         {
            $('#side-chatroom .content.list').removeClass('active')
            $('#side-chatroom .content.room').addClass('active')
         }
         )
        .out('_')(function(){return {}})
        .done()
        .run()

fluorine.Event('app.chatroom.side.list.active')
        ._
         (  function(name)
         {
            $('#side-chatroom .content.room').removeClass('active')
            $('#side-chatroom .content.list').addClass('active')
         }
         )
        .out('_')(function(){return {}})
        .done()
        .run()

fluorine.Event('app.chatroom.side.room.switch')
        ._
         (  function(name)
         {
             // Switch room: ws command out.
         }
         )
        ._
         (  function()
         {
             // Switch room: bind new receive user list note.
         }
         )
        .out('_')(function(){return {}})
        .done()
        .run()

fluorine.Event('app.chatroom.side.userlist.put')
        ._
         (  function(name)
         {
            // Receive new userlist: 
         }
         )
        .out('_')(function(){return {}})
        .done()
        .run()

// Message:: Message From Room Time Content
fluorine.Event('app.chatroom.side.message.new')
        ._
         (  function(name, message)
         {
            $('#template [subpage="side-chatroom-message"] .message')
                .clone()
                .find('.from').text(message.Name).end()
                .find('.content').text(message.Content).end()
                .find('.time').text(message.Time).end()
                .appendTo('#side-chatroom .room .body .wall')
             $('#side-chatroom .content .body').scrollTop($('#side-chatroom .content .body .wall').innerHeight())
         }
         )
        .out('_')(function(){return {}})
        .done()
        .run()

fluorine.Event('app.chatroom.side.room.input.prepare')
        ._
         (  function(name)
         {
             $('#side-chatroom .room .input').removeClass('tipon')
         }
         )
        .out('_')(function(){return {}})
        .done()
        .run()

fluorine.Event('app.chatroom.side.room.input.done')
        ._
         (  function(name)
         {
             var text = $('#side-chatroom .room .input').text()
             message = {'From': "FOOBAR", "Room": "FOOROOM", "Content": text, "Time": (new Date()).getTime()}
             return [message]
         }
         )
        ._
         (  function(message)
         {

             $('#side-chatroom .room .input')
             /* Won't work.
                .animate
                 (
                 {  outline: "1px #C0E0FF solid"
                 }
                 ,  500
                 )
                .animate
                 (
                 {  outline: "none"
                 }
                 ,  0
                 )
             */
                 .empty()

             return [message]
         }
         )
        .out('app.io.chat.post')(function(){return {'message': message}})
        .done()
        .run()

// Nested Event context will cause problem. (Fluorine#1)
// Calculate how many activities alread hold before this activity and their length; 
// use whole track's length to minus it, then use the result as the left+ length.
fluorine.Event('app.activities.new')
        ._
         (  function(name, act)
         {
            self.app.writeActivitySync(act.Id, act) 
            return [act]
         }
         )
        ._
         (  function(act) // Violate pureness principles to make app finished. 
         {  
            // Note: These codes consider only one channel, and will be refactored to multiple channels version.
            var channel = $('.activities.active') 


            // 1. Render DOM
            // 2. Filter it with n channels, and pickup fitted channels.
            // 3. Detect if merge, bind the result with those channels
            // 4. Append the DOM into those channels, simulateously, and pass if merge to let channels do merge.
            //

            var channels = self.app.filterChannels(act)
            _.each
            (   channels
            ,   function(ch)
            {
                var dom = self.app.renderActivity(act)
                // Append to right-most.
                $(dom).appendTo($(ch).find('.thumbnails')).offset({'left': self.app.offsetCalibration(ch, dom) })

                // pass `true` if overlapping activities are needed. 
                var offset = self.app.offsetNewActivity(ch, self.app.ifMerge(ch, act) )   
                $(ch).find('.activity.last').removeClass('last')

                // or if another activity coming, the left will get wrong offset.
                $(dom).addClass('last').data('offset', offset)
                      .animate 
                        (
                        {  left: offset
                        ,  marginLeft: 0    // or left margin will cause position wrong... sucks.   
                        } 
                        ,  $(ch).hasClass('active') ? 2000 : 0 // set to 0 if animation isn't important.
                        )
            }
            )
            return 
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

//fluorine.Notifier.trigger({name: 'app.activities.new', activity:{Id: '0',Name: 'foobar', Categories: ['friend','comment']} })
/*
 *
t = 
{ 'name': 'app.chatroom.side.message.new'
, 'message': 
  {  'From': 'frombar'
  ,  'Room': 'rooomc'
  ,  'Time': ((new Date()).toISOString()
  ,  'Content': "abc\nde\ngsgdsgsg\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\nasd\n\n" 
  } 
}

// CourseInfo:: CourseInfo CourseId Name Semester Teacher Students Location Notes Comments Media
// Notes:: [NoteId]
// Comments:: [CommentId]
// Media:: [MediaItem]
course = 
{   'Name'    : '編譯器設計'
,   'CourseId': 'c1'
,   'Semester': '101/1'
,   'Teacher' : 'CK'
,   'Students': []
,   'Location': 'nccu'
}
*/
