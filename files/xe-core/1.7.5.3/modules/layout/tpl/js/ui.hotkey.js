/*
 * jQuery Hotkey Plug-in
 * @author NAVER (developer@xpressengine.com)
 */

(function($){

// virtual keys
var VKEY = {
	'TAB' : 9,
	'ESC' : 27,
	'ENTER,RETURN' : 13,
	'UP' : 38,
	'DOWN' : 40,
	'LEFT' : 37,
	'RIGHT' : 39,
	'BACKSPACE,BKSP' : 8,
	'DEL' : 46,
	'SPACE' : 32
};

var Hotkey = new Object;

$.fn.hotkey = function(key, func) {
	if (typeof key == "object" && key.toString() == '[object Object]') {
		for(var x in key) $(this).hotkey(x, key[x]);
		return this;
	}
	
	if (!$.isString(key)) return this;
	if (key == 'disable' || key == 'enable') {
		this.attr('hotkey_disabled', (key=='disable'));
		return this;
	}
	
	if (!$.isFunction(func)) return this;
	if ($.isObject(key)) key = hk2str(key);
		
	Hotkey[key] = func;
	
	if (!this.attr('assign-hotkey')) {
		this.attr('assign-hotkey', true);
		
		this.keydown(function(evt){
			if ($(this).attr('hotkey_disabled')) return;
			
			var stroke = hk2str(evt).split(',');
			
			for(var i=0; i < stroke.length; i++) {
				if (Hotkey[stroke[i]]) {
					if ($(evt.target).is(':input') && (evt.ctrlKey||evt.altKey||evt.metaKey)) break;
					
					Hotkey[stroke[i]](evt, stroke[i]);

					evt.stopPropagation();
					evt.preventDefault();
				}
			}
		});
	}
	
	return this;
};

$.extend({
	isObject : function(obj) {
		return (typeof obj == 'object' && obj.toString() == '[object Object]');
	},
	isArray : function(arr) {
		return (Object.prototype.toString.call(arr) == '[object Array]');
	},
	isString : function(str) {
		return (typeof str == 'string');
	}
});

// hotkey to string
function hk2str(key) {
	var str = [], vkey = false;
	var _   = null; // do nothing. It is just dummy.

	for(var x in VKEY) {
		if (VKEY[x] == key.keyCode) {
			vkey = x;
			break;
		}
	}
	if (!vkey) {
		vkey = String.fromCharCode(key.keyCode).toUpperCase();
		if (vkey.length != 1) return '';
	}
	
	key.altKey?str.push('Alt'):_;
	key.ctrlKey?str.push('Ctrl'):_;
	key.shiftKey?str.push('Shift'):_;
	
	str.push(vkey);
	
	return str.join('+');
}

// string to hotkey
function str2hk(str) {
	var key = {altKey:false,ctrlKey:false,shiftKey:false,keyCode:0};
	var lastKey = str.match(/\+([A-Z0-9]+)$/)[1];
	
	if (!lastKey) return key;
	
	str += '+';
	
	key.altKey   = str.indexOf('Alt+') > -1;
	key.ctrlKey  = str.indexOf('Ctrl+') > -1;
	key.shiftKey = str.indexOf('Shift+') > -1;
	
	key.keyCode = VKEY[lastKey] || lastKey.charCodeAt(0);
}
	
})(jQuery);