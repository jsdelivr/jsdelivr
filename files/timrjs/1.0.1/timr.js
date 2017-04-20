/**
 * TimrJS v1.0.0
 * https://github.com/joesmith100/timrjs
 * https://www.npmjs.com/package/timrjs
 *
 * Compatible with Browsers, Node.js (CommonJS) and RequireJS.
 *
 * Copyright (c) 2016 Joe Smith
 * Released under the MIT license
 * https://github.com/joesmith100/timrjs/blob/master/LICENSE.md
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Timr", [], factory);
	else if(typeof exports === 'object')
		exports["Timr"] = factory();
	else
		root["Timr"] = factory();
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

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

/* eslint-disable no-unused-vars */
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (e) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_object_assign__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__EventEmitter__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__buildOptions__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__validateStartTime__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__formatTime__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__dateToSeconds__ = __webpack_require__(8);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };










/**
 * @description Creates a Timr.
 *
 * If the provided startTime is 0 or fasly, the constructor will automatically
 * setup the timr as stopwatch, this prevents the timer from counting down into
 * negative numbers and covers previous ( < v1.0.0 ) use case where 0 was used to setup a
 * stopwatch.
 *
 * @param {String|Number} startTime - The starting time for the timr object.
 * @param {Object} [options] - Options to customise the timer.
 *
 * @throws If the provided startTime is neither a number or a string,
 * or, incorrect format.
 *
 * @return {Object} - The newly created Timr object.
 */
function Timr(startTime, options) {
  __WEBPACK_IMPORTED_MODULE_1__EventEmitter__["a" /* default */].call(this);

  this.timer = null;
  // this.running
  // this.startTime
  // this.currentTime
  // this.originalDate
  this.setStartTime(startTime);
  // this.options
  this.changeOptions(options);
}

/**
 * @description Creats event listeners.
 *
 * @param {String} The name of the listener.
 *
 * @return {Function} The function that makes listeners.
 */
function makeListenerGenerator(name) {
  return function listenerGenerator(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Expected ' + name + ' to be a function, instead got: ' + (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)));
    }

    this.on(name, fn);

    return this;
  };
}

/**
 * @description Countdown function.
 * Bound to a setInterval when start() is called.
 */
function countdown() {
  this.currentTime -= 1;

  this.emit('ticker', __WEBPACK_IMPORTED_MODULE_0_object_assign___default()(this.formatTime(), {
    percentDone: this.percentDone(),
    currentTime: this.currentTime,
    startTime: this.startTime,
    self: this
  }));

  if (this.currentTime <= 0) {
    this.stop();
    this.emit('finish', this);
  }
}

/**
 * @description Stopwatch function.
 * Bound to a setInterval when start() is called.
 */
function stopwatch() {
  this.currentTime += 1;

  this.emit('ticker', __WEBPACK_IMPORTED_MODULE_0_object_assign___default()(this.formatTime(), {
    currentTime: this.currentTime,
    startTime: this.startTime,
    self: this
  }));
}

Timr.prototype = __WEBPACK_IMPORTED_MODULE_0_object_assign___default()(Object.create(__WEBPACK_IMPORTED_MODULE_1__EventEmitter__["a" /* default */].prototype), {

  constructor: Timr,

  /**
   * @description Starts the timr.
   *
   * @param {Number} [delay] - Optional delay in ms to start the timer
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  start: function start(delay) {
    var _this = this;

    /* eslint-disable no-console */
    if (this.running && typeof console !== 'undefined' && typeof console.warn === 'function') {
      console.warn('Timer already running', this);
    } else {
      /* eslint-disable no-console */
      var startFn = function startFn() {
        if (_this.originalDate) {
          _this.setStartTime(_this.originalDate);
        }

        _this.running = true;

        _this.timer = _this.options.countdown ? setInterval(countdown.bind(_this), 1000) : setInterval(stopwatch.bind(_this), 1000);
      };

      if (delay) {
        this.delayTimer = setTimeout(startFn, delay);
      } else {
        startFn();
      }

      this.emit('onStart', this);
    }

    return this;
  },


  /**
   * @description Pauses the timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  pause: function pause() {
    this.clear();

    this.emit('onPause', this);

    return this;
  },


  /**
   * @description Stops the timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  stop: function stop() {
    this.clear();

    this.currentTime = this.startTime;

    this.emit('onStop', this);

    return this;
  },


  /**
   * @description Clears the timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  clear: function clear() {
    clearInterval(this.timer);
    clearTimeout(this.delayTimer);

    this.running = false;

    return this;
  },


  /**
   * @description Destroys the timr,
   * clearing the interval, removing all event listeners and removing,
   * from the store (if it's in one).
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  destroy: function destroy() {
    this.emit('onDestroy', this);

    this.clear().removeAllListeners();

    // removeFromStore is added when the timr is added to a store,
    // so need to check if it's in a store before removing it.
    if (typeof this.removeFromStore === 'function') {
      this.removeFromStore();
    }

    return this;
  },


  /**
   * @description The following methods create listeners.
   *
   * Ticker: Called every second the timer ticks down.
   * Finish: Called once when the timer finishes.
   * onStart: Called when the timer starts.
   * onPause: Called when the timer is paused.
   * onStop: Called when the timer is stopped.
   * onDestroy: Called when the timer is destroyed.
   *
   * @throws If the argument is not of type function.
   *
   * @param {Function} fn - Function to be called every second.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  ticker: makeListenerGenerator('ticker'),
  finish: makeListenerGenerator('finish'),
  onStart: makeListenerGenerator('onStart'),
  onPause: makeListenerGenerator('onPause'),
  onStop: makeListenerGenerator('onStop'),
  onDestroy: makeListenerGenerator('onDestroy'),

  /**
   * @description Converts seconds to time format.
   * This is provided to the ticker.
   *
   * @param {String} [time=currentTime] - option do format the startTime
   *
   * @return {Object} The formatted time and raw values.
   */
  formatTime: function formatTime() {
    var time = arguments.length <= 0 || arguments[0] === undefined ? 'currentTime' : arguments[0];

    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__formatTime__["a" /* default */])(this[time], this.options);
  },


  /**
   * @description Returns the time elapsed in percent.
   * This is provided to the ticker.
   *
   * @return {Number} Time elapsed in percent.
   */
  percentDone: function percentDone() {
    return 100 - Math.round(this.currentTime / this.startTime * 100);
  },


  /**
   * @description Creates / changes options for a Timr.
   * Merges with existing or default options.
   *
   * Ignores { countdown: true } if startTime is 0 or falsy
   *
   * @param {Object} options - The options to create / change.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  changeOptions: function changeOptions(options) {
    var newOptions = this.startTime > 0 ? options : __WEBPACK_IMPORTED_MODULE_0_object_assign___default()({}, options, { countdown: false });

    this.options = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__buildOptions__["a" /* default */])(newOptions, this.options);

    return this;
  },


  /**
   * @description Sets new startTime after Timr has been created.
   *
   * Will clear currentTime and reset to new startTime.
   * Will also change the timer to a stopwatch if the startTime is falsy or 0,
   * as per constructor.
   *
   * @param {String|Number} startTime - The new start time.
   *
   * @throws If the starttime is invalid.
   *
   * @return {Object} The original Timr object.
   */
  setStartTime: function setStartTime(startTime) {
    this.clear();

    // Coerces falsy values into 0.
    var newStartTime = 0;

    if (startTime) {
      var parsedDate = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__dateToSeconds__["a" /* default */])(startTime);

      // Double checks parsedDate has a parsed property, in case an empty object is passed
      // in startTime.
      if ((typeof parsedDate === 'undefined' ? 'undefined' : _typeof(parsedDate)) === 'object' && parsedDate.parsed) {
        this.originalDate = parsedDate.originalDate;
        newStartTime = parsedDate.parsed;
      } else {
        this.originalDate = false;
        newStartTime = parsedDate;
      }
    }

    // Changes to stopwatch only if setStartTime is run after Timr creation
    // and the startTime is 0.
    // The constructor will handle this on instantiation.
    if (!newStartTime && this.options) {
      this.changeOptions({ countdown: false });
    }

    this.startTime = this.currentTime = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__validateStartTime__["a" /* default */])(newStartTime);

    return this;
  },


  /**
   * @description Shorthand for this.formatTime(time).formattedTime
   */
  getFt: function getFt() {
    var time = arguments.length <= 0 || arguments[0] === undefined ? 'currentTime' : arguments[0];

    return this.formatTime(time).formattedTime;
  },


  /**
   * @description Shorthand for this.formatTime(time).raw
   */
  getRaw: function getRaw() {
    var time = arguments.length <= 0 || arguments[0] === undefined ? 'currentTime' : arguments[0];

    return this.formatTime(time).raw;
  },


  /**
   * @description Gets the Timrs startTime.
   *
   * @return {Number} Start time in seconds.
   */
  getStartTime: function getStartTime() {
    return this.startTime;
  },


  /**
   * @description Gets the Timrs currentTime.
   *
   * @return {Number} Current time in seconds.
   */
  getCurrentTime: function getCurrentTime() {
    return this.currentTime;
  },


  /**
   * @description Gets the Timrs running value.
   *
   * @return {Boolean} True if running, false if not.
   */
  isRunning: function isRunning() {
    return this.running;
  }
});

/* harmony default export */ exports["a"] = Timr;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__buildOptions__ = __webpack_require__(5);
/* harmony export (immutable) */ exports["a"] = formatTime;


var zeroPad = function zeroPad(number) {
  return number < 10 ? '0' + number : '' + number;
};

/**
 * @description Converts seconds to time format.
 *
 * @param {Number} seconds - The seconds to convert.
 * @param {Object} [options] - The options to build the string.
 *
 * @return {Object} An object that that contains the formattedTime and the
 * raw values used to calculate the time.
 */
function formatTime(seconds, options) {
  var _buildOptions = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__buildOptions__["a" /* default */])(options);

  var formatOutput = _buildOptions.formatOutput;
  var padRaw = _buildOptions.padRaw;


  var totalSeconds = seconds;
  var totalMinutes = Math.floor(totalSeconds / 60);
  var totalHours = totalMinutes && Math.floor(totalMinutes / 60);
  var totalDays = totalHours && Math.floor(totalHours / 24);
  var currentSeconds = totalMinutes ? totalSeconds - totalMinutes * 60 : totalSeconds;
  var currentMinutes = totalHours ? totalMinutes - totalHours * 60 : totalMinutes;
  var currentHours = totalDays ? totalHours - totalDays * 24 : totalHours;
  var currentDays = totalDays;

  var stringToFormat = formatOutput;

  var leftBracketPosition = stringToFormat.lastIndexOf('{') + 1;
  var rightBracketPosition = stringToFormat.indexOf('}');

  /**
   * Get values sitting inbetween { }
   * Match returns empty strings for groups it can't find so filter them out.
   */
  var protectedValues = stringToFormat.slice(leftBracketPosition, rightBracketPosition).match(/(DD)?(HH)?(MM)?(SS)?/gi).filter(function (match) {
    return !!match;
  });

  // If no protectedValues then format string exactly as it appears
  if (protectedValues.length > 0) {
    var lastValueAboveZero = void 0;
    if (totalDays > 0) lastValueAboveZero = 'DD';else if (totalHours > 0) lastValueAboveZero = 'HH';else if (totalMinutes > 0) lastValueAboveZero = 'MM';else if (totalSeconds >= 0) lastValueAboveZero = 'SS';

    /**
     * If the lastValueAboveZero is inbetween the protectedValues than don't remove them.
     * E.G. starting string: HH:{mm:ss} and lastValueAboveZero is 'ss' than begin slice
     * at leftBracketPosition rather than beginning at ss.
     */
    var tempSlice = stringToFormat.search(new RegExp(lastValueAboveZero, 'ig'));
    var beginSlice = tempSlice >= leftBracketPosition ? leftBracketPosition : tempSlice;

    stringToFormat = stringToFormat.slice(beginSlice >= 0 ? beginSlice : 0);
  }

  // Replaces all values in string with their respective number values
  var formattedTime = stringToFormat.replace(/\{?\}?/g, '').replace(/DD/g, totalDays).replace(/HH/g, zeroPad(totalHours)).replace(/MM/g, zeroPad(totalMinutes)).replace(/SS/g, zeroPad(totalSeconds)).replace(/dd/g, currentDays).replace(/hh/g, zeroPad(currentHours)).replace(/mm/g, zeroPad(currentMinutes)).replace(/ss/g, zeroPad(currentSeconds));

  return {
    formattedTime: formattedTime,
    raw: {
      totalDays: padRaw ? zeroPad(totalDays) : totalDays,
      totalHours: padRaw ? zeroPad(totalHours) : totalHours,
      totalMinutes: padRaw ? zeroPad(totalMinutes) : totalMinutes,
      totalSeconds: padRaw ? zeroPad(totalSeconds) : totalSeconds,
      currentDays: padRaw ? zeroPad(currentDays) : currentDays,
      currentHours: padRaw ? zeroPad(currentHours) : currentHours,
      currentMinutes: padRaw ? zeroPad(currentMinutes) : currentMinutes,
      currentSeconds: padRaw ? zeroPad(currentSeconds) : currentSeconds
    }
  };
}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = timeToSeconds;
/**
 * @description Converts time format (HH:MM:SS) into seconds.
 *
 * Automatically rounds the returned number to avoid errors
 * with floating point values.
 *
 * @param {String|Number} time - The time to be converted.
 * If a number is provided it will simply return that number.
 *
 * @return {Number} - The time in seconds.
 */
function timeToSeconds(time) {
  if (typeof time === 'number' && !isNaN(time)) {
    return Math.round(time);
  }

  return Math.round(time.split(':').reduce(function (prev, curr, index, arr) {
    if (arr.length === 3) {
      if (index === 0) return prev + Number(curr) * 60 * 60;
      if (index === 1) return prev + Number(curr) * 60;
    }

    if (arr.length === 2) {
      if (index === 0) return prev + Number(curr) * 60;
    }

    return prev + Number(curr);
  }, 0));
}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__timeToSeconds__ = __webpack_require__(3);
/* harmony export (immutable) */ exports["a"] = validate;
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };



/**
 * @description Validates the startTime
 *
 * Additionally, if a pattern is provided, 25h / 25m, than
 * it is converted here before being passed to timeToSeconds.
 *
 * @param {String|Number} time - The time to be checked
 *
 * @throws If the provided time is neither a number nor a string.
 * @throws If the provided time is a negative number.
 * @throws If the provided time is not in the correct format HH:MM:SS.
 *
 * @returns {Number} - The original number or the converted number if
 * a time string was provided.
 */
function validate(time) {
  var newTime = time;

  // Converts '25m' & '25h' into '25:00' & '25:00:00' respectivley.
  if (/^\d+[mh]$/i.test(newTime)) {
    newTime = newTime.replace(/^(\d+)m$/i, '$1:00');
    newTime = newTime.replace(/^(\d+)h$/i, '$1:00:00');
  }

  if (typeof newTime !== 'string') {
    if (typeof newTime !== 'number' || isNaN(newTime) || newTime === Infinity || newTime === -Infinity) {
      throw new Error(
      // Passes correct type, including null, NaN and Infinity
      'Expected time to be a string or number, instead got: ' + (typeof newTime === 'number' || newTime === null ? newTime : typeof newTime === 'undefined' ? 'undefined' : _typeof(newTime)));
    }
  }

  if (typeof newTime === 'string' && isNaN(Number(newTime))) {
    if (!/^\d+$/.test(newTime) && !/^\d+:\d+$/.test(newTime) && !/^\d+:\d+:\d+$/.test(newTime)) {
      throw new Error('Expected time to be in (hh:mm:ss) format, instead got: ' + newTime);
    }
  }

  if (Number(newTime) < 0) {
    throw new Error('Time cannot be a negative number, got: ' + newTime);
  }

  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__timeToSeconds__["a" /* default */])(newTime);
}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_object_assign__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_object_assign__);
/* harmony export (immutable) */ exports["a"] = buildOptions;
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };



/**
 * @description Builds an options object from default and custom options.
 *
 * @param {Object} [newOptions] - Optional custom options.
 * @param {Object} [oldOptions] - Optional previous options.
 *
 * @throws If any option is invalid.
 *
 * @return {Object} Compiled options from default and custom.
 */
function buildOptions(newOptions, oldOptions) {
  if (newOptions) {
    var formatOutput = newOptions.formatOutput;
    var padRaw = newOptions.padRaw;
    var countdown = newOptions.countdown;


    if (formatOutput) {
      if (typeof formatOutput !== 'string') {
        throw new Error('Expected formatOutput to be a string; instead got: ' + ('' + (typeof formatOutput === 'undefined' ? 'undefined' : _typeof(formatOutput))));
      }
    }

    if (padRaw) {
      if (typeof padRaw !== 'boolean') {
        throw new Error('Expected padRaw to be a boolean; instead got: ' + (typeof padRaw === 'undefined' ? 'undefined' : _typeof(padRaw)));
      }
    }

    if (countdown) {
      if (typeof countdown !== 'boolean') {
        throw new Error('Expected countdown to be a boolean; instead got: ' + (typeof countdown === 'undefined' ? 'undefined' : _typeof(countdown)));
      }
    }
  }

  var defaults = {
    formatOutput: 'DD hh:{mm:ss}',
    padRaw: true,
    countdown: true
  };

  return __WEBPACK_IMPORTED_MODULE_0_object_assign___default()(oldOptions || defaults, newOptions);
}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Timr__ = __webpack_require__(1);
/* harmony export (immutable) */ exports["a"] = createStore;


/**
 * @description Flattens arrays to their base values
 * Example: [[1], 2, [[[3]]]] - [1, 2, 3]
 *
 * @param {Array} The array to flatten
 *
 * @return {Array} The flattened array
 */
function flattenArray(arr) {
  return arr.reduce(function (prev, curr) {
    if (Array.isArray(curr)) {
      return prev.concat(flattenArray(curr));
    }

    return prev.concat(curr);
  }, []);
}

/**
 * @description Creates a store that can store multiple timr objects
 * and perform functions on all of them.
 *
 * @param {Array} [args] - Optional timers to start the store with.
 * Can be any type, but will get filtered down to only timr objects.
 *
 * @return {Object} Returns a store object with methods.
 */
function createStore() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  // Array to store all timrs.
  // Filters out non timr objects and timrs that exist in another store.
  var timrs = flattenArray(args).filter(function (item) {
    return item instanceof __WEBPACK_IMPORTED_MODULE_0__Timr__["a" /* default */];
  }).filter(function (timr) {
    return typeof timr.removeFromStore !== 'function';
  });

  var removeFromStore = function removeFromStore(timr) {
    if (timr instanceof __WEBPACK_IMPORTED_MODULE_0__Timr__["a" /* default */]) {
      timrs = timrs.filter(function (x) {
        return x !== timr;
      });
      /* eslint-disable no-param-reassign */
      timr.removeFromStore = null;
    }
  };

  // Provides each Timr with the ability to remove itself from the store.
  timrs.forEach(function (timr) {
    timr.removeFromStore = function () {
      removeFromStore(timr);
    };
  });

  return {
    /**
     * @description Adds the provided timr to the store.
     *
     * @param {Object} timr - A timr object.
     *
     * @throws If the provided timr is not a Timr object.
     * @throws If the provided timr is already in a store.
     *
     * @return {Object} The provided timr object.
     */
    add: function add(timr) {
      if (timr instanceof __WEBPACK_IMPORTED_MODULE_0__Timr__["a" /* default */] && typeof timr.removeFromStore !== 'function') {
        timrs.push(timr);

        timr.removeFromStore = function () {
          removeFromStore(timr);
        };
        /* eslint-disable no-param-reassign */
      } else {
        throw new Error('Unable to add to store; provided argument is either already in a store ' + 'or not a timr object.');
      }

      return timr;
    },

    // Methods associated with all Timrs.
    getAll: function getAll() {
      return timrs;
    },
    startAll: function startAll() {
      return timrs.forEach(function (timr) {
        return timr.start();
      });
    },
    pauseAll: function pauseAll() {
      return timrs.forEach(function (timr) {
        return timr.pause();
      });
    },
    stopAll: function stopAll() {
      return timrs.forEach(function (timr) {
        return timr.stop();
      });
    },
    isRunning: function isRunning() {
      return timrs.filter(function (timr) {
        return timr.isRunning();
      });
    },
    removeFromStore: removeFromStore,
    destroyAll: function destroyAll() {
      timrs.forEach(function (timr) {
        return timr.destroy();
      });
      timrs = [];
    }
  };
}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * @description Creates an EventEmitter.
 *
 * This is a super slimmed down version of nodes EventEmitter.
 *
 * This is only intended for internal use, as there is
 * no real error checking.
 */
function EventEmitter() {
  this.events = {};
}

EventEmitter.prototype = {

  constructor: EventEmitter,

  /**
   * @description Registers a listener to an event array.
   *
   * @param {String} event - The event to attach to.
   * @param {Function} listener - The event listener.
   */
  on: function on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(listener);
  },


  /**
   * @description Emits an event, calling all listeners store
   * against the provided event.
   *
   * @param {String} event - The event to emit.
   */
  emit: function emit(event) {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (this.events[event]) {
      this.events[event].forEach(function (listener) {
        listener.apply(_this, args);
      });
    }
  },


  /**
   * @description Removes all listeners.
   */
  removeAllListeners: function removeAllListeners() {
    this.events = {};
  }
};

/* harmony default export */ exports["a"] = EventEmitter;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = dateToSeconds;
var zeroPad = function zeroPad(number) {
  return number < 10 ? '0' + number : number;
};

/**
 * @description Converts an ISO date string, or unix time into seconds until that date/time.
 *
 * @param {String|Number} startTime - The ISO date string or unix time in ms.
 *
 * @throws If the date matches the regex but is not ISO format.
 * @throws If the date is in the past.
 *
 * @return {Object|Any} - Returns the converted seconds and the original date.
 * The originalDate is used to re-run the function when the timer starts, to ensure
 * that it is up to date.
 */
function dateToSeconds(startTime) {
  if (/^(\d{4}-\d{2}-\d{2})?(T\d{2}:\d{2}(:\d{2})?)?(([-+]\d{2}:\d{2})?Z?)?$/i.test(startTime) || startTime >= 63072000000) {
    var dateNow = new Date();
    var newStartTime = startTime;

    if (/^(\d{4}-\d{2}-\d{2})$/i.test(newStartTime)) {
      newStartTime = newStartTime + 'T00:00';
    }

    var parsedStartTime = new Date(newStartTime).getTime();
    var startTimeInSeconds = Math.ceil((parsedStartTime - dateNow.getTime()) / 1000);

    if (isNaN(parsedStartTime)) {
      throw new Error('The date/time you passed does not match ISO format. ' + ('You passed: "' + startTime + '".'));
    }

    if (startTimeInSeconds < 0) {
      throw new Error('When passing a date/time, it cannot be in the past. ' + ('You passed: "' + startTime + '". It\'s currently: ') + ('"' + zeroPad(dateNow.getFullYear()) + '-' + (zeroPad(dateNow.getMonth()) + 1) + '-') + (zeroPad(dateNow.getDate()) + ' ') + (zeroPad(dateNow.getHours()) + ':' + zeroPad(dateNow.getMinutes()) + ':') + (zeroPad(dateNow.getSeconds()) + '"'));
    }

    return {
      originalDate: startTime,
      parsed: startTimeInSeconds
    };
  }

  return startTime;
}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_object_assign__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__validateStartTime__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__formatTime__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__timeToSeconds__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__createStore__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Timr__ = __webpack_require__(1);









var init = __WEBPACK_IMPORTED_MODULE_0_object_assign___default()(
/**
 * @description Creates a new Timr object.
 *
 * @param {String|Number} startTime - The starting time for the timr object.
 * @param {Object} [options] - Options to customise the timer.
 *
 * @return {Object} A new Timr object.
 */
function (startTime, options) {
  return new __WEBPACK_IMPORTED_MODULE_5__Timr__["a" /* default */](startTime, options);
},

// Exposed helper methods.
{
  validateStartTime: __WEBPACK_IMPORTED_MODULE_1__validateStartTime__["a" /* default */],
  formatTime: __WEBPACK_IMPORTED_MODULE_2__formatTime__["a" /* default */],
  timeToSeconds: __WEBPACK_IMPORTED_MODULE_3__timeToSeconds__["a" /* default */],
  createStore: __WEBPACK_IMPORTED_MODULE_4__createStore__["a" /* default */]
});

module.exports = init;

/***/ }
/******/ ]);
});