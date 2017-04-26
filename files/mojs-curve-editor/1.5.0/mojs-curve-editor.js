(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("mojs-curve-editor", [], factory);
	else if(typeof exports === 'object')
		exports["mojs-curve-editor"] = factory();
	else
		root["mojs-curve-editor"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "build/";
/******/
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

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _stringify = __webpack_require__(2);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _extends2 = __webpack_require__(5);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	var _classCallCheck2 = __webpack_require__(42);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(43);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _preactRedux = __webpack_require__(47);
	
	var _preact = __webpack_require__(48);
	
	var _curveEditor = __webpack_require__(65);
	
	var _curveEditor2 = _interopRequireDefault(_curveEditor);
	
	var _store = __webpack_require__(185);
	
	var _store2 = _interopRequireDefault(_store);
	
	var _constants = __webpack_require__(114);
	
	var _constants2 = _interopRequireDefault(_constants);
	
	var _hash = __webpack_require__(128);
	
	var _hash2 = _interopRequireDefault(_hash);
	
	var _fallbackTo = __webpack_require__(212);
	
	var _fallbackTo2 = _interopRequireDefault(_fallbackTo);
	
	var _defer = __webpack_require__(213);
	
	var _defer2 = _interopRequireDefault(_defer);
	
	var _points = __webpack_require__(181);
	
	var _addPointerDown = __webpack_require__(134);
	
	var _addPointerDown2 = _interopRequireDefault(_addPointerDown);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/*
	  API wrapper above the app itself.
	*/
	var API = function () {
	  function API() {
	    var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    (0, _classCallCheck3.default)(this, API);
	
	    this._o = o;
	
	    this._decalareDefaults();
	    this._extendDefaults();
	    this._vars();
	    this._render();
	    this._tryToRestore();
	    this._listenUnload();
	
	    this._subscribe();
	    // this._subscribeFocus();
	  }
	
	  (0, _createClass3.default)(API, [{
	    key: '_decalareDefaults',
	    value: function _decalareDefaults() {
	      this._defaults = {
	        name: 'mojs-curve-editor',
	        isSaveState: true,
	        isHiddenOnMin: false,
	        onChange: null
	      };
	    }
	  }, {
	    key: '_extendDefaults',
	    value: function _extendDefaults() {
	      this._props = {};
	
	      for (var key in this._defaults) {
	        this._props[key] = (0, _fallbackTo2.default)(this._o[key], this._defaults[key]);
	      }
	    }
	  }, {
	    key: '_vars',
	    value: function _vars() {
	      this.revision = '1.5.0';
	      this.store = (0, _store2.default)();
	
	      this._easings = [];
	      this._progressLines = [];
	
	      // let str = fallbackTo( this._o.name, this._defaults.name );
	      var str = this._props.name;
	      str += str === this._defaults.name ? '' : '__' + this._defaults.name;
	      this._localStorage = str + '__' + (0, _hash2.default)(str);
	
	      this.store.dispatch({ type: 'SET_EDITOR_NAME', data: this._localStorage });
	    }
	  }, {
	    key: '_render',
	    value: function _render() {
	      var _this = this;
	
	      var doc = document;
	      var docState = doc.readyState;
	      if (docState === "complete" || docState === "loaded" || docState === "interactive") {
	        return this._renderApp();
	      }
	
	      doc.addEventListener('DOMContentLoaded', function () {
	        _this._renderApp();
	      });
	    }
	  }, {
	    key: '_renderApp',
	    value: function _renderApp() {
	      var _this2 = this;
	
	      (0, _preact.render)((0, _preact.h)(
	        _preactRedux.Provider,
	        { store: this.store },
	        (0, _preact.h)(_curveEditor2.default, { progressLines: this._progressLines,
	          options: this._props,
	          ref: function ref(el) {
	            _this2._el = el;
	          } })
	      ), document.body);
	    }
	  }, {
	    key: '_listenUnload',
	    value: function _listenUnload() {
	      var _this3 = this;
	
	      var unloadEvent = 'onpagehide' in window ? 'pagehide' : 'beforeunload';
	      window.addEventListener(unloadEvent, function () {
	        if (_this3._props.isSaveState) {
	          var preState = (0, _extends3.default)({}, _this3.store.getState());
	
	          delete preState.points.history;
	          delete preState.pointControls.history;
	          preState.progressLines.lines = [];
	
	          localStorage.setItem(_this3._localStorage, (0, _stringify2.default)(preState));
	        } else {
	          localStorage.removeItem(_this3._localStorage);
	        }
	      });
	    }
	  }, {
	    key: '_tryToRestore',
	    value: function _tryToRestore() {
	      var stored = localStorage.getItem(this._localStorage);
	      if (stored) {
	        this.store.dispatch({ type: 'SET_STATE', data: JSON.parse(stored) });
	      } else {
	        (0, _points.reset)(this.store);
	      }
	    }
	  }, {
	    key: '_subscribe',
	    value: function _subscribe() {
	      this._compilePath();
	      this.store.subscribe(this._compilePath.bind(this));
	    }
	  }, {
	    key: '_compilePath',
	    value: function _compilePath() {
	      var _this4 = this;
	
	      var state = this.store.getState();
	      var points = state.points.present;
	      var path = points.path;
	
	
	      if (!this._easing) {
	        this._easing = mojs.easing.path(path);
	      }
	
	      clearTimeout(this._tm);
	      this._tm = setTimeout(function () {
	        if (_this4._prevPath !== path) {
	          _this4._prevPath = path;
	          _this4._easing = mojs.easing.path(path);
	          _this4._fireOnChange(path);
	        }
	      }, 40);
	    }
	  }, {
	    key: '_fireOnChange',
	    value: function _fireOnChange(path) {
	      var onChange = this._props.onChange;
	
	      if (typeof onChange === 'function') {
	        onChange(path);
	      }
	
	      // update timeline and tweens - parents of the easing functions
	      for (var i = 0; i < this._easings.length; i++) {
	        var record = this._easings[i];
	        var options = record.options;
	        var easing = record.easing;
	        var _onChange = options.onChange;
	
	
	        typeof _onChange === 'function' && _onChange(easing, path);
	        this._updateParent(easing);
	      }
	    }
	  }, {
	    key: '_updateParent',
	    value: function _updateParent(easing) {
	      var parent = easing._parent;
	      if (!parent) {
	        return;
	      };
	
	      if (parent.setProgress) {
	        this._triggerParent(parent);
	      } else if (parent._o.callbacksContext) {
	        this._triggerParent(parent._o.callbacksContext.timeline);
	      } else if (parent.timeline) {
	        this._triggerParent(parent.timeline);
	      } else if (parent.tween) {
	        this._triggerParent(parent.tween);
	      }
	    }
	  }, {
	    key: '_triggerParent',
	    value: function _triggerParent(parent) {
	      var step = 0.01;
	      var progress = parent.progress;
	
	      var updateProgress = progress + step < 1 ? progress + step : progress - step;
	
	      parent.setProgress(updateProgress);
	      parent.setProgress(progress);
	    }
	  }, {
	    key: '_updateProgressLine',
	    value: function _updateProgressLine(p, i, lines) {
	      var el = lines[i];
	      var state = this.store.getState();
	      var resize = state.resize;
	
	
	      if (!el) {
	        return;
	      }
	
	      el.style.left = p * 100 + '%';
	    }
	  }, {
	    key: 'getEasing',
	    value: function getEasing() {
	      var _this5 = this;
	
	      var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	      // get the easing function regarding reverse options
	      var fun = function () {
	        var i = _this5._easings.length;
	        return function (k) {
	          _this5._updateProgressLine(k, i, _this5._progressLines);
	          var transform = _this5._easings[i].options.transform;
	          return transform ? transform(_this5._easing(k)) : _this5._easing(k);
	        };
	      }();
	
	      this.store.dispatch({ type: 'ADD_PROGRESS_LINE', data: {} });
	      this._easings.push({ options: o, easing: fun });
	
	      (0, _defer2.default)(function () {
	        _this5._fireOnChange(_this5._prevPath);
	      });
	      return fun;
	    }
	  }, {
	    key: 'minimize',
	    value: function minimize() {
	      this.store.dispatch({ type: 'SET_MINIMIZE', data: true });
	    }
	  }, {
	    key: 'maximize',
	    value: function maximize() {
	      this.store.dispatch({ type: 'SET_MINIMIZE', data: false });
	    }
	  }, {
	    key: 'toggleSize',
	    value: function toggleSize() {
	      var state = this.store.getState();
	      var controls = state.controls;
	
	
	      controls.isMinimize ? this.maximize() : this.minimize();
	    }
	
	    // highlight() { this.store.dispatch({ type: 'SET_HIGHLIGHT', data: true }); }
	    // dim() { this.store.dispatch({ type: 'SET_HIGHLIGHT', data: false }); }
	    // toggleHighlight() {
	    //   const state = this.store.getState();
	    //   const {controls} = state;
	    //
	    //   controls.isHighlight ? this.dim() : this.highlight();
	    // }
	
	  }]);
	  return API;
	}();
	
	exports.default = API;
	
	window.MojsCurveEditor = API;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(3), __esModule: true };

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var core  = __webpack_require__(4)
	  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _assign = __webpack_require__(6);
	
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(7), __esModule: true };

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(8);
	module.exports = __webpack_require__(4).Object.assign;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(9);
	
	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(23)});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(10)
	  , core      = __webpack_require__(4)
	  , ctx       = __webpack_require__(11)
	  , hide      = __webpack_require__(13)
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
/* 10 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(12);
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
/* 12 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(14)
	  , createDesc = __webpack_require__(22);
	module.exports = __webpack_require__(18) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(15)
	  , IE8_DOM_DEFINE = __webpack_require__(17)
	  , toPrimitive    = __webpack_require__(21)
	  , dP             = Object.defineProperty;
	
	exports.f = __webpack_require__(18) ? Object.defineProperty : function defineProperty(O, P, Attributes){
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(16);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(18) && !__webpack_require__(19)(function(){
	  return Object.defineProperty(__webpack_require__(20)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(19)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(16)
	  , document = __webpack_require__(10).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(16);
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
/* 22 */
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
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(24)
	  , gOPS     = __webpack_require__(39)
	  , pIE      = __webpack_require__(40)
	  , toObject = __webpack_require__(41)
	  , IObject  = __webpack_require__(28)
	  , $assign  = Object.assign;
	
	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(19)(function(){
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
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(25)
	  , enumBugKeys = __webpack_require__(38);
	
	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(26)
	  , toIObject    = __webpack_require__(27)
	  , arrayIndexOf = __webpack_require__(31)(false)
	  , IE_PROTO     = __webpack_require__(35)('IE_PROTO');
	
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
/* 26 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(28)
	  , defined = __webpack_require__(30);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(29);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 29 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(27)
	  , toLength  = __webpack_require__(32)
	  , toIndex   = __webpack_require__(34);
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
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(33)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(33)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(36)('keys')
	  , uid    = __webpack_require__(37);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(10)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 38 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 39 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 40 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(30);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 42 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _defineProperty = __webpack_require__(44);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }
	
	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(45), __esModule: true };

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(46);
	var $Object = __webpack_require__(4).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(9);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(18), 'Object', {defineProperty: __webpack_require__(14).f});

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	(function (global, factory) {
		 true ? factory(exports, __webpack_require__(48), __webpack_require__(51)) :
		typeof define === 'function' && define.amd ? define(['exports', 'preact', 'redux'], factory) :
		(factory((global.preactRedux = global.preactRedux || {}),global.preact,global.redux));
	}(this, function (exports,preact,redux) { 'use strict';
	
		function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports), module.exports; }
	
	
		var babelHelpers = {};
	
		babelHelpers.classCallCheck = function (instance, Constructor) {
		  if (!(instance instanceof Constructor)) {
		    throw new TypeError("Cannot call a class as a function");
		  }
		};
	
		babelHelpers.extends = Object.assign || function (target) {
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
	
		babelHelpers.inherits = function (subClass, superClass) {
		  if (typeof superClass !== "function" && superClass !== null) {
		    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		  }
	
		  subClass.prototype = Object.create(superClass && superClass.prototype, {
		    constructor: {
		      value: subClass,
		      enumerable: false,
		      writable: true,
		      configurable: true
		    }
		  });
		  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
		};
	
		babelHelpers.possibleConstructorReturn = function (self, call) {
		  if (!self) {
		    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		  }
	
		  return call && (typeof call === "object" || typeof call === "function") ? call : self;
		};
	
		babelHelpers;
	
		var Children = {
			only: function (children) {
				return children && children[0] || null;
			}
		};
	
		function proptype() {}
		proptype.isRequired = proptype;
	
		var PropTypes = {
			element: proptype,
			func: proptype,
			shape: function () {
				return proptype;
			}
		};
	
		var storeShape = PropTypes.shape({
		  subscribe: PropTypes.func.isRequired,
		  dispatch: PropTypes.func.isRequired,
		  getState: PropTypes.func.isRequired
		});
	
		/**
		 * Prints a warning in the console if it exists.
		 *
		 * @param {String} message The warning message.
		 * @returns {void}
		 */
		function warning(message) {
		  /* eslint-disable no-console */
		  if (typeof console !== 'undefined' && typeof console.error === 'function') {
		    console.error(message);
		  }
		  /* eslint-enable no-console */
		  try {
		    // This error was thrown as a convenience so that you can use this stack
		    // to find the callsite that caused this warning to fire.
		    throw new Error(message);
		    /* eslint-disable no-empty */
		  } catch (e) {}
		  /* eslint-enable no-empty */
		}
	
		var didWarnAboutReceivingStore = false;
		function warnAboutReceivingStore() {
		  if (didWarnAboutReceivingStore) {
		    return;
		  }
		  didWarnAboutReceivingStore = true;
	
		  warning('<Provider> does not support changing `store` on the fly. ' + 'It is most likely that you see this error because you updated to ' + 'Redux 2.x and React Redux 2.x which no longer hot reload reducers ' + 'automatically. See https://github.com/reactjs/react-redux/releases/' + 'tag/v2.0.0 for the migration instructions.');
		}
	
		var Provider = function (_Component) {
		  babelHelpers.inherits(Provider, _Component);
	
		  Provider.prototype.getChildContext = function getChildContext() {
		    return { store: this.store };
		  };
	
		  function Provider(props, context) {
		    babelHelpers.classCallCheck(this, Provider);
	
		    var _this = babelHelpers.possibleConstructorReturn(this, _Component.call(this, props, context));
	
		    _this.store = props.store;
		    return _this;
		  }
	
		  Provider.prototype.render = function render() {
		    var children = this.props.children;
	
		    return Children.only(children);
		  };
	
		  return Provider;
		}(preact.Component);
	
		if (true) {
		  Provider.prototype.componentWillReceiveProps = function (nextProps) {
		    var store = this.store;
		    var nextStore = nextProps.store;
	
	
		    if (store !== nextStore) {
		      warnAboutReceivingStore();
		    }
		  };
		}
	
		Provider.childContextTypes = {
		  store: storeShape.isRequired
		};
	
		function shallowEqual(objA, objB) {
		  if (objA === objB) {
		    return true;
		  }
	
		  var keysA = Object.keys(objA);
		  var keysB = Object.keys(objB);
	
		  if (keysA.length !== keysB.length) {
		    return false;
		  }
	
		  // Test for A's keys different from B.
		  var hasOwn = Object.prototype.hasOwnProperty;
		  for (var i = 0; i < keysA.length; i++) {
		    if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
		      return false;
		    }
		  }
	
		  return true;
		}
	
		function wrapActionCreators(actionCreators) {
		  return function (dispatch) {
		    return redux.bindActionCreators(actionCreators, dispatch);
		  };
		}
	
		var isObjectLike = __commonjs(function (module) {
		  /**
		   * Checks if `value` is object-like. A value is object-like if it's not `null`
		   * and has a `typeof` result of "object".
		   *
		   * @static
		   * @memberOf _
		   * @since 4.0.0
		   * @category Lang
		   * @param {*} value The value to check.
		   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
		   * @example
		   *
		   * _.isObjectLike({});
		   * // => true
		   *
		   * _.isObjectLike([1, 2, 3]);
		   * // => true
		   *
		   * _.isObjectLike(_.noop);
		   * // => false
		   *
		   * _.isObjectLike(null);
		   * // => false
		   */
		  function isObjectLike(value) {
		    return !!value && typeof value == 'object';
		  }
	
		  module.exports = isObjectLike;
		});
	
		var require$$0 = isObjectLike && typeof isObjectLike === 'object' && 'default' in isObjectLike ? isObjectLike['default'] : isObjectLike;
	
		var _isHostObject = __commonjs(function (module) {
		  /**
		   * Checks if `value` is a host object in IE < 9.
		   *
		   * @private
		   * @param {*} value The value to check.
		   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
		   */
		  function isHostObject(value) {
		    // Many host objects are `Object` objects that can coerce to strings
		    // despite having improperly defined `toString` methods.
		    var result = false;
		    if (value != null && typeof value.toString != 'function') {
		      try {
		        result = !!(value + '');
		      } catch (e) {}
		    }
		    return result;
		  }
	
		  module.exports = isHostObject;
		});
	
		var require$$1 = _isHostObject && typeof _isHostObject === 'object' && 'default' in _isHostObject ? _isHostObject['default'] : _isHostObject;
	
		var _getPrototype = __commonjs(function (module) {
		  /* Built-in method references for those with the same name as other `lodash` methods. */
		  var nativeGetPrototype = Object.getPrototypeOf;
	
		  /**
		   * Gets the `[[Prototype]]` of `value`.
		   *
		   * @private
		   * @param {*} value The value to query.
		   * @returns {null|Object} Returns the `[[Prototype]]`.
		   */
		  function getPrototype(value) {
		    return nativeGetPrototype(Object(value));
		  }
	
		  module.exports = getPrototype;
		});
	
		var require$$2 = _getPrototype && typeof _getPrototype === 'object' && 'default' in _getPrototype ? _getPrototype['default'] : _getPrototype;
	
		var isPlainObject = __commonjs(function (module) {
		  var getPrototype = require$$2,
		      isHostObject = require$$1,
		      isObjectLike = require$$0;
	
		  /** `Object#toString` result references. */
		  var objectTag = '[object Object]';
	
		  /** Used for built-in method references. */
		  var objectProto = Object.prototype;
	
		  /** Used to resolve the decompiled source of functions. */
		  var funcToString = Function.prototype.toString;
	
		  /** Used to check objects for own properties. */
		  var hasOwnProperty = objectProto.hasOwnProperty;
	
		  /** Used to infer the `Object` constructor. */
		  var objectCtorString = funcToString.call(Object);
	
		  /**
		   * Used to resolve the
		   * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
		   * of values.
		   */
		  var objectToString = objectProto.toString;
	
		  /**
		   * Checks if `value` is a plain object, that is, an object created by the
		   * `Object` constructor or one with a `[[Prototype]]` of `null`.
		   *
		   * @static
		   * @memberOf _
		   * @since 0.8.0
		   * @category Lang
		   * @param {*} value The value to check.
		   * @returns {boolean} Returns `true` if `value` is a plain object,
		   *  else `false`.
		   * @example
		   *
		   * function Foo() {
		   *   this.a = 1;
		   * }
		   *
		   * _.isPlainObject(new Foo);
		   * // => false
		   *
		   * _.isPlainObject([1, 2, 3]);
		   * // => false
		   *
		   * _.isPlainObject({ 'x': 0, 'y': 0 });
		   * // => true
		   *
		   * _.isPlainObject(Object.create(null));
		   * // => true
		   */
		  function isPlainObject(value) {
		    if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
		      return false;
		    }
		    var proto = getPrototype(value);
		    if (proto === null) {
		      return true;
		    }
		    var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
		    return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
		  }
	
		  module.exports = isPlainObject;
		});
	
		var isPlainObject$1 = isPlainObject && typeof isPlainObject === 'object' && 'default' in isPlainObject ? isPlainObject['default'] : isPlainObject;
	
		var index = __commonjs(function (module) {
		    /**
		     * Copyright 2015, Yahoo! Inc.
		     * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
		     */
		    'use strict';
	
		    var REACT_STATICS = {
		        childContextTypes: true,
		        contextTypes: true,
		        defaultProps: true,
		        displayName: true,
		        getDefaultProps: true,
		        mixins: true,
		        propTypes: true,
		        type: true
		    };
	
		    var KNOWN_STATICS = {
		        name: true,
		        length: true,
		        prototype: true,
		        caller: true,
		        arguments: true,
		        arity: true
		    };
	
		    module.exports = function hoistNonReactStatics(targetComponent, sourceComponent) {
		        if (typeof sourceComponent !== 'string') {
		            // don't hoist over string (html) components
		            var keys = Object.getOwnPropertyNames(sourceComponent);
		            for (var i = 0; i < keys.length; ++i) {
		                if (!REACT_STATICS[keys[i]] && !KNOWN_STATICS[keys[i]]) {
		                    try {
		                        targetComponent[keys[i]] = sourceComponent[keys[i]];
		                    } catch (error) {}
		                }
		            }
		        }
	
		        return targetComponent;
		    };
		});
	
		var hoistStatics = index && typeof index === 'object' && 'default' in index ? index['default'] : index;
	
		var invariant = __commonjs(function (module) {
		  /**
		   * Copyright 2013-2015, Facebook, Inc.
		   * All rights reserved.
		   *
		   * This source code is licensed under the BSD-style license found in the
		   * LICENSE file in the root directory of this source tree. An additional grant
		   * of patent rights can be found in the PATENTS file in the same directory.
		   */
	
		  'use strict';
	
		  /**
		   * Use invariant() to assert state which your program assumes to be true.
		   *
		   * Provide sprintf-style format (only %s is supported) and arguments
		   * to provide information about what broke and what you were
		   * expecting.
		   *
		   * The invariant message will be stripped in production, but the invariant
		   * will remain to ensure logic does not differ in production.
		   */
	
		  var NODE_ENV = 'development';
	
		  var invariant = function (condition, format, a, b, c, d, e, f) {
		    if (NODE_ENV !== 'production') {
		      if (format === undefined) {
		        throw new Error('invariant requires an error message argument');
		      }
		    }
	
		    if (!condition) {
		      var error;
		      if (format === undefined) {
		        error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
		      } else {
		        var args = [a, b, c, d, e, f];
		        var argIndex = 0;
		        error = new Error(format.replace(/%s/g, function () {
		          return args[argIndex++];
		        }));
		        error.name = 'Invariant Violation';
		      }
	
		      error.framesToPop = 1; // we don't care about invariant's own frame
		      throw error;
		    }
		  };
	
		  module.exports = invariant;
		});
	
		var invariant$1 = invariant && typeof invariant === 'object' && 'default' in invariant ? invariant['default'] : invariant;
	
		var defaultMapStateToProps = function (state) {
		  return {};
		}; // eslint-disable-line no-unused-vars
		var defaultMapDispatchToProps = function (dispatch) {
		  return { dispatch: dispatch };
		};
		var defaultMergeProps = function (stateProps, dispatchProps, parentProps) {
		  return babelHelpers.extends({}, parentProps, stateProps, dispatchProps);
		};
	
		function getDisplayName(WrappedComponent) {
		  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
		}
	
		var errorObject = { value: null };
		function tryCatch(fn, ctx) {
		  try {
		    return fn.apply(ctx);
		  } catch (e) {
		    errorObject.value = e;
		    return errorObject;
		  }
		}
	
		// Helps track hot reloading.
		var nextVersion = 0;
	
		function connect(mapStateToProps, mapDispatchToProps, mergeProps) {
		  var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
	
		  var shouldSubscribe = Boolean(mapStateToProps);
		  var mapState = mapStateToProps || defaultMapStateToProps;
	
		  var mapDispatch = void 0;
		  if (typeof mapDispatchToProps === 'function') {
		    mapDispatch = mapDispatchToProps;
		  } else if (!mapDispatchToProps) {
		    mapDispatch = defaultMapDispatchToProps;
		  } else {
		    mapDispatch = wrapActionCreators(mapDispatchToProps);
		  }
	
		  var finalMergeProps = mergeProps || defaultMergeProps;
		  var _options$pure = options.pure;
		  var pure = _options$pure === undefined ? true : _options$pure;
		  var _options$withRef = options.withRef;
		  var withRef = _options$withRef === undefined ? false : _options$withRef;
	
		  var checkMergedEquals = pure && finalMergeProps !== defaultMergeProps;
	
		  // Helps track hot reloading.
		  var version = nextVersion++;
	
		  return function wrapWithConnect(WrappedComponent) {
		    var connectDisplayName = 'Connect(' + getDisplayName(WrappedComponent) + ')';
	
		    function checkStateShape(props, methodName) {
		      if (!isPlainObject$1(props)) {
		        warning(methodName + '() in ' + connectDisplayName + ' must return a plain object. ' + ('Instead received ' + props + '.'));
		      }
		    }
	
		    function computeMergedProps(stateProps, dispatchProps, parentProps) {
		      var mergedProps = finalMergeProps(stateProps, dispatchProps, parentProps);
		      if (true) {
		        checkStateShape(mergedProps, 'mergeProps');
		      }
		      return mergedProps;
		    }
	
		    var Connect = function (_Component) {
		      babelHelpers.inherits(Connect, _Component);
	
		      Connect.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
		        return !pure || this.haveOwnPropsChanged || this.hasStoreStateChanged;
		      };
	
		      function Connect(props, context) {
		        babelHelpers.classCallCheck(this, Connect);
	
		        var _this = babelHelpers.possibleConstructorReturn(this, _Component.call(this, props, context));
	
		        _this.version = version;
		        _this.store = props.store || context.store;
	
		        invariant$1(_this.store, 'Could not find "store" in either the context or ' + ('props of "' + connectDisplayName + '". ') + 'Either wrap the root component in a <Provider>, ' + ('or explicitly pass "store" as a prop to "' + connectDisplayName + '".'));
	
		        var storeState = _this.store.getState();
		        _this.state = { storeState: storeState };
		        _this.clearCache();
		        return _this;
		      }
	
		      Connect.prototype.computeStateProps = function computeStateProps(store, props) {
		        if (!this.finalMapStateToProps) {
		          return this.configureFinalMapState(store, props);
		        }
	
		        var state = store.getState();
		        var stateProps = this.doStatePropsDependOnOwnProps ? this.finalMapStateToProps(state, props) : this.finalMapStateToProps(state);
	
		        if (true) {
		          checkStateShape(stateProps, 'mapStateToProps');
		        }
		        return stateProps;
		      };
	
		      Connect.prototype.configureFinalMapState = function configureFinalMapState(store, props) {
		        var mappedState = mapState(store.getState(), props);
		        var isFactory = typeof mappedState === 'function';
	
		        this.finalMapStateToProps = isFactory ? mappedState : mapState;
		        this.doStatePropsDependOnOwnProps = this.finalMapStateToProps.length !== 1;
	
		        if (isFactory) {
		          return this.computeStateProps(store, props);
		        }
	
		        if (true) {
		          checkStateShape(mappedState, 'mapStateToProps');
		        }
		        return mappedState;
		      };
	
		      Connect.prototype.computeDispatchProps = function computeDispatchProps(store, props) {
		        if (!this.finalMapDispatchToProps) {
		          return this.configureFinalMapDispatch(store, props);
		        }
	
		        var dispatch = store.dispatch;
	
		        var dispatchProps = this.doDispatchPropsDependOnOwnProps ? this.finalMapDispatchToProps(dispatch, props) : this.finalMapDispatchToProps(dispatch);
	
		        if (true) {
		          checkStateShape(dispatchProps, 'mapDispatchToProps');
		        }
		        return dispatchProps;
		      };
	
		      Connect.prototype.configureFinalMapDispatch = function configureFinalMapDispatch(store, props) {
		        var mappedDispatch = mapDispatch(store.dispatch, props);
		        var isFactory = typeof mappedDispatch === 'function';
	
		        this.finalMapDispatchToProps = isFactory ? mappedDispatch : mapDispatch;
		        this.doDispatchPropsDependOnOwnProps = this.finalMapDispatchToProps.length !== 1;
	
		        if (isFactory) {
		          return this.computeDispatchProps(store, props);
		        }
	
		        if (true) {
		          checkStateShape(mappedDispatch, 'mapDispatchToProps');
		        }
		        return mappedDispatch;
		      };
	
		      Connect.prototype.updateStatePropsIfNeeded = function updateStatePropsIfNeeded() {
		        var nextStateProps = this.computeStateProps(this.store, this.props);
		        if (this.stateProps && shallowEqual(nextStateProps, this.stateProps)) {
		          return false;
		        }
	
		        this.stateProps = nextStateProps;
		        return true;
		      };
	
		      Connect.prototype.updateDispatchPropsIfNeeded = function updateDispatchPropsIfNeeded() {
		        var nextDispatchProps = this.computeDispatchProps(this.store, this.props);
		        if (this.dispatchProps && shallowEqual(nextDispatchProps, this.dispatchProps)) {
		          return false;
		        }
	
		        this.dispatchProps = nextDispatchProps;
		        return true;
		      };
	
		      Connect.prototype.updateMergedPropsIfNeeded = function updateMergedPropsIfNeeded() {
		        var nextMergedProps = computeMergedProps(this.stateProps, this.dispatchProps, this.props);
		        if (this.mergedProps && checkMergedEquals && shallowEqual(nextMergedProps, this.mergedProps)) {
		          return false;
		        }
	
		        this.mergedProps = nextMergedProps;
		        return true;
		      };
	
		      Connect.prototype.isSubscribed = function isSubscribed() {
		        return typeof this.unsubscribe === 'function';
		      };
	
		      Connect.prototype.trySubscribe = function trySubscribe() {
		        if (shouldSubscribe && !this.unsubscribe) {
		          this.unsubscribe = this.store.subscribe(this.handleChange.bind(this));
		          this.handleChange();
		        }
		      };
	
		      Connect.prototype.tryUnsubscribe = function tryUnsubscribe() {
		        if (this.unsubscribe) {
		          this.unsubscribe();
		          this.unsubscribe = null;
		        }
		      };
	
		      Connect.prototype.componentDidMount = function componentDidMount() {
		        this.trySubscribe();
		      };
	
		      Connect.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		        if (!pure || !shallowEqual(nextProps, this.props)) {
		          this.haveOwnPropsChanged = true;
		        }
		      };
	
		      Connect.prototype.componentWillUnmount = function componentWillUnmount() {
		        this.tryUnsubscribe();
		        this.clearCache();
		      };
	
		      Connect.prototype.clearCache = function clearCache() {
		        this.dispatchProps = null;
		        this.stateProps = null;
		        this.mergedProps = null;
		        this.haveOwnPropsChanged = true;
		        this.hasStoreStateChanged = true;
		        this.haveStatePropsBeenPrecalculated = false;
		        this.statePropsPrecalculationError = null;
		        this.renderedElement = null;
		        this.finalMapDispatchToProps = null;
		        this.finalMapStateToProps = null;
		      };
	
		      Connect.prototype.handleChange = function handleChange() {
		        if (!this.unsubscribe) {
		          return;
		        }
	
		        var storeState = this.store.getState();
		        var prevStoreState = this.state.storeState;
		        if (pure && prevStoreState === storeState) {
		          return;
		        }
	
		        if (pure && !this.doStatePropsDependOnOwnProps) {
		          var haveStatePropsChanged = tryCatch(this.updateStatePropsIfNeeded, this);
		          if (!haveStatePropsChanged) {
		            return;
		          }
		          if (haveStatePropsChanged === errorObject) {
		            this.statePropsPrecalculationError = errorObject.value;
		          }
		          this.haveStatePropsBeenPrecalculated = true;
		        }
	
		        this.hasStoreStateChanged = true;
		        this.setState({ storeState: storeState });
		      };
	
		      Connect.prototype.getWrappedInstance = function getWrappedInstance() {
		        invariant$1(withRef, 'To access the wrapped instance, you need to specify ' + '{ withRef: true } as the fourth argument of the connect() call.');
	
		        return this.refs.wrappedInstance;
		      };
	
		      Connect.prototype.render = function render() {
		        var haveOwnPropsChanged = this.haveOwnPropsChanged;
		        var hasStoreStateChanged = this.hasStoreStateChanged;
		        var haveStatePropsBeenPrecalculated = this.haveStatePropsBeenPrecalculated;
		        var statePropsPrecalculationError = this.statePropsPrecalculationError;
		        var renderedElement = this.renderedElement;
	
	
		        this.haveOwnPropsChanged = false;
		        this.hasStoreStateChanged = false;
		        this.haveStatePropsBeenPrecalculated = false;
		        this.statePropsPrecalculationError = null;
	
		        if (statePropsPrecalculationError) {
		          throw statePropsPrecalculationError;
		        }
	
		        var shouldUpdateStateProps = true;
		        var shouldUpdateDispatchProps = true;
		        if (pure && renderedElement) {
		          shouldUpdateStateProps = hasStoreStateChanged || haveOwnPropsChanged && this.doStatePropsDependOnOwnProps;
		          shouldUpdateDispatchProps = haveOwnPropsChanged && this.doDispatchPropsDependOnOwnProps;
		        }
	
		        var haveStatePropsChanged = false;
		        var haveDispatchPropsChanged = false;
		        if (haveStatePropsBeenPrecalculated) {
		          haveStatePropsChanged = true;
		        } else if (shouldUpdateStateProps) {
		          haveStatePropsChanged = this.updateStatePropsIfNeeded();
		        }
		        if (shouldUpdateDispatchProps) {
		          haveDispatchPropsChanged = this.updateDispatchPropsIfNeeded();
		        }
	
		        var haveMergedPropsChanged = true;
		        if (haveStatePropsChanged || haveDispatchPropsChanged || haveOwnPropsChanged) {
		          haveMergedPropsChanged = this.updateMergedPropsIfNeeded();
		        } else {
		          haveMergedPropsChanged = false;
		        }
	
		        if (!haveMergedPropsChanged && renderedElement) {
		          return renderedElement;
		        }
	
		        if (withRef) {
		          this.renderedElement = preact.h(WrappedComponent, babelHelpers.extends({}, this.mergedProps, {
		            ref: 'wrappedInstance'
		          }));
		        } else {
		          this.renderedElement = preact.h(WrappedComponent, this.mergedProps);
		        }
	
		        return this.renderedElement;
		      };
	
		      return Connect;
		    }(preact.Component);
	
		    Connect.displayName = connectDisplayName;
		    Connect.WrappedComponent = WrappedComponent;
		    Connect.contextTypes = {
		      store: storeShape
		    };
	
	
		    if (true) {
		      Connect.prototype.componentWillUpdate = function componentWillUpdate() {
		        if (this.version === version) {
		          return;
		        }
	
		        // We are hot reloading!
		        this.version = version;
		        this.trySubscribe();
		        this.clearCache();
		      };
		    }
	
		    return hoistStatics(Connect, WrappedComponent);
		  };
		}
	
		exports.Provider = Provider;
		exports.connect = connect;

	}));


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate) {!function(global, factory) {
	     true ? factory(exports) : 'function' == typeof define && define.amd ? define([ 'exports' ], factory) : factory(global.preact = global.preact || {});
	}(this, function(exports) {
	    function VNode(nodeName, attributes, children) {
	        this.nodeName = nodeName;
	        this.attributes = attributes;
	        this.children = children;
	        this.key = attributes && attributes.key;
	    }
	    function extend(obj, props) {
	        if (props) for (var i in props) if (void 0 !== props[i]) obj[i] = props[i];
	        return obj;
	    }
	    function clone(obj) {
	        return extend({}, obj);
	    }
	    function delve(obj, key) {
	        for (var p = key.split('.'), i = 0; i < p.length && obj; i++) obj = obj[p[i]];
	        return obj;
	    }
	    function toArray(obj, offset) {
	        return [].slice.call(obj, offset);
	    }
	    function isFunction(obj) {
	        return 'function' == typeof obj;
	    }
	    function isString(obj) {
	        return 'string' == typeof obj;
	    }
	    function empty(x) {
	        return void 0 === x || null === x;
	    }
	    function falsey(value) {
	        return value === !1 || empty(value);
	    }
	    function hashToClassName(c) {
	        var str = '';
	        for (var prop in c) if (c[prop]) {
	            if (str) str += ' ';
	            str += prop;
	        }
	        return str;
	    }
	    function h(nodeName, attributes, firstChild) {
	        var children, arr, lastSimple, len = arguments.length;
	        if (len > 2) {
	            var type = typeof firstChild;
	            if (3 === len && 'object' !== type && 'function' !== type) {
	                if (!falsey(firstChild)) children = [ String(firstChild) ];
	            } else {
	                children = [];
	                for (var i = 2; i < len; i++) {
	                    var _p = arguments[i];
	                    if (!falsey(_p)) {
	                        if (_p.join) arr = _p; else (arr = SHARED_TEMP_ARRAY)[0] = _p;
	                        for (var j = 0; j < arr.length; j++) {
	                            var child = arr[j], simple = !(falsey(child) || isFunction(child) || child instanceof VNode);
	                            if (simple && !isString(child)) child = String(child);
	                            if (simple && lastSimple) children[children.length - 1] += child; else if (!falsey(child)) {
	                                children.push(child);
	                                lastSimple = simple;
	                            }
	                        }
	                    } else ;
	                }
	            }
	        } else if (attributes && attributes.children) return h(nodeName, attributes, attributes.children);
	        if (attributes) {
	            if (attributes.children) delete attributes.children;
	            if (!isFunction(nodeName)) {
	                if ('className' in attributes) {
	                    attributes.class = attributes.className;
	                    delete attributes.className;
	                }
	                lastSimple = attributes.class;
	                if (lastSimple && !isString(lastSimple)) attributes.class = hashToClassName(lastSimple);
	            }
	        }
	        var p = new VNode(nodeName, attributes || void 0, children);
	        if (options.vnode) options.vnode(p);
	        return p;
	    }
	    function cloneElement(vnode, props) {
	        return h(vnode.nodeName, extend(clone(vnode.attributes), props), arguments.length > 2 ? toArray(arguments, 2) : vnode.children);
	    }
	    function createLinkedState(component, key, eventPath) {
	        var path = key.split('.'), p0 = path[0];
	        return function(e) {
	            var _component$setState;
	            var v, i, t = e && e.currentTarget || this, s = component.state, obj = s;
	            if (isString(eventPath)) {
	                v = delve(e, eventPath);
	                if (empty(v) && (t = t._component)) v = delve(t, eventPath);
	            } else v = t.nodeName ? (t.nodeName + t.type).match(/^input(check|rad)/i) ? t.checked : t.value : e;
	            if (isFunction(v)) v = v.call(t);
	            if (path.length > 1) {
	                for (i = 0; i < path.length - 1; i++) obj = obj[path[i]] || (obj[path[i]] = {});
	                obj[path[i]] = v;
	                v = s[p0];
	            }
	            component.setState((_component$setState = {}, _component$setState[p0] = v, _component$setState));
	        };
	    }
	    function enqueueRender(component) {
	        if (1 === items.push(component)) (options.debounceRendering || setImmediate)(rerender);
	    }
	    function rerender() {
	        if (items.length) {
	            var p, currentItems = items;
	            items = itemsOffline;
	            itemsOffline = currentItems;
	            while (p = currentItems.pop()) if (p._dirty) renderComponent(p);
	        }
	    }
	    function isFunctionalComponent(vnode) {
	        var nodeName = vnode && vnode.nodeName;
	        return nodeName && isFunction(nodeName) && !(nodeName.prototype && nodeName.prototype.render);
	    }
	    function buildFunctionalComponent(vnode, context) {
	        return vnode.nodeName(getNodeProps(vnode), context || EMPTY);
	    }
	    function ensureNodeData(node, data) {
	        return node[ATTR_KEY] || (node[ATTR_KEY] = data || {});
	    }
	    function getNodeType(node) {
	        if (node instanceof Text) return 3;
	        if (node instanceof Element) return 1; else return 0;
	    }
	    function removeNode(node) {
	        var p = node.parentNode;
	        if (p) p.removeChild(node);
	    }
	    function setAccessor(node, name, value, old, isSvg) {
	        ensureNodeData(node)[name] = value;
	        if ('key' !== name && 'children' !== name) if ('class' === name && !isSvg) node.className = value || ''; else if ('style' === name) {
	            if (!value || isString(value) || isString(old)) node.style.cssText = value || '';
	            if (value && 'object' == typeof value) {
	                if (!isString(old)) for (var i in old) if (!(i in value)) node.style[i] = '';
	                for (var i in value) node.style[i] = 'number' == typeof value[i] && !NON_DIMENSION_PROPS[i] ? value[i] + 'px' : value[i];
	            }
	        } else if ('dangerouslySetInnerHTML' === name) {
	            if (value) node.innerHTML = value.__html;
	        } else if ('o' === name[0] && 'n' === name[1]) {
	            var l = node._listeners || (node._listeners = {});
	            name = toLowerCase(name.substring(2));
	            if (value) {
	                if (!l[name]) node.addEventListener(name, eventProxy);
	            } else if (l[name]) node.removeEventListener(name, eventProxy);
	            l[name] = value;
	        } else if ('type' !== name && !isSvg && name in node) {
	            setProperty(node, name, empty(value) ? '' : value);
	            if (falsey(value)) node.removeAttribute(name);
	        } else {
	            var ns = isSvg && name.match(/^xlink\:?(.+)/);
	            if (falsey(value)) if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', toLowerCase(ns[1])); else node.removeAttribute(name); else if ('object' != typeof value && !isFunction(value)) if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', toLowerCase(ns[1]), value); else node.setAttribute(name, value);
	        }
	    }
	    function setProperty(node, name, value) {
	        try {
	            node[name] = value;
	        } catch (e) {}
	    }
	    function eventProxy(e) {
	        return this._listeners[e.type](options.event && options.event(e) || e);
	    }
	    function getRawNodeAttributes(node) {
	        var attrs = {};
	        for (var i = node.attributes.length; i--; ) attrs[node.attributes[i].name] = node.attributes[i].value;
	        return attrs;
	    }
	    function isSameNodeType(node, vnode) {
	        if (isString(vnode)) return 3 === getNodeType(node);
	        if (isString(vnode.nodeName)) return isNamedNode(node, vnode.nodeName);
	        if (isFunction(vnode.nodeName)) return node._componentConstructor === vnode.nodeName || isFunctionalComponent(vnode); else ;
	    }
	    function isNamedNode(node, nodeName) {
	        return node.normalizedNodeName === nodeName || toLowerCase(node.nodeName) === toLowerCase(nodeName);
	    }
	    function getNodeProps(vnode) {
	        var defaultProps = vnode.nodeName.defaultProps, props = clone(defaultProps || vnode.attributes);
	        if (defaultProps) extend(props, vnode.attributes);
	        if (vnode.children) props.children = vnode.children;
	        return props;
	    }
	    function collectNode(node) {
	        cleanNode(node);
	        var name = toLowerCase(node.nodeName), list = nodes[name];
	        if (list) list.push(node); else nodes[name] = [ node ];
	    }
	    function createNode(nodeName, isSvg) {
	        var name = toLowerCase(nodeName), node = nodes[name] && nodes[name].pop() || (isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName));
	        ensureNodeData(node);
	        node.normalizedNodeName = name;
	        return node;
	    }
	    function cleanNode(node) {
	        removeNode(node);
	        if (1 === getNodeType(node)) {
	            ensureNodeData(node, getRawNodeAttributes(node));
	            node._component = node._componentConstructor = null;
	        }
	    }
	    function flushMounts() {
	        var c;
	        while (c = mounts.pop()) if (c.componentDidMount) c.componentDidMount();
	    }
	    function diff(dom, vnode, context, mountAll, parent) {
	        diffLevel++;
	        var ret = idiff(dom, vnode, context, mountAll);
	        if (parent && ret.parentNode !== parent) parent.appendChild(ret);
	        if (!--diffLevel) flushMounts();
	        return ret;
	    }
	    function idiff(dom, vnode, context, mountAll) {
	        var originalAttributes = vnode && vnode.attributes;
	        while (isFunctionalComponent(vnode)) vnode = buildFunctionalComponent(vnode, context);
	        if (empty(vnode)) return document.createComment('');
	        if (isString(vnode)) {
	            if (dom) {
	                if (3 === getNodeType(dom) && dom.parentNode) {
	                    if (dom.nodeValue != vnode) dom.nodeValue = vnode;
	                    return dom;
	                }
	                collectNode(dom);
	            }
	            return document.createTextNode(vnode);
	        }
	        var svgMode, out = dom, nodeName = vnode.nodeName;
	        if (isFunction(nodeName)) return buildComponentFromVNode(dom, vnode, context, mountAll);
	        if (!isString(nodeName)) nodeName = String(nodeName);
	        svgMode = 'svg' === toLowerCase(nodeName);
	        if (svgMode) isSvgMode = !0;
	        if (!dom) out = createNode(nodeName, isSvgMode); else if (!isNamedNode(dom, nodeName)) {
	            out = createNode(nodeName, isSvgMode);
	            while (dom.firstChild) out.appendChild(dom.firstChild);
	            recollectNodeTree(dom);
	        }
	        if (vnode.children && 1 === vnode.children.length && 'string' == typeof vnode.children[0] && 1 === out.childNodes.length && out.firstChild instanceof Text) out.firstChild.nodeValue = vnode.children[0]; else if (vnode.children || out.firstChild) innerDiffNode(out, vnode.children, context, mountAll);
	        diffAttributes(out, vnode.attributes);
	        if (originalAttributes && originalAttributes.ref) (out[ATTR_KEY].ref = originalAttributes.ref)(out);
	        if (svgMode) isSvgMode = !1;
	        return out;
	    }
	    function innerDiffNode(dom, vchildren, context, mountAll) {
	        var j, c, vchild, child, originalChildren = dom.childNodes, children = [], keyed = {}, keyedLen = 0, min = 0, len = originalChildren.length, childrenLen = 0, vlen = vchildren && vchildren.length;
	        if (len) for (var i = 0; i < len; i++) {
	            var _child = originalChildren[i], key = vlen ? (c = _child._component) ? c.__key : (c = _child[ATTR_KEY]) ? c.key : null : null;
	            if (key || 0 === key) {
	                keyedLen++;
	                keyed[key] = _child;
	            } else children[childrenLen++] = _child;
	        }
	        if (vlen) for (var i = 0; i < vlen; i++) {
	            vchild = vchildren[i];
	            child = null;
	            if (keyedLen && vchild.attributes) {
	                var key = vchild.key;
	                if (!empty(key) && key in keyed) {
	                    child = keyed[key];
	                    keyed[key] = void 0;
	                    keyedLen--;
	                }
	            }
	            if (!child && min < childrenLen) for (j = min; j < childrenLen; j++) {
	                c = children[j];
	                if (c && isSameNodeType(c, vchild)) {
	                    child = c;
	                    children[j] = void 0;
	                    if (j === childrenLen - 1) childrenLen--;
	                    if (j === min) min++;
	                    break;
	                }
	            }
	            child = idiff(child, vchild, context, mountAll);
	            if (child !== originalChildren[i]) dom.insertBefore(child, originalChildren[i] || null);
	        }
	        if (keyedLen) for (var i in keyed) if (keyed[i]) children[min = childrenLen++] = keyed[i];
	        if (min < childrenLen) removeOrphanedChildren(children);
	    }
	    function removeOrphanedChildren(children, unmountOnly) {
	        for (var i = children.length; i--; ) {
	            var child = children[i];
	            if (child) recollectNodeTree(child, unmountOnly);
	        }
	    }
	    function recollectNodeTree(node, unmountOnly) {
	        var component = node._component;
	        if (component) unmountComponent(component, !unmountOnly); else {
	            if (node[ATTR_KEY] && node[ATTR_KEY].ref) node[ATTR_KEY].ref(null);
	            if (!unmountOnly) collectNode(node);
	            if (node.childNodes && node.childNodes.length) removeOrphanedChildren(node.childNodes, unmountOnly);
	        }
	    }
	    function diffAttributes(dom, attrs) {
	        var old = dom[ATTR_KEY] || getRawNodeAttributes(dom);
	        for (var _name in old) if (!(attrs && _name in attrs)) setAccessor(dom, _name, null, old[_name], isSvgMode);
	        if (attrs) for (var _name2 in attrs) if (!(_name2 in old) || attrs[_name2] != ('value' === _name2 || 'selected' === _name2 || 'checked' === _name2 ? dom[_name2] : old[_name2])) setAccessor(dom, _name2, attrs[_name2], old[_name2], isSvgMode);
	    }
	    function collectComponent(component) {
	        var name = component.constructor.name, list = components[name];
	        if (list) list.push(component); else components[name] = [ component ];
	    }
	    function createComponent(Ctor, props, context) {
	        var inst = new Ctor(props, context), list = components[Ctor.name];
	        if (list) for (var i = list.length; i--; ) if (list[i].constructor === Ctor) {
	            inst.nextBase = list[i].nextBase;
	            list.splice(i, 1);
	            break;
	        }
	        return inst;
	    }
	    function triggerComponentRender(component) {
	        if (!component._dirty) {
	            component._dirty = !0;
	            enqueueRender(component);
	        }
	    }
	    function setComponentProps(component, props, opts, context, mountAll) {
	        var b = component.base;
	        if (!component._disableRendering) {
	            component._disableRendering = !0;
	            if (component.__ref = props.ref) delete props.ref;
	            if (component.__key = props.key) delete props.key;
	            if (empty(b) || mountAll) {
	                if (component.componentWillMount) component.componentWillMount();
	            } else if (component.componentWillReceiveProps) component.componentWillReceiveProps(props, context);
	            if (context && context !== component.context) {
	                if (!component.prevContext) component.prevContext = component.context;
	                component.context = context;
	            }
	            if (!component.prevProps) component.prevProps = component.props;
	            component.props = props;
	            component._disableRendering = !1;
	            if (0 !== opts) if (1 === opts || options.syncComponentUpdates !== !1 || !b) renderComponent(component, 1, mountAll); else triggerComponentRender(component);
	            if (component.__ref) component.__ref(component);
	        }
	    }
	    function renderComponent(component, opts, mountAll) {
	        if (!component._disableRendering) {
	            var skip, rendered, props = component.props, state = component.state, context = component.context, previousProps = component.prevProps || props, previousState = component.prevState || state, previousContext = component.prevContext || context, isUpdate = component.base, initialBase = isUpdate || component.nextBase, nextSibling = initialBase && initialBase.nextSibling, baseParent = initialBase && initialBase.parentNode, initialComponent = initialBase && initialBase._component, initialChildComponent = component._component;
	            if (isUpdate) {
	                component.props = previousProps;
	                component.state = previousState;
	                component.context = previousContext;
	                if (2 !== opts && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === !1) skip = !0; else if (component.componentWillUpdate) component.componentWillUpdate(props, state, context);
	                component.props = props;
	                component.state = state;
	                component.context = context;
	            }
	            component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
	            component._dirty = !1;
	            if (!skip) {
	                if (component.render) rendered = component.render(props, state, context);
	                if (component.getChildContext) context = extend(clone(context), component.getChildContext());
	                while (isFunctionalComponent(rendered)) rendered = buildFunctionalComponent(rendered, context);
	                var toUnmount, base, childComponent = rendered && rendered.nodeName;
	                if (isFunction(childComponent) && childComponent.prototype.render) {
	                    var inst = initialChildComponent, childProps = getNodeProps(rendered);
	                    if (inst && inst.constructor === childComponent) setComponentProps(inst, childProps, 1, context); else {
	                        toUnmount = inst;
	                        inst = createComponent(childComponent, childProps, context);
	                        inst._parentComponent = component;
	                        component._component = inst;
	                        setComponentProps(inst, childProps, 0, context);
	                        renderComponent(inst, 1);
	                    }
	                    base = inst.base;
	                } else {
	                    var cbase = initialBase;
	                    toUnmount = initialChildComponent;
	                    if (toUnmount) cbase = component._component = null;
	                    if (initialBase || 1 === opts) {
	                        if (cbase) cbase._component = null;
	                        base = diff(cbase, rendered, context, mountAll || !isUpdate);
	                    }
	                }
	                if (initialBase && base !== initialBase) {
	                    if (baseParent && base !== baseParent) baseParent.insertBefore(base, nextSibling || null);
	                    if (!toUnmount && initialComponent === component && !initialChildComponent && initialBase.parentNode) {
	                        initialBase._component = null;
	                        recollectNodeTree(initialBase);
	                    }
	                }
	                if (toUnmount) unmountComponent(toUnmount, !0);
	                component.base = base;
	                if (base) {
	                    var componentRef = component, t = component;
	                    while (t = t._parentComponent) componentRef = t;
	                    base._component = componentRef;
	                    base._componentConstructor = componentRef.constructor;
	                }
	            }
	            if (!isUpdate || mountAll) {
	                mounts.unshift(component);
	                if (!diffLevel) flushMounts();
	            } else if (!skip && component.componentDidUpdate) component.componentDidUpdate(previousProps, previousState, previousContext);
	            var fn, cb = component._renderCallbacks;
	            if (cb) while (fn = cb.pop()) fn.call(component);
	            return rendered;
	        }
	    }
	    function buildComponentFromVNode(dom, vnode, context, mountAll) {
	        var c = dom && dom._component, oldDom = dom, isDirectOwner = c && dom._componentConstructor === vnode.nodeName, isOwner = isDirectOwner, props = getNodeProps(vnode);
	        while (c && !isOwner && (c = c._parentComponent)) isOwner = c.constructor === vnode.nodeName;
	        if (isOwner && (!mountAll || c._component)) {
	            setComponentProps(c, props, 3, context, mountAll);
	            dom = c.base;
	        } else {
	            if (c && !isDirectOwner) {
	                unmountComponent(c, !0);
	                dom = oldDom = null;
	            }
	            c = createComponent(vnode.nodeName, props, context);
	            if (dom && !c.nextBase) c.nextBase = dom;
	            setComponentProps(c, props, 1, context, mountAll);
	            dom = c.base;
	            if (oldDom && dom !== oldDom) {
	                oldDom._component = null;
	                recollectNodeTree(oldDom);
	            }
	        }
	        return dom;
	    }
	    function unmountComponent(component, remove) {
	        var base = component.base;
	        component._disableRendering = !0;
	        if (component.componentWillUnmount) component.componentWillUnmount();
	        component.base = null;
	        var inner = component._component;
	        if (inner) unmountComponent(inner, remove); else if (base) {
	            if (base[ATTR_KEY] && base[ATTR_KEY].ref) base[ATTR_KEY].ref(null);
	            component.nextBase = base;
	            if (remove) {
	                removeNode(base);
	                collectComponent(component);
	            }
	            removeOrphanedChildren(base.childNodes, !remove);
	        }
	        if (component.__ref) component.__ref(null);
	        if (component.componentDidUnmount) component.componentDidUnmount();
	    }
	    function Component(props, context) {
	        this._dirty = !0;
	        this._disableRendering = !1;
	        this.prevState = this.prevProps = this.prevContext = this.base = this.nextBase = this._parentComponent = this._component = this.__ref = this.__key = this._linkedStates = this._renderCallbacks = null;
	        this.context = context || {};
	        this.props = props;
	        this.state = this.getInitialState && this.getInitialState() || {};
	    }
	    function render(vnode, parent, merge) {
	        return diff(merge, vnode, {}, !1, parent);
	    }
	    var lcCache = {};
	    var toLowerCase = function(s) {
	        return lcCache[s] || (lcCache[s] = s.toLowerCase());
	    };
	    var resolved = 'undefined' != typeof Promise && Promise.resolve();
	    var setImmediate = resolved ? function(f) {
	        resolved.then(f);
	    } : setTimeout;
	    var options = {
	        vnode: empty
	    };
	    var SHARED_TEMP_ARRAY = [];
	    var EMPTY = {};
	    var ATTR_KEY = 'undefined' != typeof Symbol ? Symbol.for('preactattr') : '__preactattr_';
	    var NON_DIMENSION_PROPS = {
	        boxFlex: 1,
	        boxFlexGroup: 1,
	        columnCount: 1,
	        fillOpacity: 1,
	        flex: 1,
	        flexGrow: 1,
	        flexPositive: 1,
	        flexShrink: 1,
	        flexNegative: 1,
	        fontWeight: 1,
	        lineClamp: 1,
	        lineHeight: 1,
	        opacity: 1,
	        order: 1,
	        orphans: 1,
	        strokeOpacity: 1,
	        widows: 1,
	        zIndex: 1,
	        zoom: 1
	    };
	    var items = [];
	    var itemsOffline = [];
	    var nodes = {};
	    var mounts = [];
	    var diffLevel = 0;
	    var isSvgMode = !1;
	    var components = {};
	    extend(Component.prototype, {
	        linkState: function(key, eventPath) {
	            var c = this._linkedStates || (this._linkedStates = {}), cacheKey = key + '|' + eventPath;
	            return c[cacheKey] || (c[cacheKey] = createLinkedState(this, key, eventPath));
	        },
	        setState: function(state, callback) {
	            var s = this.state;
	            if (!this.prevState) this.prevState = clone(s);
	            extend(s, isFunction(state) ? state(s, this.props) : state);
	            if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
	            triggerComponentRender(this);
	        },
	        forceUpdate: function() {
	            renderComponent(this, 2);
	        },
	        render: function() {
	            return null;
	        }
	    });
	    exports.h = h;
	    exports.cloneElement = cloneElement;
	    exports.Component = Component;
	    exports.render = render;
	    exports.rerender = rerender;
	    exports.options = options;
	});
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(49).setImmediate))

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(50).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;
	
	// DOM APIs, for completeness
	
	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };
	
	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};
	
	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};
	
	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};
	
	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);
	
	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};
	
	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);
	
	  immediateIds[id] = true;
	
	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });
	
	  return id;
	};
	
	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(49).setImmediate, __webpack_require__(49).clearImmediate))

/***/ },
/* 50 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	(function () {
	  try {
	    cachedSetTimeout = setTimeout;
	  } catch (e) {
	    cachedSetTimeout = function () {
	      throw new Error('setTimeout is not defined');
	    }
	  }
	  try {
	    cachedClearTimeout = clearTimeout;
	  } catch (e) {
	    cachedClearTimeout = function () {
	      throw new Error('clearTimeout is not defined');
	    }
	  }
	} ())
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = cachedSetTimeout.call(null, cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    cachedClearTimeout.call(null, timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        cachedSetTimeout.call(null, drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	exports.__esModule = true;
	exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;
	
	var _createStore = __webpack_require__(52);
	
	var _createStore2 = _interopRequireDefault(_createStore);
	
	var _combineReducers = __webpack_require__(60);
	
	var _combineReducers2 = _interopRequireDefault(_combineReducers);
	
	var _bindActionCreators = __webpack_require__(62);
	
	var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);
	
	var _applyMiddleware = __webpack_require__(63);
	
	var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);
	
	var _compose = __webpack_require__(64);
	
	var _compose2 = _interopRequireDefault(_compose);
	
	var _warning = __webpack_require__(61);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	/*
	* This is a dummy function to check if the function name has been altered by minification.
	* If the function has been minified and NODE_ENV !== 'production', warn the user.
	*/
	function isCrushed() {}
	
	if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
	  (0, _warning2["default"])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
	}
	
	exports.createStore = _createStore2["default"];
	exports.combineReducers = _combineReducers2["default"];
	exports.bindActionCreators = _bindActionCreators2["default"];
	exports.applyMiddleware = _applyMiddleware2["default"];
	exports.compose = _compose2["default"];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(50)))

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.ActionTypes = undefined;
	exports["default"] = createStore;
	
	var _isPlainObject = __webpack_require__(53);
	
	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);
	
	var _symbolObservable = __webpack_require__(58);
	
	var _symbolObservable2 = _interopRequireDefault(_symbolObservable);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var ActionTypes = exports.ActionTypes = {
	  INIT: '@@redux/INIT'
	};
	
	/**
	 * Creates a Redux store that holds the state tree.
	 * The only way to change the data in the store is to call `dispatch()` on it.
	 *
	 * There should only be a single store in your app. To specify how different
	 * parts of the state tree respond to actions, you may combine several reducers
	 * into a single reducer function by using `combineReducers`.
	 *
	 * @param {Function} reducer A function that returns the next state tree, given
	 * the current state tree and the action to handle.
	 *
	 * @param {any} [initialState] The initial state. You may optionally specify it
	 * to hydrate the state from the server in universal apps, or to restore a
	 * previously serialized user session.
	 * If you use `combineReducers` to produce the root reducer function, this must be
	 * an object with the same shape as `combineReducers` keys.
	 *
	 * @param {Function} enhancer The store enhancer. You may optionally specify it
	 * to enhance the store with third-party capabilities such as middleware,
	 * time travel, persistence, etc. The only store enhancer that ships with Redux
	 * is `applyMiddleware()`.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */
	function createStore(reducer, initialState, enhancer) {
	  var _ref2;
	
	  if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
	    enhancer = initialState;
	    initialState = undefined;
	  }
	
	  if (typeof enhancer !== 'undefined') {
	    if (typeof enhancer !== 'function') {
	      throw new Error('Expected the enhancer to be a function.');
	    }
	
	    return enhancer(createStore)(reducer, initialState);
	  }
	
	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }
	
	  var currentReducer = reducer;
	  var currentState = initialState;
	  var currentListeners = [];
	  var nextListeners = currentListeners;
	  var isDispatching = false;
	
	  function ensureCanMutateNextListeners() {
	    if (nextListeners === currentListeners) {
	      nextListeners = currentListeners.slice();
	    }
	  }
	
	  /**
	   * Reads the state tree managed by the store.
	   *
	   * @returns {any} The current state tree of your application.
	   */
	  function getState() {
	    return currentState;
	  }
	
	  /**
	   * Adds a change listener. It will be called any time an action is dispatched,
	   * and some part of the state tree may potentially have changed. You may then
	   * call `getState()` to read the current state tree inside the callback.
	   *
	   * You may call `dispatch()` from a change listener, with the following
	   * caveats:
	   *
	   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
	   * If you subscribe or unsubscribe while the listeners are being invoked, this
	   * will not have any effect on the `dispatch()` that is currently in progress.
	   * However, the next `dispatch()` call, whether nested or not, will use a more
	   * recent snapshot of the subscription list.
	   *
	   * 2. The listener should not expect to see all state changes, as the state
	   * might have been updated multiple times during a nested `dispatch()` before
	   * the listener is called. It is, however, guaranteed that all subscribers
	   * registered before the `dispatch()` started will be called with the latest
	   * state by the time it exits.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */
	  function subscribe(listener) {
	    if (typeof listener !== 'function') {
	      throw new Error('Expected listener to be a function.');
	    }
	
	    var isSubscribed = true;
	
	    ensureCanMutateNextListeners();
	    nextListeners.push(listener);
	
	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
	      }
	
	      isSubscribed = false;
	
	      ensureCanMutateNextListeners();
	      var index = nextListeners.indexOf(listener);
	      nextListeners.splice(index, 1);
	    };
	  }
	
	  /**
	   * Dispatches an action. It is the only way to trigger a state change.
	   *
	   * The `reducer` function, used to create the store, will be called with the
	   * current state tree and the given `action`. Its return value will
	   * be considered the **next** state of the tree, and the change listeners
	   * will be notified.
	   *
	   * The base implementation only supports plain object actions. If you want to
	   * dispatch a Promise, an Observable, a thunk, or something else, you need to
	   * wrap your store creating function into the corresponding middleware. For
	   * example, see the documentation for the `redux-thunk` package. Even the
	   * middleware will eventually dispatch plain object actions using this method.
	   *
	   * @param {Object} action A plain object representing “what changed”. It is
	   * a good idea to keep actions serializable so you can record and replay user
	   * sessions, or use the time travelling `redux-devtools`. An action must have
	   * a `type` property which may not be `undefined`. It is a good idea to use
	   * string constants for action types.
	   *
	   * @returns {Object} For convenience, the same action object you dispatched.
	   *
	   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
	   * return something else (for example, a Promise you can await).
	   */
	  function dispatch(action) {
	    if (!(0, _isPlainObject2["default"])(action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }
	
	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }
	
	    if (isDispatching) {
	      throw new Error('Reducers may not dispatch actions.');
	    }
	
	    try {
	      isDispatching = true;
	      currentState = currentReducer(currentState, action);
	    } finally {
	      isDispatching = false;
	    }
	
	    var listeners = currentListeners = nextListeners;
	    for (var i = 0; i < listeners.length; i++) {
	      listeners[i]();
	    }
	
	    return action;
	  }
	
	  /**
	   * Replaces the reducer currently used by the store to calculate the state.
	   *
	   * You might need this if your app implements code splitting and you want to
	   * load some of the reducers dynamically. You might also need this if you
	   * implement a hot reloading mechanism for Redux.
	   *
	   * @param {Function} nextReducer The reducer for the store to use instead.
	   * @returns {void}
	   */
	  function replaceReducer(nextReducer) {
	    if (typeof nextReducer !== 'function') {
	      throw new Error('Expected the nextReducer to be a function.');
	    }
	
	    currentReducer = nextReducer;
	    dispatch({ type: ActionTypes.INIT });
	  }
	
	  /**
	   * Interoperability point for observable/reactive libraries.
	   * @returns {observable} A minimal observable of state changes.
	   * For more information, see the observable proposal:
	   * https://github.com/zenparsing/es-observable
	   */
	  function observable() {
	    var _ref;
	
	    var outerSubscribe = subscribe;
	    return _ref = {
	      /**
	       * The minimal observable subscription method.
	       * @param {Object} observer Any object that can be used as an observer.
	       * The observer object should have a `next` method.
	       * @returns {subscription} An object with an `unsubscribe` method that can
	       * be used to unsubscribe the observable from the store, and prevent further
	       * emission of values from the observable.
	       */
	
	      subscribe: function subscribe(observer) {
	        if (typeof observer !== 'object') {
	          throw new TypeError('Expected the observer to be an object.');
	        }
	
	        function observeState() {
	          if (observer.next) {
	            observer.next(getState());
	          }
	        }
	
	        observeState();
	        var unsubscribe = outerSubscribe(observeState);
	        return { unsubscribe: unsubscribe };
	      }
	    }, _ref[_symbolObservable2["default"]] = function () {
	      return this;
	    }, _ref;
	  }
	
	  // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.
	  dispatch({ type: ActionTypes.INIT });
	
	  return _ref2 = {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  }, _ref2[_symbolObservable2["default"]] = observable, _ref2;
	}

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var getPrototype = __webpack_require__(54),
	    isHostObject = __webpack_require__(56),
	    isObjectLike = __webpack_require__(57);
	
	/** `Object#toString` result references. */
	var objectTag = '[object Object]';
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var funcToString = Function.prototype.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object,
	 *  else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike(value) ||
	      objectToString.call(value) != objectTag || isHostObject(value)) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return (typeof Ctor == 'function' &&
	    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
	}
	
	module.exports = isPlainObject;


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var overArg = __webpack_require__(55);
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetPrototype = Object.getPrototypeOf;
	
	/**
	 * Gets the `[[Prototype]]` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {null|Object} Returns the `[[Prototype]]`.
	 */
	var getPrototype = overArg(nativeGetPrototype, Object);
	
	module.exports = getPrototype;


/***/ },
/* 55 */
/***/ function(module, exports) {

	/**
	 * Creates a function that invokes `func` with its first argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}
	
	module.exports = overArg;


/***/ },
/* 56 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}
	
	module.exports = isHostObject;


/***/ },
/* 57 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	module.exports = isObjectLike;


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/* global window */
	'use strict';
	
	module.exports = __webpack_require__(59)(global || window || this);
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 59 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function symbolObservablePonyfill(root) {
		var result;
		var Symbol = root.Symbol;
	
		if (typeof Symbol === 'function') {
			if (Symbol.observable) {
				result = Symbol.observable;
			} else {
				result = Symbol('observable');
				Symbol.observable = result;
			}
		} else {
			result = '@@observable';
		}
	
		return result;
	};


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	exports.__esModule = true;
	exports["default"] = combineReducers;
	
	var _createStore = __webpack_require__(52);
	
	var _isPlainObject = __webpack_require__(53);
	
	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);
	
	var _warning = __webpack_require__(61);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	function getUndefinedStateErrorMessage(key, action) {
	  var actionType = action && action.type;
	  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';
	
	  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
	}
	
	function getUnexpectedStateShapeWarningMessage(inputState, reducers, action) {
	  var reducerKeys = Object.keys(reducers);
	  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';
	
	  if (reducerKeys.length === 0) {
	    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
	  }
	
	  if (!(0, _isPlainObject2["default"])(inputState)) {
	    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
	  }
	
	  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
	    return !reducers.hasOwnProperty(key);
	  });
	
	  if (unexpectedKeys.length > 0) {
	    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
	  }
	}
	
	function assertReducerSanity(reducers) {
	  Object.keys(reducers).forEach(function (key) {
	    var reducer = reducers[key];
	    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });
	
	    if (typeof initialState === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
	    }
	
	    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
	    if (typeof reducer(undefined, { type: type }) === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
	    }
	  });
	}
	
	/**
	 * Turns an object whose values are different reducer functions, into a single
	 * reducer function. It will call every child reducer, and gather their results
	 * into a single state object, whose keys correspond to the keys of the passed
	 * reducer functions.
	 *
	 * @param {Object} reducers An object whose values correspond to different
	 * reducer functions that need to be combined into one. One handy way to obtain
	 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
	 * undefined for any action. Instead, they should return their initial state
	 * if the state passed to them was undefined, and the current state for any
	 * unrecognized action.
	 *
	 * @returns {Function} A reducer function that invokes every reducer inside the
	 * passed object, and builds a state object with the same shape.
	 */
	function combineReducers(reducers) {
	  var reducerKeys = Object.keys(reducers);
	  var finalReducers = {};
	  for (var i = 0; i < reducerKeys.length; i++) {
	    var key = reducerKeys[i];
	    if (typeof reducers[key] === 'function') {
	      finalReducers[key] = reducers[key];
	    }
	  }
	  var finalReducerKeys = Object.keys(finalReducers);
	
	  var sanityError;
	  try {
	    assertReducerSanity(finalReducers);
	  } catch (e) {
	    sanityError = e;
	  }
	
	  return function combination() {
	    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var action = arguments[1];
	
	    if (sanityError) {
	      throw sanityError;
	    }
	
	    if (process.env.NODE_ENV !== 'production') {
	      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action);
	      if (warningMessage) {
	        (0, _warning2["default"])(warningMessage);
	      }
	    }
	
	    var hasChanged = false;
	    var nextState = {};
	    for (var i = 0; i < finalReducerKeys.length; i++) {
	      var key = finalReducerKeys[i];
	      var reducer = finalReducers[key];
	      var previousStateForKey = state[key];
	      var nextStateForKey = reducer(previousStateForKey, action);
	      if (typeof nextStateForKey === 'undefined') {
	        var errorMessage = getUndefinedStateErrorMessage(key, action);
	        throw new Error(errorMessage);
	      }
	      nextState[key] = nextStateForKey;
	      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
	    }
	    return hasChanged ? nextState : state;
	  };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(50)))

/***/ },
/* 61 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports["default"] = warning;
	/**
	 * Prints a warning in the console if it exists.
	 *
	 * @param {String} message The warning message.
	 * @returns {void}
	 */
	function warning(message) {
	  /* eslint-disable no-console */
	  if (typeof console !== 'undefined' && typeof console.error === 'function') {
	    console.error(message);
	  }
	  /* eslint-enable no-console */
	  try {
	    // This error was thrown as a convenience so that if you enable
	    // "break on all exceptions" in your console,
	    // it would pause the execution at this line.
	    throw new Error(message);
	    /* eslint-disable no-empty */
	  } catch (e) {}
	  /* eslint-enable no-empty */
	}

/***/ },
/* 62 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports["default"] = bindActionCreators;
	function bindActionCreator(actionCreator, dispatch) {
	  return function () {
	    return dispatch(actionCreator.apply(undefined, arguments));
	  };
	}
	
	/**
	 * Turns an object whose values are action creators, into an object with the
	 * same keys, but with every function wrapped into a `dispatch` call so they
	 * may be invoked directly. This is just a convenience method, as you can call
	 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
	 *
	 * For convenience, you can also pass a single function as the first argument,
	 * and get a function in return.
	 *
	 * @param {Function|Object} actionCreators An object whose values are action
	 * creator functions. One handy way to obtain it is to use ES6 `import * as`
	 * syntax. You may also pass a single function.
	 *
	 * @param {Function} dispatch The `dispatch` function available on your Redux
	 * store.
	 *
	 * @returns {Function|Object} The object mimicking the original object, but with
	 * every action creator wrapped into the `dispatch` call. If you passed a
	 * function as `actionCreators`, the return value will also be a single
	 * function.
	 */
	function bindActionCreators(actionCreators, dispatch) {
	  if (typeof actionCreators === 'function') {
	    return bindActionCreator(actionCreators, dispatch);
	  }
	
	  if (typeof actionCreators !== 'object' || actionCreators === null) {
	    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
	  }
	
	  var keys = Object.keys(actionCreators);
	  var boundActionCreators = {};
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    var actionCreator = actionCreators[key];
	    if (typeof actionCreator === 'function') {
	      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
	    }
	  }
	  return boundActionCreators;
	}

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports["default"] = applyMiddleware;
	
	var _compose = __webpack_require__(64);
	
	var _compose2 = _interopRequireDefault(_compose);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	/**
	 * Creates a store enhancer that applies middleware to the dispatch method
	 * of the Redux store. This is handy for a variety of tasks, such as expressing
	 * asynchronous actions in a concise manner, or logging every action payload.
	 *
	 * See `redux-thunk` package as an example of the Redux middleware.
	 *
	 * Because middleware is potentially asynchronous, this should be the first
	 * store enhancer in the composition chain.
	 *
	 * Note that each middleware will be given the `dispatch` and `getState` functions
	 * as named arguments.
	 *
	 * @param {...Function} middlewares The middleware chain to be applied.
	 * @returns {Function} A store enhancer applying the middleware.
	 */
	function applyMiddleware() {
	  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }
	
	  return function (createStore) {
	    return function (reducer, initialState, enhancer) {
	      var store = createStore(reducer, initialState, enhancer);
	      var _dispatch = store.dispatch;
	      var chain = [];
	
	      var middlewareAPI = {
	        getState: store.getState,
	        dispatch: function dispatch(action) {
	          return _dispatch(action);
	        }
	      };
	      chain = middlewares.map(function (middleware) {
	        return middleware(middlewareAPI);
	      });
	      _dispatch = _compose2["default"].apply(undefined, chain)(store.dispatch);
	
	      return _extends({}, store, {
	        dispatch: _dispatch
	      });
	    };
	  };
	}

/***/ },
/* 64 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports["default"] = compose;
	/**
	 * Composes single-argument functions from right to left. The rightmost
	 * function can take multiple arguments as it provides the signature for
	 * the resulting composite function.
	 *
	 * @param {...Function} funcs The functions to compose.
	 * @returns {Function} A function obtained by composing the argument functions
	 * from right to left. For example, compose(f, g, h) is identical to doing
	 * (...args) => f(g(h(...args))).
	 */
	
	function compose() {
	  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }
	
	  if (funcs.length === 0) {
	    return function (arg) {
	      return arg;
	    };
	  } else {
	    var _ret = function () {
	      var last = funcs[funcs.length - 1];
	      var rest = funcs.slice(0, -1);
	      return {
	        v: function v() {
	          return rest.reduceRight(function (composed, f) {
	            return f(composed);
	          }, last.apply(undefined, arguments));
	        }
	      };
	    }();
	
	    if (typeof _ret === "object") return _ret.v;
	  }
	}

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _getPrototypeOf = __webpack_require__(66);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(42);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(43);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(71);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(106);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _preact = __webpack_require__(48);
	
	var _constants = __webpack_require__(114);
	
	var _constants2 = _interopRequireDefault(_constants);
	
	var _hammerjs = __webpack_require__(115);
	
	var _hammerjs2 = _interopRequireDefault(_hammerjs);
	
	var _propagating = __webpack_require__(116);
	
	var _propagating2 = _interopRequireDefault(_propagating);
	
	var _reduxUndo = __webpack_require__(117);
	
	var _curveEditorRight = __webpack_require__(118);
	
	var _curveEditorRight2 = _interopRequireDefault(_curveEditorRight);
	
	var _curveEditorLeft = __webpack_require__(160);
	
	var _curveEditorLeft2 = _interopRequireDefault(_curveEditorLeft);
	
	var _codePanel = __webpack_require__(176);
	
	var _codePanel2 = _interopRequireDefault(_codePanel);
	
	var _icons = __webpack_require__(180);
	
	var _icons2 = _interopRequireDefault(_icons);
	
	var _resizeMod = __webpack_require__(143);
	
	var _resizeMod2 = _interopRequireDefault(_resizeMod);
	
	var _addPointerDown = __webpack_require__(134);
	
	var _addPointerDown2 = _interopRequireDefault(_addPointerDown);
	
	var _points = __webpack_require__(181);
	
	var _activePool = __webpack_require__(182);
	
	var _activePool2 = _interopRequireDefault(_activePool);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	__webpack_require__(183);
	
	var CurveEditor = function (_Component) {
	  (0, _inherits3.default)(CurveEditor, _Component);
	
	  function CurveEditor() {
	    (0, _classCallCheck3.default)(this, CurveEditor);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(CurveEditor).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(CurveEditor, [{
	    key: 'render',
	    value: function render() {
	      var CLASSES = __webpack_require__(159);
	
	      var store = this.context.store;
	
	      var state = store.getState();
	      this._state = state;
	
	      var p = this.props;
	      var options = p.options;
	      var _state$controls = state.controls;
	      var isMinimize = _state$controls.isMinimize;
	      var isActive = _state$controls.isActive;
	      var isHighlight = _state$controls.isHighlight;
	
	      var style = this._getStyle(state);
	
	      var className = '' + CLASSES['curve-editor'];
	      className += isMinimize ? ' ' + CLASSES['is-minimized'] : '';
	      className += !isActive ? ' ' + CLASSES['is-inactive'] : '';
	      className += isHighlight ? ' ' + CLASSES['is-highlighted'] : '';
	      className += options.isHiddenOnMin ? ' ' + CLASSES['is-hidden-on-min'] : '';
	
	      this._state = state;
	      return (0, _preact.h)(
	        'div',
	        { className: className, style: style },
	        (0, _preact.h)(_icons2.default, null),
	        (0, _preact.h)(_codePanel2.default, { state: state }),
	        (0, _preact.h)(_curveEditorLeft2.default, { state: state }),
	        (0, _preact.h)(_curveEditorRight2.default, { state: state,
	          progressLines: p.progressLines,
	          options: options })
	      );
	    }
	  }, {
	    key: '_getStyle',
	    value: function _getStyle(state) {
	      var _state$controls2 = this._state.controls;
	      var isMinimize = _state$controls2.isMinimize;
	      var isActive = _state$controls2.isActive;
	      var X_SIZE = _constants2.default.CURVE_SIZE + 53;
	      var Y_SIZE = _constants2.default.CURVE_SIZE + 2 * _constants2.default.CURVE_PADDING;
	      var resize = state.resize;
	      var temp_top = resize.temp_top;
	      var temp_bottom = resize.temp_bottom;
	      var temp_right = resize.temp_right;
	      var translate = resize.translate;
	
	
	      temp_top += resize.top;
	      temp_bottom += resize.bottom;
	      temp_right += resize.right;
	
	      var height = 'height: ' + (Y_SIZE - temp_top + temp_bottom) + 'px',
	          width = 'width: ' + (X_SIZE + temp_right) + 'px',
	          x = resize.x + resize.tempX,
	          y = resize.y + resize.tempY,
	          transform = 'transform: translate(' + x + 'px, ' + (y + temp_top) + 'px)';
	
	      return '' + mojs.h.prefix.css + transform + '; ' + transform + '; ' + width + '; ' + height + ';';
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this._resetCounter = 0;
	
	      var store = this.context.store;
	      var el = this.base.querySelector('#js-left-panel');
	      var mc = (0, _propagating2.default)(new _hammerjs2.default.Manager(el));
	
	      mc.add(new _hammerjs2.default.Pan({ threshold: 0 }));
	      mc.on('pan', function (e) {
	        var x = e.deltaX,
	            y = e.deltaY;
	        store.dispatch({ type: 'EDITOR_TRANSLATE', data: { x: x, y: y } });
	      }).on('panend', function (e) {
	        var x = e.deltaX,
	            y = e.deltaY;
	        store.dispatch({ type: 'EDITOR_TRANSLATE_END', data: { x: x, y: y } });
	      });
	
	      this._addKeyUp();
	      this._subscribeFocus();
	      store.subscribe(this.forceUpdate.bind(this));
	    }
	  }, {
	    key: '_addKeyUp',
	    value: function _addKeyUp() {
	      document.addEventListener('keyup', this._onKeyUp.bind(this));
	    }
	  }, {
	    key: '_onKeyUp',
	    value: function _onKeyUp(e) {
	      var store = this.context.store;
	      var controls = this._state.controls;
	      // don't react on shortcuts if inactive or minimized
	
	      if (!controls.isActive || controls.isMinimize) {
	        return;
	      }
	      // don't react if `alt` key is not set
	      if (!e.altKey) {
	        return;
	      }
	      switch (e.which) {
	        // z
	        case 90:
	          {
	            return store.dispatch(_reduxUndo.ActionCreators.undo());
	          }
	        // x
	        case 88:
	          {
	            return store.dispatch(_reduxUndo.ActionCreators.redo());
	          }
	        // d
	        case 68:
	          {
	            return store.dispatch({ type: 'POINT_DELETE' });
	          }
	        // \
	        case 220:
	          {
	            return e.shiftKey && this._tryToReset(store);
	          }
	      }
	    }
	  }, {
	    key: '_tryToReset',
	    value: function _tryToReset(store) {
	      var _this2 = this;
	
	      if (++this._resetCounter > 2) {
	        (0, _points.reset)(store);
	      }
	
	      clearTimeout(this._tm);
	      this._tm = setTimeout(function () {
	        _this2._resetCounter = 0;
	      }, 300);
	    }
	  }, {
	    key: '_subscribeFocus',
	    value: function _subscribeFocus() {
	      var _this3 = this;
	
	      this._createActivePool();
	      var store = this.context.store;
	
	      (0, _addPointerDown2.default)(this.base, function (e) {
	        var pool = mojs[_constants2.default['ACTIVE_POOL_NAME']];
	        pool && pool.resetActive(_this3);
	        if (!_this3._state.controls.isActive) {
	          store.dispatch({ type: 'SET_ACTIVE', data: true });
	        }
	      });
	    }
	  }, {
	    key: '_getPool',
	    value: function _getPool() {
	      var activePool = null;
	      if (!mojs[_constants2.default['ACTIVE_POOL_NAME']]) {
	        mojs[_constants2.default['ACTIVE_POOL_NAME']] = new _activePool2.default();
	      }
	      return mojs[_constants2.default['ACTIVE_POOL_NAME']];
	    }
	  }, {
	    key: '_createActivePool',
	    value: function _createActivePool() {
	      var activePool = this._getPool();
	      activePool.add(this._setInactive.bind(this));
	      mojs[_constants2.default['ACTIVE_POOL_NAME']] = activePool;
	    }
	  }, {
	    key: '_setInactive',
	    value: function _setInactive(module) {
	      var store = this.context.store;
	
	      if (module !== this) {
	        store.dispatch({ type: 'SET_ACTIVE', data: false });
	      }
	    }
	  }]);
	  return CurveEditor;
	}(_preact.Component);
	
	exports.default = CurveEditor;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(67), __esModule: true };

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(68);
	module.exports = __webpack_require__(4).Object.getPrototypeOf;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(41)
	  , $getPrototypeOf = __webpack_require__(69);
	
	__webpack_require__(70)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(26)
	  , toObject    = __webpack_require__(41)
	  , IE_PROTO    = __webpack_require__(35)('IE_PROTO')
	  , ObjectProto = Object.prototype;
	
	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(9)
	  , core    = __webpack_require__(4)
	  , fails   = __webpack_require__(19);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _typeof2 = __webpack_require__(72);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }
	
	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _iterator = __webpack_require__(73);
	
	var _iterator2 = _interopRequireDefault(_iterator);
	
	var _symbol = __webpack_require__(92);
	
	var _symbol2 = _interopRequireDefault(_symbol);
	
	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(74), __esModule: true };

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(75);
	__webpack_require__(87);
	module.exports = __webpack_require__(91).f('iterator');

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(76)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(77)(String, 'String', function(iterated){
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
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(33)
	  , defined   = __webpack_require__(30);
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
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(78)
	  , $export        = __webpack_require__(9)
	  , redefine       = __webpack_require__(79)
	  , hide           = __webpack_require__(13)
	  , has            = __webpack_require__(26)
	  , Iterators      = __webpack_require__(80)
	  , $iterCreate    = __webpack_require__(81)
	  , setToStringTag = __webpack_require__(85)
	  , getPrototypeOf = __webpack_require__(69)
	  , ITERATOR       = __webpack_require__(86)('iterator')
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
/* 78 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(13);

/***/ },
/* 80 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(82)
	  , descriptor     = __webpack_require__(22)
	  , setToStringTag = __webpack_require__(85)
	  , IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(13)(IteratorPrototype, __webpack_require__(86)('iterator'), function(){ return this; });
	
	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(15)
	  , dPs         = __webpack_require__(83)
	  , enumBugKeys = __webpack_require__(38)
	  , IE_PROTO    = __webpack_require__(35)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(20)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(84).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
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
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(14)
	  , anObject = __webpack_require__(15)
	  , getKeys  = __webpack_require__(24);
	
	module.exports = __webpack_require__(18) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(10).document && document.documentElement;

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(14).f
	  , has = __webpack_require__(26)
	  , TAG = __webpack_require__(86)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(36)('wks')
	  , uid        = __webpack_require__(37)
	  , Symbol     = __webpack_require__(10).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';
	
	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(88);
	var global        = __webpack_require__(10)
	  , hide          = __webpack_require__(13)
	  , Iterators     = __webpack_require__(80)
	  , TO_STRING_TAG = __webpack_require__(86)('toStringTag');
	
	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(89)
	  , step             = __webpack_require__(90)
	  , Iterators        = __webpack_require__(80)
	  , toIObject        = __webpack_require__(27);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(77)(Array, 'Array', function(iterated, kind){
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
/* 89 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 90 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(86);

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(93), __esModule: true };

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(94);
	__webpack_require__(103);
	__webpack_require__(104);
	__webpack_require__(105);
	module.exports = __webpack_require__(4).Symbol;

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(10)
	  , has            = __webpack_require__(26)
	  , DESCRIPTORS    = __webpack_require__(18)
	  , $export        = __webpack_require__(9)
	  , redefine       = __webpack_require__(79)
	  , META           = __webpack_require__(95).KEY
	  , $fails         = __webpack_require__(19)
	  , shared         = __webpack_require__(36)
	  , setToStringTag = __webpack_require__(85)
	  , uid            = __webpack_require__(37)
	  , wks            = __webpack_require__(86)
	  , wksExt         = __webpack_require__(91)
	  , wksDefine      = __webpack_require__(96)
	  , keyOf          = __webpack_require__(97)
	  , enumKeys       = __webpack_require__(98)
	  , isArray        = __webpack_require__(99)
	  , anObject       = __webpack_require__(15)
	  , toIObject      = __webpack_require__(27)
	  , toPrimitive    = __webpack_require__(21)
	  , createDesc     = __webpack_require__(22)
	  , _create        = __webpack_require__(82)
	  , gOPNExt        = __webpack_require__(100)
	  , $GOPD          = __webpack_require__(102)
	  , $DP            = __webpack_require__(14)
	  , $keys          = __webpack_require__(24)
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
	  __webpack_require__(101).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(40).f  = $propertyIsEnumerable;
	  __webpack_require__(39).f = $getOwnPropertySymbols;
	
	  if(DESCRIPTORS && !__webpack_require__(78)){
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
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(13)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(37)('meta')
	  , isObject = __webpack_require__(16)
	  , has      = __webpack_require__(26)
	  , setDesc  = __webpack_require__(14).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(19)(function(){
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
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(10)
	  , core           = __webpack_require__(4)
	  , LIBRARY        = __webpack_require__(78)
	  , wksExt         = __webpack_require__(91)
	  , defineProperty = __webpack_require__(14).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(24)
	  , toIObject = __webpack_require__(27);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(24)
	  , gOPS    = __webpack_require__(39)
	  , pIE     = __webpack_require__(40);
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
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(29);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(27)
	  , gOPN      = __webpack_require__(101).f
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
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(25)
	  , hiddenKeys = __webpack_require__(38).concat('length', 'prototype');
	
	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(40)
	  , createDesc     = __webpack_require__(22)
	  , toIObject      = __webpack_require__(27)
	  , toPrimitive    = __webpack_require__(21)
	  , has            = __webpack_require__(26)
	  , IE8_DOM_DEFINE = __webpack_require__(17)
	  , gOPD           = Object.getOwnPropertyDescriptor;
	
	exports.f = __webpack_require__(18) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 103 */
/***/ function(module, exports) {



/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(96)('asyncIterator');

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(96)('observable');

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _setPrototypeOf = __webpack_require__(107);
	
	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);
	
	var _create = __webpack_require__(111);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _typeof2 = __webpack_require__(72);
	
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
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(108), __esModule: true };

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(109);
	module.exports = __webpack_require__(4).Object.setPrototypeOf;

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(9);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(110).set});

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(16)
	  , anObject = __webpack_require__(15);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(11)(Function.call, __webpack_require__(102).f(Object.prototype, '__proto__').set, 2);
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
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(112), __esModule: true };

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(113);
	var $Object = __webpack_require__(4).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(9)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(82)});

/***/ },
/* 114 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var CURVE_SIZE = 350;
	
	exports.default = {
	  CURVE_SIZE: CURVE_SIZE,
	  RESIZE_NEGATIVE_OFFSET: 150,
	  CURVE_PERCENT: CURVE_SIZE / 100,
	  CURVE_PADDING: 10,
	  ACTIVE_POOL_NAME: '_mojsCurveEditorPool'
	};

/***/ },
/* 115 */
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
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	(function (factory) {
	  if (true) {
	    // AMD. Register as an anonymous module.
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    // Node. Does not work with strict CommonJS, but
	    // only CommonJS-like environments that support module.exports,
	    // like Node.
	    module.exports = factory();
	  } else {
	    // Browser globals (root is window)
	    window.propagating = factory();
	  }
	}(function () {
	  var _firstTarget = null; // singleton, will contain the target element where the touch event started
	
	  /**
	   * Extend an Hammer.js instance with event propagation.
	   *
	   * Features:
	   * - Events emitted by hammer will propagate in order from child to parent
	   *   elements.
	   * - Events are extended with a function `event.stopPropagation()` to stop
	   *   propagation to parent elements.
	   * - An option `preventDefault` to stop all default browser behavior.
	   *
	   * Usage:
	   *   var hammer = propagatingHammer(new Hammer(element));
	   *   var hammer = propagatingHammer(new Hammer(element), {preventDefault: true});
	   *
	   * @param {Hammer.Manager} hammer   An hammer instance.
	   * @param {Object} [options]        Available options:
	   *                                  - `preventDefault: true | false | 'mouse' | 'touch' | 'pen'`.
	   *                                    Enforce preventing the default browser behavior.
	   *                                    Cannot be set to `false`.
	   * @return {Hammer.Manager} Returns the same hammer instance with extended
	   *                          functionality
	   */
	  return function propagating(hammer, options) {
	    var _options = options || {
	      preventDefault: false
	    };
	
	    if (hammer.Manager) {
	      // This looks like the Hammer constructor.
	      // Overload the constructors with our own.
	      var Hammer = hammer;
	
	      var PropagatingHammer = function(element, options) {
	        var o = Object.create(_options);
	        if (options) Hammer.assign(o, options);
	        return propagating(new Hammer(element, o), o);
	      };
	      Hammer.assign(PropagatingHammer, Hammer);
	
	      PropagatingHammer.Manager = function (element, options) {
	        var o = Object.create(_options);
	        if (options) Hammer.assign(o, options);
	        return propagating(new Hammer.Manager(element, o), o);
	      };
	
	      return PropagatingHammer;
	    }
	
	    // create a wrapper object which will override the functions
	    // `on`, `off`, `destroy`, and `emit` of the hammer instance
	    var wrapper = Object.create(hammer);
	
	    // attach to DOM element
	    var element = hammer.element;
	
	    if(!element.hammer) element.hammer = [];
	    element.hammer.push(wrapper);
	
	    // register an event to catch the start of a gesture and store the
	    // target in a singleton
	    hammer.on('hammer.input', function (event) {
	      if (_options.preventDefault === true || (_options.preventDefault === event.pointerType)) {
	        event.preventDefault();
	      }
	      if (event.isFirst) {
	        _firstTarget = event.target;
	      }
	    });
	
	    /** @type {Object.<String, Array.<function>>} */
	    wrapper._handlers = {};
	
	    /**
	     * Register a handler for one or multiple events
	     * @param {String} events    A space separated string with events
	     * @param {function} handler A callback function, called as handler(event)
	     * @returns {Hammer.Manager} Returns the hammer instance
	     */
	    wrapper.on = function (events, handler) {
	      // register the handler
	      split(events).forEach(function (event) {
	        var _handlers = wrapper._handlers[event];
	        if (!_handlers) {
	          wrapper._handlers[event] = _handlers = [];
	
	          // register the static, propagated handler
	          hammer.on(event, propagatedHandler);
	        }
	        _handlers.push(handler);
	      });
	
	      return wrapper;
	    };
	
	    /**
	     * Unregister a handler for one or multiple events
	     * @param {String} events      A space separated string with events
	     * @param {function} [handler] Optional. The registered handler. If not
	     *                             provided, all handlers for given events
	     *                             are removed.
	     * @returns {Hammer.Manager}   Returns the hammer instance
	     */
	    wrapper.off = function (events, handler) {
	      // unregister the handler
	      split(events).forEach(function (event) {
	        var _handlers = wrapper._handlers[event];
	        if (_handlers) {
	          _handlers = handler ? _handlers.filter(function (h) {
	            return h !== handler;
	          }) : [];
	
	          if (_handlers.length > 0) {
	            wrapper._handlers[event] = _handlers;
	          }
	          else {
	            // remove static, propagated handler
	            hammer.off(event, propagatedHandler);
	            delete wrapper._handlers[event];
	          }
	        }
	      });
	
	      return wrapper;
	    };
	
	    /**
	     * Emit to the event listeners
	     * @param {string} eventType
	     * @param {Event} event
	     */
	    wrapper.emit = function(eventType, event) {
	      _firstTarget = _firstTarget || event.target;
	      hammer.emit(eventType, event);
	    };
	
	    wrapper.destroy = function () {
	      // Detach from DOM element
	      var hammers = hammer.element.hammer;
	      var idx = hammers.indexOf(wrapper);
	      if(idx !== -1) hammers.splice(idx,1);
	      if(!hammers.length) delete hammer.element.hammer;
	
	      // clear all handlers
	      wrapper._handlers = {};
	
	      // call original hammer destroy
	      hammer.destroy();
	    };
	
	    // split a string with space separated words
	    function split(events) {
	      return events.match(/[^ ]+/g);
	    }
	
	    /**
	     * A static event handler, applying event propagation.
	     * @param {Object} event
	     */
	    function propagatedHandler(event) {
	      // let only a single hammer instance handle this event
	      if (event.type !== 'hammer.input') {
	        // it is possible that the same srcEvent is used with multiple hammer events,
	        // we keep track on which events are handled in an object _handled
	        if (!event.srcEvent._handled) {
	          event.srcEvent._handled = {};
	        }
	
	        if (event.srcEvent._handled[event.type]) {
	          return;
	        }
	        else {
	          event.srcEvent._handled[event.type] = true;
	        }
	      }
	
	      // attach a stopPropagation function to the event
	      var stopped = false;
	      event.stopPropagation = function () {
	        stopped = true;
	      };
	
	      //wrap the srcEvent's stopPropagation to also stop hammer propagation:
	      var srcStop = event.srcEvent.stopPropagation.bind(event.srcEvent);
	      if(typeof srcStop == "function") {
	        event.srcEvent.stopPropagation = function(){
	          srcStop();
	          event.stopPropagation();
	        }
	      }
	
	      // attach firstTarget property to the event
	      event.firstTarget = _firstTarget;
	
	      // propagate over all elements (until stopped)
	      var elem = _firstTarget;
	      while (elem && !stopped) {
	        var elemHammer = elem.hammer;
	        if(elemHammer){
	          var _handlers;
	          for(var k = 0; k < elemHammer.length; k++){
	            _handlers = elemHammer[k]._handlers[event.type];
	            if(_handlers) for (var i = 0; i < _handlers.length && !stopped; i++) {
	              _handlers[i](event);
	            }
	          }
	        }
	        elem = elem.parentNode;
	      }
	    }
	
	    return wrapper;
	  };
	}));


/***/ },
/* 117 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.parseActions = parseActions;
	exports.default = undoable;
	exports.distinctState = distinctState;
	exports.includeAction = includeAction;
	exports.ifAction = ifAction;
	exports.excludeAction = excludeAction;
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	// debug output
	var __DEBUG__ = undefined;
	function debug() {
	  if (__DEBUG__) {
	    var _console;
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    if (!console.group) {
	      args.unshift('%credux-undo', 'font-style: italic');
	    }
	    (_console = console).log.apply(_console, args);
	  }
	}
	function debugStart(action, state) {
	  if (__DEBUG__) {
	    var args = ['action', action.type];
	    if (console.group) {
	      var _console2;
	
	      args.unshift('%credux-undo', 'font-style: italic');
	      (_console2 = console).groupCollapsed.apply(_console2, args);
	      console.log('received', { state: state, action: action });
	    } else {
	      debug.apply(undefined, args);
	    }
	  }
	}
	function debugEnd() {
	  if (__DEBUG__) {
	    return console.groupEnd && console.groupEnd();
	  }
	}
	// /debug output
	
	// action types
	var ActionTypes = exports.ActionTypes = {
	  UNDO: '@@redux-undo/UNDO',
	  REDO: '@@redux-undo/REDO',
	  JUMP_TO_FUTURE: '@@redux-undo/JUMP_TO_FUTURE',
	  JUMP_TO_PAST: '@@redux-undo/JUMP_TO_PAST'
	};
	// /action types
	
	// action creators to change the state
	var ActionCreators = exports.ActionCreators = {
	  undo: function undo() {
	    return { type: ActionTypes.UNDO };
	  },
	  redo: function redo() {
	    return { type: ActionTypes.REDO };
	  },
	  jumpToFuture: function jumpToFuture(index) {
	    return { type: ActionTypes.JUMP_TO_FUTURE, index: index };
	  },
	  jumpToPast: function jumpToPast(index) {
	    return { type: ActionTypes.JUMP_TO_PAST, index: index };
	  }
	};
	// /action creators
	
	// length: get length of history
	function length(history) {
	  var past = history.past;
	  var future = history.future;
	
	  return past.length + 1 + future.length;
	}
	// /length
	
	// insert: insert `state` into history, which means adding the current state
	//         into `past`, setting the new `state` as `present` and erasing
	//         the `future`.
	function insert(history, state, limit) {
	  debug('insert', { state: state, history: history, free: limit - length(history) });
	
	  var past = history.past;
	  var present = history.present;
	
	  var historyOverflow = limit && length(history) >= limit;
	
	  if (present === undefined) {
	    // init history
	    return {
	      past: [],
	      present: state,
	      future: []
	    };
	  }
	
	  return {
	    past: [].concat(_toConsumableArray(past.slice(historyOverflow ? 1 : 0)), [present]),
	    present: state,
	    future: []
	  };
	}
	// /insert
	
	// undo: go back to the previous point in history
	function undo(history) {
	  debug('undo', { history: history });
	
	  var past = history.past;
	  var present = history.present;
	  var future = history.future;
	
	
	  if (past.length <= 0) return history;
	
	  return {
	    past: past.slice(0, past.length - 1), // remove last element from past
	    present: past[past.length - 1], // set element as new present
	    future: [present].concat(_toConsumableArray(future))
	  };
	}
	// /undo
	
	// redo: go to the next point in history
	function redo(history) {
	  debug('redo', { history: history });
	
	  var past = history.past;
	  var present = history.present;
	  var future = history.future;
	
	
	  if (future.length <= 0) return history;
	
	  return {
	    future: future.slice(1, future.length), // remove element from future
	    present: future[0], // set element as new present
	    past: [].concat(_toConsumableArray(past), [present // old present state is in the past now
	    ])
	  };
	}
	// /redo
	
	// jumpToFuture: jump to requested index in future history
	function jumpToFuture(history, index) {
	  if (index === 0) return redo(history);
	
	  var past = history.past;
	  var present = history.present;
	  var future = history.future;
	
	
	  return {
	    future: future.slice(index + 1),
	    present: future[index],
	    past: past.concat([present]).concat(future.slice(0, index))
	  };
	}
	// /jumpToFuture
	
	// jumpToPast: jump to requested index in past history
	function jumpToPast(history, index) {
	  if (index === history.past.length - 1) return undo(history);
	
	  var past = history.past;
	  var present = history.present;
	  var future = history.future;
	
	
	  return {
	    future: past.slice(index + 1).concat([present]).concat(future),
	    present: past[index],
	    past: past.slice(0, index)
	  };
	}
	// /jumpToPast
	
	// wrapState: for backwards compatibility to 0.4
	function wrapState(state) {
	  return _extends({}, state, {
	    history: state
	  });
	}
	// /wrapState
	
	// updateState
	function updateState(state, history) {
	  return wrapState(_extends({}, state, history));
	}
	// /updateState
	
	// createHistory
	function createHistory(state) {
	  return {
	    past: [],
	    present: state,
	    future: []
	  };
	}
	// /createHistory
	
	// parseActions
	function parseActions(rawActions) {
	  var defaultValue = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
	
	  if (Array.isArray(rawActions)) {
	    return rawActions;
	  } else if (typeof rawActions === 'string') {
	    return [rawActions];
	  }
	  return defaultValue;
	}
	// /parseActions
	
	// redux-undo higher order reducer
	function undoable(reducer) {
	  var rawConfig = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  __DEBUG__ = rawConfig.debug;
	
	  var config = {
	    initialState: rawConfig.initialState,
	    initTypes: parseActions(rawConfig.initTypes, ['@@redux/INIT', '@@INIT']),
	    limit: rawConfig.limit,
	    filter: rawConfig.filter || function () {
	      return true;
	    },
	    undoType: rawConfig.undoType || ActionTypes.UNDO,
	    redoType: rawConfig.redoType || ActionTypes.REDO,
	    jumpToPastType: rawConfig.jumpToPastType || ActionTypes.JUMP_TO_PAST,
	    jumpToFutureType: rawConfig.jumpToFutureType || ActionTypes.JUMP_TO_FUTURE
	  };
	  config.history = rawConfig.initialHistory || createHistory(config.initialState);
	
	  if (config.initTypes.length === 0) {
	    console.warn('redux-undo: supply at least one action type in initTypes to ensure initial state');
	  }
	
	  return function (state, action) {
	    debugStart(action, state);
	    var res = undefined;
	    switch (action.type) {
	      case config.undoType:
	        res = undo(state);
	        debug('after undo', res);
	        debugEnd();
	        return res ? updateState(state, res) : state;
	
	      case config.redoType:
	        res = redo(state);
	        debug('after redo', res);
	        debugEnd();
	        return res ? updateState(state, res) : state;
	
	      case config.jumpToPastType:
	        res = jumpToPast(state, action.index);
	        debug('after jumpToPast', res);
	        debugEnd();
	        return res ? updateState(state, res) : state;
	
	      case config.jumpToFutureType:
	        res = jumpToFuture(state, action.index);
	        debug('after jumpToFuture', res);
	        debugEnd();
	        return res ? updateState(state, res) : state;
	
	      default:
	        res = reducer(state && state.present, action);
	
	        if (config.initTypes.some(function (actionType) {
	          return actionType === action.type;
	        })) {
	          debug('reset history due to init action');
	          debugEnd();
	          return wrapState(_extends({}, state, createHistory(res)));
	        }
	
	        if (config.filter && typeof config.filter === 'function') {
	          if (!config.filter(action, res, state && state.present)) {
	            debug('filter prevented action, not storing it');
	            debugEnd();
	            return wrapState(_extends({}, state, {
	              present: res
	            }));
	          }
	        }
	
	        var history = state && state.present !== undefined ? state : config.history;
	        var updatedHistory = insert(history, res, config.limit);
	        debug('after insert', { history: updatedHistory, free: config.limit - length(updatedHistory) });
	        debugEnd();
	
	        return wrapState(_extends({}, state, updatedHistory));
	    }
	  };
	}
	// /redux-undo
	
	// distinctState helper
	function distinctState() {
	  return function (action, currentState, previousState) {
	    return currentState !== previousState;
	  };
	}
	// /distinctState
	
	// includeAction helper
	function includeAction(rawActions) {
	  var actions = parseActions(rawActions);
	  return function (action) {
	    return actions.indexOf(action.type) >= 0;
	  };
	}
	// /includeAction
	
	// deprecated ifAction helper
	function ifAction(rawActions) {
	  console.error('Deprecation Warning: Please change `ifAction` to `includeAction`');
	  return includeAction(rawActions);
	}
	// /ifAction
	
	// excludeAction helper
	function excludeAction() {
	  var rawActions = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	
	  var actions = parseActions(rawActions);
	  return function (action) {
	    return actions.indexOf(action.type) < 0;
	  };
	}
	// /excludeAction

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	              value: true
	});
	
	var _preact = __webpack_require__(48);
	
	var _curve = __webpack_require__(119);
	
	var _curve2 = _interopRequireDefault(_curve);
	
	var _resizeHandle = __webpack_require__(150);
	
	var _resizeHandle2 = _interopRequireDefault(_resizeHandle);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var CLASSES = __webpack_require__(159);
	
	var CurveEditorRight = function CurveEditorRight(_ref) {
	              var state = _ref.state;
	              var progressLines = _ref.progressLines;
	              var options = _ref.options;
	
	              return (0, _preact.h)(
	                            'div',
	                            { className: CLASSES['curve-editor__right'] },
	                            (0, _preact.h)(_curve2.default, { state: state, options: options,
	                                          progressLines: progressLines }),
	                            (0, _preact.h)(_resizeHandle2.default, { state: state, type: 'right',
	                                          className: CLASSES['curve-editor__resize-handle'] }),
	                            (0, _preact.h)(_resizeHandle2.default, { state: state, type: 'bottom',
	                                          className: CLASSES['curve-editor__resize-handle'] })
	              );
	};
	
	exports.default = CurveEditorRight;

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _getPrototypeOf = __webpack_require__(66);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(42);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(43);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(71);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(106);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _preact = __webpack_require__(48);
	
	var _angleToPoint = __webpack_require__(120);
	
	var _angleToPoint2 = _interopRequireDefault(_angleToPoint);
	
	var _progressLine = __webpack_require__(121);
	
	var _progressLine2 = _interopRequireDefault(_progressLine);
	
	var _pattern = __webpack_require__(127);
	
	var _pattern2 = _interopRequireDefault(_pattern);
	
	var _ruler = __webpack_require__(129);
	
	var _ruler2 = _interopRequireDefault(_ruler);
	
	var _point = __webpack_require__(133);
	
	var _point2 = _interopRequireDefault(_point);
	
	var _resizeMod = __webpack_require__(143);
	
	var _resizeMod2 = _interopRequireDefault(_resizeMod);
	
	var _constants = __webpack_require__(114);
	
	var _constants2 = _interopRequireDefault(_constants);
	
	var _hammerjs = __webpack_require__(115);
	
	var _hammerjs2 = _interopRequireDefault(_hammerjs);
	
	var _propagating = __webpack_require__(116);
	
	var _propagating2 = _interopRequireDefault(_propagating);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	__webpack_require__(147);
	
	var CLASSES = __webpack_require__(149);
	
	var Curve = function (_Component) {
	  (0, _inherits3.default)(Curve, _Component);
	
	  function Curve() {
	    (0, _classCallCheck3.default)(this, Curve);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Curve).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(Curve, [{
	    key: 'render',
	    value: function render() {
	      var state = this.props.state;
	      var path = state.points.present.path;
	      var styles = this._getStyle(state);
	      var points = this._renderPoints(state);
	      var segments = this._renderSegments(state);
	      var progressLines = this._renderProgressLines(state);
	
	      var curveHeight = this._getCurveHeight();
	      return (0, _preact.h)(
	        'div',
	        { className: this._getClassName(), 'data-component': 'curve' },
	        (0, _preact.h)(
	          'div',
	          { id: 'js-background',
	            className: CLASSES['curve__background'],
	            style: styles.background },
	          (0, _preact.h)(_pattern2.default, { styles: styles })
	        ),
	        progressLines,
	        (0, _preact.h)(
	          'div',
	          { className: CLASSES['curve__svg-wrapper'],
	            style: styles.transform },
	          (0, _preact.h)(_ruler2.default, null),
	          (0, _preact.h)(_ruler2.default, { type: 'right' }),
	          points,
	          (0, _preact.h)(
	            'svg',
	            { height: _constants2.default.CURVE_SIZE,
	              viewBox: '0 0 100 ' + curveHeight,
	              preserveAspectRatio: 'none',
	              id: 'js-svg',
	              'class': CLASSES['curve__svg'] },
	            (0, _preact.h)('path', { d: path,
	              stroke: '#000000',
	              'stroke-opacity': '0.35',
	              'stroke-width': '4',
	              'vector-effect': 'non-scaling-stroke',
	              transform: 'translate(.75,.75)',
	              fill: 'none' }),
	            (0, _preact.h)(
	              'g',
	              { id: 'js-segments' },
	              ' ',
	              segments,
	              ' '
	            )
	          )
	        )
	      );
	    }
	  }, {
	    key: '_getClassName',
	    value: function _getClassName() {
	      var state = this.props.state;
	      var controls = state.controls;
	
	
	      var minClass = controls.isMinimize ? CLASSES['is-minimized'] : '';
	      return CLASSES['curve'] + ' ' + minClass;
	    }
	  }, {
	    key: '_getCurveHeight',
	    value: function _getCurveHeight() {
	      var _props = this.props;
	      var state = _props.state;
	      var options = _props.options;
	      var resize = state.resize;
	
	      if (!state.controls.isMinimize) {
	        return 100;
	      }
	
	      return _constants2.default.CURVE_SIZE * 4.28;
	    }
	  }, {
	    key: '_getStyle',
	    value: function _getStyle(state) {
	      var resize = state.resize;
	      var temp_top = resize.temp_top;
	      var temp_bottom = resize.temp_bottom;
	      var temp_right = resize.temp_right;
	      var panTempY = resize.panTempY;
	
	      var height = _constants2.default.CURVE_SIZE - (temp_top + resize.top) + (temp_bottom + resize.bottom);
	
	      panTempY += resize.panY;
	      temp_top += resize.top - panTempY;
	      temp_right += resize.right;
	
	      var yShift = state.controls.isMinimize ? -(temp_top / _constants2.default.CURVE_SIZE) * (20 / (height / _constants2.default.CURVE_SIZE)) : -temp_top;
	
	      var scaleX = (_constants2.default.CURVE_SIZE + Math.max(temp_right, 0)) / _constants2.default.CURVE_SIZE;
	      var background = 'width: ' + _constants2.default.CURVE_SIZE * scaleX + 'px;',
	          transform = 'transform: translate(0px, ' + yShift + 'px)';
	
	      return {
	        transform: '' + mojs.h.prefix.css + transform + '; ' + transform + ';',
	        background: background,
	        height: height,
	        svgTop: temp_top
	      };
	    }
	  }, {
	    key: '_renderPoints',
	    value: function _renderPoints(state) {
	      var pointsData = state.points.present.points,
	          points = [],
	          len = pointsData.length;
	
	      for (var i = 0; i < len; i++) {
	        points.push((0, _preact.h)(_point2.default, { point: pointsData[i], state: state, index: i, pointsCount: len }));
	      }
	
	      return points;
	    }
	  }, {
	    key: '_renderSegments',
	    value: function _renderSegments(state) {
	      var segments = state.points.present.segments;
	      var domSegments = [];
	
	      for (var i = 0; i < segments.length; i++) {
	        var segment = segments[i];
	        domSegments.push((0, _preact.h)('path', { d: segment.segmentString,
	          'data-index': segment.index,
	          stroke: 'white',
	          fill: 'none',
	          'stroke-width': '',
	          'vector-effect': 'non-scaling-stroke',
	          'class': CLASSES['curve__svg-segment']
	        }));
	      }
	
	      return domSegments;
	    }
	  }, {
	    key: '_renderProgressLines',
	    value: function _renderProgressLines(state) {
	      var progressLines = state.progressLines;
	      var lines = progressLines.lines;
	      var renderedLines = [];
	
	      for (var i = lines.length - 1; i >= 0; i--) {
	        var line = lines[i];
	        renderedLines.push((0, _preact.h)(_progressLine2.default, line));
	      }
	
	      return renderedLines;
	    }
	  }, {
	    key: '_updateDomProgressLines',
	    value: function _updateDomProgressLines() {
	      var progressLines = this.props.progressLines;
	      // DO NOT MUTATE THE ARRAY TO PREVENT LOOSING THE LINK TO IT
	
	      progressLines.length = 0;
	
	      var lines = this.base.querySelectorAll('[data-component="progress-line"]');
	      for (var i = 0; i < lines.length; i++) {
	        progressLines[i] = lines[i];
	      }
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      this._updateDomProgressLines();
	    }
	  }, {
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      this._isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this2 = this;
	
	      this._updateDomProgressLines();
	
	      var store = this.context.store;
	      var el = this.base.querySelector('#js-segments');
	      var mc = (0, _propagating2.default)(new _hammerjs2.default.Manager(el));
	
	      // mc.add(new Hammer.Pan({ threshold: 0 }));
	      mc.add(new _hammerjs2.default.Tap());
	
	      mc.on('tap', function (e) {
	        var state = _this2.props.state;
	
	        var ev = e.srcEvent;
	        var target = ev.target;
	        // handle paths only
	        if (target.tagName.toLowerCase() !== 'path') {
	          return;
	        }
	        // coordinates
	        var x = ev.offsetX;
	        var y = ev.offsetY;
	        var index = parseInt(target.getAttribute('data-index')) + 1;
	
	        // normalize for FF issue - it calculates
	        // events regarding `viewBox` of `svg` tag
	        if (!_this2._isFirefox) {
	          x /= state.resize.scalerX;
	        } else {
	          y *= _constants2.default.CURVE_PERCENT;
	          x -= 1;
	          y -= 1;
	        }
	
	        _this2._isFirefox;
	
	        store.dispatch({
	          type: 'POINT_ADD',
	          data: { point: { x: x, y: y }, index: index },
	          isRecord: true
	        });
	
	        store.dispatch({
	          type: 'POINT_SELECT',
	          data: { index: index, type: 'straight' }
	        });
	
	        e.stopPropagation();
	      });
	
	      var svg = this.base.querySelector('#js-svg'),
	          svgMc = (0, _propagating2.default)(new _hammerjs2.default.Manager(this.base));
	
	      svgMc.add(new _hammerjs2.default.Tap());
	      svgMc.add(new _hammerjs2.default.Pan());
	
	      svgMc.on('tap', function (e) {
	        store.dispatch({ type: 'POINT_DESELECT_ALL' });
	      }).on('pan', function (e) {
	        store.dispatch({ type: 'EDITOR_PAN', data: e.deltaY });
	      }).on('panend', function (e) {
	        store.dispatch({ type: 'EDITOR_PAN_END', data: e.deltaY });
	      });
	    }
	  }]);
	  return Curve;
	}(_preact.Component);
	
	exports.default = Curve;

/***/ },
/* 120 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (angle, radius) {
	  return mojs.h.getRadialPoint({ angle: angle, radius: radius, center: { x: 0, y: 0 } });
	};

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _getPrototypeOf = __webpack_require__(66);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(42);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(43);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(71);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(106);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _preact = __webpack_require__(48);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	__webpack_require__(122);
	var CLASSES = __webpack_require__(126);
	
	var ProgressLine = function (_Component) {
	  (0, _inherits3.default)(ProgressLine, _Component);
	
	  function ProgressLine() {
	    (0, _classCallCheck3.default)(this, ProgressLine);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ProgressLine).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(ProgressLine, [{
	    key: 'render',
	    value: function render() {
	      var p = this.props,
	          style = { backgroundColor: p.color };
	      return (0, _preact.h)('div', { className: CLASSES['progress-line'],
	        style: style,
	        'data-component': 'progress-line' });
	    }
	  }]);
	  return ProgressLine;
	}(_preact.Component);
	
	exports.default = ProgressLine;

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(123);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(125)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./progress-line.postcss.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./progress-line.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(124)();
	// imports
	
	
	// module
	exports.push([module.id, "._progress-line_1j4pp_3{position:absolute;top:0;bottom:0;width:1px;margin-left:-1.5px}", ""]);
	
	// exports


/***/ },
/* 124 */
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
/* 125 */
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
/* 126 */
/***/ function(module, exports) {

	module.exports = {
		"progress-line": "_progress-line_1j4pp_3"
	};

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _getPrototypeOf = __webpack_require__(66);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(42);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(43);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(71);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(106);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _preact = __webpack_require__(48);
	
	var _hash = __webpack_require__(128);
	
	var _hash2 = _interopRequireDefault(_hash);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Pattern = function (_Component) {
	  (0, _inherits3.default)(Pattern, _Component);
	
	  function Pattern() {
	    (0, _classCallCheck3.default)(this, Pattern);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Pattern).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(Pattern, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      this._hash = (0, _hash2.default)(Math.random() + '');
	      this._patternName = 'rect-paper-' + this._hash;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var styles = this.props.styles;
	
	
	      return (0, _preact.h)(
	        'svg',
	        { preserveAspectRatio: 'none', height: styles.height + 'px', viewBox: '0 0 ' + (350 + Math.random() * 0.0001) + ' ' + styles.height },
	        (0, _preact.h)(
	          'pattern',
	          { id: this._patternName, x: '0', y: '' + -styles.svgTop, height: '350', width: '350', patternUnits: 'userSpaceOnUse' },
	          (0, _preact.h)(
	            'g',
	            { id: 'Group', transform: 'translate(-1.000000, -1.000000)', stroke: '#FFFFFF', 'stroke-width': '1', fill: 'none', 'vector-effect': 'non-scaling-stroke' },
	            (0, _preact.h)(
	              'g',
	              { opacity: '0.25' },
	              (0, _preact.h)('path', { d: 'M333.497821,350.501088 L333.497821,0.501088302' }),
	              (0, _preact.h)('path', { d: 'M315.997821,350.501088 L315.997821,0.501088302' }),
	              (0, _preact.h)('path', { d: 'M298.497821,350.501088 L298.497821,0.501088302' }),
	              (0, _preact.h)('path', { d: 'M280.997821,350.501088 L280.997821,0.501088302' }),
	              (0, _preact.h)('path', { d: 'M245.997821,350.501088 L245.997821,0.501088302' }),
	              (0, _preact.h)('path', { d: 'M228.497821,350.501088 L228.497821,0.501088302' }),
	              (0, _preact.h)('path', { d: 'M210.997821,350.501088 L210.997821,0.501088302' }),
	              (0, _preact.h)('path', { d: 'M193.497821,350.501088 L193.497821,0.501088302' }),
	              (0, _preact.h)('path', { d: 'M159.372821,350.501088 L159.372821,0.501088302' }),
	              (0, _preact.h)('path', { d: 'M141.872821,350.501088 L141.872821,0.501088302' }),
	              (0, _preact.h)('path', { d: 'M124.372821,350.501088 L124.372821,0.501088302' }),
	              (0, _preact.h)('path', { d: 'M106.872821,350.501088 L106.872821,0.501088302' }),
	              (0, _preact.h)('path', { d: 'M71.8728207,350.501088 L71.8728207,0.501088302' }),
	              (0, _preact.h)('path', { d: 'M54.3728207,350.501088 L54.3728207,0.501088302' }),
	              (0, _preact.h)('path', { d: 'M36.8728207,350.501088 L36.8728207,0.501088302' }),
	              (0, _preact.h)('path', { d: 'M19.3728207,350.501088 L19.3728207,0.501088302' }),
	              (0, _preact.h)('path', { d: 'M351.001088,19.0021793 L1.0010883,19.0021793' }),
	              (0, _preact.h)('path', { d: 'M351.001088,36.5021793 L1.0010883,36.5021793' }),
	              (0, _preact.h)('path', { d: 'M351.001088,54.0021793 L1.0010883,54.0021793' }),
	              (0, _preact.h)('path', { d: 'M351.001088,71.5021793 L1.0010883,71.5021793' }),
	              (0, _preact.h)('path', { d: 'M351.001088,106.502179 L1.0010883,106.502179' }),
	              (0, _preact.h)('path', { d: 'M351.001088,124.002179 L1.0010883,124.002179' }),
	              (0, _preact.h)('path', { d: 'M351.001088,141.502179 L1.0010883,141.502179' }),
	              (0, _preact.h)('path', { d: 'M351.001088,159.002179 L1.0010883,159.002179' }),
	              (0, _preact.h)('path', { d: 'M351.001088,193.127179 L1.0010883,193.127179' }),
	              (0, _preact.h)('path', { d: 'M351.001088,210.627179 L1.0010883,210.627179' }),
	              (0, _preact.h)('path', { d: 'M351.001088,228.127179 L1.0010883,228.127179' }),
	              (0, _preact.h)('path', { d: 'M351.001088,245.627179 L1.0010883,245.627179' }),
	              (0, _preact.h)('path', { d: 'M351.001088,280.627179 L1.0010883,280.627179' }),
	              (0, _preact.h)('path', { d: 'M351.001088,298.127179 L1.0010883,298.127179' }),
	              (0, _preact.h)('path', { d: 'M351.001088,315.627179 L1.0010883,315.627179' }),
	              (0, _preact.h)('path', { d: 'M351.001088,333.127179 L1.0010883,333.127179' })
	            ),
	            (0, _preact.h)(
	              'g',
	              { opacity: '0.5' },
	              (0, _preact.h)('path', { d: 'M88.0641352,1 L88.0641352,351' }),
	              (0, _preact.h)('path', { d: 'M175.12827,1 L175.12827,351' }),
	              (0, _preact.h)('path', { d: 'M262.192406,1 L262.192406,351' }),
	              (0, _preact.h)('path', { d: 'M350.563591,88.0646793 L0.563591022,88.0646793' }),
	              (0, _preact.h)('path', { d: 'M350.563591,175.564679 L0.563591022,175.564679' }),
	              (0, _preact.h)('path', { d: 'M350.563591,263.064679 L0.563591022,263.064679' })
	            ),
	            (0, _preact.h)('rect', { opacity: '0.75', x: '1', y: '1', width: '350', height: '350' })
	          )
	        ),
	        (0, _preact.h)('rect', { width: '350', height: styles.height, fill: 'url(#' + this._patternName + ')' })
	      );
	    }
	  }]);
	  return Pattern;
	}(_preact.Component);
	
	exports.default = Pattern;

/***/ },
/* 128 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	/*
	  Function to generate hash code.
	  @private
	  @return {String} Hash code.
	*/
	
	exports.default = function (str) {
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

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Ruler = undefined;
	
	var _getPrototypeOf = __webpack_require__(66);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(42);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(43);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(71);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(106);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _preact = __webpack_require__(48);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	__webpack_require__(130);
	var CLASSES = __webpack_require__(132);
	
	var Ruler = exports.Ruler = function (_Component) {
	  (0, _inherits3.default)(Ruler, _Component);
	
	  function Ruler() {
	    (0, _classCallCheck3.default)(this, Ruler);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Ruler).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(Ruler, [{
	    key: 'render',
	    value: function render() {
	      var className = '' + CLASSES['ruler'];
	      if (this.props.type === 'right') {
	        className += ' ' + CLASSES['ruler--right'];
	      }
	      return (0, _preact.h)(
	        'div',
	        { className: className, 'data-component': 'ruler' },
	        (0, _preact.h)(
	          'div',
	          { className: CLASSES['ruler__item'] + ' ' + CLASSES['ruler__item--2'] },
	          ' 2  '
	        ),
	        (0, _preact.h)(
	          'div',
	          { className: CLASSES['ruler__item'] + ' ' + CLASSES['ruler__item--1'] },
	          ' 1  '
	        ),
	        (0, _preact.h)(
	          'div',
	          { className: CLASSES['ruler__item'] + ' ' + CLASSES['ruler__item--0'] },
	          ' 0  '
	        ),
	        (0, _preact.h)(
	          'div',
	          { className: CLASSES['ruler__item'] + ' ' + CLASSES['ruler__item--n1'] },
	          ' -1  '
	        ),
	        (0, _preact.h)(
	          'div',
	          { className: CLASSES['ruler__item'] + ' ' + CLASSES['ruler__item--n2'] },
	          ' -2  '
	        )
	      );
	    }
	  }]);
	  return Ruler;
	}(_preact.Component);
	
	exports.default = Ruler;

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(131);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(125)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./ruler.postcss.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./ruler.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(124)();
	// imports
	
	
	// module
	exports.push([module.id, "._ruler_1c43h_4{position:absolute;left:0;top:-1050px;height:2450px;width:18px}._ruler--right_1c43h_1{left:auto;right:0}._ruler__item_1c43h_1{position:absolute;color:#9c829a;font-size:8px;font-family:sans-serif;border-radius:50%;left:50%;width:7px;height:14px;text-align:center;line-height:14px;margin-top:3px;margin-left:-3.5px}._ruler__item--0_1c43h_1{top:1400px}._ruler__item--1_1c43h_1{top:1050px}._ruler__item--2_1c43h_1{top:700px}._ruler__item--n1_1c43h_1{top:1750px}._ruler__item--n2_1c43h_1{top:2100px}", ""]);
	
	// exports


/***/ },
/* 132 */
/***/ function(module, exports) {

	module.exports = {
		"ruler": "_ruler_1c43h_4",
		"ruler--right": "_ruler--right_1c43h_1",
		"ruler__item": "_ruler__item_1c43h_1",
		"ruler__item--0": "_ruler__item--0_1c43h_1",
		"ruler__item--1": "_ruler__item--1_1c43h_1",
		"ruler__item--2": "_ruler__item--2_1c43h_1",
		"ruler__item--n1": "_ruler__item--n1_1c43h_1",
		"ruler__item--n2": "_ruler__item--n2_1c43h_1"
	};

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _getPrototypeOf = __webpack_require__(66);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(42);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(43);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(71);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(106);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _preact = __webpack_require__(48);
	
	var _addPointerDown = __webpack_require__(134);
	
	var _addPointerDown2 = _interopRequireDefault(_addPointerDown);
	
	var _littleHandle = __webpack_require__(135);
	
	var _littleHandle2 = _interopRequireDefault(_littleHandle);
	
	var _propagating = __webpack_require__(116);
	
	var _propagating2 = _interopRequireDefault(_propagating);
	
	var _roundTo = __webpack_require__(141);
	
	var _roundTo2 = _interopRequireDefault(_roundTo);
	
	var _hammerjs = __webpack_require__(115);
	
	var _hammerjs2 = _interopRequireDefault(_hammerjs);
	
	var _clamp = __webpack_require__(142);
	
	var _clamp2 = _interopRequireDefault(_clamp);
	
	var _resizeMod = __webpack_require__(143);
	
	var _resizeMod2 = _interopRequireDefault(_resizeMod);
	
	var _constants = __webpack_require__(114);
	
	var _constants2 = _interopRequireDefault(_constants);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	__webpack_require__(144);
	var CLASSES = __webpack_require__(146);
	
	var Point = function (_Component) {
	  (0, _inherits3.default)(Point, _Component);
	
	  function Point() {
	    (0, _classCallCheck3.default)(this, Point);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Point).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(Point, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var point = _props.point;
	      var state = _props.state;
	      var selected = point.isSelected ? CLASSES['is-selected'] : '';
	      var handles = point.type === 'straight' ? CLASSES['is-hide-handles'] : '';
	
	      var littleHandles = this._getLittleHandles();
	
	      return (0, _preact.h)(
	        'div',
	        { className: CLASSES['point'] + ' ' + selected + ' ' + handles,
	          style: this._getStyle(state),
	          'data-component': 'point' },
	        (0, _preact.h)('div', { className: CLASSES['point__touch'], id: 'js-point-touch' }),
	        littleHandles
	      );
	    }
	  }, {
	    key: '_getStyle',
	    value: function _getStyle(state) {
	      var point = this.props.point;
	      var resize = state.resize;
	      var x = (0, _clamp2.default)(point.x + point.tempX, 0, 100);
	      var cleanX = x * resize.scalerX;
	      var y = point.y + point.tempY;
	
	      var translate = 'transform: translate(' + cleanX + 'px, ' + (y - 1) + 'px)';
	      return '' + mojs.h.prefix.css + translate + '; ' + translate;
	    }
	  }, {
	    key: '_getLittleHandles',
	    value: function _getLittleHandles() {
	      var _props2 = this.props;
	      var index = _props2.index;
	      var point = _props2.point;
	      var pointsCount = _props2.pointsCount;
	      var handles = [];
	      // dont set the handle1 for start point
	      index !== 0 && handles.push(this._createHandle(1, point));
	      // dont set the handle2 for end point
	      index !== pointsCount - 1 && handles.push(this._createHandle(2, point));
	      return handles;
	    }
	  }, {
	    key: '_createHandle',
	    value: function _createHandle(index, point) {
	      return (0, _preact.h)(_littleHandle2.default, {
	        index: index,
	        state: this.props.state,
	        parentIndex: this.props.index,
	        handle: point['handle' + index],
	        type: point.type
	      });
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this2 = this;
	
	      var store = this.context.store;
	
	
	      var getTempX = function getTempX(e) {
	        var resize = _this2.props.state.resize;
	        var _props3 = _this2.props;
	        var point = _props3.point;
	        var index = _props3.index;
	        // if point is not locked to x axes ->
	        // calculate delta regarding scaler
	
	        if (point.isLockedX) {
	          return 0;
	        };
	
	        var x = e.deltaX / resize.scalerX;
	        if (point.x + x < 0) {
	          return 0 - point.x;
	        } else if (point.x + x > 100) {
	          return 100 - point.x;
	        }
	        return (0, _roundTo2.default)(point.x + x, 5, 1.5) - point.x;
	      };
	
	      var getY = function getY(e) {
	        var resize = _this2.props.state.resize;
	        var _props4 = _this2.props;
	        var point = _props4.point;
	        var index = _props4.index;
	        var y = point.y + e.deltaY;
	
	        // clamp y to the size of curve
	        return (0, _clamp2.default)(y, resize.top, _constants2.default.CURVE_SIZE + resize.bottom);
	      };
	
	      // get y delta reagarding curve bounds
	      var getTempY = function getTempY(e) {
	        var resize = _this2.props.state.resize;
	        var _props5 = _this2.props;
	        var point = _props5.point;
	        var index = _props5.index;
	
	
	        var y = point.y + e.deltaY,
	            returnValue = y;
	
	        if (y < resize.top - resize.panY) {
	          returnValue = resize.top - resize.panY;
	        } else if (y > _constants2.default.CURVE_SIZE + resize.bottom - resize.panY) {
	          returnValue = _constants2.default.CURVE_SIZE + resize.bottom - resize.panY;
	        }
	
	        return (0, _roundTo2.default)(returnValue, 5 * _constants2.default.CURVE_PERCENT, 2 * _constants2.default.CURVE_PERCENT) - point.y;
	      };
	
	      var el = this.base.querySelector('#js-point-touch'),
	          mc = (0, _propagating2.default)(new _hammerjs2.default.Manager(el));
	
	      mc.add(new _hammerjs2.default.Pan({ threshold: 0 }));
	
	      mc.on('pan', function (e) {
	        var _props6 = _this2.props;
	        var point = _props6.point;
	        var index = _props6.index;
	
	        store.dispatch({
	          type: 'POINT_TRANSLATE',
	          data: { x: getTempX(e), y: getTempY(e), index: index }
	        });
	        e.stopPropagation();
	      }).on('panend', function (e) {
	        var _props7 = _this2.props;
	        var point = _props7.point;
	        var index = _props7.index;
	        // fire translate end and save it to the store
	
	        store.dispatch({
	          type: 'POINT_TRANSLATE_END', data: index, isRecord: true
	        });
	        e.stopPropagation();
	      }).on('tap', function (e) {
	        e.stopPropagation();
	      });
	
	      (0, _addPointerDown2.default)(el, function (e) {
	        var _props8 = _this2.props;
	        var point = _props8.point;
	        var index = _props8.index;
	
	        store.dispatch({
	          type: 'POINT_SELECT',
	          data: {
	            index: index, isDeselect: !e.shiftKey,
	            type: point.type
	          }
	        });
	      });
	    }
	  }]);
	  return Point;
	}(_preact.Component);
	
	exports.default = Point;

/***/ },
/* 134 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (el, fn) {
	  if (window.navigator.msPointerEnabled) {
	    el.addEventListener('MSPointerDown', fn);
	  } else if (window.ontouchstart !== undefined) {
	    el.addEventListener('touchstart', fn);
	    el.addEventListener('mousedown', fn);
	  } else {
	    el.addEventListener('mousedown', fn);
	  }
	};

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends2 = __webpack_require__(5);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	var _getPrototypeOf = __webpack_require__(66);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(42);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(43);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(71);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(106);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _preact = __webpack_require__(48);
	
	var _angleToPoint = __webpack_require__(120);
	
	var _angleToPoint2 = _interopRequireDefault(_angleToPoint);
	
	var _pointToAngle = __webpack_require__(136);
	
	var _pointToAngle2 = _interopRequireDefault(_pointToAngle);
	
	var _constants = __webpack_require__(114);
	
	var _constants2 = _interopRequireDefault(_constants);
	
	var _pool = __webpack_require__(137);
	
	var _pool2 = _interopRequireDefault(_pool);
	
	var _propagating = __webpack_require__(116);
	
	var _propagating2 = _interopRequireDefault(_propagating);
	
	var _hammerjs = __webpack_require__(115);
	
	var _hammerjs2 = _interopRequireDefault(_hammerjs);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	__webpack_require__(138);
	var CLASSES = __webpack_require__(140);
	
	var LittleHandle = function (_Component) {
	  (0, _inherits3.default)(LittleHandle, _Component);
	
	  function LittleHandle() {
	    (0, _classCallCheck3.default)(this, LittleHandle);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(LittleHandle).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(LittleHandle, [{
	    key: 'render',
	    value: function render() {
	      return (0, _preact.h)(
	        'div',
	        { className: CLASSES['little-handle'],
	          'data-component': 'little-handle' },
	        (0, _preact.h)(
	          'div',
	          { 'class': CLASSES['little-handle__point'],
	            style: this._getPointStyle() },
	          (0, _preact.h)('div', { className: CLASSES['little-handle__easy-touch'] })
	        ),
	        (0, _preact.h)('div', { 'class': CLASSES['little-handle__line'],
	          style: this._getLineStyle() })
	      );
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this2 = this;
	
	      var store = this.context.store;
	      var mc = (0, _propagating2.default)(new _hammerjs2.default.Manager(this.base));var handle = this.props.handle;
	
	      mc.add(new _hammerjs2.default.Pan({ threshold: 0 }));
	      mc.on('panstart', function (e) {
	        handle = _this2.props.handle;
	      }).on('pan', function (e) {
	        var _props = _this2.props;
	        var index = _props.index;
	        var parentIndex = _props.parentIndex;
	        var state = _props.state;
	        var point = (0, _angleToPoint2.default)(handle.angle, handle.radius);
	        var newY = point.y + e.deltaY;
	        var resize = state.resize;
	        var absX = point.x + e.deltaX / resize.absScalerX;
	        var angle = (0, _pointToAngle2.default)(absX, newY);
	
	        store.dispatch({
	          type: 'HANDLE_TRANSLATE',
	          data: (0, _extends3.default)({ index: index, parentIndex: parentIndex }, angle)
	        });
	
	        if (_this2.props.type === 'mirrored') {
	          var i = index === 1 ? 2 : 1;
	          store.dispatch({
	            type: 'HANDLE_TRANSLATE',
	            data: {
	              index: i, parentIndex: parentIndex,
	              radius: angle.radius,
	              angle: angle.angle - 180
	            }
	          });
	        }
	
	        if (_this2.props.type === 'asymmetric') {
	          var _i = index === 1 ? 2 : 1;
	          store.dispatch({
	            type: 'HANDLE_TRANSLATE',
	            data: {
	              index: _i, parentIndex: parentIndex,
	              radius: handle.radius,
	              angle: angle.angle - 180
	            }
	          });
	        }
	        e.stopPropagation();
	      }).on('panend', function (e) {
	        store.dispatch({ type: 'HANDLE_TRANSLATE_END', isRecord: true });
	        _pool2.default.clear();
	        e.stopPropagation();
	      });
	    }
	  }, {
	    key: '_getPointStyle',
	    value: function _getPointStyle() {
	      var _props2 = this.props;
	      var handle = _props2.handle;
	      var state = _props2.state;
	      var resize = state.resize;
	      var point = (0, _angleToPoint2.default)(handle.angle, handle.radius);
	      var translate = 'transform: translate(' + point.x * resize.absScalerX + 'px, ' + point.y + 'px) rotate(' + handle.angle + 'deg)';
	
	      return '' + mojs.h.prefix.css + translate + '; ' + translate;
	    }
	  }, {
	    key: '_getLineStyle',
	    value: function _getLineStyle() {
	      var _props3 = this.props;
	      var handle = _props3.handle;
	      var state = _props3.state;
	      var resize = state.resize;
	      // since the angle and radius were stored as absolute,
	      // e.g. regardless the editor's horizontal resize,
	      // we need to recalc the x position for the line
	      var point = (0, _angleToPoint2.default)(handle.angle, handle.radius);
	      var newVector = (0, _pointToAngle2.default)(point.x * resize.absScalerX, point.y);
	      var translate = 'transform: rotate(' + newVector.angle + 'deg) scaleY(' + newVector.radius + ')';
	
	      return '' + mojs.h.prefix.css + translate + '; ' + translate;
	    }
	  }]);
	  return LittleHandle;
	}(_preact.Component);
	
	exports.default = LittleHandle;

/***/ },
/* 136 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (x, y) {
	  var radius = Math.sqrt(x * x + y * y),
	      angle = Math.atan(y / x) * (180 / Math.PI) - 90;
	  if (x > 0) {
	    angle = angle - 180;
	  };
	
	  return { radius: radius, angle: angle };
	};

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _classCallCheck2 = __webpack_require__(42);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(43);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Pool = function () {
	  function Pool() {
	    (0, _classCallCheck3.default)(this, Pool);
	
	    this._states = [];
	  }
	
	  (0, _createClass3.default)(Pool, [{
	    key: "push",
	    value: function push(states) {
	      // this._states.push(states);
	      return this;
	    }
	  }, {
	    key: "clear",
	    value: function clear() {
	      this._states = [];
	      return this;
	    }
	  }]);
	  return Pool;
	}();
	
	exports.default = new Pool();

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(139);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(125)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./little-handle.postcss.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./little-handle.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(124)();
	// imports
	
	
	// module
	exports.push([module.id, "._little-handle_x1mg1_3{position:absolute;left:50%;top:50%;width:0;height:0}._little-handle__point_x1mg1_1{position:absolute;z-index:1;width:6px;height:6px;left:50%;top:50%;margin-left:-3px;margin-top:-3px;background:#ff512f;box-shadow:1px 1px 0 rgba(0,0,0,.5)}._little-handle__easy-touch_x1mg1_1{position:absolute;z-index:1;width:200%;height:200%;left:50%;top:50%;margin-left:-100%;margin-top:-100%}._little-handle__line_x1mg1_1{position:absolute;width:1px;height:1px;margin-left:-1px;margin-top:-1px;left:50%;top:50%;background:#ff512f;-webkit-transform-origin:50% 100%;transform-origin:50% 100%}", ""]);
	
	// exports


/***/ },
/* 140 */
/***/ function(module, exports) {

	module.exports = {
		"little-handle": "_little-handle_x1mg1_3",
		"little-handle__point": "_little-handle__point_x1mg1_1",
		"little-handle__easy-touch": "_little-handle__easy-touch_x1mg1_1",
		"little-handle__line": "_little-handle__line_x1mg1_1"
	};

/***/ },
/* 141 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (value, base, snap) {
	  var modified = Math.round(value / base) * base;
	
	  return Math.abs(value - modified) < snap ? modified : value;
	};

/***/ },
/* 142 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (value, min, max) {
	  return value < min ? min : value > max ? max : value;
	};

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	      value: true
	});
	
	var _constants = __webpack_require__(114);
	
	var _constants2 = _interopRequireDefault(_constants);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Y_SIZE = _constants2.default.CURVE_SIZE;
	var mod = function mod(tempResize_top) {
	      var coef = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
	
	      var MOD = Math.abs(tempResize_top % Y_SIZE),
	          DIV = parseInt(tempResize_top / Y_SIZE),
	          GAP = 15;
	
	      if (MOD < GAP) {
	            tempResize_top = DIV * Y_SIZE;
	      } else if (MOD > Y_SIZE - GAP) {
	            tempResize_top = (DIV + 1 * coef) * Y_SIZE;
	      }
	
	      return tempResize_top;
	};
	
	exports.default = mod;

/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(145);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(125)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./point.postcss.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./point.postcss.css");
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

	exports = module.exports = __webpack_require__(124)();
	// imports
	
	
	// module
	exports.push([module.id, "._point_14jnp_5{position:absolute;width:10px;height:10px;margin-left:-5px;margin-top:-5px;cursor:move;background:#fff;border-radius:50%;z-index:3;box-shadow:3px 3px 0 rgba(0,0,0,.5)}._point_14jnp_5 [data-component=little-handle]{display:none}._point__touch_14jnp_1{position:absolute;left:50%;top:50%;width:20px;height:20px;margin-left:-10px;margin-top:-10px}._point_14jnp_5._is-selected_14jnp_31,._point_14jnp_5:hover{background:#ff512f}._point_14jnp_5._is-selected_14jnp_31 [data-component=little-handle]{display:block}._point_14jnp_5._is-hide-handles_14jnp_43 [data-component=little-handle]{display:none}", ""]);
	
	// exports


/***/ },
/* 146 */
/***/ function(module, exports) {

	module.exports = {
		"point": "_point_14jnp_5",
		"point__touch": "_point__touch_14jnp_1",
		"is-selected": "_is-selected_14jnp_31",
		"is-hide-handles": "_is-hide-handles_14jnp_43"
	};

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(148);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(125)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./curve.postcss.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./curve.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(124)();
	// imports
	
	
	// module
	exports.push([module.id, "._curve_1w89w_5{position:absolute;left:0;top:10px;right:10px;bottom:10px;border-radius:2px;background:rgba(58,8,58,.75);border:1px solid #9c829a;box-shadow:inset 4px 4px 0 rgba(0,0,0,.5);z-index:2;overflow:hidden}._curve__background_1w89w_1{position:absolute;z-index:0;top:0;bottom:0;width:350px;left:0;opacity:.5;border-radius:inherit}._curve__background_1w89w_1 svg{width:100%}._curve__background_1w89w_1 path{vector-effect:non-scaling-stroke}._curve__svg-wrapper_1w89w_1{position:absolute;z-index:1;left:-1px;right:-1px}._curve__svg_1w89w_1{display:block;overflow:visible;width:100%;position:relative;z-index:1}._curve__svg-segment_1w89w_1{stroke:#fff;stroke-width:2px;cursor:crosshair}._curve__svg-segment_1w89w_1:hover{stroke:#ff512f}", ""]);
	
	// exports


/***/ },
/* 149 */
/***/ function(module, exports) {

	module.exports = {
		"curve": "_curve_1w89w_5",
		"curve__background": "_curve__background_1w89w_1",
		"curve__svg-wrapper": "_curve__svg-wrapper_1w89w_1",
		"curve__svg": "_curve__svg_1w89w_1",
		"curve__svg-segment": "_curve__svg-segment_1w89w_1"
	};

/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends2 = __webpack_require__(5);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	var _getPrototypeOf = __webpack_require__(66);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(42);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(43);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(71);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(106);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _preact = __webpack_require__(48);
	
	var _icon = __webpack_require__(151);
	
	var _icon2 = _interopRequireDefault(_icon);
	
	var _hammerjs = __webpack_require__(115);
	
	var _hammerjs2 = _interopRequireDefault(_hammerjs);
	
	var _propagating = __webpack_require__(116);
	
	var _propagating2 = _interopRequireDefault(_propagating);
	
	var _modDeltas = __webpack_require__(155);
	
	var _modDeltas2 = _interopRequireDefault(_modDeltas);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var CLASSES = __webpack_require__(156);
	
	__webpack_require__(157);
	
	var ResizeHandle = function (_Component) {
	  (0, _inherits3.default)(ResizeHandle, _Component);
	
	  function ResizeHandle() {
	    (0, _classCallCheck3.default)(this, ResizeHandle);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ResizeHandle).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(ResizeHandle, [{
	    key: 'render',
	    value: function render() {
	      var type = this.props.type;
	      var className = '' + CLASSES['resize-handle'];
	      var classType = '' + CLASSES['resize-handle--' + type];
	      return (0, _preact.h)(
	        'div',
	        { className: className + ' ' + classType + ' ' + this.props.className,
	          'data-type': type, 'data-component': 'resize-handle' },
	        (0, _preact.h)(_icon2.default, { shape: 'ellipsis' })
	      );
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this2 = this;
	
	      var type = this.props.type;
	      var store = this.context.store;
	      var mc = (0, _propagating2.default)(new _hammerjs2.default.Manager(this.base));
	
	      mc.add(new _hammerjs2.default.Pan({ threshold: 0 }));
	      mc.on('pan', function (e) {
	        store.dispatch({ type: 'EDITOR_RESIZE', data: (0, _extends3.default)({}, (0, _modDeltas2.default)(e.deltaX, e.deltaY, type, _this2.props.state))
	        });
	        e.stopPropagation();
	      }).on('panend', function (e) {
	        store.dispatch({ type: 'EDITOR_RESIZE_END', data: (0, _extends3.default)({}, (0, _modDeltas2.default)(e.deltaX, e.deltaY, type, _this2.props.state))
	        });
	        e.stopPropagation();
	      });
	    }
	  }]);
	  return ResizeHandle;
	}(_preact.Component);
	
	exports.default = ResizeHandle;

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _getPrototypeOf = __webpack_require__(66);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(42);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(43);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(71);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(106);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _preact = __webpack_require__(48);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var CLASSES = __webpack_require__(152);
	__webpack_require__(153);
	
	var Icon = function (_Component) {
	  (0, _inherits3.default)(Icon, _Component);
	
	  function Icon() {
	    (0, _classCallCheck3.default)(this, Icon);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Icon).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(Icon, [{
	    key: 'render',
	    value: function render() {
	      var shape = this.props.shape;
	      var markup = '<svg viewBox="0 0 32 32"><use xlink:href="#' + shape + '-shape" /></svg>';
	      return (0, _preact.h)('div', {
	        className: CLASSES['icon'],
	        'data-component': 'icon',
	        dangerouslySetInnerHTML: { __html: markup } });
	    }
	  }]);
	  return Icon;
	}(_preact.Component);
	
	exports.default = Icon;

/***/ },
/* 152 */
/***/ function(module, exports) {

	module.exports = {
		"icon": "_icon_4a8lf_5"
	};

/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(154);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(125)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./icon.postcss.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./icon.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(124)();
	// imports
	
	
	// module
	exports.push([module.id, "._icon_4a8lf_5{position:relative;width:32px;height:32px;cursor:pointer;fill:#fff;display:block}._icon_4a8lf_5>svg{position:absolute;left:0;top:0;width:100%;height:100%;fill:inherit}._icon_4a8lf_5>svg>use{fill:inherit}._icon_4a8lf_5:after{content:'';position:absolute;left:0;top:0;right:0;bottom:0;z-index:1}", ""]);
	
	// exports


/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _resizeMod = __webpack_require__(143);
	
	var _resizeMod2 = _interopRequireDefault(_resizeMod);
	
	var _constants = __webpack_require__(114);
	
	var _constants2 = _interopRequireDefault(_constants);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (x, y, type, state) {
	  var resize = state.resize;
	  // get modulus size for `top` and `bottom` types
	
	  if (type !== 'right') {
	    var size = resize[type] + y,
	        coef = type === 'top' ? -1 : 1;
	    // normalize the y delta to modulus of CURVE_SIZEs
	    y = (0, _resizeMod2.default)(size, coef);
	    y -= resize[type];
	    // const offset = C.RESIZE_NEGATIVE_OFFSET;
	    var offset = 0;
	    // ensure size won't be less then CURVE_SIZE
	    if (size * coef < -offset) {
	      y = -resize[type] - offset;
	    }
	    // ensure size won't be less then CURVE_SIZE
	  } else if (resize[type] + x < 0) {
	    x = -resize[type];
	  }
	
	  return { x: x, y: y, type: type, resize: resize };
	};

/***/ },
/* 156 */
/***/ function(module, exports) {

	module.exports = {
		"resize-handle": "_resize-handle_1uncf_4",
		"resize-handle--right": "_resize-handle--right_1uncf_1",
		"resize-handle--bottom": "_resize-handle--bottom_1uncf_1"
	};

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(158);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(125)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./resize-handle.postcss.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./resize-handle.postcss.css");
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

	exports = module.exports = __webpack_require__(124)();
	// imports
	
	
	// module
	exports.push([module.id, "._resize-handle_1uncf_4{background:#3d1b3c;width:32px;height:16px;display:block;cursor:n-resize;overflow:hidden;position:relative;border-top-left-radius:3px;border-top-right-radius:3px;-webkit-transform-origin:50% 100%;transform-origin:50% 100%;box-shadow:inset 0 0 0 1px #572b51}._resize-handle_1uncf_4:after{content:'';position:absolute;left:0;top:0;right:0;bottom:0;z-index:2}._resize-handle_1uncf_4 [data-component=icon]{position:absolute;left:0;top:-7px}._resize-handle_1uncf_4:hover{opacity:.85}._resize-handle--right_1uncf_1{-webkit-transform:rotate(90deg);transform:rotate(90deg);cursor:e-resize}._resize-handle--bottom_1uncf_1{-webkit-transform:rotate(180deg);transform:rotate(180deg);cursor:s-resize}", ""]);
	
	// exports


/***/ },
/* 159 */
/***/ function(module, exports) {

	module.exports = {
		"curve-editor": "_curve-editor_10g8s_3",
		"curve-editor__left": "_curve-editor__left_10g8s_1",
		"curve-editor__right": "_curve-editor__right_10g8s_133",
		"curve-editor__resize-handle": "_curve-editor__resize-handle_10g8s_1",
		"curve-editor__anchor-buttons": "_curve-editor__anchor-buttons_10g8s_128",
		"curve-editor__mojs-logo": "_curve-editor__mojs-logo_10g8s_111",
		"is-inactive": "_is-inactive_10g8s_110",
		"is-minimized": "_is-minimized_10g8s_118",
		"curve__svg-wrapper": "_curve__svg-wrapper_10g8s_137",
		"is-hidden-on-min": "_is-hidden-on-min_10g8s_147"
	};

/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _preact = __webpack_require__(48);
	
	var _icon = __webpack_require__(151);
	
	var _icon2 = _interopRequireDefault(_icon);
	
	var _codeButton = __webpack_require__(161);
	
	var _codeButton2 = _interopRequireDefault(_codeButton);
	
	var _minimizeButton = __webpack_require__(166);
	
	var _minimizeButton2 = _interopRequireDefault(_minimizeButton);
	
	var _maximizeButton = __webpack_require__(167);
	
	var _maximizeButton2 = _interopRequireDefault(_maximizeButton);
	
	var _iconDivider = __webpack_require__(168);
	
	var _iconDivider2 = _interopRequireDefault(_iconDivider);
	
	var _pointControls = __webpack_require__(172);
	
	var _pointControls2 = _interopRequireDefault(_pointControls);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var CLASSES = __webpack_require__(159);
	
	var CurveEditorLeft = function CurveEditorLeft(_ref) {
	  var state = _ref.state;
	
	  return (0, _preact.h)(
	    'div',
	    { className: CLASSES['curve-editor__left'], id: 'js-left-panel' },
	    (0, _preact.h)(_minimizeButton2.default, { state: state }),
	    (0, _preact.h)(_maximizeButton2.default, { state: state }),
	    (0, _preact.h)(_codeButton2.default, { state: state }),
	    (0, _preact.h)(_iconDivider2.default, null),
	    (0, _preact.h)(_pointControls2.default, { state: state,
	      className: CLASSES['curve-editor__anchor-buttons'] }),
	    (0, _preact.h)(
	      'a',
	      { className: CLASSES['curve-editor__mojs-logo'],
	        href: 'https://github.com/legomushroom/mojs-curve-editor', target: '_blank' },
	      (0, _preact.h)(_icon2.default, { shape: 'mojs-logo' })
	    )
	  );
	};
	
	exports.default = CurveEditorLeft;

/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _getPrototypeOf = __webpack_require__(66);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(42);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(43);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(71);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(106);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _preact = __webpack_require__(48);
	
	var _iconButton = __webpack_require__(162);
	
	var _iconButton2 = _interopRequireDefault(_iconButton);
	
	var _propagating = __webpack_require__(116);
	
	var _propagating2 = _interopRequireDefault(_propagating);
	
	var _hammerjs = __webpack_require__(115);
	
	var _hammerjs2 = _interopRequireDefault(_hammerjs);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var CodeButton = function (_Component) {
	  (0, _inherits3.default)(CodeButton, _Component);
	
	  function CodeButton() {
	    (0, _classCallCheck3.default)(this, CodeButton);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(CodeButton).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(CodeButton, [{
	    key: 'render',
	    value: function render() {
	      var state = this.props.state;
	
	      return (0, _preact.h)(
	        'div',
	        { 'data-component': 'code-button', title: 'get code' },
	        (0, _preact.h)(_iconButton2.default, { shape: 'code', isCheck: state.controls.isCode })
	      );
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var store = this.context.store;
	
	      var mc = (0, _propagating2.default)(new _hammerjs2.default.Manager(this.base));
	      mc.add(new _hammerjs2.default.Tap());
	
	      mc.on('tap', function (e) {
	        store.dispatch({ type: 'CODE_TAP' });
	      });
	    }
	  }]);
	  return CodeButton;
	}(_preact.Component);
	
	exports.default = CodeButton;

/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _getPrototypeOf = __webpack_require__(66);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(42);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(43);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(71);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(106);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _hammerjs = __webpack_require__(115);
	
	var _hammerjs2 = _interopRequireDefault(_hammerjs);
	
	var _preact = __webpack_require__(48);
	
	var _icon = __webpack_require__(151);
	
	var _icon2 = _interopRequireDefault(_icon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	__webpack_require__(163);
	var CLASSES = __webpack_require__(165);
	
	var IconButton = function (_Component) {
	  (0, _inherits3.default)(IconButton, _Component);
	
	  function IconButton() {
	    (0, _classCallCheck3.default)(this, IconButton);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(IconButton).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(IconButton, [{
	    key: 'render',
	    value: function render() {
	      var p = this.props;
	      var check = p.isCheck ? CLASSES['is-checked'] : '';
	      return (0, _preact.h)(
	        'div',
	        { className: CLASSES['icon-button'] + ' ' + check,
	          title: p.title || '',
	          'data-component': 'icon-button' },
	        (0, _preact.h)(_icon2.default, { shape: this.props.shape })
	      );
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this2 = this;
	
	      if (typeof this.props.onTap === 'function') {
	        var hammertime = new _hammerjs2.default(this.base).on('tap', function (e) {
	          _this2.props.onTap(e, _this2.props);
	        });
	      }
	    }
	  }]);
	  return IconButton;
	}(_preact.Component);
	
	exports.default = IconButton;

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(164);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(125)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./icon-button.postcss.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./icon-button.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(124)();
	// imports
	
	
	// module
	exports.push([module.id, "._icon-button_6ysdi_4{position:relative;width:24px;height:24px;display:block;background:#3a0839;border-radius:3px;box-shadow:1px 1px 0 rgba(0,0,0,.15)}._icon-button_6ysdi_4 [data-component=icon]{position:absolute;left:50%;top:50%;width:100%;height:100%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}._icon-button_6ysdi_4:hover{box-shadow:none}._icon-button_6ysdi_4:hover [data-component=icon]{-webkit-transform:translate(-52%,-52%);transform:translate(-52%,-52%)}._icon-button_6ysdi_4._is-checked_6ysdi_31,._icon-button_6ysdi_4:active{border-radius:3px;box-shadow:inset -1px -1px 0 hsla(0,0%,100%,.25),inset 1px 1px 1px rgba(0,0,0,.4)}._icon-button_6ysdi_4._is-checked_6ysdi_31 [data-component=icon],._icon-button_6ysdi_4:active [data-component=icon]{-webkit-transform:translate(-54%,-54%) scale(.95);transform:translate(-54%,-54%) scale(.95)}", ""]);
	
	// exports


/***/ },
/* 165 */
/***/ function(module, exports) {

	module.exports = {
		"icon-button": "_icon-button_6ysdi_4",
		"is-checked": "_is-checked_6ysdi_31"
	};

/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _getPrototypeOf = __webpack_require__(66);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(42);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(43);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(71);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(106);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _preact = __webpack_require__(48);
	
	var _iconButton = __webpack_require__(162);
	
	var _iconButton2 = _interopRequireDefault(_iconButton);
	
	var _propagating = __webpack_require__(116);
	
	var _propagating2 = _interopRequireDefault(_propagating);
	
	var _hammerjs = __webpack_require__(115);
	
	var _hammerjs2 = _interopRequireDefault(_hammerjs);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var MinimizeButton = function (_Component) {
	  (0, _inherits3.default)(MinimizeButton, _Component);
	
	  function MinimizeButton() {
	    (0, _classCallCheck3.default)(this, MinimizeButton);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(MinimizeButton).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(MinimizeButton, [{
	    key: 'render',
	    value: function render() {
	      var state = this.props.state;
	
	      return (0, _preact.h)(
	        'div',
	        { 'data-component': 'minimize-button', title: 'minimize' },
	        (0, _preact.h)(_iconButton2.default, { shape: 'minimize' })
	      );
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var store = this.context.store;
	
	      var mc = (0, _propagating2.default)(new _hammerjs2.default.Manager(this.base));
	      mc.add(new _hammerjs2.default.Tap());
	
	      mc.on('tap', function (e) {
	        store.dispatch({ type: 'SET_MINIMIZE', data: true });
	      });
	    }
	  }]);
	  return MinimizeButton;
	}(_preact.Component);
	
	exports.default = MinimizeButton;

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _getPrototypeOf = __webpack_require__(66);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(42);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(43);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(71);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(106);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _preact = __webpack_require__(48);
	
	var _iconButton = __webpack_require__(162);
	
	var _iconButton2 = _interopRequireDefault(_iconButton);
	
	var _propagating = __webpack_require__(116);
	
	var _propagating2 = _interopRequireDefault(_propagating);
	
	var _hammerjs = __webpack_require__(115);
	
	var _hammerjs2 = _interopRequireDefault(_hammerjs);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var MaximizeButton = function (_Component) {
	  (0, _inherits3.default)(MaximizeButton, _Component);
	
	  function MaximizeButton() {
	    (0, _classCallCheck3.default)(this, MaximizeButton);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(MaximizeButton).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(MaximizeButton, [{
	    key: 'render',
	    value: function render() {
	      var state = this.props.state;
	
	      return (0, _preact.h)(
	        'div',
	        { 'data-component': 'maximize-button', title: 'maximize' },
	        (0, _preact.h)(_iconButton2.default, { shape: 'maximize' })
	      );
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var store = this.context.store;
	
	      var mc = (0, _propagating2.default)(new _hammerjs2.default.Manager(this.base));
	      mc.add(new _hammerjs2.default.Tap());
	
	      mc.on('tap', function (e) {
	        store.dispatch({ type: 'SET_MINIMIZE', data: false });
	      });
	    }
	  }]);
	  return MaximizeButton;
	}(_preact.Component);
	
	exports.default = MaximizeButton;

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _preact = __webpack_require__(48);
	
	var CLASSES = __webpack_require__(169);
	__webpack_require__(170);
	
	exports.default = function () {
	  return (0, _preact.h)('div', { className: CLASSES['icon-divider'],
	    'data-component': 'icon-divider' });
	};

/***/ },
/* 169 */
/***/ function(module, exports) {

	module.exports = {
		"icon-divider": "_icon-divider_ftask_3"
	};

/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(171);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(125)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./icon-divider.postcss.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./icon-divider.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(124)();
	// imports
	
	
	// module
	exports.push([module.id, "._icon-divider_ftask_3{position:relative;margin:0 auto;width:16px;height:1px;display:block;background:hsla(0,0%,100%,.3);box-shadow:0 1px 0 rgba(0,0,0,.3)}", ""]);
	
	// exports


/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _getPrototypeOf = __webpack_require__(66);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(42);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(43);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(71);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(106);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _preact = __webpack_require__(48);
	
	var _iconButton = __webpack_require__(162);
	
	var _iconButton2 = _interopRequireDefault(_iconButton);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	__webpack_require__(173);
	var CLASSES = __webpack_require__(175);
	
	var PointControls = function (_Component) {
	  (0, _inherits3.default)(PointControls, _Component);
	
	  function PointControls() {
	    (0, _classCallCheck3.default)(this, PointControls);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(PointControls).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(PointControls, [{
	    key: 'render',
	    value: function render() {
	      var p = this.props;
	      var state = p.state;
	      var controls = state.pointControls.present;
	      var show = controls.isShow ? CLASSES['is-show'] : '';
	      var className = p.className + ' ' + CLASSES['point-controls'] + ' ' + show;
	      var buttons = this._addButtons(controls);
	
	      return (0, _preact.h)(
	        'div',
	        { className: className },
	        ' ',
	        buttons,
	        ' '
	      );
	    }
	  }, {
	    key: '_onButtonTap',
	    value: function _onButtonTap(type) {
	      var _this2 = this;
	
	      return function (e) {
	        var store = _this2.context.store;
	
	
	        store.dispatch({ type: 'POINT_CHANGE_TYPE', data: type, isRecord: true });
	      };
	    }
	  }, {
	    key: '_addButtons',
	    value: function _addButtons(controls) {
	      var buttonsMap = ['straight', 'disconnected', 'mirrored', 'asymmetric'],
	          buttons = [];
	
	      for (var i = 0; i < buttonsMap.length; i++) {
	        var type = buttonsMap[i];
	        buttons.push((0, _preact.h)(_iconButton2.default, { shape: 'point-' + type,
	          title: type,
	          isCheck: controls.type === type,
	          onTap: this._onButtonTap(type) }));
	      }
	      return buttons;
	    }
	  }]);
	  return PointControls;
	}(_preact.Component);
	
	exports.default = PointControls;

/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(174);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(125)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./point-controls.postcss.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./point-controls.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(124)();
	// imports
	
	
	// module
	exports.push([module.id, "._point-controls_1xcu7_4{display:none}._point-controls_1xcu7_4 [data-component=icon-button]:after{content:'';position:absolute;width:3px;height:7.5px;background:#ff512f;border-top-right-radius:2px;border-bottom-right-radius:2px;left:-10px;top:50%;margin-top:-3.75px;display:none}._point-controls_1xcu7_4 [data-component=icon-button][class*=is-checked]:after,._point-controls_1xcu7_4._is-show_1xcu7_7{display:block}", ""]);
	
	// exports


/***/ },
/* 175 */
/***/ function(module, exports) {

	module.exports = {
		"point-controls": "_point-controls_1xcu7_4",
		"is-show": "_is-show_1xcu7_7"
	};

/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _preact = __webpack_require__(48);
	
	var _resizeHandle = __webpack_require__(150);
	
	var _resizeHandle2 = _interopRequireDefault(_resizeHandle);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// const CLASSES = require('../../css/blocks/curve-editor.postcss.css.json');
	
	__webpack_require__(177);
	var CLASSES = __webpack_require__(179);
	
	exports.default = function (_ref) {
	  var state = _ref.state;
	  var points = state.points;
	  var controls = state.controls;
	
	  var isShow = controls.isCode && !controls.isMinimize;
	  var open = isShow ? CLASSES['is-open'] : '';
	  var mainClass = CLASSES['code-panel'] + ' ' + open;
	
	  return (0, _preact.h)(
	    'div',
	    { className: mainClass },
	    (0, _preact.h)(
	      'div',
	      { className: CLASSES['code-panel__inner'] },
	      (0, _preact.h)(_resizeHandle2.default, { state: state, type: 'top' }),
	      (0, _preact.h)(
	        'div',
	        { className: CLASSES['code-panel__input-wrap'] },
	        (0, _preact.h)('input', { className: CLASSES['code-panel__input-field'],
	          type: 'text', readonly: 'readonly',
	          value: points.present.path })
	      )
	    )
	  );
	};

/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(178);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(125)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./code-panel.postcss.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./code-panel.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(124)();
	// imports
	
	
	// module
	exports.push([module.id, "._code-panel_nnb9p_3{position:absolute;left:10px;right:10px;bottom:100%;z-index:1;overflow:hidden;padding-top:16px;box-sizing:content-box}._code-panel_nnb9p_3 [data-component=resize-handle]{position:absolute;left:50%;bottom:100%}._code-panel__inner_nnb9p_1{border-radius:6px 6px 0 0;background:#3d1b3c;padding:4px 5px 5px;-webkit-transform:translateY(100%);transform:translateY(100%);-webkit-transition:all .2s ease-out;transition:all .2s ease-out}._code-panel__input-wrap_nnb9p_1{border-radius:2px;background:#42103f;border:1px solid #9c829a;box-shadow:inset 2px 2px 0 rgba(0,0,0,.5)}._code-panel__input-field_nnb9p_1{display:block;background:transparent;color:#fff;font-size:9px;font-family:Arial,Helvetica,sans-serif;letter-spacing:.45px;font-weight:100;padding:0 .3em 0 .8em;border:none;width:100%;height:21px;white-space:nowrap;text-overflow:ellipsis}._code-panel_nnb9p_3 ::-moz-selection,.code-panel ::-moz-selection{background:#ff512f}._code-panel_nnb9p_3 ::selection{background:#ff512f}._code-panel_nnb9p_3._is-open_nnb9p_61 ._code-panel__inner_nnb9p_1{-webkit-transform:translateY(0);transform:translateY(0)}", ""]);
	
	// exports


/***/ },
/* 179 */
/***/ function(module, exports) {

	module.exports = {
		"code-panel": "_code-panel_nnb9p_3",
		"code-panel__inner": "_code-panel__inner_nnb9p_1",
		"code-panel__input-wrap": "_code-panel__input-wrap_nnb9p_1",
		"code-panel__input-field": "_code-panel__input-field_nnb9p_1",
		"is-open": "_is-open_nnb9p_61"
	};

/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _preact = __webpack_require__(48);
	
	var Icons = function Icons() {
	  return (0, _preact.h)('div', { dangerouslySetInnerHTML: { __html: '<svg height="0" version="1.1" xmlns="http://www.w3.org/2000/svg" style="position:absolute; margin-left: -100%; width:0; height:0;" xmlns:xlink="http://www.w3.org/1999/xlink">\n      <g id="ellipsis-shape">\n        <circle cx="11" cy="16" r="1"></circle>\n        <circle cx="16" cy="16" r="1"></circle>\n        <circle cx="21" cy="16" r="1"></circle>\n      </g>\n      <path id="code-shape" d="M8,16.0849648 C8,15.8210793 8.11149069,15.6129393 8.33483405,15.4609065 L12.3390874,12.8419612 C12.3897649,12.8014192 12.4657813,12.7811481 12.5674985,12.7811481 C12.7398023,12.7811481 12.9048664,12.8571645 13.0623289,13.0095592 C13.2194294,13.161954 13.2983417,13.3393255 13.2983417,13.5423979 C13.2983417,13.7353347 13.2219633,13.8826617 13.0692066,13.9840168 L9.85769553,16.0849648 L13.0692066,18.1862747 C13.2219633,18.2677208 13.2983417,18.4146858 13.2983417,18.6278937 C13.2983417,18.830966 13.2197914,19.0061657 13.0623289,19.1531307 C12.9048664,19.3004576 12.7398023,19.3739401 12.5674985,19.3739401 C12.4657813,19.3739401 12.3897649,19.3536691 12.3390874,19.313127 L8.33483405,16.6938198 C8.11149069,16.541425 8,16.3387147 8,16.0849648 L8,16.0849648 Z M14.1399516,20.6875756 C14.1265582,20.6075774 14.1287301,20.5301131 14.1468293,20.4548207 L16.9395263,11.356022 C16.9891179,11.1623612 17.1237755,11.0468887 17.344223,11.0096045 C17.5042194,10.9824558 17.658786,11.0128623 17.8075609,11.1008242 C17.9563358,11.1891479 18.0442976,11.313308 18.0710844,11.4733044 C18.0862876,11.5634381 18.079772,11.6470561 18.0518993,11.7237965 L15.2664419,20.7748134 C15.2085247,20.9800577 15.0593878,21.1031318 14.8193932,21.1440358 C14.6488993,21.1729945 14.4994005,21.1389681 14.3698106,21.0426807 C14.2402208,20.9460313 14.1638424,20.8276629 14.1399516,20.6875756 L14.1399516,20.6875756 Z M18.9528744,19.1527687 C18.7954119,19.0058037 18.7168616,18.830604 18.7168616,18.6275317 C18.7168616,18.4244594 18.7878102,18.2774944 18.9300695,18.1859127 L22.1426665,16.0846028 L18.9300695,13.9836549 C18.7878102,13.8718022 18.7168616,13.7248372 18.7168616,13.5420359 C18.7168616,13.3389636 18.7954119,13.161592 18.9528744,13.0091973 C19.1103369,12.8568025 19.275039,12.7807861 19.4477048,12.7807861 C19.5389245,12.7807861 19.6098731,12.8014192 19.6609126,12.8415992 L23.6651659,15.4605445 C23.8881473,15.6129393 24,15.8210793 24,16.0846028 C24,16.3488502 23.8881473,16.5515606 23.6651659,16.6938198 L19.6609126,19.3127651 C19.6098731,19.3533071 19.5389245,19.3735782 19.4477048,19.3735782 C19.275039,19.3735782 19.1103369,19.3000957 18.9528744,19.1527687 L18.9528744,19.1527687 Z"></path>\n      <g id="point-straight-shape" fill="none">\n        <polyline fill="#8B6E8A" stroke="#FFFFFF" points="7.881 20.568 15.451 12.241 23.892 20.568"/>\n        <ellipse stroke="none" cx="16.8" cy="13.9" rx="2.667" ry="2.667" fill="black" fill-opacity="0.5" />\n        <circle cx="15.333" cy="12" r="2.667" fill="#FFFFFF"/>\n      </g>\n      <g id="point-mirrored-shape" fill="none" fill-rule="evenodd">\n        <path fill="#8B6E8A" stroke="#FFFFFF" d="M7.88144841,21.9012632 C7.88144841,21.9012632 7.59287172,13.5740537 15.4514423,13.5740537 C23.3100129,13.5740537 23.8921228,21.9012632 23.8921228,21.9012632"/>\n        <path stroke="#FF512F" d="M7.13883527,13.3333333 L25.8055013,13.3333333"/>\n        <ellipse stroke="none" cx="16.8" cy="14.9" rx="2.667" ry="2.667" fill="black" fill-opacity="0.5" />\n        <ellipse cx="15.333" cy="13.333" fill="#FFFFFF" rx="2.667" ry="2.667"/>\n        <rect width="2.667" height="2.667" x="24" y="12" fill="#FF512F"/>\n        <rect width="2.667" height="2.667" x="5.333" y="12" fill="#FF512F"/>\n      </g>\n      <g id="point-disconnected-shape" fill="none" fill-rule="evenodd">\n        <path fill="#8B6E8A" stroke="#FFFFFF" d="M7.88144841,20.5679298 C7.88144841,20.5679298 7.59287172,12.2407204 15.4514423,12.2407204 C21.2005207,17.88737 23.8921228,20.5679298 23.8921228,20.5679298"/>\n        <polyline stroke="#FF512F" points="6.133 12 15.228 12 23.933 20.602"/>\n        <ellipse stroke="none" cx="16.8" cy="13.4" rx="2.667" ry="2.667" fill="black" fill-opacity="0.5" />\n        <circle cx="15.333" cy="12" r="2.667" fill="#FFFFFF"/>\n        <rect width="2.667" height="2.667" x="21.886" y="18.552" fill="#FF512F" transform="rotate(45 23.219 19.886)"/>\n        <rect width="2.667" height="2.667" x="5.333" y="10.667" fill="#FF512F"/>\n      </g>\n      <g id="point-asymmetric-shape" fill="none" fill-rule="evenodd" transform="translate(7.667 9.333)">\n        <path fill="#8B6E8A" stroke="#FFFFFF" d="M0.214781742,11.2345965 C0.214781742,11.2345965 -0.373511869,2.90709613 7.78477564,2.90738704 C10.7500003,2.90749277 16.2254562,11.2345965 16.2254562,11.2345965"/>\n        <ellipse stroke="none" cx="9" cy="4.4" rx="2.667" ry="2.667" fill="black" fill-opacity="0.5" />\n        <path stroke="#FF512F" d="M2.52788503,2.66666667 L18.1388346,2.66666667"/>\n        <ellipse cx="7.667" cy="2.667" fill="#FFFFFF" rx="2.667" ry="2.667"/>\n        <rect width="2.667" height="2.667" x="16.333" y="1.333" fill="#FF512F"/>\n        <rect width="2.667" height="2.667" x=".333" y="1.333" fill="#FF512F"/>\n      </g>\n      <path id="mojs-logo-shape" d="M18.4678907,2.67700048 C19.488586,3.25758625 20.2789227,4.18421651 20.87823,5.1973579 C24.0807788,10.501451 27.2777091,15.8113116 30.480258,21.1154047 C31.1320047,22.1612281 31.7706417,23.2647256 31.9354512,24.5162532 C32.188284,26.0619186 31.6919826,27.7363895 30.5589171,28.80336 C29.4501984,29.8857103 27.8807622,30.3182659 26.3806209,30.3048086 C19.4511293,30.3086535 12.5235106,30.3086535 5.59401901,30.3048086 C3.71556494,30.343258 1.69852104,29.5723478 0.683444165,27.8709623 C-0.406546132,26.1099803 -0.0975282643,23.7914822 0.940022637,22.0843293 C4.34296485,16.4130445 7.76650826,10.7532945 11.1825603,5.08969961 C11.9747698,3.74781595 13.1846215,2.60202418 14.6847628,2.18292584 C15.9451812,1.81573418 17.3348251,2.01182606 18.4678907,2.67700048 Z M15.3334668,9.51526849 C15.6146238,9.03779476 16.0791597,9.02250655 16.3785679,9.4929547 L25.2763555,23.4736913 C25.5723919,23.9388414 25.3568433,24.3159201 24.8074398,24.3159202 L7.62314647,24.3159205 C7.06813505,24.3159206 6.84622798,23.9286889 7.12728913,23.4513779 L15.3334668,9.51526849 Z" fill-rule="evenodd"></path>\n      <path id="minimize-shape" d="M9,18.1970803 L14.4501217,18.1970803 L14.4501217,23.6472019 L9,18.1970803 Z M16.8832117,9 L22.3333333,14.4501217 L16.8832117,14.4501217 L16.8832117,9 Z"></path>\n      <path id="maximize-shape" d="M16.1358025,11 L21.6666667,11 L21.6666667,16.5308642 L16.1358025,11 Z M11,16.1358025 L16.5308642,21.6666667 L11,21.6666667 L11,16.1358025 Z"></path>\n    </svg>' } });
	};
	
	exports.default = Icons;

/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.reset = reset;
	
	var _constants = __webpack_require__(114);
	
	var _constants2 = _interopRequireDefault(_constants);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function reset(store) {
	  store.dispatch({ type: 'POINTS_REMOVE' });
	  store.dispatch({ type: 'POINT_ADD', data: { point: { x: 0, y: _constants2.default.CURVE_SIZE, isLockedX: true }, index: 0 } });
	  store.dispatch({ type: 'POINT_ADD', data: { point: { x: 100, y: 0, isLockedX: true }, index: 1 } });
	}

/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _classCallCheck2 = __webpack_require__(42);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(43);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var ActivePool = function () {
	  function ActivePool() {
	    (0, _classCallCheck3.default)(this, ActivePool);
	
	    this._subscribers = [];
	  }
	
	  (0, _createClass3.default)(ActivePool, [{
	    key: "add",
	    value: function add(fn) {
	      this._subscribers.push(fn);
	    }
	  }, {
	    key: "resetActive",
	    value: function resetActive(name) {
	      for (var i = 0; i < this._subscribers.length; i++) {
	        this._subscribers[i](name);
	      }
	    }
	  }]);
	  return ActivePool;
	}();
	
	exports.default = ActivePool;

/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(184);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(125)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./curve-editor.postcss.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/source-map-loader/index.js!./curve-editor.postcss.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 184 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(124)();
	// imports
	
	
	// module
	exports.push([module.id, "._curve-editor_10g8s_3{position:fixed;left:0;top:0;width:403px;height:378px;border-radius:12px;background:#572b51;z-index:100;box-shadow:0 0 3px 1px rgba(0,0,0,.38)}._curve-editor_10g8s_3 [data-component=maximize-button]{display:none}._curve-editor_10g8s_3 *{box-sizing:border-box}._curve-editor__left_10g8s_1{position:absolute;width:42px;left:0;top:0;bottom:0;padding:10px;cursor:move}._curve-editor__left_10g8s_1 [data-component=code-button]{margin-top:5px}._curve-editor__left_10g8s_1 [data-component=icon-divider]{margin:10px auto}._curve-editor__right_10g8s_133{position:absolute;left:43px;top:0;right:0;bottom:0}._curve-editor__right_10g8s_133:after{content:'';position:absolute;left:0;top:0;right:0;bottom:0;z-index:2;display:none}._curve-editor__resize-handle_10g8s_1{position:absolute}._curve-editor__resize-handle_10g8s_1[data-type=top]{top:-17px}._curve-editor__resize-handle_10g8s_1[data-type=bottom]{bottom:1px}._curve-editor__resize-handle_10g8s_1[data-type=bottom],._curve-editor__resize-handle_10g8s_1[data-type=top]{left:50%;margin-left:-21px}._curve-editor__resize-handle_10g8s_1[data-type=right]{right:-15px;top:50%;margin-top:-16px}._curve-editor__anchor-buttons_10g8s_128{margin-top:10px}._curve-editor__anchor-buttons_10g8s_128 [data-component=icon-button]{margin-bottom:5px}._curve-editor__mojs-logo_10g8s_111{position:absolute;bottom:17px;left:50%;margin-left:1px;-webkit-transform:translateX(-50%);transform:translateX(-50%)}._curve-editor__mojs-logo_10g8s_111 [data-component=icon]{fill:#ff512f;width:12px;height:12px}._curve-editor_10g8s_3._is-inactive_10g8s_110 ._curve-editor__mojs-logo_10g8s_111 [data-component=icon]{fill:#9c829a}._curve-editor_10g8s_3._is-minimized_10g8s_118{width:100px!important;height:45px!important;border-radius:7px}._curve-editor_10g8s_3._is-minimized_10g8s_118 ._curve-editor__anchor-buttons_10g8s_128,._curve-editor_10g8s_3._is-minimized_10g8s_118 ._curve-editor__mojs-logo_10g8s_111,._curve-editor_10g8s_3._is-minimized_10g8s_118 [data-component=code-button],._curve-editor_10g8s_3._is-minimized_10g8s_118 [data-component=icon-divider],._curve-editor_10g8s_3._is-minimized_10g8s_118 [data-component=minimize-button],._curve-editor_10g8s_3._is-minimized_10g8s_118 [data-component=point],._curve-editor_10g8s_3._is-minimized_10g8s_118 [data-component=resize-handle]{display:none}._curve-editor_10g8s_3._is-minimized_10g8s_118 ._curve-editor__right_10g8s_133:after{display:block}._curve-editor_10g8s_3._is-minimized_10g8s_118 ._curve__svg-wrapper_10g8s_137{margin-top:-200px}._curve-editor_10g8s_3._is-minimized_10g8s_118 [data-component=maximize-button]{display:block}._curve-editor_10g8s_3._is-hidden-on-min_10g8s_147._is-minimized_10g8s_118{display:none}", ""]);
	
	// exports


/***/ },
/* 185 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _redux = __webpack_require__(51);
	
	var _indexReducer = __webpack_require__(186);
	
	var _indexReducer2 = _interopRequireDefault(_indexReducer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var initStore = function initStore() {
	  return (0, _redux.createStore)(_indexReducer2.default);
	};
	// import reducer
	exports.default = initStore;

/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends2 = __webpack_require__(5);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	var _redux = __webpack_require__(51);
	
	var _reduxUndo = __webpack_require__(117);
	
	var _reduxUndo2 = _interopRequireDefault(_reduxUndo);
	
	var _resizeReducer = __webpack_require__(187);
	
	var _resizeReducer2 = _interopRequireDefault(_resizeReducer);
	
	var _pointsReducer = __webpack_require__(189);
	
	var _pointsReducer2 = _interopRequireDefault(_pointsReducer);
	
	var _controlsReducer = __webpack_require__(208);
	
	var _controlsReducer2 = _interopRequireDefault(_controlsReducer);
	
	var _pointControlsReducer = __webpack_require__(209);
	
	var _pointControlsReducer2 = _interopRequireDefault(_pointControlsReducer);
	
	var _progressesReducer = __webpack_require__(210);
	
	var _progressesReducer2 = _interopRequireDefault(_progressesReducer);
	
	var _reduxRecycle = __webpack_require__(211);
	
	var _reduxRecycle2 = _interopRequireDefault(_reduxRecycle);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// redux-undo higher-order reducer
	var UNDOABLE_OPTS = {
	  limit: 10,
	  filter: function filterActions(action, currState, history) {
	    return action.isRecord; // only add to history if isRecord set on action
	  },
	  debug: false
	}; // Redux utility functions
	
	
	var reducer = (0, _reduxRecycle2.default)((0, _redux.combineReducers)({
	  resize: _resizeReducer2.default,
	  points: (0, _reduxUndo2.default)(_pointsReducer2.default, (0, _extends3.default)({}, UNDOABLE_OPTS)),
	  controls: _controlsReducer2.default,
	  pointControls: (0, _reduxUndo2.default)(_pointControlsReducer2.default, (0, _extends3.default)({}, UNDOABLE_OPTS)),
	  progressLines: _progressesReducer2.default
	}), ['SET_STATE'], function (state, action) {
	  return action.data;
	});
	
	exports.default = reducer;

/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _defineProperty2 = __webpack_require__(188);
	
	var _defineProperty3 = _interopRequireDefault(_defineProperty2);
	
	var _extends4 = __webpack_require__(5);
	
	var _extends5 = _interopRequireDefault(_extends4);
	
	var _constants = __webpack_require__(114);
	
	var _constants2 = _interopRequireDefault(_constants);
	
	var _pool = __webpack_require__(137);
	
	var _pool2 = _interopRequireDefault(_pool);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var INITIAL_STATE = {
	  x: 20,
	  tempX: 0,
	
	  y: 20,
	  tempY: 0,
	
	  top: 0,
	  temp_top: 0,
	
	  right: 0,
	  temp_right: 0,
	
	  bottom: 0,
	  temp_bottom: 0,
	
	  panY: 0,
	  panTempY: 0,
	
	  scalerX: _constants2.default.CURVE_PERCENT,
	  absScalerX: 1
	};
	
	var resizeReducer = function resizeReducer() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? INITIAL_STATE : arguments[0];
	  var action = arguments[1];
	
	  _pool2.default.push(state);
	
	  switch (action.type) {
	    case 'EDITOR_RESIZE':
	      {
	        var data = action.data;
	        var type = data.type;
	        var delta = type === 'top' || type === 'bottom' ? data.y : data.x;
	
	        var newState = (0, _extends5.default)({}, state, (0, _defineProperty3.default)({}, 'temp_' + type, delta));
	
	        // if `right`size changed - calculate the scaler for x axis
	        if (type === 'right') {
	          newState['scalerX'] = (_constants2.default.CURVE_SIZE + Math.max(state.right + delta, 0)) / 100;
	          newState['absScalerX'] = newState['scalerX'] / _constants2.default.CURVE_PERCENT;
	        }
	        return newState;
	      }
	
	    case 'EDITOR_RESIZE_END':
	      {
	        var _extends3;
	
	        var _data = action.data;
	        var _type = _data.type;
	        var _delta = _type === 'top' || _type === 'bottom' ? _data.y : _data.x;
	        // get the total resize value ( temporary + actual )
	        var resize = state['' + action.data.type] + _delta;
	        // if the type if to - it has the `-` as base so we need to swap methods
	        var mathMethod = _type === 'top' ? 'min' : 'max';
	        var _newState = (0, _extends5.default)({}, state, (_extends3 = {}, (0, _defineProperty3.default)(_extends3, '' + action.data.type, Math[mathMethod](0, resize)), (0, _defineProperty3.default)(_extends3, 'temp_' + action.data.type, 0), _extends3));
	
	        return _newState;
	      }
	
	    case 'EDITOR_TRANSLATE':
	      {
	        var _action$data = action.data;
	        var x = _action$data.x;
	        var y = _action$data.y;
	
	        return (0, _extends5.default)({}, state, { tempX: x, tempY: y });
	      }
	
	    case 'EDITOR_TRANSLATE_END':
	      {
	        var _action$data2 = action.data;
	        var _x2 = _action$data2.x;
	        var _y = _action$data2.y;
	
	        _x2 += state.x;
	        _y += state.y;
	        return (0, _extends5.default)({}, state, { x: _x2, y: _y, tempX: 0, tempY: 0 });
	      }
	
	    case 'EDITOR_PAN':
	      {
	        var _y2 = action.data;
	        return (0, _extends5.default)({}, state, { panTempY: _y2 });
	      }
	
	    case 'EDITOR_PAN_END':
	      {
	        var _y3 = action.data;
	        return (0, _extends5.default)({}, state, { panTempY: 0, panY: _y3 + state.panY });
	      }
	
	  }
	  return state;
	};
	
	exports.default = resizeReducer;

/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _defineProperty = __webpack_require__(44);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (obj, key, value) {
	  if (key in obj) {
	    (0, _defineProperty2.default)(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }
	
	  return obj;
	};

/***/ },
/* 189 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _toConsumableArray2 = __webpack_require__(190);
	
	var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);
	
	var _extends2 = __webpack_require__(5);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	var _makePoint = __webpack_require__(200);
	
	var _makePoint2 = _interopRequireDefault(_makePoint);
	
	var _constants = __webpack_require__(114);
	
	var _constants2 = _interopRequireDefault(_constants);
	
	var _initPoints = __webpack_require__(201);
	
	var _initPoints2 = _interopRequireDefault(_initPoints);
	
	var _calculatePath = __webpack_require__(203);
	
	var _calculatePath2 = _interopRequireDefault(_calculatePath);
	
	var _deselectAll = __webpack_require__(206);
	
	var _deselectAll2 = _interopRequireDefault(_deselectAll);
	
	var _findSelectedIndecies = __webpack_require__(207);
	
	var _findSelectedIndecies2 = _interopRequireDefault(_findSelectedIndecies);
	
	var _pool = __webpack_require__(137);
	
	var _pool2 = _interopRequireDefault(_pool);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var INITIAL_STATE = {
	  path: '',
	  name: 'mojs-curve-editor',
	  segments: [],
	  points: []
	  // points: initPoints([
	  //   makePoint({ x: 0,   y: C.CURVE_SIZE, isLockedX: true, type: 'straight' }),
	  //   // makePoint({ x: 50,  y: C.CURVE_SIZE/2, type: 'mirrored' }),
	  //   makePoint({ x: 100, y: 0, isLockedX: true })
	  // ])
	};
	
	var pointsReducer = function pointsReducer() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? INITIAL_STATE : arguments[0];
	  var action = arguments[1];
	
	  _pool2.default.push(state);
	  switch (action.type) {
	    case 'SET_EDITOR_NAME':
	      {
	        return (0, _extends3.default)({}, state, { name: action.data });
	      }
	
	    case 'POINT_TRANSLATE':
	      {
	        var data = action.data;
	        var index = data.index;
	        var points = state.points;
	        var oldPoint = points[index];
	        var newPoints = [].concat((0, _toConsumableArray3.default)(points));
	
	        newPoints[data.index] = (0, _extends3.default)({}, oldPoint, { tempX: data.x, tempY: data.y });
	        return (0, _extends3.default)({}, state, { points: newPoints }, (0, _calculatePath2.default)(newPoints));
	      }
	
	    case 'POINT_TRANSLATE_END':
	      {
	        var _index = action.data;
	        var _points = state.points;
	        var _oldPoint = _points[_index];
	        var _newPoints = [].concat((0, _toConsumableArray3.default)(_points));
	
	        _newPoints[_index] = (0, _extends3.default)({}, _oldPoint, {
	          x: _oldPoint.x + _oldPoint.tempX,
	          y: _oldPoint.y + _oldPoint.tempY,
	          tempX: 0, tempY: 0
	        });
	
	        return (0, _extends3.default)({}, state, { points: _newPoints }, (0, _calculatePath2.default)(_newPoints));
	      }
	
	    case 'POINT_SELECT':
	      {
	        var _data = action.data;
	        var _index2 = _data.index;
	        var isDeselect = _data.isDeselect;
	        var newState = isDeselect ? (0, _deselectAll2.default)(state) : (0, _extends3.default)({}, state);
	        var _points2 = newState.points;
	
	
	        var point = _points2[_index2];
	        point.isSelected = true;
	        return (0, _extends3.default)({}, state, { points: _points2 });
	      }
	
	    case 'POINT_ADD':
	      {
	        var _data2 = action.data;
	        var _index3 = _data2.index;
	        var _point = _data2.point;
	        var deselected = (0, _deselectAll2.default)(state);
	
	        var _newPoints2 = [].concat((0, _toConsumableArray3.default)(deselected.points.slice(0, _index3)), [(0, _makePoint2.default)((0, _extends3.default)({}, _point))], (0, _toConsumableArray3.default)(deselected.points.slice(_index3)));
	
	        var _points3 = _newPoints2.length > 1 ? (0, _initPoints2.default)(_newPoints2) : _newPoints2;
	
	        var path = _points3.length > 1 ? (0, _calculatePath2.default)(_points3) : {};
	
	        return (0, _extends3.default)({}, state, { points: _points3 }, path);
	      }
	
	    case 'POINT_DELETE':
	      {
	        var _points4 = state.points;
	        var selected = (0, _findSelectedIndecies2.default)(_points4);
	
	        var _newPoints3 = [];
	        for (var i = 0; i < _points4.length; i++) {
	          var item = _points4[i];
	          (selected.indexOf(i) === -1 || item.isLockedX) && _newPoints3.push(item);
	        }
	
	        return (0, _extends3.default)({}, state, { points: _newPoints3 }, (0, _calculatePath2.default)(_newPoints3));
	      }
	
	    case 'POINT_CHANGE_TYPE':
	      {
	        var _points5 = state.points;
	        var type = action.data;
	        var _selected = (0, _findSelectedIndecies2.default)(_points5);
	
	        // change type on all selected items
	        var _newPoints4 = [].concat((0, _toConsumableArray3.default)(_points5));
	        for (var i = 0; i < _selected.length; i++) {
	          var _index4 = _selected[i],
	              _point2 = (0, _extends3.default)({}, _newPoints4[_index4], { type: type }),
	              handleIndex = _index4 === _newPoints4.length - 1 ? 1 : 2,
	              sibHandleIndex = handleIndex === 1 ? 2 : 1,
	              handleName = 'handle' + handleIndex,
	              sibHandleName = 'handle' + sibHandleIndex,
	              handle = (0, _extends3.default)({}, _point2[handleName]),
	              sibHandle = (0, _extends3.default)({}, _point2[sibHandleName]);
	
	          // move the opposite little handle with certain types
	          if (type === 'mirrored' || type === 'asymmetric') {
	            sibHandle.angle = handle.angle - 180;
	            if (type === 'mirrored') {
	              sibHandle.radius = handle.radius;
	            }
	          }
	
	          // save new point and handles
	          _newPoints4[_index4] = _point2;
	          _point2[handleName] = handle;
	          _point2[sibHandleName] = sibHandle;
	        }
	
	        return (0, _extends3.default)({}, state, { points: _newPoints4 }, (0, _calculatePath2.default)(_newPoints4));
	      }
	
	    case 'POINT_DESELECT_ALL':
	      {
	        return (0, _extends3.default)({}, (0, _deselectAll2.default)(state));
	      }
	
	    case 'SET_ACTIVE':
	      {
	        return !action.data ? (0, _extends3.default)({}, (0, _deselectAll2.default)(state)) : state;
	      }
	
	    // HANDLES
	    case 'HANDLE_TRANSLATE':
	      {
	        var _points6 = state.points;
	        var _data3 = action.data;
	        // create new state and copy the new point into it
	
	        var _newPoints5 = [].concat((0, _toConsumableArray3.default)(_points6)),
	            newPoint = (0, _extends3.default)({}, _newPoints5[_data3.parentIndex]);
	
	        _newPoints5[_data3.parentIndex] = newPoint;
	        // create handle and copy it into the new point
	        var _handleName = 'handle' + _data3.index,
	            newHandle = (0, _extends3.default)({}, newPoint[_handleName]);
	
	        newPoint[_handleName] = newHandle;
	        // finally add angle and radius
	        newHandle.angle = _data3.angle;
	        newHandle.radius = _data3.radius;
	
	        return (0, _extends3.default)({}, state, { points: _newPoints5 }, (0, _calculatePath2.default)(_newPoints5));
	      }
	
	    case 'HANDLE_TRANSLATE_END':
	      {
	        return state;
	      }
	
	    case 'POINTS_REMOVE':
	      {
	        return (0, _extends3.default)({}, state, { points: [] });
	      }
	
	    // case 'EDITOR_RESIZE': {
	    //   const {data} = action,
	    //         points = [...state.points],
	    //         {type, resize} = data;
	
	    //   // return state if resize to the `right`
	    //   if (type === 'right') { return state; }
	
	    //   // normalize points' y regarding resize
	    //   if ( type === 'top' ) {
	    //     for (var i = 0; i < points.length; i++) {
	    //       const borderTop = Math.min(resize.top + data.y, 0),
	    //             point     = points[i];
	    //       if (point.y < borderTop) { point.y = borderTop; }
	    //     }
	    //   } else if ( type === 'bottom' ) {
	    //     for (var i = 0; i < points.length; i++) {
	    //       const borderBottom = Math.max(resize.bottom + data.y, 0) + C.CURVE_SIZE,
	    //             point     = points[i];
	
	    //       if (point.y > borderBottom) { point.y = borderBottom; }
	    //     }
	    //   }
	
	    //   return { ...state, points, ...calculatePath( points ) };
	    // }
	
	  }
	  return state;
	};
	
	exports.default = pointsReducer;

/***/ },
/* 190 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _from = __webpack_require__(191);
	
	var _from2 = _interopRequireDefault(_from);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }
	
	    return arr2;
	  } else {
	    return (0, _from2.default)(arr);
	  }
	};

/***/ },
/* 191 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(192), __esModule: true };

/***/ },
/* 192 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(75);
	__webpack_require__(193);
	module.exports = __webpack_require__(4).Array.from;

/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ctx            = __webpack_require__(11)
	  , $export        = __webpack_require__(9)
	  , toObject       = __webpack_require__(41)
	  , call           = __webpack_require__(194)
	  , isArrayIter    = __webpack_require__(195)
	  , toLength       = __webpack_require__(32)
	  , createProperty = __webpack_require__(196)
	  , getIterFn      = __webpack_require__(197);
	
	$export($export.S + $export.F * !__webpack_require__(199)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = toObject(arrayLike)
	      , C       = typeof this == 'function' ? this : Array
	      , aLen    = arguments.length
	      , mapfn   = aLen > 1 ? arguments[1] : undefined
	      , mapping = mapfn !== undefined
	      , index   = 0
	      , iterFn  = getIterFn(O)
	      , length, result, step, iterator;
	    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
	      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
	        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = toLength(O.length);
	      for(result = new C(length); length > index; index++){
	        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(15);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(80)
	  , ITERATOR   = __webpack_require__(86)('iterator')
	  , ArrayProto = Array.prototype;
	
	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 196 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(14)
	  , createDesc      = __webpack_require__(22);
	
	module.exports = function(object, index, value){
	  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};

/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(198)
	  , ITERATOR  = __webpack_require__(86)('iterator')
	  , Iterators = __webpack_require__(80);
	module.exports = __webpack_require__(4).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 198 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(29)
	  , TAG = __webpack_require__(86)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';
	
	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};
	
	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(86)('iterator')
	  , SAFE_CLOSING = false;
	
	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }
	
	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ return {done: safe = true}; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 200 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends2 = __webpack_require__(5);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var fallback = function fallback(value, _fallback) {
	  return value != null ? value : _fallback;
	};
	
	var makeHandlePoint = function makeHandlePoint() {
	  var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  return {
	    index: fallback(o.index, 0),
	    // coordinates
	    angle: fallback(o.angle, null),
	    radius: fallback(o.radius, null),
	    // state
	    isTouched: fallback(o.isTouched, false),
	    isSelected: fallback(o.isSelected, false)
	  };
	};
	
	var makePositionPoint = function makePositionPoint() {
	  var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  return {
	    // coordinates
	    x: fallback(o.x, 0),
	    y: fallback(o.y, 0),
	    // temporary coordinates (when user moves the point) -
	    // should not be in history
	    tempX: fallback(o.tempX, 0),
	    tempY: fallback(o.tempY, 0),
	    // state
	    isTouched: fallback(o.isTouched, false),
	    isSelected: fallback(o.isSelected, false)
	  };
	};
	
	var makePoint = function makePoint() {
	  var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  return (0, _extends3.default)({
	    // state
	    // isOneHandle: fallback( o.isOneHandle, false ),
	    isLockedX: fallback(o.isLockedX, false),
	    isLockedY: fallback(o.isLockedY, false),
	    // type of the point:
	    //   'straight' || 'mirrored' || 'disconnected' || 'asymetric'
	    type: fallback(o.type, 'straight')
	  }, makePositionPoint(o), {
	    // add curve handles
	    handle1: makeHandlePoint(o.handle1 || { index: 1 }),
	    handle2: makeHandlePoint(o.handle2 || { index: 2 })
	  });
	};
	
	exports.default = makePoint;

/***/ },
/* 201 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _initPoint = __webpack_require__(202);
	
	var _initPoint2 = _interopRequireDefault(_initPoint);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (points) {
	
	  var newPoints = [];
	  for (var i = 0; i < points.length; i++) {
	    var point = points[i],
	        sibPoint = i === points.length - 1 ? points[i - 1] : points[i + 1],
	        handleIndex = i === points.length - 1 ? 1 : 2;
	
	    newPoints.push((0, _initPoint2.default)(point, sibPoint, handleIndex));
	  }
	  return newPoints;
	};

/***/ },
/* 202 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	      value: true
	});
	
	var _extends2 = __webpack_require__(5);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	var _constants = __webpack_require__(114);
	
	var _constants2 = _interopRequireDefault(_constants);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (point, sibPoint, handleIndex) {
	
	      point = (0, _extends3.default)({}, point);
	
	      var handleName = 'handle' + handleIndex,
	          sibHandleIndex = handleIndex === 1 ? 2 : 1,
	          sibHandleName = 'handle' + sibHandleIndex,
	          handle = (0, _extends3.default)({}, point[handleName]),
	          sibHandle = (0, _extends3.default)({}, point[sibHandleName]),
	          type = point.type;
	
	      point[handleName] = handle;
	      point[sibHandleName] = sibHandle;
	
	      if (handle.angle == null || handle.radius == null) {
	            handle.radius = 50;
	
	            var dy = (sibPoint.y - point.y) / _constants2.default.CURVE_PERCENT,
	                dx = sibPoint.x - point.x;
	
	            var angle = Math.atan(dy / dx) * (180 / Math.PI) - 90;
	            if (dx > 0) {
	                  angle = angle - 180;
	            };
	
	            handle.angle = angle;
	            sibHandle.radius = handle.radius;
	            sibHandle.angle = handle.angle - 180;
	      }
	
	      return point;
	};

/***/ },
/* 203 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _calculateSegment = __webpack_require__(204);
	
	var _calculateSegment2 = _interopRequireDefault(_calculateSegment);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (points) {
	  var path = '',
	      segments = [];
	
	  for (var index = 0; index < points.length - 1; index++) {
	    var point = points[index],
	        nextPoint = points[index + 1];
	
	    var segment = (0, _calculateSegment2.default)(point, nextPoint, index);
	    segments.push(segment);
	
	    path += segment.string;
	  }
	
	  return { path: path, segments: segments };
	};

/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _constants = __webpack_require__(114);
	
	var _constants2 = _interopRequireDefault(_constants);
	
	var _calculatePoint = __webpack_require__(205);
	
	var _calculatePoint2 = _interopRequireDefault(_calculatePoint);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (point, nextPoint, index) {
	    if (!nextPoint) {
	        return 1;
	    }
	
	    var string = '',
	        segmentString = '';
	
	    var x = point.x + point.tempX,
	        y = point.y + point.tempY,
	        xNext = nextPoint.x + nextPoint.tempX,
	        yNext = nextPoint.y + nextPoint.tempY;
	
	    var part1 = 'M' + x + ', ' + y / _constants2.default.CURVE_PERCENT + ' ';
	    if (index === 0) {
	        string += part1;
	    }
	    segmentString += part1;
	
	    var part2 = (0, _calculatePoint2.default)(point, 2);
	    string += part2;
	    segmentString += part2;
	
	    var part3 = (0, _calculatePoint2.default)(nextPoint, 1);
	    string += part3;
	    segmentString += part3;
	
	    var part4 = xNext + ', ' + yNext / _constants2.default.CURVE_PERCENT + ' ';
	    string += part4;
	    segmentString += part4;
	
	    return { string: string, segmentString: segmentString, index: index };
	};

/***/ },
/* 205 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _angleToPoint = __webpack_require__(120);
	
	var _angleToPoint2 = _interopRequireDefault(_angleToPoint);
	
	var _constants = __webpack_require__(114);
	
	var _constants2 = _interopRequireDefault(_constants);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (point) {
	  var handleIndex = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
	
	  var x = point.x + point.tempX,
	      y = point.y + point.tempY,
	      handle = point['handle' + handleIndex];
	
	  var CHAR = handleIndex === 2 ? 'C' : '';
	  if (point.type !== 'straight') {
	    var handleCoords = (0, _angleToPoint2.default)(handle.angle, handle.radius);
	    return '' + CHAR + (x + handleCoords.x / _constants2.default.CURVE_PERCENT) + ', ' + (y + handleCoords.y) / _constants2.default.CURVE_PERCENT + ' ';
	  } else {
	    return '' + CHAR + x + ', ' + y / _constants2.default.CURVE_PERCENT + ' ';
	  }
	};

/***/ },
/* 206 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends2 = __webpack_require__(5);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (state) {
	  var newState = (0, _extends3.default)({}, state, { points: [] }),
	      points = state.points;
	
	  for (var i = 0; i < points.length; i++) {
	    newState.points.push((0, _extends3.default)({}, points[i], { isSelected: false }));
	  }
	
	  return newState;
	};

/***/ },
/* 207 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (points) {
	  var indecies = [];
	
	  for (var i = 0; i < points.length; i++) {
	    points[i].isSelected && indecies.push(i);
	  }
	
	  return indecies;
	};

/***/ },
/* 208 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends2 = __webpack_require__(5);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	var _calculatePath = __webpack_require__(203);
	
	var _calculatePath2 = _interopRequireDefault(_calculatePath);
	
	var _pool = __webpack_require__(137);
	
	var _pool2 = _interopRequireDefault(_pool);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var INITIAL_STATE = {
	  isCode: false,
	  isMinimize: false,
	  isActive: false,
	  isHighlight: false
	};
	
	var controls = function controls() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? INITIAL_STATE : arguments[0];
	  var action = arguments[1];
	
	  _pool2.default.push(state);
	  switch (action.type) {
	    case 'CODE_TAP':
	      {
	        return (0, _extends3.default)({}, state, { isCode: !state.isCode });
	      }
	    case 'SET_MINIMIZE':
	      {
	        return (0, _extends3.default)({}, state, { isMinimize: action.data });
	      }
	    // case 'RESET_MINIMIZE_TRANISTION': {
	    //   return { ...state, isTransition: false };
	    // }
	    case 'SET_ACTIVE':
	      {
	        return (0, _extends3.default)({}, state, { isActive: action.data });
	      }
	    // case 'SET_HIGHLIGHT': {
	    //   return { ...state, isHighlight: action.data };
	    // }
	  }
	  return state;
	};
	
	exports.default = controls;

/***/ },
/* 209 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends2 = __webpack_require__(5);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	var _pool = __webpack_require__(137);
	
	var _pool2 = _interopRequireDefault(_pool);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var INITIAL_STATE = {
	  isShow: false,
	  type: 'straight'
	};
	
	var pointControls = function pointControls() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? INITIAL_STATE : arguments[0];
	  var action = arguments[1];
	
	  _pool2.default.push(state);
	  switch (action.type) {
	    // probably redundant
	    // case 'POINT_ADD': {
	    //   return { ...state, isShow: true, type: 'straight' };
	    // }
	    case 'POINT_SELECT':
	      {
	        var type = action.data.type;
	        return (0, _extends3.default)({}, state, { isShow: !action.isDeselect, type: type });
	      }
	    case 'POINT_CHANGE_TYPE':
	      {
	        return (0, _extends3.default)({}, state, { type: action.data });
	      }
	    case 'POINT_DESELECT_ALL':
	      {
	        return (0, _extends3.default)({}, state, { isShow: false });
	      }
	  }
	  return state;
	};
	
	exports.default = pointControls;

/***/ },
/* 210 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _toConsumableArray2 = __webpack_require__(190);
	
	var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);
	
	var _extends2 = __webpack_require__(5);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	var _pool = __webpack_require__(137);
	
	var _pool2 = _interopRequireDefault(_pool);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var INITIAL_STATE = {
	  selected: 0,
	  lines: []
	};
	
	var getColor = function getColor(lines) {
	  var COLORS = ['#FF512F', '#FF00C5', '#00FF69', 'white', '#1B8FE6', 'CYAN', 'YELLOW'];
	
	  return COLORS[lines.length % COLORS.length];
	};
	
	var makeProgressLine = function makeProgressLine() {
	  var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	  var state = arguments[1];
	  var lines = state.lines;
	
	  return {
	    // progress:     0,
	    color: getColor(lines),
	    name: 'easing' + (lines.length + 1)
	  };
	};
	
	var progresses = function progresses() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? INITIAL_STATE : arguments[0];
	  var action = arguments[1];
	
	  _pool2.default.push(state);
	
	  switch (action.type) {
	
	    case 'ADD_PROGRESS_LINE':
	      {
	        var newState = (0, _extends3.default)({}, state);
	        newState.lines = [].concat((0, _toConsumableArray3.default)(newState.lines), [makeProgressLine(action.data, state)]);
	        return newState;
	      }
	
	    case 'SET_SELECTED_PROGRESS_LINE':
	      {
	        var index = action.index;
	
	        return (0, _extends3.default)({}, state, { selected: index });
	      }
	
	    // case 'SET_PROGRESS_LINE_SHIFT': {
	    //   const {data}    = action,
	    //         {index}   = data,
	    //         newState  = { ...state },
	    //         {lines}   = newState;
	
	    //   newState.lines  = [ ...lines.slice( 0, index ),
	    //                       { ...lines[index], progress: data.progress },
	    //                       ...lines.slice( index+1 )
	    //                     ];
	
	    //   return newState;
	    // }
	  }
	  return state;
	};
	
	exports.default = progresses;

/***/ },
/* 211 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = recycleState;
	// redux-recycle higher order reducer
	function recycleState(reducer) {
	  var actions = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
	  var initialState = arguments[2];
	
	  var getInitialState = typeof initialState === 'function' ? initialState : function () {
	    return initialState;
	  };
	
	  return function (state, action) {
	    if (actions.indexOf(action.type) >= 0) {
	      return reducer(getInitialState(state, action), { type: '@@redux-recycle/INIT' });
	    }
	    return reducer(state, action);
	  };
	}
	// /redux-recycle

/***/ },
/* 212 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	/*
	  Function that returns the second argument if the first one isn't set.
	  @private
	  @param {Any} Property to set.
	  @param {Any} Property to return as fallback.
	  @returns {Any} If set - the first property, if not - the second.
	*/
	exports.default = function (prop, fallback) {
	  return prop != null ? prop : fallback;
	};

/***/ },
/* 213 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (fn) {
	  setTimeout(fn, 1);
	};

/***/ }
/******/ ])
});
;