function JetpackSlideshow( element, width, height, transition ) {
	this.element = element;
	this.images = [];
	this.controls = {};
	this.transition = transition || 'fade';

	var currentWidth = this.element.width();
	if ( !width || width > currentWidth )
		width = currentWidth;

	this.width = width;
	this.height = height;
	this.element.css( {
		'height': this.height + 'px'
		} );
}

JetpackSlideshow.prototype.showLoadingImage = function( toggle ) {
	if ( toggle ) {
		this.loadingImage_ = document.createElement( 'div' );
		this.loadingImage_.className = 'slideshow-loading';
		var img = document.createElement( 'img' );
		img.src = jetpackSlideshowSettings.spinner;
		this.loadingImage_.appendChild( img );
		this.loadingImage_.appendChild( this.makeZeroWidthSpan() );
		this.loadingImage_.style.lineHeight = this.height + 'px';
		this.element.append( this.loadingImage_ );
	} else if ( this.loadingImage_ ) {
		this.loadingImage_.parentNode.removeChild( this.loadingImage_ );
		this.loadingImage_ = null;
	}
};

JetpackSlideshow.prototype.init = function() {
	this.showLoadingImage(true);

	var self = this;
	// Set up DOM.
	for ( var i = 0; i < this.images.length; i++ ) {
		var imageInfo = this.images[i];
		var img = document.createElement( 'img' );
		img.src = imageInfo.src + '?w=' + this.width;
		img.align = 'middle';
		var caption = document.createElement( 'div' );
		caption.className = 'slideshow-slide-caption';
		caption.innerHTML = imageInfo.caption;
		var container = document.createElement('div');
		container.className = 'slideshow-slide';
		container.style.lineHeight = this.height + 'px';

		// Hide loading image once first image has loaded.
		if ( i == 0 ) {
			if ( img.complete ) {
				// IE, image in cache
				setTimeout( function() {
					self.finishInit_();
				}, 1);
			} else {
				jQuery( img ).load(function() {
					self.finishInit_();
				});
			}
		}
		container.appendChild( img );
		// I'm not sure where these were coming from, but IE adds
		// bad values for width/height for portrait-mode images
		img.removeAttribute('width');
		img.removeAttribute('height');
		container.appendChild( this.makeZeroWidthSpan() );
		container.appendChild( caption );
		this.element.append( container );
	}
};

JetpackSlideshow.prototype.makeZeroWidthSpan = function() {
	var emptySpan = document.createElement( 'span' );
	emptySpan.className = 'slideshow-line-height-hack';
	// Having a NBSP makes IE act weird during transitions, but other
	// browsers ignore a text node with a space in it as whitespace.
	if (jQuery.browser.msie) {
		emptySpan.appendChild( document.createTextNode(' ') );
	} else {
		emptySpan.innerHTML = '&nbsp;';
	}
	return emptySpan;
};

JetpackSlideshow.prototype.finishInit_ = function() {
	this.showLoadingImage( false );
	this.renderControls_();

	var self = this;
	// Initialize Cycle instance.
	this.element.cycle( {
		fx: this.transition,
		prev: this.controls.prev,
		next: this.controls.next,
		slideExpr: '.slideshow-slide',
		onPrevNextEvent: function() {
			return self.onCyclePrevNextClick_.apply( self, arguments );
		}
	} );

	var slideshow = this.element;
	jQuery( this.controls['stop'] ).click( function() {
		var button = jQuery(this);
		if ( ! button.hasClass( 'paused' ) ) {
			slideshow.cycle( 'pause' );
			button.removeClass( 'running' );
			button.addClass( 'paused' );
		} else {
			button.addClass( 'running' );
			button.removeClass( 'paused' );
			slideshow.cycle( 'resume', true );
		}
		return false;
	} );

	var controls = jQuery( this.controlsDiv_ );
	slideshow.mouseenter( function() {
		controls.fadeIn();
	} );
	slideshow.mouseleave( function() {
		controls.fadeOut();
	} );

	this.initialized_ = true;
};

JetpackSlideshow.prototype.renderControls_ = function() {
	if ( this.controlsDiv_ )
		return;

	var controlsDiv = document.createElement( 'div' );
	controlsDiv.className = 'slideshow-controls';

	controls = [ 'prev', 'stop', 'next' ];
	for ( var i = 0; i < controls.length; i++ ) {
		var controlName = controls[i];
		var a = document.createElement( 'a' );
		a.href = '#';
		controlsDiv.appendChild( a );
		this.controls[controlName] = a;
	}
	this.element.append( controlsDiv );
	this.controlsDiv_ = controlsDiv;
};

JetpackSlideshow.prototype.onCyclePrevNextClick_ = function( isNext, i, slideElement ) {
	// If blog_id not present don't track page views
	if ( ! jetpackSlideshowSettings.blog_id )
		return;

	var postid = this.images[i].id;
	var stats = new Image();
	stats.src = document.location.protocol +
		'//stats.wordpress.com/g.gif?host=' +
		escape( document.location.host ) +
		'&rand=' + Math.random() +
		'&blog=' + jetpackSlideshowSettings.blog_id +
		'&subd=' + jetpackSlideshowSettings.blog_subdomain +
		'&user_id=' + jetpackSlideshowSettings.user_id +
		'&post=' + postid +
		'&ref=' + escape( document.location );
};

( function ( $ ) {
	function jetpack_slideshow_init() {
		$( '.jetpack-slideshow-noscript' ).remove();

		$( '.jetpack-slideshow' ).each( function () {
			var container = $( this );

			if ( container.data( 'processed' ) )
				return;

			var slideshow = new JetpackSlideshow( container, container.data( 'width' ), container.data( 'height' ), container.data( 'trans' ) );
			slideshow.images = container.data( 'gallery' );
			slideshow.init();

			container.data( 'processed', true );
		} );
	}

	$( document ).ready( jetpack_slideshow_init );
	$( 'body' ).on( 'post-load', jetpack_slideshow_init );
} )( jQuery );