 /* After Login */
function completeLogin(ret_obj, response_tags, params, fo_obj) {
	var url =  current_url.setQuery('act','');
	location.href = url;
}

jQuery(function($){
	// Login
	// Div unwrap
	var $account = $('.account');
	$account.unwrap().unwrap();
	// Toggle
	var $acTog = $('a[href="#acField"]');
	var $acField = $('#acField');
	$acTog.click(function(){
		$this = $(this);
		$acField.slideToggle(200, function(){
			var $user_id = $(this).find('input[name="user_id"]:eq(0)');
			if($user_id.is(':visible')){
				$user_id.focus();
			} else {
				$this.focus();
			}
		});
		return false;
	});

	// Close
	$acField
		.append('<button type="button" class="close">&times;</button>')
		.find('>.close').click(function(){
			$(this).closest($acField).slideUp(200, function(){
				$acTog.eq(0).focus();
			});
			return false;
		});

	// Warning
	var $acWarning = $account.find('.warning');
	$('#keep_signed').change(function(){
		if($(this).is(':checked')){
			$acWarning.slideDown(200);
		} else {
			$acWarning.slideUp(200);
		}
	});

	// Login Error
	$('#fo_login_widget .message').parent($acField).show();
});
