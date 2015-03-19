jQuery(function($){
	$('a.modalAnchor._member').bind('before-open.mw', function(){
		var $memberList = $('#memberList tbody :checked');
		if ($memberList.length == 0){
			alert(xe.lang.msg_select_user);
			return false;
		}
		var memberInfo, memberSrl;
		var memberTag = "";
		$('input[name="groups[]"]:checked').removeAttr('checked');
		$('#message').val('');
		$('#popupBody').empty();
		for (var i = 0; i<$memberList.length; i++){
			memberInfo = $memberList.eq(i).val().split('\t');
			memberSrl = memberInfo.shift();

			$tr = $('<tr></tr>');

			for(var j in memberInfo)
			{
				var info = memberInfo[j];
				var $td = $('<td></td>').text(info);
				$tr.append($td);
			}

			$tr.append('<td><input type="hidden" name="member_srls[]" value="'+memberSrl+'"/></td>');
			$('#popupBody').append($tr);
		}
	});
});
