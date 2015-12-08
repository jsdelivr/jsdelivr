jQuery(function($){
	$('.tgContent ul').bind('click', function(){
		$('#sitefind_addBtn').css('display','');
	});
});

function setStartModule(){
	var target_module = jQuery('.moduleIdList option:selected').text();
	var index_module_srl = jQuery('.moduleIdList').val();
	jQuery('#_target_module').val(target_module);
	jQuery('#index_module_srl').val(index_module_srl);
	jQuery('.moduleList,.moduleIdList, .site_keyword_search, #sitefind_addBtn').css('display','none');
}

function viewSiteSearch(){
	jQuery(".site_keyword_search").css("display","");
}

function getFTPList(pwd)
{
	var form = jQuery("#ftp_form").get(0);
	if(typeof(pwd) != 'undefined')
	{
		form.ftp_root_path.value = pwd;
	}
	else
	{
		if(!form.ftp_root_path.value && typeof(form.sftp) != 'undefined' && form.sftp.checked)
		{
			form.ftp_root_path.value = xe_root;
		}
		else
		{
			form.ftp_root_path.value = "/";
		}
	}

	var params = [];
	//ftp_pasv not used
	params.ftp_user = jQuery("#ftp_user").val();
	params.ftp_password =jQuery("#ftp_password").val();
	params.ftp_host = jQuery("#ftp_host").val();
	params.ftp_port = jQuery("#ftp_port").val();
	params.ftp_root_path = jQuery("#ftp_root_path").val();
	params.sftp = jQuery("input[name=sftp]:checked").val();

	exec_xml('admin', 'getAdminFTPList', params, completeGetFtpInfo, ['list', 'error', 'message'], params, form);
}

function removeFTPInfo()
{
	var params = {};
	exec_xml('install', 'procInstallAdminRemoveFTPInfo', params, filterAlertMessage, ['error', 'message'], params);
}

function completeGetFtpInfo(ret_obj)
{
	if(ret_obj.error !== 0)
	{
		alert(ret_obj.error);
		alert(ret_obj.message);
		return;
	}
	var e = jQuery("#ftpSuggestion").empty();

	var list = "";
	if(!jQuery.isArray(ret_obj.list.item))
	{
		ret_obj.list.item = [ret_obj.list.item];
	}

	pwd = jQuery("#ftp_form").get(0).ftp_root_path.value;
	if(pwd != "/")
	{
		arr = pwd.split("/");
		arr.pop();
		arr.pop();
		arr.push("");
		target = arr.join("/");
		list = list + "<li><button type='button' onclick=\"getFTPList('"+target+"')\">../</button></li>";
	}

	for(var i=0;i<ret_obj.list.item.length;i++)
	{
		var v = ret_obj.list.item[i];
		if(v == "../")
		{
			continue;
		}
		else if( v == "./")
		{
			continue;
		}
		else
		{
			list = list + "<li><button type='button' onclick=\"getFTPList('"+pwd+v+"')\">"+v+"</button></li>";
		}
	}
	list = "<ul>"+list+"</ul>";
	e.append(jQuery(list));
}

var icon = null;
function deleteIcon(iconname){
	var params = [];
	params.iconname = iconname;
	exec_xml('admin', 'procAdminRemoveIcons', params, iconDeleteMessage, ['error', 'message'], params);
	icon = iconname;
}
function iconDeleteMessage(ret_obj){
	alert(ret_obj.message);

	if (ret_obj.error == '0')
	{
		if (icon == 'favicon.ico'){
			jQuery('.faviconPreview img').attr('src', 'modules/admin/tpl/img/faviconSample.png');
		}else if (icon == 'mobicon.png'){
			jQuery('.mobiconPreview img').attr('src', 'modules/admin/tpl/img/mobiconSample.png');
		}
	}
}
function doRecompileCacheFile() {
	if (!confirm(xe.lang.confirm_run)) return;
	var params = [];
	exec_xml("admin","procAdminRecompileCacheFile", params, completeCacheMessage);
}
function completeCacheMessage(ret_obj) {
	alert(ret_obj.message);
}

function doResetAdminMenu() {
	if (!confirm(xe.lang.confirm_reset_admin_menu)) return;
	var params = [];
	params.menu_srl = admin_menu_srl;
	exec_xml("admin","procAdminMenuReset", params, completeResetAdminMenu);
}
function completeResetAdminMenu(ret_obj) {
	document.location.reload();
}

