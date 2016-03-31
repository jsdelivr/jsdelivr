(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.e2d = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//jshint node: true
'use strict';

module.exports = {
    addColorStop: require('./src/addColorStop'),
    arc: require('./src/arc'),
    arcTo: require('./src/arcTo'),
    beginPath: require('./src/beginPath'),
    bezierCurveTo: require('./src/bezierCurveTo'),
    Canvas: require('./src/Canvas'),
    clearRect: require('./src/clearRect'),
    clip: require('./src/clip'),
    clipPath: require('./src/clipPath'),
    closePath: require('./src/closePath'),
    createClass: require('./src/createClass'),
    createLinearGradient: require('./src/createLinearGradient'),
    createRadialGradient: require('./src/createRadialGradient'),
    createRegularPolygon : require('./src/createRegularPolygon'),
    drawCanvas: require('./src/drawCanvas'),
    drawImage: require('./src/drawImage'),
    ellipse: require('./src/ellipse'),
    fill: require('./src/fill'),
    fillArc: require('./src/fillArc'),
    fillCanvas: require('./src/fillCanvas'),
    fillImage: require('./src/fillImage'),
    fillImagePattern: require('./src/fillImagePattern'),
    fillRect: require('./src/fillRect'),
    fillStyle: require('./src/fillStyle'),
    fillText: require('./src/fillText'),
    globalAlpha: require('./src/globalAlpha'),
    globalCompositeOperation: require('./src/globalCompositeOperation'),
    hitRect: require('./src/hitRect'),
    hitRegion: require('./src/hitRegion'),
    imageSmoothingEnabled: require('./src/imageSmoothingEnabled'),
    Img: require('./src/Img'),
    Instruction: require('./src/Instruction'),
    lineStyle: require('./src/lineStyle'),
    lineTo: require('./src/lineTo'),
    moveTo: require('./src/moveTo'),
    moveToLineTo: require('./src/moveToLineTo'),
    path: require('./src/path'),
    placeHolder: require('./src/placeHolder'),
    quadraticCurveTo: require('./src/quadraticCurveTo'),
    rect: require('./src/rect'),
    Renderer: require('./src/Renderer'),
    resetTransform: require('./src/resetTransform'),
    rotate: require('./src/rotate'),
    scale: require('./src/scale'),
    setTransform: require('./src/setTransform'),
    shadowStyle: require('./src/shadowStyle'),
    stroke: require('./src/stroke'),
    strokeArc: require('./src/strokeArc'),
    strokeRect: require('./src/strokeRect'),
    strokeStyle: require('./src/strokeStyle'),
    strokeText: require('./src/strokeText'),
    text: require('./src/text'),
    textStyle: require('./src/textStyle'),
    transform: require('./src/transform'),
    transformPoints: require('./src/transformPoints'),
    translate: require('./src/translate')
};

},{"./src/Canvas":10,"./src/Img":11,"./src/Instruction":12,"./src/Renderer":13,"./src/addColorStop":14,"./src/arc":15,"./src/arcTo":16,"./src/beginPath":17,"./src/bezierCurveTo":18,"./src/clearRect":19,"./src/clip":20,"./src/clipPath":21,"./src/closePath":22,"./src/createClass":23,"./src/createLinearGradient":24,"./src/createRadialGradient":25,"./src/createRegularPolygon":26,"./src/drawCanvas":27,"./src/drawImage":28,"./src/ellipse":29,"./src/fill":30,"./src/fillArc":31,"./src/fillCanvas":32,"./src/fillImage":33,"./src/fillImagePattern":34,"./src/fillRect":35,"./src/fillStyle":36,"./src/fillText":37,"./src/globalAlpha":38,"./src/globalCompositeOperation":39,"./src/hitRect":40,"./src/hitRegion":41,"./src/imageSmoothingEnabled":42,"./src/lineStyle":43,"./src/lineTo":44,"./src/moveTo":45,"./src/moveToLineTo":46,"./src/path":47,"./src/placeHolder":48,"./src/quadraticCurveTo":49,"./src/rect":50,"./src/resetTransform":51,"./src/rotate":52,"./src/scale":53,"./src/setTransform":54,"./src/shadowStyle":55,"./src/stroke":56,"./src/strokeArc":57,"./src/strokeRect":58,"./src/strokeStyle":59,"./src/strokeText":60,"./src/text":61,"./src/textStyle":62,"./src/transform":63,"./src/transformPoints":64,"./src/translate":65}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],3:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],4:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":5}],5:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
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
            currentQueue[queueIndex].run();
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

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],6:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],7:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":6,"_process":5,"inherits":3}],8:[function(require,module,exports){
// Source: http://jsfiddle.net/vWx8V/
// http://stackoverflow.com/questions/5603195/full-list-of-javascript-keycodes



/**
 * Conenience method returns corresponding value for given keyName or keyCode.
 *
 * @param {Mixed} keyCode {Number} or keyName {String}
 * @return {Mixed}
 * @api public
 */

exports = module.exports = function(searchInput) {
  // Keyboard Events
  if (searchInput && 'object' === typeof searchInput) {
    var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode
    if (hasKeyCode) searchInput = hasKeyCode
  }

  // Numbers
  if ('number' === typeof searchInput) return names[searchInput]

  // Everything else (cast to string)
  var search = String(searchInput)

  // check codes
  var foundNamedKey = codes[search.toLowerCase()]
  if (foundNamedKey) return foundNamedKey

  // check aliases
  var foundNamedKey = aliases[search.toLowerCase()]
  if (foundNamedKey) return foundNamedKey

  // weird character?
  if (search.length === 1) return search.charCodeAt(0)

  return undefined
}

/**
 * Get by name
 *
 *   exports.code['enter'] // => 13
 */

var codes = exports.code = exports.codes = {
  'backspace': 8,
  'tab': 9,
  'enter': 13,
  'shift': 16,
  'ctrl': 17,
  'alt': 18,
  'pause/break': 19,
  'caps lock': 20,
  'esc': 27,
  'space': 32,
  'page up': 33,
  'page down': 34,
  'end': 35,
  'home': 36,
  'left': 37,
  'up': 38,
  'right': 39,
  'down': 40,
  'insert': 45,
  'delete': 46,
  'command': 91,
  'right click': 93,
  'numpad *': 106,
  'numpad +': 107,
  'numpad -': 109,
  'numpad .': 110,
  'numpad /': 111,
  'num lock': 144,
  'scroll lock': 145,
  'my computer': 182,
  'my calculator': 183,
  ';': 186,
  '=': 187,
  ',': 188,
  '-': 189,
  '.': 190,
  '/': 191,
  '`': 192,
  '[': 219,
  '\\': 220,
  ']': 221,
  "'": 222,
}

// Helper aliases

var aliases = exports.aliases = {
  'windows': 91,
  '⇧': 16,
  '⌥': 18,
  '⌃': 17,
  '⌘': 91,
  'ctl': 17,
  'control': 17,
  'option': 18,
  'pause': 19,
  'break': 19,
  'caps': 20,
  'return': 13,
  'escape': 27,
  'spc': 32,
  'pgup': 33,
  'pgdn': 33,
  'ins': 45,
  'del': 46,
  'cmd': 91
}


/*!
 * Programatically add the following
 */

// lower case chars
for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32

// numbers
for (var i = 48; i < 58; i++) codes[i - 48] = i

// function keys
for (i = 1; i < 13; i++) codes['f'+i] = i + 111

// numpad keys
for (i = 0; i < 10; i++) codes['numpad '+i] = i + 96

/**
 * Get by code
 *
 *   exports.name[13] // => 'Enter'
 */

var names = exports.names = exports.title = {} // title for backward compat

// Create reverse mapping
for (i in codes) names[codes[i]] = i

// Add aliases
for (var alias in aliases) {
  codes[alias] = aliases[alias]
}

},{}],9:[function(require,module,exports){
module.exports = function (point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

},{}],10:[function(require,module,exports){
//jshint worker: true, browser: true, node: true
'use strict';

function Canvas(width, height) {

  var Renderer = require('./Renderer');
  this.renderer = new Renderer(width, height, window.document.createElement('div'));
  this.fillPattern = null;
  this.skipPatternCreation = false;

  return Object.seal(this);
}

Canvas.prototype.render = function render(children) {
  var result = [],
      i;
  for (i = 0; i < arguments.length; i++) {
    result.push(arguments[i]);
  }

  this.renderer.render(result);
  if (!this.skipPatternCreation) {
    this.fillPattern = this.renderer.ctx.createPattern(this.renderer.canvas, 'no-repeat');
  }
  return this;
};

Canvas.prototype.style = function style() {
  var defs = [];
  for (var i = 0; i < arguments.length; i++) {
    defs.push(arguments[i]);
  }
  this.renderer.style.apply(this.renderer, defs);
  return this;
};

Canvas.prototype.toImage = function toImage(imageID) {
  return this.renderer.toImage();
};

Canvas.prototype.resize = function resize(width, height) {
  this.renderer.resize(+width, +height);
  return this;
};

Object.defineProperty(Canvas.prototype, 'height', {
  get: function() {
    return this.renderer.canvas.width;
  },
  enumerable: true,
  configurable: false
});

Object.defineProperty(Canvas.prototype, 'width', {
  get: function() {
    return this.renderer.canvas.width;
  },
  enumerable: true,
  configurable: false
});


Canvas.create = function create(width, height, id) {
  return new Canvas(width, height, id);
};


Object.seal(Canvas);
Object.seal(Canvas.prototype);
module.exports = Canvas;

},{"./Renderer":13}],11:[function(require,module,exports){
//jshint node: true, browser: true, worker: true
'use strict';

var path = require('path'),
    events = require('events'),
    util = require('util');

util.inherits(Img, events.EventEmitter);

function Img() {
  events.EventEmitter.call(this);
  this.imageElement = null;
  this.imagePattern = null;
  this.imagePatternRepeat = null;
  Object.seal(this);
}

Object.defineProperty(Img.prototype, 'src', {
  set: function(val) {

    var element = new Image();
    this.imageElement = element;
    element.src = val;

    if (element.complete) { //firefox compatibility code
      setTimeout(this.imageLoad.bind(this), 0);
    } else {
      element.onload = this.imageLoad.bind(this);
    }
  },
  get: function() {
    return this.imageElement.src;
  }
});

Img.prototype.imageLoad = function imageLoad() {

  var ctx = window.document.createElement('canvas').getContext('2d');
  this.imagePattern = ctx.createPattern(this.imageElement, 'no-repeat');
  this.imagePatternRepeat = ctx.createPattern(this.imageElement, 'repeat');

  return this.emit('load', this);
};

Object.defineProperty(Img.prototype, 'width', {
  enumerable: true,
  get: function() {
    return this.imageElement.width;
  },
  set: function(value) {
    this.imageElement.width = value;
  }
});

Object.defineProperty(Img.prototype, 'height', {
  enumerable: true,
  get: function() {
    return this.imageElement.height;
  },
  set: function(value) {
    this.imageElement.height = value;
  }
});

Object.seal(Img);
Object.seal(Img.prototype);

module.exports = Img;

},{"events":2,"path":4,"util":7}],12:[function(require,module,exports){
//jshint node: true
'use strict';
function Instruction(type, props) {
  this.type = type;
  this.props = props;
  Object.seal(this);
}

Object.seal(Instruction);
Object.seal(Instruction.prototype);

module.exports = Instruction;
},{}],13:[function(require,module,exports){
//jshint node: true, browser: true, worker: true
'use strict';

var createLinearGradient = require('./createLinearGradient'),
    createRadialGradient = require('./createRadialGradient'),
    events = require('events'),
    util = require('util'),
    keycode = require('keycode'),
    transformPoints = require('./transformPoints'),
    pointInPolygon = require('point-in-polygon'),
    identity = [1, 0, 0, 1, 0, 0],
    Img = require('./Img');

util.inherits(Renderer, events.EventEmitter);

function Renderer(width, height, parent, opts) {
  events.EventEmitter.call(this);
  opts = opts || {};

  //virtual stack
  this.transformStack = new Float64Array(
    ((opts.transformStackCount || 500) + 1) * 6 //properties
  );
  this.transformStackIndex = 6;
  this.transformStack.set(identity);

  this.fillStyleStack = [];
  this.strokeStyleStack = [];
  this.lineStyleStack = [];
  this.textStyleStack = [];
  this.shadowStyleStack = [];
  this.globalAlphaStack = [];
  this.imageSmoothingEnabledStack = [];
  this.globalCompositeOperationStack = [];

  this.pi2 = Math.PI * 2;

  this.isReady = false;
  this.mouseState = 'up';
  this.mouseData = {
    x: 0,
    y: 0,
    state: this.mouseState,
    clicked: false,
    activeRegions: []
  };
  this.lastMouseEvent = null;
  this.ranMouseEvent = false;
  this.mouseRegions = [];
  this.activeRegions = [];
  this.styleQueue = [];

  //user input here
  this.keyData = {};

  this.touchData = {
    touches: [],
    ids: []
  };
  this.lastTouchEvent = null;
  this.ranTouchEvent = false;
  this.touchRegions = [];

  //set parent
  if (parent && parent.nodeType === 1) {
    this.parent = parent;
  } else {
    this.parent = window.document.createElement('div');
    this.parent.style.margin = '0 auto';
    this.parent.style.width = width + 'px';
    this.parent.style.height = height + 'px';
    window.document.body.appendChild(this.parent);
  }

  //set width and height automatically
  if (!width || width <= 0) {
    width = window.innerWidth;
  }

  if (!height || height <= 0) {
    height = window.innerHeight;
  }

  this.canvas = window.document.createElement('canvas');

  //focusable canvas bugfix
  this.canvas.tabIndex = 1;

  this.ctx = this.canvas.getContext('2d');

  this.canvas.width = width;
  this.canvas.height = height;
  this.parent.appendChild(this.canvas);

  //hook mouse, keyboard, and keyboard events right away
  this.hookMouseEvents();
  this.hookKeyboardEvents();
  this.hookTouchEvents();

  this.boundHookRenderFunction = this.hookRender.bind(this);
  Object.seal(this);
}

Renderer.prototype.render = function render(args) {
  var i,
      len,
      child,
      props,
      type,
      cache,
      matrix = [1, 0, 0, 1, 0, 0],
      sinr,
      cosr,
      ctx = this.ctx,
      children = [],
      concat = children.concat;

  //flush the virtual stack

  this.fillStyleStack.splice(0, this.fillStyleStack.length);
  this.strokeStyleStack.splice(0, this.strokeStyleStack.length);
  this.lineStyleStack.splice(0, this.lineStyleStack.length);
  this.textStyleStack.splice(0, this.textStyleStack.length);
  this.shadowStyleStack.splice(0, this.shadowStyleStack.length);
  this.globalCompositeOperationStack.splice(0, this.globalCompositeOperationStack.length);
  this.globalAlphaStack.splice(0, this.globalAlphaStack.length);
  this.imageSmoothingEnabledStack.splice(0, this.imageSmoothingEnabledStack.length);

  for (i = 0, len = arguments.length; i < len; i++) {
    children.push(arguments[i]);
  }

  //loop over every child
  for (i = 0, len = children.length; i < len; i++) {
    child = children[i];

    //flattening algorithm
    if (child && child.constructor === Array) {
      children = concat.apply([], children);
      child = children[i];
      while (child && child.constructor === Array) {
        children = concat.apply([], children);
        child = children[i];
      }
      len = children.length;
    }

    //child must be truthy
    if (!child) {
      continue;
    }

    //set props and type object
    props = child.props;
    type = child.type;

    if (type === 'transform') {
      matrix[0] = this.transformStack[this.transformStackIndex - 6];
      matrix[1] = this.transformStack[this.transformStackIndex - 5];
      matrix[2] = this.transformStack[this.transformStackIndex - 4];
      matrix[3] = this.transformStack[this.transformStackIndex - 3];
      matrix[4] = this.transformStack[this.transformStackIndex - 2];
      matrix[5] = this.transformStack[this.transformStackIndex - 1];


      this.transformStackIndex += 6;
      if (this.transformStackIndex > this.transformStack.length) {
        this.increaseTransformStackSize();
      }

      this.transformStack[this.transformStackIndex - 6] = //d
        matrix[0] * props[0] + matrix[2] * props[1];
      this.transformStack[this.transformStackIndex - 5] = //b
        matrix[1] * props[0] + matrix[3] * props[1];
      this.transformStack[this.transformStackIndex - 4] = //c
        matrix[0] * props[2] + matrix[2] * props[3];
      this.transformStack[this.transformStackIndex - 3] = //d
        matrix[1] * props[2] + matrix[3] * props[3];
      this.transformStack[this.transformStackIndex - 2] = //e
        matrix[0] * props[4] + matrix[2] * props[5] + matrix[4];
      this.transformStack[this.transformStackIndex - 1] = //f
        matrix[1] * props[4] + matrix[3] * props[5] + matrix[5];

      ctx.setTransform(
        this.transformStack[this.transformStackIndex - 6],
        this.transformStack[this.transformStackIndex - 5],
        this.transformStack[this.transformStackIndex - 4],
        this.transformStack[this.transformStackIndex - 3],
        this.transformStack[this.transformStackIndex - 2],
        this.transformStack[this.transformStackIndex - 1]
      );

      continue;
    }

    if (type === 'setTransform') {
      this.transformStackIndex += 6;
      if (this.transformStackIndex > this.transformStack.length) {
        this.increaseTransformStackSize();
      }

      this.transformStack[this.transformStackIndex - 6] = props[0];//a
      this.transformStack[this.transformStackIndex - 5] = props[1];//b
      this.transformStack[this.transformStackIndex - 4] = props[2];//c
      this.transformStack[this.transformStackIndex - 3] = props[3];//d
      this.transformStack[this.transformStackIndex - 2] = props[4];//e
      this.transformStack[this.transformStackIndex - 1] = props[5];//f
      ctx.setTransform(props[0], props[1], props[2], props[3], props[4], props[5]);
      continue;
    }

    if (type === 'scale') {
      matrix[0] = this.transformStack[this.transformStackIndex - 6];
      matrix[1] = this.transformStack[this.transformStackIndex - 5];
      matrix[2] = this.transformStack[this.transformStackIndex - 4];
      matrix[3] = this.transformStack[this.transformStackIndex - 3];
      matrix[4] = this.transformStack[this.transformStackIndex - 2];
      matrix[5] = this.transformStack[this.transformStackIndex - 1];

      this.transformStackIndex += 6;
      if (this.transformStackIndex > this.transformStack.length) {
        this.increaseTransformStackSize();
      }

      this.transformStack[this.transformStackIndex - 6] = matrix[0] * props.x; //a
      this.transformStack[this.transformStackIndex - 5] = matrix[1] * props.x; //b
      this.transformStack[this.transformStackIndex - 4] = matrix[2] * props.y; //c
      this.transformStack[this.transformStackIndex - 3] = matrix[3] * props.y; //d
      this.transformStack[this.transformStackIndex - 2] = matrix[4]; //e
      this.transformStack[this.transformStackIndex - 1] = matrix[5]; //f

      ctx.setTransform(
        this.transformStack[this.transformStackIndex - 6],
        this.transformStack[this.transformStackIndex - 5],
        this.transformStack[this.transformStackIndex - 4],
        this.transformStack[this.transformStackIndex - 3],
        this.transformStack[this.transformStackIndex - 2],
        this.transformStack[this.transformStackIndex - 1]
      );

      continue;
    }

    if (type === 'translate') {
      matrix[0] = this.transformStack[this.transformStackIndex - 6];
      matrix[1] = this.transformStack[this.transformStackIndex - 5];
      matrix[2] = this.transformStack[this.transformStackIndex - 4];
      matrix[3] = this.transformStack[this.transformStackIndex - 3];
      matrix[4] = this.transformStack[this.transformStackIndex - 2];
      matrix[5] = this.transformStack[this.transformStackIndex - 1];

      this.transformStackIndex += 6;
      if (this.transformStackIndex > this.transformStack.length) {
        this.increaseTransformStackSize();
      }

      this.transformStack[this.transformStackIndex - 6] = matrix[0]; //a
      this.transformStack[this.transformStackIndex - 5] = matrix[1]; //b
      this.transformStack[this.transformStackIndex - 4] = matrix[2]; //c
      this.transformStack[this.transformStackIndex - 3] = matrix[3]; //d
      this.transformStack[this.transformStackIndex - 2] = matrix[4] + matrix[0] * props.x + matrix[2] * props.y; //e
      this.transformStack[this.transformStackIndex - 1] = matrix[5] + matrix[1] * props.x + matrix[3] * props.y; //f

      ctx.setTransform(
        this.transformStack[this.transformStackIndex - 6],
        this.transformStack[this.transformStackIndex - 5],
        this.transformStack[this.transformStackIndex - 4],
        this.transformStack[this.transformStackIndex - 3],
        this.transformStack[this.transformStackIndex - 2],
        this.transformStack[this.transformStackIndex - 1]
      );

      continue;
    }

    if (type === 'rotate') {
      matrix[0] = this.transformStack[this.transformStackIndex - 6];
      matrix[1] = this.transformStack[this.transformStackIndex - 5];
      matrix[2] = this.transformStack[this.transformStackIndex - 4];
      matrix[3] = this.transformStack[this.transformStackIndex - 3];
      matrix[4] = this.transformStack[this.transformStackIndex - 2];
      matrix[5] = this.transformStack[this.transformStackIndex - 1];
      cosr = Math.cos(props.r);
      sinr = Math.sin(props.r);

      this.transformStackIndex += 6;
      if (this.transformStackIndex > this.transformStack.length) {
        this.increaseTransformStackSize();
      }

      this.transformStack[this.transformStackIndex - 6] =
        matrix[0] * cosr + matrix[2] * sinr; //a
      this.transformStack[this.transformStackIndex - 5] =
        matrix[1] * cosr + matrix[3] * sinr; //b
      this.transformStack[this.transformStackIndex - 4] =
        matrix[0] * -sinr + matrix[2] * cosr; //c
      this.transformStack[this.transformStackIndex - 3] =
        matrix[1] * -sinr + matrix[3] * cosr; //d
      this.transformStack[this.transformStackIndex - 2] = matrix[4]; //e
      this.transformStack[this.transformStackIndex - 1] = matrix[5];//f

      ctx.setTransform(
        this.transformStack[this.transformStackIndex - 6],
        this.transformStack[this.transformStackIndex - 5],
        this.transformStack[this.transformStackIndex - 4],
        this.transformStack[this.transformStackIndex - 3],
        this.transformStack[this.transformStackIndex - 2],
        this.transformStack[this.transformStackIndex - 1]
      );

      continue;
    }

    if (type === 'restore') {
      this.transformStackIndex -= 6;
      matrix[0] = this.transformStack[this.transformStackIndex - 6];
      matrix[1] = this.transformStack[this.transformStackIndex - 5];
      matrix[2] = this.transformStack[this.transformStackIndex - 4];
      matrix[3] = this.transformStack[this.transformStackIndex - 3];
      matrix[4] = this.transformStack[this.transformStackIndex - 2];
      matrix[5] = this.transformStack[this.transformStackIndex - 1];

      ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);

      continue;
    }

    if (type === 'fillRect') {
      ctx.fillRect(props.x, props.y, props.width, props.height);

      continue;
    }

    if (type === 'strokeRect') {
      ctx.strokeRect(props.x, props.y, props.width, props.height);

      continue;
    }

    if (type === 'clearRect') {
      ctx.clearRect(props.x, props.y, props.width, props.height);

      continue;
    }

    if (type === 'rect') {
      ctx.rect(props.x, props.y, props.width, props.height);

      continue;
    }

    if (type === 'fillStyle') {
      this.fillStyleStack.push(ctx.fillStyle);
      ctx.fillStyle = props.value;

      continue;
    }

    if (type === 'strokeStyle') {
      this.strokeStyleStack.push(ctx.strokeStyle);
      ctx.strokeStyle = props.value;

      continue;
    }

    if (type === 'endFillStyle') {
      ctx.fillStyle = this.fillStyleStack.pop();

      continue;
    }

    if (type === 'endStrokeStyle') {
      ctx.strokeStyle = this.strokeStyleStack.pop();

      continue;
    }
    if (type === 'lineStyle') {
      this.lineStyleStack.push({
        lineWidth: ctx.lineWidth,
        lineCap: ctx.lineCap,
        lineJoin: ctx.lineJoin,
        miterLimit: ctx.miterLimit,
        lineDash: ctx.getLineDash(),
        lineDashOffset: ctx.lineDashOffset
      });

      if (props.lineWidth !== null) {
        ctx.lineWidth = props.lineWidth;
      }
      if (props.lineCap !== null) {
        ctx.lineCap = props.lineCap;
      }
      if (props.lineJoin !== null) {
        ctx.lineJoin = props.lineJoin;
      }
      if (props.miterLimit !== null) {
        ctx.miterLimit = props.miterLimit;
      }
      if (props.lineDash.length > 0) {
        ctx.setLineDash(props.lineDash);
      }
      if (props.lineDashOffset !== null) {
        ctx.lineDashOffset = props.lineDashOffset;
      }

      continue;
    }

    if (type === 'endLineStyle') {
      cache = this.lineStyleStack.pop();
      ctx.lineWidth = cache.lineWidth;
      ctx.lineCap = cache.lineCap;
      ctx.lineJoin = cache.lineJoin;
      ctx.miterLimit = cache.miterLimit;
      ctx.setLineDash(cache.lineDash);
      ctx.lineDashOffset = cache.lineDashOffset;

      continue;
    }

    if (type === 'textStyle') {
      this.textStyleStack.push({
        font: ctx.font,
        textAlign: ctx.textAlign,
        textBaseline: ctx.textBaseline,
        direction: ctx.direction
      });
      if (props.font !== null) {
        ctx.font = props.font;
      }
      if (props.textAlign !== null) {
        ctx.textAlign = props.textAlign;
      }
      if (props.textBaseline !== null) {
        ctx.textBaseline = props.textBaseline;
      }
      if (props.lineJoin !== null) {
        ctx.direction = props.direction;
      }

      continue;
    }

    if (type === 'endTextStyle') {
      cache = this.textStyleStack.pop();
      ctx.font = cache.font;
      ctx.textAlign = cache.textAlign;
      ctx.textBaseline = cache.textBaseline;
      ctx.direction = cache.direction;

      continue;
    }

    if (type === 'shadowStyle') {
      this.shadowStyleStack.push({
        shadowBlur: ctx.shadowBlur,
        shadowColor: ctx.shadowColor,
        shadowOffsetX: ctx.shadowOffsetX,
        shadowOffsetY: ctx.shadowOffsetY
      });
      if (props.shadowBlur !== null) {
        ctx.shadowBlur = props.shadowBlur;
      }
      if (props.shadowColor !== null) {
        ctx.shadowColor = props.shadowColor;
      }
      if (props.shadowOffsetX !== null) {
        ctx.shadowOffsetX = props.shadowOffsetX;
      }
      if (props.shadowOffsetY !== null) {
        ctx.shadowOffsetY = props.shadowOffsetY;
      }

      continue;
    }

    if (type === 'endShadowStyle') {
      cache = this.shadowStyleStack.pop();
      ctx.shadowBlur = cache.shadowBlur;
      ctx.shadowColor = cache.shadowColor;
      ctx.shadowOffsetX = cache.shadowOffsetX;
      ctx.shadowOffsetY = cache.shadowOffsetY;

      continue;
    }

    if (type === 'strokeText') {
      if (props.maxWidth) {
        ctx.strokeText(props.text, props.x, props.y, props.maxWidth);
        continue;
      }
      ctx.strokeText(props.text, props.x, props.y);
      continue;
    }

    if (type === 'fillText') {
      if (props.maxWidth) {
        ctx.fillText(props.text, props.x, props.y, props.maxWidth);
        continue;
      }
      ctx.fillText(props.text, props.x, props.y);
      continue;
    }

    if (type === 'text') {
      if (props.maxWidth !== 0) {
        if (props.fill) {
          ctx.fillText(props.text, props.x, props.y, props.maxWidth);
        }
        if (props.stroke) {
          ctx.strokeText(props.text, props.x, props.y, props.maxWidth);
        }

        continue;
      }
      if (props.fill) {
        ctx.fillText(props.text, props.x, props.y);
      }
      if (props.stroke) {
        ctx.strokeText(props.text, props.x, props.y);
      }

      continue;
    }



    if (type === 'drawImage') {
      if (!props.img) {
        continue;
      }
      cache = props.img.constructor === Img ? props.img.imageElement || new Image() : props.img;
      ctx.drawImage(cache || new Image(), props.dx, props.dy);
      continue;
    }

    if (type === 'drawImageSize') {
      if (!props.img) {
        continue;
      }
      cache = props.img.constructor === Img ? props.img.imageElement || new Image() : props.img;
      ctx.drawImage(cache, props.dx, props.dy, props.dWidth, props.dHeight);
      continue;
    }

    if (type === 'drawImageSource') {
      if (!props.img) {
        continue;
      }
      cache = props.img.constructor === Img ? props.img.imageElement || new Image() : props.img;
      ctx.drawImage(cache, props.sx, props.sy, props.sWidth, props.sHeight, props.dx, props.dy, props.dWidth, props.dHeight);
      continue;
    }

    if (type === 'fillImagePattern') {
      if (!props.img) {
        continue;
      }
      ctx.fillStyle = props.img.imagePatternRepeat;
      ctx.translate(props.dx, props.dy);
      ctx.fillRect(0, 0, props.dWidth, props.dHeight);
      ctx.restore();

      continue;
    }

    if (type === 'fillImage') {
      if (!props.img) {
        continue;
      }
      cache = props.img.imageElement;
      ctx.save();
      ctx.fillStyle = props.img.imagePattern;
      ctx.translate(props.dx, props.dy);
      ctx.fillRect(0, 0, cache.width, cache.height);
      ctx.restore();

      continue;
    }

    if (type === 'fillImageSize') {
      if (!props.img) {
        continue;
      }
      cache = props.img.imageElement;
      ctx.save();
      ctx.fillStyle = props.img.imagePattern;
      ctx.translate(props.dx, props.dy);
      ctx.scale(props.dWidth / cache.width, props.dHeight / cache.height);
      ctx.fillRect(0, 0, cache.width, cache.height);
      ctx.restore();

      continue;
    }

    if (type === 'fillImageSource') {
      if (!props.img) {
        continue;
      }
      ctx.save();
      ctx.fillStyle = props.img.imagePattern;
      ctx.translate(props.dx, props.dy);
      ctx.scale(props.dWidth / props.sWidth, props.dHeight / props.sHeight);
      ctx.translate(-props.sx, -props.sy);
      ctx.fillRect(props.sx, props.sy, props.sWidth, props.sHeight);
      ctx.restore();

      continue;
    }


    if (type === 'fillCanvas') {
      if (!props.img) {
        continue;
      }
      cache = props.img;
      ctx.save();
      ctx.fillStyle = cache.fillPattern;
      ctx.translate(props.dx, props.dy);
      ctx.fillRect(0, 0, cache.width, cache.height);
      ctx.restore();

      continue;
    }

    if (type === 'fillCanvasSize') {
      if (!props.img) {
        continue;
      }
      cache = props.img;
      ctx.save();
      ctx.fillStyle = cache.fillPattern;
      ctx.translate(props.dx, props.dy);
      ctx.scale(props.dWidth / cache.width, props.dHeight / cache.height);
      ctx.fillRect(0, 0, cache.width, cache.height);
      ctx.restore();

      continue;
    }

    if (type === 'fillCanvasSource') {
      if (!props.img) {
        continue;
      }
      ctx.save();
      ctx.fillStyle = props.img.fillPattern;
      ctx.translate(props.dx, props.dy);
      ctx.scale(props.dWidth / props.sWidth, props.dHeight / props.sHeight);
      ctx.translate(-props.sx, -props.sy);
      ctx.fillRect(props.sx, props.sy, props.sWidth, props.sHeight);
      ctx.restore();

      continue;
    }

    if (type === 'drawCanvas') {
      if (!props.img) {
        continue;
      }
      ctx.drawImage(props.img.renderer.canvas, props.dx, props.dy);
      continue;
    }

    if (type === 'drawCanvasSize') {
      if (!props.img) {
        continue;
      }
      ctx.drawImage(props.img.renderer.canvas, props.dx, props.dy, props.dWidth, props.dHeight);

      continue;
    }

    if (type === 'drawCanvasSource') {
      if (!props.img) {
        continue;
      }
      ctx.drawImage(props.img.renderer.canvas, props.sx, props.sy, props.sWidth, props.sHeight, props.dx, props.dy, props.dWidth, props.dHeight);

      continue;
    }

    if (type === 'strokeArc') {
      ctx.beginPath();
      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle);
      ctx.closePath();
      ctx.stroke();

      continue;
    }

    if (type === 'strokeArc-counterclockwise') {
      ctx.beginPath();
      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle, true);
      ctx.closePath();
      ctx.stroke();

      continue;
    }


    if (type === 'fillArc') {
      ctx.beginPath();
      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle);
      ctx.closePath();
      ctx.fill();

      continue;
    }

    if (type === 'fillArc-counterclockwise') {
      ctx.beginPath();
      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle, true);
      ctx.closePath();
      ctx.fill();

      continue;
    }

    if (type === 'moveTo') {
      ctx.moveTo(props.x, props.y);

      continue;
    }

    if (type === 'lineTo') {
      ctx.lineTo(props.x, props.y);

      continue;
    }

    if (type === 'bezierCurveTo') {
      ctx.bezierCurveTo(props.cp1x, props.cp1y, props.cp2x, props.cp2y, props.x, props.y);

      continue;
    }

    if (type === 'quadraticCurveTo') {
      ctx.quadraticCurveTo(props.cpx, props.cpy, props.x, props.y);

      continue;
    }

    if (type === 'anticlockwise-arc') {
      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle, true);

      continue;
    }

    if (type === 'arc') {
      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle);
      continue;
    }

    if (type === 'full-arc') {
      ctx.arc(props.x, props.y, props.r, 0, this.pi2);

      continue;
    }

    if (type === 'quick-arc') {
      ctx.arc(0, 0, props.r, 0, this.pi2);

      continue;
    }

    if (type === 'arcTo') {
      ctx.arcTo(props.x1, props.y1, props.x2, props.y2, props.r);

      continue;
    }

    if (type === 'anticlockwise-ellipse') {
      this.save();
      this.translate(props.x, props.y);
      this.rotate(props.rotation);
      this.scale(props.radiusX, props.radiusY);
      this.arc(0, 0, 1, props.startAngle, props.endAngle, true);
      this.restore();

      continue;
    }

    if (type === 'ellipse') {
      this.save();
      this.translate(props.x, props.y);
      this.rotate(props.rotation);
      this.scale(props.radiusX, props.radiusY);
      this.arc(0, 0, 1, props.startAngle, props.endAngle);
      this.restore();

      continue;
    }

    if (type === 'full-ellipse') {
      this.save();
      this.translate(props.x, props.y);
      this.rotate(props.rotation);
      this.scale(props.radiusX, props.radiusY);
      this.arc(0, 0, 1, 0, this.pi2);
      this.restore();

      continue;
    }

    if (type === 'quick-ellipse') {
      this.save();
      this.translate(props.x, props.y);
      this.scale(props.radiusX, props.radiusY);
      this.arc(0, 0, 1, 0, this.pi2);
      this.restore();

      continue;
    }

    if (type === 'globalCompositeOperation') {
      this.globalCompositeOperationStack.push(ctx.globalCompositeOperation);
      ctx.globalCompositeOperation = props.value;

      continue;
    }

    if (type === 'endGlobalCompositeOperation') {
      ctx.globalCompositeOperation = this.globalCompositeOperationStack.pop();

      continue;
    }

    if (type === 'fill') {
      ctx.fill();

      continue;
    }

    if (type === 'stroke') {
      ctx.stroke();

      continue;
    }

    if (type === 'beginClip') {
      ctx.save();
      ctx.beginPath();

      continue;
    }

    if (type === 'clip') {
      ctx.clip();

      continue;
    }

    if (type === 'endClip') {
      ctx.restore();

      continue;
    }

    if (type === 'beginPath') {
      ctx.beginPath();

      continue;
    }

    if (type === 'closePath') {
      ctx.closePath();

      continue;
    }

    if (type === 'globalAlpha') {
      this.globalAlphaStack.push(ctx.globalAlpha);
      ctx.globalAlpha *= props.value;

      continue;
    }

    if (type === 'endGlobalAlpha') {
      ctx.globalAlpha = this.globalAlphaStack.pop();

      continue;
    }

    if (type === 'hitRegion') {
      matrix[0] = this.transformStack[this.transformStackIndex - 6];
      matrix[1] = this.transformStack[this.transformStackIndex - 5];
      matrix[2] = this.transformStack[this.transformStackIndex - 4];
      matrix[3] = this.transformStack[this.transformStackIndex - 3];
      matrix[4] = this.transformStack[this.transformStackIndex - 2];
      matrix[5] = this.transformStack[this.transformStackIndex - 1];
      cache = {
        id: props.id,
        points: transformPoints(props.points, matrix)
      };
      this.mouseRegions.push(cache);
      this.touchRegions.push(cache);

      continue;
    }

    if (type === 'imageSmoothingEnabled') {
      this.imageSmoothingEnabledStack.push(ctx.imageSmoothingEnabled);
      ctx.imageSmoothingEnabled = props.value;

      continue;
    }

    if (type === 'endImageSmoothingEnabled') {
      ctx.imageSmoothingEnabled = this.imageSmoothingEnabledStack.pop();
      continue;
    }
  }

  return this.applyStyles();
};

Renderer.create = function create(width, height, parent, worker) {
  if (arguments.length > 2) {
    return new Renderer(width, height, parent, worker);
  }
  if (arguments.length === 2) {
    return new Renderer(width, height);
  }
  return new Renderer();
};


Renderer.prototype.resize = function(width, height) {
  //only resize if the sizes are different, because it clears the canvas
  if (this.canvas.width.toString() !== width.toString()) {
    this.canvas.width = width;
    if (this.parent !== document.body) {
      this.parent.style.width = width + "px";
    }
  }
  if (this.canvas.height.toString() !== height.toString()) {
    this.canvas.height = height;
    if (this.parent !== document.body) {
      this.parent.style.height = height + "px";
    }
  }
};

Renderer.prototype.toImage = function toImage() {
  var Img = require('./Img');
  var img = new Img();
  img.src = this.canvas.toDataURL('image/png');
  return img;
};


Renderer.prototype.hookRender = function hookRender() {

  //If the client has sent a 'ready' command and a tree exists
  if (this.isReady) {
    //fire the mouse event again if it wasn't run
    if (this.lastMouseEvent && !this.ranMouseEvent) {
      this.mouseMove(this.lastMouseEvent);
    }

    if (this.lastTouchEvent && !this.ranTouchEvent) {
      this.touchEvent(this.lastMouseEvent);
    }

    this.fireFrame();

  }

  return window.requestAnimationFrame(this.boundHookRenderFunction);
};

Renderer.prototype.hookMouseEvents = function hookMouseEvents() {
  //whenever the mouse moves, report the position
  window.document.addEventListener('mousemove', this.mouseMove.bind(this));

  //only report mousedown on canvas
  this.canvas.addEventListener('mousedown', this.mouseDown.bind(this));

  //mouse up can happen anywhere
  return window.document.addEventListener('mouseup', this.mouseUp.bind(this));
};

Renderer.prototype.hookTouchEvents = function hookTouchEvents() {

  return ['touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(function(evt) {
    return window.document.addEventListener(evt, this.touchEvent.bind(this));
  }, this);
};

Renderer.prototype.touchEvent = function touchEvent(evt) {
  var rect = this.canvas.getBoundingClientRect(),
      touchRegions = this.touchRegions.slice(),
      mousePoint = [0,0],
      region;

  var previousIds = this.touchData.ids.splice(0, this.touchData.ids.length),
    previousTouches = this.touchData.touches.splice(0, this.touchData.touches.length),
    touchPoint;

  for(var i = 0; i < evt.touches.length; i++) {
    var touch = evt.touches.item(i);
    var index = previousIds.indexOf(touch.identifier);

    touchPoint = index === -1 ? { x: 0, y: 0, activeRegions: [], id: touch.identifier, touched: true, held: false } : previousTouches[index];
    touchPoint.touched = index === -1;
    touchPoint.held = !touchPoint.touched;

    touchPoint.x = touch.clientX - rect.left;
    touchPoint.y = touch.clientY - rect.top;
    this.touchData.touches.push(touchPoint);
    this.touchData.ids.push(touchPoint.identifier);

    mousePoint[0] = touchPoint.x;
    mousePoint[1] = touchPoint.y;

    touchPoint.activeRegions.splice(0, touchPoint.activeRegions.length);

    for(var j = 0; j < this.mouseRegions.length; i++) {
      region = touchRegions[j];
      if (pointInPolygon(mousePoint, region.points)) {
        touchPoint.activeRegions.push(region.id);
        touchRegions.splice(touchRegions.indexOf(region), 1);
        j -= 1;
      }
    }
  }


  this.lastTouchEvent = evt;
  this.ranTouchEvent = true;


  evt.preventDefault();
  this.emit('touch', this.touchData);
  return false;
};

Renderer.prototype.mouseMove = function mouseMove(evt) {
  //get bounding rectangle
  var rect = this.canvas.getBoundingClientRect(),
      mousePoint = [0,0],
      region;
  this.lastMouseEvent = evt;
  this.ranMouseEvent = true;

  mousePoint[0] = evt.clientX - rect.left;
  mousePoint[1] = evt.clientY - rect.top;

  for(var i = 0; i < this.mouseRegions.length; i++) {
    region = this.mouseRegions[i];
    if (pointInPolygon(mousePoint, region.points)) {
      this.activeRegions.push(region.id);
      this.mouseRegions.splice(this.mouseRegions.indexOf(region), 1);
      i -= 1;
    }
  }

  this.mouseData.x = mousePoint[0];
  this.mouseData.y = mousePoint[1];

  //new state is down, last state is up

  this.mouseData.clicked = this.mouseState === 'down' && this.mouseData.state === 'up';

  this.mouseData.state = this.mouseState;
  this.mouseData.activeRegions = this.activeRegions;

  this.emit('mouse', this.mouseData);
  //default event stuff
  evt.preventDefault();
  return false;
};

Renderer.prototype.mouseDown = function mouseMove(evt) {
  //set the mouseState down
  this.mouseState = 'down';
  this.canvas.focus();
  //defer to mouseMove
  return this.mouseMove(evt);
};

Renderer.prototype.mouseUp = function mouseMove(evt) {
  //set the mouse state
  this.mouseState = 'up';
  //defer to mouse move
  return this.mouseMove(evt);
};

Renderer.prototype.hookKeyboardEvents = function hookKeyboardEvents() {

  //every code in keycode.code needs to be on keyData
  for (var name in keycode.code) {
    if (keycode.code.hasOwnProperty(name)) {
      this.keyData[name] = "up";
    }
  }

  //keydown should only happen ON the canvas
  this.canvas.addEventListener('keydown', this.keyDown.bind(this));

  //but keyup should be captured everywhere
  return window.document.addEventListener('keyup', this.keyUp.bind(this));
};

Renderer.prototype.keyChange = function keyChange(evt) {
  this.emit('key', this.keyData);
  evt.preventDefault();
  return false;
};

Renderer.prototype.keyDown = function keyDown(evt) {
  this.keyData[keycode(evt.keyCode)] = "down";
  return this.keyChange(evt);
};

Renderer.prototype.keyUp = function keyUp(evt) {
  this.keyData[keycode(evt.keyCode)] = "up";
  return this.keyChange(evt);
};

Renderer.prototype.fireFrame = function() {
  this.mouseRegions.splice(0, this.mouseRegions.length);
  this.touchRegions.splice(0, this.touchRegions.length);

  this.emit('frame', {});
  this.activeRegions.splice(0, this.activeRegions.length);
  this.ranMouseEvent = false;
  return this;
};

Renderer.prototype.style = function style() {
  var children = [],
      styles = [],
      concat = children.concat,
      len,
      i,
      child,
      name;
  for(i = 0, len = arguments.length; i < len; i++) {
    children.push(arguments[i]);
  }

  for (i = 0, len = children.length; i < len; i++) {
    child = children[i];
    if (child && child.constructor === Array) {
      children = concat.apply([], children);
      child = children[i];
      while(child && child.constructor === Array) {
        children = concat.apply([], children);
        child = children[i];
      }
      len = children.length;
    }
    if (child) {
      styles.push(child);
    }
  }
  for (i = 0; i < styles.length; i++) {
    this.styleQueue.push(styles[i]);
  }
  return this;
};

Renderer.prototype.applyStyles = function applyStyles() {
  var styleVal, value;
  for(var i = 0; i < this.styleQueue.length; i++) {
    styleVal = this.styleQueue[i];
    for(var name in styleVal) {
      if (styleVal.hasOwnProperty(name)) {
        this.canvas.style[name] = styleVal[name];
      }
    }
  }
  this.styleQueue.splice(0, this.styleQueue.length);
  return this;
};

Renderer.prototype.ready = function ready() {
  this.isReady = true;
  this.fireFrame();
  return window.requestAnimationFrame(this.hookRender.bind(this));
};

Renderer.prototype.measureText = function measureText(font, text) {
  var oldFont = this.ctx.font,
      result;

  this.ctx.font = font;
  result = this.ctx.measureText(text);
  this.ctx.font = oldFont;
  return result;
};

Renderer.prototype.increaseTransformStackSize = function increaseTransformStackSize() {
  var cache = this.transformStack;
  this.transformStack = new Float64Array(this.transformStack.length + 600); //add 100 more
  this.transformStack.set(cache);
  return this;
};

Object.defineProperty(Renderer.prototype, 'height', {
  get: function() {
    return this.canvas.width;
  },
  enumerable: true,
  configurable: false
});
Object.defineProperty(Renderer.prototype, 'width', {
  get: function() {
    return this.canvas.width;
  },
  enumerable: true,
  configurable: false
});
Object.seal(Renderer);
Object.seal(Renderer.prototype);
module.exports = Renderer;

},{"./Img":11,"./createLinearGradient":24,"./createRadialGradient":25,"./transformPoints":64,"events":2,"keycode":8,"point-in-polygon":9,"util":7}],14:[function(require,module,exports){
//jshint node: true

'use strict';
var Instruction = require('./Instruction');

function addColorStop(offset, color) {
  return new Instruction('addColorStop', { offset: offset, color: color });
}

module.exports = addColorStop;
},{"./Instruction":12}],15:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function arc(x, y, r, startAngle, endAngle, anticlockwise) {
  if (arguments.length > 5) {
    return new Instruction(anticlockwise ? 'anticlockwise-arc' : 'arc', { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle });
  }
  if (arguments.length === 5) {
    return new Instruction('arc', { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle });
  }
  if (arguments.length >= 3) {
    return new Instruction('full-arc', { x: x, y: y, r: r});
  }
  if (arguments.length >= 1) {
    return new Instruction('quick-arc', { r: x });
  }
  
  return new Instruction('quick-arc', { r: 1 });
}

module.exports = arc;
},{"./Instruction":12}],16:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function arcTo(x1, y1, x2, y2, r) {
  return new Instruction('arcTo', { x1: x1, y1: y1, x2: x2, y2: y2, r: r });
}

module.exports = arcTo;

},{"./Instruction":12}],17:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function beginPath() {
  return new Instruction('beginPath');
}
module.exports = beginPath;
},{"./Instruction":12}],18:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
  return new Instruction('bezierCurveTo', {
    cp1x: cp1x, 
    cp1y: cp1y, 
    cp2x: cp2x, 
    cp2y: cp2y, 
    x: x, 
    y: y
  });
}

module.exports = bezierCurveTo;
},{"./Instruction":12}],19:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function fillRect(x, y, width, height) {
  if (arguments.length > 2) {
    return new Instruction("clearRect", { x: x, y: y, width: width, height: height });
  } else {
    return new Instruction("clearRect", { x: 0, y: 0, width: x, height: y });
  }
}

module.exports = fillRect;
},{"./Instruction":12}],20:[function(require,module,exports){
//jshint node: true
'use strict';

var Instruction = require('./Instruction');

function clip(path, children) {
  var result = [new Instruction('beginClip'), path, new Instruction('clip')];

  for(var i = 1; i < arguments.length; i++) {
    result.push(arguments[i]);
  }

  result.push(new Instruction('endClip'));
  return result;
}

module.exports = clip;

},{"./Instruction":12}],21:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function clipPath() {
  return new Instruction('clipPath');
}
module.exports = clipPath;
},{"./Instruction":12}],22:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function closePath() {
  return new Instruction('closePath');
}
module.exports = closePath;
},{"./Instruction":12}],23:[function(require,module,exports){
'use strict';
var concat = [].concat;

function createClass() {
  var args = [], i;
  for(i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }

  for(i = 0; i < args.length; i++) {
    while (args[i] && args[i].constructor === Array) {
      args = concat.apply([], args);
    }
    if (args[i] && args[i].type === 'placeholder') {
       // remove the placeholder
      break;
    }
  }
  return (function() {
    var start = args, end = start.splice(i + 1, args.length);
    start.pop();
    return function createdClass() {
      var children = [], i;
      for(i = 0; i < arguments.length; i++) {
        children.push(arguments[i]);
      }
      return [
        start, children, end
      ];
    };
  }());
}

module.exports = createClass;

},{}],24:[function(require,module,exports){
//jshint node: true, browser: true, worker: true
'use strict';

function createLinearGradient(x0, y0, x1, y1, children) {
  var ctx = window.document.createElement('canvas').getContext('2d'),
    grd = ctx.createLinearGradient(x0, y0, x1, y1);
  for(var i = 0; i < children.length; i++) {
    var colorStop = children[i];
    grd.addColorStop(colorStop.props.offset, colorStop.props.color);
  }
  return grd;
}


module.exports = createLinearGradient;

},{}],25:[function(require,module,exports){
//jshint node: true, browser: true, worker: true
'use strict';

function createRadialGradient(x0, y0, r0, x1, y1, r1, children) {
  var ctx = window.document.createElement('canvas').getContext('2d'),
    grd = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
  for(var i = 0; i < children.length; i++) {
    var colorStop = children[i];
    grd.addColorStop(colorStop.props.offset, colorStop.props.color);
  }
  return grd;
}

module.exports = createRadialGradient;

},{}],26:[function(require,module,exports){
'use strict';

function createRegularPolygon(radius, position, sides) {
  radius = +radius || 1;
  position[0] = +position[0] || 0;
  position[1] = +position[1] || 0;
  sides = +sides || 3;
  var polygon = [];
  for(var i = 0; i < sides; i++) {
    polygon.push([
      position[0] + radius * Math.cos(Math.PI * 2 * i / sides),
      position[1] + radius * Math.sin(Math.PI * 2 * i / sides)
    ]);
  }
  return polygon;
}

module.exports = createRegularPolygon;

},{}],27:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function drawCanvas(canvas, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
  if (arguments.length === 9) {
    return new Instruction('drawCanvasSource', {
      img: canvas,
      sx: sx,
      sy: sy,
      sWidth: sWidth,
      sHeight: sHeight,
      dx: dx,
      dy: dy,
      dWidth: dWidth,
      dHeight: dHeight
    });
  }

  if (arguments.length >= 5) {
    return new Instruction('drawCanvasSize', {
      img: canvas,
      dx: sx,
      dy: sy,
      dWidth: sWidth,
      dHeight: sHeight
    });
  }

  if (arguments.length >= 3) {
    return new Instruction('drawCanvas', {
      img: canvas,
      dx: sx,
      dy: sy
    });
  }

  return new Instruction('drawCanvas', {
    img: canvas,
    dx: 0,
    dy: 0
  });
}

module.exports = drawCanvas;

},{"./Instruction":12}],28:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
  if (arguments.length === 9) {
    return new Instruction('drawImageSource', {
      img: img,
      sx: sx,
      sy: sy,
      sWidth: sWidth,
      sHeight: sHeight,
      dx: dx,
      dy: dy,
      dWidth: dWidth,
      dHeight: dHeight
    });
  }

  if (arguments.length >= 5) {
    return new Instruction('drawImageSize', {
      img: img,
      dx: sx,
      dy: sy,
      dWidth: sWidth,
      dHeight: sHeight
    });
  }

  if (arguments.length >= 3) {
    return new Instruction('drawImage', {
      img: img,
      dx: sx,
      dy: sy
    });
  }

  return new Instruction('drawImage', {
    img: img,
    dx: 0,
    dy: 0
  });
}

module.exports = drawImage;

},{"./Instruction":12}],29:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
  if (arguments.length > 7) {
    return new Instruction(anticlockwise ? 'anticlockwise-ellipse' : 'ellipse', { x: x, y: y, radiusX: radiusX, radiusY: radiusY, startAngle: startAngle, endAngle: endAngle });
  }
  
  if (arguments.length === 7) {
    return new Instruction('ellipse', { x: x, y: y, radiusX: radiusX, radiusY: radiusY, rotation: rotation, startAngle: startAngle, endAngle: endAngle });
  }
  if (arguments.length >= 5) {
    return new Instruction('full-ellipse', { x: x, y: y, radiusX: radiusX, radiusY: radiusY, rotation: rotation });
  }
  if (arguments.length === 4) {
    return new Instruction('quick-ellipse', { x: x, y: y, radiusX: radiusX, radiusY: radiusY });
  }
  return new Instruction('quick-ellipse', { x: 0, y: 0, radiusX: x, radiusY: y });
}

module.exports = ellipse;
},{"./Instruction":12}],30:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function fill() {
  return new Instruction('fill');
}

module.exports = fill;
},{"./Instruction":12}],31:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction'),
    pi2 = Math.PI * 2;

function fillArc(x, y, r, startAngle, endAngle, counterclockwise) {
  if (arguments.length >= 6 && counterclockwise) {
    return new Instruction("fillArc-counterclockwise", { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle });
    
  }
  if (arguments.length > 3) {
    return new Instruction("fillArc", { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle });
  } 
  if (arguments.length > 1){
    return new Instruction("fillArc", { x: x, y: y, r: r, startAngle: 0, endAngle: pi2 });
  }
  return new Instruction("fillArc",  { x: 0, y: 0, r: x, startAngle: 0, endAngle: pi2 });
}

module.exports = fillArc;
},{"./Instruction":12}],32:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function fillImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
  if (arguments.length === 9) {
    return new Instruction('fillCanvasSource', {
      img: img,
      sx: sx,
      sy: sy,
      sWidth: sWidth,
      sHeight: sHeight,
      dx: dx,
      dy: dy,
      dWidth: dWidth,
      dHeight: dHeight
    });
  }

  if (arguments.length >= 5) {
    return new Instruction('fillCanvasSize', {
      img: img,
      dx: sx,
      dy: sy,
      dWidth: sWidth,
      dHeight: sHeight
    });
  }

  if (arguments.length >= 3) {
    return new Instruction('fillCanvas', {
      img: img,
      dx: sx,
      dy: sy
    });
  }

  return new Instruction('fillCanvas', {
    img: img,
    dx: 0,
    dy: 0
  });
}

module.exports = fillImage;

},{"./Instruction":12}],33:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function fillImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
  if (arguments.length === 9) {
    return new Instruction('fillImageSource', {
      img: img,
      sx: sx,
      sy: sy,
      sWidth: sWidth,
      sHeight: sHeight,
      dx: dx,
      dy: dy,
      dWidth: dWidth,
      dHeight: dHeight
    });
  }

  if (arguments.length >= 5) {
    return new Instruction('fillImageSize', {
      img: img,
      dx: sx,
      dy: sy,
      dWidth: sWidth,
      dHeight: sHeight
    });
  }

  if (arguments.length >= 3) {
    return new Instruction('fillImage', {
      img: img,
      dx: sx,
      dy: sy
    });
  }

  return new Instruction('fillImage', {
    img: img,
    dx: 0,
    dy: 0
  });
}

module.exports = fillImage;

},{"./Instruction":12}],34:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function fillImagePattern(img, dx, dy, dWidth, dHeight) {
  if (arguments.length >= 5) {
    return new Instruction('fillImagePattern', {
      img: img,
      dx: dx,
      dy: dy,
      dWidth: dWidth,
      dHeight: dHeight
    });
  }

  if (arguments.length >= 3) {
    return new Instruction('fillImagePattern', {
      img: img,
      dx: 0,
      dy: 0,
      dWidth: dx,
      dHeight: dy
    });
  }

  return new Instruction('fillImagePattern', {
    img: img,
    dx: 0,
    dy: 0,
    dWidth: 0,
    dHeight: 0
  });
}

module.exports = fillImagePattern;

},{"./Instruction":12}],35:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function fillRect(x, y, width, height) {
  if (arguments.length >= 4) {
    return new Instruction("fillRect", { x: x, y: y, width: width, height: height });
  } else {
    return new Instruction("fillRect", { x: 0, y: 0, width: x, height: y });
  }
}

module.exports = fillRect;
},{"./Instruction":12}],36:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function fillStyle(value, children) {
  var result = [new Instruction('fillStyle', { value: value })];

  for(var i = 1; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  result.push(new Instruction('endFillStyle'));
  return result;
}

module.exports = fillStyle;

},{"./Instruction":12}],37:[function(require,module,exports){
var Instruction = require('./Instruction');

module.exports = function fillText(text, x, y, maxWidth) {
  if (arguments.length < 4) {
    maxWidth = null;
  }
  if (arguments.length < 3) {
    x = 0;
    y = 0;
  }
  return new Instruction('fillText', {
    text: text,
    x: x,
    y: y,
    maxWidth: maxWidth
  });
};

},{"./Instruction":12}],38:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function globalAlpha(alpha, children) {
  var result = [new Instruction('globalAlpha', { value: alpha })];
  for(var i = 1; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  result.push(new Instruction('endGlobalAlpha'));
  return result;
}

module.exports = globalAlpha;
},{"./Instruction":12}],39:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function globalCompositeOperation(operationType, children) {
  var result = [new Instruction('globalCompositeOperation', { value: operationType })];
  if (arguments.length === 0) {
    return [];
  }
  
  for (var i = 1; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  result.push(new Instruction('endGlobalCompositeOperation'));
  return result;
}

module.exports = globalCompositeOperation;
},{"./Instruction":12}],40:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction'),
    hitRegion = require('./hitRegion');


function hitRect(id, x, y, width, height) {
  if (arguments.length <= 3) {
    width = x;
    height = y;
    x = 0;
    y = 0;
  }
  
  var points = [
    [x, y],
    [x, y + height],
    [x + width, y + height],
    [x + width, y]
  ];
  
  return hitRegion(id, points);
}

module.exports = hitRect;
},{"./Instruction":12,"./hitRegion":41}],41:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');


function hitRegion(id, points) {
  return new Instruction('hitRegion', {
    id: id,
    points: points
  });
}

module.exports = hitRegion;
},{"./Instruction":12}],42:[function(require,module,exports){
'use strict';
var Instruction = require('./Instruction');

module.exports = function imageSmoothingEnabled(val, children) {
  children = [];
  for(var i = 1; i < arguments.length; i++) {
    children.push(arguments[i]);
  }
  return [new Instruction('imageSmoothingEnabled', { value: Boolean(val) })].concat(children).concat(new Instruction('endImageSmoothingEnabled'));
};

},{"./Instruction":12}],43:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function lineStyle(value, children) {
  
  value = value || {};
  var result = {
    lineWidth: null,
    lineCap: null,
    lineJoin: null,
    miterLimit: null,
    lineDash: [],
    lineDashOffset: null
  };
  
  if (typeof value.lineWidth !== 'undefined') {
    result.lineWidth = value.lineWidth;
  }
  if (typeof value.lineCap !== 'undefined') {
    result.lineCap = value.lineCap;
  }
  if (typeof value.lineJoin !== 'undefined') {
    result.lineJoin = value.lineJoin;
  }
  if (typeof value.miterLimit !== 'undefined') {
    result.miterLimit = value.miterLimit;
  }
  if (typeof value.lineDash !== 'undefined') {
    result.lineDash = value.lineDash;
  }
  if (typeof value.lineDashOffset !== 'undefined') {
    result.lineDashOffset = value.lineDashOffset;
  }
  var tree = [new Instruction('lineStyle', result)];
  for(var i = 1; i < arguments.length; i++) {
    tree.push(arguments[i]);
  }
  tree.push(new Instruction('endLineStyle'));
  return tree;
}

module.exports = lineStyle;
},{"./Instruction":12}],44:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function lineTo(x, y) {
  if (arguments.length === 0) {
    return new Instruction('lineTo', { x: 0, y: 0});
  }
  return new Instruction('lineTo', { x: x, y: y });
}

module.exports = lineTo;
},{"./Instruction":12}],45:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function moveTo(x, y) {
  if (arguments.length === 0) {
    return new Instruction('moveTo', { x: 0, y: 0});
  }
  return new Instruction('moveTo', { x: x, y: y });
}

module.exports = moveTo;
},{"./Instruction":12}],46:[function(require,module,exports){
'use strict';
var moveTo = require('./moveTo'), lineTo = require('./lineTo');
function moveToLineTo(point, index) {
  return index === 0 ? moveTo(point[0], point[1]) : lineTo(point[0], point[1]);
}

module.exports = moveToLineTo;

},{"./lineTo":44,"./moveTo":45}],47:[function(require,module,exports){
//jshint node: true
'use strict';

var beginPath = require('./beginPath'),
    closePath = require('./closePath');

function path(children) {
  var result = [beginPath()];
  for(var i = 0; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  result.push(closePath());
  return result;
}

module.exports = path;
},{"./beginPath":17,"./closePath":22}],48:[function(require,module,exports){
'use strict';
var Instruction = require('./Instruction');
module.exports = function placeHolder() {
  return new Instruction('placeholder');
};

},{"./Instruction":12}],49:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function quadraticCurveTo(cpx, cpy, x, y) {
  return new Instruction('quadraticCurveTo', {
    cpx: cpx, 
    cpy: cpy, 
    x: x, 
    y: y
  });
}

module.exports = quadraticCurveTo;
},{"./Instruction":12}],50:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function rect(x, y, width, height) {
  if (arguments.length > 2) {
    return new Instruction("rect", { x: x, y: y, width: width, height: height });
  } else {
    return new Instruction("rect", { x: 0, y: 0, width: x, height: y });
  }
}

module.exports = rect;
},{"./Instruction":12}],51:[function(require,module,exports){
'use strict';
var setTransform = require('./setTransform');

module.exports = function resetTransform() {
  var args = [];
  for(var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return setTransform([1, 0, 0, 1, 0, 0], args);
};

},{"./setTransform":54}],52:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function rotate(r, children) {
  r = +r;
  var result = [new Instruction('rotate', { r: r })];
  for(var i = 1; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  result.push(new Instruction('restore'));
  return result;
}

module.exports = rotate;
},{"./Instruction":12}],53:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function scale(x, y, children) {
  var i = 2;
  if (typeof y !== 'number') {
    y = x;
    i = 1;
  }
  children = children || [];
  
  var result = [new Instruction('scale', { x: x, y: y })],
      child;
  for (; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  result.push(new Instruction('restore'));
  return result;
}

module.exports = scale;
},{"./Instruction":12}],54:[function(require,module,exports){
'use strict';
var Instruction = require('./Instruction');

module.exports = function(matrix, children) {

  var result = [new Instruction('setTransform', [
    matrix[0],
    matrix[1],
    matrix[2],
    matrix[3],
    matrix[4],
    matrix[5]
  ])];
  for(var i = 1; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  result.push(new Instruction('restore'));
  return result;
};

},{"./Instruction":12}],55:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function shadowStyle(value, children) {
  value = value || {};
  var result = {
    shadowBlur: null,
    shadowColor: null,
    shadowOffsetX: null,
    shadowOffsetY: null
  };
  
  if (typeof value.shadowBlur !== 'undefined') {
    result.shadowBlur = value.shadowBlur; 
  }
  if (typeof value.shadowColor !== 'undefined') {
    result.shadowColor = value.shadowColor; 
  }
  if (typeof value.shadowOffsetX !== 'undefined') {
    result.shadowOffsetX = value.shadowOffsetX; 
  }
  if (typeof value.direction !== 'undefined') {
    result.shadowOffsetY = value.shadowOffsetY; 
  }
  
  var tree = [new Instruction('shadowStyle', value)];
  for (var i = 1; i < arguments.length; i++) {
    tree.push(arguments[i]);
  }
  tree.push(new Instruction('endShadowStyle'));
  
  return tree;
}

module.exports = shadowStyle;
},{"./Instruction":12}],56:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function stroke() {
  return new Instruction('stroke');
}

module.exports = stroke;
},{"./Instruction":12}],57:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction'),
    pi2 = Math.PI * 2;

function strokeArc(x, y, r, startAngle, endAngle, counterclockwise) {
  if (arguments.length >= 6 && counterclockwise) {
    return new Instruction("strokeArc-counterclockwise", { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle });
  }
  if (arguments.length > 3) {
    return new Instruction("strokeArc", { x: x, y: y, r: r, startAngle: startAngle, endAngle: endAngle });
  } 
  if (arguments.length > 1){
    return new Instruction("strokeArc", { x: x, y: y, r: r, startAngle: 0, endAngle: pi2 });
  }
  return new Instruction("strokeArc",  { x: 0, y: 0, r: x, startAngle: 0, endAngle: pi2 });
}

module.exports = strokeArc;
},{"./Instruction":12}],58:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function strokeRect(x, y, width, height) {
  if (arguments.length > 2) {
    return new Instruction("strokeRect", { x: x, y: y, width: width, height: height });
  } else {
    return new Instruction("strokeRect", { x: 0, y: 0, width: x, height: y });
  }
}

module.exports = strokeRect;
},{"./Instruction":12}],59:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function fillStyle(value, children) {
  var result = [ new Instruction('strokeStyle', { value: value }) ];
  for(var i = 1; i < arguments.length; i++) {
    result.push(arguments[i]);
  }
  result.push(new Instruction('endStrokeStyle'));
  return result;
}

module.exports = fillStyle;

},{"./Instruction":12}],60:[function(require,module,exports){
var Instruction = require('./Instruction');

module.exports = function strokeText(text, x, y, maxWidth) {
  if (arguments.length < 4) {
    maxWidth = null;
  }
  if (arguments.length < 3) {
    x = 0;
    y = 0;
  }
  return new Instruction('strokeText', {
    text: text,
    x: x,
    y: y,
    maxWidth: maxWidth
  });
};

},{"./Instruction":12}],61:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');
function text(str, x, y, fill, stroke, maxWidth) {
  if (arguments.length === 6) {
    return new Instruction('text', {
      x: x,
      y: y,
      fill: fill,
      stroke: stroke,
      text: str,
      maxWidth: maxWidth
    });
  }
  if (arguments.length === 5) {
    return new Instruction('text', {
      x: x,
      y: y,
      fill: fill,
      stroke: stroke,
      text: str,
      maxWidth: 0
    });
  }
  
  if (arguments.length === 4) {
    return new Instruction('text', {
      x: x,
      y: y,
      fill: fill,
      stroke: false,
      text: str,
      maxWidth: 0
    });
  }
  
  if (arguments.length === 3) {
    return new Instruction('text', {
      x: x,
      y: y,
      fill: true,
      stroke: false,
      text: str,
      maxWidth: 0
    });
  }
  
  return new Instruction('text', {
    x: 0,
    y: 0,
    fill: true,
    stroke: false,
    text: str,
    maxWidth: 0
  });
}

module.exports = text;
},{"./Instruction":12}],62:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function textStyle(value, children) {
  value = value || {};
  var result = {
    font: null,
    textAlign: null,
    textBaseline: null,
    direction: null
  };
  
  if (typeof value.font !== 'undefined') {
    result.font = value.font; 
  }
  if (typeof value.textAlign !== 'undefined') {
    result.textAlign = value.textAlign; 
  }
  if (typeof value.textBaseline !== 'undefined') {
    result.textBaseline = value.textBaseline; 
  }
  if (typeof value.direction !== 'undefined') {
    result.direction = value.direction; 
  }
  var tree = [new Instruction('textStyle', value)];
  for(var i = 1; i < arguments.length; i++) {
    tree.push(arguments[i]);
  }
  tree.push(new Instruction('endTextStyle'));
  return tree;
}

module.exports = textStyle;
},{"./Instruction":12}],63:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function transform(values, children) {

  var transformResult = [
    new Instruction('transform',[
      values[0],
      values[1],
      values[2],
      values[3],
      values[4],
      values[5]
    ])
  ];
  for(var i = 1, len = arguments.length; i < len; i++) {
    transformResult.push(arguments[i]);
  }
  transformResult.push(new Instruction('restore'));

  return transformResult;
}


module.exports = transform;

},{"./Instruction":12}],64:[function(require,module,exports){
//jshint node: true
'use strict';

function transformPoints(points, matrix) {
  var result = [],
      len = points.length,
      point;

  for(var i = 0; i < len; i++) {
    point = points[i];
    result.push([
      matrix[0] * point[0] + matrix[2] * point[1] + matrix[4],
      matrix[1] * point[0] + matrix[3] * point[1] + matrix[5]
    ]);
  }
  return result;
}

module.exports = transformPoints;
},{}],65:[function(require,module,exports){
//jshint node: true
'use strict';
var Instruction = require('./Instruction');

function translate(x, y, children) {
  
  var result = [new Instruction('translate', { x: x, y: y })];
  var val;
  for (var i = 2; i < arguments.length; i++) {
    val = arguments[i];
    if (Array.isArray(val)) {
      result = result.concat(val);
      continue;
    }
    result.push(arguments[i]);
  }
  
  result.push(new Instruction('restore'));
  return result;
}

module.exports = translate;
},{"./Instruction":12}]},{},[1])(1)
});