Clazz.declarePackage ("JSV.js2d");
Clazz.load (["javajs.swing.JDialog", "JSV.api.PlatformDialog", "javajs.swing.Insets"], "JSV.js2d.JsDialog", ["java.util.Hashtable", "javajs.awt.Color", "$.Dimension", "javajs.swing.FlowLayout", "$.GridBagConstraints", "$.GridBagLayout", "$.JButton", "$.JCheckBox", "$.JComboBox", "$.JLabel", "$.JPanel", "$.JScrollPane", "$.JSplitPane", "$.JTable", "$.JTextField", "JSV.common.Annotation", "JSV.js2d.DialogTableModel"], function () {
c$ = Clazz.decorateAsClass (function () {
this.optionKey = null;
this.registryKey = null;
this.options = null;
this.manager = null;
this.type = null;
this.leftPanel = null;
this.mainSplitPane = null;
this.rightPanel = null;
this.thisPanel = null;
this.dataTable = null;
this.iRow = 0;
this.haveColors = false;
this.tableCellAlignLeft = false;
this.haveTwoPanels = true;
this.buttonInsets = null;
this.panelInsets = null;
this.$defaultHeight = 350;
this.selectedRow = -1;
Clazz.instantialize (this, arguments);
}, JSV.js2d, "JsDialog", javajs.swing.JDialog, JSV.api.PlatformDialog);
Clazz.prepareFields (c$, function () {
this.buttonInsets =  new javajs.swing.Insets (5, 5, 5, 5);
this.panelInsets =  new javajs.swing.Insets (0, 0, 2, 2);
});
Clazz.makeConstructor (c$, 
function (manager, jsvDialog, registryKey) {
Clazz.superConstructor (this, JSV.js2d.JsDialog);
this.manager = manager;
this.registryKey = registryKey;
this.optionKey = jsvDialog.optionKey;
this.type = jsvDialog.getAType ();
this.options = jsvDialog.options;
if (this.options == null) this.options =  new java.util.Hashtable ();
this.getContentPane ().setBackground (javajs.awt.Color.get3 (230, 230, 230));
this.setFront ();
}, "JSV.dialog.DialogManager,JSV.dialog.JSVDialog,~S");
Clazz.defineMethod (c$, "onFocus", 
function () {
this.setFront ();
});
Clazz.overrideMethod (c$, "setFocus", 
function (tf) {
if (tf) {
this.setFront ();
}}, "~B");
Clazz.defineMethod (c$, "setFront", 
 function () {
{
SwingController.setFront(this);
}});
Clazz.overrideMethod (c$, "addButton", 
function (name, text) {
var btn =  new javajs.swing.JButton ();
btn.setPreferredSize ( new javajs.awt.Dimension (120, 25));
btn.setText (text);
btn.setName (this.registryKey + "/" + name);
btn.addActionListener (this.manager);
this.thisPanel.add (btn,  new javajs.swing.GridBagConstraints (0, this.iRow++, 3, 1, 0.0, 0.0, 10, 0, this.buttonInsets, 0, 0));
return btn;
}, "~S,~S");
Clazz.overrideMethod (c$, "addCheckBox", 
function (name, title, level, isSelected) {
if (name == null) {
this.iRow = 0;
this.thisPanel = this.rightPanel;
return null;
}var cb =  new javajs.swing.JCheckBox ();
cb.setSelected (isSelected);
cb.setText (title);
cb.setName (this.registryKey + "/" + name);
cb.addActionListener (this.manager);
var insets =  new javajs.swing.Insets (0, 20 * level, 2, 2);
this.thisPanel.add (cb,  new javajs.swing.GridBagConstraints (0, this.iRow++, 1, 1, 0.0, 0.0, 17, 0, insets, 0, 0));
return cb;
}, "~S,~S,~N,~B");
Clazz.defineMethod (c$, "addPanelLine", 
 function (name, label, obj, units) {
this.thisPanel.add ( new javajs.swing.JLabel (label == null ? name : label),  new javajs.swing.GridBagConstraints (0, this.iRow, 1, 1, 0.0, 0.0, 13, 0, this.panelInsets, 0, 0));
if (units == null) {
this.thisPanel.add (obj,  new javajs.swing.GridBagConstraints (1, this.iRow, 2, 1, 0.0, 0.0, 17, 0, this.panelInsets, 0, 0));
} else {
this.thisPanel.add (obj,  new javajs.swing.GridBagConstraints (1, this.iRow, 1, 1, 0.0, 0.0, 10, 0, this.panelInsets, 0, 0));
this.thisPanel.add ( new javajs.swing.JLabel (units),  new javajs.swing.GridBagConstraints (2, this.iRow, 1, 1, 0.0, 0.0, 17, 0, this.panelInsets, 0, 0));
}this.iRow++;
}, "~S,~S,javajs.swing.JComponent,~S");
Clazz.overrideMethod (c$, "addSelectOption", 
function (name, label, info, iPt, visible) {
var combo =  new javajs.swing.JComboBox (info);
combo.setSelectedIndex (iPt);
combo.setName (this.registryKey + "/" + name);
if (visible) {
combo.addActionListener (this.manager);
this.addPanelLine (name, label, combo, null);
}return combo;
}, "~S,~S,~A,~N,~B");
Clazz.overrideMethod (c$, "addTextField", 
function (name, label, value, units, defaultValue, visible) {
var key = this.optionKey + "_" + name;
if (value == null) {
value = this.options.get (key);
if (value == null) this.options.put (key, (value = defaultValue));
}var obj =  new javajs.swing.JTextField (value);
obj.setName (this.registryKey + "/" + name);
if (visible) {
obj.setPreferredSize ( new javajs.awt.Dimension (45, 15));
obj.addActionListener (this.manager);
this.addPanelLine (name, label, obj, units);
}return obj;
}, "~S,~S,~S,~S,~S,~B");
Clazz.overrideMethod (c$, "createTable", 
function (data, header, widths) {
try {
var scrollPane =  new javajs.swing.JScrollPane (this.dataTable = this.getDataTable (data, header, widths, (this.leftPanel == null ? this.$defaultHeight : this.leftPanel.getHeight () - 50)));
if (this.mainSplitPane == null) {
this.getContentPane ().add (scrollPane);
} else {
this.mainSplitPane.setRightComponent (scrollPane);
}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
this.validate ();
this.repaint ();
}, "~A,~A,~A");
Clazz.overrideMethod (c$, "endLayout", 
function () {
this.getContentPane ().removeAll ();
this.getContentPane ().add (this.mainSplitPane);
this.pack ();
});
Clazz.defineMethod (c$, "getDataTable", 
 function (data, columnNames, columnWidths, height) {
this.selectedRow = -1;
var tableModel =  new JSV.js2d.DialogTableModel (columnNames, data, !this.haveColors, this.tableCellAlignLeft);
var table =  new javajs.swing.JTable (tableModel);
var selector = table.getSelectionModel ();
selector.addListSelectionListener (this.manager);
this.manager.registerSelector (this.registryKey + "/ROW", selector);
selector = table.getColumnModel ().getSelectionModel ();
selector.addListSelectionListener (this.manager);
this.manager.registerSelector (this.registryKey + "/COLUMN", selector);
var n = 0;
for (var i = 0; i < columnNames.length; i++) {
table.getColumnModel ().getColumn (i).setPreferredWidth (columnWidths[i]);
n += columnWidths[i];
}
return table;
}, "~A,~A,~A,~N");
Clazz.overrideMethod (c$, "getSelectedIndex", 
function (c) {
return (c).getSelectedIndex ();
}, "~O");
Clazz.overrideMethod (c$, "getSelectedItem", 
function (combo) {
return (combo).getSelectedItem ();
}, "~O");
Clazz.defineMethod (c$, "getText", 
function (o) {
return (o).getText ();
}, "~O");
Clazz.overrideMethod (c$, "isSelected", 
function (chkbox) {
return (chkbox).isSelected ();
}, "~O");
Clazz.overrideMethod (c$, "selectTableRow", 
function (i) {
this.selectedRow = i;
this.dataTable.clearSelection ();
if (this.selectedRow >= 0) {
this.dataTable.setRowSelectionAllowed (true);
this.dataTable.setRowSelectionInterval (this.selectedRow, this.selectedRow + 1);
this.repaint ();
}}, "~N");
Clazz.overrideMethod (c$, "setCellSelectionEnabled", 
function (enabled) {
this.dataTable.setCellSelectionEnabled (enabled);
}, "~B");
Clazz.defineMethod (c$, "setEnabled", 
function (btn, b) {
(btn).setEnabled (b);
}, "~O,~B");
Clazz.overrideMethod (c$, "setIntLocation", 
function (loc) {
var d =  new javajs.awt.Dimension (0, 0);
{
SwingController.getScreenDimensions(d);
}loc[0] = Math.min (d.width - 50, loc[0]);
loc[1] = Math.min (d.height - 50, loc[1]);
this.setLocation (loc);
}, "~A");
Clazz.defineMethod (c$, "setPreferredSize", 
function (width, height) {
this.setPreferredSize ( new javajs.awt.Dimension (width, height));
}, "~N,~N");
Clazz.overrideMethod (c$, "setSelected", 
function (chkbox, b) {
(chkbox).setSelected (b);
}, "~O,~B");
Clazz.overrideMethod (c$, "setSelectedIndex", 
function (combo, i) {
(combo).setSelectedIndex (i);
}, "~O,~N");
Clazz.defineMethod (c$, "setText", 
function (o, text) {
(o).setText (text);
}, "~O,~S");
Clazz.overrideMethod (c$, "startLayout", 
function () {
this.setPreferredSize ( new javajs.awt.Dimension (600, 370));
this.getContentPane ().removeAll ();
this.thisPanel = this.rightPanel =  new javajs.swing.JPanel ( new javajs.swing.FlowLayout ());
switch (this.type) {
case JSV.common.Annotation.AType.Integration:
case JSV.common.Annotation.AType.Measurements:
case JSV.common.Annotation.AType.PeakList:
case JSV.common.Annotation.AType.NONE:
break;
case JSV.common.Annotation.AType.OverlayLegend:
this.tableCellAlignLeft = true;
this.haveColors = true;
this.haveTwoPanels = false;
break;
case JSV.common.Annotation.AType.Views:
this.rightPanel =  new javajs.swing.JPanel ( new javajs.swing.GridBagLayout ());
}
if (this.haveTwoPanels) {
this.thisPanel = this.leftPanel =  new javajs.swing.JPanel ( new javajs.swing.GridBagLayout ());
this.leftPanel.setMinimumSize ( new javajs.awt.Dimension (200, 300));
this.mainSplitPane =  new javajs.swing.JSplitPane (1);
this.mainSplitPane.setLeftComponent (this.leftPanel);
this.mainSplitPane.setRightComponent ( new javajs.swing.JScrollPane (this.rightPanel));
}});
Clazz.defineMethod (c$, "getColumnCentering", 
function (column) {
return this.tableCellAlignLeft ? 2 : column == 0 ? 0 : 4;
}, "~N");
});
