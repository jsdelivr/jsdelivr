YUI.add('gallery-aui-node-fx', function(A) {

/*
	Experimental
*/

var Lang = A.Lang;

A.Node.ATTRS.fx = {
	getter: function() {
		var instance = this;

		if (!instance.fx) {
			instance.plug(A.Plugin.NodeFX);
		}

		return instance.fx;
	}
};

var SETTINGS_SPEEDS = {
	fast: 0.1,
	normal: 1,
	slow: 1.5
};

var getSpeedConfig = function(config) {
	var duration = 1;

	if (Lang.isNumber(config)) {
		duration = config;
		config = null;
	}

	if (Lang.isString(config)) {
		var speed = config.toLowerCase();

		if (speed in SETTINGS_SPEEDS) {
			duration = SETTINGS_SPEEDS[speed];
		}

		config = null;
	}

	config = config || {
		duration: duration
	};

	return config;
};

A.mix(
	A.Node.prototype,
	{
		fadeIn: function(config) {
			var instance = this;

			var fx = instance.get('fx');

			config = getSpeedConfig(config);

			var currentOpacity = fx.get('to.opacity') || 0;

			if (currentOpacity == 1) {
				currentOpacity = 0;
			}

			A.mix(config,
				{
					from: {
						opacity: currentOpacity
					},
					to: {
						opacity: 1
					},
					reverse: false
				}
			);

			fx.setAttrs(config);

			fx.run();
		},

		fadeOut: function(config) {
			var instance = this;

			var fx = instance.get('fx');

			config = getSpeedConfig(config);

			A.mix(config,
				{
					from: {
						opacity: fx.get('to.opacity') || 1
					},
					to: {
						opacity: 0
					},
					reverse: false
				}
			);

			fx.setAttrs(config);

			fx.run();
		},

		fadeTo: function(config, duration) {
			var instance = this;

			var opacity = 0;

			if (Lang.isNumber(config) || Lang.isString(config)) {
				opacity = parseFloat(config);
				config = null;
			}

			config = config || {};

			duration = duration || 1;

			if (Lang.isString(duration)) {
				var speed = duration.toLowerCase();

				if (speed in SETTINGS_SPEEDS) {
					duration = SETTINGS_SPEEDS[speed];
				}
			}

			A.mix(config,
				{
					duration: duration,
					to: {
						opacity: opacity
					},
					reverse: false
				}
			);

			var fx = instance.get('fx');

			fx.setAttrs(config);

			fx.run();
		},

		fadeToggle: function(duration) {
			var instance = this;

			duration = duration || 1;

			if (Lang.isString(duration)) {
				var speed = duration.toLowerCase();

				if (speed in SETTINGS_SPEEDS) {
					duration = SETTINGS_SPEEDS[speed];
				}
			}

			var fx = instance.get('fx');

			if (false && !fx._fadeToggleSet) {
				fx._fadeToggleSet = {
					from: {
						opacity: 0
					},
					to: {
						opacity: 1
					}
				};

				fx.setAttrs(fx._fadeToggleSet);
			}

			var fromOpacity = fx.get('from.opacity');
			var toOpacity = fx.get('to.opacity');

			if (Lang.isUndefined(fromOpacity)) {
				fromOpacity = 0;
			}

			if (Lang.isUndefined(toOpacity)) {
				toOpacity = 1;
			}

			fromOpacity = Math.round(fromOpacity);
			toOpacity = Math.round(toOpacity);

			if (fromOpacity == toOpacity) {
				toOpacity = (fromOpacity == 1) ? 0 : 1;
			}

			fx.setAttrs(
				{
					from: {
						opacity: fromOpacity
					},
					to: {
						opacity: toOpacity
					},
					duration: duration,
					reverse: !fx.get('reverse')
				}
			);

			fx.run();
		},

		slideDown: function(config) {
			var instance = this;

			var fx = instance.get('fx');

			config = getSpeedConfig(config);

			A.mix(config,
				{
					from: {
						height: 0
					},
					to: {
						height: function(node) {
							return node.get('scrollHeight');
						}
					},
					reverse: false
				}
			);

			fx.setAttrs(config);

			fx.on(
				'start',
				function(event) {
					fx.detach('nodefx:start', arguments.callee);

					instance.setStyle('overflow', 'hidden');
				}
			);

			fx.run();
		},

		slideToggle: function(config) {
			var instance = this;

			var fx = instance.get('fx');

			var duration = 1;

			if (Lang.isNumber(config)) {
				duration = config;
			}

			if (Lang.isString(config)) {
				var speed = config.toLowerCase();

				if (speed in SETTINGS_SPEEDS) {
					duration = SETTINGS_SPEEDS[speed];
				}
			}

			if (!fx._slideToggleSet) {
				fx.setAttrs(
					{
						from: {
							height: 0
						},
						to: {
							height: function(node) {
								return node.get('scrollHeight');
							}
						},
						reverse: false
					}
				);

				fx._slideToggleSet = true;
			}

			fx.on(
				'start',
				function(event) {
					fx.detach('nodefx:start', arguments.callee);

					instance.setStyle('overflow', 'hidden');
				}
			);

			fx.set('duration', duration);
			fx.set('reverse', !fx.get('reverse'));

			fx.run();
		},

		slideUp: function(config) {
			var instance = this;

			var fx = instance.get('fx');

			config = getSpeedConfig(config);

			A.mix(config,
				{
					from: {
						height: function(node) {
							return node.get('scrollHeight');
						}
					},
					to: {
						height: 0
					},
					reverse: false
				}
			);

			fx.setAttrs(config);

			fx.on(
				'start',
				function(event) {
					fx.detach('nodefx:start', arguments.callee);

					instance.setStyle('overflow', 'hidden');
				}
			);

			fx.run();
		}
	}
);


}, 'gallery-2010.08.18-17-12' ,{requires:['gallery-aui-base','anim','anim-node-plugin']});
