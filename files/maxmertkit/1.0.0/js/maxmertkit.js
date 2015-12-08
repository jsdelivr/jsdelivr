(function() {
  var MaxmertkitEvent, MaxmertkitHelpers, MaxmertkitReactor, _eventCallbacks, _globalRotation, _reactorEvents, _version;

  _eventCallbacks = [];

  _reactorEvents = [];

  _globalRotation = {
    x: 0,
    y: 0,
    z: 0
  };

  _version = "0.0.1";

  MaxmertkitEvent = (function() {
    function MaxmertkitEvent(name) {
      this.name = name;
    }

    MaxmertkitEvent.prototype.callbacks = _eventCallbacks;

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
      return this.events[eventName] = event;
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

  MaxmertkitHelpers = (function() {
    MaxmertkitHelpers.prototype._id = 0;

    MaxmertkitHelpers.prototype._instances = new Array();

    function MaxmertkitHelpers($btn, options) {
      this.$btn = $btn;
      this.options = options;
      this._pushInstance();
      if (this._afterConstruct != null) {
        this._afterConstruct();
      }
    }

    MaxmertkitHelpers.prototype.destroy = function() {
      this.$el.off("." + this._name);
      return this._popInstance();
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

    MaxmertkitHelpers.prototype._setOptions = function(options) {
      return console.warning("Maxmertkit Helpers. There is no standart setOptions function.");
    };

    MaxmertkitHelpers.prototype._pushInstance = function() {
      this._id++;
      return this._instances.push(this);
    };

    MaxmertkitHelpers.prototype._popInstance = function() {
      var index, instance, _i, _len, _ref, _results;
      _ref = this._instances;
      _results = [];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        instance = _ref[index];
        if (instance._id === this._id) {
          this._instances.splice(index, 1);
        }
        _results.push(delete this);
      }
      return _results;
    };

    MaxmertkitHelpers.prototype._selfish = function() {
      var index, instance, _i, _len, _ref, _results;
      _ref = this._instances;
      _results = [];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        instance = _ref[index];
        if (this._id !== instance._id) {
          _results.push(instance.close());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    MaxmertkitHelpers.prototype._getVersion = function() {
      return _version;
    };

    MaxmertkitHelpers.prototype.reactor = new MaxmertkitReactor();

    MaxmertkitHelpers.prototype._setTransform = function(style, transform) {
      style.webkitTransform = transform;
      style.MozTransform = transform;
      return style.transform = transform;
    };

    MaxmertkitHelpers.prototype._equalNodes = function(node1, node2) {
      return node1.get(0) === node2.get(0);
    };

    MaxmertkitHelpers.prototype._deviceMobile = function() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    MaxmertkitHelpers.prototype._refreshSizes = function() {
      this._windowHeight = $(window).height();
      this._windowWidth = $(window).width();
      this._height = this.$el.height();
      this._width = this.$el.width();
      if (this.scroll != null) {
        if (this.scroll[0].nodeName === 'BODY') {
          return this._offset = this.$el.offset();
        } else {
          return this._offset = this.$el.offset();
        }
      } else {
        return this._offset = this.$el.offset();
      }
    };

    MaxmertkitHelpers.prototype._getContainer = function(el) {
      var parent, style;
      parent = el[0] || el;
      while (parent = parent.parentNode) {
        try {
          style = getComputedStyle(parent);
        } catch (_error) {}
        if (style == null) {
          return $(parent);
        }
        if (/(relative)/.test(style['position']) || ((parent != null) && (parent.style != null) && /(relative)/.test(parent.style['position']))) {
          return $(parent);
        }
      }
      return $(document);
    };

    MaxmertkitHelpers.prototype._getScrollParent = function(el) {
      var parent, style;
      parent = el[0] || el;
      while (parent = parent.parentNode) {
        try {
          style = getComputedStyle(parent);
        } catch (_error) {}
        if (style == null) {
          return $(parent);
        }
        if (/(auto|scroll)/.test(style['overflow'] + style['overflow-y'] + style['overflow-x']) && $(parent)[0].nodeName !== 'BODY') {
          return $(parent);
        }
      }
      return $(document);
    };

    MaxmertkitHelpers.prototype._isVisible = function() {
      return this._offset.top - this._windowHeight <= this.scroll.scrollTop() && this.scroll.scrollTop() <= this._offset.top + this._height;
    };

    MaxmertkitHelpers.prototype._getVisiblePercent = function() {
      var current, max, min;
      min = this._offset.top;
      current = this.scroll.scrollTop();
      max = this._offset.top + this._height;
      return (current - min) / (max - min);
    };

    MaxmertkitHelpers.prototype._scrollVisible = function() {
      var current, max, min, percent;
      if (this.scroll != null) {
        min = this._offset.top - this._windowHeight;
        max = this._offset.top + this._height + this._windowHeight;
        current = this.scroll.scrollTop() + this._windowHeight;
        percent = 1 - current / max;
        return (1 > percent && percent > 0);
      } else {
        return true;
      }
    };

    MaxmertkitHelpers.prototype._setGlobalRotation = function(x, y, z) {
      return _globalRotation = {
        x: x,
        y: y,
        z: z
      };
    };

    MaxmertkitHelpers.prototype._getGlobalRotation = function() {
      return _globalRotation;
    };

    return MaxmertkitHelpers;

  })();


  /*
  Adds support for the special browser events 'scrollstart' and 'scrollstop'.
   */

  (function() {
    var special, uid1, uid2;
    special = jQuery.event.special;
    uid1 = "D" + (+new Date());
    uid2 = "D" + (+new Date() + 1);
    special.scrollstart = {
      setup: function() {
        var handler, timer;
        timer = void 0;
        handler = function(evt) {
          var _args;
          _args = arguments;
          if (timer) {
            clearTimeout(timer);
          } else {
            evt.type = "scrollstart";
            jQuery.event.trigger.apply(this, _args);
          }
          timer = setTimeout(function() {
            timer = null;
          }, special.scrollstop.latency);
        };
        jQuery(this).bind("scroll", handler).data(uid1, handler);
      },
      teardown: function() {
        jQuery(this).unbind("scroll", jQuery(this).data(uid1));
      }
    };
    special.scrollstop = {
      latency: 300,
      setup: function() {
        var handler, timer;
        timer = void 0;
        handler = function(evt) {
          var _args;
          _args = arguments;
          if (timer) {
            clearTimeout(timer);
          }
          timer = setTimeout(function() {
            timer = null;
            evt.type = "scrollstop";
            jQuery.event.trigger.apply(this, _args);
          }, special.scrollstop.latency);
        };
        jQuery(this).bind("scroll", handler).data(uid2, handler);
      },
      teardown: function() {
        jQuery(this).unbind("scroll", jQuery(this).data(uid2));
      }
    };
  })();

  window['MaxmertkitHelpers'] = MaxmertkitHelpers;

}).call(this);

(function() {
  var Affix, _beforestart, _beforestop, _id, _instances, _name, _position, _setPosition, _start, _stop,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _name = "affix";

  _instances = [];

  _id = 0;

  Affix = (function(_super) {
    __extends(Affix, _super);

    Affix.prototype._name = _name;

    Affix.prototype._instances = _instances;

    function Affix(el, options) {
      var _options;
      this.el = el;
      this.options = options;
      this.$el = $(this.el);
      this.$el.parent().append('&nbsp;');
      this._id = _id++;
      _options = {
        spy: this.$el.data('spy') || 'affix',
        offset: 5,
        beforeactive: function() {},
        onactive: function() {},
        beforeunactive: function() {},
        onunactive: function() {}
      };
      this.options = this._merge(_options, this.options);
      this.beforeactive = this.options.beforeactive;
      this.onactive = this.options.onactive;
      this.beforeunactive = this.options.beforeunactive;
      this.onunactive = this.options.onunactive;
      this.start();
      Affix.__super__.constructor.call(this, this.$btn, this.options);
    }

    Affix.prototype._setOptions = function(options) {
      var key, value;
      for (key in options) {
        value = options[key];
        if (this.options[key] == null) {
          return console.error("Maxmertkit Affix. You're trying to set unpropriate option.");
        }
        this.options[key] = value;
      }
    };

    Affix.prototype.destroy = function() {
      return Affix.__super__.destroy.apply(this, arguments);
    };

    Affix.prototype.start = function() {
      return _beforestart.call(this);
    };

    Affix.prototype.stop = function() {
      return _beforestop.call(this);
    };

    return Affix;

  })(MaxmertkitHelpers);

  _setPosition = function() {
    var $scrollParent, offset;
    $scrollParent = this._getContainer(this.$el);
    if ($scrollParent[0].firstElementChild.nodeName === "HTML") {
      offset = 0;
    } else {
      offset = $scrollParent.offset().top;
    }
    if ((this.$el.parent() != null) && this.$el.parent().offset() && !this._deviceMobile() && this._windowWidth > 992) {
      if (this.$el.parent().offset().top - this.options.offset <= $(document).scrollTop()) {
        if (this.$el.parent().offset().top + $scrollParent.outerHeight() - this.options.offset - this.$el.outerHeight() >= $(document).scrollTop()) {
          return this.$el.css({
            width: this.$el.width(),
            position: 'fixed',
            top: "" + this.options.offset + "px",
            bottom: 'auto'
          });
        } else {
          return this.$el.css({
            position: 'absolute',
            top: 'auto',
            bottom: "-" + this.options.offset + "px",
            width: this.$el.width()
          });
        }
      } else {
        this.$el.css('position', 'relative');
        return this.$el.css('top', 'inherit');
      }
    }
  };

  _position = function() {
    $(document).on("scroll." + this._name + "." + this._id, (function(_this) {
      return function(event) {
        return _setPosition.call(_this);
      };
    })(this));
    return $(window).on("resize." + this._name + "." + this._id, (function(_this) {
      return function(event) {
        _this._refreshSizes();
        if (_this._windowWidth < 992) {
          _this.$el.css('position', 'relative');
          return _this.$el.css('top', 'inherit');
        } else {
          return _setPosition.call(_this);
        }
      };
    })(this));
  };

  _beforestart = function() {
    var deferred;
    if (this.beforeactive != null) {
      try {
        deferred = this.beforeactive.call(this.$el);
        return deferred.done((function(_this) {
          return function() {
            return _start.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            return _this.$el.trigger("fail." + _this._name);
          };
        })(this));
      } catch (_error) {
        return _start.call(this);
      }
    } else {
      return _start.call(this);
    }
  };

  _start = function() {
    this._refreshSizes();
    _position.call(this);
    this.$el.addClass('_active_');
    this.$el.trigger("started." + this._name);
    if (this.onactive != null) {
      try {
        return this.onactive.call(this.$el);
      } catch (_error) {}
    }
  };

  _beforestop = function() {
    var deferred;
    if (this.beforeunactive != null) {
      try {
        deferred = this.beforeunactive.call(this.$el);
        return deferred.done((function(_this) {
          return function() {
            return _stop.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            return _this.$el.trigger("fail." + _this._name);
          };
        })(this));
      } catch (_error) {
        return _stop.call(this);
      }
    } else {
      return _stop.call(this);
    }
  };

  _stop = function() {
    this.$el.removeClass('_active_');
    $(document).off("scroll." + this._name + "." + this._id);
    this.$el.trigger("stopped." + this._name);
    if (this.onunactive != null) {
      try {
        return this.onunactive.call(this.$el);
      } catch (_error) {}
    }
  };

  $.fn[_name] = function(options) {
    return this.each(function() {
      if (!$.data(this, "kit-" + _name)) {
        $.data(this, "kit-" + _name, new Affix(this, options));
      } else {
        if (typeof options === "object") {
          $.data(this, "kit-" + _name)._setOptions(options);
        } else {
          if (typeof options === "string" && options.charAt(0) !== "_") {
            $.data(this, "kit-" + _name)[options];
          }
        }
      }
    });
  };

}).call(this);

(function() {
  var Button, _activate, _beforeactive, _beforeunactive, _deactivate, _id, _instances, _name,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _name = "button";

  _instances = [];

  _id = 0;

  Button = (function(_super) {
    __extends(Button, _super);

    Button.prototype._name = _name;

    Button.prototype._instances = _instances;

    function Button(btn, options) {
      var _options;
      this.btn = btn;
      this.options = options;
      this.$btn = $(this.btn);
      this._id = _id++;
      _options = {
        toggle: this.$btn.data('toggle') || 'button',
        group: this.$btn.data('group') || null,
        type: this.$btn.data('type') || 'button',
        event: "click",
        beforeactive: function() {},
        onactive: function() {},
        beforeunactive: function() {},
        onunactive: function() {}
      };
      this.options = this._merge(_options, this.options);
      this.beforeactive = this.options.beforeactive;
      this.onactive = this.options.onactive;
      this.beforeunactive = this.options.beforeunactive;
      this.onunactive = this.options.onunactive;
      this.$btn.on(this.options.event, (function(_this) {
        return function() {
          if (!_this.$btn.hasClass('_active_')) {
            return _this.activate();
          } else {
            return _this.deactivate();
          }
        };
      })(this));
      this.$btn.on(this.options.eventClose, (function(_this) {
        return function() {
          if (_this.options.event !== _this.options.eventClose) {
            return _this.deactivate();
          }
        };
      })(this));
      this.$btn.removeClass('_active_ _disabled_ _loading_');
      Button.__super__.constructor.call(this, this.$btn, this.options);
    }

    Button.prototype._setOptions = function(options) {
      var key, value;
      for (key in options) {
        value = options[key];
        if (this.options[key] == null) {
          return console.error("Maxmertkit Button. You're trying to set unpropriate option.");
        }
        switch (key) {
          case 'event':
            this.$btn.off("" + this.options.event + "." + this._name);
            this.options.event = value;
            this.$btn.on("" + this.options.event + "." + this._name, (function(_this) {
              return function() {
                if (_this.$btn.hasClass('_active_')) {
                  return _this.deactivate();
                } else {
                  return _this.activate();
                }
              };
            })(this));
            break;
          default:
            this.options[key] = value;
            if (typeof value === 'function') {
              this[key] = this.options[key];
            }
        }
      }
    };

    Button.prototype.destroy = function() {
      this.$btn.off("." + this._name);
      return Button.__super__.destroy.apply(this, arguments);
    };

    Button.prototype.activate = function() {
      return _beforeactive.call(this);
    };

    Button.prototype.deactivate = function() {
      if (this.$btn.hasClass('_active_')) {
        return _beforeunactive.call(this);
      }
    };

    Button.prototype.disable = function() {
      return this.$btn.toggleClass('_disabled_');
    };

    return Button;

  })(MaxmertkitHelpers);

  _beforeactive = function() {
    var deferred;
    if (this.options.selfish) {
      this._selfish();
    }
    if (this.beforeactive != null) {
      try {
        deferred = this.beforeactive.call(this.$btn);
        return deferred.done((function(_this) {
          return function() {
            return _activate.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            return _this.$btn.trigger("fail." + _this._name);
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
    var button, _i, _len, _ref;
    if (this.options.type === 'radio') {
      _ref = this._instances;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        button = _ref[_i];
        if (this._id !== button._id && button.options.type === 'radio' && button.options.group === this.options.group) {
          button.deactivate();
        }
      }
    }
    this.$btn.addClass('_active_');
    this.$btn.trigger("activated." + this._name);
    if (this.onactive != null) {
      try {
        return this.onactive.call(this.$btn);
      } catch (_error) {}
    }
  };

  _beforeunactive = function() {
    var deferred;
    if (this.beforeunactive != null) {
      try {
        deferred = this.beforeunactive.call(this.$btn);
        return deferred.done((function(_this) {
          return function() {
            return _deactivate.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            return _this.$btn.trigger("fail." + _this._name);
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
    this.$btn.removeClass('_active_');
    this.$btn.trigger("deactivated." + this._name);
    if (this.onunactive != null) {
      try {
        return this.onunactive.call(this.$btn);
      } catch (_error) {}
    }
  };

  $.fn[_name] = function(options) {
    return this.each(function() {
      if (!$.data(this, "kit-" + _name)) {
        $.data(this, "kit-" + _name, new Button(this, options));
      } else {
        if (typeof options === "object") {
          $.data(this, "kit-" + _name)._setOptions(options);
        } else {
          if (typeof options === "string" && options.charAt(0) !== "_") {
            $.data(this, "kit-" + _name)[options];
          } else {
            console.error("Maxmertkit Button. You passed into the " + _name + " something wrong.\n" + options);
          }
        }
      }
    });
  };

  $(window).on('load', function() {
    return $('[data-toggle="button"]').each(function() {
      var $btn;
      $btn = $(this);
      return $btn.button($btn.data());
    });
  });

}).call(this);

(function() {
  var Modal, _beforeclose, _beforeopen, _close, _instances, _name, _open, _pushStart, _pushStop,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _name = "modal";

  _instances = [];

  Modal = (function(_super) {
    __extends(Modal, _super);

    Modal.prototype._name = _name;

    Modal.prototype._instances = _instances;

    function Modal(btn, options) {
      var _options;
      this.btn = btn;
      this.options = options;
      this.$btn = $(this.btn);
      _options = {
        target: this.$btn.data('target'),
        toggle: this.$btn.data('toggle') || 'modal',
        event: "click." + this._name,
        eventClose: "click." + this._name,
        backdrop: this.$btn.data('backdrop') || false,
        push: this.$btn.data('push') || false,
        beforeactive: function() {},
        onactive: function() {},
        beforeunactive: function() {},
        onunactive: function() {}
      };
      this.options = this._merge(_options, this.options);
      this.$el = $(document).find(this.options.target);
      this.$btn.on(this.options.event, (function(_this) {
        return function(event) {
          event.preventDefault();
          return _this.open();
        };
      })(this));
      this._setOptions(this.options);
      this.$el.find("*[data-dismiss='modal']").on(this.options.event, (function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
      Modal.__super__.constructor.call(this, this.$btn, this.options);
    }

    Modal.prototype._setOptions = function(options) {
      var key, push, value;
      for (key in options) {
        value = options[key];
        if (this.options[key] == null) {
          return console.error("Maxmertkit Modal. You're trying to set unpropriate option – " + key);
        }
        switch (key) {
          case 'backdrop':
            if (value) {
              this.$el.on("click." + this._name, (function(_this) {
                return function(event) {
                  if ($(event.target).hasClass('-modal _active_') || $(event.target).hasClass('-carousel')) {
                    return _this.close();
                  }
                };
              })(this));
            }
            break;
          case 'push':
            if (value) {
              push = $(document).find(value);
              if (push.length) {
                this.$push = $(document).find(value);
              }
            }
        }
        this.options[key] = value;
        if (typeof value === 'function') {
          this[key] = this.options[key];
        }
      }
    };

    Modal.prototype.destroy = function() {
      this.$btn.off("." + this._name);
      return Modal.__super__.destroy.apply(this, arguments);
    };

    Modal.prototype.open = function() {
      return _beforeopen.call(this);
    };

    Modal.prototype.close = function() {
      return _beforeclose.call(this);
    };

    return Modal;

  })(MaxmertkitHelpers);

  _pushStart = function() {
    if (this.$push != null) {
      this.$push.addClass('-start--');
      return this.$push.removeClass('-stop--');
    }
  };

  _pushStop = function() {
    if (this.$push != null) {
      this.$push.addClass('-stop--');
      this.$push.removeClass('-start--');
      if ((this.$push[0] != null) && (this.$push[0].style != null) && (this.$push[0].style['-webkit-overflow-scrolling'] != null)) {
        return this.$push[0].style['-webkit-overflow-scrolling'] = 'auto';
      }
    }
  };

  _beforeopen = function() {
    var deferred;
    if (this.beforeopen != null) {
      try {
        deferred = this.beforeopen.call(this.$btn);
        return deferred.done((function(_this) {
          return function() {
            return _open.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            return _this.$el.trigger("fail." + _this._name);
          };
        })(this));
      } catch (_error) {
        return _open.call(this);
      }
    } else {
      return _open.call(this);
    }
  };

  _open = function() {
    if (this.$push != null) {
      $('body').addClass('_perspective_');
    }
    this.$el.css({
      display: 'table'
    });
    setTimeout((function(_this) {
      return function() {
        _this.$el.addClass('_visible_ -start--');
        _this.$el.find('.-dialog').addClass('_visible_ -start--');
        return _pushStart.call(_this);
      };
    })(this), 1);
    $('body').addClass('_no-scroll_');
    this.$el.trigger("opened." + this._name);
    if (this.onopen != null) {
      try {
        return this.onopen.call(this.$btn);
      } catch (_error) {}
    }
  };

  _beforeclose = function() {
    var deferred;
    if (this.beforeclose != null) {
      try {
        deferred = this.beforeclose.call(this.$btn);
        return deferred.done((function(_this) {
          return function() {
            return _close.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            return _this.$el.trigger("fail." + _this._name);
          };
        })(this));
      } catch (_error) {
        return _close.call(this);
      }
    } else {
      return _close.call(this);
    }
  };

  _close = function() {
    this.$el.addClass('-stop--');
    this.$el.find('.-dialog').addClass('-stop--');
    _pushStop.call(this);
    setTimeout((function(_this) {
      return function() {
        _this.$el.removeClass('_visible_ -start-- -stop--');
        _this.$el.find('.-dialog').removeClass('_visible_ -start-- -stop--');
        $('body').removeClass('_no-scroll_');
        if (_this.$push != null) {
          $('body').removeClass('_perspective_');
        }
        return _this.$el.hide();
      };
    })(this), 1000);
    this.$el.trigger("closed." + this._name);
    if (this.onclose != null) {
      try {
        return this.onclose.call(this.$btn);
      } catch (_error) {}
    }
  };

  $.fn[_name] = function(options) {
    return this.each(function() {
      if (!$.data(this, "kit-" + _name)) {
        $.data(this, "kit-" + _name, new Modal(this, options));
      } else {
        if (typeof options === "object") {
          $.data(this, "kit-" + _name)._setOptions(options);
        } else {
          if (typeof options === "string" && options.charAt(0) !== "_") {
            $.data(this, "kit-" + _name)[options];
          } else {
            console.error("Maxmertkit error. You passed into the " + _name + " something wrong.");
          }
        }
      }
    });
  };

  $(window).on('load', function() {
    return $('[data-toggle="modal"]').each(function() {
      var $modal;
      $modal = $(this);
      return $modal.modal($modal.data());
    });
  });

}).call(this);

(function() {
  var Popup, _beforeclose, _beforeopen, _close, _id, _instances, _name, _open, _position,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _name = "popup";

  _instances = [];

  _id = 0;

  Popup = (function(_super) {
    __extends(Popup, _super);

    Popup.prototype._name = _name;

    Popup.prototype._instances = _instances;

    function Popup(btn, options) {
      var _options;
      this.btn = btn;
      this.options = options;
      this.$btn = $(this.btn);
      this._id = _id++;
      _options = {
        target: this.$btn.data('target'),
        toggle: this.$btn.data('toggle') || 'popup',
        event: "click",
        eventClose: "click",
        positionVertical: 'top',
        positionHorizontal: 'center',
        offset: {
          horizontal: 5,
          vertical: 5
        },
        closeUnfocus: false,
        selfish: true
      };
      this.options = this._merge(_options, this.options);
      this.beforeopen = this.options.beforeopen;
      this.onopen = this.options.onopen;
      this.beforeclose = this.options.beforeclose;
      this.onclose = this.options.onclose;
      this.$el = $(document).find(this.options.target);
      this.$btn.on(this.options.event, (function(_this) {
        return function() {
          if (!_this.$el.is(':visible')) {
            return _this.open();
          } else {
            return _this.close();
          }
        };
      })(this));
      this.$btn.on(this.options.eventClose, (function(_this) {
        return function() {
          if (_this.options.event !== _this.options.eventClose) {
            return _this.close();
          }
        };
      })(this));
      this.$el.find("*[data-dismiss='popup']").on(this.options.event, (function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
      if (this.options.closeUnfocus) {
        $(document).on('click', (function(_this) {
          return function(event) {
            var classes;
            classes = '.' + _this.$el[0].className.split(' ').join('.');
            if (!$(event.target).closest(classes).length && _this.$el.is(':visible') && !_this.$el.is(':animated') && $(event.target)[0] !== _this.$btn[0]) {
              return _this.close();
            }
          };
        })(this));
      }
      this.$el.removeClass('_top_ _bottom_ _left_ _right_');
      this.$el.addClass("_" + this.options.positionVertical + "_ _" + this.options.positionHorizontal + "_");
      Popup.__super__.constructor.call(this, this.$btn, this.options);
    }

    Popup.prototype._setOptions = function(options) {
      var key, value;
      for (key in options) {
        value = options[key];
        if (this.options[key] == null) {
          return console.error("Maxmertkit Popup. You're trying to set unpropriate option.");
        }
        switch (key) {
          case 'target':
            this.$el = $(document).find(this.options.target);
            this.$el.find("*[data-dismiss='popup']").on(this.options.event, (function(_this) {
              return function() {
                return _this.close();
              };
            })(this));
            break;
          case 'event':
            this.$btn.off("" + this.options.event + "." + this._name);
            this.options.event = value;
            this.$btn.on("" + this.options.event + "." + this._name, (function(_this) {
              return function() {
                if (!_this.$el.is(':visible')) {
                  return _this.open();
                } else {
                  return _this.close();
                }
              };
            })(this));
            break;
          case 'eventClose':
            this.$btn.off("" + this.options.eventClose + "." + this._name);
            this.options.eventClose = value;
            this.$btn.on("" + this.options.eventClose + "." + this._name, (function(_this) {
              return function() {
                if (_this.options.event !== _this.options.eventClose) {
                  return _this.close();
                }
              };
            })(this));
            break;
          case 'closeUnfocus':
            this.options.closeUnfocus = value;
            $(document).off("click." + this._name);
            if (this.options.closeUnfocus) {
              $(document).on("click." + this._name, (function(_this) {
                return function(event) {
                  var classes;
                  classes = '.' + _this.$el[0].className.split(' ').join('.');
                  if (!$(event.target).closest(classes).length && _this.$el.is(':visible') && !_this.$el.is(':animated') && $(event.target)[0] !== _this.$btn[0]) {
                    return _this.close();
                  }
                };
              })(this));
            }
            break;
          case 'positionVertical':
            this.$el.removeClass("_top_ _middle_ _bottom_");
            this.options.positionVertical = value;
            this.$el.addClass("_" + this.options.positionVertical + "_");
            break;
          case 'positionHorizontal':
            this.$el.removeClass("_left_ _center_ _right_");
            this.options.positionHorizontal = value;
            this.$el.addClass("_" + this.options.positionHorizontal + "_");
            break;
          default:
            this.options[key] = value;
        }
      }
    };

    Popup.prototype.destroy = function() {
      this.$btn.off("." + this._name);
      return Popup.__super__.destroy.apply(this, arguments);
    };

    Popup.prototype.open = function() {
      return _beforeopen.call(this);
    };

    Popup.prototype.close = function() {
      return _beforeclose.call(this);
    };

    return Popup;

  })(MaxmertkitHelpers);

  _position = function() {
    var newLeft, newTop, position, positionBtn, scrollParent, scrollParentBtn, size, sizeBtn;
    scrollParent = this._getScrollParent(this.$el);
    scrollParentBtn = this._getScrollParent(this.$btn);
    positionBtn = this.$btn.offset();
    position = this.$el.offset();
    if ((scrollParent != null) && (scrollParent[0] == null) || scrollParent[0].activeElement.nodeName !== 'BODY') {
      positionBtn.top = positionBtn.top - $(scrollParent).offset().top;
      positionBtn.left = positionBtn.left - $(scrollParent).offset().left;
    }
    sizeBtn = {
      width: this.$btn.outerWidth(),
      height: this.$btn.outerHeight()
    };
    size = {
      width: this.$el.outerWidth(),
      height: this.$el.outerHeight()
    };
    newTop = newLeft = 0;
    switch (this.options.positionVertical) {
      case 'top':
        newTop = positionBtn.top - size.height - this.options.offset.vertical;
        break;
      case 'bottom':
        newTop = positionBtn.top + sizeBtn.height + this.options.offset.vertical;
        break;
      case 'middle' || 'center':
        newTop = positionBtn.top + sizeBtn.height / 2 - size.height / 2;
    }
    switch (this.options.positionHorizontal) {
      case 'center' || 'middle':
        newLeft = positionBtn.left + sizeBtn.width / 2 - size.width / 2;
        break;
      case 'left':
        newLeft = positionBtn.left - size.width - this.options.offset.horizontal;
        break;
      case 'right':
        newLeft = positionBtn.left + sizeBtn.width + this.options.offset.horizontal;
    }
    return this.$el.css({
      left: newLeft,
      top: newTop
    });
  };

  _beforeopen = function() {
    var deferred;
    if (this.options.selfish) {
      this._selfish();
    }
    if (this.beforeopen != null) {
      try {
        deferred = this.beforeopen.call(this.$btn);
        return deferred.done((function(_this) {
          return function() {
            return _open.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            return _this.$el.trigger("fail." + _this._name);
          };
        })(this));
      } catch (_error) {
        return _open.call(this);
      }
    } else {
      return _open.call(this);
    }
  };

  _open = function() {
    _position.call(this);
    this.$el.addClass('_active_');
    this.$el.trigger("opened." + this._name);
    if (this.onopen != null) {
      try {
        return this.onopen.call(this.$btn);
      } catch (_error) {}
    }
  };

  _beforeclose = function() {
    var deferred;
    if (this.beforeclose != null) {
      try {
        deferred = this.beforeclose.call(this.$btn);
        return deferred.done((function(_this) {
          return function() {
            return _close.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            return _this.$el.trigger("fail." + _this._name);
          };
        })(this));
      } catch (_error) {
        return _close.call(this);
      }
    } else {
      return _close.call(this);
    }
  };

  _close = function() {
    this.$el.removeClass('_active_');
    this.$el.trigger("closed." + this._name);
    if (this.onclose != null) {
      try {
        return this.onclose.call(this.$btn);
      } catch (_error) {}
    }
  };

  $.fn[_name] = function(options) {
    return this.each(function() {
      if (!$.data(this, "kit-" + _name)) {
        $.data(this, "kit-" + _name, new Popup(this, options));
      } else {
        if (typeof options === "object") {
          $.data(this, "kit-" + _name)._setOptions(options);
        } else {
          if (typeof options === "string" && options.charAt(0) !== "_") {
            $.data(this, "kit-" + _name)[options];
          } else {
            console.error("Maxmertkit Popup. You passed into the " + _name + " something wrong.");
          }
        }
      }
    });
  };

}).call(this);

(function() {
  var Scrollspy, _activate, _activateItem, _beforestart, _beforestop, _deactivateItem, _id, _instances, _name, _refresh, _spy, _start, _stop,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _name = "scrollspy";

  _instances = [];

  _id = 0;

  Scrollspy = (function(_super) {
    __extends(Scrollspy, _super);

    Scrollspy.prototype._name = _name;

    Scrollspy.prototype._instances = _instances;

    function Scrollspy(el, options) {
      var _options;
      this.el = el;
      this.options = options;
      this.$el = $(this.el);
      this._id = _id++;
      _options = {
        spy: this.$el.data('spy') || 'scroll',
        target: this.$el.data('target') || 'body',
        offset: 0,
        elements: 'li a',
        elementsAttr: 'href',
        noMobile: this.$el.data("no-mobile") || true,
        beforeactive: function() {},
        onactive: function() {},
        beforeunactive: function() {},
        onunactive: function() {}
      };
      this.options = this._merge(_options, this.options);
      this.beforeactive = this.options.beforeactive;
      this.onactive = this.options.onactive;
      this.beforeunactive = this.options.beforeunactive;
      this.onunactive = this.options.onunactive;
      this.start();
      Scrollspy.__super__.constructor.call(this, this.$btn, this.options);
    }

    Scrollspy.prototype._setOptions = function(options) {
      var key, value;
      for (key in options) {
        value = options[key];
        if (this.options[key] == null) {
          return console.error("Maxmertkit Scrollspy. You're trying to set unpropriate option.");
        }
        this.options[key] = value;
      }
    };

    Scrollspy.prototype.destroy = function() {
      return Scrollspy.__super__.destroy.apply(this, arguments);
    };

    Scrollspy.prototype.refresh = function() {
      return _refresh.call(this);
    };

    Scrollspy.prototype.start = function() {
      return _beforestart.call(this);
    };

    Scrollspy.prototype.stop = function() {
      return _beforestop.call(this);
    };

    return Scrollspy;

  })(MaxmertkitHelpers);

  _activateItem = function(itemNumber) {
    var element, _i, _len, _ref;
    _ref = this.elements;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      element = _ref[_i];
      element.menu.removeClass('_active_');
    }
    return this.elements[itemNumber].menu.addClass('_active_').parents('li').addClass('_active_');
  };

  _deactivateItem = function(itemNumber) {
    return this.elements[itemNumber].menu.removeClass('_active_');
  };

  _refresh = function() {
    this.elements = [];
    return this.$el.find(this.options.elements).each((function(_this) {
      return function(index, el) {
        var item, link;
        link = $(el).attr(_this.options.elementsAttr);
        if (link != null) {
          item = $(_this.options.target).find(link);
          if (item.length) {
            return _this.elements.push({
              menu: $(el).parent(),
              item: item.parent(),
              itemHeight: item.parent().height(),
              offsetTop: item.position().top
            });
          }
        }
      };
    })(this));
  };

  _spy = function(event) {
    var i, _ref, _results;
    i = 0;
    _results = [];
    while (i < this.elements.length) {
      if ((this.elements[i].offsetTop <= (_ref = (event.currentTarget.scrollTop || event.currentTarget.scrollY) + this.options.offset) && _ref <= this.elements[i].offsetTop + this.elements[i].itemHeight)) {
        if (!this.elements[i].menu.hasClass('_active_')) {
          _activateItem.call(this, i);
        }
      } else {
        if (this.elements[i].menu.hasClass('_active_') && (event.currentTarget.scrollTop || event.currentTarget.scrollY) + this.options.offset < this.elements[i].offsetTop + this.elements[i].itemHeight) {
          _deactivateItem.call(this, i);
        }
      }
      _results.push(i++);
    }
    return _results;
  };

  _activate = function() {
    var target;
    if (this.options.target === 'body') {
      target = window;
    } else {
      target = this.options.target;
    }
    return $(target).on("scroll." + this._name + "." + this._id, (function(_this) {
      return function(event) {
        return _spy.call(_this, event);
      };
    })(this));
  };

  _beforestart = function() {
    var deferred;
    this.refresh();
    if (this.beforeactive != null) {
      try {
        deferred = this.beforeactive.call(this.$el);
        return deferred.done((function(_this) {
          return function() {
            return _start.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            return _this.$el.trigger("fail." + _this._name);
          };
        })(this));
      } catch (_error) {
        return _start.call(this);
      }
    } else {
      return _start.call(this);
    }
  };

  _start = function() {
    _activate.call(this);
    this.$el.addClass('_active_');
    this.$el.trigger("started." + this._name);
    if (this.onactive != null) {
      try {
        return this.onactive.call(this.$el);
      } catch (_error) {}
    }
  };

  _beforestop = function() {
    var deferred;
    if (this.beforeunactive != null) {
      try {
        deferred = this.beforeunactive.call(this.$el);
        return deferred.done((function(_this) {
          return function() {
            return _stop.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            return _this.$el.trigger("fail." + _this._name);
          };
        })(this));
      } catch (_error) {
        return _stop.call(this);
      }
    } else {
      return _stop.call(this);
    }
  };

  _stop = function() {
    var target;
    if (this.options.target === 'body') {
      target = window;
    } else {
      target = this.options.target;
    }
    $(target).off("scroll." + this._name + "." + this._id);
    this.$el.trigger("stopped." + this._name);
    if (this.onunactive != null) {
      try {
        return this.onunactive.call(this.$el);
      } catch (_error) {}
    }
  };

  $.fn[_name] = function(options) {
    return this.each(function() {
      if (!$.data(this, "kit-" + _name)) {
        $.data(this, "kit-" + _name, new Scrollspy(this, options));
      } else {
        if (typeof options === "object") {
          $.data(this, "kit-" + _name)._setOptions(options);
        } else {
          if (typeof options === "string" && options.charAt(0) !== "_") {
            $.data(this, "kit-" + _name)[options];
          } else {
            console.error("Maxmertkit Affix. You passed into the " + _name + " something wrong.");
          }
        }
      }
    });
  };

}).call(this);

(function() {
  var Tabs, _activate, _beforeactive, _beforeunactive, _deactivate, _id, _instances, _name,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _name = "tabs";

  _instances = [];

  _id = 0;

  Tabs = (function(_super) {
    __extends(Tabs, _super);

    Tabs.prototype._name = _name;

    Tabs.prototype._instances = _instances;

    function Tabs(tab, options) {
      var _options;
      this.tab = tab;
      this.options = options;
      this.$tab = $(this.tab);
      this._id = _id++;
      _options = {
        toggle: this.$tab.data('toggle') || 'tabs',
        group: this.$tab.data('group') || null,
        target: this.$tab.data('target') || null,
        event: "click",
        active: 0,
        beforeactive: function() {},
        onactive: function() {},
        beforeunactive: function() {},
        onunactive: function() {}
      };
      this.options = this._merge(_options, this.options);
      this.beforeactive = this.options.beforeactive;
      this.onactive = this.options.onactive;
      this.beforeunactive = this.options.beforeunactive;
      this.onunactive = this.options.onunactive;
      this.$tab.on(this.options.event, (function(_this) {
        return function() {
          if (!_this.$tab.hasClass('_active_')) {
            return _this.activate();
          }
        };
      })(this));
      this.$content = $(document).find(this.options.target);
      this.$content.hide();
      Tabs.__super__.constructor.call(this, this.$tab, this.options);
    }

    Tabs.prototype._setOptions = function(options) {
      var key, value;
      for (key in options) {
        value = options[key];
        if (this.options[key] == null) {
          return console.error("Maxmertkit Tabs. You're trying to set unpropriate option.");
        }
        switch (key) {
          case 'event':
            this.$tab.off("" + this.options.event + "." + this._name);
            this.options.event = value;
            this.$tab.on("" + this.options.event + "." + this._name, (function(_this) {
              return function() {
                if (_this.$tab.hasClass('_active_')) {
                  return _this.deactivate();
                } else {
                  return _this.activate();
                }
              };
            })(this));
            break;
          case 'target':
            this.options.target = value;
            this.$content = $(document).find(this.options.target);
            break;
          default:
            this.options[key] = value;
            if (typeof value === 'function') {
              this[key] = this.options[key];
            }
        }
      }
    };

    Tabs.prototype._afterConstruct = function() {
      var i;
      i = 0;
      while (i < this._instances && this._instances[i].group !== this.options.group) {
        i++;
      }
      return this._instances[i].activate();
    };

    Tabs.prototype.destroy = function() {
      this.$tab.off("." + this._name);
      return Tabs.__super__.destroy.apply(this, arguments);
    };

    Tabs.prototype.activate = function() {
      return _beforeactive.call(this);
    };

    Tabs.prototype.deactivate = function() {
      if (this.$tab.hasClass('_active_')) {
        return _beforeunactive.call(this);
      }
    };

    Tabs.prototype.disable = function() {
      return this.$tab.toggleClass('_disabled_');
    };

    return Tabs;

  })(MaxmertkitHelpers);

  _beforeactive = function() {
    var deferred;
    if (this.options.selfish) {
      this._selfish();
    }
    if (this.beforeactive != null) {
      try {
        deferred = this.beforeactive.call(this.$tab);
        return deferred.done((function(_this) {
          return function() {
            return _activate.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            return _this.$tab.trigger("fail." + _this._name);
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
    var tab, _i, _len, _ref;
    _ref = this._instances;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tab = _ref[_i];
      if (this._id !== tab._id && tab.options.group === this.options.group) {
        tab.deactivate();
      }
    }
    this.$tab.addClass('_active_');
    this.$tab.trigger("activated." + this._name);
    this.$content.show();
    if (this.onactive != null) {
      try {
        return this.onactive.call(this.$tab);
      } catch (_error) {}
    }
  };

  _beforeunactive = function() {
    var deferred;
    if (this.beforeunactive != null) {
      try {
        deferred = this.beforeunactive.call(this.$tab);
        return deferred.done((function(_this) {
          return function() {
            return _deactivate.call(_this);
          };
        })(this)).fail((function(_this) {
          return function() {
            return _this.$tab.trigger("fail." + _this._name);
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
    this.$tab.removeClass('_active_');
    this.$tab.trigger("deactivated." + this._name);
    this.$content.hide();
    if (this.onunactive != null) {
      try {
        return this.onunactive.call(this.$tab);
      } catch (_error) {}
    }
  };

  $.fn[_name] = function(options) {
    return this.each(function() {
      if (!$.data(this, "kit-" + _name)) {
        $.data(this, "kit-" + _name, new Tabs(this, options));
      } else {
        if (typeof options === "object") {
          $.data(this, "kit-" + _name)._setOptions(options);
        } else {
          if (typeof options === "string" && options.charAt(0) !== "_") {
            $.data(this, "kit-" + _name)[options];
          } else {
            console.error("Maxmertkit Tabs. You passed into the " + _name + " something wrong.");
          }
        }
      }
    });
  };

}).call(this);
