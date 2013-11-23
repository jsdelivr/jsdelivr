/*
Ext JS 4.1 - JavaScript Library
Copyright (c) 2006-2012, Sencha Inc.
All rights reserved.
licensing@sencha.com

http://www.sencha.com/license

Open Source License
------------------------------------------------------------------------------------------
This version of Ext JS is licensed under the terms of the Open Source GPL 3.0 license. 

http://www.gnu.org/licenses/gpl.html

There are several FLOSS exceptions available for use with this release for
open source applications that are distributed under a license other than GPL.

* Open Source License Exception for Applications

  http://www.sencha.com/products/floss-exception.php

* Open Source License Exception for Development

  http://www.sencha.com/products/ux-exception.php


Alternate Licensing
------------------------------------------------------------------------------------------
Commercial and OEM Licenses are available for an alternate download of Ext JS.
This is the appropriate option if you are creating proprietary applications and you are 
not prepared to distribute and share the source code of your application under the 
GPL v3 license. Please visit http://www.sencha.com/license for more details.

--

This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT OF THIRD-PARTY INTELLECTUAL PROPERTY RIGHTS.  See the GNU General Public License for more details.
*/
/*
Ext JS 4.1 - JavaScript Library
Copyright (c) 2006-2012, Sencha Inc.
All rights reserved.
licensing@sencha.com

http://www.sencha.com/license

Open Source License
------------------------------------------------------------------------------------------
This version of Ext JS is licensed under the terms of the Open Source GPL 3.0 license. 

http://www.gnu.org/licenses/gpl.html

There are several FLOSS exceptions available for use with this release for
open source applications that are distributed under a license other than GPL.

* Open Source License Exception for Applications

  http://www.sencha.com/products/floss-exception.php

* Open Source License Exception for Development

  http://www.sencha.com/products/ux-exception.php


Alternate Licensing
------------------------------------------------------------------------------------------
Commercial and OEM Licenses are available for an alternate download of Ext JS.
This is the appropriate option if you are creating proprietary applications and you are 
not prepared to distribute and share the source code of your application under the 
GPL v3 license. Please visit http://www.sencha.com/license for more details.

--

This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT OF THIRD-PARTY INTELLECTUAL PROPERTY RIGHTS.  See the GNU General Public License for more details.
*/
/*
Ext JS 4.1 - JavaScript Library
Copyright (c) 2006-2012, Sencha Inc.
All rights reserved.
licensing@sencha.com

http://www.sencha.com/license

Open Source License
------------------------------------------------------------------------------------------
This version of Ext JS is licensed under the terms of the Open Source GPL 3.0 license. 

http://www.gnu.org/licenses/gpl.html

There are several FLOSS exceptions available for use with this release for
open source applications that are distributed under a license other than GPL.

* Open Source License Exception for Applications

  http://www.sencha.com/products/floss-exception.php

* Open Source License Exception for Development

  http://www.sencha.com/products/ux-exception.php


Alternate Licensing
------------------------------------------------------------------------------------------
Commercial and OEM Licenses are available for an alternate download of Ext JS.
This is the appropriate option if you are creating proprietary applications and you are 
not prepared to distribute and share the source code of your application under the 
GPL v3 license. Please visit http://www.sencha.com/license for more details.

--

This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT OF THIRD-PARTY INTELLECTUAL PROPERTY RIGHTS.  See the GNU General Public License for more details.
*/
/*
This file is part of Ext JS 4.1

Copyright (c) 2011-2012 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as
published by the Free Software Foundation and appearing in the file LICENSE included in the
packaging of this file.

Please review the following information to ensure the GNU General Public License version 3.0
requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.sencha.com/contact.

Build date: 2012-07-04 21:11:01 (65ff594cd80b9bad45df640c22cc0adb52c95a7b)
*/
Ext.define("Ext.Neptune.button.Button",{override:"Ext.button.Button",setScale:function(a){this.callParent(arguments);this.removeCls(this.allowedScales);this.addCls(a)}});Ext.define("Ext.Neptune.tab.Bar",{override:"Ext.tab.Bar",onAdd:function(a){a.position=this.dock;a.ui=this.ui;this.callParent(arguments)}});Ext.define("Ext.Neptune.container.ButtonGroup",{override:"Ext.container.ButtonGroup",beforeRender:function(){var a=this;a.callParent();if(a.header){delete a.header.items.items[0].flex}a.callParent(arguments)}});Ext.define("Ext.Neptune.layout.component.field.Trigger",{override:"Ext.layout.component.field.Trigger",sizeBodyContents:function(c,b,f){var d=this,a=d.owner,e=a.getTriggerWidth();if(a.hideTrigger||a.readOnly||e>0){f.inputContext.setProp("width",c,true)}}});Ext.define("Ext.Neptune.menu.Menu",{override:"Ext.menu.Menu",baseCls:Ext.baseCSSPrefix+"menu",initComponent:function(){var a=this;a.addEvents("click","mouseenter","mouseleave","mouseover");Ext.menu.Manager.register(a);if(a.plain){a.cls=Ext.baseCSSPrefix+"menu-plain"}if(!a.layout){a.layout={type:"vbox",align:"stretchmax",overflowHandler:"Scroller"};if(!a.floating){a.layout.align="stretch"}}if(a.floating===false&&a.initialConfig.hidden!==true){a.hidden=false}a.callParent(arguments);a.on("beforeshow",function(){var b=!!a.items.length;if(b&&a.rendered){a.el.setStyle("visibility",null)}return b})}});Ext.define("Ext.Neptune.panel.Tool",{override:"Ext.panel.Tool",renderTpl:['<div id="{id}-toolEl" class="{baseCls}-{type}" role="presentation"></div>']});Ext.define("Ext.Neptune.window.MessageBox",{override:"Ext.window.MessageBox",initComponent:function(){var c=this,b,a;c.title="&#160;";c.topContainer=new Ext.container.Container({anchor:"100%",style:{padding:"10px",overflow:"hidden"},items:[c.iconComponent=new Ext.Component({cls:c.baseCls+"-icon",width:50,height:c.iconHeight,style:{"float":"left"}}),c.promptContainer=new Ext.container.Container({layout:{type:"anchor"},items:[c.msg=new Ext.Component({autoEl:{tag:"span"},cls:c.baseCls+"-text"}),c.textField=new Ext.form.field.Text({anchor:"100%",enableKeyEvents:true,listeners:{keydown:c.onPromptKey,scope:c}}),c.textArea=new Ext.form.field.TextArea({anchor:"100%",height:75})]})]});c.progressBar=new Ext.ProgressBar({anchor:"-10",style:"margin-left:10px"});c.items=[c.topContainer,c.progressBar];c.msgButtons=[];for(b=0;b<4;b++){a=c.makeButton(b);c.msgButtons[a.itemId]=a;c.msgButtons.push(a)}c.bottomTb=new Ext.toolbar.Toolbar({ui:"footer",dock:"bottom",layout:{pack:"end"},items:[c.msgButtons[0],c.msgButtons[1],c.msgButtons[2],c.msgButtons[3]]});c.dockedItems=[c.bottomTb];c.callParent()}});Ext.define("Ext.Neptune.grid.column.Column",{override:"Ext.grid.column.Column",initComponent:function(){var d=this,b,a,c;if(Ext.isDefined(d.header)){d.text=d.header;delete d.header}if(d.flex){d.minWidth=d.minWidth||Ext.grid.plugin.HeaderResizer.prototype.minColWidth}if(!d.triStateSort){d.possibleSortStates.length=2}if(Ext.isDefined(d.columns)){d.isGroupHeader=true;if(d.dataIndex){Ext.Error.raise("Ext.grid.column.Column: Group header may not accept a dataIndex")}if((d.width&&d.width!==Ext.grid.header.Container.prototype.defaultWidth)||d.flex){Ext.Error.raise("Ext.grid.column.Column: Group header does not support setting explicit widths or flexs. The group header width is calculated by the sum of its children.")}d.items=d.columns;delete d.columns;delete d.flex;delete d.width;d.cls=(d.cls||"")+" "+Ext.baseCSSPrefix+"group-header";d.sortable=false;d.resizable=false;d.align="center"}else{d.isContainer=false}d.addCls(Ext.baseCSSPrefix+"column-header-align-"+d.align);if(d.sortable){d.addCls(Ext.baseCSSPrefix+"column-header-sortable")}Ext.grid.column.Column.superclass.initComponent.call(this,arguments);d.on({element:"el",click:d.onElClick,dblclick:d.onElDblClick,scope:d});d.on({element:"titleEl",mouseenter:d.onTitleMouseOver,mouseleave:d.onTitleMouseOut,scope:d})}});Ext.define("Ext.Neptune.Shadow",{override:"Ext.Shadow",offset:3});Ext.define("Ext.Neptune.layout.container.Accordion",{override:"Ext.layout.container.Accordion",targetCls:Ext.baseCSSPrefix+"box-layout-ct "+Ext.baseCSSPrefix+"accordion-body",collapseFirst:true,beforeRenderItems:function(b){var e=this,d=b.length,c,a;for(c=0;c<d;c++){a=b[c];if(!a.rendered){a.on({beforerender:e.onChildPanelRender,single:true});if(e.collapseFirst){a.collapseFirst=e.collapseFirst}if(e.hideCollapseTool){a.hideCollapseTool=e.hideCollapseTool;a.titleCollapse=true}else{if(e.titleCollapse){a.titleCollapse=e.titleCollapse}}delete a.hideHeader;delete a.width;a.collapsible=true;a.title=a.title||"&#160;";a.toolsFirst=true;a.addBodyCls(Ext.baseCSSPrefix+"accordion-body");if(e.fill){if(e.expandedItem!==undefined){a.collapsed=true}else{if(a.hasOwnProperty("collapsed")&&a.collapsed===false){e.expandedItem=c}else{a.collapsed=true}}e.owner.mon(a,{show:e.onComponentShow,beforeexpand:e.onComponentExpand,beforecollapse:e.onComponentCollapse,scope:e})}else{a.animCollapse=e.initialAnimate;a.autoScroll=false}a.border=a.collapsed}}if(d&&e.expandedItem===undefined){e.expandedItem=0;a=b[0];a.collapsed=a.border=false}}});Ext.define("Ext.Neptune.panel.Header",{override:"Ext.panel.Header",toolsFirst:false,initComponent:function(){var b=this,e,d,a,c,f;b.indicateDragCls=b.baseCls+"-draggable";b.title=b.title||"&#160;";b.tools=b.tools||[];b.items=b.items||[];b.orientation=b.orientation||"horizontal";b.dock=(b.dock)?b.dock:(b.orientation=="horizontal")?"top":"left";b.addClsWithUI([b.orientation,b.dock]);if(b.indicateDrag){b.addCls(b.indicateDragCls)}if(!Ext.isEmpty(b.iconCls)){b.initIconCmp();b.items.push(b.iconCmp)}if(b.orientation=="vertical"){b.layout={type:"vbox",align:"center"};b.textConfig={width:15,cls:b.baseCls+"-text",type:"text",text:b.title,rotate:{degrees:90}};c=b.ui;if(Ext.isArray(c)){c=c[0]}e="."+b.baseCls+"-text-"+c;if(Ext.scopeResetCSS){e="."+Ext.baseCSSPrefix+"reset "+e}d=Ext.util.CSS.getRule(e);if(d){a=d.style}else{a=(f=Ext.getBody().createChild({style:"position:absolute",cls:b.baseCls+"-text-"+c})).getStyles("fontFamily","fontWeight","fontSize","color");f.remove()}if(a){Ext.apply(b.textConfig,{"font-family":a.fontFamily,"font-weight":a.fontWeight,"font-size":a.fontSize,fill:a.color})}b.titleCmp=new Ext.draw.Component({ariaRole:"heading",focusable:false,viewBox:false,flex:1,id:b.id+"_hd",autoSize:true,margins:"5 0 0 0",items:[b.textConfig],xhooks:{setSize:function(g){this.callParent([g])}},childEls:[{name:"textEl",select:"."+b.baseCls+"-text"}]})}else{b.layout={type:"hbox",align:"middle"};b.titleCmp=new Ext.Component({xtype:"component",ariaRole:"heading",focusable:false,noWrap:true,flex:1,id:b.id+"_hd",cls:b.baseCls+"-text-container",renderTpl:b.getTpl("headingTpl"),renderData:{title:b.title,cls:b.baseCls,ui:b.ui},childEls:["textEl"]})}if(b.toolsFirst){b.addCls(b.baseCls+"-tools-first");b.items=b.items.concat(b.tools);b.items.push(b.titleCmp)}else{b.items.push(b.titleCmp);b.items=b.items.concat(b.tools)}Ext.panel.Header.superclass.initComponent.call(this,arguments);b.on({click:b.onClick,mouseover:b.onMouseOver,mouseout:b.onMouseOut,mousedown:b.onMouseDown,mouseup:b.onMouseUp,element:"el",scope:b})},onRender:function(){var a=this;a.doc=Ext.getDoc();a.callParent(arguments)},onMouseOver:function(){this.addCls(this.baseCls+"-over")},onMouseOut:function(){this.removeCls(this.baseCls+"-over");this.removeCls(this.baseCls+"-pressed")},onMouseDown:function(){this.addCls(this.baseCls+"-pressed")},onMouseUp:function(a){this.removeCls(this.baseCls+"-pressed")}});Ext.define("Ext.Neptune.panel.Panel",{override:"Ext.panel.Panel",toolsFirst:false,updateHeader:function(b){var a=this,e=a.header,d=a.title,c=a.tools;if(!a.preventHeader&&(b||d||(c&&c.length))){if(e){e.show()}else{e=a.header=new Ext.panel.Header({title:d,orientation:(a.headerPosition=="left"||a.headerPosition=="right")?"vertical":"horizontal",dock:a.headerPosition||"top",textCls:a.headerTextCls,iconCls:a.iconCls,baseCls:a.baseCls+"-header",tools:c,ui:a.ui,id:a.id+"_header",indicateDrag:a.draggable,toolsFirst:a.toolsFirst,border:a.border,frame:a.frame&&a.frameHeader,ignoreParentFrame:a.frame||a.overlapHeader,ignoreBorderManagement:a.frame||a.ignoreHeaderBorderManagement,listeners:a.collapsible&&a.titleCollapse?{click:a.toggleCollapse,scope:a}:null});a.addDocked(e,0);a.tools=e.tools}a.initHeaderAria();a.addCls(a.baseCls+"-hasheader-"+a.headerPosition)}else{if(e){e.hide();a.removeCls(a.baseCls+"-hasheader-"+a.headerPosition)}}}});Ext.define("Ext.Neptune.resizer.Splitter",{override:"Ext.resizer.Splitter",onRender:function(){var a=this;a.callParent(arguments);if(a.performCollapse!==false){if(a.renderData.collapsible){a.mon(a.collapseEl,"click",a.toggleTargetCmp,a)}if(a.collapseOnDblClick){a.mon(a.el,"dblclick",a.toggleTargetCmp,a)}}a.mon(a.getCollapseTarget(),{collapse:a.onTargetCollapse,expand:a.onTargetExpand,scope:a});a.mon(a.el,"mouseover",a.onMouseOver,a);a.mon(a.el,"mouseout",a.onMouseOut,a);a.el.unselectable();a.tracker=Ext.create(a.getTrackerConfig());a.relayEvents(a.tracker,["beforedragstart","dragstart","dragend"])},onMouseOver:function(){this.el.addCls(this.baseCls+"-over")},onMouseOut:function(){this.el.removeCls(this.baseCls+"-over")}});Ext.define("Ext.Neptune.tree.Panel",{override:"Ext.tree.Panel",initComponent:function(){var c=this,b=[c.treeCls],a;if(c.useArrows){b.push(Ext.baseCSSPrefix+"tree-arrows")}else{b.push(Ext.baseCSSPrefix+"tree-no-arrows")}if(c.lines){b.push(Ext.baseCSSPrefix+"tree-lines")}else{b.push(Ext.baseCSSPrefix+"tree-no-lines")}if(Ext.isString(c.store)){c.store=Ext.StoreMgr.lookup(c.store)}else{if(!c.store||Ext.isObject(c.store)&&!c.store.isStore){c.store=new Ext.data.TreeStore(Ext.apply({},c.store||{},{root:c.root,fields:c.fields,model:c.model,folderSort:c.folderSort}))}else{if(c.root){c.store=Ext.data.StoreManager.lookup(c.store);c.store.setRootNode(c.root);if(c.folderSort!==undefined){c.store.folderSort=c.folderSort;c.store.sort()}}}}c.viewConfig=Ext.applyIf(c.viewConfig||{},{rootVisible:c.rootVisible,animate:c.enableAnimations,singleExpand:c.singleExpand,node:c.store.getRootNode(),hideHeaders:c.hideHeaders});c.mon(c.store,{scope:c,rootchange:c.onRootChange,clear:c.onClear});c.relayEvents(c.store,["beforeload","load"]);c.store.on({append:c.createRelayer("itemappend"),remove:c.createRelayer("itemremove"),move:c.createRelayer("itemmove"),insert:c.createRelayer("iteminsert"),beforeappend:c.createRelayer("beforeitemappend"),beforeremove:c.createRelayer("beforeitemremove"),beforemove:c.createRelayer("beforeitemmove"),beforeinsert:c.createRelayer("beforeiteminsert"),expand:c.createRelayer("itemexpand"),collapse:c.createRelayer("itemcollapse"),beforeexpand:c.createRelayer("beforeitemexpand"),beforecollapse:c.createRelayer("beforeitemcollapse")});if(!c.columns){if(c.initialConfig.hideHeaders===undefined){c.hideHeaders=true}c.autoWidth=true;c.addCls(Ext.baseCSSPrefix+"autowidth-table");c.columns=[{xtype:"treecolumn",text:"Name",width:Ext.isIE6?null:10000,dataIndex:c.displayField}]}if(c.cls){b.push(c.cls)}c.cls=b.join(" ");Ext.tree.Panel.superclass.initComponent.apply(c,arguments);a=c.getView();if(Ext.isIE6&&c.autoWidth){a.afterRender=Ext.Function.createSequence(a.afterRender,function(){this.stretcher=a.el.down("th").createChild({style:"height:0px;width:"+(this.getWidth()-Ext.getScrollbarSize().width)+"px"})});a.afterComponentLayout=Ext.Function.createSequence(a.afterComponentLayout,function(){this.stretcher.setWidth((this.getWidth()-Ext.getScrollbarSize().width))})}c.relayEvents(a,["checkchange","afteritemexpand","afteritemcollapse"]);if(!a.rootVisible&&!c.getRootNode()){c.setRootNode({expanded:true})}}});