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

	var locales = {"af":["ZA"],"ar":["AR"],"az":["AZ"],"be":["BY"],"bg":["BG"],"bn":["IN"],"bs":["BA"],"ca":["ES"],"cs":["CZ"],"cy":["GB"],"da":["DK"],"de":["DE"],"el":["GR"],"en":["GB","PI","UD","US"],"eo":["EO"],"es":["ES","LA"],"et":["EE"],"eu":["ES"],"fa":["IR"],"fb":["LT"],"fi":["FI"],"fo":["FO"],"fr":["CA","FR"],"fy":["NL"],"ga":["IE"],"gl":["ES"],"he":["IL"],"hi":["IN"],"hr":["HR"],"hu":["HU"],"hy":["AM"],"id":["ID"],"is":["IS"],"it":["IT"],"ja":["JP"],"ka":["GE"],"km":["KH"],"ko":["KR"],"ku":["TR"],"la":["VA"],"lt":["LT"],"lv":["LV"],"mk":["MK"],"ml":["IN"],"ms":["MY"],"nb":["NO"],"ne":["NP"],"nl":["NL"],"nn":["NO"],"pa":["IN"],"pl":["PL"],"ps":["AF"],"pt":["BR","PT"],"ro":["RO"],"ru":["RU"],"sk":["SK"],"sl":["SI"],"sq":["AL"],"sr":["RS"],"sv":["SE"],"sw":["KE"],"ta":["IN"],"te":["IN"],"th":["TH"],"tl":["PH"],"tr":["TR"],"uk":["UA"],"vi":["VN"],"zh":["CN","HK","TW"]};

	$.fn.socialSharePrivacy.settings.services.facebook = {
		'status'            : true,
		'button_class'      : 'fb_like',
		'dummy_line_img'    : 'images/dummy_facebook.png',
		'dummy_box_img'     : 'images/dummy_box_facebook.png',
		'dummy_alt'         : 'Facebook "Like"-Dummy',
		'txt_info'          : 'Two clicks for more privacy: The Facebook Like button will be enabled once you click here. Activating the button already sends data to Facebook &ndash; see <em>i</em>.',
		'txt_off'           : 'not connected to Facebook',
		'txt_on'            : 'connected to Facebook',
		'perma_option'      : true,
		'display_name'      : 'Facebook Like/Recommend',
		'referrer_track'    : '',
		'action'            : 'like',
		'colorscheme'       : 'light',
		'font'              : '',
		'button'            : function (options, uri, settings) {
			// ensure a locale that is supported by facebook
			// otherwise facebook renders nothing
			var match = /^([a-z]{2})_([A-Z]{2})$/.exec(options.language);
			var locale = "en_US";

			if (match) {
				if (match[1] in locales) {
					var subs = locales[match[1]];
					if ($.inArray(match[2], subs) !== -1) {
						locale = options.language;
					}
					else {
						locale = match[1]+"_"+subs[0];
					}
				}
			}
			else if (options.language in locales) {
				locale = options.language+"_"+locales[options.language][0];
			}

			var params = {
				locale     : locale,
				href       : uri + options.referrer_track,
				send       : 'false',
				show_faces : 'false',
				action     : options.action,
				colorscheme: options.colorscheme
			};
			if (options.font) params.font = options.font;

			if (settings.layout === 'line') {
				params.width  = '120';
				params.height = '20';
				params.layout = 'button_count';
			}
			else {
				params.width  = '62';
				params.height = '61';
				params.layout = 'box_count';
			}
			return $('<iframe scrolling="no" frameborder="0" allowtransparency="true"></iframe>').attr(
				'src', 'https://www.facebook.com/plugins/like.php?'+$.param(params));
		}
	};
})(jQuery);
