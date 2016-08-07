/*!
 * Socialite v2.0 - YouTube extension
 * http://socialitejs.com
 * Copyright (c) 2014 David Bushell
 * Dual-licensed under the BSD or MIT licenses: http://socialitejs.com/license.txt
 */
(function(window, document, Socialite, undefined)
{
    // https://developers.google.com/youtube/youtube_subscribe_button

    Socialite.setup({
        youtube: {
            lang: 'en-GB'
        }
    });

    Socialite.network('youtube', {
        script: {
            src     : '//apis.google.com/js/platform.js'
        },
        append: function(network)
        {
            if (window.gapi) {
                return false;
            }
            window.___gcfg = {
                lang: Socialite.settings.youtube.lang,
                parsetags: 'explicit'
            }
            
        }
    });

    Socialite.widget('youtube', 'subscribe', {
        process: null,
        init: function(){

        },
        activate: function(instance)
        {
            if(window.gapi){
                var container = instance.el;
                var options = {
                    'layout': instance.el.getAttribute('data-layout')?instance.el.getAttribute('data-layout'):'default',
                    'theme': instance.el.getAttribute('data-theme')?instance.el.getAttribute('data-theme'):'default',
                    'count': instance.el.getAttribute('data-count')?instance.el.getAttribute('data-count'):'default',
                };

                //channel or channel id
                if(instance.el.getAttribute('data-channelid')){
                    options.channelid = instance.el.getAttribute('data-channelid');
                } else {
                    options.channel = instance.el.getAttribute('data-channel');
                }

                gapi.ytsubscribe.render(container, options);
            }
        }

    });

})(window, window.document, window.Socialite);
