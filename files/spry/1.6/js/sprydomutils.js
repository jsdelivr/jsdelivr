// SpryDOMUtils.js - version 0.6 - Spry Pre-Release 1.6
//
// Copyright (c) 2007. Adobe Systems Incorporated.
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

var Spry; if (!Spry) Spry = {}; if (!Spry.Utils) Spry.Utils = {};

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

//////////////////////////////////////////////////////////////////////
//
// DOM Utils
//
//////////////////////////////////////////////////////////////////////

Spry.Utils.setAttribute = function(ele, name, value)
{
	ele = Spry.$(ele);
	if (!ele || !name)
		return;

	// IE doesn't allow you to set the "class" attribute. You
	// have to set the className property instead.

	if (name == "class")
		ele.className = value;
	else
		ele.setAttribute(name, value);
};

Spry.Utils.removeAttribute = function(ele, name)
{
	ele = Spry.$(ele);
	if (!ele || !name)
		return;

	try
	{
		ele.removeAttribute(name);

		// IE doesn't allow you to remove the "class" attribute.
		// It requires you to remove "className" instead, so go
		// ahead and try to remove that too.
		//
		// XXX: We should add a check for IE here instead of doing
		// it for every browser.

		if (name == "class")
			ele.removeAttribute("className");
	} catch(e) {}
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
	if (Spry.Utils.hasClassName(ele, className))
		ele.className = ele.className.replace(new RegExp("\\s*\\b" + className + "\\b", "g"), "");
};

Spry.Utils.toggleClassName = function(ele, className)
{
	if (Spry.Utils.hasClassName(ele, className))
		Spry.Utils.removeClassName(ele, className);
	else
		Spry.Utils.addClassName(ele, className);
};

Spry.Utils.hasClassName = function(ele, className)
{
	ele = Spry.$(ele);
	if (!ele || !className || !ele.className || ele.className.search(new RegExp("\\b" + className + "\\b")) == -1)
		return false;
	return true;
};

Spry.Utils.camelizeString = function(str)
{
	var cStr = "";
	var a = str.split("-");
	for (var i = 0; i < a.length; i++)
	{
		var s = a[i];
		if (s)
			cStr = cStr ? (cStr + s.charAt(0).toUpperCase() + s.substring(1)) : s;
	}
	return cStr;
};

Spry.Utils.styleStringToObject = function(styleStr)
{
	var o = {};
	if (styleStr)
	{
		pvA = styleStr.split(";");
		for (var i = 0; i < pvA.length; i++)
		{
			var pv = pvA[i];
			if (pv && pv.indexOf(":") != -1)
			{
				var nvA = pv.split(":");
				var n = nvA[0].replace(/^\s*|\s*$/g, "");			
				var v = nvA[1].replace(/^\s*|\s*$/g, "");
				if (n && v)
					o[Spry.Utils.camelizeString(n)] = v;
			}
		}
	}
	return o;
};

Spry.Utils.addEventListener = function(element, eventType, handler, capture)
{
	try
	{
		if (!Spry.Utils.eventListenerIsBoundToElement(element, eventType, handler, capture))
		{
			element = Spry.$(element);
			handler = Spry.Utils.bindEventListenerToElement(element, eventType, handler, capture);
			if (element.addEventListener)
				element.addEventListener(eventType, handler, capture);
			else if (element.attachEvent)
				element.attachEvent("on" + eventType, handler);
		}
	}
	catch (e) {}
};

Spry.Utils.removeEventListener = function(element, eventType, handler, capture)
{
	try
	{
			element = Spry.$(element);
			handler = Spry.Utils.unbindEventListenerFromElement(element, eventType, handler, capture);
			if (element.removeEventListener)
				element.removeEventListener(eventType, handler, capture);
			else if (element.detachEvent)
				element.detachEvent("on" + eventType, handler);
	}
	catch (e) {}
};

Spry.Utils.eventListenerHash = {};
Spry.Utils.nextEventListenerID = 1;

Spry.Utils.getHashForElementAndHandler = function(element, eventType, handler, capture)
{
	var hash = null;
	element = Spry.$(element);
	if (element)
	{
		if (typeof element.spryEventListenerID == "undefined")
			element.spryEventListenerID = "e" + (Spry.Utils.nextEventListenerID++);
		if (typeof handler.spryEventHandlerID == "undefined")
			handler.spryEventHandlerID = "h" + (Spry.Utils.nextEventListenerID++);	
		hash = element.spryEventListenerID + "-" + handler.spryEventHandlerID + "-" + eventType + (capture?"-capture":"");
	}
	return hash;
};

Spry.Utils.eventListenerIsBoundToElement = function(element, eventType, handler, capture)
{
	element = Spry.$(element);
	var hash = Spry.Utils.getHashForElementAndHandler(element, eventType, handler, capture);
	return Spry.Utils.eventListenerHash[hash] != undefined;
};

Spry.Utils.bindEventListenerToElement = function(element, eventType, handler, capture)
{
	element = Spry.$(element);
	var hash = Spry.Utils.getHashForElementAndHandler(element, eventType, handler, capture);
	if (Spry.Utils.eventListenerHash[hash])
		return Spry.Utils.eventListenerHash[hash];
	return Spry.Utils.eventListenerHash[hash] = function(e)
	{
		e = e || window.event;

		if (!e.preventDefault) e.preventDefault = function() { this.returnValue = false; };
		if (!e.stopPropagation) e.stopPropagation = function() { this.cancelBubble = true; };

		var result = handler.call(element, e);
		if (result == false)
		{
			e.preventDefault();
			e.stopPropagation();
		}
		return result;
	};
};

Spry.Utils.unbindEventListenerFromElement = function(element, eventType, handler, capture)
{
	element = Spry.$(element);
	var hash = Spry.Utils.getHashForElementAndHandler(element, eventType, handler, capture);
	if (Spry.Utils.eventListenerHash[hash])
	{
		handler = Spry.Utils.eventListenerHash[hash];
		Spry.Utils.eventListenerHash[hash] = undefined;
	}
	return handler;
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

Spry.Utils.getAncestor = function(ele, selector)
{
	ele = Spry.$(ele);
	if (ele)
	{
		var s = Spry.$$.tokenizeSequence(selector ? selector : "*")[0];
		var t = s ? s[0] : null;
		if (t)
		{
			var p = ele.parentNode;
			while (p)
			{
				if (t.match(p))
					return p;
				p = p.parentNode;
			}
		}
	}
	return null;
};

//////////////////////////////////////////////////////////////////////
//
// CSS Selector Matching
//
//////////////////////////////////////////////////////////////////////

Spry.$$ = function(selectorSequence, rootNode)
{
	if (!rootNode)
		rootNode = document;
	else
		rootNode = Spry.$(rootNode);

	var sequences = Spry.$$.tokenizeSequence(selectorSequence);

	var matches = [];
	Spry.$$.addExtensions(matches);
	++Spry.$$.queryID;

	var nid = 0;
	var ns = sequences.length;
	for (var i = 0; i < ns; i++)
	{
		var m = Spry.$$.processTokens(sequences[i], rootNode);
		var nm = m.length;
		for (var j = 0; j < nm; j++)
		{
			var n = m[j];
			if (!n.spry$$ID)
			{
				n.spry$$ID = ++nid;
				matches.push(n);
			}
		}
	}

	var nm = matches.length;
	for (i = 0; i < nm; i++)
		matches[i].spry$$ID = undefined;

	return matches;
};

Spry.$$.cache = {};
Spry.$$.queryID = 0;

Spry.$$.Token = function()
{
	this.type = Spry.$$.Token.SELECTOR;
	this.name = "*";
	this.id = "";
	this.classes = [];
	this.attrs = [];
	this.pseudos = [];
};

Spry.$$.Token.Attr = function(n, v)
{
	this.name = n;
	this.value = v ? new RegExp(v) : undefined;
};

Spry.$$.Token.PseudoClass = function(pstr)
{
	this.name = pstr.replace(/\(.*/, "");
	this.arg = pstr.replace(/^[^\(\)]*\(?\s*|\)\s*$/g, "");
	this.func = Spry.$$.pseudoFuncs[this.name];
};

Spry.$$.Token.SELECTOR = 0;
Spry.$$.Token.COMBINATOR = 1;

Spry.$$.Token.prototype.match = function(ele, nameAlreadyMatches)
{
	if (this.type == Spry.$$.Token.COMBINATOR)
		return false;
	if (!nameAlreadyMatches && this.name != '*' && this.name != ele.nodeName.toLowerCase())
		return false;
	if (this.id && this.id != ele.id)
		return false;
	var classes = this.classes;
	var len = classes.length;
	for (var i = 0; i < len; i++)
	{
		if (!ele.className || !classes[i].value.test(ele.className))
			return false;
	}

	var attrs = this.attrs;
	len = attrs.length;
	for (var i = 0; i < len; i++)
	{
		var a = attrs[i];
		var an = ele.attributes.getNamedItem(a.name);
		if (!an || (!a.value && an.nodeValue == undefined) || (a.value && !a.value.test(an.nodeValue)))
			return false;
	}

	var ps = this.pseudos;
	var len = ps.length;
	for (var i = 0; i < len; i++)
	{
		var p = ps[i];
		if (p && p.func && !p.func(p.arg, ele, this))
			return false;
	}

	return true;
};

Spry.$$.Token.prototype.getNodeNameIfTypeMatches = function(ele)
{
	var nodeName = ele.nodeName.toLowerCase();
	if (this.name != '*')
	{
		if (this.name != nodeName)
			return null;
		return this.name;
	}
	return nodeName;
};

Spry.$$.escapeRegExpCharsRE = /\/|\.|\*|\+|\(|\)|\[|\]|\{|\}|\\|\|/g;

Spry.$$.tokenizeSequence = function(s)
{
	var cc = Spry.$$.cache[s];
	if (cc) return cc;

	// Attribute Selector: /(\[[^\"'~\^\$\*\|\]=]+([~\^\$\*\|]?=\s*('[^']*'|"[^"]*"|[^"'\]]+))?\s*\])/g
	// Simple Selector:    /((:[^\.#:\s,>~\+\[\]]+\(([^\(\)]+|\([^\(\)]*\))*\))|[\.#:]?[^\.#:\s,>~\+\[\]]+)/g
	// Combinator:         /(\s*[\s,>~\+]\s*)/g

	var tokenExpr = /(\[[^\"'~\^\$\*\|\]=]+([~\^\$\*\|]?=\s*('[^']*'|"[^"]*"|[^"'\]]+))?\s*\])|((:[^\.#:\s,>~\+\[\]]+\(([^\(\)]+|\([^\(\)]*\))*\))|[\.#:]?[^\.#:\s,>~\+\[\]]+)|(\s*[\s,>~\+]\s*)/g;

	var tkn = new Spry.$$.Token;
	var sequence = [];
	sequence.push(tkn);
	var tokenSequences = [];
	tokenSequences.push(sequence);

	s = s.replace(/^\s*|\s*$/, "");

	var expMatch = tokenExpr.exec(s);
	while (expMatch)
	{
		var tstr = expMatch[0];
		var c = tstr.charAt(0);
		switch (c)
		{
			case '.':
				tkn.classes.push(new Spry.$$.Token.Attr("class", "\\b" + tstr.substr(1) + "\\b"));
				break;
			case '#':
				tkn.id = tstr.substr(1);
				break;
			case ':':
				tkn.pseudos.push(new Spry.$$.Token.PseudoClass(tstr));
				break;
			case '[':
				var attrComps = tstr.match(/\[([^\"'~\^\$\*\|\]=]+)(([~\^\$\*\|]?=)\s*('[^']*'|"[^"]*"|[^"'\]]+))?\s*\]/);
				var name = attrComps[1];				
				var matchType = attrComps[3];
				var val = attrComps[4];
				if (val)
				{
					val = val.replace(/^['"]|['"]$/g, "");
					val = val.replace(Spry.$$.escapeRegExpCharsRE, '\\$&');
				}

				var matchStr = undefined;

				switch(matchType)
				{
					case "=":
						matchStr = "^" + val + "$";
						break;
					case "^=":
						matchStr = "^" + val;
						break;
					case "$=":
						matchStr = val + "$";
						break;
					case "~=":
					case "|=":
						matchStr = "\\b" + val + "\\b";
						break;
					case "*=":
						matchStr = val;
						break;
				}

				tkn.attrs.push(new Spry.$$.Token.Attr(name, matchStr));
				break;
			default:
				var combiMatch = tstr.match(/^\s*([\s,~>\+])\s*$/);
				if (combiMatch)
				{
					if (combiMatch[1] == ',')
					{
						sequence = new Array;
						tokenSequences.push(sequence);
						tkn = new Spry.$$.Token;
						sequence.push(tkn);
					}
					else
					{
						tkn = new Spry.$$.Token;
						tkn.type = Spry.$$.Token.COMBINATOR;
						tkn.name = combiMatch[1];
						sequence.push(tkn);
						tkn = new Spry.$$.Token();
						sequence.push(tkn);
					}
				}
				else
					tkn.name = tstr.toLowerCase();
				break;
		}
		expMatch = tokenExpr.exec(s);
	}

	Spry.$$.cache[s] = tokenSequences;

	return tokenSequences;
};

Spry.$$.combinatorFuncs = {
	// Element Descendant

	" ": function(nodes, token)
	{
		var uid = ++Spry.$$.uniqueID;
		var results = [];
		var nn = nodes.length;
		for (var i = 0; i < nn; i++)
		{
			var n = nodes[i];
			if (uid != n.spry$$uid)
			{
				// n.spry$$uid = uid;
				var ea = nodes[i].getElementsByTagName(token.name);
				var ne = ea.length;
				for (var j = 0; j < ne; j++)
				{
					var e = ea[j];
					if (token.match(e, true))
						results.push(e);
					e.spry$$uid = uid;
				}
			}
		}
		return results;
	},

	// Element Child

	">": function(nodes, token)
	{
		var results = [];
		var nn = nodes.length;
		for (var i = 0; i < nn; i++)
		{
			var n = nodes[i].firstChild;
			while (n)
			{
				if (n.nodeType == 1 /* Node.ELEMENT_NODE */ && token.match(n))
					results.push(n);
				n = n.nextSibling;
			}
		}
		return results;
	},

	// Element Immediately Preceded By

	"+": function(nodes, token)
	{
		var results = [];
		var nn = nodes.length;
		for (var i = 0; i < nn; i++)
		{
			var n = nodes[i].nextSibling;
			while (n && n.nodeType != 1 /* Node.ELEMENT_NODE */)
				n = n.nextSibling;
			if (n && token.match(n))
				results.push(n);
		}
		return results;
	},

	// Element Preceded By

	"~": function(nodes, token)
	{
		var uid = ++Spry.$$.uniqueID;
		var results = [];
		var nn = nodes.length;
		for (var i = 0; i < nn; i++)
		{
			var n = nodes[i].nextSibling;
			while (n)
			{
				if (n.nodeType == 1 /* Node.ELEMENT_NODE */)
				{
					if (uid == n.spry$$uid)
						break;

					if (token.match(n))
					{
						results.push(n);
						n.spry$$uid = uid;
					}
				}
				n = n.nextSibling;
			}
		}
		return results;
	}
};

Spry.$$.uniqueID = 0;

Spry.$$.pseudoFuncs = {
	":first-child": function(arg, node, token)
	{
		var n = node.previousSibling;
		while (n)
		{
			if (n.nodeType == 1) return false; // Node.ELEMENT_NODE
			n = n.previousSibling;
		}

		return true;
	},

	":last-child": function(arg, node, token)
	{
		var n = node.nextSibling;
		while (n)
		{
			if (n.nodeType == 1) // Node.ELEMENT_NODE
				return false;
			n = n.nextSibling;
		}
		return true;
	},

	":empty": function(arg, node, token)
	{
		var n = node.firstChild;
		while (n)
		{
			switch(n.nodeType)
			{
				case 1: // Node.ELEMENT_NODE
				case 3: // Node.TEXT_NODE
				case 4: // Node.CDATA_NODE
				case 5: // Node.ENTITY_REFERENCE_NODE
					return false;
			}
			n = n.nextSibling;
		}
		return true;
	},

	":nth-child": function(arg, node, token)
	{
		return Spry.$$.nthChild(arg, node, token);
	},

	":nth-last-child": function(arg, node, token)
	{
		return Spry.$$.nthChild(arg, node, token, true);
	},

	":nth-of-type": function(arg, node, token)
	{
		return Spry.$$.nthChild(arg, node, token, false, true);
	},
	
	":nth-last-of-type": function(arg, node, token)
	{
		return Spry.$$.nthChild(arg, node, token, true, true);
	},
	
	":first-of-type": function(arg, node, token)
	{
		var nodeName = token.getNodeNameIfTypeMatches(node);
		if (!nodeName) return false;

		var n = node.previousSibling;
		while (n)
		{
			if (n.nodeType == 1 && nodeName == n.nodeName.toLowerCase()) return false; // Node.ELEMENT_NODE
			n = n.previousSibling;
		}

		return true;
	},

	":last-of-type": function(arg, node, token)
	{
		var nodeName = token.getNodeNameIfTypeMatches(node);
		if (!nodeName) return false;

		var n = node.nextSibling;
		while (n)
		{
			if (n.nodeType == 1 && nodeName == n.nodeName.toLowerCase()) // Node.ELEMENT_NODE
				return false;
			n = n.nextSibling;
		}
		return true;
	},

	":only-child": function(arg, node, token)
	{
		var f = Spry.$$.pseudoFuncs;
		return f[":first-child"](arg, node, token) && f[":last-child"](arg, node, token);
	},

	":only-of-type": function(arg, node, token)
	{
		var f = Spry.$$.pseudoFuncs;
		return f[":first-of-type"](arg, node, token) && f[":last-of-type"](arg, node, token);
	},

	":not": function(arg, node, token)
	{
		var s = Spry.$$.tokenizeSequence(arg)[0];
		var t = s ? s[0] : null;
		return !t || !t.match(node);
	},

	":enabled": function(arg, node, token)
	{
		return !node.disabled;
	},

	":disabled": function(arg, node, token)
	{
		return node.disabled;
	},

	":checked": function(arg, node, token)
	{
		return node.checked;
	},

	":root": function(arg, node, token)
	{
		return node.parentNode && node.ownerDocument && node.parentNode == node.ownerDocument;
	}
};

Spry.$$.nthRegExp = /((-|[0-9]+)?n)?([+-]?[0-9]*)/;

Spry.$$.nthCache = {
	  "even": { a: 2, b: 0, mode: 1, invalid: false }
	, "odd":  { a: 2, b: 1, mode: 1, invalid: false }
	, "2n":   { a: 2, b: 0, mode: 1, invalid: false }
	, "2n+1": { a: 2, b: 1, mode: 1, invalid: false }
};

Spry.$$.parseNthChildString = function(str)
{
	var o = Spry.$$.nthCache[str];
	if (!o)
	{
		var m = str.match(Spry.$$.nthRegExp);
		var n = m[1];
		var a = m[2];
		var b = m[3];

		if (!a)
		{
			// An 'a' value was not specified. Was there an 'n' present?
			// If so, we treat it as an increment of 1, otherwise we're
			// in no-repeat mode.

			a = n ? 1 : 0;
		}
		else if (a == "-")
		{
			// The string is using the "-n" short-hand which is
			// short for -1.

			a = -1;
		}
		else
		{
			// An integer repeat value for 'a' was specified. Convert
			// it into number.

			a = parseInt(a, 10);
		}

		// If a 'b' value was specified, turn it into a number.
		// If no 'b' value was specified, default to zero.

		b = b ? parseInt(b, 10) : 0;

		// Figure out the mode:
		//
		// -1 - repeat backwards
		//  0 - no repeat
		//  1 - repeat forwards

		var mode = (a == 0) ? 0 : ((a > 0) ? 1 : -1);
		var invalid = false;

		// Fix up 'a' and 'b' for proper repeating.

		if (a > 0 && b < 0)
		{
			b = b % a;
			b = ((b=(b%a)) < 0) ? a + b : b;
		}
		else if (a < 0)
		{
			if (b < 0)
				invalid = true;
			else
				a = Math.abs(a);
		}

		o = new Object;
		o.a = a;
		o.b = b;
		o.mode = mode;
		o.invalid = invalid;

		Spry.$$.nthCache[str] = o;
	}

	return o;
};

Spry.$$.nthChild = function(arg, node, token, fromLastSib, matchNodeName)
{
	if (matchNodeName)
	{
		var nodeName = token.getNodeNameIfTypeMatches(node);
		if (!nodeName) return false;
	}

	var o = Spry.$$.parseNthChildString(arg);

	if (o.invalid)
		return false;

	var qidProp = "spry$$ncQueryID";
	var posProp = "spry$$ncPos";
	var countProp = "spry$$ncCount";
	if (matchNodeName)
	{
		qidProp += nodeName;
		posProp += nodeName;
		countProp += nodeName;
	}

	var parent = node.parentNode;
	if (parent[qidProp] != Spry.$$.queryID)
	{
		var pos = 0;
		parent[qidProp] = Spry.$$.queryID;
		var c = parent.firstChild;
		while (c)
		{
			if (c.nodeType == 1 && (!matchNodeName || nodeName == c.nodeName.toLowerCase()))
				c[posProp] = ++pos;
			c = c.nextSibling;
		}
		parent[countProp] = pos;
	}

	pos = node[posProp];
	if (fromLastSib)
		pos = parent[countProp] - pos + 1;

/*
	var sib = fromLastSib ? "nextSibling" : "previousSibling";

	var pos = 1;
	var n = node[sib];
	while (n)
	{
		if (n.nodeType == 1 && (!matchNodeName || nodeName == n.nodeName.toLowerCase()))
		{
			if (n == node) break;
			++pos;
		}
		n = n[sib];
	}
*/

	if (o.mode == 0) // Exact match
		return pos == o.b;
	if (o.mode > 0) // Forward Repeat
		return (pos < o.b) ? false : (!((pos - o.b) % o.a));
	return (pos > o.b) ? false : (!((o.b - pos) % o.a)); // Backward Repeat
};

Spry.$$.processTokens = function(tokens, root)
{
	var numTokens = tokens.length;
	var nodeSet = [ root ];
	var combiFunc = null;

	for (var i = 0; i < numTokens && nodeSet.length > 0; i++)
	{
		var t = tokens[i];
		if (t.type == Spry.$$.Token.SELECTOR)
		{
			if (combiFunc)
			{
				nodeSet = combiFunc(nodeSet, t);
				combiFunc = null;
			}
			else
				nodeSet = Spry.$$.getMatchingElements(nodeSet, t);
		}
		else // Spry.$$.Token.COMBINATOR
			combiFunc = Spry.$$.combinatorFuncs[t.name];
	}
	return nodeSet;
};

Spry.$$.getMatchingElements = function(nodes, token)
{
	var results = [];
	if (token.id)
	{
		n = nodes[0];
		if (n && n.ownerDocument)
		{
			var e = n.ownerDocument.getElementById(token.id);
			if (e)
			{
				// XXX: We need to make sure that the element
				//      we found is actually underneath the root
				//      we were given!

				if (token.match(e))
					results.push(e);
			}
			return results;
		}
	}

	var nn = nodes.length;
	for (var i = 0; i < nn; i++)
	{
		var n = nodes[i];
		// if (token.match(n)) results.push(n);
		
		var ea = n.getElementsByTagName(token.name);
		var ne = ea.length;
		for (var j = 0; j < ne; j++)
		{
			var e = ea[j];
			if (token.match(e, true))
				results.push(e);
		}
	}
	return results;
};

/*
Spry.$$.dumpSequences = function(sequences)
{
	Spry.Debug.trace("<hr />Number of Sequences: " + sequences.length);
	for (var i = 0; i < sequences.length; i++)
	{
		var str = "";
		var s = sequences[i];
		Spry.Debug.trace("<hr />Sequence " + i + " -- Tokens: " + s.length);
		for (var j = 0; j < s.length; j++)
		{
			var t = s[j];
			if (t.type == Spry.$$.Token.SELECTOR)
			{
				str += "  SELECTOR:\n    Name: " + t.name + "\n    ID: " + t.id + "\n    Attrs:\n";
				for (var k = 0; k < t.classes.length; k++)
					str += "      " + t.classes[k].name + ": " + t.classes[k].value + "\n";
				for (var k = 0; k < t.attrs.length; k++)
					str += "      " + t.attrs[k].name + ": " + t.attrs[k].value + "\n";
				str += "    Pseudos:\n";
				for (var k = 0; k < t.pseudos.length; k++)
					str += "      " + t.pseudos[k].name + (t.pseudos[k].arg ? "(" + t.pseudos[k].arg + ")" : "") + "\n";
			}
			else
			{
				str += "  COMBINATOR:\n    Name: '" + t.name + "'\n"; 
			}
		}
		Spry.Debug.trace("<pre>" + Spry.Utils.encodeEntities(str) + "</pre>");
	}
};
*/

Spry.$$.addExtensions = function(a)
{
	for (var f in Spry.$$.Results)
		a[f] = Spry.$$.Results[f];
};

Spry.$$.Results = {};

Spry.$$.Results.forEach = function(func)
{
	var n = this.length;
	for (var i = 0; i < n; i++)
		func(this[i]);
	return this;
};

Spry.$$.Results.setAttribute = function(name, value)
{
	return this.forEach(function(n) { Spry.Utils.setAttribute(n, name, value); });
};

Spry.$$.Results.removeAttribute = function(name)
{
	return this.forEach(function(n) { Spry.Utils.removeAttribute(n, name); });
};

Spry.$$.Results.addClassName = function(className)
{
	return this.forEach(function(n) { Spry.Utils.addClassName(n, className); });
};

Spry.$$.Results.removeClassName = function(className)
{
	return this.forEach(function(n) { Spry.Utils.removeClassName(n, className); });
};

Spry.$$.Results.toggleClassName = function(className)
{
	return this.forEach(function(n) { Spry.Utils.toggleClassName(n, className); });
};

Spry.$$.Results.addEventListener = function(eventType, handler, capture, bindHandler)
{
	return this.forEach(function(n) { Spry.Utils.addEventListener(n, eventType, handler, capture, bindHandler); });
};

Spry.$$.Results.removeEventListener = function(eventType, handler, capture)
{
	return this.forEach(function(n) { Spry.Utils.removeEventListener(n, eventType, handler, capture); });
};

Spry.$$.Results.setStyle = function(style)
{
	if (style)
	{
		style = Spry.Utils.styleStringToObject(style);
		this.forEach(function(n)
		{
			for (var p in style)
				try { n.style[p] = style[p]; } catch (e) {}
		});
	}
	return this;
};

Spry.$$.Results.setProperty = function(prop, value)
{
	if (prop)
	{
		if (typeof prop == "string")
		{
			var p = {};
			p[prop] = value;
			prop = p;
		}

		this.forEach(function(n)
		{
			for (var p in prop)
				try { n[p] = prop[p]; } catch (e) {}
		});
	}
	return this;
};
