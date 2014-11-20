/*
 * jquery.socialshareprivacy.js | 2 Klicks fuer mehr Datenschutz
 *
 * Copyright (c) 2012 Mathias Panzenböck
 *
 * is released under the MIT License http://www.opensource.org/licenses/mit-license.php
 *
 * Spread the word, link to us if you can.
 */
(function ($, undefined) {
	"use strict";

	$.extend($.fn.socialSharePrivacy.settings, {
		// Set perma_option to true.
		// Initially it is only set to true if jQuery.cookie is available.
		perma_option: true,
		set_perma_option: function (service_name) {
			localStorage.setItem('socialSharePrivacy_'+service_name, 'perma_on');
		},
		del_perma_option: function (service_name) {
			localStorage.removeItem('socialSharePrivacy_'+service_name);
		},
		// Only one of the two methods "get_perma_options" and "get_perma_option" has
		// to be implemented. Though the other has to be set to null, so the default
		// cookie based method is not used.
		get_perma_options: null,
		get_perma_option: function (service_name) {
			return localStorage.getItem('socialSharePrivacy_'+service_name) === 'perma_on';
		}
	});
})(jQuery);
