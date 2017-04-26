/**
 * TimrJS v0.9.0
 * https://github.com/joesmith100/timrjs
 * https://www.npmjs.com/package/timrjs
 *
 * Compatible with Browsers, Node.js (CommonJS) and RequireJS.
 *
 * Copyright (c) 2016 Joe Smith
 * Released under the MIT license
 * https://github.com/joesmith100/timrjs/blob/master/LICENSE
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _objectAssign = __webpack_require__(1);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	var _validate = __webpack_require__(7);

	var _validate2 = _interopRequireDefault(_validate);

	var _formatTime = __webpack_require__(5);

	var _formatTime2 = _interopRequireDefault(_formatTime);

	var _timeToSeconds = __webpack_require__(6);

	var _timeToSeconds2 = _interopRequireDefault(_timeToSeconds);

	var _correctFormat = __webpack_require__(4);

	var _correctFormat2 = _interopRequireDefault(_correctFormat);

	var _createStore = __webpack_require__(9);

	var _createStore2 = _interopRequireDefault(_createStore);

	var _Timr = __webpack_require__(2);

	var _Timr2 = _interopRequireDefault(_Timr);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var init = (0, _objectAssign2.default)(
	/**
	 * @description Creates a new Timr object.
	 *
	 * @param {String|Number} startTime - The starting time for the timr object.
	 * @param {Object} [options] - Options to customise the timer.
	 *
	 * @return {Object} A new Timr object.
	 */
	function (startTime, options) {
	  return new _Timr2.default(startTime, options);
	},

	// Exposed helper methods.
	{
	  validate: _validate2.default,
	  formatTime: _formatTime2.default,
	  timeToSeconds: _timeToSeconds2.default,
	  correctFormat: _correctFormat2.default,
	  createStore: _createStore2.default
	});

	module.exports = init;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _objectAssign = __webpack_require__(1);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	var _EventEmitter = __webpack_require__(8);

	var _EventEmitter2 = _interopRequireDefault(_EventEmitter);

	var _buildOptions = __webpack_require__(3);

	var _buildOptions2 = _interopRequireDefault(_buildOptions);

	var _validate = __webpack_require__(7);

	var _validate2 = _interopRequireDefault(_validate);

	var _formatTime2 = __webpack_require__(5);

	var _formatTime3 = _interopRequireDefault(_formatTime2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @description Creates a Timr.
	 *
	 * @param {String|Number} startTime - The starting time for the timr object.
	 * @param {Object} [options] - Options to customise the timer.
	 *
	 * @throws If the provided startTime is neither a number or a string,
	 * or, incorrect format.
	 */
	function Timr(startTime, options) {
	  _EventEmitter2.default.call(this);

	  this.timer = null;
	  this.running = false;
	  this.startTime = (0, _validate2.default)(startTime);
	  this.currentTime = this.startTime;
	  this.changeOptions(options);
	}

	/**
	 * @description Countdown function.
	 * Bound to a setInterval when start() is called.
	 */
	Timr.countdown = function countdown() {
	  this.currentTime -= 1;

	  this.emit('ticker', this.formatTime(), this.percentDone(), this.currentTime, this.startTime, this);

	  if (this.currentTime <= 0) {
	    this.stop();
	    this.emit('finish', this);
	  }
	};

	/**
	 * @description Stopwatch function.
	 * Bound to a setInterval when start() is called.
	 */
	Timr.stopwatch = function stopwatch() {
	  this.currentTime += 1;

	  this.emit('ticker', this.formatTime(), this.currentTime, this);

	  if (this.currentTime > 3599999) {
	    this.stop();
	    this.emit('finish', this);
	  }
	};

	Timr.prototype = (0, _objectAssign2.default)(Object.create(_EventEmitter2.default.prototype), {

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
	        _this.running = true;

	        _this.timer = _this.startTime > 0 ? setInterval(Timr.countdown.bind(_this), 1000) : setInterval(Timr.stopwatch.bind(_this), 1000);
	      };

	      if (delay) {
	        this.delayTimer = setTimeout(startFn, delay);
	      } else {
	        startFn();
	      }
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
	    this.clear().removeAllListeners();

	    // removeFromStore is added when the timr is added to a store,
	    // so need to check if it's in a store before removing it.
	    if (typeof this.removeFromStore === 'function') {
	      this.removeFromStore();
	    }

	    return this;
	  },


	  /**
	   * @description The ticker method is called every second
	   * the timer ticks down.
	   *
	   * As Timr inherits from EventEmitter, this can be called
	   * multiple times with different functions and each one will
	   * be called when the event is emitted.
	   *
	   * @throws If the argument is not of type function.
	   *
	   * @param {Function} fn - Function to be called every second.
	   * @return {Object} Returns a reference to the Timr so calls can be chained.
	   */
	  ticker: function ticker(fn) {
	    if (typeof fn !== 'function') {
	      throw new Error('Expected ticker to be a function, instead got: ' + (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)));
	    }

	    this.on('ticker', fn);

	    return this;
	  },


	  /**
	   * @description The finish method is called once when the
	   * timer finishes.
	   *
	   * As Timr inherits from EventEmitter, this can be called
	   * multiple times with different functions and each one will
	   * be called when the event is emitted.
	   *
	   * @throws If the argument is not of type function.
	   *
	   * @param {Function} fn - Function to be called when finished.
	   * @return {Object} Returns a reference to the Timr so calls can be chained.
	   */
	  finish: function finish(fn) {
	    if (typeof fn !== 'function') {
	      throw new Error('Expected finish to be a function, instead got: ' + (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)));
	    }

	    this.on('finish', fn);

	    return this;
	  },


	  /**
	   * @description Converts seconds to time format.
	   * This is provided to the ticker method as the first argument.
	   *
	   * @param {String} [time=currentTime] - option do format the startTime
	   *
	   * @return {String} The formatted time.
	   */
	  formatTime: function formatTime() {
	    var time = arguments.length <= 0 || arguments[0] === undefined ? 'currentTime' : arguments[0];

	    return (0, _formatTime3.default)(this[time], this.options);
	  },


	  /**
	   * @description Returns the time elapsed in percent.
	   * This is provided to the ticker method as the second argument.
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
	   * @param {Object} options - The options to create / change.
	   * @return {Object} Returns a reference to the Timr so calls can be chained.
	   */
	  changeOptions: function changeOptions(options) {
	    this.options = (0, _buildOptions2.default)(options, this.options);

	    return this;
	  },


	  /**
	   * @description Sets new startTime after Timr has been created.
	   * Will clear currentTime and reset to new startTime.
	   *
	   * @param {String|Number} startTime - The new start time.
	   *
	   * @throws If the starttime is invalid.
	   *
	   * @return {String} Returns the formatted startTime.
	   */
	  setStartTime: function setStartTime(startTime) {
	    this.clear();

	    this.startTime = this.currentTime = (0, _validate2.default)(startTime);

	    return this.formatTime();
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

	exports.default = Timr;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.default = buildOptions;

	var _objectAssign = __webpack_require__(1);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	    var separator = newOptions.separator;
	    var outputFormat = newOptions.outputFormat;
	    var formatType = newOptions.formatType;

	    // Error checking for separator.

	    if (separator) {
	      if (typeof separator !== 'string') {
	        throw new Error('Expected separator to be a string, instead got: ' + (typeof separator === 'undefined' ? 'undefined' : _typeof(separator)));
	      }
	    }

	    // Error checking for outputFormat.
	    if (outputFormat) {
	      if (!/^(hh:)?(mm:)?ss$/i.test(outputFormat)) {
	        throw new Error('Expected outputFormat to be: hh:mm:ss, mm:ss (default) or ss; instead got: ' + outputFormat);
	      }
	    }

	    // Error checking for formatType.
	    if (formatType) {
	      if (!/^[hms]$/i.test(formatType)) {
	        throw new Error('Expected formatType to be: h, m or s; instead got: ' + formatType);
	      }
	    }
	  }

	  return (0, _objectAssign2.default)(oldOptions || { formatType: 'h', outputFormat: 'mm:ss', separator: ':' }, newOptions);
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = correctFormat;
	/**
	 * @description Checks the provided time for correct formatting.
	 * See incorrectFormat-test.js for examples of correct and incorrect formatting.
	 *
	 * @param {String} time - The provided time string.
	 *
	 * @returns {Boolean} True if format is correct, false otherwise.
	 */

	function correctFormat(time) {
	  var newTime = time;

	  if (typeof newTime === 'number') {
	    return true;
	  }

	  if (typeof newTime !== 'string') {
	    return false;
	  }

	  newTime = newTime.split(':');

	  // No more than 3 units (hh:mm:ss) and every unit is a number and is not a negative number.
	  return newTime.length <= 3 && newTime.every(function (el) {
	    return !isNaN(Number(el)) && Number(el) >= 0;
	  });
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = formatTime;

	var _buildOptions2 = __webpack_require__(3);

	var _buildOptions3 = _interopRequireDefault(_buildOptions2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @description Converts seconds to time format.
	 *
	 * @param {Number} seconds - The seconds to convert.
	 * @param {Object} [options] - The options to build the string.
	 *
	 * @return {String} The formatted time.
	 */
	function formatTime(seconds, options) {
	  var _buildOptions = (0, _buildOptions3.default)(options);

	  var outputFormat = _buildOptions.outputFormat;
	  var formatType = _buildOptions.formatType;
	  var separator = _buildOptions.separator;

	  /**
	   * @description Creates a timestring.
	   * Created inside formatTime to have access to separator argument,
	   *
	   * @param {Array} [...args] - All arguments to be processed
	   *
	   * @return {String} The compiled time string.
	   */

	  var createTimeString = function createTimeString() {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return args.filter(function (value) {
	      return value !== false;
	    }).map(function (value) {
	      return value < 10 ? '0' + value : value;
	    }).join(separator);
	  };

	  if (formatType === 's') {
	    return '' + seconds;
	  }

	  var minutes = seconds / 60;

	  if (minutes >= 1 && /[hm]/i.test(formatType)) {
	    var hours = minutes / 60;
	    minutes = Math.floor(minutes);

	    if (hours >= 1 && /[h]/i.test(formatType)) {
	      hours = Math.floor(hours);

	      return createTimeString(hours, minutes - hours * 60, seconds - minutes * 60);
	    }

	    return createTimeString(/HH:MM:SS/i.test(outputFormat) && 0, minutes, seconds - minutes * 60);
	  }

	  return createTimeString(/HH:MM:SS/i.test(outputFormat) && 0, /MM:SS/i.test(outputFormat) && 0, seconds);
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = timeToSeconds;
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
	      if (index === 0) {
	        return prev + Number(curr) * 60 * 60;
	      }
	      if (index === 1) {
	        return prev + Number(curr) * 60;
	      }
	    }

	    if (arr.length === 2) {
	      if (index === 0) {
	        return prev + Number(curr) * 60;
	      }
	    }

	    return prev + Number(curr);
	  }, 0));
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.default = validate;

	var _timeToSeconds = __webpack_require__(6);

	var _timeToSeconds2 = _interopRequireDefault(_timeToSeconds);

	var _correctFormat = __webpack_require__(4);

	var _correctFormat2 = _interopRequireDefault(_correctFormat);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @description Validates the provded time
	 *
	 * Additionally, if a pattern is provided, 25h / 25m, than
	 * it is converted here before being passed to timeToSeconds.
	 *
	 * @param {String|Number} time - The time to be checked
	 *
	 * @throws If the provided time is neither a number nor a string.
	 * @throws If the provided time is a negative number.
	 * @throws If the provided time is not in the correct format.
	 * @throws If the provided time in seconds is over 999:59:59.
	 *
	 * @returns {Number} - The original number or the converted number if
	 * a time string was provided.
	 */
	function validate(time) {
	  var newTime = time;

	  if (/^\d+[mh]$/i.test(newTime)) {
	    newTime = newTime.replace(/^(\d+)m$/i, '$1:00');
	    newTime = newTime.replace(/^(\d+)h$/i, '$1:00:00');
	  }

	  if (!(!isNaN(newTime) && newTime !== Infinity && newTime !== -Infinity && typeof newTime === 'number' || typeof newTime === 'string')) {
	    throw new Error('Expected time to be a string or number, instead got: ' + (
	    // Passes correct type, including null, NaN and Infinity
	    typeof newTime === 'number' || newTime === null ? newTime : typeof newTime === 'undefined' ? 'undefined' : _typeof(newTime)));
	  }

	  if (!(isNaN(Number(newTime)) || Number(newTime) >= 0)) {
	    throw new Error('Time cannot be a negative number, got: ' + newTime);
	  }

	  if (!(0, _correctFormat2.default)(newTime)) {
	    throw new Error('Expected time to be in (hh:mm:ss) format, instead got: ' + newTime);
	  }

	  if ((0, _timeToSeconds2.default)(newTime) > 3599999) {
	    throw new Error('Sorry, we don\'t support any time over 999:59:59.');
	  }

	  return (0, _timeToSeconds2.default)(newTime);
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
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

	exports.default = EventEmitter;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = createStore;

	var _Timr = __webpack_require__(2);

	var _Timr2 = _interopRequireDefault(_Timr);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	    return item instanceof _Timr2.default;
	  }).filter(function (timr) {
	    return typeof timr.removeFromStore !== 'function';
	  });

	  var removeFromStore = function removeFromStore(timr) {
	    if (timr instanceof _Timr2.default) {
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
	      if (timr instanceof _Timr2.default && typeof timr.removeFromStore !== 'function') {
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

/***/ }
/******/ ])
});
;