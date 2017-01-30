(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["FoozleJS"] = factory();
	else
		root["FoozleJS"] = factory();
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
/******/ 	__webpack_require__.p = "";
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
	
	var _MasterWatcher = __webpack_require__(2);
	
	var _MasterWatcher2 = _interopRequireDefault(_MasterWatcher);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	(function (win, doc) {
	    var watcher = new _MasterWatcher2.default(win._foozlejs || {}, win, doc);
	    win.foozlejs = watcher.initAPI();
	})(window, document); /* eslint-disable no-underscore-dangle */

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable max-len */
	/* eslint-disable no-underscore-dangle */
	
	var _listener = __webpack_require__(3);
	
	var _listener2 = _interopRequireDefault(_listener);
	
	var _Config = __webpack_require__(8);
	
	var _Config2 = _interopRequireDefault(_Config);
	
	var _ConsoleWatcher = __webpack_require__(9);
	
	var _ConsoleWatcher2 = _interopRequireDefault(_ConsoleWatcher);
	
	var _Customer = __webpack_require__(10);
	
	var _Customer2 = _interopRequireDefault(_Customer);
	
	var _Enviroment = __webpack_require__(11);
	
	var _Enviroment2 = _interopRequireDefault(_Enviroment);
	
	var _Transmitter = __webpack_require__(12);
	
	var _Transmitter2 = _interopRequireDefault(_Transmitter);
	
	var _Log = __webpack_require__(13);
	
	var _Log2 = _interopRequireDefault(_Log);
	
	var _NetworkWatcher = __webpack_require__(14);
	
	var _NetworkWatcher2 = _interopRequireDefault(_NetworkWatcher);
	
	var _VisitorWatcher = __webpack_require__(15);
	
	var _VisitorWatcher2 = _interopRequireDefault(_VisitorWatcher);
	
	var _WindowWatcher = __webpack_require__(16);
	
	var _WindowWatcher2 = _interopRequireDefault(_WindowWatcher);
	
	var _utils = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var MasterWatcher = function () {
	    function MasterWatcher(token, win, doc) {
	        _classCallCheck(this, MasterWatcher);
	
	        try {
	            this.window = win;
	            this.document = doc;
	            this.config = new _Config2.default(token);
	            this.onFault = _utils.util.bind(this.onFault, this);
	            this.onError = _utils.util.bind(this.onError, this);
	
	            this.serialize = _utils.util.bind(this.serialize, this);
	            this.transmitter = new _Transmitter2.default(this.config);
	            this.log = new _Log2.default();
	            this.api = new _utils.InitWatcher(this.config, _utils.util, this.onError, this.serialize);
	            this.metadata = new _utils.MetadataReport(this.serialize);
	            this.environment = new _Enviroment2.default(this.window);
	            this.customer = new _Customer2.default(this.config, this.log, this.window, this.document);
	            this.apiConsoleWatcher = new _ConsoleWatcher2.default(this.log, this.onError, this.onFault, this.serialize, this.api, this.config.defaults.console);
	            this.windowConsoleWatcher = new _ConsoleWatcher2.default(this.log, this.onError, this.onFault, this.serialize, this.window, this.config.current.console);
	
	            if (this.window, this.document, this.util, this.onError, this.onFault, this.serialize, this.config, this.transmitter, this.log, this.api, this.metadata, this.environment, this.customer, this.customer.token && (this.apiConsoleWatcher, this.config.current.enabled && (this.windowConsoleWatcher, _utils.util.isBrowserSupported()))) {
	                this.callbackWatcher = new _listener2.default(this.onError, this.onFault, this.window, this.config.current.callback);
	                this.visitorWatcher = new _VisitorWatcher2.default(this.log, this.onError, this.onFault, this.document, this.config.current.visitor);
	                this.networkWatcher = new _NetworkWatcher2.default(this.log, this.onError, this.onFault, this.window, this.config.current.network);
	                this.windowWatcher = new _WindowWatcher2.default(this.onError, this.onFault, this.serialize, this.window, this.config.current.window);
	            }
	        } catch (command) {
	            this.onFault(command);
	        }
	    }
	
	    _createClass(MasterWatcher, [{
	        key: 'initAPI',
	        value: function initAPI() {
	            if (this.customer.token) {
	                this.api.addMetadata = this.metadata.addMetadata;
	                this.api.removeMetadata = this.metadata.removeMetadata;
	                return this.api;
	            }
	
	            return undefined;
	        }
	    }, {
	        key: 'onError',
	        value: function onError(NodeGenerator, args, options) {
	            var _this = this;
	
	            var active = false;
	
	            return function () {
	                if (_utils.util.isBrowserSupported() && _this.config.current.enabled) {
	                    try {
	                        args = args || {};
	                        options = options || {
	                            bindStack: null,
	                            bindTime: null,
	                            force: false
	                        };
	                        var message = args.message || _this.serialize(args, options.force);
	
	                        if (message && message.indexOf) {
	                            if (message.indexOf('FoozleJS Caught') !== -1) {
	                                return;
	                            }
	
	                            if (active && message.indexOf('Script error') !== -1) {
	                                active = false;
	                                return;
	                            }
	                        }
	
	                        var obj = _utils.util.extend({}, {
	                            bindStack: options.bindStack,
	                            bindTime: options.bindTime,
	                            column: args.column || args.columnNumber,
	                            console: _this.windowConsoleWatcher.report(),
	                            customer: _this.customer.report(),
	                            entry: NodeGenerator,
	                            environment: _this.environment.report(),
	                            file: args.file || args.fileName,
	                            line: args.line || args.lineNumber,
	                            message: message,
	                            metadata: _this.metadata.report(),
	                            network: _this.networkWatcher.report(),
	                            url: (_this.window.location || '').toString(),
	                            stack: args.stack,
	                            timestamp: _utils.util.isoNow(),
	                            visitor: _this.visitorWatcher.report(),
	                            version: '1.0.4'
	                        });
	
	                        if (!options.force) {
	                            try {
	                                if (!_this.config.current.onError(obj, args)) {
	                                    return;
	                                }
	                            } catch (e) {
	                                obj.console.push({
	                                    timestamp: _utils.util.isoNow(),
	                                    severity: 'error',
	                                    message: e.message
	                                });
	
	                                setTimeout(function () {
	                                    _this.onError('catch', e, {
	                                        force: true
	                                    });
	                                }, 0);
	                            }
	                        }
	
	                        _this.log.clear();
	
	                        setTimeout(function () {
	                            active = false;
	                        });
	                        active = true;
	                        _this.transmitter.sendError(obj, _this.customer.token);
	                    } catch (e) {
	                        _this.onFault(e);
	                    }
	                }
	            }();
	        }
	    }, {
	        key: 'onFault',
	        value: function onFault(error) {
	            var sysLogger = this.transmitter || new _Transmitter2.default();
	            var customer = this.customer || {};
	            var foozle = this.window ? this.window._foozlejs : {};
	
	            error = error || {};
	
	            error = {
	                token: customer.token || foozle.token,
	                file: error.file || error.fileName,
	                msg: error.message || 'unknown',
	                stack: (error.stack || 'unknown').substr(0, 500),
	                url: this.window.location,
	                v: '1.0.4',
	                h: '9b37e9ac0b951d1cc4f7724bcd102d9edbc4a5d2',
	                x: _utils.util.uuid()
	            };
	            sysLogger.sendTrackerFault(error);
	        }
	    }, {
	        key: 'serialize',
	        value: function serialize(obj, method) {
	            if (this.config.current.serialize && !method) {
	                try {
	                    return this.config.current.serialize(obj);
	                } catch (err) {
	                    this.onError('catch', err, {
	                        force: true
	                    });
	                }
	            }
	
	            return this.config.defaults.serialize(obj);
	        }
	    }]);
	
	    return MasterWatcher;
	}();
	
	exports.default = MasterWatcher;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable func-names */
	/* eslint-disable prefer-rest-params */
	/* eslint-disable no-underscore-dangle */
	/* eslint-disable consistent-return */
	/* eslint-disable class-methods-use-this */
	
	var _Stack = __webpack_require__(4);
	
	var _Stack2 = _interopRequireDefault(_Stack);
	
	var _utils = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Listener = function () {
	    function Listener(onError, onFault, options, config) {
	        _classCallCheck(this, Listener);
	
	        this.onError = onError;
	        this.onFault = onFault;
	        this.options = options;
	        if (config.enabled) this.initialize(options);
	    }
	
	    _createClass(Listener, [{
	        key: 'initialize',
	        value: function initialize(win) {
	            if (win.addEventListener) {
	                this.wrapAndCatch(win.Element.prototype, 'addEventListener', 1);
	                this.wrapAndCatch(win.XMLHttpRequest.prototype, 'addEventListener', 1);
	                this.wrapRemoveEventListener(win.Element.prototype);
	                this.wrapRemoveEventListener(win.XMLHttpRequest.prototype);
	            }
	
	            this.wrapAndCatch(win, 'setTimeout', 0);
	            this.wrapAndCatch(win, 'setInterval', 0);
	        }
	    }, {
	        key: 'wrapAndCatch',
	        value: function wrapAndCatch(proto, name, i) {
	            var self = this;
	            var method = proto[name];
	
	            if (_utils.util.isWrappableFunction(method)) {
	                proto[name] = function () {
	                    var _arguments = arguments,
	                        _this = this;
	
	                    try {
	                        var _ret = function () {
	                            var args = Array.prototype.slice.call(_arguments);
	                            var callback = args[i];
	                            var options = void 0;
	                            var fn = void 0;
	
	                            if (self.options.bindStack) {
	                                try {
	                                    throw Error();
	                                } catch (e) {
	                                    fn = e.stack;
	                                    options = self.util.isoNow();
	                                }
	                            }
	
	                            var bind = function bind() {
	                                try {
	                                    if (_utils.util.isObject(callback)) {
	                                        return callback.handleEvent.apply(callback, arguments);
	                                    }
	
	                                    if (_utils.util.isFunction(callback)) {
	                                        return callback.apply(this, arguments);
	                                    }
	                                } catch (err) {
	                                    throw self.onError('catch', err, {
	                                        bindTime: options,
	                                        bindStack: fn
	                                    }), _utils.util.wrapError(err);
	                                }
	
	                                return null;
	                            };
	
	                            if (name === 'addEventListener') {
	                                if (!_this._foozlejsEvt) {
	                                    _this._foozlejsEvt = new _Stack2.default();
	                                    _this._foozlejsEvt.get(args[0], callback, args[2]);
	                                    return {
	                                        v: void 0
	                                    };
	                                }
	                            }
	
	                            try {
	                                if (callback) {
	                                    _utils.util.isWrappableFunction(callback);
	                                    _utils.util.isWrappableFunction(callback.handleEvent);
	                                    args[i] = bind;
	
	                                    if (name === 'addEventListener') {
	                                        _this._foozlejsEvt.add(args[0], callback, args[2], args[i]);
	                                    }
	                                }
	                            } catch (e) {
	                                return {
	                                    v: method.apply(_this, _arguments)
	                                };
	                            }
	                            return {
	                                v: method.apply(_this, args)
	                            };
	                        }();
	
	                        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	                    } catch (e) {
	                        proto[name] = method;
	                        self.onFault(e);
	                    }
	                };
	            }
	        }
	    }, {
	        key: 'wrapRemoveEventListener',
	        value: function wrapRemoveEventListener(doc) {
	
	            if (doc && doc.removeEventListener && _utils.util.hasFunction(doc.removeEventListener, 'call')) {
	                (function () {
	                    var func = doc.removeEventListener;
	                    doc.removeEventListener = function (a, b, callback) {
	                        if (this._foozlejsEvt) {
	                            var foozlejsEvt = this._foozlejsEvt.get(a, b, callback);
	                            if (foozlejsEvt) {
	                                this._foozlejsEvt.remove(a, b, callback);
	                            }
	                            return func.call(this, a, foozlejsEvt, callback);
	                        }
	                        return func.call(this, a, b, callback);
	                    };
	                })();
	            }
	        }
	    }]);
	
	    return Listener;
	}();
	
	exports.default = Listener;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utils = __webpack_require__(5);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Stack = function () {
	    function Stack() {
	        _classCallCheck(this, Stack);
	
	        this.events = [];
	    }
	
	    _createClass(Stack, [{
	        key: 'add',
	        value: function add(a, b, c, d) {
	            if (this.indexOf(a, b, c) <= -1) {
	                c = Stack.getEventOptions(c);
	                this.events.push([a, b, c.capture, c.once, c.passive, d]);
	            }
	        }
	    }, {
	        key: 'get',
	        value: function get(a, b, c) {
	            a = this.indexOf(a, b, c);
	            return a >= 0 ? this.events[a][5] : undefined;
	        }
	    }, {
	        key: 'indexOf',
	        value: function indexOf(fn, scope, options) {
	            options = Stack.getEventOptions(options);
	            for (var i = 0; i < this.events.length; i += 1) {
	                var item = this.events[i];
	                if (item[0] === fn && item[1] === scope && item[2] === options.capture && item[3] === options.once && item[4] === options.passive) {
	                    return i;
	                }
	            }
	            return -1;
	        }
	    }, {
	        key: 'remove',
	        value: function remove(a, b, c) {
	            a = this.indexOf(a, b, c);
	            if (a >= 0) this.events.splice(a, 1);
	        }
	    }], [{
	        key: 'getEventOptions',
	        value: function getEventOptions(value) {
	            var object = {
	                capture: false,
	                once: false,
	                passive: false
	            };
	            return _utils.util.isBoolean(value) ? _utils.util.extend(object, {
	                capture: value
	            }) : _utils.util.extend(object, value);
	        }
	    }]);
	
	    return Stack;
	}();
	
	exports.default = Stack;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /* eslint-disable func-names */
	/* eslint-disable prefer-rest-params */
	/* eslint-disable max-len */
	/* eslint-disable no-bitwise */
	/* eslint-disable no-restricted-syntax */
	/* eslint-disable no-mixed-operators */
	
	var _initWatcher = __webpack_require__(6);
	
	var _metaDataReport = __webpack_require__(7);
	
	var util = function () {
	    return {
	        bind: function bind(v, self) {
	            return function () {
	                return v.apply(self, Array.prototype.slice.call(arguments));
	            };
	        },
	        contains: function contains(x, callback) {
	            var i = void 0;
	            for (i = 0; i < x.length; i += 1) {
	                if (x[i] === callback) return true;
	            }
	            return false;
	        },
	        defer: function defer(context, frame) {
	            setTimeout(function () {
	                context.apply(frame);
	            });
	        },
	        extend: function extend(target) {
	            var args = Array.prototype.slice.call(arguments, 1);
	
	            for (var i = 0; i < args.length; i += 1) {
	                for (var key in args[i]) {
	                    if (args[i][key] === null || args[i][key] === undefined) {
	                        target[key] = args[i][key];
	                    } else if (Object.prototype.toString.call(args[i][key]) === '[object Object]') {
	                        target[key] = target[key] || {};
	                        this.extend(target[key], args[i][key]);
	                    } else {
	                        target[key] = args[i][key];
	                    }
	                }
	            }
	            return target;
	        },
	        hasFunction: function hasFunction(has, name) {
	            try {
	                return !!has[name];
	            } catch (c) {
	                return false;
	            }
	        },
	        isBoolean: function isBoolean(object) {
	            return object === true || object === false;
	        },
	        isBrowserIE: function isBrowserIE() {
	            var m = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.navigator.userAgent;
	
	            var match = m.match(/Trident\/([\d.]+)/);
	
	            if (match && match[1] === '7.0') {
	                m = 11;
	            } else if (m.match(/MSIE ([\d.]+)/)) {
	                m = parseInt(m[1], 10);
	            } else {
	                m = false;
	            }
	            return m;
	        },
	        isBrowserSupported: function isBrowserSupported() {
	            var hasMinimumVersion = this.isBrowserIE();
	            return !hasMinimumVersion || hasMinimumVersion >= 8;
	        },
	        isFunction: function isFunction(actual) {
	            return !(!actual || typeof actual !== 'function');
	        },
	        isObject: function isObject(obj) {
	            return !(!obj || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object');
	        },
	        isWrappableFunction: function isWrappableFunction(value) {
	            return this.isFunction(value) && this.hasFunction(value, 'apply');
	        },
	        isoNow: function isoNow() {
	            var d = new Date();
	            if (d.toISOString) {
	                return d.toISOString();
	            }
	            return d.getUTCFullYear() + '-' + this.pad(d.getUTCMonth() + 1) + '-' + this.pad(d.getUTCDate()) + 'T' + this.pad(d.getUTCHours()) + ':' + this.pad(d.getUTCMinutes()) + ':' + this.pad(d.getUTCSeconds()) + '.' + String((d.getUTCMilliseconds() / 1e3).toFixed(3)).slice(2, 5) + 'Z';
	        },
	        pad: function pad(val) {
	            val = String(val);
	            if (val.length === 1) {
	                val = '0' + val;
	            }
	            return val;
	        },
	        testCrossdomainXhr: function testCrossdomainXhr() {
	            return 'withCredentials' in new XMLHttpRequest();
	        },
	        uuid: function uuid() {
	            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	                var a = 16 * Math.random() | 0;
	                return (c === 'x' ? a : a & 3 | 8).toString(16);
	            });
	        },
	        wrapError: function wrapError(e) {
	            if (e.innerError) return e;
	            var error = Error('FoozleJS Caught: ' + (e.message || e));
	            error.description = 'FoozleJS Caught: ' + e.description;
	            error.file = e.file;
	            error.line = e.line || e.lineNumber;
	            error.column = e.column || e.columnNumber;
	            error.stack = e.stack;
	            error.innerError = e;
	            return error;
	        }
	    };
	}();
	
	module.exports = {
	    util: util,
	    MetadataReport: _metaDataReport.MetadataReport,
	    InitWatcher: _initWatcher.InitWatcher
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	/* eslint-disable no-restricted-syntax */
	/* eslint-disable prefer-rest-params */
	/* eslint-disable no-shadow */
	/* eslint-disable func-names */
	
	var InitWatcher = function InitWatcher(request, util, error, callback) {
	    return {
	        attempt: function attempt(fn, scope) {
	            try {
	                var args = Array.prototype.slice.call(arguments, 2);
	                return fn.apply(scope || this, args);
	            } catch (err) {
	                throw error('catch', err), util.wrapError(err);
	            }
	        },
	        configure: function configure(app) {
	            return request.setCurrent(app);
	        },
	        track: function track(err) {
	            var message = callback(err);
	
	            err = err || {};
	            if (!err.stack) {
	                try {
	                    throw Error(message);
	                } catch (e) {
	                    err = e;
	                }
	            }
	            error('direct', err);
	        },
	        watch: function watch(callback, scope) {
	            var _arguments = arguments,
	                _this = this;
	
	            return function () {
	                try {
	                    var args = Array.prototype.slice.call(_arguments, 0);
	                    return callback.apply(scope || _this, args);
	                } catch (err) {
	                    throw error('catch', err), util.wrapError(err);
	                }
	            };
	        },
	        watchAll: function watchAll(obj) {
	            var classes = Array.prototype.slice.call(arguments, 1);
	            var name = void 0;
	
	            for (name in obj) {
	                if (typeof obj[name] === 'function' && util.contains(classes, name)) {
	                    (function () {
	                        var orig = obj[name];
	                        obj[name] = function () {
	                            try {
	                                var args = Array.prototype.slice.call(arguments, 0);
	                                return orig.apply(this, args);
	                            } catch (err) {
	                                throw error('catch', err), util.wrapError(err);
	                            }
	                        };
	                    })();
	                }
	            }
	            return obj;
	        },
	
	
	        hash: '9b37e9ac0b951d1cc4f7724bcd102d9edbc4a5d2',
	        version: '1.0.4'
	    };
	};
	
	module.exports = {
	    InitWatcher: InitWatcher
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	/* eslint-disable no-restricted-syntax */
	
	var MetadataReport = function MetadataReport(filter) {
	    var obj = {};
	
	    return {
	        addMetadata: function addMetadata(key, value) {
	            obj[key] = value;
	        },
	        removeMetadata: function removeMetadata(name) {
	            delete obj[name];
	        },
	        report: function report() {
	            var index = [];
	            var i = void 0;
	            for (i in obj) {
	                if (obj.hasOwnProperty(i)) {
	                    index.push({
	                        key: i,
	                        value: filter(obj[i])
	                    });
	                }
	            }
	            return index;
	        },
	
	        store: obj
	    };
	};
	
	module.exports = {
	    MetadataReport: MetadataReport
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable valid-typeof */
	/* eslint-disable no-restricted-syntax */
	
	var _utils = __webpack_require__(5);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Config = function () {
	    function Config(token) {
	        _classCallCheck(this, Config);
	
	        this.current = {};
	        this.initOnly = Config.initChecks();
	        this.defaults = Config.initDefaults();
	
	        this.initCurrent(token);
	    }
	
	    _createClass(Config, [{
	        key: 'initCurrent',
	        value: function initCurrent(options) {
	            if (this.validate(options, this.defaults, 'config', {})) {
	                this.current = _utils.util.extend(this.current, this.defaults, options);
	                return true;
	            }
	            this.current = _utils.util.extend(this.current, this.defaults);
	            return false;
	        }
	    }, {
	        key: 'setCurrent',
	        value: function setCurrent(obj) {
	            if (this.validate(obj, this.defaults, 'config', this.initOnly)) {
	                this.current = _utils.util.extend(this.current, obj);
	                return true;
	            }
	            return false;
	        }
	    }, {
	        key: 'validate',
	        value: function validate(obj, attr, value, type) {
	            var result = true;
	            value = value || '';
	            type = type || {};
	
	            for (var i in obj) {
	                if (obj.hasOwnProperty(i)) {
	                    if (attr.hasOwnProperty(i)) {
	                        var error = _typeof(attr[i]);
	
	                        if (_typeof(obj[i]) !== error) {
	                            console.warn(value + '.' + i + ': property must be type ' + error + '.');
	                            result = false;
	                        } else if (Object.prototype.toString.call(obj[i]) !== '[object Array]' || Config.validateArray(obj[i], attr[i], value + '.' + i)) {
	                            if (Object.prototype.toString.call(obj[i]) === '[object Object]') {
	                                result = this.validate(obj[i], attr[i], value + '.' + i, type[i]);
	                            } else if (type.hasOwnProperty(i)) {
	                                console.warn(value + '.' + i + ': property cannot be set after load.');
	                                result = false;
	                            }
	                        } else {
	                            result = false;
	                        }
	                    } else {
	                        console.warn(value + '.' + i + ': property not supported.');
	                        result = false;
	                    }
	                }
	            }
	            return result;
	        }
	    }], [{
	        key: 'initChecks',
	        value: function initChecks() {
	            return {
	                cookie: true,
	                enabled: true,
	                token: true,
	                callback: {
	                    enabled: true
	                },
	                console: {
	                    enabled: true
	                },
	                network: {
	                    enabled: true
	                },
	                visitor: {
	                    enabled: true
	                },
	                window: {
	                    enabled: true,
	                    promise: true
	                }
	            };
	        }
	    }, {
	        key: 'initDefaults',
	        value: function initDefaults() {
	            return {
	                application: '',
	                cookie: false,
	                enabled: true,
	                errorURL: 'https://foozlejs.herokuapp.com/capture',
	                errorNoSSLURL: 'http://foozlejs.herokuapp.com/capture',
	                faultURL: 'http://foozlejs.herokuapp.com/project/internal/error/',
	                onError: function onError() {
	                    return true;
	                },
	                serialize: function serialize(obj) {
	                    if (obj && typeof obj === 'string') {
	                        return obj;
	                    }
	
	                    if (typeof obj === 'number' && isNaN(obj)) {
	                        return 'NaN';
	                    }
	
	                    if (obj === '') {
	                        return 'Empty String';
	                    }
	
	                    var jsonObj = void 0;
	                    try {
	                        jsonObj = JSON.stringify(obj);
	                    } catch (c) {
	                        jsonObj = 'Unserializable Object';
	                    }
	
	                    if (jsonObj) {
	                        return jsonObj;
	                    }
	
	                    if (obj === undefined) {
	                        return 'undefined';
	                    }
	
	                    if (obj && obj.toString) {
	                        return obj.toString();
	                    }
	
	                    return 'unknown';
	                },
	
	                sessionId: '',
	                token: '',
	                userId: '',
	                version: '',
	                callback: {
	                    enabled: true,
	                    bindStack: false
	                },
	                console: {
	                    enabled: true,
	                    display: true,
	                    error: true,
	                    warn: false,
	                    watch: ['log', 'debug', 'info', 'warn', 'error']
	                },
	                network: {
	                    enabled: true,
	                    error: true
	                },
	                visitor: {
	                    enabled: true
	                },
	                usageURL: 'https://foozlejs.herokuapp.com/capture',
	                window: {
	                    enabled: true,
	                    promise: true
	                }
	            };
	        }
	    }, {
	        key: 'validateArray',
	        value: function validateArray(obj, name, prefix) {
	            var ret = true;
	            prefix = prefix || '';
	            for (var i = 0; i < obj.length; i += 1) {
	                if (!_utils.util.contains(name, obj[i])) {
	                    console.warn(prefix + '[' + i + ']: invalid value: ' + obj[i] + '.');
	                    ret = false;
	                }
	            }
	            return ret;
	        }
	    }]);
	
	    return Config;
	}();
	
	exports.default = Config;
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable func-names */
	/* eslint-disable prefer-rest-params */
	
	var _utils = __webpack_require__(5);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ConsoleWatcher = function () {
	    function ConsoleWatcher(log, onError, onFault, serialize, win, con) {
	        _classCallCheck(this, ConsoleWatcher);
	
	        this.log = log;
	        this.onError = onError;
	        this.onFault = onFault;
	        this.serialize = serialize;
	        if (con.enabled) {
	            win.console = this.wrapConsoleObject(win.console, con);
	        }
	    }
	
	    _createClass(ConsoleWatcher, [{
	        key: 'wrapConsoleObject',
	        value: function wrapConsoleObject() {
	            var proto = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	            var obj = arguments[1];
	
	            var socket = proto.log || function () {};
	            var self = this;
	            var i = void 0;
	
	            for (i = 0; i < obj.watch.length; i += 1) {
	                (function (name) {
	                    var fn = proto[name] || socket;
	
	                    proto[name] = function () {
	                        try {
	                            var args = Array.prototype.slice.call(arguments);
	
	                            self.log.add('c', {
	                                timestamp: _utils.util.isoNow(),
	                                severity: name,
	                                message: self.serialize(args.length === 1 ? args[0] : args)
	                            });
	
	                            if (obj.error && name === 'error' || obj.warn && name === 'warn') {
	                                try {
	                                    throw Error(self.serialize(args.length === 1 ? args[0] : args));
	                                } catch (buffer) {
	                                    self.onError('console', buffer);
	                                }
	                            }
	                            if (obj.display && _utils.util.hasFunction(fn, 'apply')) {
	                                fn.apply(this, args);
	                            } else {
	                                fn(args[0], args[1], args[2]);
	                            }
	                        } catch (buffer) {
	                            self.onFault(buffer);
	                        }
	                    };
	                })(obj.watch[i]);
	            }
	            return proto;
	        }
	    }, {
	        key: 'report',
	        value: function report() {
	            return this.log.all('c');
	        }
	    }]);
	
	    return ConsoleWatcher;
	}();
	
	exports.default = ConsoleWatcher;
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utils = __webpack_require__(5);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Customer = function () {
	    function Customer(config, log, win, doc) {
	        _classCallCheck(this, Customer);
	
	        this.config = config;
	        this.log = log;
	        this.window = win;
	        this.document = doc;
	        this.correlationId = this.token = null;
	        this.initialize();
	    }
	
	    _createClass(Customer, [{
	        key: 'initialize',
	        value: function initialize() {
	            this.token = this.getCustomerToken();
	            this.correlationId = this.getCorrelationId();
	        }
	    }, {
	        key: 'getCustomerToken',
	        value: function getCustomerToken() {
	            if (this.config.current.token) {
	                return this.config.current.token;
	            }
	            return undefined;
	        }
	    }, {
	        key: 'getCorrelationId',
	        value: function getCorrelationId() {
	            var name = void 0;
	
	            if (!this.config.current.cookie) {
	                return _utils.util.uuid();
	            }
	
	            try {
	                name = this.document.cookie.replace(/(?:(?:^|.*;\s*)FoozleJS\s*=\s*([^;]*).*$)|^.*$/, '$1');
	                if (!name) {
	                    name = _utils.util.uuid();
	                    this.document.cookie = 'FoozleJS=' + name + '; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
	                }
	            } catch (b) {
	                name = _utils.util.uuid();
	            }
	            return name;
	        }
	    }, {
	        key: 'report',
	        value: function report() {
	            return {
	                application: this.config.current.application,
	                correlationId: this.correlationId,
	                sessionId: this.config.current.sessionId,
	                token: this.token,
	                userId: this.config.current.userId,
	                version: this.config.current.version
	            };
	        }
	    }]);
	
	    return Customer;
	}();
	
	exports.default = Customer;
	module.exports = exports['default'];

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/* eslint-disable max-len */
	/* eslint-disable no-empty */
	/* eslint-disable no-restricted-syntax */
	
	var Enviroment = function () {
	    function Enviroment(win) {
	        _classCallCheck(this, Enviroment);
	
	        this.loadedOn = new Date().getTime();
	        this.window = win;
	    }
	
	    _createClass(Enviroment, [{
	        key: 'discoverDependencies',
	        value: function discoverDependencies() {
	            var name = void 0;
	            var obj = {};
	            if (this.window.jQuery && this.window.jQuery.fn && this.window.jQuery.fn.jquery) {
	                obj.jQuery = this.window.jQuery.fn.jquery;
	            }
	
	            if (this.window.jQuery && this.window.jQuery.ui && this.window.jQuery.ui.version) {
	                obj.jQueryUI = this.window.jQuery.ui.version;
	            }
	
	            if (this.window.angular && this.window.angular.version && this.window.angular.version.full) {
	                obj.angular = this.window.angular.version.full;
	            }
	
	            for (name in this.window) {
	                if (name !== '_foozlejs' && name !== 'webkitStorageInfo' && name !== 'webkitIndexedDB' && name !== 'top' && name !== 'parent' && name !== 'frameElement') {
	                    try {
	                        if (this.window[name]) {
	                            var type = this.window[name].version || this.window[name].Version || this.window[name].VERSION;
	                            if (typeof type === 'string') {
	                                obj[name] = type;
	                            }
	                        }
	                    } catch (e) {}
	                }
	            }
	
	            return obj;
	        }
	    }, {
	        key: 'report',
	        value: function report() {
	            return {
	                age: new Date().getTime() - this.loadedOn,
	                dependencies: this.discoverDependencies(),
	                userAgent: this.window.navigator.userAgent,
	                viewportHeight: this.window.document.documentElement.clientHeight,
	                viewportWidth: this.window.document.documentElement.clientWidth
	            };
	        }
	    }]);
	
	    return Enviroment;
	}();
	
	exports.default = Enviroment;
	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable no-param-reassign */
	/* eslint-disable no-underscore-dangle */
	/* eslint-disable no-restricted-syntax */
	/* eslint-disable no-unused-expressions */
	
	var _utils = __webpack_require__(5);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Transmitter = function () {
	    function Transmitter(config) {
	        _classCallCheck(this, Transmitter);
	
	        this.config = config;
	        this.disabled = false;
	        this.throttleStats = {
	            attemptCount: 0,
	            throttledCount: 0,
	            lastAttempt: new Date().getTime()
	        };
	
	        if (!window.JSON || !window.JSON.stringify) this.disabled = true;
	    }
	
	    _createClass(Transmitter, [{
	        key: 'errorEndpoint',
	        value: function errorEndpoint(className) {
	            var cl = this.config.current.errorURL;
	            if (!_utils.util.testCrossdomainXhr() || window.location.protocol.indexOf('https') !== -1) {
	                cl = this.config.current.errorNoSSLURL;
	            }
	            return cl + '?token=' + className;
	        }
	    }, {
	        key: 'usageEndpoint',
	        value: function usageEndpoint(child) {
	            return Transmitter.appendObjectAsQuery(child, this.config.current.usageURL);
	        }
	    }, {
	        key: 'trackerFaultEndpoint',
	        value: function trackerFaultEndpoint(child) {
	            return Transmitter.appendObjectAsQuery(child, this.config.current.faultURL);
	        }
	    }, {
	        key: 'sendUsage',
	        value: function sendUsage(inParams) {
	            new Image().src = this.usageEndpoint(inParams);
	        }
	    }, {
	        key: 'sendError',
	        value: function sendError(message, object) {
	            var _this = this;
	
	            if (!this.disabled && !this.throttle(message)) {
	                try {
	                    (function () {
	                        var xhr = Transmitter.getCORSRequest('POST', _this.errorEndpoint(object));
	
	                        xhr.onreadystatechange = function () {
	                            if (xhr.readyState === 4 && xhr.status !== 200) _this.disabled = true;
	                        };
	
	                        xhr._foozlejs = undefined;
	                        xhr.send(window.JSON.stringify(message));
	                    })();
	                } catch (error) {
	                    this.disabled = true;
	                    throw error;
	                }
	            }
	        }
	    }, {
	        key: 'sendTrackerFault',
	        value: function sendTrackerFault(message) {
	            this.throttle(message) || (new Image().src = this.trackerFaultEndpoint(message));
	        }
	    }, {
	        key: 'throttle',
	        value: function throttle(delay) {
	            var now = new Date().getTime();
	            this.throttleStats.attemptCount += 1;
	
	            if (this.throttleStats.lastAttempt + 1000 >= now) {
	
	                this.throttleStats.lastAttempt = now;
	                if (this.throttleStats.attemptCount > 10) {
	                    this.throttleStats.throttledCount += 1;
	                    return true;
	                }
	            } else {
	                delay.throttled = this.throttleStats.throttledCount;
	                this.throttleStats.attemptCount = 0;
	                this.throttleStats.lastAttempt = now;
	                this.throttleStats.throttledCount = 0;
	            }
	
	            return false;
	        }
	    }], [{
	        key: 'appendObjectAsQuery',
	        value: function appendObjectAsQuery(item, i) {
	            i += '?';
	
	            for (var key in item) {
	                if (item[key]) {
	                    i += encodeURIComponent(key) + '=' + encodeURIComponent(item[key]) + '&';
	                }
	            }
	            return i;
	        }
	    }, {
	        key: 'getCORSRequest',
	        value: function getCORSRequest(method, url) {
	            var xhr = void 0;
	
	            if (_utils.util.testCrossdomainXhr()) {
	                xhr = new window.XMLHttpRequest();
	                xhr.open(method, url);
	                xhr.setRequestHeader('Content-Type', 'text/plain');
	            } else if (typeof window.XDomainRequest !== 'undefined') {
	                xhr = new window.XDomainRequest();
	                xhr.open(method, url);
	            } else {
	                xhr = null;
	            }
	
	            return xhr;
	        }
	    }]);
	
	    return Transmitter;
	}();
	
	exports.default = Transmitter;
	module.exports = exports['default'];

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utils = __webpack_require__(5);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Log = function () {
	    function Log() {
	        _classCallCheck(this, Log);
	
	        this.appender = [];
	        this.maxLength = 30;
	    }
	
	    _createClass(Log, [{
	        key: 'all',
	        value: function all(xs) {
	            var result = [];
	            var cursor = void 0;
	            var i = void 0;
	
	            for (i = 0; i < this.appender.length; i += 1) {
	                cursor = this.appender[i];
	                if (cursor.category === xs) {
	                    result.push(cursor.value);
	                }
	            }
	            return result;
	        }
	    }, {
	        key: 'clear',
	        value: function clear() {
	            this.appender.length = 0;
	        }
	    }, {
	        key: 'truncate',
	        value: function truncate() {
	            if (this.appender.length > this.maxLength) {
	                this.appender = this.appender.slice(Math.max(this.appender.length - this.maxLength, 0));
	            }
	        }
	    }, {
	        key: 'add',
	        value: function add(category, obj) {
	            var id = _utils.util.uuid();
	
	            this.appender.push({
	                key: id,
	                value: obj,
	                category: category
	            });
	
	            this.truncate();
	            return id;
	        }
	    }, {
	        key: 'get',
	        value: function get(r, token) {
	            var c = void 0;
	            var i = void 0;
	            for (i = 0; i < this.appender.length; i += 1) {
	                c = this.appender[i];
	                if (c.category === r && c.key === token) {
	                    return c.value;
	                }
	            }
	            return false;
	        }
	    }]);
	
	    return Log;
	}();
	
	exports.default = Log;
	module.exports = exports['default'];

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable func-names */
	/* eslint-disable no-underscore-dangle */
	/* eslint-disable prefer-rest-params */
	
	var _utils = __webpack_require__(5);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var NetworkWatcher = function () {
	    function NetworkWatcher(log, onError, onFault, window, options) {
	        _classCallCheck(this, NetworkWatcher);
	
	        this.log = log;
	        this.onError = onError;
	        this.onFault = onFault;
	        this.window = window;
	        this.options = options;
	
	        if (options.enabled) this.initialize(window);
	    }
	
	    _createClass(NetworkWatcher, [{
	        key: 'initialize',
	        value: function initialize(win) {
	            if (win.XMLHttpRequest && _utils.util.hasFunction(win.XMLHttpRequest.prototype.open, 'apply')) {
	                this.watchNetworkObject(win.XMLHttpRequest);
	            }
	
	            if (win.XDomainRequest && _utils.util.hasFunction(win.XDomainRequest.prototype.open, 'apply')) {
	                this.watchNetworkObject(win.XDomainRequest);
	            }
	        }
	    }, {
	        key: 'watchNetworkObject',
	        value: function watchNetworkObject(XHR) {
	            var self = this;
	            var openXHR = XHR.prototype.open;
	            var sendopenXHR = XHR.prototype.send;
	
	            XHR.prototype.open = function (method, url) {
	                var uri = (url || '').toString();
	
	                if (!uri.indexOf('localhost:0') !== -1) {
	                    this._foozlejs = {
	                        method: method,
	                        url: uri
	                    };
	                }
	                return openXHR.apply(this, arguments);
	            };
	
	            XHR.prototype.send = function () {
	                try {
	                    if (!this._foozlejs) {
	                        return sendopenXHR.apply(this, arguments);
	                    }
	
	                    this._foozlejs.logId = self.log.add('n', {
	                        startedOn: _utils.util.isoNow(),
	                        method: this._foozlejs.method,
	                        url: this._foozlejs.url
	                    });
	                    self.listenForNetworkComplete(this);
	                } catch (buffer) {
	                    self.onFault(buffer);
	                }
	                return sendopenXHR.apply(this, arguments);
	            };
	            return XHR;
	        }
	    }, {
	        key: 'listenForNetworkComplete',
	        value: function listenForNetworkComplete(obj) {
	            var self = this;
	            if (this.window.ProgressEvent && obj.addEventListener) {
	                obj.addEventListener('readystatechange', function () {
	                    if (obj.readyState === 4) {
	                        self.finalizeNetworkEvent(obj);
	                    }
	                }, true);
	            }
	
	            if (obj.addEventListener) {
	                obj.addEventListener('load', function () {
	                    self.finalizeNetworkEvent(obj);
	                    self.checkNetworkFault(obj);
	                }, true);
	            } else {
	                setTimeout(function () {
	                    try {
	                        (function () {
	                            var objOnload = obj.onload;
	                            obj.onload = function () {
	                                self.finalizeNetworkEvent(obj);
	                                self.checkNetworkFault(obj);
	
	                                if (typeof objOnload === 'function' && _utils.util.hasFunction(objOnload, 'apply')) {
	                                    objOnload.apply(obj, arguments);
	                                }
	                            };
	
	                            var objOnerror = obj.onerror;
	                            obj.onerror = function () {
	                                self.finalizeNetworkEvent(obj);
	                                self.checkNetworkFault(obj);
	
	                                if (typeof oldOnError === 'function') {
	                                    objOnerror.apply(obj, arguments);
	                                }
	                            };
	                        })();
	                    } catch (buffer) {
	                        self.onFault(buffer);
	                    }
	                }, 0);
	            }
	        }
	    }, {
	        key: 'finalizeNetworkEvent',
	        value: function finalizeNetworkEvent(xhr) {
	            if (xhr._foozlejs) {
	                var obj = this.log.get('n', xhr._foozlejs.logId);
	
	                if (obj) {
	                    obj.completedOn = _utils.util.isoNow();
	                    obj.statusCode = xhr.status === 1223 ? 204 : xhr.status;
	                    obj.statusText = xhr.status === 1223 ? 'No Content' : xhr.statusText;
	                }
	            }
	        }
	    }, {
	        key: 'checkNetworkFault',
	        value: function checkNetworkFault(req) {
	            if (this.options.error && req.status >= 400 && req.status !== 1223) {
	                var settings = req._foozlejs || {};
	                this.onError('ajax', req.status + ' ' + req.statusText + ': ' + settings.method + ' ' + settings.url);
	            }
	        }
	    }, {
	        key: 'report',
	        value: function report() {
	            return this.log.all('n');
	        }
	    }]);
	
	    return NetworkWatcher;
	}();
	
	exports.default = NetworkWatcher;
	module.exports = exports['default'];

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable no-nested-ternary */
	/* eslint-disable no-useless-escape */
	/* eslint-disable max-len */
	
	var _utils = __webpack_require__(5);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var VisitorWatcher = function () {
	    function VisitorWatcher(log, onError, onFault, document, options) {
	        _classCallCheck(this, VisitorWatcher);
	
	        this.log = log;
	        this.onError = onError;
	        this.onFault = onFault;
	        this.options = options;
	        this.document = document;
	        if (options.enabled) this.initialize(document);
	    }
	
	    _createClass(VisitorWatcher, [{
	        key: 'initialize',
	        value: function initialize(el) {
	            var fn = _utils.util.bind(this.onDocumentClicked, this);
	            var cancel = _utils.util.bind(this.onInputChanged, this);
	
	            if (el.addEventListener) {
	                el.addEventListener('click', fn, true);
	                el.addEventListener('blur', cancel, true);
	            } else if (el.attachEvent) {
	                el.attachEvent('onclick', fn);
	                el.attachEvent('onfocusout', cancel);
	            }
	        }
	    }, {
	        key: 'onDocumentClicked',
	        value: function onDocumentClicked(css) {
	            try {
	                var elem = VisitorWatcher.getElementFromEvent(css);
	
	                if (elem && elem.tagName) {
	                    if (VisitorWatcher.isDescribedElement(elem, 'a') || VisitorWatcher.isDescribedElement(elem, 'button') || VisitorWatcher.isDescribedElement(elem, 'input', ['button', 'submit'])) {
	                        this.writeVisitorEvent(elem, 'click');
	                    } else if (VisitorWatcher.isDescribedElement(elem, 'input', ['checkbox', 'radio'])) {
	                        this.writeVisitorEvent(elem, 'input', elem.value, elem.checked);
	                    }
	                }
	            } catch (command) {
	                this.onFault(command);
	            }
	        }
	    }, {
	        key: 'onInputChanged',
	        value: function onInputChanged(css) {
	            try {
	                var elem = VisitorWatcher.getElementFromEvent(css);
	                if (elem && elem.tagName) {
	                    if (VisitorWatcher.isDescribedElement(elem, 'textarea')) {
	                        this.writeVisitorEvent(elem, 'input', elem.value);
	                    } else if (VisitorWatcher.isDescribedElement(elem, 'select')) {
	                        if (elem.options && elem.options.length) {
	                            this.onSelectInputChanged(elem);
	                        }
	                    } else if (VisitorWatcher.isDescribedElement(elem, 'input') && !VisitorWatcher.isDescribedElement(elem, 'input', ['button', 'submit', 'hidden', 'checkbox', 'radio'])) {
	                        this.writeVisitorEvent(elem, 'input', elem.value);
	                    }
	                }
	            } catch (command) {
	                this.onFault(command);
	            }
	        }
	    }, {
	        key: 'onSelectInputChanged',
	        value: function onSelectInputChanged(select) {
	            if (select.multiple) {
	                for (var j = 0; j < select.options.length; j += 1) {
	                    if (select.options[j].selected) {
	                        this.writeVisitorEvent(select, 'input', select.options[j].value);
	                    } else if (select.selectedIndex >= 0 && select.options[select.selectedIndex]) {
	                        this.writeVisitorEvent(select, 'input', select.options[select.selectedIndex].value);
	                    }
	                }
	            }
	        }
	    }, {
	        key: 'writeVisitorEvent',
	        value: function writeVisitorEvent(element, elementType, value, iterations) {
	            if (VisitorWatcher.getElementType(element) === 'password') {
	                value = undefined;
	            }
	
	            this.log.add('v', {
	                timestamp: _utils.util.isoNow(),
	                action: elementType,
	                value: elementType !== 'password' ? value : null,
	                element: {
	                    tag: element.tagName.toLowerCase(),
	                    attributes: VisitorWatcher.getElementAttributes(element),
	                    value: VisitorWatcher.getMetaValue(value, iterations)
	                }
	            });
	        }
	    }, {
	        key: 'report',
	        value: function report() {
	            return this.log.all('v');
	        }
	    }], [{
	        key: 'getElementFromEvent',
	        value: function getElementFromEvent(domEvent) {
	            return domEvent.target || domEvent.elementFromPoint(domEvent.clientX, domEvent.clientY);
	        }
	    }, {
	        key: 'isDescribedElement',
	        value: function isDescribedElement(el, i, arr) {
	            if (el.tagName.toLowerCase() !== i.toLowerCase()) {
	                return false;
	            }
	
	            if (!arr) {
	                return true;
	            }
	
	            el = VisitorWatcher.getElementType(el);
	            for (i = 0; i < arr.length; i += 1) {
	                if (arr[i] === el) {
	                    return true;
	                }
	            }
	            return false;
	        }
	    }, {
	        key: 'getElementType',
	        value: function getElementType(el) {
	            return (el.getAttribute('type') || '').toLowerCase();
	        }
	    }, {
	        key: 'getElementAttributes',
	        value: function getElementAttributes(item) {
	            var attributes = {};
	            for (var i = 0; i < item.attributes.length; i += 1) {
	                if (item.attributes[i].name.toLowerCase() !== 'value') {
	                    attributes[item.attributes[i].name] = item.attributes[i].value;
	                }
	            }
	
	            return attributes;
	        }
	    }, {
	        key: 'getMetaValue',
	        value: function getMetaValue(w, iterations) {
	            return w === undefined ? undefined : {
	                length: w.length,
	                pattern: VisitorWatcher.matchInputPattern(w),
	                checked: iterations
	            };
	        }
	    }, {
	        key: 'matchInputPattern',
	        value: function matchInputPattern(str) {
	            var input = '';
	
	            if (str === '') {
	                input = 'empty';
	            } else {
	                input = /^[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(str) ? 'email' : /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(str) || /^(\d{4}[\/\-](0?[1-9]|1[012])[\/\-]0?[1-9]|[12][0-9]|3[01])$/.test(str) ? 'date' : /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/.test(str) ? 'usphone' : /^\s*$/.test(str) ? 'whitespace' : /^\d*$/.test(str) ? 'numeric' : /^[a-zA-Z]*$/.test(str) ? 'alpha' : /^[a-zA-Z0-9]*$/.test(str) ? 'alphanumeric' : 'characters';
	            }
	            return input;
	        }
	    }]);
	
	    return VisitorWatcher;
	}();
	
	exports.default = VisitorWatcher;
	module.exports = exports['default'];

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/* eslint-disable max-params */
	/* eslint-disable no-param-reassign */
	/* eslint-disable complexity */
	/* eslint-disable max-statements */
	
	var WindowWatcher = function () {
	    function WindowWatcher(onError, onFault, serialize, win, result) {
	        _classCallCheck(this, WindowWatcher);
	
	        this.onError = onError;
	        this.onFault = onFault;
	        this.serialize = serialize;
	        if (result.enabled) this.watchWindowErrors(win);
	        if (result.promise) this.watchPromiseErrors(win);
	    }
	
	    _createClass(WindowWatcher, [{
	        key: 'watchPromiseErrors',
	        value: function watchPromiseErrors(win) {
	            var _this = this;
	
	            if (win.addEventListener) {
	                // If a promise is reject but there is no rejection handler
	                win.addEventListener('unhandledrejection', function (e) {
	                    _this.onError('window', (e || {}).reason);
	                });
	            }
	        }
	    }, {
	        key: 'watchWindowErrors',
	        value: function watchWindowErrors(context) {
	            var contextHandler = context.onerror || function () {};
	            var self = this;
	
	            context.onerror = function (errorMessage, host, width, height, stack) {
	                try {
	                    stack = stack || {};
	                    stack.message = stack.message || self.serialize(errorMessage);
	
	                    stack.line = stack.line || parseInt(width, 10) || null;
	                    stack.column = stack.column || parseInt(height, 10) || null;
	
	                    if (Object.prototype.toString.call(errorMessage) !== '[object Event]' || host) {
	                        stack.file = stack.file || self.serialize(host);
	                    } else {
	                        stack.file = (errorMessage.target || {}).src;
	                    }
	                    self.onError('window', stack);
	                } catch (buffer) {
	                    self.onFault(buffer);
	                }
	                contextHandler.call(context, errorMessage, host, width, height, stack);
	            };
	        }
	    }]);
	
	    return WindowWatcher;
	}();
	
	exports.default = WindowWatcher;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=index.js.map
