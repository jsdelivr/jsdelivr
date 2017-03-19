Clazz.declarePackage ("javajs.swing");
Clazz.load (["javajs.awt.Container"], "javajs.swing.JComponent", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.autoScrolls = false;
this.actionCommand = null;
this.actionListener = null;
Clazz.instantialize (this, arguments);
}, javajs.swing, "JComponent", javajs.awt.Container);
Clazz.defineMethod (c$, "setAutoscrolls", 
function (b) {
this.autoScrolls = b;
}, "~B");
Clazz.defineMethod (c$, "addActionListener", 
function (listener) {
this.actionListener = listener;
}, "~O");
Clazz.defineMethod (c$, "getActionCommand", 
function () {
return this.actionCommand;
});
Clazz.defineMethod (c$, "setActionCommand", 
function (actionCommand) {
this.actionCommand = actionCommand;
}, "~S");
});
