Clazz.declarePackage ("javajs.swing");
Clazz.load (["javajs.swing.JComponent"], "javajs.swing.JPanel", ["javajs.swing.Grid", "$.GridBagConstraints", "JU.SB"], function () {
c$ = Clazz.decorateAsClass (function () {
this.grid = null;
this.nElements = 0;
this.last = null;
Clazz.instantialize (this, arguments);
}, javajs.swing, "JPanel", javajs.swing.JComponent);
Clazz.makeConstructor (c$, 
function (manager) {
Clazz.superConstructor (this, javajs.swing.JPanel, ["JP"]);
this.grid =  new javajs.swing.Grid (10, 10);
}, "javajs.awt.LayoutManager");
Clazz.defineMethod (c$, "add", 
function (btn, c) {
this.last = (++this.nElements == 1 ? btn : null);
if (Clazz.instanceOf (c, String)) {
if (c.equals ("North")) c =  new javajs.swing.GridBagConstraints (0, 0, 3, 1, 0, 0, 10, 0, null, 0, 0);
 else if (c.equals ("South")) c =  new javajs.swing.GridBagConstraints (0, 2, 3, 1, 0, 0, 10, 0, null, 0, 0);
 else if (c.equals ("East")) c =  new javajs.swing.GridBagConstraints (2, 1, 1, 1, 0, 0, 13, 0, null, 0, 0);
 else if (c.equals ("West")) c =  new javajs.swing.GridBagConstraints (0, 1, 1, 1, 0, 0, 17, 0, null, 0, 0);
 else c =  new javajs.swing.GridBagConstraints (1, 1, 1, 1, 0, 0, 10, 0, null, 0, 0);
}this.grid.add (btn, c);
}, "javajs.swing.JComponent,~O");
Clazz.overrideMethod (c$, "toHTML", 
function () {
if (this.last != null) {
this.grid =  new javajs.swing.Grid (1, 1);
this.grid.add (this.last,  new javajs.swing.GridBagConstraints (0, 0, 1, 1, 0, 0, 10, 0, null, 0, 0));
this.last = null;
}var sb =  new JU.SB ();
sb.append ("\n<div id='" + this.id + "' class='JPanel' style='" + this.getCSSstyle (100, 100) + "'>\n");
sb.append ("\n<span id='" + this.id + "_minimizer' style='width:" + this.minWidth + "px;height:" + this.minHeight + "px;'>");
sb.append (this.grid.toHTML (this.id));
sb.append ("</span>");
sb.append ("\n</div>\n");
return sb.toString ();
});
});
