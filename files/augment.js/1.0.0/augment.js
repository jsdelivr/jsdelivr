// augment.js JavaScript 1.8.5 methods for all, version: 1.0.0
// using snippets from Mozilla - https://developer.mozilla.org/en/JavaScript
// (c) 2011 Oliver Nightingale
//
//  Released under MIT license.
//
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
if (!Array.prototype.every) {
  Array.prototype.every = function(fn, ctx) {

    if (this === void 0 || this === null || typeof fn !== "function") throw new TypeError

    var t = Object(this),
        len = t.length >>> 0,
        noCtx = (ctx === void 0 || ctx === null)

    for (var i = 0; i < len; i++) {
      if (i in t) {
        if (noCtx) {
          if (!fn(t[i], i, t)) return false
        } else {
          if (!fn.call(ctx, t[i], i, t)) return false
        }
      }
    }

    return true;
  };
}
if (!Array.prototype.filter) {
  Array.prototype.filter = function(fn, ctx) {

    if (this === void 0 || this === null || typeof fn !== "function") throw new TypeError

    var t = Object(this),
        len = t.length >>> 0,
        noCtx = (ctx === void 0 || ctx === null),
        response = []

    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i] // in case fn mutates this
        if (noCtx) {
          if (fn(t[i], i, t)) response.push(val)
        } else {
          if (fn.call(ctx, t[i], i, t)) response.push(val)
        }
      }
    }

    return response
  }
}
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/foreach
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(fn, ctx) {

    if (this === void 0 || this === null || typeof fn !== "function") throw new TypeError

    var t = Object(this),
        len = t.length >>> 0,
        noCtx = (ctx === void 0 || ctx === null)

    for (var i = 0; i < len; i++) {
      if (i in t) {
        if (noCtx) {
          fn(t[i], i, t)
        } else {
          fn.call(ctx, t[i], i, t)
        }
      }
    }
  }
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIdx) {

    if (this === void 0 || this === null) throw new TypeError

    var t = Object(this),
        len = t.length >>> 0,
        hasFromIdx = (fromIdx !== void 0 && fromIdx !== null)

    if (len === 0) return -1

    var n = 0

    if (hasFromIdx) {
      n = Number(fromIdx)

      if (n !== n) { // shortcut for verifying if it is NaN
        n = 0
      } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n))
      }
    }

    if (n >= len) return -1

    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0)

    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) return k
    }
    return -1
  }
}
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
Array.isArray = Array.isArray || function(o) { return Object.prototype.toString.call(o) === '[object Array]'; };
if (!Array.prototype.lastIndexOf) {
  Array.prototype.lastIndexOf = function(searchElement, fromIdx) {

    if (this === void 0 || this === null) throw new TypeError()

    var t = Object(this),
        len = t.length >>> 0,
        hasFromIdx = (fromIdx !== void 0 && fromIdx !== null)

    if (len === 0) return -1

    var n = len

    if (hasFromIdx) {
      n = Number(fromIdx)

      if (n !== n) {
        n = 0
      } else if (n !== 0 && n !== (Infinity) && n !== -(Infinity)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n))
      }
    }

    var k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n)

    for (; k >= 0; k--) {
      if (k in t && t[k] === searchElement) return k
    }

    return -1
  }
}
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map
if (!Array.prototype.map) {
  Array.prototype.map = function(fn, ctx) {

    if (this === void 0 || this === null || typeof fn !== "function") throw new TypeError

    var t = Object(this),
        len = t.length >>> 0,
        noCtx = (ctx === void 0 || ctx === null),
        response = new Array (len)

    for (var i = 0; i < len; i++) {
      if (i in t) {
        if (noCtx) {
          response[i] = fn(t[i], i, t)
        } else {
          response[i] = fn.call(ctx, t[i], i, t)
        }
      }
    }

    return response
  };
}
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function(fn, initialValue) {

    if (this === void 0 || this === null || typeof fn !== "function") throw new TypeError

    var t = Object(this),
        len = t.length >>> 0,
        hasInitialValue =  (initialValue !== void 0 && initialValue !== null)

    // no value to return if no initial value and an empty array
    if (len == 0 && !hasInitialValue) throw new TypeError

    var k = 0, accumulator

    if (hasInitialValue) {
      accumulator = initialValue
    } else {
      do {
        if (k in t) {
          accumulator = t[k++]
          break
        }

        // if array contains no values, no initial value to return
        if (++k >= len) throw new TypeError
      }
      while (true)
    }

    while (k < len) {
      if (k in t) accumulator = fn(accumulator, t[k], k, t)
      k++
    }

    return accumulator
  }
}
if (!Array.prototype.reduceRight) {
  Array.prototype.reduceRight = function(fn, initialValue) {

    if (this === void 0 || this === null || typeof fn !== "function") throw new TypeError

    var t = Object(this),
        len = t.length >>> 0,
        hasInitialValue = (initialValue !== void 0 && initialValue !== null)

    // no value to return if no initial value, empty array
    if (len == 0 && !hasInitialValue) throw new TypeError

    var k = len - 1, accumulator

    if (hasInitialValue) {
      accumulator = initialValue
    } else {
      do {
        if (k in this) {
          accumulator = t[k--]
          break
        }

        // if array contains no values, no initial value to return
        if (--k < 0) throw new TypeError
      }
      while (true)
    }

    while (k--) {
      if (k in t) accumulator = callbackfn(accumulator, t[k], k, t)
    }

    return accumulator
  };
}
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
if (!Array.prototype.some) {
  Array.prototype.some = function(fn, ctx) {

    if (this === void 0 || this === null || typeof fn !== "function") throw new TypeError

    var t = Object(this),
        len = t.length >>> 0,
        noCtx = (ctx === void 0 || ctx === null)

    for (var i = 0; i < len; i++) {
      if (i in t) {
        if (noCtx) {
          if (fn(t[i], i, t)) return true
        } else {
          if (fn.call(ctx, t[i], i, t)) return true
        }
      }
    }

    return false;
  };
}
if (!Date.now) {
  Date.now = function () {
    return +new Date
  }
}
if (!Date.prototype.toISOString) {
  Date.prototype.toISOString = (function () {

    var pad = function (n, length) {
      length = length || 2
      return (n = n + "", n.length === length) ? n : pad("0" + n, length);
    }

    return function () {
      var year = this.getUTCFullYear()
      year = (year < 0 ? '-' : (year > 9999 ? '+' : '')) + ('00000' + Math.abs(year)).slice(0 <= year && year <= 9999 ? -4 : -6);

      var date = [year, pad(this.getUTCMonth() + 1), pad(this.getUTCDate())].join("-")
      var time = [pad(this.getUTCHours()), pad(this.getUTCMinutes()), pad(this.getUTCSeconds())].join(":") + "." + pad(this.getUTCMilliseconds(), 3)
      return [date, time].join("T") + "Z"
    }
  })()
};
if (!Date.prototype.toJSON) {
  Date.prototype.toJSON = function () {
    var t = Object(this),
        toISO = t.toISOString

    if (typeof toISO !== 'function') throw new TypeError

    return toISO.call(t)
  }
};
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind ) {

  Function.prototype.bind = function(obj) {

    if (typeof this !== 'function') throw new TypeError ("Function.prototype.bind - what is trying to be bound is not callable")

    var slice = Array.prototype.slice,
        args = slice.call(arguments, 1), 
        self = this, 
        nop = function () {}, 
        bound = function () {

          if (nop.prototype && this instanceof nop) {
            var result = self.apply(new nop, args.concat(slice.call(arguments)))
            return (Object(result) === result) ? result : self
          } else {
            return self.apply(obj, args.concat(slice.call(arguments)))
          };
        };

    nop.prototype = self.prototype;

    bound.prototype = new nop();

    return bound;
  };
}
;(function () { "use strict"

  var ensureIsObject = function (param) {
    if (param !== Object(param)) throw new TypeError('Object.getPrototypeOf called on non-object');
  }

  if (!Object.getPrototypeOf) {
    if (typeof "test".__proto__ === "object") {
      Object.getPrototypeOf = function (obj) {
        ensureIsObject(obj)
        return obj.__proto__
      }
    } else {
      Object.getPrototypeOf = function (obj) {
        ensureIsObject(obj)
        return obj.constructor.prototype
      }
    };
  };
})();
// http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
if (!Object.keys) {
  Object.keys = (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length

    return function (obj) {
      if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object')

      var result = []

      for (var prop in obj) {
        if (hasOwnProperty.call(obj, prop)) result.push(prop)
      }

      if (hasDontEnumBug) {
        for (var i=0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i])
        }
      }
      return result
    }
  })()
};if (!String.prototype.trim) {
  String.prototype.trim = (function () {

    var trimLeft  = /^\s+/,
        trimRight = /\s+$/

    return function () {
      return this.replace(trimLeft, "").replace(trimRight, "")
    }
  })()
};
