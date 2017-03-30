Clazz.declarePackage ("javajs.swing");
Clazz.load (null, "javajs.swing.ButtonGroup", ["javajs.awt.Component"], function () {
c$ = Clazz.decorateAsClass (function () {
this.id = null;
Clazz.instantialize (this, arguments);
}, javajs.swing, "ButtonGroup");
Clazz.makeConstructor (c$, 
function () {
this.id = javajs.awt.Component.newID ("bg");
});
Clazz.defineMethod (c$, "add", 
function (item) {
(item).htmlName = this.id;
}, "javajs.api.SC");
});
