// SpryMenuBarKeyNavigationPlugin.js - version 0.5 - Spry Pre-Release 1.7
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

if (typeof Spry == "undefined" || !Spry.Widget || !Spry.Widget.MenuBar2)
{
	alert("SpryMenuBarKeyNavigationPlugin.js requires SpryMenu.js!");
	return;
}

var KNP = Spry.Widget.MenuBar2.KeyNavigationPlugin = {
	config: {
		pluginOptionsProp:   "KNP",
		horizontalLayoutMap: { MenuBar: true }
	},

	initialize: function(mb)
	{
		var opts = mb.setOptions({}, KNP.config);

		if (mb[opts.pluginOptionsProp])
			mb.setOptions(opts, mb[opts.pluginOptionsProp]);

		mb[opts.pluginOptionsProp] = opts;

		mb.addObserver(this);
	},

	KEY_TAB:    9,
	KEY_ESC:   27,
	KEY_UP:    38,
	KEY_DOWN:  40,
	KEY_LEFT:  37,
	KEY_RIGHT: 39,
	KEY_SPACE: 32,

	getOptions: function(mb)
	{
		return mb[KNP.config.pluginOptionsProp];
	},

	bindEventCBFunc: function(cbName, mb, mi)
	{
		return function(e) { return KNP[cbName](e, mb, mi); };
	},

	getIndexOf: function(arr, item)
	{
		if (arr && arr.length)
		{
			for (var i = 0; i < arr.length; i++)
			{
				if (arr[i] == item)
					return i;
			}
		}
		return -1;
	},

	menuIsHorizontal: function(mb, m)
	{
		var menuLevel = mb.getMenuLevel(m);
		var cname = menuLevel ? "MenuLevel" + menuLevel : "MenuBar";
		return KNP.getOptions(mb).horizontalLayoutMap[cname] ? true : false;
	},

	goToMenuItemByOffset: function(mb, mi, offset)
	{
		var menu = mb.getParentMenuForElement(mi, true);
		if (menu)
		{
			var mItems = mb.getMenuItemsForMenu(menu);
			if (mItems.length)
			{
				var miIndex = KNP.getIndexOf(mItems, mi);
				if (miIndex >= 0)
				{
				 	miIndex += offset;
					if (miIndex >= 0 && miIndex < mItems.length)
					{
						mi = mItems[miIndex];
						KNP.setCurrentMenuItem(mb, mi);
					}
				}
			}
		}
		return false;
	},

	goToNextMenuItem: function(mb, mi) { return KNP.goToMenuItemByOffset(mb, mi, 1); },
	goToPreviousMenuItem: function(mb, mi) { return KNP.goToMenuItemByOffset(mb, mi, -1); },

	openMenuItemSubMenu: function(mb, mi)
	{
		var subMenu = mb.getSubMenuForMenuItem(mi);
		if (subMenu)
		{
			var subMI = mb.getMenuItemsForMenu(subMenu)[0];
			if (subMI)
				KNP.setCurrentMenuItem(mb, subMI);
		}
	},
	
	closeParentMenu: function(mb, mi)
	{
		var menu = mb.getParentMenuForElement(mi, true);
		if (menu)
		{
			var parentMI = mb.getMenuItemForSubMenu(menu);
			var parentMenu = mb.getParentMenuForElement(menu);
			if (parentMI)
				KNP.setCurrentMenuItem(mb, parentMI);
		}
	},

	setCurrentMenuItem: function(mb, mi)
	{
		var cmi = mb.currentMenuItem;
		if (cmi && cmi == mi)
			return;

		mb.setCurrentMenuItem(mi, true);

		if (cmi)
			mb.hideSubMenu(mb.getParentMenuForElement(cmi), mb.getParentMenuForElement(mi));

		if (mi.focus)
			mi.focus();
	},

	handleKeyDown: function(evt, mb, mi)
	{
		if (mi != mb.currentMenuItem)
			return;

		var menu = mb.getParentMenuForElement(mi, true);
		var isHorizontal = KNP.menuIsHorizontal(mb, menu);
		var result = undefined;

		switch (evt.keyCode)
		{
			case KNP.KEY_TAB:
			case KNP.KEY_ESC:
				mb.setCurrentMenuItem(null, true);
				mb.hideSubMenu(mb.getParentMenuForElement(mi));	
				if (mi.blur)
					mi.blur();
				if (evt.keyCode != KNP.KEY_TAB)
					result = false;
				break;
			case KNP.KEY_RIGHT:
				if (isHorizontal)
					KNP.goToNextMenuItem(mb, mi);
				else
					KNP.openMenuItemSubMenu(mb, mi);
				result = false;
				break;
			case KNP.KEY_LEFT:
				if (isHorizontal)
					KNP.goToPreviousMenuItem(mb, mi);
				else
					KNP.closeParentMenu(mb, mi);
				result = false;
				break;
			case KNP.KEY_UP:
				if (isHorizontal)
					KNP.closeParentMenu(mb, mi);
				else
					KNP.goToPreviousMenuItem(mb, mi);
				result = false;
				break;
			case KNP.KEY_DOWN:
				if (isHorizontal)
					KNP.openMenuItemSubMenu(mb, mi);
				else
					KNP.goToNextMenuItem(mb, mi);
				result = false;
				break;
			case KNP.KEY_SPACE:
				KNP.openMenuItemSubMenu(mb, mi);
				result = false;
				break;
		}

		return result;
	},

	handleFocus: function(evt, mb, mi)
	{
		if (!mb.currentMenuItem)
			mb.setCurrentMenuItem(mi, true);
	},

	onPostTransformMarkup: function(mb, evt)
	{
		var links = Spry.$$("." + mb.menuItemClass, mb.element);
		if (links.length)
		{
			for (var i = 0; i < links.length; i++)
			{
				var l = links[i];
				l.tabIndex = i ? "-1" : "0";
				mb.addEventListener(l, "keydown", KNP.bindEventCBFunc("handleKeyDown", mb, l), false);
				mb.addEventListener(l, "focus", KNP.bindEventCBFunc("handleFocus", mb, l), false);
			}
		}
	}
};

// We want to add our plugin to the default configuration for MenuBar2 if it is included!

Spry.Widget.MenuBar2.config.plugIns.push(Spry.Widget.MenuBar2.KeyNavigationPlugin);

})(); // EndSpryComponent
