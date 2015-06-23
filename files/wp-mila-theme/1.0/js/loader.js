jQuery(document).ready(function($) {
	
	// Settings
	var animationSpeed = 1000;
	var fadeInOutSpeed = 500;
	var $easingType= 'easeInOutQuart';
	
	// IF HASH IS SET WHEN PAGE LOAD
	var hash = window.location.hash.substr(1);
	var i=0;
	$("a.loadcontent").each(function(){
		var $this = $(this);							 
		var type = $(this).data('type');
		var id = $(this).data('id');
		var slug = $(this).data('slug');
		if(hash==slug){
			// Bugfix for multiple load if more links exists
			if (i < 1) {
				loadcontent(type,id,slug,'start');
			}
			i++;
		}											
	});
	
	// CLOSE ITEM
	$("body").on("click", 'a.closecontent', function() {
		var href = $(this).attr('href');
		var checkwindow = $(window).width();
		
		if (checkwindow > 768) {
			$('.maincontent .content-inner').fadeOut(500, function() {
				$(this).html('');
				$('.maincontent').css({'width':'0'});	
				$('.mainside-bg').animate({'width':'100%'}, animationSpeed, $easingType);
				$('.mainside').animate({'width':'100%'}, animationSpeed, $easingType, function() {
					reorganizeIsotope('.masonry');
					resize_jplayer();
					$(this).css({'minHeight': 'inherit'});
				});
			});
		} else {
			$('.maincontent .content-inner').slideUp(500, function() {
				reorganizeIsotope('.masonry');
				resize_jplayer();
			});
		}
		
		window.location.hash = '#_';		// delete hash
		if (history.pushState) {
			history.pushState({page:href}, href, href);
		}
		return(false);
	});
	
	
	// LOAD ITEM
	$("body").on("click", 'a.loadcontent', function() { 
		var href = $(this).attr('href');
		var type = $(this).data('type');
		var id = $(this).data('id');
		var slug = $(this).data('slug');
		
		if(window.location.hash.substr(1) == slug) { 
			$('html, body').animate({scrollTop: 0}, animationSpeed, $easingType);
		} else {
			window.location.hash = slug;	// set the hash
			if (history.pushState) {
				history.pushState({page:href}, href, href);
			}
			loadcontent(type,id,slug,false);
		}
		
		return(false);
	});
	
	
	// LOAD FUNCTION
	function loadcontent(type,id,slug, action) {
		if (action !== 'start') { $('#loading').fadeIn(fadeInOutSpeed); }
		
		if ($(window).width() > 768) {
			if ($('.maincontent').width() > 0) { $('#content').css({'minHeight':'10px'}); }			// CHROME BUGFIX
			$('#content .content-inner').fadeOut(fadeInOutSpeed);
			$('html, body').animate({scrollTop: 0}, animationSpeed, $easingType);
		}
		jQuery.ajax({type:'POST', url:srvars.ajaxurl, data: { action:'sr_get_content', id:id, type:type }, success: function(response) {
			
			if ($(window).width() > 768) {
				$('#content .content-inner').hide();
				$('#content .content-inner').html(response);
				initialise('#content');
			}
						
			var checkwidth = $('.maincontent').width();
			$('#loading').delay(1000).fadeOut(fadeInOutSpeed, function(){
				
				if ($(window).width() > 768) {
					if (checkwidth > 0) {
						reorganizeIsotope('.masonry');
						$('#content .content-inner').fadeIn(fadeInOutSpeed, function() { resize_jplayer(); reorganizeIsotope('.masonry'); });
					} else {
						$('.mainside').animate({'width':srvars.asidewidth+'%'}, animationSpeed, $easingType);
						$('.mainside-bg').animate({'width':srvars.asidewidth+'%'}, animationSpeed, $easingType);
						$('.maincontent').animate({'width':srvars.contentwidth+'%'}, animationSpeed, $easingType, function() {
							reorganizeIsotope('.masonry');
							$('#content .content-inner').fadeIn(fadeInOutSpeed, function() { resize_jplayer(); reorganizeIsotope('.masonry'); });
						});	
					}
				} else {
					$('#content .content-inner').hide();
					$('#content .content-inner').html(response);
					initialise('#content');
					if ($(window).width() <= 480) { var topscroll = jQuery('header').height(); } else { var topscroll = 0; }
					$('html, body').animate({scrollTop: topscroll+'px'}, animationSpeed, $easingType);
					reorganizeIsotope('.masonry');
					$('#content .content-inner').slideDown(fadeInOutSpeed, $easingType, function() { 
						resize_jplayer(); 
						reorganizeIsotope('.masonry'); 
					});
				}
				
			});
		}});
		
		// Analytics
		if (typeof _gaq !== "undefined") {
			_gaq.push(['_trackPageview', '#'+slug]);
		}
		
	}
	
});