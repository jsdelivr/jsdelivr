/**
 * @file   common/js/xml_handler.js
 * @brief  XE에서 ajax기능을 이용함에 있어 module, act를 잘 사용하기 위한 자바스크립트
 **/

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
