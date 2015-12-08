function doGetSkinColorset(skin, type) {
	type = type == 'M' ? 'M' : 'P';

	var params = {
		'skin' : skin,
		'type': type,
	};
	var response_tags = [ 'error', 'message', 'tpl' ];

	function on_complete(ret) {
		var $container = jQuery('#colorset');
		
		if(type == 'M'){
			$container = jQuery('#mcolorset');
		}
		
		var old_h = $container.is(':visible') ? $container.outerHeight() : 0;

		if(ret.tpl == ''){
			$container.hide();
		}else{
			$container.show();
			var $colorset = jQuery('#message_colorset');
			
			if(type == 'M'){
				$colorset = jQuery('#message_mcolorset');
			}

			$colorset.html(ret.tpl);
		}

		var new_h = $container.is(':visible') ? $container.outerHeight() : 0;

		try {
			fixAdminLayoutFooter(new_h - old_h)
		} catch (e) {};
	}

	exec_xml('message', 'getMessageAdminColorset', params, on_complete, response_tags);
}

jQuery(function($){
	doGetSkinColorset($('#skin').val());
	doGetSkinColorset($('#mskin').val(), 'M');
});