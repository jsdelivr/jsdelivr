if (!window.xe) xe = {};

xe.Editors = [];

function editorStart_xe(editor_sequence, primary_key, content_key, editor_height, colorset, content_style, content_font, content_font_size) {
	if(typeof(colorset)=='undefined') colorset = 'white';
	if(typeof(content_style)=='undefined') content_style = 'xeStyle';
	if(typeof(content_font)=='undefined') content_font= '';
	if(typeof(content_font_size)=='undefined') content_font_size= '';

	var target_src = request_uri+'modules/editor/styles/'+content_style+'/editor.html';

	var textarea = jQuery("#xpress-editor-"+editor_sequence);
	var iframe   = jQuery('<iframe id="editor_iframe_'+editor_sequence+'" allowTransparency="true" frameborder="0" src="'+target_src+'" scrolling="yes" style="width:100%;height:'+editor_height+'px"></iframe>');
	var htmlsrc  = jQuery('<textarea rows="8" cols="42" class="input_syntax '+colorset+'" style="display:none"></textarea>');
	var form	 = textarea.get(0).form;
	form.setAttribute('editor_sequence', editor_sequence);
	textarea.css("display","none");

	var saved_content = '';
	if(jQuery("input[name=content]",form).size()>0){
		saved_content=jQuery("input[name=content]",form).val().replace(/src=\"files\/attach/g,'src="'+request_uri+'files/attach'); //'
		jQuery("#xpress-editor-"+editor_sequence).val(saved_content);
	}

	// hide textarea
	textarea.hide().css('width', '100%').before(iframe).after(htmlsrc);

	// create an editor
	var oEditor		     = new xe.XpressCore();
	var oWYSIWYGIFrame   = iframe.get(0);
	var oIRTextarea	     = textarea.get(0);
	var oHTMLSrcTextarea = htmlsrc.get(0);
	var elAppContainer   = jQuery('.xpress-editor', form).get(0);

	oEditor.getFrame = function(){ return oWYSIWYGIFrame;}
	oEditor.getContent = function(){
		editorGetContentTextarea_xe(editor_sequence);
	}
	
	var content = form[content_key].value;
	if(xFF && !content) content = '<br />';

	// src, href, url의 XE 상대경로를 http로 시작하는 full path로 변경
	content = editorReplacePath(content);

	form[content_key].value = content;
	jQuery("#xpress-editor-"+editor_sequence).val(content);

	// Set standard API
	editorRelKeys[editor_sequence] = new Array();
	editorRelKeys[editor_sequence]["primary"]   = form[primary_key];
	editorRelKeys[editor_sequence]["content"]   = form[content_key];
	editorRelKeys[editor_sequence]["func"]	  = editorGetContentTextarea_xe;
	editorRelKeys[editor_sequence]["editor"]	= oEditor;
	editorRelKeys[editor_sequence]["pasteHTML"] = function(text){
		oEditor.exec('PASTE_HTML',[text]);
	}
	xe.Editors[editor_sequence] = oEditor;

	// register plugins
	oEditor.registerPlugin(new xe.CorePlugin(null));

	oEditor.registerPlugin(new xe.XE_PreservTemplate(jQuery("#xpress-editor-"+editor_sequence).val()));
	oEditor.registerPlugin(new xe.StringConverterManager());
	oEditor.registerPlugin(new xe.XE_EditingAreaManager("WYSIWYG", oIRTextarea, {nHeight:parseInt(editor_height), nMinHeight:100}, null, elAppContainer));
	oEditor.registerPlugin(new xe.XE_EditingArea_HTMLSrc(oHTMLSrcTextarea));
	oEditor.registerPlugin(new xe.XE_EditingAreaVerticalResizer(elAppContainer));
	oEditor.registerPlugin(new xe.Utils());
	oEditor.registerPlugin(new xe.DialogLayerManager());
	oEditor.registerPlugin(new xe.ActiveLayerManager());
	oEditor.registerPlugin(new xe.Hotkey());
	oEditor.registerPlugin(new xe.XE_WYSIWYGStyler());
	oEditor.registerPlugin(new xe.XE_WYSIWYGStyleGetter());
	oEditor.registerPlugin(new xe.MessageManager(xe.XpressCore.oMessageMap));
	oEditor.registerPlugin(new xe.XE_Toolbar(elAppContainer));

	oEditor.registerPlugin(new xe.XE_XHTMLFormatter);
	oEditor.registerPlugin(new xe.XE_GET_WYSYWYG_MODE(editor_sequence));

	if(jQuery("ul.extra1").length) {
		oEditor.registerPlugin(new xe.XE_ColorPalette(elAppContainer));
		oEditor.registerPlugin(new xe.XE_FontColor(elAppContainer));
		oEditor.registerPlugin(new xe.XE_BGColor(elAppContainer));
		oEditor.registerPlugin(new xe.XE_Quote(elAppContainer));
		oEditor.registerPlugin(new xe.XE_FontNameWithSelectUI(elAppContainer));
		oEditor.registerPlugin(new xe.XE_FontSizeWithSelectUI(elAppContainer));
		oEditor.registerPlugin(new xe.XE_LineHeightWithSelectUI(elAppContainer));
		oEditor.registerPlugin(new xe.XE_UndoRedo());
		oEditor.registerPlugin(new xe.XE_Table(elAppContainer));
		oEditor.registerPlugin(new xe.XE_Hyperlink(elAppContainer));
		oEditor.registerPlugin(new xe.XE_FormatWithSelectUI(elAppContainer));
		oEditor.registerPlugin(new xe.XE_SCharacter(elAppContainer));
	}

	if(jQuery("ul.extra2").length) {
		oEditor.registerPlugin(new xe.XE_Extension(elAppContainer, editor_sequence));
	}

	if(jQuery("ul.extra3").length) {
		oEditor.registerPlugin(new xe.XE_EditingModeToggler(elAppContainer));
	}

	if(jQuery("#editorresize").length) {
		oEditor.registerPlugin(new xe.XE_Editorresize(elAppContainer, oWYSIWYGIFrame));
	}
	//oEditor.registerPlugin(new xe.XE_Preview(elAppContainer));

	if (!jQuery.browser.msie && !jQuery.browser.opera) {
		oEditor.registerPlugin(new xe.XE_WYSIWYGEnterKey(oWYSIWYGIFrame));
	}

	// 자동 저장 사용
	if (s=form._saved_doc_title) {
		oEditor.registerPlugin(new xe.XE_AutoSave(oIRTextarea, elAppContainer));
	}

	function load_proc() {
		try {
			var doc = oWYSIWYGIFrame.contentWindow.document, str;
			if (doc.location == 'about:blank') throw 'blank';

			// get innerHTML
			doc.body.innerHTML = doc.body.innerHTML.trim();
			str = doc.body.innerHTML;

			// register plugin
			oEditor.registerPlugin(new xe.XE_EditingArea_WYSIWYG(oWYSIWYGIFrame));
			oEditor.registerPlugin(new xe.XpressRangeManager(oWYSIWYGIFrame));
			oEditor.registerPlugin(new xe.XE_ExecCommand(oWYSIWYGIFrame));

			if(content_font && !doc.body.style.fontFamily) {
				doc.body.style.fontFamily = content_font;
			}
			if(content_font_size && !doc.body.style.fontSize) {
				doc.body.style.fontSize = content_font_size;
			}

			// run
			oEditor.run();
		} catch(e) {
			setTimeout(load_proc, 0);
		}
	}

	load_proc();

	return oEditor;
}

function editorGetContentTextarea_xe(editor_sequence) {
	var oEditor = xe.Editors[editor_sequence] || null;

	if (!oEditor) return '';

	var str = oEditor.getIR();

	if(!jQuery.trim(str.replace(/(&nbsp;|<\/?(p|br|span|div)([^>]+)?>)/ig, ''))) return '';

	// 파이어폭스의 경우 의미없는 <br>이 컨텐트 마지막에 추가될 수 있다.
	str = str.replace(/<br ?\/?>$/i, '');

	// 속도 문제가 있으므로 1024 문자 미만일 때만 첫 노드가 텍스트 노드인지 테스트
	// 그 이상이면 P 노드가 정상적으로 생성되었다고 가정한다.
	if (str.length < 1024) {
		var inline_elements = Array('#text','A','BR','IMG','EM','STRONG','SPAN','BIG','CITE','CODE','DD','DFN','HR','INS','KBD','LINK','Q','SAMP','SMALL','SUB','SUP','TT');
		var is_inline_contents = true;
		var div   = jQuery('<div>'+str+'</div>').eq(0);
		var nodes = div.contents();
		jQuery.each(nodes, function() {
			if (this.nodeType != 3) {
				if(jQuery.inArray(this.nodeName, inline_elements ) == -1) {
					is_inline_contents = false;
				}
			}
		});
		if(is_inline_contents) str = '<p>'+str+'</p>';
	}

	// 이미지 경로를 수정한다. - 20091125
	str = str.replace(/src\s?=\s?(["']?)(?:\.\.\/)+(files\/attach\/)/ig, function(m0,m1,m2){
		return 'src='+(m1||'')+m2;
	});

	str = str.replace(/\<(\/)?([A-Z]+)([^>]*)\>/ig, function(m0,m1,m2,m3) {
		if(m3) {
			m3 = m3.replace(/ ([A-Z]+?)\=/ig, function(n0,n1) {
				n1 = n1.toLowerCase();
				return ' '+n1+'=';
			});
		} else { m3 = ''; }
		m2 = m2.toLowerCase();
		if(!m1) m1='';
		return '<'+m1+m2+m3+'>';
	});
	str = str.replace('<br>','<br />');

	return str;
}

function editorGetIframe(srl) {
	return jQuery('iframe#editor_iframe_'+srl).get(0);
}

function editorReplaceHTML(iframe_obj, content) {
	// src, href, url의 XE 상대경로를 http로 시작하는 full path로 변경
	content = editorReplacePath(content);

	var srl = parseInt(iframe_obj.id.replace(/^.*_/,''),10);
	editorRelKeys[srl]["pasteHTML"](content);
}

function editorReplacePath(content) {
	// 태그 내 src, href, url의 XE 상대경로를 http로 시작하는 full path로 변경
	content = content.replace(/\<([^\>\<]*)(src=|href=|url\()("|\')*([^"\'\)]+)("|\'|\))*(\s|>)*/ig, function(m0,m1,m2,m3,m4,m5,m6) {
		if(m2=="url(") { m3=''; m5=')'; } else { if(typeof(m3)=='undefined') m3 = '"'; if(typeof(m5)=='undefined') m5 = '"'; if(typeof(m6)=='undefined') m6 = ''; }
		var val = jQuery.trim(m4).replace(/^\.\//,'');
		if(/^(http\:|https\:|ftp\:|telnet\:|mms\:|mailto\:|\/|\.\.|\#)/i.test(val)) return m0;
		return '<'+m1+m2+m3+request_uri+val+m5+m6;
	});
	return content;
}

function editorGetAutoSavedDoc(form) {
	var param = new Array();
	param['mid'] = current_mid;
	param['editor_sequence'] = form.getAttribute('editor_sequence')
	setTimeout(function() {
	  var response_tags = new Array("error","message","editor_sequence","title","content","document_srl");
	  exec_xml('editor',"procEditorLoadSavedDocument", param, function(a,b,c) { editorRelKeys[param['editor_sequence']]['primary'].value = a['document_srl']; if(typeof(uploadSettingObj[param['editor_sequence']]) == 'object') editorUploadInit(uploadSettingObj[param['editor_sequence']], true); }, response_tags);
	}, 0);
	
}

// WYSIWYG 모드를 저장하는 확장기능
xe.XE_GET_WYSYWYG_MODE = jQuery.Class({
	name : "XE_GET_WYSYWYG_MODE",

	$init : function(editor_sequence) {
		this.editor_sequence = editor_sequence;
	},

	$ON_CHANGE_EDITING_MODE : function(mode) {
		editorMode[this.editor_sequence] = (mode =='HTMLSrc') ? 'html' : 'wysiwyg';
	}
});

// 서식 기본 내용을 보존
xe.XE_PreservTemplate = jQuery.Class({
	name : "XE_PreservTemplate",
	isRun : false,

	$BEFORE_SET_IR : function(content) {
		if(!this.isRun && !content) {
			this.isRun = true;
			return false;
		}
	}
});

// 미리보기 확장기능
xe.XE_Preview = jQuery.Class({
	name  : "XE_Preview",
	elPreviewButton : null,

	$init : function(elAppContainer) {
		this._assignHTMLObjects(elAppContainer);
	},

	_assignHTMLObjects : function(elAppContainer) {
		this.elPreviewButton = jQuery("BUTTON.xpress_xeditor_preview_button", elAppContainer);
	},

	$ON_MSG_APP_READY : function() {
		this.oApp.registerBrowserEvent(this.elPreviewButton.get(0), "click", "EVENT_PREVIEW", []);
	},

	$ON_EVENT_PREVIEW : function() {
		// TODO : 버튼이 눌렸을 때의 동작 정의
	}
});
