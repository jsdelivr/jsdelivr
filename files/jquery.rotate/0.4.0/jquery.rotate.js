/* 
 * JQuery CSS Rotate property using CSS3 Transformations
 * Copyright (c) 2011 Jakub Jankiewicz  <http://jcubic.pl>
 * licensed under the LGPL Version 3 license.
 * http://www.gnu.org/licenses/lgpl.html
 */
(function($) {
    function getTransformProperty(element) {
        var properties = ['transform', 'WebkitTransform',
                          'MozTransform', 'msTransform',
                          'OTransform'];
        var p;
        while (p = properties.shift()) {
            if (element.style[p] !== undefined) {
                return p;
            }
        }
        return false;
    }
    $.cssHooks['rotate'] = {
        get: function(elem, computed, extra){
            var property = getTransformProperty(elem);
            if (property) {
                var transform = elem.style[property];
                if (transform) {
                    return transform.replace(/.*rotate\((.*)deg\).*/, '$1');
                } else {
                    var matrix = getComputedStyle(elem, null)[property];
                    if (matrix.match(/matrix\(1, *0, *0, *1, *0, *0\)/)) {
                        return '';
                    } else {
                        var m = matrix.match(/matrix\([^,]+, *([^,]+),/);
                        var angle = Math.round(Math.asin(m[1]) * (180/Math.PI));
                        return angle;
                    }
                }
            } else {
                return '';
            }
        },
        set: function(elem, value){
            var property = getTransformProperty(elem);
            if (property) {
                value = parseInt(value);
                if (value == 0) {
                    elem.style[property] = '';
                } else {
                    elem.style[property] = 'rotate(' + value%360 + 'deg)';
                }
            } else {
                return '';
            }
        }
    };
    $.fx.step['rotate'] = function(fx){
        $.cssHooks['rotate'].set(fx.elem, fx.now);
    };
})(jQuery);
