

/* 메뉴 삭제 */
function doDeleteMenu(menu_srl) {
      var fo_obj = jQuery("#fo_menu")[0];
      if(!fo_obj) return;
      fo_obj.menu_srl.value = menu_srl;
      procFilter(fo_obj, delete_menu);
}

/* 메뉴 삭제 후 */ 
function completeDeleteMenu(ret_obj) {
    var menu_srl = ret_obj['menu_srl'];
    alert(ret_obj['message']);
    location.href = current_url.setQuery('act','dispMenuAdminContent').setQuery('menu_srl','');
} 

/* 빈 메뉴 아이템 추가 */
function doInsertMenuItem(parent_srl) {
    if(typeof(parent_srl)=='undefined') parent_srl = 0;
    var params = {node_srl:0, parent_srl:parent_srl}
    doGetMenuItemInfo('menu', params);
    deSelectNode();
}

/* 메뉴 클릭시 적용할 함수 */
function doGetMenuItemInfo(menu_id, obj) {
    // menu, menu_id, node_srl을 추출
    var fo_obj = jQuery("#fo_menu")[0];
    var node_srl = 0;
    var parent_srl = 0;

    if(typeof(obj)!="undefined") {
        if(typeof(obj.getAttribute)!="undefined") { 
          node_srl = obj.getAttribute("node_srl");
        } else {
            node_srl = obj.node_srl; 
            parent_srl = obj.parent_srl; 
        }
    }

    var params = {menu_item_srl:node_srl, parent_srl:parent_srl};

    // 서버에 요청하여 해당 노드의 정보를 수정할 수 있도록 한다. 
    var response_tags = new Array('error','message','tpl');
    exec_xml('menu', 'getMenuAdminTplInfo', params, completeGetMenuItemTplInfo, response_tags, params);
}

/* 서버로부터 받아온 메뉴 정보를 출력 */
function hideCategoryInfo() {
	jQuery("#menu_zone_info").html("");
}

function completeGetMenuItemTplInfo(ret_obj, response_tags) {
    var obj = jQuery('#menu_zone_info');
	var sc_top = jQuery(document).scrollTop();

    if(sc_top > 200) {
		obj.css('margin-top', (sc_top-210)+'px');
    } else {
		obj.css('margin-top', 0);
    }

    var tpl = ret_obj['tpl'];
	obj.html(tpl).show();
}

/* 메뉴를 드래그하여 이동한 후 실행할 함수 , 이동하는 item_srl과 대상 item_srl을 받음 */
function doMoveTree(menu_id, source_item, target_item) {
    var fo_obj = jQuery("#fo_move_menu")[0];
    fo_obj.menu_id.value = menu_id;
    fo_obj.source_item.value = source_item;
    fo_obj.target_item.value = target_item;

    // 이동 취소를 선택하였을 경우 다시 그림;;
    if(!procFilter(fo_obj, move_menu_item)) {
        var params = [];
        params["xml_file"] = jQuery('#fo_menu')[0].xml_file.value;
        params["source_item"] = source_item;
        completeMoveMenuItem(params);
    }
}

function completeMoveMenuItem(ret_obj) {
    var source_item_srl = ret_obj['source_item_srl'];
    var xml_file = ret_obj['xml_file'];

    var fo_menu = jQuery("#fo_menu")[0];
    if(!fo_menu) return;

    var title = fo_menu.title.value;
    loadTreeMenu(xml_file, 'menu', "menu_zone_menu", title, '', doGetMenuItemInfo, source_item_srl, doMoveTree);
}

/* 메뉴 목록 갱신 */
function doReloadTreeMenu(menu_srl) {
    var params = new Array();
    params["menu_srl"] = menu_srl;

    // 서버에 요청하여 해당 노드의 정보를 수정할 수 있도록 한다. 
    var response_tags = new Array('error','message', 'xml_file', 'menu_title');
    exec_xml('menu', 'procMenuAdminMakeXmlFile', params, completeRemakeCache, response_tags, params);
}

function completeRemakeCache(ret_obj) {
	if(ret_obj.error == 0)
	{
		document.location.reload();
	}
}

/* 메뉴 삭제 */
function doDeleteMenuItem(menu_item_srl) {
      var fo_obj = jQuery("#fo_menu")[0];
      if(!fo_obj) return;

      procFilter(fo_obj, delete_menu_item);
}

/* 메뉴 아이템 삭제 후 */ 
function completeDeleteMenuItem(ret_obj) {
    var menu_title = ret_obj['menu_title'];
    var menu_srl = ret_obj['menu_srl'];
    var menu_item_srl = ret_obj['menu_item_srl'];
    var xml_file = ret_obj['xml_file'];
    alert(ret_obj['message']);

    loadTreeMenu(xml_file, 'menu', 'menu_zone_menu', menu_title, '', doGetMenuItemInfo, menu_item_srl, doMoveTree);
	jQuery('#menu_zone_info').html('');
} 


/* 레이아웃의 메뉴에 mid 추가 */
function doInsertMid(mid, menu_id) {
    if(!opener) {
        window.close();
        return;
    }

    var fo_obj = opener.document.getElementById("fo_menu");
    if(!fo_obj) {
        window.close();
        return;
    }

    fo_obj.menu_url.value = mid;
    window.close();
}

/* 각 메뉴의 버튼 이미지 등록 */
function doMenuUploadButton(obj) {
    // 이미지인지 체크
    if(!/\.(gif|jpg|jpeg|png)$/i.test(obj.value)) return alert(alertImageOnly);

    var fo_obj = jQuery("#fo_menu")[0];
    fo_obj.act.value = "procMenuAdminUploadButton";
    fo_obj.target.value = obj.name;
    fo_obj.submit();
    fo_obj.act.value = "";
    fo_obj.target.value = "";
}

/* 메뉴 이미지 업로드 후처리 */
function completeMenuUploadButton(target, filename) {
    var column_name = target.replace(/^menu_/,'');
    var fo_obj = jQuery('#fo_menu')[0];
    var zone_obj = jQuery('#'+target+'_zone');
    var img_obj = jQuery('#'+target+'_img');

    fo_obj[column_name].value = filename;

    var img = new Image();
    img.src = filename;
    img_obj.attr('src', img.src);
	zone_obj.show();
}

/* 업로드된 메뉴 이미지 삭제 */
function doDeleteButton(target) {
    var fo_obj = jQuery("#fo_menu")[0];

    var col_name = target.replace(/^menu_/,'');

    var params = new Array();
    params['target'] = target;
    params['menu_srl'] = fo_obj.menu_srl.value;
    params['menu_item_srl'] = fo_obj.menu_item_srl.value;
    params['filename'] = fo_obj[col_name].value;

    var response_tags = new Array('error','message', 'target');

    exec_xml('menu','procMenuAdminDeleteButton', params, completeDeleteButton, response_tags);
}

function completeDeleteButton(ret_obj, response_tags) {
    var target = ret_obj['target'];
    var column_name = target.replace(/^menu_/,'');

	jQuery('#fo_menu')[0][column_name].value = '';
    jQuery('#'+target+'_img').attr('src', '');
	jQuery('#'+target+'_zone').hide();
}
/* 메뉴 입력후 */ 
function completeInsertMenu(ret_obj) {
    var menu_srl = ret_obj['menu_srl'];
    alert(ret_obj['message']);
    location.href = current_url.setQuery('act','dispMenuAdminContent');
} 
