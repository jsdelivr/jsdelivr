/*
	This code automatically integrates Android Market URLs with Slimbox using QR code generation.
	It will scan for all Android market links. These links have URLs starting with "market://".
	Note that you don't need to add rel="lightbox" to these links.
	On an Android phone's browser, clicking on Android Market links will open the Android Market.
	Desktop browsers are normally unable to open these links.
	But thanks to this script, clicking on them will open Slimbox and display a barcode (QR Code)
	that you can scan with your Android phone using your favorite barcode scanner application.
	Scanning the barcode will open the Android Market on the phone.
	The title attribute of the link will be used as description text.

	Add the following code to the autoload code block.
*/

if (!/android|iphone|ipod|series60|symbian|windows ce|blackberry/i.test(navigator.userAgent)) {
	jQuery(function($) {
		$("a[href^='market://']").slimbox({}, function(el) {
			return ["http://chart.apis.google.com/chart?chs=400x400&cht=qr&chl=" + encodeURIComponent(el.href.replace(/\/\?/, "?")),
				el.title + "<br />Scan this barcode with your Android phone."];
		});
	});
}