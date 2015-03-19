// SpryTitleSliderPlugin.js - version 0.3 - Spry Pre-Release 1.7
//
// Copyright (c) 2010. Adobe Systems Incorporated.
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
	alert("SpryTitleSliderPlugin.js requires SpryImageSlideShow.js!");
	return;
}

var defaultConfig = {
	direction: "up", // up, down, left, right
	duration: 500,
	pluginOptionsProp: "TSP"
};

var gTSP = Spry.Widget.ImageSlideShow.TitleSliderPlugin = {
	config: defaultConfig,

	initialize: function(ss)
	{
		var opts = ss.titleSliderPluginInfo = {};
		ss.setOptions(opts, defaultConfig);
		ss.setOptions(opts, ss[defaultConfig.pluginOptionsProp]);
		
		opts.animationLock = 0;
		opts.showTitleFunc = function() { gTSP.showTitle(ss); };

		var dir = opts.direction;

		opts.scrollDimension = (dir == "down" || dir == "right") ? "scrollWidth" : "scrollHeight";
		opts.sideProp =  (dir == "left" || dir == "right") ? "left" : "top";
		opts.distPrefix = (dir == "down" || dir == "right") ? "-" : "";
	
		ss.addObserver(this);
	},

	showTitle: function(ss)
	{
		var t = ss.titleSliderPluginInfo.clipEle;
		var c = ss.titleSliderPluginInfo.contentEle;
		if (t && c)
		{
			var info = ss.titleSliderPluginInfo;
			c.style[info.sideProp] = info.distPrefix + t[info.scrollDimension] + "px";
			c.style.visibility = "visible";

			var anim = new Spry.Effect.CSSAnimator(c, info.sideProp + ": 0px", { duration: info.duration });
			anim.start();
		}
	},

	hideTitle: function(ss, slideIndex)
	{
		var t = ss.titleSliderPluginInfo.clipEle;
		var c = ss.titleSliderPluginInfo.contentEle;
		if (t && c)
		{
			var info = ss.titleSliderPluginInfo;
			var anim = new Spry.Effect.CSSAnimator(c, info.sideProp + ": " + info.distPrefix + t[info.scrollDimension] + "px", {
				duration: info.duration,
				onComplete: function() {
					c.style.visibility = "hidden";
					if (slideIndex >= 0)
						ss.showSlide(slideIndex);
				}
			});
			anim.start();
		}
	},

	onPostTransformMarkup: function(ss,evt)
	{
		var ele = Spry.$$("."+ss.slideTitleClass, ss.element)[0];
		if (ele && ele.contentContainer)
		{
			var clip = ss.titleSliderPluginInfo.clipEle = ele.contentContainer;
			clip.style.overflow = "hidden";
			var content = document.createElement(clip.nodeName.toLowerCase() == "div" ?  "div" : "span");
			ss.appendChildNodes(content, ss.extractChildNodes(clip));
			clip.appendChild(content);
			content.style.position = "relative";
			ss.titleSliderPluginInfo.contentEle = content;
		}
	},

	onPreShowSlide: function(ss,evt)
	{
		var pi = ss.titleSliderPluginInfo;

		if (pi.showTimerID)
		{
			clearTimeout(pi.showTimerID);
			pi.showTimerID = 0;
		}

		if (pi.clipEle)
		{
			if(!pi.animationLock)
			{
				++pi.animationLock;
				gTSP.hideTitle(ss, evt.slideIndex);
				evt.preventDefault();
				return;
			}
			--pi.animationLock;
		}
	},
	
	onPreUpdateSlideTitle: function(ss,evt)
	{
		// We need to override the default updateSlideTitle() implementation so we can insert
		// the title into our content element.

		var pi = ss.titleSliderPluginInfo;
		if (pi.clipEle)
		{
			pi.contentEle.innerHTML = evt.title ? evt.title : "";
	
			// Delay the show until after the slide transition finishes.
			pi.showTimerID = setTimeout(pi.showTitleFunc, ss.transitionDuration);

			// Tell the slide show not to set the title label.
			evt.preventDefault();
		}
	}
};

})(); // EndSpryComponent