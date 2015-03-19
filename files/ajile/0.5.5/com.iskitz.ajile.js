/*-----------------------------------------------------------------------------+
| Product:  Ajile [com.iskitz.ajile]
| Version:  0.5.5
|+-----------------------------------------------------------------------------+
| Author:   Michael A. I. Lee [ajile@iskitz.com]
|
| Created:  Tuesday,   November   4, 2003    [2003.11.04]
| Modified: Friday,    July      14, 2006    [2006.07.14 - 03:07:26 EDT]
|+-----------------------------------------------------------------------------+
|
| [Ajile] - Advanced JavaScript Import & Load Extension is a JavaScript
|           module that adds namespacing and importing capabilities to the
|           JavaScript Language.
|
|           Visit http://ajile.iskitz.com/ to start creating
|
|                  "Smart scripts that play nice!"
|
|           Copyright (c) 2003-2006 Michael A. I. Lee, iSkitz.com
|
|+-----------------------------------------------------------------------------+
|
| ***** BEGIN LICENSE BLOCK *****
| Version: MPL 1.1/GPL 2.0/LGPL 2.1
|
| The contents of this file are subject to the Mozilla Public License Version
| 1.1 (the "License"); you may not use this file except in compliance with
| the License. You may obtain a copy of the License at
| http://www.mozilla.org/MPL/
|
| Software distributed under the License is distributed on an "AS IS" basis,
| WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
| for the specific language governing rights and limitations under the
| License.
|
| The Original Code is Ajile.
|
| The Initial Developer of the Original Code is Michael A. I. Lee
|
| Portions created by the Initial Developer are Copyright (C) 2003-2006
| the Initial Developer. All Rights Reserved.
|
| Contributor(s): Michael A. I. Lee <ajile@iskitz.com>
|
| Alternatively, the contents of this file may be used under the terms of
| either the GNU General Public License Version 2 or later (the "GPL"), or
| the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
| in which case the provisions of the GPL or the LGPL are applicable instead
| of those above. If you wish to allow use of your version of this file only
| under the terms of either the GPL or the LGPL, and not to allow others to
| use your version of this file under the terms of the MPL, indicate your
| decision by deleting the provisions above and replace them with the notice
| and other provisions required by the GPL or the LGPL. If you do not delete
| the provisions above, a recipient may use your version of this file under
| the terms of any one of the MPL, the GPL or the LGPL.
|
| ***** END LICENSE BLOCK *****
*-----------------------------------------------------------------------------*/
new function(){if(containerFailsRequirements())return;var VERSION="0.5.5";var RE_PARENT_DIR=(/(.*\/)[^\/]+/);var RE_PARENT_NAMESPACE=(/(.*)\.[^\.]+/);var RE_RELATIVE_DIR=(/(\/\.\/)|(\/[^\/]*\/\.\.\/)/);var RE_URL_PROTOCOL=(/:\/\x2f/);var NSINFO=new NamespaceInfo();var QP="\x63\x6f\x6d\x2f\x69\x73\x6b\x69\x74\x7a\x2f\x61\x6a\x69\x6c\x65";var QN="\x63\x6f\x6d\x2e\x69\x73\x6b\x69\x74\x7a\x2e\x61\x6a\x69\x6c\x65";var SHORT="\x41\x6a\x69\x6c\x65";var START="\x69\x6e\x64\x65\x78";var STEALTH=SHORT+"\x2e\x55\x6e\x6c\x6f\x61\x64";var THREAD="\x73\x65\x74\x54\x69\x6d\x65\x6f\x75\x74";var TYPE="\x2e\x6a\x73";var TYPES=[SHORT,"Import","ImportAs","Load","Namespace","NamespaceException","Package","PackageException"];var USE_NAME=true;var USE_PATH=!USE_NAME;var DEBUG=false;var DEBUG_LOG='';var THIS;var LOADER;var containerType=window.navigator.userAgent.toUpperCase();var isMSIE=containerType.indexOf('MSIE')>-1&&containerType.indexOf('BLAZER')==-1&&containerType.indexOf('OPERA')==-1&&containerType.indexOf('PALMSOURCE')==-1;var nsInfoMap={clear:function nsInfoMap_clear(){for(var moduleName in this)delete this[moduleName];}};var pendingImports={length:0,modules:{},add:function pendingImports_add(qualifiedName,shortName){if(this.modules[qualifiedName])return false;this.modules[qualifiedName]=shortName;this.length++;return true;},clear:function pendingImports_clear(){for(var qualifiedName in this.modules)delete this.modules[qualifiedName];this.length=0;},get:function pendingImportsGet(namespace,owner){var script=owner||window;namespace=namespace.split('\x2e');for(var i=0,j=namespace.length;i<j;i++)if(typeof script[namespace[i]]!="undefined")script=script[namespace[i]];else return undefined;return script;},remove:function pendingImports_remove(qualifiedName){if(!this.modules[qualifiedName])return;delete this.modules[qualifiedName];this.length--;}};function cloak(moduleID){moduleID=moduleID||'';var container;for(var id,src,sys,modules=getModules(),i=modules.length;--i>=0;){if(!modules[i]||((id=modules[i].title)&&(id!=moduleID)))continue;src=modules[i].src;sys=(src&&(src.indexOf(QN)>=0||src.indexOf(QP)>=0))||(id&&(id.indexOf(QN)==0||id.indexOf(QP)==0));if(sys||!src||!DEBUG)if((container=modules[i].parentNode)&&container.removeChild)container.removeChild(modules[i]);}}function cloaked(moduleID){if(!(moduleID&&moduleID.constructor==String))return false;cloak(moduleID);return true;}function completeImports(e){var modules=pendingImports.modules;var shortName;for(var qualifiedName in modules){log('ImportAs ("'+modules[qualifiedName]+'", "'+qualifiedName+'")'+"...CHECKING.",arguments);if(!pendingImports.get(qualifiedName))continue;if(modules[qualifiedName]!='*')ImportAs(modules[qualifiedName],qualifiedName,null,null,this);shortName=modules[qualifiedName];pendingImports.remove(qualifiedName);if(shortName=='*')continue;if(qualifiedName.indexOf(QN)==0||!DEBUG)cloak(qualifiedName);}}function containerFailsRequirements(){return(typeof document=="undefined"||typeof document.appendChild=="undefined"||typeof document.createElement=="undefined"||typeof document.getElementsByName=="undefined");}function detectNamespaceInfo(dotPath){dotPath=dotPath||QN;if(dotPath==QN&&NSINFO.path)return NSINFO;var nsInfo=nsInfoMap[dotPath];if(nsInfo)return nsInfo;var dirPath=dotPath.replace(/\x2e/g,"\x2f");var dirPath2='\x2f'+dirPath+'\x2f';dirPath='\x2f'+dirPath+'\x2e';dotPath='\x2f'+dotPath+'\x2e';var usesDots,paths,path;var scripts=getModules();if(!scripts)return new NamespaceInfo();for(var lastHope,i1,i2=0,i=0,j=scripts.length;i<j||lastHope;i++){if(!lastHope)path=scripts[i].src;else{path=scripts[i].parentNode.lastChild;path=(path&&path.nodeName=="SCRIPT")?path.src:undefined;}if(path&&path.search(RE_URL_PROTOCOL)==-1){path=document.location.href;if(path.charAt(path.length-1)!='\x2f')if((paths=RE_PARENT_DIR.exec(path))!=null)if(paths[1].length>path.search(RE_URL_PROTOCOL)+3)path=paths[1];i2=path.length;if(!lastHope)path+=scripts[i].src;else{var node=scripts[i].parentNode.lastChild;if(node&&node.nodeName=="SCRIPT")path+=node.src;}}if(path==undefined||path==null){lastHope=false;continue;}i1=path.indexOf(dotPath,i2)+1;if(!(usesDots=i1>0))i1=path.indexOf(dirPath,i2)+1||path.indexOf(dirPath2,i2)+1;if(RE_RELATIVE_DIR.test(path)){do{path=path.replace(RE_RELATIVE_DIR,'\x2f');}while(RE_RELATIVE_DIR.test(path));i1=path.lastIndexOf(dotPath)+1||path.lastIndexOf(dirPath)+1||path.lastIndexOf(dirPath2)+1;}if(i1>0){if(usesDots)usesDots=i1==(path.lastIndexOf(dotPath)+1);path=path.substring(0,i1);break;}if((lastHope=!lastHope&&(i==j-1)))--i;path=usesDots=undefined;i2=0;}var qualifiedName=dotPath.slice(1,-1);if(qualifiedName==QN&&scripts[i])scripts[i].title=qualifiedName;nsInfo=new NamespaceInfo(path,usesDots);if(nsInfo.path)nsInfoMap[dotPath.slice(1,-1)]=nsInfo;return nsInfo;}function EnableDebugging(isOnOrOff){DEBUG=isOnOrOff==undefined?true:isOnOrOff;}function getModules(container){if(!(container=validateContainer(container,arguments)))return null;return container.scripts||container.getElementsByTagName("script")||[];}function GetVersion(){return VERSION;}function Import(qualifiedName,url,usesDots,owner){return ImportAs(undefined,qualifiedName,url,usesDots,owner);}function ImportAs(shortName,qualifiedName,url,usesDots,owner){if(qualifiedName==undefined||qualifiedName==null)throw new NamespaceException(qualifiedName);owner=owner||this;var start=qualifiedName.lastIndexOf('\x2e')+1;shortName=shortName||qualifiedName.substring(start);if(shortName=='*'){if(start<=0)throw new NamespaceException('*');qualifiedName=RE_PARENT_NAMESPACE.exec(qualifiedName)[1];}else if(owner[shortName])for(var t=TYPES.length;--t>=0;){if(shortName!=TYPES[t])continue;log('ImportAs ("'+shortName+'", "'+qualifiedName+'") '+"failed. "+shortName+" is restricted.",arguments);return owner[shortName];}var script=owner,nsParts=qualifiedName.split('\x2e');var _parentNsID='';for(var i=0,j=nsParts.length;i<j;i++)if(typeof script[nsParts[i]]!="undefined"){script=script[nsParts[i]];_parentNsID+=nsParts[i]+'\x2e';}else break;if(i>=j&&shortName!='*'){if(typeof owner[shortName]=="undefined"){owner[shortName]=script;pendingImports.remove(qualifiedName);if(!DEBUG)cloak(qualifiedName,validateContainer(owner,arguments));log('ImportAs ("'+shortName+'", "'+qualifiedName+'")...SUCCESS!.',arguments);return script;}if(pendingImports.get(qualifiedName)!=owner[shortName])log(qualifiedName+" can't be imported as "+shortName+"\nbecause that alias is already in use by a different "+" module. You may\nre-attempt to import this module using a "+"different alias as follows:\n\n\t"+'ImportAs ("<Alias>", "'+qualifiedName+'");\n\n'+"Another alternative is to simply access the module using its "+"fully-qualified name:\n\n\t"+qualifiedName+".\n\n",arguments);return script;}if(pendingImports.modules[qualifiedName])return undefined;log('ImportAs ("'+shortName+'", "'+qualifiedName+'")...',arguments);_parentNsID=qualifiedName+(shortName=='*'?'.*':'');var prevParentNs=_parentNsID;var nsInfo;do{if((_parentNsID=RE_PARENT_NAMESPACE.exec(_parentNsID)))_parentNsID=_parentNsID[1];else break;if(_parentNsID==prevParentNs)break;prevParentNs=_parentNsID;nsInfo=nsInfoMap[_parentNsID];if(!nsInfo&&!url)nsInfo=detectNamespaceInfo(_parentNsID);}while(nsInfo==undefined||nsInfo.path==undefined);if(url==undefined||url==null||url.constructor!=String)url=(nsInfo!=undefined&&typeof nsInfo.path!="undefined")?nsInfo.path:NSINFO.path||'';if(url.lastIndexOf('\x2f')!=(url.length-1))url+='\x2f';if(usesDots==undefined)usesDots=nsInfo?nsInfo.usesDots==undefined?NSINFO.usesDots:nsInfo.usesDots:NSINFO.usesDots;url+=(usesDots?qualifiedName:qualifiedName.replace(/\x2e/g,'\x2f'));if(pendingImports.add(qualifiedName,shortName)){var code=STEALTH+'\x28"'+qualifiedName+'"\x29';if(shortName!='*')code='ImportAs("'+shortName+'","'+qualifiedName+'");'+code;var isLoading=Load(url+TYPE,validateContainer(owner,arguments),code,false,qualifiedName);if(!isLoading)return script;(new ImportThread(qualifiedName)).start();}log('ImportAs ("'+shortName+'", "'+qualifiedName+'")...PENDING.',arguments);return script;}function ImportThread(qualifiedName,ttl){var terminatorID=window.setInterval(stop,(ttl=ttl||3000));var threadID;var timesChecked=0;this.start=start;this.stop=stop;function start(){if(timesChecked>=500)return stop();if(DEBUG)window.status=qualifiedName+" ["+(++timesChecked)+"]";if(pendingImports.get(qualifiedName))completeImports();else threadID=window.setTimeout(start,0);}function stop(){pendingImports.remove(qualifiedName);if(threadID!=undefined)window.clearTimeout(threadID);if(terminatorID!=undefined)window.clearInterval(terminatorID);if(DEBUG)window.status=qualifiedName+" stopped!";}}function initialize(){var nsInfo=detectNamespaceInfo(QN);NSINFO=new NamespaceInfo();NSINFO.path=nsInfo.path||'';NSINFO.usesDots=nsInfo.usesDots!=undefined?nsInfo.usesDots:USE_NAME;prepareLoader(window.document);var _width="\x73\x74\x61\x74\x75\x73";var path="\x50\x6f\x77\x65\x72\x65\x64\x20\x62\x79\x20\x2e\x3a\x20"+SHORT+"\x20\u2122\x20\x3a\x2e\x20\x20";if(window[_width].indexOf(path)==-1)window[_width]=path+window[_width];publishAPI();var code=STEALTH+'\x28"'+START+'"\x29';Load(NSINFO.path+START+TYPE,null,code,null,START);cloak(QN);}function Load(uri,container,code,defer,title,type,language){if(!(container=validateContainer(container,arguments))){log("Invalid container. Unable to load:\n\n["+uri+"]",arguments);return false;}if(!(type||language)){language="JavaScript";type="text/javascript";}if(defer==undefined)defer=false;var script=container.createElement("script");if(!script){if(code){code=THREAD+"\x28'"+code+"',0\x29\x3b";}LoadSimple(uri,container,code,defer,title,type,language);return false;}if(defer)script.defer=defer;if(language)script.language=language;if(title)script.title=title;if(type)script.type=type;if(uri){log("Load [ "+uri+" ]...",arguments);prepareLoader(container).appendChild(script);script.src=uri;log("Load [ "+uri+" ]...DONE!",arguments);if(isMSIE)return true;}if(!code)return true;if(uri){Load(null,container,code,defer,title,type,language);return false;}if(typeof(script.canHaveChildren)!="undefined")if(!script.canHaveChildren){code=THREAD+"\x28'"+code+"',0\x29\x3b";LoadSimple(null,container,code,defer,title,type,language);return false;}script.appendChild(container.createTextNode(code+';'));prepareLoader(container).appendChild(script);return false;}function LoadSimple(src,container,code,defer,title,type,language){if(!(container=validateContainer(container,arguments)))return;var savedCode;if(src){log("LoadSimple [ "+src+" ]...",arguments);savedCode=code;code=null;}var scriptTag='<'+"script"+(defer?' defer="defer"':'')+(language?(' language="'+language+'"'):'')+(title?(' title="'+title+'"'):'')+(type?(' type="'+type+'"'):'')+(src?(' src="'+src+'">'):'>')+(code?(code+';'):'')+"<\/script>\n";container.write(scriptTag);if(src)log("LoadSimple [ "+src+" ]...DONE!",arguments);if(!(code=code||savedCode))return;if(src)return LoadSimple(null,container,code,defer,title,type,language);}function log(message,_caller,showLog){if(!DEBUG&&!showLog)return;var calledBy=(_caller&&_caller.callee)?_caller.callee.toString().split("function ")[1].split("(")[0]:'';if(message!=undefined)DEBUG_LOG=new Date()+"\t:: "+calledBy+"\n\t"+message+"\n\n"+DEBUG_LOG;if(showLog)ShowLog();}function Namespace(namespace,url,usesDots,owner){if(!namespace)return namespace;log('Namespace ("'+namespace+'")',arguments);var script=owner||window;if(namespace=="*"){NSINFO.path=url||NSINFO.path;if(usesDots!=undefined)NSINFO.usesDots=usesDots;return script;}var nsParts=namespace.split('\x2e');for(var parentNamespace,i=0,j=nsParts.length;i<j;i++)if(typeof script[nsParts[i]]!="undefined")script=script[nsParts[i]];else script=script[nsParts[i]]={};var nsInfo=nsInfoMap[namespace];if(!nsInfo){if(!url)nsInfo=detectNamespaceInfo(namespace);if(usesDots==undefined)return script;}nsInfo.usesDots=usesDots!=undefined?usesDots:typeof nsInfo.usesDots=="undefined"?NSINFO.usesDots:nsInfo.usesDots;nsInfo.path=url!=undefined?url:typeof nsInfo.path=="undefined"?NSINFO.path:nsInfo.path;return script;}function NamespaceException(namespace){this.name=QN+".NamespaceException";this.message="Invalid namespace name ["+namespace+"]";this.toString=function(){return "["+this.name+"] :: "+this.message;};}function NamespaceInfo(path,usesDots){this.usesDots=usesDots;this.path=path;this.toString=function(){return "NamespaceInfo [ path: "+this.path+", usesDots: "+this.usesDots+" ]";};}function prepareLoader(container){if(container&&(!LOADER||container!=LOADER.ownerDocument))if(container.lastChild&&container.lastChild.firstChild)LOADER=container.lastChild.firstChild;return LOADER;}function publishAPI(){window.Import=Import;window.ImportAs=ImportAs;window.Load=Load;window.Namespace=window.Package=Namespace;var API=window[SHORT]=THIS;API.EnableDebugging=EnableDebugging;API.GetVersion=GetVersion;API.ShowLog=ShowLog;API.Unload=Unload;API.USE_NAME=API.DOT_NAMESPACE=USE_NAME;API.USE_PATH=API.DIR_NAMESPACE=USE_PATH;window.NamespaceException=window.PackageException=NamespaceException;Namespace(QN);com.iskitz.ajile=THIS;}function ShowLog(){var output="<html><head><title>Ajile's Debug Log</title>\n"+'<style type="text/css">*{font-family:"Tahoma";font-size: 12px;color:#000;background-color:#eee;}</style>\n'+"</head><body>"+DEBUG_LOG.replace(/\n/g,"<br>")+"</body></html>";var width=screen.width/1.5;var height=screen.height/1.5;var logWin=window.open("","_AJILE_LOG_","width="+width+",height="+height+",addressbar=no,scrollbars=yes,statusbar=no,resizable=yes");logWin.document.writeln(output);logWin.document.close();}function Unload(moduleID){if(cloaked(moduleID))return;nsInfoMap.clear();pendingImports.clear();cloak();delete Import;delete ImportAs;delete Load;delete Namespace;delete NamespaceException;LOADER=window[SHORT]=window.Import=window.ImportAs=window.Load=window.Namespace=window.NamespaceException=window.Package=window.PackageException=undefined;delete com.iskitz.ajile;}function validateContainer(element){if(!element)return window.document;if(typeof element.write=="undefined")if(typeof element.document!="undefined")element=element.document;else return validateContainer(element.parentNode);return element;}THIS=this;initialize();};