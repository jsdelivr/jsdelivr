/**
 * Jetpack Gallery Settings
 */
(function($) {
	var media = wp.media;

	// Wrap the render() function to append controls.
	media.view.Settings.Gallery = media.view.Settings.Gallery.extend({
		render: function() {
			media.view.Settings.prototype.render.apply( this, arguments );

			// Append the type template and update the settings.
			this.$el.append( media.template( 'jetpack-gallery-settings' ) );
			media.gallery.defaults.type = 'default'; // lil hack that lets media know there's a type attribute.
			this.update.apply( this, ['type'] );
			return this;
		}
	});
})(jQuery);