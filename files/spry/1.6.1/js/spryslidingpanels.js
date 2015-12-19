// SprySlidingPanels.js - version 0.5 - Spry Pre-Release 1.6.1
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

var Spry;if(!Spry)Spry={};if(!Spry.Widget)Spry.Widget={};Spry.Widget.SlidingPanels=function(element,opts)
{this.element=this.getElement(element);this.enableAnimation=true;this.currentPanel=null;this.enableKeyboardNavigation=true;this.hasFocus=false;this.previousPanelKeyCode=Spry.Widget.SlidingPanels.KEY_LEFT;this.nextPanelKeyCode=Spry.Widget.SlidingPanels.KEY_RIGHT;this.currentPanelClass="SlidingPanelsCurrentPanel";this.focusedClass="SlidingPanelsFocused";this.animatingClass="SlidingPanelsAnimating";Spry.Widget.SlidingPanels.setOptions(this,opts);if(this.element)
this.element.style.overflow="hidden";if(this.defaultPanel)
{if(typeof this.defaultPanel=="number")
this.currentPanel=this.getContentPanels()[this.defaultPanel];else
this.currentPanel=this.getElement(this.defaultPanel);}
if(!this.currentPanel)
this.currentPanel=this.getContentPanels()[0];if(Spry.Widget.SlidingPanels.onloadDidFire)
this.attachBehaviors();else
Spry.Widget.SlidingPanels.loadQueue.push(this);};Spry.Widget.SlidingPanels.prototype.onFocus=function(e)
{this.hasFocus=true;this.addClassName(this.element,this.focusedClass);return false;};Spry.Widget.SlidingPanels.prototype.onBlur=function(e)
{this.hasFocus=false;this.removeClassName(this.element,this.focusedClass);return false;};Spry.Widget.SlidingPanels.KEY_LEFT=37;Spry.Widget.SlidingPanels.KEY_UP=38;Spry.Widget.SlidingPanels.KEY_RIGHT=39;Spry.Widget.SlidingPanels.KEY_DOWN=40;Spry.Widget.SlidingPanels.prototype.onKeyDown=function(e)
{var key=e.keyCode;if(!this.hasFocus||(key!=this.previousPanelKeyCode&&key!=this.nextPanelKeyCode))
return true;if(key==this.nextPanelKeyCode)
this.showNextPanel();else
this.showPreviousPanel();if(e.preventDefault)e.preventDefault();else e.returnValue=false;if(e.stopPropagation)e.stopPropagation();else e.cancelBubble=true;return false;};Spry.Widget.SlidingPanels.prototype.attachBehaviors=function()
{var ele=this.element;if(!ele)
return;if(this.enableKeyboardNavigation)
{var focusEle=null;var tabIndexAttr=ele.attributes.getNamedItem("tabindex");if(tabIndexAttr||ele.nodeName.toLowerCase()=="a")
focusEle=ele;if(focusEle)
{var self=this;Spry.Widget.SlidingPanels.addEventListener(focusEle,"focus",function(e){return self.onFocus(e||window.event);},false);Spry.Widget.SlidingPanels.addEventListener(focusEle,"blur",function(e){return self.onBlur(e||window.event);},false);Spry.Widget.SlidingPanels.addEventListener(focusEle,"keydown",function(e){return self.onKeyDown(e||window.event);},false);}}
if(this.currentPanel)
{var ea=this.enableAnimation;this.enableAnimation=false;this.showPanel(this.currentPanel);this.enableAnimation=ea;}};Spry.Widget.SlidingPanels.prototype.getElement=function(ele)
{if(ele&&typeof ele=="string")
return document.getElementById(ele);return ele;};Spry.Widget.SlidingPanels.prototype.addClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))!=-1))
return;ele.className+=(ele.className?" ":"")+className;};Spry.Widget.SlidingPanels.prototype.removeClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))==-1))
return;ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Spry.Widget.SlidingPanels.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(ignoreUndefinedProps&&optionsObj[optionName]==undefined)
continue;obj[optionName]=optionsObj[optionName];}};Spry.Widget.SlidingPanels.prototype.getElementChildren=function(element)
{var children=[];var child=element.firstChild;while(child)
{if(child.nodeType==1)
children.push(child);child=child.nextSibling;}
return children;};Spry.Widget.SlidingPanels.prototype.getCurrentPanel=function()
{return this.currentPanel;};Spry.Widget.SlidingPanels.prototype.getContentGroup=function()
{return this.getElementChildren(this.element)[0];};Spry.Widget.SlidingPanels.prototype.getContentPanels=function()
{return this.getElementChildren(this.getContentGroup());};Spry.Widget.SlidingPanels.prototype.getContentPanelsCount=function()
{return this.getContentPanels().length;};Spry.Widget.SlidingPanels.onloadDidFire=false;Spry.Widget.SlidingPanels.loadQueue=[];Spry.Widget.SlidingPanels.addLoadListener=function(handler)
{if(typeof window.addEventListener!='undefined')
window.addEventListener('load',handler,false);else if(typeof document.addEventListener!='undefined')
document.addEventListener('load',handler,false);else if(typeof window.attachEvent!='undefined')
window.attachEvent('onload',handler);};Spry.Widget.SlidingPanels.processLoadQueue=function(handler)
{Spry.Widget.SlidingPanels.onloadDidFire=true;var q=Spry.Widget.SlidingPanels.loadQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
q[i].attachBehaviors();};Spry.Widget.SlidingPanels.addLoadListener(Spry.Widget.SlidingPanels.processLoadQueue);Spry.Widget.SlidingPanels.addEventListener=function(element,eventType,handler,capture)
{try
{if(element.addEventListener)
element.addEventListener(eventType,handler,capture);else if(element.attachEvent)
element.attachEvent("on"+eventType,handler);}
catch(e){}};Spry.Widget.SlidingPanels.prototype.getContentPanelIndex=function(ele)
{if(ele)
{ele=this.getElement(ele);var panels=this.getContentPanels();var numPanels=panels.length;for(var i=0;i<numPanels;i++)
{if(panels[i]==ele)
return i;}}
return-1;};Spry.Widget.SlidingPanels.prototype.showPanel=function(elementOrIndex)
{var pIndex=-1;if(typeof elementOrIndex=="number")
pIndex=elementOrIndex;else
pIndex=this.getContentPanelIndex(elementOrIndex);var numPanels=this.getContentPanelsCount();if(numPanels>0)
pIndex=(pIndex>=numPanels)?numPanels-1:pIndex;else
pIndex=0;var panel=this.getContentPanels()[pIndex];var contentGroup=this.getContentGroup();if(panel&&contentGroup)
{if(this.currentPanel)
this.removeClassName(this.currentPanel,this.currentPanelClass);this.currentPanel=panel;var nx=-panel.offsetLeft;var ny=-panel.offsetTop;if(this.enableAnimation)
{if(this.animator)
this.animator.stop();var cx=contentGroup.offsetLeft;var cy=contentGroup.offsetTop;if(cx!=nx||cy!=ny)
{var self=this;this.addClassName(this.element,this.animatingClass);this.animator=new Spry.Widget.SlidingPanels.PanelAnimator(contentGroup,cx,cy,nx,ny,{duration:this.duration,fps:this.fps,transition:this.transition,finish:function()
{self.removeClassName(self.element,self.animatingClass);self.addClassName(panel,self.currentPanelClass);}});this.animator.start();}}
else
{contentGroup.style.left=nx+"px";contentGroup.style.top=ny+"px";this.addClassName(panel,this.currentPanelClass);}}
return panel;};Spry.Widget.SlidingPanels.prototype.showFirstPanel=function()
{return this.showPanel(0);};Spry.Widget.SlidingPanels.prototype.showLastPanel=function()
{return this.showPanel(this.getContentPanels().length-1);};Spry.Widget.SlidingPanels.prototype.showPreviousPanel=function()
{return this.showPanel(this.getContentPanelIndex(this.currentPanel)-1);};Spry.Widget.SlidingPanels.prototype.showNextPanel=function()
{return this.showPanel(this.getContentPanelIndex(this.currentPanel)+1);};Spry.Widget.SlidingPanels.PanelAnimator=function(ele,curX,curY,dstX,dstY,opts)
{this.element=ele;this.curX=curX;this.curY=curY;this.dstX=dstX;this.dstY=dstY;this.fps=60;this.duration=500;this.transition=Spry.Widget.SlidingPanels.PanelAnimator.defaultTransition;this.startTime=0;this.timerID=0;this.finish=null;var self=this;this.intervalFunc=function(){self.step();};Spry.Widget.SlidingPanels.setOptions(this,opts,true);this.interval=1000/this.fps;};Spry.Widget.SlidingPanels.PanelAnimator.defaultTransition=function(time,begin,finish,duration){time/=duration;return begin+((2-time)*time*finish);};Spry.Widget.SlidingPanels.PanelAnimator.prototype.start=function()
{this.stop();this.startTime=(new Date()).getTime();this.timerID=setTimeout(this.intervalFunc,this.interval);};Spry.Widget.SlidingPanels.PanelAnimator.prototype.stop=function()
{if(this.timerID)
clearTimeout(this.timerID);this.timerID=0;};Spry.Widget.SlidingPanels.PanelAnimator.prototype.step=function()
{var elapsedTime=(new Date()).getTime()-this.startTime;var done=elapsedTime>=this.duration;var x,y;if(done)
{x=this.curX=this.dstX;y=this.curY=this.dstY;}
else
{x=this.transition(elapsedTime,this.curX,this.dstX-this.curX,this.duration);y=this.transition(elapsedTime,this.curY,this.dstY-this.curY,this.duration);}
this.element.style.left=x+"px";this.element.style.top=y+"px";if(!done)
this.timerID=setTimeout(this.intervalFunc,this.interval);else if(this.finish)
this.finish();};