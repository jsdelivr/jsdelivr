/*!
 * Davis - http://davisjs.com - JavaScript Routing - 0.9.8
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */
;
/**
 * Convinience method for instantiating a new Davis app and configuring it to use the passed
 * routes and subscriptions.
 *
 * @param {Function} config A function that will be run with a newly created Davis.App as its context,
 * should be used to set up app routes, subscriptions and settings etc.
 * @namespace
 * @returns {Davis.App}
 */
Davis = function (config) {
  var app = new Davis.App
  config && config.call(app)
  Davis.$(function () { app.start() })
  return app
};

/**
 * Stores the DOM library that Davis will use.  Can be overriden to use libraries other than jQuery.
 */
if (window.jQuery) {
  Davis.$ = jQuery
} else {
  Davis.$ = null
};

/**
 * Checks whether Davis is supported in the current browser
 *
 * @returns {Boolean}
 */
Davis.supported = function () {
  return (typeof window.history.pushState == 'function')
}

/*!
 * A function that does nothing, used as a default param for any callbacks.
 * 
 * @private
 * @returns {Function}
 */
Davis.noop = function () {}

/**
 * Method to extend the Davis library with an extension.
 *
 * An extension is just a function that will modify the Davis framework in some way,
 * for example changing how the routing works or adjusting where Davis thinks it is supported.
 *
 * Example:
 *     Davis.extend(Davis.hashBasedRouting)
 *
 * @param {Function} extension the function that will extend Davis
 *
 */
Davis.extend = function (extension) {
  extension(Davis)
}

/*!
 * the version
 */
Davis.version = "0.9.8";/*!
 * Davis - utils
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/*!
 * A module that provides wrappers around modern JavaScript so that native implementations are used
 * whereever possible and JavaScript implementations are used in those browsers that do not natively
 * support them.
 */
Davis.utils = (function () {

  /*!
   * A wrapper around native Array.prototype.every.
   *
   * Falls back to a pure JavaScript implementation in browsers that do not support Array.prototype.every.
   * For more details see the full docs on MDC https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
   *
   * @private
   * @param {array} the array to loop through
   * @param {fn} the function to that performs the every check
   * @param {thisp} an optional param that will be set as fn's this value
   * @returns {Array}
   */
  if (Array.prototype.every) {
    var every = function (array, fn) {
      return array.every(fn, arguments[2])
    }
  } else {
    var every = function (array, fn) {
      if (array === void 0 || array === null) throw new TypeError();
      var t = Object(array);
      var len = t.length >>> 0;
      if (typeof fn !== "function") throw new TypeError();

      var thisp = arguments[2];
      for (var i = 0; i < len; i++) {
        if (i in t && !fn.call(thisp, t[i], i, t)) return false;
      }

      return true;
    }
  };

  /*!
   * A wrapper around native Array.prototype.forEach.
   *
   * Falls back to a pure JavaScript implementation in browsers that do not support Array.prototype.forEach.
   * For more details see the full docs on MDC https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
   *
   * @private
   * @param {array} the array to loop through
   * @param {fn} the function to apply to every element of the array
   * @param {thisp} an optional param that will be set as fn's this value
   * @returns {Array}
   */
  if (Array.prototype.forEach) {
    var forEach = function (array, fn) {
      return array.forEach(fn, arguments[2])
    }
  } else {
    var forEach = function (array, fn) {
      if (array === void 0 || array === null) throw new TypeError();
      var t = Object(array);
      var len = t.length >>> 0;
      if (typeof fn !== "function") throw new TypeError();
      

      var thisp = arguments[2];
      for (var i = 0; i < len; i++) {
        if (i in t) fn.call(thisp, t[i], i, t);
      }
    };
  };

  /*!
   * A wrapper around native Array.prototype.filter.
   * Falls back to a pure JavaScript implementation in browsers that do not support Array.prototype.filter.
   * For more details see the full docs on MDC https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter
   *
   * @private
   * @param {array} the array to filter
   * @param {fn} the function to do the filtering
   * @param {thisp} an optional param that will be set as fn's this value
   * @returns {Array}
   */
  if (Array.prototype.filter) {
    var filter = function (array, fn) {
      return array.filter(fn, arguments[2])
    }
  } else {
    var filter = function(array, fn) {
      if (array === void 0 || array === null) throw new TypeError();
      var t = Object(array);
      var len = t.length >>> 0;
      if (typeof fn !== "function") throw new TypeError();
      

      var res = [];
      var thisp = arguments[2];
      for (var i = 0; i < len; i++) {
        if (i in t) {
          var val = t[i]; // in case fn mutates this
          if (fn.call(thisp, val, i, t)) res.push(val);
        }
      }

      return res;
    };
  };

  /*!
   * A wrapper around native Array.prototype.map.
   * Falls back to a pure JavaScript implementation in browsers that do not support Array.prototype.map.
   * For more details see the full docs on MDC https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map
   *
   * @private
   * @param {array} the array to map
   * @param {fn} the function to do the mapping
   * @param {thisp} an optional param that will be set as fn's this value
   * @returns {Array}
   */

  if (Array.prototype.map) {
    var map = function (array, fn) {
      return array.map(fn, arguments[2])
    }
  } else {
    var map = function(array, fn) {
      if (array === void 0 || array === null)
        throw new TypeError();

      var t = Object(array);
      var len = t.length >>> 0;
      if (typeof fn !== "function")
        throw new TypeError();

      var res = new Array(len);
      var thisp = arguments[2];
      for (var i = 0; i < len; i++) {
        if (i in t)
          res[i] = fn.call(thisp, t[i], i, t);
      }

      return res;
    };
  };

  /*!
   * A convinience function for converting arguments to a proper array
   *
   * @private
   * @param {args} a functions arguments
   * @param {start} an integer at which to start converting the arguments to an array
   * @returns {Array}
   */
  var toArray = function (args, start) {
    return Array.prototype.slice.call(args, start || 0)
  }

  /*!
   * Exposing the public interface to the Utils module
   * @private
   */
  return {
    every: every,
    forEach: forEach,
    filter: filter,
    toArray: toArray,
    map: map
  }
})()

/*!
 * Davis - listener
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A module to bind to link clicks and form submits and turn what would normally be http requests
 * into instances of Davis.Request.  These request objects are then pushed onto the history stack
 * using the Davis.history module.
 *
 * This module uses Davis.$, which by defualt is jQuery for its event binding and event object normalization.
 * To use Davis with any, or no, JavaScript framework be sure to provide support for all the methods called
 * on Davis.$.
 *
 * @module
 */
Davis.listener = function () {

  /*!
   * Methods to check whether an element has an href or action that is local to this page
   * @private
   */
  var originChecks = {
    A: function (elem) {
      return elem.host !== window.location.host || elem.protocol !== window.location.protocol
    },

    FORM: function (elem) {
      var a = document.createElement('a')
      a.href = elem.action
      return this.A(a)
    }
  }

  /*!
   * Checks whether the target of a click or submit event has an href or action that is local to the
   * current page.  Only links or targets with local hrefs or actions will be handled by davis, all
   * others will be ignored.
   * @private
   */
  var differentOrigin = function (elem) {
    if (!originChecks[elem.nodeName.toUpperCase()]) return true // the elem is neither a link or a form
    return originChecks[elem.nodeName.toUpperCase()](elem)
  }

  var hasModifier = function (event) {
    return (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
  }

  /*!
   * A handler that creates a new Davis.Request and pushes it onto the history stack using Davis.history.
   * 
   * @param {Function} targetExtractor a function that will be called with the event target jQuery object and should return an object with path, title and method.
   * @private
   */
  var handler = function (targetExtractor) {
    return function (event) {
      if (hasModifier(event)) return true
      if (differentOrigin(this)) return true

      var request = new Davis.Request (targetExtractor.call(Davis.$(this)));
      Davis.location.assign(request)
      event.stopPropagation()
      event.preventDefault()
      return false;
    };
  };

  /*!
   * A handler specialized for click events.  Gets the request details from a link elem
   * @private
   */
  var clickHandler = handler(function () {
    var self = this

    return {
      method: 'get',
      fullPath: this.prop('href'),
      title: this.attr('title'),
      delegateToServer: function () {
        window.location = self.prop('href')
      }
    };
  });

  /*!
   * A handler specialized for submit events.  Gets the request details from a form elem
   * @private
   */
  var submitHandler = handler(function () {
    var self = this
    return {
      method: this.attr('method'),
      fullPath: (this.serialize() ? [this.prop('action'), this.serialize()].join("?") : this.prop('action')),
      title: this.attr('title'),
      delegateToServer: function () {
        self.submit()
      }
    };
  });

  /**
   * Binds to both link clicks and form submits using jQuery's deleagate.
   *
   * Will catch all current and future links and forms.  Uses the apps settings for the selector to use for links and forms
   * 
   * @see Davis.App.settings
   * @memberOf listener
   */
  this.listen = function () {
    Davis.$(document).delegate(this.settings.formSelector, 'submit', submitHandler)
    Davis.$(document).delegate(this.settings.linkSelector, 'click', clickHandler)
  }

  /**
   * Unbinds all click and submit handlers that were attatched with listen.
   *
   * Will efectivley stop the current app from processing any requests and all links and forms will have their default
   * behaviour restored.
   *
   * @see Davis.App.settings
   * @memberOf listener
   */
  this.unlisten = function () {
    Davis.$(document).undelegate(this.settings.linkSelector, 'click', clickHandler)
    Davis.$(document).undelegate(this.settings.formSelector, 'submit', submitHandler)
  }
}
/*!
 * Davis - event
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

 /**
  * A plugin that adds basic event capabilities to a Davis app, it is included by default.
  *
  * @module
  */
Davis.event = function () {

  /*!
   * callback storage
   */
  var callbacks = {}

  /**
   * Binds a callback to a named event.
   *
   * The following events are triggered internally by Davis and can be bound to
   *
   *  * start : Triggered when the application is started
   *  * lookupRoute : Triggered before looking up a route. The request being looked up is passed as an argument
   *  * runRoute : Triggered before running a route. The request and route being run are passed as arguments
   *  * routeNotFound : Triggered if no route for the current request can be found. The current request is passed as an arugment
   *  * requestHalted : Triggered when a before filter halts the current request. The current request is passed as an argument
   *  * unsupported : Triggered when starting a Davis app in a browser that doesn't support html5 pushState
   *
   * Example
   *
   *     app.bind('runRoute', function () {
   *       console.log('about to run a route')
   *     })
   *
   * @param {String} event event name
   * @param {Function} fn callback
   * @memberOf event
   */
  this.bind = function (event, fn) {
    (callbacks[event] = callbacks[event] || []).push(fn);
    return this;
  };

  /**
   * Triggers an event with the given arguments.
   *
   * @param {String} event event name
   * @param {Mixed} ...
   * @memberOf event
   */
  this.trigger = function (event) {
    var args = Davis.utils.toArray(arguments, 1),
        handlers = callbacks[event];

    if (!handlers) return this

    for (var i = 0, len = handlers.length; i < len; ++i) {
      handlers[i].apply(this, args)
    }

    return this;
  };
}
/*!
 * Davis - logger
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A plugin for enhancing the standard logging available through the console object.
 * Automatically included in all Davis apps.
 *
 * Generates log messages of varying severity in the format
 *
 * `[Sun Jan 23 2011 16:15:21 GMT+0000 (GMT)] <message>`
 *
 * @module
 */
Davis.logger = function () {

  /*!
   * Generating the timestamp portion of the log message
   * @private
   */
  function timestamp(){
    return "[" + Date() + "]";
  }

  /*!
   * Pushing the timestamp onto the front of the arguments to log
   * @private
   */
  function prepArgs(args) {
    var a = Davis.utils.toArray(args)
    a.unshift(timestamp())
    return a.join(' ');
  }

  var logType = function (logLevel) {
    return function () {
      if (window.console) console[logLevel](prepArgs(arguments));
    }
  }


  /**
   * Prints an error message to the console if the console is available.
   *
   * @params {String} All arguments are combined and logged to the console.
   * @memberOf logger
   */
   var error = logType('error')

  /**
   * Prints an info message to the console if the console is available.
   *
   * @params {String} All arguments are combined and logged to the console.
   * @memberOf logger
   */
   var info = logType('info')

  /**
   * Prints a warning message to the console if the console is available.
   *
   * @params {String} All arguments are combined and logged to the console.
   * @memberOf logger
   */
   var warn = logType('warn')

  /*!
   * Exposes the public methods of the module
   * @private
   */
  this.logger = {
    error: error,
    info: info,
    warn: warn
  }
}/*!
 * Davis - Route
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

Davis.Route = (function () {

  var pathNameRegex = /:([\w\d]+)/g;
  var pathNameReplacement = "([^\/]+)";

  var splatNameRegex = /\*([\w\d]+)/g;
  var splatNameReplacement = "(.*)";

  var nameRegex = /[:|\*]([\w\d]+)/g

/**
 * Davis.Routes are the main part of a Davis application.  They consist of an HTTP method, a path
 * and a callback function.  When a link or a form that Davis has bound to are clicked or submitted
 * a request is pushed on the history stack and a route that matches the path and method of the
 * generated request is run.
 *
 * The path for the route can consist of placeholders for attributes, these will then be available
 * on the request.  Simple variables should be prefixed with a colan, and for splat style params use
 * an asterisk.
 *
 * Inside the callback function 'this' is bound to the request.
 *
 * Example:
 *
 *     var route = new Davis.Route ('get', '/foo/:id', function (req) {
 *       var id = req.params['id']
 *       // do something interesting!
 *     })
 *
 *     var route = new Davis.Route ('get', '/foo/*splat', function (req) {
 *       var id = req.params['splat']
 *       // splat will contain everything after the /foo/ in the path.
 *     })
 *
 * You can include any number of route level 'middleware' when defining routes.  These middlewares are
 * run in order and need to explicitly call the next handler in the stack.  Using route middleware allows
 * you to share common logic between routes and is also a good place to load any data or do any async calls
 * keeping your main handler simple and focused.
 *
 * Example:
 *
 *     var loadUser = function (req, next) {
 *       $.get('/users/current', function (user) {
 *         req.user = user
 *         next(req)
 *       })
 *     }
 *
 *     var route = new Davis.Route ('get', '/foo/:id', loadUser, function (req) {
 *       renderUser(req.user)
 *     })
 *
 * @constructor
 * @param {String} method This should be one of either 'get', 'post', 'put', 'delete', 'before', 'after' or 'state'
 * @param {String} path This string can contain place holders for variables, e.g. '/user/:id' or '/user/*splat'
 * @param {Function} callback One or more callbacks that will be called in order when a request matching both the path and method is triggered.
 */
  var Route = function (method, path, handlers) {
    var convertPathToRegExp = function () {
      if (!(path instanceof RegExp)) {
        var str = path
          .replace(pathNameRegex, pathNameReplacement)
          .replace(splatNameRegex, splatNameReplacement);

        // Most browsers will reset this to zero after a replace call.  IE will
        // set it to the index of the last matched character.
        path.lastIndex = 0;

        return new RegExp("^" + str + "$", "gi");
      } else {
        return path;
      };
    };

    var convertMethodToRegExp = function () {
      if (!(method instanceof RegExp)) {
        return new RegExp("^" + method + "$", "i");
      } else {
        return method
      };
    }

    var capturePathParamNames = function () {
      var names = [], a;
      while ((a = nameRegex.exec(path))) names.push(a[1]);
      return names;
    };

    this.paramNames = capturePathParamNames();
    this.path = convertPathToRegExp();
    this.method = convertMethodToRegExp();

    if (typeof handlers === 'function') {
      this.handlers = [handlers]
    } else {
      this.handlers = handlers;
    }
  }

  /**
   * Tests whether or not a route matches a particular request.
   *
   * Example:
   *
   *     route.match('get', '/foo/12')
   *
   * @param {String} method the method to match against
   * @param {String} path the path to match against
   * @returns {Boolean}
   */
  Route.prototype.match = function (method, path) {
    this.reset();
    return (this.method.test(method)) && (this.path.test(path))
  }

  /**
   * Resets the RegExps for method and path
   */
  Route.prototype.reset = function () {
    this.method.lastIndex = 0;
    this.path.lastIndex = 0;
  }

  /**
   * Runs the callback associated with a particular route against the passed request.
   *
   * Any named params in the request path are extracted, as per the routes path, and
   * added onto the requests params object.
   *
   * Example:
   *
   *     route.run(request)
   *
   * @params {Davis.Request} request
   * @returns {Object} whatever the routes callback returns
   */
  Route.prototype.run = function (request) {
    this.reset();
    var matches = this.path.exec(request.path);
    if (matches) {
      matches.shift();
      for (var i=0; i < matches.length; i++) {
        request.params[this.paramNames[i]] = matches[i];
      };
    };

    var handlers = Davis.utils.map(this.handlers, function (handler, i) {
      return function (req) {
        return handler.call(req, req, handlers[i+1])
      }
    })

    return handlers[0](request)
  }

  /**
   * Converts the route to a string representation of itself by combining the method and path
   * attributes.
   *
   * @returns {String} string representation of the route
   */
  Route.prototype.toString = function () {
    return [this.method, this.path].join(' ');
  }

  /*!
   * exposing the constructor
   * @private
   */
  return Route;
})()
/*!
 * Davis - router
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A decorator that adds convinience methods to a Davis.App for easily creating instances
 * of Davis.Route and looking up routes for a particular request.
 *
 * Provides get, post put and delete method shortcuts for creating instances of Davis.Routes
 * with the corresponding method.  This allows simple REST styled routing for a client side
 * JavaScript application.
 *
 * ### Example
 *
 *     app.get('/foo/:id', function (req) {
 *       // get the foo with id = req.params['id']
 *     })
 *     
 *     app.post('/foo', function (req) {
 *       // create a new instance of foo with req.params
 *     })
 *     
 *     app.put('/foo/:id', function (req) {
 *       // update the instance of foo with id = req.params['id']
 *     })
 *     
 *     app.del('/foo/:id', function (req) {
 *       // delete the instance of foo with id = req.params['id']
 *     })
 *
 * As well as providing convinience methods for creating instances of Davis.Routes the router
 * also provides methods for creating special instances of routes called filters.  Before filters
 * run before any matching route is run, and after filters run after any matched route has run.
 * A before filter can return false to halt the running of any matched routes or other before filters.
 *
 * A filter can take an optional path to match on, or without a path will match every request.
 *
 * ### Example
 *
 *     app.before('/foo/:id', function (req) {
 *       // will only run before request matching '/foo/:id'
 *     })
 *     
 *     app.before(function (req) {
 *       // will run before all routes
 *     })
 *     
 *     app.after('/foo/:id', function (req) {
 *       // will only run after routes matching '/foo/:id'
 *     })
 *     
 *     app.after(function (req) {
 *       // will run after all routes
 *     })
 *
 * Another special kind of route, called state routes, are also generated using the router.  State routes
 * are for requests that will not change the current page location.  Instead the page location will remain
 * the same but the current state of the page has changed.  This allows for states which the server will not
 * be expected to know about and support.
 *
 * ### Example
 *
 *     app.state('/foo/:id', function (req) {
 *       // will run when the app transitions into the '/foo/:id' state.
 *     })
 *
 * Using the `trans` method an app can transition to these kind of states without changing the url location.
 *
 * For convinience routes can be defined within a common base scope, this is useful for keeping your route
 * definitions simpler and DRYer.  A scope can either cover the whole app, or just a subset of the routes.
 *
 * ### Example
 *
 *     app.scope('/foo', function () {
 *       this.get('/:id', function () {
 *         // will run for routes that match '/foo/:id'
 *       })
 *     })
 *
 * @module
 */
Davis.router = function () {

  /**
   * Low level method for adding routes to your application.
   *
   * If called with just a method will return a partially applied function that can create routes with
   * that method.  This is used internally to provide shortcuts for get, post, put, delete and state
   * routes.
   *
   * You normally want to use the higher level methods such as get and post, but this can be useful for extending
   * Davis to work with other kinds of requests.
   *
   * Example:
   *
   *     app.route('get', '/foo', function (req) {
   *       // will run when a get request is made to '/foo'
   *     })
   *
   *     app.patch = app.route('patch') // will return a function that can be used to handle requests with method of patch.
   *     app.patch('/bar', function (req) {
   *       // will run when a patch request is made to '/bar'
   *     })
   *
   * @param {String} method The method for this route.
   * @param {String} path The path for this route.
   * @param {Function} handler The handler for this route, will be called with the request that triggered the route.
   * @returns {Davis.Route} the route that has just been created and added to the route list.
   * @memberOf router
   */
  this.route = function (method, path) {
    var createRoute = function (path) {
      var handlers = Davis.utils.toArray(arguments, 1),
          scope = scopePaths.join(''),
          fullPath, route

      (typeof path == 'string') ? fullPath = scope + path : fullPath = path

      route = new Davis.Route (method, fullPath, handlers)

      routeCollection.push(route)
      return route
    }

    return (arguments.length == 1) ? createRoute : createRoute.apply(this, Davis.utils.toArray(arguments, 1))
  }

  /**
   * A convinience wrapper around `app.route` for creating get routes.
   *
   * @param {String} path The path for this route.
   * @param {Function} handler The handler for this route, will be called with the request that triggered the route.
   * @returns {Davis.Route} the route that has just been created and added to the route list.
   * @see Davis.router.route
   * @memberOf router
   */
  this.get  = this.route('get')

  /**
   * A convinience wrapper around `app.route` for creating post routes.
   *
   * @param {String} path The path for this route.
   * @param {Function} handler The handler for this route, will be called with the request that triggered the route.
   * @returns {Davis.Route} the route that has just been created and added to the route list.
   * @see Davis.router.route
   * @memberOf router
   */
  this.post = this.route('post')

  /**
   * A convinience wrapper around `app.route` for creating put routes.
   *
   * @param {String} path The path for this route.
   * @param {Function} handler The handler for this route, will be called with the request that triggered the route.
   * @returns {Davis.Route} the route that has just been created and added to the route list.
   * @see Davis.router.route
   * @memberOf router
   */
  this.put  = this.route('put')

  /**
   * A convinience wrapper around `app.route` for creating delete routes.
   *
   * delete is a reserved word in javascript so use the `del` method when creating a Davis.Route with a method of delete.
   *
   * @param {String} path The path for this route.
   * @param {Function} handler The handler for this route, will be called with the request that triggered the route.
   * @returns {Davis.Route} the route that has just been created and added to the route list.
   * @see Davis.router.route
   * @memberOf router
   */
  this.del  = this.route('delete')

  /**
   * Adds a state route into the apps route collection.
   *
   * These special kind of routes are not triggered by clicking links or submitting forms, instead they
   * are triggered manually by calling `trans`.
   *
   * Routes added using the state method act in the same way as other routes except that they generate
   * a route that is listening for requests that will not change the page location.
   *
   * Example:
   *
   *     app.state('/foo/:id', function (req) {
   *       // will run when the app transitions into the '/foo/:id' state.
   *     })
   *
   * @param {String} path The path for this route, this will never be seen in the url bar.
   * @param {Function} handler The handler for this route, will be called with the request that triggered the route
   * @memberOf router
   *
   */
  this.state = this.route('state');

  /**
   * Modifies the scope of the router.
   *
   * If you have many routes that share a common path prefix you can use scope to reduce repeating
   * that path prefix.
   *
   * You can use `scope` in two ways, firstly you can set the scope for the whole app by calling scope
   * before defining routes.  You can also provide a function to the scope method, and the scope will
   * only apply to those routes defined within this function. It is  also possible to nest scopes within
   * other scopes.
   *
   * Example
   *
   *     // using scope with a function
   *     app.scope('/foo', function () {
   *       this.get('/bar', function (req) {
   *         // this route will have a path of '/foo/bar'
   *       })
   *     })
   *
   *     // setting a global scope for the rest of the application
   *     app.scope('/bar')
   *
   *     // using scope with a function
   *     app.scope('/foo', function () {
   *       this.scope('/bar', function () {
   *         this.get('/baz', function (req) {
   *           // this route will have a path of '/foo/bar/baz'
   *         })
   *       })
   *     })
   *
   * @memberOf router
   * @param {String} path The prefix to use as the scope
   * @param {Function} fn A function that will be executed with the router as its context and the path
   * as a prefix
   *
   */
  this.scope = function (path, fn) {
    scopePaths.push(path)
    if (arguments.length == 1) return

    fn.call(this, this)
    scopePaths.pop()
  }

  /**
   * Transitions the app into the state identified by the passed path parameter.
   *
   * This allows the app to enter states without changing the page path through a link click or form submit. 
   * If there are handlers registered for this state, added by the `state` method, they will be triggered.
   *
   * This method generates a request with a method of 'state', in all other ways this request is identical
   * to those that are generated when clicking links etc.
   *
   * States transitioned to using this method will not be able to be revisited directly with a page load as
   * there is no url that represents the state.
   *
   * An optional second parameter can be passed which will be available to any handlers in the requests
   * params object.
   *
   * Example
   *
   *     app.trans('/foo/1')
   *     
   *     app.trans('/foo/1', {
   *       "bar": "baz"
   *     })
   *     
   *
   * @param {String} path The path that represents this state.  This will not be seen in the url bar.
   * @param {Object} data Any additional data that should be sent with the request as params.
   * @memberOf router
   */
  this.trans = function (path, data) {
    if (data) {
      var fullPath = [path, decodeURIComponent(Davis.$.param(data))].join('?')
    } else {
      var fullPath = path
    };

    var req = new Davis.Request({
      method: 'state',
      fullPath: fullPath,
      title: ''
    })

    Davis.location.assign(req)
  }

  /*!
   * Generating convinience methods for creating filters using Davis.Routes and methods to
   * lookup filters.
   */
  this.filter = function (filterName) {
    return function () {
      var method = /.+/;

      if (arguments.length == 1) {
        var path = /.+/;
        var handler = arguments[0];
      } else if (arguments.length == 2) {
        var path = scopePaths.join('') + arguments[0];
        var handler = arguments[1];
      };

      var route = new Davis.Route (method, path, handler)
      filterCollection[filterName].push(route);
      return route
    }
  }

  this.lookupFilter = function (filterType) {
    return function (method, path) {
      return Davis.utils.filter(filterCollection[filterType], function (route) {
        return route.match(method, path)
      });
    }
  }

  /**
   * A convinience wrapper around `app.filter` for creating before filters.
   *
   * @param {String} path The optionl path for this filter.
   * @param {Function} handler The handler for this filter, will be called with the request that triggered the route.
   * @returns {Davis.Route} the route that has just been created and added to the route list.
   * @memberOf router
   */
  this.before = this.filter('before')

  /**
   * A convinience wrapper around `app.filter` for creating after filters.
   *
   * @param {String} path The optionl path for this filter.
   * @param {Function} handler The handler for this filter, will be called with the request that triggered the route.
   * @returns {Davis.Route} the route that has just been created and added to the route list.
   * @memberOf router
   */
  this.after = this.filter('after')

  /**
   * A convinience wrapper around `app.lookupFilter` for looking up before filters.
   *
   * @param {String} path The optionl path for this filter.
   * @param {Function} handler The handler for this filter, will be called with the request that triggered the route.
   * @returns {Davis.Route} the route that has just been created and added to the route list.
   * @memberOf router
   */
  this.lookupBeforeFilter = this.lookupFilter('before')

  /**
   * A convinience wrapper around `app.lookupFilter` for looking up after filters.
   *
   * @param {String} path The optionl path for this filter.
   * @param {Function} handler The handler for this filter, will be called with the request that triggered the route.
   * @returns {Davis.Route} the route that has just been created and added to the route list.
   * @memberOf router
   */
  this.lookupAfterFilter  = this.lookupFilter('after')

  /*!
   * collections of routes and filters
   * @private
   */
  var routeCollection = [];
  var filterCollection = {
    before: [],
    after: []
  };
  var scopePaths = []

  /**
   * Looks for the first route that matches the method and path from a request.
   * Will only find and return the first matched route.
   *
   * @param {String} method the method to use when looking up a route
   * @param {String} path the path to use when looking up a route
   * @returns {Davis.Route} route
   * @memberOf router
   */
  this.lookupRoute = function (method, path) {
    return Davis.utils.filter(routeCollection, function (route) {
      return route.match(method, path)
    })[0];
  };
}
/*!
 * Davis - history
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A module to normalize and enhance the window.pushState method and window.onpopstate event.
 *
 * Adds the ability to bind to whenever a new state is pushed onto the history stack and normalizes
 * both of these events into an onChange event.
 *
 * @module
 */
Davis.history = (function () {

  /*!
   * storage for the push state handlers
   * @private
   */
  var pushStateHandlers = [];

  /*!
   * keep track of whether or not webkit like browsers have fired their initial
   * page load popstate
   * @private
   */
  var popped = false

  /*!
   * Add a handler to the push state event.  This event is not a native event but is fired
   * every time a call to pushState is called.
   * 
   * @param {Function} handler
   * @private
   */
  function onPushState(handler) {
    pushStateHandlers.push(handler);
  };

  /*!
   * Simple wrapper for the native onpopstate event.
   *
   * @param {Function} handler
   * @private
   */
  function onPopState(handler) {
    window.addEventListener('popstate', handler, true);
  };

  /*!
   * returns a handler that wraps the native event given onpopstate.
   * When the page first loads or going back to a time in the history that was not added
   * by pushState the event.state object will be null.  This generates a request for the current
   * location in those cases
   *
   * @param {Function} handler
   * @private
   */
  function wrapped(handler) {
    return function (event) {
      if (event.state && event.state._davis) {
        handler(new Davis.Request(event.state._davis))
      } else {
        if (popped) handler(Davis.Request.forPageLoad())
      };
      popped = true
    }
  }

  /*!
   * provide a wrapper for any data that is going to be pushed into the history stack.  All
   * data is wrapped in a "_davis" namespace.
   * @private
   */
  function wrapStateData(data) {
    return {"_davis": data}
  }

  /**
   * Bind to the history on change event.
   *
   * This is not a native event but is fired any time a new state is pushed onto the history stack,
   * the current history is replaced or a state is popped off the history stack.
   * The handler function will be called with a request param which is an instance of Davis.Request.
   *
   * @param {Function} handler a function that will be called on push and pop state.
   * @see Davis.Request
   * @memberOf history
   */
  function onChange(handler) {
    onPushState(handler);
    onPopState(wrapped(handler));
  };

  /*!
   * returns a function for manipulating the history state and optionally calling any associated
   * pushStateHandlers
   *
   * @param {String} methodName the name of the method to manipulate the history state with.
   * @private
   */
  function changeStateWith (methodName) {
    return function (request, opts) {
      popped = true
      history[methodName](wrapStateData(request.toJSON()), request.title, request.location());
      if (opts && opts.silent) return
      Davis.utils.forEach(pushStateHandlers, function (handler) {
        handler(request);
      });
    }
  }

  /**
   * Pushes a request onto the history stack.
   *
   * This is used internally by Davis to push a new request
   * resulting from either a form submit or a link click onto the history stack, it will also trigger
   * the onpushstate event.
   *
   * An instance of Davis.Request is expected to be passed, however any object that has a title
   * and a path property will also be accepted.
   *
   * @param {Davis.Request} request the location to be assinged as the current location.
   * @memberOf history
   */
  var assign = changeStateWith('pushState')

  /**
   * Replace the current state on the history stack.
   *
   * This is used internally by Davis when performing a redirect.  This will trigger an onpushstate event.
   *
   * An instance of Davis.Request is expected to be passed, however any object that has a title
   * and a path property will also be accepted.
   *
   * @param {Davis.Request} request the location to replace the current location with.
   * @memberOf history
   */
  var replace = changeStateWith('replaceState')

  /**
   * Returns the current location for the application.
   *
   * Davis.location delegates to this method for getting the apps current location.
   *
   * @memberOf history
   */
  function current() {
    return window.location.pathname + (window.location.search ? window.location.search : '')
  }

  /*!
   * Exposing the public methods of this module
   * @private
   */
  return {
    onChange: onChange,
    current: current,
    assign: assign,
    replace: replace
  }
})()
/*!
 * Davis - location
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A module that acts as a delegator to any locationDelegate implementation.  This abstracts the details of
 * what is being used for the apps routing away from the rest of the library.  This allows any kind of routing
 * To be used with Davis as long as it can respond appropriatly to the given delegate methods.
 *
 * A routing module must respond to the following methods
 *
 *  * __current__ : Should return the current location for the app
 *  * __assign__ : Should set the current location of the app based on the location of the passed request.
 *  * __replace__ : Should at least change the current location to the location of the passed request, for full compatibility it should not add any extra items in the history stack.
 *  * __onChange__ : Should add calbacks that will be fired whenever the location is changed.
 *
 * @module
 *
 */
Davis.location = (function () {

  /*!
   * By default the Davis uses the Davis.history module for its routing, this gives HTML5 based pushState routing
   * which is preferrable over location.hash based routing.
   */
  var locationDelegate = Davis.history

  /**
   * Sets the current location delegate.
   *
   * The passed delegate will be used for all Davis apps.  The delegate
   * must respond to the following four methods `current`, `assign`, `replace` & `onChange`.
   *
   * @param {Object} the location delegate to use.
   * @memberOf location
   */
  function setLocationDelegate(delegate) {
    locationDelegate = delegate
  }

  /**
   * Delegates to the locationDelegate.current method.
   *
   * This should return the current location of the app.
   *
   * @memberOf location
   */
  function current() {
    return locationDelegate.current()
  }

  /*!
   * Creates a function which sends the location delegate the passed message name.
   * It handles converting a string path to an actual request
   *
   * @returns {Function} a function that calls the location delegate with the supplied method name
   * @memberOf location
   * @private
   */
  function sendLocationDelegate (methodName) {
    return function (req, opts) {
      if (typeof req == 'string') req = new Davis.Request (req)
      locationDelegate[methodName](req, opts)
    }
  }

  /**
   * Delegates to the locationDelegate.assign method.
   *
   * This should set the current location for the app to that of the passed request object.
   *
   * Can take either a Davis.Request or a string representing the path of the request to assign.
   *
   *
   *
   * @param {Request} req the request to replace the current location with, either a string or a Davis.Request.
   * @param {Object} opts the optional options object that will be passed to the location delegate
   * @see Davis.Request
   * @memberOf location
   */
  var assign = sendLocationDelegate('assign')

  /**
   * Delegates to the locationDelegate.replace method.
   *
   * This should replace the current location with that of the passed request.
   * Ideally it should not create a new entry in the browsers history.
   *
   * Can take either a Davis.Request or a string representing the path of the request to assign.
   *
   * @param {Request} req the request to replace the current location with, either a string or a Davis.Request.
   * @param {Object} opts the optional options object that will be passed to the location delegate
   * @see Davis.Request
   * @memberOf location
   */
  var replace = sendLocationDelegate('replace')

  /**
   * Delegates to the locationDelegate.onChange method.
   *
   * This should add a callback that will be called any time the location changes.
   * The handler function will be called with a request param which is an instance of Davis.Request.
   *
   * @param {Function} handler callback function to be called on location chnage.
   * @see Davis.Request
   * @memberOf location
   *
   */
  function onChange(handler) {
    locationDelegate.onChange(handler)
  }

  /*!
   * Exposing the public methods of this module
   * @private
   */
  return {
    setLocationDelegate: setLocationDelegate,
    current: current,
    assign: assign,
    replace: replace,
    onChange: onChange
  }
})()
/*!
 * Davis - Request
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

Davis.Request = (function () {

/**
 * Davis.Requests are created from click and submit events.  Davis.Requests are passed to Davis.Routes
 * and are stored in the history stack.  They are instantiated by the Davis.listener module.
 *
 * A request will have a params object which will contain all query params and form params, any named
 * params in a routes path will also be added to the requests params object.  Also included is support
 * for rails style nested form params.
 *
 * By default the request method will be taken from the method attribute for forms or will be defaulted
 * to 'get' for links, however there is support for using a hidden field called _method in your forms
 * to set the correct reqeust method.
 *
 * Simple get requests can be created by just passing a path when initializing a request, to set the method
 * or title you have to pass in an object.
 *
 * Each request will have a timestamp property to make it easier to determine if the application is moving
 * forward or backward through the history stack.
 *
 * Example
 *
 *     var request = new Davis.Request ("/foo/12")
 *
 *     var request = new Davis.Request ("/foo/12", {title: 'foo', method: 'POST'})
 *     
 *     var request = new Davis.Request({
 *       title: "foo",
 *       fullPath: "/foo/12",
 *       method: "get"
 *     })
 *
 * @constructor
 * @param {String} fullPath
 * @param {Object} opts An optional object with a title or method proprty
 *
 */
  var Request = function (fullPath, opts) {
    if (typeof fullPath == 'object') {
      opts = fullPath
      fullPath = opts.fullPath
      delete opts.fullPath
    }

    var raw = Davis.$.extend({}, {
      title: "",
      fullPath: fullPath,
      method: "get",
      timestamp: +new Date ()
    }, opts)

    raw.fullPath = raw.fullPath.replace(/\+/g, '%20')

    var self = this;
    this.raw = raw;
    this.params = {};
    this.title = raw.title;
    this.queryString = raw.fullPath.split("?")[1];
    this.timestamp = raw.timestamp;
    this._staleCallback = function () {};

    if (this.queryString) {
      Davis.utils.forEach(this.queryString.split("&"), function (keyval) {
        var paramName = keyval.split("=")[0],
            paramValue = keyval.split("=")[1],
            nestedParamRegex = /^(\w+)\[(\w+)?\](\[\])?/,
            nested;
        if (nested = nestedParamRegex.exec(paramName)) {
          var paramParent = nested[1];
          var paramName = nested[2];
          var isArray = !!nested[3];
          var parentParams = self.params[paramParent] || {};

          if (isArray) {
            parentParams[paramName] = parentParams[paramName] || [];
            parentParams[paramName].push(decodeURIComponent(paramValue));
            self.params[paramParent] = parentParams;
          } else if (!paramName && !isArray) {
            parentParams = self.params[paramParent] || []
            parentParams.push(decodeURIComponent(paramValue))
            self.params[paramParent] = parentParams
          } else {
            parentParams[paramName] = decodeURIComponent(paramValue);
            self.params[paramParent] = parentParams;
          }
        } else {
          self.params[paramName] = decodeURIComponent(paramValue);
        };

      });
    };

    raw.fullPath = raw.fullPath.replace(/^https?:\/\/.+?\//, '/');

    this.method = (this.params._method || raw.method).toLowerCase();

    this.path = raw.fullPath
      .replace(/\?(.|[\r\n])+$/, "")  // Remove the query string
      .replace(/^https?:\/\/[^\/]+/, ""); // Remove the protocol and host parts
  
    this.fullPath = raw.fullPath;

    this.delegateToServer = raw.delegateToServer || Davis.noop;
    this.isForPageLoad = raw.forPageLoad || false;

    if (Request.prev) Request.prev.makeStale(this);
    Request.prev = this;

  };

  /**
   * Redirects the current request to a new location.
   *
   * Calling redirect on an instance of Davis.Request will create a new request using the path and
   * title of the current request. Redirected requests always have a method of 'get'.
   *
   * The request created will replace the current request in the history stack.  Redirect is most
   * often useful inside a handler for a form submit.  After succesfully handling the form the app
   * can redirect to another path.  This means that the current form will not be re-submitted if
   * navigating through the history with the back or forward buttons because the request that the
   * submit generated has been replaced in the history stack.
   *
   * Example
   *
   *     this.post('/foo', function (req) {
   *       processFormRequest(req.params)  // do something with the form request
   *       req.redirect('/bar');
   *     })
   *
   * @param {String} path The path to redirect the current request to
   * @param {Object} opts The optional options object that will be passed through to the location
   * @memberOf Request
   */
  Request.prototype.redirect = function (path, opts) {
    Davis.location.replace(new Request ({
      method: 'get',
      fullPath: path,
      title: this.title
    }), opts);
  };

  /**
   * Adds a callback to be called when the request is stale.
   * A request becomes stale when it is no longer the current request, this normally occurs when a
   * new request is triggered.  A request can be marked as stale manually if required.  The callback
   * passed to whenStale will be called with the new request that is making the current request stale.
   *
   * Use the whenStale callback to 'teardown' the objects required for the current route, this gives
   * a chance for views to hide themselves and unbind any event handlers etc.
   *
   * Example
   *
   *     this.get('/foo', function (req) {
   *       var fooView = new FooView ()
   *       fooView.render() // display the foo view
   *       req.whenStale(function (nextReq) {
   *         fooView.remove() // stop displaying foo view and unbind any events
   *       })
   *     })
   *
   * @param {Function} callback A single callback that will be called when the request becomes stale.
   * @memberOf Request
   *
   */
  Request.prototype.whenStale = function (callback) {
    this._staleCallback = callback;
  }

  /**
   * Mark the request as stale.
   *
   * This will cause the whenStale callback to be called.
   *
   * @param {Davis.Request} req The next request that has been recieved.
   * @memberOf Request
   */
  Request.prototype.makeStale = function (req) {
    this._staleCallback.call(req, req);
  }

  /**
   * Returns the location or path that should be pushed onto the history stack. 
   *
   * For get requests this will be the same as the path, for post, put, delete and state requests this will
   * be blank as no location should be pushed onto the history stack.
   *
   * @returns {String} string The location that the url bar should display and should be pushed onto the history stack for this request.
   * @memberOf Request
   */
  Request.prototype.location = function () {
    return (this.method === 'get') ? this.fullPath : ''
  }

  /**
   * Converts the request to a string representation of itself by combining the method and fullPath
   * attributes.
   *
   * @returns {String} string representation of the request
   * @memberOf Request
   */
  Request.prototype.toString = function () {
    return [this.method.toUpperCase(), this.path].join(" ")
  };

  /**
   * Converts the request to a plain object which can be converted to a JSON string.
   *
   * Used when pushing a request onto the history stack.
   *
   * @returns {Object} a plain object representation of the request.
   * @memberOf Request
   */
  Request.prototype.toJSON = function () {
    return {
      title: this.raw.title,
      fullPath: this.raw.fullPath,
      method: this.raw.method,
      timestamp: this.raw.timestamp
    }
  }

  /**
   * Creates a new request for the page on page load.
   *
   * This is required because usually requests are generated from clicking links or submitting forms
   * however this doesn't happen on a page load but should still be considered a request that the 
   * JavaScript app should handle.
   *
   * @returns {Davis.Request} A request representing the current page loading.
   * @memberOf Request
   */
  Request.forPageLoad = function () {
    return new this ({
      method: 'get',
      // fullPath: window.location.pathname,
      fullPath: Davis.location.current(),
      title: document.title,
      forPageLoad: true
    });
  }

  /*!
   * Stores the last request
   * @private
   */
  Request.prev = null

  return Request

})()
/*!
 * Davis - App
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

Davis.App = (function () {

  /**
   * Constructor for Davis.App
   *
   * @constructor
   * @returns {Davis.App}
   */
  function App() {
    this.running = false;
    this.boundToInternalEvents = false;

    this.use(Davis.listener)
    this.use(Davis.event)
    this.use(Davis.router)
    this.use(Davis.logger)
  };

  /**
   * A convinience function for changing the apps default settings.
   *
   * Should be used before starting the app to ensure any new settings
   * are picked up and used.
   *
   * Example:
   *
   *     app.configure(function (config) {
   *       config.linkSelector = 'a.davis'
   *       config.formSelector = 'form.davis'
   *     })
   *
   * @param {Function} config This function will be executed with the context bound to the apps setting object, this will also be passed as the first argument to the function.
   */
  App.prototype.configure = function(config) {
    config.call(this.settings, this.settings);
  };

  /**
   * Method to include a plugin in this app.
   *
   * A plugin is just a function that will be evaluated in the context of the app.
   *
   * Example:
   *     app.use(Davis.title)
   *
   * @param {Function} plugin The plugin to use
   *
   */
  App.prototype.use = function(plugin) {
    plugin.apply(this, Davis.utils.toArray(arguments, 1))
  };

  /**
   * Method to add helper properties to all requests in the application.
   *
   * Helpers will be added to the Davis.Request.prototype.  Care should be taken not to override any existing Davis.Request
   * methods.
   *
   * @param {Object} helpers An object containing helpers to mixin to the request
   */
  App.prototype.helpers = function(helpers) {
    for (property in helpers) {
      if (helpers.hasOwnProperty(property)) Davis.Request.prototype[property] = helpers[property]
    }
  };

  /**
   * Settings for the app.  These may be overriden directly or by using the configure
   * convinience method.
   *
   * `linkSelector` is the jquery selector for all the links on the page that you want
   * Davis to respond to.  These links will not trigger a normal http request.
   *
   * `formSelector` is similar to link selector but for all the forms that davis will bind to
   *
   * `throwErrors` decides whether or not any errors will be caugth by Davis.  If this is set to true
   * errors will be thrown so that the request will not be handled by JavaScript, the server will have
   * to provide a response.  When set to false errors in a route will be caught and the server will not
   * receive the request.
   *
   * `handleRouteNotFound` determines whether or not Davis should handle requests when there is no matching
   * route.  If set to false Davis will allow the request to be passed to your server to handle if no matching
   * route can be found.
   *
   * `generateRequestOnPageLoad` determines whether a request should be generated for the initial page load.
   * by default this is set to false. A Davis.Request will not be generated with the path of the current
   * page.  Setting this to true will cause a request to be passed to your app for the inital page load.
   *
   * @see #configure
   */

  App.prototype.settings = {
    linkSelector: 'a',
    formSelector: 'form',
    throwErrors: true,
    handleRouteNotFound: false,
    generateRequestOnPageLoad: false
  };

  /**
   * Starts the app's routing.
   *
   * Apps created using the convinience Davis() function are automatically started.
   *
   * Starting the app binds all links and forms, so clicks and submits
   * create Davis requests that will be pushed onto the browsers history stack.  Browser history change
   * events will be picked up and the request that caused the change will be matched against the apps
   * routes and filters.
   */
   App.prototype.start = function(){
    var self = this;

    if (this.running) return

    if (!Davis.supported()) {
      this.trigger('unsupported')
      return
    };

    var runFilterWith = function (request) {
      return function (filter) {
        var result = filter.run(request, request);
        return (typeof result === "undefined" || result);
      }
    }

    var beforeFiltersPass = function (request) {
      return Davis.utils.every(
        self.lookupBeforeFilter(request.method, request.path),
        runFilterWith(request)
      )
    }

    var handleRequest = function (request) {
      if (beforeFiltersPass(request)) {
        self.trigger('lookupRoute', request)
        var route = self.lookupRoute(request.method, request.path);
        if (route) {
          self.trigger('runRoute', request, route);

          try {
            route.run(request)
            self.trigger('routeComplete', request, route)
          } catch (error) {
            self.trigger('routeError', request, route, error)
          }

          Davis.utils.every(
            self.lookupAfterFilter(request.method, request.path),
            runFilterWith(request)
          );

        } else {
          self.trigger('routeNotFound', request);
        }
      } else {
        self.trigger('requestHalted', request)
      }
    }

    var bindToInternalEvents = function () {
      self
        .bind('runRoute', function (request) {
          self.logger.info("runRoute: " + request.toString());
        })
        .bind('routeNotFound', function (request) {
          if (!self.settings.handleRouteNotFound && !request.isForPageLoad) {
            self.stop()
            request.delegateToServer()
          };
          self.logger.warn("routeNotFound: " + request.toString());
        })
        .bind('start', function () {
          self.logger.info("application started")
        })
        .bind('stop', function () {
          self.logger.info("application stopped")
        })
        .bind('routeError', function (request, route, error) {
          if (self.settings.throwErrors) throw(error)
          self.logger.error(error.message, error.stack)
        });

      Davis.location.onChange(function (req) {
        handleRequest(req)
      });

      self.boundToInternalEvents = true
    }

    if (!this.boundToInternalEvents) bindToInternalEvents()

    this.listen();
    this.trigger('start')
    this.running = true;

    if (this.settings.generateRequestOnPageLoad) handleRequest(Davis.Request.forPageLoad())

  };

  /**
   * Stops the app's routing.
   *
   * Stops the app listening to clicks and submits on all forms and links found using the current
   * apps settings.
   */
  App.prototype.stop = function() {
    this.unlisten();
    this.trigger('stop')
    this.running = false
  };

  return App;
})()
