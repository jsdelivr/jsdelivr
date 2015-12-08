jQuery(function($){

// multi-lingual text list
$('#langList')
	.find('form').hide().attr('aria-hidden','true').end() // collapse all language input control
	.delegate('button._edit', 'click', function(){
		var $this = $(this), $form = $this.parent().next('form');

		// toggle input control
		if($form.attr('aria-hidden') == 'false') {
			$form.attr('aria-hidden', 'true').slideUp('fast');
			$this.closest('li').removeClass('active');
		}else{
			$form.attr('aria-hidden', 'false').slideDown('fast');
			$this.closest('li').addClass('active');
		}

		if($form.data('lang-loaded') == true) return;
	
		$form.data('lang-loaded', true);

		function on_complete(ret) {
			var name = ret['lang_name'], list = ret['lang_list']['item'], elems = $form[0].elements, item;

			$form.find('label+textarea').prev('label').css('visibility','visible');

			if(!$.isArray(list)) list = [list];
			for(var i=0,c=list.length; i < c; i++) {
				item = list[i];
				if(item && item.lang_code && elems[item.lang_code]) {
					elems[item.lang_code].value = item.value;
					if(item.value) $(elems[item.lang_code]).prev('label').css('visibility','hidden');
				}
			}
		}

		exec_xml(
			'module',
			'getModuleAdminLangListByName',
			{lang_name:$form[0].elements['lang_name'].value},
			on_complete,
			'error,message,lang_list,lang_name'.split(',')
		);
	})

});

function doInsertLangCode(langCode, target)
{
    if(window.opener && target) {
        var obj = window.opener.get_by_id(target);
        if(obj) obj.value = '$user_lang->'+langCode;
    }
    window.close();
}
