// SpryMenuBar.js - version 0.4 - Spry Pre-Release 1.5
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

/*******************************************************************************

 SpryMenuBar.js
 This file handles the JavaScript for Spry Menu Bar.  You should have no need
 to edit this file.  Some highlights of the MenuBar object is that timers are
 used to keep submenus from showing up until the user has hovered over the parent
 menu item for some time, as well as a timer for when they leave a submenu to keep
 showing that submenu until the timer fires.

 *******************************************************************************/

var Spry;
if(!Spry)
{
	Spry = {};
}
if(!Spry.Widget)
{
	Spry.Widget = {};
}

// Constructor for Menu Bar
// element should be an ID of an unordered list (<ul> tag)
// preloadImage1 and preloadImage2 are images for the rollover state of a menu
Spry.Widget.MenuBar = function(element, opts)
{
	this.init(element, opts);
};

Spry.Widget.MenuBar.prototype.init = function(element, opts)
{
	this.element = this.getElement(element);

	// represents the current (sub)menu we are operating on
	this.currMenu = null;

	var isie = (typeof document.all != 'undefined' && typeof window.opera == 'undefined' && navigator.vendor != 'KDE');
	if(typeof document.getElementById == 'undefined' || (navigator.vendor == 'Apple Computer, Inc.' && typeof window.XMLHttpRequest == 'undefined') || (isie && typeof document.uniqueID == 'undefined'))
	{
		// bail on older unsupported browsers
		return;
	}

	// load hover images now
	if(opts)
	{
		for(var k in opts)
		{
			var rollover = new Image;
			rollover.src = opts[k];
		}
	}

	if(this.element)
	{
		this.currMenu = this.element;
		var items = this.element.getElementsByTagName('li');
		for(var i=0; i<items.length; i++)
		{
			this.initialize(items[i], element, isie);
			if(isie)
			{
				this.addClassName(items[i], "MenuBarItemIE");
				items[i].style.position = "static";
			}
		}
		if(isie)
		{
			if(this.hasClassName(this.element, "MenuBarVertical"))
			{
				this.element.style.position = "relative";
			}
			var linkitems = this.element.getElementsByTagName('a');
			for(var i=0; i<linkitems.length; i++)
			{
				linkitems[i].style.position = "relative";
			}
		}
	}
};

Spry.Widget.MenuBar.prototype.getElement = function(ele)
{
	if (ele && typeof ele == "string")
		return document.getElementById(ele);
	return ele;
};

Spry.Widget.MenuBar.prototype.hasClassName = function(ele, className)
{
	if (!ele || !className || !ele.className || ele.className.search(new RegExp("\\b" + className + "\\b")) == -1)
	{
		return false;
	}
	return true;
};

Spry.Widget.MenuBar.prototype.addClassName = function(ele, className)
{
	if (!ele || !className || this.hasClassName(ele, className))
		return;
	ele.className += (ele.className ? " " : "") + className;
};

Spry.Widget.MenuBar.prototype.removeClassName = function(ele, className)
{
	if (!ele || !className || !this.hasClassName(ele, className))
		return;
	ele.className = ele.className.replace(new RegExp("\\s*\\b" + className + "\\b", "g"), "");
};

// addEventListener for Menu Bar
// attach an event to a tag without creating obtrusive HTML code
Spry.Widget.MenuBar.prototype.addEventListener = function(element, eventType, handler, capture)
{
	try
	{
		if (element.addEventListener)
		{
			element.addEventListener(eventType, handler, capture);
		}
		else if (element.attachEvent)
		{
			element.attachEvent('on' + eventType, handler);
		}
	}
	catch (e) {}
};

// createIframeLayer for Menu Bar
// creates an IFRAME underneath a menu so that it will show above form controls and ActiveX
Spry.Widget.MenuBar.prototype.createIframeLayer = function(menu)
{
	var layer = document.createElement('iframe');
	layer.tabIndex = '-1';
	layer.src = 'javascript:false;';
	menu.parentNode.appendChild(layer);
	
	layer.style.left = menu.offsetLeft + 'px';
	layer.style.top = menu.offsetTop + 'px';
	layer.style.width = menu.offsetWidth + 'px';
	layer.style.height = menu.offsetHeight + 'px';
};

// removeIframeLayer for Menu Bar
// removes an IFRAME underneath a menu to reveal any form controls and ActiveX
Spry.Widget.MenuBar.prototype.removeIframeLayer =  function(menu)
{
	var layers = menu.parentNode.getElementsByTagName('iframe');
	while(layers.length > 0)
	{
		layers[0].parentNode.removeChild(layers[0]);
	}
};

// clearMenus for Menu Bar
// root is the top level unordered list (<ul> tag)
Spry.Widget.MenuBar.prototype.clearMenus = function(root)
{
	var menus = root.getElementsByTagName('ul');
	for(var i=0; i<menus.length; i++)
	{
		this.hideSubmenu(menus[i]);
	}
	this.removeClassName(this.element, "MenuBarActive");
};

// bubbledTextEvent for Menu Bar
// identify bubbled up text events in Safari so we can ignore them
Spry.Widget.MenuBar.prototype.bubbledTextEvent = function()
{
	return (navigator.vendor == 'Apple Computer, Inc.' && (event.target == event.relatedTarget.parentNode || (event.eventPhase == 3 && event.target.parentNode == event.relatedTarget)));
};

// showSubmenu for Menu Bar
// set the proper CSS class on this menu to show it
Spry.Widget.MenuBar.prototype.showSubmenu = function(menu)
{
	if(this.currMenu)
	{
		this.clearMenus(this.currMenu);
		this.currMenu = null;
	}
	
	if(menu)
	{
		this.addClassName(menu, "MenuBarSubmenuVisible");
		if(typeof document.all != 'undefined' && typeof window.opera == 'undefined' && navigator.vendor != 'KDE')
		{
			if(!this.hasClassName(this.element, "MenuBarHorizontal") || menu.parentNode.parentNode != this.element)
			{
				menu.style.top = menu.parentNode.offsetTop + 'px';
			}
		}
		if(typeof document.uniqueID != "undefined")
		{
			this.createIframeLayer(menu);
		}
	}
	this.addClassName(this.element, "MenuBarActive");
};

// hideSubmenu for Menu Bar
// remove the proper CSS class on this menu to hide it
Spry.Widget.MenuBar.prototype.hideSubmenu = function(menu)
{
	if(menu)
	{
		this.removeClassName(menu, "MenuBarSubmenuVisible");
		if(typeof document.all != 'undefined' && typeof window.opera == 'undefined' && navigator.vendor != 'KDE')
		{
			menu.style.top = '';
			menu.style.left = '';
		}
		this.removeIframeLayer(menu);
	}
};

// initialize for Menu Bar
// create event listeners for the Menu Bar widget so we can properly
// show and hide submenus
Spry.Widget.MenuBar.prototype.initialize = function(listitem, element, isie)
{
	var opentime, closetime;
	var link = listitem.getElementsByTagName('a')[0];
	var submenus = listitem.getElementsByTagName('ul');
	var menu = (submenus.length > 0 ? submenus[0] : null);

	var hasSubMenu = false;
	if(menu)
	{
		this.addClassName(link, "MenuBarItemSubmenu");
		hasSubMenu = true;
	}

	if(!isie)
	{
		// define a simple function that comes standard in IE to determine
		// if a node is within another node
		listitem.contains = function(testNode)
		{
			// this refers to the list item
			if(testNode == null)
			{
				return false;
			}
			if(testNode == this)
			{
				return true;
			}
			else
			{
				return this.contains(testNode.parentNode);
			}
		};
	}
	
	// need to save this for scope further down
	var self = this;

	this.addEventListener(listitem, 'mouseover', function(e)
	{
		if(self.bubbledTextEvent())
		{
			// ignore bubbled text events
			return;
		}
		clearTimeout(closetime);
		if(self.currMenu == listitem)
		{
			self.currMenu = null;
		}
		// show menu highlighting
		self.addClassName(link, hasSubMenu ? "MenuBarItemSubmenuHover" : "MenuBarItemHover");
		if(menu && !self.hasClassName(menu, "MenuBarSubmenuVisible"))
		{
			opentime = window.setTimeout(function(){self.showSubmenu(menu);}, 250);
		}
	}, false);

	this.addEventListener(listitem, 'mouseout', function(e)
	{
		if(self.bubbledTextEvent())
		{
			// ignore bubbled text events
			return;
		}

		var related = (typeof e.relatedTarget != 'undefined' ? e.relatedTarget : e.toElement);
		if(!listitem.contains(related))
		{
			clearTimeout(opentime);
			self.currMenu = listitem;

			// remove menu highlighting
			self.removeClassName(link, hasSubMenu ? "MenuBarItemSubmenuHover" : "MenuBarItemHover");
			if(menu)
			{
				closetime = window.setTimeout(function(){self.hideSubmenu(menu);}, 600);
			}
		}
	}, false);
};
