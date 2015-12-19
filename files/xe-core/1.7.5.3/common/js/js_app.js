/**
 * @file js_app.js
 * @author NAVER (developers@xpressengine.com)
 * @brief XE JavaScript Application Framework (JAF)
 * @namespace xe
 * @update 20100701
 */
(function($){
	var _xe_base, _app_base, _plugin_base;
	var _apps = [];

	_xe_base = {
		/**
		 * @brief return the name of Core module
		 */
		getName : function() {
			return 'Core';
		},

		/**
		 * @brief Create an application class
		 */
		createApp : function(sName, oDef) {
			var _base = getTypeBase();

			$.extend(_base.prototype, _app_base, oDef);

			_base.prototype.getName = function() {
				return sName;
			};

			return _base;
		},

		/**
		 * @brief Create a plugin class
		 */
		createPlugin : function(sName, oDef) {
			var _base = getTypeBase();

			$.extend(_base.prototype, _plugin_base, oDef);

			_base.prototype.getName = function() {
				return sName;
			};

			return _base;
		},

		/**
		 * @brief Get the array of applications
		 */
		getApps : function() {
			return $.makeArray(_apps);
		},

		/**
		 * @brief Get one application
		 */
		getApp : function(indexOrName) {
			indexOrName = (indexOrName||'').toLowerCase();
			if(typeof _apps[indexOrName] != 'undefined') {
				return _apps[indexOrName];
			} else {
				return null;
			}
		},

		/**
		 * @brief Register an application instance
		 */
		registerApp : function(oApp) {
			var sName = oApp.getName().toLowerCase();

			_apps.push(oApp);
			if (!$.isArray(_apps[sName])) {
				_apps[sName] = [];
			}
			_apps[sName].push(oApp);

			oApp.parent = this;

			// register event
			if ($.isFunction(oApp.activate)) oApp.activate();
		},

		/**
		 * @brief Unregister an application instance
		 */
		unregisterApp : function(oApp) {
			var sName  = oApp.getName().toLowerCase();
			var nIndex = $.inArray(oApp, _apps);

			if (nIndex >= 0) _apps = _apps.splice(nIndex, 1);

			if ($.isArray(_apps[sName])) {
				nIndex = $.inArray(oApp, _apps[sName]);
				if (nIndex >= 0) _apps[sName] = _apps[sName].splice(nIndex, 1);
			}

			// unregister event
			if ($.isFunction(oApp.deactivate)) oApp.deactivate();
		},

		/**
		 * @brief overrides broadcast method
		 */
		broadcast : function(msg, params) {
			this._broadcast(this, msg, params);
		},

		_broadcast : function(sender, msg, params) {
			for(var i=0; i < _apps.length; i++) {
				_apps[i]._cast(sender, msg, params);
			}


			// cast to child plugins
			this._cast(sender, msg, params);
		}
	};

	_app_base = {
		_plugins  : [],
		_messages : {},

		/**
		 * @brief get plugin
		 */
		getPlugin : function(sPluginName) {
			sPluginName = sPluginName.toLowerCase();
			if ($.isArray(this._plugins[sPluginName])) {
				return this._plugins[sPluginName];
			} else {
				return [];
			}
		},

		/**
		 * @brief register a plugin instance
		 */
		registerPlugin : function(oPlugin) {
			var self  = this;
			var sName = oPlugin.getName().toLowerCase();

			// check if the plugin is already registered
			if ($.inArray(oPlugin, this._plugins) >= 0) return false;

			// push the plugin into the _plugins array
			this._plugins.push(oPlugin);

			if (!$.isArray(this._plugins[sName])) this._plugins[sName] = [];
			this._plugins[sName].push(oPlugin);

			// register method pool
			$.each(oPlugin._binded_fn, function(api, fn){ self.registerHandler(api, fn); });

			// binding
			oPlugin.oApp = this;

			// registered event
			if ($.isFunction(oPlugin.activate)) oPlugin.activate();

			return true;
		},

		/**
		 * @brief register api message handler
		 */
		registerHandler : function(api, func) {
			var msgs = this._messages; api = api.toUpperCase();
			if (!$.isArray(msgs[api])) msgs[api] = [];
			msgs[api].push(func);
		},

		cast : function(msg, params) {
			return this._cast(this, msg, params || []);
		},

		broadcast : function(sender, msg, params) {
			if (this.parent && this.parent._broadcast) {
				this.parent._broadcast(sender, msg, params);
			}
		},

		_cast : function(sender, msg, params) {
			var i, len;
			var aMsg = this._messages;

			msg = msg.toUpperCase();

			// BEFORE hooker
			if (aMsg['BEFORE_'+msg] || this['API_BEFORE_'+msg]) {
				var bContinue = this._cast(sender, 'BEFORE_'+msg, params);
				if (!bContinue) return;
			}

			// main api function
			var vRet = [], sFn = 'API_'+msg;
			if ($.isArray(aMsg[msg])) {
				for(i=0; i < aMsg[msg].length; i++) {
					vRet.push( aMsg[msg][i](sender, params) );
				}
			}
			if (vRet.length < 2) vRet = vRet[0];

			// AFTER hooker
			if (aMsg['AFTER_'+msg] || this['API_AFTER_'+msg]) {
				this._cast(sender, 'AFTER_'+msg, params);
			}

			if (!/^(?:AFTER|BEFORE)_/.test(msg)) { // top level function
				return vRet;
			} else {
				return $.isArray(vRet)?($.inArray(false, vRet)<0):((typeof vRet=='undefined')?true:!!vRet);
			}
		}
	};

	_plugin_base = {
		oApp : null,

		cast : function(msg, params) {
			if (this.oApp && this.oApp._cast) {
				return this.oApp._cast(this, msg, params || []);
			}
		},

		broadcast : function(msg, params) {
			if (this.oApp && this.oApp.broadcast) {
				this.oApp.broadcast(this, mag, params || []);
			}
		}
	};

	function getTypeBase() {
		var _base = function() {
			var self = this;
			var pool = null;

			if ($.isArray(this._plugins)) this._plugins   = [];
			if (this._messages) this._messages = {};
			else this._binded_fn = {};

			// bind functions
			$.each(this, function(key, val){
				if (!$.isFunction(val)) return true;
				if (!/^API_([A-Z0-9_]+)$/.test(key)) return true;

				var api = RegExp.$1;
				var fn  = function(sender, params){ return self[key](sender, params); };

				if (self._messages) self._messages[api] = [fn];
				else self._binded_fn[api] = fn;
			});

			if ($.isFunction(this.init)) this.init.apply(this, arguments);
		};

		return _base;
	}

	window.xe = $.extend(_app_base, _xe_base);
	window.xe.lang = {}; // language repository

	// domready event
	$(function(){ xe.broadcast('ONREADY'); });

	// load event
	$(window).load(function(){ xe.broadcast('ONLOAD'); });
})(jQuery);
