( function($) {

var TiledGallery = function() {
	this.resizeTimeout = null;

	this.populate();

	var self = this;

	$( window ).on( 'resize', function () {
		clearTimeout( self.resizeTimeout );

		self.resizeTimeout = setTimeout( function () { self.resize(); }, 150 );
	} );

    // Make any new galleries loaded by Infinite Scroll flexible
    $( 'body' ).on( 'post-load', $.proxy( self.initialize, self ) );

	// Populate and set up captions on newdash galleries.
	$( document ).on( 'page-rendered.wpcom-newdash', $.proxy( self.populate, self ) );

	this.resize();
};

TiledGallery.prototype.populate = function() {
	this.gallery = $( '.tiled-gallery' );
	this.item    = this.gallery.find( '.tiled-gallery-item' );
	this.caption = this.gallery.find( '.tiled-gallery-caption' );

	this.Captions();
};

TiledGallery.prototype.initialize = function() {
	var self = this;

	self.populate();

	// After each image load, run resize in case all images in the gallery are loaded.
	self.gallery.find( 'img' ).off( 'load.tiled-gallery' ).on( 'load.tiled-gallery', function () {
		self.resize();
	} );

	// Run resize now in case all images loaded from cache.
	self.resize();
};

/**
 * Story
 */
TiledGallery.prototype.Captions = function() {
	/* Hide captions */
	this.caption.hide();

	this.item.hover(
		function() { $( this ).find( '.tiled-gallery-caption' ).slideDown( 'fast' ); },
		function() { $( this ).find( '.tiled-gallery-caption' ).slideUp( 'fast' ); }
	);
};

TiledGallery.prototype.resize = function() {
	var resizeableElements = '.gallery-row, .gallery-group, .tiled-gallery-item img';

	this.gallery.each( function ( galleryIndex, galleryElement ) {
		var thisGallery = $( galleryElement );

		// All images must be loaded before proceeding.
		var imagesLoaded = true;

		thisGallery.find( 'img' ).each( function () {
			if ( ! this.complete ) {
				imagesLoaded = false;
				return false;
			}
		} );

		if ( ! imagesLoaded ) {
			var loadCallback = arguments.callee;

			// Once all of the images have loaded,
			// re-call this containing function.
			$( window ).load( function () {
				loadCallback( null, thisGallery );
			} );

			return;
		}

		if ( ! thisGallery.data( 'sizes-set' ) ) {
			// Maintain a record of the original widths and heights of these elements
			// for proper scaling.
			thisGallery.data( 'sizes-set', true );

			thisGallery.find( resizeableElements ).each( function () {
				var thisGalleryElement = $( this );

				// Don't change margins, but remember what they were so they can be
				// accounted for in size calculations.  When the screen width gets
				// small enough, ignoring the margins can cause images to overflow
				// into new rows.
				var extraWidth = ( parseInt( thisGalleryElement.css( 'marginLeft' ), 10 ) || 0 ) + ( parseInt( thisGalleryElement.css( 'marginRight' ), 10 ) || 0 );
				var extraHeight = ( parseInt( thisGalleryElement.css( 'marginTop' ), 10 ) || 0 ) + ( parseInt( thisGalleryElement.css( 'marginBottom' ), 10 ) || 0 )

				// In some situations, tiled galleries in Firefox have shown scrollbars on the images because
				// the .outerWidth() call on the image returns a value larger than the container. Restrict
				// widths used in the resizing functions to the maximum width of the container.
				var parentElement = $( thisGalleryElement.parents( resizeableElements ).get( 0 ) );

				if ( parentElement && parentElement.data( 'original-width' ) ) {
					thisGalleryElement
						.data( 'original-width', Math.min( parentElement.data( 'original-width' ), thisGalleryElement.outerWidth( true ) ) )
						.data( 'original-height', Math.min( parentElement.data( 'original-height' ), thisGalleryElement.outerHeight( true ) ) );
				}
				else {
					thisGalleryElement
						.data( 'original-width', thisGalleryElement.outerWidth( true ) )
						.data( 'original-height', thisGalleryElement.outerHeight( true ) );
				}

				thisGalleryElement
					.data( 'extra-width', extraWidth )
					.data( 'extra-height', extraHeight );
			} );
		}

		// Resize everything in the gallery based on the ratio of the current content width
		// to the original content width;
		var originalWidth = thisGallery.data( 'original-width' );
		var currentWidth = thisGallery.parent().width();
		var resizeRatio = Math.min( 1, currentWidth / originalWidth );

		thisGallery.find( resizeableElements ).each( function () {
			var thisGalleryElement = $( this );

			thisGalleryElement
				.width( Math.floor( resizeRatio * thisGalleryElement.data( 'original-width' ) ) - thisGalleryElement.data( 'extra-width' ) )
				.height( Math.floor( resizeRatio * thisGalleryElement.data( 'original-height' ) ) - thisGalleryElement.data( 'extra-height' ) );
		} );

		thisGallery.removeClass( 'tiled-gallery-unresized' );
	} );
};

/**
 * Ready, set...
 */
$( document ).ready( function() {

	// Instance!
	var TiledGalleryInstance = new TiledGallery;

});

})(jQuery);