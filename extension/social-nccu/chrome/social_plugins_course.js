
var tmpl = {}
tmpl['btn_social_course'] = function(courseId)
{   
    return "<span class='btn social-course' id='c"+courseId+"'>加入到 Social Study</span>" 
}

tmpl['label_forward_done'] = function(courseId)
{
    var t = 
    [ "<span class='label forward-done' id='c"+courseId+"'>已加入"
    , "<a href='"+URL_ROOT+"/courses/"+SCHOOL+"/"+courseId+"' target='_blank'>StudyNet</a>"
    , "</span>"
    ].join("")

    return t
}

var URL_ROOT = "http://127.0.0.1:8090"
var SCHOOL = "nccu"

// ----

// UI () -> Bool
var isQryPage = function()
{
    return ( 0 != $('.maintain_profile_content_table').length )
}

// UI () -> UI [DOM]
var fn$QryDescRow = _.memoize
(   function()
    {
        return $('.maintain_profile_content_table tr[id]')
            .filter
             (  function()
                {   return null!= ($(this).attr('id')).match("_Qrytt$")  }
             )
    }
)

// NOTE: Get single row will be a DOM Row, not a (UI Row)
// UI [DOM]
var fn$QryDataRow = _.memoize
(    function()
     {
        var data_rows = $('.maintain_profile_content_table tr[id]')
            .filter(function(){ {   return null!= ($(this).attr('id')).match("_QryTr$")  }})
            .clone()    // prevent ui change after add some cells.
            .toArray()

        // Unfortunately, the name of course is not in the info row.
        // We should manually add it into the DOM.
        var desc_rows = fn$QryDescRow().toArray()
        _.each
        (   desc_rows
        ,   function(row, idx)
            {   // The CourseName cell is the head of a description row.
                // Clone it's infomation and append it into data row.
                $(data_rows[idx]).children('td[class]:last')
                    .after( $(row).children('td[class]:first').clone().hide() )
            }
        )

        return $(data_rows)
    }
)

// ---- 

// UI [DOM], [CourseId] -> UI [Buttom]
var addBtn = function($doms, ids)
{
    $doms.find('span[id]:first')
         .each
          ( function(idx)
            {
                var btn = tmpl['btn_social_course'](ids[idx])
                $(this).after(btn)
            }
          )

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
var parseInfoRow = _.memoize
(   function($row)
    {
        var __text = function(td){ return $(td).text().replace(/\s/g,"") }
        var parseSlots = 
        [   { 'toTraceList': function(td){ return $(td).find('input:first').attr('name')} }
        ,   { 'semester'   : __text }
        ,   { 'courseId'   : __text }
        ,   { 'teacher'    : __text }
        ,   { 'credit'     : __text }
        ,   { 'dateTime'   : __text }
        ,   { 'place'      : __text }
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
        ,   { 'courseName' : __text }
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
)

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

    // Unfortunately, the name of course is not in the info row.
    // We should manually add it into the DOM, even though the course name info is needn't.
    $row.append('<td style="display:none"></td>')

    // Make sure the couse data sending before forward.
    if( 0 == ioUpdateCourse.ts_flush )
    {
        ioUpdateCourse().flush()
    }

    // Flush background parsed data with this one.
    ioForwardCourse( parseInfoRow($row)['courseId'] ).flush()
}

note.cb['social-course.forward_done'] = function(name, ids)
{
    _.each
    (   ids
    ,   function(id)
        {   // Find the button with courseId, and replace it.
            $('#'+'c'+id).replaceWith(tmpl['label_forward_done'](id))
        }
    )
}

// Each signal bring left rows of data.
//
// Signal (SignalName, UI [DOM])
note.cb['signal.collect_result'] = function(name, $rows)
{
    // Change the $rows.
    if( 1 != $rows.length )
    {
        var data = parseInfoRow($($rows.pop()))
        data['school'] = SCHOOL
        ioUpdateCourse( data )
        _.defer(function(){  note('signal.collect_result', $rows) })
    }
    else
    {
        var data = parseInfoRow($($rows.pop()))
        data['school'] = SCHOOL
        ioUpdateCourse( data ).flush()  //final
    }
}

// ----

// IO CourseData -> { flush: IO () }
var ioUpdateCourse = function(data)
{
    var fnFlush = function(buffer)
    {   if(0 == buffer.length ) { return }
        $.post(URL_ROOT+'/courses/update/batch/', JSON.stringify(buffer))
         .success
          ( function()
            {
                ioUpdateCourse.ts_flush = Date.now()
            }
          )
         .error
          ( function()
            {
          
            }
          )
    }

    // IO send null should be an acceptable thing ( do no-op is still an instruction ).
    if( null == data)
    {
        return {flush: function(){ fnFlush(ioUpdateCourse.buffer) }}
    }

    ioUpdateCourse.buffer.push(data)
    return {flush: function(){ fnFlush(ioUpdateCourse.buffer) }}
}
ioUpdateCourse.buffer = []
ioUpdateCourse.ts_flush = 0

// IO CourseId -> { flush: IO () }
var ioForwardCourse= function(id)
{
    ioForwardCourse.buffer.push(id)

    var fnFlush = function(buffer)
    {   
        var ids = buffer
        $.post(URL_ROOT+'/courses/forward', JSON.stringify({'school': SCHOOL, 'ids': ids}))
         .success
          ( function()
            {
                note('social-course.forward_done', ids)
            }
          )
         .error
          ( function()
            {
                //FIXME: only for test
                note('social-course.forward_done', ids)
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
        var courseIds = function()
        {
            return _.map
            (   fn$QryDataRow()
            ,   function(dom_row)
                {   return parseInfoRow($(dom_row))['courseId']
                }
            )
        }

        addBtn(fn$QryDescRow(), courseIds() )
        note('signal.collect_result',fn$QryDataRow().toArray())
    }
}

main()

