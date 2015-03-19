// SpryMorphPanels.js - version 0.6 - Spry Pre-Release 1.7
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

if (typeof Spry == "undefined" || !Spry.Widget || !Spry.Widget.PanelSet)
{
	alert("SpryMorphPanels.js requires SpryPanelSet.js!");
	return;
}

Spry.Widget.MorphPanels = function(elements, opts)
{
	this.element = Spry.$$(elements)[0];
	this.transitionEffect = null;

	var panels = this.getElementChildren(this.element);

	// Override any of the global defaults with options passed into
	// the constructor.

	var mergedOpts = this.setOptions(this.setOptions({}, Spry.Widget.MorphPanels.config), opts);

	Spry.Widget.PanelSet.call(this, panels, mergedOpts);
};

Spry.Widget.MorphPanels.prototype = new Spry.Widget.PanelSet();
Spry.Widget.MorphPanels.prototype.constructor = Spry.Widget.MorphPanels;


Spry.Widget.MorphPanels.config = {
	defaultPanel:   0,

	minWidth:       0,
	minHeight:      0,

	// Runtime class names.

	visibleClass:   "MorphPanelVisible",
	hiddenClass:    "MorphPanelHidden",
	animatingClass: "MorphPanelAnimating",

	morphType:       "normal", // "widthFirst", "heightFirst", "normal"
	fadeOutDuration: 500, // msecs
	fadeInDuration:  500, // msecs
	sizeDuration:    500, // msecs

	// Slide Show Mode properties.

	autoPlay:       false,
	displayInterval: 4000, // msecs
	displayTimerID:  0,
	
	// Suppress check for setting same panel - set to true if same panel may be shown during its own animation
	disableCurrentPanelCheck: false
};

Spry.Widget.MorphPanels.prototype.initialize = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreInitialize", evt);
	if (!evt.performDefaultAction)
		return;

	this.defaultPanel = this.indexToElement(this.defaultPanel);

	this.makePositioned(this.element);
	this.element.style.overflow = "hidden";

	var panels = this.getPanels();

	for (var i = 0; i < panels.length; i++)
	{
		var p = panels[i];
		
		p.style.overflow = "hidden";
		p.style.position = "absolute";
		p.style.top = "0";
		p.style.left = "0";
		this.setOpacity(p, 0);
		this.removeClassName(this.visibleClass);
		this.addClassName(this.hiddenClass);
	}

	// We need to delay some of our initialization till after all
	// stylesheets and content have loaded so we can get an accurate size
	// calculation.

	this.triggerCallbackAfterOnLoad(this.initState, this);
};

Spry.Widget.MorphPanels.prototype.initState = function()
{
	this.showPanel(this.defaultPanel);
	
	if (this.autoPlay)
		this.play();

	this.notifyObservers("onPostInitialize", new Spry.Widget.Event(this));
};

Spry.Widget.MorphPanels.prototype.setCurrentPanel = function(panel, evt)
{
	var self = this;
	var oldPanel = this.currentPanel;
	
	this.removeClassName(oldPanel, this.visibleClass);
	this.addClassName(oldPanel, this.hiddenClass);

	var cw = this.element.offsetWidth;
	var ch = this.element.offsetHeight;
	
	var nw = Math.max(panel.offsetWidth, this.minWidth);
	var nh = Math.max(panel.offsetHeight, this.minHeight);

	var widthProp = "";
	var heightProp = "";

	if (cw != nw)
		widthProp += "width: " + nw + "px;";
	if (ch != nh)
		heightProp += "height: " + nh + "px;";

	var firstEff = null;
	var lastEff = null;

	if (widthProp || heightProp)
	{
		switch (this.morphType)
		{
			case "normal":
				firstEff = lastEff = new Spry.Effect.CSSAnimator(this.element, widthProp + heightProp, { duration: this.sizeDuration });
				break;
			case "widthFirst":
			case "heightFirst":
				var wEff = null;
				var hEff = null;

				if (widthProp)
					wEff = new Spry.Effect.CSSAnimator(this.element, widthProp, { duration: this.sizeDuration });
				if (heightProp)
					hEff = new Spry.Effect.CSSAnimator(this.element, heightProp, { duration: this.sizeDuration });
				
				var firstEff = (this.morphType == "widthFirst") ? wEff : hEff;
				var lastEff = (this.morphType == "widthFirst") ? hEff : wEff;

				if (firstEff)
				{
					if (lastEff)
					{
						firstEff.addObserver({ onAnimationComplete: function(){
							self.transitionEffect = lastEff;
							lastEff.start();
						}});
					}
					else
						lastEff = firstEff;
				}
				else
					firstEff = lastEff;
				break;
		}
	}
	
	var fadeInEff = new Spry.Effect.CSSAnimator(panel, "opacity: 1;", { duration: self.fadeInDuration });
	fadeInEff.addObserver({ onAnimationComplete: function(){
		self.transitionEffect = null;
		self.removeClassName(self.element, self.animatingClass);
		self.clearIEAlphaFilter(panel);
		self.notifyObservers("onPostShowPanel", evt);
	}});

	if (firstEff)
		lastEff.addObserver({ onAnimationComplete: function(){
			self.transitionEffect = fadeInEff;
			fadeInEff.start();
		}});
	else
		firstEff = fadeInEff;

	this.currentPanel = panel;
	this.removeClassName(panel, this.hiddenClass);
	this.addClassName(panel, this.visibleClass);

	this.transitionEffect = firstEff;
	firstEff.start();
};

Spry.Widget.MorphPanels.prototype.showPanel = function(eleOrIndex)
{
	var ele = this.indexToElement(eleOrIndex);

	// If the onLoad event hasn't fired, just notate this request
	// as a new defaultPanel setting.

	if (ele && !this.getOnLoadDidFire())
	{
		this.defaultPanel = ele;
		return;
	}

	if (this.transitionEffect)
	{
		this.transitionEffect.stop();
		this.transitionEffect = null;
	}

	if (ele && (this.disableCurrentPanelCheck || ele != this.currentPanel))
	{
		var evt = this.createEvent(ele, { currentPanel: this.currentPanel });
		this.notifyObservers("onPreShowPanel", evt);
		if (!evt.performDefaultAction)
			return;

		this.addClassName(this.element, this.animatingClass);
		var oldPanel = this.currentPanel;			
		if (oldPanel)
		{
			// Fade out the current panel!
			
			var self = this;
			var eff = new Spry.Effect.CSSAnimator(oldPanel, "opacity: 0", { duration: this.fadeOutDuration });
			eff.addObserver({ onAnimationComplete: function(){
				self.transitionEffect = null;
				self.setCurrentPanel(ele, evt);
			}});
			this.transitionEffect = eff;
			eff.start();
		}
		else
			this.setCurrentPanel(ele, evt);
	}
}; 

Spry.Widget.MorphPanels.prototype.hidePanel = function(eleOrIndex)
{
	var ele = this.indexToElement(eleOrIndex);
	var evt = this.createEvent(ele);
	this.notifyObservers("onPreHidePanel", evt);
	if (!evt.performDefaultAction)
		return;

	var dim = ((this.dimension == "height") ? ele.offsetHeight : ele.offsetWidth);
	ele.style[this.dimension] = dim + "px";
	if (dim != this.minDimension)
	{
		var e = new Spry.Effect.CSSAnimator(ele, this.dimension + ": " + this.minDimension + "px", { duration: this.duration });
		e.start();
	}

	this.addClassName(ele, this.hiddenClass);
	this.removeClassName(ele, this.visibleClass);

	if (this.currentPanel == ele)
		this.currentPanel = null;

	this.notifyObservers("onPostHidePanel", evt);
};

})(); // EndSpryComponent