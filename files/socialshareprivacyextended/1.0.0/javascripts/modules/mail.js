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

	function get (self, options, uri, settings, name) {
		var value = options[name];
		if (typeof value === "function") {
			value = value.call(self, options, uri, settings);
		}
		return String(value);
	}

	var getDescription = $.fn.socialSharePrivacy.getDescription;

	function getBody (options, uri, settings) {
		return getDescription.call(this, options, uri, settings) + '\n\n' + uri + options.referrer_track;
	}

	$.fn.socialSharePrivacy.settings.services.mail = {
		'status'            : true,
		'privacy'           : 'safe',
		'button_class'      : 'mail',
		'line_img'          : 'images/mail.png',
		'box_img'           : 'images/box_mail.png',
		'txt_info'          : 'Send this via email to a friend.',
		'txt_button'        : 'Send Email',
		'display_name'      : 'Mail',
		'referrer_track'    : '',
		'subject'           : $.fn.socialSharePrivacy.getTitle,
		'body'              : getBody,
		'button'            : function (options, uri, settings) {
			return $('<a/>').attr(
				'href', 'mailto:?'+$.param({
					subject : get(this, options, uri, settings, 'subject'),
					body    : get(this, options, uri, settings, 'body')
				}).replace(/\+/g,'%20')).append($('<img>', {
					alt: options.txt_button,
					src: options.path_prefix + (settings.layout === 'line' ? options.line_img : options.box_img)
				}));
		}
	};
})(jQuery);
