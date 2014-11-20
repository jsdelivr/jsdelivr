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

	$.fn.socialSharePrivacy.settings.services.twitter = {
		'status'            : true,
		'button_class'      : 'tweet',
		'dummy_line_img'    : 'images/dummy_twitter.png',
		'dummy_box_img'     : 'images/dummy_box_twitter.png',
		'dummy_alt'         : '"Tweet this"-Dummy',
		'txt_info'          : 'Two clicks for more privacy: The Tweet this button will be enabled once you click here. Activating the button already sends data to Twitter &ndash; see <em>i</em>.',
		'txt_off'           : 'not connected to Twitter',
		'txt_on'            : 'connected to Twitter',
		'perma_option'      : true,
		'display_name'      : 'Twitter',
		'referrer_track'    : '',
		'via'               : '',
		'related'           : '',
		'hashtags'          : '',
		'dnt'               : true,
		'text'              : $.fn.socialSharePrivacy.getTitle,
		'button'            : function (options, uri, settings) {
			var text = typeof(options.text) === 'function' ?
				options.text.call(this, options, uri, settings) :
				String(options.text);
			// 120 is the max character count left after twitters automatic
			// url shortening with t.co
			text = $.fn.socialSharePrivacy.abbreviateText(text, 120);

			var params = {
				url     : uri + options.referrer_track,
				counturl: uri,
				text    : text,
				count   : settings.layout === 'line' ? 'horizontal' : 'vertical',
				lang    : options.language
			};
			if (options.via)      params.via      = options.via;
			if (options.related)  params.related  = options.related;
			if (options.hashtags) params.hashtags = options.hashtags;
			if (options.dnt)      params.dnt      = options.dnt;

			return $('<iframe allowtransparency="true" frameborder="0" scrolling="no"></iframe>').attr(
				'src', 'https://platform.twitter.com/widgets/tweet_button.html?' +
				$.param(params).replace(/\+/g,'%20'));
		}
	};
})(jQuery);
