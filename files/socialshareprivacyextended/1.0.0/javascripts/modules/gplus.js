/*
 * jquery.socialshareprivacy.js | 2 Klicks fuer mehr Datenschutz
 *
 * http://www.heise.de/extras/socialshareprivacy/
 * http://www.heise.de/ct/artikel/2-Klicks-fuer-mehr-Datenschutz-1333879.html
 *
 * Copyright (c) 2011 Hilko Holweg, Sebastian Hilbig, Nicolas Heiringhoff, Juergen Schmidt,
 * Heise Zeitschriften Verlag GmbH & Co. KG, http://www.heise.de
 *
 * Copyright (c) 2012 Mathias Panzenböck
 *
 * is released under the MIT License http://www.opensource.org/licenses/mit-license.php
 *
 * Spread the word, link to us if you can.
 */
(function ($, undefined) {
	"use strict";

	$.fn.socialSharePrivacy.settings.services.gplus = {
		'status'            : true,
		'button_class'      : 'gplusone',
		'dummy_line_img'    : 'images/dummy_gplus.png',
		'dummy_box_img'     : 'images/dummy_box_gplus.png',
		'dummy_alt'         : '"Google+1"-Dummy',
		'txt_info'          : 'Two clicks for more privacy: The Google+ button will be enabled once you click here. Activating the button already sends data to Google &ndash; see <em>i</em>.',
		'txt_off'           : 'not connected to Google+',
		'txt_on'            : 'connected to Google+',
		'perma_option'      : true,
		'display_name'      : 'Google+',
		'referrer_track'    : '',
		'button'            : function (options, uri, settings) {
			// we use the Google+ "asynchronous" code, standard code is flaky if inserted into dom after load
			var $code = $('<div class="g-plusone"></div><script type="text/javascript">window.___gcfg = {lang: "' +
				options.language.replace('_','-') + '"}; (function() { var po = document.createElement("script"); ' +
				'po.type = "text/javascript"; po.async = true; po.src = "https://apis.google.com/js/plusone.js"; ' +
				'var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(po, s); })(); </script>');
			$code.filter('.g-plusone').attr({
				'data-href': uri + options.referrer_track,
				'data-size': settings.layout === 'line' ? 'medium' : 'tall'
			});
			return $code;
		}
	};
})(jQuery);
