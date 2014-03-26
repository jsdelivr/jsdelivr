YUI.add("gallery-soon",function(e,t){"use strict";
/*!
based on setImmediate.js. https://github.com/NobleJS/setImmediate
Copyright (c) 2011 Barnesandnoble.com, llc and Donavon West
https://github.com/NobleJS/setImmediate/blob/master/MIT-LICENSE.txt
*/
;function s(e){return function(){throw e}}function o(){var e=i,t=0,n=e.length;i=[];for(;t<n;t++)try{e[t]()}catch(r){setTimeout(s(r),0)}}var n=e.soon,r=e.config.win,i=[];if(n._impl!=="setTimeout")return;typeof MutationObserver!="undefined"?function(){var t=e.config.doc.createElement("div"),r=new MutationObserver(o);r.observe(t,{attributes:!0}),n._asynchronizer=function(n){i.push(n)===1&&t.setAttribute("foo",e.guid())},n._impl="MutationObserver"}():typeof MessageChannel!="undefined"?function(){var e=new MessageChannel,t=function(){setTimeout(function(){t=function(){e.port2.postMessage(0)},o()},0)};e.port1.onmessage=o,n._asynchronizer=function(e){i.push(e)===1&&t()},n._impl="MessageChannel"}():"postMessage"in r&&!("importScripts"in r)&&function(){function a(e){e.data===u&&o()}var t=r.onmessage,s=!0,u=e.guid();r.onmessage=function(){s=!1},r.postMessage("","*"),r.onmessage=t,s&&(r.addEventListener?r.addEventListener("message",a,!1):r.attachEvent("onmessage",a),n._asynchronizer=function(e){i.push(e)===1&&r.postMessage(u,"*")},n._impl="postMessage")}()},"@VERSION@",{requires:["node-base","timers"]});
