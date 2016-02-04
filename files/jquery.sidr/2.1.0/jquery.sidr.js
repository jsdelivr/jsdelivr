(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _sidr = require('./js/sidr');

var _sidr2 = _interopRequireDefault(_sidr);

var _fnSidr = require('./js/fnSidr');

var _fnSidr2 = _interopRequireDefault(_fnSidr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Sidr
 * https://github.com/artberri/sidr
 *
 * Copyright (c) 2013-2016 Alberto Varela
 * Licensed under the MIT license.
 */

var $ = jQuery;

$.sidr = _sidr2.default;
$.fn.sidr = _fnSidr2.default;

},{"./js/fnSidr":3,"./js/sidr":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _menu = require('./menu');

var _menu2 = _interopRequireDefault(_menu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = jQuery;

function execute(action, name, callback) {
  var sidr = new _menu2.default(name);

  switch (action) {
    case 'open':
      sidr.open(callback);
      break;
    case 'close':
      sidr.close(callback);
      break;
    case 'toggle':
      sidr.toggle(callback);
      break;
    default:
      $.error('Method ' + action + ' does not exist on jQuery.sidr');
      break;
  }
}

exports.default = execute;

},{"./menu":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

var _status = require('./status');

var _status2 = _interopRequireDefault(_status);

var _sidr = require('./sidr');

var _sidr2 = _interopRequireDefault(_sidr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = jQuery;

function fillContent($sideMenu, settings) {
  // The menu content
  if (typeof settings.source === 'function') {
    var newContent = settings.source(name);

    $sideMenu.html(newContent);
  } else if (typeof settings.source === 'string' && _helper2.default.isUrl(settings.source)) {
    $.get(settings.source, function (data) {
      $sideMenu.html(data);
    });
  } else if (typeof settings.source === 'string') {
    var htmlContent = '',
        selectors = settings.source.split(',');

    $.each(selectors, function (index, element) {
      htmlContent += '<div class="sidr-inner">' + $(element).html() + '</div>';
    });

    // Renaming ids and classes
    if (settings.renaming) {
      var $htmlContent = $('<div />').html(htmlContent);

      $htmlContent.find('*').each(function (index, element) {
        var $element = $(element);

        _helper2.default.addPrefixes($element);
      });
      htmlContent = $htmlContent.html();
    }

    $sideMenu.html(htmlContent);
  } else if (settings.source !== null) {
    $.error('Invalid Sidr Source');
  }

  return $sideMenu;
}

function fnSidr(options) {
  var transitions = _helper2.default.transitions,
      settings = $.extend({
    name: 'sidr', // Name for the 'sidr'
    speed: 200, // Accepts standard jQuery effects speeds (i.e. fast, normal or milliseconds)
    side: 'left', // Accepts 'left' or 'right'
    source: null, // Override the source of the content.
    renaming: true, // The ids and classes will be prepended with a prefix when loading existent content
    body: 'body', // Page container selector,
    displace: true, // Displace the body content or not
    timing: 'ease', // Timing function for CSS transitions
    method: 'toggle', // The method to call when element is clicked
    onOpen: function onOpen() {},
    // Callback when sidr start opening
    onClose: function onClose() {},
    // Callback when sidr start closing
    onOpenEnd: function onOpenEnd() {},
    // Callback when sidr end opening
    onCloseEnd: function onCloseEnd() {} // Callback when sidr end closing

  }, options),
      name = settings.name,
      $sideMenu = $('#' + name);

  // If the side menu do not exist create it
  if ($sideMenu.length === 0) {
    $sideMenu = $('<div />').attr('id', name).appendTo($('body'));
  }

  // Add transition to menu if are supported
  if (transitions.supported) {
    $sideMenu.css(transitions.property, settings.side + ' ' + settings.speed / 1000 + 's ' + settings.timing);
  }

  // Adding styles and options
  $sideMenu.addClass('sidr').addClass(settings.side).data({
    speed: settings.speed,
    side: settings.side,
    body: settings.body,
    displace: settings.displace,
    timing: settings.timing,
    method: settings.method,
    onOpen: settings.onOpen,
    onClose: settings.onClose,
    onOpenEnd: settings.onOpenEnd,
    onCloseEnd: settings.onCloseEnd
  });

  $sideMenu = fillContent($sideMenu, settings);

  return this.each(function () {
    var $this = $(this),
        data = $this.data('sidr'),
        flag = false;

    // If the plugin hasn't been initialized yet
    if (!data) {
      _status2.default.moving = false;
      _status2.default.opened = false;

      $this.data('sidr', name);

      $this.bind('touchstart click', function (event) {
        event.preventDefault();

        if (!flag) {
          flag = true;
          (0, _sidr2.default)(settings.method, name);

          setTimeout(function () {
            flag = false;
          }, 100);
        }
      });
    }
  });
}

exports.default = fnSidr;

},{"./helper":4,"./sidr":6,"./status":7}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var helper = {
  // Check for valids urls
  // From : http://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-an-url

  isUrl: function isUrl(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

    if (pattern.test(str)) {
      return true;
    } else {
      return false;
    }
  },

  // Add sidr prefixes
  addPrefixes: function addPrefixes($element) {
    this.addPrefix($element, 'id');
    this.addPrefix($element, 'class');
    $element.removeAttr('style');
  },
  addPrefix: function addPrefix($element, attribute) {
    var toReplace = $element.attr(attribute);

    if (typeof toReplace === 'string' && toReplace !== '' && toReplace !== 'sidr-inner') {
      $element.attr(attribute, toReplace.replace(/([A-Za-z0-9_.\-]+)/g, 'sidr-' + attribute + '-$1'));
    }
  },

  // Check if transitions is supported
  transitions: function () {
    var body = document.body || document.documentElement,
        style = body.style,
        supported = false,
        property = 'transition';

    if (property in style) {
      supported = true;
    } else {
      (function () {
        var prefixes = ['moz', 'webkit', 'o', 'ms'],
            prefix = undefined,
            i = undefined;

        property = property.charAt(0).toUpperCase() + property.substr(1);
        supported = function () {
          for (i = 0; i < prefixes.length; i++) {
            prefix = prefixes[i];
            if (prefix + property in style) {
              return true;
            }
          }

          return false;
        }();
        property = supported ? '-' + prefix.toLowerCase() + '-' + property.toLowerCase() : null;
      })();
    }

    return {
      supported: supported,
      property: property
    };
  }()
};

exports.default = helper;

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*eslint callback-return: 0*/

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _status = require('./status');

var _status2 = _interopRequireDefault(_status);

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = jQuery;

var bodyAnimationClass = 'sidr-animating',
    openAction = 'open',
    closeAction = 'close',
    transitionEndEvent = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';

var Menu = function () {
  function Menu(name) {
    _classCallCheck(this, Menu);

    this.name = name;
    this.item = $('#' + name);
    this.openClass = name === 'sidr' ? 'sidr-open' : 'sidr-open ' + name + '-open';
    this.menuWidth = this.item.outerWidth(true);
    this.speed = this.item.data('speed');
    this.side = this.item.data('side');
    this.displace = this.item.data('displace');
    this.timing = this.item.data('timing');
    this.method = this.item.data('method');
    this.onOpenCallback = this.item.data('onOpen');
    this.onCloseCallback = this.item.data('onClose');
    this.onOpenEndCallback = this.item.data('onOpenEnd');
    this.onCloseEndCallback = this.item.data('onCloseEnd');
    this.body = $(this.item.data('body'));
  }

  _createClass(Menu, [{
    key: 'getAnimation',
    value: function getAnimation(action, element) {
      var animation = {},
          prop = this.side;

      if (action === 'open' && element === 'body') {
        animation[prop] = this.menuWidth + 'px';
      } else if (action === 'close' && element === 'menu') {
        animation[prop] = '-' + this.menuWidth + 'px';
      } else {
        animation[prop] = 0;
      }

      return animation;
    }
  }, {
    key: 'prepareBody',
    value: function prepareBody(action) {
      var prop = action === 'open' ? 'hidden' : '';

      // Prepare page if container is body
      if (this.body.is('body')) {
        var $html = $('html'),
            scrollTop = $html.scrollTop();

        $html.css('overflow-x', prop).scrollTop(scrollTop);
      }
    }
  }, {
    key: 'openBody',
    value: function openBody() {
      if (this.displace) {
        var transitions = _helper2.default.transitions,
            $body = this.body;

        if (transitions.supported) {
          $body.css(transitions.property, this.side + ' ' + this.speed / 1000 + 's ' + this.timing).css(this.side, 0).css({
            width: $body.width(),
            position: 'absolute'
          });
          $body.css(this.side, this.menuWidth + 'px');
        } else {
          var bodyAnimation = this.getAnimation(openAction, 'body');

          $body.css({
            width: $body.width(),
            position: 'absolute'
          }).animate(bodyAnimation, {
            queue: false,
            duration: this.speed
          });
        }
      }
    }
  }, {
    key: 'onCloseBody',
    value: function onCloseBody() {
      var transitions = _helper2.default.transitions,
          resetStyles = {
        width: '',
        position: '',
        right: '',
        left: ''
      };

      if (transitions.supported) {
        resetStyles[transitions.property] = '';
      }

      this.body.css(resetStyles).unbind(transitionEndEvent);
    }
  }, {
    key: 'closeBody',
    value: function closeBody() {
      var _this = this;

      if (this.displace) {
        if (_helper2.default.transitions.supported) {
          this.body.css(this.side, 0).one(transitionEndEvent, function () {
            _this.onCloseBody();
          });
        } else {
          var bodyAnimation = this.getAnimation(closeAction, 'body');

          this.body.animate(bodyAnimation, {
            queue: false,
            duration: this.speed,
            complete: function complete() {
              _this.onCloseBody();
            }
          });
        }
      }
    }
  }, {
    key: 'moveBody',
    value: function moveBody(action) {
      if (action === openAction) {
        this.openBody();
      } else {
        this.closeBody();
      }
    }
  }, {
    key: 'onOpenMenu',
    value: function onOpenMenu(callback) {
      var name = this.name;

      _status2.default.moving = false;
      _status2.default.opened = name;

      this.item.unbind(transitionEndEvent);

      this.body.removeClass(bodyAnimationClass).addClass(this.openClass);

      this.onOpenEndCallback();

      if (typeof callback === 'function') {
        callback(name);
      }
    }
  }, {
    key: 'openMenu',
    value: function openMenu(callback) {
      var _this2 = this;

      var $item = this.item;

      if (_helper2.default.transitions.supported) {
        $item.css(this.side, 0).one(transitionEndEvent, function () {
          _this2.onOpenMenu(callback);
        });
      } else {
        var menuAnimation = this.getAnimation(openAction, 'menu');

        $item.css('display', 'block').animate(menuAnimation, {
          queue: false,
          duration: this.speed,
          complete: function complete() {
            _this2.onOpenMenu(callback);
          }
        });
      }
    }
  }, {
    key: 'onCloseMenu',
    value: function onCloseMenu(callback) {
      this.item.css({
        left: '',
        right: ''
      }).unbind(transitionEndEvent);
      $('html').css('overflow-x', '');

      _status2.default.moving = false;
      _status2.default.opened = false;

      this.body.removeClass(bodyAnimationClass).removeClass(this.openClass);

      this.onCloseEndCallback();

      // Callback
      if (typeof callback === 'function') {
        callback(name);
      }
    }
  }, {
    key: 'closeMenu',
    value: function closeMenu(callback) {
      var _this3 = this;

      var item = this.item;

      if (_helper2.default.transitions.supported) {
        item.css(this.side, '').one(transitionEndEvent, function () {
          _this3.onCloseMenu(callback);
        });
      } else {
        var menuAnimation = this.getAnimation(closeAction, 'menu');

        item.animate(menuAnimation, {
          queue: false,
          duration: this.speed,
          complete: function complete() {
            _this3.onCloseMenu();
          }
        });
      }
    }
  }, {
    key: 'moveMenu',
    value: function moveMenu(action, callback) {
      this.body.addClass(bodyAnimationClass);

      if (action === openAction) {
        this.openMenu(callback);
      } else {
        this.closeMenu(callback);
      }
    }
  }, {
    key: 'move',
    value: function move(action, callback) {
      // Lock sidr
      _status2.default.moving = true;

      this.prepareBody(action);
      this.moveBody(action);
      this.moveMenu(action, callback);
    }
  }, {
    key: 'open',
    value: function open(callback) {
      var _this4 = this;

      // Check if is already opened or moving
      if (_status2.default.opened === this.name || _status2.default.moving) {
        return;
      }

      // If another menu opened close first
      if (_status2.default.opened !== false) {
        var alreadyOpenedMenu = new Menu(_status2.default.opened);

        alreadyOpenedMenu.close(function () {
          _this4.open(callback);
        });

        return;
      }

      this.move('open', callback);

      // onOpen callback
      this.onOpenCallback();
    }
  }, {
    key: 'close',
    value: function close(callback) {
      // Check if is already closed or moving
      if (_status2.default.opened !== this.name || _status2.default.moving) {
        return;
      }

      this.move('close', callback);

      // onClose callback
      this.onCloseCallback();
    }
  }, {
    key: 'toggle',
    value: function toggle(callback) {
      if (_status2.default.opened === this.name) {
        this.close(callback);
      } else {
        this.open(callback);
      }
    }
  }]);

  return Menu;
}();

exports.default = Menu;

},{"./helper":4,"./status":7}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _execute = require('./execute');

var _execute2 = _interopRequireDefault(_execute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var i,
    $ = jQuery,
    publicMethods = ['open', 'close', 'toggle'],
    methodName,
    methods = {},
    getMethod = function getMethod(methodName) {
  return function (name, callback) {
    // Check arguments
    if (typeof name === 'function') {
      callback = name;
      name = 'sidr';
    } else if (!name) {
      name = 'sidr';
    }

    (0, _execute2.default)(methodName, name, callback);
  };
};

for (i = 0; i < publicMethods.length; i++) {
  methodName = publicMethods[i];
  methods[methodName] = getMethod(methodName);
}

function sidr(method) {
  if (methods[method]) {
    return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
  } else if (typeof method === 'function' || typeof method === 'string' || !method) {
    return methods.toggle.apply(this, arguments);
  } else {
    $.error('Method ' + method + ' does not exist on jQuery.sidr');
  }
}

exports.default = sidr;

},{"./execute":2}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var sidrStatus = {
    moving: false,
    opened: false
};

exports.default = sidrStatus;

},{}]},{},[1]);
