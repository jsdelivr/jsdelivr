/**
 * Create iOS style stackable list/content headers
 * Made by Mike Smedley / @pxlcrft
 *
 * Arguments:
 * @body: The parent container holding your title.  A container is needed for each individual title
 * @title: The title that you want to scroll down the page
 * @margin: Because the title gets absolutely positioned when it hits the bottom, you might need to supply a negative margin to counter any padding/margin on your parent element
 * @offset: If you have other fixed elements above, you can specify the offset here
 */

(function( $ ) {
  $.fn.stacks = function(options) {

  	var settings = $.extend( {
		body   : '.stickyparent',
		title  : '.header',
		margin : 0,
		offset : 0
    }, options);

    $.each(this.find(settings.body+' '+settings.title),function(k,v){

    	var offset = $(v).offset();

    	$bdr = 0;
    	$bordertopheight = $(v).css('border-top-width').substring(0,$(v).css('border-top-width').indexOf('p'));
		$borderbtmheight = $(v).css('border-bottom-width').substring(0,$(v).css('border-bottom-width').indexOf('p'));
		$bdr = (parseInt($bordertopheight) + parseInt($borderbtmheight));

    	$(window).resize(function(){
			//get padding values
			$paddleft = $(v).css('padding-left').substring(0,$(v).css('padding-left').indexOf('p'));
			$paddright = $(v).css('padding-right').substring(0,$(v).css('padding-left').indexOf('p'));
			$width = $(v).parent().width() - $paddleft - $paddright;
			if(!$(v).hasClass('fixed'))
			{
				offset = $(v).offset();
			}
			$left = offset.left;
			$(v).css({'width':$width});
		});

		$(window).scroll(function(){
			if(($(window).scrollTop()+($(v).outerHeight(true)-$bdr)) >= ($(v).closest(settings.body).offset().top + $(v).closest(settings.body).outerHeight(true)+settings.margin)-settings.offset)
			{
				/* stop at bottom */
				$(v).removeClass('fixed').addClass('absolute').removeAttr('style');
			}
			else if($(document).scrollTop() >= (offset.top) - settings.offset)
			{
				/* scroll from top */
				$offset = offset.left;
				$awidth = $(v).width();
				$(v).removeClass('absolute').addClass('fixed').css({'width':$awidth});
				if($(v).siblings('#filler').length < 1)
				{
					$('<div id="filler" />').css('height',$(v).outerHeight(true)).insertAfter($(v));
				}
			}
			else
			{
				$(v).removeClass('fixed');
				$(v).removeAttr('style');
				$(v).siblings('#filler').remove();
			}
		});
	})

	//when the page has loaded, if we are scrolled down we need to insert filler items to pad out the screen
	setTimeout(function(){
	    $.each($(settings.body+' '+settings.title+'.absolute'),function(a,b){
	    	$('<div id="filler" />').css('height',$(b).outerHeight(true)).insertAfter($(b));
	    })
	},100);
  };
})( jQuery );
