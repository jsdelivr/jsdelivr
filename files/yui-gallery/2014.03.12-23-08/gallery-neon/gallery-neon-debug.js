YUI.add('gallery-neon', function (Y, NAME) {

"use strict";

/**
 * @module gallery-neon
 */

/**********************************************************************
 * Overrides Y.Node.show() to make it look like a flickering neon sign.
 * 
 * @main gallery-neon
 * @class Neon
 * @namespace Plugin
 * @extends Plugin.Base
 * @constructor
 * @param config {Object} configuration
 */
function Neon(
	/* object */ config)
{
	Neon.superclass.constructor.call(this, config);
}

Neon.NAME = "NeonPlugin";
Neon.NS   = "neon";

Neon.ATTRS =
{
	/**
	 * Background (starting) color.  Must be parseable by Y.Color.toRGB().
	 * 
	 * @attribute backgroundColor
	 * @type {String}
	 */
	backgroundColor:
	{
		validator: Y.Lang.isString
	},

	/**
	 * Text (ending) color.  Must be parseable by Y.Color.toRGB().
	 * 
	 * @attribute textColor
	 * @type {String}
	 */
	textColor:
	{
		validator: Y.Lang.isString
	},

	/**
	 * Text shadow *template* for setting text-shadow CSS3 property.  Use
	 * {color} to mark where color should be inserted.
	 * 
	 * @attribute textShadow
	 * @type {String}
	 */
	textShadow:
	{
		validator: Y.Lang.isString
	},

	/**
	 * The number of flickers before the text stays visible.
	 * 
	 * @attribute flickerCount
	 * @type {int}
	 * @default 10
	 */
	flickerCount:
	{
		value:     10,
		validator: Y.Lang.isNumber
	},

	/**
	 * The easing to apply to the color animation.
	 * 
	 * @attribute easing
	 * @type {Function}
	 * @default Y.Easing.easeIn
	 */
	easing:
	{
		value:     Y.Easing.easeIn,
		validator: Y.Lang.isFunction
	}
};

function neonOff()
{
	Y.later(Math.round(Math.random()*1000/(this.flicker_max - this.flicker_count)), this, neonOn);

	this.node.setStyle('display', 'none');
}

function neonOn()
{
	this.flicker_count--;
	if (this.flicker_count > 0)
	{
		var fn = this.get('easing');
		var color =
		{
			r: fn(this.flicker_count, parseInt(this.end_color[1],10), this.start_color[1]-this.end_color[1], this.flicker_max),
			g: fn(this.flicker_count, parseInt(this.end_color[2],10), this.start_color[2]-this.end_color[2], this.flicker_max),
			b: fn(this.flicker_count, parseInt(this.end_color[3],10), this.start_color[3]-this.end_color[3], this.flicker_max)
		};

		Y.later(Math.round(Math.random()*1000/this.flicker_count), this, neonOff);
	}
	else
	{
		var color =
		{
			r: this.end_color[1],
			g: this.end_color[2],
			b: this.end_color[3]
		};
	}

	color = 'rgb('+Math.round(color.r)+','+Math.round(color.g)+','+Math.round(color.b)+')';
	this.node.setStyle('color', color);

	var shadow = this.get('textShadow');
	if (shadow)
	{
		this.node.setStyle('textShadow', Y.Lang.sub(shadow, { color: Y.Color.toHex(color) }));
	}

	this.node.setStyle('display', '');

	if (this.flicker_count === 0)
	{
		this.node.fire('neon:finished');
	}
}

function show()
{
	if (!this._isHidden())
	{
		return;
	}
	this.neon.orig_show.call(this);

	var plugin           = this.neon;
	plugin.node          = this;
	plugin.flicker_max   = Math.max(0, plugin.get('flickerCount'));
	plugin.flicker_count = plugin.flicker_max;
	plugin.start_color   = Y.Color.re_RGB.exec(Y.Color.toRGB(plugin.get('backgroundColor')));
	plugin.end_color     = Y.Color.re_RGB.exec(Y.Color.toRGB(plugin.get('textColor')));

	neonOn.call(plugin);
}

Y.extend(Neon, Y.Plugin.Base,
{
	initializer: function(config)
	{
		var host       = this.get('host');
		this.orig_show = host.show;
		host.show      = show;
	},

	destructor: function()
	{
		this.get('host').show = this.orig_show;
	}
});

Y.namespace("Plugin");
Y.Plugin.Neon = Neon;


}, 'gallery-2014.03.06-14-38', {"requires": ["node-style", "node-pluginhost", "anim-easing", "plugin"]});
