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

	$.fn.socialSharePrivacy.settings.services.xing = {
		'status'            : true,
		'dummy_line_img'    : 'images/dummy_xing.png',
		'dummy_box_img'     : 'images/dummy_box_xing.png',
		'dummy_alt'         : '"XING"-Dummy',
		'txt_info'          : 'Two clicks for more privacy: The XING button will be enabled once you click here. Activating the button already sends data to XING &ndash; see <em>i</em>.',
		'txt_off'           : 'not connected to XING',
		'txt_on'            : 'connected to XING',
		'perma_option'      : true,
		'display_name'      : 'XING',
		'referrer_track'    : '',
		'button'            : function (options, uri, settings) {
			var $code = $('<script type="XING/Share"></script>').attr({
				'data-counter' : settings.layout === 'line' ? 'right' : 'top',
				'data-url'     : uri + options.referrer_track,
				'data-lang'    : options.language
			});

			return $code.add("<script type='text/javascript'>(function(d, s) { var x = d.createElement(s); s = d.getElementsByTagName(s)[0]; x.src = 'https://www.xing-share.com/js/external/share.js'; s.parentNode.insertBefore(x, s); })(document, 'script');</script>");
		}
	};
})(jQuery);
