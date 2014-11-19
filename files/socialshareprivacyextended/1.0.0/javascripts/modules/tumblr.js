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

	function getQuote (options, uri, settings) {
		var text = $.trim($('article, p').text());
		
		if (text.length <= 600) {
			return text;
		}

		var abbrev = text.slice(0, 597);
		if (/^\w+$/.test(text.slice(596,598))) {
			var match = /^(.*)\s\S*$/.exec(abbrev);
			if (match) {
				abbrev = match[1];
			}
		}
		return $.trim(abbrev) + "\u2026";
	}

	function getClickthru (options, uri) {
		return uri + options.referrer_track;
	}

	function get (self, options, uri, settings, name) {
		var value = options[name];
		if (typeof value === "function") {
			return value.call(self, options, uri, settings);
		}
		return String(value);
	}

	function openTumblr (event) {
		var winx = window.screenX || window.screenLeft;
		var winy = window.screenY || window.screenTop;
		var winw = window.outerWidth || window.innerWidth;
		var winh = window.outerHeight || window.innerHeight;
		var width = 450;
		var height = 430;
		var x = Math.round(winx + (winw - width)  * 0.5);
		var y = Math.round(winy + (winh - height) * 0.5);
		window.open(this.href, 't', 'left='+x+',top='+y+',toolbar=0,resizable=0,status=0,menubar=0,width='+width+',height='+height);
		event.preventDefault();
	}

	$.fn.socialSharePrivacy.settings.services.tumblr = {
		'status'            : true,
		'privacy'           : 'safe',
		'button_class'      : 'tumblr',
		'line_img'          : 'images/tumblr.png',
		'box_img'           : 'images/box_tumblr.png',
		'txt_info'          : 'Post this on Tumblr.',
		'txt_button'        : 'Share on Tubmlr',
		'display_name'      : 'Tumblr',
		'referrer_track'    : '',
		'type'              : 'link', // possible values are 'link', 'quote', 'photo' or 'video'
		// type: 'link':
		'name'              : $.fn.socialSharePrivacy.getTitle,
		'description'       : $.fn.socialSharePrivacy.getDescription,
		// type: 'quote':
		'quote'             : getQuote,
		// type: 'photo':
		'photo'             : $.fn.socialSharePrivacy.getImage,
		'clickthrou'        : getClickthru,
		// type: 'video':
		'embed'             : $.fn.socialSharePrivacy.getEmbed,
		// type: 'photo' or 'video':
		'caption'           : $.fn.socialSharePrivacy.getDescription,
		'button'            : function (options, uri, settings) {
			var $code = $('<a target="_blank"/>').click(openTumblr);
			$('<img>', {
				alt: options.txt_button,
				src: options.path_prefix + (settings.layout === 'line' ? options.line_img : options.box_img)
			}).appendTo($code);
			switch (options.type) {
				case 'link':
					return $code.attr('href', 'https://www.tumblr.com/share/link?'+$.param({
						url         : uri + options.referrer_track,
						name        : get(this, options, uri, settings, 'name'),
						description : get(this, options, uri, settings, 'description')
					}));

				case 'quote':
					return $code.attr('href', 'https://www.tumblr.com/share/quote?'+$.param({
						source      : uri + options.referrer_track,
						quote       : get(this, options, uri, settings, 'quote')
					}));

				case 'photo':
					return $code.attr('href', 'https://www.tumblr.com/share/photo?'+$.param({
						source      : get(this, options, uri, settings, 'photo'),
						caption     : get(this, options, uri, settings, 'caption'),
						clickthrou  : get(this, options, uri, settings, 'clickthrou')
					}));

				case 'video':
					return $code.attr('href', 'https://www.tumblr.com/share/video?'+$.param({
						embed       : get(this, options, uri, settings, 'embed'),
						caption     : get(this, options, uri, settings, 'caption')
					}));
			}
		}
	};
})(jQuery);
