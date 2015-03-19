/**
 * jQuery Picture
 * http://jquerypicture.com
 * http://github.com/Abban/jQuery-Picture
 * 
 * May 2012
 * 
 * @version 0.9
 * @author Abban Dunne http://abandon.ie
 * @license MIT
 * 
 * jQuery Picture is a plugin to add support for responsive images to your layouts.
 * It supports both figure elements with some custom data attributes and the new
 * proposed picture format. This plugin will be made redundant when the format is
 * approved and implemented by browsers. Lets hope that happens soon. In the meantime
 * this plugin will be kept up to date with latest developments.
 * 
 */(function(e){e.fn.picture=function(t){var n={container:null,ignorePixelRatio:!1,useLarger:!1,insertElement:">a",inlineDimensions:!1},r=e.extend({},n,t);this.each(function(){function a(o){if(o){if(s.get(0).tagName.toLowerCase()=="figure"){var a=s.data();e.each(a,function(e){var n;n=e.replace(/[^\d.]/g,"");n&&t.push(parseInt(n))})}else s.find("source").each(function(){var n,r;n=e(this).attr("media");if(n){r=n.replace(/[^\d.]/g,"");t.push(parseInt(r))}});t.sort(function(e,t){return e-t})}var c=0;r.container==null?n=e(window).width()*u:n=e(r.container).width()*u;e.each(t,function(e,t){parseInt(n)>=parseInt(t)&&parseInt(c)<=parseInt(t)&&(c=t)});if(r.useLarger){idx=t.indexOf(c);idx<t.length-1&&(c=t[idx+1])}if(i!==c){i=c;s.get(0).tagName.toLowerCase()=="figure"?l():f()}}function f(){var t=new Object;s.find("source").each(function(){var n,r,i;n=e(this).attr("media");r=e(this).attr("src");n?i=n.replace(/[^\d.]/g,""):i=0;t[i]=r});if(s.find("img").length==0){var n='<img src="'+t[i]+'"';s.attr("style")&&(n+=' style="'+s.attr("style")+'"');s.attr("alt")&&(n+=' alt="'+s.attr("alt")+'"');n+=">";e(r.insertElement,s).length==0?s.append(n):e(r.insertElement,s).append(n)}else s.find("img").attr("src",t[i]);r.inlineDimensions&&e("<img/>").attr("src",e("img",s).attr("src")).load(function(){e("img",s).attr("height",this.height);e("img",s).attr("width",this.width)})}function l(){var t=new Object,n=s.data();e.each(n,function(e,n){var r;r=e.replace(/[^\d.]/g,"");r||(r=0);t[r]=n});if(s.find("img").length==0){var o='<img src="'+t[i]+'"';s.attr("style")&&(o+=' style="'+s.attr("style")+'"');s.attr("title")&&(o+=' alt="'+s.attr("title")+'"');o+=">";e(r.insertElement,s).length==0?s.append(o):e(r.insertElement,s).append(o)}else e("img",s).attr("src",t[i]);r.inlineDimensions&&e("<img/>").attr("src",e("img",s).attr("src")).load(function(){e("img",s).attr("height",this.height);e("img",s).attr("width",this.width)})}var t=new Array,n,i,s,o,u=1;!r.ignorePixelRatio&&window.devicePixelRatio!==undefined&&(u=window.devicePixelRatio);s=e(this);s.find("noscript").remove();a(!0);o=!1;e(window).resize(function(){o!==!1&&clearTimeout(o);o=setTimeout(a,200)})})}})(jQuery);