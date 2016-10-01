Clazz.declarePackage ("javajs.awt.event");
Clazz.load (["javajs.awt.event.Event"], "javajs.awt.event.ActionEvent", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.actionCommand = null;
Clazz.instantialize (this, arguments);
}, javajs.awt.event, "ActionEvent", javajs.awt.event.Event);
Clazz.defineMethod (c$, "getActionCommand", 
function () {
return this.actionCommand;
});
});
