/*global window, document, console, $, jQuery, undefined */

/**

	jQuery Plugin .stripe( [options] )
	@version  : 1.0.1
	@author   : Bruce Thomas
	@requires : jQuery Core 1.7+
	@github   : https://github.com/fliptopbox/jquery.stripe/


*/
(function ( $, window, document, undefined ) {
	// Create the defaults once
	var pluginName = 'stripe',
		defaults = {
			"ms": 750,
			"delay": (10 * 1000),
			"automatic": false,
			"min-width": 10,
			"buttons": null
		},
		minHeight = null;

	// The actual plugin constructor
	function Plugin ( element, options ) {
		this.element = element;
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}


	Plugin.prototype.init = function () {
		var container = $(this.element).addClass('stripe'), //$(this.handle),
			ul = container.find('ul:first'),
			li = ul.find('li'),
			nn = li.length,
			options = this.options,
			getOption = function (key, value) {
				// console.log('getOption',key, options[key], options);
				return options[key];
			},
			ms = getOption('ms'),
			loaded = 0,
			timeout = null,
			defaultDelay = getOption('delay'),
			swipeDelay = defaultDelay,
			automatic = getOption('automatic'),
			images = (function () {
				// preload all the images.
				var tmp = [];
				$(li).each(function (i, obj) {
					var me = $(this),
						img = me.find('img'),
						src = img.attr('src'),
						alt = img.attr('alt') || '';
					tmp.push({'src': src, 'alt': alt});

				});
				return tmp;
			}()),
			minStripeWidth = getOption('min-width'),
			totalWidth = container.width(),
			maxImageWidth = totalWidth - (nn * minStripeWidth),
			current = null,

			random = function (max, min) {
				min = min || 1;
				return Math.floor((Math.random()*max) + min);
			},
			getImage = function (i) {
				i = typeof i === 'number' ? i : random(nn);
				i = i > nn - 1 ? 0 : i;
				i = i < 0 ? nn - 1 : i;
				if(current === i) { return getImage(); }
				current = i;
				var me = li.eq(i),
					lis = me.siblings('li'),
					img = me.find('img'),
					src = img.attr('src'),

					onload = function (img) {
						var myWidth = img.width,
							maxWidth = myWidth >= maxImageWidth ?
									maxImageWidth : myWidth,
							diff = totalWidth - maxWidth,
							mean = diff / (nn - 1),
							altText = img.alt,
							alt = $('<div />')
								.addClass('stripe-description')
								.css({'display': 'none'})
								.html('<em>' + altText.split(' - ').join('</em><em>') + '</em>');
						$('.stripe-description').remove();
						lis.animate({'width': mean}, ms, 'swing');
						me.animate({'width': maxWidth}, ms, 'swing', function () {
							me.append(alt);
							setTimeout(function() {
								alt.fadeIn(ms);
							}, 0);
						});
					};
				img.height(images[i].height).width(images[i].width);
				onload(images[i]);
				return current;
			},

			auto = function (ms) {
				if (!automatic) {
					console.log('automatic', automatic);
					return;
				}
				swipeDelay = typeof ms === 'number' ? ms : swipeDelay;
				timeout = timeout || setTimeout(function () {
					timeout = null;
					getImage();
					auto();
				}, swipeDelay - 250);
			},
			enter = function () {
				clearTimeout(timeout);
				timeout = null;
			},
			exit = function () {
				auto();
			},
			next = function () { return getImage( current + 1); },
			previous = function () { return getImage( current - 1); },
			insertNavigationCtrl = function () {
				if(!getOption('buttons')) { return; }
				var ctrl = $('<div />').addClass('stripe-control'),
					button = '<a href="#" class="button"></a>',
					buttonNext = $(button).addClass('next').append('<span>next</span>'),
					buttonPrev = $(button).addClass('previous').append('<span>prev</span>'),
					that = this;

				ctrl.append(buttonPrev).append(buttonNext);
				container.append(ctrl);
				ctrl.on('click', '.button', function (e) {
					e.preventDefault();
					var me = $(this),
						isnext = me.hasClass('next');
					return isnext ? next() : previous();
					// return that[nav]();
				});
				ctrl.on('mouseenter', enter).on('mouseleave', exit);
			},
			conformHeights = function () {
				li.height(minHeight);
				var ratio, newWidth;
				$(images).each(function (i, image){
					//
					// image.height = minHeight;
					ratio = image.width / image.height;
					newWidth = minHeight * ratio;
					images[i].width = newWidth;
					images[i].height = minHeight;
				});
				getImage(random(nn));
				auto();
			},
			init = function () {
				li.width( totalWidth / nn ); // ... while pre-loading
				$(images).each(function(i, obj) {
					var img = new Image();
					img.onload = function () {
						$.extend(images[i], {
							'width': img.width,
							'height': img.height
						});
						minHeight = Math.min(minHeight || img.height, img.height);
						if ((loaded += 1) >= nn) {
							insertNavigationCtrl();
							conformHeights();
							return;
						}
					};
					img.src = obj.src;
				});

			}();

		li.on('click', function () {
			var index = $(this).index();
			return index !== current ? getImage(index) : current;
		});

		container.on('mouseenter', enter).on('mouseleave', exit);


	};

	// Create the plugin
	$.fn[pluginName] = function ( options ) {
		options = options && options.constructor === Object ? options : {};

		return this.each(function (n) {
			$.data(this, 'plugin_' + pluginName, new Plugin( this, options));
		});
	};
}( jQuery, window, document ));










