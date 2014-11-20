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

	$.fn.socialSharePrivacy.settings.services.hackernews = {
		'status'            : true,
		'dummy_line_img'    : 'images/dummy_hackernews.png',
		'dummy_box_img'     : 'images/dummy_box_hackernews.png',
		'dummy_alt'         : '"Hacker News"-Dummy',
		'txt_info'          : 'Two clicks for more privacy: The Hacker News button will be enabled once you click here. Activating the button already sends data to Hacker News &ndash; see <em>i</em>.',
		'txt_off'           : 'not connected to Hacker News',
		'txt_on'            : 'connected to Hacker News',
		'perma_option'      : true,
		'display_name'      : 'Hacker News',
		'txt_n_points'      : '{points} points',
		'txt_one_point'     : '1 point',
		'referrer_track'    : '',
		'title'             : $.fn.socialSharePrivacy.getTitle,
		'button'            : function (options, uri, settings) {
			var url = uri + options.referrer_track;
			var title = typeof(options.title) === 'function' ?
				options.title.call(this, options, uri, settings) :
				String(options.title);

			var $code;
			if (settings.layout === 'line') {
				$code = $('<div class="hackernews-widget">'+
					'<a class="name" target="_blank">Y</a>'+
					'<span class="points"><i></i><u></u><a target="_blank">submit</a></span></div>');
			}
			else {
				$code = $('<div class="hackernews-widget">'+
					'<div class="points"><i></i><u></u><a target="_blank">submit</a></div>'+
					'<a class="name" target="_blank">Y</a></div>');
			}

			$code.find("a").attr("href", "https://news.ycombinator.com/submitlink?"+$.param({
				"u": url,
				"t": title
			}));

			$.ajax("https://api.thriftdb.com/api.hnsearch.com/items/_search?filter[fields][url][]="+encodeURIComponent(url), {
				dataType: "jsonp",
				success: function (data) {
					var item = data.results[0];
					if (item) {
						item = item.item;
						var points = $.fn.socialSharePrivacy.formatNumber(item.points);
						$code.find("a").attr("href", "https://news.ycombinator.com/item?id="+item.id);
						$code.find(".points a").text(points).attr('title',
							item.points === 1 ?
							options.txt_one_point :
							options.txt_n_points.replace(/{points}/g, points));
					}
				}
			});

			return $code;
		}
	};
})(jQuery);
