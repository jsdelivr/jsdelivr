// SprySliderPanels.js - version 0.3 - Spry Pre-Release 1.7
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

if (typeof Spry == "undefined" || !Spry.Widget || !Spry.Widget.Base)
{
	alert("SprySliderPanels.js requires SpryPanelSet.js!");
	return;
}

Spry.Widget.SliderPanels = function(element, opts)
{
	this.element = Spry.$$(element)[0];
	this.currentPage = 0;

	var panels = this.getElementChildren(this.getSlidingContainer());

	// Override any of the global defaults with options passed into
	// the constructor.

	var mergedOpts = this.setOptions(this.setOptions({}, Spry.Widget.SliderPanels.config), opts);

	Spry.Widget.PanelSet.call(this, panels, mergedOpts);
};


Spry.Widget.SliderPanels.prototype = new Spry.Widget.PanelSet();
Spry.Widget.SliderPanels.prototype.constructor = Spry.Widget.SliderPanels;

Spry.Widget.SliderPanels.config = {
	defaultPanel:       0,
	pageIncrement:      1,

	// Panel animation properties:

	enableAnimation: true,
	duration:           500, // msecs

	// Slideshow properties:

	autoPlay:          false,
	displayInterval:    4000, // msecs

	// Runtime class names:

	currentPanelClass: "SliderPanelsCurrentPanel",
	focusedClass:      "SliderPanelsFocused",
	animatingClass:    "SliderPanelsAnimating"
};

Spry.Widget.SliderPanels.prototype.initialize = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreInitialize", evt);
	if (!evt.performDefaultAction)
		return;

	this.defaultPanel = this.indexToElement(this.defaultPanel);

	this.element.style.overflow = "hidden";

	var slidingContainer = this.getSlidingContainer();
	if (slidingContainer)
	{
		slidingContainer.style.overflow = "hidden";
		slidingContainer.style.top = "0";
		slidingContainer.style.left = "0";
	}

	var panels = this.getPanels();
	
	for (var i = 0; i < panels.length; i++)
	{
		var ele = panels[i];

		this.removeClassName(ele, this.currentPanelClass);
		this.removeClassName(ele, this.SlidingPanelsAnimating);
		this.removeClassName(ele, this.focusedClass);
	}
	
	// Since we rely on the positioning information of the
	// panels, we need to wait for the onload event to fire before
	// we can attempt to show the initial panel. Once the onload
	// fires, we know that all CSS files have loaded. This is
	// especially important for Safari.
	
	this.triggerCallbackAfterOnLoad(this.initState, this);
};

Spry.Widget.SliderPanels.prototype.initState = function()
{
	this.showPanel(this.defaultPanel);

	if (this.autoPlay)
		this.play();

	this.notifyObservers("onPostInitialize", new Spry.Widget.Event(this));
};

Spry.Widget.SliderPanels.prototype.getSlidingContainer = function()
{
	return this.getElementChildren(this.element)[0];
};

Spry.Widget.SliderPanels.prototype.getPageIndex = function(panel)
{
	return Math.floor(this.getPanelIndex(panel) / this.pageIncrement);
};

Spry.Widget.SliderPanels.prototype.getCurrentPageIndex = function()
{
	return this.currentPage;
};

Spry.Widget.SliderPanels.prototype.getPageCount = function()
{
	return Math.floor((this.getPanels().length + this.pageIncrement) / this.pageIncrement);
};

Spry.Widget.SliderPanels.prototype.scrollToPage = function(pageIndex)
{
	var ele = this.indexToElement(pageIndex * this.pageIncrement);
	if (ele)
	{
		var slidingContainer = this.getSlidingContainer();
	
		var top = -ele.offsetTop;
		var left = -ele.offsetLeft;
	
		if (this.enableAnimation)
		{
			var self = this;
			this.addClassName(this.element, this.animatingClass);
			var e = new Spry.Effect.CSSAnimator(slidingContainer, "top: " + top + "px; left: " + left + "px;", { duration: this.duration });
			e.addObserver({ onAnimationComplete: function(){ self.removeClassName(self.element, self.animatingClass); }});
			e.start();
		}
		else
		{
			slidingContainer.style.top = ele.offsetTop + "px";
			slidingContainer.style.left = ele.offsetLeft + "px";
		}

		this.currentPage = pageIndex;
	}
};

Spry.Widget.SliderPanels.prototype.previousPage = function()
{
	var curIndex = this.getCurrentPageIndex();
	this.scrollToPage(((curIndex < 1) ? this.getPageCount() : curIndex) - 1);
};

Spry.Widget.SliderPanels.prototype.nextPage = function()
{
	this.scrollToPage((this.getCurrentPageIndex()+1) % this.getPageCount());
};

Spry.Widget.SliderPanels.prototype.firstPage = function()
{
	this.scrollToPage(0);
};

Spry.Widget.SliderPanels.prototype.lastPage = function()
{
	var count = this.getPageCount();
	this.scrollToPage(count > 0 ? count - 1 : 0);
};

Spry.Widget.SliderPanels.prototype.showPanel = function(eleOrIndex)
{
	var ele = this.indexToElement(eleOrIndex);
	if (ele && ele != this.currentPanel)
	{
		var evt = this.createEvent(ele, { currentPanel: this.currentPanel });
		this.notifyObservers("onPreShowPanel", evt);
		if (!evt.performDefaultAction)
			return;

		this.removeClassName(this.currentPanel, this.currentPanelClass);
		this.addClassName(ele, this.currentPanelClass);

		this.scrollToPage(this.getPageIndex(ele));

		this.currentPanel = ele;

		this.notifyObservers("onPostShowPanel", evt);
	}
};

Spry.Widget.SliderPanels.prototype.hidePanel = function(eleOrIndex)
{
	// hidePanel() doesn't make sense for this widget.
};

})(); // EndSpryComponent