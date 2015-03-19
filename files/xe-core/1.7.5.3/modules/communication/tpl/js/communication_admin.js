/* 스킨 컬러셋 구해옴 */
function doGetSkinColorset(skin, type) {
    var params = new Array();
    params['skin'] = skin;
	params['type'] = type;

    var response_tags = new Array('error','message','tpl', 'type');
    exec_xml('communication', 'getCommunicationAdminColorset', params, doDisplaySkinColorset, response_tags);
}

function doDisplaySkinColorset(ret_obj) {
    var tpl = ret_obj["tpl"];
	var type = ret_obj['type'];
	var $controls = null;
	var $control_group = null;

	if(type == 'P'){
		$controls = jQuery('#communication_colorset');
		$control_group = jQuery('#__skin_colorset');
	}else{
		$controls = jQuery('#communication_mcolorset');
		$control_group = jQuery('#__mskin_colorset');
	}

	$controls.html(tpl);
	if(tpl){
		$control_group.show();
	}else{
		$control_group.hide();
	}
}

