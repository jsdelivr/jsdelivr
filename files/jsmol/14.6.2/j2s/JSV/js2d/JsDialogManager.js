Clazz.declarePackage ("JSV.js2d");
Clazz.load (["JSV.dialog.DialogManager"], "JSV.js2d.JsDialogManager", ["javajs.awt.Dimension", "javajs.swing.JDialog", "$.JEditorPane", "$.JLabel", "$.JScrollPane", "$.JTable", "JU.PT", "JSV.js2d.DialogTableModel", "$.JsDialog"], function () {
c$ = Clazz.declareType (JSV.js2d, "JsDialogManager", JSV.dialog.DialogManager);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, JSV.js2d.JsDialogManager, []);
});
Clazz.overrideMethod (c$, "getDialog", 
function (jsvDialog) {
return  new JSV.js2d.JsDialog (this, jsvDialog, this.registerDialog (jsvDialog));
}, "JSV.dialog.JSVDialog");
Clazz.overrideMethod (c$, "getDialogInput", 
function (parentComponent, phrase, title, msgType, icon, objects, defaultStr) {
{
return prompt(phrase, defaultStr);
}}, "~O,~S,~S,~N,~O,~A,~S");
Clazz.overrideMethod (c$, "showMessageDialog", 
function (parentComponent, msg, title, msgType) {
{
alert(msg);
}}, "~O,~S,~S,~N");
Clazz.overrideMethod (c$, "getLocationOnScreen", 
function (component) {
return  Clazz.newIntArray (2, 0);
}, "~O");
Clazz.overrideMethod (c$, "getOptionFromDialog", 
function (frame, items, jsvp, dialogName, labelName) {
var i = -1;
var applet = this.vwr.html5Applet;
{
i = applet.getOption(items, dialogName, labelName);
}return i;
}, "~O,~A,JSV.api.JSVPanel,~S,~S");
Clazz.overrideMethod (c$, "showProperties", 
function (frame, spectrum) {
var dialog =  new javajs.swing.JDialog ();
dialog.setTitle ("Header Information");
var rowData = spectrum.getHeaderRowDataAsArray ();
var columnNames =  Clazz.newArray (-1, ["Label", "Description"]);
var tableModel =  new JSV.js2d.DialogTableModel (columnNames, rowData, false, true);
var table =  new javajs.swing.JTable (tableModel);
table.setPreferredScrollableViewportSize ( new javajs.awt.Dimension (400, 195));
var scrollPane =  new javajs.swing.JScrollPane (table);
dialog.getContentPane ().add (scrollPane);
dialog.pack ();
dialog.setVisible (true);
}, "~O,JSV.common.Spectrum");
Clazz.overrideMethod (c$, "showMessage", 
function (frame, text, title) {
var dialog =  new javajs.swing.JDialog ();
{
dialog.manager = this;
}dialog.setTitle (title);
var pane;
if (text.indexOf ("</div>") >= 0) {
pane =  new javajs.swing.JLabel (text);
} else {
pane =  new javajs.swing.JEditorPane ();
pane.setText (text);
}dialog.getContentPane ().add (pane);
dialog.pack ();
dialog.setVisible (true);
}, "~O,~S,~S");
Clazz.defineMethod (c$, "actionPerformed", 
function (eventId) {
var pt = eventId.indexOf ("/JT");
if (pt >= 0) {
var pt2 = eventId.lastIndexOf ("_");
var pt1 = eventId.lastIndexOf ("_", pt2 - 1);
var irow = JU.PT.parseInt (eventId.substring (pt1 + 1, pt2));
var icol = JU.PT.parseInt (eventId.substring (pt2 + 1));
this.processTableEvent (eventId.substring (0, pt) + "/ROWCOL", irow, icol, false);
return;
}this.processClick (eventId);
}, "~S");
});
