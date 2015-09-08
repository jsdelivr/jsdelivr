/*!
 * Socialite v2.0 - DZone extension
 * http://socialitejs.com
 * Copyright (c) 2013 Samuel Santos
 * Dual-licensed under the BSD or MIT licenses: http://socialitejs.com/license.txt
 */
(function(window, document, Socialite, undefined) {
    // http://www.dzone.com/buttons

    Socialite.network('dzone');

    Socialite.widget('dzone', 'submit', {
        process: null,
        init: function(instance) {
            Socialite.processInstance(instance);
            var src    = 'http://widgets.dzone.com/links/widgets/zoneit.html?',
                data = {
                    t           : instance.el.getAttribute('data-style') || '1',
                    url         : instance.el.getAttribute('data-url') || location.href,
                    title       : instance.el.getAttribute('data-title') || document.title,
                    description : instance.el.getAttribute('data-description') || ''
                }
                params = [];

            for (var a in data) {
                params.push(a + '=' + encodeURIComponent(data[a] || ''));
            }

            src += params.join('&') + '&';

            var iframe = Socialite.createIframe(src, instance);
            iframe.style.width = ((data.t == '2') ? 155 : 50) + 'px';
            iframe.style.height = ((data.t == '2') ? 25 : 70) + 'px';
            instance.el.appendChild(iframe);

            Socialite.activateInstance(instance);
        }
    });

})(window, window.document, window.Socialite);
