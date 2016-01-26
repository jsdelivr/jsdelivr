/**
 * Hacks a few jQuery internals to make style rule objects
 * returned by the $.stylesheet plugin work with jQuery's animate()
 * 
 * @author Vimal Aravindashan
 * @version 0.1.0
 * @licensed MIT license
 */
(function() {
	/*
	 * window.getComputedStyle() does not make sense to CSSStyleRule objects,
	 * so return the rule's style itself.
	 * For browsers that do not support getComputedStyle(), we'll add cssHooks.  
	 */
	if ( window.getComputedStyle ) {
		var _getComputedStyle = window.getComputedStyle;
		window.getComputedStyle = function (elem, arg) {
			if(elem.parentStyleSheet) {
				return elem.style;
			} else {
				return _getComputedStyle(elem, arg);
			}
		};
	} else if ( document.documentElement.currentStyle ) {
		//TODO: iterate over each style and check if it accepts 'auto' as a value
		//      add hooks for all style that fail; or experiment with each style and list all of them here
		jQuery.cssHooks.display = {
			get: function (elem) {
				return (elem.parentStyleSheet && elem.style.display === '') ? document.documentElement.currentStyle.display : elem.style.display;
			}
		};
	}
	
	/*
	 * Accessing 'style.removeAttribute' of a style rule object on IE < 9 crashes the browser.
	 * No, not just the script, the browser itself! So, we'll have to re-wire the opacity hook.
	 */
	if (!jQuery.support.opacity && jQuery.cssHooks.opacity) {
		var opacityHooks = jQuery.cssHooks.opacity,
			ralpha = /alpha\([^)]*\)/i;
		jQuery.cssHooks.opacity = {
			get: opacityHooks.get,
			set: function( elem, value ) {
				if(elem.parentStyleSheet) {
					var style = elem.style,
					currentStyle = elem.currentStyle,
					opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
					filter = currentStyle && currentStyle.filter || style.filter || "";
					
					// IE has trouble with opacity if it does not have layout
					// Force it by setting the zoom level
					style.zoom = 1;
					
					// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
					// if value === "", then remove inline opacity #12685
					if ( ( value >= 1 || value === "" ) &&
							jQuery.trim( filter.replace( ralpha, "" ) ) === "" /*&&
							style.removeAttribute*/) {
						
						// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
						// if "filter:" is present at all, clearType is disabled, we want to avoid this
						// style.removeAttribute is IE Only, but so apparently is this code path...
						style.setAttribute( "filter", '', 1 );
						style.cssText = style.cssText.replace(/FILTER: ;/i, '');
						
						// if there is no filter style applied in a css rule or unset inline opacity, we are done
						if ( value === "" || currentStyle && !currentStyle.filter ) {
							return;
						}
					}
					
					// otherwise, set new filter values
					style.filter = ralpha.test( filter ) ?
						filter.replace( ralpha, opacity ) :
						filter + " " + opacity;
				} else {
					opacityHooks.set(elem, value);
				}
			}
		};
	}
})();