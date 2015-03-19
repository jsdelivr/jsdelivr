(function() {
  "use strict";
  var MaxmertkitEvent, MaxmertkitHelpers, MaxmertkitReactor, isInDOM, _eventCallbackId, _eventCallbacks, _eventHandlers, _id, _reactor, _reactorEvents;

  _eventHandlers = [];

  _eventCallbacks = [];

  _reactorEvents = [];

  _eventCallbackId = 0;

  _id = 0;

  isInDOM = function(el) {
    var html;
    html = document.body.parentNode;
    while (el) {
      if (el === html) {
        return true;
      }
      el = el.parentNode;
    }
    return false;
  };

  MaxmertkitEvent = (function() {
    function MaxmertkitEvent(name) {
      this.name = name;
      this.callbacks = new Array();
    }

    MaxmertkitEvent.prototype.registerCallback = function(callback, el, id) {
      return this.callbacks.push({
        id: id,
        el: el,
        callback: callback
      });
    };

    MaxmertkitEvent.prototype.removeCallback = function(id) {
      var cb, index, _i, _len, _ref, _results;
      _ref = this.callbacks;
      _results = [];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        cb = _ref[index];
        if ((cb != null) && cb.id === id) {
          _results.push(this.callbacks.splice(index, 1));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return MaxmertkitEvent;

  })();

  MaxmertkitReactor = (function() {
    function MaxmertkitReactor() {}

    MaxmertkitReactor.prototype.events = _reactorEvents;

    MaxmertkitReactor.prototype.registerEvent = function(eventName) {
      var event;
      event = new MaxmertkitEvent(eventName);
      if (this.events[eventName] == null) {
        return this.events[eventName] = event;
      }
    };

    MaxmertkitReactor.prototype.dispatchEvent = function(eventName, eventArgs) {
      var callback, index, _i, _len, _ref, _results;
      _ref = this.events[eventName].callbacks;
      _results = [];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        callback = _ref[index];
        if (isInDOM(callback.el)) {
          _results.push(callback.callback(eventArgs));
        } else {
          _results.push(this.events[eventName].removeCallback(callback.id));
        }
      }
      return _results;
    };

    MaxmertkitReactor.prototype.removeEventListener = function(eventName, callbackId) {
      if (this.events[eventName] != null) {
        return this.events[eventName].removeCallback(callbackId);
      }
    };

    MaxmertkitReactor.prototype.addEventListener = function(eventName, callback, el, immediately) {
      var eventId, i, timer;
      eventId = _eventCallbackId++;
      if (this.events[eventName] != null) {
        this.events[eventName].registerCallback(callback, el, eventId);
      } else {
        i = 0;
        timer = setInterval((function(_this) {
          return function() {
            if (i < 10) {
              if (_this.events[eventName] != null) {
                if ((immediately != null) && immediately) {
                  callback();
                }
                _this.events[eventName].registerCallback(callback, el, eventId);
                clearInterval(timer);
                return timer = null;
              } else {
                return i++;
              }
            } else {
              clearInterval(timer);
              return timer = null;
            }
          };
        })(this), 1000);
      }
      return eventId;
    };

    return MaxmertkitReactor;

  })();

  _reactor = new MaxmertkitReactor();

  MaxmertkitHelpers = (function() {
    MaxmertkitHelpers.prototype._id = null;

    MaxmertkitHelpers.prototype._instances = new Array();

    MaxmertkitHelpers.prototype.reactor = _reactor;

    function MaxmertkitHelpers(el, options) {
      this.el = el;
      this.options = options;
      this._pushInstance();
    }

    MaxmertkitHelpers.prototype.destroy = function() {
      this._popInstance();
      this._destroy(this);
      return true;
    };

    MaxmertkitHelpers.prototype._delete = function(object) {
      var key, value, _results;
      _results = [];
      for (key in object) {
        value = object[key];
        _results.push(delete object[key]);
      }
      return _results;
    };

    MaxmertkitHelpers.prototype._destroy = function(object) {
      this._delete(object);
      object = null;
      return true;
    };

    MaxmertkitHelpers.prototype._pushInstance = function() {
      this._id = _id++;
      return this._instances.push(this);
    };

    MaxmertkitHelpers.prototype._popInstance = function() {
      var index, instance, _i, _len, _ref, _results;
      _ref = this._instances;
      _results = [];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        instance = _ref[index];
        if ((instance != null ? instance._id : void 0) === this._id) {
          this._instances.splice(index, 1);
        }
        _results.push(delete this);
      }
      return _results;
    };

    MaxmertkitHelpers.prototype._setOptions = function(options) {
      return console.warning("Maxmertkit Helpers. There is no standart setOptions function.");
    };

    MaxmertkitHelpers.prototype._extend = function(object, properties) {
      var key, val;
      for (key in properties) {
        val = properties[key];
        object[key] = val;
      }
      return object;
    };

    MaxmertkitHelpers.prototype._merge = function(options, overrides) {
      return this._extend(this._extend({}, options), overrides);
    };

    MaxmertkitHelpers.prototype._selfish = function() {
      var index, instance, _i, _len, _ref, _results;
      _ref = this._instances;
      _results = [];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        instance = _ref[index];
        if (this._id !== instance._id) {
          _results.push((typeof instance.close === "function" ? instance.close() : void 0) || (typeof instance.deactivate === "function" ? instance.deactivate() : void 0));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    MaxmertkitHelpers.prototype._isMobile = function() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
    };

    MaxmertkitHelpers.prototype._removeEventListener = function(el, eventName, handler) {
      if (el.removeEventListener) {
        el.removeEventListener(eventName, handler, false);
      } else {
        el.detachEvent("on" + eventName, handler);
      }
    };

    MaxmertkitHelpers.prototype._addEventListener = function(el, eventName, handler) {
      if (el.addEventListener) {
        el.addEventListener(eventName, handler, false);
      } else {
        el.attachEvent("on" + eventName, function() {
          handler.call(el);
        });
      }
    };

    MaxmertkitHelpers.prototype._isInDOM = isInDOM;

    MaxmertkitHelpers.prototype._hasClass = function(className, el) {
      el = el || this.el;
      if (el.classList) {
        return el.classList.contains(className);
      } else {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
      }
    };

    MaxmertkitHelpers.prototype._addClass = function(className, el) {
      var classes, classin, _i, _len, _results;
      el = el || this.el;
      if (el.classList != null) {
        classes = className.split(" ");
        _results = [];
        for (_i = 0, _len = classes.length; _i < _len; _i++) {
          classin = classes[_i];
          _results.push(el.classList.add(classin));
        }
        return _results;
      } else {
        return el.className += ' ' + className;
      }
    };

    MaxmertkitHelpers.prototype._removeClass = function(className, el) {
      var classes, classin, _i, _len, _results;
      el = el || this.el;
      if (el.classList) {
        classes = className.split(" ");
        _results = [];
        for (_i = 0, _len = classes.length; _i < _len; _i++) {
          classin = classes[_i];
          _results.push(el.classList.remove(classin));
        }
        return _results;
      } else {
        return el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
      }
    };

    MaxmertkitHelpers.prototype._closest = function(selector, el) {
      var matchesSelector;
      el = el || this.el;
      matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
      while (el) {
        if (matchesSelector.bind(el)(selector)) {
          return el;
        } else {
          el = el.parentElement;
        }
      }
      return false;
    };

    MaxmertkitHelpers.prototype._outerWidth = function(el) {
      var style, width;
      el = el || this.el;
      width = el.offsetWidth;
      try {
        style = el.currentStyle || getComputedStyle(el);
      } catch (_error) {}
      if (style) {
        if ((style.paddingLeft != null) && style.paddingLeft !== '') {
          width += parseInt(style.paddingLeft);
        }
        if ((style.paddingRight != null) && style.paddingRight !== '') {
          width += parseInt(style.paddingRight);
        }
      }
      return width;
    };

    MaxmertkitHelpers.prototype._outerHeight = function(el) {
      var height, style;
      el = el || this.el;
      height = el.offsetHeight;
      try {
        style = el.currentStyle || getComputedStyle(el);
      } catch (_error) {}
      if (style != null) {
        if ((style.paddingTop != null) && style.paddingTop !== '') {
          height += parseInt(style.paddingTop);
        }
        if ((style.paddingBottom != null) && style.paddingBottom !== '') {
          height += parseInt(style.paddingBottom);
        }
      }
      return height;
    };

    MaxmertkitHelpers.prototype._getPosition = function(el) {
      var curleft, curtop, style;
      el = el || this.el;
      curleft = curtop = 0;
      if (el.offsetParent) {
        while (true) {

          /* FIXME: Not sure if it needed to calculate with style margin */
          try {
            style = el.currentStyle || getComputedStyle(el);
          } catch (_error) {}
          curleft += el.offsetLeft;
          curtop += el.offsetTop;
          if (!(el = el.offsetParent)) {
            break;
          }
        }
      }
      return {
        left: curleft,
        top: curtop
      };
    };

    MaxmertkitHelpers.prototype._getContainer = function(el) {
      var parent, style;
      parent = el || this.el;
      try {
        style = getComputedStyle(parent);
      } catch (_error) {}
      if (style == null) {
        return parent;
      }
      if (/(relative|fixed)/.test(style['position'])) {
        return parent;
      }
      while ((parent != null) && (parent = parent.parentNode)) {
        try {
          style = getComputedStyle(parent);
        } catch (_error) {}
        if (style == null) {
          return parent;
        }
        if (/(relative|fixed)/.test(style['position'])) {
          return parent;
        }
      }
      return document;
    };

    MaxmertkitHelpers.prototype._getScrollContainer = function(el) {
      var parent, style;
      parent = el || this.el;
      try {
        style = getComputedStyle(parent);
      } catch (_error) {}
      if (style == null) {
        return parent;
      }
      if (/(auto|scroll)/.test(style['overflow'] + style['overflow-y'] + style['overflow-x']) && parent.nodeName !== 'BODY') {
        return parent;
      }
      while (parent = parent.parentNode) {
        try {
          style = getComputedStyle(parent);
        } catch (_error) {}
        if (style == null) {
          return parent;
        }
        if (/(auto|scroll)/.test(style['overflow'] + style['overflow-y'] + style['overflow-x']) && parent.nodeName !== 'BODY') {
          return parent;
        }
      }
      return document;
    };

    MaxmertkitHelpers.prototype._setCSSTransform = function(el, transform) {
      el = el || this.el;
      el.style.webkitTransform = transform;
      el.style.mozTransform = transform;
      el.style.msTransform = transform;
      el.style.oTransform = transform;
      return el.style.transform = transform;
    };

    MaxmertkitHelpers.prototype._setCSSFilter = function(el, filter) {
      el = el || this.el;
      el.style.webkitFilter = filter;
      el.style.mozFilter = filter;
      el.style.msFilter = filter;
      el.style.oFilter = filter;
      return el.style.filter = filter;
    };

    MaxmertkitHelpers.prototype._setCSSOpacity = function(el, opacity) {
      el = el || this.el;
      el.style.webkitOpacity = opacity;
      el.style.mozOpacity = opacity;
      el.style.msOpacity = opacity;
      el.style.oOpacity = opacity;
      return el.style.opacity = opacity;
    };

    return MaxmertkitHelpers;

  })();

  (function() {
    var lastTime, vendors, x;
    lastTime = 0;
    vendors = ["ms", "moz", "webkit", "o"];
    x = 0;
    while (x < vendors.length && !window.requestAnimationFrame) {
      window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
      window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
      ++x;
    }
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
        var currTime, id, timeToCall;
        currTime = new Date().getTime();
        timeToCall = Math.max(0, 16 - (currTime - lastTime));
        id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
    }
  })();

  Function.prototype.bind = Function.prototype.bind || function(d) {
    var a, b, c;
    a = Array.prototype.splice.call(arguments, 1);
    c = this;
    b = function() {
      var e;
      e = a.concat(Array.prototype.splice.call(arguments, 0));
      if (!(this instanceof b)) {
        return c.apply(d, e);
      }
      c.apply(this, e);
    };
    b.prototype = c.prototype;
    return b;
  };

  window['MaxmertkitHelpers'] = MaxmertkitHelpers;

  window['MaxmertkitReactor'] = MaxmertkitReactor;

  window['MaxmertkitEvent'] = MaxmertkitEvent;

}).call(this);

(function() {
  "use strict";
  var MaxmertkitHelpers, Modal, _activate, _backdropClick, _beforeactivate, _beforedeactivate, _deactivate, _id, _instances, _name, _pushStart, _pushStop,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _name = "modal";

  _instances = [];

  _id = 0;

  MaxmertkitHelpers = window['MaxmertkitHelpers'];

  Modal = (function(_super) {
    __extends(Modal, _super);

    Modal.prototype._name = _name;

    Modal.prototype._instances = _instances;

    Modal.prototype.enabled = true;

    Modal.prototype.opened = false;

    function Modal(el, options) {
      var _options;
      this.el = el;
      this.options = options;
      _options = {
        toggle: this.el.getAttribute('data-toggle') || _name,
        target: this.el.getAttribute('data-target') || null,
        dialog: this.el.getAttribute('data-dialog') || ".-dialog",
        event: this.el.getAttribute('data-event') || "click",
        eventClose: this.el.getAttribute('data-event-close') || "click",
        backdrop: this.el.getAttribute('data-backdrop') || false,
        push: this.el.getAttribute('data-push') || false,
        autoOpen: this.el.getAttribute('data-autoopen') || false,
        selfish: this.el.getAttribute('data-selfish') || true,
        beforeactive: function() {},
        onactive: function() {},
        failactive: function() {},
        beforedeactive: function() {},
        ondeactive: function() {},
        faildeactive: function() {}
      };
      this.options = this._merge(_options, this.options);
      this.target = document.querySelector(this.options.target);
      this.reactor.registerEvent("initialize." + _name);
      this.reactor.registerEvent("open." + _name);
      this.reactor.registerEvent("close." + _name);
      this.dialog = this.target.querySelector(this.options.dialog);
      this.closers = document.querySelectorAll("[data-dismiss='" + this.options.target + "']");
      this.closerF = this.close.bind(this);
      this.clickerF = this.clicker.bind(this);
      this.backdropClickF = _backdropClick.bind(this);
      this._setOptions(this.options);
      Modal.__super__.constructor.call(this, this.el, this.options);
      this.reactor.dispatchEvent("initialize." + _name);
      if (this.options.autoOpen) {
        this.open();
      }
    }

    Modal.prototype.destroy = function() {
      var closer, _i, _len, _ref;
      this._removeEventListener(this.el, this.options.event, this.clickerF);
      _ref = this.closers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        closer = _ref[_i];
        this._removeEventListener(closer, this.options.eventClose, this.closerF(this));
      }
      this.el.data["kitModal"] = null;
      return Modal.__super__.destroy.apply(this, arguments);
    };

    Modal.prototype._setOptions = function(options) {
      var closer, key, value, _i, _len, _ref;
      for (key in options) {
        value = options[key];
        if (this.options[key] == null) {
          return console.error("Maxmertkit Modal. You're trying to set unpropriate option – " + key);
        }
        switch (key) {
          case 'event':
            this._removeEventListener(this.el, this.options.event, this.clickerF);
            this._addEventListener(this.el, value, this.clickerF);
            break;
          case 'eventClose':
            _ref = this.closers;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              closer = _ref[_i];
              this._removeEventListener(closer, this.options.eventClose, this.closerF);
              this._addEventListener(closer, value, this.closerF);
            }
            break;
          case 'backdrop':
            if (this.options.backdrop) {
              this._removeEventListener(this.el, "click", this.backdropClickF);
            }
            if (value) {
              this._addEventListener(this.el, "click", this.backdropClickF);
            }
            break;
          case 'push':
            if (value) {
              this.push = document.querySelectorAll(value);
            } else {
              this.push = false;
            }
        }
        this.options[key] = value;
        if (typeof value === 'function') {
          this[key] = value;
        }
      }
    };

    Modal.prototype.clicker = function() {
      if (!this.opened) {
        return this.open();
      } else {
        return this.close();
      }
    };

    Modal.prototype.open = function() {
      return this.activate();
    };

    Modal.prototype.close = function() {
      return this.deactivate();
    };

    Modal.prototype.activate = function() {
      if (this.enabled && !this.opened) {
        return _beforeactivate.call(this);
      }
    };

    Modal.prototype.deactivate = function() {
      if (this.enabled && this.opened) {
        return _beforedeactivate.call(this);
      }
    };

    Modal.prototype.disable = function() {
      return this.enabled = false;
    };

    Modal.prototype.enable = function() {
      return this.enabled = true;
    };

    return Modal;

  })(MaxmertkitHelpers);

  _pushStart = function() {
    if (this.push) {
      this._addClass('-start--', this.push);
      return this._removeClass('-stop--', this.push);
    }
  };

  _pushStop = function() {
    if (this.push) {
      this._addClass('-stop--', this.push);
      this._removeClass('-start--', this.push);
      if (this.push && (this.push.style != null) && (this.push.style['-webkit-overflow-scrolling'] != null)) {
        return this.push.style['-webkit-overflow-scrolling'] = 'auto';
      }
    }
  };

  _backdropClick = function(event) {
    if (this._hasClass('-modal', event.target) && this.opened) {
      return this.close();
    }
  };

  _beforeactivate = function() {
    var deferred;
    if (this.options.selfish) {
      this._selfish();
    }
    if (this.beforeactive != null) {
      try {
        deferred = this.beforeactive.call(this.el);
        return deferred.done((function(_this) {
          return function() {
            return _activate.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            var _ref;
            return (_ref = _this.faildeactive) != null ? _ref.call(_this.el) : void 0;
          };
        })(this));
      } catch (_error) {
        return _activate.call(this);
      }
    } else {
      return _activate.call(this);
    }
  };

  _activate = function() {
    var _ref;
    if (this.push) {
      this._addClass('_perspective_', document.body);
    }
    this._addClass('_no-scroll_', document.body);
    this.target.style.display = 'table';
    this._addClass('_visible_ -start--', this.target);
    this._addClass('_visible_ -start--', this.dialog);
    _pushStart.call(this);
    if ((_ref = this.onactive) != null) {
      _ref.call(this.el);
    }
    this.reactor.dispatchEvent("open." + _name);
    return this.opened = true;
  };

  _beforedeactivate = function() {
    var deferred;
    if (this.beforedeactive != null) {
      try {
        deferred = this.beforedeactive.call(this.el);
        return deferred.done((function(_this) {
          return function() {
            return _deactivate.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            var _ref;
            return (_ref = _this.faildeactive) != null ? _ref.call(_this.el) : void 0;
          };
        })(this));
      } catch (_error) {
        return _deactivate.call(this);
      }
    } else {
      return _deactivate.call(this);
    }
  };

  _deactivate = function() {
    var _ref;
    this._addClass('-stop--', this.target);
    this._addClass('-stop--', this.dialog);
    _pushStop.call(this);
    setTimeout((function(_this) {
      return function() {
        _this._removeClass('_visible_ -start-- -stop--', _this.target);
        _this._removeClass('_visible_ -start-- -stop--', _this.dialog);
        _this._removeClass('_no-scroll_', document.body);
        if (_this.push) {
          _this._removeClass('_perspective_', document.body);
        }
        return _this.target.style.display = 'none';
      };
    })(this), 1000);
    this.reactor.dispatchEvent("close." + _name);
    if ((_ref = this.ondeactive) != null) {
      _ref.call(this.el);
    }
    return this.opened = false;
  };

  window['Modal'] = Modal;

  window['mkitModal'] = function(options) {
    var result;
    result = null;
    if (this.data == null) {
      this.data = {};
    }
    if (!this.data['kitModal']) {
      result = new Modal(this, options);
      this.data['kitModal'] = result;
    } else {
      if (typeof options === 'object') {
        this.data['kitModal']._setOptions(options);
      } else {
        if (typeof options === "string" && options.charAt(0) !== "_") {
          this.data['kitModal'][options];
        }
      }
      result = this.data['kitModal'];
    }
    return result;
  };

  if (typeof Element !== "undefined" && Element !== null) {
    Element.prototype.modal = window['mkitModal'];
  }

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    $.fn[_name] = function(options) {
      return this.each(function() {
        return window['mkitModal'].call(this, options);
      });
    };
  }

}).call(this);

(function() {
  "use strict";
  var MaxmertkitHelpers, Skyline, _activate, _beforeactivate, _beforedeactivate, _deactivate, _getWindowSize, _id, _instances, _lastScrollY, _name, _onResize, _onScroll, _requestResize, _requestTick, _resizing, _spy, _windowSize,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _name = "skyline";

  _instances = [];

  _id = 0;

  _lastScrollY = 0;

  _windowSize = 0;

  MaxmertkitHelpers = window['MaxmertkitHelpers'];

  Skyline = (function(_super) {
    __extends(Skyline, _super);

    Skyline.prototype._name = _name;

    Skyline.prototype._instances = _instances;

    Skyline.prototype.started = false;

    Skyline.prototype.active = false;

    function Skyline(el, options) {
      var _options;
      this.el = el;
      this.options = options;
      _options = {
        spy: this.el.getAttribute('data-spy') || _name,
        offset: this.el.getAttribute('data-offset') || 5,
        delay: this.el.getAttribute('data-delay') || 300,
        onMobile: this.el.getAttribute('data-on-mobile') || false,
        beforeactive: function() {},
        onactive: function() {},
        failactive: function() {},
        beforedeactive: function() {},
        ondeactive: function() {},
        faildeactive: function() {}
      };
      this.options = this._merge(_options, this.options);
      this.ticking = false;
      this.resizingTick = false;
      this.scroller = this._getScrollContainer(this.el);
      this.spy = _spy.bind(this);
      this.onScroll = _onScroll.bind(this);
      this.onResize = _onResize.bind(this);
      this.resizing = _resizing.bind(this);
      this._setOptions(this.options);
      Skyline.__super__.constructor.call(this, this.el, this.options);
      this._addEventListener(window, 'resize', this.onResize);
      this.reactor.registerEvent("initialize." + _name);
      this.reactor.registerEvent("start." + _name);
      this.reactor.registerEvent("stop." + _name);
      this.reactor.dispatchEvent("initialize." + _name);
      if (!(!this.options.onMobile && _getWindowSize().width < 992)) {
        this.start(this.deactivate);
      }
    }

    Skyline.prototype.destroy = function() {
      _deactivate.call(this);
      this.el.data["kitSkyline"] = null;
      return Skyline.__super__.destroy.apply(this, arguments);
    };

    Skyline.prototype._setOptions = function(options) {
      var key, value;
      for (key in options) {
        value = options[key];
        if (this.options[key] == null) {
          return console.error("Maxmertkit Skyline. You're trying to set unpropriate option – " + key);
        }
        this.options[key] = value;
        if (typeof value === 'function') {
          this[key] = value;
        }
      }
    };

    Skyline.prototype.start = function(cb) {
      if (!this.started) {
        return _beforeactivate.call(this, cb);
      }
    };

    Skyline.prototype.stop = function(cb) {
      if (this.started) {
        return _beforedeactivate.call(this, cb);
      }
    };

    Skyline.prototype.activate = function() {
      var delay;
      if (typeof this.options.delay === 'function') {
        delay = this.options.delay();
      } else {
        delay = this.options.delay;
      }
      return this.timer = setTimeout((function(_this) {
        return function() {
          _this._addClass('-start--');
          _this._removeClass('-stop--');
          return _this.active = true;
        };
      })(this), delay);
    };

    Skyline.prototype.deactivate = function() {
      if (this.timer != null) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this._removeClass('-start-- _active_');
      this._addClass('-stop--');
      return this.active = false;
    };

    Skyline.prototype.refresh = function() {
      _windowSize = _getWindowSize();
      return this.spyParams = {
        offset: this._getPosition(this.el),
        height: this._outerHeight()
      };
    };

    return Skyline;

  })(MaxmertkitHelpers);

  _onResize = function() {
    return _requestResize.call(this);
  };

  _requestResize = function() {
    if (!this.resizingTick) {
      if (this.resizing != null) {
        requestAnimationFrame(this.resizing);
        return this.resizingTick = true;
      }
    }
  };

  _resizing = function() {
    this.refresh();
    if (!this.options.onMobile) {
      if (_getWindowSize().width < 992) {
        this.stop(this.activate);
      } else {
        this.start();
      }
    }
    return this.resizingTick = false;
  };

  _getWindowSize = function() {
    var clientHeight, clientWidth;
    clientWidth = 0;
    clientHeight = 0;
    if (typeof window.innerWidth === "number") {
      clientWidth = window.innerWidth;
      clientHeight = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
      clientWidth = document.documentElement.clientWidth;
      clientHeight = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
      clientWidth = document.body.clientWidth;
      clientHeight = document.body.clientHeight;
    }
    return {
      width: clientWidth,
      height: clientHeight
    };
  };

  _onScroll = function(event) {
    _lastScrollY = event.target.nodeName === '#document' ? (document.documentElement && document.documentElement.scrollTop) || event.target.body.scrollTop : event.target.scrollTop;
    return _requestTick.call(this);
  };

  _requestTick = function() {
    if (!this.ticking) {
      requestAnimationFrame(this.spy);
      return this.ticking = true;
    }
  };

  _spy = function() {
    var _ref;
    if ((this.spyParams.offset.top - _windowSize.height <= (_ref = _lastScrollY + this.options.offset) && _ref <= this.spyParams.offset.top + this.spyParams.height)) {
      if (!this.active) {
        this.activate();
      }
    } else {
      if (this.active) {
        this.deactivate();
      }
    }
    return this.ticking = false;
  };

  _beforeactivate = function(cb) {
    var deferred;
    if (this.beforeactive != null) {
      try {
        deferred = this.beforeactive.call(this.el);
        return deferred.done((function(_this) {
          return function() {
            return _activate.call(_this, cb);
          };
        })(this)).fail((function(_this) {
          return function() {
            var _ref;
            return (_ref = _this.failactive) != null ? _ref.call(_this.el) : void 0;
          };
        })(this));
      } catch (_error) {
        return _activate.call(this, cb);
      }
    } else {
      return _activate.call(this, cb);
    }
  };

  _activate = function(cb) {
    var _ref;
    this.refresh();
    this._addEventListener(this.scroller, 'scroll', this.onScroll);
    if ((_ref = this.onactive) != null) {
      _ref.call(this.el);
    }
    this.reactor.dispatchEvent("start." + _name);
    this.started = true;
    if (cb != null) {
      cb.call(this);
    }
    return setTimeout((function(_this) {
      return function() {
        return _this.refresh();
      };
    })(this), 100);
  };

  _beforedeactivate = function(cb) {
    var deferred;
    if (this.beforedeactive != null) {
      try {
        deferred = this.beforedeactive.call(this.el);
        return deferred.done((function(_this) {
          return function() {
            return _deactivate.call(_this, cb);
          };
        })(this)).fail((function(_this) {
          return function() {
            var _ref;
            return (_ref = _this.faildeactive) != null ? _ref.call(_this.el) : void 0;
          };
        })(this));
      } catch (_error) {
        return _deactivate.call(this, cb);
      }
    } else {
      return _deactivate.call(this, cb);
    }
  };

  _deactivate = function(cb) {
    var _ref;
    this._removeEventListener(this.scroller, 'scroll', this.onScroll);
    this.reactor.dispatchEvent("stop." + _name);
    if ((_ref = this.ondeactive) != null) {
      _ref.call(this.el);
    }
    this.started = false;
    if (cb != null) {
      return cb.call(this);
    }
  };

  window['Skyline'] = Skyline;

  window['mkitSkyline'] = function(options) {
    var result;
    result = null;
    if (this.data == null) {
      this.data = {};
    }
    if (!this.data['kitSkyline']) {
      result = new Skyline(this, options);
      this.data['kitSkyline'] = result;
    } else {
      if (typeof options === 'object') {
        this.data['kitSkyline']._setOptions(options);
      } else {
        if (typeof options === "string" && options.charAt(0) !== "_") {
          this.data['kitSkyline'][options];
        }
      }
      result = this.data['kitSkyline'];
    }
    return result;
  };

  if (typeof Element !== "undefined" && Element !== null) {
    Element.prototype.skyline = window['mkitSkyline'];
  }

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    $.fn[_name] = function(options) {
      return this.each(function() {
        return window['mkitSkyline'].call(this, options);
      });
    };
  }

}).call(this);

(function() {
  "use strict";
  var Affix, MaxmertkitHelpers, _activate, _beforeactivate, _beforedeactivate, _deactivate, _getWindowSize, _id, _instances, _lastScrollY, _name, _onResize, _onScroll, _requestResize, _requestTick, _resizing, _resizingTick, _setPosition, _setPositionAbsolute, _setPositionFixed, _setPositionRelative, _ticking,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _name = "affix";

  _instances = [];

  _id = 0;

  _lastScrollY = 0;

  _ticking = false;

  _resizingTick = false;

  MaxmertkitHelpers = window['MaxmertkitHelpers'];

  Affix = (function(_super) {
    __extends(Affix, _super);

    Affix.prototype._name = _name;

    Affix.prototype._instances = _instances;

    Affix.prototype.started = false;

    function Affix(el, options) {
      var _options;
      this.el = el;
      this.options = options;
      _options = {
        spy: this.el.getAttribute('data-spy') || _name,
        offset: this.el.getAttribute('data-offset') || 5,
        onMobile: this.el.getAttribute('data-on-mobile') || false,
        beforeactive: function() {},
        onactive: function() {},
        failactive: function() {},
        beforedeactive: function() {},
        ondeactive: function() {},
        faildeactive: function() {}
      };
      this.options = this._merge(_options, this.options);
      this._setOptions(this.options);
      Affix.__super__.constructor.call(this, this.el, this.options);
      this.scroller = this._getScrollContainer();
      this.container = this._getContainer();
      this.onScroll = _onScroll.bind(this);
      this.setPosition = _setPosition.bind(this);
      this.onResize = _onResize.bind(this);
      this.resizing = _resizing.bind(this);
      this._addEventListener(window, 'resize', this.onResize);
      this.reactor.registerEvent("initialize." + _name);
      this.reactor.registerEvent("start." + _name);
      this.reactor.registerEvent("stop." + _name);
      this.reactor.dispatchEvent("initialize." + _name);
      if (!(!this.options.onMobile && _getWindowSize().width < 992)) {
        this.start();
      }
    }

    Affix.prototype.destroy = function() {
      _deactivate.call(this);
      this.el.data["kitAffix"] = null;
      return Affix.__super__.destroy.apply(this, arguments);
    };

    Affix.prototype.start = function() {
      if (!this.started) {
        return _beforeactivate.call(this);
      }
    };

    Affix.prototype.stop = function() {
      if (this.started) {
        return _beforedeactivate.call(this);
      }
    };

    Affix.prototype._setOptions = function(options) {
      var key, value;
      for (key in options) {
        value = options[key];
        if (this.options[key] == null) {
          return console.error("Maxmertkit Affix. You're trying to set unpropriate option – " + key);
        }
        this.options[key] = value;
        if (typeof value === 'function') {
          this[key] = value;
        }
      }
    };

    Affix.prototype.refresh = function() {
      this.HEIGHT = this._outerHeight();
      return this.CONTAINER_HEIGHT = this._outerHeight(this.container);
    };

    return Affix;

  })(MaxmertkitHelpers);

  _onResize = function() {
    return _requestResize.call(this);
  };

  _requestResize = function() {
    if (!_resizingTick) {
      if (this.resizing != null) {
        requestAnimationFrame(this.resizing);
        return _resizingTick = true;
      }
    }
  };

  _resizing = function() {
    if (!this.options.onMobile) {
      if (_getWindowSize().width < 992) {
        this.stop();
        _setPositionRelative.call(this);
      } else {
        this.refresh();
        this.start();
      }
    }
    return _resizingTick = false;
  };

  _getWindowSize = function() {
    var clientHeight, clientWidth;
    clientWidth = 0;
    clientHeight = 0;
    if (typeof window.innerWidth === "number") {
      clientWidth = window.innerWidth;
      clientHeight = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
      clientWidth = document.documentElement.clientWidth;
      clientHeight = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
      clientWidth = document.body.clientWidth;
      clientHeight = document.body.clientHeight;
    }
    return {
      width: clientWidth,
      height: clientHeight
    };
  };

  _onScroll = function(event) {
    _lastScrollY = event.target.nodeName === '#document' ? (document.documentElement && document.documentElement.scrollTop) || event.target.body.scrollTop : event.target.scrollTop;
    return _requestTick.call(this);
  };

  _requestTick = function() {
    if (!_ticking) {
      requestAnimationFrame(this.setPosition);
      return _ticking = true;
    }
  };

  _beforeactivate = function() {
    var deferred;
    if (this.beforeactive != null) {
      try {
        deferred = this.beforeactive.call(this.el);
        return deferred.done((function(_this) {
          return function() {
            return _activate.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            var _ref;
            return (_ref = _this.failactive) != null ? _ref.call(_this.el) : void 0;
          };
        })(this));
      } catch (_error) {
        return _activate.call(this);
      }
    } else {
      return _activate.call(this);
    }
  };

  _activate = function() {
    var _ref;
    this.refresh();
    this._addEventListener(this.scroller, 'scroll', this.onScroll);
    this._addClass('_active_');
    if ((_ref = this.onactive) != null) {
      _ref.call(this.el);
    }
    this.reactor.dispatchEvent("start." + _name);
    this.started = true;
    return setTimeout((function(_this) {
      return function() {
        return _this.refresh();
      };
    })(this), 100);
  };

  _beforedeactivate = function() {
    var deferred;
    if (this.beforedeactive != null) {
      try {
        deferred = this.beforedeactive.call(this.el);
        return deferred.done((function(_this) {
          return function() {
            return _deactivate.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            var _ref;
            return (_ref = _this.faildeactive) != null ? _ref.call(_this.el) : void 0;
          };
        })(this));
      } catch (_error) {
        return _deactivate.call(this);
      }
    } else {
      return _deactivate.call(this);
    }
  };

  _deactivate = function() {
    var _ref;
    this._removeEventListener(this.scroller, 'scroll', this.onScroll);
    this._removeClass('_active_');
    this.reactor.dispatchEvent("stop." + _name);
    if ((_ref = this.ondeactive) != null) {
      _ref.call(this.el);
    }
    return this.started = false;
  };

  _setPositionFixed = function() {
    var style, top;
    this.el.style.width = this.el.offsetWidth;
    this.el.style.position = 'fixed';
    top = this.options.offset;
    try {
      style = this.el.currentStyle || getComputedStyle(this.el);
    } catch (_error) {}
    if (style != null) {
      if ((style.marginTop != null) && style.marginTop !== '') {
        top += parseInt(style.marginTop);
      }
    }
    this.el.style.top = "" + this.options.offset + "px";
    return this.el.style.bottom = 'auto';
  };

  _setPositionRelative = function() {
    this.el.style.position = 'relative';
    return this.el.style.top = 'inherit';
  };

  _setPositionAbsolute = function() {
    this.el.style.position = 'absolute';
    this.el.style.top = 'auto';
    this.el.style.bottom = "" + this.options.offset + "px";
    return this.el.style.width = this.el.offsetWidth;
  };

  _setPosition = function() {
    var containerTop;
    containerTop = this.container.offsetTop;
    if (containerTop - this.options.offset <= _lastScrollY) {
      if (containerTop + this.CONTAINER_HEIGHT - this.options.offset - this.HEIGHT >= _lastScrollY) {
        if (this.el.style.position !== 'fixed') {
          _setPositionFixed.call(this);
        }
      } else {
        if (this.el.style.position !== 'absolute') {
          if (containerTop + this.CONTAINER_HEIGHT - this.options.offset - this.HEIGHT < _lastScrollY + this.HEIGHT) {
            _setPositionAbsolute.call(this);
          }
        }
      }
    } else {
      if (this.el.style.position !== 'relative') {
        _setPositionRelative.call(this);
      }
    }
    return _ticking = false;
  };

  window['Affix'] = Affix;

  window['mkitAffix'] = function(options) {
    var result;
    result = null;
    if (this.data == null) {
      this.data = {};
    }
    if (!this.data['kitAffix']) {
      result = new Affix(this, options);
      this.data['kitAffix'] = result;
    } else {
      if (typeof options === 'object') {
        this.data['kitAffix']._setOptions(options);
      } else {
        if (typeof options === "string" && options.charAt(0) !== "_") {
          this.data['kitAffix'][options];
        }
      }
      result = this.data['kitAffix'];
    }
    return result;
  };

  if (typeof Element !== "undefined" && Element !== null) {
    Element.prototype.affix = window['mkitAffix'];
  }

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    $.fn[_name] = function(options) {
      return this.each(function() {
        return window['mkitAffix'].call(this, options);
      });
    };
  }

}).call(this);

(function() {
  "use strict";
  var Button, MaxmertkitHelpers, _activate, _beforeactivate, _beforedeactivate, _clicker, _deactivate, _id, _instances, _name,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _name = "button";

  _instances = [];

  _id = 0;

  MaxmertkitHelpers = window['MaxmertkitHelpers'];

  Button = (function(_super) {
    __extends(Button, _super);

    Button.prototype._name = _name;

    Button.prototype._instances = _instances;

    Button.prototype.active = false;

    Button.prototype.enabled = true;

    function Button(el, options) {
      var _options;
      this.el = el;
      this.options = options;
      _options = {
        toggle: this.el.getAttribute('data-toggle') || _name,
        type: this.el.getAttribute('data-type') || _name,
        group: this.el.getAttribute('data-group') || false,
        event: this.el.getAttribute('data-event') || "click",
        selfish: this.el.getAttribute('data-selfish') || false,
        beforeactive: function() {},
        onactive: function() {},
        failactive: function() {},
        beforedeactive: function() {},
        ondeactive: function() {},
        faildeactive: function() {}
      };
      this.options = this._merge(_options, this.options);
      this.clicker = _clicker.bind(this);
      this._setOptions(this.options);
      Button.__super__.constructor.call(this, this.el, this.options);
      this.reactor.registerEvent("initialize." + _name);
      this.reactor.registerEvent("active." + _name);
      this.reactor.registerEvent("deactive." + _name);
      this.reactor.dispatchEvent("initialize." + _name);
    }

    Button.prototype.destroy = function() {
      this._removeEventListener(this.el, this.options.event, this.clicker);
      this.el.data["kitButton"] = null;
      return Button.__super__.destroy.apply(this, arguments);
    };

    Button.prototype._setOptions = function(options) {
      var key, value;
      for (key in options) {
        value = options[key];
        if (this.options[key] == null) {
          return console.error("Maxmertkit Button. You're trying to set unpropriate option – " + key);
        }
        switch (key) {
          case 'event':
            this._removeEventListener(this.el, this.options.event, this.clicker);
            this._addEventListener(this.el, value, this.clicker);
        }
        this.options[key] = value;
        if (typeof value === 'function') {
          this[key] = value;
        }
      }
    };

    Button.prototype.activate = function() {
      if (this.enabled && !this.active) {
        return _beforeactivate.call(this);
      }
    };

    Button.prototype.deactivate = function() {
      if (this.enabled && this.active) {
        return _beforedeactivate.call(this);
      }
    };

    Button.prototype.disable = function() {
      return this.enabled = false;
    };

    Button.prototype.enable = function() {
      return this.enabled = true;
    };

    return Button;

  })(MaxmertkitHelpers);

  _clicker = function() {
    if (!this.active) {
      return this.activate();
    } else {
      return this.deactivate();
    }
  };

  _beforeactivate = function() {
    var deferred;
    if (this.options.selfish) {
      this._selfish();
    }
    if (this.beforeactive != null) {
      try {
        deferred = this.beforeactive.call(this.el);
        return deferred.done((function(_this) {
          return function() {
            return _activate.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            var _ref;
            return (_ref = _this.faildeactive) != null ? _ref.call(_this.el) : void 0;
          };
        })(this));
      } catch (_error) {
        return _activate.call(this);
      }
    } else {
      return _activate.call(this);
    }
  };

  _activate = function() {
    var button, _i, _len, _ref, _ref1;
    if (this.options.type === 'radio') {
      _ref = this._instances;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        button = _ref[_i];
        if (this._id !== button._id && button.options.type === 'radio' && button.options.group === this.options.group) {
          button.deactivate();
        }
      }
    }
    this._addClass('_active_');
    if ((_ref1 = this.onactive) != null) {
      _ref1.call(this.el);
    }
    this.reactor.dispatchEvent("active." + _name);
    return this.active = true;
  };

  _beforedeactivate = function() {
    var deferred;
    if (this.beforedeactive != null) {
      try {
        deferred = this.beforedeactive.call(this.el);
        return deferred.done((function(_this) {
          return function() {
            return _deactivate.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            var _ref;
            return (_ref = _this.faildeactive) != null ? _ref.call(_this.el) : void 0;
          };
        })(this));
      } catch (_error) {
        return _deactivate.call(this);
      }
    } else {
      return _deactivate.call(this);
    }
  };

  _deactivate = function() {
    var _ref;
    this._removeClass('_active_');
    this.reactor.dispatchEvent("deactive." + _name);
    if ((_ref = this.ondeactive) != null) {
      _ref.call(this.el);
    }
    return this.active = false;
  };

  window['Button'] = Button;

  window['mkitButton'] = function(options) {
    var result;
    result = null;
    if (this.data == null) {
      this.data = {};
    }
    if (!this.data['kitButton']) {
      result = new Button(this, options);
      this.data['kitButton'] = result;
    } else {
      if (typeof options === 'object') {
        this.data['kitButton']._setOptions(options);
      } else {
        if (typeof options === "string" && options.charAt(0) !== "_") {
          this.data['kitButton'][options];
        }
      }
      result = this.data['kitButton'];
    }
    return result;
  };

  if (typeof Element !== "undefined" && Element !== null) {
    Element.prototype.button = window['mkitButton'];
  }

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    $.fn[_name] = function(options) {
      return this.each(function() {
        return window['mkitButton'].call(this, options);
      });
    };
  }

}).call(this);

(function() {
  "use strict";
  var MaxmertkitHelpers, Scrollspy, _activate, _activateItem, _beforeactivate, _beforedeactivate, _deactivate, _deactivateAllItems, _deactivateItem, _getWindowSize, _id, _instances, _lastScrollY, _name, _onResize, _onScroll, _requestResize, _requestTick, _resizing, _resizingTick, _spy, _ticking,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _name = "scrollspy";

  _instances = [];

  _id = 0;

  _lastScrollY = 0;

  _ticking = false;

  _resizingTick = false;

  MaxmertkitHelpers = window['MaxmertkitHelpers'];

  Scrollspy = (function(_super) {
    __extends(Scrollspy, _super);

    Scrollspy.prototype._name = _name;

    Scrollspy.prototype._instances = _instances;

    Scrollspy.prototype.started = false;

    Scrollspy.prototype.active = -1;

    function Scrollspy(el, options) {
      var _options;
      this.el = el;
      this.options = options;
      _options = {
        spy: this.el.getAttribute('data-spy') || _name,
        target: this.el.getAttribute('data-target') || 'body',
        offset: this.el.getAttribute('data-offset') || 5,
        elements: this.el.getAttribute('data-elements') || 'li a',
        elementsAttr: this.el.getAttribute('data-elements-attr') || 'href',
        onMobile: this.el.getAttribute('data-on-mobile') || false,
        beforeactive: function() {},
        onactive: function() {},
        failactive: function() {},
        beforedeactive: function() {},
        ondeactive: function() {},
        faildeactive: function() {}
      };
      this.options = this._merge(_options, this.options);
      this.target = document.querySelector(this.options.target);
      this.scroller = this._getScrollContainer(this.target);
      this.spy = _spy.bind(this);
      this.onScroll = _onScroll.bind(this);
      this.onResize = _onResize.bind(this);
      this.resizing = _resizing.bind(this);
      this._setOptions(this.options);
      Scrollspy.__super__.constructor.call(this, this.el, this.options);
      this._addEventListener(window, 'resize', this.onResize);
      this.reactor.registerEvent("initialize." + _name);
      this.reactor.registerEvent("start." + _name);
      this.reactor.registerEvent("stop." + _name);
      this.reactor.dispatchEvent("initialize." + _name);
      if (!(!this.options.onMobile && _getWindowSize().width < 992)) {
        this.start();
      }
    }

    Scrollspy.prototype.destroy = function() {
      _deactivate.call(this);
      this.el.data["kitScrollspy"] = null;
      return Scrollspy.__super__.destroy.apply(this, arguments);
    };

    Scrollspy.prototype._setOptions = function(options) {
      var key, value;
      for (key in options) {
        value = options[key];
        if (this.options[key] == null) {
          return console.error("Maxmertkit Scrollspy. You're trying to set unpropriate option – " + key);
        }
        switch (key) {
          case 'elements':
            this.refresh();
            break;
          case 'offset':
            if (typeof value === 'string') {
              this.offsetTop = value[value.length - 1] === '%' ? _getWindowSize().height * parseInt(value) / 100 : parseInt(value);
            }
        }
        this.options[key] = value;
        if (typeof value === 'function') {
          this[key] = value;
        }
      }
    };

    Scrollspy.prototype.start = function() {
      if (!this.started) {
        return _beforeactivate.call(this);
      }
    };

    Scrollspy.prototype.stop = function() {
      if (this.started) {
        return _beforedeactivate.call(this);
      }
    };

    Scrollspy.prototype.refresh = function() {
      var el, elements, offsetTop, targetEl, _i, _len, _results;
      this.offsetTop = this.options.offset[this.options.offset.length - 1] === '%' ? _getWindowSize().height * parseInt(this.options.offset) / 100 : parseInt(this.options.offset);
      elements = this.el.querySelectorAll(this.options.elements);
      this.elements = [];
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        el = elements[_i];
        targetEl = this.target.querySelector(el.getAttribute(this.options.elementsAttr));
        if (targetEl != null) {
          offsetTop = targetEl.offsetTop;
          if (this.target.offsetTop != null) {
            offsetTop += this.target.offsetTop;
          }
          _results.push(this.elements.push({
            element: el,
            target: targetEl,
            height: targetEl.offsetHeight,
            top: offsetTop
          }));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Scrollspy;

  })(MaxmertkitHelpers);

  _onResize = function() {
    return _requestResize.call(this);
  };

  _requestResize = function() {
    if (!_resizingTick) {
      if (this.resizing != null) {
        requestAnimationFrame(this.resizing);
        return _resizingTick = true;
      }
    }
  };

  _resizing = function() {
    this.refresh();
    if (!this.options.onMobile) {
      if (_getWindowSize().width < 992) {
        this.stop();
        _deactivateAllItems.call(this);
      } else {
        this.start();
      }
    }
    return _resizingTick = false;
  };

  _getWindowSize = function() {
    var clientHeight, clientWidth;
    clientWidth = 0;
    clientHeight = 0;
    if (typeof window.innerWidth === "number") {
      clientWidth = window.innerWidth;
      clientHeight = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
      clientWidth = document.documentElement.clientWidth;
      clientHeight = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
      clientWidth = document.body.clientWidth;
      clientHeight = document.body.clientHeight;
    }
    return {
      width: clientWidth,
      height: clientHeight
    };
  };

  _onScroll = function(event) {
    _lastScrollY = event.target.nodeName === '#document' ? (document.documentElement && document.documentElement.scrollTop) || event.target.body.scrollTop : event.target.scrollTop;
    return _requestTick.call(this);
  };

  _requestTick = function() {
    if (!_ticking) {
      requestAnimationFrame(this.spy);
      return _ticking = true;
    }
  };

  _activateItem = function(itemNumber) {
    var el, parent, _i, _len, _ref, _results;
    _ref = this.elements;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i];
      this._removeClass('_active_', el.element);
      parent = el.element.parentNode;
      this._removeClass('_active_', parent);
      while ((parent != null) && (parent = parent.parentNode)) {
        if (parent.nodeName === 'LI') {
          this._removeClass('_active_', parent);
        }
      }
    }
    this._addClass('_active_', this.elements[itemNumber].element);
    if (this.elements[itemNumber].element.getAttribute("data-invert")) {
      this._addClass('_invert_');
    } else {
      this._removeClass('_invert_');
    }
    parent = this.elements[itemNumber].element.parentNode;
    this._addClass('_active_', parent);
    _results = [];
    while ((parent != null) && (parent = parent.parentNode)) {
      if (parent.nodeName === 'LI') {
        _results.push(this._addClass('_active_', parent));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  _deactivateItem = function(itemNumber) {
    this._removeClass('_active_', this.elements[itemNumber].element);
    return this._removeClass('_active_', this.elements[itemNumber].element.parentNode);
  };

  _deactivateAllItems = function() {
    var index, item, _i, _len, _ref, _results;
    _ref = this.elements;
    _results = [];
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      item = _ref[index];
      _results.push(_deactivateItem.call(this, index));
    }
    return _results;
  };

  _spy = function(event) {
    var i, _ref, _ref1;
    i = 0;
    while (i < this.elements.length) {
      if (((this.elements[i].top <= (_ref = _lastScrollY + this.offsetTop) && _ref <= this.elements[i].top + this.elements[i].height)) || (i < this.elements.length - 1 ? (this.elements[i].top <= (_ref1 = _lastScrollY + this.offsetTop) && _ref1 <= this.elements[i + 1].top) : void 0)) {
        if (!this._hasClass('_active_', this.elements[i].element)) {
          _activateItem.call(this, i);
        }
      } else {
        if (this._hasClass('_active_', this.elements[i].element) && _lastScrollY + this.offsetTop < this.elements[i].top + this.elements[i].height) {
          _deactivateItem.call(this, i);
        }
      }
      i++;
    }
    return _ticking = false;
  };

  _beforeactivate = function() {
    var deferred;
    if (this.beforeactive != null) {
      try {
        deferred = this.beforeactive.call(this.el);
        return deferred.done((function(_this) {
          return function() {
            return _activate.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            var _ref;
            return (_ref = _this.failactive) != null ? _ref.call(_this.el) : void 0;
          };
        })(this));
      } catch (_error) {
        return _activate.call(this);
      }
    } else {
      return _activate.call(this);
    }
  };

  _activate = function() {
    var _ref;
    this._addEventListener(this.scroller, 'scroll', this.onScroll);
    if ((_ref = this.onactive) != null) {
      _ref.call(this.el);
    }
    this.reactor.dispatchEvent("start." + _name);
    this.started = true;
    return setTimeout((function(_this) {
      return function() {
        return _this.refresh();
      };
    })(this), 100);
  };

  _beforedeactivate = function() {
    var deferred;
    if (this.beforedeactive != null) {
      try {
        deferred = this.beforedeactive.call(this.el);
        return deferred.done((function(_this) {
          return function() {
            return _deactivate.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            var _ref;
            return (_ref = _this.faildeactive) != null ? _ref.call(_this.el) : void 0;
          };
        })(this));
      } catch (_error) {
        return _deactivate.call(this);
      }
    } else {
      return _deactivate.call(this);
    }
  };

  _deactivate = function() {
    var _ref;
    this._removeEventListener(this.scroller, 'scroll', this.onScroll);
    this.reactor.dispatchEvent("stop." + _name);
    if ((_ref = this.ondeactive) != null) {
      _ref.call(this.el);
    }
    return this.started = false;
  };

  window['Scrollspy'] = Scrollspy;

  window['mkitScrollspy'] = function(options) {
    var result;
    result = null;
    if (this.data == null) {
      this.data = {};
    }
    if (!this.data['kitScrollspy']) {
      result = new Scrollspy(this, options);
      this.data['kitScrollspy'] = result;
    } else {
      if (typeof options === 'object') {
        this.data['kitScrollspy']._setOptions(options);
      } else {
        if (typeof options === "string" && options.charAt(0) !== "_") {
          this.data['kitScrollspy'][options];
        }
      }
      result = this.data['kitScrollspy'];
    }
    return result;
  };

  if (typeof Element !== "undefined" && Element !== null) {
    Element.prototype.scrollspy = window['mkitScrollspy'];
  }

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    $.fn[_name] = function(options) {
      return this.each(function() {
        return window['mkitScrollspy'].call(this, options);
      });
    };
  }

}).call(this);

(function() {
  "use strict";
  var MaxmertkitHelpers, Tabs, _activate, _beforeactivate, _beforedeactivate, _clicker, _deactivate, _id, _initialActivate, _instances, _name,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _name = "tabs";

  _instances = [];

  _id = 0;

  MaxmertkitHelpers = window['MaxmertkitHelpers'];

  Tabs = (function(_super) {
    __extends(Tabs, _super);

    Tabs.prototype._name = _name;

    Tabs.prototype._instances = _instances;

    Tabs.prototype.enabled = true;

    Tabs.prototype.active = false;

    function Tabs(el, options) {
      var _options;
      this.el = el;
      this.options = options;
      _options = {
        toggle: this.el.getAttribute('data-toggle') || _name,
        target: this.el.getAttribute('data-target') || null,
        group: this.el.getAttribute('data-group') || null,
        event: this.el.getAttribute('data-event') || "click",
        initial: this.el.getAttribute('data-initial') || 0,
        beforeactive: function() {},
        onactive: function() {},
        failactive: function() {},
        beforedeactive: function() {},
        ondeactive: function() {},
        faildeactive: function() {}
      };
      this.options = this._merge(_options, this.options);
      this.clicker = _clicker.bind(this);
      this._setOptions(this.options);
      Tabs.__super__.constructor.call(this, this.el, this.options);
      this.reactor.registerEvent("initialize." + _name);
      this.reactor.registerEvent("active." + _name);
      this.reactor.registerEvent("deactive." + _name);
      this.reactor.dispatchEvent("initialize." + _name);
      _initialActivate.call(this, this.options.initial);
    }

    Tabs.prototype.destroy = function() {
      this._removeEventListener(this.el, this.options.event, this.clicker);
      this.el.data["kitTabs"] = null;
      return Tabs.__super__.destroy.apply(this, arguments);
    };

    Tabs.prototype._setOptions = function(options) {
      var key, value;
      for (key in options) {
        value = options[key];
        if (this.options[key] == null) {
          return console.error("Maxmertkit Tabs. You're trying to set unpropriate option – " + key);
        }
        switch (key) {
          case 'event':
            this._removeEventListener(this.el, this.options.event, this.clicker);
            this._addEventListener(this.el, value, this.clicker);
            break;
          case 'target':
            this.target = document.querySelector(value);
        }
        this.options[key] = value;
        if (typeof value === 'function') {
          this[key] = value;
        }
      }
    };

    Tabs.prototype.activate = function() {
      if (this.enabled && !this.active) {
        return _beforeactivate.call(this);
      }
    };

    Tabs.prototype.deactivate = function() {
      if (this.enabled) {
        return _beforedeactivate.call(this);
      }
    };

    Tabs.prototype.disable = function() {
      return this.enabled = false;
    };

    Tabs.prototype.enable = function() {
      return this.enabled = true;
    };

    return Tabs;

  })(MaxmertkitHelpers);

  _initialActivate = function(number) {
    var index, tab, _i, _len, _ref, _results;
    _ref = this._instances;
    _results = [];
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      tab = _ref[index];
      if (index === number) {
        _results.push(tab.activate());
      } else {
        _results.push(tab.deactivate());
      }
    }
    return _results;
  };

  _clicker = function() {
    if (!this.active) {
      return this.activate();
    }
  };

  _beforeactivate = function() {
    var deferred;
    this._selfish();
    if (this.beforeactive != null) {
      try {
        deferred = this.beforeactive.call(this.el);
        return deferred.done((function(_this) {
          return function() {
            return _activate.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            var _ref;
            return (_ref = _this.faildeactive) != null ? _ref.call(_this.el) : void 0;
          };
        })(this));
      } catch (_error) {
        return _activate.call(this);
      }
    } else {
      return _activate.call(this);
    }
  };

  _activate = function() {
    var tab, _i, _len, _ref, _ref1;
    _ref = this._instances;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tab = _ref[_i];
      if (this._id !== tab._id && tab.options.group === this.options.group) {
        tab.deactivate();
      }
    }
    this._addClass('_active_');
    this.target.style.display = '';
    if ((_ref1 = this.onactive) != null) {
      _ref1.call(this.el);
    }
    this.reactor.dispatchEvent("active." + _name);
    return this.active = true;
  };

  _beforedeactivate = function() {
    var deferred;
    if (this.beforedeactive != null) {
      try {
        deferred = this.beforedeactive.call(this.el);
        return deferred.done((function(_this) {
          return function() {
            return _deactivate.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            var _ref;
            return (_ref = _this.faildeactive) != null ? _ref.call(_this.el) : void 0;
          };
        })(this));
      } catch (_error) {
        return _deactivate.call(this);
      }
    } else {
      return _deactivate.call(this);
    }
  };

  _deactivate = function() {
    var _ref;
    this._removeClass('_active_');
    this.target.style.display = 'none';
    this.reactor.dispatchEvent("deactive." + _name);
    if ((_ref = this.ondeactive) != null) {
      _ref.call(this.el);
    }
    return this.active = false;
  };

  window['Tabs'] = Tabs;

  window['mkitTabs'] = function(options) {
    var result;
    result = null;
    if (this.data == null) {
      this.data = {};
    }
    if (!this.data['kitTabs']) {
      result = new Tabs(this, options);
      this.data['kitTabs'] = result;
    } else {
      if (typeof options === 'object') {
        this.data['kitTabs']._setOptions(options);
      } else {
        if (typeof options === "string" && options.charAt(0) !== "_") {
          this.data['kitTabs'][options];
        }
      }
      result = this.data['kitTabs'];
    }
    return result;
  };

  if (typeof Element !== "undefined" && Element !== null) {
    Element.prototype.tabs = window['mkitTabs'];
  }

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    $.fn[_name] = function(options) {
      return this.each(function() {
        return window['mkitTabs'].call(this, options);
      });
    };
  }

}).call(this);

(function() {
  "use strict";
  var MaxmertkitHelpers, Popup, _activate, _beforeactivate, _beforedeactivate, _clicker, _closeUnfocus, _deactivate, _id, _instances, _name,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _name = "popup";

  _instances = [];

  _id = 0;

  MaxmertkitHelpers = window['MaxmertkitHelpers'];

  Popup = (function(_super) {
    __extends(Popup, _super);

    Popup.prototype._name = _name;

    Popup.prototype._instances = _instances;

    Popup.prototype.opened = false;

    Popup.prototype.enabled = true;

    function Popup(el, options) {
      var _options;
      this.el = el;
      this.options = options;
      _options = {
        toggle: this.el.getAttribute('data-toggle') || _name,
        target: this.el.getAttribute('data-target') || null,
        dialog: this.el.getAttribute('data-dialog') || ".-content",
        event: this.el.getAttribute('data-event') || "click",
        eventClose: this.el.getAttribute('data-event-close') || "click",
        autoOpen: this.el.getAttribute('data-autoopen') || false,
        position: {
          vertical: this.el.getAttribute('data-position-vertical') || 'top',
          horizontal: this.el.getAttribute('data-position-horizontal') || 'center'
        },
        offset: {
          horizontal: this.el.getAttribute('data-offset-horizontal') || 0,
          vertical: this.el.getAttribute('data-offset-vertical') || 0
        },
        closeOnUnfocus: this.el.getAttribute('data-close-unfocus') || false,
        closeOnResize: this.el.getAttribute('data-close-resize') || true,
        selfish: this.el.getAttribute('data-selfish') || true,
        beforeactive: function() {},
        onactive: function() {},
        failactive: function() {},
        beforedeactive: function() {},
        ondeactive: function() {},
        faildeactive: function() {}
      };
      this.options = this._merge(_options, this.options);
      this.target = document.querySelector(this.options.target);
      this.closers = document.querySelectorAll("[data-dismiss='" + this.options.target + "']");
      this.dialog = this.target.querySelector(this.options.dialog);
      this.closeUnfocus = _closeUnfocus.bind(this);
      this.clicker = _clicker.bind(this);
      this.closer = this.close.bind(this);
      this._setOptions(this.options);
      Popup.__super__.constructor.call(this, this.el, this.options);
      this.reactor.registerEvent("initialize." + _name);
      this.reactor.registerEvent("open." + _name);
      this.reactor.registerEvent("close." + _name);
      this.reactor.dispatchEvent("initialize." + _name);
      if (this.options.autoOpen) {
        this.open();
      }
    }

    Popup.prototype.destroy = function() {
      var closer, _i, _len, _ref;
      this._removeEventListener(this.el, this.options.event, this.clicker);
      this._removeEventListener(document, this.options.event, this.closeUnfocus);
      this._removeEventListener(window, "resize", this.closer);
      _ref = this.closers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        closer = _ref[_i];
        this._removeEventListener(closer, this.options.eventClose, this.closer);
      }
      this.el.data["kitPopup"] = null;
      return Popup.__super__.destroy.apply(this, arguments);
    };

    Popup.prototype._setOptions = function(options) {
      var closer, key, value, _i, _len, _ref;
      for (key in options) {
        value = options[key];
        if (this.options[key] == null) {
          return console.error("Maxmertkit Modal. You're trying to set unpropriate option – " + key);
        }
        switch (key) {
          case 'event':
            this._removeEventListener(this.el, this.options.event, this.clicker);
            this._addEventListener(this.el, value, this.clicker);
            break;
          case 'eventClose':
            _ref = this.closers;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              closer = _ref[_i];
              this._removeEventListener(closer, this.options.eventClose, this.closer);
              this._addEventListener(closer, value, this.closer);
            }
            break;
          case 'position':
            this._removeClass("_top_ _bottom_ _left_ _right_ _center_ _middle_", this.target);
            this._addClass("_" + this.options.position.vertical + "_ _" + this.options.position.horizontal + "_", this.target);
            break;
          case 'closeOnUnfocus':
            this._removeEventListener(document, this.options.event, this.closeUnfocus);
            if (value) {
              this._addEventListener(document, this.options.event, this.closeUnfocus);
            }
            break;
          case 'closeOnResize':
            this._removeEventListener(window, "resize", this.closer);
            if (value) {
              this._addEventListener(window, "resize", this.closer);
            }
        }
        this.options[key] = value;
        if (typeof value === 'function') {
          this[key] = value;
        }
      }
    };

    Popup.prototype.open = function() {
      return this.activate();
    };

    Popup.prototype.close = function() {
      return this.deactivate();
    };

    Popup.prototype.activate = function() {
      if (this.enabled && !this.opened) {
        return _beforeactivate.call(this);
      }
    };

    Popup.prototype.deactivate = function() {
      if (this.enabled && this.opened) {
        return _beforedeactivate.call(this);
      }
    };

    Popup.prototype.disable = function() {
      return this.enabled = false;
    };

    Popup.prototype.enable = function() {
      return this.enabled = true;
    };

    Popup.prototype.setPosition = function() {
      var btnOffset, btnSize, newLeft, newTop, pos, scrollParentTarget, targetSize;
      pos = this.el.getBoundingClientRect();
      scrollParentTarget = this._getContainer(this.target);
      btnOffset = this._getPosition();
      if ((scrollParentTarget != null) && (((scrollParentTarget.activeElement != null) && scrollParentTarget.activeElement.nodeName !== 'BODY') || ((scrollParentTarget.nodeName != null) && (scrollParentTarget.nodeName !== 'BODY' && scrollParentTarget.nodeName !== '#document')))) {
        btnOffset.top = btnOffset.top - scrollParentTarget.offsetTop;
        btnOffset.left = btnOffset.left - scrollParentTarget.offsetLeft;
      }
      btnSize = {
        width: this._outerWidth(),
        height: this._outerHeight()
      };
      this.target.style.visibility = 'hidden';
      this.target.style.display = 'block';
      targetSize = {
        width: this._outerWidth(this.target),
        height: this._outerHeight(this.target)
      };
      this.target.style.display = 'none';
      this.target.style.visibility = 'visible';
      switch (this.options.position.vertical) {
        case 'top':
          newTop = btnOffset.top - targetSize.height - this.options.offset.vertical;
          break;
        case 'bottom':
          newTop = btnOffset.top + btnSize.height + this.options.offset.vertical;
          break;
        case 'middle' || 'center':
          newTop = btnOffset.top + btnSize.height / 2 - targetSize.height / 2;
      }
      switch (this.options.position.horizontal) {
        case 'center' || 'middle':
          newLeft = btnOffset.left + btnSize.width / 2 - targetSize.width / 2;
          break;
        case 'left':
          newLeft = btnOffset.left - targetSize.width - this.options.offset.horizontal;
          break;
        case 'right':
          newLeft = btnOffset.left + btnSize.width + this.options.offset.horizontal;
      }
      this.target.style.left = "" + newLeft + "px";
      this.target.style.top = "" + newTop + "px";
      return true;
    };

    return Popup;

  })(MaxmertkitHelpers);

  _clicker = function() {
    if (!this.opened) {
      return this.open();
    } else {
      return this.close();
    }
  };

  _closeUnfocus = function(event) {
    var classes;
    classes = '.' + this.el.className.split(' ').join('.');
    if ((this._closest(classes, event.target) == null) && event.target !== this.el) {
      return this.close();
    }
  };

  _beforeactivate = function() {
    var deferred;
    if (this.options.selfish) {
      this._selfish();
    }
    if (this.beforeactive != null) {
      try {
        deferred = this.beforeactive.call(this.el);
        return deferred.done((function(_this) {
          return function() {
            return _activate.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            var _ref;
            return (_ref = _this.faildeactive) != null ? _ref.call(_this.el) : void 0;
          };
        })(this));
      } catch (_error) {
        return _activate.call(this);
      }
    } else {
      return _activate.call(this);
    }
  };

  _activate = function() {
    var _ref;
    this.setPosition();
    this.target.style.display = '';
    this._addClass('_active_', this.target);
    if ((_ref = this.onactive) != null) {
      _ref.call(this.el);
    }
    this.reactor.dispatchEvent("open." + _name);
    return this.opened = true;
  };

  _beforedeactivate = function() {
    var deferred;
    if (this.beforedeactive != null) {
      try {
        deferred = this.beforedeactive.call(this.el);
        return deferred.done((function(_this) {
          return function() {
            return _deactivate.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            var _ref;
            return (_ref = _this.faildeactive) != null ? _ref.call(_this.el) : void 0;
          };
        })(this));
      } catch (_error) {
        return _deactivate.call(this);
      }
    } else {
      return _deactivate.call(this);
    }
  };

  _deactivate = function() {
    var _ref;
    this._removeClass('_active_', this.target);
    this.reactor.dispatchEvent("close." + _name);
    if ((_ref = this.ondeactive) != null) {
      _ref.call(this.el);
    }
    return this.opened = false;
  };

  window['Popup'] = Popup;

  window['mkitPopup'] = function(options) {
    var result;
    result = null;
    if (this.data == null) {
      this.data = {};
    }
    if (!this.data['kitPopup']) {
      result = new Popup(this, options);
      this.data['kitPopup'] = result;
    } else {
      if (typeof options === 'object') {
        this.data['kitPopup']._setOptions(options);
      } else {
        if (typeof options === "string" && options.charAt(0) !== "_") {
          this.data['kitPopup'][options];
        }
      }
      result = this.data['kitPopup'];
    }
    return result;
  };

  if (typeof Element !== "undefined" && Element !== null) {
    Element.prototype.popup = window['mkitPopup'];
  }

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    $.fn[_name] = function(options) {
      return this.each(function() {
        return window['mkitPopup'].call(this, options);
      });
    };
  }

}).call(this);

(function() {
  "use strict";
  var MaxmertkitHelpers, Wall, _activate, _beforeactivate, _beforedeactivate, _deactivate, _getTargetSize, _getWindowSize, _id, _instances, _lastScrollY, _name, _onResize, _onScroll, _requestResize, _resizing, _spy, _windowSize,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _name = "wall";

  _instances = [];

  _id = 0;

  _lastScrollY = 0;

  _windowSize = 0;

  MaxmertkitHelpers = window['MaxmertkitHelpers'];

  Wall = (function(_super) {
    __extends(Wall, _super);

    Wall.prototype._name = _name;

    Wall.prototype._instances = _instances;

    Wall.prototype.started = false;

    Wall.prototype.active = false;

    function Wall(el, options) {
      var _options;
      this.el = el;
      this.options = options;
      _options = {
        kind: this.el.getAttribute('data-kind') || _name,
        target: this.el.getAttribute('data-target') || '.-thumbnail',
        header: this.el.getAttribute('data-header') || '.-header',
        headerFade: this.el.getAttribute('data-fade') || true,
        speed: this.el.getAttribute('data-speed') || 0.7,
        zoom: this.el.getAttribute('data-zoom') || false,

        /* Extrimely slow */
        height: this.el.getAttribute('data-height') || '100%',
        onMobile: this.el.getAttribute('data-on-mobile') || false,
        beforeactive: function() {},
        onactive: function() {},
        failactive: function() {},
        beforedeactive: function() {},
        ondeactive: function() {},
        faildeactive: function() {}
      };
      this.options = this._merge(_options, this.options);
      this.resizingTick = false;
      this.scroller = this._getScrollContainer(this.el);
      this.spy = _spy.bind(this);
      this.onScroll = _onScroll.bind(this);
      this.onResize = _onResize.bind(this);
      this.resizing = _resizing.bind(this);
      this._setOptions(this.options);
      Wall.__super__.constructor.call(this, this.el, this.options);
      this._addEventListener(window, 'resize', this.onResize);
      this.reactor.registerEvent("initialize." + _name);
      this.reactor.registerEvent("start." + _name);
      this.reactor.registerEvent("stop." + _name);
      this.reactor.dispatchEvent("initialize." + _name);
      if (!(!this.options.onMobile && _getWindowSize().width < 992)) {
        this.start(this.deactivate);
      }
    }

    Wall.prototype.destroy = function() {
      _deactivate.call(this);
      this.el.data["kitWall"] = null;
      return Wall.__super__.destroy.apply(this, arguments);
    };

    Wall.prototype._setOptions = function(options) {
      var key, value;
      for (key in options) {
        value = options[key];
        if (this.options[key] == null) {
          return console.error("Maxmertkit Wall. You're trying to set unpropriate option – " + key);
        }
        switch (key) {
          case 'target':
            this.target = this.el.querySelector(this.options.target);
            this.targetObject = this.target.querySelector('img');
            break;
          case 'header':
            this.header = this.el.querySelector(this.options.header);
        }

        /* Extrimely slow */
        this.options[key] = value;
        if (typeof value === 'function') {
          this[key] = value;
        }
      }
    };

    Wall.prototype.start = function(cb) {
      if (!this.started) {
        return _beforeactivate.call(this, cb);
      }
    };

    Wall.prototype.stop = function(cb) {
      if (this.started) {
        return _beforedeactivate.call(this, cb);
      }
    };

    Wall.prototype.refresh = function() {
      var percent;
      _windowSize = _getWindowSize();
      if (this.header == null) {
        if (this.options.height[this.options.height.length - 1] === '%') {
          percent = parseInt(this.options.height) / 100;
          this.el.style.height = "" + (_windowSize.height * percent) + "px";
        } else {
          this.el.style.height = this.options.height;
        }
      } else {
        if (this.options.height[this.options.height.length - 1] === '%') {
          percent = parseInt(this.options.height) / 100;
          this.header.style.height = "" + (_windowSize.height * percent) + "px";
        } else {
          this.header.style.height = this.options.height;
        }
        this.header.style.width = "" + _windowSize.width + "px";
      }
      if (_windowSize.width / _windowSize.height > 16 / 9) {
        this.target.style.width = "100%";
        this.target.style.height = "auto";
      } else {
        this.target.style.width = "auto";
        this.target.style.height = "100%";
      }
      this.targetSize = _getTargetSize.call(this);
      if (this.targetSize.width - _windowSize.width > 0) {
        this._setCSSTransform(this.target, "translateX(-" + ((this.targetSize.width - _windowSize.width) / 2) + "px)");
      } else if (this.target.style.transform !== '') {
        this._setCSSTransform(this.target, "translateX(0)");
      }
      return this.spyParams = {
        offset: this._getPosition(this.el),
        height: this._outerHeight()
      };
    };

    return Wall;

  })(MaxmertkitHelpers);

  _getTargetSize = function() {
    return {
      width: this._outerWidth(this.target),
      height: this._outerHeight(this.target)
    };
  };

  _onResize = function() {
    return _requestResize.call(this);
  };

  _requestResize = function() {
    if (!this.resizingTick) {
      if (this.resizing != null) {
        requestAnimationFrame(this.resizing);
        return this.resizingTick = true;
      }
    }
  };

  _resizing = function() {
    this.refresh();
    if (this.started) {
      this.spy();
    }
    if (!this.options.onMobile) {
      if (_getWindowSize().width < 992) {
        this.stop(this.activate);
      } else {
        this.start();
      }
    }
    return this.resizingTick = false;
  };

  _getWindowSize = function() {
    var clientHeight, clientWidth;
    clientWidth = 0;
    clientHeight = 0;
    if (typeof window.innerWidth === "number") {
      clientWidth = window.innerWidth;
      clientHeight = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
      clientWidth = document.documentElement.clientWidth;
      clientHeight = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
      clientWidth = document.body.clientWidth;
      clientHeight = document.body.clientHeight;
    }
    return {
      width: clientWidth,
      height: clientHeight
    };
  };

  _onScroll = function(event) {
    _lastScrollY = event.target.nodeName === '#document' ? (document.documentElement && document.documentElement.scrollTop) || event.target.body.scrollTop : event.target.scrollTop;
    if (this.started) {
      return this.spy();
    }
  };

  _spy = function() {
    var current, max, percent, transform, _ref;
    if ((this.spyParams.offset.top <= (_ref = _lastScrollY + _windowSize.height) && _ref <= this.spyParams.offset.top + this.spyParams.height + _windowSize.height)) {
      max = this.spyParams.height;
      current = _lastScrollY - this.spyParams.offset.top;
      percent = (1 - current / max) / 2;
      transform = "translateY(" + (Math.round(current * this.options.speed)) + "px) translateZ(0)";
      if (this.targetSize.width - _windowSize.width > 0) {
        transform += " translateX(-" + ((this.targetSize.width - _windowSize.width) / 2) + "px)";
      } else if (this.target.style.transform !== '') {
        transform += " translateX(0)";
      }
      if (this.options.zoom) {
        transform += " scale(" + (1 + percent) + ")";
      }
      this._setCSSTransform(this.target, transform);
      if (this.header != null) {
        if (percent / 2 < 0.25) {
          if (!(this._hasClass('_top_') || this._hasClass('_bottom_'))) {
            this._setCSSTransform(this.header, "translateY(" + (Math.round(current / 2.5)) + "px) translateZ(0)");
          }
          if (this._hasClass('_bottom_')) {
            this._setCSSTransform(this.header, "translateY(" + (Math.round(-current / 10)) + "px) translateZ(0)");
          }
          if (this._hasClass('_top_')) {
            this._setCSSTransform(this.header, "translateY(" + (Math.round(current / 1.1)) + "px) translateZ(0)");
          }
          if (this.options.headerFade) {
            return this._setCSSOpacity(this.header, percent * 2.5);
          }
        }
      }

      /* Extrimely slow */
    }
  };

  _beforeactivate = function(cb) {
    var deferred;
    if (this.beforeactive != null) {
      try {
        deferred = this.beforeactive.call(this.el);
        return deferred.done((function(_this) {
          return function() {
            return _activate.call(_this, cb);
          };
        })(this)).fail((function(_this) {
          return function() {
            var _ref;
            return (_ref = _this.failactive) != null ? _ref.call(_this.el) : void 0;
          };
        })(this));
      } catch (_error) {
        return _activate.call(this, cb);
      }
    } else {
      return _activate.call(this, cb);
    }
  };

  _activate = function(cb) {
    var _ref;
    this.refresh();
    this._addEventListener(this.scroller, 'scroll', this.onScroll);
    if ((_ref = this.onactive) != null) {
      _ref.call(this.el);
    }
    this.reactor.dispatchEvent("start." + _name);
    this.started = true;
    if (cb != null) {
      cb.call(this);
    }
    return setTimeout((function(_this) {
      return function() {
        return _this.refresh();
      };
    })(this), 100);
  };

  _beforedeactivate = function(cb) {
    var deferred;
    if (this.beforedeactive != null) {
      try {
        deferred = this.beforedeactive.call(this.el);
        return deferred.done((function(_this) {
          return function() {
            return _deactivate.call(_this, cb);
          };
        })(this)).fail((function(_this) {
          return function() {
            var _ref;
            return (_ref = _this.faildeactive) != null ? _ref.call(_this.el) : void 0;
          };
        })(this));
      } catch (_error) {
        return _deactivate.call(this, cb);
      }
    } else {
      return _deactivate.call(this, cb);
    }
  };

  _deactivate = function(cb) {
    var _ref;
    this._removeEventListener(this.scroller, 'scroll', this.onScroll);
    this._removeEventListener(window, 'resize', this.onResize);
    this.reactor.dispatchEvent("stop." + _name);
    if ((_ref = this.ondeactive) != null) {
      _ref.call(this.el);
    }
    this.started = false;
    if (cb != null) {
      return cb.call(this);
    }
  };

  window['Wall'] = Wall;

  window['mkitWall'] = function(options) {
    var result;
    result = null;
    if (this.data == null) {
      this.data = {};
    }
    if (!this.data['kitWall']) {
      result = new Wall(this, options);
      this.data['kitWall'] = result;
    } else {
      if (typeof options === 'object') {
        this.data['kitWall']._setOptions(options);
      } else {
        if (typeof options === "string" && options.charAt(0) !== "_") {
          this.data['kitWall'][options];
        }
      }
      result = this.data['kitWall'];
    }
    return result;
  };

  if (typeof Element !== "undefined" && Element !== null) {
    Element.prototype.wall = window['mkitWall'];
  }

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    $.fn[_name] = function(options) {
      return this.each(function() {
        return window['mkitWall'].call(this, options);
      });
    };
  }

}).call(this);
