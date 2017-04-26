Clazz.declarePackage ("J.renderbio");
Clazz.load (null, "J.renderbio.NucleicRenderer", ["JU.P3", "JU.C"], function () {
c$ = Clazz.decorateAsClass (function () {
this.renderEdges = false;
this.ladderOnly = false;
this.$renderRibose = false;
this.rPt = null;
this.rPt5 = null;
this.rScr = null;
this.rScr5 = null;
this.basePt = null;
this.backbonePt = null;
this.baseScreen = null;
this.backboneScreen = null;
this.vwr = null;
this.tm = null;
this.g3d = null;
this.bsr = null;
this.colix = 0;
Clazz.instantialize (this, arguments);
}, J.renderbio, "NucleicRenderer");
Clazz.makeConstructor (c$, 
function () {
});
Clazz.defineMethod (c$, "renderNucleic", 
function (renderer) {
if (this.vwr == null) {
this.rPt =  new Array (10);
this.rScr =  new Array (10);
this.rPt5 =  new Array (5);
this.rScr5 =  new Array (5);
this.backboneScreen =  new JU.P3 ();
this.backbonePt =  new JU.P3 ();
this.bsr = renderer;
this.tm = renderer.vwr.tm;
this.vwr = renderer.vwr;
}this.g3d = renderer.g3d;
var screens = renderer.controlPointScreens;
var pts = renderer.controlPoints;
this.renderEdges = this.vwr.getBoolean (603979816);
this.ladderOnly = this.vwr.getBoolean (603979818);
this.$renderRibose = this.vwr.getBoolean (603979819);
var isTraceAlpha = this.vwr.getBoolean (603979966);
var bsVisible = this.bsr.bsVisible;
for (var i = bsVisible.nextSetBit (0); i >= 0; i = bsVisible.nextSetBit (i + 1)) {
var scr = screens[i + 1];
if (isTraceAlpha) {
this.backboneScreen.ave (screens[i], scr);
this.backbonePt.ave (pts[i], pts[i + 1]);
} else {
this.backboneScreen.setT (scr);
this.backbonePt.setT (pts[i + 1]);
}this.bsr.renderHermiteConic (i, false, 4);
this.colix = this.bsr.getLeadColix (i);
if (this.bsr.setBioColix (this.colix)) this.renderNucleicBaseStep (i);
}
}, "J.renderbio.BioShapeRenderer");
Clazz.defineMethod (c$, "renderNucleicBaseStep", 
 function (im) {
if (this.bsr.isPhosphorusOnly) return;
var nucleotide = this.bsr.monomers[im];
var thisMad = this.bsr.mads[im];
if (this.rScr[0] == null) {
for (var i = 10; --i >= 0; ) this.rScr[i] =  new JU.P3 ();

for (var i = 5; --i >= 0; ) this.rScr5[i] =  new JU.P3 ();

this.baseScreen =  new JU.P3 ();
this.basePt =  new JU.P3 ();
this.rPt[9] =  new JU.P3 ();
}if (this.renderEdges) {
this.renderLeontisWesthofEdges (nucleotide);
return;
}nucleotide.getBaseRing6Points (this.rPt);
this.transformPoints (6, this.rPt, this.rScr);
if (!this.ladderOnly) this.renderRing6 ();
var stepScreen;
var stepPt;
var pt;
var hasRing5 = nucleotide.maybeGetBaseRing5Points (this.rPt5);
if (hasRing5) {
if (this.ladderOnly) {
stepScreen = this.rScr[2];
stepPt = this.rPt[2];
} else {
this.transformPoints (5, this.rPt5, this.rScr5);
this.renderRing5 ();
stepScreen = this.rScr5[3];
stepPt = this.rPt5[3];
}} else {
pt = (this.ladderOnly ? 4 : 2);
stepScreen = this.rScr[pt];
stepPt = this.rPt[pt];
}var mad = (thisMad > 1 ? Clazz.doubleToInt (thisMad / 2) : thisMad);
var r = mad / 2000;
var w = Clazz.floatToInt (this.vwr.tm.scaleToScreen (Clazz.floatToInt (this.backboneScreen.z), mad));
if (this.ladderOnly || !this.$renderRibose) this.g3d.fillCylinderScreen3I (3, w, this.backboneScreen, stepScreen, this.backbonePt, stepPt, r);
if (this.ladderOnly) return;
this.drawEdges (this.rScr, this.rPt, 6);
if (hasRing5) this.drawEdges (this.rScr5, this.rPt5, 5);
 else this.renderEdge (this.rScr, this.rPt, 0, 5);
if (this.$renderRibose) {
this.baseScreen.setT (stepScreen);
this.basePt.setT (stepPt);
nucleotide.getRiboseRing5Points (this.rPt);
var c = this.rPt[9];
c.set (0, 0, 0);
for (var i = 0; i < 5; i++) c.add (this.rPt[i]);

c.scale (0.2);
this.transformPoints (10, this.rPt, this.rScr);
this.renderRibose ();
this.renderEdge (this.rScr, this.rPt, 2, 5);
this.renderEdge (this.rScr, this.rPt, 3, 6);
this.renderEdge (this.rScr, this.rPt, 6, 7);
this.renderEdge (this.rScr, this.rPt, 7, 8);
this.renderCyl (this.rScr[0], this.baseScreen, this.rPt[0], this.basePt);
this.drawEdges (this.rScr, this.rPt, 5);
}}, "~N");
Clazz.defineMethod (c$, "transformPoints", 
 function (count, angstroms, screens) {
for (var i = count; --i >= 0; ) this.tm.transformPtScrT3 (angstroms[i], screens[i]);

}, "~N,~A,~A");
Clazz.defineMethod (c$, "drawEdges", 
 function (scr, pt, n) {
for (var i = n; --i >= 0; ) scr[i].z--;

for (var i = n; --i > 0; ) this.renderEdge (scr, pt, i, i - 1);

}, "~A,~A,~N");
Clazz.defineMethod (c$, "renderLeontisWesthofEdges", 
 function (nucleotide) {
if (!nucleotide.getEdgePoints (this.rPt)) return;
this.transformPoints (6, this.rPt, this.rScr);
this.renderTriangle (this.rScr, this.rPt, 2, 3, 4, true);
this.renderEdge (this.rScr, this.rPt, 0, 1);
this.renderEdge (this.rScr, this.rPt, 1, 2);
var isTranslucent = JU.C.isColixTranslucent (this.colix);
var tl = JU.C.getColixTranslucencyLevel (this.colix);
var colixSugarEdge = JU.C.getColixTranslucent3 (10, isTranslucent, tl);
var colixWatsonCrickEdge = JU.C.getColixTranslucent3 (11, isTranslucent, tl);
var colixHoogsteenEdge = JU.C.getColixTranslucent3 (7, isTranslucent, tl);
this.g3d.setC (colixSugarEdge);
this.renderEdge (this.rScr, this.rPt, 2, 3);
this.g3d.setC (colixWatsonCrickEdge);
this.renderEdge (this.rScr, this.rPt, 3, 4);
this.g3d.setC (colixHoogsteenEdge);
this.renderEdge (this.rScr, this.rPt, 4, 5);
}, "JM.NucleicMonomer");
Clazz.defineMethod (c$, "renderEdge", 
 function (scr, pt, i, j) {
this.renderCyl (scr[i], scr[j], pt[i], pt[j]);
}, "~A,~A,~N,~N");
Clazz.defineMethod (c$, "renderCyl", 
 function (s1, s2, p1, p2) {
this.g3d.fillCylinderScreen3I (3, 3, s1, s2, p1, p2, 0.005);
}, "JU.P3,JU.P3,JU.P3,JU.P3");
Clazz.defineMethod (c$, "renderTriangle", 
 function (scr, pt, i, j, k, doShade) {
this.g3d.fillTriangle3i (scr[i], scr[j], scr[k], pt[i], pt[j], pt[k], doShade);
}, "~A,~A,~N,~N,~N,~B");
Clazz.defineMethod (c$, "renderRing6", 
 function () {
this.renderTriangle (this.rScr, this.rPt, 0, 2, 4, true);
this.renderTriangle (this.rScr, this.rPt, 0, 1, 2, false);
this.renderTriangle (this.rScr, this.rPt, 0, 4, 5, false);
this.renderTriangle (this.rScr, this.rPt, 2, 3, 4, false);
});
Clazz.defineMethod (c$, "renderRing5", 
 function () {
this.renderTriangle (this.rScr5, this.rPt5, 0, 1, 2, false);
this.renderTriangle (this.rScr5, this.rPt5, 0, 2, 3, false);
this.renderTriangle (this.rScr5, this.rPt5, 0, 3, 4, false);
});
Clazz.defineMethod (c$, "renderRibose", 
 function () {
this.renderTriangle (this.rScr, this.rPt, 0, 1, 9, true);
this.renderTriangle (this.rScr, this.rPt, 1, 2, 9, true);
this.renderTriangle (this.rScr, this.rPt, 2, 3, 9, true);
this.renderTriangle (this.rScr, this.rPt, 3, 4, 9, true);
this.renderTriangle (this.rScr, this.rPt, 4, 0, 9, true);
});
});
