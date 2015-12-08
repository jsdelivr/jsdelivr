jQuery(function($){	

//SignIn Window Control
	var sign_box = $('div#sign_box');
	var trigger = sign_box.find('>div.txt');
	trigger.click(function(){
			if(trigger.hasClass('sign_state1')){
				trigger.removeClass('sign_state1').addClass('sign_state2');	
			}else{
				trigger.removeClass('sign_state2').addClass('sign_state1');
			}
			sign_box.find('>div.signin_window').slideToggle('fast');
			sign_box.find('>div.mbInfo_window').slideToggle('fast');
		});

	
});
function completeLogin(ret_obj, response_tags, params, fo_obj) {
    var url =  current_url.setQuery('act','');
    location.href = url;
}