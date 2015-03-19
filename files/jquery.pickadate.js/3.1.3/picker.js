/*!
 * pickadate.js v3.1.3, 2013/07/13
 * By Amsul, http://amsul.ca
 * Hosted on http://amsul.github.io/pickadate.js
 * Licensed under MIT
 */
window.Picker=function(e,t,n){function r(i,o,a,s){function c(){return r._.node("div",r._.node("div",r._.node("div",r._.node("div",f.component.nodes(u.open),m.box),m.wrap),m.frame),m.holder)}function l(e){e.stopPropagation(),"focus"==e.type&&f.$root.addClass(m.focused),f.open()}if(!i)return r;var u={id:Math.abs(~~(1e9*Math.random()))},d=a?e.extend(!0,{},a.defaults,s):s||{},m=e.extend({},r.klasses(),d.klass),p=e(i),h=function(){return this.start()},f=h.prototype={constructor:h,$node:p,start:function(){return u&&u.start?f:(u.methods={},u.start=!0,u.open=!1,u.type=i.type,i.autofocus=i==document.activeElement,i.type="text",i.readOnly=!0,f.component=new a(f,d),f.$root=e(r._.node("div",c(),m.picker)).on({focusin:function(e){f.$root.removeClass(m.focused),e.stopPropagation()},mousedown:function(e){e.target!=f.$root.children()[0]&&e.stopPropagation()},click:function(t){var n=t.target,o=n.attributes.length?e(n):e(n).closest("[data-pick]"),a=o.data();n!=f.$root.children()[0]&&(t.stopPropagation(),f.$root.find(document.activeElement).length||i.focus(),a.nav&&!o.hasClass(m.navDisabled)?f.set("highlight",f.component.item.highlight,{nav:a.nav}):r._.isInteger(a.pick)&&!o.hasClass(m.disabled)?f.set("select",a.pick).close(!0):a.clear&&f.clear().close(!0))}}),f._hidden=d.formatSubmit?e("<input type=hidden name="+i.name+(d.hiddenSuffix||"_submit")+(p.data("value")?' value="'+r._.trigger(f.component.formats.toString,f.component,[d.formatSubmit,f.component.item.select])+'"':"")+">")[0]:n,p.addClass(m.input).on("focus.P"+u.id+" click.P"+u.id,l).on("change.P"+u.id,function(){f._hidden&&(f._hidden.value=i.value?r._.trigger(f.component.formats.toString,f.component,[d.formatSubmit,f.component.item.select]):"")}).on("keydown.P"+u.id,function(e){var t=e.keyCode,r=/^(8|46)$/.test(t);return 27==t?(f.close(),!1):((32==t||r||!u.open&&f.component.key[t])&&(e.preventDefault(),e.stopPropagation(),r?f.clear().close():f.open()),n)}).val(p.data("value")?r._.trigger(f.component.formats.toString,f.component,[d.format,f.component.item.select]):i.value).after(f.$root,f._hidden).data(o,f),f.on({start:f.component.onStart,render:f.component.onRender,stop:f.component.onStop,open:f.component.onOpen,close:f.component.onClose,set:f.component.onSet}).on({start:d.onStart,render:d.onRender,stop:d.onStop,open:d.onOpen,close:d.onClose,set:d.onSet}),i.autofocus&&f.open(),f.trigger("start").trigger("render"))},render:function(){return f.$root.html(c()),f.trigger("render")},stop:function(){return u.start?(f.close(),f._hidden&&f._hidden.parentNode.removeChild(f._hidden),f.$root.remove(),p.removeClass(m.input).off(".P"+u.id).removeData(o),i.type=u.type,i.readOnly=!1,f.trigger("stop"),u.methods={},u.start=!1,f):f},open:function(e){return u.open?f:(p.addClass(m.active),f.$root.addClass(m.opened),e!==!1&&(u.open=!0,p.focus(),t.on("click.P"+u.id+" focusin.P"+u.id,function(e){e.target!=i&&e.target!=document&&f.close()}).on("keydown.P"+u.id,function(e){var t=e.keyCode,n=f.component.key[t],o=e.target;27==t?f.close(!0):o!=i||!n&&13!=t?f.$root.find(o).length&&13==t&&(e.preventDefault(),o.click()):(e.preventDefault(),n?r._.trigger(f.component.key.go,f,[n]):f.$root.find("."+m.highlighted).hasClass(m.disabled)||f.set("select",f.component.item.highlight).close())})),f.trigger("open"))},close:function(e){return e&&(p.off("focus.P"+u.id).focus(),setTimeout(function(){p.on("focus.P"+u.id,l)},0)),p.removeClass(m.active),f.$root.removeClass(m.opened+" "+m.focused),u.open&&(u.open=!1,t.off(".P"+u.id)),f.trigger("close")},clear:function(){return f.set("clear")},set:function(e,t,n){var i,o,a=r._.isObject(e),s=a?e:{};if(e){a||(s[e]=t);for(i in s)o=s[i],f.component.item[i]&&f.component.set(i,o,n||{}),("select"==i||"clear"==i)&&p.val("clear"==i?"":r._.trigger(f.component.formats.toString,f.component,[d.format,f.component.get(i)])).trigger("change");f.render()}return f.trigger("set",s)},get:function(e,t){return e=e||"value",null!=u[e]?u[e]:"value"==e?i.value:f.component.item[e]?"string"==typeof t?r._.trigger(f.component.formats.toString,f.component,[t,f.component.get(e)]):f.component.get(e):n},on:function(e,t){var n,i,o=r._.isObject(e),a=o?e:{};if(e){o||(a[e]=t);for(n in a)i=a[n],u.methods[n]=u.methods[n]||[],u.methods[n].push(i)}return f},trigger:function(e,t){var n=u.methods[e];return n&&n.map(function(e){r._.trigger(e,f,[t])}),f}};return new h}return r.klasses=function(e){return e=e||"picker",{picker:e,opened:e+"--opened",focused:e+"--focused",input:e+"__input",active:e+"__input--active",holder:e+"__holder",frame:e+"__frame",wrap:e+"__wrap",box:e+"__box"}},r._={group:function(e){for(var t,n="",i=r._.trigger(e.min,e);r._.trigger(e.max,e,[i])>=i;i+=e.i)t=r._.trigger(e.item,e,[i]),n+=r._.node(e.node,t[0],t[1],t[2]);return n},node:function(e,t,n,r){return t?(t=Array.isArray(t)?t.join(""):t,n=n?' class="'+n+'"':"",r=r?" "+r:"","<"+e+n+r+">"+t+"</"+e+">"):""},lead:function(e){return(10>e?"0":"")+e},trigger:function(e,t,n){return"function"==typeof e?e.apply(t,n||[]):e},digits:function(e){return/\d/.test(e[1])?2:1},isObject:function(e){return{}.toString.call(e).indexOf("Object")>-1},isDate:function(e){return{}.toString.call(e).indexOf("Date")>-1&&this.isInteger(e.getDate())},isInteger:function(e){return{}.toString.call(e).indexOf("Number")>-1&&0===e%1}},r.extend=function(t,n){e.fn[t]=function(i,o){var a=this.data(t);return"picker"==i?a:a&&"string"==typeof i?(r._.trigger(a[i],a,[o]),this):this.each(function(){var o=e(this);o.data(t)||new r(this,t,n,i)})},e.fn[t].defaults=n.defaults},r}(jQuery,jQuery(document));