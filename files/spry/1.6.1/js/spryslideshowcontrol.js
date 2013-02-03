// SprySlideShowControl.js - version 0.1 - Spry Pre-Release 1.6.1
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

Spry.Widget.SlideShowControl = function(ele, options)
{
	Spry.Utils.Notifier.call(this);

	this.element = Spry.$(ele);
	this.interval = 4000;
	this.timerID = 0;
	this.active = false;

	this.playBtnSelector = ".playBtn";
	this.prevBtnSelector = ".previousBtn";
	this.nextBtnSelector = ".nextBtn";
	this.firstBtnSelector = ".firstBtn";
	this.lastBtnSelector = ".lastBtn";

	this.playClass = "playBtn";
	this.pauseClass = "pauseBtn";

	var self = this;

	this.playBtn = Spry.$$(this.playBtnSelector, this.element)[0];
	if (this.playBtn)
		Spry.Utils.addEventListener(this.playBtn, "click", function(e){ self.toggle(); return false; }, false);

	this.prevBtn = Spry.$$(this.prevBtnSelector, this.element)[0];
	if (this.prevBtn)
		Spry.Utils.addEventListener(this.prevBtn, "click", function(e){ self.previous(); return false; }, false);

	this.nextBtn = Spry.$$(this.nextBtnSelector, this.element)[0];
	if (this.nextBtn)
		Spry.Utils.addEventListener(this.nextBtn, "click", function(e){ self.next(); return false; }, false);

	this.firstBtn = Spry.$$(this.firstBtnSelector, this.element)[0];
	if (this.firstBtn)
		Spry.Utils.addEventListener(this.firstBtn, "click", function(e){ self.first(); return false; }, false);

	this.lastBtn = Spry.$$(this.lastBtnSelector, this.element)[0];
	if (this.lastBtn)
		Spry.Utils.addEventListener(this.lastBtn, "click", function(e){ self.last(); return false; }, false);

};

Spry.Widget.SlideShowControl.prototype = new Spry.Utils.Notifier();
Spry.Widget.SlideShowControl.prototype.constructor = Spry.Widget.SlideShowControl;

Spry.Widget.SlideShowControl.prototype.isActive = function()
{
	return this.slideShowIsActive;
};

Spry.Widget.SlideShowControl.prototype.startTimer = function()
{
	this.killTimer();

	var self = this;
	this.timerID = setInterval(function(){ self.next(); }, this.interval);
};

Spry.Widget.SlideShowControl.prototype.killTimer = function()
{
	if (this.timerID)
		clearInterval(this.timerID);
	this.timerID = 0;
};

Spry.Widget.SlideShowControl.prototype.start = function()
{
	this.slideShowIsActive = true;

	if (this.playBtn)
	{
		Spry.Utils.removeClassName(this.playBtn, this.playClass);
		Spry.Utils.addClassName(this.playBtn, this.pauseClass);
	}

	this.startTimer();
	this.notifyObservers("onStart");
};

Spry.Widget.SlideShowControl.prototype.stop = function()
{
	this.slideShowIsActive = false;

	if (this.playBtn)
	{
		Spry.Utils.addClassName(this.playBtn, this.playClass);
		Spry.Utils.removeClassName(this.playBtn, this.pauseClass);
	}

	this.killTimer();
	this.notifyObservers("onStop");
};

Spry.Widget.SlideShowControl.prototype.toggle = function()
{
	if (this.slideShowIsActive)
		this.stop();
	else
		this.start();
};

Spry.Widget.SlideShowControl.prototype.previous = function(stopSlideShow)
{
	if (stopSlideShow)
		this.killTimer();
	this.notifyObservers("onPreviousSlide");
};

Spry.Widget.SlideShowControl.prototype.next = function(stopSlideShow)
{
	if (stopSlideShow)
		this.killTimer();
	this.notifyObservers("onNextSlide");
};

Spry.Widget.SlideShowControl.prototype.first = function(stopSlideShow)
{
	if (stopSlideShow)
		this.killTimer();
	this.notifyObservers("onFirstSlide");
};


Spry.Widget.SlideShowControl.prototype.last = function(stopSlideShow)
{
	if (stopSlideShow)
		this.killTimer();
	this.notifyObservers("onLastSlide");
};