/*! formstone v0.7.4 [equalize.js] 2015-07-17 | MIT License | formstone.it */

!function(a,b){"use strict";function c(){n.iterate.call(o,g)}function d(){o=a(l.element)}function e(b){b.maxWidth=b.maxWidth===1/0?"100000px":b.maxWidth,b.mq="(min-width:"+b.minWidth+") and (max-width:"+b.maxWidth+")",b.type="height"===b.property?"outerHeight":"outerWidth",b.target?a.isArray(b.target)||(b.target=[b.target]):b.target=["> *"],d(),a.fsMediaquery("bind",b.rawGuid,b.mq,{enter:function(){i.call(b.$el,b)},leave:function(){h.call(b.$el,b)}})}function f(b){j(b),a.fsMediaquery("unbind",b.rawGuid),d()}function g(a){if(a.data&&(a=a.data),a.enabled)for(var b,c,d,e=0;e<a.target.length;e++){b=0,c=0,d=a.$el.find(a.target[e]),d.css(a.property,"");for(var f=0;f<d.length;f++)c=d.eq(f)[a.type](),c>b&&(b=c);d.css(a.property,b)}}function h(a){a.enabled&&(a.enabled=!1,j(a))}function i(a){if(!a.enabled){a.enabled=!0;var b=a.$el.find("img");b.length&&b.on(m.load,a,g),g(a)}}function j(a){for(var b=0;b<a.target.length;b++)a.$el.find(a.target[b]).css(a.property,"");a.$el.find("img").off(m.namespace)}var k=b.Plugin("equalize",{widget:!0,priority:5,defaults:{maxWidth:1/0,minWidth:"0px",property:"height",target:null},methods:{_construct:e,_destruct:f,_resize:c}}),l=k.classes,m=(l.raw,k.events),n=k.functions,o=[]}(jQuery,Formstone);