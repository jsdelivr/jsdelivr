function doClearSession() {
	if (!confirm(xe.lang.confirm_run)) return;
    var response_tags = new Array('error','message','result');
    var params = new Array();
    exec_xml('session','procSessionAdminClear', params, completeClearSession, response_tags);
}

function completeClearSession(ret_obj, response_tags) {
    alert(ret_obj['result']);
}
