/**
 * @file oembed.js
 * @brief javascript code for oembed addon
 * @author NAVER (developers@xpressengine.com)
 */
(function($){
	var protocol_re = '(https?|ftp|news|telnet|irc|mms)://';
	var domain_re   = '(?:[\\w\\-]+\\.)+(?:[a-z]+)';
	var max_255_re  = '(?:1[0-9]{2}|2[0-4][0-9]|25[0-5]|[1-9]?[0-9])';
	var ip_re       = '(?:'+max_255_re+'\\.){3}'+max_255_re;
	var port_re     = '(?::([0-9]+))?';
	var user_re     = '(?:/~[\\w-]+)?';
	var path_re     = '((?:/[\\w!"$-/:-@]+)*)';
	var hash_re     = '(?:#([\\w!-@]+))?';

	var url_regex = new RegExp('('+protocol_re+'('+domain_re+'|'+ip_re+'|localhost'+')'+port_re+user_re+path_re+hash_re+')', 'ig');

	var OEmbed = xe.createPlugin("OEmbed", {
		targets : [],
		init : function() {
			this.targets = [];
			this.enableAutoLink = false;
			this.castedOembedA = false;
			this.embedSetting = [];
			// this.embedSetting.embedMethod = 'replace';
		},
		API_ONREADY : function() {
			var thisPlugin = this;

			// extract target text nodes
			this.extractTargets($('.xe_content'));

			if(this.oApp.getPlugin('autolink').length)
			{
				this.enableAutoLink = true;
			}
			thisPlugin.cast('OEMBEDA');

			if(!this.enableAutoLink)
			{
				$(this.targets).each(function(){
					thisPlugin.cast('OEMBED', [this]);
				});
			}
		},
		API_BEFORE_AUTOLINK : function(oSender, params) {
			var thisPlugin = this;
			thisPlugin.cast('OEMBEDA');
		},
		API_AFTER_AUTOLINK : function(oSender, params) {
			this.oembed(params[0]);
		},
		API_OEMBED : function(oSender, params) {
			if(this.enableAutoLink) return;
			var thisPlugin = this;

			var textNode = params[0];
			if(!$(textNode).parent().length || $(textNode).parent().get(0).nodeName.toLowerCase() == 'a')
			{
				this.oembed($(textNode));
				return;
			}
			var content  = textNode.nodeValue;
			var dummy    = $('<span>');

			content = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
			content = content.replace(url_regex, '<a href="$1" target="_blank">$1</a>');

			$(textNode).before(dummy);
			$(textNode).replaceWith(content);
			params[0] = dummy.next('a');
			dummy.remove();

			this.oembed(params[0]);
		},
		API_OEMBEDA : function(oSender, params) {
			if(this.castedOembedA) return;
			var thisPlugin = this;

			this.castedOembedA = true;

			$('.read_body a').not('_oembed').each(function(){
				thisPlugin.oembed($(this));
			});
		},
		oembed : function(target) {
			var thisPlugin = this;

			if(!this.embedSetting.maxWidth)
			{
				this.embedSetting.maxWidth = $('.xe_content').width();
			}

			if(!target) return;
			if(target && target.nodeType == 3) target = $(target);

			target.oembed(null, thisPlugin.embedSetting).addClass('_oembed');
		},
		extractTargets : function(obj) {
			var thisPlugin = this;
			var wrap = $('.xe_content', obj);
			if(wrap.length) {
				this.extractTargets(wrap);
				return;
			}

			$(obj)
			.contents()
			.each(function(){
				var node_name = this.nodeName.toLowerCase();
				if($.inArray(node_name, ['a', 'pre', 'xml', 'textarea', 'input', 'select', 'option', 'code', 'script', 'style', 'iframe', 'button', 'img', 'embed', 'object', 'ins']) != -1) return;

				// FIX ME : When this meanless code wasn't executed, url_regex do not run correctly. why?
				url_regex.exec('');

				if(this.nodeType == 3) { // text node
					var content = this.nodeValue;

					if(content.length < 5) return;

					if(!/(http|https|ftp|news|telnet|irc|mms):\/\//i.test(content)) return;

					thisPlugin.targets.push(this);
				} else {
					thisPlugin.extractTargets(this);
				}
			});
		}
	});

	xe.registerPlugin(new OEmbed());
})(jQuery);