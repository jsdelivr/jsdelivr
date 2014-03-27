/*!
 * CanJS - 2.0.6
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Fri, 14 Mar 2014 21:59:17 GMT
 * Licensed MIT
 * Includes: can/construct/super
 * Download from: http://canjs.com
 */
(function(undefined) {

    // ## construct/super/super.js
    var __m1 = (function(can, Construct) {
        // tests if we can get super in .toString()
        var isFunction = can.isFunction,
            fnTest = /xyz/.test(function() {
                return this.xyz;
            }) ? /\b_super\b/ : /.*/;
        // overwrites a single property so it can still call super
        can.Construct._overwrite = function(addTo, base, name, val) {
            // Check if we're overwriting an existing function
            addTo[name] = isFunction(val) && isFunction(base[name]) && fnTest.test(val) ? function(name, fn) {
                return function() {
                    var tmp = this._super,
                        ret;
                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = base[name];
                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    ret = fn.apply(this, arguments);
                    this._super = tmp;
                    return ret;
                };
            }(name, val) : val;
        };
        // overwrites an object with methods, sets up _super
        //   newProps - new properties
        //   oldProps - where the old properties might be
        //   addTo - what we are adding to
        can.Construct._inherit = function(newProps, oldProps, addTo) {
            addTo = addTo || newProps;
            for (var name in newProps) {
                can.Construct._overwrite(addTo, oldProps, name, newProps[name]);
            }
        };
        return can;
    })(window.can, undefined);

})();