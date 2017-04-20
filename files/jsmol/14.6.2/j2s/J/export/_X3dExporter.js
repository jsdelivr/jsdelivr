Clazz.declarePackage ("J.export");
Clazz.load (["J.export._VrmlExporter"], "J.export._X3dExporter", ["JU.Lst", "$.PT", "J.export.UseTable", "JV.Viewer"], function () {
c$ = Clazz.declareType (J["export"], "_X3dExporter", J["export"]._VrmlExporter);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J["export"]._X3dExporter, []);
this.useTable =  new J["export"].UseTable ("USE='");
});
Clazz.overrideMethod (c$, "outputHeader", 
function () {
this.output ("<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\n");
this.output ("<!DOCTYPE X3D PUBLIC \"ISO//Web3D//DTD X3D 3.1//EN\" \"http://www.web3d.org/specifications/x3d-3.1.dtd\">\n");
this.output ("<X3D profile=\'Immersive\' version=\'3.1\' xmlns:xsd=\'http://www.w3.org/2001/XMLSchema-instance\' xsd:noNamespaceSchemaLocation=\' http://www.web3d.org/specifications/x3d-3.1.xsd \'>\n");
this.output ("<head>\n");
this.output ("<meta name='title' content=" + JU.PT.esc (this.vwr.ms.modelSetName).$replace ('<', ' ').$replace ('>', ' ').$replace ('&', ' ') + "/>\n");
this.output ("<meta name='description' content='Jmol rendering'/>\n");
this.output ("<meta name='creator' content=' '/>\n");
this.output ("<meta name='created' content='" + this.getExportDate () + "'/>\n");
this.output ("<meta name='generator' content='Jmol " + JV.Viewer.getJmolVersion () + ", http://www.jmol.org'/>\n");
this.output ("<meta name='license' content='http://www.gnu.org/licenses/licenses.html#LGPL'/>\n");
this.output ("</head>\n");
this.output ("<Scene>\n");
this.output ("<NavigationInfo type='EXAMINE'/>\n");
this.output ("<Background skyColor='" + this.rgbFractionalFromColix (this.backgroundColix) + "'/>\n");
var angle = this.getViewpoint ();
this.output ("<Viewpoint fieldOfView='" + angle);
this.output ("' position='");
this.output (this.cameraPosition);
this.output ("' orientation='");
this.output (this.tempP1);
this.output (" " + -this.viewpoint.angle + "'\n jump='true' description='v1'/>\n");
this.output ("\n  <!-- ");
this.output (this.getJmolPerspective ());
this.output ("\n  -->\n\n");
this.output ("<Transform translation='");
this.tempP1.setT (this.center);
this.tempP1.scale (-1);
this.output (this.tempP1);
this.output ("'>\n");
});
Clazz.overrideMethod (c$, "outputFooter", 
function () {
this.useTable = null;
this.output ("</Transform>\n");
this.output ("</Scene>\n");
this.output ("</X3D>\n");
});
Clazz.overrideMethod (c$, "outputAppearance", 
function (colix, isText) {
var def = this.useTable.getDef ((isText ? "T" : "") + colix);
this.output ("<Appearance ");
if (def.charAt (0) == '_') {
var color = this.rgbFractionalFromColix (colix);
this.output ("DEF='" + def + "'><Material diffuseColor='");
if (isText) this.output ("0 0 0' specularColor='0 0 0' ambientIntensity='0.0' shininess='0.0' emissiveColor='" + color + "'/>");
 else this.output (color + "' transparency='" + J["export"].___Exporter.translucencyFractionalFromColix (colix) + "'/>");
} else this.output (def + ">");
this.output ("</Appearance>");
}, "~N,~B");
Clazz.defineMethod (c$, "outputTransRot", 
function (pt1, pt2, x, y, z) {
this.output (" ");
this.outputTransRot (pt1, pt2, x, y, z, "='", "'");
}, "JU.P3,JU.P3,~N,~N,~N");
Clazz.overrideMethod (c$, "outputCircle", 
function (pt1, pt2, radius, colix, doFill) {
if (doFill) {
this.output ("<Transform translation='");
this.tempV1.ave (this.tempP3, pt1);
this.output (this.tempV1);
this.output ("'><Billboard axisOfRotation='0 0 0'><Transform rotation='1 0 0 1.5708'>");
this.outputCylinderChildScaled (pt1, this.tempP3, colix, 2, radius);
this.output ("</Transform></Billboard>");
this.output ("</Transform>\n");
return;
}var child = this.useTable.getDef ("C" + colix + "_" + radius);
this.output ("<Transform");
this.outputTransRot (this.tempP3, pt1, 0, 0, 1);
this.tempP3.set (1, 1, 1);
this.tempP3.scale (radius);
this.output (" scale='");
this.output (this.tempP3);
this.output ("'>\n<Billboard ");
if (child.charAt (0) == '_') {
this.output ("DEF='" + child + "'");
this.output (" axisOfRotation='0 0 0'><Transform>");
this.output ("<Shape><Extrusion beginCap='false' convex='false' endCap='false' creaseAngle='1.57'");
this.output (" crossSection='");
var rpd = 0.017453292;
var scale = 0.02 / radius;
for (var i = 0; i <= 360; i += 10) {
this.output (J["export"].___Exporter.round (Math.cos (i * rpd) * scale) + " ");
this.output (J["export"].___Exporter.round (Math.sin (i * rpd) * scale) + " ");
}
this.output ("' spine='");
for (var i = 0; i <= 360; i += 10) {
this.output (J["export"].___Exporter.round (Math.cos (i * rpd)) + " ");
this.output (J["export"].___Exporter.round (Math.sin (i * rpd)) + " 0 ");
}
this.output ("'/>");
this.outputAppearance (colix, false);
this.output ("</Shape></Transform>");
} else {
this.output (child + ">");
}this.output ("</Billboard>\n");
this.output ("</Transform>\n");
}, "JU.P3,JU.P3,~N,~N,~B");
Clazz.overrideMethod (c$, "outputCone", 
function (ptBase, ptTip, radius, colix) {
radius = this.scale (radius);
var height = this.scale (ptBase.distance (ptTip));
this.output ("<Transform");
this.outputTransRot (ptBase, ptTip, 0, 1, 0);
this.output (">\n<Shape ");
var cone = "o" + Clazz.floatToInt (height * 100) + "_" + Clazz.floatToInt (radius * 100);
var child = this.useTable.getDef ("c" + cone + "_" + colix);
if (child.charAt (0) == '_') {
this.output ("DEF='" + child + "'>");
cone = this.useTable.getDef (cone);
this.output ("<Cone ");
if (cone.charAt (0) == '_') {
this.output ("DEF='" + cone + "' height='" + J["export"].___Exporter.round (height) + "' bottomRadius='" + J["export"].___Exporter.round (radius) + "'/>");
} else {
this.output (cone + "/>");
}this.outputAppearance (colix, false);
} else {
this.output (child + ">");
}this.output ("</Shape>\n");
this.output ("</Transform>\n");
}, "JU.P3,JU.P3,~N,~N");
Clazz.overrideMethod (c$, "outputCylinder", 
function (ptCenter, pt1, pt2, colix, endcaps, radius, ptX, ptY, checkRadius) {
this.output ("<Transform");
if (ptX == null) {
this.outputTransRot (pt1, pt2, 0, 1, 0);
} else {
this.output (" translation='");
this.output (ptCenter);
this.output ("'");
this.outputQuaternionFrame (ptCenter, ptY, pt1, ptX, 2, "='", "'");
pt1.set (0, 0, -1);
pt2.set (0, 0, 1);
}this.output (">\n");
this.outputCylinderChildScaled (pt1, pt2, colix, endcaps, radius);
this.output ("\n</Transform>\n");
if (endcaps == 3) {
this.outputSphere (pt1, radius * 1.01, colix, true);
this.outputSphere (pt2, radius * 1.01, colix, true);
}return true;
}, "JU.P3,JU.P3,JU.P3,~N,~N,~N,JU.P3,JU.P3,~B");
Clazz.overrideMethod (c$, "outputCylinderChildScaled", 
function (pt1, pt2, colix, endcaps, radius) {
var length = this.scale (pt1.distance (pt2));
radius = this.scale (radius);
var child = this.useTable.getDef ("C" + colix + "_" + Clazz.floatToInt (length * 100) + "_" + radius + "_" + endcaps);
this.output ("<Shape ");
if (child.charAt (0) == '_') {
this.output ("DEF='" + child + "'>");
this.output ("<Cylinder ");
var cyl = this.useTable.getDef ("c" + J["export"].___Exporter.round (length) + "_" + endcaps + "_" + radius);
if (cyl.charAt (0) == '_') {
this.output ("DEF='" + cyl + "' height='" + J["export"].___Exporter.round (length) + "' radius='" + radius + "'" + (endcaps == 2 ? "" : " top='false' bottom='false'") + "/>");
} else {
this.output (cyl + "/>");
}this.outputAppearance (colix, false);
} else {
this.output (child + ">");
}this.output ("</Shape>");
}, "JU.P3,JU.P3,~N,~N,~N");
Clazz.overrideMethod (c$, "outputEllipsoid", 
function (center, points, colix) {
this.output ("<Transform translation='");
this.output (center);
this.output ("'");
this.outputQuaternionFrame (center, points[1], points[3], points[5], 1, "='", "'");
this.output (">");
this.tempP3.set (0, 0, 0);
this.outputSphereChildUnscaled (this.tempP3, 1.0, colix);
this.output ("</Transform>\n");
}, "JU.P3,~A,~N");
Clazz.overrideMethod (c$, "outputSphereChildUnscaled", 
function (center, radius, colix) {
this.output ("<Transform translation='");
this.output (center);
this.output ("'>\n<Shape ");
var child = this.useTable.getDef ("S" + colix + "_" + Clazz.floatToInt (radius * 100));
if (child.charAt (0) == '_') {
this.output ("DEF='" + child + "'>");
this.output ("<Sphere radius='" + radius + "'/>");
this.outputAppearance (colix, false);
} else {
this.output (child + ">");
}this.output ("</Shape>\n");
this.output ("</Transform>\n");
}, "JU.T3,~N,~N");
Clazz.overrideMethod (c$, "outputSurface", 
function (vertices, normals, colixes, indices, polygonColixes, nVertices, nPolygons, nFaces, bsPolygons, faceVertexMax, colix, colorList, htColixes, offset) {
this.output ("<Shape>\n");
this.outputAppearance (colix, false);
this.output ("<IndexedFaceSet \n");
if (polygonColixes != null) this.output (" colorPerVertex='false'\n");
this.output ("coordIndex='\n");
var map =  Clazz.newIntArray (nVertices, 0);
this.getCoordinateMap (vertices, map, null);
this.outputIndices (indices, map, nPolygons, bsPolygons, faceVertexMax);
this.output ("'\n");
var vNormals = null;
if (normals != null) {
vNormals =  new JU.Lst ();
map = this.getNormalMap (normals, nVertices, null, vNormals);
this.output ("  solid='false'\n  normalPerVertex='true'\n  normalIndex='\n");
this.outputIndices (indices, map, nPolygons, bsPolygons, faceVertexMax);
this.output ("'\n");
}map = null;
if (colorList != null) {
this.output ("  colorIndex='\n");
this.outputColorIndices (indices, nPolygons, bsPolygons, faceVertexMax, htColixes, colixes, polygonColixes);
this.output ("'\n");
}this.output (">\n");
this.output ("<Coordinate point='\n");
this.outputVertices (vertices, nVertices, offset);
this.output ("'/>\n");
if (normals != null) {
this.output ("<Normal vector='\n");
this.outputNormals (vNormals);
vNormals = null;
this.output ("'/>\n");
}if (colorList != null) {
this.output ("<Color color='\n");
this.outputColors (colorList);
this.output ("'/>\n");
}this.output ("</IndexedFaceSet>\n");
this.output ("</Shape>\n");
}, "~A,~A,~A,~A,~A,~N,~N,~N,JU.BS,~N,~N,JU.Lst,java.util.Map,JU.P3");
Clazz.overrideMethod (c$, "outputTriangle", 
function (pt1, pt2, pt3, colix) {
this.output ("<Shape>\n");
this.output ("<IndexedFaceSet solid='false' ");
this.output ("coordIndex='0 1 2 -1'>");
this.output ("<Coordinate point='");
this.output (pt1);
this.output (" ");
this.output (pt2);
this.output (" ");
this.output (pt3);
this.output ("'/>");
this.output ("</IndexedFaceSet>\n");
this.outputAppearance (colix, false);
this.output ("\n</Shape>\n");
}, "JU.T3,JU.T3,JU.T3,~N");
Clazz.overrideMethod (c$, "outputTextPixel", 
function (pt, argb) {
}, "JU.P3,~N");
Clazz.overrideMethod (c$, "plotText", 
function (x, y, z, colix, text, font3d) {
this.output ("<Transform translation='");
this.output (this.setFont (x, y, z, colix, text, font3d));
this.output ("'>");
this.output ("<Billboard ");
if (this.fontChild.charAt (0) == '_') {
this.output ("DEF='" + this.fontChild + "' axisOfRotation='0 0 0'>" + "<Transform translation='0.0 0.0 0.0'>" + "<Shape>");
this.outputAppearance (colix, true);
this.output ("<Text string=" + JU.PT.esc (text) + ">");
this.output ("<FontStyle ");
var fontstyle = this.useTable.getDef ("F" + this.fontFace + this.fontStyle);
if (fontstyle.charAt (0) == '_') {
this.output ("DEF='" + fontstyle + "' size='" + this.fontSize + "' family='" + this.fontFace + "' style='" + this.fontStyle + "'/>");
} else {
this.output (fontstyle + "/>");
}this.output ("</Text>");
this.output ("</Shape>");
this.output ("</Transform>");
} else {
this.output (this.fontChild + ">");
}this.output ("</Billboard>\n");
this.output ("</Transform>\n");
}, "~N,~N,~N,~N,~S,javajs.awt.Font");
});
