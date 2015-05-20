define(['jquery', 'window'], function($, window) {
	'use strict';

	var Public = {
		init: init
	};

	function equalheight (container){
    	var currentTallest = 0,
    	     currentRowStart = 0,
    	     rowDivs = new Array(),
    	     $el,
    	     topPosition = 0;
    	 $(container).each(function() {

    	   $el = $(this);
    	   $($el).height('auto')
    	   topPosition = $el.position().top;

    	   if (currentRowStart != topPosition) {
    	     for (var currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
    	       rowDivs[currentDiv].height(currentTallest);
    	     }
    	     rowDivs.length = 0; // empty the array
    	     currentRowStart = topPosition;
    	     currentTallest = $el.height();
    	     rowDivs.push($el);
    	   } else {
    	     rowDivs.push($el);
    	     currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
    	  }
    	   for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
    	     rowDivs[currentDiv].height(currentTallest);
    	   }

    	 });
        
        // console.log('recalc' + container + ' ' + currentTallest);

        return currentTallest;
	}


    function prepareCols(el) {
        var $this = el.parent().parent().find('.mk-animated-columns');

        var iconHeight  = equalheight('.vc_row .animated-column-icon'),
            titleHeight = equalheight('.vc_row .animated-column-title'),
            descHeight  = equalheight('.vc_row .animated-column-desc'),
            btnHeight   = $this.find('.animated-column-btn').innerHeight();

        // console.log('iconHeight: ' + iconHeight + ' / ' + $this.find('.animated-column-icon').innerHeight());
        // console.log('titleHeight: ' + titleHeight + ' / ' + $this.find('.animated-column-title').innerHeight());
        // console.log('descHeight: ' + descHeight + ' / ' + $this.find('.animated-column-desc').innerHeight());
        // console.log('btnHeight: ' + btnHeight);

        if ($this.hasClass('full-style')) {
            $this.find('.animated-column-item').each(function() {
                var $this = $(this),
                    contentHeight = (iconHeight + 30) + (titleHeight + 10) + (descHeight + 70) + 34;

                $this.height(contentHeight * 1.5 + 50);

                var $box_height = $this.outerHeight(true),
                    $icon_height = $this.find('.animated-column-icon').height();

                $this.find('.animated-column-holder').css({
                    'paddingTop': $box_height / 2 - $icon_height
                });


                $this.animate({opacity:1}, 300);
            });
        } else {
            $this.find('.animated-column-item').each(function() {
                var $this = $(this),
                    $half_box_height = $this.outerHeight(true) / 2,
                    $icon_height = $this.find('.animated-column-icon').outerHeight(true)/2,
                    $title_height = $this.find('.animated-column-simple-title').outerHeight(true)/2;

                $this.find('.animated-column-holder').css({
                    'paddingTop': $half_box_height - $icon_height
                });
                $this.find('.animated-column-title').css({
                    'paddingTop': $half_box_height - $title_height + ($icon_height * 2)
                });

                $this.animate({opacity:1}, 300);

            });
        }
    }

    function init(config) {
        var $this = $('#' + config.id),
            $parent = $this.parent().parent(),
            $columns = $parent.find('.column_container'),
            index = $columns.index($this.parent());
            // really bad that we cannot read it before bootstrap - needs full shortcode refactor

        if($this.hasClass('full-style')) {
        	$this.find('.animated-column-item').hover(
            function() {
                TweenLite.to($(this).find(".animated-column-holder"), 0.5, {
                    top: '-15%',
                    ease: Back.easeOut
                });
                TweenLite.to($(this).find(".animated-column-desc"), 0.5, {
                    top: '-50%',
                    ease: Expo.easeOut
                }, 0.4);
                TweenLite.to($(this).find(".animated-column-btn"), 0.3, {
                    top: '-50%',
                    ease: Expo.easeOut
                }, 0.6);
            },
            function() {

                TweenLite.to($(this).find(".animated-column-holder"), 0.5, {
                    top: '0%',
                    ease: Back.easeOut, easeParams:[3]
                });
                TweenLite.to($(this).find(".animated-column-desc"), 0.5, {
                    top: '100%',
                    ease: Back.easeOut
                }, 0.4);
                TweenLite.to($(this).find(".animated-column-btn"), 0.5, {
                    top: '100%',
                    ease: Back.easeOut
                }, 0.2);
            });
        }

        if($this.hasClass('.simple-style')) {
         	$this.find('.animated-column-item').hover(
            function() {
                TweenLite.to($(this).find(".animated-column-holder"), 0.7, {
                    top: '100%',
                    ease: Expo.easeOut
                });
                TweenLite.to($(this).find(".animated-column-title"), 0.7, {
                    top: '0%',
                    ease: Back.easeOut
                }, 0.2);
            },
            function() {
                TweenLite.to($(this).find(".animated-column-holder"), 0.7, {
                    top: '0%',
                    ease: Expo.easeOut
                });
                TweenLite.to($(this).find(".animated-column-title"), 0.7, {
                    top: '-100%',
                    ease: Back.easeOut
                }, 0.2);
            });
        };

        if($columns.length === index + 1) {
            prepareCols($this);
        }

        $(window).on("resize", function() {
            if($columns.length === index + 1) {
                setTimeout(prepareCols($this), 1000);
            }
        });
    }

	return Public;

});