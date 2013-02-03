/* oembedcontenthandler.js is part of Aloha Editor project http://aloha-editor.org
 *
 * Aloha Editor is a WYSIWYG HTML5 inline editing library and editor. 
 * Copyright (c) 2010-2012 Gentics Software GmbH, Vienna, Austria.
 * Contributors http://aloha-editor.org/contribution.php 
 * 
 * Aloha Editor is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or any later version.
 *
 * Aloha Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 * 
 * As an additional permission to the GNU GPL version 2, you may distribute
 * non-source (e.g., minimized or compacted) forms of the Aloha-Editor
 * source code without the copy of the GNU GPL normally required,
 * provided you include this license notice and a URL through which
 * recipients can access the Corresponding Source.
 */
define(
['aloha', 'jquery', 'aloha/contenthandlermanager'],
function(Aloha, jQuery, ContentHandlerManager) {
	

	var
		GENTICS = window.GENTICS,
		escape = window.escape,
		providers, getOEmbedProvider, getNormalizedParams, OEmbedProvider;

	    jQuery.fn.oembed = function (url, options, embedAction) {

	        settings = jQuery.extend(true, jQuery.fn.oembed.defaults, options);

	        initializeProviders();

	        return this.each(function () {

	            var container = jQuery(this),
					resourceURL = (url != null) ? url : container.attr("href"),
					provider;

	            if (embedAction) {
	                settings.onEmbed = embedAction;
	            } else {
	                settings.onEmbed = function (oembedData) {
	                    jQuery.fn.oembed.insertCode(this, settings.embedMethod, oembedData);
	                    // return jQuery.fn.oembed.getInsertCode(this, settings.embedMethod, oembedData);
	                };
	            }

	            if (resourceURL != null) {
	                provider = jQuery.fn.oembed.getOEmbedProvider(resourceURL);

	                if (provider != null) {
	                    provider.params = getNormalizedParams(settings[provider.name]) || {};
	                    provider.maxWidth = settings.maxWidth;
	                    provider.maxHeight = settings.maxHeight;
	                    embedCode(container, resourceURL, provider);
	                } else {
	                    settings.onProviderNotFound.call(container, resourceURL);
	                }
	            }

	            return container;
	        });


	    };

	    var settings, activeProviders = [];

	    // Plugin defaults
	    jQuery.fn.oembed.defaults = {
	        maxWidth: null,
	        maxHeight: null,
	        embedMethod: "replace",  	// "auto", "append", "fill"		
	        defaultOEmbedProvider: "oohembed", 	// "oohembed", "embed.ly", "none"
	        allowedProviders: null,
	        disallowedProviders: null,
	        customProviders: null, // [ new jQuery.fn.oembed.OEmbedProvider("customprovider", null, ["customprovider\\.com/watch.+v=[\\w-]+&?"]) ]	
	        defaultProvider: null,
	        greedy: true,
	        onProviderNotFound: function () { },
	        beforeEmbed: function () { },
	        afterEmbed: function () { },
	        onEmbed: function () { },
			onError: function() {},
			ajaxOptions: {}
	    };
	
		jQuery.fn.oembed.embedCode = false;

	    /* Private functions */
	    function getRequestUrl(provider, externalUrl) {

	        var url = provider.apiendpoint, qs = "", callbackparameter = provider.callbackparameter || "callback", i;

	        if (url.indexOf("?") <= 0)
	            url = url + "?";
	        else
	            url = url + "&";

	        if (provider.maxWidth != null && provider.params["maxwidth"] == null)
	            provider.params["maxwidth"] = provider.maxWidth;

	        if (provider.maxHeight != null && provider.params["maxheight"] == null)
	            provider.params["maxheight"] = provider.maxHeight;

	        for (i in provider.params) {
	            // We don't want them to jack everything up by changing the callback parameter
	            if (i == provider.callbackparameter)
	                continue;

	            // allows the options to be set to null, don't send null values to the server as parameters
	            if (provider.params[i] != null)
	                qs += "&" + escape(i) + "=" + provider.params[i];
	        }

	        url += "format=json&url=" + escape(externalUrl) +
						qs +
						"&" + callbackparameter + "=?";

	        return url;
	    };

	    function embedCode(container, externalUrl, embedProvider) {

	        var requestUrl = getRequestUrl(embedProvider, externalUrl), 		
				ajaxopts = jQuery.extend({
					url: requestUrl,
					type: 'get',
					dataType: 'json',
					// error: jsonp request doesnt' support error handling
					success:  function (data) {
						var oembedData = jQuery.extend({}, data);
						switch (oembedData.type) {
							case "photo":
								oembedData.code = jQuery.fn.oembed.getPhotoCode(externalUrl, oembedData);
								break;
							case "video":
								oembedData.code = jQuery.fn.oembed.getVideoCode(externalUrl, oembedData);
								break;
							case "rich":
								oembedData.code = jQuery.fn.oembed.getRichCode(externalUrl, oembedData);
								break;
							default:
								oembedData.code = jQuery.fn.oembed.getGenericCode(externalUrl, oembedData);
								break;
						}
						settings.beforeEmbed.call(container, oembedData);
						settings.onEmbed.call(container, oembedData);
						settings.afterEmbed.call(container, oembedData);
					},
					error: settings.onError.call(container, externalUrl, embedProvider)
				}, settings.ajaxOptions || { } );

			jQuery.ajax( ajaxopts );        
	    };

	    function initializeProviders() {

	        activeProviders = [];

	        var defaultProvider, restrictedProviders = [], i, provider;

	        if (!isNullOrEmpty(settings.allowedProviders)) {
	            for (i = 0; i < jQuery.fn.oembed.providers.length; i++) {
	                if (jQuery.inArray(jQuery.fn.oembed.providers[i].name, settings.allowedProviders) >= 0)
	                    activeProviders.push(jQuery.fn.oembed.providers[i]);
	            }
	            // If there are allowed providers, jquery-oembed cannot be greedy
	            settings.greedy = false;

	        } else {
	            activeProviders = jQuery.fn.oembed.providers;
	        }

	        if (!isNullOrEmpty(settings.disallowedProviders)) {
	            for (i = 0; i < activeProviders.length; i++) {
	                if (jQuery.inArray(activeProviders[i].name, settings.disallowedProviders) < 0)
	                    restrictedProviders.push(activeProviders[i]);
	            }
	            activeProviders = restrictedProviders;
	            // If there are allowed providers, jquery-oembed cannot be greedy
	            settings.greedy = false;
	        }

	        if (!isNullOrEmpty(settings.customProviders)) {
	            jQuery.each(settings.customProviders, function (n, customProvider) {
	                if (customProvider instanceof jQuery.fn.oembed.OEmbedProvider) {
	                    activeProviders.push(provider);
	                } else {
	                    provider = new jQuery.fn.oembed.OEmbedProvider();
	                    if (provider.fromJSON(customProvider))
	                        activeProviders.push(provider);
	                }
	            });
	        }

	        // If in greedy mode, we add the default provider
	        defaultProvider = getDefaultOEmbedProvider(settings.defaultOEmbedProvider);
	        if (settings.greedy == true) {
	            activeProviders.push(defaultProvider);
			}
	        // If any provider has no apiendpoint, we use the default provider endpoint
	        for (i = 0; i < activeProviders.length; i++) {
	            if (activeProviders[i].apiendpoint == null)
	                activeProviders[i].apiendpoint = defaultProvider.apiendpoint;
	        }
	    }

	    function getDefaultOEmbedProvider(defaultOEmbedProvider) {
	        var url = "http://oohembed.com/oohembed/";
	        if (defaultOEmbedProvider == "embed.ly")
	            url = "http://api.embed.ly/v1/api/oembed?";
	        return new jQuery.fn.oembed.OEmbedProvider(defaultOEmbedProvider, null, null, url, "callback");
	    }

	    function getNormalizedParams(params) {
	        if (params == null)
	            return null;
	        var key, normalizedParams = {};
	        for (key in params) {
	            if (key != null)
	                normalizedParams[key.toLowerCase()] = params[key];
	        }
	        return normalizedParams;
	    }

	    function isNullOrEmpty(object) {
	        if (typeof object == "undefined")
	            return true;
	        if (object == null)
	            return true;
	        if (jQuery.isArray(object) && object.length == 0)
	            return true;
	        return false;
	    }

	    /* Public functions */
	    jQuery.fn.oembed.insertCode = function (container, embedMethod, oembedData) {
	        if (oembedData == null)
	            return;

			// little hack
			jQuery.fn.oembed.embedCode = oembedData.code;

	        switch (embedMethod) {
	            case "auto":
	                if (container.attr("href") != null) {
	                    jQuery.fn.oembed.insertCode(container, "append", oembedData);
	                }
	                else {
	                    jQuery.fn.oembed.insertCode(container, "replace", oembedData);
	                };
	                break;
	            case "replace":
	                container.replaceWith(oembedData.code);
	                break;
	            case "fill":
	                container.html(oembedData.code);
	                break;
	            case "append":
	                var oembedContainer = container.next();
	                if (oembedContainer == null || !oembedContainer.hasClass("oembed-container")) {
	                    oembedContainer = container
							.after('<div class="oembed-container"></div>')
							.next(".oembed-container");
	                    if (oembedData != null && oembedData.provider_name != null)
	                        oembedContainer.toggleClass("oembed-container-" + oembedData.provider_name);
	                }
	                oembedContainer.html(oembedData.code);
	                break;
	        }
	    };

	    jQuery.fn.oembed.getInsertCode = function (container, embedMethod, oembedData) {
	        if (oembedData == null)
	            return;

	        return oembedData.code;
	    };

	    jQuery.fn.oembed.getPhotoCode = function (url, oembedData) {
	        var code, alt = oembedData.title ? oembedData.title : '';
	        alt += oembedData.author_name ? ' - ' + oembedData.author_name : '';
	        alt += oembedData.provider_name ? ' - ' + oembedData.provider_name : '';
	        code = '<div><a href="' + url + '" target=\'_blank\'><img src="' + oembedData.url + '" alt="' + alt + '"/></a></div>';
	        if (oembedData.html)
	            code += "<div>" + oembedData.html + "</div>";
	        return code;
	    };

	    jQuery.fn.oembed.getVideoCode = function (url, oembedData) {
	        var code = oembedData.html;

	        return code;
	    };

	    jQuery.fn.oembed.getRichCode = function (url, oembedData) {
	        var code = oembedData.html;
	        return code;
	    };

	    jQuery.fn.oembed.getGenericCode = function (url, oembedData) {
	        var title = (oembedData.title != null) ? oembedData.title : url,
				code = '<a href="' + url + '">' + title + '</a>';
	        if (oembedData.html)
	            code += "<div>" + oembedData.html + "</div>";
	        return code;
	    };

	    jQuery.fn.oembed.isProviderAvailable = function (url) {
	        var provider = getOEmbedProvider(url);
	        return (provider != null);
	    };

	    jQuery.fn.oembed.getOEmbedProvider = function (url) {
	        for (var i = 0; i < activeProviders.length; i++) {
	            if (activeProviders[i].matches(url))
	                return activeProviders[i];
	        }
	        return null;
	    };

	    jQuery.fn.oembed.OEmbedProvider = function (name, type, urlschemesarray, apiendpoint, callbackparameter) {
	        this.name = name;
	        this.type = type; // "photo", "video", "link", "rich", null
	        this.urlschemes = getUrlSchemes(urlschemesarray);
	        this.apiendpoint = apiendpoint;
	        this.callbackparameter = callbackparameter;
	        this.maxWidth = 500;
	        this.maxHeight = 400;
	        var i, property, regExp;

	        this.matches = function (externalUrl) {
	            for (i = 0; i < this.urlschemes.length; i++) {
	                regExp = new RegExp(this.urlschemes[i], "i");
	                if (externalUrl.match(regExp) != null)
	                    return true;
	            }
	            return false;
	        };

	        this.fromJSON = function (json) {
	            for (property in json) {
	                if (property != "urlschemes")
	                    this[property] = json[property];
	                else
	                    this[property] = getUrlSchemes(json[property]);
	            }
	            return true;
	        };

	        function getUrlSchemes(urls) {
	            if (isNullOrEmpty(urls))
	                return ["."];
	            if (jQuery.isArray(urls))
	                return urls;
	            return urls.split(";");
	        }
	    };

	    /* Native & common providers */
	    jQuery.fn.oembed.providers = [
			new jQuery.fn.oembed.OEmbedProvider("youtube", "video", ["youtube\\.com/watch.+v=[\\w-]+&?"]), // "http://www.youtube.com/oembed"	(no jsonp)
			new jQuery.fn.oembed.OEmbedProvider("flickr", "photo", ["flickr\\.com/photos/[-.\\w@]+/\\d+/?"], "http://flickr.com/services/oembed", "jsoncallback"),
			new jQuery.fn.oembed.OEmbedProvider("viddler", "video", ["viddler\.com"]), // "http://lab.viddler.com/services/oembed/" (no jsonp)
			new jQuery.fn.oembed.OEmbedProvider("blip", "video", ["blip\\.tv/.+"], "http://blip.tv/oembed/"),
			new jQuery.fn.oembed.OEmbedProvider("hulu", "video", ["hulu\\.com/watch/.*"], "http://www.hulu.com/api/oembed.json"),
			new jQuery.fn.oembed.OEmbedProvider("vimeo", "video", ["http:\/\/www\.vimeo\.com\/groups\/.*\/videos\/.*", "http:\/\/www\.vimeo\.com\/.*", "http:\/\/vimeo\.com\/groups\/.*\/videos\/.*", "http:\/\/vimeo\.com\/.*"], "http://vimeo.com/api/oembed.json"),
			new jQuery.fn.oembed.OEmbedProvider("dailymotion", "video", ["dailymotion\\.com/.+"]), // "http://www.dailymotion.com/api/oembed/" (callback parameter does not return jsonp)
			new jQuery.fn.oembed.OEmbedProvider("scribd", "rich", ["scribd\\.com/.+"]), // ", "http://www.scribd.com/services/oembed"" (no jsonp)		
			new jQuery.fn.oembed.OEmbedProvider("slideshare", "rich", ["slideshare\.net"], "http://www.slideshare.net/api/oembed/1"),
			new jQuery.fn.oembed.OEmbedProvider("photobucket", "photo", ["photobucket\\.com/(albums|groups)/.*"], "http://photobucket.com/oembed/")
			// new jQuery.fn.oembed.OEmbedProvider("vids.myspace.com", "video", ["vids\.myspace\.com"]), // "http://vids.myspace.com/index.cfm?fuseaction=oembed" (not working)
			// new jQuery.fn.oembed.OEmbedProvider("screenr", "rich", ["screenr\.com"], "http://screenr.com/api/oembed.json") (error)		
			// new jQuery.fn.oembed.OEmbedProvider("qik", "video", ["qik\\.com/\\w+"], "http://qik.com/api/oembed.json"),		
			// new jQuery.fn.oembed.OEmbedProvider("revision3", "video", ["revision3\.com"], "http://revision3.com/api/oembed/")
		];

	/**
	 * Register the word paste handler
	 */
	var OEmbedContentHandler = ContentHandlerManager.createHandler({
		/**
		 * Handle the pasting. Try to detect content pasted from word and transform to clean html
		 * @param content
		 */
		handleContent: function( content ) {
			
			if ( typeof content === 'string' ){
				content = jQuery( '<div>' + content + '</div>' ).get(0);
			} else if ( content instanceof jQuery ) {
				content = jQuery( '<div>' ).append(content).get(0);
			}
			
			//console.log('content in ', content);
			//console.log('content url ', jQuery(content).text());
			content = jQuery( content ).oembed(jQuery(content).text(), {embedMethod: "replace"});
			//console.log('content embed ', content);
			
			var returnval = setTimeout(function() {
				content = jQuery.fn.oembed.embedCode;
				//console.log('content code ', content);
				return jQuery('<div>').append( content ).html();
			}, 500);
			//return returnval;
		},

		/*handleContent: function( content )  {
			if ( typeof sanitize === 'undefined' ) {
			   initSanitize();
			}

			if ( typeof content === 'string' ){
				content = jQuery( '<div>' + content + '</div>' ).get(0);
			} else if ( content instanceof jQuery ) {
				content = jQuery( '<div>' ).append(content).get(0);
			}

			return jQuery('<div>').append(sanitize.clean_node(content)).html();
		}*/

		/**
		 * Check whether the content of the given jQuery object is assumed to be pasted from word.
		 * @param content
		 * @return true for content pasted from word, false for other content
		 */
		replaceoEmbedContent: function( content ) {
			
			//console.log('container text ', jQuery(content).text());
			//return jQuery.fn.oembed.insertCode(content, options.embedMethod, oembed);
			//return jQuery(content).oembed( jQuery(content).text() );
			
			// check every element which was pasted.
			/*jQuery(content).each(function() {
				var container = jQuery(this);
				console.log('container ', container);
				
				container.oembed( container.text() );
			});*/
		}
		/*replaceoEmbedContent: function( content ) {
			// check every element which was pasted.
			content.contents().each(function() {
				var container = jQuery(this);
				container.oembed( container.text() );
			});
		}*/
	});
	
	return OEmbedContentHandler;
});
