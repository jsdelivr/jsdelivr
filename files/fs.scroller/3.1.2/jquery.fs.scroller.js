/* 
 * Scroller v3.1.2 - 2014-12-08 
 * A jQuery plugin for replacing default browser scrollbars. Part of the Formstone Library. 
 * http://formstone.it/scroller/ 
 * 
 * Copyright 2014 Ben Plum; MIT Licensed 
 */

;(function ($, window) {
	"use strict";

	var namespace = "scroller",
		$body = null,
		classes = {
			base: "scroller",
			content: "scroller-content",
			bar: "scroller-bar",
			track: "scroller-track",
			handle: "scroller-handle",
			isHorizontal: "scroller-horizontal",
			isSetup: "scroller-setup",
			isActive: "scroller-active"
		},
		events = {
			start: "touchstart." + namespace + " mousedown." + namespace,
			move: "touchmove." + namespace + " mousemove." + namespace,
			end: "touchend." + namespace + " mouseup." + namespace
		};

	/**
	 * @options
	 * @param customClass [string] <''> "Class applied to instance"
	 * @param duration [int] <0> "Scroll animation length"
	 * @param handleSize [int] <0> "Handle size; 0 to auto size"
	 * @param horizontal [boolean] <false> "Scroll horizontally"
	 * @param trackMargin [int] <0> "Margin between track and handle edge”
	 */
	var options = {
		customClass: "",
		duration: 0,
		handleSize: 0,
		horizontal: false,
		trackMargin: 0
	};

	var pub = {

		/**
		 * @method
		 * @name defaults
		 * @description Sets default plugin options
		 * @param opts [object] <{}> "Options object"
		 * @example $.scroller("defaults", opts);
		 */
		defaults: function(opts) {
			options = $.extend(options, opts || {});
			return (typeof this === 'object') ? $(this) : true;
		},

		/**
		 * @method
		 * @name destroy
		 * @description Removes instance of plugin
		 * @example $(".target").scroller("destroy");
		 */
		destroy: function() {
			return $(this).each(function(i, el) {
				var data = $(el).data(namespace);

				if (data) {
					data.$scroller.removeClass( [data.customClass, classes.base, classes.isActive].join(" ") );

					data.$bar.remove();
					data.$content.contents().unwrap();

					data.$content.off( classify(namespace) );
					data.$scroller.off( classify(namespace) )
								  .removeData(namespace);
				}
			});
		},

		/**
		 * @method
		 * @name scroll
		 * @description Scrolls instance of plugin to element or position
		 * @param pos [string || int] <null> "Target element selector or static position"
		 * @param duration [int] <null> "Optional scroll duration"
		 * @example $.scroller("scroll", pos, duration);
		 */
		scroll: function(pos, dur) {
			return $(this).each(function(i) {
				var data = $(this).data(namespace),
	                duration = dur || options.duration;

				if (typeof pos !== "number") {
					var $el = $(pos);
					if ($el.length > 0) {
						var offset = $el.position();
						if (data.horizontal) {
							pos = offset.left + data.$content.scrollLeft();
						} else {
							pos = offset.top + data.$content.scrollTop();
						}
					} else {
						pos = data.$content.scrollTop();
					}
				}

				var styles = data.horizontal ? { scrollLeft: pos } : { scrollTop: pos };

				data.$content.stop().animate(styles, duration);
			});
		},

		/**
		 * @method
		 * @name reset
		 * @description Resets layout on instance of plugin
		 * @example $.scroller("reset");
		 */
		reset: function()  {
			return $(this).each(function(i) {
				var data = $(this).data(namespace);

				if (data) {
					data.$scroller.addClass(classes.isSetup);

					var barStyles = {},
						trackStyles = {},
						handleStyles = {},
						handlePosition = 0,
						isActive = true;

					if (data.horizontal) {
						// Horizontal
						data.barHeight = data.$content[0].offsetHeight - data.$content[0].clientHeight;
						data.frameWidth = data.$content.outerWidth();
						data.trackWidth = data.frameWidth - (data.trackMargin * 2);
						data.scrollWidth = data.$content[0].scrollWidth;
						data.ratio = data.trackWidth / data.scrollWidth;
						data.trackRatio = data.trackWidth / data.scrollWidth;
						data.handleWidth = (data.handleSize > 0) ? data.handleSize : data.trackWidth * data.trackRatio;
						data.scrollRatio = (data.scrollWidth - data.frameWidth) / (data.trackWidth - data.handleWidth);
						data.handleBounds = {
							left: 0,
							right: data.trackWidth - data.handleWidth
						};

						data.$content.css({
							paddingBottom: data.barHeight + data.paddingBottom
						});

						var scrollLeft = data.$content.scrollLeft();

						handlePosition = scrollLeft * data.ratio;
						isActive = (data.scrollWidth <= data.frameWidth);

						barStyles = {
							width: data.frameWidth
						};

						trackStyles = {
							width: data.trackWidth,
							marginLeft: data.trackMargin,
							marginRight: data.trackMargin
						};

						handleStyles = {
							width: data.handleWidth
						};
					} else {
						// Vertical
						data.barWidth = data.$content[0].offsetWidth - data.$content[0].clientWidth;
						data.frameHeight = data.$content.outerHeight();
						data.trackHeight = data.frameHeight - (data.trackMargin * 2);
						data.scrollHeight = data.$content[0].scrollHeight;
						data.ratio = data.trackHeight / data.scrollHeight;
						data.trackRatio = data.trackHeight / data.scrollHeight;
						data.handleHeight = (data.handleSize > 0) ? data.handleSize : data.trackHeight * data.trackRatio;
						data.scrollRatio = (data.scrollHeight - data.frameHeight) / (data.trackHeight - data.handleHeight);
						data.handleBounds = {
							top: 0,
							bottom: data.trackHeight - data.handleHeight
						};

						var scrollTop = data.$content.scrollTop();

						handlePosition = scrollTop * data.ratio;
						isActive = (data.scrollHeight <= data.frameHeight);

						barStyles = {
							height: data.frameHeight
						};

						trackStyles = {
							height: data.trackHeight,
							marginBottom: data.trackMargin,
							marginTop: data.trackMargin
						};

						handleStyles = {
							height: data.handleHeight
						};
					}

					// Updates

					if (isActive) {
						data.$scroller.removeClass(classes.isActive);
					} else {
						data.$scroller.addClass(classes.isActive);
					}

					data.$bar.css(barStyles);
					data.$track.css(trackStyles);
					data.$handle.css(handleStyles);

					position(data, handlePosition);

					data.$scroller.removeClass(classes.isSetup);
				}
			});
		}
	};

	/**
	 * @method private
	 * @name init
	 * @description Initializes plugin
	 * @param opts [object] "Initialization options"
	 */
	function init(opts) {
		// Local options
		opts = $.extend({}, options, opts || {});

		// Check for Body
		if ($body === null) {
			$body = $("body");
		}

		// Apply to each element
		var $items = $(this);
		for (var i = 0, count = $items.length; i < count; i++) {
			build($items.eq(i), opts);
		}
		return $items;
	}

	/**
	 * @method private
	 * @name build
	 * @description Builds each instance
	 * @param $scroller [jQuery object] "Target jQuery object"
	 * @param opts [object] <{}> "Options object"
	 */
	function build($scroller, opts) {
		if (!$scroller.hasClass(classes.base)) {
			// EXTEND OPTIONS
			opts = $.extend({}, opts, $scroller.data(namespace + "-options"));

			var html = '';

			html += '<div class="' + classes.bar + '">';
			html += '<div class="' + classes.track + '">';
			html += '<div class="' + classes.handle + '">';
			html += '</div></div></div>';

			opts.paddingRight = parseInt($scroller.css("padding-right"), 10);
			opts.paddingBottom = parseInt($scroller.css("padding-bottom"), 10);

			$scroller.addClass( [classes.base, opts.customClass].join(" ") )
					 .wrapInner('<div class="' + classes.content + '" />')
					 .prepend(html);

			if (opts.horizontal) {
				$scroller.addClass(classes.isHorizontal);
			}

			var data = $.extend({
				$scroller: $scroller,
				$content: $scroller.find( classify(classes.content) ),
				$bar: $scroller.find( classify(classes.bar) ),
				$track: $scroller.find( classify(classes.track) ),
				$handle: $scroller.find( classify(classes.handle) )
			}, opts);

			data.trackMargin = parseInt(data.trackMargin, 10);

			data.$content.on("scroll." + namespace, data, onScroll);
			data.$scroller.on(events.start, classify(classes.track), data, onTrackDown)
						  .on(events.start, classify(classes.handle), data, onHandleDown)
						  .data(namespace, data);

			pub.reset.apply($scroller);

			$(window).one("load", function() {
				pub.reset.apply($scroller);
			});
		}
	}

	/**
	 * @method private
	 * @name onScroll
	 * @description Handles scroll event
	 * @param e [object] "Event data"
	 */
	function onScroll(e) {
		e.preventDefault();
		e.stopPropagation();

		var data = e.data,
			handleStyles = {};

		if (data.horizontal) {
			// Horizontal
			var scrollLeft = data.$content.scrollLeft();

			if (scrollLeft < 0) {
				scrollLeft = 0;
			}

			var handleLeft = scrollLeft / data.scrollRatio;

			if (handleLeft > data.handleBounds.right) {
				handleLeft = data.handleBounds.right;
			}

			handleStyles = {
				left: handleLeft
			};
		} else {
			// Vertical
			var scrollTop = data.$content.scrollTop();

			if (scrollTop < 0) {
				scrollTop = 0;
			}

			var handleTop = scrollTop / data.scrollRatio;

			if (handleTop > data.handleBounds.bottom) {
				handleTop = data.handleBounds.bottom;
			}

			handleStyles = {
				top: handleTop
			};
		}

		data.$handle.css(handleStyles);
	}

	/**
	 * @method private
	 * @name onTrackDown
	 * @description Handles mousedown event on track
	 * @param e [object] "Event data"
	 */
	function onTrackDown(e) {
		e.preventDefault();
		e.stopPropagation();

		var data = e.data,
			oe = e.originalEvent,
			offset = data.$track.offset(),
			touch = (typeof oe.targetTouches !== "undefined") ? oe.targetTouches[0] : null,
			pageX = (touch) ? touch.pageX : e.clientX,
			pageY = (touch) ? touch.pageY : e.clientY;

		if (data.horizontal) {
			// Horizontal
			data.mouseStart = pageX;
			data.handleLeft = pageX - offset.left - (data.handleWidth / 2);

			position(data, data.handleLeft);
		} else {
			// Vertical
			data.mouseStart = pageY;
			data.handleTop  = pageY - offset.top - (data.handleHeight / 2);

			position(data, data.handleTop);
		}

		onStart(data);
	}

	/**
	 * @method private
	 * @name onHandleDown
	 * @description Handles mousedown event on handle
	 * @param e [object] "Event data"
	 */
	function onHandleDown(e) {
		e.preventDefault();
		e.stopPropagation();

		var data = e.data,
			oe = e.originalEvent,
			touch = (typeof oe.targetTouches !== "undefined") ? oe.targetTouches[0] : null,
			pageX = (touch) ? touch.pageX : e.clientX,
			pageY = (touch) ? touch.pageY : e.clientY;

		if (data.horizontal) {
			// Horizontal
			data.mouseStart = pageX;
			data.handleLeft = parseInt(data.$handle.css("left"), 10);
		} else {
			// Vertical
			data.mouseStart = pageY;
			data.handleTop = parseInt(data.$handle.css("top"), 10);
		}

		onStart(data);
	}

	/**
	 * @method private
	 * @name onStart
	 * @description Handles touch.mouse start
	 * @param data [object] "Instance data"
	 */
	function onStart(data) {
		data.$content.off( classify(namespace) );

		$body.on(events.move, data, onMouseMove)
			 .on(events.end, data, onMouseUp);
	}

	/**
	 * @method private
	 * @name onMouseMove
	 * @description Handles mousemove event
	 * @param e [object] "Event data"
	 */
	function onMouseMove(e) {
		e.preventDefault();
		e.stopPropagation();

		var data = e.data,
			oe = e.originalEvent,
			pos = 0,
			delta = 0,
			touch = (typeof oe.targetTouches !== "undefined") ? oe.targetTouches[0] : null,
			pageX = (touch) ? touch.pageX : e.clientX,
			pageY = (touch) ? touch.pageY : e.clientY;

		if (data.horizontal) {
			// Horizontal
			delta = data.mouseStart - pageX;
			pos = data.handleLeft - delta;
		} else {
			// Vertical
			delta = data.mouseStart - pageY;
			pos = data.handleTop - delta;
		}

		position(data, pos);
	}

	/**
	 * @method private
	 * @name onMouseUp
	 * @description Handles mouseup event
	 * @param e [object] "Event data"
	 */
	function onMouseUp(e) {
		e.preventDefault();
		e.stopPropagation();

		var data = e.data;

		data.$content.on("scroll.scroller", data, onScroll);
		$body.off(".scroller");
	}

	/**
	 * @method private
	 * @name onTouchEnd
	 * @description Handles mouseup event
	 * @param e [object] "Event data"
	 */
	function onTouchEnd(e) {
		e.preventDefault();
		e.stopPropagation();

		var data = e.data;

		data.$content.on("scroll.scroller", data, onScroll);
		$body.off(".scroller");
	}

	/**
	 * @method private
	 * @name position
	 * @description Position handle based on scroll
	 * @param data [object] "Instance data"
	 * @param pos [int] "Scroll position"
	 */
	function position(data, pos) {
		var handleStyles = {};

		if (data.horizontal) {
			// Horizontal
			if (pos < data.handleBounds.left) {
				pos = data.handleBounds.left;
			}

			if (pos > data.handleBounds.right) {
				pos = data.handleBounds.right;
			}

			var scrollLeft = Math.round(pos * data.scrollRatio);

			handleStyles = {
				left: pos
			};

			data.$content.scrollLeft( scrollLeft );
		} else {
			// Vertical
			if (pos < data.handleBounds.top) {
				pos = data.handleBounds.top;
			}

			if (pos > data.handleBounds.bottom) {
				pos = data.handleBounds.bottom;
			}

			var scrollTop = Math.round(pos * data.scrollRatio);

			handleStyles = {
				top: pos
			};

			data.$content.scrollTop( scrollTop );
		}

		data.$handle.css(handleStyles);
	}

	/**
	 * @method private
	 * @name classify
	 * @description Create class selector from text
	 * @param text [string] "Text to convert"
	 * @return [string] "New class name"
	 */
	function classify(text) {
		return "." + text;
	}

	$.fn[namespace] = function(method) {
		if (pub[method]) {
			return pub[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return init.apply(this, arguments);
		}
		return this;
	};

	$[namespace] = function(method) {
		if (method === "defaults") {
			pub.defaults.apply(this, Array.prototype.slice.call(arguments, 1));
		}
	};
})(jQuery);
