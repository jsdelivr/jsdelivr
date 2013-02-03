/**
 * ecma5schims.js - Shim for ECMA5 compatibility
 * (http://en.wikipedia.org/wiki/Shim_%28computing%29)
 *
 * A shim library that implements common functions that are missing on some
 * environments in order to complete ECMA5 compatibility across all major
 * browsers.
 *
 * TODO: This code needs to be refactored so as to conform to Aloha coding
 *       standards.  It is also severly lacking in documentation.  Please take
 *       note of: https://github.com/alohaeditor/Aloha-Editor/wiki/Commit-Checklist .
 */

define([], function(){
  

  var shims = {
    // Function bind
    bind: function(owner){
      var obj = this.obj || this;
      var native_method = Function.prototype.bind;          
      var args= Array.prototype.slice.call(arguments, 1);

      if(native_method){
        return native_method.apply(obj, arguments); 
      }
      else{
        return function() {
          return obj.apply(owner, arguments.length===0? args : args.concat(Array.prototype.slice.call(arguments)));
        }
      }
    },

    // String trim
    trim: function(){
      var obj = this.obj || this;
      var native_method = String.prototype.trim;

      if(native_method){
        return native_method.call(obj); 
      }
      else {
        return obj.replace(/^\s+/, '').replace(/\s+$/, '');
      }
    },

    // Array methods 
    indexOf: function(find, i /*opt*/){
      var obj = this.obj || this;
      var native_method = Array.prototype.indexOf;     

      if(native_method){
        return native_method.call(obj, find, i); 
      }
      else {
        if (i===undefined) i= 0;
        if (i<0) i+= obj.length;
        if (i<0) i= 0;
        for (var n = obj.length; i<n; i++)
            if (i in obj && obj[i]===find)
                return i;
        return -1;
      }
    },
    
    forEach: function(action, that /*opt*/){
      var obj = this.obj || this;
      var native_method = Array.prototype.forEach;          

      if(native_method){
        return native_method.call(obj, action, that); 
      }
      else {
        for (var i= 0, n = obj.length; i<n; i++)
          if (i in obj)
            action.call(that, obj[i], i, obj);
      }
    },

    map: function(mapper, that /*opt*/, chain /*opt */){
      var obj = this.obj || this;
      var native_method = Array.prototype.map; 
      var returnWrapper = (typeof arguments[arguments.length - 1] == "boolean") ? Array.prototype.pop.call(arguments) : false;
      var result = [];

      if(native_method){
        result = native_method.call(obj, mapper, that); 
      }
      else {
        var other= new Array(obj.length);
        for (var i= 0, n= obj.length; i<n; i++)
            if (i in obj)
                other[i]= mapper.call(that, obj[i], i, obj);
        result = other;
      }

      return returnWrapper ? $_(result) : result;
    },

    filter: function(filterFunc, that /*opt*/, chain /*opt */){
      var obj = this.obj || this;
      var native_method = Array.prototype.filter;         
      var returnWrapper = (typeof arguments[arguments.length - 1] == "boolean") ? Array.prototype.pop.call(arguments) : false;
      var result = [];

      if(native_method){
       result = native_method.call(obj, filterFunc, that); 
      }
      else {
        var other= [], v;
        for (var i=0, n= obj.length; i<n; i++)
            if (i in obj && filterFunc.call(that, v= obj[i], i, obj))
                other.push(v);
        result = other;
      }

      return returnWrapper ? $_(result) : result;
    },

    every: function(tester, that /*opt*/) {
       var obj = this.obj || this;
       var native_method = Array.prototype.every;

       if(native_method){
         return native_method.call(obj, tester, that); 
       }
       else {
         for (var i= 0, n= obj.length; i<n; i++)
            if (i in obj && !tester.call(that, obj[i], i, obj))
                return false;
         return true;
       }
    },

    some: function(tester, that /*opt*/){
       var obj = this.obj || this;
       var native_method = Array.prototype.some;  

       if(native_method){
         return native_method.call(obj, tester, that); 
       }
       else {
         for (var i= 0, n= obj.length; i<n; i++)
           if (i in obj && tester.call(that, obj[i], i, obj))
               return true;
         return false;
       }
    },

    // Since IE7 doesn't support 'hasAttribute' method on nodes
    // TODO: raise an exception if the object is not an node
    hasAttribute: function(attr){
      var obj = this.obj || this;
      var native_method = obj.hasAttribute;  

      if(native_method){
        return obj.hasAttribute(attr); 
      }
      else {
        return (typeof obj.attributes[attr] != "undefined")
      }         
    }

  };

  var $_ = function(obj) { 
    var wrapper = function() {};
    wrapper.prototype = shims;

    var wrapper_instance = new wrapper();
    wrapper_instance.obj = obj;
    return wrapper_instance; 
  }; 

  for (var shim in shims) {
    $_[shim] = shims[shim];
  }
  

  // Node constants
  // http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-1841493061
  if(typeof Node != 'undefined'){
    $_.Node = Node;
  }                
  else {
    $_.Node = {
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
    } 
  };

  // http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-compareDocumentPosition
  // FIXME: Check if the DOMNode prototype can be set.
  $_.compareDocumentPosition = function(node1, node2) {
      
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
    function getRootParent( node ) {
		var parent = null;

		if ( node ) {
			do { parent = node; }
			while ( node = node.parentNode );
		}

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

  $_.getComputedStyle = function(node, style){
    if('getComputedStyle' in window) {
      return window.getComputedStyle(node, style); 
    }
    else {
      if( node.currentStyle ) {
        return node.currentStyle;
      }
      return null;
    }
  };
     
  return $_;
});
