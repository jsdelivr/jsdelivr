/**
 *	UI Layout Callback: pseudoClose
 *	Version:	1.1 - 2012-03-10
 *	Author:		Kevin Dalman (kevin@jquery-dev.com)
 */
(function(i){var a=i.layout;a.callbacks||(a.callbacks={});a.defaults||(a.defaults={north:{},south:{},east:{},west:{},center:{}});
for(var b=0;4>b;b++)a.defaults[["north","south","east","west"][b]].pseudoClose={hideObject:"iframe",skipIE:!1};
a.callbacks.pseudoClose=function(d,a,b,g){if(b.isHiding)return true;var h=i.extend({},i.layout.defaults[d].pseudoClose,g.pseudoClose);
if(h.skipIE&&i.layout.browser.msie)return true;if(h.hideObject==="object")h.hideObject=h.hideObject+",embed";
setTimeout(function(){var f=h.hideObject,f=f==="pane"||a[0].tagName===f.toUpperCase()?a:a.find(f),e=a.data("parentLayout"),b=e.state[d],c=b.pseudoClose||{};
if(c.size){c.resizable&&e.enableResizable(d);g.minSize=c.minSize;e.setSizeLimits(d);e.sizePane(d,c.size);c={};f.css("visibility","hidden").css("visibility","visible")}
else{c.size=b.size;c.minSize=g.minSize;g.minSize=0;c.resizable=g.resizable;e.disableResizable(d);e.setSizeLimits(d);e.sizePane(d,b.minSize);f.css("visibility","hidden")}
b.pseudoClose=c},50);return false}})(jQuery);