(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pasteImage = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = require('./scripts');

},{"./scripts":4}],2:[function(require,module,exports){
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
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
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
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
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
  } else if (listeners) {
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

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
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
'use strict';

// This code is heavily based on Joel Basada's great work at
// http://joelb.me/blog/2011/code-snippet-accessing-clipboard-images-with-javascript/

var inherits = require('inherits'),
  events = require('events');

var PasteImage = function () {
  this._initialized = false;
  this._wrapEmitterFns();
};

inherits(PasteImage, events.EventEmitter);

// We want to wrap emitter functions so that we can ensure that we have initialized the document
// listeners before listening to any paste events
PasteImage.prototype._wrapEmitterFns = function () {
  var self = this,
    fns = ['on', 'once'];

  fns.forEach(function (fn) {
    PasteImage.prototype[fn] = function () {
      if (!self._initialized) {
        self._init();
      }

      return events.EventEmitter.prototype[fn].apply(self, arguments);
    };
  });
};

PasteImage.prototype._clipboardSupported = function () {
  return window.Clipboard;
};

PasteImage.prototype._pasteCatcherFocus = function () {
  this._pasteCatcher.focus();
};

PasteImage.prototype._listenForClick = function () {
  var self = this;

  // Make sure it is always in focus. We ignore code coverage for this area as there does not appear
  // to be an easy cross-browser way of triggering a click event on the document
  //
  /* istanbul ignore next */
  document.addEventListener('click', function () {
    self._pasteCatcherFocus();
  });
};

PasteImage.prototype._createPasteCatcherIfNeeded = function () {
  // We start by checking if the browser supports the Clipboard object. If not, we need to create a
  // contenteditable element that catches all pasted data
  if (!this._clipboardSupported()) {
    this._pasteCatcher = document.createElement('div');

    // Firefox allows images to be pasted into contenteditable elements
    this._pasteCatcher.setAttribute('contenteditable', '');

    // We can hide the element and append it to the body,
    this._pasteCatcher.style.opacity = 0;

    // Use absolute positioning so that the paste catcher doesn't take up extra space. Note: we
    // cannot set style.display='none' as this will disable the functionality.
    this._pasteCatcher.style.position = 'absolute';

    document.body.appendChild(this._pasteCatcher);

    this._pasteCatcher.focus();
    this._listenForClick();
  }
};

PasteImage.prototype._listenForPaste = function () {
  var self = this;

  // Add the paste event listener. We ignore code coverage for this area as there does not appear to
  // be a cross-browser way of triggering a pase event
  //
  /* istanbul ignore next */
  window.addEventListener('paste', function (e) {
    self._pasteHandler(e);
  });
};

PasteImage.prototype._init = function () {
  this._createPasteCatcherIfNeeded();
  this._listenForPaste();
  this._initialized = true;
};

PasteImage.prototype._checkInputOnNextTick = function () {
  var self = this;
  // This is a cheap trick to make sure we read the data AFTER it has been inserted.
  setTimeout(function () {
    self._checkInput();
  }, 1);
};

PasteImage.prototype._pasteHandler = function (e) {
  // Starting to paste image
  this.emit('pasting-image', e);

  // We need to check if event.clipboardData is supported (Chrome)
  if (e.clipboardData && e.clipboardData.items) {
    // Get the items from the clipboard
    var items = e.clipboardData.items;

    // Loop through all items, looking for any kind of image
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        // We need to represent the image as a file
        var blob = items[i].getAsFile();

        // Use a URL or webkitURL (whichever is available to the browser) to create a temporary URL
        // to the object
        var URLObj = this._getURLObj();
        var source = URLObj.createObjectURL(blob);

        // The URL can then be used as the source of an image
        this._createImage(source);
      }
    }
    // If we can't handle clipboard data directly (Firefox), we need to read what was pasted from
    // the contenteditable element
  } else {
    this._checkInputOnNextTick();
  }
};

PasteImage.prototype._getURLObj = function () {
  return window.URL || window.webkitURL;
};

// Parse the input in the paste catcher element
PasteImage.prototype._checkInput = function () {
  // Store the pasted content in a variable
  var child = this._pasteCatcher.childNodes[0];

  // Clear the inner html to make sure we're always getting the latest inserted content
  this._pasteCatcher.innerHTML = '';

  if (child) {
    // If the user pastes an image, the src attribute will represent the image as a base64 encoded
    // string.
    if (child.tagName === 'IMG') {
      this._createImage(child.src);
    }
  }
};

// Creates a new image from a given source
PasteImage.prototype._createImage = function (source) {
  var self = this,
    pastedImage = new Image();

  pastedImage.onload = function () {
    // You now have the image!
    self.emit('paste-image', pastedImage);
  };
  pastedImage.src = source;
};

module.exports = new PasteImage();

},{"events":2,"inherits":3}]},{},[1])(1)
});