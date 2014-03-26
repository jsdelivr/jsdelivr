YUI.add('gallery-sliding-sidebar', function(Y) {

/**
 * Provides a sliding sidebar widget
 *
 * @module gallery-sliding-sidebar
 *
 */

var Lang = Y.Lang,
	Anim = Y.Anim,
	Easing = Y.Easing,
	Event = Y.Event,
	isNumber = Y.Lang.isNumber;


/**
 * Create a sliding sidebar that contains updateable content and has
 * positioning and sizing options. This class extends the
 * <code>overlay</code> class.
 *
 * @class gallery-sliding-sidebar
 * @extends Overlay
 * @param config {Object} Configuration object
 * @constructor
 */
function SlidingSideBar(config){
	SlidingSideBar.superclass.constructor.apply(this, arguments);
}

Y.mix(SlidingSideBar, {

	/**
	 * The identity of the widget.
	 *
	 * @property tmpPanel.NAME
	 * @type String
	 * @static
	 */
	NAME:'SlidingSideBar',

	/**
	 * Static property used to define the default attribute configuration of
	 * the Widget.
	 *
	 * @property tmp-panel.ATTRS
	 * @type Object
	 * @protected
	 * @static
	 */
	ATTRS:{

		/**
		 * @attribute collapsed Height
		 * @description Number specifying the collapsed Height of the sidebar
		 *
		 * @default 150
		 * @type Number
		 */
		'collapsedHeight':{
			key:'collapsedHeight',
			value:150,
			validator:isNumber
		},

		/**
		 * @attribute collapsedWidth
		 * @description Number specifying the collapsed Width of the sidebar
		 *
		 * @default 25
		 * @type Number
		 */
		'collapsedWidth':{
			key:'collapsedWidth',
			value:25,
			validator:isNumber
		},

		/**
		 * @attribute expanded Height
		 * @description Number specifying the expanded Height of the sidebar
		 *
		 * @default 300
		 * @type Number
		 */
		'expandedHeight':{
			key:'expandedHeight',
			value:300,
			validator:isNumber
		},

		/**
		 * @attribute expandedWidth
		 * @description Number specifying the expanded Width of the sidebar
		 *
		 * @default 200
		 * @type Number
		 */
		'expandedWidth':{
			key:'expandedWidth',
			value:200,
			validator:isNumber
		},

		/**
		* @attribute animation
		* @description Animation config values, see Y.Animation
		*
		* @default <code> {
		* duration: .3,
		* easing: Easing.easeOutStrong
		* }
		* </code>
		* @type Object
		*/
		'animation': {
			value: {
				duration: 0.4,
				easing: Easing.easeOut
			},
			validator: function( value ){
				return Lang.isObject( value ) && Lang.isNumber( value.duration ) &&
					Lang.isFunction( value.easing );
			}
		},

		/**
		 * @attribute content
		 * @description the content you wish to display inside your expanded
		 * sidebar
		 *
		 * @default Null
		 * @type String
		 */
		'content':{
			key:'content',
			value:''
		},
		
		/**
		 * @attribute position
		 * @description the position you wish to display your sidbar. Valid options are: 'left', 'right', 'top', 'bottom'
		 *
		 * @default left
		 * @type String
		 */
		'position':{
			key:'position',
			value:'left',
			validator: function( value ){
				return (value == 'top' || value == 'right' || value == 'bottom' || value == 'left');
			}
		},
		'tabIndex':{
			key:'tabIndex',
			value:1
		}
	}
});

/* SlidingSideBar extends Overlay */
Y.extend(SlidingSideBar, Y.Overlay, {
	/**
	 * Initializer lifecycle implementation for the SlidingSideBar class. Publishes events,
	 * initializes internal properties.
	 *
	 * @method initializer
	 * @param config {Object} Configuration object literal for the SlidingSideBar
	 * @protected
	 */
	initalizer:function(config){
		Y.log('initalizer','info','SlidingSideBar');
	},

	/**
	 * Create the DOM structure for the SlidingSideBar.
	 *
	 * @method renderUI
	 * @protected
	 */
	renderUI:function(){
		Y.log('renderUI','info','SlidingSideBar');
		this.baseZIndex = this.get('zIndex');

		this.set('width',this.get('collapsedWidth'));
		this.set('height',this.get('collapsedHeight'));
	},

	/**
	 * Bind the events with the interface
	 *
	 * @method bindUI
	 * @protected
	 */
	bindUI:function(){
		Y.log('renderUI','info','SlidingSideBar');
		this.get('contentBox').on('click',this._contentBox_click,this);
		this.after('focusedChange',this._setFocus,this);
	},

	/**
	 * Sync the UI if there are attribute changes
	 *
	 * @method syncUI
	 * @protected
	 */
	syncUI:function(){
		Y.log('syncUI','info','SlidingSideBar');
	},

	/**
	 * Destructor lifecycle implementation for the Accordion class.
	 * Removes and destroys all registered items.
	 *
	 * @method destructor
	 * @protected
	 */
	destructor:function(){
		Y.log('destructor','info','SlidingSideBar');
		Event.purgeElement(this.get('contentBox'),true);
		this.get('contentBox').remove();
	},


	/**
	 * Header Content Click event
	 *
	 * @method _headerContent_click
	 * @protected
	 */
	 _headerContent_click:function(e){
		Y.log('_headerContent_click ','info','SlidingSideBar');
		this._toggleSidebar();
	 },
	 /**
	 * Header Content Click event
	 *
	 * @method _headerContent_click
	 * @protected
	 */
	_contentBox_click:function(e){
		Y.log('_contentBox_click '+e.target,'info','SlidingSideBar');
		if(e.target.hasClass('yui-widget-hd')){
			this._toggleSidebar();
			var contentBox = this.get('contentBox');
			if(contentBox.one('.yui-widget-hd')){/* if the head exist */
				contentBox.one('.yui-widget-hd').on('click',this._headerContent_click,this);
				Y.detach('click',this._contentBox_click,contentBox);
			}
		}
		return false;
	},

	/**
	 * Toggles the sidebar to the open and closed positions
	 *
	 * @method _toggleSidebar
	 * @protected
	 */
	_toggleSidebar:function(){
		Y.log('_toggleSidebar','info','SlidingSideBar');
		if(this._isExpanded()){
			this.collapse();
		}else{
			this.expand();
		}
	},
	
	/**
	 * Returns if the side bar is currently expanded
	 *
	 * @method _isExpanded
	 * @returns bool
	 * @protected
	 */
	_isExpanded:function(){
		return this.get('contentBox').hasClass(this.getClassName('expanded'));
	},
	
	/**
	 * Expands the sidebar to the open position
	 *
	 * @method expand
	 */
	expand:function(){
		this._contentSize(this.get('expandedHeight'),this.get('expandedWidth'));
		this._showContent();
		this.get('contentBox').addClass(this.getClassName('expanded'));
	},
	
	/**
	 * Collapses the sidebar to the closed position
	 *
	 * @method collapse
	 */
	collapse:function(){
		this._contentSize(this.get('collapsedHeight'),this.get('collapsedWidth'));
		this._hideContent();
		this.get('contentBox').removeClass(this.getClassName('expanded'));
	},

	/**
	 * Animation adjustment of the content size
	 *
	 * @method _contentSize
	 * @protected
	 */
	_contentSize:function(h,w){
		Y.log('_contentSize','info','SlidingSideBar');
		var animSet,
			animTo = {
				'height':h,
				'width':w
			};

		switch(this.get('position')){
			case 'right':
				if(this._isExpanded()){
					animTo.left = parseFloat(this.get('boundingBox').getStyle('left')) + (this.get('expandedWidth') - this.get('collapsedWidth'));
				}else{
					animTo.left = parseFloat(this.get('boundingBox').getStyle('left')) - (this.get('expandedWidth') - this.get('collapsedWidth'));
				}
				break;
			case 'bottom':
				if(this._isExpanded()){
					animTo.top = parseFloat(this.get('boundingBox').getStyle('top')) + (this.get('expandedHeight') - this.get('collapsedHeight'));
				}else{
					animTo.top = parseFloat(this.get('boundingBox').getStyle('top')) - (this.get('expandedHeight') - this.get('collapsedHeight'));
				}
				break;
		}
			
		
		animSet = this.get('animation');
		if(this.sizeAnim){
			this.sizeAnim.stop();
		}
		this.sizeAnim = new Anim({
			node:this.get('boundingBox'),
			duration:animSet.duration,
			easing:animSet.easing,
			to:animTo
		});
		this.sizeAnim.run();
	},

	/**
	 * Shows the content box
	 *
	 * @method _showContent
	 * @protected
	 */
	_showContent:function(){
		Y.log('_showContent','info','SlidingSideBar');
		if(this.opacityAnim){
			this.opacityAnim.stop();
		}
		if(this.get('contentBox').one('.yui-widget-bd')){
			var animSet = this.get('animation'),
				contentBox = this.get('contentBox');
			this.opacityAnim = new Anim({
				node:contentBox.one('.yui-widget-bd'),
				duration:animSet.duration,
				easing:animSet.easing,
				to:{
					opacity:1
				}
			});
			this.opacityAnim.run();
			contentBox.one('.yui-widget-bd').setStyle('display','block');
		}
	},

	/**
	 * Hides the content box
	 *
	 * @method _hideContent
	 * @protected
	 */
	_hideContent:function(){
		Y.log('_hideContent','info','SlidingSideBar');
		if(this.opacityAnim){
			this.opacityAnim.stop();
		}
		if(this.get('contentBox').one('.yui-widget-bd')){
			var contentBox = this.get('contentBox'),
				animSet = this.get('animation');
			this.opacityAnim = new Anim({
				node:contentBox.one('.yui-widget-bd'),
				duration:animSet.duration,
				easing:animSet.easing,
				to:{
					opacity:0
				},
				on:{
					end:function(){
						contentBox.one('.yui-widget-bd').setStyle('display','none');
					}
				}
			});
			this.opacityAnim.run();
		}
	},
	
	/**
	 * Sets the panel to focus by modifying the zIndex
	 *
	 * @method _setFocus
	 * @protected
	 */
	_setFocus:function(){
		Y.log('_setFocus','info','SlidingSideBar');
		var newZIndex = this.baseZIndex;
		if(this.get('focused')){
			newZIndex = newZIndex+3;
		}
		this.set('zIndex',newZIndex);
	}
	
});

Y.SlidingSideBar = SlidingSideBar;


}, 'gallery-2010.05.21-18-16' ,{requires:['overlay','anim-easing']});
