YUI.add("editor-base",function(e,t){var n=e.Lang,r=function(){r.superclass.constructor.apply(this,arguments)},i=":last-child";e.extend(r,e.Base,{frame:null,initializer:function(){this.publish("nodeChange",{emitFacade:!0,bubbles:!0,defaultFn:this._defNodeChangeFn})},destructor:function(){this.detachAll()},copyStyles:function(t,n){if(t.test("a"))return;var r=["color","fontSize","fontFamily","backgroundColor","fontStyle"],i={};e.each(r,function(e){i[e]=t.getStyle(e)}),t.ancestor("b,strong")&&(i.fontWeight="bold"),t.ancestor("u")&&(i.textDecoration||(i.textDecoration="underline")),n.setStyles(i)},_lastBookmark:null,_resolveChangedNode:function(e){var t=this.getInstance(),n,r,s,o=this._getRoot(),u;e&&e.compareTo(o)&&(u=new t.EditorSelection,u&&u.anchorNode&&(e=u.anchorNode));if(t&&e&&e.test("html")){n=o.one(i);while(!s)n?(r=n.one(i),r?n=r:s=!0):s=!0;n&&(n.test("br")&&(n.previous()?n=n.previous():n=n.get("parentNode")),n&&(e=n))}return e||(e=o),e},_getRoot:function(){return this.getInstance().EditorSelection.ROOT},_defNodeChangeFn:function(t){var n=(new Date).getTime(),i=this.getInstance(),s,o,u,a={},f,l,c=[],h="",p="",d,v=!1,m=this._getRoot();if(e.UA.ie&&e.UA.ie<11)try{s=i.config.doc.selection.createRange(),s.getBookmark&&(this._lastBookmark=s.getBookmark())}catch(g){}t.changedNode=this._resolveChangedNode(t.changedNode);switch(t.changedType){case"tab":!t.changedNode.test("li, li *")&&!t.changedEvent.shiftKey&&(t.changedEvent.frameEvent.preventDefault(),e.UA.webkit?this.execCommand("inserttext","	"):e.UA.gecko?this.frame.exec._command("inserthtml",r.TABKEY):e.UA.ie&&this.execCommand("inserthtml",r.TABKEY));break;case"backspace-up":e.UA.webkit&&t.changedNode&&t.changedNode.set("innerHTML",t.changedNode.get("innerHTML"))}e.UA.webkit&&t.commands&&(t.commands.indent||t.commands.outdent)&&(d=m.all(".webkit-indent-blockquote, blockquote"),d.size()&&d.setStyle("margin","")),o=this.getDomPath(t.changedNode,!1),t.commands&&(a=t.commands),e.each(o,function(t){var n=t.tagName.toLowerCase(),s=r.TAG2CMD[n],o,u,d,m,g;s&&(a[s]=1),o=t.currentStyle||t.style,""+o.fontWeight=="normal"&&(v=!0),""+o.fontWeight=="bold"&&(a.bold=1),e.UA.ie&&o.fontWeight>400&&(a.bold=1),o.fontStyle==="italic"&&(a.italic=1),o.textDecoration.indexOf("underline")>-1&&(a.underline=1),o.textDecoration.indexOf("line-through")>-1&&(a.strikethrough=1),u=i.one(t),u.getStyle("fontFamily")&&(d=u.getStyle("fontFamily").split(",")[0].toLowerCase(),d&&(f=d),f&&(f=f.replace(/'/g,"").replace(/"/g,""))),l=r.NORMALIZE_FONTSIZE(u),m=t.className.split(" "),e.each(m,function(e){e!==""&&e.substr(0,4)!=="yui_"&&c.push(e)}),h=r.FILTER_RGB(u.getStyle("color")),g=r.FILTER_RGB(o.backgroundColor),g!=="transparent"&&g!==""&&(p=g)}),v&&(delete a.bold,delete a.italic),t.dompath=i.all(o),t.classNames=c,t.commands=a,t.fontFamily||(t.fontFamily=f),t.fontSize||(t.fontSize=l),t.fontColor||(t.fontColor=h),t.backgroundColor||(t.backgroundColor=p),u=(new Date).getTime()},getDomPath:function(e,t){var n=[],r,i,s=this._getRoot(),o=this.frame.getInstance();r=o.Node.getDOMNode(e),i=o.Node.getDOMNode(s);while(r!==null){if(r===o.config.doc.documentElement||r===o.config.doc||!r.tagName){r=null;break}if(!o.DOM.inDoc(r)){r=null;break}r.nodeName&&r.nodeType&&r.nodeType===1&&n.push(r);if(r===i){r=null;break}r=r.parentNode}return n.length===0&&(n[0]=o.config.doc.body),t?o.all(n.reverse()):n.reverse()},_afterFrameReady:function(){var t=this.frame.getInstance();this.frame.on("dom:mouseup",e.bind(this._onFrameMouseUp,this)),this.frame.on("dom:mousedown",e.bind(this._onFrameMouseDown,this)),this.frame.on("dom:keydown",e.bind(this._onFrameKeyDown,this)),e.UA.ie&&e.UA.ie<11&&(this.frame.on("dom:activate",e.bind(this._onFrameActivate,this)),this.frame.on("dom:beforedeactivate",e.bind(this._beforeFrameDeactivate,this))),this.frame.on("dom:keyup",e.bind(this._onFrameKeyUp,this)),this.frame.on("dom:keypress",e.bind(this._onFrameKeyPress,this)),this.frame.on("dom:paste",e.bind(this._onPaste,this)),t.EditorSelection.filter(),this.fire("ready")},_beforeFrameDeactivate:function(e){if(e.frameTarget.test("html"))return;var t=this.getInstance(),n=t.config.doc.selection.createRange();n.compareEndPoints&&!n.compareEndPoints("StartToEnd",n)&&n.pasteHTML('<var id="yui-ie-cursor">')},_onFrameActivate:function(e){if(e.frameTarget.test("html"))return;var t=this.getInstance(),n=new t.EditorSelection,r=n.createRange(),i=this._getRoot(),s=i.all("#yui-ie-cursor");s.size()&&s.each(function(e){e.set("id","");if(r.moveToElementText)try{r.moveToElementText(e._node);var t=r.move("character",-1);t===-1&&r.move("character",1),r.select(),r.text=""}catch(n){}e.remove()})},_onPaste:function(e){this.fire("nodeChange",{changedNode:e.frameTarget,changedType:"paste",changedEvent:e.frameEvent})},_onFrameMouseUp:function(e){this.fire("nodeChange",{changedNode:e.frameTarget,changedType:"mouseup",changedEvent:e.frameEvent})},_onFrameMouseDown:function(e){this.fire("nodeChange",{changedNode:e.frameTarget,changedType:"mousedown",changedEvent:e.frameEvent})},_currentSelection:null,_currentSelectionTimer:null,_currentSelectionClear:null,_onFrameKeyDown:function(t){var n,i;this._currentSelection?i=this._currentSelection:(this._currentSelectionTimer&&this._currentSelectionTimer.cancel(),this._currentSelectionTimer=e.later(850,this,function(){this._currentSelectionClear=!0}),n=this.frame.getInstance(),i=new n.EditorSelection(t),this._currentSelection=i),n=this.frame.getInstance(),i=new n.EditorSelection,this._currentSelection=i,i&&i.anchorNode&&(this.fire("nodeChange",{changedNode:i.anchorNode,changedType:"keydown",changedEvent:t.frameEvent}),r.NC_KEYS[t.keyCode]&&(this.fire("nodeChange",{changedNode:i.anchorNode,changedType:r.NC_KEYS[t.keyCode],changedEvent:t.frameEvent}),this.fire("nodeChange",{changedNode:i.anchorNode,changedType:r.NC_KEYS[t.keyCode]+"-down",changedEvent:t.frameEvent})))},_onFrameKeyPress:function(e){var t=this._currentSelection;t&&t.anchorNode&&(this.fire("nodeChange",{changedNode:t.anchorNode,changedType:"keypress"
,changedEvent:e.frameEvent}),r.NC_KEYS[e.keyCode]&&this.fire("nodeChange",{changedNode:t.anchorNode,changedType:r.NC_KEYS[e.keyCode]+"-press",changedEvent:e.frameEvent}))},_onFrameKeyUp:function(e){var t=this.frame.getInstance(),n=new t.EditorSelection(e);n&&n.anchorNode&&(this.fire("nodeChange",{changedNode:n.anchorNode,changedType:"keyup",selection:n,changedEvent:e.frameEvent}),r.NC_KEYS[e.keyCode]&&this.fire("nodeChange",{changedNode:n.anchorNode,changedType:r.NC_KEYS[e.keyCode]+"-up",selection:n,changedEvent:e.frameEvent})),this._currentSelectionClear&&(this._currentSelectionClear=this._currentSelection=null)},_validateLinkedCSS:function(e){return n.isString(e)||n.isArray(e)},execCommand:function(e,t){var n=this.frame.execCommand(e,t),r=this.frame.getInstance(),i=new r.EditorSelection,s={},o={changedNode:i.anchorNode,changedType:"execcommand",nodes:n};switch(e){case"forecolor":o.fontColor=t;break;case"backcolor":o.backgroundColor=t;break;case"fontsize":o.fontSize=t;break;case"fontname":o.fontFamily=t}return s[e]=1,o.commands=s,this.fire("nodeChange",o),n},getInstance:function(){return this.frame.getInstance()},render:function(t){var n=this.frame;return n||(this.plug(e.Plugin.Frame,{designMode:!0,title:r.STRINGS.title,use:r.USE,dir:this.get("dir"),extracss:this.get("extracss"),linkedcss:this.get("linkedcss"),defaultblock:this.get("defaultblock")}),n=this.frame),n.hasPlugin("exec")||n.plug(e.Plugin.ExecCommand),n.after("ready",e.bind(this._afterFrameReady,this)),n.addTarget(this),n.set("content",this.get("content")),n.render(t),this},focus:function(e){return this.frame.focus(e),this},show:function(){return this.frame.show(),this},hide:function(){return this.frame.hide(),this},getContent:function(){var e="",t=this.getInstance();return t&&t.EditorSelection&&(e=t.EditorSelection.unfilter()),e=e.replace(/ _yuid="([^>]*)"/g,""),e}},{NORMALIZE_FONTSIZE:function(e){var t=e.getStyle("fontSize"),n=t;switch(t){case"-webkit-xxx-large":t="48px";break;case"xx-large":t="32px";break;case"x-large":t="24px";break;case"large":t="18px";break;case"medium":t="16px";break;case"small":t="13px";break;case"x-small":t="10px"}return n!==t&&e.setStyle("fontSize",t),t},TABKEY:'<span class="tab">&nbsp;&nbsp;&nbsp;&nbsp;</span>',FILTER_RGB:function(e){if(e.toLowerCase().indexOf("rgb")!==-1){var t=new RegExp("(.*?)rgb\\s*?\\(\\s*?([0-9]+).*?,\\s*?([0-9]+).*?,\\s*?([0-9]+).*?\\)(.*?)","gi"),n=e.replace(t,"$1,$2,$3,$4,$5").split(","),r,i,s;n.length===5&&(r=parseInt(n[1],10).toString(16),i=parseInt(n[2],10).toString(16),s=parseInt(n[3],10).toString(16),r=r.length===1?"0"+r:r,i=i.length===1?"0"+i:i,s=s.length===1?"0"+s:s,e="#"+r+i+s)}return e},TAG2CMD:{b:"bold",strong:"bold",i:"italic",em:"italic",u:"underline",sup:"superscript",sub:"subscript",img:"insertimage",a:"createlink",ul:"insertunorderedlist",ol:"insertorderedlist"},NC_KEYS:{8:"backspace",9:"tab",13:"enter",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",46:"delete"},USE:["node","selector-css3","editor-selection","stylesheet"],NAME:"editorBase",STRINGS:{title:"Rich Text Editor"},ATTRS:{content:{validator:n.isString,value:'<br class="yui-cursor">',setter:function(t){return t.substr(0,1)==="\n"&&(t=t.substr(1)),t===""&&(t='<br class="yui-cursor">'),t===" "&&e.UA.gecko&&(t='<br class="yui-cursor">'),this.frame.set("content",t)},getter:function(){return this.frame.get("content")}},dir:{validator:n.isString,writeOnce:!0,value:"ltr"},linkedcss:{validator:"_validateLinkedCSS",value:"",setter:function(e){return this.frame&&this.frame.set("linkedcss",e),e}},extracss:{validator:n.isString,value:"",setter:function(e){return this.frame&&this.frame.set("extracss",e),e}},defaultblock:{validator:n.isString,value:"p"}}}),e.EditorBase=r},"@VERSION@",{requires:["base","frame","node","exec-command","editor-selection"]});
