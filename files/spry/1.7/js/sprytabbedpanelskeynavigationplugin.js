// SpryTabbedPanelsKeyNavigationPlugin.js - version 0.1 - Spry Pre-Release 1.7
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

if (typeof Spry == "undefined" || !Spry.Widget || !Spry.Widget.TabbedPanels2)
{
	alert("SpryTabbedPanelsKeyNavigationPlugin.js requires SpryTabbedPanels2.js!");
	return;
}

var KNP = Spry.Widget.TabbedPanels2.KeyNavigationPlugin = {
	initialize: function(tb)
	{
		tb.addObserver(this);
	},

	KEY_UP:    38,
	KEY_DOWN:  40,
	KEY_LEFT:  37,
	KEY_RIGHT: 39,
	KEY_ENTER: 13,
	KEY_SPACE: 32,

	handleOnButtonKeyDown: function(e, tb, btn)
	{
		var currentIndex = tb.panelSelector.elementToIndex(btn);

		if (currentIndex != -1 )
		{
			var key = e.keyCode;
			var nextIndex = -1;
			switch(key)
			{
				case KNP.KEY_LEFT:
				case KNP.KEY_UP:
					if (currentIndex > 0)
						nextIndex = currentIndex - 1;
					else
						nextIndex = tb.panelSelector.getButtonCount() - 1;
					break;
				case KNP.KEY_RIGHT:
				case KNP.KEY_DOWN:
					if (currentIndex < tb.panelSelector.getButtonCount() - 1)
						nextIndex = currentIndex + 1;
					else
						nextIndex = 0;
					break;
				case KNP.KEY_SPACE:
				case KNP.KEY_ENTER:
					nextIndex = currentIndex;
					break;
			}

			if (nextIndex != -1)
			{
				tb.panelSelector.handleActivate(nextIndex);
				tb.panelSelector.focusButton(nextIndex);
				return Spry.Utils.cancelEvent(e);
			}
		}
	},
	onPostAttachTabBehaviors: function(tb, evt)
	{
		if (tb.enableKeyboardNavigation && tb.panelSelector) {
			for (var i=0; i<tb.panelSelector.buttons.length; i++) {
				tb.panelSelector.buttons[i].psButton.addObserver({
				 	onButtonKeyDown: function(btn, e) {
				 		KNP.handleOnButtonKeyDown(e.event, tb, e.element);
				 	}
				 });
			}
		}
	}
};

// We want to add our plugin to the default configuration for TabbedPanels2 if it is included!

Spry.Widget.TabbedPanels2.config.plugIns.push(Spry.Widget.TabbedPanels2.KeyNavigationPlugin);

})(); // EndSpryComponent
