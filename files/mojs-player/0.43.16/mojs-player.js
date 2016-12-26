(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("mojs-player", [], factory);
	else if(typeof exports === 'object')
		exports["mojs-player"] = factory();
	else
		root["mojs-player"] = factory();
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
/******/ 	__webpack_require__.p = "build/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {'use strict';

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(3);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _stringify = __webpack_require__(71);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _extends2 = __webpack_require__(73);

	var _extends3 = _interopRequireDefault(_extends2);

	var _classCallCheck2 = __webpack_require__(78);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(79);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _classlistPolyfill = __webpack_require__(88);

	var _classlistPolyfill2 = _interopRequireDefault(_classlistPolyfill);

	var _icons = __webpack_require__(89);

	var _icons2 = _interopRequireDefault(_icons);

	var _module = __webpack_require__(90);

	var _module2 = _interopRequireDefault(_module);

	var _playerSlider = __webpack_require__(91);

	var _playerSlider2 = _interopRequireDefault(_playerSlider);

	var _iconButton = __webpack_require__(111);

	var _iconButton2 = _interopRequireDefault(_iconButton);

	var _speedControl = __webpack_require__(123);

	var _speedControl2 = _interopRequireDefault(_speedControl);

	var _playButton = __webpack_require__(135);

	var _playButton2 = _interopRequireDefault(_playButton);

	var _stopButton = __webpack_require__(143);

	var _stopButton2 = _interopRequireDefault(_stopButton);

	var _repeatButton = __webpack_require__(147);

	var _repeatButton2 = _interopRequireDefault(_repeatButton);

	var _boundsButton = __webpack_require__(155);

	var _boundsButton2 = _interopRequireDefault(_boundsButton);

	var _hideButton = __webpack_require__(156);

	var _hideButton2 = _interopRequireDefault(_hideButton);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// TODO

	__webpack_require__(160);
	var CLASSES = __webpack_require__(162);

	var MojsPlayer = function (_Module) {
	  (0, _inherits3.default)(MojsPlayer, _Module);

	  function MojsPlayer(o) {
	    (0, _classCallCheck3.default)(this, MojsPlayer);

	    if (typeof mojs === 'undefined') {
	      throw new Error('MojsPlayer relies on mojs^0.225.2, please include it before player initialization. [ https://github.com/legomushroom/mojs ] ');
	    }
	    return (0, _possibleConstructorReturn3.default)(this, _Module.call(this, o));
	  }
	  /*
	    Method to declare defaults.
	    @private
	    @overrides @ Module
	  */


	  MojsPlayer.prototype._declareDefaults = function _declareDefaults() {
	    _Module.prototype._declareDefaults.call(this);

	    this._defaults.isSaveState = true;
	    this._defaults.isPlaying = false;
	    this._defaults.progress = 0;
	    this._defaults.isRepeat = false;
	    this._defaults.isBounds = false;
	    this._defaults.leftBound = 0;
	    this._defaults.rightBound = 1;
	    this._defaults.isSpeed = false;
	    this._defaults.speed = 1;
	    this._defaults.isHidden = false;
	    this._defaults.precision = 0.1;
	    this._defaults.name = 'mojs-player';

	    this.revision = '0.43.16';

	    var str = this._fallbackTo(this._o.name, this._defaults.name);
	    str += str === this._defaults.name ? '' : '__' + this._defaults.name;
	    this._localStorage = str + '__' + this._hashCode(str);
	  };
	  /*
	    Method to copy `_o` options to `_props` object
	    with fallback to `localStorage` and `_defaults`.
	    @private
	  */


	  MojsPlayer.prototype._extendDefaults = function _extendDefaults() {
	    this._props = {};
	    var p = this._props,
	        o = this._o,
	        defs = this._defaults;

	    // get localstorage regarding isSaveState option
	    p.isSaveState = this._fallbackTo(o.isSaveState, defs.isSaveState);
	    var m = p.isSaveState ? JSON.parse(localStorage.getItem(this._localStorage)) || {} : {};

	    for (var key in defs) {
	      var value = this._fallbackTo(m[key], o[key]);
	      this._assignProp(key, this._fallbackTo(value, defs[key]));
	    }
	    // get raw-speed option
	    this._props['raw-speed'] = this._fallbackTo(m['raw-speed'], .5);
	  };
	  /*
	    Callback for keyup on document.
	    @private
	    @param {Object} Original event object.
	  */


	  MojsPlayer.prototype._keyUp = function _keyUp(e) {
	    if (e.altKey) {
	      switch (e.keyCode) {
	        case 80:
	          // alt + P => PLAY/PAUSE TOGGLE
	          this._props.isPlaying = !this._props.isPlaying;
	          this._onPlayStateChange(this._props.isPlaying);
	          break;
	        case 189:
	          // alt + - => DECREASE PROGRESS
	          this.playButton.off();
	          this.playerSlider.decreaseProgress(e.shiftKey ? .1 : .01);
	          break;
	        case 187:
	          // alt + + => INCREASE PROGRESS
	          this.playButton.off();
	          this.playerSlider.increaseProgress(e.shiftKey ? .1 : .01);
	          break;
	        case 83:
	          // alt + S => STOP
	          this._onStop();
	          break;
	        case 82:
	          // alt + R => REPEAT TOGGLE
	          this._props.isRepeat = !this._props.isRepeat;
	          var method = this._props.isRepeat ? 'on' : 'off';
	          this.repeatButton[method]();
	          break;
	        case 66:
	          // alt + B => BOUNDS TOGGLE
	          this._props.isBounds = !this._props.isBounds;
	          var method = this._props.isBounds ? 'on' : 'off';
	          this.boundsButton[method]();
	          break;
	        case 72:
	          // alt + H => HIDE PLAYER TOGGLE
	          this._props.isHidden = !this._props.isHidden;
	          this._onHideStateChange(this._props.isHidden);
	          var method = this._props.isHidden ? 'on' : 'off';
	          this.hideButton[method]();
	          break;
	        // case 49: // alt + 1 => RESET SPEED TO 1x
	        case 81:
	          // alt + q => RESET SPEED TO 1x
	          this.speedControl.reset();
	          break;
	        case 50:
	          // alt + 2 => DECREASE SPEEED by .05
	          this.speedControl.decreaseSpeed(e.shiftKey ? .05 : .01);
	          break;
	        case 51:
	          // alt + 3 => INCREASE SPEED by .05
	          this.speedControl.increaseSpeed(e.shiftKey ? .05 : .01);
	          break;
	      }
	    }
	  };
	  /*
	    Method to declare properties.
	    @private
	    @overrides @ Module
	  */


	  MojsPlayer.prototype._vars = function _vars() {
	    this._hideCount = 0;
	  };
	  /*
	    Method to render the module.
	    @private
	    @overrides @ Module
	  */


	  MojsPlayer.prototype._render = function _render() {
	    this._initTimeline();
	    var p = this._props,
	        className = 'mojs-player',
	        icons = new _icons2.default({ prefix: this._props.prefix });
	    _Module.prototype._render.call(this);
	    // this.el.classList.add(p.classNAme );
	    this.el.classList.add(CLASSES[className]);
	    this.el.setAttribute('id', 'js-mojs-player');

	    var left = this._createChild('div', CLASSES[className + '__left']),
	        mid = this._createChild('div', CLASSES[className + '__mid']),
	        right = this._createChild('div', CLASSES[className + '__right']);

	    this.repeatButton = new _repeatButton2.default({
	      parent: left,
	      isOn: p.isRepeat,
	      onStateChange: this._onRepeatStateChange.bind(this),
	      prefix: this._props.prefix
	    });

	    this.playerSlider = new _playerSlider2.default({
	      parent: mid,
	      isBounds: p.isBounds,
	      leftProgress: p.leftBound,
	      rightProgress: p.rightBound,
	      progress: p.progress,
	      onLeftProgress: this._onLeftProgress.bind(this),
	      onProgress: this._onProgress.bind(this),
	      onRightProgress: this._onRightProgress.bind(this),
	      onSeekStart: this._onSeekStart.bind(this),
	      onSeekEnd: this._onSeekEnd.bind(this)
	    });

	    this.boundsButton = new _boundsButton2.default({
	      isOn: p.isBounds,
	      parent: left,
	      onStateChange: this._boundsStateChange.bind(this),
	      prefix: this._props.prefix
	    });

	    this.speedControl = new _speedControl2.default({
	      parent: left,
	      // progress:       p.speed,
	      speed: p.speed,
	      isOn: p.isSpeed,
	      onSpeedChange: this._onSpeedChange.bind(this),
	      onIsSpeed: this._onIsSpeed.bind(this),
	      prefix: this._props.prefix
	    });

	    var proc = 0,
	        progress = [],
	        procToSpeed = [],
	        speedToProc = [];

	    this.stopButton = new _stopButton2.default({
	      parent: left,
	      isPrepend: true,
	      onPointerUp: this._onStop.bind(this),
	      prefix: this._props.prefix
	    });

	    this.playButton = new _playButton2.default({
	      parent: left,
	      isOn: p.isPlaying,
	      isPrepend: true,
	      onStateChange: this._onPlayStateChange.bind(this),
	      prefix: this._props.prefix
	    });

	    this.mojsButton = new _iconButton2.default({
	      parent: right,
	      className: CLASSES[className + '__mojs-logo'],
	      icon: 'mojs',
	      target: '_blank',
	      link: 'https://github.com/legomushroom/mojs-player',
	      title: 'mo • js',
	      prefix: this._props.prefix
	    });

	    this.hideButton = new _hideButton2.default({
	      parent: this.el,
	      className: CLASSES[className + '__hide-button'],
	      isOn: p.isHidden,
	      onStateChange: this._onHideStateChange.bind(this),
	      prefix: this._props.prefix
	    });

	    this._listen();
	  };
	  /*
	    Method to initialize event listeners.
	    @private
	  */


	  MojsPlayer.prototype._listen = function _listen() {
	    var unloadEvent = 'onpagehide' in window ? 'pagehide' : 'beforeunload';
	    window.addEventListener(unloadEvent, this._onUnload.bind(this));
	    document.addEventListener('keyup', this._keyUp.bind(this));
	  };
	  /*
	    Method that is invoked when user touches the track.
	    @private
	    @param {Object} Original event object.
	  */


	  MojsPlayer.prototype._onSeekStart = function _onSeekStart(e) {
	    this._sysTween.pause();
	  };
	  /*
	    Method that is invoked when user touches the track.
	    @private
	    @param {Object} Original event object.
	  */


	  MojsPlayer.prototype._onSeekEnd = function _onSeekEnd(e) {
	    var _this2 = this;

	    clearTimeout(this._endTimer);
	    this._endTimer = setTimeout(function () {
	      _this2._props.isPlaying && _this2._play();
	    }, 20);
	  };
	  /*
	    Method to init timeline.
	    @private
	  */


	  MojsPlayer.prototype._initTimeline = function _initTimeline() {
	    var _this3 = this;

	    this.timeline = new mojs.Timeline({});

	    var add = this._o.add;
	    // check whether the `add` option meets the next criterias:
	    var isUndefined = typeof add === 'undefined';

	    if (!isUndefined) {
	      add = add.timeline || add;
	    }

	    var isTween = add instanceof mojs.Tween;
	    var isTimeline = add instanceof mojs.Timeline;

	    if (isUndefined || !(isTween || isTimeline)) {
	      throw new Error('MojsPlayer expects Tween/Timeline/Module as `add` option in constructor call. [ new MojsPlayer({ add: new mojs.Tween }); ]');
	      return;
	    }

	    this.timeline.add(this._o.add);

	    this._sysTween = new mojs.Tween({
	      easing: 'linear.none',
	      duration: this.timeline._props.repeatTime,
	      onProgress: this._onSysProgress.bind(this),
	      onComplete: this._onSysTweenComplete.bind(this),
	      onPlaybackStop: function onPlaybackStop() {
	        _this3._setPlayState('off');
	      },
	      onPlaybackPause: function onPlaybackPause() {
	        _this3._setPlayState('off');
	      },
	      onPlaybackStart: function onPlaybackStart() {
	        _this3._setPlayState('on');
	      }
	    });
	  };
	  /*
	    Method that is invoked on system tween progress.
	    @private
	    @param {Number} Progress value [0...1].
	  */


	  MojsPlayer.prototype._onSysProgress = function _onSysProgress(p) {
	    this.playerSlider.setTrackProgress(p);

	    var rightBound = this._props.isBounds ? this._props.rightBound : 1,
	        leftBound = this._props.isBounds ? this._props.leftBound : -1;

	    // since js is really bed in numbers precision,
	    // if we set a progress in the `_play` method it returns slighly
	    // different when piped thru tween, so add `0.01` gap to soften that
	    if (p < leftBound - 0.01 && p !== 0) {
	      this._reset();
	      requestAnimationFrame(this._play.bind(this));
	    }

	    if (p >= rightBound) {

	      this._reset(rightBound === 1);

	      // if ( rightBound === 1 ) { this._sysTween.stop( ); }
	      // else { this._reset() }

	      if (this._props.isRepeat) {
	        requestAnimationFrame(this._play.bind(this));
	      } else {
	        this._props.isPlaying = false;
	      }
	    }
	  };
	  /*
	    Method to play system tween from progress.
	    @private
	  */


	  MojsPlayer.prototype._play = function _play() {
	    var p = this._props,
	        leftBound = p.isBounds ? p.leftBound : p.progress,
	        progress = p.progress >= this._getBound('right') ? leftBound : p.progress;

	    if (progress === 1) {
	      progress = p.isBounds ? p.leftBound : 0;
	    };
	    if (progress !== 0) {
	      this._sysTween.setProgress(progress);
	    };

	    this._sysTween.play();
	  };
	  /*
	    Method to reset sysTween and timeline.
	    @param {Boolean} If should not set progress to 0.
	    @private
	  */


	  MojsPlayer.prototype._reset = function _reset(isPause) {
	    this._sysTween.reset();

	    if (!isPause) {
	      // this.timeline.pause();
	      var p = this._props,
	          progress = p.progress;

	      var start = progress,
	          leftBound = p.isBounds ? p.leftBound : 0;

	      while (start - p.precision >= leftBound) {
	        start -= p.precision;
	        this.timeline.setProgress(start);
	      }
	    }

	    this.timeline.reset();
	  };
	  /*
	    Method to set play button state.
	    @private
	    @param {String} Method name to call it on playButton.
	  */


	  MojsPlayer.prototype._setPlayState = function _setPlayState(method) {
	    var _this4 = this;

	    clearTimeout(this._playTimeout);
	    this._playTimeout = setTimeout(function () {
	      _this4.playButton && _this4.playButton[method](false);
	    }, 20);
	  };
	  /*
	    Method that is invoked on system tween completion.
	    @private
	    @param {Boolean} If forward direction.
	  */


	  MojsPlayer.prototype._onSysTweenComplete = function _onSysTweenComplete(isForward) {}
	  // console.log(' complete ', this._props.isPlaying, isForward, this._props.isRepeat);
	  // if ( this._props.isPlaying && isForward ) {
	  //   if ( this._props.isRepeat ) {
	  //     console.log('reset 2')
	  //     // this._sysTween.reset();
	  //     // this._play();
	  //   }
	  // }

	  /*
	    Method that is invoked play button state change.
	    @private
	    @param {Boolean} Repeat button state.
	  */
	  ;

	  MojsPlayer.prototype._onPlayStateChange = function _onPlayStateChange(isPlay) {
	    this._props.isPlaying = isPlay;
	    if (isPlay) {
	      this._play();
	    } else {
	      this._sysTween.pause();
	    }
	  };
	  /*
	    Callback for hide button change state.
	    @private
	    @param {Boolean}
	  */


	  MojsPlayer.prototype._onHideStateChange = function _onHideStateChange(isHidden) {
	    this._props.isHidden = isHidden;
	    var method = isHidden ? 'add' : 'remove';
	    this.el.classList[method](CLASSES['is-hidden']);
	    // enable CSS transition on subsequent calls
	    if (this._hideCount++ === 1) {
	      this.el.classList.add(CLASSES['is-transition']);
	    }
	  };
	  /*
	    Method that is invoked on stop button tap.
	    @private
	  */


	  MojsPlayer.prototype._onStop = function _onStop() {
	    var p = this._props;
	    p.isPlaying = false;

	    var leftBound = p.isBounds ? p.leftBound : 0;
	    // set sysTween progress twice because it could be _reset already
	    this._sysTween.setProgress(leftBound + 0.01);
	    this._sysTween.setProgress(leftBound);

	    this._reset();
	  };
	  /*
	    Method that is invoked on repeat switch state change.
	    @private
	    @param {Boolean} Repeat button state.
	  */


	  MojsPlayer.prototype._onRepeatStateChange = function _onRepeatStateChange(isOn) {
	    this._props.isRepeat = isOn;
	  };
	  /*
	    Method that is invoked on bounds switch state change.
	    @private
	    @param {Boolean} Bounds state.
	  */


	  MojsPlayer.prototype._boundsStateChange = function _boundsStateChange(isOn) {
	    this.playerSlider._props.isBounds = isOn;
	    this.playerSlider[(isOn ? 'enable' : 'disable') + 'Bounds']();
	    this._props.isBounds = isOn;
	  };
	  /*
	    Method that is invoked on speed value change.
	    @private
	    @param {Number} Speed value.
	    @param {Number} Slider progress.
	  */


	  MojsPlayer.prototype._onSpeedChange = function _onSpeedChange(speed, progress) {
	    this._props['raw-speed'] = progress;
	    this._props.speed = speed;
	    this._sysTween.setSpeed(speed);
	  };
	  /*
	    Method that is invoked on speed state change.
	    @private
	    @param {Boolean} Speed control state.
	  */


	  MojsPlayer.prototype._onIsSpeed = function _onIsSpeed(isOn) {
	    this._props.isSpeed = isOn;
	  };
	  /*
	    Method that is invoked on timeline's left bound progress.
	    @private
	    @param {Number} Progress value [0...1].
	  */


	  MojsPlayer.prototype._onLeftProgress = function _onLeftProgress(progress) {
	    this._props.leftBound = progress;
	  };
	  /*
	    Method that is invoked on timeline progress.
	    @private
	    @param {Number} Progress value [0...1].
	  */


	  MojsPlayer.prototype._onProgress = function _onProgress(progress) {
	    this._props.progress = progress;
	    // if timeline was reset - refresh it's state
	    // by incremental updates until progress (0 always)
	    if (!this.timeline._prevTime && progress > 0) {
	      var start = 0;
	      do {
	        this.timeline.setProgress(start);
	        start += this._props.precision;
	      } while (start + this._props.precision < progress);
	    }
	    this.timeline.setProgress(progress);
	  };
	  /*
	    Method that is invoked on timeline's right bound progress.
	    @private
	    @param {Number} Progress value [0...1].
	  */


	  MojsPlayer.prototype._onRightProgress = function _onRightProgress(progress) {
	    this._props.rightBound = progress;
	  };
	  /*
	    Method that is invoked on window unload.
	    @private
	    @param {Object} Original even object.
	  */


	  MojsPlayer.prototype._onUnload = function _onUnload(e) {
	    if (!this._props.isSaveState) {
	      return localStorage.removeItem(this._localStorage);
	    }

	    var props = (0, _extends3.default)({}, this._props);
	    delete props.parent;
	    delete props.className;
	    delete props.isSaveState;
	    delete props.precision;

	    localStorage.setItem(this._localStorage, (0, _stringify2.default)(props));
	  };
	  /*
	    Method that returns the second argument if the first one isn't set.
	    @private
	    @param {Any} Property to set.
	    @param {Any} Property to return as fallback.
	    @returns {Any} If set - the first property, if not - the second.
	  */


	  MojsPlayer.prototype._fallbackTo = function _fallbackTo(prop, fallback) {
	    return prop != null ? prop : fallback;
	  };
	  /*
	    Method to get bound regarding isBound option.
	    @private
	    @param {String} Bound name.
	  */


	  MojsPlayer.prototype._getBound = function _getBound(boundName) {
	    var p = this._props,
	        fallback = boundName === 'left' ? 0 : 1;

	    return p.isBounds ? p[boundName + 'Bound'] : fallback;
	  };
	  /*
	    Method to defer a method.
	    @private
	    @param {Function} Function that should be defered.
	  */


	  MojsPlayer.prototype._defer = function _defer(fn) {
	    setTimeout(fn.bind(this), 1);
	  };
	  /*
	    Method to generate hash code.
	    @private
	    @return {String} Hash code.
	  */


	  MojsPlayer.prototype._hashCode = function _hashCode(str) {
	    var hash = 0,
	        i,
	        chr,
	        len;
	    if (str.length === 0) return hash;
	    for (i = 0, len = str.length; i < len; i++) {
	      chr = str.charCodeAt(i);
	      hash = (hash << 5) - hash + chr;
	      hash |= 0; // Convert to 32bit integer
	    }
	    return Math.abs(hash);
	  };

	  return MojsPlayer;
	}(_module2.default);

	if (true) {
	  !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    return MojsPlayer;
	  }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	if (( false ? 'undefined' : (0, _typeof3.default)(module)) === "object" && (0, _typeof3.default)(module.exports) === "object") {
	  module.exports = MojsPlayer;
	}

	var _global = typeof global !== 'undefined' ? global : window;
	_global.MojsPlayer = MojsPlayer;

	exports.default = MojsPlayer;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module), (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(4);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(55);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(5), __esModule: true };

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(6);
	__webpack_require__(50);
	module.exports = __webpack_require__(54).f('iterator');

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(7)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(10)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(8)
	  , defined   = __webpack_require__(9);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(11)
	  , $export        = __webpack_require__(12)
	  , redefine       = __webpack_require__(27)
	  , hide           = __webpack_require__(17)
	  , has            = __webpack_require__(28)
	  , Iterators      = __webpack_require__(29)
	  , $iterCreate    = __webpack_require__(30)
	  , setToStringTag = __webpack_require__(46)
	  , getPrototypeOf = __webpack_require__(48)
	  , ITERATOR       = __webpack_require__(47)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(13)
	  , core      = __webpack_require__(14)
	  , ctx       = __webpack_require__(15)
	  , hide      = __webpack_require__(17)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 13 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 14 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(16);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(18)
	  , createDesc = __webpack_require__(26);
	module.exports = __webpack_require__(22) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(19)
	  , IE8_DOM_DEFINE = __webpack_require__(21)
	  , toPrimitive    = __webpack_require__(25)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(22) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(20);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(22) && !__webpack_require__(23)(function(){
	  return Object.defineProperty(__webpack_require__(24)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(23)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(20)
	  , document = __webpack_require__(13).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(20);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(17);

/***/ },
/* 28 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(31)
	  , descriptor     = __webpack_require__(26)
	  , setToStringTag = __webpack_require__(46)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(17)(IteratorPrototype, __webpack_require__(47)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(19)
	  , dPs         = __webpack_require__(32)
	  , enumBugKeys = __webpack_require__(44)
	  , IE_PROTO    = __webpack_require__(41)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(24)('iframe')
	    , i      = enumBugKeys.length
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(45).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write('<script>document.F=Object</script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(18)
	  , anObject = __webpack_require__(19)
	  , getKeys  = __webpack_require__(33);

	module.exports = __webpack_require__(22) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(34)
	  , enumBugKeys = __webpack_require__(44);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(28)
	  , toIObject    = __webpack_require__(35)
	  , arrayIndexOf = __webpack_require__(38)(false)
	  , IE_PROTO     = __webpack_require__(41)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(36)
	  , defined = __webpack_require__(9);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(37);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(35)
	  , toLength  = __webpack_require__(39)
	  , toIndex   = __webpack_require__(40);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(8)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(8)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(42)('keys')
	  , uid    = __webpack_require__(43);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(13)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 43 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(13).document && document.documentElement;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(18).f
	  , has = __webpack_require__(28)
	  , TAG = __webpack_require__(47)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(42)('wks')
	  , uid        = __webpack_require__(43)
	  , Symbol     = __webpack_require__(13).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(28)
	  , toObject    = __webpack_require__(49)
	  , IE_PROTO    = __webpack_require__(41)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(9);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(51);
	var global        = __webpack_require__(13)
	  , hide          = __webpack_require__(17)
	  , Iterators     = __webpack_require__(29)
	  , TO_STRING_TAG = __webpack_require__(47)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(52)
	  , step             = __webpack_require__(53)
	  , Iterators        = __webpack_require__(29)
	  , toIObject        = __webpack_require__(35);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(10)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 52 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 53 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(47);

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(56), __esModule: true };

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(57);
	__webpack_require__(68);
	__webpack_require__(69);
	__webpack_require__(70);
	module.exports = __webpack_require__(14).Symbol;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(13)
	  , has            = __webpack_require__(28)
	  , DESCRIPTORS    = __webpack_require__(22)
	  , $export        = __webpack_require__(12)
	  , redefine       = __webpack_require__(27)
	  , META           = __webpack_require__(58).KEY
	  , $fails         = __webpack_require__(23)
	  , shared         = __webpack_require__(42)
	  , setToStringTag = __webpack_require__(46)
	  , uid            = __webpack_require__(43)
	  , wks            = __webpack_require__(47)
	  , wksExt         = __webpack_require__(54)
	  , wksDefine      = __webpack_require__(59)
	  , keyOf          = __webpack_require__(60)
	  , enumKeys       = __webpack_require__(61)
	  , isArray        = __webpack_require__(64)
	  , anObject       = __webpack_require__(19)
	  , toIObject      = __webpack_require__(35)
	  , toPrimitive    = __webpack_require__(25)
	  , createDesc     = __webpack_require__(26)
	  , _create        = __webpack_require__(31)
	  , gOPNExt        = __webpack_require__(65)
	  , $GOPD          = __webpack_require__(67)
	  , $DP            = __webpack_require__(18)
	  , $keys          = __webpack_require__(33)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(66).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(63).f  = $propertyIsEnumerable;
	  __webpack_require__(62).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(11)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(17)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(43)('meta')
	  , isObject = __webpack_require__(20)
	  , has      = __webpack_require__(28)
	  , setDesc  = __webpack_require__(18).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(23)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(13)
	  , core           = __webpack_require__(14)
	  , LIBRARY        = __webpack_require__(11)
	  , wksExt         = __webpack_require__(54)
	  , defineProperty = __webpack_require__(18).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(33)
	  , toIObject = __webpack_require__(35);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(33)
	  , gOPS    = __webpack_require__(62)
	  , pIE     = __webpack_require__(63);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 62 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 63 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(37);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(35)
	  , gOPN      = __webpack_require__(66).f
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(34)
	  , hiddenKeys = __webpack_require__(44).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(63)
	  , createDesc     = __webpack_require__(26)
	  , toIObject      = __webpack_require__(35)
	  , toPrimitive    = __webpack_require__(25)
	  , has            = __webpack_require__(28)
	  , IE8_DOM_DEFINE = __webpack_require__(21)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(22) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 68 */
/***/ function(module, exports) {

	

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(59)('asyncIterator');

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(59)('observable');

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(72), __esModule: true };

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	var core  = __webpack_require__(14)
	  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _assign = __webpack_require__(74);

	var _assign2 = _interopRequireDefault(_assign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _assign2.default || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(75), __esModule: true };

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(76);
	module.exports = __webpack_require__(14).Object.assign;

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(12);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(77)});

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(33)
	  , gOPS     = __webpack_require__(62)
	  , pIE      = __webpack_require__(63)
	  , toObject = __webpack_require__(49)
	  , IObject  = __webpack_require__(36)
	  , $assign  = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(23)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

/***/ },
/* 78 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(3);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(81);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(85);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(3);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }

	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(82), __esModule: true };

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(83);
	module.exports = __webpack_require__(14).Object.setPrototypeOf;

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(12);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(84).set});

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(20)
	  , anObject = __webpack_require__(19);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(15)(Function.call, __webpack_require__(67).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(86), __esModule: true };

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(87);
	var $Object = __webpack_require__(14).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(12)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(31)});

/***/ },
/* 88 */
/***/ function(module, exports) {

	/*
	 * classList.js: Cross-browser full element.classList implementation.
	 * 2014-07-23
	 *
	 * By Eli Grey, http://eligrey.com
	 * Public Domain.
	 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	 */

	/*global self, document, DOMException */

	/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

	/* Copied from MDN:
	 * https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
	 */

	if ("document" in window.self) {

	  // Full polyfill for browsers with no classList support
	  // Including IE < Edge missing SVGElement.classList
	  if (!("classList" in document.createElement("_"))
	    || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))) {

	  (function (view) {

	    "use strict";

	    if (!('Element' in view)) return;

	    var
	        classListProp = "classList"
	      , protoProp = "prototype"
	      , elemCtrProto = view.Element[protoProp]
	      , objCtr = Object
	      , strTrim = String[protoProp].trim || function () {
	        return this.replace(/^\s+|\s+$/g, "");
	      }
	      , arrIndexOf = Array[protoProp].indexOf || function (item) {
	        var
	            i = 0
	          , len = this.length
	        ;
	        for (; i < len; i++) {
	          if (i in this && this[i] === item) {
	            return i;
	          }
	        }
	        return -1;
	      }
	      // Vendors: please allow content code to instantiate DOMExceptions
	      , DOMEx = function (type, message) {
	        this.name = type;
	        this.code = DOMException[type];
	        this.message = message;
	      }
	      , checkTokenAndGetIndex = function (classList, token) {
	        if (token === "") {
	          throw new DOMEx(
	              "SYNTAX_ERR"
	            , "An invalid or illegal string was specified"
	          );
	        }
	        if (/\s/.test(token)) {
	          throw new DOMEx(
	              "INVALID_CHARACTER_ERR"
	            , "String contains an invalid character"
	          );
	        }
	        return arrIndexOf.call(classList, token);
	      }
	      , ClassList = function (elem) {
	        var
	            trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
	          , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
	          , i = 0
	          , len = classes.length
	        ;
	        for (; i < len; i++) {
	          this.push(classes[i]);
	        }
	        this._updateClassName = function () {
	          elem.setAttribute("class", this.toString());
	        };
	      }
	      , classListProto = ClassList[protoProp] = []
	      , classListGetter = function () {
	        return new ClassList(this);
	      }
	    ;
	    // Most DOMException implementations don't allow calling DOMException's toString()
	    // on non-DOMExceptions. Error's toString() is sufficient here.
	    DOMEx[protoProp] = Error[protoProp];
	    classListProto.item = function (i) {
	      return this[i] || null;
	    };
	    classListProto.contains = function (token) {
	      token += "";
	      return checkTokenAndGetIndex(this, token) !== -1;
	    };
	    classListProto.add = function () {
	      var
	          tokens = arguments
	        , i = 0
	        , l = tokens.length
	        , token
	        , updated = false
	      ;
	      do {
	        token = tokens[i] + "";
	        if (checkTokenAndGetIndex(this, token) === -1) {
	          this.push(token);
	          updated = true;
	        }
	      }
	      while (++i < l);

	      if (updated) {
	        this._updateClassName();
	      }
	    };
	    classListProto.remove = function () {
	      var
	          tokens = arguments
	        , i = 0
	        , l = tokens.length
	        , token
	        , updated = false
	        , index
	      ;
	      do {
	        token = tokens[i] + "";
	        index = checkTokenAndGetIndex(this, token);
	        while (index !== -1) {
	          this.splice(index, 1);
	          updated = true;
	          index = checkTokenAndGetIndex(this, token);
	        }
	      }
	      while (++i < l);

	      if (updated) {
	        this._updateClassName();
	      }
	    };
	    classListProto.toggle = function (token, force) {
	      token += "";

	      var
	          result = this.contains(token)
	        , method = result ?
	          force !== true && "remove"
	        :
	          force !== false && "add"
	      ;

	      if (method) {
	        this[method](token);
	      }

	      if (force === true || force === false) {
	        return force;
	      } else {
	        return !result;
	      }
	    };
	    classListProto.toString = function () {
	      return this.join(" ");
	    };

	    if (objCtr.defineProperty) {
	      var classListPropDesc = {
	          get: classListGetter
	        , enumerable: true
	        , configurable: true
	      };
	      try {
	        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	      } catch (ex) { // IE 8 doesn't support enumerable:true
	        if (ex.number === -0x7FF5EC54) {
	          classListPropDesc.enumerable = false;
	          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	        }
	      }
	    } else if (objCtr[protoProp].__defineGetter__) {
	      elemCtrProto.__defineGetter__(classListProp, classListGetter);
	    }

	    }(window.self));

	    } else {
	    // There is full or partial native classList support, so just check if we need
	    // to normalize the add/remove and toggle APIs.

	    (function () {
	      "use strict";

	      var testElement = document.createElement("_");

	      testElement.classList.add("c1", "c2");

	      // Polyfill for IE 10/11 and Firefox <26, where classList.add and
	      // classList.remove exist but support only one argument at a time.
	      if (!testElement.classList.contains("c2")) {
	        var createMethod = function(method) {
	          var original = DOMTokenList.prototype[method];

	          DOMTokenList.prototype[method] = function(token) {
	            var i, len = arguments.length;

	            for (i = 0; i < len; i++) {
	              token = arguments[i];
	              original.call(this, token);
	            }
	          };
	        };
	        createMethod('add');
	        createMethod('remove');
	      }

	      testElement.classList.toggle("c3", false);

	      // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
	      // support the second argument.
	      if (testElement.classList.contains("c3")) {
	        var _toggle = DOMTokenList.prototype.toggle;

	        DOMTokenList.prototype.toggle = function(token, force) {
	          if (1 in arguments && !this.contains(token) === !force) {
	            return force;
	          } else {
	            return _toggle.call(this, token);
	          }
	        };

	      }

	      testElement = null;
	    }());
	  }
	}


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _classCallCheck2 = __webpack_require__(78);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(79);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _module = __webpack_require__(90);

	var _module2 = _interopRequireDefault(_module);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Icons = function (_Module) {
	  (0, _inherits3.default)(Icons, _Module);

	  function Icons() {
	    (0, _classCallCheck3.default)(this, Icons);
	    return (0, _possibleConstructorReturn3.default)(this, _Module.apply(this, arguments));
	  }

	  /*
	    Initial render method.
	    @private
	    @overrides @ Module
	  */

	  Icons.prototype._render = function _render() {
	    this.el = this._createElement('div');
	    this.el.innerHTML = this.getIcons();
	    this.el.setAttribute('id', this._props.prefix + 'icons');
	    this._prependChild(document.body, this.el);
	  };
	  /*
	    Method to get icons shapes.
	    @private
	  */


	  Icons.prototype.getIcons = function getIcons() {
	    var prefix = this._props.prefix;
	    return '<svg height="0" version="1.1" xmlns="http://www.w3.org/2000/svg" style="position:absolute; margin-left: -100%; width:0; height:0;" xmlns:xlink="http://www.w3.org/1999/xlink">\n              <path id="' + prefix + 'play-icon-shape" d="M0.000549111126,31.9982154 C-0.000686388908,21.3321436 0.000549111126,10.6660718 0.000549111126,1.77635684e-15 C10.6678564,5.33118265 21.3339282,10.6648363 32,15.9984899 C21.3339282,21.3321436 10.6678564,26.6657972 0.000549111126,31.9982154 L0.000549111126,31.9982154 Z"></path>\n              <g id="' + prefix + 'pause-icon-shape">\n                <path d="M-8.8817842e-16,0 C3.55529197,-0.000248559134 7.11058393,-0.000248559134 10.6666667,0 C10.6669303,10.6669152 10.6669303,21.3330848 10.6666667,32 C7.11058393,32.0002486 3.55529197,32.0002486 -8.8817842e-16,32 L-8.8817842e-16,0 L-8.8817842e-16,0 Z"></path>\n                <path d="M21.3333333,0 C24.8894161,-0.000248559134 28.444708,-0.000248559134 32,0 L32,32 C28.444708,32.0002486 24.8894161,32.0002486 21.3333333,32 C21.3330697,21.3330848 21.3330697,10.6669152 21.3333333,0 L21.3333333,0 Z"></path>\n              </g>\n              <rect id="' + prefix + 'stop-icon-shape" x="0" y="0" width="32" height="32"></rect>\n              <path id="' + prefix + 'repeat-icon-shape" d="M9.871,1.48 C12.322,0.209 15.176,-0.247 17.906,0.137 C20.914,0.556 23.762,2.041 25.823,4.274 C27.359,5.896 28.452,7.916 29.033,10.069 C29.472,9.674 29.825,9.123 30.422,8.955 C31.003,8.779 31.696,9.094 31.909,9.67 C32.106,10.155 31.972,10.736 31.6,11.1 C30.713,12.013 29.808,12.908 28.91,13.811 C28.709,14.011 28.506,14.231 28.23,14.323 C27.772,14.498 27.224,14.379 26.881,14.03 C25.918,13.021 24.913,12.052 23.938,11.055 C23.542,10.656 23.511,9.982 23.82,9.523 C24.104,9.072 24.681,8.844 25.196,8.988 C25.679,9.098 25.966,9.536 26.31,9.852 C25.345,7.149 23.302,4.829 20.694,3.611 C18.713,2.653 16.434,2.344 14.264,2.689 C10.576,3.238 7.291,5.853 5.897,9.306 C5.697,9.872 5.1,10.301 4.488,10.184 C3.863,10.113 3.366,9.501 3.399,8.878 C3.413,8.644 3.512,8.429 3.601,8.216 C4.804,5.321 7.089,2.911 9.871,1.48 Z M3.374,12.873 C3.855,12.401 4.7,12.476 5.151,12.952 C6.038,13.863 6.935,14.765 7.839,15.659 C8.049,15.864 8.261,16.088 8.343,16.379 C8.605,17.177 7.852,18.12 7.004,17.996 C6.43,17.963 6.069,17.47 5.692,17.101 C6.657,19.849 8.766,22.168 11.406,23.395 C14.249,24.712 17.666,24.737 20.514,23.423 C22.848,22.38 24.775,20.47 25.864,18.16 C26.072,17.753 26.185,17.255 26.588,16.987 C27.062,16.635 27.776,16.687 28.195,17.101 C28.527,17.419 28.687,17.926 28.541,18.369 C27.351,21.477 24.943,24.088 21.961,25.559 C18.251,27.421 13.67,27.405 9.973,25.52 C6.545,23.823 3.931,20.588 2.96,16.892 C2.624,17.217 2.319,17.58 1.935,17.85 C1.405,18.183 0.615,18.077 0.239,17.56 C-0.143,17.042 -0.048,16.254 0.431,15.828 C1.415,14.846 2.374,13.838 3.374,12.873 Z"></path>\n              <path id="' + prefix + 'bounds-icon-shape" d="M16,6 L16,-1.13686838e-13 L18,-1.13686838e-13 L18,6 L21.9941413,6 C23.1019465,6 24,6.89821238 24,7.99079514 L24,24.0092049 C24,25.1086907 23.1029399,26 21.9941413,26 L18,26 L18,32 L16,32 L16,26 L12.0058587,26 C10.8980535,26 10,25.1017876 10,24.0092049 L10,7.99079514 C10,6.89130934 10.8970601,6 12.0058587,6 L16,6 Z"></path>\n              <path id="' + prefix + 'mojs-icon-shape" d="M18.4678907,2.67700048 C19.488586,3.25758625 20.2789227,4.18421651 20.87823,5.1973579 C24.0807788,10.501451 27.2777091,15.8113116 30.480258,21.1154047 C31.1320047,22.1612281 31.7706417,23.2647256 31.9354512,24.5162532 C32.188284,26.0619186 31.6919826,27.7363895 30.5589171,28.80336 C29.4501984,29.8857103 27.8807622,30.3182659 26.3806209,30.3048086 C19.4511293,30.3086535 12.5235106,30.3086535 5.59401901,30.3048086 C3.71556494,30.343258 1.69852104,29.5723478 0.683444165,27.8709623 C-0.406546132,26.1099803 -0.0975282643,23.7914822 0.940022637,22.0843293 C4.34296485,16.4130445 7.76650826,10.7532945 11.1825603,5.08969961 C11.9747698,3.74781595 13.1846215,2.60202418 14.6847628,2.18292584 C15.9451812,1.81573418 17.3348251,2.01182606 18.4678907,2.67700048 Z M15.3334668,9.51526849 C15.6146238,9.03779476 16.0791597,9.02250655 16.3785679,9.4929547 L25.2763555,23.4736913 C25.5723919,23.9388414 25.3568433,24.3159201 24.8074398,24.3159202 L7.62314647,24.3159205 C7.06813505,24.3159206 6.84622798,23.9286889 7.12728913,23.4513779 L15.3334668,9.51526849 Z" fill-rule="evenodd"></path>\n              <path id="' + prefix + 'hide-icon-shape" d="M18.0297509,24.5024819 C18.1157323,24.4325886 18.1989631,24.3576024 18.2790422,24.2775233 L31.0556518,11.5009137 C32.3147827,10.2417828 32.3147827,8.20347913 31.0556518,6.9443482 C29.7965209,5.68521727 27.7582172,5.68521727 26.4990863,6.9443482 L15.9992406,17.4441939 L5.50091369,6.94586705 C4.24330161,5.68825498 2.20347913,5.68673612 0.944348198,6.94586705 C-0.314782733,8.20499798 -0.314782733,10.2433016 0.944348198,11.5024325 L13.7209578,24.2790422 C14.9005165,25.4586008 16.7638781,25.5331444 18.0298642,24.5026731 L18.0297509,24.5024819 Z"></path>\n            </svg>';
	  };

	  return Icons;
	}(_module2.default);

	exports.default = Icons;

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(3);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _classCallCheck2 = __webpack_require__(78);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	  Base class for all modules.
	  Extends _defaults to _props
	*/

	var Module = function () {
	  /*
	    constructor method calls scaffolding methods.
	  */

	  function Module() {
	    var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    (0, _classCallCheck3.default)(this, Module);

	    this._o = o;
	    this._index = this._o.index || 0;
	    this._declareDefaults();
	    this._extendDefaults();
	    this._vars();
	    this._render();
	  }
	  /*
	    Method to declare defaults.
	    @private
	  */


	  Module.prototype._declareDefaults = function _declareDefaults() {
	    this._defaults = {
	      className: '',
	      parent: document.body,
	      isPrepend: false,
	      isRipple: false,
	      prefix: ''
	    };
	  };
	  /*
	    Method to add pointer down even listener to el.
	    @param {Object}   HTMLElement to add event listener on.
	    @param {Function} Event listener callback.
	  */


	  Module.prototype._addPointerDownEvent = function _addPointerDownEvent(el, fn) {
	    if (window.navigator.msPointerEnabled) {
	      el.addEventListener('MSPointerDown', fn);
	    } else if (window.ontouchstart !== undefined) {
	      el.addEventListener('touchstart', fn);
	      el.addEventListener('mousedown', fn);
	    } else {
	      el.addEventListener('mousedown', fn);
	    }
	  };
	  /*
	    Method to add pointer up even listener to el.
	    @param {Object}   HTMLElement to add event listener on.
	    @param {Function} Event listener callback.
	  */


	  Module.prototype._addPointerUpEvent = function _addPointerUpEvent(el, fn) {
	    if (window.navigator.msPointerEnabled) {
	      el.addEventListener('MSPointerUp', fn);
	    } else if (window.ontouchstart !== undefined) {
	      el.addEventListener('touchend', fn);
	      el.addEventListener('mouseup', fn);
	    } else {
	      el.addEventListener('mouseup', fn);
	    }
	  };
	  /*
	    Method to check if variable holds link to a function.
	    @param {Function?} A variable to check.
	    @returns {Boolean} If passed variable is a function.
	  */


	  Module.prototype._isFunction = function _isFunction(fn) {
	    return typeof fn === 'function';
	  };
	  /*
	    Method to a function or silently fail.
	    @param {Function?} A variable to check.
	    @param {Array like} Arguments.
	  */


	  Module.prototype._callIfFunction = function _callIfFunction(fn) {
	    Array.prototype.shift.call(arguments);
	    this._isFunction(fn) && fn.apply(this, arguments);
	  };
	  /*
	    Method to declare module's variables.
	    @private
	  */


	  Module.prototype._vars = function _vars() {};
	  /*
	    Method to render on initialization.
	    @private
	  */


	  Module.prototype._render = function _render() {
	    this._addMainElement();
	  };
	  /*
	    Method to add `this.el` on the module.
	    @private
	    @param {String} Tag name of the element.
	  */


	  Module.prototype._addMainElement = function _addMainElement() {
	    var tagName = arguments.length <= 0 || arguments[0] === undefined ? 'div' : arguments[0];

	    var p = this._props;

	    this.el = this._createElement(tagName);
	    this._addMainClasses();

	    var method = p.isPrepend ? 'prepend' : 'append';
	    this['_' + method + 'Child'](p.parent, this.el);
	  };
	  /*
	    Method to classes on `this.el`.
	    @private
	  */


	  Module.prototype._addMainClasses = function _addMainClasses() {
	    var p = this._props;
	    if (p.className instanceof Array) {
	      for (var i = 0; i < p.className.length; i++) {
	        this._addClass(this.el, p.className[i]);
	      }
	    } else {
	      this._addClass(this.el, p.className);
	    }
	  };
	  /*
	    Method to add a class on el.
	    @private
	    @param {Object} HTML element to add the class on.
	    @param {String} Class name to add.
	  */


	  Module.prototype._addClass = function _addClass(el, className) {
	    className && el.classList.add(className);
	  };
	  /*
	    Method to set property on the module.
	    @private
	    @param {String, Object} Name of the property to set
	                            or object with properties to set.
	    @param {Any} Value for the property to set. Could be
	                  undefined if the first param is object.
	  */


	  Module.prototype._setProp = function _setProp(attr, value) {
	    if ((typeof attr === 'undefined' ? 'undefined' : (0, _typeof3.default)(attr)) === 'object') {
	      for (var key in attr) {
	        this._assignProp(key, attr[key]);
	      }
	    } else {
	      this._assignProp(attr, value);
	    }
	  };
	  /*
	    Method to assign single property's value.
	    @private
	    @param {String} Property name.
	    @param {Any}    Property value.
	  */


	  Module.prototype._assignProp = function _assignProp(key, value) {
	    this._props[key] = value;
	  };
	  /*
	    Method to copy `_o` options to `_props` object
	    with fallback to `_defaults`.
	    @private
	  */


	  Module.prototype._extendDefaults = function _extendDefaults() {
	    this._props = {};
	    // this._deltas = {};
	    for (var key in this._defaults) {
	      var value = this._o[key];
	      this.isIt && console.log(key);
	      // copy the properties to the _o object
	      this._assignProp(key, value != null ? value : this._defaults[key]);
	    }
	  };
	  /*
	    Method to create HTMLElement from tag name.
	    @private
	    @param {String} Name of the tag to create `HTML` element.
	    @returns {Object} HtmlElement.
	  */


	  Module.prototype._createElement = function _createElement(tagName) {
	    return document.createElement(tagName);
	  };
	  /*
	    Method to create HTMLElement and append it to the `el` with a className.
	    @private
	    @param {String} The tagname for the HTMLElement.
	    @param {String} Optional class name to add to the new child.
	    @returns {Object} The newely created HTMLElement.
	  */


	  Module.prototype._createChild = function _createChild(tagName, className) {
	    var child = this._createElement('div');
	    className && child.classList.add(className);
	    this.el.appendChild(child);
	    return child;
	  };
	  /*
	    Method to prepend child to the el.
	    @private
	    @param {Object} Parent HTMLElement.
	    @param {Object} Child HTMLElement.
	  */


	  Module.prototype._appendChild = function _appendChild(el, childEl) {
	    el.appendChild(childEl);
	  };
	  /*
	    Method to prepend child to the el.
	    @private
	    @param {Object} Parent HTMLElement.
	    @param {Object} Child HTMLElement.
	  */


	  Module.prototype._prependChild = function _prependChild(el, childEl) {
	    el.insertBefore(childEl, el.firstChild);
	  };

	  return Module;
	}();

	exports.default = Module;

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _classCallCheck2 = __webpack_require__(78);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(79);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _slider = __webpack_require__(92);

	var _slider2 = _interopRequireDefault(_slider);

	var _module = __webpack_require__(90);

	var _module2 = _interopRequireDefault(_module);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(108);
	var CLASSES = __webpack_require__(110);
	var SLIDER_CLASSES = __webpack_require__(107);

	var PlayerSlider = function (_Module) {
	  (0, _inherits3.default)(PlayerSlider, _Module);

	  function PlayerSlider() {
	    (0, _classCallCheck3.default)(this, PlayerSlider);
	    return (0, _possibleConstructorReturn3.default)(this, _Module.apply(this, arguments));
	  }

	  /*
	    Method to declare _defaults.
	    @private
	    @overrides @ Module
	  */

	  PlayerSlider.prototype._declareDefaults = function _declareDefaults() {
	    this._defaults = {
	      className: CLASSES['player-slider'],
	      parent: document.body,
	      progress: 0,
	      leftProgress: 0,
	      rightProgress: 1,
	      isBounds: false,
	      onLeftProgress: null,
	      onProgress: null,
	      onRightProgress: null,
	      onSeekStart: null,
	      onSeekEnd: null
	    };
	  };
	  /*
	    Method to disable bounds.
	    @public
	    @returns this.
	  */


	  PlayerSlider.prototype.disableBounds = function disableBounds() {
	    this.track.setBounds(0, 1);
	    this.rightBound.hide();
	    this.leftBound.hide();
	    return this;
	  };
	  /*
	    Method to enable bounds.
	    @public
	    @returns this.
	  */


	  PlayerSlider.prototype.enableBounds = function enableBounds() {
	    var p = this._props;
	    this.track.setBounds(p.leftProgress, p.rightProgress);
	    this.rightBound.show();
	    this.leftBound.show();
	    return this;
	  };
	  /*
	    Method to set progress of the track.
	    @public
	    @param {Number} Progress to set [0...1].
	    @returns this.
	  */


	  PlayerSlider.prototype.setTrackProgress = function setTrackProgress(p) {
	    this.track.setProgress(p);
	    return this;
	  };
	  /*
	    Method to decrease progress value.
	    @public
	    @param {Number} Value that the slider should be decreased by.
	    @returns this.
	  */


	  PlayerSlider.prototype.decreaseProgress = function decreaseProgress() {
	    var amount = arguments.length <= 0 || arguments[0] === undefined ? 0.01 : arguments[0];

	    var progress = this.track._progress;
	    progress -= amount;
	    progress = progress < 0 ? 0 : progress;
	    this.setTrackProgress(progress);
	    return this;
	  };
	  /*
	    Method to inclease progress value.
	    @public
	    @param {Number} Value that the slider should be increased by.
	    @returns this.
	  */


	  PlayerSlider.prototype.increaseProgress = function increaseProgress() {
	    var amount = arguments.length <= 0 || arguments[0] === undefined ? 0.01 : arguments[0];

	    var progress = this.track._progress;
	    progress += amount;
	    progress = progress > 1 ? 1 : progress;
	    this.setTrackProgress(progress);
	    return this;
	  };
	  /*
	    Initial render method.
	    @private
	    @overrides @ Module
	    @returns this
	  */


	  PlayerSlider.prototype._render = function _render() {
	    var p = this._props;

	    this._addMainElement();
	    this.el.classList.add(SLIDER_CLASSES.slider);

	    this.leftBound = new _slider2.default({
	      isBound: true,
	      parent: this.el,
	      isRipple: false,
	      onProgress: this._onLeftBoundProgress.bind(this),
	      onSeekStart: p.onSeekStart,
	      onSeekEnd: p.onSeekEnd
	    });

	    this.track = new _slider2.default({
	      parent: this.el,
	      className: CLASSES.slider,
	      onProgress: this._onTrackProgress.bind(this),
	      onSeekStart: p.onSeekStart,
	      onSeekEnd: p.onSeekEnd
	    });
	    this.rightBound = new _slider2.default({
	      isBound: true,
	      parent: this.el,
	      isRipple: false,
	      isInversed: true,
	      onProgress: this._onRightBoundProgress.bind(this),
	      onSeekStart: p.onSeekStart,
	      onSeekEnd: p.onSeekEnd
	    });

	    this.rightBound.setProgress(p.rightProgress);
	    this.track.setProgress(p.progress);
	    this.leftBound.setProgress(p.leftProgress);

	    p.parent.appendChild(this.el);
	  };
	  /*
	    Method that should be called on track update.
	    @private
	    @param {Number} Track progress value [0...1].
	  */


	  PlayerSlider.prototype._onTrackProgress = function _onTrackProgress(p) {
	    this._callIfFunction(this._props.onProgress, p);
	  };
	  /*
	    Method that should be called on left bound update.
	    @private
	    @param {Number} Track progress value [0...1].
	  */


	  PlayerSlider.prototype._onLeftBoundProgress = function _onLeftBoundProgress(p) {
	    if (!this._props.isBounds) {
	      return;
	    }
	    this._props.leftProgress = p;
	    this.track.setMinBound(p);
	    this.rightBound.setMinBound(p);
	    this._callIfFunction(this._props.onLeftProgress, p);
	  };
	  /*
	    Method that should be called on right bound update.
	    @private
	    @param {Number} Track progress value [0...1].
	  */


	  PlayerSlider.prototype._onRightBoundProgress = function _onRightBoundProgress(p) {
	    if (!this._props.isBounds) {
	      return;
	    }
	    this._props.rightProgress = p;
	    this.track.setMaxBound(p);
	    this.leftBound.setMaxBound(p);
	    this._callIfFunction(this._props.onRightProgress, p);
	  };

	  return PlayerSlider;
	}(_module2.default);

	exports.default = PlayerSlider;

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _classCallCheck2 = __webpack_require__(78);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(79);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _module = __webpack_require__(90);

	var _module2 = _interopRequireDefault(_module);

	var _handle = __webpack_require__(93);

	var _handle2 = _interopRequireDefault(_handle);

	var _track = __webpack_require__(100);

	var _track2 = _interopRequireDefault(_track);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(105);
	var CLASSES = __webpack_require__(107);

	var Slider = function (_Module) {
	  (0, _inherits3.default)(Slider, _Module);

	  function Slider() {
	    (0, _classCallCheck3.default)(this, Slider);
	    return (0, _possibleConstructorReturn3.default)(this, _Module.apply(this, arguments));
	  }

	  /*
	    Method to declare _defaults.
	    @private
	    @overrides @ Module
	  */

	  Slider.prototype._declareDefaults = function _declareDefaults() {
	    this._defaults = {
	      className: '',
	      parent: document.body,
	      isBound: false,
	      isInversed: false,
	      isRipple: true,
	      isProgress: true,
	      onProgress: null,
	      onSeekStart: null,
	      onSeekEnd: null,
	      direction: 'x',
	      snapPoint: 0,
	      snapStrength: 0
	    };
	  };
	  /*
	    Method to set slider progress.
	    @public
	    @param {Number} Progress to set.
	    @returns this.
	  */


	  Slider.prototype.setProgress = function setProgress(progress) {
	    this.handle.setProgress(progress);
	    this.track.setProgress(progress);
	    return this;
	  };
	  /*
	    Method to set bounds of progress.
	    @public
	    @param {Number} Min bound to set [0...1].
	    @param {Number} Max bound to set [0...1].
	    @returns this.
	  */


	  Slider.prototype.setBounds = function setBounds(min, max) {
	    this.handle.setBounds(min, max);
	    this.track.setBounds(min, max);
	    return this;
	  };
	  /*
	    Method to set min bound of progress.
	    @public
	    @param {Number} Min bound to set [0...1].
	    @returns this.
	  */


	  Slider.prototype.setMinBound = function setMinBound(min) {
	    this.handle.setMinBound(min);
	    this.track.setMinBound(min);
	    return this;
	  };
	  /*
	    Method to set max bound of progress.
	    @public
	    @param {Number} Max bound to set [0...1].
	    @returns this.
	  */


	  Slider.prototype.setMaxBound = function setMaxBound(max) {
	    this.handle.setMaxBound(max);
	    this.track.setMaxBound(max);
	    return this;
	  };
	  /*
	    Method to hide elements.
	    @public
	  */


	  Slider.prototype.show = function show() {
	    this.track.el.style.display = 'block';
	    this.handle.el.style.display = 'block';
	  };
	  /*
	    Method to hide elements.
	    @public
	  */


	  Slider.prototype.hide = function hide() {
	    this.track.el.style.display = 'none';
	    this.handle.el.style.display = 'none';
	  };
	  /*
	    Method to render the component.
	    @private
	    @overrides @ Module
	  */


	  Slider.prototype._render = function _render() {
	    var p = this._props;

	    if (!p.isBound) {
	      var el = this._createElement('div'),
	          classList = el.classList;
	      this.el = el;

	      this.inner = this._createElement('div');
	      this.inner.classList.add(CLASSES['slider__inner']);
	      this.el.appendChild(this.inner);

	      classList.add(CLASSES.slider);
	      p.direction === 'y' && classList.add(CLASSES['is-y']);
	      p.className && classList.add(p.className);
	      p.parent.appendChild(el);
	    }

	    var rootEl = !p.isBound ? this.inner : p.parent;

	    this.track = new _track2.default({
	      className: CLASSES.track,
	      onProgress: this._onTrackProgress.bind(this),
	      onSeekStart: p.onSeekStart,
	      onSeekEnd: p.onSeekEnd,
	      isBound: p.isBound,
	      isInversed: p.isInversed,
	      isRipple: p.isRipple,
	      isProgress: p.isProgress,
	      parent: rootEl,
	      direction: p.direction,
	      snapPoint: p.snapPoint,
	      snapStrength: p.snapStrength
	    });
	    rootEl.appendChild(this.track.el);

	    var handleClass = [CLASSES.handle];
	    if (!p.isBound) {
	      handleClass.push(CLASSES['progress-handle']);
	    }

	    this.handle = new _handle2.default({
	      className: handleClass,
	      onProgress: this._onHandleProgress.bind(this),
	      onSeekStart: p.onSeekStart,
	      onSeekEnd: p.onSeekEnd,
	      isBound: p.isBound,
	      isInversed: p.isInversed,
	      parent: rootEl,
	      direction: p.direction,
	      snapPoint: p.snapPoint,
	      snapStrength: p.snapStrength
	    });
	    rootEl.appendChild(this.handle.el);
	  };
	  /*
	    Method that is invoked on handle progress change.
	    @private
	    @param {Number} Progress [0...1].
	  */


	  Slider.prototype._onHandleProgress = function _onHandleProgress(p) {
	    this.track.setProgress(p, false);
	    this._onProgress(p);
	  };
	  /*
	    Method that is invoked on track progress change.
	    @private
	    @param {Number} Progress [0...1].
	  */


	  Slider.prototype._onTrackProgress = function _onTrackProgress(p) {
	    this.handle.setProgress(p, false);
	    this._onProgress(p);
	  };
	  /*
	    Method to call onProgress callback.
	    @private
	    @param {Number} Progress value [0...1].
	  */


	  Slider.prototype._onProgress = function _onProgress(progress) {
	    var p = this._props;
	    if (typeof p.onProgress === 'function' && this._progress !== progress) {
	      this._progress = progress;
	      p.onProgress.call(this, progress);
	    }
	  };

	  return Slider;
	}(_module2.default);

	exports.default = Slider;

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _classCallCheck2 = __webpack_require__(78);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(79);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _module = __webpack_require__(90);

	var _module2 = _interopRequireDefault(_module);

	var _hammerjs = __webpack_require__(94);

	var _hammerjs2 = _interopRequireDefault(_hammerjs);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(95);
	var CLASSES = __webpack_require__(99);

	var Handle = function (_Module) {
	  (0, _inherits3.default)(Handle, _Module);

	  function Handle() {
	    (0, _classCallCheck3.default)(this, Handle);
	    return (0, _possibleConstructorReturn3.default)(this, _Module.apply(this, arguments));
	  }

	  /*
	    Method to declare _defaults.
	    @private
	    @overrides @ Module
	  */

	  Handle.prototype._declareDefaults = function _declareDefaults() {
	    _Module.prototype._declareDefaults.call(this);
	    this._defaults.minBound = 0;
	    this._defaults.maxBound = 1;
	    this._defaults.isBound = false;
	    this._defaults.isInversed = false;
	    this._defaults.direction = 'x';
	    this._defaults.onSeekStart = null;
	    this._defaults.onSeekEnd = null;
	    this._defaults.onProgress = null;
	    this._defaults.snapPoint = 0;
	    this._defaults.snapStrength = 0;
	  };
	  /*
	    Method to set handle progress.
	    @public
	    @param {Number} Progress [0...1].
	    @param {Boolean} If should invoke onProgress callback.
	    @returns this.
	  */


	  Handle.prototype.setProgress = function setProgress(progress) {
	    var isCallback = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

	    var shift = this._progressToShift(progress);
	    this._setShift(shift, isCallback);
	    // calc delta and save it
	    this._delta = shift - this._shift;
	    this._saveDelta();
	    return this;
	  };
	  /*
	    Method to set bounds of progress.
	    @public
	    @param {Number} Min bound to set [0...1].
	    @param {Number} Max bound to set [0...1].
	    @returns this.
	  */


	  Handle.prototype.setBounds = function setBounds(min, max) {
	    this.setMinBound(min);
	    this.setMaxBound(max);
	    return this;
	  };
	  /*
	    Method to set min bound of progress.
	    @public
	    @param {Number} Min bound to set [0...1].
	    @returns this.
	  */


	  Handle.prototype.setMinBound = function setMinBound(min) {
	    this._props.minBound = Math.max(min, 0);
	    if (this._progress < min) {
	      this.setProgress(min);
	    }
	    return this;
	  };
	  /*
	    Method to set max bound of progress.
	    @public
	    @param {Number} Max bound to set [0...1].
	    @returns this.
	  */


	  Handle.prototype.setMaxBound = function setMaxBound(max) {
	    this._props.maxBound = Math.min(max, 1);
	    if (this._progress > max) {
	      this.setProgress(max);
	    }
	    return this;
	  };
	  /*
	    Method to declare properties.
	    @private
	    @overrides @ Module.
	  */


	  Handle.prototype._vars = function _vars() {
	    // `progress` of the handle [0..1]
	    this._progress = 0;
	    // `shift` of the handle ( position in `px` )
	    this._shift = 0;
	    // `delta` deviation from the current `shift`
	    this._delta = 0;
	  };
	  /*
	    Method to set handle shift.
	    @private
	    @param {Number} Shift in `px`.
	    @param {Boolean} If should invoke onProgress callback.
	    @returns {Number}.
	  */


	  Handle.prototype._setShift = function _setShift(shift) {
	    var isCallback = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

	    var p = this._props,
	        minBound = p.minBound * this._maxWidth,
	        maxBound = p.maxBound * this._maxWidth;

	    shift = mojs.h.clamp(shift, minBound, maxBound);
	    this._applyShift(shift);
	    if (isCallback) {
	      this._onProgress(shift);
	    } else {
	      this._progress = this._shiftToProgress(shift);
	    }
	    return shift;
	  };
	  /*
	    Method to apply shift to the DOMElement.
	    @private
	    @param {Number} Shift in pixels.
	  */


	  Handle.prototype._applyShift = function _applyShift(shift) {
	    var p = this._props;
	    // translateZ(0)
	    this.el.style.transform = p.direction === 'x' ? 'translateX( ' + shift + 'px )' : 'translateY( ' + -shift + 'px )';
	  };
	  /*
	    Method to get max width of the parent.
	    @private
	  */


	  Handle.prototype._getMaxWidth = function _getMaxWidth() {
	    var p = this._props,
	        parent = p.parent;

	    this._maxWidth = p.direction === 'x' ? parent.clientWidth : parent.clientHeight;
	  };
	  /*
	    Method to render the component.
	    @private
	    @overrides @ Module
	  */


	  Handle.prototype._render = function _render() {
	    _Module.prototype._render.call(this);
	    this._addElements();
	    this._getMaxWidth();
	    this._hammerTime();
	  };
	  /*
	    Method to classes on `this.el`.
	    @private
	    @overrides @ Module
	  */


	  Handle.prototype._addMainClasses = function _addMainClasses() {
	    _Module.prototype._addMainClasses.call(this);

	    var p = this._props,
	        classList = this.el.classList;

	    classList.add(CLASSES.handle);
	    if (p.isBound) {
	      classList.add(CLASSES['is-bound']);
	    }
	    if (p.isInversed) {
	      classList.add(CLASSES['is-inversed']);
	    }
	  };
	  /*
	    Method to add DOM elements on render.
	    @private
	  */


	  Handle.prototype._addElements = function _addElements() {
	    var inner = this._createElement('div'),
	        shadow = this._createElement('div');

	    inner.classList.add('' + CLASSES.handle__inner);
	    shadow.classList.add('' + CLASSES.handle__shadow);
	    this.el.appendChild(shadow);
	    this.el.appendChild(inner);
	  };
	  /*
	    Method to initialize HammerJS an set up all even listeners.
	    @private
	  */


	  Handle.prototype._hammerTime = function _hammerTime() {
	    var p = this._props,
	        direction = p.direction === 'x' ? 'HORIZONTAL' : 'VERTICAL',
	        hm = new _hammerjs2.default.Manager(this.el, {
	      recognizers: [[_hammerjs2.default.Pan, { direction: _hammerjs2.default['DIRECTION_' + direction] }]]
	    });

	    hm.on('pan', this._pan.bind(this));
	    hm.on('panend', this._panEnd.bind(this));
	    this._addPointerDownEvent(this.el, this._pointerDown.bind(this));
	    this._addPointerUpEvent(this.el, this._pointerUp.bind(this));
	    // add listener on document to cover edge cases
	    // like when you press -> leave the element -> release
	    this._addPointerUpEvent(document, this._pointerUpDoc.bind(this));

	    window.addEventListener('resize', this._onWindowResize.bind(this));
	  };
	  /*
	    Callback for pan end on main el.
	    @private
	    @param {Object} Original event object.
	  */


	  Handle.prototype._pan = function _pan(e) {
	    var p = this._props;
	    this._delta = p.direction === 'x' ? e.deltaX : -e.deltaY;
	    // get progress from the shift to undestand how far is the snapPoint
	    var shift = this._shift + this._delta,
	        proc = this._shiftToProgress(shift);
	    // if progress is around snapPoint set it to the snap point
	    proc = Math.abs(proc - p.snapPoint) < p.snapStrength ? p.snapPoint : proc;
	    // recalculate the progress to shift and set it
	    this._setShift(this._progressToShift(proc));
	  };
	  /*
	    Callback for pan end on main el.
	    @private
	    @param {Object} Original event object.
	  */


	  Handle.prototype._panEnd = function _panEnd(e) {
	    this._saveDelta();
	    this._callIfFunction(this._props.onSeekEnd, e);
	  };
	  /*
	    Callback for pointer down on main el.
	    @private
	    @param {Object} Original event object.
	  */


	  Handle.prototype._pointerDown = function _pointerDown(e) {
	    var p = this._props;
	    this._isPointerDown = true;
	    this._callIfFunction(p.onSeekStart, e);
	  };
	  /*
	    Callback for pointer up on main el.
	    @private
	    @param {Object} Original event object.
	  */


	  Handle.prototype._pointerUp = function _pointerUp(e) {
	    this._callIfFunction(this._props.onSeekEnd, e);
	    e.preventDefault();
	    return false;
	  };
	  /*
	    Callback for pointer up on document.
	    @private
	    @param {Object} Original event object.
	  */


	  Handle.prototype._pointerUpDoc = function _pointerUpDoc(e) {
	    if (!this._isPointerDown) {
	      return;
	    }
	    this._callIfFunction(this._props.onSeekEnd, e);
	    this._isPointerDown = false;
	  };
	  /*
	    Method to add _delta to _shift.
	    @private
	  */


	  Handle.prototype._saveDelta = function _saveDelta() {
	    this._shift += this._delta;
	  };
	  /*
	    Method to call onProgress callback.
	    @private
	    @param {Number} Shift in `px`.
	  */


	  Handle.prototype._onProgress = function _onProgress(shift) {
	    var p = this._props,
	        progress = this._shiftToProgress(shift);

	    if (this._progress !== progress) {
	      this._progress = progress;
	      if (this._isFunction(p.onProgress)) {
	        p.onProgress.call(this, progress);
	      }
	    }
	  };
	  /*
	    Method to recalc shift to progress.
	    @private
	    @param {Number} Shift in `px`.
	    @returns {Number} Progress [0...1].
	  */


	  Handle.prototype._shiftToProgress = function _shiftToProgress(shift) {
	    return shift / this._maxWidth;
	  };
	  /*
	    Method to progress shift to shift.
	    @private
	    @param   {Number} Progress [0...1].
	    @returns {Number} Shift in `px`.
	   */


	  Handle.prototype._progressToShift = function _progressToShift(progress) {
	    return progress * this._maxWidth;
	  };
	  /*
	    Callback for window resize event.
	    @private
	    @param {Object} Original event object.
	  */


	  Handle.prototype._onWindowResize = function _onWindowResize(e) {
	    this._getMaxWidth();
	    this.setProgress(this._progress);
	  };

	  return Handle;
	}(_module2.default);

	exports.default = Handle;

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*! Hammer.JS - v2.0.7 - 2016-04-22
	 * http://hammerjs.github.io/
	 *
	 * Copyright (c) 2016 Jorik Tangelder;
	 * Licensed under the MIT license */
	(function(window, document, exportName, undefined) {
	  'use strict';

	var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
	var TEST_ELEMENT = document.createElement('div');

	var TYPE_FUNCTION = 'function';

	var round = Math.round;
	var abs = Math.abs;
	var now = Date.now;

	/**
	 * set a timeout with a given scope
	 * @param {Function} fn
	 * @param {Number} timeout
	 * @param {Object} context
	 * @returns {number}
	 */
	function setTimeoutContext(fn, timeout, context) {
	    return setTimeout(bindFn(fn, context), timeout);
	}

	/**
	 * if the argument is an array, we want to execute the fn on each entry
	 * if it aint an array we don't want to do a thing.
	 * this is used by all the methods that accept a single and array argument.
	 * @param {*|Array} arg
	 * @param {String} fn
	 * @param {Object} [context]
	 * @returns {Boolean}
	 */
	function invokeArrayArg(arg, fn, context) {
	    if (Array.isArray(arg)) {
	        each(arg, context[fn], context);
	        return true;
	    }
	    return false;
	}

	/**
	 * walk objects and arrays
	 * @param {Object} obj
	 * @param {Function} iterator
	 * @param {Object} context
	 */
	function each(obj, iterator, context) {
	    var i;

	    if (!obj) {
	        return;
	    }

	    if (obj.forEach) {
	        obj.forEach(iterator, context);
	    } else if (obj.length !== undefined) {
	        i = 0;
	        while (i < obj.length) {
	            iterator.call(context, obj[i], i, obj);
	            i++;
	        }
	    } else {
	        for (i in obj) {
	            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
	        }
	    }
	}

	/**
	 * wrap a method with a deprecation warning and stack trace
	 * @param {Function} method
	 * @param {String} name
	 * @param {String} message
	 * @returns {Function} A new function wrapping the supplied method.
	 */
	function deprecate(method, name, message) {
	    var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
	    return function() {
	        var e = new Error('get-stack-trace');
	        var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
	            .replace(/^\s+at\s+/gm, '')
	            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

	        var log = window.console && (window.console.warn || window.console.log);
	        if (log) {
	            log.call(window.console, deprecationMessage, stack);
	        }
	        return method.apply(this, arguments);
	    };
	}

	/**
	 * extend object.
	 * means that properties in dest will be overwritten by the ones in src.
	 * @param {Object} target
	 * @param {...Object} objects_to_assign
	 * @returns {Object} target
	 */
	var assign;
	if (typeof Object.assign !== 'function') {
	    assign = function assign(target) {
	        if (target === undefined || target === null) {
	            throw new TypeError('Cannot convert undefined or null to object');
	        }

	        var output = Object(target);
	        for (var index = 1; index < arguments.length; index++) {
	            var source = arguments[index];
	            if (source !== undefined && source !== null) {
	                for (var nextKey in source) {
	                    if (source.hasOwnProperty(nextKey)) {
	                        output[nextKey] = source[nextKey];
	                    }
	                }
	            }
	        }
	        return output;
	    };
	} else {
	    assign = Object.assign;
	}

	/**
	 * extend object.
	 * means that properties in dest will be overwritten by the ones in src.
	 * @param {Object} dest
	 * @param {Object} src
	 * @param {Boolean} [merge=false]
	 * @returns {Object} dest
	 */
	var extend = deprecate(function extend(dest, src, merge) {
	    var keys = Object.keys(src);
	    var i = 0;
	    while (i < keys.length) {
	        if (!merge || (merge && dest[keys[i]] === undefined)) {
	            dest[keys[i]] = src[keys[i]];
	        }
	        i++;
	    }
	    return dest;
	}, 'extend', 'Use `assign`.');

	/**
	 * merge the values from src in the dest.
	 * means that properties that exist in dest will not be overwritten by src
	 * @param {Object} dest
	 * @param {Object} src
	 * @returns {Object} dest
	 */
	var merge = deprecate(function merge(dest, src) {
	    return extend(dest, src, true);
	}, 'merge', 'Use `assign`.');

	/**
	 * simple class inheritance
	 * @param {Function} child
	 * @param {Function} base
	 * @param {Object} [properties]
	 */
	function inherit(child, base, properties) {
	    var baseP = base.prototype,
	        childP;

	    childP = child.prototype = Object.create(baseP);
	    childP.constructor = child;
	    childP._super = baseP;

	    if (properties) {
	        assign(childP, properties);
	    }
	}

	/**
	 * simple function bind
	 * @param {Function} fn
	 * @param {Object} context
	 * @returns {Function}
	 */
	function bindFn(fn, context) {
	    return function boundFn() {
	        return fn.apply(context, arguments);
	    };
	}

	/**
	 * let a boolean value also be a function that must return a boolean
	 * this first item in args will be used as the context
	 * @param {Boolean|Function} val
	 * @param {Array} [args]
	 * @returns {Boolean}
	 */
	function boolOrFn(val, args) {
	    if (typeof val == TYPE_FUNCTION) {
	        return val.apply(args ? args[0] || undefined : undefined, args);
	    }
	    return val;
	}

	/**
	 * use the val2 when val1 is undefined
	 * @param {*} val1
	 * @param {*} val2
	 * @returns {*}
	 */
	function ifUndefined(val1, val2) {
	    return (val1 === undefined) ? val2 : val1;
	}

	/**
	 * addEventListener with multiple events at once
	 * @param {EventTarget} target
	 * @param {String} types
	 * @param {Function} handler
	 */
	function addEventListeners(target, types, handler) {
	    each(splitStr(types), function(type) {
	        target.addEventListener(type, handler, false);
	    });
	}

	/**
	 * removeEventListener with multiple events at once
	 * @param {EventTarget} target
	 * @param {String} types
	 * @param {Function} handler
	 */
	function removeEventListeners(target, types, handler) {
	    each(splitStr(types), function(type) {
	        target.removeEventListener(type, handler, false);
	    });
	}

	/**
	 * find if a node is in the given parent
	 * @method hasParent
	 * @param {HTMLElement} node
	 * @param {HTMLElement} parent
	 * @return {Boolean} found
	 */
	function hasParent(node, parent) {
	    while (node) {
	        if (node == parent) {
	            return true;
	        }
	        node = node.parentNode;
	    }
	    return false;
	}

	/**
	 * small indexOf wrapper
	 * @param {String} str
	 * @param {String} find
	 * @returns {Boolean} found
	 */
	function inStr(str, find) {
	    return str.indexOf(find) > -1;
	}

	/**
	 * split string on whitespace
	 * @param {String} str
	 * @returns {Array} words
	 */
	function splitStr(str) {
	    return str.trim().split(/\s+/g);
	}

	/**
	 * find if a array contains the object using indexOf or a simple polyFill
	 * @param {Array} src
	 * @param {String} find
	 * @param {String} [findByKey]
	 * @return {Boolean|Number} false when not found, or the index
	 */
	function inArray(src, find, findByKey) {
	    if (src.indexOf && !findByKey) {
	        return src.indexOf(find);
	    } else {
	        var i = 0;
	        while (i < src.length) {
	            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
	                return i;
	            }
	            i++;
	        }
	        return -1;
	    }
	}

	/**
	 * convert array-like objects to real arrays
	 * @param {Object} obj
	 * @returns {Array}
	 */
	function toArray(obj) {
	    return Array.prototype.slice.call(obj, 0);
	}

	/**
	 * unique array with objects based on a key (like 'id') or just by the array's value
	 * @param {Array} src [{id:1},{id:2},{id:1}]
	 * @param {String} [key]
	 * @param {Boolean} [sort=False]
	 * @returns {Array} [{id:1},{id:2}]
	 */
	function uniqueArray(src, key, sort) {
	    var results = [];
	    var values = [];
	    var i = 0;

	    while (i < src.length) {
	        var val = key ? src[i][key] : src[i];
	        if (inArray(values, val) < 0) {
	            results.push(src[i]);
	        }
	        values[i] = val;
	        i++;
	    }

	    if (sort) {
	        if (!key) {
	            results = results.sort();
	        } else {
	            results = results.sort(function sortUniqueArray(a, b) {
	                return a[key] > b[key];
	            });
	        }
	    }

	    return results;
	}

	/**
	 * get the prefixed property
	 * @param {Object} obj
	 * @param {String} property
	 * @returns {String|Undefined} prefixed
	 */
	function prefixed(obj, property) {
	    var prefix, prop;
	    var camelProp = property[0].toUpperCase() + property.slice(1);

	    var i = 0;
	    while (i < VENDOR_PREFIXES.length) {
	        prefix = VENDOR_PREFIXES[i];
	        prop = (prefix) ? prefix + camelProp : property;

	        if (prop in obj) {
	            return prop;
	        }
	        i++;
	    }
	    return undefined;
	}

	/**
	 * get a unique id
	 * @returns {number} uniqueId
	 */
	var _uniqueId = 1;
	function uniqueId() {
	    return _uniqueId++;
	}

	/**
	 * get the window object of an element
	 * @param {HTMLElement} element
	 * @returns {DocumentView|Window}
	 */
	function getWindowForElement(element) {
	    var doc = element.ownerDocument || element;
	    return (doc.defaultView || doc.parentWindow || window);
	}

	var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

	var SUPPORT_TOUCH = ('ontouchstart' in window);
	var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
	var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

	var INPUT_TYPE_TOUCH = 'touch';
	var INPUT_TYPE_PEN = 'pen';
	var INPUT_TYPE_MOUSE = 'mouse';
	var INPUT_TYPE_KINECT = 'kinect';

	var COMPUTE_INTERVAL = 25;

	var INPUT_START = 1;
	var INPUT_MOVE = 2;
	var INPUT_END = 4;
	var INPUT_CANCEL = 8;

	var DIRECTION_NONE = 1;
	var DIRECTION_LEFT = 2;
	var DIRECTION_RIGHT = 4;
	var DIRECTION_UP = 8;
	var DIRECTION_DOWN = 16;

	var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
	var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
	var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

	var PROPS_XY = ['x', 'y'];
	var PROPS_CLIENT_XY = ['clientX', 'clientY'];

	/**
	 * create new input type manager
	 * @param {Manager} manager
	 * @param {Function} callback
	 * @returns {Input}
	 * @constructor
	 */
	function Input(manager, callback) {
	    var self = this;
	    this.manager = manager;
	    this.callback = callback;
	    this.element = manager.element;
	    this.target = manager.options.inputTarget;

	    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
	    // so when disabled the input events are completely bypassed.
	    this.domHandler = function(ev) {
	        if (boolOrFn(manager.options.enable, [manager])) {
	            self.handler(ev);
	        }
	    };

	    this.init();

	}

	Input.prototype = {
	    /**
	     * should handle the inputEvent data and trigger the callback
	     * @virtual
	     */
	    handler: function() { },

	    /**
	     * bind the events
	     */
	    init: function() {
	        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
	        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
	        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
	    },

	    /**
	     * unbind the events
	     */
	    destroy: function() {
	        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
	        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
	        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
	    }
	};

	/**
	 * create new input type manager
	 * called by the Manager constructor
	 * @param {Hammer} manager
	 * @returns {Input}
	 */
	function createInputInstance(manager) {
	    var Type;
	    var inputClass = manager.options.inputClass;

	    if (inputClass) {
	        Type = inputClass;
	    } else if (SUPPORT_POINTER_EVENTS) {
	        Type = PointerEventInput;
	    } else if (SUPPORT_ONLY_TOUCH) {
	        Type = TouchInput;
	    } else if (!SUPPORT_TOUCH) {
	        Type = MouseInput;
	    } else {
	        Type = TouchMouseInput;
	    }
	    return new (Type)(manager, inputHandler);
	}

	/**
	 * handle input events
	 * @param {Manager} manager
	 * @param {String} eventType
	 * @param {Object} input
	 */
	function inputHandler(manager, eventType, input) {
	    var pointersLen = input.pointers.length;
	    var changedPointersLen = input.changedPointers.length;
	    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
	    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

	    input.isFirst = !!isFirst;
	    input.isFinal = !!isFinal;

	    if (isFirst) {
	        manager.session = {};
	    }

	    // source event is the normalized value of the domEvents
	    // like 'touchstart, mouseup, pointerdown'
	    input.eventType = eventType;

	    // compute scale, rotation etc
	    computeInputData(manager, input);

	    // emit secret event
	    manager.emit('hammer.input', input);

	    manager.recognize(input);
	    manager.session.prevInput = input;
	}

	/**
	 * extend the data with some usable properties like scale, rotate, velocity etc
	 * @param {Object} manager
	 * @param {Object} input
	 */
	function computeInputData(manager, input) {
	    var session = manager.session;
	    var pointers = input.pointers;
	    var pointersLength = pointers.length;

	    // store the first input to calculate the distance and direction
	    if (!session.firstInput) {
	        session.firstInput = simpleCloneInputData(input);
	    }

	    // to compute scale and rotation we need to store the multiple touches
	    if (pointersLength > 1 && !session.firstMultiple) {
	        session.firstMultiple = simpleCloneInputData(input);
	    } else if (pointersLength === 1) {
	        session.firstMultiple = false;
	    }

	    var firstInput = session.firstInput;
	    var firstMultiple = session.firstMultiple;
	    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

	    var center = input.center = getCenter(pointers);
	    input.timeStamp = now();
	    input.deltaTime = input.timeStamp - firstInput.timeStamp;

	    input.angle = getAngle(offsetCenter, center);
	    input.distance = getDistance(offsetCenter, center);

	    computeDeltaXY(session, input);
	    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

	    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
	    input.overallVelocityX = overallVelocity.x;
	    input.overallVelocityY = overallVelocity.y;
	    input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

	    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
	    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

	    input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
	        session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

	    computeIntervalInputData(session, input);

	    // find the correct target
	    var target = manager.element;
	    if (hasParent(input.srcEvent.target, target)) {
	        target = input.srcEvent.target;
	    }
	    input.target = target;
	}

	function computeDeltaXY(session, input) {
	    var center = input.center;
	    var offset = session.offsetDelta || {};
	    var prevDelta = session.prevDelta || {};
	    var prevInput = session.prevInput || {};

	    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
	        prevDelta = session.prevDelta = {
	            x: prevInput.deltaX || 0,
	            y: prevInput.deltaY || 0
	        };

	        offset = session.offsetDelta = {
	            x: center.x,
	            y: center.y
	        };
	    }

	    input.deltaX = prevDelta.x + (center.x - offset.x);
	    input.deltaY = prevDelta.y + (center.y - offset.y);
	}

	/**
	 * velocity is calculated every x ms
	 * @param {Object} session
	 * @param {Object} input
	 */
	function computeIntervalInputData(session, input) {
	    var last = session.lastInterval || input,
	        deltaTime = input.timeStamp - last.timeStamp,
	        velocity, velocityX, velocityY, direction;

	    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
	        var deltaX = input.deltaX - last.deltaX;
	        var deltaY = input.deltaY - last.deltaY;

	        var v = getVelocity(deltaTime, deltaX, deltaY);
	        velocityX = v.x;
	        velocityY = v.y;
	        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
	        direction = getDirection(deltaX, deltaY);

	        session.lastInterval = input;
	    } else {
	        // use latest velocity info if it doesn't overtake a minimum period
	        velocity = last.velocity;
	        velocityX = last.velocityX;
	        velocityY = last.velocityY;
	        direction = last.direction;
	    }

	    input.velocity = velocity;
	    input.velocityX = velocityX;
	    input.velocityY = velocityY;
	    input.direction = direction;
	}

	/**
	 * create a simple clone from the input used for storage of firstInput and firstMultiple
	 * @param {Object} input
	 * @returns {Object} clonedInputData
	 */
	function simpleCloneInputData(input) {
	    // make a simple copy of the pointers because we will get a reference if we don't
	    // we only need clientXY for the calculations
	    var pointers = [];
	    var i = 0;
	    while (i < input.pointers.length) {
	        pointers[i] = {
	            clientX: round(input.pointers[i].clientX),
	            clientY: round(input.pointers[i].clientY)
	        };
	        i++;
	    }

	    return {
	        timeStamp: now(),
	        pointers: pointers,
	        center: getCenter(pointers),
	        deltaX: input.deltaX,
	        deltaY: input.deltaY
	    };
	}

	/**
	 * get the center of all the pointers
	 * @param {Array} pointers
	 * @return {Object} center contains `x` and `y` properties
	 */
	function getCenter(pointers) {
	    var pointersLength = pointers.length;

	    // no need to loop when only one touch
	    if (pointersLength === 1) {
	        return {
	            x: round(pointers[0].clientX),
	            y: round(pointers[0].clientY)
	        };
	    }

	    var x = 0, y = 0, i = 0;
	    while (i < pointersLength) {
	        x += pointers[i].clientX;
	        y += pointers[i].clientY;
	        i++;
	    }

	    return {
	        x: round(x / pointersLength),
	        y: round(y / pointersLength)
	    };
	}

	/**
	 * calculate the velocity between two points. unit is in px per ms.
	 * @param {Number} deltaTime
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Object} velocity `x` and `y`
	 */
	function getVelocity(deltaTime, x, y) {
	    return {
	        x: x / deltaTime || 0,
	        y: y / deltaTime || 0
	    };
	}

	/**
	 * get the direction between two points
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Number} direction
	 */
	function getDirection(x, y) {
	    if (x === y) {
	        return DIRECTION_NONE;
	    }

	    if (abs(x) >= abs(y)) {
	        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
	    }
	    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
	}

	/**
	 * calculate the absolute distance between two points
	 * @param {Object} p1 {x, y}
	 * @param {Object} p2 {x, y}
	 * @param {Array} [props] containing x and y keys
	 * @return {Number} distance
	 */
	function getDistance(p1, p2, props) {
	    if (!props) {
	        props = PROPS_XY;
	    }
	    var x = p2[props[0]] - p1[props[0]],
	        y = p2[props[1]] - p1[props[1]];

	    return Math.sqrt((x * x) + (y * y));
	}

	/**
	 * calculate the angle between two coordinates
	 * @param {Object} p1
	 * @param {Object} p2
	 * @param {Array} [props] containing x and y keys
	 * @return {Number} angle
	 */
	function getAngle(p1, p2, props) {
	    if (!props) {
	        props = PROPS_XY;
	    }
	    var x = p2[props[0]] - p1[props[0]],
	        y = p2[props[1]] - p1[props[1]];
	    return Math.atan2(y, x) * 180 / Math.PI;
	}

	/**
	 * calculate the rotation degrees between two pointersets
	 * @param {Array} start array of pointers
	 * @param {Array} end array of pointers
	 * @return {Number} rotation
	 */
	function getRotation(start, end) {
	    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
	}

	/**
	 * calculate the scale factor between two pointersets
	 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
	 * @param {Array} start array of pointers
	 * @param {Array} end array of pointers
	 * @return {Number} scale
	 */
	function getScale(start, end) {
	    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
	}

	var MOUSE_INPUT_MAP = {
	    mousedown: INPUT_START,
	    mousemove: INPUT_MOVE,
	    mouseup: INPUT_END
	};

	var MOUSE_ELEMENT_EVENTS = 'mousedown';
	var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

	/**
	 * Mouse events input
	 * @constructor
	 * @extends Input
	 */
	function MouseInput() {
	    this.evEl = MOUSE_ELEMENT_EVENTS;
	    this.evWin = MOUSE_WINDOW_EVENTS;

	    this.pressed = false; // mousedown state

	    Input.apply(this, arguments);
	}

	inherit(MouseInput, Input, {
	    /**
	     * handle mouse events
	     * @param {Object} ev
	     */
	    handler: function MEhandler(ev) {
	        var eventType = MOUSE_INPUT_MAP[ev.type];

	        // on start we want to have the left mouse button down
	        if (eventType & INPUT_START && ev.button === 0) {
	            this.pressed = true;
	        }

	        if (eventType & INPUT_MOVE && ev.which !== 1) {
	            eventType = INPUT_END;
	        }

	        // mouse must be down
	        if (!this.pressed) {
	            return;
	        }

	        if (eventType & INPUT_END) {
	            this.pressed = false;
	        }

	        this.callback(this.manager, eventType, {
	            pointers: [ev],
	            changedPointers: [ev],
	            pointerType: INPUT_TYPE_MOUSE,
	            srcEvent: ev
	        });
	    }
	});

	var POINTER_INPUT_MAP = {
	    pointerdown: INPUT_START,
	    pointermove: INPUT_MOVE,
	    pointerup: INPUT_END,
	    pointercancel: INPUT_CANCEL,
	    pointerout: INPUT_CANCEL
	};

	// in IE10 the pointer types is defined as an enum
	var IE10_POINTER_TYPE_ENUM = {
	    2: INPUT_TYPE_TOUCH,
	    3: INPUT_TYPE_PEN,
	    4: INPUT_TYPE_MOUSE,
	    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
	};

	var POINTER_ELEMENT_EVENTS = 'pointerdown';
	var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

	// IE10 has prefixed support, and case-sensitive
	if (window.MSPointerEvent && !window.PointerEvent) {
	    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
	    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
	}

	/**
	 * Pointer events input
	 * @constructor
	 * @extends Input
	 */
	function PointerEventInput() {
	    this.evEl = POINTER_ELEMENT_EVENTS;
	    this.evWin = POINTER_WINDOW_EVENTS;

	    Input.apply(this, arguments);

	    this.store = (this.manager.session.pointerEvents = []);
	}

	inherit(PointerEventInput, Input, {
	    /**
	     * handle mouse events
	     * @param {Object} ev
	     */
	    handler: function PEhandler(ev) {
	        var store = this.store;
	        var removePointer = false;

	        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
	        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
	        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

	        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

	        // get index of the event in the store
	        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

	        // start and mouse must be down
	        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
	            if (storeIndex < 0) {
	                store.push(ev);
	                storeIndex = store.length - 1;
	            }
	        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
	            removePointer = true;
	        }

	        // it not found, so the pointer hasn't been down (so it's probably a hover)
	        if (storeIndex < 0) {
	            return;
	        }

	        // update the event in the store
	        store[storeIndex] = ev;

	        this.callback(this.manager, eventType, {
	            pointers: store,
	            changedPointers: [ev],
	            pointerType: pointerType,
	            srcEvent: ev
	        });

	        if (removePointer) {
	            // remove from the store
	            store.splice(storeIndex, 1);
	        }
	    }
	});

	var SINGLE_TOUCH_INPUT_MAP = {
	    touchstart: INPUT_START,
	    touchmove: INPUT_MOVE,
	    touchend: INPUT_END,
	    touchcancel: INPUT_CANCEL
	};

	var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
	var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

	/**
	 * Touch events input
	 * @constructor
	 * @extends Input
	 */
	function SingleTouchInput() {
	    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
	    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
	    this.started = false;

	    Input.apply(this, arguments);
	}

	inherit(SingleTouchInput, Input, {
	    handler: function TEhandler(ev) {
	        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

	        // should we handle the touch events?
	        if (type === INPUT_START) {
	            this.started = true;
	        }

	        if (!this.started) {
	            return;
	        }

	        var touches = normalizeSingleTouches.call(this, ev, type);

	        // when done, reset the started state
	        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
	            this.started = false;
	        }

	        this.callback(this.manager, type, {
	            pointers: touches[0],
	            changedPointers: touches[1],
	            pointerType: INPUT_TYPE_TOUCH,
	            srcEvent: ev
	        });
	    }
	});

	/**
	 * @this {TouchInput}
	 * @param {Object} ev
	 * @param {Number} type flag
	 * @returns {undefined|Array} [all, changed]
	 */
	function normalizeSingleTouches(ev, type) {
	    var all = toArray(ev.touches);
	    var changed = toArray(ev.changedTouches);

	    if (type & (INPUT_END | INPUT_CANCEL)) {
	        all = uniqueArray(all.concat(changed), 'identifier', true);
	    }

	    return [all, changed];
	}

	var TOUCH_INPUT_MAP = {
	    touchstart: INPUT_START,
	    touchmove: INPUT_MOVE,
	    touchend: INPUT_END,
	    touchcancel: INPUT_CANCEL
	};

	var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

	/**
	 * Multi-user touch events input
	 * @constructor
	 * @extends Input
	 */
	function TouchInput() {
	    this.evTarget = TOUCH_TARGET_EVENTS;
	    this.targetIds = {};

	    Input.apply(this, arguments);
	}

	inherit(TouchInput, Input, {
	    handler: function MTEhandler(ev) {
	        var type = TOUCH_INPUT_MAP[ev.type];
	        var touches = getTouches.call(this, ev, type);
	        if (!touches) {
	            return;
	        }

	        this.callback(this.manager, type, {
	            pointers: touches[0],
	            changedPointers: touches[1],
	            pointerType: INPUT_TYPE_TOUCH,
	            srcEvent: ev
	        });
	    }
	});

	/**
	 * @this {TouchInput}
	 * @param {Object} ev
	 * @param {Number} type flag
	 * @returns {undefined|Array} [all, changed]
	 */
	function getTouches(ev, type) {
	    var allTouches = toArray(ev.touches);
	    var targetIds = this.targetIds;

	    // when there is only one touch, the process can be simplified
	    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
	        targetIds[allTouches[0].identifier] = true;
	        return [allTouches, allTouches];
	    }

	    var i,
	        targetTouches,
	        changedTouches = toArray(ev.changedTouches),
	        changedTargetTouches = [],
	        target = this.target;

	    // get target touches from touches
	    targetTouches = allTouches.filter(function(touch) {
	        return hasParent(touch.target, target);
	    });

	    // collect touches
	    if (type === INPUT_START) {
	        i = 0;
	        while (i < targetTouches.length) {
	            targetIds[targetTouches[i].identifier] = true;
	            i++;
	        }
	    }

	    // filter changed touches to only contain touches that exist in the collected target ids
	    i = 0;
	    while (i < changedTouches.length) {
	        if (targetIds[changedTouches[i].identifier]) {
	            changedTargetTouches.push(changedTouches[i]);
	        }

	        // cleanup removed touches
	        if (type & (INPUT_END | INPUT_CANCEL)) {
	            delete targetIds[changedTouches[i].identifier];
	        }
	        i++;
	    }

	    if (!changedTargetTouches.length) {
	        return;
	    }

	    return [
	        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
	        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
	        changedTargetTouches
	    ];
	}

	/**
	 * Combined touch and mouse input
	 *
	 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
	 * This because touch devices also emit mouse events while doing a touch.
	 *
	 * @constructor
	 * @extends Input
	 */

	var DEDUP_TIMEOUT = 2500;
	var DEDUP_DISTANCE = 25;

	function TouchMouseInput() {
	    Input.apply(this, arguments);

	    var handler = bindFn(this.handler, this);
	    this.touch = new TouchInput(this.manager, handler);
	    this.mouse = new MouseInput(this.manager, handler);

	    this.primaryTouch = null;
	    this.lastTouches = [];
	}

	inherit(TouchMouseInput, Input, {
	    /**
	     * handle mouse and touch events
	     * @param {Hammer} manager
	     * @param {String} inputEvent
	     * @param {Object} inputData
	     */
	    handler: function TMEhandler(manager, inputEvent, inputData) {
	        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
	            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

	        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
	            return;
	        }

	        // when we're in a touch event, record touches to  de-dupe synthetic mouse event
	        if (isTouch) {
	            recordTouches.call(this, inputEvent, inputData);
	        } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
	            return;
	        }

	        this.callback(manager, inputEvent, inputData);
	    },

	    /**
	     * remove the event listeners
	     */
	    destroy: function destroy() {
	        this.touch.destroy();
	        this.mouse.destroy();
	    }
	});

	function recordTouches(eventType, eventData) {
	    if (eventType & INPUT_START) {
	        this.primaryTouch = eventData.changedPointers[0].identifier;
	        setLastTouch.call(this, eventData);
	    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
	        setLastTouch.call(this, eventData);
	    }
	}

	function setLastTouch(eventData) {
	    var touch = eventData.changedPointers[0];

	    if (touch.identifier === this.primaryTouch) {
	        var lastTouch = {x: touch.clientX, y: touch.clientY};
	        this.lastTouches.push(lastTouch);
	        var lts = this.lastTouches;
	        var removeLastTouch = function() {
	            var i = lts.indexOf(lastTouch);
	            if (i > -1) {
	                lts.splice(i, 1);
	            }
	        };
	        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
	    }
	}

	function isSyntheticEvent(eventData) {
	    var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
	    for (var i = 0; i < this.lastTouches.length; i++) {
	        var t = this.lastTouches[i];
	        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
	        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
	            return true;
	        }
	    }
	    return false;
	}

	var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
	var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

	// magical touchAction value
	var TOUCH_ACTION_COMPUTE = 'compute';
	var TOUCH_ACTION_AUTO = 'auto';
	var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
	var TOUCH_ACTION_NONE = 'none';
	var TOUCH_ACTION_PAN_X = 'pan-x';
	var TOUCH_ACTION_PAN_Y = 'pan-y';
	var TOUCH_ACTION_MAP = getTouchActionProps();

	/**
	 * Touch Action
	 * sets the touchAction property or uses the js alternative
	 * @param {Manager} manager
	 * @param {String} value
	 * @constructor
	 */
	function TouchAction(manager, value) {
	    this.manager = manager;
	    this.set(value);
	}

	TouchAction.prototype = {
	    /**
	     * set the touchAction value on the element or enable the polyfill
	     * @param {String} value
	     */
	    set: function(value) {
	        // find out the touch-action by the event handlers
	        if (value == TOUCH_ACTION_COMPUTE) {
	            value = this.compute();
	        }

	        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
	            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
	        }
	        this.actions = value.toLowerCase().trim();
	    },

	    /**
	     * just re-set the touchAction value
	     */
	    update: function() {
	        this.set(this.manager.options.touchAction);
	    },

	    /**
	     * compute the value for the touchAction property based on the recognizer's settings
	     * @returns {String} value
	     */
	    compute: function() {
	        var actions = [];
	        each(this.manager.recognizers, function(recognizer) {
	            if (boolOrFn(recognizer.options.enable, [recognizer])) {
	                actions = actions.concat(recognizer.getTouchAction());
	            }
	        });
	        return cleanTouchActions(actions.join(' '));
	    },

	    /**
	     * this method is called on each input cycle and provides the preventing of the browser behavior
	     * @param {Object} input
	     */
	    preventDefaults: function(input) {
	        var srcEvent = input.srcEvent;
	        var direction = input.offsetDirection;

	        // if the touch action did prevented once this session
	        if (this.manager.session.prevented) {
	            srcEvent.preventDefault();
	            return;
	        }

	        var actions = this.actions;
	        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
	        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
	        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

	        if (hasNone) {
	            //do not prevent defaults if this is a tap gesture

	            var isTapPointer = input.pointers.length === 1;
	            var isTapMovement = input.distance < 2;
	            var isTapTouchTime = input.deltaTime < 250;

	            if (isTapPointer && isTapMovement && isTapTouchTime) {
	                return;
	            }
	        }

	        if (hasPanX && hasPanY) {
	            // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
	            return;
	        }

	        if (hasNone ||
	            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
	            (hasPanX && direction & DIRECTION_VERTICAL)) {
	            return this.preventSrc(srcEvent);
	        }
	    },

	    /**
	     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
	     * @param {Object} srcEvent
	     */
	    preventSrc: function(srcEvent) {
	        this.manager.session.prevented = true;
	        srcEvent.preventDefault();
	    }
	};

	/**
	 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
	 * @param {String} actions
	 * @returns {*}
	 */
	function cleanTouchActions(actions) {
	    // none
	    if (inStr(actions, TOUCH_ACTION_NONE)) {
	        return TOUCH_ACTION_NONE;
	    }

	    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
	    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

	    // if both pan-x and pan-y are set (different recognizers
	    // for different directions, e.g. horizontal pan but vertical swipe?)
	    // we need none (as otherwise with pan-x pan-y combined none of these
	    // recognizers will work, since the browser would handle all panning
	    if (hasPanX && hasPanY) {
	        return TOUCH_ACTION_NONE;
	    }

	    // pan-x OR pan-y
	    if (hasPanX || hasPanY) {
	        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
	    }

	    // manipulation
	    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
	        return TOUCH_ACTION_MANIPULATION;
	    }

	    return TOUCH_ACTION_AUTO;
	}

	function getTouchActionProps() {
	    if (!NATIVE_TOUCH_ACTION) {
	        return false;
	    }
	    var touchMap = {};
	    var cssSupports = window.CSS && window.CSS.supports;
	    ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

	        // If css.supports is not supported but there is native touch-action assume it supports
	        // all values. This is the case for IE 10 and 11.
	        touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
	    });
	    return touchMap;
	}

	/**
	 * Recognizer flow explained; *
	 * All recognizers have the initial state of POSSIBLE when a input session starts.
	 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
	 * Example session for mouse-input: mousedown -> mousemove -> mouseup
	 *
	 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
	 * which determines with state it should be.
	 *
	 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
	 * POSSIBLE to give it another change on the next cycle.
	 *
	 *               Possible
	 *                  |
	 *            +-----+---------------+
	 *            |                     |
	 *      +-----+-----+               |
	 *      |           |               |
	 *   Failed      Cancelled          |
	 *                          +-------+------+
	 *                          |              |
	 *                      Recognized       Began
	 *                                         |
	 *                                      Changed
	 *                                         |
	 *                                  Ended/Recognized
	 */
	var STATE_POSSIBLE = 1;
	var STATE_BEGAN = 2;
	var STATE_CHANGED = 4;
	var STATE_ENDED = 8;
	var STATE_RECOGNIZED = STATE_ENDED;
	var STATE_CANCELLED = 16;
	var STATE_FAILED = 32;

	/**
	 * Recognizer
	 * Every recognizer needs to extend from this class.
	 * @constructor
	 * @param {Object} options
	 */
	function Recognizer(options) {
	    this.options = assign({}, this.defaults, options || {});

	    this.id = uniqueId();

	    this.manager = null;

	    // default is enable true
	    this.options.enable = ifUndefined(this.options.enable, true);

	    this.state = STATE_POSSIBLE;

	    this.simultaneous = {};
	    this.requireFail = [];
	}

	Recognizer.prototype = {
	    /**
	     * @virtual
	     * @type {Object}
	     */
	    defaults: {},

	    /**
	     * set options
	     * @param {Object} options
	     * @return {Recognizer}
	     */
	    set: function(options) {
	        assign(this.options, options);

	        // also update the touchAction, in case something changed about the directions/enabled state
	        this.manager && this.manager.touchAction.update();
	        return this;
	    },

	    /**
	     * recognize simultaneous with an other recognizer.
	     * @param {Recognizer} otherRecognizer
	     * @returns {Recognizer} this
	     */
	    recognizeWith: function(otherRecognizer) {
	        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
	            return this;
	        }

	        var simultaneous = this.simultaneous;
	        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	        if (!simultaneous[otherRecognizer.id]) {
	            simultaneous[otherRecognizer.id] = otherRecognizer;
	            otherRecognizer.recognizeWith(this);
	        }
	        return this;
	    },

	    /**
	     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
	     * @param {Recognizer} otherRecognizer
	     * @returns {Recognizer} this
	     */
	    dropRecognizeWith: function(otherRecognizer) {
	        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
	            return this;
	        }

	        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	        delete this.simultaneous[otherRecognizer.id];
	        return this;
	    },

	    /**
	     * recognizer can only run when an other is failing
	     * @param {Recognizer} otherRecognizer
	     * @returns {Recognizer} this
	     */
	    requireFailure: function(otherRecognizer) {
	        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
	            return this;
	        }

	        var requireFail = this.requireFail;
	        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	        if (inArray(requireFail, otherRecognizer) === -1) {
	            requireFail.push(otherRecognizer);
	            otherRecognizer.requireFailure(this);
	        }
	        return this;
	    },

	    /**
	     * drop the requireFailure link. it does not remove the link on the other recognizer.
	     * @param {Recognizer} otherRecognizer
	     * @returns {Recognizer} this
	     */
	    dropRequireFailure: function(otherRecognizer) {
	        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
	            return this;
	        }

	        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	        var index = inArray(this.requireFail, otherRecognizer);
	        if (index > -1) {
	            this.requireFail.splice(index, 1);
	        }
	        return this;
	    },

	    /**
	     * has require failures boolean
	     * @returns {boolean}
	     */
	    hasRequireFailures: function() {
	        return this.requireFail.length > 0;
	    },

	    /**
	     * if the recognizer can recognize simultaneous with an other recognizer
	     * @param {Recognizer} otherRecognizer
	     * @returns {Boolean}
	     */
	    canRecognizeWith: function(otherRecognizer) {
	        return !!this.simultaneous[otherRecognizer.id];
	    },

	    /**
	     * You should use `tryEmit` instead of `emit` directly to check
	     * that all the needed recognizers has failed before emitting.
	     * @param {Object} input
	     */
	    emit: function(input) {
	        var self = this;
	        var state = this.state;

	        function emit(event) {
	            self.manager.emit(event, input);
	        }

	        // 'panstart' and 'panmove'
	        if (state < STATE_ENDED) {
	            emit(self.options.event + stateStr(state));
	        }

	        emit(self.options.event); // simple 'eventName' events

	        if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
	            emit(input.additionalEvent);
	        }

	        // panend and pancancel
	        if (state >= STATE_ENDED) {
	            emit(self.options.event + stateStr(state));
	        }
	    },

	    /**
	     * Check that all the require failure recognizers has failed,
	     * if true, it emits a gesture event,
	     * otherwise, setup the state to FAILED.
	     * @param {Object} input
	     */
	    tryEmit: function(input) {
	        if (this.canEmit()) {
	            return this.emit(input);
	        }
	        // it's failing anyway
	        this.state = STATE_FAILED;
	    },

	    /**
	     * can we emit?
	     * @returns {boolean}
	     */
	    canEmit: function() {
	        var i = 0;
	        while (i < this.requireFail.length) {
	            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
	                return false;
	            }
	            i++;
	        }
	        return true;
	    },

	    /**
	     * update the recognizer
	     * @param {Object} inputData
	     */
	    recognize: function(inputData) {
	        // make a new copy of the inputData
	        // so we can change the inputData without messing up the other recognizers
	        var inputDataClone = assign({}, inputData);

	        // is is enabled and allow recognizing?
	        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
	            this.reset();
	            this.state = STATE_FAILED;
	            return;
	        }

	        // reset when we've reached the end
	        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
	            this.state = STATE_POSSIBLE;
	        }

	        this.state = this.process(inputDataClone);

	        // the recognizer has recognized a gesture
	        // so trigger an event
	        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
	            this.tryEmit(inputDataClone);
	        }
	    },

	    /**
	     * return the state of the recognizer
	     * the actual recognizing happens in this method
	     * @virtual
	     * @param {Object} inputData
	     * @returns {Const} STATE
	     */
	    process: function(inputData) { }, // jshint ignore:line

	    /**
	     * return the preferred touch-action
	     * @virtual
	     * @returns {Array}
	     */
	    getTouchAction: function() { },

	    /**
	     * called when the gesture isn't allowed to recognize
	     * like when another is being recognized or it is disabled
	     * @virtual
	     */
	    reset: function() { }
	};

	/**
	 * get a usable string, used as event postfix
	 * @param {Const} state
	 * @returns {String} state
	 */
	function stateStr(state) {
	    if (state & STATE_CANCELLED) {
	        return 'cancel';
	    } else if (state & STATE_ENDED) {
	        return 'end';
	    } else if (state & STATE_CHANGED) {
	        return 'move';
	    } else if (state & STATE_BEGAN) {
	        return 'start';
	    }
	    return '';
	}

	/**
	 * direction cons to string
	 * @param {Const} direction
	 * @returns {String}
	 */
	function directionStr(direction) {
	    if (direction == DIRECTION_DOWN) {
	        return 'down';
	    } else if (direction == DIRECTION_UP) {
	        return 'up';
	    } else if (direction == DIRECTION_LEFT) {
	        return 'left';
	    } else if (direction == DIRECTION_RIGHT) {
	        return 'right';
	    }
	    return '';
	}

	/**
	 * get a recognizer by name if it is bound to a manager
	 * @param {Recognizer|String} otherRecognizer
	 * @param {Recognizer} recognizer
	 * @returns {Recognizer}
	 */
	function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
	    var manager = recognizer.manager;
	    if (manager) {
	        return manager.get(otherRecognizer);
	    }
	    return otherRecognizer;
	}

	/**
	 * This recognizer is just used as a base for the simple attribute recognizers.
	 * @constructor
	 * @extends Recognizer
	 */
	function AttrRecognizer() {
	    Recognizer.apply(this, arguments);
	}

	inherit(AttrRecognizer, Recognizer, {
	    /**
	     * @namespace
	     * @memberof AttrRecognizer
	     */
	    defaults: {
	        /**
	         * @type {Number}
	         * @default 1
	         */
	        pointers: 1
	    },

	    /**
	     * Used to check if it the recognizer receives valid input, like input.distance > 10.
	     * @memberof AttrRecognizer
	     * @param {Object} input
	     * @returns {Boolean} recognized
	     */
	    attrTest: function(input) {
	        var optionPointers = this.options.pointers;
	        return optionPointers === 0 || input.pointers.length === optionPointers;
	    },

	    /**
	     * Process the input and return the state for the recognizer
	     * @memberof AttrRecognizer
	     * @param {Object} input
	     * @returns {*} State
	     */
	    process: function(input) {
	        var state = this.state;
	        var eventType = input.eventType;

	        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
	        var isValid = this.attrTest(input);

	        // on cancel input and we've recognized before, return STATE_CANCELLED
	        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
	            return state | STATE_CANCELLED;
	        } else if (isRecognized || isValid) {
	            if (eventType & INPUT_END) {
	                return state | STATE_ENDED;
	            } else if (!(state & STATE_BEGAN)) {
	                return STATE_BEGAN;
	            }
	            return state | STATE_CHANGED;
	        }
	        return STATE_FAILED;
	    }
	});

	/**
	 * Pan
	 * Recognized when the pointer is down and moved in the allowed direction.
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function PanRecognizer() {
	    AttrRecognizer.apply(this, arguments);

	    this.pX = null;
	    this.pY = null;
	}

	inherit(PanRecognizer, AttrRecognizer, {
	    /**
	     * @namespace
	     * @memberof PanRecognizer
	     */
	    defaults: {
	        event: 'pan',
	        threshold: 10,
	        pointers: 1,
	        direction: DIRECTION_ALL
	    },

	    getTouchAction: function() {
	        var direction = this.options.direction;
	        var actions = [];
	        if (direction & DIRECTION_HORIZONTAL) {
	            actions.push(TOUCH_ACTION_PAN_Y);
	        }
	        if (direction & DIRECTION_VERTICAL) {
	            actions.push(TOUCH_ACTION_PAN_X);
	        }
	        return actions;
	    },

	    directionTest: function(input) {
	        var options = this.options;
	        var hasMoved = true;
	        var distance = input.distance;
	        var direction = input.direction;
	        var x = input.deltaX;
	        var y = input.deltaY;

	        // lock to axis?
	        if (!(direction & options.direction)) {
	            if (options.direction & DIRECTION_HORIZONTAL) {
	                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
	                hasMoved = x != this.pX;
	                distance = Math.abs(input.deltaX);
	            } else {
	                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
	                hasMoved = y != this.pY;
	                distance = Math.abs(input.deltaY);
	            }
	        }
	        input.direction = direction;
	        return hasMoved && distance > options.threshold && direction & options.direction;
	    },

	    attrTest: function(input) {
	        return AttrRecognizer.prototype.attrTest.call(this, input) &&
	            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
	    },

	    emit: function(input) {

	        this.pX = input.deltaX;
	        this.pY = input.deltaY;

	        var direction = directionStr(input.direction);

	        if (direction) {
	            input.additionalEvent = this.options.event + direction;
	        }
	        this._super.emit.call(this, input);
	    }
	});

	/**
	 * Pinch
	 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function PinchRecognizer() {
	    AttrRecognizer.apply(this, arguments);
	}

	inherit(PinchRecognizer, AttrRecognizer, {
	    /**
	     * @namespace
	     * @memberof PinchRecognizer
	     */
	    defaults: {
	        event: 'pinch',
	        threshold: 0,
	        pointers: 2
	    },

	    getTouchAction: function() {
	        return [TOUCH_ACTION_NONE];
	    },

	    attrTest: function(input) {
	        return this._super.attrTest.call(this, input) &&
	            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
	    },

	    emit: function(input) {
	        if (input.scale !== 1) {
	            var inOut = input.scale < 1 ? 'in' : 'out';
	            input.additionalEvent = this.options.event + inOut;
	        }
	        this._super.emit.call(this, input);
	    }
	});

	/**
	 * Press
	 * Recognized when the pointer is down for x ms without any movement.
	 * @constructor
	 * @extends Recognizer
	 */
	function PressRecognizer() {
	    Recognizer.apply(this, arguments);

	    this._timer = null;
	    this._input = null;
	}

	inherit(PressRecognizer, Recognizer, {
	    /**
	     * @namespace
	     * @memberof PressRecognizer
	     */
	    defaults: {
	        event: 'press',
	        pointers: 1,
	        time: 251, // minimal time of the pointer to be pressed
	        threshold: 9 // a minimal movement is ok, but keep it low
	    },

	    getTouchAction: function() {
	        return [TOUCH_ACTION_AUTO];
	    },

	    process: function(input) {
	        var options = this.options;
	        var validPointers = input.pointers.length === options.pointers;
	        var validMovement = input.distance < options.threshold;
	        var validTime = input.deltaTime > options.time;

	        this._input = input;

	        // we only allow little movement
	        // and we've reached an end event, so a tap is possible
	        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
	            this.reset();
	        } else if (input.eventType & INPUT_START) {
	            this.reset();
	            this._timer = setTimeoutContext(function() {
	                this.state = STATE_RECOGNIZED;
	                this.tryEmit();
	            }, options.time, this);
	        } else if (input.eventType & INPUT_END) {
	            return STATE_RECOGNIZED;
	        }
	        return STATE_FAILED;
	    },

	    reset: function() {
	        clearTimeout(this._timer);
	    },

	    emit: function(input) {
	        if (this.state !== STATE_RECOGNIZED) {
	            return;
	        }

	        if (input && (input.eventType & INPUT_END)) {
	            this.manager.emit(this.options.event + 'up', input);
	        } else {
	            this._input.timeStamp = now();
	            this.manager.emit(this.options.event, this._input);
	        }
	    }
	});

	/**
	 * Rotate
	 * Recognized when two or more pointer are moving in a circular motion.
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function RotateRecognizer() {
	    AttrRecognizer.apply(this, arguments);
	}

	inherit(RotateRecognizer, AttrRecognizer, {
	    /**
	     * @namespace
	     * @memberof RotateRecognizer
	     */
	    defaults: {
	        event: 'rotate',
	        threshold: 0,
	        pointers: 2
	    },

	    getTouchAction: function() {
	        return [TOUCH_ACTION_NONE];
	    },

	    attrTest: function(input) {
	        return this._super.attrTest.call(this, input) &&
	            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
	    }
	});

	/**
	 * Swipe
	 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function SwipeRecognizer() {
	    AttrRecognizer.apply(this, arguments);
	}

	inherit(SwipeRecognizer, AttrRecognizer, {
	    /**
	     * @namespace
	     * @memberof SwipeRecognizer
	     */
	    defaults: {
	        event: 'swipe',
	        threshold: 10,
	        velocity: 0.3,
	        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
	        pointers: 1
	    },

	    getTouchAction: function() {
	        return PanRecognizer.prototype.getTouchAction.call(this);
	    },

	    attrTest: function(input) {
	        var direction = this.options.direction;
	        var velocity;

	        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
	            velocity = input.overallVelocity;
	        } else if (direction & DIRECTION_HORIZONTAL) {
	            velocity = input.overallVelocityX;
	        } else if (direction & DIRECTION_VERTICAL) {
	            velocity = input.overallVelocityY;
	        }

	        return this._super.attrTest.call(this, input) &&
	            direction & input.offsetDirection &&
	            input.distance > this.options.threshold &&
	            input.maxPointers == this.options.pointers &&
	            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
	    },

	    emit: function(input) {
	        var direction = directionStr(input.offsetDirection);
	        if (direction) {
	            this.manager.emit(this.options.event + direction, input);
	        }

	        this.manager.emit(this.options.event, input);
	    }
	});

	/**
	 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
	 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
	 * a single tap.
	 *
	 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
	 * multi-taps being recognized.
	 * @constructor
	 * @extends Recognizer
	 */
	function TapRecognizer() {
	    Recognizer.apply(this, arguments);

	    // previous time and center,
	    // used for tap counting
	    this.pTime = false;
	    this.pCenter = false;

	    this._timer = null;
	    this._input = null;
	    this.count = 0;
	}

	inherit(TapRecognizer, Recognizer, {
	    /**
	     * @namespace
	     * @memberof PinchRecognizer
	     */
	    defaults: {
	        event: 'tap',
	        pointers: 1,
	        taps: 1,
	        interval: 300, // max time between the multi-tap taps
	        time: 250, // max time of the pointer to be down (like finger on the screen)
	        threshold: 9, // a minimal movement is ok, but keep it low
	        posThreshold: 10 // a multi-tap can be a bit off the initial position
	    },

	    getTouchAction: function() {
	        return [TOUCH_ACTION_MANIPULATION];
	    },

	    process: function(input) {
	        var options = this.options;

	        var validPointers = input.pointers.length === options.pointers;
	        var validMovement = input.distance < options.threshold;
	        var validTouchTime = input.deltaTime < options.time;

	        this.reset();

	        if ((input.eventType & INPUT_START) && (this.count === 0)) {
	            return this.failTimeout();
	        }

	        // we only allow little movement
	        // and we've reached an end event, so a tap is possible
	        if (validMovement && validTouchTime && validPointers) {
	            if (input.eventType != INPUT_END) {
	                return this.failTimeout();
	            }

	            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
	            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

	            this.pTime = input.timeStamp;
	            this.pCenter = input.center;

	            if (!validMultiTap || !validInterval) {
	                this.count = 1;
	            } else {
	                this.count += 1;
	            }

	            this._input = input;

	            // if tap count matches we have recognized it,
	            // else it has began recognizing...
	            var tapCount = this.count % options.taps;
	            if (tapCount === 0) {
	                // no failing requirements, immediately trigger the tap event
	                // or wait as long as the multitap interval to trigger
	                if (!this.hasRequireFailures()) {
	                    return STATE_RECOGNIZED;
	                } else {
	                    this._timer = setTimeoutContext(function() {
	                        this.state = STATE_RECOGNIZED;
	                        this.tryEmit();
	                    }, options.interval, this);
	                    return STATE_BEGAN;
	                }
	            }
	        }
	        return STATE_FAILED;
	    },

	    failTimeout: function() {
	        this._timer = setTimeoutContext(function() {
	            this.state = STATE_FAILED;
	        }, this.options.interval, this);
	        return STATE_FAILED;
	    },

	    reset: function() {
	        clearTimeout(this._timer);
	    },

	    emit: function() {
	        if (this.state == STATE_RECOGNIZED) {
	            this._input.tapCount = this.count;
	            this.manager.emit(this.options.event, this._input);
	        }
	    }
	});

	/**
	 * Simple way to create a manager with a default set of recognizers.
	 * @param {HTMLElement} element
	 * @param {Object} [options]
	 * @constructor
	 */
	function Hammer(element, options) {
	    options = options || {};
	    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
	    return new Manager(element, options);
	}

	/**
	 * @const {string}
	 */
	Hammer.VERSION = '2.0.7';

	/**
	 * default settings
	 * @namespace
	 */
	Hammer.defaults = {
	    /**
	     * set if DOM events are being triggered.
	     * But this is slower and unused by simple implementations, so disabled by default.
	     * @type {Boolean}
	     * @default false
	     */
	    domEvents: false,

	    /**
	     * The value for the touchAction property/fallback.
	     * When set to `compute` it will magically set the correct value based on the added recognizers.
	     * @type {String}
	     * @default compute
	     */
	    touchAction: TOUCH_ACTION_COMPUTE,

	    /**
	     * @type {Boolean}
	     * @default true
	     */
	    enable: true,

	    /**
	     * EXPERIMENTAL FEATURE -- can be removed/changed
	     * Change the parent input target element.
	     * If Null, then it is being set the to main element.
	     * @type {Null|EventTarget}
	     * @default null
	     */
	    inputTarget: null,

	    /**
	     * force an input class
	     * @type {Null|Function}
	     * @default null
	     */
	    inputClass: null,

	    /**
	     * Default recognizer setup when calling `Hammer()`
	     * When creating a new Manager these will be skipped.
	     * @type {Array}
	     */
	    preset: [
	        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
	        [RotateRecognizer, {enable: false}],
	        [PinchRecognizer, {enable: false}, ['rotate']],
	        [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
	        [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
	        [TapRecognizer],
	        [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
	        [PressRecognizer]
	    ],

	    /**
	     * Some CSS properties can be used to improve the working of Hammer.
	     * Add them to this method and they will be set when creating a new Manager.
	     * @namespace
	     */
	    cssProps: {
	        /**
	         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
	         * @type {String}
	         * @default 'none'
	         */
	        userSelect: 'none',

	        /**
	         * Disable the Windows Phone grippers when pressing an element.
	         * @type {String}
	         * @default 'none'
	         */
	        touchSelect: 'none',

	        /**
	         * Disables the default callout shown when you touch and hold a touch target.
	         * On iOS, when you touch and hold a touch target such as a link, Safari displays
	         * a callout containing information about the link. This property allows you to disable that callout.
	         * @type {String}
	         * @default 'none'
	         */
	        touchCallout: 'none',

	        /**
	         * Specifies whether zooming is enabled. Used by IE10>
	         * @type {String}
	         * @default 'none'
	         */
	        contentZooming: 'none',

	        /**
	         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
	         * @type {String}
	         * @default 'none'
	         */
	        userDrag: 'none',

	        /**
	         * Overrides the highlight color shown when the user taps a link or a JavaScript
	         * clickable element in iOS. This property obeys the alpha value, if specified.
	         * @type {String}
	         * @default 'rgba(0,0,0,0)'
	         */
	        tapHighlightColor: 'rgba(0,0,0,0)'
	    }
	};

	var STOP = 1;
	var FORCED_STOP = 2;

	/**
	 * Manager
	 * @param {HTMLElement} element
	 * @param {Object} [options]
	 * @constructor
	 */
	function Manager(element, options) {
	    this.options = assign({}, Hammer.defaults, options || {});

	    this.options.inputTarget = this.options.inputTarget || element;

	    this.handlers = {};
	    this.session = {};
	    this.recognizers = [];
	    this.oldCssProps = {};

	    this.element = element;
	    this.input = createInputInstance(this);
	    this.touchAction = new TouchAction(this, this.options.touchAction);

	    toggleCssProps(this, true);

	    each(this.options.recognizers, function(item) {
	        var recognizer = this.add(new (item[0])(item[1]));
	        item[2] && recognizer.recognizeWith(item[2]);
	        item[3] && recognizer.requireFailure(item[3]);
	    }, this);
	}

	Manager.prototype = {
	    /**
	     * set options
	     * @param {Object} options
	     * @returns {Manager}
	     */
	    set: function(options) {
	        assign(this.options, options);

	        // Options that need a little more setup
	        if (options.touchAction) {
	            this.touchAction.update();
	        }
	        if (options.inputTarget) {
	            // Clean up existing event listeners and reinitialize
	            this.input.destroy();
	            this.input.target = options.inputTarget;
	            this.input.init();
	        }
	        return this;
	    },

	    /**
	     * stop recognizing for this session.
	     * This session will be discarded, when a new [input]start event is fired.
	     * When forced, the recognizer cycle is stopped immediately.
	     * @param {Boolean} [force]
	     */
	    stop: function(force) {
	        this.session.stopped = force ? FORCED_STOP : STOP;
	    },

	    /**
	     * run the recognizers!
	     * called by the inputHandler function on every movement of the pointers (touches)
	     * it walks through all the recognizers and tries to detect the gesture that is being made
	     * @param {Object} inputData
	     */
	    recognize: function(inputData) {
	        var session = this.session;
	        if (session.stopped) {
	            return;
	        }

	        // run the touch-action polyfill
	        this.touchAction.preventDefaults(inputData);

	        var recognizer;
	        var recognizers = this.recognizers;

	        // this holds the recognizer that is being recognized.
	        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
	        // if no recognizer is detecting a thing, it is set to `null`
	        var curRecognizer = session.curRecognizer;

	        // reset when the last recognizer is recognized
	        // or when we're in a new session
	        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
	            curRecognizer = session.curRecognizer = null;
	        }

	        var i = 0;
	        while (i < recognizers.length) {
	            recognizer = recognizers[i];

	            // find out if we are allowed try to recognize the input for this one.
	            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
	            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
	            //      that is being recognized.
	            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
	            //      this can be setup with the `recognizeWith()` method on the recognizer.
	            if (session.stopped !== FORCED_STOP && ( // 1
	                    !curRecognizer || recognizer == curRecognizer || // 2
	                    recognizer.canRecognizeWith(curRecognizer))) { // 3
	                recognizer.recognize(inputData);
	            } else {
	                recognizer.reset();
	            }

	            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
	            // current active recognizer. but only if we don't already have an active recognizer
	            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
	                curRecognizer = session.curRecognizer = recognizer;
	            }
	            i++;
	        }
	    },

	    /**
	     * get a recognizer by its event name.
	     * @param {Recognizer|String} recognizer
	     * @returns {Recognizer|Null}
	     */
	    get: function(recognizer) {
	        if (recognizer instanceof Recognizer) {
	            return recognizer;
	        }

	        var recognizers = this.recognizers;
	        for (var i = 0; i < recognizers.length; i++) {
	            if (recognizers[i].options.event == recognizer) {
	                return recognizers[i];
	            }
	        }
	        return null;
	    },

	    /**
	     * add a recognizer to the manager
	     * existing recognizers with the same event name will be removed
	     * @param {Recognizer} recognizer
	     * @returns {Recognizer|Manager}
	     */
	    add: function(recognizer) {
	        if (invokeArrayArg(recognizer, 'add', this)) {
	            return this;
	        }

	        // remove existing
	        var existing = this.get(recognizer.options.event);
	        if (existing) {
	            this.remove(existing);
	        }

	        this.recognizers.push(recognizer);
	        recognizer.manager = this;

	        this.touchAction.update();
	        return recognizer;
	    },

	    /**
	     * remove a recognizer by name or instance
	     * @param {Recognizer|String} recognizer
	     * @returns {Manager}
	     */
	    remove: function(recognizer) {
	        if (invokeArrayArg(recognizer, 'remove', this)) {
	            return this;
	        }

	        recognizer = this.get(recognizer);

	        // let's make sure this recognizer exists
	        if (recognizer) {
	            var recognizers = this.recognizers;
	            var index = inArray(recognizers, recognizer);

	            if (index !== -1) {
	                recognizers.splice(index, 1);
	                this.touchAction.update();
	            }
	        }

	        return this;
	    },

	    /**
	     * bind event
	     * @param {String} events
	     * @param {Function} handler
	     * @returns {EventEmitter} this
	     */
	    on: function(events, handler) {
	        if (events === undefined) {
	            return;
	        }
	        if (handler === undefined) {
	            return;
	        }

	        var handlers = this.handlers;
	        each(splitStr(events), function(event) {
	            handlers[event] = handlers[event] || [];
	            handlers[event].push(handler);
	        });
	        return this;
	    },

	    /**
	     * unbind event, leave emit blank to remove all handlers
	     * @param {String} events
	     * @param {Function} [handler]
	     * @returns {EventEmitter} this
	     */
	    off: function(events, handler) {
	        if (events === undefined) {
	            return;
	        }

	        var handlers = this.handlers;
	        each(splitStr(events), function(event) {
	            if (!handler) {
	                delete handlers[event];
	            } else {
	                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
	            }
	        });
	        return this;
	    },

	    /**
	     * emit event to the listeners
	     * @param {String} event
	     * @param {Object} data
	     */
	    emit: function(event, data) {
	        // we also want to trigger dom events
	        if (this.options.domEvents) {
	            triggerDomEvent(event, data);
	        }

	        // no handlers, so skip it all
	        var handlers = this.handlers[event] && this.handlers[event].slice();
	        if (!handlers || !handlers.length) {
	            return;
	        }

	        data.type = event;
	        data.preventDefault = function() {
	            data.srcEvent.preventDefault();
	        };

	        var i = 0;
	        while (i < handlers.length) {
	            handlers[i](data);
	            i++;
	        }
	    },

	    /**
	     * destroy the manager and unbinds all events
	     * it doesn't unbind dom events, that is the user own responsibility
	     */
	    destroy: function() {
	        this.element && toggleCssProps(this, false);

	        this.handlers = {};
	        this.session = {};
	        this.input.destroy();
	        this.element = null;
	    }
	};

	/**
	 * add/remove the css properties as defined in manager.options.cssProps
	 * @param {Manager} manager
	 * @param {Boolean} add
	 */
	function toggleCssProps(manager, add) {
	    var element = manager.element;
	    if (!element.style) {
	        return;
	    }
	    var prop;
	    each(manager.options.cssProps, function(value, name) {
	        prop = prefixed(element.style, name);
	        if (add) {
	            manager.oldCssProps[prop] = element.style[prop];
	            element.style[prop] = value;
	        } else {
	            element.style[prop] = manager.oldCssProps[prop] || '';
	        }
	    });
	    if (!add) {
	        manager.oldCssProps = {};
	    }
	}

	/**
	 * trigger dom event
	 * @param {String} event
	 * @param {Object} data
	 */
	function triggerDomEvent(event, data) {
	    var gestureEvent = document.createEvent('Event');
	    gestureEvent.initEvent(event, true, true);
	    gestureEvent.gesture = data;
	    data.target.dispatchEvent(gestureEvent);
	}

	assign(Hammer, {
	    INPUT_START: INPUT_START,
	    INPUT_MOVE: INPUT_MOVE,
	    INPUT_END: INPUT_END,
	    INPUT_CANCEL: INPUT_CANCEL,

	    STATE_POSSIBLE: STATE_POSSIBLE,
	    STATE_BEGAN: STATE_BEGAN,
	    STATE_CHANGED: STATE_CHANGED,
	    STATE_ENDED: STATE_ENDED,
	    STATE_RECOGNIZED: STATE_RECOGNIZED,
	    STATE_CANCELLED: STATE_CANCELLED,
	    STATE_FAILED: STATE_FAILED,

	    DIRECTION_NONE: DIRECTION_NONE,
	    DIRECTION_LEFT: DIRECTION_LEFT,
	    DIRECTION_RIGHT: DIRECTION_RIGHT,
	    DIRECTION_UP: DIRECTION_UP,
	    DIRECTION_DOWN: DIRECTION_DOWN,
	    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
	    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
	    DIRECTION_ALL: DIRECTION_ALL,

	    Manager: Manager,
	    Input: Input,
	    TouchAction: TouchAction,

	    TouchInput: TouchInput,
	    MouseInput: MouseInput,
	    PointerEventInput: PointerEventInput,
	    TouchMouseInput: TouchMouseInput,
	    SingleTouchInput: SingleTouchInput,

	    Recognizer: Recognizer,
	    AttrRecognizer: AttrRecognizer,
	    Tap: TapRecognizer,
	    Pan: PanRecognizer,
	    Swipe: SwipeRecognizer,
	    Pinch: PinchRecognizer,
	    Rotate: RotateRecognizer,
	    Press: PressRecognizer,

	    on: addEventListeners,
	    off: removeEventListeners,
	    each: each,
	    merge: merge,
	    extend: extend,
	    assign: assign,
	    inherit: inherit,
	    bindFn: bindFn,
	    prefixed: prefixed
	});

	// this prevents errors when Hammer is loaded in the presence of an AMD
	//  style loader but by script tag, not by the loader.
	var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
	freeGlobal.Hammer = Hammer;

	if (true) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	        return Hammer;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof module != 'undefined' && module.exports) {
	    module.exports = Hammer;
	} else {
	    window[exportName] = Hammer;
	}

	})(window, document, 'Hammer');


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(96);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(98)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./handle.postcss.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./handle.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(97)();
	// imports


	// module
	exports.push([module.id, "/*$PX:      1/16rem;*/\n._handle_8vrrs_5 {\n  width:          13px;\n  height:         13px;\n\n  cursor:         pointer;\n  -webkit-transform:      translateX(0);\n          transform:      translateX(0);\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden\n}\n._handle__inner_8vrrs_1, ._handle__shadow_8vrrs_1 {\n  position:          absolute;\n  left:          0;\n  top:          0;\n  z-index:          1;\n  width:          100%;\n  height:          100%;\n  border-radius:          50%;\n  cursor:          pointer\n  /*transform:      translateZ(0);*/\n  /*backface-visibility: hidden;*/\n}\n._handle__inner_8vrrs_1 {\n  background:          #FFF\n}\n._handle__shadow_8vrrs_1 {\n  box-shadow:          1px 1px 2px black;\n  opacity:          .35;\n  z-index:          0\n}\n._handle_8vrrs_5:hover ._handle__inner_8vrrs_1, ._handle_8vrrs_5:hover ._handle__shadow_8vrrs_1 {\n  -webkit-transform:          scale(1.1);\n          transform:          scale(1.1)\n}\n._handle_8vrrs_5:active ._handle__inner_8vrrs_1 {\n  -webkit-transform:          scale(1.2);\n          transform:          scale(1.2)\n  /*box-shadow:     calc( $PX ) calc( $PX ) calc( 1*$PX ) rgba(0,0,0,.35);*/\n}\n._handle_8vrrs_5:active ._handle__shadow_8vrrs_1 {\n  opacity:          .85;\n  -webkit-transform:          scale(1);\n          transform:          scale(1)\n}\n._handle_8vrrs_5._is-bound_8vrrs_54 {\n  width:          9px;\n  height:          20px;\n  margin-left:          -9px;\n  margin-top:          -10px\n}\n._handle_8vrrs_5._is-bound_8vrrs_54 ._handle__inner_8vrrs_1 {\n  background:          #FF512F\n}\n._handle_8vrrs_5._is-bound_8vrrs_54 ._handle__inner_8vrrs_1:after {\n  content:          '';\n  position:          absolute;\n  right:          0;\n  top:          50%;\n  margin-top:          -20px;\n  width:          1px;\n  height:          40px;\n  background:          #FF512F\n}\n._handle_8vrrs_5._is-bound_8vrrs_54 ._handle__inner_8vrrs_1, ._handle_8vrrs_5._is-bound_8vrrs_54 ._handle__shadow_8vrrs_1 {\n  border-top-left-radius:          3px;\n  border-bottom-left-radius:          3px;\n  border-top-right-radius:          0;\n  border-bottom-right-radius:          0\n}\n._handle_8vrrs_5._is-inversed_8vrrs_82 {\n  margin-left:          0\n}\n._handle_8vrrs_5._is-inversed_8vrrs_82 ._handle__shadow_8vrrs_1 {\n  box-shadow:          -1px 1px 2px black\n}\n._handle_8vrrs_5._is-inversed_8vrrs_82 ._handle__inner_8vrrs_1 {\n  border-top-left-radius:          0;\n  border-bottom-left-radius:          0;\n  border-top-right-radius:          3px;\n  border-bottom-right-radius:          3px\n}\n._handle_8vrrs_5._is-inversed_8vrrs_82 ._handle__inner_8vrrs_1:after {\n  right:          auto;\n  left:          0\n}\n", ""]);

	// exports


/***/ },
/* 97 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 99 */
/***/ function(module, exports) {

	module.exports = {
		"handle": "_handle_8vrrs_5",
		"handle__inner": "_handle__inner_8vrrs_1",
		"handle__shadow": "_handle__shadow_8vrrs_1",
		"is-bound": "_is-bound_8vrrs_54",
		"is-inversed": "_is-inversed_8vrrs_82"
	};

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _classCallCheck2 = __webpack_require__(78);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(79);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _handle = __webpack_require__(93);

	var _handle2 = _interopRequireDefault(_handle);

	var _hammerjs = __webpack_require__(94);

	var _hammerjs2 = _interopRequireDefault(_hammerjs);

	var _ripple = __webpack_require__(101);

	var _ripple2 = _interopRequireDefault(_ripple);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(102);
	var CLASSES = __webpack_require__(104);

	var Track = function (_Handle) {
	  (0, _inherits3.default)(Track, _Handle);

	  function Track() {
	    (0, _classCallCheck3.default)(this, Track);
	    return (0, _possibleConstructorReturn3.default)(this, _Handle.apply(this, arguments));
	  }

	  /*
	    Method to declare _defaults.
	    @private
	    @overrides @ Handle
	  */

	  Track.prototype._declareDefaults = function _declareDefaults() {
	    _Handle.prototype._declareDefaults.call(this);
	    this._defaults.isProgress = true;
	    this._defaults.isRipple = true;
	  };
	  /*
	    Method to render the component.
	    @private
	    @overrides @ Handle
	  */


	  Track.prototype._render = function _render() {
	    _Handle.prototype._render.call(this);
	    if (!this._props.isRipple) {
	      return;
	    }
	    this.ripple = new _ripple2.default({
	      withHold: false,
	      className: CLASSES['track__ripple'],
	      // top:        '50%',
	      parent: this.el
	    });
	  };
	  /*
	    Method to apply shift to the DOMElement.
	    @private
	    @overrides @ Handle.
	    @param {Number} Shift in pixels.x
	  */


	  Track.prototype._applyShift = function _applyShift(shift) {
	    if (!this._props.isProgress) {
	      return;
	    }
	    if (this._props.isInversed) {
	      shift = this._maxWidth - shift;
	    }
	    var transform = 'scaleX( ' + shift + ' ) translateZ(0)';
	    this.trackProgressEl.style.transform = transform;
	    // this.trackProgressEl.style.width = `${shift}px`;
	  };
	  /*
	    Method to add classes on `this.el`.
	    @private
	    @overrides @ Handle.
	  */


	  Track.prototype._addMainClasses = function _addMainClasses() {
	    var p = this._props,
	        classList = this.el.classList;

	    classList.add(CLASSES.track);
	    if (p.isInversed) {
	      classList.add(CLASSES['is-inversed']);
	    }
	    if (p.isBound) {
	      classList.add(CLASSES['is-bound']);
	    }
	    if (p.direction === 'y') {
	      classList.add(CLASSES['is-y']);
	    }
	  };
	  /*
	    Method to add DOM elements on render.
	    @private
	  */


	  Track.prototype._addElements = function _addElements() {
	    var p = this._props;

	    if (p.isProgress) {
	      // progress track
	      var trackP = document.createElement('div');
	      trackP.classList.add('' + CLASSES['track__track-progress']);
	      this.trackProgressEl = trackP;
	      this.el.appendChild(trackP);
	    }
	    // track
	    if (!p.isBound) {
	      var track = document.createElement('div');
	      track.classList.add('' + CLASSES.track__track);
	      this.el.appendChild(track);
	    }
	  };
	  /*
	    Callback for pointer down on main el.
	    @private
	    @param {Object} Original event object.
	    @overrides @ Handle
	  */


	  Track.prototype._pointerDown = function _pointerDown(e) {
	    var p = this._props,
	        x = p.direction === 'x' ? e.layerX : e.layerY;
	    this._isPointerDown = true;

	    if (p.direction === 'y') {
	      x = this._maxWidth - e.layerY;
	    }
	    x = this._props.isInversed && x < 0 ? this._maxWidth + x : x;

	    // if near the snap point - set it to the snap point
	    var progress = this._shiftToProgress(x);
	    progress = Math.abs(p.snapPoint - progress) < p.snapStrength ? p.snapPoint : progress;
	    this.setProgress(progress);

	    p.isRipple && this.ripple._hold(e);
	    this._callIfFunction(p.onSeekStart, e);
	  };

	  return Track;
	}(_handle2.default);

	exports.default = Track;

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _classCallCheck2 = __webpack_require__(78);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(79);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _module = __webpack_require__(90);

	var _module2 = _interopRequireDefault(_module);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// require('css/blocks/handle.postcss.css');
	// let CLASSES = require('css/blocks/handle.postcss.css.json');

	var Ripple = function (_Module) {
	  (0, _inherits3.default)(Ripple, _Module);

	  function Ripple() {
	    (0, _classCallCheck3.default)(this, Ripple);
	    return (0, _possibleConstructorReturn3.default)(this, _Module.apply(this, arguments));
	  }

	  /*
	    Method to declare defaults.
	    @private
	    @overrides @ Module.
	  */

	  Ripple.prototype._declareDefaults = function _declareDefaults() {
	    _Module.prototype._declareDefaults.call(this);
	    this._defaults.withHold = true;
	  };
	  /*
	    Method to render the component.
	    @private
	    @overrides @ Module
	  */


	  Ripple.prototype._render = function _render() {
	    _Module.prototype._render.call(this);
	    this.curtain = document.createElement('div');
	    // this.curtain.style.background = 'rgba(255,255,255,.15)';
	    // this.curtain.style.background = 'yellow';
	    this.curtain.style.position = 'absolute';
	    this.curtain.style.width = '100%';
	    this.curtain.style.height = '100%';
	    this.curtain.style.left = 0;
	    this.curtain.style.top = 0;
	    this.curtain.style.zIndex = 1;

	    this.el.appendChild(this.curtain);

	    this._addRipple();
	  };
	  /*
	    Method to construct ripple object.
	    @private
	  */


	  Ripple.prototype._addRipple = function _addRipple() {
	    var _this2 = this,
	        _ref;

	    this.shape = new mojs.Shape((_ref = {
	      parent: this.el,
	      left: 0, top: this._o.top || 0,
	      // strokeWidth:  10,
	      strokeWidth: { 10: 0 },
	      fill: 'none',
	      stroke: 'hotpink'
	    }, _ref['fill'] = 'hotpink', _ref.fillOpacity = .75, _ref.opacity = { .85: 0 }, _ref.radius = 40, _ref.scale = { 0: 1 }, _ref.isShowEnd = false, _ref.onStart = function onStart() {
	      _this2.isStart = true;
	    }, _ref.onUpdate = this._onUpdate.bind(this), _ref.onComplete = function onComplete() {
	      _this2.isStart = false;
	    }, _ref));
	  };
	  /*
	    Method that is invoked on ripple update.
	    @private
	    @param {Number} Curret progress [0...1].
	  */


	  Ripple.prototype._onUpdate = function _onUpdate(p) {
	    if (!this._props.withHold) {
	      return;
	    }
	    if (p >= .15 && this.isStart && !this.isRelease) {
	      this.isStart = false;
	      this.shape.setSpeed(.02);
	    }
	  };
	  /*
	    Method that should be run on touch serface release.
	    @private
	  */


	  Ripple.prototype._release = function _release() {
	    if (!this._props.withHold) {
	      return;
	    }
	    this.isRelease = true;
	    this.shape.setSpeed(1).play();
	  };
	  /*
	    Method that should be run on touch serface hold.
	    @private
	    @param {Object} Origin event object.
	  */


	  Ripple.prototype._hold = function _hold(e) {
	    var x = e.offsetX != null ? e.offsetX : e.layerX,
	        y = e.offsetY != null ? e.offsetY : e.layerY;

	    this.isRelease = false;
	    this.shape.tune({ x: x, y: y }).replay();
	  };
	  /*
	    Method that should be run on touch serface cancel.
	    @private
	  */


	  Ripple.prototype._cancel = function _cancel() {
	    if (!this._props.withHold) {
	      return;
	    }
	    this.isRelease = true;
	    this.shape.pause().setSpeed(1).playBackward();
	  };

	  return Ripple;
	}(_module2.default);

	exports.default = Ripple;

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(103);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(98)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./track.postcss.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./track.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(97)();
	// imports


	// module
	exports.push([module.id, "/*$PX:      1/16rem;*/\n._track_1dpwb_5 {\n  position:           relative;\n  height:             100%\n\n\n}\n._track__track_1dpwb_1 {\n  position:           absolute;\n  top:           50%;\n  left:           0;\n  width:           100%;\n  height:           1px;\n  background:           #FFF;\n  box-shadow:           1px 1px 1px rgba(0,0,0,.5)\n\n\n}\n._track__track_1dpwb_1:after {\n  content:           '';\n  position:           absolute;\n  left:           0;\n  top:           -20px;\n  width:           100%;\n  height:           40px;\n  cursor:           pointer\n  /*background-color: yellow;*/\n\n\n}\n._track__track-progress_1dpwb_1 {\n  position:           absolute;\n  left:           0;\n  top:           50%;\n  margin-top:           -1px;\n  height:           3px;\n  width:           0.0625em;\n  /*background:       $c-orange;*/\n  background:           #FFFFFF;\n  z-index:           1;\n  -webkit-transform-origin:           left center;\n          transform-origin:           left center\n\n\n}\n._track__track-progress_1dpwb_1:after {\n  /*content:        '';*/\n  position:           absolute;\n  left:           0;\n  top:           -20px;\n  width:           100%;\n  height:           40px;\n  cursor:           pointer;\n  -webkit-backface-visibility:           hidden;\n          backface-visibility:           hidden\n\n\n}\n._track__ripple_1dpwb_1 {\n  position:           absolute;\n  left:           0;\n  top:           0;\n  right:           0;\n  bottom:           0;\n  overflow:           hidden\n  /*background:       black;*/\n  /*z-index:          1;*/\n\n\n}\n._track_1dpwb_5._is-inversed_1dpwb_66 {\n  left:           auto;\n  right:           0\n\n\n}\n._track_1dpwb_5._is-inversed_1dpwb_66 ._track__track-progress_1dpwb_1 {\n  -webkit-transform-origin:           right center;\n          transform-origin:           right center\n\n\n}\n._track_1dpwb_5._is-bound_1dpwb_75 ._track__track-progress_1dpwb_1 {\n  background:           #FF512F\n\n\n}\n._track_1dpwb_5._is-y_1dpwb_79 ._track__track_1dpwb_1 {\n  top:           0;\n  left:           50%;\n  height:           100%;\n  width:           1px\n  /*box-shadow:       calc( $PX ) calc( $PX ) calc( $PX ) rgba(0,0,0,.5); */\n\n\n}\n", ""]);

	// exports


/***/ },
/* 104 */
/***/ function(module, exports) {

	module.exports = {
		"track": "_track_1dpwb_5",
		"track__track": "_track__track_1dpwb_1",
		"track__track-progress": "_track__track-progress_1dpwb_1",
		"track__ripple": "_track__ripple_1dpwb_1",
		"is-inversed": "_is-inversed_1dpwb_66",
		"is-bound": "_is-bound_1dpwb_75",
		"is-y": "_is-y_1dpwb_79"
	};

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(106);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(98)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./slider.postcss.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./slider.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(97)();
	// imports


	// module
	exports.push([module.id, "/*$PX:      1/16rem;*/\n/*@import './handle.postcss.css';*/\n._slider_14t9x_6 {\n  position:           relative;\n  width:              100%;\n  height:             30px\n}\n._slider__inner_14t9x_1 {\n  width:           100%;\n  height:           100%;\n  position:           relative\n}\n._slider_14t9x_6 ._handle_14t9x_17, ._slider_14t9x_6 ._progress-handle_14t9x_18 {\n  z-index:           3;\n  position:           absolute;\n  top:           50%\n}\n._slider_14t9x_6 ._progress-handle_14t9x_18 {\n  left:           0;\n  margin-left:           -6.5px;\n  margin-top:           -6.5px\n}\n._slider_14t9x_6 ._track_14t9x_30 {\n  z-index:           2\n}\n._slider_14t9x_6._is-y_14t9x_34 {\n  width:           30px;\n  height:           100%;\n}\n._slider_14t9x_6._is-y_14t9x_34 ._handle_14t9x_17 {\n  left:           50%;\n  top:           auto;\n  bottom:           0;\n  margin-top:           0;\n  margin-bottom:           -6.5px\n}\n\n", ""]);

	// exports


/***/ },
/* 107 */
/***/ function(module, exports) {

	module.exports = {
		"slider": "_slider_14t9x_6",
		"slider__inner": "_slider__inner_14t9x_1",
		"handle": "_handle_14t9x_17",
		"progress-handle": "_progress-handle_14t9x_18",
		"track": "_track_14t9x_30",
		"is-y": "_is-y_14t9x_34"
	};

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(109);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(98)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./player-slider.postcss.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./player-slider.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(97)();
	// imports


	// module
	exports.push([module.id, "/*$PX:      1/16rem;*/\n/*@import './handle.postcss.css';*/\n._player-slider_1t00q_6 {\n  /*overflow:     hidden;*/\n  height:       40px\n\n}\n._player-slider_1t00q_6 > div {\n  position:       absolute;\n  left:       0;\n  top:       0;\n  z-index:       2\n\n}\n._player-slider_1t00q_6 ._slider_1t00q_15 {\n  z-index:       1;\n  height:       100%\n\n}\n\n", ""]);

	// exports


/***/ },
/* 110 */
/***/ function(module, exports) {

	module.exports = {
		"player-slider": "_player-slider_1t00q_6",
		"slider": "_slider_1t00q_15"
	};

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _classCallCheck2 = __webpack_require__(78);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(79);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _icon = __webpack_require__(112);

	var _icon2 = _interopRequireDefault(_icon);

	var _button = __webpack_require__(116);

	var _button2 = _interopRequireDefault(_button);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(120);
	var CLASSES = __webpack_require__(122);

	var IconButton = function (_Button) {
	  (0, _inherits3.default)(IconButton, _Button);

	  function IconButton() {
	    (0, _classCallCheck3.default)(this, IconButton);
	    return (0, _possibleConstructorReturn3.default)(this, _Button.apply(this, arguments));
	  }

	  /*
	    Method to declare _defaults.
	    @private
	    @overrides @ Button
	  */

	  IconButton.prototype._declareDefaults = function _declareDefaults() {
	    _Button.prototype._declareDefaults.call(this);
	    this._defaults.icon = '';
	    this._defaults.iconClass = '';
	  };
	  /*
	    Initial render method.
	    @private
	    @overrides @ Button
	    @returns this
	  */


	  IconButton.prototype._render = function _render() {
	    _Button.prototype._render.call(this);
	    var p = this._props,
	        className = 'icon-button';
	    this.el.classList.add(CLASSES[className]);

	    var icon = new _icon2.default({
	      shape: p.icon,
	      parent: this.el,
	      className: [CLASSES['icon'], p.iconClass],
	      prefix: p.prefix
	    });
	  };

	  return IconButton;
	}(_button2.default);

	exports.default = IconButton;

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _classCallCheck2 = __webpack_require__(78);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(79);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _module = __webpack_require__(90);

	var _module2 = _interopRequireDefault(_module);

	var _hammerjs = __webpack_require__(94);

	var _hammerjs2 = _interopRequireDefault(_hammerjs);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(113);
	var CLASSES = __webpack_require__(115);

	var Icon = function (_Module) {
	  (0, _inherits3.default)(Icon, _Module);

	  function Icon() {
	    (0, _classCallCheck3.default)(this, Icon);
	    return (0, _possibleConstructorReturn3.default)(this, _Module.apply(this, arguments));
	  }

	  /*
	    Method to declare _defaults.
	    @private
	    @overrides @ Module
	  */

	  Icon.prototype._declareDefaults = function _declareDefaults() {
	    _Module.prototype._declareDefaults.call(this);
	    this._defaults.shape = '';
	    this._defaults.size = 'x1';
	    this.NS = 'http://www.w3.org/2000/svg';
	  };
	  /*
	    Initial render method.
	    @private
	    @overrides @ Module
	    @returns this
	  */


	  Icon.prototype._render = function _render() {
	    this._addMainElement();
	    this.el.classList.add(CLASSES.icon);
	    this.el.classList.add(CLASSES['is-' + this._props.size]);
	    this.el.setAttribute('data-component', 'icon');
	    this._renderIcon();
	  };
	  /*
	    Method to render svg icon into the el.
	    @private
	  */


	  Icon.prototype._renderIcon = function _renderIcon() {
	    var p = this._props,
	        svg = document.createElementNS(this.NS, 'svg'),
	        content = '<use xlink:href="#' + p.prefix + p.shape + '-icon-shape" />';
	    svg.setAttribute('viewBox', '0 0 32 32');
	    this._addSVGHtml(svg, content);
	    this.el.appendChild(svg);
	  };
	  /*
	    Add HTML to SVG element.
	    @private
	    @param {Object} SVG node.
	    @param {String} SVG content to add.
	  */


	  Icon.prototype._addSVGHtml = function _addSVGHtml(svg, content) {
	    var receptacle = this._createElement('div'),
	        svgfragment = '<svg> ' + content + ' </svg>';
	    receptacle.innerHTML = svgfragment;
	    var nodes = Array.prototype.slice.call(receptacle.childNodes[0].childNodes);
	    for (var i = 0; i < nodes.length; i++) {
	      svg.appendChild(nodes[i]);
	    }
	  };

	  return Icon;
	}(_module2.default);

	exports.default = Icon;

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(114);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(98)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./icon.postcss.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./icon.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(97)();
	// imports


	// module
	exports.push([module.id, "/*$PX:      1/16rem;*/\n._icon_y498a_5 {\n  position:     relative;\n  width:        12px;\n  height:       12px;\n  cursor:       pointer\n}\n._icon_y498a_5 > svg {\n  position:     absolute;\n  left:     0;\n  top:     0;\n  width:     100%;\n  height:     100%;\n  fill:     inherit\n}\n._icon_y498a_5 > svg > use {\n  fill:     inherit\n}\n._icon_y498a_5:after {\n  content:     '';\n  position:     absolute;\n  left:     0;\n  top:     0;\n  right:     0;\n  bottom:     0;\n  z-index:     1\n}\n._icon_y498a_5._is-x2_y498a_33 {\n  width:     16px;\n  height:     16px\n}\n\n", ""]);

	// exports


/***/ },
/* 115 */
/***/ function(module, exports) {

	module.exports = {
		"icon": "_icon_y498a_5",
		"is-x2": "_is-x2_y498a_33"
	};

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _classCallCheck2 = __webpack_require__(78);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(79);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _module = __webpack_require__(90);

	var _module2 = _interopRequireDefault(_module);

	var _hammerjs = __webpack_require__(94);

	var _hammerjs2 = _interopRequireDefault(_hammerjs);

	var _ripple = __webpack_require__(101);

	var _ripple2 = _interopRequireDefault(_ripple);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(117);
	var CLASSES = __webpack_require__(119);

	var Button = function (_Module) {
	  (0, _inherits3.default)(Button, _Module);

	  function Button() {
	    (0, _classCallCheck3.default)(this, Button);
	    return (0, _possibleConstructorReturn3.default)(this, _Module.apply(this, arguments));
	  }

	  /*
	    Method to declare defaults for the module.
	    @private
	    @overrides @ Module
	  */

	  Button.prototype._declareDefaults = function _declareDefaults() {
	    _Module.prototype._declareDefaults.call(this);
	    this._defaults.link = null;
	    this._defaults.title = '';
	    this._defaults.target = null;
	    this._defaults.onPointerDown = null;
	    this._defaults.onPointerUp = null;
	    this._defaults.onDoubleTap = null;
	  };
	  /*
	    Initial render method.
	    @private
	    @overrides @ Module
	  */


	  Button.prototype._render = function _render() {
	    var p = this._props,
	        className = 'button',
	        tagName = p.link != null ? 'a' : 'div';

	    this._addMainElement(tagName);
	    this.el.classList.add(CLASSES[className]);
	    this.el.setAttribute('title', p.title);
	    p.link && this.el.setAttribute('href', p.link);
	    p.link && p.target && this.el.setAttribute('target', p.target);
	    this._addListeners();

	    this._createRipple();
	  };
	  /*
	    Method to create ripple.
	    @private
	  */


	  Button.prototype._createRipple = function _createRipple() {
	    this.ripple = new _ripple2.default({
	      className: CLASSES['button__ripple'],
	      parent: this.el
	    });
	  };
	  /*
	    Method to add event listeners to the icon.
	    @private
	  */


	  Button.prototype._addListeners = function _addListeners() {
	    this._addPointerDownEvent(this.el, this._pointerDown.bind(this));
	    this._addPointerUpEvent(this.el, this._pointerUp.bind(this));
	    this._addPointerUpEvent(document, this._pointerCancel.bind(this));
	    (0, _hammerjs2.default)(this.el).on('doubletap', this._doubleTap.bind(this));
	  };
	  /*
	    Method to invoke onPointerDown callback if exist.
	    @private
	    @param {Object} Original event object.
	  */


	  Button.prototype._pointerDown = function _pointerDown(e) {
	    this.wasTouched = true;
	    this._callIfFunction(this._props.onPointerDown);
	    this.ripple._hold(e);
	  };
	  /*
	    Method to invoke onPointerUp callback if exist.
	    @private
	    @param {Object} Original event object.
	  */


	  Button.prototype._pointerUp = function _pointerUp(e) {
	    if (!this.wasTouched) {
	      e.stopPropagation();return;
	    }

	    this.wasTouched = false;
	    this._callIfFunction(this._props.onPointerUp);
	    this.ripple._release();
	    e.preventDefault();
	    return false;
	  };
	  /*
	    Method to invoke onPointerCancel callback if exist.
	    @private
	    @param {Object} Original event object.
	  */


	  Button.prototype._pointerCancel = function _pointerCancel(e) {
	    if (!this.wasTouched) {
	      return;
	    };
	    this.wasTouched = false;
	    this.ripple._cancel();
	  };
	  /*
	    Method to invoke onDoubleTap callback if exist.
	    @private
	    @param {Object} Original event object.
	  */


	  Button.prototype._doubleTap = function _doubleTap(e) {
	    this._callIfFunction(this._props.onDoubleTap);
	  };

	  return Button;
	}(_module2.default);

	exports.default = Button;

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(118);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(98)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./button.postcss.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./button.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(97)();
	// imports


	// module
	exports.push([module.id, "/*$PX:      1/16rem;*/\n\n._button_r3ni6_4 {\n  position:   relative;\n  width:      35px;\n  height:     40px;\n  cursor:     pointer;\n  fill:       #FFF;\n  display:    inline-block\n}\n\n._button__ripple_r3ni6_1 {\n  position:   absolute;\n  left:   0;\n  right:   0;\n  top:   0;\n  bottom:   0;\n  z-index:   5;\n  overflow:   hidden\n}\n\n._button__ripple_r3ni6_1:after {\n  content:   \"\";\n  position:   absolute;\n  left:   0;\n  right:   0;\n  top:   0;\n  bottom:   0;\n  z-index:   1;\n  cursor:   pointer\n}\n\n._button_r3ni6_4:hover {\n  opacity:   .85\n}\n\n._button_r3ni6_4:active {\n  opacity:   1\n}\n\n", ""]);

	// exports


/***/ },
/* 119 */
/***/ function(module, exports) {

	module.exports = {
		"button": "_button_r3ni6_4",
		"button__ripple": "_button__ripple_r3ni6_1"
	};

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(121);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(98)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./icon-button.postcss.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./icon-button.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(97)();
	// imports


	// module
	exports.push([module.id, "/*$PX:      1/16rem;*/\n\n._icon-button_1yshr_4 {\n  /* styles */\n}\n\n._icon-button_1yshr_4 ._icon_1yshr_4 {\n\n  position: absolute;\n\n  left: 50%;\n\n  top: 50%;\n\n  -webkit-transform: translate( -50%, -50% );\n\n          transform: translate( -50%, -50% )\n}\n\n", ""]);

	// exports


/***/ },
/* 122 */
/***/ function(module, exports) {

	module.exports = {
		"icon-button": "_icon-button_1yshr_4",
		"icon": "_icon_1yshr_4"
	};

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _classCallCheck2 = __webpack_require__(78);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(79);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _module = __webpack_require__(90);

	var _module2 = _interopRequireDefault(_module);

	var _labelButton = __webpack_require__(124);

	var _labelButton2 = _interopRequireDefault(_labelButton);

	var _slider = __webpack_require__(92);

	var _slider2 = _interopRequireDefault(_slider);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(132);
	var CLASSES = __webpack_require__(134);

	var SpeedControl = function (_Module) {
	  (0, _inherits3.default)(SpeedControl, _Module);

	  function SpeedControl() {
	    (0, _classCallCheck3.default)(this, SpeedControl);
	    return (0, _possibleConstructorReturn3.default)(this, _Module.apply(this, arguments));
	  }

	  /*
	    Method to declare defaults for the module.
	    @private
	    @overrides @ Module
	  */

	  SpeedControl.prototype._declareDefaults = function _declareDefaults() {
	    _Module.prototype._declareDefaults.call(this);
	    this._defaults.isOn = false;
	    this._defaults.speed = 1;
	    this._defaults.progress = .5;
	    this._defaults.onSpeedChange = null;
	    this._defaults.onIsSpeed = null;
	  };
	  /*
	    Method to reset speed to 1x.
	    @public
	    @returns this
	  */


	  SpeedControl.prototype.reset = function reset() {
	    this._onDoubleTap();
	  };
	  /*
	    Method to decrease speed value.
	    @public
	    @param {Number} Value that the slider should be decreased by.
	    @returns this.
	  */


	  SpeedControl.prototype.decreaseSpeed = function decreaseSpeed() {
	    var amount = arguments.length <= 0 || arguments[0] === undefined ? 0.01 : arguments[0];

	    var p = this._props;
	    p.progress -= amount;
	    p.progress = p.progress < 0 ? 0 : p.progress;
	    this.slider.setProgress(p.progress);
	    return this;
	  };
	  /*
	    Method to inclease speed value.
	    @public
	    @param {Number} Value that the slider should be increased by.
	    @returns this.
	  */


	  SpeedControl.prototype.increaseSpeed = function increaseSpeed() {
	    var amount = arguments.length <= 0 || arguments[0] === undefined ? 0.01 : arguments[0];

	    var p = this._props;
	    p.progress += amount;
	    p.progress = p.progress > 1 ? 1 : p.progress;
	    this.slider.setProgress(p.progress);
	    return this;
	  };
	  /*
	    Initial render method.
	    @private
	    @overrides @ Module
	  */


	  SpeedControl.prototype._render = function _render() {
	    var p = this._props,
	        className = 'speed-control',
	        slider = this._createElement('div'),
	        sliderIn = this._createElement('div'),
	        icon = this._createElement('div');

	    this._addMainElement();
	    this.el.classList.add(CLASSES[className]);
	    // places for child components
	    slider.classList.add(CLASSES[className + '__slider']);
	    // sliderIn.classList.add( CLASSES[ `${ className }__slider-inner` ] );
	    // slider.appendChild( sliderIn );
	    this.el.appendChild(slider);
	    // child components
	    this.labelButton = new _labelButton2.default({
	      parent: this.el,
	      isOn: p.isOn,
	      className: CLASSES[className + '__icon'],
	      onStateChange: this._onButtonStateChange.bind(this),
	      onDoubleTap: this._onDoubleTap.bind(this)
	    });
	    this.slider = new _slider2.default({
	      parent: slider,
	      isProgress: false,
	      direction: 'y',
	      onProgress: this._onSliderProgress.bind(this),
	      snapPoint: .5,
	      snapStrength: .05
	    });

	    this.slider.setProgress(this._speedToProgress(this._props.speed));
	  };
	  /*
	    Method that is invoked on slider progress.
	    @private
	    @param {Number} Progress of the slider.
	  */


	  SpeedControl.prototype._onSliderProgress = function _onSliderProgress(p) {
	    // progress should be at least 0.01
	    p = Math.max(p, 0.0001);

	    var props = this._props,
	        args = [];

	    this._callIfFunction(props.onSpeedChange, this._progressToSpeed(p), p);
	    this.labelButton.setLabelText(this._progressToLabel(props.progress = p));
	  };
	  /*
	    Method that is invoked on button state change.
	    @private
	    @param {Boolean} State of the button switch.
	  */


	  SpeedControl.prototype._onButtonStateChange = function _onButtonStateChange(isOn) {
	    var method = isOn ? 'add' : 'remove';
	    this.el.classList[method](CLASSES['is-on']);
	    this._callIfFunction(this._props.onIsSpeed, isOn);
	  };
	  /*
	    Method to recalc progress to label string.
	    @private
	    @param {Number} Progress [0...1].
	    @returns {String} String for a label to set.
	  */


	  SpeedControl.prototype._progressToLabel = function _progressToLabel(progress) {
	    var text = this._progressToSpeed(progress).toFixed(2),
	        zeros = /\.+00$/;

	    if (text.match(zeros)) {
	      text = text.replace(zeros, '');
	    }

	    return text + 'x';
	  };
	  /*
	    Method to recalc progress to speed.
	    @private
	    @param   {Number} Progress [0...1].
	    @returns {Number} Speed [0...10].
	  */


	  SpeedControl.prototype._progressToSpeed = function _progressToSpeed(progress) {
	    var speed = progress;
	    if (progress < .5) {
	      speed = 2 * progress;
	    }
	    if (progress === .5) {
	      speed = 1;
	    }
	    if (progress > .5) {
	      progress -= .5;
	      speed = 1 + progress * 18;
	      // console.log( speed/10, mojs.easing.cubic.out( speed/10 ) );
	      // console.log( .5 + ( speed - 1 ) / 18 );
	    }
	    return speed;
	  };
	  /*
	    Method to recalc progress to speed.
	    @private
	    @param   {Number} Progress [0...1].
	    @returns {Number} Speed [0...10].
	  */


	  SpeedControl.prototype._speedToProgress = function _speedToProgress(speed) {
	    var progress = speed;
	    if (speed < 1) {
	      progress = speed / 2;
	    }
	    if (speed === 1) {
	      progress = .5;
	    }
	    if (speed > 1) {
	      progress = .5 + (speed - 1) / 18;
	    }
	    return progress;
	  };
	  /*
	    Method that is invoked on double button tap.
	    @private
	  */


	  SpeedControl.prototype._onDoubleTap = function _onDoubleTap() {
	    this.slider.setProgress(.5);
	    this.labelButton.off();
	  };

	  return SpeedControl;
	}(_module2.default);

	exports.default = SpeedControl;

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _classCallCheck2 = __webpack_require__(78);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(79);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _buttonSwitch = __webpack_require__(125);

	var _buttonSwitch2 = _interopRequireDefault(_buttonSwitch);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(129);
	var CLASSES = __webpack_require__(131);

	var LabelButton = function (_ButtonSwitch) {
	  (0, _inherits3.default)(LabelButton, _ButtonSwitch);

	  function LabelButton() {
	    (0, _classCallCheck3.default)(this, LabelButton);
	    return (0, _possibleConstructorReturn3.default)(this, _ButtonSwitch.apply(this, arguments));
	  }

	  /*
	    Method to declare defaults.
	    @private
	    @overrides @ OpacitySwitch
	  */

	  LabelButton.prototype._declareDefaults = function _declareDefaults() {
	    _ButtonSwitch.prototype._declareDefaults.call(this);
	    this._defaults.title = 'speed (reset: alt + 1)';
	  };
	  /*
	    Method to populate the label with progress text.
	    @public
	    @param {String} Text to set.
	  */


	  LabelButton.prototype.setLabelText = function setLabelText(text) {
	    this.label.innerHTML = text;
	  };

	  /*
	    ^  PUBLIC  ^
	    v PPRIVATE v
	  */

	  /*
	    Initial render method.
	    @private
	    @overrides @ Button
	    @returns this
	  */


	  LabelButton.prototype._render = function _render() {
	    _ButtonSwitch.prototype._render.call(this);
	    this._addClass(this.el, CLASSES['label-button']);
	    this._addLabel();
	    // this.setLabelText( this._props.progress );
	  };
	  /*
	    Method to add label to the `el`.
	    @private
	  */


	  LabelButton.prototype._addLabel = function _addLabel() {
	    this.label = this._createElement('div');
	    this.label.classList.add(CLASSES['label-button__label']);
	    this.el.appendChild(this.label);
	  };

	  return LabelButton;
	}(_buttonSwitch2.default);

	exports.default = LabelButton;

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _classCallCheck2 = __webpack_require__(78);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(79);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _button = __webpack_require__(116);

	var _button2 = _interopRequireDefault(_button);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(126);
	var CLASSES = __webpack_require__(128);

	var ButtonSwitch = function (_Button) {
	  (0, _inherits3.default)(ButtonSwitch, _Button);

	  function ButtonSwitch() {
	    (0, _classCallCheck3.default)(this, ButtonSwitch);
	    return (0, _possibleConstructorReturn3.default)(this, _Button.apply(this, arguments));
	  }

	  /*
	    Method to declare _defaults.
	    @private
	    @overrides @ Button
	  */

	  ButtonSwitch.prototype._declareDefaults = function _declareDefaults() {
	    _Button.prototype._declareDefaults.call(this);
	    this._defaults.isOn = false;
	    this._defaults.onStateChange = null;
	  };
	  /*
	    Method to set the state to `true`.
	    @public
	    @param {Boolean} If should invoke callback.
	  */


	  ButtonSwitch.prototype.on = function on() {
	    var isCallback = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

	    // set to true because the next step is toggle
	    this._props.isOn = true;
	    this._reactOnStateChange(isCallback);
	  };
	  /*
	    Method to set the state to `false`.
	    @public
	    @param {Boolean} If should invoke callback.
	  */


	  ButtonSwitch.prototype.off = function off() {
	    var isCallback = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

	    // set to true because the next step is toggle
	    this._props.isOn = false;
	    this._reactOnStateChange(isCallback);
	  };

	  // ---

	  /*
	    Initial render method.
	    @private
	    @overrides @ Button
	    @returns this
	  */


	  ButtonSwitch.prototype._render = function _render() {
	    _Button.prototype._render.call(this);
	    this.el.classList.add(CLASSES['button-switch']);
	    this._setState();
	    this._reactOnStateChange();
	  };
	  /*
	    Method to invoke onPointerUp callback if excist.
	    @private
	    @overrides @ Button
	    @param {Object} Original event object.
	  */


	  ButtonSwitch.prototype._pointerUp = function _pointerUp(e) {
	    if (!this.wasTouched) {
	      this.wasTouched = false;
	      e.stopPropagation();
	      return;
	    }
	    this._changeState();
	    _Button.prototype._pointerUp.call(this, e);
	  };
	  /*
	    Method to switch icons.
	    @private
	  */


	  ButtonSwitch.prototype._changeState = function _changeState() {
	    this._props.isOn = !this._props.isOn;
	    this._reactOnStateChange();
	  };
	  /*
	    Method to react on state change.
	    @private
	    @param {Boolean} If should invoke callback.
	  */


	  ButtonSwitch.prototype._reactOnStateChange = function _reactOnStateChange() {
	    var isCallback = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

	    if (isCallback) {
	      this._callIfFunction(this._props.onStateChange, this._props.isOn);
	    }
	    this._setState();
	  };
	  /*
	    Method that have been called on switch state change.
	    @private
	  */


	  ButtonSwitch.prototype._setState = function _setState() {
	    // console.log('change');
	  };

	  return ButtonSwitch;
	}(_button2.default);

	exports.default = ButtonSwitch;

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(127);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(98)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./button-switch.postcss.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./button-switch.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(97)();
	// imports


	// module
	exports.push([module.id, "/*$PX:      1/16rem;*/\n\n._button-switch_1g5lg_4 {\n  position:     relative;\n  display:      inline-block\n}\n\n._button-switch_1g5lg_4 > ._icon_1g5lg_8 {\n  position:     absolute\n}\n\n._button-switch_1g5lg_4:after {\n  content:     \"\";\n  position:     absolute;\n  left:     0;\n  top:     0;\n  right:     0;\n  bottom:     0;\n  z-index:     1\n}\n\n", ""]);

	// exports


/***/ },
/* 128 */
/***/ function(module, exports) {

	module.exports = {
		"button-switch": "_button-switch_1g5lg_4",
		"icon": "_icon_1g5lg_8"
	};

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(130);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(98)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./label-button.postcss.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./label-button.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(97)();
	// imports


	// module
	exports.push([module.id, "/*$PX:      1/16rem;*/\n\n._label-button_1cxps_4 {\n  font-family:        Arial, sans-serif;\n  font-size:          9px;\n  letter-spacing:     0.5px;\n  color:              white\n}\n\n._label-button__label_1cxps_1 {\n  position:        absolute;\n  left:        50%;\n  top:        50%;\n  -webkit-transform:        translate( -50%, -50% );\n          transform:        translate( -50%, -50% )\n}\n", ""]);

	// exports


/***/ },
/* 131 */
/***/ function(module, exports) {

	module.exports = {
		"label-button": "_label-button_1cxps_4",
		"label-button__label": "_label-button__label_1cxps_1"
	};

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(133);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(98)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./speed-control.postcss.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./speed-control.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(97)();
	// imports


	// module
	exports.push([module.id, "/*$PX:      1/16rem;*/\n\n._speed-control_1mxm4_4 {\n  position:       relative;\n  display:        inline-block;\n  height:         40px\n}\n\n._speed-control__slider_1mxm4_1 {\n  position:       absolute;\n  bottom:       100%;\n  left:       3px;\n  width:       30px;\n  height:       120px;\n  padding-top:       20px;\n  padding-bottom:       20px;\n  border-top-right-radius:       3px;\n  border-top-left-radius:       3px;\n  background:       #3A0839;\n  -webkit-transform:       translate(-99999999px, -99999999px);\n          transform:       translate(-99999999px, -99999999px);\n  -webkit-backface-visibility:       hidden;\n          backface-visibility:       hidden\n}\n\n._speed-control__slider_1mxm4_1:before, ._speed-control__slider_1mxm4_1:after {\n  content:       '';\n  position:       absolute;\n  top:       50%;\n  width:       3px;\n  height:       1px;\n  background:       #FFF\n}\n\n._speed-control__slider_1mxm4_1:before {\n  left:       5px\n}\n\n._speed-control__slider_1mxm4_1:after {\n  right:       5px\n}\n\n._speed-control__button_1mxm4_1 {\n  border:       1px solid cyan\n}\n\n._speed-control_1mxm4_4._is-on_1mxm4_49 ._speed-control__slider_1mxm4_1 {\n  -webkit-transform:       translate(0, 0);\n          transform:       translate(0, 0)\n}\n", ""]);

	// exports


/***/ },
/* 134 */
/***/ function(module, exports) {

	module.exports = {
		"speed-control": "_speed-control_1mxm4_4",
		"speed-control__slider": "_speed-control__slider_1mxm4_1",
		"speed-control__button": "_speed-control__button_1mxm4_1",
		"is-on": "_is-on_1mxm4_49"
	};

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _classCallCheck2 = __webpack_require__(78);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(79);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _iconFork = __webpack_require__(136);

	var _iconFork2 = _interopRequireDefault(_iconFork);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(140);
	var CLASSES = __webpack_require__(142);
	// PLAYER_BTN_CLASSES = require('css/blocks/player-button.postcss.css.json');

	var PlayButton = function (_IconFork) {
	  (0, _inherits3.default)(PlayButton, _IconFork);

	  function PlayButton() {
	    (0, _classCallCheck3.default)(this, PlayButton);
	    return (0, _possibleConstructorReturn3.default)(this, _IconFork.apply(this, arguments));
	  }

	  /*
	    Method to declare defaults on the module.
	    @private
	    @overrides @ ButtonSwitch
	  */

	  PlayButton.prototype._declareDefaults = function _declareDefaults() {
	    _IconFork.prototype._declareDefaults.call(this);
	    this._defaults.icon1 = 'pause';
	    this._defaults.icon2 = 'play';
	    this._defaults.title = 'play/pause (alt + p)';
	  };
	  /*
	    Method to render the module.
	    @private
	  */


	  PlayButton.prototype._render = function _render() {
	    _IconFork.prototype._render.call(this);
	    this._addClass(this.el, CLASSES['play-button']);
	  };

	  return PlayButton;
	}(_iconFork2.default);

	exports.default = PlayButton;

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _classCallCheck2 = __webpack_require__(78);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(79);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _buttonSwitch = __webpack_require__(125);

	var _buttonSwitch2 = _interopRequireDefault(_buttonSwitch);

	var _icon = __webpack_require__(112);

	var _icon2 = _interopRequireDefault(_icon);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// import HammerJS from 'hammerjs'

	__webpack_require__(137);
	var CLASSES = __webpack_require__(139);

	var IconFork = function (_ButtonSwitch) {
	  (0, _inherits3.default)(IconFork, _ButtonSwitch);

	  function IconFork() {
	    (0, _classCallCheck3.default)(this, IconFork);
	    return (0, _possibleConstructorReturn3.default)(this, _ButtonSwitch.apply(this, arguments));
	  }

	  /*
	    Initial render method.
	    @private
	    @overrides @ Icon
	    @returns this
	  */

	  IconFork.prototype._render = function _render() {
	    _ButtonSwitch.prototype._render.call(this);
	    this.el.classList.add(CLASSES['icon-fork']);
	    var p = this._props,
	        prefix = p.prefix,
	        parent = this.el,
	        className = CLASSES.icon;

	    this.icon1 = new _icon2.default({ shape: p.icon1, prefix: prefix, parent: parent, className: className });
	    this.icon2 = new _icon2.default({ shape: p.icon2, prefix: prefix, parent: parent, className: className });
	  };
	  /*
	    Method that should be called on state change.
	    @private
	    @override @ IconSwitch
	  */


	  IconFork.prototype._setState = function _setState() {
	    var p = this._props,
	        classList = this.el.classList,
	        method = p.isOn ? 'add' : 'remove';

	    classList[method](CLASSES['is-on']);
	  };

	  return IconFork;
	}(_buttonSwitch2.default);

	exports.default = IconFork;

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(138);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(98)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./icon-fork.postcss.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./icon-fork.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(97)();
	// imports


	// module
	exports.push([module.id, "/*$PX:      1/16rem;*/\n\n._icon-fork_csg7t_4 {\n}\n\n._icon-fork_csg7t_4 > ._icon_csg7t_4 {\n\n    /*position:   absolute;*/\n\n    opacity: 0;\n\n    position: absolute;\n\n    top: 50%;\n\n    left: 50%;\n\n    -webkit-transform: translate( -50%, -50% );\n\n            transform: translate( -50%, -50% )\n}\n\n._icon-fork_csg7t_4 > ._icon_csg7t_4:nth-of-type(3) {\n\n    position: absolute;\n\n    opacity: 1\n}\n\n._icon-fork_csg7t_4._is-on_csg7t_18 > ._icon_csg7t_4:nth-of-type(2) {\n\n    opacity: 1\n}\n\n._icon-fork_csg7t_4._is-on_csg7t_18 > ._icon_csg7t_4:nth-of-type(3) {\n\n    opacity: 0\n}\n\n", ""]);

	// exports


/***/ },
/* 139 */
/***/ function(module, exports) {

	module.exports = {
		"icon-fork": "_icon-fork_csg7t_4",
		"icon": "_icon_csg7t_4",
		"is-on": "_is-on_csg7t_18"
	};

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(141);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(98)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./play-button.postcss.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./play-button.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(97)();
	// imports


	// module
	exports.push([module.id, "/*$PX:      1/16rem;*/\n\n._play-button_16uj5_4 {\n  /* styles */\n}\n", ""]);

	// exports


/***/ },
/* 142 */
/***/ function(module, exports) {

	module.exports = {
		"play-button": "_play-button_16uj5_4"
	};

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _classCallCheck2 = __webpack_require__(78);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(79);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _iconButton = __webpack_require__(111);

	var _iconButton2 = _interopRequireDefault(_iconButton);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(144);
	var CLASSES = __webpack_require__(146);

	var StopButton = function (_IconButton) {
	  (0, _inherits3.default)(StopButton, _IconButton);

	  function StopButton() {
	    (0, _classCallCheck3.default)(this, StopButton);
	    return (0, _possibleConstructorReturn3.default)(this, _IconButton.apply(this, arguments));
	  }

	  StopButton.prototype._declareDefaults = function _declareDefaults() {
	    _IconButton.prototype._declareDefaults.call(this);
	    this._defaults.icon = 'stop';
	    this._defaults.title = 'stop (alt + s)';
	  };
	  /*
	    Initial render method.
	    @private
	    @overrides @ Button
	    @returns this
	  */


	  StopButton.prototype._render = function _render() {
	    _IconButton.prototype._render.call(this);
	    this._addClass(this.el, CLASSES['stop-button']);
	  };

	  return StopButton;
	}(_iconButton2.default);

	exports.default = StopButton;

/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(145);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(98)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./stop-button.postcss.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./stop-button.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(97)();
	// imports


	// module
	exports.push([module.id, "/*$PX:      1/16rem;*/\n\n._stop-button_lpa7l_4 {\n  /* styles */\n}\n", ""]);

	// exports


/***/ },
/* 146 */
/***/ function(module, exports) {

	module.exports = {
		"stop-button": "_stop-button_lpa7l_4"
	};

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _classCallCheck2 = __webpack_require__(78);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(79);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _opacitySwitch = __webpack_require__(148);

	var _opacitySwitch2 = _interopRequireDefault(_opacitySwitch);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(152);
	var CLASSES = __webpack_require__(154);

	var RepeatButton = function (_OpacitySwitch) {
	  (0, _inherits3.default)(RepeatButton, _OpacitySwitch);

	  function RepeatButton() {
	    (0, _classCallCheck3.default)(this, RepeatButton);
	    return (0, _possibleConstructorReturn3.default)(this, _OpacitySwitch.apply(this, arguments));
	  }

	  /*
	    Method to declare defaults.
	    @private
	    @overrides @ OpacitySwitch
	  */

	  RepeatButton.prototype._declareDefaults = function _declareDefaults() {
	    _OpacitySwitch.prototype._declareDefaults.call(this);
	    this._defaults.icon = 'repeat';
	    this._defaults.iconSize = 'x2';
	    this._defaults.title = 'repeat (alt + r)';
	  };
	  /*
	    Initial render method.
	    @private
	    @overrides @ Button
	    @returns this
	  */


	  RepeatButton.prototype._render = function _render() {
	    _OpacitySwitch.prototype._render.call(this);
	    this._addClass(this.el, CLASSES['repeat-button']);
	  };

	  return RepeatButton;
	}(_opacitySwitch2.default);

	exports.default = RepeatButton;

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _classCallCheck2 = __webpack_require__(78);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(79);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _icon = __webpack_require__(112);

	var _icon2 = _interopRequireDefault(_icon);

	var _buttonSwitch = __webpack_require__(125);

	var _buttonSwitch2 = _interopRequireDefault(_buttonSwitch);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(149);
	var CLASSES = __webpack_require__(151);

	var OpacitySwitch = function (_ButtonSwitch) {
	  (0, _inherits3.default)(OpacitySwitch, _ButtonSwitch);

	  function OpacitySwitch() {
	    (0, _classCallCheck3.default)(this, OpacitySwitch);
	    return (0, _possibleConstructorReturn3.default)(this, _ButtonSwitch.apply(this, arguments));
	  }

	  /*
	    Method to decalre defaults.
	    @private
	    @overrides @ ButtonSwitch
	  */

	  OpacitySwitch.prototype._declareDefaults = function _declareDefaults() {
	    _ButtonSwitch.prototype._declareDefaults.call(this);
	    this._defaults.icon = '';
	    this._defaults.iconSize = '';
	  };
	  /*
	    Method to render the module.
	    @private
	    @overrides @ ButtonSwitch
	  */


	  OpacitySwitch.prototype._render = function _render() {
	    _ButtonSwitch.prototype._render.call(this);
	    this.el.classList.add(CLASSES['opacity-switch']);

	    var p = this._props,
	        icon = new _icon2.default({
	      parent: this.el,
	      shape: p.icon,
	      size: p.iconSize,
	      className: CLASSES['icon'],
	      prefix: p.prefix
	    });
	    this.el.appendChild(icon.el);
	  };
	  /*
	    Method to react to switch state change.
	    @private
	    @overrides @ ButtonSwitch
	  */


	  OpacitySwitch.prototype._setState = function _setState() {
	    var method = this._props.isOn ? 'add' : 'remove';
	    this.el.classList[method](CLASSES['is-on']);
	  };

	  return OpacitySwitch;
	}(_buttonSwitch2.default);

	exports.default = OpacitySwitch;

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(150);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(98)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./opacity-switch.postcss.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./opacity-switch.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(97)();
	// imports


	// module
	exports.push([module.id, "/*$PX:      1/16rem;*/\n\n._opacity-switch_17z5s_4 {\n  opacity:      .5;\n\n\n\n\n}\n\n._opacity-switch_17z5s_4 ._icon_17z5s_6 {\n  position:   absolute;\n  left:       50%;\n  top:        50%;\n  -webkit-transform:  translate(-50%, -50%);\n          transform:  translate(-50%, -50%);\n\n\n\n\n}\n\n._opacity-switch_17z5s_4:hover {\n  opacity:      .4;\n\n\n\n\n}\n\n._opacity-switch_17z5s_4._is-on_17z5s_15 {\n  opacity:      1;\n\n\n\n\n}\n\n._opacity-switch_17z5s_4._is-on_17z5s_15:hover {\n  opacity:      .85;\n\n\n\n\n}\n", ""]);

	// exports


/***/ },
/* 151 */
/***/ function(module, exports) {

	module.exports = {
		"opacity-switch": "_opacity-switch_17z5s_4",
		"icon": "_icon_17z5s_6",
		"is-on": "_is-on_17z5s_15"
	};

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(153);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(98)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./repeat-button.postcss.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./repeat-button.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(97)();
	// imports


	// module
	exports.push([module.id, "/*$PX:      1/16rem;*/\n\n._repeat-button_1ce74_4 {\n  /* styles */\n}\n\n", ""]);

	// exports


/***/ },
/* 154 */
/***/ function(module, exports) {

	module.exports = {
		"repeat-button": "_repeat-button_1ce74_4"
	};

/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _classCallCheck2 = __webpack_require__(78);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(79);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _repeatButton = __webpack_require__(147);

	var _repeatButton2 = _interopRequireDefault(_repeatButton);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// require('css/blocks/repeat-button.postcss.css');
	// let CLASSES = require('css/blocks/repeat-button.postcss.css.json');

	var BoundsButton = function (_RepeatButton) {
	  (0, _inherits3.default)(BoundsButton, _RepeatButton);

	  function BoundsButton() {
	    (0, _classCallCheck3.default)(this, BoundsButton);
	    return (0, _possibleConstructorReturn3.default)(this, _RepeatButton.apply(this, arguments));
	  }

	  /*
	    Method to declare defaults.
	    @private
	    @overrides @ RepeatButton
	  */

	  BoundsButton.prototype._declareDefaults = function _declareDefaults() {
	    _RepeatButton.prototype._declareDefaults.call(this);
	    this._defaults.icon = 'bounds';
	    this._defaults.title = 'progress bounds (alt + b)';
	  };

	  return BoundsButton;
	}(_repeatButton2.default);

	exports.default = BoundsButton;

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _classCallCheck2 = __webpack_require__(78);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(79);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _buttonSwitch = __webpack_require__(125);

	var _buttonSwitch2 = _interopRequireDefault(_buttonSwitch);

	var _icon = __webpack_require__(112);

	var _icon2 = _interopRequireDefault(_icon);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(157);
	var CLASSES = __webpack_require__(159),
	    className = 'hide-button';

	var HideButton = function (_ButtonSwitch) {
	  (0, _inherits3.default)(HideButton, _ButtonSwitch);

	  function HideButton() {
	    (0, _classCallCheck3.default)(this, HideButton);
	    return (0, _possibleConstructorReturn3.default)(this, _ButtonSwitch.apply(this, arguments));
	  }

	  HideButton.prototype._declareDefaults = function _declareDefaults() {
	    _ButtonSwitch.prototype._declareDefaults.call(this);
	    this._defaults.title = 'hide (alt + h)';
	  };
	  /*
	    Initial render method.
	    @private
	    @overrides @ Button
	    @returns this
	  */


	  HideButton.prototype._render = function _render() {
	    _ButtonSwitch.prototype._render.call(this);
	    this.el.classList.add(CLASSES[className]);
	    this._addIcon();
	  };
	  /*
	    Method to add icon.
	    @private
	  */


	  HideButton.prototype._addIcon = function _addIcon() {
	    this.icon = new _icon2.default({
	      parent: this.el,
	      className: CLASSES[className + '__icon'],
	      shape: 'hide',
	      prefix: this._props.prefix
	    });
	  };
	  /*
	    Method that have been called on switch state change.
	    @private
	    @override @ ButtonSwitch
	  */


	  HideButton.prototype._setState = function _setState() {
	    var method = this._props.isOn ? 'add' : 'remove';
	    this.el.classList[method](CLASSES['is-hidden']);
	  };

	  return HideButton;
	}(_buttonSwitch2.default);

	exports.default = HideButton;

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(158);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(98)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./hide-button.postcss.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./hide-button.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(97)();
	// imports


	// module
	exports.push([module.id, "/*$PX:      1/16rem;*/\n\n._hide-button_1hqr2_4 {\n  \n  width:        22px;\n  height:       16px;\n  \n  background:   #3A0839;\n\n  border-top-left-radius:  3px;\n  border-top-right-radius: 3px\n}\n\n._hide-button__icon_1hqr2_1 {\n  \n  position:        absolute;\n  \n  left:        50%;\n  \n  top:        50%;\n  \n  width:        8px;\n  \n  height:        8px;\n  \n  margin-top:        1px;\n  \n  -webkit-transform:        translate( -50%, -50% );\n  \n          transform:        translate( -50%, -50% )\n}\n\n._hide-button_1hqr2_4._is-hidden_1hqr2_24 ._hide-button__icon_1hqr2_1 {\n  \n  -webkit-transform:        translate( -50%, -65% ) rotate( 180deg );\n  \n          transform:        translate( -50%, -65% ) rotate( 180deg )\n}\n\n", ""]);

	// exports


/***/ },
/* 159 */
/***/ function(module, exports) {

	module.exports = {
		"hide-button": "_hide-button_1hqr2_4",
		"hide-button__icon": "_hide-button__icon_1hqr2_1",
		"is-hidden": "_is-hidden_1hqr2_24"
	};

/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(161);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(98)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./mojs-player.postcss.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./mojs-player.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(97)();
	// imports


	// module
	exports.push([module.id, "/*$PX:      1/16rem;*/\n\n._mojs-player_12g93_4 {\n  position:       fixed;\n  left:           0;\n  bottom:         0;\n  width:          100%;\n  height:         40px;\n  background:     rgba( 58, 8, 57, .85 );\n  z-index:        100;\n}\n\n._mojs-player_12g93_4 * {\n  box-sizing: border-box;\n}\n\n._mojs-player__left_12g93_1 {\n  position:       absolute;\n  left:       0;\n  width:       175px;\n}\n\n._mojs-player__mid_12g93_1 {\n  position:       absolute;\n  left:       175px;\n  right:       17.5px;\n  overflow:       hidden;\n  padding:       0 20px;\n}\n\n._mojs-player__right_12g93_1 {\n  position:       absolute;\n  right:       0;\n}\n\n._mojs-player__hide-button_12g93_1 {\n  position:       absolute;\n  right:       6px;\n  bottom:       100%;\n}\n\n._mojs-player__mojs-logo_12g93_1 [data-component=\"icon\"] {\n  fill:       #FF512F;\n}\n\n._mojs-player_12g93_4._is-hidden_12g93_51 {\n  -webkit-transform:       translateY(100%);\n          transform:       translateY(100%);\n}\n\n._mojs-player_12g93_4._is-transition_12g93_54 {\n  -webkit-transition:       all .15s ease-out;\n  transition:       all .15s ease-out;\n}\n", ""]);

	// exports


/***/ },
/* 162 */
/***/ function(module, exports) {

	module.exports = {
		"mojs-player": "_mojs-player_12g93_4",
		"mojs-player__left": "_mojs-player__left_12g93_1",
		"mojs-player__mid": "_mojs-player__mid_12g93_1",
		"mojs-player__right": "_mojs-player__right_12g93_1",
		"mojs-player__hide-button": "_mojs-player__hide-button_12g93_1",
		"mojs-player__mojs-logo": "_mojs-player__mojs-logo_12g93_1",
		"is-hidden": "_is-hidden_12g93_51",
		"is-transition": "_is-transition_12g93_54"
	};

/***/ }
/******/ ])
});
;