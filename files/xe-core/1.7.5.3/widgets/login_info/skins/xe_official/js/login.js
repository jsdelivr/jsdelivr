/* After Login */
function completeLogin(ret_obj, response_tags, params, fo_obj) {
    var url =  current_url.setQuery('act','');
    location.href = url;
}

jQuery(function($){
	// keep signed?
	var keep_msg = $('.keep_msg');
	keep_msg.hide();
	$('#keep_signed').change(function(){
		if($(this).is(':checked')){
			keep_msg.slideDown(200);
		} else {
			keep_msg.slideUp(200);
		}
	});

	// focus userid input box
	if (!$(document).scrollTop()) {
		try {
			$('#fo_login_widget > input[name=user_id]').focus();
		} catch(e){};
	}
});
