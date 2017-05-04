(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var
    ArrayProto = Array.prototype,
    ObjProto = Object.prototype;

var
    slice = ArrayProto.slice,
    toString = ObjProto.toString;

var util = {};

util.isArray = function(obj) {
    return Array.isArray(obj);
};

var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
util.isArrayLike = function(obj) {
    if(typeof obj !== 'object' || !obj){
        return false;
    }
    var length = obj.length;
    return typeof length === 'number'
        && length % 1 === 0 && length >= 0 && length <= MAX_ARRAY_INDEX;
};

util.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
};


util.each = function(obj, callback) {
    var i,
        len;
    if (util.isArray(obj)) {
        for (i = 0, len = obj.length; i < len; i++) {
            if (callback(obj[i], i, obj) === false) {
                break;
            }
        }
    } else {
        for (i in obj) {
            if (callback(obj[i], i, obj) === false) {
                break;
            }
        }
    }
    return obj;
};

util.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    util['is' + name] = function(obj) {
        return toString.call(obj) === '[object ' + name + ']';
    };
});

util.toArray = function(list, start) {
  start = start || 0
  var i = list.length - start
  var ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

util.toNumber = function(value) {
  if (typeof value !== 'string') {
    return value
  } else {
    var parsed = Number(value)
    return isNaN(parsed)
      ? value
      : parsed
  }
};

util.convertArray = function (value) {
    if (util.isArray(value)) {
      return value
    } else if (util.isPlainObject(value)) {
      // convert plain object to array.
      var keys = Object.keys(value)
      var i = keys.length
      var res = new Array(i)
      var key
      while (i--) {
        key = keys[i]
        res[i] = {
          $key: key,
          $value: value[key]
        }
      }
      return res
    } else {
      return value || []
    }
}

function multiIndex(obj,is) {  // obj,['1','2','3'] -> ((obj['1'])['2'])['3']
    return is.length ? multiIndex(obj[is[0]],is.slice(1)) : obj
}

util.getPath = function(obj,is) {   // obj,'1.2.3' -> multiIndex(obj,['1','2','3'])
    return multiIndex(obj,is.split('.'))
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 *
 * @param {*} obj
 * @return {Boolean}
 */

var toString = Object.prototype.toString
var OBJECT_STRING = '[object Object]'
util.isPlainObject = function (obj) {
  return toString.call(obj) === OBJECT_STRING
}

/* harmony default export */ exports["a"] = util;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__limitBy__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__filterBy__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__orderBy__ = __webpack_require__(6);




/* harmony reexport (binding) */ __webpack_require__.d(exports, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__limitBy__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__filterBy__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "c", function() { return __WEBPACK_IMPORTED_MODULE_2__orderBy__["a"]; });


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__currency__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pluralize__ = __webpack_require__(8);



/* harmony reexport (binding) */ __webpack_require__.d(exports, "currency", function() { return __WEBPACK_IMPORTED_MODULE_0__currency__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "pluralize", function() { return __WEBPACK_IMPORTED_MODULE_1__pluralize__["a"]; });


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__capitalize__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__uppercase__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lowercase__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__placeholder__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__truncate__ = __webpack_require__(12);






/* harmony reexport (binding) */ __webpack_require__.d(exports, "truncate", function() { return __WEBPACK_IMPORTED_MODULE_4__truncate__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "capitalize", function() { return __WEBPACK_IMPORTED_MODULE_0__capitalize__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "uppercase", function() { return __WEBPACK_IMPORTED_MODULE_1__uppercase__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "lowercase", function() { return __WEBPACK_IMPORTED_MODULE_2__lowercase__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "placeholder", function() { return __WEBPACK_IMPORTED_MODULE_3__placeholder__["a"]; });


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_index__ = __webpack_require__(0);


/**
 * Filter filter for arrays
 *
 * @param {Array} arr
 * @param {String} prop
 * @param {String|Number} search
 */

function filterBy (arr, search) {
  var arr = __WEBPACK_IMPORTED_MODULE_0__util_index__["a" /* default */].convertArray(arr)
  if (search == null) {
    return arr
  }
  if (typeof search === 'function') {
    return arr.filter(search)
  }
  // cast to lowercase string
  search = ('' + search).toLowerCase()
  var n = 2
  // extract and flatten keys
  var keys = Array.prototype.concat.apply([], __WEBPACK_IMPORTED_MODULE_0__util_index__["a" /* default */].toArray(arguments, n))
  var res = []
  var item, key, val, j
  for (var i = 0, l = arr.length; i < l; i++) {
    item = arr[i]
    val = (item && item.$value) || item
    j = keys.length
    if (j) {
      while (j--) {
        key = keys[j]
        if ((key === '$key' && contains(item.$key, search)) ||
            contains(__WEBPACK_IMPORTED_MODULE_0__util_index__["a" /* default */].getPath(val, key), search)) {
          res.push(item)
          break
        }
      }
    } else if (contains(item, search)) {
      res.push(item)
    }
  }
  return res
}

function contains (val, search) {
  var i
  if (__WEBPACK_IMPORTED_MODULE_0__util_index__["a" /* default */].isPlainObject(val)) {
    var keys = Object.keys(val)
    i = keys.length
    while (i--) {
      if (contains(val[keys[i]], search)) {
        return true
      }
    }
  } else if (__WEBPACK_IMPORTED_MODULE_0__util_index__["a" /* default */].isArray(val)) {
    i = val.length
    while (i--) {
      if (contains(val[i], search)) {
        return true
      }
    }
  } else if (val != null) {
    return val.toString().toLowerCase().indexOf(search) > -1
  }
}

/* harmony default export */ exports["a"] = filterBy;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_index__ = __webpack_require__(0);


/**
 * Limit filter for arrays
 *
 * @param {Number} n
 * @param {Number} offset (Decimal expected)
 */

function limitBy (arr, n, offset) {
  offset = offset ? parseInt(offset, 10) : 0
  n = __WEBPACK_IMPORTED_MODULE_0__util_index__["a" /* default */].toNumber(n)
  return typeof n === 'number'
    ? arr.slice(offset, offset + n)
    : arr
}

/* harmony default export */ exports["a"] = limitBy;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_index__ = __webpack_require__(0);


/**
 * Filter filter for arrays
 *
 * @param {String|Array<String>|Function} ...sortKeys
 * @param {Number} [order]
 */

function orderBy (arr) {
  var comparator = null
  var sortKeys
  arr = __WEBPACK_IMPORTED_MODULE_0__util_index__["a" /* default */].convertArray(arr)

  // determine order (last argument)
  var args = __WEBPACK_IMPORTED_MODULE_0__util_index__["a" /* default */].toArray(arguments, 1)
  var order = args[args.length - 1]
  if (typeof order === 'number') {
    order = order < 0 ? -1 : 1
    args = args.length > 1 ? args.slice(0, -1) : args
  } else {
    order = 1
  }

  // determine sortKeys & comparator
  var firstArg = args[0]
  if (!firstArg) {
    return arr
  } else if (typeof firstArg === 'function') {
    // custom comparator
    comparator = function (a, b) {
      return firstArg(a, b) * order
    }
  } else {
    // string keys. flatten first
    sortKeys = Array.prototype.concat.apply([], args)
    comparator = function (a, b, i) {
      i = i || 0
      return i >= sortKeys.length - 1
        ? baseCompare(a, b, i)
        : baseCompare(a, b, i) || comparator(a, b, i + 1)
    }
  }

  function baseCompare (a, b, sortKeyIndex) {
    var sortKey = sortKeys[sortKeyIndex]
    if (sortKey) {
      if (sortKey !== '$key') {
        if (__WEBPACK_IMPORTED_MODULE_0__util_index__["a" /* default */].isObject(a) && '$value' in a) a = a.$value
        if (__WEBPACK_IMPORTED_MODULE_0__util_index__["a" /* default */].isObject(b) && '$value' in b) b = b.$value
      }
      a = __WEBPACK_IMPORTED_MODULE_0__util_index__["a" /* default */].isObject(a) ? __WEBPACK_IMPORTED_MODULE_0__util_index__["a" /* default */].getPath(a, sortKey) : a
      b = __WEBPACK_IMPORTED_MODULE_0__util_index__["a" /* default */].isObject(b) ? __WEBPACK_IMPORTED_MODULE_0__util_index__["a" /* default */].getPath(b, sortKey) : b
    }
    return a === b ? 0 : a > b ? order : -order
  }

  // sort on a copy to avoid mutating original array
  return arr.slice().sort(comparator)
}

/* harmony default export */ exports["a"] = orderBy;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * 
 * 12345 => $12,345.00
 *
 * @param {String} sign
 * @param {Number} decimals Decimal places
 */

function currency (value, currency, decimals) {
  var digitsRE = /(\d{3})(?=\d)/g
  value = parseFloat(value)
  if (!isFinite(value) || (!value && value !== 0)) return ''
  currency = currency != null ? currency : '$'
  decimals = decimals != null ? decimals : 2
  var stringified = Math.abs(value).toFixed(decimals)
  var _int = decimals
    ? stringified.slice(0, -1 - decimals)
    : stringified
  var i = _int.length % 3
  var head = i > 0
    ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
    : ''
  var _float = decimals
    ? stringified.slice(-1 - decimals)
    : ''
  var sign = value < 0 ? '-' : ''
  return sign + currency + head +
    _int.slice(i).replace(digitsRE, '$1,') +
    _float
}

/* harmony default export */ exports["a"] = currency;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_index__ = __webpack_require__(0);


/**
 * 'item' => 'items'
 *
 * @params
 *  an array of strings corresponding to
 *  the single, double, triple ... forms of the word to
 *  be pluralized. When the number to be pluralized
 *  exceeds the length of the args, it will use the last
 *  entry in the array.
 *
 *  e.g. ['single', 'double', 'triple', 'multiple']
 */

function pluralize (value) {
  var args = __WEBPACK_IMPORTED_MODULE_0__util_index__["a" /* default */].toArray(arguments, 1)
  return args.length > 1
    ? (args[value % 10 - 1] || args[args.length - 1])
    : (args[0] + (value === 1 ? '' : 's'))
}

/* harmony default export */ exports["a"] = pluralize;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 *  Converts a string into Capitalize
 * 
 * 'abc' => 'Abc'
 */

function capitalize (value) {
  if (!value && value !== 0) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/* harmony default export */ exports["a"] = capitalize;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * Converts a string to lowercase
 * 
 * 'AbC' => 'abc'
 */

function lowercase (value) {
  return (value || value === 0)
    ? value.toString().toLowerCase()
    : ''
}

/* harmony default export */ exports["a"] = lowercase;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 *  If the value is missing outputs the placeholder text
 * 
 * '' => {placeholder}
 * 'foo' => 'foo'
 */

function placeholder (input, property) {
  return ( input === undefined || input === '' || input === null ) ? property : input;
}

/* harmony default export */ exports["a"] = placeholder;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 *  Truncate at the given || default length
 *
 * 'lorem ipsum dolor' => 'lorem ipsum dol...'
 */

function truncate (value, length) {
  length = length || 15
  if( !value || typeof value !== 'string' ) return ''
  if( value.length <= length) return value
  return value.substring(0, length) + '...'
}

/* harmony default export */ exports["a"] = truncate;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * Converts a string to UPPERCASE
 * 
 * 'abc' => 'ABC'
 */

function uppercase (value) {
  return (value || value === 0)
    ? value.toString().toUpperCase()
    : ''
}

/* harmony default export */ exports["a"] = uppercase;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_index__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__string_index__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__array_index__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__other_index__ = __webpack_require__(2);





function install(Vue) {
  __WEBPACK_IMPORTED_MODULE_0__util_index__["a" /* default */].each(__WEBPACK_IMPORTED_MODULE_1__string_index__, function(value, key) {
      Vue.filter(key, value)
  })

  __WEBPACK_IMPORTED_MODULE_0__util_index__["a" /* default */].each(__WEBPACK_IMPORTED_MODULE_3__other_index__, function(value, key) {
      Vue.filter(key, value)
  })

  Vue.mixin({
    methods: {
      limitBy: __WEBPACK_IMPORTED_MODULE_2__array_index__["a" /* limitBy */],
      filterBy: __WEBPACK_IMPORTED_MODULE_2__array_index__["b" /* filterBy */],
      orderBy: __WEBPACK_IMPORTED_MODULE_2__array_index__["c" /* orderBy */]
    }
  })
}

if (window.Vue) {
  Vue.use(install)
} else if (true) {
  module.exports = install
} else if (typeof define === "function" && define.amd) {
  define([], function(){ return install })
} 

/***/ }
/******/ ]);
});