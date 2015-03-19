// SpryPanelSet.js - version 0.4 - Spry Pre-Release 1.7
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
	alert("SpryPanelSet.js requires SpryWidget.js!");
	return;
}

Spry.Widget.PanelSet = function(elements, opts)
{
	Spry.Widget.Base.call(this);

	this.elements = elements ? Spry.$$(elements) : [];
	this.currentPanel = null;

	// Slide Show Mode properties.

	this.displayTimerID = 0;

	// Initialize the panel set object with the global defaults.

	this.setOptions(this, Spry.Widget.PanelSet.config);
	
	// Override the defaults with any options passed into the constructor.

	this.setOptions(this, opts);

	if (typeof (this.defaultPanel) == "number")
	{
		if (this.defaultPanel < 0)
			this.defaultPanel = 0;
		else
		{
			var count = this.getPanelCount();
			if (this.defaultPanel >= count)
				this.defaultPanel = (count > 1) ? (count - 1) : 0;
		}

	}

	this.initialize();
};

Spry.Widget.PanelSet.prototype = new Spry.Widget.Base();
Spry.Widget.PanelSet.prototype.constructor = Spry.Widget.PanelSet;

Spry.Widget.PanelSet.config = {
	defaultPanel:    0,
	autoPlay:       false,
	displayInterval: 4000, // msecs

	visibleClass:    "PanelVisible",
	hiddenClass:     "PanelHidden"
}

Spry.Widget.PanelSet.prototype.initialize = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreInitialize", evt);
	if (!evt.performDefaultAction)
		return;

	this.defaultPanel = this.indexToElement(this.defaultPanel);
	var panels = this.getPanels();

	for (var i = 0; i < panels.length; i++)
	{
		var ele = panels[i];
		var addClass = this.hiddenClass;
		var removeClass = this.visibleClass;

		if (ele == this.defaultPanel)
		{
			addClass = this.visibleClass;
			removeClass = this.hiddenClass;
			this.currentPanel = this.defaultPanel;
		}

		Spry.Utils.addClassName(ele, addClass);
		Spry.Utils.removeClassName(ele, removeClass);
	}

	if (this.autoPlay)
		this.play();

	this.notifyObservers("onPostInitialize", evt);
};

Spry.Widget.PanelSet.prototype.getPanels = function()
{
	return this.elements.slice(0);
};

Spry.Widget.PanelSet.prototype.getPanelCount = function()
{
	return this.getPanels().length;
};

Spry.Widget.PanelSet.prototype.getCurrentPanel = function()
{
	return this.currentPanel;
};

Spry.Widget.PanelSet.prototype.getCurrentPanelIndex = function()
{
	return this.getPanelIndex(this.getCurrentPanel());
};

Spry.Widget.PanelSet.prototype.getPanelIndex = function(panel)
{
	var panels = this.getPanels();
	for (var i = 0; i < panels.length; i++)
	{
		if (panel == panels[i])
			return i;
	}
	return -1;
};

Spry.Widget.PanelSet.prototype.getPanel = function(panelIndex)
{
	return this.getPanels()[panelIndex];
};

Spry.Widget.PanelSet.prototype.indexToElement = function(eleOrIndex)
{
	if (typeof eleOrIndex == "number")
		return this.getPanels()[eleOrIndex];
	return eleOrIndex ? Spry.$$(eleOrIndex)[0] : eleOrIndex;
};

Spry.Widget.PanelSet.prototype.elementToIndex = function(eleOrIndex)
{
	var panels = this.getPanels();

	if (typeof eleOrIndex == "number")
		return panels[eleOrIndex];

	if (typeof eleOrIndex == "string")
		eleOrIndex = Spry.$$(eleOrIndex)[0];

	return !eleOrIndex ? -1 : panels.indexOf(eleOrIndex);
};

Spry.Widget.PanelSet.prototype.createEvent = function(target, opts)
{
	var eopts = {
		target: target,
		targetIndex: this.getPanelIndex(target)
	};
	return new Spry.Widget.Event(this, this.setOptions(eopts, opts));
};

Spry.Widget.PanelSet.prototype.showPanel = function(eleOrIndex)
{
	var ele = this.indexToElement(eleOrIndex);
	if (ele && ele != this.currentPanel)
	{
		var evt = this.createEvent(ele, { currentPanel: this.currentPanel });
		this.notifyObservers("onPreShowPanel", evt);

		if (evt.performDefaultAction)
		{
			if (this.currentPanel)
				this.hidePanel(this.currentPanel);
	
			this.currentPanel = ele;
	
			Spry.Utils.addClassName(ele, this.visibleClass);
			Spry.Utils.removeClassName(ele, this.hiddenClass);

			this.notifyObservers("onPostShowPanel", evt);
		}
	}
};

Spry.Widget.PanelSet.prototype.hidePanel = function(eleOrIndex)
{
	var evt = this.createEvent(this.currentPanel);
	this.notifyObservers("onPreHidePanel", evt);

	if (evt.performDefaultAction)
	{
		var ele = this.currentPanel;

		Spry.Utils.addClassName(ele, this.hiddenClass);
		Spry.Utils.removeClassName(ele, this.visibleClass);

		this.currentPanel = null;

		this.notifyObservers("onPostHidePanel", evt);
	}
};

Spry.Widget.PanelSet.prototype.showPreviousPanel = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreShowPreviousPanel", evt);
	if (!evt.performDefaultAction)
		return;

	var curIndex = this.getCurrentPanelIndex();
	this.showPanel(((curIndex < 1) ? this.getPanelCount() : curIndex) - 1);

	this.notifyObservers("onPostShowPreviousPanel", evt);
};

Spry.Widget.PanelSet.prototype.showNextPanel = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreShowNextPanel", evt);
	if (!evt.performDefaultAction)
		return;

	this.showPanel((this.getCurrentPanelIndex()+1) % this.getPanelCount());

	this.notifyObservers("onPostShowNextPanel", evt);
};

Spry.Widget.PanelSet.prototype.showFirstPanel = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreShowFirstPanel", evt);
	if (!evt.performDefaultAction)
		return;

	this.showPanel(0);

	this.notifyObservers("onPostShowFirstPanel", evt);
};

Spry.Widget.PanelSet.prototype.showLastPanel = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreShowLastPanel", evt);
	if (!evt.performDefaultAction)
		return;

	var count = this.getPanelCount();
	this.showPanel(count > 0 ? count - 1 : 0);

	this.notifyObservers("onPostShowLastPanel", evt);
};


Spry.Widget.PanelSet.prototype.startTimer = function()
{
	this.stopTimer();
	var self = this;
	this.displayTimerID = setTimeout(function() { self.showNextPanel(); self.startTimer(); }, this.displayInterval);
};

Spry.Widget.PanelSet.prototype.stopTimer = function()
{
	if (this.displayTimerID)
		clearTimeout(this.displayTimerID);
	this.displayTimerID = 0;
};

Spry.Widget.PanelSet.prototype.isPlaying = function()
{
	return this.displayTimerID != 0;
};

Spry.Widget.PanelSet.prototype.play = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreStartSlideShowMode", evt);
	if (!evt.performDefaultAction)
		return;

	this.startTimer();

	this.notifyObservers("onPostStartSlideShowMode", evt);
};

Spry.Widget.PanelSet.prototype.stop = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreStopSlideShowMode", evt);
	if (!evt.performDefaultAction)
		return;

	this.stopTimer();

	this.notifyObservers("onPostStopSlideShowMode", evt);
};

})(); // EndSpryComponent