YUI.add('gallery-tmp-panel', function(Y) {

/**
 * Temporary class for building a Panel with a very basic subset of the
 * actual panel class
 *
 * @module tmpPanel
 */
/**
 * Features Implemented:
 *
 * Center of the panel
 * Modal background
 * underlay
 * close
 *
 * Features not implemented:
 *
 * Focus handlers
 * Tab loop
 * Drag n Drop
 * key listeners
 */

var 	Node		= Y.Node,
	Lang 		= Y.Lang,
	isBoolean 	= Lang.isBoolean;


/**
 * Create a Panel similar to what we had in YUI2, but with a small subset of
 * the features that existed. This is just a temporary stand-in until the
 * real thing is built. This class extends the <code>overlay</code> class.
 *
 * @class tmpPanel
 * @extends Overlay
 * @param config {Object} Configuration object
 * @constructor
 */
function tmpPanel() {
	tmpPanel.superclass.constructor.apply(this,arguments);
}

Y.mix(tmpPanel, {

	/**
	 * The identity of the widget.
	 *
	 * @property tmpPanel.NAME
	 * @type String
	 * @static
	 */
	NAME : 'tmpPanel',


	/**
	 * Static property used to define the default attribute configuration of
	 * the Widget.
	 *
	 * @property tmp-panel.ATTRS
	 * @type Object
	 * @protected
	 * @static
	 */
	ATTRS : {
		"close": {
			key: "close",
			value: true,
			validator: isBoolean
		},

		"underlay": {
			key: "underlay",
			value: "shadow"
		},

		"modal": {
			key: "modal",
			value: false,
			validator: isBoolean
		}
	}
});

Y.extend(tmpPanel, Y.Overlay, {
	/**
	 * Deferred value for the disabled attribute when stalled (see _stall
	 * property).
	 *
	 * @property _disabled
	 * @type Boolean
	 * @protected
	 */
	_disabled : false,

	/**
	 * Construction logic executed during tmpPanel instantiation. Subscribes to
	 * after events for ____________.  Publishes custom events
	 * including _____________.
	 *
	 * @method initializer
	 * @protected
	 */
	initializer : function () {
		this._hasModality = false;
	},

	/**
	 * Create the DOM structure for the tmpPanel.
	 *
	 * @method renderUI
	 * @protected
	 */
	renderUI : function () {
		this._closeButton_create();//create close button
		this._underlay_create();//create underlay
		this._mask_create();//create mask
	},

	//bind the events with the interface
	bindUI : function () {
		//setup attribute change bindings
		this.after('closeChange',Y.bind(this._closeButton_changed,this));
		this.after('underlayChange',Y.bind(this._underlay_changed,this));
		this.after('modalChange',Y.bind(this._mask_changed,this));
		this.after('visibleChange',Y.bind(this._mask_changed,this));
		Y.on('resize',Y.bind(this._mask_changed,this));

		this.after('visibleChange',Y.bind(this._position_update,this));
		Y.on('resize',Y.bind(this._position_update,this));
		Y.on('scroll',Y.bind(this._position_update,this));
	},

	//sync's the UI if there are attribute changes
	syncUI : function () {
	},

	//destructor
	destructor : function() {
	},


	//close button methods
	_closeButton_create : function () {
		//create the button and add a hide class if the config is set to false
		this.get('contentBox').append('<a href="#" class="'+this.getClassName('close')+'">&#160;</a>');
		this.get('contentBox').one('.'+this.getClassName('close')).on('click',this._closeButton_click,this);
		if(this.get('close')===false){
			this._closeButton_hide();
		}
	},
	_closeButton_destroy : function () {
	},
	_closeButton_show : function () {
		this.get('contentBox').one('.'+this.getClassName('close')).removeClass(this.getClassName('hidden'));
	},
	_closeButton_hide : function () {
		this.get('contentBox').one('.'+this.getClassName('close')).addClass(this.getClassName('hidden'));
	},
	_closeButton_click : function (e) {
		e.preventDefault();
		this.hide();
		return false;
	},
	_closeButton_changed : function () {
		if(this.get('close')){
			this._closeButton_show();
		}else{
			this._closeButton_hide();
		}
	},


	//underlay methods
	_underlay_create : function () {
	},
	_underlay_destroy : function () {
	},
	_underlay_changed : function () {
	},


	//mask methods
	_mask_create : function () {
		if(this.get('modal') && this.get('visible')){
			if(!this._hasModality){
				this._hasModality = true;
				var oMask = Node.create('<div id="'+this.get('boundingBox')._node.id+'_mask" class="'+this.getClassName('mask')+'">&#160;</div>'),
					oBody = Y.get('body');
				oMask.setStyle('zIndex',this.get('boundingBox').getStyle('zIndex')-1);
				oBody.prepend(oMask);
				oBody.addClass(this.getClassName('masked'));
				this._mask_size();
			}
		}
	},
	_mask_destroy : function () {
		if(this._hasModality){
			var oMask = Y.one('#'+this.get('boundingBox')._node.id+'_mask'),
				oBody = Y.get('body');
			if(oMask){
				oMask.remove();
			}
			oBody.removeClass(this.getClassName('masked'));
			this._hasModality = false;
		}
	},
	_mask_changed : function () {
		if(this.get('modal') && this.get('visible')){
			this._mask_create();
		}else if(!this.get('modal') || !this.get('visible')){
			this._mask_destroy();
		}
	},
	_mask_size : function () {
		var oMask = Y.one('#'+this.get('boundingBox')._node.id+'_mask'),
			winHeight = Y.DOM.winHeight(),
			winWidth = Y.DOM.winWidth();
		if(oMask && this._hasModality){
			if(oMask._node.offsetHeight > winHeight){
				oMask.setStyle('height',winHeight+'px');
			}
			if(oMask._node.offsetWidth > winWidth){
				oMask.setStyle('width',winWidth+'px');
			}
			oMask.setStyle('height',Y.DOM.docHeight()+'px');
			oMask.setStyle('widht',Y.DOM.docWidth()+'px');
		}
	},

	//positioning methods
	_position_update : function () {
		if(this.get('visible')){//if it's centered and visible
			var nViewportOffset = 10,
				elementWidth = this.get('boundingBox').get('offsetWidth'),
				elementHeight = this.get('boundingBox').get('offsetHeight'),
				viewPortWidth = Y.DOM.winWidth(),
				viewPortHeight = Y.DOM.winHeight(),
				x,
				y;

			if (elementWidth < viewPortWidth) {
				x = (viewPortWidth / 2) - (elementWidth / 2) + Y.DOM.docScrollX();
			} else {
				x = nViewportOffset + Y.DOM.docScrollX();
			}

			if (elementHeight < viewPortHeight) {
				y = (viewPortHeight / 2) - (elementHeight / 2) + Y.DOM.docScrollY();
			} else {
				y = nViewportOffset + Y.DOM.docScrollY();
			}

			this.set('xy',[parseInt(x,10),parseInt(y,10)]);
		}
	},

	//class methods
	addClass : function (className) {
		DJ.market.panel.get('boundingBox').addClass(className);
	},
	removeClass : function (className) {
		DJ.market.panel.get('boundingBox').removeClass(className);
	}
});

Y.tmpPanel = tmpPanel;


}, 'gallery-2010.02.22-22' ,{requires:['overlay']});
