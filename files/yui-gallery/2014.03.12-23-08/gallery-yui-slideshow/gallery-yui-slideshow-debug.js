YUI.add('gallery-yui-slideshow', function(Y) {

	
	/**
	* A simple YUI3 slideshow kit inspired by the jQuery Cycle plugin.
	* @module gallery-yui-slideshow
	* @requires widget, transition, event-mouseenter
	* @author Josh Lizarraga
	*/
	
	/**
	* A simple YUI3 slideshow kit inspired by the jQuery Cycle plugin.
	* @class Slideshow
	* @constructor
	* @param {Object} config Widget configuration object.
	*/
	var Slideshow = function(config){
		
		Slideshow.superclass.constructor.apply(this, arguments);
		
	};
	
	/**
	* @property NAME
	* @type String
	* @default Slideshow
	*/
	Slideshow.NAME = 'Slideshow';
	
	/* ! Slideshow.PRESETS */
	
	Slideshow.PRESETS = {
		
		/**
		* Incoming slide fades in.
		* Outgoing slide fades out.
		* @property PRESETS.fade
		* @type Preset Slide Transition
		*/
		fade: {
			slideIn: {
				before: {
					opacity: 0
				},
				transition: {
					opacity: 1
				}
			},
			slideOut: {
				before: {
					opacity: 1
				},
				transition: {
					opacity: 0
				}
			}
		},
		
		/**
		* Both slides slide from top to bottom.
		* @property PRESETS.slideDown
		* @type Preset Slide Transition
		*/
		slideDown: {
			slideIn: {
				before: {
					bottom: 'cH'
				},
				transition: {
					bottom: '0px'
				}
			},
			slideOut: {
				before: {
					bottom: '0px'
				},
				transition: {
					bottom: '-cH'
				}
			}
		},
		
		/**
		* Both slides slide from right to left.
		* @property PRESETS.slideLeft
		* @type Preset Slide Transition
		*/
		slideLeft: {
			slideIn: {
				before: {
					right: '-cW'
				},
				transition: {
					right: '0px'
				}
			},
			slideOut: {
				before: {
					right: '0px'
				},
				transition: {
					right: 'cW'
				}
			}
		},
		
		/**
		* Both slides slide from bottom to top.
		* @property PRESETS.slideUp
		* @type Preset Slide Transition
		*/
		slideUp: {
			slideIn: {
				before: {
					top: 'cH'
				},
				transition: {
					top: '0px'
				}
			},
			slideOut: {
				before: {
					top: '0px'
				},
				transition: {
					top: '-cH'
				}
			}
		},
		
		/**
		* Both slides slide from left to right.
		* @property PRESETS.slideRight
		* @type Preset Slide Transition
		*/
		slideRight: {
			slideIn: {
				before: {
					left: '-cW'
				},
				transition: {
					left: '0px'
				}
			},
			slideOut: {
				before: {
					left: '0px'
				},
				transition: {
					left: 'cW'
				}
			}
		}
		
	};
	
	/* ! Attributes */
	
	Slideshow.ATTRS = {
		
		/**
		* Slides NodeList instance.
		* @attribute slides
		* @type NodeList
		* @default null
		*/
		slides: {
			value: null
		},
		
		/**
		* Current slide index.
		* @attribute currentIndex
		* @type Integer
		* @default 0
		*/
		currentIndex: {
			value: 0
		},
		
		/**
		* Previous slide button Node/NodeList/selector string.
		* @attribute previousButton
		* @type Mixed
		* @default null
		*/
		previousButton: {
			value: null
		},
		
		/**
		* Next slide button Node/NodeList/selector string.
		* @attribute nextButton
		* @type Mixed
		* @default null
		*/
		nextButton: {
			value: null
		},
		
		/**
		* Pause button Node/NodeList/selector string.
		* @attribute pauseButton
		* @type Mixed
		* @default null
		*/
		pauseButton: {
			value: null
		},
		
		/**
		* Play button Node/NodeList/selector string.
		* @attribute playButton
		* @type Mixed
		* @default null
		*/
		playButton: {
			value: null
		},
		
		/**
		* NodeList/selector string for the elements that correspond to slides.
		* This setting works best with list items.
		* @attribute pages
		* @type Mixed
		* @default null
		*/
		pages: {
			value: null
		},
		
		/**
		* Time interval(s) between slide transitions in seconds.
		* @attribute interval
		* @type Float|Array
		* @default 4
		*/
		interval: {
			value: 4
		},
		
		/**
		* Set to false to disable autoplay.
		* @attribute autoplay
		* @type Boolean
		* @default true
		*/
		autoplay: {
			value: true
		},
		
		/**
		* Set to false to continue autoplay when the user changes slides.
		* @attribute pauseOnChange
		* @type Boolean
		* @default true
		*/
		pauseOnChange: {
			value: true
		},
		
		/**
		* Set to false to continue playing when the user hovers over the slideshow.
		* @attribute pauseOnHover
		* @type Boolean
		* @default true
		*/
		pauseOnHover: {
			value: true
		},
		
		/**
		* Default duration for slide transitions.
		* @attribute duration
		* @type Float
		* @default null
		*/
		duration: {
			value: 0.5
		},
		
		/**
		* Default slide transition easing.
		* @attribute easing
		* @type String
		* @default ease-out
		*/
		easing: {
			value: 'ease-out'
		},
		
		/**
		* Default slide transition.
		* @attribute transition
		* @type Slide Transition
		* @default Slideshow.PRESETS.fade
		*/
		transition: {
			value: Slideshow.PRESETS.fade
		},
		
		/**
		* Default transIn (incoming slide) "before" settings. Sets visibility:visible and z-index:1.
		* @attribute transInBefore
		* @type Object
		* @default (See source)
		*/
		transInBefore: {
			value: {
				visibility:	'visible',
				zIndex:		1
			}
		},
		
		/**
		* Default transIn (incoming slide) "after" settings. Sets z-index:2.
		* @attribute transInAfter
		* @type Object
		* @default (See source)
		*/
		transInAfter: {
			value: {
				zIndex: 2
			}
		},
		
		/**
		* Default transOut (outgoing slide) "before" settings. Sets z-index:2.
		* @attribute transOutBefore
		* @type Object
		* @default (See source)
		*/
		transOutBefore: {
			value: {
				zIndex: 2
			}
		},
		
		/**
		* Default transOut (outgoing slide) "after" settings. Sets visibility:hidden and z-index:-30000.
		* @attribute transOutAfter
		* @type Object
		* @default (See source)
		*/
		transOutAfter: {
			value: {
				visibility:	'hidden',
				zIndex:		-30000
			}
		},
		
		/**
		* The ID returned by autoplay's setTimeout call.
		* @attribute _timeoutID
		* @protected
		* @type Integer
		* @default null
		*/
		_timeoutID: {
			value: null
		},
		
		/**
		* Paused flag.
		* @attribute _isPaused
		* @protected
		* @type Boolean
		* @default true
		*/
		_isPaused: {
			value: true
		},
		
		/**
		* Hover paused flag.
		* @attribute _isHoverPaused
		* @protected
		* @type Boolean
		* @default false
		*/
		_isHoverPaused: {
			value: false
		},
		
		/**
		* Outgoing slide Node.
		* @attribute _outgoingSlide
		* @protected
		* @type Node Instance
		* @default null
		*/
		_outgoingSlide: {
			value: null
		},
		
		/**
		* Incoming slide Node.
		* @attribute _incomingSlide
		* @protected
		* @type Node Instance
		* @default null
		*/
		_incomingSlide: {
			value: null
		}
		
	};
	
	Y.extend(Slideshow, Y.Widget, {
		
		/* ! Public Methods */
		
		/**
		* Fires "slideshow:next" event.
		* This method is chainable.
		* @method next
		*/
		next: function(){
			
			this.fire('next');
			
			return this;
			
		},
		
		/**
		* Fires "slideshow:pause" event.
		* This method is chainable.
		* @method pause
		*/
		pause: function(){
			
			this.fire('pause');
			
			return this;
			
		},
		
		/**
		* Fires "slideshow:play" event.
		* This method is chainable.
		* @method play
		*/
		play: function(){
			
			this.fire('play');
			
			return this;
			
		},
		
		/**
		* Fires "slideshow:previous" event.
		* This method is chainable.
		* @method previous
		*/
		previous: function(){
			
			this.fire('previous');
			
			return this;
			
		},
		
		/**
		* Adjusts the currentIndex and fires the "slideshow:slide" event.
		* This method is chainable.
		* @method slide
		* @param $which {Mixed} The slide to advance to. Can be a slide index, "next", or "previous".
		*/
		slide: function($which){
			
			var $currentIndex		= this.get('currentIndex'),
				$slides				= this.get('slides');
			
			this.set('_outgoingSlide', $slides.item($currentIndex));
			
			switch( $which ){
				
				case 'next':
					
					if( $currentIndex + 1 < $slides.size() ){
						
						$currentIndex++;
						
					}
					
					else {
						
						$currentIndex = 0;
						
					}
					
					break;
					
				case 'previous':
					
					if( $currentIndex - 1 > -1 ){
						
						$currentIndex--;
						
					}
					
					else {
						
						$currentIndex = $slides.size() - 1;
						
					}
					
					break;
					
				default:
					
					if( $which == $currentIndex ){
						
						return false;
						
					} else {
						
						$currentIndex = parseInt( $which, 10 );
						
					}
					
					break;
				
			}
			
			this.set('currentIndex', $currentIndex);
			
			this.set('_incomingSlide', $slides.item($currentIndex));
			
			this.fire('slide');
			
			return this;
			
		},
		
		/* ! Protected Methods */
		
		/**
		* Checks CSS values for shortcut keywords.
		* @method _checkCSSValue
		* @protected
		* @param {Node} $node The Node to use if shortcut keywords are found.
		* @param {Mixed} $value The CSS value to check.
		* @return {Mixed} The parsed CSS value.
		*/
		_checkCSSValue: function($node, $value){
			
			switch( $value ){
				
				case 'cW':
				case 'containerWidth':
					
					return parseInt(this.get('contentBox').get('offsetWidth'), 10) + 'px';
					
				case '-cW':
				case '-containerWidth':
					
					return (parseInt(this.get('contentBox').get('offsetWidth'), 10) * -1) + 'px';
					
				case 'cH':
				case 'containerHeight':
					
					return parseInt(this.get('contentBox').get('offsetHeight'), 10) + 'px';
					
				case '-cH':
				case '-containerHeight':
					
					return (parseInt(this.get('contentBox').get('offsetHeight'), 10) * -1) + 'px';
					
				case 'sW':
				case 'slideWidth':
					
					return parseInt($node.get('offsetWidth'), 10) + 'px';
					
				case '-sW':
				case '-slideWidth':
					
					return (parseInt($node.get('offsetWidth'), 10) * -1) + 'px';
					
				case 'sH':
				case 'slideHeight':
					
					return parseInt($node.get('offsetHeight'), 10) + 'px';
					
				case '-sH':
				case '-slideHeight':
					
					return (parseInt($node.get('offsetHeight'), 10) * -1) + 'px';
					
				default:
					
					return $value;
					
			}
			
		},
		
		/**
		* Sanitizes transition values with _checkCSSValue.
		* @method _checkTransitionValues
		* @protected
		* @param {Node} $node The Node to use if shortcut keywords are found.
		* @param {Object} $transition The transition to check.
		* @return {Mixed} The sanitized transition.
		*/
		_checkTransitionValues: function($node, $transition){
			
			var $sanitized = {},
				i;
			
			for( i in $transition ){
				
				if( i == 'duration' || i == 'easing' || i == 'delay' ){
					
					$sanitized[i] = $transition[i];
					
				} else {
					
					$sanitized[i] = this._checkCSSValue($node, $transition[i]);
					
				}
				
			}
			
			return $sanitized;
			
		},
		
		/**
		* Handles mouseenter on the contentBox.
		* @method _handleMouseenter
		* @protected
		* @param {Event} e The Event object.
		*/
		_handleMouseenter: function(e){
			
			if( !this.get('_isPaused') && !this.get('_isHoverPaused') ){
				
				this.fire('hoverpause');
				
			}
			
		},
		
		/**
		* Handles mouseleave on the contentBox.
		* @method _handleMouseleave
		* @protected
		* @param {Event} e The Event object.
		*/
		_handleMouseleave: function(e){
			
			if( this.get('_isHoverPaused') ){
				
				this.fire('hoverplay');
				
			}
			
		},
		
		/**
		* Handles clicks on pagination elements.
		* @method _handlePageClick
		* @protected
		* @param {Event} e The Event object.
		*/
		_handlePageClick: function(e){
			
			if( this.get('pauseOnChange') ){
				
				this.pause();
				
			}
			
			e.target = e.target.ancestor( '.' + this.getClassName('page') );
			
			this.slide( this.get('pages').indexOf(e.target) );
			
		},
		
		/**
		* Pauses the slideshow momentarily if not already paused.
		* @event _hoverpause
		* @param {Event} e The Event object.
		*/
		_hoverpause: function(e){
			
			if( !this.get('_isPaused') && !this.get('_isHoverPaused') ){
				
				this.pause();
				
				this.set('_isHoverPaused', true);
				
			}
			
		},
		
		/**
		* Plays the slideshow if it was hoverpaused.
		* @event _hoverplay
		* @param {Event} e The Event object.
		*/
		_hoverplay: function(e){
			
			if( this.get('_isHoverPaused') ){
				
				this.play();
				
			}
			
		},
		
		/**
		* Advances the slideshow by one slide.
		* @event _next
		* @param {Event} e The Event object.
		*/
		_next: function(e){
			
			if( this.get('pauseOnChange') ){
				
				this.pause();
				
			}
			
			this.slide('next');
			
		},
		
		/**
		* Pauses the slideshow.
		* @event _pause
		* @param {Event} e The Event object.
		*/
		_pause: function(e){
			
			if( !this.get('_isPaused') ){
				
				window.clearInterval( this.get('_timeoutID') );
				
				this.set('_isPaused', true);
				
			}
			
		},
		
		/**
		* Plays the slideshow.
		* @event _play
		* @param {Event} e The Event object.
		*/
		_play: function(e){
			
			if( this.get('_isPaused') ){
				
				this.set('_isPaused', false);
				
				this.set('_isHoverPaused', false);
				
				this.fire('timeout');
				
			}
			
		},
		
		/**
		* Reverses the slideshow by one slide.
		* @event _previous
		* @param {Event} e The Event object.
		*/
		_previous: function(e){
			
			if( this.get('pauseOnChange') ){
				
				this.pause();
				
			}
			
			this.slide('previous');
			
		},
		
		/**
		* Sets active class on current page Node.
		* @method _setActivePage
		* @protected
		*/
		_setActivePage: function(){
			
			var	$pages	= this.get('pages');
			
			if( !Y.Lang.isNull($pages) ){
				
				$pages.removeClass( this.getClassName('active') );
				
				$pages.item( this.get('currentIndex') ).addClass( this.getClassName('active') );
				
			}
			
		},
		
		/**
		* Sets styles after they are sanitized by _checkCSSValue.
		* @method _setStyles
		* @protected
		* @param {Node} $node The node to style.
		* @param {Object} $styles The styles to set.
		*/
		_setStyles: function($node, $styles){
			
			for( var i in $styles ){
				
				if( $styles.hasOwnProperty(i) ){
					
					$node.setStyle(i, this._checkCSSValue($node, $styles[i]));
					
				}
				
			}
			
		},
		
		/**
		* Performs the slide transition.
		* @event _slide
		* @param {Event} e The Event object.
		*/
		_slide: function(e){
			
			var $that				= this,
				$slideTransition	= this.get('transition'),
				$outgoingSlide		= this.get('_outgoingSlide'),
				$incomingSlide		= this.get('_incomingSlide');
			
			// Duraton and easing:
			
			if( Y.Lang.isUndefined($slideTransition.slideOut.transition.duration) ){
				
				$slideTransition.slideOut.transition.duration = this.get('duration');
				
			}
			
			if( Y.Lang.isUndefined($slideTransition.slideOut.transition.easing) ){
				
				$slideTransition.slideOut.transition.easing = this.get('easing');
				
			}
			
			if( Y.Lang.isUndefined($slideTransition.slideIn.transition.duration) ){
				
				$slideTransition.slideIn.transition.duration = this.get('duration');
				
			}
			
			if( Y.Lang.isUndefined($slideTransition.slideIn.transition.easing) ){
				
				$slideTransition.slideIn.transition.easing = this.get('easing');
				
			}
			
			// Default "before" styles:
			
			this._setStyles( $outgoingSlide, this.get('transOutBefore') );
			
			this._setStyles( $incomingSlide, this.get('transInBefore') );
			
			// Transition "before" styles:
			
			if( Y.Lang.isObject($slideTransition.slideOut.before) ){
				
				this._setStyles( $outgoingSlide, $slideTransition.slideOut.before );
				
			}
			
			if( Y.Lang.isObject($slideTransition.slideIn.before) ){
				
				this._setStyles( $incomingSlide, $slideTransition.slideIn.before );
				
			}
			
			// Transitions:
			
			$slideTransition.slideOut.transition = this._checkTransitionValues($outgoingSlide, $slideTransition.slideOut.transition);
			
			$slideTransition.slideIn.transition = this._checkTransitionValues($incomingSlide, $slideTransition.slideIn.transition);
			
			$outgoingSlide.transition($slideTransition.slideOut.transition, function(){
				
				// Default "after" styles:
				
				$that._setStyles( $outgoingSlide, $that.get('transOutAfter') );
				
				// Transition "after" styles:
				
				if( Y.Lang.isObject($slideTransition.slideOut.after) ){
					
					$that._setStyles( $outgoingSlide, $slideTransition.slideOut.after );
					
				}
				
			});
			
			$incomingSlide.transition($slideTransition.slideIn.transition, function(){
				
				// Default "after" styles:
				
				$that._setStyles( $incomingSlide, $that.get('transInAfter') );
				
				// Transition "after" styles:
				
				if( Y.Lang.isObject($slideTransition.slideIn.after) ){
					
					$that._setStyles( $incomingSlide, $slideTransition.slideIn.after );
					
				}
				
			});
			
			// Update active page:
			
			this._setActivePage();
			
		},
		
		/**
		* Calls setTimeout for autoplay.
		* @event _timeout
		* @param {Event} e The Event object.
		*/
		_timeout: function(e){
			
			var $that		= this,
				$interval	= this.get('interval');
			
			if( Y.Lang.isArray($interval) ){
				
				$interval = $interval[ this.get('currentIndex') ];
				
			}
			
			if( !this.get('_isPaused') && !this.get('_isHoverPaused') ){
				
				this.set( '_timeoutID', window.setTimeout(function(){
					
					$that.slide('next');
					
					$that.fire('timeout');
					
				}, parseInt( $interval * 1000, 10 )) );
				
			}
			
		},
		
		/* ! Lifecycle Methods */
		
		/**
		* Binds event handlers and publishes custom events.
		* @method bindUI
		*/
		bindUI: function(){
			
			var $buttons = ['previous', 'next', 'pause', 'play'],
				$pages = this.get('pages'),
				$target,
				i;
				
			// Buttons and Published Events:
			
			this.publish('timeout', { defaultFn: this._timeout });
			
			this.publish('slide', { defaultFn: this._slide });
			
			this.publish('hoverpause', { defaultFn: this._hoverpause });
			
			this.publish('hoverplay', { defaultFn: this._hoverplay });
			
			for( i = 0; i < $buttons.length; i++ ){
				
				this.publish($buttons[i], { defaultFn: this['_' + $buttons[i]] });
				
				$target = this.get( $buttons[i] + 'Button' );
				
				if( !Y.Lang.isNull($target) ){
					
					Y.on('click', this[$buttons[i]], $target, this);
					
				}
				
			}
			
			// Pages:
			
			if( !Y.Lang.isNull($pages) ){
				
				$pages.on('click', this._handlePageClick, this);
				
			}
			
			// Hover:
			
			if( this.get('pauseOnHover') ){
				
				this.get('contentBox').on('mouseenter', this._handleMouseenter, this);
				
				this.get('contentBox').on('mouseleave', this._handleMouseleave, this);
				
			}
			
		},
		
		/**
		* Sets initial widget state.
		* @method syncUI
		*/
		syncUI: function(){
			
			var $that = this,
				$pages = this.get('pages'),
				$count = 0;
			
			// Slides:
			
			this.get('slides').each(function( $node ){
				
				$count++;
				
				if( $count > 1 ){
					
					$node.setStyles( $that.get('transOutAfter') );
					
				}
				
			});
			
			// Pages:
			
			if( !Y.Lang.isNull($pages) ){
				
				$pages.addClass( this.getClassName('page') );
				
			}
			
			// Autoplay:
			
			if( this.get('autoplay') ){
				
				this.play();
				
			}
			
		},
		
		/**
		* Initializes the Slideshow.
		* @method initializer
		*/
		initializer: function(){
			
			// Slides:
			
			this.set('slides', this.get('contentBox').get('children'));
			
			// Pages:
			
			if( Y.Lang.isString(this.get('pages')) ){
				
				this.set('pages', Y.all(this.get('pages')));
				
			}
			
		}
		
	});
	
	Y.Slideshow = Slideshow;
	


}, 'gallery-2011.04.20-13-04' ,{requires:['widget','transition','event-mouseenter']});
