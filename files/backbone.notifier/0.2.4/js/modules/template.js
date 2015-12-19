/*!
 * Backbone.Notifier Template Module v0.0.1
 * Copyright 2012, Eyal Weiss
 * Backbone.Notifier Template Module be freely distributed under the MIT license.
 */
(function(Notifier, $, _){

	Notifier.regModule({
		name: 'template',
		enabled: true,
		extend: {
			template: function(settings){
				if (settings.data) {
					var compiled = _.template(settings.message);
					settings.message = compiled(settings.data);
				}
				return this.supr.call(this.scope, settings);
			}
		}
	});

})(Backbone.Notifier, jQuery, _);