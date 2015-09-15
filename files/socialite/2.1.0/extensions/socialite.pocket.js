/*!
 * Socialite v2.0 - Pocket
 * http://socialitejs.com
 * Dual-licensed under the BSD or MIT licenses: http://socialitejs.com/license.txt
 */
(function(window, document, Socialite, undefined)
{
    // External documentation URLs
    // http://getpocket.com/publisher/button
    
    Socialite.network('pocket', {
        script: {
            src: '//widgets.getpocket.com/v1/j/btn.js?v=1'
        }
    });

    Socialite.widget('pocket', 'button', {
        reappend: null,
        init: function(instance)
        {
            var el = document.createElement('a');
            el.className = 'pocket-btn';
            Socialite.copyDataAttributes(instance.el, el);
            el.setAttribute('href', instance.el.getAttribute('data-default-href'));
            instance.el.appendChild(el);
        },
        activate: function(instance)
        {
            var w = instance.widget,
                n = w.network.name;
            if (Socialite.networkReady(n)) {
                if (w.reappend) {
                    clearTimeout(w.reappend);
                }
                w.reappend = setTimeout(function() {
                    Socialite.reloadNetwork(n);
                }, 50);
            }
        }
    });

})(window, window.document, window.Socialite);
