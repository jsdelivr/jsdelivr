/*
 * jquery.atd.js - jQuery powered writing check with After the Deadline
 * Author      : Raphael Mudge, Automattic Inc.
 * License     : LGPL or MIT License (take your pick)
 * Project     :  http://www.afterthedeadline.com/development.slp
 * Contact     : raffi@automattic.com
 *
 * Derived from:
 *
 * jquery.spellchecker.js - a simple jQuery Spell Checker
 * Copyright (c) 2008 Richard Willis
 * MIT license  : http://www.opensource.org/licenses/mit-license.php
 * Project      : http://jquery-spellchecker.googlecode.com
 * Contact      : willis.rh@gmail.com
 */

var AtD =
{
	rpc : '', /* see the proxy.php that came with the AtD/TinyMCE plugin */
	rpc_css : 'http://www.polishmywriting.com/atd-jquery/server/proxycss.php?data=', /* you may use this, but be nice! */
	rpc_css_lang : 'en',
	api_key : '',
	i18n : {}, // Back-compat
	listener : {}
};

AtD.getLang = function( key, defaultk ) {
	return ( window.AtD_l10n_r0ar && window.AtD_l10n_r0ar[key] ) || defaultk;
};

AtD.addI18n = function( obj ) {
	// Back-compat
	window.AtD_l10n_r0ar = obj;
};

AtD.setIgnoreStrings = function(string) {
	AtD.core.setIgnoreStrings(string);
};

AtD.showTypes = function(string) {
	AtD.core.showTypes(string);
};

AtD.checkCrossAJAX = function(container_id, callback_f) {
	/* checks if a global var for click stats exists and increments it if it does... */
	if (typeof AtD_proofread_click_count != "undefined")
		AtD_proofread_click_count++;

	AtD.callback_f = callback_f; /* remember the callback for later */
	AtD.remove(container_id);
	var container = jQuery('#' + container_id);

	var html = container.html();
	text     = jQuery.trim(container.html());
	text     = text.replace(/\&lt;/g, '<').replace(/\&gt;/g, '>').replace(/\&amp;/g, '&');
	text     = encodeURIComponent( text.replace( /\%/g, '%25' ) ); /* % not being escaped here creates problems, I don't know why. */

	/* do some sanity checks based on the browser */
	if ((text.length > 2000 && navigator.appName == 'Microsoft Internet Explorer') || text.length > 7800) {
		if (callback_f != undefined && callback_f.error != undefined)
			callback_f.error("Maximum text length for this browser exceeded");

		return;
	}

	/* do some cross-domain AJAX action with CSSHttpRequest */
	CSSHttpRequest.get(AtD.rpc_css + text + "&lang=" + AtD.rpc_css_lang + "&nocache=" + (new Date().getTime()), function(response) {
		/* do some magic to convert the response into an XML document */
		var xml;
		if (navigator.appName == 'Microsoft Internet Explorer') {
			xml = new ActiveXObject("Microsoft.XMLDOM");
			xml.async = false;
			xml.loadXML(response);
		}
		else {
			xml = (new DOMParser()).parseFromString(response, 'text/xml');
		}

		/* check for and display error messages from the server */
		if (AtD.core.hasErrorMessage(xml)) {
			if (AtD.callback_f != undefined && AtD.callback_f.error != undefined)
				AtD.callback_f.error(AtD.core.getErrorMessage(xml));

			return;
		}

		/* highlight the errors */

		AtD.container = container_id;
		var count = AtD.processXML(container_id, xml);

		if (AtD.callback_f != undefined && AtD.callback_f.ready != undefined)
			AtD.callback_f.ready(count);

		if (count == 0 && AtD.callback_f != undefined && AtD.callback_f.success != undefined)
			AtD.callback_f.success(count);

		AtD.counter = count;
		AtD.count   = count;
	});
};

/* check a div for any incorrectly spelled words */
AtD.check = function(container_id, callback_f) {
	/* checks if a global var for click stats exists and increments it if it does... */
	if (typeof AtD_proofread_click_count != "undefined")
		AtD_proofread_click_count++;

	AtD.callback_f = callback_f; /* remember the callback for later */

	AtD.remove(container_id);

	var container = jQuery('#' + container_id);

	var html = container.html();
	text     = jQuery.trim(container.html());
	text     = text.replace(/\&lt;/g, '<').replace(/\&gt;/g, '>').replace(/\&amp;/g, '&');
	text     = encodeURIComponent( text ); /* re-escaping % is not necessary here. don't do it */

	jQuery.ajax({
		type : "POST",
		url : AtD.rpc + '/checkDocument',
		data : 'key=' + AtD.api_key + '&data=' + text,
		format : 'raw',
		dataType : (jQuery.browser.msie) ? "text" : "xml",

		error : function(XHR, status, error) {
			if (AtD.callback_f != undefined && AtD.callback_f.error != undefined)
 				AtD.callback_f.error(status + ": " + error);
		},

		success : function(data) {
			/* apparently IE likes to return XML as plain text-- work around from:
			   http://docs.jquery.com/Specifying_the_Data_Type_for_AJAX_Requests */

			var xml;
			if (typeof data == "string") {
				xml = new ActiveXObject("Microsoft.XMLDOM");
				xml.async = false;
				xml.loadXML(data);
			}
			else {
				xml = data;
			}

			if (AtD.core.hasErrorMessage(xml)) {
				if (AtD.callback_f != undefined && AtD.callback_f.error != undefined)
					AtD.callback_f.error(AtD.core.getErrorMessage(xml));

				return;
			}

			/* on with the task of processing and highlighting errors */

			AtD.container = container_id;
			var count = AtD.processXML(container_id, xml);

			if (AtD.callback_f != undefined && AtD.callback_f.ready != undefined)
				AtD.callback_f.ready(count);

			if (count == 0 && AtD.callback_f != undefined && AtD.callback_f.success != undefined)
				AtD.callback_f.success(count);

			AtD.counter = count;
			AtD.count   = count;
		}
	});
};

AtD.remove = function(container_id) {
	AtD._removeWords(container_id, null);
};

AtD.clickListener = function(event) {
	if (AtD.core.isMarkedNode(event.target))
		AtD.suggest(event.target);
};

AtD.processXML = function(container_id, responseXML) {

	var results = AtD.core.processXML(responseXML);

	if (results.count > 0)
		results.count = AtD.core.markMyWords(jQuery('#' + container_id).contents(), results.errors);

	jQuery('#' + container_id).unbind('click', AtD.clickListener);
	jQuery('#' + container_id).click(AtD.clickListener);

	return results.count;
};

AtD.useSuggestion = function(word) {
	this.core.applySuggestion(AtD.errorElement, word);

	AtD.counter --;
	if (AtD.counter == 0 && AtD.callback_f != undefined && AtD.callback_f.success != undefined)
		AtD.callback_f.success(AtD.count);
};

AtD.editSelection = function() {
	var parent = AtD.errorElement.parent();

	if (AtD.callback_f != undefined && AtD.callback_f.editSelection != undefined)
		AtD.callback_f.editSelection(AtD.errorElement);

	if (AtD.errorElement.parent() != parent) {
		AtD.counter --;
		if (AtD.counter == 0 && AtD.callback_f != undefined && AtD.callback_f.success != undefined)
			AtD.callback_f.success(AtD.count);
	}
};

AtD.ignoreSuggestion = function() {
	AtD.core.removeParent(AtD.errorElement);

	AtD.counter --;
	if (AtD.counter == 0 && AtD.callback_f != undefined && AtD.callback_f.success != undefined)
		AtD.callback_f.success(AtD.count);
};

AtD.ignoreAll = function(container_id) {
	var target = AtD.errorElement.text();
	var removed = AtD._removeWords(container_id, target);

	AtD.counter -= removed;

	if (AtD.counter == 0 && AtD.callback_f != undefined && AtD.callback_f.success != undefined)
		AtD.callback_f.success(AtD.count);

	if (AtD.callback_f != undefined && AtD.callback_f.ignore != undefined) {
		AtD.callback_f.ignore(target);
		AtD.core.setIgnoreStrings(target);
	}
};

AtD.explainError = function() {
	if (AtD.callback_f != undefined && AtD.callback_f.explain != undefined)
		AtD.callback_f.explain(AtD.explainURL);
};

AtD.suggest = function(element) {
	/* construct the menu if it doesn't already exist */

	if (jQuery('#suggestmenu').length == 0) {
		var suggest = jQuery('<div id="suggestmenu"></div>');
		suggest.prependTo('body');
	}
	else {
		var suggest = jQuery('#suggestmenu');
		suggest.hide();
	}

	/* find the correct suggestions object */

	errorDescription = AtD.core.findSuggestion(element);

	/* build up the menu y0 */

	AtD.errorElement = jQuery(element);

	suggest.empty();

	if (errorDescription == undefined) {
		suggest.append('<strong>' + AtD.getLang('menu_title_no_suggestions', 'No suggestions') + '</strong>');
	}
	else if (errorDescription["suggestions"].length == 0) {
		suggest.append('<strong>' + errorDescription['description'] + '</strong>');
	}
	else {
		suggest.append('<strong>' + errorDescription['description'] + '</strong>');

		for (var i = 0; i < errorDescription["suggestions"].length; i++) {
			(function(sugg) {
				suggest.append('<a href="javascript:AtD.useSuggestion(\'' + sugg.replace(/'/, '\\\'') + '\')">' + sugg + '</a>');
			})(errorDescription["suggestions"][i]);
		}
	}

	/* do the explain menu if configured */

	if (AtD.callback_f != undefined && AtD.callback_f.explain != undefined && errorDescription['moreinfo'] != undefined) {
		suggest.append('<a href="javascript:AtD.explainError()" class="spell_sep_top">' + AtD.getLang('menu_option_explain', 'Explain...') + '</a>');
		AtD.explainURL = errorDescription['moreinfo'];
	}

	/* do the ignore option */

	suggest.append('<a href="javascript:AtD.ignoreSuggestion()" class="spell_sep_top">' + AtD.getLang('menu_option_ignore_once', 'Ignore suggestion') + '</a>');

	/* add the edit in place and ignore always option */

	if (AtD.callback_f != undefined && AtD.callback_f.editSelection != undefined) {
		if (AtD.callback_f != undefined && AtD.callback_f.ignore != undefined)
			suggest.append('<a href="javascript:AtD.ignoreAll(\'' + AtD.container + '\')">' + AtD.getLang('menu_option_ignore_always', 'Ignore always') + '</a>');
		else
			suggest.append('<a href="javascript:AtD.ignoreAll(\'' + AtD.container + '\')">' + AtD.getLang('menu_option_ignore_all', 'Ignore all') + '</a>');

		suggest.append('<a href="javascript:AtD.editSelection(\'' + AtD.container + '\')" class="spell_sep_bottom spell_sep_top">' + AtD.getLang('menu_option_edit_selection', 'Edit Selection...') + '</a>');
	}
	else {
		if (AtD.callback_f != undefined && AtD.callback_f.ignore != undefined)
			suggest.append('<a href="javascript:AtD.ignoreAll(\'' + AtD.container + '\')" class="spell_sep_bottom">' + AtD.getLang('menu_option_ignore_always', 'Ignore always') + '</a>');
		else
			suggest.append('<a href="javascript:AtD.ignoreAll(\'' + AtD.container + '\')" class="spell_sep_bottom">' + AtD.getLang('menu_option_ignore_all', 'Ignore all') + '</a>');
	}

	/* show the menu */

	var pos = jQuery(element).offset();
	var width = jQuery(element).width();

        /* a sanity check for Internet Explorer--my favorite browser in every possible way */
        if (width > 100)
                width = 50;

	jQuery(suggest).css({ left: (pos.left + width) + 'px', top: pos.top + 'px' });

	jQuery(suggest).fadeIn(200);

	/* bind events to make the menu disappear when the user clicks outside of it */

	AtD.suggestShow = true;

	setTimeout(function() {
		jQuery("body").bind("click", function() {
			if (!AtD.suggestShow)
				jQuery('#suggestmenu').fadeOut(200);
		});
	}, 1);

	setTimeout(function() {
		AtD.suggestShow = false;
	}, 2);
};

AtD._removeWords = function(container_id, w) {
	return this.core.removeWords(jQuery('#' + container_id), w);
};

/*
 * Set prototypes used by AtD Core UI
 */
AtD.initCoreModule = function() {
	var core = new AtDCore();

	core.hasClass = function(node, className) {
		return jQuery(node).hasClass(className);
	};

	core.map = jQuery.map;

	core.contents = function(node) {
		return jQuery(node).contents();
	};

	core.replaceWith = function(old_node, new_node) {
		return jQuery(old_node).replaceWith(new_node);
	};

	core.findSpans = function(parent) {
        	return jQuery.makeArray(parent.find('span'));
	};

	core.create = function(string, isTextNode) {
		// replace out all tags with &-equivalents so that we preserve tag text.
		string = string.replace(/\&/g, '&amp;');
		string = string.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');

		// find all instances of AtD-created spans
		var matches = string.match(/\&lt;span class="hidden\w+?" pre="[^"]*"\&gt;.*?\&lt;\/span\&gt;/g);

		// ... and fix the tags in those substrings.
		if (matches) {
			for (var x = 0; x < matches.length; x++) {
				string = string.replace(matches[x], matches[x].replace(/\&lt;/gi, '<').replace(/\&gt;/gi, '>'));
			};
		}

		if (core.isIE()) {
			// and... one more round of corrections for our friends over at the Internet Explorer
			matches = string.match(/\&lt;span class="mceItemHidden"\&gt;\&amp;nbsp;\&lt;\/span&gt;/g, string);
			//|&lt;BR.*?class.*?atd_remove_me.*?\&gt;/gi, string);
			if (matches) {
				for (var x = 0; x < matches.length; x++) {
					string = string.replace(matches[x], matches[x].replace(/\&lt;/gi, '<').replace(/\&gt;/gi, '>').replace(/\&amp;/gi, '&'));
				};
			}
		}

		node = jQuery('<span class="mceItemHidden"></span>');
		node.html(string);
		return node;
	};

	core.remove = function(node) {
		return jQuery(node).remove();
	};

	core.removeParent = function(node) {
		/* unwrap exists in jQuery 1.4+ only. Thankfully because replaceWith as-used here won't work in 1.4 */
		if (jQuery(node).unwrap)
			return jQuery(node).contents().unwrap();
		else
			return jQuery(node).replaceWith(jQuery(node).html());
	};

	core.getAttrib = function(node, name) {
		return jQuery(node).attr(name);
	};

	return core;
};

AtD.core = AtD.initCoreModule();
