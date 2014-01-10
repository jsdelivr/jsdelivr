(function($){
	var $ids;
	var $thumbs;

	$(function(){
		$( '.widgets-holder-wrap, .editwidget' ).on( 'click', '.gallery-widget-choose-images', function( event ) {
			event.preventDefault();

			var widget_form = $( this ).closest( 'form' );

			$ids 	= widget_form.find( '.gallery-widget-ids' );
			$thumbs	= widget_form.find( '.gallery-widget-thumbs' );

			var idsString = $ids.val();

			var attachments = getAttachments( idsString );

			var selection 	= null;
			var editing 	= false;

			if ( attachments ) {
				var selection = getSelection( attachments );

				editing = true;
			}

			var options = {
				state: 'gallery-edit',
				title: wp.media.view.l10n.addMedia,
				multiple: true,
				editing: editing,
				selection: selection
			};

			var workflow = getWorkflow( options );

			workflow.open();
		});

		// Setup an onchange handler to toggle various options when changing style. The different style options
		// require different form inputs to be presented in the widget; this event will keep the UI in sync
		// with the selected style
		$( ".widget-inside" ).on( 'change', '.gallery-widget-style', setupStyleOptions);

		// Setup the Link To options for all forms currently on the page. Does the same as the onChange handler, but
		// is called once to display the correct form inputs for each widget on the page
		setupStyleOptions();
	});

	var media       = wp.media,
		Attachment  = media.model.Attachment,
		Attachments = media.model.Attachments,
		Query       = media.model.Query,
		l10n;

	// Link any localized strings.
	l10n = media.view.l10n = typeof _wpMediaViewsL10n === 'undefined' ? {} : _wpMediaViewsL10n;

	/**
	 * wp.media.view.MediaFrame.GalleryWidget
	 *
	 * This behavior can be very nearly had by setting the workflow's state to 'gallery-edit', but
	 * we cannot use the custom WidgetGalleryEdit controller with it (must overide createStates(),
	 * which is necessary to disable the sidebar gallery settings in the media browser)
	 */
	media.view.MediaFrame.GalleryWidget = media.view.MediaFrame.Post.extend({
		createStates: function() {
			var options = this.options;

			this.states.add([
				new media.controller.WidgetGalleryEdit({
					library: options.selection,
					editing: options.editing,
					menu:    'gallery'
				}),
				new media.controller.GalleryAdd({

				})
			]);
		}
	});

	/**
	 * wp.media.controller.WidgetGalleryEdit
	 *
	 * Removes the gallery settings sidebar when editing widgets...settings are instead handled
	 * via the standard widget interface form
	 *
	 */
	media.controller.WidgetGalleryEdit = media.controller.GalleryEdit.extend({
		gallerySettings: function( browser ) {
			return;
		}
	});

	function setupStyleOptions(){
		$( '.widget-inside .gallery-widget-style' ).each( function( i ){
			var style = $( this ).val();

			var form = $( this ).parents( 'form' );

			switch ( style ) {
				case 'slideshow':
					form.find( '.gallery-widget-link-wrapper' ).hide();
					form.find( '.gallery-widget-columns-wrapper' ).hide();

					break;

				default:
					form.find( '.gallery-widget-link-wrapper' ).show();
					form.find( '.gallery-widget-columns-wrapper' ).show();
			}
		});
	}

	/**
	 * Take a given Selection of attachments and a thumbs wrapper div (jQuery object)
	 * and fill it with thumbnails
	 */
	function setupThumbs( selection, wrapper ){
		wrapper.empty();

		var imageSize = _wpGalleryWidgetAdminSettings.thumbSize;

		selection.each( function( model ){
			var sizedUrl = model.get('url') + '?w=' + imageSize + '&h=' + imageSize + '&crop=true';

			var thumb = '<img src="' + sizedUrl + '" alt="' + model.get('title') + '" \
				title="' + model.get('title') + '" width="' + imageSize + '" height="' + imageSize + '" class="thumb" />';

			wrapper.append( thumb );
		});
	}

	/**
	 * Take a csv string of ids (as stored in db) and fetch a full Attachments collection
	 */
	function getAttachments( idsString ) {
		if( ! idsString )
			return null;

		// Found in /wp-includes/js/media-editor.js
		var shortcode = wp.shortcode.next( 'gallery', '[gallery ids="' + idsString + '"]' );

		// Ignore the rest of the match object, to give attachments() below what it expects
		shortcode 	= shortcode.shortcode;

		var attachments = wp.media.gallery.attachments( shortcode );

		return attachments;
	}

	/**
	 * Take an Attachments collection and return a corresponding Selection model that can be
	 * passed to a MediaFrame to prepopulate the gallery picker
	 */
	function getSelection( attachments ) {
		var selection = new wp.media.model.Selection( attachments.models, {
			props:    attachments.props.toJSON(),
			multiple: true
		});

		selection.gallery = attachments.gallery;

		// Fetch the query's attachments, and then break ties from the
		// query to allow for sorting.
		selection.more().done( function() {
			// Break ties with the query.
			selection.props.set( { query: false } );
			selection.unmirror();
			selection.props.unset( 'orderby' );
		});

		return selection;
	}

	/**
	 * Create a media 'workflow' (MediaFrame). This is the main entry point for the media picker
	 */
	function getWorkflow( options ) {
		var workflow = new wp.media.view.MediaFrame.GalleryWidget( options );

		workflow.on( 'update', function( selection ) {
			var state = workflow.state();

			selection = selection || state.get( 'selection' );

			if ( ! selection )
				return;

			// Map the Models down into a simple array of ids that can be easily imploded to a csv string
			var ids = selection.map( function( model ){
				return model.get( 'id' );
			} );

			var id_string = ids.join( ',' );

			$ids.val( id_string );

			setupThumbs( selection, $thumbs );
		}, this );

		workflow.setState( workflow.options.state );

		return workflow;
	}
})(jQuery);
