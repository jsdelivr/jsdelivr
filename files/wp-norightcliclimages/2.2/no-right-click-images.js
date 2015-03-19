/**************************************************************************
This javascript is used by the no-right-click-images plugin for wordpress.
Version 2.2
Please give credit as no-right-click-images.js by Keith P. Graham
http://www.blogseye.com
**************************************************************************/
var kpg_nrci_targImg=null;
var kpg_nrci_targSrc=null;
var kpg_nrci_inContext=false;
var kpg_nrci_notimage=new Image();
var kpg_nrci_limit=0;
function kpg_nrci_dragdropAll(event) {
	try {
		var ev=event||window.event;
		var targ=ev.srcElement||ev.target;
		if (targ.tagName.toUpperCase()=="A") {
			// is this IE and are we dragging a link to the image?
			var hr=targ.href;
			hr=hr.toUpperCase();
			if (hr.indexOf('.JPG')||hr.indexOf('.PNG')||hr.indexOf('.GIF')) {
				ev.returnValue=false;
				if (ev.preventDefault) {  
					ev.preventDefault(); 
				}
				kpg_nrci_inContext=false;
				return false;
			}
		}
		if (targ.tagName.toUpperCase()!="IMG") return true;
		ev.returnValue=false;
		if (ev.preventDefault) {  
			ev.preventDefault(); 
		}
		kpg_nrci_inContext=false;
		return false;
	} catch (er) {
		//alert(er);
	}
	return true;
}
function kpg_nrci_dragdrop(event) {
	// I am beginning to doubt if this event ever fires
	try {
		var ev=event||window.event;
		var targ=ev.srcElement||ev.target;
		ev.returnValue=false;
		if (ev.preventDefault) {  
			ev.preventDefault(); 
		}
		ev.returnValue=false;
		kpg_nrci_inContext=false;
		return false;
	} catch (er) {
		//alert(er);
	}
	return true;
}
function kpg_nrci_context(event) {
	try {
		kpg_nrci_inContext=true;
		var ev=event||window.event;
		var targ=ev.srcElement||ev.target;
		kpg_nrci_replace(targ);
		ev.returnValue=false;
		if (ev.preventDefault) {  
			ev.preventDefault(); 
		}
		ev.returnValue=false;
		kpg_nrci_targImg=targ;
	} catch (er) {
		//alert(er);
	}
	return false;
}
function kpg_nrci_contextAll(event) {
	try {
		if (kpg_nrci_targImg==null) {
			return true;
		}
		kpg_nrci_inContext=true;
		var ev=event||window.event;
		var targ=ev.srcElement||ev.target;
		if (targ.tagName.toUpperCase()=="IMG") {
			ev.returnValue=false;
			if (ev.preventDefault) {  
				ev.preventDefault(); 
			}
			ev.returnValue=false;
			kpg_nrci_replace(targ);
			return false;
		} 
		return true;
	} catch (er) {
		//alert(er);
	}
	return false;

}

function kpg_nrc1_mousedown(event) {
	try {
		kpg_nrci_inContext=false;
		var ev=event||window.event;
		var targ=ev.srcElement||ev.target;
		if (ev.button==2) {
			kpg_nrci_replace(targ);
			return false;
		}
		kpg_nrci_targImg=targ;
		if (kpg_nrci_drag=='Y')  {
			if (ev.preventDefault) {  
				ev.preventDefault(); 
			} 
		}
		return true;
	} catch (er) {
		//alert(er);
	}
	return true;
}
function kpg_nrc1_mousedownAll(event) {
	try {
		kpg_nrci_inContext=false;
		var ev=event||window.event;
		var targ=ev.srcElement||ev.target;
		if (targ.style.backgroundImage!=''&&ev.button==2) {
			targ.oncontextmenu=function(event) { return false;} //iffy - might not work
		} 
		if (targ.tagName.toUpperCase()=="IMG") {
			if (ev.button==2) {
				kpg_nrci_replace(targ);
				return false;
			}
			if (kpg_nrci_drag=='Y')  {
				if (ev.preventDefault) {  
					ev.preventDefault(); 
				} 
			}
			kpg_nrci_targImg=targ;
		}
		return true;
	} catch (er) {
		//alert(er);
	}
	return true;
}
function kpg_nrci_replace(targ) {
	if (kpg_nrci_targImg!=null && kpg_nrci_targImg.src==kpg_nrci_notimage.src) {
		// restore the old image before hiding this one
		kpg_nrci_targImg.src=kpg_nrci_targSrc;
		kpg_nrci_targImg=null;
		kpg_nrci_targSrc=null;
	}
	kpg_nrci_targImg=targ;
    if (kpg_nrci_extra!='Y') return;
	var w=targ.width+'';
	var h=targ.height+'';
	if (w.indexOf('px')<=0) w=w+'px';
	if (h.indexOf('px')<=0) h=h+'px';
	kpg_nrci_targSrc=targ.src;
	targ.src=kpg_nrci_notimage.src;
	targ.style.width=w;
	targ.style.height=h;
	kpg_nrci_limit=0;
	var t=setTimeout("kpg_nrci_restore()",500);
	return false;
}
function kpg_nrci_restore() {
	if (kpg_nrci_inContext) {
		if (kpg_nrci_limit<=20) {
			kpg_nrci_limit++;
			var t=setTimeout("kpg_nrci_restore()",500);
			return;
		}
	}
	kpg_nrci_limit=0;
	if (kpg_nrci_targImg==null) return;
	if (kpg_nrci_targSrc==null) return;
	kpg_nrci_targImg.src=kpg_nrci_targSrc;
	kpg_nrci_targImg=null;
	kpg_nrci_targSrc=null;
	return;
}
// sets the image onclick event
// need to check for dblclick to see if there is a right double click in IE
function kpg_nrci_action(event) {
	try {
		document.onmousedown=function(event) { return kpg_nrc1_mousedownAll(event);} 
		document.oncontextmenu=function(event) { return kpg_nrci_contextAll(event);}   
		document.oncopy=function(event) { return kpg_nrci_contextAll(event);}   
		if (kpg_nrci_drag=='Y') document.ondragstart=function(event) { return kpg_nrci_dragdropAll(event);}  
		var b=document.getElementsByTagName("IMG");
		for (var i = 0; i < b.length; i++) {
			b[i].oncontextmenu=function(event) { return kpg_nrci_context(event);}   
			b[i].oncopy=function(event) { return kpg_nrci_context(event);}   
			b[i].onmousedown=function(event) { return kpg_nrc1_mousedown(event);} 
			if (kpg_nrci_drag=='Y') b[i].ondragstart=function(event) { return kpg_nrci_dragdrop(event);} 
		}
	} catch (er) {
		return false;
	}
}
if (typeof(kpg_nrci_image) == 'undefined' || kpg_nrci_image=='' || typeof(kpg_nrci_extra) == 'undefined'|| typeof(kpg_nrci_drag) == 'undefined') {
	//alert("vars not found: "+kpg_nrci_image+","+kpg_nrci_extra);
} else {
	kpg_nrci_notimage.src=kpg_nrci_image;
 	if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", function(event) { kpg_nrci_action(event); }, false);
	} else if (window.attachEvent) {
		window.attachEvent("onload", function(event) { kpg_nrci_action(event); });
	} else {
		var oldFunc = window.onload;
		window.onload = function() {
			if (oldFunc) {
				oldFunc();
			}
				kpg_nrci_action('load');
		};
	}
} 
