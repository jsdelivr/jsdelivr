/*! Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 *
 * Version: 3.0.3-pre
 * 
 * Requires: 1.2.2+
 */

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener )
            for ( var i=types.length; i; )
                this.addEventListener( types[--i], handler, false );
        else
            this.onmousewheel = handler;
    },
    
    teardown: function() {
        if ( this.removeEventListener )
            for ( var i=types.length; i; )
                this.removeEventListener( types[--i], handler, false );
        else
            this.onmousewheel = null;
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    
    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true;
    
    event = $.event.fix(event || window.event);
    event.type = "mousewheel";
    
    if ( event.wheelDelta ) delta = event.wheelDelta/120;
    if ( event.detail     ) delta = -event.detail/3;
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta);

    return $.event.handle.apply(this, args);
}

})(jQuery);
