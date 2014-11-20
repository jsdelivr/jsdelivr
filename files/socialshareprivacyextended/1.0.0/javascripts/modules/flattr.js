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
			return value.call(self, options, uri, settings);
		}
		return String(value);
	}

	// using an unsupported language breaks the flattr button
	var langs = {en:true,sq:true,ar:true,be:true,bg:true,ca:true,zh:true,hr:true,cs:true,da:true,nl:true,eo:true,et:true,fi:true,fr:true,es:true,de:true,el:true,iw:true,hi:true,hu:true,is:true,'in':true,ga:true,it:true,ja:true,ko:true,lv:true,lt:true,mk:true,ms:true,mt:true,no:true,nn:true,fa:true,pl:true,pt:true,ro:true,ru:true,sr:true,sk:true,sl:true,sv:true,th:true,tr:true,uk:true,vi:true};

	$.fn.socialSharePrivacy.settings.services.flattr = {
		'status'            : true, 
		'button_class'      : 'flattr',
		'dummy_line_img'    : 'images/dummy_flattr.png',
		'dummy_box_img'     : 'images/dummy_box_flattr.png',
		'dummy_alt'         : '"Flattr"-Dummy',
		'txt_info'          : 'Two clicks for more privacy: The Flattr button will be enabled once you click here. Activating the button already sends data to Flattr &ndash; see <em>i</em>.',
		'txt_off'           : 'not connected to Flattr',
		'txt_on'            : 'connected to Flattr',
		'perma_option'      : true,
		'display_name'      : 'Flattr',
		'referrer_track'    : '',
		'title'             : $.fn.socialSharePrivacy.getTitle,
		'description'       : $.fn.socialSharePrivacy.getDescription,
		'uid'               : '',
		'category'          : '',
		'tags'              : '',
		'popout'            : '',
		'hidden'            : '',
		'button'            : function (options, uri, settings) {
			var attrs = {
				href                   : uri + options.referrer_track,
				title                  : get(this, options, uri, settings, 'title')
			};
			if (options.uid)      attrs['data-flattr-uid']      = options.uid;
			if (options.hidden)   attrs['data-flattr-hidden']   = options.hidden;
			if (options.popout)   attrs['data-flattr-popout']   = options.popout;
			if (options.category) attrs['data-flattr-category'] = options.category;
			if (options.tags)     attrs['data-flattr-tags']     = options.tags;
			if (options.language) {
				var lang = String(options.language).replace('-','_');
				var baselang = lang.split('_')[0];
				if (langs[baselang] === true) {
					attrs['data-flattr-language'] = attrs.lang = lang;
				}
			}
			if (settings.layout === 'line') attrs['data-flattr-button'] = 'compact';

			var $code = $('<a class="FlattrButton">' + get(this, options, uri, settings, 'description') +
				'</a><script text="text/javscript" src="'+
				'https://api.flattr.com/js/0.6/load.js?mode=auto"></script>');

			$code.filter('a').attr(attrs);

			return $code;
		}
	};
})(jQuery);
