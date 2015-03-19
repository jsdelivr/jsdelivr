// SpryDebug.js - version 0.9 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry; if (!Spry) Spry = {};

Spry.BrowserSniff = function()
{
	var b = navigator.appName.toString();
	var up = navigator.platform.toString();
	var ua = navigator.userAgent.toString();

	this.mozilla = this.ie = this.opera = this.safari = false;
	var re_opera = /Opera.([0-9\.]*)/i;
	var re_msie = /MSIE.([0-9\.]*)/i;
	var re_gecko = /gecko/i;
	var re_safari = /(applewebkit|safari)\/([\d\.]*)/i;
	var r = false;
	
	if ( (r = ua.match(re_opera))) {
		this.opera = true;
		this.version = parseFloat(r[1]);
	} else if ( (r = ua.match(re_msie))) {
		this.ie = true;
		this.version = parseFloat(r[1]);
	} else if ( (r = ua.match(re_safari))) {
		this.safari = true;
		this.version = parseFloat(r[2]);
	} else if (ua.match(re_gecko)) {
		var re_gecko_version = /rv:\s*([0-9\.]+)/i;
		r = ua.match(re_gecko_version);
		this.mozilla = true;
		this.version = parseFloat(r[1]);
	}
	this.windows = this.mac = this.linux = false;

	this.Platform = ua.match(/windows/i) ? "windows" :
					(ua.match(/linux/i) ? "linux" :
					(ua.match(/mac/i) ? "mac" :
					ua.match(/unix/i)? "unix" : "unknown"));
	this[this.Platform] = true;
	this.v = this.version;

	if (this.safari && this.mac && this.mozilla) {
		this.mozilla = false;
	}
};

Spry.is = new Spry.BrowserSniff();

Spry.Debugger = function(){
	var self = this;
	this.onunloaddocument = function(){
			var rmvListener = Spry.Debugger.Utils.removeEvListener;
			rmvListener(window, 'beforeunload', self.unloadfunc, false);
			rmvListener(window, 'load', self.loadfunc, false);
			rmvListener(self.jstext, 'keydown', self.dkfunc, false);
			rmvListener(self.jstext, 'keypress', self.dkfunc, false);
			rmvListener(self.closediv,'click', self.cdwfunc, false);
			rmvListener(self.cleardiv,'click', self.cldwfunc, false);
			rmvListener(self.maximdiv,'click', self.mdwfunc, false);
			rmvListener(self.headdiv, 'mousedown', self.mddwfunc, false);
			rmvListener(self.headdiv, 'mouseup', this.mudwfunc, false);
			rmvListener(document.body, 'mousemove', self.mmdwfunc, false);
			for (var k in self){
				var t = typeof self[k];
				if (t != "function"){
					if (t == "object" && self[k].innerHTML)
						self[k].innerHTML = '';

					self[k] = null;
				}
			}
	};

	this.myerrorhandler = function( errType, errURL, errLineNum )
	{
		try{
			self.out('<div class="error">' + self.explode(errType + " \n " + errURL + ' on line: ' + errLineNum, 0) + '<br style="clear: both;" /></div>');
		}catch(err){alert(err.message);}
		return false;
	};

	if (window.XMLHttpRequest && window.XMLHttpRequest.prototype){
		window.XMLHttpRequest.prototype.debugopen = window.XMLHttpRequest.prototype.open;
		window.XMLHttpRequest.prototype.open = function(method, url, asyncFlag, username, password){
				var self = this;
				// Firefox
				if (this.addEventListener){
					this.addEventListener("load", function(){Spry.Debugger.Utils.logXHRequest(self, method, url);}, false);
				// Opera
				}else if (window.opera){
					var a = this.onreadystatechange;
					this.onreadystatechange = function(){if (typeof a == 'function')a(); Spry.Debugger.Utils.logXHRequest(self, method, url);};
				}
			return this.debugopen(method, url, asyncFlag, username, password);
		};
	}

	this.unloadfunc = function(e){self.onunloaddocument()};
	this.loadfunc = function(e){self.init()};
	Spry.Debugger.Utils.addEvListener(window, 'beforeunload', this.unloadfunc, false);
	Spry.Debugger.Utils.addEvListener(window, 'load', this.loadfunc, false);
	window.onerror = this.myerrorhandler;
};

Spry.Debugger.prototype.init = function(){
	var w = document.getElementById('debugdiv');
	if (!w){
		var debugwindow = document.createElement('div');
		var headdiv = document.createElement('div');
		var closediv = document.createElement('div');
		var maximdiv = document.createElement('div');
		var invdiv = document.createElement('div');
		var textdiv = document.createElement('div');
		var consolediv = document.createElement('div');
		var cleardiv = document.createElement('div');
		var iframe = document.createElement('iframe');

		var scripts = document.getElementsByTagName('script');
		var link = '';
		for (var k=0; k< scripts.length; k++){
			if (scripts[k].src != null && scripts[k].src != '' && scripts[k].src.match(/SpryDebug.js$/)){
				link = scripts[k].src.replace(/SpryDebug.js/, '../css/SpryDebug.css');
				break;
			}
		}
		if (link != ''){
			var cssfile = document.createElement("link");
			cssfile.setAttribute("rel", "stylesheet");
			cssfile.setAttribute("type", "text/css");
			cssfile.setAttribute("href", link);
			document.getElementsByTagName("head").item(0).appendChild(cssfile);
		}
		textdiv.id = 'textdiv';
		textdiv.innerHTML = '<ol><li>Click the (left) button above.</li><li>Click on the page element to introspect. The red outline shows the current selection.</li></ol>';
		headdiv.id = 'headdiv';
		closediv.id = 'closediv';
		closediv.innerHTML = 'x';

		maximdiv.id = 'maximdiv';
		maximdiv.innerHTML = '<div></div>';

		cleardiv.id = 'cleardiv';
		cleardiv.innerHTML = 'clear';

		invdiv.id = 'invdiv';
		invdiv.innerHTML = 'o';

		debugwindow.id = 'debugdiv';

		iframe.src = 'javascript:""';
		iframe.frameBorder = '0';
		iframe.scrolling = 'no';
		iframe.id = 'debugIframe';

		//scroll in the visible area on refresh
		setTimeout(function(){
			try{
				var top = 0;
				if (document.documentElement && document.documentElement.scrollTop)
					var top = parseInt(document.documentElement.scrollTop, 10);
				else if (document.body)
					var top = parseInt(document.body.scrollTop, 10);

				top = top + 10;
				if ( !isNaN(top) && top > 10)
					debugwindow.style.top = top+'px';
			}catch(silent){alert(silent.message);}
		}, 500);

		consolediv.id = 'consolediv';
		consolediv.innerHTML = '<form id="debugForm" action="#" method="get" onsubmit="return debug.jseval();"><input type="text" id="debugtext" name="debugtext" /><input type="submit" id="submitform" /><div id="debuggersuggestions"></div></form>';

		document.body.appendChild(debugwindow);
		debugwindow.appendChild(headdiv);
		debugwindow.appendChild(textdiv);
		debugwindow.appendChild(consolediv);
		headdiv.appendChild(closediv);
		headdiv.appendChild(maximdiv);
		headdiv.appendChild(cleardiv);
		headdiv.appendChild(invdiv);
		debugwindow.parentNode.appendChild(iframe);
		this.jstext = document.getElementById('debugtext');
		this.jstext.setAttribute('AutoComplete', 'off');
		var self = this;

		this.dkfunc = function(e){return self.debuggerKey(e)};
		this.cdwfunc = function(e){return self.closeDebugWindow(e)};
		this.cldwfunc = function(e){return self.clearDebugWindow(e)};
		this.mdwfunc = function(e){return self.maximDebugWindow(e)};
		this.mddwfunc = function(e){return self.mousedownDebugWindow(e)};
		this.mmdwfunc = function(e){return self.mousemoveDebugWindow(e)};
		this.mudwfunc = function(e){return self.mouseupDebugWindow(e)};
		this.imdfunc = function(e){return self.introspectPage(e)};
		var addEv = Spry.Debugger.Utils.addEvListener;
		addEv(self.jstext, 'keydown', this.dkfunc, false);
		addEv(closediv,'click', this.cdwfunc, false);
		addEv(cleardiv,'click', this.cldwfunc, false);
		addEv(invdiv,'click', this.imdfunc, false);
		addEv(maximdiv,'click', this.mdwfunc, false);
		addEv(headdiv, 'mousedown', this.mddwfunc, false);
		addEv(document.body, 'mousemove', this.mmdwfunc, false);
		addEv(headdiv, 'mouseup', this.mudwfunc, false);
		this.debugdiv = debugwindow;
		this.jshints = document.getElementById('debuggersuggestions');
		this.headdiv = headdiv;
		this.closediv = closediv;
		this.maximdiv = maximdiv;
		this.textdiv = textdiv;
		this.consolediv = consolediv;
		this.cleardiv = cleardiv;
	}
	// clear stack
	this.out();
	setTimeout(function(){if (Spry.is.ie && Spry.is.version < 7)
	{
			iframe.style.height = debugwindow.offsetHeight + 'px';
			iframe.style.width = debugwindow.offsetWidth + 'px';
	}},0);
};
Spry.Debugger.prototype.introspectPage = function(e){
	if (this.introspRun && this.introspRun == true){
		this.introspRun = false;
		self.stopHi();
	}else{
		this.introspRun = true;
		if (typeof this.hiElTop == 'undefined'){
			var self = this;
			Spry.Debugger.Utils.addEvListener(document, 'mouseover', function(ev){
				if (!self.introspRun) return;
					ev = ev || event;
					var el;
					if (Spry.is.mozilla)
						el = ev.target;
					else
						el = ev.srcElement;

					if (self.hiEl && el == self.hiEl)
						return true;
					
					if (!self.prevT || self.prevT != ev.target)
					{
						self.highlight(el, self.prevT);
						self.prevT = el;
					} 
					Spry.Debugger.Utils.stopEvent(ev);
					return false;
			}, true); 
			Spry.Debugger.Utils.addEvListener(document, 'mousedown', function(ev){
				ev = ev || event;
				if (!self.introspRun) return;
				var el;
				if (Spry.is.mozilla)
					el = ev.target;
				else
					el = ev.srcElement;

				if (el != self.invdiv)
					self.log(el);

				self.stopHi();
				self.introspRun = false;
				Spry.Debugger.Utils.stopEvent(ev);
				return false;
			}, true);
		}
	}
};
Spry.Debugger.prototype.highlight = function(targ){
	if (typeof this.introspRun == 'undefined' || !this.introspRun){
		return;
	}
	if (!this.hiElTop){
		this.hiElTop = document.createElement('div');
		this.hiElTop.id = 'highlighterTop';
		this.hiElRight = document.createElement('div');
		this.hiElRight.id = 'highlighterRight';
		this.hiElBottom = document.createElement('div');
		this.hiElBottom.id = 'highlighterBottom';
		this.hiElLeft = document.createElement('div');
		this.hiElLeft.id = 'highlighterLeft';

		document.body.appendChild(this.hiElTop);
		document.body.appendChild(this.hiElBottom);
		document.body.appendChild(this.hiElLeft);
		document.body.appendChild(this.hiElRight);
	}
	if (targ != this.hiElTop && targ != this.hiElLeft && targ != this.hiElBottom && targ != this.hiElRight){
		try{
		var tmp = Spry.Debugger.Utils.getBorderBox(targ);
		this.hiElBottom.style.width = this.hiElTop.style.width = tmp.width + 'px';
		this.hiElRight.style.height = this.hiElLeft.style.height = tmp.height + 'px';
		this.hiElRight.style.top = this.hiElLeft.style.top = this.hiElTop.style.top = tmp.y + 'px';
		this.hiElBottom.style.left = this.hiElLeft.style.left = this.hiElTop.style.left = tmp.x + 'px';
		this.hiElBottom.style.top = (tmp.y + tmp.height - 1) + 'px';
		this.hiElRight.style.left = (tmp.x + tmp.width - 1) + 'px';
		}catch(eroare){}
	}
};
Spry.Debugger.prototype.stopHi = function(){
	try{
	this.hiElBottom.style.top = this.hiElLeft.style.top = this.hiElRight.style.top = this.hiElTop.style.top =
	this.hiElBottom.style.left = this.hiElLeft.style.left = this.hiElRight.style.left = this.hiElTop.style.left =
	this.hiElBottom.style.width = this.hiElLeft.style.width = this.hiElRight.style.width = this.hiElTop.style.width =
	this.hiElBottom.style.height = this.hiElLeft.style.height = this.hiElRight.style.height = this.hiElTop.style.height = "0px";
	}catch(error){};
};
Spry.Debugger.prototype.debuggerKey = function(e){
	e = e || event;
	if (e && e.keyCode){
		switch (e.keyCode){
			case 9:
				var l = [];
				var b = this.jstext.value.replace(/.*\(/,'');
				var a = b.replace(/\.?[^.]*$/,'');
				if (a == '') a = 'window';
				a = 'var c = ' + a;
				try{eval(a)}catch(e){};
				if (typeof c != 'undefined' && c){
					inner = '';
					debug.out();
					for (var k in c){
							if (k.toLowerCase().indexOf(b.toLowerCase().replace(/.*\./, '')) == 0){
								if (k.toUpperCase() == k)
									continue;
								try{
									if (k != 'domConfig' && typeof c[k] == 'function'){
										k += '(';
									}
								}catch(e){this.myerrorhandler('debug.debuggerKey: '+ k +'()' + e.message, 'debug.js',152);}

								l[l.length] = k;
							}
					}
					for (var j = 0; j < l.length; j++)
						inner+='<div onmouseover="this.style.backgroundColor=\'#CCCCCC\'" onmouseout="this.style.backgroundColor=\'\'" onclick="debug.jstext.value = debug.jstext.value.replace(/\.[^.]*$/, \'.\') + \'' + l[j] + '\'; debug.jshints.style.display = \'none\'" class="debuggersuggest">' + l[j] + '</div>';

					if (inner.length != 0){
						this.jshints.innerHTML = inner;
						this.jshints.style.display = 'block';
					}
				}
				this.jstext.focus();
				Spry.Debugger.Utils.stopEvent(e);
				return false;
				break;
			case 40:
			case 38:
				if (this.jshints.style.display != 'block'){
					Spry.Debugger.Utils.stopEvent(e);
					return false;
				}
				var ch = this.jshints.getElementsByTagName('div');
				var prev = -1;
				if (ch && ch.length){
					prev = ch.length;
				}
				var next = false;
				var found = false;
				for (var k = 0; k < ch.length; k++)
				{
					if (next)
					{
						ch[k].style.backgroundColor = '#CCCCCC';
						this.debuggerScroll(ch[k]);
						break;
					}
					if (ch[k].style.backgroundColor.toUpperCase() == '#CCCCCC' || ch[k].style.backgroundColor == 'rgb(204, 204, 204)')
					{
						ch[k].style.backgroundColor = '';
						found = true;
						if (e.keyCode == 40)
						{
							next = true;
							continue;
						}
						else
						{
							ch[prev].style.backgroundColor = '#CCCCCC';
							this.debuggerScroll(ch[prev]);
							break;
						}
					}
					prev = k;
				}
				if (!found || (next && k == ch.length))
				{
					ch[0].style.backgroundColor = '#CCCCCC';
					this.debuggerScroll(ch[0]);
				}
				Spry.Debugger.Utils.stopEvent(e);
				return false;
				break;
			case 13:
				if (this.jshints.style.display != 'block')
					return true;

				var ch = this.jshints.getElementsByTagName('div');
				for (var k=0; k < ch.length ;k++)
					if (ch[k].style.backgroundColor.toUpperCase() == '#CCCCCC' || ch[k].style.backgroundColor == 'rgb(204, 204, 204)'){
						this.jstext.value = this.jstext.value.replace(/\.[^.]*$/, '.') + ch[k].innerHTML;
						this.jshints.style.display = 'none';
						Spry.Debugger.Utils.stopEvent(e);
						return false;
					}
				Spry.Debugger.Utils.stopEvent(e);
				return false;
				break;
			default:
				this.jshints.style.display = 'none';
				break;
		}
	}
};
Spry.Debugger.prototype.debuggerScroll = function(el){
		var a = this.jshints;
		var h = 100;
		if (el.offsetTop < a.scrollTop)
			a.scrollTop = el.offsetTop;
		else if (el.offsetTop + el.offsetHeight > a.scrollTop + h)
		{
			// the 5 pixels make the latest option more visible.
			a.scrollTop = el.offsetTop + el.offsetHeight - h + 5;
			if (a.scrollTop < 0)
				a.scrollTop = 0;
		}
};
Spry.Debugger.prototype.jseval = function(){
	if (!this.history)
		this.history = [];
	try{
		var val = this.jstext.value;
		this.history[this.history.length] = val;
		val = 'var tmp = ' + val + '; if (tmp){ var asd = false; try{debug.log("<div><span class=\\\"commandExecResultsLabel\\\">Command Execution Result</span>:" + debug.explode(tmp, 0) + "</div>")}catch(asd){}}';
		var bug = false;
		try{
			eval(val);
		}catch(bug){alert(bug.message)}

		if (bug && bug.message){
			eval(this.jstext.value);
		}
	}catch(e){this.myerrorhandler(e.message, ' debug.console ', 255);}
	this.jstext.value = '';
	return false;
};

Spry.Debugger.prototype.dumpObjectEl = function(e, k, depth){
	if (k == 'domConfig') return;

	var ctrl='';
	try{
		var tipe = typeof e[k];
		if (tipe == 'unknown') return '<div class="varlabel">'+k+'</div><div class="varvalue">value unknown</div>';
		if (tipe != 'function'){
			if (typeof k == 'number' || k.toUpperCase() != k){
				ctrl += '<div class="varlabel';

				if (tipe == 'object' && e[k] != null && depth < 1)
					ctrl += ' objectlabel';
				ctrl += '">' + k + '</div><div class="varvalue">';
	
				if (tipe == 'object' && e[k] != null && depth < 1)
					ctrl += '<a href="#" onclick="Spry.Debugger.Utils.makeVisible(this); return false;">';

				if (tipe == 'undefined'){
					ctrl += 'undefined';
				}else if (e[k] == null){
					ctrl += 'null';
				}else if (tipe == 'string'){
					if (e[k] == ''){
						ctrl += '""';
					}else if (e[k].match(/^#[0-9a-z]{3,6}$/) || e[k].indexOf('rgb(') == 0){
						var color = e[k];
						if (e[k].indexOf('rgb(') == 0)
							color = '#' + parseInt(e[k].substr(e[k].indexOf('(')+1, e[k].indexOf(',') - e[k].indexOf('(')-1),10).toString(16) + "" + parseInt(e[k].substr(e[k].indexOf(',') +1 ,e[k].lastIndexOf(',') - e[k].indexOf(',')-1),10).toString(16) + "" + parseInt(e[k].substr(e[k].lastIndexOf(',')+1, e[k].indexOf(')') - e[k].lastIndexOf(',')-1),10).toString(16);

						ctrl += '<span style="color:' + color + '">' + e[k] + '</span>';
					}else{
						ctrl += e[k].replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br />');
					}
				}else{
					try{
						ctrl += e[k];
					}catch(e){ctrl += '[object ?!]';}
				}
				if (tipe == 'object' && e[k] != null && depth < 1){
					ctrl += '</a>';
					try{
							ctrl += this.explode(e[k], depth + 1);
						}catch(erp){};
				}
				ctrl+= '</div>';
			}
		}
	}catch(errr){};
	return ctrl;
};
Spry.Debugger.prototype.explode = function (e, depth){
	try{
		var ctrl = '';
		var ctrl_al = '';

		if (typeof depth == 'undefined')
			depth = 0;

		ctrl += '<div class="dumptable' + ((depth > 0)?' hidedump' : '') + '">';
		switch (typeof e){
			case 'object':
				if ( typeof e.length == 'undefined' || (e.length > 0 && typeof e.push == 'undefined')){
					for (var k in e){
						if (k != 'domConfig' && typeof e[k] != 'function'){
							ctrl += this.dumpObjectEl(e, k, depth);
							try{
							if (k == 'style' && depth == 0){
								var css = '';
								if (document.defaultView && document.defaultView.getComputedStyle)
									css = document.defaultView.getComputedStyle(e, null);
								else if (e.currentStyle) 
									css = e.currentStyle;
								ctrl += '<div class="varlabel computed">[Computed Style]:</div><div class="varvalue">[<a href="#" onclick="Spry.Debugger.Utils.makeVisible(this); return false;">STYLE</a>]';
								ctrl += this.explode(css, 1);
								ctrl += '</div>';
							}
							}catch(arr){alert(arr.message);}
						}else{
							ctrl_al += ', ' + k + '()';
						}
					}
					if (ctrl_al.length > 0){
						ctrl_al = ctrl_al.substring(2);
						ctrl += '<div class="varlabel">FUNCTIONS:</div>';
						ctrl += '<div class="varvalue" colspan="2">' + ctrl_al + '</div>';
					}
				}else{
					if (e.length == 0){
						ctrl += '<div class="specialvaluedump" colspan="2">Empty Array</div>';
					}else{
						ctrl += '<div class="varlabel">Length</div><div class="varvalue">'+e.length+'</div>';
						for (var k = 0; k < e.length; k++)
							ctrl += this.dumpObjectEl(e, k, depth);
					}
				}
				break;
			case 'string':
				var len = e.length;
				var content = e;
			  if (e.indexOf('<')){
						var content = e.replace(/</ig ,'&lt;').replace(/>/ig, '&gt;');
						content = '<pre>' + content + '</pre>';
				}
				ctrl += '<div class="varlabel">string(' + len + '):</div><div class="varvalue"> ' + content +'</div>';
				break;
			case 'function':
				try{
					var a = ''+e;
					ctrl += '<div class="varlabel">function()</div><div class="varvalue"><pre> ' + a.replace(/</g, '&lt;').replace(/>/g, '&gt;') +'</pre></div>';
				}catch(e){this.log(e.message)};
				break;
			case 'undefined':
				ctrl += '<div class="specialvaluedump" colspan=2><i>undefined</i></div>';
				break;
			case 'number':
				var type = parseInt(e, 10) == e ? 'Integer:' : (parseFloat(e) == e ? 'Float:' : 'Number:');
				ctrl +=  '<div class="varlabel">'+type+'</div><div class="varvalue">' + e +'</div>';
				break;
			case 'boolean':
				ctrl +=  '<div class="varlabel">Boolean:</div><div class="varvalue">' + e +'</div>';
		}
		ctrl += '<br class="clear" /></div>';
		return ctrl;

	}catch(e){this.out('Spry.Debugger.explode error: ' + e.message);}
};

//public static methods
Spry.Debugger.prototype.log = function (){
	var t = arguments;
	var self = this;
	setTimeout(function(){
		var ctrl = '';
		if (t.length > 0)
				for (var j =0; j < t.length; j++)
					ctrl += self.explode(t[j], 0);

		self.out(ctrl);
	}, 10);
};

Spry.Debugger.prototype.out = function(str, notype){
	if (typeof buffer == 'undefined')
		buffer = '';

	var t = this.textdiv;
	var self = this;

	if (t){
		if (!t.innerHTML)
			t.innerHTML = '';
		
		setTimeout(function(){
			if (buffer.length > 0){
				t.innerHTML += buffer;
				buffer = '';
			}
			if (typeof str == 'string'){
				var scrollSave = self.textdiv.scrollHeight;
				t.innerHTML += str + '<br class="clear" />';
				self.textdiv.scrollTop = scrollSave;
			}
		}, 0);

	}else{
		setTimeout(function(){self.out();}, 400);
		if (typeof str == 'string')
			buffer += str+'<br class="clear" />';
	}
};

Spry.Debugger.prototype.closeDebugWindow = function(e){
	var dw = this.debugdiv;

	if (this.textdiv.style.display == 'none'){
		this.textdiv.style.display = '';
		dw.style.height = '500px';
	}else{
		this.textdiv.style.display = 'none';
		dw.style.height = '14px';
	}
	return true;
};
Spry.Debugger.prototype.clearDebugWindow = function(e){
	this.textdiv.innerHTML = '';
	return true;
};
Spry.Debugger.prototype.maximDebugWindow = function(){
	var main = this.debugdiv;
	if (this.textdiv)
		this.textdiv.style.display = 'block';
	
	if (!main.className)
		main.className = '';		

	if (main.className.indexOf('maximized') == -1){
		this.left = main.style.left;
		main.className += 'maximized';
		main.style.left = '0';
		if (document.documentElement){
			main.style.height = document.documentElement.clientHeight;
			main.style.width = document.documentElement.clientWidth;
		}
	}else{
		main.className = main.className.replace(/maximized/i, '');
		main.style.left = this.left;
		main.style.height = '';
		main.style.width = '';
	}
	var layer = document.getElementById('debugIframe');
	if (layer){
		layer.style.top = main.style.top;
		layer.style.left = main.style.left;
		layer.style.height = main.offsetHeight;
		layer.style.width = main.offsetWidth;
	}
	return true;
};
Spry.Debugger.prototype.mousedownDebugWindow = function (e){
	e = e || event;
	var mainarea = this.debugdiv;
	if (!this.startDrag){
		this.startDrag = true;
		initialX = e.screenX;
		initialY = e.screenY;
		topX = mainarea.offsetLeft;
		topY = mainarea.offsetTop;
	}
	return false;
};

Spry.Debugger.prototype.mouseupDebugWindow = function (e){
	if (this.startDrag){
		if (Spry.is.ie)
			this.debugdiv.style.filter = 'alpha(opacity=100)';
		else
			this.debugdiv.style.opacity = 1;
		this.startDrag = false;
	}
	return false;
};

Spry.Debugger.prototype.mousemoveDebugWindow = function (e){
	e = e||event;
	if (this.startDrag){
		if (Spry.is.ie)
			this.debugdiv.style.filter = 'alpha(opacity=60)';
		else
			this.debugdiv.style.opacity = 0.6;
		var x = e.screenX - initialX;
		var y = e.screenY - initialY;
		this.debugdiv.style.left = (topX + x) + 'px';
		this.debugdiv.style.top = (topY + y) + 'px';
		var layer = document.getElementById('debugIframe');
		if (layer){
			layer.style.top = this.debugdiv.style.top;
			layer.style.left = this.debugdiv.style.left;
		}
	}
	return false;
};

////////////////////////////////////////////////////////////////
//
// Spry.Debugger.Utils
//
/////////////////////////////////////////////////////////////////

if (!Spry.Debugger.Utils) Spry.Debugger.Utils = {};
Spry.Debugger.Utils.camelize = function(stringToCamelize)
{
	if (stringToCamelize.indexOf('-') == -1){
		return stringToCamelize;	
	}
	var oStringList = stringToCamelize.split('-');
	var isFirstEntry = true;
	var camelizedString = '';

	for(var i=0; i < oStringList.length; i++)
	{
		if(oStringList[i].length>0)
		{
			if(isFirstEntry)
			{
				camelizedString = oStringList[i];
				isFirstEntry = false;
			}
			else
			{
				var s = oStringList[i];
				camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
			}
		}
	}

	return camelizedString;
};
Spry.Debugger.Utils.getStyleProp = function(element, prop)
{
	var value;
	try
	{
		if (element.style)
			value = element.style[Spry.Debugger.Utils.camelize(prop)];

		if (!value)
		{
			if (document.defaultView && document.defaultView.getComputedStyle)
			{
				var css = document.defaultView.getComputedStyle(element, null);
				value = css ? css.getPropertyValue(prop) : null;
			}
			else if (element.currentStyle) 
			{
					value = element.currentStyle[Spry.Debugger.Utils.camelize(prop)];
			}
		}
	}
	catch (e) {}

	return value == 'auto' ? null : value;
};
Spry.Debugger.Utils.getIntProp = function(element, prop){
	var a = parseInt(Spry.Debugger.Utils.getStyleProp(element, prop),10);
	if (isNaN(a))
		return 0;
	return a;
};
Spry.Debugger.Utils.getBorderBox = function (el, doc) {
	doc = doc || document;
	if (typeof(el) == 'string') {
		el = doc.getElementById(el);
	}

	if (!el) {
		return false;
	}

	if (el.parentNode === null || Spry.Debugger.Utils.getStyleProp(el, 'display') == 'none') {
		//element must be visible to have a box
		return false;
	}

	var ret = {x:0, y:0, width:0, height:0};
	var parent = null;
	var box;

	if (el.getBoundingClientRect) { // IE
		box = el.getBoundingClientRect();
		var scrollTop = doc.documentElement.scrollTop || doc.body.scrollTop;
		var scrollLeft = doc.documentElement.scrollLeft || doc.body.scrollLeft;
		ret.x = box.left + scrollLeft;
		ret.y = box.top + scrollTop;
		ret.width = box.right - box.left;
		ret.height = box.bottom - box.top;
	} else if (doc.getBoxObjectFor) { // gecko
		box = doc.getBoxObjectFor(el);
		ret.x = box.x;
		ret.y = box.y;
		ret.width = box.width;
		ret.height = box.height;
		var btw = Spry.Debugger.Utils.getIntProp(el, "border-top-width");
		var blw = Spry.Debugger.Utils.getIntProp(el, "border-left-width");
		ret.x -= blw;
		ret.y -= btw;
	} else { // safari/opera
		ret.x = el.offsetLeft;
		ret.y = el.offsetTop;
		ret.width = el.offsetWidth;
		ret.height = el.offsetHeight;
		parent = el.offsetParent;
		if (parent != el) {
			while (parent) {
				ret.x += parent.offsetLeft;
				ret.y += parent.offsetTop;
				parent = parent.offsetParent;
			}
		}
		var blw = Spry.Debugger.Utils.getIntProp(el, "border-left-width");
		var btw = Spry.Debugger.Utils.getIntProp(el, "border-top-width");
		ret.x -= blw;
		ret.y -= btw;
		// opera & (safari absolute) incorrectly account for body offsetTop
		if (Spry.is.opera || Spry.is.safari && Spry.Debugger.Utils.getStyleProp(el, 'position') == 'absolute')
			ret.y -= doc.body.offsetTop;
	}
	if (el.parentNode)
			parent = el.parentNode;
	else
		parent = null;
	if (parent.nodeName){
		var cas = parent.nodeName.toUpperCase();
		while (parent && cas != 'BODY' && cas != 'HTML') {
			cas = parent.nodeName.toUpperCase();
			ret.x -= parent.scrollLeft;
			ret.y -= parent.scrollTop;
			if (parent.parentNode)
				parent = parent.parentNode;
			else
				parent = null;
		}
	}
	// adjust the margin
	var gi = Spry.Debugger.Utils.getIntProp;
	var btw = gi(el, "margin-top");
	var blw = gi(el, "margin-left");
	var bbw = gi(el, "margin-bottom");
	var brw = gi(el, "margin-right");
	ret.x -= blw;
	ret.y -= btw;
	ret.height += btw + bbw;
	ret.width += blw + brw;
	return ret;
};
Spry.Debugger.Utils.removeEvListener = function(el, eventType, handler, capture){
	try{
		if (el.removeEventListener)
			el.removeEventListener(eventType, handler, capture);
		else if (el.detachEvent)
			el.detachEvent("on" + eventType, handler, capture);
	}catch (e) {}
};
Spry.Debugger.Utils.addEvListener = function(el, eventType, handler, capture){
	try{
		if (el.addEventListener)
			el.addEventListener(eventType, handler, capture);
		else if (el.attachEvent)
			el.attachEvent("on" + eventType, handler);
	}catch (e) {}
};
Spry.Debugger.Utils.stopEvent = function(e){
	try{
		if (e){
			if (e.stopPropagation)
				e.stopPropagation();
			else
				e.cancelBubble = true;

			if (e.preventDefault)
				e.preventDefault();
			else
				e.returnValue = false;
		}
	}catch (e){}
};
Spry.Debugger.Utils.logXHRequest = function(req, m, url){
	if (req.readyState == 4){
		var uniqIdHeader = (new Date()).getTime() + '' + Math.random();
		var uniqIdContent = (new Date()).getTime() + '' + Math.random();
		var o = '<div class="urldump">' + m + ' ' + url + ' <a href="#" onclick="Spry.Debugger.Utils.makeVisible(\''+uniqIdHeader+'\', false); Spry.Debugger.Utils.makeVisible(\''+uniqIdContent+'\'); return false;">Content</a> | <a href="#" onclick="Spry.Debugger.Utils.makeVisible(\''+uniqIdContent+'\', false); Spry.Debugger.Utils.makeVisible(\''+uniqIdHeader+'\'); return false;"> Headers</a>';
		o += '<div><div class="contenturldump hidedump" id="'+uniqIdContent+'"><pre>' + req.responseText.replace(/</g, '&lt;') + '</pre></div></div>';
		var k = req.getAllResponseHeaders();
		o += '<div><div class="contenturldump hidedump" id="' + uniqIdHeader + '"><pre>' + k + '</pre></div></div>';
		debug.out(o);
	}
};

Spry.Debugger.Utils.makeVisible = function(el, visible){
	el = Spry.Debugger.Utils.getElement(el);
	if (typeof visible != 'undefined')
	{
		if (visible == 'block'){
			el.style.display = 'block';
		}else{
			el.style.display = 'none';	
		}
		return;
	}
  if (el.parentNode)
	{
		var l = el.parentNode.getElementsByTagName('div');
		var b = false;
		for (var i = 0; i < l.length; i++){
			if (l[i].className.match(/hidedump/)){
				b = l[i];
				break;
			}	
		}
		if (b){
			var tmp = b.style.display || Spry.Debugger.Utils.getStyleProp(b, 'display');
			if (tmp && tmp == 'block'){
				b.style.display =  'none';
				//b.innerHTML = b.innerHTML.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			}else{
				//b.innerHTML = b.innerHTML.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
				b.style.display =  'block';
			}
		}
	}
};
Spry.Debugger.Utils.getElement = function(el){
	if (typeof el == 'string')
		return document.getElementById(el);
	return el;
};
if (typeof debug == 'undefined' || typeof debug.toString == 'undefined'){
	var debug = new Spry.Debugger();
	if (typeof console == 'undefined'){
		var console = debug;	
	}
};
