// SpryCollapsiblePanel.js - version 0.7 - Spry Pre-Release 1.6
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

var Spry;if(!Spry)Spry={};if(!Spry.Widget)Spry.Widget={};Spry.Widget.CollapsiblePanel=function(element,opts)
{this.element=this.getElement(element);this.focusElement=null;this.hoverClass="CollapsiblePanelTabHover";this.openClass="CollapsiblePanelOpen";this.closedClass="CollapsiblePanelClosed";this.focusedClass="CollapsiblePanelFocused";this.enableAnimation=true;this.enableKeyboardNavigation=true;this.animator=null;this.hasFocus=false;this.contentIsOpen=true;this.openPanelKeyCode=Spry.Widget.CollapsiblePanel.KEY_DOWN;this.closePanelKeyCode=Spry.Widget.CollapsiblePanel.KEY_UP;Spry.Widget.CollapsiblePanel.setOptions(this,opts);this.attachBehaviors();};Spry.Widget.CollapsiblePanel.prototype.getElement=function(ele)
{if(ele&&typeof ele=="string")
return document.getElementById(ele);return ele;};Spry.Widget.CollapsiblePanel.prototype.addClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))!=-1))
return;ele.className+=(ele.className?" ":"")+className;};Spry.Widget.CollapsiblePanel.prototype.removeClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))==-1))
return;ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Spry.Widget.CollapsiblePanel.prototype.hasClassName=function(ele,className)
{if(!ele||!className||!ele.className||ele.className.search(new RegExp("\\b"+className+"\\b"))==-1)
return false;return true;};Spry.Widget.CollapsiblePanel.prototype.setDisplay=function(ele,display)
{if(ele)
ele.style.display=display;};Spry.Widget.CollapsiblePanel.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(ignoreUndefinedProps&&optionsObj[optionName]==undefined)
continue;obj[optionName]=optionsObj[optionName];}};Spry.Widget.CollapsiblePanel.prototype.onTabMouseOver=function(e)
{this.addClassName(this.getTab(),this.hoverClass);return false;};Spry.Widget.CollapsiblePanel.prototype.onTabMouseOut=function(e)
{this.removeClassName(this.getTab(),this.hoverClass);return false;};Spry.Widget.CollapsiblePanel.prototype.open=function()
{this.contentIsOpen=true;if(this.enableAnimation)
{if(this.animator)
this.animator.stop();this.animator=new Spry.Widget.CollapsiblePanel.PanelAnimator(this,true,{duration:this.duration,fps:this.fps,transition:this.transition});this.animator.start();}
else
this.setDisplay(this.getContent(),"block");this.removeClassName(this.element,this.closedClass);this.addClassName(this.element,this.openClass);};Spry.Widget.CollapsiblePanel.prototype.close=function()
{this.contentIsOpen=false;if(this.enableAnimation)
{if(this.animator)
this.animator.stop();this.animator=new Spry.Widget.CollapsiblePanel.PanelAnimator(this,false,{duration:this.duration,fps:this.fps,transition:this.transition});this.animator.start();}
else
this.setDisplay(this.getContent(),"none");this.removeClassName(this.element,this.openClass);this.addClassName(this.element,this.closedClass);};Spry.Widget.CollapsiblePanel.prototype.onTabClick=function(e)
{if(this.isOpen())
this.close();else
this.open();this.focus();return this.stopPropagation(e);};Spry.Widget.CollapsiblePanel.prototype.onFocus=function(e)
{this.hasFocus=true;this.addClassName(this.element,this.focusedClass);return false;};Spry.Widget.CollapsiblePanel.prototype.onBlur=function(e)
{this.hasFocus=false;this.removeClassName(this.element,this.focusedClass);return false;};Spry.Widget.CollapsiblePanel.KEY_UP=38;Spry.Widget.CollapsiblePanel.KEY_DOWN=40;Spry.Widget.CollapsiblePanel.prototype.onKeyDown=function(e)
{var key=e.keyCode;if(!this.hasFocus||(key!=this.openPanelKeyCode&&key!=this.closePanelKeyCode))
return true;if(this.isOpen()&&key==this.closePanelKeyCode)
this.close();else if(key==this.openPanelKeyCode)
this.open();return this.stopPropagation(e);};Spry.Widget.CollapsiblePanel.prototype.stopPropagation=function(e)
{if(e.preventDefault)e.preventDefault();else e.returnValue=false;if(e.stopPropagation)e.stopPropagation();else e.cancelBubble=true;return false;};Spry.Widget.CollapsiblePanel.prototype.attachPanelHandlers=function()
{var tab=this.getTab();if(!tab)
return;var self=this;Spry.Widget.CollapsiblePanel.addEventListener(tab,"click",function(e){return self.onTabClick(e);},false);Spry.Widget.CollapsiblePanel.addEventListener(tab,"mouseover",function(e){return self.onTabMouseOver(e);},false);Spry.Widget.CollapsiblePanel.addEventListener(tab,"mouseout",function(e){return self.onTabMouseOut(e);},false);if(this.enableKeyboardNavigation)
{var tabIndexEle=null;var tabAnchorEle=null;this.preorderTraversal(tab,function(node){if(node.nodeType==1)
{var tabIndexAttr=tab.attributes.getNamedItem("tabindex");if(tabIndexAttr)
{tabIndexEle=node;return true;}
if(!tabAnchorEle&&node.nodeName.toLowerCase()=="a")
tabAnchorEle=node;}
return false;});if(tabIndexEle)
this.focusElement=tabIndexEle;else if(tabAnchorEle)
this.focusElement=tabAnchorEle;if(this.focusElement)
{Spry.Widget.CollapsiblePanel.addEventListener(this.focusElement,"focus",function(e){return self.onFocus(e);},false);Spry.Widget.CollapsiblePanel.addEventListener(this.focusElement,"blur",function(e){return self.onBlur(e);},false);Spry.Widget.CollapsiblePanel.addEventListener(this.focusElement,"keydown",function(e){return self.onKeyDown(e);},false);}}};Spry.Widget.CollapsiblePanel.addEventListener=function(element,eventType,handler,capture)
{try
{if(element.addEventListener)
element.addEventListener(eventType,handler,capture);else if(element.attachEvent)
element.attachEvent("on"+eventType,handler);}
catch(e){}};Spry.Widget.CollapsiblePanel.prototype.preorderTraversal=function(root,func)
{var stopTraversal=false;if(root)
{stopTraversal=func(root);if(root.hasChildNodes())
{var child=root.firstChild;while(!stopTraversal&&child)
{stopTraversal=this.preorderTraversal(child,func);try{child=child.nextSibling;}catch(e){child=null;}}}}
return stopTraversal;};Spry.Widget.CollapsiblePanel.prototype.attachBehaviors=function()
{var panel=this.element;var tab=this.getTab();var content=this.getContent();if(this.contentIsOpen||this.hasClassName(panel,this.openClass))
{this.addClassName(panel,this.openClass);this.removeClassName(panel,this.closedClass);this.setDisplay(content,"block");this.contentIsOpen=true;}
else
{this.removeClassName(panel,this.openClass);this.addClassName(panel,this.closedClass);this.setDisplay(content,"none");this.contentIsOpen=false;}
this.attachPanelHandlers();};Spry.Widget.CollapsiblePanel.prototype.getTab=function()
{return this.getElementChildren(this.element)[0];};Spry.Widget.CollapsiblePanel.prototype.getContent=function()
{return this.getElementChildren(this.element)[1];};Spry.Widget.CollapsiblePanel.prototype.isOpen=function()
{return this.contentIsOpen;};Spry.Widget.CollapsiblePanel.prototype.getElementChildren=function(element)
{var children=[];var child=element.firstChild;while(child)
{if(child.nodeType==1)
children.push(child);child=child.nextSibling;}
return children;};Spry.Widget.CollapsiblePanel.prototype.focus=function()
{if(this.focusElement&&this.focusElement.focus)
this.focusElement.focus();};Spry.Widget.CollapsiblePanel.PanelAnimator=function(panel,doOpen,opts)
{this.timer=null;this.interval=0;this.fps=60;this.duration=500;this.startTime=0;this.transition=Spry.Widget.CollapsiblePanel.PanelAnimator.defaultTransition;this.onComplete=null;this.panel=panel;this.content=panel.getContent();this.doOpen=doOpen;Spry.Widget.CollapsiblePanel.setOptions(this,opts,true);this.interval=Math.floor(1000/this.fps);var c=this.content;var curHeight=c.offsetHeight?c.offsetHeight:0;this.fromHeight=(doOpen&&c.style.display=="none")?0:curHeight;if(!doOpen)
this.toHeight=0;else
{if(c.style.display=="none")
{c.style.visibility="hidden";c.style.display="block";}
c.style.height="";this.toHeight=c.offsetHeight;}
this.distance=this.toHeight-this.fromHeight;this.overflow=c.style.overflow;c.style.height=this.fromHeight+"px";c.style.visibility="visible";c.style.overflow="hidden";c.style.display="block";};Spry.Widget.CollapsiblePanel.PanelAnimator.defaultTransition=function(time,begin,finish,duration){time/=duration;return begin+((2-time)*time*finish);};Spry.Widget.CollapsiblePanel.PanelAnimator.prototype.start=function()
{var self=this;this.startTime=(new Date).getTime();this.timer=setTimeout(function(){self.stepAnimation();},this.interval);};Spry.Widget.CollapsiblePanel.PanelAnimator.prototype.stop=function()
{if(this.timer)
{clearTimeout(this.timer);this.content.style.overflow=this.overflow;}
this.timer=null;};Spry.Widget.CollapsiblePanel.PanelAnimator.prototype.stepAnimation=function()
{var curTime=(new Date).getTime();var elapsedTime=curTime-this.startTime;if(elapsedTime>=this.duration)
{if(!this.doOpen)
this.content.style.display="none";this.content.style.overflow=this.overflow;this.content.style.height=this.toHeight+"px";if(this.onComplete)
this.onComplete();return;}
var ht=this.transition(elapsedTime,this.fromHeight,this.distance,this.duration);this.content.style.height=((ht<0)?0:ht)+"px";var self=this;this.timer=setTimeout(function(){self.stepAnimation();},this.interval);};Spry.Widget.CollapsiblePanelGroup=function(element,opts)
{this.element=this.getElement(element);this.opts=opts;this.attachBehaviors();};Spry.Widget.CollapsiblePanelGroup.prototype.setOptions=Spry.Widget.CollapsiblePanel.prototype.setOptions;Spry.Widget.CollapsiblePanelGroup.prototype.getElement=Spry.Widget.CollapsiblePanel.prototype.getElement;Spry.Widget.CollapsiblePanelGroup.prototype.getElementChildren=Spry.Widget.CollapsiblePanel.prototype.getElementChildren;Spry.Widget.CollapsiblePanelGroup.prototype.setElementWidget=function(element,widget)
{if(!element||!widget)
return;if(!element.spry)
element.spry=new Object;element.spry.collapsiblePanel=widget;};Spry.Widget.CollapsiblePanelGroup.prototype.getElementWidget=function(element)
{return(element&&element.spry&&element.spry.collapsiblePanel)?element.spry.collapsiblePanel:null;};Spry.Widget.CollapsiblePanelGroup.prototype.getPanels=function()
{if(!this.element)
return[];return this.getElementChildren(this.element);};Spry.Widget.CollapsiblePanelGroup.prototype.getPanel=function(panelIndex)
{return this.getPanels()[panelIndex];};Spry.Widget.CollapsiblePanelGroup.prototype.attachBehaviors=function()
{if(!this.element)
return;var cpanels=this.getPanels();var numCPanels=cpanels.length;for(var i=0;i<numCPanels;i++)
{var cpanel=cpanels[i];this.setElementWidget(cpanel,new Spry.Widget.CollapsiblePanel(cpanel,this.opts));}};Spry.Widget.CollapsiblePanelGroup.prototype.openPanel=function(panelIndex)
{var w=this.getElementWidget(this.getPanel(panelIndex));if(w&&!w.isOpen())
w.open();};Spry.Widget.CollapsiblePanelGroup.prototype.closePanel=function(panelIndex)
{var w=this.getElementWidget(this.getPanel(panelIndex));if(w&&w.isOpen())
w.close();};Spry.Widget.CollapsiblePanelGroup.prototype.openAllPanels=function()
{var cpanels=this.getPanels();var numCPanels=cpanels.length;for(var i=0;i<numCPanels;i++)
{var w=this.getElementWidget(cpanels[i]);if(w&&!w.isOpen())
w.open();}};Spry.Widget.CollapsiblePanelGroup.prototype.closeAllPanels=function()
{var cpanels=this.getPanels();var numCPanels=cpanels.length;for(var i=0;i<numCPanels;i++)
{var w=this.getElementWidget(cpanels[i]);if(w&&w.isOpen())
w.close();}};