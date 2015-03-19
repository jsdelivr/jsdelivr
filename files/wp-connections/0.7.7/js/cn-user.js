jQuery(document).ready(function($) {
	$('.connections-list').cn_preloader({
		delay:100,
		imgSelector:'.cn-image-loading img.photo, .cn-image-loading img.logo, .cn-image-loading img.map, .cn-image-loading img.screenshot',
		beforeShow:function(){
			$(this).closest('.cn-image-loading img').css('visibility','hidden');
		},
		afterShow:function(){
			//var image = $(this).closest('.cn-image');
			//jQuery(image).spin(false);
		}
	});

	/*jQuery('.cn-image').spin({
		lines: 12, // The number of lines to draw
		length: 7, // The length of each line
		width: 10, // The line thickness
		radius: 5, // The radius of the inner circle
		color: '#FFF', // #rgb or #rrggbb
		speed: 1, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: true // Whether to render a shadow
	});*/

	/*jQuery.preload('.cn-image img',{
		onComplete:function (data){
			//jQuery(".cn-image .overlay:eq("+data.index+")").removeClass('preload').addClass("image_overlay").html('');
			if (jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 9) {
				jQuery(".cn-image:eq("+data.index+") img").css("visibility", "visible");
			}else{
				jQuery(".cn-image:eq("+data.index+") img").delay(2000).css({visibility: 'visible'}).animate({opacity:1}, 1000);
				//jQuery(".cn-image:eq("+data.index+")").spin(false);
			}
		}
	});*/
});