/**
 * jQuery Skitter Slideshow
 * @name jquery.skitter.js
 * @description Slideshow
 * @author Thiago Silva Ferreira - http://thiagosf.net
 * @version 4.0
 * @date August 04, 2010
 * @update April 19, 2012
 * @copyright (c) 2010 Thiago Silva Ferreira - http://thiagosf.net
 * @license Dual licensed under the MIT or GPL Version 2 licenses
 * @example http://thiagosf.net/projects/jquery/skitter/
 */

(function($) {
	
	var number_skitter = 0,
		skitters = [];
	
	$.fn.skitter = function(options) {
		return this.each(function() {
			$(this).data('skitter_number', number_skitter);
			skitters.push(new $sk(this, options, number_skitter));
			++number_skitter;
		});
	};
	
	var defaults = {
		velocity: 				1,
		interval: 				2500, 
		animation: 				'',
		numbers: 				true,
		navigation:			 	true,
		label:					true,
		easing_default: 		'',
		box_skitter: 			null,
		time_interval: 			null,
		images_links: 			null,
		image_atual: 			null,
		link_atual: 			null,
		label_atual: 			null,
		target_atual: 			'_self',
		width_skitter: 			null,
		height_skitter: 		null,
		image_i: 				1,
		is_animating:  			false,
		is_hover_box_skitter: 	false,
		random_ia: 				null,
		show_randomly: 			false,
		thumbs: 				false,
		animateNumberOut: 		{backgroundColor:'#333', color:'#fff'},
		animateNumberOver: 		{backgroundColor:'#fff', color:'#000'},
		animateNumberActive: 	{backgroundColor:'#cc3333', color:'#fff'},
		hideTools: 				false,
		fullscreen: 			false,
		xml: 					false,
		dots: 					false,
		width_label: 			null,
		opacity_elements:		0.75, // Final opacity of elements in hideTools
		interval_in_elements:	300, // Interval animation hover elements hideTools
		interval_out_elements:	500, // Interval animation out elements hideTools
		onLoad:					null,
		imageSwitched:			null,
		max_number_height: 		20,
		numbers_align:			'left',
		preview:				false,
		focus:					false,
		foucs_active:			false,
		focus_position:			'center',
		controls:				false,
		controls_position:		'center',
		progressbar:			false,
		progressbar_css:		{},
		is_paused:				false,
		is_blur:				false,
		is_paused_time:			false,
		timeStart:				0,
		elapsedTime:			0,
		stop_over:				true,
		enable_navigation_keys:	false,
		with_animations:		[],
		mouseOverButton: 		function() { $(this).stop().animate({opacity:0.5}, 200); }, 
		mouseOutButton: 		function() { $(this).stop().animate({opacity:1}, 200); }, 
		auto_play: 				true, 
		structure: 	 			  '<a href="#" class="prev_button">prev</a>'
								+ '<a href="#" class="next_button">next</a>'
								+ '<span class="info_slide"></span>'
								+ '<div class="container_skitter">'
									+ '<div class="image">'
										+ '<a href=""><img class="image_main" /></a>'
										+ '<div class="label_skitter"></div>'
									+ '</div>'
								+ '</div>'
		
	};
	
	$.skitter = function(obj, options, number) {
		this.box_skitter = $(obj);
		this.timer = null;
		this.settings = $.extend({}, defaults, options || {});
		this.number_skitter = number;
		this.setup();
	};
	
	// Shortcut
	var $sk = $.skitter;
	
	$sk.fn = $sk.prototype = {};
	
	$sk.fn.extend = $.extend;
	
	$sk.fn.extend({
		
		/**
		 * Init
		 */
		setup: function() 
		{
			var self = this;

			// Fullscreen
			if (this.settings.fullscreen) {
				var width = $(window).width();
				var height = $(window).height();
				this.box_skitter.width(width).height(height);
				this.box_skitter.css({'position':'absolute', 'top':0, 'left':0, 'z-index':1000});
				this.settings.stop_over = false;
				$('body').css({'overflown':'hidden'});
			}
			
			this.settings.width_skitter 	= parseFloat(this.box_skitter.css('width'));
			this.settings.height_skitter 	= parseFloat(this.box_skitter.css('height'));
			
			if (!this.settings.width_skitter || !this.settings.height_skitter) {
				console.warn('Width or height size is null! - Skitter Slideshow');
				return false;
			}
			
			// Structure html
			this.box_skitter.append(this.settings.structure);
			
			// Settings
			this.settings.easing_default 	= this.getEasing(this.settings.easing);
						
			if (this.settings.velocity >= 2) this.settings.velocity = 1.3;
			if (this.settings.velocity <= 0) this.settings.velocity = 1;
			
			this.box_skitter.find('.info_slide').hide();
			this.box_skitter.find('.label_skitter').hide();
			this.box_skitter.find('.prev_button').hide();
			this.box_skitter.find('.next_button').hide();
						
			this.box_skitter.find('.container_skitter').width(this.settings.width_skitter);
			this.box_skitter.find('.container_skitter').height(this.settings.height_skitter);
			
			var width_label = this.settings.width_label ? this.settings.width_label : this.settings.width_skitter;
			this.box_skitter.find('.label_skitter').width(width_label);
			
			var initial_select_class = ' image_number_select', u = 0;
			this.settings.images_links = new Array();
			
			// Add image, link, animation type and label
			var addImageLink = function (link, src, animation_type, label, target) {
				self.settings.images_links.push([src, link, animation_type, label, target]);
				if (self.settings.thumbs) {
					var dimension_thumb = '';
					if (self.settings.width_skitter > self.settings.height_skitter) {
						dimension_thumb = 'height="100"';
					} 
					else {
						dimension_thumb = 'width="100"';
					}
					self.box_skitter.find('.info_slide').append(
						'<span class="image_number'+initial_select_class+'" rel="'+(u - 1)+'" id="image_n_'+u+'_'+self.number_skitter+'">'
							+'<img src="'+src+'" '+dimension_thumb+' />'
							+'</span> '
					);
				}
				else {
					self.box_skitter.find('.info_slide').append(
						'<span class="image_number'+initial_select_class+'" rel="'+(u - 1)+'" id="image_n_'+u+'_'+self.number_skitter+'">'+u+'</span> '
					);
				}
				initial_select_class = '';
			};

			// Load from XML
			if (this.settings.xml) {
				$.ajax({
					type: 'GET',
					url: this.settings.xml,
					async: false,
					dataType: 'xml',
					success: function(xml) {
						var ul = $('<ul></ul>');
						$(xml).find('skitter slide').each(function(){
							++u;
							var link 			= ($(this).find('link').text()) ? $(this).find('link').text() : '#';
							var src 			= $(this).find('image').text();
							var animation_type 	= $(this).find('image').attr('type');
							var label 			= $(this).find('label').text();
							var target 			= ($(this).find('target').text()) ? $(this).find('target').text() : '_self';
							addImageLink(link, src, animation_type, label, target);
						});
					}
				});
			}
			// Load from json
			else if (this.settings.json) {
				
			}
			// Load from HTML
			else {
				this.box_skitter.find('ul li').each(function(){
					++u;
					var link 			= ($(this).find('a').length) ? $(this).find('a').attr('href') : '#';
					var src 			= $(this).find('img').attr('src');
					var animation_type 	= $(this).find('img').attr('class');
					var label 			= $(this).find('.label_text').html();
					var target 			= ($(this).find('a').length && $(this).find('a').attr('target')) ? $(this).find('a').attr('target') : '_self';
					addImageLink(link, src, animation_type, label, target);
				});
			}
			
			// Thumbs
			if (self.settings.thumbs && !self.settings.fullscreen) 
			{
				// New animation
				self.settings.animateNumberOut = {opacity:0.3};
				self.settings.animateNumberOver = {opacity:0.5};
				self.settings.animateNumberActive = {opacity:1};
				
				self.box_skitter.find('.info_slide').addClass('info_slide_thumb');
				var width_info_slide = (u + 1) * self.box_skitter.find('.info_slide_thumb .image_number').width();
				self.box_skitter.find('.info_slide_thumb').width(width_info_slide);
				self.box_skitter.css({height:self.box_skitter.height() + self.box_skitter.find('.info_slide').height()});
				
				self.box_skitter.append('<div class="container_thumbs"></div>');
				var copy_info_slide = self.box_skitter.find('.info_slide').clone();
				self.box_skitter.find('.info_slide').remove();
				self.box_skitter.find('.container_thumbs')
					.width(self.settings.width_skitter)
					.append(copy_info_slide);
				
				// Scrolling with mouse movement
				var width_image = 0, 
					width_skitter = this.settings.width_skitter,
					height_skitter = this.settings.height_skitter, 
					w_info_slide_thumb = 0,
					info_slide_thumb = self.box_skitter.find('.info_slide_thumb'),
					x_value = 0,
					y_value = self.box_skitter.offset().top;
					
				info_slide_thumb.find('.image_number').each(function(){
					width_image += $(this).outerWidth();
				});
				
				info_slide_thumb.width(width_image+'px');
				w_info_slide_thumb = info_slide_thumb.width();
				width_value = this.settings.width_skitter;
				
				width_value = width_skitter - 100;
				
				if (width_info_slide > self.settings.width_skitter) {
					self.box_skitter.mousemove(function(e){
						x_value = self.box_skitter.offset().left + 90;
						
						var x = e.pageX, y = e.pageY, new_x = 0;
						
						x = x - x_value;
						y = y - y_value;
						novo_width = w_info_slide_thumb - width_value;
						new_x = -((novo_width * x) / width_value);
						
						if (new_x > 0) new_x = 0;
						if (new_x < -(w_info_slide_thumb - width_skitter)) new_x = -(w_info_slide_thumb - width_skitter);
						
						if (y > height_skitter) {
							info_slide_thumb.css({left: new_x});
						}
					});
				}
				
				self.box_skitter.find('.scroll_thumbs').css({'left':10});
				
				if (width_info_slide < self.settings.width_skitter) {
					self.box_skitter.find('.info_slide').width('auto');
					self.box_skitter.find('.box_scroll_thumbs').hide();
					
					var class_info = '.info_slide';
					switch (self.settings.numbers_align) {
						case 'center' : 
							var _vleft = (self.settings.width_skitter - self.box_skitter.find(class_info).width()) / 2;
							self.box_skitter.find(class_info).css({'left':_vleft});
							break;
							
						case 'right' : 
							self.box_skitter.find(class_info).css({'left':'auto', 'right':'-5px'});
							break;
							
						case 'left' : 
							self.box_skitter.find(class_info).css({'left':'0px'});
							break;
					}
				}
				
			}
			else 
			{
				var class_info = '.info_slide';
				
				if (self.settings.dots) {
					self.box_skitter.find('.info_slide').addClass('info_slide_dots').removeClass('info_slide');
					class_info = '.info_slide_dots';
				}
				
				switch (self.settings.numbers_align) {
					case 'center' : 
						var _vleft = (self.settings.width_skitter - self.box_skitter.find(class_info).width()) / 2;
						self.box_skitter.find(class_info).css({'left':_vleft});
						break;
						
					case 'right' : 
						self.box_skitter.find(class_info).css({'left':'auto', 'right':'15px'});
						break;
						
					case 'left' : 
						self.box_skitter.find(class_info).css({'left':'15px'});
						break;
				}
				
				if (!self.settings.dots) {
					if (self.box_skitter.find('.info_slide').height() > 20) {
						self.box_skitter.find('.info_slide').hide();
					}
				}
			}
			
			this.box_skitter.find('ul').hide();
			
			if (this.settings.show_randomly)
			this.settings.images_links.sort(function(a,b) {return Math.random() - 0.5;});
			
			this.settings.image_atual 	= this.settings.images_links[0][0];
			this.settings.link_atual 	= this.settings.images_links[0][1];
			this.settings.label_atual 	= this.settings.images_links[0][3];
			this.settings.target_atual 	= this.settings.images_links[0][4];
			
			if (this.settings.images_links.length > 1) 
			{
				this.box_skitter.find('.prev_button').click(function() {
					if (self.settings.is_animating == false) {
						
						self.settings.image_i -= 2;
						
						if (self.settings.image_i == -2) {
							self.settings.image_i = self.settings.images_links.length - 2;
						} 
						else if (self.settings.image_i == -1) {
							self.settings.image_i = self.settings.images_links.length - 1;
						}
						
						self.jumpToImage(self.settings.image_i);
					}
					return false;
				});
				
				this.box_skitter.find('.next_button').click(function() {
					self.jumpToImage(self.settings.image_i);
					return false;
				});
				
				self.box_skitter.find('.next_button, .prev_button').bind('mouseover', self.settings.mouseOverButton);
				self.box_skitter.find('.next_button, .prev_button').bind('mouseleave', self.settings.mouseOutButton);
				
				this.box_skitter.find('.image_number').hover(function() {
					if ($(this).attr('class') != 'image_number image_number_select') {
						$(this).stop().animate(self.settings.animateNumberOver, 300);
					}
				}, function(){
					if ($(this).attr('class') != 'image_number image_number_select') {
						$(this).stop().animate(self.settings.animateNumberOut, 500);
					}
				});
				
				this.box_skitter.find('.image_number').click(function(){
					if ($(this).attr('class') != 'image_number image_number_select') {
					    var imageNumber = parseInt($(this).attr('rel'));
						self.jumpToImage(imageNumber);
					}
					return false;
				});
				
				this.box_skitter.find('.image_number').css(self.settings.animateNumberOut);
				this.box_skitter.find('.image_number:eq(0)').css(self.settings.animateNumberActive);
				
				// Preview with dots
				if (self.settings.preview && self.settings.dots) 
				{
					var preview = $('<div class="preview_slide"><ul></ul></div>');
					
					for (var i = 0; i < this.settings.images_links.length; i++) {
						var li = $('<li></li>');
						var img = $('<img />');
						img.attr('src', this.settings.images_links[i][0]);
						li.append(img);
						preview.find('ul').append(li);
					}
					
					var width_preview_ul = parseInt(this.settings.images_links.length * 100);
					preview.find('ul').width(width_preview_ul);
					$(class_info).append(preview);
					
					self.box_skitter.find(class_info).find('.image_number').mouseenter(function() {
						var _left_info = parseFloat(self.box_skitter.find(class_info).offset().left);
						var _left_image = parseFloat($(this).offset().left);
						var _left_preview = (_left_image - _left_info) - 43;
						
						var rel = parseInt($(this).attr('rel'));
						var image_current_preview = self.box_skitter.find('.preview_slide_current img').attr('src');
						var _left_ul = -(rel * 100);
						
						self.box_skitter.find('.preview_slide').find('ul').animate({left: _left_ul}, {duration:200, queue: false, easing: 'easeOutSine'});
						self.box_skitter.find('.preview_slide').fadeTo(1,1).animate({left: _left_preview}, {duration:200, queue: false});
					});
					
					self.box_skitter.find(class_info).mouseleave(function() {
						$('.preview_slide').animate({opacity: 'hide'}, {duration: 200, queue: false});
					});
				}
			}
			
			// Focus
			if (self.settings.focus) {
				self.focusSkitter();
			}
			
			// Constrols
			if (self.settings.controls) {
				self.setControls();
			}
			
			// Progressbar
			if (self.settings.progressbar && self.settings.auto_play) {
				self.addProgressBar();
			}

			// hideTools
			if (self.settings.hideTools) {
				self.hideTools();
			}

			// Navigation keys
			if (self.settings.enable_navigation_keys) {
				self.enableNavigationKeys();
			}
			
			this.loadImages();
		},
		
		/**
		 * Load images
		 */
		loadImages: function () 
		{
			var self = this;
			
			var loading = $('<div class="loading">Loading</div>');
			this.box_skitter.append(loading);
			var total = this.settings.images_links.length;
			
			var u = 0;
			$.each(this.settings.images_links, function(i)
			{
				var self_il = this;
				var loading = $('<span class="image_loading"></span>');
				loading.css({position:'absolute', top:'-9999em'});
				self.box_skitter.append(loading);
				var img = new Image();
				
				$(img).load(function () {
					++u;
					if (u == total) {
						self.box_skitter.find('.loading').remove();
						self.box_skitter.find('.image_loading').remove();
						self.start();
					}
				}).error(function () {
					self.box_skitter.find('.loading, .image_loading, .image_number, .next_button, .prev_button').remove();
					self.box_skitter.html('<p style="color:white;background:black;">Error loading images. One or more images were not found.</p>');
				}).attr('src', self_il[0]);
			});
		}, 
		
		/**
		 * Start skitter
		 */
		start: function()
		{
			var self = this;
			var init_pause = false;

			if (this.settings.numbers || this.settings.thumbs) this.box_skitter.find('.info_slide').fadeIn(500);
			if (this.settings.dots) this.box_skitter.find('.info_slide_dots').fadeIn(500);
			if (this.settings.label) this.box_skitter.find('.label_skitter').show();
			if (this.settings.navigation) {
				this.box_skitter.find('.prev_button').fadeIn(500);
				this.box_skitter.find('.next_button').fadeIn(500);
			}
			
			if (self.settings.auto_play) {
				self.startTime();
			}

			self.windowFocusOut();
			self.setLinkAtual();
			
			self.box_skitter.find('.image a img').attr({'src': self.settings.image_atual});
			img_link = self.box_skitter.find('.image a');
			img_link = self.resizeImage(img_link);
			img_link.find('img').fadeIn(1500);
			
			self.setValueBoxText();
			self.showBoxText();
			
			if (self.settings.auto_play) {
				self.stopOnMouseOver();
			}

			var mouseOverInit = function() {
				if (self.settings.stop_over) {
					init_pause = true;
					self.settings.is_hover_box_skitter = true;
					self.clearTimer(true);
					self.pauseProgressBar();
				}
			};

			self.box_skitter.mouseover(mouseOverInit);
			self.box_skitter.find('.next_button').mouseover(mouseOverInit);
			
			if (self.settings.images_links.length > 1 && !init_pause) {
				if (self.settings.auto_play) {
					self.timer = setTimeout(function() { self.nextImage(); }, self.settings.interval);
				}
			} 
			else {
				self.box_skitter.find('.loading, .image_loading, .image_number, .next_button, .prev_button').remove();
			}
			
			if ($.isFunction(self.settings.onLoad)) self.settings.onLoad(self);
		},
		
		/**
		 * Jump to image
		 */
		jumpToImage: function(imageNumber) 
		{
			if (this.settings.is_animating == false) {
				this.settings.elapsedTime = 0;
				this.box_skitter.find('.box_clone').stop();
				this.clearTimer(true);
				this.settings.image_i = Math.floor(imageNumber);
				
				this.box_skitter.find('.image a').attr({'href': this.settings.link_atual});
				this.box_skitter.find('.image_main').attr({'src': this.settings.image_atual});
				this.box_skitter.find('.box_clone').remove();
				
				this.nextImage();
			}
		},
		
		/**
		 * Next image
		 */
		nextImage: function() 
		{
			var self = this;
			
			animations_functions = [
				'cube', 
				'cubeRandom', 
				'block', 
				'cubeStop', 
				'cubeStopRandom', 
				'cubeHide', 
				'cubeSize', 
				'horizontal', 
				'showBars', 
				'showBarsRandom', 
				'tube',
				'fade',
				'fadeFour',
				'paralell',
				'blind',
				'blindHeight',
				'blindWidth',
				'directionTop',
				'directionBottom',
				'directionRight',
				'directionLeft',
				'cubeSpread',
				'glassCube',
				'glassBlock',
				'circles',
				'circlesInside',
				'circlesRotate',
				'cubeShow',
				'upBars', 
				'downBars', 
				'hideBars', 
				'swapBars', 
				'swapBarsBack', 
				'swapBlocks',
				'cut'
			];
						
			if (self.settings.progressbar) self.hideProgressBar();
			
			animation_type = (this.settings.animation == '' && this.settings.images_links[this.settings.image_i][2]) ? 
				this.settings.images_links[this.settings.image_i][2] : (this.settings.animation == '' ? 'default' : this.settings.animation);
			
			// RandomUnique
			if (animation_type == 'randomSmart') 
			{
				if (!this.settings.random_ia) {
					animations_functions.sort(function() {
						return 0.5 - Math.random();
					});
					this.settings.random_ia = animations_functions;
				}
				animation_type = this.settings.random_ia[this.settings.image_i];
			}
			// Random
			else if (animation_type == 'random') 
			{
				var random_id = parseInt(Math.random() * animations_functions.length);
				animation_type = animations_functions[random_id];
			}
			// Specific animations
			else if (self.settings.with_animations.length > 0)
			{
				var total_with_animations = self.settings.with_animations.length;
				if (this.settings._i_animation == undefined) {
					this.settings._i_animation = 0;
				}
				animation_type = self.settings.with_animations[this.settings._i_animation];
				++this.settings._i_animation;
				if (this.settings._i_animation >= total_with_animations) this.settings._i_animation = 0;
			}
			
			switch (animation_type) 
			{
				case 'cube' : 
					this.animationCube();
					break;
				case 'cubeRandom' : 
					this.animationCube({random:true});
					break;
				case 'block' : 
					this.animationBlock();
					break;
				case 'cubeStop' : 
					this.animationCubeStop();
					break;
				case 'cubeStopRandom' : 
					this.animationCubeStop({random:true});
					break;
				case 'cubeHide' : 
					this.animationCubeHide();
					break;
				case 'cubeSize' : 
					this.animationCubeSize();
					break;
				case 'horizontal' : 
					this.animationHorizontal();
					break;
				case 'showBars' : 
					this.animationShowBars();
					break;
				case 'showBarsRandom' : 
					this.animationShowBars({random:true});
					break;
				case 'tube' : 
					this.animationTube();
					break;
				case 'fade' : 
					this.animationFade();
					break;
				case 'fadeFour' : 
					this.animationFadeFour();
					break;
				case 'paralell' : 
					this.animationParalell();
					break;
				case 'blind' : 
					this.animationBlind();
					break;
				case 'blindHeight' : 
					this.animationBlindDimension({height:true});
					break;
				case 'blindWidth' : 
					this.animationBlindDimension({height:false, time_animate:400, delay:50});
					break;
				case 'directionTop' : 
					this.animationDirection({direction:'top'});
					break;
				case 'directionBottom' : 
					this.animationDirection({direction:'bottom'});
					break;
				case 'directionRight' : 
					this.animationDirection({direction:'right', total:5});
					break;
				case 'directionLeft' : 
					this.animationDirection({direction:'left', total:5});
					break;
				case 'cubeSpread' : 
					this.animationCubeSpread();
					break;
				case 'cubeJelly' : 
					this.animationCubeJelly();
					break;
				case 'glassCube' : 
					this.animationGlassCube();
					break;
				case 'glassBlock' : 
					this.animationGlassBlock();
					break;
				case 'circles' : 
					this.animationCircles();
					break;
				case 'circlesInside' : 
					this.animationCirclesInside();
					break;
				case 'circlesRotate' : 
					this.animationCirclesRotate();
					break;
				case 'cubeShow' : 
					this.animationCubeShow();
					break;
				case 'upBars' : 
					this.animationDirectionBars({direction: 'top'});
					break;
				case 'downBars' : 
					this.animationDirectionBars({direction: 'bottom'});
					break;
				case 'hideBars' : 
					this.animationHideBars();
					break;
				case 'swapBars' : 
					this.animationSwapBars();
					break;
				case 'swapBarsBack' : 
					this.animationSwapBars({easing: 'easeOutBack'});
					break;
				case 'swapBlocks' : 
					this.animationSwapBlocks();
					break;
				case 'cut' : 
					this.animationCut();
					break;
				default : 
					this.animationTube();
					break;
			}
		},
		
		animationCube: function (options)
		{
			var self = this;
			
			var options = $.extend({}, {random: false}, options || {});
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeOutExpo' : this.settings.easing_default;
			var time_animate = 700 / this.settings.velocity;
			
			this.setActualLevel();
			
			var division_w 	= Math.ceil(this.settings.width_skitter / (this.settings.width_skitter / 8));
			var division_h 	= Math.ceil(this.settings.height_skitter / (this.settings.height_skitter / 3));
			var total		= division_w * division_h;
			
			var width_box 	= Math.ceil(this.settings.width_skitter / division_w);
			var height_box 	= Math.ceil(this.settings.height_skitter / division_h);
			
			var init_top 	= this.settings.height_skitter + 200;
			var init_left 	= this.settings.height_skitter + 200;
			
			var col_t = 0;
			var col = 0;
			
			for (i = 0; i < total; i++) {
				
				init_top 			= (i % 2 == 0) ? init_top : -init_top;
				init_left 			= (i % 2 == 0) ? init_left : -init_left;

				var _vtop 			= init_top + (height_box * col_t) + (col_t * 150);
				var _vleft 			= -self.settings.width_skitter;
				//var _vleft 			= (init_left + (width_box * col)) + (col * 50);
				
				var _vtop_image 	= -(height_box * col_t);
				
				var _vleft_image 	= -(width_box * col);
				var _btop 			= (height_box * col_t);
				var _bleft 			= (width_box * col);
				
				var box_clone 		= this.getBoxClone();
				box_clone.hide();
				
				var delay_time = 50 * (i);
				
				if (options.random) {
					delay_time = 40 * (col);
					box_clone.css({left:_vleft+'px', top:_vtop+'px', width:width_box, height:height_box});
				} 
				else {
					time_animate = 500;
					//box_clone.css({left:(this.settings.width_skitter / 2), top:this.settings.height_skitter + 50, width:width_box, height:height_box});
					box_clone.css({left:(this.settings.width_skitter) + (width_box * i), top:this.settings.height_skitter + (height_box * i), width:width_box, height:height_box});
				}
				
				//box_clone.find('img').css({left:_vleft_image, top:_vtop_image});
				//box_clone.find('img').css({left:_vleft_image+100, top:_vtop_image});
				
				this.addBoxClone(box_clone);
				
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				box_clone.show().delay(delay_time).animate({top:_btop+'px', left:_bleft+'px'}, time_animate, easing, callback);
				
				if (options.random) {
					box_clone.find('img').css({left:_vleft_image+100, top:_vtop_image+50});
					box_clone.find('img').delay(delay_time+(time_animate/2)).animate({left:_vleft_image, top:_vtop_image}, 1000, 'easeOutBack');
				}
				else {
					box_clone.find('img').css({left:_vleft_image, top:_vtop_image});
					box_clone.find('img').delay(delay_time+(time_animate/2)).fadeTo(100, 0.5).fadeTo(300, 1);
				}
				
				col_t++;
				if (col_t == division_h) {
					col_t = 0;
					col++;
				}
			}
		},
		
		animationBlock: function(options)
		{
			var self = this;
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeOutQuad' : this.settings.easing_default;
			var time_animate = 500 / this.settings.velocity;
			
			this.setActualLevel();
			
			var total 		= Math.ceil(this.settings.width_skitter / (this.settings.width_skitter / 15));
			var width_box 	= Math.ceil(this.settings.width_skitter / total);
			var height_box 	= (this.settings.height_skitter);
			
			for (i = 0; i < total; i++) {
				
				var _bleft = (width_box * (i));
				var _btop = 0;
				
				var box_clone = this.getBoxClone();
				box_clone.css({left: this.settings.width_skitter + 100, top:0, width:width_box, height:height_box});
				box_clone.find('img').css({left:-(width_box * i)});
				
				this.addBoxClone(box_clone);
				
				var delay_time = 80 * (i);
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				//box_clone.delay(delay_time).animate({top:_btop, left:_bleft, opacity:'show'}, time_animate, easing, callback);
				
				box_clone.show().delay(delay_time).animate({top:_btop, left:_bleft}, time_animate, easing);
				box_clone.find('img').hide().delay(delay_time+100).animate({opacity:'show'}, time_animate+300, easing, callback);
			}
			
		},
		
		animationCubeStop: function(options)
		{
			var self = this;

			var options = $.extend({}, {random: false}, options || {});

			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeInQuad' : this.settings.easing_default;
			var time_animate = 300 / this.settings.velocity;

			var image_old = this.box_skitter.find('.image_main').attr('src');

			this.setActualLevel();

			this.setLinkAtual();
			this.box_skitter.find('.image_main').attr({'src':this.settings.image_atual});

			var division_w = Math.ceil(this.settings.width_skitter / (this.settings.width_skitter / 8));
			var division_h = Math.ceil(this.settings.height_skitter / (this.settings.width_skitter / 8));
			var total = division_w * division_h;

			var width_box = Math.ceil(this.settings.width_skitter / division_w);
			var height_box = Math.ceil(this.settings.height_skitter / division_h);

			var init_top = 0;
			var init_left = 0;

			var col_t = 0;
			var col = 0;
			var _ftop = this.settings.width_skitter / 16;

			for (i = 0; i < total; i++) {
				init_top = (i % 2 == 0) ? init_top : -init_top;
				init_left = (i % 2 == 0) ? init_left : -init_left;

				var _vtop = init_top + (height_box * col_t);
				var _vleft = (init_left + (width_box * col));
				var _vtop_image = -(height_box * col_t);

				var _vleft_image = -(width_box * col);
				var _btop = _vtop - _ftop;
				var _bleft = _vleft - _ftop;

				var box_clone = this.getBoxCloneImgOld(image_old);
				box_clone.css({left:_vleft+'px', top:_vtop+'px', width:width_box, height:height_box});
				box_clone.find('img').css({left:_vleft_image, top:_vtop_image});

				this.addBoxClone(box_clone);
				box_clone.show();

				var delay_time = 50 * i;

				if (options.random) {
					time_animate = (400 * (self.getRandom(2) + 1)) / this.settings.velocity;
					_btop = _vtop;
					_bleft = _vleft;
					delay_time = Math.ceil( 30 * self.getRandom(30) );
				}
				
				if (options.random && i == (total - 1)) {
					time_animate = 400 * 3;
					delay_time = 30 * 30;
				}

				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				box_clone.delay(delay_time).animate({opacity:'hide', top:_btop+'px', left:_bleft+'px'}, time_animate, easing, callback);

				col_t++;
				if (col_t == division_h) {
					col_t = 0;
					col++;
				}
			}
		},
		
		animationCubeHide: function(options)
		{
			var self = this;
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeOutQuad' : this.settings.easing_default;
			var time_animate = 500 / this.settings.velocity;
			
			var image_old = this.box_skitter.find('.image_main').attr('src');
			
			this.setActualLevel();
			
			this.setLinkAtual();
			this.box_skitter.find('.image_main').attr({'src':this.settings.image_atual});
			
			var division_w 	= Math.ceil(this.settings.width_skitter / (this.settings.width_skitter / 8));
			var division_h 	= Math.ceil(this.settings.height_skitter / (this.settings.height_skitter / 3));
			var total		= division_w * division_h;
			
			var width_box 	= Math.ceil(this.settings.width_skitter / division_w);
			var height_box 	= Math.ceil(this.settings.height_skitter / division_h);
			
			var init_top 	= 0;
			var init_left 	= 0;
			
			var col_t 		= 0;
			var col 		= 0;
			
			for (i = 0; i < total; i++) {
				
				init_top 			= (i % 2 == 0) ? init_top : -init_top;
				init_left 			= (i % 2 == 0) ? init_left : -init_left;

				var _vtop 			= init_top + (height_box * col_t);
				var _vleft 			= (init_left + (width_box * col));
				var _vtop_image 	= -(height_box * col_t);
				
				var _vleft_image 	= -(width_box * col);
				var _btop 			= _vtop - 50;
				var _bleft 			= _vleft - 50;
				
				var box_clone = this.getBoxCloneImgOld(image_old);
				box_clone.css({left:_vleft+'px', top:_vtop+'px', width:width_box, height:height_box});
				box_clone.find('img').css({left:_vleft_image, top:_vtop_image});
				
				this.addBoxClone(box_clone);
				box_clone.show();
				
				var delay_time = 50 * i;
				delay_time = (i == (total - 1)) ? (total * 50) : delay_time;
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				
				box_clone.delay(delay_time).animate({opacity:'hide'}, time_animate, easing, callback);
				
				col_t++;
				if (col_t == division_h) {
					col_t = 0;
					col++;
				}
			}
			
		},
		
		animationCubeJelly: function(options)
		{
			var self = this;
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeInBack' : this.settings.easing_default;
			var time_animate = 300 / this.settings.velocity;
			
			var image_old = this.box_skitter.find('.image_main').attr('src');
			
			this.setActualLevel();
			
			this.setLinkAtual();
			this.box_skitter.find('.image_main').attr({'src':this.settings.image_atual});
			
			var division_w 	= Math.ceil(this.settings.width_skitter / (this.settings.width_skitter / 8));
			var division_h 	= Math.ceil(this.settings.height_skitter / (this.settings.height_skitter / 3));
			var total		= division_w * division_h;
			
			var width_box 	= Math.ceil(this.settings.width_skitter / division_w);
			var height_box 	= Math.ceil(this.settings.height_skitter / division_h);
			
			var init_top 	= 0;
			var init_left 	= 0;
			
			var col_t 		= 0;
			var col 		= 0;
			var u			= -1;
			
			for (i = 0; i < total; i++) {
			
				if (col % 2 != 0) {
					if (col_t == 0) {
						u = u + division_h + 1;
					}
					u--;
				} 
				else {
					if (col > 0 && col_t == 0) {
						u = u + 2;
					}
					u++;
				}
			
				init_top 			= (i % 2 == 0) ? init_top : -init_top;
				init_left 			= (i % 2 == 0) ? init_left : -init_left;

				var _vtop 			= init_top + (height_box * col_t);
				var _vleft 			= (init_left + (width_box * col));
				var _vtop_image 	= -(height_box * col_t);
				
				var _vleft_image 	= -(width_box * col);
				var _btop 			= _vtop - 50;
				var _bleft 			= _vleft - 50;
				
				var box_clone = this.getBoxCloneImgOld(image_old);
				box_clone.css({left:_vleft+'px', top:_vtop+'px', width:width_box, height:height_box});
				box_clone.find('img').css({left:_vleft_image, top:_vtop_image});
				
				this.addBoxClone(box_clone);
				box_clone.show();
				
				var delay_time = (50 * i);
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				
				box_clone.delay(delay_time).animate({width:'+=100px', height:'+=100px', top:'-=20px',  left: '-=20px', opacity:'hide'}, time_animate, easing, callback);
				col_t++;
				
				if (col_t == division_h) {
					col_t = 0;
					col++;
				}
				
			}
		},
		
		animationCubeSize: function(options)
		{
			var self = this;
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeInOutQuad' : this.settings.easing_default;
			var time_animate = 600 / this.settings.velocity;
			
			var image_old = this.box_skitter.find('.image_main').attr('src');
			
			this.setActualLevel();
			
			this.setLinkAtual();
			this.box_skitter.find('.image_main').attr({'src':this.settings.image_atual});
			
			var division_w 	= Math.ceil(this.settings.width_skitter / (this.settings.width_skitter / 8));
			var division_h 	= Math.ceil(this.settings.height_skitter / (this.settings.height_skitter / 3));
			var total		= division_w * division_h;
			
			var width_box 	= Math.ceil(this.settings.width_skitter / division_w);
			var height_box 	= Math.ceil(this.settings.height_skitter / division_h);
			
			var init_top 	= 0;
			var init_left 	= 0;
			
			var col_t 		= 0;
			var col 		= 0;
			var _ftop		= Math.ceil(this.settings.width_skitter / 6);
			
			for (i = 0; i < total; i++) {
				
				init_top 			= (i % 2 == 0) ? init_top : -init_top;
				init_left 			= (i % 2 == 0) ? init_left : -init_left;

				var _vtop 			= init_top + (height_box * col_t);
				var _vleft 			= (init_left + (width_box * col));
				var _vtop_image 	= -(height_box * col_t);
				
				var _vleft_image 	= -(width_box * col);
				var _btop 			= _vtop - _ftop;
				var _bleft 			= _vleft - _ftop;
				
				var box_clone = this.getBoxCloneImgOld(image_old);
				box_clone.css({left:_vleft, top:_vtop, width:width_box, height:height_box});
				box_clone.find('img').css({left:_vleft_image, top:_vtop_image});
				
				this.addBoxClone(box_clone);
				box_clone.show();
				
				var delay_time = 50 * i;
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				box_clone.delay(delay_time).animate({
					opacity:'hide',width:'hide',height:'hide',top:_vtop+(width_box*1.5),left:_vleft+(height_box*1.5)
				}, time_animate, easing, callback);
				
				col_t++;
				if (col_t == division_h) {
					col_t = 0;
					col++;
				}
			}
			
		},
		
		animationHorizontal: function(options)
		{
			var self = this;
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeOutExpo' : this.settings.easing_default;
			var time_animate = 700 / this.settings.velocity;
			
			this.setActualLevel();
			
			var total 		= Math.ceil(this.settings.width_skitter / (this.settings.width_skitter / 7));
			var width_box 	= (this.settings.width_skitter);
			var height_box 	= Math.ceil(this.settings.height_skitter / total);
			
			for (i = 0; i < total; i++) {
				var _bleft = (i % 2 == 0 ? '' : '') + width_box;
				var _btop = (i * height_box);
				
				var box_clone = this.getBoxClone();
				
				box_clone.css({left:_bleft+'px', top:_btop+'px', width:width_box, height:height_box});
				box_clone.find('img').css({left:0, top:-_btop});
				
				this.addBoxClone(box_clone);
				
				var delay_time = 90 * i;
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				box_clone.delay(delay_time).animate({opacity:'show', top:_btop, left:0}, time_animate, easing, callback);
			}
		},
		
		animationShowBars: function(options)
		{
			var self = this;
			
			var options = $.extend({}, {random: false}, options || {});
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeOutQuad' : this.settings.easing_default;
			var time_animate = 400 / this.settings.velocity;
			
			this.setActualLevel();
			
			var total 		= Math.ceil(this.settings.width_skitter / (this.settings.width_skitter / 10));
			var width_box 	= Math.ceil(this.settings.width_skitter / total);
			var height_box 	= (this.settings.height_skitter);
			
			for (i = 0; i < total; i++) {
				
				var _bleft = (width_box * (i));
				var _btop = 0;
				
				var box_clone = this.getBoxClone();
				
				box_clone.css({left:_bleft, top:_btop - 50, width:width_box, height:height_box});
				box_clone.find('img').css({left:-(width_box * i), top:0});
				
				this.addBoxClone(box_clone);
				
				if (options.random) {
					var random = this.getRandom(total);
					var delay_time = 50 * random;
					delay_time = (i == (total - 1)) ? (50 * total) : delay_time;
				}
				else {
					var delay_time = 70 * (i);
					time_animate = time_animate - (i * 2);
				}
				
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				box_clone.delay(delay_time).animate({
					opacity:'show', top:_btop+'px', left:_bleft+'px'
				}, time_animate, easing, callback);
			}
			
		},
		
		animationTube: function(options)
		{
			var self = this;
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeOutElastic' : this.settings.easing_default;
			var time_animate = 600 / this.settings.velocity;
			
			this.setActualLevel();
			
			var total 		= Math.ceil(this.settings.width_skitter / (this.settings.width_skitter / 10));
			var width_box 	= Math.ceil(this.settings.width_skitter / total);
			var height_box 	= this.settings.height_skitter;
			
			for (i = 0;i<total;i++) {
				var _btop = 0;
				var _vtop = height_box;
				var vleft = width_box * i;
			
				var box_clone = this.getBoxClone();
				
				box_clone.css({left:vleft,top: _vtop, height:height_box, width: width_box});
				box_clone.find('img').css({left:-(vleft)});
				
				this.addBoxClone(box_clone);
				
				var random = this.getRandom(total);
				var delay_time = 30 * random;
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				box_clone.show().delay(delay_time).animate({top:_btop}, time_animate, easing, callback);
			}
		},
		
		animationFade: function(options)
		{
			var self = this;
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeOutQuad' : this.settings.easing_default;
			var time_animate = 800 / this.settings.velocity;
			
			this.setActualLevel();
			
			var width_box 	= this.settings.width_skitter;
			var height_box 	= this.settings.height_skitter;
			var total 		= 2;
			
			for (i = 0;i<total;i++) {
				var _vtop = 0;
				var _vleft = 0;
			
				var box_clone = this.getBoxClone();
				box_clone.css({left:_vleft, top:_vtop, width:width_box, height:height_box});
				this.addBoxClone(box_clone);

				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				box_clone.animate({opacity:'show', left:0, top:0}, time_animate, easing, callback);
			}
		},
		
		animationFadeFour: function(options)
		{
			var self = this;
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeOutQuad' : this.settings.easing_default;
			var time_animate = 500 / this.settings.velocity;
			
			this.setActualLevel();
			
			var width_box 	= this.settings.width_skitter;
			var height_box 	= this.settings.height_skitter;
			var total 		= 4;
			
			for (i = 0;i<total;i++) {
				
				if (i == 0) {
					var _vtop = '-100px';
					var _vleft = '-100px';
				} else if (i == 1) {
					var _vtop = '-100px';
					var _vleft = '100px';
				} else if (i == 2) {
					var _vtop = '100px';
					var _vleft = '-100px';
				} else if (i == 3) {
					var _vtop = '100px';
					var _vleft = '100px';
				}
			
				var box_clone = this.getBoxClone();
				box_clone.css({left:_vleft, top:_vtop, width:width_box, height:height_box});
				this.addBoxClone(box_clone);
				
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				box_clone.animate({opacity:'show', left:0, top:0}, time_animate, easing, callback);
			}
		},
		
		animationParalell: function(options)
		{
			var self = this;
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeOutQuad' : this.settings.easing_default;
			var time_animate = 400 / this.settings.velocity;
			
			this.setActualLevel();
			
			var total 		= Math.ceil(this.settings.width_skitter / (this.settings.width_skitter / 16));
			var width_box 	= Math.ceil(this.settings.width_skitter / total);
			var height_box 	= this.settings.height_skitter;
			
			for (i = 0; i < total; i++) {
				
				var _bleft = (width_box * (i));
				var _btop = 0;
				
				var box_clone = this.getBoxClone();
				
				box_clone.css({left:_bleft, top:_btop - this.settings.height_skitter, width:width_box, height:height_box});
				box_clone.find('img').css({left:-(width_box * i), top:0});
				
				this.addBoxClone(box_clone);
				
				var delay_time;
				if (i <= ((total / 2) - 1)) {
					delay_time = 1400 - (i * 200);
				}
				else if (i > ((total / 2) - 1)) {
					delay_time = ((i - (total / 2)) * 200);
				}
				delay_time = delay_time / 2.5;
				
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				box_clone.delay(delay_time).animate({
					top:_btop+'px', left:_bleft+'px', opacity: 'show'
				}, time_animate, easing, callback);
			}
			
		},
		
		animationBlind: function(options)
		{
			var self = this;
			
			var options = $.extend({}, {height: false}, options || {});
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeOutQuad' : this.settings.easing_default;
			var time_animate = 400 / this.settings.velocity;
			
			this.setActualLevel();
			
			var total 		= Math.ceil(this.settings.width_skitter / (this.settings.width_skitter / 16));
			var width_box 	= Math.ceil(this.settings.width_skitter / total);
			var height_box 	= this.settings.height_skitter;
			
			for (i = 0; i < total; i++) {
				
				var _bleft = (width_box * (i));
				var _btop = 0;
				
				var box_clone = this.getBoxClone();
				
				box_clone.css({left:_bleft, top:_btop, width:width_box, height:height_box});
				box_clone.find('img').css({left:-(width_box * i), top:0});
				
				this.addBoxClone(box_clone);
				
				var delay_time;
				
				if (!options.height) {
					if (i <= ((total / 2) - 1)) {
						delay_time = 1400 - (i * 200);
					}
					else if (i > ((total / 2) - 1)) {
						delay_time = ((i - (total / 2)) * 200);
					}
					var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				}
				else {
					if (i <= ((total / 2) - 1)) {
						delay_time = 200 + (i * 200);
					}
					else if (i > ((total / 2) - 1)) {
						delay_time = (((total / 2) - i) * 200) + (total * 100);
					}
					var callback = (i == (total / 2)) ? function() { self.finishAnimation(); } : '';
				}
				
				delay_time = delay_time / 2.5;
				
				if (!options.height) {
					box_clone.delay(delay_time).animate({
						opacity:'show',top:_btop+'px', left:_bleft+'px', width:'show'
					}, time_animate, easing, callback);
				}
				else {
					time_animate = time_animate + (i * 2);
					var easing = 'easeOutQuad';
					box_clone.delay(delay_time).animate({
						opacity:'show',top:_btop+'px', left:_bleft+'px', height:'show'
					}, time_animate, easing, callback);
				}
			}
			
		},
		
		animationBlindDimension: function(options)
		{
			var self = this;
			
			var options = $.extend({}, {height: true, time_animate: 500, delay: 100}, options || {});
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeOutQuad' : this.settings.easing_default;
			var time_animate = options.time_animate / this.settings.velocity;
			
			this.setActualLevel();
			
			var total 		= Math.ceil(this.settings.width_skitter / (this.settings.width_skitter / 16));
			var width_box 	= Math.ceil(this.settings.width_skitter / total);
			var height_box 	= this.settings.height_skitter;
			
			for (i = 0; i < total; i++) {
				
				var _bleft = (width_box * (i));
				var _btop = 0;
				
				var box_clone = this.getBoxClone();
				
				box_clone.css({left:_bleft, top:_btop, width:width_box, height:height_box});
				box_clone.find('img').css({left:-(width_box * i), top:0});
				
				this.addBoxClone(box_clone);
				
				var delay_time = options.delay * i;
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				
				if (!options.height) {
					box_clone.delay(delay_time).animate({
						opacity:'show',top:_btop+'px', left:_bleft+'px', width:'show'
					}, time_animate, easing, callback);
				}
				else {
					var easing = 'easeOutQuad';
					box_clone.delay(delay_time).animate({
						opacity:'show',top:_btop+'px', left:_bleft+'px', height:'show'
					}, time_animate, easing, callback);
				}
			}
			
		},
		
		animationDirection: function(options)
		{
			var self = this;
			
			var options = $.extend({}, {direction: 'top', delay_type: 'sequence', total: 7}, options || {});
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeInOutExpo' : this.settings.easing_default;
			var time_animate = 1200 / this.settings.velocity;
			
			var image_old = this.box_skitter.find('.image_main').attr('src');
			
			this.setActualLevel();
			
			this.setLinkAtual();
			this.box_skitter.find('.image_main').attr({'src':this.settings.image_atual});
			this.box_skitter.find('.image_main').hide();
			
			var total 		= options.total;
			
			for (i = 0; i < total; i++) {
				
				switch (options.direction)
				{
					default : case 'top' : 
						
						var width_box 		= Math.ceil(this.settings.width_skitter / total);
						var height_box 		= this.settings.height_skitter;
						
						var _itopc 			= 0;
						var _ileftc 		= (width_box * i);
						var _ftopc 			= -height_box;
						var _fleftc 		= _ileftc;
						
						var _itopn			= height_box;
						var _ileftn			= _ileftc;
						var _ftopn			= 0;
						var _fleftn			= _ileftc;
						
						var _vtop_image 	= 0;
						var _vleft_image 	= -_ileftc;
						
						break;
						
					case 'bottom' : 
					
						var width_box 		= Math.ceil(this.settings.width_skitter / total);
						var height_box 		= this.settings.height_skitter;
						
						var _itopc 			= 0;
						var _ileftc 		= (width_box * i);
						var _ftopc 			= height_box;
						var _fleftc 		= _ileftc;
						
						var _itopn			= -height_box;
						var _ileftn			= _ileftc;
						var _ftopn			= 0;
						var _fleftn			= _ileftc;
						
						var _vtop_image 	= 0;
						var _vleft_image 	= -_ileftc;
						
						break;
						
					case 'right' : 
					
						var width_box 		= this.settings.width_skitter;
						var height_box 		= Math.ceil(this.settings.height_skitter / total);
						
						var _itopc 			= (height_box * i);
						var _ileftc 		= 0;
						var _ftopc 			= _itopc;
						var _fleftc 		= width_box;
						
						var _itopn			= _itopc;
						var _ileftn			= -_fleftc;
						var _ftopn			= _itopc;
						var _fleftn			= 0;
						
						var _vtop_image 	= -_itopc;
						var _vleft_image 	= 0;
						
						break;
						
					case 'left' : 
					
						var width_box 		= this.settings.width_skitter;
						var height_box 		= Math.ceil(this.settings.height_skitter / total);
						
						var _itopc 			= (height_box * i);
						var _ileftc 		= 0;
						var _ftopc 			= _itopc;
						var _fleftc 		= -width_box;
						
						var _itopn			= _itopc;
						var _ileftn			= -_fleftc;
						var _ftopn			= _itopc;
						var _fleftn			= 0;
						
						var _vtop_image 	= -_itopc;
						var _vleft_image 	= 0;
						
						break;
						
				}
				
				switch (options.delay_type) 
				{
					case 'zebra' : default : var delay_time = (i % 2 == 0) ? 0 : 150; break;
					case 'random' : var delay_time = 30 * (Math.random() * 30); break;
					case 'sequence' : var delay_time = i * 100; break;
				}
				
				var box_clone = this.getBoxCloneImgOld(image_old);
				box_clone.find('img').css({left:_vleft_image, top:_vtop_image});
				
				box_clone.css({top:_itopc, left:_ileftc, width:width_box, height:height_box});
				
				this.addBoxClone(box_clone);
				box_clone.show();
				box_clone.delay(delay_time).animate({ top:_ftopc, left:_fleftc }, time_animate, easing);
				
				// Next image
				var box_clone_next = this.getBoxClone();
				box_clone_next.find('img').css({left:_vleft_image, top:_vtop_image});
				
				box_clone_next.css({top:_itopn, left:_ileftn, width:width_box, height:height_box});
				
				this.addBoxClone(box_clone_next);
				box_clone_next.show();
				
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				box_clone_next.delay(delay_time).animate({ top:_ftopn, left:_fleftn }, time_animate, easing, callback);
				
			}
		},
		
		animationCubeSpread: function(options)
		{
			var self = this;
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeOutQuad' : this.settings.easing_default;
			var time_animate = 700 / this.settings.velocity;
			
			this.setActualLevel();
			
			var division_w 	= Math.ceil(this.settings.width_skitter / (this.settings.width_skitter / 8));
			var division_h 	= Math.ceil(this.settings.height_skitter / (this.settings.width_skitter / 8));
			var total		= division_w * division_h;
			
			var width_box 	= Math.ceil(this.settings.width_skitter / division_w);
			var height_box 	= Math.ceil(this.settings.height_skitter / division_h);
			
			var init_top 	= 0;
			var init_left 	= 0;
			
			var col_t 		= 0;
			var col 		= 0;
			var order 		= new Array;
			var spread 		= new Array;
			
			// Make order
			for (i = 0; i < total; i++) {
				init_top 			= (i % 2 == 0) ? init_top : -init_top;
				init_left 			= (i % 2 == 0) ? init_left : -init_left;

				var _vtop 			= init_top + (height_box * col_t);
				var _vleft 			= (init_left + (width_box * col));
				
				order[i] = [_vtop, _vleft];
				
				col_t++;
				if (col_t == division_h) {
					col_t = 0;
					col++;
				}
			}
			
			// Reset col and col_t
			col_t = 0;
			col = 0;
			
			// Make array for spread
			for (i = 0; i < total; i++) {
				spread[i] = i;
			};
			
			// Shuffle array
			var spread = self.shuffleArray(spread);
			
			for (i = 0; i < total; i++) {
				init_top 			= (i % 2 == 0) ? init_top : -init_top;
				init_left 			= (i % 2 == 0) ? init_left : -init_left;

				var _vtop 			= init_top + (height_box * col_t);
				var _vleft 			= (init_left + (width_box * col));
				var _vtop_image 	= -(height_box * col_t);
				
				var _vleft_image 	= -(width_box * col);
				var _btop 			= _vtop;
				var _bleft 			= _vleft;
				
				_vtop 				= order[spread[i]][0];
				_vleft 				= order[spread[i]][1];
				
				var box_clone 		= this.getBoxClone();
				
				box_clone.css({left:_vleft+'px', top:_vtop+'px', width:width_box, height:height_box});
				box_clone.find('img').css({left:_vleft_image, top:_vtop_image});
				
				this.addBoxClone(box_clone);
				
				var delay_time = 30 * (Math.random() * 30);
				if (i == (total-1)) delay_time = 30 * 30;
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				box_clone.delay(delay_time).animate({opacity:'show',top:_btop+'px', left:_bleft+'px'}, time_animate, easing, callback);
				
				col_t++;
				if (col_t == division_h) {
					col_t = 0;
					col++;
				}
			}
		}, 
		
		animationGlassCube: function(options)
		{
			var self = this;
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeOutExpo' : this.settings.easing_default;
			var time_animate = 500 / this.settings.velocity;
			
			this.setActualLevel();
			
			var total 		= Math.ceil(this.settings.width_skitter / (this.settings.width_skitter / 10)) * 2;
			var width_box 	= Math.ceil(this.settings.width_skitter / total) * 2;
			var height_box 	= (this.settings.height_skitter) / 2;
			var col			= 0;
			
			for (i = 0; i < total; i++) {
				mod = (i % 2) == 0 ? true : false;
				
				var _ileft = (width_box * (col));
				var _itop = (mod) ? -self.settings.height_skitter : self.settings.height_skitter;
				
				var _fleft = (width_box * (col));
				var _ftop = (mod) ? 0 : (height_box);
				
				var _bleft = -(width_box * col);
				var _btop = (mod) ? 0 : -(height_box);
				
				var delay_time = 120 * col;
				
				var box_clone = this.getBoxClone();
				box_clone.css({left: _ileft, top:_itop, width:width_box, height:height_box});
				
				box_clone
					.find('img')
					.css({left: _bleft + (width_box / 1.5), top: _btop})
					.delay(delay_time)
					.animate({left: _bleft, top: _btop}, (time_animate * 1.9), 'easeOutQuad');
				
				this.addBoxClone(box_clone);
				
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				box_clone.show().delay(delay_time).animate({top:_ftop, left:_fleft}, time_animate, easing, callback);
				
				if ((i % 2) != 0) col++;
			}
		},
		
		animationGlassBlock: function(options)
		{
			var self = this;
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeOutExpo' : this.settings.easing_default;
			var time_animate = 700 / this.settings.velocity;
			
			this.setActualLevel();
			
			var total 		= Math.ceil(this.settings.width_skitter / (this.settings.width_skitter / 10));
			var width_box 	= Math.ceil(this.settings.width_skitter / total);
			var height_box 	= (this.settings.height_skitter);
			
			for (i = 0; i < total; i++) {
				var _ileft = (width_box * (i));
				var _itop = 0;
				
				var _fleft = (width_box * (i));
				var _ftop = 0;
				
				var _bleft = -(width_box * (i));
				var _btop = 0;
				
				var delay_time = 100 * i;
				
				var box_clone = this.getBoxClone();
				box_clone.css({left: _ileft, top:_itop, width:width_box, height:height_box});
				
				box_clone
					.find('img')
					.css({left: _bleft + (width_box / 1.5), top: _btop})
					.delay(delay_time)
					.animate({left: _bleft, top: _btop}, (time_animate * 1.1), 'easeInOutQuad');
				
				this.addBoxClone(box_clone);
				
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				box_clone.delay(delay_time).animate({top:_ftop, left:_fleft, opacity: 'show'}, time_animate, easing, callback);
				
			}
		},
		
		animationCircles: function(options)
		{
			var self = this;
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeInQuad' : this.settings.easing_default;
			var time_animate = 500 / this.settings.velocity;
			
			this.setActualLevel();
			
			var total 		= Math.ceil(this.settings.width_skitter / (this.settings.width_skitter / 10));
			var size_box	= 100;
			
			var radius		= Math.sqrt(Math.pow((this.settings.width_skitter), 2) + Math.pow((this.settings.height_skitter), 2));
			var radius		= Math.ceil(radius);
			
			for (i = 0; i < total; i++) {
				var _ileft = (self.settings.width_skitter / 2) - (size_box / 2);
				var _itop = (self.settings.height_skitter / 2) - (size_box / 2);
				
				var _fleft = _ileft; 
				var _ftop = _itop; 
				var box_clone = null;

				// if ($.browser.mozilla) {
				// 	box_clone = this.getBoxClone();
				// 	box_clone.css({left: _ileft, top:_itop, width:size_box, height:size_box}).css3({
				// 		'border-radius': radius+'px'
				// 	});
				// 	box_clone.find('img').css({left: -_ileft, top: -_itop});
				// }
				// else {
					box_clone = this.getBoxCloneBackground({
						image: 		self.settings.image_atual,
						left: 		_ileft, 
						top: 		_itop, 
						width: 		size_box, 
						height: 	size_box,
						position: {
							top:  	-_itop, 
							left:  	-_ileft
						}
					}).css3({
						'border-radius': radius+'px'
					});
				// }
				

				// var box_clone = this.getBoxClone();
				// box_clone.css({left: _ileft, top:_itop, width:size_box, height:size_box}).css3({
				// 	'border-radius': radius+'px'
				// });
				// box_clone.find('img').css({left: -_ileft, top: -_itop});
				
				size_box += 100;
				
				this.addBoxClone(box_clone);
				
				var delay_time = 70 * i;
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				box_clone.delay(delay_time).animate({top: _ftop, left: _fleft, opacity: 'show'}, time_animate, easing, callback);
				
			}
		},
		
		animationCirclesInside: function(options)
		{
			var self = this;
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeInQuad' : this.settings.easing_default;
			var time_animate = 500 / this.settings.velocity;
			
			var image_old = this.box_skitter.find('.image_main').attr('src');
			
			this.setActualLevel();
			
			this.setLinkAtual();
			this.box_skitter.find('.image_main').attr({'src':this.settings.image_atual});
			
			var total 		= Math.ceil(this.settings.width_skitter / (this.settings.width_skitter / 10));
			
			var radius		= Math.sqrt(Math.pow((this.settings.width_skitter), 2) + Math.pow((this.settings.height_skitter), 2));
			var radius		= Math.ceil(radius);
			var size_box	= radius;
			
			for (i = 0; i < total; i++) {
				var _ileft = (self.settings.width_skitter / 2) - (size_box / 2);
				var _itop = (self.settings.height_skitter / 2) - (size_box / 2);
				
				var _fleft = _ileft; 
				var _ftop = _itop; 
				var box_clone = null;

				// if ($.browser.mozilla) {
				// 	box_clone = this.getBoxCloneImgOld(image_old);
				// 	box_clone.css({left: _ileft, top:_itop, width:size_box, height:size_box}).css3({
				// 		'border-radius': radius+'px'
				// 	});
				// 	box_clone.find('img').css({left: -_ileft, top: -_itop});
				// }
				// else {
					box_clone = this.getBoxCloneBackground({
						image: 		image_old,
						left: 		_ileft, 
						top: 		_itop, 
						width: 		size_box, 
						height: 	size_box,
						position: {
							top:  	-_itop, 
							left:  	-_ileft
						}
					}).css3({
						'border-radius': radius+'px'
					});
				// }
				
				// var box_clone = this.getBoxCloneImgOld(image_old);
				// box_clone.css({left: _ileft, top:_itop, width:size_box, height:size_box}).css3({
				// 	'border-radius': radius+'px'
				// });
				// box_clone.find('img').css({left: -_ileft, top: -_itop});
				
				size_box -= 100;
				
				this.addBoxClone(box_clone);
				box_clone.show();
				
				var delay_time = 70 * i;
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				box_clone.delay(delay_time).animate({top: _ftop, left: _fleft, opacity: 'hide'}, time_animate, easing, callback);
				
			}
		},

		animationCirclesRotate: function(options)
		{
			var self = this;
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeOutQuad' : this.settings.easing_default;
			var time_animate = 500 / this.settings.velocity;
			
			var image_old = this.box_skitter.find('.image_main').attr('src');
			
			this.setActualLevel();
			
			this.setLinkAtual();
			this.box_skitter.find('.image_main').attr({'src':this.settings.image_atual});
			
			var total 		= Math.ceil(this.settings.width_skitter / (this.settings.width_skitter / 10));
			
			var radius		= Math.sqrt(Math.pow((this.settings.width_skitter), 2) + Math.pow((this.settings.height_skitter), 2));
			var radius		= Math.ceil(radius);
			var size_box	= radius;
			
			for (i = 0; i < total; i++) {
				var _ileft = (self.settings.width_skitter / 2) - (size_box / 2);
				var _itop = (self.settings.height_skitter / 2) - (size_box / 2);
				
				var _fleft = _ileft; 
				var _ftop = _itop; 
				var box_clone = null;

				if ($.browser.mozilla) {
					box_clone = this.getBoxCloneImgOld(image_old);
					box_clone.css({left: _ileft, top:_itop, width:size_box, height:size_box}).css3({
						'border-radius': radius+'px'
					});
					box_clone.find('img').css({left: -_ileft, top: -_itop});
				}
				else {
					box_clone = this.getBoxCloneBackground({
						image: 		image_old,
						left: 		_ileft, 
						top: 		_itop, 
						width: 		size_box, 
						height: 	size_box,
						position: {
							top:  	-_itop, 
							left:  	-_ileft
						}
					}).css3({
						'border-radius': radius+'px'
					});
				}
				
				size_box -= 100;
				
				this.addBoxClone(box_clone);
				box_clone.show();
				
				var delay_time = 100 * i;
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				var _rotate = (i % 2 == 0) ? '20deg' : '-20deg';
				box_clone.delay(delay_time).animate({top: _ftop, left: _fleft, opacity: 'hide', rotate: _rotate}, time_animate, easing, callback);
			}
		},
		
		animationCubeShow: function(options)
		{
			var self = this;
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeOutQuad' : this.settings.easing_default;
			var time_animate = 400 / this.settings.velocity;
			
			this.setActualLevel();
			
			var division_w 		= Math.ceil(this.settings.width_skitter / (this.settings.width_skitter / 8));
			var division_h 		= Math.ceil(this.settings.height_skitter / (this.settings.height_skitter / 4));
			var total			= division_w * division_h;
			
			var width_box 		= Math.ceil(this.settings.width_skitter / division_w);
			var height_box 		= Math.ceil(this.settings.height_skitter / division_h);
			
			var last 			= false;
			
			var _btop 			= 0;
			var _bleft 			= 0;
			var line			= 0;
			var col				= 0;
			
			for (i = 0; i < total; i++) {
				
				_btop = height_box * line;
				_bleft = width_box * col;
				
				var delay_time = 30 * (i);
				
				var box_clone 		= this.getBoxClone();
				box_clone.css({left:_bleft, top:_btop, width:width_box, height:height_box}).hide();
				box_clone.find('img').css({left:-_bleft, top:-_btop});
				this.addBoxClone(box_clone);
				
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				box_clone.delay(delay_time).animate({width:'show', height:'show'}, time_animate, easing, callback);
				
				line++;
				if (line == division_h) {
					line = 0;
					col++;
				}
			}
		},
		
		animationDirectionBars: function(options)
		{
			var self = this;
			
			var options = $.extend({}, {direction: 'top'}, options || {});
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeInOutQuad' : this.settings.easing_default;
			var time_animate = 400 / this.settings.velocity;
			
			var image_old = this.box_skitter.find('.image_main').attr('src');
			
			this.setActualLevel();
			
			this.setLinkAtual();
			this.box_skitter.find('.image_main').attr({'src':this.settings.image_atual});
			
			var total		= 12;
			var width_box 	= Math.ceil(this.settings.width_skitter / total);
			var height_box 	= this.settings.height_skitter;
			var _ftop		= (options.direction == 'top') ? -height_box : height_box;
			
			for (i = 0; i < total; i++) {
				var _vtop 			= 0;
				var _vleft 			= (width_box * i);
				var _vtop_image 	= 0;
				var _vleft_image 	= -(width_box * i);

				var box_clone = this.getBoxCloneImgOld(image_old);
				box_clone.css({left:_vleft+'px', top:_vtop+'px', width:width_box, height:height_box});
				box_clone.find('img').css({left:_vleft_image, top:_vtop_image});
				
				this.addBoxClone(box_clone);
				box_clone.show();
				
				var delay_time = 70 * i;
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				
				box_clone.delay(delay_time).animate({top:_ftop}, time_animate, easing, callback);
			}
			
		},

		animationHideBars: function(options)
		{
			var self = this;

			var options = $.extend({}, {random: false}, options || {});

			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? 'easeOutCirc' : this.settings.easing_default;
			var time_animate = 700 / this.settings.velocity;

			var image_old = this.box_skitter.find('.image_main').attr('src');

			this.setActualLevel();

			this.setLinkAtual();
			this.box_skitter.find('.image_main').attr({'src':this.settings.image_atual});

			var division_w = Math.ceil(this.settings.width_skitter / (this.settings.width_skitter / 10));
			var total = division_w;

			var width_box = Math.ceil(this.settings.width_skitter / division_w);
			var height_box = this.settings.height_skitter;

			for (i = 0; i < total; i++) {
				var _vtop = 0;
				var _vleft = width_box * i;

				var _vtop_image = 0;
				var _vleft_image = -(width_box * i);

				var _fleft = '+='+width_box;

				var box_clone = this.getBoxCloneImgOld(image_old);
				box_clone.css({left:0, top:0, width:width_box, height:height_box});
				box_clone.find('img').css({left:_vleft_image, top:_vtop_image});

				var box_clone_main = this.getBoxCloneImgOld(image_old);
				box_clone_main.css({left:_vleft+'px', top:_vtop+'px', width:width_box, height:height_box});
				box_clone_main.html(box_clone);

				this.addBoxClone(box_clone_main);
				box_clone.show();
				box_clone_main.show();

				var delay_time = 50 * i;
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';
				
				box_clone.delay(delay_time).animate({left:_fleft}, time_animate, easing, callback);
			}
		},

		animationSwapBars: function(options)
		{
			var self = this;
			
			var options = $.extend({}, {direction: 'top', delay_type: 'sequence', total: 7, easing: 'easeOutCirc'}, options || {});
			
			this.settings.is_animating = true;
			var easing = (this.settings.easing_default == '') ? options.easing : this.settings.easing_default;
			var time_animate = 500 / this.settings.velocity;
			
			var image_old = this.box_skitter.find('.image_main').attr('src');
			
			this.setActualLevel();
			
			this.setLinkAtual();
			this.box_skitter.find('.image_main').attr({'src':this.settings.image_atual});
			this.box_skitter.find('.image_main').hide();
			
			var total 		= options.total;
			
			for (i = 0; i < total; i++) {

				var width_box 		= Math.ceil(this.settings.width_skitter / total);
				var height_box 		= this.settings.height_skitter;
				
				var _itopc 			= 0;
				var _ileftc 		= (width_box * i);
				var _ftopc 			= -height_box;
				var _fleftc 		= _ileftc + width_box ;
				
				var _itopn			= height_box;
				var _ileftn			= _ileftc;
				var _ftopn			= 0;
				var _fleftn			= _ileftc;
				
				var _vtop_image 	= 0;
				var _vleft_image 	= -_ileftc;
				
				switch (options.delay_type) 
				{
					case 'zebra' : default : var delay_time = (i % 2 == 0) ? 0 : 150; break;
					case 'random' : var delay_time = 30 * (Math.random() * 30); break;
					case 'sequence' : var delay_time = i * 100; break;
				}

				// Old image
				var box_clone = this.getBoxCloneImgOld(image_old);
				box_clone.find('img').css({left:_vleft_image, top:0});
				box_clone.css({top:0, left:0, width:width_box, height:height_box});

				// Next image
				var box_clone_next = this.getBoxClone();
				box_clone_next.find('img').css({left:_vleft_image, top:0});
				box_clone_next.css({top:0, left:-width_box, width:width_box, height:height_box});
				
				// Container box images
				var box_clone_container = this.getBoxClone();
				box_clone_container.html('').append(box_clone).append(box_clone_next);
				box_clone_container.css({top:0, left:_ileftc, width:width_box, height:height_box});
				
				// Add containuer
				this.addBoxClone(box_clone_container);

				// Show boxes
				box_clone_container.show();
				box_clone.show();
				box_clone_next.show();
				
				// Callback
				var callback = (i == (total - 1)) ? function() { self.finishAnimation(); } : '';

				// Animations
				box_clone.delay(delay_time).animate({ left: width_box }, time_animate, easing);
				box_clone_next.delay(delay_time).animate({ left:0 }, time_animate, easing, callback);
			}
		},

		animationSwapBlocks: function(options)
		{
			var self = this;
			
			var options = $.extend({}, {easing_old: 'easeInOutQuad', easing_new: 'easeOutQuad'}, options || {});
			
			this.settings.is_animating = true;
			var easing_old = (this.settings.easing_default == '') ? options.easing_old : this.settings.easing_default;
			var easing_new = (this.settings.easing_default == '') ? options.easing_new : this.settings.easing_default;
			var time_animate = 800 / this.settings.velocity;
			
			var image_old = this.box_skitter.find('.image_main').attr('src');
			
			this.setActualLevel();
			
			this.setLinkAtual();
			this.box_skitter.find('.image_main').attr({'src':this.settings.image_atual});
			this.box_skitter.find('.image_main').hide();
			
			var total 			= 2;
			var width_box 		= this.settings.width_skitter;
			var height_box 		= Math.ceil(this.settings.height_skitter / total);

			// Old image
			var box_clone1 = this.getBoxCloneImgOld(image_old), box_clone2 = this.getBoxCloneImgOld(image_old);
			box_clone1.find('img').css({left:0, top:0});
			box_clone1.css({top:0, left:0, width:width_box, height:height_box});

			box_clone2.find('img').css({left:0, top:-height_box});
			box_clone2.css({top:height_box, left:0, width:width_box, height:height_box});

			// Next image
			var box_clone_next1 = this.getBoxClone(), box_clone_next2 = this.getBoxClone();
			box_clone_next1.find('img').css({left:0, top:height_box});
			box_clone_next1.css({top:0, left:0, width:width_box, height:height_box});

			box_clone_next2.find('img').css({left:0, top: -(height_box * total) });
			box_clone_next2.css({top:height_box, left:0, width:width_box, height:height_box});

			// Add boxes
			this.addBoxClone(box_clone_next1);
			this.addBoxClone(box_clone_next2);
			this.addBoxClone(box_clone1);
			this.addBoxClone(box_clone2);

			// Show boxes
			box_clone1.show();
			box_clone2.show();
			box_clone_next1.show();
			box_clone_next2.show();

			// Callback
			var callback = function() { self.finishAnimation(); };

			// Animations
			box_clone1.find('img').animate({ top: height_box }, time_animate, easing_old, function() {
				box_clone1.remove();
			});
			box_clone2.find('img').animate({ top: -(height_box * total) }, time_animate, easing_old, function() {
				box_clone2.remove();
			});
			box_clone_next1.find('img').animate({ top: 0 }, time_animate, easing_new);
			box_clone_next2.find('img').animate({ top: -height_box }, time_animate, easing_new, callback);
		},

		animationCut: function(options)
		{
			var self = this;
			
			var options = $.extend({}, {easing_old: 'easeInOutExpo', easing_new: 'easeInOutExpo'}, options || {});
			
			this.settings.is_animating = true;
			var easing_old = (this.settings.easing_default == '') ? options.easing_old : this.settings.easing_default;
			var easing_new = (this.settings.easing_default == '') ? options.easing_new : this.settings.easing_default;
			var time_animate = 900 / this.settings.velocity;
			
			var image_old = this.box_skitter.find('.image_main').attr('src');
			
			this.setActualLevel();
			
			this.setLinkAtual();
			this.box_skitter.find('.image_main').attr({'src':this.settings.image_atual});
			this.box_skitter.find('.image_main').hide();
			
			var total 			= 2;
			var width_box 		= this.settings.width_skitter;
			var height_box 		= Math.ceil(this.settings.height_skitter / total);

			// Old image
			var box_clone1 = this.getBoxCloneImgOld(image_old), box_clone2 = this.getBoxCloneImgOld(image_old);
			box_clone1.find('img').css({left:0, top:0});
			box_clone1.css({top:0, left:0, width:width_box, height:height_box});

			box_clone2.find('img').css({left:0, top:-height_box});
			box_clone2.css({top:height_box, left:0, width:width_box, height:height_box});

			// Next image
			var box_clone_next1 = this.getBoxClone(), box_clone_next2 = this.getBoxClone();
			//box_clone_next1.find('img').css({left:0, top:height_box});
			box_clone_next1.find('img').css({left:0, top:0});
			box_clone_next1.css({top:0, left:width_box, width:width_box, height:height_box});

			//box_clone_next2.find('img').css({left:0, top: -(height_box * total) });
			box_clone_next2.find('img').css({left:0, top: -height_box });
			box_clone_next2.css({top:height_box, left:-width_box, width:width_box, height:height_box});

			// Add boxes
			this.addBoxClone(box_clone_next1);
			this.addBoxClone(box_clone_next2);
			this.addBoxClone(box_clone1);
			this.addBoxClone(box_clone2);

			// Show boxes
			box_clone1.show();
			box_clone2.show();
			box_clone_next1.show();
			box_clone_next2.show();

			// Callback
			var callback = function() { self.finishAnimation(); };

			// Animations
			box_clone1.animate({ left: -width_box }, time_animate, easing_old, function() {
				box_clone1.remove();
			});
			box_clone2.animate({ left: width_box }, time_animate, easing_old, function() {
				box_clone2.remove();
			});
			box_clone_next1.animate({ left: 0 }, time_animate, easing_new);
			box_clone_next2.animate({ left: 0 }, time_animate, easing_new, callback);
		},
		
		// End animations ----------------------
		
		// Finish animation
		finishAnimation: function (options) 
		{
			var self = this;
			this.box_skitter.find('.image_main').show();
			this.showBoxText();
			this.settings.is_animating = false;
			this.box_skitter.find('.image_main').attr({'src': this.settings.image_atual});
			this.box_skitter.find('.image a').attr({'href': this.settings.link_atual});
			
			if (!this.settings.is_hover_box_skitter && !this.settings.is_paused && !this.settings.is_blur) {
				this.timer = setTimeout(function() { self.completeMove(); }, this.settings.interval);
			}
			
			self.startTime();
		},

		// Complete move
		completeMove: function () 
		{
			this.clearTimer(true);
			this.box_skitter.find('.box_clone').remove();
			if (!this.settings.is_paused && !this.settings.is_blur) this.nextImage();
		},

		// Actual config for animation
		setActualLevel: function() {
			if ($.isFunction(this.settings.imageSwitched)) this.settings.imageSwitched(this.settings.image_i, this);
			this.setImageLink();
			this.addClassNumber();
			this.hideBoxText();
			this.increasingImage();
		},

		// Set image and link
		setImageLink: function()
		{
			var name_image = this.settings.images_links[this.settings.image_i][0];
			var link_image = this.settings.images_links[this.settings.image_i][1];
			var label_image = this.settings.images_links[this.settings.image_i][3];
			var target_link = this.settings.images_links[this.settings.image_i][4];
			
			this.settings.image_atual = name_image;
			this.settings.link_atual = link_image;
			this.settings.label_atual = label_image;
			this.settings.target_atual = target_link;
		},

		// Add class for number
		addClassNumber: function () 
		{
			var self = this;
			this.box_skitter.find('.image_number_select').animate(self.settings.animateNumberOut, 500).removeClass('image_number_select');
			$('#image_n_'+(this.settings.image_i+1)+'_'+self.number_skitter).animate(self.settings.animateNumberActive, 700).addClass('image_number_select');
		},

		// Increment image_i
		increasingImage: function()
		{
			this.settings.image_i++;
			if (this.settings.image_i == this.settings.images_links.length) {
				this.settings.image_i = 0;
			}
		},
		
		// Get box clone
		getBoxClone: function()
		{
			if (this.settings.link_atual != '#') {
				var img_clone = $('<a href="'+this.settings.link_atual+'"><img src="'+this.settings.image_atual+'" /></a>');
			} 
			else {
				var img_clone = $('<img src="'+this.settings.image_atual+'" />');
			}
			
			img_clone = this.resizeImage(img_clone);
			var box_clone = $('<div class="box_clone"></div>');
			box_clone.append(img_clone);
			return box_clone;
		},
		
		// Get box clone
		getBoxCloneImgOld: function(image_old)
		{
			if (this.settings.link_atual != '#') {
				var img_clone = $('<a href="'+this.settings.link_atual+'"><img src="'+image_old+'" /></a>');
			} 
			else {
				var img_clone = $('<img src="'+image_old+'" />');
			}
			
			img_clone = this.resizeImage(img_clone);
			var box_clone = $('<div class="box_clone"></div>');
			box_clone.append(img_clone);
			return box_clone;
		},
		
		// Redimensiona imagem
		resizeImage: function(img_clone) 
		{
			if (this.settings.fullscreen) {
				img_clone.find('img').height(this.settings.height_skitter);
			}
			return img_clone;
		}, 

		// Add box clone in box_skitter
		addBoxClone: function(box_clone)
		{
			this.box_skitter.find('.container_skitter').append(box_clone);
		},
		
		// Get accepts easing 
		getEasing: function(easing)
		{
			var easing_accepts = [
				'easeInQuad', 		'easeOutQuad', 		'easeInOutQuad', 
				'easeInCubic', 		'easeOutCubic', 	'easeInOutCubic', 
				'easeInQuart', 		'easeOutQuart', 	'easeInOutQuart', 
				'easeInQuint', 		'easeOutQuint', 	'easeInOutQuint', 
				'easeInSine', 		'easeOutSine', 		'easeInOutSine', 
				'easeInExpo',		'easeOutExpo', 		'easeInOutExpo', 
				'easeInCirc', 		'easeOutCirc', 		'easeInOutCirc', 
				'easeInElastic', 	'easeOutElastic', 	'easeInOutElastic', 
				'easeInBack', 		'easeOutBack', 		'easeInOutBack', 
				'easeInBounce', 	'easeOutBounce', 	'easeInOutBounce', 
			];
			
			if (jQuery.inArray(easing, easing_accepts) > 0) {
				return easing;
			}
			else {
				return '';
			}
		},
		
		// Get random number
		getRandom: function (i) 
		{
			return Math.floor(Math.random() * i);
		},

		// Set value for text
		setValueBoxText: function () 
		{
			this.box_skitter.find('.label_skitter').html(this.settings.label_atual);
		},
		
		// Show box text
		showBoxText: function () 
		{
			var self = this;
			if (this.settings.label_atual != undefined && this.settings.label_atual != '' && self.settings.label) {
				self.box_skitter.find('.label_skitter').slideDown(400);
			}
		},
		
		// Hide box text
		hideBoxText: function () 
		{
			var self = this;
			this.box_skitter.find('.label_skitter').slideUp(200, function() {
				self.setValueBoxText();
			});
		},
		
		// Stop time to get over box_skitter
		stopOnMouseOver: function () 
		{
			var self = this;
			var opacity_elements = self.settings.opacity_elements;
			var interval_in_elements = self.settings.interval_in_elements;
			var interval_out_elements = self.settings.interval_out_elements;

			
			self.box_skitter.hover(function() {
				
				if (self.settings.stop_over) self.settings.is_hover_box_skitter = true;
				
				if (!self.settings.is_paused_time) {
					self.pauseTime();
				}
				
				if (self.settings.hideTools) {
					if (self.settings.numbers) {
						self.box_skitter
							.find('.info_slide')
							.show()
							.css({opacity:0})
							.animate({opacity: opacity_elements}, interval_in_elements);
					}
					
					if (self.settings.navigation) {
						self.box_skitter
							.find('.prev_button')
							.show()
							.css({opacity:0})
							.animate({opacity: opacity_elements}, interval_in_elements);
							
						self.box_skitter
							.find('.next_button')
							.show().css({opacity:0})
							.animate({opacity: opacity_elements}, interval_in_elements);
					}

					if (self.settings.focus && !self.settings.foucs_active) {
						self.box_skitter
							.find('.focus_button')
							.stop()
							.show().css({opacity:0})
							.animate({opacity:opacity_elements}, 200);
					}
					
					if (self.settings.controls) {
						self.box_skitter
						.find('.play_pause_button')
						.stop()
						.show().css({opacity:0})
						.animate({opacity:opacity_elements}, 200);
					}
				}
				
				self.clearTimer(true);
				
				if (self.settings.focus && !self.settings.foucs_active && !self.settings.hideTools) {
					self.box_skitter
						.find('.focus_button')
						.stop()
						.animate({opacity:1}, 200);
				}
				
				if (self.settings.controls && !self.settings.hideTools) {
					self.box_skitter
						.find('.play_pause_button')
						.stop()
						.animate({opacity:1}, 200);
				}
				
			}, function() {
				if (self.settings.stop_over) self.settings.is_hover_box_skitter = false;
				
				if (self.settings.elapsedTime == 0 && !self.settings.is_animating && !self.settings.is_paused) {
					self.startTime();
				}
				else if (!self.settings.is_paused) {
					self.resumeTime();
				}
				
				if (self.settings.hideTools) {
					if (self.settings.numbers) {
						self.box_skitter
							.find('.info_slide')
							.queue("fx", [])
							.show()
							.css({opacity: opacity_elements})
							.animate({opacity:0}, interval_out_elements);
					}
					
					if (self.settings.navigation) {
						self.box_skitter
							.find('.prev_button')
							.queue("fx", [])
							.show()
							.css({opacity: opacity_elements})
							.animate({opacity:0}, interval_out_elements);
							
						self.box_skitter
							.find('.next_button')
							.queue("fx", [])
							.show()
							.css({opacity: opacity_elements})
							.animate({opacity:0}, interval_out_elements);
					}


					if (self.settings.focus && !self.settings.foucs_active) {
						self.box_skitter
							.find('.focus_button')
							.stop()
							.css({opacity: opacity_elements})
							.animate({opacity:0}, 200);
					}

					if (self.settings.controls) {
						self.box_skitter
							.find('.play_pause_button')
							.stop()
							.css({opacity: opacity_elements})
							.animate({opacity:0}, 200);
					}
				}
				
				self.clearTimer(true);
				
				if (!self.settings.is_animating && self.settings.images_links.length > 1) {
					self.timer = setTimeout(function() { self.completeMove(); }, self.settings.interval - self.settings.elapsedTime);
					self.box_skitter.find('.image_main').attr({'src': self.settings.image_atual});
					self.box_skitter.find('.image a').attr({'href': self.settings.link_atual});
				}
				
				if (self.settings.focus && !self.settings.foucs_active && !self.settings.hideTools) {
					self.box_skitter
						.find('.focus_button')
						.stop()
						.animate({opacity:0.3}, 200);
				}
				
				if (self.settings.controls && !self.settings.hideTools) {
					self.box_skitter
						.find('.play_pause_button')
						.stop()
						.animate({opacity:0.3}, 200);
				}
				
			});
		}, 
		
		// Stop timer
		clearTimer: function (force) {
			var self = this;
			clearInterval(self.timer);
		},
		
		// Set link atual
		setLinkAtual: function() {
			if (this.settings.link_atual != '#') {
				this.box_skitter.find('.image a').attr({'href': this.settings.link_atual, 'target': this.settings.target_atual});
			}
			else {
				this.box_skitter.find('.image a').removeAttr('href');
			}
		},
		
		// Hide tools
		hideTools: function() {
			this.box_skitter.find('.info_slide').hide();
			this.box_skitter.find('.prev_button').hide();
			this.box_skitter.find('.next_button').hide();
			this.box_skitter.find('.label_skitter').hide();
			this.box_skitter.find('.focus_button').hide();
			this.box_skitter.find('.play_pause_button').hide();
		}, 
				
		// Focus Skitter
		focusSkitter: function() {
			var self = this;
			
			var focus_button = $('<a href="#" class="focus_button">focus</a>');
			self.box_skitter.append(focus_button);
			
			var _left = (self.settings.width_skitter - focus_button.width()) / 2;
			var _space = 0;
			
			if (self.settings.controls) _left -= 25;
			if (self.settings.controls_position == self.settings.focus_position) _space = focus_button.width() + 5;
			
			var cssPosition = {left: _left};
			
			switch (self.settings.focus_position)
			{
				case 'leftTop' 		: cssPosition = {left: 5 + _space, top: 30}; break;
				case 'rightTop' 	: cssPosition = {right: 5 + _space, top: 30}; break;
				case 'leftBottom' 	: cssPosition = {left: 5 + _space, bottom: 5, top: 'auto'}; break;
				case 'rightBottom' 	: cssPosition = {right: 5 + _space, bottom: 5, top: 'auto'}; break;
			}
			
			focus_button
				.css(cssPosition)
				.animate({opacity:0.3}, self.settings.interval_in_elements);
			
			$(document).keypress(function(e) {
				var code = (e.keyCode ? e.keyCode : e.which);
				if (code == 27) $('#overlay_skitter').trigger('click');
			});
			
			self.box_skitter.find('.focus_button').click(function() {
				self.settings.foucs_active = true;
				
				$(this).stop().animate({opacity:0}, self.settings.interval_out_elements);
				
				var div = $('<div id="overlay_skitter"></div>')
					.height( $(document).height() )
					.hide()
					.fadeTo(self.settings.interval_in_elements, 0.98);
					
				var _top = $('.box_skitter').offset().top;
				var _left = $('.box_skitter').offset().left;
				var _topFinal = (($(window).height() - $('.box_skitter').height()) / 2) + $(document).scrollTop();
				var _leftFinal = ($(window).width() - $('.box_skitter').width()) / 2;
				
				self.box_skitter.before('<div id="mark_position"></div>');
				$('body').prepend(div);
				$('body').prepend(self.box_skitter);
				self.box_skitter
					.css({'top':_top, 'left':_left, 'position':'absolute', 'z-index':9999})
					.animate({'top':_topFinal, 'left':_leftFinal}, 2000, 'easeOutExpo');
				
				$('#mark_position')	
					.width($('.box_skitter').width())
					.height($('.box_skitter').height())
					.css({'background':'none'})
					.fadeTo(300,0.3);
				
				$('#overlay_skitter').click(function() {
					if ($(this).hasClass('finish_overlay_skitter')) return false;
					
					self.settings.foucs_active = false;
					$(this).addClass('finish_overlay_skitter');
					
					$('#mark_position').before($('.box_skitter'));
					
					if (!self.settings.hideTools) self.box_skitter.find('.focus_button').animate({opacity:0.3}, 200);
					
					self.box_skitter
						.stop()
						.animate({'top':_top, 'left':_left}, 300, 'easeOutExpo', function() {
							$(this).css({'position':'relative', 'top':0, 'left': 0});
							$('#mark_position').remove();
						});
					
					$('#overlay_skitter').fadeTo(self.settings.interval_out_elements, 0, function() {
						$(this).remove();
					});
					
					return false;
				});
				
				return false;
			});
		},
		

		/**
		 * Controls: play and stop
		 */
		setControls: function() {
			var self = this;
			
			var play_pause_button = $('<a href="#" class="play_pause_button">pause</a>');
			self.box_skitter.append(play_pause_button);
			
			var _left = (self.settings.width_skitter - play_pause_button.width()) / 2;
			
			if (self.settings.focus) _left += 25;
			
			var cssPosition = {left: _left};
			
			switch (self.settings.controls_position)
			{
				case 'leftTop' 		: cssPosition = {left: 5, top: 30}; break;
				case 'rightTop' 	: cssPosition = {right: 5, top: 30}; break;
				case 'leftBottom' 	: cssPosition = {left: 5, bottom: 5, top: 'auto'}; break;
				case 'rightBottom' 	: cssPosition = {right: 5, bottom: 5, top: 'auto'}; break;
			}
			
			play_pause_button
				.css(cssPosition)
				.animate({opacity:0.3}, self.settings.interval_in_elements);
			
			play_pause_button.click(function() {
				if (!self.settings.is_paused) {
					$(this).html('play');
					$(this).fadeTo(100, 0.5).fadeTo(100, 1);
					
					$(this).addClass('play_button');
					self.pauseTime();
					self.settings.is_paused = true;
					self.clearTimer(true);
				}
				else {
					if (!self.settings.is_animating && !self.box_skitter.find('.progressbar').is(':visible')) {
						self.settings.elapsedTime = 0;
					}
					else {
						self.resumeTime();
					}
					
					if (!self.settings.progressbar) self.resumeTime();
					
					self.settings.is_paused = false;
					
					$(this).html('pause');
					$(this).fadeTo(100, 0.5).fadeTo(100, 1);
					$(this).removeClass('play_button');
					
					if (!self.settings.stop_over) { 
						self.clearTimer(true);
						if (!self.settings.is_animating && self.settings.images_links.length > 1) {
							self.timer = setTimeout(function() { self.completeMove(); }, self.settings.interval - self.settings.elapsedTime);
							self.box_skitter.find('.image_main').attr({'src': self.settings.image_atual});
							self.box_skitter.find('.image a').attr({'href': self.settings.link_atual});
						}
					}
				}
				
				return false;
			});
		},
				
		/**
		 * Object size
		 */
		objectSize: function(obj) {
			var size = 0, key;
			for (key in obj) { if (obj.hasOwnProperty(key)) size++; }
			return size;
		},
		
		/**
		 * Add progress bar
		 */
		addProgressBar: function() {
			var self = this;
			
			var progressbar = $('<div class="progressbar"></div>');
			self.box_skitter.append(progressbar);
			
			if (self.objectSize(self.settings.progressbar_css) == 0)  {
				if (parseInt(progressbar.css('width')) > 0) {
					self.settings.progressbar_css.width = parseInt(progressbar.css('width'));
				}
				else {
					self.settings.progressbar_css = {width: self.settings.width_skitter, height:5};
				}
			}
			if (self.objectSize(self.settings.progressbar_css) > 0 && self.settings.progressbar_css.width == undefined) {
				self.settings.progressbar_css.width = self.settings.width_skitter;
			}
			
			progressbar.css(self.settings.progressbar_css).hide();
		},
		
		/**
		 * Start progress bar
		 */
		startProgressBar: function() {
			var self = this;
			if (self.settings.is_hover_box_skitter || self.settings.is_paused || self.settings.is_blur || !self.settings.progressbar) return false;
			self.box_skitter.find('.progressbar')
				.hide()
				.dequeue()
				.width(self.settings.progressbar_css.width)
				.animate({width:'show'}, self.settings.interval, 'linear');
		},
		
		/**
		 * Pause progress bar
		 */
		pauseProgressBar: function() {
			var self = this;
			if (!self.settings.is_animating) {
				self.box_skitter.find('.progressbar').stop();
			}
		},
		
		/**
		 * Resume progress bar
		 */
		resumeProgressBar: function() {
			var self = this;
			
			if (self.settings.is_hover_box_skitter || self.settings.is_paused || !self.settings.progressbar) return false;
			
			self.box_skitter.find('.progressbar').dequeue().animate({width: self.settings.progressbar_css.width}, (self.settings.interval - self.settings.elapsedTime), 'linear');
		},
		
		/**
		 * Hide progress bar
		 */
		hideProgressBar: function() {
			var self = this;
			
			if (!self.settings.progressbar) return false;
			
			self.box_skitter.find('.progressbar').stop().fadeOut(300, function() {
				$(this).width(self.settings.progressbar_css.width);
			});
		},

		/**
		 * Start time
		 */
		startTime: function() {
			var self = this;
			
			self.settings.is_paused_time = false;
			
			var date = new Date();
			self.settings.elapsedTime = 0;
			self.settings.timeStart = date.getTime();
			
			// Start progress bar
			self.startProgressBar();
		}, 
		
		/**
		 * Pause time
		 */
		pauseTime: function() {
			var self = this;
			
			if (self.settings.is_paused_time) return false;
			self.settings.is_paused_time = true;
			
			var date = new Date();
			self.settings.elapsedTime += date.getTime() - self.settings.timeStart;
			
			// Pause progress bar
			self.pauseProgressBar();
		}, 
		
		/**
		 * Resume time
		 */
		resumeTime: function() {
			var self = this;
			
			self.settings.is_paused_time = false;
			
			var date = new Date();
			self.settings.timeStart = date.getTime();
			
			// Resume progress bar
			self.resumeProgressBar();
		}, 

		/**
		 * Enable navigation keys
		 */
		enableNavigationKeys: function() {
			var self = this;
			$(window).keydown(function(e) {
				// Next
				if (e.keyCode == 39 || e.keyCode == 40) {
					self.box_skitter.find('.next_button').trigger('click');
				}
				// Prev
				else if (e.keyCode == 37 || e.keyCode == 38) {
					self.box_skitter.find('.prev_button').trigger('click');
				}
			});
		},
		
		/**
		 * Get box clone with background image
		 */
		getBoxCloneBackground: function(options)
		{
			var box_clone = $('<div class="box_clone"></div>');

			box_clone.css({
				'left': 				options.left, 
				'top': 					options.top, 
				'width': 				options.width, 
				'height': 				options.height,
				'background-image': 	'url('+options.image+')', 
				'background-position': 	options.position.left+'px '+options.position.top+'px'
			});

			return box_clone;
		}, 

		/**
		 * Shuffle array
		 * @author Daniel Castro Machado <daniel@cdt.unb.br>
		 */
		shuffleArray: function (arrayOrigem) {
			var self = this;
			var arrayDestino = new Array();
			var indice;
			while (arrayOrigem.length > 0) {
				indice = self.randomUnique(0, arrayOrigem.length - 1);
				arrayDestino[arrayDestino.length] = arrayOrigem[indice];
				arrayOrigem.splice(indice, 1);
			}
			return arrayDestino;
		}, 
		
		/**
		 * Gera números aleatórios inteiros entre um intervalo
		 * @author Daniel Castro Machado <daniel@cdt.unb.br>
		 */
		randomUnique: function (valorIni, valorFim) {
			var numRandom;
			do numRandom = Math.random(); while (numRandom == 1); // Evita gerar o número valorFim + 1
			return (numRandom * (valorFim - valorIni + 1) + valorIni) | 0;
		},
		
		/** 
		 * Stop on window focus out
		 * @author Dan Partac (http://thiagosf.net/projects/jquery/skitter/#comment-355473307)
		 */
		windowFocusOut: function () {
			var self = this;
			$(window).bind('blur', function(){
				self.settings.is_blur = true;
				self.pauseTime();
				self.clearTimer(true);
			});
			$(window).bind('focus', function(){
				if ( self.settings.images_links.length > 1 ) {
					self.settings.is_blur = false;	
					
					if  (self.settings.elapsedTime == 0) {
						self.startTime();
					}
					else {
						self.resumeTime();
					}
					
					if (self.settings.elapsedTime <= self.settings.interval) {
						self.clearTimer(true); // Fix bug IE: double next
						self.timer = setTimeout(function() { self.completeMove(); }, self.settings.interval - self.settings.elapsedTime);
						self.box_skitter.find('.image_main').attr({'src': self.settings.image_atual});
						self.box_skitter.find('.image a').attr({'href': self.settings.link_atual});
					}
				}
			});
		}
		
	});
	
	/**
	 * Helper function for cross-browser CSS3 support, prepends all possible prefixes to all properties passed in
	 * @param {Object} props Ker/value pairs of CSS3 properties
	 */
	$.fn.css3 = function(props) {
		var css = {};
		var prefixes = ['moz', 'ms', 'o', 'webkit'];
		for(var prop in props) {
			// Add the vendor specific versions
			for(var i=0; i<prefixes.length; i++)
				css['-'+prefixes[i]+'-'+prop] = props[prop];
			// Add the actual version	
			css[prop] = props[prop];
		}
		this.css(css);
		return this;
	};
	
    // Monkey patch jQuery 1.3.1+ to add support for setting or animating CSS
    // scale and rotation independently.
    // 2009-2010 Zachary Johnson www.zachstronaut.com
    // Updated 2010.11.06
    var rotateUnits = 'deg';
    
    $.fn.rotate = function (val) {
        var style = $(this).css('transform') || 'none';
        if (typeof val == 'undefined') {
            if (style) {
                var m = style.match(/rotate\(([^)]+)\)/);
                if (m && m[1]) {
                    return m[1];
                }
            }
            return 0;
        }
        var m = val.toString().match(/^(-?\d+(\.\d+)?)(.+)?$/);
        if (m) {
            if (m[3]) rotateUnits = m[3];
            $(this).css('transform',
                style.replace(/none|rotate\([^)]*\)/, '') + 'rotate(' + m[1] + rotateUnits + ')'
            );
        }
        
        return this;
    };
    
    // Note that scale is unitless.
    $.fn.scale = function (val, duration, options) {
        var style = $(this).css('transform');
        if (typeof val == 'undefined') {
            if (style) {
                var m = style.match(/scale\(([^)]+)\)/);
                if (m && m[1]) {
                    return m[1];
                }
            }
            return 1;
        }
        $(this).css('transform',
            style.replace(/none|scale\([^)]*\)/, '') + 'scale(' + val + ')'
        );
        return this;
    };

    // fx.cur() must be monkey patched because otherwise it would always
    // return 0 for current rotate and scale values
    var curProxied = $.fx.prototype.cur;
    $.fx.prototype.cur = function () {
        if (this.prop == 'rotate') {
            return parseFloat($(this.elem).rotate());
        }
        else if (this.prop == 'scale') {
            return parseFloat($(this.elem).scale());
        }
        return curProxied.apply(this, arguments);
    };
    
    $.fx.step.rotate = function (fx) {
        $(fx.elem).rotate(fx.now + rotateUnits);
    };
    
    $.fx.step.scale = function (fx) {
        $(fx.elem).scale(fx.now);
    };
    
    var animateProxied = $.fn.animate;
    $.fn.animate = function (prop) {
        if (typeof prop['rotate'] != 'undefined') {
            var m = prop['rotate'].toString().match(/^(([+-]=)?(-?\d+(\.\d+)?))(.+)?$/);
            if (m && m[5]) {
                rotateUnits = m[5];
            }
            prop['rotate'] = m[1];
        }
        
        return animateProxied.apply(this, arguments);
    };
	
    // Monkey patch jQuery 1.3.1+ css() method to support CSS 'transform'
    // property uniformly across Safari/Chrome/Webkit, Firefox 3.5+, IE 9+, and Opera 11+.
    // 2009-2011 Zachary Johnson www.zachstronaut.com
    // Updated 2011.05.04 (May the fourth be with you!)
    function getTransformProperty(element) {
        var properties = ['transform', 'WebkitTransform', 'msTransform', 'MozTransform', 'OTransform'];
        var p;
        while (p = properties.shift()) {
            if (typeof element.style[p] != 'undefined') {
                return p;
            }
        }
        return 'transform';
    };
    
    var _propsObj = null;
    
    var proxied = $.fn.css;
    $.fn.css = function (arg, val) {
        if (_propsObj === null) {
            if (typeof $.cssProps != 'undefined') {
                _propsObj = $.cssProps;
            }
            else if (typeof $.props != 'undefined') {
                _propsObj = $.props;
            }
            else {
                _propsObj = {};
            }
        }
        if
        (
            typeof _propsObj['transform'] == 'undefined'
            &&
            (
                arg == 'transform'
                ||
                (
                    typeof arg == 'object'
                    && typeof arg['transform'] != 'undefined'
                )
            )
        ) {
            _propsObj['transform'] = getTransformProperty(this.get(0));
        }
        if (_propsObj['transform'] != 'transform') {
            // Call in form of css('transform' ...)
            if (arg == 'transform') {
                arg = _propsObj['transform'];
                if (typeof val == 'undefined' && jQuery.style) {
                    return jQuery.style(this.get(0), arg);
                }
            }
            // Call in form of css({'transform': ...})
            else if
            (
                typeof arg == 'object'
                && typeof arg['transform'] != 'undefined'
            ) {
                arg[_propsObj['transform']] = arg['transform'];
                delete arg['transform'];
            }
        }
        return proxied.apply(this, arguments);
    };

})(jQuery);