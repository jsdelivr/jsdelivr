/*! Copyright (C) NAVER <http://www.navercorp.com> */
/**!
 * @file   common.js + js_app.js + xml_handler.js + xml_js_filter.js
 * @brief  XE Common JavaScript
 **/
/* jQuery 참조변수($) 제거 */
if(jQuery) jQuery.noConflict();

(function($) {
	/* OS check */
	var UA = navigator.userAgent.toLowerCase();
	$.os = {
		Linux: /linux/.test(UA),
		Unix: /x11/.test(UA),
		Mac: /mac/.test(UA),
		Windows: /win/.test(UA)
	};
	$.os.name = ($.os.Windows) ? 'Windows' :
		($.os.Linux) ? 'Linux' :
		($.os.Unix) ? 'Unix' :
		($.os.Mac) ? 'Mac' : '';

	/**
	 * @brief XE 공용 유틸리티 함수
	 * @namespace XE
	 */
	window.XE = {
		loaded_popup_menus : [],
		addedDocument : [],
		/**
		 * @brief 특정 name을 가진 체크박스들의 checked 속성 변경
		 * @param [itemName='cart',][options={}]
		 */
		checkboxToggleAll : function(itemName) {
			if(!is_def(itemName)) itemName='cart';
			var obj;
			var options = {
				wrap : null,
				checked : 'toggle',
				doClick : false
			};

			switch(arguments.length) {
				case 1:
					if(typeof(arguments[0]) == "string") {
						itemName = arguments[0];
					} else {
						$.extend(options, arguments[0] || {});
						itemName = 'cart';
					}
					break;
				case 2:
					itemName = arguments[0];
					$.extend(options, arguments[1] || {});
			}

			if(options.doClick === true) options.checked = null;
			if(typeof(options.wrap) == "string") options.wrap ='#'+options.wrap;

			if(options.wrap) {
				obj = $(options.wrap).find('input[name="'+itemName+'"]:checkbox');
			} else {
				obj = $('input[name="'+itemName+'"]:checkbox');
			}

			if(options.checked == 'toggle') {
				obj.each(function() {
					$(this).attr('checked', ($(this).attr('checked')) ? false : true);
				});
			} else {
				if(options.doClick === true) {
					obj.click();
				} else {
					obj.attr('checked', options.checked);
				}
			}
		},

		/**
		 * @brief 문서/회원 등 팝업 메뉴 출력
		 */
		displayPopupMenu : function(ret_obj, response_tags, params) {
			var target_srl = params.target_srl;
			var menu_id = params.menu_id;
			var menus = ret_obj.menus;
			var html = "";

			if(this.loaded_popup_menus[menu_id]) {
				html = this.loaded_popup_menus[menu_id];

			} else {
				if(menus) {
					var item = menus.item;
					if(typeof(item.length)=='undefined' || item.length<1) item = new Array(item);
					if(item.length) {
						for(var i=0;i<item.length;i++) {
							var url = item[i].url;
							var str = item[i].str;
							var icon = item[i].icon;
							var target = item[i].target;

							var styleText = "";
							var click_str = "";
							/* if(icon) styleText = " style=\"background-image:url('"+icon+"')\" "; */
							switch(target) {
								case "popup" :
										click_str = 'onclick="popopen(this.href, \''+target+'\'); return false;"';
									break;
								case "javascript" :
										click_str = 'onclick="'+url+'; return false; "';
										url='#';
									break;
								default :
										click_str = 'target="_blank"';
									break;
							}

							html += '<li '+styleText+'><a href="'+url+'" '+click_str+'>'+str+'</a></li> ';
						}
					}
				}
				this.loaded_popup_menus[menu_id] =  html;
			}

			/* 레이어 출력 */
			if(html) {
				var area = $('#popup_menu_area').html('<ul>'+html+'</ul>');
				var areaOffset = {top:params.page_y, left:params.page_x};

				if(area.outerHeight()+areaOffset.top > $(window).height()+$(window).scrollTop())
					areaOffset.top = $(window).height() - area.outerHeight() + $(window).scrollTop();
				if(area.outerWidth()+areaOffset.left > $(window).width()+$(window).scrollLeft())
					areaOffset.left = $(window).width() - area.outerWidth() + $(window).scrollLeft();

				area.css({ top:areaOffset.top, left:areaOffset.left }).show().focus();
			}
		}
	};
}) (jQuery);



/* jQuery(document).ready() */
jQuery(function($) {

	/* select - option의 disabled=disabled 속성을 IE에서도 체크하기 위한 함수 */
	if($.browser.msie) {
		$('select').each(function(i, sels) {
			var disabled_exists = false;
			var first_enable = [];

			for(var j=0; j < sels.options.length; j++) {
				if(sels.options[j].disabled) {
					sels.options[j].style.color = '#CCCCCC';
					disabled_exists = true;
				}else{
					first_enable[i] = (first_enable[i] > -1) ? first_enable[i] : j;
				}
			}

			if(!disabled_exists) return;

			sels.oldonchange = sels.onchange;
			sels.onchange = function() {
				if(this.options[this.selectedIndex].disabled) {

					this.selectedIndex = first_enable[i];
					/*
					if(this.options.length<=1) this.selectedIndex = -1;
					else if(this.selectedIndex < this.options.length - 1) this.selectedIndex++;
					else this.selectedIndex--;
					*/

				} else {
					if(this.oldonchange) this.oldonchange();
				}
			};

			if(sels.selectedIndex >= 0 && sels.options[ sels.selectedIndex ].disabled) sels.onchange();

		});
	}

	/* 단락에디터 fold 컴포넌트 펼치기/접기 */
	var drEditorFold = $('.xe_content .fold_button');
	if(drEditorFold.size()) {
		var fold_container = $('div.fold_container', drEditorFold);
		$('button.more', drEditorFold).click(function() {
			$(this).hide().next('button').show().parent().next(fold_container).show();
		});
		$('button.less', drEditorFold).click(function() {
			$(this).hide().prev('button').show().parent().next(fold_container).hide();
		});
	}

	jQuery('input[type="submit"],button[type="submit"]').click(function(ev){
		var $el = jQuery(ev.currentTarget);

		setTimeout(function(){
			return function(){
				$el.attr('disabled', 'disabled');
			};
		}(), 0);

		setTimeout(function(){
			return function(){
				$el.removeAttr('disabled');
			};
		}(), 3000);
	});
});

(function(){ // String extension methods
	function isSameUrl(a,b) {
		return (a.replace(/#.*$/, '') === b.replace(/#.*$/, ''));
	}
	var isArray = Array.isArray || function(obj){ return Object.prototype.toString.call(obj)=='[object Array]'; };

	/**
	 * @brief location.href에서 특정 key의 값을 return
	 **/
	String.prototype.getQuery = function(key) {
		var loc = isSameUrl(this, window.location.href) ? current_url : this;
		var idx = loc.indexOf('?');
		if(idx == -1) return null;
		var query_string = loc.substr(idx+1, this.length), args = {};
		query_string.replace(/([^=]+)=([^&]*)(&|$)/g, function() { args[arguments[1]] = arguments[2]; });

		var q = args[key];
		if(typeof(q)=='undefined') q = '';

		return q;
	};

	/**
	 * @brief location.href에서 특정 key의 값을 return
	 **/
	String.prototype.setQuery = function(key, val) {
		var loc = isSameUrl(this, window.location.href) ? current_url : this;
		var idx = loc.indexOf('?');
		var uri = loc.replace(/#$/, '');
		var act, re, v, toReplace;

		if (typeof(val)=='undefined') val = '';

		if (idx != -1) {
			var query_string = uri.substr(idx+1, loc.length), args = {}, q_list = [];
			uri = loc.substr(0, idx);
			query_string.replace(/([^=]+)=([^&]*)(&|$)/g, function(all,key,val) { args[key] = val; });

			args[key] = val;

			for (var prop in args) {
				if (!args.hasOwnProperty(prop)) continue;
				if (!(v = String(args[prop]).trim())) continue;
				q_list.push(prop+'='+decodeURI(v));
			}

			query_string = q_list.join('&');
			uri = uri+(query_string?'?'+query_string:'');
		} else {
			if (String(val).trim()) uri = uri+'?'+key+'='+val;
		}

		re = /^https:\/\/([^:\/]+)(:\d+|)/i;
		if (re.test(uri)) {
			toReplace = 'http://'+RegExp.$1;
			if (window.http_port && http_port != 80) toReplace += ':' + http_port;
			uri = uri.replace(re, toReplace);
		}

		var bUseSSL = !!window.enforce_ssl;
		if (!bUseSSL && isArray(window.ssl_actions) && (act=uri.getQuery('act'))) {
			for (var i=0,c=ssl_actions.length; i < c; i++) {
				if (ssl_actions[i] === act) {
					bUseSSL = true;
					break;
				}
			}
		}

		re = /http:\/\/([^:\/]+)(:\d+|)/i;
		if (bUseSSL && re.test(uri)) {
			toReplace = 'https://'+RegExp.$1;
			if (window.https_port && https_port != 443) toReplace += ':' + https_port;
			uri = uri.replace(re, toReplace);
		}

		// insert index.php if it isn't included
		uri = uri.replace(/\/(index\.php)?\?/, '/index.php?');

		return encodeURI(uri);
	};

	/**
	 * @brief string prototype으로 trim 함수 추가
	 **/
	String.prototype.trim = function() {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	};

})();

/**
 * @brief xSleep(micro time)
 **/
function xSleep(sec) {
	sec = sec / 1000;
	var now = new Date();
	var sleep = new Date();
	while( sleep.getTime() - now.getTime() < sec) {
		sleep = new Date();
	}
}

/**
 * @brief 주어진 인자가 하나라도 defined되어 있지 않으면 false return
 **/
function isDef() {
	for(var i=0; i < arguments.length; ++i) {
		if(typeof(arguments[i]) == "undefined") return false;
	}
	return true;
}

/**
 * @brief 윈도우 오픈
 * 열려진 윈도우의 관리를 통해 window.focus()등을 FF에서도 비슷하게 구현함
 **/
var winopen_list = [];
function winopen(url, target, attribute) {
	if(typeof(xeVid)!='undefined' && url.indexOf(request_uri)>-1 && !url.getQuery('vid')) url = url.setQuery('vid',xeVid);
	try {
		if(target != "_blank" && winopen_list[target]) {
			winopen_list[target].close();
			winopen_list[target] = null;
		}
	} catch(e) {
	}

	if(typeof(target) == 'undefined') target = '_blank';
	if(typeof(attribute) == 'undefined') attribute = '';
	var win = window.open(url, target, attribute);
	win.focus();
	if(target != "_blank") winopen_list[target] = win;
}

/**
 * @brief 팝업으로만 띄우기
 * common/tpl/popup_layout.html이 요청되는 XE내의 팝업일 경우에 사용
 **/
function popopen(url, target) {
	if(typeof(target) == "undefined") target = "_blank";
	if(typeof(xeVid)!='undefined' && url.indexOf(request_uri)>-1 && !url.getQuery('vid')) url = url.setQuery('vid',xeVid);
	winopen(url, target, "width=800,height=600,scrollbars=yes,resizable=yes,toolbars=no");
}

/**
 * @brief 메일 보내기용
 **/
function sendMailTo(to) {
	location.href="mailto:"+to;
}

/**
 * @brief url이동 (open_window 값이 N 가 아니면 새창으로 띄움)
 **/
function move_url(url, open_window) {
	if(!url) return false;
	if(typeof(open_window) == 'undefined') open_window = 'N';
	if(open_window=='N') {
		open_window = false;
	} else {
		open_window = true;
	}

	if(/^\./.test(url)) url = request_uri+url;

	if(open_window) {
		winopen(url);
	} else {
		location.href=url;
	}

	return false;
}

/**
 * @brief 멀티미디어 출력용 (IE에서 플래쉬/동영상 주변에 점선 생김 방지용)
 **/
function displayMultimedia(src, width, height, options) {
	/*jslint evil: true */
	var html = _displayMultimedia(src, width, height, options);
	if(html) document.writeln(html);
}
function _displayMultimedia(src, width, height, options) {
	if(src.indexOf('files') === 0) src = request_uri + src;

	var defaults = {
		wmode : 'transparent',
		allowScriptAccess : 'never',
		quality : 'high',
		flashvars : '',
		autostart : false
	};

	var params = jQuery.extend(defaults, options || {});
	var autostart = (params.autostart && params.autostart != 'false') ? 'true' : 'false';
	delete(params.autostart);

	var clsid = "";
	var codebase = "";
	var html = "";

	if(/\.(gif|jpg|jpeg|bmp|png)$/i.test(src)){
		html = '<img src="'+src+'" width="'+width+'" height="'+height+'" />';
	} else if(/\.flv$/i.test(src) || /\.mov$/i.test(src) || /\.moov$/i.test(src) || /\.m4v$/i.test(src)) {
		html = '<embed src="'+request_uri+'common/img/flvplayer.swf" allowfullscreen="true" autostart="'+autostart+'" width="'+width+'" height="'+height+'" flashvars="&file='+src+'&width='+width+'&height='+height+'&autostart='+autostart+'" wmode="'+params.wmode+'" />';
	} else if(/\.swf/i.test(src)) {
		clsid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';

		if(typeof(enforce_ssl)!='undefined' && enforce_ssl){ codebase = "https://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0"; }
		else { codebase = "http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0"; }
		html = '<object classid="'+clsid+'" codebase="'+codebase+'" width="'+width+'" height="'+height+'" flashvars="'+params.flashvars+'">';
		html += '<param name="movie" value="'+src+'" />';
		for(var name in params) {
			if(params[name] != 'undefined' && params[name] !== '') {
				html += '<param name="'+name+'" value="'+params[name]+'" />';
			}
		}
		html += '' + '<embed src="'+src+'" autostart="'+autostart+'"  width="'+width+'" height="'+height+'" flashvars="'+params.flashvars+'" wmode="'+params.wmode+'"></embed>' + '</object>';
	}  else {
		if (jQuery.browser.mozilla || jQuery.browser.opera) {
			// firefox and opera uses 0 or 1 for autostart parameter.
			autostart = (params.autostart && params.autostart != 'false') ? '1' : '0';
		}

		html = '<embed src="'+src+'" autostart="'+autostart+'" width="'+width+'" height="'+height+'"';
		if(params.wmode == 'transparent') {
			html += ' windowlessvideo="1"';
		}
		html += '></embed>';
	}
	return html;
}

/**
 * @brief 에디터에서 사용되는 내용 여닫는 코드 (고정, zbxe용)
 **/
function zbxe_folder_open(id) {
	jQuery("#folder_open_"+id).hide();
	jQuery("#folder_close_"+id).show();
	jQuery("#folder_"+id).show();
}
function zbxe_folder_close(id) {
	jQuery("#folder_open_"+id).show();
	jQuery("#folder_close_"+id).hide();
	jQuery("#folder_"+id).hide();
}

/**
 * @brief 팝업의 경우 내용에 맞춰 현 윈도우의 크기를 조절해줌
 * 팝업의 내용에 맞게 크기를 늘리는 것은... 쉽게 되지는 않음.. ㅡ.ㅜ
 * popup_layout 에서 window.onload 시 자동 요청됨.
 **/
function setFixedPopupSize() {
	var $ = jQuery, $win = $(window), $pc = $('body>.popup'), w, h, dw, dh, offset;

	offset = $pc.css({overflow:'scroll'}).offset();

	w = $pc.width(10).height(10000).get(0).scrollWidth + offset.left*2;
	h = $pc.height(10).width(10000).get(0).scrollHeight + offset.top*2;

	if(w < 800) w = 800 + offset.left*2;

	dw = $win.width();
	dh = $win.height();

	if(w != dw) window.resizeBy(w - dw, 0);
	if(h != dh) window.resizeBy(0, h - dh);

	$pc.width(w-offset.left*2).css({overflow:'',height:''});
}

/**
 * @brief 추천/비추천,스크랩,신고기능등 특정 srl에 대한 특정 module/action을 호출하는 함수
 **/
function doCallModuleAction(module, action, target_srl) {
	var params = {
		target_srl : target_srl,
		cur_mid    : current_mid,
		mid        : current_mid
	};
	exec_xml(module, action, params, completeCallModuleAction);
}

function completeCallModuleAction(ret_obj, response_tags) {
	if(ret_obj.message!='success') alert(ret_obj.message);
	location.reload();
}

function completeMessage(ret_obj) {
	alert(ret_obj.message);
	location.reload();
}



/* 언어코드 (lang_type) 쿠키값 변경 */
function doChangeLangType(obj) {
	if(typeof(obj) == "string") {
		setLangType(obj);
	} else {
		var val = obj.options[obj.selectedIndex].value;
		setLangType(val);
	}
	location.href = location.href.setQuery('l', '');
}
function setLangType(lang_type) {
	var expire = new Date();
	expire.setTime(expire.getTime()+ (7000 * 24 * 3600000));
	setCookie('lang_type', lang_type, expire, '/');
}

/* 미리보기 */
function doDocumentPreview(obj) {
	var fo_obj = obj;
	while(fo_obj.nodeName != "FORM") {
		fo_obj = fo_obj.parentNode;
	}
	if(fo_obj.nodeName != "FORM") return;
	var editor_sequence = fo_obj.getAttribute('editor_sequence');

	var content = editorGetContent(editor_sequence);

	var win = window.open("", "previewDocument","toolbars=no,width=700px;height=800px,scrollbars=yes,resizable=yes");

	var dummy_obj = jQuery("#previewDocument");

	if(!dummy_obj.length) {
		jQuery(
			'<form id="previewDocument" target="previewDocument" method="post" action="'+request_uri+'">'+
			'<input type="hidden" name="module" value="document" />'+
			'<input type="hidden" name="act" value="dispDocumentPreview" />'+
			'<input type="hidden" name="content" />'+
			'</form>'
		).appendTo(document.body);

		dummy_obj = jQuery("#previewDocument")[0];
	} else {
		dummy_obj = dummy_obj[0];
	}

	if(dummy_obj) {
		dummy_obj.content.value = content;
		dummy_obj.submit();
	}
}

/* 게시글 저장 */
function doDocumentSave(obj) {
	var editor_sequence = obj.form.getAttribute('editor_sequence');
	var prev_content = editorRelKeys[editor_sequence].content.value;
	if(typeof(editor_sequence)!='undefined' && editor_sequence && typeof(editorRelKeys)!='undefined' && typeof(editorGetContent)=='function') {
		var content = editorGetContent(editor_sequence);
		editorRelKeys[editor_sequence].content.value = content;
	}

	var params={}, responses=['error','message','document_srl'], elms=obj.form.elements, data=jQuery(obj.form).serializeArray();
	jQuery.each(data, function(i, field){
		var val = jQuery.trim(field.value);
		if(!val) return true;
		if(/\[\]$/.test(field.name)) field.name = field.name.replace(/\[\]$/, '');
		if(params[field.name]) params[field.name] += '|@|'+val;
		else params[field.name] = field.value;
	});

	exec_xml('document','procDocumentTempSave', params, completeDocumentSave, responses, params, obj.form);

	editorRelKeys[editor_sequence].content.value = prev_content;
	return false;
}

function completeDocumentSave(ret_obj) {
	jQuery('input[name=document_srl]').eq(0).val(ret_obj.document_srl);
	alert(ret_obj.message);
}

/* 저장된 게시글 불러오기 */
var objForSavedDoc = null;
function doDocumentLoad(obj) {
	// 저장된 게시글 목록 불러오기
	objForSavedDoc = obj.form;
	popopen(request_uri.setQuery('module','document').setQuery('act','dispTempSavedList'));
}

/* 저장된 게시글의 선택 */
function doDocumentSelect(document_srl) {
	if(!opener || !opener.objForSavedDoc) {
		window.close();
		return;
	}

	// 게시글을 가져와서 등록하기
	opener.location.href = opener.current_url.setQuery('document_srl', document_srl).setQuery('act', 'dispBoardWrite');
	window.close();
}


/* 스킨 정보 */
function viewSkinInfo(module, skin) {
	popopen("./?module=module&act=dispModuleSkinInfo&selected_module="+module+"&skin="+skin, 'SkinInfo');
}


/* 관리자가 문서를 관리하기 위해서 선택시 세션에 넣음 */
var addedDocument = [];
function doAddDocumentCart(obj) {
	var srl = obj.value;
	addedDocument[addedDocument.length] = srl;
	setTimeout(function() { callAddDocumentCart(addedDocument.length); }, 100);
}

function callAddDocumentCart(document_length) {
	if(addedDocument.length<1 || document_length != addedDocument.length) return;
	var params = [];
	params.srls = addedDocument.join(",");
	exec_xml("document","procDocumentAddCart", params, null);
	addedDocument = [];
}

/* ff의 rgb(a,b,c)를 #... 로 변경 */
function transRGB2Hex(value) {
	if(!value) return value;
	if(value.indexOf('#') > -1) return value.replace(/^#/, '');

	if(value.toLowerCase().indexOf('rgb') < 0) return value;
	value = value.replace(/^rgb\(/i, '').replace(/\)$/, '');
	value_list = value.split(',');

	var hex = '';
	for(var i = 0; i < value_list.length; i++) {
		var color = parseInt(value_list[i], 10).toString(16);
		if(color.length == 1) color = '0'+color;
		hex += color;
	}
	return hex;
}

/* 보안 로그인 모드로 전환 */
function toggleSecuritySignIn() {
	var href = location.href;
	if(/https:\/\//i.test(href)) location.href = href.replace(/^https/i,'http');
	else location.href = href.replace(/^http/i,'https');
}

function reloadDocument() {
	location.reload();
}


/**
*
* Base64 encode / decode
* http://www.webtoolkit.info/
*
**/

var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = 0, c1 = 0, c2 = 0, c3 = 0;

		while ( i < utftext.length ) {
			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}

		return string;
	}
};






/* ----------------------------------------------
 * DEPRECATED
 * 하위호환용으로 남겨 놓음
 * ------------------------------------------- */

if(typeof(resizeImageContents) == 'undefined') {
	window.resizeImageContents = function() {};
}

if(typeof(activateOptionDisabled) == 'undefined') {
	window.activateOptionDisabled = function() {};
}

objectExtend = jQuery.extend;

/**
 * @brief 특정 Element의 display 옵션 토글
 **/
function toggleDisplay(objId) {
	jQuery('#'+objId).toggle();
}

/**
 * @brief 에디터에서 사용하되 내용 여닫는 코드 (zb5beta beta 호환용으로 남겨 놓음)
 **/
function svc_folder_open(id) {
	jQuery("#_folder_open_"+id).hide();
	jQuery("#_folder_close_"+id).show();
	jQuery("#_folder_"+id).show();
}
function svc_folder_close(id) {
	jQuery("#_folder_open_"+id).show();
	jQuery("#_folder_close_"+id).hide();
	jQuery("#_folder_"+id).hide();
}

/**
 * @brief 날짜 선택 (달력 열기)
 **/
function open_calendar(fo_id, day_str, callback_func) {
	if(typeof(day_str)=="undefined") day_str = "";

	var url = "./common/tpl/calendar.php?";
	if(fo_id) url+="fo_id="+fo_id;
	if(day_str) url+="&day_str="+day_str;
	if(callback_func) url+="&callback_func="+callback_func;

	popopen(url, 'Calendar');
}

var loaded_popup_menus = XE.loaded_popup_menus;
function createPopupMenu() {}
function chkPopupMenu() {}
function displayPopupMenu(ret_obj, response_tags, params) {
	XE.displayPopupMenu(ret_obj, response_tags, params);
}

function GetObjLeft(obj) {
	return jQuery(obj).offset().left;
}
function GetObjTop(obj) {
	return jQuery(obj).offset().top;
}

function replaceOuterHTML(obj, html) {
	jQuery(obj).replaceWith(html);
}

function getOuterHTML(obj) {
	return jQuery(obj).html().trim();
}

function setCookie(name, value, expire, path) {
	var s_cookie = name + "=" + escape(value) +
		((!expire) ? "" : ("; expires=" + expire.toGMTString())) +
		"; path=" + ((!path) ? "/" : path);

	document.cookie = s_cookie;
}

function getCookie(name) {
	var match = document.cookie.match(new RegExp(name+'=(.*?)(?:;|$)'));
	if(match) return unescape(match[1]);
}

function is_def(v) {
	return (typeof(v)!='undefined');
}

function ucfirst(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function get_by_id(id) {
	return document.getElementById(id);
}

jQuery(function($){
	// display popup menu that contains member actions and document actions
	$(document).click(function(evt) {
		var $area = $('#popup_menu_area');
		if(!$area.length) $area = $('<div id="popup_menu_area" tabindex="0" style="display:none;z-index:9999" />').appendTo(document.body);

		// 이전에 호출되었을지 모르는 팝업메뉴 숨김
		$area.hide();

		var $target = $(evt.target).filter('a,div,span');
		if(!$target.length) $target = $(evt.target).closest('a,div,span');
		if(!$target.length) return;

		// 객체의 className값을 구함
		var cls = $target.attr('class'), match;
		if(cls) match = cls.match(new RegExp('(?:^| )((document|comment|member)_([1-9]\\d*))(?: |$)',''));
		if(!match) return;

		var action = 'get'+ucfirst(match[2])+'Menu';
		var params = {
			mid        : current_mid,
			cur_mid    : current_mid,
			menu_id    : match[1],
			target_srl : match[3],
			cur_act    : current_url.getQuery('act'),
			page_x     : evt.pageX,
			page_y     : evt.pageY
		};
		var response_tags = 'error message menus'.split(' ');

		// prevent default action
		evt.preventDefault();
		evt.stopPropagation();

		if(is_def(window.xeVid)) params.vid = xeVid;
		if(is_def(XE.loaded_popup_menus[params.menu_id])) return XE.displayPopupMenu(params, response_tags, params);

		show_waiting_message = false;
		exec_xml('member', action, params, XE.displayPopupMenu, response_tags, params);
		show_waiting_message = true;
	});

	/**
	 * Create popup windows automatically.
	 * Find anchors that have the '_xe_popup' class, then add popup script to them.
	 */
	$('a._xe_popup').click(function(){
		var $this = $(this), name = $this.attr('name'), href = $this.attr('href'), win;

		if(!name) name = '_xe_popup_'+Math.floor(Math.random()*1000);

		win = window.open(href, name, 'left=10,top=10,width=10,height=10,resizable=no,scrollbars=no,toolbars=no');
		if(win) win.focus();

		// cancel default action
		return false;
	});

	// date picker default settings
	if($.datepicker) {
		$.datepicker.setDefaults({
			dateFormat : 'yy-mm-dd'
		});
	}
});

(function($){
	var _xe_base, _app_base, _plugin_base;
	var _apps = [];

	_xe_base = {
		/**
		 * @brief return the name of Core module
		 */
		getName : function() {
			return 'Core';
		},

		/**
		 * @brief Create an application class
		 */
		createApp : function(sName, oDef) {
			var _base = getTypeBase();

			$.extend(_base.prototype, _app_base, oDef);

			_base.prototype.getName = function() {
				return sName;
			};

			return _base;
		},

		/**
		 * @brief Create a plugin class
		 */
		createPlugin : function(sName, oDef) {
			var _base = getTypeBase();

			$.extend(_base.prototype, _plugin_base, oDef);

			_base.prototype.getName = function() {
				return sName;
			};

			return _base;
		},

		/**
		 * @brief Get the array of applications
		 */
		getApps : function() {
			return $.makeArray(_apps);
		},

		/**
		 * @brief Get one application
		 */
		getApp : function(indexOrName) {
			indexOrName = (indexOrName||'').toLowerCase();
			if(typeof _apps[indexOrName] != 'undefined') {
				return _apps[indexOrName];
			} else {
				return null;
			}
		},

		/**
		 * @brief Register an application instance
		 */
		registerApp : function(oApp) {
			var sName = oApp.getName().toLowerCase();

			_apps.push(oApp);
			if (!$.isArray(_apps[sName])) {
				_apps[sName] = [];
			}
			_apps[sName].push(oApp);

			oApp.parent = this;

			// register event
			if ($.isFunction(oApp.activate)) oApp.activate();
		},

		/**
		 * @brief Unregister an application instance
		 */
		unregisterApp : function(oApp) {
			var sName  = oApp.getName().toLowerCase();
			var nIndex = $.inArray(oApp, _apps);

			if (nIndex >= 0) _apps = _apps.splice(nIndex, 1);

			if ($.isArray(_apps[sName])) {
				nIndex = $.inArray(oApp, _apps[sName]);
				if (nIndex >= 0) _apps[sName] = _apps[sName].splice(nIndex, 1);
			}

			// unregister event
			if ($.isFunction(oApp.deactivate)) oApp.deactivate();
		},

		/**
		 * @brief overrides broadcast method
		 */
		broadcast : function(msg, params) {
			this._broadcast(this, msg, params);
		},

		_broadcast : function(sender, msg, params) {
			for(var i=0; i < _apps.length; i++) {
				_apps[i]._cast(sender, msg, params);
			}


			// cast to child plugins
			this._cast(sender, msg, params);
		}
	};

	_app_base = {
		_plugins  : [],
		_messages : {},

		/**
		 * @brief get plugin
		 */
		getPlugin : function(sPluginName) {
			sPluginName = sPluginName.toLowerCase();
			if ($.isArray(this._plugins[sPluginName])) {
				return this._plugins[sPluginName];
			} else {
				return [];
			}
		},

		/**
		 * @brief register a plugin instance
		 */
		registerPlugin : function(oPlugin) {
			var self  = this;
			var sName = oPlugin.getName().toLowerCase();

			// check if the plugin is already registered
			if ($.inArray(oPlugin, this._plugins) >= 0) return false;

			// push the plugin into the _plugins array
			this._plugins.push(oPlugin);

			if (!$.isArray(this._plugins[sName])) this._plugins[sName] = [];
			this._plugins[sName].push(oPlugin);

			// register method pool
			$.each(oPlugin._binded_fn, function(api, fn){ self.registerHandler(api, fn); });

			// binding
			oPlugin.oApp = this;

			// registered event
			if ($.isFunction(oPlugin.activate)) oPlugin.activate();

			return true;
		},

		/**
		 * @brief register api message handler
		 */
		registerHandler : function(api, func) {
			var msgs = this._messages; api = api.toUpperCase();
			if (!$.isArray(msgs[api])) msgs[api] = [];
			msgs[api].push(func);
		},

		cast : function(msg, params) {
			return this._cast(this, msg, params || []);
		},

		broadcast : function(sender, msg, params) {
			if (this.parent && this.parent._broadcast) {
				this.parent._broadcast(sender, msg, params);
			}
		},

		_cast : function(sender, msg, params) {
			var i, len;
			var aMsg = this._messages;

			msg = msg.toUpperCase();

			// BEFORE hooker
			if (aMsg['BEFORE_'+msg] || this['API_BEFORE_'+msg]) {
				var bContinue = this._cast(sender, 'BEFORE_'+msg, params);
				if (!bContinue) return;
			}

			// main api function
			var vRet = [], sFn = 'API_'+msg;
			if ($.isArray(aMsg[msg])) {
				for(i=0; i < aMsg[msg].length; i++) {
					vRet.push( aMsg[msg][i](sender, params) );
				}
			}
			if (vRet.length < 2) vRet = vRet[0];

			// AFTER hooker
			if (aMsg['AFTER_'+msg] || this['API_AFTER_'+msg]) {
				this._cast(sender, 'AFTER_'+msg, params);
			}

			if (!/^(?:AFTER|BEFORE)_/.test(msg)) { // top level function
				return vRet;
			} else {
				return $.isArray(vRet)?($.inArray(false, vRet)<0):((typeof vRet=='undefined')?true:!!vRet);
			}
		}
	};

	_plugin_base = {
		oApp : null,

		cast : function(msg, params) {
			if (this.oApp && this.oApp._cast) {
				return this.oApp._cast(this, msg, params || []);
			}
		},

		broadcast : function(msg, params) {
			if (this.oApp && this.oApp.broadcast) {
				this.oApp.broadcast(this, mag, params || []);
			}
		}
	};

	function getTypeBase() {
		var _base = function() {
			var self = this;
			var pool = null;

			if ($.isArray(this._plugins)) this._plugins   = [];
			if (this._messages) this._messages = {};
			else this._binded_fn = {};

			// bind functions
			$.each(this, function(key, val){
				if (!$.isFunction(val)) return true;
				if (!/^API_([A-Z0-9_]+)$/.test(key)) return true;

				var api = RegExp.$1;
				var fn  = function(sender, params){ return self[key](sender, params); };

				if (self._messages) self._messages[api] = [fn];
				else self._binded_fn[api] = fn;
			});

			if ($.isFunction(this.init)) this.init.apply(this, arguments);
		};

		return _base;
	}

	window.xe = $.extend(_app_base, _xe_base);
	window.xe.lang = {}; // language repository

	// domready event
	$(function(){ xe.broadcast('ONREADY'); });

	// load event
	$(window).load(function(){ xe.broadcast('ONLOAD'); });
})(jQuery);

// xml handler을 이용하는 user function
var show_waiting_message = true;

/**
 * This work is licensed under Creative Commons GNU LGPL License.
 * License: http://creativecommons.org/licenses/LGPL/2.1/
 * Version: 0.9
 * Author:  Stefan Goessner/2006
 * Web:     http://goessner.net/
 **/
function xml2json(xml, tab, ignoreAttrib) {
	var X = {
		toObj: function(xml) {
			var o = {};
			if (xml.nodeType==1) { // element node ..
				if (ignoreAttrib && xml.attributes.length) { // element with attributes  ..
					for (var i=0; i<xml.attributes.length; i++) {
						o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
					}
				}

				if (xml.firstChild) { // element has child nodes ..
					var textChild=0, cdataChild=0, hasElementChild=false;
					for (var n=xml.firstChild; n; n=n.nextSibling) {
						if (n.nodeType==1) {
							hasElementChild = true;
						} else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) {
							textChild++; // non-whitespace text
						}else if (n.nodeType==4) {
							cdataChild++; // cdata section node
						}
					}
					if (hasElementChild) {
						if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
							X.removeWhite(xml);
							for (var n1=xml.firstChild; n1; n1=n1.nextSibling) {
								if (n1.nodeType == 3) { // text node
									o = X.escape(n1.nodeValue);
								} else if (n1.nodeType == 4) { // cdata node
									// o["#cdata"] = X.escape(n.nodeValue);
									o = X.escape(n1.nodeValue);
								} else if (o[n1.nodeName]) { // multiple occurence of element ..
									if (o[n1.nodeName] instanceof Array) {
										o[n1.nodeName][o[n1.nodeName].length] = X.toObj(n1);
									} else {
										o[n1.nodeName] = [o[n1.nodeName], X.toObj(n1)];
									}
								} else { // first occurence of element..
									o[n1.nodeName] = X.toObj(n1);
								}
							}
						}
						else { // mixed content
							if (!xml.attributes.length) {
								o = X.escape(X.innerXml(xml));
							} else {
								o["#text"] = X.escape(X.innerXml(xml));
							}
						}
					} else if (textChild) { // pure text
						if (!xml.attributes.length) {
							o = X.escape(X.innerXml(xml));
						} else {
							o["#text"] = X.escape(X.innerXml(xml));
						}
					} else if (cdataChild) { // cdata
						if (cdataChild > 1) {
							o = X.escape(X.innerXml(xml));
						} else {
							for (var n2=xml.firstChild; n2; n2=n2.nextSibling) {
								// o["#cdata"] = X.escape(n2.nodeValue);
								o = X.escape(n2.nodeValue);
							}
						}
					}
				}

				if (!xml.attributes.length && !xml.firstChild) {
					o = null;
				}
			} else if (xml.nodeType==9) { // document.node
				o = X.toObj(xml.documentElement);
			} else {
				alert("unhandled node type: " + xml.nodeType);
			}

			return o;
		},
		toJson: function(o, name, ind) {
			var json = name ? ("\""+name+"\"") : "";
			if (o instanceof Array) {
				for (var i=0,n=o.length; i<n; i++) {
					o[i] = X.toJson(o[i], "", ind+"\t");
				}
				json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
			} else if (o === null) {
				json += (name&&":") + "null";
			} else if (typeof(o) == "object") {
				var arr = [];
				for (var m in o) {
					arr[arr.length] = X.toJson(o[m], m, ind+"\t");
				}
				json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
			} else if (typeof(o) == "string") {
				json += (name&&":") + "\"" + o.toString() + "\"";
			} else {
				json += (name&&":") + o.toString();
			}
			return json;
		},
		innerXml: function(node) {
			var s = "";

			if ("innerHTML" in node) {
				s = node.innerHTML;
			} else {
				var asXml = function(n) {
					var s = "";
					if (n.nodeType == 1) {
						s += "<" + n.nodeName;
						for (var i=0; i<n.attributes.length;i++) {
							s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
						}
						if (n.firstChild) {
							s += ">";
							for (var c=n.firstChild; c; c=c.nextSibling) {
								s += asXml(c);
							}
							s += "</"+n.nodeName+">";
						} else {
							s += "/>";
						}
					} else if (n.nodeType == 3) {
						s += n.nodeValue;
					} else if (n.nodeType == 4) {
						s += "<![CDATA[" + n.nodeValue + "]]>";
					}

					return s;
				};

				for (var c=node.firstChild; c; c=c.nextSibling) {
					s += asXml(c);
				}
			}
			return s;
		},
		escape: function(txt) {
			return txt.replace(/[\\]/g, "\\\\")
				.replace(/[\"]/g, '\\"')
				.replace(/[\n]/g, '\\n')
				.replace(/[\r]/g, '\\r');
		},
		removeWhite: function(e) {
			e.normalize();
			for (var n3 = e.firstChild; n3; ) {
				if (n3.nodeType == 3) { // text node
					if (!n3.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
						var nxt = n3.nextSibling;
						e.removeChild(n3);
						n3 = nxt;
					} else {
						n3 = n3.nextSibling;
					}
				} else if (n3.nodeType == 1) { // element node
					X.removeWhite(n3);
					n3 = n3.nextSibling;
				} else { // any other node
					n3 = n3.nextSibling;
				}
			}
			return e;
		}
	};

	// document node
	if (xml.nodeType == 9) xml = xml.documentElement;

	var json_obj = X.toObj(X.removeWhite(xml)), json_str;

	if (typeof(JSON)=='object' && jQuery.isFunction(JSON.stringify) && false) {
		var obj = {}; obj[xml.nodeName] = json_obj;
		json_str = JSON.stringify(obj);

		return json_str;
	} else {
		json_str = X.toJson(json_obj, xml.nodeName, "");

		return "{" + (tab ? json_str.replace(/\t/g, tab) : json_str.replace(/\t|\n/g, "")) + "}";
	}
}

(function($){
	/**
	* @brief exec_xml
	* @author NAVER (developers@xpressengine.com)
	**/
	$.exec_xml = window.exec_xml = function(module, act, params, callback_func, response_tags, callback_func_arg, fo_obj) {
		var xml_path = request_uri+"index.php";
		if(!params) params = {};

		// {{{ set parameters
		if($.isArray(params)) params = arr2obj(params);
		params.module = module;
		params.act    = act;

		if(typeof(xeVid)!='undefined') params.vid = xeVid;
		if(typeof(response_tags) == "undefined" || response_tags.length<1) {
			response_tags = ['error','message'];
		} else {
			response_tags.push('error', 'message');
		}
		// }}} set parameters

		// use ssl?
		if ($.isArray(ssl_actions) && params.act && $.inArray(params.act, ssl_actions) >= 0) {
			var url    = default_url || request_uri;
			var port   = window.https_port || 443;
			var _ul    = $('<a>').attr('href', url)[0];
			var target = 'https://' + _ul.hostname.replace(/:\d+$/, '');

			if(port != 443) target += ':'+port;
			if(_ul.pathname[0] != '/') target += '/';

			target += _ul.pathname;
			xml_path = target.replace(/\/$/, '')+'/index.php';
		}

		var _u1 = $('<a>').attr('href', location.href)[0];
		var _u2 = $('<a>').attr('href', xml_path)[0];

		// 현 url과 ajax call 대상 url의 schema 또는 port가 다르면 직접 form 전송
		if(_u1.protocol != _u2.protocol || _u1.port != _u2.port) return send_by_form(xml_path, params);

		var xml = [], i = 0;
		xml[i++] = '<?xml version="1.0" encoding="utf-8" ?>';
		xml[i++] = '<methodCall>';
		xml[i++] = '<params>';

		$.each(params, function(key, val) {
			xml[i++] = '<'+key+'><![CDATA['+val+']]></'+key+'>';
		});

		xml[i++] = '</params>';
		xml[i++] = '</methodCall>';

		var _xhr = null;
		if (_xhr && _xhr.readyState !== 0) _xhr.abort();

		// 전송 성공시
		function onsuccess(data, textStatus, xhr) {
			var resp_xml = $(data).find('response')[0], resp_obj, txt='', ret=[], tags={}, json_str='';

			waiting_obj.css('display', 'none').trigger('cancel_confirm');

			if(!resp_xml) {
				alert(_xhr.responseText);
				return null;
			}

			json_str = xml2json(resp_xml, false, false);
			resp_obj = jQuery.parseJSON(json_str);
			resp_obj = resp_obj.response;

			if (typeof(resp_obj)=='undefined') {
				ret.error = -1;
				ret.message = 'Unexpected error occured.';
				try {
					if(typeof(txt=resp_xml.childNodes[0].firstChild.data)!='undefined') {
						ret.message += '\r\n'+txt;
					}
				} catch(e){}

				return ret;
			}

			$.each(response_tags, function(key, val){ tags[val] = true; });
			tags.redirect_url = true;
			tags.act = true;
			$.each(resp_obj, function(key, val){ if(tags[key]) ret[key] = val; });

			if(ret.error != '0') {
				if ($.isFunction($.exec_xml.onerror)) {
					return $.exec_xml.onerror(module, act, ret, callback_func, response_tags, callback_func_arg, fo_obj);
				}

				alert( (ret.message || 'An unknown error occured while loading ['+module+'.'+act+']').replace(/\\n/g, '\n') );

				return null;
			}

			if(ret.redirect_url) {
				location.href = ret.redirect_url.replace(/&amp;/g, '&');
				return null;
			}

			if($.isFunction(callback_func)) callback_func(ret, response_tags, callback_func_arg, fo_obj);
		}

		// 모든 xml데이터는 POST방식으로 전송. try-catch문으로 오류 발생시 대처
		try {
			$.ajax({
				url         : xml_path,
				type        : 'POST',
				dataType    : 'xml',
				data        : xml.join('\n'),
				contentType : 'text/plain',
				beforeSend  : function(xhr){ _xhr = xhr; },
				success     : onsuccess,
				error       : function(xhr, textStatus) {
					waiting_obj.css('display', 'none');

					var msg = '';

					if (textStatus == 'parsererror') {
						msg  = 'The result is not valid XML :\n-------------------------------------\n';

						if(xhr.responseText === "") return;

						msg += xhr.responseText.replace(/<[^>]+>/g, '');
					} else {
						msg = textStatus;
					}

					try{
						console.log(msg);
					} catch(ee){}
				}
			});
		} catch(e) {
			alert(e);
			return;
		}

		// ajax 통신중 대기 메세지 출력 (show_waiting_message값을 false로 세팅시 보이지 않음)
		var waiting_obj = $('.wfsr');
		if(show_waiting_message && waiting_obj.length) {

			var timeoutId = $(".wfsr").data('timeout_id');
			if(timeoutId) clearTimeout(timeoutId);
			$(".wfsr").css('opacity', 0.0);
			$(".wfsr").data('timeout_id', setTimeout(function(){
				$(".wfsr").css('opacity', '');
			}, 1000));

			waiting_obj.html(waiting_message).show();
		}
	};

	function send_by_form(url, params) {
		var frame_id = 'xeTmpIframe';
		var form_id  = 'xeVirtualForm';

		if (!$('#'+frame_id).length) {
			$('<iframe name="%id%" id="%id%" style="position:absolute;left:-1px;top:1px;width:1px;height:1px"></iframe>'.replace(/%id%/g, frame_id)).appendTo(document.body);
		}

		$('#'+form_id).remove();
		var form = $('<form id="%id%"></form>'.replace(/%id%/g, form_id)).attr({
			'id'     : form_id,
			'method' : 'post',
			'action' : url,
			'target' : frame_id
		});

		params.xeVirtualRequestMethod = 'xml';
		params.xeRequestURI           = location.href.replace(/#(.*)$/i,'');
		params.xeVirtualRequestUrl    = request_uri;

		$.each(params, function(key, value){
			$('<input type="hidden">').attr('name', key).attr('value', value).appendTo(form);
		});

		form.appendTo(document.body).submit();
	}

	function arr2obj(arr) {
		var ret = {};
		for(var key in arr) {
			if(arr.hasOwnProperty(key)) ret[key] = arr[key];
		}

		return ret;
	}


	/**
	* @brief exec_json (exec_xml와 같은 용도)
	**/
	$.exec_json = window.exec_json = function(action, data, callback_sucess, callback_error){
		if(typeof(data) == 'undefined') data = {};

		action = action.split('.');

		if(action.length == 2) {
			// The cover can be disturbing if it consistently blinks (because ajax call usually takes very short time). So make it invisible for the 1st 0.5 sec and then make it visible.
			var timeoutId = $(".wfsr").data('timeout_id');

			if(timeoutId) clearTimeout(timeoutId);

			$(".wfsr").css('opacity', 0.0);
			$(".wfsr").data('timeout_id', setTimeout(function(){
				$(".wfsr").css('opacity', '');
			}, 1000));

			if(show_waiting_message) $(".wfsr").html(waiting_message).show();

			$.extend(data,{module:action[0],act:action[1]});

			if(typeof(xeVid)!='undefined') $.extend(data,{vid:xeVid});

			$.ajax({
				type: "POST",
				dataType: "json",
				url: request_uri,
				contentType: "application/json",
				data: $.param(data),
				success: function(data) {
					$(".wfsr").hide().trigger('cancel_confirm');
					if(data.error != '0' && data.error > -1000) {
						if(data.error == -1 && data.message == 'msg_is_not_administrator') {
							alert('You are not logged in as an administrator');
							if($.isFunction(callback_error)) callback_error(data);

							return;
						} else {
							alert(data.message);
							if($.isFunction(callback_error)) callback_error(data);

							return;
						}
					}

					if($.isFunction(callback_sucess)) callback_sucess(data);
				}
			});
		}
	};

	$.fn.exec_html = function(action,data,type,func,args){
		if(typeof(data) == 'undefined') data = {};
		if(!$.inArray(type, ['html','append','prepend'])) type = 'html';

		var self = $(this);
		action = action.split(".");
		if(action.length == 2){
			var timeoutId = $(".wfsr").data('timeout_id');
			if(timeoutId) clearTimeout(timeoutId);
			$(".wfsr").css('opacity', 0.0);
			$(".wfsr").data('timeout_id', setTimeout(function(){
				$(".wfsr").css('opacity', '');
			}, 1000));
			if(show_waiting_message) $(".wfsr").html(waiting_message).show();

			$.extend(data,{module:action[0],act:action[1]});
			$.ajax({
				type:"POST",
				dataType:"html",
				url:request_uri,
				data:$.param(data),
				success : function(html){
					$(".wfsr").hide().trigger('cancel_confirm');
					self[type](html);
					if($.isFunction(func)) func(args);
				}
			});
		}
	};

	function beforeUnloadHandler(){
		return '';
	}

	$(function($){
		$('.wfsr')
			.ajaxStart(function(){
				$(window).bind('beforeunload', beforeUnloadHandler);
			})
			.bind('ajaxStop cancel_confirm', function(){
				$(window).unbind('beforeunload', beforeUnloadHandler);
			});
	});

})(jQuery);

(function($){

	var messages  = [];
	var rules     = [];
	var filters   = {};
	var callbacks = [];
	var extras    = {};

	var Validator = xe.createApp('Validator', {
		init : function() {
			// {{{ add filters
			// email
			var regEmail = /^[\w-]+((?:\.|\+|\~)[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
			this.cast('ADD_RULE', ['email', regEmail]);
			this.cast('ADD_RULE', ['email_address', regEmail]);

			// userid
			var regUserid = /^[a-z]+[\w-]*[a-z0-9_]+$/i;
			this.cast('ADD_RULE', ['userid', regUserid]);
			this.cast('ADD_RULE', ['user_id', regUserid]);

			// url
			var regUrl = /^(https?|ftp|mms):\/\/[0-9a-z-]+(\.[_0-9a-z-]+)+(:\d+)?/;
			this.cast('ADD_RULE', ['url', regUrl]);
			this.cast('ADD_RULE', ['homepage', regUrl]);

			// korean
			var regKor = new RegExp('^[\uAC00-\uD7A3]*$');
			this.cast('ADD_RULE', ['korean', regKor]);

			// korean_number
			var regKorNum = new RegExp('^[\uAC00-\uD7A30-9]*$');
			this.cast('ADD_RULE', ['korean_number', regKorNum]);

			// alpha
			var regAlpha = /^[a-z]*$/i;
			this.cast('ADD_RULE', ['alpha', regAlpha]);

			// alpha_number
			var regAlphaNum = /^[a-z][a-z0-9_]*$/i;
			this.cast('ADD_RULE', ['alpha_number', regAlphaNum]);

			// number
			var regNum = /^[0-9]*$/;
			this.cast('ADD_RULE', ['number', regNum]);
			// }}} add filters
		},
		// run validator
		run : function(oForm) {
			var filter = '';

			if (oForm._filter) filter = oForm._filter.value;

			var params = [oForm, filter];
			var result = this.cast('VALIDATE', params);
			if (typeof result == 'undefined') result = false;

			return result;
		},
		API_ONREADY : function() {
			var self = this;

			// hook form submit event
			$('form')
				.each(function(){
					if (this.onsubmit) {
						this['xe:onsubmit'] = this.onsubmit;
						this.onsubmit = null;
					}
				})
				.submit(function(e){
					var legacyFn = this['xe:onsubmit'];
					var hasLegacyFn = $.isFunction(legacyFn);
					var bResult = hasLegacyFn?legacyFn.apply(this):self.run(this);

					if(!bResult)
					{
						e.stopImmediatePropagation();
					}
					return bResult;
				});
		},
		API_VALIDATE : function(sender, params) {
			var result = true, form = params[0], elems = form.elements, filter, filter_to_add, ruleset, callback;
			var fields, names, name, el, val, mod, len, lenb, max, min, maxb, minb, rules, e_el, e_val, i, c, r, if_, fn;

			if(elems.ruleset) {
				filter = form.elements.ruleset.value;
			} else if(elems._filter) {
				filter = form.elements._filter.value;
			}

			if(!filter) return true;

			if($.isFunction(callbacks[filter])) callback = callbacks[filter];
			filter = $.extend({}, filters[filter.toLowerCase()] || {}, extras);

			function regex_quote(str) {
				return str.replace(/([\.\+\-\[\]\{\}\(\)\\])/g, '\\$1');
			}

			// get form names
			fields = [];
			for(i=0,c=form.elements.length; i < c; i++) {
				el   = elems[i];
				name = el.name;

				if(!name || !elems[name]) continue;
				if(!elems[name].length || elems[name][0] === el) fields.push(name);
			}
			fields = fields.join('\n');

			// get field names matching patterns
			filter_to_add = {};
			for(name in filter) {
				if(!filter.hasOwnProperty(name)) continue;

				names = [];
				if(name.substr(0,1) == '^') {
					names = fields.match( (new RegExp('^'+regex_quote(name.substr(1))+'.*$','gm')) );
				} else {
					continue;
				}
				if(!names) names = [];

				for(i=0,c=names.length; i < c; i++) {
					filter_to_add[names[i]]= filter[name];
				}

				filter[name] = null;
				delete filter[name];
			}

			filter = $.extend(filter, filter_to_add);

			for(name in filter) {
				if(!filter.hasOwnProperty(name)) continue;

				f   = filter[name];
				el  = elems[name];
				if(!el)
				{
					el = elems[name + '[]'];
				}
				val = el?$.trim(get_value($(el))):'';
				mod = (f.modifier||'')+',';


				if(!el || el.disabled) continue;

				if(f['if']) {
					if(!$.isArray(f['if'])) f['if'] = [f['if']];
					for(i=0;i<f['if'].length;i++) {
						/*jslint evil: true */
						if_ = f['if'][i];
						fn  = new Function('el', 'return !!(' + (if_.test.replace(/\$(\w+)/g, '(jQuery(\'[name=$1]\').is(\':radio, :checkbox\') ? jQuery(\'[name=$1]:checked\').val() : jQuery(\'[name=$1]\').val())')) +')');
						//fn  = new Function('el', 'return !!(' + (if_.test.replace(/\$(\w+)/g, 'el["$1"].value')) +')');
						if(fn(elems)) f[if_.attr] = if_.value;
						else delete f[if_.attr];

					}
				}

				if(!val) {
					if(f['default']) val = f['default'];
					if(f.required) return this.cast('ALERT', [form, name, 'isnull']) && false;
					else continue;
				}

				min  = parseInt(f.minlength) || 0;
				max  = parseInt(f.maxlength) || 0;
				minb = /b$/.test(f.minlength||'');
				maxb = /b$/.test(f.maxlength||'');
				len  = val.length;
				if(minb || maxb) lenb = get_bytes(val);
				if((min && min > (minb?lenb:len)) || (max && max < (maxb?lenb:len))) {
					return this.cast('ALERT', [form, name, 'outofrange', min, max]) && false;
				}

				if(f.equalto) {
					e_el  = elems[f.equalto];
					e_val = e_el?$.trim(get_value($(e_el))):'';
					if(e_el && e_val !== val) {
						return this.cast('ALERT', [form, name, 'equalto']) && false;
					}
				}

				rules = (f.rule || '').split(',');
				for(i=0,c=rules.length; i < c; i++) {
					if(!(r = rules[i])) continue;

					result = this.cast('APPLY_RULE', [r, val]);
					if(mod.indexOf('not,') > -1) result = !result;
					if(!result) {
						return this.cast('ALERT', [form, name, 'invalid_'+r]) && false;
					}
				}
			}

			if($.isFunction(callback)) return callback(form);

			return true;
		},
		API_ADD_RULE : function(sender, params) {
			var name = params[0].toLowerCase();
			rules[name] = params[1];
		},
		API_DEL_RULE : function(sender, params) {
			var name = params[0].toLowerCase();
			delete rules[name];
		},
		API_GET_RULE : function(sender, params) {
			var name = params[0].toLowerCase();

			if (rules[name]) {
				return rules[name];
			} else {
				return null;
			}
		},
		API_ADD_FILTER : function(sender, params) {
			var name   = params[0].toLowerCase();
			var filter = params[1];

			filters[name] = filter;
		},
		API_DEL_FILTER : function(sender, params) {
			var name = params[0].toLowerCase();
			delete filters[name];
		},
		API_GET_FILTER : function(sender, params) {
			var name = params[0].toLowerCase();

			if (filters[name]) {
				return filters[name];
			} else {
				return null;
			}
		},
		API_ADD_EXTRA_FIELD : function(sender, params) {
			var name = params[0].toLowerCase();
			var prop = params[1];

			extras[name] = prop;
		},
		API_GET_EXTRA_FIELD : function(sender, params) {
			var name = params[0].toLowerCase();
			return extras[name];
		},
		API_DEL_EXTRA_FIELD : function(sender, params) {
			var name = params[0].toLowerCase();
			delete extras[name];
		},
		API_APPLY_RULE : function(sender, params) {
			var name  = params[0];
			var value = params[1];

			if(typeof(rules[name]) == 'undefined') return true; // no filter
			if($.isFunction(rules[name])) return rules[name](value);
			if(rules[name] instanceof RegExp) return rules[name].test(value);
			if($.isArray(rules[name])) return ($.inArray(value, rules[name]) > -1);

			return true;
		},
		API_ALERT : function(sender, params) {
			var form = params[0];
			var field_name = params[1];
			var msg_code = params[2];
			var minlen   = params[3];
			var maxlen   = params[4];

			var field_msg = this.cast('GET_MESSAGE', [field_name]);
			var msg = this.cast('GET_MESSAGE', [msg_code]);

			if (msg != msg_code) msg = (msg.indexOf('%s')<0)?(field_msg+msg):(msg.replace('%s',field_msg));
			if (minlen||maxlen) msg +=  '('+(minlen||'')+'~'+(maxlen||'')+')';

			this.cast('SHOW_ALERT', [msg]);

			// set focus
			$(form.elements[field_name]).focus();
		},
		API_SHOW_ALERT : function(sender, params) {
			alert(params[0]);
		},
		API_ADD_MESSAGE : function(sender, params) {
			var msg_code = params[0];
			var msg_str  = params[1];

			messages[msg_code] = msg_str;
		},
		API_GET_MESSAGE : function(sender, params) {
			var msg_code = params[0];

			return messages[msg_code] || msg_code;
		},
		API_ADD_CALLBACK : function(sender, params) {
			var name = params[0];
			var func = params[1];

			callbacks[name] = func;
		},
		API_REMOVE_CALLBACK : function(sender, params) {
			var name = params[0];

			delete callbacks[name];
		}
	});

	var oValidator = new Validator();

	// register validator
	xe.registerApp(oValidator);

	// 호환성을 위해 추가한 플러그인 - 에디터에서 컨텐트를 가져와서 설정한다.
	var EditorStub = xe.createPlugin('editor_stub', {
		API_BEFORE_VALIDATE : function(sender, params) {
			var form = params[0];
			var seq  = form.getAttribute('editor_sequence');

			// bug fix for IE6,7
			if (seq && typeof seq == 'object') seq = seq.value;

			if (seq) {
				try {
					editorRelKeys[seq].content.value = editorRelKeys[seq].func(seq) || '';
				} catch(e) { }
			}
		}
	});
	oValidator.registerPlugin(new EditorStub());

	// functions
	function get_value($elem) {
		var vals = [];
		if ($elem.is(':radio')){
			return $elem.filter(':checked').val();
		} else if ($elem.is(':checkbox')) {
			$elem.filter(':checked').each(function(){
				vals.push(this.value);
			});
			return vals.join('|@|');
		} else {
			return $elem.val();
		}
	}

	function get_bytes(str) {
		str += '';
		if(!str.length) return 0;

		str = encodeURI(str);
		var c = str.split('%').length - 1;

		return str.length - c*2;
	}

})(jQuery);

/**
 * @function filterAlertMessage
 * @brief ajax로 서버에 요청후 결과를 처리할 callback_function을 지정하지 않았을 시 호출되는 기본 함수
 **/
function filterAlertMessage(ret_obj) {
	var error = ret_obj.error;
	var message = ret_obj.message;
	var act = ret_obj.act;
	var redirect_url = ret_obj.redirect_url;
	var url = location.href;

	if(typeof(message) != "undefined" && message && message != "success") alert(message);

	if(typeof(act)!="undefined" && act) url = current_url.setQuery("act", act);
	else if(typeof(redirect_url) != "undefined" && redirect_url) url = redirect_url;

	if(url == location.href) url = url.replace(/#(.*)$/,'');

	location.href = url;
}

/**
 * @brief Function to process filters
 * @deprecated
 */
function procFilter(form, filter_func) {
	filter_func(form);
	return false;
}

function legacy_filter(filter_name, form, module, act, callback, responses, confirm_msg, rename_params) {
	var v = xe.getApp('Validator')[0], $ = jQuery, args = [];

	if (!v) return false;

	if (!form.elements._filter) $(form).prepend('<input type="hidden" name="_filter" />');
	form.elements._filter.value = filter_name;

	args[0] = filter_name;
	args[1] = function(f) {
		var params = {}, res = [], elms = f.elements, data = $(f).serializeArray();
		$.each(data, function(i, field) {
			var v = $.trim(field.value), n = field.name;
			if(!v || !n) return true;
			if(rename_params[n]) n = rename_params[n];

			if(/\[\]$/.test(n)) n = n.replace(/\[\]$/, '');
			if(params[n]) {
				params[n] += '|@|'+v;
			} else {
				params[n] = field.value;
			}
		});

		if (confirm_msg && !confirm(confirm_msg)) return false;

		exec_xml(module, act, params, callback, responses, params, form);
	};

	v.cast('ADD_CALLBACK', args);
	v.cast('VALIDATE', [form, filter_name]);

	return false;
}
