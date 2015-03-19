/*
 * DC jQuery Slick - jQuery Slick
 * Copyright (c) 2011 Design Chemical
 * 	http://www.designchemical.com
 *
 * Dual licensed under the MIT and GPL licenses:
 * 	http://www.opensource.org/licenses/mit-license.php
 * 	http://www.gnu.org/licenses/gpl.html
 *
 */

(function($){

	//define the new for the plugin ans how to call it
	$.fn.dcSocialSlick = function(options) {

		//set default options
		var defaults = {
			classWrapper: 'dc-social-slick',
			classContent: 'dc-social-slick-content',
			idWrapper: 'dc-social-slick-'+$(this).index(),
			location: 'left',
			align: 'top',
			offset: '100px',
			speed: 'slow',
			tabText: 'Click',
			classTab: 'tab',
			classOpen: 'slick-open',
			classClose: 'slick-close',
			classToggle: 'slick-toggle',
			autoClose: true,
			loadOpen: false,
			onLoad : function() {},
            beforeOpen : function() {},
			beforeClose: function() {}
		};

		//call in the default otions
		var options = $.extend(defaults, options);
		var $dcSlickObj = this;
		//act upon the element that is passed into the design
		return $dcSlickObj.each(function(options){

			// declare variables
			var clWrap = defaults.classWrapper;
			var idWrapper = defaults.idWrapper;
			var slickTab = '<div class="'+defaults.classTab+'"><span>'+defaults.tabText+'</span></div>';
			
			$(this).addClass(defaults.classContent).wrap('<div id="'+idWrapper+'" class="'+clWrap+'" />');
			
			var $slider = $('#'+idWrapper);
			$slider.prepend(slickTab);
			var $tab = $('.'+defaults.classTab,$slider);
			$tab.css({position: 'absolute'});
			var linkOpen = $('.'+defaults.classOpen);
			var linkClose = $('.'+defaults.classClose);
			var linkToggle = $('.'+defaults.classToggle);
			
			// Get container dimensions
			var height = $slider.height();
			$slider.css('float','left');
			var outerW = $slider.outerWidth();
			var widthPx = outerW+'px';
			$slider.css('float','none');
			var outerH = $slider.outerHeight();
			var padH = outerH - height;
			var heightPx = outerH+'px';
			var bodyHeight = $(window).height();
			
			slickSetup($slider);
			
			if(defaults.autoClose == true){
				$('body').mouseup(function(e){
					if($slider.hasClass('active')){
						if(!$(e.target).parents('#'+defaults.idWrapper).length){
							if(!($(e.target).hasClass(defaults.classOpen) || $(e.target).hasClass(defaults.classToggle))){
								slickClose();
							}
						}
					}
				});
			}
			
			$tab.click(function(){
				if($slider.hasClass('active')){
					slickClose();
				} else {
					slickOpen();
				}
			});
			
			$(linkOpen).click(function(e){
				slickOpen();
				e.preventDefault();
			});
			
			$(linkClose).click(function(e){
				if($slider.hasClass('active')){
					slickClose();
				}
				e.preventDefault();
			});
			
			$(linkToggle).click(function(e){
				if($slider.hasClass('active')){
					slickClose();
				} else {
					slickOpen();
				}
				e.preventDefault();
			});
			
			if(defaults.loadOpen == true){
				slickOpen();
			}
	
			function slickOpen(){
			
				$('.'+clWrap).css({zIndex: 10000});
				$slider.css({zIndex: 10001});
				if(defaults.location == 'bottom'){
					$slider.animate({marginBottom: "-=5px"}, "fast").animate({marginBottom: 0}, defaults.speed);
				}
				if(defaults.location == 'top'){
					$slider.animate({marginTop: "-=5px"}, "fast").animate({marginTop: 0}, defaults.speed);
				}
				if(defaults.location == 'left'){
					$slider.animate({marginLeft: "-=5px"}, "fast").animate({marginLeft: 0}, defaults.speed);
				}
				if(defaults.location == 'right'){
					$slider.animate({marginRight: "-=5px"}, "fast").animate({marginRight: 0}, defaults.speed);
				}
				$slider.addClass('active');
				
				// onOpen callback;
				defaults.beforeOpen.call(this);
			}
			
			function slickClose(){
			
			$slider.css({zIndex: 10000});
			if($slider.hasClass('active')){
				var params = {"marginBottom": "-"+heightPx};
				switch (defaults.location) {
					case 'top': 
					params = {"marginTop": "-"+heightPx};
					break;
					case 'left':
					params = {"marginLeft": "-"+widthPx};					
					break;
					case 'right': 
					params = {"marginRight": "-"+widthPx};
					break;
				}
				$slider.removeClass('active').animate(params, defaults.speed);
			}
			// onClose callback;
			defaults.beforeClose.call(this);
			}
			
			function slickSetup(obj){
				
				var $container = $('.'+defaults.classContent,obj);
				$(obj).addClass(defaults.location).addClass('align-'+defaults.align).css({position: 'fixed', zIndex: 10000});
				// Get slider border
				var bdrTop = $slider.css('border-top-width');
				var bdrRight = $slider.css('border-right-width');
				var bdrBottom = $slider.css('border-bottom-width');
				var bdrLeft = $slider.css('border-left-width');
				// Get tab dimension
				var $tab = $('.'+defaults.classTab,$slider);
				var tabWidth = $tab.outerWidth(true);
				var tabWidthPx = tabWidth+'px';
				var tabHeight = $tab.outerHeight(true);
				var tabHeightPx = tabHeight+'px';
				// Calc max container dimensions
				var containerH = $container.height();
				var containerPad = $container.outerHeight(true)-containerH;
				var maxHeight = bodyHeight - tabHeight;
				
				if(outerH > maxHeight){
					containerH = maxHeight - padH - containerPad;
					heightPx = maxHeight+'px';
				}
				$container.css({height: containerH+'px'});
				
				// Default params for location 'left'
				var params = {marginLeft: '-'+widthPx, top: defaults.offset};
				var paramsTab = {marginRight: '-'+tabWidthPx}
				
				if(defaults.location == 'right'){
					params = {marginRight: '-'+widthPx, top: defaults.offset};
					paramsTab = {marginLeft: '-'+tabWidthPx};
				}
				
				if(defaults.location == 'top'){
					params = {marginTop: '-'+heightPx};
					paramsTab = {marginBottom: '-'+tabHeightPx};
					
					if(defaults.align == 'left'){
						params = {marginTop: '-'+heightPx, left: defaults.offset};
						paramsTab = {marginBottom: '-'+tabHeightPx, left: 0};
					} else {
						params = {marginTop: '-'+heightPx, right: defaults.offset};
						paramsTab = {marginBottom: '-'+tabHeightPx, right: 0};
					}
				}
				
				if(defaults.location == 'bottom'){
					params = {marginBottom: '-'+heightPx};
					paramsTab = {marginTop: '-'+tabHeightPx};
					
					if(defaults.align == 'left'){
						params = {marginBottom: '-'+heightPx, left: defaults.offset};
						paramsTab = {marginTop: '-'+tabHeightPx, left: 0};
					} else {
						params = {marginBottom: '-'+heightPx, right: defaults.offset};
						paramsTab = {marginTop: '-'+tabHeightPx, right: 0};
					}
				}
				$(obj).css(params);
				$tab.css(paramsTab);
				// onLoad callback;
				defaults.onLoad.call(this);
			}

		});
	};
})(jQuery);

jQuery(document).ready(function($) {
	$('.pinItButton').click(function(){
		exec_pinmarklet();
	});
});