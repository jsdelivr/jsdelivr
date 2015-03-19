// SpryFilmStrip.js - version 0.3 - Spry Pre-Release 1.6.1
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

if (typeof Spry == "undefined" || !Spry.Widget || !Spry.Widget.Button)
{
	alert("SpryFilmStrip.js requires SpryButton.js!");
	return;
}

var defaultConfig = {
	plugIns:                  [],
	defaultPanel:             0,
	pageIncrement:            1,
	wraparound:               true,
	injectionType:            "inside",  // "inside" or "replace"
	extractionType:           "element", // "element" or "content"
	repeatingElementSelector: null,

	widgetID:                 null,
	widgetClass:              "FilmStrip",                        // Sliceable
	currentPanelClass:        "FilmStripCurrentPanel",
	focusedClass:             "FilmStripFocused",
	animatingClass:           "FilmStripAnimating",
	previousBtnClass:         "FilmStripPreviousButton",          // Sliceable
	previousBtnHoverClass:    "FilmStripPreviousButtonHover",
	previousBtnDownClass:     "FilmStripPreviousButtonDown",
	previousBtnDisabledClass: "FilmStripPreviousButtonDisabled",
	nextBtnClass:             "FilmStripNextButton",              // Sliceable
	nextBtnHoverClass:        "FilmStripNextButtonHover",
	nextBtnDownClass:         "FilmStripNextButtonDown",
	nextBtnDisabledClass:     "FilmStripNextButtonDisabled",
	trackClass:               "FilmStripTrack",
	containerClass:           "FilmStripContainer",
	panelClass:               "FilmStripPanel",                   // Sliceable

	sliceMap:                 {},
	componentOrder: [ "previous", "next", "track" ]
};

Spry.Widget.FilmStrip = function(ele, opts)
{
	Spry.Widget.Base.call(this);

	this.element = Spry.$$(ele)[0];
	this.sliderPanel = null;

	// Apply the default settings.

	this.setOptions(this, Spry.Widget.FilmStrip.config);

	// Override the defaults with user specified settings.

	this.setOptions(this, opts);

	this.initializePlugIns(Spry.Widget.FilmStrip.config.plugIns, opts);

	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreInitialize", evt);
	if (!evt.performDefaultAction)
		return;

	this.transformMarkup();

	this.trackEle = Spry.$$("." + this.trackClass, this.element)[0];
	this.panelEle = this.getElementChildren(this.trackEle)[0];

	this.attachBehaviors();

	this.notifyObservers("onPostInitialize", evt);
};


Spry.Widget.FilmStrip.prototype = new Spry.Widget.Base();
Spry.Widget.FilmStrip.prototype.constructor = Spry.Widget.FilmStrip;

Spry.Widget.FilmStrip.config = defaultConfig;

Spry.Widget.FilmStrip.prototype.transformMarkup = function()
{
	var elements = [];

	if (!this.repeatingElementSelector)
		elements = this.getElementChildren(this.element);
	else
		elements = Spry.$$(this.repeatingElementSelector, this.element);

	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreTransformMarkup", evt);
	if (!evt.performDefaultAction)
		return;

	// Create the top-level widget element. 

	var root = this.createOptionalSlicedStructure(null, "div", this.widgetClass);
	if (this.widgetID)
		root.id = this.widgetID;

	// Create the previous button.

	var prev = this.createOptionalSlicedStructure(null, "a", this.previousBtnClass);
	prev.href = "#";

	// Create the next button.

	var next = this.createOptionalSlicedStructure(null, "a", this.nextBtnClass);
	next.href = "#";

	// Create the panel track and container.

	var track = this.createElement("div", this.trackClass, null);
	var container = this.createElement("div", this.containerClass, track);

	for (var i = 0; i < this.componentOrder.length; i++)
	{
		var itemName = this.componentOrder[i];
		switch (itemName)
		{
			case "track":
				root.appendChild(track);
				break;
			case "previous":
				root.appendChild(prev);
				break;
			case "next":
				root.appendChild(next);
				break;
		}
	}

	var extractElement = (this.extractionType == "element");

	for (var i = 0; i < elements.length; i++)
	{
		var e = elements[i];

		var p = this.createOptionalSlicedStructure(null, "div", this.panelClass);
		var c = p.contentContainer;

		container.appendChild(p);

		if (extractElement)
			c.appendChild(e);
		else
			this.appendChildNodes(c, this.extractChildNodes(e));
	}

	if (this.injectionType == "replace")
	{
		var parent = this.element.parentNode;
		parent.replaceChild(root, this.element);
		this.element = root;
	}
	else // "inside"
	{
		this.element.innerHTML = "";
		this.element.appendChild(root);
	}

	this.notifyObservers("onPostTransformMarkup", evt);
};

Spry.Widget.FilmStrip.prototype.attachBehaviors = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreAttachBehaviors", evt);
	if (!evt.performDefaultAction)
		return;

	var prevBtnEle = Spry.$$("." + this.previousBtnClass, this.element)[0];
	var nextBtnEle = Spry.$$("." + this.nextBtnClass, this.element)[0];

	var self = this;

	if (prevBtnEle)
		this.previousBtn = new Spry.Widget.Button(prevBtnEle, {
				downClass: this.previousBtnDownClass,
				hoverClass: this.previousBtnHoverClass,
				disabledClass: this.previousBtnDisabledClass,
				onclick: function(e){ self.previous(); }});

	if (nextBtnEle)
		this.nextBtn = new Spry.Widget.Button(nextBtnEle, {
				downClass: this.nextBtnDownClass,
				hoverClass: this.nextBtnHoverClass,
				disabledClass: this.nextBtnDisabledClass,
				onclick: function(e){ self.next(); }});

	if (this.trackEle)
		this.sliderPanel = new Spry.Widget.SliderPanels(this.trackEle, {
				defaultPanel: this.defaultPanel,
				pageIncrement: this.pageIncrement,
				currentPanelClass: this.currentPanelClass,
				focusedClass: this.focusedClass,
				animatingClass: this.animatingClass
		});

	this.notifyObservers("onPostAttachBehaviors", evt);
};

Spry.Widget.FilmStrip.prototype.syncScrollButtons = function()
{
	if (this.wraparound)
	{
		this.previousBtn.enable();
		this.nextBtn.enable();
		return;
	}

	var sp = this.sliderPanel;
	var curPage = sp.getCurrentPageIndex();
	var numPages = sp.getPageCount();

	if (curPage == 0)
		this.previousBtn.disable();
	else
		this.previousBtn.enable();

	if ((curPage + 1) >= numPages)
		this.nextBtn.disable();
	else
		this.nextBtn.enable();
};

Spry.Widget.FilmStrip.prototype.getCurrentPanel = function()
{
	return this.sliderPanel ? this.sliderPanel.getCurrentPanel() : null;
};

Spry.Widget.FilmStrip.prototype.getCurrentPanelIndex = function()
{
	return this.sliderPanel ? this.sliderPanel.getCurrentPanelIndex() : -1;
};

Spry.Widget.FilmStrip.prototype.showPanel = function(eleOrIndex)
{
	var evt = new Spry.Widget.Event(this, { target: eleOrIndex });
	this.notifyObservers("onPreShowPanel", evt);
	if (!evt.performDefaultAction)
		return;

	if (this.sliderPanel)
		this.sliderPanel.showPanel(eleOrIndex);

	this.notifyObservers("onPostShowPanel", evt);
};

Spry.Widget.FilmStrip.prototype.previous = function(e)
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPrePreviousPage", evt);
	if (!evt.performDefaultAction)
		return;

	if (this.sliderPanel)
	{
		this.sliderPanel.previousPage();
		this.syncScrollButtons();
	}

	this.notifyObservers("onPostPreviousPage", evt);
};

Spry.Widget.FilmStrip.prototype.next = function(e)
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreNextPage", evt);
	if (!evt.performDefaultAction)
		return;

	if (this.sliderPanel)
	{
		this.sliderPanel.nextPage();
		this.syncScrollButtons();
	}

	this.notifyObservers("onPostNextPage", evt);
};

/*
Spry.Utils.addLoadListener(function()
{
	Spry.$$(".FilmStrip").forEach(function(n){ var w = new Spry.Widget.FilmStrip(n); });
});
*/

})(); // EndSpryComponent