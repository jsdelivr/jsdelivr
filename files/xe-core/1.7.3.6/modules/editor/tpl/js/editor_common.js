/**
 * 에디터에서 사용하기 위한 변수
 **/
var editorMode = new Array(); ///<< 에디터의 html편집 모드 flag 세팅 변수 (html or null)
var editorAutoSaveObj = {fo_obj:null, editor_sequence:0, title:'', content:'', locked:false} ///< 자동저장을 위한 정보를 가진 object
var editorRelKeys = new Array(); ///< 에디터와 각 모듈과의 연동을 위한 key 값을 보관하는 변수
var editorDragObj = {isDrag:false, y:0, obj:null, id:'', det:0, source_height:0}

function editorGetContent(editor_sequence) {
    // 입력된 내용을 받아옴
    var content = editorRelKeys[editor_sequence]["func"](editor_sequence);

    // 첨부파일 링크시 url을 변경
    var reg_pattern = new RegExp( request_uri.replace(/\//g,'\\/')+"(files|common|modules|layouts|widgets)", 'ig' );
    return content.replace(reg_pattern, "$1");
}

// 에디터에 포커스를 줌
function editorFocus(editor_sequence) {
	try {
		var iframe_obj = editorGetIFrame(editor_sequence);
		if (jQuery.isFunction(iframe_obj.setFocus)) {
			iframe_obj.setFocus();
		} else {
			iframe_obj.contentWindow.focus();
		}
	} catch(e){}
}

/**
 * 자동 저장 기능
 **/
// 자동 저장 활성화 시키는 함수 (50초마다 자동저장)
function editorEnableAutoSave(fo_obj, editor_sequence, callback) {
    var title   = fo_obj.title.value;
    var content = editorRelKeys[editor_sequence]['content'].value;

    editorAutoSaveObj = {"fo_obj":fo_obj, "editor_sequence":editor_sequence, "title":title, "content":content, locked:false};

	clearTimeout(editorEnableAutoSave.timer);
    editorEnableAutoSave.timer = setTimeout(function(){_editorAutoSave(false, callback)}, 50000);
}
editorEnableAutoSave.timer = null;

// ajax를 이용하여 editor.procEditorSaveDoc 호출하여 자동 저장시킴 exe는 강제 코드
function _editorAutoSave(exe, callback) {
    var fo_obj = editorAutoSaveObj.fo_obj;
    var editor_sequence = editorAutoSaveObj.editor_sequence;

    // 50초마다 동기화를 시킴 강제 실행은 제외
    if(!exe) {
		clearTimeout(editorEnableAutoSave.timer);
		editorEnableAutoSave.timer = setTimeout(function(){ _editorAutoSave(exe, callback) }, 50000);
	}

    // 현재 자동저장중이면 중지
    if(editorAutoSaveObj.locked == true) return;

    // 대상이 없으면 자동저장 시키는 기능 자체를 중지
    if(!fo_obj || typeof(fo_obj.title)=='undefined' || !editor_sequence) return;

    // 자동저장을 위한 준비
    var title = fo_obj.title.value;
	var content = '';
	try{
	   content = editorGetContent(editor_sequence);
	}catch(e){
	}

    // 내용이 이전에 저장하였던 것과 다르면 자동 저장을 함 또는 강제 저장 설정시 자동 저장
    if(title != editorAutoSaveObj.title || content != editorAutoSaveObj.content || exe) {
        var params, oDate = new Date();

        params = {
			title   : title,
			content : content,
			mid     : current_mid,
			document_srl : editorRelKeys[editor_sequence]['primary'].value
		};

        editorAutoSaveObj.title   = title;
        editorAutoSaveObj.content = content;

        // 메시지 만들어서 보여줌
        jQuery("#editor_autosaved_message_"+editor_sequence).text(oDate.getHours()+':'+oDate.getMinutes()+' '+auto_saved_msg).show(300);

        // 현재 자동저장중임을 설정
        editorAutoSaveObj.locked = true;

        // 서버 호출 (서버와 교신중이라는 메세지를 보이지 않도록 함)
        show_waiting_message = false;
        exec_xml(
			"editor",
			"procEditorSaveDoc",
			params,
			function() {
				var arg = jQuery.extend({}, params, {auto_saved_msg:auto_saved_msg});
			
				editorAutoSaveObj.locked = false;
				if(jQuery.isFunction(callback)) callback(arg);
			}
		);
        show_waiting_message = true;
    }
}

// 자동저장된 모든 메세지를 삭제하는 루틴
function editorRemoveSavedDoc() {
    var param = new Array();
    param['mid'] = current_mid;
    exec_xml("editor","procEditorRemoveSavedDoc", param);
}

/**
 * 에디터의 상태나 객체를 구하기 위한 함수
 **/

// editor_sequence값에 해당하는 iframe의 object를 return
function editorGetIFrame(editor_sequence) {
    if(editorRelKeys != undefined && editorRelKeys[editor_sequence] != undefined && editorRelKeys[editor_sequence]['editor'] != undefined)
		return editorRelKeys[editor_sequence]['editor'].getFrame(editor_sequence);
    return document.getElementById( 'editor_iframe_'+ editor_sequence );
}
function editorGetTextarea(editor_sequence) {
    return document.getElementById( 'editor_textarea_'+ editor_sequence );
}

// Editor Option Button
function eOptionOver(obj) {
    obj.style.marginTop='-21px';
    obj.style.zIndex='99';
}
function eOptionOut(obj) {
    obj.style.marginTop='0';
    obj.style.zIndex='1';
}
function eOptionClick(obj) {
    obj.style.marginTop='-42px';
    obj.style.zIndex='99';
}

/**
 * 에디터 컴포넌트 구현 부분
 **/

// 에디터 상단의 컴포넌트 버튼 클릭시 action 처리 (마우스다운 이벤트 발생시마다 요청이 됨)
var editorPrevSrl = null;
function editorEventCheck(e) {
    editorPrevNode = null;

    // 이벤트가 발생한 object의 ID를 구함
    var target_id = e.target.id;
    if(!target_id) return;

    // editor_sequence와 component name을 구함 (id가 포맷과 다르면 return)
    var info = target_id.split('_');
    if(info[0]!="component") return;
    var editor_sequence = info[1];
    var component_name = target_id.replace(/^component_[0-9]+_/,'');

    if(!editor_sequence || !component_name) return;
    if(editorMode[editor_sequence]=='html') return;

    switch(component_name) {

        // 기본 기능에 대한 동작 (바로 실행)
        case 'Bold' :
        case 'Italic' :
        case 'Underline' :
        case 'StrikeThrough' :
        case 'undo' :
        case 'redo' :
        case 'JustifyLeft' :
        case 'JustifyCenter' :
        case 'JustifyRight' :
        case 'JustifyFull' :
        case 'Indent' :
        case 'Outdent' :
        case 'InsertOrderedList' :
        case 'InsertUnorderedList' :
        case 'SaveAs' :
        case 'Print' :
        case 'Copy' :
        case 'Cut' :
        case 'Paste' :
        case 'RemoveFormat' :
        case 'Subscript' :
        case 'Superscript' :
            editorDo(component_name, '', editor_sequence);
            break;

        // 추가 컴포넌트의 경우 서버에 요청을 시도
        default :
			openComponent(component_name, editor_sequence);
			return false;
    }

    return;
}
jQuery(document).click(editorEventCheck);

// 컴포넌트 팝업 열기
function openComponent(component_name, editor_sequence, manual_url) {
    editorPrevSrl = editor_sequence;
    if(editorMode[editor_sequence]=='html') return;

    var popup_url = request_uri+"?module=editor&act=dispEditorPopup&editor_sequence="+editor_sequence+"&component="+component_name;
    if(typeof(manual_url)!="undefined" && manual_url) popup_url += "&manual_url="+escape(manual_url);

    popopen(popup_url, 'editorComponent');
}

// 더블클릭 이벤트 발생시에 본문내에 포함된 컴포넌트를 찾는 함수
var editorPrevNode = null;
function editorSearchComponent(evt) {
    var e = new xEvent(evt);

    editorPrevNode = null;
    var obj = e.target;

    // 위젯인지 일단 체크
    if(obj.getAttribute("widget")) {
        // editor_sequence을 찾음
        var tobj = obj;
        while(tobj && tobj.nodeName != "BODY") {
            tobj = xParent(tobj);
        }
        if(!tobj || tobj.nodeName != "BODY" || !tobj.getAttribute("editor_sequence")) {
            editorPrevNode = null;
            return;
        }
        var editor_sequence = tobj.getAttribute("editor_sequence");
        var widget = obj.getAttribute("widget");
        editorPrevNode = obj;

        if(editorMode[editor_sequence]=='html') return;
        popopen(request_uri+"?module=widget&act=dispWidgetGenerateCodeInPage&selected_widget="+widget+"&module_srl="+editor_sequence,'GenerateCodeInPage');
        return;
    }

    // 선택되어진 object부터 상단으로 이동하면서 editor_component attribute가 있는지 검사
    if(!obj.getAttribute("editor_component")) {
        while(obj && !obj.getAttribute("editor_component")) {
            if(obj.parentElement) obj = obj.parentElement;
            else obj = xParent(obj);
        }
    }

    if(!obj) obj = e.target;

    var editor_component = obj.getAttribute("editor_component");

    // editor_component를 찾지 못했을 경우에 이미지/텍스트/링크의 경우 기본 컴포넌트와 연결
    if(!editor_component) {
        // 이미지일 경우
        if(obj.nodeName == "IMG" && !obj.getAttribute("widget")) {
            editor_component = "image_link";
            editorPrevNode = obj;
        }
    } else {
        editorPrevNode = obj;
    }

    // 아무런 editor_component가 없다면 return
    if(!editor_component) {
        editorPrevNode = null;
        return;
    }

    // editor_sequence을 찾음
    var tobj = obj;
    while(tobj && tobj.nodeName != "BODY") {
        tobj = xParent(tobj);
    }
    if(!tobj || tobj.nodeName != "BODY" || !tobj.getAttribute("editor_sequence")) {
        editorPrevNode = null;
        return;
    }
    var editor_sequence = tobj.getAttribute("editor_sequence");

    // 해당 컴포넌트를 찾아서 실행
    openComponent(editor_component, editor_sequence);
}

// 에디터 내의 선택된 부분의 html코드를 변경
function editorReplaceHTML(iframe_obj, html) {
    // 이미지 경로 재지정 (rewrite mod)
    var srcPathRegx = /src=("|\'){1}(\.\/)?(files\/attach|files\/cache|files\/faceOff|files\/member_extra_info|modules|common|widgets|widgetstyle|layouts|addons)\/([^"\']+)\.(jpg|jpeg|png|gif)("|\'){1}/g;
    html = html.replace(srcPathRegx, 'src="'+request_uri+'$3/$4.$5"');

    // href 경로 재지정 (rewrite mod)
    var hrefPathRegx = /href=("|\'){1}(\.\/)?\?([^"\']+)("|\'){1}/g;
    html = html.replace(hrefPathRegx, 'href="'+request_uri+'?$3"');

    // 에디터가 활성화 되어 있는지 확인 후 비활성화시 활성화
    var editor_sequence = iframe_obj.editor_sequence || iframe_obj.contentWindow.document.body.getAttribute("editor_sequence");

    // iframe 에디터에 포커스를 둠
	try { iframe_obj.contentWindow.focus(); }catch(e){};
	
	if (jQuery.isFunction(iframe_obj.replaceHTML)) {
		iframe_obj.replaceHTML(html);
	} else if(xIE4Up) {
        var range = iframe_obj.contentWindow.document.selection.createRange();
        if(range.pasteHTML) {
            range.pasteHTML(html);
        } else if(editorPrevNode) {
            editorPrevNode.outerHTML = html;
        }
    } else {
        try {
            if(iframe_obj.contentWindow.getSelection().focusNode.tagName == "HTML") {
                var range = iframe_obj.contentDocument.createRange();
                range.setStart(iframe_obj.contentDocument.body,0);
                range.setEnd(iframe_obj.contentDocument.body,0);
                range.insertNode(range.createContextualFragment(html));
            } else {
                var range = iframe_obj.contentWindow.getSelection().getRangeAt(0);
                range.deleteContents();
                range.insertNode(range.createContextualFragment(html));
            }
        } catch(e) {
            xInnerHtml(iframe_obj.contentWindow.document.body, html+xInnerHtml(iframe_obj.contentWindow.document.body));
        }
    }
}

// 에디터 내의 선택된 부분의 html 코드를 return
function editorGetSelectedHtml(editor_sequence) {
    var iframe_obj = editorGetIFrame(editor_sequence);
	if (jQuery.isFunction(iframe_obj.getSelectedHTML)) {
		return iframe_obj.getSelectedHTML();
    } else if(xIE4Up) {
        var range = iframe_obj.contentWindow.document.selection.createRange();
        var html = range.htmlText;
        return html;
    } else {
        var range = iframe_obj.contentWindow.getSelection().getRangeAt(0);
        var dummy = xCreateElement('div');
        dummy.appendChild(range.cloneContents());
        var html = xInnerHtml(dummy);
        return html;
    }
}


// {{{ iframe 세로 크기 조절
(function($){

var dragging  = false;
var startY    = 0;
var startH    = 0;
var editorId  = '';
var eventObj  = null; // event target object
var targetObj = null; // elements to be resized

function editorDragStart(e) {
    var obj = $(e.target);
	var id = obj.attr('id');

    if(!id || !/^editor_drag_bar_(.+)$/.test(id)) return;

    dragging  = true;
    startY    = e.pageY;
    eventObj  = obj;
	editorId  = RegExp.$1;

    var iframe_obj   = $( editorGetIFrame(editorId) );
    var textarea_obj = $( editorGetTextarea(editorId) );
    var preview_obj  = $('#editor_preview_'+editorId);
	var visible_obj  = iframe_obj.is(':visible')?iframe_obj:textarea_obj;

	startH = parseInt(visible_obj.css('height'));

	targetObj = $([ iframe_obj[0], textarea_obj[0] ]);
	if (preview_obj.length) targetObj.add(preview_obj[0]);

	if (!isNaN(startH) || !startH) {
		var oh_before = visible_obj[0].offsetHeight;
		visible_obj.css('height', oh_before+'px');
		var oh_after = visible_obj[0].offsetHeight;

		startH = oh_before*2 - oh_after;
		targetObj.css('height', startH+'px');
	}

	$('#xeEditorMask_' + editorId).show();
	$(document).mousemove(editorDragMove);

	return false;
}

function editorDragMove(e) {
    if(!dragging) {
        $('#xeEditorMask_' + editorId).hide();
        return;
    }

    var diff = e.pageY - startY;
	targetObj.css('height', (startH + diff)+'px');

	return false;
}

function editorDragStop(e) {
	$('#xeEditorMask_' + editorId).hide();
    if(!dragging) return;

	$(document).unbind('mousemove', editorDragMove);

	if($.isFunction(window.fixAdminLayoutFooter)) {
		var diff = parseInt(targetObj.eq(0).css('height')) - startH;

		fixAdminLayoutFooter( diff );
	}

    dragging  = false;
    startY    = 0;
    eventObj  = null;
	targetObj = null;
	editorId  = '';

	return false;
}

/*
$(document).bind({
	mousedown : editorDragStart,
	mouseup   : editorDragStop
});
*/

})(jQuery);
// }}} iframe 세로 크기 조절
