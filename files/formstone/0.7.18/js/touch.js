/*! formstone v0.7.18 [touch.js] 2015-08-30 | MIT License | formstone.it */

!function(a,b){"use strict";function c(a){a.touches=[],a.touching=!1,this.on(r.dragStart,s.killEvent),a.tap?(a.pan=!1,a.scale=!1,a.swipe=!1,this.on([r.touchStart,r.pointerDown].join(" "),a,f),this.on(r.click,a,k)):(a.pan||a.swipe||a.scale)&&(a.tap=!1,a.swipe&&(a.pan=!0),a.scale&&(a.axis=!1),a.axis?(a.axisX="x"===a.axis,a.axisY="y"===a.axis):o(this,"none"),this.on([r.touchStart,r.pointerDown].join(" "),a,e),this.on(r.mouseDown,a,f))}function d(){this.off(r.namespace),o(this,"")}function e(a){a.preventManipulation&&a.preventManipulation();var b=a.data,c=a.originalEvent;if(c.type.match(/(up|end)$/i))return void j(a);if(c.pointerId){var d=!1;for(var e in b.touches)b.touches[e].id===c.pointerId&&(d=!0,b.touches[e].pageX=c.clientX,b.touches[e].pageY=c.clientY);d||b.touches.push({id:c.pointerId,pageX:c.clientX,pageY:c.clientY})}else b.touches=c.touches;c.type.match(/(down|start)$/i)?f(a):c.type.match(/move$/i)&&g(a)}function f(b){var c=b.data,d="undefined"!==a.type(c.touches)?c.touches[0]:null;if(c.touching||(c.startE=b.originalEvent,c.startX=d?d.pageX:b.pageX,c.startY=d?d.pageY:b.pageY,c.startT=(new Date).getTime(),c.scaleD=1,c.passed=!1),c.tap)c.clicked=!1,c.$el.on([r.touchMove,r.pointerMove].join(" "),c,e).on([r.touchEnd,r.touchCancel,r.pointerUp,r.pointerCancel].join(" "),c,e);else if(c.pan||c.scale){c.$links&&c.$links.off(r.click);var f=l(c.scale?r.scaleStart:r.panStart,b,c.startX,c.startY,c.scaleD,0,0,"","");if(c.scale&&c.touches&&c.touches.length>=2){var h=c.touches;c.pinch={startX:m(h[0].pageX,h[1].pageX),startY:m(h[0].pageY,h[1].pageY),startD:n(h[1].pageX-h[0].pageX,h[1].pageY-h[0].pageY)},f.pageX=c.startX=c.pinch.startX,f.pageY=c.startY=c.pinch.startY}c.touching||(c.touching=!0,c.pan&&t.on(r.mouseMove,c,g).on(r.mouseUp,c,j),t.on([r.touchMove,r.touchEnd,r.touchCancel,r.pointerMove,r.pointerUp,r.pointerCancel].join(" "),c,e),c.$el.trigger(f))}}function g(b){var c=b.data,d="undefined"!==a.type(c.touches)?c.touches[0]:null,e=d?d.pageX:b.pageX,f=d?d.pageY:b.pageY,g=e-c.startX,h=f-c.startY,i=g>0?"right":"left",k=h>0?"down":"up",o=Math.abs(g)>u,p=Math.abs(h)>u;if(c.tap)(o||p)&&c.$el.off([r.touchMove,r.touchEnd,r.touchCancel,r.pointerMove,r.pointerUp,r.pointerCancel].join(" "));else if(c.pan||c.scale)if(!c.passed&&c.axis&&(c.axisX&&p||c.axisY&&o))j(b);else{!c.passed&&(!c.axis||c.axis&&c.axisX&&o||c.axisY&&p)&&(c.passed=!0),c.passed&&(s.killEvent(b),s.killEvent(c.startE));var q=!0,t=l(c.scale?r.scale:r.pan,b,e,f,c.scaleD,g,h,i,k);if(c.scale)if(c.touches&&c.touches.length>=2){var v=c.touches;c.pinch.endX=m(v[0].pageX,v[1].pageX),c.pinch.endY=m(v[0].pageY,v[1].pageY),c.pinch.endD=n(v[1].pageX-v[0].pageX,v[1].pageY-v[0].pageY),c.scaleD=c.pinch.endD/c.pinch.startD,t.pageX=c.pinch.endX,t.pageY=c.pinch.endY,t.scale=c.scaleD,t.deltaX=c.pinch.endX-c.pinch.startX,t.deltaY=c.pinch.endY-c.pinch.startY}else c.pan||(q=!1);q&&c.$el.trigger(t)}}function h(b,c){b.on(r.click,c,i);var d=a._data(b[0],"events").click;d.unshift(d.pop())}function i(a){s.killEvent(a,!0),a.data.$links.off(r.click)}function j(b){var c=b.data;if(c.tap)c.$el.off([r.touchMove,r.touchEnd,r.touchCancel,r.pointerMove,r.pointerUp,r.pointerCancel,r.mouseMove,r.mouseUp].join(" ")),c.startE.preventDefault(),k(b);else if(c.pan||c.scale){var d="undefined"!==a.type(c.touches)?c.touches[0]:null,e=d?d.pageX:b.pageX,f=d?d.pageY:b.pageY,g=e-c.startX,i=f-c.startY,j=(new Date).getTime(),m=c.scale?r.scaleEnd:r.panEnd,n=g>0?"right":"left",o=i>0?"down":"up",p=Math.abs(g)>1,q=Math.abs(i)>1;if(c.swipe&&Math.abs(g)>u&&j-c.startT<v&&(m=r.swipe),c.axis&&(c.axisX&&q||c.axisY&&p)||p||q){c.$links=c.$el.find("a");for(var s=0,w=c.$links.length;w>s;s++)h(c.$links.eq(s),c)}var x=l(m,b,e,f,c.scaleD,g,i,n,o);t.off([r.touchMove,r.touchEnd,r.touchCancel,r.mouseMove,r.mouseUp,r.pointerMove,r.pointerUp,r.pointerCancel].join(" ")),c.$el.trigger(x),c.touches=[],c.scale}c.touching=!1}function k(a){s.killEvent(a);var b=a.data;if(!b.clicked){"click"!==a.type&&(b.clicked=!0);var c=b.startE?b.startX:a.pageX,d=b.startE?b.startY:a.pageY,e=l(r.tap,a.originalEvent,c,d,1,0,0);b.$el.trigger(e)}}function l(b,c,d,e,f,g,h,i,j){return a.Event(b,{originalEvent:c,bubbles:!0,pageX:d,pageY:e,scale:f,deltaX:g,deltaY:h,directionX:i,directionY:j})}function m(a,b){return(a+b)/2}function n(a,b){return Math.sqrt(a*a+b*b)}function o(a,b){a.css({"-ms-touch-action":b,"touch-action":b})}var p=!b.window.PointerEvent,q=b.Plugin("touch",{widget:!0,defaults:{axis:!1,pan:!1,scale:!1,swipe:!1,tap:!1},methods:{_construct:c,_destruct:d},events:{pointerDown:p?"MSPointerDown":"pointerdown",pointerUp:p?"MSPointerUp":"pointerup",pointerMove:p?"MSPointerMove":"pointermove",pointerCancel:p?"MSPointerCancel":"pointercancel"}}),r=q.events,s=q.functions,t=b.$window,u=10,v=50;r.tap="tap",r.pan="pan",r.panStart="panstart",r.panEnd="panend",r.scale="scale",r.scaleStart="scalestart",r.scaleEnd="scaleend",r.swipe="swipe"}(jQuery,Formstone);