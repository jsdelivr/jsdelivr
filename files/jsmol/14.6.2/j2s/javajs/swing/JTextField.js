Clazz.declarePackage ("javajs.swing");
Clazz.load (["javajs.swing.JComponent"], "javajs.swing.JTextField", ["JU.SB"], function () {
c$ = Clazz.declareType (javajs.swing, "JTextField", javajs.swing.JComponent);
Clazz.makeConstructor (c$, 
function (value) {
Clazz.superConstructor (this, javajs.swing.JTextField, ["txtJT"]);
this.text = value;
}, "~S");
Clazz.overrideMethod (c$, "toHTML", 
function () {
var sb =  new JU.SB ();
sb.append ("<input type=text id='" + this.id + "' class='JTextField' style='" + this.getCSSstyle (0, 0) + "' value='" + this.text + "' onkeyup	=SwingController.click(this,event)	>");
return sb.toString ();
});
});
