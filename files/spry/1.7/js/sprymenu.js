// SpryMenu.js - version 0.19 - Spry Pre-Release 1.7
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
	alert("SpryMenu.js requires SpryWidget.js!");
	return;
}

var defaultConfig = {
	plugIns:               [],

	mainMenuShowDelay:      200, // msecs
	mainMenuHideDelay:        0, // msecs
	subMenuShowDelay:       200, // msecs
	subMenuHideDelay:       300, // msecs

	enableHoverNavigation:  true,

	insertMenuBarBreak:     false,
	insertSubMenuBreak:     false,

	widgetID: null,

	widgetClass:              "MenuBar",           // Sliceable
	menuBarViewClass:         "MenuBarView",
	menuBarBreakClass:        "MenuBarBreak",
	subMenuClass:             "SubMenu",           // Sliceable
	subMenuViewClass:         "SubMenuView",
	subMenuBreakClass:        "SubMenuBreak",
	subMenuVisibleClass:      "SubMenuVisible",
	menuItemContainerClass:   "MenuItemContainer", // Sliceable
	menuItemContainerHoverClass: "MenuItemContainerHover",
	menuItemClass:            "MenuItem",          // Sliceable
	menuItemHoverClass:       "MenuItemHover",
	menuItemSelectedClass:    "MenuItemSelected",
	menuItemLabelClass:       "MenuItemLabel",     // Sliceable
	menuItemWithSubMenuClass: "MenuItemWithSubMenu",
	menuItemFirstClass:       "MenuItemFirst",
	menuItemLastClass:        "MenuItemLast",
	menuLevelClassPrefix:     "MenuLevel",

	sliceMap: {}
};

Spry.Widget.MenuBar2 = function(ele, opts)
{
	Spry.Widget.Base.call(this);

	this.element = Spry.$$(ele)[0];

	// Initialize the accordion object with the global defaults.

	this.setOptions(this, Spry.Widget.MenuBar2.config);
	
	// Override the defaults with any options passed into the constructor.

	this.setOptions(this, opts);

	this.showMenuTimer = 0;
	this.menuToShow = null;
	this.hideMenuTimer = 0;
	this.menuToHide = null;

	this.currentMenuItem = null;
	this.currentSubMenu = null;

	this.initializePlugIns(Spry.Widget.MenuBar2.config.plugIns, opts);

	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreInitialize", evt);
	if (!evt.performDefaultAction)
		return;

	this.transformMarkup();
	this.attachBehaviors();

	this.notifyObservers("onPostInitialize", evt);
};

Spry.Widget.MenuBar2.prototype = new Spry.Widget.Base();
Spry.Widget.MenuBar2.prototype.constructor = Spry.Widget.MenuBar2;

Spry.Widget.MenuBar2.config = defaultConfig;

Spry.Widget.MenuBar2.prototype.transformMarkup = function()
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreTransformMarkup", evt);
	if (!evt.performDefaultAction)
		return;

	// Find the <a> elements and convert them to MenuItems.
	
	var eles = Spry.$$("a", this.element);
	for (var i = 0; i < eles.length; i++)
	{
		var a = eles[i];
		var ca = this.extractChildNodes(a);

		this.createOptionalSlicedStructure(a, "span", this.menuItemClass);
		var label = this.createOptionalSlicedStructure(null, "span", this.menuItemLabelClass);
		this.appendChildNodes(label.contentContainer, ca);
		a.contentContainer.appendChild(label);
	}

	// Add MenuItemContainer class to all <li> elements.

	var eles = Spry.$$("li", this.element);
	for (var i = 0; i < eles.length; i++)
		this.addClassName(eles[i], this.menuItemContainerClass);

	// Find all <ul> elements and convert them to SubMenus.

	var eles = Spry.$$("ul", this.element);
	for (var i = 0; i < eles.length; i++)
	{
		var ul = eles[i];
		this.addClassName(ul, this.subMenuViewClass);
		var sm = this.createOptionalSlicedStructure(null, "div", this.subMenuClass);
		ul.parentNode.insertBefore(sm, ul);
		sm.contentContainer.appendChild(ul);
		var mi = this.getMenuItemForSubMenu(sm);
		if (mi)
			this.addClassName(mi, this.menuItemWithSubMenuClass);
		if (this.insertSubMenuBreak)
		{
			var br = document.createElement("br");
			this.addClassName(br, this.subMenuBreakClass);
			sm.contentContainer.appendChild(br);
		}
	}

	// Mark each submenu with a class that indicates its level.

	var sms = Spry.$$("." + this.subMenuClass, this.element);
	var r = this.element;
	for (var i = 0; i < sms.length; i++)
	{
		var e = sms[i].parentNode;
		var level = 1;
		while (e && e != r)
		{
			if (this.hasClassName(e, this.subMenuClass))
				level++;
			e = e.parentNode;
		}
		this.addClassName(sms[i], this.menuLevelClassPrefix + level);
	}

	// Wrap the original menubar <ul> with a <div>.

	var root = this.createOptionalSlicedStructure(null, "div", this.widgetClass);
	var oldRoot = this.element;
	oldRoot.parentNode.insertBefore(root, oldRoot);
	root.contentContainer.appendChild(oldRoot);
	this.addClassName(oldRoot, this.menuBarViewClass);
	this.element = root;

	if (this.insertMenuBarBreak)
	{
		var br = document.createElement("br");
		this.addClassName(br, this.menuBarBreakClass);
		root.contentContainer.appendChild(br);
	}

	// Add a class to the first and last menu item in the MenuBar and its submenus.

	var eles = Spry.$$("." + this.menuBarViewClass + ", ." + this.subMenuViewClass, this.element);
	for (var i = 0; i < eles.length; i++)
	{
		var containers = this.getElementChildren(eles[i]);
		if (containers.length)
		{
			this.addClassName(this.getElementChildren(containers[0])[0], this.menuItemFirstClass);
			this.addClassName(this.getElementChildren(containers[containers.length - 1])[0], this.menuItemLastClass);
		}
	}

	if (this.widgetID)
	{
		if (oldRoot.id == this.widgetID)
			oldRoot.id = "";
		root.id = this.widgetID;
	}

	this.notifyObservers("onPostTransformMarkup", evt);
};

Spry.Widget.MenuBar2.prototype.getMenuLevel = function(m)
{
	// Return the nesting level for a given menu. Menus that hang
	// off of menu items in a menubar have a level of 1.

	var level = 0;
	while (m)
	{
		m = this.getParentMenuForElement(m, true);
		if (m) ++level;
	}
	return level;
};

Spry.Widget.MenuBar2.prototype.getFirstSiblingWithClass = function(ele, className)
{
	// Return the first sibling of element that has the specified className.

	if (ele && className)
	{
		var eles = this.getElementChildren(ele.parentNode);
		for (var i = 0; i < eles.length; i++)
		{
			var e = eles[i];
			if (this.hasClassName(e, className))
				return e;
		}
	}

	return null;
};

Spry.Widget.MenuBar2.prototype.getSubMenuForMenuItem = function(mi)
{
	return this.getFirstSiblingWithClass(mi, this.subMenuClass);
};

Spry.Widget.MenuBar2.prototype.getMenuItemForSubMenu = function(subMenu)
{
	return this.getFirstSiblingWithClass(subMenu, this.menuItemClass);
};

Spry.Widget.MenuBar2.prototype.getParentMenuForElement = function(ele, treatMenuBarAsMenu)
{
	// Find the parent menu for the specified element. This is done
	// by traversing up the parent hierarchy for the specified element
	// until we come across an element with the subMenu class on it.

	while (ele && ele != this.element)
	{
		ele = ele.parentNode;
		if (this.hasClassName(ele, this.subMenuClass) || (treatMenuBarAsMenu && this.hasClassName(ele, this.widgetClass)))
			return ele;
	}
	return null;
};

Spry.Widget.MenuBar2.prototype.getMenuItemsForMenu = function(ele)
{
	// Return an array that contains all of the menu items for the
	// specified menu.

	var results = [];
	if (ele && ele.contentContainer)
	{
		var view = this.getElementChildren(ele.contentContainer)[0];
		if (view)
		{
			var miContainers = this.getElementChildren(view);
			if (miContainers.length)
			{
				for (var i = 0; i < miContainers.length; i++)
				{
					var mi = Spry.$$("." + this.menuItemClass, miContainers[i])[0];
					if (mi)
						results.push(mi);
				}
			}
		}
	}
	return results;
};

Spry.Widget.MenuBar2.prototype.clearPendingShowRequest= function(subMenu)
{
	// Cancel the request if no subMenu was specified, or the subMenu
	// specified matches the menu we were going to show.

	if (!subMenu || this.menuToShow == subMenu)
	{
		if (this.showMenuTimer)
			clearTimeout(this.showMenuTimer);
		this.showMenuTimer = 0;
		this.menuToShow = null;
	}
};

Spry.Widget.MenuBar2.prototype.flushPendingShowRequest = function()
{
	// If there is a pending show request for a menu,
	// force the menu to be visible now.

	var mts = this.menuToShow;
	this.clearPendingShowRequest();
	if (mts) this.showSubMenu(mts);
};

Spry.Widget.MenuBar2.prototype.triggerShowRequestForSubMenu = function(subMenu)
{
	// Fire off a timer to show the specified subMenu.

	if (subMenu)
	{
		this.clearPendingHideRequest(subMenu);
	
		if (this.menuToShow != subMenu && !this.hasClassName(subMenu, this.subMenuVisibleClass))
		{
			if (this.showMenuTimer)
				clearTimeout(this.showMenuTimer);

			var self = this;
			this.menuToShow = subMenu;
			var delay = this.getMenuLevel(subMenu) > 1 ? this.subMenuShowDelay : this.mainMenuShowDelay;

			if (delay <= 0)
				this.flushPendingShowRequest();
			else
				this.showMenuTimer = setTimeout(function() { self.flushPendingShowRequest(); }, delay);
		}
	}
};

Spry.Widget.MenuBar2.prototype.clearPendingHideRequest = function(subMenu)
{
	// If there is a pending request for hiding the specified subMenu,
	// kill the request!

	if (!subMenu || this.menuToHide == subMenu || Spry.Utils.isDescendant(this.menuToHide, subMenu))
	{
		if (this.hideMenuTimer)
			clearTimeout(this.hideMenuTimer);
		this.hideMenuTimer = 0;
		this.menuToHide = null;
	}
};

Spry.Widget.MenuBar2.prototype.flushPendingHideRequest = function()
{
	// If there is a pending request to hide a subMenu, force it
	// to be hidden now. Make sure that we only hide menus in the
	// subMenu hierarchy that do not contain the current menu item.

	var mth = this.menuToHide;
	this.clearPendingHideRequest();
	if (mth)
	{
		var cmi = this.currentMenuItem;
		var m = this.getParentMenuForElement(cmi);
		var sm = this.getSubMenuForMenuItem(cmi);
		this.hideSubMenu(mth, (sm ? sm : m));
	}
};

Spry.Widget.MenuBar2.prototype.triggerHideRequestForSubMenu = function(subMenu)
{
	// Fire off a timer to hide the specified subMenu.

	if (subMenu)
	{
		this.clearPendingShowRequest(subMenu);

		if (this.menuToHide != subMenu)
		{
			// Flush any pending hides.
	
			this.flushPendingHideRequest();
	
			// Now fireoff a request for hiding the submenu.

			var self = this;
			this.menuToHide = subMenu;
			var delay = this.getMenuLevel(subMenu) > 1 ? this.subMenuHideDelay : this.mainMenuHideDelay;
			if (delay < 1)
				this.flushPendingHideRequest();
			else
				this.hideMenuTimer = setTimeout(function(){ self.flushPendingHideRequest(); },delay);
		}
	}
};

Spry.Widget.MenuBar2.prototype.getElementAndAncestors = function(ele, classNameFilter)
{
	// Return an array of the specified element and its ancestors. The last
	// element in the array is the element itself, the first is its furthest
	// ancestor.

	var root = this.element;
	var result = [];
	while (ele && ele != root)
	{
		if (!classNameFilter || this.hasClassName(ele, classNameFilter))
			result.unshift(ele);
		ele = ele.parentNode;
	}
	return result;
};

Spry.Widget.MenuBar2.prototype.getSubMenuHierarchy = function(subMenu)
{
	// Return an array that is the path/ancestor hierarchy up to the
	// specified subMenu.

	return this.getElementAndAncestors(subMenu, this.subMenuClass);
};

Spry.Widget.MenuBar2.prototype.getMenuItemHierarchy = function(mi)
{
	// Return an array that is the path/ancestor hierarchy up to the
	// specified menu item.

	var results = [];
	if (mi)
	{
		results.push(mi);
		var m = this.getParentMenuForElement(mi);
		while (m)
		{
			mi = this.getMenuItemForSubMenu(m);
			if (mi)
				results.unshift(mi);
			m = this.getParentMenuForElement(m);
		}
	}
	return results;
};

Spry.Widget.MenuBar2.prototype.pruneCommonAncestorElements = function(a,b)
{
	// Given 2 ancestor arrays 'a' and 'b', start pruning off the elements
	// they have in common from the start of the arrays, then return
	// any left-over elements in 'b' as the result.

	var result = [];
	var minLen = Math.min(a.length, b.length);
	for (var i = 0; i < b.length; i++)
	{
		if (i >= minLen || a[i] != b[i])
			result.push(b[i]);
	}

	return result;
};

Spry.Widget.MenuBar2.prototype.hideSubMenu = function(subMenu, visibleSubMenu)
{
	// Hide the specified subMenu and its ancestor subMenus. If visibleSubMenu
	// is non-null, prune off any common ancestors they have so that they remain
	// visible.

	if (subMenu)
	{
		var smh = this.getSubMenuHierarchy(subMenu);
		var vmh = this.getSubMenuHierarchy(visibleSubMenu);
		smh = this.pruneCommonAncestorElements(vmh, smh);

		var evt = new Spry.Widget.Event(this, { subMenus: smh });
		this.notifyObservers("onPreHideSubMenuHierarchy", evt);
		if (!evt.performDefaultAction)
			return;

		for (var i = 0; i < smh.length; i++)
		{
			var sm = smh[i];
			var mi = this.getMenuItemForSubMenu(sm);
			if (mi && mi != this.currentMenuItem) this.removeHoverClass(mi);
			this.removeClassName(sm, this.subMenuVisibleClass);
			if (sm == this.currentSubMenu)
				this.currentSubMenu = this.getParentMenuForElement(sm);
		}

		this.notifyObservers("onPostHideSubMenuHierarchy", evt);
	}
};

Spry.Widget.MenuBar2.prototype.showSubMenu = function(ele, forceSync)
{
	// The goal of this method is to be smart about what we hide/show to
	// minimize flashing.

	this.clearPendingHideRequest(ele);

	var csm = this.currentSubMenu;
	var isSameMenu = csm && csm == ele;
	var isVisible = isSameMenu || (ele && Spry.Utils.isDescendant(ele, csm));

	// If isSameMenu is true, then we are being asked to show a menu
	// that is already being displayed. We simply skip that case and
	// move on.

	if (!isSameMenu)
	{
		// The menu to show is different from the current menu.

		if (isVisible)
		{
			// The menu we are being asked to show is already visible,
			// but some of its subMenus are currently being displayed.
			// If the caller wants to force a sync, hide the subMenus.

			if (forceSync)
				this.hideSubMenu(csm, ele);
			this.currentSubMenu = ele;
		}
		else // !isVisible
		{
			// If the new menu is not a descendant of the current subMenu,
			// hide the current sub menu.

			if (!Spry.Utils.isDescendant(csm, ele))
				this.hideSubMenu(csm, ele);

			this.flushPendingHideRequest();

			var nsmh = this.getSubMenuHierarchy(ele);

			var evt = new Spry.Widget.Event(this, { subMenus: nsmh });
			this.notifyObservers("onPreShowSubMenuHierarchy", evt);
			if (!evt.performDefaultAction)
				return;

			for (var i = nsmh.length - 1; i >= 0; --i)
			{
					var sm = nsmh[i];
					if (csm == ele) break;
					var mi = this.getMenuItemForSubMenu(sm);
					if (mi) this.addHoverClass(mi);
					this.addClassName(sm, this.subMenuVisibleClass);
			}

			this.currentSubMenu = ele;

			this.notifyObservers("onPostShowSubMenuHierarchy", evt);
		}
	}
};

Spry.Widget.MenuBar2.prototype.addHoverClass = function(mi)
{
	var evt = new Spry.Widget.Event(this, { menuItem: mi });
	this.notifyObservers("onPreAddHoverClass", evt);
	if (!evt.performDefaultAction)
		return;

	this.addClassName(mi, this.menuItemHoverClass);

	var mic = Spry.Utils.getAncestor(mi, "." + this.menuItemContainerClass);
	if (mic)
		this.addClassName(mic, this.menuItemContainerHoverClass);

	this.notifyObservers("onPostAddHoverClass", evt);
};

Spry.Widget.MenuBar2.prototype.removeHoverClass = function(mi)
{
	var evt = new Spry.Widget.Event(this, { menuItem: mi });
	this.notifyObservers("onPreRemoveHoverClass", evt);
	if (!evt.performDefaultAction)
		return;

	this.removeClassName(mi, this.menuItemHoverClass);

	var mic = Spry.Utils.getAncestor(mi, "." + this.menuItemContainerClass);
	if (mic)
		this.removeClassName(mic, this.menuItemContainerHoverClass);

	this.notifyObservers("onPostRemoveHoverClass", evt);
};

Spry.Widget.MenuBar2.prototype.setCurrentMenuItem = function(ele, forceSync)
{
	// Make the specified menu item the current one we track. Force
	// all of its ancestor menus and menu items to be visible and
	// hilighted.

	var evt = new Spry.Widget.Event(this, { oldMenuItem: this.currentMenuItem, menuItem: ele });
	this.notifyObservers("onPreSetCurrentMenuItem", evt);
	if (!evt.performDefaultAction)
		return;

	if (this.currentMenuItem)
	{
		// Calculate the menu items that need to be un-hilighted.

		var ch = this.getMenuItemHierarchy(this.currentMenuItem);
		var eh = this.getMenuItemHierarchy(ele);
		ch = this.pruneCommonAncestorElements(eh, ch);
		for (var i = 0; i < ch.length; i++)
			this.removeHoverClass(ch[i]);
	}

	this.currentMenuItem = ele;

	if (ele)
	{
		this.addHoverClass(ele);
		var menu = this.getParentMenuForElement(ele);
		this.showSubMenu(menu, forceSync);
	}

	this.notifyObservers("onPostSetCurrentMenuItem", evt);
};

Spry.Widget.MenuBar2.prototype.handleMenuItemClick = function(evt, ele)
{
	// We need to track the currentSubMenu before the current
	// menu item is changed. This will allow us to tell if the user
	// has clicked on a menubar menu item a 2nd time, which should
	// result in the subMenu being hidden.

	var oldCSM = this.currentSubMenu;

	// Set the current menu item to the item that was just clicked.
	// Make sure to force a synchronous update so that subMenus get
	// hidden properly.

	this.setCurrentMenuItem(ele, true);

	// Menu items are typically links. If the user has clicked on a menu
	// item that is a link to a destination other than "#", then we want to
	// allow the default link navigation behavior to be triggered. If it is an
	// "empty" link or the menu item isn't a link at all, then we show its
	// subMenu if it exists.

	// Using getAttribute() gives us the actual URL used in the HTML for
	// Mozilla. Using ele.href will give us the page location prepended to
	// any "#" urls. For IE, either approaches yields the location prepended
	// to any "#" urls so we have to strip the location off of it.

	var h = ele.getAttribute("href");
	h = h ? h.replace(document.location, "") : h;
	if (!h || h == "#")
	{
		var sm = this.getSubMenuForMenuItem(ele);
		if (sm)
		{
			// If the menu item has a subMenu, check to see if the menu item
			// is a top-level menubar menu item. If it is, we want to hide
			// the subMenu if it was already showing when the user clicked
			// on the menu item.

			if (oldCSM == sm && !this.getParentMenuForElement(ele))
			{
				this.setCurrentMenuItem(null);
				this.hideSubMenu(sm);
				return false;
			}

			this.showSubMenu(sm, true);
		}
		return false;
	}

	// Return undefined to allow for default handling and bubbling.

	return undefined;
};

Spry.Widget.MenuBar2.prototype.handleMenuItemEnter = function(evt, ele)
{
	// Update our internal state so that the menu item that was
	// just entered becomes the currentMenuItem.

	if (this.currentMenuItem == ele)
		return;

	this.setCurrentMenuItem(ele);

	// The menu item has a subMenu, trigger a request to show it.

	var sm = this.getSubMenuForMenuItem(ele);
	if (sm)
		this.triggerShowRequestForSubMenu(sm);
};

Spry.Widget.MenuBar2.prototype.handleMenuItemExit = function(evt, ele)
{
	// If we've exited the currentMenuItem, unhilight it and
	// trigger a hide request for its subMenu. If it doesn't have
	// subMenu, trigger a hide request for its parent if the mouse
	// has left the menuItem's parent menu.

	var pm = this.getParentMenuForElement(ele);
	var sm = this.getSubMenuForMenuItem(ele);
	var rt = evt.relatedTarget ? evt.relatedTarget : evt.toElement;

	// Bail if it is an exit event for an item inside the menu item, or
	// if the exit was triggered by the mouse moving into the subMenu for
	// the menu item.

	if ((rt == ele || Spry.Utils.isDescendant(ele, rt)) || (rt == sm || Spry.Utils.isDescendant(sm, rt)))
		return;

	// This is a real exit so un-hilight the menu item
	// then fire off a request to hide the subMenu.

	this.removeHoverClass(ele);

	if (this.currentMenuItem == ele)
		this.currentMenuItem = null;

	if (!sm) sm = (!Spry.Utils.isDescendant(pm, rt) ? pm : null);
	if (sm) this.triggerHideRequestForSubMenu(sm);
};

Spry.Widget.MenuBar2.prototype.attachMenuItemBehaviors = function(ele, className, clickFunc)
{
	// Attach the event handlers for the specified menuItem.

	var evt = new Spry.Widget.Event(this, { menuItem: ele });
	this.notifyObservers("onPreAttachMenuItemBehaviors", evt);
	if (!evt.performDefaultAction)
		return;

	var self = this;

	if (this.enableHoverNavigation)
	{
		this.addEventListener(ele, "mouseover", function(evt){ return self.handleMenuItemEnter(evt, ele); });
		this.addEventListener(ele, "mouseout", function(evt){ return self.handleMenuItemExit(evt, ele); });
	}
	this.addEventListener(ele, "click", function(evt){ return self.handleMenuItemClick(evt, ele); });

	this.notifyObservers("onPostAttachMenuItemBehaviors", evt);	
};

Spry.Widget.MenuBar2.prototype.attachBehaviors = function(link)
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreAttachBehaviors", evt);
	if (!evt.performDefaultAction)
		return;

	var mis = Spry.$$("." + this.menuItemClass, this.element);
	for (var i = 0; i < mis.length; i++)
		this.attachMenuItemBehaviors(mis[i], this.menuItemClass);

	this.notifyObservers("onPostAttachBehaviors", evt);	
};

})(); // EndSpryComponent