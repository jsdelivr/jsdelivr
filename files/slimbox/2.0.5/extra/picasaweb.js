/*
	This code automatically integrates Picasa Web Albums thumbnails with Slimbox.
	It will scan for all links around thumbnail images pointing to Picasa Web Albums photo PAGES.
	Note that you don't need to add rel="lightbox" to these links.
	When clicking on a Picasa Web Albums thumbnail, Slimbox will open and display the medium-sized image.
	The title attribute of the link (or the alt attribute of the thumbnail if not available) will be used
	as description text, and a link to the Picasa Web Albums photo page will be added under the description.

	Add the following code to the autoload code block.
*/

if (!/android|iphone|ipod|series60|symbian|windows ce|blackberry/i.test(navigator.userAgent)) {
	jQuery(function($) {
		$("a[href^='http://picasaweb.google.'] > img:first-child[src]").parent().slimbox({}, function(el) {
			return [el.firstChild.src.replace(/\/s\d+(?:\-c)?\/([^\/]+)$/, "/s512/$1"),
				(el.title || el.firstChild.alt) + '<br /><a href="' + el.href + '">Picasa Web Albums page</a>'];
		});
	});
}