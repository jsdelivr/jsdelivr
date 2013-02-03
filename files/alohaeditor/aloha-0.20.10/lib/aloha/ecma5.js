//Add ECMA262-5 method binding if not supported natively
//
if (!('bind' in Function.prototype)) {
    Function.prototype.bind= function(owner) {
        var that= this;
        if (arguments.length<=1) {
            return function() {
                return that.apply(owner, arguments);
            };
        } else {
            var args= Array.prototype.slice.call(arguments, 1);
            return function() {
                return that.apply(owner, arguments.length===0? args : args.concat(Array.prototype.slice.call(arguments)));
            };
        }
    };
}

// Add ECMA262-5 string trim if not supported natively
//
if (!('trim' in String.prototype)) {
    String.prototype.trim= function() {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}

// Add ECMA262-5 Array methods if not supported natively
//
if (!('indexOf' in Array.prototype)) {
    Array.prototype.indexOf= function(find, i /*opt*/) {
        if (i===undefined) i= 0;
        if (i<0) i+= this.length;
        if (i<0) i= 0;
        for (var n= this.length; i<n; i++)
            if (i in this && this[i]===find)
                return i;
        return -1;
    };
}
if (!('lastIndexOf' in Array.prototype)) {
    Array.prototype.lastIndexOf= function(find, i /*opt*/) {
        if (i===undefined) i= this.length-1;
        if (i<0) i+= this.length;
        if (i>this.length-1) i= this.length-1;
        for (i++; i-->0;) /* i++ because from-argument is sadly inclusive */
            if (i in this && this[i]===find)
                return i;
        return -1;
    };
}
if (!('forEach' in Array.prototype)) {
    Array.prototype.forEach= function(action, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                action.call(that, this[i], i, this);
    };
}
if (!('map' in Array.prototype)) {
    Array.prototype.map= function(mapper, that /*opt*/) {
        var other= new Array(this.length);
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                other[i]= mapper.call(that, this[i], i, this);
        return other;
    };
}
if (!('filter' in Array.prototype)) {
    Array.prototype.filter= function(filter, that /*opt*/) {
        var other= [], v;
        for (var i=0, n= this.length; i<n; i++)
            if (i in this && filter.call(that, v= this[i], i, this))
                other.push(v);
        return other;
    };
}
if (!('every' in Array.prototype)) {
    Array.prototype.every= function(tester, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this && !tester.call(that, this[i], i, this))
                return false;
        return true;
    };
}
if (!('some' in Array.prototype)) {
    Array.prototype.some= function(tester, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this && tester.call(that, this[i], i, this))
                return true;
        return false;
    };
}
if (!Node) {
	// http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-1841493061
    var Node = {
    		'ELEMENT_NODE' : 1,
    		'ATTRIBUTE_NODE': 2,
    		'TEXT_NODE': 3,
    		'CDATA_SECTION_NODE': 4,
    		'ENTITY_REFERENCE_NODE': 5,
    		'ENTITY_NODE': 6,
    		'PROCESSING_INSTRUCTION_NODE': 7,
    		'COMMENT_NODE': 8,
    		'DOCUMENT_NODE': 9,
    		'DOCUMENT_TYPE_NODE': 10,
    		'DOCUMENT_FRAGMENT_NODE': 11,
    		'NOTATION_NODE': 12,
    		//The two nodes are disconnected. Order between disconnected nodes is always implementation-specific.
    		'DOCUMENT_POSITION_DISCONNECTED': 0x01,
    		//The second node precedes the reference node.
    		'DOCUMENT_POSITION_PRECEDING': 0x02, 
    		//The node follows the reference node.
    		'DOCUMENT_POSITION_FOLLOWING': 0x04,
    		//The node contains the reference node. A node which contains is always preceding, too.
    		'DOCUMENT_POSITION_CONTAINS': 0x08,
    		//The node is contained by the reference node. A node which is contained is always following, too.
    		'DOCUMENT_POSITION_CONTAINED_BY': 0x10,
    		//The determination of preceding versus following is implementation-specific.
    		'DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC': 0x20
    };
}

// http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-compareDocumentPosition
// FIXME: Check if the DOMNode prototype can be set.
window.compareDocumentPosition = function(node1, node2) {
	
	if ('compareDocumentPosition' in document.documentElement ) {
		return node1.compareDocumentPosition(node2);
	} 
	
	if (!("contains" in document.documentElement)) {
		throw 'compareDocumentPosition nor contains is not supported by this browser.';
	}
	
	if (node1 == node2) return 0;
	
	//if they don't have the same parent, there's a disconnect
	if (getRootParent(node1) != getRootParent(node2)) return 1;
	
	//use this if both nodes have a sourceIndex (text nodes don't)
	if ("sourceIndex" in node1 && "sourceIndex" in node2) {
		return comparePosition(node1, node2);
	}
	
	//document will definitely contain the other node
	if (node1 == document) return 20;
	else if (node2 == document) return 10;
	
	//get sourceIndexes to use for both nodes
	var useNode1 = getUseNode(node1), useNode2 = getUseNode(node2);
	
	//call this function again to get the result
	var result = comparePosition(useNode1, useNode2);
	
	//clean up if needed
	if (node1 != useNode1) useNode1.parentNode.removeChild(useNode1);
	if (node2 != useNode2) useNode2.parentNode.removeChild(useNode2);
	return result;


	//node.ownerDocument gives the document object, which isn't the right info for a disconnect
	function getRootParent(node) {
		do { var parent = node; }
		while (node = node.parentNode);
		return parent;
	}

	//Compare Position - MIT Licensed, John Resig; http://ejohn.org/blog/comparing-document-position/
	//Already checked for equality and disconnect
	function comparePosition(node1, node2) {
		return (node1.contains(node2) && 16) +
			(node2.contains(node1) && 8) +
				(node1.sourceIndex >= 0 && node2.sourceIndex >= 0 ?
					(node1.sourceIndex < node2.sourceIndex && 4) +
						(node1.sourceIndex > node2.sourceIndex && 2) :
					1);
	}

	//get a node with a sourceIndex to use
	function getUseNode(node) {
		//if the node already has a sourceIndex, use that node
		if ("sourceIndex" in node) return node;
		//otherwise, insert a comment (which has a sourceIndex but minimal DOM impact) before the node and use that
		return node.parentNode.insertBefore(document.createComment(""), node);
	}
};

if (!('getComputedStyle' in window)) {
	window.getComputedStyle = function (node, style) {
		if( node.currentStyle ) {
			return node.currentStyle;
		}
		return null;
	}
}
