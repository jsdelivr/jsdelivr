// Utility functions

String.prototype.trim = function(){ return this.replace(/^\s+|\s+$/g, ''); };

function supportsHtmlStorage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}

function get_text(el) {
    ret = " ";
    var length = el.childNodes.length;
    for(var i = 0; i < length; i++) {
        var node = el.childNodes[i];
        if(node.nodeType != 8) {

        	if ( node.nodeType != 1 ) {
        		// Strip white space.
        		ret += node.nodeValue;
        	} else {
        		ret += get_text( node );
        	}
        }
    }
    return ret.trim();
}