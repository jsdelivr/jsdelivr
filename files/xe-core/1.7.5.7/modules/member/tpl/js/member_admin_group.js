jQuery(function ($){
	if($('input[name=group_image_mark]:checked').val() == 'Y') $('._imageMarkButton').show();
	else $('._imageMarkButton').hide();
	
	$('input[name=group_image_mark]').click(function (){
		var checked = $(this).val();
		if (checked == 'Y') $('._imageMarkButton').show();
		else $('._imageMarkButton').hide();
	});

	$('input:radio[name=defaultGroup]').click(function(){
		$('._deleteTD').show();
		if ($(this).attr('checked')){
			$(this).closest('tr').find('._deleteTD').hide();
		}
	});
	/**
	 * use dispMemberAdminSiteMemberGroup
	 **/
	$('a.modalAnchor._imageMark').bind('before-open.mw', function(e){
		var $targetImage = $(e.target).parent().find('img');
		var $imageMarkHidden = $(e.target).parent().find('._imgMarkHidden');
		if ($targetImage.length){
			$("._useImageMark").show();
			$("#useImageMark").attr("checked", "checked");
			$("#noImageMark").removeAttr("checked")
				.click(function (){
					$targetImage.remove();
					$imageMarkHidden.val('');
					$('a.modalAnchor._imageMark').trigger('close.mw');
				});
		}else{
			$("._useImageMark").hide();
			$("#useImageMark").removeAttr("checked");
			$("#noImageMark").attr("checked", "checked");
		}
	});

	$('._deleteGroup').click(function (event){
		event.preventDefault();
		var $target = $(event.target).closest('tr');
		var group_srl = $(event.target).attr('href').substr(1); 
		if(!confirm(xe.lang.groupDeleteMessage)) return;

		if (group_srl.indexOf("new") >= 0){
			$target.remove();
			return;
		}

		exec_xml(
			'member',
			'procMemberAdminDeleteGroup',
			{group_srl:group_srl},
			function(){location.reload();},
			['error','message','tpl']
		);

	});

	$('._addGroup').click(function (event){
		var $tbody = $('._groupList');
		var index = 'new'+ new Date().getTime();

		$tbody.find('._template').clone(true)
			.removeClass('_template')
			.find('input').removeAttr('disabled').end()
			.find('input:radio').val(index).end()
			.find('input[name="group_srls[]"]').val(index).end()
			.show()
			.appendTo($tbody)
			.find('.lang_code').xeApplyMultilingualUI();

		return false;
	});

	$('.filebox').bind('filebox.selected', function (e, src){
		var $targetImage = $(this).parent().find('img');
		var $imageMarkHidden = $(this).parent().find('._imgMarkHidden');
		
		if ($targetImage.length){
			$targetImage.attr('src', src);
		}else{
			$targetImage = $('<img src="'+src+'" alt="" style="margin-right:4px" />').insertBefore(this);
		}
		$imageMarkHidden.val(src);
	});
	//add plugin
	var CheckTitle = xe.createPlugin('checkTitle', {
		API_BEFORE_VALIDATE : function(sender, params){
			$('input[name="group_titles[]"]').each(function(index){
				if ($(this).val() == ""){
					$(this).val($(this).closest('td').find('input:text.vLang').val());
				}
			});
		}
	});
	
	var checkTitle = new CheckTitle();
	var v = xe.getApp('Validator')[0];
	v.registerPlugin(checkTitle);
});
