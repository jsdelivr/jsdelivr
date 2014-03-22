/**
*	Really Simple™ Slideshow jQuery plug-in 1.4.12
*	---------------------------------------------------------
*	Load slideshow images dynamically, instead of all at once
*	---------------------------------------------------------
*
*	Introduction, Demos, Docs and Downloads:
*	http://reallysimpleworks.com/slideshow
*
*	Copyright (c) 2011 Really Simple
*	http://reallysimpleworks.com
*
*	Licensed under the MIT license:
*	http://www.opensource.org/licenses/mit-license.php
*	Free to use for both commercial and non-commercial.
*/


/**
*	Extra Bite-Sized Docs
*	---------------------
*
*	If embedding slide data in your markup, you can initialise
*	and start a slideshow with one line of code:
*
*	$('#my-slideshow-div').rsfSlideshow();
*
*	If you're pulling in slide data from elsewhere and want to
*	manually add slides to the slideshow:
*
*	var slides = Array(
*		{url: 'http://mydomain.com/images/1.png', caption: 'This is slide number 1'},
*		{url: 'http://mydomain.com/images/2.png', caption: 'This is slide number 2', captionClass: 'highlight'},
*		{url: '/images/3.png', caption: 'This is slide number 3'},
*	);
*	$('#my-slideshow-div').rsfSlideshow({slides: slides});
*
*	For complete docs and demos, visit:
*	http://reallysimpleworks.com/slideshow
*/





(function($) {


	var methods = {


		/**
		*	The 'options' object can be used to override any of the
		*	default parameters in the 'defaults' object above
		*/

		init: function(options) {

			return this.each(function() {

				var slideshow = this,
					$slideshow = $(this),
					data = $slideshow.data('rsf_slideshow'),
					settings;
					
				if (!data) {
					settings = $.extend(true, {}, $.rsfSlideshow.defaults);
					if (typeof options === 'object') {
						$.extend(true, settings, options);
					}
					$slideshow.data('rsf_slideshow', {
						slides: [],
						this_slide: 0,
						effect_iterator: {
							this_effect: -1,
							direction: 1
						},
						settings: settings,
						interval_id: false,
						loaded_imgs: [],
						queued: 0
					});	
					data = $slideshow.data('rsf_slideshow');
				}
				settings = data.settings;
				
				
				//	Attempt to find slide data in the page markup
				$slideshow.rsfSlideshow('getSlidesFromMarkup');
				
				
				//	Add slide data from an array, if provided
				if (settings.slides.length) {
					$slideshow.rsfSlideshow('addSlides', settings.slides);
					settings.slides = [];
				}
				
				
				//	Bind gloabal slidshow event handlers
				if (typeof settings.eventHandlers === 'object') {
					$.each(settings.eventHandlers, function(evnt, fn) {
						$slideshow.bind(evnt, function(e) {fn($slideshow, e); });
					});
				}
				
				
				//	Generate and bind control elements
				if (settings.controls.playPause.auto) {
					$slideshow.rsfSlideshow('addControl', 'playPause');
				}
				if (settings.controls.previousSlide.auto) {
					$slideshow.rsfSlideshow('addControl', 'previousSlide');
				}
				if (settings.controls.index.auto) {
					$slideshow.rsfSlideshow('addControl', 'index');
				}
				if (settings.controls.nextSlide.auto) {
					$slideshow.rsfSlideshow('addControl', 'nextSlide');
				}
			
				
				//	Start the slideshow
				if (settings.autostart) {
					$slideshow.rsfSlideshow('startShow');
				}
				
			});
		},
		
		
		/**
		*	Add slide data to the slideshow
		*	@param slides (required) object, array or string
		*		a string containing the URL of the slide image or
		*		a slide object containing the properties for a single 
		*		slide (see docs) or
		*		an array of slide objects
		*/
		
		addSlides: function(slides) {
			return this.each(function() {
				if (slides instanceof Array) {
					for (var i = 0, len = slides.length; i < len; i ++) {
						RssPrivateMethods._addSlide($(this), slides[i]);
					}
				}
				else {
					RssPrivateMethods._addSlide($(this), slides);
				}
			});
		},
		
		
		/**
		*	Remove slide(s) from the slideshow
		*	@param slide_keys (optional) array or integer
		*		an array of slide indices to remove from the slides array or
		*		a single slide index as an integer
		*		if not set, the whole slides array is emptied
		*/
		
		removeSlides: function(slide_keys) {
			if (slide_keys === undefined) {
				return this.each(function() {
					$(this).data('rsf_slideshow').slides = [];
				});
			}
			else if (slide_keys instanceof Array) {
				slide_keys.sort(function(a, b) {return b - a; });
				var removed = [];
				return this.each(function() {
					for (var i = 0, len = slide_keys.length; i < len; i ++) {
						if ($.inArray(slide_keys[i], removed) === -1) {
							RssPrivateMethods._removeSlide($(this), slide_keys[i]);
							removed.push(slide_keys[i]);
						}
					}
				});
			}
			else {
				return this.each(function() {
					RssPrivateMethods._removeSlide($(this), slide_keys);
				});
			}
		},
		
		
		/**
		*	Returns a slide data object by key, or the
		*	entire slides array if a key is not specified
		*	@param key (optional) integer
		*		the index of a slide in the slide array
		*/
		
		getSlideData: function(key) {
			if (key === undefined) {
				return this.data('rsf_slideshow').slides;
			}
			if (this.data('rsf_slideshow').slides[key]) {
				return this.data('rsf_slideshow').slides[key];
			}
			return false;
		},
		
		
		/**
		*	Start the slideshow
		*	@param interval (optional) integer or float
		*		the duration for which each slide is displayed
		*		if set, this overrides the options setting
		*	@param instant (optional) boolean
		*		if true, the first transition is triggered immediately
		*/
		
		startShow: function(interval, instant) {
			return this.each(function() {
				var $slideshow = $(this);
				if (!$slideshow.data('rsf_slideshow').interval_id) {
					if (instant) {
						$slideshow.rsfSlideshow('nextSlide');
					}
					$slideshow.data('rsf_slideshow')._current_interval = interval;
					RssPrivateMethods._setTimeout($slideshow, interval);
					$slideshow.bind('_rsSlideReady', function(e, event_data) {
						RssPrivateMethods._setTimeout($slideshow, interval);
					});
					RssPrivateMethods._trigger($slideshow, 'rsStartShow');
				}
			});
		},
		
		
		/**
		*	Stop the slideshow
		*/
		
		stopShow: function() {
			return this.each(function() {
				var $slideshow = $(this),
					data = $slideshow.data('rsf_slideshow');
				if (data.interval_id) {
					clearTimeout(data.interval_id);
					data.interval_id = false;
				}
				$slideshow.unbind('_rsSlideReady');
				RssPrivateMethods._trigger($(this), 'rsStopShow');
			});
		},
		
		
		/**
		*	Toggle the slideshow 
		*	calls startShow if the slideshow is stopped 
		*	and stopShow if it is running
		*/
		
		toggleShow: function() {
			return this.each(function() {
				if ($(this).rsfSlideshow('isRunning')) {
					$(this).rsfSlideshow('stopShow');
				}
				else {
					$(this).rsfSlideshow('startShow', false, true);
				}
			});
		},
		
		
		/**
		*	Returns true if the slideshow is currently 
		*	running, false if not.
		*/
		
		isRunning: function() {
			if (this.data('rsf_slideshow').interval_id) {
				return true;
			}
			return false;
		},
		
		
		/**
		*	Return the array key of the current slide
		*	The first slide's key is 0.
		*/
		
		currentSlideKey: function() {
			var data = this.data('rsf_slideshow');
			return data.this_slide;
		},
		
		
		/**
		*	Return the total number of slides currently in the slideshow
		*/
		
		totalSlides: function() {
			var data = this.data('rsf_slideshow');
			return data.slides.length;
		},
		
		
		/**
		*	Find slide data in the markup and add to the slides array
		*	@param options (optional) object
		*		an object containing options to override default settings for:
		*			data_container
		*			slide_data_container
		*			slide_data_selectors
		*			(see default options and docs)
		*/
		
		getSlidesFromMarkup: function(options) {
			return this.each(function() {
				var data = $(this).data('rsf_slideshow');
				if (!options) {
					options = {};
				}
				//	Find the containing element
				if (!options.data_container) {
					options.data_container = data.settings.data_container;
				}
				var $cntnr;
				if (options.data_container.charAt(0) === '#') {
					$cntnr = $(options.data_container);
				}
				else {
					$cntnr = $(this).children(options.data_container);
				}
				if (!$cntnr.length) {
					return false;
				}
				
				if (!options.slide_data_container) {
					options.slide_data_container = data.settings.slide_data_container;
				}
				var slide_data_selectors = $.extend(true, {}, data.settings.slide_data_selectors);
				if (options.slide_data_selectors) {
					$.extend(true, slide_data_selectors, options.slide_data_selectors);
				}
				options.slide_data_selectors = slide_data_selectors;
				
				var $self = $(this);
				$cntnr.children(options.slide_data_container).each(function() {
					var slide = RssPrivateMethods._findData($(this), options.slide_data_selectors);
					$self.rsfSlideshow('addSlides', slide);
				});
			});
		},
		
		
		
		
		
		
		
		
		/**
		*	Load and transition into the next slide
		*/
		
		nextSlide: function() {
			return this.each(function() {
				var data = $(this).data('rsf_slideshow');
				data.this_slide ++;
				if (data.this_slide >= data.slides.length) {
					if (data.settings.loop) {
						data.this_slide = 0;
					}
					else {
						data.this_slide = data.slides.length - 1;
						$(this).rsfSlideshow('stopShow');
						return true;
					}
				}
				$(this).rsfSlideshow('showSlide', data.slides[data.this_slide]);
			});
		},
		
		
		/**
		*	Load and transition into the previous slide
		*/
		
		previousSlide: function() {
			return this.each(function() {
				var data = $(this).data('rsf_slideshow');
				data.this_slide --;
				if (data.this_slide < 0) {
					if (data.settings.loop) {
						data.this_slide = data.slides.length - 1;
					}
					else {
						data.this_slide = 0;
						$(this).rsfSlideshow('stopShow');
						return true;
					}
				}
				$(this).rsfSlideshow('showSlide', data.slides[data.this_slide]);
			});
		},
		
		
		/**
		*	Load and transition into the slide with the provided key
		*	@params key (required) integer
		*		the array index of a slide object in the slides array
		*/
		
		goToSlide: function(key) {
			return this.each(function() {
				var data = $(this).data('rsf_slideshow');
				if (typeof data.slides[key] === 'object') {
					data.this_slide = key;
					$(this).rsfSlideshow('showSlide', data.slides[data.this_slide]);
				}
			});
		},
		
		
		/**
		*	Load and transition into the provided slide object
		*	@param slide (required) object
		*		a slide object (see docs)
		*/
	
		showSlide: function(slide) {
			var $slideshow = this,
				data =  $slideshow.data('rsf_slideshow'),
				containerWidth = $slideshow.width(),
				containerHeight = $slideshow.height();
			RssPrivateMethods._trigger($slideshow, 'rsPreTransition');
			$slideshow.children('img:first').css('z-index', 0);
			
			var whenLoaded = function(img) {
				var $img = $(img);
				$img.addClass('rsf-slideshow-image');
				var whenDimensions = function(width, height) {
					RssPrivateMethods._trigger($slideshow, 'rsImageReady');
					var leftOffset = 0;
					if (width) {
						leftOffset = Math.ceil((containerWidth / 2) - (width / 2));
					}
					var topOffset = 0;
					if (height) {
						topOffset = Math.ceil((containerHeight / 2) - (height / 2));
					}
					$img.css({left: leftOffset});
					$img.css({top: topOffset});
					if (slide.image_title){
						$img.attr('title', slide.image_title);
					}
					if (slide.image_alt){
						$img.attr('alt', slide.image_alt);
					}
					if (slide.link_to) {
						$img = $('<a href="' + slide.link_to + '"></a>').append($img);
					}
					var $slide = $('<div></div>');
					$slide.addClass(data.settings.slide_container_class);
					$slide.append($img).css('display', 'none');
					if (slide.caption) {
						var $capt = $('<div>' + slide.caption + '</div>');
						$capt.addClass(data.settings.slide_caption_class);
						$capt.appendTo($slide);
						if (slide.captionClass) {
							$capt.addClass(slide.captionClass);
						}
					}
					var effect = data.settings.effect;
					if (slide.effect) {
						effect = slide.effect;
					}
					RssPrivateMethods._trigger($slideshow, '_rsSlideReady', {$slide: $slide});
					RssPrivateMethods._trigger($slideshow, 'rsSlideReady', {$slide: $slide});
					RssPrivateMethods._transitionWith($slideshow, $slide, effect);
					return true;
				};
				RssPrivateMethods._getImageDimensions(
					$slideshow, 
					$img, 
					whenDimensions, 
					(data.settings.interval * 1000) / 2,
					function() {whenDimensions(); });
			};
			
			var newImg = new Image();
			$(newImg).bind('load', function() {whenLoaded(this); });
			newImg.src = slide.url;
			
			return this;
		},
		

		
		
		
		/*****************************************************
		*	Methods for adding slideshow control functionality
		*/
		
		
		/**
		*	Generate, place and bind a control for the slideshow
		*	@param type (required) string
		*		this must refer to a property of the control option (see options and docs)
		*/
		
		addControl: function(type) {
			return this.each(function() {
				var $slideshow = $(this),
					settings = $slideshow.data('rsf_slideshow').settings;
				var $control = settings.controls[type].generate($slideshow);
				RssPrivateMethods._controlsContainer($slideshow);
				settings.controls[type].place($slideshow, $control);
				var bind_method = 'bind' + type.substr(0, 1).toUpperCase() + type.substr(1, type.length);
				$slideshow.rsfSlideshow(bind_method, $control);
			});
		},
		
		
		/*
		*	Play/ Pause toggle control
		*	@param $playPause (required) jQuery object 
		*		elements to apply play/pause functionality to
		*/
		
		bindPlayPause: function($playPause) {
			return this.each(function() {
				var $slideshow = $(this);
				var data = $slideshow.data('rsf_slideshow');
				$playPause.bind('click.rsfSlideshow', function(e) {																							
					e.preventDefault();
					$slideshow.rsfSlideshow('toggleShow');
				});
			});
		},
		
		
		/**
		*	Previous slide control
		*	@param $prev (required) jQuery object 
		*		elements to apply "previous slide" functionality to
		*	@param stop_show (optional) boolean
		*		if true, the slideshow is stopped when the control is clicked
		*		if not provided the global/options setting is used
		*/
		
		bindPreviousSlide: function($prev, autostop) {
			return this.each(function() {
				var $slideshow = $(this);
				var data = $slideshow.data('rsf_slideshow');
				if (!autostop) {
					autostop = data.settings.controls.previousSlide.autostop;
				}
				$prev.bind('click.rsfSlideshow', function(e) {
					e.preventDefault();
					$slideshow.rsfSlideshow('previousSlide');
					if (autostop) {
						$slideshow.rsfSlideshow('stopShow');
					}
				});
			});
		},
		
		
		/**
		*	Next slide control
		*	$next (required) jQuery object 
		*		elements to apply "next slide" functionality to
		*	@param stop_show (optional) boolean
		*		if true, the slideshow is stopped when the control is clicked
		*		if not provided the global/options setting is used
		*/
		
		bindNextSlide: function($next, autostop) {
			return this.each(function() {
				var $slideshow = $(this);
				var data = $slideshow.data('rsf_slideshow');
				if (!autostop) {
					autostop = data.settings.controls.nextSlide.autostop;
				}
				$next.bind('click.rsfSlideshow', function(e) {
					e.preventDefault();
					$slideshow.rsfSlideshow('nextSlide');
					if (autostop) {
						$slideshow.rsfSlideshow('stopShow');
					}
				});
			});
		},
		
		
		/**
		*	Bind indexing functionality
		*/
		
		bindIndex: function($index, autostop) {
			return this.each(function() {
				var $slideshow = $(this),
					settings = $slideshow.data('rsf_slideshow').settings;
				if (!autostop) {
					autostop = settings.controls.index.autostop;
				}
				var $indexLinks = settings.controls.index.getEach($slideshow);
				$indexLinks.bind('click.rsfSlideshow', function(e) {
					e.preventDefault();
					var slide_key = settings.controls.index.getSlideKey($(this));
					if (slide_key) {
						$slideshow.rsfSlideshow('goToSlide', slide_key);
						if (autostop) {
							$slideshow.rsfSlideshow('stopShow');
						}
					}
				});
				RssPrivateMethods._bindActiveIndex($slideshow);
			});
		}

		
	};
	
	
	
	
	$.fn.rsfSlideshow = function(method) {
		if (!this.length) {
			return this;
		}
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} 
		else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} 
		else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.rsfSlidehow' );
		}   
	};
	
	
	
	
	/**
	*	Private methods
	*/
	
	var RssPrivateMethods = {
		
		/**
		*	Iterating through slide data selectors 
		*	to find data for a single slide
		*	@param $slideData (required) jQuery object
		*		jQuery object containing the DOM element 
		*		containing data for a single slide (with 
		*		default settings this is a <li> element)
		*	@param slide_data_selectors (required) object
		*		information about where each slide property 
		*		be found (see docs)
		*/
		
		_findData: function($slideData, slide_data_selectors) {
			var slide = {};
			var slide_attr;
			for (var key in slide_data_selectors) {
				if (slide_data_selectors.hasOwnProperty(key)) {
					var $slideDataClone = $slideData.clone();
					if (slide_data_selectors[key].selector) {
						$slideDataClone = $slideDataClone.children(slide_data_selectors[key].selector);
					}
					if (slide_data_selectors[key].attr) {
						slide_attr = $slideDataClone.attr(slide_data_selectors[key].attr);
					}
					else {
						slide_attr = $slideDataClone.html();
					}
					slide[key] = slide_attr;
				}
			}
			return slide;
		},
		
		
		/**
		*	Private method for adding a single slide object
		*	@param $slideshow (required) jQuery object 
		*		the slideshow
		*	@param slide (required) string or object 
		*		the URL of the slide image as a string or
		*		the slide data as a slide object (see docs)
		*	This should not be used directly, the public 
		*	addSlides() method should be used instead.
		*/
		
		_addSlide: function($slideshow, slide) {
			var data = $slideshow.data('rsf_slideshow');
			if (typeof slide === 'string') {
				var url = $.trim(slide);
				data.slides.push({url: url});
			}
			else if (slide.url) {
				for (var key in slide) {
					if (slide.hasOwnProperty(key)) {
						slide[key] = $.trim(slide[key]);
					}
				}
				data.slides.push(slide);
			}
		},
		
		
		/**
		*	Remove a single slide from the slides array
		*	@param $slideshow (required) jQuery object 
		*		the slideshow
		*/
		
		_removeSlide: function($slideshow, key) {
			$slideshow.data('rsf_slideshow').slides.splice(key, 1);
		},
		
		
		/**
		*	Perform a transition with a specified effect
		*	@param $slideshow (required) jQuery object 
		*		the slideshow
		*	@param $slide (required) jQuery object 
		*		the incoming slide container
		*	@param effect (required) string or object
		*		the transition effect name as a string or
		*		a transition effect object (see docs)
		*/
		
		_transitionWith: function($slideshow, $slide, effect) {
			var data = $slideshow.data('rsf_slideshow'),
				effect_iteration = 'random',
				$prevSlide = $slideshow.find('.' + data.settings.slide_container_class + ':last');
				
			if ($prevSlide.length) {
				$slide.insertAfter($prevSlide);
			}
			else {
				$slide.prependTo($slideshow);
			}
				
			if (typeof effect === 'object' && effect.iteration && effect.effects) {
				effect_iteration = effect.iteration;
				effect = effect.effects;
			}
			
			if (effect instanceof Array) {
				switch (effect_iteration) {
					case 'loop':
						data.effect_iterator.this_effect ++;
						if (data.effect_iterator.this_effect > effect.length - 1) {
							data.effect_iterator.this_effect = 0;
						}
						break;
					case 'backAndForth':
						data.effect_iterator.this_effect += data.effect_iterator.direction;
						if (data.effect_iterator.this_effect < 0) {
							data.effect_iterator.this_effect = 1;
							data.effect_iterator.direction = data.effect_iterator.direction * -1;
						}
						if (data.effect_iterator.this_effect > effect.length - 1) {
							data.effect_iterator.this_effect = effect.length - 2;
							data.effect_iterator.direction = data.effect_iterator.direction * -1;
						}
						break;
					default:
						data.effect_iterator.this_effect = Math.floor(Math.random() * effect.length);
						break;
				}
				effect = effect[data.effect_iterator.this_effect];
			}
			
			if ($.rsfSlideshow.transitions[effect] && 
			typeof($.rsfSlideshow.transitions[effect]) === 'function') {
				$.rsfSlideshow.transitions[effect]($slideshow, $slide);
			}
		},
		
		
		/**
		*	Perform slide animation
		*	@param $slideshow (required) jQuery object 
		*		the slideshow
		*	@param $slide (required) jQuery object 
		*		the incoming slide container
		*	@param $previousSlide (required) jQuery object 
		*		the outgoing slide container
		*	@param left_offset (required) integer
		*		the left start position of the incoming slide in pixels
		*	@param left_offset (required) integer
		*		the top start position of the incoming slide in pixels
		*/
		
		_doSlide: function($slideshow, $slide, left_offset, top_offset) {
			var data = $slideshow.data('rsf_slideshow'),
				$prevSlide = $slide.prev();
			$slide.css({top: top_offset, left: left_offset});
			$slide.css('display', 'block');
			
			$slide.stop().animate(
				{top: 0, left: 0},
				data.settings.transition, 
				data.settings.easing, 
				function() {
					RssPrivateMethods._endTransition($slideshow, $slide);
				}
			);
			
			$prevSlide.stop().animate(
				{top: (0 - top_offset), left: (0 - left_offset)},
				data.settings.transition, 
				data.settings.easing
			);
		},
		
		
		/**
		*	Handles finding the image dimensions
		*	@param $slideshow (required) jQuery object 
		*		the slideshow
		*	@param $img (required) jQuery object 
		*		the loaded image
		*	@param success (required) function
		*		function to call when dimensions are found
		*	@param timeout (optional) integer 
		*		the time after which the method will stop trying
		*		to find the image dimensions
		*	@param onTimeout (required) function
		*		function to call when timeout is reached
		*/
		
		_getImageDimensions: function($slideshow, $img, sucesss, timeout, onTimeout, time) {
			if (!time) {
				time = 0;
				$slideshow.prepend($img);
			}
			var width = $img.outerWidth();
			var height = $img.outerHeight();
			if (width && height) {
				$img.detach();
				sucesss(width, height);
				return true;
			}
			if (timeout && time > timeout) {
				$img.detach();
				if (onTimeout && typeof(onTimeout) === 'function') {
					onTimeout(timeout, time);
				}
				return false;
			}
			time += 200;
			setTimeout(function() {
				RssPrivateMethods._getImageDimensions($slideshow, $img, sucesss, timeout, onTimeout, time); 
			}, 200);
		},
		
		/**
		*	Anything that needs to be done after a transition ends
		*	@param $slideshow (required) jQuery object 
		*		the slideshow
		*/
		
		_endTransition: function($slideshow, $slide) {
			$slide.prev().remove();
			RssPrivateMethods._trigger($slideshow, 'rsPostTransition');
			if ($slideshow.rsfSlideshow('currentSlideKey') === $slideshow.rsfSlideshow('totalSlides') - 1) {
				RssPrivateMethods._trigger($slideshow, 'rsLastSlide');
			}
			else if ($slideshow.rsfSlideshow('currentSlideKey') === 0) {
				RssPrivateMethods._trigger($slideshow, 'rsFirstSlide');
			}
		},
		
		
		/**
		*	Bind event handlers for adding and remving a class to index elements
		*	according to the current slide key
		*	@param $slideshow (required) jQuery object 
		*		the slideshow
		*/
		
		_bindActiveIndex: function($slideshow) {
			var indexSettings = $slideshow.data('rsf_slideshow').settings.controls.index;
			$slideshow.bind('rsPreTransition', function() {
				var current_slide_key = $(this).rsfSlideshow('currentSlideKey');
				indexSettings.getEach($slideshow).removeClass(indexSettings.active_class);
				indexSettings.getSingleByKey($slideshow, current_slide_key).addClass(indexSettings.active_class);
			});
		},
		
		
		/**
		*	check for controls container and generate if not present
		*	@param $slideshow (required) jQuery object 
		*		the slideshow
		*/
		
		_controlsContainer: function($slideshow) {
			var settings = $slideshow.data('rsf_slideshow').settings;
			if (!settings.controls.container.get($slideshow).length) {
				var $container = settings.controls.container.generate($slideshow);
				settings.controls.container.place($slideshow, $container);
			}
		},
		
		
		/**
		*	Wrapper for triggering slideshow events
		*	@param $slideshow (required) jQuery object 
		*		the slideshow
		*	@param e (required) string
		*		the custom event name
		*	@param event_data (optional) object
		*		addional data to pass to event handlers
		*/
		
		_trigger: function($slideshow, e, event_data) {
			var data = $slideshow.data('rsf_slideshow');
			if (typeof event_data !== 'object') {
				event_data = {};
			}
			$.extend(event_data, {slide_key: data.this_slide, slide: data.slides[data.this_slide]});
			$slideshow.trigger(e, event_data);
		},
		
		
		/**
		*	Set the timer for the next slide
		*/
		
		_setTimeout: function($slideshow, interval) {
			var data = $slideshow.data('rsf_slideshow');
			if (data.interval_id) {
				clearTimeout(data.interval_id);
			}
			if (!interval) {
				interval = data.settings.interval;
			}
			if (interval <= data.settings.transition / 1000) {
				interval = (data.settings.transition / 1000) + 0.1;
			}
			data.interval_id = setTimeout(function() {
				$slideshow.rsfSlideshow('nextSlide'); 
			}, interval * 1000);
		}
		
	};
	
  
  
	/**
	*	Default options
	*	Any default options can be set directly by accessing 
	*	the $.rsfSlideshow.defaults hash
	*/
	
	$.rsfSlideshow = {
		defaults: {
			//	Duration of the interval between each slide in seconds
			interval: 5,
			//	Duration of the transition effect in milliseconds
			transition: 1000,
			//	The transition effect.
			effect: 'fade',
			//	Easing for slide effects (use the easing jQuery plugin for more options)
			easing: 'swing',
			//	If true, the slideshow will loop
			loop: true,
			//	Start slideshow automatically on initialisation
			autostart: true,
			//	Slides to add to the slideshow
			slides: [],
			//	Class of the div containing the slide image and caption
			slide_container_class: 'slide-container',
			//	Class to add to slide caption <span>
			slide_caption_class: 'slide-caption',
			//	jQuery selector for the element containing slide data when using markup to pass data.
			//	If this is an ID (starts with '#') the element can be placed anywhere on the page, 
			//	Any other selector is assumed to be a child of the slideshow element.
			data_container: 'ol.slides',
			//	jQuery selector for each slide data element
			slide_data_container: 'li',
			//	Objects containing selection routes for slide attributes
			//	One or both of 'selector' and/or 'attr' must be present
			slide_data_selectors: {
				url: {selector: 'a', attr: 'href'},
				caption: {selector: 'a', attr: 'title'},
				link_to: {selector: 'a', attr: 'data-link-to'},
				effect: {selector: 'a', attr: 'data-effect'}
			},
			
			
			//	Default event handlers, assigned to every instance of the slideshow
			eventHandlers: {
				rsStartShow: function(rssObj, e) {
					var controlSettings = $(rssObj).data('rsf_slideshow').settings.controls.playPause;
					var $playPause = controlSettings.get($(rssObj));
					$playPause.html('Pause').addClass(controlSettings.playing_class);
				},
				rsStopShow: function(rssObj, e) {
					var controlSettings = $(rssObj).data('rsf_slideshow').settings.controls.playPause;
					var $playPause = controlSettings.get($(rssObj));
					$playPause.html('Play').addClass(controlSettings.paused_class);
				}
			},
			
			
			/**
			*	These options define methods for generating, placing and finding
			*	slideshow control elements.
			*/
			
			controls: {
				playPause: {
					generate: function($slideshow) {
						return $('<a href="#" class="rs-play-pause ' + 
							$slideshow.data('rsf_slideshow').settings.controls.playPause.paused_class + 
								'" data-control-for="' + 
								$slideshow.attr('id') + '">Play</a>');
					},
					place: function($slideshow, $control) {
						var $container = 
							$slideshow.data('rsf_slideshow').settings.controls.container.get($slideshow);
						$container.append($control);
					},
					get: function($slideshow) {
						return $('.rs-play-pause[data-control-for="' + $slideshow.attr('id') + '"]');
					},
					playing_class: 'rs-playing',
					paused_class: 'rs-paused',
					auto: false
				},
				previousSlide: {
					generate: function($slideshow) {
						return $('<a href="#" class="rs-prev" data-control-for="' + 
								$slideshow.attr('id') + '">&lt;</a>');
					},
					place: function($slideshow, $control) {
						var $container = 
							$slideshow.data('rsf_slideshow').settings.controls.container.get($slideshow);
						$container.append($control);
					},
					get: function($slideshow) {
						return $('.rs-prev[data-control-for="' + $slideshow.attr('id') + '"]');
					},
					autostop: true,
					auto: false
				},
				nextSlide: {
					generate: function($slideshow) {
						return $('<a href="#" class="rs-next" data-control-for="' + 
								$slideshow.attr('id') + '">&gt;</a>');
					},
					place: function($slideshow, $control) {
						var $container = 
							$slideshow.data('rsf_slideshow').settings.controls.container.get($slideshow);
						$container.append($control);
					},
					get: function($slideshow) {
						return $('.rs-next[data-control-for="' + $slideshow.attr('id') + '"]');
					},
					autostop: true,
					auto: false
				},
				index: {
					generate: function($slideshow) {
						var slide_count = $slideshow.rsfSlideshow('totalSlides'),
							$indexControl = $('<ul class="rs-index-list clearfix"></ul>');
						$indexControl.attr('data-control-for', $slideshow.attr('id'));
						for (var i = 0; i < slide_count; i ++) {
							var $link = $('<a href="#"></a>');
							$link.addClass('rs-index');
							$link.attr('data-control-for', $slideshow.attr('id'));
							$link.attr('data-slide-key', i);
							$link.append(i + 1);
							if (i === $slideshow.rsfSlideshow('currentSlideKey')) {
								$link.addClass('rs-active');
							}
							var $li = $('<li></li>');
							$li.append($link);
							$indexControl.append($li);
						}
						return $indexControl;
					},
					place: function($slideshow, $control) {
						var $container = 
							$slideshow.data('rsf_slideshow').settings.controls.container.get($slideshow);
						$container.append($control);
					},
					get: function($slideshow) {
						return $('.rs-index-list[data-control-for="' + $slideshow.attr('id') + '"]');
					},
					getEach: function($slideshow) {
						return $('.rs-index[data-control-for="' + $slideshow.attr('id') + '"]');
					},
					getSingleByKey: function($slideshow, slide_key) {
						return $('.rs-index[data-control-for="' + 
								$slideshow.attr('id') + '"][data-slide-key="' + slide_key + '"]');
					},
					getSlideKey: function($controlItem) {
						return $controlItem.attr('data-slide-key');
					},
					active_class: 'rs-active',
					autostop: true,
					auto: false
				},
				container: {
					generate: function($slideshow) {
						return $('<div class="rs-controls clearfix" id="rs-controls-' + $slideshow.attr('id') + '"></div>');
					},
					place: function($slideshow, $control) {
						$slideshow.after($control);
					},
					get: function($slideshow) {
						return $('#rs-controls-' + $slideshow.attr('id'));
					}
				}
			}
		},
		
		
		//	Transition effects
		transitions: {
			none: function($slideshow, $slide) {
				$slide.css('display', 'block');
			},
			fade: function($slideshow, $slide) {
				$slide.fadeIn(
					$slideshow.data('rsf_slideshow').settings.transition, 
					function() {
						RssPrivateMethods._endTransition($slideshow, $slide);
					});
			},
			slideLeft: function($slideshow, $slide) {
				var left_offset = $slide.outerWidth();
				RssPrivateMethods._doSlide($slideshow, $slide, left_offset, 0);
			},
			slideRight: function($slideshow, $slide) {
				var left_offset = 0 - $slide.outerWidth();
				RssPrivateMethods._doSlide($slideshow, $slide, left_offset, 0);
			},
			slideUp: function($slideshow, $slide) {
				var top_offset = $slide.outerHeight();
				RssPrivateMethods._doSlide($slideshow, $slide, 0, top_offset);
			},
			slideDown: function($slideshow, $slide) {
				var top_offset = 0 - $slide.outerHeight();
				RssPrivateMethods._doSlide($slideshow, $slide, 0, top_offset);
			}
		}
		
	};
  
  
})( jQuery );

