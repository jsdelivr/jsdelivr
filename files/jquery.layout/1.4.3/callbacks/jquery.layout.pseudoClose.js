/**
 *	UI Layout Callback: pseudoClose
 *
 *	Prevent panes from closing completely so that an iframes/objects 
 *	does not reload/refresh when pane 'opens' again.
 *	This callback preventing a normal 'close' and instead resizes the pane as small as possible
 *
 *	SAMPLE:
 *	pseudoClose:	{ selector: "#myObject" }
 *	south__onclose:	$.layout.callbacks.pseudoClose
 *
 *	Version:	1.1 - 2012-03-10
 *	Author:		Kevin Dalman (kevin@jquery-dev.com)
 */
;(function ($) {

// make sure the callbacks branch exists
$.layout.callbacks = $.layout.callbacks || {};

// make sure $.layout.defaults exists (backward compatibility)
$.layout.defaults = $.layout.defaults || { north:{}, south:{}, east:{}, west:{}, center:{} };


// init default pseudoClose-options when library loads
for (var i=0; i<4; i++) {
	$.layout.defaults[ ["north","south","east","west"][i] ].pseudoClose = {
		hideObject:	"iframe" // find and hide this when 'closed' - usually: "", "pane", "iframe" or "object"
	,	skipIE:		false	// can skip IE for iframes that do not contain media objects
	}
};

$.layout.callbacks.pseudoClose = function (pane, $Pane, paneState, paneOptions) {
	// if pane is 'hiding', then allow that to happen normally
	if (paneState.isHiding) return true;

	var fN	= "pseudoClose"
	,	o	= paneOptions
	,	oFn	= $.extend({}, $.layout.defaults[pane][fN], o[fN]) // COPY the pseudoClose options
	;
	if (oFn.skipIE && $.layout.browser.msie) return true; // ALLOW close
	if (oFn.hideObject === "object") oFn.hideObject += ",embed"; // 'embedded objects' are often <EMBED> tags

	setTimeout(function(){
		var	sel		= oFn.hideObject
		,	$Obj	= sel === "pane" || $Pane[0].tagName === sel.toUpperCase() ? $Pane : $Pane.find(sel)
		,	layout	= $Pane.data("parentLayout")
		,	s		= layout.state[pane]	// TEMP until paneState is *no longer* a 'copy' (RC29.15)
		,	d		= s[fN] || {}
		,	siz		= 'size'
		,	min		= 'minSize'
		,	rsz		= "resizable"
		,	vis		= "visibility"
		,	v		= "visible"
		,	h		= "hidden"
		;
		if (d[siz]) {
			if (d[rsz]) layout.enableResizable(pane); // RE-ENABLE manual-resizing
			o[min] = d[min];				// RESET minSize option
			layout.setSizeLimits(pane);		// REFRESH state.minSize with new option
			layout.sizePane(pane, d[siz]);	// RESET to last-size
			d = {};							// CLEAR data logic
			$Obj.css(vis,h).css(vis,v);		// fix visibility bug
		}
		else {
			d[siz] = s[siz];				// SAVE current-size
			d[min] = o[min];				// ditto
			o[min] = 0;						// SET option so pane shrinks as small as possible
			d[rsz] = o[rsz];				// SAVE resizable option
			layout.disableResizable(pane);	// DISABLE manual-resizing while pseudo-closed
			layout.setSizeLimits(pane);		// REFRESH state.minSize with new option
			layout.sizePane(pane, s[min]);	// SIZE to minimum-size
			$Obj.css(vis,h);				// HIDE pane or object (only if hideObject is set & exists)
		}
		s[fN] = d; // save data
	}, 50);

	return false; // CANCEL normal 'close'
};
})( jQuery );