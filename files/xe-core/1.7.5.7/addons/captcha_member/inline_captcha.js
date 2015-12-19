jQuery(function($){
	$('button.captchaPlay')
		.click(function(){
			var swf = document['captcha_audio'] || window['captcha_audio'];
			var audio = current_url.setQuery('captcha_action','captchaAudio').setQuery('rand', (new Date).getTime());

			if(swf.length > 1) swf = swf[0];

			$('input[type=text]#secret_text').focus();
			swf.setSoundTarget(audio,'1');
		});

	$('button.captchaReload')
		.click(function(){
			$("#captcha_image").attr("src", current_url.setQuery('captcha_action','captchaImage').setQuery('rand', (new Date).getTime()).setQuery('renew',1));
		});
});
