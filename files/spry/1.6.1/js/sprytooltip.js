// SpryTooltip.js - version 0.7 - Spry Pre-Release 1.6.1
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

var Spry;if(!Spry)Spry={};if(!Spry.Widget)Spry.Widget={};Spry.Widget.BrowserSniff=function()
{var b=navigator.appName.toString();var up=navigator.platform.toString();var ua=navigator.userAgent.toString();this.mozilla=this.ie=this.opera=this.safari=false;var re_opera=/Opera.([0-9\.]*)/i;var re_msie=/MSIE.([0-9\.]*)/i;var re_gecko=/gecko/i;var re_safari=/(applewebkit|safari)\/([\d\.]*)/i;var r=false;if((r=ua.match(re_opera))){this.opera=true;this.version=parseFloat(r[1]);}else if((r=ua.match(re_msie))){this.ie=true;this.version=parseFloat(r[1]);}else if((r=ua.match(re_safari))){this.safari=true;if(parseFloat(r[2])<420)
this.version=2;else
this.version=3;}else if(ua.match(re_gecko)){var re_gecko_version=/rv:\s*([0-9\.]+)/i;r=ua.match(re_gecko_version);this.mozilla=true;this.version=parseFloat(r[1]);}
this.windows=this.mac=this.linux=false;this.Platform=ua.match(/windows/i)?"windows":(ua.match(/linux/i)?"linux":(ua.match(/mac/i)?"mac":ua.match(/unix/i)?"unix":"unknown"));this[this.Platform]=true;this.v=this.version;if(this.safari&&this.mac&&this.mozilla){this.mozilla=false;}};Spry.is=new Spry.Widget.BrowserSniff();Spry.Widget.Tooltip=function(tooltip_element,trigger_selector,options)
{options=Spry.Widget.Utils.firstValid(options,{});this.init(trigger_selector,tooltip_element,options);if(Spry.Widget.Tooltip.onloadDidFire)
this.attachBehaviors();Spry.Widget.Tooltip.loadQueue.push(this);};Spry.Widget.Tooltip.prototype.init=function(trigger_element,tooltip_element,options)
{var Utils=Spry.Widget.Utils;this.triggerElements=Utils.getElementsByClassName(trigger_element);this.tooltipElement=Utils.getElement(tooltip_element);options.showDelay=parseInt(Utils.firstValid(options.showDelay,0),10);options.hideDelay=parseInt(Utils.firstValid(options.hideDelay,0),10);if(typeof this.triggerElements=='undefined'||!(this.triggerElements.length>0))
{this.showError('The element(s) "'+trigger_element+'" do not exist in the page');return false;}
if(typeof this.tooltipElement=='undefined'||!this.tooltipElement)
{this.showError('The element "'+tooltip_element+'" do not exists in the page');return false;}
this.listenersAttached=false;this.hoverClass="";this.followMouse=false;this.offsetX=15;this.offsetY=15;this.closeOnTooltipLeave=false;this.useEffect=false;Utils.setOptions(this,options);this.animator=null;for(var i=0;i<this.triggerElements.length;i++)
if(!this.triggerElements[i].className)
this.triggerElements[i].className='';if(this.useEffect){switch(this.useEffect.toString().toLowerCase()){case'blind':this.useEffect='Blind';break;case'fade':this.useEffect='Fade';break;default:this.useEffect=false;}}
this.visibleTooltip=false;this.tooltipElement.offsetHeight;if(Spry.Widget.Utils.getStyleProperty(this.tooltipElement,'display')!='none')
{this.tooltipElement.style.display='none';}
if(typeof this.offsetX!='numeric')
this.offsetX=parseInt(this.offsetX,10);if(isNaN(this.offsetX))
this.offsetX=0;if(typeof this.offsetY!='numeric')
this.offsetY=parseInt(this.offsetY,10);if(isNaN(this.offsetY))
this.offsetY=0;this.tooltipElement.style.position='absolute';this.tooltipElement.style.top='0px';this.tooltipElement.style.left='0px';};Spry.Widget.Tooltip.onloadDidFire=false;Spry.Widget.Tooltip.loadQueue=[];Spry.Widget.Tooltip.addLoadListener=function(handler)
{if(typeof window.addEventListener!='undefined')
window.addEventListener('load',handler,false);else if(typeof document.addEventListener!='undefined')
document.addEventListener('load',handler,false);else if(typeof window.attachEvent!='undefined')
window.attachEvent('onload',handler);};Spry.Widget.Tooltip.processLoadQueue=function(handler)
{Spry.Widget.Tooltip.onloadDidFire=true;var q=Spry.Widget.Tooltip.loadQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
if(!q[i].listenersAttached)
q[i].attachBehaviors();};Spry.Widget.Tooltip.addLoadListener(Spry.Widget.Tooltip.processLoadQueue);Spry.Widget.Tooltip.prototype.addClassName=function(ele,className)
{if(!ele||!className)
return;if(ele.className.indexOf(className)==-1)
ele.className+=(ele.className?" ":"")+className;};Spry.Widget.Tooltip.prototype.removeClassName=function(ele,className)
{if(!ele||!className)
return;ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Spry.Widget.Tooltip.prototype.showTooltip=function()
{if(!this.visibleTooltip)
{this.tooltipElement.style.visibility='hidden';this.tooltipElement.style.zIndex='9999';this.tooltipElement.style.display='block';}
Spry.Widget.Utils.putElementAt(this.tooltipElement,this.pos,{x:this.offsetX,y:this.offsetY},true);if(Spry.is.ie&&Spry.is.version=='6')
this.createIframeLayer(this.tooltipElement);if(!this.visibleTooltip)
{if(this.useEffect)
{if(typeof this.showEffect=='undefined')
this.showEffect=new Spry.Widget.Tooltip[this.useEffect](this.tooltipElement,{from:0,to:1});this.showEffect.start();}
else
this.tooltipElement.style.visibility='visible';}
this.visibleTooltip=true;};Spry.Widget.Tooltip.prototype.hideTooltip=function(quick)
{if(this.useEffect&&!quick)
{if(typeof this.hideEffect=='undefined')
this.hideEffect=new Spry.Widget.Tooltip[this.useEffect](this.tooltipElement,{from:1,to:0});this.hideEffect.start();}
else
{if(typeof this.showEffect!='undefined')
this.showEffect.stop();this.tooltipElement.style.display='none';}
if(Spry.is.ie&&Spry.is.version=='6')
this.removeIframeLayer(this.tooltipElement);if(this.hoverClass&&!this.hideTimer)
{for(var i=0;i<this.triggerElements.length;i++)
this.removeClassName(this.triggerElements[i],this.hoverClass);}
this.visibleTooltip=false;};Spry.Widget.Tooltip.prototype.displayTooltip=function(show){if(this.tooltipElement)
{if(this.hoverClass){for(var i=0;i<this.triggerElements.length;i++)
this.removeClassName(this.triggerElements[i],this.hoverClass);}
if(show)
{if(this.hideTimer)
{clearInterval(this.hideTimer);delete(this.hideTimer);}
if(this.hoverClass)
{if(typeof this.triggerHighlight!='undefined')
this.addClassName(this.triggerHighlight,this.hoverClass);}
var self=this;this.showTimer=setTimeout(function(){self.showTooltip()},this.showDelay);}
else
{if(this.showTimer)
{clearInterval(this.showTimer);delete(this.showTimer);}
var self=this;this.hideTimer=setTimeout(function(){self.hideTooltip();},this.hideDelay);}}
this.refreshTimeout();};Spry.Widget.Tooltip.prototype.onMouseOverTrigger=function(e)
{var target='';if(Spry.is.ie)
target=e.srcElement;else
target=e.target;var contains=Spry.Widget.Utils.contains;for(var i=0;i<this.triggerElements.length;i++)
if(contains(this.triggerElements[i],target))
{target=this.triggerElements[i];break;}
if(i==this.triggerElements.length)return;if(this.visibleTooltip&&this.triggerHighlight&&this.triggerHighlight==target)
{if(this.hideTimer)
{clearInterval(this.hideTimer);delete(this.hideTimer);}
if(this.hoverClass)
{if(typeof this.triggerHighlight!='undefined')
this.addClassName(this.triggerHighlight,this.hoverClass);}
return;}
var pos=Spry.Widget.Utils.getAbsoluteMousePosition(e);this.pos={x:pos.x+this.offsetX,y:pos.y+this.offsetY};this.triggerHighlight=target;Spry.Widget.Tooltip.closeAll();this.displayTooltip(true);};Spry.Widget.Tooltip.prototype.onMouseMoveTrigger=function(e)
{var pos=Spry.Widget.Utils.getAbsoluteMousePosition(e);this.pos={x:pos.x+this.offsetX,y:pos.y+this.offsetY};if(this.visibleTooltip)
this.showTooltip();};Spry.Widget.Tooltip.prototype.onMouseOutTrigger=function(e)
{var target='';if(Spry.is.ie)
target=e.toElement;else
target=e.relatedTarget;var contains=Spry.Widget.Utils.contains;for(var i=0;i<this.triggerElements.length;i++)
if(contains(this.triggerElements[i],target))
return;this.displayTooltip(false);};Spry.Widget.Tooltip.prototype.onMouseOutTooltip=function(e)
{var target='';if(Spry.is.ie)
target=e.toElement;else
target=e.relatedTarget;var contains=Spry.Widget.Utils.contains;if(contains(this.tooltipElement,target))
return;this.displayTooltip(false);};Spry.Widget.Tooltip.prototype.onMouseOverTooltip=function(e)
{if(this.hideTimer)
{clearInterval(this.hideTimer);delete(this.hideTimer);}
if(this.hoverClass)
{if(typeof this.triggerHighlight!='undefined')
this.addClassName(this.triggerHighlight,this.hoverClass);}};Spry.Widget.Tooltip.prototype.refreshTimeout=function()
{if(Spry.Widget.Tooltip.refreshTimeout!=null)
{clearTimeout(Spry.Widget.Tooltip.refreshTimeout);Spry.Widget.Tooltip.refreshTimeout=null;}
Spry.Widget.Tooltip.refreshTimeout=setTimeout(Spry.Widget.Tooltip.refreshAll,100);};Spry.Widget.Tooltip.prototype.destroy=function()
{for(var k in this)
{try{if(typeof this.k=='object'&&typeof this.k.destroy=='function')this.k.destroy();delete this.k;}catch(err){}}};Spry.Widget.Tooltip.prototype.checkDestroyed=function()
{if(!this.tooltipElement||this.tooltipElement.parentNode==null)
return true;return false;};Spry.Widget.Tooltip.prototype.attachBehaviors=function()
{var self=this;var ev=Spry.Widget.Utils.addEventListener;for(var i=0;i<this.triggerElements.length;i++)
{ev(this.triggerElements[i],'mouseover',function(e){self.onMouseOverTrigger(e||event);return true;},false);ev(this.triggerElements[i],'mouseout',function(e){self.onMouseOutTrigger(e||event);return true;},false);if(this.followMouse)
ev(this.triggerElements[i],'mousemove',function(e){self.onMouseMoveTrigger(e||event);return true;},false);}
if(this.closeOnTooltipLeave)
{ev(this.tooltipElement,'mouseover',function(e){self.onMouseOverTooltip(e||event);return true;},false);ev(this.tooltipElement,'mouseout',function(e){self.onMouseOutTooltip(e||event);return true;},false);}
this.listenersAttached=true;};Spry.Widget.Tooltip.prototype.createIframeLayer=function(tooltip)
{if(typeof this.iframeLayer=='undefined')
{var layer=document.createElement('iframe');layer.tabIndex='-1';layer.src='javascript:"";';layer.scrolling='no';layer.frameBorder='0';layer.className='iframeTooltip';tooltip.parentNode.appendChild(layer);this.iframeLayer=layer;}
this.iframeLayer.style.left=tooltip.offsetLeft+'px';this.iframeLayer.style.top=tooltip.offsetTop+'px';this.iframeLayer.style.width=tooltip.offsetWidth+'px';this.iframeLayer.style.height=tooltip.offsetHeight+'px';this.iframeLayer.style.display='block';};Spry.Widget.Tooltip.prototype.removeIframeLayer=function(tooltip)
{if(this.iframeLayer)
this.iframeLayer.style.display='none';};Spry.Widget.Tooltip.prototype.showError=function(msg)
{alert('Spry.Widget.Tooltip ERR: '+msg);};Spry.Widget.Tooltip.refreshAll=function()
{var q=Spry.Widget.Tooltip.loadQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
{if(q[i].checkDestroyed())
{q[i].destroy();q.splice(i,1);i--;qlen=q.length;}}};Spry.Widget.Tooltip.closeAll=function()
{var q=Spry.Widget.Tooltip.loadQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
{if(q[i].visibleTooltip)
q[i].hideTooltip(true);if(q[i].showTimer)
clearTimeout(q[i].showTimer);if(q[i].hideTimer)
clearTimeout(q[i].hideTimer);}};Spry.Widget.Tooltip.Animator=function(element,opts)
{this.timer=null;this.fps=60;this.duration=500;this.startTime=0;this.transition=Spry.Widget.Tooltip.Animator.defaultTransition;this.onComplete=null;if(typeof element=='undefined')return;this.element=Spry.Widget.Utils.getElement(element);Spry.Widget.Utils.setOptions(this,opts,true);this.interval=this.duration/this.fps;};Spry.Widget.Tooltip.Animator.defaultTransition=function(time,begin,finish,duration){time/=duration;return begin+((2-time)*time*finish);};Spry.Widget.Tooltip.Animator.prototype.start=function()
{var self=this;this.startTime=(new Date).getTime();this.beforeStart();this.timer=setInterval(function(){self.stepAnimation();},this.interval);};Spry.Widget.Tooltip.Animator.prototype.stop=function()
{if(this.timer)
clearTimeout(this.timer);this.timer=null;};Spry.Widget.Tooltip.Animator.prototype.stepAnimation=function(){};Spry.Widget.Tooltip.Animator.prototype.beforeStart=function(){};Spry.Widget.Tooltip.Animator.prototype.destroy=function()
{for(var k in this)
try
{delete this.k;}catch(err){}};Spry.Widget.Tooltip.Fade=function(element,opts)
{Spry.Widget.Tooltip.Animator.call(this,element,opts);if(Spry.is.ie)
this.origOpacity=this.element.style.filter;else
this.origOpacity=this.element.style.opacity;};Spry.Widget.Tooltip.Fade.prototype=new Spry.Widget.Tooltip.Animator();Spry.Widget.Tooltip.Fade.prototype.constructor=Spry.Widget.Tooltip.Fade;Spry.Widget.Tooltip.Fade.prototype.stepAnimation=function()
{var curTime=(new Date).getTime();var elapsedTime=curTime-this.startTime;var i,obj;if(elapsedTime>=this.duration)
{this.beforeStop();this.stop();return;}
var ht=this.transition(elapsedTime,this.from,this.to-this.from,this.duration);if(Spry.is.ie)
{var filter=this.element.style.filter.replace(/alpha\s*\(\s*opacity\s*=\s*[0-9\.]{1,3}\)/,'');this.element.style.filter=filter+'alpha(opacity='+parseInt(ht*100,10)+')';}
else
{this.element.style.opacity=ht;}
this.element.style.visibility='visible';this.element.style.display='block';};Spry.Widget.Tooltip.Fade.prototype.beforeStop=function()
{if(this.from>this.to)
this.element.style.display='none';if(Spry.is.mozilla)
this.element.style.filter=this.origOpacity;else
this.element.style.opacity=this.origOpacity;};Spry.Widget.Tooltip.Blind=function(element,opts)
{this.from=0;this.to=100;Spry.Widget.Tooltip.Animator.call(this,element,opts);this.element.style.visibility='hidden';this.element.style.display='block';this.origHeight=parseInt(Spry.Widget.Utils.getStyleProperty(this.element,'height'),10);if(isNaN(this.origHeight))
this.origHeight=this.element.offsetHeight;if(this.to==0)
this.from=this.origHeight;else
this.to=this.origHeight;};Spry.Widget.Tooltip.Blind.prototype=new Spry.Widget.Tooltip.Animator();Spry.Widget.Tooltip.Blind.prototype.constructor=Spry.Widget.Tooltip.Blind;Spry.Widget.Tooltip.Blind.prototype.beforeStart=function()
{this.origOverflow=Spry.Widget.Utils.getStyleProperty(this.element,'overflow');this.element.style.overflow='hidden';};Spry.Widget.Tooltip.Blind.prototype.stepAnimation=function()
{var curTime=(new Date).getTime();var elapsedTime=curTime-this.startTime;var i,obj;if(elapsedTime>=this.duration)
{this.beforeStop();this.stop();return;}
var ht=this.transition(elapsedTime,this.from,this.to-this.from,this.duration);this.element.style.height=Math.floor(ht)+'px';this.element.style.visibility='visible';this.element.style.display='block';};Spry.Widget.Tooltip.Blind.prototype.beforeStop=function()
{this.element.style.overflow=this.origOverflow;if(this.from>this.to)
this.element.style.display='none';this.element.style.height=this.origHeight+'px';};if(!Spry.Widget.Utils)Spry.Widget.Utils={};Spry.Widget.Utils.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(ignoreUndefinedProps&&optionsObj[optionName]==undefined)
continue;obj[optionName]=optionsObj[optionName];}};Spry.Widget.Utils.getElement=function(ele)
{if(ele&&typeof ele=="string")
return document.getElementById(ele);return ele;};Spry.Widget.Utils.getElementsByClassName=function(sel)
{if(!sel.length>0)
return null;var selectors=sel.split(',');var el=[];for(var i=0;i<selectors.length;i++)
{var cs=selectors[i];var chunk=cs.split(' ');var parents=[];parents[0]=[];parents[0][0]=document.body;for(var j=0;j<chunk.length;j++)
{var tokens=Spry.Widget.Utils.getSelectorTokens(chunk[j]);for(var k=0;k<parents[j].length;k++)
{var childs=parents[j][k].getElementsByTagName('*');parents[j+1]=[];for(var l=0;l<childs.length;l++)
if(Spry.Widget.Utils.hasSelector(childs[l],tokens))
parents[j+1].push(childs[l]);}}
if(parents[j])
{for(var k=0;k<parents[j].length;k++)
el.push(parents[j][k]);}}
return el;};Spry.Widget.Utils.firstValid=function()
{var ret=null;var a=Spry.Widget.Utils.firstValid;for(var i=0;i<a.arguments.length;i++)
{if(typeof(a.arguments[i])!='undefined')
{ret=a.arguments[i];break;}}
return ret;};Spry.Widget.Utils.getSelectorTokens=function(str)
{str=str.replace(/\./g,' .');str=str.replace(/\#/g,' #');str=str.replace(/^\s+|\s+$/g,"");return str.split(' ');};Spry.Widget.Utils.hasSelector=function(el,tokens)
{for(var i=0;i<tokens.length;i++)
{switch(tokens[i].charAt(0))
{case'.':if(!el.className||el.className.indexOf(tokens[i].substr(1))==-1)return false;break;case'#':if(!el.id||el.id!=tokens[i].substr(1))return false;break;default:if(el.nodeName.toLowerCase!=tokens[i])return false;break;}}
return true;};Spry.Widget.Utils.addEventListener=function(element,eventType,handler,capture)
{try
{if(element.addEventListener)
element.addEventListener(eventType,handler,capture);else if(element.attachEvent)
element.attachEvent("on"+eventType,handler);}
catch(e){}};Spry.Widget.Utils.getStyleProperty=function(element,prop)
{var value;var camelized=Spry.Widget.Utils.camelize(prop);try
{if(element.style)
value=element.style[camelized];if(!value)
{if(document.defaultView&&document.defaultView.getComputedStyle)
{var css=document.defaultView.getComputedStyle(element,null);value=css?css.getPropertyValue(prop):null;}
else if(element.currentStyle)
{value=element.currentStyle[camelized];}}}
catch(e){}
return value=='auto'?null:value;};Spry.Widget.Utils.camelize=function(str)
{if(str.indexOf('-')==-1)
return str;var oStringList=str.split('-');var isFirstEntry=true;var camelizedString='';for(var i=0;i<oStringList.length;i++)
{if(oStringList[i].length>0)
{if(isFirstEntry)
{camelizedString=oStringList[i];isFirstEntry=false;}
else
{var s=oStringList[i];camelizedString+=s.charAt(0).toUpperCase()+s.substring(1);}}}
return camelizedString;};Spry.Widget.Utils.getPixels=function(m,s)
{var v=Spry.Widget.Utils.getStyleProperty(m,s);if(v=="medium"){v=2;}else{v=parseInt(v,10);}
v=isNaN(v)?0:v;return v;};Spry.Widget.Utils.getAbsoluteMousePosition=function(ev)
{var pos={x:0,y:0};if(ev.pageX)
pos.x=ev.pageX;else if(ev.clientX)
pos.x=ev.clientX+(document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);if(isNaN(pos.x))pos.x=0;if(ev.pageY)
pos.y=ev.pageY;else if(ev.clientY)
pos.y=ev.clientY+(document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);if(isNaN(pos.y))pos.y=0;return pos;};Spry.Widget.Utils.getBorderBox=function(el,doc)
{doc=doc||document;if(typeof el=='string')
el=doc.getElementById(el);if(!el)
return false;if(el.parentNode===null||Spry.Widget.Utils.getStyleProperty(el,'display')=='none')
return false;var ret={x:0,y:0,width:0,height:0};var parent=null;var box;if(el.getBoundingClientRect){box=el.getBoundingClientRect();var scrollTop=doc.documentElement.scrollTop||doc.body.scrollTop;var scrollLeft=doc.documentElement.scrollLeft||doc.body.scrollLeft;ret.x=box.left+scrollLeft;ret.y=box.top+scrollTop;ret.width=box.right-box.left;ret.height=box.bottom-box.top;}else if(doc.getBoxObjectFor){box=doc.getBoxObjectFor(el);ret.x=box.x;ret.y=box.y;ret.width=box.width;ret.height=box.height;var btw=Spry.Widget.Utils.getPixels(el,"border-top-width");var blw=Spry.Widget.Utils.getPixels(el,"border-left-width");ret.x-=blw;ret.y-=btw;}else{ret.x=el.offsetLeft;ret.y=el.offsetTop;ret.width=el.offsetWidth;ret.height=el.offsetHeight;parent=el.offsetParent;if(parent!=el)
{while(parent)
{ret.x+=parent.offsetLeft;ret.y+=parent.offsetTop;parent=parent.offsetParent;}}
var blw=Spry.Widget.Utils.getPixels(el,"border-left-width");var btw=Spry.Widget.Utils.getPixels(el,"border-top-width");ret.x-=blw;ret.y-=btw;var ua=navigator.userAgent.toLowerCase();if(Spry.is.opera||Spry.is.safari&&Spry.Widget.Utils.getStyleProperty(el,'position')=='absolute')
ret.y-=doc.body.offsetTop;}
if(el.parentNode)
parent=el.parentNode;else
parent=null;while(parent&&parent.tagName!='BODY'&&parent.tagName!='HTML')
{ret.x-=parent.scrollLeft;ret.y-=parent.scrollTop;if(parent.parentNode)
parent=parent.parentNode;else
parent=null;}
return ret;};Spry.Widget.Utils.setBorderBox=function(el,box){var pos=Spry.Widget.Utils.getBorderBox(el,el.ownerDocument);if(pos===false)
return false;var delta={x:Spry.Widget.Utils.getPixels(el,'left'),y:Spry.Widget.Utils.getPixels(el,'top')};var new_pos={x:0,y:0,w:0,h:0};if(typeof box.x=='number'){new_pos.x=box.x-pos.x+delta.x;}
if(typeof box.y=='number'){new_pos.y=box.y-pos.y+delta.y;}
if(typeof box.x=='number'){el.style.left=new_pos.x+'px';}
if(typeof box.y=='number'){el.style.top=new_pos.y+'px';}
return true;};Spry.Widget.Utils.putElementAt=function(source,target,offset,biv)
{biv=Spry.Widget.Utils.firstValid(biv,true);var source_box=Spry.Widget.Utils.getBorderBox(source,source.ownerDocument);Spry.Widget.Utils.setBorderBox(source,target);if(biv)
Spry.Widget.Utils.bringIntoView(source);return true;};Spry.Widget.Utils.bringIntoView=function(source){var box=Spry.Widget.Utils.getBorderBox(source,source.ownerDocument);if(box===false){return false;}
var current={x:Spry.Widget.Utils.getPixels(source,'left'),y:Spry.Widget.Utils.getPixels(source,'top')};var delta={x:0,y:0};var offset_fix={x:0,y:0};var strictm=source.ownerDocument.compatMode=="CSS1Compat";var doc=(Spry.is.ie&&strictm||Spry.is.mozilla)?source.ownerDocument.documentElement:source.ownerDocument.body;offset_fix.x=Spry.Widget.Utils.getPixels(doc,'border-left-width');offset_fix.y=Spry.Widget.Utils.getPixels(doc,'border-top-width');var st=doc.scrollTop;var ch=self.innerHeight?self.innerHeight:doc.clientHeight;var t=box.y+(Spry.is.ie?-offset_fix.y:offset_fix.y);var b=box.y+box.height+(Spry.is.ie?-offset_fix.y:offset_fix.y);if(b-st>ch){delta.y=ch-(b-st);if(t+delta.y<st){delta.y=st-t;}}else if(t<st){delta.y=st-t;}
if(delta.y!=0){source.style.top=(current.y+delta.y)+'px';}
var sl=doc.scrollLeft;var cw=doc.clientWidth;var l=box.x+(Spry.is.ie?-offset_fix.x:offset_fix.x);var r=box.x+box.width+(Spry.is.ie?-offset_fix.x:offset_fix.x);if(r-sl>cw){delta.x=cw-(r-sl);if(l+delta.x<sl){delta.x=sl-l;}}else if(l<sl){delta.x=sl-l;}
if(delta.x!=0){source.style.left=(current.x+delta.x)+'px';}};Spry.Widget.Utils.contains=function(who,what){if(typeof who.contains=='object'){return what&&who&&(who==what||who.contains(what));}else{var el=what;while(el){try{if(el==who){return true;}
el=el.parentNode;}catch(a){return false;}}
return false;}};