/* 로그인 후 */
function completeMessageLogin(ret_obj, response_tags, params, fo_obj) {
    var url =  current_url.setQuery('act','');
    location.href = url;
}

/* 오픈아이디 로그인 후 */
function completeMessageOpenIDLogin(ret_obj, response_tags) {
    var redirect_url =  ret_obj['redirect_url'];
    location.href = redirect_url;
}

jQuery(function($){
	$('#warning').hide();
	$('#keepid').change(function(){
		var $warning = $('#warning');
		if($(this).is(':checked')){
			$warning.slideDown(200);
		} else {
			$warning.slideUp(200);
		}
	});
});