/*
	Name: autoComplete
	Authors:
		Andy Matthews: @commadelimited
		Raymond Camden: @cfjedimaster

	Website: http://andyMatthews.net
	Version: 1.5.1
*/
(function($) {

	"use strict";

	var defaults = {
		method: 'GET',
		icon: 'arrow-r',
		cancelRequests: false,
		target: $(),
		source: null,
		callback: null,
		link: null,
		minLength: 0,
		transition: 'fade',
		matchFromStart: true,
		labelHTML: function(value) { return value; },
		onNoResults: function() { return; },
		onLoading: function() { return; },
		onLoadingFinished: function() { return; },
		termParam : 'term',
		loadingHtml : '<li data-icon="none"><a href="#">Searching...</a></li>',
		interval : 0,
		builder : null
	},
	openXHR = {},
	buildItems = function($this, data, settings) {
		var str;
		if (settings.builder) {
			str = settings.builder.apply($this.eq(0), [data, settings]);
		} else {
			str = [];
			if (data) {
				$.each(data, function(index, value) {
					// are we working with objects or strings?
					if ($.isPlainObject(value)) {
						str.push('<li data-icon=' + settings.icon + '><a href="' + settings.link + encodeURIComponent(value.value) + '" data-transition="' + settings.transition + '" data-autocomplete=\'' + JSON.stringify(value) + '\'>' + settings.labelHTML(value.label) + '</a></li>');
					} else {
						str.push('<li data-icon=' + settings.icon + '><a href="' + settings.link + encodeURIComponent(value) + '" data-transition="' + settings.transition + '">' + settings.labelHTML(value) + '</a></li>');
					}
				});
			}
		}
		if ($.isArray(str)) {
			str = str.join('');
		}
		$(settings.target).html(str).listview("refresh");

		// is there a callback?
		if (settings.callback !== null && $.isFunction(settings.callback)) {
			attachCallback(settings);
		}

		if (str.length > 0) {
			$this.trigger("targetUpdated.autocomplete");
		} else {
			$this.trigger("targetCleared.autocomplete");

			if (settings.onNoResults) {
				settings.onNoResults();
			}
		}
	},
	attachCallback = function(settings) {
		$('li a', $(settings.target)).bind('click.autocomplete',function(e){
			e.stopPropagation();
			e.preventDefault();
			settings.callback(e);
		});
	},
	clearTarget = function($this, $target) {
		$target.html('').listview('refresh').closest("fieldset").removeClass("ui-search-active");
		$this.trigger("targetCleared.autocomplete");
	},
	handleInput = function(e) {
		var $this = $(this),
			id = $this.attr("id"),
			text,
			data,
			settings = $this.jqmData("autocomplete"),
			element_text,
			re;

		// Fix For IE8 and earlier versions.
		if (!Date.now) {
			Date.now = function() {
				return new Date().valueOf();
			};
		}

		if (e) {
			if (e.keyCode === 38) { // up
				$('.ui-btn-active', $(settings.target))
					.removeClass('ui-btn-active').prevAll('li.ui-btn:eq(0)')
					.addClass('ui-btn-active').length ||
						$('.ui-btn:last', $(settings.target)).addClass('ui-btn-active');
			} else if (e.keyCode === 40) {
				$('.ui-btn-active', $(settings.target))
					.removeClass('ui-btn-active').nextAll('li.ui-btn:eq(0)')
					.addClass('ui-btn-active').length ||
						$('.ui-btn:first', $(settings.target)).addClass('ui-btn-active');
			} else if (e.keyCode === 13) {
				$('.ui-btn-active a', $(settings.target)).click().length  || $('.ui-btn:first a', $(settings.target)).click();
			}
		}

		if (settings) {
			// get the current text of the input field
			text = $this.val();
			// check if it's the same as the last one
			if (settings._lastText === text) {
				return;
			}
			// reset the timeout...
			if (settings._retryTimeout) {
				window.clearTimeout(settings._retryTimeout);
				settings._retryTimeout = null;
			}
			// dont change the result the user is browsing...
			if (e && (e.keyCode === 13 || e.keyCode === 38 || e.keyCode === 40)) {
				return;
			}
			// if we don't have enough text zero out the target
			if (text.length < settings.minLength) {
				clearTarget($this, $(settings.target));
			} else {
				if (settings.interval && Date.now() - settings._lastRequest < settings.interval) {
					settings._retryTimeout = window.setTimeout($.proxy(handleInput, this), settings.interval - Date.now() + settings._lastRequest );
					return;
				}
				settings._lastRequest = Date.now();
				// store last text
				settings._lastText = text;

				// are we looking at a source array or remote data?
				if ($.isArray(settings.source)) {
					data = settings.source.sort().filter(function(element) {
						// matching from start, or anywhere in the string?
						if (settings.matchFromStart) {
							// from start
							element_text, re = new RegExp('^' + text, 'i');
						} else {
							// anywhere
							element_text, re = new RegExp(text, 'i');
						}
						if ($.isPlainObject(element)) {
							element_text = element.label;
						} else {
							element_text = element;
						}
						return re.test(element_text);
					});
					buildItems($this, data, settings);
				}
				// Accept a function as source.
				// Function needs to call the callback, which is the first parameter.
				// source:function(text,callback) { mydata = [1,2]; callback(mydata); }
				else if (typeof settings.source === 'function') {
					settings.source(text,function(data){
						buildItems($this, data, settings);
					});
				} else {
					var ajax = {
						type: settings.method,
						data: {},
						dataType: 'json',
						beforeSend: function(jqXHR) {
							if (settings.cancelRequests) {
								if (openXHR[id]) {
									// If we have an open XML HTTP Request for this autoComplete ID, abort it
									openXHR[id].abort();
								} else {
								}
								// Set this request to the open XML HTTP Request list for this ID
								openXHR[id] = jqXHR;
							}

							if (settings.onLoading && settings.onLoadingFinished) {
								settings.onLoading();
							}

							if (settings.loadingHtml) {
								// Set a loading indicator as a temporary stop-gap to the response time issue
								$(settings.target).html(settings.loadingHtml).listview('refresh');
								$(settings.target).closest("fieldset").addClass("ui-search-active");
							}
						},
						success: function(data) {
							buildItems($this, data, settings);
						},
						complete: function () {
							// Clear this ID's open XML HTTP Request from the list
							if (settings.cancelRequests) {
								openXHR[id] = null;
							}
							if (settings.onLoadingFinished) {
								settings.onLoadingFinished();
							}
						}
					};

					if ($.isPlainObject(settings.source)) {
						if (settings.source.callback) {
							settings.source.callback(text, ajax);
						}
						for (var k in settings.source) {
							if (k !== 'callback') {
								ajax[k] = settings.source[k];
							}
						}
					} else {
						ajax.url = settings.source;
					}
					if (settings.termParam) {
						ajax.data[settings.termParam] = text;
					}
					$.ajax(ajax);
				}
			}
		}
	},
	methods = {
		init: function(options) {
			var el = this;
			el.jqmData("autocomplete", $.extend({}, defaults, options));
			var settings = el.jqmData("autocomplete");
			return el.unbind("keyup.autocomplete")
						.bind("keyup.autocomplete", handleInput)
						.next('.ui-input-clear')
						.bind('click', function(){
							clearTarget(el, $(settings.target));
						});
		},
		// Allow dynamic update of source and link
		update: function(options) {
			var settings = this.jqmData("autocomplete");
			if (settings) {
				this.jqmData("autocomplete", $.extend(settings, options));
			}
			return this;
		},
		// Method to forcibly clear our target
		clear: function() {
			var settings = this.jqmData("autocomplete");
			if (settings) {
				clearTarget(this, $(settings.target));
			}
			return this;
		},
		// Method to destroy (cleanup) plugin
		destroy: function() {
			var settings = this.jqmData("autocomplete");
			if (settings) {
				clearTarget(this, $(settings.target));
				this.jqmRemoveData("autocomplete");
				this.unbind(".autocomplete");
			}
			return this;
		}
	};

	$.fn.autocomplete = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		}
	};

})(jQuery);
