// SpryContentSlideShow.js - version 0.10 - Spry Pre-Release 1.7
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
	alert("SpryContentSlideShow.js requires SpryWidget.js!");
	return;
}

var defaultConfig = {
	plugIns:               [],

	injectionType: "inside",        // "inside" or "replace"
	extractionType: "element",      // "element" or "content"
	repeatingElementSelector: null,

	useButtonControls: false,       // true == <button>, false == <a>

	dropFrames: true,

	autoPlay: true,
	transitionDuration: 2000,       // msecs
	displayInterval: 6000,          // msecs

	widgetID: null,

	widgetClass: "SlideShow",                    // Sliceable
	playingClass: "SSPlaying",
	clipClass: "SSClip",
	viewClass: "SSView",
	slideClass: "SSSlide",                       // Sliceable
	slideVisibleClass: "SSSlideVisible",
	slideHiddenClass: "SSSlideHidden",
	slideTitleClass: "SSSlideTitle",             // Sliceable
	slideDescriptionClass: "SSSlideDescription", // Sliceable
	countClass: "SSSlideCount",                  // Sliceable
	slideLinksClass: "SSSlideLinks",             // Sliceable
	slideLinkClass: "SSSlideLink",               // Sliceable
	controlsClass: "SSControls",                 // Sliceable
	firstBtnClass: "SSFirstButton",              // Sliceable
	prevBtnClass: "SSPreviousButton",            // Sliceable
	playBtnClass: "SSPlayButton",                // Sliceable
	nextBtnClass: "SSNextButton",                // Sliceable
	lastBtnClass: "SSLastButton",                // Sliceable
	playLabelClass: "SSPlayLabel",
	pauseLabelClass: "SSPauseLabel",
	slideShowBusy: "SSBusy",
	slideLoading: "SSSlideLoading",

	sliceMap: {},
	componentOrder: [ "view", "controls", "links", "title", "description", "count" ]
};

Spry.Widget.ContentSlideShow = function(ele, opts)
{
	Spry.Widget.Base.call(this);

	this.element = Spry.$$(ele)[0];
	this.isPlaying = false;

	// Initialize the accordion object with the global defaults.

	this.setOptions(this, Spry.Widget.ContentSlideShow.config);
	
	// Override the defaults with any options passed into the constructor.

	this.setOptions(this, opts);

	var self = this;

	this.firstFunc = function(e) { return self.showFirstSlide(); };
	this.prevFunc = function(e) { return self.showPreviousSlide(); };
	this.playFunc = function(e) { return self.togglePlayMode(); };
	this.nextFunc = function(e) { return self.showNextSlide(); };
	this.lastFunc = function(e) { return self.showLastSlide(); };

	this.initializePlugIns(Spry.Widget.ContentSlideShow.config.plugIns, opts);

	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreInitialize", evt);
	if (!evt.performDefaultAction)
		return;

	this.transformMarkup();
	this.attachBehaviors();

	this.updateSlideCountLabel();

	if (this.autoPlay)
		this.triggerCallbackAfterOnLoad(this.play, this);

	this.notifyObservers("onPostInitialize", evt);
};

Spry.Widget.ContentSlideShow.prototype = new Spry.Widget.Base();
Spry.Widget.ContentSlideShow.prototype.constructor = Spry.Widget.ContentSlideShow;

Spry.Widget.ContentSlideShow.config = defaultConfig;

Spry.Widget.ContentSlideShow.prototype.showSlide = function(eleOrIndex)
{
	var ps = this.panelSet;
	if (ps && ps.showPanel)
		ps.showPanel(eleOrIndex);
};

Spry.Widget.ContentSlideShow.prototype.hideSlide = function(eleOrIndex)
{
	var ps = this.panelSet;
	if (ps && ps.hidePanel)
		ps.hidePanel(eleOrIndex);
};

Spry.Widget.ContentSlideShow.prototype.showFirstSlide = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreShowFirstSlide", evt);
	if (!evt.performDefaultAction)
		return false;

	if (this.panelSet)
		this.panelSet.showFirstPanel();

	this.notifyObservers("onPostShowFirstSlide", evt);

	return false;
};

Spry.Widget.ContentSlideShow.prototype.showPreviousSlide = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreShowPreviousSlide", evt);
	if (!evt.performDefaultAction)
		return false;

	if (this.panelSet)
		this.panelSet.showPreviousPanel();

	this.notifyObservers("onPostShowPreviousSlide", evt);

	return false;
};

Spry.Widget.ContentSlideShow.prototype.showNextSlide = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreShowNextSlide", evt);
	if (!evt.performDefaultAction)
		return false;

	if (this.panelSet)
		this.panelSet.showNextPanel();

	this.notifyObservers("onPostShowNextSlide", evt);

	return false;
};

Spry.Widget.ContentSlideShow.prototype.showLastSlide = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreShowLastSlide", evt);
	if (!evt.performDefaultAction)
		return false;

	if (this.panelSet)
		this.panelSet.showLastPanel();

	this.notifyObservers("onPostShowLastSlide", evt);

	return false;
};

Spry.Widget.ContentSlideShow.prototype.play = function()
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

Spry.Widget.ContentSlideShow.prototype.stop = function()
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

Spry.Widget.ContentSlideShow.prototype.togglePlayMode = function()
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

Spry.Widget.ContentSlideShow.prototype.getCurrentSlide = function()
{
	return this.panelSet ? this.panelSet.getCurrentPanel() : null;
};

Spry.Widget.ContentSlideShow.prototype.getCurrentSlideIndex = function(idx)
{
	var ps = this.panelSet;
	return ps && ps.getCurrentPanelIndex ? ps.getCurrentPanelIndex() : -1;
};

Spry.Widget.ContentSlideShow.prototype.getSlideIndex = function(ele)
{
	var ps = this.panelSet;
	return ps && ps.getPanelIndex ? ps.getPanelIndex(ele) : -1;
};

Spry.Widget.ContentSlideShow.prototype.getSlides = function()
{
	var results = [];
	var clip = Spry.$$("." + this.clipClass, this.element)[0];
	if (clip)
		return Spry.$$("." + this.slideClass, clip);
	return results;
};

Spry.Widget.ContentSlideShow.prototype.isInPlayMode = function()
{
	return this.isPlaying;
};

Spry.Widget.ContentSlideShow.prototype.handlePanelSetStart = function(e)
{
	this.isPlaying = true;
	this.addClassName(this.element, this.playingClass);
	return false;
};

Spry.Widget.ContentSlideShow.prototype.handlePanelSetStop = function(e)
{
	this.isPlaying = false;
	this.removeClassName(this.element, this.playingClass);
	return false;
};

Spry.Widget.ContentSlideShow.prototype.handlePanelSetPreShowPanel = function(e)
{
	var evt = new Spry.Widget.Event(this, { target: e.panelElement });
	this.notifyObservers("onPreShowSlide", evt);
	if (!evt.performDefaultAction)
	{
		e.preventDefault();
		return false;
	}

	return false;
};

Spry.Widget.ContentSlideShow.prototype.handlePanelSetPostShowPanel = function(e)
{
	this.updateSlideCountLabel();

	var evt = new Spry.Widget.Event(this, { target: e.target, slideIndex: e.targetIndex });
	this.notifyObservers("onPostShowSlide", evt);

	return false;
};

Spry.Widget.ContentSlideShow.prototype.updateSlideCountLabel = function()
{
	var self = this;
	Spry.$$("." + this.countClass).forEach(function(n)
	{
		if (n.contentContainer)
			n.contentContainer.innerHTML = self.getSlideCountLabel();
	});
};

Spry.Widget.ContentSlideShow.prototype.getSlideCountLabel = function()
{
	var str = "";
	var ps = this.panelSet;
	if (ps)
		str += (ps.getCurrentPanelIndex() + 1) + " of " + ps.getPanelCount();
	return str;
};

Spry.Widget.ContentSlideShow.prototype.createButtonElement = function(label, className, clickFunc, useLink)
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

Spry.Widget.ContentSlideShow.prototype.transformMarkup = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreTransformMarkup", evt);
	if (!evt.performDefaultAction)
		return;

	var elements = [];

	if (!this.repeatingElementSelector)
		elements = this.getElementChildren(this.element);
	else
		elements = Spry.$$(this.repeatingElementSelector, this.element);

	// Create the 9-Sliced top-level element for the widget.

	var root = this.createOptionalSlicedStructure(null, "div", this.widgetClass);
	var rootCC = root.contentContainer;

	if (this.widgetID)
		root.id = this.widgetID;

	// Create a clip + view combination and stick it into the content container of the root element.
	
	var clip = this.createElement("div", this.clipClass, null);
	var view = this.createElement("div", this.viewClass, clip);
	

	for (var i = 0; i < this.componentOrder.length; i++)
	{
		var itemName = this.componentOrder[i];
		switch (itemName)
		{
			case "view":
				var extractElement = this.extractionType == "element";
			
				for (var j = 0; j < elements.length; j++)
				{
					var p = this.createOptionalSlicedStructure(null, "div", this.slideClass);
					view.appendChild(p);
			
					if (extractElement)
						p.contentContainer.appendChild(elements[j]);			
					else
						this.appendChildNodes(p.contentContainer, this.extractChildNodes(elements[j]));
				}

				rootCC.appendChild(clip);
				break;
			case "controls":
				// Create the slide show control buttons.
			
				var controls = this.createOptionalSlicedStructure(null, "div", this.controlsClass);
				var controlsCC = controls.contentContainer;
				
				controlsCC.appendChild(this.firstBtn = this.createButtonElement("First", this.firstBtnClass, this.firstFunc));
				controlsCC.appendChild(this.prevBtn = this.createButtonElement("Previous", this.prevBtnClass, this.prevFunc));
				controlsCC.appendChild(this.playBtn = this.createButtonElement("", this.playBtnClass, this.playFunc));
				controlsCC.appendChild(this.nextBtn = this.createButtonElement("Next", this.nextBtnClass, this.nextFunc));
				controlsCC.appendChild(this.lastBtn = this.createButtonElement("Last", this.lastBtnClass, this.lastFunc));
			
				this.playBtn.contentContainer.innerHTML = "<span class=\"" + this.playLabelClass + "\">Play</span><span class=\"" + this.pauseLabelClass + "\">Pause</span>";

				rootCC.appendChild(controls);
				break;
			case "links":
				// Now create a 9-sliced panel and link button for each set of elements that were matched.
			
				var links = this.createOptionalSlicedStructure(null, "div", this.slideLinksClass);
				var linksCC = links.contentContainer;

				for (var j = 0; j < elements.length; j++)
					linksCC.appendChild(this.createButtonElement((j+1)+"", this.slideLinkClass, null, true));

				rootCC.appendChild(links);
				break;
			case "title":
				rootCC.appendChild(this.createOptionalSlicedStructure(null, "div", this.slideTitleClass));
				break;
			case "description":
				rootCC.appendChild(this.createOptionalSlicedStructure(null, "div", this.slideDescriptionClass));
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
	}

	this.notifyObservers("onPostTransformMarkup", evt);
};

Spry.Widget.ContentSlideShow.prototype.attachViewBehaviors = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreAttachViewBehaviors", evt);
	if (!evt.performDefaultAction)
		return;

	this.panelSet = new Spry.Widget.FadingPanels(Spry.$$("." + this.slideClass, this.element),
	{
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
		onPreShowPanel: function(n,evt){ self.handlePanelSetPreShowPanel(evt); },
		onPostShowPanel: function(n,evt){ self.handlePanelSetPostShowPanel(evt); }
	});

	this.notifyObservers("onPostAttachViewBehaviors", evt);	
};

Spry.Widget.ContentSlideShow.prototype.attachButtonBehavior = function(ele, className, clickFunc)
{
	var w = new Spry.Widget.Button(ele,
	{
		downClass: className + "Down",
		hoverClass: className + "Hover",
		disabledClass: className + "Disabled",
		onclick: clickFunc
	});
};

Spry.Widget.ContentSlideShow.prototype.attachControlBehaviors = function()
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

Spry.Widget.ContentSlideShow.prototype.attachLinkBehaviors = function()
{
	var links = Spry.$$("." + this.slideLinkClass, this.element);
	if (links.length > 0)
	{
		var evt = new Spry.Widget.Event(this);
		this.notifyObservers("onPreAttachLinkBehaviors", evt);
		if (!evt.performDefaultAction)
			return;
	
		this.panelSelector = new Spry.Widget.PanelSelector(links, this.panelSet,
		{
			selectedClass: this.slideLinkClass + "Selected",
			unselectedClass: this.slideLinkClass + "Unselected",
			hoverClass: this.slideLinkClass + "Hover"
		});
	
		this.notifyObservers("onPostAttachLinkBehaviors", evt);
	}
};

Spry.Widget.ContentSlideShow.prototype.attachBehaviors = function(link)
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

//
// slideTransitionPlugin
//
// Replaces the default fading transition used within the slideshow
// widget with a slider panels transition.
//

Spry.Widget.ContentSlideShow.slideTransitionPlugin = {
	initialize: function(slideshow)
	{
		// Add the plugin as an observer on the slideshow.

		slideshow.addObserver(this);
	},

	onPreAttachViewBehaviors: function(slideshow, evt)
	{
		slideshow.panelSet = new Spry.Widget.SliderPanels(Spry.$$("." + slideshow.clipClass, slideshow.element),
		{
			displayInterval: slideshow.displayInterval,
			visibleClass: slideshow.slideVisibleClass,
			hiddenClass: slideshow.slideHiddenClass
		});
	
		slideshow.panelSet.addObserver(
		{
			onPreStartSlideShowMode: function(n,evt){ slideshow.handlePanelSetStart(evt); },
			onStop: function(n,evt){ slideshow.handlePanelSetStop(evt); },
			onPreShowPanel: function(n,evt){ slideshow.handlePanelSetPreShowPanel(evt); },
			onPostShowPanel: function(n,evt){ slideshow.handlePanelSetPostShowPanel(evt); }
		});
		
		evt.preventDefault();
	}
};

//
// imageListPlugin
//
// Converts a list of image links into a slideshow that displays the
// full-resolution images. It is assumed that the @href of each link
// is a URL to the full-resolution image.
//
// Expected input markup:
//
//    <ul>
//        <li><a href="foo.jpg" title="image caption"> ... </a></li>
//        ...
//        <li><a href="bar.jpg" title="image caption"> ... </a></li>
//    </ul>
//

Spry.Widget.ContentSlideShow.imageListPlugin = {
	slideLoadingClass: "SlideLoading",

	initialize: function(slideshow)
	{
		// Our input is a list. We need to replace it with
		// the top-level <div> used by the slideshow since a
		// <div> is not allowed inside a <ul>.

		slideshow.injectionType = "replace";

		// Set the slideshow extraction and selector so that it
		// treats all <a> elements as the slide content. We'll post
		// process the links and convert them to real images during
		// the onPostTransformMarkup notification.

		slideshow.extractionType = "element";
		slideshow.repeatingElementSelector = "a";

		// If the image loader is available, use it!

		if (typeof Spry.Utils.ImageLoader != "undefined")
			slideshow.ilpLoader = new Spry.Utils.ImageLoader();

		// Add ourself as an observer.

		slideshow.addObserver(this);
	},
	
	createImage: function(slideshow, src, title)
	{
		var img = document.createElement("img");
		if (slideshow.ilpLoader)
		{
			slideshow.ilpLoader.load(src, function(){ img.src = src; });
		}
		else
			img.src = src;
		img.title = title;
	},
	
	onPostTransformMarkup: function(slideshow, evt)
	{
		// The slideshow has already transformed the markup. Each slide
		// panel now contains a link to the large images we want to display.
		// simply replace each link with an image element that points to the
		// large image.

		var imgLinks = Spry.$$("." + slideshow.slideClass + " a",slideshow.element).forEach(function(n)
		{
			var bigImg = document.createElement("img");
			bigImg.src = n.href;
			bigImg.title = n.title;
			n.parentNode.replaceChild(bigImg, n);
		});
	}
};

})(); // EndSpryComponent