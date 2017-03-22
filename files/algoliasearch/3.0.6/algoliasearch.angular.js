/*! algoliasearch 3.0.6 | © 2014, 2015 Algolia SAS | github.com/algolia/algoliasearch-client-js */
(function(f){var g;if(typeof window!=='undefined'){g=window}else if(typeof self!=='undefined'){g=self}g.ALGOLIA_MIGRATION_LAYER=f()})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

module.exports = function load (src, opts, cb) {
  var head = document.head || document.getElementsByTagName('head')[0]
  var script = document.createElement('script')

  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }

  opts = opts || {}
  cb = cb || function() {}

  script.type = opts.type || 'text/javascript'
  script.charset = opts.charset || 'utf8';
  script.async = 'async' in opts ? !!opts.async : true
  script.src = src

  if (opts.attrs) {
    setAttributes(script, opts.attrs)
  }

  if (opts.text) {
    script.text = '' + opts.text
  }

  var onend = 'onload' in script ? stdOnEnd : ieOnEnd
  onend(script, cb)

  // some good legacy browsers (firefox) fail the 'in' detection above
  // so as a fallback we always set onload
  // old IE will ignore this and new IE will set onload
  if (!script.onload) {
    stdOnEnd(script, cb);
  }

  head.appendChild(script)
}

function setAttributes(script, attrs) {
  for (var attr in attrs) {
    script.setAttribute(attr, attrs[attr]);
  }
}

function stdOnEnd (script, cb) {
  script.onload = function () {
    this.onerror = this.onload = null
    cb(null, script)
  }
  script.onerror = function () {
    // this.onload = null here is necessary
    // because even IE9 works not like others
    this.onerror = this.onload = null
    cb(new Error('Failed to load ' + this.src), script)
  }
}

function ieOnEnd (script, cb) {
  script.onreadystatechange = function () {
    if (this.readyState != 'complete' && this.readyState != 'loaded') return
    this.onreadystatechange = null
    cb(null, script) // there is no way to catch loading errors in IE8
  }
}

},{}],2:[function(require,module,exports){
// this module helps finding if the current page is using
// the cdn.jsdelivr.net/algoliasearch/latest/$BUILDNAME.min.js version

module.exports = isUsingLatest;

function isUsingLatest(buildName) {
  var toFind = new RegExp('cdn\\.jsdelivr\\.net/algoliasearch/latest/' +
    buildName.replace('.', '\\.') + // algoliasearch, algoliasearch.angular
    '(?:\\.min)?\\.js$'); // [.min].js

  var scripts = document.getElementsByTagName('script');
  var found = false;
  for (var currentScript = 0, nbScripts = scripts.length;
        currentScript < nbScripts;
        currentScript++) {
    if (scripts[currentScript].src && toFind.test(scripts[currentScript].src)) {
      found = true;
      break;
    }
  }

  return found;
}

},{}],3:[function(require,module,exports){
(function (global){
module.exports = loadV2;

function loadV2(buildName) {
  var loadScript = require(1);
  var v2ScriptUrl = '//cdn.jsdelivr.net/algoliasearch/2/' + buildName + '.min.js';

  var message =
    '-- AlgoliaSearch `latest` warning --\n' +
    'Warning, you are using the `latest` version string from jsDelivr to load the AlgoliaSearch library.\n' +
    'Using `latest` is no more recommended, you should load //cdn.jsdelivr.net/algoliasearch/2/algoliasearch.min.js\n\n' +
    'Also, we updated the AlgoliaSearch JavaScript client to V3. If you want to upgrade,\n' +
    'please read our migration guide at https://github.com/algolia/algoliasearch-client-js/wiki/Migration-guide-from-2.x.x-to-3.x.x\n' +
    '-- /AlgoliaSearch  `latest` warning --';

  if (global.console) {
    if (global.console.warn) {
      global.console.warn(message);
    } else if (global.console.log) {
      global.console.log(message);
    }
  }

  // If current script loaded asynchronously,
  // it will load the script with DOMElement
  // otherwise, it will load the script with document.write
  try {
    // why \x3c? http://stackoverflow.com/a/236106/147079
    document.write('\x3Cscript>window.ALGOLIA_SUPPORTS_DOCWRITE = true\x3C/script>');

    if (global.ALGOLIA_SUPPORTS_DOCWRITE === true) {
      document.write('\x3Cscript src="' + v2ScriptUrl + '">\x3C/script>');
      scriptLoaded('document.write')();
    } else {
      loadScript(v2ScriptUrl, scriptLoaded('DOMElement'));
    }
  } catch(e) {
    loadScript(v2ScriptUrl, scriptLoaded('DOMElement'));
  }
}

function scriptLoaded(method) {
  return function log() {
    var message = 'AlgoliaSearch: loaded V2 script using ' + method;

    global.console && global.console.log && global.console.log(message);
  };
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"1":1}],4:[function(require,module,exports){
(function (global){
/*global AlgoliaExplainResults:true*/
/*eslint no-unused-vars: [2, {"vars": "local"}]*/

module.exports = oldGlobals;

// put old window.AlgoliaSearch.. into window. again so that
// users upgrading to V3 without changing their code, will be warned
function oldGlobals() {
  var message =
    '-- AlgoliaSearch V2 => V3 error --\n' +
    'You are trying to use a new version of the AlgoliaSearch JavaScript client with an old notation.\n' +
    'Please read our migration guide at https://github.com/algolia/algoliasearch-client-js/wiki/Migration-guide-from-2.x.x-to-3.x.x\n' +
    '-- /AlgoliaSearch V2 => V3 error --';

  global.AlgoliaSearch = function() {
    throw new Error(message);
  };

  global.AlgoliaSearchHelper = function() {
    throw new Error(message);
  };

  // cannot use window.AlgoliaExplainResults on old IEs, dunno why
  AlgoliaExplainResults = function() {
    throw new Error(message);
  };
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
// This script will be browserified and prepended to the normal build
// directly in window, not wrapped in any module definition
// To avoid cases where we are loaded with /latest/ along with
migrationLayer("algoliasearch.angular");

// Now onto the V2 related code:
//  If the client is using /latest/$BUILDNAME.min.js, load V2 of the library
//
//  Otherwise, setup a migration layer that will throw on old constructors like
//  new AlgoliaSearch().
//  So that users upgrading from v2 to v3 will have a clear information
//  message on what to do if they did not read the migration guide
function migrationLayer(buildName) {
  var isUsingLatest = require(2);
  var loadV2 = require(3);
  var oldGlobals = require(4);

  if (isUsingLatest(buildName)) {
    loadV2(buildName);
  } else {
    oldGlobals();
  }
}

},{"2":2,"3":3,"4":4}]},{},[5])(5)
});(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
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

},{}],2:[function(require,module,exports){

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require(3);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Use chrome.storage.local if we are in an app
 */

var storage;

if (typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined')
  storage = chrome.storage.local;
else
  storage = localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      storage.removeItem('debug');
    } else {
      storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = storage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}

},{"3":3}],3:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require(4);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"4":4}],4:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
(function (process,global){
module.exports = AlgoliaSearch;

// default debug activated in dev environments
// this is triggered in package.json, using the envify transform
if (process.env.NODE_ENV === 'development') {
  require(2).enable('algoliasearch*');
}

var debug = require(2)('algoliasearch:AlgoliaSearch');

/*
 * Algolia Search library initialization
 * https://www.algolia.com/
 *
 * @param {string} applicationID - Your applicationID, found in your dashboard
 * @param {string} apiKey - Your API key, found in your dashboard
 * @param {Object} [opts]
 * @param {number} [opts.timeout=2000] - The request timeout set in milliseconds, another request will be issued after this timeout
 * @param {string} [opts.protocol='http:'] - The protocol used to query Algolia Search API.
 *                                        Set to 'https:' to force using https. Default to document.location.protocol in browsers
 * @param {string[]} [opts.hosts=[
 *          this.applicationID + '-1.algolia.' + opts.tld,
 *          this.applicationID + '-2.algolia.' + opts.tld,
 *          this.applicationID + '-3.algolia.' + opts.tld]
 *        ] - The hosts to use for Algolia Search API. It this your responsibility to shuffle the hosts and add a DSN host in it
 * @param {string} [opts.tld='net'] - The tld to use when computing hosts default list
 */
function AlgoliaSearch(applicationID, apiKey, opts) {
  var usage = 'Usage: algoliasearch(applicationID, apiKey, opts)';

  if (!applicationID) {
    throw new Error('Please provide an application ID. ' + usage);
  }

  if (!apiKey) {
    throw new Error('Please provide an API key. ' + usage);
  }

  opts = opts || {};

  // now setting default options
  // could not find a tiny module to do that, let's go manual
  if (opts.timeout === undefined) {
    opts.timeout = 2000;
  }

  if (opts.protocol === undefined) {
    var locationProtocol = global.document && global.document.location.protocol;
    // our API is only available with http or https. When in file:// mode (local html file), default to http
    opts.protocol = (locationProtocol === 'http:' || locationProtocol === 'https:') ? locationProtocol : 'http:';
  }

  if (opts.hosts === undefined) {
    opts.hosts = []; // filled later on, has dependencies
  }

  if (opts.tld === undefined) {
    opts.tld = 'net';
  }

  // while we advocate for colon-at-the-end values: 'http:' for `opts.protocol`
  // we also accept `http` and `https`. It's a common error.
  if (!/:$/.test(opts.protocol)) {
    opts.protocol = opts.protocol + ':';
  }

  // no hosts given, add defaults
  if (opts.hosts.length === 0) {
    opts.hosts = shuffle([
      applicationID + '-1.algolia.' + opts.tld,
      applicationID + '-2.algolia.' + opts.tld,
      applicationID + '-3.algolia.' + opts.tld
    ]);

    // add default dsn host
    opts.hosts.unshift(applicationID + '-dsn.algolia.' + opts.tld);
  }

  opts.hosts = map(opts.hosts, function prependProtocol(host) {
    return opts.protocol + '//' + host;
  });

  this.applicationID = applicationID;
  this.apiKey = apiKey;
  this.hosts = opts.hosts;

  this.currentHostIndex = 0;
  this.requestTimeout = opts.timeout;
  this.extraHeaders = [];
  this.cache = {};
}

AlgoliaSearch.prototype = {
  /*
   * Delete an index
   *
   * @param indexName the name of index to delete
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer that contains the task ID
   */
  deleteIndex: function(indexName, callback) {
    return this._jsonRequest({ method: 'DELETE',
              url: '/1/indexes/' + encodeURIComponent(indexName),
              callback: callback });
  },
  /**
   * Move an existing index.
   * @param srcIndexName the name of index to copy.
   * @param dstIndexName the new index name that will contains a copy of srcIndexName (destination will be overriten if it already exist).
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer that contains the task ID
   */
  moveIndex: function(srcIndexName, dstIndexName, callback) {
    var postObj = {operation: 'move', destination: dstIndexName};
    return this._jsonRequest({ method: 'POST',
              url: '/1/indexes/' + encodeURIComponent(srcIndexName) + '/operation',
              body: postObj,
              callback: callback });

  },
  /**
   * Copy an existing index.
   * @param srcIndexName the name of index to copy.
   * @param dstIndexName the new index name that will contains a copy of srcIndexName (destination will be overriten if it already exist).
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer that contains the task ID
   */
  copyIndex: function(srcIndexName, dstIndexName, callback) {
    var postObj = {operation: 'copy', destination: dstIndexName};
    return this._jsonRequest({ method: 'POST',
              url: '/1/indexes/' + encodeURIComponent(srcIndexName) + '/operation',
              body: postObj,
              callback: callback });
  },
  /**
   * Return last log entries.
   * @param offset Specify the first entry to retrieve (0-based, 0 is the most recent log entry).
   * @param length Specify the maximum number of entries to retrieve starting at offset. Maximum allowed value: 1000.
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer that contains the task ID
   */
  getLogs: function(offset, length, callback) {
    if (arguments.length === 0 || typeof offset === 'function') {
      // getLogs([cb])
      callback = offset;
      offset = 0;
      length = 10;
    } else if (arguments.length === 1 || typeof length === 'function') {
      // getLogs(1, [cb)]
      callback = length;
      length = 10;
    }

    return this._jsonRequest({ method: 'GET',
              url: '/1/logs?offset=' + offset + '&length=' + length,
              callback: callback });
  },
  /*
   * List all existing indexes (paginated)
   *
   * @param page The page to retrieve, starting at 0.
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with index list
   */
  listIndexes: function(page, callback) {
    var params = '';

    if (page === undefined || typeof page === 'function') {
      callback = page;
    } else {
      params = '?page=' + page;
    }

    return this._jsonRequest({ method: 'GET',
              url: '/1/indexes' + params,
              callback: callback });
  },

  /*
   * Get the index object initialized
   *
   * @param indexName the name of index
   * @param callback the result callback with one argument (the Index instance)
   */
  initIndex: function(indexName) {
    return new this.Index(this, indexName);
  },
  /*
   * List all existing user keys with their associated ACLs
   *
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with user keys list
   */
  listUserKeys: function(callback) {
    return this._jsonRequest({ method: 'GET',
              url: '/1/keys',
              callback: callback });
  },
  /*
   * Get ACL of a user key
   *
   * @param key
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with user keys list
   */
  getUserKeyACL: function(key, callback) {
    return this._jsonRequest({ method: 'GET',
              url: '/1/keys/' + key,
              callback: callback });
  },
  /*
   * Delete an existing user key
   * @param key
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with user keys list
   */
  deleteUserKey: function(key, callback) {
    return this._jsonRequest({ method: 'DELETE',
              url: '/1/keys/' + key,
              callback: callback });
  },
  /*
   * Add an existing user key
   *
   * @param acls the list of ACL for this key. Defined by an array of strings that
   * can contains the following values:
   *   - search: allow to search (https and http)
   *   - addObject: allows to add/update an object in the index (https only)
   *   - deleteObject : allows to delete an existing object (https only)
   *   - deleteIndex : allows to delete index content (https only)
   *   - settings : allows to get index settings (https only)
   *   - editSettings : allows to change index settings (https only)
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with user keys list
   */
  addUserKey: function(acls, callback) {
    return this.addUserKeyWithValidity(acls, {
      validity: 0,
      maxQueriesPerIPPerHour: 0,
      maxHitsPerQuery: 0
    }, callback);
  },
  /*
   * Add an existing user key
   *
   * @param acls the list of ACL for this key. Defined by an array of strings that
   * can contains the following values:
   *   - search: allow to search (https and http)
   *   - addObject: allows to add/update an object in the index (https only)
   *   - deleteObject : allows to delete an existing object (https only)
   *   - deleteIndex : allows to delete index content (https only)
   *   - settings : allows to get index settings (https only)
   *   - editSettings : allows to change index settings (https only)
   * @param params.validity the number of seconds after which the key will be automatically removed (0 means no time limit for this key)
   * @param params.maxQueriesPerIPPerHour Specify the maximum number of API calls allowed from an IP address per hour.
   * @param params.maxHitsPerQuery Specify the maximum number of hits this API key can retrieve in one call.
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with user keys list
   */
  addUserKeyWithValidity: function(acls, params, callback) {
    var aclsObject = {};
    aclsObject.acl = acls;
    aclsObject.validity = params.validity;
    aclsObject.maxQueriesPerIPPerHour = params.maxQueriesPerIPPerHour;
    aclsObject.maxHitsPerQuery = params.maxHitsPerQuery;
    return this._jsonRequest({ method: 'POST',
              url: '/1/keys',
              body: aclsObject,
              callback: callback });
  },

  /**
   * Set the extra security tagFilters header
   * @param {string|array} tags The list of tags defining the current security filters
   */
  setSecurityTags: function(tags) {
    if (Object.prototype.toString.call(tags) === '[object Array]') {
      var strTags = [];
      for (var i = 0; i < tags.length; ++i) {
        if (Object.prototype.toString.call(tags[i]) === '[object Array]') {
          var oredTags = [];
          for (var j = 0; j < tags[i].length; ++j) {
            oredTags.push(tags[i][j]);
          }
          strTags.push('(' + oredTags.join(',') + ')');
        } else {
          strTags.push(tags[i]);
        }
      }
      tags = strTags.join(',');
    }
    this.tagFilters = tags;
  },

  /**
   * Set the extra user token header
   * @param {string} userToken The token identifying a uniq user (used to apply rate limits)
   */
  setUserToken: function(userToken) {
    this.userToken = userToken;
  },

  /*
   * Initialize a new batch of search queries
   */
  startQueriesBatch: function() {
    this.batch = [];
  },
  /*
   * Add a search query in the batch
   *
   * @param query the full text query
   * @param args (optional) if set, contains an object with query parameters:
   *  - attributes: an array of object attribute names to retrieve
   *     (if not set all attributes are retrieve)
   *  - attributesToHighlight: an array of object attribute names to highlight
   *     (if not set indexed attributes are highlighted)
   *  - minWordSizefor1Typo: the minimum number of characters to accept one typo.
   *     Defaults to 3.
   *  - minWordSizefor2Typos: the minimum number of characters to accept two typos.
   *     Defaults to 7.
   *  - getRankingInfo: if set, the result hits will contain ranking information in
   *     _rankingInfo attribute
   *  - page: (pagination parameter) page to retrieve (zero base). Defaults to 0.
   *  - hitsPerPage: (pagination parameter) number of hits per page. Defaults to 10.
   */
  addQueryInBatch: function(indexName, query, args) {
    var params = 'query=' + encodeURIComponent(query);
    if (!this._isUndefined(args) && args !== null) {
      params = this._getSearchParams(args, params);
    }
    this.batch.push({ indexName: indexName, params: params });
  },
  /*
   * Clear all queries in cache
   */
  clearCache: function() {
    this.cache = {};
  },
  /*
   * Launch the batch of queries using XMLHttpRequest.
   * (Optimized for browser using a POST query to minimize number of OPTIONS queries)
   *
   * @param callback the function that will receive results
   */
  sendQueriesBatch: function(callback) {
    var as = this;
    var params = {requests: []};

    for (var i = 0; i < as.batch.length; ++i) {
      params.requests.push(as.batch[i]);
    }

    return this._sendQueriesBatch(params, callback);
  },

   /**
   * Set the number of milliseconds a request can take before automatically being terminated.
   *
   * @param {Number} milliseconds
   */
  setRequestTimeout: function(milliseconds) {
    if (milliseconds) {
      this.requestTimeout = parseInt(milliseconds, 10);
    }
  },

  /*
   * Index class constructor.
   * You should not use this method directly but use initIndex() function
   */
  Index: function(algoliasearch, indexName) {
    this.indexName = indexName;
    this.as = algoliasearch;
    this.typeAheadArgs = null;
    this.typeAheadValueOption = null;

    // make sure every index instance has it's own cache
    this.cache = {};
  },
   /**
   * Add an extra field to the HTTP request
   *
   * @param key the header field name
   * @param value the header field value
   */
  setExtraHeader: function(key, value) {
    this.extraHeaders.push({ key: key, value: value});
  },

  _sendQueriesBatch: function(params, callback) {
    return this._jsonRequest({ cache: this.cache,
      method: 'POST',
      url: '/1/indexes/*/queries',
      body: params,
      fallback: {
        method: 'GET',
        url: '/1/indexes/*',
        body: {params: (function() {
          var reqParams = '';
          for (var i = 0; i < params.requests.length; ++i) {
            var q = '/1/indexes/' + encodeURIComponent(params.requests[i].indexName) + '?' + params.requests[i].params;
            reqParams += i + '=' + encodeURIComponent(q) + '&';
          }
          return reqParams;
        }())}
      },
      callback: callback
    });
  },
  /*
   * Wrapper that try all hosts to maximize the quality of service
   */
  _jsonRequest: function(opts) {
    // handle opts.fallback, automatically use fallback (JSONP in browser plugins, wrapped with $plugin-promises)
    // so if an error occurs and max tries => use fallback
    // set tries to 0 again
    // if fallback used and no more tries, return error
    // fallback parameters are in opts.fallback
    // call request.fallback or request accordingly, same promise chain otherwise
    // put callback& params in front if problem
    var cache = opts.cache;
    var cacheID = opts.url;
    var client = this;
    var tries = 0;

    // as we use POST requests to pass parameters (like query='aa'),
    // the cacheID must be different between calls
    if (opts.body !== undefined) {
      cacheID += '_body_' + JSON.stringify(opts.body);
    }

    function doRequest(requester, reqOpts) {
      // handle cache existence
      if (cache && cache[cacheID] !== undefined) {
        return client._promise.resolve(cache[cacheID]);
      }

      if (tries >= client.hosts.length) {
        if (!opts.fallback || !client._request.fallback || requester === client._request.fallback) {
          // could not get a response even using the fallback if one was available
          return client._promise.reject(new Error(
            'Cannot connect to the AlgoliaSearch API.' +
            ' Send an email to support@algolia.com to report and resolve the issue.'
          ));
        }

        tries = 0;
        reqOpts.method = opts.fallback.method;
        reqOpts.url = opts.fallback.url;
        reqOpts.body = opts.fallback.body;
        reqOpts.timeout = client.requestTimeout * (tries + 1);
        client.currentHostIndex = 0;
        client.forceFallback = true; // now we will only use JSONP, even on future requests
        return doRequest(client._request.fallback, reqOpts);
      }

      var url = reqOpts.url;

      url += (url.indexOf('?') === -1 ? '?' : '&') + 'X-Algolia-API-Key=' + client.apiKey;
      url += '&X-Algolia-Application-Id=' + client.applicationID;

      if (client.userToken) {
        url += '&X-Algolia-UserToken=' + encodeURIComponent(client.userToken);
      }

      if (client.tagFilters) {
        url += '&X-Algolia-TagFilters=' + encodeURIComponent(client.tagFilters);
      }

      for (var i = 0; i < client.extraHeaders.length; ++i) {
        url += '&' + client.extraHeaders[i].key + '=' + client.extraHeaders[i].value;
      }

      return requester(client.hosts[client.currentHostIndex] + url, {
        body: reqOpts.body,
        method: reqOpts.method,
        timeout: reqOpts.timeout
      })
      .then(function success(httpResponse) {
        // timeout case, retry immediately
        if (httpResponse instanceof Error) {
          return retryRequest();
        }

        var status =
          // When in browser mode, using XDR or JSONP
          // We rely on our own API response `status`, only
          // provided when an error occurs, we also expect a .message along
          // Otherwise, it could be a `waitTask` status, that's the only
          // case where we have a response.status that's not the http statusCode
          httpResponse && httpResponse.body && httpResponse.body.message && httpResponse.body.status ||

          // this is important to check the request statusCode AFTER the body eventual
          // statusCode because some implementations (jQuery XDomainRequest transport) may
          // send statusCode 200 while we had an error
          httpResponse.statusCode ||

          // When in browser mode, using XDR or JSONP
          // we default to success when no error (no response.status && response.message)
          // If there was a JSON.parse() error then body is null and it fails
          httpResponse && httpResponse.body && 200;

        var ok = status === 200 || status === 201;
        var retry = !ok && Math.floor(status / 100) !== 4 && Math.floor(status / 100) !== 1;

        if (ok && cache) {
          cache[cacheID] = httpResponse.body;
        }

        if (ok) {
          return httpResponse.body;
        }

        if (retry) {
          return retryRequest();
        }

        var unrecoverableError = new Error(
          httpResponse.body && httpResponse.body.message || 'Unknown error'
        );

        return client._promise.reject(unrecoverableError);
      }, tryFallback);

      function retryRequest() {
        client.currentHostIndex = ++client.currentHostIndex % client.hosts.length;
        tries += 1;
        reqOpts.timeout = client.requestTimeout * (tries + 1);
        return doRequest(requester, reqOpts);
      }

      function tryFallback(err) {
        // error cases:
        //  While not in fallback mode:
        //    - CORS not supported
        //    - network error
        //  While in fallback mode:
        //    - timeout
        //    - network error
        //    - badly formatted JSONP (script loaded, did not call our callback)
        //  In both cases:
        //    - uncaught exception occurs (TypeError)
        debug('error: %s, stack: %s', err.message, err.stack);

        // we were not using the fallback, try now
        // if we are switching to fallback right now, set tries to maximum
        if (!client.forceFallback) {
          // next time doRequest is called, simulate we tried all hosts,
          // this will force to use the fallback
          tries = client.hosts.length;
        } else {
          // we were already using the fallback, but something went wrong (script error)
          client.currentHostIndex = ++client.currentHostIndex % client.hosts.length;
          tries += 1;
        }

        return doRequest(requester, reqOpts);
      }
    }

    // we can use a fallback if forced AND fallback parameters are available
    var useFallback = client.forceFallback && opts.fallback;
    var requestOptions = useFallback ? opts.fallback : opts;

    var promise = doRequest(
      // set the requester
      useFallback ? client._request.fallback : client._request, {
        url: requestOptions.url,
        method: requestOptions.method,
        body: requestOptions.body,
        timeout: client.requestTimeout * (tries + 1)
      }
    );

    // either we have a callback
    // either we are using promises
    if (opts.callback) {
      promise.then(function okCb(content) {
        process.nextTick(function() {
          opts.callback(null, content);
        });
      }, function nookCb(err) {
        process.nextTick(function() {
          opts.callback(err);
        });
      });
    } else {
      return promise;
    }
  },

   /*
   * Transform search param object in query string
   */
  _getSearchParams: function(args, params) {
    if (this._isUndefined(args) || args === null) {
      return params;
    }
    for (var key in args) {
      if (key !== null && args.hasOwnProperty(key)) {
        params += params === '' ? '' : '&';
        params += key + '=' + encodeURIComponent(Object.prototype.toString.call(args[key]) === '[object Array]' ? JSON.stringify(args[key]) : args[key]);
      }
    }
    return params;
  },
  _isUndefined: function(obj) {
    return obj === void 0;
  }
};

/*
 * Contains all the functions related to one index
 * You should use AlgoliaSearch.initIndex(indexName) to retrieve this object
 */
AlgoliaSearch.prototype.Index.prototype = {
  /*
   * Clear all queries in cache
   */
  clearCache: function() {
    this.cache = {};
  },
  /*
   * Add an object in this index
   *
   * @param content contains the javascript object to add inside the index
   * @param objectID (optional) an objectID you want to attribute to this object
   * (if the attribute already exist the old object will be overwrite)
   * @param callback (optional) the result callback with two arguments:
   *  error: null or Error('message')
   *  content: the server answer that contains 3 elements: createAt, taskId and objectID
   */
  addObject: function(content, objectID, callback) {
    var indexObj = this;

    if (arguments.length === 1 || typeof objectID === 'function') {
      callback = objectID;
      objectID = undefined;
    }

    return this.as._jsonRequest({
      method: objectID !== undefined ?
        'PUT' : // update or create
        'POST', // create (API generates an objectID)
      url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + // create
        (objectID !== undefined ? '/' + encodeURIComponent(objectID) : ''), // update or create
      body: content,
      callback: callback
    });
  },
  /*
   * Add several objects
   *
   * @param objects contains an array of objects to add
   * @param callback (optional) the result callback with two arguments:
   *  error: null or Error('message')
   *  content: the server answer that updateAt and taskID
   */
  addObjects: function(objects, callback) {
    var indexObj = this;
    var postObj = {requests: []};
    for (var i = 0; i < objects.length; ++i) {
      var request = { action: 'addObject',
              body: objects[i] };
      postObj.requests.push(request);
    }
    return this.as._jsonRequest({ method: 'POST',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/batch',
                 body: postObj,
                 callback: callback });
  },
  /*
   * Get an object from this index
   *
   * @param objectID the unique identifier of the object to retrieve
   * @param attrs (optional) if set, contains the array of attribute names to retrieve
   * @param callback (optional) the result callback with two arguments
   *  error: null or Error('message')
   *  content: the object to retrieve or the error message if a failure occured
   */
  getObject: function(objectID, attrs, callback) {
    var indexObj = this;

    if (arguments.length === 1 || typeof attrs === 'function') {
      callback = attrs;
      attrs = undefined;
    }

    var params = '';
    if (attrs !== undefined) {
      params = '?attributes=';
      for (var i = 0; i < attrs.length; ++i) {
        if (i !== 0) {
          params += ',';
        }
        params += attrs[i];
      }
    }

    return this.as._jsonRequest({
      method: 'GET',
      url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/' + encodeURIComponent(objectID) + params,
      callback: callback
    });
  },

  /*
   * Update partially an object (only update attributes passed in argument)
   *
   * @param partialObject contains the javascript attributes to override, the
   *  object must contains an objectID attribute
   * @param callback (optional) the result callback with two arguments:
   *  error: null or Error('message')
   *  content: the server answer that contains 3 elements: createAt, taskId and objectID
   */
  partialUpdateObject: function(partialObject, callback) {
    var indexObj = this;
    return this.as._jsonRequest({ method: 'POST',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/' + encodeURIComponent(partialObject.objectID) + '/partial',
                 body: partialObject,
                 callback: callback });
  },
  /*
   * Partially Override the content of several objects
   *
   * @param objects contains an array of objects to update (each object must contains a objectID attribute)
   * @param callback (optional) the result callback with two arguments:
   *  error: null or Error('message')
   *  content: the server answer that updateAt and taskID
   */
  partialUpdateObjects: function(objects, callback) {
    var indexObj = this;
    var postObj = {requests: []};
    for (var i = 0; i < objects.length; ++i) {
      var request = { action: 'partialUpdateObject',
              objectID: objects[i].objectID,
              body: objects[i] };
      postObj.requests.push(request);
    }
    return this.as._jsonRequest({ method: 'POST',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/batch',
                 body: postObj,
                 callback: callback });
  },
  /*
   * Override the content of object
   *
   * @param object contains the javascript object to save, the object must contains an objectID attribute
   * @param callback (optional) the result callback with two arguments:
   *  error: null or Error('message')
   *  content: the server answer that updateAt and taskID
   */
  saveObject: function(object, callback) {
    var indexObj = this;
    return this.as._jsonRequest({ method: 'PUT',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/' + encodeURIComponent(object.objectID),
                 body: object,
                 callback: callback });
  },
  /*
   * Override the content of several objects
   *
   * @param objects contains an array of objects to update (each object must contains a objectID attribute)
   * @param callback (optional) the result callback with two arguments:
   *  error: null or Error('message')
   *  content: the server answer that updateAt and taskID
   */
  saveObjects: function(objects, callback) {
    var indexObj = this;
    var postObj = {requests: []};
    for (var i = 0; i < objects.length; ++i) {
      var request = { action: 'updateObject',
              objectID: objects[i].objectID,
              body: objects[i] };
      postObj.requests.push(request);
    }
    return this.as._jsonRequest({ method: 'POST',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/batch',
                 body: postObj,
                 callback: callback });
  },
  /*
   * Delete an object from the index
   *
   * @param objectID the unique identifier of object to delete
   * @param callback (optional) the result callback with two arguments:
   *  error: null or Error('message')
   *  content: the server answer that contains 3 elements: createAt, taskId and objectID
   */
  deleteObject: function(objectID, callback) {
    if (typeof objectID === 'function' || typeof objectID !== 'string' && typeof objectID !== 'number') {
      var err = new Error('Cannot delete an object without an objectID');
      callback = objectID;
      if (typeof callback === 'function') {
        return callback(err);
      }

      return this.as._promise.reject(err);
    }

    var indexObj = this;
    return this.as._jsonRequest({ method: 'DELETE',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/' + encodeURIComponent(objectID),
                 callback: callback });
  },
  /*
   * Search inside the index using XMLHttpRequest request (Using a POST query to
   * minimize number of OPTIONS queries: Cross-Origin Resource Sharing).
   *
   * @param query the full text query
   * @param args (optional) if set, contains an object with query parameters:
   * - page: (integer) Pagination parameter used to select the page to retrieve.
   *                   Page is zero-based and defaults to 0. Thus, to retrieve the 10th page you need to set page=9
   * - hitsPerPage: (integer) Pagination parameter used to select the number of hits per page. Defaults to 20.
   * - attributesToRetrieve: a string that contains the list of object attributes you want to retrieve (let you minimize the answer size).
   *   Attributes are separated with a comma (for example "name,address").
   *   You can also use an array (for example ["name","address"]).
   *   By default, all attributes are retrieved. You can also use '*' to retrieve all values when an attributesToRetrieve setting is specified for your index.
   * - attributesToHighlight: a string that contains the list of attributes you want to highlight according to the query.
   *   Attributes are separated by a comma. You can also use an array (for example ["name","address"]).
   *   If an attribute has no match for the query, the raw value is returned. By default all indexed text attributes are highlighted.
   *   You can use `*` if you want to highlight all textual attributes. Numerical attributes are not highlighted.
   *   A matchLevel is returned for each highlighted attribute and can contain:
   *      - full: if all the query terms were found in the attribute,
   *      - partial: if only some of the query terms were found,
   *      - none: if none of the query terms were found.
   * - attributesToSnippet: a string that contains the list of attributes to snippet alongside the number of words to return (syntax is `attributeName:nbWords`).
   *    Attributes are separated by a comma (Example: attributesToSnippet=name:10,content:10).
   *    You can also use an array (Example: attributesToSnippet: ['name:10','content:10']). By default no snippet is computed.
   * - minWordSizefor1Typo: the minimum number of characters in a query word to accept one typo in this word. Defaults to 3.
   * - minWordSizefor2Typos: the minimum number of characters in a query word to accept two typos in this word. Defaults to 7.
   * - getRankingInfo: if set to 1, the result hits will contain ranking information in _rankingInfo attribute.
   * - aroundLatLng: search for entries around a given latitude/longitude (specified as two floats separated by a comma).
   *   For example aroundLatLng=47.316669,5.016670).
   *   You can specify the maximum distance in meters with the aroundRadius parameter (in meters) and the precision for ranking with aroundPrecision
   *   (for example if you set aroundPrecision=100, two objects that are distant of less than 100m will be considered as identical for "geo" ranking parameter).
   *   At indexing, you should specify geoloc of an object with the _geoloc attribute (in the form {"_geoloc":{"lat":48.853409, "lng":2.348800}})
   * - insideBoundingBox: search entries inside a given area defined by the two extreme points of a rectangle (defined by 4 floats: p1Lat,p1Lng,p2Lat,p2Lng).
   *   For example insideBoundingBox=47.3165,4.9665,47.3424,5.0201).
   *   At indexing, you should specify geoloc of an object with the _geoloc attribute (in the form {"_geoloc":{"lat":48.853409, "lng":2.348800}})
   * - numericFilters: a string that contains the list of numeric filters you want to apply separated by a comma.
   *   The syntax of one filter is `attributeName` followed by `operand` followed by `value`. Supported operands are `<`, `<=`, `=`, `>` and `>=`.
   *   You can have multiple conditions on one attribute like for example numericFilters=price>100,price<1000.
   *   You can also use an array (for example numericFilters: ["price>100","price<1000"]).
   * - tagFilters: filter the query by a set of tags. You can AND tags by separating them by commas.
   *   To OR tags, you must add parentheses. For example, tags=tag1,(tag2,tag3) means tag1 AND (tag2 OR tag3).
   *   You can also use an array, for example tagFilters: ["tag1",["tag2","tag3"]] means tag1 AND (tag2 OR tag3).
   *   At indexing, tags should be added in the _tags** attribute of objects (for example {"_tags":["tag1","tag2"]}).
   * - facetFilters: filter the query by a list of facets.
   *   Facets are separated by commas and each facet is encoded as `attributeName:value`.
   *   For example: `facetFilters=category:Book,author:John%20Doe`.
   *   You can also use an array (for example `["category:Book","author:John%20Doe"]`).
   * - facets: List of object attributes that you want to use for faceting.
   *   Comma separated list: `"category,author"` or array `['category','author']`
   *   Only attributes that have been added in **attributesForFaceting** index setting can be used in this parameter.
   *   You can also use `*` to perform faceting on all attributes specified in **attributesForFaceting**.
   * - queryType: select how the query words are interpreted, it can be one of the following value:
   *    - prefixAll: all query words are interpreted as prefixes,
   *    - prefixLast: only the last word is interpreted as a prefix (default behavior),
   *    - prefixNone: no query word is interpreted as a prefix. This option is not recommended.
   * - optionalWords: a string that contains the list of words that should be considered as optional when found in the query.
   *   Comma separated and array are accepted.
   * - distinct: If set to 1, enable the distinct feature (disabled by default) if the attributeForDistinct index setting is set.
   *   This feature is similar to the SQL "distinct" keyword: when enabled in a query with the distinct=1 parameter,
   *   all hits containing a duplicate value for the attributeForDistinct attribute are removed from results.
   *   For example, if the chosen attribute is show_name and several hits have the same value for show_name, then only the best
   *   one is kept and others are removed.
   * - restrictSearchableAttributes: List of attributes you want to use for textual search (must be a subset of the attributesToIndex index setting)
   * either comma separated or as an array
   * @param callback the result callback with two arguments:
   *  error: null or Error('message'). If false, the content contains the error.
   *  content: the server answer that contains the list of results.
   */
  search: function(query, args, callback) {
    if (arguments.length === 0 || typeof query === 'function') {
      // .search(), .search(cb)
      callback = query;
      query = '';
    } else if (arguments.length === 1 || typeof args === 'function') {
      // .search(query/args), .search(query, cb)
      callback = args;
      args = undefined;
    }

    // .search(args), careful: typeof null === 'object'
    if (typeof query === 'object' && query !== null) {
      args = query;
      query = undefined;
    } else if (query === undefined || query === null) { // .search(undefined/null)
      query = '';
    }

    var params = '';

    if (query !== undefined) {
      params += 'query=' + encodeURIComponent(query);
    }

    if (args !== undefined) {
      params = this.as._getSearchParams(args, params);
    }

    return this._search(params, callback);
  },

  /*
   * Browse all index content
   *
   * @param page Pagination parameter used to select the page to retrieve.
   *             Page is zero-based and defaults to 0. Thus, to retrieve the 10th page you need to set page=9
   * @param hitsPerPage: Pagination parameter used to select the number of hits per page. Defaults to 1000.
   * @param callback the result callback with two arguments:
   *  error: null or Error('message'). If false, the content contains the error.
   *  content: the server answer that contains the list of results.
   */
  browse: function(page, hitsPerPage, callback) {
    var indexObj = this;

    if (arguments.length === 1 || typeof hitsPerPage === 'function') {
      callback = hitsPerPage;
      hitsPerPage = undefined;
    }

    var params = '?page=' + page;
    if (!this.as._isUndefined(hitsPerPage)) {
      params += '&hitsPerPage=' + hitsPerPage;
    }
    return this.as._jsonRequest({ method: 'GET',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/browse' + params,
                 callback: callback });
  },

  /*
   * Get a Typeahead.js adapter
   * @param searchParams contains an object with query parameters (see search for details)
   */
  ttAdapter: function(params) {
    var self = this;
    return function(query, cb) {
      self.search(query, params, function(err, content) {
        if (err) {
          cb(err);
          return;
        }

        cb(content.hits);
      });
    };
  },

  /*
   * Wait the publication of a task on the server.
   * All server task are asynchronous and you can check with this method that the task is published.
   *
   * @param taskID the id of the task returned by server
   * @param callback the result callback with with two arguments:
   *  error: null or Error('message')
   *  content: the server answer that contains the list of results
   */
  waitTask: function(taskID, callback) {
    // waitTask() must be handled differently from other methods,
    // it's a recursive method using a timeout
    var indexObj = this;

    var promise = this.as._jsonRequest({
      method: 'GET',
      url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/task/' + taskID
    }).then(function success(content) {
      if (content.status !== 'published') {
        return new indexObj.as._promise.delay(100).then(function() {
          return indexObj.waitTask(taskID, callback);
        });
      }

      if (callback) {
        process.nextTick(function() {
          callback(null, content);
        });
      } else {
        return content;
      }
    }, function failure(err) {
      if (callback) {
        process.nextTick(function() {
          callback(err);
        });
      } else {
        return err;
      }
    });

    if (!callback) {
      return promise;
    }
  },

  /*
   * This function deletes the index content. Settings and index specific API keys are kept untouched.
   *
   * @param callback (optional) the result callback with two arguments
   *  error: null or Error('message')
   *  content: the settings object or the error message if a failure occured
   */
  clearIndex: function(callback) {
    var indexObj = this;
    return this.as._jsonRequest({ method: 'POST',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/clear',
                 callback: callback });
  },
  /*
   * Get settings of this index
   *
   * @param callback (optional) the result callback with two arguments
   *  error: null or Error('message')
   *  content: the settings object or the error message if a failure occured
   */
  getSettings: function(callback) {
    var indexObj = this;
    return this.as._jsonRequest({ method: 'GET',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/settings',
                 callback: callback });
  },

  /*
   * Set settings for this index
   *
   * @param settigns the settings object that can contains :
   * - minWordSizefor1Typo: (integer) the minimum number of characters to accept one typo (default = 3).
   * - minWordSizefor2Typos: (integer) the minimum number of characters to accept two typos (default = 7).
   * - hitsPerPage: (integer) the number of hits per page (default = 10).
   * - attributesToRetrieve: (array of strings) default list of attributes to retrieve in objects.
   *   If set to null, all attributes are retrieved.
   * - attributesToHighlight: (array of strings) default list of attributes to highlight.
   *   If set to null, all indexed attributes are highlighted.
   * - attributesToSnippet**: (array of strings) default list of attributes to snippet alongside the number of words to return (syntax is attributeName:nbWords).
   *   By default no snippet is computed. If set to null, no snippet is computed.
   * - attributesToIndex: (array of strings) the list of fields you want to index.
   *   If set to null, all textual and numerical attributes of your objects are indexed, but you should update it to get optimal results.
   *   This parameter has two important uses:
   *     - Limit the attributes to index: For example if you store a binary image in base64, you want to store it and be able to
   *       retrieve it but you don't want to search in the base64 string.
   *     - Control part of the ranking*: (see the ranking parameter for full explanation) Matches in attributes at the beginning of
   *       the list will be considered more important than matches in attributes further down the list.
   *       In one attribute, matching text at the beginning of the attribute will be considered more important than text after, you can disable
   *       this behavior if you add your attribute inside `unordered(AttributeName)`, for example attributesToIndex: ["title", "unordered(text)"].
   * - attributesForFaceting: (array of strings) The list of fields you want to use for faceting.
   *   All strings in the attribute selected for faceting are extracted and added as a facet. If set to null, no attribute is used for faceting.
   * - attributeForDistinct: (string) The attribute name used for the Distinct feature. This feature is similar to the SQL "distinct" keyword: when enabled
   *   in query with the distinct=1 parameter, all hits containing a duplicate value for this attribute are removed from results.
   *   For example, if the chosen attribute is show_name and several hits have the same value for show_name, then only the best one is kept and others are removed.
   * - ranking: (array of strings) controls the way results are sorted.
   *   We have six available criteria:
   *    - typo: sort according to number of typos,
   *    - geo: sort according to decreassing distance when performing a geo-location based search,
   *    - proximity: sort according to the proximity of query words in hits,
   *    - attribute: sort according to the order of attributes defined by attributesToIndex,
   *    - exact:
   *        - if the user query contains one word: sort objects having an attribute that is exactly the query word before others.
   *          For example if you search for the "V" TV show, you want to find it with the "V" query and avoid to have all popular TV
   *          show starting by the v letter before it.
   *        - if the user query contains multiple words: sort according to the number of words that matched exactly (and not as a prefix).
   *    - custom: sort according to a user defined formula set in **customRanking** attribute.
   *   The standard order is ["typo", "geo", "proximity", "attribute", "exact", "custom"]
   * - customRanking: (array of strings) lets you specify part of the ranking.
   *   The syntax of this condition is an array of strings containing attributes prefixed by asc (ascending order) or desc (descending order) operator.
   *   For example `"customRanking" => ["desc(population)", "asc(name)"]`
   * - queryType: Select how the query words are interpreted, it can be one of the following value:
   *   - prefixAll: all query words are interpreted as prefixes,
   *   - prefixLast: only the last word is interpreted as a prefix (default behavior),
   *   - prefixNone: no query word is interpreted as a prefix. This option is not recommended.
   * - highlightPreTag: (string) Specify the string that is inserted before the highlighted parts in the query result (default to "<em>").
   * - highlightPostTag: (string) Specify the string that is inserted after the highlighted parts in the query result (default to "</em>").
   * - optionalWords: (array of strings) Specify a list of words that should be considered as optional when found in the query.
   * @param callback (optional) the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer or the error message if a failure occured
   */
  setSettings: function(settings, callback) {
    var indexObj = this;
    return this.as._jsonRequest({ method: 'PUT',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/settings',
                 body: settings,
                 callback: callback });
  },
  /*
   * List all existing user keys associated to this index
   *
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with user keys list
   */
  listUserKeys: function(callback) {
    var indexObj = this;
    return this.as._jsonRequest({ method: 'GET',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/keys',
                 callback: callback });
  },
  /*
   * Get ACL of a user key associated to this index
   *
   * @param key
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with user keys list
   */
  getUserKeyACL: function(key, callback) {
    var indexObj = this;
    return this.as._jsonRequest({ method: 'GET',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/keys/' + key,
                 callback: callback });
  },
  /*
   * Delete an existing user key associated to this index
   *
   * @param key
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with user keys list
   */
  deleteUserKey: function(key, callback) {
    var indexObj = this;
    return this.as._jsonRequest({ method: 'DELETE',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/keys/' + key,
                 callback: callback });
  },
  /*
   * Add an existing user key associated to this index
   *
   * @param acls the list of ACL for this key. Defined by an array of strings that
   * can contains the following values:
   *   - search: allow to search (https and http)
   *   - addObject: allows to add/update an object in the index (https only)
   *   - deleteObject : allows to delete an existing object (https only)
   *   - deleteIndex : allows to delete index content (https only)
   *   - settings : allows to get index settings (https only)
   *   - editSettings : allows to change index settings (https only)
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with user keys list
   */
  addUserKey: function(acls, callback) {
    var indexObj = this;
    var aclsObject = {};
    aclsObject.acl = acls;
    return this.as._jsonRequest({ method: 'POST',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/keys',
                 body: aclsObject,
                 callback: callback });
  },
  /*
   * Add an existing user key associated to this index
   *
   * @param acls the list of ACL for this key. Defined by an array of strings that
   * can contains the following values:
   *   - search: allow to search (https and http)
   *   - addObject: allows to add/update an object in the index (https only)
   *   - deleteObject : allows to delete an existing object (https only)
   *   - deleteIndex : allows to delete index content (https only)
   *   - settings : allows to get index settings (https only)
   *   - editSettings : allows to change index settings (https only)
   * @param params.validity the number of seconds after which the key will be automatically removed (0 means no time limit for this key)
   * @param params.maxQueriesPerIPPerHour Specify the maximum number of API calls allowed from an IP address per hour.
   * @param params.maxHitsPerQuery Specify the maximum number of hits this API key can retrieve in one call.
   * @param callback the result callback with two arguments
   *  error: null or Error('message')
   *  content: the server answer with user keys list
   */
  addUserKeyWithValidity: function(acls, params, callback) {
    var indexObj = this;
    var aclsObject = {};
    aclsObject.acl = acls;
    aclsObject.validity = params.validity;
    aclsObject.maxQueriesPerIPPerHour = params.maxQueriesPerIPPerHour;
    aclsObject.maxHitsPerQuery = params.maxHitsPerQuery;
    return this.as._jsonRequest({ method: 'POST',
                 url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/keys',
                 body: aclsObject,
                 callback: callback });
  },
  ///
  /// Internal methods only after this line
  ///
  _search: function(params, callback) {
    return this.as._jsonRequest({ cache: this.cache,
      method: 'POST',
      url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/query',
      body: {params: params},
      fallback: {
        method: 'GET',
        url: '/1/indexes/' + encodeURIComponent(this.indexName),
        body: {params: params}
      },
      callback: callback
    });
  },

  // internal attributes
  as: null,
  indexName: null,
  typeAheadArgs: null,
  typeAheadValueOption: null
};

// extracted from https://github.com/component/map/blob/master/index.js
// without the crazy toFunction thing
function map(arr, fn){
  var ret = [];
  for (var i = 0; i < arr.length; ++i) {
    ret.push(fn(arr[i], i));
  }
  return ret;
}

// extracted from https://github.com/coolaj86/knuth-shuffle
// not compatible with browserify
function shuffle(array) {
  /*eslint-disable*/
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

}).call(this,require(1),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"1":1,"2":2}],7:[function(require,module,exports){
(function (global){
// This is the AngularJS Algolia Search module
// It's using $http to do requests with a JSONP fallback
// $q promises are returned
var inherits = require(5);

var AlgoliaSearch = require(6);
var JSONPRequest = require(8);

global.angular.module('algoliasearch', [])
  .service('algolia', ['$http', '$q', '$timeout', function ($http, $q, $timeout) {

    function algoliasearch(applicationID, apiKey, opts) {
      return new AlgoliaSearchAngular(applicationID, apiKey, opts);
    }

    algoliasearch.version = require(9);

    function AlgoliaSearchAngular() {
      // call AlgoliaSearch constructor
      AlgoliaSearch.apply(this, arguments);
    }

    inherits(AlgoliaSearchAngular, AlgoliaSearch);

    AlgoliaSearchAngular.prototype._request = function(url, opts) {
      return $q(function(resolve, reject) {
        var timedOut;
        var body = null;

        if (opts.body !== undefined) {
          body = JSON.stringify(opts.body);
        }

        var timeout = $q(function(resolveTimeout) {
          $timeout(function() {
            timedOut = true;
            // will cancel the xhr
            resolveTimeout('test');
            resolve(new Error('Timeout - Could not connect to endpoint ' + url));
          }, opts.timeout);
        });

        $http({
          url: url,
          method: opts.method,
          data: body,
          cache: false,
          timeout: timeout
        }).then(function success(response) {
          resolve({
            statusCode: response.status,
            body: response.data
          });
        }, function error(response) {
          if (timedOut) {
            return;
          }

          // network error
          if (response.status === 0) {
            reject(new Error('Network error'));
            return;
          }

          resolve({
            body: response.data,
            statusCode: response.status
          });
        });
      });
    };

    AlgoliaSearchAngular.prototype._request.fallback = function(url, opts) {
      return $q(function(resolve, reject) {
        JSONPRequest(url, opts, function JSONPRequestDone(err, content) {
          if (err) {
            reject(err);
            return;
          }

          resolve(content);
        });
      });
    };

    AlgoliaSearchAngular.prototype._promise = {
      reject: function(val) {
        return $q.reject(val);
      },
      resolve: function(val) {
        // http://www.bennadel.com/blog/2735-q-when-is-the-missing-q-resolve-method-in-angularjs.htm
        return $q.when(val);
      },
      delay: function(ms) {
        return $q(function(resolve/*, reject*/) {
          $timeout(resolve, ms);
        });
      }
    };

    return {
      Client: function(applicationID, apiKey, options) {
        return algoliasearch(applicationID, apiKey, options);
      }
    };
  }]);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"5":5,"6":6,"8":8,"9":9}],8:[function(require,module,exports){
module.exports = JSONPRequest;

var JSONPCounter = 0;

function JSONPRequest(url, opts, cb) {
  if (opts.method !== 'GET') {
    cb(new Error('Method ' + opts.method + ' ' + url + ' is not supported by JSONP.'));
    return;
  }

  var cbCalled = false;
  var timedOut = false;

  JSONPCounter += 1;
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  var cbName = 'algoliaJSONP_' + JSONPCounter;
  var done = false;

  window[cbName] = function(data) {
    try {
      delete window[cbName];
    } catch (e) {
      window[cbName] = undefined;
    }

    if (timedOut) {
      return;
    }

    cbCalled = true;

    clean();

    cb(null, {
      body: data/*,
      // We do not send the statusCode, there's no statusCode in JSONP, it will be
      // computed using data.status && data.message like with XDR
      statusCode*/
    });
  };

  // add callback by hand
  url += '&callback=' + cbName;

  // add body params by hand
  if (opts.body && opts.body.params) {
    url += '&' + opts.body.params;
  }

  var ontimeout = setTimeout(timeout, opts.timeout);

  // script onreadystatechange needed only for
  // <= IE8
  // https://github.com/angular/angular.js/issues/4523
  script.onreadystatechange = readystatechange;
  script.onload = success;
  script.onerror = error;

  script.async = true;
  script.defer = true;
  script.src = url;
  head.appendChild(script);

  function success() {
    if (done || timedOut) {
      return;
    }

    done = true;

    // script loaded but did not call the fn => script loading error
    if (!cbCalled) {
      clean();
      cb(new Error('Failed to load JSONP script'));
    }
  }

  function readystatechange() {
    if (this.readyState === 'loaded' || this.readyState === 'complete') {
      success();
    }
  }

  function clean() {
    clearTimeout(ontimeout);
    script.onload = null;
    script.onreadystatechange = null;
    script.onerror = null;
    head.removeChild(script);

    try {
      delete window[cbName];
      delete window[cbName + '_loaded'];
    } catch (e) {
      window[cbName] = null;
      window[cbName + '_loaded'] = null;
    }
  }

  function timeout() {
    timedOut = true;
    clean();
    cb(new Error('Timeout - Could not connect to endpoint ' + url));
  }

  function error() {
    if (done || timedOut) {
      return;
    }

    clean();
    cb(new Error('Failed to load JSONP script'));
  }
}

},{}],9:[function(require,module,exports){
module.exports="3.0.6"
},{}]},{},[7]);
