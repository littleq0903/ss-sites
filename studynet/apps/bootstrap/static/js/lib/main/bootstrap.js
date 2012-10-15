
// Bootstraping the application.


fluorine.Notifier.init()

// How to use 3rd libraries in context-based app ?
// Wrapped them with new contexts.
//
// But this app at least this version, can't wait the State context done.
// So I violated my principles and them should be completed in fluorine's demo projects.
//

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
        .bind
         (  function()
         {  
            return fluorine.Event('app.activities.new')
                    .bind
                     (  function()
                     {  return fluorine.UI('#activities .__template').$()
                                    .show()
                                    .animate
                                     (
                                     {  left: '+=500'
                                     }
                                     ,  5000
                                     )
                                    .done()
                     }
                     )
                    .out('_')(function(){return {}})
                    .done()
         }
         )
        .out('app.bootstrap.done')(function(){return {}})
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
