/*! Qoopido.js library 3.7.2, 2015-08-05 | https://github.com/dlueth/qoopido.js | (c) 2015 Dirk Lueth */
!function(e){window.qoopido.register("pool/object",e,["../pool"])}(function(e,t,o,r,n,l,p){"use strict";var i,c=null===Object.prototype.__proto__,d=c?"__proto__":"prototype",u=c?null:function(){var e=l.createElement("iframe"),t=l.body||l.documentElement;e.style.display="none",t.appendChild(e),e.src="javascript:";var o=e.contentWindow.Object.prototype;return t.removeChild(e),e=null,delete o.constructor,delete o.hasOwnProperty,delete o.propertyIsEnumerable,delete o.isPrototypeOf,delete o.toLocaleString,delete o.toString,delete o.valueOf,o.__proto__=null,o}();return i=e.pool.extend({getModel:function(){return u},_dispose:function(e){var t;e[d]=u;for(t in e)delete e[t];return e},_obtain:function(){return{}}}),t.pool=t.pool||{},t.pool.object=i.create(),i});