Clazz.declarePackage ("J.renderbio");
Clazz.load (null, "J.renderbio.RocketRenderer", ["JU.P3", "$.V3", "J.c.STR", "JM.Helix", "$.Sheet"], function () {
c$ = Clazz.decorateAsClass (function () {
this.tPending = false;
this.proteinstructurePending = null;
this.startIndexPending = 0;
this.endIndexPending = 0;
this.vtemp = null;
this.screenA = null;
this.screenB = null;
this.screenC = null;
this.colix = 0;
this.mad = 0;
this.rr = null;
this.vwr = null;
this.g3d = null;
this.tm = null;
this.renderArrowHeads = false;
this.isRockets = false;
this.ptC = null;
this.ptTip = null;
this.corners = null;
this.screenCorners = null;
this.vW = null;
this.vH = null;
Clazz.instantialize (this, arguments);
}, J.renderbio, "RocketRenderer");
Clazz.makeConstructor (c$, 
function () {
});
Clazz.defineMethod (c$, "set", 
function (rr) {
this.screenA =  new JU.P3 ();
this.screenB =  new JU.P3 ();
this.screenC =  new JU.P3 ();
this.vtemp =  new JU.V3 ();
this.rr = rr;
this.vwr = rr.vwr;
this.tm = rr.vwr.tm;
this.isRockets = rr.isRockets;
return this;
}, "J.renderbio.RocketsRenderer");
Clazz.defineMethod (c$, "renderRockets", 
function () {
this.g3d = this.rr.g3d;
this.tPending = false;
this.renderArrowHeads = this.rr.renderArrowHeads;
var bsVisible = this.rr.bsVisible;
for (var i = bsVisible.nextSetBit (0); i >= 0; i = bsVisible.nextSetBit (i + 1)) {
if (this.rr.structureTypes[i] === J.c.STR.HELIX || this.isRockets && this.rr.structureTypes[i] === J.c.STR.SHEET) {
this.renderSpecialSegment (this.rr.monomers[i], this.rr.getLeadColix (i), this.rr.mads[i]);
} else if (this.isRockets) {
this.renderPending ();
this.rr.renderHermiteConic (i, true, 7);
}}
this.renderPending ();
});
Clazz.defineMethod (c$, "renderSpecialSegment", 
 function (monomer, thisColix, thisMad) {
var proteinstructure = monomer.proteinStructure;
if (this.tPending) {
if (proteinstructure === this.proteinstructurePending && thisMad == this.mad && thisColix == this.colix && proteinstructure.getIndex (monomer) == this.endIndexPending + 1) {
++this.endIndexPending;
return;
}this.renderPending ();
}this.proteinstructurePending = proteinstructure;
this.startIndexPending = this.endIndexPending = proteinstructure.getIndex (monomer);
this.colix = thisColix;
this.mad = thisMad;
this.tPending = true;
}, "JM.AlphaMonomer,~N,~N");
Clazz.defineMethod (c$, "renderPending", 
 function () {
if (!this.tPending) return;
var segments = this.proteinstructurePending.getSegments ();
var renderArrowHead = (this.renderArrowHeads && this.endIndexPending == this.proteinstructurePending.nRes - 1);
if (Clazz.instanceOf (this.proteinstructurePending, JM.Helix)) this.renderPendingRocketSegment (this.endIndexPending, segments[this.startIndexPending], segments[this.endIndexPending], segments[this.endIndexPending + 1], renderArrowHead);
 else if (Clazz.instanceOf (this.proteinstructurePending, JM.Sheet)) this.renderPendingSheetPlank (segments[this.startIndexPending], segments[this.endIndexPending], segments[this.endIndexPending + 1], renderArrowHead);
this.tPending = false;
});
Clazz.defineMethod (c$, "renderPendingRocketSegment", 
 function (i, pointStart, pointBeforeEnd, pointEnd, renderArrowHead) {
if (this.g3d.setC (this.colix)) {
this.tm.transformPt3f (pointStart, this.screenA);
this.tm.transformPt3f ((renderArrowHead ? pointBeforeEnd : pointEnd), this.screenB);
var zMid = Clazz.doubleToInt (Math.floor ((this.screenA.z + this.screenB.z) / 2));
var diameter = (Clazz.floatToInt (this.vwr.tm.scaleToScreen (zMid, this.mad)));
if (!renderArrowHead || pointStart !== pointBeforeEnd) this.g3d.fillCylinderBits (2, diameter, this.screenA, this.screenB);
if (renderArrowHead) {
this.screenA.sub2 (pointEnd, pointBeforeEnd);
this.tm.transformPt3f (pointEnd, this.screenC);
var coneDiameter = (this.mad << 1) - (this.mad >> 1);
coneDiameter = Clazz.floatToInt (this.vwr.tm.scaleToScreen (Clazz.doubleToInt (Math.floor (this.screenB.z)), coneDiameter));
this.g3d.fillConeScreen3f (2, coneDiameter, this.screenB, this.screenC, false);
} else {
}if (this.startIndexPending == this.endIndexPending) return;
var t = this.screenB;
this.screenB = this.screenC;
this.screenC = t;
}}, "~N,JU.P3,JU.P3,JU.P3,~B");
Clazz.defineMethod (c$, "renderPendingSheetPlank", 
 function (ptStart, pointBeforeEnd, ptEnd, renderArrowHead) {
if (!this.g3d.setC (this.colix)) return;
if (this.corners == null) {
this.ptC =  new JU.P3 ();
this.ptTip =  new JU.P3 ();
this.vW =  new JU.V3 ();
this.vH =  new JU.V3 ();
this.screenCorners =  new Array (8);
this.corners =  new Array (8);
}if (this.corners[0] == null) for (var i = 8; --i >= 0; ) {
this.corners[i] =  new JU.P3 ();
this.screenCorners[i] =  new JU.P3 ();
}
if (renderArrowHead) {
this.setBox (1.25, 0.333, pointBeforeEnd);
this.ptTip.scaleAdd2 (-0.5, this.vH, ptEnd);
for (var i = 4; --i >= 0; ) {
var corner = this.corners[i];
corner.setT (this.ptC);
if ((i & 1) != 0) corner.add (this.vW);
if ((i & 2) != 0) corner.add (this.vH);
this.tm.transformPt3f (corner, this.screenCorners[i]);
}
this.corners[4].setT (this.ptTip);
this.tm.transformPt3f (this.ptTip, this.screenCorners[4]);
this.corners[5].add2 (this.ptTip, this.vH);
this.tm.transformPt3f (this.corners[5], this.screenCorners[5]);
this.g3d.fillTriangle3f (this.screenCorners[0], this.screenCorners[1], this.screenCorners[4], true);
this.g3d.fillTriangle3f (this.screenCorners[2], this.screenCorners[3], this.screenCorners[5], true);
for (var i = 0; i < 12; i += 4) {
var i0 = J.renderbio.RocketRenderer.arrowHeadFaces[i];
var i1 = J.renderbio.RocketRenderer.arrowHeadFaces[i + 1];
var i2 = J.renderbio.RocketRenderer.arrowHeadFaces[i + 2];
var i3 = J.renderbio.RocketRenderer.arrowHeadFaces[i + 3];
this.g3d.fillQuadrilateral (this.screenCorners[i0], this.screenCorners[i1], this.screenCorners[i2], this.screenCorners[i3]);
}
ptEnd = pointBeforeEnd;
}this.setBox (1, 0.25, ptStart);
this.vtemp.sub2 (ptEnd, ptStart);
if (this.vtemp.lengthSquared () == 0) return;
this.buildBox (this.ptC, this.vW, this.vH, this.vtemp);
for (var i = 0; i < 6; ++i) {
var i0 = J.renderbio.RocketRenderer.boxFaces[i * 4];
var i1 = J.renderbio.RocketRenderer.boxFaces[i * 4 + 1];
var i2 = J.renderbio.RocketRenderer.boxFaces[i * 4 + 2];
var i3 = J.renderbio.RocketRenderer.boxFaces[i * 4 + 3];
this.g3d.fillQuadrilateral (this.screenCorners[i0], this.screenCorners[i1], this.screenCorners[i2], this.screenCorners[i3]);
}
}, "JU.P3,JU.P3,JU.P3,~B");
Clazz.defineMethod (c$, "setBox", 
 function (w, h, pt) {
(this.proteinstructurePending).setBox (w, h, pt, this.vW, this.vH, this.ptC, this.mad / 1000);
}, "~N,~N,JU.P3");
Clazz.defineMethod (c$, "buildBox", 
 function (pointCorner, scaledWidthVector, scaledHeightVector, lengthVector) {
for (var i = 8; --i >= 0; ) {
var corner = this.corners[i];
corner.setT (pointCorner);
if ((i & 1) != 0) corner.add (scaledWidthVector);
if ((i & 2) != 0) corner.add (scaledHeightVector);
if ((i & 4) != 0) corner.add (lengthVector);
this.tm.transformPt3f (corner, this.screenCorners[i]);
}
}, "JU.P3,JU.V3,JU.V3,JU.V3");
Clazz.defineStatics (c$,
"boxFaces",  Clazz.newByteArray (-1, [0, 1, 3, 2, 0, 2, 6, 4, 0, 4, 5, 1, 7, 5, 4, 6, 7, 6, 2, 3, 7, 3, 1, 5]),
"arrowHeadFaces",  Clazz.newByteArray (-1, [0, 1, 3, 2, 0, 4, 5, 2, 1, 4, 5, 3]));
});
