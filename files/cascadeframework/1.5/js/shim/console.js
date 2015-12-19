// Depends on ECMAScript 5 or appropriate polyfill for:
//  Array.prototype.map, JSON.stringify

(function () {
  var MAX_LINES = 1000,
      CONSOLE_CSS = "#SHIMCONSOLE { visibility: hidden; position: fixed; z-index: 9999; left: 0; right: 0; bottom: 0; height: 200px; border-top: solid 1px #808080; overflow: auto; word-wrap: break-word; padding: 5px; background-color: #eeeeee; color: #000000; font-family: monospace; font-size: 10pt; font-weight: normal; font-style: normal; }"
        + "#SHIMCONSOLE .SHIMCONSOLE_GROUP { margin-left: 20px; }"
        + "#SHIMCONSOLE .SHIMCONSOLE_ERROR { color: #ff0000; }"
        + "#SHIMCONSOLE .SHIMCONSOLE_WARN { color: #ff8000; }",
      FORMAT_REGEXP = /([^%]|%([\-+0]*)(\d+)?(\.\d+)?([%sdilfox]))/g;

  function Console() {

    // Add stylesheet
    (function () {
      var style = document.createElement('style');
      (document.getElementsByTagName('HEAD')[0] || document.documentElement).appendChild(style);
      if ('styleSheet' in style) {
        style.styleSheet.cssText = CONSOLE_CSS;
      } else {
        style.appendChild(document.createTextNode(CONSOLE_CSS));
      }
    }());

    var display;
    var counts = {};
    var times = {};
    var groups = [];

    display = document.createElement('div');
    display.id = 'SHIMCONSOLE';
    (document.body || document.documentElement).appendChild(display);

    function format(o) {
      var span = document.createElement('span'), text, color, classOf;
      switch (typeof o) {
      case 'undefined':
        text = String(o);
        color = 'gray';
        break;
      case 'boolean':
        text = String(o);
        color = 'green';
        break;
      case 'number':
        text = String(o);
        color = 'blue';
        break;
      case 'string':
        text = o;
        break;
      default: // object and null
        if (!o) {
          text = String(o);
          color = 'gray';
        } else {
          classOf = Object.prototype.toString.call(o);
          if (classOf === '[object Array]' || classOf === '[object Object]') {
            try {
              text = JSON.stringify(o);
            } catch (e) {
              // Cyclic, use fallback
              text = classOf;
            }
          } else {
            text = String(o);
          }
        }
      }

      span.appendChild(document.createTextNode(text));
      if (color) {
        span.style.color = color;
      }
      return span;
    }

    function show(args, type, prefix) {
      if (!args.length) {
        return;
      }
      var line = document.createElement('div');
      line.className = 'SHIMCONSOLE_' + type;

      line.style.whiteSpace = 'pre';

      if (prefix) {
          line.appendChild(document.createTextNode(prefix));
      }

      function trunc(n) {
        return n < 0 ? Math.ceil(n) : Math.floor(n);
      }
      function repl(str, unit, flags, width, precision, specifier) {
        if (unit.charAt(0) != '%' || !args.length) {
          return unit;
        } else if (specifier === '%') {
          return '%';
        }
        var arg = args.shift();
        switch (specifier) {
        case 's': return String(arg);
        case 'd':
        case 'i':
        case 'l': return String(trunc(Number(arg)));
        case 'f': return String(Number(arg));
        default:
        case 'o':
          try {
            return JSON.stringify(arg);
          } catch (e) {
            return String(arg);
          }
        }
        return void 0;
      }

      if (typeof args[0] === 'string') {
        line.appendChild(document.createTextNode(args.shift().replace(FORMAT_REGEXP, repl)));
        line.appendChild(document.createTextNode(' '));
      }

      // pretty-print remaining arguments
      while (args.length) {
        line.appendChild(format(args.shift()));
        line.appendChild(document.createTextNode(' '));
      }
      var parent = groups.length ? groups[groups.length - 1] : display;
      parent.appendChild(line);

      while (display.children.length > MAX_LINES) {
        display.removeChild(display.firstChild);
      }
      display.scrollTop = display.scrollHeight;
      display.style.visibility = 'visible';
    }

    function toArray(a) {
      var result = [], i;
      for (i = 0; i < a.length; i += 1) {
        result[i] = a[i];
      }
      return result;
    }

    this.log = function log(messageObject) { show(toArray(arguments), 'LOG'); };
    this.debug = function debug(messageObject) { show(toArray(arguments), 'DEBUG'); };
    this.info = function info(messageObject) { show(toArray(arguments), 'INFO'); };
    this.warn = function warn(messageObject) { show(toArray(arguments), 'WARN', 'Warning: '); };
    this.error = function error(messageObject) { show(toArray(arguments), 'ERROR', 'Error: '); };

    this.assert = function assert(a, messageObject) {
      if (!a) {
        var args = toArray(arguments);
        args.shift();
        show(args, 'ERROR', 'Assertion failed: ');
      }
    };

    this.count = function count(name) {
      name = (name || '');
      if (!(('$' + name) in counts)) {
        counts['$' + name] = 0;
      }
      counts['$' + name] += 1;
      show([name + ": " + counts['$' + name]], 'INFO');
    };

    this.time = function time(name) {
      name = (name || '');
      times['$' + name] = Number(new Date);
    };
    this.timeEnd = function timeEnd(name) {
      name = (name || '');
      if (('$' + name) in times) {
        show([name + ": " + (Number(new Date) - times['$' + name]) + "ms"], 'INFO');
        delete times['$' + name];
      }
    };

    this.group = function group(name) {
      name = (name || '');
      show(['>' + name], 'INFO');
      var div = document.createElement('div');
      div.className = 'SHIMCONSOLE_GROUP';
      var parent = groups.length ? groups[groups.length - 1] : display;
      parent.appendChild(div);
      groups.push(div);
    };
    this.groupEnd = function groupEnd() {
      groups.pop();
    };

    this.dir = function dir(name) {
      show([name], 'INFO');
    };
    this.dirxml = this.dir;

    this.trace = function trace() {
      try {
        this.wont.work = 0;
      } catch (e) {
        if (e.stack) {
          show([e.stack.replace(/^[^\n]*\n/, 'Stack trace:\n')], 'INFO');
        }
      }
    };

    this.clear = function clear() {
      while (display.children.length) {
        display.removeChild(display.firstChild);
      }
    };
  }

  window.console = window.console || new Console();
}());