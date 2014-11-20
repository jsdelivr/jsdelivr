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

	function get (self, options, uri, settings, name) {
		var value = options[name];
		if (typeof value === "function") {
			return value.call(self, options, uri, settings);
		}
		return String(value);
	}

	$.fn.socialSharePrivacy.settings.services.buffer = {
		'status'            : true,
		'dummy_line_img'    : 'images/dummy_buffer.png',
		'dummy_box_img'     : 'images/dummy_box_buffer.png',
		'dummy_alt'         : '"Buffer"-Dummy',
		'txt_info'          : 'Two clicks for more privacy: The Buffer button will be enabled once you click here. Activating the button already sends data to Buffer &ndash; see <em>i</em>.',
		'txt_off'           : 'not connected to Buffer',
		'txt_on'            : 'connected to Buffer',
		'perma_option'      : true,
		'display_name'      : 'Buffer',
		'referrer_track'    : '',
		'via'               : '',
		'text'              : $.fn.socialSharePrivacy.getTitle,
		'picture'           : $.fn.socialSharePrivacy.getImage,
		'button'            : function (options, uri, settings) {
			return $('<iframe allowtransparency="true" frameborder="0" scrolling="no"></iframe>').attr(
				'src', 'https://widgets.bufferapp.com/button/?'+$.param({
					count   : settings.layout === 'line' ? 'horizontal' : 'vertical',
					via     : get(this, options, uri, settings, 'via'),
					text    : $.fn.socialSharePrivacy.abbreviateText(
						get(this, options, uri, settings, 'text'), 120),
					picture : get(this, options, uri, settings, 'picture'),
					url     : uri + options.referrer_track,
					source  : 'button'
				}));
		}
	};
})(jQuery);
