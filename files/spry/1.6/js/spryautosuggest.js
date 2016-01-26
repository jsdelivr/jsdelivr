// SpryAutoSuggest.js - version 0.7 - Spry Pre-Release 1.6
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
{var b=navigator.appName.toString();var up=navigator.platform.toString();var ua=navigator.userAgent.toString();this.mozilla=this.ie=this.opera=r=false;var re_opera=/Opera.([0-9\.]*)/i;var re_msie=/MSIE.([0-9\.]*)/i;var re_gecko=/gecko/i;var re_safari=/safari\/([\d\.]*)/i;if(ua.match(re_opera)){r=ua.match(re_opera);this.opera=true;this.version=parseFloat(r[1]);}else if(ua.match(re_msie)){r=ua.match(re_msie);this.ie=true;this.version=parseFloat(r[1]);}else if(ua.match(re_safari)){this.safari=true;this.version=1.4;}else if(ua.match(re_gecko)){var re_gecko_version=/rv:\s*([0-9\.]+)/i;r=ua.match(re_gecko_version);this.mozilla=true;this.version=parseFloat(r[1]);}
this.windows=this.mac=this.linux=false;this.Platform=ua.match(/windows/i)?"windows":(ua.match(/linux/i)?"linux":(ua.match(/mac/i)?"mac":ua.match(/unix/i)?"unix":"unknown"));this[this.Platform]=true;this.v=this.version;if(this.safari&&this.mac&&this.mozilla){this.mozilla=false;}};Spry.is=new Spry.Widget.BrowserSniff();Spry.Widget.AutoSuggest=function(region,sRegion,dataset,field,options)
{if(!this.isBrowserSupported())
return;options=options||{};this.init(region,sRegion,dataset,field);Spry.Widget.Utils.setOptions(this,options);if(Spry.Widget.AutoSuggest.onloadDidFire)
this.attachBehaviors();else
Spry.Widget.AutoSuggest.loadQueue.push(this);this.dataset.addObserver(this);var regionID=Spry.Widget.Utils.getElementID(sRegion);var self=this;this._notifyDataset={onPostUpdate:function(){self.attachClickBehaviors();},onPreUpdate:function(){self.removeClickBehaviours();}};Spry.Data.Region.addObserver(regionID,this._notifyDataset);Spry.Widget.Utils.addEventListener(window,'unload',function(){self.destroy()},false);this.attachClickBehaviors();this.handleKeyUp(null);this.showSuggestions(false);};Spry.Widget.AutoSuggest.prototype.init=function(region,sRegion,dataset,field)
{this.region=Spry.Widget.Utils.getElement(region);if(!this.region)
return;this.minCharsType=false;this.containsString=false;this.loadFromServer=false;this.urlParam='';this.suggestionIsVisible=false;this.stopFocus=false;this.hasFocus=false;this.showSuggestClass='showSuggestClass';this.hideSuggestClass='hideSuggestClass';this.hoverSuggestClass='hoverSuggestClass';this.movePrevKeyCode=Spry.Widget.AutoSuggest.KEY_UP;this.moveNextKeyCode=Spry.Widget.AutoSuggest.KEY_DOWN;this.textElement=Spry.Widget.Utils.getFirstChildWithNodeNameAtAnyLevel(this.region,"INPUT");this.textElement.setAttribute('AutoComplete','off');this.suggestRegion=Spry.Widget.Utils.getElement(sRegion);Spry.Widget.Utils.makePositioned(this.suggestRegion);Spry.Widget.Utils.addClassName(this.suggestRegion,this.hideSuggestClass);this.timerID=null;if(typeof dataset=="string"){this.dataset=window[dataset];}else{this.dataset=dataset;}
this.field=field;if(typeof field=='string'&&field.indexOf(',')!=-1)
{field=field.replace(/\s*,\s*/ig,',');this.field=field.split(',');}};Spry.Widget.AutoSuggest.prototype.isBrowserSupported=function()
{return Spry.is.ie&&Spry.is.v>=5&&Spry.is.windows||Spry.is.mozilla&&Spry.is.v>=1.4||Spry.is.safari||Spry.is.opera&&Spry.is.v>=9;};Spry.Widget.AutoSuggest.prototype.getValue=function()
{if(!this.textElement)
return'';return this.textElement.value;};Spry.Widget.AutoSuggest.prototype.setValue=function(str)
{if(!this.textElement)
return;this.textElement.value=str;this.showSuggestions(false);};Spry.Widget.AutoSuggest.prototype.focus=function()
{if(!this.textElement)
return;this.textElement.focus();};Spry.Widget.AutoSuggest.prototype.showSuggestions=function(doShow)
{if(this.region&&this.isVisibleSuggestion()!=doShow)
{if(doShow&&this.hasFocus)
{Spry.Widget.Utils.addClassName(this.region,this.showSuggestClass);if(Spry.is.ie&&Spry.is.version<7)
this.createIframeLayer(this.suggestRegion);}
else
{if(Spry.is.ie&&Spry.is.version<7)
this.removeIframeLayer();Spry.Widget.Utils.removeClassName(this.region,this.showSuggestClass);}}
this.suggestionIsVisible=Spry.Widget.Utils.hasClassName(this.region,this.showSuggestClass);};Spry.Widget.AutoSuggest.prototype.isVisibleSuggestion=function()
{return this.suggestionIsVisible;};Spry.Widget.AutoSuggest.prototype.onDataChanged=function(el)
{var data=el.getData(true);var val=this.getValue();this.showSuggestions(data&&(!this.minCharsType||val.length>=this.minCharsType)&&(data.length>1||(data.length==1&&this.childs[0]&&this.childs[0].attributes.getNamedItem("spry:suggest").value!=this.getValue())));};Spry.Widget.AutoSuggest.prototype.nodeMouseOver=function(e,node)
{var l=this.childs.length;for(var i=0;i<l;i++)
if(this.childs[i]!=node&&Spry.Widget.Utils.hasClassName(this.childs[i],this.hoverSuggestClass))
{Spry.Widget.Utils.removeClassName(this.childs[i],this.hoverSuggestClass);break;}};Spry.Widget.AutoSuggest.prototype.nodeClick=function(e,value)
{if(value)
this.setValue(value);};Spry.Widget.AutoSuggest.prototype.handleKeyUp=function(e)
{if(this.timerID)
{clearTimeout(this.timerID);this.timerID=null;}
if(e&&this.isSpecialKey(e))
{this.handleSpecialKeys(e);return;}
var self=this;var func=function(){self.timerID=null;self.loadDataSet();};if(!this.loadFromServer)
func=function(){self.timerID=null;self.filterDataSet();};this.timerID=setTimeout(func,200);};Spry.Widget.AutoSuggest.prototype.scrollVisible=function(el)
{if(typeof this.scrolParent=='undefined')
{var currEl=el;this.scrolParent=false;while(!this.scrolParent)
{var overflow=Spry.Widget.Utils.getStyleProp(currEl,'overflow');if(!overflow||overflow.toLowerCase()=='scroll')
{this.scrolParent=currEl;break;}
if(currEl==this.region)
break;currEl=currEl.parentNode;}}
if(this.scrolParent!=false)
{var h=parseInt(Spry.Widget.Utils.getStyleProp(this.scrolParent,'height'),10);if(el.offsetTop<this.scrolParent.scrollTop)
this.scrolParent.scrollTop=el.offsetTop;else if(el.offsetTop+el.offsetHeight>this.scrolParent.scrollTop+h)
{this.scrolParent.scrollTop=el.offsetTop+el.offsetHeight-h+5;if(this.scrolParent.scrollTop<0)
this.scrolParent.scrollTop=0;}}};Spry.Widget.AutoSuggest.KEY_UP=38;Spry.Widget.AutoSuggest.KEY_DOWN=40;Spry.Widget.AutoSuggest.prototype.handleSpecialKeys=function(e){switch(e.keyCode)
{case this.moveNextKeyCode:case this.movePrevKeyCode:if(!(this.childs.length>0)||!this.getValue())
return;var prev=this.childs.length-1;var next=false;var found=false;var data=this.dataset.getData();if(this.childs.length>1||(data&&data.length==1&&this.childs[0]&&this.childs[0].attributes.getNamedItem('spry:suggest').value!=this.getValue()))
{this.showSuggestions(true);}
else
return;var utils=Spry.Widget.Utils;for(var k=0;k<this.childs.length;k++)
{if(next)
{utils.addClassName(this.childs[k],this.hoverSuggestClass);this.scrollVisible(this.childs[k]);break;}
if(utils.hasClassName(this.childs[k],this.hoverSuggestClass))
{utils.removeClassName(this.childs[k],this.hoverSuggestClass);found=true;if(e.keyCode==this.moveNextKeyCode)
{next=true;continue;}
else
{utils.addClassName(this.childs[prev],this.hoverSuggestClass);this.scrollVisible(this.childs[prev]);break;}}
prev=k;}
if(!found||(next&&k==this.childs.length))
{utils.addClassName(this.childs[0],this.hoverSuggestClass);this.scrollVisible(this.childs[0]);}
utils.stopEvent(e);break;case 27:this.showSuggestions(false);break;case 13:if(!this.isVisibleSuggestion())
return;for(var k=0;k<this.childs.length;k++)
if(Spry.Widget.Utils.hasClassName(this.childs[k],this.hoverSuggestClass))
{var attr=this.childs[k].attributes.getNamedItem('spry:suggest');if(attr){this.setValue(attr.value);this.handleKeyUp(null);}
Spry.Widget.Utils.stopEvent(e);return false;}
break;case 9:this.showSuggestions(false);}
return;};Spry.Widget.AutoSuggest.prototype.filterDataSet=function()
{var contains=this.containsString;var columnName=this.field;var val=this.getValue();if(this.previousString&&this.previousString==val)
return;this.previousString=val;if(!val||(this.minCharsType&&this.minCharsType>val.length))
{this.dataset.filter(function(ds,row,rowNumber){return null;});this.showSuggestions(false);return;}
var regExpStr=Spry.Widget.Utils.escapeRegExp(val);if(!contains)
regExpStr="^"+regExpStr;var regExp=new RegExp(regExpStr,"ig");if(this.maxListItems>0)
this.dataset.maxItems=this.maxListItems;var filterFunc=function(ds,row,rowNumber)
{if(ds.maxItems>0&&ds.maxItems<=ds.data.length)
return null;if(typeof columnName=='object')
{var l=columnName.length;for(var i=0;i<l;i++)
{var str=row[columnName[i]];if(str&&str.search(regExp)!=-1)
return row;}}
else
{var str=row[columnName];if(str&&str.search(regExp)!=-1)
return row;}
return null;};this.dataset.filter(filterFunc);var data=this.dataset.getData();this.showSuggestions(data&&(!this.minCharsType||val.length>=this.minCharsType)&&(data.length>1||(data.length==1&&this.childs[0]&&this.childs[0].attributes.getNamedItem('spry:suggest').value!=val)));};Spry.Widget.AutoSuggest.prototype.loadDataSet=function()
{var val=this.getValue();var ds=this.dataset;ds.cancelLoadData();ds.useCache=false;if(!val||(this.minCharsType&&this.minCharsType>val.length))
{this.showSuggestions(false);return;}
if(this.previousString&&this.previousString==val)
{var data=ds.getData();this.showSuggestions(data&&(data.length>1||(data.length==1&&this.childs[0].attributes.getNamedItem("spry:suggest").value!=val)));return;}
this.previousString=val;var url=Spry.Widget.Utils.addReplaceParam(ds.url,this.urlParam,val);ds.setURL(url);ds.loadData();};Spry.Widget.AutoSuggest.prototype.addMouseListener=function(node,value)
{var self=this;var addListener=Spry.Widget.Utils.addEventListener;addListener(node,"click",function(e){return self.nodeClick(e,value);self.handleKeyUp(null);},false);addListener(node,"mouseover",function(e){Spry.Widget.Utils.addClassName(node,self.hoverSuggestClass);self.nodeMouseOver(e,node)},false);addListener(node,"mouseout",function(e){Spry.Widget.Utils.removeClassName(node,self.hoverSuggestClass);self.nodeMouseOver(e,node)},false);};Spry.Widget.AutoSuggest.prototype.removeMouseListener=function(node,value)
{var self=this;var removeListener=Spry.Widget.Utils.removeEventListener;removeListener(node,"click",function(e){self.nodeClick(e,value);self.handleKeyUp(null);},false);removeListener(node,"mouseover",function(e){Spry.Widget.Utils.addClassName(node,self.hoverSuggestClass);self.nodeMouseOver(e,node)},false);removeListener(node,"mouseout",function(e){Spry.Widget.Utils.removeClassName(node,self.hoverSuggestClass);self.nodeMouseOver(e,node)},false);};Spry.Widget.AutoSuggest.prototype.attachClickBehaviors=function()
{var self=this;var valNodes=Spry.Utils.getNodesByFunc(this.region,function(node)
{if(node.nodeType==1)
{var attr=node.attributes.getNamedItem("spry:suggest");if(attr){self.addMouseListener(node,attr.value);return true;}}
return false;});this.childs=valNodes;};Spry.Widget.AutoSuggest.prototype.removeClickBehaviours=function()
{var self=this;var valNodes=Spry.Utils.getNodesByFunc(this.region,function(node)
{if(node.nodeType==1)
{var attr=node.attributes.getNamedItem("spry:suggest");if(attr){self.removeMouseListener(node,attr.value);return true;}}
return false;});};Spry.Widget.AutoSuggest.prototype.destroy=function(){this.removeClickBehaviours();Spry.Data.Region.removeObserver(Spry.Widget.Utils.getElementID(this.suggestRegion),this._notifyDataset);if(this.event_handlers)
for(var i=0;i<this.event_handlers.length;i++){Spry.Widget.Utils.removeEventListener(this.event_handlers[i][0],this.event_handlers[i][1],this.event_handlers[i][2],false);}
for(var k in this)
{if(typeof this[k]!='function'){try{delete this[k];}catch(err){}}}};Spry.Widget.AutoSuggest.onloadDidFire=false;Spry.Widget.AutoSuggest.loadQueue=[];Spry.Widget.AutoSuggest.processLoadQueue=function(handler)
{Spry.Widget.AutoSuggest.onloadDidFire=true;var q=Spry.Widget.AutoSuggest.loadQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
q[i].attachBehaviors();};Spry.Widget.AutoSuggest.addLoadListener=function(handler)
{if(typeof window.addEventListener!='undefined')
window.addEventListener('load',handler,false);else if(typeof document.addEventListener!='undefined')
document.addEventListener('load',handler,false);else if(typeof window.attachEvent!='undefined')
window.attachEvent('onload',handler);};Spry.Widget.AutoSuggest.addLoadListener(Spry.Widget.AutoSuggest.processLoadQueue);Spry.Widget.AutoSuggest.prototype.attachBehaviors=function()
{this.event_handlers=[];var self=this;var _notifyKeyUp=function(e){self.handleKeyUp(e)};this.event_handlers.push([this.textElement,"keydown",_notifyKeyUp]);this.event_handlers.push([this.textElement,"focus",function(e){if(self.stopFocus){self.handleKeyUp(e);}self.hasFocus=true;self.stopFocus=false;}]);this.event_handlers.push([this.textElement,"drop",_notifyKeyUp]);this.event_handlers.push([this.textElement,"dragdrop",_notifyKeyUp]);var _notifyBlur=false;if(Spry.is.opera){_notifyBlur=function(e){setTimeout(function(){if(!self.clickInList){self.showSuggestions(false);}else{self.stopFocus=true;self.textElement.focus();}self.clickInList=false;self.hasFocus=false;},100);};}else{_notifyBlur=function(e){if(!self.clickInList){self.showSuggestions(false);}else{self.stopFocus=true;self.textElement.focus();}self.clickInList=false;self.hasFocus=false;};}
this.event_handlers.push([this.textElement,"blur",_notifyBlur]);this.event_handlers.push([this.suggestRegion,"mousedown",function(e){self.clickInList=true;}]);for(var i=0;i<this.event_handlers.length;i++)
Spry.Widget.Utils.addEventListener(this.event_handlers[i][0],this.event_handlers[i][1],this.event_handlers[i][2],false);};Spry.Widget.AutoSuggest.prototype.createIframeLayer=function(element)
{if(typeof this.iframeLayer=='undefined')
{var layer=document.createElement('iframe');layer.tabIndex='-1';layer.src='javascript:"";';layer.scrolling='no';layer.frameBorder='0';layer.className='iframeSuggest';element.parentNode.appendChild(layer);this.iframeLayer=layer;}
this.iframeLayer.style.left=element.offsetLeft+'px';this.iframeLayer.style.top=element.offsetTop+'px';this.iframeLayer.style.width=element.offsetWidth+'px';this.iframeLayer.style.height=element.offsetHeight+'px';this.iframeLayer.style.display='block';};Spry.Widget.AutoSuggest.prototype.removeIframeLayer=function()
{if(this.iframeLayer)
this.iframeLayer.style.display='none';};if(!Spry.Widget.Utils)Spry.Widget.Utils={};Spry.Widget.Utils.specialSafariNavKeys=",63232,63233,63234,63235,63272,63273,63275,63276,63277,63289,";Spry.Widget.Utils.specialCharacters=",9,13,27,38,40,";Spry.Widget.Utils.specialCharacters+=Spry.Widget.Utils.specialSafariNavKeys;Spry.Widget.AutoSuggest.prototype.isSpecialKey=function(ev)
{return Spry.Widget.Utils.specialCharacters.indexOf(","+ev.keyCode+",")!=-1||this.moveNextKeyCode==ev.keyCode||this.movePrevKeyCode==ev.keyCode;};Spry.Widget.Utils.getElementID=function(el)
{if(typeof el=='string'&&el)
return el;return el.getAttribute('id');};Spry.Widget.Utils.getElement=function(ele)
{if(ele&&typeof ele=="string")
return document.getElementById(ele);return ele;};Spry.Widget.Utils.addReplaceParam=function(url,param,paramValue)
{var uri='';var qstring='';var i=url.indexOf('?');if(i!=-1)
{uri=url.slice(0,i);qstring=url.slice(i+1);}
else
uri=url;qstring=qstring.replace('?','');var arg=qstring.split("&");if(param.lastIndexOf('/')!=-1)
param=param.slice(param.lastIndexOf('/')+1);for(i=0;i<arg.length;i++)
{var k=arg[i].split('=');if((k[0]&&k[0]==decodeURI(param))||arg[i]==decodeURI(param))
arg[i]=null;}
arg[arg.length]=encodeURI(param)+'='+encodeURI(paramValue);qstring='';for(i=0;i<arg.length;i++)
if(arg[i])
qstring+='&'+arg[i];qstring=qstring.slice(1);url=uri+'?'+qstring;return url;};Spry.Widget.Utils.addClassName=function(ele,clssName)
{if(!ele)return;if(!ele.className)ele.className='';if(!ele||ele.className.search(new RegExp("\\b"+clssName+"\\b"))!=-1)
return;ele.className+=' '+clssName;};Spry.Widget.Utils.removeClassName=function(ele,className)
{if(!ele)return;if(!ele.className)
{ele.className='';return;}
ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),'');};Spry.Widget.Utils.hasClassName=function(ele,className)
{if(!ele||!className)
return false;if(!ele.className)
ele.className='';return ele.className.search(new RegExp("\\s*\\b"+className+"\\b"))!=-1;};Spry.Widget.Utils.addEventListener=function(el,eventType,handler,capture)
{try
{if(el.addEventListener)
el.addEventListener(eventType,handler,capture);else if(el.attachEvent)
el.attachEvent("on"+eventType,handler,capture);}catch(e){}};Spry.Widget.Utils.removeEventListener=function(el,eventType,handler,capture)
{try
{if(el.removeEventListener)
el.removeEventListener(eventType,handler,capture);else if(el.detachEvent)
el.detachEvent("on"+eventType,handler,capture);}catch(e){}};Spry.Widget.Utils.stopEvent=function(ev)
{ev.cancelBubble=true;ev.returnValue=false;try
{this.stopPropagation(ev);}catch(e){}
try{this.preventDefault(ev);}catch(e){}};Spry.Widget.Utils.stopPropagation=function(ev)
{if(ev.stopPropagation)
ev.stopPropagation();else
ev.cancelBubble=true;};Spry.Widget.Utils.preventDefault=function(ev)
{if(ev.preventDefault)
ev.preventDefault();else
ev.returnValue=false;};Spry.Widget.Utils.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(typeof ignoreUndefinedProps!='undefined'&&ignoreUndefinedProps&&typeof optionsObj[optionName]=='undefined')
continue;obj[optionName]=optionsObj[optionName];}};Spry.Widget.Utils.firstValid=function()
{var ret=null;for(var i=0;i<Spry.Widget.Utils.firstValid.arguments.length;i++)
if(typeof Spry.Widget.Utils.firstValid.arguments[i]!='undefined')
{ret=Spry.Widget.Utils.firstValid.arguments[i];break;}
return ret;};Spry.Widget.Utils.camelize=function(stringToCamelize)
{var oStringList=stringToCamelize.split('-');var isFirstEntry=true;var camelizedString='';for(var i=0;i<oStringList.length;i++)
{if(oStringList[i].length>0)
{if(isFirstEntry)
{camelizedString=oStringList[i];isFirstEntry=false;}
else
{var s=oStringList[i];camelizedString+=s.charAt(0).toUpperCase()+s.substring(1);}}}
return camelizedString;};Spry.Widget.Utils.getStyleProp=function(element,prop)
{var value;var camel=Spry.Widget.Utils.camelize(prop);try
{value=element.style[camel];if(!value)
{if(document.defaultView&&document.defaultView.getComputedStyle)
{var css=document.defaultView.getComputedStyle(element,null);value=css?css.getPropertyValue(prop):null;}
else
if(element.currentStyle)
value=element.currentStyle[camel];}}
catch(e){}
return value=='auto'?null:value;};Spry.Widget.Utils.makePositioned=function(element)
{var pos=Spry.Widget.Utils.getStyleProp(element,'position');if(!pos||pos=='static')
{element.style.position='relative';if(window.opera)
{element.style.top=0;element.style.left=0;}}};Spry.Widget.Utils.escapeRegExp=function(rexp)
{return rexp.replace(/([\.\/\]\[\{\}\(\)\\\$\^\?\*\|\!\=\+\-])/g,'\\$1');};Spry.Widget.Utils.getFirstChildWithNodeNameAtAnyLevel=function(node,nodeName)
{var elements=node.getElementsByTagName(nodeName);if(elements)
return elements[0];return null;};