/*!
 * meny 1.2
 * http://lab.hakim.se/meny
 * MIT licensed
 *
 * Created by Hakim El Hattab (http://hakim.se, @hakimel)
 */
var Meny={create:function(a){return(function(){if(!a||!a.menuElement||!a.contentsElement){throw"You need to specify which menu and contents elements to use.";
}if(a.menuElement.parentNode!==a.contentsElement.parentNode){throw"The menu and contents elements must have the same parent.";}var J="top",K="right",c="bottom",N="left";
var F="WebkitPerspective" in document.body.style||"MozPerspective" in document.body.style||"msPerspective" in document.body.style||"OPerspective" in document.body.style||"perspective" in document.body.style;
var D={width:300,height:300,position:N,threshold:40,overlap:6,transitionDuration:"0.5s",transitionEasing:"ease"};var e={menu:a.menuElement,contents:a.contentsElement,wrapper:a.menuElement.parentNode,cover:null};
var A=e.wrapper.offsetLeft,z=e.wrapper.offsetTop,t=null,r=null,q=null,o=null,f=false,m=false;var l,j,G,n,O,V,S,x,d,B;var w,y,E;Meny.extend(D,a);i();g();
v();C();Q();R();function i(){G="";S="";switch(D.position){case J:l="50% 0%";j="rotateX( 30deg ) translateY( -100% ) translateY( "+D.overlap+"px )";V="50% 0";
x="translateY( "+D.height+"px ) rotateX( -15deg )";n={top:"-"+(D.height-D.overlap)+"px"};O={top:"0px"};d={top:"0px"};B={top:D.height+"px"};break;case K:l="100% 50%";
j="rotateY( 30deg ) translateX( 100% ) translateX( -2px ) scale( 1.01 )";V="100% 50%";x="translateX( -"+D.width+"px ) rotateY( -15deg )";n={right:"-"+(D.width-D.overlap)+"px"};
O={right:"0px"};d={left:"0px"};B={left:"-"+D.width+"px"};break;case c:l="50% 100%";j="rotateX( -30deg ) translateY( 100% ) translateY( -"+D.overlap+"px )";
V="50% 100%";x="translateY( -"+D.height+"px ) rotateX( 15deg )";n={bottom:"-"+(D.height-D.overlap)+"px"};O={bottom:"0px"};d={top:"0px"};B={top:"-"+D.height+"px"};
break;default:l="100% 50%";j="translateX( -100% ) translateX( "+D.overlap+"px ) scale( 1.01 ) rotateY( -30deg )";V="0 50%";x="translateX( "+D.width+"px ) rotateY( 15deg )";
n={left:"-"+(D.width-D.overlap)+"px"};O={left:"0px"};d={left:"0px"};B={left:D.width+"px"};break;}}function g(){Meny.addClass(e.wrapper,"meny-"+D.position);
e.wrapper.style[Meny.prefix("perspective")]="800px";e.wrapper.style[Meny.prefix("perspectiveOrigin")]=V;}function v(){e.cover=document.createElement("div");
e.cover.style.position="absolute";e.cover.style.display="block";e.cover.style.width="100%";e.cover.style.height="100%";e.cover.style.left=0;e.cover.style.top=0;
e.cover.style.zIndex=1000;e.cover.style.visibility="hidden";e.cover.style.opacity=0;try{e.cover.style.background="rgba( 0, 0, 0, 0.4 )";e.cover.style.background="-ms-linear-gradient("+D.position+", rgba(0,0,0,0.20) 0%,rgba(0,0,0,0.65) 100%)";
e.cover.style.background="-moz-linear-gradient("+D.position+", rgba(0,0,0,0.20) 0%,rgba(0,0,0,0.65) 100%)";e.cover.style.background="-webkit-linear-gradient("+D.position+", rgba(0,0,0,0.20) 0%,rgba(0,0,0,0.65) 100%)";
}catch(W){}if(F){e.cover.style[Meny.prefix("transition")]="all "+D.transitionDuration+" "+D.transitionEasing;}e.contents.appendChild(e.cover);}function C(){var W=e.menu.style;
switch(D.position){case J:W.width="100%";W.height=D.height+"px";break;case K:W.right="0";W.width=D.width+"px";W.height="100%";break;case c:W.bottom="0";
W.width="100%";W.height=D.height+"px";break;case N:W.width=D.width+"px";W.height="100%";break;}W.position="fixed";W.display="block";W.zIndex=1;if(F){W[Meny.prefix("transform")]=j;
W[Meny.prefix("transformOrigin")]=l;W[Meny.prefix("transition")]="all "+D.transitionDuration+" "+D.transitionEasing;}else{Meny.extend(W,n);}}function Q(){var W=e.contents.style;
if(F){W[Meny.prefix("transform")]=S;W[Meny.prefix("transformOrigin")]=V;W[Meny.prefix("transition")]="all "+D.transitionDuration+" "+D.transitionEasing;
}else{W.position=W.position.match(/relative|absolute|fixed/gi)?W.position:"relative";Meny.extend(W,d);}}function R(){if("ontouchstart" in window){Meny.bindEvent(document,"touchstart",L);
Meny.bindEvent(document,"touchend",H);}Meny.bindEvent(document,"mousedown",M);Meny.bindEvent(document,"mouseup",U);Meny.bindEvent(document,"mousemove",b);
}function u(){if(!f){f=true;Meny.addClass(e.wrapper,"meny-active");e.cover.style.height=e.contents.scrollHeight+"px";e.cover.style.visibility="visible";
if(F){e.cover.style.opacity=1;e.contents.style[Meny.prefix("transform")]=x;e.menu.style[Meny.prefix("transform")]=G;}else{w&&w.stop();w=Meny.animate(e.menu,O,500);
y&&y.stop();y=Meny.animate(e.contents,B,500);E&&E.stop();E=Meny.animate(e.cover,{opacity:1},500);}Meny.dispatchEvent(e.menu,"open");}}function I(){if(f){f=false;
Meny.removeClass(e.wrapper,"meny-active");if(F){e.cover.style.visibility="hidden";e.cover.style.opacity=0;e.contents.style[Meny.prefix("transform")]=S;
e.menu.style[Meny.prefix("transform")]=j;}else{w&&w.stop();w=Meny.animate(e.menu,n,500);y&&y.stop();y=Meny.animate(e.contents,d,500);E&&E.stop();E=Meny.animate(e.cover,{opacity:0},500,function(){e.cover.style.visibility="hidden";
});}Meny.dispatchEvent(e.menu,"close");}}function M(W){m=true;}function b(Z){if(!m){var W=Z.clientX-A,aa=Z.clientY-z;switch(D.position){case J:if(aa>D.height){I();
}else{if(aa<D.threshold){u();}}break;case K:var X=e.wrapper.offsetWidth;if(W<X-D.width){I();}else{if(W>X-D.threshold){u();}}break;case c:var Y=e.wrapper.offsetHeight;
if(aa<Y-D.height){I();}else{if(aa>Y-D.threshold){u();}}break;case N:if(W>D.width){I();}else{if(W<D.threshold){u();}}break;}}}function U(W){m=false;}function L(W){t=W.touches[0].clientX-A;
r=W.touches[0].clientY-z;q=null;o=null;Meny.bindEvent(document,"touchmove",P);}function P(X){q=X.touches[0].clientX-A;o=X.touches[0].clientY-z;var W=null;
if(Math.abs(q-t)>Math.abs(o-r)){if(q<t-D.threshold){W=T;}else{if(q>t+D.threshold){W=p;}}}else{if(o<r-D.threshold){W=s;}else{if(o>r+D.threshold){W=h;}}}if(W&&W()){X.preventDefault();
}}function H(W){Meny.unbindEvent(document,"touchmove",P);if(q===null&&o===null){k();}}function k(){var W=(D.position===J&&r>D.height)||(D.position===K&&t<e.wrapper.offsetWidth-D.width)||(D.position===c&&r<e.wrapper.offsetHeight-D.height)||(D.position===N&&t<D.width);
if(W){I();}}function p(){if(D.position===K&&f){I();return true;}else{if(D.position===N&&!f){u();return true;}}}function T(){if(D.position===K&&!f){u();
return true;}else{if(D.position===N&&f){I();return true;}}}function h(){if(D.position===c&&f){I();return true;}else{if(D.position===J&&!f){u();return true;
}}}function s(){if(D.position===c&&!f){u();return true;}else{if(D.position===J&&f){I();return true;}}}return{open:u,close:I,isOpen:function(){return f;
},addEventListener:function(W,X){e.menu&&Meny.bindEvent(e.menu,W,X);},removeEventListener:function(W,X){e.menu&&Meny.unbindEvent(e.menu,W,X);}};})();},animate:function(b,a,c,d){return(function(){var g={};
for(var j in a){g[j]={start:parseFloat(b.style[j])||0,end:parseFloat(a[j]),unit:(typeof a[j]==="string"&&a[j].match(/px|em|%/gi))?a[j].match(/px|em|%/gi)[0]:""};
}var i=Date.now(),e;function h(){var k=1-Math.pow(1-((Date.now()-i)/c),5);for(var m in g){var l=g[m];b.style[m]=l.start+((l.end-l.start)*k)+l.unit;}if(k<1){e=setTimeout(h,1000/60);
}else{d&&d();f();}}function f(){clearTimeout(e);}h();return{stop:f};})();},extend:function(d,c){for(var e in c){d[e]=c[e];}},prefix:function(e,d){var b=e.slice(0,1).toUpperCase()+e.slice(1),g=["Webkit","Moz","O","ms"];
for(var c=0,a=g.length;c<a;c++){var f=g[c];if(typeof(d||document.body).style[f+b]!=="undefined"){return f+b;}}return e;},addClass:function(b,a){b.className=b.className.replace(/\s+$/gi,"")+" "+a;
},removeClass:function(b,a){b.className=b.className.replace(a,"");},bindEvent:function(a,c,b){if(a.addEventListener){a.addEventListener(c,b,false);}else{a.attachEvent("on"+c,b);
}},unbindEvent:function(a,c,b){if(a.removeEventListener){a.removeEventListener(c,b,false);}else{a.detachEvent("on"+c,b);}},dispatchEvent:function(b,c,a){if(b){var d=document.createEvent("HTMLEvents",1,2);
d.initEvent(c,true,true);Meny.extend(d,a);b.dispatchEvent(d);}},getQuery:function(){var a={};location.search.replace(/[A-Z0-9]+?=([\w|:|\/\.]*)/gi,function(b){a[b.split("=").shift()]=b.split("=").pop();
});return a;}};if(typeof Date.now!=="function"){Date.now=function(){return new Date().getTime();};}