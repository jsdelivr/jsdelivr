YUI.add('gallery-scrollview-touch', function (Y, NAME) {

/**
 *
 * YUI Module to use CSS scrollviews for supported touch devices.
 *
 * Copyright Julien Sanchez 2013.
 *
 * Full code on github : https://github.com/julesanchez
 *
 * Code licensed under the BSD License:
 * http://developer.yahoo.net/yui/license.txt
 *
 */
	
	var TOUCH_ACTION_VENDOR_PREFIX = "",
		hasIt = "",
		VENDORS = ['-webkit-', '-moz-', '-o-', '-ms-'];

	Y.Array.each(VENDORS, function(val) {
		var property = val + 'touch-action';
		if (property in Y.config.doc.body.style) {
			TOUCH_ACTION_VENDOR_PREFIX = val;
		}
	});

	function hasOverflowScrolling()
	{
		if (hasIt === "")
		{
			hasIt = false;
			if (TOUCH_ACTION_VENDOR_PREFIX !== "")
			{
				hasIt = true;
			}
			else if (parseInt(Y.UA.chrome, 10) > 18 || parseInt(Y.UA.android, 10) > 3)
			{
				// Latest versions of chrome & webkit having the feature but returning false.
				// See http://stackoverflow.com/questions/15906508/chrome-browser-for-android-no-longer-supports-webkit-overflow-scrolling-is-the
				hasIt = true;
			}
			else
			{
				var div = document.createElement('div'),
					body = document.getElementsByTagName('body')[0],
					prefixes = ['webkit', 'moz', 'o', 'ms'],
					prefix,
					i,
					computedStyle;
				
				body.appendChild(div);

				for (i = 0; i < prefixes.length; i++) {
					prefix = prefixes[i];
					div.style[prefix + 'OverflowScrolling'] = 'touch';
				}
				
				div.style.overflowScrolling = 'touch';
				computedStyle = window.getComputedStyle(div);
				
				hasIt = !!computedStyle.overflowScrolling;
				
				for (i = 0; i < prefixes.length; i++) {
					prefix = prefixes[i];
					if (!!computedStyle[prefix + 'OverflowScrolling']) {
					hasIt = true;
					break;
					}
				}
				
				div.parentNode.removeChild(div);
			}
		}
		
		return hasIt;
	}

	Y.ScrollViewTouch = function (config)
	{

		var node = Y.one(config.srcNode),
			styles = node.getAttribute("style"),
			sv;

		if (hasOverflowScrolling())
		{
			sv = {isNative: true, scrollbox: node};
			if (config.axis === 'X')
			{
				// we use setAttibute() instead of setStyles to avoid browser repainting
				styles +=  "width:" + config.width + "px;overflow-x:scroll;overflow-y:hidden;z-index:0;";
				if (Y.UA.webkit)
				{
					styles += "-webkit-overflow-scrolling: touch;-webkit-transform:translate3d(0,0,0)";
				}
				if (TOUCH_ACTION_VENDOR_PREFIX !== "")
				{
					styles += TOUCH_ACTION_VENDOR_PREFIX + "touch-action: pan-x;";
				}
				node.setAttribute("style",styles);

			}
			else if (config.axis === 'Y')
			{
				styles +=  "height:" + config.height + "px;overflow-y:scroll;overflow-x:hidden;z-index:0;";
				if (Y.UA.webkit)
				{
					styles += "-webkit-overflow-scrolling: touch;-webkit-transform:translate3d(0,0,0)";
				}
				if (TOUCH_ACTION_VENDOR_PREFIX !== "")
				{
					styles += TOUCH_ACTION_VENDOR_PREFIX + "touch-action: pan-y;";
				}
				node.setAttribute("style",styles);
			}
			else
			{
			}
		}
		else
		{
			// if device has no touch scrolls, we fallback with YUI3 classical scrollview
			sv =  new Y.ScrollView({
				srcNode: node,
				height: config.height,
				width: config.width,
				deceleration: config.deceleration,
				bounce: config.bounce,
				axis: config.axis,
				flick: config.flick,
				drag: config.drag,
				snapduration: config.snapduration,
				snapEasing: config.snapEasing,
				easing: config.easing,
				bounceRange: config.bounceRange,
				frameduration: config.frameDuration
			});
			sv.render();
		}
		return sv;
	}


}, 'gallery-2013.07.31-22-47', {"requires": ["base", "yui-base", "node", "scrollview-base", "event-touch"], "skinnable": false});
