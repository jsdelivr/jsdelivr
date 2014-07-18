/**
 * @file   modules/widget/js/widget.js
 * @author NAVER (developers@xpressengine.com)
 * @brief  위젯 관리용 자바스크립트
 **/

/* DOM 속성을 구하기 위한 몇가지 함수들.. */
// style의 값을 구하는게 IE랑 그외가 다름.
function getStyle(obj) {
	var style = obj.getAttribute("style");
	if(!style)
	{
		style = obj.style;
	}
	if(typeof(style)=="object") style = style.cssText;
	style = style.replace(/\burl\s*\(\s*"(.*?)"\s*\)/i, "url('$1')");
	return style;
}

// float: 값을 구하는게 IE랑 그외가 다름
function getFloat(obj) {
	return jQuery(obj).css('float');
}
function setFloat(obj, fl) {
	jQuery(obj).css('float', fl);
}

// padding값을 구하는 함수 (없을 경우 0으로 세팅), zbxe의 위젯에서만 사용
function getPadding(obj, direct) {
	var padding = obj.getAttribute("widget_padding_"+direct);
	if(!padding || padding === null) padding = 0;
	return padding;
}


/* 위젯 핸들링 시작 */
var zonePageObj = null;
var zoneModuleSrl = 0;
function doStartPageModify(zoneID, module_srl) {
	zonePageObj = get_by_id(zoneID);
	zoneModuleSrl = module_srl;

	// 위젯 크기/여백 조절 레이어를 가장 밖으로 뺌
	jQuery('#tmpPageSizeLayer')
		.appendTo('body')
		.hide()
		.attr('id', 'pageSizeLayer')
		.css({position:'fixed'})
		.before('<div class="x_modal-backdrop" />')
		.find('>form')
		.submit(function(){ doApplyWidgetSize(this); return false; });

	// 드래그와 리사이즈와 관련된 이벤트 리스너 생성
	jQuery('#zonePageContent')
		.on('click', doCheckWidget)
		.on('mousedown', doCheckWidgetDrag)
		.on('mouseover', widgetSetup);
}

// 내용 모두 삭제
function removeAllWidget() {
	if(!confirm(confirm_delete_msg)) return;
	restoreWidgetButtons();
	jQuery(zonePageObj).html('');
}

/**
 * 특정 영역에 편집된 위젯들을 약속된 태그로 변환하여 return
 **/
function getWidgetContent(obj) {
	var html = "";
	if(typeof(obj)=='undefined' || !obj) obj = zonePageObj;

	var widget = null;
	jQuery('div.widgetOutput',obj).each(function(){
		if(jQuery(this).parent().get(0) != obj) return;
		widget = jQuery(this).attr('widget');
		switch(widget) {
			case 'widgetBox' :
				html += getWidgetBoxCode(this, widget);
				break;
			case 'widgetContent' :
				html += getContentWidgetCode(this, widget);
				break;
			default :
				html += getWidgetCode(this, widget);
				break;
		}
	});

	return html;
}

// 컨텐츠 위젯 코드 구함
function getContentWidgetCode(childObj, widget) {
	var cobj = childObj.firstChild;

	var widgetContent = jQuery('div.widgetContent',childObj);
	var body = '', attrs = '', code = '', name;
	var document_srl = 0;
	var toIgnore = 'contenteditable,id,style,src,widget,body,class,widget_width,widget_width_type,xdpx,xdpy,height,document_srl,widget_padding_left,widget_padding_right,widget_padding_top,widget_padding_bottom,hascontent';

	if(widgetContent.size() > 0){
		document_srl = jQuery(childObj).attr('document_srl');
		if(document_srl>0){
			body = '';
		}else{
			body = widgetContent.html();
		}

		var reIgnore = new RegExp('^('+toIgnore.replace(/,/g, '|')+')$','i');
		var value;

		for(var i=0;i<childObj.attributes.length;i++) {
			if(!(name=childObj.attributes[i].nodeName) || !childObj.attributes[i].nodeValue) continue;
			if(reIgnore.test(name)) continue;
			if(!(value=childObj.attributes[i].nodeValue)) continue;

			attrs += name+'="'+encodeURIComponent(value)+'" ';
		}

		return '<img hasContent="true" class="zbxe_widget_output" widget="widgetContent" style="'+getStyle(childObj)+'" body="'+body+'" document_srl="'+document_srl+'" widget_padding_left="'+getPadding(childObj,'left')+'" widget_padding_right="'+getPadding(childObj, 'right')+'" widget_padding_top="'+getPadding(childObj, 'top')+'" widget_padding_bottom="'+getPadding(childObj,'bottom')+'" '+attrs+' />';
	}else{
		return '';
	}

	return code;
}

// 위젯 박스 코드 구함
function getWidgetBoxCode(childObj, widget) {

	var attrs = "";
	for(var i=0;i<childObj.attributes.length;i++) {
		if(!childObj.attributes[i].nodeName || !childObj.attributes[i].nodeValue || /^jquery[0-9]+/i.test(childObj.attributes[i].nodeName)) continue;

		var name = childObj.attributes[i].nodeName.toLowerCase();
		if(name == "widget_padding_left" || name == "widget_padding_right" || name == "widget_padding_top" || name == "widget_padding_bottom" || name == "contenteditable" || name == "id" || name=="style" || name=="src" || name=="widget" || name == "body" || name == "class" || name == "widget_width" || name == "widget_width_type" || name == "xdpx" || name == "xdpy" || name == "height") continue;
		var value = childObj.attributes[i].nodeValue;
		if(!value || value == "Array") continue;
		attrs += name+'="'+encodeURIComponent(value)+'" ';
	}

	var o;

	if(jQuery('.widget_inner',childObj).size()>0){
		o = jQuery('.widget_inner',childObj);
		o = o.get(0);
	}else{
		o = jQuery('.nullWidget',childObj).get(0);
	}

	var body = getWidgetContent(o);
	return '<div widget="widgetBox" style="'+getStyle(childObj)+'" widget_padding_left="'+getPadding(childObj,'left')+'" widget_padding_right="'+getPadding(childObj,'right')+'" widget_padding_top="'+getPadding(childObj, 'top')+'" widget_padding_bottom="'+getPadding(childObj, 'bottom')+'" '+attrs+'><div><div>'+body+'</div></div></div>';
}

// 일반 위젯 컨텐츠 코드 구함
function getWidgetCode(childObj, widget) {
	var attrs = "";
	var code = "";
	for(var i=0;i<childObj.attributes.length;i++) {
		if(!childObj.attributes[i].nodeName || !childObj.attributes[i].nodeValue || /^jquery[0-9]+/i.test(childObj.attributes[i].nodeName)) continue;

		var name = childObj.attributes[i].nodeName.toLowerCase();
		if(name == "contenteditable" || name == "id" || name=="style" || name=="src" || name=="widget" || name == "body" || name == "class" || name == "widget_width" || name == "widget_width_type" || name == "xdpx" || name == "xdpy" || name == "height") continue;
		var value = childObj.attributes[i].nodeValue;
		if(!value || value == "Array" || value == "null") continue;

		attrs += name+'="'+encodeURIComponent(value)+'" ';
	}
	var style = childObj.getAttribute("style");
	return '<img class="zbxe_widget_output" style="'+getStyle(childObj)+'" widget="'+widget+'" '+attrs+' />';
}

/**
 * 직접 내용을 입력하는 위젯을 추가
 **/
// 팝업 띄움
function doAddContent(mid) {
	var url = request_uri.setQuery('module','widget').setQuery('act','dispWidgetAdminAddContent').setQuery('module_srl',zoneModuleSrl).setQuery('mid',mid);
	popopen(url, "addContent");
}

// 직접 내용을 입력하기 위한 에디터 활성화 작업 및 form 데이터 입력
function doSyncPageContent() {
	if(opener && opener.selectedWidget) {

		var fo_obj = get_by_id("content_fo");
		var sel_obj = opener.selectedWidget;
		fo_obj.style.value = getStyle(opener.selectedWidget);
		fo_obj.widget_padding_left.value = getPadding(sel_obj, 'left');
		fo_obj.widget_padding_right.value = getPadding(sel_obj,'right');
		fo_obj.widget_padding_bottom.value = getPadding(sel_obj,'bottom');
		fo_obj.widget_padding_top.value = getPadding(sel_obj,'top');

		var obj = sel_obj.firstChild;
		while(obj && !jQuery(obj).hasClass("widgetContent")) obj = obj.nextSibling;

		if(obj && jQuery(obj).hasClass("widgetContent")) {
			if(!fo_obj.document_srl || fo_obj.document_srl.value == '0') {
				try {
					var content = Base64.decode(xInnerHtml(obj));
					content = editorReplacePath(content);
					get_by_id("content_fo").content.value = content;
					xe.Editors["1"].exec("SET_IR", [content]);
				}
				catch(e)
				{
				}
			}
		}
	}

	if(typeof(editorStart)!='undefined') editorStart(1, "module_srl", "content", false, 400 );
}

// 부모창에 위젯을 추가
function addContentWidget(fo_obj) {
	var editor_sequence = fo_obj.getAttribute('editor_sequence');
	var mid = fo_obj.mid.value;
	var module_srl = fo_obj.module_srl.value;
	var document_srl = fo_obj.document_srl.value;
	var content = editorGetContent(editor_sequence);
	var params = {
		editor_sequence : editor_sequence,
		content      : content,
		module_srl   : module_srl,
		document_srl : document_srl
	};

	// issue 979
	if(/^\s*<p>.*<\/p>\s*$/i.test(params.content)) {
		// get count of paragraphs
		var lowerContent = params.content.toLowerCase();
		var idx = lowerContent.indexOf('</p>');
		var last_idx = lowerContent.lastIndexOf('</p>');

		if(idx > 0 && last_idx > 0 && idx == last_idx) {
			params.content = content = params.content.replace(/^\s*<p>|<\/p>\s*$/ig, '');
		}
	}

	exec_xml(
		'widget',
		'procWidgetInsertDocument',
		params,
		function(ret_obj, response_tags) {
			if(!ret_obj || ret_obj.error != '0') return;

			var document_srl  = ret_obj.document_srl;
			var contentWidget = opener.jQuery('div.widgetOutput[widget=widgetContent][document_srl='+document_srl+']'), attr = [];

			if(contentWidget.size() > 0) {
				attr = contentWidget.get(0).attributes;
			}

			var tpl = ''+
				'<div class="widgetOutput" style="'+fo_obj.style.value+'" widget_padding_left="'+fo_obj.widget_padding_left.value+'" widget_padding_right="'+fo_obj.widget_padding_right.value+'" widget_padding_top="'+fo_obj.widget_padding_top.value+'" widget_padding_bottom="'+fo_obj.widget_padding_bottom.value+'" document_srl="'+document_srl+'" widget="widgetContent">'+
				'<button type="button" class="widgetResize"></button>'+
				'<button type="button" class="widgetResizeLeft"></button>'+
				'<div class="widgetBorder">'+
				'<div style="padding:'+fo_obj.widget_padding_top.value+'px '+fo_obj.widget_padding_right.value+'px '+fo_obj.widget_padding_bottom.value+'px '+fo_obj.widget_padding_left.value+'px"></div>'+content+
				'</div>'+
				'<div class="widgetContent" style="display:none;width:1px;height:1px;overflow:hidden;"></div>'+
				'</div>';

			var $tpl = jQuery(tpl);
			for(var i=0,l=attr.length; i < l; i++) {
				if(!$tpl.attr(attr[i].name)) $tpl.attr(attr[i].name, attr[i].value);
			}
			tpl = jQuery('<div>').append($tpl).html();
			opener.doAddWidgetCode(tpl);
			window.close();
		},
		'document_srl'.split(',') // response tags
	);

	return false;

}

/* 박스 위젯 추가 */
function doAddWidgetBox() {
	var tpl = ''+
	'<div class="widgetOutput" style="float:left;width:100%;height:20px;" widget="widgetBox" >'+
		'<button type="button" class="widgetBoxResize"></button>'+
		'<button type="button" class="widgetBoxResizeLeft"></button>'+
		'<div class="widgetBoxBorder">'+
			'<div class="nullWidget" style="width:100%;height:100px;"></div>'+
		'</div>'+
	'</div>';
	zonePageObj.innerHTML += tpl;
}


/* 일반 위젯을 추가하기 위해 위젯 팝업창을 띄움 */
function doAddWidget(fo) {
	var sel = fo.widget_list;
	var idx = sel.selectedIndex;
	var val = sel.options[idx].value;
	var module_srl = fo.module_srl.value;
	var url = request_uri.setQuery('module','widget').setQuery('act','dispWidgetGenerateCodeInPage').setQuery('selected_widget', val).setQuery('module_srl', module_srl);
	popopen(url,'GenerateWidgetCode');
}


var selectedWidget = null;
var writedText = null;
var checkDocumentWrite = false;

// document.write(ln)의 경우 ajax로 처리시 가로채기 위한 함수
// 아래 함수는 str 내용을 단지 전역 변수에 보관 후 doAddWidgetCode 에서 재사용하기 위해 사용됨.
window.document.write = window.document.writeln = function(str){
	if(checkDocumentWrite) {
		writedText = str;
		return;
	}
	if ( str.match(/^<\//) ) return;
	if ( !window.opera ) str = str.replace(/&(?![#a-z0-9]+;)/g, "&");
	str = str.replace(/(<[a-z]+)/g, "$1 xmlns='http://www.w3.org/1999/xhtml'");

	var div = jQuery('<div>').html(str)[0];

	var pos;
	pos = document.getElementsByTagName("*");
	pos = pos[pos.length - 1];
	var nodes = div.childNodes;
	while ( nodes.length ) {
		pos.parentNode.appendChild( nodes[0] );
	}
};

// 위젯 추가
function doAddWidgetCode(widget_code) {
	restoreWidgetButtons();

	// css 추가
	var tmp = widget_code;
	while(tmp.indexOf("<!--#Meta:")>-1) {
		var pos = tmp.indexOf("<!--#Meta:");
		tmp = tmp.substr(pos);
		var eos = tmp.indexOf("-->");
		var cssfile = tmp.substr(10,eos-10);
		if(cssfile.indexOf('.js')>-1) {
			tmp = tmp.substr(eos);
			continue;
		}
		if(!cssfile) break;
		tmp = tmp.substr(eos);

		cssfile = request_uri+cssfile;
		if(typeof(document.createStyleSheet)=='undefined') {
			var css ='<link rel="stylesheet" href="'+cssfile+'" />';
			var dummy  = xCreateElement("DIV");
			xInnerHtml(dummy , css);
			document.body.appendChild(dummy);
		} else {
			document.createStyleSheet(cssfile,0);
		}
	}

	// widget 코드에서 javascript 부분을 빼서 eval후 결과값을 대체함
	checkDocumentWrite = true; ///< document.write(ln)등의 함수값을 바로 사용하기 위한 check flag

	// widget_code의 javascript 부분 수정
	tmp = widget_code.toLowerCase();
	while(tmp.indexOf("<script")>-1) {
		/*jshint -W004, -W061*/
		var pos = tmp.indexOf("<script");

		tmp = tmp.substr(pos);
		var length = tmp.indexOf("</script>")+9;

		var script = widget_code.substr(pos,length);
		script = script.replace(/^<script([^>]*)>/i,'').replace(/<\/script>$/i,'');

		writedText = null;
		try{
			eval(script);
		}catch(e){}

		widget_code = widget_code.substr(0,pos)+writedText+widget_code.substr(pos+length);
		tmp = widget_code.toLowerCase();
	}



	// html 추가
	var dummy = xCreateElement('div');
	xInnerHtml(dummy, widget_code);
	var obj = dummy.childNodes[0];

	if(selectedWidget && selectedWidget.getAttribute("widget")) {
		var o = jQuery('div.widget_inner',selectedWidget);
		var n = jQuery('div.widget_inner',obj);

		if(n.size() === 0) n = jQuery('div.nullWidget',obj);
		if(o.size() === 0) o = jQuery('div.nullWidget',selectedWidget);

		n.html(o.html());


		selectedWidget.parentNode.insertBefore(obj, selectedWidget);
		selectedWidget.parentNode.removeChild(selectedWidget);
	} else {
		get_by_id('zonePageContent').appendChild(obj);
	}
	checkDocumentWrite = false;
	selectedWidget = null;
}

// 클릭 이벤트시 위젯의 수정/제거/이벤트 무효화 처리
function doCheckWidget(e) {
	if(!e.target) return;
	var obj = e.target;
	var $obj = jQuery(obj);

	selectedWidget = null;

	doHideWidgetSizeSetup();
	// 위젯 설정
	if($obj.hasClass('widgetSetup')) {
		var p_obj = obj.parentNode.parentNode;
		var widget = p_obj.getAttribute("widget");
		if(!widget) return;
		selectedWidget = p_obj;
		if(widget == 'widgetContent') popopen(request_uri+"?module=widget&act=dispWidgetAdminAddContent&module_srl="+zoneModuleSrl+"&document_srl="+p_obj.getAttribute("document_srl"), "addContent");
		else popopen(request_uri+"?module=widget&act=dispWidgetGenerateCodeInPage&selected_widget="+widget+"&widgetstyle="+widgetstyle,'GenerateCodeInPage');
		return;

	// 위젯 스타일
	} else if($obj.hasClass('widgetStyle')) {
		/*jshint -W004*/
		var p_obj = obj.parentNode.parentNode;
		var widget = p_obj.getAttribute("widget");
		var widgetstyle = p_obj.getAttribute("widgetstyle");
		if(!widget) return;
		selectedWidget = p_obj;
		popopen(request_uri+"?module=widget&act=dispWidgetStyleGenerateCodeInPage&selected_widget="+widget+"&widgetstyle="+widgetstyle,'GenerateCodeInPage');
		return;

	// 위젯 복사
	} else if($obj.hasClass('widgetCopy') && jQuery(obj.parentNode.parentNode).hasClass('widgetOutput')) {
		/*jshint -W004*/
		var p_obj = obj.parentNode.parentNode;
		restoreWidgetButtons();

		if(p_obj.getAttribute('widget')=='widgetContent' && p_obj.getAttribute('document_srl') ) {
			var response_tags = ['error','message','document_srl'];
			var params = [];
			params.document_srl =p_obj.getAttribute('document_srl');
			exec_xml('widget','procWidgetCopyDocument', params, completeCopyWidgetContent, response_tags, params, p_obj);
			return;
		} else {
			var dummy = xCreateElement("DIV");
			xInnerHtml(dummy,xInnerHtml(p_obj));

			dummy.widget_sequence = '';
			dummy.className = "widgetOutput";
			for(var i=0;i<p_obj.attributes.length;i++) {
				if(!p_obj.attributes[i].nodeName || !p_obj.attributes[i].nodeValue) continue;
				var name = p_obj.attributes[i].nodeName.toLowerCase();

				var value = p_obj.attributes[i].nodeValue;
				if(!value) continue;

				if(value && typeof(value)=="string") value = value.replace(/\"/ig,'&quot;');

				dummy.setAttribute(name, value);
			}

			if(xIE4Up) dummy.style.cssText = p_obj.style.cssText;
			p_obj.parentNode.insertBefore(dummy, p_obj);
		}
		return;

	// 위젯 사이트/ 여백 조절
	} else if($obj.hasClass('widgetSize') || $obj.hasClass('widgetBoxSize')) {
		var p_obj = obj.parentNode.parentNode;
		var widget = p_obj.getAttribute("widget");
		if(!widget) return;
		selectedWidget = p_obj;
		doShowWidgetSizeSetup(e.pageX, e.pageY, selectedWidget);
		return;

	// 위젯 제거
	} else if($obj.hasClass('widgetRemove') || $obj.hasClass('widgetBoxRemove')) {
		var p_obj = obj.parentNode.parentNode;
		var widget = p_obj.getAttribute("widget");
		if(confirm(confirm_delete_msg)) {
			restoreWidgetButtons();
			p_obj.parentNode.removeChild(p_obj);
		}
		return;
	}

	// 내용 클릭 무효화
	var p_obj = obj;
	while(p_obj) {
		if(jQuery(p_obj).hasClass('widgetOutput')) {
			e.cancelBubble = true;
			e.returnValue = false;
			e.preventDefault();
			e.stopPropagation();
			break;
		}
		p_obj = p_obj.parentNode;
	}
}

// content widget 복사
function completeCopyWidgetContent(ret_obj, response_tags, params, p_obj) {
	var document_srl = ret_obj.document_srl;
	var dummy = xCreateElement("DIV");
	xInnerHtml(dummy,xInnerHtml(p_obj));


	dummy.widget_sequence = '';
	dummy.className = "widgetOutput";
	for(var i=0;i<p_obj.attributes.length;i++) {
		if(!p_obj.attributes[i].nodeName || !p_obj.attributes[i].nodeValue) continue;
		var name = p_obj.attributes[i].nodeName.toLowerCase();

		var value = p_obj.attributes[i].nodeValue;
		if(!value) continue;

		if(value && typeof(value)=="string") value = value.replace(/\"/ig,'&quot;');

		dummy.setAttribute(name, value);
	}
	p_obj.setAttribute('document_srl', document_srl);

	if(xIE4Up) dummy.style.cssText = p_obj.getAttribute("style").cssText;
	p_obj.parentNode.insertBefore(dummy, p_obj);
}

// content widget 제거
function completeDeleteWidgetContent(ret_obj, response_tags, params, p_obj) {
	restoreWidgetButtons();
	p_obj.parentNode.removeChild(p_obj);
}


// 마우스 다운 이벤트 발생시 위젯의 이동을 처리
function doCheckWidgetDrag(e) {
	if(!e.target) return;
	var obj = e.target;
	var $obj = jQuery(obj);

	if($obj.parents('#pageSizeLayer').size() > 0) return;

	doHideWidgetSizeSetup();

	if($obj.hasClass('widgetSetup') || $obj.hasClass('widgetStyle') || $obj.hasClass('widgetCopy') || $obj.hasClass('widgetBoxCopy') || $obj.hasClass('widgetSize') || $obj.hasClass('widgetBoxSize') || $obj.hasClass('widgetRemove') || $obj.hasClass('widgetBoxRemove')) return;

	p_obj = obj;
	while(p_obj) {
		var $p_obj = jQuery(p_obj);
		if($p_obj.hasClass('widgetOutput') || $p_obj.hasClass('widgetResize') || $p_obj.hasClass('widgetResizeLeft') || $p_obj.hasClass('widgetBoxResize') || $p_obj.hasClass('widgetBoxResizeLeft')) {
			widgetDragEnable(p_obj, widgetDragStart, widgetDrag, widgetDragEnd);
			widgetMouseDown(e);
			return;
		}
		p_obj = p_obj.parentNode;
	}
}

function _getInt(val) {
	if(!val || val == "null") return 0;
	if(isNaN(parseInt(val, 10))) return 0;

	return parseInt(val,10);
}

// 위젯 크기 조절 레이어를 보여줌
var selectedSizeWidget = null;
function doShowWidgetSizeSetup(px, py, obj) {
	/*jshint -W004*/
	var layer = jQuery('#pageSizeLayer');
	var form  = layer.find('>form:first');
	var $obj   = jQuery(obj);
	if (!form.length) return;

	selectedSizeWidget = obj;
	var $selectedSizeWidget = jQuery(selectedSizeWidget);

	var opts = {
		widget_align : $obj.css('float'),

		css_class : ($selectedSizeWidget.attr('css_class')) ? $selectedSizeWidget.attr('css_class') : '',
		width     : $obj[0].style.width,
		height    : $obj[0].style.height,

		padding_left   : _getInt($obj.attr('widget_padding_left')),
		padding_right  : _getInt($obj.attr('widget_padding_right')),
		padding_top    : _getInt($obj.attr('widget_padding_top')),
		padding_bottom : _getInt($obj.attr('widget_padding_bottom')),

		margin_left    : _getInt($obj.css('marginLeft')),
		margin_right   : _getInt($obj.css('marginRight')),
		margin_top     : _getInt($obj.css('marginTop')),
		margin_bottom  : _getInt($obj.css('marginBottom')),

		border_top_color : transRGB2Hex($obj.css('borderTopColor')),
		border_top_thick : $obj.css('borderTopWidth').replace(/px$/i, ''),
		border_top_type  : $obj.css('borderTopStyle'),

		border_bottom_color : transRGB2Hex($obj.css('borderBottomColor')),
		border_bottom_thick : $obj.css('borderBottomWidth').replace(/px$/i, ''),
		border_bottom_type  : $obj.css('borderBottomStyle'),

		border_right_color : transRGB2Hex($obj.css('borderRightColor')),
		border_right_thick : $obj.css('borderRightWidth').replace(/px$/i, ''),
		border_right_type  : $obj.css('borderRightStyle'),

		border_left_color : transRGB2Hex($obj.css('borderLeftColor')),
		border_left_thick : $obj.css('borderLeftWidth').replace(/px$/i, ''),
		border_left_type  : $obj.css('borderLeftStyle'),

		background_color     : transRGB2Hex($obj.css('backgroundColor')),
		background_image_url : $obj.css('backgroundImage').replace(/^url\(/i,'').replace(/\)$/i,''),

		background_x : 0,
		background_y : 0,

		background_repeat : $obj.css('backgroundRepeat')
	};

	// background position
	var pos = $obj.css('backgroundPosition');
	if(pos) {
		pos = pos.split(' ');
		if(pos.length == 2) {
			opts.background_x = pos[0];
			opts.background_y = pos[1];
		}
	}
	layer.show();
	jQuery(function($){
		var $psLayer = $('#pageSizeLayer');
		var $backdrop = $('.x_modal-backdrop');
		var ww = $(window).width();
		var wh = $(window).height();
		var pw = $psLayer.width();
		var ph = $psLayer.height();
		if(ww>pw && wh>ph){
			$backdrop.show();
			$psLayer.css({
				position	: 'fixed',
				top			: wh/2 - ph/2 + 'px',
				left		: ww/2 - pw/2 + 'px',
				width		: '700px'
			});
		}else{
			$backdrop.hide();
			$psLayer.css({
				position	: 'static',
				top			: 'auto',
				left		: 'auto',
				width		: 'auto'
			});
		}
	});

	jQuery.each(opts, function(key, val){
		var el = form[0].elements[key];
		var $el = jQuery(el);
		if(el) {
			$el.val(val);

			if($el.hasClass('color-indicator')) {
				if(val != 'transparent') {
					val = val.toUpperCase();
					$el.css('background', '#' + val);
					$el.val('#' + val);
				}
			}
		}

		if(el.tagName.toLowerCase() == "select") {
			if(el.selectedIndex == -1) {
				el.selectedIndex = 0;
			}
		}
	});

	try { form[0].elements[0].focus(); } catch(e) {}
}

function doHideWidgetSizeSetup() {
	jQuery('#pageSizeLayer, .x_modal-backdrop, .jPicker.Container').hide();
}

jQuery(function($){
	$(document).keydown(function(e){
		var $jpicker = $('.jPicker.Container:visible');
		if(e.which == 27 && !$jpicker.length){
			doHideWidgetSizeSetup();
			return false;
		}else if(e.which == 27 && $jpicker.length){
			$jpicker.hide();
			return false;
		}else{
			return true;
		}
	});
});

function _getSize(value) {
	if(!value) return 0;
	var type = "px";
	if(value.lastIndexOf("%")>=0)  type = "%";
	var num = parseInt(value,10);
	if(num<1) return 0;
	if(type == "%" && num > 100) num = 100;
	return ""+num+type;
}

function _getBorderStyle(fld_color, fld_thick, fld_type) {
	var color = fld_color.value;
	color = color.replace(/^#/,'');
	if(!color) color = '#FFFFFF';
	else color = '#'+color;
	var width = fld_thick.value;
	if(!width) width = '0px';
	else width = parseInt(width,10)+'px';
	var style = fld_type.options[fld_type.selectedIndex].value;
	if(!style) style = 'solid';

	var str = color+' '+width+' '+style;
	return str;
}

function _getBGColorStyle(fld_color) {
	var color = fld_color.replace(/^#/,'');
	if(!color) color = '#FFFFFF';
	else color = '#'+color;
	return color;
}

function doApplyWidgetSize(fo_obj) {
	if(selectedSizeWidget) {
		if(fo_obj.widget_align.selectedIndex == 1) setFloat(selectedSizeWidget, 'right');
		else setFloat(selectedSizeWidget, 'left');

		var $form = jQuery(fo_obj);
		var $selectedSizeWidget = jQuery(selectedSizeWidget);

		var css_class = $form.find('#css_class').val();
		if(css_class) $selectedSizeWidget.attr('css_class', css_class);

		var width = _getSize(fo_obj.width.value);
		if(width) selectedSizeWidget.style.width = width;

		var height = _getSize(fo_obj.height.value);
		if(height && height != "100%") selectedSizeWidget.style.height = height;
		else {
			selectedSizeWidget.style.height = '';
			var widgetBorder = xGetElementsByClassName('widgetBorder',selectedSizeWidget);
			for(var i=0;i<widgetBorder.length;i++) {
				var obj = widgetBorder[i];
				obj.style.height = '';
			}
		}

		selectedSizeWidget.style.borderTop = _getBorderStyle(fo_obj.border_top_color, fo_obj.border_top_thick, fo_obj.border_top_type);
		selectedSizeWidget.style.borderBottom = _getBorderStyle(fo_obj.border_bottom_color, fo_obj.border_bottom_thick, fo_obj.border_bottom_type);
		selectedSizeWidget.style.borderLeft = _getBorderStyle(fo_obj.border_left_color, fo_obj.border_left_thick, fo_obj.border_left_type);
		selectedSizeWidget.style.borderRight = _getBorderStyle(fo_obj.border_right_color, fo_obj.border_right_thick, fo_obj.border_right_type);

		selectedSizeWidget.style.marginTop = _getSize(fo_obj.margin_top.value);
		selectedSizeWidget.style.marginRight = _getSize(fo_obj.margin_right.value);
		selectedSizeWidget.style.marginBottom = _getSize(fo_obj.margin_bottom.value);
		selectedSizeWidget.style.marginLeft = _getSize(fo_obj.margin_left.value);

		if(!fo_obj.background_color.value || fo_obj.background_color.value == '#' || fo_obj.background_color.value == 'transparent') selectedSizeWidget.style.backgroundColor = 'transparent';
		else selectedSizeWidget.style.backgroundColor = _getBGColorStyle(fo_obj.background_color.value);

		var image_url = fo_obj.background_image_url.value;
		if(image_url && image_url != 'none') selectedSizeWidget.style.backgroundImage = "url("+image_url+")";
		else selectedSizeWidget.style.backgroundImage = 'none';

		switch(fo_obj.background_repeat.selectedIndex) {
			case 1 : selectedSizeWidget.style.backgroundRepeat = 'no-repeat'; break;
			case 2 : selectedSizeWidget.style.backgroundRepeat = 'repeat-x'; break;
			case 3 : selectedSizeWidget.style.backgroundRepeat = 'repeat-y'; break;
			default : selectedSizeWidget.style.backgroundRepeat = 'repeat'; break;
		}

		selectedSizeWidget.style.backgroundPosition = fo_obj.background_x.value+' '+fo_obj.background_y.value;

		var borderObj = selectedSizeWidget.firstChild;
		while(borderObj) {
			var $borderObj = jQuery(borderObj);
			if(borderObj.nodeName == "DIV" && ($borderObj.hasClass("widgetBorder") || $borderObj.hasClass("widgetBoxBorder"))) {
				var contentObj = borderObj.firstChild;
				while(contentObj) {
					if(contentObj.nodeName == "DIV") {
						contentObj.style.padding = "";
						var paddingLeft = _getSize(fo_obj.padding_left.value);
						if(paddingLeft) {
							contentObj.style.paddingLeft = paddingLeft;
							selectedSizeWidget.setAttribute('widget_padding_left', paddingLeft);
						} else {
							contentObj.style.paddingLeft = '';
							selectedSizeWidget.setAttribute('widget_padding_left', '');
						}

						var paddingRight = _getSize(fo_obj.padding_right.value);
						if(paddingRight) {
							contentObj.style.paddingRight = paddingRight;
							selectedSizeWidget.setAttribute('widget_padding_right', paddingRight);
						} else {
							contentObj.style.paddingRight = '';
							selectedSizeWidget.setAttribute('widget_padding_right', '');
						}

						var paddingTop = _getSize(fo_obj.padding_top.value);
						if(paddingTop) {
							contentObj.style.paddingTop = paddingTop;
							selectedSizeWidget.setAttribute('widget_padding_top', paddingTop);
						} else {
							contentObj.style.paddingTop = '';
							selectedSizeWidget.setAttribute('widget_padding_top', '');
						}

						var paddingBottom = _getSize(fo_obj.padding_bottom.value);
						if(paddingBottom) {
							contentObj.style.paddingBottom = paddingBottom;
							selectedSizeWidget.setAttribute('widget_padding_bottom', paddingBottom);
						} else {
							contentObj.style.paddingBottom = '';
							selectedSizeWidget.setAttribute('widget_padding_bottom', '');
						}

						break;
					}
					contentObj = contentObj.nextSibling;
				}

				break;
			}

			borderObj = borderObj.nextSibling;
		}

		selectedWidget = selectedSizeWidget;
		selectedSizeWidget = null;

		var widget = selectedWidget.getAttribute("widget");
		var params = [];
		/*jshint -W004*/
		for(var i=0;i<selectedWidget.attributes.length;i++) {
			if(!selectedWidget.attributes[i].nodeName || !selectedWidget.attributes[i].nodeValue) continue;
			var name = selectedWidget.attributes[i].nodeName.toLowerCase();
			if(name == "contenteditable" || name == "id" || name=="src" || name=="widget" || name == "body" || name == "class" || name == "widget_width" || name == "widget_width_type" || name == "xdpx" || name == "xdpy" || name == "height") continue;
			var value = selectedWidget.attributes[i].nodeValue;
			if(!value || value == "Array") continue;
			params[name] = value;
		}

		params.style = getStyle(selectedWidget);
		params.selected_widget = widget;
		params.module_srl = get_by_id("pageFo").module_srl.value;

		exec_xml('widget','procWidgetGenerateCodeInPage',params,function(ret_obj) { doAddWidgetCode(ret_obj.widget_code);  }, ['error','message','widget_code','tpl','css_header']);
	}
	doHideWidgetSizeSetup();
}

var hideElements = [];
function restoreWidgetButtons() {
	var widgetButton = get_by_id('widgetButton');
	var boxWidgetButton = get_by_id('widgetBoxButton');
	if(!widgetButton || !boxWidgetButton) return;

	widgetButton.style.visibility = 'hidden';
	get_by_id("zonePageContent").parentNode.appendChild(widgetButton);
	boxWidgetButton.style.visibility = 'hidden';
	get_by_id("zonePageContent").parentNode.appendChild(boxWidgetButton);

	for(var i=0;i<hideElements.length;i++) {
		var obj = hideElements[0];
		obj.style.paddingTop = 0;
	}
	hideElements = [];
}

function showWidgetButton(name, obj) {
	var widgetButton = get_by_id(name);
	if(!widgetButton) return;
	widgetButton.style.visibility = 'visible';
	obj.insertBefore(widgetButton, obj.firstChild);
}

function widgetSetup(e) {
	var obj = e.target;

	if(jQuery(obj).is('.widgetButtons') || jQuery(obj).parents('.widgetButtons').size() > 0) return;
	if(jQuery(obj).is('.buttonBox') || jQuery(obj).parents('.buttonBox').size() > 0) return;


	var o = jQuery(obj).parents('.widgetOutput');
	if(o.size() === 0){
		restoreWidgetButtons();
		return;
	}

	obj = o.get(0);
	var widget = o.attr('widget');
	if(!widget) return;

	if(widget == 'widgetBox') {
		restoreWidgetButtons();
		showWidgetButton('widgetBoxButton', obj);
	} else {
		restoreWidgetButtons();
		showWidgetButton('widgetButton', obj);

		var p_obj = obj.parentNode;
		if(p_obj) {
			while(p_obj) {
				if(p_obj.nodeName == 'DIV' && p_obj.getAttribute('widget')=='widgetBox') {
					showWidgetButton('widgetBoxButton', p_obj);
					break;
				}
				p_obj = p_obj.parentNode;
			}
		}
	}
}

/* 위젯 드래그 */
// 드래그 중이라는 상황을 간직할 변수
var widgetDragManager = {obj:null, isDrag:false};
var widgetTmpObject = [];
var widgetDisappear = 0;

function widgetCreateTmpObject(obj) {
	var id = obj.getAttribute('id');
	tmpObj = xCreateElement('DIV');
	tmpObj.id = id + '_tmp';
	tmpObj.className = obj.className;
	tmpObj.style.overflow = 'hidden';
	tmpObj.style.margin= '0px';
	tmpObj.style.padding = '0px';
	tmpObj.style.width = obj.style.width;
	tmpObj.style.display = 'none';
	tmpObj.style.position = 'absolute';
	tmpObj.style.opacity = 1;
	tmpObj.style.filter = 'alpha(opacity=100)';
	xLeft(tmpObj, xPageX(obj));
	xTop(tmpObj, xPageY(obj));
	document.body.appendChild(tmpObj);
	widgetTmpObject[obj.id] = tmpObj;
	return tmpObj;
}

// 기생성된 임시 object를 찾아서 return, 없으면 만들어서 return
var idStep = 0;
function widgetGetTmpObject(obj) {
	if(!obj.id) obj.id = 'widget_'+idStep++;
	var tmpObj = widgetTmpObject[obj.id];
	if(!tmpObj) tmpObj = widgetCreateTmpObject(obj);
	return tmpObj;
}

// 메뉴에 마우스 클릭이 일어난 시점에 드래그를 위한 제일 첫 동작 (해당 object에 각종 함수나 상태변수 설정)
function widgetDragEnable(obj, funcDragStart, funcDrag, funcDragEnd) {
	// 상위 object에 드래그 가능하다는 상태와 각 드래그 관련 함수를 설정
	obj.draggable = true;
	obj.dragStart = funcDragStart;
	obj.drag = funcDrag;
	obj.dragEnd = funcDragEnd;

	// 드래그 가능하지 않다면 드래그 가능하도록 상태 지정하고 mousemove이벤트 등록
	if (!widgetDragManager.isDrag) {
		widgetDragManager.isDrag = true;
		jQuery(document).on('mousemove', widgetDragMouseMove);
	}
}

// 드래그를 시작할때 호출되는 함수 (이동되는 형태를 보여주기 위한 작업을 함)
function widgetDragStart(tobj, px, py) {
	var $tobj = jQuery(tobj);
	if($tobj.hasClass('widgetResize') || $tobj.hasClass('widgetResizeLeft') || $tobj.hasClass('widgetBoxResize') || $tobj.hasClass('widgetBoxResizeLeft')) return;
	var obj = widgetGetTmpObject(tobj);

	xInnerHtml(obj, xInnerHtml(tobj));

	xLeft(obj, xPageX(tobj));
	xTop(obj, xPageY(tobj));
	xWidth(obj, xWidth(tobj));
	xHeight(obj, xHeight(tobj));

	xDisplay(obj, 'block');
}

// 드래그 시작후 마우스를 이동할때 발생되는 이벤트에 의해 실행되는 함수
function widgetDrag(tobj, dx, dy) {
	var $tobj = jQuery(tobj);
	var minWidth = 40;
	var minHeight = 10;

	var sx = xPageX(tobj.parentNode);
	var sy = xPageY(tobj.parentNode);

	var nx = tobj.xDPX;
	var ny = tobj.xDPY;

	var zoneWidth = xWidth(zonePageObj);
	var zoneLeft = xPageX(zonePageObj);
	var zoneRight = zoneLeft + zoneWidth;

	var pWidth = xWidth(tobj.parentNode);

	var cssFloat = getFloat(tobj.parentNode);
	if(!cssFloat) cssFloat = 'left';

	// 위젯 리사이즈 (우측)
	if($tobj.hasClass('widgetResize') || $tobj.hasClass('widgetBoxResize')) {
		if(nx < sx+minWidth) nx = sx+minWidth;
		if(nx > zoneRight) nx = zoneRight;
		if(cssFloat == 'right') nx = sx + pWidth;

		var new_width = nx  - sx;
		if(new_width < minWidth) new_width = minWidth;

		var new_height = ny - sy;
		if(new_height < minHeight) new_height = minHeight;
		if(zoneRight < sx+new_width) new_width = zoneRight - sx;

		xWidth(tobj.parentNode, new_width);
		xHeight(tobj.parentNode, new_height);

	// 위젯 리사이즈 (좌측)
	} else if($tobj.hasClass('widgetResizeLeft') || $tobj.hasClass('widgetBoxResizeLeft')) {
		/*jshint -W004*/
		if(nx < zoneLeft) nx = zoneLeft;
		if(cssFloat == 'left') nx = sx;

		var new_width = pWidth + (sx - nx);
		if(new_width < minWidth) new_width = minWidth;

		var new_height = ny - sy;
		if(new_height < minHeight) new_height = minHeight;

		xWidth(tobj.parentNode, new_width);
		xHeight(tobj.parentNode, new_height);

	// 위젯 드래그
	} else {
		var obj = widgetGetTmpObject(tobj);

		xLeft(obj, parseInt(xPageX(obj),10) + parseInt(dx,10));
		xTop(obj, parseInt(xPageY(obj),10) + parseInt(dy,10));

		// 박스 안에 있을 경우에는 박스내의 위젯하고 자리를 바꾸고 그 외의 경우에는 박스를 빠져 나간다
		if(tobj.parentNode != zonePageObj) {
			// 박스내에 있는 위젯들을 구함
			var widgetList = xGetElementsByClassName("widgetOutput",tobj.parentNode);

			for(var i=0;i<widgetList.length;i++) {
				var target_obj = widgetList[i];
				var l =  xPageX(target_obj);
				var t =  xPageY(target_obj);
				var ll =  parseInt(l,10) + parseInt(xWidth(target_obj),10);
				var tt =  parseInt(t,10) + parseInt(xHeight(target_obj),10);

				if( tobj != target_obj && tobj.xDPX >= l && tobj.xDPX <= ll && tobj.xDPY >= t && tobj.xDPY <= tt && tobj.parentNode == target_obj.parentNode) {
					var next1 = target_obj.nextSibling;
					if(!next1) {
						next1 = xCreateElement("DIV");
						target_obj.parentNode.appendChild(next1);
					}
					var next2 = tobj.nextSibling;
					if(!next2) {
						next2 = xCreateElement("DIV");
						tobj.parentNode.appendChild(next2);
					}

					if(next1) next1.parentNode.insertBefore(tobj, next1);
					if(next2) next2.parentNode.insertBefore(target_obj, next2);
					widgetList = null;
					return;
				}
			}
			widgetList = null;

			// 만약 다른 위젯과 자리를 바꾸지 못하였는데 자기 부모창밖에 있는게 확인이 되면 박스 밖으로 내보낸다.
			var p_tobj = jQuery(tobj).parents('div.nullWidget').get(0);
			var l =  xPageX(p_tobj);
			var t =  xPageY(p_tobj);
			var ll =  parseInt(l,10) + parseInt(xWidth(p_tobj),10);
			var tt =  parseInt(t,10) + parseInt(xHeight(p_tobj),10);
			if( (tobj.xDPX < l || tobj.xDPX > ll) || (tobj.xDPY < t || tobj.xDPY > tt) ) {
				zonePageObj.insertBefore(tobj, jQuery(tobj).parents('div.widgetOutput[widget=widgetBox]').get(0));
				return;
			}

		// 박스 밖에 있을 경우에는 다른 위젯과 자리를 바꾸거나 박스내에 들어가도록 한다
		} else {
			// 이동하려는 위젯이 박스 위젯이 아니라면 박스 위젯들을 구해서 입력 유무를 검사한다
			if(tobj.getAttribute("widget")!="widgetBox") {

				var boxList = xGetElementsByClassName("nullWidget", zonePageObj);
				for(var i=0;i<boxList.length;i++) {
					var target_obj = boxList[i];
					var $target_obj = jQuery(target_obj);

					xHeight(target_obj, xHeight(target_obj.parentNode));
					xWidth(target_obj, xWidth(target_obj.parentNode));

					var l =  xPageX(target_obj);
					var t =  xPageY(target_obj);
					var ll =  parseInt(l,10) + parseInt(xWidth(target_obj),10);
					var tt =  parseInt(t,10) + parseInt(xHeight(target_obj),10);
					if( tobj.xDPX >= l && tobj.xDPX <= ll && tobj.xDPY >= t && tobj.xDPY <= tt) {

						//박스 위젯이다
						if($target_obj.hasClass("nullWidget")) {

							var wb_ws = jQuery('div.widget_inner', $target_obj);

							//박스 위젯에 위젯스타일이 적용 안된경우
							if(wb_ws.size() === 0){
								target_obj.appendChild(tobj);

							//박스 위젯에 위젯스타일이 적용된경우 또는 박스안에 위젯이 위젯스타일이 적용된겅우
							}else{
								wb_ws.get(0).appendChild(tobj);
							}

							// 이동을 멈춤
							widgetManualEnd();

							boxList = null;
							return;
						}
					}
				}
				boxList = null;
			}

			// 다른 위젯들을 구해서 자리를 바꿈
			var widgetList = xGetElementsByClassName("widgetOutput",zonePageObj);
			for(var i=0;i<widgetList.length;i++) {
				var target_obj = widgetList[i];
				var widget = target_obj.getAttribute("widget");
				if(widget == 'widgetBox' || target_obj.parentNode != zonePageObj) continue;
				var l =  xPageX(target_obj);
				var t =  xPageY(target_obj);
				var ll =  parseInt(l,10) + parseInt(xWidth(target_obj),10);
				var tt =  parseInt(t,10) + parseInt(xHeight(target_obj),10);

				if( tobj != target_obj && tobj.xDPX >= l && tobj.xDPX <= ll && tobj.xDPY >= t && tobj.xDPY <= tt && tobj.parentNode == target_obj.parentNode) {
					var next1 = target_obj.nextSibling;
					if(!next1) next1 = target_obj.parentNode.lastChild;
					if(!next1) {
						next1 = xCreateElement("DIV");
						target_obj.parentNode.appendChild(next1);
					}
					var next2 = tobj.nextSibling;
					if(!next2) {
						next2 = xCreateElement("DIV");
						tobj.parentNode.appendChild(next2);
					}

					if(next1) next1.parentNode.insertBefore(tobj, next1);
					if(next2) next2.parentNode.insertBefore(target_obj, next2);
					widgetList = null;
					return;
				}
			}
			widgetList = null;
		}
	}
}

// 드래그 종료 (이동되는 object가 이동할 곳에 서서히 이동되는 것처럼 보이는 효과)
function widgetDragEnd(tobj, px, py) {
	var obj = widgetGetTmpObject(tobj);
	widgetDisapear = widgetDisapearObject(obj, tobj);
	widgetDragDisable(tobj.getAttribute('id'));
}

// 스르르 사라지게 함 (일단 사라지게 하는 기능을 제거.. 속도 문제)
function widgetDisapearObject(obj, tobj) {
	xInnerHtml(tobj,xInnerHtml(obj));
	xInnerHtml(obj,'');
	jQuery(obj).hide();
	obj.parentNode.removeChild(obj);
	widgetTmpObject[tobj.id] = null;
	return;
}

// 마우스다운 이벤트 발생시 호출됨
function widgetMouseDown(e) {
	var obj = e.target;

	while(obj && !obj.draggable) {
		obj = xParent(obj, true);
	}
	if(obj) {
		e.preventDefault();
		obj.xDPX = e.pageX;
		obj.xDPY = e.pageY;
		widgetDragManager.obj = obj;
		jQuery(document).on('mouseup', widgetMouseUp);
		if (obj.dragStart) obj.dragStart(obj, e.pageX, e.pageY);
	}
}

// 마우스 버튼을 놓았을때 동작될 함수 (각종 이벤트 해제 및 변수 설정 초기화)
function widgetMouseUp(e) {
	if (widgetDragManager.obj) {
		e.preventDefault();
		jQuery(document).off('mouseup', widgetMouseUp);

		if (widgetDragManager.obj.dragEnd) {
			widgetDragManager.obj.dragEnd(widgetDragManager.obj, e.pageX, e.pageY);
		}

		widgetDragManager.obj = null;
		widgetDragManager.isDrag = false;
	}
}

// 드래그할때의 object이동등을 담당
function widgetDragMouseMove(e) {
	if(widgetDragManager.obj) {
		e.preventDefault();

		var obj = widgetDragManager.obj;
		var dx = e.pageX - obj.xDPX;
		var dy = e.pageY - obj.xDPY;

		obj.xDPX = e.pageX;
		obj.xDPY = e.pageY;

		if (obj.drag) {
			obj.drag(obj, dx, dy);
		} else {
			xMoveTo(obj, xLeft(obj) + dx, xTop(obj) + dy);
		}
	}
}

// 해당 object 에 더 이상 drag가 되지 않도록 설정
function widgetDragDisable(id) {
	if (!widgetDragManager) return;
	var obj = get_by_id(id);
	obj.draggable = false;
	obj.dragStart = null;
	obj.drag = null;
	obj.dragEnd = null;
	jQuery(obj).off('mousedown', widgetMouseDown);
	return;
}

// 강제로 드래그를 종료시킴
function widgetManualEnd() {
	var tobj = widgetDragManager.obj;
	if(!tobj) return;

	jQuery(document).off('mouseup', widgetMouseUp);
	jQuery(document).on('mousemove', widgetDragMouseMove);

	var obj = widgetGetTmpObject(tobj);
	widgetDisapear = widgetDisapearObject(obj, tobj);
	widgetDragDisable(tobj.getAttribute('id'));

	widgetDragManager.obj = null;
	widgetDragManager.isDrag = false;
}
