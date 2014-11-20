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

	$.fn.socialSharePrivacy.settings.services.linkedin = {
		'status'            : true,
		'dummy_line_img'    : 'images/dummy_linkedin.png',
		'dummy_box_img'     : 'images/dummy_box_linkedin.png',
		'dummy_alt'         : '"LinkedIn"-Dummy',
		'txt_info'          : 'Two clicks for more privacy: The Linked in button will be enabled once you click here. Activating the button already sends data to Linked in &ndash; see <em>i</em>.',
		'txt_off'           : 'not connected to LinkedIn',
		'txt_on'            : 'connected to LinkedIn',
		'perma_option'      : true,
		'display_name'      : 'LinkedIn',
		'referrer_track'    : '',
		'onsuccess'         : null,
		'onerror'           : null,
		'showzero'          : false,
		'button'            : function (options, uri, settings) {
			var attrs = {
				'data-counter' : settings.layout === 'line' ? 'right' : 'top',
				'data-url'     : uri + options.referrer_track,
				'data-showzero': String(options.showzero)
			};
			if (options.onsuccess) attrs['data-onsuccess'] = options.onsuccess;
			if (options.onerror)   attrs['data-onerror']   = options.onerror;
			var $code = $('<script type="IN/Share"></script>').attr(attrs);

			if (window.IN && window.IN.parse) {
				$code = $code.add('<script type="text/javascript">IN.parse(document.body);</script>');
			}
			else if ($('script[src^="https://platform.linkedin.com/"]').length === 0) {
				$code = $code.add('<script type="text/javascript" src="https://platform.linkedin.com/in.js"></script>');
			}

			return $code;
		}
	};
})(jQuery);
