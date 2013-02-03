// SpryImageSlideShow.js - version 0.12 - Spry Pre-Release 1.7
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
	alert("SpryImageSlideShow.js requires SpryWidget.js!");
	return;
}

var defaultConfig = {
	plugIns:               [],
	defaultSlide: 0,

	injectionType: "inside",        // "inside" or "replace"
	repeatingElementSelector: null,

	useButtonControls: false,       // true == <button>, false == <a>

	dropFrames: true,

	autoPlay: true,
	transitionDuration: 2000,       // msecs
	displayInterval: 6000,          // msecs

	slideLinkStopsSlideShow: true,

	widgetID: null,

	widgetClass: "ImageSlideShow",          // Sliceable
	playingClass: "ISSPlaying",
	nameClass: "ISSName",                   // Sliceable
	clipClass: "ISSClip",
	viewClass: "ISSView",
	slideClass: "ISSSlide",                 // Sliceable
	slideVisibleClass: "ISSSlideVisible",
	slideHiddenClass: "ISSSlideHidden",
	slideTitleClass: "ISSSlideTitle",       // Sliceable
	slideCaptionClass: "ISSSlideCaption",   // Sliceable
	countClass: "ISSSlideCount",            // Sliceable
	slideLinksClass: "ISSSlideLinks",       // Sliceable
	slideLinkClass: "ISSSlideLink",         // Sliceable
	controlsClass: "ISSControls",           // Sliceable
	firstBtnClass: "ISSFirstButton",        // Sliceable
	prevBtnClass: "ISSPreviousButton",      // Sliceable
	playBtnClass: "ISSPlayButton",          // Sliceable
	nextBtnClass: "ISSNextButton",          // Sliceable
	lastBtnClass: "ISSLastButton",          // Sliceable
	playLabelClass: "ISSPlayLabel",
	pauseLabelClass: "ISSPauseLabel",
	slideShowBusy: "ISSBusy",
	slideLoading: "ISSSlideLoading",

	sliceMap: {},
	componentOrder: [ "view", "controls" ] // "name", "view", "controls", "links", " title", "caption", "count"
};

Spry.Widget.ImageSlideShow = function(ele, opts)
{
	Spry.Widget.Base.call(this);

	this.element = Spry.$$(ele)[0];
	this.rootContainer = this.element;
	this.slideShowName = null;
	this.imageInfo = [];
	this.slideElements = [];
	this.slideElementCount = 2;
	this.currentSlideElementIndex = -1;
	this.currentVirtualSlideIndex = -1;
	this.isReady = false;

	this.loader = new Spry.Utils.ImageLoader();

	this.isPlaying = false;

	// Initialize the accordion object with the global defaults.

	this.setOptions(this, Spry.Widget.ImageSlideShow.config);
	
	// Override the defaults with any options passed into the constructor.

	this.setOptions(this, opts);

	var self = this;

	this.firstFunc = function(e) { return self.showFirstSlide(); };
	this.prevFunc = function(e) { return self.showPreviousSlide(); };
	this.playFunc = function(e) { return self.togglePlayMode(); };
	this.nextFunc = function(e) { return self.showNextSlide(); };
	this.lastFunc = function(e) { return self.showLastSlide(); };

	this.initializePlugIns(Spry.Widget.ImageSlideShow.config.plugIns, opts);

	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreInitialize", evt);
	if (!evt.performDefaultAction)
		return;

	this.transformMarkup();
	this.attachBehaviors();

	this.updateSlideTitle();
	this.updateSlideCaption();
	this.updateSlideCountLabel();

	this.triggerCallbackAfterOnLoad(this.loadImages, this);

	this.notifyObservers("onPostInitialize", evt);
};

Spry.Widget.ImageSlideShow.prototype = new Spry.Widget.Base();
Spry.Widget.ImageSlideShow.prototype.constructor = Spry.Widget.ImageSlideShow;

Spry.Widget.ImageSlideShow.config = defaultConfig;

Spry.Widget.ImageSlideShow.prototype.getOffscreenSlideIndex = function()
{
	var si = this.currentSlideElementIndex;
	var si = this.panelSet.getCurrentPanelIndex();
	return si < 0 ? 0 : ((si + 1) % this.slideElements.length);
};

Spry.Widget.ImageSlideShow.prototype.setupOffscreenSlideForDisplay = function(virtualSlideIndex)
{
	var info = this.imageInfo[virtualSlideIndex];
	if (!info)
		return;

	var si = this.getOffscreenSlideIndex();
	var slideEle = this.slideElements[si];

	var img = Spry.$$("img", slideEle)[0];
	img.src = "";
	img.src = info.src;
	img.style.width = info.width + "px";
	img.style.height = info.height + "px";
};

Spry.Widget.ImageSlideShow.prototype.showSlide = function(slideIndex)
{
	var ps = this.panelSet;
	if (!ps || !ps.showPanel)
		return;

	// Figure out the index of the offscreen slide.

	var offscreenIndex = this.getOffscreenSlideIndex();
	this.setupOffscreenSlideForDisplay(slideIndex);

	var evt = new Spry.Widget.Event(this, { target: this.slideElements[offscreenIndex], slideIndex: slideIndex });
	this.notifyObservers("onPreShowSlide", evt);
	if (!evt.performDefaultAction)
		return false;

	if (this.panelSelector)
		this.panelSelector.selectButton(slideIndex);
	this.currentSlideElementIndex = offscreenIndex;
	this.currentVirtualSlideIndex = slideIndex;

	this.updateSlideTitle();
	this.updateSlideCaption();
	this.updateSlideCountLabel();

	ps.showPanel(offscreenIndex);

	this.notifyObservers("onPostShowSlide", evt);
};

Spry.Widget.ImageSlideShow.prototype.hideSlide = function(slideIndex)
{
	var ps = this.panelSet;
	if (ps && ps.hidePanel)
		ps.hidePanel(slideIndexs);
};

Spry.Widget.ImageSlideShow.prototype.showFirstSlide = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreShowFirstSlide", evt);
	if (!evt.performDefaultAction)
		return false;

	if (this.imageInfo.length)
		this.showSlide(0);

	this.notifyObservers("onPostShowFirstSlide", evt);

	return false;
};

Spry.Widget.ImageSlideShow.prototype.showPreviousSlide = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreShowPreviousSlide", evt);
	if (!evt.performDefaultAction)
		return false;

	if (this.imageInfo.length)
	{
		var prevIndex = this.currentVirtualSlideIndex - 1;
		prevIndex = prevIndex < 0 ? this.imageInfo.length - 1 : prevIndex;
		this.showSlide(prevIndex);
	}

	this.notifyObservers("onPostShowPreviousSlide", evt);

	return false;
};

Spry.Widget.ImageSlideShow.prototype.showNextSlide = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreShowNextSlide", evt);
	if (!evt.performDefaultAction)
		return false;

	if (this.imageInfo.length)
	{
		var nextIndex = (this.currentVirtualSlideIndex + 1) % this.imageInfo.length;
		this.showSlide(nextIndex);
	}

	this.notifyObservers("onPostShowNextSlide", evt);

	return false;
};

Spry.Widget.ImageSlideShow.prototype.showLastSlide = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreShowLastSlide", evt);
	if (!evt.performDefaultAction)
		return false;

	if (this.imageInfo.length)
		this.showSlide(this.imageInfo.length - 1);

	this.notifyObservers("onPostShowLastSlide", evt);

	return false;
};

Spry.Widget.ImageSlideShow.prototype.play = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreStartSlideShow", evt);
	if (!evt.performDefaultAction)
		return false;

	if (this.panelSet)
		this.panelSet.play();

	this.notifyObservers("onPostStartSlideShow", evt);

	return false;
};

Spry.Widget.ImageSlideShow.prototype.stop = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreStopSlideShow", evt);
	if (!evt.performDefaultAction)
		return false;

	if (this.panelSet)
		this.panelSet.stop();

	this.notifyObservers("onPostStopSlideShow", evt);

	return false;
};

Spry.Widget.ImageSlideShow.prototype.togglePlayMode = function()
{
	if (this.element)
	{
		if (Spry.Utils.hasClassName(this.element, this.playingClass))
			this.stop();
		else
			this.play();
	}
	return false;
};

Spry.Widget.ImageSlideShow.prototype.getCurrentSlide = function()
{
	return this.panelSet ? this.panelSet.getCurrentPanel() : null;
};

Spry.Widget.ImageSlideShow.prototype.getCurrentSlideIndex = function(idx)
{
	return this.currentVirtualSlideIndex;
};

Spry.Widget.ImageSlideShow.prototype.getSlideIndex = function(ele)
{
	var ps = this.panelSet;
	return ps && ps.getPanelIndex ? ps.getPanelIndex(ele) : -1;
};

Spry.Widget.ImageSlideShow.prototype.getSlides = function()
{
	var results = [];
	var clip = Spry.$$("." + this.clipClass, this.element)[0];
	if (clip)
		return Spry.$$("." + this.slideClass, clip);
	return results;
};

Spry.Widget.ImageSlideShow.prototype.isInPlayMode = function()
{
	return this.isPlaying;
};

Spry.Widget.ImageSlideShow.prototype.handlePanelSetStart = function(e)
{
	this.isPlaying = true;
	this.addClassName(this.element, this.playingClass);
	return false;
};

Spry.Widget.ImageSlideShow.prototype.handlePanelSetStop = function(e)
{
	this.isPlaying = false;
	this.removeClassName(this.element, this.playingClass);
	return false;
};

Spry.Widget.ImageSlideShow.prototype.handlePanelSetShowNextPanel = function(e)
{
	this.showNextSlide();
	e.preventDefault();
};

Spry.Widget.ImageSlideShow.prototype.updateLabel = function(className, labelStr)
{
	var eles = Spry.$$("." + className, this.element);
	if (eles.length)
	{
		for (var i = 0; i < eles.length; i++)
		{
			var e = eles[i];
			var c = e ? e.contentContainer : e;
			c.innerHTML = labelStr;
		}
	}
};

Spry.Widget.ImageSlideShow.prototype.updateSlideTitle = function()
{
	var info = this.imageInfo[this.currentVirtualSlideIndex];
	var title = (info && info.title) ? info.title : "";

	var evt = new Spry.Widget.Event(this, { title: title });
	this.notifyObservers("onPreUpdateSlideTitle", evt);
	if (!evt.performDefaultAction)
		return false;

	this.updateLabel(this.slideTitleClass, title);

	this.notifyObservers("onPostUpdateSlideTitle", evt);
};

Spry.Widget.ImageSlideShow.prototype.updateSlideCaption = function()
{
	var info = this.imageInfo[this.currentVirtualSlideIndex];
	var caption = (info && info.caption) ? info.caption : "";

	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreUpdateSlideCaption", evt, { caption: caption });
	if (!evt.performDefaultAction)
		return false;

	this.updateLabel(this.slideCaptionClass, caption);

	this.notifyObservers("onPostUpdateSlideCaption", evt);
};

Spry.Widget.ImageSlideShow.prototype.updateSlideCountLabel = function()
{
	var slideIndex = this.currentVirtualSlideIndex;
	var slideCount = this.imageInfo.length;

	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreUpdateSlideCount", evt, { slideIndex: slideIndex, slideCount: slideCount });
	if (!evt.performDefaultAction)
		return false;

	var label = (slideIndex >= 0) ? ((slideIndex+1) + " of " + slideCount) : "";
	this.updateLabel(this.countClass, label);

	this.notifyObservers("onPostUpdateSlideCount", evt);
};

Spry.Widget.ImageSlideShow.prototype.createButtonElement = function(label, className, clickFunc, useLink)
{
	var btn = this.createOptionalSlicedStructure(null, useLink ? "a" : "button", className, null, "span");

	if (useLink)
		btn.href = "#";
	else
		btn.setAttribute("type", "button");

	this.addClassName(btn, className);
	btn.contentContainer.appendChild(document.createTextNode(label));

	return btn;
};

Spry.Widget.ImageSlideShow.prototype.addImageToLoader = function(slideIndex, info)
{
	var self = this;
	this.loader.load(info.src, function(src,img)
	{
		info.width = img.width;
		info.height = img.height;

		var lastSlideIndex = self.imageInfo.length - 1;
		if (!self.isReady && (slideIndex > lastSlideIndex || slideIndex > (self.defaultSlide + 1)))
		{
			self.removeClassName(self.element, self.slideShowBusy);
			self.showSlide(self.defaultSlide);
			if (self.autoPlay)
				self.play();

			self.isReady = true;
		}

		// Show the corresponding slide link for this slide.

		if (self.panelSelector)
			self.panelSelector.enableButton(slideIndex);
	});
};

Spry.Widget.ImageSlideShow.prototype.loadImages = function()
{
	var numImages = this.imageInfo.length;

	for (var i = 0; i < numImages; i++)
		this.addImageToLoader(i, this.imageInfo[i]);
};

Spry.Widget.ImageSlideShow.prototype.extractInfoFromElement = function(ele)
{
	var info = new Object();
	if (ele)
	{
		info.src = ele.href ? ele.href : ele.src;
		info.title = ele.title;
		if (ele.nodeName.toLowerCase() == "a")
		{
			var img = ele.getElementsByTagName("img").item(0);
			if (img)
				info.caption = img.alt;
		}
		else
			info.caption = ele.alt;
	}
	return info;
}

Spry.Widget.ImageSlideShow.prototype.extractImageInfo = function(elements)
{
	var evt = new Spry.Widget.Event(this, { repeatingElements: elements });
	this.notifyObservers("onPreExtractImageInfo", evt);
	if (!evt.performDefaultAction)
		return;

	var cnt = elements.length;
	for (var i = 0; i < cnt; i++)
	{
		var e = elements[i];
		var n = e.nodeName.toLowerCase();
		if (n != "a" && n != "img")
			e = Spry.$$("a, img", e)[0];
		this.imageInfo.push(this.extractInfoFromElement(e));		
	}

	this.notifyObservers("onPostExtractImageInfo", evt);
}

Spry.Widget.ImageSlideShow.prototype.transformMarkup = function()
{
	var elements = [];

	if (!this.repeatingElementSelector)
		elements = this.getElementChildren(this.element);
	else
		elements = Spry.$$(this.repeatingElementSelector, this.element);

	if (this.element.title)
		this.slideShowName = this.element.title;

	this.extractImageInfo(elements);

	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreTransformMarkup", evt);
	if (!evt.performDefaultAction)
		return;

	// Create the 9-Sliced top-level element for the widget.

	var root = this.createOptionalSlicedStructure(null, "div", this.widgetClass);
	var rootCC = root.contentContainer;

	if (this.widgetID)
		root.id = this.widgetID;

	for (var i = 0; i < this.componentOrder.length; i++)
	{
		var itemName = this.componentOrder[i];
		switch (itemName)
		{
			case "view":
				// Create a clip + view combination and stick it into the content container of the root element.
				
				var clip = this.createElement("div", this.clipClass, null);
				var view = this.createElement("div", this.viewClass, clip);
				
				for (var j = 0; j < this.slideElementCount; j++)
				{
					var bufEle = this.slideElements[j] = this.createOptionalSlicedStructure(null, "div", this.slideClass);
					bufEle.appendChild(document.createElement("img"));
					view.appendChild(bufEle);
				}

				rootCC.appendChild(clip);
				break;
			case "controls":
				// Create the slide show control buttons.
			
				var controls = this.createOptionalSlicedStructure(null, "div", this.controlsClass);
				var controlsCC = controls.contentContainer;
				
				controlsCC.appendChild(this.firstBtn = this.createButtonElement("First", this.firstBtnClass, this.firstFunc, !this.useButtonControls));
				controlsCC.appendChild(this.prevBtn = this.createButtonElement("Previous", this.prevBtnClass, this.prevFunc, !this.useButtonControls));
				controlsCC.appendChild(this.playBtn = this.createButtonElement("", this.playBtnClass, this.playFunc, !this.useButtonControls));
				controlsCC.appendChild(this.nextBtn = this.createButtonElement("Next", this.nextBtnClass, this.nextFunc, !this.useButtonControls));
				controlsCC.appendChild(this.lastBtn = this.createButtonElement("Last", this.lastBtnClass, this.lastFunc, !this.useButtonControls));
			
				this.playBtn.contentContainer.innerHTML = "<span class=\"" + this.playLabelClass + "\">Play</span><span class=\"" + this.pauseLabelClass + "\">Pause</span>";

				rootCC.appendChild(controls);
				break;
			case "links":
				var links = this.createOptionalSlicedStructure(null, "div", this.slideLinksClass);
				var linksCC = links.contentContainer;
			
				for (var j = 0; j < elements.length; j++)
					linksCC.appendChild(this.createButtonElement((j+1)+"", this.slideLinkClass, null, true));

				rootCC.appendChild(links);
				break;
			case "name":
				var nameEle = this.createOptionalSlicedStructure(null, "div", this.nameClass);
				if (this.slideShowName)
					nameEle.contentContainer.innerHTML = this.slideShowName;
				rootCC.appendChild(nameEle);
				break;
			case "title":
				rootCC.appendChild(this.createOptionalSlicedStructure(null, "div", this.slideTitleClass));
				break;
			case "caption":
				rootCC.appendChild(this.createOptionalSlicedStructure(null, "div", this.slideCaptionClass));
				break;
			case "count":
				rootCC.appendChild(this.createOptionalSlicedStructure(null, "div", this.countClass));
				break;
		}
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
		this.element = root;
	}

	this.addClassName(this.element, this.slideShowBusy);

	this.notifyObservers("onPostTransformMarkup", evt);
};

Spry.Widget.ImageSlideShow.prototype.attachViewBehaviors = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreAttachViewBehaviors", evt);
	if (!evt.performDefaultAction)
		return;

	this.panelSet = new Spry.Widget.FadingPanels(Spry.$$("." + this.slideClass, this.element),
	{
		defaultPanel: -1,
		dropFrames: this.dropFrames,
		minDuration: this.transitionDuration,
		maxDuration: this.transitionDuration,
		displayInterval: this.displayInterval,
		visibleClass: this.slideVisibleClass,
		hiddenClass: this.slideHiddenClass
	});

	var self = this;
	this.panelSet.addObserver(
	{
		onPreStartSlideShowMode: function(n,evt){ self.handlePanelSetStart(evt); },
		onPreStopSlideShowMode: function(n,evt){ self.handlePanelSetStop(evt); },
		onPreShowNextPanel: function(n,evt){ self.handlePanelSetShowNextPanel(evt); }
	});

	this.notifyObservers("onPostAttachViewBehaviors", evt);	
};

Spry.Widget.ImageSlideShow.prototype.attachButtonBehavior = function(ele, className, clickFunc)
{
	var w = new Spry.Widget.Button(ele,
	{
		downClass: className + "Down",
		hoverClass: className + "Hover",
		disabledClass: className + "Disabled",
		onclick: clickFunc
	});
};

Spry.Widget.ImageSlideShow.prototype.attachControlBehaviors = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreAttachControlBehaviors", evt);
	if (!evt.performDefaultAction)
		return;

	// Search for the buttons by class name. We do this just in case a
	// plugin altered the default markup to add or remove controls.

	var self = this;
	Spry.$$("." + this.firstBtnClass, this.element).forEach(function(n){ self.attachButtonBehavior(n, self.firstBtnClass, self.firstFunc); });
	Spry.$$("." + this.prevBtnClass, this.element).forEach(function(n){ self.attachButtonBehavior(n, self.prevBtnClass, self.prevFunc); });
	Spry.$$("." + this.playBtnClass, this.element).forEach(function(n){ self.attachButtonBehavior(n, self.playBtnClass, self.playFunc); });
	Spry.$$("." + this.nextBtnClass, this.element).forEach(function(n){ self.attachButtonBehavior(n, self.nextBtnClass, self.nextFunc); });
	Spry.$$("." + this.lastBtnClass, this.element).forEach(function(n){ self.attachButtonBehavior(n, self.lastBtnClass, self.lastFunc); });

	this.notifyObservers("onPostAttachControlBehaviors", evt);	
};

Spry.Widget.ImageSlideShow.prototype.handleSlideLinkClick = function(slideLinkEle, slideLinkIndex)
{
	if (!slideLinkEle || slideLinkIndex == this.currentVirtualSlideIndex)
		return;
	if (this.slideLinkStopsSlideShow)
		this.stop();
	this.showSlide(slideLinkIndex);
};

Spry.Widget.ImageSlideShow.prototype.attachLinkBehaviors = function()
{
	var links = Spry.$$("." + this.slideLinkClass, this.element);
	if (links.length > 0)
	{
		var evt = new Spry.Widget.Event(this);
		this.notifyObservers("onPreAttachLinkBehaviors", evt);
		if (!evt.performDefaultAction)
			return;
	
		this.panelSelector = new Spry.Widget.PanelSelector(links, null,
		{
			downClass: this.slideLinkClass + "Down",
			disabledClass: this.slideLinkClass + "Disabled",
			selectedClass: this.slideLinkClass + "Selected",
			unselectedClass: this.slideLinkClass + "Unselected",
			hoverClass: this.slideLinkClass + "Hover",
			focusedClass: this.slideLinkClass + "Focused"
		});
	
		var self = this;
		this.panelSelector.addObserver({ onPostPanelSelectorClick: function(n, evt)
		{
			self.handleSlideLinkClick(evt.target, evt.targetIndex);
			if (self.panelSet)
				self.panelSet.stop();
		}});
	
		for (var i = 0; i < links.length; i++)
			this.panelSelector.disableButton(i);
	
		this.notifyObservers("onPostAttachLinkBehaviors", evt);	
	}
};

Spry.Widget.ImageSlideShow.prototype.attachBehaviors = function(link)
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreAttachBehaviors", evt);
	if (!evt.performDefaultAction)
		return;

	this.attachViewBehaviors();
	this.attachLinkBehaviors();
	this.attachControlBehaviors();

	this.notifyObservers("onPostAttachBehaviors", evt);	
};


/////////////////////////////////////////////////////////
//////////////////////// PLUGINS ////////////////////////
/////////////////////////////////////////////////////////

})(); // EndSpryComponent