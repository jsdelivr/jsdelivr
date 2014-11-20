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

	var loadingScript = false;
	function loadScript () {
		// prevent already loaded buttons from being broken:
		$('.social_share_privacy_area .pinterest .pinit a[data-pin-log]').attr('data-pin-do','ignore');
		$.ajax({
			url      : 'https://assets.pinterest.com/js/pinit.js',
			dataType : 'script',
			cache    : true
		});
		// because there is no callback yet I have no choice but to do this now:
		loadingScript = false;
	}

	$.fn.socialSharePrivacy.settings.services.pinterest = {
		'status'            : true, 
		'button_class'      : 'pinit',
		'dummy_line_img'    : 'images/dummy_pinterest.png',
		'dummy_box_img'     : 'images/dummy_box_pinterest.png',
		'dummy_alt'         : '"Pin it"-Dummy',
		'txt_info'          : 'Two clicks for more privacy: The Pin it button will be enabled once you click here. Activating the button already sends data to Pinterest &ndash; see <em>i</em>.',
		'txt_off'           : 'not connected to Pinterest',
		'txt_on'            : 'connected to Pinterest',
		'perma_option'      : true,
		'display_name'      : 'Pinterest',
		'referrer_track'    : '',
		'title'             : $.fn.socialSharePrivacy.getTitle,
		'description'       : $.fn.socialSharePrivacy.getDescription,
		'media'             : $.fn.socialSharePrivacy.getImage,
		'button'            : function (options, uri, settings) {
			var params = {
				url    : uri + options.referrer_track,
				media  : get(this, options, uri, settings, 'media')
			};
			var title       = get(this, options, uri, settings, 'title');
			var description = get(this, options, uri, settings, 'description');
			if (title)       params.title       = title;
			if (description) params.description = description;

			var $code = $('<a data-pin-do="buttonPin"><img /></a>');

			$code.filter('a').attr({
				'data-pin-config' : settings.layout === 'line' ? 'beside' : 'above',
				href              : 'https://pinterest.com/pin/create/button/?'+$.param(params)
			}).find('img').attr('src', 'https://assets.pinterest.com/images/pidgets/pin_it_button.png');

			// This way when the user has permanently enabled pinterest and there are several pinterest
			// buttons on one webpage it will load the script only once and so the buttons will work:
			if (!loadingScript) {
				loadingScript = true;
				setTimeout(loadScript, 10);
			}

			return $code;
		}
	};
})(jQuery);
