// SpryXML.js - version 0.4 - Spry Pre-Release 1.6
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

var Spry; if (!Spry) Spry = {}; if (!Spry.XML) Spry.XML = {}; if (!Spry.XML.Schema) Spry.XML.Schema = {};

Spry.XML.Schema.Node = function(nodeName)
{
	this.nodeName = nodeName;
	this.isAttribute = false;
	this.appearsMoreThanOnce = false;
	this.children = new Array;
};

Spry.XML.Schema.Node.prototype.toString = function (indentStr)
{
	if (!indentStr)
		indentStr = "";

	var str = indentStr + this.nodeName;

	if (this.appearsMoreThanOnce)
		str += " (+)";

	str += "\n";

	var newIndentStr = indentStr + "    ";

	for (var $childName in this.children)
	{
		var child = this.children[$childName];
		if (child.isAttribute)
			str += newIndentStr + child.nodeName + "\n";
		else
			str += child.toString(newIndentStr);
	}

	return str;
};

Spry.XML.Schema.mapElementIntoSchemaNode = function(ele, schemaNode)
{
	if (!ele || !schemaNode)
		return;

	// Add all attributes as children to schemaNode!

	var i = 0;
	for (i = 0; i < ele.attributes.length; i++)
	{
		var attr = ele.attributes.item(i);
		if (attr && attr.nodeType == 2 /* Node.ATTRIBUTE_NODE */)
		{
			var attrName = "@" + attr.name;

			// We don't track the number of times an attribute appears
			// in a given element so we only handle the case where the
			// attribute doesn't already exist in the schemaNode.children array.

			if (!schemaNode.children[attrName])
			{
				var attrObj = new Spry.XML.Schema.Node(attrName);
				attrObj.isAttribute = true;
				schemaNode.children[attrName] = attrObj;
			}
		}
	}

	// Now add all of element's element children as children of schemaNode!

	var child = ele.firstChild;
	var namesSeenSoFar = new Array;
  
	while (child)
	{
		if (child.nodeType == 1 /* Node.ELEMENT_NODE */)
		{
			var childSchemaNode = schemaNode.children[child.nodeName];

			if (!childSchemaNode)
			{
				childSchemaNode = new Spry.XML.Schema.Node(child.nodeName);
				if (childSchemaNode)
					schemaNode.children[child.nodeName] = childSchemaNode;
			}

			if (childSchemaNode)
			{
				if (namesSeenSoFar[childSchemaNode.nodeName])
					childSchemaNode.appearsMoreThanOnce = true;
				else
					namesSeenSoFar[childSchemaNode.nodeName] = true;
			}

			Spry.XML.Schema.mapElementIntoSchemaNode(child, childSchemaNode);
		}

		child = child.nextSibling;
	} 
};

Spry.XML.getSchemaForElement = function(ele)
{
	if (!ele)
		return null;

	schemaNode = new Spry.XML.Schema.Node(ele.nodeName);
	Spry.XML.Schema.mapElementIntoSchemaNode(ele, schemaNode);

	return schemaNode;
};

Spry.XML.getSchema = function(xmlDoc)
{
	if (!xmlDoc)
		return null;

	// Find the first element in the document that doesn't start with "xml".
	// According to the XML spec tags with names that start with "xml" are reserved
	// for future use.

	var node = xmlDoc.firstChild;

	while (node)
	{
		if (node.nodeType == 1 /* Node.ELEMENT_NODE */)
			break;

		node = node.nextSibling;
	}

	return Spry.XML.getSchemaForElement(node);
};

Spry.XML.nodeHasValue = function(node)
{
	if (node)
	{
		var child = node.firstChild;
		if (child && child.nextSibling == null && (child.nodeType == 3 /* Node.TEXT_NODE */ || child.nodeType == 4 /* CDATA_SECTION_NODE */))
			return true;
	}
	return false;
};

Spry.XML.XObject = function()
{
};

Spry.XML.XObject.prototype._value = function()
{
	var val = this["#text"];
	if (val != undefined)
		return val;
	return this["#cdata-section"];
};

Spry.XML.XObject.prototype._hasValue = function()
{
	return this._value() != undefined;
};

Spry.XML.XObject.prototype._valueIsText = function()
{
	return this["#text"] != undefined;
};

Spry.XML.XObject.prototype._valueIsCData = function()
{
	return this["#cdata-section"] != undefined;
};

Spry.XML.XObject.prototype._propertyIsArray = function(prop)
{
	var val = this[prop];
	if (val == undefined)
		return false;
	return (typeof val == "object" && val.constructor == Array);
};

Spry.XML.XObject.prototype._getPropertyAsArray = function(prop)
{
	var arr = [];
	var val = this[prop];
	if (val != undefined)
	{
		if (typeof val == "object" && val.constructor == Array)
			return val;
		arr.push(val);
	}
	return arr;
};

Spry.XML.XObject.prototype._getProperties = function()
{
	var props = [];
	for (var p in this)
	{
		if (!/^_/.test(p))
			props.push(p);
	}
	return props;
};

Spry.XML.nodeToObject = function(node)
{
	if (!node)
		return null;

	var obj = new Spry.XML.XObject();

	// Add all attributes as properties of the object.

	for (var i = 0; i < node.attributes.length; i++)
	{
		var attr = node.attributes[i];
		var attrName = "@" + attr.name;
		obj[attrName] = attr.value;
	}

	var child;

	if (Spry.XML.nodeHasValue(node))
	{	
		try
		{
			child = node.firstChild;

			if (child.nodeType == 3 /* TEXT_NODE */)
				obj[child.nodeName] = Spry.Utils.encodeEntities(child.data);
			else if (child.nodeType == 4 /* CDATA_SECTION_NODE */)
				obj[child.nodeName] = child.data;
		} catch (e) { Spry.Debug.reportError("Spry.XML.nodeToObject() exception caught: " + e + "\n"); }
	}
	else
	{
		// The node has no value, so run through any element children
		// it may have and add them as properties.

		child = node.firstChild;
		while (child)
		{
			if (child.nodeType == 1 /* Node.ELEMENT_NODE */)
			{
				var isArray = false;
				var tagName = child.nodeName;
				if (obj[tagName])
				{
					if (obj[tagName].constructor != Array)
					{
						var curValue = obj[tagName];
						obj[tagName] = new Array;
						obj[tagName].push(curValue);
					}
					isArray = true;
				}

				var childObj = Spry.XML.nodeToObject(child);
				
				if (isArray)
					obj[tagName].push(childObj);
				else
					obj[tagName] = childObj;
			}
			child = child.nextSibling;
		}
	}
	return obj;
};

// Spry.XML.documentToObject - Utility method for creating a
// JavaScript object with properties and nested objects that
// mirror an XML document tree structure.
//
// Sample XML:
//
//		<employees>
//			<employee id="1000">
//				<name>John Doe</name>
//			</employee>
//			<employee id="2000">
//				<name><![CDATA[Jane Smith]]></name>
//			</employee>
//		</employees>
//
// Object returned by documentToObject():
//
//		{
//			employees:
//				{
//					employee:
//						[
//							{
//								@id: "1000",
//								name: { "#text": "John Doe" }
//							},
//							{
//								@id: "2000",
//								name: { "#cdata-section": "Jane Smith" }
//							}
//						]
//				}
//		}

Spry.XML.documentToObject = function(xmlDoc)
{
	var obj = null;
	if (xmlDoc && xmlDoc.firstChild)
	{
		var child = xmlDoc.firstChild;
		while (child)
		{
			if (child.nodeType == 1 /* Node.ELEMENT_NODE */)
			{
				obj = new Spry.XML.XObject();
				obj[child.nodeName] = Spry.XML.nodeToObject(child);
				break;
			}
			child = child.nextSibling;
		}
	}
	return obj;
};
