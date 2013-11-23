/*
* Zoomy 1.3.3.min - jQuery plugin
* http://redeyeops.com/plugins/zoomy
*
* Copyright (c) 2010 Jacob Lowe (http://redeyeoperations.com)
* Dual licensed under the MIT (MIT-LICENSE.txt)
* and GPL (GPL-LICENSE.txt) licenses.
*
* Built for jQuery library
* http://jquery.com
*
* Addition fixes and modifications done by Larry Battle ( blarry@bateru.com )
* Code has been refactored and the logic has been corrected.
*
*/

(function(e){var g={count:[],pos:null};e.fn.zoomy=function(j,f){var i={move:function(a,b,c){var d=b.attr("rel"),e=a.offset(),k=g[d].zoom.border,n=g[d].zoom.x,q=g[d].zoom.y,a=g[d].css.width,j=g[d].css.height,h=f.zoomSize+k*2,i=h/2,o=a/n,d=i-i*o-k*o+k,a=a-h-k+d,p=j-h-k+d,l=q-h,m=n-h,n=c.pageX-e.left-i,h=c.pageY-e.top-i,o=(c.pageX-e.left)/o-i+k,c=(c.pageY-e.top)/(j/q)-i+k,c={0:[o,c,n,h],1:[0,c,-d,h],2:[0,0,-d,-d],3:[0,l,-d,p],4:[o,0,n,-d],5:[m,0,a,-d],6:[m,c,a,h],7:[m,l,a,p],8:[o,l,n,p]},e=-d<=h,k=-d>
h,q=p>h,p=p<=h,h=a>n,d=-d<=n&&e&&h&&q?0:-d>n?e&&q?1:k?2:p?3:null:k?h?4:5:a<=n?q?6:7:p?8:null;b.css({backgroundPosition:"-"+c[d][0]+"px -"+c[d][1]+"px",left:c[d][2],top:c[d][3]})},classes:function(a){var b=a.find(".zoomy").attr("rel");g[b].state===0||g[b].state===null?a.removeClass("inactive"):a.addClass("inactive")},enter:function(a,b){var c=b.attr("rel");g[c].state=1;b.css("visibility","visible");i.classes(a)},leave:function(a,b,c){var d=b.attr("rel");g[d].state=c!==null?null:0;b.css("visibility",
"hidden");i.classes(a)},callback:function(a,b){var c=b.attr("rel");a!==null&&typeof a==="function"&&a(e.extend({},g[c],g.pos))}},l={round:function(a,b){return!f.round?0:a===void 0?f.zoomSize+b/2+"px":f.zoomSize/2+"px "+f.zoomSize/2+"px 0px 0px"},glare:function(a){a.children("span").css({height:f.zoomSize/2,width:f.zoomSize-10,margin:e.browser.msie&&parseInt(e.browser.version,10)===9?0:"5px auto","border-radius":l.round(0)})},border:function(){var a=f.border.replace(/^\s*|\s*$/g,""),b=a.split(" "),
c=parseFloat(b[0]);return[a,b.length>2&&c*1===c?c:0]},params:function(a,b){var c=a.children("img"),d=l.border(b),i={marginTop:c.css("margin-top"),marginRight:c.css("margin-right"),marginBottom:c.css("margin-bottom"),marginLeft:c.css("margin-left")},k={"float":c.css("float")},n={display:"block",height:c.height(),width:c.width(),position:"relative"},j=b.attr("rel"),m={};if(k["float"]==="none"&&a.parent("*:first").css("text-align")==="center")i.marginRight="auto",i.marginLeft="auto";e.extend(m,i,k,n);
g[j].css=m;f.glare||b.children("span").css({height:f.zoomSize-10,width:f.zoomSize-10});b.css({height:f.zoomSize,width:f.zoomSize,"border-radius":l.round(void 0,d[1]),border:d[0]});c.css("margin","0px");c.one("load",function(){a.css(g[j].css)}).each(function(){(this.complete||e.browser.msie&&parseInt(e.browser.version,10)===6)&&e(this).trigger("load")})}},m={image:function(a,b){var c=b.attr("rel");b.show().css({top:"-999999px",left:"-999999px"});b.find("img").attr("src")!==a&&b.find("img").attr("src",
a).load(function(){var d=f.glare?"<span/>":"",e=l.border(b);a=a.replace(/ /g,"%20");g[c].zoom={x:b.find("img").width(),y:b.find("img").height(),border:e[1]};b.append(d).css({"background-image":"url("+a+")"}).find("img").remove();l.glare(b)}).each(function(){(this.complete||e.browser.msie&&parseInt(e.browser.version,10)===6)&&e(this).trigger("load")})},zoom:function(a,b){g[b]={state:null,index:b};g.count.push(0);var c=typeof a.attr(f.attr)==="string"&&f.attr!=="href"?a.attr(f.attr):a.attr("href"),
d=null,r=f.zoomInit;(function(){var c=[],e=function(b){i.move(a,d,b)},l=function(){i.enter(a,d);a.bind("mousemove",e);i.callback(f.zoomStart,d)},m=function(b){i.leave(a,d,b);a.unbind("mousemove",e);i.callback(f.zoomStop,d)},h=function(c){g.pos=c;f.clickable||c.preventDefault();g[b].state===0||g[b].state===null?(l(),i.move(a,d,c)):g[b].state===1&&j!=="mouseover"&&j!=="mouseenter"&&m(0)},r=function(a){g.pos=a;g[b].state===0&&l()},o=function(){return false};j==="mouseover"?c[j]=h:(c[j]=h,c.mouseover=
r);if(!f.clickable&&j!=="click")c.click=o;c.mouseleave=function(a){g.pos=a;g[b].state===1&&m(null)};a.bind(c)})();a.addClass("parent-zoom").append('<div class="zoomy zoom-obj-'+b+'" rel="'+b+'"><img id="tmp"/></div>');d=e(".zoom-obj-"+b);r!==null&&typeof r==="function"&&r(a);l.params(a,d);m.image(c,d)},init:function(a,b){b.one("load",function(){m.zoom(a,g.count.length)}).each(function(){(this.complete||e.browser.msie&&parseInt(e.browser.version,10)===6)&&e(this).trigger("load")})}};typeof j==="object"&&
f===void 0?(f=j,j="click"):j===void 0&&(j="click");f=e.extend({zoomSize:200,round:true,glare:true,clickable:false,attr:"href",border:"5px solid #999",zoomInit:null,zoomStart:null,zoomStop:null},f);e(this).each(function(){var a=e(this),b=a.find("img");m.init(a,b)})}})(jQuery);