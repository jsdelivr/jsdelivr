(function ($, window, document, undefined) {
	"use strict";
	var pluginName = "ajaxPortfolio",
		defaults = {
			propertyName: "value"
		};

	function Plugin(element, options) {
		this.element = $(element);
		this.settings = $.extend({}, defaults, options);
		this.init();
		
	}
	Plugin.prototype = {
		init: function () {
			var obj = this;
			this.grid = this.element.find('.mk-portfolio-container'),
			this.items = this.grid.children();

			if (this.items.length < 1) return false; //If no items was found then exit
			this.ajaxDiv = this.element.find('div.ajax-container'),
			this.filter = this.element.find('#mk-filter-portfolio'),
			this.loader = this.element.find('.portfolio-loader'),
			this.triggers = this.items.find('.project-load'),
			this.closeBtn = this.ajaxDiv.find('.close-ajax-container'),
			this.nextBtn = this.ajaxDiv.find('.next-ajax-container'),
			this.prevBtn = this.ajaxDiv.find('.prev-ajax-container'),
			this.api = {},
			this.id = null,
			this.win = $(window),
			this.current = 0,
			this.breakpointT = 989,
			this.breakpointP = 767,
			this.columns = this.grid.data('columns'),
			this.real_col = this.columns;
			this.loader.fadeIn();
			if (this.items.length == 1) {
				this.nextBtn.remove();
				this.prevBtn.remove();
			}
			this.grid.waitForImages(function() {
				//obj.triggers.overlayer();
				obj.loader.fadeOut();
				//obj.set_width();
				//obj.relayout();
				obj.bind_handler();
			});
		},
		/*relayout: function () {
			if (this.grid.hasClass('.isotope'))
				this.grid.isotope('reLayout');
			else
				this.grid.isotope().fadeTo(500, 1);
		},*/
		bind_handler: function () {
			var obj = this; // Temp instance of this object
			// Bind the filters with isotope
			obj.filter.find('a').click(function () {
				obj.triggers.removeClass('active');
				obj.grid.removeClass('grid-open');
				obj.close_project();
				obj.filter.find('a').removeClass('active_sort');
				$(this).addClass('active_sort');
				var selector = $(this).attr('data-filter');
				obj.grid.isotope({
					filter: selector
				});
				return false;
			});
			
			obj.triggers.on('click', function(){
				
				var clicked = $(this),
					clickedParent = clicked.parent();
				
				obj.current = clickedParent.index();
				
				if(clicked.hasClass('active'))
					return false;
				
				obj.close_project();
				
				obj.triggers.removeClass('active');
				clicked.addClass('active');
				obj.grid.addClass('grid-open');
				obj.loader.fadeIn();
				
				obj.id = clicked.data('post-id');
				
				obj.load_project();
				
				return false;
				
			});
			
			obj.nextBtn.on('click', function(){
				if(obj.current == obj.triggers.length-1) {
					obj.triggers.eq(0).trigger('click');
					return false;
				}
				else {
					obj.triggers.eq(obj.current + 1).trigger('click');
					return false;
				}
					
			});
			
			obj.prevBtn.on('click', function(){
				if(obj.current == 0) {
					obj.triggers.eq(obj.triggers.length-1).trigger('click');
					return false;
				}
				else {
					obj.triggers.eq(obj.current - 1).trigger('click');
					return false;
				}
					
			});
			
			// Bind close button
			obj.closeBtn.on('click', function(){
				obj.close_project();
				obj.triggers.removeClass('active');
				obj.grid.removeClass('grid-open');
				return false;
			});
			
			// Calculate the widths amd relayout the grid when window size changes
			obj.win.on('debouncedresize', function () {
				//obj.set_width();
				obj.relayout();
			});
			
		},
		// Function to close the ajax container div
		close_project: function(){
			var obj = this, // Temp instance of this object
				video = obj.ajaxDiv.find('iframe'),
				src = video.attr('src'),
				project = obj.ajaxDiv.find('.ajax_project'),
				newH = project.actual('outerHeight');
			
			obj.ajaxDiv.find('video, audio').each(function() {
				this.player.pause()
			});

			video.attr( 'src', '' );
			//video.attr( 'src', src );
			if(obj.ajaxDiv.height() > 0) {
				obj.ajaxDiv.css('height', newH+'px').transition({
					height: 0,
					opacity: 0
				}, 400);
			}
			else {
				obj.ajaxDiv.transition({
					height: 0,
					opacity: 0
				}, 400);
			}
		},		
		load_project: function(){
			var obj = this;
			$.post(ajaxurl, {
				action	:		'mk_ajax_portfolio',
				id		:		obj.id
			}, function (response) {
				obj.ajaxDiv.find('.ajax_project').remove();
				obj.ajaxDiv.append(response);
				obj.project_factory();
			});			
		},
		project_factory:function(){
			var obj = this,
				project = this.ajaxDiv.find('.ajax_project'),
				slider = project.find('.project_flexslider'),
				gallery	= project.find('.gallery-inner');
			
			/*obj.ajaxDiv.css({
				'display': 'block',
				opacity: 0,
				height:0
			});*/
			
			project.waitForImages(function() {
				$('html:not(:animated),body:not(:animated)').animate({ scrollTop: obj.grid.offset().top - 82 }, 500);
				slider.fitVids();
				if(jQuery().mediaelementplayer)
					slider.find('audio, video').mediaelementplayer({
						videoWidth: '100%',
						videoHeight: '100%',
						audioWidth: '99.6%',
						audioHeight: 300,
						videoVolume: 'horizontal'
					});
				if(gallery.length){
					gallery.sGallery();
				}
				slider.flexslider({
					selector: ".project_slides > li",
					smoothHeight: true,
					animation: 'slide',
					animationLoop: false,
					video: true,
					controlNav: false,
					slideshow: false,
					before: function(slideshow){
						var ul = slideshow.container ? slideshow.container : '';
						if(ul.length)
							ul.parent().removeClass('animating-height');
					},
					after: function(slideshow){
						var index = slideshow.currentSlide,
							ul = slideshow.container ? slideshow.container : '';
							if(ul.length) {
								var	isgal = ul.find('> li').eq(index).find(' > div ').hasClass('gallery-block');
								if(isgal )
									ul.parent().addClass('animating-height');
							}
					},
					start: function(slideshow){
						var index = slideshow.currentSlide,
							ul = slideshow.container ? slideshow.container : '';
							if(ul.length) {
								var	isgal = ul.find('> li').eq(index).find(' > div ').hasClass('gallery-block');
								if(isgal )
									ul.parent().addClass('animating-height');
							}
							
					}
					
				});
				obj.loader.fadeOut(function(){
					var newH = project.actual('outerHeight');
					obj.ajaxDiv.transition({
						opacity: 1,
						height:newH
					}, 400, function(){
						obj.ajaxDiv.css({height:'auto'});
					});
				});
				
			});
			
		},

	};
	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
		});
	};
})(jQuery, window, document);


jQuery(document).ready(function ($) {
	$('.portfolio-grid').ajaxPortfolio();

});



