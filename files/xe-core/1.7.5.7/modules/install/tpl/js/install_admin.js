/**
 * @brief DB정보 Setting후 실행될 함수
 */
function completeAgreement(ret_obj)
{
    if(ret_obj['error'] != 0) {
        alert(ret_obj['message']);
        return;
    } else {
		var url = current_url.setQuery('act', 'dispInstallCheckEnv');
		location.href = url;
	}
}

function completeDBSetting(ret_obj) {
    if(ret_obj['error'] != 0) {
        alert(ret_obj['message']);
        return;
    } else {
    	location.href = "./index.php?act=dispInstallConfigForm";
	}
}

/**
 * @brief Rewrite module, Time-zone Setting 후 실행될 함수
 */
function completeConfigSetting(ret_obj) {
    if(ret_obj['error'] != 0) {
        alert(ret_obj['message']);
        return;
    } else {
    	location.href = "./index.php?act=dispInstallManagerForm";
	}
}

/**
 * @brief 설치 완료후 실행될 함수
 */
function completeInstalled(ret_obj) {
    alert(ret_obj["message"]);
    location.href = "./index.php";
}

/**
 * @brief FTP 정보 입력
 **/
function doInstallFTPInfo(form) {
    var params={}, data=jQuery(form).serializeArray();
    jQuery.each(data, function(i, field){ params[field.name] = field.value });
    exec_xml('install', 'procInstallFTP', params, completeInstallFTPInfo, ['error', 'message'], params, form);
    return false;
}

function completeInstallFTPInfo(ret_obj) {
    location.href = current_url;
}

function doCheckFTPInfo() {
    var form = jQuery("#ftp_form").get(0);
    var params={}, data=jQuery(form).serializeArray();
    jQuery.each(data, function(i, field){ params[field.name] = field.value });

    exec_xml('install', 'procInstallCheckFTP', params, completeInstallCheckFtpInfo, ['error', 'message'], params, form);
    return false;
}

function completeInstallCheckFtpInfo(ret_obj) {
    alert(ret_obj['message']);
}

function completeFtpPath(ret_obj){
   location.reload(); 
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
        if(!form.ftp_root_path.value)
        {
            if(typeof(form.sftp) != 'undefined' && form.sftp.checked) {
                form.ftp_root_path.value = xe_root;
            }
            else
            {
                form.ftp_root_path.value = "/";
            }
        }
    }
    var params={}, data=jQuery("#ftp_form").serializeArray();
    jQuery.each(data, function(i, field){ params[field.name] = field.value });
    exec_xml('install', 'getInstallFTPList', params, completeGetFtpInfo, ['list', 'error', 'message'], params, form);
}

function completeGetFtpInfo(ret_obj)
{
    if(ret_obj['error'] != 0)
    {
        alert(ret_obj['error']);
        alert(ret_obj['message']);
        return;
    }
    var e = jQuery("#ftplist").empty();
    var list = "";
    if(!jQuery.isArray(ret_obj['list']['item']))
    {
        ret_obj['list']['item'] = [ret_obj['list']['item']];
    }

    pwd = jQuery("#ftp_form").get(0).ftp_root_path.value;
    if(pwd != "/")
    {
        arr = pwd.split("/");
        arr.pop();
        arr.pop();
        arr.push("");
        target = arr.join("/");
        list = list + "<li><a href='#ftpSetup' onclick=\"getFTPList('"+target+"')\">../</a></li>";
    }
    
    for(var i=0;i<ret_obj['list']['item'].length;i++)
    {   
        var v = ret_obj['list']['item'][i];
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
            list = list + "<li><a href='#ftpSetup' onclick=\"getFTPList('"+pwd+v+"')\">"+v+"</a></li>";
        }
    }

    //list = "<td><ul>"+list+"</ul></td>";
    e.append(jQuery(list));
}
