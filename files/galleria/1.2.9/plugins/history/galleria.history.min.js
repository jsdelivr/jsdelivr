/**
 * Galleria History Plugin 2012-04-04
 * http://galleria.io
 *
 * Licensed under the MIT license
 * https://raw.github.com/aino/galleria/master/LICENSE
 *
 */(function(a,b){Galleria.requires(1.25,"The History Plugin requires Galleria version 1.2.5 or later."),Galleria.History=function(){var c=[],d=!1,e=b.location,f=b.document,g=Galleria.IE,h="onhashchange"in b&&(f.mode===undefined||f.mode>7),i,j=function(a){return i&&!h&&Galleria.IE?a=a||i.location:a=e,parseInt(a.hash.substr(2),10)},k=j(e),l=[],m=function(){a.each(l,function(a,c){c.call(b,j())})},n=function(){a.each(c,function(a,b){b()}),d=!0},o=function(a){return"/"+a};return h&&g<8&&(h=!1),h?n():a(function(){var c=b.setInterval(function(){var a=j();!isNaN(a)&&a!=k&&(k=a,e.hash=o(a),m())},50);g?a('<iframe tabindex="-1" title="empty">').hide().attr("src","about:blank").one("load",function(){i=this.contentWindow,n()}).insertAfter(f.body):n()}),{change:function(a){l.push(a),h&&(b.onhashchange=m)},set:function(a){if(isNaN(a))return;!h&&g&&this.ready(function(){var b=i.document;b.open(),b.close(),i.location.hash=o(a)}),e.hash=o(a)},ready:function(a){d?a():c.push(a)}}}()})(jQuery,this);