/*riot-format: v1.1.1; https://github.com/Joylei/riot-format.git; License: MIT*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('riot-format', ['exports'], factory) :
  (factory((global.riotFormat = global.riotFormat || {})));
}(this, (function (exports) { 'use strict';

var DEFAULT_ERROR = '!ERR!';

var opts = {
    /**
     * 0 - log error in console
     * 1 - throw error
     * 2 - sliently swallow
     */
    errorBehavior: 0,
    /**
     * represents that error occurs when evaluted formatters
     */ 
    errorText: DEFAULT_ERROR
};

var slice = Array.prototype.slice;

function arrayify(obj, start){
    if ( start === void 0 ) start = 0;

    return slice.call(obj, start)
}

function isString(obj){
    return typeof obj === 'string'
}

function isFunction(obj){
    return typeof obj === 'function'
}

function isUndefined(obj){
    return typeof obj === 'undefined'
}

function isNull(obj){
    return obj === null
}

function isNullOrUndefined(obj){
    return isUndefined(obj) || isNull(obj)
}

function inArray(arr, item){
    return arr.indexOf(item) !== -1
}

/**
 * throw error
 * 
 * @export
 * @param {string} msg
 * @returns {never}
 */
function fail(msg){
    throw new Error(msg)
}

var warn = console.warn.bind(console);

var error = console.error.bind(console);

function handleError(e){
    if(opts.errorBehavior === 2){
        return
    }else if(opts.errorBehavior === 1){
        throw e
    }else{
        error(e);
    }
}

/**
 * a decorator class to format value
 * @class
 */
var Formatter = function Formatter (value) {
      this._value = value;
  };

var prototypeAccessors = { value: {},current: {} };

/**
 * @description format the value to String
 * @returns {String}
 */
  Formatter.prototype.toString = function toString () {
      var val = this.current;
      return isNullOrUndefined(val) ? '' : String(val)
  };

  /**
   * the original value passed in
   * 
   * @readonly
   * 
   * @memberOf Formatter
   */
  prototypeAccessors.value.get = function (){
      return this._value
  };

  /**
   * the evaluated value by chained formatters
   * 
   * @readonly
   * 
   * @memberOf Formatter
   */
  prototypeAccessors.current.get = function (){
      //check error
      if(this._error){
          handleError(this._error);
          return opts.errorText
      }

      var chains = this._chains;
      var val ='_lazyValue' in this ? this._lazyValue : this._value;
      //no chains
      if(!chains){
          return val
      }

      delete this._chains;
      delete this._lazyValue;
      delete this._error;

      //eval chains
      try {
          for(var i=0; i< chains.length; i++){
              val = chains[i](val);
          }
          this._lazyValue = val;
          return val
      } catch (e) {
          this._error = e;
          handleError(e);
      }
      return opts.errorText
  };

Object.defineProperties( Formatter.prototype, prototypeAccessors );

/**
 * Forbidden names when define formatters or retrieve formatter
 * @constant
 */
var Forbiddens = ['value', 'current' ,'toString', '_value', '_error', '_chains'];

/**
* format a given value in the riot tag context
* @example <caption>use it globally</caption>
* format(new Date(), 'date');
* @example <caption>use it with riot</caption>
* window.format = format;
* 
* //define a riot tag
*   <app>
*      <p> {format(new Date(), 'date', 'yyyy-mm-dd HH:MM:ss')} </p>
*   </app>
* @param {any} value      the value passed in to be formatted
* @param {string} method  the format method to be used
* @returns {Formatter} the Formatter instance
*/
function format (value, method) {
    var self = new Formatter(value);
    var args = arrayify(arguments, 2);
    if (isString(method)) {
        if(inArray(Forbiddens, method)){
            warn('ignored, not allowed method: ' + method);
            return self
        }

        var fn = self[method];
        if (isFunction(fn)) {
            fn.apply(self, args);
        }else{
            fail('method not found: ' + method);
        }
    }
    return self
}

format.opts = opts;

/**
 * @param {String} method method name
 * @param {Function} fn method body
 */
function defineFormatter (method, fn) {
    if (isString(method) && isFunction(fn)) {
        if(inArray(Forbiddens, method)){
            fail('not allowed method: ' + method);
        }

        var format = function () {
            var args = arrayify(arguments);
            var chains = this._chains;
            if(!chains){
                chains = [];
            }
            chains.push(function(value){
                args.unshift(value);
                return fn.apply(null, args)
            });
            this._chains = chains;
            return this
        };
        format._def = fn;
        Formatter.prototype[method] = format;
        return
    }
    fail('check parameters');
}

/**
 * @description extend with custom formatters
 * @example
 *  extend('yesno', function(input){
 *      return !!input ? 'yes' : 'no';
 *  });
 * @example
 *  extend({
 *      yes: function(input){
 *          return !!input ? 'yes' : '';
 *      },
 *      no: function(input){
 *          return !!!input ? 'no' : '';
 *      }
 *  });
 * 
 * @param {String|Object} name if name is Object, means mutiple format methods;
 *  otherwise it is method name, should be used with fn
 * @param {Function} fn should be used if name is String
 */
function extend (name, fn) {
    if (typeof name === 'object') {
        var obj = name;
        for (var key in obj) {
            defineFormatter(key, obj[key]);
        }
    }else {
        defineFormatter(name , fn);
    }
}

// taken from http://stevenlevithan.com/assets/misc/date.format.js
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) { val = '0' + val; }
            return val
        };

  // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

    // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == '[object String]' && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

    // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date();
        if (isNaN(date)) { throw SyntaxError('invalid date') }

        mask = String(dF.masks[mask] || mask || dF.masks['default']);

    // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == 'UTC:') {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? 'getUTC' : 'get',
            d = date[_ + 'Date'](),
            D = date[_ + 'Day'](),
            m = date[_ + 'Month'](),
            y = date[_ + 'FullYear'](),
            H = date[_ + 'Hours'](),
            M = date[_ + 'Minutes'](),
            s = date[_ + 'Seconds'](),
            L = date[_ + 'Milliseconds'](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d: d,
                dd: pad(d),
                ddd: dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m: m + 1,
                mm: pad(m + 1),
                mmm: dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy: String(y).slice(2),
                yyyy: y,
                h: H % 12 || 12,
                hh: pad(H % 12 || 12),
                H: H,
                HH: pad(H),
                M: M,
                MM: pad(M),
                s: s,
                ss: pad(s),
                l: pad(L, 3),
                L: pad(L > 99 ? Math.round(L / 10) : L),
                t: H < 12 ? 'a' : 'p',
                tt: H < 12 ? 'am' : 'pm',
                T: H < 12 ? 'A' : 'P',
                TT: H < 12 ? 'AM' : 'PM',
                Z: utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
                o: (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S: ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1)
        })
    }
}();

// Some common format strings
dateFormat.masks = {
    'default': 'ddd mmm dd yyyy HH:MM:ss',
    shortDate: 'm/d/yy',
    mediumDate: 'mmm d, yyyy',
    longDate: 'mmmm d, yyyy',
    fullDate: 'dddd, mmmm d, yyyy',
    shortTime: 'h:MM TT',
    mediumTime: 'h:MM:ss TT',
    longTime: 'h:MM:ss TT Z',
    isoDate: 'yyyy-mm-dd',
    isoTime: 'HH:MM:ss',
    isoDateTime: 'yyyy-mm-dd\'T\'HH:MM:ss',
    isoUtcDateTime: 'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\''
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ],
    monthNames: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ]
};


dateFormat.polyfill = function () {
    // For convenience...
    
    /*jshint -W121 */
    Date.prototype.format = function (mask, utc) {
        return dateFormat(this, mask, utc)
    };
    /*jshint +W121 */
};

function number (input, fractionSize) {
    if ( fractionSize === void 0 ) fractionSize = 2;

    var num = Number(input);
    if (isNaN(num.valueOf())) {
        return input
    }
    if (!isFinite(num.valueOf())) {
        return num.valueOf() < 0 ? '-∞' : '∞'
    }
    return num.toFixed(fractionSize).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
}

var units = 'KMG';

function bytes (input, fractionSize, defaultValue) {
    if ( fractionSize === void 0 ) fractionSize = 2;
    if ( defaultValue === void 0 ) defaultValue = '--';

    var num = Number(input);

    if (isNaN(num.valueOf()) || !isFinite(num.valueOf()) || num < 0) {
        return defaultValue
    }
    
    var i=0;
    for(; num>=1024 && i<=3 ; i++) {
        num = num /1024;
    }

    return i > 0 ? (num.toFixed(fractionSize) + units[i - 1]) : (num + '')
}

function json (input) {
    return JSON.stringify(input)
}

extend({date: dateFormat, number: number, bytes: bytes, json: json});

var version = '1.1.1';

/**
 * repo: https://github.com/Joylei/riot-format.git
 * @author joylei <leingliu@gmail.com>
 */

// import built-in formatters
/**
 * mixin format globally
 * @param {any} riot riot module object
 * @example
 * import * as riot from 'riot';
 * use(riot);
 */
function use(riot) {
    riot.mixin({ format: format });
}

/**
 * same as extend()
 * @see extend
 * @deprecated
 */
use.define = function () {
    warn('define() is deprecated, use extend() instead.');
    return extend.apply(null, arrayify(arguments))
};

use.extend = extend;

use.format = format;

exports.use = use;
exports['default'] = use;
exports.version = version;
exports.format = format;
exports.extend = extend;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=riot-format.js.map
