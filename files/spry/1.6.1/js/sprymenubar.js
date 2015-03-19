// SpryMenuBar.js - version 0.12 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry;if(!Spry)Spry={};if(!Spry.Widget)Spry.Widget={};Spry.BrowserSniff=function()
{var b=navigator.appName.toString();var up=navigator.platform.toString();var ua=navigator.userAgent.toString();this.mozilla=this.ie=this.opera=this.safari=false;var re_opera=/Opera.([0-9\.]*)/i;var re_msie=/MSIE.([0-9\.]*)/i;var re_gecko=/gecko/i;var re_safari=/(applewebkit|safari)\/([\d\.]*)/i;var r=false;if((r=ua.match(re_opera))){this.opera=true;this.version=parseFloat(r[1]);}else if((r=ua.match(re_msie))){this.ie=true;this.version=parseFloat(r[1]);}else if((r=ua.match(re_safari))){this.safari=true;this.version=parseFloat(r[2]);}else if(ua.match(re_gecko)){var re_gecko_version=/rv:\s*([0-9\.]+)/i;r=ua.match(re_gecko_version);this.mozilla=true;this.version=parseFloat(r[1]);}
this.windows=this.mac=this.linux=false;this.Platform=ua.match(/windows/i)?"windows":(ua.match(/linux/i)?"linux":(ua.match(/mac/i)?"mac":ua.match(/unix/i)?"unix":"unknown"));this[this.Platform]=true;this.v=this.version;if(this.safari&&this.mac&&this.mozilla){this.mozilla=false;}};Spry.is=new Spry.BrowserSniff();Spry.Widget.MenuBar=function(element,opts)
{this.init(element,opts);};Spry.Widget.MenuBar.prototype.init=function(element,opts)
{this.element=this.getElement(element);this.currMenu=null;this.showDelay=250;this.hideDelay=600;if(typeof document.getElementById=='undefined'||(navigator.vendor=='Apple Computer, Inc.'&&typeof window.XMLHttpRequest=='undefined')||(Spry.is.ie&&typeof document.uniqueID=='undefined'))
{return;}
if(Spry.is.ie&&Spry.is.version<7){try{document.execCommand("BackgroundImageCache",false,true);}catch(err){}}
this.upKeyCode=Spry.Widget.MenuBar.KEY_UP;this.downKeyCode=Spry.Widget.MenuBar.KEY_DOWN;this.leftKeyCode=Spry.Widget.MenuBar.KEY_LEFT;this.rightKeyCode=Spry.Widget.MenuBar.KEY_RIGHT;this.escKeyCode=Spry.Widget.MenuBar.KEY_ESC;this.hoverClass='MenuBarItemHover';this.subHoverClass='MenuBarItemSubmenuHover';this.subVisibleClass='MenuBarSubmenuVisible';this.hasSubClass='MenuBarItemSubmenu';this.activeClass='MenuBarActive';this.isieClass='MenuBarItemIE';this.verticalClass='MenuBarVertical';this.horizontalClass='MenuBarHorizontal';this.enableKeyboardNavigation=true;this.hasFocus=false;if(opts)
{for(var k in opts)
{if(typeof this[k]=='undefined')
{var rollover=new Image;rollover.src=opts[k];}}
Spry.Widget.MenuBar.setOptions(this,opts);}
if(Spry.is.safari)
this.enableKeyboardNavigation=false;if(this.element)
{this.currMenu=this.element;var items=this.element.getElementsByTagName('li');for(var i=0;i<items.length;i++)
{if(i>0&&this.enableKeyboardNavigation)
items[i].getElementsByTagName('a')[0].tabIndex='-1';this.initialize(items[i],element);if(Spry.is.ie)
{this.addClassName(items[i],this.isieClass);items[i].style.position="static";}}
if(this.enableKeyboardNavigation)
{var self=this;this.addEventListener(document,'keydown',function(e){self.keyDown(e);},false);}
if(Spry.is.ie)
{if(this.hasClassName(this.element,this.verticalClass))
{this.element.style.position="relative";}
var linkitems=this.element.getElementsByTagName('a');for(var i=0;i<linkitems.length;i++)
{linkitems[i].style.position="relative";}}}};Spry.Widget.MenuBar.KEY_ESC=27;Spry.Widget.MenuBar.KEY_UP=38;Spry.Widget.MenuBar.KEY_DOWN=40;Spry.Widget.MenuBar.KEY_LEFT=37;Spry.Widget.MenuBar.KEY_RIGHT=39;Spry.Widget.MenuBar.prototype.getElement=function(ele)
{if(ele&&typeof ele=="string")
return document.getElementById(ele);return ele;};Spry.Widget.MenuBar.prototype.hasClassName=function(ele,className)
{if(!ele||!className||!ele.className||ele.className.search(new RegExp("\\b"+className+"\\b"))==-1)
{return false;}
return true;};Spry.Widget.MenuBar.prototype.addClassName=function(ele,className)
{if(!ele||!className||this.hasClassName(ele,className))
return;ele.className+=(ele.className?" ":"")+className;};Spry.Widget.MenuBar.prototype.removeClassName=function(ele,className)
{if(!ele||!className||!this.hasClassName(ele,className))
return;ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Spry.Widget.MenuBar.prototype.addEventListener=function(element,eventType,handler,capture)
{try
{if(element.addEventListener)
{element.addEventListener(eventType,handler,capture);}
else if(element.attachEvent)
{element.attachEvent('on'+eventType,handler);}}
catch(e){}};Spry.Widget.MenuBar.prototype.createIframeLayer=function(menu)
{var layer=document.createElement('iframe');layer.tabIndex='-1';layer.src='javascript:""';layer.frameBorder='0';layer.scrolling='no';menu.parentNode.appendChild(layer);layer.style.left=menu.offsetLeft+'px';layer.style.top=menu.offsetTop+'px';layer.style.width=menu.offsetWidth+'px';layer.style.height=menu.offsetHeight+'px';};Spry.Widget.MenuBar.prototype.removeIframeLayer=function(menu)
{var layers=((menu==this.element)?menu:menu.parentNode).getElementsByTagName('iframe');while(layers.length>0)
{layers[0].parentNode.removeChild(layers[0]);}};Spry.Widget.MenuBar.prototype.clearMenus=function(root)
{var menus=root.getElementsByTagName('ul');for(var i=0;i<menus.length;i++)
this.hideSubmenu(menus[i]);this.removeClassName(this.element,this.activeClass);};Spry.Widget.MenuBar.prototype.bubbledTextEvent=function()
{return Spry.is.safari&&(event.target==event.relatedTarget.parentNode||(event.eventPhase==3&&event.target.parentNode==event.relatedTarget));};Spry.Widget.MenuBar.prototype.showSubmenu=function(menu)
{if(this.currMenu)
{this.clearMenus(this.currMenu);this.currMenu=null;}
if(menu)
{this.addClassName(menu,this.subVisibleClass);if(typeof document.all!='undefined'&&!Spry.is.opera&&navigator.vendor!='KDE')
{if(!this.hasClassName(this.element,this.horizontalClass)||menu.parentNode.parentNode!=this.element)
{menu.style.top=menu.parentNode.offsetTop+'px';}}
if(Spry.is.ie&&Spry.is.version<7)
{this.createIframeLayer(menu);}}
this.addClassName(this.element,this.activeClass);};Spry.Widget.MenuBar.prototype.hideSubmenu=function(menu)
{if(menu)
{this.removeClassName(menu,this.subVisibleClass);if(typeof document.all!='undefined'&&!Spry.is.opera&&navigator.vendor!='KDE')
{menu.style.top='';menu.style.left='';}
if(Spry.is.ie&&Spry.is.version<7)
this.removeIframeLayer(menu);}};Spry.Widget.MenuBar.prototype.initialize=function(listitem,element)
{var opentime,closetime;var link=listitem.getElementsByTagName('a')[0];var submenus=listitem.getElementsByTagName('ul');var menu=(submenus.length>0?submenus[0]:null);if(menu)
this.addClassName(link,this.hasSubClass);if(!Spry.is.ie)
{listitem.contains=function(testNode)
{if(testNode==null)
return false;if(testNode==this)
return true;else
return this.contains(testNode.parentNode);};}
var self=this;this.addEventListener(listitem,'mouseover',function(e){self.mouseOver(listitem,e);},false);this.addEventListener(listitem,'mouseout',function(e){if(self.enableKeyboardNavigation)self.clearSelection();self.mouseOut(listitem,e);},false);if(this.enableKeyboardNavigation)
{this.addEventListener(link,'blur',function(e){self.onBlur(listitem);},false);this.addEventListener(link,'focus',function(e){self.keyFocus(listitem,e);},false);}};Spry.Widget.MenuBar.prototype.keyFocus=function(listitem,e)
{this.lastOpen=listitem.getElementsByTagName('a')[0];this.addClassName(this.lastOpen,listitem.getElementsByTagName('ul').length>0?this.subHoverClass:this.hoverClass);this.hasFocus=true;};Spry.Widget.MenuBar.prototype.onBlur=function(listitem)
{this.clearSelection(listitem);};Spry.Widget.MenuBar.prototype.clearSelection=function(el){if(!this.lastOpen)
return;if(el)
{el=el.getElementsByTagName('a')[0];var item=this.lastOpen;while(item!=this.element)
{var tmp=el;while(tmp!=this.element)
{if(tmp==item)
return;try{tmp=tmp.parentNode;}catch(err){break;}}
item=item.parentNode;}}
var item=this.lastOpen;while(item!=this.element)
{this.hideSubmenu(item.parentNode);var link=item.getElementsByTagName('a')[0];this.removeClassName(link,this.hoverClass);this.removeClassName(link,this.subHoverClass);item=item.parentNode;}
this.lastOpen=false;};Spry.Widget.MenuBar.prototype.keyDown=function(e)
{if(!this.hasFocus)
return;if(!this.lastOpen)
{this.hasFocus=false;return;}
var e=e||event;var listitem=this.lastOpen.parentNode;var link=this.lastOpen;var submenus=listitem.getElementsByTagName('ul');var menu=(submenus.length>0?submenus[0]:null);var hasSubMenu=(menu)?true:false;var opts=[listitem,menu,null,this.getSibling(listitem,'previousSibling'),this.getSibling(listitem,'nextSibling')];if(!opts[3])
opts[2]=(listitem.parentNode.parentNode.nodeName.toLowerCase()=='li')?listitem.parentNode.parentNode:null;var found=0;switch(e.keyCode){case this.upKeyCode:found=this.getElementForKey(opts,'y',1);break;case this.downKeyCode:found=this.getElementForKey(opts,'y',-1);break;case this.leftKeyCode:found=this.getElementForKey(opts,'x',1);break;case this.rightKeyCode:found=this.getElementForKey(opts,'x',-1);break;case this.escKeyCode:case 9:this.clearSelection();this.hasFocus=false;default:return;}
switch(found)
{case 0:return;case 1:this.mouseOver(listitem,e);break;case 2:this.mouseOut(opts[2],e);break;case 3:case 4:this.removeClassName(link,hasSubMenu?this.subHoverClass:this.hoverClass);break;}
var link=opts[found].getElementsByTagName('a')[0];if(opts[found].nodeName.toLowerCase()=='ul')
opts[found]=opts[found].getElementsByTagName('li')[0];this.addClassName(link,opts[found].getElementsByTagName('ul').length>0?this.subHoverClass:this.hoverClass);this.lastOpen=link;opts[found].getElementsByTagName('a')[0].focus();return Spry.Widget.MenuBar.stopPropagation(e);};Spry.Widget.MenuBar.prototype.mouseOver=function(listitem,e)
{var link=listitem.getElementsByTagName('a')[0];var submenus=listitem.getElementsByTagName('ul');var menu=(submenus.length>0?submenus[0]:null);var hasSubMenu=(menu)?true:false;if(this.enableKeyboardNavigation)
this.clearSelection(listitem);if(this.bubbledTextEvent())
{return;}
if(listitem.closetime)
clearTimeout(listitem.closetime);if(this.currMenu==listitem)
{this.currMenu=null;}
if(this.hasFocus)
link.focus();this.addClassName(link,hasSubMenu?this.subHoverClass:this.hoverClass);this.lastOpen=link;if(menu&&!this.hasClassName(menu,this.subHoverClass))
{var self=this;listitem.opentime=window.setTimeout(function(){self.showSubmenu(menu);},this.showDelay);}};Spry.Widget.MenuBar.prototype.mouseOut=function(listitem,e)
{var link=listitem.getElementsByTagName('a')[0];var submenus=listitem.getElementsByTagName('ul');var menu=(submenus.length>0?submenus[0]:null);var hasSubMenu=(menu)?true:false;if(this.bubbledTextEvent())
{return;}
var related=(typeof e.relatedTarget!='undefined'?e.relatedTarget:e.toElement);if(!listitem.contains(related))
{if(listitem.opentime)
clearTimeout(listitem.opentime);this.currMenu=listitem;this.removeClassName(link,hasSubMenu?this.subHoverClass:this.hoverClass);if(menu)
{var self=this;listitem.closetime=window.setTimeout(function(){self.hideSubmenu(menu);},this.hideDelay);}
if(this.hasFocus)
link.blur();}};Spry.Widget.MenuBar.prototype.getSibling=function(element,sibling)
{var child=element[sibling];while(child&&child.nodeName.toLowerCase()!='li')
child=child[sibling];return child;};Spry.Widget.MenuBar.prototype.getElementForKey=function(els,prop,dir)
{var found=0;var rect=Spry.Widget.MenuBar.getPosition;var ref=rect(els[found]);var hideSubmenu=false;if(els[1]&&!this.hasClassName(els[1],this.MenuBarSubmenuVisible))
{els[1].style.visibility='hidden';this.showSubmenu(els[1]);hideSubmenu=true;}
var isVert=this.hasClassName(this.element,this.verticalClass);var hasParent=els[0].parentNode.parentNode.nodeName.toLowerCase()=='li'?true:false;for(var i=1;i<els.length;i++){if(prop=='y'&&isVert&&(i==1||i==2))
{continue;}
if(prop=='x'&&!isVert&&!hasParent&&(i==1||i==2))
{continue;}
if(els[i])
{var tmp=rect(els[i]);if((dir*tmp[prop])<(dir*ref[prop]))
{ref=tmp;found=i;}}}
if(els[1]&&hideSubmenu){this.hideSubmenu(els[1]);els[1].style.visibility='';}
return found;};Spry.Widget.MenuBar.camelize=function(str)
{if(str.indexOf('-')==-1){return str;}
var oStringList=str.split('-');var isFirstEntry=true;var camelizedString='';for(var i=0;i<oStringList.length;i++)
{if(oStringList[i].length>0)
{if(isFirstEntry)
{camelizedString=oStringList[i];isFirstEntry=false;}
else
{var s=oStringList[i];camelizedString+=s.charAt(0).toUpperCase()+s.substring(1);}}}
return camelizedString;};Spry.Widget.MenuBar.getStyleProp=function(element,prop)
{var value;try
{if(element.style)
value=element.style[Spry.Widget.MenuBar.camelize(prop)];if(!value)
if(document.defaultView&&document.defaultView.getComputedStyle)
{var css=document.defaultView.getComputedStyle(element,null);value=css?css.getPropertyValue(prop):null;}
else if(element.currentStyle)
{value=element.currentStyle[Spry.Widget.MenuBar.camelize(prop)];}}
catch(e){}
return value=='auto'?null:value;};Spry.Widget.MenuBar.getIntProp=function(element,prop)
{var a=parseInt(Spry.Widget.MenuBar.getStyleProp(element,prop),10);if(isNaN(a))
return 0;return a;};Spry.Widget.MenuBar.getPosition=function(el,doc)
{doc=doc||document;if(typeof(el)=='string'){el=doc.getElementById(el);}
if(!el){return false;}
if(el.parentNode===null||Spry.Widget.MenuBar.getStyleProp(el,'display')=='none'){return false;}
var ret={x:0,y:0};var parent=null;var box;if(el.getBoundingClientRect){box=el.getBoundingClientRect();var scrollTop=doc.documentElement.scrollTop||doc.body.scrollTop;var scrollLeft=doc.documentElement.scrollLeft||doc.body.scrollLeft;ret.x=box.left+scrollLeft;ret.y=box.top+scrollTop;}else if(doc.getBoxObjectFor){box=doc.getBoxObjectFor(el);ret.x=box.x;ret.y=box.y;}else{ret.x=el.offsetLeft;ret.y=el.offsetTop;parent=el.offsetParent;if(parent!=el){while(parent){ret.x+=parent.offsetLeft;ret.y+=parent.offsetTop;parent=parent.offsetParent;}}
if(Spry.is.opera||Spry.is.safari&&Spry.Widget.MenuBar.getStyleProp(el,'position')=='absolute')
ret.y-=doc.body.offsetTop;}
if(el.parentNode)
parent=el.parentNode;else
parent=null;if(parent.nodeName){var cas=parent.nodeName.toUpperCase();while(parent&&cas!='BODY'&&cas!='HTML'){cas=parent.nodeName.toUpperCase();ret.x-=parent.scrollLeft;ret.y-=parent.scrollTop;if(parent.parentNode)
parent=parent.parentNode;else
parent=null;}}
return ret;};Spry.Widget.MenuBar.stopPropagation=function(ev)
{if(ev.stopPropagation)
ev.stopPropagation();else
ev.cancelBubble=true;if(ev.preventDefault)
ev.preventDefault();else
ev.returnValue=false;};Spry.Widget.MenuBar.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(ignoreUndefinedProps&&optionsObj[optionName]==undefined)
continue;obj[optionName]=optionsObj[optionName];}};