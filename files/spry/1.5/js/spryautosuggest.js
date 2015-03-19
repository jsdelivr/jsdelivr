// SpryAutoSuggest.js - version 0.3 - Spry Pre-Release 1.5
//
// Copyright (c) 2006. Adobe Systems Incorporated.
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

var Spry; if (!Spry) Spry = {}; if (!Spry.Widget) Spry.Widget = {};

Spry.Widget.AutoSuggest = function(textElement, suggestRegion, queryFunc)
{
	this.textElement = Spry.$(textElement);
	this.region = Spry.$(suggestRegion);
	this.queryFunc = queryFunc;
	this.timerID = 0;
	var self = this;

	this.addEventListener(this.textElement, "keyup", function(e) { self.handleKeyUp(e); }, false);

	// Set up an observer so we can attach our cilck behaviors whenever
	// the region is regenerated.

	var regionID = this.getElementID(suggestRegion);
	Spry.Data.Region.addObserver(regionID, { onPostUpdate: function(notifier, data) {
			self.attachClickBehaviors();
	}});

	// Try and attach the behaviors now, just in case the region
	// is ready.

	this.attachClickBehaviors();
};

Spry.Widget.AutoSuggest.prototype.getElementID = function(ele)
{
	if (ele && typeof ele == "string")
		return ele;
	return ele.getAttribute("id");
};

Spry.Widget.AutoSuggest.prototype.getValue = function()
{
	if (!this.textElement)
		return "";
	return this.textElement.value;
}

Spry.Widget.AutoSuggest.prototype.setValue = function(str)
{
	if (!this.textElement)
		return;
	this.textElement.value = str;
	this.showSuggestions(false);
}

Spry.Widget.AutoSuggest.prototype.focus = function()
{
	if (!this.textElement)
		return;
	this.textElement.focus();
}

Spry.Widget.AutoSuggest.prototype.showSuggestions = function(doShow)
{
	if (this.region)
		this.region.style.display = (doShow ? "block" : "none");
};

Spry.Widget.AutoSuggest.KEY_ESC = 27;

Spry.Widget.AutoSuggest.prototype.handleKeyUp = function(e)
{
	if (this.timerID)
	{
		clearTimeout(this.timerID);
		this.timerID = null;
	}

	// If the user hit the escape key, hide the auto suggest menu!
	if (e.keyCode == Spry.Widget.AutoSuggest.KEY_ESC || !this.getValue())
	{
		this.showSuggestions(false);
		return;
	}

	var self = this;
	this.timerID = setTimeout(function() { self.timerID = null; self.queryFunc(self, self.getValue()); }, 100);
};

Spry.Widget.AutoSuggest.prototype.addEventListener = function(element, eventType, handler, capture)
{
	try
	{
		if (element.addEventListener)
			element.addEventListener(eventType, handler, capture);
		else if (element.attachEvent)
			element.attachEvent("on" + eventType, handler);
	}
	catch (e) {}
};

Spry.Widget.AutoSuggest.prototype.addClickListener =  function(node, suggestionValue)
{
	var self = this;
	this.addEventListener(node, "click", function(e) { self.setValue(suggestionValue); self.focus(); }, false);
};

Spry.Widget.AutoSuggest.prototype.attachClickBehaviors =  function()
{
	var self = this;
	var valNodes = Spry.Utils.getNodesByFunc(this.region, function(node) {
		if (node.nodeType == 1 /* Node.ELEMENT_NODE */)
		{
			var attr = node.attributes.getNamedItem("spry:suggestion");
			if (attr)
				self.addClickListener(node, attr.value);
		}
		return false;
	});
};
