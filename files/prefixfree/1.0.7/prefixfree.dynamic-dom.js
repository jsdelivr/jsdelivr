// StyleFix Dynamic DOM plugin
(function(self){

if(!self) {
	return;
}

self.events = {
	DOMNodeInserted: function(evt) {
		var node = evt.target, tag = node.nodeName;
		
		if(node.nodeType != 1) {
			return;
		}
		
		if(/link/i.test(tag)) {
			self.link(node);
		}
		else if(/style/i.test(tag)) {
			self.styleElement(node);
		}
		else if (node.hasAttribute('style')) {
			self.styleAttribute(node);
		}
	},
	
	DOMAttrModified: function(evt) {
		if(evt.attrName === 'style') {
			document.removeEventListener('DOMAttrModified', self.events.DOMAttrModified, false);
			self.styleAttribute(evt.target);
			document.addEventListener('DOMAttrModified', self.events.DOMAttrModified, false);
		}
	}
};

document.addEventListener('DOMContentLoaded', function() {
	// Listen for new <link> and <style> elements
	document.addEventListener('DOMNodeInserted', self.events.DOMNodeInserted, false);
	
	// Listen for style attribute changes
	document.addEventListener('DOMAttrModified', self.events.DOMAttrModified, false);
}, false);

})(window.StyleFix);

// PrefixFree CSSOM plugin
(function(self){

if(!self) {
	return;
}

// Add accessors for CSSOM property changes
if(window.CSSStyleDeclaration) {
	for(var i=0; i<self.properties.length; i++) {
		var property = StyleFix.camelCase(self.properties[i]),
		    prefixed = self.prefixProperty(property, true),
		    proto = CSSStyleDeclaration.prototype,
		    getter,
		    setter;

		// Lowercase prefix for IE
		if(!(prefixed in proto)) {
			prefixed = prefixed.charAt(0).toLowerCase() + prefixed.slice(1);
			if(!(prefixed in proto)) {
				continue;
			}
		}

		getter = (function(prefixed) {
			return function() {
				return this[prefixed];
			}
		})(prefixed);
		setter = (function(prefixed) {
			return function(value) {
				this[prefixed] = value;
			}
		})(prefixed);

		if(Object.defineProperty) {
			Object.defineProperty(proto, property, {
				get: getter,
				set: setter,
				enumerable: true,
				configurable: true
			});
		}
		else if(proto.__defineGetter__) {
			proto.__defineGetter__(property, getter);
			proto.__defineSetter__(property, setter);
		}
	}
}

})(window.PrefixFree);