/**
 * x.js compiled from X 4.0 with XC 0.27b.
 * Distributed by GNU LGPL. For copyrights, license, documentation and more visit Cross-Browser.com
 * Copyright 2001-2005 Michael Foster (Cross-Browser.com)
 **/
function xDeprecate(funcName) {
	var msg = 'DEPRECATED : '+funcName+'() is deprecated function.';
	if (typeof console == 'object' && typeof console.log == 'function') {
		console.log(msg);
	}
}

var xOp7Up,xOp6Dn,xIE4Up,xIE4,xIE5,xIE6,xNN4,xUA=navigator.userAgent.toLowerCase();
if(window.opera){
	var i=xUA.indexOf('opera');
	if(i!=-1){
		var v=parseInt(xUA.charAt(i+6));
		xOp7Up=v>=7;
		xOp6Dn=v<7;
	}
}
else if(navigator.vendor!='KDE' && document.all && xUA.indexOf('msie')!=-1){
	xIE4Up=parseFloat(navigator.appVersion)>=4;
	xIE4=xUA.indexOf('msie 4')!=-1;
	xIE5=xUA.indexOf('msie 5')!=-1;
	xIE6=xUA.indexOf('msie 6')!=-1;
}
else if(document.layers){xNN4=true;}
var xMac=xUA.indexOf('mac')!=-1;
var xFF=xUA.indexOf('firefox')!=-1;

// (element, event(without 'on'), event listener(function name)[, caption])
function xAddEventListener(e,eT,eL,cap)
{
	xDeprecate('xAddEventListener');
	if(!(e=xGetElementById(e))) return;
	eT=eT.toLowerCase();
	if((!xIE4Up && !xOp7Up) && e==window) {
		if(eT=='resize') { window.xPCW=xClientWidth(); window.xPCH=xClientHeight(); window.xREL=eL; xResizeEvent(); return; }
		if(eT=='scroll') { window.xPSL=xScrollLeft(); window.xPST=xScrollTop(); window.xSEL=eL; xScrollEvent(); return; }
	}
	var eh='e.on'+eT+'=eL';
	if(e.addEventListener) e.addEventListener(eT,eL,cap);
	else if(e.attachEvent) e.attachEvent('on'+eT,eL);
	else eval(eh);
}
// called only from the above
function xResizeEvent()
{
	xDeprecate('xResizeEvent');
	if (window.xREL) setTimeout('xResizeEvent()', 250);
	var cw = xClientWidth(), ch = xClientHeight();
	if (window.xPCW != cw || window.xPCH != ch) { window.xPCW = cw; window.xPCH = ch; if (window.xREL) window.xREL(); }
}

function xScrollEvent()
{
	xDeprecate('xScrollEvent');
	if (window.xSEL) setTimeout('xScrollEvent()', 250);
	var sl = xScrollLeft(), st = xScrollTop();
	if (window.xPSL != sl || window.xPST != st) { window.xPSL = sl; window.xPST = st; if (window.xSEL) window.xSEL(); }
}

function xAppendChild(oParent, oChild)
{
	xDeprecate('xAppendChild');
	if (oParent.appendChild) return oParent.appendChild(oChild);
	else return null;
}

function xClientHeight()
{
	xDeprecate('xClientHeight');
	var h=0;
	if(xOp6Dn) h=window.innerHeight;
	else if(document.compatMode == 'CSS1Compat' && !window.opera && document.documentElement && document.documentElement.clientHeight)
		h=document.documentElement.clientHeight;
	else if(document.body && document.body.clientHeight)
		h=document.body.clientHeight;
	else if(xDef(window.innerWidth,window.innerHeight,document.width)) {
		h=window.innerHeight;
		if(document.width>window.innerWidth) h-=16;
	}
	return h;
}

function xClientWidth()
{
	xDeprecate('xClientWidth');
	var w=0;
	if(xOp6Dn) w=window.innerWidth;
	else if(document.compatMode == 'CSS1Compat' && !window.opera && document.documentElement && document.documentElement.clientWidth)
		w=document.documentElement.clientWidth;
	else if(document.body && document.body.clientWidth)
		w=document.body.clientWidth;
	else if(xDef(window.innerWidth,window.innerHeight,document.height)) {
		w=window.innerWidth;
		if(document.height>window.innerHeight) w-=16;
	}
	return w;
}

function xCreateElement(sTag)
{
	xDeprecate('xCreateElement');
	if (document.createElement) return document.createElement(sTag);
	else return null;
}

function xDef()
{
	xDeprecate('xDef');
	for(var i=0; i<arguments.length; ++i){if(typeof(arguments[i])=='undefined') return false;}
	return true;
}

function xDeleteCookie(name, path)
{
	xDeprecate('xDeleteCookie');
	if (xGetCookie(name)) {
		document.cookie = name + "=" +
			"; path=" + ((!path) ? "/" : path) +
			"; expires=" + new Date(0).toGMTString();
	}
}

function xDisplay(e,s)
{
	xDeprecate('xDisplay');
	if(!(e=xGetElementById(e))) return null;
	if(e.style && xDef(e.style.display)) {
		if (xStr(s)) e.style.display = s;
		return e.style.display;
	}
	return null;
}

function xEvent(evt) // object prototype
{
	xDeprecate('xEvent');
	var e = evt || window.event;
	if(!e) return;
	if(e.type) this.type = e.type;
	if(e.target) this.target = e.target;
	else if(e.srcElement) this.target = e.srcElement;

	// Section B
	if (e.relatedTarget) this.relatedTarget = e.relatedTarget;
	else if (e.type == 'mouseover' && e.fromElement) this.relatedTarget = e.fromElement;
	else if (e.type == 'mouseout') this.relatedTarget = e.toElement;
	// End Section B

	if(xOp6Dn) { this.pageX = e.clientX; this.pageY = e.clientY; }
	else if(xDef(e.pageX,e.pageY)) { this.pageX = e.pageX; this.pageY = e.pageY; }
	else if(xDef(e.clientX,e.clientY)) { this.pageX = e.clientX + xScrollLeft(); this.pageY = e.clientY + xScrollTop(); }

	// Section A
	if (xDef(e.offsetX,e.offsetY)) {
		this.offsetX = e.offsetX;
		this.offsetY = e.offsetY;
	}
	else if (xDef(e.layerX,e.layerY)) {
		this.offsetX = e.layerX;
		this.offsetY = e.layerY;
	}
	else {
		this.offsetX = this.pageX - xPageX(this.target);
		this.offsetY = this.pageY - xPageY(this.target);
	}
	// End Section A

	if (e.keyCode) { this.keyCode = e.keyCode; } // for moz/fb, if keyCode==0 use which
	else if (xDef(e.which) && e.type.indexOf('key')!=-1) { this.keyCode = e.which; }

	this.shiftKey = e.shiftKey;
	this.ctrlKey = e.ctrlKey;
	this.altKey = e.altKey;
}

function xFirstChild(e, t)
{
	xDeprecate('xFirstChild');
	var c = e ? e.firstChild : null;
	if (t) while (c && c.nodeName != t) { c = c.nextSibling; }
	else while (c && c.nodeType != 1) { c = c.nextSibling; }
	return c;
}

function xGetBodyWidth() {
	xDeprecate('xGetBodyWidth');
	var cw = xClientWidth();
	var sw = window.document.body.scrollWidth;
	return cw>sw?cw:sw;
}

function xGetBodyHeight() {
	xDeprecate('xGetBodyHeight');
	var cw = xClientHeight();
	var sw = window.document.body.scrollHeight;
	return cw>sw?cw:sw;
}

function xGetComputedStyle(oEle, sProp, bInt)
{
	xDeprecate('xGetComputedStyle');
	var s, p = 'undefined';
	var dv = document.defaultView;
	if(dv && dv.getComputedStyle){
		s = dv.getComputedStyle(oEle,'');
		if (s) p = s.getPropertyValue(sProp);
	}
	else if(oEle.currentStyle) {
		// convert css property name to object property name for IE
		var a = sProp.split('-');
		sProp = a[0];
		for (var i=1; i<a.length; ++i) {
			c = a[i].charAt(0);
			sProp += a[i].replace(c, c.toUpperCase());
		}
		p = oEle.currentStyle[sProp];
	}
	else return null;
	return bInt ? (parseInt(p) || 0) : p;
}

function xGetCookie(name)
{
	xDeprecate('xGetCookie');
	var value=null, search=name+"=";
	if (document.cookie.length > 0) {
		var offset = document.cookie.indexOf(search);
		if (offset != -1) {
			offset += search.length;
			var end = document.cookie.indexOf(";", offset);
			if (end == -1) end = document.cookie.length;
			value = unescape(document.cookie.substring(offset, end));
		}
	}
	return value;
}

function xGetElementById(e)
{
	xDeprecate('xGetElementById');
	if(typeof(e)!='string') return e;
	if(document.getElementById) e=document.getElementById(e);
	else if(document.all) e=document.all[e];
	else e=null;
	return e;
}

function xGetElementsByAttribute(sTag, sAtt, sRE, fn)
{
	xDeprecate('xGetElementsByAttribute');
	var a, list, found = new Array(), re = new RegExp(sRE, 'i');
	list = xGetElementsByTagName(sTag);
	for (var i = 0; i < list.length; ++i) {
		a = list[i].getAttribute(sAtt);
		if (!a) {a = list[i][sAtt];}
		if (typeof(a)=='string' && a.search(re) != -1) {
			found[found.length] = list[i];
			if (fn) fn(list[i]);
		}
	}
	return found;
}

function xGetElementsByClassName(c,p,t,f)
{
	xDeprecate('xGetElementsByClassName');
	var found = new Array();
	var re = new RegExp('\\b'+c+'\\b', 'i');
	var list = xGetElementsByTagName(t, p);
	for (var i = 0; i < list.length; ++i) {
		if (list[i].className && list[i].className.search(re) != -1) {
			found[found.length] = list[i];
			if (f) f(list[i]);
		}
	}
	return found;
}

function xGetElementsByTagName(t,p)
{
	xDeprecate('xGetElementsByTagName');
	var list = null;
	t = t || '*';
	p = p || document;
	if (xIE4 || xIE5) {
		if (t == '*') list = p.all;
		else list = p.all.tags(t);
	}
	else if (p.getElementsByTagName) list = p.getElementsByTagName(t);
	return list || new Array();
}

function xGetURLArguments()
{
	xDeprecate('xGetURLArguments');
	var idx = location.href.indexOf('?');
	var params = new Array();
	if (idx != -1) {
		var pairs = location.href.substring(idx+1, location.href.length).split('&');
		for (var i=0; i<pairs.length; i++) {
			nameVal = pairs[i].split('=');
			params[i] = nameVal[1];
			params[nameVal[0]] = nameVal[1];
		}
	}
	return params;
}

function xHeight(e,h)
{
	xDeprecate('xHeight');
	if(!(e=xGetElementById(e))) return 0;
	if (xNum(h)) {
		if (h<0) h = 0;
		else h=Math.round(h);
	}
	else h=-1;
	var css=xDef(e.style);
	if (e == document || e.tagName.toLowerCase() == 'html' || e.tagName.toLowerCase() == 'body') {
		h = xClientHeight();
	}
	else if(css && xDef(e.offsetHeight) && xStr(e.style.height)) {
		if(h>=0) {
			var pt=0,pb=0,bt=0,bb=0;
			if (document.compatMode=='CSS1Compat') {
				var gcs = xGetComputedStyle;
				pt=gcs(e,'padding-top',1);
				if (pt !== null) {
					pb=gcs(e,'padding-bottom',1);
					bt=gcs(e,'border-top-width',1);
					bb=gcs(e,'border-bottom-width',1);
				}
				// Should we try this as a last resort?
				// At this point getComputedStyle and currentStyle do not exist.
				else if(xDef(e.offsetHeight,e.style.height)){
					e.style.height=h+'px';
					pt=e.offsetHeight-h;
				}
			}
			h-=(pt+pb+bt+bb);
			if(isNaN(h)||h<0) return null;
			else e.style.height=h+'px';
		}
		h=e.offsetHeight;
	}
	else if(css && xDef(e.style.pixelHeight)) {
		if(h>=0) e.style.pixelHeight=h;
		h=e.style.pixelHeight;
	}
	return h;
}

function xHex(sn, digits, prefix)
{
	xDeprecate('xHex');
	var p = '';
	var n = Math.ceil(sn);
	if (prefix) p = prefix;
	n = n.toString(16);
	for (var i=0; i < digits - n.length; ++i) {
		p += '0';
	}
	return p + n;
}

function xHide(e){  xDeprecate('xHide'); return xVisibility(e,0);}

function xInnerHtml(e,h)
{
	xDeprecate('xInnerHtml');
	if(!(e=xGetElementById(e)) || !xStr(e.innerHTML)) return null;
	var s = e.innerHTML;
	if (xStr(h)) {e.innerHTML = h;}
	return s;
}

function xLeft(e, iX)
{
	xDeprecate('xLeft');
	if(!(e=xGetElementById(e))) return 0;
	var css=xDef(e.style);
	if (css && xStr(e.style.left)) {
		if(xNum(iX)) e.style.left=iX+'px';
		else {
			iX=parseInt(e.style.left);
			if(isNaN(iX)) iX=0;
		}
	}
	else if(css && xDef(e.style.pixelLeft)) {
		if(xNum(iX)) e.style.pixelLeft=iX;
		else iX=e.style.pixelLeft;
	}
	return iX;
}

function xMoveTo(e,x,y)
{
	xDeprecate('xMoveTo');
	xLeft(e,x);
	xTop(e,y);
}

function xName(e)
{
	xDeprecate('xName');
	if (!e) return e;
	else if (e.id && e.id != "") return e.id;
	else if (e.name && e.name != "") return e.name;
	else if (e.nodeName && e.nodeName != "") return e.nodeName;
	else if (e.tagName && e.tagName != "") return e.tagName;
	else return e;
}

function xNextSib(e,t)
{
	xDeprecate('xNextSib');
	var s = e ? e.nextSibling : null;
	if (t) while (s && s.nodeName != t) { s = s.nextSibling; }
	else while (s && s.nodeType != 1) { s = s.nextSibling; }
	return s;
}

function xNum()
{
	xDeprecate('xNum');
	for(var i=0; i<arguments.length; ++i){if(isNaN(arguments[i]) || typeof(arguments[i])!='number') return false;}
	return true;
}

function xOffsetLeft(e)
{
	xDeprecate('xOffsetLeft');
	if (!(e=xGetElementById(e))) return 0;
	if (xDef(e.offsetLeft)) return e.offsetLeft;
	else return 0;
}

function xOffsetTop(e)
{
	xDeprecate('xOffsetTop');
	if (!(e=xGetElementById(e))) return 0;
	if (xDef(e.offsetTop)) return e.offsetTop;
	else return 0;
}

function xPad(s,len,c,left)
{
	xDeprecate('xPad');
	if(typeof s != 'string') s=s+'';
	if(left) {for(var i=s.length; i<len; ++i) s=c+s;}
	else {for (i=s.length; i<len; ++i) s+=c;}
	return s;
}

function xPageX(e)
{
	xDeprecate('xPageX');
	if (!(e=xGetElementById(e))) return 0;
	var x = 0;
	while (e) {
		if (xDef(e.offsetLeft)) x += e.offsetLeft;
		e = xDef(e.offsetParent) ? e.offsetParent : null;
	}
	return x;
}

function xPageY(e)
{
	xDeprecate('xPageY');
	if (!(e=xGetElementById(e))) return 0;
	var y = 0;
	while (e) {
		if (xDef(e.offsetTop)) y += e.offsetTop;
		e = xDef(e.offsetParent) ? e.offsetParent : null;
	}
//  if (xOp7Up) return y - document.body.offsetTop; // v3.14, temporary hack for opera bug 130324 (reported 1nov03)
	return y;
}

function xParent(e, bNode)
{
	xDeprecate('xParent');
	if (!(e=xGetElementById(e))) return null;
	var p=null;
	if (!bNode && xDef(e.offsetParent)) p=e.offsetParent;
	else if (xDef(e.parentNode)) p=e.parentNode;
	else if (xDef(e.parentElement)) p=e.parentElement;
	return p;
}

function xPreventDefault(e)
{
	xDeprecate('xPreventDefault');
	if (e && e.preventDefault) e.preventDefault()
	else if (window.event) window.event.returnValue = false;
}

function xPrevSib(e,t)
{
	xDeprecate('xPrevSib');
	var s = e ? e.previousSibling : null;
	if (t) while(s && s.nodeName != t) {s=s.previousSibling;}
	else while(s && s.nodeType != 1) {s=s.previousSibling;}
	return s;
}

function xRemoveEventListener(e,eT,eL,cap)
{
	xDeprecate('xRemoveEventListener');
	if(!(e=xGetElementById(e))) return;
	eT=eT.toLowerCase();
	if((!xIE4Up && !xOp7Up) && e==window) {
		if(eT=='resize') { window.xREL=null; return; }
		if(eT=='scroll') { window.xSEL=null; return; }
	}
	var eh='e.on'+eT+'=null';
	if(e.removeEventListener) e.removeEventListener(eT,eL,cap);
	else if(e.detachEvent) e.detachEvent('on'+eT,eL);
	else eval(eh);
}

function xResizeTo(e,w,h)
{
	xDeprecate('xResizeTo');
	xWidth(e,w);
	xHeight(e,h);
}

function xScrollLeft(e, bWin)
{
	xDeprecate('xScrollLeft');
	var offset=0;
	if (!xDef(e) || bWin || e == document || e.tagName.toLowerCase() == 'html' || e.tagName.toLowerCase() == 'body') {
		var w = window;
		if (bWin && e) w = e;
		if(w.document.documentElement && w.document.documentElement.scrollLeft) offset=w.document.documentElement.scrollLeft;
		else if(w.document.body && xDef(w.document.body.scrollLeft)) offset=w.document.body.scrollLeft;
	}
	else {
		e = xGetElementById(e);
		if (e && xNum(e.scrollLeft)) offset = e.scrollLeft;
	}
	return offset;
}

function xScrollTop(e, bWin)
{
	xDeprecate('xScrollTop');
	var offset=0;
	if (!xDef(e) || bWin || e == document || e.tagName.toLowerCase() == 'html' || e.tagName.toLowerCase() == 'body') {
		var w = window;
		if (bWin && e) w = e;
		if(w.document.documentElement && w.document.documentElement.scrollTop) offset=w.document.documentElement.scrollTop;
		else if(w.document.body && xDef(w.document.body.scrollTop)) offset=w.document.body.scrollTop;
	}
	else {
		e = xGetElementById(e);
		if (e && xNum(e.scrollTop)) offset = e.scrollTop;
	}
	return offset;
}

function xSetCookie(name, value, expire, path)
{
	xDeprecate('xSetCookie');
	document.cookie = name + "=" + escape(value) +
		((!expire) ? "" : ("; expires=" + expire.toGMTString())) +
		"; path=" + ((!path) ? "/" : path);
}

function xShow(e) { xDeprecate('xShow'); return xVisibility(e,1);}


function xStr(s)
{
	xDeprecate('xStr');
	for(var i=0; i<arguments.length; ++i){if(typeof(arguments[i])!='string') return false;}
	return true;
}

function xTop(e, iY)
{
	xDeprecate('xTop');
	if(!(e=xGetElementById(e))) return 0;
	var css=xDef(e.style);
	if(css && xStr(e.style.top)) {
		if(xNum(iY)) e.style.top=iY+'px';
		else {
			iY=parseInt(e.style.top);
			if(isNaN(iY)) iY=0;
		}
	}
	else if(css && xDef(e.style.pixelTop)) {
		if(xNum(iY)) e.style.pixelTop=iY;
		else iY=e.style.pixelTop;
	}
	return iY;
}

function xVisibility(e, bShow)
{
	xDeprecate('xVisibility');
	if(!(e=xGetElementById(e))) return null;
	if(e.style && xDef(e.style.visibility)) {
		if (xDef(bShow)) e.style.visibility = bShow ? 'visible' : 'hidden';
		return e.style.visibility;
	}
	return null;
}

function xWidth(e,w)
{
	xDeprecate('xWidth');
	if(!(e=xGetElementById(e))) return 0;
	if (xNum(w)) {
		if (w<0) w = 0;
		else w=Math.round(w);
	}
	else w=-1;
	var css=xDef(e.style);
	if (e == document || e.tagName.toLowerCase() == 'html' || e.tagName.toLowerCase() == 'body') {
		w = xClientWidth();
	}
	else if(css && xDef(e.offsetWidth) && xStr(e.style.width)) {
		if(w>=0) {
			var pl=0,pr=0,bl=0,br=0;
			if (document.compatMode=='CSS1Compat') {
				var gcs = xGetComputedStyle;
				pl=gcs(e,'padding-left',1);
				if (pl !== null) {
					pr=gcs(e,'padding-right',1);
					bl=gcs(e,'border-left-width',1);
					br=gcs(e,'border-right-width',1);
				}
				// Should we try this as a last resort?
				// At this point getComputedStyle and currentStyle do not exist.
				else if(xDef(e.offsetWidth,e.style.width)){
					e.style.width=w+'px';
					pl=e.offsetWidth-w;
				}
			}
			w-=(pl+pr+bl+br);
			if(isNaN(w)||w<0) return null;
			else e.style.width=w+'px';
		}
		w=e.offsetWidth;
	}
	else if(css && xDef(e.style.pixelWidth)) {
		if(w>=0) e.style.pixelWidth=w;
		w=e.style.pixelWidth;
	}
	return w;
}

function xZIndex(e,uZ)
{
	xDeprecate('xZIndex');
	if(!(e=xGetElementById(e))) return 0;
	if(e.style && xDef(e.style.zIndex)) {
		if(xNum(uZ)) e.style.zIndex=uZ;
		uZ=parseInt(e.style.zIndex);
	}
	return uZ;
}

function xStopPropagation(evt)
{
	xDeprecate('xStopPropagation');
	if (evt && evt.stopPropagation) evt.stopPropagation();
	else if (window.event) window.event.cancelBubble = true;
}
