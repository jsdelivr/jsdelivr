function completeUpdate(ret_obj) {
    alert(ret_obj['message']);
    location.reload();
}

function doUpdate() {
    var params = new Array();
    exec_xml('autoinstall', 'procAutoinstallAdminUpdateinfo', params, completeUpdate);
}

function doInstallPackage(package_srl) {
    var params = new Array();
    params['package_srl'] = package_srl;
    var e = jQuery("#ftp_password").get(0)
    if(typeof(e) != "undefined")
    {
        params['ftp_password'] = e.value;
    }

    exec_xml('autoinstall', 'procAutoinstallAdminPackageinstall', params, completeInstall);
}

function completeUpdateNoMsg(ret_obj) {
    //location.reload();
	var src = current_url.setQuery('act', 'dispAutoinstallAdminIndex');
	location.href = src;
}

function completeInstall(ret_obj) {
    alert(ret_obj['message']);
    if(ret_obj['error'] != 0) return;
    var params = new Array();
    exec_xml('autoinstall', 'procAutoinstallAdminUpdateinfo', params, completeUpdateNoMsg);
}

function completeUninstall(ret_obj) {
    alert(ret_obj['message']);
    if(ret_obj['error'] != 0) return;
    var params = new Array();
    exec_xml('autoinstall', 'procAutoinstallAdminUpdateinfo', params, completeUpdateNoMsg);
}


