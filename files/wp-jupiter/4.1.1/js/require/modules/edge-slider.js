define(['jquery', 'window'], function($, win) {
	'use strict';

	var Public = {
		init: init
	};

    function init(config) {
	    var $slider_wrapper = $('#' + config.id),
	      $theme_container = $('#mk-theme-container'),
	      $next_arrow = $slider_wrapper.find('.mk-edge-next'),
	      $prev_arrow = $slider_wrapper.find('.mk-edge-prev'),
	      $pause = $slider_wrapper.attr('data-pause'),
	      $first_el = $slider_wrapper.attr('data-first'),
	      $speed = $slider_wrapper.attr('data-speed'),
	      $animation = $slider_wrapper.attr('data-animation'),
	      $height = $slider_wrapper.attr('data-height'),
	      $fullHeight = $slider_wrapper.attr('data-fullHeight'),
	      $header_height = 0,
	      edge_height = 0,
	      adminbar = 0,
	      loop = true,
	      $pagination = $slider_wrapper.attr('data-pagination') == "true" ? true : false;

	    if ($pagination === true) {
	      var $pagination_class = '#' + $slider_wrapper.attr('id') + ' .swiper-pagination';

	      $($pagination_class).on('click', 'span', function() {
	        mk_swiper.swipeTo($(this).index(), 500);
	      });

	      $slider_wrapper.find('.edge-skip-slider').css('bottom', '14%');
	    } else {
	      var $pagination_class = false;
	    }


	    if($animation == "kenburned") {
	      loop = false;
	    }


	    var animationDimensions = function() {
	    	mk_edge_slider_resposnive(config)
	        if ($.exists('#mk-header.sticky-header') && !$('#mk-header').hasClass('transparent-header')) {
	            $header_height = parseInt($('#mk-header.sticky-header').attr('data-sticky-height'));
	        }
	        if ($.exists('#wpadminbar')) {
	            adminbar = $('#wpadminbar').height();
	        }
	        if ($fullHeight === 'true') {
	            edge_height = $(window).height() - $header_height - adminbar;
	        } else {
	            edge_height = $height;
	        }
	        // console.log('edge_height: ' + edge_height);
	    }

	    $(window).load(animationDimensions());

	    $(window).on("debouncedresize", function(event) {
	        setTimeout(function() {
	            animationDimensions();
	        }, 50);
	    });


	    $slider_wrapper.find('.mk-animate-element').removeClass('mk-animate-element fade-in scale-up right-to-left left-to-right bottom-to-top top-to-bottom flip-x flip-y');

	    var mk_swiper = $slider_wrapper.swiper({
	      mode: 'horizontal',
	      loop: loop,
	      grabCursor: true,
	      useCSS3Transforms: true,
	      mousewheelControl: false,
	      pagination: $pagination_class,
	      paginationClickable: true,
	      freeModeFluid: true,
	      speed: $speed,
	      autoplay: $pause,
	      progress: true,
	      autoplayDisableOnInteraction: false,
	      onSwiperCreated: function(swiper) {

	        var current_eq, prev_eq, next_eq;
	        if(loop == false) {
	          current_eq = 0;
	          prev_eq = swiper.slides.length - 1;
	          next_eq = 1;
	        } else {
	          current_eq = 1;
	          prev_eq = 0;
	          next_eq = 2;           
	        }

	        if ($theme_container.hasClass('mk-transparent-header')) {
	          if ($first_el == 'true') {
	            $('#mk-header.transparent-header').removeClass('light-header-skin dark-header-skin').addClass($slider_wrapper.find('.swiper-slide').eq(current_eq).attr('data-header-skin') + '-header-skin');
	          }
	        }

	        var currentSlide = $slider_wrapper.find('.swiper-slide').eq(current_eq),
	          currentSkin = $slider_wrapper.find('.swiper-slide').eq(current_eq).attr("data-header-skin");

	        //if ($first_el == 'true') {    
	        $('.mk-edge-nav a').attr('data-skin', currentSkin);
	        $('.swiper-pagination').attr('data-skin', currentSkin);
	        $('.edge-skip-slider').attr('data-skin', currentSkin);
	        //}

	        // if (mk_detect_ie() == false) {

	          var prev_active_slide = $slider_wrapper.find('.swiper-slide').eq(prev_eq).find('.edge-slide-content .edge-title').text(),
	            next_active_slide = $slider_wrapper.find('.swiper-slide').eq(next_eq).find('.edge-slide-content .edge-title').text();
	          //console.log(prev_active_slide + "---" + next_active_slide);
	          var prev_active_slide_bg = $slider_wrapper.find('.swiper-slide').eq(prev_eq).find('.mk-section-image').css('background-image'),
	            next_active_slide_bg = $slider_wrapper.find('.swiper-slide').eq(next_eq).find('.mk-section-image').css('background-image');
	          // console.log(prev_active_slide_bg + "---" + next_active_slide_bg);
	          var prev_active_slide_bg_video = $slider_wrapper.find('.swiper-slide').eq(prev_eq).find('.mk-video-section-touch').css('background-image'),
	            next_active_slide_bg_video = $slider_wrapper.find('.swiper-slide').eq(next_eq).find('.mk-video-section-touch').css('background-image');

	          //console.log(prev_active_slide_bg_video);
	          //console.log(next_active_slide_bg_video);

	          var prev_active_slide_bg_color = $slider_wrapper.find('.swiper-slide').eq(prev_eq).find('.mk-section-image').css('background-color'),
	            next_active_slide_bg_color = $slider_wrapper.find('.swiper-slide').eq(next_eq).find('.mk-section-image').css('background-color');

	          if (prev_active_slide.length > 1) {
	            $prev_arrow.find('.prev-item-caption').show().text(prev_active_slide);
	            // console.log(prev_active_slide);
	          }

	          if (typeof prev_active_slide_bg !== 'undefined' && prev_active_slide_bg != "none") {
	            $prev_arrow.find('.edge-nav-bg').show().css({
	              'background-image': prev_active_slide_bg
	            });
	            // console.log(prev_active_slide_bg);
	          } else if (typeof prev_active_slide_bg_video !== 'undefined' && prev_active_slide_bg_video != "none") {
	            $prev_arrow.find('.edge-nav-bg').show().css({
	              'background-image': prev_active_slide_bg_video
	            });
	            // console.log(prev_active_slide_bg_video);
	          } else if (prev_active_slide_bg_color !== 'undefined') {
	            $prev_arrow.find('.edge-nav-bg').show().css({
	              'background-color': prev_active_slide_bg_color
	            });
	            // console.log(prev_active_slide_bg_color);
	          }

	          if (typeof next_active_slide !== 'undefined') {
	            $next_arrow.find('.next-item-caption').show().text(next_active_slide);
	          }

	          if (typeof next_active_slide_bg !== 'undefined' && next_active_slide_bg != "none") {
	            $next_arrow.find('.edge-nav-bg').show().css({
	              'background-image': next_active_slide_bg
	            });
	          } else if (typeof next_active_slide_bg_video !== 'undefined' && next_active_slide_bg_video != "none") {
	            $next_arrow.find('.edge-nav-bg').show().css({
	              'background-image': next_active_slide_bg_video
	            });
	          } else if (typeof next_active_slide_bg_color !== 'undefined') {
	            $next_arrow.find('.edge-nav-bg').show().css({
	              'background-color': next_active_slide_bg_color
	            });
	          }

	          if (!$('#mk-header').hasClass('transparent-header-sticky')) {
	            if ($first_el == 'true') {
	              $('#mk-header.transparent-header').removeClass('light-header-skin dark-header-skin').addClass($slider_wrapper.find('.swiper-slide').eq(current_eq).attr('data-header-skin') + '-header-skin');
	            }
	          }



	        // } else {
	        //   $next_arrow.find('.next-item-caption, .edge-nav-bg').css('display', 'none');
	        //   $prev_arrow.find('.prev-item-caption, .edge-nav-bg').css('display', 'none');
	        // }

	        if ($pagination === true) {
	          $('#' + $slider_wrapper.attr('id') + ' .swiper-pagination span').append('<a href="#"></a>');
	        }


	      },
	      onSlideChangeEnd: function() {


	        var current_eq, prev_eq, next_eq;
	        if(loop == false) {
	          current_eq = mk_swiper.activeIndex;
	          prev_eq = mk_swiper.activeIndex -1 ;
	          next_eq = mk_swiper.activeIndex + 1;

	          if(prev_eq < 0) {
	            prev_eq = mk_swiper.slides.length - 1;
	          }
	          if(next_eq > mk_swiper.slides.length - 1) {
	            next_eq = 0;
	          }
	        } else {
	          current_eq = mk_swiper.activeLoopIndex + 1;
	          prev_eq = mk_swiper.activeLoopIndex;
	          next_eq = mk_swiper.activeLoopIndex + 2;           
	        }

	        if ($theme_container.hasClass('mk-transparent-header')) {
	          if ($first_el == 'true') {
	            $('#mk-header.transparent-header').removeClass('light-header-skin dark-header-skin').addClass($(mk_swiper.getSlide(current_eq)).attr('data-header-skin') + '-header-skin');
	          }
	        }

	        // if (mk_detect_ie() == false) {

	          var currentSlide = $(mk_swiper.activeSlide()),
	            currentSkin = currentSlide.attr("data-header-skin");

	          //if ($first_el == 'true') {    
	          $('.mk-edge-nav a').attr('data-skin', currentSkin);
	          $('.swiper-pagination').attr('data-skin', currentSkin);
	          $('.edge-skip-slider').attr('data-skin', currentSkin);
	          //  }

	          var prev_active_slide = $(mk_swiper.getSlide(prev_eq)).find('.edge-slide-content .edge-title').text(),
	            next_active_slide = $(mk_swiper.getSlide(next_eq)).find('.edge-slide-content .edge-title').text();

	          var prev_active_slide_bg = $(mk_swiper.getSlide(prev_eq)).find('.mk-section-image').css('background-image'),
	            next_active_slide_bg = $(mk_swiper.getSlide(next_eq)).find('.mk-section-image').css('background-image');

	          var prev_active_slide_bg_video = $(mk_swiper.getSlide(prev_eq)).find('.mk-video-section-touch').css('background-image'),
	            next_active_slide_bg_video = $(mk_swiper.getSlide(next_eq)).find('.mk-video-section-touch').css('background-image');

	          var prev_active_slide_bg_color = $(mk_swiper.getSlide(prev_eq)).find('.mk-section-image').css('background-color'),
	            next_active_slide_bg_color = $(mk_swiper.getSlide(next_eq)).find('.mk-section-image').css('background-color');

	          if (typeof prev_active_slide !== 'undefined') {
	            $prev_arrow.find('.prev-item-caption').show().text(prev_active_slide);
	            // console.log(prev_active_slide);
	          }

	          if (typeof prev_active_slide_bg !== 'undefined' && prev_active_slide_bg != "none") {
	            $prev_arrow.find('.edge-nav-bg').show().css({
	              'background-image': prev_active_slide_bg
	            });
	            // console.log(prev_active_slide_bg);
	          } else if (typeof prev_active_slide_bg_video !== 'undefined' && prev_active_slide_bg_video != "none") {
	            $prev_arrow.find('.edge-nav-bg').show().css({
	              'background-image': prev_active_slide_bg_video
	            });
	            // console.log(prev_active_slide_bg_video);
	          } else if (typeof prev_active_slide_bg_color !== 'undefined') {
	            $prev_arrow.find('.edge-nav-bg').show().css({
	              'background-color': prev_active_slide_bg_color
	            });
	            // console.log(prev_active_slide_bg_color);
	          }

	          if (typeof next_active_slide !== 'undefined') {
	            $next_arrow.find('.next-item-caption').show().text(next_active_slide);
	          }

	          if (typeof next_active_slide_bg !== 'undefined' && next_active_slide_bg != "none") {
	            $next_arrow.find('.edge-nav-bg').show().css({
	              'background-image': next_active_slide_bg
	            });
	          } else if (typeof next_active_slide_bg_video !== 'undefined' && next_active_slide_bg_video != "none") {
	            $next_arrow.find('.edge-nav-bg').show().css({
	              'background-image': next_active_slide_bg_video
	            });
	          } else if (typeof next_active_slide_bg_color !== 'undefined') {
	            $next_arrow.find('.edge-nav-bg').show().css({
	              'background-color': next_active_slide_bg_color
	            });
	          }

	          if (!$('#mk-header').hasClass('transparent-header-sticky')) {
	            if ($first_el == 'true') {
	              $('#mk-header.transparent-header').removeClass('light-header-skin dark-header-skin').addClass($(mk_swiper.getSlide(current_eq)).attr('data-header-skin') + '-header-skin');
	            }
	          }


	        // } else {
	        //   $next_arrow.find('.next-item-caption, .edge-nav-bg').css('display', 'none');
	        //   $prev_arrow.find('.prev-item-caption, .edge-nav-bg').css('display', 'none');
	        // }

	      },    
	      onProgressChange: function(swiper){
	                for (var i = 0; i < swiper.slides.length; i++){

	                    var slide = swiper.slides[i];
	                    var progress = slide.progress;

	                    // SLIDER ANIMATION EFFECTS

	                    if($animation == "horizontal_curtain") {
	                        var translateX, zIndex, transitionTiming;
	                            translateX = progress*swiper.width;

	                        if (progress<=0) {
	                            zIndex = 1;
	                            translateX = 0;
	                            transitionTiming = 'ease';
	                        }
	                        else if (progress>0){
	                            zIndex = 0;
	                            translateX = (progress*swiper.width)/2;
	                            transitionTiming = 'ease';
	                        }

	                        swiper.setTransform(slide,'translate3d('+(translateX/2)+'px,0,0)');
	                        slide.style.webkitTransitionTimingFunction = transitionTiming;
	                        slide.style.zIndex = zIndex;
	                    }

	                    if($animation == "perspective_flip") {
	                        var translateX, translateY, rotateX;

	                            translateX = progress*swiper.width;
	                            translateY = progress*edge_height;

	                        if (progress>=0) {
	                            rotateX = 0;
	                        }
	                        else if (progress<0){
	                            rotateX = 70;
	                        }

	                        swiper.setTransform(slide,'translate3d('+translateX+'px,'+ (-translateY) +'px,0) rotateX('+rotateX+'deg)');
	                    }

	                    if($animation == "vertical_slide") {
	                        var translateX, translateY;

	                            translateX = progress*swiper.width;
	                            translateY = progress*edge_height;

	                        swiper.setTransform(slide,'translate3d('+translateX+'px,'+ (-translateY) +'px,0)');
	                    }

	                    if($animation == "fade") {
	                        var translate, opacity, zIndex;

	                        if (progress == 0) {
	                            zIndex = 1;
	                        }
	                        else {
	                            zIndex = 0;
	                        }
	                            opacity = 1 - Math.min(Math.abs(progress),1);
	                            translate = progress*swiper.width;

	                        swiper.setTransform(slide,'translate3d('+translate+'px,0,0)');
	                        slide.style.opacity = opacity;
	                        slide.style.zIndex = zIndex;
	                    }

	                    if($animation == "kenburned") {
	                        var translateX, opacity, zIndex;

	                        if (progress == 0) {
	                            zIndex = 1;
	                        }
	                        else {
	                            zIndex = 0;
	                        }

	                            translateX = progress*swiper.width;
	                            opacity = 1 - Math.min(Math.abs(progress),1);

	                        swiper.setTransform(slide,'translate3d('+translateX+'px,0,0)');
	                        slide.style.opacity = opacity;
	                        slide.style.zIndex = zIndex;

	                    }

	                    if($animation == "zoom_out") {
	                        var scale, translateX, translateY, opacity, zIndex;

	                            translateX = progress*swiper.width;

	                        if (progress<=0) {
	                            opacity = 1;
	                            scale = 1;
	                            zIndex = 1;
	                            translateY = progress*edge_height;
	                        }
	                        else if (progress>0){
	                            opacity = (1 - Math.min(Math.abs(progress),1))/2;
	                            scale = 1 - Math.min(Math.abs(progress/2),1);
	                            zIndex = 0;
	                            translateY = 0;
	                        }

	                        swiper.setTransform(slide,'translate3d('+translateX+'px,'+ -translateY +'px,0)  scale('+scale+')');
	                        slide.style.opacity = opacity;
	                        slide.style.zIndex = zIndex;
	                    }

	                    if($animation == "zoom") {
	                        var scale, scaleContent, translate, opacity, zIndex;

	                        if (progress == 0) {
	                            zIndex = 1;
	                        }
	                        else {
	                            zIndex = 0;
	                        }

	                        if (progress<=0) {
	                            opacity = 1 - Math.min(Math.abs(progress),1);
	                            scale = 1 - Math.min(Math.abs(progress/12),1);
	                            scaleContent = 1;
	                            translate = progress*swiper.width;
	                        }
	                        else {
	                            opacity = 0;
	                            scale = 1 + Math.min(Math.abs(progress/6),1);
	                            translate = progress*swiper.width;
	                        }

	                        // console.log(progress)

	                        slide.style.opacity = opacity;
	                        slide.style.zIndex = zIndex;
	                        swiper.setTransform(slide,'translate3d('+translate+'px,0,0) scale('+scale+')');
	                    }

	                }
	              },
	              onTouchStart:function(swiper){
	                for (var i = 0; i < swiper.slides.length; i++){
	                  swiper.setTransition(swiper.slides[i], 0);
	                }
	              },
	              onSetWrapperTransition: function(swiper, speed) {
	                for (var i = 0; i < swiper.slides.length; i++){
	                  swiper.setTransition(swiper.slides[i], speed);
	                }
	              }
	    });

	    if(loop == true) {
	      $prev_arrow.click(function(e) {
	        mk_swiper.swipePrev();
	        e.preventDefault();
	      });

	      $next_arrow.click(function(e) {
	        mk_swiper.swipeNext();
	        e.preventDefault();
	      });
	    } else {
	      var first_eq = 0,
	          last_eq = mk_swiper.slides.length - 1;

	      $prev_arrow.click(function(e) {
	        var current_eq = mk_swiper.activeIndex;
	        if(current_eq == first_eq) {
	          mk_swiper.swipeTo(last_eq);
	        } else {
	          mk_swiper.swipePrev();
	        }
	        e.preventDefault();
	      });

	      $next_arrow.click(function(e) {
	        var current_eq = mk_swiper.activeIndex;
	        if(current_eq == last_eq) {
	          mk_swiper.swipeTo(first_eq);
	        } else {
	          mk_swiper.swipeNext();
	        }
	        e.preventDefault();
	      });
	    }
	}


	function mk_edge_slider_resposnive(config) {

	  "use strict";

	    var $this = $('#' + config.id),
	      $items = $this.find('.edge-slider-holder, .swiper-slide'),
	      $height = $this.attr('data-height'),
	      $fullHeight = $this.attr('data-fullHeight'),
	      $skip_header_fix = 0,
	      $header_height = 0;

	    var $window_height = $(window).outerHeight();


	    if ($.exists('#wpadminbar')) {
	      $header_height += $('#wpadminbar').outerHeight();
	    }


	    /* if ($.exists('.mk-header-toolbar')) {
	      $header_height += $('.mk-header-toolbar').outerHeight();
	    }*/


	    if (!$('#mk-theme-container').hasClass('mk-transparent-header') && $.exists('.mk-header-holder')) {
	      $skip_header_fix += parseInt($('#mk-header').attr('data-height'));
	      $header_height += $skip_header_fix;
	    }


	    if ($(window).width() < 780) {

	      $window_height = 600;

	    } else if ($fullHeight == 'true') {

	      $window_height = $window_height - $header_height;

	    } else {

	      $window_height = $height;
	    }

	    $items.css('height', $window_height);

	    $this.find('.swiper-slide').each(function() {


	      var $this = $(this),
	        $content = $this.find('.edge-slide-content');

	      if ($this.hasClass('left_center') || $this.hasClass('center_center') || $this.hasClass('right_center')) {

	        var $this_height_half = $content.outerHeight() / 2;
	        if ($content.outerHeight() < $window_height) {
	          var $window_half = $window_height / 2;
	          $content.css('marginTop', ($window_half - $this_height_half));
	        }

	      }

	      if ($this.hasClass('left_bottom') || $this.hasClass('center_bottom') || $this.hasClass('right_bottom')) {

	        if ($content.outerHeight() < $window_height) {
	          var $distance_from_top = $window_height - $content.outerHeight() - 90;
	          $content.css('marginTop', ($distance_from_top));
	        }
	      }


	    });

	    var header_padding_fix = 0;
	    header_padding_fix = parseInt($('#mk-header').attr('data-sticky-height'));

	    if ($('.mk-nav-responsive-link').css('display') != 'none') {
	      $skip_header_fix += parseInt($('#mk-header').attr('data-height'));
	      header_padding_fix = 0;
	    }

	    // console.log($header_height);
	    var skip = $window_height - header_padding_fix + $skip_header_fix;


	    $this.find('.edge-skip-slider').bind("click", function(e) {
	      $("html, body").stop().animate({ scrollTop: skip }, 1000, "easeInOutExpo");
	      e.preventDefault();
	    });

	    $this.find('.edge-slider-loading').fadeOut();

	}


    return Public;
});
