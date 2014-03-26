YUI.add('gallery-busy', function (Y, NAME) {

"use strict";

/**
 * @module gallery-busy
 */

/**
 * A module that captures busy requests within a container
 * Hiding the busy container can be achieved by firing a Global event: busy:hide
 * Based on gallery-busyoverlay
 * 
 * @main gallery-busy
 * @class Busy
 * @constructor
 * @param config {Object} configuration
 */
function Busy(config)
{
	Busy.superclass.constructor.apply(this, arguments);
}

Busy.NAME = "Busy";
Busy.NS   = "busy";

Busy.ATTRS =
{
	/**
	 * The container that should be listened to for create busy overlay events
	 * @attribute container
	 * @type node|selector
	 * @default null
	*/
	container:{
		value:null,
		setter:Y.one
	},
	/**
	 * The selector within the container that activates the busy overlay
	 * @attribute selector
	 * @type string
	 * @default null
	*/
	selector:{
		value:null,
		validator: Y.Lang.isString
	},
	/**
	 * When defined, the busy overlay with take the globalNode as default target
	 * You can still define a custom node in the data-busy attribute of the selector
	 * @attribute globalNode
	 * @type node|selector
	 * @default null
	*/
	globalNode:{
		value:null,
		setter: Y.Node
	},
	/**
	 * CSS class to apply to the overlay.
	 *
	 * @attribute css
	 * @type {String}
	 * @default "yui3-component-busy"
	 */
	css:
	{
		value:     'yui3-gallery-busy',
		validator: Y.Lang.isString
	}
};

Y.extend(Busy, Y.Base,
{
	initializer: function(config)
	{
		this.o = Y.Node.create('<div style="position:absolute;display:none;visibility:hidden;"></div>');
		this.o.set('className', this.get('css'));
		Y.one('body').prepend(this.o);

		Y.delegate('click',function(e){
			if(this.isVisible())
				this.hide();
			
			var target = e.currentTarget.getData('busy');
			
			this.setVisible(target && !Y.Lang.isObject(target)? Y.one(target) : null,true);
			
		}, config.container, config.selector, this);
		
		Y.on('msa-busy:show', function(e){
			this.show(e && e.node);
		}, this);
		
		Y.Global.on('msa-busy:show', function(e){
			this.show(e && e.node);
		}, this);
		
		Y.Global.on('msa-busy:hide',this.hide, this);
		
		Y.on('msa-busy:hide',this.hide, this);
		
		this.on('cssChange', function(e){
			this.o.set('className', e.newVal);
		});
	},

	destructor: function()
	{
		this.o.remove(true);
		this.set('globalNode',null);
	},

	/**
	 * @method isVisible
	 * @return {Boolean} true if the overlay is visible
	 */
	isVisible: function()
	{
		return (this.o.getStyle('visibility') != 'hidden');
	},

	/**
	 * Show the overlay.
	 * 
	 * @method show
	 */
	show: function(node)
	{
		this.setVisible(node,true);
	},

	/**
	 * Hide the overlay.
	 * 
	 * @method hide
	 */
	hide: function()
	{
		this.setVisible(null,false);
	},

	/**
	 * Set the visibility of the overlay.
	 * 
	 * @method setVisible
	 * @param visible {Boolean}
	 */
	setVisible: function(node,visible)
	{
	
		var node = node || this.get('globalNode');
		this.target_region = null;

		this.o.setStyle('display', (visible ? '' : 'none'));
		
		if(node && visible)
			this.resizeOverlay(node);
			
		this.o.setStyle('visibility', (visible ? '' : 'hidden'));

		if (node && visible){
			if (!this.timer)
			{
				this.timer = Y.later(500, this, this.resizeOverlay, node, true);
			}

			Y.one('body').addClass('yui3-busyoverlay-browser-hacks');
		}else{
			if (this.timer)
			{
				this.timer.cancel();
				this.timer = null;
			}

			Y.one('body').removeClass('yui3-busyoverlay-browser-hacks');
		}
	},
	resizeOverlay: function (node){
		var r = node.get('region');
		if (r &&
			(!this.target_region                    ||
			 r.top    !== this.target_region.top    ||
			 r.bottom !== this.target_region.bottom ||
			 r.left   !== this.target_region.left   ||
			 r.right  !== this.target_region.right))
		{
			this.target_region = r;

			this.o.setXY([r.left, r.top]);
			this.o.setStyle('width',  r.width  + 'px');
			this.o.setStyle('height', r.height + 'px');
		}
	}
});

Y.namespace("MSA");
Y.MSA.Busy = Busy;

}, 'gallery-2012.12.05-21-01', {
    "skinnable": "true",
    "requires": [
        "base",
        "node-base",
        "node-style",
        "event-tap",
        "event-delegate",
        "node-screen",
        "event-custom"
    ]
});
