YUI.add('gallery-yuisand', function(Y) {

 
/**
* YUISand is a widget for YUI3 that fancifies sorting collections of items
* It is based on the excellent jQuery plugin, Quicksand (http://razorjack.net/quicksand/docs-and-demos.html#demo-link)
*
*
*
* Project Home - http://kickballcreative.com/yui/modules/yuisand/
* Copyright (c) 2010 Lauren Smith
* YUI BSD - http://developer.yahoo.com/yui/license.html
*
*
*/
 
// Constants
var animationQueue = [], sand, s, d, p, sourceItems, destItems, rotate, scale, rotDuration, scaleDuration, sorter;
 
/**
* Provides YUISand widget
*
* @module gallery-yuisand
*
*/
var YUISand = function( config ) {
	YUISand.superclass.constructor.call( this, config );
};
 
 /**
 *  Static property provides a string to identify the class.
 *
 * @property YUISand.NAME
 * @type String
 * @static
 */
YUISand.NAME = 'YUISand';
 
/**
 * Static property used to define the default attribute 
 * configuration for YUISand
 * 
 * @property YUISand.ATTRS
 * @type Object
 * @static
 */
YUISand.ATTRS = {
 
	/**
	 * @description Contains the source element node identifier
	 * 
	 * @attribute source
	 * @default #source
	 * @type String
	 */
	source: {
		value: '#source'
	},
 
	/**
	 * @description Contains the destination element node identifier
	 * 
	 * @attribute destination
	 * @default #destination
	 * @type String
	 */
	destination: {
		value: '#destination'
	},
 
	/**
	 * @description Attribute to be used as identifier
	 * 
	 * @attribute attribute
	 * @default data-id
	 * @type String
	 */
	attribute: {
		value: 'id'
	},
 
	/**
	 * @description Easing to be applied to animation
	 * 
	 * @attribute easing
	 * @default Y.Easing.easeOutStrong
	 * @type Object
	 */
	easing: {
		value: Y.Easing.easeOutStrong
	},
 
	/**
	 * @description Duration of the animation sequence
	 * 
	 * @attribute duration
	 * @default 1000
	 * @type Int
	 */
	duration: {
		value: 1000
	},
	
	/**
	 * @description Object for animating the collection with a curve
	 * 
	 * @attribute curve
	 * @default null
	 * @type Object
	 */
	curve: {
		value: null
	},
	
	/**
	 * @description Object for animating the collection with CSS3 transformations
	 * 
	 * @attribute transform
	 * @default null
	 * @type Object
	 */
	transform: {
		value: null
	}
};
 
Y.extend( YUISand, Y.Base, {
 
	initializer: function() {
		
		sand = this;
 
		// Cancel out previous animations if still running			
		if ( animationQueue.length > 0 ) {
			Y.Array.each( animationQueue, function( item, index ) {
				item.animation.stop();
			}, this );
		}
 
		// Grab all our nodes
		s				= Y.one( this.get( 'source' ) );
		d				= Y.one( this.get( 'destination' ) );
		p				= s.get( 'parentNode' );
		sourceItems		= s.all( '> *' );
		destItems		= d.all( '> *' );
		
		// If the destination collection is shown then our job here is complete
		if ( d.getStyle( 'display' ) == 'block' ) { return; }
		
		// If CSS3 transformations set the variables
		if ( this.get( 'transform' ) ) {
						
			rotate			= this.get( 'transform' ).rotate;
			scale			= this.get( 'transform' ).scale;

			rotDuration		= ( rotate && rotate[2] ) ? rotate[2] : 15;
			scaleDuration	= ( scale && scale[2] ) ? scale[2] : 15;
			
		}
 
		// Now time to work
		this._prepCollections();
 
	},
 
	_prepCollections: function() {
		
		var animationType, offsets = {};
 
		p.prepend( '<div id="yuisand_sorter" />' ); // Create a container
 
		sorter = Y.one( '#yuisand_sorter' ).append( s ).append( d );
 
		this._initStyles();
 
		sourceItems.each( function( item ) {
 
			item.setStyle( 'position', 'relative' );
 
			animationType = new Y.Anim({ 
				node		: Y.one( item ),
				duration	: this.get( 'duration' ) / 1000
			});
 
			if ( this._unique( destItems, item.getAttribute( this.get( 'attribute' ) ) ) ) {
 
				animationType.set( 'to', { opacity : 0 } );
 
			} else {
 
				// Store the offsets for the items that are matched to the destination items
				offsets[item.getAttribute( this.get( 'attribute' ) )] = {
					top			: item.get('offsetTop'),
					left		: item.get('offsetLeft'),
					x			: item.getX(),
					y			: item.getY()
				};
 
				item.setStyle( 'opacity', '0' );
 
			}
			
			if ( this.get( 'transform' ) ) {
				
				item.scaleAmt	= ( scale ) ? scale[1] : null;
				item.reverse = true; // Set this flag so we know to switch the animation backwards
				
				this._transform( item );
				
			}
 
			animationQueue.push({
				el				: this,
				animation		: animationType
			});
 
		}, this );
 
		destItems.each( function( item ) {
			
			var origX = item.getX(),
				origY = item.getY();
 
			item.setStyles({
				'position'	: 'relative',
				'opacity'	: '0'
			});
			
			if ( this.get( 'transform' ) ) {
				
				if ( this.get( 'transform' ).rotate ) { item.setStyles({
					'-webkit-transform'		: 'rotate(' + this.get( 'transform' ).rotate[0] + 'deg)',
					'-moz-transform'		: 'rotate(' + this.get( 'transform' ).rotate[0] + 'deg)',
					'transform'				: 'rotate(' + this.get( 'transform' ).rotate[0] + 'deg)'
				}); }

				if ( this.get( 'transform' ).scale ) { item.setStyles({
					'-webkit-transform'		: 'scale(' + this.get( 'transform' ).scale[0] + ')',
					'-moz-transform'		: 'scale(' + this.get( 'transform' ).scale[0] + ')',
					'transform'				: 'scale(' + this.get( 'transform' ).scale[0] + ')'
				}); }
				
			}
 
			animationType = new Y.Anim({ 
				node		: Y.one( item ),
				duration	: this.get( 'duration' ) / 1000
			});
 
			if ( this._unique( sourceItems, item.getAttribute( this.get( 'attribute' ) ) ) ) {
 
				animationType.set( 'to', { opacity : 1 } );
 
			} else {
				
				var top		= offsets[item.getAttribute( this.get( 'attribute' ) )].top,
					left	= offsets[item.getAttribute( this.get( 'attribute' ) )].left,
					x		= offsets[item.getAttribute( this.get( 'attribute' ) )].x,
					y		= offsets[item.getAttribute( this.get( 'attribute' ) )].y;
 
				item.setStyle( 'opacity' , '1' );

				if ( this.get( 'curve' ) ) {
					
					item.setX(x).setY(y);
					animationType.set( 'to', { curve : this._curve( [origX,origY]) } );
					
				} else {
					
					item.setStyles({
						'top'		: ( top - item.get( 'offsetTop' ) ) + 'px',
						'left'		: ( left - item.get( 'offsetLeft' ) ) + 'px'
					});
					
					animationType.set( 'to', {
						top : '0px',
						left : '0px'
					});
					
				}

				animationType.set( 'easing', this.get( 'easing' ) );
 
			}
			
			if ( this.get( 'transform' ) ) {
				
				item.rotateAmt	= ( rotate ) ? rotate[0] : null;
				item.scaleAmt	= ( scale ) ? scale[0] : null;
				item.reverse	= false;
				
				this._transform( item );
				
			}
 
			animationQueue.push({
				el				: this,
				animation		: animationType
			});
 
		}, this );
 
		this._runQueue();
 
	},
 
	_runQueue: function() {
		
		var anim;
 
		Y.Array.each( animationQueue, function( item, index ) {
 
			if ( item.animation !== null ) {
 
				anim = item.animation.run();
 
			}
 
			if ( ( animationQueue.length - 1 ) == index ) {
 
				item.animation.on( 'end', function() {
 
					this._cleanup();
 
					// Fire the callback
					this.fire( 'complete' );
 
				}, this );
 
			}
 
		}, this );
 
	},
 
	_initStyles: function() {
 
		sorter.setStyles({
			'position'	: 'relative',
			'height'	: s.get( 'parentNode' ).getStyle( 'height' )
		});
 
		s.setStyles({
			'position'	: 'absolute',
			'top'		: '0px',
			'left'		: '0px'
		});
 
		d.setStyles({
			'position'	: 'absolute',
			'top'		: '0px',
			'left'		: '0px',
			'display'	: 'block'
		});
 
	},
 
	_unique: function( arr, el ) {
 
		var unique = true;
 
		arr.each( function( item ) {
 
			if ( item.getAttribute( this.get( 'attribute' ) ) === el && unique === true ) {
				unique = false;
			}
 
		}, this );
 
		return unique;
 
	},
	
	_curve: function( end ) {
		
		var options			= this.get( 'curve' ),
			optionsPoints	= ( options.points ) ? options.points : 5,
			optionsStart	= ( options.start ) ? options.start : [0,0],
			points			= [],
			xDiv			= end[0] / optionsPoints,
			yDiv			= end[1] / optionsPoints;
			
		points.push( optionsStart );
		
		for ( var i = 0; i < optionsPoints; i++ ) {
			
			points.push([i * xDiv, i * yDiv ]);
			
		}
		
		if ( end ) {
			
			points.push( end );
			
		}
		
		return points;
		
	},
	
	_transform: function( node ) {

		if ( rotate && !node.reverse ) {
			
			clearInterval( node.rotateTimer );
		
			if ( node.rotateAmt < rotate[1] ) {

				node.rotateAmt++;

				node.setStyles({
					'-webkit-transform'		: 'rotate(' + node.rotateAmt + 'deg)',
					'-moz-transform'		: 'rotate(' + node.rotateAmt + 'deg)',
					'transform'				: 'rotate(' + node.rotateAmt + 'deg)'
				});

			} else { this._deleteTimer( node.scaleTimer ); }
			
			node.rotateTimer = setInterval( function() { sand._transform( node ); }, rotDuration );
			
		}

		if ( scale ) {
			
			clearInterval( node.scaleTimer );
			
			if ( node.reverse ) {

				if ( node.scaleAmt > scale[0] ) {
				
					node.scaleAmt = node.scaleAmt - 0.1;
				
					node.setStyles({
						'-webkit-transform'		: 'scale(' + node.scaleAmt + ')',
						'-moz-transform'		: 'scale(' + node.scaleAmt + ')',
						'transform'				: 'scale(' + node.scaleAmt + ')'
					});
					
				} else { this._deleteTimer( node.scaleTimer ); }
				
				node.scaleTimer = setInterval( function() { sand._transform( node ); }, scaleDuration );
				
			} else {
				
				if ( node.scaleAmt < scale[1] ) {

					node.scaleAmt = node.scaleAmt + 0.1;

					node.setStyles({
						'-webkit-transform'		: 'scale(' + node.scaleAmt + ')',
						'-moz-transform'		: 'scale(' + node.scaleAmt + ')',
						'transform'				: 'scale(' + node.scaleAmt + ')'
					});

				} else { this._deleteTimer( node.scaleTimer ); }

				node.scaleTimer = setInterval( function() { sand._transform( node ); }, scaleDuration );
				
			}
			
		}
		
	},
	
	_deleteTimer: function( time ) {
		
		clearInterval( time );
		time = null;
		
	},
 
	_cleanup: function() {
 
		animationQueue = [];
 
		p.prepend( d ).prepend( s );
 
		sorter.remove();
 
		s.setStyles({
			'position'	: '',
			'top'		: '',
			'left'		: '',
			'display'	: 'none'
		});
 
		d.setStyles({
			'position'	: '',
			'top'		: '',
			'left'		: ''
		});
 
	}
 
});
 
Y.YUISand = YUISand;


}, 'gallery-2010.03.24-20-12' ,{requires:['anim']});
