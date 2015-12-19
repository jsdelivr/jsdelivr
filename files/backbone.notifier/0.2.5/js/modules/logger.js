/*!
 * Backbone.Notifier Logger Module v0.0.2
 * Copyright 2012, Eyal Weiss
 * Backbone.Notifier Logger Module be freely distributed under the MIT license.
 */
(function(Notifier, $){

	Notifier.regModule({
		name: 'logger',	// Required.
		enabled: true,  // Optional. Whether you like the module to be auto-enabled upon registration (default: false).
		extend: { 	// Optional. Data/functions to extend Backbone.Notifier.prototype
			defaults: {
				'showInLog': true
			},
			// Overriding existing function of Backbone.Notifier.prototype
			// "this" refers to:
			// {
			//   supr: function(){/* the function we override */},
			// 	 module: {/* this module */}},
			// 	 scope: {/* this context of the function we override (an *instance* of Backbone.Notifier) */}}
			// }
			// 'initialize' is called when instantiating a new Backbone.Notifier
			initialize: function(){
				this.scope._loggerNotifierId = ++this.module._notifiers;
                this.module.doStringify = !!~window.navigator.userAgent.indexOf('msie');
				this.module._log('initializing notifier #' + this.scope._loggerNotifierId);
				return this.supr.apply(this.scope, arguments);
			}
		},
		// Optional. Unique events accessible for modules, dynamic binding/unbinding is not supported (at the moment).
		// In all event handlers, "this" refers to:
		// {
		// 	 module: {/* this module */}},
		// 	 scope: {/* this context of the function we override (an *instance* of Backbone.Notifier) */}}
		// }
		events: {
			'beforeAppendMsgEl': function(settings, msgEl, msgInner){
				settings._loggerNotificationId = ++this.module._notifications;
				settings.showInLog && this.module._log('beforeAppendMsgEl #' + settings._loggerNotificationId, settings);
			},
			'beforeAnimateInMsgEl': function(settings, msgEl, msgInner, msgView){
				settings.showInLog && this.module._log('beforeAnimateInMsgEl #' + settings._loggerNotificationId);
			},
			'afterAnimateInMsgEl': function(settings, msgEl, msgInner, msgView){
				settings.showInLog && this.module._log('afterAnimateInMsgEl #' + settings._loggerNotificationId);
			},
			'beforeHideMsgEl': function(settings, msgEl, msgInner, msgView){
				settings.showInLog && this.module._log('beforeHideMsgEl #' + settings._loggerNotificationId);
			},
			'afterDestroyMsgEl': function(settings, msgEl, msgInner, msgView){
				settings.showInLog && this.module._log('afterDestroyMsgEl #' + settings._loggerNotificationId);
			}
		},
		// Helper function defined for this module.
		_log: function(a, b){
			if (window.console && window.console.log){
				a = 'logger: ' + a;
				if (arguments.length >= 2) {
					b = _.isString(b) ? b : (this.doStringify ? ' ' + JSON.stringify(b) : b);
					console.log(a, b);
				} else {
					console.log(a);
				}
			}
		},
		// Optional. Triggers immediately when Backbone.Notifier finishes the 'regModule' action
		register: function(){
			this._notifications = 0;
			this._notifiers = 0;
			this._log(this.name + ' module was registered');
		},
		// Optional. Called after module is enabled by Backbone.Notifier.enableModule(moduleName)
		// or after registration when 'enabled' property is set to true.
		enable: function(){
			this._log(this.name + ' module was enabled');
		},
		// Optional. Called after module is disabled by Backbone.Notifier.disableModule(moduleName)
		disable: function(){
			this._log(this.name + ' module was disabled');
		}
	});

})(Backbone.Notifier, jQuery);