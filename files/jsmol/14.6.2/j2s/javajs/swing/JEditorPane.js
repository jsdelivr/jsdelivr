Clazz.declarePackage ("javajs.swing");
Clazz.load (["javajs.swing.JComponent"], "javajs.swing.JEditorPane", ["JU.SB"], function () {
c$ = Clazz.declareType (javajs.swing, "JEditorPane", javajs.swing.JComponent);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, javajs.swing.JEditorPane, ["txtJEP"]);
this.text = "";
});
Clazz.overrideMethod (c$, "toHTML", 
function () {
var sb =  new JU.SB ();
sb.append ("<textarea type=text id='" + this.id + "' class='JEditorPane' style='" + this.getCSSstyle (98, 98) + "'>" + this.text + "</textarea>");
return sb.toString ();
});
});
