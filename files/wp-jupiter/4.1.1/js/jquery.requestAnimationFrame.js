(function($, window, undefined) {
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
    // requestAnimationFrame polyfill by Erik Möller
    // fixes from Paul Irish and Tino Zijdel
 
    var lastTime = 0,
        running,
        animate = function (elem) {
            if (running) {
                window.requestAnimationFrame(animate, elem);
                jQuery.fx.tick();
            }
        },
        vendors = ['ms', 'moz', 'webkit', 'o'];
 
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
            || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(fn, element) {
            var currTime = new Date().getTime(),
                delta = currTime - lastTime,
                timeToCall = Math.max(0, 16 - delta);
 
            var id = window.setTimeout(function() {
                    fn(currTime + timeToCall);
                },
                timeToCall
            );
 
            lastTime = currTime + timeToCall;
 
            return id;
        };
 
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
 
    jQuery.fx.timer = function (timer) {
        if (timer() && jQuery.timers.push(timer) && !running) {
            running = true;
            animate(timer.elem);
        }
    };
 
    jQuery.fx.stop = function() {
        running = false;
    };
 
}(jQuery, this));