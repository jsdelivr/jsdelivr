Clazz.declarePackage ("javajs.swing");
Clazz.load (["javajs.api.SC", "javajs.swing.JComponent"], "javajs.swing.AbstractButton", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.itemListener = null;
this.applet = null;
this.htmlName = null;
this.selected = false;
this.popupMenu = null;
this.icon = null;
Clazz.instantialize (this, arguments);
}, javajs.swing, "AbstractButton", javajs.swing.JComponent, javajs.api.SC);
Clazz.makeConstructor (c$, 
function (type) {
Clazz.superConstructor (this, javajs.swing.AbstractButton, [type]);
this.enabled = true;
}, "~S");
Clazz.overrideMethod (c$, "setSelected", 
function (selected) {
this.selected = selected;
{
SwingController.setSelected(this);
}}, "~B");
Clazz.overrideMethod (c$, "isSelected", 
function () {
return this.selected;
});
Clazz.overrideMethod (c$, "addItemListener", 
function (listener) {
this.itemListener = listener;
}, "~O");
Clazz.overrideMethod (c$, "getIcon", 
function () {
return this.icon;
});
Clazz.overrideMethod (c$, "setIcon", 
function (icon) {
this.icon = icon;
}, "~O");
Clazz.overrideMethod (c$, "init", 
function (text, icon, actionCommand, popupMenu) {
this.text = text;
this.icon = icon;
this.actionCommand = actionCommand;
this.popupMenu = popupMenu;
{
SwingController.initMenuItem(this);
}}, "~S,~O,~S,javajs.api.SC");
Clazz.defineMethod (c$, "getTopPopupMenu", 
function () {
return this.popupMenu;
});
Clazz.defineMethod (c$, "add", 
function (item) {
this.addComponent (item);
}, "javajs.api.SC");
Clazz.overrideMethod (c$, "insert", 
function (subMenu, index) {
this.insertComponent (subMenu, index);
}, "javajs.api.SC,~N");
Clazz.overrideMethod (c$, "getPopupMenu", 
function () {
return null;
});
Clazz.defineMethod (c$, "getMenuHTML", 
function () {
var label = (this.icon != null ? this.icon : this.text != null ? this.text : null);
var s = (label == null ? "" : "<li><a>" + label + "</a>" + this.htmlMenuOpener ("ul"));
var n = this.getComponentCount ();
if (n > 0) for (var i = 0; i < n; i++) s += this.getComponent (i).toHTML ();

if (label != null) s += "</ul></li>";
return s;
});
Clazz.defineMethod (c$, "htmlMenuOpener", 
function (type) {
return "<" + type + " id=\"" + this.id + "\"" + (this.enabled ? "" : this.getHtmlDisabled ()) + ">";
}, "~S");
Clazz.defineMethod (c$, "getHtmlDisabled", 
function () {
return " disabled=\"disabled\"";
});
});
