/*
 * Swiper 3D Flow 2.1.0
 * 3D Flow plugin for Swiper
 *
 * http://www.idangero.us/sliders/swiper/plugins/3dflow.php
 *
 * Copyright 2010-2014, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 *
 * Licensed under GPL & MIT
 *
 * Released on: January 28, 2014
*/
Swiper.prototype.plugins.tdFlow=function(a,b){function c(){h=!0,e=a.slides;for(var b=0;b<e.length;b++)a.setTransition(e[b],0);if(i){f=a.h.getWidth(a.wrapper),g=f/e.length;for(var b=0;b<e.length;b++)e[b].swiperSlideOffset=e[b].offsetLeft}else{f=a.h.getHeight(a.wrapper),g=f/e.length;for(var b=0;b<e.length;b++)e[b].swiperSlideOffset=e[b].offsetTop}}function d(c){if(h){for(var c=c||{x:0,y:0,z:0},d=i?-c.x+a.width/2:-c.y+a.height/2,e=i?b.rotate:-b.rotate,f=b.depth,j=0;j<a.slides.length;j++){var k=a.slides[j].swiperSlideOffset,l=(d-k-g/2)/g*b.modifier,m=i?e*l:0,n=i?0:e*l,o=-f*Math.abs(l),p=i?0:b.stretch*l,q=i?b.stretch*l:0;Math.abs(q)<.001&&(q=0),Math.abs(p)<.001&&(p=0),Math.abs(o)<.001&&(o=0),Math.abs(m)<.001&&(m=0),Math.abs(n)<.001&&(n=0);var r="translate3d("+q+"px,"+p+"px,"+o+"px)  rotateX("+n+"deg) rotateY("+m+"deg)";if(a.setTransform(a.slides[j],r),a.slides[j].style.zIndex=-Math.abs(Math.round(l))+1,b.shadows){var s=a.slides[j].querySelector(i?".swiper-slide-shadow-left":".swiper-slide-shadow-top"),t=a.slides[j].querySelector(i?".swiper-slide-shadow-right":".swiper-slide-shadow-bottom");t.style.opacity=-l>0?-l:0,s.style.opacity=l>0?l:0}}if(a.browser.ie10||a.browser.ie11){var u=a.wrapper.style;u.perspectiveOrigin=d+"px 50%"}}}if(a.support.transforms3d){var e,f,g,h,i="horizontal"==a.params.mode;if(b){var j={rotate:50,stretch:0,depth:100,modifier:1,shadows:!0};b=b||{};for(var k in j)k in b||(b[k]=j[k]);var l={onFirstInit:function(){if(e=a.slides,b.shadows){var f=document.createElement("div"),g=document.createElement("div");f.className=i?"swiper-slide-shadow-left":"swiper-slide-shadow-top",g.className=i?"swiper-slide-shadow-right":"swiper-slide-shadow-bottom";for(var h=0;h<e.length;h++)e[h].appendChild(f.cloneNode()),e[h].appendChild(g.cloneNode())}c(),d({x:a.getWrapperTranslate("x"),y:a.getWrapperTranslate("y"),z:a.getWrapperTranslate("z")})},onInit:function(){c(),d({x:a.getWrapperTranslate("x"),y:a.getWrapperTranslate("y"),z:a.getWrapperTranslate("z")})},onSetWrapperTransform:function(a){d(a)},onSetWrapperTransition:function(c){for(var d=0;d<a.slides.length;d++)a.setTransition(a.slides[d],c.duration),i&&b.shadows?(a.setTransition(a.slides[d].querySelector(".swiper-slide-shadow-left"),c.duration),a.setTransition(a.slides[d].querySelector(".swiper-slide-shadow-right"),c.duration)):b.shadows&&(a.setTransition(a.slides[d].querySelector(".swiper-slide-shadow-top"),c.duration),a.setTransition(a.slides[d].querySelector(".swiper-slide-shadow-bottom"),c.duration))}};return l}}};