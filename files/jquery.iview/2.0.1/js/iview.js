/**
 * jQuery iView Slider v2.0
 * 
 * @version: 2.0.1 - August 17, 2012
 * 
 * @author: Hemn Chawroka
 *          hemn@iprodev.com
 *          http://iprodev.com/
 * 
 */ (function ($, window, undefined) {

	var iView = function (el, options) {
			//Get slider holder
			var iv = this;

			iv.options = options;

			iv.sliderContent = el, iv.sliderInner = iv.sliderContent.html();

			iv.sliderContent.html("<div class='iviewSlider'>" + iv.sliderInner + "</div>");

			//Get slider
			iv.slider = $('.iviewSlider', iv.sliderContent);
			iv.slider.css('position', 'relative');

			//Necessary variables.
			iv.defs = {
				slide: 0,
				total: 0,
				image: '',
				images: [],
				width: iv.sliderContent.width(),
				height: iv.sliderContent.height(),
				timer: options.timer.toLowerCase(),
				lock: false,
				paused: (options.autoAdvance) ? false : true,
				time: options.pauseTime,
				easing: options.easing
			};

			//Disable slider text selection
			iv.disableSelection(iv.slider[0]);

			//Find slides
			iv.slides = iv.slider.children();
			iv.slides.each(function (i) {
				var slide = $(this);

				//Find images & thumbnails
				iv.defs.images.push(slide.data("iview:image"));
				if (slide.data("iview:thumbnail")) iv.defs.images.push(slide.data("iview:thumbnail"));
				slide.css('display', 'none');

				//Find videos
				if (slide.data("iview:type") == "video") {
					var element = slide.children().eq(0),
						video = $('<div class="iview-video-show"><div class="iview-video-container"><a class="iview-video-close" title="' + options.closeLabel + '">&#735;</a></div></div>');
					slide.append(video);
					element.appendTo($('div.iview-video-container', video));
					video.css({
						width: iv.defs.width,
						height: iv.defs.height,
						top: '-' + iv.defs.height + 'px'
					}).hide();
					slide.addClass('iview-video').css({
						'cursor': 'pointer'
					});
				}

				iv.defs.total++;
			}).css({
				width: iv.defs.width,
				height: iv.defs.height
			});

			//Set Preloader Element
			iv.sliderContent.append('<div id="iview-preloader"><div></div></div>');
			var iviewPreloader = $('#iview-preloader', iv.sliderContent);
			var preloaderBar = $('div', iviewPreloader);
			iviewPreloader.css({
				top: ((iv.defs.height / 2) - (iviewPreloader.height() / 2)) + 'px',
				left: ((iv.defs.width / 2) - (iviewPreloader.width() / 2)) + 'px'
			});

			//Set Timer Element
			iv.sliderContent.append('<div id="iview-timer"><div></div></div>');
			iv.iviewTimer = $('#iview-timer', iv.sliderContent);
			iv.iviewTimer.hide();

			//Find captions
			$('.iview-caption', iv.slider).each(function (i) {
				var caption = $(this);
				caption.html('<div class="caption-contain">' + caption.html() + '</div>');
			});

			//If randomStart
			options.startSlide = (options.randomStart) ? Math.floor(Math.random() * iv.defs.total) : options.startSlide;

			//Set startSlide
			options.startSlide = (options.startSlide > 0 && options.startSlide >= iv.defs.total) ? iv.defs.total - 1 : options.startSlide;
			iv.defs.slide = options.startSlide;

			//Set first image
			iv.defs.image = iv.slides.eq(iv.defs.slide);

			//Set pauseTime
			iv.defs.time = (iv.defs.image.data('iview:pausetime')) ? iv.defs.image.data('iview:pausetime') : options.pauseTime;

			//Set easing
			iv.defs.easing = (iv.defs.image.data('iview:easing')) ? iv.defs.image.data('iview:easing') : options.easing;

			iv.pieDegree = 0;
			var padding = options.timerPadding,
				diameter = options.timerDiameter,
				stroke = options.timerStroke;

			if (iv.defs.total > 1 && iv.defs.timer != "bar") {
				//Start the Raphael
				stroke = (iv.defs.timer == "360bar") ? options.timerStroke : 0;
				var width = (diameter + (padding * 2) + (stroke * 2)),
					height = width,
					r = Raphael(iv.iviewTimer[0], width, height);

				iv.R = (diameter / 2);

				var param = {
					stroke: options.timerBg,
					"stroke-width": (stroke + (padding * 2))
				},
					param2 = {
						stroke: options.timerColor,
						"stroke-width": stroke,
						"stroke-linecap": "round"
					},
					param3 = {
						fill: options.timerColor,
						stroke: 'none',
						"stroke-width": 0
					},
					bgParam = {
						fill: options.timerBg,
						stroke: 'none',
						"stroke-width": 0
					};

				// Custom Arc Attribute
				r.customAttributes.arc = function (value, R) {
					var total = 360,
						alpha = 360 / total * value,
						a = (90 - alpha) * Math.PI / 180,
						cx = ((diameter / 2) + padding + stroke),
						cy = ((diameter / 2) + padding + stroke),
						x = cx + R * Math.cos(a),
						y = cy - R * Math.sin(a),
						path;
					if (total == value) {
						path = [["M", cx, cy - R], ["A", R, R, 0, 1, 1, 299.99, cy - R]];
					} else {
						path = [["M", cx, cy - R], ["A", R, R, 0, +(alpha > 180), 1, x, y]];
					}
					return {
						path: path
					};
				};

				// Custom Segment Attribute
				r.customAttributes.segment = function (angle, R) {
					var a1 = -90;
					R = R - 1;
					angle = (a1 + angle);
					var flag = (angle - a1) > 180,
						x = ((diameter / 2) + padding),
						y = ((diameter / 2) + padding);
					a1 = (a1 % 360) * Math.PI / 180;
					angle = (angle % 360) * Math.PI / 180;
					return {
						path: [["M", x, y], ["l", R * Math.cos(a1), R * Math.sin(a1)], ["A", R, R, 0, +flag, 1, x + R * Math.cos(angle), y + R * Math.sin(angle)], ["z"]]
					};
				};

				if (iv.defs.total > 1 && iv.defs.timer == "pie") {
					r.circle(iv.R + padding, iv.R + padding, iv.R + padding - 1).attr(bgParam);
				}
				iv.timerBgPath = r.path().attr(param), iv.timerPath = r.path().attr(param2), iv.pieTimer = r.path().attr(param3);
			}

			iv.barTimer = $('div', iv.iviewTimer);

			if (iv.defs.total > 1 && iv.defs.timer == "360bar") {
				iv.timerBgPath.attr({
					arc: [359.9, iv.R]
				});
			}

			//Set Timer Styles
			if (iv.defs.timer == "bar") {
				iv.iviewTimer.css({
					opacity: options.timerOpacity,
					width: diameter,
					height: stroke,
					border: options.timerBarStroke + 'px ' + options.timerBarStrokeColor + ' ' + options.timerBarStrokeStyle,
					padding: padding,
					background: options.timerBg
				});
				iv.barTimer.css({
					width: 0,
					height: stroke,
					background: options.timerColor,
					'float': 'left'
				});
			} else {
				iv.iviewTimer.css({
					opacity: options.timerOpacity,
					width: width,
					height: height
				});
			}

			//Set Timer Position
			iv.setTimerPosition();

			// Run Preloader
			new ImagePreload(iv.defs.images, function (i) {
				var percent = (i * 10);
				preloaderBar.stop().animate({
					width: percent + '%'
				});
			}, function () {
				preloaderBar.stop().animate({
					width: '100%'
				}, function () {
					iviewPreloader.remove();
					iv.startSlider();

					//Trigger the onAfterLoad callback
					options.onAfterLoad.call(this);
				});
			});

			//Touch navigation
			iv.sliderContent.bind('swipeleft', function () {
				if (iv.defs.lock) return false;
				iv.cleanTimer();
				iv.goTo('next');
			}).bind('swiperight', function () {
				if (iv.defs.lock) return false;
				iv.cleanTimer();
				iv.defs.slide -= 2;
				iv.goTo('prev');
			});



			//Keyboard Navigation
			if (options.keyboardNav) {
				$(document).bind('keyup.iView', function (event) {
					//Left
					if (event.keyCode == '37') {
						if (iv.defs.lock) return false;
						iv.cleanTimer();
						iv.defs.slide -= 2;
						iv.goTo('prev');
					}
					//Right
					if (event.keyCode == '39') {
						if (iv.defs.lock) return false;
						iv.cleanTimer();
						iv.goTo('next');
					}
				});
			}

			//Play/Pause action
			iv.iviewTimer.live('click', function () {
				if (iv.iviewTimer.hasClass('paused')) {
					iv.playSlider();
				} else {
					iv.stopSlider();
				}
			});

			//Bind the stop action
			iv.sliderContent.bind('iView:pause', function () {
				iv.stopSlider();
			});

			//Bind the start action
			iv.sliderContent.bind('iView:play', function () {
				iv.playSlider();
			});

			//Bind the start action
			iv.sliderContent.bind('iView:previous', function () {
				if (iv.defs.lock) return false;
				iv.cleanTimer();
				iv.defs.slide -= 2;
				iv.goTo('prev');
			});

			//Bind the start action
			iv.sliderContent.bind('iView:next', function () {
				if (iv.defs.lock) return false;
				iv.cleanTimer();
				iv.goTo('next');
			});

			//Bind the goSlide action
			iv.sliderContent.bind('iView:goSlide', function (event, slide) {
				if (iv.defs.lock || iv.defs.slide == slide) return false;
				if ($(this).hasClass('active')) return false;
				iv.cleanTimer();
				iv.slider.css('background', 'url("' + iv.defs.image.data('iview:image') + '") no-repeat');
				iv.defs.slide = slide - 1;
				iv.goTo('control');
			});
			
			//Bind the resize action
			iv.sliderContent.bind('resize', function () {
				
				t = $(this),
				tW = t.width(),
				tH = t.height(),
				width = iv.slider.width(),
				height = iv.slider.height();

				if(iv.defs.width != tW){
					var ratio = (tW / width),
						newHeight = Math.round(iv.defs.height * ratio);
					iv.slider.css({
						'-webkit-transform-origin' : '0 0',
						'-moz-transform-origin' : '0 0',
						'-o-transform-origin' : '0 0',
						'-ms-transform-origin' : '0 0',
						'transform-origin' : '0 0',
						'-webkit-transform' : 'scale('+ ratio +')',
						'-moz-transform' : 'scale('+ ratio +')',
						'-o-transform' : 'scale('+ ratio +')',
						'-ms-transform' : 'scale('+ ratio +')',
						'transform' : 'scale('+ ratio +')'
					});
					t.css({ height: newHeight });
					iv.defs.width = tW;
					
					//Set Timer Position
					iv.setTimerPosition();
				}
			});
			
			//Bind video display
			$('.iview-video', iv.slider).click(function(e){
				var t = $(this),
					video = $('.iview-video-show', t);
				if(!$(e.target).hasClass('iview-video-close') && !$(e.target).hasClass('iview-caption') && !$(e.target).parents().hasClass('iview-caption')){
					video.show().animate({ top: 0 }, 1000, 'easeOutBounce');
					iv.sliderContent.trigger('iView:pause');
				}
			});
			
			//Bind the video closer
			$('.iview-video-close', iv.slider).click(function(){
				var video = $(this).parents('.iview-video-show'),
					iframe = $('iframe', video),
					src = iframe.attr('src');
				
				iframe.removeAttr('src').attr('src',src);
				
				video.animate({ top: '-' + iv.defs.height + 'px' }, 1000, 'easeOutBounce', function(){
					video.hide();
					iv.sliderContent.trigger('iView:play');
				});
			});
			
		};

	//iView helper functions
	iView.prototype = {
		timer: null,

		//Start Slider
		startSlider: function () {
			var iv = this;
			
			var img = new Image();
			img.src = iv.slides.eq(0).data('iview:image');
			imgWidth = img.width;
			if(imgWidth != iv.defs.width){
				iv.defs.width = imgWidth;
				iv.sliderContent.trigger('resize');
			}

			iv.iviewTimer.show();

			//Show slide
			iv.slides.eq(iv.defs.slide).css('display', 'block');

			//Set first background
			iv.slider.css('background', 'url("' + iv.defs.image.data('iview:image') + '") no-repeat');

			//Set initial caption
			iv.setCaption(iv.options);

			iv.iviewTimer.addClass('paused').attr('title', iv.options.playLabel);

			if (iv.options.autoAdvance && iv.defs.total > 1) {
				iv.iviewTimer.removeClass('paused').attr('title', iv.options.pauseLabel);
				iv.setTimer();
			}

			//Add Direction nav
			if (iv.options.directionNav) {
				iv.sliderContent.append('<div class="iview-directionNav"><a class="iview-prevNav" title="' + iv.options.previousLabel + '">' + iv.options.previousLabel + '</a><a class="iview-nextNav" title="' + iv.options.nextLabel + '">' + iv.options.nextLabel + '</a></div>');

				//Animate Direction nav
				$('.iview-directionNav', iv.sliderContent).css({
					opacity: iv.options.directionNavHoverOpacity
				});
				iv.sliderContent.hover(function () {
					$('.iview-directionNav', iv.sliderContent).stop().animate({
						opacity: 1
					}, 300);
				}, function () {
					$('.iview-directionNav', iv.sliderContent).stop().animate({
						opacity: iv.options.directionNavHoverOpacity
					}, 300);
				});

				$('a.iview-prevNav', iv.sliderContent).live('click', function () {
					if (iv.defs.lock) return false;
					iv.cleanTimer();
					iv.defs.slide -= 2;
					iv.goTo('prev');
				});

				$('a.iview-nextNav', iv.sliderContent).live('click', function () {
					if (iv.defs.lock) return false;
					iv.cleanTimer();
					iv.goTo('next');
				});
			}

			//Add Control nav
			if (iv.options.controlNav) {
				var iviewControl = '<div class="iview-controlNav">',
					iviewTooltip = '';
				if (!iv.options.directionNav && iv.options.controlNavNextPrev) iviewControl += '<a class="iview-controlPrevNav" title="' + iv.options.previousLabel + '">' + iv.options.previousLabel + '</a>';
				iviewControl += '<div class="iview-items"><ul>';
				for (var i = 0; i < iv.defs.total; i++) {
					var slide = iv.slides.eq(i);
					iviewControl += '<li>';
					if (iv.options.controlNavThumbs) {
						var thumb = (slide.data('iview:thumbnail')) ? slide.data('iview:thumbnail') : slide.data('iview:image');
						iviewControl += '<a class="iview-control" rel="' + i + '"><img src="' + thumb + '" /></a>';
					} else {
						var thumb = (slide.data('iview:thumbnail')) ? slide.data('iview:thumbnail') : slide.data('iview:image');
						iviewControl += '<a class="iview-control" rel="' + i + '">' + (i + 1) + '</a>';
						if (iv.options.controlNavTooltip) iviewTooltip += '<div rel="' + i + '"><img src="' + thumb + '" /></div>';
					}
					iviewControl += '</li>';
				}
				iviewControl += '</ul></div>';
				if (!iv.options.directionNav && iv.options.controlNavNextPrev) iviewControl += '<a class="iview-controlNextNav" title="' + iv.options.nextLabel + '">' + iv.options.nextLabel + '</a>';
				iviewControl += '</div>';

				if (!iv.options.controlNavThumbs && iv.options.controlNavTooltip) iviewControl += '<div id="iview-tooltip"><div class="holder"><div class="container">' + iviewTooltip + '</div></div></div>';

				iv.sliderContent.append(iviewControl);

				//Set initial active link
				$('.iview-controlNav a.iview-control:eq(' + iv.defs.slide + ')', iv.sliderContent).addClass('active');

				$('a.iview-controlPrevNav', iv.sliderContent).live('click', function () {
					if (iv.defs.lock) return false;
					iv.cleanTimer();
					iv.defs.slide -= 2;
					iv.goTo('prev');
				});

				$('a.iview-controlNextNav', iv.sliderContent).live('click', function () {
					if (iv.defs.lock) return false;
					iv.cleanTimer();
					iv.goTo('next');
				});

				$('.iview-controlNav a.iview-control', iv.sliderContent).live('click', function () {
					if (iv.defs.lock) return false;
					if ($(this).hasClass('active')) return false;
					iv.cleanTimer();
					iv.slider.css('background', 'url("' + iv.defs.image.data('iview:image') + '") no-repeat');
					iv.defs.slide = $(this).attr('rel') - 1;
					iv.goTo('control');
				});

				//Animate Control nav
				$('.iview-controlNav', iv.sliderContent).css({
					opacity: iv.options.controlNavHoverOpacity
				});
				iv.sliderContent.hover(function () {
					$('.iview-controlNav', iv.sliderContent).stop().animate({
						opacity: 1
					}, 300);
					iv.sliderContent.addClass('iview-hover');
				}, function () {
					$('.iview-controlNav', iv.sliderContent).stop().animate({
						opacity: iv.options.controlNavHoverOpacity
					}, 300);
					iv.sliderContent.removeClass('iview-hover');
				});

				//Show Tooltip
				var tooltipTimer = null;

				$('.iview-controlNav a.iview-control', iv.sliderContent).hover(function (e) {
					var t = $(this),
						i = t.attr('rel'),
						tooltip = $('#iview-tooltip', iv.sliderContent),
						holder = $('div.holder', tooltip),
						x = t.offset().left - iv.sliderContent.offset().left - (tooltip.outerWidth() / 2) + iv.options.tooltipX,
						y = t.offset().top - iv.sliderContent.offset().top - tooltip.outerHeight() + iv.options.tooltipY,
						imD = $('div[rel=' + i + ']')
						scrollLeft = (i * imD.width());

					tooltip.stop().animate({
						left: x,
						top: y,
						opacity: 1
					}, 300);
					//tooltip.css({ opacity: 1 });
					if (tooltip.not(':visible')) tooltip.fadeIn(300);
					holder.stop().animate({
						scrollLeft: scrollLeft
					}, 300);

					clearTimeout(tooltipTimer);

				}, function (e) {
					var tooltip = $('#iview-tooltip', iv.sliderContent);
					tooltipTimer = setTimeout(function () {
						tooltip.animate({
							opacity: 0
						}, 300, function () {
							tooltip.hide();
						});
					}, 200);
				});
			}

			//Bind hover setting
			iv.sliderContent.bind('mouseover.iView mousemove.iView', function () {
				//Clear the timer
				if (iv.options.pauseOnHover && !iv.defs.paused) iv.cleanTimer();

				iv.sliderContent.addClass('iview-hover');
			}).bind('mouseout.iView', function () {
				//Restart the timer
				if (iv.options.pauseOnHover && !iv.defs.paused && iv.timer == null && iv.pieDegree <= 359 && iv.options.autoAdvance) iv.setTimer();
				
				iv.sliderContent.removeClass('iview-hover');
			});
		},

		// setCaption function
		setCaption: function () {
			var iv = this,
				slide = iv.slides.eq(iv.defs.slide),
				captions = $('.iview-caption', slide),
				timeEx = 0;
			captions.each(function (i) {
				var caption = $(this),
					fx = (caption.data('transition')) ? $.trim(caption.data('transition').toLowerCase()) : "fade",
					speed = (caption.data('speed')) ? caption.data('speed') : iv.options.captionSpeed,
					easing = (caption.data('easing')) ? caption.data('easing') : iv.options.captionEasing,
					x = (caption.data('x')!="undefined") ? caption.data('x') : "center",
					y = (caption.data('y')!="undefined") ? caption.data('y') : "center",
					w = (caption.data('width')) ? caption.data('width') : caption.width(),
					h = (caption.data('height')) ? caption.data('height') : caption.height(),
					oW = caption.outerWidth(),
					oH = caption.outerHeight();
					
					if(x == "center") x = ((iv.defs.width/2) - (oW/2));
					if(y == "center") y = ((iv.defs.height/2) - (oH/2));

				var captionContain = $('.caption-contain', caption);

				caption.css({
					opacity: 0
				});
				captionContain.css({
					opacity: 0,
					position: 'relative',
					width: w,
					height: h
				});

				switch (fx) {
				case "wipedown":
					caption.css({
						top: (y - h),
						left: x
					});
					captionContain.css({
						top: (h + (h * 3)),
						left: 0
					});
					break;
				case "wipeup":
					caption.css({
						top: (y + h),
						left: x
					});
					captionContain.css({
						top: (h - (h * 3)),
						left: 0
					});
					break;
				case "wiperight":
					caption.css({
						top: y,
						left: (x - w)
					});
					captionContain.css({
						top: 0,
						left: (w + (w * 2))
					});
					break;
				case "wipeleft":
					caption.css({
						top: y,
						left: (x + w)
					});
					captionContain.css({
						top: 0,
						left: (w - (w * 2))
					});
					break;
				case "fade":
					caption.css({
						top: y,
						left: x
					});
					captionContain.css({
						top: 0,
						left: 0
					});
					break;
				case "expanddown":
					caption.css({
						top: y,
						left: x,
						height: 0
					});
					captionContain.css({
						top: (h + (h * 3)),
						left: 0
					});
					break;
				case "expandup":
					caption.css({
						top: (y + h),
						left: x,
						height: 0
					});
					captionContain.css({
						top: (h - (h * 3)),
						left: 0
					});
					break;
				case "expandright":
					caption.css({
						top: y,
						left: x,
						width: 0
					});
					captionContain.css({
						top: 0,
						left: (w + (w * 2))
					});
					break;
				case "expandleft":
					caption.css({
						top: y,
						left: (x + w),
						width: 0
					});
					captionContain.css({
						top: 0,
						left: (w - (w * 2))
					});
					break;
				}

				setTimeout(function () {
					caption.animate({
						opacity: iv.options.captionOpacity,
						top: y,
						left: x,
						width: w,
						height: h
					}, speed, easing, function () {});
				}, timeEx);
				setTimeout(function () {
					captionContain.animate({
						opacity: iv.options.captionOpacity,
						top: 0,
						left: 0
					}, speed, easing);
				}, (timeEx + 100));
				timeEx += 250;
			});
		},

		//Process the timer
		processTimer: function () {
			var iv = this;
			if (iv.defs.timer == "360bar") {
				var degree = (iv.pieDegree == 0) ? 0 : iv.pieDegree + .9;
				iv.timerPath.attr({
					arc: [degree, iv.R]
				});
			} else if (iv.defs.timer == "pie") {
				var degree = (iv.pieDegree == 0) ? 0 : iv.pieDegree + .9;
				iv.pieTimer.attr({
					segment: [degree, iv.R]
				});
			} else {
				iv.barTimer.css({
					width: ((iv.pieDegree / 360) * 100) + '%'
				});
			}
			iv.pieDegree += 3;
		},

		//When Animation finishes
		transitionEnd: function (iv) {
			//Trigger the onAfterChange callback
			iv.options.onAfterChange.call(this);

			//Lock the slider
			iv.defs.lock = false;

			//Hide slider slides
			iv.slides.css('display', 'none');

			//Diplay the current slide
			iv.slides.eq(iv.defs.slide).show();

			iv.slider.css('background', 'url("' + iv.defs.image.data('iview:image') + '") no-repeat');

			// Remove any strips and blocks from last transition
			$('.iview-strip, .iview-block', iv.slider).remove();

			//Set slide pauseTime
			iv.defs.time = (iv.defs.image.data('iview:pausetime')) ? iv.defs.image.data('iview:pausetime') : iv.options.pauseTime;

			//Process timer
			iv.iviewTimer.animate({
				opacity: iv.options.timerOpacity
			});
			iv.pieDegree = 0;
			iv.processTimer();

			//Set caption
			iv.setCaption(iv.options);

			//Restart the timer
			if (iv.timer == null && !iv.defs.paused) iv.timer = setInterval(function () {
				iv.timerCall(iv);
			}, (iv.defs.time / 120));
		},

		// Add strips
		addStrips: function (vertical, opts) {
			var iv = this;
			opts = (opts) ? opts : iv.options;
			for (var i = 0; i < opts.strips; i++) {
				var stripWidth = Math.round(iv.slider.width() / opts.strips),
					stripHeight = Math.round(iv.slider.height() / opts.strips),
					bgPosition = '-' + ((stripWidth + (i * stripWidth)) - stripWidth) + 'px 0%',
					top = ((vertical) ? (stripHeight * i) + 'px' : '0px'),
					left = ((vertical) ? '0px' : (stripWidth * i) + 'px');
				if (vertical) bgPosition = '0% -' + ((stripHeight + (i * stripHeight)) - stripHeight) + 'px';

				if (i == opts.strips - 1) {
					var width = ((vertical) ? '0px' : (iv.slider.width() - (stripWidth * i)) + 'px'),
						height = ((vertical) ? (iv.slider.height() - (stripHeight * i)) + 'px' : '0px');
				} else {
					var width = ((vertical) ? '0px' : stripWidth + 'px'),
						height = ((vertical) ? stripHeight + 'px' : '0px');
				}
				
				var strip = $('<div class="iview-strip"></div>').css({
					width: width,
					height: height,
					top: top,
					left: left,
					background: 'url("' + iv.defs.image.data('iview:image') + '") no-repeat ' + bgPosition,
					opacity: 0
				});

				iv.slider.append(strip);
			}
		},

		// Add blocks
		addBlocks: function () {
			var iv = this,
				blockWidth = Math.round(iv.slider.width() / iv.options.blockCols),
				blockHeight = Math.round(iv.slider.height() / iv.options.blockRows);

			for (var rows = 0; rows < iv.options.blockRows; rows++) {
				for (var columns = 0; columns < iv.options.blockCols; columns++) {
					var top = (rows * blockHeight) + 'px',
						left = (columns * blockWidth) + 'px',
						width = blockWidth + 'px',
						height = blockHeight + 'px',
						bgPosition = '-' + ((blockWidth + (columns * blockWidth)) - blockWidth) + 'px -' + ((blockHeight + (rows * blockHeight)) - blockHeight) + 'px';

					if (columns == iv.options.blockCols - 1) width = (iv.slider.width() - (blockWidth * columns)) + 'px';

					var block = $('<div class="iview-block"></div>').css({
						width: blockWidth + 'px',
						height: blockHeight + 'px',
						top: (rows * blockHeight) + 'px',
						left: (columns * blockWidth) + 'px',
						background: 'url("' + iv.defs.image.data('iview:image') + '") no-repeat ' + bgPosition,
						opacity: 0
					});
					
					iv.slider.append(block);
				}
			}
		},

		runTransition: function (fx) {
			var iv = this;

			switch (fx) {
			case 'strip-up-right':
			case 'strip-up-left':
				iv.addStrips();
				var timeDelay = 0;
				i = 0, strips = $('.iview-strip', iv.slider);
				if (fx == 'strip-up-left') strips = $('.iview-strip', iv.slider).reverse();

				strips.each(function () {
					var strip = $(this);
					strip.css({
						top: '',
						bottom: '0px'
					});

					setTimeout(function () {
						strip.animate({
							height: '100%',
							opacity: '1.0'
						}, iv.options.animationSpeed, iv.defs.easing, function () {
							if (i == iv.options.strips - 1) iv.transitionEnd(iv);
							i++;
						});
					}, (100 + timeDelay));

					timeDelay += 50;
				});
				break;
			case 'strip-down':
			case 'strip-down-right':
			case 'strip-down-left':
				iv.addStrips();
				var timeDelay = 0,
					i = 0,
					strips = $('.iview-strip', iv.slider);
				if (fx == 'strip-down-left') strips = $('.iview-strip', iv.slider).reverse();

				strips.each(function () {
					var strip = $(this);
					strip.css({
						bottom: '',
						top: '0px'
					});
					
					setTimeout(function () {
						strip.animate({
							height: '100%',
							opacity: '1.0'
						}, iv.options.animationSpeed, iv.defs.easing, function () {
							if (i == iv.options.strips - 1) iv.transitionEnd(iv);
							i++;
						});
					}, (100 + timeDelay));
					timeDelay += 50;
				});
				break;
			case 'strip-left-right':
			case 'strip-left-right-up':
			case 'strip-left-right-down':
				iv.addStrips(true);
				var timeDelay = 0,
					i = 0,
					v = 0,
					strips = $('.iview-strip', iv.slider);
				if (fx == 'strip-left-right-down') strips = $('.iview-strip', iv.slider).reverse();

				strips.each(function () {
					var strip = $(this);
					if (i == 0) {
						strip.css({
							right: '',
							left: '0px'
						});
						i++;
					} else {
						strip.css({
							left: '',
							right: '0px'
						});
						i = 0;
					}

					setTimeout(function () {
						strip.animate({
							width: '100%',
							opacity: '1.0'
						}, iv.options.animationSpeed, iv.defs.easing, function () {
							if (v == iv.options.strips - 1) iv.transitionEnd(iv);
							v++;
						});
					}, (100 + timeDelay));
					timeDelay += 50;
				});
				break;
			case 'strip-up-down':
			case 'strip-up-down-right':
			case 'strip-up-down-left':
				iv.addStrips();
				var timeDelay = 0,
					i = 0,
					v = 0,
					strips = $('.iview-strip', iv.slider);
				if (fx == 'strip-up-down-left') strips = $('.iview-strip', iv.slider).reverse();

				strips.each(function () {
					var strip = $(this);
					if (i == 0) {
						strip.css({
							bottom: '',
							top: '0px'
						});
						i++;
					} else {
						strip.css({
							top: '',
							bottom: '0px'
						});
						i = 0;
					}

					setTimeout(function () {
						strip.animate({
							height: '100%',
							opacity: '1.0'
						}, iv.options.animationSpeed, iv.defs.easing, function () {
							if (v == iv.options.strips - 1) iv.transitionEnd(iv);
							v++;
						});
					}, (100 + timeDelay));
					timeDelay += 50;
				});
				break;
			case 'left-curtain':
			case 'right-curtain':
			case 'top-curtain':
			case 'bottom-curtain':
				if (fx == 'left-curtain' || fx == 'right-curtain') iv.addStrips();
				else iv.addStrips(true);
				var timeDelay = 0,
					i = 0,
					strips = $('.iview-strip', iv.slider);

				if (fx == 'right-curtain' || fx == 'bottom-curtain') strips = $('.iview-strip', iv.slider).reverse();

				strips.each(function () {
					var strip = $(this);
					var width = strip.width();
					var height = strip.height();
					if (fx == 'left-curtain' || fx == 'right-curtain') strip.css({
						top: '0px',
						height: '100%',
						width: '0px'
					});
					else strip.css({
						left: '0px',
						height: '0px',
						width: '100%'
					});
					setTimeout(function () {
						if (fx == 'left-curtain' || fx == 'right-curtain') strip.animate({
							width: width,
							opacity: '1.0'
						}, iv.options.animationSpeed, iv.defs.easing, function () {
							if (i == iv.options.strips - 1) iv.transitionEnd(iv);
							i++;
						});
						else strip.animate({
							height: height,
							opacity: '1.0'
						}, iv.options.animationSpeed, iv.defs.easing, function () {
							if (i == iv.options.strips - 1) iv.transitionEnd(iv);
							i++;
						});
					}, (100 + timeDelay));
					timeDelay += 50;
				});
				break;
			case 'strip-up-right':
			case 'strip-up-left':
				iv.addStrips();
				var timeDelay = 0,
					i = 0,
					strips = $('.iview-strip', iv.slider);
				if (fx == 'strip-up-left') strips = $('.iview-strip', iv.slider).reverse();

				strips.each(function () {
					var strip = $(this);
					strip.css({
						'bottom': '0px'
					});
					setTimeout(function () {
						strip.animate({
							height: '100%',
							opacity: '1.0'
						}, iv.options.animationSpeed, iv.defs.easing, function () {
							if (i == iv.options.strips - 1) iv.transitionEnd(iv);
							i++;
						});
					}, (100 + timeDelay));
					timeDelay += 50;
				});
				break;
			case 'strip-left-fade':
			case 'strip-right-fade':
			case 'strip-top-fade':
			case 'strip-bottom-fade':
				if (fx == 'strip-left-fade' || fx == 'strip-right-fade') iv.addStrips();
				else iv.addStrips(true);
				var timeDelay = 0,
					i = 0,
					strips = $('.iview-strip', iv.slider);

				if (fx == 'strip-right-fade' || fx == 'strip-bottom-fade') strips = $('.iview-strip', iv.slider).reverse();

				strips.each(function () {
					var strip = $(this);
					var width = strip.width();
					var height = strip.height();
					if (fx == 'strip-left-fade' || fx == 'strip-right-fade') strip.css({
						top: '0px',
						height: '100%',
						width: width
					});
					else strip.css({
						left: '0px',
						height: height,
						width: '100%'
					});
					setTimeout(function () {
						strip.animate({
							opacity: '1.0'
						}, iv.options.animationSpeed * 1.7, iv.defs.easing, function () {
							if (i == iv.options.strips - 1) iv.transitionEnd(iv);
							i++;
						});
					}, (100 + timeDelay));
					timeDelay += 35;
				});
				break;
			case 'slide-in-up':
			case 'slide-in-down':
				opts = {
					strips: 1
				};
				iv.addStrips(false, opts);

				var strip = $('.iview-strip:first', iv.slider),
					top = 0;

				if (fx == 'slide-in-up') top = '-' + iv.defs.height + 'px';
				else top = iv.defs.height + 'px';

				strip.css({
					top: top,
					'height': '100%',
					'width': iv.defs.width
				});

				strip.animate({
					'top': '0px',
					opacity: 1
				}, (iv.options.animationSpeed * 2), iv.defs.easing, function () {
					iv.transitionEnd(iv);
				});
				break;
			case 'zigzag-top':
			case 'zigzag-bottom':
			case 'zigzag-grow-top':
			case 'zigzag-grow-bottom':
			case 'zigzag-drop-top':
			case 'zigzag-drop-bottom':
				iv.addBlocks();

				var totalBlocks = (iv.options.blockCols * iv.options.blockRows),
					timeDelay = 0,
					blockToArr = new Array(),
					blocks = $('.iview-block', iv.slider);

				for (var rows = 0; rows < iv.options.blockRows; rows++) {
					var odd = (rows % 2),
						start = (rows * iv.options.blockCols),
						end = ((rows + 1) * iv.options.blockCols);
					if (odd == 1) {
						for (var columns = end - 1; columns >= start; columns--) {
							blockToArr.push($(blocks[columns]));
						}
					} else {
						for (var columns = start; columns < end; columns++) {
							blockToArr.push($(blocks[columns]));
						}
					}
				}

				if (fx == 'zigzag-bottom' || fx == 'zigzag-grow-bottom' || fx == 'zigzag-drop-bottom') blockToArr.reverse();

				// Run animation
				blocks.each(function (i) {
					var block = $(blockToArr[i]),
						h = block.height(),
						w = block.width(),
						top = block.css('top');

					if (fx == 'zigzag-grow-top' || fx == 'zigzag-grow-bottom') block.width(0).height(0);
					else if (fx == 'zigzag-drop-top' || fx == 'zigzag-drop-bottom') block.css({
						top: '-=50'
					});

					setTimeout(function () {
						if (fx == 'zigzag-grow-top' || fx == 'zigzag-grow-bottom') block.animate({
							opacity: '1',
							height: h,
							width: w
						}, iv.options.animationSpeed, iv.defs.easing, function () {
							if (i == totalBlocks - 1) iv.transitionEnd(iv);
						});
						else if (fx == 'zigzag-drop-top' || fx == 'zigzag-drop-bottom') block.animate({
							top: top,
							opacity: '1'
						}, iv.options.animationSpeed, iv.defs.easing, function () {
							if (i == totalBlocks - 1) iv.transitionEnd(iv);
						});
						else block.animate({
							opacity: '1'
						}, (iv.options.animationSpeed * 2), 'easeInOutExpo', function () {
							if (i == totalBlocks - 1) iv.transitionEnd(iv);
						});
					}, (100 + timeDelay));
					timeDelay += 20;
				});
				break;
			case 'block-fade':
			case 'block-fade-reverse':
			case 'block-expand':
			case 'block-expand-reverse':
				iv.addBlocks();

				var totalBlocks = (iv.options.blockCols * iv.options.blockRows),
					i = 0,
					timeDelay = 0;

				// Split blocks into array
				var rowIndex = 0;
				var colIndex = 0;
				var blockToArr = new Array();
				blockToArr[rowIndex] = new Array();
				var blocks = $('.iview-block', iv.slider);
				if (fx == 'block-fade-reverse' || fx == 'block-expand-reverse') {
					blocks = $('.iview-block', iv.slider).reverse();
				}
				blocks.each(function () {
					blockToArr[rowIndex][colIndex] = $(this);
					colIndex++;
					if (colIndex == iv.options.blockCols) {
						rowIndex++;
						colIndex = 0;
						blockToArr[rowIndex] = new Array();
					}
				});

				// Run animation
				for (var columns = 0; columns < (iv.options.blockCols * 2); columns++) {
					var Col = columns;
					for (var rows = 0; rows < iv.options.blockRows; rows++) {
						if (Col >= 0 && Col < iv.options.blockCols) {
							(function () {
								var block = $(blockToArr[rows][Col]);
								var w = block.width();
								var h = block.height();
								if (fx == 'block-expand' || fx == 'block-expand-reverse') {
									block.width(0).height(0);
								}
								
								setTimeout(function () {
									block.animate({
										opacity: '1',
										width: w,
										height: h
									}, iv.options.animationSpeed / 1.3, iv.defs.easing, function () {
										if (i == totalBlocks - 1) iv.transitionEnd(iv);
										i++;
									});
								}, (100 + timeDelay));
								
							})();
						}
						Col--;
					}
					timeDelay += 100;
				}
				break;
			case 'block-random':
			case 'block-expand-random':
			case 'block-drop-random':
				iv.addBlocks();

				var totalBlocks = (iv.options.blockCols * iv.options.blockRows),
					timeDelay = 0;

				var blocks = iv.shuffle($('.iview-block', iv.slider));
				blocks.each(function (i) {
					var block = $(this),
						h = block.height(),
						w = block.width(),
						top = block.css('top');
					if (fx == 'block-expand-random') block.width(0).height(0);
					if (fx == 'block-drop-random') block.css({
						top: '-=50'
					});
					
					setTimeout(function () {
						block.animate({
							top: top,
							opacity: '1',
							height: h,
							width: w
						}, iv.options.animationSpeed, iv.defs.easing, function () {
							if (i == totalBlocks - 1) iv.transitionEnd(iv);
						});
					}, (100 + timeDelay));
						
					timeDelay += 20;
				});
				break;
			case 'slide-in-right':
			case 'slide-in-left':
			case 'fade':
			default:
				opts = {
					strips: 1
				};
				iv.addStrips(false, opts);

				var strip = $('.iview-strip:first', iv.slider);
				strip.css({
					'height': '100%',
					'width': iv.defs.width
				});
				if (fx == 'slide-in-right') strip.css({
					'height': '100%',
					'width': iv.defs.width,
					'left': iv.defs.width + 'px',
					'right': ''
				});
				else if (fx == 'slide-in-left') strip.css({
					'left': '-' + iv.defs.width + 'px'
				});

				strip.animate({
					left: '0px',
					opacity: 1
				}, (iv.options.animationSpeed * 2), iv.defs.easing, function () {
					iv.transitionEnd(iv);
				});
				break;
			}
		},

		// Shuffle an array
		shuffle: function (oldArray) {
			var newArray = oldArray.slice();
			var len = newArray.length;
			var i = len;
			while (i--) {
				var p = parseInt(Math.random() * len);
				var t = newArray[i];
				newArray[i] = newArray[p];
				newArray[p] = t;
			}
			return newArray;
		},

		// Timer interval caller
		timerCall: function (iv) {
			iv.processTimer();
			if (iv.pieDegree >= 360) {
				iv.cleanTimer();
				iv.goTo(false);
			}
		},

		//Set the timer function
		setTimer: function () {
			var iv = this;
			iv.timer = setInterval(function () {
				iv.timerCall(iv);
			}, (iv.defs.time / 120));
		},

		//Clean the timer function
		cleanTimer: function () {
			var iv = this;
			clearInterval(iv.timer);
			iv.timer = null;
		},


		// goTo function
		goTo: function (action) {
			var iv = this;
			//Trigger the onLastSlide callback
			if (iv.defs && (iv.defs.slide == iv.defs.total - 1)) {
				iv.options.onLastSlide.call(this);
			}

			iv.cleanTimer();

			iv.iviewTimer.animate({
				opacity: 0
			});

			//Trigger the onBeforeChange callback
			iv.options.onBeforeChange.call(this);

			//Set current background before change
			if (!action) {
				iv.slider.css('background', 'url("' + iv.defs.image.data('iview:image') + '") no-repeat');
			} else {
				if (action == 'prev' || action == 'next') {
					iv.slider.css('background', 'url("' + iv.defs.image.data('iview:image') + '") no-repeat');
				}
			}
			iv.defs.slide++;

			//Trigger the onSlideShowEnd callback
			if (iv.defs.slide == iv.defs.total) {
				iv.defs.slide = 0;
				iv.options.onSlideShowEnd.call(this);
			}
			if (iv.defs.slide < 0) iv.defs.slide = (iv.defs.total - 1);

			//Set iv.defs.image
			iv.defs.image = iv.slides.eq(iv.defs.slide);

			//Set active links
			if (iv.options.controlNav) {
				$('.iview-controlNav a.iview-control', iv.sliderContent).removeClass('active');
				$('.iview-controlNav a.iview-control:eq(' + iv.defs.slide + ')', iv.sliderContent).addClass('active');
			}

			var fx = iv.options.fx;

			//Generate random transition
			if (iv.options.fx.toLowerCase() == 'random') {
				var transitions = new Array('left-curtain', 'right-curtain', 'top-curtain', 'bottom-curtain', 'strip-down-right', 'strip-down-left', 'strip-up-right', 'strip-up-left', 'strip-up-down', 'strip-up-down-left', 'strip-left-right', 'strip-left-right-down', 'slide-in-right', 'slide-in-left', 'slide-in-up', 'slide-in-down', 'fade', 'block-random', 'block-fade', 'block-fade-reverse', 'block-expand', 'block-expand-reverse', 'block-expand-random', 'zigzag-top', 'zigzag-bottom', 'zigzag-grow-top', 'zigzag-grow-bottom', 'zigzag-drop-top', 'zigzag-drop-bottom', 'strip-left-fade', 'strip-right-fade', 'strip-top-fade', 'strip-bottom-fade', 'block-drop-random');
				fx = transitions[Math.floor(Math.random() * (transitions.length + 1))];
				if (fx == undefined) fx = 'fade';
				fx = $.trim(fx.toLowerCase());
			}

			//Run random transition from specified set (eg: effect:'strip-left-fade,right-curtain')
			if (iv.options.fx.indexOf(',') != -1) {
				var transitions = iv.options.fx.split(',');
				fx = transitions[Math.floor(Math.random() * (transitions.length))];
				if (fx == undefined) fx = 'fade';
				fx = $.trim(fx.toLowerCase());
			}

			//Custom transition as defined by "data-iview:transition" attribute
			if (iv.defs.image.data('iview:transition')) {
				var transitions = iv.defs.image.data('iview:transition').split(',');
				fx = transitions[Math.floor(Math.random() * (transitions.length))];
				fx = $.trim(fx.toLowerCase());
			}

			//Set slide easing
			iv.defs.easing = (iv.defs.image.data('iview:easing')) ? iv.defs.image.data('iview:easing') : iv.options.easing;

			//Start Transition
			iv.defs.lock = true;
			iv.runTransition(fx);
		},

		playSlider: function () {
			var iv = this;
			if (iv.timer == null && iv.defs.paused) {
				iv.iviewTimer.removeClass('paused').attr('title', iv.options.pauseLabel);
				iv.setTimer();
				iv.defs.paused = false;

				//Trigger the onPlay callback
				iv.options.onPlay.call(this);
			}
		},

		stopSlider: function () {
			var iv = this;
			iv.iviewTimer.addClass('paused').attr('title', iv.options.playLabel);
			iv.cleanTimer();
			iv.defs.paused = true;

			//Trigger the onPause callback
			iv.options.onPause.call(this);
		},

		//Set Timer Position function
		setTimerPosition: function(){
			var iv = this,
			position = iv.options.timerPosition.toLowerCase().split('-');
			for (var i = 0; i < position.length; i++) {
				if (position[i] == 'top') {
					iv.iviewTimer.css({
						top: iv.options.timerY + 'px',
						bottom: ''
					});
				} else if (position[i] == 'middle') {
					iv.iviewTimer.css({
						top: (iv.options.timerY + (iv.defs.height / 2) - (iv.options.timerDiameter / 2)) + 'px',
						bottom: ''
					});
				} else if (position[i] == 'bottom') {
					iv.iviewTimer.css({
						bottom: iv.options.timerY + 'px',
						top: ''
					});
				} else if (position[i] == 'left') {
					iv.iviewTimer.css({
						left: iv.options.timerX + 'px',
						right: ''
					});
				} else if (position[i] == 'center') {
					iv.iviewTimer.css({
						left: (iv.options.timerX + (iv.defs.width / 2) - (iv.options.timerDiameter / 2)) + 'px',
						right: ''
					});
				} else if (position[i] == 'right') {
					iv.iviewTimer.css({
						right: iv.options.timerX + 'px',
						left: ''
					});
				}
			}
		},
		
		disableSelection: function (target) {
			if (typeof target.onselectstart != "undefined") target.onselectstart = function () {
				return false;
			};
			else if (typeof target.style.MozUserSelect != "undefined") target.style.MozUserSelect = "none";
			else if (typeof target.style.webkitUserSelect != "undefined") target.style.webkitUserSelect = "none";
			else if (typeof target.style.userSelect != "undefined") target.style.userSelect = "none";
			else target.onmousedown = function () {
				return false;
			};
			target.unselectable = "on";
		},

		//touch
		isTouch: function () {
			return !!('ontouchstart' in window);
		}
	};

	//Image Preloader Function
	var ImagePreload = function (p_aImages, p_pfnPercent, p_pfnFinished) {
			this.m_pfnPercent = p_pfnPercent;
			this.m_pfnFinished = p_pfnFinished;
			this.m_nLoaded = 0;
			this.m_nProcessed = 0;
			this.m_aImages = new Array;
			this.m_nICount = p_aImages.length;
			for (var i = 0; i < p_aImages.length; i++) this.Preload(p_aImages[i])
		};

	ImagePreload.prototype = {
		Preload: function (p_oImage) {
			var oImage = new Image;
			this.m_aImages.push(oImage);
			oImage.onload = ImagePreload.prototype.OnLoad;
			oImage.onerror = ImagePreload.prototype.OnError;
			oImage.onabort = ImagePreload.prototype.OnAbort;
			oImage.oImagePreload = this;
			oImage.bLoaded = false;
			oImage.source = p_oImage;
			oImage.src = p_oImage
		},
		OnComplete: function () {
			this.m_nProcessed++;
			if (this.m_nProcessed == this.m_nICount) this.m_pfnFinished();
			else this.m_pfnPercent(Math.round((this.m_nProcessed / this.m_nICount) * 10))
		},
		OnLoad: function () {
			this.bLoaded = true;
			this.oImagePreload.m_nLoaded++;
			this.oImagePreload.OnComplete()
		},
		OnError: function () {
			this.bError = true;
			this.oImagePreload.OnComplete()
		},
		OnAbort: function () {
			this.bAbort = true;
			this.oImagePreload.OnComplete()
		}
	}



	// Begin the iView plugin
	$.fn.iView = function (options) {

		// Default options. Play carefully.
		options = jQuery.extend({
			fx: 'random',
			easing: 'easeOutQuad',
			strips: 20,
			blockCols: 10,
			blockRows: 5,
			animationSpeed: 500,
			pauseTime: 5000,
			startSlide: 0,
			directionNav: true,
			directionNavHoverOpacity: 0.6,
			controlNav: false,
			controlNavNextPrev: true,
			controlNavHoverOpacity: 0.6,
			controlNavThumbs: false,
			controlNavTooltip: true,
			captionSpeed: 500,
			captionEasing: 'easeInOutSine',
			captionOpacity: 1,
			autoAdvance: true,
			keyboardNav: true,
			touchNav: true,
			pauseOnHover: false,
			nextLabel: "Next",
			previousLabel: "Previous",
			playLabel: "Play",
			pauseLabel: "Pause",
			closeLabel: "Close",
			randomStart: false,
			timer: 'Pie',
			timerBg: '#000',
			timerColor: '#EEE',
			timerOpacity: 0.5,
			timerDiameter: 30,
			timerPadding: 4,
			timerStroke: 3,
			timerBarStroke: 1,
			timerBarStrokeColor: '#EEE',
			timerBarStrokeStyle: 'solid',
			timerPosition: 'top-right',
			timerX: 10,
			timerY: 10,
			tooltipX: 5,
			tooltipY: -5,
			onBeforeChange: function () {},
			onAfterChange: function () {},
			onAfterLoad: function () {},
			onLastSlide: function () {},
			onSlideShowEnd: function () {},
			onPause: function () {},
			onPlay: function () {}
		}, options);

		$(this).each(function () {
			var el = $(this);
			new iView(el, options);
		});

	};

	$.fn.reverse = [].reverse;

	var elems = $([]),
		jq_resize = $.resize = $.extend($.resize, {}),
		timeout_id, str_setTimeout = "setTimeout",
		str_resize = "resize",
		str_data = str_resize + "-special-event",
		str_delay = "delay",
		str_throttle = "throttleWindow";
	jq_resize[str_delay] = 250;
	jq_resize[str_throttle] = true;
	$.event.special[str_resize] = {
		setup: function () {
			if (!jq_resize[str_throttle] && this[str_setTimeout]) {
				return false
			}
			var elem = $(this);
			elems = elems.add(elem);
			$.data(this, str_data, {
				w: elem.width(),
				h: elem.height()
			});
			if (elems.length === 1) {
				loopy()
			}
		},
		teardown: function () {
			if (!jq_resize[str_throttle] && this[str_setTimeout]) {
				return false
			}
			var elem = $(this);
			elems = elems.not(elem);
			elem.removeData(str_data);
			if (!elems.length) {
				clearTimeout(timeout_id)
			}
		},
		add: function (handleObj) {
			if (!jq_resize[str_throttle] && this[str_setTimeout]) {
				return false
			}
			var old_handler;

			function new_handler(e, w, h) {
				var elem = $(this),
					data = $.data(this, str_data);
				data.w = w !== undefined ? w : elem.width();
				data.h = h !== undefined ? h : elem.height();
				old_handler.apply(this, arguments)
			}
			if ($.isFunction(handleObj)) {
				old_handler = handleObj;
				return new_handler
			} else {
				old_handler = handleObj.handler;
				handleObj.handler = new_handler
			}
		}
	};

	function loopy() {
		timeout_id = window[str_setTimeout](function () {
			elems.each(function () {
				var elem = $(this),
					width = elem.width(),
					height = elem.height(),
					data = $.data(this, str_data);
				if (width !== data.w || height !== data.h) {
					elem.trigger(str_resize, [data.w = width, data.h = height])
				}
			});
			loopy()
		}, jq_resize[str_delay])
	}


	var supportTouch = !! ('ontouchstart' in window),
		touchStartEvent = supportTouch ? "touchstart" : "mousedown",
		touchStopEvent = supportTouch ? "touchend" : "mouseup",
		touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
	// also handles swipeleft, swiperight
	$.event.special.swipe = {
		scrollSupressionThreshold: 10, // More than this horizontal displacement, and we will suppress scrolling.

		durationThreshold: 1000, // More time than this, and it isn't a swipe.

		horizontalDistanceThreshold: 30, // Swipe horizontal displacement must be more than this.

		verticalDistanceThreshold: 75, // Swipe vertical displacement must be less than this.

		setup: function () {
			var thisObject = this,
				$this = $(thisObject);

			$this.bind(touchStartEvent, function (event) {
				var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event,
					start = {
						time: (new Date()).getTime(),
						coords: [data.pageX, data.pageY],
						origin: $(event.target)
					},
					stop;

				function moveHandler(event) {

					if (!start) {
						return;
					}

					var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;

					stop = {
						time: (new Date()).getTime(),
						coords: [data.pageX, data.pageY]
					};

					// prevent scrolling
					if (Math.abs(start.coords[0] - stop.coords[0]) > $.event.special.swipe.scrollSupressionThreshold) {
						event.preventDefault();
					}
				}

				$this.bind(touchMoveEvent, moveHandler).one(touchStopEvent, function (event) {
					$this.unbind(touchMoveEvent, moveHandler);

					if (start && stop) {
						if (stop.time - start.time < $.event.special.swipe.durationThreshold && Math.abs(start.coords[0] - stop.coords[0]) > $.event.special.swipe.horizontalDistanceThreshold && Math.abs(start.coords[1] - stop.coords[1]) < $.event.special.swipe.verticalDistanceThreshold) {

							start.origin.trigger("swipe").trigger(start.coords[0] > stop.coords[0] ? "swipeleft" : "swiperight");
						}
					}
					start = stop = undefined;
				});
			});
		}
	};


	$.each({
		swipeleft: "swipe",
		swiperight: "swipe"
	}, function (event, sourceEvent) {

		$.event.special[event] = {
			setup: function () {
				$(this).bind(sourceEvent, $.noop);
			}
		};
	});

})(jQuery, this);