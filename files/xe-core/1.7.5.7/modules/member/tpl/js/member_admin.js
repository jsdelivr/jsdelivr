/**
 * Deprecate this file.
 *
 */ 
/* 사용자 추가 */
function completeInsert(ret_obj) {
    var error = ret_obj['error'];
    var message = ret_obj['message'];
    var member_srl = ret_obj['member_srl'];
    var page = ret_obj['page'];

    alert(message);

    var url = current_url.setQuery('act','dispMemberAdminInfo').setQuery('member_srl',member_srl);
    if(page) url = url.setQuery('page', page);

    location.href = url;
}

/* 사용자 삭제 */
function completeDelete(ret_obj) {
    var error = ret_obj['error'];
    var message = ret_obj['message'];
    var page = ret_obj['page'];

    alert(message);

    var url = current_url.setQuery('act','dispMemberAdminList');

    location.href = url;
}

/* 그룹 추가 */
function completeInsertGroup(ret_obj) {
    var error = ret_obj['error'];
    var message = ret_obj['message'];
    var page = ret_obj['page'];

    alert(message);

    var url = current_url.setQuery('act','dispMemberAdminGroupList');

    location.href = url;
}

/* 그룹 관련 작업들 */
function doUpdateGroup(group_srl, mode, message) {
    if(typeof(message)!='undefined'&&!confirm(message)) return;

    var fo_obj = get_by_id('fo_group_info');
    fo_obj.group_srl.value = group_srl;
	fo_obj.submit();
}

function completeUpdateGroup(ret_obj) {
    var page = ret_obj['page'];
    var url = current_url.setQuery('act','dispMemberAdminGroupList');
    location.href = current_url.setQuery('group_srl','');
}


/* 금지아이디 추가 */
function completeInsertDeniedID(ret_obj) {
    var error = ret_obj['error'];
    var message = ret_obj['message'];
    var page = ret_obj['page'];

    alert(message);

    var url = current_url.setQuery('act','dispMemberAdminDeniedIDList');
    location.href = url;
}

/* 가입폼 관련 작업들 */
function doUpdateJoinForm(member_join_form_srl, mode, message) {
    if(typeof(message)!='undefined'&&!confirm(message)) return;

    var fo_obj = get_by_id('fo_join_form_info');
    fo_obj.member_join_form_srl.value = member_join_form_srl;
    fo_obj.mode.value = mode;

    procFilter(fo_obj, update_member_join_form);
}

function completeUpdateJoinForm(ret_obj) {
    var error = ret_obj['error'];
    var message = ret_obj['message'];
    var page = ret_obj['page'];

    alert(message);

    var url = current_url.setQuery('act','dispMemberAdminJoinFormList');

    location.href = url;
}

/* 가입폼 추가 */
function completeInsertJoinForm(ret_obj) {
    var error = ret_obj['error'];
    var message = ret_obj['message'];
    var page = ret_obj['page'];

    alert(message);

    var url = current_url.setQuery('act','dispMemberAdminJoinFormList');

    location.href = url;
}

/* 가입폼의 기본 값 관리 */
function doShowJoinFormValue(sel_obj) {
    var val = sel_obj.options[sel_obj.selectedIndex].value;
    switch(val) {
        case 'radio' :
        case 'checkbox' :
        case 'select' :
                get_by_id('zone_default_value').style.display = 'block';
            break;
        default :
                get_by_id('zone_default_value').style.display = 'none';
            break;
    }
}

function doEditDefaultValue(obj, cmd) {
    var listup_obj = get_by_id('default_value_listup');
    var item_obj = get_by_id('default_value_item');
    var idx = listup_obj.selectedIndex;
    var lng = listup_obj.options.length;
    var val = item_obj.value;
    switch(cmd) {
        case 'insert' :
                if(!val) return;
                var opt = new Option(val, val, false, true);
                listup_obj.options[listup_obj.length] = opt;
                item_obj.value = '';
                item_obj.focus();
            break;
        case 'up' :
                if(lng < 2 || idx<1) return;

                var value1 = listup_obj.options[idx].value;
                var value2 = listup_obj.options[idx-1].value;
                listup_obj.options[idx] = new Option(value2,value2,false,false);
                listup_obj.options[idx-1] = new Option(value1,value1,false,true);
            break;
        case 'down' :
                if(lng < 2 || idx == lng-1) return;

                var value1 = listup_obj.options[idx].value;
                var value2 = listup_obj.options[idx+1].value;
                listup_obj.options[idx] = new Option(value2,value2,false,false);
                listup_obj.options[idx+1] = new Option(value1,value1,false,true);
            break;
        case 'delete' :
                listup_obj.remove(idx);
                if(idx==0) listup_obj.selectedIndex = 0;
                else listup_obj.selectedIndex = idx-1;
            break;
    }

    var value_list = new Array();
    for(var i=0;i<listup_obj.options.length;i++) {
        value_list[value_list.length] = listup_obj.options[i].value;
    }

    get_by_id('fo_join_form').default_value.value = value_list.join('|@|');
}

/* 한국 우편 번호 관련 */
function doHideKrZipList(column_name) {
    var zone_list_obj = get_by_id('zone_address_list_'+column_name);
    var zone_search_obj = get_by_id('zone_address_search_'+column_name);
    var zone_addr1_obj = get_by_id('zone_address_1_'+column_name);
    var addr1_obj = get_by_id('fo_insert_member')[column_name][0];
    var field_obj = get_by_id('fo_insert_member')['_tmp_address_search_'+column_name];

    zone_addr1_obj.style.display = 'none';
    zone_list_obj.style.display = 'none';
    zone_search_obj.style.display = 'inline';
    addr1_obj.value = '';
    field_obj.focus();
}

function doSelectKrZip(column_name) {
    var zone_list_obj = get_by_id('zone_address_list_'+column_name);
    var zone_search_obj = get_by_id('zone_address_search_'+column_name);
    var zone_addr1_obj = get_by_id('zone_address_1_'+column_name);
    var sel_obj = get_by_id('fo_insert_member')['_tmp_address_list_'+column_name];
    var value = sel_obj.options[sel_obj.selectedIndex].value;
    var addr1_obj = get_by_id('fo_insert_member')[column_name][0];
    var addr2_obj = get_by_id('fo_insert_member')[column_name][1];
    addr1_obj.value = value;
    zone_search_obj.style.display = 'none';
    zone_list_obj.style.display = 'none';
    zone_addr1_obj.style.display = 'inline';
    addr2_obj.focus();
}

function doSearchKrZip(column_name) {
    var field_obj = get_by_id('fo_insert_member')['_tmp_address_search_'+column_name];
    var addr = field_obj.value;
    if(!addr) return;

    var params = new Array();
    params['addr'] = addr;
    params['column_name'] = column_name;

    var response_tags = new Array('error','message','address_list');
    exec_xml('krzip', 'getZipCodeList', params, completeSearchKrZip, response_tags, params);
}

function completeSearchKrZip(ret_obj, response_tags, callback_args) {
    if(!ret_obj['address_list']) {
            alert(alert_msg['address']);
            return;
    }
    var address_list = ret_obj['address_list'].split("\n");
    var column_name = callback_args['column_name'];

    var zone_list_obj = get_by_id('zone_address_list_'+column_name);
    var zone_search_obj = get_by_id('zone_address_search_'+column_name);
    var zone_addr1_obj = get_by_id('zone_address_1_'+column_name);
    var sel_obj = get_by_id('fo_insert_member')['_tmp_address_list_'+column_name];

    for(var i=0;i<address_list.length;i++) {
            var opt = new Option(address_list[i],address_list[i],false,false);
            sel_obj.options[i] = opt;
    }

    for(var i=address_list.length-1;i<sel_obj.options.length;i++) {
            sel_obj.remove(i);
    }

    sel_obj.selectedIndex = 0;

    zone_search_obj.style.display = 'none';
    zone_addr1_obj.style.display = 'none';
    zone_list_obj.style.display = 'inline';
}


/* 프로필 이미지, 이미지 이름, 마크 삭제 */
function doDeleteProfileImage(member_srl) {
	if (!member_srl) return;

	if (!confirm(xe.lang.deleteProfileImage)) return false;

	exec_xml(
		'member',
		'procMemberDeleteProfileImage',
		{member_srl:member_srl},
		function(){jQuery('#profile_imagetag').remove()},
		['error','message','tpl']
	);
}

function doDeleteImageName(member_srl) {
	if (!member_srl) return;

	if (!confirm(xe.lang.deleteImageName)) return false;
	exec_xml(
		'member',
		'procMemberDeleteImageName',
		{member_srl:member_srl},
		function(){jQuery('#image_nametag').remove()},
		['error','message','tpl']
	);
}

function doDeleteImageMark(member_srl) {
	if (!member_srl) return;

	if (!confirm(xe.lang.deleteImageMark)) return false;
	exec_xml(
		'member',
		'procMemberDeleteImageMark',
		{member_srl:member_srl},
		function(){jQuery('#image_marktag').remove()},
		['error','message','tpl']
	);
}



/* 그룹 일괄 변경 */
function doManageMemberGroup() {
    var fo_obj = get_by_id("member_fo");
    var member_srl = new Array();

    if(typeof(fo_obj.cart.length)=='undefined') {
        if(fo_obj.cart.checked) member_srl[member_srl.length] = fo_obj.cart.value;
    } else {
        var length = fo_obj.cart.length;
        for(var i=0;i<length;i++) {
            if(fo_obj.cart[i].checked) member_srl[member_srl.length] = fo_obj.cart[i].value;
        }
    }

    if(member_srl.length<1) return;

    var url = './?module=member&act=dispMemberAdminManageGroup&member_srls='+member_srl.join(',');
    winopen(url, 'manageMemberGroup','scrollbars=no,width=400,height=500,toolbars=no');
}

/* 그룹 일괄 변경 후 */
function completeUpdateMemberGroup(ret_obj) {
    alert(ret_obj['message']);
    opener.location.href = opener.current_url;
    window.close();
}


/* 일괄 삭제 */
function doDeleteMembers() {
    var carts = get_by_id('member_fo').elements['cart'], member_srls = [], i, c, url;

	if(!is_def(carts.length)) carts = [carts];
	for(i=0,c=carts.length; i < c; i++) {
		if(carts[i].checked) member_srls.push(carts[i].value);
	}
	if(member_srls.length < 1) return;

	url = './?module=member&act=dispMemberAdminDeleteMembers&member_srls=' + member_srls.join(',');

    winopen(url, 'deleteMembers','scrollbars=no,width=400,height=500,toolbars=no');
}

/* 일괄 삭제 후 */
function completeDeleteMembers(ret_obj) {
    alert(ret_obj['message']);
    opener.location.href = opener.current_url;
    window.close();
}

jQuery(function($) {
	$("#fo_group_order > table")
		.find("a._up")
			.click(function(e){
				var $tr = $(this).parent().parent();
				var $prev = $tr.prev("tr");
				if($prev.length) 
				{
					$prev.before($tr);
					$tr.parent().find("tr").removeClass("bg1").filter(":odd").addClass("bg1");
				}
				e.preventDefault();
			})
		.end()
		.find("a._down")
			.click(function(){
				var $tr = $(this).parent().parent();
				var $next = $tr.next("tr");
				if($next.length)
				{
					$next.after($tr);
					$tr.parent().find("tr").removeClass("bg1").filter(":odd").addClass("bg1");
				}
				e.preventDefault();
			})
		.end()
			
});
