(function(Clazz
,Clazz_getClassName
,Clazz_newLongArray
,Clazz_doubleToByte
,Clazz_doubleToInt
,Clazz_doubleToLong
,Clazz_declarePackage
,Clazz_instanceOf
,Clazz_load
,Clazz_instantialize
,Clazz_decorateAsClass
,Clazz_floatToInt
,Clazz_floatToLong
,Clazz_makeConstructor
,Clazz_defineEnumConstant
,Clazz_exceptionOf
,Clazz_newIntArray
,Clazz_defineStatics
,Clazz_newFloatArray
,Clazz_declareType
,Clazz_prepareFields
,Clazz_superConstructor
,Clazz_newByteArray
,Clazz_declareInterface
,Clazz_p0p
,Clazz_pu$h
,Clazz_newShortArray
,Clazz_innerTypeInstance
,Clazz_isClassDefined
,Clazz_prepareCallback
,Clazz_newArray
,Clazz_castNullAs
,Clazz_floatToShort
,Clazz_superCall
,Clazz_decorateAsType
,Clazz_newBooleanArray
,Clazz_newCharArray
,Clazz_implementOf
,Clazz_newDoubleArray
,Clazz_overrideConstructor
,Clazz_clone
,Clazz_doubleToShort
,Clazz_getInheritedLevel
,Clazz_getParamsType
,Clazz_isAF
,Clazz_isAB
,Clazz_isAI
,Clazz_isAS
,Clazz_isASS
,Clazz_isAP
,Clazz_isAFloat
,Clazz_isAII
,Clazz_isAFF
,Clazz_isAFFF
,Clazz_tryToSearchAndExecute
,Clazz_getStackTrace
,Clazz_inheritArgs
,Clazz_alert
,Clazz_defineMethod
,Clazz_overrideMethod
,Clazz_declareAnonymous
//,Clazz_checkPrivateMethod
,Clazz_cloneFinals
){
var $t$;
//var c$;
Clazz_declarePackage ("javajs.awt");
Clazz_load (["javajs.awt.LayoutManager"], "javajs.awt.BorderLayout", null, function () {
c$ = Clazz_declareType (javajs.awt, "BorderLayout", javajs.awt.LayoutManager);
Clazz_defineStatics (c$,
"CENTER", "Center",
"NORTH", "North",
"SOUTH", "South",
"EAST", "East",
"WEST", "West");
});
Clazz_declarePackage ("javajs.awt");
Clazz_load (null, "javajs.awt.Component", ["JU.CU"], function () {
c$ = Clazz_decorateAsClass (function () {
this._visible = false;
this.enabled = true;
this.text = null;
this.name = null;
this.width = 0;
this.height = 0;
this.id = null;
this.parent = null;
this.mouseListener = null;
this.bgcolor = null;
this.minWidth = 30;
this.minHeight = 30;
this.renderWidth = 0;
this.renderHeight = 0;
Clazz_instantialize (this, arguments);
}, javajs.awt, "Component");
Clazz_defineMethod (c$, "setParent", 
function (p) {
this.parent = p;
}, "~O");
Clazz_makeConstructor (c$, 
function (type) {
this.id = javajs.awt.Component.newID (type);
if (type == null) return;
{
SwingController.register(this, type);
}}, "~S");
c$.newID = Clazz_defineMethod (c$, "newID", 
function (type) {
return type + ("" + Math.random ()).substring (3, 10);
}, "~S");
Clazz_defineMethod (c$, "setBackground", 
function (color) {
this.bgcolor = color;
}, "javajs.api.GenericColor");
Clazz_defineMethod (c$, "setText", 
function (text) {
this.text = text;
{
SwingController.setText(this);
}}, "~S");
Clazz_defineMethod (c$, "setName", 
function (name) {
this.name = name;
}, "~S");
Clazz_defineMethod (c$, "getName", 
function () {
return this.name;
});
Clazz_defineMethod (c$, "getParent", 
function () {
return this.parent;
});
Clazz_defineMethod (c$, "setPreferredSize", 
function (dimension) {
this.width = dimension.width;
this.height = dimension.height;
}, "javajs.awt.Dimension");
Clazz_defineMethod (c$, "addMouseListener", 
function (listener) {
this.mouseListener = listener;
}, "~O");
Clazz_defineMethod (c$, "getText", 
function () {
return this.text;
});
Clazz_defineMethod (c$, "isEnabled", 
function () {
return this.enabled;
});
Clazz_defineMethod (c$, "setEnabled", 
function (enabled) {
this.enabled = enabled;
{
SwingController.setEnabled(this);
}}, "~B");
Clazz_defineMethod (c$, "isVisible", 
function () {
return this._visible;
});
Clazz_defineMethod (c$, "setVisible", 
function (visible) {
this._visible = visible;
{
SwingController.setVisible(this);
}}, "~B");
Clazz_defineMethod (c$, "getHeight", 
function () {
return this.height;
});
Clazz_defineMethod (c$, "getWidth", 
function () {
return this.width;
});
Clazz_defineMethod (c$, "setMinimumSize", 
function (d) {
this.minWidth = d.width;
this.minHeight = d.height;
}, "javajs.awt.Dimension");
Clazz_defineMethod (c$, "getSubcomponentWidth", 
function () {
return this.width;
});
Clazz_defineMethod (c$, "getSubcomponentHeight", 
function () {
return this.height;
});
Clazz_defineMethod (c$, "getCSSstyle", 
function (defaultPercentW, defaultPercentH) {
var width = (this.renderWidth > 0 ? this.renderWidth : this.getSubcomponentWidth ());
var height = (this.renderHeight > 0 ? this.renderHeight : this.getSubcomponentHeight ());
return (width > 0 ? "width:" + width + "px;" : defaultPercentW > 0 ? "width:" + defaultPercentW + "%;" : "") + (height > 0 ? "height:" + height + "px;" : defaultPercentH > 0 ? "height:" + defaultPercentH + "%;" : "") + (this.bgcolor == null ? "" : "background-color:" + JU.CU.toCSSString (this.bgcolor) + ";");
}, "~N,~N");
Clazz_defineMethod (c$, "repaint", 
function () {
});
});
Clazz_declarePackage ("javajs.awt");
Clazz_load (["javajs.awt.Component"], "javajs.awt.Container", ["JU.Lst"], function () {
c$ = Clazz_decorateAsClass (function () {
this.list = null;
this.cList = null;
Clazz_instantialize (this, arguments);
}, javajs.awt, "Container", javajs.awt.Component);
Clazz_defineMethod (c$, "getComponent", 
function (i) {
return this.list.get (i);
}, "~N");
Clazz_defineMethod (c$, "getComponentCount", 
function () {
return (this.list == null ? 0 : this.list.size ());
});
Clazz_defineMethod (c$, "getComponents", 
function () {
if (this.cList == null) {
if (this.list == null) return  new Array (0);
this.cList = this.list.toArray ();
}return this.cList;
});
Clazz_defineMethod (c$, "add", 
function (component) {
return this.addComponent (component);
}, "javajs.awt.Component");
Clazz_defineMethod (c$, "addComponent", 
function (component) {
if (this.list == null) this.list =  new JU.Lst ();
this.list.addLast (component);
this.cList = null;
component.parent = this;
return component;
}, "javajs.awt.Component");
Clazz_defineMethod (c$, "insertComponent", 
function (component, index) {
if (this.list == null) return this.addComponent (component);
this.list.add (index, component);
this.cList = null;
component.parent = this;
return component;
}, "javajs.awt.Component,~N");
Clazz_defineMethod (c$, "remove", 
function (i) {
var c = this.list.removeItemAt (i);
c.parent = null;
this.cList = null;
}, "~N");
Clazz_defineMethod (c$, "removeAll", 
function () {
if (this.list != null) {
for (var i = this.list.size (); --i >= 0; ) this.list.get (i).parent = null;

this.list.clear ();
}this.cList = null;
});
Clazz_defineMethod (c$, "getSubcomponentWidth", 
function () {
return (this.list != null && this.list.size () == 1 ? this.list.get (0).getSubcomponentWidth () : 0);
});
Clazz_defineMethod (c$, "getSubcomponentHeight", 
function () {
return (this.list != null && this.list.size () == 1 ? this.list.get (0).getSubcomponentHeight () : 0);
});
});
Clazz_declarePackage ("javajs.awt");
c$ = Clazz_declareType (javajs.awt, "LayoutManager");
Clazz_declarePackage ("javajs.awt.event");
Clazz_load (["javajs.awt.event.Event"], "javajs.awt.event.ActionEvent", null, function () {
c$ = Clazz_decorateAsClass (function () {
this.actionCommand = null;
Clazz_instantialize (this, arguments);
}, javajs.awt.event, "ActionEvent", javajs.awt.event.Event);
Clazz_defineMethod (c$, "getActionCommand", 
function () {
return this.actionCommand;
});
});
Clazz_declarePackage ("javajs.awt.event");
Clazz_load (["javajs.awt.event.Event"], "javajs.awt.event.ItemEvent", null, function () {
c$ = Clazz_declareType (javajs.awt.event, "ItemEvent", javajs.awt.event.Event);
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.api.SC", "javajs.swing.JComponent"], "javajs.swing.AbstractButton", null, function () {
c$ = Clazz_decorateAsClass (function () {
this.itemListener = null;
this.applet = null;
this.htmlName = null;
this.selected = false;
this.popupMenu = null;
this.icon = null;
Clazz_instantialize (this, arguments);
}, javajs.swing, "AbstractButton", javajs.swing.JComponent, javajs.api.SC);
Clazz_makeConstructor (c$, 
function (type) {
Clazz_superConstructor (this, javajs.swing.AbstractButton, [type]);
this.enabled = true;
}, "~S");
Clazz_overrideMethod (c$, "setSelected", 
function (selected) {
this.selected = selected;
{
SwingController.setSelected(this);
}}, "~B");
Clazz_overrideMethod (c$, "isSelected", 
function () {
return this.selected;
});
Clazz_overrideMethod (c$, "addItemListener", 
function (listener) {
this.itemListener = listener;
}, "~O");
Clazz_overrideMethod (c$, "getIcon", 
function () {
return this.icon;
});
Clazz_overrideMethod (c$, "setIcon", 
function (icon) {
this.icon = icon;
}, "~O");
Clazz_overrideMethod (c$, "init", 
function (text, icon, actionCommand, popupMenu) {
this.text = text;
this.icon = icon;
this.actionCommand = actionCommand;
this.popupMenu = popupMenu;
{
SwingController.initMenuItem(this);
}}, "~S,~O,~S,javajs.api.SC");
Clazz_defineMethod (c$, "getTopPopupMenu", 
function () {
return this.popupMenu;
});
Clazz_defineMethod (c$, "add", 
function (item) {
this.addComponent (item);
}, "javajs.api.SC");
Clazz_overrideMethod (c$, "insert", 
function (subMenu, index) {
this.insertComponent (subMenu, index);
}, "javajs.api.SC,~N");
Clazz_overrideMethod (c$, "getPopupMenu", 
function () {
return null;
});
Clazz_defineMethod (c$, "getMenuHTML", 
function () {
var label = (this.icon != null ? this.icon : this.text != null ? this.text : null);
var s = (label == null ? "" : "<li><a>" + label + "</a>" + this.htmlMenuOpener ("ul"));
var n = this.getComponentCount ();
if (n > 0) for (var i = 0; i < n; i++) s += this.getComponent (i).toHTML ();

if (label != null) s += "</ul></li>";
return s;
});
Clazz_defineMethod (c$, "htmlMenuOpener", 
function (type) {
return "<" + type + " id=\"" + this.id + "\"" + (this.enabled ? "" : this.getHtmlDisabled ()) + ">";
}, "~S");
Clazz_defineMethod (c$, "getHtmlDisabled", 
function () {
return " disabled=\"disabled\"";
});
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.swing.TableColumn"], "javajs.swing.AbstractTableModel", null, function () {
Clazz_declareInterface (javajs.swing, "AbstractTableModel", javajs.swing.TableColumn);
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (null, "javajs.swing.ButtonGroup", ["javajs.awt.Component"], function () {
c$ = Clazz_decorateAsClass (function () {
this.id = null;
Clazz_instantialize (this, arguments);
}, javajs.swing, "ButtonGroup");
Clazz_makeConstructor (c$, 
function () {
this.id = javajs.awt.Component.newID ("bg");
});
Clazz_defineMethod (c$, "add", 
function (item) {
(item).htmlName = this.id;
}, "javajs.api.SC");
});
Clazz_declarePackage ("javajs.swing");
c$ = Clazz_decorateAsClass (function () {
this.component = null;
this.colspan = 0;
this.rowspan = 0;
this.textAlign = 0;
this.c = null;
Clazz_instantialize (this, arguments);
}, javajs.swing, "Cell");
Clazz_makeConstructor (c$, 
function (btn, c) {
this.component = btn;
this.colspan = c.gridwidth;
this.rowspan = c.gridheight;
this.c = c;
}, "javajs.swing.JComponent,javajs.swing.GridBagConstraints");
Clazz_defineMethod (c$, "toHTML", 
function (id) {
var style = this.c.getStyle (false);
return "<td id='" + id + "' " + (this.colspan < 2 ? "" : "colspan='" + this.colspan + "' ") + style + "><span " + this.c.getStyle (true) + ">" + this.component.toHTML () + "</span></td>";
}, "~S");
Clazz_declarePackage ("javajs.swing");
Clazz_declareInterface (javajs.swing, "ColumnSelectionModel");
Clazz_declarePackage ("javajs.swing");
Clazz_declareInterface (javajs.swing, "Document");
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.awt.LayoutManager"], "javajs.swing.FlowLayout", null, function () {
c$ = Clazz_declareType (javajs.swing, "FlowLayout", javajs.awt.LayoutManager);
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (null, "javajs.swing.Grid", ["javajs.swing.Cell", "JU.AU", "$.SB"], function () {
c$ = Clazz_decorateAsClass (function () {
this.nrows = 0;
this.ncols = 0;
this.grid = null;
this.renderer = null;
Clazz_instantialize (this, arguments);
}, javajs.swing, "Grid");
Clazz_makeConstructor (c$, 
function (rows, cols) {
this.grid =  Clazz_newArray (0, 0, null);
}, "~N,~N");
Clazz_defineMethod (c$, "add", 
function (btn, c) {
if (c.gridx >= this.ncols) {
this.ncols = c.gridx + 1;
for (var i = 0; i < this.nrows; i++) {
this.grid[i] = JU.AU.ensureLength (this.grid[i], this.ncols * 2);
}
}if (c.gridy >= this.nrows) {
var g =  new Array (c.gridy * 2 + 1);
for (var i = 0; i < this.nrows; i++) g[i] = this.grid[i];

for (var i = g.length; --i >= this.nrows; ) g[i] =  new Array (this.ncols * 2 + 1);

this.grid = g;
this.nrows = c.gridy + 1;
}this.grid[c.gridy][c.gridx] =  new javajs.swing.Cell (btn, c);
}, "javajs.swing.JComponent,javajs.swing.GridBagConstraints");
Clazz_defineMethod (c$, "toHTML", 
function (id) {
var sb =  new JU.SB ();
id += "_grid";
sb.append ("\n<table id='" + id + "' class='Grid' style='width:100%;height:100%'><tr><td style='height:20%;width:20%'></td></tr>");
for (var i = 0; i < this.nrows; i++) {
var rowid = id + "_" + i;
sb.append ("\n<tr id='" + rowid + "'><td></td>");
for (var j = 0; j < this.ncols; j++) if (this.grid[i][j] != null) sb.append (this.grid[i][j].toHTML (rowid + "_" + j));

sb.append ("</tr>");
}
sb.append ("\n<tr><td style='height:20%;width:20%'></td></tr></table>\n");
return sb.toString ();
}, "~S");
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (null, "javajs.swing.GridBagConstraints", ["javajs.swing.Insets"], function () {
c$ = Clazz_decorateAsClass (function () {
this.gridx = 0;
this.gridy = 0;
this.gridwidth = 0;
this.gridheight = 0;
this.weightx = 0;
this.weighty = 0;
this.anchor = 0;
this.fill = 0;
this.insets = null;
this.ipadx = 0;
this.ipady = 0;
Clazz_instantialize (this, arguments);
}, javajs.swing, "GridBagConstraints");
Clazz_makeConstructor (c$, 
function (gridx, gridy, gridwidth, gridheight, weightx, weighty, anchor, fill, insets, ipadx, ipady) {
this.gridx = gridx;
this.gridy = gridy;
this.gridwidth = gridwidth;
this.gridheight = gridheight;
this.weightx = weightx;
this.weighty = weighty;
this.anchor = anchor;
this.fill = fill;
if (insets == null) insets =  new javajs.swing.Insets (0, 0, 0, 0);
this.insets = insets;
this.ipadx = ipadx;
this.ipady = ipady;
}, "~N,~N,~N,~N,~N,~N,~N,~N,javajs.swing.Insets,~N,~N");
Clazz_defineMethod (c$, "getStyle", 
function (margins) {
return "style='" + (margins ? "margin:" + this.insets.top + "px " + (this.ipady + this.insets.right) + "px " + this.insets.bottom + "px " + (this.ipadx + this.insets.left) + "px;" : "text-align:" + (this.anchor == 13 ? "right" : this.anchor == 17 ? "left" : "center")) + "'";
}, "~B");
Clazz_defineStatics (c$,
"NONE", 0,
"CENTER", 10,
"WEST", 17,
"EAST", 13);
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.awt.LayoutManager"], "javajs.swing.GridBagLayout", null, function () {
c$ = Clazz_declareType (javajs.swing, "GridBagLayout", javajs.awt.LayoutManager);
});
Clazz_declarePackage ("javajs.swing");
c$ = Clazz_decorateAsClass (function () {
this.top = 0;
this.left = 0;
this.bottom = 0;
this.right = 0;
Clazz_instantialize (this, arguments);
}, javajs.swing, "Insets");
Clazz_makeConstructor (c$, 
function (top, left, bottom, right) {
this.top = top;
this.left = left;
this.bottom = bottom;
this.right = right;
}, "~N,~N,~N,~N");
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.swing.AbstractButton"], "javajs.swing.JButton", ["JU.SB"], function () {
c$ = Clazz_declareType (javajs.swing, "JButton", javajs.swing.AbstractButton);
Clazz_makeConstructor (c$, 
function () {
Clazz_superConstructor (this, javajs.swing.JButton, ["btnJB"]);
});
Clazz_overrideMethod (c$, "toHTML", 
function () {
var sb =  new JU.SB ();
sb.append ("<input type=button id='" + this.id + "' class='JButton' style='" + this.getCSSstyle (80, 0) + "' onclick='SwingController.click(this)' value='" + this.text + "'/>");
return sb.toString ();
});
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.swing.AbstractButton"], "javajs.swing.JCheckBox", null, function () {
c$ = Clazz_declareType (javajs.swing, "JCheckBox", javajs.swing.AbstractButton);
Clazz_makeConstructor (c$, 
function () {
Clazz_superConstructor (this, javajs.swing.JCheckBox, ["chkJCB"]);
});
Clazz_overrideMethod (c$, "toHTML", 
function () {
var s = "<label><input type=checkbox id='" + this.id + "' class='JCheckBox' style='" + this.getCSSstyle (0, 0) + "' " + (this.selected ? "checked='checked' " : "") + "onclick='SwingController.click(this)'>" + this.text + "</label>";
return s;
});
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.swing.JMenuItem"], "javajs.swing.JCheckBoxMenuItem", null, function () {
c$ = Clazz_declareType (javajs.swing, "JCheckBoxMenuItem", javajs.swing.JMenuItem);
Clazz_makeConstructor (c$, 
function () {
Clazz_superConstructor (this, javajs.swing.JCheckBoxMenuItem, ["chk", 2]);
});
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.swing.AbstractButton"], "javajs.swing.JComboBox", ["JU.SB"], function () {
c$ = Clazz_decorateAsClass (function () {
this.info = null;
this.selectedIndex = 0;
Clazz_instantialize (this, arguments);
}, javajs.swing, "JComboBox", javajs.swing.AbstractButton);
Clazz_makeConstructor (c$, 
function (info) {
Clazz_superConstructor (this, javajs.swing.JComboBox, ["cmbJCB"]);
this.info = info;
}, "~A");
Clazz_defineMethod (c$, "setSelectedIndex", 
function (i) {
this.selectedIndex = i;
{
SwingController.setSelectedIndex(this);
}}, "~N");
Clazz_defineMethod (c$, "getSelectedIndex", 
function () {
return this.selectedIndex;
});
Clazz_defineMethod (c$, "getSelectedItem", 
function () {
return (this.selectedIndex < 0 ? null : this.info[this.selectedIndex]);
});
Clazz_overrideMethod (c$, "toHTML", 
function () {
var sb =  new JU.SB ();
sb.append ("\n<select id='" + this.id + "' class='JComboBox' onchange='SwingController.click(this)'>\n");
for (var i = 0; i < this.info.length; i++) sb.append ("\n<option class='JComboBox_option'" + (i == this.selectedIndex ? "selected" : "") + ">" + this.info[i] + "</option>");

sb.append ("\n</select>\n");
return sb.toString ();
});
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.awt.Container"], "javajs.swing.JComponent", null, function () {
c$ = Clazz_decorateAsClass (function () {
this.autoScrolls = false;
this.actionCommand = null;
this.actionListener = null;
Clazz_instantialize (this, arguments);
}, javajs.swing, "JComponent", javajs.awt.Container);
Clazz_defineMethod (c$, "setAutoscrolls", 
function (b) {
this.autoScrolls = b;
}, "~B");
Clazz_defineMethod (c$, "addActionListener", 
function (listener) {
this.actionListener = listener;
}, "~O");
Clazz_defineMethod (c$, "getActionCommand", 
function () {
return this.actionCommand;
});
Clazz_defineMethod (c$, "setActionCommand", 
function (actionCommand) {
this.actionCommand = actionCommand;
}, "~S");
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.swing.JComponent"], "javajs.swing.JComponentImp", null, function () {
c$ = Clazz_declareType (javajs.swing, "JComponentImp", javajs.swing.JComponent);
Clazz_overrideMethod (c$, "toHTML", 
function () {
return null;
});
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.swing.JComponent"], "javajs.swing.JContentPane", ["JU.SB"], function () {
c$ = Clazz_declareType (javajs.swing, "JContentPane", javajs.swing.JComponent);
Clazz_makeConstructor (c$, 
function () {
Clazz_superConstructor (this, javajs.swing.JContentPane, ["JCP"]);
});
Clazz_defineMethod (c$, "toHTML", 
function () {
var sb =  new JU.SB ();
sb.append ("\n<div id='" + this.id + "' class='JContentPane' style='" + this.getCSSstyle (100, 100) + "'>\n");
if (this.list != null) for (var i = 0; i < this.list.size (); i++) sb.append (this.list.get (i).toHTML ());

sb.append ("\n</div>\n");
return sb.toString ();
});
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.awt.Container"], "javajs.swing.JDialog", ["javajs.awt.Color", "javajs.swing.JContentPane", "JU.SB"], function () {
c$ = Clazz_decorateAsClass (function () {
this.defaultWidth = 600;
this.defaultHeight = 300;
this.contentPane = null;
this.title = null;
this.html = null;
this.zIndex = 9000;
this.loc = null;
Clazz_instantialize (this, arguments);
}, javajs.swing, "JDialog", javajs.awt.Container);
Clazz_defineMethod (c$, "setZIndex", 
function (zIndex) {
this.zIndex = zIndex;
}, "~N");
Clazz_makeConstructor (c$, 
function () {
Clazz_superConstructor (this, javajs.swing.JDialog, ["JD"]);
this.add (this.contentPane =  new javajs.swing.JContentPane ());
this.setBackground (javajs.awt.Color.get3 (210, 210, 240));
this.contentPane.setBackground (javajs.awt.Color.get3 (230, 230, 230));
});
Clazz_defineMethod (c$, "setLocation", 
function (loc) {
this.loc = loc;
}, "~A");
Clazz_defineMethod (c$, "getContentPane", 
function () {
return this.contentPane;
});
Clazz_defineMethod (c$, "setTitle", 
function (title) {
this.title = title;
}, "~S");
Clazz_defineMethod (c$, "pack", 
function () {
this.html = null;
});
Clazz_defineMethod (c$, "validate", 
function () {
this.html = null;
});
Clazz_defineMethod (c$, "setVisible", 
function (tf) {
if (tf && this.html == null) this.setDialog ();
Clazz_superCall (this, javajs.swing.JDialog, "setVisible", [tf]);
}, "~B");
Clazz_defineMethod (c$, "dispose", 
function () {
{
{
SwingController.dispose(this);
}}});
Clazz_overrideMethod (c$, "repaint", 
function () {
this.setDialog ();
});
Clazz_defineMethod (c$, "setDialog", 
 function () {
this.html = this.toHTML ();
{
SwingController.setDialog(this);
}});
Clazz_overrideMethod (c$, "toHTML", 
function () {
this.renderWidth = this.getSubcomponentWidth ();
if (this.renderWidth == 0) this.renderWidth = this.defaultWidth;
this.renderHeight = this.contentPane.getSubcomponentHeight ();
if (this.renderHeight == 0) this.renderHeight = this.defaultHeight;
var h = this.renderHeight - 25;
var sb =  new JU.SB ();
sb.append ("\n<div id='" + this.id + "' class='JDialog' style='" + this.getCSSstyle (0, 0) + "z-index:" + this.zIndex + ";position:relative;top:0px;left:0px;reize:both;'>\n");
sb.append ("\n<div id='" + this.id + "_title' class='JDialogTitle' style='width:100%;height:25px;padding:5px 5px 5px 5px;height:" + 25 + "px'>" + "<span style='text-align:center;'>" + this.title + "</span><span style='position:absolute;text-align:right;right:1px;'>" + "<input type=button id='" + this.id + "_closer' onclick='SwingController.windowClosing(this)' value='x' /></span></div>\n");
sb.append ("\n<div id='" + this.id + "_body' class='JDialogBody' style='width:100%;height:" + h + "px;" + "position: relative;left:0px;top:0px'>\n");
sb.append (this.contentPane.toHTML ());
sb.append ("\n</div></div>\n");
return sb.toString ();
});
Clazz_defineStatics (c$,
"headerHeight", 25);
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.swing.JComponent"], "javajs.swing.JEditorPane", ["JU.SB"], function () {
c$ = Clazz_declareType (javajs.swing, "JEditorPane", javajs.swing.JComponent);
Clazz_makeConstructor (c$, 
function () {
Clazz_superConstructor (this, javajs.swing.JEditorPane, ["txtJEP"]);
this.text = "";
});
Clazz_overrideMethod (c$, "toHTML", 
function () {
var sb =  new JU.SB ();
sb.append ("<textarea type=text id='" + this.id + "' class='JEditorPane' style='" + this.getCSSstyle (98, 98) + "'>" + this.text + "</textarea>");
return sb.toString ();
});
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.swing.JComponent"], "javajs.swing.JLabel", ["JU.SB"], function () {
c$ = Clazz_declareType (javajs.swing, "JLabel", javajs.swing.JComponent);
Clazz_makeConstructor (c$, 
function (text) {
Clazz_superConstructor (this, javajs.swing.JLabel, ["lblJL"]);
this.text = text;
}, "~S");
Clazz_overrideMethod (c$, "toHTML", 
function () {
var sb =  new JU.SB ();
sb.append ("<span id='" + this.id + "' class='JLabel' style='" + this.getCSSstyle (0, 0) + "'>");
sb.append (this.text);
sb.append ("</span>");
return sb.toString ();
});
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.swing.JMenuItem"], "javajs.swing.JMenu", null, function () {
c$ = Clazz_declareType (javajs.swing, "JMenu", javajs.swing.JMenuItem);
Clazz_makeConstructor (c$, 
function () {
Clazz_superConstructor (this, javajs.swing.JMenu, ["mnu", 4]);
});
Clazz_defineMethod (c$, "getItemCount", 
function () {
return this.getComponentCount ();
});
Clazz_defineMethod (c$, "getItem", 
function (i) {
return this.getComponent (i);
}, "~N");
Clazz_overrideMethod (c$, "getPopupMenu", 
function () {
return this;
});
Clazz_overrideMethod (c$, "toHTML", 
function () {
return this.getMenuHTML ();
});
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.swing.AbstractButton"], "javajs.swing.JMenuItem", null, function () {
c$ = Clazz_decorateAsClass (function () {
this.btnType = 0;
Clazz_instantialize (this, arguments);
}, javajs.swing, "JMenuItem", javajs.swing.AbstractButton);
Clazz_makeConstructor (c$, 
function (text) {
Clazz_superConstructor (this, javajs.swing.JMenuItem, ["btn"]);
this.setText (text);
this.btnType = (text == null ? 0 : 1);
}, "~S");
Clazz_makeConstructor (c$, 
function (type, i) {
Clazz_superConstructor (this, javajs.swing.JMenuItem, [type]);
this.btnType = i;
}, "~S,~N");
Clazz_overrideMethod (c$, "toHTML", 
function () {
return this.htmlMenuOpener ("li") + (this.text == null ? "" : "<a>" + this.htmlLabel () + "</a>") + "</li>";
});
Clazz_overrideMethod (c$, "getHtmlDisabled", 
function () {
return " class=\"ui-state-disabled\"";
});
Clazz_defineMethod (c$, "htmlLabel", 
 function () {
return (this.btnType == 1 ? this.text : "<label><input id=\"" + this.id + "-" + (this.btnType == 3 ? "r" : "c") + "b\" type=\"" + (this.btnType == 3 ? "radio\" name=\"" + this.htmlName : "checkbox") + "\" " + (this.selected ? "checked" : "") + " />" + this.text + "</label>");
});
Clazz_defineStatics (c$,
"TYPE_SEPARATOR", 0,
"TYPE_BUTTON", 1,
"TYPE_CHECKBOX", 2,
"TYPE_RADIO", 3,
"TYPE_MENU", 4);
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.swing.JComponent"], "javajs.swing.JPanel", ["javajs.swing.Grid", "$.GridBagConstraints", "JU.SB"], function () {
c$ = Clazz_decorateAsClass (function () {
this.grid = null;
this.nElements = 0;
this.last = null;
Clazz_instantialize (this, arguments);
}, javajs.swing, "JPanel", javajs.swing.JComponent);
Clazz_makeConstructor (c$, 
function (manager) {
Clazz_superConstructor (this, javajs.swing.JPanel, ["JP"]);
this.grid =  new javajs.swing.Grid (10, 10);
}, "javajs.awt.LayoutManager");
Clazz_defineMethod (c$, "add", 
function (btn, c) {
this.last = (++this.nElements == 1 ? btn : null);
if (Clazz_instanceOf (c, String)) {
if (c.equals ("North")) c =  new javajs.swing.GridBagConstraints (0, 0, 3, 1, 0, 0, 10, 0, null, 0, 0);
 else if (c.equals ("South")) c =  new javajs.swing.GridBagConstraints (0, 2, 3, 1, 0, 0, 10, 0, null, 0, 0);
 else if (c.equals ("East")) c =  new javajs.swing.GridBagConstraints (2, 1, 1, 1, 0, 0, 13, 0, null, 0, 0);
 else if (c.equals ("West")) c =  new javajs.swing.GridBagConstraints (0, 1, 1, 1, 0, 0, 17, 0, null, 0, 0);
 else c =  new javajs.swing.GridBagConstraints (1, 1, 1, 1, 0, 0, 10, 0, null, 0, 0);
}this.grid.add (btn, c);
}, "javajs.swing.JComponent,~O");
Clazz_overrideMethod (c$, "toHTML", 
function () {
if (this.last != null) {
this.grid =  new javajs.swing.Grid (1, 1);
this.grid.add (this.last,  new javajs.swing.GridBagConstraints (0, 0, 1, 1, 0, 0, 10, 0, null, 0, 0));
this.last = null;
}var sb =  new JU.SB ();
sb.append ("\n<div id='" + this.id + "' class='JPanel' style='" + this.getCSSstyle (100, 100) + "'>\n");
sb.append ("\n<span id='" + this.id + "_minimizer' style='width:" + this.minWidth + "px;height:" + this.minHeight + "px;'>");
sb.append (this.grid.toHTML (this.id));
sb.append ("</span>");
sb.append ("\n</div>\n");
return sb.toString ();
});
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.swing.AbstractButton"], "javajs.swing.JPopupMenu", null, function () {
c$ = Clazz_decorateAsClass (function () {
this.tainted = true;
Clazz_instantialize (this, arguments);
}, javajs.swing, "JPopupMenu", javajs.swing.AbstractButton);
Clazz_makeConstructor (c$, 
function (name) {
Clazz_superConstructor (this, javajs.swing.JPopupMenu, ["mnu"]);
this.name = name;
}, "~S");
Clazz_defineMethod (c$, "setInvoker", 
function (applet) {
this.applet = applet;
{
SwingController.setMenu(this);
}}, "~O");
Clazz_defineMethod (c$, "show", 
function (applet, x, y) {
{
if (applet != null)
this.tainted = true;
SwingController.showMenu(this, x, y);
}}, "javajs.awt.Component,~N,~N");
Clazz_defineMethod (c$, "disposeMenu", 
function () {
{
SwingController.disposeMenu(this);
}});
Clazz_overrideMethod (c$, "toHTML", 
function () {
return this.getMenuHTML ();
});
{
{
SwingController.setDraggable(javajs.swing.JPopupMenu);
}}});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.swing.JMenuItem"], "javajs.swing.JRadioButtonMenuItem", null, function () {
c$ = Clazz_decorateAsClass (function () {
this.isRadio = true;
Clazz_instantialize (this, arguments);
}, javajs.swing, "JRadioButtonMenuItem", javajs.swing.JMenuItem);
Clazz_makeConstructor (c$, 
function () {
Clazz_superConstructor (this, javajs.swing.JRadioButtonMenuItem, ["rad", 3]);
});
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.swing.JComponent"], "javajs.swing.JScrollPane", ["JU.SB"], function () {
c$ = Clazz_declareType (javajs.swing, "JScrollPane", javajs.swing.JComponent);
Clazz_makeConstructor (c$, 
function (component) {
Clazz_superConstructor (this, javajs.swing.JScrollPane, ["JScP"]);
this.add (component);
}, "javajs.swing.JComponent");
Clazz_defineMethod (c$, "toHTML", 
function () {
var sb =  new JU.SB ();
sb.append ("\n<div id='" + this.id + "' class='JScrollPane' style='" + this.getCSSstyle (98, 98) + "overflow:auto'>\n");
if (this.list != null) {
var c = this.list.get (0);
sb.append (c.toHTML ());
}sb.append ("\n</div>\n");
return sb.toString ();
});
Clazz_overrideMethod (c$, "setMinimumSize", 
function (dimension) {
}, "javajs.awt.Dimension");
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.swing.JComponent"], "javajs.swing.JSplitPane", ["javajs.swing.JComponentImp", "JU.SB"], function () {
c$ = Clazz_decorateAsClass (function () {
this.isH = true;
this.split = 1;
this.right = null;
this.left = null;
Clazz_instantialize (this, arguments);
}, javajs.swing, "JSplitPane", javajs.swing.JComponent);
Clazz_makeConstructor (c$, 
function (split) {
Clazz_superConstructor (this, javajs.swing.JSplitPane, ["JSpP"]);
this.split = split;
this.isH = (split == 1);
}, "~N");
Clazz_defineMethod (c$, "setRightComponent", 
function (r) {
this.right =  new javajs.swing.JComponentImp (null);
this.right.add (r);
}, "javajs.swing.JComponent");
Clazz_defineMethod (c$, "setLeftComponent", 
function (l) {
this.left =  new javajs.swing.JComponentImp (null);
this.left.add (l);
}, "javajs.swing.JComponent");
Clazz_defineMethod (c$, "getSubcomponentWidth", 
function () {
var w = this.width;
if (w == 0) {
var wleft = this.left.getSubcomponentWidth ();
var wright = this.right.getSubcomponentWidth ();
if (wleft > 0 && wright > 0) {
if (this.isH) w = wleft + wright;
 else w = Math.max (wleft, wright);
}}return w;
});
Clazz_defineMethod (c$, "getSubcomponentHeight", 
function () {
var h = this.height;
if (h == 0) {
var hleft = this.left.getSubcomponentHeight ();
var hright = this.right.getSubcomponentHeight ();
if (hleft > 0 && hright > 0) {
if (this.isH) h = Math.max (hleft, hright);
 else h = hleft + hright;
}}return h;
});
Clazz_defineMethod (c$, "toHTML", 
function () {
if (this.left == null || this.right == null) return "";
var isH = (this.split == 1);
if (this.width == 0) this.width = this.getSubcomponentWidth ();
if (this.height == 0) this.height = this.getSubcomponentHeight ();
var sb =  new JU.SB ();
sb.append ("<div id='" + this.id + "' class='JSplitPane' style='" + this.getCSSstyle (100, 100) + "'>");
if (isH) sb.append ("<div id='" + this.id + "_left' style='width:50%;height:100%;position:absolute;top:0%;left:0%'>");
 else sb.append ("<div id='" + this.id + "_top' style='width:100%;height:50%;position:absolute;top:0%;left:0%'>");
sb.append (this.left.getComponents ()[0].toHTML ());
if (isH) sb.append ("</div><div id='" + this.id + "_right' style='width:50%;height:100%;position:absolute;top:0%;left:50%'>");
 else sb.append ("</div><div id='" + this.id + "_bottom' style='width:100%;height:50%;position:absolute;top:50%;left:0%'>");
sb.append (this.right.getComponents ()[0].toHTML ());
sb.append ("</div></div>\n");
return sb.toString ();
});
Clazz_defineStatics (c$,
"HORIZONTAL_SPLIT", 1);
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.swing.ColumnSelectionModel", "$.JComponent", "$.ListSelectionModel"], "javajs.swing.JTable", ["JU.BS", "$.SB"], function () {
c$ = Clazz_decorateAsClass (function () {
this.tableModel = null;
this.bsSelectedCells = null;
this.bsSelectedRows = null;
this.rowSelectionAllowed = false;
this.cellSelectionEnabled = false;
this.selectionListener = null;
Clazz_instantialize (this, arguments);
}, javajs.swing, "JTable", javajs.swing.JComponent, [javajs.swing.ListSelectionModel, javajs.swing.ColumnSelectionModel]);
Clazz_makeConstructor (c$, 
function (tableModel) {
Clazz_superConstructor (this, javajs.swing.JTable, ["JT"]);
this.tableModel = tableModel;
this.bsSelectedCells =  new JU.BS ();
this.bsSelectedRows =  new JU.BS ();
}, "javajs.swing.AbstractTableModel");
Clazz_overrideMethod (c$, "getSelectionModel", 
function () {
return this;
});
Clazz_defineMethod (c$, "getColumnModel", 
function () {
return this;
});
Clazz_defineMethod (c$, "setPreferredScrollableViewportSize", 
function (dimension) {
this.width = dimension.width;
this.height = dimension.height;
}, "javajs.awt.Dimension");
Clazz_defineMethod (c$, "clearSelection", 
function () {
this.bsSelectedCells.clearAll ();
this.bsSelectedRows.clearAll ();
});
Clazz_defineMethod (c$, "setRowSelectionAllowed", 
function (b) {
this.rowSelectionAllowed = b;
}, "~B");
Clazz_defineMethod (c$, "setRowSelectionInterval", 
function (i, j) {
this.bsSelectedRows.clearAll ();
this.bsSelectedRows.setBits (i, j);
this.bsSelectedCells.clearAll ();
}, "~N,~N");
Clazz_defineMethod (c$, "setCellSelectionEnabled", 
function (enabled) {
this.cellSelectionEnabled = enabled;
}, "~B");
Clazz_overrideMethod (c$, "addListSelectionListener", 
function (listener) {
this.selectionListener = listener;
}, "~O");
Clazz_overrideMethod (c$, "getColumn", 
function (i) {
return this.tableModel.getColumn (i);
}, "~N");
Clazz_overrideMethod (c$, "toHTML", 
function () {
var sb =  new JU.SB ();
sb.append ("\n<table id='" + this.id + "_table' class='JTable' >");
this.tableModel.toHTML (sb, this.id, this.bsSelectedRows);
sb.append ("\n</table>\n");
return sb.toString ();
});
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.swing.JComponent"], "javajs.swing.JTextField", ["JU.SB"], function () {
c$ = Clazz_declareType (javajs.swing, "JTextField", javajs.swing.JComponent);
Clazz_makeConstructor (c$, 
function (value) {
Clazz_superConstructor (this, javajs.swing.JTextField, ["txtJT"]);
this.text = value;
}, "~S");
Clazz_overrideMethod (c$, "toHTML", 
function () {
var sb =  new JU.SB ();
sb.append ("<input type=text id='" + this.id + "' class='JTextField' style='" + this.getCSSstyle (0, 0) + "' value='" + this.text + "' onkeyup	=SwingController.click(this,event)	>");
return sb.toString ();
});
});
Clazz_declarePackage ("javajs.swing");
Clazz_load (["javajs.swing.Document", "$.JComponent"], "javajs.swing.JTextPane", ["JU.SB"], function () {
c$ = Clazz_declareType (javajs.swing, "JTextPane", javajs.swing.JComponent, javajs.swing.Document);
Clazz_makeConstructor (c$, 
function () {
Clazz_superConstructor (this, javajs.swing.JTextPane, ["txtJTP"]);
this.text = "";
});
Clazz_defineMethod (c$, "getDocument", 
function () {
return this;
});
Clazz_overrideMethod (c$, "insertString", 
function (i, s, object) {
i = Math.min (i, this.text.length);
this.text = this.text.substring (0, i) + s + this.text.substring (i);
}, "~N,~S,~O");
Clazz_overrideMethod (c$, "toHTML", 
function () {
var sb =  new JU.SB ();
sb.append ("<textarea type=text id='" + this.id + "' class='JTextPane' style='" + this.getCSSstyle (98, 98) + "'>" + this.text + "</textarea>");
return sb.toString ();
});
});
Clazz_declarePackage ("javajs.swing");
Clazz_declareInterface (javajs.swing, "ListSelectionModel");
Clazz_declarePackage ("javajs.swing");
c$ = Clazz_declareType (javajs.swing, "SwingConstants");
Clazz_defineStatics (c$,
"LEFT", 2,
"CENTER", 0,
"RIGHT", 4);
Clazz_declarePackage ("javajs.swing");
Clazz_declareInterface (javajs.swing, "TableCellRenderer");
Clazz_declarePackage ("javajs.swing");
Clazz_declareInterface (javajs.swing, "TableColumn");
Clazz_declarePackage ("J.popup");
Clazz_load (["javajs.api.GenericMenuInterface", "java.util.Hashtable", "JU.Lst"], "J.popup.GenericSwingPopup", ["java.util.StringTokenizer", "JU.PT", "$.SB", "JU.Logger"], function () {
c$ = Clazz_decorateAsClass (function () {
this.helper = null;
this.strMenuStructure = null;
this.allowSignedFeatures = false;
this.isJS = false;
this.isApplet = false;
this.isSigned = false;
this.isWebGL = false;
this.thisx = 0;
this.thisy = 0;
this.isTainted = true;
this.menuName = null;
this.popupMenu = null;
this.thisPopup = null;
this.htCheckbox = null;
this.buttonGroup = null;
this.currentMenuItemId = null;
this.htMenus = null;
this.SignedOnly = null;
Clazz_instantialize (this, arguments);
}, J.popup, "GenericSwingPopup", null, javajs.api.GenericMenuInterface);
Clazz_prepareFields (c$, function () {
this.htCheckbox =  new java.util.Hashtable ();
this.htMenus =  new java.util.Hashtable ();
this.SignedOnly =  new JU.Lst ();
});
Clazz_defineMethod (c$, "initSwing", 
function (title, bundle, applet, isJS, isSigned, isWebGL) {
this.isJS = isJS;
this.isApplet = (applet != null);
this.isSigned = isSigned;
this.isWebGL = isWebGL;
this.allowSignedFeatures = (!this.isApplet || isSigned);
this.menuName = title;
this.popupMenu = this.helper.menuCreatePopup (title, applet);
this.thisPopup = this.popupMenu;
this.htMenus.put (title, this.popupMenu);
this.addMenuItems ("", title, this.popupMenu, bundle);
try {
this.jpiUpdateComputedMenus ();
} catch (e) {
if (Clazz_exceptionOf (e, NullPointerException)) {
} else {
throw e;
}
}
}, "~S,J.popup.PopupResource,~O,~B,~B,~B");
Clazz_defineMethod (c$, "addMenuItems", 
function (parentId, key, menu, popupResourceBundle) {
var id = parentId + "." + key;
var value = popupResourceBundle.getStructure (key);
if (JU.Logger.debugging) JU.Logger.debug (id + " --- " + value);
if (value == null) {
this.menuCreateItem (menu, "#" + key, "", "");
return;
}var st =  new java.util.StringTokenizer (value);
var item;
while (value.indexOf ("@") >= 0) {
var s = "";
while (st.hasMoreTokens ()) s += " " + ((item = st.nextToken ()).startsWith ("@") ? popupResourceBundle.getStructure (item) : item);

value = s.substring (1);
st =  new java.util.StringTokenizer (value);
}
while (st.hasMoreTokens ()) {
item = st.nextToken ();
if (!this.checkKey (item)) continue;
if ("-".equals (item)) {
this.menuAddSeparator (menu);
continue;
}var label = popupResourceBundle.getWord (item);
var newItem = null;
var script = "";
var isCB = false;
label = this.appFixLabel (label == null ? item : label);
if (label.equals ("null")) {
continue;
}if (item.indexOf ("Menu") >= 0) {
if (item.indexOf ("more") < 0) this.helper.menuAddButtonGroup (null);
var subMenu = this.menuNewSubMenu (label, id + "." + item);
this.menuAddSubMenu (menu, subMenu);
if (item.indexOf ("Computed") < 0) this.addMenuItems (id, item, subMenu, popupResourceBundle);
this.appCheckSpecialMenu (item, subMenu, label);
newItem = subMenu;
} else if (item.endsWith ("Checkbox") || (isCB = (item.endsWith ("CB") || item.endsWith ("RD")))) {
script = popupResourceBundle.getStructure (item);
var basename = item.substring (0, item.length - (!isCB ? 8 : 2));
var isRadio = (isCB && item.endsWith ("RD"));
if (script == null || script.length == 0 && !isRadio) script = "set " + basename + " T/F";
newItem = this.menuCreateCheckboxItem (menu, label, basename + ":" + script, id + "." + item, false, isRadio);
this.rememberCheckbox (basename, newItem);
if (isRadio) this.helper.menuAddButtonGroup (newItem);
} else {
script = popupResourceBundle.getStructure (item);
if (script == null) script = item;
newItem = this.menuCreateItem (menu, label, script, id + "." + item);
}this.htMenus.put (item, newItem);
if (item.startsWith ("SIGNED")) {
this.SignedOnly.addLast (newItem);
if (!this.allowSignedFeatures) this.menuEnable (newItem, false);
}this.appCheckItem (item, newItem);
}
}, "~S,~S,javajs.api.SC,J.popup.PopupResource");
Clazz_defineMethod (c$, "updateSignedAppletItems", 
function () {
for (var i = this.SignedOnly.size (); --i >= 0; ) this.menuEnable (this.SignedOnly.get (i), this.allowSignedFeatures);

});
Clazz_defineMethod (c$, "checkKey", 
 function (key) {
return (key.indexOf (this.isApplet ? "JAVA" : "APPLET") < 0 && (!this.isWebGL || key.indexOf ("NOGL") < 0));
}, "~S");
Clazz_defineMethod (c$, "rememberCheckbox", 
 function (key, checkboxMenuItem) {
this.htCheckbox.put (key + "::" + this.htCheckbox.size (), checkboxMenuItem);
}, "~S,javajs.api.SC");
Clazz_defineMethod (c$, "updateButton", 
function (b, entry, script) {
var ret =  Clazz_newArray (-1, [entry]);
var icon = this.getEntryIcon (ret);
entry = ret[0];
b.init (entry, icon, script, this.thisPopup);
this.isTainted = true;
}, "javajs.api.SC,~S,~S");
Clazz_defineMethod (c$, "getEntryIcon", 
function (ret) {
var entry = ret[0];
if (!entry.startsWith ("<")) return null;
var pt = entry.indexOf (">");
ret[0] = entry.substring (pt + 1);
var fileName = entry.substring (1, pt);
return this.getImageIcon (fileName);
}, "~A");
Clazz_defineMethod (c$, "addMenuItem", 
function (menuItem, entry) {
return this.menuCreateItem (menuItem, entry, "", null);
}, "javajs.api.SC,~S");
Clazz_defineMethod (c$, "menuSetLabel", 
function (m, entry) {
m.setText (entry);
this.isTainted = true;
}, "javajs.api.SC,~S");
Clazz_defineMethod (c$, "menuSetCheckBoxValue", 
 function (source) {
var isSelected = source.isSelected ();
var what = source.getActionCommand ();
this.checkForCheckBoxScript (source, what, isSelected);
this.appUpdateSpecialCheckBoxValue (source, what, isSelected);
this.isTainted = true;
}, "javajs.api.SC");
Clazz_overrideMethod (c$, "menuClickCallback", 
function (source, script) {
this.processClickCallback (source, script);
}, "javajs.api.SC,~S");
Clazz_defineMethod (c$, "processClickCallback", 
function (source, script) {
this.appRestorePopupMenu ();
if (script == null || script.length == 0) return;
if (script.equals ("MAIN")) {
this.show (this.thisx, this.thisy, true);
return;
}var id = this.menuGetId (source);
if (id != null) {
script = this.appFixScript (id, script);
this.currentMenuItemId = id;
}this.appRunScript (script);
}, "javajs.api.SC,~S");
Clazz_overrideMethod (c$, "menuCheckBoxCallback", 
function (source) {
this.appRestorePopupMenu ();
this.menuSetCheckBoxValue (source);
var id = this.menuGetId (source);
if (id != null) {
this.currentMenuItemId = id;
}}, "javajs.api.SC");
Clazz_defineMethod (c$, "checkForCheckBoxScript", 
 function (item, what, TF) {
if (!item.isEnabled ()) return;
if (what.indexOf ("##") < 0) {
var pt = what.indexOf (":");
if (pt < 0) {
JU.Logger.error ("check box " + item + " IS " + what);
return;
}var basename = what.substring (0, pt);
if (this.appIsSpecialCheckBox (item, basename, what, TF)) return;
what = what.substring (pt + 1);
if ((pt = what.indexOf ("|")) >= 0) what = (TF ? what.substring (0, pt) : what.substring (pt + 1)).trim ();
what = JU.PT.rep (what, "T/F", (TF ? " TRUE" : " FALSE"));
}this.appRunScript (what);
}, "javajs.api.SC,~S,~B");
Clazz_defineMethod (c$, "menuCreateItem", 
function (menu, entry, script, id) {
var item = this.helper.getMenuItem (entry);
item.addActionListener (this.helper);
return this.newMenuItem (item, menu, entry, script, id);
}, "javajs.api.SC,~S,~S,~S");
Clazz_defineMethod (c$, "menuCreateCheckboxItem", 
function (menu, entry, basename, id, state, isRadio) {
var jmi = (isRadio ? this.helper.getRadio (entry) : this.helper.getCheckBox (entry));
jmi.setSelected (state);
jmi.addItemListener (this.helper);
return this.newMenuItem (jmi, menu, entry, basename, id);
}, "javajs.api.SC,~S,~S,~S,~B,~B");
Clazz_defineMethod (c$, "menuAddSeparator", 
function (menu) {
menu.add (this.helper.getMenuItem (null));
this.isTainted = true;
}, "javajs.api.SC");
Clazz_defineMethod (c$, "menuNewSubMenu", 
function (entry, id) {
var jm = this.helper.getMenu (entry);
this.updateButton (jm, entry, null);
jm.setName (id);
jm.setAutoscrolls (true);
return jm;
}, "~S,~S");
Clazz_defineMethod (c$, "menuRemoveAll", 
function (menu, indexFrom) {
if (indexFrom <= 0) menu.removeAll ();
 else for (var i = menu.getComponentCount (); --i >= indexFrom; ) menu.remove (i);

this.isTainted = true;
}, "javajs.api.SC,~N");
Clazz_defineMethod (c$, "newMenuItem", 
 function (item, menu, text, script, id) {
this.updateButton (item, text, script);
if (id != null && id.startsWith ("Focus")) {
item.addMouseListener (this.helper);
id = menu.getName () + "." + id;
}item.setName (id == null ? menu.getName () + "." : id);
this.menuAddItem (menu, item);
return item;
}, "javajs.api.SC,javajs.api.SC,~S,~S,~S");
Clazz_defineMethod (c$, "setText", 
function (item, text) {
var m = this.htMenus.get (item);
if (m != null) m.setText (text);
return m;
}, "~S,~S");
Clazz_defineMethod (c$, "menuAddItem", 
 function (menu, item) {
menu.add (item);
this.isTainted = true;
}, "javajs.api.SC,javajs.api.SC");
Clazz_defineMethod (c$, "menuAddSubMenu", 
function (menu, subMenu) {
this.menuAddItem (menu, subMenu);
}, "javajs.api.SC,javajs.api.SC");
Clazz_defineMethod (c$, "menuEnable", 
function (component, enable) {
if (component == null || component.isEnabled () == enable) return;
component.setEnabled (enable);
}, "javajs.api.SC,~B");
Clazz_defineMethod (c$, "menuGetId", 
function (menu) {
return menu.getName ();
}, "javajs.api.SC");
Clazz_defineMethod (c$, "menuSetAutoscrolls", 
function (menu) {
menu.setAutoscrolls (true);
this.isTainted = true;
}, "javajs.api.SC");
Clazz_defineMethod (c$, "menuGetListPosition", 
function (item) {
var p = item.getParent ();
var i;
for (i = p.getComponentCount (); --i >= 0; ) if (this.helper.getSwingComponent (p.getComponent (i)) === item) break;

return i;
}, "javajs.api.SC");
Clazz_defineMethod (c$, "show", 
function (x, y, doPopup) {
this.thisx = x;
this.thisy = y;
this.appUpdateForShow ();
this.updateCheckBoxesForShow ();
if (doPopup) this.menuShowPopup (this.popupMenu, this.thisx, this.thisy);
}, "~N,~N,~B");
Clazz_defineMethod (c$, "updateCheckBoxesForShow", 
 function () {
for (var entry, $entry = this.htCheckbox.entrySet ().iterator (); $entry.hasNext () && ((entry = $entry.next ()) || true);) {
var key = entry.getKey ();
var item = entry.getValue ();
var basename = key.substring (0, key.indexOf (":"));
var b = this.appGetBooleanProperty (basename);
if (item.isSelected () != b) {
item.setSelected (b);
this.isTainted = true;
}}
});
Clazz_overrideMethod (c$, "jpiGetMenuAsString", 
function (title) {
this.appUpdateForShow ();
var pt = title.indexOf ("|");
if (pt >= 0) {
var type = title.substring (pt);
title = title.substring (0, pt);
if (type.indexOf ("current") >= 0) {
var sb =  new JU.SB ();
var menu = this.htMenus.get (this.menuName);
this.menuGetAsText (sb, 0, menu, "PopupMenu");
return sb.toString ();
}}return this.appGetMenuAsString (title);
}, "~S");
Clazz_defineMethod (c$, "menuGetAsText", 
 function (sb, level, menu, menuName) {
var name = menuName;
var subMenus = menu.getComponents ();
var flags = null;
var script = null;
var text = null;
var key = 'S';
for (var i = 0; i < subMenus.length; i++) {
var m = this.helper.getSwingComponent (subMenus[i]);
var type = this.helper.getItemType (m);
switch (type) {
case 4:
key = 'M';
name = m.getName ();
flags = "enabled:" + m.isEnabled ();
text = m.getText ();
script = null;
break;
case 0:
key = 'S';
flags = script = text = null;
break;
default:
key = 'I';
flags = "enabled:" + m.isEnabled ();
if (type == 2 || type == 3) flags += ";checked:" + m.isSelected ();
script = this.appFixScript (m.getName (), m.getActionCommand ());
name = m.getName ();
text = m.getText ();
break;
}
J.popup.GenericSwingPopup.addItemText (sb, key, level, name, text, script, flags);
if (type == 2) this.menuGetAsText (sb, level + 1, this.helper.getSwingComponent (m.getPopupMenu ()), name);
}
}, "JU.SB,~N,javajs.api.SC,~S");
c$.addItemText = Clazz_defineMethod (c$, "addItemText", 
 function (sb, type, level, name, label, script, flags) {
sb.appendC (type).appendI (level).appendC ('\t').append (name);
if (label == null) {
sb.append (".\n");
return;
}sb.append ("\t").append (label).append ("\t").append (script == null || script.length == 0 ? "-" : script).append ("\t").append (flags).append ("\n");
}, "JU.SB,~S,~N,~S,~S,~S,~S");
c$.convertToMegabytes = Clazz_defineMethod (c$, "convertToMegabytes", 
function (num) {
if (num <= 9223372036854251519) num += 524288;
return (Clazz_doubleToInt (num / (1048576)));
}, "~N");
});
Clazz_declarePackage ("J.popup");
Clazz_load (null, "J.popup.PopupResource", ["java.io.BufferedReader", "$.StringReader", "java.util.Properties", "JU.SB"], function () {
c$ = Clazz_decorateAsClass (function () {
this.structure = null;
this.words = null;
Clazz_instantialize (this, arguments);
}, J.popup, "PopupResource");
Clazz_makeConstructor (c$, 
function (menuStructure, menuText) {
this.structure =  new java.util.Properties ();
this.words =  new java.util.Properties ();
this.buildStructure (menuStructure);
this.localize (menuStructure != null, menuText);
}, "~S,java.util.Properties");
Clazz_defineMethod (c$, "getStructure", 
function (key) {
return this.structure.getProperty (key);
}, "~S");
Clazz_defineMethod (c$, "getWord", 
function (key) {
var str = this.words.getProperty (key);
return (str == null ? key : str);
}, "~S");
Clazz_defineMethod (c$, "setStructure", 
function (slist, gt) {
var br =  new java.io.BufferedReader ( new java.io.StringReader (slist));
var line;
var pt;
try {
while ((line = br.readLine ()) != null) {
if (line.length == 0 || line.charAt (0) == '#') continue;
pt = line.indexOf ("=");
if (pt < 0) {
pt = line.length;
line += "=";
}var name = line.substring (0, pt).trim ();
var value = line.substring (pt + 1).trim ();
var label = null;
if ((pt = name.indexOf ("|")) >= 0) {
label = name.substring (pt + 1).trim ();
name = name.substring (0, pt).trim ();
}if (name.length == 0) continue;
if (value.length > 0) this.structure.setProperty (name, value);
if (label != null && label.length > 0) this.words.setProperty (name, (gt == null ? label : gt.translate (label)));
}
} catch (e) {
if (Clazz_exceptionOf (e, Exception)) {
} else {
throw e;
}
}
try {
br.close ();
} catch (e) {
if (Clazz_exceptionOf (e, Exception)) {
} else {
throw e;
}
}
}, "~S,J.api.Translator");
Clazz_defineMethod (c$, "addItems", 
function (itemPairs) {
var previous = "";
for (var i = 0; i < itemPairs.length; i++) {
var pair = itemPairs[i];
var str = pair[1];
if (str == null) str = previous;
previous = str;
this.structure.setProperty (pair[0], str);
}
}, "~A");
Clazz_defineMethod (c$, "localize", 
 function (haveUserMenu, menuText) {
var wordContents = this.getWordContents ();
for (var i = 0; i < wordContents.length; i++) {
var item = wordContents[i++];
var word = this.words.getProperty (item);
if (word == null) word = wordContents[i];
this.words.setProperty (item, word);
if (menuText != null && item.indexOf ("Text") >= 0) menuText.setProperty (item, word);
}
}, "~B,java.util.Properties");
Clazz_defineMethod (c$, "getStuctureAsText", 
function (title, menuContents, structureContents) {
return "# " + this.getMenuName () + ".mnu " + title + "\n\n" + "# Part I -- Menu Structure\n" + "# ------------------------\n\n" + this.dumpStructure (menuContents) + "\n\n" + "# Part II -- Key Definitions\n" + "# --------------------------\n\n" + this.dumpStructure (structureContents) + "\n\n" + "# Part III -- Word Translations\n" + "# -----------------------------\n\n" + this.dumpWords ();
}, "~S,~A,~A");
Clazz_defineMethod (c$, "dumpWords", 
 function () {
var wordContents = this.getWordContents ();
var s =  new JU.SB ();
for (var i = 0; i < wordContents.length; i++) {
var key = wordContents[i++];
if (this.structure.getProperty (key) == null) s.append (key).append (" | ").append (wordContents[i]).appendC ('\n');
}
return s.toString ();
});
Clazz_defineMethod (c$, "dumpStructure", 
 function (items) {
var previous = "";
var s =  new JU.SB ();
for (var i = 0; i < items.length; i++) {
var key = items[i][0];
var label = this.words.getProperty (key);
if (label != null) key += " | " + label;
s.append (key).append (" = ").append (items[i][1] == null ? previous : (previous = items[i][1])).appendC ('\n');
}
return s.toString ();
}, "~A");
});
Clazz_declarePackage ("J.popup");
Clazz_load (["J.popup.PopupHelper"], "J.popup.JSSwingPopupHelper", ["javajs.swing.ButtonGroup", "$.JCheckBoxMenuItem", "$.JMenu", "$.JMenuItem", "$.JPopupMenu", "$.JRadioButtonMenuItem"], function () {
c$ = Clazz_decorateAsClass (function () {
this.popup = null;
this.buttonGroup = null;
Clazz_instantialize (this, arguments);
}, J.popup, "JSSwingPopupHelper", null, J.popup.PopupHelper);
Clazz_makeConstructor (c$, 
function (popup) {
this.popup = popup;
}, "javajs.api.GenericMenuInterface");
Clazz_overrideMethod (c$, "menuCreatePopup", 
function (name, applet) {
var j =  new javajs.swing.JPopupMenu (name);
j.setInvoker (applet);
return j;
}, "~S,~O");
Clazz_overrideMethod (c$, "getMenu", 
function (name) {
return  new javajs.swing.JMenu ();
}, "~S");
Clazz_overrideMethod (c$, "getMenuItem", 
function (name) {
return  new javajs.swing.JMenuItem (name);
}, "~S");
Clazz_overrideMethod (c$, "getRadio", 
function (name) {
return  new javajs.swing.JRadioButtonMenuItem ();
}, "~S");
Clazz_overrideMethod (c$, "getCheckBox", 
function (name) {
return  new javajs.swing.JCheckBoxMenuItem ();
}, "~S");
Clazz_overrideMethod (c$, "menuAddButtonGroup", 
function (item) {
if (item == null) {
this.buttonGroup = null;
return;
}if (this.buttonGroup == null) this.buttonGroup =  new javajs.swing.ButtonGroup ();
this.buttonGroup.add (item);
}, "javajs.api.SC");
Clazz_overrideMethod (c$, "getItemType", 
function (m) {
return (m).btnType;
}, "javajs.api.SC");
Clazz_overrideMethod (c$, "menuInsertSubMenu", 
function (menu, subMenu, index) {
(subMenu).setParent (menu);
}, "javajs.api.SC,javajs.api.SC,~N");
Clazz_overrideMethod (c$, "getSwingComponent", 
function (component) {
return component;
}, "~O");
Clazz_overrideMethod (c$, "menuClearListeners", 
function (menu) {
if (menu != null) (menu).disposeMenu ();
}, "javajs.api.SC");
Clazz_defineMethod (c$, "itemStateChanged", 
function (e) {
this.popup.menuCheckBoxCallback (e.getSource ());
}, "javajs.awt.event.ItemEvent");
Clazz_defineMethod (c$, "actionPerformed", 
function (e) {
this.popup.menuClickCallback (e.getSource (), e.getActionCommand ());
}, "javajs.awt.event.ActionEvent");
Clazz_overrideMethod (c$, "getButtonGroup", 
function () {
return this.buttonGroup;
});
});
Clazz_declarePackage ("J.popup");
Clazz_declareInterface (J.popup, "PopupHelper");
})(Clazz
,Clazz.getClassName
,Clazz.newLongArray
,Clazz.doubleToByte
,Clazz.doubleToInt
,Clazz.doubleToLong
,Clazz.declarePackage
,Clazz.instanceOf
,Clazz.load
,Clazz.instantialize
,Clazz.decorateAsClass
,Clazz.floatToInt
,Clazz.floatToLong
,Clazz.makeConstructor
,Clazz.defineEnumConstant
,Clazz.exceptionOf
,Clazz.newIntArray
,Clazz.defineStatics
,Clazz.newFloatArray
,Clazz.declareType
,Clazz.prepareFields
,Clazz.superConstructor
,Clazz.newByteArray
,Clazz.declareInterface
,Clazz.p0p
,Clazz.pu$h
,Clazz.newShortArray
,Clazz.innerTypeInstance
,Clazz.isClassDefined
,Clazz.prepareCallback
,Clazz.newArray
,Clazz.castNullAs
,Clazz.floatToShort
,Clazz.superCall
,Clazz.decorateAsType
,Clazz.newBooleanArray
,Clazz.newCharArray
,Clazz.implementOf
,Clazz.newDoubleArray
,Clazz.overrideConstructor
,Clazz.clone
,Clazz.doubleToShort
,Clazz.getInheritedLevel
,Clazz.getParamsType
,Clazz.isAF
,Clazz.isAB
,Clazz.isAI
,Clazz.isAS
,Clazz.isASS
,Clazz.isAP
,Clazz.isAFloat
,Clazz.isAII
,Clazz.isAFF
,Clazz.isAFFF
,Clazz.tryToSearchAndExecute
,Clazz.getStackTrace
,Clazz.inheritArgs
,Clazz.alert
,Clazz.defineMethod
,Clazz.overrideMethod
,Clazz.declareAnonymous
//,Clazz.checkPrivateMethod
,Clazz.cloneFinals
);
