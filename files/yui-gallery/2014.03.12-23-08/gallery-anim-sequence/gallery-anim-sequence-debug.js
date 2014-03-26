YUI.add('gallery-anim-sequence', function(Y) {

"use strict";

/**
 * @module gallery-anim-sequence
 */

/**********************************************************************
 * Manages a sequence of animations, so you don't have to chain them
 * manually. Each item in the sequence can be a single animation, an array
 * of animations to perform in parallel, a function which performs an
 * immediate action, or a delay in milliseconds.
 * 
 * Pass `sequence` in the configuration to set the initial animation
 * sequence.
 * 
 * This class exposes the same basic API as Y.Anim, so you can pass
 * Y.AnimSequence to anything that just needs to run/pause/stop an
 * animation.
 * 
 * @main gallery-anim-sequence
 * @class AnimSequence
 * @constructor
 * @param config {Object} configuration
 */
function AnimSequence(config)
{
	this._list = [];
	AnimSequence.superclass.constructor.apply(this, arguments);
}

AnimSequence.NAME = "AnimSequence";

AnimSequence.ATTRS =
{
	/**
	 * If true, the animation runs backwards.  Immediate actions receive
	 * the value of reverse as the only argument.
	 * 
	 * @attribute reverse
	 * @type {Boolean}
	 * @default false
	 */
	reverse:
	{
		value:     false,
		validator: Y.Lang.isBoolean
	},

	/**
	 * The number of times the animation should run.  Can be "infinite"
	 * 
	 * @attribute iterations
	 * @type {Number|String}
	 * @default 1
	 */
	iterations:
	{
		value: 1,
		validator: function(value)
		{
			return Y.Lang.isNumber(value) || value == 'infinite';
		}
	},

	/**
	 * The number of times the animation has run.  Resets to zero when
	 * the animation finishes or is stopped.
	 * 
	 * @attribute iterationCount
	 * @type {Number}
	 * @readOnly
	 */
	iterationCount:
	{
		value:    0,
		readOnly: true
	},

	/**
	 * The behavior of the animation when "iterations" > 1:
	 * If "normal", the animation will repeat in the same direction.
	 * If "alternate", the animation will flip "reverse" at the end of the sequence.
	 * 
	 * @attribute direction
	 * @type {String}
	 * @default "normal"
	 */
	direction:
	{
		value: 'normal',
		validator: function(value)
		{
			return value == 'normal' || value == 'alternate';
		}
	},

	/**
	 * Whether or not the animation is currently running.
	 * 
	 * @attribute running
	 * @type {Boolean}
	 * @default false
	 * @readonly
	 */
	running:
	{
		value:     false,
		validator: Y.Lang.isBoolean,
		readOnly:  true
	},

	/**
	 * Whether or not the animation is currently paused.
	 * 
	 * @attribute paused
	 * @type {Boolean}
	 * @default false
	 * @readonly
	 */
	paused:
	{
		value:     false,
		validator: Y.Lang.isBoolean,
		readOnly:  true
	}
};

/**
 * @event start
 * @description Fires when the sequence begins.
 */
/**
 * @event item
 * @description Fires when an item in the sequence begins.
 * @param index {int} the item index
 */
/**
 * @event end
 * @description Fires after the sequence finishes.
 */

/**
 * @event pause
 * @description Fires when the sequence is paused.
 */
/**
 * @event resume
 * @description Fires when the sequence resumes (after being paused).
 */

function next()
{
	if (this.get('paused'))
	{
		return;
	}

	var reverse = this.get('reverse');
	if ((!reverse && this._index >= this._list.length) ||
		( reverse && this._index < 0))
	{
		var iter_max   = this.get('iterations'),
			iter_count = this.get('iterationCount') + 1;
		if (iter_max == 'infinite' || iter_count < iter_max)
		{
			if (this.get('direction') == 'alternate')
			{
				this.set('reverse', !reverse);
			}

			this._set('iterationCount', iter_count);
			this._index = this.get('reverse') ? this._list.length-1 : 0;
			next.call(this);
		}
		else
		{
			this._set('running', false);
			this.fire('end');
		}
		return;
	}

	var item = this._list[ this._index ];
	if (Y.Lang.isArray(item))
	{
		var tasks = new Y.Parallel();
		Y.each(item, function(a)
		{
			a.once('end', tasks.add());
			a.set('reverse', reverse);
			a.run();
		},
		this);

		tasks.done(Y.bind(next, this));
	}
	else if ((item instanceof Y.Anim) || (item instanceof Y.AnimSequence))
	{
		item.once('end', next, this);
		item.set('reverse', reverse);
		item.run();
	}
	else if (Y.Lang.isFunction(item))
	{
		Y.later(0, this, function()
		{
			item.call(null, reverse);
			next.call(this);
		});
	}
	else if (Y.Lang.isNumber(item))
	{
		Y.later(item, this, next);
	}
	else
	{
		throw Error('unknown item type in sequence: ' + item);
	}

	this._index += reverse ? -1 : +1;
}

Y.extend(AnimSequence, Y.Base,
{
	initializer: function(config)
	{
		if (Y.Lang.isArray(config.sequence))
		{
			this.append.apply(this, config.sequence);
		}
	},

	/**
	 * Append items to the sequence.
	 *
	 * @method append
	 * @param item* {Anim|Function|Array|Number} animation, function, list of animations and functions, or delay in milliseconds
	 */
	append: function(item)
	{
		if (arguments.length == 1)	// even for an array
		{
			this._list.push(item);
		}
		else
		{
			Y.each(Y.Array(arguments), function f(a)
			{
				this._list.push(a);
			},
			this);
		}
	},

	/**
	 * Prepend items to the sequence.
	 *
	 * @method prepend
	 * @param item* {Anim|Function|Array|Number} animation, function, list of animations and functions, or delay in milliseconds
	 */
	prepend: function(item)
	{
		if (arguments.length == 1)	// even for an array
		{
			this._list.unshift(item);
		}
		else
		{
			Y.each(Y.Array(arguments), function f(a)
			{
				this._list.unshift(a);
			},
			this);
		}
	},

	/**
	 * Starts or resumes the sequence.
	 *
	 * @method run
	 * @chainable
	 */
	run: function()
	{
		if (this.get('paused'))
		{
			this._set('paused', false);
			this.fire('resume');
		}
		else
		{
			this._set('iterationCount', 0);
			this._set('running', true);
			this.fire('start');
			this._index = this.get('reverse') ? this._list.length-1 : 0;
		}

		next.call(this);
		return this;
	},

	/**
	 * Stops and resets the sequence.
	 *
	 * @method stop
	 * @chainable
	 * @param finish {Boolean} If true, the animation will move to the last frame.
	 */
	stop: function(finish)
	{
		this._set('running', false);
		this._set('paused', false);

		for (var i=this._index; i<this._list.length; i++)
		{
			var item = this._list[i];
			if (Y.Lang.isArray(item))
			{
				Y.each(item, function(a)
				{
					a.run();	// so items beyond the current item will finish
					a.stop(finish);
				},
				this);
			}
			else if ((item instanceof Y.Anim) || (item instanceof Y.AnimSequence))
			{
				item.run();		// so items beyond the current item will finish
				item.stop(finish);
			}

			if (!finish)
			{
				break;
			}
		}

		this.fire('end');
		return this;
	},

	/**
	 * Pauses the sequence.  If the current item is a delay, the sequence will
	 * pause after the delay interval finishes.
	 *
	 * @method pause
	 * @chainable
	 */
	pause: function()
	{
		this._set('paused', true);

		var item = this._list[ this._index ];
		if (Y.Lang.isArray(item))
		{
			Y.each(item, function(a)
			{
				a.pause();
			},
			this);
		}
		else if ((item instanceof Y.Anim) || (item instanceof Y.AnimSequence))
		{
			item.pause();
		}

		this.fire('pause');
		return this;
	}
});

Y.AnimSequence = AnimSequence;
/**
 * @module gallery-anim-sequence
 */

/**
 * Binds an AnimSequence instance to a Node instance.  The API and
 * namespace is the same as NodeFX, so you can plug NodeFXSequence into
 * any node that just needs to run/pause/stop an animation.
 * 
 * Pass `sequence` in the configuration to set the initial animation
 * sequence.
 * 
 * @class Plugin.NodeFXSequence
 * @extends AnimSequence
 * @constructor
 * @param config {Object} configuration
 */
var NodeFXSequence = function(config)
{
	this._host = config.host;
	NodeFXSequence.superclass.constructor.apply(this, arguments);
};

NodeFXSequence.NAME = "nodefxseq";
NodeFXSequence.NS   = "fx";

function setNode(item)
{
	if (Y.Lang.isArray(item))
	{
		Y.each(item, function(a)
		{
			a.set('node', this._host);
		},
		this);
	}
	else if (item instanceof Y.Anim)
	{
		item.set('node', this._host);
	}
}

Y.extend(NodeFXSequence, Y.AnimSequence,
{
	append: function(item)
	{
		if (arguments.length > 1)
		{
			Y.each(arguments, setNode, this);
		}
		else
		{
			setNode.call(this, item);
		}

		NodeFXSequence.superclass.append.apply(this, arguments);
	},

	prepend: function(item)
	{
		if (arguments.length > 1)
		{
			Y.each(arguments, setNode, this);
		}
		else
		{
			setNode.call(this, item);
		}

		NodeFXSequence.superclass.prepend.apply(this, arguments);
	}
});

Y.namespace('Plugin');
Y.Plugin.NodeFXSequence = NodeFXSequence;


}, 'gallery-2012.07.25-21-36' ,{requires:['anim-base','parallel','node-pluginhost']});
