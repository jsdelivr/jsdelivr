jQuery(document).ready(function($){

	if( $.colorbox ) {

		$('.imagecol').each(function(){
			$( 'a.thickbox', $(this) ).colorbox({
				maxWidth :'90%',
				maxHeight :'90%',
				returnFocus : false
			});
		});
	}

});