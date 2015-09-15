/*! Qoopido.js library 3.6.9, 2015-07-10 | https://github.com/dlueth/qoopido.js | (c) 2015 Dirk Lueth */
!function(t){window.qoopido.registerSingleton("component/remux",t,["../emitter","./sense"])}(function(t,n,e,i,o,a,u){"use strict";function r(t,n){var e=this;return t&&n&&(c.className=t,c.style.fontSize=n+"px",d.layout=t,d.fontsize=n,(h.fontsize!==d.fontsize||h.layout!==d.layout)&&(d.ratio.device=o.devicePixelRatio||1,d.ratio.fontsize=d.fontsize/f,d.ratio.total=d.ratio.device*d.ratio.fontsize,h.layout!==d.layout&&e.emit("layoutchanged",d),h.fontsize!==d.fontsize&&e.emit("fontsizechanged",d),e.emit("statechanged",d),h.fontsize=d.fontsize,h.layout=d.layout)),e}function s(n,e,i){var a=this;o.setTimeout(function(){t["component/sense"].create(n).on("matched",function(){r.call(a,e,i)})},0)}var l,c=a.getElementsByTagName("html")[0],f=16,d={fontsize:null,layout:null,ratio:{}},h={fontsize:null,layout:null};return l=t.emitter.extend({_constructor:function(){var t=this,n=parseInt(c.getAttribute("data-base"),10);l._parent._constructor.call(t),isNaN(n)===!1&&(f=n)},getState:function(){return d},getLayout:function(){return d.layout},getFontsize:function(){return d.fontsize},setLayout:function(t,n){var e=this;return r.call(e,t,n),e},addLayout:function(t,n){var e,i,o,a,u,r,l,c,d=this;arguments.length>1?(e={},e[t]=n):e=arguments[0];for(i in e)for(o=e[i],a=o.min;a<=o.max;a++)l=Math.round(o.width*(a/f)),c=Math.round(o.width*((a+1)/f))-1,s.call(d,"screen and (min-width: "+l+"px) and (max-width: "+c+"px )",i,a),u=!u||l<u.width?{width:l,fontsize:a,layout:i}:u,r=!r||c>=r.width?{width:c,fontsize:a,layout:i}:r;return s.call(d,"screen and (max-width: "+(u.width-1)+"px)",u.layout,u.fontsize),s.call(d,"screen and (min-width: "+(r.width+1)+"px)",r.layout,r.fontsize),d}})});