// SpryData.js - version 0.35 - Spry Pre-Release 1.5
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

var Spry; if (!Spry) Spry = {};

//////////////////////////////////////////////////////////////////////
//
// Spry.Utils
//
//////////////////////////////////////////////////////////////////////

if (!Spry.Utils) Spry.Utils = {};

Spry.Utils.msProgIDs = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.5.0", "MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];

Spry.Utils.createXMLHttpRequest = function()
{
	var req = null;
	try
	{
		// Try to use the ActiveX version of XMLHttpRequest. This will
		// allow developers to load file URLs in IE7 when running in the
		// local zone.

		if (window.ActiveXObject)
		{
			while (!req && Spry.Utils.msProgIDs.length)
			{
				try { req = new ActiveXObject(Spry.Utils.msProgIDs[0]); } catch (e) { req = null; }
				if (!req)
					Spry.Utils.msProgIDs.splice(0, 1);
			}
		}

		// We're either running in a non-IE browser, or we failed to
		// create the ActiveX version of the XMLHttpRequest object.
		// Try to use the native version of XMLHttpRequest if it exists.

		if (!req && window.XMLHttpRequest)
			req = new XMLHttpRequest();
	}
	catch (e) { req = null;	}

	if (!req)
		Spry.Debug.reportError("Failed to create an XMLHttpRequest object!" );

	return req;
};

Spry.Utils.loadURL = function(method, url, async, callback, opts)
{
	var req = new Spry.Utils.loadURL.Request();
	req.method = method;
	req.url = url;
	req.async = async;
	req.successCallback = callback;
	Spry.Utils.setOptions(req, opts);

	try
	{
		req.xhRequest = Spry.Utils.createXMLHttpRequest();
		if (!req.xhRequest)
			return null;

		if (req.async)
			req.xhRequest.onreadystatechange = function() { Spry.Utils.loadURL.callback(req); };

		req.xhRequest.open(req.method, req.url, req.async, req.username, req.password);

		if (req.headers)
		{
			for (var name in req.headers)
				req.xhRequest.setRequestHeader(name, req.headers[name]);
		}

		req.xhRequest.send(req.postData);

		if (!req.async)
			Spry.Utils.loadURL.callback(req);
	}
	catch(e)
	{
		if (req.errorCallback)
			req.errorCallback(req);
		else
			Spry.Debug.reportError("Exception caught while loading " + url + ": " + e);
		req = null;
	}

	return req;
};

Spry.Utils.loadURL.callback = function(req)
{
	if (!req || req.xhRequest.readyState != 4)
		return;
	if (req.successCallback && (req.xhRequest.status == 200 || req.xhRequest.status == 0))
		req.successCallback(req);
	else if (req.errorCallback)
		req.errorCallback(req);
};

Spry.Utils.loadURL.Request = function()
{
	var props = Spry.Utils.loadURL.Request.props;
	var numProps = props.length;

	for (var i = 0; i < numProps; i++)
		this[props[i]] = null;

	this.method = "GET";
	this.async = true;
	this.headers = {};
};

Spry.Utils.loadURL.Request.props = [ "method", "url", "async", "username", "password", "postData", "successCallback", "errorCallback", "headers", "userData", "xhRequest" ];

Spry.Utils.loadURL.Request.prototype.extractRequestOptions = function(opts, undefineRequestProps)
{
	if (!opts)
		return;

	var props = Spry.Utils.loadURL.Request.props;
	var numProps = props.length;

	for (var i = 0; i < numProps; i++)
	{
		var prop = props[i];
		if (opts[prop] != undefined)
		{
			this[prop] = opts[prop];
			if (undefineRequestProps)
				opts[prop] = undefined;
		}
	}
};

Spry.Utils.loadURL.Request.prototype.clone = function()
{
	var props = Spry.Utils.loadURL.Request.props;
	var numProps = props.length;
	var req = new Spry.Utils.loadURL.Request;
	for (var i = 0; i < numProps; i++)
		req[props[i]] = this[props[i]];
	if (this.headers)
	{
		req.headers = {};
		Spry.Utils.setOptions(req.headers, this.headers);
	}
	return req;
};

Spry.Utils.setInnerHTML = function(ele, str, preventScripts)
{
	if (!ele)
		return;
	ele = Spry.$(ele);
	var scriptExpr = "<script[^>]*>(.|\s|\n|\r)*?</script>";
	ele.innerHTML = str.replace(new RegExp(scriptExpr, "img"), "");

	if (preventScripts)
		return;

	var matches = str.match(new RegExp(scriptExpr, "img"));
	if (matches)
	{
		var numMatches = matches.length;
		for (var i = 0; i < numMatches; i++)
		{
			var s = matches[i].replace(/<script[^>]*>[\s\r\n]*(<\!--)?|(-->)?[\s\r\n]*<\/script>/img, "");
			Spry.Utils.eval(s);
		}
	}
};

Spry.Utils.updateContent = function (ele, url, finishFunc, opts)
{
	Spry.Utils.loadURL("GET", url, true, function(req)
	{
		Spry.Utils.setInnerHTML(ele, req.xhRequest.responseText);
		if (finishFunc)
			finishFunc(ele, url);
	}, opts);
};

Spry.Utils.addEventListener = function(element, eventType, handler, capture)
{
	try
	{
		element = Spry.$(element);
		if (element.addEventListener)
			element.addEventListener(eventType, handler, capture);
		else if (element.attachEvent)
			element.attachEvent("on" + eventType, handler);
	}
	catch (e) {}
};

Spry.Utils.removeEventListener = function(element, eventType, handler, capture)
{
	try
	{
		element = Spry.$(element);
		if (element.removeEventListener)
			element.removeEventListener(eventType, handler, capture);
		else if (element.detachEvent)
			element.detachEvent("on" + eventType, handler);
	}
	catch (e) {}
};

Spry.Utils.addLoadListener = function(handler)
{
	if (typeof window.addEventListener != 'undefined')
		window.addEventListener('load', handler, false);
	else if (typeof document.addEventListener != 'undefined')
		document.addEventListener('load', handler, false);
	else if (typeof window.attachEvent != 'undefined')
		window.attachEvent('onload', handler);
};

Spry.Utils.eval = function(str)
{
	// Call this method from your JS function when
	// you don't want the JS expression to access or
	// interfere with any local variables in your JS
	// function.

	return eval(str);
};

Spry.Utils.escapeQuotesAndLineBreaks = function(str)
{
	if (str)
	{
		str = str.replace(/\\/g, "\\\\");
		str = str.replace(/["']/g, "\\$&");
		str = str.replace(/\n/g, "\\n");
		str = str.replace(/\r/g, "\\r");
	}
	return str;
};

Spry.Utils.encodeEntities = function(str)
{
	if (str && str.search(/[&<>"]/) != -1)
	{
		str = str.replace(/&/g, "&amp;");
		str = str.replace(/</g, "&lt;");
		str = str.replace(/>/g, "&gt;");
		str = str.replace(/"/g, "&quot;");
	}
	return str
};

Spry.Utils.decodeEntities = function(str)
{
	var d = Spry.Utils.decodeEntities.div;
	if (!d)
	{
		d = document.createElement('div');
		Spry.Utils.decodeEntities.div = d;
		if (!d) return str;
	}
	d.innerHTML = str;
	if (d.childNodes.length == 1 && d.firstChild.nodeType == 3 /* Node.TEXT_NODE */ && d.firstChild.nextSibling == null)
		str = d.firstChild.data;
	else
	{
		// Hmmm, innerHTML processing of str produced content
		// we weren't expecting, so just replace entities we
		// expect folks will use in node attributes that contain
		// JavaScript.
		str = str.replace(/&lt;/gi, "<");
		str = str.replace(/&gt;/gi, ">");
		str = str.replace(/&quot;/gi, "\"");
		str = str.replace(/&amp;/gi, "&");
	}
	return str;
};

Spry.Utils.fixupIETagAttributes = function(inStr)
{
	var outStr = "";

	// Break the tag string into 3 pieces.

	var tagStart = inStr.match(/^<[^\s>]+\s*/)[0];
	var tagEnd = inStr.match(/\s*\/?>$/)[0];
	var tagAttrs = inStr.replace(/^<[^\s>]+\s*|\s*\/?>/g, "");

	// Write out the start of the tag.
	outStr += tagStart;

	// If the tag has attributes, parse it out manually to avoid accidentally fixing up
	// attributes that contain JavaScript expressions.

	if (tagAttrs)
	{
		var startIndex = 0;
		var endIndex = 0;

		while (startIndex < tagAttrs.length)
		{
			// Find the '=' char of the attribute.
			while (tagAttrs.charAt(endIndex) != '=' && endIndex < tagAttrs.length)
				++endIndex;

			// If we are at the end of the string, just write out what we've
			// collected.

			if (endIndex >= tagAttrs.length)
			{
				outStr += tagAttrs.substring(startIndex, endIndex);
				break;
			}

			// Step past the '=' character and write out what we've
			// collected so far.

			++endIndex;
			outStr += tagAttrs.substring(startIndex, endIndex);
			startIndex = endIndex;

			if (tagAttrs.charAt(endIndex) == '"' || tagAttrs.charAt(endIndex) == "'")
			{
				// Attribute is quoted. Advance us past the quoted value!
				var savedIndex = endIndex++;
				while (endIndex < tagAttrs.length)
				{
					if (tagAttrs.charAt(endIndex) == tagAttrs.charAt(savedIndex))
					{
						endIndex++;
						break;
					}
					else if (tagAttrs.charAt(endIndex) == "\\")
						endIndex++;
					endIndex++;
				}

				outStr += tagAttrs.substring(startIndex, endIndex);
				startIndex = endIndex;
			}
			else
			{
				// This attribute value wasn't quoted! Wrap it with quotes and
				// write out everything till we hit a space, or the end of the
				// string.

				outStr += "\"";

				var sIndex = tagAttrs.slice(endIndex).search(/\s/);
				endIndex = (sIndex != -1) ? (endIndex + sIndex) : tagAttrs.length;
				outStr += tagAttrs.slice(startIndex, endIndex);
				outStr += "\"";
				startIndex = endIndex;
			}
		}
	}

	outStr += tagEnd;

	// Write out the end of the tag.
	return outStr;
};

Spry.Utils.fixUpIEInnerHTML = function(inStr)
{
	var outStr = "";

	// Create a regular expression that will match:
	//     <!--
	//     <![CDATA[
	//     <tag>
	//     -->
	//     ]]>
	//     ]]&gt;   // Yet another workaround for an IE innerHTML bug.
	//
	// The idea here is that we only want to fix up attribute values on tags that
	// are not in any comments or CDATA.

	var regexp = new RegExp("<\\!--|<\\!\\[CDATA\\[|<\\w+[^<>]*>|-->|\\]\\](>|\&gt;)", "g");
	var searchStartIndex = 0;
	var skipFixUp = 0;

	while (inStr.length)
	{
		var results = regexp.exec(inStr);
		if (!results || !results[0])
		{
			outStr += inStr.substr(searchStartIndex, inStr.length - searchStartIndex);
			break;
		}

		if (results.index != searchStartIndex)
		{
			// We found a match but it's not at the start of the inStr.
			// Create a string token for everything that precedes the match.
			outStr += inStr.substr(searchStartIndex, results.index - searchStartIndex);
		}

		if (results[0] == "<!--" || results[0] == "<![CDATA[")
		{
			++skipFixUp;
			outStr += results[0];
		}
		else if (results[0] == "-->" || results[0] == "]]>" || (skipFixUp && results[0] == "]]&gt;"))
		{
			--skipFixUp;
			outStr += results[0];
		}
		else if (!skipFixUp && results[0].charAt(0) == '<')
			outStr += Spry.Utils.fixupIETagAttributes(results[0]);
		else
			outStr += results[0];

		searchStartIndex = regexp.lastIndex;
	}

	return outStr;
};

Spry.Utils.stringToXMLDoc = function(str)
{
	var xmlDoc = null;

	try
	{
		// Attempt to parse the string using the IE method.

		var xmlDOMObj = new ActiveXObject("Microsoft.XMLDOM");
		xmlDOMObj.async = false;
		xmlDOMObj.loadXML(str);
		xmlDoc = xmlDOMObj;
	}
	catch (e)
	{
		// The IE method didn't work. Try the Mozilla way.

		try
		{
			var domParser = new DOMParser;
			xmlDoc = domParser.parseFromString(str, 'text/xml');
		}
		catch (e)
		{
			Spry.Debug.reportError("Caught exception in Spry.Utils.stringToXMLDoc(): " + e + "\n");
			xmlDoc = null;
		}
	}

	return xmlDoc;
};

Spry.Utils.serializeObject = function(obj)
{
	// Create a JSON representation of a given object.

	var str = "";
	var firstItem = true;

	if (obj == null || obj == undefined)
		return str + obj;

	var objType = typeof obj;

	if (objType == "number" || objType == "boolean")
		str += obj;
	else if (objType == "string")
		str += "\"" + Spry.Utils.escapeQuotesAndLineBreaks(obj) + "\"";
	else if (obj.constructor == Array)
	{
		str += "[";
		for (var i = 0; i < obj.length; i++)
		{
			if (!firstItem)
				str += ", ";
			str += Spry.Utils.serializeObject(obj[i]);
			firstItem = false;
		}
		str += "]";
	}
	else if (objType == "object")
	{
		str += "{";
		for (var p in obj)
		{
			if (!firstItem)
				str += ", ";
			str += "\"" + p + "\": " + Spry.Utils.serializeObject(obj[p]);
			firstItem = false;
		}
		str += "}";
	}
	return str;
};

Spry.Utils.getNodesByFunc = function(root, func)
{
	var nodeStack = new Array;
	var resultArr = new Array;
	var node = root;

	while (node)
	{
		if (func(node))
			resultArr.push(node);

		if (node.hasChildNodes())
		{
			nodeStack.push(node);
			node = node.firstChild;
		}
		else
		{
			if (node == root)
				node = null;
			else
				try { node = node.nextSibling; } catch (e) { node = null; };
		}

		while (!node && nodeStack.length > 0)
		{
			node = nodeStack.pop();
			if (node == root)
				node = null;
			else
				try { node = node.nextSibling; } catch (e) { node = null; }
		}
	}

	if (nodeStack && nodeStack.length > 0)
		Spry.Debug.trace("-- WARNING: Spry.Utils.getNodesByFunc() failed to traverse all nodes!\n");

	return resultArr;
};

Spry.Utils.addClassName = function(ele, className)
{
	ele = Spry.$(ele);
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) != -1))
		return;
	ele.className += (ele.className ? " " : "") + className;
};

Spry.Utils.removeClassName = function(ele, className)
{
	ele = Spry.$(ele);
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) == -1))
		return;
	ele.className = ele.className.replace(new RegExp("\\s*\\b" + className + "\\b", "g"), "");
};

Spry.Utils.getFirstChildWithNodeName = function(node, nodeName)
{
	var child = node.firstChild;

	while (child)
	{
		if (child.nodeName == nodeName)
			return child;
		child = child.nextSibling;
	}

	return null;
};

Spry.Utils.nodeContainsElementNode = function(node)
{
	if (node)
	{
		node = node.firstChild;

		while (node)
		{
			if (node.nodeType == 1 /* Node.ELEMENT_NODE */)
				return true;

			node = node.nextSibling;
		}
	}
	return false;
};

Spry.Utils.getNodeText = function(node)
{
	var txt = "";

	if (!node)
		return;

	try
	{
		var child = node.firstChild;

		while (child)
		{
			try
			{
				if (child.nodeType == 3 /* TEXT_NODE */)
					txt += Spry.Utils.encodeEntities(child.data);
				else if (child.nodeType == 4 /* CDATA_SECTION_NODE */)
					txt += child.data;
			} catch (e) { Spry.Debug.reportError("Spry.Utils.getNodeText() exception caught: " + e + "\n"); }

			child = child.nextSibling;
		}
	}
	catch (e) { Spry.Debug.reportError("Spry.Utils.getNodeText() exception caught: " + e + "\n"); }

	return txt;
};

Spry.Utils.CreateObjectForNode = function(node)
{
	if (!node)
		return null;

	var obj = new Object();
	var i = 0;
	var attr = null;

	try
	{
		for (i = 0; i < node.attributes.length; i++)
		{
			attr = node.attributes[i];
			if (attr && attr.nodeType == 2 /* Node.ATTRIBUTE_NODE */)
				obj["@" + attr.name] = attr.value;
		}
	}
	catch (e)
	{
		Spry.Debug.reportError("Spry.Utils.CreateObjectForNode() caught exception while accessing attributes: " + e + "\n");
	}

	var child = node.firstChild;

	if (child && !child.nextSibling && child.nodeType != 1 /* Node.ELEMENT_NODE */)
	{
		// We have a single child and it's not an element. It must
		// be the text value for this node. Add it to the record set and
		// give it the column the same name as the node.

		obj[node.nodeName] = Spry.Utils.getNodeText(node);
	}

	while (child)
	{
		// Add the text value for each child element. Note that
		// We skip elements that have element children (sub-elements)
		// because we don't handle multi-level data sets right now.

		if (child.nodeType == 1 /* Node.ELEMENT_NODE */)
		{
			if (!Spry.Utils.nodeContainsElementNode(child))
			{
				obj[child.nodeName] = Spry.Utils.getNodeText(child);

				// Now add properties for any attributes on the child. The property
				// name will be of the form "<child.nodeName>/@<attr.name>".
				try
				{
					var namePrefix = child.nodeName + "/@";

					for (i = 0; i < child.attributes.length; i++)
					{
						attr = child.attributes[i];
						if (attr && attr.nodeType == 2 /* Node.ATTRIBUTE_NODE */)
							obj[namePrefix + attr.name] = attr.value;
					}
				}
				catch (e)
				{
					Spry.Debug.reportError("Spry.Utils.CreateObjectForNode() caught exception while accessing attributes: " + e + "\n");
				}
			}
		}

		child = child.nextSibling;
	}

	return obj;
};

Spry.Utils.getRecordSetFromXMLDoc = function(xmlDoc, path, suppressColumns)
{
	if (!xmlDoc || !path)
		return null;

	var recordSet = new Object();
	recordSet.xmlDoc = xmlDoc;
	recordSet.xmlPath = path;
	recordSet.dataHash = new Object;
	recordSet.data = new Array;
	recordSet.getData = function() { return this.data; };

	// Use the XPath library to find the nodes that will
	// make up our data set. The result should be an array
	// of subtrees that we need to flatten.

	var ctx = new ExprContext(xmlDoc);
	var pathExpr = xpathParse(path);
	var e = pathExpr.evaluate(ctx);

	// XXX: Note that we should check the result type of the evaluation
	// just in case it's a boolean, string, or number value instead of
	// a node set.

	var nodeArray = e.nodeSetValue();

	var isDOMNodeArray = true;

	if (nodeArray && nodeArray.length > 0)
		isDOMNodeArray = nodeArray[0].nodeType != 2 /* Node.ATTRIBUTE_NODE */;

	var nextID = 0;

	// We now have the set of nodes that make up our data set
	// so process each one.

	for (var i = 0; i < nodeArray.length; i++)
	{
		var rowObj = null;

		if (suppressColumns)
			rowObj = new Object;
		else
		{
			if (isDOMNodeArray)
				rowObj = Spry.Utils.CreateObjectForNode(nodeArray[i]);
			else // Must be a Node.ATTRIBUTE_NODE array.
			{
				rowObj = new Object;
				rowObj["@" + nodeArray[i].name] = nodeArray[i].value;
			}
		}

		if (rowObj)
		{
			// We want to make sure that every row has a unique ID and since we
			// we don't know which column, if any, in this recordSet is a unique
			// identifier, we generate a unique ID ourselves and store it under
			// the ds_RowID column in the row object.

			rowObj['ds_RowID'] = nextID++;
			rowObj['ds_XMLNode'] = nodeArray[i];
			recordSet.dataHash[rowObj['ds_RowID']] = rowObj;
			recordSet.data.push(rowObj);
		}
	}

	return recordSet;
};

Spry.Utils.setOptions = function(obj, optionsObj, ignoreUndefinedProps)
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

Spry.Utils.SelectionManager = {};
Spry.Utils.SelectionManager.selectionGroups = new Object;

Spry.Utils.SelectionManager.SelectionGroup = function()
{
	this.selectedElements = new Array;
};

Spry.Utils.SelectionManager.SelectionGroup.prototype.select = function(element, className, multiSelect)
{
	var selObj = null;

	if (!multiSelect)
	{
		// Multiple selection is not enabled, so clear any
		// selected elements from our list.

		this.clearSelection();
	}
	else
	{
		// Multiple selection is enabled, so check to see if element
		// is already in the array. If it is, make sure the className
		// is the className that was passed in.

		for (var i = 0; i < this.selectedElements.length; i++)
		{
			selObj = this.selectedElements[i].element;

			if (selObj.element == element)
			{
				if (selObj.className != className)
				{
					Spry.Utils.removeClassName(element, selObj.className);
					Spry.Utils.addClassName(element, className);
				}
				return;
			}
		}
	}

	// Add the element to our list of selected elements.

	selObj = new Object;
	selObj.element = element;
	selObj.className = className;
	this.selectedElements.push(selObj);
	Spry.Utils.addClassName(element, className);
};

Spry.Utils.SelectionManager.SelectionGroup.prototype.unSelect = function(element)
{
	for (var i = 0; i < this.selectedElements.length; i++)
	{
		var selObj = this.selectedElements[i].element;

		if (selObj.element == element)
		{
			Spry.Utils.removeClassName(selObj.element, selObj.className);
			return;
		}
	}
};

Spry.Utils.SelectionManager.SelectionGroup.prototype.clearSelection = function()
{
	var selObj = null;

	do
	{
		selObj = this.selectedElements.shift();
		if (selObj)
			Spry.Utils.removeClassName(selObj.element, selObj.className);
	}
	while (selObj);
};

Spry.Utils.SelectionManager.getSelectionGroup = function(selectionGroupName)
{
	if (!selectionGroupName)
		return null;

	var groupObj = Spry.Utils.SelectionManager.selectionGroups[selectionGroupName];

	if (!groupObj)
	{
		groupObj = new Spry.Utils.SelectionManager.SelectionGroup();
		Spry.Utils.SelectionManager.selectionGroups[selectionGroupName] = groupObj;
	}

	return groupObj;
};

Spry.Utils.SelectionManager.select = function(selectionGroupName, element, className, multiSelect)
{
	var groupObj = Spry.Utils.SelectionManager.getSelectionGroup(selectionGroupName);

	if (!groupObj)
		return;

	groupObj.select(element, className, multiSelect);
};

Spry.Utils.SelectionManager.unSelect = function(selectionGroupName, element)
{
	var groupObj = Spry.Utils.SelectionManager.getSelectionGroup(selectionGroupName);

	if (!groupObj)
		return;

	groupObj.unSelect(element, className);
};

Spry.Utils.SelectionManager.clearSelection = function(selectionGroupName)
{
	var groupObj = Spry.Utils.SelectionManager.getSelectionGroup(selectionGroupName);

	if (!groupObj)
		return;

	groupObj.clearSelection();
};

//////////////////////////////////////////////////////////////////////
//
// Define Prototype's $() convenience function, but make sure it is
// namespaced under Spry so that we avoid collisions with other
// toolkits.
//
//////////////////////////////////////////////////////////////////////

Spry.$ = function(element)
{
	if (arguments.length > 1)
	{
		for (var i = 0, elements = [], length = arguments.length; i < length; i++)
			elements.push(Spry.$(arguments[i]));
		return elements;
	}
	if (typeof element == 'string')
		element = document.getElementById(element);
	return element;
};

Spry.Utils.Notifier = function()
{
	this.observers = [];
	this.suppressNotifications = 0;
};

Spry.Utils.Notifier.prototype.addObserver = function(observer)
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

Spry.Utils.Notifier.prototype.removeObserver = function(observer)
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

Spry.Utils.Notifier.prototype.notifyObservers = function(methodName, data)
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

Spry.Utils.Notifier.prototype.enableNotifications = function()
{
	if (--this.suppressNotifications < 0)
	{
		this.suppressNotifications = 0;
		Spry.Debug.reportError("Unbalanced enableNotifications() call!\n");
	}
};

Spry.Utils.Notifier.prototype.disableNotifications = function()
{
	++this.suppressNotifications;
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Debug
//
//////////////////////////////////////////////////////////////////////

Spry.Debug = {};
Spry.Debug.enableTrace = true;
Spry.Debug.debugWindow = null;
Spry.Debug.onloadDidFire = false;

Spry.Utils.addLoadListener(function() { Spry.Debug.onloadDidFire = true; Spry.Debug.flushQueuedMessages(); });

Spry.Debug.flushQueuedMessages = function()
{
	if (Spry.Debug.flushQueuedMessages.msgs)
	{
		var msgs = Spry.Debug.flushQueuedMessages.msgs;
		for (var i = 0; i < msgs.length; i++)
			Spry.Debug.debugOut(msgs[i].msg, msgs[i].color);
		Spry.Debug.flushQueuedMessages.msgs = null;
	}
};

Spry.Debug.createDebugWindow = function()
{
	if (!Spry.Debug.enableTrace || Spry.Debug.debugWindow || !Spry.Debug.onloadDidFire)
		return;
	try
	{
		Spry.Debug.debugWindow = document.createElement("div");
		var div = Spry.Debug.debugWindow;
		div.style.fontSize = "12px";
		div.style.fontFamily = "console";
		div.style.position = "absolute";
		div.style.width = "400px";
		div.style.height = "300px";
		div.style.overflow = "auto";
		div.style.border = "solid 1px black";
		div.style.backgroundColor = "white";
		div.style.color = "black";
		div.style.bottom = "0px";
		div.style.right = "0px";
		// div.style.opacity = "0.5";
		// div.style.filter = "alpha(opacity=50)";
		div.setAttribute("id", "SpryDebugWindow");
		document.body.appendChild(Spry.Debug.debugWindow);
	}
	catch (e) {}
};

Spry.Debug.debugOut = function(str, bgColor)
{
	if (!Spry.Debug.debugWindow)
	{
		Spry.Debug.createDebugWindow();
		if (!Spry.Debug.debugWindow)
		{
			if (!Spry.Debug.flushQueuedMessages.msgs)
				Spry.Debug.flushQueuedMessages.msgs = new Array;
			Spry.Debug.flushQueuedMessages.msgs.push({msg: str, color: bgColor});
			return;
		}
	}

	var d = document.createElement("div");
	if (bgColor)
		d.style.backgroundColor = bgColor;
	d.innerHTML = str;
	Spry.Debug.debugWindow.appendChild(d);
};

Spry.Debug.trace = function(str)
{
	Spry.Debug.debugOut(str);
};

Spry.Debug.reportError = function(str)
{
	Spry.Debug.debugOut(str, "red");
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Data
//
//////////////////////////////////////////////////////////////////////

Spry.Data = {};
Spry.Data.regionsArray = {};

Spry.Data.initRegions = function(rootNode)
{
	if (!rootNode)
		rootNode = document.body;

	var lastRegionFound = null;

	var regions = Spry.Utils.getNodesByFunc(rootNode, function(node)
	{
		try
		{
			if (node.nodeType != 1 /* Node.ELEMENT_NODE */)
				return false;

			// Region elements must have an spryregion attribute with a
			// non-empty value. An id attribute is also required so we can
			// reference the region by name if necessary.

			var attrName = "spry:region";
			var attr = node.attributes.getNamedItem(attrName);
			if (!attr)
			{
				attrName = "spry:detailregion";
				attr = node.attributes.getNamedItem(attrName);
			}
			if (attr)
			{
				if (lastRegionFound)
				{
					var parent = node.parentNode;
					while (parent)
					{
						if (parent == lastRegionFound)
						{
							Spry.Debug.reportError("Found a nested " + attrName + " in the following markup. Nested regions are currently not supported.<br/><pre>" + Spry.Utils.encodeEntities(parent.innerHTML) + "</pre>");
							return false;
						}
						parent = parent.parentNode;
					}
				}

				if (attr.value)
				{
					attr = node.attributes.getNamedItem("id");
					if (!attr || !attr.value)
					{
						// The node is missing an id attribute so add one.
						node.setAttribute("id", "spryregion" + (++Spry.Data.initRegions.nextUniqueRegionID));
					}

					lastRegionFound = node;
					return true;
				}
				else
					Spry.Debug.reportError(attrName + " attributes require one or more data set names as values!");
			}
		}
		catch(e) {}
		return false;
	});

	var name, dataSets, i;

	for (i = 0; i < regions.length; i++)
	{
		var rgn = regions[i];

		var isDetailRegion = false;

		// Get the region name.
		name = rgn.attributes.getNamedItem("id").value;

		attr = rgn.attributes.getNamedItem("spry:region");
		if (!attr)
		{
			attr = rgn.attributes.getNamedItem("spry:detailregion");
			isDetailRegion = true;
		}

		if (!attr.value)
		{
			Spry.Debug.reportError("spry:region and spry:detailregion attributes require one or more data set names as values!");
			continue;
		}

		// Remove the spry:region or spry:detailregion attribute so it doesn't appear in
		// the output generated by our processing of the dynamic region.
		rgn.attributes.removeNamedItem(attr.nodeName);

		// Remove the hiddenRegionCSS class from the rgn.
		Spry.Utils.removeClassName(rgn, Spry.Data.Region.hiddenRegionClassName);

		// Get the DataSets that should be bound to the region.
		dataSets = Spry.Data.Region.strToDataSetsArray(attr.value);

		if (!dataSets.length)
		{
			Spry.Debug.reportError("spry:region or spry:detailregion attribute has no data set!");
			continue;
		}

		var hasBehaviorAttributes = false;
		var hasSpryContent = false;
		var dataStr = "";

		var parent = null;
		var regionStates = {};
		var regionStateMap = {};

		// Check if there are any attributes on the region node that remap
		// the default states.

		attr = rgn.attributes.getNamedItem("spry:readystate");
		if (attr && attr.value)
			regionStateMap["ready"] = attr.value;
		attr = rgn.attributes.getNamedItem("spry:errorstate");
		if (attr && attr.value)
			regionStateMap["error"] = attr.value;
		attr = rgn.attributes.getNamedItem("spry:loadingstate");
		if (attr && attr.value)
			regionStateMap["loading"] = attr.value;
		attr = rgn.attributes.getNamedItem("spry:expiredstate");
		if (attr && attr.value)
			regionStateMap["expired"] = attr.value;

		// Find all of the processing instruction regions in the region.
		// Insert comments around the regions we find so we can identify them
		// easily when tokenizing the region html string.

		var piRegions = Spry.Utils.getNodesByFunc(rgn, function(node)
		{
			try
			{
				if (node.nodeType == 1 /* ELEMENT_NODE */)
				{
					var attributes = node.attributes;
					var numPI = Spry.Data.Region.PI.orderedInstructions.length;
					var lastStartComment = null;
					var lastEndComment = null;

					for (var i = 0; i < numPI; i++)
					{
						var piName = Spry.Data.Region.PI.orderedInstructions[i];
						var attr = attributes.getNamedItem(piName);
						if (!attr)
							continue;

						var piDesc = Spry.Data.Region.PI.instructions[piName];
						var childrenOnly = (node == rgn) ? true : piDesc.childrenOnly;
						var openTag = piDesc.getOpenTag(node, piName);
						var closeTag = piDesc.getCloseTag(node, piName);

						if (childrenOnly)
						{
								var oComment = document.createComment(openTag);
								var cComment = document.createComment(closeTag)

								if (!lastStartComment)
									node.insertBefore(oComment, node.firstChild);
								else
									node.insertBefore(oComment, lastStartComment.nextSibling);
								lastStartComment = oComment;

								if (!lastEndComment)
									node.appendChild(cComment);
								else
									node.insertBefore(cComment, lastEndComment);
								lastEndComment = cComment;
						}
						else
						{
							var parent = node.parentNode;
							parent.insertBefore(document.createComment(openTag), node);
							parent.insertBefore(document.createComment(closeTag), node.nextSibling);
						}

						// If this is a spry:state processing instruction, record the state name
						// so we know that we should re-generate the region if we ever see that state.

						if (piName == "spry:state")
							regionStates[attr.value] = true;

						node.removeAttribute(piName);
					}

					if (Spry.Data.Region.enableBehaviorAttributes)
					{
						var bAttrs = Spry.Data.Region.behaviorAttrs;
						for (var behaviorAttrName in bAttrs)
						{
							var bAttr = attributes.getNamedItem(behaviorAttrName);
							if (bAttr)
							{
								hasBehaviorAttributes = true;
								if (bAttrs[behaviorAttrName].setup)
									bAttrs[behaviorAttrName].setup(node, bAttr.value);
							}
						}
					}
				}
			}
			catch(e) {}
			return false;
		});

		// Get the data in the region.
		dataStr = rgn.innerHTML;

		// Argh! IE has an innerHTML bug where it will remove the quotes around any
		// attribute value that it thinks is a single word. This includes removing quotes
		// around our data references which is problematic since a single data reference
		// can be replaced with multiple words. If we are running in IE, we have to call
		// fixUpIEInnerHTML to get around this problem.

		if (window.ActiveXObject && !Spry.Data.Region.disableIEInnerHTMLFixUp && dataStr.search(/=\{/) != -1)
		{
			if (Spry.Data.Region.debug)
				Spry.Debug.trace("<hr />Performing IE innerHTML fix up of Region: " + name + "<br /><br />" + Spry.Utils.encodeEntities(dataStr));

			dataStr = Spry.Utils.fixUpIEInnerHTML(dataStr);
		}

		if (Spry.Data.Region.debug)
			Spry.Debug.trace("<hr />Region template markup for '" + name + "':<br /><br />" + Spry.Utils.encodeEntities(dataStr));

		if (!hasSpryContent)
		{
			// Clear the region.
			rgn.innerHTML = "";
		}

		// Create a Spry.Data.Region object for this region.
		var region = new Spry.Data.Region(rgn, name, isDetailRegion, dataStr, dataSets, regionStates, regionStateMap, hasBehaviorAttributes);
		Spry.Data.regionsArray[region.name] = region;
	}

	Spry.Data.updateAllRegions();
};

Spry.Data.initRegions.nextUniqueRegionID = 0;

Spry.Data.updateRegion = function(regionName)
{
	if (!regionName || !Spry.Data.regionsArray || !Spry.Data.regionsArray[regionName])
		return;

	try { Spry.Data.regionsArray[regionName].updateContent(); }
	catch(e) { Spry.Debug.reportError("Spry.Data.updateRegion(" + regionName + ") caught an exception: " + e + "\n"); }
};

Spry.Data.getRegion = function(regionName)
{
	return Spry.Data.regionsArray[regionName];
};


Spry.Data.updateAllRegions = function()
{
	if (!Spry.Data.regionsArray)
		return;

	for (var regionName in Spry.Data.regionsArray)
		Spry.Data.updateRegion(regionName);
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Data.DataSet
//
//////////////////////////////////////////////////////////////////////

Spry.Data.DataSet = function(options)
{
	Spry.Utils.Notifier.call(this);

	this.name = "";
	this.internalID = Spry.Data.DataSet.nextDataSetID++;
	this.curRowID = 0;
	this.data = [];
	this.unfilteredData = null;
	this.dataHash = {};
	this.columnTypes = {};
	this.filterFunc = null;		// non-destructive filter function
	this.filterDataFunc = null;	// destructive filter function

	this.distinctOnLoad = false;
	this.distinctFieldsOnLoad = null;
	this.sortOnLoad = null;
	this.sortOrderOnLoad = "ascending";
	this.keepSorted = false;

	this.dataWasLoaded = false;
	this.pendingRequest = null;

	this.lastSortColumns = [];
	this.lastSortOrder = "";

	this.loadIntervalID = 0;

	Spry.Utils.setOptions(this, options);
};

Spry.Data.DataSet.prototype = new Spry.Utils.Notifier();
Spry.Data.DataSet.prototype.constructor = Spry.Data.DataSet;

Spry.Data.DataSet.prototype.getData = function(unfiltered)
{
	return (unfiltered && this.unfilteredData) ? this.unfilteredData : this.data;
};

Spry.Data.DataSet.prototype.getUnfilteredData = function()
{
	// XXX: Deprecated.
	return this.getData(true);
};

Spry.Data.DataSet.prototype.getLoadDataRequestIsPending = function()
{
	return this.pendingRequest != null;
};

Spry.Data.DataSet.prototype.getDataWasLoaded = function()
{
	return this.dataWasLoaded;
};

Spry.Data.DataSet.prototype.setDataFromArray = function(arr, fireSyncLoad)
{
	this.notifyObservers("onPreLoad");

	this.unfilteredData = null;
	this.filteredData = null;
	this.data = [];
	this.dataHash = {};

	var arrLen = arr.length;

	for (var i = 0; i < arrLen; i++)
	{
		var row = arr[i];
		if (row.ds_RowID == undefined)
			row.ds_RowID = i;
		this.dataHash[row.ds_RowID] = row;
		this.data.push(row);
	}

	this.loadData(fireSyncLoad);
};

Spry.Data.DataSet.prototype.loadData = function(syncLoad)
{
	// The idea here is that folks using the base class DataSet directly
	// would change the data in the DataSet manually and then call loadData()
	// to fire off an async notifications to say that it was ready for consumption.
	//
	// Firing off data changed notificataions synchronously from this method
	// can wreak havoc with complicated master/detail regions that use data sets
	// that have master/detail relationships with other data sets. Our data set
	// logic already handles async data loading nicely so we use a timer to fire
	// off the data changed notification to insure that it happens after this
	// function is finished and the JS stack unwinds.
	//
	// Other classes that derive from this class and load data synchronously
	// inside their loadData() implementation should also fire off an async
	// notification in this same manner to avoid this same problem.

	var self = this;

	this.pendingRequest = new Object;
	this.dataWasLoaded = false;

	var loadCallbackFunc = function()
	{
		self.pendingRequest = null;
		self.dataWasLoaded = true;

		self.applyColumnTypes();
		self.filterAndSortData();

		self.notifyObservers("onPostLoad");
		self.notifyObservers("onDataChanged");
	};

	if (syncLoad)
		loadCallbackFunc();
	else
		this.pendingRequest.timer = setTimeout(loadCallbackFunc, 0);
};


Spry.Data.DataSet.prototype.filterAndSortData = function()
{
	// If there is a data filter installed, run it.

	if (this.filterDataFunc)
		this.filterData(this.filterDataFunc, true);

	// If the distinct flag was set, run through all the records in the recordset
	// and toss out any that are duplicates.

	if (this.distinctOnLoad)
		this.distinct(this.distinctFieldsOnLoad);

	// If sortOnLoad was set, sort the data based on the columns
	// specified in sortOnLoad.

	if (this.keepSorted && this.getSortColumn())
		this.sort(this.lastSortColumns, this.lastSortOrder)
	else if (this.sortOnLoad)
		this.sort(this.sortOnLoad, this.sortOrderOnLoad);

	// If there is a view filter installed, run it.

	if (this.filterFunc)
		this.filter(this.filterFunc, true);

	// The default "current" row is the first row of the data set.
	if (this.data && this.data.length > 0)
		this.curRowID = this.data[0]['ds_RowID'];
	else
		this.curRowID = 0;
};

Spry.Data.DataSet.prototype.cancelLoadData = function()
{
	if (this.pendingRequest && this.pendingRequest.timer)
		clearTimeout(this.pendingRequest.timer);
	this.pendingRequest = null;
};

Spry.Data.DataSet.prototype.getRowCount = function(unfiltered)
{
	var rows = this.getData(unfiltered);
	return rows ? rows.length : 0;
};

Spry.Data.DataSet.prototype.getRowByID = function(rowID)
{
	if (!this.data)
		return null;
	return this.dataHash[rowID];
};

Spry.Data.DataSet.prototype.getRowByRowNumber = function(rowNumber, unfiltered)
{
	var rows = this.getData(unfiltered);
	if (rows && rowNumber >= 0 && rowNumber < rows.length)
		return rows[rowNumber];
	return null;
};

Spry.Data.DataSet.prototype.getCurrentRow = function()
{
	return this.getRowByID(this.curRowID);
};

Spry.Data.DataSet.prototype.setCurrentRow = function(rowID)
{
	if (this.curRowID == rowID)
		return;

	var nData = { oldRowID: this.curRowID, newRowID: rowID };
	this.curRowID = rowID;
	this.notifyObservers("onCurrentRowChanged", nData);
};

Spry.Data.DataSet.prototype.getRowNumber = function(row, unfiltered)
{
	if (row)
	{
		var rows = this.getData(unfiltered);
		if (rows && rows.length)
		{
			var numRows = rows.length;
			for (var i = 0; i < numRows; i++)
			{
				if (rows[i] == row)
					return i;
			}
		}
	}
	return -1;
};

Spry.Data.DataSet.prototype.getCurrentRowNumber = function()
{
	return this.getRowNumber(this.getCurrentRow());
};

Spry.Data.DataSet.prototype.getCurrentRowID = function()
{
	return this.curRowID;
};

Spry.Data.DataSet.prototype.setCurrentRowNumber = function(rowNumber)
{
	if (!this.data || rowNumber >= this.data.length)
	{
		Spry.Debug.trace("Invalid row number: " + rowNumber + "\n");
		return;
	}

	var rowID = this.data[rowNumber]["ds_RowID"];

	if (rowID == undefined || this.curRowID == rowID)
		return;

	this.setCurrentRow(rowID);
};

Spry.Data.DataSet.prototype.findRowsWithColumnValues = function(valueObj, firstMatchOnly, unfiltered)
{
	var results = [];
	var rows = this.getData(unfiltered);
	if (rows)
	{
		var numRows = rows.length;
		for (var i = 0; i < numRows; i++)
		{
			var row = rows[i];
			var matched = true;

			for (var colName in valueObj)
			{
				if (valueObj[colName] != row[colName])
				{
					matched = false;
					break;
				}
			}

			if (matched)
			{
				if (firstMatchOnly)
					return row;
				results.push(row);
			}
		}
	}

	return firstMatchOnly ? null : results;
};

Spry.Data.DataSet.prototype.setColumnType = function(columnNames, columnType)
{
	if (columnNames)
	{
		if (typeof columnNames == "string")
			columnNames = [ columnNames ];
		for (var i = 0; i < columnNames.length; i++)
			this.columnTypes[columnNames[i]] = columnType;
	}
};

Spry.Data.DataSet.prototype.getColumnType = function(columnName)
{
	if (this.columnTypes[columnName])
		return this.columnTypes[columnName];
	return "string";
};

Spry.Data.DataSet.prototype.applyColumnTypes = function()
{
	var rows = this.getData(true);
	var numRows = rows.length;
	var colNames = [];

	if (numRows < 1)
		return;

	for (var cname in this.columnTypes)
	{
		var ctype = this.columnTypes[cname];
		if (ctype != "string")
		{
			for (var i = 0; i < numRows; i++)
			{
				var row = rows[i];
				var val = row[cname];
				if (val != undefined)
				{
					if (ctype == "number")
						row[cname] = new Number(val);
					else if (ctype == "html")
						row[cname] = Spry.Utils.decodeEntities(val);
				}
			}
		}
	}
};

Spry.Data.DataSet.prototype.distinct = function(columnNames)
{
	if (this.data)
	{
		var oldData = this.data;
		this.data = [];
		this.dataHash = {};
		var dataChanged = false;

		var alreadySeenHash = {};
		var i = 0;

		var keys = [];

		if (typeof columnNames == "string")
			keys = [columnNames];
		else if (columnNames)
			keys = columnNames;
		else
			for (var recField in oldData[0])
				keys[i++] = recField;

		for (var i = 0; i < oldData.length; i++)
		{
			var rec = oldData[i];
			var hashStr = "";
			for (var j=0; j < keys.length; j++)
			{
				recField = keys[j];
				if (recField != "ds_RowID")
				{
					if (hashStr)
						hashStr += ",";
					hashStr += recField + ":" + "\"" + rec[recField] + "\"";
				}
			}
			if (!alreadySeenHash[hashStr])
			{
				this.data.push(rec);
				this.dataHash[rec['ds_RowID']] = rec;
				alreadySeenHash[hashStr] = true;
			}
			else
				dataChanged = true;
		}
		if (dataChanged)
			this.notifyObservers('onDataChanged');
	}
};

Spry.Data.DataSet.prototype.getSortColumn = function() {
	return (this.lastSortColumns && this.lastSortColumns.length > 0) ? this.lastSortColumns[0] : "";
};

Spry.Data.DataSet.prototype.getSortOrder = function() {
	return this.lastSortOrder ? this.lastSortOrder : "";
};

Spry.Data.DataSet.prototype.sort = function(columnNames, sortOrder)
{
	// columnNames can be either the name of a column to
	// sort on, or an array of column names, but it can't be
	// null/undefined.

	if (!columnNames)
		return;

	// If only one column name was specified for sorting, do a
	// secondary sort on ds_RowID so we get a stable sort order.

	if (typeof columnNames == "string")
		columnNames = [ columnNames, "ds_RowID" ];
	else if (columnNames.length < 2 && columnNames[0] != "ds_RowID")
		columnNames.push("ds_RowID");

	if (!sortOrder)
		sortOrder = "toggle";

	if (sortOrder == "toggle")
	{
		if (this.lastSortColumns.length > 0 && this.lastSortColumns[0] == columnNames[0] && this.lastSortOrder == "ascending")
			sortOrder = "descending";
		else
			sortOrder = "ascending";
	}

	if (sortOrder != "ascending" && sortOrder != "descending")
	{
		Spry.Debug.reportError("Invalid sort order type specified: " + sortOrder + "\n");
		return;
	}

	var nData = {
		oldSortColumns: this.lastSortColumns,
		oldSortOrder: this.lastSortOrder,
		newSortColumns: columnNames,
		newSortOrder: sortOrder
	};
	this.notifyObservers("onPreSort", nData);

	var cname = columnNames[columnNames.length - 1];
	var sortfunc = Spry.Data.DataSet.prototype.sort.getSortFunc(cname, this.getColumnType(cname), sortOrder);

	for (var i = columnNames.length - 2; i >= 0; i--)
	{
		cname = columnNames[i];
		sortfunc = Spry.Data.DataSet.prototype.sort.buildSecondarySortFunc(Spry.Data.DataSet.prototype.sort.getSortFunc(cname, this.getColumnType(cname), sortOrder), sortfunc);
	}

	if (this.unfilteredData)
	{
		this.unfilteredData.sort(sortfunc);
		if (this.filterFunc)
			this.filter(this.filterFunc, true);
	}
	else
		this.data.sort(sortfunc);

	this.lastSortColumns = columnNames.slice(0); // Copy the array.
	this.lastSortOrder = sortOrder;

	this.notifyObservers("onPostSort", nData);
};

Spry.Data.DataSet.prototype.sort.getSortFunc = function(prop, type, order)
{
	var sortfunc = null;
	if (type == "number")
	{
		if (order == "ascending")
			sortfunc = function(a, b)
			{
				a = a[prop]; b = b[prop];
				if (a == undefined || b == undefined)
					return (a == b) ? 0 : (a ? 1 : -1);
				return a-b;
			};
		else // order == "descending"
			sortfunc = function(a, b)
			{
				a = a[prop]; b = b[prop];
				if (a == undefined || b == undefined)
					return (a == b) ? 0 : (a ? -1 : 1);
				return b-a;
			};
	}
	else if (type == "date")
	{
		if (order == "ascending")
			sortfunc = function(a, b)
			{
				var dA = a[prop];
				var dB = b[prop];
				dA = dA ? (new Date(dA)) : 0;
				dB = dB ? (new Date(dB)) : 0;
				return dA - dB;
			};
		else // order == "descending"
			sortfunc = function(a, b)
			{
				var dA = a[prop];
				var dB = b[prop];
				dA = dA ? (new Date(dA)) : 0;
				dB = dB ? (new Date(dB)) : 0;
				return dB - dA;
			};
	}
	else // type == "string" || type == "html"
	{
		if (order == "ascending")
			sortfunc = function(a, b){
				a = a[prop];
				b = b[prop];
				if (a == undefined || b == undefined)
					return (a == b) ? 0 : (a ? 1 : -1);
				var tA = a.toString();
				var tB = b.toString();
				var tA_l = tA.toLowerCase();
				var tB_l = tB.toLowerCase();
				var min_len = tA.length > tB.length ? tB.length : tA.length;

				for (var i=0; i < min_len; i++)
				{
					var a_l_c = tA_l.charAt(i);
					var b_l_c = tB_l.charAt(i);
					var a_c = tA.charAt(i);
					var b_c = tB.charAt(i);
					if (a_l_c > b_l_c)
						return 1;
					else if (a_l_c < b_l_c)
						return -1;
					else if (a_c > b_c)
						return 1;
					else if (a_c < b_c)
						return -1;
				}
				if(tA.length == tB.length)
					return 0;
				else if (tA.length > tB.length)
					return 1;
				return -1;
			};
		else // order == "descending"
			sortfunc = function(a, b){
				a = a[prop];
				b = b[prop];
				if (a == undefined || b == undefined)
					return (a == b) ? 0 : (a ? -1 : 1);
				var tA = a.toString();
				var tB = b.toString();
				var tA_l = tA.toLowerCase();
				var tB_l = tB.toLowerCase();
				var min_len = tA.length > tB.length ? tB.length : tA.length;
				for (var i=0; i < min_len; i++)
				{
					var a_l_c = tA_l.charAt(i);
					var b_l_c = tB_l.charAt(i);
					var a_c = tA.charAt(i);
					var b_c = tB.charAt(i);
					if (a_l_c > b_l_c)
						return -1;
					else if (a_l_c < b_l_c)
						return 1;
					else if (a_c > b_c)
						return -1;
					else if (a_c < b_c)
						return 1;
				}
				if(tA.length == tB.length)
					return 0;
				else if (tA.length > tB.length)
					return -1;
				return 1;
			};
	}

	return sortfunc;
};

Spry.Data.DataSet.prototype.sort.buildSecondarySortFunc = function(funcA, funcB)
{
	return function(a, b)
	{
		var ret = funcA(a, b);
		if (ret == 0)
			ret = funcB(a, b);
		return ret;
	};
};

Spry.Data.DataSet.prototype.filterData = function(filterFunc, filterOnly)
{
	// This is a destructive filter function.

	var dataChanged = false;

	if (!filterFunc)
	{
		// Caller wants to remove the filter.

		this.filterDataFunc = null;
		dataChanged = true;
	}
	else
	{
		this.filterDataFunc = filterFunc;

		if (this.dataWasLoaded && ((this.unfilteredData && this.unfilteredData.length) || (this.data && this.data.length)))
		{
			if (this.unfilteredData)
			{
				this.data = this.unfilteredData;
				this.unfilteredData = null;
			}

			var oldData = this.data;
			this.data = [];
			this.dataHash = {};

			for (var i = 0; i < oldData.length; i++)
			{
				var newRow = filterFunc(this, oldData[i], i);
				if (newRow)
				{
					this.data.push(newRow);
					this.dataHash[newRow["ds_RowID"]] = newRow;
				}
			}

			dataChanged = true;
		}
	}

	if (dataChanged)
	{
		if (!filterOnly)
		{
			this.disableNotifications();
			if (this.filterFunc)
				this.filter(this.filterFunc, true);
			this.enableNotifications();
		}

		this.notifyObservers("onDataChanged");
	}
};

Spry.Data.DataSet.prototype.filter = function(filterFunc, filterOnly)
{
	// This is a non-destructive filter function.

	var dataChanged = false;

	if (!filterFunc)
	{
		if (this.filterFunc && this.unfilteredData)
		{
			// Caller wants to remove the filter. Restore the unfiltered
			// data and trigger a data changed notification.

			this.data = this.unfilteredData;
			this.unfilteredData = null;
			this.filterFunc = null;
			dataChanged = true;
		}
	}
	else
	{
		this.filterFunc = filterFunc;

		if (this.dataWasLoaded && (this.unfilteredData || (this.data && this.data.length)))
		{
			if (!this.unfilteredData)
				this.unfilteredData = this.data;

			var udata = this.unfilteredData;
			this.data = [];

			for (var i = 0; i < udata.length; i++)
			{
				var newRow = filterFunc(this, udata[i], i);

				if (newRow)
					this.data.push(newRow);
			}

			dataChanged = true;
		}
	}

	if (dataChanged)
		this.notifyObservers("onDataChanged");
};

Spry.Data.DataSet.prototype.startLoadInterval = function(interval)
{
	this.stopLoadInterval();
	if (interval > 0)
	{
		var self = this;
		this.loadInterval = interval;
		this.loadIntervalID = setInterval(function() { self.loadData(); }, interval);
	}
};

Spry.Data.DataSet.prototype.stopLoadInterval = function()
{
	if (this.loadIntervalID)
		clearInterval(this.loadIntervalID);
	this.loadInterval = 0;
	this.loadIntervalID = null;
};

Spry.Data.DataSet.nextDataSetID = 0;

//////////////////////////////////////////////////////////////////////
//
// Spry.Data.HTTPSourceDataSet
// base class for any DataSet that uses external
//
//////////////////////////////////////////////////////////////////////

Spry.Data.HTTPSourceDataSet = function(dataSetURL, dataSetOptions)
{
	// Call the constructor for our DataSet base class so that
	// our base class properties get defined. We'll call setOptions
	// manually after we set up our HTTPSourceDataSet properties.

	Spry.Data.DataSet.call(this);

	// HTTPSourceDataSet Properties:

	this.url = dataSetURL;
	this.dataSetsForDataRefStrings = new Array;
	this.hasDataRefStrings = false;
	this.useCache = true;

	this.setRequestInfo(dataSetOptions, true);

	Spry.Utils.setOptions(this, dataSetOptions, true);

	this.recalculateDataSetDependencies();

	if (this.loadInterval > 0)
		this.startLoadInterval(this.loadInterval);
}; // End of Spry.Data.HTTPSourceDataSet() constructor.

Spry.Data.HTTPSourceDataSet.prototype = new Spry.Data.DataSet();
Spry.Data.HTTPSourceDataSet.prototype.constructor = Spry.Data.HTTPSourceDataSet;

Spry.Data.HTTPSourceDataSet.prototype.setRequestInfo = function(requestInfo, undefineRequestProps)
{
	// Create a loadURL request object to store any load options
	// the caller specified. We'll fill in the URL at the last minute
	// before we make the actual load request because our URL needs
	// to be processed at the last possible minute in case it contains
	// data references.

	this.requestInfo = new Spry.Utils.loadURL.Request();
	this.requestInfo.extractRequestOptions(requestInfo, undefineRequestProps);

	// If the caller wants to use "POST" to fetch the data, but didn't
	// provide the content type, default to x-www-form-urlencoded.

	if (this.requestInfo.method == "POST")
	{
		if (!this.requestInfo.headers)
			this.requestInfo.headers = {};
		if (!this.requestInfo.headers['Content-Type'])
			this.requestInfo.headers['Content-Type'] = "application/x-www-form-urlencoded; charset=UTF-8";
	}
};

Spry.Data.HTTPSourceDataSet.prototype.recalculateDataSetDependencies = function()
{
	this.hasDataRefStrings = false;

	// Clear all old callbacks that may have been registered.

	var i = 0;
	for (i = 0; i < this.dataSetsForDataRefStrings.length; i++)
	{
		var ds = this.dataSetsForDataRefStrings[i];
		if (ds)
			ds.removeObserver(this);
	}

	// Now run through the strings that may contain data references and figure
	// out what data sets they require. Note that the data references in these
	// strings must be fully qualified with a data set name. (ex: {dsDataSetName::columnName})

	this.dataSetsForDataRefStrings = new Array();

	var regionStrs = this.getDataRefStrings();

	var dsCount = 0;

	for (var n = 0; n < regionStrs.length; n++)
	{
		var tokens = Spry.Data.Region.getTokensFromStr(regionStrs[n]);

		for (i = 0; tokens && i < tokens.length; i++)
		{
			if (tokens[i].search(/{[^}:]+::[^}]+}/) != -1)
			{
				var dsName = tokens[i].replace(/^\{|::.*\}/g, "");
				var ds = null;
				if (!this.dataSetsForDataRefStrings[dsName])
				{
					try { ds = eval(dsName); } catch (e) { ds = null; }

					if (dsName && ds)
					{
						// The dataSetsForDataRefStrings array serves as both an
						// array of data sets and a hash lookup by name.

						this.dataSetsForDataRefStrings[dsName] = ds;
						this.dataSetsForDataRefStrings[dsCount++] = ds;
						this.hasDataRefStrings = true;
					}
				}
			}
		}
	}

	// Set up observers on any data sets our URL depends on.

	for (i = 0; i < this.dataSetsForDataRefStrings.length; i++)
	{
		var ds = this.dataSetsForDataRefStrings[i];
		ds.addObserver(this);
	}
};

Spry.Data.HTTPSourceDataSet.prototype.getDataRefStrings = function()
{
	var strArr = [];
	if (this.url) strArr.push(this.url);
	if (this.requestInfo && this.requestInfo.postData) strArr.push(this.requestInfo.postData);
	return strArr;
};

Spry.Data.HTTPSourceDataSet.prototype.attemptLoadData = function()
{
	// We only want to trigger a load when all of our data sets have data!
	for (var i = 0; i < this.dataSetsForDataRefStrings.length; i++)
	{
		var ds = this.dataSetsForDataRefStrings[i];
		if (ds.getLoadDataRequestIsPending() || !ds.getDataWasLoaded())
			return;
	}

	this.loadData();
};

Spry.Data.HTTPSourceDataSet.prototype.onCurrentRowChanged = function(ds, data)
{
	this.attemptLoadData();
};

Spry.Data.HTTPSourceDataSet.prototype.onPostSort = function(ds, data)
{
	this.attemptLoadData();
};

Spry.Data.HTTPSourceDataSet.prototype.onDataChanged = function(ds, data)
{
	this.attemptLoadData();
};

Spry.Data.HTTPSourceDataSet.prototype.loadData = function()
{
	if (!this.url)
		return;

	this.cancelLoadData();

	var url = this.url;
	var postData = this.requestInfo.postData;

	if (this.hasDataRefStrings)
	{
		var allDataSetsReady = true;

		for (var i = 0; i < this.dataSetsForDataRefStrings.length; i++)
		{
			var ds = this.dataSetsForDataRefStrings[i];
			if (ds.getLoadDataRequestIsPending())
				allDataSetsReady = false;
			else if (!ds.getDataWasLoaded())
			{
				// Kick off the load of this data set!
				ds.loadData();
				allDataSetsReady = false;
			}
		}

		// If our data sets aren't ready, just return. We'll
		// get called back to load our data when they are all
		// done.

		if (!allDataSetsReady)
			return;

		url = Spry.Data.Region.processDataRefString(null, this.url, this.dataSetsForDataRefStrings);
		if (!url)
			return;

		if (postData && (typeof postData) == "string")
			postData = Spry.Data.Region.processDataRefString(null, postData, this.dataSetsForDataRefStrings);
	}

	this.notifyObservers("onPreLoad");

	this.data = null;
	this.dataWasLoaded = false;
	this.unfilteredData = null;
	this.dataHash = null;
	this.curRowID = 0;

	// At this point the url should've been processed if it contained any
	// data references. Set the url of the requestInfo structure and pass it
	// to LoadManager.loadData().

	var req = this.requestInfo.clone();
	req.url = url;
	req.postData = postData;

	this.pendingRequest = new Object;
	this.pendingRequest.data = Spry.Data.HTTPSourceDataSet.LoadManager.loadData(req, this, this.useCache);
};

Spry.Data.HTTPSourceDataSet.prototype.cancelLoadData = function()
{
	if (this.pendingRequest)
	{
		Spry.Data.HTTPSourceDataSet.LoadManager.cancelLoadData(this.pendingRequest.data, this);
		this.pendingRequest = null;
	}
};

Spry.Data.HTTPSourceDataSet.prototype.getURL = function() { return this.url; };
Spry.Data.HTTPSourceDataSet.prototype.setURL = function(url, requestOptions)
{
	if (this.url == url)
	{
		// The urls match so we may not have to do anything, but
		// before we bail early, check to see if the method and
		// postData that was last used was the same. If there is a
		// difference, we need to process the new URL.

		if (!requestOptions || (this.requestInfo.method == requestOptions.method && (requestOptions.method != "POST" || this.requestInfo.postData == requestOptions.postData)))
			return;
	}

	this.url = url;

	this.setRequestInfo(requestOptions);

	this.cancelLoadData();
	this.recalculateDataSetDependencies();
	this.dataWasLoaded = false;
};

Spry.Data.HTTPSourceDataSet.prototype.setDataFromDoc = function(rawDataDoc)
{
	this.pendingRequest = null;

	this.loadDataIntoDataSet(rawDataDoc);
	this.applyColumnTypes();
	this.filterAndSortData();

	this.notifyObservers("onPostLoad");
	this.notifyObservers("onDataChanged");
};

Spry.Data.HTTPSourceDataSet.prototype.loadDataIntoDataSet = function(rawDataDoc)
{
	// this method needs to be overwritten by the descendent classes;
	// internal data structures (data & dataHash) have to load data from the source document (ResponseText | ResponseDoc);

	this.dataHash = new Object;
	this.data = new Array;
	this.dataWasLoaded = true;
};

Spry.Data.HTTPSourceDataSet.prototype.xhRequestProcessor = function(xhRequest)
{
	// This method needs to be overwritten by the descendent classes if other objects (like responseXML)
	// are going to be used as a data source
	// This implementation returns the responseText from xhRequest

	var resp = xhRequest.responseText;

	if (xhRequest.status == 200 || xhRequest.status == 0)
		return resp;
	return null;
};

Spry.Data.HTTPSourceDataSet.prototype.sessionExpiredChecker = function(req)
{
	if (req.xhRequest.responseText == 'session expired')
		return true;
	return false;
};

Spry.Data.HTTPSourceDataSet.prototype.setSessionExpiredChecker = function(checker)
{
	this.sessionExpiredChecker = checker;
};


Spry.Data.HTTPSourceDataSet.prototype.onRequestResponse = function(cachedRequest, req)
{
	this.setDataFromDoc(cachedRequest.rawData);
};

Spry.Data.HTTPSourceDataSet.prototype.onRequestError = function(cachedRequest, req)
{
	this.notifyObservers("onLoadError", req);
	// Spry.Debug.reportError("Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.loadDataCallback(" + req.xhRequest.status + ") failed to load: " + req.url + "\n");
};

Spry.Data.HTTPSourceDataSet.prototype.onRequestSessionExpired = function(cachedRequest, req)
{
	this.notifyObservers("onSessionExpired", req);
	//Spry.Debug.reportError("Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.loadDataCallback(" + req.xhRequest.status + ") failed to load: " + req.url + "\n");
};


Spry.Data.HTTPSourceDataSet.LoadManager = {};
Spry.Data.HTTPSourceDataSet.LoadManager.cache = [];

Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest = function(reqInfo, xhRequestProcessor, sessionExpiredChecker)
{
	Spry.Utils.Notifier.call(this);

	this.reqInfo = reqInfo;
	this.rawData = null;
	this.timer = null;
	this.state = Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.NOT_LOADED;
	this.xhRequestProcessor = xhRequestProcessor;
	this.sessionExpiredChecker = sessionExpiredChecker;
};

Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.prototype = new Spry.Utils.Notifier();
Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.prototype.constructor = Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest;

Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.NOT_LOADED      = 1;
Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_REQUESTED  = 2;
Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_FAILED     = 3;
Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_SUCCESSFUL = 4;

Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.prototype.loadDataCallback = function(req)
{
	if (req.xhRequest.readyState != 4)
		return;

	var rawData = null;
	if (this.xhRequestProcessor) rawData = this.xhRequestProcessor(req.xhRequest);

	if (this.sessionExpiredChecker)
	{
		Spry.Utils.setOptions(req, {'rawData': rawData}, false);
		if (this.sessionExpiredChecker(req))
		{
			this.state = Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_FAILED;
			this.notifyObservers("onRequestSessionExpired", req);
			this.observers.length = 0;
			return;
		}
	}

	if (!rawData)
	{
		this.state = Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_FAILED;
		this.notifyObservers("onRequestError", req);
		this.observers.length = 0; // Clear the observers list.
		return;
	}

	this.rawData = rawData;
	this.state = Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_SUCCESSFUL;

	// Notify all of the cached request's observers!
	this.notifyObservers("onRequestResponse", req);

	// Clear the observers list.
	this.observers.length = 0;
};

Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.prototype.loadData = function()
{
	// IE will synchronously fire our loadDataCallback() during the call
	// to an async Spry.Utils.loadURL() if the data for the url is already
	// in the browser's local cache. This can wreak havoc with complicated master/detail
	// regions that use data sets that have master/detail relationships with other
	// data sets. Our data set logic already handles async data loading nicely so we
	// use a timer to fire off the async Spry.Utils.loadURL() call to insure that any
	// data loading happens asynchronously after this function is finished.

	var self = this;
	this.cancelLoadData();
	this.rawData = null;
	this.state = Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_REQUESTED;

	var reqInfo = this.reqInfo.clone();
	reqInfo.successCallback = function(req) { self.loadDataCallback(req); };
	reqInfo.errorCallback = reqInfo.successCallback;

	this.timer = setTimeout(function()
	{
		self.timer = null;
		Spry.Utils.loadURL(reqInfo.method, reqInfo.url, reqInfo.async, reqInfo.successCallback, reqInfo);
	}, 0);
};

Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.prototype.cancelLoadData = function()
{
	if (this.state == Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_REQUESTED)
	{
		if (this.timer)
		{
			this.timer.clearTimeout();
			this.timer = null;
		}

		this.rawData = null;
		this.state = Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.NOT_LOADED;
	}
};

Spry.Data.HTTPSourceDataSet.LoadManager.getCacheKey = function(reqInfo)
{
	return reqInfo.method + "::" + reqInfo.url + "::" + reqInfo.postData + "::" + reqInfo.username;
};

Spry.Data.HTTPSourceDataSet.LoadManager.loadData = function(reqInfo, ds, useCache)
{
	if (!reqInfo)
		return null;

	var cacheObj = null;
	var cacheKey = null;

	if (useCache)
	{
		cacheKey = Spry.Data.HTTPSourceDataSet.LoadManager.getCacheKey(reqInfo);
		cacheObj = Spry.Data.HTTPSourceDataSet.LoadManager.cache[cacheKey];
	}

	if (cacheObj)
	{
		if (cacheObj.state == Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_REQUESTED)
		{
			if (ds)
				cacheObj.addObserver(ds);
			return cacheObj;
		}
		else if (cacheObj.state == Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_SUCCESSFUL)
		{
			// Data is already cached so if we have a data set, trigger an async call
			// that tells it to load its data.
			if (ds)
				setTimeout(function() { ds.setDataFromDoc(cacheObj.rawData); }, 0);
			return cacheObj;
		}
	}

	// We're either loading this url for the first time, or an error occurred when
	// we last tried to load it, or the caller requested a forced load.

	if (!cacheObj)
	{
		cacheObj = new Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest(reqInfo, (ds ? ds.xhRequestProcessor : null), (ds ? ds.sessionExpiredChecker : null));

		if (useCache)
		{
			Spry.Data.HTTPSourceDataSet.LoadManager.cache[cacheKey] = cacheObj;

			// Add an observer that will remove the cacheObj from the cache
			// if there is a load request failure.
			cacheObj.addObserver({ onRequestError: function() { Spry.Data.HTTPSourceDataSet.LoadManager.cache[cacheKey] = undefined; }});
		}
	}

	if (ds)
		cacheObj.addObserver(ds);

	cacheObj.loadData();

	return cacheObj;
};

Spry.Data.HTTPSourceDataSet.LoadManager.cancelLoadData = function(cacheObj, ds)
{
	if (cacheObj)
	{
		if (ds)
			cacheObj.removeObserver(ds);
		else
			cacheObj.cancelLoadData();
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Data.XMLDataSet
//
//////////////////////////////////////////////////////////////////////

Spry.Data.XMLDataSet = function(dataSetURL, dataSetPath, dataSetOptions)
{
	// Call the constructor for our HTTPSourceDataSet base class so that
	// our base class properties get defined.

	this.xpath = dataSetPath;
	this.doc = null;
	this.subPaths = [];

	Spry.Data.HTTPSourceDataSet.call(this, dataSetURL, dataSetOptions);

	// Callers are allowed to pass either a string, an object or an array of
	// strings and/or objects for the 'subPaths' option, so make sure we normalize
	// the subPaths value to be an array.

	var jwType = typeof this.subPaths;
	if (jwType == "string" || (jwType == "object" && this.subPaths.constructor != Array))
		this.subPaths = [ this.subPaths ];
}; // End of Spry.Data.XMLDataSet() constructor.

Spry.Data.XMLDataSet.prototype = new Spry.Data.HTTPSourceDataSet();
Spry.Data.XMLDataSet.prototype.constructor = Spry.Data.XMLDataSet;


Spry.Data.XMLDataSet.prototype.getDataRefStrings = function()
{
	var strArr = [];
	if (this.url) strArr.push(this.url);
	if (this.xpath) strArr.push(this.xpath);
	if (this.requestInfo && this.requestInfo.postData) strArr.push(this.requestInfo.postData);
	return strArr;
};

Spry.Data.XMLDataSet.prototype.getDocument = function() { return this.doc; };
Spry.Data.XMLDataSet.prototype.getXPath = function() { return this.xpath; };
Spry.Data.XMLDataSet.prototype.setXPath = function(path)
{
	if (this.xpath != path)
	{
		this.xpath = path;
		if (this.dataWasLoaded && this.doc)
		{
			this.notifyObservers("onPreLoad");
			this.setDataFromDoc(this.doc);
		}
	}
};

Spry.Data.XMLDataSet.PathNode = function(path)
{
	this.path = path;
	this.subPaths = [];
	this.xpath = "";
};

Spry.Data.XMLDataSet.PathNode.prototype.addSubPath = function(path)
{
	var node = this.findSubPath(path);
	if (!node)
	{
		node = new Spry.Data.XMLDataSet.PathNode(path);
		this.subPaths.push(node);
	}
	return node;
};

Spry.Data.XMLDataSet.PathNode.prototype.findSubPath = function(path)
{
	var numSubPaths = this.subPaths.length;
	for (var i = 0; i < numSubPaths; i++)
	{
		var subPath = this.subPaths[i];
		if (path == subPath.path)
			return subPath;
	}
	return null;
};

Spry.Data.XMLDataSet.PathNode.prototype.consolidate = function()
{
	// This method recursively runs through the path tree and
	// tries to flatten any nodes that have no XPath and one child.
	// The flattening involves merging the parent's path component
	// with its child path component.

	var numSubPaths = this.subPaths.length;
	if (!this.xpath && numSubPaths == 1)
	{
		// Consolidate!
		var subPath = this.subPaths[0];
		this.path += ((subPath[0] != "/") ? "/" : "") + subPath.path;
		this.xpath = subPath.xpath;
		this.subPaths = subPath.subPaths;
		this.consolidate();
		return;
	}

	for (var i = 0; i < numSubPaths; i++)
		this.subPaths[i].consolidate();
};

/* This method is commented out so that it gets stripped when the file
   is minimized. Please do not remove this from the full version of the
   file! It is needed for debugging.

Spry.Data.XMLDataSet.PathNode.prototype.dump = function(indentStr)
{
	var didPre = false;
	var result = "";
	if (!indentStr)
	{
		indentStr = "";
		didPre = true;
		result = "<pre>";
	}
	result += indentStr + "<strong>" + this.path + "</strong>" + (this.xpath ? " <em>-- xpath(" + Spry.Utils.encodeEntities(this.xpath) + ")</em>" : "") + "\n";
	var numSubPaths = this.subPaths.length;
	indentStr += "    ";
	for (var i = 0; i < numSubPaths; i++)
		result += this.subPaths[i].dump(indentStr);
	if (didPre)
		result += "</pre>";
	return result;
};
*/

Spry.Data.XMLDataSet.prototype.convertXPathsToPathTree = function(xpathArray)
{
	var xpaLen = xpathArray.length;
	var root = new Spry.Data.XMLDataSet.PathNode("");

	for (var i = 0; i < xpaLen; i++)
	{
		// Convert any "//" in the XPath to our placeholder value.
		// We need to do that so they don't get removed when we split the
		// path into components.

		var xpath = xpathArray[i];
		var cleanXPath = xpath.replace(/\/\//g, "/__SPRYDS__");
		cleanXPath = cleanXPath.replace(/^\//, ""); // Strip any leading slash.
		var pathItems = cleanXPath.split(/\//);
		var pathItemsLen = pathItems.length;

		// Now add each path component to our tree.

		var node = root;
		for (var j = 0; j < pathItemsLen; j++)
		{
			// If this path component has a placeholder in it, convert it
			// back to a double slash.

			var path = pathItems[j].replace(/__SPRYDS__/, "//");
			node = node.addSubPath(path);
		}

		// Now add the full xpath to the node that represents the
		// last path component in our path.

		node.xpath = xpath;
	}

	// Now that we have a tree of nodes. Tell the root to consolidate
	// itself so we get a tree that is as flat as possible. This reduces
	// the number of XPaths we will have to flatten.

	root.consolidate();
	return root;
};

Spry.Data.XMLDataSet.prototype.flattenSubPaths = function(rs, subPaths)
{
	if (!rs || !subPaths)
		return;

	var numSubPaths = subPaths.length;
	if (numSubPaths < 1)
		return;

	var data = rs.data;
	var dataHash = {};

	// Convert all of the templated subPaths to XPaths with real values.
	// We also need a "cleaned" version of the XPath which contains no
	// expressions in it, so that we can pre-pend it to the column names
	// of any nested data we find.

	var xpathArray = [];
	var cleanedXPathArray = [];

	for (var i = 0; i < numSubPaths; i++)
	{
		// The elements of the subPaths array can be XPath strings,
		// or objects that describe a path with nested sub-paths below
		// it, so make sure we properly extract out the XPath to use.

		var subPath = subPaths[i];
		if (typeof subPath == "object")
			subPath = subPath.path;
		if (!subPath)
			subPath = "";

		// Convert any data references in the XPath to real values!

		xpathArray[i] = Spry.Data.Region.processDataRefString(null, subPath, this.dataSetsForDataRefStrings);

		// Create a clean version of the XPath by stripping out any
		// expressions it may contain.

		cleanedXPathArray[i] = xpathArray[i].replace(/\[.*\]/g, "");
	}

	// For each row of the base record set passed in, generate a flattened
	// recordset from each subPath, and then join the results with the base
	// row. The row from the base data set will be duplicated to match the
	// number of rows matched by the subPath. The results are then merged.

	var row;
	var numRows = data.length;
	var newData = [];

	// Iterate over each row of the base record set.

	for (var i = 0; i < numRows; i++)
	{
		row = data[i];
		var newRows = [ row ];

		// Iterate over every subPath passed into this function.

		for (var j = 0; j < numSubPaths; j++)
		{
			// Search for all nodes that match the given XPath underneath
			// the XML node for the base row and flatten the data into
			// a tabular recordset structure.

			var newRS = Spry.Utils.getRecordSetFromXMLDoc(row.ds_XMLNode, xpathArray[j], (subPaths[j].xpath ? false : true));

			// If this subPath has additional subPaths beneath it,
			// flatten and join them with the recordset we just created.

			if (newRS && newRS.data && newRS.data.length)
			{
				if (typeof subPaths[j] == "object" && subPaths[j].subPaths)
				{
					// The subPaths property can be either an XPath string,
					// an Object describing a subPath and paths beneath it,
					// or an Array of XPath strings or objects. We need to
					// normalize these variations into an array to simplify
					// our processing.

					var sp = subPaths[j].subPaths;
					spType = typeof sp;
					if (spType == "string")
						sp = [ sp ];
					else if (spType == "object" && spType.constructor == Object)
						sp = [ sp ];

					// Now that we have a normalized array of sub paths, flatten
					// them and join them to the recordSet we just calculated.

					this.flattenSubPaths(newRS, sp);
				}

				var newRSData = newRS.data;
				var numRSRows = newRSData.length;

				var cleanedXPath = cleanedXPathArray[j] + "/";

				var numNewRows = newRows.length;
				var joinedRows = [];

				// Iterate over all rows in our newRows array. Note that the
				// contents of newRows changes after the execution of this
				// loop, allowing us to perform more joins when more than
				// one subPath is specified.

				for (var k = 0; k < numNewRows; k++)
				{
					var newRow = newRows[k];

					// Iterate over all rows in the record set generated
					// from the current subPath. We are going to create
					// m*n rows for the joined table, where m is the number
					// of rows in the newRows array, and n is the number of
					// rows in the current subPath recordset.

					for (var l = 0; l < numRSRows; l++)
					{
						// Create a new row that will house the join result.

						var newRowObj = new Object;
						var newRSRow = newRSData[l];

						// Copy the columns from the newRow into our row
						// object.

						for (prop in newRow)
							newRowObj[prop] = newRow[prop];

						// Copy the data from the current row of the record set
						// into our new row object, but make sure to store the
						// data in columns that have the subPath prepended to
						// it so that it doesn't collide with any columns from
						// the newRows row data.

						for (var prop in newRSRow)
						{
							// The new propery name will have the subPath used prepended to it.
							var newPropName = cleanedXPath + prop;

							// We need to handle the case where the tag name of the node matched
							// by the XPath has a value. In that specific case, the name of the
							// property should be the cleanedXPath itself. For example:
							//
							//	<employees>
							//		<employee>Bob</employee>
							//		<employee>Joe</employee>
							//	</employees>
							//
							// XPath: /employees/employee
							//
							// The property name that contains "Bob" and "Joe" will be "employee".
							// So in our new row, we need to call this column "/employees/employee"
							// instead of "/employees/employee/employee" which would be incorrect.

							if (cleanedXPath == (prop + "/") || cleanedXPath.search(new RegExp("\\/" + prop + "\\/$")) != -1)
								newPropName = cleanedXPathArray[j];

							// Copy the props to the new object using the new property name.

							newRowObj[newPropName] = newRSRow[prop];
						}

						// Now add this row to the array that tracks all of the new
						// rows we've just created.

						joinedRows.push(newRowObj);
					}
				}

				// Set the newRows array equal to our joinedRows we just created,
				// so that when we flatten the data for the next subPath, it gets
				// joined with our new set of rows.

				newRows = joinedRows;
			}
		}

		newData = newData.concat(newRows);
	}

	// Now that we have a new set of joined rows, we need to run through
	// all of the rows and make sure they all have a unique row ID and
	// rebuild our dataHash.

	data = newData;
	numRows = data.length;

	for (i = 0; i < numRows; i++)
	{
		row = data[i];
		row.ds_RowID = i;
		dataHash[row.ds_RowID] = row;
	}

	// We're all done, so stuff the new data and dataHash
	// back into the base recordSet.

	rs.data = data;
	rs.dataHash = dataHash;
};

Spry.Data.XMLDataSet.prototype.loadDataIntoDataSet = function(rawDataDoc)
{
	var rs = null;
	var mainXPath = Spry.Data.Region.processDataRefString(null, this.xpath, this.dataSetsForDataRefStrings);
	var subPaths = this.subPaths;
	var suppressColumns = false;

	if (this.subPaths && this.subPaths.length > 0)
	{
		// Some subPaths were specified. Convert any data references in each subPath
		// to real data. While we're at it, convert any subPaths that are relative
		// to our main XPath to absolute paths.

		var processedSubPaths = [];
		var numSubPaths = subPaths.length;
		for (var i = 0; i < numSubPaths; i++)
		{
			var subPathStr = Spry.Data.Region.processDataRefString(null, subPaths[i], this.dataSetsForDataRefStrings);
			if (subPathStr.charAt(0) != '/')
				subPathStr = mainXPath + "/" + subPathStr;
			processedSubPaths.push(subPathStr);
		}

		// We need to add our main XPath to the set of subPaths and generate a path
		// tree so we can find the XPath to the common parent of all the paths, just
		// in case the user specified a path that was outside of our main XPath.

		processedSubPaths.unshift(mainXPath);
		var commonParent = this.convertXPathsToPathTree(processedSubPaths);

		// The root node of the resulting path tree should contain the XPath
		// to the common parent. Make this the XPath we generate our initial
		// set of rows from so we can group the results of flattening the other
		// subPaths in predictable/expected manner.

		mainXPath = commonParent.path;
		subPaths = commonParent.subPaths;

		// If the XPath to the common parent we calculated isn't our main XPath
		// or any of the subPaths specified by the user, it is used purely for
		// grouping and joining the data we will flatten. We don't want to include
		// any of the columns for the rows created for the common parent XPath since
		// the user did not ask for it.

		suppressColumns = commonParent.xpath ? false : true;
	}

	rs = Spry.Utils.getRecordSetFromXMLDoc(rawDataDoc, mainXPath, suppressColumns);

	if (!rs)
	{
		Spry.Debug.reportError("Spry.Data.XMLDataSet.loadDataIntoDataSet() failed to create dataSet '" + this.name + "'for '" + this.xpath + "' - " + this.url + "\n");
		return;
	}

	// Now that we have our base set of rows, flatten any additional subPaths
	// specified by the user.

	this.flattenSubPaths(rs, subPaths);

	this.doc = rs.xmlDoc;
	this.data = rs.data;
	this.dataHash = rs.dataHash;
	this.dataWasLoaded = (this.doc != null);
};

Spry.Data.XMLDataSet.prototype.xhRequestProcessor = function(xhRequest)
{
	// XMLDataSet uses the responseXML from the xhRequest

	var resp = xhRequest.responseXML;
	var manualParseRequired = false;

	if (xhRequest.status != 200)
	{
		if (xhRequest.status == 0)
		{
			// The page that is attempting to load data was probably loaded with
			// a file:// url. Mozilla based browsers will actually provide the complete DOM
			// tree for the data, but IE provides an empty document node so try to parse
			// the xml text manually to create a dom tree we can use.

			if (xhRequest.responseText && (!resp || !resp.firstChild))
				manualParseRequired = true;
		}
	}
	else if (!resp)
	{
		// The server said it sent us data, but for some reason we don't have
		// an XML DOM document. Some browsers won't auto-create an XML DOM
		// unless the server used a content-type of "text/xml" or "application/xml".
		// Try to manually parse the XML string, just in case the server
		// gave us an unexpected Content-Type.

		manualParseRequired = true;
	}

	if (manualParseRequired)
		resp = Spry.Utils.stringToXMLDoc(xhRequest.responseText);

	if (!resp  || !resp.firstChild || resp.firstChild.nodeName == "parsererror")
		return null;

	return resp;
};

Spry.Data.XMLDataSet.prototype.sessionExpiredChecker = function(req)
{
	if (req.xhRequest.responseText == 'session expired')
		return true;
	else
	{
		if (req.rawData)
		{
			var firstChild = req.rawData.documentElement.firstChild;
			if (firstChild && firstChild.nodeValue == "session expired")
				return true;
		}
	}
	return false;
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Data.Region
//
//////////////////////////////////////////////////////////////////////

Spry.Data.Region = function(regionNode, name, isDetailRegion, data, dataSets, regionStates, regionStateMap, hasBehaviorAttributes)
{
	this.regionNode = regionNode;
	this.name = name;
	this.isDetailRegion = isDetailRegion;
	this.data = data;
	this.dataSets = dataSets;
	this.hasBehaviorAttributes = hasBehaviorAttributes;
	this.tokens = null;
	this.currentState = null;
	this.states = { ready: true };
	this.stateMap = {};

	Spry.Utils.setOptions(this.states, regionStates);
	Spry.Utils.setOptions(this.stateMap, regionStateMap);

	// Add the region as an observer to the dataSet!
	for (var i = 0; i < this.dataSets.length; i++)
	{
		var ds = this.dataSets[i];

		try
		{
			if (ds)
				ds.addObserver(this);
		}
		catch(e) { Spry.Debug.reportError("Failed to add '" + this.name + "' as a dataSet observer!\n"); }
	}
}; // End of Spry.Data.Region() constructor.

Spry.Data.Region.hiddenRegionClassName = "SpryHiddenRegion";
Spry.Data.Region.evenRowClassName = "even";
Spry.Data.Region.oddRowClassName = "odd";
Spry.Data.Region.notifiers = {};
Spry.Data.Region.evalScripts = true;

Spry.Data.Region.addObserver = function(regionID, observer)
{
	var n = Spry.Data.Region.notifiers[regionID];
	if (!n)
	{
		n = new Spry.Utils.Notifier();
		Spry.Data.Region.notifiers[regionID] = n;
	}
	n.addObserver(observer);
};

Spry.Data.Region.removeObserver = function(regionID, observer)
{
	var n = Spry.Data.Region.notifiers[regionID];
	if (n)
		n.removeObserver(observer);
};

Spry.Data.Region.notifyObservers = function(methodName, region, data)
{
	var n = Spry.Data.Region.notifiers[region.name];
	if (n)
	{
		var dataObj = {};
		if (data && typeof data == "object")
			dataObj = data;
		else
			dataObj.data = data;

		dataObj.region = region;
		dataObj.regionID = region.name;
		dataObj.regionNode = region.regionNode;

		n.notifyObservers(methodName, dataObj);
	}
};

Spry.Data.Region.RS_Error = 0x01;
Spry.Data.Region.RS_LoadingData = 0x02;
Spry.Data.Region.RS_PreUpdate = 0x04;
Spry.Data.Region.RS_PostUpdate = 0x08;

Spry.Data.Region.prototype.getState = function()
{
	return this.currentState;
};

Spry.Data.Region.prototype.mapState = function(stateName, newStateName)
{
	this.stateMap[stateName] = newStateName;
};

Spry.Data.Region.prototype.getMappedState = function(stateName)
{
	var mappedState = this.stateMap[stateName];
	return mappedState ? mappedState : stateName;
};

Spry.Data.Region.prototype.setState = function(stateName, suppressNotfications)
{
	var stateObj = { state: stateName, mappedState: this.getMappedState(stateName) };
	if (!suppressNotfications)
		Spry.Data.Region.notifyObservers("onPreStateChange", this, stateObj);

	this.currentState = stateObj.mappedState ? stateObj.mappedState : stateName;

	// If the region has content that is specific to this
	// state, regenerate the region so that its markup is updated.

	if (this.states[stateName])
	{
		var notificationData = { state: this.currentState };
		if (!suppressNotfications)
			Spry.Data.Region.notifyObservers("onPreUpdate", this, notificationData);

		// Make the region transform the xml data. The result is
		// a string that we need to parse and insert into the document.

		var str = this.transform();

		// Clear out any previous transformed content.
		// this.clearContent();

		if (Spry.Data.Region.debug)
			Spry.Debug.trace("<hr />Generated region markup for '" + this.name + "':<br /><br />" + Spry.Utils.encodeEntities(str));

		// Now insert the new transformed content into the document.
		Spry.Utils.setInnerHTML(this.regionNode, str, !Spry.Data.Region.evalScripts);

		// Now run through the content looking for attributes
		// that tell us what behaviors to attach to each element.
		if (this.hasBehaviorAttributes)
			this.attachBehaviors();

		if (!suppressNotfications)
			Spry.Data.Region.notifyObservers("onPostUpdate", this, notificationData);
	}

	if (!suppressNotfications)
		Spry.Data.Region.notifyObservers("onPostStateChange", this, stateObj);
};

Spry.Data.Region.prototype.getDataSets = function()
{
	return this.dataSets;
};

Spry.Data.Region.prototype.addDataSet = function(aDataSet)
{
	if (!aDataSet)
		return;

	if (!this.dataSets)
		this.dataSets = new Array;

	// Check to see if the data set is already in our list.

	for (var i = 0; i < this.dataSets.length; i++)
	{
		if (this.dataSets[i] == aDataSet)
			return; // It's already in our list!
	}

	this.dataSets.push(aDataSet);
	aDataSet.addObserver(this);
};

Spry.Data.Region.prototype.removeDataSet = function(aDataSet)
{
	if (!aDataSet || this.dataSets)
		return;

	for (var i = 0; i < this.dataSets.length; i++)
	{
		if (this.dataSets[i] == aDataSet)
		{
			this.dataSets.splice(i, 1);
			aDataSet.removeObserver(this);
			return;
		}
	}
};

Spry.Data.Region.prototype.onPreLoad = function(dataSet)
{
	if (this.currentState != "loading")
		this.setState("loading");
};

Spry.Data.Region.prototype.onLoadError = function(dataSet)
{
	if (this.currentState != "error")
		this.setState("error");
	Spry.Data.Region.notifyObservers("onError", this);
};

Spry.Data.Region.prototype.onSessionExpired = function(dataSet)
{
	if (this.currentState != "expired")
		this.setState("expired");
	Spry.Data.Region.notifyObservers("onExpired", this);
};

Spry.Data.Region.prototype.onCurrentRowChanged = function(dataSet, data)
{
	if (this.isDetailRegion)
		this.updateContent();
};

Spry.Data.Region.prototype.onPostSort = function(dataSet, data)
{
	this.updateContent();
};

Spry.Data.Region.prototype.onDataChanged = function(dataSet, data)
{
	this.updateContent();
};

Spry.Data.Region.enableBehaviorAttributes = true;
Spry.Data.Region.behaviorAttrs = {};

Spry.Data.Region.behaviorAttrs["spry:select"] =
{
	attach: function(rgn, node, value)
	{
		var selectGroupName = null;
		try { selectGroupName = node.attributes.getNamedItem("spry:selectgroup").value; } catch (e) {}
		if (!selectGroupName)
			selectGroupName = "default";

		Spry.Utils.addEventListener(node, "click", function(event) { Spry.Utils.SelectionManager.select(selectGroupName, node, value); }, false);

		if (node.attributes.getNamedItem("spry:selected"))
			Spry.Utils.SelectionManager.select(selectGroupName, node, value);
	}
};

Spry.Data.Region.behaviorAttrs["spry:hover"] =
{
	attach: function(rgn, node, value)
	{
		Spry.Utils.addEventListener(node, "mouseover", function(event){ Spry.Utils.addClassName(node, value); }, false);
		Spry.Utils.addEventListener(node, "mouseout", function(event){ Spry.Utils.removeClassName(node, value); }, false);
	}
};

Spry.Data.Region.setUpRowNumberForEvenOddAttr = function(node, attr, value, rowNumAttrName)
{
	// The format for the spry:even and spry:odd attributes are as follows:
	//
	// <div spry:even="dataSetName cssEvenClassName" spry:odd="dataSetName cssOddClassName">
	//
	// The dataSetName is optional, and if not specified, the first data set
	// listed for the region is used.
	//
	// cssEvenClassName and cssOddClassName are required and *must* be specified. They can be
	// any user defined CSS class name.

	if (!value)
	{
		Spry.Debug.showError("The " + attr + " attribute requires a CSS class name as its value!");
		node.attributes.removeNamedItem(attr);
		return;
	}

	var dsName = "";
	var valArr = value.split(/\s/);
	if (valArr.length > 1)
	{
		// Extract out the data set name and reset the attribute so
		// that it only contains the CSS class name to use.

		dsName = valArr[0];
		node.setAttribute(attr, valArr[1]);
	}

	// Tag the node with an attribute that will allow us to fetch the row
	// number used when it is written out during the re-generation process.

	node.setAttribute(rowNumAttrName, "{" + (dsName ? (dsName + "::") : "") + "ds_RowNumber}");
};

Spry.Data.Region.behaviorAttrs["spry:even"] =
{
	setup: function(node, value)
	{
		Spry.Data.Region.setUpRowNumberForEvenOddAttr(node, "spry:even", value, "spryevenrownumber");
	},

	attach: function(rgn, node, value)
	{
		if (value)
		{
			rowNumAttr = node.attributes.getNamedItem("spryevenrownumber");
			if (rowNumAttr && rowNumAttr.value)
			{
				var rowNum = parseInt(rowNumAttr.value);
				if (rowNum % 2)
					Spry.Utils.addClassName(node, value);
			}
		}
		node.removeAttribute("spry:even");
		node.removeAttribute("spryevenrownumber");
	}
};

Spry.Data.Region.behaviorAttrs["spry:odd"] =
{
	setup: function(node, value)
	{
		Spry.Data.Region.setUpRowNumberForEvenOddAttr(node, "spry:odd", value, "spryoddrownumber");
	},

	attach: function(rgn, node, value)
	{
		if (value)
		{
			rowNumAttr = node.attributes.getNamedItem("spryoddrownumber");
			if (rowNumAttr && rowNumAttr.value)
			{
				var rowNum = parseInt(rowNumAttr.value);
				if (rowNum % 2 == 0)
					Spry.Utils.addClassName(node, value);
			}
		}
		node.removeAttribute("spry:odd");
		node.removeAttribute("spryoddrownumber");
	}
};

Spry.Data.Region.setRowAttrClickHandler = function(node, dsName, rowAttr, funcName)
{
		if (dsName)
		{
			var ds = null;
			try { ds = Spry.Utils.eval(dsName); } catch(e) { ds = null; };
			if (ds)
			{
				rowIDAttr = node.attributes.getNamedItem(rowAttr);
				if (rowIDAttr)
				{
					var rowAttrVal = rowIDAttr.value;
					if (rowAttrVal)
						Spry.Utils.addEventListener(node, "click", function(event){ ds[funcName](rowAttrVal); }, false);
				}
			}
		}
};

Spry.Data.Region.behaviorAttrs["spry:setrow"] =
{
	setup: function(node, value)
	{
		if (!value)
		{
			Spry.Debug.reportError("The spry:setrow attribute requires a data set name as its value!");
			node.removeAttribute("spry:setrow");
			return;
		}

		// Tag the node with an attribute that will allow us to fetch the id of the
		// row used when it is written out during the re-generation process.

		node.setAttribute("spryrowid", "{" + value + "::ds_RowID}");
	},

	attach: function(rgn, node, value)
	{
		Spry.Data.Region.setRowAttrClickHandler(node, value, "spryrowid", "setCurrentRow");
		node.removeAttribute("spry:setrow");
		node.removeAttribute("spryrowid");
	}
};

Spry.Data.Region.behaviorAttrs["spry:setrownumber"] =
{
	setup: function(node, value)
	{
		if (!value)
		{
			Spry.Debug.reportError("The spry:setrownumber attribute requires a data set name as its value!");
			node.removeAttribute("spry:setrownumber");
			return;
		}

		// Tag the node with an attribute that will allow us to fetch the row number
		// of the row used when it is written out during the re-generation process.

		node.setAttribute("spryrownumber", "{" + value + "::ds_RowID}");
	},

	attach: function(rgn, node, value)
	{
		Spry.Data.Region.setRowAttrClickHandler(node, value, "spryrownumber", "setCurrentRowNumber");
		node.removeAttribute("spry:setrownumber");
		node.removeAttribute("spryrownumber");
	}
};

Spry.Data.Region.behaviorAttrs["spry:sort"] =
{
	attach: function(rgn, node, value)
	{
		if (!value)
			return;

		// The format of a spry:sort attribute is as follows:
		//
		// <div spry:sort="dataSetName column1Name column2Name ... sortOrderName">
		//
		// The dataSetName and sortOrderName are optional, but when specified, they
		// must appear in the order mentioned above. If the dataSetName is not specified,
		// the first data set listed for the region is used. If the sortOrderName is not
		// specified, the sort defaults to "toggle".
		//
		// The user *must* specify at least one column name.

		var ds = rgn.getDataSets()[0];
		var sortOrder = "toggle";

		var colArray = value.split(/\s/);
		if (colArray.length > 1)
		{
			// Check the first string in the attribute to see if a data set was
			// specified. If so, make sure we use it for the sort.

			try
			{
				var specifiedDS = eval(colArray[0]);
				if (specifiedDS && (typeof specifiedDS) == "object")
				{
					ds = specifiedDS;
					colArray.shift();
				}

			} catch(e) {}

			// Check to see if the last string in the attribute is the name of
			// a sort order. If so, use that sort order during the sort.

			if (colArray.length > 1)
			{
				var str = colArray[colArray.length - 1];
				if (str == "ascending" || str == "descending" || str == "toggle")
				{
					sortOrder = str;
					colArray.pop();
				}
			}
		}

		// If we have a data set and some column names, add a non-destructive
		// onclick handler that will perform a toggle sort on the data set.

		if (ds && colArray.length > 0)
			Spry.Utils.addEventListener(node, "click", function(event){ ds.sort(colArray, sortOrder); }, false);

		node.removeAttribute("spry:sort");
	}
};

Spry.Data.Region.prototype.attachBehaviors = function()
{
	var rgn = this;
	Spry.Utils.getNodesByFunc(this.regionNode, function(node)
	{
		if (!node || node.nodeType != 1 /* Node.ELEMENT_NODE */)
			return false;
		try
		{
			var bAttrs = Spry.Data.Region.behaviorAttrs;
			for (var bAttrName in bAttrs)
			{
				var attr = node.attributes.getNamedItem(bAttrName);
				if (attr)
				{
					var behavior = bAttrs[bAttrName];
					if (behavior && behavior.attach)
						behavior.attach(rgn, node, attr.value);
				}
			}
		} catch(e) {}

		return false;
	});
};

Spry.Data.Region.prototype.updateContent = function()
{
	var allDataSetsReady = true;

	var dsArray = this.getDataSets();

	if (!dsArray || dsArray.length < 1)
	{
		Spry.Debug.reportError("updateContent(): Region '" + this.name + "' has no data set!\n");
		return;
	}

	for (var i = 0; i < dsArray.length; i++)
	{
		var ds = dsArray[i];

		if (ds)
		{
			if (ds.getLoadDataRequestIsPending())
				allDataSetsReady = false;
			else if (!ds.getDataWasLoaded())
			{
				// Kick off the loading of the data if it hasn't happened yet.
				ds.loadData();
				allDataSetsReady = false;
			}
		}
	}

	if (!allDataSetsReady)
	{
		Spry.Data.Region.notifyObservers("onLoadingData", this);

		// Just return, this method will get called again automatically
		// as each data set load completes!
		return;
	}

	this.setState("ready");
};

Spry.Data.Region.prototype.clearContent = function()
{
	this.regionNode.innerHTML = "";
};

Spry.Data.Region.processContentPI = function(inStr)
{
	var outStr = "";
	var regexp = /<!--\s*<\/?spry:content\s*[^>]*>\s*-->/mg;
	var searchStartIndex = 0;
	var processingContentTag = 0;

	while (inStr.length)
	{
		var results = regexp.exec(inStr);
		if (!results || !results[0])
		{
			outStr += inStr.substr(searchStartIndex, inStr.length - searchStartIndex);
			break;
		}

		if (!processingContentTag && results.index != searchStartIndex)
		{
			// We found a match but it's not at the start of the inStr.
			// Create a string token for everything that precedes the match.
			outStr += inStr.substr(searchStartIndex, results.index - searchStartIndex);
		}

		if (results[0].search(/<\//) != -1)
		{
			--processingContentTag;
			if (processingContentTag)
				Spry.Debug.reportError("Nested spry:content regions are not allowed!\n");
		}
		else
		{
			++processingContentTag;
			var dataRefStr = results[0].replace(/.*\bdataref="/, "");
			outStr += dataRefStr.replace(/".*$/, "");
		}

		searchStartIndex = regexp.lastIndex;
	}

	return outStr;
}

Spry.Data.Region.prototype.tokenizeData = function(dataStr)
{
	// If there is no data, there's nothing to do.
	if (!dataStr)
		return null;

	var rootToken = new Spry.Data.Region.Token(Spry.Data.Region.Token.LIST_TOKEN, null, null, null);
	var tokenStack = new Array;
	var parseStr = Spry.Data.Region.processContentPI(dataStr);

	tokenStack.push(rootToken);

	// Create a regular expression that will match one of the following:
	//
	//   <spry:repeat select="regionName" test="true">
	//   </spry:repeat>
	//   {valueReference}
	var regexp = /((<!--\s*){0,1}<\/{0,1}spry:[^>]+>(\s*-->){0,1})|((\{|%7[bB])[^\}\s%]+(\}|%7[dD]))/mg;
	var searchStartIndex = 0;

	while(parseStr.length)
	{
		var results = regexp.exec(parseStr);
		var token = null;

		if (!results || !results[0])
		{
			// If we get here, the rest of the parseStr should be
			// just a plain string. Create a token for it and then
			// break out of the list.
			var str = parseStr.substr(searchStartIndex, parseStr.length - searchStartIndex);
			token = new Spry.Data.Region.Token(Spry.Data.Region.Token.STRING_TOKEN, null, str, str);
			tokenStack[tokenStack.length - 1].addChild(token);
			break;
		}

		if (results.index != searchStartIndex)
		{
			// We found a match but it's not at the start of the parseStr.
			// Create a string token for everything that precedes the match.
			var str = parseStr.substr(searchStartIndex, results.index - searchStartIndex);
			token = new Spry.Data.Region.Token(Spry.Data.Region.Token.STRING_TOKEN, null, str, str);
			tokenStack[tokenStack.length - 1].addChild(token);
		}

		// We found a string that needs to be turned into a token. Create a token
		// for it and then update parseStr for the next iteration.
		if (results[0].search(/^({|%7[bB])/) != -1 /* results[0].charAt(0) == '{' */)
		{
			var valueName = results[0];
			var regionStr = results[0];

			// Strip off brace and url encode brace chars inside the valueName.

			valueName = valueName.replace(/^({|%7[bB])/, "");
			valueName = valueName.replace(/(}|%7[dD])$/, "");

			// Check to see if our value begins with the name of a data set.
			// For example: {dataSet:tokenValue}. If it is, we need to save
			// the data set name so we know which data set to use to get the
			// value for the token during the region transform.

			var dataSetName = null;
			var splitArray = valueName.split(/::/);

			if (splitArray.length > 1)
			{
				dataSetName = splitArray[0];
				valueName = splitArray[1];
			}

			// Convert any url encoded braces to regular brace chars.

			regionStr = regionStr.replace(/^%7[bB]/, "{");
			regionStr = regionStr.replace(/%7[dD]$/, "}");

			// Now create a token for the placeholder.

			token = new Spry.Data.Region.Token(Spry.Data.Region.Token.VALUE_TOKEN, dataSetName, valueName, new String(regionStr));
			tokenStack[tokenStack.length - 1].addChild(token);
		}
		else if (results[0].charAt(0) == '<')
		{
			// Extract out the name of the processing instruction.
			var piName = results[0].replace(/^(<!--\s*){0,1}<\/?/, "");
			piName = piName.replace(/>(\s*-->){0,1}|\s.*$/, "");

			if (results[0].search(/<\//) != -1 /* results[0].charAt(1) == '/' */)
			{
				// We found a processing instruction close tag. Pop the top of the
				// token stack!
				//
				// XXX: We need to make sure that the close tag name matches the one
				//      on the top of the token stack!
				if (tokenStack[tokenStack.length - 1].tokenType != Spry.Data.Region.Token.PROCESSING_INSTRUCTION_TOKEN)
				{
					Spry.Debug.reportError("Invalid processing instruction close tag: " + piName + " -- " + results[0] + "\n");
					return null;
				}

				tokenStack.pop();
			}
			else
			{
				// Create the processing instruction token, add it as a child of the token
				// at the top of the token stack, and then push it on the stack so that it
				// becomes the parent of any tokens between it and its close tag.

				var piDesc = Spry.Data.Region.PI.instructions[piName];

				if (piDesc)
				{
					var dataSet = null;

					var selectedDataSetName = "";
					if (results[0].search(/^.*\bselect=\"/) != -1)
					{
						selectedDataSetName = results[0].replace(/^.*\bselect=\"/, "");
						selectedDataSetName = selectedDataSetName.replace(/".*$/, "");

						if (selectedDataSetName)
						{
							try
							{
								dataSet = eval(selectedDataSetName);
							}
							catch (e)
							{
								Spry.Debug.reportError("Caught exception in tokenizeData() while trying to retrieve data set (" + selectedDataSetName + "): " + e + "\n");
								dataSet = null;
								selectedDataSetName = "";
							}
						}
					}

					// Check if the repeat has a test attribute.
					var jsExpr = null;
					if (results[0].search(/^.*\btest=\"/) != -1)
					{
						jsExpr = results[0].replace(/^.*\btest=\"/, "");
						jsExpr = jsExpr.replace(/".*$/, "");
						jsExpr = Spry.Utils.decodeEntities(jsExpr);
					}

					// Check if the instruction has a state name specified.
					var regionState = null;
					if (results[0].search(/^.*\bname=\"/) != -1)
					{
						regionState = results[0].replace(/^.*\bname=\"/, "");
						regionState = regionState.replace(/".*$/, "");
						regionState = Spry.Utils.decodeEntities(regionState);
					}

					var piData = new Spry.Data.Region.Token.PIData(piName, selectedDataSetName, jsExpr, regionState);

					token = new Spry.Data.Region.Token(Spry.Data.Region.Token.PROCESSING_INSTRUCTION_TOKEN, dataSet, piData, new String(results[0]));

					tokenStack[tokenStack.length - 1].addChild(token);
					tokenStack.push(token);
				}
				else
				{
					Spry.Debug.reportError("Unsupported region processing instruction: " + results[0] + "\n");
					return null;
				}
			}
		}
		else
		{
			Spry.Debug.reportError("Invalid region token: " + results[0] + "\n");
			return null;
		}

		searchStartIndex = regexp.lastIndex;
	}

	return rootToken;
};

Spry.Data.Region.prototype.processTokenChildren = function(outputArr, token, processContext)
{
	var children = token.children;
	var len = children.length;

	for (var i = 0; i < len; i++)
		this.processTokens(outputArr, children[i], processContext);
};

Spry.Data.Region.prototype.processTokens = function(outputArr, token, processContext)
{
	var i = 0;

	switch(token.tokenType)
	{
		case Spry.Data.Region.Token.LIST_TOKEN:
			this.processTokenChildren(outputArr, token, processContext);
			break;
		case Spry.Data.Region.Token.STRING_TOKEN:
			outputArr.push(token.data);
			break;
		case Spry.Data.Region.Token.PROCESSING_INSTRUCTION_TOKEN:
			if (token.data.name == "spry:repeat")
			{
				var dataSet = null;

				if (token.dataSet)
					dataSet = token.dataSet;
				else
					dataSet = this.dataSets[0];

				if (dataSet)
				{
					var dsContext = processContext.getDataSetContext(dataSet);
					if (!dsContext)
					{
						Spry.Debug.reportError("processTokens() failed to get a data set context!\n");
						break;
					}

					dsContext.pushState();

					var dataSetRows = dsContext.getData();
					var numRows = dataSetRows.length;
					for (i = 0; i < numRows; i++)
					{
						dsContext.setRowIndex(i);
						var testVal = true;
						if (token.data.jsExpr)
						{
							var jsExpr = Spry.Data.Region.processDataRefString(processContext, token.data.jsExpr, null, true);
							try { testVal = Spry.Utils.eval(jsExpr); }
							catch(e)
							{
								Spry.Debug.trace("Caught exception in Spry.Data.Region.prototype.processTokens while evaluating: " + jsExpr + "\n    Exception:" + e + "\n");
								testVal = true;
							}
						}

						if (testVal)
							this.processTokenChildren(outputArr, token, processContext);
					}
					dsContext.popState();
				}
			}
			else if (token.data.name == "spry:if")
			{
				var testVal = true;

				if (token.data.jsExpr)
				{
					var jsExpr = Spry.Data.Region.processDataRefString(processContext, token.data.jsExpr, null, true);

					try { testVal = Spry.Utils.eval(jsExpr); }
					catch(e)
					{
						Spry.Debug.trace("Caught exception in Spry.Data.Region.prototype.processTokens while evaluating: " + jsExpr + "\n    Exception:" + e + "\n");
						testVal = true;
					}
				}

				if (testVal)
					this.processTokenChildren(outputArr, token, processContext);
			}
			else if (token.data.name == "spry:choose")
			{
				var defaultChild = null;
				var childToProcess = null;
				var testVal = false;
				var j = 0;

				// All of the children of the spry:choose token should be of the type spry:when or spry:default.
				// Run through all of the spry:when children and see if any of their test expressions return true.
				// If one does, then process its children tokens. If none of the test expressions return true,
				// process the spry:default token's children, if it exists.

				for (j = 0; j < token.children.length; j++)
				{
					var child = token.children[j];
					if (child.tokenType == Spry.Data.Region.Token.PROCESSING_INSTRUCTION_TOKEN)
					{
						if (child.data.name == "spry:when")
						{
							if (child.data.jsExpr)
							{
								var jsExpr = Spry.Data.Region.processDataRefString(processContext, child.data.jsExpr, null, true);
								try { testVal = Spry.Utils.eval(jsExpr); }
								catch(e)
								{
									Spry.Debug.trace("Caught exception in Spry.Data.Region.prototype.processTokens while evaluating: " + jsExpr + "\n    Exception:" + e + "\n");
									testVal = false;
								}

								if (testVal)
								{
									childToProcess = child;
									break;
								}
							}
						}
						else if (child.data.name == "spry:default")
							defaultChild = child;
					}
				}

				// If we didn't find a match, use the token for the default case.

				if (!childToProcess && defaultChild)
					childToProcess = defaultChild;

				if (childToProcess)
					this.processTokenChildren(outputArr, childToProcess, processContext);
			}
			else if (token.data.name == "spry:state")
			{
				var testVal = true;

				if (!token.data.regionState || token.data.regionState == this.currentState)
					this.processTokenChildren(outputArr, token, processContext);
			}
			else
			{
				Spry.Debug.reportError("processTokens(): Unknown processing instruction: " + token.data.name + "\n");
				return "";
			}
			break;
		case Spry.Data.Region.Token.VALUE_TOKEN:

			var dataSet = token.dataSet;
			if (!dataSet && this.dataSets && this.dataSets.length > 0 && this.dataSets[0])
			{
				// No dataSet was specified by the token, so use whatever the first
				// data set specified in the region.

				dataSet = this.dataSets[0];
			}
			if (!dataSet)
			{
				Spry.Debug.reportError("processTokens(): Value reference has no data set specified: " + token.regionStr + "\n");
				return "";
			}

			var dsContext = processContext.getDataSetContext(dataSet);
			if (!dsContext)
			{
				Spry.Debug.reportError("processTokens: Failed to get a data set context!\n");
				return "";
			}

			var ds = dsContext.getDataSet();

			if (token.data == "ds_RowNumber")
				outputArr.push(dsContext.getRowIndex());
			else if (token.data == "ds_RowNumberPlus1")
				outputArr.push(dsContext.getRowIndex() + 1);
			else if (token.data == "ds_RowCount")
				outputArr.push(dsContext.getNumRows());
			else if (token.data == "ds_UnfilteredRowCount")
				outputArr.push(dsContext.getNumRows(true));
			else if (token.data == "ds_CurrentRowNumber")
				outputArr.push(ds.getRowNumber(ds.getCurrentRow()));
			else if (token.data == "ds_CurrentRowID")
				outputArr.push(ds.getCurrentRowID());
			else if (token.data == "ds_EvenOddRow")
				outputArr.push((dsContext.getRowIndex() % 2) ? Spry.Data.Region.evenRowClassName : Spry.Data.Region.oddRowClassName);
			else if (token.data == "ds_SortOrder")
				outputArr.push(ds.getSortOrder());
			else if (token.data == "ds_SortColumn")
				outputArr.push(ds.getSortColumn());
			else
			{
				var curDataSetRow = dsContext.getCurrentRow();
				if (curDataSetRow)
					outputArr.push(curDataSetRow[token.data]);
			}
			break;
		default:
			Spry.Debug.reportError("processTokens(): Invalid token type: " + token.regionStr + "\n");
			break;
	}
};

Spry.Data.Region.prototype.transform = function()
{
	if (this.data && !this.tokens)
		this.tokens = this.tokenizeData(this.data);

	if (!this.tokens)
		return "";

	processContext = new Spry.Data.Region.ProcessingContext(this);
	if (!processContext)
		return "";

	// Now call processTokens to transform our tokens into real data strings.
	// We use an array to gather the strings during processing as a performance
	// enhancement for IE to avoid n-square problems of adding to an existing
	// string. For example:
	//
	//     for (var i = 0; i < token.children.length; i++)
	//       outputStr += this.processTokens(token.children[i], processContext);
	//
	// Using an array with a final join reduced one of our test cases  from over
	// a minute to about 15 seconds.

	var outputArr = [ "" ];
	this.processTokens(outputArr, this.tokens, processContext);
	return outputArr.join("");
};

Spry.Data.Region.PI = {};
Spry.Data.Region.PI.instructions = {};

Spry.Data.Region.PI.buildOpenTagForValueAttr = function(ele, piName, attrName)
{
	if (!ele || !piName)
		return "";

	var jsExpr = "";

	try
	{
		var testAttr = ele.attributes.getNamedItem(piName);
		if (testAttr && testAttr.value)
			jsExpr = Spry.Utils.encodeEntities(testAttr.value);
	}
	catch (e) { jsExpr = ""; }

	if (!jsExpr)
	{
		Spry.Debug.reportError(piName + " attribute requires a JavaScript expression that returns true or false!\n");
		return "";
	}

	return "<" + Spry.Data.Region.PI.instructions[piName].tagName + " " + attrName +"=\"" + jsExpr + "\">";
};

Spry.Data.Region.PI.buildOpenTagForTest = function(ele, piName)
{
	return Spry.Data.Region.PI.buildOpenTagForValueAttr(ele, piName, "test");
};

Spry.Data.Region.PI.buildOpenTagForState = function(ele, piName)
{
	return Spry.Data.Region.PI.buildOpenTagForValueAttr(ele, piName, "name");
};

Spry.Data.Region.PI.buildOpenTagForRepeat = function(ele, piName)
{
	if (!ele || !piName)
		return "";

	var selectAttrStr = "";

	try
	{
		var selectAttr = ele.attributes.getNamedItem(piName);
		if (selectAttr && selectAttr.value)
		{
			selectAttrStr = selectAttr.value;
			selectAttrStr = selectAttrStr.replace(/\s/g, "");
		}
	}
	catch (e) { selectAttrStr = ""; }

	if (!selectAttrStr)
	{
		Spry.Debug.reportError(piName + " attribute requires a data set name!\n");
		return "";
	}

	var testAttrStr = "";

	try
	{
		var testAttr = ele.attributes.getNamedItem("spry:test");
		if (testAttr)
		{
			if (testAttr.value)
				testAttrStr = " test=\"" + Spry.Utils.encodeEntities(testAttr.value) + "\"";
			ele.attributes.removeNamedItem(testAttr.nodeName);
		}
	}
	catch (e) { testAttrStr = ""; }

	return "<" + Spry.Data.Region.PI.instructions[piName].tagName + " select=\"" + selectAttrStr + "\"" + testAttrStr + ">";
};

Spry.Data.Region.PI.buildOpenTagForContent = function(ele, piName)
{
	if (!ele || !piName)
		return "";

	var dataRefStr = "";

	try
	{
		var contentAttr = ele.attributes.getNamedItem(piName);
		if (contentAttr && contentAttr.value)
			dataRefStr = Spry.Utils.encodeEntities(contentAttr.value);
	}
	catch (e) { dataRefStr = ""; }

	if (!dataRefStr)
	{
		Spry.Debug.reportError(piName + " attribute requires a data reference!\n");
		return "";
	}

	return "<" + Spry.Data.Region.PI.instructions[piName].tagName + " dataref=\"" + dataRefStr + "\">";
};

Spry.Data.Region.PI.buildOpenTag = function(ele, piName)
{
	return "<" + Spry.Data.Region.PI.instructions[piName].tagName + ">";
};

Spry.Data.Region.PI.buildCloseTag = function(ele, piName)
{
	return "</" + Spry.Data.Region.PI.instructions[piName].tagName + ">";
};

Spry.Data.Region.PI.instructions["spry:state"] = { tagName: "spry:state", childrenOnly: false, getOpenTag: Spry.Data.Region.PI.buildOpenTagForState, getCloseTag: Spry.Data.Region.PI.buildCloseTag };
Spry.Data.Region.PI.instructions["spry:if"] = { tagName: "spry:if", childrenOnly: false, getOpenTag: Spry.Data.Region.PI.buildOpenTagForTest, getCloseTag: Spry.Data.Region.PI.buildCloseTag };
Spry.Data.Region.PI.instructions["spry:repeat"] = { tagName: "spry:repeat", childrenOnly: false, getOpenTag: Spry.Data.Region.PI.buildOpenTagForRepeat, getCloseTag: Spry.Data.Region.PI.buildCloseTag };
Spry.Data.Region.PI.instructions["spry:repeatchildren"] = { tagName: "spry:repeat", childrenOnly: true, getOpenTag: Spry.Data.Region.PI.buildOpenTagForRepeat, getCloseTag: Spry.Data.Region.PI.buildCloseTag };
Spry.Data.Region.PI.instructions["spry:choose"] = { tagName: "spry:choose", childrenOnly: true, getOpenTag: Spry.Data.Region.PI.buildOpenTag, getCloseTag: Spry.Data.Region.PI.buildCloseTag };
Spry.Data.Region.PI.instructions["spry:when"] = { tagName: "spry:when", childrenOnly: false, getOpenTag: Spry.Data.Region.PI.buildOpenTagForTest, getCloseTag: Spry.Data.Region.PI.buildCloseTag };
Spry.Data.Region.PI.instructions["spry:default"] = { tagName: "spry:default", childrenOnly: false, getOpenTag: Spry.Data.Region.PI.buildOpenTag, getCloseTag: Spry.Data.Region.PI.buildCloseTag };
Spry.Data.Region.PI.instructions["spry:content"] = { tagName: "spry:content", childrenOnly: true, getOpenTag: Spry.Data.Region.PI.buildOpenTagForContent, getCloseTag: Spry.Data.Region.PI.buildCloseTag };

Spry.Data.Region.PI.orderedInstructions = [ "spry:state", "spry:if", "spry:repeat", "spry:repeatchildren", "spry:choose", "spry:when", "spry:default", "spry:content" ];

Spry.Data.Region.getTokensFromStr = function(str)
{
	// XXX: This will need to be modified if we support
	// tokens that use javascript between the braces!
	if (!str)
		return null;
	return str.match(/{[^}]+}/g);
};

Spry.Data.Region.processDataRefString = function(processingContext, regionStr, dataSetsToUse, isJSExpr)
{
	if (!regionStr)
		return "";

	if (!processingContext && !dataSetsToUse)
		return regionStr;

	var resultStr = "";
	var re = new RegExp("\\{([^\\}:]+::)?[^\\}]+\\}", "g");
	var startSearchIndex = 0;

	while (startSearchIndex < regionStr.length)
	{
		var reArray = re.exec(regionStr);
		if (!reArray || !reArray[0])
		{
			resultStr += regionStr.substr(startSearchIndex, regionStr.length - startSearchIndex);
			return resultStr;
		}

		if (reArray.index != startSearchIndex)
			resultStr += regionStr.substr(startSearchIndex, reArray.index - startSearchIndex);

		var dsName = "";
		if (reArray[0].search(/^\{[^}:]+::/) != -1)
			dsName = reArray[0].replace(/^\{|::.*/g, "");

		var fieldName = reArray[0].replace(/^\{|.*::|\}/g, "");
		var row = null;

		if (processingContext)
		{
			var dsContext = processingContext.getDataSetContext(dsName);

			if (fieldName == "ds_RowNumber")
			{
				resultStr += dsContext.getRowIndex();
				row = null;
			}
			else if (fieldName == "ds_RowNumberPlus1")
			{
				resultStr += (dsContext.getRowIndex() + 1);
				row = null;
			}
			else if (fieldName == "ds_RowCount")
			{
				resultStr += dsContext.getNumRows();
				row = null;
			}
			else if (fieldName == "ds_UnfilteredRowCount")
			{
				resultStr += dsContext.getNumRows(true);
				row = null;
			}
			else if (fieldName == "ds_CurrentRowNumber")
			{
				var ds = dsContext.getDataSet();
				resultStr += ds.getRowNumber(ds.getCurrentRow());
				row = null;
			}
			else if (fieldName == "ds_CurrentRowID")
			{
				var ds = dsContext.getDataSet();
				resultStr += "" + ds.getCurrentRowID();
				row = null;
			}
			else if (fieldName == "ds_EvenOddRow")
			{
				resultStr += (dsContext.getRowIndex() % 2) ? Spry.Data.Region.evenRowClassName : Spry.Data.Region.oddRowClassName;
				row = null;
			}
			else if (fieldName == "ds_SortOrder")
			{
				resultStr += dsContext.getDataSet().getSortOrder();
				row = null;
			}
			else if (fieldName == "ds_SortColumn")
			{
				resultStr += dsContext.getDataSet().getSortColumn();
				row = null;
			}
			else
				row = processingContext.getCurrentRowForDataSet(dsName);
		}
		else
		{
			var ds = dsName ? dataSetsToUse[dsName] : dataSetsToUse[0];
			if (ds)
				row = ds.getCurrentRow();
		}

		if (row)
			resultStr += isJSExpr ? Spry.Utils.escapeQuotesAndLineBreaks("" + row[fieldName]) : row[fieldName];

		if (startSearchIndex == re.lastIndex)
		{
			// On IE if there was a match near the end of the string, it sometimes
			// leaves re.lastIndex pointing to the value it had before the last time
			// we called re.exec. We check for this case to prevent an infinite loop!
			// We need to write out any text in regionStr that comes after the last
			// match.

			var leftOverIndex = reArray.index + reArray[0].length;
			if (leftOverIndex < regionStr.length)
				resultStr += regionStr.substr(leftOverIndex);

			break;
		}

		startSearchIndex = re.lastIndex;
	}

	return resultStr;
};

Spry.Data.Region.strToDataSetsArray = function(str, returnRegionNames)
{
	var dataSetsArr = new Array;
	var foundHash = {};

	if (!str)
		return dataSetsArr;

	str = str.replace(/\s+/g, " ");
	str = str.replace(/^\s|\s$/g, "");
	var arr = str.split(/ /);


	for (var i = 0; i < arr.length; i++)
	{
		if (arr[i] && !Spry.Data.Region.PI.instructions[arr[i]])
		{
			try {
				var dataSet = eval(arr[i]);

				if (!foundHash[arr[i]])
				{
					if (returnRegionNames)
						dataSetsArr.push(arr[i]);
					else
						dataSetsArr.push(dataSet);
					foundHash[arr[i]] = true;
				}
			}
			catch (e) { /* Spry.Debug.trace("Caught exception: " + e + "\n"); */ }
		}
	}

	return dataSetsArr;
};

Spry.Data.Region.DSContext = function(dataSet, processingContext)
{
	var m_dataSet = dataSet;
	var m_processingContext = processingContext;
	var m_curRowIndexArray = [ { rowIndex: -1 } ]; // -1 means return whatever the current row is inside the data set.
	var m_parent = null;
	var m_children = [];

	// Private Methods:

	function getInternalRowIndex() { return m_curRowIndexArray[m_curRowIndexArray.length - 1].rowIndex; }

	// Public Methods:
	this.resetAll = function() { m_curRowIndexArray = [ { rowIndex: m_dataSet.getCurrentRow() } ] };
	this.getDataSet = function() { return m_dataSet; };
	this.getNumRows = function(unfiltered)
	{
		var data = this.getCurrentState().data;
		return data ? data.length : m_dataSet.getRowCount(unfiltered);
	};
	this.getData = function()
	{
		var data = this.getCurrentState().data;
		return data ? data : m_dataSet.getData();
	};
	this.setData = function(data)
	{
		this.getCurrentState().data = data;
	}
	this.getCurrentRow = function()
	{
		if (m_curRowIndexArray.length < 2 || getInternalRowIndex() < 0)
			return m_dataSet.getCurrentRow();

		var data = this.getData();
		var curRowIndex = getInternalRowIndex();

		if (curRowIndex < 0 || curRowIndex > data.length)
		{
			Spry.Debug.reportError("Invalid index used in Spry.Data.Region.DSContext.getCurrentRow()!\n");
			return null;
		}

		return data[curRowIndex];
	};
	this.getRowIndex = function()
	{
		var curRowIndex = getInternalRowIndex();
		if (curRowIndex >= 0)
			return curRowIndex;

		return m_dataSet.getRowNumber(m_dataSet.getCurrentRow());
	};
	this.setRowIndex = function(rowIndex)
	{
		this.getCurrentState().rowIndex = rowIndex;

		var data = this.getData();
		var numChildren = m_children.length;
		for (var i = 0; i < numChildren; i++)
			m_children[i].syncDataWithParentRow(this, rowIndex, data);
	};
	this.syncDataWithParentRow = function(parentDSContext, rowIndex, parentData)
	{
		var row = parentData[rowIndex];
		if (row)
		{
			nestedDS = m_dataSet.getNestedDataSetForParentRow(row);
			if (nestedDS)
			{
				var currentState = this.getCurrentState();
				currentState.data = nestedDS.getData();
				currentState.rowIndex = nestedDS.getCurrentRowNumber();

				var numChildren = m_children.length;
				for (var i = 0; i < numChildren; i++)
					m_children[i].syncDataWithParentRow(this, currentState.rowIndex, currentState.data);
			}
		}
	};
	this.pushState = function()
	{
		var curState = this.getCurrentState();
		var newState = new Object;
		newState.rowIndex = curState.rowIndex;
		newState.data = curState.data;

		m_curRowIndexArray.push(newState);

		var numChildren = m_children.length;
		for (var i = 0; i < numChildren; i++)
			m_children[i].pushState();
	};
	this.popState = function()
	{
		if (m_curRowIndexArray.length < 2)
		{
			// Our array should always have at least one element in it!
			Spry.Debug.reportError("Stack underflow in Spry.Data.Region.DSContext.popState()!\n");
			return;
		}

		var numChildren = m_children.length;
		for (var i = 0; i < numChildren; i++)
			m_children[i].popState();

		m_curRowIndexArray.pop();
	};
	this.getCurrentState = function()
	{
		return m_curRowIndexArray[m_curRowIndexArray.length - 1];
	};
	this.addChild = function(childDSContext)
	{
		var numChildren = m_children.length;
		for (var i = 0; i < numChildren; i++)
		{
			if (m_children[i] == childDSContext)
				return;
		}
		m_children.push(childDSContext);
	};
};

Spry.Data.Region.ProcessingContext = function(region)
{
	this.region = region;
	this.dataSetContexts = [];

	if (region && region.dataSets)
	{
		// Run through each data set in the list and check to see if we need
		// to add its parent to the list of data sets we track.
		var dsArray = region.dataSets.slice(0);
		var dsArrayLen = dsArray.length;
		for (var i = 0; i < dsArrayLen; i++)
		{
			var ds = region.dataSets[i];
			while (ds && ds.getParentDataSet)
			{
				var doesExist = false;
				ds = ds.getParentDataSet();
				if (ds && this.indexOf(dsArray, ds) == -1)
					dsArray.push(ds);
			}
		}

		// Create a data set context for every data set in our list.

		for (i = 0; i < dsArray.length; i++)
			this.dataSetContexts.push(new Spry.Data.Region.DSContext(dsArray[i], this));

		// Now run through the list of data set contexts and wire up the parent/child
		// relationships so that notifications get dispatched as expected.

		var dsContexts = this.dataSetContexts;
		var numDSContexts = dsContexts.length;

		for (i = 0; i < numDSContexts; i++)
		{
			var dsc = dsContexts[i];
			var ds = dsc.getDataSet();
			if (ds.getParentDataSet)
			{
				var parentDS = ds.getParentDataSet();
				if (parentDS)
				{
					var pdsc = this.getDataSetContext(parentDS);
					if (pdsc) pdsc.addChild(dsc);
				}
			}
		}
	}
};

Spry.Data.Region.ProcessingContext.prototype.indexOf = function(arr, item)
{
	// Given an array, return the index of item in that array
	// or -1 if it doesn't exist.

	if (arr)
	{
		var arrLen = arr.length;
		for (var i = 0; i < arrLen; i++)
			if (arr[i] == item)
				return i;
	}
	return -1;
};

Spry.Data.Region.ProcessingContext.prototype.getDataSetContext = function(dataSet)
{
	if (!dataSet)
	{
		// We were called without a specified data set or
		// data set name. Assume the caller wants the first
		// data set in the processing context.

		if (this.dataSetContexts.length > 0)
			return this.dataSetContexts[0];
		return null;
	}

	if (typeof dataSet == 'string')
	{
		try { dataSet = eval(dataSet); } catch (e) { dataSet = null; }
		if (!dataSet)
			return null;
	}

	for (var i = 0; i < this.dataSetContexts.length; i++)
	{
		var dsc = this.dataSetContexts[i];
		if (dsc.getDataSet() == dataSet)
			return dsc;
	}

	return null;
};

Spry.Data.Region.ProcessingContext.prototype.getCurrentRowForDataSet = function(dataSet)
{
	var dsc = this.getDataSetContext(dataSet);
	if (dsc)
		return dsc.getCurrentRow();
	return null;
};

Spry.Data.Region.Token = function(tokenType, dataSet, data, regionStr)
{
	var self = this;
	this.tokenType = tokenType;
	this.dataSet = dataSet;
	this.data = data;
	this.regionStr = regionStr;
	this.parent = null;
	this.children = null;
};

Spry.Data.Region.Token.prototype.addChild = function(child)
{
	if (!child)
		return;

	if (!this.children)
		this.children = new Array;

	this.children.push(child);
	child.parent = this;
};

Spry.Data.Region.Token.LIST_TOKEN                   = 0;
Spry.Data.Region.Token.STRING_TOKEN                 = 1;
Spry.Data.Region.Token.PROCESSING_INSTRUCTION_TOKEN = 2;
Spry.Data.Region.Token.VALUE_TOKEN                  = 3;

Spry.Data.Region.Token.PIData = function(piName, data, jsExpr, regionState)
{
	var self = this;
	this.name = piName;
	this.data = data;
	this.jsExpr = jsExpr;
	this.regionState = regionState;
};

Spry.Utils.addLoadListener(function() { setTimeout(function() { Spry.Data.initRegions(); }, 0); });
