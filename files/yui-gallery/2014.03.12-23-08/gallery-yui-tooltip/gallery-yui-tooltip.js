YUI.add('gallery-yui-tooltip', function(Y) {

	
	/**
	* A simple YUI3 tooltip kit.
	* @module gallery-yui-tooltip
	* @requires selector-css3, overlay, transition, event-mouseenter
	* @author Josh Lizarraga
	*/
	
	/**
	* @class Tooltip
	* @extends Overlay
	* @constructor
	* @param {Object} config Configuration object.
	*/
	var Tooltip = function(config){
		
		Tooltip.superclass.constructor.apply(this, arguments);
		
	};
	
	/**
	* @property NAME
	* @type String
	* @default Tooltip
	*/
	Tooltip.NAME = 'Tooltip';
	
	/* ! Attributes */
	
	Tooltip.ATTRS = {
		
		/**
		* Time in seconds before the Tooltip hides itself.
		* @attribute hideTimer
		* @type Number
		* @default 0.5
		*/
		hideTimer: {
			value: 0.5
		},
		
		/**
		* Whether or not the hideTimer is reset when the Tooltip is hovered on.
		* @attribute resetOnHover
		* @type Boolean
		* @default true
		*/
		resetOnHover: {
			value: true
		},
		
		/**
		* Default Tooltip alignment.
		* @attribute alignment
		* @type String
		* @default top
		*/
		alignment: {
			value: 'top'
		},
		
		/**
		* The distance in pixels the Tooltip should be from a tooltip'd element.
		* @attribute distance
		* @type Integer
		* @default 10
		*/
		distance: {
			value: 10
		},
		
		/**
		* The distance in pixels the Tooltip should move into the "distance" point.
		* @attribute move
		* @type Integer
		* @default 10
		*/
		move: {
			value: 10
		},
		
		/**
		* Time in seconds of Tooltip transitions.
		* @attribute duration
		* @type Number
		* @default 0.15
		*/
		duration: {
			value: 0.15
		},
		
		/**
		* Easing function to use for Tooltip transitions.
		* @attribute easing
		* @type String
		* @default ease-out
		*/
		easing: {
			value: 'ease-out'
		},
		
		/**
		* The default visibility of the Tooltip.
		* @attribute visible
		* @type Boolean
		* @default FALSE
		*/
		visible: {
			value: false
		},
		
		/**
		* The z-index to use for the Tooltip.
		* @attribute zIndex
		* @type Integer
		* @default 30000
		*/
		zIndex: {
			value: 30000
		},
		
		/**
		* The ID returned by _timeout()'s setTimeout call.
		* @attribute _timeoutID
		* @protected
		* @type Integer
		* @default null
		*/
		_timeoutID: {
			value: null
		},
		
		/**
		* The ID of the current element whose Tooltip is being dislayed.
		* @attribute _tooltipID
		* @protected
		* @type String
		* @default null
		*/
		_tooltipID: {
			value: null
		},
		
		/**
		* Maps aligment strings to WidgetPositionAlign points.
		* @attribute _alignmentMap
		* @protected
		* @type Object
		* @default (See source for defaults.)
		*/
		_alignmentMap: {
			value: {
				'top':		[Y.WidgetPositionAlign.BC, Y.WidgetPositionAlign.TC],
				'right':	[Y.WidgetPositionAlign.LC, Y.WidgetPositionAlign.RC],
				'bottom':	[Y.WidgetPositionAlign.TC, Y.WidgetPositionAlign.BC],
				'left':		[Y.WidgetPositionAlign.RC, Y.WidgetPositionAlign.LC]
			}
		},
		
		/**
		* Current alignment setting.
		* @attribute _currentAlignment
		* @protected
		* @type String
		* @default null
		*/
		_currentAlignment: {
			value: null
		}
		
	};
	
	Y.extend(Tooltip, Y.Overlay, {
		
		/* ! Public Methods */
		
		/**
		* Fires "tooltip:hide" event.
		* This method is chainable.
		* @method hide
		* @chainable
		*/
		hide: function(){
			
			this.fire('hide');
			
			return this;
			
		},
		
		/**
		* Fires "tooltip:reset" event.
		* This method is chainable.
		* @method reset
		* @chainable
		*/
		reset: function(){
			
			this.fire('reset');
			
			return this;
			
		},
		
		/**
		* Fires "tooltip:show" event.
		* This method is chainable.
		* @method show
		* @chainable
		*/
		show: function($node){
			
			this.fire('show', $node);
			
			return this;
			
		},
		
		/**
		* Fires "tooltip:timeout" event.
		* This method is chainable.
		* @method timeout
		* @chainable
		*/
		timeout: function(){
			
			this.fire('timeout');
			
			return this;
			
		},
		
		/**
		* Loads tooltip for a given element.
		* @method hide
		* @param {Node} $node The Node whose tooltip is to be displayed.
		*/
		tip: function($node){
			
			var	$tooltip			= $node.getAttribute('tooltip'),
				$newAlignment		= $node.getAttribute('tooltip:alignment') || this.get('alignment'),
				$currentAlignment	= this.get('_currentAlignment'),
				$distance			= this.get('distance'),
				$move				= this.get('move'),
				$styles				= {
					'top':		'auto',
					'right':	'auto',
					'bottom':	'auto',
					'left':		'auto'
				};
			
			$styles[$newAlignment] = '-' + ($distance + $move) + 'px';
			
			this.set('_tooltipID', $node.get('id'));
			
			this.setStdModContent(Y.WidgetStdMod.BODY, $tooltip);
			
			this.get('contentBox').setStyles($styles);
			
			this.set('visible', true);
			
			this._setAlignment($node, $newAlignment);
			
			this.show(true);
			
		},
		
		/* ! Protected Methods */
		
		/**
		* Handles mouseenter event on tooltip'd elements.
		* @method _handleMouseEnter
		* @protected
		* @param {Event} e The Event object.
		*/
		_handleMouseEnter: function(e){
			
			var	$target		= e.target,
				$cB			= this.get('contentBox'),
				$callback	= false,
				$that		= this;
			
			if( $target.ancestor('.' + this.getClassName(), true) ){
				
				this.reset();
				
			}
			
			else {
				
				$target = $target.ancestor('*[tooltip]', true);
				
				if( $target.get('id') === this.get('_tooltipID') ){
					
					this.set('visible', true);
					
					this._setAlignment($target, this.get('_currentAlignment'));
					
					this.show();
					
				}
				
				else {
					
					if( $cB.getStyle('opacity') > 0 ){
						
						$cB.transition({ duration: this.get('duration'), easing: this.get('easing'), opacity: 0 }, function(){
							
							$callback = true;
							
							$that.tip($target);
							
						});
						
						// Sometimes the callback doesn't fire:
						
						window.setTimeout(function(){
							
							if( !$callback ){
								
								$that.tip($target);
								
							}
							
						}, (this.get('duration') * 1000 + 50));
						
					}
					
					else {
						
						this.tip($target);
						
					}
					
				}
				
			}
			
		},
		
		/**
		* Handles mouseleave event on tooltip'd elements.
		* @method _handleMouseLeave
		* @protected
		* @param {Event} e The Event object.
		*/
		_handleMouseLeave: function(e){
			
			this.timeout();
			
		},
		
		/**
		* Hides the tooltip.
		* @event _hide
		* @protected
		*/
		_hide: function(e){
			
			var $that = this;
			
			this.reset();
			
			this.get('contentBox').transition({
				
				duration:	this.get('duration'),
				
				easing:		this.get('easing'),
				
				opacity:	0
				
			}, function(){
				
				$that.set('visible', false);
				
			});
			
		},
		
		/**
		* Clears the this.hide() timeout.
		* @event _reset
		* @protected
		*/
		_reset: function(){
			
			window.clearTimeout( this.get('_timeoutID') );
			
			this.set('_timeoutID', null);
			
		},
		
		/**
		* Sets Tooltip alignment.
		* @method _setAlignment
		* @protected
		* @param {Node} $node The Node to align with.
		* @param {String} $new The new alignment.
		*/
		_setAlignment: function($node, $alignment){
			
			this.get('contentBox').replaceClass(
				
				this.getClassName('align', this.get('_currentAlignment')),
				
				this.getClassName('align', $alignment)
				
			);
			
			this.set('_currentAlignment', $alignment);
			
			this.set('align', { node: $node, points: this.get('_alignmentMap')[$alignment] });
			
		},
		
		/**
		* Displays the tooltip.
		* @event _show
		* @protected
		*/
		_show: function(e, $node){
			
			var	$alignment	= this.get('_currentAlignment'),
				$distance	= this.get('distance'),
				$move		= this.get('move'),
				$cB			= this.get('contentBox'),
				$transition = {
					duration:	this.get('duration'),
					easing:		this.get('easing'),
					opacity:	1
				},
				$styles		= {
					'top':		'auto',
					'right':	'auto',
					'bottom':	'auto',
					'left':		'auto'
				},
				i;
			
			this.reset();
			
			this.set('visible', true);
			
			if( $node || $cB.getStyle('opacity') < .1 ){
				
				$styles[$alignment] = '-' + ($distance + $move) + 'px';
				
				$transition[$alignment] = '-' + $distance + 'px';
				
				$cB.setStyles($styles);
				
			}
			
			$cB.transition($transition);
			
		},
		
		/**
		* Sets a timeout to call this.hide().
		* @event _timeout
		* @protected
		*/
		_timeout: function(){
			
			var $that = this;
			
			if( Y.Lang.isNull(this.get('_timeoutID')) ){
				
				this.set( '_timeoutID', window.setTimeout(function(){
					
					$that.hide();
					
				}, parseInt( this.get('hideTimer') * 1000, 10 )) );
				
			}
			
		},
		
		/* ! Lifecycle Methods */
		
		/**
		* Renders the Tooltip.
		* @method renderUI
		*/
		renderUI: function(){
			
			this.setStdModContent(Y.WidgetStdMod.BODY, '');
			
			this.setStdModContent(Y.WidgetStdMod.FOOTER, '<div></div>');
			
		},
		
		/**
		* Binds event handlers and publishes Tooltip events.
		* @method bindUI
		*/
		bindUI: function(){
			
			var	$events		= ['hide', 'show', 'timeout', 'reset'],
				$targets	= Y.all('*[tooltip]'),
				$reset		= this.get('resetOnHover'),
				i;
			
			for( i = 0; i < $events.length; i++ ){
				
				this.publish($events[i], { defaultFn: this['_' + $events[i]] });
				
			}
			
			if( $reset ){
				
				$targets = $targets.concat( this.get('contentBox') );
				
			}
			
			$targets.on('mouseenter', this._handleMouseEnter, this);
			
			if( !$reset ){
				
				$targets = $targets.concat( this.get('contentBox') );
				
			}
			
			$targets.on('mouseleave', this._handleMouseLeave, this);
			
		},
		
		/**
		* Syncs the Tooltip UI.
		* @method syncUI
		*/
		syncUI: function(){
			
			var $alignment = this.get('_currentAlignment');
			
			this.get('contentBox')
				.setStyle('opacity', 0)
				.addClass(this.getClassName('align', $alignment))
				.setStyle($alignment, '-' + (this.get('distance') + this.get('move')) + 'px');
			
		},
		
		/**
		* Initializes the class.
		* @method initializer
		*/
		initializer: function(){
			
			this.set('_currentAlignment', this.get('alignment'));
			
		}
		
	});
	
	Y.Tooltip = Tooltip;	
	


}, 'gallery-2011.09.28-20-06' ,{requires:['selector-css3','overlay','transition','event-mouseenter']});
