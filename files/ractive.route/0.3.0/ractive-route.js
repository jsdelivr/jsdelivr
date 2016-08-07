/*!
 * ractive-route 0.3.0
 * https://github.com/MartinKolarik/ractive-route/
 *
 * Copyright (c) 2014 Martin Kolárik
 * martin@kolarik.sk
 * https://kolarik.me
 *
 * Licensed under the MIT license
 * http://www.opensource.org/licenses/MIT
 */

(function (factory) {
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = factory(require('ractive'));
	} else if (typeof define === 'function' && define.amd) {
		define([ 'ractive' ], factory);
	} else {
		factory(window.Ractive);
	}
})(function (Ractive) {
	/**
	 * Route
	 *
	 * @param {String} pattern
	 * @param {Function} Handler
	 * @param {Object} [observe]
	 * @param {Object} [router]
	 * @constructor
	 * @public
	 */
	function Route(pattern, Handler, observe, router) {
		this.pattern = pattern;
		this.map = parsePattern(pattern);
		this.regExp = patternToRegExp(pattern);
		this.strictRegExp = patternToStrictRegExp(pattern);
		this.isComponent = !!Handler.extend;
		this.Handler = Handler;
		this.observe = assign({ qs: [], hash: [], state: [] }, observe);
		this.allObserved = this.observe.qs.concat(this.observe.hash, this.observe.state);
		this.router = router || {};
		this.view = null;
	}
	
	/**
	 * Destroy
	 *
	 * @returns {Route}
	 * @private
	 */
	Route.prototype.destroy = function () {
		if (this.view) {
			this.view.teardown();
			this.view = null;
		}
	
		return this;
	};
	
	/**
	 * Get state
	 *
	 * @returns {Object}
	 * @private
	 */
	Route.prototype.getState = function () {
		var data = {};
	
		for (var i = 0, c = this.allObserved.length; i < c; i++) {
			data[this.allObserved[i]] = this.view.get(this.allObserved[i]);
		}
	
		return {
			qs: pick(data, this.observe.qs),
			hash: pick(data, this.observe.hash),
			state: pick(data, this.observe.state)
		};
	};
	
	/**
	 * Init
	 *
	 * @param {Object} uri
	 * @param {Object} data
	 * @returns {Route}
	 * @private
	 */
	Route.prototype.init = function (uri, data) {
		var _this = this;
	
		assign(
			data,
			this.parsePath(uri.path),
			parseQS(uri.qs, this.observe.qs),
			parseHash(uri.hash, this.observe.hash)
		);
	
		// not a component
		if (!this.isComponent) {
			this.Handler({ el: this.router.el, data: data, uri: this.router.uri });
		} else {
			// init new Ractive
			this.view = new this.Handler({
				el: this.router.el,
				data: data
			});
	
			// observe
			if (this.allObserved.length) {
				this.view.observe(this.allObserved.join(' '), function () {
					if (!_this.updating) {
						_this.router.update();
					}
				}, { init: false });
			}
	
			// notify Ractive we're done here
			this.view.set('__ready', true);
		}
	
		return this;
	};
	
	/**
	 * Match
	 *
	 * @param {String} request
	 * @param {Boolean} strict
	 * @returns {Boolean}
	 * @private
	 */
	Route.prototype.match = function (request, strict) {
		return strict
			? this.strictRegExp.test(request)
			: this.regExp.test(request);
	};
	
	/**
	 * Parse path
	 *
	 * @param {String} path
	 * @returns {Object}
	 * @private
	 */
	Route.prototype.parsePath = function(path) {
		var parsed = path.match(this.regExp);
		var data = {};
	
		for (var i = 0, c = this.map.length; i < c; i++) {
			if (!isEmpty(parsed[i + 1])) {
				data[this.map[i]] = parseJSON(parsed[i + 1]);
			}
		}
	
		return data;
	};
	
	/**
	 * Parse pattern
	 *
	 * @param {String} pattern
	 * @returns {Array}
	 * @private
	 */
	function parsePattern(pattern) {
		return (pattern.match(/\/:\w+/g) || []).map(function (name) {
			return name.substr(2);
		});
	}
	
	/**
	 * Pattern to RegExp
	 *
	 * @param pattern
	 * @returns {RegExp}
	 * @private
	 */
	function patternToRegExp(pattern) {
		return new RegExp(
			patternToRegExpString(pattern)
				.replace(/^\^(\\\/)?/, '^\\/?')
				.replace(/(\\\/)?\$$/, '\\/?$'),
			'i'
		);
	}
	
	/**
	 * Pattern to RegExp string
	 *
	 * @param {String} pattern
	 * @returns {String}
	 * @private
	 */
	function patternToRegExpString(pattern) {
		return ('^' + pattern + '$')
			.replace(/\/:\w+(\([^)]+\))?/g, '(?:\/([^/]+)$1)')
			.replace(/\(\?:\/\(\[\^\/]\+\)\(/, '(?:/(')
			.replace(/\//g, '\\/');
	}
	
	/**
	 * Pattern to strict RegExp
	 *
	 * @param {String} pattern
	 * @returns {RegExp}
	 * @private
	 */
	function patternToStrictRegExp(pattern) {
		return new RegExp(patternToRegExpString(pattern));
	}
	
	
	/**
	 * Router
	 *
	 * @param {Object} options
	 * @constructor
	 * @public
	 */
	function Router(options) {
		this.globals = options.globals || [];
		this.basePath = options.basePath || '';
		this.el = options.el;
		this.data = options.data || function () { return {}; };
		this.history = options.history || history;
		this.strictMode = !!options.strictMode;
		this.linksWatcher = null;
		this.stateWatcher = null;
		this.route = null;
		this.routes = [];
		this.uri = {};
	}
	
	/**
	 * Add route
	 *
	 * @param {String} pattern
	 * @param {Function} Handler
	 * @param {Object} [observe]
	 * @returns {Router}
	 * @public
	 */
	Router.prototype.addRoute = function (pattern, Handler, observe) {
		this.routes.push(new Route(pattern, Handler, observe, this));
	
		return this;
	};
	
	/**
	 * Build hash
	 *
	 * @param {String} mixIn
	 * @returns {String}
	 * @private
	 */
	Router.prototype.buildHash = function (mixIn) {
		var data = this.route.getState().hash;
	
		return !isEmpty(data) || !mixIn
			? stringifyHash(data)
			: mixIn;
	};
	
	/**
	 * Build QS
	 *
	 * @param {Array} mixIn
	 * @returns {String}
	 * @private
	 */
	Router.prototype.buildQS = function (mixIn) {
		return stringifyQS(assign.apply(null, [{}].concat(mixIn, this.route.getState().qs)));
	};
	
	/**
	 * Dispatch
	 *
	 * @param {String} request
	 * @param {Object} [options]
	 * @returns {Router}
	 * @public
	 */
	Router.prototype.dispatch = function (request, options) {
		options = options || {};
		var uri = parseUri(request);
		var route = this.match(uri.path);
		var oldUri = this.uri;
	
		// 404
		if (!route) {
			return this.redirect(request);
		}
	
		if (options.reload || shouldDispatch(this.uri, uri, route)) {
			// prepare data
			var defaults = typeof this.data === 'function' ? this.data() : this.data;
			var data = assign(defaults, options.state, options.hash, options.qs);
	
			// destroy existing route
			if (this.route) {
				this.route.destroy();
			}
	
			// init new route
			this.uri = uri;
			this.route = route.init(uri, data);
		}
	
		// will scroll to the top if there is no matching element
		scrollTo(uri.hash.substr(1));
	
		// update history
		return this.update(!oldUri.path || oldUri.path !== uri.path, !options.noHistory, uri);
	};
	
	/**
	 * Get URI
	 *
	 * @returns {String}
	 * @public
	 */
	Router.prototype.getUri = function () {
		return location.pathname.substr(this.basePath.length) + location.search + location.hash;
	};
	
	/**
	 * Init
	 *
	 * @param {Object} [options]
	 * @returns {Router}
	 * @public
	 */
	Router.prototype.init = function (options) {
		return this.dispatch(this.getUri(), assign({ noHistory: true }, options));
	};
	
	/**
	 * Get the first `route` matching the `request`
	 *
	 * @param {String} request
	 * @returns {Object|null}
	 * @public
	 */
	Router.prototype.match = function (request) {
		var i = -1;
	
		while (this.routes[++i]) {
			if (this.routes[i].match(request)) {
				return this.routes[i];
			}
		}
	
		return null;
	};
	
	/**
	 * Redirect
	 *
	 * @param {String} request
	 * @returns {Router}
	 * @private
	 */
	Router.prototype.redirect = function (request) {
		location.pathname = joinPaths(this.basePath, request);
	
		return this;
	};
	
	/**
	 * Unwatch links
	 *
	 * @returns {Router}
	 * @public
	 */
	Router.prototype.unwatchLinks = function () {
		if (this.linksWatcher) {
			document.body.removeEventListener('click', this.linksWatcher);
			this.linksWatcher = null;
		}
	
		return this;
	};
	
	/**
	 * Unwatch state
	 *
	 * @returns {Router}
	 * @public
	 */
	Router.prototype.unwatchState = function () {
		if (this.stateWatcher) {
			window.removeEventListener('popstate', this.stateWatcher);
			this.stateWatcher = null;
		}
	
		return this;
	};
	
	/**
	 * Update
	 *
	 * @param {Boolean} [pathChange]
	 * @param {Boolean} [history] - true = always, false = never, undefined = if something changed
	 * @param {Object} [uri]
	 * @returns {Router}
	 * @private
	 */
	Router.prototype.update = function (pathChange, history, uri) {
		if (!this.route) {
			return this;
		}
	
		uri = uri || { qs: '', hash: '' };
		var path = joinPaths(this.basePath, this.uri.path);
		var qs = this.buildQS([ parseQS(uri.qs) ].concat(!pathChange ? [ parseQS(location.search) ] : []));
		var hash = this.buildHash(uri.hash);
		var newUri = path + qs + hash;
		var oldUri = location.pathname + location.search + location.hash;
		var state = this.route.getState().state;
		this.uri.qs = qs;
		this.uri.hash = hash;
	
		if (history === true) {
			this.history.pushState(state, null, newUri);
		} else if (history === false) {
			this.history.replaceState(state, null, newUri);
		} else if (newUri !== oldUri) {
			this.history.pushState(state, null, newUri);
		}
	
		return this;
	};
	
	/**
	 * Watch links
	 *
	 * @param {RegExp} [pattern]
	 * @returns {Router}
	 * @public
	 */
	Router.prototype.watchLinks = function (pattern) {
		pattern = pattern || new RegExp('^((https?:)?\\/\\/' + location.hostname.replace(/\./g, '\\.') + '.*|((?!\\/\\/)[^:]+))$');
		var _this = this;
	
		document.body.addEventListener('click', this.unwatchLinks().linksWatcher = function (e) {
			var el = parents(e.target, 'a');
	
			if (el) {
				var href = el.getAttribute('href') || el.getAttribute('data-href');
	
				if (href && !el.classList.contains('router-ignore') && pattern.test(href)) {
					var options = { state: {} };
	
					if (_this.route && _this.route.view) {
						_this.globals.forEach(function (global) {
							options.state[global] = _this.route.view.get(global);
						});
					}
	
					_this.dispatch(href, options);
	
					e.preventDefault();
				}
			}
		});
	
		return this;
	};
	
	/**
	 * Watch state
	 *
	 * @returns {Router}
	 * @public
	 */
	Router.prototype.watchState = function () {
		var _this = this;
	
		window.addEventListener('popstate', this.unwatchState().stateWatcher = function(e) {
			if (e.state) {
				_this.init({ state: e.state });
			}
		});
	
		return this;
	};
	
	/**
	 * Should dispatch
	 *
	 * @param {Object} oldUri
	 * @param {Object} newUri
	 * @param {Object} route
	 * @returns {Boolean}
	 * @private
	 */
	function shouldDispatch(oldUri, newUri, route) {
		return oldUri.path !== newUri.path
			|| oldUri.qs !== newUri.qs
			|| (decodeURIComponent(oldUri.hash) !== decodeURIComponent(newUri.hash) && (!route || route.observe.hash.length));
	}
	
	
	/**
	 * Assign
	 *
	 * @param {Object} object
	 * @param {...Object} source
	 * @returns {Object}
	 * @private
	 */
	function assign(object, source) {
		for (var i = 1, c = arguments.length; i < c; i++) {
			for (var x in arguments[i]) {
				if (arguments[i].hasOwnProperty(x) && arguments[i][x] !== undefined) {
					object[x] = arguments[i][x];
				}
			}
		}
	
		return object;
	}
	/**
	 * Compact
	 *
	 * @param {Object} collection
	
	 * @returns {Object}
	 * @private
	 */
	function compact(collection) {
		return pick(collection, function (value) {
			return !isEmpty(value);
		});
	}
	
	/**
	 * Is empty
	 *
	 * @param {*} value
	 * @returns {Boolean}
	 * @private
	 */
	function isEmpty(value) {
		if (!value || typeof value !== 'object') {
			return !value;
		}
	
		return !Object.keys(value).length;
	}
	
	/**
	 * Join paths
	 *
	 * @param {...String} parts
	 * @returns {String}
	 * @private
	 */
	function joinPaths(parts) {
		return Array.prototype.slice.call(arguments)
			.join('/')
			.replace(/\/+/g, '/');
	}
	
	/**
	 * Parents
	 *
	 * @param {Element} el
	 * @param {String} name
	 * @returns {Element|null}
	 * @private
	 */
	function parents(el, name) {
		while (el && el.nodeName.toLowerCase() !== name) {
			el = el.parentNode;
		}
	
		return el && el.nodeName.toLowerCase() === name
			? el
			: null;
	}
	
	/**
	 * Parse hash
	 *
	 * @param {String} hash
	 * @param {Array} [keys]
	 * @returns {Object}
	 * @private
	 */
	function parseHash(hash, keys) {
		try {
			var parsed = compact(JSON.parse(decodeURIComponent(hash.substr(2))));
	
			return keys
				? pick(parsed, keys)
				: parsed;
		} catch (e) {
			return {};
		}
	}
	
	/**
	 * Parse JSON
	 *
	 * @param {String} string
	 * @returns {*}
	 * @private
	 */
	function parseJSON(string) {
		try {
			return JSON.parse(string);
		} catch (e) {
			return string || '';
		}
	}
	
	/**
	 * Parse URI
	 *
	 * @param {String} uri
	 * @returns {{protocol: string, host: string, path: string, qs: string, hash: string}}
	 * @private
	 */
	function parseUri(uri) {
		var parts = uri.match(/^(?:([\w+.-]+):\/\/([^/]+))?([^?#]*)?(\?[^#]*)?(#.*)?/);
	
		return {
			protocol: parts[1] || '',
			host: parts[2] || '',
			path: parts[3] || '',
			qs: parts[4] || '',
			hash: parts[5] || ''
		};
	}
	
	/**
	 * Parse QS
	 *
	 * @param {String} qs
	 * @param {Array} [keys]
	 * @returns {Object}
	 * @private
	 */
	function parseQS(qs, keys) {
		var index = qs.indexOf('?');
		var parsed = {};
	
		if (index !== -1) {
			var pairs = qs.substr(index + 1).split('&');
			var pair = [];
	
			for (var i = 0, c = pairs.length; i < c; i++) {
				pair = pairs[i].split('=');
	
				if((!isEmpty(pair[1])) && (!isEmpty(parseJSON(pair[1])))) {
					parsed[decodeURIComponent(pair[0])] = parseJSON(decodeURIComponent(pair[1]));
				}
			}
		}
	
		return keys
			? pick(parsed, keys)
			: parsed;
	}
	
	/**
	 * Pick
	 *
	 * @param {Object} object
	 * @param {Array|Function} keys
	 * @returns {Object}
	 * @private
	 */
	function pick(object, keys) {
		var data = {};
	
		if (typeof keys === 'function') {
			for (var x in object) {
				if (object.hasOwnProperty(x) && keys(object[x], x)) {
					data[x] = object[x];
				}
			}
		} else {
			for (var i = 0, c = keys.length; i < c; i++) {
				data[keys[i]] = object[keys[i]];
			}
		}
	
		return data;
	}
	
	/**
	 * Scroll to
	 *
	 * @param {String} id
	 * @private
	 */
	function scrollTo(id) {
		var el = document.getElementById(id);
	
		if (el) {
			window.scrollBy(0, el.getBoundingClientRect().top);
		} else {
			window.scrollTo(0, 0);
		}
	}
	
	/**
	 * Stringify
	 *
	 * @param {*} value
	 * @returns {String}
	 * @private
	 */
	function stringify(value) {
		if (!value || typeof value !== 'object') {
			return value;
		}
	
		return JSON.stringify(value);
	}
	
	/**
	 * Stringify hash
	 *
	 * @param {Object} data
	 * @returns {String}
	 * @private
	 */
	function stringifyHash(data) {
		data = compact(data);
	
		return !isEmpty(data)
			? '#!' + encodeURIComponent(stringify(data))
			: '';
	}
	
	/**
	 * Stringify QS
	 * @param {Object} data
	 * @returns {String}
	 */
	function stringifyQS(data) {
		var qs = '';
	
		for (var x in data) {
			if (data.hasOwnProperty(x) && !isEmpty(data[x])) {
				qs += '&' + encodeURIComponent(x) + '=' + encodeURIComponent(stringify(data[x]));
			}
		}
	
		return qs
			? '?' + qs.substr(1)
			: '';
	}
	

	Router.Route = Route;
	return Ractive.Router = Router;
});