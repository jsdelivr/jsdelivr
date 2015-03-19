/**
 * jquery.windy.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2012, Codrops
 * http://www.codrops.com
 */

;( function( $, window, undefined ) {
	
	'use strict';

	// global
	var Modernizr = window.Modernizr;

	$.Windy = function( options, element ) {
		
		this.$el = $( element );
		this._init( options );
		
	};

	// the options
	$.Windy.defaults = {
		// if we want to specify a selector that triggers the next() function. example: '#wi-nav-next'.
		nextEl : '',
		// if we want to specify a selector that triggers the prev() function.
		prevEl : '',
		// rotation and translation boundaries for the items transitions
		boundaries : {
			rotateX : { min : 40 , max : 90 },
			rotateY : { min : -15 , max : 15 },
			rotateZ : { min : -10 , max : 10 },
			translateX : { min : -200 , max : 200 },
			translateY : { min : -400 , max : -200 },
			translateZ : { min : 250 , max : 550 }
		}
	};

	$.Windy.prototype = {

		_init : function( options ) {
			
			// options
			this.options = $.extend( true, {}, $.Windy.defaults, options );

			// https://github.com/twitter/bootstrap/issues/2870
			this.transEndEventNames = {
				'WebkitTransition' : 'webkitTransitionEnd',
				'MozTransition' : 'transitionend',
				'OTransition' : 'oTransitionEnd',
				'msTransition' : 'MSTransitionEnd',
				'transition' : 'transitionend'
			};
			this.transEndEventName = this.transEndEventNames[ Modernizr.prefixed( 'transition' ) ];

			this.$items = this.$el.children( 'li' );
			this.itemsCount = this.$items.length;

			this.resetTransformStr = 'translateX( 0px ) translateY( 0px ) translateZ( 0px ) rotateX( 0deg ) rotateY( 0deg ) rotateZ( 0deg )';

			this.supportTransitions = Modernizr.csstransitions;
			this.support3d = Modernizr.csstransforms3d;

			// show first item
			this.current = 0;
			this.$items.eq( this.current ).show();
			
			this._initEvents();

		},
		_getRandTransform : function() {

			return {
				rx : Math.floor( Math.random() * ( this.options.boundaries.rotateX.max - this.options.boundaries.rotateX.min + 1 ) + this.options.boundaries.rotateX.min ),
				ry : Math.floor( Math.random() * ( this.options.boundaries.rotateY.max - this.options.boundaries.rotateY.min + 1 ) + this.options.boundaries.rotateY.min ),
				rz : Math.floor( Math.random() * ( this.options.boundaries.rotateZ.max - this.options.boundaries.rotateZ.min + 1 ) + this.options.boundaries.rotateZ.min ),
				tx : Math.floor( Math.random() * ( this.options.boundaries.translateX.max - this.options.boundaries.translateX.min + 1 ) + this.options.boundaries.translateX.min ),
				ty : Math.floor( Math.random() * ( this.options.boundaries.translateY.max - this.options.boundaries.translateY.min + 1 ) + this.options.boundaries.translateY.min ),
				tz : Math.floor( Math.random() * ( this.options.boundaries.translateZ.max - this.options.boundaries.translateZ.min + 1 ) + this.options.boundaries.translateZ.min )
			};

		},
		_initEvents : function() {

			var self = this;

			this.$items.on( this.transEndEventName, function( event ) {

				self._onTransEnd( $( this ) );

			} );

			if( this.options.nextEl !== '' ) {

				$( this.options.nextEl ).on( 'click.windy', function() {

					self.next();
					return false;

				} );

			}

			if( this.options.prevEl !== '' ) {

				$( this.options.prevEl ).on( 'click.windy', function() {

					self.prev();
					return false;

				} );

			}

		},
		_onTransEnd : function( el ) {

			el.removeClass( 'wi-move' );

			if( el.data( 'dir' ) === 'right' ) {

				var styleStart = {
					zIndex : 1,
					opacity : 1
				};

				if( this.support3d ) {

					styleStart.transform = this.resetTransformStr;

				}
				else if( this.supportTransitions ) {

					styleStart.left = 0;
					styleStart.top = 0;

				}

				el.hide().css( styleStart );

			}

		},
		// public method: shows item with index idx
		navigate : function( idx ) {

			var self = this,
				// current item
				$current = this.$items.eq( this.current ),
				// next item to be shown
				$next = this.$items.eq( idx ),
				// random transformation configuration
				randTranform = this._getRandTransform(),
				// the z-index is higher for the first items so that the ordering is correct if more items are moving at the same time
				styleEnd = {
					zIndex : this.itemsCount + 1 - idx,
					opacity : 0
				},
				styleStart = {
					opacity : 1
				};

			if( this.support3d ) {

				styleStart.transform = self.resetTransformStr;
				styleEnd.transform = 'translateX(' + randTranform.tx + 'px) translateY(' + randTranform.ty + 'px) translateZ(' + randTranform.tz + 'px) rotateX(' + randTranform.rx + 'deg) rotateY(' + randTranform.ry + 'deg) rotateZ(' + randTranform.rz + 'deg)';

			}
			else if( this.supportTransitions ) {

				styleStart.left = 0;
				styleStart.top = 0;
				styleEnd.left = randTranform.tx;
				styleEnd.top = randTranform.ty;

			}

			// if navigating to the right..
			if( idx > this.current ) {

				// if last step was to go to the left..
				if( this.dir === 'left') {

					// reset all z-indexes and hide items except the current
					this.$items.not( $current ).css( 'z-index', 1 ).hide();
				
				}
				
				this.dir = 'right';

				$current.addClass( 'wi-move' )
						.data( 'dir', 'right' )
						.css( styleEnd );

				if( $next.hasClass( 'wi-move' ) ) {

					$next.removeClass( 'wi-move' );	
				
				}
				
				// apply styleStart just to make sure..
				$next.css( styleStart ).show();

				if( !this.supportTransitions ) {
			
					this._onTransEnd( $current );

				}
			
			}
			else if( idx < this.current ) {

				this.dir = 'left';

				$next.data( 'dir', 'left' ).css( styleEnd ).show();

				setTimeout( function() {

					$next.addClass( 'wi-move' )
						 .data( 'dir', 'left' )
						 .css( styleStart );

					if( !self.supportTransitions ) {
			
						self._onTransEnd( $next );
			
					}

				}, 20 );

			}

			this.current = idx;

		},
		// public method: returns total number of items
		getItemsCount : function() {

			return this.itemsCount;

		},
		// public method: shows next item
		next : function() {

			if( this.current < this.itemsCount - 1 ) {
				
				var idx = this.current + 1;
				this.navigate( idx );

			}

		},
		// public method: shows previous item
		prev : function() {

			if( this.current > 0 ) {
				
				var idx = this.current - 1;
				this.navigate( idx );

			}

		},
	
	  	// public method: dynamically updates elements list (used in AJAX)
		update : function () {

			var $currentItem = this.$items.eq( this.current );
			this.$items = this.$el.children( 'li' );
			this.itemsCount = this.$items.length;
			this.current = $currentItem.index();

		}

	};
	
	var logError = function( message ) {

		if ( window.console ) {

			window.console.error( message );
		
		}

	};
	
	$.fn.windy = function( options ) {

		var instance = $.data( this, 'windy' );
		
		if ( typeof options === 'string' ) {
			
			var args = Array.prototype.slice.call( arguments, 1 );
			
			this.each(function() {
			
				if ( !instance ) {

					logError( "cannot call methods on windy prior to initialization; " +
					"attempted to call method '" + options + "'" );
					return;
				
				}
				
				if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {

					logError( "no such method '" + options + "' for windy instance" );
					return;
				
				}
				
				instance[ options ].apply( instance, args );
			
			});
		
		} 
		else {
		
			this.each(function() {
				
				if ( instance ) {

					instance._init();
				
				}
				else {

					instance = $.data( this, 'windy', new $.Windy( options, this ) );
				
				}

			});
		
		}
		
		return instance;
		
	};
	
} )( jQuery, window );
