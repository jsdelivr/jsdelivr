var uploadedFiles = new Array();
var orderedFiles  = new Array();
var uploaderSettings = new Array();
var loaded_images  = new Array();
var swfUploadObjs  = new Array();
var reloadCallback = new Array();

/**
 * 업로드를 하기 위한 준비 시작
 * 이 함수는 editor.html 에서 파일 업로드 가능할 경우 호출됨
 **/
// window.load 이벤트일 경우 && 문서 번호가 가상의 번호가 아니면 기존에 저장되어 있을지도 모르는 파일 목록을 가져옴
function editorUploadInit(obj) {
    if(typeof(obj["editorSequence"])=="undefined") return;
    if(typeof(obj["sessionName"])=="undefined") obj["sessionName"]= "PHPSESSID";
    if(typeof(obj["allowedFileSize"])=="undefined") obj["allowedFileSize"]= 2*1024*1024;
    if(typeof(obj["allowedFileTypes"])=="undefined") obj["allowedFileTypes"]= "*.*";
    if(typeof(obj["allowedFileTypesDescription"])=="undefined") obj["allowedFileTypesDescription"]= "All Files";
    if(typeof(obj["replaceButtonID"])=="undefined") obj["replaceButtonID"] = "swfUploadButton"+obj["editorSequence"];
    if(typeof(obj["insertFiles"])=="undefined") obj["insertFiles"] = 0;
   // xAddEventListener(window,'load', function() {XEUploaderStart(obj); } );
    XEUploaderStart(obj); 

}

// 파일 업로드를 위한 기본 준비
function XEUploaderStart(obj) {
	try { document.execCommand('BackgroundImageCache',false,true); } catch(e) { };

	var oBtn  = jQuery('#'+obj['replaceButtonID']);
    var btnWidth = 500;
    var btnHeight = 40;
    oBtn.css('position','relative');

    var dummy = xCreateElement("span");
    dummy.id = "dummy"+obj["replaceButtonID"];
    oBtn.get(0).appendChild(dummy);

	var settings = {
		flash_url : request_uri+"modules/editor/tpl/images/SWFUpload.swf",
		upload_url: request_uri,
		post_params: {
			"mid" : current_mid,
			"act" : "procFileUpload",
			"editor_sequence" : obj["editorSequence"]
		},
		file_size_limit : parseInt(parseInt(obj["allowedFileSize"],10)/1024,10),
		file_queue_limit : 0,
		file_upload_limit : 0,
		file_types : obj["allowedFileTypes"],
		file_types_description : obj["allowedFileTypesDescription"],
		custom_settings : {
			progressTarget : null,
			cancelButtonId : null
		},
		debug: false,

		// Button settings
		button_window_mode: 'transparent',
		button_placeholder_id: dummy.id,
		button_text: null,
		button_image_url: "",
		button_width: btnWidth,
		button_height: btnHeight,
		button_text_style: null,
		button_text_left_padding: 0,
		button_text_top_padding: 0,

		// The event handler functions are defined in handlers.js
		file_queued_handler : fileQueued,
		file_queue_error_handler : fileQueueError,
		file_dialog_complete_handler : fileDialogComplete,
		upload_start_handler : uploadStart,
		upload_progress_handler : uploadProgress,
		upload_error_handler : uploadError,
		upload_success_handler : uploadSuccess,
		upload_complete_handler : uploadComplete,
		queue_complete_handler :queueComplete
	};
	
	if(typeof(xeVid)!='undefined') settings["post_params"]["vid"] = xeVid;
	settings["post_params"][obj["sessionName"]] = xGetCookie(obj["sessionName"]);
	settings["editorSequence"] = obj["editorSequence"];
	settings["uploadTargetSrl"] = editorRelKeys[obj["editorSequence"]]["primary"].value;
	for(var x in obj) {
		if (typeof settings[x] != 'undefined') settings[x] = obj[x];
	}
	
	uploaderSettings[obj["editorSequence"]] = settings;
	
	var swfu   = new SWFUpload(settings);
	var swfObj = jQuery('#'+swfu.movieName);
	swfUploadObjs[obj["editorSequence"]] = swfu.movieName;
	if(!swfObj) return;
	
	jQuery(swfObj).css({
		display  : 'block',
		cursor   : 'pointer',
		position : 'absolute',
		left	 : 0,
		width    : btnWidth,
		height   : btnHeight,
		top	     : '-3px'
	});
}

function fileQueued(){
}

function fileQueueError(file, errorCode, message) {
	try {
		switch(errorCode) {
			case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED :
				alert("You have attempted to queue too many files.\n" + (message === 0 ? "You have reached the upload limit." : "You may select " + (message > 1 ? "up to " + message + " files." : "one file.")));
				break;
			case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
				alert("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
				break;
			case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
				alert("Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
				break;
			case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
				alert("Error Code: Invalid File Type, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
				break;
			default:
				alert("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
				break;
		}
	} catch(ex) {
		this.debug(ex);
	}
}

function fileDialogComplete(numFilesSelected, numFilesQueued) {
	try {
		this.startUpload();
	} catch (ex)  {
		this.debug(ex);
	}
}

function uploadStart(file) {
	return true;
}

function uploadProgress(file, bytesLoaded, bytesTotal) {
	try {
		/*
		var obj = xGetElementById(this.settings["fileListAreaID"]);

		var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);
		var filename = file.name;
		if(filename.length>20) filename = filename.substr(0,20)+'...';

		var text = filename + ' ('+percent+'%)';
		if(!obj.options.length || obj.options[obj.options.length-1].value != file.id) {
			var opt_obj = new Option(text, file.id, true, true);
			obj.options[obj.options.length] = opt_obj;
		} else {
			obj.options[obj.options.length-1].text = text;
		}
		*/
	} catch (ex)  {
		this.debug(ex);
	}
}

function uploadSuccess(file, serverData) {
	try {
		if(this.getStats().files_queued !== 0) this.startUpload();
	} catch (ex)  {
		this.debug(ex);
	}
}

function uploadError(file, errorCode, message) {
	try {
		switch (errorCode) {
		case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
			alert("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
			alert("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.IO_ERROR:
			alert("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
			alert("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
			alert("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
			alert("Error Code: File Validation Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
			// If there aren't any files left (they were all cancelled) disable the cancel button
			if (this.getStats().files_queued === 0) {
				jQuery('#'+this.customSettings.cancelButtonId).attr('disabled', true);
			}
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
			break;
		default:
			alert("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		}
	} catch (ex) {
		this.debug(ex);
	}
}

function uploadComplete(file) {
	try {
		reloadFileList(this.settings);
	} catch(e) {
		this.debug(ex);
	}
}

function queueComplete(numFilesUploaded) {
}

function reloadFileList(settings) {
    var params = new Array();
    params["file_list_area_id"] = settings["fileListAreaID"];
    params["editor_sequence"] = settings["editorSequence"];
    params["upload_target_srl"] = settings["uploadTargetSrl"];
    params["mid"] = current_mid;
    var response_tags = new Array("error","message","files","upload_status","upload_target_srl","editor_sequence","left_size");
    exec_xml("file","getFileList", params, completeReloadFileList, response_tags, settings);
}

function completeReloadFileList(ret_obj, response_tags, settings) {
	var upload_status   = ret_obj['upload_status'];
	var editor_sequence = ret_obj['editor_sequence'];
	var upload_target_srl= ret_obj['upload_target_srl'];
	var files = ret_obj['files'];
	var left_size = parseInt(parseInt(ret_obj["left_size"],10)/1024,10);
	
	if(!files || typeof(files['item'])=='undefined') return;
	if (!jQuery.isArray(files['item'])) files['item'] = [ files['item'] ];
	
	orderedFiles = files['item'];

	jQuery.each(files['item'], function(){
		var file_srl = this.file_srl;
		uploadedFiles[file_srl] = this;
	});
	if (jQuery.isFunction(reloadCallback[editor_sequence])) {
		reloadCallback[editor_sequence](upload_target_srl);
	}
}
