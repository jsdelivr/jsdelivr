/**
 * author Remy Sharp
 * url http://remysharp.com/2009/01/26/element-in-view-event-plugin/
 */
(function ($) {
    var shouldCheckInView = false;

    function getViewportHeight() {
        var height = window.innerHeight; // Safari, Opera
        // if this is correct then return it. iPad has compat Mode, so will
        // go into check clientHeight (which has the wrong value).
        if (height) { return height; }
        var mode = document.compatMode;

        if ( (mode || !$.support.boxModel) ) { // IE, Gecko
            height = (mode == 'CSS1Compat') ?
            document.documentElement.clientHeight : // Standards
            document.body.clientHeight; // Quirks
        }

        return height;
    }

    function offsetTop(debug) {
        // Manually calculate offset rather than using jQuery's offset
        // This works-around iOS < 4 on iPad giving incorrect value
        // cf http://bugs.jquery.com/ticket/6446#comment:9
        var curtop = 0;
        for (var obj = debug; obj !== null; obj = obj.offsetParent) {
            curtop += obj.offsetTop;
        }
        return curtop;
    }

    function check_inview() {
        var vpH = getViewportHeight(),
            scrolltop = (window.pageYOffset ?
                window.pageYOffset :
                document.documentElement.scrollTop ?
                document.documentElement.scrollTop :
                document.body.scrollTop),
            elems = [];

        // naughty, but this is how it knows which elements to check for
        $.each($.cache, function () {
            if (this.events && this.events.inview) {
                elems.push(this.handle.elem);
            }
        });

        if (elems.length) {
            $(elems).each(function () {
                var $el = $(this),
                    top = offsetTop(this),
                    height = $el.height(),
                    inview = $el.data('inview') || false;

                if (scrolltop > (top + height) || scrolltop + vpH < top) {
                    if (inview) {
                        $el.data('inview', false);
                        $el.trigger('inview', [ false ]);
                    }
                } else if (scrolltop < (top + height)) {
                    var visPart = ( scrolltop > top ? 'bottom' : (scrolltop + vpH) < (top + height) ? 'top' : 'both' );
                    if (!inview || inview !== visPart) {
                      $el.data('inview', visPart);
                      $el.trigger('inview', [ true, visPart]);
                    }
                }
            });
        }
    }

    function triggerInViewChecker() {
        shouldCheckInView = true;
    }

    $(window).scroll(triggerInViewChecker);
    $(window).resize(triggerInViewChecker);
    $(window).click(triggerInViewChecker);
    // kick the event to pick up any elements already in view.
    // note however, this only works if the plugin is included after the elements are bound to 'inview'
    $(window).ready(triggerInViewChecker);

    // Check every 250 milliseconds if a scroll/click/resize/ready event is triggered
    // Source: http://ejohn.org/blog/learning-from-twitter/
    setInterval(function() {
        if ( shouldCheckInView ) {
            shouldCheckInView = false;

            check_inview();
        }
    }, 100);
})(jQuery);
