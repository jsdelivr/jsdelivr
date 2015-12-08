/**
 * @author NAVER (developers@xpressengine.com)
 * @version 0.1
 * @brief 에디터 관리자 페이지용 스크립트
 **/

function doSetupComponent(component_name) {
	popopen(request_uri.setQuery('module','editor').setQuery('act','dispEditorAdminSetupComponent').setQuery('component_name',component_name), 'SetupComponent');
}

function toggleSectionCheckBox(obj, id) {
	var box_list = xGetElementsByTagName('input', xGetElementById(id));
	if(typeof(box_list.length)=='undefined') return;
	for(var i in box_list) {
		box_list[i].checked = obj.checked;
	}
}
