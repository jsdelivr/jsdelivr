/*! Qoopido.js library 3.7.3, 2015-08-05 | https://github.com/dlueth/qoopido.js | (c) 2015 Dirk Lueth */
!function(e,t){t.register?t.register("polyfill/object/defineproperty",e):(t.modules=t.modules||{})["polyfill/object/defineproperty"]=e()}(function(e,t,r,n,o,i,s){"use strict";if(!Object.defineProperty||!function(){try{return Object.defineProperty({},"x",{}),!0}catch(e){return!1}}()){var l=Object.defineProperty,u=Object.prototype.__defineGetter__,c=Object.prototype.__defineSetter__;Object.defineProperty=function(e,t,r){if(l)try{return l(e,t,r)}catch(n){}if(e!==Object(e))throw new TypeError("Object.defineProperty called on non-object");return u&&"get"in r&&u.call(e,t,r.get),c&&"set"in r&&c.call(e,t,r.set),"value"in r&&(e[t]=r.value),e}}return Object.defineProperty},window.qoopido=window.qoopido||{}),function(e,t){if(t.register){var r=[];Object.defineProperty&&function(){try{return Object.defineProperty({},"x",{}),!0}catch(e){return!1}}()||r.push("./defineproperty"),t.register("polyfill/object/defineproperties",e,r)}else(t.modules=t.modules||{})["polyfill/object/defineproperties"]=e()}(function(e,t,r,n,o,i,s){"use strict";return Object.defineProperties||(Object.defineProperties=function(e,t){if(e!==Object(e))throw new TypeError("Object.defineProperties called on non-object");var r;for(r in t)Object.prototype.hasOwnProperty.call(t,r)&&Object.defineProperty(e,r,t[r]);return e}),Object.defineProperties},window.qoopido=window.qoopido||{}),function(e,t){if(t.register){var r=[];Object.defineProperties||r.push("./defineproperties"),t.register("polyfill/object/create",e,r)}else(t.modules=t.modules||{})["polyfill/object/create"]=e()}(function(e,t,r,n,o,i,s){"use strict";return Object.create||(Object.create=function(e,t){function r(){}if("object"!=typeof e)throw new TypeError;r.prototype=e;var n=new r;if(e&&(n.constructor=r),arguments.length>1){if(t!==Object(t))throw new TypeError;Object.defineProperties(n,t)}return n}),Object.create},window.qoopido=window.qoopido||{}),function(e,t){t.register?t.register("polyfill/object/getownpropertynames",e):(t.modules=t.modules||{})["polyfill/object/getownpropertynames"]=e()}(function(e,t,r,n,o,i,s){"use strict";return Object.getOwnPropertyNames||(Object.getOwnPropertyNames=function(e){if(e!==Object(e))throw new TypeError("Object.getOwnPropertyNames called on non-object");var t,r=[];for(t in e)Object.prototype.hasOwnProperty.call(e,t)&&r.push(t);return r}),Object.getOwnPropertyNames},window.qoopido=window.qoopido||{}),function(e,t){t.register?t.register("polyfill/object/getownpropertydescriptor",e):(t.modules=t.modules||{})["polyfill/object/getownpropertydescriptor"]=e()}(function(e,t,r,n,o,i,s){"use strict";if(!Object.getOwnPropertyDescriptor||!function(){try{return Object.getOwnPropertyDescriptor({x:0},"x"),!0}catch(e){return!1}}()){var l=Object.getOwnPropertyDescriptor;Object.getOwnPropertyDescriptor=function(e,t){if(e!==Object(e))throw new TypeError;try{return l.call(Object,e,t)}catch(r){}return Object.prototype.hasOwnProperty.call(e,t)?{value:e[t],enumerable:!0,writable:!0,configurable:!0}:void 0}}return Object.getOwnPropertyDescriptor},window.qoopido=window.qoopido||{}),function(e,t,r,n,o){"use strict";function i(e,i,s,u){var p,d=e.split("/");return a[e]?a[e]:(p=function(){if(s)for(var p,m,g=d.slice(0,-1).join("/"),h=0;(p=s[h])!==o;h++)m=f.test(p),m&&(p=l(g+"/"+p)),!a[p]&&arguments[h]&&(a[p]=arguments[h]),m&&!a[p]&&"undefined"!=typeof console&&console.error("".concat("[Qoopido.js] ",e,": Could not load dependency ",p));return a[e]=i(a,c,d,t,r,n,o),u&&u(a[e]),a[e]},void("undefined"!=typeof module&&module.exports?module.exports=define(p):"function"==typeof define&&define.amd?s?define(s,p):define(p):p()))}function s(e,t,r){i(e,t,r,function(t){a[e]=t.create()})}function l(e){for(var t;(t=e.replace(d,""))!==e;)e=t;return e.replace(m,"")}var u=r.qoopido||(r.qoopido={}),c=u.shared||(u.shared={}),a=u.modules||(u.modules={}),p=[],f=new RegExp("^\\.+\\/"),d=new RegExp("(?:\\/|)[^\\/]*\\/\\.\\."),m=new RegExp("(^\\/)|\\.\\/","g");u.register=i,u.registerSingleton=s,Object.create||p.push("./polyfill/object/create"),Object.getOwnPropertyNames||p.push("./polyfill/object/getownpropertynames"),Object.getOwnPropertyDescriptor&&function(){try{return Object.getOwnPropertyDescriptor({x:0},"x"),!0}catch(e){return!1}}()||p.push("./polyfill/object/getownpropertydescriptor"),i("base",e,p)}(function(e,t,r,n,o,i,s){"use strict";function l(e){for(var t,r={},n=Object.getOwnPropertyNames(e),o=0;(t=n[o])!==s;o++)r[t]=Object.getOwnPropertyDescriptor(e,t);return r}function u(){throw new Error("[Qoopido.js] Operation prohibited")}return{create:function(){var e,t=Object.create(this,l(this));return t._constructor&&(e=t._constructor.apply(t,arguments)),t.create=t.extend=u,e||t},extend:function(e,t){var r;return e=e||{},t=t===!0,e._parent=this,r=Object.create(this,l(e)),t===!0&&(r.extend=u),r}}},navigator,this,document),function(e){window.qoopido.register("polyfill/string/ucfirst",e)}(function(e,t,r,n,o,i,s){"use strict";return String.prototype.ucfirst||(String.prototype.ucfirst=function(){var e=this;return e.charAt(0).toUpperCase()+e.slice(1)}),String.prototype.ucfirst}),function(e){window.qoopido.register("polyfill/string/lcfirst",e)}(function(e,t,r,n,o,i,s){"use strict";return String.prototype.lcfirst||(String.prototype.lcfirst=function(){var e=this;return e.charAt(0).toLowerCase()+e.slice(1)}),String.prototype.lcfirst}),function(e){window.qoopido.register("polyfill/window/getcomputedstyle",e)}(function(e,t,r,n,o,i,s){"use strict";if(o.getComputedStyle)return o.getComputedStyle;var l=new RegExp("(\\-([a-z]){1})","g"),u=function(){return arguments[2].toUpperCase()};return function(e,t){var r=this;return r.getPropertyValue=function(t){return"float"===t&&(t="styleFloat"),l.test(t)&&(t=t.replace(l,u)),e.currentStyle[t]||null},r}}),function(e){window.qoopido.register("polyfill/window/promise",e)}(function(e,t,r,n,o,i,s){"use strict";function l(e,t){var r=E.push([e,t]);1===r&&u()}function u(){o.setTimeout(c,1)}function c(){for(var e,t=0;(e=E[t])!==s;t++)e[0](e[1]);E.length=0}function a(e,t){var r,n=null;try{if(e===t)throw new TypeError("A promises callback cannot return that same promise.");if(("function"==typeof t||"object"==typeof t&&null!==t)&&(n=t.then,"function"==typeof n))return n.call(t,function(n){return r?!0:(r=!0,void(t!==n?d(e,n):m(e,n)))},function(t){return r?!0:(r=!0,void g(e,t))}),!0}catch(o){return r?!0:(g(e,o),!0)}return!1}function p(e,t){function r(e){d(t,e)}function n(e){g(t,e)}try{e(r,n)}catch(o){n(o)}}function f(e,t,r,n){var o,i,s,l,u="function"==typeof r;if(u)try{o=r(n),s=!0}catch(c){l=!0,i=c}else o=n,s=!0;a(t,o)||(u&&s?d(t,o):l?g(t,i):e===j?d(t,o):e===P&&g(t,o))}function d(e,t){e===t?m(e,t):a(e,t)||m(e,t)}function m(e,t){e._state===_&&(e._state=x,e._detail=t,l(h,e))}function g(e,t){e._state===_&&(e._state=x,e._detail=t,l(v,e))}function h(e){w(e,e._state=j)}function v(e){w(e,e._state=P)}function y(e,t,r,n){var o=e._subscribers,i=o.length;o[i]=t,o[i+j]=r,o[i+P]=n}function w(e,t){for(var r,n,o=e._subscribers,i=e._detail,l=0;(r=o[l])!==s;l+=3)n=o[l+t],f(t,r,n,i);e._subscribers=null}function b(e){var t=this;if("function"!=typeof e)throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");t._subscribers=[],p(e,t)}var _=void 0,x=0,j=1,P=2,E=[];return b.prototype={_state:s,_detail:s,_subscribers:s,then:function(e,t){var r=this,n=new b(function(){});return r._state?l(function(){f(r._state,n,arguments[r._state-1],r._detail)}):y(r,n,e,t),n},"catch":function(e){return this.then(null,e)}},o.Promise||(o.Promise=b),o.Promise}),function(e){var t=[];window.Promise||t.push("../polyfill/window/promise"),window.qoopido.register("promise/all",e,t)}(function(e,t,r,n,o,i,s){"use strict";return function(e){if("[object Array]"!==Object.prototype.toString.call(e))throw new TypeError("You must pass an array to all.");return new o.Promise(function(t,r){function n(e){return function(t){o(e,t)}}function o(e,r){l[e]=r,0===--u&&t(l)}var i,l=[],u=e.length,c=0;for(0===u&&t([]);(i=e[c])!==s;c++)i&&"function"==typeof i.then?i.then(n(c),r):o(c,i)})}}),function(e){var t=[];window.Promise||t.push("../polyfill/window/promise"),window.qoopido.register("promise/defer",e,t)}(function(e,t,r,n,o,i,s){"use strict";return function(){var e=this;e.promise=new o.Promise(function(t,r){e.resolve=t,e.reject=r})}}),function(e){var t=["./base","./promise/all","./promise/defer"];String.prototype.ucfirst||t.push("./polyfill/string/ucfirst"),String.prototype.lcfirst||t.push("./polyfill/string/lcfirst"),window.qoopido.registerSingleton("support",e,t)}(function(e,t,r,n,o,i,s){"use strict";function l(e){return e.replace(p,"$1").lcfirst().replace(f,"").replace(d,g)}var u=e["promise/all"],c=e["promise/defer"],a=new RegExp("^(Moz|WebKit|Khtml|ms|O|Icab)(?=[A-Z])"),p=new RegExp("^(?:webkit|khtml|icab|moz|ms|o)([A-Z])"),f=new RegExp("^-(?:webkit|khtml|icab|moz|ms|o)-"),d=new RegExp("-([a-z])","gi"),m=new RegExp("([A-Z])","g"),g=function(){return arguments[1].ucfirst()},h={prefix:null,method:{},property:{},css:{},promises:{prefix:null,method:{},property:{},css:{},test:{}}};return e.base.extend({test:{},pool:t.pool&&t.pool.dom,testMultiple:function(){for(var e,t=[],r=0;(e=arguments[r])!==s;r++)switch(typeof e){case"string":t.push(this.test[e]());break;case"boolean":var n=new c;e?n.resolve():n.reject(),t.push(n.promise);break;default:t.push(e)}return new u(t)},getPrefix:function(){var e,t=this,r=h.prefix||null;if(null===r){var n=t.pool?t.pool.obtain("div"):i.createElement("div"),o=n.style;r=!1;for(e in o)a.test(e)&&(r=e.match(a)[0]);r===!1&&"WebkitOpacity"in o&&(r="WebKit"),r===!1&&"KhtmlOpacity"in o&&(r="Khtml"),r=h.prefix=r===!1?!1:[r.toLowerCase(),r.toLowerCase().ucfirst(),r],n.dispose&&n.dispose()}return r},getMethod:function(e,t){e=l(e),t=t||o;var r=t.tagName,n=h.method[r]=h.method[r]||{},i=n[e]=h.method[r][e]||null;if(null===i){i=!1;var u,c,a=0,p=e.ucfirst(),f=this.getPrefix();for(u=f!==!1?(e+" "+p+" "+f.join(p+" ")+p).split(" "):[e];(c=u[a])!==s;a++)if(t[c]!==s&&("function"==typeof t[c]||"object"==typeof t[c])){i=c;break}h.method[r][e]=i}return i},getProperty:function(e,t){e=l(e),t=t||o;var r=t.tagName,n=h.property[r]=h.property[r]||{},i=n[e]=h.property[r][e]||null;if(null===i){i=!1;var u,c,a=0,p=e.ucfirst(),f=this.getPrefix();for(u=f!==!1?(e+" "+p+" "+f.join(p+" ")+p).split(" "):[e],a;(c=u[a])!==s;a++)if(t[c]!==s){i=c;break}h.property[r][e]=i}return i},getCssProperty:function(e){e=l(e);var t=this,r=h.css[e]||null;if(null===r){r=!1;var n,o=0,u=t.pool?t.pool.obtain("div"):i.createElement("div"),c=e.ucfirst(),a=this.getPrefix()||[],p=(e+" "+c+" "+a.join(c+" ")+c).split(" "),f="";for(o;(n=p[o])!==s;o++)if(u.style[n]!==s){r=n,o>0&&(f="-");break}r=h.css[e]=r!==!1?[f+r.replace(m,"-$1").toLowerCase(),r]:!1,u.dispose&&u.dispose()}return r},supportsPrefix:function(){return!!this.getPrefix()},supportsMethod:function(e,t){return!!this.getMethod(e,t)},supportsProperty:function(e,t){return!!this.getProperty(e,t)},supportsCssProperty:function(e){return!!this.getCssProperty(e)},testPrefix:function(){var e=h.promises.prefix;if(null===e){var t=new c,r=this.getPrefix();r?t.resolve(r):t.reject(),e=h.promises.prefix=t.promise}return e},testMethod:function(e,t){t=t||o;var r=t.tagName,n=h.promises.method[r]=h.promises.method[r]||{},i=n[e]=h.promises.method[r][e]||null;if(null===i){var s=new c,l=this.getMethod(e,t);l?s.resolve(l):s.reject(),i=h.promises.method[r][e]=s.promise}return i},testProperty:function(e,t){t=t||o;var r=t.tagName,n=h.promises.property[r]=h.promises.property[r]||{},i=n[e]=h.promises.property[r][e]||null;if(null===i){var s=new c,l=this.getProperty(e,t);l?s.resolve(l):s.reject(),i=h.promises.property[r][e]=s.promise}return i},testCssProperty:function(e){var t=h.promises.css[e]||null;if(null===t){var r=new c,n=this.getCssProperty(e);n?r.resolve(n):r.reject(),t=h.promises.css[e]=r.promise}return t},addTest:function(e,t){return this.test[e]=function(){var r=h.promises.test[e]||null;if(null===r){var n=new c,o=Array.prototype.slice.call(arguments);o.splice(0,0,n),t.apply(null,o),r=h.promises.test[e]=n.promise}return r}}})}),function(e){window.qoopido.register("function/merge",e)}(function(e,t,r,n,o,i,s){"use strict";return function l(){var e,t,r,n,o,i=arguments[0];for(e=1;(t=arguments[e])!==s;e++)for(r in t)n=i[r],o=t[r],o!==s&&(null!==o&&"object"==typeof o?(n=o.length!==s?n&&"object"==typeof n&&n.length!==s?n:[]:n&&"object"==typeof n&&n.length===s?n:{},i[r]=l(n,o)):i[r]=o);return i}}),function(e){window.qoopido.register("function/unique/uuid",e)}(function(e,t,r,n,o,i,s){"use strict";function l(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(c,function(e){var t=16*Math.random()|0,r="x"===e?t:3&t|8;return r.toString(16)})}var u={},c=new RegExp("[xy]","g");return function(){var e;do e=l();while("undefined"!=typeof u[e]);return u[e]=!0,e}}),function(e){window.qoopido.registerSingleton("hook/event",e,["../base"])}(function(e,t,r,n,o,i,s){"use strict";function l(e,t,r){for(var n,o=0;(n=r[o])!==s;o++)e[n]=t[n];e._properties=e._properties.concat(r)}var u={general:{properties:"type altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which path".split(" "),process:function(e,t){var r;if(e.originalEvent=t,e.isDefaultPrevented=t.defaultPrevented?!0:!1,e.isPropagationStopped=t.cancelBubble?!0:!1,e.metaKey=t.metaKey&&t.metaKey!==!1?!0:!1,e.target||(e.target=t.srcElement||i),3===e.target.nodeType&&(e.target=e.target.parentNode),!e.path){e.path=[],r=e.target;do e.path.push(r);while(r=r.parentNode);e.path.push(o)}}},mouse:{regex:new RegExp("^(?:mouse|pointer|contextmenu|touch|click|dblclick|drag|drop)"),properties:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement dataTransfer".split(" "),process:function(e,t){var r,n,o;n=t.fromElement,o=t.button,null===e.pageX&&null!==t.clientX&&(r=e.target.ownerDocument||i,r=r.documentElement||r.body,e.pageX=t.clientX+(r.scrollLeft||0)-(r.clientLeft||0),e.pageY=t.clientY+(r.scrollTop||0)-(r.clientTop||0)),!e.relatedTarget&&n&&(e.relatedTarget=n===e.target?t.toElement:n),e.which||o===s||(e.which=1&o?1:2&o?3:4&o?2:0)}},key:{regex:new RegExp("^(?:key)"),properties:"char charCode key keyCode".split(" "),process:function(e,t){null===e.which&&(e.which=null!==t.charCode?t.charCode:t.keyCode)}}};return e.base.extend({add:function(e,t){return e&&t&&u[e]&&(u[e]=t),this},get:function(e){return e&&u[e]?u[e]:null},process:function(e,t){var r,n,o;for(r in u)n=u[r],o=!n.regex||n.regex.test(t.type),o&&(n.properties&&l(e,t,n.properties),n.process&&n.process(e,t),n.delegate&&(e.delegate=n.delegate))}})}),function(e){var t=["../base","../support"];window.getComputedStyle||t.push("../polyfill/window/getcomputedstyle"),window.qoopido.registerSingleton("hook/css",e,t)}(function(e,t,r,n,o,i,s){"use strict";var l=e.support,u=o.getComputedStyle||e["polyfill/window/getcomputedstyle"],c={general:{get:function(e,t){return u(e,null).getPropertyValue(t[0])},set:function(e,t,r){e.style[t[1]]=r}},opacity:l.supportsCssProperty("opacity")?null:{regex:new RegExp("alpha\\(opacity=(.*)\\)","i"),get:function(e,t,r){return r=u(e,null).getPropertyValue("filter").toString().match(this.regex),r=r?r[1]/100:1},set:function(e,t,r){var n=e.style;n.zoom=1,n.filter="alpha(opacity="+(100*r+.5>>0)+")"}}};return e.base.extend({add:function(e,t){return e&&t&&c[e]&&(c[e]=t),this},get:function(e){return e&&c[e]?c[e]:null},process:function(e,t,r,n){var o;return r=l.getCssProperty(r,t)||null,r?((o=this.get(r[1]))&&o[e]||this.get("general")[e])(t,r,n):void 0}})}),function(e){window.qoopido.register("dom/event",e,["../base","../hook/event"])}(function(e,t,r,n,o,i,s){"use strict";var l=e["hook/event"];return e.base.extend({originalEvent:null,isDelegate:!1,isDefaultPrevented:!1,isPropagationStopped:!1,isImmediatePropagationStopped:!1,_properties:null,_constructor:function(e){var t=this;return t._properties=[],t._obtain(e),t},_obtain:function(e){l.process(this,e)},_dispose:function(){for(var e,t=this,r=0;(e=t._properties[r])!==s;r++)delete t[e];delete t.delegate,t.originalEvent=null,t.isDelegate=!1,t.isDefaultPrevented=!1,t.isPropagationStopped=!1,t.isImmediatePropagationStopped=!1,t._properties.length=0},preventDefault:function(){var e=this,t=e.originalEvent;t.cancelable!==!1&&(e.isDefaultPrevented=!0,t.preventDefault?t.preventDefault():t.returnValue=!1)},stopPropagation:function(){var e=this,t=e.originalEvent;e.isPropagationStopped=!0,t.stopPropagation&&t.stopPropagation(),t.cancelBubble=!0},stopImmediatePropagation:function(){var e=this,t=e.originalEvent;e.isImmediatePropagationStopped=!0,t.stopImmediatePropagation&&t.stopImmediatePropagation(),e.stopPropagation()}})}),function(e){var t=["../base","../function/unique/uuid","../hook/css","./event"];window.CustomEvent||t.push("../polyfill/window/customevent"),window.addEventListener||t.push("../polyfill/window/addeventlistener"),window.removeEventListener||t.push("../polyfill/window/removeeventlistener"),window.dispatchEvent||t.push("../polyfill/window/dispatchevent"),Element.prototype.matches||t.push("../polyfill/element/matches"),document.querySelector||t.push("../polyfill/document/queryselector"),document.querySelectorAll||t.push("../polyfill/document/queryselectorall"),String.prototype.trim||t.push("../polyfill/string/trim"),window.qoopido.register("dom/element",e,t)}(function(e,t,r,n,o,i,s){"use strict";function l(e){var t,r,n;for(t in E)r=E[t],(!r.regex||r.regex.test(e))&&(n=r);return n}function u(e,t,r){var n=this,o=l(e),s=i.createEvent(o.type);s[o.method](e,"load"===e?!1:!0,!0,t),r&&(s._quid=r,s.isDelegate=!0),n.element.dispatchEvent(s)}function c(e){var t;if("string"==typeof e)try{w.test(e)===!0?(t=e.replace(w,"$1").toLowerCase(),e=i.createElement(t)):e=i.querySelector(e)}catch(r){e=null}if(!e)throw new Error("[Qoopido.js] Element could not be resolved");return e}function a(e){return Array.prototype.concat.apply([],Array.prototype.splice.call(e,0)).join(" ").split(_)}function p(e,t){for(var r,n=0;(r=e.path[n])!==s;n++){if(r.matches(t))return e.currentTarget=r,!0;if(r===e.currentTarget)break}return!1}var f="object",d="string",m=e["function/unique/uuid"],g=i.getElementsByTagName("head")[0],h="textContent"in i.createElement("a")?"textContent":"innerText",v="undefined"!=typeof g.previousElementSibling?function(){return this.previousElementSibling}:function(){for(var e=this;e=e.previousSibling;)if(1===e.nodeType)return e},y="undefined"!=typeof g.nextElementSibling?function(){return this.nextElementSibling}:function(){for(var e=this;e=e.nextSibling;)if(1===e.nodeType)return e},w=new RegExp("^<(\\w+)\\s*/>$"),b=new RegExp("^[^-]+"),_=new RegExp(" +","g"),x=e["pool/module"]&&e["pool/module"].create(e["dom/event"],null,!0)||null,j=e["hook/css"],P={},E={custom:{type:"CustomEvent",method:"initCustomEvent"},html:{regex:new RegExp("^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$"),type:"HTMLEvents",method:"initEvent"},mouse:{regex:new RegExp("^(?:mouse|pointer|contextmenu|touch|click|dblclick|drag|drop)"),type:"MouseEvents",method:"initMouseEvent"}};return e.base.extend({type:null,element:null,_listener:null,_constructor:function(e,t,r){var n,o=this;return e=c(e),n=e._quid,n?o=P[n]:(n=e._quid=m(),o.type=e.tagName,o.element=e,o._listener={},P[n]=o),"object"==typeof t&&null!==t&&o.setAttributes(t),"object"==typeof r&&null!==r&&o.setStyles(r),o!==this&&this.dispose&&this.dispose(),o},_obtain:function(e,t,r){this._constructor(e,t,r)},_dispose:function(){var e,t,r=this;for(e in r._listener)t=e.match(b),r.element.removeEventListener(t,r._listener[e]),delete r._listener[e];r.type=null,r.element=null},getContent:function(e){var t=this.element;return e&&e!==!1?t.innerHTML:t[h]},setContent:function(e,t){var r=this,n=r.element;return t&&t!==!1?n.innerHTML=e:n[h]=e,r},getAttribute:function(e){var t=this;return e&&typeof e===d?t.element.getAttribute(e):void 0},getAttributes:function(){for(var e,t=this,r={},n=a(arguments),o=0;(e=n[o])!==s;o++)r[e]=t.element.getAttribute(e);return r},setAttribute:function(e,t){var r=this;return e&&typeof e===d&&r.element.setAttribute(e,t),r},setAttributes:function(e){var t,r=this;if(e&&typeof e===f&&!e.length)for(t in e)r.element.setAttribute(t,e[t]);return r},removeAttribute:function(e){var t=this;return e&&typeof e===d&&t.element.removeAttribute(e),t},removeAttributes:function(){for(var e,t=this,r=a(arguments),n=0;(e=r[n])!==s;n++)t.element.removeAttribute(e);return t},getStyle:function(e){var t=this;return e&&typeof e===d?j.process("get",t.element,e):void 0},getStyles:function(){for(var e,t=this,r={},n=a(arguments),o=0;(e=n[o])!==s;o++)r[e]=j.process("get",t.element,e);return r},setStyle:function(e,t){var r=this;return e&&typeof e===d&&j.process("set",r.element,e,t),r},setStyles:function(e){var t,r=this;if(e&&typeof e===f&&!e.length)for(t in e)j.process("set",r.element,t,e[t]);return r},removeStyle:function(e){var t=this;return e&&typeof e===d&&t.setStyle(e,""),t},removeStyles:function(){for(var e,t=this,r=a(arguments),n=0;(e=r[n])!==s;n++)t.setStyle(e,"");return t},siblings:function(e){for(var t=this.element,r=t.parentNode.firstChild,n=[];r;r=y.call(r))r===t||e&&!r.matches(e)||n.push(r);return n},siblingsBefore:function(e){for(var t=this.element.previousSibling,r=[];t;t=v.call(t))(!e||t.matches(e))&&r.push(t);return r},siblingsAfter:function(e){for(var t=this.element.nextSibling,r=[];t;t=y.call(t))(!e||t.matches(e))&&r.push(t);return r},previous:function(e){var t=v.call(this.element);if(!e)return t;for(;t;t=v.call(t))if(t.matches(e))return t},next:function(e){var t=y.call(this.element);if(!e)return t;for(;t;t=y.call(t))if(t.matches(e))return t},find:function(e){var t,r,n=this.element;return e=e.trim(),">"===e.charAt(0)?(t=n._quid,n.setAttribute("data-quid",t),e='[data-quid="'+t+'"] '+e,r=n.parentNode.querySelectorAll(e),n.removeAttribute("data-quid")):r=n.querySelectorAll(e),r},parent:function(e){var t;if(!e)return this.element.parentNode;for(t=this.element;t;t=t.parentNode)if(t.matches(e))return t},parents:function(e){for(var t=this.element.parentNode,r=[];t;t=t.parentNode){if(9===t.nodeType)return r;1===t.nodeType&&(!e||t.matches(e))&&r.push(t)}},isVisible:function(){var e=this,t=e.element;return!(t.offsetWidth<=0&&t.offsetHeight<=0||"hidden"===e.getStyle("visibility")||e.getStyle("opacity")<=0)},hasClass:function(e){return e?new RegExp("(?:^|\\s)"+e+"(?:\\s|$)").test(this.element.className):!1},addClass:function(e){var t=this;return e&&!t.hasClass(e)&&(t.element.className+=t.element.className?" "+e:e),t},removeClass:function(e){var t=this;return e&&t.hasClass(e)&&(t.element.className=t.element.className.replace(new RegExp("(?:^|\\s)"+e+"(?!\\S)"),"")),t},toggleClass:function(e){var t=this;return e&&(t.hasClass(e)?t.removeClass(e):t.addClass(e)),t},prepend:function(e){var t=this,r=t.element;if(e)try{e=e.element||c(e),r.firstChild?r.insertBefore(e,r.firstChild):t.append(e)}catch(n){r.insertAdjacentHTML("afterBegin",e)}return t},append:function(e){var t=this,r=t.element;if(e)try{r.appendChild(e.element||c(e))}catch(n){r.insertAdjacentHTML("beforeEnd",e)}return t},prependTo:function(e){var t=this,r=t.element;return e&&((e=e.element||c(e)).firstChild?e.insertBefore(r,e.firstChild):t.appendTo(e)),t},appendTo:function(e){var t=this;return e&&(e.element||c(e)).appendChild(t.element),t},insertBefore:function(e){var t=this,r=t.element;return e&&(e=e.element||c(e)).parentNode.insertBefore(r,e),t},insertAfter:function(e){var t=this,r=t.element;return e&&((e=e.element||c(e)).nextSibling?e.parentNode.insertBefore(r,e.nextSibling):t.appendTo(e.parentNode)),t},replace:function(e){var t=this,r=t.element;return e&&(e=e.element||c(e)).parentNode.replaceChild(r,e),t},replaceWith:function(e){var t=this,r=t.element;return e&&(e=e.element||c(e),r.parentNode.replaceChild(e,r)),t},remove:function(){var e=this,t=e.element;return t.parentNode.removeChild(t),e},on:function(t){var r,n=this,o=n.element,i=arguments.length>2?arguments[1]:null,l=arguments.length>2?arguments[2]:arguments[1],c=l._quid||(l._quid=m()),a=0;for(t=t.split(" ");(r=t[a])!==s;a++){var f=r+"-"+c,d=function(t){var r;t=x&&x.obtain(t)||e["dom/event"].create(t),t.isPropagationStopped||(r=t.delegate,t._quid=m(),(!i||p(t,i))&&l.call(t.currentTarget,t,t.originalEvent.detail),r&&(delete t.delegate,u.call(n,r))),t.dispose&&t.dispose()};d.type=r,n._listener[f]=d,o.addEventListener(r,d)}return n},one:function(e){var t=this,r=arguments.length>3||"string"==typeof arguments[1]?arguments[1]:null,n=arguments.length>3||"function"==typeof arguments[2]?arguments[2]:arguments[1],o=(arguments.length>3?arguments[3]:arguments[2])!==!1,i=function(r){t.off(o===!0?r.type:e,i),n.call(this,r,r.originalEvent.detail)};return n._quid=i._quid=m(),r?t.on(e,r,i):t.on(e,i),t},off:function(e,t){var r,n,o,i=this,l=i.element,u=0;for(e=e.split(" ");(r=e[u])!==s;u++)n=t._quid&&r+"-"+t._quid||null,o=n&&i._listener[n]||null,o?(l.removeEventListener(r,o),delete i._listener[n]):l.removeEventListener(r,t);return i},emit:function(e,t){var r=this;return u.call(r,e,t),r}})}),function(e){window.qoopido.register("dom/element/emerge",e,["../element","../../function/merge","../../function/unique/uuid"])}(function(e,t,r,n,o,i,s){"use strict";function l(e){var t,r=v[e];for(t in r)"length"!==t&&a.call(r[t]);0===r.length&&(o.element.clearInterval(h[e]),delete h[e])}function u(){g.left=0,g.top=0,g.right=o.innerWidth||m.clientWidth,g.bottom=o.innerHeight||m.clientHeight}function c(){var e=this,t=e._settings.threshold,r=t!==s?t:m.clientWidth*e._settings.auto,n=t!==s?t:m.clientHeight*e._settings.auto;e._viewport.left=g.left-r,e._viewport.top=g.top-n,e._viewport.right=g.right+r,e._viewport.bottom=g.bottom+n}function a(){var e,t=this,r=!1,n=2;!t.isVisible()||"hidden"===t.getStyle("visibility")&&t._settings.visibility!==!1||(e=t.element.getBoundingClientRect(),(e.bottom>=t._viewport.top&&e.bottom<=t._viewport.bottom||e.top>=t._viewport.top&&e.top<=t._viewport.bottom||t._viewport.bottom>=e.top&&t._viewport.bottom<=e.bottom||t._viewport.top>=e.top&&t._viewport.top<=e.bottom)&&(e.left>=t._viewport.left&&e.left<=t._viewport.right||e.right>=t._viewport.left&&e.right<=t._viewport.right||t._viewport.left>=e.left&&t._viewport.left<=e.right||t._viewport.right>=e.left&&t._viewport.right<=e.right)&&((0===t._settings.threshold||(e.bottom>=g.top&&e.bottom<=g.bottom||e.top>=g.top&&e.top<=g.bottom||g.bottom>=e.top&&g.bottom<=e.bottom||g.top>=e.top&&g.top<=e.bottom)&&(e.left>=g.left&&e.left<=g.right||e.right>=g.left&&e.right<=g.right||g.left>=e.left&&g.left<=e.right||g.right>=e.left&&g.right<=e.right))&&(n=1),r=!0)),(r!==t._state||r===!0&&n!==t._priority)&&p.call(t,r,n)}function p(e,t){var r=this;r._state=e,r._priority=t,r._settings.recur!==!0&&r.remove(),e===!0?r.emit(y,t):r.emit(w)}var f,d={interval:50,threshold:"auto",recur:!0,auto:1,visibility:!0},m=o.document.documentElement,g={},h={},v={},y="emerged",w="demerged",b="resize orientationchange";if(o=e["dom/element"].create(o),"CSS1Compat"!==i.compatMode)throw"[Qoopido.js] Not in standards mode";return f=e["dom/element"].extend({_quid:null,_viewport:null,_settings:null,_state:null,_priority:null,_constructor:function(t,r){var n=f._parent._constructor.call(this,t);return r=e["function/merge"]({},d,r||{}),"auto"===r.threshold&&delete r.threshold,h[r.interval]===s&&(v[r.interval]=v[r.interval]||{length:0},h[r.interval]=o.element.setInterval(function(){l(r.interval)},r.interval)),n._quid=e["function/unique/uuid"](),n._viewport={},n._settings=r,n._state=!1,n._priority=2,v[r.interval][n._quid]=n,v[r.interval].length++,o.on(b,function(){c.call(n)}),c.call(n),n},remove:function(){var e=this;delete v[e._settings.interval][e._quid],v[e._settings.interval].length--}}),o.on(b,u),u(),f}),function(e){window.qoopido.register("dom/element/lazyimage",e,["./emerge","../../function/merge"])}(function(e,t,r,n,o,i,s){"use strict";function l(){var e=this,t=e._settings.attribute;a+=1,e.emit(p).one(v,function(t){e.emit(t.type===g?f:d),a-=1},!1).setAttribute("src",e.getAttribute(t)).removeAttribute(t)}var u,c={interval:50,threshold:"auto",attribute:"data-lazyimage"},a=0,p="requested",f="loaded",d="failed",m="emerged",g="load",h="error",v="".concat(g," ",h);return u=e["dom/element/emerge"].extend({_constructor:function(t,r){var n=u._parent._constructor.call(this,t,e["function/merge"]({},c,r||{}));return n.on(m,function o(e){(0===a||1===e.data)&&(n.remove(),n.off(m,o),l.call(n))}),n}})});