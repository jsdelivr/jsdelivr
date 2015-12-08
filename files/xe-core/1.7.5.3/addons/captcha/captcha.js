/* procFilter 함수를 가로채서 captcha 이미지 및 폼을 출력 */
var calledArgs = null;
(function($){
	$(function() {
		var captchaXE = null;

		function xeCaptcha() {
			$('form').each(function(i)
			{
				var isSubmitHook = false;
				if (!$(this).attr('onsubmit') ||  $(this).attr('onsubmit').indexOf('procFilter') < 0)
				{
					var act = $(this).find('input[name=act]').val()
					for(var i = 0; i<captchaTargetAct.length; i++)
					{
						if(captchaTargetAct[i] == act)
						{
							isSubmitHook = true;
							break;
						}
					}
				}

				if (isSubmitHook)
				{
					$(this).append('<input type="hidden" name="captchaType" value="inline" />');
					if(!$(this).find('input[name=error_return_url]'))
						$(this).append('<input type="hidden" name="error_return_url" value="'+current_url+'" />');
					$(this).submit(function(event){
						if ($(this).find('input[name=secret_text]').val())
						{
							return true;
						}

						event.preventDefault();
						var self = this;

						$('#captcha_layer form')
						.submit(function(e){
							e.preventDefault();
							if(!$('#secret_text').val()){
								$(this).find('input[type=text]').val('').focus();
								return false;
							}

							$(self).append('<input type="hidden" name="secret_text" value="'+ $('#secret_text').val() +'" />');
							$(self).submit();
						});
						var params = new Array();
						params['captcha_action'] = 'setCaptchaSession';
						params['mid'] = current_mid;
						window.oldExecXml('', '', params, captchaXE.show,new Array('error','message','about_captcha','captcha_reload','captcha_play','cmd_input','cmd_cancel'));
					});
				}
			});
			var body    = $(document.body);
			var captchaIma;

			if (!captchaXE) {
				var fc_isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
				var fc_isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
				var fc_isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;
				var _swfURL_ = request_uri + 'addons/captcha/swf/play.swf';

				if(fc_isIE && fc_isWin && !fc_isOpera){
					_object_ ='<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" width="0" height="0" id="captcha_audio" align="middle">';
					_object_ += '<param name="allowScriptAccess" value="always" />';
					_object_ += '<param name="quality" value="high" />';
					_object_ += '<param name="movie" value="'+_swfURL_+'" />';
					_object_ += '<param name="wmode" value="window" />';
					_object_ += '<param name="allowFullScreen" value="false">';
					_object_ += '<param name="bgcolor" value="#fffff" />';
					_object_ += '</object>';
				}else{
					_object_ = '<embed src="'+_swfURL_+'" quality="high" wmode="window" allowFullScreen="false" bgcolor="#ffffff" width="0" height="0" name="captcha_audio" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';
				}

				captchaXE = $('<div id="captcha_layer" style="position:fixed; top:0; left:0; width:100%; height:100%;display:none;z-index:10">').appendTo(document.body);

				var top_left = 'margin:-105px 0 0 -105px; top:50%; left:50%;';
				if(screen.width<480) { top_left = ''; }
				var $div = $('<div style="z-index:1000;position:absolute; width:310px;' + top_left + ' background:#fff; border:3px solid #ccc;">'+
								'<form method="post" action="">'+
									'<div style="position:relative; margin:25px 20px 15px 20px">'+
										'<img src="about:blank" id="captcha_image" alt="CAPTCHA" width="240" height="50" style="display:block; width:240px; height:50px; border:1px solid #b0b0b0" />'+
										'<button type="button" class="reload" title="" style="position:absolute; top:0; left:245px; width:25px; height:25px; padding:0; overflow:visible; border:1px solid #575757; background:#747474 url('+request_uri + 'addons/captcha/img/icon.gif) no-repeat center 5px;border-radius:3px;-moz-border-radius:3px;-webkit-border-radius:3px; cursor:pointer;box-shadow:0 0 3px #444 inset;-moz-box-shadow:0 0 3px #444 inset;-webkit-box-shadow:0 0 3px #444 inset;"></button>'+
										'<button type="button" class="play" title="" style="position:absolute; top:27px; left:245px; width:25px; height:25px; padding:0; overflow:visible; border:1px solid #575757; background:#747474 url('+request_uri + 'addons/captcha/img/icon.gif) no-repeat center -20px;border-radius:3px;-moz-border-radius:3px;-webkit-border-radius:3px; cursor:pointer;box-shadow:0 0 3px #444 inset;-moz-box-shadow:0 0 3px #444 inset;-webkit-box-shadow:0 0 3px #444 inset;"></button>'+
									'</div>'+
									'<label id="captchaAbout" for="captcha" style="display:block; border-top:1px dashed #c5c5c5; padding:15px 0; margin:0 20px; font-size:12px; color:#5f5f5f;"></label>'+
									'<input name="" type="text" id="secret_text" style="ime-mode:inactive;margin:0 20px; width:232px; border:1px solid #bdbdbd; padding:3px 4px; font-size:18px; font-weight:bold;" />'+
									'<div style="margin:20px; border-top:1px dashed #c5c5c5; padding:15px 0 0 0; text-align:center">'+
										'<button type="submit" style="height:31px; line-height:31px; padding:0 15px; margin:0 2px; font-size:12px; font-weight:bold; color:#fff; overflow:visible; border:1px solid #5c8a16; background:#6faa13;border-radius:3px;-moz-border-radius:3px;-webkit-border-radius:3px; cursor:pointer;box-shadow:0 0 3px #666 inset;-moz-box-shadow:0 0 3px #666 inset;-webkit-box-shadow:0 0 3px #666 inset;"></button>'+
										'<button type="button" class="cancel" style="height:31px; line-height:31px; padding:0 15px; margin:0 2px; font-size:12px; font-weight:bold; color:#fff; overflow:visible; border:1px solid #575757; background:#747474;border-radius:3px;-moz-border-radius:3px;-webkit-border-radius:3px; cursor:pointer;box-shadow:0 0 3px #444 inset;-moz-box-shadow:0 0 3px #444 inset;-webkit-box-shadow:0 0 3px #444 inset;"></button>'+
									'</div>'+
								'</form>'+_object_ +
							'</div>').appendTo(captchaXE);

				  $div.find('button.cancel')
					.click(function(){ $('#captcha_layer').hide(); });

				  $div.find('button.play')
					.click(function(){
						var swf = window['captcha_audio'] || document['captcha_audio'];
						var audio = current_url.setQuery('captcha_action','captchaAudio').setQuery('rnd', (new Date).getTime());
						$div.find('input[type=text]').focus();
						swf.setSoundTarget(audio,'1');
						});

				  $div.find('button.reload')
					.click(function(){
						var params = new Array();
						params['captcha_action'] = 'setCaptchaSession';
						params['mid'] = current_mid;
						window.oldExecXml('','',params, function() {
							$("#captcha_image").attr("src", current_url.setQuery('captcha_action','captchaImage').setQuery('rnd', (new Date).getTime()));
						});
					});

				captchaXE.exec = function(module, act, params, callback_func, response_tags, callback_func_arg, fo_obj) {
					var doCheck = false;

					$.each(captchaTargetAct || {}, function(key,val){ if (val == act){ doCheck = true; return false; } });

					if (doCheck) { /* captcha 를 사용하는 경우 */

						$('#captcha_layer form')
						.submit(function(e){
							e.preventDefault();
							if(!$('#secret_text').val()){
								$(this).find('input[type=text]').val('').focus();
								return false;
							}
							captchaXE.compare(); return false;
						});
						calledArgs = {'module':module,'act':act,'params':params,'callback_func':callback_func,'response_tags':response_tags,'callback_func_arg':callback_func_arg,'fo_obj':fo_obj};
						var params = new Array();
						params['captcha_action'] = 'setCaptchaSession';
						params['mid'] = current_mid;
						window.oldExecXml(module, act, params, captchaXE.show,new Array('error','message','about_captcha','captcha_reload','captcha_play','cmd_input','cmd_cancel'));
					} else {
						window.oldExecXml(module, act, params, callback_func, response_tags, callback_func_arg, fo_obj);
					}

					return true;
				};

				captchaXE.show = function(ret_obj) {
					$('#captcha_layer').show();
					$("#captchaAbout").html(ret_obj['about_captcha']);
					$("#captcha_layer .reload").attr('title',ret_obj['captcha_reload']);
					$("#captcha_layer .play").attr('title',ret_obj['captcha_play']);
					$("#captcha_layer button[type=submit]").html(ret_obj['cmd_input']);
					$("#captcha_layer button.cancel").html(ret_obj['cmd_cancel']);
					$("#captcha_image").attr("src", current_url.setQuery('captcha_action','captchaImage').setQuery('rnd', (new Date).getTime()));
					$div.find('input[type=text]').val('').focus();
					$('html, body').css('height','100%');
				};

				captchaXE.compare = function(e) {
					var params = new Array();
					params['captcha_action'] = 'captchaCompare';
					params['mid'] = current_mid;
					params['secret_text'] = $('#secret_text').val();
					window.oldExecXml(calledArgs.module,calledArgs.act,params, function() {
						$("#captcha_layer").hide();
						window.oldExecXml(calledArgs.module, calledArgs.act, calledArgs.params, calledArgs.callback_func, calledArgs.response_tags, calledArgs.callback_func_arg, calledArgs.fo_obj);
					} );
				};
			}
			return captchaXE;
		}

		$(window).ready(function(){
			if(!window.oldExecXml) {
				window.oldExecXml = window.exec_xml;
				window.exec_xml = xeCaptcha().exec;
			}
		});
	});
})(jQuery);
