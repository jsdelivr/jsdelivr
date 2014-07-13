/* 개별 쪽지 삭제 */
function doDeleteMessage(message_srl) {
	if(!message_srl) return;
	if(!confirm(confirm_delete_msg)) return;

	var params = new Array();
	params['message_srl'] = message_srl;
	exec_xml('communication', 'procCommunicationDeleteMessage', params, completeDeleteMessage);
}

function completeDeleteMessage(ret_obj) {
	alert(ret_obj['message']);
	location.href = current_url.setQuery('message_srl','');
}

function mergeContents()
{
	var $form = jQuery('#fo_comm');
	var content = $form.find('textarea[name=new_content]').val() + $form.find('input[name=source_content]').val();
	$form.find('input[name=content]').val(content);
	$form.submit();
}
