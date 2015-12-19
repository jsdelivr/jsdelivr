jQuery(document).ready(function(){
	/* Tooltip */
	y = -20;
	x = 20;
	jQuery("a.tooltip").hover(function(e){											  
		text = jQuery(this).attr("rel");
		jQuery(this).attr("rel", "");				
		jQuery("body").append("<p id='tooltip'>"+ text +"</p>");		
		jQuery("#tooltip").css({'top' : (e.pageY - y) + 'px', 'left' : (e.pageX + x) + 'px'}).fadeIn("fast");
	},
	function(){
		jQuery(this).attr("rel", text);		
		jQuery("#tooltip").remove();
	});	
	
	jQuery("a.tooltip").mousemove(function(e){
		jQuery("#tooltip").css({'top' : (e.pageY - y) + 'px', 'left' : (e.pageX + x) + 'px'});
	});
	/* End tooltip */
});