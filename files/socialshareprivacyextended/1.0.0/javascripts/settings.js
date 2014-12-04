/**
 * @license
 * jquery.socialshareprivacy.js | 2 Klicks fuer mehr Datenschutz
 *
 * Copyright (c) 2012-2013 Mathias Panzenböck
 *
 * is released under the MIT License http://www.opensource.org/licenses/mit-license.php
 *
 * Spread the word, link to us if you can.
 */

// load global settings
jQuery(document).ready(function ($) {
	"use strict";

	$('script[type="application/x-social-share-privacy-settings"]').each(function () {
		var settings = (new Function('return ('+(this.textContent||this.innerText||this.text)+');')).call(this);

		if (typeof settings === "object") {
			$.extend(true, $.fn.socialSharePrivacy.settings, settings);
		}
	});
});
