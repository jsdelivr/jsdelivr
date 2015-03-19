// SpryHTMLPanel.js - version 0.4 - Spry Pre-Release 1.6
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

var Spry;if(!Spry)Spry={};if(!Spry.Widget)Spry.Widget={};Spry.Widget.HTMLPanel=function(ele,opts)
{Spry.Widget.HTMLPanel.Notifier.call(this);this.element=Spry.Widget.HTMLPanel.$(ele);this.evalScripts=Spry.Widget.HTMLPanel.evalScripts;this.loadingContentClass="HTMLPanelLoadingContent";this.errorContentClass="HTMLPanelErrorContent";this.loadingStateContent="";this.errorStateContent="";this.loadingStateClass="HTMLPanelLoading";this.errorStateClass="HTMLPanelError";this.pendingRequest=null;Spry.Widget.HTMLPanel.setOptions(this,opts);var elements=this.element.getElementsByTagName("*");var numElements=elements.length;var errorEle=null;var loadingEle=null;var d=document.createElement("div");for(var i=0;i<numElements&&(!loadingEle||!errorEle);i++)
{var e=elements[i];if(Spry.Widget.HTMLPanel.hasClassName(e,this.loadingContentClass))
loadingEle=e;if(Spry.Widget.HTMLPanel.hasClassName(e,this.errorContentClass))
errorEle=e;}
if(loadingEle)
this.loadingStateContent=Spry.Widget.HTMLPanel.removeAndExtractContent(loadingEle,this.loadingContentClass);if(errorEle)
this.errorStateContent=Spry.Widget.HTMLPanel.removeAndExtractContent(errorEle,this.errorContentClass);};Spry.Widget.HTMLPanel.evalScripts=false;Spry.Widget.HTMLPanel.Notifier=function()
{this.observers=[];this.suppressNotifications=0;};Spry.Widget.HTMLPanel.Notifier.prototype.addObserver=function(observer)
{if(!observer)
return;var len=this.observers.length;for(var i=0;i<len;i++)
{if(this.observers[i]==observer)
return;}
this.observers[len]=observer;};Spry.Widget.HTMLPanel.Notifier.prototype.removeObserver=function(observer)
{if(!observer)
return;for(var i=0;i<this.observers.length;i++)
{if(this.observers[i]==observer)
{this.observers.splice(i,1);break;}}};Spry.Widget.HTMLPanel.Notifier.prototype.notifyObservers=function(methodName,data)
{if(!methodName)
return;if(!this.suppressNotifications)
{var len=this.observers.length;for(var i=0;i<len;i++)
{var obs=this.observers[i];if(obs)
{if(typeof obs=="function")
obs(methodName,this,data);else if(obs[methodName])
obs[methodName](this,data);}}}};Spry.Widget.HTMLPanel.Notifier.prototype.enableNotifications=function()
{if(--this.suppressNotifications<0)
{this.suppressNotifications=0;Spry.Debug.reportError("Unbalanced enableNotifications() call!\n");}};Spry.Widget.HTMLPanel.Notifier.prototype.disableNotifications=function()
{++this.suppressNotifications;};Spry.Widget.HTMLPanel.prototype=new Spry.Widget.HTMLPanel.Notifier();Spry.Widget.HTMLPanel.prototype.constructor=Spry.Widget.HTMLPanel;Spry.Widget.HTMLPanel.$=function(ele)
{if(ele&&typeof ele=="string")
return document.getElementById(ele);return ele;};Spry.Widget.HTMLPanel.setOptions=function(dstObj,srcObj,ignoreUndefinedProps)
{if(srcObj)
{for(var optionName in srcObj)
{if(ignoreUndefinedProps&&srcObj[optionName]==undefined)
continue;dstObj[optionName]=srcObj[optionName];}}};Spry.Widget.HTMLPanel.addClassName=function(ele,className)
{ele=Spry.Widget.HTMLPanel.$(ele);if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))!=-1))
return;ele.className+=(ele.className?" ":"")+className;};Spry.Widget.HTMLPanel.removeClassName=function(ele,className)
{ele=Spry.Widget.HTMLPanel.$(ele);if(Spry.Widget.HTMLPanel.hasClassName(ele,className))
ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Spry.Widget.HTMLPanel.hasClassName=function(ele,className)
{ele=Spry.Widget.HTMLPanel.$(ele);if(!ele||!className||!ele.className||ele.className.search(new RegExp("\\b"+className+"\\b"))==-1)
return false;return true;};Spry.Widget.HTMLPanel.removeAndExtractContent=function(ele,className)
{var d=document.createElement("div");if(ele)
{d.appendChild(ele);if(className)
Spry.Widget.HTMLPanel.removeClassName(ele,className);}
return d.innerHTML;};Spry.Widget.HTMLPanel.findNodeById=function(id,node)
{if(node&&node.nodeType==1)
{if(node.id==id)
return node;var child=node.firstChild;while(child)
{var result=Spry.Widget.HTMLPanel.findNodeById(id,child);if(result)
return result;child=child.nextSibling;}}
return null;};Spry.Widget.HTMLPanel.disableSrcReferences=function(source)
{if(source)
source=source.replace(/<(img|script|link|frame|iframe|input)([^>]+)>/gi,function(a,b,c){return'<'+b+c.replace(/\b(src|href)\s*=/gi,function(a,b){return'spry_'+b+'=';})+'>';});return source;};Spry.Widget.HTMLPanel.enableSrcReferences=function(source)
{source=source.replace(/<(img|script|link|frame|iframe|input)([^>]+)>/gi,function(a,b,c){return'<'+b+c.replace(/\bspry_(src|href)\s*=/gi,function(a,b){return b+'=';})+'>';});return source;};Spry.Widget.HTMLPanel.getFragByID=function(id,contentStr)
{var frag=Spry.Widget.HTMLPanel.disableSrcReferences(contentStr);var div=document.createElement("div");div.innerHTML=frag;frag="";var node=Spry.Widget.HTMLPanel.findNodeById(id,div);if(node)
frag=node.innerHTML;return Spry.Widget.HTMLPanel.enableSrcReferences(frag);};Spry.Widget.HTMLPanel.prototype.setContent=function(contentStr,id)
{var data={content:contentStr,id:id};this.notifyObservers("onPreUpdate",data);contentStr=data.content;id=data.id;if(typeof id!="undefined")
contentStr=Spry.Widget.HTMLPanel.getFragByID(id,contentStr);Spry.Widget.HTMLPanel.setInnerHTML(this.element,contentStr,!this.evalScripts);this.removeStateClasses();this.notifyObservers("onPostUpdate",data);};Spry.Widget.HTMLPanel.prototype.loadContent=function(url,opts)
{if(!this.element)
return;this.cancelLoad();if(!opts)
opts=new Object;opts.url=opts.url?opts.url:url;opts.method=opts.method?opts.method:"GET";opts.async=opts.async?opts.async:true;opts.id=opts.id?opts.id:undefined;var self=this;opts.errorCallback=function(req){self.onLoadError(req);};this.notifyObservers("onPreLoad",opts);if(this.loadingStateContent)
this.setContent(this.loadingStateContent);Spry.Widget.HTMLPanel.addClassName(this.element,this.loadingStateClass);this.pendingRequest=Spry.Widget.HTMLPanel.loadURL(opts.method,opts.url,opts.async,function(req){self.onLoadSuccessful(req);},opts);};Spry.Widget.HTMLPanel.prototype.cancelLoad=function()
{try
{if(this.pendingRequest&&this.pendingRequest.xhRequest)
{var xhr=this.pendingRequest.xhRequest;if(xhr.abort)
xhr.abort();xhr.onreadystatechange=null;this.notifyObservers("onLoadCancelled",this.pendingRequest);}}
catch(e){}
this.pendingRequest=null;};Spry.Widget.HTMLPanel.prototype.removeStateClasses=function()
{Spry.Widget.HTMLPanel.removeClassName(this.element,this.loadingStateClass);Spry.Widget.HTMLPanel.removeClassName(this.element,this.errorStateClass);};Spry.Widget.HTMLPanel.prototype.onLoadSuccessful=function(req)
{this.notifyObservers("onPostLoad",req);this.setContent(req.xhRequest.responseText,req.id);this.pendingRequest=null;};Spry.Widget.HTMLPanel.prototype.onLoadError=function(req)
{this.notifyObservers("onLoadError",req);if(this.errorStateContent)
this.setContent(this.errorStateContent);Spry.Widget.HTMLPanel.addClassName(this.element,this.errorStateClass);this.pendingRequest=null;};Spry.Widget.HTMLPanel.msProgIDs=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0"];Spry.Widget.HTMLPanel.createXMLHttpRequest=function()
{var req=null;if(window.ActiveXObject)
{while(!req&&Spry.Widget.HTMLPanel.msProgIDs.length)
{try{req=new ActiveXObject(Spry.Widget.HTMLPanel.msProgIDs[0]);}catch(e){req=null;}
if(!req)
Spry.Widget.HTMLPanel.msProgIDs.splice(0,1);}}
if(!req&&window.XMLHttpRequest){try{req=new XMLHttpRequest();}catch(e){req=null;}}
return req;};Spry.Widget.HTMLPanel.loadURL=function(method,url,async,callback,opts)
{var req=new Object;req.method=method;req.url=url;req.async=async;req.successCallback=callback;Spry.Widget.HTMLPanel.setOptions(req,opts);try
{req.xhRequest=Spry.Widget.HTMLPanel.createXMLHttpRequest();if(!req.xhRequest)
return null;if(req.async)
req.xhRequest.onreadystatechange=function(){Spry.Widget.HTMLPanel.loadURL.callback(req);};req.xhRequest.open(method,req.url,req.async,req.username,req.password);if(req.headers)
{for(var name in req.headers)
req.xhRequest.setRequestHeader(name,req.headers[name]);}
req.xhRequest.send(req.postData);if(!req.async)
Spry.Widget.HTMLPanel.loadURL.callback(req);}
catch(e){if(req.errorCallback)req.errorCallback(req);req=null;}
return req;};Spry.Widget.HTMLPanel.loadURL.callback=function(req)
{if(!req||req.xhRequest.readyState!=4)
return;if(req.successCallback&&(req.xhRequest.status==200||req.xhRequest.status==0))
req.successCallback(req);else if(req.errorCallback)
req.errorCallback(req);};Spry.Widget.HTMLPanel.eval=function(str){return eval(str);};Spry.Widget.HTMLPanel.setInnerHTML=function(ele,str,preventScripts)
{if(!ele)
return;if(!str)str="";ele=Spry.Widget.HTMLPanel.$(ele);var scriptExpr="<script[^>]*>(.|\s|\n|\r)*?</script>";ele.innerHTML=str.replace(new RegExp(scriptExpr,"img"),"");if(preventScripts)
return;var matches=str.match(new RegExp(scriptExpr,"img"));if(matches)
{var numMatches=matches.length;for(var i=0;i<numMatches;i++)
{var s=matches[i].replace(/<script[^>]*>[\s\r\n]*(<\!--)?|(-->)?[\s\r\n]*<\/script>/img,"");Spry.Widget.HTMLPanel.eval(s);}}};