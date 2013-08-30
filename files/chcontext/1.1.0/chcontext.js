/*!
 * CHContext v1.1.0
 * https://github.com/psnc-dl/chcontext
 *
 * Copyright 2013 Poznań Supercomputer and Networking Center
 *
 * Licensed under the EUPL, Version 1.1 or – as soon they
 * will be approved by the European Commission - subsequent
 * versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the
 * Licence.
 * You may obtain a copy of the Licence at:
 *
 *
 * http://ec.europa.eu/idabc/eupl
 *
 * Unless required by applicable law or agreed to in
 * writing, software distributed under the Licence is
 * distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the Licence for the specific language governing
 * permissions and limitations under the Licence.
 *
 * Date: 2013-08-30
 */
var PSNC = PSNC || {};
PSNC.chcontext = PSNC.chcontext || {};
PSNC.chcontext.pl = {
	"seeMore": "Więcej wyników",
	"poweredBy": "Dostarczone przez",
	"titleLabel": "Tytuł",
	"authorLabel": "Autor"
};
PSNC.chcontext.en = {
	"seeMore": "See more results",
	"poweredBy": "Powered by",
	"titleLabel": "Title",
	"authorLabel": "Author"
};
PSNC.chcontext.searchProviders = [
	{name:"Europeana", "requiresKey":true},
	{name:"DPLA", "requiresKey":true},
	{name:"FBC+", "requiresKey":false}
];




(function() {

	var jQuery;
	var defaultLocale = "en";
	var DEFAULT_RESULT_COUNT = 5;

	if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.10.2') {
		loadScript("http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js", function() {
			scriptLoadHandler();
		});

	} else {
		jQuery = window.jQuery;
		main();
	}

	function loadScript(url, callback) {
		var script = document.createElement('script');
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", url);
		if (script.readyState) {
			script.onreadystatechange = function() {
				if (this.readyState == 'complete' || this.readyState == 'loaded') {
					script.onreadystatechange = null;
					callback();
				}
			};
		} else {
			script.onload = function() {
				callback();
			};

		}
		(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script);
	}

	function scriptLoadHandler() {
		jQuery = window.jQuery.noConflict(true);
		main();
	}

	function getQuery($, container) {

		var queryStr = jQuery(container).data("query");
		var selector = jQuery(container).data("queryselector");
		var iframeselector = jQuery(container).data("iframe-selector");
		
		if (typeof selector === 'undefined' && typeof queryStr === 'undefined'){
			console.error('CHContext configuration error. data-query or data-queryselector must be configured. ');
			return null;
		}
		if (typeof iframeselector !== 'undefined' && typeof selector === 'undefined'){
			console.error('CHContext configuration error. data-selector is required when you want to use iframe selection. ');
			return null;
		}
		
		var query;
		var matchedElements;

		if (typeof iframeselector !== 'undefined') {
			matchedElements = jQuery(iframeselector).contents().find(selector);
		} else 
		if (typeof selector !== 'undefined') {
			matchedElements = jQuery(selector);
		}
		// there is query from selector
		if (typeof matchedElements !== 'undefined'){
			// prepare dynamic query from matched elements
			var dynamicQuery = prepareQuery(matchedElements);
			// moreover, there is static query 
			if (dynamicQuery && !!queryStr){
				// dynamic query will be inserted into static query
				if (queryStr.indexOf('$$') != -1){
					query = queryStr.replace('$$', dynamicQuery);
				// static query will be added to dynamic query
				} else {
					query = dynamicQuery + ' ' + queryStr;
				}
			} else {
				// use dynamic query
				query = dynamicQuery;
			}
		}
		// there is only fixed query
		else if (!!queryStr){
			query = queryStr;				
		}
		return query;
	}
	
	function prepareQuery(matchedElements) {
		var query = '';
		if (matchedElements.size() === 0){
			console.log('There is not elements maching given selector. ');
			return null;
		} else if (matchedElements.size() == 1){
			query = matchedElements.text();
		} else {
			query += '(';
			matchedElements.each(function(i){
				query += '(' + jQuery(this).text() + ')';
				if (i < matchedElements.size() - 1){
					query += ' OR ';
				}
				});
			query += ')';
		}
		return query;
	}

	function main() {
		jQuery(document).ready(function($) {
			// load css
			$('<style type="text/css">' + ".chcontext-widget-container {\
	overflow: auto;\
}\
\
.chcontext-widget-container ol {\
	list-style-type: decimal;\
}\
\
.chcontext-widget-container-poweredBy {\
	float: right;\
}\
\
.chcontext-widget-container-poweredBy img {\
	max-width: 100px;\
	max-height: 24px;	\
	float: right;\
	margin-top: 5px;\
	margin-bottom: 5px;\
	\
}\
\
.chcontext-widget-container-title-thumbnail {\
	margin-left: 55px;\
}\
\
/*.chcontext-widget-container-title {\
}*/\
\
.chcontext-widget-container-thumbnail-wrapper {\
	width: 50px;\
	float: left;\
	height: 100%;\
	text-align: center; \
}\
\
.chcontext-widget-container-thumbnail-wrapper img {\
	max-width: 100%;\
	max-height: 100%;\
}\
\
.chcontext-widget-container-more {\
	margin: 3px;\
	display: inline-block;\
}\
\
.chcontext-widget-container-more a {\
	text-decoration: underline;\
}\
\
.chcontext-widget-container-result-container {\
    position: relative;\
	display: inline-block;\
	vertical-align: top;\
}\
\
.chcontext-widget-container-tooltip-box {\
	position: fixed;\
	z-index:999;\
	max-width: 300px;\
	border-radius: 5px;\
	padding: 5px;\
	background: white;\
	border: 1px solid #718ba1;\
	margin: 0 auto;\
}\
\
.chcontext-widget-container-tooltip-box-left {\
	float: left;\
	text-align: center;\
	line-height: 50px; \
	overflow: hidden;\
}\
\
.chcontext-widget-container-tooltip-box-left img {\
	max-width: 100px;\
	max-height: 100px;\
	vertical-align: middle;\
	margin-right: 4px;\
	padding-right: 4px;\
}\
\
.chcontext-widget-container-tooltip-box-right {\
	min-height: 20px; \
	line-height: 20px; \
	overflow: hidden;\
}\
\
.chcontext-widget-container-tooltip-box-label {\
	font-weight: bold;\
}\
\
" + '</style>').appendTo("head");

			// iterate over all containers
			jQuery(".chcontext-widget-wrapper").each(function(i, container) {
				var children = $(container).children();
				var self = container;
				$(self).hide();
				var query = getQuery($, container);
				if (typeof query !== 'undefined' && query !== null) {

					//- pobrać wyniki wyszukiwania ze źródła 

					var dataHandler = function(data) {
						if (typeof data.numFound !== 'undefined' && data.numFound > 0) {
							var locale = jQuery(container).data("locale");
							var labels = prepareLabels($, locale);
							var showImg;
							if (jQuery(container).data("show-img") === false)
								showImg = false;
							else
								showImg = true; // images are displayed by default
							var widgetContainer = $(".chcontext-widget-container:first", container);
							var defineContainer = !($(widgetContainer)[0]);
							var result = prepareHTML($, data, labels, showImg,defineContainer);
							if(!defineContainer){
								widgetContainer.html(result);
							}
							else $(self).append(result);
							$(self).show();

							handleTooltips($, container, labels);
						} else {
							console.log("There is no result in obtained data from service");
						}
					};
					var service;

					var customSearchProvider = jQuery(container).data("customsearchprovider");
					if (typeof customSearchProvider !== 'undefined') {
						// create custom search provider specified and (hopefully) defined by user
						var customSearchProviderType = window[customSearchProvider];
						if (customSearchProviderType instanceof Function) {
							service = new customSearchProviderType(dataHandler);
						} else {
							console.error("Custom search provider not defined properly: " + customSearchProvider);
						}
					} else {
						// create our own search provider
						var searchProviderName = jQuery(container).data("searchprovider");
						var apiKey = jQuery(container).data("apikey");
						var serviceType = getSearchServiceByName(searchProviderName);
						if (serviceType instanceof Function) {
							service = new serviceType($, dataHandler, apiKey);
						} else {
							console.error("Search provider not existing: " + searchProviderName);
						}
					}

					var resultCount = jQuery(container).data("resultcount");
					if (typeof resultCount === 'undefined') {
						resultCount = DEFAULT_RESULT_COUNT;
					}

					if (service !== undefined) {
						service.search(query, resultCount);
					} else {
						console.log("Cannot create search provider service!");
					}
				}
			});
		});
	}

	// search providers services:
	var REQUEST_TIMEOUT = 5000;

	function getSearchServiceByName(searchProviderName) {
		if (searchProviderName.toUpperCase() === 'FBC+') {
			return FBCService;
		} else if (searchProviderName.toUpperCase() === 'DPLA') {
			return DPLAService;
		} else if (searchProviderName.toUpperCase() === 'EUROPEANA') {
			return EuropeanaService;
		}
	}

	function ajaxErrorHandler(jqXHR, textStatus, errorThrown) {
		console.error("cannot get results from service because of " + textStatus + "; " + errorThrown);
	}

	var FBCService = function($, dataHandler) {
		// uri to api endpoint
		var serviceUrl = 'http://beta.fbc.pionier.net.pl/';
		var searchUrl = serviceUrl + 'index/select';
		var resourceUrl = serviceUrl + 'details/';
		var thumbnailUrl = serviceUrl + 'thumbnails/';
		var searchResultUrl = serviceUrl + 'search/query?q=';

		var dataProvider = {
			link: serviceUrl,
			img: "data:image/png;base64,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",
			name: "FBC+"
		};

		var mapData = function(rawData) {
			var result = {};
			result.resultsLink = searchResultUrl + encodeURIComponent(rawData.responseHeader.params.q);
			result.numFound = rawData.response.numFound;
			result.dataProvider = dataProvider;
			result.results = $.map(rawData.response.docs, function(doc, i) {
				var title = doc.dc_title;
				if (title !== undefined && title instanceof Array) {
					title = title[0];
				}
				var author = doc.dc_creator;
				if (author !== undefined && author instanceof Array) {
					author = author[0];
				}
				return {
					link: resourceUrl + doc.id,
					imgLink: thumbnailUrl + doc.id,
					title: title,
					author: author};
			});
			dataHandler(result);
		};

		this.search = function(searchString, maxNumberOfElements) {
			$.ajax({
				url: searchUrl + '?q=' + encodeURIComponent(searchString) + '&rows=' + maxNumberOfElements + '&fl=dc_title%2Cdcterms_alternative%2Cdc_creator%2Cdc_contributor%2Cid&wt=json&json.wrf=?',
				timeout: REQUEST_TIMEOUT,
				dataType: 'json',
				data: {},
				error: ajaxErrorHandler,
				success: mapData
			});
		};
	};

	var EuropeanaService = function($, dataHandler, apiKey) {
		// uri to api endpoint
		var serviceUrl = 'http://europeana.eu/';
		var searchUrl = serviceUrl + 'api/v2/search.json';
		var searchResultUrl = serviceUrl + 'portal/brief-doc.html?query=';
		var dataProvider = {
			link: serviceUrl,
			img: "data:image/png;base64,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",
			name: "Europeana"
		};

		var mapData = function(rawData) {
			var result = {};
			result.dataProvider = dataProvider;
			result.resultsLink = searchResultUrl + encodeURIComponent(this.searchString);
			result.numFound = rawData.totalResults;
			result.results = $.map(rawData.items, function(doc, i) {
				var title = doc.title;
				if (title !== undefined && title instanceof Array) {
					title = title[0];
				}
				var author = doc.dcCreator;
				if (author !== undefined && author instanceof Array) {
					author = author[0];
				}
				return {
					link: doc.guid,
					imgLink: doc.edmPreview,
					title: title,
					author: author};
			});
			dataHandler(result);
		};

		this.search = function(searchString, maxNumberOfElements) {
			$.ajax({
				url: searchUrl + '?query=' + encodeURIComponent(searchString) + '&rows=' + maxNumberOfElements + '&profile=minimal&wskey=' + apiKey + '&callback=?',
				timeout: REQUEST_TIMEOUT,
				searchString: searchString,
				dataType: 'json',
				data: {},
				error: ajaxErrorHandler,
				success: mapData
			});
		};
	};

	var DPLAService = function($, dataHandler, apiKey) {
		// uri to api endpoint
		var serviceUrl = 'http://dp.la/';
		var searchUrl = 'http://api.dp.la/v2/items';
		var resourceUrl = serviceUrl + 'item/';
		var searchResultUrl = serviceUrl + 'search?q=';

		var dataProvider = {
			link: serviceUrl,
			img: "data:image/png;base64,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",
			name: "DPLA"
		};

		var mapData = function(rawData) {
			var result = {};
			result.dataProvider = dataProvider;
			result.resultsLink = searchResultUrl + encodeURIComponent(this.searchString);
			result.numFound = rawData.count;
			result.results = $.map(rawData.docs, function(doc, i) {
				var title = doc['sourceResource.title'];
				if (title !== undefined && title instanceof Array) {
					title = title[0];
				}
				var author = doc['sourceResource.creator'];
				if (author !== undefined && author instanceof Array) {
					author = author[0];
				}
				var imgLink = doc.object;
				if (imgLink !== undefined && imgLink instanceof Array) {
					imgLink = imgLink[0];
				}
				return {
					link: resourceUrl + doc.id,
					imgLink: imgLink,
					title: title,
					author: author};
			});
			dataHandler(result);
		};

		this.search = function(searchString, maxNumberOfElements) {
			$.ajax({
				url: searchUrl + '?q=' + encodeURIComponent(searchString) + '&page_size=' + maxNumberOfElements + '&fields=object,sourceResource.title,sourceResource.creator,id,object&api_key=' + apiKey + '&callback=?',
				timeout: REQUEST_TIMEOUT,
				searchString: searchString,
				dataType: 'json',
				data: {},
				error: ajaxErrorHandler,
				success: mapData
			});
		};
	};

	function discoverLocale() {
		var loc = window.navigator.userLanguage || window.navigator.language;
		if (!!loc)
			return loc.split('-')[0];
	}

	var prepareLabels = function($, locale) {
		if (!locale) {
			locale = discoverLocale();
			if (!locale) {
				locale = defaultLocale;
			}
		}
		var defaultMap = PSNC.chcontext[defaultLocale];
		var localeMap = PSNC.chcontext[locale];
		var map = defaultMap;
		if (!!localeMap) {
			map = {};
			var fields = ["seeMore", "poweredBy", "titleLabel", "authorLabel"];
			$.each(fields, function(i, item) {
				map[item] = htmlEncode((!!localeMap[item]) ? localeMap[item] : defaultMap[item]);
			});
		}
		return map;
	};

	function handleTooltips($, container, labels) {

		var offset = 15;
		var tooltipWidth;
		var tooltipHeight;
		var showTooltip = function(e) {
			var tooltipBox = $("#chcontext-widget-container-tooltip-box");
			var border_top = $(window).height();
			var border_right = $(window).width();
			var windowLeft = $(window).scrollLeft();
			var windowTop = $(window).scrollTop();
			var left_pos = e.pageX - windowLeft + offset;
			var top_pos = e.pageY - windowTop + offset;
			if (border_right < tooltipWidth + left_pos) {
				left_pos = border_right - tooltipWidth;
			}
			if (border_top < top_pos + tooltipHeight) {
				top_pos = border_top - tooltipHeight;
			}

			tooltipBox.css({left: left_pos, top: top_pos});
		};
		$(".chcontext-widget-container-result-container", container).hover(function(e) {
			var img = $("img", this);
			var title = $(this).find("#title-value").html();
			var author = $(this).find("#author-value").html();
			var error = img.data("img-error");
			var code = "";

			code += '<div id="chcontext-widget-container-tooltip-box" class="chcontext-widget-container-tooltip-box">';
			if (!error) {
				code += '<div class="chcontext-widget-container-tooltip-box-left"><img src="' + img.attr("src") + '" alt="' + img.attr("src") + '"/></div>';
			}

			if (!!title || !!author) {
				code += '<div class="chcontext-widget-container-tooltip-box-right">';
				if (!!title) {
					code += '<div>';
					code += (!!labels.titleLabel) ? ('<span class="chcontext-widget-container-tooltip-box-label">' + labels.titleLabel + ': </span>') : '';
					code += title;
					code += '</div>';
				}
				if (!!author) {
					code += '<div>';
					code += (!!labels.authorLabel) ? ('<span class="chcontext-widget-container-tooltip-box-label">' + labels.authorLabel + ': </span>') : '';
					code += author;
					code += '</div>';
				}
				code += '</div>';
			}
			code += '</div>';
			$(container).append(code);
			var tooltipBox = $("#chcontext-widget-container-tooltip-box");
			tooltipWidth = tooltipBox.width();
			tooltipHeight = tooltipBox.height();

		}, function() {
			$("#chcontext-widget-container-tooltip-box").remove();
		});
		$(".chcontext-widget-container-result-container", container).mousemove(showTooltip);

		$('.chcontext-widget-container-result-container img').error(function() {
			$(this).attr("data-img-error", "true");
		});
	}

	function prepareHTML($, data, labels, showImg, defaineContainer) {
		var seeMore = labels.seeMore;
		var poweredBy = labels.poweredBy;

		var errorImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAvdJREFUeNq0V9GLTFEY/75z74qo5T+wXtSGhJBENEQrZhYRtbQpRZuEhOyueZAHeZE3SfIitU1bmwc8yIOSByUPXqx3D5T1sDP3nOP77jl3utPMXPvdO3umrzP3zp1zfuf3/b7vfh9aa4EHIvbVpqd/amP6rTHg7vZmIJtSANbOHK1UynQZJfuGqeeWa637h8tlWKwxVasN0bSM7E9yLw1gSYLq++wPZqRnG/O6awZWg19/aTcAKdoxBuAwFAFigff050rWb1kw7PS3IFCgFBtCQCh4lg5jLGjamWdE0/W5jgDc6WlzAvH4zTcChCIe+KRaWzhXWkunN5nuzATAdvHgIAFhACghHjSdvB6Z5jpCACr+kyJ79OorhIECiSbZ55E2cH7/oAegFgrA5wTlUZONDa2HkGNY6IOIckmTAdUu884A/O9BogGyhzNfYgBiBgjAhQPrwGDKeXahLkgYoPnykY1eA0IRkgbmGxrQImSl1UwRsgYe1D6TBuQijCgKxg5t+G9CyxQhO+/q8GbHgMAHnPGaDGAX7hfKwP2pT3EUSAdHwaXDm/IxEKBTPQO4fmyrC0OhBhhAnRhQMQBpHvCpl9Hfe/nRaUDoAtbAlcoW78ocIkzmmye2exfIOEgYyCfChAE6+d0XH3K74NrxbS4MIS8D9Ll9eqerZoQIuKqar0f5GFA+e/FruPr8PfQFgRhAQ2u4cXIHBAYzy7vuYegZmBjZDYDyMCQKoJGXAZeIeN8A7jx75zUgzYQGbp3aRRqAnKnY637izN6cZRllw0bkgIvDMD6xjefJp29jDUjfhqyB8ZE94BSA0kzo3mAsxsmzpQI1qYE4gPOUZP4LjD95DWGo5JmQipHqaKlZ2IgBWM9ldXRfIQZAVBP6B7kkj5uIos0JcmlvWxhtyzktF0q1u6FoX5haJ71+Rwbo0Tnq31aYdDvTGxQuuyLOtf2U6o5X0jRAtqpgP5b1jvpFNkv2u7lvuj3nDpmbVFi8USf7S9ZI9v0nwABB+xJ9xtGl5QAAAABJRU5ErkJggg==";
		var html = "";

		html += defaineContainer? '<div class="chcontext-widget-container">':'';
		if (!!data.results && data.results.length > 0) {
			html += '<ol>';
			$.each(data.results, function(key, value) {

				html += '<li>';
				html += '<div class="chcontext-widget-container-result-container">';

				var titleAndAuthor = '';
				if (!!value.title)
					titleAndAuthor += value.title;
				if (!!value.author) {
					if (!!value.title)
						titleAndAuthor += ' - ';
					titleAndAuthor += value.author;
				}

				

				if (showImg) {
					html += '<div class="chcontext-widget-container-thumbnail-wrapper">';
					html += '<a href="' + value.link + '" target="_blank" >';
					html += '<img onerror="this.src=\'' + errorImg + '\';" src="' + htmlEncode(value.imgLink) + '" ></img>';
					html += '</a></div>';
					html += '<div class="chcontext-widget-container-title-thumbnail">';
				} else {
					html += '<img style="display:none" onerror="this.src=\'' + errorImg + '\';" src="' + htmlEncode(value.imgLink) + '"></img>';
					html += '<div class="chcontext-widget-container-title">';
				}
				html += '<a href="' + value.link + '" target="_blank" >';
				html += htmlEncode(titleAndAuthor);
				html += '</div>';
				html += '</a>';

				if (!!value.title)
					html += '<div id="title-value" style="display:none">' + htmlEncode(value.title) + '</div>';
				if (!!value.author)
					html += '<div id="author-value" style="display:none">' + htmlEncode(value.author) + '</div>';
				html += '</div>';
				html += '</li>';

			});
			html += '</ol>';
		}

		html += '<div class="chcontext-widget-container-more"><a href="' + htmlEncode(data.resultsLink) + '" target="_blank" alt="' + seeMore + '" title="' + seeMore + '">' + seeMore + ' (' + data.numFound + ')</a></div>';

		if (!!data.dataProvider) {
			html += '<div class="chcontext-widget-container-poweredBy">';

			if (!!data.dataProvider.link)
				html += '<a href="' + htmlEncode(data.dataProvider.link) + '" target="_blank">';

			if (!!data.dataProvider.img) {
				var poweredByTitle = poweredBy + ((!!data.dataProvider.name) ? (': ' + htmlEncode(data.dataProvider.name)) : (''));
				html += '<img src="' + htmlEncode(data.dataProvider.img) + '" title="' + poweredByTitle + '"/>';
			}
			if (!!data.dataProvider.link)
				html += '</a>';
			html += '</div>';
		}
		html += defaineContainer? '</div>':'';
		return html;
	}
	
	/**
	 * Escapes special chars from value so that it can be inserted into html.
	 * @param {String} value
	 * @returns escaped value
	 */
	function htmlEncode(value) {
		return String(value)
				.replace(/&/g, '&amp;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#39;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');
	}

})();
