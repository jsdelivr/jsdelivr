/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].e;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			e: {},
/******/ 			i: moduleId,
/******/ 			l: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.e, module, module.e, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.e;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 36);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// shim for using process in browser

	var process = module.e = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
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
	    var timeout = setTimeout(cleanUpNextTick);
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
	    clearTimeout(timeout);
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
	        setTimeout(drainQueue, 0);
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
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(3);
	var isNil = __webpack_require__(10);
	var fail = __webpack_require__(46);
	var stringify = __webpack_require__(30);

	function assert(guard, message) {
	  if (guard !== true) {
	    if (isFunction(message)) { // handle lazy messages
	      message = message();
	    }
	    else if (isNil(message)) { // use a default message
	      message = 'Assert failed (turn on "Pause on exceptions" in your Source panel)';
	    }
	    assert.fail(message);
	  }
	}

	assert.fail = fail;
	assert.stringify = stringify;

	module.e = assert;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var isType = __webpack_require__(5);
	var getFunctionName = __webpack_require__(14);

	module.e = function getTypeName(constructor) {
	  if (isType(constructor)) {
	    return constructor.displayName;
	  }
	  return getFunctionName(constructor);
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.e = function isFunction(x) {
	  return typeof x === 'function';
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var assert = __webpack_require__(1);
	var isString = __webpack_require__(15);
	var isFunction = __webpack_require__(3);
	var forbidNewOperator = __webpack_require__(13);

	module.e = function irreducible(name, predicate) {

	  if (process.env.NODE_ENV !== 'production') {
	    assert(isString(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to irreducible(name, predicate) (expected a string)'; });
	    assert(isFunction(predicate), 'Invalid argument predicate ' + assert.stringify(predicate) + ' supplied to irreducible(name, predicate) (expected a function)');
	  }

	  function Irreducible(value, path) {

	    if (process.env.NODE_ENV !== 'production') {
	      forbidNewOperator(this, Irreducible);
	      path = path || [name];
	      assert(predicate(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/'); });
	    }

	    return value;
	  }

	  Irreducible.meta = {
	    kind: 'irreducible',
	    name: name,
	    predicate: predicate,
	    identity: true
	  };

	  Irreducible.displayName = name;

	  Irreducible.is = predicate;

	  return Irreducible;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(3);
	var isObject = __webpack_require__(12);

	module.e = function isType(x) {
	  return isFunction(x) && isObject(x.meta);
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var isNil = __webpack_require__(10);
	var isString = __webpack_require__(15);

	module.e = function isTypeName(name) {
	  return isNil(name) || isString(name);
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.e = function isArray(x) {
	  return x instanceof Array;
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var isType = __webpack_require__(5);
	var isStruct = __webpack_require__(28);
	var getFunctionName = __webpack_require__(14);
	var assert = __webpack_require__(1);
	var stringify = __webpack_require__(30);

	// creates an instance of a type, handling the optional new operator
	module.e = function create(type, value, path) {
	  if (isType(type)) {
	    // for structs the new operator is allowed
	    return isStruct(type) ? new type(value, path) : type(value, path);
	  }

	  if (process.env.NODE_ENV !== 'production') {
	    // here type should be a class constructor and value some instance, just check membership and return the value
	    path = path || [getFunctionName(type)];
	    assert(value instanceof type, function () { return 'Invalid value ' + stringify(value) + ' supplied to ' + path.join('/'); });
	  }

	  return value;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var isType = __webpack_require__(5);

	// returns true if x is an instance of type
	module.e = function is(x, type) {
	  if (isType(type)) {
	    return type.is(x);
	  }
	  return x instanceof type; // type should be a class constructor
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.e = function isNil(x) {
	  return x === null || x === void 0;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var assert = __webpack_require__(1);
	var Boolean = __webpack_require__(22);
	var isType = __webpack_require__(5);
	var getTypeName = __webpack_require__(2);

	// return true if the type constructor behaves like the identity function
	module.e = function isIdentity(type) {
	  if (isType(type)) {
	    if (process.env.NODE_ENV !== 'production') {
	      assert(Boolean.is(type.meta.identity), function () { return 'Invalid meta identity ' + assert.stringify(type.meta.identity) + ' supplied to type ' + getTypeName(type); });
	    }
	    return type.meta.identity;
	  }
	  // for tcomb the other constructors, like ES6 classes, are identity-like
	  return true;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var isNil = __webpack_require__(10);
	var isArray = __webpack_require__(7);

	module.e = function isObject(x) {
	  return !isNil(x) && typeof x === 'object' && !isArray(x);
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(1);
	var getTypeName = __webpack_require__(2);

	module.e = function forbidNewOperator(x, type) {
	  assert(!(x instanceof type), function () { return 'Cannot use the new operator to instantiate the type ' + getTypeName(type); });
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.e = function getFunctionName(f) {
	  return f.displayName || f.name || '<function' + f.length + '>';
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.e = function isString(x) {
	  return typeof x === 'string';
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var isNil = __webpack_require__(10);
	var assert = __webpack_require__(1);

	// safe mixin, cannot override props unless specified
	module.e = function mixin(target, source, overwrite) {
	  if (isNil(source)) { return target; }
	  for (var k in source) {
	    if (source.hasOwnProperty(k)) {
	      if (overwrite !== true) {
	        if (process.env.NODE_ENV !== 'production') {
	          assert(!target.hasOwnProperty(k), function () { return 'Invalid call to mixin(target, source, [overwrite]): cannot overwrite property "' + k + '" of target object'; });
	        }
	      }
	      target[k] = source[k];
	    }
	  }
	  return target;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/*! @preserve
	 *
	 * The MIT License (MIT)
	 *
	 * Copyright (c) 2014-2016 Giulio Canti
	 *
	 */

	// core
	var t = __webpack_require__(1);

	// types
	t.Any = __webpack_require__(18);
	t.Array = __webpack_require__(38);
	t.Boolean = __webpack_require__(22);
	t.Date = __webpack_require__(39);
	t.Error = __webpack_require__(40);
	t.Function = __webpack_require__(19);
	t.Nil = __webpack_require__(23);
	t.Number = __webpack_require__(41);
	t.Object = __webpack_require__(42);
	t.RegExp = __webpack_require__(43);
	t.String = __webpack_require__(24);

	// short alias are deprecated
	t.Arr = t.Array;
	t.Bool = t.Boolean;
	t.Dat = t.Date;
	t.Err = t.Error;
	t.Func = t.Function;
	t.Num = t.Number;
	t.Obj = t.Object;
	t.Re = t.RegExp;
	t.Str = t.String;

	// combinators
	t.dict = __webpack_require__(25);
	t.declare = __webpack_require__(44);
	t.enums = __webpack_require__(45);
	t.irreducible = __webpack_require__(4);
	t.list = __webpack_require__(29);
	t.maybe = __webpack_require__(52);
	t.refinement = __webpack_require__(53);
	t.struct = __webpack_require__(54);
	t.tuple = __webpack_require__(31);
	t.union = __webpack_require__(55);
	t.func = __webpack_require__(47);
	t.intersection = __webpack_require__(48);
	t.subtype = t.refinement;

	// functions
	t.assert = t;
	t.update = __webpack_require__(56);
	t.mixin = __webpack_require__(16);
	t.isType = __webpack_require__(5);
	t.is = __webpack_require__(9);
	t.getTypeName = __webpack_require__(2);
	t.match = __webpack_require__(51);

	module.e = t;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(4);

	module.e = irreducible('Any', function () { return true; });


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(4);
	var isFunction = __webpack_require__(3);

	module.e = irreducible('Function', isFunction);


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(0).nextTick;
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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20).setImmediate, __webpack_require__(20).clearImmediate))

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Callback = exports.ResourceType = exports.ResourceList = exports.Resource = exports.OptionsObject = exports.NameOrIdList = exports.NameOrId = exports.Id = undefined;

	var _tcomb = __webpack_require__(17);

	var _tcomb2 = _interopRequireDefault(_tcomb);

	var _resourceTypes = __webpack_require__(37);

	var _resourceTypes2 = _interopRequireDefault(_resourceTypes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Id = exports.Id = _tcomb2.default.refinement(_tcomb2.default.Number, function (n) {
	  return n > 0 && Number.isInteger(n);
	}, 'ID');
	var NameOrId = exports.NameOrId = _tcomb2.default.union([_tcomb2.default.String, Id], 'Name|ID');
	var NameOrIdList = exports.NameOrIdList = _tcomb2.default.list(NameOrId, 'List<Name|Id>');

	var OptionsObject = exports.OptionsObject = _tcomb2.default.Object;

	var Resource = exports.Resource = _tcomb2.default.union([NameOrId, OptionsObject], 'Resource');
	var ResourceList = exports.ResourceList = _tcomb2.default.list(Resource, 'List<Resource>');
	var ResourceType = exports.ResourceType = _tcomb2.default.enums.of(_resourceTypes2.default, 'ResourceType');

	var Callback = exports.Callback = _tcomb2.default.Function;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(4);
	var isBoolean = __webpack_require__(26);

	module.e = irreducible('Boolean', isBoolean);


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(4);
	var isNil = __webpack_require__(10);

	module.e = irreducible('Nil', isNil);


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(4);
	var isString = __webpack_require__(15);

	module.e = irreducible('String', isString);


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var assert = __webpack_require__(1);
	var isTypeName = __webpack_require__(6);
	var isFunction = __webpack_require__(3);
	var getTypeName = __webpack_require__(2);
	var isIdentity = __webpack_require__(11);
	var isObject = __webpack_require__(12);
	var create = __webpack_require__(8);
	var is = __webpack_require__(9);

	function getDefaultName(domain, codomain) {
	  return '{[key: ' + getTypeName(domain) + ']: ' + getTypeName(codomain) + '}';
	}

	function dict(domain, codomain, name) {

	  if (process.env.NODE_ENV !== 'production') {
	    assert(isFunction(domain), function () { return 'Invalid argument domain ' + assert.stringify(domain) + ' supplied to dict(domain, codomain, [name]) combinator (expected a type)'; });
	    assert(isFunction(codomain), function () { return 'Invalid argument codomain ' + assert.stringify(codomain) + ' supplied to dict(domain, codomain, [name]) combinator (expected a type)'; });
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to dict(domain, codomain, [name]) combinator (expected a string)'; });
	  }

	  var displayName = name || getDefaultName(domain, codomain);
	  var domainNameCache = getTypeName(domain);
	  var codomainNameCache = getTypeName(codomain);
	  var identity = isIdentity(domain) && isIdentity(codomain);

	  function Dict(value, path) {

	    if (process.env.NODE_ENV === 'production') {
	      if (identity) {
	        return value; // just trust the input if elements must not be hydrated
	      }
	    }

	    if (process.env.NODE_ENV !== 'production') {
	      path = path || [displayName];
	      assert(isObject(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/'); });
	    }

	    var idempotent = true; // will remain true if I can reutilise the input
	    var ret = {}; // make a temporary copy, will be discarded if idempotent remains true
	    for (var k in value) {
	      if (value.hasOwnProperty(k)) {
	        k = create(domain, k, ( process.env.NODE_ENV !== 'production' ? path.concat(domainNameCache) : null ));
	        var actual = value[k];
	        var instance = create(codomain, actual, ( process.env.NODE_ENV !== 'production' ? path.concat(k + ': ' + codomainNameCache) : null ));
	        idempotent = idempotent && ( actual === instance );
	        ret[k] = instance;
	      }
	    }

	    if (idempotent) { // implements idempotency
	      ret = value;
	    }

	    if (process.env.NODE_ENV !== 'production') {
	      Object.freeze(ret);
	    }

	    return ret;
	  }

	  Dict.meta = {
	    kind: 'dict',
	    domain: domain,
	    codomain: codomain,
	    name: name,
	    identity: identity
	  };

	  Dict.displayName = displayName;

	  Dict.is = function (x) {
	    if (!isObject(x)) {
	      return false;
	    }
	    for (var k in x) {
	      if (x.hasOwnProperty(k)) {
	        if (!is(k, domain) || !is(x[k], codomain)) {
	          return false;
	        }
	      }
	    }
	    return true;
	  };

	  Dict.update = function (instance, patch) {
	    return Dict(assert.update(instance, patch));
	  };

	  return Dict;
	}

	dict.getDefaultName = getDefaultName;
	module.e = dict;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	module.e = function isBoolean(x) {
	  return x === true || x === false;
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	module.e = function isNumber(x) {
	  return typeof x === 'number' && isFinite(x) && !isNaN(x);
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var isType = __webpack_require__(5);

	module.e = function isStruct(x) {
	  return isType(x) && ( x.meta.kind === 'struct' );
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var assert = __webpack_require__(1);
	var isTypeName = __webpack_require__(6);
	var isFunction = __webpack_require__(3);
	var getTypeName = __webpack_require__(2);
	var isIdentity = __webpack_require__(11);
	var create = __webpack_require__(8);
	var is = __webpack_require__(9);
	var isArray = __webpack_require__(7);

	function getDefaultName(type) {
	  return 'Array<' + getTypeName(type) + '>';
	}

	function list(type, name) {

	  if (process.env.NODE_ENV !== 'production') {
	    assert(isFunction(type), function () { return 'Invalid argument type ' + assert.stringify(type) + ' supplied to list(type, [name]) combinator (expected a type)'; });
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to list(type, [name]) combinator (expected a string)'; });
	  }

	  var displayName = name || getDefaultName(type);
	  var typeNameCache = getTypeName(type);
	  var identity = isIdentity(type); // the list is identity iif type is identity

	  function List(value, path) {

	    if (process.env.NODE_ENV === 'production') {
	      if (identity) {
	        return value; // just trust the input if elements must not be hydrated
	      }
	    }

	    if (process.env.NODE_ENV !== 'production') {
	      path = path || [displayName];
	      assert(isArray(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/') + ' (expected an array of ' + typeNameCache + ')'; });
	    }

	    var idempotent = true; // will remain true if I can reutilise the input
	    var ret = []; // make a temporary copy, will be discarded if idempotent remains true
	    for (var i = 0, len = value.length; i < len; i++ ) {
	      var actual = value[i];
	      var instance = create(type, actual, ( process.env.NODE_ENV !== 'production' ? path.concat(i + ': ' + typeNameCache) : null ));
	      idempotent = idempotent && ( actual === instance );
	      ret.push(instance);
	    }

	    if (idempotent) { // implements idempotency
	      ret = value;
	    }

	    if (process.env.NODE_ENV !== 'production') {
	      Object.freeze(ret);
	    }

	    return ret;
	  }

	  List.meta = {
	    kind: 'list',
	    type: type,
	    name: name,
	    identity: identity
	  };

	  List.displayName = displayName;

	  List.is = function (x) {
	    return isArray(x) && x.every(function (e) {
	      return is(e, type);
	    });
	  };

	  List.update = function (instance, patch) {
	    return List(assert.update(instance, patch));
	  };

	  return List;
	}

	list.getDefaultName = getDefaultName;
	module.e = list;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	module.e = function stringify(x) {
	  try { // handle "Converting circular structure to JSON" error
	    return JSON.stringify(x, null, 2);
	  }
	  catch (e) {
	    return String(x);
	  }
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var assert = __webpack_require__(1);
	var isTypeName = __webpack_require__(6);
	var isFunction = __webpack_require__(3);
	var getTypeName = __webpack_require__(2);
	var isIdentity = __webpack_require__(11);
	var isArray = __webpack_require__(7);
	var create = __webpack_require__(8);
	var is = __webpack_require__(9);

	function getDefaultName(types) {
	  return '[' + types.map(getTypeName).join(', ') + ']';
	}

	function tuple(types, name) {

	  if (process.env.NODE_ENV !== 'production') {
	    assert(isArray(types) && types.every(isFunction), function () { return 'Invalid argument types ' + assert.stringify(types) + ' supplied to tuple(types, [name]) combinator (expected an array of types)'; });
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to tuple(types, [name]) combinator (expected a string)'; });
	  }

	  var displayName = name || getDefaultName(types);
	  var identity = types.every(isIdentity);

	  function Tuple(value, path) {

	    if (process.env.NODE_ENV === 'production') {
	      if (identity) {
	        return value;
	      }
	    }

	    if (process.env.NODE_ENV !== 'production') {
	      path = path || [displayName];
	      assert(isArray(value) && value.length === types.length, function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/') + ' (expected an array of length ' + types.length + ')'; });
	    }

	    var idempotent = true;
	    var ret = [];
	    for (var i = 0, len = types.length; i < len; i++) {
	      var expected = types[i];
	      var actual = value[i];
	      var instance = create(expected, actual, ( process.env.NODE_ENV !== 'production' ? path.concat(i + ': ' + getTypeName(expected)) : null ));
	      idempotent = idempotent && ( actual === instance );
	      ret.push(instance);
	    }

	    if (idempotent) { // implements idempotency
	      ret = value;
	    }

	    if (process.env.NODE_ENV !== 'production') {
	      Object.freeze(ret);
	    }

	    return ret;
	  }

	  Tuple.meta = {
	    kind: 'tuple',
	    types: types,
	    name: name,
	    identity: identity
	  };

	  Tuple.displayName = displayName;

	  Tuple.is = function (x) {
	    return isArray(x) &&
	      x.length === types.length &&
	      types.every(function (type, i) {
	        return is(x[i], type);
	      });
	  };

	  Tuple.update = function (instance, patch) {
	    return Tuple(assert.update(instance, patch));
	  };

	  return Tuple;
	}

	tuple.getDefaultName = getDefaultName;
	module.e = tuple;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = createDispatcher;

	var _tcomb = __webpack_require__(17);

	var _types = __webpack_require__(21);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	/**
	 * Creates an object that can be passed to tcomb for use as a pattern matching
	 * dispatcher, allowing functions to have 'overloaded' method signatures
	 */
	function createDispatcher(patterns) {
	  var dispatcher = patterns.reduce(function (currDispatcher, _ref) {
	    var pattern = _ref.pattern;
	    var onMatch = _ref.onMatch;
	    var maybeOpts = _ref.maybeOpts;
	    var maybeCallback = _ref.maybeCallback;

	    var combinedPatterns = [pattern];

	    if (maybeOpts) {
	      combinedPatterns.push([].concat(_toConsumableArray(pattern), [(0, _tcomb.maybe)(_types.OptionsObject)]));

	      if (maybeCallback) {
	        combinedPatterns.push([].concat(_toConsumableArray(pattern), [(0, _tcomb.maybe)(_types.OptionsObject), (0, _tcomb.maybe)(_types.Callback)]));
	      }
	    }

	    if (maybeCallback) {
	      combinedPatterns.push([].concat(_toConsumableArray(pattern), [(0, _tcomb.maybe)(_types.Callback)]));
	    }

	    var matcher = combinedPatterns.length > 1 ? (0, _tcomb.union)(combinedPatterns.map(function (p) {
	      return (0, _tcomb.tuple)(p);
	    })) : (0, _tcomb.tuple)(pattern);

	    return [].concat(_toConsumableArray(currDispatcher), [matcher, onMatch]);
	  }, []);

	  // A fallback for unmatched patterns
	  dispatcher.push(_tcomb.Any, function (p) {
	    return new Error('Invalid arguments: (' + p + ')');
	  });

	  return dispatcher;
	}

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	// the whatwg-fetch polyfill installs the fetch() function
	// on the global object (window or self)
	//
	// Return that as the export for use in Webpack, Browserify etc.
	__webpack_require__(57);
	module.e = self.fetch.bind(self);


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, setImmediate) {'use strict';

	var callable, byObserver;

	callable = function (fn) {
		if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
		return fn;
	};

	byObserver = function (Observer) {
		var node = document.createTextNode(''), queue, i = 0;
		new Observer(function () {
			var data;
			if (!queue) return;
			data = queue;
			queue = null;
			if (typeof data === 'function') {
				data();
				return;
			}
			data.forEach(function (fn) { fn(); });
		}).observe(node, { characterData: true });
		return function (fn) {
			callable(fn);
			if (queue) {
				if (typeof queue === 'function') queue = [queue, fn];
				else queue.push(fn);
				return;
			}
			queue = fn;
			node.data = (i = ++i % 2);
		};
	};

	module.e = (function () {
		// Node.js
		if ((typeof process !== 'undefined') && process &&
				(typeof process.nextTick === 'function')) {
			return process.nextTick;
		}

		// MutationObserver=
		if ((typeof document === 'object') && document) {
			if (typeof MutationObserver === 'function') {
				return byObserver(MutationObserver);
			}
			if (typeof WebKitMutationObserver === 'function') {
				return byObserver(WebKitMutationObserver);
			}
		}

		// W3C Draft
		// http://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html
		if (typeof setImmediate === 'function') {
			return function (cb) { setImmediate(callable(cb)); };
		}

		// Wide available standard
		if (typeof setTimeout === 'function') {
			return function (cb) { setTimeout(callable(cb), 0); };
		}

		return null;
	}());

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(20).setImmediate))

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
		if (true) {
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.e = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof module !== 'undefined' && module.exports){
			module.exports = factory();
		} else {
			global.UriTemplate = factory();
		}
	})(this, function () {
		var uriTemplateGlobalModifiers = {
			"+": true,
			"#": true,
			".": true,
			"/": true,
			";": true,
			"?": true,
			"&": true
		};
		var uriTemplateSuffices = {
			"*": true
		};

		function notReallyPercentEncode(string) {
			return encodeURI(string).replace(/%25[0-9][0-9]/g, function (doubleEncoded) {
				return "%" + doubleEncoded.substring(3);
			});
		}

		function uriTemplateSubstitution(spec) {
			var modifier = "";
			if (uriTemplateGlobalModifiers[spec.charAt(0)]) {
				modifier = spec.charAt(0);
				spec = spec.substring(1);
			}
			var separator = "";
			var prefix = "";
			var shouldEscape = true;
			var showVariables = false;
			var trimEmptyString = false;
			if (modifier == '+') {
				shouldEscape = false;
			} else if (modifier == ".") {
				prefix = ".";
				separator = ".";
			} else if (modifier == "/") {
				prefix = "/";
				separator = "/";
			} else if (modifier == '#') {
				prefix = "#";
				shouldEscape = false;
			} else if (modifier == ';') {
				prefix = ";";
				separator = ";",
				showVariables = true;
				trimEmptyString = true;
			} else if (modifier == '?') {
				prefix = "?";
				separator = "&",
				showVariables = true;
			} else if (modifier == '&') {
				prefix = "&";
				separator = "&",
				showVariables = true;
			}

			var varNames = [];
			var varList = spec.split(",");
			var varSpecs = [];
			var varSpecMap = {};
			for (var i = 0; i < varList.length; i++) {
				var varName = varList[i];
				var truncate = null;
				if (varName.indexOf(":") != -1) {
					var parts = varName.split(":");
					varName = parts[0];
					truncate = parseInt(parts[1]);
				}
				var suffices = {};
				while (uriTemplateSuffices[varName.charAt(varName.length - 1)]) {
					suffices[varName.charAt(varName.length - 1)] = true;
					varName = varName.substring(0, varName.length - 1);
				}
				var varSpec = {
					truncate: truncate,
					name: varName,
					suffices: suffices
				};
				varSpecs.push(varSpec);
				varSpecMap[varName] = varSpec;
				varNames.push(varName);
			}
			var subFunction = function (valueFunction) {
				var result = "";
				var startIndex = 0;
				for (var i = 0; i < varSpecs.length; i++) {
					var varSpec = varSpecs[i];
					var value = valueFunction(varSpec.name);
					if (value == null || (Array.isArray(value) && value.length == 0) || (typeof value == 'object' && Object.keys(value).length == 0)) {
						startIndex++;
						continue;
					}
					if (i == startIndex) {
						result += prefix;
					} else {
						result += (separator || ",");
					}
					if (Array.isArray(value)) {
						if (showVariables) {
							result += varSpec.name + "=";
						}
						for (var j = 0; j < value.length; j++) {
							if (j > 0) {
								result += varSpec.suffices['*'] ? (separator || ",") : ",";
								if (varSpec.suffices['*'] && showVariables) {
									result += varSpec.name + "=";
								}
							}
							result += shouldEscape ? encodeURIComponent(value[j]).replace(/!/g, "%21") : notReallyPercentEncode(value[j]);
						}
					} else if (typeof value == "object") {
						if (showVariables && !varSpec.suffices['*']) {
							result += varSpec.name + "=";
						}
						var first = true;
						for (var key in value) {
							if (!first) {
								result += varSpec.suffices['*'] ? (separator || ",") : ",";
							}
							first = false;
							result += shouldEscape ? encodeURIComponent(key).replace(/!/g, "%21") : notReallyPercentEncode(key);
							result += varSpec.suffices['*'] ? '=' : ",";
							result += shouldEscape ? encodeURIComponent(value[key]).replace(/!/g, "%21") : notReallyPercentEncode(value[key]);
						}
					} else {
						if (showVariables) {
							result += varSpec.name;
							if (!trimEmptyString || value != "") {
								result += "=";
							}
						}
						if (varSpec.truncate != null) {
							value = value.substring(0, varSpec.truncate);
						}
						result += shouldEscape ? encodeURIComponent(value).replace(/!/g, "%21"): notReallyPercentEncode(value);
					}
				}
				return result;
			};
			var guessFunction = function (stringValue, resultObj) {
				if (prefix) {
					if (stringValue.substring(0, prefix.length) == prefix) {
						stringValue = stringValue.substring(prefix.length);
					} else {
						return null;
					}
				}
				if (varSpecs.length == 1 && varSpecs[0].suffices['*']) {
					var varSpec = varSpecs[0];
					var varName = varSpec.name;
					var arrayValue = varSpec.suffices['*'] ? stringValue.split(separator || ",") : [stringValue];
					var hasEquals = (shouldEscape && stringValue.indexOf('=') != -1);	// There's otherwise no way to distinguish between "{value*}" for arrays and objects
					for (var i = 1; i < arrayValue.length; i++) {
						var stringValue = arrayValue[i];
						if (hasEquals && stringValue.indexOf('=') == -1) {
							// Bit of a hack - if we're expecting "=" for key/value pairs, and values can't contain "=", then assume a value has been accidentally split
							arrayValue[i - 1] += (separator || ",") + stringValue;
							arrayValue.splice(i, 1);
							i--;
						}
					}
					for (var i = 0; i < arrayValue.length; i++) {
						var stringValue = arrayValue[i];
						if (shouldEscape && stringValue.indexOf('=') != -1) {
							hasEquals = true;
						}
						var innerArrayValue = stringValue.split(",");
						for (var j = 0; j < innerArrayValue.length; j++) {
							if (shouldEscape) {
								innerArrayValue[j] = decodeURIComponent(innerArrayValue[j]);
							}
						}
						if (innerArrayValue.length == 1) {
							arrayValue[i] = innerArrayValue[0];
						} else {
							arrayValue[i] = innerArrayValue;
						}
					}

					if (showVariables || hasEquals) {
						var objectValue = resultObj[varName] || {};
						for (var j = 0; j < arrayValue.length; j++) {
							var innerValue = stringValue;
							if (showVariables && !innerValue) {
								// The empty string isn't a valid variable, so if our value is zero-length we have nothing
								continue;
							}
							if (typeof arrayValue[j] == "string") {
								var stringValue = arrayValue[j];
								var innerVarName = stringValue.split("=", 1)[0];
								var stringValue = stringValue.substring(innerVarName.length + 1);
								innerValue = stringValue;
							} else {
								var stringValue = arrayValue[j][0];
								var innerVarName = stringValue.split("=", 1)[0];
								var stringValue = stringValue.substring(innerVarName.length + 1);
								arrayValue[j][0] = stringValue;
								innerValue = arrayValue[j];
							}
							if (objectValue[innerVarName] !== undefined) {
								if (Array.isArray(objectValue[innerVarName])) {
									objectValue[innerVarName].push(innerValue);
								} else {
									objectValue[innerVarName] = [objectValue[innerVarName], innerValue];
								}
							} else {
								objectValue[innerVarName] = innerValue;
							}
						}
						if (Object.keys(objectValue).length == 1 && objectValue[varName] !== undefined) {
							resultObj[varName] = objectValue[varName];
						} else {
							resultObj[varName] = objectValue;
						}
					} else {
						if (resultObj[varName] !== undefined) {
							if (Array.isArray(resultObj[varName])) {
								resultObj[varName] = resultObj[varName].concat(arrayValue);
							} else {
								resultObj[varName] = [resultObj[varName]].concat(arrayValue);
							}
						} else {
							if (arrayValue.length == 1 && !varSpec.suffices['*']) {
								resultObj[varName] = arrayValue[0];
							} else {
								resultObj[varName] = arrayValue;
							}
						}
					}
				} else {
					var arrayValue = (varSpecs.length == 1) ? [stringValue] : stringValue.split(separator || ",");
					var specIndexMap = {};
					for (var i = 0; i < arrayValue.length; i++) {
						// Try from beginning
						var firstStarred = 0;
						for (; firstStarred < varSpecs.length - 1 && firstStarred < i; firstStarred++) {
							if (varSpecs[firstStarred].suffices['*']) {
								break;
							}
						}
						if (firstStarred == i) {
							// The first [i] of them have no "*" suffix
							specIndexMap[i] = i;
							continue;
						} else {
							// Try from the end
							for (var lastStarred = varSpecs.length - 1; lastStarred > 0 && (varSpecs.length - lastStarred) < (arrayValue.length - i); lastStarred--) {
								if (varSpecs[lastStarred].suffices['*']) {
									break;
								}
							}
							if ((varSpecs.length - lastStarred) == (arrayValue.length - i)) {
								// The last [length - i] of them have no "*" suffix
								specIndexMap[i] = lastStarred;
								continue;
							}
						}
						// Just give up and use the first one
						specIndexMap[i] = firstStarred;
					}
					for (var i = 0; i < arrayValue.length; i++) {
						var stringValue = arrayValue[i];
						if (!stringValue && showVariables) {
							// The empty string isn't a valid variable, so if our value is zero-length we have nothing
							continue;
						}
						var innerArrayValue = stringValue.split(",");
						var hasEquals = false;

						if (showVariables) {
							var stringValue = innerArrayValue[0]; // using innerArrayValue
							var varName = stringValue.split("=", 1)[0];
							var stringValue = stringValue.substring(varName.length + 1);
							innerArrayValue[0] = stringValue;
							var varSpec = varSpecMap[varName] || varSpecs[0];
						} else {
							var varSpec = varSpecs[specIndexMap[i]];
							var varName = varSpec.name;
						}

						for (var j = 0; j < innerArrayValue.length; j++) {
							if (shouldEscape) {
								innerArrayValue[j] = decodeURIComponent(innerArrayValue[j]);
							}
						}

						if ((showVariables || varSpec.suffices['*'])&& resultObj[varName] !== undefined) {
							if (Array.isArray(resultObj[varName])) {
								resultObj[varName] = resultObj[varName].concat(innerArrayValue);
							} else {
								resultObj[varName] = [resultObj[varName]].concat(innerArrayValue);
							}
						} else {
							if (innerArrayValue.length == 1 && !varSpec.suffices['*']) {
								resultObj[varName] = innerArrayValue[0];
							} else {
								resultObj[varName] = innerArrayValue;
							}
						}
					}
				}
			};
			subFunction.varNames = varNames;
			return {
				prefix: prefix,
				substitution: subFunction,
				unSubstitution: guessFunction
			};
		}

		function UriTemplate(template) {
			if (!(this instanceof UriTemplate)) {
				return new UriTemplate(template);
			}
			var parts = template.split("{");
			var textParts = [parts.shift()];
			var prefixes = [];
			var substitutions = [];
			var unSubstitutions = [];
			var varNames = [];
			while (parts.length > 0) {
				var part = parts.shift();
				var spec = part.split("}")[0];
				var remainder = part.substring(spec.length + 1);
				var funcs = uriTemplateSubstitution(spec);
				substitutions.push(funcs.substitution);
				unSubstitutions.push(funcs.unSubstitution);
				prefixes.push(funcs.prefix);
				textParts.push(remainder);
				varNames = varNames.concat(funcs.substitution.varNames);
			}
			this.fill = function (valueFunction) {
				if (valueFunction && typeof valueFunction !== 'function') {
					var value = valueFunction;
					valueFunction = function (varName) {
						return value[varName];
					};
				}

				var result = textParts[0];
				for (var i = 0; i < substitutions.length; i++) {
					var substitution = substitutions[i];
					result += substitution(valueFunction);
					result += textParts[i + 1];
				}
				return result;
			};
			this.fromUri = function (substituted) {
				var result = {};
				for (var i = 0; i < textParts.length; i++) {
					var part = textParts[i];
					if (substituted.substring(0, part.length) !== part) {
						return undefined;
					}
					substituted = substituted.substring(part.length);
					if (i >= textParts.length - 1) {
						if (substituted == "") {
							break;
						} else {
							return undefined;
						}
					}
					var nextPart = textParts[i + 1];
					var offset = i;
					while (true) {
						if (offset == textParts.length - 2) {
							var endPart = substituted.substring(substituted.length - nextPart.length);
							if (endPart !== nextPart) {
								return undefined;
							}
							var stringValue = substituted.substring(0, substituted.length - nextPart.length);
							substituted = endPart;
						} else if (nextPart) {
							var nextPartPos = substituted.indexOf(nextPart);
							var stringValue = substituted.substring(0, nextPartPos);
							substituted = substituted.substring(nextPartPos);
						} else if (prefixes[offset + 1]) {
							var nextPartPos = substituted.indexOf(prefixes[offset + 1]);
							if (nextPartPos === -1) nextPartPos = substituted.length;
							var stringValue = substituted.substring(0, nextPartPos);
							substituted = substituted.substring(nextPartPos);
						} else if (textParts.length > offset + 2) {
							// If the separator between this variable and the next is blank (with no prefix), continue onwards
							offset++;
							nextPart = textParts[offset + 1];
							continue;
						} else {
							var stringValue = substituted;
							substituted = "";
						}
						break;
					}
					unSubstitutions[i](stringValue, result);
				}
				return result;
			}
			this.varNames = varNames;
			this.template = template;
		}
		UriTemplate.prototype = {
			toString: function () {
				return this.template;
			},
			fillFromObject: function (obj) {
				return this.fill(obj);
			}
		};

		return UriTemplate;
	});


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.default = maybeCallback;

	__webpack_require__(33);

	var _tcomb = __webpack_require__(17);

	var _uriTemplates = __webpack_require__(35);

	var _uriTemplates2 = _interopRequireDefault(_uriTemplates);

	var _nextTick = __webpack_require__(34);

	var _nextTick2 = _interopRequireDefault(_nextTick);

	var _createDispatcher = __webpack_require__(32);

	var _createDispatcher2 = _interopRequireDefault(_createDispatcher);

	var _types = __webpack_require__(21);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Default configurations for each instance
	 */
	var DEFAULT_CONFIG = {
	  /** The base URL to fetch from */
	  baseUrl: 'http://pokeapi.co/api/v2',

	  /** The default resource type to use with `getOneById` */
	  defaultType: 'pokemon',

	  /** Options that get passed to the fetch Request object */
	  requests: {
	    redirect: 'follow'
	  }
	};

	var Pokewrap = function () {
	  function Pokewrap() {
	    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    _classCallCheck(this, Pokewrap);

	    var requests = _extends({}, DEFAULT_CONFIG.requests, opts.requests);
	    var config = _extends({}, DEFAULT_CONFIG, opts, {
	      requests: requests
	    });
	    Object.assign(this, config);
	  }

	  /**
	   * Fetches a single resource based on its resource type and its name or ID
	   *
	   * @param {ResourceType} type - The resource type
	   * @param {NameOrId} id - The name or ID number of the resource
	   * @param {OptionsObject} [opts] - Additional options
	   * @param {Function} [callback] - A callback for when the object is found
	   *
	   * @returns {Promise<Object>} The resource object, if found
	   */ /**
	      * @param {ResourceObject} resource
	      * @param {OptionsObject} [options]
	      * @param {Function} [callback]
	      *
	      */


	  _createClass(Pokewrap, [{
	    key: 'getOne',
	    value: function getOne() {
	      var _this = this;

	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      var patterns = [{
	        // getOne('pokemon', 1);
	        // getOne('pokemon', 'bulbasaur');
	        // getOne('pokemon', 'bulbasaur');
	        pattern: [_types.ResourceType, _types.NameOrId],
	        maybeOpts: true,
	        maybeCallback: true,
	        onMatch: function onMatch() {
	          var type = args[0];
	          var id = args[1];
	          var opts = args[2];
	          var callback = args[3];


	          return _types.OptionsObject.is(opts) ? _this.getOne(_extends({}, opts, { type: type, id: id }), callback) : _this.getOne({ type: type, id: id }, opts);
	        }
	      }, {
	        // getOne({ type: 'move', name: 'solar-beam' });
	        // getOne({ id: 1 });
	        // getOne({ name: 'bulbasaur' });
	        pattern: [_types.OptionsObject],
	        maybeCallback: true,
	        onMatch: function onMatch() {
	          var opts = args[0];
	          var callback = args[1];

	          var url = createUrl(_extends({
	            type: _this.defaultType,
	            baseUrl: _this.baseUrl
	          }, opts));

	          return _this.getByUrl(url, opts.request, callback);
	        }
	      }];

	      var dispatcher = (0, _createDispatcher2.default)(patterns);
	      return _tcomb.match.apply(undefined, [args].concat(_toConsumableArray(dispatcher)));
	    }

	    /**
	     * Fetches a single resource based on its name or ID
	     *
	     * @param {NameOrId} id - The name or ID number of the resource
	     * @param {OptionsObject} [opts] - Additional options
	     * @param {Function} [callback] - A callback for when the object is found
	     *
	     * @returns {Promise<Object>} The resource object, if found
	     */

	  }, {
	    key: 'getOneById',
	    value: function getOneById(id) {
	      var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	      var callback = arguments[2];

	      if (_types.Callback.is(opts)) {
	        return this.getOneById(id, undefined, opts);
	      }

	      var _opts$type = opts.type;
	      var type = _opts$type === undefined ? this.defaultType : _opts$type;

	      var resource = createUrl({ baseUrl: this.baseUrl, type: type, id: id });

	      return this.getByUrl(resource, opts.request, callback);
	    }

	    /**
	     * Alias for getOneById
	     *
	     * This is included for people who prefer to write `ID` rather than `Id`
	     *
	     * @see getOneById
	     */

	  }, {
	    key: 'getOneByID',
	    value: function getOneByID() {
	      return this.getOneById.apply(this, arguments);
	    }

	    /**
	     * Alias for getOneById
	     *
	     * This is included because it can be a bit weird to write
	     * `getOneById('bulbasaur')`, when a Pokeapi ID usually refers to an integer.
	     *
	     * @see getOneById
	     */

	  }, {
	    key: 'getOneByName',
	    value: function getOneByName() {
	      return this.getOneById.apply(this, arguments);
	    }

	    /**
	     * Fetches information about multiple resources, either from a ResourceList
	     * endpoint or as a series of get requests.
	     *
	     * @param {ResourceType} type
	     * @param {OptionsObject} [opts] - Additional options
	     * @param {Function} [callback] - A callback for when the object is found
	     *
	     * @returns {Promise<Object>}
	     */ /**
	        * @param {ResourceType} type
	        * @param {NameOrIdList} resources
	        * @param {OptionsObject} [opts] - Additional options that will be merged
	        *                                 with each item being fetched
	        * @param {Function} [callback] - A callback for when the object is found
	        *
	        * @returns {Promise<Object>}
	        */ /**
	           * @param {ResourceList} resources
	           * @param {OptionsObject} [opts] - Additional options that will be merged
	           *                                 with each item being fetched
	           * @param {Function} [callback] - A callback for when the object is found
	           *
	           * @returns {Promise<Object>}
	           */

	  }, {
	    key: 'getMany',
	    value: function getMany() {
	      var _this2 = this;

	      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        args[_key2] = arguments[_key2];
	      }

	      var patterns = [{
	        // getMany('item');
	        pattern: [_types.ResourceType],
	        maybeOpts: true,
	        maybeCallback: true,
	        onMatch: function onMatch() {
	          var type = args[0];
	          var _args$ = args[1];
	          var opts = _args$ === undefined ? {} : _args$;
	          var callback = args[2];


	          if (_types.Callback.is(opts)) {
	            return _this2.getMany(type, undefined, opts);
	          }

	          var limit = opts.limit;
	          var offset = opts.offset;
	          var request = opts.request;


	          var url = createUrl({ baseUrl: _this2.baseUrl, type: type, limit: limit, offset: offset });
	          return _this2.getByUrl(url, request, callback);
	        }
	      }, {
	        // getMany('pokemon', ['bulbasaur', 'charmander', 'squirtle']);
	        // getMany('item', [1, 2, 3]);
	        pattern: [_types.ResourceType, _types.NameOrIdList],
	        maybeOpts: true,
	        maybeCallback: true,
	        onMatch: function onMatch() {
	          var type = args[0];
	          var ids = args[1];
	          var _args$2 = args[2];
	          var opts = _args$2 === undefined ? {} : _args$2;
	          var callback = args[3];


	          if (_types.Callback.is(opts)) {
	            return _this2.getMany(type, ids, undefined, opts);
	          }

	          var requests = ids.map(function (id) {
	            return _this2.getOne(type, id, opts);
	          });
	          var batchedRequests = Promise.all(requests);
	          return maybeCallback(batchedRequests, callback);
	        }
	      }, {
	        // getMany(['bulbasaur', 'charmander', 'squirtle']);
	        // getMany([1, 2, 3]);
	        pattern: [_types.ResourceList],
	        maybeOpts: true,
	        maybeCallback: true,
	        onMatch: function onMatch() {
	          var resources = args[0];
	          var _args$3 = args[1];
	          var opts = _args$3 === undefined ? {} : _args$3;
	          var callback = args[2];


	          if (_types.Callback.is(opts)) {
	            return _this2.getMany(resources, undefined, opts);
	          }

	          var requests = resources.map(function (resource) {
	            return _types.NameOrId.is(resource) ? _this2.getOneById(resource, opts) : _this2.getOne(_extends({}, opts, resource));
	          });

	          var batchedRequests = Promise.all(requests);
	          return maybeCallback(batchedRequests, callback);
	        }
	      }];

	      var dispatcher = (0, _createDispatcher2.default)(patterns);
	      return _tcomb.match.apply(undefined, [args].concat(_toConsumableArray(dispatcher)));
	    }

	    /**
	     * Fetches the resource from the provided URL.
	     *
	     * @param {String} url - The URL to fetch
	     * @param {Object} [opts] - Additional options that will be passed to
	     *                                 the request object
	     * @param {Function} [callback] - A callback for when the object is found
	     */

	  }, {
	    key: 'getByUrl',
	    value: function getByUrl(url) {
	      var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	      var callback = arguments[2];

	      if (_types.Callback.is(opts)) {
	        return this.getByUrl(url, undefined, opts);
	      }

	      var requestOpts = _extends({}, this.requests, opts, {

	        // the Pokeapi only supports GET requests
	        method: 'GET'
	      });

	      var request = fetch(url, requestOpts).then(getJSON);
	      return maybeCallback(request, callback);
	    }

	    /**
	     * Alias for getByURL
	     *
	     * This is included for people who prefer to write `URL` rather than `Url`
	     *
	     * @see getByUrl
	     */

	  }, {
	    key: 'getByURL',
	    value: function getByURL() {
	      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	        args[_key3] = arguments[_key3];
	      }

	      return this.getByUrl(args);
	    }

	    /** @private */

	  }, {
	    key: 'getEmAll',
	    value: function getEmAll() {
	      return this.getMany('pokemon', { limit: Number.MAX_SAFE_INTEGER });
	    }
	  }]);

	  return Pokewrap;
	}();

	/**
	 * Creates a url based on parameters
	 * @private
	 */


	exports.default = Pokewrap;
	function createUrl(_ref) {
	  var baseUrl = _ref.baseUrl;
	  var type = _ref.type;
	  var id = _ref.id;
	  var name = _ref.name;
	  var limit = _ref.limit;
	  var offset = _ref.offset;

	  var base = stripTrailingSlash(baseUrl);
	  var identifier = id || name;

	  var template = new _uriTemplates2.default(base + '{/type}{/identifier}/{?limit,offset}');

	  return template.fillFromObject({ type: type, identifier: identifier, limit: limit, offset: offset });
	}

	/**
	 * Removes a trailing slash from a URL
	 * @private
	 *
	 * @param {String} url
	 * @returns {String}
	 */
	function stripTrailingSlash(url) {
	  return url.replace(/\/+$/, '');
	}

	/**
	 * Extracts the JSON body from a fetched response object
	 * @private
	 *
	 * @param {Response} response
	 * @returns {Object}
	 */
	function getJSON(response) {
	  if (response.status >= 400) {
	    var err = new Error(response.statusText);
	    return Promise.reject(err);
	  }

	  return response.json();
	}

	/**
	 * Calls a callback, if one is provided,  after a Promise resolves
	 *
	 * @param {Promise} promise
	 * @param {Function} callback
	 *
	 * @returns {Promise}
	 */
	function maybeCallback(promise, callback) {
	  if (callback) {
	    promise.then(function (data) {
	      (0, _nextTick2.default)(function () {
	        return callback(null, data);
	      });
	    }).catch(function (err) {
	      (0, _nextTick2.default)(function () {
	        return callback(err);
	      });
	    });
	  }

	  return promise;
	}

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * The resources available in the /v2/ API
	 */
	module.e = ['berry', 'berry-firmness', 'berry-flavor', 'contest-type', 'contest-effect', 'super-contest-effect', 'encounter-method', 'encounter-condition', 'encounter-condition-value', 'evolution-chain', 'evolution-trigger', 'generation', 'pokedex', 'version', 'version-group', 'item', 'item-attribute', 'item-category', 'item-fling-effect', 'item-pocket', 'move', 'move-ailment', 'move-battle-style', 'move-category', 'move-damage-class', 'move-learn-method', 'move-target', 'location', 'location-area', 'pal-park-area', 'region', 'ability', 'characteristic', 'egg-group', 'gender', 'growth-rate', 'nature', 'pokeathlon-stat', 'pokemon', 'pokemon-color', 'pokemon-form', 'pokemon-habitat', 'pokemon-shape', 'pokemon-species', 'stat', 'type', 'language'];

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(4);
	var isArray = __webpack_require__(7);

	module.e = irreducible('Array', isArray);


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(4);

	module.e = irreducible('Date', function (x) { return x instanceof Date; });


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(4);

	module.e = irreducible('Error', function (x) { return x instanceof Error; });


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(4);
	var isNumber = __webpack_require__(27);

	module.e = irreducible('Number', isNumber);


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(4);
	var isObject = __webpack_require__(12);

	module.e = irreducible('Object', isObject);


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(4);

	module.e = irreducible('RegExp', function (x) { return x instanceof RegExp; });


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var assert = __webpack_require__(1);
	var isTypeName = __webpack_require__(6);
	var isType = __webpack_require__(5);
	var isNil = __webpack_require__(10);
	var mixin = __webpack_require__(16);
	var getTypeName = __webpack_require__(2);

	// All the .declare-d types should be clearly different from each other thus they should have
	// different names when a name was not explicitly provided.
	var nextDeclareUniqueId = 1;

	module.e = function declare(name) {
	  if (process.env.NODE_ENV !== 'production') {
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + name + ' supplied to declare([name]) (expected a string)'; });
	  }

	  var type;

	  function Declare(value, path) {
	    if (process.env.NODE_ENV !== 'production') {
	      assert(!isNil(type), function () { return 'Type declared but not defined, don\'t forget to call .define on every declared type'; });
	    }
	    return type(value, path);
	  }

	  Declare.define = function (spec) {
	    if (process.env.NODE_ENV !== 'production') {
	      assert(isType(spec), function () { return 'Invalid argument type ' + assert.stringify(spec) +  ' supplied to define(type) (expected a type)'; });
	      assert(isNil(type), function () { return 'Declare.define(type) can only be invoked once'; });
	      assert(isNil(spec.meta.name) && Object.keys(spec.prototype).length === 0, function () { return 'Invalid argument type ' + assert.stringify(spec) + ' supplied to define(type) (expected a fresh, unnamed type)'; });
	    }

	    type = spec;
	    mixin(Declare, type, true); // true because it overwrites Declare.displayName
	    if (name) {
	      type.displayName = Declare.displayName = name;
	      Declare.meta.name = name;
	    }
	    // ensure identity is still false
	    Declare.meta.identity = false;
	    Declare.prototype = type.prototype;
	    return Declare;
	  };

	  Declare.displayName = name || ( getTypeName(Declare) + "$" + nextDeclareUniqueId++ );
	  // in general I can't say if this type will be an identity, for safety setting to false
	  Declare.meta = { identity: false };
	  Declare.prototype = null;
	  return Declare;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var assert = __webpack_require__(1);
	var isTypeName = __webpack_require__(6);
	var forbidNewOperator = __webpack_require__(13);
	var isString = __webpack_require__(15);
	var isObject = __webpack_require__(12);

	function getDefaultName(map) {
	  return Object.keys(map).map(function (k) { return assert.stringify(k); }).join(' | ');
	}

	function enums(map, name) {

	  if (process.env.NODE_ENV !== 'production') {
	    assert(isObject(map), function () { return 'Invalid argument map ' + assert.stringify(map) + ' supplied to enums(map, [name]) combinator (expected a dictionary of String -> String | Number)'; });
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to enums(map, [name]) combinator (expected a string)'; });
	  }

	  var displayName = name || getDefaultName(map);

	  function Enums(value, path) {

	    if (process.env.NODE_ENV !== 'production') {
	      forbidNewOperator(this, Enums);
	      path = path || [displayName];
	      assert(Enums.is(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/') + ' (expected one of ' + assert.stringify(Object.keys(map)) + ')'; });
	    }

	    return value;
	  }

	  Enums.meta = {
	    kind: 'enums',
	    map: map,
	    name: name,
	    identity: true
	  };

	  Enums.displayName = displayName;

	  Enums.is = function (x) {
	    return map.hasOwnProperty(x);
	  };

	  return Enums;
	}

	enums.of = function (keys, name) {
	  keys = isString(keys) ? keys.split(' ') : keys;
	  var value = {};
	  keys.forEach(function (k) {
	    value[k] = k;
	  });
	  return enums(value, name);
	};

	enums.getDefaultName = getDefaultName;
	module.e = enums;


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	module.e = function fail(message) {
	  throw new TypeError('[tcomb] ' + message);
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var assert = __webpack_require__(1);
	var isTypeName = __webpack_require__(6);
	var FunctionType = __webpack_require__(19);
	var isArray = __webpack_require__(7);
	var list = __webpack_require__(29);
	var isObject = __webpack_require__(12);
	var create = __webpack_require__(8);
	var isNil = __webpack_require__(10);
	var isBoolean = __webpack_require__(26);
	var tuple = __webpack_require__(31);
	var getFunctionName = __webpack_require__(14);
	var getTypeName = __webpack_require__(2);

	function getDefaultName(domain, codomain) {
	  return '(' + domain.map(getTypeName).join(', ') + ') => ' + getTypeName(codomain);
	}

	function isInstrumented(f) {
	  return FunctionType.is(f) && isObject(f.instrumentation);
	}

	function func(domain, codomain, name) {

	  domain = isArray(domain) ? domain : [domain]; // handle handy syntax for unary functions

	  if (process.env.NODE_ENV !== 'production') {
	    assert(list(FunctionType).is(domain), function () { return 'Invalid argument domain ' + assert.stringify(domain) + ' supplied to func(domain, codomain, [name]) combinator (expected an array of types)'; });
	    assert(FunctionType.is(codomain), function () { return 'Invalid argument codomain ' + assert.stringify(codomain) + ' supplied to func(domain, codomain, [name]) combinator (expected a type)'; });
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to func(domain, codomain, [name]) combinator (expected a string)'; });
	  }

	  var displayName = name || getDefaultName(domain, codomain);

	  function FuncType(value, curried) {

	    if (!isInstrumented(value)) { // automatically instrument the function
	      return FuncType.of(value, curried);
	    }

	    if (process.env.NODE_ENV !== 'production') {
	      assert(FuncType.is(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + displayName; });
	    }

	    return value;
	  }

	  FuncType.meta = {
	    kind: 'func',
	    domain: domain,
	    codomain: codomain,
	    name: name,
	    identity: true
	  };

	  FuncType.displayName = displayName;

	  FuncType.is = function (x) {
	    return isInstrumented(x) &&
	      x.instrumentation.domain.length === domain.length &&
	      x.instrumentation.domain.every(function (type, i) {
	        return type === domain[i];
	      }) &&
	      x.instrumentation.codomain === codomain;
	  };

	  FuncType.of = function (f, curried) {

	    if (process.env.NODE_ENV !== 'production') {
	      assert(FunctionType.is(f), function () { return 'Invalid argument f supplied to func.of ' + displayName + ' (expected a function)'; });
	      assert(isNil(curried) || isBoolean(curried), function () { return 'Invalid argument curried ' + assert.stringify(curried) + ' supplied to func.of ' + displayName + ' (expected a boolean)'; });
	    }

	    if (FuncType.is(f)) { // makes FuncType.of idempotent
	      return f;
	    }

	    function fn() {
	      var args = Array.prototype.slice.call(arguments);
	      var len = curried ?
	        args.length :
	        domain.length;
	      var argsType = tuple(domain.slice(0, len));

	      args = argsType(args); // type check arguments

	      if (len === domain.length) {
	        return create(codomain, f.apply(this, args));
	      }
	      else {
	        var g = Function.prototype.bind.apply(f, [this].concat(args));
	        var newdomain = func(domain.slice(len), codomain);
	        return newdomain.of(g, curried);
	      }
	    }

	    fn.instrumentation = {
	      domain: domain,
	      codomain: codomain,
	      f: f
	    };

	    fn.displayName = getFunctionName(f);

	    return fn;

	  };

	  return FuncType;

	}

	func.getDefaultName = getDefaultName;
	module.e = func;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var assert = __webpack_require__(1);
	var isTypeName = __webpack_require__(6);
	var isFunction = __webpack_require__(3);
	var isArray = __webpack_require__(7);
	var forbidNewOperator = __webpack_require__(11);
	var is = __webpack_require__(9);
	var getTypeName = __webpack_require__(2);

	function getDefaultName(types) {
	  return types.map(getTypeName).join(' & ');
	}

	function intersection(types, name) {

	  if (process.env.NODE_ENV !== 'production') {
	    assert(isArray(types) && types.every(isFunction) && types.length >= 2, function () { return 'Invalid argument types ' + assert.stringify(types) + ' supplied to intersection(types, [name]) combinator (expected an array of at least 2 types)'; });
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to intersection(types, [name]) combinator (expected a string)'; });
	  }

	  var displayName = name || getDefaultName(types);

	  function Intersection(value, path) {

	    if (process.env.NODE_ENV !== 'production') {
	      forbidNewOperator(this, Intersection);
	      path = path || [displayName];
	      assert(Intersection.is(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/'); });
	    }

	    return value;
	  }

	  Intersection.meta = {
	    kind: 'intersection',
	    types: types,
	    name: name,
	    identity: true
	  };

	  Intersection.displayName = displayName;

	  Intersection.is = function (x) {
	    return types.every(function (type) {
	      return is(x, type);
	    });
	  };

	  Intersection.update = function (instance, patch) {
	    return Intersection(assert.update(instance, patch));
	  };

	  return Intersection;
	}

	intersection.getDefaultName = getDefaultName;
	module.e = intersection;


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var isType = __webpack_require__(5);

	module.e = function isMaybe(x) {
	  return isType(x) && ( x.meta.kind === 'maybe' );
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var isType = __webpack_require__(5);

	module.e = function isUnion(x) {
	  return isType(x) && ( x.meta.kind === 'union' );
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var assert = __webpack_require__(1);
	var isFunction = __webpack_require__(3);
	var isType = __webpack_require__(5);
	var Any = __webpack_require__(18);

	module.e = function match(x) {
	  var type, guard, f, count;
	  for (var i = 1, len = arguments.length; i < len; ) {
	    type = arguments[i];
	    guard = arguments[i + 1];
	    f = arguments[i + 2];

	    if (isFunction(f) && !isType(f)) {
	      i = i + 3;
	    }
	    else {
	      f = guard;
	      guard = Any.is;
	      i = i + 2;
	    }

	    if (process.env.NODE_ENV !== 'production') {
	      count = (count || 0) + 1;
	      assert(isType(type), function () { return 'Invalid type in clause #' + count; });
	      assert(isFunction(guard), function () { return 'Invalid guard in clause #' + count; });
	      assert(isFunction(f), function () { return 'Invalid block in clause #' + count; });
	    }

	    if (type.is(x) && guard(x)) {
	      return f(x);
	    }
	  }
	  assert.fail('Match error');
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var assert = __webpack_require__(1);
	var isTypeName = __webpack_require__(6);
	var isFunction = __webpack_require__(3);
	var isMaybe = __webpack_require__(49);
	var isIdentity = __webpack_require__(11);
	var Any = __webpack_require__(18);
	var create = __webpack_require__(8);
	var Nil = __webpack_require__(23);
	var forbidNewOperator = __webpack_require__(13);
	var is = __webpack_require__(9);
	var getTypeName = __webpack_require__(2);

	function getDefaultName(type) {
	  return '?' + getTypeName(type);
	}

	function maybe(type, name) {

	  if (isMaybe(type) || type === Any || type === Nil) { // makes the combinator idempotent and handle Any, Nil
	    return type;
	  }

	  if (process.env.NODE_ENV !== 'production') {
	    assert(isFunction(type), function () { return 'Invalid argument type ' + assert.stringify(type) + ' supplied to maybe(type, [name]) combinator (expected a type)'; });
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to maybe(type, [name]) combinator (expected a string)'; });
	  }

	  var displayName = name || getDefaultName(type);

	  function Maybe(value, path) {
	    if (process.env.NODE_ENV !== 'production') {
	      forbidNewOperator(this, Maybe);
	    }
	    return Nil.is(value) ? null : create(type, value, path);
	  }

	  Maybe.meta = {
	    kind: 'maybe',
	    type: type,
	    name: name,
	    identity: isIdentity(type)
	  };

	  Maybe.displayName = displayName;

	  Maybe.is = function (x) {
	    return Nil.is(x) || is(x, type);
	  };

	  return Maybe;
	}

	maybe.getDefaultName = getDefaultName;
	module.e = maybe;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var assert = __webpack_require__(1);
	var isTypeName = __webpack_require__(6);
	var isFunction = __webpack_require__(3);
	var forbidNewOperator = __webpack_require__(13);
	var isIdentity = __webpack_require__(11);
	var create = __webpack_require__(8);
	var is = __webpack_require__(9);
	var getTypeName = __webpack_require__(2);
	var getFunctionName = __webpack_require__(14);

	function getDefaultName(type, predicate) {
	  return '{' + getTypeName(type) + ' | ' + getFunctionName(predicate) + '}';
	}

	function refinement(type, predicate, name) {

	  if (process.env.NODE_ENV !== 'production') {
	    assert(isFunction(type), function () { return 'Invalid argument type ' + assert.stringify(type) + ' supplied to refinement(type, predicate, [name]) combinator (expected a type)'; });
	    assert(isFunction(predicate), function () { return 'Invalid argument predicate supplied to refinement(type, predicate, [name]) combinator (expected a function)'; });
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to refinement(type, predicate, [name]) combinator (expected a string)'; });
	  }

	  var displayName = name || getDefaultName(type, predicate);
	  var identity = isIdentity(type);

	  function Refinement(value, path) {

	    if (process.env.NODE_ENV !== 'production') {
	      forbidNewOperator(this, Refinement);
	      path = path || [displayName];
	    }

	    var x = create(type, value, path);

	    if (process.env.NODE_ENV !== 'production') {
	      assert(predicate(x), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/'); });
	    }

	    return x;
	  }

	  Refinement.meta = {
	    kind: 'subtype',
	    type: type,
	    predicate: predicate,
	    name: name,
	    identity: identity
	  };

	  Refinement.displayName = displayName;

	  Refinement.is = function (x) {
	    return is(x, type) && predicate(x);
	  };

	  Refinement.update = function (instance, patch) {
	    return Refinement(assert.update(instance, patch));
	  };

	  return Refinement;
	}

	refinement.getDefaultName = getDefaultName;
	module.e = refinement;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var assert = __webpack_require__(1);
	var isTypeName = __webpack_require__(6);
	var String = __webpack_require__(24);
	var Function = __webpack_require__(19);
	var isArray = __webpack_require__(7);
	var isObject = __webpack_require__(12);
	var create = __webpack_require__(8);
	var mixin = __webpack_require__(16);
	var isStruct = __webpack_require__(28);
	var getTypeName = __webpack_require__(2);
	var dict = __webpack_require__(25);

	function getDefaultName(props) {
	  return '{' + Object.keys(props).map(function (prop) {
	    return prop + ': ' + getTypeName(props[prop]);
	  }).join(', ') + '}';
	}

	function extend(mixins, name) {
	  if (process.env.NODE_ENV !== 'production') {
	    assert(isArray(mixins) && mixins.every(function (x) {
	      return isObject(x) || isStruct(x);
	    }), function () { return 'Invalid argument mixins supplied to extend(mixins, name), expected an array of objects or structs'; });
	  }
	  var props = {};
	  var prototype = {};
	  mixins.forEach(function (struct) {
	    if (isObject(struct)) {
	      mixin(props, struct);
	    }
	    else {
	      mixin(props, struct.meta.props);
	      mixin(prototype, struct.prototype);
	    }
	  });
	  var ret = struct(props, name);
	  mixin(ret.prototype, prototype);
	  return ret;
	}

	function struct(props, name) {

	  if (process.env.NODE_ENV !== 'production') {
	    assert(dict(String, Function).is(props), function () { return 'Invalid argument props ' + assert.stringify(props) + ' supplied to struct(props, [name]) combinator (expected a dictionary String -> Type)'; });
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to struct(props, [name]) combinator (expected a string)'; });
	  }

	  var displayName = name || getDefaultName(props);

	  function Struct(value, path) {

	    if (Struct.is(value)) { // implements idempotency
	      return value;
	    }

	    if (process.env.NODE_ENV !== 'production') {
	      path = path || [displayName];
	      assert(isObject(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/') + ' (expected an object)'; });
	    }

	    if (!(this instanceof Struct)) { // `new` is optional
	      return new Struct(value, path);
	    }

	    for (var k in props) {
	      if (props.hasOwnProperty(k)) {
	        var expected = props[k];
	        var actual = value[k];
	        this[k] = create(expected, actual, ( process.env.NODE_ENV !== 'production' ? path.concat(k + ': ' + getTypeName(expected)) : null ));
	      }
	    }

	    if (process.env.NODE_ENV !== 'production') {
	      Object.freeze(this);
	    }

	  }

	  Struct.meta = {
	    kind: 'struct',
	    props: props,
	    name: name,
	    identity: false
	  };

	  Struct.displayName = displayName;

	  Struct.is = function (x) {
	    return x instanceof Struct;
	  };

	  Struct.update = function (instance, patch) {
	    return new Struct(assert.update(instance, patch));
	  };

	  Struct.extend = function (structs, name) {
	    return extend([Struct].concat(structs), name);
	  };

	  return Struct;
	}

	struct.getDefaultName = getDefaultName;
	struct.extend = extend;
	module.e = struct;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var assert = __webpack_require__(1);
	var isTypeName = __webpack_require__(6);
	var isFunction = __webpack_require__(3);
	var getTypeName = __webpack_require__(2);
	var isIdentity = __webpack_require__(11);
	var isArray = __webpack_require__(7);
	var create = __webpack_require__(8);
	var is = __webpack_require__(9);
	var forbidNewOperator = __webpack_require__(13);
	var isType = __webpack_require__(5);
	var isUnion = __webpack_require__(50);
	var isNil = __webpack_require__(10);

	function getDefaultName(types) {
	  return types.map(getTypeName).join(' | ');
	}

	function union(types, name) {

	  if (process.env.NODE_ENV !== 'production') {
	    assert(isArray(types) && types.every(isFunction) && types.length >= 2, function () { return 'Invalid argument types ' + assert.stringify(types) + ' supplied to union(types, [name]) combinator (expected an array of at least 2 types)'; });
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to union(types, [name]) combinator (expected a string)'; });
	  }

	  var displayName = name || getDefaultName(types);
	  var identity = types.every(isIdentity);

	  function Union(value, path) {

	    if (process.env.NODE_ENV === 'production') {
	      if (identity) {
	        return value;
	      }
	    }

	    var type = Union.dispatch(value);
	    if (!type && Union.is(value)) {
	      return value;
	    }

	    if (process.env.NODE_ENV !== 'production') {
	      forbidNewOperator(this, Union);
	      path = path || [displayName];
	      assert(isType(type), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/') + ' (no constructor returned by dispatch)'; });
	      path[path.length - 1] += '(' + getTypeName(type) + ')';
	    }

	    return create(type, value, path);
	  }

	  Union.meta = {
	    kind: 'union',
	    types: types,
	    name: name,
	    identity: identity
	  };

	  Union.displayName = displayName;

	  Union.is = function (x) {
	    return types.some(function (type) {
	      return is(x, type);
	    });
	  };

	  Union.dispatch = function (x) { // default dispatch implementation
	    for (var i = 0, len = types.length; i < len; i++ ) {
	      var type = types[i];
	      if (isUnion(type)) { // handle union of unions
	        var t = type.dispatch(x);
	        if (!isNil(t)) {
	          return t;
	        }
	      }
	      else if (is(x, type)) {
	        return type;
	      }
	    }
	  };

	  Union.update = function (instance, patch) {
	    return Union(assert.update(instance, patch));
	  };

	  return Union;
	}

	union.getDefaultName = getDefaultName;
	module.e = union;


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var assert = __webpack_require__(1);
	var isObject = __webpack_require__(12);
	var isFunction = __webpack_require__(3);
	var isArray = __webpack_require__(7);
	var isNumber = __webpack_require__(27);
	var mixin = __webpack_require__(16);

	function getShallowCopy(x) {
	  if (isArray(x)) {
	    return x.concat();
	  }
	  if (x instanceof Date || x instanceof RegExp) {
	    return x;
	  }
	  if (isObject(x)) {
	    return mixin({}, x);
	  }
	  return x;
	}

	function update(instance, patch) {

	  if (process.env.NODE_ENV !== 'production') {
	    assert(isObject(patch), function () { return 'Invalid argument patch ' + assert.stringify(patch) + ' supplied to function update(instance, patch): expected an object containing commands'; });
	  }

	  var value = getShallowCopy(instance);
	  var isChanged = false;
	  for (var k in patch) {
	    if (patch.hasOwnProperty(k)) {
	      if (update.commands.hasOwnProperty(k)) {
	        value = update.commands[k](patch[k], value);
	        isChanged = true;
	      }
	      else {
	        var newValue = update(value[k], patch[k]);
	        isChanged = isChanged || ( newValue !== value[k] );
	        value[k] = newValue;
	      }
	    }
	  }
	  return isChanged ? value : instance;
	}

	// built-in commands

	function $apply(f, value) {
	  if (process.env.NODE_ENV !== 'production') {
	    assert(isFunction(f), 'Invalid argument f supplied to immutability helper { $apply: f } (expected a function)');
	  }
	  return f(value);
	}

	function $push(elements, arr) {
	  if (process.env.NODE_ENV !== 'production') {
	    assert(isArray(elements), 'Invalid argument elements supplied to immutability helper { $push: elements } (expected an array)');
	    assert(isArray(arr), 'Invalid value supplied to immutability helper $push (expected an array)');
	  }
	  return arr.concat(elements);
	}

	function $remove(keys, obj) {
	  if (process.env.NODE_ENV !== 'production') {
	    assert(isArray(keys), 'Invalid argument keys supplied to immutability helper { $remove: keys } (expected an array)');
	    assert(isObject(obj), 'Invalid value supplied to immutability helper $remove (expected an object)');
	  }
	  for (var i = 0, len = keys.length; i < len; i++ ) {
	    delete obj[keys[i]];
	  }
	  return obj;
	}

	function $set(value) {
	  return value;
	}

	function $splice(splices, arr) {
	  if (process.env.NODE_ENV !== 'production') {
	    assert(isArray(splices) && splices.every(isArray), 'Invalid argument splices supplied to immutability helper { $splice: splices } (expected an array of arrays)');
	    assert(isArray(arr), 'Invalid value supplied to immutability helper $splice (expected an array)');
	  }
	  return splices.reduce(function (acc, splice) {
	    acc.splice.apply(acc, splice);
	    return acc;
	  }, arr);
	}

	function $swap(config, arr) {
	  if (process.env.NODE_ENV !== 'production') {
	    assert(isObject(config), 'Invalid argument config supplied to immutability helper { $swap: config } (expected an object)');
	    assert(isNumber(config.from), 'Invalid argument config.from supplied to immutability helper { $swap: config } (expected a number)');
	    assert(isNumber(config.to), 'Invalid argument config.to supplied to immutability helper { $swap: config } (expected a number)');
	    assert(isArray(arr), 'Invalid value supplied to immutability helper $swap (expected an array)');
	  }
	  var element = arr[config.to];
	  arr[config.to] = arr[config.from];
	  arr[config.from] = element;
	  return arr;
	}

	function $unshift(elements, arr) {
	  if (process.env.NODE_ENV !== 'production') {
	    assert(isArray(elements), 'Invalid argument elements supplied to immutability helper {$unshift: elements} (expected an array)');
	    assert(isArray(arr), 'Invalid value supplied to immutability helper $unshift (expected an array)');
	  }
	  return elements.concat(arr);
	}

	function $merge(obj, value) {
	  return mixin(mixin({}, value), obj, true);
	}

	update.commands = {
	  $apply: $apply,
	  $push: $push,
	  $remove: $remove,
	  $set: $set,
	  $splice: $splice,
	  $swap: $swap,
	  $unshift: $unshift,
	  $merge: $merge
	};

	module.e = update;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ },
/* 57 */
/***/ function(module, exports) {

	(function(self) {
	  'use strict';

	  if (self.fetch) {
	    return
	  }

	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }

	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }

	  function Headers(headers) {
	    this.map = {}

	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)

	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }

	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var list = this.map[name]
	    if (!list) {
	      list = []
	      this.map[name] = list
	    }
	    list.push(value)
	  }

	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }

	  Headers.prototype.get = function(name) {
	    var values = this.map[normalizeName(name)]
	    return values ? values[0] : null
	  }

	  Headers.prototype.getAll = function(name) {
	    return this.map[normalizeName(name)] || []
	  }

	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }

	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)]
	  }

	  Headers.prototype.forEach = function(callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function(name) {
	      this.map[name].forEach(function(value) {
	        callback.call(thisArg, value, name, this)
	      }, this)
	    }, this)
	  }

	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }

	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }

	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    reader.readAsArrayBuffer(blob)
	    return fileReaderReady(reader)
	  }

	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    reader.readAsText(blob)
	    return fileReaderReady(reader)
	  }

	  var support = {
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob();
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  }

	  function Body() {
	    this.bodyUsed = false


	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (!body) {
	        this._bodyText = ''
	      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
	        // Only support ArrayBuffers for POST method.
	        // Receiving ArrayBuffers happens via Blobs, instead.
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }

	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8')
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type)
	        }
	      }
	    }

	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }

	      this.arrayBuffer = function() {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }

	      this.text = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text')
	        } else {
	          return Promise.resolve(this._bodyText)
	        }
	      }
	    } else {
	      this.text = function() {
	        var rejected = consumed(this)
	        return rejected ? rejected : Promise.resolve(this._bodyText)
	      }
	    }

	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }

	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }

	    return this
	  }

	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }

	  function Request(input, options) {
	    options = options || {}
	    var body = options.body
	    if (Request.prototype.isPrototypeOf(input)) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    } else {
	      this.url = input
	    }

	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null

	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }

	  Request.prototype.clone = function() {
	    return new Request(this)
	  }

	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }

	  function headers(xhr) {
	    var head = new Headers()
	    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
	    pairs.forEach(function(header) {
	      var split = header.trim().split(':')
	      var key = split.shift().trim()
	      var value = split.join(':').trim()
	      head.append(key, value)
	    })
	    return head
	  }

	  Body.call(Request.prototype)

	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }

	    this.type = 'default'
	    this.status = options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = options.statusText
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	    this.url = options.url || ''
	    this._initBody(bodyInit)
	  }

	  Body.call(Response.prototype)

	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }

	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }

	  var redirectStatuses = [301, 302, 303, 307, 308]

	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }

	    return new Response(null, {status: status, headers: {location: url}})
	  }

	  self.Headers = Headers;
	  self.Request = Request;
	  self.Response = Response;

	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request
	      if (Request.prototype.isPrototypeOf(input) && !init) {
	        request = input
	      } else {
	        request = new Request(input, init)
	      }

	      var xhr = new XMLHttpRequest()

	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL
	        }

	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL')
	        }

	        return;
	      }

	      xhr.onload = function() {
	        var status = (xhr.status === 1223) ? 204 : xhr.status
	        if (status < 100 || status > 599) {
	          reject(new TypeError('Network request failed'))
	          return
	        }
	        var options = {
	          status: status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        }
	        var body = 'response' in xhr ? xhr.response : xhr.responseText;
	        resolve(new Response(body, options))
	      }

	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.open(request.method, request.url, true)

	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }

	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }

	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })

	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})(typeof self !== 'undefined' ? self : this);


/***/ }
/******/ ]);