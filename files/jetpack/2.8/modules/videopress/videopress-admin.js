/**
 * VideoPress Admin
 *
 * @todo i18n
 */
(function($) {
	var media = wp.media;
	var VideoPress = VideoPress || {};

	VideoPress.caps = VideoPressAdminSettings.caps;
	VideoPress.l10n = VideoPressAdminSettings.l10n;

	/**
	 * Create a new controller that simply adds a videopress key
	 * to the library query
	 */
	media.controller.VideoPress = media.controller.Library.extend({
		defaults: _.defaults({
			id:         'videopress',
			router:     'videopress',
			toolbar:    'videopress-toolbar',
			title:      'VideoPress',
			priority:   200,
			searchable: true,
			sortable:   false
		}, media.controller.Library.prototype.defaults ),

		initialize: function() {
			if ( ! this.get('library') )
				this.set( 'library', media.query({ videopress: true }) );

			media.controller.Library.prototype.initialize.apply( this, arguments );
		},

		/**
		 * The original function saves content for the browse router only,
		 * so we hi-jack it a little bit.
		 */
		saveContentMode: function() {
			if ( 'videopress' !== this.get('router') )
				return;

			var mode = this.frame.content.mode(),
				view = this.frame.router.get();

			if ( view && view.get( mode ) ) {

				// Map the Upload a Video back to the regular Upload Files.
				if ( 'upload_videopress' === mode )
					mode = 'upload';

				setUserSetting( 'libraryContent', mode );
			}
		}
	});

	/**
	 * VideoPress Uploader
	 */
	media.view.VideoPressUploader = media.View.extend({
		tagName:   'div',
		className: 'uploader-videopress',
		template:  media.template('videopress-uploader'),

		events: {
			'submit .videopress-upload-form': 'submitForm'
		},

		initialize: function() {
			var that = this;

			if ( ! window.addEventListener )
				window.attachEvent( "onmessage", function() { return that.messageHandler.apply( that, arguments ); } );
			else
				window.addEventListener( "message", function() { return that.messageHandler.apply( that, arguments ); }, false );

			return media.View.prototype.initialize.apply( this, arguments );
		},

		submitForm: function() {
			var data = false;

			this.clearErrors();

			if ( this.$( 'input[name="videopress_file"]').val().length < 1 ) {
				this.error( VideoPress.l10n.selectVideoFile );
				return false;
			}

			// Prevent multiple submissions.
			this.$( '.videopress-upload-form .button' ).prop( 'disabled', true );

			// A non-async request for an upload token.
			media.ajax( 'videopress-get-upload-token', { async: false } ).done( function( response ) {
				data = response;
				data.success = true;
			}).fail( function( response ) {
				data = response;
				data.success = false;
			});

			if ( ! data.success ) {
				// Re-enable form elements.
				this.$( '.videopress-upload-form .button' ).prop( 'disabled', false );

				// Display an error message and cancel form submission.
				this.error( data.message );
				return false;
			}

			this.error( VideoPress.l10n.videoUploading, 'updated' );

			// Set the form token.
			this.$( 'input[name="videopress_blog_id"]' ).val( data.videopress_blog_id );
			this.$( 'input[name="videopress_token"]' ).val( data.videopress_token );
			this.$( '.videopress-upload-form' ).attr( 'action', data.videopress_action_url );
			return true;
		},

		error: function( message, type ) {
			type = type || 'error';
			var div = $( '<div />' ).html( $( '<p />' ).text( message ) ).addClass( type );
			this.$( '.videopress-errors' ).html( div );
			return this;
		},

		success: function( message ) {
			return this.error( message, 'updated' );
		},

		clearErrors: function() {
			this.$( '.videopress-errors' ).html('');
			return this;
		},

		messageHandler: function( event ) {
			if ( ! event.origin.match( /\.wordpress\.com$/ ) )
				return;

			if ( event.data.indexOf && event.data.indexOf( 'vpUploadResult::' ) === 0 ) {
				var result = JSON.parse( event.data.substr( 16 ) );

				if ( ! result || ! result.code ) {
					this.error( VideoPress.l10n.unknownError );
					this.$( '.videopress-upload-form .button' ).prop( 'disabled', false );
					return;
				}

				if ( 'success' == result.code && result.data ) {
					var that = this, controller = this.controller,
					    state = controller.states.get( 'videopress' );

					// Our new video has been added, so we need to reset the library.
					// Since the Media API caches all queries, we add a random attribute
					// to avoid the cache, then call more() to actually fetch the data.

					state.set( 'library', media.query({ videopress:true, vp_random:Math.random() }) );
					state.get( 'library' ).more().done(function(){
						var model = state.get( 'library' ).get( result.data.attachment_id );

						// Clear errors and select the uploaded item.
						that.clearErrors();
						state.get( 'selection' ).reset([ model ]);
						controller.content.mode( 'browse' );
					});
				} else {
					this.error( result.code );

					// Re-enable form elements.
					this.$( '.videopress-upload-form .button' ).prop( 'disabled', false );
				}
			}
		}
	});

	/**
	 * Add a custom sync function that would add a few extra
	 * options for models which are VideoPress videos.
	 */
	var attachmentSync = media.model.Attachment.prototype.sync;
	media.model.Attachment.prototype.sync = function( method, model, options ) {
		if ( model.get( 'vp_isVideoPress' ) ) {
			console.log( 'syncing ' + model.get( 'vp_guid' ) );
			options.data = _.extend( options.data || {}, {
				is_videopress: true,
				vp_nonces: model.get( 'vp_nonces' )
			} );
		}

		// Call the original sync routine.
		return attachmentSync.apply( this, arguments );
	};

	/**
	 * Extend the default Attachment Details view. Check for vp_isVideoPress before
	 * adding anything to these methods.
	 */
	var AttachmentDetails = media.view.Attachment.Details;
	media.view.Attachment.Details = AttachmentDetails.extend({

		initialize: function() {
			if ( this.model.get( 'vp_isVideoPress' ) ) {
				_.extend( this.events, {
					'click a.videopress-preview': 'vpPreview',
					'change .vp-radio': 'vpRadioChange',
					'change .vp-checkbox': 'vpCheckboxChange'
				});
			}
			return AttachmentDetails.prototype.initialize.apply( this, arguments );
		},

		render: function() {
			var r = AttachmentDetails.prototype.render.apply( this, arguments );
			if ( this.model.get( 'vp_isVideoPress' ) ) {
				var template = media.template( 'videopress-attachment' );
				var options = this.model.toJSON();

				options.can = {};
				options.can.save = !! options.nonces.update;

				this.$el.append( template( options ) );
			}
			return r;
		},

		// Handle radio buttons
		vpRadioChange: function(e) {
			$( e.target ).parents( '.vp-setting' ).find( '.vp-radio-text' ).val( e.target.value ).change();
		},

		// And checkboxes
		vpCheckboxChange: function(e) {
			$( e.target ).parents( '.vp-setting' ).find( '.vp-checkbox-text' ).val( Number( e.target.checked ) ).change();
		},

		vpPreview: function() {
			VideoPressModal.render( this );
			return this;
		}
	});

	/**
	 * Don't display the uploader dropzone for the VideoPress router.
	 */
	var UploaderWindow = media.view.UploaderWindow;
	media.view.UploaderWindow = UploaderWindow.extend({
		show: function() {
			if ( 'videopress' != this.controller.state().get('id') )
				UploaderWindow.prototype.show.apply( this, arguments );

			return this;
		}
	});

	/**
	 * Don't display the uploader in the attachments browser.
	 */
	var AttachmentsBrowser = media.view.AttachmentsBrowser;
	media.view.AttachmentsBrowser = AttachmentsBrowser.extend({
		createUploader: function() {
			if ( 'videopress' != this.controller.state().get('id') )
				return AttachmentsBrowser.prototype.createUploader.apply( this, arguments );
		}
	});

	/**
	 * Add VideoPress-specific methods for all frames.
	 */
	_.extend( media.view.MediaFrame.prototype, { VideoPress: { // this.VideoPress.method()

		// When the VideoPress router is activated.
		activate: function() {
			var view = _.first( this.views.get( '.media-frame-router' ) ),
			    viewSettings = {};

			if ( VideoPress.caps.read_videos )
				viewSettings.browse = { text: VideoPress.l10n.VideoPressLibraryRouter, priority: 40 };

			if ( VideoPress.caps.upload_videos )
				viewSettings.upload_videopress = { text: VideoPress.l10n.uploadVideoRouter, priority: 20 };

			view.set( viewSettings );

			// Intercept and clear all incoming uploads
			wp.Uploader.queue.on( 'add', this.VideoPress.disableUpload, this );

			// Map the Upload Files view to the Upload a Video one (upload_videopress vs. upload)
			if ( 'upload' === this.content.mode() && VideoPress.caps.upload_videos )
				this.content.mode( 'upload_videopress' );
			else
				this.content.mode( 'browse' );
		},

		// When navigated away from the VideoPress router.
		deactivate: function( view ) {
			wp.Uploader.queue.off( 'add', this.VideoPress.disableUpload );
		},

		// Disable dragdrop uploads in the VideoPress router.
		disableUpload: function( attachment ) {
			var uploader = this.uploader.uploader.uploader;
			uploader.stop();
			uploader.splice();
			attachment.destroy();
		},

		// Runs on videopress:insert event fired by our custom toolbar
		insert: function( selection ) {
			var guid = selection.models[0].get( 'vp_guid' ).replace( /[^a-zA-Z0-9]+/, '' );
			media.editor.insert( '[wpvideo ' + guid + ']' );
			return this;
		},

		// Triggered by the upload_videopress router item.
		uploadVideo: function() {
			this.content.set( new media.view.VideoPressUploader({
				controller: this
			}) );
			return this;
		},

		// Create a custom toolbar
		createToolbar: function( toolbar ) {
			// Alow an option to hide the toolbar.
			if ( this.options.VideoPress && this.options.VideoPress.hideToolbar )
				return this;

			var controller = this;
			this.toolbar.set( new media.view.Toolbar({
				controller: this,
				items: {
					insert: {
						style:    'primary',
						text:     VideoPress.l10n.insertVideoButton,
						priority: 80,
						requires: {
							library: true,
							selection: true
						},

						click: function() {
							var state = controller.state(),
								selection = state.get('selection');

							controller.close();
							state.trigger( 'videopress:insert', selection ).reset();
						}
					}
				}
			}) );
		}
	}});

	var MediaFrame = {};

	/**
	 * Extend the selection media frame
	 */
	MediaFrame.Select = media.view.MediaFrame.Select;
	media.view.MediaFrame.Select = MediaFrame.Select.extend({
		bindHandlers: function() {
			MediaFrame.Select.prototype.bindHandlers.apply( this, arguments );

			this.on( 'router:create:videopress', this.createRouter, this );
			this.on( 'router:activate:videopress', this.VideoPress.activate, this );
			this.on( 'router:deactivate:videopress', this.VideoPress.deactivate, this );

			this.on( 'content:render:upload_videopress', this.VideoPress.uploadVideo, this );
			this.on( 'toolbar:create:videopress-toolbar', this.VideoPress.createToolbar, this );
			this.on( 'videopress:insert', this.VideoPress.insert, this );
		}
	});

	/**
	 * Extend the post editor media frame with our own
	 */
	MediaFrame.Post = media.view.MediaFrame.Post;
	media.view.MediaFrame.Post = MediaFrame.Post.extend({
		createStates: function() {
			MediaFrame.Post.prototype.createStates.apply( this, arguments );
			this.states.add([ new media.controller.VideoPress() ]);
		}
	});

	/**
	 * A VideoPress Modal view that we can use to preview videos.
	 * Expects a controller object on render.
	 */
	var VideoPressModalView = Backbone.View.extend({
		'className': 'videopress-modal-container',
		'template': wp.media.template( 'videopress-media-modal' ),

		// Render the VideoPress modal with a video object by guid.
		render: function( controller ) {
			this.delegateEvents( {
				'click .videopress-modal-close': 'closeModal',
				'click .videopress-modal-backdrop': 'closeModal'
			} );

			this.model = controller.model;
			this.guid = this.model.get( 'vp_guid' );

			if ( ! this.$frame )
				this.$frame = $( '.media-frame-content' );

			this.$el.html( this.template( { 'video' : this.model.get( 'vp_embed' ) } ) );
			this.$modal = this.$( '.videopress-modal' );
			this.$modal.hide();

			this.$frame.append( this.$el );
			this.$modal.slideDown( 'fast' );

			return this;
		},

		closeModal: function() {
			var view = this;
			this.$modal.slideUp( 'fast', function() { view.remove(); } );
			return this;
		}
	});

	var VideoPressModal = new VideoPressModalView();

	// Configuration screen behavior
	$(document).on( 'ready', function() {
		var $form = $( '#videopress-settings' );

		// Not on a configuration screen
		if ( ! $form.length )
			return;

		var $access = $form.find( 'input[name="videopress-access"]' ),
		    $upload = $form.find( 'input[name="videopress-upload"]' );

		$access.on( 'change', function() {
			var access = $access.filter( ':checked' ).val();
			$upload.attr( 'disabled', ! access );

			if ( ! access )
				$upload.attr( 'checked', false );
		});

		$access.trigger( 'change' );
	});

	// Media -> VideoPress menu
	$(document).on( 'click', '#videopress-browse', function() {

		var frame = wp.media({
			state: 'videopress',
			states: [ new media.controller.VideoPress() ],
			VideoPress: { hideToolbar: true }
		}).open();

		return false;
	});
})(jQuery);