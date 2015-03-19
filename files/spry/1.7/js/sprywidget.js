// SpryWidget.js - version 0.16 - Spry Pre-Release 1.7
//
// Copyright (c) 2009. Adobe Systems Incorporated.
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
	
if (typeof Spry == "undefined" || !Spry.Utils || !Spry.$$)
{
	alert("SpryWidget.js requires SpryDOMUtils.js");
	return;
}

if (!Spry.Widget) Spry.Widget = {};

Spry.Widget.setOptions = function(obj, optionsObj, ignoreUndefinedProps)
{
	if (obj && optionsObj)
	{
		for (var optionName in optionsObj)
		{
			var v = optionsObj[optionName];
			if (!ignoreUndefinedProps || v != undefined)
				obj[optionName] = v;
		}
	}
	return obj;
};

Spry.Widget.onLoadDidFire = false;
Spry.Widget.onLoadQueue = [];

Spry.Widget.addCallbackToOnLoadQueue = function(callbackFunc, context)
{
	if (callbackFunc)
	{
		if (context)
		{
			var cf = callbackFunc;
			callbackFunc = function() { cf.call(context); };
		}

		Spry.Widget.onLoadQueue.push(callbackFunc);
	}
};

Spry.Widget.triggerCallbackAfterOnLoad = function(callbackFunc, context)
{
	if (Spry.Widget.onLoadDidFire)
		callbackFunc.call(context);
	else
		Spry.Widget.addCallbackToOnLoadQueue(callbackFunc, context);
		
};

Spry.Widget.processOnLoadQueue = function()
{
	Spry.Widget.onLoadDidFire = true;
	var q = Spry.Widget.onLoadQueue;
	while (q.length)
		(q.shift())();
};

Spry.Utils.addLoadListener(Spry.Widget.processOnLoadQueue);

Spry.Widget.Base = function()
{
	Spry.Widget.Base.Notifier.call(this);
};

Spry.Widget.Base.Notifier = function()
{
	this.observers = [];
	this.suppressNotifications = 0;
};

Spry.Widget.Base.Notifier.prototype.addObserver = function(observer)
{
	if (!observer)
		return;

	// Make sure the observer isn't already on the list.

	var len = this.observers.length;
	for (var i = 0; i < len; i++)
	{
		if (this.observers[i] == observer)
			return;
	}
	this.observers[len] = observer;
};

Spry.Widget.Base.Notifier.prototype.removeObserver = function(observer)
{
	if (!observer)
		return;

	for (var i = 0; i < this.observers.length; i++)
	{
		if (this.observers[i] == observer)
		{
			this.observers.splice(i, 1);
			break;
		}
	}
};

Spry.Widget.Base.Notifier.prototype.notifyObservers = function(methodName, data)
{
	if (!methodName)
		return;

	if (!this.suppressNotifications)
	{
		var len = this.observers.length;
		for (var i = 0; i < len; i++)
		{
			var obs = this.observers[i];
			if (obs)
			{
				if (typeof obs == "function")
					obs(methodName, this, data);
				else if (obs[methodName])
					obs[methodName](this, data);
			}
		}
	}
};

Spry.Widget.Base.Notifier.prototype.enableNotifications = function()
{
	if (--this.suppressNotifications < 0)
	{
		this.suppressNotifications = 0;
		Spry.Debug.reportError("Unbalanced enableNotifications() call!\n");
	}
};

Spry.Widget.Base.Notifier.prototype.disableNotifications = function()
{
	++this.suppressNotifications;
};

Spry.Widget.Base.prototype = new Spry.Widget.Base.Notifier();
Spry.Widget.Base.prototype.constructor = Spry.Widget.Base;

Spry.Widget.Base.getElement = function(ele)
{
	return Spry.$(ele);
};

Spry.Widget.Base.getElements = function(elements)
{
	var eType = typeof elements;
	if (eType == "string")
		return Spry.$$(elements);
	else if (eType == "object")
	{
		if (elements.constructor == Array)
		{
			var result = [];
			for (var i = 0; i < elements.length; i++)
				result = result.concat(Spry.Widget.Base.getElements(elements[i]));
			return result;
		}
		else
			return [elements];
	}

	return [];
};

Spry.Widget.Base.getElementsByClassName = function(root, className)
{
	var results = [];

	if (typeof root.getElementsByClassName != "undefined")
	{
		// Browser has a native getElementsByClassName(), so use it.

		var nodeList = root.getElementsByClassName(className);
		for (var i = 0; i < nodeList.length; i++)
			results.push(nodeList.item(i));
	}
	else
	{
		// Browser has no native getElementsByClassName() implementation
		// so do a manual search.

		var re = new RegExp("\\b" + className + "\\b");
		var nodeList = root.getElementsByTagName("*");
		for (var i = 0; i < nodeList.length; i++)
		{
			var ele = nodeList.item(i);
			if (ele.className.search(re) != -1)
				results.push(ele);
		}
	}

	return results;
};

Spry.Widget.Base.prototype.getElementChildren = function(element)
{
	var children = [];
	if (element)
	{
		var child = element.firstChild;
		while (child)
		{
			if (child.nodeType == 1 /* Node.ELEMENT_NODE */)
				children.push(child);
			child = child.nextSibling;
		}
	}
	return children;
};

Spry.Widget.Base.prototype.groupContentByDelimeter = function(delimeterElements)
{
	var results = new Array();

	var numDelims = delimeterElements.length;
	for (var i = 0; i < numDelims; i++)
	{
		var delim = delimeterElements[i];
		var group = new Array();
		group.push(delim);

		var nextDelim = delimeterElements[i+1];
		var sib = delim.nextSibling;
		while (sib && sib != nextDelim)
		{
			group.push(sib);
			sib = sib.nextSibling;
		}
		
		results.push(group);
	}

	return results;
};

Spry.Widget.Base.prototype.createElement = function(elementName, className, parent, child)
{
	var ele = document.createElement(elementName);
	if (className) ele.className = className;
	if (parent) parent.appendChild(ele);
	if (child) ele.appendChild(child);
	return ele;
};

Spry.Widget.Base.prototype.sliceLeftClassStr =   "Left";
Spry.Widget.Base.prototype.sliceRightClassStr =  "Right";
Spry.Widget.Base.prototype.sliceCenterClassStr = "Center";
Spry.Widget.Base.prototype.sliceTopClassStr =    "Top";
Spry.Widget.Base.prototype.sliceBottomClassStr = "Bottom";

Spry.Widget.Base.prototype.sliceFuncs = {};

Spry.Widget.Base.prototype.sliceFuncs["2slice"] = function(root, eleName, baseClassName)
{
	var a = root ? root : document.createElement(eleName);
	var b = document.createElement(eleName);

	this.appendChildNodes(b, this.extractChildNodes(a)); // Transfer any children into the new content container.

	a.appendChild(b);

	this.addClassName(a, baseClassName + this.sliceLeftClassStr);
	b.className = baseClassName + this.sliceRightClassStr;

	a.contentContainer = b;

	return a;
};

Spry.Widget.Base.prototype.sliceFuncs["3slice"] = function(root, eleName, baseClassName)
{
	var a = root ? root : document.createElement(eleName);
	var b = document.createElement(eleName);
	var c = document.createElement(eleName);

	this.appendChildNodes(c, this.extractChildNodes(a)); // Transfer any children into the new content container.

	a.appendChild(b);
	b.appendChild(c);

	this.addClassName(a, baseClassName + this.sliceLeftClassStr);
	b.className = baseClassName + this.sliceRightClassStr;
	c.className = baseClassName + this.sliceCenterClassStr;

	a.contentContainer = c;

	return a;
};

Spry.Widget.Base.prototype.sliceFuncs["3sliceStacked"] = function(root, eleName, baseClassName)
{
	root = root ? root : document.createElement(eleName);

	var l = document.createElement(eleName);
	var m = document.createElement(eleName);
	var r = document.createElement(eleName);

	this.appendChildNodes(m, this.extractChildNodes(root)); // Transfer any children into the new content container.

	root.appendChild(l);
	root.appendChild(m);
	root.appendChild(r);

	this.addClassName(root, baseClassName);
	l.className = baseClassName + this.sliceLeftClassStr;
	m.className = baseClassName + this.sliceCenterClassStr;
	r.className = baseClassName + this.sliceRightClassStr;

	root.contentContainer = m;

	return root;
};

Spry.Widget.Base.prototype.sliceFuncs["9slice"] = function(root, eleName, baseClassName)
{
	if (!root)
		root = document.createElement(eleName);
	this.addClassName(root, baseClassName);

	var t = this.create3SliceStructure(null, eleName, baseClassName + this.sliceTopClassStr);
	var m = this.create3SliceStructure(null, eleName, baseClassName);
	var b = this.create3SliceStructure(null, eleName, baseClassName + this.sliceBottomClassStr);

	this.appendChildNodes(m.contentContainer, this.extractChildNodes(root)); // Transfer any children into the new content container.

	root.appendChild(t);
	root.appendChild(m);
	root.appendChild(b);

	var contentContainer = m.contentContainer;
	root.contentContainer = contentContainer;
	contentContainer.rootContainer = root;

	return root;
};

// XXX: REMOVE THESE AFTER WIDGETS HAVE BEEN CLEANED UP!
Spry.Widget.Base.prototype.create3SliceStructure = Spry.Widget.Base.prototype.sliceFuncs["3slice"];
Spry.Widget.Base.prototype.create9SliceStructure = Spry.Widget.Base.prototype.sliceFuncs["9slice"];
// XXX

Spry.Widget.Base.prototype.createOptionalSlicedStructure = function(root, eleName, className, sliceMap, childEleName)
{
	// root         - null or the dom element that will serve as the root of the sliced structure.
	//                If null, this function will create the root container using the element name specified.
	// eleName      - The tag to use when creating the sliced structure.
	// className    - The class names placed on each element within the sliced structure will be derived from this name.
	//				  If a space delimited list is passed in, all of the names are assigned to the root element, but children 
	//				  derive their classnames from just the first class in the list.
	// sliceMap     - null or a dictionary of class name keys whose values are either "9slice", "3slice", or "none".
	//                If null, the widget's sliceMap property is used.
	// childEleName - If specified, the eleName arg will only be used for the first element created within the structure. All
	//                other elements will be created with the specified childEleName.

	if (!sliceMap)
		sliceMap = this.sliceMap ? this.sliceMap : {};

	if (!childEleName)
		childEleName = eleName;

	var sliceType = sliceMap[className];
	sliceType = sliceType ? sliceType : "none";

	if (!root)
		root = document.createElement(eleName);
	this.addClassName(root, className);

	var baseClass = (className || "").split(/\s+/)[0];
	var sliceFunc = this.sliceFuncs[sliceType];
	if (sliceFunc)
		root = sliceFunc.call(this, root, childEleName, baseClass);
	else
		root.contentContainer = root;

	return root;
};

Spry.Widget.Base.prototype.extractChildNodes = function(ele)
{
	var children = [];
	while (ele.firstChild)
	{
		var c = ele.firstChild;
		children.push(c);
		ele.removeChild(c);
	}
	return children;
};

Spry.Widget.Base.prototype.appendChildNodes = function(ele, nodes)
{
	for (var i = 0; i < nodes.length; i++)
		ele.appendChild(nodes[i]);
};

Spry.Widget.Base.prototype.setOptions = Spry.Widget.setOptions;
Spry.Widget.Base.prototype.getOnLoadDidFire = function() { return Spry.Widget.onLoadDidFire; };
Spry.Widget.Base.prototype.addCallbackToOnLoadQueue = Spry.Widget.addCallbackToOnLoadQueue;
Spry.Widget.Base.prototype.triggerCallbackAfterOnLoad = Spry.Widget.triggerCallbackAfterOnLoad;

Spry.Widget.Base.prototype.getElement = Spry.Widget.Base.getElement;
Spry.Widget.Base.prototype.getElements = Spry.Widget.Base.getElements;
Spry.Widget.Base.prototype.addClassName = Spry.Utils.addClassName;
Spry.Widget.Base.prototype.hasClassName = Spry.Utils.hasClassName;
Spry.Widget.Base.prototype.removeClassName = Spry.Utils.removeClassName;
Spry.Widget.Base.prototype.addEventListener = Spry.Utils.addEventListener;
Spry.Widget.Base.prototype.removeEventListener = Spry.Utils.removeEventListener;

Spry.Widget.Base.prototype.indexOf = function(a, v)
{
	// IE6 doesn't support indexOf on Arrays so we need to check
	// for built-in support first. If not found manually do the
	// search.
	if (a)
	{
		if (a.indexOf)
			return a.indexOf(v);
		for (var i = 0; i < a.length; i++)
			if (a[i] == v)
				return i;
	}
	return -1;
};

Spry.Widget.Base.prototype.initializePlugIns = function(defaultPlugIns, widgetOpts)
{
	var evt = new Spry.Widget.Event(this);
	this.notifyObservers("onPreInitializePlugIns", evt);
	if (!evt.performDefaultAction)
		return;

	// Both defaultPlugIns and widgetOpts are optional so make sure
	// we have always have something to work with.

	var opts = widgetOpts ? widgetOpts : {};
	var useDefaults = (typeof opts.useDefaultPlugIns == "undefined") ? true : opts.useDefaultPlugIns;

	var dp = (useDefaults && defaultPlugIns) ? defaultPlugIns : [];
	var np = opts.plugIns ? opts.plugIns : [];

	// Build a list of unique plugins from the default and user-specified sets.

	var plugIns = [];
	var plist = dp.concat(np);
	for (var i = 0; i < plist.length; i++)
	{
		var p = plist[i];
		if (this.indexOf(plugIns, p) < 0)
			plugIns.push(p);
	}

	// Sort the resulting set of plugins based on priority.

	plugIns = plugIns.sort(function(a, b)
	{
		var ap = (typeof a.priority == "undefined") ? 50 : a.priority;
		var bp = (typeof b.priority == "undefined") ? 50 : b.priority;
		return ap - bp;
	});

	// Store the sorted list of plugins on the widget.

	this.plugIns = plugIns;

	// Instantiate each plugin.

	for (var i = 0; plugIns && i < plugIns.length; i++)
	{
		if (plugIns[i].initialize)
			plugIns[i].initialize(this);
	}

	this.notifyObservers("onPostInitializePlugIns", evt);
};

Spry.Widget.Base.prototype.getClientPosition = function(ele)
{
	var pos = new Object;
	pos.x = ele.offsetLeft;
	pos.y = ele.offsetTop;
	var parent = ele.offsetParent;
	while (parent)
	{
		pos.x += parent.offsetLeft;
		pos.y += parent.offsetTop;
		parent = parent.offsetParent;
	}
	return pos;
};

Spry.Widget.Base.prototype.getStyleProp = function(element, prop)
{
	var value;
	var camelized = Spry.Utils.camelizeString(prop);
	try
	{
		if (element.style)
			value = element.style[camelized];

		if (!value)
		{
			if (document.defaultView && document.defaultView.getComputedStyle)
			{
				var css = document.defaultView.getComputedStyle(element, null);
				value = css ? css.getPropertyValue(prop) : null;
			}
			else if (element.currentStyle) 
			{
					value = element.currentStyle[camelized];
			}
		}
	}
	catch (e) {}

	return value == 'auto' ? null : value;
};

Spry.Widget.Base.prototype.makePositioned = function(element)
{
	var pos = this.getStyleProp(element, 'position');
	if (!pos || pos == 'static')
	{
		element.style.position = 'relative';

		// Opera returns the offset relative to the positioning context, when an
		// element is position relative but top and left have not been defined
		if (window.opera)
		{
			element.style.top = 0;
			element.style.left = 0;
		}
	}
};

Spry.Widget.Base.prototype.clearIEAlphaFilter = function(ele)
{
	var filter = ele.style.filter;

	// IE uses an alpha() filter for opacity. The filter style
	// property can contain multiple commands, so the idea here
	// is to just strip out the alpha(filter) and append a new
	// one, leaving any other filters untouched.

	if (filter)
	{
		filter = filter.replace(/alpha\([^\)]*\)/, "");
		filter = filter.replace(/^\s+|\s+$/, "");
		ele.style.filter = filter;
	}
	else
		filter = "";

	return filter;
};

Spry.Widget.Base.prototype.setOpacity = function(ele, opacity)
{
	ele.style.opacity = "" + opacity;

	var filter = this.clearIEAlphaFilter(ele);
	if (filter)
		filter += " ";

	ele.style.filter = filter + "alpha(opacity=" + (opacity*100) + ")";
};

Spry.Widget.Event = function(widget, opts)
{
	this.widget = widget;
	Spry.Widget.setOptions(this, opts);
	this.performDefaultAction = true;
};

Spry.Widget.Event.prototype.preventDefault = function() { this.performDefaultAction = false; };

////////////////////////////////////////////////////////

Spry.Widget.Button = function(ele, opts)
{
	Spry.Widget.Base.call(this);

	this.element = Spry.$$(ele)[0];

	// Initialize the button object with the global defaults.

	this.setOptions(this, Spry.Widget.Button.config);
	
	// Override the defaults with any options passed into the constructor.

	this.setOptions(this, opts);

	var self = this;

	this.addEventListener(this.element, "mousedown", function(e) { return self.handleMouseDown(e); }, false);
	this.addEventListener(this.element, "mouseover", function(e) { return self.handleMouseOver(e); }, false);
	this.addEventListener(this.element, "mouseout", function(e) { return self.handleMouseOut(e); }, false);

	// XXX: IE doesn't allow the setting of tabindex dynamically. This means we can't
	// rely on adding the tabindex attribute if it is missing to enable keyboard navigation
	// by default.

	// Find the first element within the tab container that has a tabindex or the first
	// anchor tag.
	this.focusElement = this.getFocusElement(this.element);
	if (this.focusElement)
	{
		this.addEventListener(this.focusElement, "focus", function(e) { return self.handleFocus(e); }, false);
		this.addEventListener(this.focusElement, "blur", function(e) { return self.handleBlur(e); }, false);
		this.addEventListener(this.focusElement, "keydown", function(e) { return self.handleKeyDown(e); }, false);
	}

	// We need to eat the onclick event so that buttons made
	// from links don't follow the link.
	
	this.addEventListener(this.element, "click", function(e) { return false; }, false);

	this.mouseUpCallback = function(evt) { return self.handleMouseUp(evt); };
};

Spry.Widget.Button.config = {
	disabled:             false,
	mouseOutCancelsClick: true,
	onclick:              null,
	downClass:            "ButtonDown",
	hoverClass:           "ButtonHover",
	disabledClass:        "ButtonDisabled",
	focusedClass:         "ButtonFocused"
};


Spry.Widget.Button.prototype = new Spry.Widget.Base();
Spry.Widget.Button.prototype.constructor = Spry.Widget.Button;

Spry.Widget.Button.prototype.handleMouseDown = function(evt)
{
	if (this.disabled)
		return false;

	this.addClassName(this.element, this.downClass);
	this.addEventListener(document, "mouseup", this.mouseUpCallback, true);

	this.notifyObservers("onButtonDown", { event: evt });
};

Spry.Widget.Button.prototype.handleMouseUp = function(evt)
{
	if (this.disabled)
		return false;

	this.removeClassName(this.element, this.downClass);
	this.removeEventListener(document, "mouseup", this.mouseUpCallback, true);

	if (this.onclick)
		this.onclick(evt);

	this.notifyObservers("onButtonUp");
	this.notifyObservers("onButtonClick");
};

Spry.Widget.Button.prototype.handleMouseOver = function(evt)
{
	if (this.disabled)
		return false;

	this.addClassName(this.element, this.hoverClass);
	this.notifyObservers("onButtonEnter");
};

Spry.Widget.Button.prototype.handleMouseOut = function(evt)
{
	if (this.disabled)
		return false;

	var ele = this.element;
	this.removeClassName(ele, this.hoverClass);

	if (this.mouseOutCancelsClick)
	{
		this.removeClassName(ele, this.downClass);
		this.removeEventListener(document, "mouseup", this.mouseUpCallback, true);
	}
	
	this.notifyObservers("onButtonExit");
};

Spry.Widget.Button.prototype.handleFocus = function(evt)
{
	if (this.disabled)
		return false;

	this.addClassName(this.element, this.focusedClass);
	this.notifyObservers("onButtonFocused");
};

Spry.Widget.Button.prototype.handleBlur = function(evt)
{
	if (this.disabled)
		return false;

	this.removeClassName(this.element, this.focusedClass);
	this.notifyObservers("onButtonBlur");
};

Spry.Widget.Button.prototype.handleKeyDown = function(evt)
{
	if (this.disabled)
		return false;
	this.notifyObservers("onButtonKeyDown", {event: evt, element: this.element});
};

Spry.Widget.Button.prototype.getFocusElement = function(element) {
	var focusElement = null;
	var indexEle = null;
	var anchorEle = null;

	this.preorderTraversal(element, function(node) {
		if (node.nodeType == 1 /* NODE.ELEMENT_NODE */)
		{
			var tabIndexAttr = element.attributes.getNamedItem("tabindex");
			if (tabIndexAttr)
			{
				indexEle = node;
				return true;
			}
			if (!anchorEle && node.nodeName.toLowerCase() == "a")
				anchorEle = node;
		}
		return false;
	});

	if (indexEle)
		focusElement = indexEle;
	else if (anchorEle)
		focusElement = anchorEle;
	return focusElement;
};

Spry.Widget.Button.prototype.preorderTraversal = function(root, func)
{
	var stopTraversal = false;
	if (root)
	{
		stopTraversal = func(root);
		if (root.hasChildNodes())
		{
			var child = root.firstChild;
			while (!stopTraversal && child)
			{
				stopTraversal = this.preorderTraversal(child, func);
				try { child = child.nextSibling; } catch (e) { child = null; }
			}
		}
	}
	return stopTraversal;
};

Spry.Widget.Button.prototype.disable = function()
{
	this.disabled = true;
	this.removeClassName(this.element, this.downClass);
	this.removeClassName(this.element, this.hoverClass);
	this.addClassName(this.element, this.disabledClass);
	this.removeEventListener(document, "mouseup", this.mouseUpCallback, true);
};

Spry.Widget.Button.prototype.enable = function()
{
	this.disabled = false;
	this.removeClassName(this.element, this.disabledClass);
};

Spry.Widget.Button.prototype.focus = function()
{
	if (this.disabled)
		return false;

	if (this.focusElement)
		this.focusElement.focus();
};


})(); // EndSpryComponent