
self.app = self.app || {}
self.app.settings = self.app.settings || {}
self.app.settings.DEBUG = true

/* Not merged yet.
self.app.bootstrap.onArrive = function(id)
{   
    $('script[subpage="'+id+'"]').remove()
    if( true == self.app.settings.DEBUG ){ console.log("[DEBUG] Subpage arrived: ",id) }

    var $subpage = $('[subpage="'+id+'"]')

    // Template will not be append into normal place.
    if(! $subpage.hasClass('template') )
    {
        $('#'+id).replaceWith($subpage)
        $('[subpage="'+id+'"]').attr('id',id)
    }
    else
    {
        $('#template').append($subpage)
    }
}
*/
