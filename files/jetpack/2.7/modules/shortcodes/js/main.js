(function($){
	var jmpressOpts = {
		fullscreen       : false,
		hash             : { use : false },
		mouse            : { clickSelects : false },
		keyboard         : { use : true },
		animation        : { transitionDuration : '1s' },
		presentationMode : false,
		stepSelector     : '.step',
		duration : {
			defaultValue: 0
		}
	};

	/**
	 * Presentation constructor
	 */
	function Presentation (wrapper) {
		var _self, size, duration, new_css, ie_regex, matches;

		_self = this;

		_self.wrapper      = $(wrapper);                  // The wrapper for toggling fullscreen
		_self.slideshow    = $('.presentation', wrapper); // Holds the slides for jmpress
		_self.navLeft      = $('.nav-arrow-left', wrapper);
		_self.navRight     = $('.nav-arrow-right', wrapper);
		_self.expandButton = $('.nav-fullscreen-button', wrapper);
		_self.overlay      = $('.autoplay-overlay', wrapper);
		_self.fullscreen   = false;
		_self.autoPlaying  = false;
		_self.autoplayTime = parseFloat(_self.slideshow.attr('data-autoplay'), 10) || 0;

		// The wrapper is scaled to the contents' size so that its border wraps tightly
		_self.wrapper.css({
			width: _self.slideshow.width(),
			height: _self.slideshow.height()
		});

		duration = _self.slideshow.attr('duration') || '1s';
		jmpressOpts.animation.transitionDuration = duration;

		// Compensate for transition times
		if( _self.autoplayTime ) {
			_self.autoplayTime += parseFloat(duration, 10) * 1000;
		}

		// Set the opacity transition duration
		// as it is delegated by css and not jmpress
		duration = 'opacity ' + duration;
		new_css = {
			'width'             : _self.slideshow.width(),
			'height'            : _self.slideshow.height(),
			'-webkit-transition': duration,
			'-moz-transition'   : duration,
			'-ms-transition'    : duration,
			'-o-transition'     : duration,
			'transition'        : duration
		};

		$('.step', _self.slideshow).each(function(i, step) {
			$(step).css(new_css);
		});

		// Apply attribute to allow fading individual bullets here,
		// otherwise wp_kses will strip the attribute out
		$('.step.fadebullets li', _self.slideshow).each(function(i, step) {
			$(step).attr('data-jmpress', 'fade');
		});

		// Register resizing to window when fullscreen
		$(window).resize(function() {
			if ( _self.fullscreen )
				_self.resizePresentation();
		});

		// Register the nav bars to move the slides
		_self.navLeft.on('click', function(){
			_self.slideshow.jmpress('prev');
			_self.overlay.css('opacity', 0);
			return false;
		});

		_self.navRight.on('click', function(){
			_self.slideshow.jmpress('next');
			_self.overlay.css('opacity', 0);
			return false;
		});

		_self.slideshow.on('click', function() {
			_self.setAutoplay(true);
			return false;
		});

		_self.slideshow.on('focusout', function() {
			_self.setAutoplay(false);
		});

		// Register toggling fullscreen except for IE 9 or lower
		ie_regex = /MSIE\s(\d+)\.\d+/;
		matches = ie_regex.exec(navigator.userAgent);

		if ( matches && parseInt(matches[1], 10) < 10 ) {
			_self.expandButton.remove();
			_self.expandButton = null;
		} else {
			_self.expandButton.on('click', function() {
				_self.setFullscreen( !_self.fullscreen );
				return false;
			});
		}

		// Register ESC key to exit fullscreen
		$(window).on('keydown', function( event ) {
			if ( event.which == 27 )
				_self.setFullscreen( false );
		});

		// Start the presentation
		_self.slideshow.jmpress(jmpressOpts);

		// Make content visible and remove error message on jmpress success
		if ( _self.slideshow.jmpress('initialized') ) {
			_self.slideshow.css('display', '');
			_self.overlay.css('display', '');
			$('.not-supported-msg', _self.wrapper).remove();
		}

		// A bug in Firefox causes issues with the nav arrows appearing
		// on hover in presentation mode. Explicitly disabling fullscreen
		// on init seems to fix the issue
		_self.setFullscreen( false );
	}

	$.extend( Presentation.prototype, {
		resizePresentation: function () {
			var scale, duration, settings, new_css, widthScale, heightScale;

			// Set the animation duration to 0 during resizing
			// so that there isn't an animation delay when scaling
			// up the slide contents
			settings = this.slideshow.jmpress('settings');
			duration = settings.animation.transitionDuration;

			settings.animation.transitionDuration = '0s';
			this.slideshow.jmpress('reselect');

			scale   = 1;
			new_css = {
				top   : 0,
				left  : 0,
				zoom  : 1
			};

			// Expand the presentation to fill the lesser of the max width or height
			// This avoids content moving past the window for certain window sizes
			if ( this.fullscreen ) {
				widthScale  = $(window).width()  / this.slideshow.width();
				heightScale = $(window).height() / this.slideshow.height();

				scale = Math.min(widthScale, heightScale);

				new_css.top  = ( $(window).height() - (scale * this.slideshow.height()) ) / 2;
				new_css.left = ( $(window).width()  - (scale * this.slideshow.width() ) ) / 2;
			}

			// Firefox does not support the zoom property; IE does, but it does not work
			// well like in webkit, so we manually transform and position the slideshow
			if ( this.slideshow.css('-moz-transform') || this.slideshow.css('-ms-transform') ) {
				// Firefox keeps the center of the element in place and expands outward
				// so we must shift everything to compensate
				new_css.top  += (scale - 1) * this.slideshow.height() / 2;
				new_css.left += (scale - 1) * this.slideshow.width()  / 2;

				scale = 'scale(' + scale + ')';

				$.extend(new_css, {
					'-moz-transform'   : scale,
					'-ms-transform'    : scale,
					'transform'        : scale,
				});
			} else {
				// webkit scales everything with zoom so we need to offset the right amount
				// so that the content is vertically centered after scaling effects
				new_css.top  /= scale;
				new_css.left /= scale;
				new_css.zoom  = scale;
			}

			this.slideshow.css(new_css);

			settings.animation.transitionDuration = duration;
			this.slideshow.jmpress('reselect');
		},

		setFullscreen: function ( on ) {
			this.fullscreen = on;
			this.setAutoplay(false);

			// Save the scroll positions before going into fullscreen mode
			if ( on ) {
				this.scrollVert  = $(window).scrollTop();
				this.scrollHoriz = $(window).scrollLeft();

				// Chrome Bug: Force scroll to be at top
				// otherwise the presentation can end up offscreen
				$(window).scrollTop(0);
				$(window).scrollLeft(0);
			}

			$('html').toggleClass('presentation-global-fullscreen', on);
			$('body').toggleClass('presentation-global-fullscreen', on);

			this.wrapper.toggleClass('presentation-wrapper-fullscreen', on);

			this.wrapper.parents().each(function(i, e){
				$(e).toggleClass('presentation-wrapper-fullscreen-parent', on);
			});

			this.resizePresentation();

			// Reset the scroll positions after exiting fullscreen mode
			if ( !on ) {
				$(window).scrollTop(this.scrollVert);
				$(window).scrollLeft(this.scrollHoriz);
			}
		},

		setAutoplay: function ( on ) {
			var _self = this, newAutoplayTime;

			if ( _self.autoPlaying == on )
				return;

			newAutoplayTime = (on && _self.autoplayTime > 0) ? _self.autoplayTime : 0;
			_self.slideshow.jmpress('settings').duration.defaultValue = newAutoplayTime;

			// Move to the next slide when activating autoplay
			if( newAutoplayTime ) {
				_self.slideshow.jmpress('next');
				_self.overlay.css('opacity', 0);
			} else {
				_self.slideshow.jmpress('reselect');
			}

			_self.autoPlaying = on;
		}
	});

	$( document ).ready( function(){
		$('.presentation-wrapper').map(function() {
			new Presentation(this);
		});
	});

})(jQuery);
