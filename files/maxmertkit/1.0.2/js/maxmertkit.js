(function() {
  "use strict";
  var MaxmertkitEvent, MaxmertkitHelpers, MaxmertkitReactor, _eventCallbacks, _eventHandlers, _id, _reactor, _reactorEvents;

  _eventHandlers = [];

  _eventCallbacks = [];

  _reactorEvents = [];

  _id = 0;

  MaxmertkitEvent = (function() {
    function MaxmertkitEvent(name) {
      this.name = name;
      this.callbacks = new Array();
    }

    MaxmertkitEvent.prototype.registerCallback = function(callback) {
      return this.callbacks.push(callback);
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
      var callback, _i, _len, _ref, _results;
      _ref = this.events[eventName].callbacks;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        _results.push(callback(eventArgs));
      }
      return _results;
    };

    MaxmertkitReactor.prototype.addEventListener = function(eventName, callback) {
      return this.events[eventName].registerCallback(callback);
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
        if ((style.marginLeft != null) && style.marginLeft !== '') {
          width += parseInt(style.marginLeft);
        }
        if ((style.marginRight != null) && style.marginRight !== '') {
          width += parseInt(style.marginRight);
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
        if ((style.marginTop != null) && style.marginTop !== '') {
          height += parseInt(style.marginTop);
        }
        if ((style.marginBottom != null) && style.marginBottom !== '') {
          height += parseInt(style.marginBottom);
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
          if (style != null) {
            if ((style.marginTop != null) && style.marginTop !== '') {
              curtop -= parseInt(style.marginTop);
            }
          }
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

}).call(this);

(function() {
  "use strict";
  var Affix, MaxmertkitHelpers, _activate, _beforeactivate, _beforedeactivate, _deactivate, _id, _instances, _lastScrollY, _name, _onScroll, _requestTick, _setPosition, _ticking,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _name = "affix";

  _instances = [];

  _id = 0;

  _lastScrollY = 0;

  _ticking = false;

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
      this.reactor.registerEvent("initialize." + _name);
      this.reactor.registerEvent("start." + _name);
      this.reactor.registerEvent("stop." + _name);
      this.reactor.dispatchEvent("initialize." + _name);
      this.start();
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

    return Affix;

  })(MaxmertkitHelpers);

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
    this.HEIGHT = this._outerHeight();
    this.CONTAINER_HEIGHT = this._outerHeight(this.container);
    this._addEventListener(this.scroller, 'scroll', this.onScroll);
    this._addClass('_active_');
    if ((_ref = this.onactive) != null) {
      _ref.call(this.el);
    }
    this.reactor.dispatchEvent("start." + _name);
    return this.started = true;
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

  _setPosition = function() {
    var containerTop, style, top;
    containerTop = this.container.offsetTop;
    if (containerTop - this.options.offset <= _lastScrollY) {
      if (containerTop + this.CONTAINER_HEIGHT - this.options.offset - this.HEIGHT >= _lastScrollY) {
        if (this.el.style.position !== 'fixed') {
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
          this.el.style.bottom = 'auto';
        }
      } else {
        if (this.el.style.position !== 'absolute') {
          if (containerTop + this.CONTAINER_HEIGHT - this.options.offset - this.HEIGHT < _lastScrollY + this.HEIGHT) {
            this.el.style.position = 'absolute';
            this.el.style.top = 'auto';
            this.el.style.bottom = "" + this.options.offset + "px";
            this.el.style.width = this.el.offsetWidth;
          }
        }
      }
    } else {
      if (this.el.style.position !== 'relative') {
        this.el.style.position = 'relative';
        this.el.style.top = 'inherit';
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

}).call(this);

(function() {
  "use strict";
  var MaxmertkitHelpers, Scrollspy, _activate, _activateItem, _beforeactivate, _beforedeactivate, _deactivate, _deactivateItem, _id, _instances, _lastScrollY, _name, _onScroll, _requestTick, _spy, _ticking,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _name = "scrollspy";

  _instances = [];

  _id = 0;

  _lastScrollY = 0;

  _ticking = false;

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
      this._setOptions(this.options);
      Scrollspy.__super__.constructor.call(this, this.el, this.options);
      this.reactor.registerEvent("initialize." + _name);
      this.reactor.registerEvent("start." + _name);
      this.reactor.registerEvent("stop." + _name);
      this.reactor.dispatchEvent("initialize." + _name);
      this.start();
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

  _spy = function(event) {
    var i, _ref, _ref1;
    i = 0;
    while (i < this.elements.length) {
      if (((this.elements[i].top <= (_ref = _lastScrollY + this.options.offset) && _ref <= this.elements[i].top + this.elements[i].height)) || (i < this.elements.length - 1 ? (this.elements[i].top <= (_ref1 = _lastScrollY + this.options.offset) && _ref1 <= this.elements[i + 1].top) : void 0)) {
        if (!this._hasClass('_active_', this.elements[i].element)) {
          _activateItem.call(this, i);
        }
      } else {
        if (this._hasClass('_active_', this.elements[i].element) && _lastScrollY + this.options.offset < this.elements[i].top + this.elements[i].height) {
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
    return this.started = true;
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

}).call(this);
