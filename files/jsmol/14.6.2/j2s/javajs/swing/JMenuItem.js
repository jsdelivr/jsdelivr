Clazz.declarePackage ("javajs.swing");
Clazz.load (["javajs.swing.AbstractButton"], "javajs.swing.JMenuItem", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.btnType = 0;
Clazz.instantialize (this, arguments);
}, javajs.swing, "JMenuItem", javajs.swing.AbstractButton);
Clazz.makeConstructor (c$, 
function (text) {
Clazz.superConstructor (this, javajs.swing.JMenuItem, ["btn"]);
this.setText (text);
this.btnType = (text == null ? 0 : 1);
}, "~S");
Clazz.makeConstructor (c$, 
function (type, i) {
Clazz.superConstructor (this, javajs.swing.JMenuItem, [type]);
this.btnType = i;
}, "~S,~N");
Clazz.overrideMethod (c$, "toHTML", 
function () {
return this.htmlMenuOpener ("li") + (this.text == null ? "" : "<a>" + this.htmlLabel () + "</a>") + "</li>";
});
Clazz.overrideMethod (c$, "getHtmlDisabled", 
function () {
return " class=\"ui-state-disabled\"";
});
Clazz.defineMethod (c$, "htmlLabel", 
 function () {
return (this.btnType == 1 ? this.text : "<label><input id=\"" + this.id + "-" + (this.btnType == 3 ? "r" : "c") + "b\" type=\"" + (this.btnType == 3 ? "radio\" name=\"" + this.htmlName : "checkbox") + "\" " + (this.selected ? "checked" : "") + " />" + this.text + "</label>");
});
Clazz.defineStatics (c$,
"TYPE_SEPARATOR", 0,
"TYPE_BUTTON", 1,
"TYPE_CHECKBOX", 2,
"TYPE_RADIO", 3,
"TYPE_MENU", 4);
});
