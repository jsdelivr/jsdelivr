/*!
 * Backbone.Notifier Backone View Module v0.0.1
 * Copyright 2012, Brendan Stennett
 * Backbone.Notifier View Module be freely distributed under the MIT license.
 */
(function(Notifier, $, _){

	Notifier.regModule({
		name: 'view',
		enabled: true,
		extend: {
			defaults: {
				view: null
			},
			template: function(settings){
				if (settings.view) {
					_.defer(function() {
						$('.' + settings.baseCls + '-message').html(settings.view.render().el)
					});
				}	
				return this.supr.call(this.scope, settings);
			}
		}
	});

})(Backbone.Notifier, jQuery, _);
