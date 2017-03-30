Clazz.declarePackage ("J.renderbio");
Clazz.load (["J.renderbio.BioShapeRenderer"], "J.renderbio.BackboneRenderer", ["JU.C"], function () {
c$ = Clazz.decorateAsClass (function () {
this.isDataFrame = false;
Clazz.instantialize (this, arguments);
}, J.renderbio, "BackboneRenderer", J.renderbio.BioShapeRenderer);
Clazz.overrideMethod (c$, "renderBioShape", 
function (bioShape) {
var checkPass2 = (!this.isExport && !this.vwr.gdata.isPass2);
var showSteps = this.vwr.getBoolean (603979811) && bioShape.bioPolymer.isNucleic ();
this.isDataFrame = this.vwr.ms.isJmolDataFrameForModel (bioShape.modelIndex);
var n = this.monomerCount;
var atoms = this.ms.at;
for (var i = this.bsVisible.nextSetBit (0); i >= 0; i = this.bsVisible.nextSetBit (i + 1)) {
var atomA = atoms[this.leadAtomIndices[i]];
var cA = this.colixes[i];
this.mad = this.mads[i];
var i1 = (i + 1) % n;
this.drawSegment (atomA, atoms[this.leadAtomIndices[i1]], cA, this.colixes[i1], 100, checkPass2);
if (showSteps) {
var g = this.monomers[i];
var bps = g.getBasePairs ();
if (bps != null) {
for (var j = bps.size (); --j >= 0; ) {
var iAtom = bps.get (j).getPartnerAtom (g);
if (iAtom > i) this.drawSegment (atomA, atoms[iAtom], cA, cA, 1000, checkPass2);
}
}}}
}, "J.shapebio.BioShape");
Clazz.defineMethod (c$, "drawSegment", 
 function (atomA, atomB, colixA, colixB, max, checkPass2) {
if (atomA.nBackbonesDisplayed == 0 || atomB.nBackbonesDisplayed == 0 || this.ms.isAtomHidden (atomB.i) || !this.isDataFrame && atomA.distanceSquared (atomB) > max) return;
colixA = JU.C.getColixInherited (colixA, atomA.colixAtom);
colixB = JU.C.getColixInherited (colixB, atomB.colixAtom);
if (checkPass2 && !this.setBioColix (colixA) && !this.setBioColix (colixB)) return;
var xA = atomA.sX;
var yA = atomA.sY;
var zA = atomA.sZ;
var xB = atomB.sX;
var yB = atomB.sY;
var zB = atomB.sZ;
var mad = this.mad;
if (max == 1000) mad = mad >> 1;
if (mad < 0) {
this.g3d.drawLine (colixA, colixB, xA, yA, zA, xB, yB, zB);
} else {
var width = Clazz.floatToInt (this.isExport ? mad : this.vwr.tm.scaleToScreen (Clazz.doubleToInt ((zA + zB) / 2), mad));
this.g3d.fillCylinderXYZ (colixA, colixB, 3, width, xA, yA, zA, xB, yB, zB);
}}, "JM.Atom,JM.Atom,~N,~N,~N,~B");
});
