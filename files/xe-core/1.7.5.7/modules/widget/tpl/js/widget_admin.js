/**
 * @file   modules/widget/js/widget_admin.js
 * @author NAVER (developers@xpressengine.com)
 * @brief  widget 모듈의 관리자용 javascript
 **/

/* 생성된 코드를 textarea에 출력 */
function completeGenerateCode(ret_obj) {
	var widget_code = ret_obj.widget_code;
		widget_code = widget_code.replace(/&/g, "&amp;");
		widget_code = widget_code.replace(/\'/g, "&apos;");
	var zone = get_by_id("widget_code");
	zone.value = widget_code;
}

/* 생성된 코드를 페이지 zone에 출력 */
function completeGenerateCodeInPage(ret_obj,response_tags,params,fo_obj) {
	var widget_code = ret_obj.widget_code;
	if(!opener || !widget_code) {
		window.close();
		return;
	}

	opener.doAddWidgetCode(widget_code);
	window.close();
}

/* 위젯 코드 생성시 스킨을 고르면 컬러셋의 정보를 표시 */
function doDisplaySkinColorset(sel, colorset) {
	var skin = sel.options[sel.selectedIndex].value;
	if(!skin) {
		get_by_id("colorset_area").style.display = "none";
		setFixedPopupSize();
		return;
	}

	var params = [];
	params.selected_widget = get_by_id("fo_widget").selected_widget.value;
	params.skin = skin;
	params.colorset = colorset;

	var response_tags = new Array("error","message","colorset_list");

	exec_xml("widget", "procWidgetGetColorsetList", params, completeGetSkinColorset, response_tags, params);
}

/* 서버에서 받아온 컬러셋을 표시 */
function completeGetSkinColorset(ret_obj, response_tags, params, fo_obj) {
	/*jshint -W004*/
	var sel = jQuery("#fo_widget")[0].widget_colorset;
	var length = sel.options.length;
	var selected_colorset = params.colorset;
	for(var i=0;i<length;i++) sel.remove(0);

	if(!ret_obj.colorset_list) return;

	var colorset_list = ret_obj.colorset_list.split("\n");
	var selected_index = 0;
	for(var i=0;i<colorset_list.length;i++) {
		var tmp = colorset_list[i].split("|@|");
		if(selected_colorset && selected_colorset==tmp[0]) selected_index = i;
		var opt = new Option(tmp[1], tmp[0], false, false);
		sel.options.add(opt);
	}

	sel.selectedIndex = selected_index;

	jQuery("#colorset_area").show();
	setFixedPopupSize();
}


var selected_node = null;
/* 페이지 모듈에서 위젯스타일 수정하려고 할 경우 */
function getWidgetVars() {
	if(!opener || !opener.selectedWidget || !opener.selectedWidget.getAttribute("widget")) return;
	selected_node = opener.selectedWidget;

	if(!get_by_id('fo_widget').widgetstyle.value) {
		get_by_id('fo_widget').widgetstyle.value = selected_node.getAttribute('widgetstyle');
	}

	doFillWidgetVars();
}

/* 페이지 모듈에서 내용의 위젯을 더블클릭하여 수정하려고 할 경우 */
function doFillWidgetVars() {
	if(!opener || !opener.selectedWidget || !opener.selectedWidget.getAttribute("widget")) return;
	selected_node = opener.selectedWidget;

	// 스킨과 컬러셋은 기본
	var skin = selected_node.getAttribute("skin");
	var colorset = selected_node.getAttribute("colorset");
	var widget_sequence = parseInt(selected_node.getAttribute("widget_sequence"),10);

	var fo_widget = jQuery("#fo_widget");
	var fo_obj = get_by_id("fo_widget");
	jQuery('#widget_skin').val(skin);

	// 위젯 스타일 유지를 위한 hidden input 추가하고 값을 저장
	var attrs = selected_node.attributes;
	for (i=0; i< attrs.length ; i++){
		var name = attrs[i].name;
		var value = jQuery(selected_node).attr(name);
		if(value=='Array') continue;
		if(jQuery("[name="+name+"]",fo_widget).size()>0 || !value || name == 'style') continue;

		var dummy = jQuery('<input type="hidden" name="'+name+'" >').val(value).appendTo("#fo_widget").get(0);
	}

	// 위젯의 속성 설정
	var obj_list = [];
	jQuery('input,select,textarea','#fo_widget').each( function() {
			obj_list.push(this);
	});

	for(var j=0;j<obj_list.length;j++) {
		/*jshint -W004*/
		var node = obj_list[j];
		if(node.name.indexOf('_') === 0) continue;
		if(node.name == 'widgetstyle') continue;

		var length = node.length;
		var type = node.type;
		if((typeof(type)=='undefined'||!type) && typeof(length)!='undefined' && typeof(node[0])!='undefined' && length>0) type = node[0].type;
		else length = 0;
		var name = node.name;

		switch(type) {
			case "hidden" :
			case "text" :
			case "textarea" :
					var val = selected_node.getAttribute(name);
					if(!val) continue;
					var unescaped_val = unescape(val);
					if(!unescaped_val) node.value = val;
					else node.value = unescaped_val;
				break;
			case "checkbox" :
					if(selected_node.getAttribute(name)) {
						var val = selected_node.getAttribute(name).split(',');
						if(fo_obj[name].length) {
							for(var i=0;i<fo_obj[name].length;i++) {
								var v = fo_obj[name][i].value;
								for(var k=0;k<val.length;k++) {
									if(v == val[k]) {
										fo_obj[name][i].checked=true;
										break;
									}
								}
							}
						} else {
							if(fo_obj[name].value == val) fo_obj[name].checked =true;
						}
					}
				break;
			case "select" :
			case "select-one" :
					var val = selected_node.getAttribute(name);
					var sel = fo_obj[name];
					if(!val) break;
					for(var i=0;i<sel.options.length;i++) {
						if(sel.options[i].value == val) sel.options[i].selected = true;
						else sel.options[i].selected = false;
					}
				break;
		}

	}

	var style = selected_node.getAttribute("style");
	if(typeof(style)=="object") style = style.cssText;
	fo_obj.style.value = style;

	fo_obj.widget_padding_left.value = selected_node.getAttribute("widget_padding_left");
	fo_obj.widget_padding_right.value = selected_node.getAttribute("widget_padding_right");
	fo_obj.widget_padding_bottom.value = selected_node.getAttribute("widget_padding_bottom");
	fo_obj.widget_padding_top.value = selected_node.getAttribute("widget_padding_top");


	//  컬러셋 설정
	if(skin && get_by_id("widget_colorset") && get_by_id("widget_colorset").options.length<1 && colorset) {
		doDisplaySkinColorset(get_by_id("widget_skin"), colorset);
	}

	// widget sequence 설정
	fo_obj.widget_sequence.value = widget_sequence;
}

function checkFixType(obj) {
	var val = obj.options[obj.selectedIndex].value;
	if(val != "px") {
		var fo_obj = get_by_id("fo_widget");
		var width = fo_obj.widget_width.value;
		if(width>100) fo_obj.widget_width.value = 100;
	}
}

// 위젯의 대상 모듈 입력기 (단일 선택)
function insertSelectedModule(id, module_srl, mid, browser_title) {
	var obj= get_by_id('_'+id);
	var sObj = get_by_id(id);
	sObj.value = module_srl;
	obj.value = browser_title+' ('+mid+')';

}

// 위젯의 대상 모듈 입력기 (다중 선택)
function insertSelectedModules(id, module_srl, mid, browser_title) {
	var sel_obj = jQuery('#_'+id)[0];
	for(var i=0;i<sel_obj.options.length;i++) if(sel_obj.options[i].value==module_srl) return;
	var opt = new Option(browser_title+' ('+mid+')', module_srl, false, false);
	sel_obj.options[sel_obj.options.length] = opt;
	if(sel_obj.options.length>8) sel_obj.size = sel_obj.options.length;

	syncMid(id);
}

function midMoveUp(id) {
	var sel_obj = get_by_id('_'+id);
	if(sel_obj.selectedIndex<0) return;
	var idx = sel_obj.selectedIndex;

	if(idx < 1) return;

	var s_obj = sel_obj.options[idx];
	var t_obj = sel_obj.options[idx-1];
	var value = s_obj.value;
	var text = s_obj.text;
	s_obj.value = t_obj.value;
	s_obj.text = t_obj.text;
	t_obj.value = value;
	t_obj.text = text;
	sel_obj.selectedIndex = idx-1;

	syncMid(id);
}

function midMoveDown(id) {
	var sel_obj = get_by_id('_'+id);
	if(sel_obj.selectedIndex<0) return;
	var idx = sel_obj.selectedIndex;

	if(idx == sel_obj.options.length-1) return;

	var s_obj = sel_obj.options[idx];
	var t_obj = sel_obj.options[idx+1];
	var value = s_obj.value;
	var text = s_obj.text;
	s_obj.value = t_obj.value;
	s_obj.text = t_obj.text;
	t_obj.value = value;
	t_obj.text = text;
	sel_obj.selectedIndex = idx+1;

	syncMid(id);
}

function midRemove(id) {
	var sel_obj = get_by_id('_'+id);
	if(sel_obj.selectedIndex<0) return;
	var idx = sel_obj.selectedIndex;
	sel_obj.remove(idx);
	idx = idx-1;
	if(idx < 0) idx = 0;
	if(sel_obj.options.length) sel_obj.selectedIndex = idx;

	syncMid(id);
}

function syncMid(id) {
	var sel_obj = jQuery('#_'+id)[0];
	var valueArray = [];
	for(var i=0;i<sel_obj.options.length;i++) valueArray[valueArray.length] = sel_obj.options[i].value;
	jQuery('#'+id).val( valueArray.join(',') );
}

function getModuleSrlList(id) {
	var obj = jQuery('#'+id);
	if(!obj[0] || !obj.val()) return;

	var params = [];
	params.module_srls = obj.val();
	params.id = id;

	var response_tags = ["error","message","module_list","id"];
	exec_xml("module", "getModuleAdminModuleList", params, completeGetModuleSrlList, response_tags, params);
}

function completeGetModuleSrlList(ret_obj, response_tags) {
	var id = ret_obj.id;
	var sel_obj = jQuery('#_'+id);
	if(!sel_obj[0]) return;

	var module_list = ret_obj.module_list;
	if(!module_list) return;
	var item = module_list.item;
	if(typeof(item.length)=='undefined' || item.length<1) item = [item];

	for(var i=0;i<item.length;i++) {
		var module_srl = item[i].module_srl;
		var mid = item[i].mid;
		var browser_title = item[i].browser_title;
		var opt = new Option(browser_title+' ('+mid+')', module_srl);
		sel_obj[0].options.add(opt);
	}
}

function getModuleSrl(id) {
	var obj = get_by_id(id);
	if(!obj.value) return;
	var value = obj.value;
	var params = [];
	params.module_srls = obj.value;
	params.id = id;

	var response_tags = new Array("error","message","module_list","id");
	exec_xml("module", "getModuleAdminModuleList", params, completeGetModuleSrl, response_tags, params);
}

function completeGetModuleSrl(ret_obj, response_tags) {
	var id = ret_obj.id;
	var obj = get_by_id('_'+id);
	var sObj = get_by_id(id);
	if(!sObj || !obj) return;

	var module_list = ret_obj.module_list;
	if(!module_list) return;
	var item = module_list.item;
	if(typeof(item.length)=='undefined' || item.length<1) item = new Array(item);

	sObj.value = item[0].module_srl;
	obj.value = item[0].browser_title+' ('+item[0].mid+')';
}

var windowLoadEventLoader = [];
function doAddWindowLoadEventLoader(func) {
	windowLoadEventLoader.push(func);
}
function excuteWindowLoadEvent() {
	for(var i=0;i<windowLoadEventLoader.length;i++) {
		windowLoadEventLoader[i]();
	}
}

jQuery(window).load(excuteWindowLoadEvent);


function selectWidget(val){
	var url =current_url.setQuery('selected_widget', val);
	document.location.href = url;
}

function widgetstyle_extra_image_upload(f){
	f.act.value='procWidgetStyleExtraImageUpload';
	f.submit();
}

function MultiOrderSet(id){
	var selectedObj = jQuery("[name='selected_"+id+"']").get(0);

	var value = [];
	for(i=0;i<selectedObj.options.length;i++){
		value.push(selectedObj.options[i].value);
	}
	jQuery("[name='"+id+"']").val(value.join(','));
}


function MultiOrderAdd(id){
	var showObj = jQuery("[name='show_"+id+"']").get(0);
	var selectedObj = jQuery("[name='selected_"+id+"']").get(0);
	var defaultObj = jQuery("[name='default_"+id+"']").val().split(',');

	if(showObj.selectedIndex<0) return;
	var idx = showObj.selectedIndex;
	var svalue = showObj.options[idx].value;


	for(i=0;i<selectedObj.options.length;i++){
		if(selectedObj.options[i].value == svalue) return;
	}
	selectedObj.options.add(new Option(svalue, svalue, false, false));

	MultiOrderSet(id);
}


function MultiOrderDelete(id){
	var showObj = jQuery("[name='show_"+id+"']").get(0);
	var selectedObj = jQuery("[name='selected_"+id+"']").get(0);
	var defaultObj = jQuery("[name='default_"+id+"']").val().split(',');

	var idx = selectedObj.selectedIndex;
	if(idx<0) return;
	for(i=0;i<defaultObj.length;i++){
		if(jQuery.inArray(selectedObj.options[idx].value, defaultObj) > -1) return;
	}

	selectedObj.remove(idx);
	idx = idx-1;
	if(idx < 0) idx = 0;
	if(selectedObj.options.length) selectedObj.selectedIndex = idx;

	MultiOrderSet(id);
}

function MultiOrderUp(id){
	var selectedObj = jQuery("[name='selected_"+id+"']").get(0);
	if(selectedObj.selectedIndex<0) return;
	var idx = selectedObj.selectedIndex;

	if(idx < 1) return;

	var s_obj = selectedObj.options[idx];
	var t_obj = selectedObj.options[idx-1];
	var value = s_obj.value;
	var text = s_obj.text;
	s_obj.value = t_obj.value;
	s_obj.text = t_obj.text;
	t_obj.value = value;
	t_obj.text = text;
	selectedObj.selectedIndex = idx-1;

	MultiOrderSet(id);
}


function MultiOrderDown(id){
	var selectedObj = jQuery("[name='selected_"+id+"']").get(0);
	if(selectedObj.selectedIndex<0) return;
	var idx = selectedObj.selectedIndex;

	if(idx == selectedObj.options.length-1) return;

	var s_obj = selectedObj.options[idx];
	var t_obj = selectedObj.options[idx+1];
	var value = s_obj.value;
	var text = s_obj.text;
	s_obj.value = t_obj.value;
	s_obj.text = t_obj.text;
	t_obj.value = value;
	t_obj.text = text;
	selectedObj.selectedIndex = idx+1;

	MultiOrderSet(id);
}

function initMultiOrder(id){
	var selectedObj = jQuery("[name='selected_"+id+"']").get(0);
	var init_value = jQuery("[name='init_"+id+"']").val();
	var save_value = jQuery("[name='"+id+"']").val();
	if(save_value){
		var arr_save_value = save_value.split(',');
		for(i=0;i<arr_save_value.length;i++){
			if(arr_save_value[i].length>0){
				var opt = new Option(arr_save_value[i], arr_save_value[i]);
				selectedObj.options.add(opt);
			}
		}
	}else{
		/*jshint -W004*/
		var arr_init_value = init_value.split(',');
		for(i=0;i<arr_init_value.length;i++){
			if(arr_init_value[i].length>0){
				var opt = new Option(arr_init_value[i], arr_init_value[i]);
				selectedObj.options.add(opt);
			}
		}

	}
	MultiOrderSet(id);
}
