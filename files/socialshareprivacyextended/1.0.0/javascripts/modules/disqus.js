/*
 * jquery.socialshareprivacy.js
 *
 * Copyright (c) 2012 Mathias Panzenböck
 *
 * is released under the MIT License http://www.opensource.org/licenses/mit-license.php
 *
 */
(function ($, undefined) {
	"use strict";

	var DISQUSWIDGETS = {
		displayCount: function (data) {
			$('.social_share_privacy_area .disqus .disqus-widget:not(.init)').each(function () {
				var $widget = $(this);
				var uri = data.counts[0].id;
				if ($widget.attr("data-uri") === uri) {
					var key = $widget.attr("data-count");
					var count = data.counts[0][key];
					var text = data.text[key];
					var scount = $.fn.socialSharePrivacy.formatNumber(count);
					$widget.attr('title', count === 0 ? text.zero : count === 1 ? text.one : text.multiple.replace('{num}', scount));
					$widget.find('.count a').text(scount);
					$widget.addClass('init');
				}
			});
		}
	};

	$.fn.socialSharePrivacy.settings.services.disqus = {
		'status'            : true,
		'dummy_line_img'    : 'images/dummy_disqus.png',
		'dummy_box_img'     : 'images/dummy_box_disqus.png',
		'dummy_alt'         : '"Disqus"-Dummy',
		'txt_info'          : 'Two clicks for more privacy: The Disqus button will be enabled once you click here. Activating the button already sends data to Disqus &ndash; see <em>i</em>.',
		'txt_off'           : 'not connected to Disqus',
		'txt_on'            : 'connected to Disqus',
		'perma_option'      : true,
		'display_name'      : 'Disqus',
		'referrer_track'    : '',
		'shortname'         : '',
		'count'             : 'comments',
		'onclick'           : null,
		'button'            : function (options, uri, settings) {
			var shortname = options.shortname || window.disqus_shortname || '';
			var $code;
			if (settings.layout === 'line') {
				$code = $('<div class="disqus-widget">'+
					'<a href="#disqus_thread" class="name">Disq<span class="us">us</span></a>'+
					'<span class="count"><i></i><u></u><a href="#disqus_thread">&nbsp;</a></span></div>');
			}
			else {
				$code = $('<div class="disqus-widget">'+
					'<div class="count"><i></i><u></u><a href="#disqus_thread">&nbsp;</a></div>'+
					'<a href="#disqus_thread" class="name">Disq<span class="us">us</span></a></div>');
			}

			$code.attr({
				'data-count'     : options.count,
				'data-shortname' : shortname,
				'data-uri'       : uri + options.referrer_track
			});

			if (options.onclick) {
				$code.find('a').click(typeof options.onclick === "function" ?
					options.onclick : new Function("event", options.onclick));
			}

			// this breaks every other usage of the disqus count API:
			window.DISQUSWIDGETS = DISQUSWIDGETS;

			$.getScript('https://'+shortname+'.disqus.com/count-data.js?2='+encodeURIComponent(uri + options.referrer_track));

			return $code;
		}
	};
})(jQuery);
