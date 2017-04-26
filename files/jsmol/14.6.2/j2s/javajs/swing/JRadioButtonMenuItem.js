Clazz.declarePackage ("javajs.swing");
Clazz.load (["javajs.swing.JMenuItem"], "javajs.swing.JRadioButtonMenuItem", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.isRadio = true;
Clazz.instantialize (this, arguments);
}, javajs.swing, "JRadioButtonMenuItem", javajs.swing.JMenuItem);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, javajs.swing.JRadioButtonMenuItem, ["rad", 3]);
});
});
