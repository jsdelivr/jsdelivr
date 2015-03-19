// SpryPanAndZoomPlugin.js - version 0.2 - Spry Pre-Release 1.7
//
// Copyright (c) 2008. Adobe Systems Incorporated.
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

(function() { // BeginSpryComponent

if (typeof Spry == "undefined" || !Spry.Widget || !Spry.Widget.ImageSlideShow)
{
	alert("SpryPanAndZoomPlugin.js requires SpryImageSlideShow.js!");
	return;
}

var gPZP = Spry.Widget.ImageSlideShow.PanAndZoomPlugin = {
	config: {
		defaultPanZoomSettings: [
			[  50,  50, 200,  50,  50, 100 ], // Zoom out from center.
	
			[   0,   0, 200, 100, 100, 100 ], // Pan from upper-left to lower-right.
			[ 100, 100, 200,   0,   0, 100 ], // Pan from lower-right to upper-left.
	
			[   0, 100, 200, 100,   0, 100 ], // Pan from lower-left to upper-right.
			[ 100,   0, 200,   0, 100, 100 ], // Pan from upper-right to lower-left.
	
			[  50,   0, 200,  50, 100, 100 ], // Pan from top to bottom.
			[  50, 100, 200,  50,   0, 100 ], // Pan from bottom to top.
	
			[   0,  50, 200, 100,  50, 100 ], // Pan from left to right.
			[ 100,  50, 200,   0,  50, 100 ]  // Pan from right to left.
		]
	},

	initialize: function(ss)
	{
		ss.panAndZoomInfo = { animations: [], pzSettings: [] };
		ss.addObserver(this);
	},

	fitAtoBRatio: function(aW, aH, bW, bH)
	{
		return Math.max(bW/aW, bH/aH);
	},

	onPostAttachViewBehaviors: function(ss,evt)
	{
		var clip = Spry.$$("." + ss.clipClass, ss.element)[0];
		ss.makePositioned(clip);
	
		Spry.$$("." + ss.clipClass + " img", ss.element).forEach(function(n){ n.style.top = n.style.left = 0; n.style.position = "absolute"; });
	},

	onPostExtractImageInfo: function(ss, evt)
	{
		var re = evt.repeatingElements;
		var pzs = ss.panAndZoomInfo.pzSettings;

		for (var i = 0; i < re.length; i++)
		{
			var e = re[i];

			var v = e.getAttribute("rel");
			if (!v)
				v = e.getAttribute("alt");

			var p = pzs[i] = new Object;

			if (v && v.search(/\[(\s*\d+\s*,){5}\s*\d+\s*\]/) != -1)
			{
				var m = v.match(/\[(\s*\d+\s*,){5}\s*\d+\s*\]/);
				if (m)
				{
					var pz = m[0].replace(/\[|\|\s*]/g, "").split(",");
					p.x1 = parseFloat(pz[0]);
					p.y1 = parseFloat(pz[1]);
					p.z1 = parseFloat(pz[2]);
					p.x2 = parseFloat(pz[3]);
					p.y2 = parseFloat(pz[4]);
					p.z2 = parseFloat(pz[5]);
				}
			}
		}
	},

	onPostStartSlideShow: function(ss, evt)
	{
		var slideIndex = ss.getCurrentSlideIndex();
		if (slideIndex >= 0)
			gPZP.setupSlide(ss, ss.getCurrentSlide(), slideIndex);
	},
	
	onPostStopSlideShow: function(ss, evt)
	{
		gPZP.stopAnimations(ss);
	},
	
	addAnimation: function(ss, anim)
	{
		ss.panAndZoomInfo.animations.push(anim);
		anim.addObserver({ onAnimationComplete: function(){ gPZP.removeAnimation(ss, anim); } });
	},

	removeAnimation: function(ss, anim)
	{
		var anims = ss.panAndZoomInfo.animations;
		if (anims)
		{
			for (var i = 0; i < anims.length; i++)
				if (anims[i] == anim)
				{
					anims.splice(i, 1);
					return;
				}
		}
	},

	stopAnimations: function(ss)
	{
		var anims = ss.panAndZoomInfo.animations;
		while (anims && anims.length)
			anims.pop().stop();
	},

	getPanZoomSettings: function(ss, slideIndex)
	{
		var result = {};

		var info = ss.imageInfo[slideIndex];
		
		result.width = info.width;
		result.height = info.height;

		// Get any pan and zoom settings from the specified element.
	
		Spry.Widget.setOptions(result, ss.panAndZoomInfo.pzSettings[slideIndex]);
	
		// If the element had no pan and zoom settings, pick a random
		// set from the defaults.
	
		if (typeof result.x1 == "undefined")
		{
			var pzs = gPZP.config.defaultPanZoomSettings[Math.round(Math.random() * (gPZP.config.defaultPanZoomSettings.length - 1))];
	
			result.x1 = pzs[0];
			result.y1 = pzs[1];
			result.z1 = pzs[2];
			result.x2 = pzs[3];
			result.y2 = pzs[4];
			result.z2 = pzs[5];
		}
	
		return result;
	},

	getCenteredClippedViewRect: function(x, y, iw, ih, vw, vh)
	{
		var hvw = vw / 2;
		var hvh = vh / 2;
	
		var vx = x - hvw;
		var vy = y - hvh;
	
		var vx2 = x + hvw;
		var vy2 = y + hvh;
	
		var pos = { x: vx, y: vy };
	
		if (vx < 0)
			pos.x = 0;
		else if (vx2 > iw)
			pos.x = iw - vw;
	
		if (vy < 0)
			pos.y = 0;
		else if (vy2 > ih)
			pos.y = ih - vh;
	
		return { x: pos.x, y: pos.y, w: vw, h: vh };
	},


	setupSlide: function(ss, slide, slideIndex)
	{
		if (!ss || !slide)
			return;
	
		// Get the dimensions of the clip view.
	
		var clip = Spry.$$("." + ss.clipClass, ss.element)[0];
		var cw = clip.offsetWidth;
		var ch = clip.offsetHeight;
	
		// Now get the original dimensions of the image
		// in the current slide and calculate the ratio
		// that will cause the image to minimally fill up
		// the clip view area.
	
		var ele = Spry.$$("img", slide)[0];
	
		var kb = gPZP.getPanZoomSettings(ss, slideIndex);
	
		var iw = kb.width;
		var ih = kb.height;
	
		var ratio = gPZP.fitAtoBRatio(iw, ih, cw, ch);
	
		if (ss.isInPlayMode())
		{
			var startZoom = ratio * kb.z1 / 100;
			var endZoom   = ratio * kb.z2 / 100;
		
			var sw = iw * startZoom;
			var sh = ih * startZoom;
			var sx = sw * kb.x1 / 100;
			var sy = sh * kb.y1 / 100;
		
			var startRect = gPZP.getCenteredClippedViewRect(sx, sy, sw, sh, cw, ch);
		
			var ew = iw * endZoom;
			var eh = ih * endZoom;
			var ex = ew * kb.x2 / 100;
			var ey = eh * kb.y2 / 100;
		
			var endRect = gPZP.getCenteredClippedViewRect(ex, ey, ew, eh, cw, ch);
		
			ele.style.width  = sw + "px";
			ele.style.height = sh + "px";
			ele.style.left   = -startRect.x + "px";
			ele.style.top    = -startRect.y + "px";
	
			var anim = new Spry.Effect.CSSAnimator(ele, "top: " + (-endRect.y) + "px; left: " + (-endRect.x) + "px; width: " + ew + "px; height: " + eh + "px;", { dropFrames: ss.dropFrames, duration: ss.displayInterval + (ss.transitionDuration) });
			gPZP.addAnimation(ss, anim);
			anim.start();
		}
		else
		{
			if (iw > cw || ih > ch)
			{
				var ratio = gPZP.fitAtoBRatio(cw, ch, iw, ih);
	
				iw = Math.round(iw / ratio);
				ih = Math.round(ih / ratio);
			}
	
			ele.style.width = iw + "px";
			ele.style.height = ih + "px";
			ele.style.left = Math.round((cw - iw) / 2) + "px";
			ele.style.top = Math.round((ch - ih) / 2) + "px";
		}
	},

	onPostShowSlide: function(ss, evt)
	{
		if (evt.slideIndex >= 0)
			gPZP.setupSlide(ss, evt.target, evt.slideIndex);
	}
};

})(); // EndSpryComponent