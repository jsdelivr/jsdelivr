/*
	The following code is identical to the default autoload code block,
	excepted that it will automatically fix URLs containing invalid characters.
	Some people use invalid characters like whitespaces, parenthesis or quotes in their image URLs.
	Slimbox does not work correctly with these characters, as explained in the FAQ. It's NOT a bug.
	The right solution is to fix the URLs by replacing these invalid characters
	with URL-encoded entities, so that they respect the standards.
	
	However if you are lazy and want the javascript to fix them for you before passing them to Slimbox,
	then replace the default autoload code block with this one.
*/

if (!/android|iphone|ipod|series60|symbian|windows ce|blackberry/i.test(navigator.userAgent)) {
	jQuery(function($) {
		$("a[rel^='lightbox']").slimbox({/* Put custom options here */}, function(el) {
			return [encodeURI(el.href), el.title];
		}, function(el) {
			return (this == el) || ((this.rel.length > 8) && (this.rel == el.rel));
		});
	});
}