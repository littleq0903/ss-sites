
var tmpl = {}
tmpl['btn_social_course'] = "<span class='btn social-course'>加入到 Social Study</span>"

var URL_ROOT = "http://127.0.0.1:8090"

// ----

// UI () -> Bool
var isQryPage = function()
{
    return ( 0 != $('.maintain_profile_content_table').length )
}

// UI () -> UI [DOM]
var fn$QryDescRow = function()
{
    return $('.maintain_profile_content_table tr[id]')
        .filter
         (  function()
            {   return null!= ($(this).attr('id')).match("_Qrytt$")  }
         )
}

var fn$QryDataRow = function()
{
    return $('.maintain_profile_content_table tr[id]')
        .filter(function(){ {   return null!= ($(this).attr('id')).match("_QryTr$")  }})
}

// ---- 

// UI [DOM] -> UI [Buttom]
var addBtn = function($doms)
{
    $doms.find('span[id]:first').after($(tmpl['btn_social_course']))

    // Forward the event.
    $doms.find('.btn.social-course')
         .click
         (  function(event)
            {    note('social-course', event)
         
            }
         )
}

// Parse the Qry row and get infos
//
// UI DOM -> QryResult
var parseInfoRow = function($row)
{
    var __text = function(td){ return $(td).text().replace(/\s/g,"") }
    var parseSlots = 
    [   { 'toTraceList': function(td){ return $(td).find('input:first').attr('name')} }
    ,   { 'semester'   : __text }
    ,   { 'courseId'   : __text }
    ,   { 'teacher'    : __text }
    ,   { 'credit'     : __text }
    ,   { 'dateTime'   : __text }
    ,   { 'place'   : __text }
    ,   { 'syllabus'   : function(td){ return $(td).find('input:first').attr('name')}  }
    ,   { 'way'        : __text }
    ,   { 'isRemote'   : __text }
    ,   { 'language'   : __text }
    ,   { 'classGECL'  : __text }
    ,   { 'charge'     : __text }
    ,   { 'auxiliary'  : __text }
    ,   { 'department' : __text }
    ,   { 'volume'     : __text } // course occurs 1 or 2 semester(s)
    ,   { 'category'   : __text } // required | elective... 
    ,   { 'isKernel'   : __text }
    ,   { 'numLeft'    : __text }
    ,   { 'numQueue'   : __text }
    ]

    var tds = $row.find('td')
    return _.reduce
    (   tds
    ,   function(result, td, idx)
        {
            var key = _.keys(parseSlots[idx])[0]
            var fn  = _.values(parseSlots[idx])[0]
            result[key] = fn(td)
            return result
        }
    ,   {}
    )
}

// ----

// Vanilla notifier.
var note = function(name, data)
{
    var cb = note.cb[name]
    if( cb )
    {   cb(name, data)

    }
}

note.cb = {}
note.cb['social-course'] = function(name, data)
{   
    // Find the row and parse it.
    var $row = $(data.currentTarget)
        .parents('tr[id]')
        .siblings('tr[id]')
        .filter(function(){ {   return null!= ($(this).attr('id')).match("_QryTr$")  }})
        .eq(0)

    // Flush background parsed data with this one.
    ioForwardCourse(parseInfoRow($row)['courseId']).flush()
}

// Each signal bring left rows of data.
//
// Signal (SignalName, UI [DOM])
note.cb['signal.collect_result'] = function(name, $rows)
{
    // Change the $rows.
    if( 1 != $rows.length )
    {
        ioUpdateCourse( parseInfoRow($($rows.pop())) )
        _.defer(function(){  note('signal.collect_result', $rows) })
    }
    else
    {
        ioUpdateCourse( parseInfoRow($($rows.pop())) ).flush()  //final
    }
}

// ----

// IO CourseData -> { flush: IO () }
var ioUpdateCourse = function(data)
{
    ioUpdateCourse.buffer.push(data)

    var fnFlush = function(buffer)
    {   $.post(URL_ROOT+'/course/update/batch', JSON.stringify(buffer))
         .success
          ( function()
            {
            
            }
          )
         .error
          ( function()
            {
          
            }
          )
    }

    return {flush: function(){ fnFlush(ioUpdateCourse.buffer) }}
}
ioUpdateCourse.buffer = []

// IO CourseId -> { flush: IO () }
var ioForwardCourse= function(id)
{
    ioForwardCourse.buffer.push(id)

    var fnFlush = function(buffer)
    {   $.post(URL_ROOT+'/course/forward', JSON.stringify(buffer))
         .success
          ( function()
            {
                // Open new Application: Social Study
                window.location.href = "http://www.nccu.edu.tw/" 
            }
          )
         .error
          ( function()
            {
                window.location.href = "http://www.nccu.edu.tw/" 
            }
          )
    }

    return {flush: function(){ fnFlush(ioForwardCourse.buffer) }}
}
ioForwardCourse.buffer = []

// ----

var main = function()
{
    if( isQryPage )
    {
        addBtn(fn$QryDescRow())
        note('signal.collect_result',fn$QryDataRow().toArray())
    }
}

main()

