function insertSelectedModules(id, module_srl, mid, browser_title) {
    var sel_obj = get_by_id('_'+id);
    for(var i=0;i<sel_obj.options.length;i++) if(sel_obj.options[i].value==module_srl) return;
    var opt = new Option(browser_title+' ('+mid+')', module_srl, false, false);
    sel_obj.options[sel_obj.options.length] = opt;
    if(sel_obj.options.length>8) sel_obj.size = sel_obj.options.length;

    doSyncExceptModules(id);
}

function removeExceptModule(id) {
    var sel_obj = get_by_id('_'+id);
    sel_obj.remove(sel_obj.selectedIndex);
    if(sel_obj.options.length) sel_obj.selectedIndex = sel_obj.options.length-1;
    doSyncExceptModules(id);
}

function doSyncExceptModules(id) {
    var selected_module_srls = new Array();
    var sel_obj = get_by_id('_'+id);
    for(var i=0;i<sel_obj.options.length;i++) {
        selected_module_srls.push(sel_obj.options[i].value);
    }
    get_by_id(id).value = selected_module_srls.join(',');
}


function pingCheck(site_url){

	jQuery('p.ping_test_result').html('');
	var response_tags = new Array('error','message','ping_result');
	exec_xml('syndication','procSyndicationAdminCheckPingResult',{'site_url':site_url},function(ret_obj,response_tags){
		var error = ret_obj['error'];
		var message = ret_obj['message'];
		var ping_result = ret_obj['ping_result'];
		if(ping_result) jQuery('p.ping_test_result').text(ping_result);
		alert(message);

	},response_tags);
}

function checkSyndicationStatus(service){

	jQuery('p.print_result_status').html('');
	var response_tags = new Array('error','message','result_status');
	exec_xml('syndication','procSyndicationAdminCheckApiStatus',{target_service:service},function(ret_obj,response_tags){
		var error = ret_obj['error'];
		var message = ret_obj['message'];
		var result = ret_obj['result_status'];

		if(result) jQuery('div.print_result_status').html(result);
		if(error!=0) alert(message);

	},response_tags);
}
