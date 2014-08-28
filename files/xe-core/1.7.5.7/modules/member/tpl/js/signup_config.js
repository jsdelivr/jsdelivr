/* 금지아이디 관련 작업들 */
function doUpdateDeniedID(user_id, mode, message) {
    if(typeof(message)!='undefined'&&!confirm(message)) return;

    exec_xml(
		'member',
		'procMemberAdminUpdateDeniedID',
		{user_id:user_id, mode:mode},
		function(){
			if (mode == 'delete'){
				jQuery('#denied_'+user_id).remove();
				jQuery('._deniedIDCount').html(jQuery('#deniedList li').length);
			}
		},
		['error','message','tpl']
	);
}

/* prohibited nick name functions */
function doUpdateDeniedNickName(nick_name, mode, message) 
{
    if(typeof(message)!='undefined' && !confirm(message)) return;

    exec_xml(
		'member',
		'procMemberAdminUpdateDeniedNickName',
		{nick_name:nick_name, mode:mode},
		function(){
			if (mode == 'delete'){
				jQuery('#denied_'+nick_name).remove();
				jQuery('._deniedNickNameCount').html(jQuery('#deniedNickNameList li').length);
			}
		},
		['error','message','tpl']
	);
}

jQuery(function($){
	// hide form if enable_join is setted "No" 
	var suForm = $('table.__join_form'); // 회원가입 양식

	function changeTable($i)
	{
			if($i.is(':checked')){
				$i.parent('td').next('td').next('td')
					.find('>._subItem').show().end()
					.find(':radio, [type="number"]')
						.removeAttr('disabled')
						.end()
					.find(':radio[value=option]').attr('checked', 'checked')
						.end()
					.prev('td')
					.find(':input[value=Y]').removeAttr('disabled').attr('checked', 'checked');
				
			} else {
				$i.parent('td').next('td').next('td')
					.find('>._subItem').hide().end()
					.find(':radio, [type="number"]').attr('disabled','disabled').removeAttr('checked')
						.next('label').css('fontWeight','normal').end()
						.end()
					.prev('td')
					.find(':input[value=Y]').removeAttr('checked').attr('disabled', 'disabled');
			}

	}

	suForm.find(':checkbox[name="usable_list[]"]').each(function(){
		var $i = $(this);

		$i.change(function(){
			changeTable($i);
		});
	});

	$('a.modalAnchor._extendFormEdit').bind('before-open.mw', function(event){
		var memberFormSrl = $(event.target).parent().attr('id');
		var checked = $(event.target).closest('tr').find('input:radio:checked').val();

		exec_xml(
			'member',
			'getMemberAdminInsertJoinForm',
			{member_join_form_srl:memberFormSrl},
			function(ret){
				var tpl = ret.tpl.replace(/<enter>/g, '\n');
				$('#extendForm').html(tpl);

				if (checked)$('#extendForm #radio_'+checked).attr('checked', 'checked');
			},
			['error','message','tpl']
		);

	});
	
	$('a._extendFormDelete').click(function(event){
		event.preventDefault();
		if (!confirm(xe.lang.msg_delete_extend_form)) return;

		var memberFormSrl = $(event.target).parent().attr('id');
		var targetTR = $(event.target).closest('tr'); 

		exec_xml(
			'member',
			'procMemberAdminDeleteJoinForm',
			{member_join_form_srl:memberFormSrl},
			function(ret){
				targetTR.remove();
			},
			['error','message','tpl']
		);
	});

	$('button._addDeniedID').click(function(){
		var ids = $('#prohibited_id').val();
		if(ids == ''){ 
			alert(xe.lang.msg_null_prohibited_id);
			$('#prohibited_id').focus();
			return;
		}
		

		ids = ids.replace(/\n/g, ',');

		var tag;
		function on_complete(data){
			var userIds = $.trim(data.user_ids);
			if(userIds == '') return;
			var uids = userIds.split(',');
			for (var i=0; i<uids.length; i++){
				tag = '<li id="denied_'+uids[i]+'">'+uids[i]+' <button type="button" class="x_icon-remove" onclick="doUpdateDeniedID(\''+uids[i]+'\',\'delete\',\''+xe.lang.confirm_delete+'\');return false;">'+xe.lang.cmd_delete+'</button></li>';
				$('#deniedList').append($(tag));
			}
			$('#prohibited_id').val('');

			$('._deniedIDCount').html($('#deniedList li').length);
		}

		jQuery.exec_json('member.procMemberAdminInsertDeniedID', {'user_id': ids}, on_complete);

	});

	$('button._addDeniedNickName').click(function(){
		var ids = $('#prohibited_nick_name').val();
		if(ids == ''){ 
			alert(xe.lang.msg_null_prohibited_nick_name);
			$('#prohibited_nick_name').focus();
			return;
		}
		

		ids = ids.replace(/\n/g, ',');

		var tag;
		function on_complete(data)
		{
			$('#prohibited_nick_name').val('');

			var nickNames = $.trim(data.nick_names);
			if(nickNames == '') return;
			var uids = nickNames.split(',');
			for (var i=0; i<uids.length; i++)
			{
				tag = '<li id="denied_'+uids[i]+'">'+uids[i]+' <button type="button" class="x_icon-remove" onclick="doUpdateDeniedNickName(\''+uids[i]+'\',\'delete\',\''+xe.lang.confirm_delete+'\');return false;">'+xe.lang.cmd_delete+'</button></li>';
				$('#deniedNickNameList').append($(tag));
			}

			$('._deniedNickNameCount').html($('#deniedNickNameList li').length);
		}

		jQuery.exec_json('member.procMemberAdminUpdateDeniedNickName', {'nick_name': ids}, on_complete);

	});

	$('input[name=identifier]').change(function(){
		var $checkedTR = $('input[name=identifier]:checked').closest('tr');
		var $notCheckedTR = $('input[name=identifier]:not(:checked)').closest('tr');
		var name, notName;
		if (!$checkedTR.hasClass('sticky')){
			name = $checkedTR.find('input[name="list_order[]"]').val();
			if (!$checkedTR.find('input[type=hidden][name="usable_list[]"]').length) $('<input type="hidden" name="usable_list[]" value="'+name+'" />').insertBefore($checkedTR);
			if (!$checkedTR.find('input[type=hidden][name='+name+']').length) $('<input type="hidden" name="'+name+'" value="required" />').insertBefore($checkedTR);
			$checkedTR.find('th').html('<span class="_title" style="padding-left:20px" >'+$checkedTR.find('th ._title').html()+'</span>');
			$checkedTR.find('input[type=checkbox][name="usable_list[]"]').attr('checked', 'checked').attr('disabled', 'disabled');
			$checkedTR.find('input[type=radio][name='+name+'][value=required]').attr('checked', 'checked').attr('disabled', 'disabled');
			$checkedTR.find('input[type=radio][name='+name+'][value=option]').removeAttr('checked').attr('disabled', 'disabled');
			$checkedTR.addClass('sticky');
			$checkedTR.parent().prepend($checkedTR);

			notName = $notCheckedTR.find('input[name="list_order[]"]').val();
			if (notName == 'user_id'){
				if ($notCheckedTR.find('input[type=hidden][name="usable_list[]"]').length) $notCheckedTR.find('input[type=hidden][name="usable_list[]"]').remove();
				if ($notCheckedTR.find('input[type=hidden][name='+name+']').length) $notCheckedTR.find('input[type=hidden][name='+name+']').remove();
				$notCheckedTR.find('input[type=checkbox][name="usable_list[]"]').removeAttr('disabled');
				$notCheckedTR.find('input[type=radio][name='+notName+']').removeAttr('disabled');
			}
			$notCheckedTR.find('th').html('<div class="wrap"><button type="button" class="dragBtn">Move to</button><span class="_title" >'+$notCheckedTR.find('th ._title').html()+'</span></div>');
			$notCheckedTR.removeClass('sticky');

			// add sticky class 
		}
	});
	
	$('#userDefine').submit(function(e) {
		var id_list = $(this).find('input[name=join_form_id_list]').val();
		var id_list_arr = id_list.split(',');

		var column_id = $(this).find('input[name=column_id]').val();
		var old_column_id = $(this).find('input[name=old_column_id]').val();
		if($.inArray(column_id, id_list_arr) > -1 && column_id != old_column_id) {
			alert(xe.lang.msg_exists_user_id);
			return false;
		}
		else return true;
	});

	$('.__redirect_url_btn').click(function(e){
		$(this).parent().find('input[name=redirect_url]').val('');
		$(this).parent().find('input[type=text]').val('');
	});
});
