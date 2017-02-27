(function (window, undefined){
  /* jshint maxstatements:false */
  var Canadarm = {};

  Canadarm.Appender = {};
  Canadarm.Handler = {};
  Canadarm.constant = {};
  Canadarm.utils = {};
  Canadarm.version = '1.0.2';

/**
 * Values used throughout Canadarm to keep logs consistent.
 *
 * @namespace constant
 * @memberof Canadarm
 * @property UNKNOWN_LOG {string} - Constant for unknown log values.
 * @example
 *   logAttributes = {values: someStuff, unkownValue: Canadarm.constant.UKNOWN_LOG};
 * @readonly
 * @static
 * @final
 */
Canadarm.constant.UNKNOWN_LOG = '?';

/**
 * Contains the log levels available.
 *
 * @namespace level
 * @memberof Canadarm
 *
 * @property FATAL {constant} - App crashed and there was no recovery attempt.
 * @property ERROR {constant} - App crashed and there may have been a recovery attempt.
 * @property WARN {constant}  - App crashed and was recovered.
 * @property INFO {constant}  - Information about something that happened.
 * @property DEBUG {constant} - Used for development testing.
 */
var level = {
  FATAL : 'FATAL',
  ERROR : 'ERROR',
  WARN  : 'WARN',
  INFO  : 'INFO',
  DEBUG : 'DEBUG'
};

Canadarm.level = level;
Canadarm.levelOrder = [
  level.DEBUG,
  level.INFO,
  level.WARN,
  level.ERROR,
  level.FATAL
];

// We may not have index of for Arrays.
// Add it if it does not exist.
// Implementation of the below code borrowed from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf

// Ignore code conventions below to keep in tact with reference implementation linked above.
/* jshint ignore:start */
if (typeof Canadarm.levelOrder.indexOf === 'undefined') {
  Canadarm.levelOrder.indexOf = function(searchElement, fromIndex) {

    var k;

    // 1. Let O be the result of calling ToObject passing
    //    the this value as the argument.
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of O with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}
/* jshint ignore:end */

/**
 * Fixes URI component encoding. All parameters to log are passed first
 * to this function.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent}
 *
 * @method fixedEncodeURIComponent
 *
 * @param {string} str - The string to encode
 */
function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

Canadarm.utils.fixedEncodeURIComponent = fixedEncodeURIComponent;

/**
 * This file contains the base code for hooking together the Canadarm code.
 */

// These comments are added for JSDoc. It defines the
// namespaces used across the various development files.
// Do not modify this section of comments unless you have
// good reason.
/**
  @namespace Canadarm
*/
/**
  @namespace Handler
  @memberof Canadarm
*/
/**
  @namespace Appender
  @memberof Canadarm
*/
/**
  pseudo namespace to help with documentation.
  @namespace Events
  @memberof Canadarm
*/

var errorAppenders = [],
    errorHandlers = [];

/**
 * Used to setup Canadarm for consumers. The properties below are for the settings
 * object passed to the init function.
 *
 * @example
 *  Canadarm.init({
 *    onError: true,  // Set to false if you do not want window.onerror set.
 *    wrapEvents: true, // Set to false if you do not want all event handlers to be logged for errors
 *    logLevel: Canadarm.level.WARN, // Will only send logs for level of WARN and above.
 *    appenders: [
 *      Canadarm.Appender.standardLogAppender
 *    ],
 *    handlers: [
 *      Canadarm.Handler.beaconLogHandler('http://example.com/beacon.gif'),
 *      Canadarm.Handler.consoleLogHandler
 *    ]
 *  })
 *
 * @function init
 *
 * @param {object} settings - options for setting up canadarm.
 * @property settings[onError] {boolean}    - True, Canadarm will set onerror. Defaults to true.
 * @property settings[wrapEvents] {boolean} - True, Canadarm will wrap event binding. Defaults to true.
 * @property settings[appenders] {Array}    - Array of Appenders for Canadarm to use. Defaults to empty.
 * @property settings[handlers] {Array}     - Array of Handlers for Canadarm to use. Defaults to empty.
 * @property settings[logLevel] {String}    - The log level to log at. Defaults to Canadarm.level.DEBUG.
 */
function init(settings) {
  var opts = settings || {},
    i;

  if (opts.onError !== false) {
    Canadarm.setUpOnErrorHandler();
  }

  if (opts.wrapEvents !== false) {
    Canadarm.setUpEventListening();
  }

  if (opts.appenders) {
    for (i = 0; i < opts.appenders.length; i++) {
      Canadarm.addAppender(opts.appenders[i]);
    }
  }

  if (opts.handlers) {
    for (i = 0; i < opts.handlers.length; i++) {
      Canadarm.addHandler(opts.handlers[i]);
    }
  }

  if (opts.logLevel) {
    Canadarm.loggingLevel = opts.logLevel;
  }
}

/**
 * Adds the specified logAppender to existing appenders for logging.
 *
 * @example
 *  Canadarm.addAppender(Canadarm.Appender.standardLogAppender);
 *
 * @function addAppender
 *
 * @param {function} logAppender - Log appender for gather log data.
 */
function addAppender(logAppender) {
  errorAppenders.push(logAppender);
}

/**
 * Adds the specified logHandler to existing handlers for logging.
 *
 * @example
 *  Canadarm.addHandler(Canadarm.Handler.consoleLogHandler);
 *  Canadarm.addHandler(Canadarm.Handler.beaconLogHandler('http://example.com/beacon.gif'));
 *
 * @function addHandler
 *
 * @param {function} logHandler - Log handler for logs.
 */
function addHandler(logHandler) {
  errorHandlers.push(logHandler);
}

/**
 * Used to gather the errors that have occurred.  This function loops over the existing
 * logAppenders and creates the attributes that will be logged to the errors. Returns
 * an object of errors to log.
 *
 * @function gatherErrors
 * @private
 *
 * @param {string} level      - Log level of the exception. (e.g. ERROR, FATAL)
 * @param {error}  exception  - JavaScript Error object.
 * @param {string} message    - Message of the error.
 * @param {object} data       - Key/Value pairing of additional properties to log.
 * @param {array} appenders   - If passed will override existing appenders and be used.
 */
function gatherErrors(level, exception, message, data, appenders) {
  var logAttributes = {},
    localAppenders = appenders || errorAppenders,
    errorAppender, attributeName, attributes, i, key;

  // Go over every log appender and add it's attributes so we can log them.
  for (i = 0; i < localAppenders.length; i++) {
    errorAppender = localAppenders[i];
    attributes = errorAppender(level, exception, message, data);

    for (key in attributes) {
      if (!attributes.hasOwnProperty(key)) {
        continue;
      }
      logAttributes[key] = attributes[key];
    }
  }

  return logAttributes;
}

/**
 * Sends the errors passed in `logAttributes` for each logHandler.
 *
 * @method pushErrors
 * @private
 *
 * @param {object} logAttributes -- A key/value pairing of the attributes to log.
 * @param {array} handlers   -- If passed will override existing handlers and be used.
 */
function pushErrors(logAttributes, handlers) {
  var localHandlers = handlers || errorHandlers,
    errorHandler, i;

  // Go over every log handler so we can actually create logs.
  for (i = 0; i < localHandlers.length; i++) {
    errorHandler = localHandlers[i];
    errorHandler(logAttributes);
  }
}


/**
 * Used to generate our custom loggers.
 *
 * @function customLogEvent
 * @private
 *
 * @param {string} level - The level to log the events.
 *
 * @returns a function that logs what is passed.  Signature is: message, exception, data, settings.
 */
function customLogEvent(level) {

  // options should contain the appenders and handlers to override the
  // global ones defined in errorAppenders, and errorHandlers.
  // Used by Canadarm.localWatch to wrap local appender calls.
  return function (message, exception, data, settings) {

    // If we are are below the current Canadarm.loggingLevel we
    // should not do anything with the passed information.  Return
    // as if nothing happened.
    if (Canadarm.levelOrder.indexOf(level) < Canadarm.levelOrder.indexOf(Canadarm.loggingLevel)) {
      return;
    }

    var options = settings || {},
      attrs = gatherErrors(level, exception, message, data, options.appenders);
    pushErrors(attrs, options.handlers);
  };
}

// Custom logging functions for when code is captured
Canadarm.debug = customLogEvent(Canadarm.level.DEBUG);
Canadarm.info = customLogEvent(Canadarm.level.INFO);
Canadarm.warn = customLogEvent(Canadarm.level.WARN);
Canadarm.error = customLogEvent(Canadarm.level.ERROR);
Canadarm.fatal = customLogEvent(Canadarm.level.FATAL);

// Add logHandler and logAppender functions so Canadarm will work
Canadarm.addHandler = addHandler;
Canadarm.addAppender = addAppender;

// Add init so Canadarm can be setup easily.
Canadarm.init = init;

// Set default loggingLevel
Canadarm.loggingLevel = Canadarm.level.DEBUG;

/* globals document */

/**
 * Recommended default log appender. Adds property attributes below to the logs.  Depending
 * on the browser some values may be default logged as '?' when the value cannot
 * be determined.
 *
 * @memberof Canadarm.Appender
 * @function standardLogAppender
 *
 * @property logDate      {string}  - The UTC time the browser threw the error.
 * @property language     {string}  - The language set on the page.
 * @property characterSet {string}  - Encoding used to read the page.
 * @property type         {string}  - Specifies the type of the log as 'jserror'.
 * @property columnNumber {integer} - The column number of where the error took place.
 * @property lineNumber   {integer} - The line number of where the error took place.
 * @property msg          {string}  - The message for the error. (e.g. [ERROR]: blah blah)
 * @property pageURL      {string}  - The URL location of the page the error occurred on.
 * @property url          {string}  - The URL location of the script that produced the error.
 * @property stack        {object}  - Stacktrace of the exception that occurred.
 *
 * @param {string} level     - Log level of the exception. (e.g. ERROR, FATAL)
 * @param {error}  exception - JavaScript Error object.
 * @param {string} message   - Message of the error.
 * @param {object} data      - A no nesting key/value set of extra data for a log.
 */
function standardLogAppender(level, exception, message, data) {
  // Attempt to get the Error stack if it isn't passed in.  Without the stack
  // the traceback is not as useful.  For more information on Error stack see:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/stack
  var stack        = exception ? exception.stack : new Error().stack || null,
    scriptURL      =  Canadarm.constant.UNKNOWN_LOG,
    errorMessage   = message || exception.message || Canadarm.constant.UNKNOWN_LOG,
    // Want an ISO string because local time sent as a log is not helpful
    currentDate    = new Date(),
    pageURI        = window.location.href,
    lineNumber     = Canadarm.constant.UNKNOWN_LOG,
    columnNumber   = Canadarm.constant.UNKNOWN_LOG,
    language       = window.navigator.language || Canadarm.constant.UNKNOWN_LOG,
    characterSet   = window.document.characterSet ||
                    window.document.charset ||
                    window.document.defaultCharset ||
                    Canadarm.constant.UNKNOWN_LOG,
    logAttributes,
    dataKey,
    stackData,
    dateTime,

    // first position is the URL of the script,
    // second position is the line number,
    // third position is the column number,
    // last position is used to gobble down so we can get the data in all browsers.
    STACK_SCRIPT_COLUMN_LINE_FINDER = /(http\:\/\/.*\/.*\.js)\:(\d+)\:(\d+)(.*)$/;

  // Generates the url, lineNumber, and Column number of the error.
  function findStackData(stack) {
    // If the stack is not in the error we cannot get any information and
    // should return immediately.
    if (stack === undefined || stack === null) {
      return {
        'url': Canadarm.constant.UNKNOWN_LOG,
        'lineNumber': Canadarm.constant.UNKNOWN_LOG,
        'columnNumber': Canadarm.constant.UNKNOWN_LOG
      };
    }

    // Remove the newlines from all browsers so we can regex this easier
    var stackBits = stack.replace(/(\r\n|\n|\r)/gm,'').match(STACK_SCRIPT_COLUMN_LINE_FINDER),
      newStack, stackData = [],
      stackHasBits = (stackBits !== null && stackBits !== undefined);

    while (stackHasBits) {
      stackBits = stackBits[1].match(STACK_SCRIPT_COLUMN_LINE_FINDER);
      newStack = stackBits !== null ? stackBits[1] : null;
      stackData = stackBits !== null ? stackBits : stackData;
      stackHasBits = (stackBits !== null && stackBits !== undefined);
    }

    return {
      'url': stackData.length >= 1 ? stackData[1] : Canadarm.constant.UNKNOWN_LOG,
      'lineNumber': stackData.length >= 1 ? stackData[2] : Canadarm.constant.UNKNOWN_LOG,
      'columnNumber': stackData.length >= 1 ? stackData[3] : Canadarm.constant.UNKNOWN_LOG
    };
  }

  // Use an internal polyfill for Date.toISOString
  // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString#Polyfill
  // Not attaching it to prototype so we do not add implementation to consumers.
  function pad(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }

  if (!currentDate.toISOString) {
    dateTime = (function() {
      return currentDate.getUTCFullYear() +
        '-' + pad(currentDate.getUTCMonth() + 1) +
        '-' + pad(currentDate.getUTCDate()) +
        'T' + pad(currentDate.getUTCHours()) +
        ':' + pad(currentDate.getUTCMinutes()) +
        ':' + pad(currentDate.getUTCSeconds()) +
        '.' + (currentDate.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
        'Z';
    }());
  } else {
    dateTime = currentDate.toISOString();
  }

  // If stack is not defined we are in a browser that does not fully support our logging.
  // Or one of our custom loggers was called, e.g. Logger.debug('message').
  if (exception === undefined || exception === null || exception.stack === null) {
    if (typeof window.document.getElementsByTagName === 'function') {
      var scripts = window.document.getElementsByTagName('script');
      scriptURL = (window.document.currentScript || scripts[scripts.length - 1]).src;
    } else {
      // Probably not in a browser, return unknown log.
      scriptURL = Canadarm.constant.UNKNOWN_LOG;
    }

  } else {
    stackData = findStackData(stack);

    scriptURL = stackData.url;
    lineNumber = stackData.lineNumber;
    columnNumber = stackData.columnNumber;

  }

  // Set base values for log attributes.
  logAttributes = {
    'characterSet' : characterSet,
    'columnNumber' : columnNumber,
    'language'     : language,
    'lineNumber'   : lineNumber,
    'logDate'      : dateTime,
    'msg'          : '[' + level + ']: ' + errorMessage,
    'pageURL'      : pageURI,
    'stack'        : stack || Canadarm.constant.UNKNOWN_LOG,
    'type'         : 'jserror',
    'scriptURL'    : scriptURL
  };

  // Gather the data and add it to our standard logger.
  for (dataKey in data) {
    if (!data.hasOwnProperty(dataKey)){
      continue;
    }
    // Only set value for legitimate data.
    if (data[dataKey] !== null && data[dataKey] !== undefined) {
      logAttributes[dataKey] = data[dataKey];
    }
  }

  return logAttributes;
}

Canadarm.Appender.standardLogAppender = standardLogAppender;

/* global Image */

/**
 * Beacon log handler. Uses a configured beacon file to get logs to a remote logging location.
 *
 * @memberof Canadarm.Handler
 * @function beaconLogHandler
 *
 * @example
 *   Canadarm.addHandler(Canadarm.Handler.beaconLogHandler('http://example.com/to/beacon.gif'));
 *
 *   // If you use an access_combined log format for the beacon you will see something like:
 *   10.162.143.4 - - [21/Apr/2015:16:07:59 -0500] "GET ?characterSet=UTF-8%0A&columnNumber=%3F%0A&language=en-US...
 *
 * @param {string} beaconURL - The URL to send logs.
 *
 * @returns a function that takes an attribute object for logging.
 */
 function beaconLogHandler(beaconURL) {

  return function logHandler(logAttributes) {
    var logValues = [],
      imageLogger = new Image(), key;

    // Put attributes into a format that are easy to jam into a URL
    for(key in logAttributes) {
      if (!logAttributes.hasOwnProperty(key)){
        continue;
      }
      logValues.push(
        key + '=' + Canadarm.utils.fixedEncodeURIComponent(logAttributes[key] + '\n')
      );
    }

    // Sends logs off to the server
    imageLogger.src = beaconURL + '?' + logValues.join('&');
   };
}

Canadarm.Handler.beaconLogHandler = beaconLogHandler;

/**
 * Console log handler. Outputs logs to console.
 *
 * @memberof Canadarm.Handler
 * @function consoleLogHandler
 *
 * @example
 *   Canadarm.addHandler(Canadarm.Handler.consoleLogHandler);
 *
 *   // In Chrome the output looks similar to:
 *   [ERROR]: two is not defined
 *   characterSet: "windows-1252"
 *   columnNumber: "17"
 *   language: "en-US"
 *   lineNumber: "17"
 *   logDate: "2015-04-22T21:35:40.389Z"
 *   msg: "[ERROR]: two is not defined"
 *   pageURL: "http://localhost:8000/html/"
 *   scriptURL: "http://localhost:8000/js/broken.js"
 *   stack: "ReferenceError: two is not defined↵
 *       at broken_watched_function (http://localhost:8000/js/broken.js:17:17)↵
 *       at wrapper (http://localhost:8000/js/canadarm.js:616:17)↵
 *       at http://localhost:8000/js/broken.js:60:40
 *   "type: "jserror"
 *
 * @param {object} logAttributes - the attributes to log, key/value pairs, no nesting.
 */
 function consoleLogHandler(logAttributes) {
  var logValues = '', key;

  if (console) {
    // detect IE
    if (window.attachEvent) {
      // Put attributes into a format that are easy for IE 8 to read.
      for (key in logAttributes) {
        if (!logAttributes.hasOwnProperty(key)) {
          continue;
        }
        logValues += key + '=' + logAttributes[key] + '\n';
      }

      console.error(logValues);
    } else if (typeof logAttributes.msg !== 'undefined') {
      console.error(logAttributes.msg, logAttributes);
    } else {
      console.error(logAttributes);
    }
  }
}

Canadarm.Handler.consoleLogHandler = consoleLogHandler;

function _watchFn(fn, context, settings) {
  // Exit function early if it has already
  // been wrapped in a watch call.
  if (fn && fn._wrapper && typeof(fn._wrapper === 'function')) {
    return fn._wrapper;
  }

  var wrapper = function() {
    try {
      return fn.apply(context || this, arguments);
    } catch(error) {
      Canadarm.error(error.message, error, undefined, settings);
    }
  };

  fn._wrapper = wrapper;
  return wrapper;
}

/**
 * Return a wrapped function which when called, logs any errors thrown.
 *
 * @memberof Canadarm.Events
 * @function watch
 *
 * @example
 *   Canadarm.watch(myFunction);
 *
 * @param {Function} fn - The function to wrap.
 * @param {Object} context - The context to execute the function in. Defaults to this.
 * @return A wrapped function with the original function a property of the wrapped function called _wrapped.
 */
Canadarm.watch = function(fn, context) {
  return _watchFn(fn, context);
};


/**
 * Execute the given function and logs any errors thrown.
 *
 * @memberof Canadarm.Events
 * @function attempt
 *
 * @example
 *   Canadarm.attempt(myFunction); // immediately executed
 *
 * @param {function} fn - The function to wrap.
 * @param {object} context - The context to execute the function in. Defaults to this.
 * @param {} Additional arguments passed to the function.
 * @return The result of passed function fn.
 */
Canadarm.attempt = function(fn, context) {
  var args = Array.prototype.slice.call(arguments, 2);
  return _watchFn(fn, context)(args);
};

/**
 * Return wrapped function which when called, logs any errors thrown.
 * Should only be used when needing to have custom, localized error
 * handling.
 *
 * @memberof Canadarm.Events
 * @function localWatch
 *
 * @example
 *   mySpecificFunction = Canadarm.localWatch(function realFunction() {
 *      // The parts that do the actual work of your application.
 *    },
 *    {
 *      appenders: [Canadarm.Appender.standardLogAppender],
 *      handlers: [Canadarm.Handler.beaconHandler('http://path-to-my-logger.somesite.com/more-path/')]
 *    }
 *  )
 *
 * @param {function} fn - The function to wrap
 * @param {object} settings - Override default Appenders and Handlers here, by default will do nothing if not passed.
 * @param {object} context - The context to execute the function in. Defaults to this.
 * @return A wrapped function with the original function a property of the wrapped function called _wrapped.
 */
Canadarm.localWatch = function(fn, settings, context) {
  return _watchFn(fn, context, settings);
};

/**
 * Execute the given function and logs any errors thrown.
 *
 * @memberof Canadarm.Events
 * @function localAttempt
 *
 * @example
 *   Canadarm.localAttempt(myFunction, settingsHash); // immediately executed
 *
 * @param {function} fn - The function to wrap.
 * @param {object} settings - Override default Appenders and Handlers here, by default will do nothing if not passed.
 * @param {object} context - The context to execute the function in. Defaults to this.
 * @param {} Additional arguments passed to the function.
 * @return The result of passed function fn.
 */
Canadarm.localAttempt = function(fn, settings, context) {
  var args = Array.prototype.slice.call(arguments, 3);
  return _watchFn(fn, context, settings)(args);
};

/**
* This file is used to catch errors that bubble up to the global window object.
*/

/**
 * Keep track of the original onerror event handler just in case it already
 * existed by the time Canadarm is loaded.  This allows Canadarm to be mostly
 * passive to existing onerror handlers.
 * @private
 */
var _oldOnError = window.onerror;

/**
 * Logs the errors that have occurred.  Its signature matches that of `window.onerror`.
 * Will replace the `window.onerror`.  It will still call the original `window.onerror`
 * as well if it existed.
 *
 * @function _onError
 * @private
 */
function _onError(errorMessage, url, lineNumber, columnNumber, exception) {
  var onErrorReturn;

  // Execute the original window.onerror handler, if any
  if (_oldOnError && typeof _oldOnError === 'function') {
    onErrorReturn = _oldOnError.apply(this, arguments);
  }

  Canadarm.fatal(errorMessage, exception, {
    url: url,
    lineNumber: lineNumber,
    columnNumber: columnNumber
  });

  return onErrorReturn;
}

/**
 * Sets up error handling at the window level.
 *
 * @function setUpOnErrorHandler
 * @private
 */
function setUpOnErrorHandler() {
  // Take over the default `window.onerror` so we log errors that occur
  // in the browser.
  window.onerror = _onError;
}

/**
 * Internal method used to setup window.onerror if set in settings.
 */
Canadarm.setUpOnErrorHandler = setUpOnErrorHandler;
/* global Event,Element */
/**
 * Internal method for setting up event listening within this library.
 *
 * This works by overriding the default `addEventListener`/`attachEvent` and
 * the `removeEventListener`/`detachEvent`.  The default add and remove of events
 * is overridden and every function that is attached as a listener is wrapped in a
 * `Canadarm.watch` call.
 *
 * For removing of the event the internals of the `Canadarm.watch` call keep track
 * of the function made and always return a new function for watching or the one
 * that is already watched. This allows the code between attaching and removing
 * events to look nearly identical.  It also has the added bonus of not doing
 * extra work when accidentally watching an already watched function.
 *
 * @private
 * @memberof Canadarm.Events
 * @function setUpEventListening
 */
function setUpEventListening() {
  var addEventListener, removeEventListener,
    eventListeners = [];

  // Modern Browsers
  if (window.EventTarget) {
    addEventListener = window.EventTarget.prototype.addEventListener;
    removeEventListener = window.EventTarget.prototype.removeEventListener;

    window.EventTarget.prototype.addEventListener = function (event, callback, bubble) {
      return addEventListener.call(this, event, Canadarm.watch(callback), bubble);
    };

    window.EventTarget.prototype.removeEventListener = function (event, callback, bubble) {
      return removeEventListener.call(this, event, Canadarm.watch(callback), bubble);
    };

  // Internet Explorer < 9
  } else if (window.Element && window.Element.prototype && window.Element.prototype.attachEvent) {

    // Only shim addEventListener if it has not already been shimmed.
    if (window.Element.prototype.addEventListener === undefined) {

      // Shim adapted from:
      // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Compatibility
      //
      // Only doing a Canadarm.watch on standard watched events. No on onload event because
      // we do not need to watch that event.  If that fails the page will not work.
      if (!Event.prototype.preventDefault) {
        Event.prototype.preventDefault = function() {
          this.returnValue=false;
        };
      }
      if (!Event.prototype.stopPropagation) {
        Event.prototype.stopPropagation = function() {
          this.cancelBubble=true;
        };
      }
      if (!Element.prototype.addEventListener) {

        addEventListener = function(type, listener) {
          var self = this, e, wrapper2,
            wrapper = function(e) {
              e.target = e.srcElement;
              e.currentTarget = self;
              if (listener.handleEvent) {
                listener.handleEvent(e);
              } else {
                listener.call(self,e);
              }
            };

          if (type !== 'DOMContentLoaded') {
            this.attachEvent('on' + type, Canadarm.watch(wrapper));
            eventListeners.push({object:this, type:type, listener:listener, wrapper:wrapper});
          }
        };

        removeEventListener = function(type, listener) {
          var counter = 0, eventListener;

          while (counter < eventListeners.length) {
            eventListener = eventListeners[counter];

            if (eventListener.object == this && eventListener.type === type && eventListener.listener == listener) { /* jshint ignore:line */

              if (type !== 'DOMContentLoaded') {
                this.detachEvent('on' + type, Canadarm.watch(eventListener.wrapper));
              }

              eventListeners.splice(counter, 1);
              break;
            }
            ++counter;
          }
        };

        Element.prototype.addEventListener = addEventListener;
        Element.prototype.removeEventListener = removeEventListener;
      }
    }
  }
}

/**
 * Internal method used to setup automatic event error logging
 * when a consumer has opted in via settings.
 */
Canadarm.setUpEventListening = setUpEventListening;

// Add navigator so when running in a node environment it exists.
if (!window.navigator) {
  window.navigator = {};
}

// Add location so when running in a node environment it exists.
if (!window.location) {
  window.location = {};
}

// Add document for node
if (!window.document) {
  window.document = {};
}

  // Add navigator so when running in a node environment it exists.
  if (!window.navigator) {
    window.navigator = {};
  }

  // Added so we have access to window in tests.
  Canadarm._window = window;

  // Expose Canadarm
  if (typeof define === 'function' && define.amd) {
    // AMD
    window.Canadarm = Canadarm;
    define('canadarm', [], function() {
      return Canadarm;
    });
  } else if (typeof module === 'object') {
    // browserify
    module.exports = Canadarm;
  } else if (typeof exports === 'object') {
    // CommonJS
    exports = Canadarm;
  } else {
    // Everything else
    window.Canadarm = Canadarm;
  }
}(typeof window !== 'undefined' ? window : this));
