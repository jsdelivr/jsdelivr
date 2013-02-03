/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
* Uses jquery-oEmbed
* Made by Thomas Lété for Aloha Editor
*/
define(
['aloha', 'aloha/jquery', 'aloha/contenthandlermanager'],
function(Aloha, jQuery, ContentHandlerManager) {
	

	var
		GENTICS = window.GENTICS,
		escape = window.escape,
		providers, getOEmbedProvider, getNormalizedParams, OEmbedProvider;


	/* Private Methods */
	getOEmbedProvider = function(url) {
		for (var i = 0; i < providers.length; i++) {
			if (providers[i].matches(url))
				return providers[i];
		}
		return null;
	};
	
	getNormalizedParams = function (params) {
		var normalizedParams = {}, key;
		if (params == null)
			return null;
		for ( key in params) {
			if (key != null)
				normalizedParams[key.toLowerCase()] = params[key];
		}
		return normalizedParams;
	};

	OEmbedProvider = function(name, urlPattern, oEmbedUrl, callbackparameter) {
		this.name = name;
		this.urlPattern = urlPattern;
		this.oEmbedUrl = (oEmbedUrl != null) ? oEmbedUrl : "http://oohembed.com/oohembed/";
		this.callbackparameter = (callbackparameter != null) ? callbackparameter : "callback";
		this.maxWidth = 500;
		this.maxHeight = 400;

		this.matches = function(externalUrl) {
			// TODO: Convert to Regex
			return externalUrl.indexOf(this.urlPattern) >= 0;
		};

		this.getRequestUrl = function(externalUrl) {

			var url = this.oEmbedUrl, qs = "", i;

			if (url.indexOf("?") <= 0)
				url = url + "?";
			else
				url = url + "&";

			if (this.maxWidth != null && this.params.maxwidth == null)
				this.params.maxwidth = this.maxWidth;				
				
			if (this.maxHeight != null && this.params.maxheight == null)
				this.params.maxheight = this.maxHeight;

			for ( i in this.params) {
				// We don't want them to jack everything up by changing the callback parameter
				if (i == this.callbackparameter)
				  continue;
				
				// allows the options to be set to null, don't send null values to the server as parameters
				if (this.params[i] != null)
					qs += "&" + escape(i) + "=" + this.params[i];
			}		   
			
				
			url += "format=json&url=" + escape(externalUrl) +		   
					qs + 
					"&" + this.callbackparameter + "=?";
					
			return url;
		};

		this.embedCode = function(container, externalUrl, callback) {

			var request = this.getRequestUrl(externalUrl);

			jQuery.getJSON(request, function(data) {

				var oembed = data,
                    code, type = data.type;

				switch (type) {
					case "photo":
						oembed.code = jQuery.fn.oembed.getPhotoCode(externalUrl, data);
						break;
					case "video":
						oembed.code = jQuery.fn.oembed.getVideoCode(externalUrl, data);
						break;
					case "rich":
						oembed.code = jQuery.fn.oembed.getRichCode(externalUrl, data);
						break;
					default:
						oembed.code = jQuery.fn.oembed.getGenericCode(externalUrl, data);
						break;
				}

				callback(container, oembed);
			});
		};
	};

    providers = [
        new OEmbedProvider("fivemin", "5min.com"),
        new OEmbedProvider("amazon", "amazon.com"),
        new OEmbedProvider("flickr", "flickr", "http://flickr.com/services/oembed", "jsoncallback"),    
        new OEmbedProvider("googlevideo", "video.google."),
        new OEmbedProvider("hulu", "hulu.com"),
        new OEmbedProvider("imdb", "imdb.com"),
        new OEmbedProvider("metacafe", "metacafe.com"),
        new OEmbedProvider("qik", "qik.com"),
        new OEmbedProvider("revision3", "revision3.com"),
        new OEmbedProvider("slideshare", "slideshare.net"),
        new OEmbedProvider("twitpic", "twitpic.com"),
        new OEmbedProvider("viddler", "viddler.com"),
        new OEmbedProvider("vimeo", "vimeo.com", "http://vimeo.com/api/oembed.json"),
        new OEmbedProvider("wikipedia", "wikipedia.org"),
        new OEmbedProvider("wordpress", "wordpress.com"),
        new OEmbedProvider("youtube", "youtube.com"),
        new OEmbedProvider("vids.myspace.com", "vids.myspace.com", "http://vids.myspace.com/index.cfm?fuseaction=oembed"),
        new OEmbedProvider("screenr", "screenr.com", "http://screenr.com/api/oembed.json")
    ];


	jQuery.fn.oembed = function(url, options, callback) {

		options = jQuery.extend(true, jQuery.fn.oembed.defaults, options);

		return this.each(function() {

			var container = jQuery(this),
				resourceURL = (url != null) ? url : container.attr("href"),
				provider;

			if (!callback) callback = function(container, oembed) {			
				 jQuery.fn.oembed.insertCode(container, options.embedMethod, oembed);
			};

			if (resourceURL != null) {
				provider = getOEmbedProvider(resourceURL);

				if (provider != null) {						
					provider.params = getNormalizedParams(options[provider.name]) || {};
					provider.maxWidth = options.maxWidth;
					provider.maxHeight = options.maxHeight;										
					provider.embedCode(container, resourceURL, callback);
					return;
				}
			}

			callback(container, null);
		});
	};

	// Plugin defaults
	jQuery.fn.oembed.defaults = {
		maxWidth: null,
		maxHeight: null,
		embedMethod: "fill" // "auto", "append", "fill"
	};
	
	jQuery.fn.oembed.insertCode = function(container, embedMethod, oembed) {
		if (oembed == null)
			return;
		switch(embedMethod)
		{
			case "auto":				
				if (container.attr("href") != null) {
					jQuery.fn.oembed.insertCode(container, "append", oembed);
				}
				else {
					jQuery.fn.oembed.insertCode(container, "replace", oembed);
				}
				break;
			case "replace":	
				container.replaceWith(oembed.code);
				break;
			case "fill":
				container.html(oembed.code);
				break;
			case "append":
				var oembedContainer = container.next();
				if (oembedContainer == null || !oembedContainer.hasClass("oembed-container")) {
					oembedContainer = container
						.after('<div class="oembed-container"></div>')
						.next(".oembed-container");
					if (oembed != null && oembed.provider_name != null)
						oembedContainer.toggleClass("oembed-container-" + oembed.provider_name);		
				}
				oembedContainer.html(oembed.code);				
				break;			
		}
	};

	jQuery.fn.oembed.getPhotoCode = function(url, data) {
		var alt = data.title ? data.title : '',
            code;
		alt += data.author_name ? ' - ' + data.author_name : '';
		alt += data.provider_name ? ' - ' +data.provider_name : '';
		code = '<div><a href="' + url + '" target="_blank"><img src="' + data.url + '" alt="' + alt + '"/></a></div>';
		if (data.html)
			code += "<div>" + data.html + "</div>";
		return code;
	};

	jQuery.fn.oembed.getVideoCode = function(url, data) {
		var code = data.html;
		return code;
	};

	jQuery.fn.oembed.getRichCode = function(url, data) {
		var code = data.html;
		return code;
	};

	jQuery.fn.oembed.getGenericCode = function(url, data) {
		var title = (data.title != null) ? data.title : url,
			code = '<a href="' + url + '">' + title + '</a>';
		if (data.html)
			code += "<div>" + data.html + "</div>";
		return code;
	};

	jQuery.fn.oembed.isAvailable = function(url) {
		var provider = getOEmbedProvider(url);
		return (provider != null);
	};

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
				content = jQuery( '<div>' + content + '</div>' );
			} else if ( content instanceof jQuery ) {
				content = jQuery( '<div>' ).append(content);
			}

			this.replaceoEmbedContent( content );

			return content.html();
		},

		/**
		 * Check whether the content of the given jQuery object is assumed to be pasted from word.
		 * @param content
		 * @return true for content pasted from word, false for other content
		 */
		replaceoEmbedContent: function( content ) {
			// check every element which was pasted.
			content.contents().each(function() {
				var container = jQuery(this);
				container.oembed( container.text() );
			});
		}
	});
	
	return OEmbedContentHandler;
});
