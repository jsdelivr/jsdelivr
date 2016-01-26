// SpryTabbedPanels2.js - version 0.9 - Spry Pre-Release 1.7
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
	alert("SpryTabbedPanels2.js requires SpryWidget.js!");
	return;
}

if (!Spry.Widget) Spry.Widget = {};

var defaultConfig = {
	defaultTab:               0,     // Show the first panel by default.
	event:                    "click",  // DOM Event name to trigger the panel change; click or mouseover.
	hideHeader:               true,  // Hide the header elements used to create the tabs.
	tabsPosition:             "top", // One of "top", "bottom", "left", "right".

	// Slide show features.
	autoPlay:                 false, // Start the slide show immediately after the widget is created.
	displayInterval:          5000,  // Interval (msecs) between display of each panel.
	stopOnUserAction:         true,  // If the user clicks on a tab, stop the slide show.

	injectionType:            "replace",    // "inside" or "replace"

	tabSelector:              "h1,h2,h3,h4,h5,h6",
	contentDelimiterSelector:  null,  // When null, the tabSelector is used to find the delimiter.

	widgetClass:              "TabbedPanels",
	tabClass:                 "TabbedPanelsTab",     // Class name used for the tab elements.
	contentClass:             "TabbedPanelsContent", // Class name used for the content panel elements.

	// These strings are used as class names placed on every element used
	// within the widget markup.
	tabHoverClass:            "TabbedPanelsTabHover",
	tabSelectedClass:         "TabbedPanelsTabSelected",
	tabFocusedClass:          "TabbedPanelsTabFocused",
	panelVisibleClass:        "TabbedPanelsContentVisible",

	groupClassStr:            "Group",
	firstClassStr:            "First",
	lastClassStr:             "Last",

	plugIns:             [],
	sliceMap:            {},

	// After the widget markup is generated and inserted into the document, you
	// can have the widget automatically remove and/or add any class name to the
	// top-level element that contains the tab and content group element.
	classToRemove:             "",
	classToAdd:                "",

	enableKeyboardNavigation:  true
};

Spry.Widget.TabbedPanels2 = function(element, opts)
{
	this.element = this.getElement(element);

	// This is the top-level element of the tabbed panel that is injected at
	// runtime.

	this.widgetRoot = null;

	this.tgObj = null;
	this.cgObj = null;

	// Initialize to global configuration defaults.

	this.setOptions(this, Spry.Widget.TabbedPanels2.config);

	// Pick up the configuration overrides.

	this.setOptions(this, opts);

	if (this.tabsPosition == "bottom" || this.tabsPosition == "right") {
		this.tabsAfterContent = true;
	} else {
		this.tabsAfterContent = false;
	}

	// Initialize any plugins.

	this.initializePlugIns(Spry.Widget.TabbedPanels2.config.plugIns, opts);

	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreInitialize", evt);
	if (!evt.performDefaultAction)
		return;

	this.transformMarkup();
	this.attachBehaviors();

	this.notifyObservers("onPostInitialize", evt);
};

Spry.Widget.TabbedPanels2.config = defaultConfig;

Spry.Widget.TabbedPanels2.prototype = new Spry.Widget.Base();
Spry.Widget.TabbedPanels2.prototype.constructor = Spry.Widget.TabbedPanels2;

Spry.Widget.TabbedPanels2.prototype.transformMarkup = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreTransformMarkup", evt);
	if (!evt.performDefaultAction)
		return;

	// Find the elements, within the initial markup, that will serve as the
	// content for the tab buttons.

	var tabContent = Spry.$$(this.tabSelector, this.element);

	// Find the elements, within the initial markup, that will serve as the
	// delimiter between content. This is usually the element that contains
	// the content for the tabbed buttons.

	var delimSelector = this.contentDelimiterSelector;
	if (!delimSelector)
		delimSelector = this.tabSelector;

	var delimiters = Spry.$$(delimSelector, this.element);

	if (tabContent.length != delimiters.length)
		alert("SpryTabbedPanels2.js - WARNING: Mismatch between tab elements and content delimiters!");
	if (tabContent.length == 0)
	{
		alert("SpryTabbedPanels2.js - ERROR: Failed to find tab markup.");
		return;
	}

	// Create the widget element, and slice it.
	var root = this.createOptionalSlicedStructure(null, "div", this.widgetClass);

	if (this.widgetID)
		root.id = this.widgetID;

	// Create the tab group element, and slice it.

	this.tgObj = this.createOptionalSlicedStructure(null ,"div", this.tabClass + this.groupClassStr);
	// For each tab content element, create a tab markup structure and add it
	// to the content container of the tab group.

	var numTabs = tabContent.length;
	var lastTabIndex = numTabs - 1;

	for (var i = 0; i < numTabs; i++)
	{
		var t = this.createOptionalSlicedStructure(null, "div", this.tabClass);
		var txt = this.getElementText(tabContent[i]);
		var linkEle = document.createElement("a");
		linkEle.href = "#";
		linkEle.appendChild(document.createTextNode(txt));
		t.contentContainer.appendChild(linkEle);

		// If this the first or last tab, add our special class name to it.
		if (i == 0)
			this.addClassName(t, this.tabClass + this.firstClassStr);
		if (i == lastTabIndex)
			this.addClassName(t, this.tabClass + this.lastClassStr);

		this.tgObj.contentContainer.appendChild(t);

		if (tabContent[i].id) {
			t.id = tabContent[i].id;
			tabContent[i].removeAttribute("id");
		}
		var ti = parseInt(tabContent[i].getAttribute("tabIndex"));
		if (!isNaN(ti)) {
			t.tabIndex = tabContent[i].tabIndex;
			tabContent[i].removeAttribute("tabindex");
		} 

		// Hide the initial tab content if necessary.
	
		if (this.hideHeader)
			tabContent[i].style.display = "none";
	}

	// Create a content group element and fill it with the optional slice element structure.

	this.cgObj = this.createOptionalSlicedStructure(null, "div", this.contentClass + this.groupClassStr);

	// The content for each panel follows the delimiter element. For each tab content element,
	// grab the nodes that follow it, up until the next tab content element, and stick it
	// into a tabbed panel content structure.

	for (var i = 0; i < delimiters.length; i++)
	{
		// Create a content panel and fill it with the 9-slice structure, then
		// add it to the content group.

		var c = this.createOptionalSlicedStructure(null, "div", this.contentClass);
		this.cgObj.contentContainer.appendChild(c);

		// Grab all of the content that follows the tab content element and stick
		// it into the content structure we just created.

		var d = delimiters[i];
		var nd = delimiters[i+1];

		while (d && d != nd)
		{
			var ns = d.nextSibling;
			c.contentContainer.appendChild(d);
			d = ns;
		}

		// Hide the delimiter content if necessary.
	
		if (this.hideHeader)
			delimiters[i].style.display = "none";
	}

	while (this.element.firstChild)
		this.element.removeChild(this.element.firstChild);

	// Insert the tab and content groups into the document.
	if (this.tabsAfterContent)
	{
		root.contentContainer.appendChild(this.cgObj);
		root.contentContainer.appendChild(this.tgObj);
	}
	else
	{
		root.contentContainer.appendChild(this.tgObj);
		root.contentContainer.appendChild(this.cgObj);
	}

	// Insert our newly constructed widget structure into the document.
	
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

	this.widgetRoot = root;

	if (this.tabsPosition == "bottom")
	{
		this.addClassName(this.widgetRoot, "BTabbedPanels");
	}
	if (this.tabsPosition == "left" || this.tabsPosition == "right")
	{
		this.removeClassName(this.widgetRoot, "TabbedPanels");
		this.addClassName(this.widgetRoot, "VTabbedPanels");
	}

	if (this.classToRemove)
		this.removeClassName(this.widgetRoot, this.classToRemove);

	if (this.classToAdd)
		this.addClassName(this.widgetRoot, this.classToAdd);


	this.notifyObservers("onPostTransformMarkup", evt);
};

Spry.Widget.TabbedPanels2.prototype.getElementText = function(ele)
{
	var ta = [];
	var c = ele.firstChild;
	while (c)
	{
		if (c.nodeType == 3 || c.nodeType == 4) // Node.TEXT_NODE || Node.CDATA_NODE
			ta.push(c.data);
		else if (c.firstChild)
		{
			var str = this.getElementText(c);
			if (str)
				ta.push(str);
		}
		c = c.nextSibling;
	}
	return ta.join("");
};

Spry.Widget.TabbedPanels2.prototype.getTabs = function()
{
	var tabs = [];
	if (this.element && this.tgObj && this.tgObj.contentContainer)
		tabs = this.getElementChildren(this.tgObj.contentContainer);
	return tabs;
};

Spry.Widget.TabbedPanels2.prototype.getContentPanels = function()
{
	var panels = [];
	if (this.element && this.cgObj && this.cgObj.contentContainer)
		panels = this.getElementChildren(this.cgObj.contentContainer);
	return panels;
};

Spry.Widget.TabbedPanels2.prototype.getTabbedPanelCount = function(ele)
{
	return Math.min(this.panelSelector.getButtonCount(), this.panelSet.getPanelCount());
};

Spry.Widget.TabbedPanels2.prototype.getTabIndex = function(ele)
{
	return this.panelSelector.elementToIndex(ele);
};

Spry.Widget.TabbedPanels2.prototype.getCurrentTabIndex = function()
{
	return this.panelSelector.getCurrentButtonIndex();
};

Spry.Widget.TabbedPanels2.prototype.showPanel = function(idxOrId) {
	this.panelSelector.handleActivate(idxOrId);
};

Spry.Widget.TabbedPanels2.prototype.showPreviousPanel = function()
{
	this.panelSelector.selectPreviousButton();
};

Spry.Widget.TabbedPanels2.prototype.showNextPanel = function()
{
	this.panelSelector.selectNextButton();
};

Spry.Widget.TabbedPanels2.prototype.showFirstPanel = function()
{
	this.panelSelector.selectFirstButton();
};

Spry.Widget.TabbedPanels2.prototype.showLastPanel = function()
{
	this.panelSelector.selectLastButton();
};

Spry.Widget.TabbedPanels2.prototype.markOpenPanel = function(panel)
{
	var panels = this.panelSet.getPanels();

	for (var i = 0; i < panels.length; i++)
	{
		var p = panels[i];
		if (panel == p)
		{
			this.addClassName(p, this.panelVisibleClass);
			p.style.display = "block";
		} else {
			this.removeClassName(p, this.panelVisibleClass);
			p.style.display = "none";
		}
	}
};

Spry.Widget.TabbedPanels2.prototype.attachBehaviors = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreAttachBehaviors", evt);
	if (!evt.performDefaultAction)
		return;

	this.attachViewBehaviors();
	this.attachTabBehaviors();

	this.notifyObservers("onPostAttachBehaviors", evt);	
};


Spry.Widget.TabbedPanels2.prototype.attachViewBehaviors = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreAttachViewBehaviors", evt);
	if (!evt.performDefaultAction)
		return;

	var panels = this.getContentPanels();
	this.panelSet = new Spry.Widget.PanelSet(panels, {
		defaultPanel:this.defaultTab,
		autoPlay:this.autoPlay,
		displayInterval: this.displayInterval,
		visibleClass: this.panelVisibleClass
	});

	var self = this;

	this.panelSet.addObserver({
		onPostShowPanel: function(n,d){
			self.markOpenPanel(d.target);
		}
	});

	var p = this.panelSet.getCurrentPanel();
	if (p) {
		this.markOpenPanel(p);
	}

	this.notifyObservers("onPostAttachViewBehaviors", evt);
};

Spry.Widget.TabbedPanels2.prototype.attachTabBehaviors = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreAttachTabBehaviors", evt);
	if (!evt.performDefaultAction)
		return;

	var tabs = this.getTabs();

	this.panelSelector = new Spry.Widget.PanelSelector(tabs, this.panelSet, {
		event: this.event,
		selectionStopsSlideShow:this.stopOnUserAction,
		defaultButton:this.defaultTab,
		selectedClass: this.tabSelectedClass,
		focusedClass: this.tabFocusedClass,
		hoverClass: this.tabHoverClass
	});

	this.notifyObservers("onPostAttachTabBehaviors", evt);
};

})(); // EndSpryComponent