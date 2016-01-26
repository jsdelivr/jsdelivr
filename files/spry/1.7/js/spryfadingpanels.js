// SpryFadingPanels.js - version 0.5 - Spry Pre-Release 1.7
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
	alert("SpryFadingPanels.js requires SpryPanelSet.js!");
	return;
}

Spry.Widget.FadingPanels = function(elements, opts)
{
	// Override any of the global defaults with options passed into
	// the constructor.

	var mergedOpts = this.setOptions(this.setOptions({}, Spry.Widget.FadingPanels.config), opts);

	Spry.Widget.PanelSet.call(this, Spry.$$(elements), mergedOpts);
};

Spry.Widget.FadingPanels.prototype = new Spry.Widget.PanelSet();
Spry.Widget.FadingPanels.prototype.constructor = Spry.Widget.FadingPanels;

Spry.Widget.FadingPanels.config = {
	defaultPanel:    0,
	minOpacity:      0,
	maxOpacity:      1,
	minDuration:     500, // msecs
	maxDuration:     500, // msecs
	stoppedMinDuration:     200, // msecs
	stoppedMaxDuration:     200, // msecs

	visibleClass:    "FadingPanelVisible",
	hiddenClass:     "FadingPanelHidden",

	autoPlay:       false,
	displayInterval: 4000, // msecs
	parallelTransition:true
};

Spry.Widget.FadingPanels.prototype.initialize = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreInitialize", evt);
	if (!evt.performDefaultAction)
		return;

	this.disableNotifications();

	Spry.Widget.PanelSet.prototype.initialize.call(this);

	var panels = this.getPanels();
	var cpanel = this.currentPanel;

	for (var i = 0; i < panels.length; i++)
	{
		var p = panels[i];
		this.setOpacity(p, (p == cpanel) ? this.maxOpacity : this.minOpacity);
	}

	this.enableNotifications();

	this.notifyObservers("onPostInitialize", evt);
};

Spry.Widget.FadingPanels.prototype.showPanel = function(eleOrIndex)
{
	var ele = this.indexToElement(eleOrIndex);
	if (ele && ele != this.currentPanel)
	{
		var evt = this.createEvent(ele, { currentPanel: this.currentPanel });
		this.notifyObservers("onPreShowPanel", evt);
		if (!evt.performDefaultAction)
			return;

		if (this.showEffect && !this.parallelTransition) {
			this.showEffect.stop();
		}

		if (this.hideEffect && !this.parallelTransition) {
			this.hideEffect.stop();
		}

		var currentPanel = this.currentPanel;
		this.currentPanel = ele;

		var self = this;
		var showPanelComplete = function() {
			self.currentPanel = ele;
			self.addClassName(ele, self.visibleClass);
			self.removeClassName(ele, self.hiddenClass);

			self.notifyObservers("onPreShowPanelEffect", evt);
			self.showEffect = new Spry.Effect.CSSAnimator(ele, "opacity: " + self.maxOpacity, { duration: self.isPlaying()?self.maxDuration:self.stoppedMaxDuration });
			self.showEffect.addObserver({
				onAnimationComplete: function() {
					self.showEffect = null;
					self.notifyObservers("onPostShowPanelEffect", evt);
				}
			});
			self.showEffect.start();

			self.notifyObservers("onPostShowPanel", evt);
		};

		if (currentPanel)
			this.hidePanel(currentPanel, showPanelComplete);
		else
			showPanelComplete();

	}
};

Spry.Widget.FadingPanels.prototype.hidePanel = function(eleOrIndex, callback)
{
	var ele = this.indexToElement(eleOrIndex);
	if (ele) {
		var evt = this.createEvent(ele);
		this.notifyObservers("onPreHidePanel", evt);
		if (!evt.performDefaultAction)
			return;

		this.currentPanel = null;

		var self = this;
		var hidePanelComplete = function() {
			self.addClassName(ele, self.hiddenClass);
			self.removeClassName(ele, self.visibleClass);
			self.notifyObservers("onPostHidePanel", evt);

			if(callback) {
				callback();
			}
		};

		this.notifyObservers("onPreHidePanelEffect", evt);
		this.hideEffect = new Spry.Effect.CSSAnimator(ele, "opacity: " + this.minOpacity, { duration: this.isPlaying()?this.minDuration:this.stoppedMinDuration });
		this.hideEffect.addObserver({
			onAnimationComplete: function() {
				self.hideEffect = null;
				self.notifyObservers("onPostHidePanelEffect", evt);
				if (!self.parallelTransition) {
					hidePanelComplete();
				}
			}
		})
		this.hideEffect.start();

		if (this.parallelTransition) {
			hidePanelComplete();
		}
	}
};

})(); // EndSpryComponent