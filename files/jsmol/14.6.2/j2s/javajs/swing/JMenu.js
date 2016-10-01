Clazz.declarePackage ("javajs.swing");
Clazz.load (["javajs.swing.JMenuItem"], "javajs.swing.JMenu", null, function () {
c$ = Clazz.declareType (javajs.swing, "JMenu", javajs.swing.JMenuItem);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, javajs.swing.JMenu, ["mnu", 4]);
});
Clazz.defineMethod (c$, "getItemCount", 
function () {
return this.getComponentCount ();
});
Clazz.defineMethod (c$, "getItem", 
function (i) {
return this.getComponent (i);
}, "~N");
Clazz.overrideMethod (c$, "getPopupMenu", 
function () {
return this;
});
Clazz.overrideMethod (c$, "toHTML", 
function () {
return this.getMenuHTML ();
});
});
