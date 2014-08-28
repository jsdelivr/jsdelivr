/**
 * @file     modules/module/js/module_admin.js
 * @author NAVER (developers@xpressengine.com)
 * @brief    module 모듈의 관리자용 javascript
 **/
/* 모듈 즐겨찾기 */
function doToggleFavoriteModule(obj, module_name) {
	function on_complete(data){
		if (data.result == 'on')
			jQuery(obj).removeClass('fvOff').addClass('fvOn').html(xe.lang.favorite_on);
		else
			jQuery(obj).removeClass('fvOn').addClass('fvOff').html(xe.lang.favorite_off);
	}

	jQuery.exec_json('admin.procAdminToggleFavorite', {'module_name': module_name, 'site_srl': 0}, on_complete);
}

/* 카테고리 관련 작업들 */
function doUpdateCategory(module_category_srl, message) {
    if(typeof(message)!='undefined'&&!confirm(message)) return;

    var fo_obj = get_by_id('fo_category_info');
    fo_obj.module_category_srl.value = module_category_srl;
	fo_obj.submit();
}

/* 카테고리 정보 수정 후 */
function completeUpdateCategory(ret_obj) {
    var error = ret_obj['error'];
    var message = ret_obj['message'];

    alert(message);

    location.href =  current_url.setQuery('module_category_srl','');
}

/* 선택된 모듈을 관리자 메뉴의 바로가기에 등록 */
function doAddShortCut(module) {
    var fo_obj = get_by_id("fo_shortcut");
    fo_obj.selected_module.value = module;
    procFilter(fo_obj, insert_shortcut);
}

/* 모듈 설치 */
function doInstallModule(module) {
    var params = new Array();
    params['module_name'] = module;
    exec_xml('install','procInstallAdminInstall',params, completeInstallModule);
}

function completeInstallModule(ret_obj) {
    alert(ret_obj['message']);
    location.reload();
}

/* 모듈 업그레이드 */
function doUpdateModule(module) {
    var params = new Array();
    params['module_name'] = module;
    exec_xml('install','procInstallAdminUpdate',params, completeInstallModule);
}

/* 모듈 복사후 */
function completeCopyModule() {
    if(typeof(opener)!='undefined') opener.location.href = opener.location.href;
    window.close();
}

/* 모듈 선택기에서 선택된 모듈의 입력 */
function insertModule(id, module_srl, mid, browser_title, multi_select) {
    if(typeof(multi_select)=='undefined') multi_select = true;
    if(!window.opener) window.close();

    if(multi_select) {
        if(typeof(opener.insertSelectedModules)=='undefined') return;
        opener.insertSelectedModules(id, module_srl, mid, browser_title);
    } else {
        if(typeof(opener.insertSelectedModule)=='undefined') return;
        opener.insertSelectedModule(id, module_srl, mid, browser_title);
        window.close();
    }
}

/* 권한 선택용 */
function doShowGrantZone() {
    jQuery(".grant_default").each( function() {
        var id = "#zone_"+this.name.replace(/_default$/,'');
        if(!jQuery(this).val()) jQuery(id).css("display","block");
        else jQuery(id).css("display","none");
    } );
}

/* 권한 등록 후 알림 메세지 */
function completeInsertGrant(ret_obj) {
    // alert(ret_obj['message']);
    location.reload();
}

/* 관리자 아이디 등록/ 제거 */
function doInsertAdmin() {
    var fo_obj = get_by_id("fo_obj");
    var sel_obj = fo_obj._admin_member;
    var admin_id = fo_obj.admin_id.value;
    if(!admin_id) return;

    var opt = new Option(admin_id,admin_id,true,true);
    sel_obj.options[sel_obj.options.length] = opt;

    fo_obj.admin_id.value = '';
    sel_obj.size = sel_obj.options.length;
    sel_obj.selectedIndex = -1;

    var members = new Array();
    for(var i=0;i<sel_obj.options.length;i++) {
        members[members.length] = sel_obj.options[i].value;

    }
    fo_obj.admin_member.value = members.join(',');

    fo_obj.admin_id.focus();
}

function doDeleteAdmin() {
    var fo_obj = get_by_id("fo_obj");
    var sel_obj = fo_obj._admin_member;
    sel_obj.remove(sel_obj.selectedIndex);

    sel_obj.size = sel_obj.options.length;
    sel_obj.selectedIndex = -1;

    var members = new Array();
    for(var i=0;i<sel_obj.options.length;i++) {
        members[members.length] = sel_obj.options[i].value;

    }
    fo_obj.admin_member.value = members.join(',');
}


function completeModuleSetup(ret_obj) {
    alert(ret_obj['message']);
    window.close();
}

/**
 * 언어 관련
 **/
function doInsertLangCode(name) {
    var fo_obj = get_by_id("menu_fo");
    var target = fo_obj.target.value;
    if(window.opener && target) {
        var obj = window.opener.get_by_id(target);
        if(obj) obj.value = '$user_lang->'+name;
    }
    window.close();
}

function completeInsertLang(ret_obj) {
    doInsertLangCode(ret_obj['name']);
}

function doDeleteLang(name) {
    var params = new Array();
    params['name'] = name;
    var response_args = new Array('error','message');
    exec_xml('module','procModuleAdminDeleteLang',params, completeDeleteLang);
}

function completeDeleteLang(ret_obj) {
    location.href = current_url.setQuery('name','');
}

function doFillLangName() {
	if (/[\?&]name=/i.test(location.search)) return;

    var $form  = jQuery("#menu_fo");
    var target = $form[0].target.value;
    if(window.opener && window.opener.document.getElementById(target)) {
        var value = window.opener.document.getElementById(target).value;
        if(/^\$user_lang->/.test(value)) {
            var param = new Array();
            param['name'] = value.replace(/^\$user_lang->/,'');
            var response_tags = new Array('error','message','name','langs');
            exec_xml('module','getModuleAdminLangCode',param,completeFillLangName, response_tags);
        }
    }
}

function completeFillLangName(ret_obj, response_tags) {
    var name  = ret_obj['name'];
    var langs = ret_obj['langs'];
    if(typeof(langs)=='undefined') return;
    var $form = jQuery("#menu_fo");
    $form[0].lang_code.value = name;
    for(var i in langs) {
        $form[0][i].value = langs[i];
    }

}
