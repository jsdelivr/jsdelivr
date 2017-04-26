Clazz.declarePackage ("javajs.swing");
Clazz.load (["javajs.swing.JComponent"], "javajs.swing.JScrollPane", ["JU.SB"], function () {
c$ = Clazz.declareType (javajs.swing, "JScrollPane", javajs.swing.JComponent);
Clazz.makeConstructor (c$, 
function (component) {
Clazz.superConstructor (this, javajs.swing.JScrollPane, ["JScP"]);
this.add (component);
}, "javajs.swing.JComponent");
Clazz.defineMethod (c$, "toHTML", 
function () {
var sb =  new JU.SB ();
sb.append ("\n<div id='" + this.id + "' class='JScrollPane' style='" + this.getCSSstyle (98, 98) + "overflow:auto'>\n");
if (this.list != null) {
var c = this.list.get (0);
sb.append (c.toHTML ());
}sb.append ("\n</div>\n");
return sb.toString ();
});
Clazz.overrideMethod (c$, "setMinimumSize", 
function (dimension) {
}, "javajs.awt.Dimension");
});
