/**
 * @author NAVER (developers@xpressengine.com)
 * @version 0.1
 * @brief 에디터 관련 스크립트
 */

/**
 * 에디터 사용시 사용되는 이벤트 연결 함수 호출
 **/

/**
 * 에디터의 상태나 객체를 구하기 위한 함수
 **/

// editor_sequence값에 해당하는 textarea object를 return
function editorGetTextArea(editor_sequence) {
	return jQuery('#editor_textarea_' + editor_sequence)[0];
}

function editorGetPreviewArea(editor_sequence) {
	return jQuery( '#editor_preview_' + editor_sequence )[0];
}

// editor_sequence에 해당하는 form문 구함
function editorGetForm(editor_sequence) {
	var iframe_obj = editorGetIFrame(editor_sequence);
	if(!iframe_obj) return;

	var fo_obj = iframe_obj.parentNode;
	while(fo_obj.nodeName != 'FORM') { fo_obj = fo_obj.parentNode; }
	if(fo_obj.nodeName == 'FORM') return fo_obj;
	return;
}

// 에디터의 전체 내용 return
function editorGetContent_xe(editor_sequence) {
	var html = "";
	if(editorMode[editor_sequence]=='html') {
		var textarea_obj = editorGetTextArea(editor_sequence);
		if(!textarea_obj) return "";
		html = textarea_obj.value;
	} else {
		var iframe_obj = editorGetIFrame(editor_sequence);
		if(!iframe_obj) return "";
		html = jQuery(iframe_obj.contentWindow.document.body).html().replace(/^<br([^>]*)>$/i,'');
	}
	return html;
}

// 에디터 내의 선택된 부분의 NODE를 return
function editorGetSelectedNode(editor_sequence) {
	var iframe_obj = editorGetIFrame(editor_sequence), w, range;

	w = iframe_obj.contentWindow;

	if(w.document.selection) {
		range = w.document.selection.createRange();
		return jQuery('<div />').html(range.htmlText)[0].firstChild;
	} else {
		range = w.getSelection().getRangeAt(0);
		return jQuery('<div />').append(range.cloneContents())[0].firstChild;
	}
}

/**
 * editor 시작 (editor_sequence로 iframe객체를 얻어서 쓰기 모드로 전환)
 **/
var _editorFontColor = [];
function editorStart(editor_sequence, primary_key, content_key, editor_height, font_color) {

	if(typeof(font_color)=='undefined') font_color = '#000';
	_editorFontColor[editor_sequence] = font_color;

	// iframe obj를 찾음
	var iframe_obj = editorGetIFrame(editor_sequence);
	if(!iframe_obj) return;
	jQuery(iframe_obj).css('width', '100%').parent().css('width', '100%');

	// 현 에디터를 감싸고 있는 form문을 찾음
	var fo_obj = editorGetForm(editor_sequence);
	if(!fo_obj) return;

	// fo_obj에 editor_sequence 값 지정
	fo_obj.setAttribute('editor_sequence', editor_sequence);

	// 모듈 연관 키 값을 세팅
	editorRelKeys[editor_sequence] = [];
	editorRelKeys[editor_sequence].primary = fo_obj[primary_key];
	editorRelKeys[editor_sequence].content = fo_obj[content_key];
	editorRelKeys[editor_sequence].func = editorGetContent_xe;

	// saved document(자동저장 문서)에 대한 확인
	if(typeof(fo_obj._saved_doc_title)!= "undefined") { ///<< _saved_doc_title field가 없으면 자동저장 하지 않음
		var saved_title = fo_obj._saved_doc_title.value;
		var saved_content = fo_obj._saved_doc_content.value;

		if(saved_title || saved_content) {
			// 자동저장된 문서 활용여부를 물은 후 사용하지 않는다면 자동저장된 문서 삭제
			if(confirm(fo_obj._saved_doc_message.value)) {
				if(typeof(fo_obj.title)!='undefined') fo_obj.title.value = saved_title;
				editorRelKeys[editor_sequence].content.value = saved_content;

				var param = [];
				param.editor_sequence = editor_sequence;
				param.primary_key = primary_key;
				param.mid = current_mid;
				var response_tags = new Array("error","message","editor_sequence","key","title","content","document_srl");
				exec_xml('editor',"procEditorLoadSavedDocument", param, getAutoSavedSrl, response_tags);
			} else {
				editorRemoveSavedDoc();
			}
		}
	}

	// 대상 form의 content element에서 데이터를 구함
	var content = editorRelKeys[editor_sequence].content.value;

	// IE가 아니고 내용이 없으면 <br /> 추가 (FF등에서 iframe 선택시 focus를 주기 위한 꽁수)
	if(!content && !xIE4Up) content = "<br />";

	// IE일 경우 ctrl-Enter 안내 문구를 노출
	var ieHelpObj = xGetElementById("for_ie_help_"+editor_sequence);
	if(xIE4Up && ieHelpObj) {
		ieHelpObj.style.display = "block";
	}

	// content 생성
	editor_path = editor_path.replace(/^\.\//ig, '');
	var contentHtml = ''+
		'<!DOCTYPE html>'+
		'<html><head><meta charset="utf-8"/>'+
		'<style>'+
		'body{font-size:.75em;line-height:1.6;font-family:Sans-serif;height:'+editor_height+'px;padding:0;margin:0;background-color:transparent;color:'+font_color+';}'+
		'</style>'+
		'</head><body editor_sequence="'+editor_sequence+'">'+
		content+
		'</body></html>'+
		'';
	iframe_obj.contentWindow.document.open("text/html","replace");
	iframe_obj.contentWindow.document.write(contentHtml);
	iframe_obj.contentWindow.document.close();

	// editorMode를 기본으로 설정
	editorMode[editor_sequence] = null;

	// 에디터를 시작 시킴
	try {
		iframe_obj.contentWindow.document.designMode = 'On';
	} catch(e) {
	}

	try {
		iframe_obj.contentWindow.document.execCommand("undo", false, null);
		iframe_obj.contentWindow.document.execCommand("useCSS", false, true);
	}  catch (e) {
	}

	/**
	 * 더블클릭이나 키눌림등의 각종 이벤트에 대해 listener 추가
	 * 작성시 필요한 이벤트 체크
	 * 이 이벤트의 경우 윈도우 sp1 (NT or xp sp1) 에서 iframe_obj.contentWindow.document에 대한 권한이 없기에 try 문으로 감싸서
	 * 에러를 무시하도록 해야 함.
	 **/

	// 위젯 감시를 위한 더블클릭 이벤트 걸기
	try {
		jQuery(iframe_obj.contentWindow.document)
			.unbind('dblclick.widget')
			.bind('dblclick.widget', editorSearchComponent);
	} catch(e) {
	}

	// 에디터에서 키가 눌러질때마다 이벤트를 체크함 (enter키의 처리나 FF에서 alt-s등을 처리)
	try {
		if(xIE4Up) xAddEventListener(iframe_obj.contentWindow.document, 'keydown',editorKeyPress);
		else xAddEventListener(iframe_obj.contentWindow.document, 'keypress',editorKeyPress);
	} catch(e) {
	}

	// 자동저장 필드가 있다면 자동 저장 기능 활성화
	if(typeof(fo_obj._saved_doc_title)!="undefined" ) editorEnableAutoSave(fo_obj, editor_sequence);


	// 좋지는 않으나;; 스타일 변형을 막기 위해 start 할때 html이면 바꿔주자
	if (xGetCookie('editor_mode') == 'html'){
		iframe_obj = editorGetIFrame(editor_sequence);
		if(xGetElementById('fileUploader_'+editor_sequence)) xGetElementById('fileUploader_'+editor_sequence).style.display='block';

		textarea_obj = editorGetTextArea(editor_sequence);
		textarea_obj.value = content;
		xWidth(textarea_obj, xWidth(iframe_obj.parentNode));
		xHeight(textarea_obj, xHeight(iframe_obj.parentNode));
		editorMode[editor_sequence] = 'html';

		if(xGetElementById('xeEditor_'+editor_sequence)) {
			xGetElementById('xeEditor_'+editor_sequence).className = 'xeEditor html';
			xGetElementById('use_rich_'+editor_sequence).className = '';
			xGetElementById('preview_html_'+editor_sequence).className = '';
			xGetElementById('use_html_'+editor_sequence).className = 'active';
		}
	}
}


/**
 * 에디터의 세부 설정과 데이터 핸들링을 정의한 함수들
 **/



/**
 * 키 또는 마우스 이벤트 핸들링 정의 함수
 **/

// 입력 키에 대한 이벤트 체크
function editorKeyPress(evt) {
	var e = new xEvent(evt);

	// 대상을 구함
	var obj = e.target;
	var body_obj = null;
	if(obj.nodeName == "BODY") body_obj = obj;
	else body_obj = obj.firstChild.nextSibling;

	if(!body_obj) return;

	// editor_sequence는 에디터의 body에 attribute로 정의되어 있음
	var editor_sequence = body_obj.getAttribute("editor_sequence");
	if(!editor_sequence) return;

	// IE에서 enter키를 눌렀을때 P 태그 대신 BR 태그 입력
	if (xIE4Up && !e.ctrlKey && !e.shiftKey && e.keyCode == 13 && !editorMode[editor_sequence]) {
		var iframe_obj = editorGetIFrame(editor_sequence);
		if(!iframe_obj) return;

		obj = contentDocument.selection.createRange();
		var contentDocument = iframe_obj.contentWindow.document;
		var pTag = obj.parentElement().tagName.toLowerCase();

		switch(pTag) {
			case 'li' :
				return;
			default :
				obj.pasteHTML("<br />");
				break;
		}
		obj.select();
		evt.cancelBubble = true;
		evt.returnValue = false;

		return;
	}

	// ctrl-S, alt-S 클릭시 submit하기
	if( e.keyCode == 115 && (e.altKey || e.ctrlKey) ) {
		// iframe 에디터를 찾음
		if(!editorGetIFrame(editor_sequence)) return;

		// 대상 form을 찾음
		var fo_obj = editorGetForm(editor_sequence);
		if(!fo_obj) return;

		// 데이터 동기화
		editorRelKeys[editor_sequence].content.value = editorGetContent(editor_sequence);

		// form문 전송
		if(fo_obj.onsubmit) fo_obj.onsubmit();

		// 이벤트 중단
		evt.cancelBubble = true;
		evt.returnValue = false;
		xPreventDefault(evt);
		xStopPropagation(evt);
		return;
	}

	// ctrl-b, i, u, s 키에 대한 처리 (파이어폭스에서도 에디터 상태에서 단축키 쓰도록)
	if (e.ctrlKey) {
		// iframe 에디터를 찾음
		if(!editorGetIFrame(editor_sequence)) return;

		// html 에디터 모드일 경우 이벤트 취소 시킴
		if(editorMode[editor_sequence]) {
			evt.cancelBubble = true;
			evt.returnValue = false;
			xPreventDefault(evt);
			xStopPropagation(evt);

			return;
		}

		switch(e.keyCode) {
			// ctrl+1~6
			case 49 :
			case 50 :
			case 51 :
			case 52 :
			case 53 :
			case 54 :
					editorDo('formatblock',"<H"+(e.keyCode-48)+">",e.target);
					xPreventDefault(evt);
					xStopPropagation(evt);
				break;
			// ctrl+7
			case 55 :
					editorDo('formatblock',"<P>",e.target);
					xPreventDefault(evt);
					xStopPropagation(evt);
				break;
			// ie에서 ctrlKey + enter일 경우 P 태그 입력
			case 13 :
					if(xIE4Up) {
						if(e.target.parentElement.document.designMode!="On") return;

						obj = e.target.parentElement.document.selection.createRange();
						obj.pasteHTML('<P>');
						obj.select();
						evt.cancelBubble = true;
						evt.returnValue = false;

						return;
					}
					break;
			// bold
			case 98 :
					editorDo('Bold',null,e.target);
					xPreventDefault(evt);
					xStopPropagation(evt);
				break;
			// italic
			case 105 :
					editorDo('Italic',null,e.target);
					xPreventDefault(evt);
					xStopPropagation(evt);
				break;
			// underline
			case 117 :
					editorDo('Underline',null,e.target);
					xPreventDefault(evt);
					xStopPropagation(evt);
				break;
			//RemoveFormat
			case 100 :
					editorDo('RemoveFormat',null,e.target);
					xPreventDefault(evt);
					xStopPropagation(evt);
				break;


			// strike
			/*
			case 83 :
			case 115 :
					editorDo('StrikeThrough',null,e.target);
					xPreventDefault(evt);
					xStopPropagation(evt);
				break;
			*/
		}
	}
}

// 편집 기능 실행
function editorDo(command, value, target) {

	var doc = null;

	// target이 object인지 editor_sequence인지에 따라 document를 구함
	if(typeof(target)=="object") {
		if(xIE4Up) doc = target.parentElement.document;
		else doc = target.parentNode;
	} else {
		var iframe_obj = editorGetIFrame(target);
		doc = iframe_obj.contentWindow.document;
	}

	var editor_sequence = doc.body.getAttribute('editor_sequence');
	if(editorMode[editor_sequence]) return;

	// 포커스
	if(typeof(target)=="object") target.focus();
	else editorFocus(target);

	// 실행
	doc.execCommand(command, false, value);

	// 포커스
	if(typeof(target)=="object") target.focus();
	else editorFocus(target);
}

// 폰트를 변경
function editorChangeFontName(obj,srl) {
	var value = obj.options[obj.selectedIndex].value;
	if(!value) return;
	editorDo('FontName',value,srl);
	obj.selectedIndex = 0;
}

function editorChangeFontSize(obj,srl) {
	var value = obj.options[obj.selectedIndex].value;
	if(!value) return;
	editorDo('FontSize',value,srl);
	obj.selectedIndex = 0;
}

function editorUnDo(obj,srl) {
	editorDo('undo','',srl);
	obj.selectedIndex = 0;
}

function editorReDo(obj,srl) {
	editorDo('redo','',srl);
	obj.selectedIndex = 0;
}

function editorChangeHeader(obj,srl) {
	var value = obj.options[obj.selectedIndex].value;
	if(!value) return;
	value = "<"+value+">";
	editorDo('formatblock',value,srl);
	obj.selectedIndex = 0;
}

/**
 * HTML 편집 기능 활성/비활성
 **/

function editorChangeMode(mode, editor_sequence) {
	/* jshint -W041 */
	if(mode == 'html' || mode == ''){
		var expire = new Date();
		expire.setTime(expire.getTime()+ (7000 * 24 * 3600000));
		xSetCookie('editor_mode', mode, expire);
	}

	var iframe_obj = editorGetIFrame(editor_sequence);
	if(!iframe_obj) return;

	var textarea_obj = editorGetTextArea(editor_sequence);
	var preview_obj = editorGetPreviewArea(editor_sequence);
	var contentDocument = iframe_obj.contentWindow.document;

	var html = null;
	if(editorMode[editor_sequence]=='html') {
		html = textarea_obj.value;
		contentDocument.body.innerHTML = textarea_obj.value;
	} else if (editorMode[editor_sequence]=='preview') {
//        html = xInnerHtml(preview_obj);
		html = textarea_obj.value;
		preview_obj.contentWindow.document.body.innerHTML = '';
//        xAddEventListener(xGetElementById('editor_preview_'+editor_sequence), 'load', function(){setPreviewHeight(editor_sequence)});
	} else {
		html = contentDocument.body.innerHTML;
		textarea_obj.value = html;
		html = html.replace(/<br>/ig,"<br />\n");
		html = html.replace(/<br \/>\n\n/ig,"<br />\n");
	}

	// html 편집 사용시
	if(mode == 'html' && textarea_obj) {
		preview_obj.style.display='none';
		if(xGetElementById('fileUploader_'+editor_sequence)) xGetElementById('fileUploader_'+editor_sequence).style.display='block';
		textarea_obj.value = html;
		xWidth(textarea_obj, xWidth(iframe_obj.parentNode));
		xHeight(textarea_obj, xHeight(iframe_obj.parentNode));
		editorMode[editor_sequence] = 'html';

		if(xGetElementById('xeEditor_'+editor_sequence)) {
			xGetElementById('xeEditor_'+editor_sequence).className = 'xeEditor html';
			xGetElementById('use_rich_'+editor_sequence).className = '';
			xGetElementById('preview_html_'+editor_sequence).className = '';
			xGetElementById('use_html_'+editor_sequence).className = 'active';
		}
	// 미리보기
	} else if(mode == 'preview' && preview_obj) {
		preview_obj.style.display='';
		if(xGetElementById('fileUploader_'+editor_sequence)) xGetElementById('fileUploader_'+editor_sequence).style.display='none';

		var fo_obj = xGetElementById("preview_form");
		if(!fo_obj) {
			fo_obj = xCreateElement('form');
			fo_obj.id = "preview_form";
			fo_obj.method = "post";
			fo_obj.action = request_uri;
			fo_obj.target = "editor_preview_"+editor_sequence;
			xInnerHtml(fo_obj,'<input type="hidden" name="module" value="editor" /><input type="hidden" name="editor_sequence" value="'+editor_sequence+'" /><input type="hidden" name="act" value="dispEditorPreview" /><input type="hidden" name="content" />');
			document.body.appendChild(fo_obj);
		}
		fo_obj.content.value = html;
		fo_obj.submit();

		xWidth(preview_obj, xWidth(iframe_obj.parentNode));
		editorMode[editor_sequence] = 'preview';

		if(xGetElementById('xeEditor_'+editor_sequence)) {
			xGetElementById('xeEditor_'+editor_sequence).className = 'xeEditor preview';
			xGetElementById('use_rich_'+editor_sequence).className = '';
			xGetElementById('preview_html_'+editor_sequence).className = 'active';
			if(xGetElementById('use_html_'+editor_sequence)) xGetElementById('use_html_'+editor_sequence).className = '';
		}
	// 위지윅 모드 사용시
	} else {
		preview_obj.style.display='none';
		if(xGetElementById('fileUploader_'+editor_sequence)) xGetElementById('fileUploader_'+editor_sequence).style.display='block';
		contentDocument.body.innerHTML = html;
		editorMode[editor_sequence] = null;

		if(xGetElementById('xeEditor_'+editor_sequence)) {
			xGetElementById('xeEditor_'+editor_sequence).className = 'xeEditor rich';
			xGetElementById('use_rich_'+editor_sequence).className = 'active';
			xGetElementById('preview_html_'+editor_sequence).className = '';
			if(xGetElementById('use_html_'+editor_sequence)) xGetElementById('use_html_'+editor_sequence).className = '';
		}
	}

}

// Editor Info Close
function closeEditorInfo(editor_sequence) {
	xGetElementById('editorInfo_'+editor_sequence).style.display='none';
	var expire = new Date();
	expire.setTime(expire.getTime()+ (7000 * 24 * 3600000));
	xSetCookie('EditorInfo', '1', expire);
}


function showEditorHelp(e,editor_sequence){
	jQuery('#helpList_'+editor_sequence).toggleClass('open');
}

function showEditorExtension(evt,editor_sequence){
	var oid = '#editorExtension_'+editor_sequence;
	var e = new xEvent(evt);
	if(jQuery(oid).hasClass('extension2')){
		jQuery(oid).addClass('open');

		if(e.pageX <= xWidth('editor_component_'+editor_sequence)){
			jQuery('#editor_component_'+editor_sequence).css('right','auto').css('left', 0);
		}else{
			jQuery('#editor_component_'+editor_sequence).css('right', 0).css('left', 'auto');
		}
	}else{
		jQuery(oid).attr('class', 'extension2');
	}
}

function showPreviewContent(editor_sequence) {
	if(typeof(editor_sequence)=='undefined') return;
	if(typeof(_editorFontColor[editor_sequence])=='undefined') return;
	var preview_obj = editorGetPreviewArea(editor_sequence);
	preview_obj.contentWindow.document.body.style.color = _editorFontColor[editor_sequence];
}

function setPreviewHeight(editor_sequence){
	var h = xGetElementById('editor_preview_'+editor_sequence).contentWindow.document.body.scrollHeight;
	if(h < 400) h=400;
	xHeight('editor_preview_'+editor_sequence,h+20);
}

function getAutoSavedSrl(ret_obj, response_tags, c) {
	var editor_sequence = ret_obj.editor_sequence;
	var primary_key = ret_obj.key;
	var fo_obj = editorGetForm(editor_sequence);

	fo_obj[primary_key].value = ret_obj.document_srl;
	if(uploadSettingObj[editor_sequence]) editorUploadInit(uploadSettingObj[editor_sequence], true);
}
