Clazz.declarePackage ("JSV.common");
c$ = Clazz.decorateAsClass (function () {
this.repaintPending = false;
this.vwr = null;
Clazz.instantialize (this, arguments);
}, JSV.common, "RepaintManager");
Clazz.makeConstructor (c$, 
function (viewer) {
this.vwr = viewer;
}, "JSV.common.JSViewer");
Clazz.defineMethod (c$, "refresh", 
function () {
if (this.repaintPending) {
return false;
}this.repaintPending = true;
this.vwr.pd ().taintedAll = true;
var applet = this.vwr.html5Applet;
{
if (typeof Jmol != "undefined" && Jmol._repaint && applet)
Jmol._repaint(applet, false);
this.repaintDone();
}return true;
});
Clazz.defineMethod (c$, "repaintDone", 
function () {
this.repaintPending = false;
this.notify ();
});
