// JavaScript Document

/*
Plugin: Sideswap v 1.0.1
Author: BrianBlocker.com
Tools: Dreamweaver CS4 / 2009 iMac (early edition) / 2009 Mac Mini (late edition)
*/

(function($)
{					
	$.fn.sideswap = function(options)
	{
		$.fn.sideswap.defaults = 
		{
			navigation: true, /* CREATE LEFT AND RIGHT NAVIGATION IF TRUE, OR DO NOTHING IF FALSE */
			previous: 'prev', /* HTML TO BE USED FOR THE PREVIOUS ARROW */
			next: 'next', /* HTML TO BE USED FOR THE NEXT ARROW */
			display_time: 5000, /* NUMBER OF 1/1000 SECONDS AN IMAGE IS DISPLAYED */
			transition_speed: 200, /* SPEED OF TRANSITIONS IN 1/1000 SECONDS */
			auto_run: true /* AUTOMATICALLY TRANSITIONS THE SLIDES (IF TRUE) */
		};
				
		var opts = $.extend({}, $.fn.sideswap.defaults, options), /* PUTS ALL THE DEFAULT VALUES INTO A VARIABLE */
				clicked = false; /* TRUE AFTER A PREVIOUS OR NEXT BUTTON HAS BEEN CLICKED, HELPS PREVENT ERRORS */
		
		return this.each(function()
		{
			/* VARIABLES */
			var $this = $(this), /* SETS A "GLOBAL" VARIABLE FOR THE CURRENT MATCHED OBJECT */
					$parent = $this.parent(), /* SETS A "GLOBAL" VARIABLE FOR THE MATCHED OBJECT'S PARENT */
					timer = false, /* THE SETINTERVAL FUNCTION IDENTIFIER */
					$images = $this.children(), /* THE IMAGES TO BE ROTATED */
					count = $images.size(); /* THE TOTAL NUMBER OF IMAGES THAT WILL BE ROTATED */
			
			/* SETUP THE IMAGES */
			setup();			
			
			/* SETS UP THE IMAGE DISPLAYS */
			function setup()
			{
				/* OVERRIDE THE CSS STYLES */
				$this.css('position','relative');
				$images.css({"position":"absolute","top":"0px","left":"0px"}).removeClass('hide').hide();
				$this.children(':first').show();
							
				/* CALL THE FUNCTION TO CREATE THE NAVIGATION */
				if(opts.navigation && count > 1)
				{
					createNavigation();
				}
				
				/* SET THE ROTATOR TO RUN AUTOMATICALLY IF AUTO IS TRUE, AND MORE THAN 1 OBJECT EXISTS TO ROTATE */
				if(opts.auto_run && count > 1)
				{
					initiateInterval();
					
					/* PAUSE THE ROTATOR WHEN THE USER HAS THEIR MOUSE OVER AN IMAGE */
					$parent.hover(function()
					{
						clearInterval(timer);
					},function()
					{
						initiateInterval();
					});
				}
			}
			
			/* CONSTRUCTOR */
			function rotate(direction)
			{
				var $current_image = $this.children(':visible:first') == 'undefined' ? $this.children(':first') : $this.children(':visible:first'),
						$previous_image = $current_image.prev() == 'undefined' || $current_image.prev().html() == null ? $this.children(':last') : $current_image.prev(),
						$next_image = $current_image.next() == 'undefined' || $current_image.next().html() == null ? $this.children(':first') : $current_image.next();
				
				if(count > 1)
				{
					$current_image.fadeOut(opts.duration);
					
					switch(direction)
					{
						case -1:
							$previous_image.fadeIn(opts.duration,function()
							{
								clicked = false;
							});
							break;
						default:
							$next_image.fadeIn(opts.duration,function()
							{
								clicked = false;
							});
							break;
					}
				}
			}
			
			/* CREATES THE NAVIGATION TO SCROLL */
			function createNavigation()
			{
				var $div = $('<DIV></DIV>'), /* CREATE THE DIV OBJECT */
						$next = $div.clone().addClass('sideswap_nav sideswap_next').html(opts.next).appendTo($parent).hide(), /* CREATE THE NEXT OBJECT */
						$previous = $div.clone().addClass('sideswap_nav sideswap_previous').html(opts.previous).appendTo($parent).hide(); /* CREATE THE PREVIOUS OBJECT */
				
				$next.click(function()
				{
					if(!clicked)
					{
						clicked = true;
						rotate(1);
					}
				});
				$previous.click(function()
				{
					if(!clicked)
					{
						clicked = true;
						rotate(-1);
					}
				});
				
				$parent.hover(function()
				{
					$next.fadeIn(opts.duration);
					$previous.fadeIn(opts.duration);
				},function()
				{
					$next.fadeOut(opts.duration);
					$previous.fadeOut(opts.duration);
				});
			}
			
			/* INITIATES THE INTERVAL TIMER */
			function initiateInterval()
			{
				timer = setInterval(function()
				{
					rotate();
				},opts.display_time);
			}
			
		});	
	};
})(jQuery);