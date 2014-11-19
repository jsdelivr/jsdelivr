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
 * Warning: this button uses plaintext http and can be harmful to users under opressive regimes
 *
 */

(function ($, undefined) {
	"use strict";

	$.fn.socialSharePrivacy.settings.services.stumbleupon = {
		'status'            : true, 
		'button_class'      : 'stumbleupon',
		'dummy_line_img'    : 'images/dummy_stumbleupon.png',
		'dummy_box_img'     : 'images/dummy_box_stumbleupon.png',
		'dummy_alt'         : '"Stumble!"-Dummy',
		'txt_info'          : 'Two clicks for more privacy: The Stumble! button will be enabled once you click here. Activating the button already sends data to StumbleUpon &ndash; see <em>i</em>.',
		'txt_off'           : 'not connected to StumbleUpon',
		'txt_on'            : 'connected to StumbleUpon',
		'perma_option'      : true,
		'display_name'      : 'Stumble Upon',
		'referrer_track'    : '',
		'button'            : function (options, uri, settings) {
			var base_url = 'https:' === document.location.protocol ? 'https://' : 'http://';
			var w, h;

			if (settings.layout === 'line') {
				w = '74';
				h = '18';
				base_url += 'badge.stumbleupon.com/badge/embed/1/?';
			}
			else {
				w = '50';
				h = '60';
				base_url += 'badge.stumbleupon.com/badge/embed/5/?';
			}

			return $('<iframe allowtransparency="true" frameborder="0" scrolling="no"></iframe>').attr({
				src:    base_url+$.param({url: uri + options.referrer_track}),
				width:  w,
				height: h
			});
		}
	};
})(jQuery);
