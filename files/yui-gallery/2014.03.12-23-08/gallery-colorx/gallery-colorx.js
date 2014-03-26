YUI.add('gallery-colorx', function(Y) {

var ZERO     = "0",
    L        = Y.Lang,
    isArray  = L.isArray,
    NS       = Y.namespace('apm'),

/**
 * Provides color conversion and validation utils beyond what is
 * included in Y.DOM.
 * @class ColorX
 */
    ColorX = {

        /**
         * Converts 0-1 to 0-255
         * @method real2dec
         * @param n {float} the number to convert
         * @return {int} a number 0-255
         */
        real2dec: function(n) {
            return Math.min(255, Math.round(n*256));
        },

        /**
         * Converts HSV (h[0-360], s[0-1]), v[0-1] to RGB [255,255,255]
         * @method hsv2rgb
         * @param h {int|[int, float, float]} the hue, or an
         *        array containing all three parameters
         * @param s {float} the saturation
         * @param v {float} the value/brightness
         * @return {[int, int, int]} the red, green, blue values in
         *          decimal.
         */
        hsv2rgb: function(h, s, v) { 

            if (isArray(h)) {
                return ColorX.hsv2rgb.call(ColorX, h[0], h[1], h[2]);
            }

            var r, g, b,
                i = Math.floor((h/60)%6),
                f = (h/60)-i,
                p = v*(1-s),
                q = v*(1-f*s),
                t = v*(1-(1-f)*s),
                fn;

            switch (i) {
                case 0: r=v; g=t; b=p; break;
                case 1: r=q; g=v; b=p; break;
                case 2: r=p; g=v; b=t; break;
                case 3: r=p; g=q; b=v; break;
                case 4: r=t; g=p; b=v; break;
                case 5: r=v; g=p; b=q; break;
            }

            fn = ColorX.real2dec;

            return [fn(r), fn(g), fn(b)];
        },

        /**
         * Converts to RGB [255,255,255] to HSV (h[0-360], s[0-1]), v[0-1]
         * @method rgb2hsv
         * @param r {int|[int, int, int]} the red value, or an
         *        array containing all three parameters
         * @param g {int} the green value
         * @param b {int} the blue value
         * @return {[int, float, float]} the value converted to hsv
         */
        rgb2hsv: function(r, g, b) {

            if (isArray(r)) {
                return ColorX.rgb2hsv.apply(ColorX, r);
            }

            r /= 255;
            g /= 255;
            b /= 255;

            var h,s,
                min = Math.min(Math.min(r,g),b),
                max = Math.max(Math.max(r,g),b),
                delta = max-min,
                hsv;

            switch (max) {
                case min: h=0; break;
                case r:   h=60*(g-b)/delta; 
                          if (g<b) {
                              h+=360;
                          }
                          break;
                case g:   h=(60*(b-r)/delta)+120; break;
                case b:   h=(60*(r-g)/delta)+240; break;
            }
            
            s = (max === 0) ? 0 : 1-(min/max);

            hsv = [Math.round(h), s, max];

            return hsv;
        },

        /**
         * Converts decimal rgb values into a hex string
         * 255,255,255 -> FFFFFF
         * @method rgb2hex
         * @param r {int|[int, int, int]} the red value, or an
         *        array containing all three parameters
         * @param g {int} the green value
         * @param b {int} the blue value
         * @return {string} the hex string
         */
        rgb2hex: function(r, g, b) {
            if (isArray(r)) {
                return ColorX.rgb2hex.apply(ColorX, r);
            }

            var f = ColorX.dec2hex;
            return f(r) + f(g) + f(b);
        },
     
        /**
         * Converts an int 0...255 to hex pair 00...FF
         * @method dec2hex
         * @param n {int} the number to convert
         * @return {string} the hex equivalent
         */
        dec2hex: function(n) {
            n = parseInt(n, 10) || 0;
            n = (n > 255 || n < 0) ? 0 : n;

            return (ZERO + n.toString(16)).slice(-2).toUpperCase();
        },

        /**
         * Converts a hex pair 00...FF to an int 0...255 
         * @method hex2dec
         * @param str {string} the hex pair to convert
         * @return {int} the decimal
         */
        hex2dec: function(str) {
            return parseInt(str, 16);
        },

        /**
         * Converts a hex string to rgb
         * @method hex2rgb
         * @param str {string} the hex string
         * @return {[int, int, int]} an array containing the rgb values
         */
        hex2rgb: function(s) { 
            var f = ColorX.hex2dec;
            return [f(s.slice(0, 2)), f(s.slice(2, 4)), f(s.slice(4, 6))];
        },

        /**
         * Returns the closest websafe color to the supplied rgb value.
         * @method websafe
         * @param r {int|[int, int, int]} the red value, or an
         *        array containing all three parameters
         * @param g {int} the green value
         * @param b {int} the blue value
         * @return {[int, int, int]} an array containing the closes
         *                           websafe rgb colors.
         */
        websafe: function(r, g, b) {

            if (isArray(r)) {
                return ColorX.websafe.apply(ColorX, r);
            }

            // returns the closest match [0, 51, 102, 153, 204, 255]
            var f = function(v) {
                if (L.isNumber(v)) {
                    v = Math.min(Math.max(0, v), 255);
                    var i, next;
                    for (i=0; i<256; i=i+51) {
                        next = i+51;
                        if (v >= i && v <= next) {
                            return (v-i > 25) ? next : i;
                        }
                    }
                }

                return v;
            };

            return [f(r), f(g), f(b)];
        }
    };

    NS.ColorX = ColorX;



}, 'gallery-2010.02.19-03' ,{requires:['yui-base']});
