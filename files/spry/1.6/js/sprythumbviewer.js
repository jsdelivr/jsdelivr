// SpryThumbViewer.js - version 0.1 - Spry Pre-Release 1.6
//
// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
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

var Spry; if (!Spry) Spry = {}; if (!Spry.Widget) Spry.Widget = {};

Spry.Widget.ThumbViewer = function(ele, options)
{
	Spry.Utils.Notifier.call(this);

	this.element = Spry.$(ele);
	this.loader = new Spry.Utils.ImageLoader();
	this.nextImageID = 0;

	this.maxDimension = 70;
	this.thumbWidth = 24;
	this.thumbHeight = 24;

	this.tnLinkSelector = "a[href]";
	this.tnImageSelector = "a[href] > img";

	this.currentImage = null;

	this.behaviorsArray = [];

	this.attachBehaviors();
	this.select(0);
};

Spry.Widget.ThumbViewer.prototype = new Spry.Utils.Notifier();
Spry.Widget.ThumbViewer.prototype.constructor = Spry.Widget.ThumbViewer;

Spry.Widget.ThumbViewer.setOptions = function(obj, optionsObj, ignoreUndefinedProps)
{
	if (!optionsObj)
		return;
	for (var optionName in optionsObj)
	{
		if (ignoreUndefinedProps && optionsObj[optionName] == undefined)
			continue;
		obj[optionName] = optionsObj[optionName];
	}
};

Spry.Widget.ThumbViewer.prototype.attachBehaviors = function()
{
	var self = this;
	if (this.element)
		this.getThumbImages().forEach(function(img){ if (img.src) self.preloadImage(img); });
};

Spry.Widget.ThumbViewer.prototype.attachHoverBehaviors = function(img)
{
	var a = Spry.Utils.getAncestor(img, "a[href]");
	if (a)
	{
		var self = this;
		Spry.Utils.addEventListener(a, "mouseover", function(e) { self.growThumbnail(img); return false; }, false);
		Spry.Utils.addEventListener(a, "mouseout", function(e) { self.shrinkThumbnail(img); return false; }, false);
		Spry.Utils.addEventListener(a, "click", function(e) { self.select(img); return false; }, false);
	}

};

Spry.Widget.ThumbViewer.prototype.preloadImage = function(img)
{
	if (this.loader && img.src)
	{
		var self = this;
		this.loader.load(img.src, function(url, loaderImage)
		{
			img.spryOrigWidth = loaderImage.width;
			img.spryOrigHeight = loaderImage.height;
			self.attachHoverBehaviors(img);
		}, 10);

		// var a = Spry.Utils.getAncestor(img, "a[href]");
		// if (a) this.loader.load(a.href);
	}
};

Spry.Widget.ThumbViewer.prototype.cancelBehavior = function(id)
{
	if (this.behaviorsArray[id])
	{
		this.behaviorsArray[id].cancel();
		this.behaviorsArray[id] = null;
	}
};

Spry.Widget.ThumbViewer.prototype.sizeAndPosition = function(img, toX, toY, toWidth, toHeight, callback)
{
	var id = img.spryID;

	this.cancelBehavior(id);
	var effectCluster = new Spry.Effect.Cluster( { finish: callback } );
	var moveEffect = new Spry.Effect.Move(img, Spry.Effect.getPosition(img), { x: toX, y: toY, units: "px" }, { duration: 400 });
	var sizeEffect = new Spry.Effect.Size(img, Spry.Effect.getDimensions(img), { width: toWidth, height: toHeight, units: "px" }, { duration: 400 });
	
	effectCluster.addParallelEffect(moveEffect);
	effectCluster.addParallelEffect(sizeEffect);
	
	//effectCluster.finish = callback;
	
	this.behaviorsArray[id] = effectCluster;
	this.behaviorsArray[id].start();
};

Spry.Widget.ThumbViewer.prototype.growThumbnail = function(img)
{
	if (!img.spryOrigWidth || !img.spryOrigHeight)
		return;

	Spry.Utils.addClassName(img, "inFocus");
	img.style.zIndex = 150;
	
	if (!img.spryID)
		img.spryID = ++this.nextImageID;

	var w = img.spryOrigWidth;
	var h = img.spryOrigHeight;

	var ratio = this.maxDimension / (w > h ? w : h);

	w *= ratio;
	h *= ratio;
	var x = (this.thumbWidth - w) / 2;
	var y = (this.thumbHeight - h) / 2;
	
	var self = this;
	this.sizeAndPosition(img, x, y, w, h, function(b){ self.behaviorsArray[img.spryID] = null; });
};

Spry.Widget.ThumbViewer.prototype.shrinkThumbnail = function(img)
{
	var self = this;
	Spry.Utils.addClassName(img, "inFocus");
	img.style.zIndex = 1;
	this.sizeAndPosition(img, 0, 0, this.thumbWidth, this.thumbHeight, function(b){self.behaviorsArray[img.spryID] = null; Spry.Utils.removeClassName(img, "inFocus");});
};

Spry.Widget.ThumbViewer.prototype.select = function(img)
{
	var imgs = this.getThumbImages();

	img = (typeof img == "number") ? imgs[img] : Spry.$(img);
	if (!img) return;

	if (this.currentImage)
		Spry.Utils.removeClassName(this.currentImage, "selectedThumbnail");
	Spry.Utils.addClassName(img, "selectedThumbnail");
	this.currentImage = img;

	var a = Spry.Utils.getAncestor(img, "a[href]");
	if (a)
	{
		this.notifyObservers("onSelect", a.href);
		if (img == imgs[0])
			this.notifyObservers("onFirstSelect", a.href);
		if (img == imgs[imgs.length - 1])
			this.notifyObservers("onLastSelect", a.href);
	}
};

Spry.Widget.ThumbViewer.prototype.previous = function()
{
	var img = this.currentImage;
	var imgs = this.getThumbImages();

	for (var i = 0; i < imgs.length; i++)
	{
		if (imgs[i] == img)
		{
			if (--i < 0) i = imgs.length - 1;
			this.select(imgs[i]);
			return;
		}
		prevImg = imgs[i];
	}
};

Spry.Widget.ThumbViewer.prototype.next = function()
{
	var img = this.currentImage;
	var imgs = this.getThumbImages();

	for (var i = 0; i < imgs.length; i++)
	{
		if (imgs[i] == img)
		{
			if (++i >= imgs.length) i = 0;
			this.select(imgs[i]);
			return;
		}
		prevImg = imgs[i];
	}
};

Spry.Widget.ThumbViewer.prototype.getThumbLinks = function()
{
	return Spry.$$(this.tnLinkSelector, this.element);
};

Spry.Widget.ThumbViewer.prototype.getThumbImages = function()
{
	return Spry.$$(this.tnImageSelector, this.element);
};

Spry.Widget.ThumbViewer.prototype.getCurrentThumbLink = function()
{
	return Spry.Utils.getAncestor(this.currentImage, "a[href]");
};

Spry.Widget.ThumbViewer.prototype.getCurrentThumbImage = function()
{
	return this.currentImage;
};

Spry.Widget.ThumbViewer.prototype.getThumbCount = function()
{
	return Spry.$$(this.tnImageSelector, this.element).length;
};
