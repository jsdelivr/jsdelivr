jQuery.webshims.register("form-datalist",function(b,c,l,h,k){c.propTypes.element=function(g){c.createPropDefault(g,"attr");if(!g.prop)g.prop={get:function(){var c=g.attr.get.call(this);c&&(c=b("#"+c)[0])&&g.propNodeName&&!b.nodeName(c,g.propNodeName)&&(c=null);return c||null},writeable:!1}};(function(){var g=b.webshims.cfg.forms,m=Modernizr.input.list;if(!m||g.customDatalist){var n=0,r={submit:1,button:1,reset:1,hidden:1,range:1,date:1},s=b.browser.msie&&7>parseInt(b.browser.version,10),o={},p=function(a){if(!a)return[];
if(o[a])return o[a];var b;try{b=JSON.parse(localStorage.getItem("storedDatalistOptions"+a))}catch(e){}o[a]=b||[];return b||[]},q={_create:function(a){if(!r[b.prop(a.input,"type")]){var d=a.datalist,e=b.data(a.input,"datalistWidget");if(d&&e&&e.datalist!==d)e.datalist=d,e.id=a.id,b(e.datalist).unbind("updateDatalist.datalistWidget").bind("updateDatalist.datalistWidget",b.proxy(e,"_resetListCached")),e._resetListCached();else if(d){if(!(e&&e.datalist===d)){n++;var f=this;this.hideList=b.proxy(f,"hideList");
this.timedHide=function(){clearTimeout(f.hideTimer);f.hideTimer=setTimeout(f.hideList,9)};this.datalist=d;this.id=a.id;this.hasViewableData=!0;this._autocomplete=b.attr(a.input,"autocomplete");b.data(a.input,"datalistWidget",this);this.shadowList=b('<div class="datalist-polyfill" />');g.positionDatalist?this.shadowList.insertAfter(a.input):this.shadowList.appendTo("body");this.index=-1;this.input=a.input;this.arrayOptions=[];this.shadowList.delegate("li","mouseenter.datalistWidget mousedown.datalistWidget click.datalistWidget",
function(d){var e=b("li:not(.hidden-item)",f.shadowList),c="mousedown"==d.type||"click"==d.type;f.markItem(e.index(d.currentTarget),c,e);"click"==d.type&&(f.hideList(),b(a.input).trigger("datalistselect"));return"mousedown"!=d.type}).bind("focusout",this.timedHide);a.input.setAttribute("autocomplete","off");b(a.input).attr({"aria-haspopup":"true"}).bind("input.datalistWidget",function(){if(!f.triggeredByDatalist)f.changedValue=!1,f.showHideOptions()}).bind("keydown.datalistWidget",function(d){var e=
d.keyCode,c;if(40==e&&!f.showList())return f.markItem(f.index+1,!0),!1;if(f.isListVisible){if(38==e)return f.markItem(f.index-1,!0),!1;if(!d.shiftKey&&(33==e||36==e))return f.markItem(0,!0),!1;if(!d.shiftKey&&(34==e||35==e))return d=b("li:not(.hidden-item)",f.shadowList),f.markItem(d.length-1,!0,d),!1;if(13==e||27==e)return 13==e&&(c=b("li.active-item:not(.hidden-item)",f.shadowList),f.changeValue(b("li.active-item:not(.hidden-item)",f.shadowList))),f.hideList(),c&&c[0]&&b(a.input).trigger("datalistselect"),
!1}}).bind("focus.datalistWidget",function(){b(this).hasClass("list-focus")&&f.showList()}).bind("mousedown.datalistWidget",function(){(this==h.activeElement||b(this).is(":focus"))&&f.showList()}).bind("blur.datalistWidget",this.timedHide);b(this.datalist).unbind("updateDatalist.datalistWidget").bind("updateDatalist.datalistWidget",b.proxy(this,"_resetListCached"));this._resetListCached();a.input.form&&a.input.id&&b(a.input.form).bind("submit.datalistWidget"+a.input.id,function(){var d=b.prop(a.input,
"value"),e=(a.input.name||a.input.id)+b.prop(a.input,"type");if(!f.storedOptions)f.storedOptions=p(e);if(d&&-1==f.storedOptions.indexOf(d)&&(f.storedOptions.push(d),d=f.storedOptions,e)){d=d||[];try{localStorage.setItem("storedDatalistOptions"+e,JSON.stringify(d))}catch(c){}}});b(l).bind("unload",function(){f.destroy()})}}else e&&e.destroy()}},destroy:function(){var a=b.attr(this.input,"autocomplete");b(this.input).unbind(".datalistWidget").removeData("datalistWidget");this.shadowList.remove();b(h).unbind(".datalist"+
this.id);this.input.form&&this.input.id&&b(this.input.form).unbind("submit.datalistWidget"+this.input.id);this.input.removeAttribute("aria-haspopup");a===k?this.input.removeAttribute("autocomplete"):b(this.input).attr("autocomplete",a)},_resetListCached:function(a){var d=this,b;this.needsUpdate=!0;this.lastUpdatedValue=!1;this.lastUnfoundValue="";this.updateTimer||(l.QUnit||(b=a&&h.activeElement==d.input)?d.updateListOptions(b):c.ready("WINDOWLOAD",function(){d.updateTimer=setTimeout(function(){d.updateListOptions();
d=null;n=1},200+100*n)}))},updateListOptions:function(a){this.needsUpdate=!1;clearTimeout(this.updateTimer);this.updateTimer=!1;this.shadowList.css({fontSize:b.curCSS(this.input,"fontSize"),fontFamily:b.curCSS(this.input,"fontFamily")});this.searchStart=b(this.input).hasClass("search-start");var d=[],e=[],f=[],c,j,i,g;for(j=b.prop(this.datalist,"options"),i=0,g=j.length;i<g;i++){c=j[i];if(c.disabled)return;c={value:b(c).val()||"",text:b.trim(b.attr(c,"label")||c.textContent||c.innerText||b.text([c])||
""),className:c.className||"",style:b.attr(c,"style")||""};c.text?c.text!=c.value&&(c.className+=" different-label-value"):c.text=c.value;e[i]=c.value;f[i]=c}if(!this.storedOptions)this.storedOptions=p((this.input.name||this.input.id)+b.prop(this.input,"type"));this.storedOptions.forEach(function(a){-1==e.indexOf(a)&&f.push({value:a,text:a,className:"stored-suggest",style:""})});for(i=0,g=f.length;i<g;i++)j=f[i],d[i]='<li class="'+j.className+'" style="'+j.style+'" tabindex="-1" role="listitem"><span class="option-label">'+
j.text+'</span> <span class="option-value">'+j.value+"</span></li>";this.arrayOptions=f;this.shadowList.html('<div><ul role="list" class="'+(this.datalist.className||"")+" "+this.datalist.id+'-shadowdom">'+d.join("\n")+"</ul></div>");b.fn.bgIframe&&s&&this.shadowList.bgIframe();(a||this.isListVisible)&&this.showHideOptions()},showHideOptions:function(a){var d=b.prop(this.input,"value").toLowerCase();if(!(d===this.lastUpdatedValue||this.lastUnfoundValue&&0===d.indexOf(this.lastUnfoundValue))){this.lastUpdatedValue=
d;var e=!1,f=this.searchStart,c=b("li",this.shadowList);d?this.arrayOptions.forEach(function(a,g){var h;if(!("lowerText"in a))a.lowerText=a.text!=a.value?a.text.toLowerCase()+a.value.toLowerCase():a.text.toLowerCase();h=a.lowerText.indexOf(d);(h=f?!h:-1!==h)?(b(c[g]).removeClass("hidden-item"),e=!0):b(c[g]).addClass("hidden-item")}):c.length&&(c.removeClass("hidden-item"),e=!0);this.hasViewableData=e;!a&&e&&this.showList();if(!e)this.lastUnfoundValue=d,this.hideList()}},setPos:function(){var a=g.positionDatalist?
b(this.input).position():c.getRelOffset(this.shadowList,this.input);a.top+=b(this.input).outerHeight();a.width=b(this.input).outerWidth()-(parseInt(this.shadowList.css("borderLeftWidth"),10)||0)-(parseInt(this.shadowList.css("borderRightWidth"),10)||0);this.shadowList.css(a);return a},showList:function(){if(this.isListVisible)return!1;this.needsUpdate&&this.updateListOptions();this.showHideOptions(!0);if(!this.hasViewableData)return!1;this.isListVisible=!0;var a=this,d;a.setPos();a.shadowList.addClass("datalist-visible");
b(h).unbind(".datalist"+a.id).bind("mousedown.datalist"+a.id+" focusin.datalist"+a.id,function(d){d.target===a.input||a.shadowList[0]===d.target||b.contains(a.shadowList[0],d.target)?(clearTimeout(a.hideTimer),setTimeout(function(){clearTimeout(a.hideTimer)},9)):a.timedHide()});b(l).unbind(".datalist"+a.id).bind("resize.datalist"+a.id+"orientationchange.datalist "+a.id+" emchange.datalist"+a.id,function(){clearTimeout(d);d=setTimeout(function(){a.setPos()},9)});clearTimeout(d);return!0},hideList:function(){if(!this.isListVisible)return!1;
var a=this,d=function(){a.changedValue&&b(a.input).trigger("change");a.changedValue=!1};a.shadowList.removeClass("datalist-visible list-item-active").scrollTop(0).find("li.active-item").removeClass("active-item");a.index=-1;a.isListVisible=!1;if(a.changedValue){a.triggeredByDatalist=!0;c.triggerInlineForm&&c.triggerInlineForm(a.input,"input");if(a.input==h.activeElement||b(a.input).is(":focus"))b(a.input).one("blur",d);else d();a.triggeredByDatalist=!1}b(h).unbind(".datalist"+a.id);b(l).unbind(".datalist"+
a.id);return!0},scrollIntoView:function(a){var d=b("ul",this.shadowList),e=b("div",this.shadowList),c=a.position();c.top-=(parseInt(d.css("paddingTop"),10)||0)+(parseInt(d.css("marginTop"),10)||0)+(parseInt(d.css("borderTopWidth"),10)||0);0>c.top?e.scrollTop(e.scrollTop()+c.top-2):(c.top+=a.outerHeight(),a=e.height(),c.top>a&&e.scrollTop(e.scrollTop()+(c.top-a)+2))},changeValue:function(a){if(a[0]){var a=b("span.option-value",a).text(),d=b.prop(this.input,"value");if(a!=d)b(this.input).prop("value",
a).triggerHandler("updateInput"),this.changedValue=!0}},markItem:function(a,d,e){e=e||b("li:not(.hidden-item)",this.shadowList);if(e.length)0>a?a=e.length-1:a>=e.length&&(a=0),e.removeClass("active-item"),this.shadowList.addClass("list-item-active"),e=e.filter(":eq("+a+")").addClass("active-item"),d&&(this.changeValue(e),this.scrollIntoView(e)),this.index=a}};(function(){m||c.defineNodeNameProperty("datalist","options",{prop:{writeable:!1,get:function(){var a=b("select",this);a[0]?a=a[0].options:
(a=b("option",this).get(),a.length&&c.warn("you should wrap you option-elements for a datalist in a select element to support IE and other old browsers."));return a}}});var a={autocomplete:{attr:{get:function(){var a=b.data(this,"datalistWidget");return a?a._autocomplete:"autocomplete"in this?this.autocomplete:this.getAttribute("autocomplete")},set:function(a){var e=b.data(this,"datalistWidget");e?(e._autocomplete=a,"off"==a&&e.hideList()):"autocomplete"in this?this.autocomplete=a:this.setAttribute("autocomplete",
a)}}}};if(!m||!1 in b("<input />")[0])a.selectedOption={prop:{writeable:!1,get:function(){var a=b.prop(this,"list"),e=null,c;if(!a)return e;c=b.attr(this,"value");if(!c)return e;a=b.prop(a,"options");if(!a.length)return e;b.each(a,function(a,d){if(c==b.prop(d,"value"))return e=d,!1});return e}}};a.list=m?{attr:{get:function(){var a=c.contentAttr(this,"list");null!=a?this.removeAttribute("list"):a=b.data(this,"datalistListAttr");return null==a?k:a},set:function(a){b.data(this,"datalistListAttr",a);
c.objectCreate(q,k,{input:this,id:a,datalist:b.prop(this,"list")})}},initAttr:!0,reflect:!0,propType:"element",propNodeName:"datalist"}:{attr:{get:function(){var a=c.contentAttr(this,"list");return null==a?k:a},set:function(a){c.contentAttr(this,"list",a);c.objectCreate(q,k,{input:this,id:a,datalist:b.prop(this,"list")})}},initAttr:!0,reflect:!0,propType:"element",propNodeName:"datalist"};c.defineNodeNameProperties("input",a);if(b.event.customEvent)b.event.customEvent.updateDatalist=!0,b.event.customEvent.updateInput=
!0,b.event.customEvent.datalistselect=!0;c.addReady(function(a,b){b.filter("datalist > select, datalist, datalist > option, datalist > select > option").closest("datalist").triggerHandler("updateDatalist")})})()}})()});
