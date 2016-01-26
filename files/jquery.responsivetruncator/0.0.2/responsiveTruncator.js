/*
 * jQuery Responsive Truncator Plugin
 *
 * https://github.com/jkeck/responsiveTruncator
 *
 * VERSION 0.0.2
 *
**/
(function( $ ){
  $.fn.responsiveTruncate = function(options){
	  var $this = this;
		$(window).bind("resize", function(){
			removeTruncation($this);
			addTruncation($this);
		});
		
 		addTruncation($this);

	  function addTruncation(el){
		  el.each(function(){
			  if($(".responsiveTruncate", $(this)).length == 0){
				  var parent = $(this);
				  var fontSize = $(this).css('font-size');
					var lineHeight = Math.floor(parseInt(fontSize.replace('px','')) * 1.5);
					var total_lines = Math.ceil(parent.height() / lineHeight);
					var settings = $.extend({
						'lines'  : 3,
						'height' : null,
						'more'   : 'more',
						'less'   : 'less'
					}, options);
					var truncate_height;
					if(settings.height){
						truncate_height = settings.height;
					}else{
					  truncate_height = (lineHeight * settings.lines);	
					}
				  if(parent.height() > truncate_height) {
					  var orig_content = parent.html();
						parent.html("<div style='height: " + truncate_height + "px; overflow: hidden;' class='responsiveTruncate'></div>");
						var truncate = $(".responsiveTruncate", parent);
						truncate.html(orig_content);
						truncate.after("<a class='responsiveTruncatorToggle' href='#'>" + settings.more + "</a>");
						var toggle_link = $(".responsiveTruncatorToggle", parent);
						toggle_link.click(function(){
						  var text = toggle_link.text() == settings.more ? settings.less : settings.more;
							toggle_link.text(text);
							if(truncate.height() == truncate_height){
								truncate.css({height: '100%'})
							}else{
								truncate.css({height: truncate_height})
							}
							return false;
						});
				  }
			  }
		  });
	  }
	
	  function removeTruncation(el){
		  el.each(function(){
			  if($(".responsiveTruncate", $(this)).length > 0){
				  $(this).html($(".responsiveTruncate", $(this)).html());
				  $(".responsiveTruncatorToggle", $(this)).remove();
			  }
		  });
	  }
  };
})( jQuery );