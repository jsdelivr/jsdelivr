/*!
* Qoopido.js library v3.5.4, 2014-9-30
* https://github.com/dlueth/qoopido.js
* (c) 2014 Dirk Lueth
* Dual licensed under MIT and GPL
*/
!function(t){window.qoopido.register("polyfill/window/promise",t)}(function(t,n,r,e,o,i,u){"use strict";function s(t,n){var r=j.push([t,n]);1===r&&c()}function c(){o.setTimeout(f,1)}function f(){for(var t,n=0;(t=j[n])!==u;n++)t[0](t[1]);j.length=0}function a(t,n){var r,e=null;try{if(t===n)throw new TypeError("A promises callback cannot return that same promise.");if(("function"==typeof n||"object"==typeof n&&null!==n)&&(e=n.then,"function"==typeof e))return e.call(n,function(e){return r?!0:(r=!0,void(n!==e?h(t,e):p(t,e)))},function(n){return r?!0:(r=!0,void v(t,n))}),!0}catch(o){return r?!0:(v(t,o),!0)}return!1}function l(t,n){function r(t){h(n,t)}function e(t){v(n,t)}try{t(r,e)}catch(o){e(o)}}function _(t,n,r,e){var o,i,u,s,c="function"==typeof r;if(c)try{o=r(e),u=!0}catch(f){s=!0,i=f}else o=e,u=!0;a(n,o)||(c&&u?h(n,o):s?v(n,i):t===T?h(n,o):t===E&&v(n,o))}function h(t,n){t===n?p(t,n):a(t,n)||p(t,n)}function p(t,n){t._state===g&&(t._state=P,t._detail=n,s(b,t))}function v(t,n){t._state===g&&(t._state=P,t._detail=n,s(m,t))}function b(t){d(t,t._state=T)}function m(t){d(t,t._state=E)}function y(t,n,r,e){var o=t._subscribers,i=o.length;o[i]=n,o[i+T]=r,o[i+E]=e}function d(t,n){for(var r,e,o=t._subscribers,i=t._detail,s=0;(r=o[s])!==u;s+=3)e=o[s+n],_(n,r,e,i);t._subscribers=null}function w(t){var n=this;if("function"!=typeof t)throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");n._subscribers=[],l(t,n)}var g=void 0,P=0,T=1,E=2,j=[];return w.prototype={_state:u,_detail:u,_subscribers:u,then:function(t,n){var r=this,e=new w(function(){});return r._state?s(function(){_(r._state,e,arguments[r._state-1],r._detail)}):y(r,e,t,n),e},"catch":function(t){return this.then(null,t)}},o.Promise||(o.Promise=w),o.Promise});