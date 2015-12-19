
// Object bf_admin is available to use

(function($){
	
	var bf_admin_plugin_kksr = {
		
		init : function()
		{
			jQuery(document).ready( function($){
				bf_admin_plugin_kksr.reset_ratings($('.bhittani-framework'), bhittani_plugin_kksr_js_admin.func_reset, bhittani_plugin_kksr_js_admin.nonce)
			});
		},
		
		reset_ratings : function(obj, func, nonce)
		{
			$('a[rel="kksr-reset"]', obj).click( function(){
				var form = jQuery('form[name="bf_form"]', obj);
				var values = form.serialize();
				bf_admin.ajax_post($, values, func, nonce, 'Flushing');
				$('._kksr_reset._on', obj).parent().fadeOut('slow');
				return false;
			});
		
			$('a[rel="kksr-reset-all"]', obj).click( function(){
				$('._kksr_reset', obj).removeClass('_off').addClass('_on').val('1');
				return false;
			});
		
			$('a[rel="kksr-reset-none"]', obj).click( function(){
				$('._kksr_reset', obj).removeClass('_on').addClass('_off').val('0');
				return false;
			});
		}
	
	};
	
	bf_admin_plugin_kksr.init();
   
})( jQuery );

