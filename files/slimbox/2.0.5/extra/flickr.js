/*
	This code automatically integrates Flickr thumbnails with Slimbox.
	It will scan for all links around thumbnail images pointing to Flickr photo PAGES.
	Note that you don't need to add rel="lightbox" to these links.
	When clicking on a Flickr thumbnail, Slimbox will open and display the medium-sized image.
	The title attribute of the link (or the alt attribute of the thumbnail if not available) will be used
	as description text, and a link to the Flickr photo page will be added under the description.

	Add the following code to the autoload code block.
*/

if (!/android|iphone|ipod|series60|symbian|windows ce|blackberry/i.test(navigator.userAgent)) {
	jQuery(function($) {
		$("a[href^='http://www.flickr.com/photos/'] > img:first-child[src]").parent().slimbox({}, function(el) {
			return [el.firstChild.src.replace(/_[mts]\.(\w+)$/, ".$1"),
				(el.title || el.firstChild.alt) + '<br /><a href="' + el.href + '">Flickr page</a>'];
		});
	});
}