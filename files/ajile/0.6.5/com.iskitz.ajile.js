/*-----------------------------------------------------------------------------+
| Product:  Ajile [com.iskitz.ajile]
| Version:  0.6.5
|+-----------------------------------------------------------------------------+
| Author:   Michael A. I. Lee [iskitz.com]
|
| Created:  Tuesday,   November   4, 2003    [2003.11.04]
| Modified: Monday     September 11, 2006    [2006.09.11 - 02:53:23   EDT]
|+-----------------------------------------------------------------------------+
|
| [Ajile] - Advanced JavaScript Import & Load Extension is a JavaScript
|           module that adds namespacing and importing capabilities to the
|           JavaScript Language.
|
|           Visit http://ajile.net/ to start creating
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
| Contributor(s): Michael A. I. Lee [ ajile@iskitz.com ]
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
new function(){if(isIncompatible())return;var CLOAK=true;var DEBUG=false;var MVC=true;var MVC_SHARE=true;var OVERRIDE=false;var UPDATE=false;var NOTATIONS=['*','|',':','"','<','>','?','[','{','(',')','}',']','\x5c','&','@','#','\x24','%','!',';',"'",'=','+','~',',','^','_',' ','`','-','\x2f','.'];var RE_OPT_CLOAK=(/(cloakoff|cloak)/);var RE_OPT_DEBUG=(/(debugoff|debug)/);var RE_OPT_MVC=(/(mvcoff|mvc)/);var RE_OPT_MVC_SHARE=(/(mvcshareoff|mvcshare)/);var RE_OPT_OVERRIDE=(/(overrideoff|override)/);var RE_OPT_UPDATE=(/(updateoff|update)/);var RE_PARENT_DIR=(/(.*\/)[^\/]+/);var RE_PARENT_NAMESPACE=(/(.*)\.[^\.]+/);var RE_RELATIVE_DIR=(/(\/\.\/)|(\/[^\/]*\/\.\.\/)/);var RE_URL_PROTOCOL=(/:\/\x2f/);var CONTROLLER="\x69\x6e\x64\x65\x78",x65="\x41\x6a\x69\x6c\x65";var EXTENSION="\x2e\x6a\x73",x2f="\x63\x6f\x6d\x2e\x69\x73\x6b\x69\x74\x7a\x2e\x61\x6a\x69\x6c\x65";var SEPARATOR='\x2f',x2e=["\x2e\x3a\x20","\x20\x50\x6f\x77\x65\x72\x65\x64\x20\x3a\x2e\x20\x20"];var STEALTH=x65+"\x2e\x55\x6e\x6c\x6f\x61\x64",x69=["\x73","\x75","\x74","\x61","\x74","\x73"];var THREAD="\x73\x65\x74\x54\x69\x6d\x65\x6f\x75\x74",x3c="\x3c\x2a\x3e";var TYPES=[x65,"Import","ImportAs","Load","Namespace","NamespaceException","Package","PackageException"];var INFO=new NamespaceInfo();var LOADER;var LOG='';var currentModuleName;var userAgent=window.navigator.userAgent.toUpperCase();var isMSIE=userAgent.indexOf('MSIE')>-1&&userAgent.indexOf('BLAZER')==-1&&userAgent.indexOf('OPERA')==-1&&userAgent.indexOf('PALMSOURCE')==-1;var importListeners=new SimpleSet();var modulePaths=new SimpleSet();var nsInfoMap={clear:function nsInfoMap$clear(){for(var moduleName in this)delete this[moduleName];}};var pendingImports=new SimpleSet();var processed=new SimpleSet();var supporters=new SimpleSet();var users=new SimpleSet();(function $Create(THIS){if(!(INFO=getNamespaceInfo(x2f)))return;if(!/\x41\x6a\x69\x6c\x65/.test(this[(x69=x69.reverse().join(''))]))this[x69]=[x2e.join(x65),this[x69]].join('');INFO=new NamespaceInfo(INFO);share(THIS);AddImportListener(cloak);loadController();cloak(x2f);preserveImportFailSafe();})(this);function $Destroy(moduleID){if(cloaked(moduleID))return;importListeners.clear();modulePaths.clear();nsInfoMap.clear();pendingImports.clear();processed.clear();supporters.clear();users.clear();cloak();delete Import;delete ImportAs;delete Load;delete Namespace;delete DEPRECATED$NamespaceException;LOADER=window[x65]=window.Import=window.ImportAs=window.JSImport=window.JSLoad=window.JSPackage=window.Load=window.Namespace=window.NamespaceException=window.Package=window.PackageException=undefined;delete com.iskitz.ajile;}function addAsSupporter(fullName,shortName){var uses=supporters.get(currentModuleName);if(!uses)supporters.add(currentModuleName,(uses=new SimpleSet()));uses.add(fullName,shortName);}function AddImportListener(moduleName,listener){preserveImportFailSafe();if(!listener||(Function!=listener.constructor))if(moduleName&&(Function==moduleName.constructor)){listener=moduleName;moduleName=null;}else return false;else if(moduleName&&(String!=moduleName.constructor))return false;if(moduleName==x3c&&this==window[x65])return false;if(!moduleName&&this!=window[x65])moduleName=x3c;if((moduleName&&(processed.has(moduleName)||GetModule(moduleName)))||(!moduleName&&(processed.getSize()>0||pendingImports.getSize()==0)))return setTimeout(function(){listener(moduleName);},62.25);var listeners=importListeners.get((moduleName=(moduleName||'')));if(!listeners)importListeners.add(moduleName,(listeners=new SimpleSet()));listeners.add(Math.random(),listener);return true;}function cloak(moduleName){if(moduleName&&!isString(moduleName))return;moduleName=moduleName||'';var container;for(var id,src,sys,loaders=getLoaders(),i=loaders.length;--i>=0;){if(!loaders[i]||((id=loaders[i].title)&&(id!=moduleName)))continue;src=loaders[i].src;sys=(src&&(src.indexOf(x2f)>=0))||(id&&(id.indexOf(x2f)==0));if(sys||(!src&&id)||CLOAK)if((container=loaders[i].parentNode)&&container.removeChild)container.removeChild(loaders[i]);}}function cloaked(moduleName){if(!(moduleName&&moduleName.constructor==String))return false;cloak(moduleName);return true;}function compareNumbers(num1,num2){return num1-num2;}function completeImports(e){var logMsg;var modules=pendingImports.getAllArray();var shortName;for(var fullName,i=modules.length;--i>=0;){if(!pendingImports.has((fullName=modules[i][0])))continue;shortName=modules[i][1];logMsg=(shortName=='*'||shortName=="&lt;imported&gt;")?('Import ("'+fullName+'.*")'):('ImportAs ("'+shortName+'", "'+fullName+'")');log((logMsg+"...CHECKING"),arguments);if(!GetModule(fullName))continue;if(shortName=='*')shortName=null;ImportAs(shortName,fullName,null,null,this);}}function detectCurrentModule(namespace){var parentNamespace;var pending=pendingImports.getAll();for(var moduleName in pending)if(!processed.has(moduleName))if((parentNamespace=RE_PARENT_NAMESPACE.exec(moduleName)))if(namespace==parentNamespace[1]){processed.add(moduleName);currentModuleName=moduleName;return;}currentModuleName=CONTROLLER;}function getContainer(element){if(!element)return window.document;if(typeof element.write=="undefined")if(typeof element.document!="undefined")element=element.document;else return getContainer(element.parentNode);return element;}function getImportInfo(shortName,fullName){if(!fullName)return null;var parts=fullName.split('\x2e');var version;for(var i=0;i<parts.length;i++){if(isNaN(parts[i]))continue;fullName=parts.slice(0,i).join('\x2e');shortName=shortName||parts.slice(i-1,i)[0];version=parts.slice(i).join('\x2e');break;}if(!version)return null;return[shortName,fullName,version];}function getLoaders(container){if(!(container=getContainer(container)))return null;var loaders=container.scripts||container.getElementsByTagName("script")||[];return loaders;}function getMainLoader(container){if(container&&(!LOADER||container!=LOADER.ownerDocument))if(container.lastChild&&container.lastChild.firstChild)LOADER=container.lastChild.firstChild;return LOADER;}function getMETAInfo(path){loadOptions(path);if(!path||path.constructor!=String)return[];var iExt=EXTENSION?path.lastIndexOf(EXTENSION):path.lastIndexOf('\x2e');if(iExt<path.length&&iExt>=0){var extension=path.slice(iExt,iExt+EXTENSION.length);var version=path.substring(0,iExt);if(version&&isNaN(version.charAt(0)))version='';}return[version,extension];}function GetModule(fullName,owner){var module=owner||window;fullName=fullName.split('\x2e');for(var i=0,j=fullName.length;i<j;i++)if(typeof module[fullName[i]]!="undefined")module=module[fullName[i]];else return undefined;return module;}function GetNamespaceInfo(moduleOrName){if(!moduleOrName)return new NamespaceInfo(INFO);var isModuleName=moduleOrName.constructor==String;for(var moduleName in nsInfoMap)if(isModuleName&&moduleOrName==moduleName||moduleOrName==GetModule(moduleName))return nsInfoMap[moduleName];return null;}function getNamespaceInfo($namespace,$notation){$namespace=$namespace||x2f;if($namespace==x2f&&INFO.path)return INFO;var nsInfo=nsInfoMap[$namespace];if(nsInfo)return nsInfo;var lookups=getNamespaceLookups($namespace,$notation);if((nsInfo=getNamespaceInfoCached($namespace,lookups)))return(nsInfoMap[$namespace]=nsInfo);var loaders=getLoaders();if(!(loaders&&lookups))return null;var $path;for(var found=false,path,paths,i=0,j=loaders.length;i<j;i++){path=unescape(loaders[i].src);if(path&&path.search(RE_URL_PROTOCOL)==-1){path=unescape(document.location.href);if(path.charAt(path.length-1)!=SEPARATOR)if((paths=RE_PARENT_DIR.exec(path))!=null)if(paths[1].length>path.search(RE_URL_PROTOCOL)+3)path=paths[1];path+=unescape(loaders[i].src);}if(path==undefined||path==null)continue;while(RE_RELATIVE_DIR.test(path))path=path.replace(RE_RELATIVE_DIR,'\x2f');if(modulePaths.has(path))continue;modulePaths.add(path);if(found)continue;var lookupList;for(var notation in lookups){lookupList=lookups[notation];var lookup,position,positions=[];for(var lc=lookupList.length;--lc>=0;){lookup=lookupList[lc];position=path.lastIndexOf(lookup)+1;if(position<=0||position==positions[0])continue;positions[positions.length]=position;log("Found Path ["+$namespace+"]: "+path,arguments);}if(positions.length==0)continue;positions.sort(compareNumbers);position=positions[positions.length-1];$notation=(position==(path.lastIndexOf(lookup)+1))?notation:undefined;$path=path.substring(0,position);found=true;if($namespace==x2f&&loaders[i].title!=x2f)loaders[i].title=x2f;var iEnd=position+lookup.length-2;var metaInfo=getMETAInfo(path.substring(iEnd+1));var extension=metaInfo[1];var version=metaInfo[0];break;}}if(!$path)return null;nsInfo=new NamespaceInfo($path,$notation,$namespace,null,version,extension);nsInfoMap[$namespace]=nsInfo;return nsInfo;}function getNamespaceInfoCached($namespace,lookups){var closest=Number.MAX_VALUE;var diff;var iFinds=[];var iFound;var iPick=0;lookups=lookups||getNamespaceLookups($namespace);var notations=[];var paths=modulePaths.getAll();paths:for(var path in paths){for(var notation in lookups){notations[notations.length]=notation;for(var lookupList=lookups[notation],i=lookupList.length;--i>=0;){if(0<(iFound=path.lastIndexOf(lookupList[i]))){diff=path.length-(iFound+lookupList[i].length);if(diff<closest){closest=diff;iPick=iFinds.length;}iFinds[iFinds.length]=iFound+1;var iEnd=(iFound+1)+lookupList[i].length-2;var metaInfo=getMETAInfo(path.substring(iEnd+1));var extension=metaInfo[1];var version=metaInfo[0];log("Found Cached Path ["+$namespace+"]: "+path,arguments);break paths;}if(i==0)delete notations[--notations.length];}}}if(!iFinds||iFinds.length==0)return null;path=path.substring(0,iFinds[iPick]);var nsInfo=new NamespaceInfo(path,notations[iPick],$namespace,null,version,extension);if(nsInfo.path)nsInfoMap[$namespace]=nsInfo;return nsInfo;}function getNamespaceLookups($namespace,notation){var separator=getSeparator();var notations=notation==undefined?NOTATIONS:[notation];var lookups={};for(var i=notations.length;--i>=0;){notation=notations[i];lookups[notation]=[];lookups[notation][2]=separator+$namespace.replace(/\x2e/g,notation);lookups[notation][0]=lookups[notation][2]+notation;lookups[notation][1]=lookups[notation][2]+separator;lookups[notation][2]=lookups[notation][2]+'\x2e';}return lookups;}function getSeparator(){var path=unescape(document.location.href);var iBSlash=path.lastIndexOf('\x5c')+1;var iFSlash=path.lastIndexOf('\x2f')+1;SEPARATOR=(iBSlash>iFSlash?'\x5c':'\x2f');return SEPARATOR;}function handleImport(shortName,fullName,url,notation,version,module,owner){var _parentNsID=fullName+(shortName=='*'?'.*':'');var prevParentNs=_parentNsID;var nsInfo;do{if((_parentNsID=RE_PARENT_NAMESPACE.exec(_parentNsID)))_parentNsID=_parentNsID[1];else break;if(_parentNsID==prevParentNs)break;prevParentNs=_parentNsID;nsInfo=getNamespaceInfo(_parentNsID);}while(!nsInfo);if(url==undefined||url==null||url.constructor!=String)url=(nsInfo!=undefined&&typeof nsInfo.path!="undefined")?nsInfo.path:(INFO.path||'');if(url.lastIndexOf('\x2f')!=(url.length-1))url+='\x2f';if(notation==false)notation='\x2f';else if(notation==true)notation='\x2e';if(notation==undefined)notation=nsInfo?nsInfo.notation==undefined?INFO.notation:nsInfo.notation:INFO.notation;url+=escape(fullName.replace(/\x2e/g,notation));if(pendingImports.add(fullName,shortName)){var code;if(shortName=='*'){addAsSupporter(fullName,fullName);code='ImportAs("&lt;imported&gt;","'+fullName+'");';log('Import ("'+fullName+'.*")...',arguments);}else{addAsSupporter(fullName,shortName);code='ImportAs("'+shortName+'","'+fullName+'");';log('ImportAs ("'+shortName+'", "'+fullName+'")...',arguments);}updateUsers(fullName);if(version)url+='\x2e'+version;var isLoading=Load(url+EXTENSION,getContainer((owner||this)),code,false,fullName);if(!isLoading)return module;(new ImportThread(fullName)).start();}return module;}function handleImportLoaded(shortName,fullName,module,owner){owner=owner||this;if(!module)return module;if(hasNamingConflict(shortName,fullName,owner)){pendingImports.remove(fullName);return module;}if(!isSupported(fullName,shortName))return module;var logMsg=[];var pendingName=pendingImports.get(fullName);if(shortName&&shortName!="&lt;imported&gt;"&&(!pendingName||(pendingName!='*'&&pendingName!="&lt;imported&gt;"))){owner[shortName]=module;logMsg[0]='ImportAs ("'+shortName+'", "'+fullName+'")...SUCCESS';pendingImports.remove(fullName);}else if(pendingName=='*'){for(var member in module)if(!hasNamingConflict(member,(fullName+'.'+member),owner)){owner[member]=module[member];logMsg[logMsg.length]='ImportAs ("'+member+'", "'+fullName+'.'+member+'")...SUCCESS';}pendingImports.remove(fullName);if(shortName!="&lt;imported&gt;")pendingImports.add(fullName,"&lt;imported&gt;");}else if(pendingName!='*'&&(pendingName=="&lt;imported&gt;"||shortName=="&lt;imported&gt;")){logMsg[0]='Import ("'+fullName+'.*")...SUCCESS';pendingImports.remove(fullName);}if(logMsg.length>0)log(logMsg.join('\n'),arguments);notifyImportListeners(fullName);updateDependencies(fullName);return module;}function hasNamingConflict(shortName,fullName,owner){owner=owner||this;if(OVERRIDE||(typeof owner[shortName]=="undefined")||(GetModule(fullName)==owner[shortName]))return false;log("\nWARNING: There is a naming conflict with the alias "+shortName+".\nConsider using ImportAs with a different alias. For example:"+'\n\n\tImportAs ("'+shortName+'1", "'+fullName+'");\n\n'+"The module can currently be accessed using its fully-qualified "+"name:\n\n\t"+fullName+".\n",arguments,DEBUG);return true;}function Import(fullName,url,notation,owner){return ImportAs(undefined,fullName,url,notation,owner);}function ImportAs(shortName,fullName,url,notation,owner){preserveImportFailSafe();if(!fullName||fullName=="*"){log('ImportAs ("'+shortName+'", "'+fullName+'")...INVALID!');return null;}var importInfo=getImportInfo(shortName,fullName);owner=owner||this;var version;if(importInfo){fullName=importInfo[1];shortName=importInfo[0];version=importInfo[2];}else{if(!isString(shortName))shortName='';var start=fullName.lastIndexOf('\x2e')+1;shortName=shortName||fullName.substring(start);}if(shortName=='*')fullName=RE_PARENT_NAMESPACE.exec(fullName)[1];else if(owner[shortName])for(var t=TYPES.length;--t>=0;){if(shortName!=TYPES[t])continue;log('ImportAs ("'+shortName+'", "'+fullName+'") '+"failed. "+shortName+" is restricted.",arguments);return owner[shortName];}var module=owner;var _parentNsID='';for(var nsParts=fullName.split('\x2e'),i=0,j=nsParts.length;i<j;i++)if(typeof module[nsParts[i]]!="undefined"){module=module[nsParts[i]];_parentNsID+=nsParts[i]+'\x2e';}else break;if(i>=j&&shortName!='*')return handleImportLoaded(shortName,fullName,module,owner);if(pendingImports.has(fullName))return undefined;return handleImport(shortName,fullName,url,notation,version,module,owner);}function ImportThread(fullName,ttl,maxCheckCount){maxCheckCount=maxCheckCount||500;var terminatorID=window.setInterval(stop,(ttl=ttl||3000));var threadID;var timesChecked=0;this.start=start;this.stop=stop;function start(){if(timesChecked>=maxCheckCount){stop();return;}if(GetModule(fullName))completeImports();else threadID=window.setTimeout(start,0);}function stop(){pendingImports.remove(fullName);if(threadID!=undefined)window.clearTimeout(threadID);if(terminatorID!=undefined)window.clearInterval(terminatorID);}}function isIncompatible(){return(typeof document=="undefined"||typeof document.appendChild=="undefined"||typeof document.createElement=="undefined"||typeof document.getElementsByTagName=="undefined"||typeof document.removeChild=="undefined");}function isString(object){return(object!=null&&object!=undefined&&object.constructor==String);}function isSupported(fullName,shortName){var dependencies=supporters.get(fullName);var isCurrentModule=(fullName==currentModuleName);var isPending=pendingImports.has(fullName);function isInlineImportReady(){if(!isCurrentModule)if(!isSupported(currentModuleName)){if(isPending)return false;pendingImports.add(fullName,shortName);(new ImportThread(fullName)).start();return false;}else return true;else return true;}if(!dependencies)return isInlineImportReady();dependencies=dependencies.getAll();for(var supporter in dependencies)if(!GetModule(dependencies[supporter]))return false;return isInlineImportReady();}function Load(url,container,code,defer,title,type,language){preserveImportFailSafe();if(!(container=getContainer(container))){log("Invalid container. Unable to load:\n\n["+url+"]",arguments);return false;}if(url)modulePaths.add(unescape(url));if(!(type||language)){language="JavaScript";type="text/javascript";}if(defer==undefined)defer=false;var script=container.createElement("script");if(!script){if(code)code=THREAD+"\x28'"+code+"',0\x29\x3b";LoadSimple(url,container,code,defer,title,type,language);return false;}if(defer)script.defer=defer;if(language)script.language=language;if(title)script.title=title;if(type)script.type=type;if(url){log("Load [ "+url+" ]...",arguments);getMainLoader(container).appendChild(script);script.src=url;log("Load [ "+url+" ]...DONE!",arguments);if(isMSIE)return true;}if(!code)return true;if(url){Load(null,container,code,defer,title,type,language);return true;}if(typeof(script.canHaveChildren)!="undefined")if(!script.canHaveChildren){code=THREAD+"\x28'"+code+"',0\x29\x3b";LoadSimple(null,container,code,defer,title,type,language);return false;}script.appendChild(container.createTextNode(code+';'));getMainLoader(container).appendChild(script);return false;}function loadController(){if(!(MVC||MVC_SHARE))return;var code;if(MVC_SHARE){code=STEALTH+'\x28"'+CONTROLLER+'"\x29';Load(INFO.path+CONTROLLER+EXTENSION,null,code,null,CONTROLLER);}if(!MVC)return;var name=unescape(document.location.href);var iEnd=name.lastIndexOf(SEPARATOR);name=name.substring(++iEnd);iEnd=name.lastIndexOf('\x2e');iEnd=(iEnd==-1)?0:iEnd;if((name=name.substring(0,iEnd))=="")name=CONTROLLER;else CONTROLLER=name;code=STEALTH+'\x28"'+CONTROLLER+'"\x29';Load(CONTROLLER+EXTENSION,null,code,null,CONTROLLER);}function loadOptions(path){if(!path||path.constructor!=String)return;var iQuery=path.lastIndexOf("?")+1;path=path.substring(iQuery).toLowerCase();if(path.length==0)return;var option;if((option=RE_OPT_CLOAK.exec(path)))CLOAK=option[1]=="cloak";if((option=RE_OPT_DEBUG.exec(path)))DEBUG=option[1]=="debug";if((option=RE_OPT_MVC.exec(path)))MVC=option[1]=="mvc";if((option=RE_OPT_MVC_SHARE.exec(path)))MVC_SHARE=option[1]=="mvcshare";if((option=RE_OPT_OVERRIDE.exec(path)))OVERRIDE=option[1]=="override";if((option=RE_OPT_UPDATE.exec(path)))UPDATE=option[1]=="update";}function log(message,_caller,showLog){if(!DEBUG&&!showLog)return;var calledBy=(_caller&&_caller.callee)?_caller.callee.toString().split("function ")[1].split("(")[0]:'';if(message!=undefined)LOG=new Date()+"\t:: "+calledBy+"\n\t"+message+"\n\n"+LOG;if(showLog)ShowLog();}function logImportCheck(shortName,fullName,params){var logMsg=(shortName=='*'||shortName=="&lt;imported&gt;")?('Import ("'+fullName+'.*")'):('ImportAs ("'+shortName+'", "'+fullName+'")');log((logMsg+"...CHECKING"),params);}function LoadSimple(src,container,code,defer,title,type,language){if(!(container=getContainer(container)))return;var savedCode;if(src){log("LoadSimple [ "+src+" ]...",arguments);savedCode=code;code=null;}var scriptTag='<'+"script"+(defer?' defer="defer"':'')+(language?(' language="'+language+'"'):'')+(title?(' title="'+title+'"'):'')+(type?(' type="'+type+'"'):'')+(src?(' src="'+src+'">'):'>')+(code?(code+';'):'')+"<\/script>\n";container.write(scriptTag);if(src)log("LoadSimple [ "+src+" ]...DONE!",arguments);if(!(code=code||savedCode))return;if(src)LoadSimple(null,container,code,defer,title,type,language);}function Namespace(namespace,path,notation,owner){preserveImportFailSafe();namespace=namespace||"\x3cdefault\x3e";log('Namespace ("'+namespace+'")',arguments);var script=owner||window;if(namespace=="\x3cdefault\x3e"){INFO.update(path,notation);log(INFO,arguments);return script;}detectCurrentModule(namespace);var nsParts=namespace.split('\x2e');for(var i=0,j=nsParts.length;i<j;i++)if(typeof script[nsParts[i]]!="undefined")script=script[nsParts[i]];else script=script[nsParts[i]]={};var nsInfo=nsInfoMap[namespace];if(nsInfo){nsInfo.update(path,notation);log(nsInfo,arguments);return script;}if(!path)nsInfo=getNamespaceInfo(namespace,notation);if(path||!nsInfo)nsInfo=new NamespaceInfo(path,notation,namespace);if(nsInfo&&!nsInfoMap[namespace])nsInfoMap[namespace]=nsInfo;log(nsInfo,arguments);return script;}function NamespaceInfo(path,notation,fullName,shortName,version,extension){this.toString=toString;this.update=update;if(path instanceof NamespaceInfo){var ns=path;extension=ns.extension;fullName=ns.fullName;notation=ns.notation;path=ns.path;shortName=ns.shortName;version=ns.version;}this.update(path,notation,fullName,shortName,version,extension);function toString(){return "NamespaceInfo"+"\n[ fullName: "+this.fullName+"\n, shortName: "+this.shortName+"\n, version: "+this.version+"\n, notation: "+this.notation+"\n, uri: "+this.uri+"\n, path: "+this.path+"\n]";}function update(path,notation,fullName,shortName,version,extension){this.extension=extension||this.extension||EXTENSION;this.fullName=fullName||this.fullName||'';this.shortName=shortName||this.shortName||'';this.notation=isString(notation)?notation:(this.notation||((INFO&&isString(INFO.notation))?INFO.notation:'\x2e'));this.path=isString(path)?path:(this.path||((INFO&&isString(INFO.path))?INFO.path:''));this.uri=this.path+this.fullName.replace(/\x2e/g,this.notation);this.version=''+(version||this.version||'');if(!this.uri)return;this.uri+=(this.version?('\x2e'+this.version):'')+this.extension;}}function notifyImportListeners(fullName){var listenerList=[importListeners.get(''),importListeners.get(fullName),importListeners.get(x3c)];if(!listenerList[0]&&!listenerList[1]&&!listenerList[2])return;for(var listeners,i=listenerList.length;--i>=0;){if(!listenerList[i])continue;listeners=listenerList[i].getAll();for(var id in listeners)listeners[id](fullName);}}function preserveImportFailSafe(owner){var $onload=(owner=owner||window||this).onload;if($onload)if($onload==importFailSafe||importFailSafe.toString()==$onload.toString())return;owner.onload=importFailSafe;function importFailSafe(e){completeImports(e);if($onload&&(Function==$onload.constructor))$onload();}}function RemoveImportListener(moduleName,listener){preserveImportFailSafe();if(!listener||(Function!=listener.constructor))if(moduleName&&(Function==moduleName.constructor)){listener=moduleName;moduleName=null;}else return false;else if(moduleName&&(String!=moduleName.constructor))return false;var listenerList=[importListeners.get(''),importListeners.get(moduleName),importListeners.get(x3c)];if(!listenerList[0]&&!listenerList[1]&&!listenerList[2])return false;var wasRemoved=false;for(var listeners,i=listenerList.length;--i>=0;){if(!listenerList[i])continue;listeners=listenerList[i].getAll();for(var id in listeners)if(listeners[id]==listener){listenerList[i].remove(id);wasRemoved=true;break;}}return wasRemoved;}function SetOption(optionName,isOnOrOff){preserveImportFailSafe();if(!optionName||optionName.constructor!=String)return;isOnOrOff=isOnOrOff==undefined?true:isOnOrOff;optionName=optionName.toLowerCase();switch(optionName){case "cloak":CLOAK=isOnOrOff;break;case "debug":DEBUG=isOnOrOff;break;case "mvc":MVC=isOnOrOff;break;case "update":UPDATE=isOnOrOff;break;default:break;}}function share(THIS){Namespace(x2f);com.iskitz.ajile=window[x65]=THIS;window.Import=Import;window.ImportAs=ImportAs;window.Load=Load;window.Namespace=Namespace;THIS.AddImportListener=AddImportListener;THIS.RemoveImportListener=RemoveImportListener;THIS.SetOption=SetOption;THIS.ShowLog=ShowLog;THIS.Unload=$Destroy;shareOption(THIS,"Cloak");shareOption(THIS,"Debug");shareOption(THIS,"Override");THIS.DIR_NAMESPACE=THIS.USE_PATH='\x2f';THIS.DOT_NAMESPACE=THIS.USE_NAME='\x2e';THIS.EnableDebugging=THIS.EnableDebug;THIS.GetVersion=function(){return INFO.version;};window.JSImport=Import;window.JSLoad=Load;window.JSPackage=window.Package=Namespace;window.NamespaceException=window.PackageException=DEPRECATED$NamespaceException;}function shareOption(THIS,optionName){if(!optionName||optionName.constructor!=String)return;THIS["Enable"+optionName]=function(isOnOrOff){SetOption(optionName,isOnOrOff);};}function ShowLog(){preserveImportFailSafe();var output="<html><head><title>Ajile's Debug Log</title>\n"+'<style type="text/css">*{font-family:"Tahoma";font-size: 12px;color:#000;background-color:#eee;}</style>\n'+"</head><body>"+LOG.replace(/\n/g,"<br>")+"</body></html>";var width=screen.width/1.5;var height=screen.height/1.5;var logWin=window.open("","_AJILE_LOG_","width="+width+",height="+height+",addressbar=no,scrollbars=yes,statusbar=no,resizable=yes");logWin.document.writeln(output);logWin.document.close();}function SimpleSet(){this.add=add;this.clear=clear;this.get=get;this.getAll=getAll;this.getAllArray=getAllArray;this.getSize=getSize;this.has=has;var members={};this.remove=remove;var size=0;function add(key,value){if(members[key])return false;members[key]=value;size++;return true;}function clear(){for(var key in members)delete members[key];size=0;}function get(key){if(!(key in members))return null;if(typeof members[key]!="undefined")return members[key];return undefined;}function getAll(){return members;}function getAllArray(){var array=[];for(var item in members)array[array.length]=[item,members[item]];return array;}function getSize(){return size;}function has(key){return(key in members);}function remove(key){if(!has(key))return false;delete members[key];size--;return true;}}function updateDependencies(fullName){var usedBy=users.get(fullName);if(!usedBy)return;usedBy=usedBy.getAll();var module,shortName;for(var user in usedBy)if(pendingImports.has(user)&&(module=GetModule(user)))handleImportLoaded(pendingImports.get(user),user,module,this);}function updateUsers(fullName){var usedBy=users.get(fullName);if(!usedBy)users.add(fullName,(usedBy=new SimpleSet()));usedBy.add(currentModuleName);}function DEPRECATED$NamespaceException(namespace){this.name="DEPRECATED: "+x2f+".NamespaceException";this.message="DEPRECATED: Invalid namespace name ["+namespace+"]";this.toString=function(){return "[ "+this.name+" ] :: "+this.message;};}};