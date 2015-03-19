(function() {
  var autoInit, deferConsole, draw, getContent, getOptions, orDefault, tag;

  getOptions = function(options) {
    options.title = orDefault(options.title, getContent('meta[name="application-name"]'), getContent('meta[property="og:title"]'), document.title.split(/\u0020[\/\\\|\-\u8211\u8212]\u0020|\:\u0020/)[0], '');
    options.author = orDefault(options.author, getContent('meta[name=author]'), '');
    options.description = orDefault(options.description, getContent('meta[name=description]'), getContent('meta[property="og:description"]'), '');
    options.image = orDefault(options.image, getContent('meta[property="og:image"]'), getContent('meta[name=image]'));
    options.hue = options.hue || 0;
    options.baseStyles = orDefault(options.baseStyles, 'color: #444; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;');
    options.titleStyles = orDefault(options.titleStyles, "" + options.baseStyles + "; font-size: 20px; line-height: 30px;");
    options.authorStyles = orDefault(options.authorStyles, "" + options.baseStyles + "; font-size: 12px; line-height: 30px; padding-left: 20px;");
    options.descriptionStyles = orDefault(options.descriptionStyles, "" + options.baseStyles + "; font-size: 14px; line-height: 20px;");
    return options;
  };

  orDefault = function() {
    var argument, _i, _len;
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      argument = arguments[_i];
      if (typeof argument !== 'undefined') {
        return argument;
      }
    }
    return arguments[arguments.length - 1];
  };

  getContent = function(selector) {
    var _ref;
    return (_ref = document.head.querySelector(selector)) != null ? _ref.content : void 0;
  };

  deferConsole = function(fn) {
    var callable, i, messages, old, type, types, _fn, _i, _len;
    types = ['log', 'debug', 'warn', 'error'];
    old = {};
    callable = {};
    messages = [];
    i = types.length;
    _fn = function(type) {
      old[type] = console[type];
      callable[type] = function() {
        return old[type].apply(console, arguments);
      };
      return console[type] = function() {
        messages.push([type, arguments]);
        return void 0;
      };
    };
    for (i = _i = 0, _len = types.length; _i < _len; i = ++_i) {
      type = types[i];
      _fn(type);
    }
    return setTimeout((function() {
      var _then;
      _then = function() {
        var block, message, _j, _len1, _results;
        while (messages.length) {
          block = messages.shift();
          type = block[0];
          message = block[1];
          old[type].apply(console, message);
        }
        _results = [];
        for (_j = 0, _len1 = types.length; _j < _len1; _j++) {
          type = types[_j];
          _results.push(console[type] = old[type]);
        }
        return _results;
      };
      return fn(callable, _then);
    }), 0);
  };

  draw = function(options, _console, cb) {
    var img, _draw;
    _draw = function() {
      var args, hue, i;
      if (options.title) {
        if (!options.image) {
          args = [''];
          i = 0;
          while (i < options.title.length) {
            args[0] += "%c" + options.title[i];
            if (options.title[i] === ' ') {
              args.push(options.titleStyles);
            } else {
              hue = ((options.title[i].toLowerCase().charCodeAt(0) * 2) + options.hue) % 255;
              args.push("" + options.titleStyles + "; background: hsl(" + hue + ", 80%, 80%); color: transparent; line-height: 0;");
            }
            i++;
          }
          _console.log.apply(console, args);
        }
        if (options.author) {
          _console.log("%c" + options.title + "%c" + options.author, options.titleStyles, options.authorStyles);
        } else {
          _console.log("%c" + options.title, options.titleStyles);
        }
      }
      if (options.description) {
        _console.log("%c" + options.description, options.descriptionStyles);
      }
      if (cb) {
        return cb();
      }
    };
    _console = _console || window.console;
    options = options || window.signet.options || {
      enabled: true
    };
    if (options.enabled === false) {
      return;
    }
    options = getOptions(options);
    if (!options.image) {
      return _draw();
    } else {
      img = new Image();
      img.onload = function() {
        _console.log('%c ', "font-size: 0; line-height: " + img.height + "px; padding: " + (Math.floor(img.height / 2)) + "px " + img.width + "px " + (Math.ceil(img.height / 2)) + "px 0; background-image: url(\"" + img.src + "\");");
        return _draw();
      };
      return img.src = options.image;
    }
  };

  window.signet = window.signet || {};

  window.signet.options = window.signet.options || window.signetOptions || {};

  if (!window.console || !window.console.log || !document.head || !document.querySelector) {
    window.signet.draw = function() {};
    return;
  }

  autoInit = true;

  tag = document.querySelector('[data-signet-draw]');

  if (tag) {
    autoInit = tag.getAttribute('data-signet-draw').toLowerCase() !== 'false';
  }

  if (signet.options.draw === false) {
    autoInit = false;
  }

  if (autoInit) {
    deferConsole(function(_console, _then) {
      return draw(null, _console, _then);
    });
  }

  window.signet.draw = draw;

}).call(this);
