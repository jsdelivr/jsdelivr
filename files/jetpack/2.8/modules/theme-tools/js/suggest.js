/*
 * WARNING: This file is distributed verbatim in Jetpack.
 * There should be nothing WordPress.com specific in this file.
 *
 */

/* global ajaxurl:true */
jQuery( function( $ ) {
	$( '#customize-control-featured-content-tag-name input' ).suggest( ajaxurl + '?action=ajax-tag-search&tax=post_tag', { delay: 500, minchars: 2 } );
} );
