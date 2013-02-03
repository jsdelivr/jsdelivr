/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
/**
 * Provides public utility methods to convert DOM nodes to XHTML.
 */
define(
['aloha', 'aloha/jquery', 'aloha/console'],
function( Aloha, $, console) {
	

	/**
	 * Gets the attributes of the given element.
	 *
	 * @param element
	 *        An element to get the attributes for.
	 * @return
	 *        An array of consisting of [name, value] tuples for each attribute.
	 *        Attribute values may be strings, booleans or undefined.
	 */
	function getAttrs(element) {
		var attrs = element.attributes;
		var cleanAttrs = [];
		var elementName = element.nodeName;
		for (var i = 0; i < attrs.length; i++) {
			var name  = attrs[i].nodeName;
			if ($.browser.msie) {
				// attrs[i].nodeValue would stringify the object; getAttribute doesn't.
				var value = element.getAttribute(name);
				if (
					// The check for not null and not undefined is required to exclude most of
					// the 84 attributes that are always defined for IE7.
				       null == value
					// In IE, some attributes are reported with non-null default
					// values, even if the attribute isn't set on the element.
					// More of these attributes appear in IE7 than in IE8.
					|| 'tabIndex' == name && 0 === value
					|| 'contentEditable' == name && 'inherit' === value
					|| 'hideFocus' == name && false === value
					|| 'disabled' == name && false === value
					|| 'compact' == name && false === value
					|| 'noWrap' == name && false === value //div, th
					|| ('INPUT' == elementName || 'IMG' == elementName)
						&& (   ('start' == name && 'fileopen' == value)
							|| ('hspace' == name && 0 === value)
							|| ('maxLength' == name && 2147483647 === value)
							|| ('indeterminate' == name && false === value)
							|| ('vspace' == name && 0 === value)
						    || ('loop' == name && 1 === value) )
					// ordered lists start with 1 by default
					|| 'OL' == elementName && 'start' == name && 1 === value
					|| 'IMG' == elementName && ('isMap' == name || 'loop' == name) && false === value
					|| 'TABLE' == elementName && ('cols' == name || 'dataPageSize' == name) && 0 === value
					|| 'LI' == elementName && 'value' == name && 0 === value
					|| ('TH' == elementName || 'TD' == elementName) && ('colSpan' == name || 'rowSpan' == name) && 1 == value) {
					continue;
				}
				// IE sets the attribute value="on" when a checkbox is checked, and ignores the "checkbox" attribute.
				// Setting value="on" will not make the checkbox checked (Chrome).
				if ('INPUT' == elementName && 'value' == name && 'on' == value) {
					var type = element.type.toLowerCase();
					if ('checkbox' == type || 'radio' == type) {
						cleanAttrs.push(['checked', 'checked']);
						continue;
					}
				}
			}
			cleanAttrs.push([name, $.attr(element, name)]);
		}
		return cleanAttrs;
	}

	/**
	 * Elements that are to be serialized like <img /> and not like <img></img>
	 */
	var emptyElements = [
		"area", "base", "basefont", "br", "col", "frame", "hr",
		"img", "input", "isindex", "link", "meta", "param", "embed" ];

	/**
	 * Attributes that are to be serialized like checked="checked" for any true attribute value.
	 */
	var booleanAttrs = [
		"checked", "compact", "declare", "defer", "disabled", "ismap", "multiple",
		"nohref", "noresize", "noshade", "nowrap", "readonly", "selected" ];

	/**
	 * Encodes a string meant to be used wherever parsable character data occurs in XML.
	 * @param str
	 *        An unencoded piece of character data
	 * @return
	 *        The given string with & and < characters replaced with the corresponding HTML entity references.
	 */
	function encodePcdata(str) {
		return str.replace(/&/g, '&amp;').replace(/</g, '&lt;');
	}

	/**
	 * Encodes a string meant to be used between double-quoted attribute values.
	 *
	 * @param str
	 *        An unencoded attribute value
	 * @return
	 *        The given string with & < and " characters replaced with the corresponding HTML entity references.
	 */
	function encodeDqAttrValue(str) {
		return encodePcdata(str).replace(/"/g, '&quot;');
	}

	/**
	 * Serializes the attributes of the given element.
	 *
	 * Attributes that have the empty string as value will not appear in the string at all.
	 *
	 * @param element
	 *        An element to serialize the attributes of
	 * @return
	 *        A string made up of name="value" for each attribute of the
	 *        given element, separated by space. The string will have a leading space.
	 */
	function makeAttrString(element) {
		var attrs = getAttrs(element);
		var str = "";
		for (var i = 0; i < attrs.length; i++) {
			var name  = attrs[i][0];
			var value = attrs[i][1];
			if ( "" === value || null == value ) {
				// I don't think it is ever an error to make an
				// attribute not appear if its string value is empty.
				// This works around an IE8 bug, for example, where the
				// "shape" attribute is reported to appear on "a"
				// elements with an empty string value, even if it was
				// never set.
				continue;
			}
			// The XHTML spec says attributes are lowercase
			name = name.toLowerCase();
			//TODO it's only a boolean attribute if the element is in an HTML namespace
			var isBool = (-1 !== $.inArray(name, booleanAttrs));
			if ( ! isBool || (isBool && value) ) {
				str += " " + name + '="' + encodeDqAttrValue( "" + (isBool ? name : value) ) + '"';
			}
		}
		return str;
	}

	/**
	 * IE8 turns the following
	 * <book id="x">{content}</book>
	 * into
	 * <book id="x"></book>{content}</book><//book>
	 * This seems to occur with any element IE doesn't recognize.
	 *
	 * @param element
	 *        An element node.
	 * @return
	 *        true if the given element isn't recognized by IE and
	 *        causes a broken DOM structure as outlined above.
	 */
	function isUnrecognized(element) {
		var closingName = "/" + element.nodeName;
		var sibling = element.nextSibling;
		while (null != sibling) {
			if (closingName == sibling.nodeName) {
				return true;
			}
			sibling = sibling.nextSibling;
		}
		return false;
	}

	/**
	 * Serializes the children of the given element into an XHTML string.
	 *
	 * The same as serializeElement() except it only serializes the children.
	 * The start and end tag of the given element will not appear in the resulting XHTML.
	 *
	 * @see serializeElement()
	 */
	function serializeChildren(element, child, unrecognized, xhtml) {
		while (null != child) {
			if (1 === child.nodeType && unrecognized && "/" + element.nodeName == child.nodeName) {
				child = child.nextSibling;
				break;
			} else if (1 === child.nodeType && isUnrecognized(child)) {
				child = serializeElement(child, child.nextSibling, true, xhtml);
			} else {
				serialize(child, xhtml);
				child = child.nextSibling;
			}
		}
		return child;
	}

	/**
	 * Serializes an element into an XHTML string.
	 *
	 * @param element
	 *        An element to serialize.
	 * @param child
	 *        The first child of the given element. This will usually be
	 *        element.firstChild. On IE this may be element.nextSibling because
	 *        of the broken DOM structure IE sometimes generates.
	 * @param unrecognized
	 *        Whether the given element is unrecognized on IE. If IE doesn't
	 *        recognize the element, it will create a broken DOM structure
	 *        which has to be compensated for. See isUnrecognized() for more.
	 * @param xhtml
	 *        An array which receives the serialized element and whic, if joined,
	 *        will yield the XHTML string.
	 * @return
	 *        null if all siblings of the given child have been processed as children
	 *        of the given element, or otherwise the first sibling of child that is not considered
	 *        a child of the given element.
	 */
	function serializeElement(element, child, unrecognized, xhtml) {
		// TODO: we should only lowercase element names if they are in an HTML namespace
		var elementName = element.nodeName.toLowerCase();
		// This is a hack around an IE bug which strips the namespace prefix
		// of element.nodeName if it occurs inside an contentEditable=true.
		if (element.scopeName && 'HTML' != element.scopeName && -1 === elementName.indexOf(':')) {
			elementName = element.scopeName.toLowerCase() + ':' + elementName;
		}
		if ( ! unrecognized && null == child && -1 !== $.inArray(elementName, emptyElements) ) {
			xhtml.push('<' + elementName + makeAttrString(element) + '/>');
		} else {
			xhtml.push('<' + elementName + makeAttrString(element) + '>');
			child = serializeChildren(element, child, unrecognized,  xhtml);
			xhtml.push('</' + elementName + '>');
		}
		return child;
	}

	/**
	 * Serializes a DOM node into a XHTML string.
	 *
	 * @param node
	 *        A DOM node to serialize.
	 * @param xhtml
	 *        An array that will receive snippets of XHTML,
	 *        which if joined will yield the XHTML string.
	 */
	function serialize(node, xhtml) {
		var nodeType = node.nodeType;
		if (1 === nodeType) {
			serializeElement(node, node.firstChild, isUnrecognized(node), xhtml);
		} else if (3 === node.nodeType) {
			xhtml.push(encodePcdata(node.nodeValue));
		} else if (8 === node.nodeType) {
			xhtml.push('<' + '!--' + node.nodeValue + '-->');
		} else {
			console.log('Unknown node type encountered during serialization, ignoring it:'
						+ ' type=' + node.nodeType
						+ ' name=' + node.nodeName
						+ ' value=' + node.nodeValue);
		}
	}
	
	return {
		/**
		 * Serializes a number of DOM nodes in an array-like object to an XHTML string.
		 *
		 * The XHTML of the nodes in the given array-like object will be concatenated.
		 *
		 * @param nodes
		 *        An array or jQuery object or another array-like object to serialize.
		 * @return
		 *        The serialized XHTML String representing the given DOM nodes in the given array-like object.
		 *        The result may look like an XML fragment with multiple top-level elements and text nodes.
		 * @see nodeToXhtml()
		 */
		contentsToXhtml: function(element) {
			var xhtml = [];
			serializeChildren(element, element.firstChild, false, xhtml);
			return xhtml.join("");
		},

		/**
		 * Serializes a DOM node to an XHTML string.
		 *
		 * Beware that the serialization method will generate XHTML as
		 * close as possible to the DOM tree represented by the given
		 * node. The result will only be valid XHTML if the DOM tree
		 * doesn't violate any contained-in rules.
		 *
		 * Element attributes with an empty string as value will not
		 * appear in the serialized output.
		 *
		 * When iterating over the DOM, CDATA sections are comment nodes
		 * on some browsers (Chrome) and not there at all on others (IE).
		 * This is the same as what comes out from element.innerHTML.
		 *
		 * IE8 bug: comments will sometimes be silently stripped inside
		 * contentEditable=true. Conditional includes don't work inside
		 * contentEditable=true. See the tests for more information.
		 *
		 * IE8 bug: a title element will not be serialized correctly
		 * unless it occurs in the head of a HTML document, even if it occurs
		 * in a non-HTML namespace (maybe it works with a prefix).
		 * This will probably also apply for other HTML elements that
		 * occur in the header.
		 *
		 * IE8 bug: unrecognized elements in the HTML scope will cause
		 * broken DOM structure (some HTML5 elements that are not yet
		 * implemented in IE for example). Some effort was made to fix a
		 * broken DOM structure, if it is encountered. There is one case
		 * which results in an unrecoverably broken DOM structure, which
		 * is an unrecognized element not preceded by some text. See the
		 * tests for further information.
		 *
		 * IE8 bug: whitespace is not reliably preserved when the style
		 * white-space:pre (or similar) is used. See the tests for
		 * further information. Whitespace inside <pre> elements will
		 * be preserved, but \n characters will become \r characters.
		 *
		 * IE7 bug: URLs in href and src attributes of a and img
		 * elements will be absolutized (including hostname and
		 * protocol) if they are given as a relative path.
		 *
		 * IE bug: Namespace support inside contentEditable=true is a
		 * bit shaky on IE. Don't use it if possible. See the tests to
		 * get an idea of what seems to work. Make namespace prefixes
		 * and element names all lower-case, as they are always
		 * lower-cased, even if the element doesn't occur in an HTML
		 * namespace. Don't use default namespaces, use prefixes (except
		 * for an HTML namespace).
		 *
		 * @param node
		 *        A DOM node to serialize
		 * @return
		 *        The serialized XHTML string represnting the given DOM node.
		 */
		nodeToXhtml: function(node) {
			var xhtml = [];
			serialize(node, xhtml);
			return xhtml.join("");
		}
	};
});
