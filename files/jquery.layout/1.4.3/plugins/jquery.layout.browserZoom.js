/**
 * @preserve jquery.layout.browserZoom 1.0
 * $Date: 2011-12-29 08:00:00 (Thu, 29 Dec 2011) $
 *
 * Copyright (c) 2012 
 *   Kevin Dalman (http://allpro.net)
 *
 * Dual licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 * and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * @dependancies: UI Layout 1.3.0.rc30.1 or higher
 *
 * @support: http://groups.google.com/group/jquery-ui-layout
 *
 * @todo: Extend logic to handle other problematic zooming in browsers
 * @todo: Add hotkey/mousewheel bindings to _instantly_ respond to these zoom event
 */
;(function ($) {
			
var _ = $.layout;

// tell Layout that the plugin is available
_.plugins.browserZoom = true;

_.defaults.browserZoomCheckInterval = 1000;
_.optionsMap.layout.push("browserZoomCheckInterval");

/*
 *	browserZoom methods
 */
_.browserZoom = {

	_init: function (inst) {
		$.layout.browserZoom._setTimer(inst);
	}

,	_setTimer: function (inst) {
		if (inst.destroyed) return;
		var o = inst.options
		,	s = inst.state
		,	z = s.browserZoom = $.layout.browserZoom.ratio()
		;
		if (o.resizeWithWindow && z !== false) {
			setTimeout(function(){
				if (inst.destroyed) return;
				var d = $.layout.browserZoom.ratio();
				if (d !== s.browserZoom) {
					s.browserZoom = d;
					inst.resizeAll();
				}
				$.layout.browserZoom._setTimer(inst); // set a NEW timeout
			},	Math.max( o.browserZoomCheckInterval, 100 )); // MINIMUM 100ms interval, for performance
		}
	}

,	ratio: function () {
		var w	= window
		,	s	= screen
		,	d	= document
		,	dE	= d.documentElement || d.body
		,	b	= $.layout.browser
		,	v	= b.version
		,	r, sW, cW
		;
		// we can ignore all browsers that fire window.resize event onZoom
		if (!b.msie || v > 8)
			return false; // don't need to track zoom
		if (s.deviceXDPI)
			return calc(s.deviceXDPI, s.systemXDPI);
		// everything below is just for future reference!
		if (b.webkit && (r = d.body.getBoundingClientRect))
			return calc((r.left - r.right), d.body.offsetWidth);
		if (b.webkit && (sW = w.outerWidth))
			return calc(sW, w.innerWidth);
		if ((sW = s.width) && (cW = dE.clientWidth))
			return calc(sW, cW);
		return false; // no match, so cannot - or don't need to - track zoom

		function calc (x,y) { return (parseInt(x,10) / parseInt(y,10) * 100).toFixed(); }
	}

};
// add initialization method to Layout's onLoad array of functions
_.onReady.push( $.layout.browserZoom._init );

})( jQuery );