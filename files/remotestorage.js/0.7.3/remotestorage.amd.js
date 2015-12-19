/* remoteStorage.js 0.7.3 remotestorage.io, MIT-licensed */
define([], function() {
/**
 * almond 0.1.4 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        aps = [].slice;

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (waiting.hasOwnProperty(name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!defined.hasOwnProperty(name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    function makeMap(name, relName) {
        var prefix, plugin,
            index = name.indexOf('!');

        if (index !== -1) {
            prefix = normalize(name.slice(0, index), relName);
            name = name.slice(index + 1);
            plugin = callDep(prefix);

            //Normalize according
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            p: plugin
        };
    }

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = makeRequire(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = defined[name] = {};
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = {
                        id: name,
                        uri: '',
                        exports: defined[name],
                        config: makeConfig(name)
                    };
                } else if (defined.hasOwnProperty(depName) || waiting.hasOwnProperty(depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else if (!defining[depName]) {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 15);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        return req;
    };

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        waiting[name] = [name, deps, callback];
    };

    define.amd = {
        jQuery: true
    };
}());

define("../build/lib/almond", function(){});

/*global Buffer */
/*global window */
/*global console */
/*global Uint8Array */
/*global setTimeout */
/*global localStorage */
/*global ArrayBuffer */

define('lib/util',[], function() {

  

  // Namespace: util
  //
  // Utility functions. Mainly logging.
  //

  var loggers = {}, silentLogger = {};

  var knownLoggers = [];

  var logFn = null;

  var logLevels = {
    error: true,
    info: true,
    debug: false
  };

  var atob, btoa;

  // btoa / atob for nodejs implemented here, so util/platform don't form
  // a circular dependency.
  if(typeof(window) === 'undefined') {
    atob = function(str) {
      var buffer = str instanceof Buffer ? str : new Buffer(str, 'base64');
      return buffer.toString('binary');
    };
    btoa = function(str) {
      var buffer = str instanceof Buffer ? str : new Buffer(str, 'binary');
      return buffer.toString('base64');
    };
  } else {
    atob = window.atob;
    btoa = window.btoa;
  }

  var Warning = function() {
    Error.apply(this, arguments);
  };
  Warning.prototype = Error.prototype;

  var util = {

    bufferToRaw: function(buffer) {
      var view = new Uint8Array(buffer);
      var nData = view.length;
      var rawData = '';
      for(var i=0;i<nData;i++) {
        rawData += String.fromCharCode(view[i]);
      }
      return rawData;
    },

    rawToBuffer: function(rawData) {
      var nData = rawData.length;
      var buffer = new ArrayBuffer(nData);
      var view = new Uint8Array(buffer);

      for(var i=0;i<nData;i++) {
        view[i] = rawData.charCodeAt(i);
      }
      return buffer;
    },

    encodeBinary: function(buffer) {
      return btoa(this.bufferToRaw(buffer));
    },

    decodeBinary: function(data) {
      return this.rawToBuffer(atob(data));
    },

    // Method: toArray
    // Convert something into an Array.
    // Example:
    // > function squareAll() {
    // >   return util.toArray(arguments).map(function(arg) {
    // >     return Math.pow(arg, 2);
    // >   });
    // > }
    toArray: function(arrayLike) {
      return Array.prototype.slice.call(arrayLike);
    },

    nextTick: function(action) {
      setTimeout(action, 0);
    },

    // Method: isDir
    // Convenience method to check if given path is a directory.
    isDir: function(path) {
      return path.substr(-1) == '/';
    },

    pathParts: function(path) {
      var parts = [];
      var md;
      while((md = path.match(/^(.*?)([^\/]+\/?)$/))) {
        parts.unshift(md[2]);
        path = md[1];
      }
      parts.unshift('/');
      return parts;
    },

    pathContains: function(a, b) {
      return a.slice(0, b.length) === b;
    },

    extend: function() {
      var result = arguments[0];
      var objs = Array.prototype.slice.call(arguments, 1);
      objs.forEach(function(obj) {
        if(obj) {
          for(var key in obj) {
            result[key] = obj[key];
          }
        }
      });
      return result;
    },

    // Method: containingDir
    // Calculate the parent path of the given path, by stripping the last part.
    //
    // Parameters:
    //   path - any path, absolute or relative.
    //
    // Returns:
    //   the parent path or *null*, if the given path is a root ("" or "/")
    //
    containingDir: function(path) {
      var dir = path.replace(/[^\/]+\/?$/, '');
      return dir == path ? null : dir;
    },

    baseName: function(path) {
      var parts = path.split('/');
      if(util.isDir(path)) {
        return parts[parts.length-2]+'/';
      } else {
        return parts[parts.length-1];
      }
    },

    // Function: bindAll
    // Bind all function properties of given object to it's object.
    //
    // Makes it a lot easier to use methods as callbacks.
    //
    // Example:
    //   (start code)
    //   var o = { foo: function() { return this; } };
    //   util.bindAll(o);
    //    
    //   var f = o.foo; // detach function from object
    //    
    //   f() === o; // -> true, function is still bound to object "o".
    //   (end code)
    //
    bindAll: function(object) {
      for(var key in object) {
        if(typeof(object[key]) === 'function') {
          object[key] = this.bind(object[key], object);
        }
      }
      return object;
    },

    // Function: curry
    // <Curry at http://www.cs.nott.ac.uk/~gmh/faq.html#currying> given function.
    //
    // Example:
    //   (start code)
    //   function f(n, m) {
    //     console.log("N: " + n + ", M: " + m);
    //   }
    //   var f3 = curry(f, 3);
    //   // later:
    //   f3(4);
    //   // prints "N: 3, M: 4";
    //   (end code)
    curry: function(f) {
      if(typeof(f) !== 'function') {
        throw new Error("Can only curry functions!");
      }
      var _a = Array.prototype.slice.call(arguments, 1);
      return function() {
        var a = util.toArray(arguments);
        for(var i=(_a.length-1);i>=0;i--) {
          a.unshift(_a[i]);
        }
        return f.apply(this, a);
      };
    },

    // Function: rcurry
    // Same as <curry>, but append instead of prepend given arguments.
    //
    // Example:
    //   (start code)
    //   function f(n, m) {
    //     console.log("N: " + n + ", M: " + m);
    //   }
    //   var f3 = rcurry(f, 3);
    //   // later:
    //   f3(4);
    //   // prints "N: 4, M: 3";
    //   (end code)
    //
    rcurry: function(f) {
      if(typeof(f) !== 'function') {
        throw new Error("Can only curry functions!");
      }
      var _a = Array.prototype.slice.call(arguments, 1);
      return function() {
        var a = util.toArray(arguments);
        _a.forEach(function(item) {
          a.push(item);
        });
        return f.apply(this, a);
      };
    },

    bind: function(callback, context) {
      if(context) {
        return function() { return callback.apply(context, arguments); };
      } else {
        return callback;
      }
    },

    hostNameFromUri: function(url) {
      var md = url.match(/^https?:\/\/([^\/]+)/);
      return md ? md[1] : '';
    },

    deprecate: function(methodName, replacement) {
      console.log('WARNING: ' + methodName + ' is deprecated, use ' + replacement + ' instead');
    },

    // Function: highestAccess
    // Combine two access modes and return the highest one.
    //
    // Parameters:
    //   a, b - Access modes. Either 'r', 'rw' or undefined.
    //
    // Returns:
    //   'rw' or 'r' or null.
    highestAccess: function(a, b) {
      return (a == 'rw' || b == 'rw') ? 'rw' : (a == 'r' || b == 'r') ? 'r' : null;
    },

    // Method: getEventEmitter
    //
    // Create a new EventEmitter object and return it.
    //
    // It gets all valid events as it's arguments.
    //
    // Example:
    // (start code)
    // var events = util.getEventEmitter('change', 'error');
    // events.on('error', function(what) { alert('something happens: ' + what); });
    // events.emit('error', 'fired!');
    // (end code)
    //
    getEventEmitter: function() {
      var eventNames = util.toArray(arguments);

      function setupHandlers() {
        var handlers = {};
        eventNames.forEach(function(name) {
          handlers[name] = [];
        });
        return handlers;
      }

      function validEvent(eventName) {
        if(! this._handlers[eventName]) {
          throw new Error("Unknown event: " + eventName);
        }
      }

      return this.bindAll({

        _handlers: setupHandlers(),

        emit: function(eventName) {
          var handlerArgs = Array.prototype.slice.call(arguments, 1);
          // eventName validation happens in hasHandler
          if(this.hasHandler(eventName)) {
            this._handlers[eventName].forEach(function(handler) {
              if(handler) {
                try {
                  handler.apply(null, handlerArgs);
                } catch(exc) {
                  if(eventName !== 'error' && 'error' in this._handlers && this.hasHandler('error')) {
                    this.emit('error', exc);
                  } else {
                    console.error("Error in '" + eventName + "' event handler:", exc);
                  }
                }
              }
            }.bind(this));
          }
        },

        on: function(eventName, handler) {
          validEvent.call(this, eventName);
          if(typeof(handler) !== 'function') {
            throw "Expected function as handler, got: " + typeof(handler);
          }
          this._handlers[eventName].push(handler);
        },

        reset: function() {
          this._handlers = setupHandlers();
        },

        hasHandler: function(eventName) {
          validEvent.call(this, eventName);
          return this._handlers[eventName].length > 0;
        }

      });

    },

    // Method: getLogger
    //
    // Get a logger with a given name.
    // Usually this only happens once per file.
    //
    // Parameters:
    //   name - name of the logger. usually the name of the file this method
    //          is called from.
    //
    // Returns:
    //   A logger object
    //
    getLogger: function(name) {

      if(! loggers[name]) {
        knownLoggers.push(name);
        loggers[name] = {

          info: function() {
            this.log('info', util.toArray(arguments));
          },

          debug: function() {
            this.log('debug', util.toArray(arguments), 'debug');
          },

          error: function() {
            this.log('error', util.toArray(arguments), 'error');
          },

          log: function(level, args, type) {
            if(silentLogger[name] || logLevels[level] === false) {
              return;
            }
            if(logFn) {
              return logFn(name, level, args);
            }

            if(! type) {
              type = 'log';
            }

            args.unshift("[" + name.toUpperCase() + "] -- " + level + " ");

            (console[type] || console.log).apply(console, args);
          }
        };
      }

      return loggers[name];
    },

    // Method: setLogFunction
    //
    // Override the default logger with a custom function.
    // After this, remoteStorage.js will no longer log through the global console object,
    // but instead pass each logger call to the provided function.
    //
    // Log function parameters:
    //   name  - Name of the logger.
    //   level - loglevel, one of 'info', 'debug', 'error'
    //   args  - Array of arguments passed to the logger. can be anything.
    setLogFunction: function(logFunction) {
      logFn = logFunction;
    },

    // Method: silenceLogger
    // Silence all given loggers.
    //
    // So, if you're not interested in seeing all the synchronization logs, you could do:
    // > remoteStorage.util.silenceLogger('sync');
    //
    silenceLogger: function() {
      var names = util.toArray(arguments);
      var numNames = names.length;
      for(var i=0;i<numNames;i++) {
        silentLogger[ names[i] ] = true;
      }
    },

    // Method: silenceLogger
    // Unsilence all given loggers.
    // The opposite of <silenceLogger>
    unsilenceLogger: function() {
      var names = util.toArray(arguments);
      var numNames = names.length;
      for(var i=0;i<numNames;i++) {
        delete silentLogger[ names[i] ];
      }
    },

    // Method: silenceAllLoggers
    // silence all known loggers
    silenceAllLoggers: function() {
      this.silenceLogger.apply(this, knownLoggers);
    },

    // Method: unsilenceAllLoggers
    // opposite of <silenceAllLoggers>
    unsilenceAllLoggers: function() {
      this.unsilenceLogger.apply(this, knownLoggers);
    },

    // Method: setLogLevel
    // Set the maximum log level to use. Messages with
    // a lower log level won't be displayed.
    //
    // Log levels are:
    //   > debug < info < error
    //
    // Example:
    //   (start code)
    //   util.setLogLevel('info');
    //   var logger = util.getLogger('my-logger');
    //   logger.error("something went wrong"); // displayed
    //   logger.info("hey, how's it going?");  // displayed
    //   logger.debug("foo bar baz"); // not displayed
    //   (end code)
    setLogLevel: function(level) {
      if(level == 'debug') {
        logLevels.debug = true;
        logLevels.info = true;
      } else if(level == 'info') {
        logLevels.info = true;
        logLevels.debug = false;
      } else if(level == 'error') {
        logLevels.info = false;
        logLevels.debug = false;
      } else {
        throw "Unknown log level: " + level;
      }
    },

    // Method: grepLocalStorage
    // Find a list of keys that match a given pattern.
    //
    // Iterates over all localStorage keys and calls given 'iter'
    // for each key that matches given 'pattern'.
    //
    // The iter receives the matching key as it's only argument.
    grepLocalStorage: function(pattern, iter) {
      var numLocalStorage = localStorage.length;
      var keys = [];
      for(var i=0;i<numLocalStorage;i++) {
        var key = localStorage.key(i);
        if(pattern.test(key)) {
          keys.push(key);
        }
      }
      keys.forEach(iter);
    },

    // Function: getPromise
    // Create a new <Promise> object, and run given function.
    //
    // Returns: the created promise.
    //
    // The given callback function will be run in the future.
    // If the callback throws an exception, that will cause the
    // supplied callback to fail.
    // If the callback returns a promise, that promise will be
    // chained to the returned one.
    //
    // Example:
    //   (start code)
    //   function a() {
    //     return util.getPromise(function(promise) {
    //       // promise will be fulfilled in next tick
    //       promise.fulfill(a + b);
    //     });
    //   }
    //
    //   function b() {
    //     return util.getPromise(function(promise) {
    //       // promise will be fulfilled as soon as the returned promise is fulfilled
    //       return asyncFunctionReturningPromise();
    //     });
    //   }
    //
    //   function c() {
    //     return util.getPromise(function(promise) {
    //       // promise will fail with the thrown exception as it's result value
    //       throw new Error("Something went wrong!");
    //     });
    //   }
    //
    //   a().then(b).then(c).then(function() {
    //     // everything alright (never reached, "c" fails)
    //   }, function(error) {
    //     // one of the above failed.
    //   });
    //   (end code)
    //
    getPromise: function(builder) {
      var promise;

      if(typeof(builder) === 'function') {
        setTimeout(function() {
          try {
            builder(promise);
          } catch(e) {
            promise.reject(e);
          }
        }, 0);
      }

      var consumers = [], success, result;

      function notifyConsumer(consumer) {
        if(success) {
          var nextValue;
          if(consumer.fulfilled) {
            try {
              nextValue = [consumer.fulfilled.apply(null, result)];
            } catch(exc) {
              consumer.promise.reject(exc);
              return;
            }
          } else {
            nextValue = result;
          }
          if(nextValue[0] && typeof(nextValue[0].then) === 'function') {
            nextValue[0].then(consumer.promise.fulfill, consumer.promise.reject);
          } else {
            consumer.promise.fulfill.apply(null, nextValue);
          }
        } else {
          if(consumer.rejected) {
            var ret;
            try {
              ret = consumer.rejected.apply(null, result);
            } catch(exc) {
              consumer.promise.reject(exc);
              return;
            }
            if(ret && typeof(ret.then) === 'function') {
              ret.then(consumer.promise.fulfill, consumer.promise.reject);
            } else {
              consumer.promise.fulfill(ret);
            }
          } else {
            consumer.promise.reject.apply(null, result);
          }
        }
      }

      function resolve(succ, res) {
        if(result) {
          console.log("WARNING: Can't resolve promise, already resolved!");
          console.trace();
          return;
        }
        success = succ;
        result = Array.prototype.slice.call(res);
        setTimeout(function() {
          var cl = consumers.length;
          if(cl === 0 && (! success)) {
            var error = result[0] instanceof Error ? (result[0].message + '\n' + result[0].stack) : result;
            console.error("Possibly uncaught error: ", error);
          }
          for(var i=0;i<cl;i++) {
            notifyConsumer(consumers[i]);
          }
          consumers = undefined;
        }, 0);
      }

      promise = {

        then: function(fulfilled, rejected) {
          var consumer = {
            fulfilled: typeof(fulfilled) === 'function' ? fulfilled : undefined,
            rejected: typeof(rejected) === 'function' ? rejected : undefined,
            promise: util.getPromise()
          };
          if(result) {
            setTimeout(function() {
              notifyConsumer(consumer)
            }, 0);
          } else {
            consumers.push(consumer);
          }
          return consumer.promise;
        },

        fulfill: function() {
          resolve(true, arguments);
          return this;
        },
        
        reject: function() {
          resolve(false, arguments);
          return this;
        }
        
      };

      return promise;
    },

    // Function: isPromise
    // Tests whether the given Object is a <Promise>.
    //
    // This method only checks for a "then" property, that is a function.
    // That way it can interact with other implementations of Promises/A
    // as well.
    isPromise: function(object) {
      return typeof(object) === 'object' && typeof(object.then) === 'function';
    },

    // Function: asyncGroup
    // Run a bunch of asynchronous functions in parallel
    //
    // Returns a <Promise>.
    //
    // All given parameters must be functions. All functions will be
    // run in the given order. The returned promise will be fulfilled,
    // when for all given functions one of the following is true,
    //
    // Either:
    //   The function returned no promise.
    //
    // Or:
    //   The function returned a promise and that promise has been
    //   fulfilled or failed.
    //
    // The promise fill be fulfilled with:
    //   results - An array of return or fulfill values of the given
    //             functions in the same order.
    //   errors  - Array of errors reported by promise-returning
    //             functions.
    //
    // Example:
    //   (start code)
    //   return util.asyncGroup(
    //     function() { // asynchronous function
    //       return util.getPromise(function(p) {
    //         asyncGetSomeNumber(function(number) { p.fulfill(number) });
    //       });
    //     },
    //     function() { // synchronous function
    //       return 50 - 8;
    //     }
    //   ).then(function(numbers, errors) {
    //     numbers[0]; // -> (whatever 'number' was in the async function)
    //     numbers[1]; // -> 42
    //   });
    //   (end code)
    // 
    asyncGroup: function() {
      var functions = util.toArray(arguments);
      var results = [];
      var todo = functions.length;
      var errors = [];
      return util.getPromise(function(promise) {
        //BEGIN-DEBUG
        clearTimeout(promise.debugTimer);
        //END-DEBUG
        if(functions.length === 0) {
          return promise.fulfill([], []);
        }
        function finishOne(result, index) {
          results[index] = result;
          todo--;
          if(todo === 0) {
            promise.fulfill(results, errors);
          }
        }
        function failOne(error) {
          console.error("asyncGroup part failed: ", (error && error.stack) || error);
          errors.push(error);
          finishOne();
        }
        functions.forEach(function(fun, index) {
          if(typeof(fun) !== 'function') {
            throw new Error("asyncGroup got non-function: " + fun);
          }
          var _result = fun();
          if(_result && _result.then && typeof(_result.then) === 'function') {
            _result.then(function(result) {
              finishOne(result, index);
            }, failOne);
          } else {
            finishOne(_result, index);
          }
        });
      });
    },

    // Function: asyncEach
    // Asynchronously iterate over array.
    //
    // Returns a <Promise>.
    //
    // Calls the given iterator function for each element in 'array',
    // passing in the element itself and the index within the array.
    //
    // The iterator function and returned promise are subject to the
    // same semantics as in <util.asyncGroup>.
    //
    asyncEach: function(array, iterator) {
      return util.getPromise(function(promise) {
        util.asyncGroup.apply(
          util, array.map(function(element, index) {
            return util.curry(iterator, element, index);
          })
        ).then(function(results, errors) {
          promise.fulfill(array, errors);
        });
      });
    },

    // Function: asyncMap
    //
    // Asynchronously map an array.
    //
    // Returns a <Promise>.
    //
    // Calls the given "mapper" for each element in the given "array",
    // through <util.asyncGroup>.
    //
    asyncMap: function(array, mapper) {
      return util.asyncGroup.apply(
        util, array.map(function(element) {
          return util.curry(mapper, element);
        })
      );
    },

    asyncSelect: function(array, testFunction) {
      var a = [];
      return util.asyncEach(array, function(element) {
        return testFunction(element).then(function(result) {
          if(result) {
            a.push(element);
          }
        });
      }).then(function() {
        return a;
      });
    },

    getSettingStore: function(prefix) {
      function makeKey(key) {
        return prefix + ':' + key;
      }
      return {
        get: function(key) {
          var data = localStorage.getItem(makeKey(key));
          try { data = JSON.parse(data); } catch(e) {}
          return data;
        },
        set: function(key, value) {
          if(typeof(value) !== 'string') {
            value = JSON.stringify(value);
          }
          return localStorage.setItem(makeKey(key), value);
        },
        remove: function(key) {
          return localStorage.removeItem(makeKey(key));
        },
        clear: function() {
          util.grepLocalStorage(new RegExp('^' + prefix), function(key) {
            localStorage.removeItem(key);
          });
        }
      }
    }
  };

  // Class: Logger
  //
  // Method: info
  // Log to loglevel "info".
  //
  // Method: debug
  // Log to loglevel "debug".
  // Will use the browser's debug logging facility, if available.
  //
  // Method: debug
  // Log to loglevel "error".
  // Will use the browser's error logging facility, if available.
  //

  // Class: EventEmitter
  //
  // Method: emit
  //
  // Fire an event
  //
  // Parameters:
  //   eventName - name of the event. Must have been passed to getEventEmitter.
  //   *rest     - arguments passed to the handler.
  //
  // Method: on
  //
  // Install an event handler
  //
  // Parameters:
  //   eventName - name of the event. Must have been passed to getEventEmitter.
  //   handler   - handler to call when an event is emitted.
  //

  return util;
});


/*global window */
/*global console */
/*global XMLHttpRequest */
/*global XDomainRequest */
/*global Blob */
/*global setTimeout */
/*global clearTimeout */
/*global DOMParser */
/*global Element */
/*global document */

if(typeof(global) !== 'undefined' && typeof(nodeRequire) === 'undefined') {
  // some node versions seem to have "global.require" set, while others make
  // "require" a module-local variable.
  var nodeRequire = global.require || require;
}

define('lib/platform',['./util'], function(util) {

  

  // Namespace: platform
  //
  // Platform specific implementations of common things to do.
  //
  // Method: ajax
  //
  // Set off an HTTP request.
  // Uses CORS, if available on the platform.
  //
  // Parameters:
  //   (given as an *Object*)
  //
  //   url     - URL to send the request to
  //   success - callback function to call when request succeeded
  //   error   - callback function to call when request failed
  //   method  - (optional) HTTP request method to use (default: GET)
  //   headers - (optional) object containing request headers to set
  //   timeout - (optional) milliseconds until request is given up and error
  //             callback is called. If omitted, the request never times out.
  //
  // Example:
  //   (start code)
  //   platform.ajax({
  //     url: "http://en.wikipedia.org/wiki/AJAX",
  //     success: function(responseText, responseHeaders) {
  //       console.log("Here's the page: ", responseText);
  //     },
  //     error: function(errorMessage) {
  //       console.error("Something went wrong: ", errorMessage);
  //     },
  //     timeout: 3000
  //   });
  //   (end code)
  //
  // Platform support:
  //   web browser - YES (if browser <supports CORS at http://caniuse.com/#feat=cors>)
  //   IE - Partially, no support for setting headers.
  //   node - YES, CORS not an issue at all
  //
  //
  // Method: parseXml
  //
  // Parse given XML source.
  //
  // Platform support:
  //   browser - yes, if DOMParser is available
  //   node - yes, if xml2js is available
  //

  var logger = util.getLogger('platform');

  // downcase all header keys
  function normalizeHeaders(headers) {
    var h = {};
    for(var key in headers) {
      h[key.toLowerCase()] = headers[key];
    }
    return h;
  }

  function browserParseHeaders(rawHeaders) {
    if(! rawHeaders) {
      // firefox bug. workaround in ajaxBrowser.
      return null;
    }
    var headers = {};
    var lines = rawHeaders.split(/\r?\n/);
    var lastKey = null, md, key, value;
    var numLines = lines.length;
    for(var i=0;i<numLines;i++) {
      if(lines[i].length === 0) {
        // empty line. obviously.
        continue;
      } else if((md = lines[i].match(/^([^:]+):\s*(.+)$/))) {
        // The escaped colon in the following (previously added) comment is
        // necessary, to prevent NaturalDocs from generating a toplevel
        // document called "value line" to the documentation. True story.

        // key\: value line
        key = md[1], value = md[2];
        headers[key] = value;
        lastKey = key;
      } else if((md = lines[i].match(/^\s+(.+)$/))) {
        // continued line (if previous line exceeded 80 bytes
        key = lastKey, value= md[1];
        headers[key] = headers[key] + value;
      } else {
        // nothing we recognize.
        logger.error("Failed to parse header line: " + lines[i]);
      }
    }
    return normalizeHeaders(headers);
  }

  var successStates = { 200:true, 201:true, 204:true, 207:true };

  function isSuccessful(xhr) {
    return !! successStates[xhr.status];
  }

  function ajaxBrowser(params) {
    return util.getPromise(function(promise) {
      var timedOut = false;
      var timer;
      var xhr = new XMLHttpRequest();
      if(params.timeout) {
        timer = window.setTimeout(function() {
          timedOut = true;
          xhr.abort();
          promise.reject('timeout');
        }, params.timeout);
      }

      if(!params.method) {
        params.method = 'GET';
      }

      xhr.open(params.method, params.url, true);

      if(params.headers) {
        for(var header in params.headers) {
          xhr.setRequestHeader(header, params.headers[header]);
        }
      }

      xhr.onreadystatechange = function() {
        if((xhr.readyState == 4)) {
          if(timedOut) {
            return;
          }
          if(timer) {
            window.clearTimeout(timer);
          }
          if(isSuccessful(xhr)) {
            logger.debug("REQUEST SUCCESSFUL", params.url, xhr.responseText);
            var headers = browserParseHeaders(xhr.getAllResponseHeaders());
            if(! headers) {
              // Firefox' getAllResponseHeaders is broken for CORS requests since forever.
              // https://bugzilla.mozilla.org/show_bug.cgi?id=608735
              // Any additional headers that are needed by other code, should be added here.
              headers = {
                'content-type': xhr.getResponseHeader('Content-Type')
              };
            }
            promise.fulfill(xhr.responseText, headers);
          } else {
            logger.debug("REQUEST FAILED", xhr.status, params.url);
            promise.reject(xhr.status || 'network error');
          }
        }
      };

      xhr.send(params.data);
    });
  }

  function ajaxExplorer(params) {
    // this won't work, because we have no way of sending
    // the Authorization header. It might work for GET to
    // the 'public' category, though.
    var promise = util.getPromise();
    var xdr = new XDomainRequest();
    xdr.timeout = params.timeout || 3000;//is this milliseconds? documentation doesn't say
    xdr.open(params.method, params.url);
    xdr.onload = function() {
      if(xdr.status == 200 || xdr.status == 201 || xdr.status == 204) {
        promise.fulfill(xdr.responseText);
      } else {
        params.reject(xdr.status);
      }
    };
    xdr.onerror = function() {
      // See http://msdn.microsoft.com/en-us/library/ms536930%28v=vs.85%29.aspx
      promise.reject('network error');
    };
    xdr.ontimeout = function() {
      promise.reject('timeout');
    };
    if(params.data) {
      xdr.send(params.data);
    } else {
      xdr.send();
    }
  }

  function ajaxNode(params) {

    return util.getPromise(function(promise) {

      if(typeof(params.data) === 'object' && params.data instanceof ArrayBuffer) {
        throw new Error("Sending binary data not yet implemented for nodejs");
      }

      var http=nodeRequire('http'),
      https=nodeRequire('https'),
      url=nodeRequire('url');
      if(!params.method) {
        params.method='GET';
      }
      if(params.data) {
        params.headers['content-length'] = params.data.length;
      } else {
        params.data = null;
      }
      var urlObj = url.parse(params.url);
      var options = {
        method: params.method,
        host: urlObj.hostname,
        path: urlObj.path,
        port: (urlObj.port ? urlObj.port : (urlObj.protocol=='https:'?443:80)),
        headers: params.headers
      };
      var timer, timedOut;

      if(params.timeout) {
        timer = setTimeout(function() {
          promise.reject('timeout');
          timedOut=true;
        }, params.timeout);
      }

      var lib = (urlObj.protocol=='https:'?https:http);
      var request = lib.request(options, function(response) {
        var str='';
        response.setEncoding('utf8');
        response.on('data', function(chunk) {
          str+=chunk;
        });
        response.on('end', function() {
          if(timer) {
            clearTimeout(timer);
          }
          if(!timedOut) {
            if(response.statusCode==200 || response.statusCode==201 || response.statusCode==204) {
              promise.fulfill(str, normalizeHeaders(response.headers));
            } else {
              promise.reject(response.statusCode);
            }
          }
        });
      });
      request.on('error', function(e) {
        if(timer) {
          clearTimeout(timer);
        }
        promise.reject(e && e.message);
      });
      if(params.data) {
        request.end(params.data);
      } else {
        request.end();
      }
    });
  }

  function parseXmlBrowser(str, cb) {
    var tree=(new DOMParser()).parseFromString(str, 'text/xml');
    var nodes=tree.getElementsByTagName('Link');
    var obj={
      Link: []
    };
    for(var i=0; i<nodes.length; i++) {
      var link={};
      if(nodes[i].attributes) {
        for(var j=0; j<nodes[i].attributes.length;j++) {
          link[nodes[i].attributes[j].name]=nodes[i].attributes[j].value;
        }
      }
      var props = nodes[i].getElementsByTagName('Property');
      link.properties = {};
      for(var k=0; k<props.length;k++) {
        link.properties[
          props[k].getAttribute('type')
        ] = props[k].childNodes[0].nodeValue;
      }
      if(link.rel) {
        obj.Link.push({
          '@': link
        });
      }
    }
    cb(null, obj);
  }

  function parseXmlNode(str, cb) {
    var xml2js=nodeRequire('xml2js');
    new xml2js.Parser().parseString(str, cb);
  }

  var platform;

  if(typeof(window) === 'undefined') {
    platform = {
      ajax: ajaxNode,
      parseXml: parseXmlNode
    };
  } else {
    if(window.XDomainRequest) {
      platform = {
        ajax: ajaxExplorer,
        parseXml: parseXmlBrowser
      };
    } else {
      platform = {
        ajax: ajaxBrowser,
        parseXml: parseXmlBrowser
      };
    }
  }

  return platform;
});

define('lib/webfinger',
  ['./platform', './util'],
  function (platform, util) {

    

    // Namespace: webfinger
    //
    // Webfinger discovery.
    // Supports XRD, JRD and the <"resource" parameter at http://tools.ietf.org/html/draft-jones-appsawg-webfinger-06#section-5.2>
    //
    // remoteStorage.js tries the following things to discover a user's profile:
    //   * via HTTPS to /.well-known/host-meta.json
    //   * via HTTPS to /.well-known/host-meta
    //   * via HTTP to /.well-known/host-meta.json
    //   * via HTTP to /.well-known/host-meta
    //
    //   All those requests carry the "resource" query parameter.
    //
    // So in order for a discovery to work most quickly, a server should
    // respond to HTTPS requests like:
    //
    //   > /.well-known/host-meta.json?resource=acct%3Abob%40example.com
    // And return a JSON representation of the profile, such as this:
    //
    //   (start code)
    //
    //   {
    //     links:[{
    //       href: 'https://example.com/storage/bob',
    //       rel: "remoteStorage",
    //       type: "https://www.w3.org/community/rww/wiki/read-write-web-00#simple",
    //       properties: {
    //         'auth-method': "https://tools.ietf.org/html/draft-ietf-oauth-v2-26#section-4.2",
    //         'auth-endpoint': 'https://example.com/auth/bob'
    //       }
    //     }]
    //   }
    //
    //   (end code)
    //

    var logger = util.getLogger('webfinger');

    var timeout = 10000;

      ///////////////
     // Webfinger //
    ///////////////

    // PARSE

    // parse user address
    function extractHostname(userAddress) {
      var parts = userAddress.toLowerCase().split('@');
      var error;
      if(parts.length < 2) {
        error = 'no-at';
      } else if(parts.length > 2) {
        error = 'multiple-at';
      } else {
        if(!(/^[\.0-9a-z\-\_]+$/.test(parts[0]))) {
          error = 'non-dotalphanum';
        } else if(!(/^[\.0-9a-z\-]+$/.test(parts[1]))) {
          error = 'non-dotalphanum';
        }
      }
      if(error) {
        throw error;
      }
      return parts[1];
    }

    function parseXRD(str) {
      return util.getPromise(function(promise) {
        platform.parseXml(str, function(err, obj) {
          if(err) {
            promise.reject(err);
          } else {
            if(obj && obj.Link) {
              var links = {};
              if(obj.Link && obj.Link['@']) {//obj.Link is one element
                if(obj.Link['@'].rel) {
                  links[obj.Link['@'].rel]=obj.Link['@'];
                }
              } else {//obj.Link is an array
                for(var i=0; i<obj.Link.length; i++) {
                  if(obj.Link[i]['@'] && obj.Link[i]['@'].rel) {
                    links[obj.Link[i]['@'].rel]=obj.Link[i]['@'];
                  }
                }
              }
              promise.fulfill(links);
            } else {
              promise.reject('invalid-xml');
            }
          }
        });
      });
    }

    function parseJRD(data) {
      var object = JSON.parse(data);
      if(! object.links) {
        throw 'invalid-jrd';
      }
      var links = {};
      object.links.forEach(function(link) {
        // just take the first one of each rel:
        if(link.rel && (! links[link.rel])) {
          links[link.rel] = link;
        }
      });
      return links;
    }

    // request a single profile
    function fetchProfile(address) {
      logger.info('fetch profile', address);
      return platform.ajax({
        url: address,
        timeout: timeout
      }).then(function(body, headers) {
        var mimeType = headers && headers['content-type'] && headers['content-type'].split(';')[0];
        logger.debug('fetched', body, mimeType);
        if(mimeType && mimeType.match(/^application\/json/)) {
          return parseJRD(body);
        } else {
          return util.getPromise(function(jrdPromise) {
            parseXRD(body).then(
              function(xrd) {
                jrdPromise.fulfill(xrd);
              }, function(error) {
                jrdPromise.fulfill(parseJRD(body));
              });
          });
        }
      });
    }

    // fetch profile from all given addresses and yield the first one that
    // succeeds.
    function fetchHostMeta(protocol, addresses) {
      addresses = addresses.map(function(addr) {
        return protocol + addr;
      });
      return util.asyncMap(addresses, fetchProfile).
        then(function(profiles, errors) {
          logger.debug('host meta mapped', profiles);
          for(var i=0;i<profiles.length;i++) {
            if(profiles[i]) {
              return profiles[i];
            }
          }
          // if any of the requests failed due to a timeout, that's our
          // reason as well.
          for(var j=0;j<errors.length;j++) {
            if(errors[j] === 'timeout') {
              throw "timeout";
            }
          }
          // otherwise we just fail with a generic reason.
          throw 'requests-failed';
        });
    }

    function extractRemoteStorageLink(links) {
      logger.debug('extract remoteStorage link', links);
      var remoteStorageLink = links.remoteStorage || links.remotestorage;
      var lrddLink;
      if(remoteStorageLink) {
        logger.info('remoteStorageLink', remoteStorageLink);
        if(remoteStorageLink.href &&
           remoteStorageLink.type &&
           remoteStorageLink.properties &&
           remoteStorageLink.properties['auth-endpoint']) {
          return remoteStorageLink;
        } else {
          throw new Error("Invalid remoteStorage link. Required properties are:" +
                          "href, type, properties, properties.auth-endpoint. " +
                          JSON.stringify(remoteStorageLink));
        }
      } else if((lrddLink = links.lrdd) && links.lrdd.template) {
        return fetchProfile(
          lrddLink.template.replace('{uri}', 'acct:' + userAddress)
        ).then(extractRemoteStorageLink);
      } else {
        throw 'not-supported';
      }
    }

    // method: getStorageInfo
    // Get the storage information of a given user address.
    //
    // Parameters:
    //   userAddress - a string in the form user@host
    //
    // Callback parameters:
    //   err         - either an error message or null if discovery succeeded
    //   storageInfo - the format is equivalent to that of the JSON representation of the remotestorage link (see above)
    //
    // Returns:
    //   A promise for the user's webfinger profile
    //
    function getStorageInfo(userAddress) {

      /*

        - validate userAddres
        - fetch host-meta
        - parse host-meta
        - (optionally) fetch lrdd
        - (optionally) parse lrdd
        - extract links

       */

      return util.getPromise(function(promise) {
        try {
          var hostname = extractHostname(userAddress)
        } catch(error) {
          if(error) {
            return promise.reject(error);
          }
        }
        var query = '?resource=' + encodeURIComponent('acct:' + userAddress);
        var addresses = [
          '://' + hostname + '/.well-known/webfinger' + query,
          '://' + hostname + '/.well-known/host-meta.json' + query,
          '://' + hostname + '/.well-known/host-meta' + query,
        ];

        fetchHostMeta('https', addresses).
          then(extractRemoteStorageLink, function() {
            return fetchHostMeta('http', addresses).
              then(extractRemoteStorageLink);
          }).
          then(function(profile) {
            promise.fulfill(profile);
          }, promise.reject);
      });
    }

    return {
      getStorageInfo: getStorageInfo,

      setTimeout: function(t) {
        timeout = t;
      },

      getTimeout: function() {
        return timeout;
      }
    };
});

define('lib/getputdelete',
  ['./platform', './util'],
  function (platform, util) {

    

    var logger = util.getLogger('getputdelete');

    var defaultContentType = 'application/octet-stream';

    var timeout = 10000;

    function realDoCall(method, url, body, mimeType, token) {
      return util.getPromise(function(promise) {
        logger.info(method, url);
        var platformObj = {
          url: url,
          method: method,
          timeout: timeout,
          headers: {}
        };

        if(token) {
          platformObj.headers['Authorization'] = 'Bearer ' + token;
        }
        if(mimeType) {
          if(typeof(body) == 'object' && body instanceof ArrayBuffer) {
            mimeType += '; charset=binary';
          }
          platformObj.headers['Content-Type'] = mimeType;
        }

        platformObj.fields = {withCredentials: 'true'};
        if(method != 'GET') {
          platformObj.data = body;
        }

        platform.ajax(platformObj).
          then(function(data, headers) {
            var contentType = headers['content-type'] || defaultContentType;
            var mimeType = contentType.split(';')[0]

            if(contentType.match(/charset=binary/)) {
              data = util.rawToBuffer(data);
            } else if(mimeType === 'application/json') {
              try {
                data = JSON.parse(data);
              } catch(exc) {
                // ignore invalid JSON
              }
            }

            promise.fulfill(data, mimeType);            
          }, function(error) {
            if(error === 404) {
              return promise.fulfill(undefined);
            } else if(error === 401 || error === 403) {
              error = 'unauthorized';
            };
            promise.reject(error);
          });
      });
    }

    var inProgress = 0;
    var maxInProgress = 10;
    var pendingQueue = [];

    function doCall() {
      var args = util.toArray(arguments);
      function finishOne() {
        inProgress--;
        if(pendingQueue.length > 0) {
          var c = pendingQueue.shift();
          doCall.apply(this, c.a).then(c.p.fulfill, c.p.reject);
        } else {
        }
      }
      if(inProgress < maxInProgress) {
        inProgress++;
        return realDoCall.apply(this, arguments).then(function(data, mimeType) {
          finishOne();
          return util.getPromise(function(p) { p.fulfill(data, mimeType); });
        }, function(error) {
          finishOne();
          throw error;
        });
      } else {
        return util.getPromise(function(p) {
          pendingQueue.push({
            a: args,
            p: p
          });
        });
      }
    }

    function get(url, token) {
      return doCall('GET', url, null, null, token);
    }

    function put(url, value, mimeType, token) {
      if(! (typeof(value) === 'string' || (typeof(value) === 'object' &&
                                           value instanceof ArrayBuffer))) {
        throw new Error("invalid value given to PUT, only strings or ArrayBuffers allowed, got " + typeof(value));
      }
      return doCall('PUT', url, value, mimeType, token);
    }

    function set(url, valueStr, mimeType, token) {
      if(typeof(valueStr) == 'undefined') {
        return doCall('DELETE', url, null, null, token);
      } else {
        return put(url, valueStr, mimeType, token);
      }
    }

    // Namespace: getputdelete
    return {
      //
      // Method: get
      //
      // Send a GET request to a given path.
      //
      // Parameters:
      //   url      - url to send request to
      //   token    - bearer token used to authorize the request
      //   callback - callback called to signal success or failure
      //
      // Callback parameters:
      //   err      - error message(s). if no error occured, err is null.
      //   data     - raw response data
      //   mimeType - value of the response's Content-Type header. If none was returned, this defaults to application/octet-stream.
      get:    get,

      //
      // Method: set
      //
      // Send a PUT or DELETE request to given path.
      //
      // Parameters:
      //   url      - url to send request to
      //   data     - optional data to send. if data is undefined (not null!), a DELETE request is used.
      //   mimeType - MIME type to set for the data via the Content-Type header. Only relevant for PUT.
      //   token    - bearer token used to authorize the request
      //   callback - callback called to signal success or failure
      //
      // Callback parameters:
      //   err      - error message(s). if no error occured, err is null.
      //   data     - raw response data
      //   mimeType - value of the response's Content-Type header. If none was returned, this defaults to application/octet-stream.
      //
      set:    set,

      setTimeout: function(t) {
        timeout = t;
      },

      getTimeout: function() {
        return timeout;
      }

    };
});

/*global localStorage */
/*global ArrayBuffer */

define('lib/wireClient',['./getputdelete', './util'], function (getputdelete, util) {

  

  var prefix = 'remote_storage_wire_';

  var events = util.getEventEmitter('connected', 'disconnected', 'error', 'busy', 'unbusy');

  var state = 'anonymous';

  var settings = util.getSettingStore('remotestorage_wire');

  // BUSY handling to indicate busy state in the widget.
  //
  // This is happening here instead of in "sync" (where it was before),
  // because we only want to indicate busyness when pushing out data
  // (i.e. sending PUT or DELETE requests).
  //
  var busyCounter = 0;

  // Increment busy counter and emit "busy" event, if needed
  function setBusy() {
    if(busyCounter === 0) {
      events.emit('busy');
    }
    busyCounter++;
  }

  // Decrement busy counter and emit "unbusy" event, if the counter hits zero
  function releaseBusy() {
    busyCounter--;
    if(busyCounter === 0) {
      events.emit('unbusy');
    }
  }

  function setSetting(key, value) {
    settings.set(key, value);

    calcState();
  }

  function removeSetting(key) {
    settings.remove(key);
  }

  function getSetting(key) {
    return settings.get(key);
  }

  function disconnectRemote() {
    settings.clear();
    calcState();
  }

  function getState() {
    return state;
  }

  function calcState() {
    var oldState = state;

    if(getSetting('storageType') && getSetting('storageHref')) {
      if(getSetting('bearerToken')) {
        state = 'connected';
      } else {
        state = 'authing';
      }
    } else {
      state = 'anonymous';
    }

    if(oldState !== state) {
      if(state === 'connected') {
        events.emit('connected');
      } else if(state === 'anonymous' && oldState === 'connected') {
        events.emit('disconnected');
      }
    }
    return state;
  }

  function resolveKey(path) {
    var storageHref = getSetting('storageHref');
    return storageHref + path;
  }

  var foreignKeyRE = /^([^\/][^:]+):(\/.*)$/;

  function isForeign(path) {
    return foreignKeyRE.test(path);
  }

  // Namespace: wireClient
  //
  // The wireClient stores the user's storage information and controls getputdelete accordingly.
  //
  // Event: connected
  //
  // Fired once everything is configured.

  // Method: get
  //
  // Get data from given path from remote storage.
  //
  // Parameters:
  //   path     - absolute path (starting from storage root)
  //
  function get(path) {
    if(isForeign(path)) {
      return getForeign(path);
    } else if(state != 'connected') {
      throw new Error('not-connected');
    }
    return getputdelete.get(
      resolveKey(path),
      getSetting('bearerToken')
    );
  }

  function getForeign(fullPath) {
    var md = fullPath.match(foreignKeyRE);
    var userAddress = md[1];
    var path = md[2];
    var base = getStorageHrefForUser(userAddress);
    return getputdelete.get(base + path, null);
  }

  // Method: set
  //
  // Write data to given path in remote storage.
  //
  // Parameters:
  //   path     - absolute path (starting from storage root)
  //   valueStr - raw data to write
  //   mimeType - MIME type to set as Content-Type header
  //   callback - see <getputdelete.set> for details on the callback parameters.
  function set(path, valueStr, mimeType, cb) {
    if(isForeign(path)) {
      throw new Error("Foreign storage is read-only");
    } else if(state != 'connected') {
      throw new Error('not-connected');
    }
    var token = getSetting('bearerToken');
    if(typeof(path) != 'string') {
      throw new Error('argument "path" should be a string');
    } else {
      if(valueStr && typeof(valueStr) != 'string' &&
         !(typeof(valueStr) == 'object' && valueStr instanceof ArrayBuffer)) {
        valueStr = JSON.stringify(valueStr);
      }
      setBusy();
      return getputdelete.set(resolveKey(path), valueStr, mimeType, token).
        then(releaseBusy);
    }
  }

  // Method: remove
  //
  // Remove data at given path from remote storage.
  //
  // Parameters:
  //   path     - absolute path (starting from storage root)
  //   callback - see <getputdelete.set> for details on the callback parameters.
  function remove(path, cb) {
    if(isForeign(path)) {
      return cb(new Error("Foreign storage is read-only"));
    }
    var token = getSetting('bearerToken');
    setBusy();
    return getputdelete.set(resolveKey(path), undefined, undefined, token, cb).
      then(releaseBusy);
  }

  function getStorageHrefForUser(userAddress) {
    var info = getSetting('storageInfo:' + userAddress);
    if(! info) {
      throw new Error("userAddress unknown to wireClient: " + userAddress);
    }
    return info.href;
  }

  function addStorageInfo(userAddress, storageInfo) {
    setSetting('storageInfo:' + userAddress, storageInfo);
  }

  function hasStorageInfo(userAddress) {
    return !! getSetting('storageInfo:' + userAddress);
  }


  var typeAliasMap = {
    'draft-dejong-remotestorage-00': 'remotestorage-00',
    'https://www.w3.org/community/rww/wiki/read-write-web-00#simple': '2012.04'
  }

  return util.extend(events, {

    get: get,
    set: set,
    remove: remove,

    // Method: setStorageInfo
    //
    // Configure wireClient.
    //
    // Storage info object:
    //   type - the storage type (see specification)
    //   href - base URL of the storage server
    //
    // Fires:
    //   configured - if wireClient is now fully configured
    //
    setStorageInfo   : function(info) {
      info = util.extend({}, info);
      info.type = typeAliasMap[info.type] || info.type;
      setSetting('storageType', info.type);
      setSetting('storageHref', info.href);
      return info;
    },

    getStorageInfo: function() {
      return {
        type: getSetting('storageType'),
        href: getSetting('storageHref')
      };
    },

    // Method: getStorageHref
    //
    // Get base URL of the user's remote storage.
    getStorageHref   : function() {
      return getSetting('storageHref');
    },

    // Method: getStorageType
    //
    // Get API version of the user's remote storage, probably '2012.04' or 'remotestorage-00'.
    getStorageType   : function() {
      return getSetting('storageType');
    },

    // Method: SetBearerToken
    //
    // Set the bearer token for authorization.
    //
    // Parameters:
    //   bearerToken - token to use
    //
    // Fires:
    //   configured - if wireClient is now fully configured.
    //
    setBearerToken   : function(bearerToken) {
      setSetting('bearerToken', bearerToken);
    },

    getBearerToken   : function(bearerToken) {
      return getSetting('bearerToken');
    },

    // Method: addStorageInfo
    //
    // Add another user's storage info.
    // After calling this, keys in the form userAddress:path can be resolved.
    //
    // Parameters:
    //   userAddress - a user address in the form user@host
    //   storageInfo - an object, with at least an 'href' attribute
    addStorageInfo: addStorageInfo,

    // Method: hasStorageInfo
    //
    // Find out if the wireClient has cached storageInfo for the given userAddress.
    //
    // Parameters:
    //   userAddress - a user address to look up
    hasStorageInfo: hasStorageInfo,

    // Method: disconnectRemote
    //
    // Clear the wireClient configuration.
    disconnectRemote : disconnectRemote,

    // Method: on
    //
    // Install an event handler.
    //
    // 

    // Method: getState
    //
    // Get current state.
    //
    // Possible states are:
    //   anonymous - no information set
    //   authing   - storage's type & href set, but no token received yet
    //   connected - all information present.
    getState         : getState,
    calcState: calcState
  });
});

define('lib/store/syncTransaction',['../util'], function(util) {

  // Namespace: syncTranscation
  //
  // Shared transaction implementation for synchronous storage backends (memory, localStorage).
  // Takes a 'store' (methods: get, set, remove) and a logger.
  // Makes sure that only one transaction runs at the same time.

  // Method: syncTransaction
  // Returns a new syncTransactionAdapter.
  //
  // You can extend it with your own stuff (to create a proper storageAdapter you
  // at least need 'forgetAll' and 'on')
  //
  // Parameters:
  //   store  - actual store implementation (get, set, remove)
  //   logger - a logger, to log begin / end of transaction and implicit commits.
  return function(store, logger) {

    var errorStub = function() { throw new Error("Transaction already committed!"); };
    var staleStore = { get: errorStub, set: errorStub, remove: errorStub, commit: errorStub };

    var tid = 0;

    function makeTransaction(write, body) {
      var promise = util.getPromise();
      var transaction = util.extend({
        id: ++tid,
        commit: function() {
          finish();
        }
      }, store);

      if(! write) {
        delete transaction.set;
        delete transaction.remove;
      }

      function finish(implicit) {
        logger.debug(transaction.id, 'FINISH Transaction (', write ? 'read-write' : 'read-only', ')');
        busy = false;
        util.extend(transaction, staleStore);
        promise.fulfill();
        runIfReady();
      }

      return {
        run: function() {
          busy = true;
          logger.debug(transaction.id, 'BEGIN Transaction (', write ? 'read-write' : 'read-only', ')');
          var result = body(transaction);
          if(! write) {
            logger.debug(transaction.id, 'schedule implicit commit (read-only transaction)');
            finish(true);
          }
        },
        promise: promise
      };
    }

    var busy = false;
    var transactions = [];

    function runIfReady() {
      if(! busy) {
        var transaction = transactions.shift();
        if(transaction) {
          logger.debug('SHIFT TRANSACTION', transactions.length, 'left');
          transaction.run();
        }
      }
    }

    return {

      // Object: syncTransactionAdapter

      // Method: transaction
      //
      // Parameters:
      //   write - boolean. whether this is a write or read-only transaction.
      //   body  - method to call with the actual transaction object
      transaction: function(write, body) {
        var transaction = makeTransaction(write, body);
        transactions.push(transaction);
        util.nextTick(runIfReady);
        return transaction.promise;
      },

      // Method: get
      // Forwarded from store (to simplify transaction-less 'get's in tests).
      get: store.get
    };
  };
});

define('lib/store/memory',['../util', './syncTransaction'], function(util, syncTransactionAdapter) {

  // Namespace: store.memory
  // <StorageAdapter> implementation that keeps data in memory.

  return function(logName) {
    var logger = util.getLogger(logName || 'store::memory');
    var nodes = {};

    var store = {
      get: function(path) {
        logger.info('get', path);
        return util.getPromise().fulfill(nodes[path]);
      },

      set: function(path, node) {
        logger.info('set', path, node.data);
        nodes[path] = node;
        return util.getPromise().fulfill();
      },

      remove: function(path) {
        logger.info('remove', path);
        delete nodes[path];
        return util.getPromise().fulfill();
      }
    };

    return util.extend({

      _nodes: nodes,

      on: function() {},

      forgetAll: function() {
        logger.info('forgetAll');
        this._nodes = nodes = {};
        return util.getPromise().fulfill();
      },

      hasKey: function(path) {
        return !! nodes[path];
      },

      // wireClient STUB

      getState: function() {
        return 'connected';
      },

      // TESTS & DEBUGGING

      printTree: function() {
        var printOne = util.bind(function(path, indent) {
          return this.get(path).
            then(function(node) {
              if(! node) {
                throw "No node for path: " + path;
              }
              if(util.isDir(path)) {
                console.log(indent + '+ ' + util.baseName(path));
                return util.asyncEach(Object.keys(node.data), function(key) {
                  return printOne(path + key, indent + '| ');
                });
              } else {
                console.log(indent + util.baseName(path) + ' ' +
                            node.data.length + ' bytes, ' +
                            node.mimeType);
              }
            });
        }, this);

        return printOne('/', '');
      },

      // FIXME: implement through 'set' and move to common.
      init: function(dataTree, mimeType, timestamp) {
        this.forgetAll();
        var initNode = util.bind(function(path, tree) {
          var node = {
            timestamp: timestamp,
            lastUpdatedAt: timestamp
          };
          if(typeof(tree) == 'object') {
            node.mimeType = 'application/json';
            node.data = Object.keys(tree).reduce(function(listing, _key) {
              var key = _key;
              if(typeof(tree[_key]) === 'object') {
                key += '/';
              }
              initNode(path + key, tree[_key]);
              listing[key] = timestamp;
              return listing;
            }, {});
            node.diff = {};
          } else {
            node.mimeType = mimeType;
            node.data = tree;
          }
          nodes[path] = node;
        }, this);

        initNode('/', dataTree);
      }

    }, store, syncTransactionAdapter(store, logger));
  };
});

define('lib/store/common',['../util'], function(util) {

  return {
    packData: function(node) {
      node = util.extend({}, node);
      if(typeof(node.data) === 'object' && node.data instanceof ArrayBuffer) {
        node.binary = true;
        node.data = util.encodeBinary(node.data);
      } else {
        node.binary = false;
        if(node.mimeType === 'application/json' && typeof(node.data) === 'object') {
          node.data = JSON.stringify(node.data);
        } else {
          node.data = node.data;
        }
      }
      return node;
    },

    unpackData: function(node) {
      node = util.extend({}, node);
      if(node.binary) {
        node.data = util.decodeBinary(node.data);
      }
      if(node.mimeType === 'application/json' && node.data) {
        if(node.data instanceof ArrayBuffer) {
          // convert accidental binary data back into a string
          node.binary = false;
          node.data = util.bufferToRaw(node.data);
        } else if(typeof(node.data) === 'object') {
          return node;
        }
        try {
          node.data = JSON.parse(node.data);
        } catch(exc) {
          console.error("Failed to parse node: ", node);
          throw new Error("Failed to parse JSON data: " + node.data + " (Error was: " + exc.message + ')');
        };
      }
      return node;
    }
  };

});
define('lib/store/localStorage',['../util', './common', './syncTransaction'], function(util, common, syncTransactionAdapter) {

  // Namespace: store.localStorage
  // <StorageAdapter> implementation that keeps data localStorage.

  var localStorage;

  var logger = util.getLogger('store::localStorage');

  var events = util.getEventEmitter('change');

  // node metadata key prefix
  var prefixNodes = 'remote_storage_nodes:';
  // note payload data key prefix
  var prefixNodesData = 'remote_storage_node_data:';

  function isMetadataKey(key) {
    return key.substring(0, prefixNodes.length) == prefixNodes;
  }

  function prefixNode(path) {
    return prefixNodes + path;
  }

  function prefixData(path) {
    return prefixNodesData + path;
  }

  // forward events from other tabs
  if(typeof(window) !== 'undefined') {
    window.addEventListener('storage', function(event) {
      if(isMetadataKey(event.key)) {
        event.path = event.key.replace(new RegExp('^' + prefixNodes), '');
        events.emit('change', event);
      }
    });
  }

  return function(_localStorage) {
    localStorage = _localStorage || (typeof(window) !== 'undefined' && window.localStorage);

    if(! localStorage) {
      throw new Error("Not supported: localStorage not found.");
    }

    var store = {
      get: function(path) {
        logger.debug('GET', path);
        return util.getPromise(function(promise) {
          var rawMetadata = localStorage.getItem(prefixNode(path));
          if(! rawMetadata) {
            promise.fulfill(undefined);
            return;
          }
          var payload = localStorage.getItem(prefixData(path));
          var node;
          if(rawMetadata !== 'null') {
            try {
              node = JSON.parse(rawMetadata);
            } catch(exc) {
            }
          }
          if(node) {
            if(util.isDir(path) && payload === 'null') {
              node.data = {};
            } else {
              node.data = payload;
            }
          }
          promise.fulfill(common.unpackData(node));
        });
      },

      set: function(path, node) {
        logger.debug('SET', path, node);
        return util.getPromise(function(promise) {
          var metadata = common.packData(node);
          var rawData = metadata.data;
          delete metadata.data;
          var rawMetadata = JSON.stringify(metadata);
          localStorage.setItem(prefixNode(path), rawMetadata);
          if(rawData) {
            localStorage.setItem(prefixData(path), rawData);
          }
          promise.fulfill();
        });
      },

      remove: function(path) {
        logger.debug('SET', path);
        return util.getPromise(function(promise) {
          localStorage.removeItem(prefixNode(path));
          localStorage.removeItem(prefixData(path));
          promise.fulfill();
        });
      }
    };

    return util.extend({

      on: events.on,

      forgetAll: function() {
        return util.getPromise(function(promise) {
          var numLocalStorage = localStorage.length;
          var keys = [];
          for(var i=0; i<numLocalStorage; i++) {
            if(localStorage.key(i).substr(0, prefixNodes.length) == prefixNodes ||
               localStorage.key(i).substr(0, prefixNodesData.length) == prefixNodesData) {
              keys.push(localStorage.key(i));
            }
          }

          keys.forEach(function(key) {
            localStorage.removeItem(key);
          });

          promise.fulfill();
        });
      }
    }, syncTransactionAdapter(store, logger));
  };
});


define('lib/store/pending',['../util'], function(util) {

  var logger = util.getLogger('store::pending');

  return function() {
    var requestQueue = [];

    function queueRequest(name, args, dontPromise) {
      logger.debug(name, args[0]);
      if(! dontPromise) {
        return util.getPromise(function(promise) {
          requestQueue.push({
            method: name,
            args: args,
            promise: promise
          });
        });
      } else {
        requestQueue.push({
          method: name,
          args: args
        });
      }
    }

    var pendingAdapter = {
      transaction: function(write, body) {
        return queueRequest('transaction', [write, body]);
      },
      on: function(eventName, handler) {
        return queueRequest('on', [eventName, handler], true);
      },
      get: function(key) {
        return queueRequest('get', [key]);
      },
      put: function(key, value) {
        return queueRequest('put', [key, value]);
      },
      remove: function(key) {
        return queueRequest('remove', [key]);
      },
      forgetAll: function(key) {
        return queueRequest('forgetAll', []);
      },
      flush: function(adapter) {
        requestQueue.forEach(function(request) {
          logger.debug('QUEUE FLUSH', request.method, request.args[0]);
          if(request.promise) {
            adapter[request.method].apply(adapter, request.args).
              then(request.promise.fulfill,
                   request.promise.reject);
          } else {
            adapter[request.method].apply(adapter, request.args);
          }
        });
        requestQueue = [];
      },
      replaceWith: function(adapter) {
        pendingAdapter.flush(adapter);
        util.extend(pendingAdapter, adapter);
        delete pendingAdapter.flush;
        delete pendingAdapter.replaceWith;
      }
    };

    return pendingAdapter;
  };

});

/*global window */
/*global console */

define('lib/store',[
  './util',
  './platform',
  './store/memory',
  './store/localStorage',
  './store/pending'
], function (util, platform, memoryAdapter, localStorageAdapter, pendingAdapter) {

  

  // Namespace: store
  //
  // The store stores data locally. It treats all data as raw nodes, that have *metadata* and *payload*.
  // Where the actual data is stored is determined by the <StorageAdapter> that is being used.


  var logger = util.getLogger('store');

  // foreign nodes are prefixed with a user address
  var userAddressRE = /^[^@]+@[^:]+:\//;

  var events = util.getEventEmitter('error', 'change', 'foreign-change');

  var dataStore;

  // Method: setAdapter
  // Set the storage adapter. See <StorageAdapter> for a description of
  // the required interface.
  function setAdapter(adapter) {
    dataStore = adapter;
    // forward changes from data store (e.g. made in other tabs)
    dataStore.on('change', function(event) {
      if(! util.isDir(event.path)) {
        fireChange('device', event.path, event.oldValue);
      }
    });
  }

  // (function() {
  //   if(typeof(window) !== 'undefined') {
  //     var idb = indexedDbAdapter.detect();
  //     if(idb) {
  //       setAdapter(indexedDbAdapter(idb));
  //     } else if(typeof(window.openDatabase) !== 'undefined') {
  //       setAdapter(webSqlAdapter());
  //     } else if(typeof(window.localStorage) !== 'undefined') {
  //       setAdapter(localStorageAdapter(window.localStorage));
  //     } else {
  //       throw "Running in browser, but no storage adapter supported!";
  //     }
  //   } else {
  //     console.error("WARNING: falling back to in-memory storage");
  //     setAdapter(memoryAdapter());
  //   }
  // })();

  if(typeof(window) !== 'undefined') {
    setAdapter(localStorageAdapter(window.localStorage));
  } else {
    console.error("WARNING: falling back to in-memory storage");
    setAdapter(memoryAdapter());
  }

  //
  // Type: Node
  //
  // Represents a node within the local store.
  //
  // Properties:
  //   timestamp      - last time this node was (apparently) updated (default: 0)
  //   lastUpdatedAt  - Last time this node was upated from remote storage
  //   mimeType       - MIME media type
  //   diff           - (directories only) marks children that have been modified.
  //   data           - Actual data of the node. A String, a JSON-Object or an ArrayBuffer.
  //   binary         - boolean indicating if this node is binary. If true, 'data' is an ArrayBuffer.
  //

  // Event: change
  // See <BaseClient.Events>

  function fireChange(origin, path, oldValue) {
    return getNode(path).
      then(function(node) {
        events.emit('change', {
          path: path,
          origin: origin,
          oldValue: oldValue,
          newValue: node.data,
          timestamp: node.timestamp
        });
      });
  }

  // Event: foreign-change
  // Fired when a foreign node is updated.

  function fireForeignChange(path, oldValue) {
    return getNode(path).
      then(function(node) {
        events.emit('foreign-change', {
          path: path,
          oldValue: oldValue,
          newValue: node.data,
          timestamp: node.timestamp
        });
      });
  }

  //
  // Event: error
  // See <BaseClient.Events>

  //
  // Method: on
  //
  // Install an event handler
  // See <util.EventEmitter.on> for documentation.

  // Method: getNode
  // Get a node.
  //
  // Parameters:
  //   path - absolute path
  //
  // Returns:
  //   a node object. If no node is found at the given path, a new empty
  //   node object is constructed instead.
  function getNode(path) {
    logger.info('getNode', path);
    if(! path) {
      // FIXME: fail returned promise instead.
      throw new Error("No path given!");
    }
    validPath(path);
    return dataStore.get(path).then(function(node) {
      if(! node) {
        node = {//this is what an empty node looks like
          timestamp: 0,
          lastUpdatedAt: 0,
          mimeType: "application/json"
        };
        if(util.isDir(path)) {
          node.diff = {};
          node.data = {};
        }
      }

      return node;
    });
  }


  // Method: forgetAll
  // Forget all data stored by <store>.
  //
  function forgetAll() {
    return dataStore.forgetAll();
  }

  // Function: setNodeData
  //
  // update a node's payload
  //
  // Parameters:
  //   path      - absolute path from the storage root
  //   data      - node data to set, or undefined to delete the node
  //   outgoing  - boolean, whether this update is to be propagated
  //   timestamp - timestamp to set for the update
  //   mimeType  - MIME media type of the node's data
  //
  // Fires:
  //   change w/ origin=remote - unless this is an outgoing change
  //
  function setNodeData(path, data, outgoing, timestamp, mimeType) {
    return dataStore.transaction(true, function(transaction) {
      return getNode(path, transaction).then(function(node) {

        var oldValue = node.data;

        node.data = data;

        if(! outgoing) {
          if(typeof(timestamp) !== 'number') {
            throw "Attempted to set non-number timestamp in incoming change: " + timestamp + ' (' + typeof(timestamp) + ') at path ' + path;
          }
          node.lastUpdatedAt = timestamp;

          delete node.error;
        }

        if(! mimeType) {
          mimeType = 'application/json';
        }
        node.mimeType = mimeType;

        return updateNode(path, (typeof(node.data) !== 'undefined' ? node : undefined), outgoing, false, timestamp, oldValue, transaction).
          then(function() {
            transaction.commit();
          });
      });      
    });
  }

  function setLastSynced(path, timestamp) {
    logger.info('setLastSynced', path, 'requested');
    return dataStore.transaction(true, function(transaction) {
      logger.info('setLastSynced', path, 'started');
      return getNode(path, transaction).then(function(node) {
        node.lastUpdatedAt = timestamp;
        return updateNode(path, node, false, true, undefined, undefined, transaction).
          then(function() {
            logger.info('setLastSynced', path, 'done', timestamp);
            transaction.commit();
          });
      });
    });
  }

  function removeNode(path, timestamp) {
    return setNodeData(path, undefined, false, timestamp || getCurrTimestamp());
  }

  function updateMetadata(path, attributes, node) {
    function doUpdate(node) {
      util.extend(node, attributes);
      return updateNode(path, node, false, true);
    }
    if(node) {
      return doUpdate(node);
    } else {
      return getNode(path).then(doUpdate);
    }
  }

  function setNodeError(path, error) {
    return updateMetadata(path, {
      error: error
    });
  }

  // Method: clearDiff
  //
  // Clear diff flag of given node on it's parent.
  //
  // Recurses upwards, when the parent's diff becomes empty.
  //
  // Clearing the diff is usually done, once the changes have been
  // propagated through sync.
  //
  // Parameters:
  //   path      - absolute path to the node
  //   timestamp - new timestamp (received from remote) to set on the node.
  //
  function clearDiff(path, timestamp) {
    return getNode(path).then(function(node) {

      function clearDiffOnParent() {
        var parentPath = util.containingDir(path);
        if(parentPath) {
          var baseName = util.baseName(path);
          return getNode(parentPath).then(function(parent) {
            delete parent.diff[baseName];
            if(Object.keys(parent.diff).length === 0) {
              parent.lastUpdatedAt = parent.timestamp;
            }
            return updateNode(parentPath, parent, false, true).then(function() {
              if(Object.keys(parent.diff).length === 0) {
                return clearDiff(parentPath, timestamp);
              }
            });
          });
        }
      }

      if(util.isDir(path) && Object.keys(node.data).length === 0) {
        // remove empty dir
        return updateNode(path, undefined, false, false).then(clearDiffOnParent);
      } else if(timestamp) {
        // set last updated
        node.timestamp = node.lastUpdatedAt = timestamp;
        return updateNode(path, node, false, true).then(clearDiffOnParent);
      } else {
        return clearDiffOnParent();
      }
    });
  }

  // Method: fireInitialEvents
  //
  // Fire a change event with origin=device for each node present in store.
  //
  // This is so apps don't need to add event handlers *and* initially request
  // listings to fill their views.
  //
  function fireInitialEvents() {
    logger.info('fire initial events');

    function iter(path) {
      if(util.isDir(path)) {
        return getNode(path).then(function(node) {
          if(node.data) {
            var keys = Object.keys(node.data);
            var next = function() {
              if(keys.length > 0) {
                return iter(path + keys.shift()).then(next);
              }
            };
            return next();
          }
        });
      } else {
        return fireChange('remote', path);
      }
    }

    return iter('/');
  }

  function getFileName(path) {
    var parts = path.split('/');
    if(util.isDir(path)) {
      return parts[parts.length-2]+'/';
    } else {
      return parts[parts.length-1];
    }
  }

  function getCurrTimestamp() {
    return new Date().getTime();
  }

  function validPath(path) {
    if(! (path[0] == '/' || userAddressRE.test(path))) {
      throw new Error("Invalid path: " + path);
    }
  }

  function isForeign(path) {
    return path[0] != '/';
  }

  function determineDirTimestamp(path, transaction) {
    return getNode(path, transaction).
      then(function(node) {
        var t = 0;
        if(node.data) {
          for(var key in node.data) {
            if(node.data[key] > t) {
              t = node.data[key];
            }
          }
        }
        return t > 0 ? t : getCurrTimestamp();
      });
  }

  function touchNode(path) {
    return dataStore.transaction(true, function(transaction) {
      return getNode(path, transaction).then(function(node) {
        return updateNode(
          path, node, false, true, undefined, undefined, transaction
        ).then(transaction.commit);
      });
    });
  }

  // FIXME: this argument list is getting too long!!!
  function updateNode(path, node, outgoing, meta, timestamp, oldValue,
                      transaction) {
    logger.debug('updateNode', path, node, outgoing, meta, timestamp);

    validPath(path);

    function adjustTimestamp(transaction) {
      return util.getPromise(function(promise) {
        function setTimestamp(t) {
          if(t) { timestamp = t; }
          if(node && typeof(timestamp) == 'number') {
            node.timestamp = timestamp;
          }
          promise.fulfill();
        }
        if((!meta) && (! timestamp)) {
          if(outgoing) {
            timestamp = getCurrTimestamp();
            setTimestamp();
          } else if(util.isDir(path)) {
            determineDirTimestamp(path, transaction).then(setTimestamp);
          } else {
            throw new Error('no timestamp given for node ' + path);
          }
        } else {
          setTimestamp();
        }
      });
    }

    function storeNode(transaction) {
      if(node) {
        return transaction.set(path, node);
      } else {
        return transaction.remove(path);
      }
    }

    function updateParent(transaction) {
      var parentPath = util.containingDir(path);
      var baseName = util.baseName(path);
      if(parentPath) {
        return getNode(parentPath, transaction).
          then(function(parent) {
            if(meta) { // META
              if(! parent.data[baseName]) {
                parent.data[baseName] = 0;
                return updateNode(parentPath, parent, false, true, timestamp, undefined, transaction);
              }
            } else if(outgoing) { // OUTGOING
              if(node) {
                parent.data[baseName] = timestamp;
              } else {
                delete parent.data[baseName];
              }
              parent.diff[baseName] = timestamp;
              return updateNode(parentPath, parent, true, false, timestamp, undefined, transaction);
            } else { // INCOMING
              if(node) { // add or change
                if((! parent.data[baseName]) || parent.data[baseName] < timestamp) {
                  parent.data[baseName] = timestamp;
                  delete parent.diff[baseName];
                  return updateNode(parentPath, parent, false, false, timestamp, undefined, transaction);
                }
              } else { // deletion
                delete parent.data[baseName];
                delete parent.diff[baseName];
                return updateNode(parentPath, parent, false, false, timestamp, undefined, transaction);
              }
            }
          });
      }
    }

    function fireEvents() {
      if((!meta) && (! outgoing) && (! util.isDir(path))) {
        // fire changes
        if(isForeign(path)) {
          return fireForeignChange(path, oldValue);
        } else {
          return fireChange('remote', path, oldValue);
        }
      }
    }

    function doUpdate(transaction, dontCommit) {
      return adjustTimestamp(transaction).
        then(util.curry(storeNode, transaction)).
        then(util.curry(updateParent, transaction)).
        then(function() {
          if(! dontCommit) {
            transaction.commit();
          }
        }).
        then(fireEvents);
    }

    if(transaction) {
      return doUpdate(transaction, true);
    } else {
      return dataStore.transaction(true, doUpdate);
    }
  }

  return {

    memory: memoryAdapter,
    localStorage: localStorageAdapter,
    pending: pendingAdapter,

    events: events,

    // method         , local              , used by

    getNode           : getNode,          // sync
    setNodeData       : setNodeData,      // sync
    clearDiff         : clearDiff,        // sync
    removeNode        : removeNode,       // sync
    setLastSynced     : setLastSynced,    // sync
    touchNode         : touchNode,        // sync

    on                : events.on,
    emit              : events.emit,
    setNodeError      : setNodeError,

    forgetAll         : forgetAll,        // widget
    fireInitialEvents : fireInitialEvents,// widget

    setAdapter        : setAdapter,
    getAdapter        : function() { return dataStore; }
  };

  // Interface: StorageAdapter
  //
  // Backend for the <store>.
  //
  // Currently supported:
  // * memory
  // * localStorage
  // * indexedDB
  //
  // Planned:
  // * WebSQL
  //
  // Method: get(path)
  // Get node from given path
  // Returns a promise.
  //
  // Method: set(path, node)
  // Create / update node at given path. See <store.Node> for a reference on how nodes look.
  // Returns a promise.
  //
  // Method: remove(path)
  // Remove node from given path
  // Returns a promise.
  //
  // Method: forgetAll()
  // Remove all data.
  // Returns a promise.
  //
  // Method: on(eventName)
  // Install an event handler.
  //
  // Event: change
  // Fired when the store changes from another source (such as another tab / window).
  //

});

define('lib/store/remoteCache',[
  '../util', '../wireClient', './memory'
], function(util, wireClient, memoryAdapter) {

  var logger = util.getLogger('store::remote_cache');

  var remoteClient = wireClient;

  return function() {
    var cache = memoryAdapter('store::remote_cache_backend');

    function determineTimestamp(path) {
      return util.getPromise(function(promise) {
        var parentPath = util.containingDir(path);
        if(parentPath && cache.hasKey(parentPath)) {
          var baseName = util.baseName(path)
          cache.get(parentPath).
            then(function(parentNode) {
              promise.fulfill(parentNode.data[baseName] || 0);
            }, function(error) {
              if(typeof(error) === 'undefined') {
                promise.fulfill(new Date().getTime());
              } else {
                promise.reject(error);
              }
            });
        } else {
          promise.fulfill(new Date().getTime());
        }
      });
    }

    return {
      get: function(path) {
        if(cache.hasKey(path)) {
          logger.debug('GET HIT', path);
          return cache.get(path);
        } else {
          logger.debug('GET MISS', path);
          var node = {};
          return wireClient.get(path).
            // build node
            then(function(data, mimeType) {
              node.data = data;
              node.mimeType = mimeType;
              node.binary = data instanceof ArrayBuffer;
              if(typeof(data) === 'undefined') {
                node.deleted = true;
                return undefined;
              } else {
                node.deleted = false;
                return determineTimestamp(path);
              }
            }).then(function(timestamp) {
              node.timestamp = timestamp;
              return cache.set(path, node);
            }).then(function() {
              return node;
            });
        }
      },

      set: function(path, node) {
        logger.debug('SET', path);
        return cache.set(path, node).
          then(util.curry(wireClient.set, path, node.data, node.mimeType));
      },

      remove: function(path) {
        logger.debug('REMOVE', path);
        return cache.remove(path).
          then(util.curry(wireClient.remove, path));
      },

      getState: function() {
        return wireClient.getState();
      },

      expireKey: function(path) {
        logger.debug('EXPIRE', path);
        return cache.remove(path);
      },

      clearCache: function() {
        return cache.forgetAll();
      }
    };
  };
});

/*global localStorage */

define('lib/sync',[
  './util', './store', './store/remoteCache', './wireClient'
], function(util, store, remoteCacheAdapter, wireClient) {

  

  var remoteAdapter = remoteCacheAdapter();

  var events = util.getEventEmitter('error', 'conflict', 'state', 'busy', 'ready', 'timeout');
  var logger = util.getLogger('sync');

  var curry = util.curry;

  /*******************/
  /* Namespace: sync */
  /*******************/

  // Settings. Trivial.

  var settings = util.getSettingStore('remotestorage_sync');

  // hack! set from remoteStorage via setAccess, setCaching.
  var access, caching;

  function needsSync(path) {
    if(! path) {
      path = '/';
    }
    if(! util.isDir(path)) {
      return util.getPromise().fulfill(false);
    }
    return store.getNode(path).then(function(root) {
      if(Object.keys(root.diff).length > 0) {
        return true;
      }
      var keys = Object.keys(root.data);
      function next() {
        var key = keys.shift();
        if(! key) {
          return false;
        }
        return needsSync(path + key).then(function(value) {
          if(value) {
            return true;
          } else {
            return next();
          }
        });
      }
      return next();
    });
  }

  var disabled = false;

  function disable() {
    disabled = true;
    events.emit('ready');
  }

  function enable() {
    enabled = true;
  }

  /**************************************/

  // Section: High-level sync functions
  //
  // These are the functions that are usually called from outside this
  // file to initiate some synchronization task.
  //
  //

  // Function: fullSync
  //
  // Perform a full sync cycle.
  //
  // Will update local and remote data as needed.
  //
  // Calls it's callback once the cycle is complete.
  //
  // Fires:
  //   ready    - when the sync queue is empty afterwards
  //   conflict - when there are two incompatible versions of the same node
  //   change   - when the local store is updated
  //
  function fullSync(pushOnly) {
    return util.getPromise(function(promise) {
      if(disabled) {
        promise.fulfill();
        return;
      }
      if(! isConnected()) {
        return promise.fulfill();
      }

      logger.info("full " + (pushOnly ? "push" : "sync") + " started");

      var roots = [];

      var cl = caching.rootPaths.length;
      var al = access.rootPaths.length;
      for(var i=0;i<cl;i++) {
        var cachingRoot = caching.rootPaths[i];
        for(var j=0;i<al;j++) {
          var accessRoot = access.rootPaths[j];
          if(util.pathContains(cachingRoot, accessRoot)) {
            roots.push(cachingRoot);
            break;
          }
        }
      }

      var synced = 0;

      function rootCb(path) {
        return function() {
          synced++;
          if(synced == roots.length) {
            sync.lastSyncAt = new Date();
            promise.fulfill();
          }
        };
      }

      if(roots.length === 0) {
        events.emit('ready');
        return promise.fulfill();
      }

      roots.forEach(function(root) {
        enqueueTask(function() {
          return traverseTree(root, processNode, {
            pushOnly: pushOnly
          });
        }, rootCb(root));
      });
    });
  }

  // Function: fullPush
  //
  // Perform a full sync cycle, but only update remote data.
  //
  // Used before disconnecting, to clear local diffs.
  //
  // Fires:
  //   ready    - when the sync queue is empty afterwards
  //   conflict - when there are two incompatible versions of the same node
  //   change   - when the local store is updated
  //
  function fullPush(callback) {
    return fullSync(callback, true);
  }

  // Function: partialSync
  //
  // Sync a partial tree, starting at given path.
  //
  // Parameters:
  //   startPath - path to start at. Must be a directory path.
  //   depth     - maximum depth of directories to traverse. null for infinite depth.
  //   callback  - callback to call when done. receives no parameters.
  //
  // Fires:
  //   ready    - when the sync queue is empty afterwards
  //   conflict - when there are two incompatible versions of the same node
  //   change   - when the local store is updated
  //
  function partialSync(startPath, depth) {
    return util.getPromise(function(promise) {
      if(! isConnected()) {
        return promise.fulfill();
      }

      validatePath(startPath);
      logger.info("partial sync requested: " + startPath);
      enqueueTask(function() {
        logger.info("partial sync started from: " + startPath);
        return traverseTree(startPath, processNode, {
          depth: depth
        });
      }, promise.fulfill);
    });
  }

  // Function: updateDataNode
  //
  // Sync a single data node, bypassing cache. Used by <BaseClient> to
  // fetch pending nodes.
  //
  function updateDataNode(path, localNode) {
    if(localNode) {
      return wireClient.set(path, localNode.data, localNode.mimeType).
        then(function() {
          remoteAdapter.expireKey(path);
        }).then(function() {
          var parentPath = util.containingDir(path);
          remoteAdapter.expireKey(parentPath);
          if(caching.descendIntoPath(parentPath)) {
            return util.asyncGroup(
              curry(remoteAdapter.get, parentPath),
              curry(store.getNode, parentPath)
            ).then(function(parents) {
              var baseName = util.baseName(path);
              parents[1].data[baseName] = parents[0].data[baseName];
            });
          }
        });
    } else {
      return remoteAdapter.get(path).
        then(function(node) {
          remoteAdapter.expireKey(path);
          return node;
        });
    }
  }


  /**************************************/

  // Section: Scheduling and state
  //
  // Scheduling happens using three variables:
  //
  //   ready state - a boolean, set to false when any task is in progress
  //
  //   task queue  - a queue of procedures to call when 'ready' is fired.
  //                 All <High-level sync functions> enqueue their task here,
  //                 when the the ready state is currently false.
  //
  //   deferred iteration queue - a queue of spawnQueue tasks to start, when the
  //                 'ready' event *would* be fired. Enqueued from spawnQueue,
  //                 when it's called with ready state set to false.
  //


  var ready = true;

  // queue of spawnQueue calls
  // (for queueing *within* a sync cycle)
  var deferredIterationQueue = [];
  // queue of sync tasks
  // (if requested, while not ready)
  var taskQueue = [];

  // function to call when current task is done, before next task is popped from taskQueue.
  var currentFinalizer = null;

  function beginTask() {
    setBusy();
    var task = taskQueue.shift();
    if(! task) {
      throw new Error("Can't begin task, queue is empty");
    }
    currentFinalizer = task.finalizer;
    var result = task.run();
    if(util.isPromise(result)) {
      result.then(finishTask, function(error) {
        logger.error("TASK FAILED", (error && error.stack) || error);
        finishTask();
        fireError(null, error);
      });
    }
  }

  function finishTask() {
    remoteAdapter.clearCache();
    if(currentFinalizer) {
      currentFinalizer();
    }
    if(taskQueue.length > 0) {
      beginTask();
    } else {
      setReady();
    }
  }

  function enqueueTask(callback, finalizer) {
    taskQueue.push({
      run: callback,
      finalizer: finalizer
    });
    if(ready) {
      beginTask();
    } else {
      logger.info('not ready, enqueued task');
    }
  }

  function setBusy() {
    ready = false;
    events.emit('state', 'busy');
    events.emit('busy');
  }
  function setReady() {
    ready = true;
    events.emit('state', 'connected');
    events.emit('ready');
  }

  // Function: getState
  // Get the current ready state of synchronization. Either 'connected' or 'busy'.
  function getState() {
    return disabled ? 'disabled' : (ready ? 'connected' : 'busy');
  }

  // Section: Events

  // Event: ready
  //
  // Fired when sync becomes ready. This means the current sync cycle has ended.
  //
  // Shouldn't be used from application code, as the state may move back to 'busy'
  // immediately afterwards, in case tasks have been enqueued by the high-level
  // sync functions.

  // Event: conflict
  //
  // Both local and remote data of a node has been modified.
  // You need to specify a resolution.
  //
  // Properties:
  //   path        - path of the conflicting node
  //   localValue  - locally cached (and modified) value
  //   remoteValue - new value seen on the remote server
  //   localTime   - Date object, representing last local update
  //   remoteTime  - Date object, representing last remote update
  //   lastUpdate  - Date object, representing last synchronization of this node
  //   resolve     - Function to call, in order to specify a resolution
  //   type        - type of conflict, either "delete" or "merge"
  //
  // Example:
  //   (start code)
  //
  //   client.on('conflict', function(event) {
  //
  //     console.log(event.type, ' conflict at ', event.path,
  //                 event.localTime, 'vs', event.remoteTime,
  //                 '(last seen: ', event.lastUpdate, ')');
  //
  //     event.resolve('local'); // overwrite remote version
  //     // OR
  //     event.resolve('remote'); // overwrite local version
  //   });
  //
  //   (end code)
  //

  function fireConflict(type, path, local, remote) {
    events.emit('conflict', {
      type: type,
      path: path,
      localValue: local.data,
      remoteValue: remote.data,
      localTime: new Date(local.timestamp),
      remoteTime: new Date(remote.timestamp),
      lastUpdate: new Date(local.lastUpdatedAt),
      resolve: makeConflictResolver(path, local, remote)
    });
  }

  // Event: error
  //
  // Fired when either one of the underlying layers propagates an error,
  // or an exception is called within a sync callback.
  //
  // Properties:
  //   path  - path that is associated with this error. May be null.
  //   error - Either an error message (string) or a Error object.
  //   stack - If this was an error and the browser supports the error.stack
  //           property, this holds the stack as an array of lines.


  function fireError(path, error) {
    var event = { path: path, source: 'sync' };
    if(typeof(error) == 'object') {
      event.stack = error.stack;
      if(typeof(event.stack) == 'string') {
        event.stack = event.stack.split('\n');
      }
      event.message = error.message;
      event.exception = error;
    } else if(error == 'timeout') {
      events.emit('timeout');
      return;
    } else {
      event.message = error;
    }
    events.emit('error', event);
  }

  // Section: Update functions

  // Function: deleteLocal
  //
  // remove local data at path.
  // Fires: change
  function deleteLocal(path, local, remote) {
    logger.info('DELETE', path, 'REMOTE -> LOCAL');
    return store.removeNode(path, remote.timestamp);
  }

  // Function: deleteRemote
  //
  // remove remote data, then clear local diff.
  // Fires: error
  function deleteRemote(path, local, remote) {
    logger.info('DELETE', path, 'LOCAL -> REMOTE');
    return remoteAdapter.
      remove(path).
      then(function() {
        store.clearDiff(path);
      });
  }

  // Function: updateLocal
  //
  // update local data at path.
  function updateLocal(path, local, remote) {
    logger.info('UPDATE', path, 'REMOTE -> LOCAL');
    return store.setNodeData(path, remote.data, false, remote.timestamp, remote.mimeType);
  }

  // Function: updateRemote
  //
  // update remote data at path, then clear local diff.
  // Fires: error
  function updateRemote(path, local, remote) {
    logger.info('UPDATE', path, 'LOCAL -> REMOTE');
    var parentPath = util.containingDir(path);
    var baseName = util.baseName(path);
    return remoteAdapter.set(path, local).
      then(curry(remoteAdapter.expireKey, parentPath)).
      then(curry(remoteAdapter.get, parentPath)).
      then(function(remoteNode) {
        return store.clearDiff(
          path, remoteNode ? remoteNode.data[baseName] : undefined
        );
      });
  }

  // Function: processNode
  //
  // Decides which action to perform on the node in order to synchronize it.
  //
  // Used as a callback for <traverseTree>.
  function processNode(path, local, remote) {

    if(! path) {
      throw new Error("Can't process node without a path!");
    }

    if(util.isDir(path)) {
      throw new Error("Attempt to process directory node: " + path);
    }

    var action = null;

    if(local.deleted) {
      // outgoing delete!
      action = deleteRemote;

    } else if(remote.deleted && local.lastUpdatedAt > 0) {
      if(local.timestamp == local.lastUpdatedAt) {
        // incoming delete!
        action = deleteLocal;

      } else {
        // deletion conflict!
        action = curry(fireConflict, 'delete');

      }
    } else if(local.timestamp == remote.timestamp) {
      // no action today!
      return;

    } else if((!remote.timestamp) || local.timestamp > remote.timestamp) {
      // local updated happpened before remote update
      if((!remote.timestamp) || local.lastUpdatedAt == remote.timestamp) {
        // outgoing update!
        action = updateRemote;

      } else {
        // merge conflict!
        action = curry(fireConflict, 'merge');

      }
    } else if(local.timestamp < remote.timestamp) {
      // remote updated happened before local update
      if(local.lastUpdatedAt == local.timestamp) {
        // incoming update!
        action = updateLocal;

      } else {
        // merge conflict!
        action = curry(fireConflict, 'merge');

      }
    }

    if(! action) {
      console.error("NO ACTION DETERMINED!!!", path, local, 'vs', remote);
      var exc = new Error("Something went terribly wrong.");
      exc.path = path;
      exc.localNode = local;
      exc.remoteNode = remote;
      throw exc;
    }

    return action(path, local, remote);
  }

  /**************************************/

  // Function: fetchLocalNode
  //
  // Fetch a local node at given path.
  //
  // Loads a <store.Node> and extends it with the following:
  //   data - data of the node, as received from <store.getNodeData>
  //   deleted - whether this node is considered deleted.
  function fetchLocalNode(path, isDeleted) {
    return store.getNode(path).
      then(function(localNode) {
        logger.info("fetch local", path, localNode);

        if(isForeignPath(path)) {
          // can't modify foreign data locally
          isDeleted = false;
        }

        function yieldNode(node) {
          localNode.deleted = isDeleted;
          return localNode;
        }

        if(typeof(isDeleted) === 'undefined') {
          // in some contexts we don't have the parent present already to check.
          var parentPath = util.containingDir(path);
          var baseName = util.baseName(path);
          if(parentPath) {
            return store.getNode(parentPath).
              then(function(parent) {
                isDeleted = (! parent.data[baseName]) && parent.diff[baseName];
                return yieldNode();
              });
          } else {
            // root node can't be deleted.
            isDeleted = false;
          }
        }
        return yieldNode();
      });
  }

  // Function: fetchRemoteNode
  //
  // Fetch node at given path from remote.
  //
  // Constructs a node like this:
  //   timestamp - last update of the node, if known. Otherwise 0.
  //   data - data of the node received from remote storage, or undefined
  //   deleted - whether remote storage knows this node.
  //   mimeType - MIME type of the node
  //
  function fetchRemoteNode(path, isDeleted) {
    logger.info("fetch remote", path);
    return remoteAdapter.get(path).
      then(function(node) {
        if(! node) {
          node = {};
        }
        if(util.isDir(path) && (! node.data)) {
          node.data = {};
        }
        return node;
      });
  }

  // Section: Trivial helpers

  function isConnected() {
    return remoteAdapter.getState() === 'connected';
  }

  function makeSet(a, b) {
    var o = {};
    var al = a.length, bl = b.length;
    for(var i=0;i<al;i++) { o[a[i]] = true; }
    for(var j=0;j<bl;j++) { o[b[j]] = true; }
    return Object.keys(o);
  }

  var foreignPathRE = /^[^\/][^:]+:\//;
  var ownPathRE = /^\//;

  function isOwnPath(path) {
    return ownPathRE.test(path);
  }

  function isForeignPath(path) {
    return foreignPathRE.test(path);
  }

  function validPath(path, foreignOk) {
    return isOwnPath(path) || (foreignOk ? isForeignPath(path) : false);
  }

  function validatePath(path, foreignOk) {
    if(! validPath(path, foreignOk)) {
      throw new Error("Invalid path: " + path);
    }
  }

  // Function: traverseTree
  //
  // Traverse the full tree of nodes, passing each visited data node to the callback for processing.
  //
  // Parameters:
  //   root     - Path to the root to start traversal at.
  //   callback - callback called for each node. see below.
  //   options  - (optional) Object with options. see below.
  //
  // Callback parameters:
  //   The callback is called for each node, that is present either
  //   locally or remote (or both).
  //
  //   path       - path to current node
  //   localNode  - local node at current path. See <fetchLocalNode> for a description.
  //   remoteNode - remote node at current path. See <fetchRemoteNode> for a description.
  //
  // Options:
  //   depth - When given, a positive number, setting the maximum depth of traversal.
  //           Depth will be decremented in each recursion
  function traverseTree(root, callback, opts) {
    logger.info('traverse', root, opts, 'callback?', !!callback);

    if(! util.isDir(root)) {
      throw "Can't traverse data node: " + root;
    }

    if(! opts) { opts = {}; }

    function mergeDataNode(path, localNode, remoteNode, options) {
      if(util.isDir(path)) {
        throw new Error("Not a data node: " + path);
      }
      return callback(path, localNode, remoteNode);
    }

    function mergeDirectory(path, localNode, remoteNode, options) {

      var fullListing = makeSet(
        Object.keys(localNode.data),
        Object.keys(remoteNode.data)
      );
      return util.asyncEach(fullListing, function(key) {
        var childPath = path + key;
        var remoteVersion = remoteNode.data[key];
        var localVersion = localNode.data[key];
        logger.debug("traverseTree.mergeDirectory[" + childPath + "]", remoteVersion, 'vs', localVersion);
        if(remoteVersion !== localVersion) {
          if(caching.cachePath(childPath)) {
            if(util.isDir(childPath)) {
              if(options.depth !== 0) {
                var childOptions = util.extend({}, options);
                if(childOptions.depth) {
                  childOptions.depth--;
                }
                return mergeTree(childPath, childOptions);
              }
            } else {
              return util.asyncGroup(
                curry(fetchLocalNode, childPath),
                curry(fetchRemoteNode, childPath)
              ).then(function(nodes, errors) {
                if(errors.length > 0) {
                  logger.error("Failed to sync node", childPath, errors);
                  return store.setNodeError(childPath, errors);
                } else {
                  return mergeDataNode(childPath, nodes[0], nodes[1], options);
                }
              });
            }
          } else {
            return store.touchNode(childPath);
          }
        }
      }).then(function(results, errors) {
        if(errors.length > 0) {
          logger.error("Failed to sync node", path, errors);
          store.setNodeError(path, errors);
          throw errors;
        }
      });
    }

    function mergeTree(path, options) {
      options.path = path;
      if(caching.descendIntoPath(path)) {
        return util.asyncGroup(
          curry(fetchLocalNode, path),
          curry(fetchRemoteNode, path)
        ).then(function(nodes, errors) {
          if(errors.length > 0) {
            // throw the first error that we have.
            errors.forEach(function(e) {
              if(e) {
                throw e;
              }
            });
          }
          var localNode = nodes[0];
          var remoteNode = nodes[1];
          return mergeDirectory(path, localNode, remoteNode, options).
            then(curry(store.setLastSynced, path, remoteNode.timestamp));
        });
      } else {
        // FIXME: do we *need* to return a promise here?
        return util.getPromise().fulfill();
      }
    }

    return mergeTree(root, opts);
  }

  // Section: Meta helpers

  // Function: makeConflictResolver
  // returns a function that can be called to resolve the conflict
  // at the given path.
  function makeConflictResolver(path, local, remote) {
    return function(solution, newData) {
      if(solution == 'local') {
        // outgoing update!
        if(newData) {
          local.data = newData;
          // a hack to also update local data, when the resolution specifies new data
          updateLocal(path, local, local);
        }
        updateRemote(path, local, remote);
      } else if(solution == 'remote') {
        // incoming update!
        updateLocal(path, local, remote);
      } else {
        throw "Invalid conflict resolution: " + solution;
      }
    };
  }


  events.on('error', function(error) {
    logger.error("Sync Error: ", error);
  });


  var sync = util.extend({}, events, {

    get: function(path) {
      if(caching.cachePath(path)) {
        return store.getNode(path)
      } else {
        return remoteAdapter.get(path);
      }
    },

    set: function(path, node) {
      if(caching.cachePath(path)) {
        return store.setNodeData(path, node.data, true, undefined, node.mimeType);
      } else {
        return remoteAdapter.set(path, node);
      }
    },

    remove: function(path) {
      if(caching.cachePath(path)) {
        return store.setNodeData(path, undefined, true).
          then(function() {
            return partialSync(util.containingDir(path), 1);
          });
      } else {
        return remoteAdapter.remove(path).then(remoteAdapter.clearCache);
      }
    },

    enable: enable,
    disable: disable,

    getQueue: function() { return taskQueue; },

    updateDataNode: updateDataNode,

    lastSyncAt: null,

    // Section: exported functions

    // Method: on
    // Install an event handler.

    // Method: fullSync
    // <fullSync>
    fullSync: fullSync,

    forceSync: fullSync,
    // Method: fullPush
    // <fullPush>
    fullPush: fullPush,
    // Method: partialSync
    // <partialSync>
    partialSync: partialSync,

    // Method: needsSync
    // Returns true, if there are local changes that have not been synced.
    needsSync: needsSync,

    // Method: getState
    // <getState>
    getState: getState,

    reset: function() {
      remoteAdapter.clearCache();
      settings.clear();
      events.reset();
    },

    // FOR TESTING INTERNALS ONLY!!!
    getInternal: function(symbol) {
      return eval(symbol);
    },

    setRemoteAdapter: function(adapter) {
      remoteAdapter = adapter;
    },

    setAccess: function(_access) {
      access = _access;
    },

    setCaching: function(_caching) {
      caching = _caching;
    }

  });

  return sync;

  /*
    Section: Notes

    Some example I made up to visualize some of the situations that can happen.

    Legend:
      L - has local modifications
      R - has remote modifications
      D - modification is a delete

    Suppose a tree like this:

      >    /
      >    /messages/
      >    /messages/pool/
      >    /messages/pool/1
      >    /messages/pool/2
      > L  /messages/pool/3
      > R  /messages/pool/4
      >    /messages/index/read/true/1
      > L  /messages/index/read/true/3
      >    /messages/index/read/false/2
      > LD /messages/index/read/false/3
      > R  /messages/index/read/false/4


    Now a sync cycle for /messages/ begins:

      > GET /messages/
      >   -> mark remote diff for pool/ and index/
      > GET /messages/index/
      >   -> mark local and remote diff for read/
      > GET /messages/index/read/
      >   -> mark remote diff for false/
      > GET /messages/index/read/false/
      >   -> mark remote diff for 4
      > DELETE /messages/index/read/false/3
      >   -> clear local diff for 3
      > GET /messages/index/read/false/4
      >   -> update local node 4
      >   -> clear remote diff for 4
      >   (pop back to /messages/index/read/)
      >   -> clear remote and local diff for false/
      > GET /messages/index/read/true/
      > PUT /messages/index/read/true/3
      >   -> clear local diff for 3
      >   (pop back to /messages/index/read/)
      >   -> clear local diff for true/)
      >   (pop back to /messages/index/)
      >   -> clear local and remote diff for read/
      >   (pop back to /messages/)
      > GET /messages/pool/
      >   -> mark remote diff for 4
      > PUT /messages/pool/3
      >   -> clear local diff for 3
      > GET /messages/pool/4
      >   -> update local node 4
      >   -> clear remote diff for 4
      >   (pop back to /messages/)
      >   -> clear local and remote diff for pool/
      >   (pop back to /)
      >   -> clear local and remote diff for messages/

    Sync cycle all done.

   */

});

define('lib/schedule',['./util', './sync'], function(util, sync) {

  var logger = util.getLogger('schedule');

  var watchedPaths = {};
  var lastPathSync = {};
  var runInterval = 5000;
  var enabled = false;
  var timer = null;

  function scheduleNextRun() {
    timer = setTimeout(run, runInterval);
  }

  function run() {
    if(! enabled) {
      return;
    }
    if(timer) {
      clearTimeout(timer);
    }

    logger.info('check');

    var syncNow = [];
    var syncedCount = 0;

    var now = new Date().getTime();

    // assemble list of paths that need action
    for(var p in watchedPaths) {
      var lastSync = lastPathSync[p];
      if((! lastSync) || (lastSync + watchedPaths[p]) <= now) {
        syncNow.push(p);
      }
    }

    if(syncNow.length === 0) {
      scheduleNextRun();
      return;
    }

    logger.info("Paths to refresh: ", syncNow);

    // request a sync for each path
    var numSyncNow = syncNow.length;
    for(var i=0;i<numSyncNow;i++) {
      var path = syncNow[i];
      var syncer = path === '/' ? sync.fullSync : util.curry(sync.partialSync, path);
      syncer().then(function() {
        lastPathSync[path] = new Date().getTime();

        syncedCount++;

        logger.debug('now synced', syncedCount, 'of', numSyncNow);

        if(syncedCount == numSyncNow) {
          scheduleNextRun();
        }
      });
    }
  }

  return {

    get: function(path) {
      if(path) {
        return watchedPaths[path];
      } else {
        return watchedPaths;
      }
    },

    enable: function() {
      enabled = true;
      logger.info('enabled');
      scheduleNextRun();
    },

    disable: function() {
      enabled = false;
      logger.info('disabled');
    },

    isEnabled: function() {
      return enabled;
    },

    watch: function(path, interval) {
      logger.info("Schedule sync of", path, "every", interval / 1000.0, "seconds");
      watchedPaths[path] = interval;
      if(! lastPathSync[path]) {
        // mark path as synced now, so it won't get synced on the next scheduler
        // cycle, but instead when it's interval has passed.
        lastPathSync[path] = new Date().getTime();
      }
    },

    unwatch: function(path) {
      delete watchedPaths[path];
      delete lastPathSync[path];
    },

    reset: function() {
      watchedPaths = {};
      lastPathSync = {};
      if(timer) {
        clearTimeout(timer);
        timer = null;
      }
    }

  };

});

/**
 * JSONSchema Validator - Validates JavaScript objects using JSON Schemas
 *	(http://www.json.com/json-schema-proposal/)
 *
 * Copyright (c) 2007 Kris Zyp SitePen (www.sitepen.com)
 * Licensed under the MIT (MIT-LICENSE.txt) license.
To use the validator call the validate function with an instance object and an optional schema object.
If a schema is provided, it will be used to validate. If the instance object refers to a schema (self-validating),
that schema will be used to validate and the schema parameter is not necessary (if both exist,
both validations will occur).
The validate method will return an array of validation errors. If there are no errors, then an
empty list will be returned. A validation error will have two properties:
"property" which indicates which property had the error
"message" which indicates what the error was
 */
//({define:typeof define!="undefined"?define:function(deps, factory){module.exports = factory();}}).
define('vendor/validate',[], function(){
var exports = validate;
// setup primitive classes to be JSON Schema types
exports.Integer = {type:"integer"};
var primitiveConstructors = {
	String: String,
	Boolean: Boolean,
	Number: Number,
	Object: Object,
	Array: Array,
	Date: Date
}
exports.validate = validate;
function validate(/*Any*/instance,/*Object*/schema) {
		// Summary:
		//  	To use the validator call JSONSchema.validate with an instance object and an optional schema object.
		// 		If a schema is provided, it will be used to validate. If the instance object refers to a schema (self-validating),
		// 		that schema will be used to validate and the schema parameter is not necessary (if both exist,
		// 		both validations will occur).
		// 		The validate method will return an object with two properties:
		// 			valid: A boolean indicating if the instance is valid by the schema
		// 			errors: An array of validation errors. If there are no errors, then an
		// 					empty list will be returned. A validation error will have two properties:
		// 						property: which indicates which property had the error
		// 						message: which indicates what the error was
		//
		return validate(instance, schema, {changing: false});//, coerce: false, existingOnly: false});
	};
exports.checkPropertyChange = function(/*Any*/value,/*Object*/schema, /*String*/property) {
		// Summary:
		// 		The checkPropertyChange method will check to see if an value can legally be in property with the given schema
		// 		This is slightly different than the validate method in that it will fail if the schema is readonly and it will
		// 		not check for self-validation, it is assumed that the passed in value is already internally valid.
		// 		The checkPropertyChange method will return the same object type as validate, see JSONSchema.validate for
		// 		information.
		//
		return validate(value, schema, {changing: property || "property"});
	};
var validate = exports._validate = function(/*Any*/instance,/*Object*/schema,/*Object*/options) {

	if (!options) options = {};
	var _changing = options.changing;

	function getType(schema){
		return schema.type || (primitiveConstructors[schema.name] == schema && schema.name.toLowerCase());
	}
	var errors = [];
	// validate a value against a property definition
	function checkProp(value, schema, path,i){

		var l;
		path += path ? typeof i == 'number' ? '[' + i + ']' : typeof i == 'undefined' ? '' : '.' + i : i;
		function addError(message){
			errors.push({property:path,message:message});
		}

		if((typeof schema != 'object' || schema instanceof Array) && (path || typeof schema != 'function') && !(schema && getType(schema))){
			if(typeof schema == 'function'){
				if(!(value instanceof schema)){
					addError("is not an instance of the class/constructor " + schema.name);
				}
			}else if(schema){
				addError("Invalid schema/property definition " + schema);
			}
			return null;
		}
		if(_changing && schema.readonly){
			addError("is a readonly field, it can not be changed");
		}
		if(schema['extends']){ // if it extends another schema, it must pass that schema as well
			checkProp(value,schema['extends'],path,i);
		}
		// validate a value against a type definition
		function checkType(type,value){
			if(type){
				if(typeof type == 'string' && type != 'any' &&
						(type == 'null' ? value !== null : typeof value != type) &&
						!(value instanceof Array && type == 'array') &&
						!(value instanceof Date && type == 'date') &&
						!(type == 'integer' && value%1===0)){
					return [{property:path,message:(typeof value) + " value found, but a " + type + " is required"}];
				}
				if(type instanceof Array){
					var unionErrors=[];
					for(var j = 0; j < type.length; j++){ // a union type
						if(!(unionErrors=checkType(type[j],value)).length){
							break;
						}
					}
					if(unionErrors.length){
						return unionErrors;
					}
				}else if(typeof type == 'object'){
					var priorErrors = errors;
					errors = [];
					checkProp(value,type,path);
					var theseErrors = errors;
					errors = priorErrors;
					return theseErrors;
				}
			}
			return [];
		}
		if(value === undefined){
			if(schema.required){
				addError("is missing and it is required");
			}
		}else{
			errors = errors.concat(checkType(getType(schema),value));
			if(schema.disallow && !checkType(schema.disallow,value).length){
				addError(" disallowed value was matched");
			}
			if(value !== null){
				if(value instanceof Array){
					if(schema.items){
						var itemsIsArray = schema.items instanceof Array;
						var propDef = schema.items;
						for (i = 0, l = value.length; i < l; i += 1) {
							if (itemsIsArray)
								propDef = schema.items[i];
							if (options.coerce)
								value[i] = options.coerce(value[i], propDef);
							errors.concat(checkProp(value[i],propDef,path,i));
						}
					}
					if(schema.minItems && value.length < schema.minItems){
						addError("There must be a minimum of " + schema.minItems + " in the array");
					}
					if(schema.maxItems && value.length > schema.maxItems){
						addError("There must be a maximum of " + schema.maxItems + " in the array");
					}
				}else if(schema.properties || schema.additionalProperties){
					errors.concat(checkObj(value, schema.properties, path, schema.additionalProperties));
				}
				if(schema.pattern && typeof value == 'string' && !value.match(schema.pattern)){
					addError("does not match the regex pattern " + schema.pattern);
				}
				if(schema.maxLength && typeof value == 'string' && value.length > schema.maxLength){
					addError("may only be " + schema.maxLength + " characters long");
				}
				if(schema.minLength && typeof value == 'string' && value.length < schema.minLength){
					addError("must be at least " + schema.minLength + " characters long");
				}
				if(typeof schema.minimum !== undefined && typeof value == typeof schema.minimum &&
						schema.minimum > value){
					addError("must have a minimum value of " + schema.minimum);
				}
				if(typeof schema.maximum !== undefined && typeof value == typeof schema.maximum &&
						schema.maximum < value){
					addError("must have a maximum value of " + schema.maximum);
				}
				if(schema['enum']){
					var enumer = schema['enum'];
					l = enumer.length;
					var found;
					for(var j = 0; j < l; j++){
						if(enumer[j]===value){
							found=1;
							break;
						}
					}
					if(!found){
						addError("does not have a value in the enumeration " + enumer.join(", "));
					}
				}
				if(typeof schema.maxDecimal == 'number' &&
					(value.toString().match(new RegExp("\\.[0-9]{" + (schema.maxDecimal + 1) + ",}")))){
					addError("may only have " + schema.maxDecimal + " digits of decimal places");
				}
			}
		}
		return null;
	}
	// validate an object against a schema
	function checkObj(instance,objTypeDef,path,additionalProp){

		if(typeof objTypeDef =='object'){
			if(typeof instance != 'object' || instance instanceof Array){
				errors.push({property:path,message:"an object is required"});
			}
			
			for(var i in objTypeDef){ 
				if(objTypeDef.hasOwnProperty(i)){
					var value = instance[i];
					// skip _not_ specified properties
					if (value === undefined && options.existingOnly) continue;
					var propDef = objTypeDef[i];
					// set default
					if(value === undefined && propDef["default"]){
						value = instance[i] = propDef["default"];
					}
					if(options.coerce && i in instance){
						value = instance[i] = options.coerce(value, propDef);
					}
					checkProp(value,propDef,path,i);
				}
			}
		}
		for(i in instance){
			if(instance.hasOwnProperty(i) && !(i.charAt(0) == '_' && i.charAt(1) == '_') && objTypeDef && !objTypeDef[i] && additionalProp===false){
				if (options.filter) {
					delete instance[i];
					continue;
				} else {
					errors.push({property:path,message:(typeof value) + "The property " + i +
						" is not defined in the schema and the schema does not allow additional properties"});
				}
			}
			var requires = objTypeDef && objTypeDef[i] && objTypeDef[i].requires;
			if(requires && !(requires in instance)){
				errors.push({property:path,message:"the presence of the property " + i + " requires that " + requires + " also be present"});
			}
			value = instance[i];
			if(additionalProp && (!(objTypeDef && typeof objTypeDef == 'object') || !(i in objTypeDef))){
				if(options.coerce){
					value = instance[i] = options.coerce(value, additionalProp);
				}
				checkProp(value,additionalProp,path,i);
			}
			if(!_changing && value && value.$schema){
				errors = errors.concat(checkProp(value,value.$schema,path,i));
			}
		}
		return errors;
	}
	if(schema){
		checkProp(instance,schema,'',_changing || '');
	}
	if(!_changing && instance && instance.$schema){
		checkProp(instance,instance.$schema,'','');
	}
	return {valid:!errors.length,errors:errors};
};
exports.mustBeValid = function(result){
	//	summary:
	//		This checks to ensure that the result is valid and will throw an appropriate error message if it is not
	// result: the result returned from checkPropertyChange or validate
	if(!result.valid){
		throw new TypeError(result.errors.map(function(error){return "for property " + error.property + ': ' + error.message;}).join(", \n"));
	}
}

return exports;
});

/*!
  Math.uuid.js (v1.4)
  http://www.broofa.com
  mailto:robert@broofa.com

  Copyright (c) 2010 Robert Kieffer
  Dual licensed under the MIT and GPL licenses.

  ********

  Changes within remoteStorage.js:
  2012-10-31:
  - added AMD wrapper <niklas@unhosted.org>
  - moved extensions for Math object into exported object.
*/

/*
 * Generate a random uuid.
 *
 * USAGE: Math.uuid(length, radix)
 *   length - the desired number of characters
 *   radix  - the number of allowable values for each character.
 *
 * EXAMPLES:
 *   // No arguments  - returns RFC4122, version 4 ID
 *   >>> Math.uuid()
 *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
 *
 *   // One argument - returns ID of the specified length
 *   >>> Math.uuid(15)     // 15 character ID (default base=62)
 *   "VcydxgltxrVZSTV"
 *
 *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
 *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
 *   "01001010"
 *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
 *   "47473046"
 *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
 *   "098F4D35"
 */
define('vendor/Math.uuid',[], function() {
  // Private array of chars to use
  var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

  return {
    uuid: function (len, radix) {
      var chars = CHARS, uuid = [], i;
      radix = radix || chars.length;

      if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
      } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | Math.random()*16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
          }
        }
      }

      return uuid.join('');
    },

    // A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
    // by minimizing calls to random()
    uuidFast: function() {
      var chars = CHARS, uuid = new Array(36), rnd=0, r;
      for (var i = 0; i < 36; i++) {
        if (i==8 || i==13 ||  i==18 || i==23) {
          uuid[i] = '-';
        } else if (i==14) {
          uuid[i] = '4';
        } else {
          if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
          r = rnd & 0xf;
          rnd = rnd >> 4;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
      return uuid.join('');
    },

    // A more compact, but less performant, RFC4122v4 solution:
    uuidCompact: function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    }
  };

});

define('lib/baseClient',[
  './util',
  './store',
  './wireClient',
  './sync',
  '../vendor/validate',
  '../vendor/Math.uuid'
], function(util, store, wireClient, sync, validate, MathUUID) {

  

  var logger = util.getLogger('baseClient');
  var globalEvents = util.getEventEmitter('error');
  var moduleEvents = {};

  var caching;

  function extractModuleName(path) {
    if (path && typeof(path) == 'string') {
      var parts = path.split('/');
      if(parts.length > 3 && parts[1] == 'public') {
        return parts[2];
      } else if(parts.length > 2){
        return parts[1];
      } else if(parts.length == 2) {
        return 'root';
      }
    }
  }

  var isPublicRE = /^\/public\//;

  function fireModuleEvent(eventName, moduleName, eventObj) {
    var isPublic = isPublicRE.test(eventObj.path);
    var events;
    if(moduleEvents[moduleName] &&
       (events = moduleEvents[moduleName][isPublic])) {

      if(moduleName !== 'root' && eventObj.path) {
        eventObj.relativePath = eventObj.path.replace(
          (isPublic ? '/public/' : '/') + moduleName + '/', ''
        );
      }

      events.emit(eventName, eventObj);
    }
  }

  function fireError(absPath, error) {
    var isPublic = isPublicRE.test(absPath);
    var moduleName = extractModuleName(absPath);
    var modEvents = moduleEvents[moduleName];
    if(! (modEvents && modEvents[isPublic])) {
      moduleEvents.root[isPublic].emit('error', error);
    } else {
      modEvents[isPublic].emit('error', error);
    }

    globalEvents.emit('error', error);
  }

  store.on('change', function(event) {
    var moduleName = extractModuleName(event.path);
    // remote-based changes get fired from the store.
    fireModuleEvent('change', moduleName, event);
    if(moduleName !== 'root') {
      // root module gets everything
      fireModuleEvent('change', 'root', event);
    }
  });

  sync.on('conflict', function(event) {
    var moduleName = extractModuleName(event.path);
    var isPublic = isPublicRE.test(event.path);
    var eventEmitter = moduleEvents[moduleName] && moduleEvents[moduleName][isPublic];
    var rootEmitter = moduleEvents.root && moduleEvents.root[isPublic];
    if(eventEmitter && eventEmitter.hasHandler('conflict')) {
      fireModuleEvent('conflict', moduleName, event);
      fireModuleEvent('conflict', 'root', event);
    } else if(rootEmitter && rootEmitter.hasHandler('conflict')) {
      fireModuleEvent('conflict', 'root', event);
    } else {
      event.resolve('remote');
    }
  });

  function failedPromise(error) {
    return util.getPromise().reject(error);
  }

  function fireChange(moduleName, path, oldValue, newValue) {
    var event = {
      origin: "window",
      path: path,
      oldValue: oldValue,
      newValue: newValue
    };
    fireModuleEvent('change', moduleName, event);
    if(moduleName !== 'root') {
      fireModuleEvent('change', 'root', event);
    }
  }

  function set(moduleName, path, absPath, value, mimeType) {
    if(util.isDir(absPath)) {
      return failedPromise(new Error('attempt to set a value to a directory ' + absPath));
    }
    var changeEvent;
    return store.getNode(absPath).
      then(function(node) {
        changeEvent = {
          origin: 'window',
          oldValue: node.data,
          newValue: value,
          path: absPath
        };
        return sync.set(absPath, { data: value, mimeType: mimeType });
      }).then(function() {
        fireModuleEvent('change', moduleName, changeEvent);
        if(moduleName !== 'root') {
          fireModuleEvent('change', 'root', changeEvent);
        }
      });
  }

  var ValidationError = function(object, errors) {
    Error.call(this, "Validation failed!");
    this.object = object;
    this.errors = errors;
  };

  /** FROM HERE ON PUBLIC INTERFACE **/

  // FIXME: add option for access mode
  var BaseClient = function(moduleName, isPublic) {
    if(! moduleName) {
      throw new Error("moduleName is required");
    }
    this.moduleName = moduleName, this.isPublic = isPublic;
    if(! moduleEvents[moduleName]) {
      moduleEvents[moduleName] = {};
    }
    this.events = util.getEventEmitter('change', 'conflict', 'error');
    moduleEvents[moduleName][!!isPublic] = this.events;
    util.bindAll(this);

    this.types = {};
    this.typeAliases = {};
    this.schemas = {};
    this.typeIdKeys = {};
  };

  // Class: BaseClient
  //
  // A BaseClient allows you to get, set or remove data. It is the basic
  // interface for building "modules".
  //
  // See <remoteStorage.defineModule> for details.
  //
  //
  // Most methods here return promises. See the guide for an introduction: <Promises>
  //
  BaseClient.prototype = {

    // Event: error
    //
    // Fired when an error occurs.
    //
    // The event object is either a string or an array of error messages.
    //
    // Example:
    //   > client.on('error', function(err) {
    //   >   console.error('something went wrong:', err);
    //   > });
    //
    //
    // Event: change
    //
    // Fired when data concerning this module is updated.
    //
    // Properties:
    //   path         - path to the node that changed
    //   newValue     - new value of the node. if the node has been removed, this is undefined.
    //   oldValue     - previous value of the node. if the node has been newly created, this is undefined.
    //   origin       - either "tab", "device" or "remote". Elaborated below.
    //   relativePath - path relative to the module root (*not* present in the root module. Use path there instead)
    //
    // Change origins:
    //   Change events can come from different origins. In order for your app to
    //   update it's state appropriately, every change event knows about it's origin.
    //
    //   The following origins are defined,
    //
    //   tab - this event was generated from the same *browser tab* or window that received the event
    //   device - this event was generated from the same *app*, but a differnent tab or window
    //   remote - this event came from the *remoteStorage server*. that means another app or the same app on another device caused the event.
    //
    // Example:
    //   (start code)
    //   client.on('change', function(event) {
    //     if(event.newValue && event.oldValue) {
    //       console.log(event.origin + ' updated ' + event.path + ':', event.oldValue, '->', event.newValue);
    //     } else if(event.newValue) {
    //       console.log(event.origin + ' created ' + event.path + ':', undefined, '->', event.newValue);
    //     } else {
    //       console.log(event.origin + ' removed ' + event.path + ':', event.oldValue, '->', undefined);
    //     }
    //   });
    //   (end code)
    //

    makePath: function(path) {
      var base = (this.moduleName == 'root' ?
                  (path[0] === '/' ? '' : '/') :
                  '/' + this.moduleName + '/');
      return (this.isPublic ? '/public' + base : base) + path;
    },

    // Method: lastUpdateOf
    // Get the time a node was last updated.
    //
    // Parameters:
    //   path - Relative path from the module root
    //
    // Returns:
    //   a promise for a timestamp, which is either
    //   a Number - when the node exists OR
    //   null - when the node doesn't exist
    //
    // The timestamp is represented as Number of milliseconds.
    // Use this snippet to get a Date object from it
    //   (start code)
    //   client.lastUpdateOf('path/to/node').
    //     then(function(timestamp) {
    //       // (normally you should check that 'timestamp' isn't null now)
    //       console.log('last update: ', new Date(timestamp));
    //     });
    //   (end code)
    //
    lastUpdateOf: function(path) {
      var absPath = this.makePath(path);
      var node = store.getNode(absPath);
      return node ? node.timestamp : null;
    },

    //
    // Method: on
    //
    // Install an event handler for the given type.
    //
    // Parameters:
    //   eventType - type of event, either "change" or "error"
    //   handler   - event handler function
    //   context   - (optional) context to bind handler to
    //
    on: function(eventType, handler, context) {
      this.events.on(eventType, util.bind(handler, context));
    },

    //
    // Method: getObject
    //
    // Get a JSON object from given path.
    //
    // Parameters:
    //   path     - relative path from the module root (without leading slash)
    //
    // Returns:
    //   A promise for the object.
    //
    // Example:
    //   (start code)
    //   client.getObject('/path/to/object').
    //     then(function(object) {
    //       // object is either an object or null
    //     });
    //   (end code)
    //
    getObject: function(path) {
      try {
        this._verifyPath(path, { rel: true });
      } catch(exc) {
        return failedPromise(exc);
      }
      var fullPath = this.makePath(path);
      return sync.get(fullPath).then(function(node) {
        if(node.mimeType !== 'application/json') {
          logger.error("WARNING: getObject got called, but retrieved a non-json node at '" + fullPath + "'!");
        }
        return node.data;
      });
    },

    //
    // Method: getListing
    //
    // Get a list of child nodes below a given path.
    //
    // The callback semantics of getListing are identical to those of getObject.
    //
    // Parameters:
    //   path     - The path to query. It MUST end with a forward slash.
    //
    // Returns:
    //   A promise for an Array of keys, representing child nodes.
    //   Those keys ending in a forward slash, represent *directory nodes*, all
    //   other keys represent *data nodes*.
    //
    // Example:
    //   (start code)
    //   client.getListing('').then(function(listing) {
    //     listing.forEach(function(item) {
    //       console.log('- ' + item);
    //     });
    //   });
    //   (end code)
    //
    getListing: function(path) {
      try {
        this._verifyPath(path, { rel: true, dir: true });
      } catch(exc) {
        return util.getPromise().reject(exc);
      }
      var fullPath = this.makePath(path);
      return sync.get(fullPath).then(function(node) {
        return node.data ? Object.keys(node.data) : [];
      });
    },

    //
    // Method: getAll
    //
    // Get all objects directly below a given path.
    //
    // Parameters:
    //   path      - path to the direcotry
    //   typeAlias - (optional) local type-alias to filter for
    //
    // Returns:
    //   a promise for an object in the form { path : object, ... }
    //
    // Example:
    //   (start code)
    //   client.getAll('').then(function(objects) {
    //     for(var key in objects) {
    //       console.log('- ' + key + ': ', objects[key]);
    //     }
    //   });
    //   (end code)
    //
    getAll: function(path, typeAlias) {

      function filterByType(objectMap) {
        if(typeAlias) {
          var type = this.resolveTypeAlias(typeAlias);
          for(var key in objectMap) {
            if(objectMap[key]['@context'] !== type) {
              delete objectMap[key];
            }
          }
        } else {
          return objectMap;
        }
      }

      function retrieveObjects(listing) {
        var _this = this;
        var objectMap = {};
        return util.asyncEach(listing, function(key) {
          if(! util.isDir(key)) {
            return _this.getObject(path + key).
              then(function(object) {
                objectMap[key] = object;
              });
          }
        }).then(function() {
          return objectMap;
        });
      }

      return this.getListing(path).
        then(util.bind(retrieveObjects, this)).
        then(util.bind(filterByType, this));
    },

    //
    // Method: getFile
    //
    // Get the file at the given path. A file is raw data, as opposed to
    // a JSON object (use <getObject> for that).
    //
    // Except for the return value structure, getFile works exactly like
    // getObject.
    //
    // Parameters:
    //   path     - see getObject
    //
    // Returns:
    //   A promise for an object:
    //
    //   mimeType - String representing the MIME Type of the document.
    //   data     - Raw data of the document (either a string or an ArrayBuffer)
    //
    // Example:
    //   (start code)
    //   // Display an image:
    //   client.getFile('path/to/some/image').then(function(file) {
    //     var blob = new Blob([file.data], { type: file.mimeType });
    //     var targetElement = document.findElementById('my-image-element');
    //     targetElement.src = window.URL.createObjectURL(blob);
    //   });
    //   (end code)
    getFile: function(path) {
      try {
        this._verifyPath(path, { rel: true });
      } catch(exc) {
        return util.getPromise().reject(exc);
      }
      var fullPath = this.makePath(path);
      return sync.get(fullPath).then(function(node) {
        return {
          mimeType: node.mimeType,
          data: node.data
        };
      });
    },

    // Method: getDocument
    //
    // DEPRECATED in favor of <getFile>
    getDocument: function() {
      util.deprecate('getDocument', 'getFile');
      return this.getFile.apply(this, arguments);
    },

    //
    // Method: remove
    //
    // Remove node at given path from storage. Triggers synchronization.
    //
    // Parameters:
    //   path     - Path relative to the module root.
    //
    remove: function(path) {
      try {
        this._verifyPath(path, { rel: true, dir: false });
      } catch(exc) {
        return util.getPromise().reject(exc);
      }
      var absPath = this.makePath(path);
      var oldValue;
      return sync.get(absPath).
        then(function(node) {
          oldValue = node.data;
          return sync.remove(absPath);
        }).
        then(function() {
          fireChange(this.moduleName, absPath, oldValue, undefined);
        }.bind(this));
    },

    // Method: saveObject
    //
    // Save a typed JSON object.
    // This only works for objects with a @context attribute corresponding to a schema
    // that has been declared via <declareType> and a ID attribute declared within
    // that schema.
    //
    // For details on using saveObject and typed JSON objects,
    // see <Working with schemas>.
    //
    // Parameters:
    //   object - a typed JSON object
    //
    //
    saveObject: function(object) {
      var type = object['@context'];
      var alias = this.resolveTypeAlias(type);
      var idKey = this.resolveIdKey(type);
      if(! idKey) {
        return failedPromise("Invalid typed JSON object! ID attribute could not be resolved.");
      }
      if(! object[idKey]) {
        object[idKey] = this.uuid();
      }
      return this.storeObject(alias, object[idKey], object);
    },

    //
    // Method: storeObject
    //
    // Store object at given path. Triggers synchronization.
    //
    // Parameters:
    //
    //   type     - unique type of this object within this module. See description below.
    //   path     - path relative to the module root.
    //   object   - an object to be saved to the given node. It must be serializable as JSON.
    //
    // Returns:
    //   A promise to store the object. The promise fails with a ValidationError, when validations fail.
    //
    //
    // What about the type?:
    //
    //   A great thing about having data on the web, is to be able to link to
    //   it and rearrange it to fit the current circumstances. To facilitate
    //   that, eventually you need to know how the data at hand is structured.
    //   For documents on the web, this is usually done via a MIME type. The
    //   MIME type of JSON objects however, is always application/json.
    //   To add that extra layer of "knowing what this object is", remoteStorage
    //   aims to use <JSON-LD at http://json-ld.org/>.
    //   A first step in that direction, is to add a *@context attribute* to all
    //   JSON data put into remoteStorage.
    //   Now that is what the *type* is for.
    //
    //   Within remoteStorage.js, @context values are built using three components:
    //     http://remotestoragejs.com/spec/modules/ - A prefix to guarantee unqiueness
    //     the module name     - module names should be unique as well
    //     the type given here - naming this particular kind of object within this module
    //
    //   In retrospect that means, that whenever you introduce a new "type" in calls to
    //   storeObject, you should make sure that once your code is in the wild, future
    //   versions of the code are compatible with the same JSON structure.
    //
    // How to define types?:
    //
    //   See <declareType> or the calendar module (src/modules/calendar.js) for examples.
    //
    storeObject: function(typeAlias, path, obj) {
      try {
        this._verifyPath(path, { rel: true, dir: false });
      } catch(exc) {
        return failedPromise(exc);
      }
      if(typeof(obj) !== 'object') {
        return failedPromise(new Error("given object must be an object (got: " + typeof(obj) + ")"));
      }

      var absPath = this.makePath(path);

      if(! (obj instanceof Array)) {
        obj['@context'] = this.resolveType(typeAlias);
        var errors = this.validateObject(obj);
        if(errors) {
          throw new ValidationError(obj, errors);
        }
      }
      return set(this.moduleName, path, absPath, obj, 'application/json').
        then(util.curry(sync.partialSync, util.containingDir(absPath), 1)).
        then(function() {
          return obj;
        });
    },

    //
    // Method: storeFile
    //
    // Store raw data at a given path. Triggers synchronization.
    //
    // Parameters:
    //   mimeType - MIME media type of the data being stored
    //   path     - path relative to the module root. MAY NOT end in a forward slash.
    //   data     - string or ArrayBuffer of raw data to store
    //   cache    - (optional) specify whether to put data in local cache prior to syncing it to the server. defaults to 'true'
    //
    // The given mimeType will later be returned, when retrieving the data
    // using <getFile>.
    //
    // Example (UTF-8 data):
    //   (start code)
    //   client.storeFile('text/html', 'index.html', '<h1>Hello World!</h1>');
    //   (end code)
    //
    // Example (Binary data):
    //   (start code)
    //   // MARKUP:
    //   <input type="file" id="file-input">
    //   // CODE:
    //   var input = document.getElementById('file-input');
    //   var file = input.files[0];
    //   var fileReader = new FileReader();
    //
    //   fileReader.onload = function() {
    //     client.storeFile(file.type, file.name, fileReader.result);
    //   };
    //
    //   fileReader.readAsArrayBuffer(file);
    //   (end code)
    //
    //
    // Example (Without local cache):
    //   (start code)
    //   client.storeFile('text/plain', 'hello.txt', 'Hello World!', false);
    //   (end code)
    //
    // Please keep in mind that the storage adapter used may limit the size of
    // files that can be stored in cache. The current default is localStorage,
    // which places a very tight limit due to constraints enforced by browsers
    // and the necessity of base64 encoding binary data.
    //
    // If you wish to store larger data, set the 'cache' parameter to 'false',
    // that way data will be pushed to the server immediately. Also make sure
    // you have only enabled tree-sync (see <BaseClient#use> for details) on
    // the tree containing the file you store, otherwise the next sync will
    // fetch the stored file from the server again, which you probably do not
    // want to happen.
    //
    storeFile: function(mimeType, path, data, cache) {
      try {
        this._verifyPath(path, { rel: true, dir: false });
      } catch(exc) {
        return failedPromise(exc);
      }
      cache = (cache !== false);
      if(typeof(mimeType) !== 'string') {
        return failedPromise(new Error("given mimeType must be a string (got: " + typeof(mimeType) + ")"));
      }
      if(typeof(path) !== 'string') {
        return failedPromise(new Error("given path must be a string (got: " + typeof(path) + ")"));
      }
      if(util.isDir(path)) {
        return failedPromise(new Error("Can't store directory node"));
      }
      if(typeof(data) !== 'string' && !(data instanceof ArrayBuffer)) {
        return failedPromise(new Error("storeFile received " + typeof(data) + ", but expected a string or an ArrayBuffer!"));
      }
      var absPath = this.makePath(path);
      if(cache) {
        return set(this.moduleName, path, absPath, data, mimeType).
          then(util.curry(sync.partialSync, util.containingDir(absPath), 1));
      } else {
        return sync.updateDataNode(absPath, {
          mimeType: mimeType,
          data: data
        });
      }
    },

    // Method: storeDocument
    //
    // DEPRECATED in favor of <storeFile>
    storeDocument: function() {
      util.deprecate('storeDocument', 'storeFile');
      return this.storeFile.apply(this, arguments);
    },

    getStorageHref: function() {
      return wireClient.getStorageHref();
    },

    //
    // Method: getItemURL
    //
    // Get the full URL of the item at given path. This will only
    // work, if the user is connected to a remoteStorage account.
    //
    // Parameter:
    //   path - path relative to the module root
    //
    // Returns:
    //   a String - when currently connected
    //   null - when currently disconnected
    getItemURL: function(path) {
      var base = this.getStorageHref();
      if(! base) {
        return null;
      }
      return base + this.makePath(path);
    },

    syncOnce: function(path, callback) {
      var previousTreeForce = store.getNode(path).startForceTree;
      this.use(path, false);
      return sync.partialSync(path, 1).
        then(util.bind(function() {
          if(previousTreeForce) {
            this.use(path, true);
          } else {
            this.release(path);
          }
          if(callback) {
            callback();
          }
        }, this));

    },

    //
    // Method: use
    //
    // Enable local caching for given path.
    //
    // Opposite of <release>.
    //
    // Parameters:
    //   path      - path relative to the module root
    //   skipData  - (optional) don't store actual data, only metadata
    //
    use: function(path, skipData) {
      caching.set(this.makePath(path), {
        data: !skipData
      });
      // returned promise is deprecated!!!
      return util.getPromise().fulfill();
    },

    // Method: release
    //
    // Disable local caching on given path.
    //
    // Opposite of <use>.
    //
    // Parameters:
    //   path      - path relative to the module root
    //
    release: function(path) {
      caching.remove(this.makePath(path));
      // returned promise is deprecated!!!
      return util.getPromise().fulfill();
    },

    // Method: hasDiff
    //
    // Yields true if the node at the given path has a diff set.
    // Having a "diff" means, that the node or one of it's descendants
    // has been updated since it was last pulled from remoteStorage.
    hasDiff: function(path) {
      var absPath = this.makePath(path);
      var item = null;
      if(! util.isDir(absPath)) {
        item = util.baseName(absPath);
        absPath = util.containingDir(absPath);
      }
      return store.getNode(absPath).
        then(function(node) {
          if(item) {
            return !! node.diff[item];
          } else {
            return Object.keys(node.diff).length > 0;
          }
        });
    },

    /**** TYPE HANDLING ****/

    resolveType: function(alias) {
      var type = this.types[alias];
      if(! type) {
        // FIXME: support custom namespace. don't fall back to remotestoragejs.com.
        type = 'http://remotestoragejs.com/spec/modules/' + this.moduleName + '/' + alias;
        logger.error("WARNING: type alias not declared: " + alias, '(have:', this.types, this.schemas, ')');
      }
      return type;
    },

    resolveTypeAlias: function(type) {
      return this.typeAliases[type];
    },

    resolveSchema: function(type) {
      var schema = this.schemas[type];
      if(! schema) {
        schema = {};
        logger.error("WARNING: can't find schema for type: ", type);
      }
      return schema;
    },

    resolveIdKey: function(type) {
      return this.typeIdKeys[type];
    },

    // Method: buildObject
    //
    // Build an object of the designated type.
    //
    // Parameters:
    //   alias - a type alias, registered via <declareType>
    //
    // If the associated schema specifies a top-level attribute with "format":"id",
    // and the given attributes don't contain that key, a UUID is generated for
    // that column.
    //
    // Example:
    //   (start code)
    //   var drink = client.buildObject('drink');
    //   client.validateObject(drink); // validates against schema declared for "drink"
    //   (end code)
    //
    buildObject: function(alias, attributes) {
      var object = {};
      var type = this.resolveType(alias);
      var idKey = this.resolveIdKey(type);
      if(! attributes) {
        attributes = {};
      }

      object['@context'] = type;
      if(idKey && ! attributes[idKey]) {
        object[idKey] = this.uuid();
      }
      return util.extend(object, attributes || {});
    },

    // Method: declareType
    //
    // Declare a type and assign it a schema.
    // Once a type has a schema set, all data that is stored with that type will be validated before saving it.
    //
    // Parameters:
    //   alias  - an alias to refer to the type. Must be unique within one scope / module.
    //   type   - (optional) full type-identifier to identify the type. used as @context attribute.
    //   schema - an object containing the schema for this new type.
    //
    // if "type" is ommitted, it will be generated based on the module name.
    //
    // Example:
    //   (start code)
    //   client.declareType('drink', {
    //     "description": "A representation of a drink",
    //     "type": "object",
    //     "properties": {
    //       "name": {
    //         "type": "string",
    //         "description": "Human readable name of the drink",
    //         "required": true
    //       }
    //     }
    //   });
    //
    //   client.storeObject('drink', 'foo', {}).
    //     then(function() {
    //       // object saved
    //     }, function(error) {
    //       // error.errors holds validation errors:
    //       // [{ "property": "name",
    //       //    "message": "is missing and it is required" }]
    //       //
    //       // error.object holds a copy of the object
    //     });
    //   (end code)
    //
    declareType: function(alias, type, schema) {
      if(this.types[alias]) {
        logger.error("WARNING: re-declaring already declared alias " + alias);
      }
      if(! schema) {
        schema = type;
        type = 'http://remotestoragejs.com/spec/modules/' + this.moduleName + '/' + alias;
      }
      if(schema['extends']) {
        var extendedType = this.types[ schema['extends'] ];
        if(! extendedType) {
          logger.error("Type '" + alias + "' tries to extend unknown schema '" + schema['extends'] + "'");
          return;
        }
        schema['extends'] = this.schemas[extendedType];
      }

      if(schema.properties) {
        for(var key in schema.properties) {
          if(schema.properties[key].format == 'id') {
            this.typeIdKeys[type] = key;
            break;
          }
        }
      }

      this.types[alias] = type;
      this.typeAliases[type] = alias;
      this.schemas[type] = schema;
    },

    // Method: validateObject
    //
    // Validate an object with it's schema.
    //
    // Parameters:
    //   object - the object to validate
    //   alias  - (optional) the type-alias to use, in case the object doesn't have a @context attribute.
    //
    // Returns:
    //   null   - when the object is valid
    //   array of errors - when validation fails.
    //
    // The errors are objects of the form:
    // (start code)
    // { "property": "foo", "message": "is named badly" }
    // (end code)
    //
    validateObject: function(object, alias) {
      var type = object['@context'];
      if(! type) {
        if(alias) {
          type = this.resolveType(alias);
        } else {
          return [{"property":"@context","message":"missing"}];
        }
      }
      var schema = this.resolveSchema(type);
      var result = validate(object, schema);

      return result.valid ? null : result.errors;
    },

    // Method: uuid
    //
    // Generates a Universally Unique IDentifuer and returns it.
    //
    // The UUID is prefixed with the string 'uuid:', to become a valid URI.
    uuid: function() {
      return 'uuid:' + MathUUID.uuid();
    },

    _verifyPath: function(path, options) {
      if(typeof(path) !== 'string') {
        throw "Invalid path: expected a string!";
      }
      if(options.rel && path[0] == '/') {
        throw "Invalid path: must be relative!";
      } else if(options.abs) {
        throw "Invalid path: must be absolute!";
      }
      if(typeof(options.dir) !== 'undefined') {
        var isDir = (util.isDir(path) || path === (options.rel ? '' : '/'));
        if(options.dir && !isDir) {
          throw "Invalid path: must be a directory!";
        } else if( !options.dir && isDir) {
          throw "Invalid paht: may not be a directory!";
        }
      }
    }

  };

  util.extend(BaseClient, globalEvents);

  BaseClient.setCaching = function(_caching) {
    caching = _caching;
  };

  return BaseClient;

});

/** THIS FILE WAS GENERATED BY build/compile-assets.js. DO NOT CHANGE IT MANUALLY, BUT INSTEAD CHANGE THE ASSETS IN assets/. **/
define('lib/assets',[], function() {
  return {
    disconnectIcon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4wIgogICB3aWR0aD0iMTYiCiAgIGhlaWdodD0iMTYiCiAgIGlkPSJzdmcyNDAzIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjQ4LjMuMSByOTg4NiIKICAgc29kaXBvZGk6ZG9jbmFtZT0ibG9nb3V0LnN2ZyIKICAgaW5rc2NhcGU6ZXhwb3J0LWZpbGVuYW1lPSJsb2dvdXQucG5nIgogICBpbmtzY2FwZTpleHBvcnQteGRwaT0iOTAiCiAgIGlua3NjYXBlOmV4cG9ydC15ZHBpPSI5MCI+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxMjE1IgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9Ijc3NiIKICAgICBpZD0ibmFtZWR2aWV3MzA0NyIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMTIuNjM5NTM0IgogICAgIGlua3NjYXBlOmN4PSIxMy45MzQ0MjMiCiAgICAgaW5rc2NhcGU6Y3k9IjcuODIyNzQyNCIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iNjUiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjI0IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnMjQwMyIgLz4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGExNSI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGUgLz4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGRlZnMKICAgICBpZD0iZGVmczI0MDUiPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICB4MT0iMTEuNjQ0MDY4IgogICAgICAgeTE9IjIuNDk4ODY3OCIKICAgICAgIHgyPSIxMS42NDQwNjgiCiAgICAgICB5Mj0iMTUuMDAyODEiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQyMzkyIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzY3OCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxLjAwMDAwMDEsMS4xOTIwOTI4ZS04KSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgeDE9IjguNDk2NDc3MSIKICAgICAgIHkxPSItMC4wNjE1NzM3NTkiCiAgICAgICB4Mj0iOC40OTY0NzcxIgogICAgICAgeTI9IjguMDgzMjA5IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MjM5NSIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM2NzgiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMS4wNTI2MzE2LDAsMCwwLjk4NDM2MjUsMC41Nzg5NDcsMC4wNjAyNDI4MSkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM2NzgiPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDM2ODAiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmZmZmY7c3RvcC1vcGFjaXR5OjEiCiAgICAgICAgIG9mZnNldD0iMCIgLz4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3AzNjgyIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZTZlNmU2O3N0b3Atb3BhY2l0eToxIgogICAgICAgICBvZmZzZXQ9IjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzNjc4IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50Mzg3OSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLjA1MjYzMTYsMCwwLDAuOTg0MzYyNSwwLjU3ODk0NywwLjA2MDI0MjgxKSIKICAgICAgIHgxPSI4LjQ5NjQ3NzEiCiAgICAgICB5MT0iLTAuMDYxNTczNzU5IgogICAgICAgeDI9IjguNDk2NDc3MSIKICAgICAgIHkyPSI4LjA4MzIwOSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzY3OCIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM5MDgiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS4wMDAwMDAxLDEuMTkyMDkyOGUtOCkiCiAgICAgICB4MT0iMTEuNjQ0MDY4IgogICAgICAgeTE9IjIuNDk4ODY3OCIKICAgICAgIHgyPSIxMS42NDQwNjgiCiAgICAgICB5Mj0iMTUuMDAyODEiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM2NzgiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzOTE0IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEuMDUyNjMxNiwwLDAsMC45ODQzNjI1LDAuNTc4OTQ3LDAuMDYwMjQyODEpIgogICAgICAgeDE9IjguNDk2NDc3MSIKICAgICAgIHkxPSItMC4wNjE1NzM3NTkiCiAgICAgICB4Mj0iOC40OTY0NzcxIgogICAgICAgeTI9IjguMDgzMjA5IiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzNjc4IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzkxNiIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxLjAwMDAwMDEsMS4xOTIwOTI4ZS04KSIKICAgICAgIHgxPSIxMS42NDQwNjgiCiAgICAgICB5MT0iMi40OTg4Njc4IgogICAgICAgeDI9IjExLjY0NDA2OCIKICAgICAgIHkyPSIxNS4wMDI4MSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzY3OCIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM5MTkiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS4wMDAwMDAxLDEuMTkyMDkyOGUtOCkiCiAgICAgICB4MT0iMTEuNjQ0MDY4IgogICAgICAgeTE9IjIuNDk4ODY3OCIKICAgICAgIHgyPSIxMS42NDQwNjgiCiAgICAgICB5Mj0iMTUuMDAyODEiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM2NzgiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzOTIyIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEuMDUyNjMxNiwwLDAsMC45ODQzNjI1LDAuNTc4OTQ3LDAuMDYwMjQyODEpIgogICAgICAgeDE9IjguNDk2NDc3MSIKICAgICAgIHkxPSItMC4wNjE1NzM3NTkiCiAgICAgICB4Mj0iOC40OTY0NzcxIgogICAgICAgeTI9IjguMDgzMjA5IiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzNjc4IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzkyNSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLjA1MjYzMTYsMCwwLDAuOTg0MzYyNSwwLjU3ODk0NywwLjA2MDI0MjgxKSIKICAgICAgIHgxPSI4LjQ5NjQ3NzEiCiAgICAgICB5MT0iLTAuMDYxNTczNzU5IgogICAgICAgeDI9IjguNDk2NDc3MSIKICAgICAgIHkyPSIxNS4yMTY2NzQiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM2NzgiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzOTQyIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEuMDUyNjMxNiwwLDAsMC45ODQzNjI1LC0wLjQyMDk4OTY0LDAuMDYwMjQyODEpIgogICAgICAgeDE9IjguNDk2NDc3MSIKICAgICAgIHkxPSItMC4wNjE1NzM3NTkiCiAgICAgICB4Mj0iOC40OTY0NzcxIgogICAgICAgeTI9IjE1LjIxNjY3NCIgLz4KICA8L2RlZnM+CiAgPHBhdGgKICAgICBzb2RpcG9kaTpub2RldHlwZXM9InNjY3NjY3NjY3Nzc2NzY3Nzc2NzY2MiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICBzdHlsZT0iZm9udC1zaXplOm1lZGl1bTtmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO3RleHQtaW5kZW50OjA7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWRlY29yYXRpb246bm9uZTtsaW5lLWhlaWdodDpub3JtYWw7bGV0dGVyLXNwYWNpbmc6bm9ybWFsO3dvcmQtc3BhY2luZzpub3JtYWw7dGV4dC10cmFuc2Zvcm06bm9uZTtkaXJlY3Rpb246bHRyO2Jsb2NrLXByb2dyZXNzaW9uOnRiO3dyaXRpbmctbW9kZTpsci10Yjt0ZXh0LWFuY2hvcjpzdGFydDtiYXNlbGluZS1zaGlmdDpiYXNlbGluZTtjb2xvcjojMDAwMDAwO2ZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MjttYXJrZXI6bm9uZTt2aXNpYmlsaXR5OnZpc2libGU7ZGlzcGxheTppbmxpbmU7b3ZlcmZsb3c6dmlzaWJsZTtlbmFibGUtYmFja2dyb3VuZDphY2N1bXVsYXRlO2ZvbnQtZmFtaWx5OlNhbnM7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjpTYW5zIgogICAgIGQ9Im0gOC4wMDAwNjM0LDAgYyAtMC40NzE0MDQ1LDAgLTAuOTYxMDMwNCwwLjU0MTkwMjMgLTAuOTUsMSBsIDAsNiBjIC0wLjAwNzQ3LDAuNTI4MzEyNiAwLjQyMTYzNDYsMSAwLjk1LDEgMC41MjgzNjU0LDAgMC45NTc0NzIsLTAuNDcxNjg3NCAwLjk1LC0xIGwgMCwtNiBjIDAuMDE0NjIyLC0wLjYwNTEwNSAtMC40Nzg1OTU1LC0xIC0wLjk1LC0xIHogbSAtMy4zNDM3NSwyLjUgYyAtMC4wODcxODYsMC4wMTkyOTQgLTAuMTcxNjI1MSwwLjA1MDk1OSAtMC4yNSwwLjA5Mzc1IC0yLjk5OTQ5OTksMS41NzE1MTMzIC0zLjkxODQyODc0LDQuNzk3ODU2NiAtMy4xMjUsNy40Njg3NSBDIDIuMDc0NzQyMSwxMi43MzMzOTMgNC41NjExNzI1LDE1IDcuOTY4ODEzNCwxNSAxMS4zMjc4MzMsMTUgMTMuODQ2MjA0LDEyLjg1MDU2MiAxNC42ODc1NjMsMTAuMjE4NzUgMTUuNTI4OTIyLDcuNTg2OTM3OCAxNC42MzAzNjMsNC4zOTU1NjM4IDExLjU2MjU2MywyLjYyNSAxMS4xMjg5NTcsMi4zNzEzNjM5IDEwLjUwMzY2MSwyLjUzNTEyMiAxMC4yNTAwMzgsMi45Njg3MzU2IDkuOTk2NDE1NCwzLjQwMjM0OTEgMTAuMTYwMTkyLDQuMDI3NjQwMSAxMC41OTM4MTMsNC4yODEyNSBjIDIuMzkwNzkzLDEuMzc5ODMxMSAyLjg4MjQ1MiwzLjQ5NDQxMDkgMi4yODEyNSw1LjM3NSAtMC42MDEyMDIsMS44ODA1ODkgLTIuMzQ0MDM3LDMuNDM3NSAtNC45MDYyNDk2LDMuNDM3NSAtMi41NzU5MjMsMCAtNC4yOTc2MzQsLTEuNjUwMTgxIC00Ljg3NSwtMy41OTM3NSBDIDIuNTE2NDQ3NCw3LjU1NjQzMTMgMy4wNDY5NTE5LDUuNDUxODg4IDUuMjgxMzEzNCw0LjI4MTI1IDUuNjU5OTY1OSw0LjA3NDg4ODcgNS44NjAzNzExLDMuNTg4NzA2NyA1LjczNzEyMjIsMy4xNzU0NjA1IDUuNjEzODczNCwyLjc2MjIxNDQgNS4xNzk4OTM3LDIuNDY1MjM0OSA0Ljc1MDA2MzQsMi41IDQuNzE4ODM4NCwyLjQ5ODQ2IDQuNjg3NTM4NCwyLjQ5ODQ2IDQuNjU2MzEzNCwyLjUgeiIKICAgICBpZD0icGF0aDM3ODEiIC8+Cjwvc3ZnPgo=',
    connectIcon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB3aWR0aD0iMTYiCiAgIGhlaWdodD0iMTYiCiAgIGlkPSJzdmczODc1IgogICB2ZXJzaW9uPSIxLjEiCiAgIGlua3NjYXBlOnZlcnNpb249IjAuNDguMy4xIHI5ODg2IgogICBzb2RpcG9kaTpkb2NuYW1lPSJ1cGxvYWQuc3ZnIgogICBpbmtzY2FwZTpleHBvcnQtZmlsZW5hbWU9Ii9ob21lL3VzZXIvb3duY2xvdWQvY29yZS9pbWcvYWN0aW9ucy91cGxvYWQtd2hpdGUucG5nIgogICBpbmtzY2FwZTpleHBvcnQteGRwaT0iOTAiCiAgIGlua3NjYXBlOmV4cG9ydC15ZHBpPSI5MCI+CiAgPGRlZnMKICAgICBpZD0iZGVmczM4NzciIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJiYXNlIgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxLjAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnpvb209IjQuNDgwNDY4OCIKICAgICBpbmtzY2FwZTpjeD0iMjkuNDk1OTk1IgogICAgIGlua3NjYXBlOmN5PSIxOC43MzQ3MTIiCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9InB4IgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIKICAgICBzaG93Z3JpZD0idHJ1ZSIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjEyMTUiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iNzc2IgogICAgIGlua3NjYXBlOndpbmRvdy14PSI2NSIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMjQiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSI+CiAgICA8aW5rc2NhcGU6Z3JpZAogICAgICAgdHlwZT0ieHlncmlkIgogICAgICAgaWQ9ImdyaWQzODgzIgogICAgICAgZW1wc3BhY2luZz0iNSIKICAgICAgIHZpc2libGU9InRydWUiCiAgICAgICBlbmFibGVkPSJ0cnVlIgogICAgICAgc25hcHZpc2libGVncmlkbGluZXNvbmx5PSJ0cnVlIiAvPgogIDwvc29kaXBvZGk6bmFtZWR2aWV3PgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTM4ODAiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgICAgPGRjOnRpdGxlPjwvZGM6dGl0bGU+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxnCiAgICAgaW5rc2NhcGU6bGFiZWw9IkxheWVyIDEiCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgICBpZD0ibGF5ZXIxIgogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTEwMzYuMzYyMikiPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiCiAgICAgICBkPSJtIDEsMTA0Ny4zNjIyIDAsLTYgNywwIDAsLTQgNyw3IC03LDcgMCwtNCB6IgogICAgICAgaWQ9InBhdGgzMDg2IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2NjY2MiIC8+CiAgPC9nPgo8L3N2Zz4K',
    remoteStorageIconError: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgd2lkdGg9IjMyIgogICBoZWlnaHQ9IjMyIgogICBpZD0ic3ZnMiIKICAgdmVyc2lvbj0iMS4xIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjQ4LjMuMSByOTg4NiIKICAgc29kaXBvZGk6ZG9jbmFtZT0icmVtb3Rlc3RvcmFnZUljb25FcnJvcjIuc3ZnIgogICBpbmtzY2FwZTpleHBvcnQtZmlsZW5hbWU9Ii9ob21lL3VzZXIvcmVtb3Rlc3RvcmFnZS1pY29uLWVycm9yLnBuZyIKICAgaW5rc2NhcGU6ZXhwb3J0LXhkcGk9IjkwIgogICBpbmtzY2FwZTpleHBvcnQteWRwaT0iOTAiPgogIDxkZWZzCiAgICAgaWQ9ImRlZnM0Ij4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDAzMyI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNlMjIxYjc7c3RvcC1vcGFjaXR5OjAuNzQ2MTUzODM7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wNDAzNSIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2UyMjFiNztzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3A0MDM3IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDU3NSI+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDU3NyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwO3N0b3Atb3BhY2l0eTowLjczODQ2MTU1OyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0NTc5IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwMDA7c3RvcC1vcGFjaXR5OjE7IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDA4NCI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjAuODMxMzcyNTY7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wNDA4NiIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6Izc1ZGQyNjtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3A0MDg4IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDA0NCI+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDA0NiIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eTowLjgzMTM3MjU2OyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ4IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMyMTliZTI7c3RvcC1vcGFjaXR5OjE7IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzMyI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjkxMDA7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzgzNSIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2M0NmYwMDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzODM3IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxpbmtzY2FwZTpwZXJzcGVjdGl2ZQogICAgICAgc29kaXBvZGk6dHlwZT0iaW5rc2NhcGU6cGVyc3AzZCIKICAgICAgIGlua3NjYXBlOnZwX3g9IjAgOiA1MjYuMTgxMDkgOiAxIgogICAgICAgaW5rc2NhcGU6dnBfeT0iMCA6IDEwMDAgOiAwIgogICAgICAgaW5rc2NhcGU6dnBfej0iNzQ0LjA5NDQ4IDogNTI2LjE4MTA5IDogMSIKICAgICAgIGlua3NjYXBlOnBlcnNwM2Qtb3JpZ2luPSIzNzIuMDQ3MjQgOiAzNTAuNzg3MzkgOiAxIgogICAgICAgaWQ9InBlcnNwZWN0aXZlMjk4NSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzMy0xIj4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmOTEwMDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzODM1LTciIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNjNDZmMDA7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgeTI9IjAiCiAgICAgICB4Mj0iMTI4IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgxPSIxMjgiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM4OTAiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEiCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzOS0wLTIiCiAgICAgICB4MT0iMTI4IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMjgiCiAgICAgICB5Mj0iMCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEtNCI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNlOTAwMDA7c3RvcC1vcGFjaXR5OjAuNzYwNzg0MzM7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzgzNS03LTgiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNlOTAwMDA7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTAiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNyIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM4MzktMC04IgogICAgICAgeDE9IjEzOS42MzYzNyIKICAgICAgIHkxPSIxMTIiCiAgICAgICB4Mj0iMTM5LjYzNjM3IgogICAgICAgeTI9IjMyIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNjg3NSwwLDAsMSwzMiw3OTYuMzYyMTgpIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEtNyI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjkxMDA7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzgzNS03LTMiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNjNDZmMDA7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTIiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC0yIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzOS0wLTMiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjY4NzUsMCwwLDEsMzIsNzk2LjM2MjE4KSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzMy0xLTQtMiI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjkzMDQ7c3RvcC1vcGFjaXR5OjAuODMwNzY5MjQ7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzgzNS03LTgtMSIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmOTMwNDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzODM3LTctMC0wIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgeTI9Ii0wLjk5NDg1NDY5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC4zNDM3NSwtMC41OTUzOTI0NywwLjg2NjAyNTQsLTAuNSw2NS4xNDg3NDgsMTA3MS41MDA2KSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDAyNS01IgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA0NC0zIgogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDQ0LTMiPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQwNDYtNCIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMDQ4YmZmO3N0b3Atb3BhY2l0eTowLjgzMTM3MjU2OyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ4LTciCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzA0OGJmZjtzdG9wLW9wYWNpdHk6MTsiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC01IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzOS0wLTg5IgogICAgICAgeDE9IjEzOS42MzYzNyIKICAgICAgIHkxPSIxMjgiCiAgICAgICB4Mj0iMTM5LjYzNjM3IgogICAgICAgeTI9IjEuMTM2ODY4NGUtMTMiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC42ODc1LDAsMCwxLDMyLDc5Ni4zNjIxOCkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM4MzMtMS00LTUiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY0YTA0O3N0b3Atb3BhY2l0eTowLjgzMDc2OTI0OyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDM4MzUtNy04LTIiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTAtMiIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNDQtOSI+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDA0Ni0zIgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMyMTliZTI7c3RvcC1vcGFjaXR5OjAuODMxMzcyNTY7IiAvPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQwNDgtOCIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eToxOyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwODQtNyI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjAuODMxMzcyNTY7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wNDA4Ni02IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNzVkZDI2O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDQwODgtNSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTUiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MTU5IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0wLjY4NzUsMCwwLC0xLDIyNCwxMDIwLjM2MjIpIgogICAgICAgeDE9IjEzOS42MzYzNyIKICAgICAgIHkxPSIxMjgiCiAgICAgICB4Mj0iMTM5LjYzNjM3IgogICAgICAgeTI9IjEuMTM2ODY4NGUtMTMiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwNDQtOSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQxNjEiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwwLjU5NTM5MjQ3LC0wLjg2NjAyNTQsMC41LDE5MC44NTEyNSw3NDUuMjIzNzYpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NDY5IiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTciCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MTYzIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0wLjM0Mzc1LDAuNTk1MzkyNDcsMC44NjYwMjU0LDAuNSw2NS4xNDg3NSw3NDUuMjIzNzYpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NjQyIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNCIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQxNzAiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC42ODc1LDAsMCwxLDMyLDc5Ni4zNjIxOCkiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA0NCIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQxNzIiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsLTAuNTk1MzkyNDcsMC44NjYwMjU0LC0wLjUsNjUuMTQ4NzQ4LDEwNzEuNTAwNikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MTc0IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsLTAuNTk1MzkyNDcsLTAuODY2MDI1NCwtMC41LDE5MC44NTEyNSwxMDcxLjUwMDYpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NjQyIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEtNC00Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MC44MzA3NjkyNDsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzODM1LTctOC01IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY0YTA0O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDM4MzctNy0wLTciIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDQ0LTIiPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQwNDYtNyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eTowLjgzMTM3MjU2OyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ4LTQiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzIxOWJlMjtzdG9wLW9wYWNpdHk6MTsiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTYiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MTc0LTIiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwtMC41OTUzOTI0NywtMC44NjYwMjU0LC0wLjUsMTkwLjg1MTI1LDEwNzEuNTAwNikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwODQtNiI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjAuODMxMzcyNTY7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wNDA4Ni0wIiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNzVkZDI2O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDQwODgtOSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyNTMtOSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjY4NzUsMCwwLDEsMTc2LDgyOC4zNjIxOCkiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzMy0xLTQtNC01Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MC44MzA3NjkyNDsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzODM1LTctOC01LTIiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTAtNy00IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA0NC0yLTkiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MjU1LTciCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsLTAuNTk1MzkyNDcsMC44NjYwMjU0LC0wLjUsMjA5LjE0ODc1LDExMDMuNTAwNikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNDQtMi05Ij4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ2LTctNyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eTowLjgzMTM3MjU2OyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ4LTQtNSIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eToxOyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQtNi01IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDI1Ny00IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsLTAuNTk1MzkyNDcsLTAuODY2MDI1NCwtMC41LDMzNC44NTEyNSwxMTAzLjUwMDYpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NjQyIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDg0LTYtNSI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjAuODMxMzcyNTY7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wNDA4Ni0wLTkiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wNDA4OC05LTMiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsLTAuNTk1MzkyNDcsLTAuODY2MDI1NCwtMC41LDMzNC44NTEyNSwxMTAzLjUwMDYpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MzE3IgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA4NC02LTUiCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MzU4IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNjg3NSwwLDAsMSwxNzYsODI4LjM2MjE4KSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDQ0LTIiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MzYwIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0wLjM0Mzc1LC0wLjU5NTM5MjQ3LDAuODY2MDI1NCwtMC41LDIwOS4xNDg3NSwxMTAzLjUwMDYpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NDY5IiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTYiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MzYyIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsLTAuNTk1MzkyNDcsLTAuODY2MDI1NCwtMC41LDMzNC44NTEyNSwxMTAzLjUwMDYpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NjQyIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC00LTYiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MzU4LTciCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC42ODc1LDAsMCwxLDE3Niw4MjguMzYyMTgpIgogICAgICAgeDE9IjEzOS42MzYzNyIKICAgICAgIHkxPSIxMjgiCiAgICAgICB4Mj0iMTM5LjYzNjM3IgogICAgICAgeTI9IjEuMTM2ODY4NGUtMTMiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNiI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjAuODMwNzY5MjQ7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzgzNS03LTgtNS05IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY0YTA0O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDM4MzctNy0wLTctMCIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwNDQtMi04IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDM2MC00IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0wLjM0Mzc1LC0wLjU5NTM5MjQ3LDAuODY2MDI1NCwtMC41LDIwOS4xNDg3NSwxMTAzLjUwMDYpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NDY5IiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDQ0LTItOCI+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDA0Ni03LTMiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzIxOWJlMjtzdG9wLW9wYWNpdHk6MC44MzEzNzI1NjsiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDA0OC00LTYiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzIxOWJlMjtzdG9wLW9wYWNpdHk6MTsiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTYtNiIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQzNjItNCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjM0Mzc1LC0wLjU5NTM5MjQ3LC0wLjg2NjAyNTQsLTAuNSwzMzQuODUxMjUsMTEwMy41MDA2KSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTY0MiIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDA4NC02LTYiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNzVkZDI2O3N0b3Atb3BhY2l0eTowLjgzMTM3MjU2OyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDQwODYtMC0wIiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNzVkZDI2O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDQwODgtOS04IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNC01LTkiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MjUzLTktNiIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjY4NzUsMCwwLDEsMTc2LDgyOC4zNjIxOCkiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzMy0xLTQtNC01LTkiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY0YTA0O3N0b3Atb3BhY2l0eTowLjgzMDc2OTI0OyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDM4MzUtNy04LTUtMi03IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY0YTA0O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDM4MzctNy0wLTctNC0zIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA0NC0yLTktMyIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyNTUtNy0xIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0wLjM0Mzc1LC0wLjU5NTM5MjQ3LDAuODY2MDI1NCwtMC41LDIwOS4xNDg3NSwxMTAzLjUwMDYpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NDY5IiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDQ0LTItOS0zIj4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ2LTctNy01IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMyMTliZTI7c3RvcC1vcGFjaXR5OjAuODMxMzcyNTY7IiAvPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQwNDgtNC01LTMiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzIxOWJlMjtzdG9wLW9wYWNpdHk6MTsiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsLTAuNTk1MzkyNDcsLTAuODY2MDI1NCwtMC41LDMzNC44NTEyNSwxMTAzLjUwMDYpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MzE3LTgiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTYtNS01IgogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDg0LTYtNS01Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6Izc1ZGQyNjtzdG9wLW9wYWNpdHk6MC44MzEzNzI1NjsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3A0MDg2LTAtOS02IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNzVkZDI2O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDQwODgtOS0zLTMiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsLTAuNTk1MzkyNDcsLTAuODY2MDI1NCwtMC41LDMzNC44NTEyNSwxMTAzLjUwMDYpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0NDM0IgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA4NC02LTUtNSIKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA4NC02LTYiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0NTA4IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsLTAuNTk1MzkyNDcsLTAuODY2MDI1NCwtMC41LDcwMi44NTEyNSwxMDcxLjUwMDUpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NjQyIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDQ0LTItOCIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQ1MTEiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsLTAuNTk1MzkyNDcsMC44NjYwMjU0LC0wLjUsNTc3LjE0ODc1LDEwNzEuNTAwNSkiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNiIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQ1MTQiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC42ODc1LDAsMCwxLDU0NCwtNmUtNSkiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNC02IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDUxNyIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjY4NzUsMCwwLDEsNTg0LDc5Ni4zNjIxMikiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA4NC02LTUtNSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQ1MjAiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsMC41OTUzOTI0NywwLjg2NjAyNTQsMC41LDU3Ny4xNDg3NSw3NzcuMjIzOCkiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwNDQtMi05LTMiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0NTIzIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsMC41OTUzOTI0NywtMC44NjYwMjU0LDAuNSw3MDIuODUxMjUsNzc3LjIyMzgpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NDY5IiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC00LTUtOSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQ1MjYiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuNjg3NSwwLDAsLTEsNzM2LDI1Ni4wMDAwMikiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNC01LTkiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0NTI5IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0wLjY4NzUsMCwwLC0xLDc3NiwxMDUyLjM2MjIpIgogICAgICAgeDE9IjEzOS42MzYzNyIKICAgICAgIHkxPSIxMjgiCiAgICAgICB4Mj0iMTM5LjYzNjM3IgogICAgICAgeTI9IjEuMTM2ODY4NGUtMTMiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNiIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQ1MzIiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC42ODc1LDAsMCwxLDU2NCw3OTYuMzYyMTIpIgogICAgICAgeDE9IjEzOS42MzYzNyIKICAgICAgIHkxPSIxMjgiCiAgICAgICB4Mj0iMTM5LjYzNjM3IgogICAgICAgeTI9IjEuMTM2ODY4NGUtMTMiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNS05IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDUzNCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC42ODc1LDAsMCwtMSw3NTYsMjU2LjAwMDAyKSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC00LTUtOSIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDQ1MzkiCiAgICAgICBjeD0iNjYwIgogICAgICAgY3k9IjEyOCIKICAgICAgIGZ4PSI2NjAiCiAgICAgICBmeT0iMTI4IgogICAgICAgcj0iMTEyIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwxLjE0Mjg1NzEsNjAsNzEwLjA3NjUyKSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiAvPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC00LTUtOS04IgogICAgICAgaWQ9InJhZGlhbEdyYWRpZW50NDUzOS03IgogICAgICAgY3g9IjY2MCIKICAgICAgIGN5PSIxMjgiCiAgICAgICBmeD0iNjYwIgogICAgICAgZnk9IjEyOCIKICAgICAgIHI9IjExMiIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsMS4xNDI4NTcxLC0yMCw3NzguMDc2NDcpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNS05LTgiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY0YTA0O3N0b3Atb3BhY2l0eTowLjgzMDc2OTI0OyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDM4MzUtNy04LTUtMi03LTkiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTAtNy00LTMtOCIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIHI9IjExMiIKICAgICAgIGZ5PSIxMjgiCiAgICAgICBmeD0iNjYwIgogICAgICAgY3k9IjEyOCIKICAgICAgIGN4PSI2NjAiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLDEuMTQyODU3MSwxNiwzMzAuMDc2NTIpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQ0NTU2IgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDU3NSIKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIgLz4KICAgIDxyYWRpYWxHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNC01LTktMSIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDQ1MzktMCIKICAgICAgIGN4PSI2NjAiCiAgICAgICBjeT0iMTI4IgogICAgICAgZng9IjY2MCIKICAgICAgIGZ5PSIxMjgiCiAgICAgICByPSIxMTIiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLDEuMTQyODU3MSwtMjAsNzc4LjA3NjQ3KSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEtNC00LTUtOS0xIj4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MC44MzA3NjkyNDsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzODM1LTctOC01LTItNy02IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY0YTA0O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDM4MzctNy0wLTctNC0zLTAiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICByPSIxMTIiCiAgICAgICBmeT0iMTI4IgogICAgICAgZng9IjY2MCIKICAgICAgIGN5PSIxMjgiCiAgICAgICBjeD0iNjYwIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjEyNDk5OTk5LDAsMCwwLjE0Mjg1NzEzLDc5Ny41LDY3OC4wNzY1MikiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDQ1NTYtMyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQ1NzUtMiIKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDU3NS0yIj4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0NTc3LTYiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzgxODE4MTtzdG9wLW9wYWNpdHk6MC44MzA3NjkyNDsiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDU3OS00IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3MDcwNzA7c3RvcC1vcGFjaXR5OjE7IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudAogICAgICAgcj0iMTEyIgogICAgICAgZnk9IjEyOCIKICAgICAgIGZ4PSI2NjAiCiAgICAgICBjeT0iMTI4IgogICAgICAgY3g9IjY2MCIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4xMjQ5OTk5OSwwLDAsMC4xNDI4NTcxMyw3MzMuNTAwMDEsNjc4LjA3NjUyKSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgaWQ9InJhZGlhbEdyYWRpZW50NDYwMSIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNS05LTEiCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiIC8+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIHI9IjExMiIKICAgICAgIGZ5PSIxMjgiCiAgICAgICBmeD0iNjYwIgogICAgICAgY3k9IjEyOCIKICAgICAgIGN4PSI2NjAiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLDEuMTQyODU3MSwyMzYsNzc4LjA3NjQ3KSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgaWQ9InJhZGlhbEdyYWRpZW50NDU1Ni01IgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDU3NS0zIgogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0NTc1LTMiPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQ1NzctOSIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojODE4MTgxO3N0b3Atb3BhY2l0eTowLjgzMDc2OTI0OyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0NTc5LTgiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzcwNzA3MDtzdG9wLW9wYWNpdHk6MTsiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICByPSIxMTIiCiAgICAgICBmeT0iMTI4IgogICAgICAgZng9IjY2MCIKICAgICAgIGN5PSIxMjgiCiAgICAgICBjeD0iNjYwIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjEyNDk5OTk5LDAsMCwwLjE0Mjg1NzEzLDgyOS41MDAwMSw2NzguMDc2NTIpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQ0NjQ1IgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDU3NS0zIgogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIiAvPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICByPSIxMTIiCiAgICAgICBmeT0iMTI4IgogICAgICAgZng9IjY2MCIKICAgICAgIGN5PSIxMjgiCiAgICAgICBjeD0iNjYwIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwxLjE0Mjg1NzEsMjM2LDc3OC4wNzY0NykiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDQ1NTYtOCIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQ1NzUtMSIKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDU3NS0xIj4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0NTc3LTIiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzAwMDAwMDtzdG9wLW9wYWNpdHk6MC43Mzg0NjE1NTsiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDU3OS0yIgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwMDA7c3RvcC1vcGFjaXR5OjE7IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDE3IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNjg3NSwwLDAsMSwzMiw3OTYuMzYyMTgpIgogICAgICAgeDE9IjEzOS42MzYzNyIKICAgICAgIHkxPSIxMjgiCiAgICAgICB4Mj0iMTM5LjYzNjM3IgogICAgICAgeTI9IjEuMTM2ODY4NGUtMTMiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwNDQiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDE5IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0wLjM0Mzc1LC0wLjU5NTM5MjQ3LDAuODY2MDI1NCwtMC41LDY1LjE0ODc0OCwxMDcxLjUwMDYpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NDY5IiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDAyMSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjM0Mzc1LC0wLjU5NTM5MjQ3LC0wLjg2NjAyNTQsLTAuNSwxOTAuODUxMjUsMTA3MS41MDA2KSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTY0MiIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNC01OSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQzNTgtMyIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjY4NzUsMCwwLDEsMTc2LDgyOC4zNjIxOCkiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzMy0xLTQtNC01OSI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjAuODMwNzY5MjQ7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzgzNS03LTgtNS02IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY0YTA0O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDM4MzctNy0wLTctNSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwNDQtMi0zIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDM2MC02IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0wLjM0Mzc1LC0wLjU5NTM5MjQ3LDAuODY2MDI1NCwtMC41LDIwOS4xNDg3NSwxMTAzLjUwMDYpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NDY5IiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDQ0LTItMyI+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDA0Ni03LTAiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzIxOWJlMjtzdG9wLW9wYWNpdHk6MC44MzEzNzI1NjsiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDA0OC00LTIiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzIxOWJlMjtzdG9wLW9wYWNpdHk6MTsiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTYtNyIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQzNjItMCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjM0Mzc1LC0wLjU5NTM5MjQ3LC0wLjg2NjAyNTQsLTAuNSwzMzQuODUxMjUsMTEwMy41MDA2KSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTY0MiIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDA4NC02LTciPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNzVkZDI2O3N0b3Atb3BhY2l0eTowLjgzMTM3MjU2OyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDQwODYtMC00IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNzVkZDI2O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDQwODgtOS03IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNC01LTAiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MjUzLTktMyIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjY4NzUsMCwwLDEsMTc2LDgyOC4zNjIxOCkiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzMy0xLTQtNC01LTAiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY0YTA0O3N0b3Atb3BhY2l0eTowLjgzMDc2OTI0OyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDM4MzUtNy04LTUtMi0xIiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY0YTA0O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDM4MzctNy0wLTctNC02IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA0NC0yLTktNSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyNTUtNy03IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0wLjM0Mzc1LC0wLjU5NTM5MjQ3LDAuODY2MDI1NCwtMC41LDIwOS4xNDg3NSwxMTAzLjUwMDYpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NDY5IiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDQ0LTItOS01Ij4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ2LTctNy03IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMyMTliZTI7c3RvcC1vcGFjaXR5OjAuODMxMzcyNTY7IiAvPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQwNDgtNC01LTgiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzIxOWJlMjtzdG9wLW9wYWNpdHk6MTsiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsLTAuNTk1MzkyNDcsLTAuODY2MDI1NCwtMC41LDMzNC44NTEyNSwxMTAzLjUwMDYpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MzE3LTg5IgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA4NC02LTUtMCIKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDA4NC02LTUtMCI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjAuODMxMzcyNTY7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wNDA4Ni0wLTktNyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6Izc1ZGQyNjtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3A0MDg4LTktMy04IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzMy0xLTQtMyI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjAuNzQ1MDk4MDU7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzgzNS03LTgtMTAiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTAtMyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNDQtNyI+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDA0Ni0zMiIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eTowLjc0NTA5ODA1OyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ4LTIiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzIxOWJlMjtzdG9wLW9wYWNpdHk6MTsiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDg0LTUiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNzVkZDI2O3N0b3Atb3BhY2l0eTowLjc0NTA5ODA1OyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDQwODYtMyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6Izc1ZGQyNjtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3A0MDg4LTMiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEtNC01LTIiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNTkwNGZmO3N0b3Atb3BhY2l0eTowLjc0NTA5ODA1OyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDM4MzUtNy04LTItOCIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzU5MDRmZjtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzODM3LTctMC0yLTUiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDQ0LTktMCI+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDA0Ni0zLTgiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzIxOWJlMjtzdG9wLW9wYWNpdHk6MC44MzEzNzI1NjsiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDA0OC04LTYiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzIxOWJlMjtzdG9wLW9wYWNpdHk6MTsiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTctMyIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQxNjMtOSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC4zNDM3NSwwLjU5NTM5MjQ3LDAuODY2MDI1NCwwLjUsNjUuMTQ4NzUsNzQ1LjIyMzc2KSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTY0MiIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDA4NC03LTMiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZDJkZDI2O3N0b3Atb3BhY2l0eTowLjc0NTA5ODA1OyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDQwODYtNi0zIiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZDJkZDI2O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDQwODgtNS03IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA4NC02LTciCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MjM1IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsLTAuNTk1MzkyNDcsLTAuODY2MDI1NCwtMC41LDUyNi44NTEyNSwxMjkxLjUwMDcpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NjQyIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDQ0LTItMyIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyMzgiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsLTAuNTk1MzkyNDcsMC44NjYwMjU0LC0wLjUsNDAxLjE0ODc1LDEyOTEuNTAwNykiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNTkiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MjQxIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNjg3NSwwLDAsMSwzNTIsNDAzLjk5OTk5KSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC00LTU5IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDI0NCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjY4NzUsMCwwLDEsNDY4LDEwMTYuMzYyMikiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA4NC02LTUtMCIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyNDciCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsMC41OTUzOTI0NywwLjg2NjAyNTQsMC41LDQwMS4xNDg3NSw5OTcuMjIzOSkiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwNDQtMi05LTUiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MjUwIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsMC41OTUzOTI0NywtMC44NjYwMjU0LDAuNSw1MjYuODUxMjUsOTk3LjIyMzkpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NDY5IiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC00LTUtMCIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyNTMiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuNjg3NSwwLDAsLTEsNTQ0LDY2MC4wMDAwOSkiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA4NC02LTUiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MjU3IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0wLjM0Mzc1LDAuNTk1MzkyNDcsMC44NjYwMjU0LDAuNSw0MDEuMTQ4NzUsNzA5LjIyMzkpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NjQyIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDQ0LTItOSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyNjAiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwwLjU5NTM5MjQ3LC0wLjg2NjAyNTQsMC41LDUyNi44NTEyNSw3MDkuMjIzOSkiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyNjMiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuNjg3NSwwLDAsLTEsNTYwLDk4NC4zNjIzMikiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxyYWRpYWxHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNTIiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQ0Mzg3LTciCiAgICAgICBjeD0iMTA0Ni41MzEyIgogICAgICAgY3k9IjU3MS40MjE4OCIKICAgICAgIGZ4PSIxMDQ2LjUzMTIiCiAgICAgICBmeT0iNTcxLjQyMTg4IgogICAgICAgcj0iOTUuOTk5OTc3IgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLjE2NjY2NjksMCwwLDEuMzQ3MjUwMSwtMjQ0Ljk1MzM5LDg2LjUwNTAzNSkiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzMy0xLTQtNTIiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY0YTA0O3N0b3Atb3BhY2l0eTowLjc2MTUzODQ1OyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDM4MzUtNy04LTciIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTAtNCIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM4MzMtMS00LTMzIj4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MC43NjE1Mzg0NTsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzODM1LTctOC00IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY0YTA0O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDM4MzctNy0wLTYiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNCIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDQ1MjAiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMS4xNjY2NjY5LDAsMCwxLjM0NzI1MDEsLTI0NC45NTMzOSw4Ni41MDUwMzUpIgogICAgICAgY3g9IjEwNDYuNTMxMiIKICAgICAgIGN5PSI1NzEuNDIxODgiCiAgICAgICBmeD0iMTA0Ni41MzEyIgogICAgICAgZnk9IjU3MS40MjE4OCIKICAgICAgIHI9Ijk1Ljk5OTk3NyIgLz4KICAgIDxyYWRpYWxHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtMzMiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQ0NTIyIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEuMTY2NjY2OSwwLDAsMS4zNDcyNTAxLDEzOS4wNDY2LC0zNjAuMTQ5OTcpIgogICAgICAgY3g9IjEwNDYuNTMxMiIKICAgICAgIGN5PSI1NzEuNDIxODgiCiAgICAgICBmeD0iMTA0Ni41MzEyIgogICAgICAgZnk9IjU3MS40MjE4OCIKICAgICAgIHI9Ijk1Ljk5OTk3NyIgLz4KICAgIDxyYWRpYWxHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNTIiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQ0NTI0IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMTQ0MzI2NzMsMCwwLDAuMTY2NjY2NDIsOTA3LjEwMjIzLDg5Ny4xMjY1NikiCiAgICAgICBjeD0iMTA0Ni41MzEyIgogICAgICAgY3k9IjU3MS40MjE4OCIKICAgICAgIGZ4PSIxMDQ2LjUzMTIiCiAgICAgICBmeT0iNTcxLjQyMTg4IgogICAgICAgcj0iOTUuOTk5OTc3IiAvPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC0zMyIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDQ1MzIiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMS4xNjY2NjY5LDAsMCwxLjM0NzI1MDEsMTM5LjA0NjYsLTM2MC4xNDk5NykiCiAgICAgICBjeD0iMTA0Ni41MzEyIgogICAgICAgY3k9IjU3MS40MjE4OCIKICAgICAgIGZ4PSIxMDQ2LjUzMTIiCiAgICAgICBmeT0iNTcxLjQyMTg4IgogICAgICAgcj0iOTUuOTk5OTc3IiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTctMyIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDMyNTciCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsMC41OTUzOTI0NywwLjg2NjAyNTQsMC41LDE0NS4xNDg3NSw5OTcuMjIzODEpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NjQyIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDMzIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzI2MCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjM0Mzc1LDAuNTk1MzkyNDcsLTAuODY2MDI1NCwwLjUsMjcwLjg1MTI1LDk5Ny4yMjM4MSkiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTUtMiIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDMyNjMiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuNjg3NSwwLDAsLTEsMzA0LDEyNzIuMzYyMykiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtMyIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNTgiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC42ODc1LDAsMCwxLC0xMDgsMTAxNi4zNjIyKSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDQ0LTciCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDYwIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0wLjM0Mzc1LC0wLjU5NTM5MjQ3LDAuODY2MDI1NCwtMC41LC03NC44NTEyNTIsMTI5MS41MDA3KSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTQ2OSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA4NC01IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDA2MiIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjM0Mzc1LC0wLjU5NTM5MjQ3LC0wLjg2NjAyNTQsLTAuNSw1MC44NTEyNSwxMjkxLjUwMDcpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NjQyIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTUiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDY1IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsLTAuNTk1MzkyNDcsLTAuODY2MDI1NCwtMC41LDI3MC44NTEyNSwxMjkxLjUwMDcpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NjQyIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDQ0LTciCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDY4IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0wLjM0Mzc1LC0wLjU5NTM5MjQ3LDAuODY2MDI1NCwtMC41LDE0NS4xNDg3NSwxMjkxLjUwMDcpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NDY5IiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC0zIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDA3MSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjY4NzUsMCwwLDEsMTEyLDEwMTYuMzYyMikiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxyYWRpYWxHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtMjAiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQ0NTIwLTQiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMS4xNjY2NjY5LDAsMCwxLjM0NzI1MDEsLTI0NC45NTMzOSw4Ni41MDUwMzUpIgogICAgICAgY3g9IjEwNDYuNTMxMiIKICAgICAgIGN5PSI1NzEuNDIxODgiCiAgICAgICBmeD0iMTA0Ni41MzEyIgogICAgICAgZnk9IjU3MS40MjE4OCIKICAgICAgIHI9Ijk1Ljk5OTk3NyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzMy0xLTQtMjAiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY0YTA0O3N0b3Atb3BhY2l0eTowLjc2MTUzODQ1OyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDM4MzUtNy04LTkiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTAtNzciIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICByPSI5NS45OTk5NzciCiAgICAgICBmeT0iNTcxLjQyMTg4IgogICAgICAgZng9IjEwNDYuNTMxMiIKICAgICAgIGN5PSI1NzEuNDIxODgiCiAgICAgICBjeD0iMTA0Ni41MzEyIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLjE2NjY2NjksMCwwLDEuMzQ3MjUwMSwtMjQ0Ljk1MzM5LDg2LjUwNTAzNSkiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDQyMDgiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC0yMCIKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIgLz4KICAgIDxyYWRpYWxHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQzNjE0IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEuMTY2NjY2OSwwLDAsMS4zNDcyNTAxLDIxOS4wNDY2MSw4OS4xNjc3NTcpIgogICAgICAgY3g9IjEwNDYuNTMxMiIKICAgICAgIGN5PSI1NzEuNDIxODgiCiAgICAgICBmeD0iMTA0Ni41MzEyIgogICAgICAgZnk9IjU3MS40MjE4OCIKICAgICAgIHI9Ijk1Ljk5OTk3NyIgLz4KICAgIDxyYWRpYWxHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQzNjI1IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEuMTY2NjY2OSwwLDAsMS4zNDcyNTAxLDIxOS4wNDY2MSw4OS4xNjc3NTcpIgogICAgICAgY3g9IjEwNDYuNTMxMiIKICAgICAgIGN5PSI1NzEuNDIxODgiCiAgICAgICBmeD0iMTA0Ni41MzEyIgogICAgICAgZnk9IjU3MS40MjE4OCIKICAgICAgIHI9Ijk1Ljk5OTk3NyIgLz4KICAgIDxyYWRpYWxHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQzMjA5IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMTQ0MzI2OTksMCwwLDAuMTY2NjY2NzMsMTIwMS41MzU4LDg3Ny4xMTQ4OCkiCiAgICAgICBjeD0iMTA0Ni41MzEyIgogICAgICAgY3k9IjU3MS40MjE4OCIKICAgICAgIGZ4PSIxMDQ2LjUzMTIiCiAgICAgICBmeT0iNTcxLjQyMTg4IgogICAgICAgcj0iOTUuOTk5OTc3IiAvPgogIDwvZGVmcz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaWQ9ImJhc2UiCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEuMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6em9vbT0iMTEuMzEzNzA4IgogICAgIGlua3NjYXBlOmN4PSIxNS4yOTc1MjUiCiAgICAgaW5rc2NhcGU6Y3k9IjEwLjkzMzE1MiIKICAgICBpbmtzY2FwZTpkb2N1bWVudC11bml0cz0icHgiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ibGF5ZXIxIgogICAgIHNob3dncmlkPSJ0cnVlIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTIxNSIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSI3NzYiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjY1IgogICAgIGlua3NjYXBlOndpbmRvdy15PSIyNCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGZpdC1tYXJnaW4tdG9wPSIwIgogICAgIGZpdC1tYXJnaW4tbGVmdD0iMCIKICAgICBmaXQtbWFyZ2luLXJpZ2h0PSIwIgogICAgIGZpdC1tYXJnaW4tYm90dG9tPSIwIgogICAgIGlua3NjYXBlOnNuYXAtcGFnZT0idHJ1ZSIKICAgICBpbmtzY2FwZTpzbmFwLW5vZGVzPSJ0cnVlIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIHNob3dib3JkZXI9InRydWUiCiAgICAgc2hvd2d1aWRlcz0idHJ1ZSIKICAgICBpbmtzY2FwZTpndWlkZS1iYm94PSJ0cnVlIj4KICAgIDxpbmtzY2FwZTpncmlkCiAgICAgICB0eXBlPSJ4eWdyaWQiCiAgICAgICBpZD0iZ3JpZDMwMjEiCiAgICAgICBlbXBzcGFjaW5nPSI0IgogICAgICAgdmlzaWJsZT0idHJ1ZSIKICAgICAgIGVuYWJsZWQ9InRydWUiCiAgICAgICBzbmFwdmlzaWJsZWdyaWRsaW5lc29ubHk9InRydWUiCiAgICAgICBzcGFjaW5neD0iMTZweCIKICAgICAgIHNwYWNpbmd5PSIxNnB4IgogICAgICAgZG90dGVkPSJ0cnVlIiAvPgogIDwvc29kaXBvZGk6bmFtZWR2aWV3PgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTciPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgICAgPGRjOnRpdGxlPjwvZGM6dGl0bGU+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxnCiAgICAgaW5rc2NhcGU6bGFiZWw9IkxheWVyIDEiCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgICBpZD0ibGF5ZXIxIgogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMzM2LjU3ODUsLTk1Ni4zNTE4OSkiPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJjb2xvcjojMDAwMDAwO2ZpbGw6dXJsKCNyYWRpYWxHcmFkaWVudDMyMDkpO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lO21hcmtlcjpub25lO3Zpc2liaWxpdHk6dmlzaWJsZTtkaXNwbGF5OmlubGluZTtvdmVyZmxvdzp2aXNpYmxlO2VuYWJsZS1iYWNrZ3JvdW5kOmFjY3VtdWxhdGUiCiAgICAgICBkPSJtIDEzNTIuNTc4NSw5NTYuMzUxODkgMC4yODg2LDE1LjEzNjI5IDEzLjU2NjgsLTcuMTM1MTYgLTEzLjg1NTQsLTguMDAxMTMgeiBtIDAsMCAtMTMuODU1NCw4LjAwMTEzIDEzLjU2NjcsNy4xMzUxNiAwLjI4ODcsLTE1LjEzNjI5IHogbSAtMTMuODU1NCw4LjAwMTEzIDAsMTUuOTk3NzQgMTIuOTU3OSwtNy44MTYyMSAtMTIuOTU3OSwtOC4xODE1MyB6IG0gMCwxNS45OTc3NCAxMy44NTU0LDguMDAxMTMgLTAuNjA4OSwtMTUuMzE2NyAtMTMuMjQ2NSw3LjMxNTU3IHogbSAxMy44NTU0LDguMDAxMTMgMTMuODU1NCwtOC4wMDExMyAtMTMuMjUxLC03LjMxNTU3IC0wLjYwNDQsMTUuMzE2NyB6IG0gMTMuODU1NCwtOC4wMDExMyAwLC0xNS45OTc3NCAtMTIuOTYyNCw4LjE4MTUzIDEyLjk2MjQsNy44MTYyMSB6IgogICAgICAgaWQ9InBhdGg0MDE2LTMtOC02IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICA8L2c+Cjwvc3ZnPgo=',
    widgetCss: '/** encoding:utf-8 **/ /* RESET */ #remotestorage-widget{text-align:left;}#remotestorage-widget input, #remotestorage-widget button{font-size:11px;}#remotestorage-widget form input[type=email]{margin-bottom:0;/* HTML5 Boilerplate */}#remotestorage-widget form input[type=submit]{margin-top:0;/* HTML5 Boilerplate */}/* /RESET */ #remotestorage-widget, #remotestorage-widget *{-moz-box-sizing:border-box;box-sizing:border-box;}#remotestorage-widget{position:absolute;right:10px;top:10px;font:normal 16px/100% sans-serif !important;user-select:none;-webkit-user-select:none;-moz-user-select:-moz-none;cursor:default;z-index:10000;}#remotestorage-widget .bubble{background:rgba(80, 80, 80, .7);border-radius:5px 15px 5px 5px;color:white;font-size:0.8em;padding:5px;position:absolute;right:3px;top:9px;min-height:24px;white-space:nowrap;text-decoration:none;}#remotestorage-widget .bubble-text{padding-right:32px;}#remotestorage-widget .bubble.one-line{padding-bottom:2px;border-radius:5px 15px 15px 5px;}#remotestorage-widget .bubble.hidden{display:none;}#remotestorage-widget .action{cursor:pointer;}/* less obtrusive cube when connected */ #remotestorage-widget.remotestorage-state-connected .cube, #remotestorage-widget.remotestorage-state-busy .cube{opacity:.3;-webkit-transition:opacity .3s ease;-moz-transition:opacity .3s ease;-ms-transition:opacity .3s ease;-o-transition:opacity .3s ease;transition:opacity .3s ease;}#remotestorage-widget.remotestorage-state-connected:hover .cube, #remotestorage-widget.remotestorage-state-busy:hover .cube, #remotestorage-widget.remotestorage-state-connected .bubble:not(.hidden) + .cube{opacity:1 !important;}#remotestorage-widget .cube{position:relative;top:5px;right:0;}/* pulsing animation for cube when loading */ #remotestorage-widget .cube.remotestorage-loading{-webkit-animation:remotestorage-loading .5s ease-in-out infinite alternate;-moz-animation:remotestorage-loading .5s ease-in-out infinite alternate;-o-animation:remotestorage-loading .5s ease-in-out infinite alternate;-ms-animation:remotestorage-loading .5s ease-in-out infinite alternate;animation:remotestorage-loading .5s ease-in-out infinite alternate;}@-webkit-keyframes remotestorage-loading{to{opacity:.7}}@-moz-keyframes remotestorage-loading{to{opacity:.7}}@-o-keyframes remotestorage-loading{to{opacity:.7}}@-ms-keyframes remotestorage-loading{to{opacity:.7}}@keyframes remotestorage-loading{to{opacity:.7}}#remotestorage-widget a{text-decoration:underline;color:inherit;}#remotestorage-widget form{margin-top:.7em;position:relative;}#remotestorage-widget form input{display:table-cell;vertical-align:top;border:none;border-radius:6px;font-weight:bold;color:white;outline:none;line-height:1.5em;height:2em;}#remotestorage-widget form input:disabled{color:#999;background:#444 !important;cursor:default !important;}#remotestorage-widget form input[type=email]{background:#000;width:100%;height:26px;padding:0 30px 0 5px;border-top:1px solid #111;border-bottom:1px solid #999;}#remotestorage-widget button:focus, #remotestorage-widget input:focus{box-shadow:0 0 4px #ccc;}#remotestorage-widget form input[type=email]::-webkit-input-placeholder{color:#999;}#remotestorage-widget form input[type=email]:-moz-placeholder{color:#999;}#remotestorage-widget form input[type=email]::-moz-placeholder{color:#999;}#remotestorage-widget form input[type=email]:-ms-input-placeholder{color:#999;}#remotestorage-widget form input[type=submit]{background:#000;cursor:pointer;padding:0 5px;}#remotestorage-widget form input[type=submit]:hover{background:#333;}#remotestorage-widget .info{font-size:10px;color:#eee;margin-top:0.7em;white-space:normal;}#remotestorage-widget .info.last-synced-message{display:inline;white-space:nowrap;margin-bottom:.7em}#remotestorage-widget .info a:hover, #remotestorage-widget .info a:active{color:#fff;}#remotestorage-widget button{border:none;border-radius:6px;font-weight:bold;color:white;outline:none;line-height:1.5em;height:26px;width:26px;background:#000;cursor:pointer;margin:0;padding:5px;}#remotestorage-widget button:hover{background:#333;}#remotestorage-widget .bubble button.connect{display:block;background:none;position:absolute;right:0;top:0;opacity:1;/* increase clickable area of connect button */ margin:-5px;padding:10px;width:36px;height:36px;}#remotestorage-widget .bubble button.connect:not([disabled]):hover{background:rgba(150,150,150,.5);}#remotestorage-widget .bubble button.connect[disabled]{opacity:.5;cursor:default !important;}#remotestorage-widget .bubble button.sync{position:relative;left:-5px;bottom:-5px;padding:4px 4px 0 4px;background:#555;}#remotestorage-widget .bubble button.sync:hover{background:#444;}#remotestorage-widget .bubble button.disconnect{background:#721;position:absolute;right:0;bottom:0;padding:4px 4px 0 4px;}#remotestorage-widget .bubble button.disconnect:hover{background:#921;}#remotestorage-widget .remotestorage-error-info{/*color:#f00;*/}#remotestorage-widget .remotestorage-reset{width:100%;background:#721;}#remotestorage-widget .remotestorage-reset:hover{background:#921;}#remotestorage-widget .bubble .content{margin-top:7px;}#remotestorage-widget pre{user-select:initial;-webkit-user-select:initial;-moz-user-select:text;max-width:27em;margin-top:1em;overflow:auto;}',
    remoteStorageIconOffline: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgd2lkdGg9IjMyIgogICBoZWlnaHQ9IjMyIgogICBpZD0ic3ZnMiIKICAgdmVyc2lvbj0iMS4xIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjQ4LjEgcjk3NjAiCiAgIHNvZGlwb2RpOmRvY25hbWU9InJlbW90ZXN0b3JhZ2VJY29uT2ZmbGluZS5zdmciCiAgIGlua3NjYXBlOmV4cG9ydC1maWxlbmFtZT0iL2hvbWUvdXNlci93ZWJzaXRlL2ltZy9yZW1vdGVTdG9yYWdlLWljb24ucG5nIgogICBpbmtzY2FwZTpleHBvcnQteGRwaT0iOTAiCiAgIGlua3NjYXBlOmV4cG9ydC15ZHBpPSI5MCI+CiAgPGRlZnMKICAgICBpZD0iZGVmczQiPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDMzIj4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2UyMjFiNztzdG9wLW9wYWNpdHk6MC43NDYxNTM4MzsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3A0MDM1IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZTIyMWI3O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDQwMzciIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0NTc1Ij4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0NTc3IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwMDA7c3RvcC1vcGFjaXR5OjAuNzM4NDYxNTU7IiAvPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQ1NzkiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzAwMDAwMDtzdG9wLW9wYWNpdHk6MTsiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDg0Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6Izc1ZGQyNjtzdG9wLW9wYWNpdHk6MC44MzEzNzI1NjsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3A0MDg2IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNzVkZDI2O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDQwODgiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDQ0Ij4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ2IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMyMTliZTI7c3RvcC1vcGFjaXR5OjAuODMxMzcyNTY7IiAvPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQwNDgiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzIxOWJlMjtzdG9wLW9wYWNpdHk6MTsiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzIj4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmOTEwMDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzODM1IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojYzQ2ZjAwO3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDM4MzciIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGlua3NjYXBlOnBlcnNwZWN0aXZlCiAgICAgICBzb2RpcG9kaTp0eXBlPSJpbmtzY2FwZTpwZXJzcDNkIgogICAgICAgaW5rc2NhcGU6dnBfeD0iMCA6IDUyNi4xODEwOSA6IDEiCiAgICAgICBpbmtzY2FwZTp2cF95PSIwIDogMTAwMCA6IDAiCiAgICAgICBpbmtzY2FwZTp2cF96PSI3NDQuMDk0NDggOiA1MjYuMTgxMDkgOiAxIgogICAgICAgaW5rc2NhcGU6cGVyc3AzZC1vcmlnaW49IjM3Mi4wNDcyNCA6IDM1MC43ODczOSA6IDEiCiAgICAgICBpZD0icGVyc3BlY3RpdmUyOTg1IiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY5MTAwO3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDM4MzUtNyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2M0NmYwMDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzODM3LTciIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICB5Mj0iMCIKICAgICAgIHgyPSIxMjgiCiAgICAgICB5MT0iMTI4IgogICAgICAgeDE9IjEyOCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50Mzg5MCIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMSIKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODM5LTAtMiIKICAgICAgIHgxPSIxMjgiCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEyOCIKICAgICAgIHkyPSIwIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM4MzMtMS00Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzY5Njk2OTtzdG9wLW9wYWNpdHk6MC43NjE1Mzg0NTsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzODM1LTctOCIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzY3Njc2NztzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzODM3LTctMCIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS03IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzOS0wLTgiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjExMiIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMzIiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC42ODc1LDAsMCwxLDMyLDc5Ni4zNjIxOCkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM4MzMtMS03Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmOTEwMDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzODM1LTctMyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2M0NmYwMDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzODM3LTctMiIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTIiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODM5LTAtMyIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNjg3NSwwLDAsMSwzMiw3OTYuMzYyMTgpIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEtNC0yIj4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmOTMwNDtzdG9wLW9wYWNpdHk6MC44MzA3NjkyNDsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzODM1LTctOC0xIiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY5MzA0O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDM4MzctNy0wLTAiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0wLjM0Mzc1LC0wLjU5NTM5MjQ3LDAuODY2MDI1NCwtMC41LDY1LjE0ODc0OCwxMDcxLjUwMDYpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDI1LTUiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDQ0LTMiCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNDQtMyI+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDA0Ni00IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMwNDhiZmY7c3RvcC1vcGFjaXR5OjAuODMxMzcyNTY7IiAvPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQwNDgtNyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMDQ4YmZmO3N0b3Atb3BhY2l0eToxOyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTUiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODM5LTAtODkiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjY4NzUsMCwwLDEsMzIsNzk2LjM2MjE4KSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzMy0xLTQtNSI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjAuODMwNzY5MjQ7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzgzNS03LTgtMiIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzODM3LTctMC0yIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDA0NC05Ij4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ2LTMiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzIxOWJlMjtzdG9wLW9wYWNpdHk6MC44MzEzNzI1NjsiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDA0OC04IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMyMTliZTI7c3RvcC1vcGFjaXR5OjE7IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDA4NC03Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6Izc1ZGQyNjtzdG9wLW9wYWNpdHk6MC44MzEzNzI1NjsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3A0MDg2LTYiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wNDA4OC01IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQxNTkiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuNjg3NSwwLDAsLTEsMjI0LDEwMjAuMzYyMikiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA0NC05IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDE2MSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjM0Mzc1LDAuNTk1MzkyNDcsLTAuODY2MDI1NCwwLjUsMTkwLjg1MTI1LDc0NS4yMjM3NikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQtNyIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQxNjMiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsMC41OTUzOTI0NywwLjg2NjAyNTQsMC41LDY1LjE0ODc1LDc0NS4yMjM3NikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDE3MCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjY4NzUsMCwwLDEsMzIsNzk2LjM2MjE4KSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDQ0IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDE3MiIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC4zNDM3NSwtMC41OTUzOTI0NywwLjg2NjAyNTQsLTAuNSw2NS4xNDg3NDgsMTA3MS41MDA2KSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTQ2OSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA4NCIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQxNzQiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwtMC41OTUzOTI0NywtMC44NjYwMjU0LC0wLjUsMTkwLjg1MTI1LDEwNzEuNTAwNikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY0YTA0O3N0b3Atb3BhY2l0eTowLjgzMDc2OTI0OyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDM4MzUtNy04LTUiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTAtNyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNDQtMiI+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDA0Ni03IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMyMTliZTI7c3RvcC1vcGFjaXR5OjAuODMxMzcyNTY7IiAvPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQwNDgtNCIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eToxOyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQtNiIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQxNzQtMiIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjM0Mzc1LC0wLjU5NTM5MjQ3LC0wLjg2NjAyNTQsLTAuNSwxOTAuODUxMjUsMTA3MS41MDA2KSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTY0MiIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDA4NC02Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6Izc1ZGQyNjtzdG9wLW9wYWNpdHk6MC44MzEzNzI1NjsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3A0MDg2LTAiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wNDA4OC05IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNC01IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDI1My05IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNjg3NSwwLDAsMSwxNzYsODI4LjM2MjE4KSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEtNC00LTUiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY0YTA0O3N0b3Atb3BhY2l0eTowLjgzMDc2OTI0OyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDM4MzUtNy04LTUtMiIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzODM3LTctMC03LTQiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDQ0LTItOSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyNTUtNyIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC4zNDM3NSwtMC41OTUzOTI0NywwLjg2NjAyNTQsLTAuNSwyMDkuMTQ4NzUsMTEwMy41MDA2KSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTQ2OSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDA0NC0yLTkiPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQwNDYtNy03IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMyMTliZTI7c3RvcC1vcGFjaXR5OjAuODMxMzcyNTY7IiAvPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQwNDgtNC01IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMyMTliZTI7c3RvcC1vcGFjaXR5OjE7IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA4NC02LTUiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MjU3LTQiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwtMC41OTUzOTI0NywtMC44NjYwMjU0LC0wLjUsMzM0Ljg1MTI1LDExMDMuNTAwNikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwODQtNi01Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6Izc1ZGQyNjtzdG9wLW9wYWNpdHk6MC44MzEzNzI1NjsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3A0MDg2LTAtOSIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6Izc1ZGQyNjtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3A0MDg4LTktMyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIHkyPSItMC45OTQ4NTY0MiIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwtMC41OTUzOTI0NywtMC44NjYwMjU0LC0wLjUsMzM0Ljg1MTI1LDExMDMuNTAwNikiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQzMTciCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTYtNSIKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNCIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQzNTgiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC42ODc1LDAsMCwxLDE3Niw4MjguMzYyMTgpIgogICAgICAgeDE9IjEzOS42MzYzNyIKICAgICAgIHkxPSIxMjgiCiAgICAgICB4Mj0iMTM5LjYzNjM3IgogICAgICAgeTI9IjEuMTM2ODY4NGUtMTMiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwNDQtMiIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQzNjAiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsLTAuNTk1MzkyNDcsMC44NjYwMjU0LC0wLjUsMjA5LjE0ODc1LDExMDMuNTAwNikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQtNiIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQzNjIiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwtMC41OTUzOTI0NywtMC44NjYwMjU0LC0wLjUsMzM0Ljg1MTI1LDExMDMuNTAwNikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNiIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQzNTgtNyIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjY4NzUsMCwwLDEsMTc2LDgyOC4zNjIxOCkiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzMy0xLTQtNC02Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MC44MzA3NjkyNDsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzODM1LTctOC01LTkiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTAtNy0wIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA0NC0yLTgiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MzYwLTQiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsLTAuNTk1MzkyNDcsMC44NjYwMjU0LC0wLjUsMjA5LjE0ODc1LDExMDMuNTAwNikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNDQtMi04Ij4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ2LTctMyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eTowLjgzMTM3MjU2OyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ4LTQtNiIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eToxOyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQtNi02IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDM2Mi00IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsLTAuNTk1MzkyNDcsLTAuODY2MDI1NCwtMC41LDMzNC44NTEyNSwxMTAzLjUwMDYpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NjQyIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDg0LTYtNiI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjAuODMxMzcyNTY7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wNDA4Ni0wLTAiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wNDA4OC05LTgiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC00LTUtOSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyNTMtOS02IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNjg3NSwwLDAsMSwxNzYsODI4LjM2MjE4KSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEtNC00LTUtOSI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjAuODMwNzY5MjQ7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzgzNS03LTgtNS0yLTciIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTAtNy00LTMiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDQ0LTItOS0zIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDI1NS03LTEiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsLTAuNTk1MzkyNDcsMC44NjYwMjU0LC0wLjUsMjA5LjE0ODc1LDExMDMuNTAwNikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNDQtMi05LTMiPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQwNDYtNy03LTUiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzIxOWJlMjtzdG9wLW9wYWNpdHk6MC44MzEzNzI1NjsiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDA0OC00LTUtMyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eToxOyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIHkyPSItMC45OTQ4NTY0MiIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwtMC41OTUzOTI0NywtMC44NjYwMjU0LC0wLjUsMzM0Ljg1MTI1LDExMDMuNTAwNikiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQzMTctOCIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQtNi01LTUiCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwODQtNi01LTUiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNzVkZDI2O3N0b3Atb3BhY2l0eTowLjgzMTM3MjU2OyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDQwODYtMC05LTYiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wNDA4OC05LTMtMyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIHkyPSItMC45OTQ4NTY0MiIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwtMC41OTUzOTI0NywtMC44NjYwMjU0LC0wLjUsMzM0Ljg1MTI1LDExMDMuNTAwNikiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQ0MzQiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTYtNS01IgogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTYtNiIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQ1MDgiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwtMC41OTUzOTI0NywtMC44NjYwMjU0LC0wLjUsNzAyLjg1MTI1LDEwNzEuNTAwNSkiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwNDQtMi04IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDUxMSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC4zNDM3NSwtMC41OTUzOTI0NywwLjg2NjAyNTQsLTAuNSw1NzcuMTQ4NzUsMTA3MS41MDA1KSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTQ2OSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNC02IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDUxNCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjY4NzUsMCwwLDEsNTQ0LC02ZS01KSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC00LTYiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0NTE3IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNjg3NSwwLDAsMSw1ODQsNzk2LjM2MjEyKSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTYtNS01IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDUyMCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC4zNDM3NSwwLjU5NTM5MjQ3LDAuODY2MDI1NCwwLjUsNTc3LjE0ODc1LDc3Ny4yMjM4KSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTY0MiIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA0NC0yLTktMyIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQ1MjMiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwwLjU5NTM5MjQ3LC0wLjg2NjAyNTQsMC41LDcwMi44NTEyNSw3NzcuMjIzOCkiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNS05IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDUyNiIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC42ODc1LDAsMCwtMSw3MzYsMjU2LjAwMDAyKSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC00LTUtOSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQ1MjkiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuNjg3NSwwLDAsLTEsNzc2LDEwNTIuMzYyMikiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNC02IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDUzMiIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjY4NzUsMCwwLDEsNTY0LDc5Ni4zNjIxMikiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNC01LTkiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0NTM0IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0wLjY4NzUsMCwwLC0xLDc1NiwyNTYuMDAwMDIpIgogICAgICAgeDE9IjEzOS42MzYzNyIKICAgICAgIHkxPSIxMjgiCiAgICAgICB4Mj0iMTM5LjYzNjM3IgogICAgICAgeTI9IjEuMTM2ODY4NGUtMTMiIC8+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNS05IgogICAgICAgaWQ9InJhZGlhbEdyYWRpZW50NDUzOSIKICAgICAgIGN4PSI2NjAiCiAgICAgICBjeT0iMTI4IgogICAgICAgZng9IjY2MCIKICAgICAgIGZ5PSIxMjgiCiAgICAgICByPSIxMTIiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLDEuMTQyODU3MSw2MCw3MTAuMDc2NTIpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIC8+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNS05LTgiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQ0NTM5LTciCiAgICAgICBjeD0iNjYwIgogICAgICAgY3k9IjEyOCIKICAgICAgIGZ4PSI2NjAiCiAgICAgICBmeT0iMTI4IgogICAgICAgcj0iMTEyIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwxLjE0Mjg1NzEsLTIwLDc3OC4wNzY0NykiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzMy0xLTQtNC01LTktOCI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjAuODMwNzY5MjQ7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzgzNS03LTgtNS0yLTctOSIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzODM3LTctMC03LTQtMy04IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudAogICAgICAgcj0iMTEyIgogICAgICAgZnk9IjEyOCIKICAgICAgIGZ4PSI2NjAiCiAgICAgICBjeT0iMTI4IgogICAgICAgY3g9IjY2MCIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsMS4xNDI4NTcxLDE2LDMzMC4wNzY1MikiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDQ1NTYiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0NTc1IgogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIiAvPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC00LTUtOS0xIgogICAgICAgaWQ9InJhZGlhbEdyYWRpZW50NDUzOS0wIgogICAgICAgY3g9IjY2MCIKICAgICAgIGN5PSIxMjgiCiAgICAgICBmeD0iNjYwIgogICAgICAgZnk9IjEyOCIKICAgICAgIHI9IjExMiIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsMS4xNDI4NTcxLC0yMCw3NzguMDc2NDcpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNS05LTEiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY0YTA0O3N0b3Atb3BhY2l0eTowLjgzMDc2OTI0OyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDM4MzUtNy04LTUtMi03LTYiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTAtNy00LTMtMCIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIHI9IjExMiIKICAgICAgIGZ5PSIxMjgiCiAgICAgICBmeD0iNjYwIgogICAgICAgY3k9IjEyOCIKICAgICAgIGN4PSI2NjAiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMTI0OTk5OTksMCwwLDAuMTQyODU3MTMsNzk3LjUsNjc4LjA3NjUyKSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgaWQ9InJhZGlhbEdyYWRpZW50NDU1Ni0zIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDU3NS0yIgogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0NTc1LTIiPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQ1NzctNiIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojODE4MTgxO3N0b3Atb3BhY2l0eTowLjgzMDc2OTI0OyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0NTc5LTQiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzcwNzA3MDtzdG9wLW9wYWNpdHk6MTsiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICByPSIxMTIiCiAgICAgICBmeT0iMTI4IgogICAgICAgZng9IjY2MCIKICAgICAgIGN5PSIxMjgiCiAgICAgICBjeD0iNjYwIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjEyNDk5OTk5LDAsMCwwLjE0Mjg1NzEzLDczMy41MDAwMSw2NzguMDc2NTIpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQ0NjAxIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNC01LTktMSIKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIgLz4KICAgIDxyYWRpYWxHcmFkaWVudAogICAgICAgcj0iMTEyIgogICAgICAgZnk9IjEyOCIKICAgICAgIGZ4PSI2NjAiCiAgICAgICBjeT0iMTI4IgogICAgICAgY3g9IjY2MCIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsMS4xNDI4NTcxLDIzNiw3NzguMDc2NDcpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQ0NTU2LTUiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0NTc1LTMiCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQ1NzUtMyI+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDU3Ny05IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM4MTgxODE7c3RvcC1vcGFjaXR5OjAuODMwNzY5MjQ7IiAvPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQ1NzktOCIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNzA3MDcwO3N0b3Atb3BhY2l0eToxOyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIHI9IjExMiIKICAgICAgIGZ5PSIxMjgiCiAgICAgICBmeD0iNjYwIgogICAgICAgY3k9IjEyOCIKICAgICAgIGN4PSI2NjAiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMTI0OTk5OTksMCwwLDAuMTQyODU3MTMsODI5LjUwMDAxLDY3OC4wNzY1MikiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDQ2NDUiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0NTc1LTMiCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiIC8+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIHI9IjExMiIKICAgICAgIGZ5PSIxMjgiCiAgICAgICBmeD0iNjYwIgogICAgICAgY3k9IjEyOCIKICAgICAgIGN4PSI2NjAiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLDEuMTQyODU3MSwyMzYsNzc4LjA3NjQ3KSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgaWQ9InJhZGlhbEdyYWRpZW50NDU1Ni04IgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDU3NS0xIgogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0NTc1LTEiPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQ1NzctMiIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwO3N0b3Atb3BhY2l0eTowLjczODQ2MTU1OyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0NTc5LTIiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzAwMDAwMDtzdG9wLW9wYWNpdHk6MTsiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNCIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwMTciCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC42ODc1LDAsMCwxLDMyLDc5Ni4zNjIxOCkiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA0NCIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwMTkiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsLTAuNTk1MzkyNDcsMC44NjYwMjU0LC0wLjUsNjUuMTQ4NzQ4LDEwNzEuNTAwNikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDIxIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsLTAuNTk1MzkyNDcsLTAuODY2MDI1NCwtMC41LDE5MC44NTEyNSwxMDcxLjUwMDYpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NjQyIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC00LTU5IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDM1OC0zIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNjg3NSwwLDAsMSwxNzYsODI4LjM2MjE4KSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEtNC00LTU5Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MC44MzA3NjkyNDsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzODM1LTctOC01LTYiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTAtNy01IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA0NC0yLTMiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MzYwLTYiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsLTAuNTk1MzkyNDcsMC44NjYwMjU0LC0wLjUsMjA5LjE0ODc1LDExMDMuNTAwNikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNDQtMi0zIj4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ2LTctMCIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eTowLjgzMTM3MjU2OyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ4LTQtMiIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eToxOyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQtNi03IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDM2Mi0wIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsLTAuNTk1MzkyNDcsLTAuODY2MDI1NCwtMC41LDMzNC44NTEyNSwxMTAzLjUwMDYpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NjQyIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDg0LTYtNyI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjAuODMxMzcyNTY7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wNDA4Ni0wLTQiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wNDA4OC05LTciIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC00LTUtMCIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyNTMtOS0zIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNjg3NSwwLDAsMSwxNzYsODI4LjM2MjE4KSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEtNC00LTUtMCI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjAuODMwNzY5MjQ7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzgzNS03LTgtNS0yLTEiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTAtNy00LTYiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDQ0LTItOS01IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDI1NS03LTciCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsLTAuNTk1MzkyNDcsMC44NjYwMjU0LC0wLjUsMjA5LjE0ODc1LDExMDMuNTAwNikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNDQtMi05LTUiPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQwNDYtNy03LTciCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzIxOWJlMjtzdG9wLW9wYWNpdHk6MC44MzEzNzI1NjsiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDA0OC00LTUtOCIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eToxOyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIHkyPSItMC45OTQ4NTY0MiIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwtMC41OTUzOTI0NywtMC44NjYwMjU0LC0wLjUsMzM0Ljg1MTI1LDExMDMuNTAwNikiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQzMTctODkiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTYtNS0wIgogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDg0LTYtNS0wIj4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6Izc1ZGQyNjtzdG9wLW9wYWNpdHk6MC44MzEzNzI1NjsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3A0MDg2LTAtOS03IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNzVkZDI2O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDQwODgtOS0zLTgiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEtNC0zIj4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MC43NDUwOTgwNTsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzODM1LTctOC0xMCIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzODM3LTctMC0zIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDA0NC03Ij4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ2LTMyIgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMyMTliZTI7c3RvcC1vcGFjaXR5OjAuNzQ1MDk4MDU7IiAvPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQwNDgtMiIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eToxOyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwODQtNSI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjAuNzQ1MDk4MDU7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wNDA4Ni0zIiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNzVkZDI2O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDQwODgtMyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM4MzMtMS00LTUtMiI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM1OTA0ZmY7c3RvcC1vcGFjaXR5OjAuNzQ1MDk4MDU7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzgzNS03LTgtMi04IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNTkwNGZmO3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDM4MzctNy0wLTItNSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNDQtOS0wIj4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ2LTMtOCIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eTowLjgzMTM3MjU2OyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ4LTgtNiIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eToxOyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQtNy0zIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDE2My05IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0wLjM0Mzc1LDAuNTk1MzkyNDcsMC44NjYwMjU0LDAuNSw2NS4xNDg3NSw3NDUuMjIzNzYpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NjQyIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDg0LTctMyI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNkMmRkMjY7c3RvcC1vcGFjaXR5OjAuNzQ1MDk4MDU7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wNDA4Ni02LTMiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNkMmRkMjY7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wNDA4OC01LTciIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTYtNyIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyMzUiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwtMC41OTUzOTI0NywtMC44NjYwMjU0LC0wLjUsNTI2Ljg1MTI1LDEyOTEuNTAwNykiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwNDQtMi0zIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDIzOCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC4zNDM3NSwtMC41OTUzOTI0NywwLjg2NjAyNTQsLTAuNSw0MDEuMTQ4NzUsMTI5MS41MDA3KSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTQ2OSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNC01OSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyNDEiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC42ODc1LDAsMCwxLDM1Miw0MDMuOTk5OTkpIgogICAgICAgeDE9IjEzOS42MzYzNyIKICAgICAgIHkxPSIxMjgiCiAgICAgICB4Mj0iMTM5LjYzNjM3IgogICAgICAgeTI9IjEuMTM2ODY4NGUtMTMiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNTkiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MjQ0IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNjg3NSwwLDAsMSw0NjgsMTAxNi4zNjIyKSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTYtNS0wIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDI0NyIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC4zNDM3NSwwLjU5NTM5MjQ3LDAuODY2MDI1NCwwLjUsNDAxLjE0ODc1LDk5Ny4yMjM5KSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTY0MiIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA0NC0yLTktNSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyNTAiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwwLjU5NTM5MjQ3LC0wLjg2NjAyNTQsMC41LDUyNi44NTEyNSw5OTcuMjIzOSkiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNS0wIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDI1MyIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC42ODc1LDAsMCwtMSw1NDQsNjYwLjAwMDA5KSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTYtNSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyNTciCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsMC41OTUzOTI0NywwLjg2NjAyNTQsMC41LDQwMS4xNDg3NSw3MDkuMjIzOSkiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwNDQtMi05IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDI2MCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjM0Mzc1LDAuNTk1MzkyNDcsLTAuODY2MDI1NCwwLjUsNTI2Ljg1MTI1LDcwOS4yMjM5KSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTQ2OSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNC01IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDI2MyIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC42ODc1LDAsMCwtMSw1NjAsOTg0LjM2MjMyKSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC01MiIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDQzODctNyIKICAgICAgIGN4PSIxMDQ2LjUzMTIiCiAgICAgICBjeT0iNTcxLjQyMTg4IgogICAgICAgZng9IjEwNDYuNTMxMiIKICAgICAgIGZ5PSI1NzEuNDIxODgiCiAgICAgICByPSI5NS45OTk5NzciCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEuMTY2NjY2OSwwLDAsMS4zNDcyNTAxLC0yNDQuOTUzMzksODYuNTA1MDM1KSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEtNC01MiI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjAuNzYxNTM4NDU7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzgzNS03LTgtNyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzODM3LTctMC00IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzMy0xLTQtMzMiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY0YTA0O3N0b3Atb3BhY2l0eTowLjc2MTUzODQ1OyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDM4MzUtNy04LTQiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTAtNiIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00IgogICAgICAgaWQ9InJhZGlhbEdyYWRpZW50NDUyMCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLjE2NjY2NjksMCwwLDEuMzQ3MjUwMSwtMjQ0Ljk1MzM5LDg2LjUwNTAzNSkiCiAgICAgICBjeD0iMTA0Ni41MzEyIgogICAgICAgY3k9IjU3MS40MjE4OCIKICAgICAgIGZ4PSIxMDQ2LjUzMTIiCiAgICAgICBmeT0iNTcxLjQyMTg4IgogICAgICAgcj0iOTUuOTk5OTc3IiAvPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC0zMyIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDQ1MjIiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMS4xNjY2NjY5LDAsMCwxLjM0NzI1MDEsMTM5LjA0NjYsLTM2MC4xNDk5NykiCiAgICAgICBjeD0iMTA0Ni41MzEyIgogICAgICAgY3k9IjU3MS40MjE4OCIKICAgICAgIGZ4PSIxMDQ2LjUzMTIiCiAgICAgICBmeT0iNTcxLjQyMTg4IgogICAgICAgcj0iOTUuOTk5OTc3IiAvPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC01MiIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDQ1MjQiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4xNDQzMjY3MywwLDAsMC4xNjY2NjY0Miw5MDcuMTAyMjMsODk3LjEyNjU2KSIKICAgICAgIGN4PSIxMDQ2LjUzMTIiCiAgICAgICBjeT0iNTcxLjQyMTg4IgogICAgICAgZng9IjEwNDYuNTMxMiIKICAgICAgIGZ5PSI1NzEuNDIxODgiCiAgICAgICByPSI5NS45OTk5NzciIC8+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTMzIgogICAgICAgaWQ9InJhZGlhbEdyYWRpZW50NDUzMiIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLjE2NjY2NjksMCwwLDEuMzQ3MjUwMSwxMzkuMDQ2NiwtMzYwLjE0OTk3KSIKICAgICAgIGN4PSIxMDQ2LjUzMTIiCiAgICAgICBjeT0iNTcxLjQyMTg4IgogICAgICAgZng9IjEwNDYuNTMxMiIKICAgICAgIGZ5PSI1NzEuNDIxODgiCiAgICAgICByPSI5NS45OTk5NzciIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQtNy0zIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzI1NyIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC4zNDM3NSwwLjU5NTM5MjQ3LDAuODY2MDI1NCwwLjUsMTQ1LjE0ODc1LDk5Ny4yMjM4MSkiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwMzMiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzMjYwIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsMC41OTUzOTI0NywtMC44NjYwMjU0LDAuNSwyNzAuODUxMjUsOTk3LjIyMzgxKSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTQ2OSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNS0yIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzI2MyIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC42ODc1LDAsMCwtMSwzMDQsMTI3Mi4zNjIzKSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC0zIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDA1OCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjY4NzUsMCwwLDEsLTEwOCwxMDE2LjM2MjIpIgogICAgICAgeDE9IjEzOS42MzYzNyIKICAgICAgIHkxPSIxMjgiCiAgICAgICB4Mj0iMTM5LjYzNjM3IgogICAgICAgeTI9IjEuMTM2ODY4NGUtMTMiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwNDQtNyIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNjAiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsLTAuNTk1MzkyNDcsMC44NjYwMjU0LC0wLjUsLTc0Ljg1MTI1MiwxMjkxLjUwMDcpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NDY5IiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTUiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDYyIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsLTAuNTk1MzkyNDcsLTAuODY2MDI1NCwtMC41LDUwLjg1MTI1LDEyOTEuNTAwNykiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQtNSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNjUiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwtMC41OTUzOTI0NywtMC44NjYwMjU0LC0wLjUsMjcwLjg1MTI1LDEyOTEuNTAwNykiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwNDQtNyIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNjgiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsLTAuNTk1MzkyNDcsMC44NjYwMjU0LC0wLjUsMTQ1LjE0ODc1LDEyOTEuNTAwNykiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTMiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDcxIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNjg3NSwwLDAsMSwxMTIsMTAxNi4zNjIyKSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC0yMCIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDQ1MjAtNCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLjE2NjY2NjksMCwwLDEuMzQ3MjUwMSwtMjQ0Ljk1MzM5LDg2LjUwNTAzNSkiCiAgICAgICBjeD0iMTA0Ni41MzEyIgogICAgICAgY3k9IjU3MS40MjE4OCIKICAgICAgIGZ4PSIxMDQ2LjUzMTIiCiAgICAgICBmeT0iNTcxLjQyMTg4IgogICAgICAgcj0iOTUuOTk5OTc3IiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEtNC0yMCI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjAuNzYxNTM4NDU7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzgzNS03LTgtOSIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzODM3LTctMC03NyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIHI9Ijk1Ljk5OTk3NyIKICAgICAgIGZ5PSI1NzEuNDIxODgiCiAgICAgICBmeD0iMTA0Ni41MzEyIgogICAgICAgY3k9IjU3MS40MjE4OCIKICAgICAgIGN4PSIxMDQ2LjUzMTIiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEuMTY2NjY2OSwwLDAsMS4zNDcyNTAxLC0yNDQuOTUzMzksODYuNTA1MDM1KSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgaWQ9InJhZGlhbEdyYWRpZW50NDIwOCIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTIwIgogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIiAvPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNCIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDM2MTQiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMS4xNjY2NjY5LDAsMCwxLjM0NzI1MDEsMjE5LjA0NjYxLDg5LjE2Nzc1NykiCiAgICAgICBjeD0iMTA0Ni41MzEyIgogICAgICAgY3k9IjU3MS40MjE4OCIKICAgICAgIGZ4PSIxMDQ2LjUzMTIiCiAgICAgICBmeT0iNTcxLjQyMTg4IgogICAgICAgcj0iOTUuOTk5OTc3IiAvPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNCIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDM2MjUiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMS4xNjY2NjY5LDAsMCwxLjM0NzI1MDEsMjE5LjA0NjYxLDg5LjE2Nzc1NykiCiAgICAgICBjeD0iMTA0Ni41MzEyIgogICAgICAgY3k9IjU3MS40MjE4OCIKICAgICAgIGZ4PSIxMDQ2LjUzMTIiCiAgICAgICBmeT0iNTcxLjQyMTg4IgogICAgICAgcj0iOTUuOTk5OTc3IiAvPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNCIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDMyMDkiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4xNDQzMjY5OSwwLDAsMC4xNjY2NjY3MywxMjAxLjUzNTgsODc3LjExNDg4KSIKICAgICAgIGN4PSIxMDQ2LjUzMTIiCiAgICAgICBjeT0iNTcxLjQyMTg4IgogICAgICAgZng9IjEwNDYuNTMxMiIKICAgICAgIGZ5PSI1NzEuNDIxODgiCiAgICAgICByPSI5NS45OTk5NzciIC8+CiAgPC9kZWZzPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0iYmFzZSIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMS4wIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTp6b29tPSIxNiIKICAgICBpbmtzY2FwZTpjeD0iLTUuMTAwMDg1IgogICAgIGlua3NjYXBlOmN5PSIxNi4yMzcyMjUiCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9InB4IgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIKICAgICBzaG93Z3JpZD0idHJ1ZSIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjEzOTYiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTAyNyIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMTkiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBmaXQtbWFyZ2luLXRvcD0iMCIKICAgICBmaXQtbWFyZ2luLWxlZnQ9IjAiCiAgICAgZml0LW1hcmdpbi1yaWdodD0iMCIKICAgICBmaXQtbWFyZ2luLWJvdHRvbT0iMCIKICAgICBpbmtzY2FwZTpzbmFwLXBhZ2U9InRydWUiCiAgICAgaW5rc2NhcGU6c25hcC1ub2Rlcz0idHJ1ZSIKICAgICBncmlkdG9sZXJhbmNlPSIxMCIKICAgICBzaG93Ym9yZGVyPSJ0cnVlIgogICAgIHNob3dndWlkZXM9InRydWUiCiAgICAgaW5rc2NhcGU6Z3VpZGUtYmJveD0idHJ1ZSI+CiAgICA8aW5rc2NhcGU6Z3JpZAogICAgICAgdHlwZT0ieHlncmlkIgogICAgICAgaWQ9ImdyaWQzMDIxIgogICAgICAgZW1wc3BhY2luZz0iNCIKICAgICAgIHZpc2libGU9InRydWUiCiAgICAgICBlbmFibGVkPSJ0cnVlIgogICAgICAgc25hcHZpc2libGVncmlkbGluZXNvbmx5PSJ0cnVlIgogICAgICAgc3BhY2luZ3g9IjE2cHgiCiAgICAgICBzcGFjaW5neT0iMTZweCIKICAgICAgIGRvdHRlZD0idHJ1ZSIgLz4KICA8L3NvZGlwb2RpOm5hbWVkdmlldz4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGE3Ij4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICAgIDxkYzp0aXRsZT48L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8ZwogICAgIGlua3NjYXBlOmxhYmVsPSJMYXllciAxIgogICAgIGlua3NjYXBlOmdyb3VwbW9kZT0ibGF5ZXIiCiAgICAgaWQ9ImxheWVyMSIKICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTMzNi41Nzg1LC05NTYuMzUxODkpIj4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iY29sb3I6IzAwMDAwMDtmaWxsOnVybCgjcmFkaWFsR3JhZGllbnQzMjA5KTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTttYXJrZXI6bm9uZTt2aXNpYmlsaXR5OnZpc2libGU7ZGlzcGxheTppbmxpbmU7b3ZlcmZsb3c6dmlzaWJsZTtlbmFibGUtYmFja2dyb3VuZDphY2N1bXVsYXRlIgogICAgICAgZD0ibSAxMzUyLjU3ODUsOTU2LjM1MTg5IDAuMjg4NiwxNS4xMzYyOSAxMy41NjY4LC03LjEzNTE2IC0xMy44NTU0LC04LjAwMTEzIHogbSAwLDAgLTEzLjg1NTQsOC4wMDExMyAxMy41NjY3LDcuMTM1MTYgMC4yODg3LC0xNS4xMzYyOSB6IG0gLTEzLjg1NTQsOC4wMDExMyAwLDE1Ljk5Nzc0IDEyLjk1NzksLTcuODE2MjEgLTEyLjk1NzksLTguMTgxNTMgeiBtIDAsMTUuOTk3NzQgMTMuODU1NCw4LjAwMTEzIC0wLjYwODksLTE1LjMxNjcgLTEzLjI0NjUsNy4zMTU1NyB6IG0gMTMuODU1NCw4LjAwMTEzIDEzLjg1NTQsLTguMDAxMTMgLTEzLjI1MSwtNy4zMTU1NyAtMC42MDQ0LDE1LjMxNjcgeiBtIDEzLjg1NTQsLTguMDAxMTMgMCwtMTUuOTk3NzQgLTEyLjk2MjQsOC4xODE1MyAxMi45NjI0LDcuODE2MjEgeiIKICAgICAgIGlkPSJwYXRoNDAxNi0zLTgtNiIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgPC9nPgo8L3N2Zz4K',
    remoteStorageIcon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgd2lkdGg9IjMyIgogICBoZWlnaHQ9IjMyIgogICBpZD0ic3ZnMiIKICAgdmVyc2lvbj0iMS4xIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjQ4LjIgcjk4MTkiCiAgIHNvZGlwb2RpOmRvY25hbWU9InJlbW90ZVN0b3JhZ2UtaWNvbi5zdmciCiAgIGlua3NjYXBlOmV4cG9ydC1maWxlbmFtZT0iL2hvbWUvdXNlci93ZWJzaXRlL2ltZy9yZW1vdGVTdG9yYWdlLWljb24ucG5nIgogICBpbmtzY2FwZTpleHBvcnQteGRwaT0iOTAiCiAgIGlua3NjYXBlOmV4cG9ydC15ZHBpPSI5MCI+CiAgPGRlZnMKICAgICBpZD0iZGVmczQiPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDMzIj4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2UyMjFiNztzdG9wLW9wYWNpdHk6MC43NDYxNTM4MzsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3A0MDM1IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZTIyMWI3O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDQwMzciIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0NTc1Ij4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0NTc3IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwMDA7c3RvcC1vcGFjaXR5OjAuNzM4NDYxNTU7IiAvPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQ1NzkiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzAwMDAwMDtzdG9wLW9wYWNpdHk6MTsiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDg0Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6Izc1ZGQyNjtzdG9wLW9wYWNpdHk6MC44MzEzNzI1NjsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3A0MDg2IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNzVkZDI2O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDQwODgiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDQ0Ij4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ2IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMyMTliZTI7c3RvcC1vcGFjaXR5OjAuODMxMzcyNTY7IiAvPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQwNDgiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzIxOWJlMjtzdG9wLW9wYWNpdHk6MTsiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzIj4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmOTEwMDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzODM1IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojYzQ2ZjAwO3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDM4MzciIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGlua3NjYXBlOnBlcnNwZWN0aXZlCiAgICAgICBzb2RpcG9kaTp0eXBlPSJpbmtzY2FwZTpwZXJzcDNkIgogICAgICAgaW5rc2NhcGU6dnBfeD0iMCA6IDUyNi4xODEwOSA6IDEiCiAgICAgICBpbmtzY2FwZTp2cF95PSIwIDogMTAwMCA6IDAiCiAgICAgICBpbmtzY2FwZTp2cF96PSI3NDQuMDk0NDggOiA1MjYuMTgxMDkgOiAxIgogICAgICAgaW5rc2NhcGU6cGVyc3AzZC1vcmlnaW49IjM3Mi4wNDcyNCA6IDM1MC43ODczOSA6IDEiCiAgICAgICBpZD0icGVyc3BlY3RpdmUyOTg1IiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY5MTAwO3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDM4MzUtNyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2M0NmYwMDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzODM3LTciIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICB5Mj0iMCIKICAgICAgIHgyPSIxMjgiCiAgICAgICB5MT0iMTI4IgogICAgICAgeDE9IjEyOCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50Mzg5MCIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMSIKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODM5LTAtMiIKICAgICAgIHgxPSIxMjgiCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEyOCIKICAgICAgIHkyPSIwIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM4MzMtMS00Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MC43NjE1Mzg0NTsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzODM1LTctOCIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzODM3LTctMCIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS03IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzOS0wLTgiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjExMiIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMzIiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC42ODc1LDAsMCwxLDMyLDc5Ni4zNjIxOCkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM4MzMtMS03Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmOTEwMDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzODM1LTctMyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2M0NmYwMDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzODM3LTctMiIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTIiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODM5LTAtMyIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNjg3NSwwLDAsMSwzMiw3OTYuMzYyMTgpIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEtNC0yIj4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmOTMwNDtzdG9wLW9wYWNpdHk6MC44MzA3NjkyNDsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzODM1LTctOC0xIiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY5MzA0O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDM4MzctNy0wLTAiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0wLjM0Mzc1LC0wLjU5NTM5MjQ3LDAuODY2MDI1NCwtMC41LDY1LjE0ODc0OCwxMDcxLjUwMDYpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDI1LTUiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDQ0LTMiCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNDQtMyI+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDA0Ni00IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMwNDhiZmY7c3RvcC1vcGFjaXR5OjAuODMxMzcyNTY7IiAvPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQwNDgtNyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMDQ4YmZmO3N0b3Atb3BhY2l0eToxOyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTUiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODM5LTAtODkiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjY4NzUsMCwwLDEsMzIsNzk2LjM2MjE4KSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzMy0xLTQtNSI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjAuODMwNzY5MjQ7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzgzNS03LTgtMiIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzODM3LTctMC0yIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDA0NC05Ij4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ2LTMiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzIxOWJlMjtzdG9wLW9wYWNpdHk6MC44MzEzNzI1NjsiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDA0OC04IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMyMTliZTI7c3RvcC1vcGFjaXR5OjE7IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDA4NC03Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6Izc1ZGQyNjtzdG9wLW9wYWNpdHk6MC44MzEzNzI1NjsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3A0MDg2LTYiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wNDA4OC01IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQxNTkiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuNjg3NSwwLDAsLTEsMjI0LDEwMjAuMzYyMikiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA0NC05IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDE2MSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjM0Mzc1LDAuNTk1MzkyNDcsLTAuODY2MDI1NCwwLjUsMTkwLjg1MTI1LDc0NS4yMjM3NikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQtNyIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQxNjMiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsMC41OTUzOTI0NywwLjg2NjAyNTQsMC41LDY1LjE0ODc1LDc0NS4yMjM3NikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDE3MCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjY4NzUsMCwwLDEsMzIsNzk2LjM2MjE4KSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDQ0IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDE3MiIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC4zNDM3NSwtMC41OTUzOTI0NywwLjg2NjAyNTQsLTAuNSw2NS4xNDg3NDgsMTA3MS41MDA2KSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTQ2OSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA4NCIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQxNzQiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwtMC41OTUzOTI0NywtMC44NjYwMjU0LC0wLjUsMTkwLjg1MTI1LDEwNzEuNTAwNikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY0YTA0O3N0b3Atb3BhY2l0eTowLjgzMDc2OTI0OyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDM4MzUtNy04LTUiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTAtNyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNDQtMiI+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDA0Ni03IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMyMTliZTI7c3RvcC1vcGFjaXR5OjAuODMxMzcyNTY7IiAvPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQwNDgtNCIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eToxOyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQtNiIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQxNzQtMiIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjM0Mzc1LC0wLjU5NTM5MjQ3LC0wLjg2NjAyNTQsLTAuNSwxOTAuODUxMjUsMTA3MS41MDA2KSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTY0MiIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDA4NC02Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6Izc1ZGQyNjtzdG9wLW9wYWNpdHk6MC44MzEzNzI1NjsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3A0MDg2LTAiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wNDA4OC05IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNC01IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDI1My05IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNjg3NSwwLDAsMSwxNzYsODI4LjM2MjE4KSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEtNC00LTUiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY0YTA0O3N0b3Atb3BhY2l0eTowLjgzMDc2OTI0OyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDM4MzUtNy04LTUtMiIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzODM3LTctMC03LTQiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDQ0LTItOSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyNTUtNyIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC4zNDM3NSwtMC41OTUzOTI0NywwLjg2NjAyNTQsLTAuNSwyMDkuMTQ4NzUsMTEwMy41MDA2KSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTQ2OSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDA0NC0yLTkiPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQwNDYtNy03IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMyMTliZTI7c3RvcC1vcGFjaXR5OjAuODMxMzcyNTY7IiAvPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQwNDgtNC01IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMyMTliZTI7c3RvcC1vcGFjaXR5OjE7IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA4NC02LTUiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MjU3LTQiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwtMC41OTUzOTI0NywtMC44NjYwMjU0LC0wLjUsMzM0Ljg1MTI1LDExMDMuNTAwNikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwODQtNi01Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6Izc1ZGQyNjtzdG9wLW9wYWNpdHk6MC44MzEzNzI1NjsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3A0MDg2LTAtOSIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6Izc1ZGQyNjtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3A0MDg4LTktMyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIHkyPSItMC45OTQ4NTY0MiIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwtMC41OTUzOTI0NywtMC44NjYwMjU0LC0wLjUsMzM0Ljg1MTI1LDExMDMuNTAwNikiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQzMTciCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTYtNSIKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNCIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQzNTgiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC42ODc1LDAsMCwxLDE3Niw4MjguMzYyMTgpIgogICAgICAgeDE9IjEzOS42MzYzNyIKICAgICAgIHkxPSIxMjgiCiAgICAgICB4Mj0iMTM5LjYzNjM3IgogICAgICAgeTI9IjEuMTM2ODY4NGUtMTMiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwNDQtMiIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQzNjAiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsLTAuNTk1MzkyNDcsMC44NjYwMjU0LC0wLjUsMjA5LjE0ODc1LDExMDMuNTAwNikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQtNiIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQzNjIiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwtMC41OTUzOTI0NywtMC44NjYwMjU0LC0wLjUsMzM0Ljg1MTI1LDExMDMuNTAwNikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNiIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQzNTgtNyIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjY4NzUsMCwwLDEsMTc2LDgyOC4zNjIxOCkiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzMy0xLTQtNC02Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MC44MzA3NjkyNDsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzODM1LTctOC01LTkiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTAtNy0wIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA0NC0yLTgiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MzYwLTQiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsLTAuNTk1MzkyNDcsMC44NjYwMjU0LC0wLjUsMjA5LjE0ODc1LDExMDMuNTAwNikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNDQtMi04Ij4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ2LTctMyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eTowLjgzMTM3MjU2OyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ4LTQtNiIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eToxOyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQtNi02IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDM2Mi00IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsLTAuNTk1MzkyNDcsLTAuODY2MDI1NCwtMC41LDMzNC44NTEyNSwxMTAzLjUwMDYpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NjQyIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDg0LTYtNiI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjAuODMxMzcyNTY7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wNDA4Ni0wLTAiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wNDA4OC05LTgiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC00LTUtOSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyNTMtOS02IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNjg3NSwwLDAsMSwxNzYsODI4LjM2MjE4KSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEtNC00LTUtOSI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjAuODMwNzY5MjQ7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzgzNS03LTgtNS0yLTciIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTAtNy00LTMiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDQ0LTItOS0zIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDI1NS03LTEiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsLTAuNTk1MzkyNDcsMC44NjYwMjU0LC0wLjUsMjA5LjE0ODc1LDExMDMuNTAwNikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNDQtMi05LTMiPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQwNDYtNy03LTUiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzIxOWJlMjtzdG9wLW9wYWNpdHk6MC44MzEzNzI1NjsiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDA0OC00LTUtMyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eToxOyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIHkyPSItMC45OTQ4NTY0MiIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwtMC41OTUzOTI0NywtMC44NjYwMjU0LC0wLjUsMzM0Ljg1MTI1LDExMDMuNTAwNikiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQzMTctOCIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQtNi01LTUiCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwODQtNi01LTUiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNzVkZDI2O3N0b3Atb3BhY2l0eTowLjgzMTM3MjU2OyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDQwODYtMC05LTYiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wNDA4OC05LTMtMyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIHkyPSItMC45OTQ4NTY0MiIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwtMC41OTUzOTI0NywtMC44NjYwMjU0LC0wLjUsMzM0Ljg1MTI1LDExMDMuNTAwNikiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQ0MzQiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTYtNS01IgogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTYtNiIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQ1MDgiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwtMC41OTUzOTI0NywtMC44NjYwMjU0LC0wLjUsNzAyLjg1MTI1LDEwNzEuNTAwNSkiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwNDQtMi04IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDUxMSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC4zNDM3NSwtMC41OTUzOTI0NywwLjg2NjAyNTQsLTAuNSw1NzcuMTQ4NzUsMTA3MS41MDA1KSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTQ2OSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNC02IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDUxNCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjY4NzUsMCwwLDEsNTQ0LC02ZS01KSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC00LTYiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0NTE3IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNjg3NSwwLDAsMSw1ODQsNzk2LjM2MjEyKSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTYtNS01IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDUyMCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC4zNDM3NSwwLjU5NTM5MjQ3LDAuODY2MDI1NCwwLjUsNTc3LjE0ODc1LDc3Ny4yMjM4KSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTY0MiIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA0NC0yLTktMyIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQ1MjMiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwwLjU5NTM5MjQ3LC0wLjg2NjAyNTQsMC41LDcwMi44NTEyNSw3NzcuMjIzOCkiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNS05IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDUyNiIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC42ODc1LDAsMCwtMSw3MzYsMjU2LjAwMDAyKSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC00LTUtOSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQ1MjkiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuNjg3NSwwLDAsLTEsNzc2LDEwNTIuMzYyMikiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNC02IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDUzMiIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjY4NzUsMCwwLDEsNTY0LDc5Ni4zNjIxMikiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNC01LTkiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0NTM0IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0wLjY4NzUsMCwwLC0xLDc1NiwyNTYuMDAwMDIpIgogICAgICAgeDE9IjEzOS42MzYzNyIKICAgICAgIHkxPSIxMjgiCiAgICAgICB4Mj0iMTM5LjYzNjM3IgogICAgICAgeTI9IjEuMTM2ODY4NGUtMTMiIC8+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNS05IgogICAgICAgaWQ9InJhZGlhbEdyYWRpZW50NDUzOSIKICAgICAgIGN4PSI2NjAiCiAgICAgICBjeT0iMTI4IgogICAgICAgZng9IjY2MCIKICAgICAgIGZ5PSIxMjgiCiAgICAgICByPSIxMTIiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLDEuMTQyODU3MSw2MCw3MTAuMDc2NTIpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIC8+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNS05LTgiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQ0NTM5LTciCiAgICAgICBjeD0iNjYwIgogICAgICAgY3k9IjEyOCIKICAgICAgIGZ4PSI2NjAiCiAgICAgICBmeT0iMTI4IgogICAgICAgcj0iMTEyIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwxLjE0Mjg1NzEsLTIwLDc3OC4wNzY0NykiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzMy0xLTQtNC01LTktOCI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjAuODMwNzY5MjQ7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzgzNS03LTgtNS0yLTctOSIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzODM3LTctMC03LTQtMy04IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudAogICAgICAgcj0iMTEyIgogICAgICAgZnk9IjEyOCIKICAgICAgIGZ4PSI2NjAiCiAgICAgICBjeT0iMTI4IgogICAgICAgY3g9IjY2MCIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsMS4xNDI4NTcxLDE2LDMzMC4wNzY1MikiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDQ1NTYiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0NTc1IgogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIiAvPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC00LTUtOS0xIgogICAgICAgaWQ9InJhZGlhbEdyYWRpZW50NDUzOS0wIgogICAgICAgY3g9IjY2MCIKICAgICAgIGN5PSIxMjgiCiAgICAgICBmeD0iNjYwIgogICAgICAgZnk9IjEyOCIKICAgICAgIHI9IjExMiIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsMS4xNDI4NTcxLC0yMCw3NzguMDc2NDcpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNS05LTEiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY0YTA0O3N0b3Atb3BhY2l0eTowLjgzMDc2OTI0OyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDM4MzUtNy04LTUtMi03LTYiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTAtNy00LTMtMCIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIHI9IjExMiIKICAgICAgIGZ5PSIxMjgiCiAgICAgICBmeD0iNjYwIgogICAgICAgY3k9IjEyOCIKICAgICAgIGN4PSI2NjAiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMTI0OTk5OTksMCwwLDAuMTQyODU3MTMsNzk3LjUsNjc4LjA3NjUyKSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgaWQ9InJhZGlhbEdyYWRpZW50NDU1Ni0zIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDU3NS0yIgogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0NTc1LTIiPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQ1NzctNiIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojODE4MTgxO3N0b3Atb3BhY2l0eTowLjgzMDc2OTI0OyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0NTc5LTQiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzcwNzA3MDtzdG9wLW9wYWNpdHk6MTsiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICByPSIxMTIiCiAgICAgICBmeT0iMTI4IgogICAgICAgZng9IjY2MCIKICAgICAgIGN5PSIxMjgiCiAgICAgICBjeD0iNjYwIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjEyNDk5OTk5LDAsMCwwLjE0Mjg1NzEzLDczMy41MDAwMSw2NzguMDc2NTIpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQ0NjAxIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNC01LTktMSIKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIgLz4KICAgIDxyYWRpYWxHcmFkaWVudAogICAgICAgcj0iMTEyIgogICAgICAgZnk9IjEyOCIKICAgICAgIGZ4PSI2NjAiCiAgICAgICBjeT0iMTI4IgogICAgICAgY3g9IjY2MCIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsMS4xNDI4NTcxLDIzNiw3NzguMDc2NDcpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQ0NTU2LTUiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0NTc1LTMiCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQ1NzUtMyI+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDU3Ny05IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM4MTgxODE7c3RvcC1vcGFjaXR5OjAuODMwNzY5MjQ7IiAvPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQ1NzktOCIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNzA3MDcwO3N0b3Atb3BhY2l0eToxOyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIHI9IjExMiIKICAgICAgIGZ5PSIxMjgiCiAgICAgICBmeD0iNjYwIgogICAgICAgY3k9IjEyOCIKICAgICAgIGN4PSI2NjAiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMTI0OTk5OTksMCwwLDAuMTQyODU3MTMsODI5LjUwMDAxLDY3OC4wNzY1MikiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDQ2NDUiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0NTc1LTMiCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiIC8+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIHI9IjExMiIKICAgICAgIGZ5PSIxMjgiCiAgICAgICBmeD0iNjYwIgogICAgICAgY3k9IjEyOCIKICAgICAgIGN4PSI2NjAiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLDEuMTQyODU3MSwyMzYsNzc4LjA3NjQ3KSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgaWQ9InJhZGlhbEdyYWRpZW50NDU1Ni04IgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDU3NS0xIgogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0NTc1LTEiPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQ1NzctMiIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwO3N0b3Atb3BhY2l0eTowLjczODQ2MTU1OyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0NTc5LTIiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzAwMDAwMDtzdG9wLW9wYWNpdHk6MTsiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNCIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwMTciCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC42ODc1LDAsMCwxLDMyLDc5Ni4zNjIxOCkiCiAgICAgICB4MT0iMTM5LjYzNjM3IgogICAgICAgeTE9IjEyOCIKICAgICAgIHgyPSIxMzkuNjM2MzciCiAgICAgICB5Mj0iMS4xMzY4Njg0ZS0xMyIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA0NCIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwMTkiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsLTAuNTk1MzkyNDcsMC44NjYwMjU0LC0wLjUsNjUuMTQ4NzQ4LDEwNzEuNTAwNikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDIxIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsLTAuNTk1MzkyNDcsLTAuODY2MDI1NCwtMC41LDE5MC44NTEyNSwxMDcxLjUwMDYpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NjQyIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC00LTU5IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDM1OC0zIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNjg3NSwwLDAsMSwxNzYsODI4LjM2MjE4KSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEtNC00LTU5Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MC44MzA3NjkyNDsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzODM1LTctOC01LTYiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTAtNy01IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA0NC0yLTMiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MzYwLTYiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsLTAuNTk1MzkyNDcsMC44NjYwMjU0LC0wLjUsMjA5LjE0ODc1LDExMDMuNTAwNikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNDQtMi0zIj4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ2LTctMCIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eTowLjgzMTM3MjU2OyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ4LTQtMiIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eToxOyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQtNi03IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDM2Mi0wIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsLTAuNTk1MzkyNDcsLTAuODY2MDI1NCwtMC41LDMzNC44NTEyNSwxMTAzLjUwMDYpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NjQyIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDg0LTYtNyI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjAuODMxMzcyNTY7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wNDA4Ni0wLTQiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wNDA4OC05LTciIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC00LTUtMCIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyNTMtOS0zIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNjg3NSwwLDAsMSwxNzYsODI4LjM2MjE4KSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEtNC00LTUtMCI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjAuODMwNzY5MjQ7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzgzNS03LTgtNS0yLTEiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTAtNy00LTYiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDQ0LTItOS01IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDI1NS03LTciCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsLTAuNTk1MzkyNDcsMC44NjYwMjU0LC0wLjUsMjA5LjE0ODc1LDExMDMuNTAwNikiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNDQtMi05LTUiPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQwNDYtNy03LTciCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzIxOWJlMjtzdG9wLW9wYWNpdHk6MC44MzEzNzI1NjsiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIGlkPSJzdG9wNDA0OC00LTUtOCIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eToxOyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIHkyPSItMC45OTQ4NTY0MiIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwtMC41OTUzOTI0NywtMC44NjYwMjU0LC0wLjUsMzM0Ljg1MTI1LDExMDMuNTAwNikiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQzMTctODkiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTYtNS0wIgogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDg0LTYtNS0wIj4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6Izc1ZGQyNjtzdG9wLW9wYWNpdHk6MC44MzEzNzI1NjsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3A0MDg2LTAtOS03IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNzVkZDI2O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDQwODgtOS0zLTgiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEtNC0zIj4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MC43NDUwOTgwNTsiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzODM1LTctOC0xMCIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzODM3LTctMC0zIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDA0NC03Ij4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ2LTMyIgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMyMTliZTI7c3RvcC1vcGFjaXR5OjAuNzQ1MDk4MDU7IiAvPgogICAgICA8c3RvcAogICAgICAgICBpZD0ic3RvcDQwNDgtMiIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eToxOyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwODQtNSI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3NWRkMjY7c3RvcC1vcGFjaXR5OjAuNzQ1MDk4MDU7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wNDA4Ni0zIiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNzVkZDI2O3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDQwODgtMyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM4MzMtMS00LTUtMiI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM1OTA0ZmY7c3RvcC1vcGFjaXR5OjAuNzQ1MDk4MDU7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzgzNS03LTgtMi04IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNTkwNGZmO3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDM4MzctNy0wLTItNSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNDQtOS0wIj4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ2LTMtOCIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eTowLjgzMTM3MjU2OyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgaWQ9InN0b3A0MDQ4LTgtNiIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMjE5YmUyO3N0b3Atb3BhY2l0eToxOyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQtNy0zIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDE2My05IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0wLjM0Mzc1LDAuNTk1MzkyNDcsMC44NjYwMjU0LDAuNSw2NS4xNDg3NSw3NDUuMjIzNzYpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NjQyIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDg0LTctMyI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNkMmRkMjY7c3RvcC1vcGFjaXR5OjAuNzQ1MDk4MDU7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wNDA4Ni02LTMiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNkMmRkMjY7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wNDA4OC01LTciIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTYtNyIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyMzUiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwtMC41OTUzOTI0NywtMC44NjYwMjU0LC0wLjUsNTI2Ljg1MTI1LDEyOTEuNTAwNykiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwNDQtMi0zIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDIzOCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC4zNDM3NSwtMC41OTUzOTI0NywwLjg2NjAyNTQsLTAuNSw0MDEuMTQ4NzUsMTI5MS41MDA3KSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTQ2OSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNC01OSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyNDEiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC42ODc1LDAsMCwxLDM1Miw0MDMuOTk5OTkpIgogICAgICAgeDE9IjEzOS42MzYzNyIKICAgICAgIHkxPSIxMjgiCiAgICAgICB4Mj0iMTM5LjYzNjM3IgogICAgICAgeTI9IjEuMTM2ODY4NGUtMTMiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNTkiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MjQ0IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNjg3NSwwLDAsMSw0NjgsMTAxNi4zNjIyKSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTYtNS0wIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDI0NyIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC4zNDM3NSwwLjU5NTM5MjQ3LDAuODY2MDI1NCwwLjUsNDAxLjE0ODc1LDk5Ny4yMjM5KSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTY0MiIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDA0NC0yLTktNSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyNTAiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwwLjU5NTM5MjQ3LC0wLjg2NjAyNTQsMC41LDUyNi44NTEyNSw5OTcuMjIzOSkiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTQtNS0wIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDI1MyIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC42ODc1LDAsMCwtMSw1NDQsNjYwLjAwMDA5KSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTYtNSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyNTciCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsMC41OTUzOTI0NywwLjg2NjAyNTQsMC41LDQwMS4xNDg3NSw3MDkuMjIzOSkiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwNDQtMi05IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDI2MCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjM0Mzc1LDAuNTk1MzkyNDcsLTAuODY2MDI1NCwwLjUsNTI2Ljg1MTI1LDcwOS4yMjM5KSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTQ2OSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNC01IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDI2MyIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC42ODc1LDAsMCwtMSw1NjAsOTg0LjM2MjMyKSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC01MiIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDQzODctNyIKICAgICAgIGN4PSIxMDQ2LjUzMTIiCiAgICAgICBjeT0iNTcxLjQyMTg4IgogICAgICAgZng9IjEwNDYuNTMxMiIKICAgICAgIGZ5PSI1NzEuNDIxODgiCiAgICAgICByPSI5NS45OTk5NzciCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEuMTY2NjY2OSwwLDAsMS4zNDcyNTAxLC0yNDQuOTUzMzksODYuNTA1MDM1KSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEtNC01MiI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjAuNzYxNTM4NDU7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzgzNS03LTgtNyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzODM3LTctMC00IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzgzMy0xLTQtMzMiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmY0YTA0O3N0b3Atb3BhY2l0eTowLjc2MTUzODQ1OyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDM4MzUtNy04LTQiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzgzNy03LTAtNiIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00IgogICAgICAgaWQ9InJhZGlhbEdyYWRpZW50NDUyMCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLjE2NjY2NjksMCwwLDEuMzQ3MjUwMSwtMjQ0Ljk1MzM5LDg2LjUwNTAzNSkiCiAgICAgICBjeD0iMTA0Ni41MzEyIgogICAgICAgY3k9IjU3MS40MjE4OCIKICAgICAgIGZ4PSIxMDQ2LjUzMTIiCiAgICAgICBmeT0iNTcxLjQyMTg4IgogICAgICAgcj0iOTUuOTk5OTc3IiAvPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC0zMyIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDQ1MjIiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMS4xNjY2NjY5LDAsMCwxLjM0NzI1MDEsMTM5LjA0NjYsLTM2MC4xNDk5NykiCiAgICAgICBjeD0iMTA0Ni41MzEyIgogICAgICAgY3k9IjU3MS40MjE4OCIKICAgICAgIGZ4PSIxMDQ2LjUzMTIiCiAgICAgICBmeT0iNTcxLjQyMTg4IgogICAgICAgcj0iOTUuOTk5OTc3IiAvPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC01MiIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDQ1MjQiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4xNDQzMjY3MywwLDAsMC4xNjY2NjY0Miw5MDcuMTAyMjMsODk3LjEyNjU2KSIKICAgICAgIGN4PSIxMDQ2LjUzMTIiCiAgICAgICBjeT0iNTcxLjQyMTg4IgogICAgICAgZng9IjEwNDYuNTMxMiIKICAgICAgIGZ5PSI1NzEuNDIxODgiCiAgICAgICByPSI5NS45OTk5NzciIC8+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTMzIgogICAgICAgaWQ9InJhZGlhbEdyYWRpZW50NDUzMiIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLjE2NjY2NjksMCwwLDEuMzQ3MjUwMSwxMzkuMDQ2NiwtMzYwLjE0OTk3KSIKICAgICAgIGN4PSIxMDQ2LjUzMTIiCiAgICAgICBjeT0iNTcxLjQyMTg4IgogICAgICAgZng9IjEwNDYuNTMxMiIKICAgICAgIGZ5PSI1NzEuNDIxODgiCiAgICAgICByPSI5NS45OTk5NzciIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQtNy0zIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzI1NyIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC4zNDM3NSwwLjU5NTM5MjQ3LDAuODY2MDI1NCwwLjUsMTQ1LjE0ODc1LDk5Ny4yMjM4MSkiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwMzMiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzMjYwIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsMC41OTUzOTI0NywtMC44NjYwMjU0LDAuNSwyNzAuODUxMjUsOTk3LjIyMzgxKSIKICAgICAgIHgxPSIxMzkuNjM2MzQiCiAgICAgICB5MT0iMTI3Ljk5OTk5IgogICAgICAgeDI9IjE0MC40NzE3OSIKICAgICAgIHkyPSItMC45OTQ4NTQ2OSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzgzMy0xLTQtNS0yIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzI2MyIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMC42ODc1LDAsMCwtMSwzMDQsMTI3Mi4zNjIzKSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC0zIgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDA1OCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjY4NzUsMCwwLDEsLTEwOCwxMDE2LjM2MjIpIgogICAgICAgeDE9IjEzOS42MzYzNyIKICAgICAgIHkxPSIxMjgiCiAgICAgICB4Mj0iMTM5LjYzNjM3IgogICAgICAgeTI9IjEuMTM2ODY4NGUtMTMiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwNDQtNyIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNjAiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsLTAuNTk1MzkyNDcsMC44NjYwMjU0LC0wLjUsLTc0Ljg1MTI1MiwxMjkxLjUwMDcpIgogICAgICAgeDE9IjEzOS42MzYzNCIKICAgICAgIHkxPSIxMjcuOTk5OTkiCiAgICAgICB4Mj0iMTQwLjQ3MTc5IgogICAgICAgeTI9Ii0wLjk5NDg1NDY5IiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MDg0LTUiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDYyIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzQzNzUsLTAuNTk1MzkyNDcsLTAuODY2MDI1NCwtMC41LDUwLjg1MTI1LDEyOTEuNTAwNykiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwODQtNSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNjUiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zNDM3NSwtMC41OTUzOTI0NywtMC44NjYwMjU0LC0wLjUsMjcwLjg1MTI1LDEyOTEuNTAwNykiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU2NDIiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQwNDQtNyIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQwNjgiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzQzNzUsLTAuNTk1MzkyNDcsMC44NjYwMjU0LC0wLjUsMTQ1LjE0ODc1LDEyOTEuNTAwNykiCiAgICAgICB4MT0iMTM5LjYzNjM0IgogICAgICAgeTE9IjEyNy45OTk5OSIKICAgICAgIHgyPSIxNDAuNDcxNzkiCiAgICAgICB5Mj0iLTAuOTk0ODU0NjkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTMiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MDcxIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNjg3NSwwLDAsMSwxMTIsMTAxNi4zNjIyKSIKICAgICAgIHgxPSIxMzkuNjM2MzciCiAgICAgICB5MT0iMTI4IgogICAgICAgeDI9IjEzOS42MzYzNyIKICAgICAgIHkyPSIxLjEzNjg2ODRlLTEzIiAvPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNC0yMCIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDQ1MjAtNCIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLjE2NjY2NjksMCwwLDEuMzQ3MjUwMSwtMjQ0Ljk1MzM5LDg2LjUwNTAzNSkiCiAgICAgICBjeD0iMTA0Ni41MzEyIgogICAgICAgY3k9IjU3MS40MjE4OCIKICAgICAgIGZ4PSIxMDQ2LjUzMTIiCiAgICAgICBmeT0iNTcxLjQyMTg4IgogICAgICAgcj0iOTUuOTk5OTc3IiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzODMzLTEtNC0yMCI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjRhMDQ7c3RvcC1vcGFjaXR5OjAuNzYxNTM4NDU7IgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzgzNS03LTgtOSIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGEwNDtzdG9wLW9wYWNpdHk6MTsiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzODM3LTctMC03NyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIHI9Ijk1Ljk5OTk3NyIKICAgICAgIGZ5PSI1NzEuNDIxODgiCiAgICAgICBmeD0iMTA0Ni41MzEyIgogICAgICAgY3k9IjU3MS40MjE4OCIKICAgICAgIGN4PSIxMDQ2LjUzMTIiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEuMTY2NjY2OSwwLDAsMS4zNDcyNTAxLC0yNDQuOTUzMzksODYuNTA1MDM1KSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgaWQ9InJhZGlhbEdyYWRpZW50NDIwOCIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDM4MzMtMS00LTIwIgogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIiAvPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNCIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDM2MTQiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMS4xNjY2NjY5LDAsMCwxLjM0NzI1MDEsMjE5LjA0NjYxLDg5LjE2Nzc1NykiCiAgICAgICBjeD0iMTA0Ni41MzEyIgogICAgICAgY3k9IjU3MS40MjE4OCIKICAgICAgIGZ4PSIxMDQ2LjUzMTIiCiAgICAgICBmeT0iNTcxLjQyMTg4IgogICAgICAgcj0iOTUuOTk5OTc3IiAvPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNCIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDM2MjUiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMS4xNjY2NjY5LDAsMCwxLjM0NzI1MDEsMjE5LjA0NjYxLDg5LjE2Nzc1NykiCiAgICAgICBjeD0iMTA0Ni41MzEyIgogICAgICAgY3k9IjU3MS40MjE4OCIKICAgICAgIGZ4PSIxMDQ2LjUzMTIiCiAgICAgICBmeT0iNTcxLjQyMTg4IgogICAgICAgcj0iOTUuOTk5OTc3IiAvPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzODMzLTEtNCIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDMyMDkiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4xNDQzMjY5OSwwLDAsMC4xNjY2NjY3MywxMjAxLjUzNTgsODc3LjExNDg4KSIKICAgICAgIGN4PSIxMDQ2LjUzMTIiCiAgICAgICBjeT0iNTcxLjQyMTg4IgogICAgICAgZng9IjEwNDYuNTMxMiIKICAgICAgIGZ5PSI1NzEuNDIxODgiCiAgICAgICByPSI5NS45OTk5NzciIC8+CiAgPC9kZWZzPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0iYmFzZSIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMS4wIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTp6b29tPSIxNiIKICAgICBpbmtzY2FwZTpjeD0iMTYuMzA2MTY1IgogICAgIGlua3NjYXBlOmN5PSIxNi4yMzcyMjUiCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9InB4IgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIKICAgICBzaG93Z3JpZD0idHJ1ZSIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjEyODAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iNzk5IgogICAgIGlua3NjYXBlOndpbmRvdy14PSIwIgogICAgIGlua3NjYXBlOndpbmRvdy15PSIxIgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgZml0LW1hcmdpbi10b3A9IjAiCiAgICAgZml0LW1hcmdpbi1sZWZ0PSIwIgogICAgIGZpdC1tYXJnaW4tcmlnaHQ9IjAiCiAgICAgZml0LW1hcmdpbi1ib3R0b209IjAiCiAgICAgaW5rc2NhcGU6c25hcC1wYWdlPSJ0cnVlIgogICAgIGlua3NjYXBlOnNuYXAtbm9kZXM9InRydWUiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgc2hvd2JvcmRlcj0idHJ1ZSIKICAgICBzaG93Z3VpZGVzPSJ0cnVlIgogICAgIGlua3NjYXBlOmd1aWRlLWJib3g9InRydWUiPgogICAgPGlua3NjYXBlOmdyaWQKICAgICAgIHR5cGU9Inh5Z3JpZCIKICAgICAgIGlkPSJncmlkMzAyMSIKICAgICAgIGVtcHNwYWNpbmc9IjQiCiAgICAgICB2aXNpYmxlPSJ0cnVlIgogICAgICAgZW5hYmxlZD0idHJ1ZSIKICAgICAgIHNuYXB2aXNpYmxlZ3JpZGxpbmVzb25seT0idHJ1ZSIKICAgICAgIHNwYWNpbmd4PSIxNnB4IgogICAgICAgc3BhY2luZ3k9IjE2cHgiCiAgICAgICBkb3R0ZWQ9InRydWUiIC8+CiAgPC9zb2RpcG9kaTpuYW1lZHZpZXc+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhNyI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGcKICAgICBpbmtzY2FwZTpsYWJlbD0iTGF5ZXIgMSIKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlkPSJsYXllcjEiCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEzMzYuNTc4NSwtOTU2LjM1MTg5KSI+CiAgICA8cGF0aAogICAgICAgc3R5bGU9ImNvbG9yOiMwMDAwMDA7ZmlsbDp1cmwoI3JhZGlhbEdyYWRpZW50MzIwOSk7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmU7bWFya2VyOm5vbmU7dmlzaWJpbGl0eTp2aXNpYmxlO2Rpc3BsYXk6aW5saW5lO292ZXJmbG93OnZpc2libGU7ZW5hYmxlLWJhY2tncm91bmQ6YWNjdW11bGF0ZSIKICAgICAgIGQ9Im0gMTM1Mi41Nzg1LDk1Ni4zNTE4OSAwLjI4ODYsMTUuMTM2MjkgMTMuNTY2OCwtNy4xMzUxNiAtMTMuODU1NCwtOC4wMDExMyB6IG0gMCwwIC0xMy44NTU0LDguMDAxMTMgMTMuNTY2Nyw3LjEzNTE2IDAuMjg4NywtMTUuMTM2MjkgeiBtIC0xMy44NTU0LDguMDAxMTMgMCwxNS45OTc3NCAxMi45NTc5LC03LjgxNjIxIC0xMi45NTc5LC04LjE4MTUzIHogbSAwLDE1Ljk5Nzc0IDEzLjg1NTQsOC4wMDExMyAtMC42MDg5LC0xNS4zMTY3IC0xMy4yNDY1LDcuMzE1NTcgeiBtIDEzLjg1NTQsOC4wMDExMyAxMy44NTU0LC04LjAwMTEzIC0xMy4yNTEsLTcuMzE1NTcgLTAuNjA0NCwxNS4zMTY3IHogbSAxMy44NTU0LC04LjAwMTEzIDAsLTE1Ljk5Nzc0IC0xMi45NjI0LDguMTgxNTMgMTIuOTYyNCw3LjgxNjIxIHoiCiAgICAgICBpZD0icGF0aDQwMTYtMy04LTYiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogIDwvZz4KPC9zdmc+Cg==',
    syncIcon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0iTGF5ZXJfMSIKICAgeD0iMHB4IgogICB5PSIwcHgiCiAgIHdpZHRoPSIxNiIKICAgaGVpZ2h0PSIxNiIKICAgdmlld0JveD0iMCAwIDE1Ljk5OTk5OSAxNiIKICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgODcuNSAxMDAiCiAgIHhtbDpzcGFjZT0icHJlc2VydmUiCiAgIGlua3NjYXBlOnZlcnNpb249IjAuNDguMy4xIHI5ODg2IgogICBzb2RpcG9kaTpkb2NuYW1lPSJzeW5jLnN2ZyI+PG1ldGFkYXRhCiAgIGlkPSJtZXRhZGF0YTMwMjIiPjxyZGY6UkRGPjxjYzpXb3JrCiAgICAgICByZGY6YWJvdXQ9IiI+PGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+PGRjOnR5cGUKICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz48L2NjOldvcms+PC9yZGY6UkRGPjwvbWV0YWRhdGE+PGRlZnMKICAgaWQ9ImRlZnMzMDIwIj4KCQoKCQkKCQkKCQoJCQkKCQkJCgkJCgkJCQoJCQkKCQk8L2RlZnM+PHNvZGlwb2RpOm5hbWVkdmlldwogICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICBib3JkZXJvcGFjaXR5PSIxIgogICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICBncmlkdG9sZXJhbmNlPSIxMCIKICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxMjE1IgogICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSI3NzYiCiAgIGlkPSJuYW1lZHZpZXczMDE4IgogICBzaG93Z3JpZD0iZmFsc2UiCiAgIGZpdC1tYXJnaW4tdG9wPSIwIgogICBmaXQtbWFyZ2luLWxlZnQ9IjEiCiAgIGZpdC1tYXJnaW4tcmlnaHQ9IjEiCiAgIGZpdC1tYXJnaW4tYm90dG9tPSIwIgogICBpbmtzY2FwZTp6b29tPSIyOS4zNDAzODEiCiAgIGlua3NjYXBlOmN4PSI2LjI1OTE1MzUiCiAgIGlua3NjYXBlOmN5PSI3LjU5OTcwNjkiCiAgIGlua3NjYXBlOndpbmRvdy14PSI2NSIKICAgaW5rc2NhcGU6d2luZG93LXk9IjI0IgogICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJMYXllcl8xIiAvPgo8ZwogICBpZD0iTGF5ZXJfMV8xXyIKICAgZGlzcGxheT0ibm9uZSIKICAgc3R5bGU9ImRpc3BsYXk6bm9uZSIKICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTUuNTExMTc3LC03Ni41MjQ5OTcpIj4KCTxwYXRoCiAgIGRpc3BsYXk9ImlubGluZSIKICAgZD0ibSA1MS40NzMsNDIuMjU1IC0yLjIwNSwyLjIxMiBjIDEuNDc4LDEuNDc3IDIuMjk1LDMuNDQyIDIuMjk1LDUuNTMzIDAsNC4zMDkgLTMuNTA0LDcuODEyIC03LjgxMiw3LjgxMiBWIDU2LjI1IGwgLTMuMTI1LDMuMTI1IDMuMTI0LDMuMTI1IHYgLTEuNTYyIGMgNi4wMjksMCAxMC45MzgsLTQuOTA2IDEwLjkzOCwtMTAuOTM4IDAsLTIuOTI3IC0xLjE0MSwtNS42NzYgLTMuMjE1LC03Ljc0NSB6IgogICBpZD0icGF0aDI5OTgiCiAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgIHN0eWxlPSJmaWxsOiMwMDAwMDA7ZGlzcGxheTppbmxpbmUiIC8+Cgk8cGF0aAogICBkaXNwbGF5PSJpbmxpbmUiCiAgIGQ9Ik0gNDYuODc1LDQwLjYyNSA0My43NSwzNy41IHYgMS41NjIgYyAtNi4wMywwIC0xMC45MzgsNC45MDcgLTEwLjkzOCwxMC45MzggMCwyLjkyNyAxLjE0MSw1LjY3NiAzLjIxNyw3Ljc0NSBsIDIuMjAzLC0yLjIxMiBDIDM2Ljc1NSw1NC4wNTQgMzUuOTM4LDUyLjA5MSAzNS45MzgsNTAgYyAwLC00LjMwOSAzLjUwNCwtNy44MTIgNy44MTIsLTcuODEyIHYgMS41NjIgbCAzLjEyNSwtMy4xMjUgeiIKICAgaWQ9InBhdGgzMDAwIgogICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICBzdHlsZT0iZmlsbDojMDAwMDAwO2Rpc3BsYXk6aW5saW5lIiAvPgo8L2c+CjxnCiAgIGlkPSJMYXllcl8yIgogICBkaXNwbGF5PSJub25lIgogICBzdHlsZT0iZGlzcGxheTpub25lIgogICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNS41MTExNzcsLTc2LjUyNDk5NykiPgo8L2c+CjxwYXRoCiAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjEiCiAgIGQ9Ik0gMTAgMCBMIDkuMjUgMS45MDYyNSBDIDguMjQyMjMyNyAxLjYxMTk4MTUgNS43OTE0MzkzIDEuMTM1NDQzNCAzLjU5Mzc1IDIuODQzNzUgQyAzLjU5Mzc1IDIuODQzNTY1MyAtMC4zMzY0MjI4MiA1LjQzNzkzODMgMS41IDEwLjQzNzUgTCAzLjE1NjI1IDkuNzE4NzUgQyAzLjE1NjI1IDkuNzE4NzUgMS42MTYzNDQgNi42MDY1NzcxIDQuODQzNzUgNC4xODc1IEMgNC44NDM3NSA0LjE4NzUgNi41Mzk1Mzg2IDMuMDUzNjQyNyA4LjUzMTI1IDMuNTkzNzUgTCA3LjgxMjUgNS40MDYyNSBMIDExLjYyNSAzLjc4MTI1IEwgMTAgMCB6ICIKICAgaWQ9InBhdGgzMDA4IiAvPjxwYXRoCiAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjEiCiAgIGQ9Ik0gMTQgNS41NjI1IEwgMTIuMzQzNzUgNi4yODEyNSBDIDEyLjM0Mzc1IDYuMjgxMjUgMTMuODg0OTQ5IDkuMzk0NzE1NSAxMC42NTYyNSAxMS44MTI1IEMgMTAuNjU2MjUgMTEuODEyNSA4LjkyODgxNjQgMTIuOTQ2NTUyIDYuOTM3NSAxMi40MDYyNSBMIDcuNjg3NSAxMC41OTM3NSBMIDMuODc1IDEyLjE4NzUgTCA1LjQ2ODc1IDE2IEwgNi4yNSAxNC4wOTM3NSBDIDcuMjYxMjUxOCAxNC4zODg4ODIgOS43MTE1MjY2IDE0Ljg2MDQ5NiAxMS45MDYyNSAxMy4xNTYyNSBDIDExLjkwNjI1IDEzLjE1NjI1IDE1LjgzNDIwNyAxMC41NjIwNjIgMTQgNS41NjI1IHogIgogICBpZD0icGF0aDMwMTQiIC8+Cjwvc3ZnPg=='
}
});

define('lib/i18n/locales/en',[], function() {
  return {
    strings: {
      widget: {
        // Bubble text in initial state
        'connect-remotestorage': 'Connect <strong>remoteStorage</strong>',
        // Connect button label
        'connect': 'connect',
        'sync': 'sync',
        'disconnect': 'disconnect',
        'permissions': 'Permissions',
        'all-data': 'All data',
        'synchronizing': 'Syncing <strong>{userAddress}</strong>',
        'connecting': 'Connecting <strong>{userAddress}</strong>',
        'offline': '<strong>{userAddress}</strong> (offline)',
        'unauthorized': 'Unauthorized! Click to reconnect.',
        'redirecting': 'Redirecting to <strong>{hostName}</strong>',
        'typing-hint': 'This app allows you to use your own storage! Find more info on <a href="http://remotestorage.io/" target="_blank">remotestorage.io</a>',
        'last-synced': '{t}',
        'webfinger-failed': "{message}",
        'webfinger-error-no-at': "The user address doesn’t seem to be correct, there is no @-sign in it.",
        'webfinger-error-multiple-at': "The user address doesn’t seem to be correct, there is more than one @-sign in it.",
        'webfinger-error-non-dotalphanum': "The user address doesn’t seem to be correct, there are invalid characters in it.",
        'webfinger-error-invalid-xml': 'The server doesn’t seem to support remoteStorage. Please update it, and <a href="http://remotestorage.io/community/" target="_blank">let us know</a> if you need help.',
        'webfinger-error-invalid-jrd': 'The server doesn’t seem to support remoteStorage. Please update it, and <a href="http://remotestorage.io/community/" target="_blank">let us know</a> if you need help.',
        'webfinger-error-not-supported': 'The server doesn’t seem to support remoteStorage. Please update it, and <a href="http://remotestorage.io/community/" target="_blank">let us know</a> if you need help.',
        'webfinger-error-requests-failed': 'Oops, we couldn’t find the remoteStorage server. Are you sure the address is correct?',
        'webfinger-error-timeout': 'Oops, the remoteStorage server didn’t reply. Are you sure the address is correct?',
        'error': 'Sorry! An error occurred.',
        // reset button
        'reset': "Okay, get me out of here",
        'error-info': 'If this problem persists, please <a href="http://remotestorage.io/community/" target="_blank">let us know</a>!',
        'reset-confirmation-message': "Are you sure you want to reset everything? That will probably make the error go away, but also clear your entire localStorage and reload the page. Please make sure you know what you are doing, before clicking 'yes' :-)"
      }
    },

    helpers: {
      timeAgo: function(usec) {
        function format(time, unit) {
          time = Math.round(time);
          if(time != 1) {
            unit += 's';
          }
          return time + ' ' + unit + ' ago';
        }
        var sec = usec / 1000;
        if(sec > 3600) {
          return  format(sec / 3600, 'hour')
        } else if(sec > 60) {
          return format(sec / 60, 'minute');
        } else if(sec < 5) {
          return 'just now';
        } else {
          return format(sec, 'second');
        }
      }
    }
  };
});

define('lib/i18n/locales/de',[], function() {
  return {
    strings: {
      widget: {
        'connect-remotestorage': 'Verbinde <strong>remoteStorage</strong>',
        'connect': 'Verbinden',
        'sync': 'Sync',
        'disconnect': 'Verbindung trennen',
        'permissions': "Zugriffsrechte",
        'all-data': "Alle Daten",
        'synchronizing': 'Synchronisiere <strong>{userAddress}</strong>',
        'connecting': 'Verbinde <strong>{userAddress}</strong>...',
        'offline': '<strong>{userAddress}</strong> (offline)',
        'unauthorized': 'Zugriff fehlgeschlagen. Klicke um neu zu verbinden.',
        'redirecting': 'Leite weiter zu <strong>{hostName}</strong>...',
        'typing-hint': 'Du kannst diese App mit deinem eigenen Cloud-Storage verbinden! Mehr Infos auf <a href="http://remotestorage.io/">remotestorage.io</a>',
        'last-synced': '<strong>Zuletzt synchronisiert:</strong> {t}',
        'webfinger-failed': 'Konnte deinen storage nicht finden. Bist du sicher, dass die Adresse stimmt?'
      }
    },

    helpers: {
      timeAgo: function(usec) {
        function format(time, unit) {
          time = Math.round(time);
          if(time != 1) {
            unit += 'n';
          }
          return 'vor ' + time + ' ' + unit;
        }
        var sec = usec / 1000;
        if(sec > 3600) {
          return format(sec / 2600, 'Stunde'); 
        } else if(sec > 60) {
          return format(sec / 60, 'Minute');
        } else {
          return format(sec, 'Sekunde');
        }
      }
    }
  };
});

define('lib/i18n/locales',[
  './locales/en',
  './locales/de'
], function(en, de) {
  return {
    translations: {
      en: en.strings,
      de: de.strings
    },

    helpers: {
      en: en.helpers,
      de: de.helpers
    }
  }
});
define('lib/i18n',[
  './util',
  './i18n/locales'
], function(util, locales) {

  // Namespace: i18n
  //
  // Internationalization & Localization for remoteStorage.js
  //

  var settings = util.getSettingStore('remotestorage_i18n');

  var translations = locales.translations;
  var helpers = locales.helpers;

  var defaultLocale = 'en';
  var storedLocale = settings.get('locale');

  var currentTable = translations[storedLocale || defaultLocale];

  var NotFound = function(keyPath) {
    this.message = "Translation not found: " + keyPath.join(', ');
  };

  var UndefinedLocale = function(locale) {
    Error.apply(this, ["Locale not defined: " + locale]);
  };
  UndefinedLocale.prototype = Error.prototype;

  return {

    // Property: helpers
    // Object of helpers for i18n/l10n.
    // Do not cache or extend this property, it gets replaced when the locale
    // changes.
    //
    // Methods:
    //   timeAgo(usec) - Example: timeAgo(3000); // -> "3 seconds ago"
    //
    helpers: helpers[storedLocale || defaultLocale],

    // Property: defaultLocale
    // Default locale to use when detection fails.
    // Initially set to 'en'.
    defaultLocale: defaultLocale,

    // Property: locales
    // Array of available locales.
    locales: Object.keys(translations),

    // Method: getLocale
    // Get currently used locale.
    getLocale: function() {
      return settings.get('locale') || this.defaultLocale;
    },

    // Method: setLocale
    // Set locale.
    //
    // Parameters:
    //   locale - A string. Must be included in <locales>.
    //
    // Throws <UndefinedLocale> when the locale is unknown.
    setLocale: function(locale) {
      if(! (locale in translations)) {
        throw new Error("Locale not found: " + locale);
      }
      currentTable = translations[locale];
      this.helpers = helpers[locale];
      settings.set('locale', locale);
    },

    // Method: autoDetect
    // Automatically determines and sets locale.
    // This won't overwrite a stored locale.
    autoDetect: function() {
      var locale;
      ( storedLocale || (
        (locale = this.detectLocale()) &&
          (locale in translations) &&
          this.setLocale(locale) ) );
    },

    // Method: detectLocale
    //
    // Detects current locale from environment.
    //
    // Sources:
    //   (nodejs)  - process.env.LANG
    //   (browser) - navigator.language
    //
    // Returns:
    //   a locale string or undefined.
    detectLocale: function() {
      var key;
      if(typeof(navigator) !== 'undefined') {
        key = navigator.language.split('-')[0];
      } else if(typeof(process) !== 'undefined') {
        var lang = process.env.LANG;
        if(lang) {
          key = lang.split('_')[0];
        }
      }
      return key;
    },

    // Method: t
    // Look up a translation.
    //
    // Parameters:
    //   (any number of strings) - list of keys to follow in translation tree
    //   variables - (optional) Object, containing variables to replae.
    //
    // Example:
    //   (start code)
    //   // given the translations are as follows:
    //   {
    //     "a": {
    //       "b": {
    //         "c": "Hello {who}!"
    //       }
    //     }
    //   }
    //
    //   // Then the following call:
    //   i18n.t('a', 'b', 'c', { who: 'World' });
    //
    //   // returns:
    //   "Hello World!"
    //
    //
    t: function() {
      try {
        var keys = util.toArray(arguments);
        var last = keys.slice(-1)[0];
        var replacements;
        if(typeof(last) === 'object') {
          replacements = last;
          keys = keys.slice(0, -1);
        }
        var result = currentTable;
        keys.forEach(function(key, index) {
          result = result[key];
          if(! result) {
            console.log("Translation not found in ", result, '(', currentTable, ')', keys, key, index);
            throw new NotFound(keys.slice(0, index + 1));
          }
        });
        if(replacements) {
          for(var k in replacements) {
            var re = new RegExp('\\{' + k + '\\}');
            result = result.replace(re, replacements[k]);
          }
        }
        return result;
      } catch(exception) {
        if(exception instanceof NotFound) {
          return exception.message;
        } else {
          throw exception;
        }
      }
    },

    // Method: clearSettings
    // Clear cached locale settings.
    // Doesn't reset the current in-memory state
    // (i.e. current locale and default locale)
    clearSettings: settings.clear,

    // Exception: UndefinedLocale
    // Thrown when trying to set a locale that isn't defined.
    //
    // Own properties:
    //   locale - the locale string as passed to <setLocale>
    UndefinedLocale: UndefinedLocale
  };
});

define('lib/widget/default',['../util', '../assets', '../i18n'], function(util, assets, i18n) {

  if(typeof(document) === 'undefined') {
    return { display: function() { throw "Widget not supported"; } };
  }

  /*

    Interface: WidgetView

      A stateful view providing interaction with remoteStorage.

    States:
      initial      - not connected
      authing      - in auth flow
      connected    - connected to remote storage, not syncing at the moment
      busy         - connected, syncing at the moment
      offline      - connected, but no network connectivity
      error        - connected, but sync error happened
      unauthorized - connected, but request returned 401


    Event: connect
      Fired when the "connect" action is caused by the user.
    
    Parameters:
      userAddress - The user address to connect to


    Event: disconnect
      Fired when "disconnect" action is requested.


    Event: sync
      Fired when "sync" action is requested


    Event: reconnect
      Fired when reconnect is requested in 'unauthorized' state.


    Method: display
      Display the widget in "initial" state
    
    Parameters:
      domId   - String, id attribute of element to place the widget in (FIXME: put this in the options)
      options - Object, see below.

    Options:
      locale - locale to use. only present when provided by app.


    Method: setState
      Set widget state to given value.

    Parameters:
      state - a string. one of the states listed above.

    Method: redirectTo
      Navigate to given url.

    Parameters:
      url - a string representing https URL to redirect to.

   */

  var gEl = util.bind(document.getElementById, document);
  var cEl = util.bind(document.createElement, document);

  var t = util.curry(i18n.t, 'widget');

  var events = util.getEventEmitter('connect', 'disconnect', 'sync', 'reconnect');

  var browserEvents = [];

  var widgetOptions = {};

  function escape(s) {
    return s.replace(/>/, '&gt;').replace(/</, '&lt;');
  }

  function addEvent(element, eventName, handler) {
    browserEvents.push([element, eventName, handler]);
    element.addEventListener(eventName, handler);
  }

  function clearEvents() {
    browserEvents.forEach(function(event) {
      event[0].removeEventListener(event[1], event[2]);
    });
    browserEvents = [];
  }

  function bubbleHiddenToggler() {
    var visible = false;

    function handleBodyClick(event) {
      toggleBubbleVisibility(event);
      if(event.target !== document.body) {
        event.target.click();
      }
      return false;
    }

    function toggleBubbleVisibility(event) {
      if(event.preventDefault) {
        event.preventDefault();
      }
      if(event.stopPropagation) {
        event.stopPropagation();
      }
      event.cancelBubble = true;
      event.returnValue = false;
      if(visible) {
        addClass(elements.bubble, 'hidden');
        document.body.removeEventListener('click', handleBodyClick);
        document.body.removeEventListener('touchstart', handleBodyClick);
      } else {
        removeClass(elements.bubble, 'hidden'); 
        document.body.addEventListener('click', handleBodyClick);
        document.body.addEventListener('touchstart', handleBodyClick);
      }
      visible = !visible;
      return false;
    }

    return toggleBubbleVisibility;
  }

  var userAddress = '';

  var currentState = 'initial';

  var elements = {};

  var cubeStateIcons = {
    connected: assets.remoteStorageIcon,
    error: assets.remoteStorageIconError,
    offline: assets.remoteStorageIconOffline
  };

  // used to keep track of connection error in "typing" state
  var lastConnectionError, lastFailedAddress;

  var stateViews = {

    initial: function() {
      if(! lastConnectionError) {
        userAddress = '';
      }

      addClass(elements.bubble, 'one-line');

      setBubbleText(t('connect-remotestorage'));
      setBubbleAction(jumpAction('typing'));

      setCubeState('connected');
      setCubeAction(jumpAction('typing'));
    },

    typing: function(connectionError) {
      if(lastConnectionError && lastFailedAddress === userAddress) {
        connectionError = lastConnectionError;
      } else {
        lastConnectionError = connectionError;
        lastFailedAddress = userAddress;
      }
      elements.connectForm.userAddress.setAttribute('value', userAddress);
      setBubbleText(t('connect-remotestorage'));
      elements.bubble.appendChild(elements.connectForm);
      addEvent(elements.connectForm, 'submit', function(event) {
        event.preventDefault();
        userAddress = elements.connectForm.userAddress.value;
        if(userAddress.length > 0) {
          events.emit('connect', userAddress);
        }
      });
      var adjustButton = function() {
        if(elements.connectForm.userAddress.value.length > 0) {
          elements.connectForm.connect.removeAttribute('disabled');
        } else {
          elements.connectForm.connect.setAttribute('disabled', 'disabled');
        }
      };
      elements.connectForm.userAddress.addEventListener('keyup', adjustButton);
	    adjustButton();

      if(connectionError) {
        // error bubbled from webfinger
        setCubeState('error');
        addClass(
          addBubbleHint(t('webfinger-failed', { message: t('webfinger-error-' + connectionError) })),
          'error'
        );
      } else {
        setCubeState('connected');
        addBubbleHint(t('typing-hint'));
      }

      function hideBubble(evt) {
        var e = evt.target;
        while(e) {
          if(e === elements.widget) {
            return true;
          }
          e = e.parentElement;
        }
        evt.preventDefault();
        evt.stopPropagation();
        setState('initial');
        document.body.removeEventListener('click', hideBubble);
        document.body.removeEventListener('touchstart', hideBubble);
        return false;
      }

      setCubeAction(hideBubble);
      document.body.addEventListener('click', hideBubble);
      document.body.addEventListener('touchstart', hideBubble);

      elements.connectForm.userAddress.focus();
    },

    authing: function() {
      setBubbleText(t('connecting', { userAddress: userAddress }));
      addClass(elements.bubble, 'one-line');
      setCubeState('connected');
      addClass(elements.cube, 'remotestorage-loading');
    },

    connected: function() {
      if(widgetOptions.syncShortcut !== false) {
        addEvent(window, 'keydown', function(evt) {
          if(evt.ctrlKey && evt.which == 83) {
            evt.preventDefault();
            events.emit('sync');
            return false;
          }
        });
      }
      addClass(elements.bubble, 'hidden');

      setCubeState('connected');

      setBubbleText('<strong class="userAddress">' + userAddress + '</strong>');

      var content = cEl('div');
      addClass(content, 'content');

      var hint = cEl('div');
      addClass(hint, 'info last-synced-message');

      function updateLastSynced() {
        hint.innerHTML = t('last-synced', { t: i18n.helpers.timeAgo(
          new Date().getTime() - widgetOptions.getLastSyncAt()
        ) });
      }
      addEvent(elements.bubble, 'mouseover', updateLastSynced);

      updateLastSynced();

      content.appendChild(elements.syncButton);
      content.appendChild(hint);
      content.appendChild(elements.disconnectButton);
      addEvent(elements.syncButton, 'click', function() {
        // emulate "busy" state for a second (i.e. one animation cycle) to
        // give the user feedback that sync is happening, even though the
        // cube wouldn't be animated until there are PUT / DELETE requests
        setState('busy')
        // actual sync is delayed until after the animation cycle, so there
        // are no 'busy' / 'connected' race conditions.
        setTimeout(function() {
          setState('connected');
          events.emit('sync');
        }, 1000);
      });
      addEvent(elements.disconnectButton, 'click', disconnectAction);

      elements.bubble.appendChild(content);

      setCubeAction(bubbleHiddenToggler());
    },

    busy: function(initialSync) {
      setCubeState('connected');
      addClass(elements.cube, 'remotestorage-loading');
      addClass(elements.bubble, 'one-line');
      if(initialSync) {
        setBubbleText(t('connecting', { userAddress: userAddress }));
      } else {
        addClass(elements.bubble, 'hidden');
        setBubbleText(t('synchronizing', { userAddress: userAddress }));
        setCubeAction(bubbleHiddenToggler());
      }
    },

    error: function(error) {
      setCubeState('error');
      setBubbleText(t('error'));
      var trace = cEl('pre');
      elements.bubble.appendChild(trace);
      if(error instanceof Error) {
        trace.innerHTML = '<strong>' + escape(error.message) + '</strong>' +
          "\n" + escape(error.stack);
      } else if(typeof(error) === 'object') {
        trace.innerHTML = JSON.stringify(error, null, 2);
      } else {
        trace.innerHTML = error;
      }
      var errorInfo = document.createElement('p');
      errorInfo.setAttribute('class', 'remotestorage-error-info');
      errorInfo.innerHTML = t('error-info');
      var resetButton = document.createElement('button');
      resetButton.setAttribute('class', 'remotestorage-reset');
      resetButton.innerHTML = t('reset');
      resetButton.addEventListener('click', function() {
        if(confirm(t('reset-confirmation-message'))) {
          // FIXME: don't clear localStorage here, but instead fire some event.
          localStorage.clear();
          document.location = String(document.location).split('#')[0];
        }
      });
      elements.bubble.appendChild(errorInfo);
      elements.bubble.appendChild(resetButton);
    },

    offline: function(error) {
      setCubeState('offline');
      addClass(elements.bubble, 'one-line hidden');
      setCubeAction(bubbleHiddenToggler());
      setBubbleText(t('offline', { userAddress: userAddress }));
    },

    unauthorized: function() {
      setCubeState('error');
      setBubbleText('<strong>' + userAddress + '</strong><br>' + t('unauthorized') + '<br>');
      setCubeAction(util.curry(events.emit, 'reconnect'));
      setBubbleAction(util.curry(events.emit, 'reconnect'));
      elements.bubble.appendChild(elements.disconnectButton);
      addEvent(elements.disconnectButton, 'click', disconnectAction);
    }

  };

  function disconnectAction(event) {
    event.preventDefault();
    events.emit('disconnect');
    if(currentState === 'error') {
      setState('initial');
    }
    return false;
  }

  function getClassNameMap(element) {
    var classNames = (element.getAttribute('class') || '').split(/\s+/);
    var nameMap = {};
    classNames.forEach(function(name) {
      nameMap[name] = true;
    });    
    return nameMap;
  }

  function setClassNameMap(element, nameMap) {
    element.setAttribute('class', Object.keys(nameMap).join(' '));
  }

  function addClass(element, className) {
    var nameMap = getClassNameMap(element);
    nameMap[className] = true;
    setClassNameMap(element, nameMap);
  }

  function removeClass(element, className) {
    var nameMap = getClassNameMap(element);
    delete nameMap[className];
    setClassNameMap(element, nameMap);
  }

  function resetElementState() {
    elements.cube.setAttribute('class', 'cube');
    elements.bubble.setAttribute('class', 'bubble');
    elements.connectForm.userAddress.setAttribute('value', '');

    elements.connectForm.userAddress.removeAttribute('disabled');
    elements.connectForm.connect.removeAttribute('disabled');

    elements.connectForm.connect.setAttribute('title', t('connect'));
    elements.syncButton.setAttribute('title', t('sync'));
    elements.disconnectButton.setAttribute('title', t('disconnect'));
  }
  
  function prepareWidget() {
    elements.style = cEl('style');
    elements.style.innerHTML = assets.widgetCss;
    // #remotestorage-widget
    elements.widget = cEl('div');
    elements.widget.setAttribute('id', 'remotestorage-widget');
    elements.widget.setAttribute('class', 'remotestorage-state-initial');
    // .cube
    elements.cube = cEl('img');
    // .bubble
    elements.bubble = cEl('div');

    elements.widget.appendChild(elements.bubble);
    elements.widget.appendChild(elements.cube);

    // form.connect
    elements.connectForm = cEl('form');
    elements.connectForm.setAttribute('novalidate', '');
    elements.connectForm.innerHTML = [
      '<input type="email" placeholder="user@provider.com" name="userAddress" novalidate>',
      '<button class="connect" value="" name="connect">'
    ].join('');
    var connectIcon = cEl('img');
    connectIcon.setAttribute('src', assets.connectIcon);
    elements.connectForm.connect.appendChild(connectIcon);
    // button.sync
    elements.syncButton = cEl('button');
    elements.syncButton.setAttribute('class', 'sync');
    var syncIcon = cEl('img');
    syncIcon.setAttribute('src', assets.syncIcon);
    elements.syncButton.appendChild(syncIcon);
    // button.disconnect
    elements.disconnectButton = cEl('button');
    elements.disconnectButton.setAttribute('class', 'disconnect');
    var disconnectIcon = cEl('img');
    disconnectIcon.setAttribute('src', assets.disconnectIcon);
    elements.disconnectButton.appendChild(disconnectIcon);

    resetElementState();
  }

  function clearWidget() {
    Array.prototype.forEach.call(elements.bubble.children, function(child) {
      elements.bubble.removeChild(child);
    });
    clearEvents();
    resetElementState();
  }

  function updateWidget() {
    var stateView = stateViews[currentState];
    if(stateView) {
      clearWidget();
      stateView.apply(this, arguments);
    }
  }

  function addBubbleHint(text) {
    var hint = cEl('div');
    addClass(hint, 'info');
    hint.innerHTML = text;
    elements.bubble.appendChild(hint);
    return hint;
  }

  function setBubbleText(text) {
    elements.bubble.innerHTML = '<div class="bubble-text">' + text + '</div>';
  }

  function setBubbleAction(action) {
    addClass(elements.bubble, 'action');
    addEvent(elements.bubble, 'click', action);
  }

  function setCubeAction(action) {
    addClass(elements.cube, 'action');
    addEvent(elements.cube, 'click', action);
  }

  function setCubeState(state) {
    var icon = cubeStateIcons[state];
    if(! icon) {
      throw "Unknown cube state: " + state;
    }
    elements.cube.setAttribute('src', icon);
  }

  function jumpAction(state) {
    return function(event) {
      if(event) {
        event.preventDefault();
      }
      setState(state);
      return false;
    };
  }

  // PUBLIC

  function display(element, options) {
    if(! options) {
      options = {};
    }
    widgetOptions = options;

    i18n.setLocale('en');

    if(! element) {
      element = document.body;
    } else if(typeof(element) === 'string') {
      element = gEl(element);
    }

    prepareWidget();
    element.appendChild(elements.style);
    element.appendChild(elements.widget);
    updateWidget();
  }

  function setState(state) {
    var args = Array.prototype.slice.call(arguments, 1);
    currentState = state;
    elements.widget.setAttribute('class', 'remotestorage-state-' + state);
    util.nextTick(function() {
      updateWidget.apply(undefined, args);
    });
  }

  function redirectTo(url) {
    setBubbleText(t('redirecting', { hostName: util.hostNameFromUri(url) }));
    addClass(elements.bubble, 'one-line');
    setTimeout(function() {
      document.location = url;
    }, 500);
  }

  function setUserAddress(addr) {
    userAddress = addr;
    elements.connectForm.userAddress.setAttribute('value', addr);
  }

  function getLocation() {
    return document.location.href;
  }

  function setLocation(url) {
    document.location = url;
  }

  return util.extend({

    display: display,
    setState: setState,
    redirectTo: redirectTo,
    setUserAddress: setUserAddress,
    getLocation: getLocation,
    setLocation: setLocation

  }, events);

});

define('lib/widget',[
  './util',
  './webfinger',
  './wireClient',
  './sync',
  './store',
  './schedule',
  './baseClient',
  './platform',
  './getputdelete',
  './widget/default'
], function(util, webfinger, wireClient, sync, store, schedule, BaseClient,
            platform, getputdelete, defaultView) {

  // Namespace: widget
  //
  // The remoteStorage widget.
  //
  // See <remoteStorage.displayWidget>
  //
  //
  // Event: ready
  //   Fired when the user has connected and the initial synchronization
  //   has been performed. After this has fired your app can query and
  //   display data.
  //
  // Event: disconnect
  //   Fired when the user has clicked the 'disconnect' button and all
  //   locally cached data has been removed. At this point your app should
  //   remove all visible user-owned data from the screen and return to
  //   it's initial state.
  //
  // Event: state
  //   Fired whenever the internal state of the widget changes.
  //   Apps usually don't need to use this event, it is only included
  //   for debugging purposes and legacy support.
  //
  //   Parameters:
  //     state - A String. The new state the widget moved into.
  //


  

  var settings = util.getSettingStore('remotestorage_widget');
  var events = util.getEventEmitter('ready', 'disconnect', 'state');
  var logger = util.getLogger('widget');

  var maxTimeout = 45000;
  var timeoutAdjustmentFactor = 1.5;

  // the view.
  var view = defaultView;
  // options passed to displayWidget
  var widgetOptions = {};
  // passed to display() to avoid circular deps
  var remoteStorage;

  var reconnectInterval = 1000;

  var offlineTimer = null;

  var viewState;

  function calcReconnectInterval() {
    var i = reconnectInterval;
    if(reconnectInterval < 10000) {
      reconnectInterval *= 2;
    }
    return i;
  }

  var stateActions = {
    offline: function() {
      if(! offlineTimer) {
        offlineTimer = setTimeout(function() {
          offlineTimer = null;
          sync.fullSync().
            then(function() {
              schedule.enable();
            });
        }, calcReconnectInterval());
      }
    },
    connected: function() {
      if(offlineTimer) {
        clearTimeout(offlineTimer);
        offlineTimer = null;
      }
    }
  };
  

  function setState(state) {
    if(state === viewState) {
      return;
    }
    viewState = state;
    var action = stateActions[state];
    if(action) {
      action.apply(null, arguments);
    }
    view.setState.apply(view, arguments);
    events.emit('state', state);    
  }

  function requestToken(authEndpoint) {
    logger.info('requestToken', authEndpoint);
    var redirectUri = (widgetOptions.redirectUri || view.getLocation());
    var state;
    var md = redirectUri.match(/^(.+)#(.*)$/);
    if(md) {
      redirectUri = md[1];
      state = md[2];
    }
    var clientId = util.hostNameFromUri(redirectUri);
    authEndpoint += authEndpoint.indexOf('?') > 0 ? '&' : '?';
    var params = [
      ['redirect_uri', redirectUri],
      ['client_id', clientId],
      ['scope', remoteStorage.access.scopeParameter],
      ['response_type', 'token']
    ];
    if(typeof(state) === 'string' && state.length > 0) {
      params.push(['state', state]);
    }
    authEndpoint += params.map(function(kv) {
      return kv[0] + '=' + encodeURIComponent(kv[1]);
    }).join('&');
    console.log('redirecting to', authEndpoint);
    return view.redirectTo(authEndpoint);
  }

  function connectStorage(userAddress) {
    settings.set('userAddress', userAddress);
    setState('authing');
    return webfinger.getStorageInfo(userAddress).
      then(remoteStorage.setStorageInfo, function(error) {
        if(error === 'timeout') {
          adjustTimeout();
        }
        setState((typeof(error) === 'string') ? 'typing' : 'error', error);
      }).
      then(function(storageInfo) {
        if(storageInfo) {
          requestToken(storageInfo.properties['auth-endpoint']);
          schedule.enable();
        }
      }, util.curry(setState, 'error'));
  }

  function reconnectStorage() {
    connectStorage(settings.get('userAddress'));
  }

  function disconnectStorage() {
    schedule.disable();
    remoteStorage.flushLocal();
    events.emit('state', 'disconnected');
    events.emit('disconnect');
  }

  // destructively parse query string from URI fragment
  function parseParams() {
    var md = view.getLocation().match(/^(.*?)#(.*)$/);
    var result = {};
    if(md) {
      var hash = md[2];
      hash.split('&').forEach(function(param) {
        var kv = param.split('=');
        if(kv[1]) {
          result[kv[0]] = decodeURIComponent(kv[1]);
        }
      });
      if(Object.keys(result).length > 0) {
        view.setLocation(md[1] + '#');
      }
    }
    return result; 
  }

  function processParams() {
    var params = parseParams();

    // Query parameter: access_token
    if(params.access_token) {
      wireClient.setBearerToken(params.access_token);
    }
    // Query parameter: remotestorage
    if(params.remotestorage) {
      view.setUserAddress(params.remotestorage);
      setTimeout(function() {
        if(wireClient.getState() !== 'connected') {
          connectStorage(params.remotestorage);
        }
      }, 0);
    } else {
      var userAddress = settings.get('userAddress');
      if(userAddress) {
        view.setUserAddress(userAddress);
      }
    }
    // Query parameter: state
    if(params.state) {
      view.setLocation(view.getLocation().split('#')[0] + '#' + params.state);
    }
  }

  function handleSyncError(error) {
    if(error.message === 'unauthorized') {
      setState('unauthorized');
    } else if(error.message === 'network error') {
      setState('offline', error);
    } else {
      setState('error', error);
    }
  }

  function adjustTimeout() {
    var t = getputdelete.getTimeout();
    if(t < maxTimeout) {
      t *= timeoutAdjustmentFactor;
      webfinger.setTimeout(t);
      getputdelete.setTimeout(t);
    }
  }

  function handleSyncTimeout() {
    adjustTimeout();
    schedule.disable();
    setState('offline');
  }

  function initialSync() {
    if(settings.get('initialSyncDone')) {
      schedule.enable();
      store.fireInitialEvents().then(util.curry(events.emit, 'ready'));
    } else {
      setState('busy', true);
      sync.fullSync().then(function() {
        schedule.enable();
        settings.set('initialSyncDone', true);
        setState('connected');
        events.emit('ready');
      }, handleSyncError);
    }
  }

  function display(_remoteStorage, element, options) {
    remoteStorage = _remoteStorage;
    widgetOptions = options;
    if(! options) {
      options = {};
    }

    options.getLastSyncAt = function() {
      return (sync.lastSyncAt || new Date()).getTime();
    };

    schedule.watch('/', 30000);

    view.display(element, options);

    view.on('sync', sync.forceSync);
    view.on('connect', connectStorage);
    view.on('disconnect', disconnectStorage);
    view.on('reconnect', reconnectStorage);

    wireClient.on('busy', util.curry(setState, 'busy'));
    wireClient.on('unbusy', util.curry(setState, 'connected'));
    wireClient.on('connected', function() {
      setState('connected');
      initialSync();
    });
    wireClient.on('disconnected', util.curry(setState, 'initial'));

    BaseClient.on('error', util.curry(setState, 'error'));
    sync.on('error', handleSyncError);
    sync.on('timeout', handleSyncTimeout);

    processParams();

    wireClient.calcState();
  }
  
  return util.extend({
    display : display,

    clearSettings: settings.clear,

    setView: function(_view) {
      view = _view;
    }
  }, events);
});

/*global console */

define('lib/nodeConnect',['./webfinger'], function(webfinger) {

  

  // Namespace: nodeConnect
  //
  // Exposes some internals of remoteStorage.js to allow using it from nodejs.
  //
  // Example:
  //   (start code)
  //
  //   remoteStorage.nodeConnect.setUserAddress('bob@example.com', function(err) {
  //     if(! err) {
  //       remoteStorage.nodeConnect.setBearerToken("my-crazy-token");
  //
  //       console.log("Connected!");
  //
  //       // it's your responsibility to make sure the token given above
  //       // actually allows gives you that access. this line is just to
  //       // inform remoteStorage.js about it:
  //       remoteStorage.claimAccess('contacts', 'r');
  //
  //       console.log("My Contacts: ",
  //         remoteStorage.contacts.list().map(function(c) {
  //           return c.fn }));
  //     }
  //   });
  //
  //   (end code)

  function deprecate(thing, replacement) {
    console.log("WARNING: " + thing + " is deprecated, " + (replacement ? "use " + replacement + " instead." : "without replacement."));
  }

  return function(remoteStorage) {

    return {

    // Method: setUserAddress
      //
      // Set user address and discover storage info.
      //
      // Parameters:
      //   userAddress - the user address as a string
      //   callback    - callback to call once finished
      //
      // As soon as the callback is called, the storage info has been discovered or an error has happened.
      // It receives a single argument, the error. If it's null or undefined, everything is ok.
      setUserAddress: function(userAddress, callback) {
        webfinger.getStorageInfo(userAddress, { timeout: 3000 }, function(err, data) {
          if(err) {
            console.error("Failed to look up storage info for user " + userAddress + ": ", err);
          } else {
            remoteStorage.setStorageInfo(data.type, data.href);
          }

          callback(err);
        });
      },

      // Method: setStorageInfo
      //
      // Set storage info directly.
      //
      // This can be used, if your storage provider doesn't support Webfinger or you
      // simply don't want the extra overhead of discovery.
      //
      // Parameters:
      //   type - type of storage. If your storage supports remotestorage 2012.04, this is "https://www.w3.org/community/rww/wiki/read-write-web-00#simple"
      //   href - base URL of your storage
      //   
      setStorageInfo: function(storageInfo) {
        deprecate('remoteStorage.nodeConnect.setStorageInfo', 'remoteStorage.setStorageInfo');
        return remoteStorage.setStorageInfo(storageInfo);
      },

      // Method: setBearerToken
      //
      // Set bearer token directly.
      //
      setBearerToken: function(bearerToken) {
        deprecate('remoteStorage.nodeConnect.setBearerToken', 'remoteStorage.setBearerToken');
        return remoteStorage.setBearerToken(bearerToken);
      }

    };

  };

});
define('lib/foreignClient',['./util', './baseClient', './getputdelete', './store'], function(util, BaseClient, getputdelete, store) {

  var logger = util.getLogger('foreignClient');

  var knownClients = {};

  store.on('foreign-change', function(event) {
    var userAddress = event.path.split(':')[0];
    var client = knownClients[userAddress];
    if(client) {
      client.events.emit('change', event);
    }
  });

  /*
    Class: ForeignClient
    
    A modified <BaseClient>, to query other people's storage.
   */

  // Constructor: ForeignClient
  //
  // Parameters:
  //   userAddress - A userAddress string in the form user@host.
  //
  // The userAddress must be known to wireClient.
  //
  var ForeignClient = function(userAddress) {
    this.userAddress = userAddress;
    this.pathPrefix = userAddress + ':';

    this.moduleName = 'root', this.isPublic = true;
    this.events = util.getEventEmitter('change', 'error');
    knownClients[userAddress] = this;
    util.bindAll(this);
  };
  
  ForeignClient.prototype = {

    // Method: getPublished
    //
    // Get the 'publishedItems' object for the given module.
    //
    // publishedItems is an object of the form { path : timestamp, ... }.
    //
    // Parameters:
    //   moduleName - (optional) module name to get the publishedItems object for
    //   callback   - callback to call with the result
    //
    // Example:
    //   (start code)
    //   remoteStorage.getForeignClient('user@host', function(client) {
    //     client.getPublished(object, function(publishedItems) {
    //       for(var key in publishedItems) {
    //         console.log("Item: ", key, " published at: ", publishedItems[key]);
    //       }
    //     });
    //   });
    //   (end code)
    getPublished: function(moduleName, callback) {
      var fullPath;
      if(typeof(moduleName) == 'function') {
        callback = moduleName;
        fullPath = '/publishedItems';
      } else {
        fullPath = '/' + moduleName + '/publishedItems';
      }
      this.getObject(fullPath, function(data) {
        if(data) { delete data['@context']; }
        callback(data || {});
      });
    },

    getPublishedObjects: function(moduleName, callback) {
      this.getPublished(moduleName, util.bind(function(list) {
        var paths = Object.keys(list);
        var i = 0;
        var objects = {};
        function loadOne() {
          if(i < paths.length) {
            var key = paths[i++];
            var path = '/' + moduleName + '/' + key;
            this.getObject(path, util.bind(function(object) {
              objects[path] = object;
                
              loadOne.call(this);
            }, this));
          } else {
            callback(objects);
          }
        }

        loadOne.call(this);
      }, this));
    },

    makePath: function(path) {
      return this.pathPrefix + BaseClient.prototype.makePath.call(this, path);
    },

    nodeGivesAccess: function(path, mode) {
      return mode == 'r';
    },

    on: function(eventName, handler) {
      this.events.on(eventName, handler);
    }

  };

  var methodBlacklist = {
    makePath: true,
    getListing: true,
    getAll: true,
    storeDocument: true,
    storeObject: true,
    remove: true,
    nodeGivesAccess: true,
    fetchNow: true,
    syncNow: true,
    on: true
  };

  // inherit some stuff from BaseClient

  for(var key in BaseClient.prototype) {
    if(! methodBlacklist[key]) {
      ForeignClient.prototype[key] = BaseClient.prototype[key];
    }
  }

  return {
    getClient: function(userAddress) {
      var client = knownClients[userAddress];
      return client || new ForeignClient(userAddress);
    }
  };

});

define('lib/access',[], function() {

  var Access = function() {
    this.reset();

    this.__defineGetter__('scopes', function() {
      return Object.keys(this._scopeModeMap);
    });

    this.__defineGetter__('scopeParameter', function() {
      return this.scopes.map(function(module) {
        return (module === 'root' && this.storageType === '2012.04' ? '' : module) + ':' + this.get(module);
      }.bind(this)).join(' ');
    });
  };

  Access.prototype = {
    // not sure yet, if 'set' or 'claim' is better...

    claim: function() {
      this.set.apply(this, arguments);
    },

    set: function(scope, mode) {
      this._adjustRootPaths(scope);
      this._scopeModeMap[scope] = mode;
    },

    get: function(scope) {
      return this._scopeModeMap[scope];
    },

    check: function(scope, mode) {
      var actualMode = this.get(scope);
      return actualMode && (mode === 'r' || actualMode === 'rw');
    },

    reset: function() {
      this.rootPaths = [];
      this._scopeModeMap = {};
    },

    _adjustRootPaths: function(newScope) {
      if('root' in this._scopeModeMap || newScope === 'root') {
        this.rootPaths = ['/'];
      } else if(! (newScope in this._scopeModeMap)) {
        this.rootPaths.push('/' + newScope + '/');
        this.rootPaths.push('/public/' + newScope + '/');
      }
    },

    setStorageType: function(type) {
      this.storageType = type;
    }
  };

  return Access;

});

define('lib/caching',['./util'], function(util) {

  var Caching = function() {
    this.reset();
  };

  Caching.prototype = {

    /**
     ** configuration methods
     **/

    get: function(path) {
      this._validateDirPath(path);
      return this._pathSettingsMap[path];
    },

    set: function(path, settings) {
      this._validateDirPath(path);
      if(typeof(settings) !== 'object') {
        throw new Error("settings is required");
      }
      this._pathSettingsMap[path] = settings;
      this._updateRoots();
    },

    remove: function(path) {
      this._validateDirPath(path);
      delete this._pathSettingsMap[path];
      this._updateRoots();
    },

    reset: function() {
      this.rootPaths = [];
      this._pathSettingsMap = {};
    },

    /**
     ** query methods
     **/

    // Method: descendIntoPath
    //
    // Checks if the given directory path should be followed.
    //
    // Returns: true or false
    descendIntoPath: function(path) {
      this._validateDirPath(path);
      return !! this._query(path);
    },

    // Method: cachePath
    //
    // Checks if given path should be cached.
    //
    // Returns: true or false
    cachePath: function(path) {
      this._validatePath(path);
      var settings = this._query(path);
      return settings && (util.isDir(path) || settings.data);
    },

    /**
     ** private methods
     **/

    // gets settings for given path. walks up the path until it finds something.
    _query: function(path) {
      return this._pathSettingsMap[path] ||
        path !== '/' &&
        this._query(util.containingDir(path));
    },

    _validatePath: function(path) {
      if(typeof(path) !== 'string') {
        throw new Error("path is required");
      }
    },

    _validateDirPath: function(path) {
      this._validatePath(path);
      if(! util.isDir(path)) {
        throw new Error("not a directory path: " + path);
      }
    },

    _updateRoots: function() {
      var roots = {}
      for(var a in this._pathSettingsMap) {
        // already a root
        if(roots[a]) {
          continue;
        }
        var added = false;
        for(var b in this._pathSettingsMap) {
          if(util.pathContains(a, b)) {
            roots[b] = true;
            added = true;
            break;
          }
        }
        if(! added) {
          roots[a] = true;
        }
      }
      this.rootPaths = Object.keys(roots);
    },

  };

  return Caching;
});

define('remoteStorage',[
  'require',
  './lib/widget',
  './lib/store',
  './lib/sync',
  './lib/wireClient',
  './lib/nodeConnect',
  './lib/util',
  './lib/webfinger',
  './lib/foreignClient',
  './lib/baseClient',
  './lib/schedule',
  './lib/i18n',
  './lib/access',
  './lib/caching'
], function(require, widget, store, sync, wireClient, nodeConnect, util, webfinger, foreignClient, BaseClient, schedule, i18n, Access, Caching) {

  

  var modules = {}, moduleNameRE = /^[a-z\-]+$/;

  var logger = util.getLogger('base');

  util.silenceAllLoggers();
  util.unsilenceLogger('base', 'getputdelete');

  function deprecate(thing, replacement) {
    console.log("WARNING: " + thing + " is deprecated, " + (replacement ? "use " + replacement + " instead." : "without replacement."));
  }

  var _access = new Access();
  var _caching = new Caching();

  sync.setAccess(_access);
  sync.setCaching(_caching);
  BaseClient.setCaching(_caching);

  // Namespace: remoteStorage
  //
  // Main remoteStorage object, primary namespace.
  //
  // Provides an interface for defining modules, controlling the widget and configuring
  // access.
  //
  // Most methods here return promises. See the guide for an introduction: <Promises>
  var remoteStorage = {

    access: _access,
    caching: _caching,

    //
    // Method: defineModule
    //
    // Define a new module, with given name.
    // Module names MUST be unique. The given builder will be called
    // immediately, with two arguments, which are both instances of
    // <BaseClient>. The first accesses the private section of a modules
    // storage space, the second the public one. The public area can
    // be read by any client (not just an authenticated one), while
    // it can only be written by an authenticated client with read-write
    // access claimed on it.
    //
    // The builder is expected to return an object, as described under
    // <getModuleInfo>.
    //
    // Parameter:
    //   moduleName - Name of the module to define. MUST be a-z and all lowercase.
    //   builder    - Builder function that holds the module definition.
    //
    // Example:
    //   (start code)
    //
    //   remoteStorage.defineModule('beers', function(privateClient, publicClient) {
    //
    //     function nameToKey(name) {
    //       return name.replace(/\s/, '-');
    //     }
    //
    //     return {
    //       exports: {
    //
    //         addBeer: function(name) {
    //           return privateClient.storeObject('beer', nameToKey(name), {
    //             name: name,
    //             drinkCount: 0
    //           });
    //         },
    //
    //         logDrink: function(name) {
    //           var key = nameToKey(name);
    //           return privateClient.getObject(key).then(function(beer) {
    //             beer.drinkCount++;
    //             return privateClient.storeObject('beer', key, beer);
    //           });
    //         },
    //
    //         publishBeer: function(name) {
    //           var key = nameToKey(name);
    //           return privateClient.getObject(key).then(function(beer) {
    //             return publicClient.storeObject('beer', key, beer);
    //           });
    //         }
    //
    //       }
    //     }
    //   });
    //
    //   // to use that code from an app, you need to add:
    //
    //   remoteStorage.claimAccess('beers', 'rw').then(function() {
    //     remoteStorage.displayWidget()
    //
    //     remoteStorage.beers.addBeer('<replace-with-favourite-beer-kind>');
    //   });
    //
    //   (end code)
    //
    // See also:
    //   <BaseClient>
    //
    defineModule: function(moduleName, builder) {

      if(! moduleNameRE.test(moduleName)) {
        throw 'Invalid moduleName: "'+moduleName+'", only a-z lowercase allowed.';
      }

      var module = builder(
        // private client:
        new BaseClient(moduleName, false),
        // public client:
        new BaseClient(moduleName, true)
      );
      modules[moduleName] = module;
      if(typeof(module) !== 'object' || typeof(module.exports) !== 'object') {
        throw new Error("Invalid module format for module '" + moduleName + "', no 'exports' object returned!");
      }
      this[moduleName] = module.exports;
    },

    //
    // Method: getModuleList
    //
    // list known module names
    //
    // Returns:
    //   Array of module names.
    //
    getModuleList: function() {
      return Object.keys(modules);
    },


    // Method: getClaimedModuleList
    //
    // list of modules currently claimed access on
    //
    // Returns:
    //   Array of module names.
    //
    getClaimedModuleList: function() {
      deprecate('getClaimedModuleList', 'access.scopes');
      return this.access.scopes;
    },

    //
    // Method: getModuleInfo
    //
    // Retrieve meta-information about a given module.
    //
    // If the module doesn't exist, the result will be undefined.
    //
    // Parameters:
    //   moduleName - name of the module
    //
    // Returns:
    //   An object, usually containing the following keys,
    //   * exports - don't ever use this. it's basically the module's instance.
    //   * name - the name of the module, but you knew that already.
    //   * dataHints - an object, describing internas about the module.
    //
    //
    //   Some of the dataHints used are:
    //
    //     objectType <type> - description of an object
    //                         type implemented by the module
    //     "objectType message" - (example)
    //
    //     <attributeType> <objectType>#<attribute> - description of an attribute
    //
    //     "string message#subject" - (example)
    //
    //     directory <path> - description of a path's purpose
    //
    //     "directory documents/notes/" - (example)
    //
    //     item <path> - description of a specific item
    //
    //     "item documents/notes/calendar" - (example)
    //
    //   Hope this helps.
    //
    getModuleInfo: function(moduleName) {
      var moduleInfo = modules[moduleName];
      if(moduleInfo) {
        return util.extend({
          name: moduleName,
          dataHints: {}
        }, moduleInfo);
      }
    },

    //
    // Method: claimAccess
    //
    // Either:
    //   <claimAccess(moduleName, claim)>
    //
    // Or:
    //   <claimAccess(moduleClaimMap)>
    //
    //
    //
    // Method: claimAccess(moduleName, claim)
    //
    // Claim access on a single module
    //
    // You need to claim access to a module before you can
    // access data from it.
    //
    // Parameters:
    //   moduleName - name of the module. For a list of defined modules, use <getModuleList>
    //   claim      - permission to claim, either *r* (read-only) or *rw* (read-write)
    //
    // Example:
    //   > remoteStorage.claimAccess('contacts', 'r').then(remoteStorage.displayWidget).then(initApp);
    //
    // Returns:
    //   A Promise, fulfilled when the access has been claimed.
    //
    // FIXME: this method is currently asynchronous due to internal design issues, but it doesn't need to be.
    //
    // Method: claimAccess(moduleClaimMap)
    //
    // Claim access to multiple modules.
    //
    // Parameters:
    //   moduleClaimMap - a JSON object with module names as keys and claims as values.
    //
    // Example:
    //   > remoteStorage.claimAccess({
    //   >   contacts: 'r',
    //   >   documents: 'rw',
    //   >   money: 'r'
    //   > }).then(remoteStorage.displayWidget).then(initApp);
    //
    // Returns:
    //   A Promise, fulfilled when the access has been claimed.
    //
    // FIXME: this method is currently asynchronous due to internal design issues, but it doesn't need to be.
    //
    claimAccess: function(moduleName, mode) {

      var modeTestRegex = /^rw?$/;
      function testMode(moduleName, mode) {
        if(!modeTestRegex.test(mode)) {
          throw "Claimed access to module '" + moduleName + "' but mode not correctly specified ('" + mode + "').";
        }
      }

      var moduleObj;
      if(typeof moduleName === 'object') {
        moduleObj = moduleName;
      } else {
        testMode(moduleName, mode);
        moduleObj = {};
        moduleObj[moduleName] = mode;
      }

      Object.keys(moduleObj).forEach(util.bind(function(_moduleName) {
        var _mode = moduleObj[_moduleName];
        testMode(_moduleName, _mode);
        return this.claimModuleAccess(_moduleName, _mode);
      }, this));

      // returned promise is deprecated!!!
      return util.getPromise().fulfill();
    },

    // PRIVATE
    claimModuleAccess: function(moduleName, mode) {
      logger.debug('claimModuleAccess', moduleName, mode);
      if(!(moduleName in modules)) {
        throw "Module not defined: " + moduleName;
      }

      if(this.access.get(moduleName)) {
        console.log('claimModuleAccess bailing', moduleName);
        return;
      }

      if(moduleName === 'root') {
        this.access.set(moduleName, mode);
        this.caching.set('/', { data: true });
      } else {
        var privPath = '/'+moduleName+'/';
        var pubPath = '/public/'+moduleName+'/';
        this.access.set(moduleName, mode);
        this.caching.set(privPath, { data: true });
        this.caching.set(pubPath, { data: true }); 
      }
    },

    setBearerToken: function(bearerToken, claimedScopes) {
      wireClient.setBearerToken(bearerToken);
    },

    getBearerToken: function() {
      return wireClient.getBearerToken();
    },

    disconnectRemote : wireClient.disconnectRemote,

    //
    // Method: flushLocal()
    //
    // Forget this ever happened.
    //
    // Delete all locally stored data.
    //
    // Note that if you're using a localStorage backend, this doesn't
    // clear the entire localStorage, but just removes everything
    // remoteStorage.js saved there. Other data your app might
    // have put into localStorage stays there.
    //
    // Call this method to implement "logout".
    //
    // If you are using the widget (which you should!), you don't need this.
    //
    // Example:
    //   > remoteStorage.flushLocal();
    //
    flushLocal       : function(all) {
      return util.getPromise(function(promise) {
        logger.info('flushLocal');
        sync.reset();
        widget.clearSettings();
        schedule.reset();
        wireClient.disconnectRemote();
        i18n.clearSettings();
        if(all === true) {
          this.access.reset();
          this.caching.reset();
        }
        store.forgetAll().then(promise.fulfill);
      }.bind(this));
    },

    wireClient: wireClient,

    //
    // Method: fullSync
    //
    // Synchronize local <-> remote storage.
    //
    // Syncing starts at the access roots (the ones you claimed using claimAccess)
    // and moves down the directory tree.
    // Only nodes with a 'force' flag on themselves or one of their ancestors will
    // be synchronized. Use <BaseClient.use> and <BaseClient.release> to set / unset
    // force flags.
    // The actual changes to either local or remote storage happen in the
    // future, so you should attach change handlers on the modules you're
    // interested in.
    //
    // Returns:
    //   A Promise.
    //
    // If you are interested when the sync is done, or if there were any errors,
    // chain to the promise as shown below.
    //
    // Example:
    //   >
    //   > remoteStorage.claimAccess('money', 'rw');
    //   >
    //   > remoteStorage.money.on('change', function(changeEvent) {
    //   >   // handle change event (update UI etc)
    //   > });
    //   >
    //   > remoteStorage.fullSync().then(function() {
    //   >   // sync done, do whatever you want.
    //   > }, function(error) {
    //   >   // handle error.
    //   > });
    //
    fullSync: sync.fullSync,

    //
    // Method: setWidgetView
    //
    // Set the view object to use by the widget. By default remoteStorage.js uses it's
    // own default view. The default view is designed to work in a browser. If you
    // are using any other platform, you need to implement your own view. See the
    // interface documentation for <WidgetView> for a description of the methods and
    // and events the view should implement.
    //
    // Example:
    //   >
    //   > var myView = {
    //   >   display: function() {
    //   >     // render the widget (or whatever)
    //   >   },
    //   >   // (...)
    //   > };
    //   >
    //   > remoteStorage.setWidgetView(myView);
    //   >
    //   > // claim access, display widget etc.
    //
    setWidgetView: widget.setView,

    //
    // Method: displayWidget
    //
    // Add the remoteStorage widget to the page.
    //
    // *Note* call <claimAccess> before calling displayWidget, otherwise you can't access any actual data.
    //
    // Parameters:
    //   element - (optional) DOM element to append the widget element, defaults to BODY element. May also be the ID of a DOM element.
    //   options - (optional) Options, as described below.
    //   options.locale - Locale to use for the widget. Currently ignored.
    //
    displayWidget: function(element, options) {
      widget.display(remoteStorage, element, util.extend({}, options));
    },

    //
    // Method: on
    //
    // Add event handler. Event handlers are bound on the <widget>, which
    // acts as a controller.
    // See <widget.Events> for available Events.
    //
    // Parameters:
    //   eventType - type of event to add handler to
    //   handler   - handler function
    //
    on: widget.on,

    // Method: onWidget
    // DEPRECATED. Alias for <on>.
    onWidget: function() {
      console.log("WARNING: remoteStorage.onWidget is deprecated, use remoteStorage.on instead.");
      this.on.apply(this, arguments);
    },

    //
    getSyncState: sync.getState,
    //
    setStorageInfo: function(storageInfo) {
      var info = wireClient.setStorageInfo(storageInfo);
      if(info) {
        this.access.setStorageType(info.type);
      }
      return info;
    },

    getStorageHref: wireClient.getStorageHref,

    getStorageType: wireClient.getStorageType,

    getStorageInfo: wireClient.getStorageInfo,

    disableSyncThrottling: sync.disableThrottling,

    util: util,

    // Method: getForeignClient
    //
    // Get a <ForeignClient> instance for a given user.
    //
    // Parameters:
    //   userAddress - a user address in the form user@host
    //   callback - a callback to receive the client
    //
    // If there is no storageInfo cached for this userAddress, this will trigger
    // a webfinger discovery and when that succeeded, return the client through
    // the callback.
    //
    // Example:
    //   (start code)
    //   var client = remoteStorage.getForeignClient('alice@wonderland.lit', function(error, client) {
    //     if(error) {
    //       console.error("Discovery failed: ", error);
    //     } else {
    //       client.getPublishedObjects(function(objects) {
    //         console.log('public stuff', objects);
    //       });
    //     }
    //   });
    //   (end code)
    getForeignClient: function(userAddress, callback) {
      var client = foreignClient.getClient(userAddress);
      if(wireClient.hasStorageInfo(userAddress)) {
        callback(null, client);
      } else {
        webfinger.getStorageInfo(
          userAddress, { timeout: 5000 }, function(err, storageInfo) {
            if(err) {
              callback(err);
            } else {
              wireClient.addStorageInfo(userAddress, storageInfo);
              callback(null, client);
            }
          }
        );
      }
    },

    getClient: function(scope) {
      return new BaseClient(scope);
    },

    // Property: store
    // Public access to <store>
    store: store,

    sync: sync,
    widget: widget,

    i18n: i18n,

    schedule: schedule,

    // for tests only.
    // FIXME: get rid of this by making internas more accessible. can probably be
    //        done with some general redesign of this file.
    _clearModules: function() {
      modules = {};
    }

  };

  remoteStorage.nodeConnect = nodeConnect(remoteStorage);

  util.bindAll(remoteStorage);

  return remoteStorage;
});
  return require('remoteStorage');
});