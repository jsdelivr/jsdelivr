/**
 * TimrJS v0.8.1
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

	var _validate = __webpack_require__(6);

	var _validate2 = _interopRequireDefault(_validate);

	var _formatTime = __webpack_require__(3);

	var _formatTime2 = _interopRequireDefault(_formatTime);

	var _timeToSeconds = __webpack_require__(5);

	var _timeToSeconds2 = _interopRequireDefault(_timeToSeconds);

	var _correctFormat = __webpack_require__(2);

	var _correctFormat2 = _interopRequireDefault(_correctFormat);

	var _store = __webpack_require__(4);

	var _store2 = _interopRequireDefault(_store);

	var _Timr = __webpack_require__(8);

	var _Timr2 = _interopRequireDefault(_Timr);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var add = _store2.default.add;
	var getAll = _store2.default.getAll;
	var startAll = _store2.default.startAll;
	var pauseAll = _store2.default.pauseAll;
	var stopAll = _store2.default.stopAll;
	var isRunning = _store2.default.isRunning;
	var removeFromStore = _store2.default.removeFromStore;
	var destroyAll = _store2.default.destroyAll;


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
	  var timr = new _Timr2.default(startTime, options);

	  // Stores timr if options.store is true. Overrides global setting.
	  if (options) {
	    if (options.store) {
	      return add(timr);
	    }
	    if (options.store === false) {
	      return timr;
	    }
	  }

	  // Stores timr if global setting is true.
	  if (init.store) {
	    return add(timr);
	  }

	  return timr;
	},

	// Option to enable storing timrs, defaults to false.
	{ store: false },

	// Exposed helper methods.
	{
	  validate: _validate2.default,
	  formatTime: _formatTime2.default,
	  timeToSeconds: _timeToSeconds2.default,
	  correctFormat: _correctFormat2.default
	},

	// Methods for all stored timrs.
	{
	  add: add,
	  getAll: getAll,
	  startAll: startAll,
	  pauseAll: pauseAll,
	  stopAll: stopAll,
	  isRunning: isRunning,
	  removeFromStore: removeFromStore,
	  destroyAll: destroyAll
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
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = formatTime;
	/**
	 * @description Converts seconds to time format.
	 *
	 * @param {Number} seconds - The seconds to convert.
	 * @param {String} separator - The character used to separate the time units.
	 * @param {String} outputFormat - The way the time is displayed.
	 * @param {String} formatType - The way in which the time string is created.
	 *
	 * @return {String} The formatted time.
	 */
	function formatTime(seconds) {
	  var separator = arguments.length <= 1 || arguments[1] === undefined ? ':' : arguments[1];
	  var outputFormat = arguments.length <= 2 || arguments[2] === undefined ? 'mm:ss' : arguments[2];
	  var formatType = arguments.length <= 3 || arguments[3] === undefined ? 'h' : arguments[3];

	  /**
	   * @description Creates a timestring.
	   * Created inside formatTime to have access to its arguments,
	   *
	   * @param {Array} [...args] - All arguments to be processed
	   *
	   * @return {String} The compiled time string.
	   */
	  function createTimeString() {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return args.filter(function (value) {
	      return value !== false;
	    }).map(function (value) {
	      return value < 10 ? '0' + value : value;
	    }).join(separator);
	  }

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
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function store() {
	  // Array to store all timrs.
	  var timrs = [];

	  return {
	    /**
	     * @description A function that stores all timr objects created.
	     * This feature is disabled by default, Timr.store = true to enable.
	     *
	     * Can also be disabled/enabled on an individual basis.
	     * Each timr object accepts store as an option, true or false.
	     * This overides the global Timr.store option.
	     *
	     * @param {Object} timr - A timr object.
	     *
	     * @return {Object} The provided timr object.
	     */
	    add: function add(timr) {
	      if (timrs.indexOf(timr) === -1) {
	        timrs.push(timr);
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
	    removeFromStore: function removeFromStore(timr) {
	      timrs = timrs.filter(function (x) {
	        return x !== timr;
	      });
	    },
	    destroyAll: function destroyAll() {
	      timrs.forEach(function (timr) {
	        return timr.destroy();
	      });
	      timrs = [];
	    }
	  };
	}();

/***/ },
/* 5 */
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.default = validate;

	var _timeToSeconds = __webpack_require__(5);

	var _timeToSeconds2 = _interopRequireDefault(_timeToSeconds);

	var _correctFormat = __webpack_require__(2);

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
/* 7 */
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _objectAssign = __webpack_require__(1);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	var _EventEmitter = __webpack_require__(7);

	var _EventEmitter2 = _interopRequireDefault(_EventEmitter);

	var _buildOptions = __webpack_require__(9);

	var _buildOptions2 = _interopRequireDefault(_buildOptions);

	var _validate = __webpack_require__(6);

	var _validate2 = _interopRequireDefault(_validate);

	var _store = __webpack_require__(4);

	var _store2 = _interopRequireDefault(_store);

	var _formatTime2 = __webpack_require__(3);

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
	   * from the store.
	   *
	   * @return {Object} Returns a reference to the Timr so calls can be chained.
	   */
	  destroy: function destroy() {
	    this.clear().removeAllListeners();

	    _store2.default.removeFromStore(this);

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

	    return (0, _formatTime3.default)(this[time], this.options.separator, this.options.outputFormat, this.options.formatType);
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
	    this.options = (0, _buildOptions2.default)(options, this);

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
/* 9 */
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
	 * @param {Object} options - Custom options.
	 * @param {Object} timr - The Timr object.
	 *
	 * @throws If any option is invalid.
	 *
	 * @return {Object} Compiled options from default and custom.
	 */
	function buildOptions(options, timr) {
	  if (options) {
	    var separator = options.separator;
	    var outputFormat = options.outputFormat;
	    var formatType = options.formatType;

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

	  return (0, _objectAssign2.default)(timr.options || { formatType: 'h', outputFormat: 'mm:ss', separator: ':' }, options);
	}

/***/ }
/******/ ])
});
;