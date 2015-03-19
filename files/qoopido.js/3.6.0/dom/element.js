/*!
* Qoopido.js library v3.6.0, 2014-12-2
* https://github.com/dlueth/qoopido.js
* (c) 2014 Dirk Lueth
* Dual licensed under MIT and GPL
*/
!function(e){var t=["../base","../function/unique/uuid","../hook/css","./event"];window.CustomEvent||t.push("../polyfill/window/customevent"),window.addEventListener||t.push("../polyfill/window/addeventlistener"),window.removeEventListener||t.push("../polyfill/window/removeeventlistener"),window.dispatchEvent||t.push("../polyfill/window/dispatchevent"),Element.prototype.matches||t.push("../polyfill/element/matches"),document.querySelector||t.push("../polyfill/document/queryselector"),document.querySelectorAll||t.push("../polyfill/document/queryselectorall"),window.qoopido.register("dom/element",e,t)}(function(e,t,n,r,i,o,s){"use strict";function l(e){var t,n,r;for(t in b)n=b[t],(!n.regex||n.regex.test(e))&&(r=n);return r}function u(e,t,n){var r=this,i=l(e),s=o.createEvent(i.type);s[i.method](e,"load"===e?!1:!0,!0,t),n&&(s._quid=n,s.isDelegate=!0),r.element.dispatchEvent(s)}function a(e){var t;if("string"==typeof e)try{d.test(e)===!0?(t=e.replace(d,"$1").toLowerCase(),e=o.createElement(t)):e=o.querySelector(e)}catch(n){e=null}if(!e)throw new Error("[Qoopido.js] Element could not be resolved");return e}var f="object",c="string",m=e["function/unique/uuid"],p="textContent"in o.createElement("a")?"textContent":"innerText",d=new RegExp("^<(\\w+)\\s*/>$"),h=new RegExp("^[^-]+"),v=e["pool/module"]&&e["pool/module"].create(e["dom/event"],null,!0)||null,g={},y=e["hook/css"],b={custom:{type:"CustomEvent",method:"initCustomEvent"},html:{regex:new RegExp("^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$"),type:"HTMLEvents",method:"initEvent"},mouse:{regex:new RegExp("^(?:mouse|pointer|contextmenu|touch|click|dblclick|drag|drop)"),type:"MouseEvents",method:"initMouseEvent"}};return e.base.extend({type:null,element:null,_listener:null,_constructor:function(e,t,n){var r=this;e=a(e),r.type=e.tagName,r.element=e,r._listener=r._listener||{},"object"==typeof t&&null!==t&&r.setAttributes(t),"object"==typeof n&&null!==n&&r.setStyles(n)},_obtain:function(e,t,n){this._constructor(e,t,n)},_dispose:function(){var e,t,n=this;for(e in n._listener)t=e.match(h),n.element.removeEventListener(t,n._listener[e]),delete n._listener[e];n.type=null,n.element=null},getContent:function(e){var t=this.element;return e&&e!==!1?t.innerHTML:t[p]},setContent:function(e,t){var n=this,r=n.element;return t&&t!==!1?r.innerHTML=e:r[p]=e,n},getAttribute:function(e){var t=this;return e&&typeof e===c?t.element.getAttribute(e):void 0},getAttributes:function(e){var t,n=this,r={},i=0;if(e)for(e=typeof e===c?e.split(" "):e;(t=e[i])!==s;i++)r[t]=n.element.getAttributes(t);return r},setAttribute:function(e,t){var n=this;return e&&typeof e===c&&n.element.setAttribute(e,t),n},setAttributes:function(e){var t,n=this;if(e&&typeof e===f&&!e.length)for(t in e)n.element.setAttribute(t,e[t]);return n},removeAttribute:function(e){var t=this;return e&&typeof e===c&&t.element.removeAttribute(e),t},removeAttributes:function(e){var t,n=this,r=0;if(e)for(e=typeof e===c?e.split(" "):e;(t=e[r])!==s;r++)n.element.removeAttribute(t);return n},getStyle:function(e){var t=this;return e&&typeof e===c?y.process("get",t.element,e):void 0},getStyles:function(e){var t,n=this,r={},i=0;if(e)for(e=typeof e===c?e.split(" "):e;(t=e[i])!==s;i++)r[t]=y.process("get",n.element,t);return r},setStyle:function(e,t){var n=this;return e&&typeof e===c&&y.process("set",n.element,e,t),n},setStyles:function(e){var t,n=this;if(e&&typeof e===f&&!e.length)for(t in e)y.process("set",n.element,t,e[t]);return n},removeStyle:function(e){var t=this;return e&&typeof e===c&&t.setStyle(e,""),t},removeStyles:function(e){var t,n=this,r=0;if(e)for(e=typeof e===c?e.split(" "):e;(t=e[r])!==s;r++)n.setStyle(t,"");return n},siblings:function(e){for(var t=this.element,n=t.parentNode.firstChild,r=[];n;n=n.nextSibling)1===n.nodeType&&n!==t&&(!e||n.matches(e))&&r.push(n);return r},siblingsBefore:function(e){for(var t=this.element.previousSibling,n=[];t;t=t.previousSibling)1===t.nodeType&&(!e||t.matches(e))&&n.push(t);return n},siblingsAfter:function(e){for(var t=this.element.nextSibling,n=[];t;t=t.nextSibling)1===t.nodeType&&(!e||t.matches(e))&&n.push(t);return n},previous:function(e){var t;if(!e)return this.element.previousSibling;for(t=this.element.previousSibling;t;t=t.previousSibling)if(1===t.nodeType&&t.matches(e))return t},next:function(e){var t;if(!e)return this.element.nextSibling;for(t=this.element.nextSibling;t;t=t.nextSibling)if(1===t.nodeType&&t.matches(e))return t},find:function(e){return this.element.querySelectorAll(e)},parent:function(e){var t;if(!e)return this.element.parentNode;for(t=this.element;t;t=t.parentNode)if(t.matches(e))return t},parents:function(e){for(var t=this.element.parentNode,n=[];t;t=t.parentNode){if(9===t.nodeType)return n;1===t.nodeType&&(!e||t.matches(e))&&n.push(t)}},isVisible:function(){var e=this.element;return!(e.offsetWidth<=0&&e.offsetHeight<=0)},hasClass:function(e){return e?new RegExp("(?:^|\\s)"+e+"(?:\\s|$)").test(this.element.className):!1},addClass:function(e){var t,n=this;return e&&!n.hasClass(e)&&(t=n.element.className.split(" "),t.push(e),n.element.className=t.join(" ")),n},removeClass:function(e){var t=this;return e&&t.hasClass(e)&&(t.element.className=t.element.className.replace(new RegExp("(?:^|\\s)"+e+"(?!\\S)"))),t},toggleClass:function(e){var t=this;return e&&(t.hasClass(e)?t.removeClass(e):t.addClass(e)),t},prepend:function(e){var t=this,n=t.element;if(e)try{e=e.element||a(e),n.firstChild?n.insertBefore(e,n.firstChild):t.append(e)}catch(r){n.insertAdjacentHTML("afterBegin",e)}return t},append:function(e){var t=this,n=t.element;if(e)try{n.appendChild(e.element||a(e))}catch(r){n.insertAdjacentHTML("beforeEnd",e)}return t},prependTo:function(e){var t=this,n=t.element;return e&&((e=e.element||a(e)).firstChild?e.insertBefore(n,e.firstChild):t.appendTo(e)),t},appendTo:function(e){var t=this;return e&&(e.element||a(e)).appendChild(t.element),t},insertBefore:function(e){var t=this,n=t.element;return e&&(e=e.element||a(e)).parentNode.insertBefore(n,e),t},insertAfter:function(e){var t=this,n=t.element;return e&&((e=e.element||a(e)).nextSibling?e.parentNode.insertBefore(n,e.nextSibling):t.appendTo(e.parentNode)),t},replace:function(e){var t=this,n=t.element;return e&&(e=e.element||a(e)).parentNode.replaceChild(n,e),t},replaceWith:function(e){var t=this,n=t.element;return e&&(e=e.element||a(e),n.parentNode.replaceChild(e,n)),t},hide:function(){return this.setStyle("display","none")},show:function(){return this.removeStyle("display")},remove:function(){var e=this,t=e.element;return t.parentNode.removeChild(t),e},on:function(t){var n,r=this,o=r.element,l=arguments.length>2?arguments[1]:null,a=arguments.length>2?arguments[2]:arguments[1],f=a._quid||(a._quid=m()),c=0;for(t=t.split(" ");(n=t[c])!==s;c++){var p=n+"-"+f,d=function(t){var n,o=t._quid||(t._quid=m());g[o]||(g[o]=v&&v.obtain(t)||e["dom/event"].create(t)),t=g[o],n=t.delegate,i.clearTimeout(t._timeout),(!l||t.target.matches(l))&&a.call(t.target,t,t.originalEvent.detail),n&&(delete t.delegate,u.call(r,n,null,t._quid)),t._timeout=i.setTimeout(function(){delete g[o],delete t._timeout,t.dispose&&t.dispose()},5e3)};d.type=n,r._listener[p]=d,o.addEventListener(n,d)}return r},one:function(e){var t=this,n=arguments.length>3||"string"==typeof arguments[1]?arguments[1]:null,r=arguments.length>3||"function"==typeof arguments[2]?arguments[2]:arguments[1],i=(arguments.length>3?arguments[3]:arguments[2])!==!1,o=function(n){t.off(i===!0?n.type:e,o),r.call(t,n,n.originalEvent.detail)};return r._quid=o._quid=m(),n?t.on(e,n,o):t.on(e,o),t},off:function(e,t){var n,r,i,o=this,l=o.element,u=0;for(e=e.split(" ");(n=e[u])!==s;u++)r=t._quid&&n+"-"+t._quid||null,i=r&&o._listener[r]||null,i?(l.removeEventListener(n,i),delete o._listener[r]):l.removeEventListener(n,t);return o},emit:function(e,t){var n=this;return u.call(n,e,t),n}})});