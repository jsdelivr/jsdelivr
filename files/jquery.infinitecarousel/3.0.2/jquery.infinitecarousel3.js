/*
 * jQuery Infinite Carousel
 * @author admin@catchmyfame.com - http://www.catchmyfame.com
 * @version 3.0.2
 * @date February 2, 2012
 * @category jQuery plugin
 * @copyright (c) admin@catchmyfame.com (www.catchmyfame.com)
 * @license CC Attribution-Share Alike 3.0 - http://creativecommons.org/licenses/by-sa/3.0/
 */
(function($){
	$.fn.extend({ 
		infiniteCarousel: function(options)
		{
			var defaults = 
			{
				transitionSpeed: 800,
				displayTime: 6000,
				displayProgressRing: true,
				progressRingColorOpacity: '0,0,0,.5',
				progressRingBackgroundOn: true,
				progressRingBackgroundColorOpacity: '255,255,255,.5',
				thumbnailType: 'none', // buttons, images, numbers, count, or none
				easeLeft: 'linear',
				easeRight: 'linear',
				imagePath: '/js/infinitecarousel/images/',
				inView: 1,
				margin: 0,
				advance: 1,
				customClass: null,
				showControls: true,
				autoHideCaptions: false,
				autoPilot: false,
				prevNextInternal: true,
				internalThumbnails: false,
				enableKeyboardNav: true,
				onSlideStart: function(){},
				onSlideEnd: function(){},
				onPauseClick: function(){},
				onPlayClick: function(){}
			};
			var options = $.extend(defaults, options);
	
    			return this.each(function() {
				var o=options;
				var obj = $(this);
				var randID = Math.round(Math.random()*100000000);

				var numItems = $('li', obj).length;	// Number of items
				var captions=[];				// captions array
				var links=[];					// links array
				var itemSources=[];				// sources array
				var vidThumb=[];				// video thumbnails (supplied by the longdesc attribute in the iframe)
				var widthSource,heightSource;		// width and height of each item
				var nextLeft,nextRight;			// pointers to the next array index for moving left and right
				var clrTimerInterval;			// interval handle variable for timer and autoPilot
				var u,elapsedTime=0;
				var canvasSupported = "HTMLCanvasElement" in window;
				$('li',obj).each(function(index){ // populate arrays
					captions.push( $('p',this).html() );
					links.push( $('a',this).attr('href') );
					vidThumb.push( $(this).find('iframe').attr('longdesc') );
					itemSources.push( $(this).find('img, iframe').attr('src') ); // finds images and youtube and vimeo iframe sources
				});

				// Check for improper values in inview and advance
				if(o.inView > numItems) o.inView = numItems; // Prevent trying to view more images than given
				if(o.advance > o.inView) o.advance = o.inView; // Prevent advancing more than inView images at a time

				// Dimensions should be set explicitly on the items so that we don't have to defer loading code until the images are loaded
				widthSource = $(this).find('img, iframe').width();
				heightSource = $(this).find('img, iframe').height();

				// Build carousel container
				$(obj).replaceWith('<div class="infiniteCarousel" id="ic_'+randID+'">'); // Kick the list and its content to the curb and replace with a div
				obj=$('#ic_'+randID); // Reassign the new div as our obj
				$(obj).height(heightSource).width(widthSource*o.inView).css({'overflow':'hidden','position':'relative'});

				// Build tray to hold items and populate with item container divs. Move tray one item width to the left.
				$(obj).append('<div class="ic_tray" style="position:relative;width:'+(numItems*2)*widthSource+'px;left:-'+widthSource+'px">');
				for(var i=0;i<numItems;i++) $('div.ic_tray',obj).append('<div style="overflow:hidden;background:url('+o.imagePath+'wait.gif) no-repeat scroll 50% 50% #ddd;float:left;position:relative;width:'+widthSource+'px;height:'+heightSource+'px;" class="infiniteCarousel_item">');

				// Populate the individual tray divs with items. Add links and captions where available.
				$('.infiniteCarousel_item',obj).each(function(index){
					if(itemSources[index].indexOf('youtube.com') > 0 || itemSources[index].indexOf('vimeo.com') > 0 || itemSources[index].indexOf('funnyordie.com') > 0)
					{
						var querystring = itemSources[index].split("?"); // Need to disassemble and reassemble any querystring parameters so that we can append wmode=opaque as first parameter (see http://stackoverflow.com/questions/3820325/overlay-opaque-div-over-youtube-iframe)
						$(this).append('<iframe src="'+querystring[0]+"?wmode=opaque&"+querystring[1]+'" frameborder="0" allowfullscreen="" style="width: '+widthSource+'px; height: '+heightSource+'px">" />');
						if(links[index]!=undefined) $('iframe',this).wrap('<a class="ic_link" href="'+links[index]+'"></a>'); // IE8 needs the </a>. see http://outwardfocusdesign.com/blog/web-design-professionals/jquery/possible-fix-for-jquerys-wrap-function-for-ie8/
					}
					else
					{
						$(this).append('<img src="'+itemSources[index]+'" />');
						if(links[index]!=undefined) $('img',this).wrap('<a class="ic_link" href="'+links[index]+'"></a>'); // IE8 needs the </a>. see http://outwardfocusdesign.com/blog/web-design-professionals/jquery/possible-fix-for-jquerys-wrap-function-for-ie8/
					}
					if(captions[index]!=undefined) $(this).append('<div class="ic_caption" style="position:absolute;bottom:0;">'+captions[index]+'</div>');
				});

				// Once the tray is built and populate, clone all items and double the list. This allows us to easily handle any combination of advance and inview options with no lag
				$('.infiniteCarousel_item',obj).clone().appendTo($('div.ic_tray',obj)); // Double the set of item containers
				$('.infiniteCarousel_item',obj).each(function(index){ $(this).attr('id','ic_'+randID+'_'+index) }); // Assign IDs to each item container
				$('.ic_tray',obj).prepend( $('.infiniteCarousel_item:last').remove() ); // Move the last div to the beginning

				// Compensate for margins applied to items.
				if(o.margin != 0)
				{
					$(obj).width($(obj).width()+(o.inView+1)*o.margin).height($(obj).height()+2*o.margin);
					$('.infiniteCarousel_item',obj).css('margin',o.margin+'px 0px '+o.margin+'px '+o.margin+'px');
					$('.ic_tray',obj).css('left', parseInt( $('.ic_tray',obj).css('left') ) - o.margin +'px' ).width( $('.ic_tray',obj).width() + o.margin*(numItems*2) );
				}

				// Build left/right nav
				$(obj).append('<div class="ic_left_nav" style="position:absolute;left:0;width:32px;top:'+(heightSource/2-16)+'px;">').append('<div class="ic_right_nav" style="position:absolute;width:32px;right:0;top:'+(heightSource/2-16)+'px;">');
				$('.ic_left_nav',obj).append('<img style="cursor:pointer;" src="'+o.imagePath+'left.png" />');
				$('.ic_right_nav',obj).append('<img style="cursor:pointer;" src="'+o.imagePath+'right.png" />');
				if( !o.prevNextInternal && ( parseInt( $(obj).css('border-left-width') ) + parseInt( $(obj).css('border-right-width') ) ) > 0) $('.ic_right_nav',obj).css('right','-'+(parseInt( $(obj).css('border-left-width') ) + parseInt( $(obj).css('border-right-width') ) )+'px'); // adjust right nav of margin, external nav, and a border exist

				// Add click events for the left/right nav
				$('.ic_left_nav img',obj).on('click', function(event){
					if( !$('.ic_tray',obj).is(':animated') )
					{
						stop();
						moveRight(o.advance);
					}
				});
				$('.ic_right_nav img',obj).on('click', function(event){
					if( !$('.ic_tray',obj).is(':animated') )
					{
						stop();
						moveLeft(o.advance);
					}
				});

				// If inView = numItems, don't enable any features; we're already viewing all items
				if(o.inView == numItems) {o.displayProgressRing=false;o.thumbnailType='none';o.showControls=false;o.autoPilot=false;o.enableKeyboardNav=false;$('.ic_left_nav,.ic_right_nav',obj).hide();}

				// If nav outside carousel, wrap carousel in a div and set padding to compensate for nav. also dont animate nav if outside images
				if(!o.prevNextInternal)
				{
					$(obj).wrap('<div id="ic_'+randID+'_wrapper" class="ic_wrapper" style="padding:0 32px;position:relative;">');
					$('#ic_'+randID+'_wrapper').width( $(obj).width() );
					$('#ic_'+randID+'_wrapper').prepend( $('.ic_left_nav',obj).detach() );
					$('#ic_'+randID+'_wrapper').prepend( $('.ic_right_nav',obj).detach() );
				}
				else
				{
					// Animate left/right nav in/out of view when mouse enters/leaves carousel
					$(obj).hover(function(){ 
						$('.ic_left_nav',obj).stop().animate({opacity:1,left:'0px'},300);
						$('.ic_right_nav',obj).stop().animate({opacity:1,right:'0px'},300);
					},function(){ 
						$('.ic_left_nav',obj).stop().animate({opacity:0,left:'-32px'},500);
					$('.ic_right_nav',obj).stop().animate({opacity:0,right:'-32px'},500);
					});
				}

				// Adjust wrapped width when using peek padding
				$('#ic_'+randID).addClass('ic_peek_padding');
				$('#ic_'+randID+'_wrapper').width( $(obj).width() + parseInt($('#ic_'+randID).css('padding-left')) + parseInt($('#ic_'+randID).css('padding-right'))); //$(obj).width() + parseInt($('#ic_'+randID).css('padding-left')) + parseInt($('#ic_'+randID).css('padding-right'))

				// Thumbnails
				if(o.thumbnailType != 'none')
				{
					// Add a tray div for the thumbnails to exist in. If using external thumbnails, move div in DOM.
					$(obj).append('<div id="ic_'+randID+'_thumbnail_tray" class="ic_thumbnail_tray" style="position:absolute;bottom:0;padding:5px 0;width:100%;text-align:center;">');
					$('#ic_'+randID+'_thumbnail_tray').append('<div class="ic_thumbnails">');
					for(var i=0;i<numItems;i++) $('.ic_thumbnails',obj).append('<div class="ic_button" style="cursor:pointer">');
					for(var i=0;i<o.inView;i++) $('.ic_button:eq('+i+')',obj).addClass('ic_active');
					$('.ic_button').hover(function(){ if( !$(this).hasClass('ic_active') ) $(this).css('background','#699') },function(){$(this).css('background','')});

					if(o.thumbnailType == 'images')
					{
						// insert images in the ic_button divs with width/height set to 100%. need to set width and height on .ic_button in css
						$('.ic_button',obj).each(function(index){
							if( itemSources[index]!=undefined ) thumbImage = itemSources[index];
							if( vidThumb[index]!=undefined ) thumbImage = vidThumb[index];
							$(this).append('<img width="100%" height="100%" src="'+thumbImage+'" />');
						});
					}
					if(o.thumbnailType == 'numbers')
					{
						// numbered thumbs
						$('.ic_button',obj).each(function(index){
							$(this).html(index+1);
						});
					}
					if(o.thumbnailType == 'count')
					{
						// X of Y thumbs
						$('.ic_button',obj).remove();
						$('.ic_thumbnails',obj).html('<span>1</span> of '+numItems);
						manageThumbButtons();
					}
					if(!o.internalThumbnails)
					{
						// Check and see if our wrapper is already in place from the navigation. if so, add thumb tray div. if not, build and add.
						if(!$('#ic_'+randID+'_wrapper').length)
						{
							$(obj).wrap('<div id="ic_'+randID+'_wrapper" class="ic_wrapper" style="position:relative;">');
							$('#ic_'+randID+'_wrapper').width( $(obj).width() );
						}
						// Move the existing thumbnail tray to be a child of the wrapper
						$('#ic_'+randID+'_thumbnail_tray').css({'bottom':'','position':'relative'}).appendTo($('#ic_'+randID+'_wrapper'));
					}

					// add click events to the thumbnail buttons
					var thumbTopParent = ($('#ic_'+randID+'_wrapper').length) ? $('#ic_'+randID+'_wrapper'):obj;
					$('.ic_button',thumbTopParent).on('click', function(){
						if( !$('.ic_tray',obj).is(':animated') )
						{
							stop();

							var jumpStart = parseInt( $('.infiniteCarousel_item:eq(1)',obj).attr('id').split('_').pop() );
							var jumpFinish = $(this).index();
							if(jumpStart > (numItems-1)) jumpStart -= numItems;

							var a = Math.abs(jumpStart-jumpFinish);
							var b = numItems - a;
							var jumpDist = Math.min(a,b);
							if(jumpStart < jumpFinish)
							{
								if(a<b || a==b) moveLeft(jumpDist);
								if(a>b) moveRight(jumpDist);
							}
							if(jumpStart > jumpFinish)
							{
								if(a<b) moveRight(jumpDist);
								if(a>b || a==b) moveLeft(jumpDist);
							}
						}
					});
				}

				if( (!o.prevNextInternal || !o.internalThumbnails) && o.customClass !== null ) { $('#ic_'+randID+'_wrapper').addClass('ic_'+o.customClass); }
				else if (o.customClass!== null) { $(obj).addClass('ic_'+o.customClass); }

				if(o.enableKeyboardNav)
				{
					$(document).keydown(function(event){
						if(event.keyCode == 39) if( !$('.ic_tray',obj).is(':animated') ) { stop(); moveLeft(o.advance); }
						if(event.keyCode == 37) if( !$('.ic_tray',obj).is(':animated') ) { stop(); moveRight(o.advance); }
						if(event.keyCode == 80 || event.keyCode == 111) if( !$('.ic_tray',obj).is(':animated') ) if(o.autoPilot) pause();
						if(event.keyCode == 83 || event.keyCode == 115) if( !$('.ic_tray',obj).is(':animated') ) play();
					});
				}

				// Play/pause controls
				if(o.showControls)
				{
					$(obj).append('<div id="ic_controls_'+randID+'" class="ic_controls" style="background:url('+o.imagePath+'controls.png) no-repeat -12px 0;opacity:.5;cursor:pointer;height:10px;position:absolute;right:9px;top:10px;width:10px;z-index:1">');
					if(!o.autoPilot) $('#ic_controls_'+randID).css('background-position','1px 0');
					$('.ic_controls',obj).on('click', function(){
						if( !$('.ic_tray',obj).is(':animated') )
						{
							if(o.autoPilot) pause(); // pause
							else play();// play
						}
					});
				}

				// Build a canvas autopilot timer
				if(canvasSupported)
				{
					$(obj).append('<canvas id="ic_canvas_'+randID+'" width="30" height="30" style="position:absolute;top:0;right:0;"></canvas>');
					var ctx = $('#ic_canvas_'+randID)[0].getContext('2d'); //var ctx = $('canvas')[0].getContext('2d');
					ctx.lineWidth = 3;
					ctx.strokeStyle = "rgba("+o.progressRingColorOpacity+")";
					ctx.shadowOffsetX = 0;
					ctx.shadowOffsetY = 0;
					ctx.shadowBlur = 3;
					ctx.shadowColor = "#fff";
					if(!o.displayProgressRing) $('#ic_canvas_'+randID).hide();
				} else { $(obj).append('<div id="ic_ie_timer_'+randID+'" style="width:100%;height:6px;position:absolute;bottom:0;left:0;background:#ccc"></div>');$('#ic_ie_timer_'+randID).css('opacity','.25') }
				function hideCaptions()
				{
					if(o.autoHideCaptions) $('.ic_caption',obj).stop().animate({bottom:-heightSource+'px'});
				}
				function showCaptions()
				{
					if(o.autoHideCaptions) $('.ic_caption',obj).stop().animate({bottom:'0px'});
				}
				function manageThumbButtons()
				{
					thumbButtonStart = parseInt( $('.infiniteCarousel_item',obj).attr('id').split('_').pop() ) + 1;
					if(thumbButtonStart > (numItems-1)) thumbButtonStart -= numItems;
					if(o.thumbnailType == 'count')
					{
						var ary=[];
						for(var i=thumbButtonStart;i<thumbButtonStart+o.inView;i++) ary.push( ((i+1) > numItems) ? (i+1)-numItems:(i+1) );
						var last = ary.pop();
						var amp = (o.inView>1) ? " & ":'';
						$('.ic_thumbnails span',thumbTopParent).text(ary.join(", ") + amp + last);
					}
					for(var i=thumbButtonStart;i<thumbButtonStart+o.inView;i++) (i>numItems-1) ? $('.ic_button:eq('+Math.abs(numItems-i)+')',thumbTopParent).addClass('ic_active'):$('.ic_button:eq('+i+')',thumbTopParent).addClass('ic_active');
				}
				function moveRight(dist)
				{
					o.onSlideStart.call(this);
					$('.ic_button',thumbTopParent).removeClass('ic_active');
					$('.infiniteCarousel_item',obj).slice(-dist).prependTo('#ic_'+randID+' .ic_tray',obj);
					$('.ic_tray',obj).css({left:'-='+(widthSource*dist)+'px'});
					$('.ic_tray',obj).stop().animate({left:"+="+widthSource*dist+"px"},o.transitionSpeed,o.easeRight,function(){
						showCaptions();
						manageThumbButtons();
						o.onSlideEnd.call(this);
					});
					hideCaptions();
				}
				function moveLeft(dist)
				{
					o.onSlideStart.call(this);
					$('.ic_button',thumbTopParent).removeClass('ic_active');
					$('.ic_tray',obj).stop().animate({left:"-="+(widthSource+o.margin)*dist+"px"},o.transitionSpeed,o.easeLeft,function(){
						$('.infiniteCarousel_item',obj).slice(0,dist).appendTo('#ic_'+randID+' .ic_tray',obj);
						$('.ic_tray',obj).css({left:'-'+(widthSource+o.margin)+'px'});
						showCaptions();
						manageThumbButtons();
						o.onSlideEnd.call(this);
						if(o.autoPilot) animatedTimer(o.displayTime);
					});
					hideCaptions();
				}
				function pause()
				{
					o.onPauseClick.call(this); 
					o.autoPilot = false;
					$('#ic_controls_'+randID).css('background-position','1px 0');
					clearInterval(clrTimerInterval);
					elapsedTime=u;
				}
				function play()
				{
					o.autoPilot = true;
					if(o.autoPilot && !$('.ic_tray',obj).is(':animated') ) animatedTimer(o.displayTime);
					$('#ic_controls_'+randID).css('background-position','-12px 0');
				}
				function stop()
				{
					o.onPlayClick.call(this); 
					o.autoPilot = false;
					resetTimer();
					$('#ic_controls_'+randID).css('background-position','1px 0');
					clearInterval(clrTimerInterval);
				}
				function animatedTimer(delay)
				{
					var startTime  = new Date().getTime(), newTime, angle=0;

					clrTimerInterval = setInterval(function() {
						if (angle < 359)
						{
							newTime = new Date().getTime();
							u       = (newTime - startTime)+elapsedTime;
							angle   = Math.floor(u / delay * 360);
							if(angle>359) angle=359; // insurance that the angle stays < 360 due to fast setinterval period
							if(canvasSupported)
							{
								ctx.clearRect(0,0,30,30); // clear canvas
								ctx.save(); // needed for the translation and rotation
								ctx.translate(15,15);
								ctx.rotate(-Math.PI/2); // rotate -90 degrees ccw
								if(o.progressRingBackgroundOn)
								{
									ctx.strokeStyle = "rgba("+o.progressRingBackgroundColorOpacity+")";
									ctx.beginPath();
									ctx.arc(0, 0, 10, 0, (360 * (Math.PI / 180) ), true); // (x, y, radius, startAngle, endAngle, anticlockwise) 
									ctx.stroke();
									ctx.strokeStyle = "rgba("+o.progressRingColorOpacity+")";
								}
								ctx.beginPath();
								ctx.arc(0, 0, 10, 0, (angle * (Math.PI / 180) ), true); // (x, y, radius, startAngle, endAngle, anticlockwise) 
								ctx.stroke();
								ctx.restore(); // needed for the translation and rotation
							}
							else
							{
								// animate the ie timer line 
								$('#ic_ie_timer_'+randID,obj).css('width',99-Math.floor( (u/delay)*100)+'%');
							}
						}
						else
						{
							elapsedTime = 0;
							clearInterval(clrTimerInterval);
							moveLeft(o.advance);
						}
					}, 20);
				}
				function resetTimer()
				{
					elapsedTime = 0;
					if(canvasSupported)
					{
						ctx.clearRect(0,0,30,30); // clear canvas
						ctx.save(); // needed for the translation and rotation
						ctx.translate(15,15);
						ctx.rotate(-Math.PI/2); // rotate -90 degrees ccw
						ctx.beginPath();
						ctx.arc(0, 0, 10, 0, (360 * (Math.PI / 180) ), true); // (x, y, radius, startAngle, endAngle, anticlockwise) 
						ctx.stroke();
						ctx.restore(); // needed for the translation and rotation
					}
				}

				// AutoPilot (pausing, keyboard, thumbnail clicks turn autopilot off/play turns on)
				if(o.autoPilot && !$('.ic_tray',obj).is(':animated') ) { animatedTimer(o.displayTime); } else { resetTimer(); }
 			});
		}
	});
})(jQuery);