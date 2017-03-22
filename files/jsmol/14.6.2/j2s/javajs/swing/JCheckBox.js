Clazz.declarePackage ("javajs.swing");
Clazz.load (["javajs.swing.AbstractButton"], "javajs.swing.JCheckBox", null, function () {
c$ = Clazz.declareType (javajs.swing, "JCheckBox", javajs.swing.AbstractButton);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, javajs.swing.JCheckBox, ["chkJCB"]);
});
Clazz.overrideMethod (c$, "toHTML", 
function () {
var s = "<label><input type=checkbox id='" + this.id + "' class='JCheckBox' style='" + this.getCSSstyle (0, 0) + "' " + (this.selected ? "checked='checked' " : "") + "onclick='SwingController.click(this)'>" + this.text + "</label>";
return s;
});
});
