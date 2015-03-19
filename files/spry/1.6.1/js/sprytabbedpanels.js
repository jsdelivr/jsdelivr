// SpryTabbedPanels.js - version 0.6 - Spry Pre-Release 1.6.1
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

var Spry;if(!Spry)Spry={};if(!Spry.Widget)Spry.Widget={};Spry.Widget.TabbedPanels=function(element,opts)
{this.element=this.getElement(element);this.defaultTab=0;this.tabSelectedClass="TabbedPanelsTabSelected";this.tabHoverClass="TabbedPanelsTabHover";this.tabFocusedClass="TabbedPanelsTabFocused";this.panelVisibleClass="TabbedPanelsContentVisible";this.focusElement=null;this.hasFocus=false;this.currentTabIndex=0;this.enableKeyboardNavigation=true;this.nextPanelKeyCode=Spry.Widget.TabbedPanels.KEY_RIGHT;this.previousPanelKeyCode=Spry.Widget.TabbedPanels.KEY_LEFT;Spry.Widget.TabbedPanels.setOptions(this,opts);if(typeof(this.defaultTab)=="number")
{if(this.defaultTab<0)
this.defaultTab=0;else
{var count=this.getTabbedPanelCount();if(this.defaultTab>=count)
this.defaultTab=(count>1)?(count-1):0;}
this.defaultTab=this.getTabs()[this.defaultTab];}
if(this.defaultTab)
this.defaultTab=this.getElement(this.defaultTab);this.attachBehaviors();};Spry.Widget.TabbedPanels.prototype.getElement=function(ele)
{if(ele&&typeof ele=="string")
return document.getElementById(ele);return ele;};Spry.Widget.TabbedPanels.prototype.getElementChildren=function(element)
{var children=[];var child=element.firstChild;while(child)
{if(child.nodeType==1)
children.push(child);child=child.nextSibling;}
return children;};Spry.Widget.TabbedPanels.prototype.addClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))!=-1))
return;ele.className+=(ele.className?" ":"")+className;};Spry.Widget.TabbedPanels.prototype.removeClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))==-1))
return;ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Spry.Widget.TabbedPanels.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(ignoreUndefinedProps&&optionsObj[optionName]==undefined)
continue;obj[optionName]=optionsObj[optionName];}};Spry.Widget.TabbedPanels.prototype.getTabGroup=function()
{if(this.element)
{var children=this.getElementChildren(this.element);if(children.length)
return children[0];}
return null;};Spry.Widget.TabbedPanels.prototype.getTabs=function()
{var tabs=[];var tg=this.getTabGroup();if(tg)
tabs=this.getElementChildren(tg);return tabs;};Spry.Widget.TabbedPanels.prototype.getContentPanelGroup=function()
{if(this.element)
{var children=this.getElementChildren(this.element);if(children.length>1)
return children[1];}
return null;};Spry.Widget.TabbedPanels.prototype.getContentPanels=function()
{var panels=[];var pg=this.getContentPanelGroup();if(pg)
panels=this.getElementChildren(pg);return panels;};Spry.Widget.TabbedPanels.prototype.getIndex=function(ele,arr)
{ele=this.getElement(ele);if(ele&&arr&&arr.length)
{for(var i=0;i<arr.length;i++)
{if(ele==arr[i])
return i;}}
return-1;};Spry.Widget.TabbedPanels.prototype.getTabIndex=function(ele)
{var i=this.getIndex(ele,this.getTabs());if(i<0)
i=this.getIndex(ele,this.getContentPanels());return i;};Spry.Widget.TabbedPanels.prototype.getCurrentTabIndex=function()
{return this.currentTabIndex;};Spry.Widget.TabbedPanels.prototype.getTabbedPanelCount=function(ele)
{return Math.min(this.getTabs().length,this.getContentPanels().length);};Spry.Widget.TabbedPanels.addEventListener=function(element,eventType,handler,capture)
{try
{if(element.addEventListener)
element.addEventListener(eventType,handler,capture);else if(element.attachEvent)
element.attachEvent("on"+eventType,handler);}
catch(e){}};Spry.Widget.TabbedPanels.prototype.cancelEvent=function(e)
{if(e.preventDefault)e.preventDefault();else e.returnValue=false;if(e.stopPropagation)e.stopPropagation();else e.cancelBubble=true;return false;};Spry.Widget.TabbedPanels.prototype.onTabClick=function(e,tab)
{this.showPanel(tab);return this.cancelEvent(e);};Spry.Widget.TabbedPanels.prototype.onTabMouseOver=function(e,tab)
{this.addClassName(tab,this.tabHoverClass);return false;};Spry.Widget.TabbedPanels.prototype.onTabMouseOut=function(e,tab)
{this.removeClassName(tab,this.tabHoverClass);return false;};Spry.Widget.TabbedPanels.prototype.onTabFocus=function(e,tab)
{this.hasFocus=true;this.addClassName(tab,this.tabFocusedClass);return false;};Spry.Widget.TabbedPanels.prototype.onTabBlur=function(e,tab)
{this.hasFocus=false;this.removeClassName(tab,this.tabFocusedClass);return false;};Spry.Widget.TabbedPanels.KEY_UP=38;Spry.Widget.TabbedPanels.KEY_DOWN=40;Spry.Widget.TabbedPanels.KEY_LEFT=37;Spry.Widget.TabbedPanels.KEY_RIGHT=39;Spry.Widget.TabbedPanels.prototype.onTabKeyDown=function(e,tab)
{var key=e.keyCode;if(!this.hasFocus||(key!=this.previousPanelKeyCode&&key!=this.nextPanelKeyCode))
return true;var tabs=this.getTabs();for(var i=0;i<tabs.length;i++)
if(tabs[i]==tab)
{var el=false;if(key==this.previousPanelKeyCode&&i>0)
el=tabs[i-1];else if(key==this.nextPanelKeyCode&&i<tabs.length-1)
el=tabs[i+1];if(el)
{this.showPanel(el);el.focus();break;}}
return this.cancelEvent(e);};Spry.Widget.TabbedPanels.prototype.preorderTraversal=function(root,func)
{var stopTraversal=false;if(root)
{stopTraversal=func(root);if(root.hasChildNodes())
{var child=root.firstChild;while(!stopTraversal&&child)
{stopTraversal=this.preorderTraversal(child,func);try{child=child.nextSibling;}catch(e){child=null;}}}}
return stopTraversal;};Spry.Widget.TabbedPanels.prototype.addPanelEventListeners=function(tab,panel)
{var self=this;Spry.Widget.TabbedPanels.addEventListener(tab,"click",function(e){return self.onTabClick(e,tab);},false);Spry.Widget.TabbedPanels.addEventListener(tab,"mouseover",function(e){return self.onTabMouseOver(e,tab);},false);Spry.Widget.TabbedPanels.addEventListener(tab,"mouseout",function(e){return self.onTabMouseOut(e,tab);},false);if(this.enableKeyboardNavigation)
{var tabIndexEle=null;var tabAnchorEle=null;this.preorderTraversal(tab,function(node){if(node.nodeType==1)
{var tabIndexAttr=tab.attributes.getNamedItem("tabindex");if(tabIndexAttr)
{tabIndexEle=node;return true;}
if(!tabAnchorEle&&node.nodeName.toLowerCase()=="a")
tabAnchorEle=node;}
return false;});if(tabIndexEle)
this.focusElement=tabIndexEle;else if(tabAnchorEle)
this.focusElement=tabAnchorEle;if(this.focusElement)
{Spry.Widget.TabbedPanels.addEventListener(this.focusElement,"focus",function(e){return self.onTabFocus(e,tab);},false);Spry.Widget.TabbedPanels.addEventListener(this.focusElement,"blur",function(e){return self.onTabBlur(e,tab);},false);Spry.Widget.TabbedPanels.addEventListener(this.focusElement,"keydown",function(e){return self.onTabKeyDown(e,tab);},false);}}};Spry.Widget.TabbedPanels.prototype.showPanel=function(elementOrIndex)
{var tpIndex=-1;if(typeof elementOrIndex=="number")
tpIndex=elementOrIndex;else
tpIndex=this.getTabIndex(elementOrIndex);if(!tpIndex<0||tpIndex>=this.getTabbedPanelCount())
return;var tabs=this.getTabs();var panels=this.getContentPanels();var numTabbedPanels=Math.max(tabs.length,panels.length);for(var i=0;i<numTabbedPanels;i++)
{if(i!=tpIndex)
{if(tabs[i])
this.removeClassName(tabs[i],this.tabSelectedClass);if(panels[i])
{this.removeClassName(panels[i],this.panelVisibleClass);panels[i].style.display="none";}}}
this.addClassName(tabs[tpIndex],this.tabSelectedClass);this.addClassName(panels[tpIndex],this.panelVisibleClass);panels[tpIndex].style.display="block";this.currentTabIndex=tpIndex;};Spry.Widget.TabbedPanels.prototype.attachBehaviors=function(element)
{var tabs=this.getTabs();var panels=this.getContentPanels();var panelCount=this.getTabbedPanelCount();for(var i=0;i<panelCount;i++)
this.addPanelEventListeners(tabs[i],panels[i]);this.showPanel(this.defaultTab);};