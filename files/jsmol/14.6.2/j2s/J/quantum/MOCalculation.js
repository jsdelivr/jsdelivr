Clazz.declarePackage ("J.quantum");
Clazz.load (["J.quantum.QuantumCalculation"], "J.quantum.MOCalculation", ["J.quantum.QS", "JU.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.CX = null;
this.CY = null;
this.CZ = null;
this.DXY = null;
this.DXZ = null;
this.DYZ = null;
this.EX = null;
this.EY = null;
this.EZ = null;
this.calculationType = null;
this.shells = null;
this.gaussians = null;
this.slaters = null;
this.moCoefficients = null;
this.moCoeff = 0;
this.gaussianPtr = 0;
this.doNormalize = true;
this.nwChemMode = false;
this.dfCoefMaps = null;
this.linearCombination = null;
this.coefs = null;
this.moFactor = 1;
this.havePoints = false;
this.testing = true;
this.sum = -1;
this.c = 1;
this.nGaussians = 0;
this.doShowShellType = false;
this.warned = null;
this.coeffs = null;
this.map = null;
this.lastGaussianPtr = -1;
this.integration = 0;
this.isSquaredLinear = false;
Clazz.instantialize (this, arguments);
}, J.quantum, "MOCalculation", J.quantum.QuantumCalculation);
Clazz.prepareFields (c$, function () {
this.dfCoefMaps =  Clazz.newArray (-1, [ Clazz.newIntArray (1, 0),  Clazz.newIntArray (3, 0),  Clazz.newIntArray (4, 0),  Clazz.newIntArray (5, 0),  Clazz.newIntArray (6, 0),  Clazz.newIntArray (7, 0),  Clazz.newIntArray (10, 0)]);
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J.quantum.MOCalculation, []);
});
Clazz.defineMethod (c$, "setupCalculation", 
function (volumeData, bsSelected, calculationType, xyz, atoms, firstAtomOffset, shells, gaussians, dfCoefMaps, slaters, moCoefficients, linearCombination, isSquaredLinear, coefs, doNormalize, points) {
this.havePoints = (points != null);
this.calculationType = calculationType;
this.firstAtomOffset = firstAtomOffset;
this.shells = shells;
this.gaussians = gaussians;
if (dfCoefMaps != null) this.dfCoefMaps = dfCoefMaps;
this.coeffs =  Clazz.newDoubleArray (this.dfCoefMaps[this.dfCoefMaps.length - 1].length, 0);
this.slaters = slaters;
this.moCoefficients = moCoefficients;
this.linearCombination = linearCombination;
this.isSquaredLinear = isSquaredLinear;
this.coefs = coefs;
this.doNormalize = doNormalize;
JU.Logger.info ("Normalizing AOs: " + doNormalize + " slaters:" + (slaters != null));
this.countsXYZ = volumeData.getVoxelCounts ();
this.initialize (this.countsXYZ[0], this.countsXYZ[1], this.countsXYZ[2], points);
this.voxelData = volumeData.getVoxelData ();
this.voxelDataTemp = (isSquaredLinear ?  Clazz.newFloatArray (this.nX, this.nY, this.nZ, 0) : this.voxelData);
this.setupCoordinates (volumeData.getOriginFloat (), volumeData.getVolumetricVectorLengths (), bsSelected, xyz, atoms, points, false);
this.doDebug = (JU.Logger.debugging);
return (slaters != null || this.checkCalculationType ());
}, "J.jvxl.data.VolumeData,JU.BS,~S,~A,~A,~N,JU.Lst,~A,~A,~O,~A,~A,~B,~A,~B,~A");
Clazz.overrideMethod (c$, "initialize", 
function (nX, nY, nZ, points) {
this.initialize0 (nX, nY, nZ, points);
this.CX =  Clazz.newDoubleArray (this.nX, 0);
this.CY =  Clazz.newDoubleArray (this.nY, 0);
this.CZ =  Clazz.newDoubleArray (this.nZ, 0);
this.DXY =  Clazz.newDoubleArray (this.nX, 0);
this.DXZ =  Clazz.newDoubleArray (this.nX, 0);
this.DYZ =  Clazz.newDoubleArray (this.nY, 0);
this.EX =  Clazz.newDoubleArray (this.nX, 0);
this.EY =  Clazz.newDoubleArray (this.nY, 0);
this.EZ =  Clazz.newDoubleArray (this.nZ, 0);
}, "~N,~N,~N,~A");
Clazz.overrideMethod (c$, "createCube", 
function () {
this.setXYZBohr (this.points);
this.processPoints ();
if (!this.isSquaredLinear && (this.doDebug || this.testing)) this.calculateElectronDensity ();
});
Clazz.overrideMethod (c$, "processPoints", 
function () {
if (this.linearCombination == null) {
this.process ();
} else {
if (this.sum < 0) {
this.sum = 0;
for (var i = 0; i < this.linearCombination.length; i += 2) this.sum += this.linearCombination[i] * this.linearCombination[i];

this.sum = Math.sqrt (this.sum);
}if (this.sum == 0) return;
for (var i = 0; i < this.linearCombination.length; i += 2) {
this.moFactor = this.linearCombination[i] / this.sum;
if (this.moFactor == 0) continue;
this.moCoefficients = this.coefs[Clazz.floatToInt (this.linearCombination[i + 1]) - 1];
this.process ();
if (this.isSquaredLinear) this.addValuesSquared (1);
}
}});
Clazz.overrideMethod (c$, "process", 
function () {
this.atomIndex = this.firstAtomOffset - 1;
this.moCoeff = 0;
if (this.slaters == null) {
var nShells = this.shells.size ();
if (this.c < 0) {
this.c = 0;
for (var i = 0; i < nShells; i++) this.c += this.normalizeShell (i);

this.c = Math.sqrt (this.c);
this.atomIndex = this.firstAtomOffset - 1;
this.moCoeff = 0;
}for (var i = 0; i < nShells; i++) this.processShell (i);

return;
}for (var i = 0; i < this.slaters.length; i++) {
if (!this.processSlater (i)) break;
}
});
Clazz.defineMethod (c$, "checkCalculationType", 
 function () {
if (this.calculationType == null) {
JU.Logger.warn ("calculation type not identified -- continuing");
return true;
}this.nwChemMode = (this.calculationType.indexOf ("NWCHEM") >= 0);
if (this.nwChemMode) JU.Logger.info ("Normalization of contractions (NWCHEM)");
if (this.calculationType.indexOf ("+") >= 0 || this.calculationType.indexOf ("*") >= 0) {
JU.Logger.warn ("polarization/diffuse wavefunctions have not been tested fully: " + this.calculationType + " -- continuing");
}if (this.calculationType.indexOf ("?") >= 0) {
JU.Logger.warn ("unknown calculation type may not render correctly -- continuing");
} else if (this.points == null) {
JU.Logger.info ("calculation type: " + this.calculationType + " OK.");
}return true;
});
Clazz.defineMethod (c$, "normalizeShell", 
 function (iShell) {
var c = 0;
var shell = this.shells.get (iShell);
var basisType = shell[1];
this.gaussianPtr = shell[2];
this.nGaussians = shell[3];
this.doShowShellType = this.doDebug;
if (!this.setCoeffs (basisType, false)) return 0;
for (var i = this.map.length; --i >= 0; ) c += this.coeffs[i] * this.coeffs[i];

return c;
}, "~N");
Clazz.defineMethod (c$, "processShell", 
 function (iShell) {
var lastAtom = this.atomIndex;
var shell = this.shells.get (iShell);
this.atomIndex = shell[0] + this.firstAtomOffset;
var basisType = shell[1];
this.gaussianPtr = shell[2];
this.nGaussians = shell[3];
this.doShowShellType = this.doDebug;
if (this.atomIndex != lastAtom && (this.thisAtom = this.qmAtoms[this.atomIndex]) != null) this.thisAtom.setXYZ (this, true);
if (!this.setCoeffs (shell[1], true)) return;
if (this.havePoints) this.setMinMax (-1);
switch (basisType) {
case 0:
this.addDataS ();
break;
case 1:
this.addDataP ();
break;
case 2:
this.addDataSP ();
break;
case 3:
this.addData5D ();
break;
case 4:
this.addData6D ();
break;
case 5:
this.addData7F ();
break;
case 6:
this.addData10F ();
break;
default:
if (this.warned == null) this.warned = "";
var key = "=" + (this.atomIndex + 1) + ": " + J.quantum.QS.getQuantumShellTag (basisType);
if (this.warned.indexOf (key) < 0) {
this.warned += key;
JU.Logger.warn (" Unsupported basis type for atomno" + key);
}break;
}
}, "~N");
Clazz.defineMethod (c$, "addValuesSquared", 
 function (occupancy) {
for (var ix = this.nX; --ix >= 0; ) {
for (var iy = this.nY; --iy >= 0; ) {
for (var iz = this.nZ; --iz >= 0; ) {
var value = this.voxelDataTemp[ix][iy][iz];
if (value == 0) continue;
this.voxelData[ix][iy][iz] += value * value * occupancy;
this.voxelDataTemp[ix][iy][iz] = 0;
}
}
}
}, "~N");
Clazz.defineMethod (c$, "getContractionNormalization", 
 function (el, cpt) {
var sum;
var df = (el == 3 ? 15 : el == 2 ? 3 : 1);
var f = df * Math.pow (3.141592653589793, 1.5) / Math.pow (2, el);
var p = 0.75 + el / 2.0;
if (this.nGaussians == 1) {
sum = Math.pow (2, -2 * p) * Math.pow (this.gaussians[this.gaussianPtr][cpt], 2);
} else {
sum = 0;
for (var ig1 = 0; ig1 < this.nGaussians; ig1++) {
var alpha1 = this.gaussians[this.gaussianPtr + ig1][0];
var c1 = this.gaussians[this.gaussianPtr + ig1][cpt];
var f1 = Math.pow (alpha1, p);
for (var ig2 = 0; ig2 < this.nGaussians; ig2++) {
var alpha2 = this.gaussians[this.gaussianPtr + ig2][0];
var c2 = this.gaussians[this.gaussianPtr + ig2][cpt];
var f2 = Math.pow (alpha2, p);
sum += c1 * f1 * c2 * f2 / Math.pow (alpha1 + alpha2, 2 * p);
}
}
}sum = 1 / Math.sqrt (f * sum);
if (JU.Logger.debugging) JU.Logger.debug ("\t\t\tnormalization for l=" + el + " nGaussians=" + this.nGaussians + " is " + sum);
return sum;
}, "~N,~N");
Clazz.defineMethod (c$, "setCoeffs", 
 function (type, isProcess) {
var isOK = false;
this.map = this.dfCoefMaps[type];
if (type > J.quantum.QS.MAX_TYPE_SUPPORTED) {
if (isProcess && this.doDebug) this.dumpInfo (type);
this.moCoeff += this.map.length;
return false;
}if (isProcess && this.thisAtom == null) {
this.moCoeff += this.map.length;
return false;
}for (var i = 0; i < this.map.length; i++) isOK = new Boolean (isOK | ((this.coeffs[i] = this.moCoefficients[this.map[i] + this.moCoeff++]) != 0)).valueOf ();

isOK = new Boolean (isOK & (this.coeffs[0] != -2147483648)).valueOf ();
if (isOK && this.doDebug && isProcess) this.dumpInfo (type);
return isOK;
}, "~N,~B");
Clazz.defineMethod (c$, "addDataS", 
 function () {
var norm;
var c1;
if (this.doNormalize) {
if (this.nwChemMode) {
norm = this.getContractionNormalization (0, 1);
} else {
norm = 0.712705470;
}} else {
norm = 1;
}var m1 = this.coeffs[0];
for (var ig = 0; ig < this.nGaussians; ig++) {
var alpha = this.gaussians[this.gaussianPtr + ig][0];
c1 = this.gaussians[this.gaussianPtr + ig][1];
var a = norm * m1 * c1 * this.moFactor;
if (this.doNormalize) a *= Math.pow (alpha, 0.75);
for (var i = this.xMax; --i >= this.xMin; ) {
this.EX[i] = a * Math.exp (-this.X2[i] * alpha);
}
for (var i = this.yMax; --i >= this.yMin; ) {
this.EY[i] = Math.exp (-this.Y2[i] * alpha);
}
for (var i = this.zMax; --i >= this.zMin; ) {
this.EZ[i] = Math.exp (-this.Z2[i] * alpha);
}
for (var ix = this.xMax; --ix >= this.xMin; ) {
var eX = this.EX[ix];
if (this.havePoints) this.setMinMax (ix);
for (var iy = this.yMax; --iy >= this.yMin; ) {
var eXY = eX * this.EY[iy];
this.vd = this.voxelDataTemp[ix][(this.havePoints ? 0 : iy)];
for (var iz = this.zMax; --iz >= this.zMin; ) this.vd[(this.havePoints ? 0 : iz)] += eXY * this.EZ[iz];

}
}
}
});
Clazz.defineMethod (c$, "addDataP", 
 function () {
var mx = this.coeffs[0];
var my = this.coeffs[1];
var mz = this.coeffs[2];
var norm;
if (this.doNormalize) {
if (this.nwChemMode) {
norm = this.getContractionNormalization (1, 1);
} else {
norm = 1.42541094;
}} else {
norm = 1;
}for (var ig = 0; ig < this.nGaussians; ig++) {
var alpha = this.gaussians[this.gaussianPtr + ig][0];
var c1 = this.gaussians[this.gaussianPtr + ig][1];
var a = c1;
if (this.doNormalize) a *= Math.pow (alpha, 1.25) * norm;
this.calcSP (alpha, 0, a * mx, a * my, a * mz);
}
});
Clazz.defineMethod (c$, "addDataSP", 
 function () {
var isP = (this.map.length == 3);
var pPt = (isP ? 0 : 1);
var ms = (isP ? 0 : this.coeffs[0]);
var mx = this.coeffs[pPt++];
var my = this.coeffs[pPt++];
var mz = this.coeffs[pPt++];
var norm1;
var norm2;
if (this.doNormalize) {
if (this.nwChemMode) {
norm1 = this.getContractionNormalization (0, 1);
norm2 = this.getContractionNormalization (1, 2);
} else {
norm1 = 0.712705470;
norm2 = 1.42541094;
}} else {
norm1 = norm2 = 1;
}var a1;
var a2;
var c1;
var c2;
var alpha;
for (var ig = 0; ig < this.nGaussians; ig++) {
alpha = this.gaussians[this.gaussianPtr + ig][0];
c1 = this.gaussians[this.gaussianPtr + ig][1];
c2 = this.gaussians[this.gaussianPtr + ig][2];
a1 = c1;
a2 = c2;
if (this.doNormalize) {
a1 *= Math.pow (alpha, 0.75) * norm1;
a2 *= Math.pow (alpha, 1.25) * norm2;
}this.calcSP (alpha, a1 * ms, a2 * mx, a2 * my, a2 * mz);
}
});
Clazz.defineMethod (c$, "setCE", 
 function (alpha, as, ax, ay, az) {
for (var i = this.xMax; --i >= this.xMin; ) {
this.CX[i] = as + ax * this.X[i];
this.EX[i] = Math.exp (-this.X2[i] * alpha) * this.moFactor;
}
for (var i = this.yMax; --i >= this.yMin; ) {
this.CY[i] = ay * this.Y[i];
this.EY[i] = Math.exp (-this.Y2[i] * alpha);
}
for (var i = this.zMax; --i >= this.zMin; ) {
this.CZ[i] = az * this.Z[i];
this.EZ[i] = Math.exp (-this.Z2[i] * alpha);
}
}, "~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "setE", 
 function (EX, alpha) {
for (var i = this.xMax; --i >= this.xMin; ) EX[i] = Math.exp (-this.X2[i] * alpha) * this.moFactor;

for (var i = this.yMax; --i >= this.yMin; ) this.EY[i] = Math.exp (-this.Y2[i] * alpha);

for (var i = this.zMax; --i >= this.zMin; ) this.EZ[i] = Math.exp (-this.Z2[i] * alpha);

}, "~A,~N");
Clazz.defineMethod (c$, "calcSP", 
 function (alpha, as, ax, ay, az) {
this.setCE (alpha, as, ax, ay, az);
for (var ix = this.xMax; --ix >= this.xMin; ) {
var eX = this.EX[ix];
var cX = this.CX[ix];
if (this.havePoints) this.setMinMax (ix);
for (var iy = this.yMax; --iy >= this.yMin; ) {
var eXY = eX * this.EY[iy];
var cXY = cX + this.CY[iy];
this.vd = this.voxelDataTemp[ix][(this.havePoints ? 0 : iy)];
for (var iz = this.zMax; --iz >= this.zMin; ) {
this.vd[(this.havePoints ? 0 : iz)] += (cXY + this.CZ[iz]) * eXY * this.EZ[iz];
}
}
}
}, "~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "addData6D", 
 function () {
var mxx = this.coeffs[0];
var myy = this.coeffs[1];
var mzz = this.coeffs[2];
var mxy = this.coeffs[3];
var mxz = this.coeffs[4];
var myz = this.coeffs[5];
var norm1;
var norm2;
if (this.doNormalize) {
if (this.nwChemMode) {
norm1 = this.getContractionNormalization (2, 1);
norm2 = norm1;
} else {
norm1 = 2.8508219178923;
norm2 = norm1 / 1.7320507764816284;
}} else {
norm2 = 0.5773502795520422;
norm1 = 1;
}for (var ig = 0; ig < this.nGaussians; ig++) {
var alpha = this.gaussians[this.gaussianPtr + ig][0];
var c1 = this.gaussians[this.gaussianPtr + ig][1];
var a = c1;
if (this.doNormalize) a *= Math.pow (alpha, 1.75);
var axy = a * norm1 * mxy;
var axz = a * norm1 * mxz;
var ayz = a * norm1 * myz;
var axx = a * norm2 * mxx;
var ayy = a * norm2 * myy;
var azz = a * norm2 * mzz;
this.setCE (alpha, 0, axx, ayy, azz);
for (var i = this.xMax; --i >= this.xMin; ) {
this.DXY[i] = axy * this.X[i];
this.DXZ[i] = axz * this.X[i];
}
for (var i = this.yMax; --i >= this.yMin; ) {
this.DYZ[i] = ayz * this.Y[i];
}
for (var ix = this.xMax; --ix >= this.xMin; ) {
var axx_x2 = this.CX[ix] * this.X[ix];
var axy_x = this.DXY[ix];
var axz_x = this.DXZ[ix];
var eX = this.EX[ix];
if (this.havePoints) this.setMinMax (ix);
for (var iy = this.yMax; --iy >= this.yMin; ) {
var axx_x2__ayy_y2__axy_xy = axx_x2 + (this.CY[iy] + axy_x) * this.Y[iy];
var axz_x__ayz_y = axz_x + this.DYZ[iy];
var eXY = eX * this.EY[iy];
this.vd = this.voxelDataTemp[ix][(this.havePoints ? 0 : iy)];
for (var iz = this.zMax; --iz >= this.zMin; ) {
this.vd[(this.havePoints ? 0 : iz)] += (axx_x2__ayy_y2__axy_xy + (this.CZ[iz] + axz_x__ayz_y) * this.Z[iz]) * eXY * this.EZ[iz];
}
}
}
}
});
Clazz.defineMethod (c$, "addData5D", 
 function () {
var alpha;
var c1;
var a;
var x;
var y;
var z;
var cxx;
var cyy;
var czz;
var cxy;
var cxz;
var cyz;
var ad0;
var ad1p;
var ad1n;
var ad2p;
var ad2n;
var norm1;
var norm2;
var norm3;
var norm4;
if (this.doNormalize) {
if (this.nwChemMode) {
norm2 = this.getContractionNormalization (2, 1);
norm1 = norm2 * 1.7320507764816284;
norm4 = -1;
} else {
norm1 = Math.pow (66.05114251919257, 0.25);
norm2 = norm1 / 1.7320507764816284;
norm4 = 1;
}norm3 = 0.8660253882408142;
} else {
norm1 = norm2 = norm3 = norm4 = 1;
}var m0 = this.coeffs[0];
var m1p = this.coeffs[1];
var m1n = this.coeffs[2];
var m2p = this.coeffs[3];
var m2n = this.coeffs[4];
for (var ig = 0; ig < this.nGaussians; ig++) {
alpha = this.gaussians[this.gaussianPtr + ig][0];
c1 = this.gaussians[this.gaussianPtr + ig][1];
a = c1;
if (this.doNormalize) a *= Math.pow (alpha, 1.75);
ad0 = a * m0;
ad1p = norm4 * a * m1p;
ad1n = a * m1n;
ad2p = a * m2p;
ad2n = a * m2n;
this.setE (this.EX, alpha);
for (var ix = this.xMax; --ix >= this.xMin; ) {
x = this.X[ix];
var eX = this.EX[ix];
cxx = norm2 * x * x;
if (this.havePoints) this.setMinMax (ix);
for (var iy = this.yMax; --iy >= this.yMin; ) {
y = this.Y[iy];
var eXY = eX * this.EY[iy];
cyy = norm2 * y * y;
cxy = norm1 * x * y;
this.vd = this.voxelDataTemp[ix][(this.havePoints ? 0 : iy)];
for (var iz = this.zMax; --iz >= this.zMin; ) {
z = this.Z[iz];
czz = norm2 * z * z;
cxz = norm1 * x * z;
cyz = norm1 * y * z;
this.vd[(this.havePoints ? 0 : iz)] += (ad0 * (czz - 0.5 * (cxx + cyy)) + ad1p * cxz + ad1n * cyz + ad2p * norm3 * (cxx - cyy) + ad2n * cxy) * eXY * this.EZ[iz];
}
}
}
}
});
Clazz.defineMethod (c$, "addData10F", 
 function () {
var alpha;
var c1;
var a;
var x;
var y;
var z;
var xx;
var yy;
var zz;
var axxx;
var ayyy;
var azzz;
var axyy;
var axxy;
var axxz;
var axzz;
var ayzz;
var ayyz;
var axyz;
var cxxx;
var cyyy;
var czzz;
var cxyy;
var cxxy;
var cxxz;
var cxzz;
var cyzz;
var cyyz;
var cxyz;
var norm1;
var norm2;
var norm3;
if (this.doNormalize) {
if (this.nwChemMode) {
norm1 = this.getContractionNormalization (3, 1);
norm2 = norm1;
norm3 = norm1;
} else {
norm1 = 5.701643762839922;
norm2 = 3.2918455612989796;
norm3 = 1.4721580892990938;
}} else {
norm1 = norm2 = norm3 = 1;
}var mxxx = this.coeffs[0];
var myyy = this.coeffs[1];
var mzzz = this.coeffs[2];
var mxyy = this.coeffs[3];
var mxxy = this.coeffs[4];
var mxxz = this.coeffs[5];
var mxzz = this.coeffs[6];
var myzz = this.coeffs[7];
var myyz = this.coeffs[8];
var mxyz = this.coeffs[9];
for (var ig = 0; ig < this.nGaussians; ig++) {
alpha = this.gaussians[this.gaussianPtr + ig][0];
c1 = this.gaussians[this.gaussianPtr + ig][1];
this.setE (this.EX, alpha);
a = c1;
if (this.doNormalize) a *= Math.pow (alpha, 2.25);
axxx = a * norm3 * mxxx;
ayyy = a * norm3 * myyy;
azzz = a * norm3 * mzzz;
axyy = a * norm2 * mxyy;
axxy = a * norm2 * mxxy;
axxz = a * norm2 * mxxz;
axzz = a * norm2 * mxzz;
ayzz = a * norm2 * myzz;
ayyz = a * norm2 * myyz;
axyz = a * norm1 * mxyz;
for (var ix = this.xMax; --ix >= this.xMin; ) {
x = this.X[ix];
xx = x * x;
var Ex = this.EX[ix];
cxxx = axxx * xx * x;
if (this.havePoints) this.setMinMax (ix);
for (var iy = this.yMax; --iy >= this.yMin; ) {
y = this.Y[iy];
yy = y * y;
var Exy = Ex * this.EY[iy];
cyyy = ayyy * yy * y;
cxxy = axxy * xx * y;
cxyy = axyy * x * yy;
this.vd = this.voxelDataTemp[ix][(this.havePoints ? 0 : iy)];
for (var iz = this.zMax; --iz >= this.zMin; ) {
z = this.Z[iz];
zz = z * z;
czzz = azzz * zz * z;
cxxz = axxz * xx * z;
cxzz = axzz * x * zz;
cyyz = ayyz * yy * z;
cyzz = ayzz * y * zz;
cxyz = axyz * x * y * z;
this.vd[(this.havePoints ? 0 : iz)] += (cxxx + cyyy + czzz + cxyy + cxxy + cxxz + cxzz + cyzz + cyyz + cxyz) * Exy * this.EZ[iz];
}
}
}
}
});
Clazz.defineMethod (c$, "addData7F", 
 function () {
var alpha;
var c1;
var a;
var x;
var y;
var z;
var xx;
var yy;
var zz;
var cxxx;
var cyyy;
var czzz;
var cxyy;
var cxxy;
var cxxz;
var cxzz;
var cyzz;
var cyyz;
var cxyz;
var af0;
var af1p;
var af1n;
var af2p;
var af2n;
var af3p;
var af3n;
var f0;
var f1p;
var f1n;
var f2p;
var f2n;
var f3p;
var f3n;
var norm1;
var norm2;
var norm3;
var norm4;
if (this.doNormalize) {
if (this.nwChemMode) {
norm3 = this.getContractionNormalization (3, 1);
norm2 = norm3 * Math.sqrt (5);
norm1 = norm3 * Math.sqrt (15);
norm4 = -1;
} else {
norm1 = 5.701643762839922;
norm2 = 3.2918455612989796;
norm3 = 1.4721580892990938;
norm4 = 1;
}} else {
norm1 = norm2 = norm3 = norm4 = 1;
}var c0_xxz_yyz = 0.6708203932499369;
var c1p_xzz = 1.0954451150103321;
var c1p_xxx = 0.6123724356957945;
var c1p_xyy = 0.27386127875258304;
var c1n_yzz = 1.0954451150103321;
var c1n_yyy = 0.6123724356957945;
var c1n_xxy = 0.27386127875258304;
var c2p_xxz_yyz = 0.8660254037844386;
var c3p_xxx = 0.7905694150420949;
var c3p_xyy = 1.0606601717798214;
var c3n_yyy = 0.7905694150420949;
var c3n_xxy = 1.0606601717798214;
var m0 = this.coeffs[0];
var m1p = this.coeffs[1];
var m1n = this.coeffs[2];
var m2p = this.coeffs[3];
var m2n = this.coeffs[4];
var m3p = this.coeffs[5];
var m3n = this.coeffs[6];
for (var ig = 0; ig < this.nGaussians; ig++) {
alpha = this.gaussians[this.gaussianPtr + ig][0];
c1 = this.gaussians[this.gaussianPtr + ig][1];
a = c1;
if (this.doNormalize) a *= Math.pow (alpha, 2.25);
af0 = a * m0;
af1p = a * m1p;
af1n = a * m1n;
af2p = a * m2p;
af2n = a * m2n;
af3p = a * m3p;
af3n = a * m3n;
this.setE (this.EX, alpha);
for (var ix = this.xMax; --ix >= this.xMin; ) {
x = this.X[ix];
xx = x * x;
var eX = this.EX[ix];
cxxx = norm3 * x * xx;
if (this.havePoints) this.setMinMax (ix);
for (var iy = this.yMax; --iy >= this.yMin; ) {
y = this.Y[iy];
yy = y * y;
var eXY = eX * this.EY[iy];
cyyy = norm3 * y * yy;
cxyy = norm2 * x * yy;
cxxy = norm2 * xx * y;
this.vd = this.voxelDataTemp[ix][(this.havePoints ? 0 : iy)];
for (var iz = this.zMax; --iz >= this.zMin; ) {
z = this.Z[iz];
zz = z * z;
czzz = norm3 * z * zz;
cxxz = norm2 * xx * z;
cxzz = norm2 * x * zz;
cyyz = norm2 * yy * z;
cyzz = norm2 * y * zz;
cxyz = norm1 * x * y * z;
f0 = af0 * (czzz - 0.6708203932499369 * (cxxz + cyyz));
f1p = norm4 * af1p * (1.0954451150103321 * cxzz - 0.6123724356957945 * cxxx - 0.27386127875258304 * cxyy);
f1n = af1n * (1.0954451150103321 * cyzz - 0.6123724356957945 * cyyy - 0.27386127875258304 * cxxy);
f2p = af2p * (0.8660254037844386 * (cxxz - cyyz));
f2n = af2n * cxyz;
f3p = norm4 * af3p * (0.7905694150420949 * cxxx - 1.0606601717798214 * cxyy);
f3n = -af3n * (0.7905694150420949 * cyyy - 1.0606601717798214 * cxxy);
this.vd[(this.havePoints ? 0 : iz)] += (f0 + f1p + f1n + f2p + f2n + f3p + f3n) * eXY * this.EZ[iz];
}
}
}
}
});
Clazz.defineMethod (c$, "processSlater", 
 function (slaterIndex) {
var lastAtom = this.atomIndex;
var slater = this.slaters[slaterIndex];
this.atomIndex = slater.iAtom;
var minuszeta = -slater.zeta;
if ((this.thisAtom = this.qmAtoms[this.atomIndex]) == null) {
if (minuszeta <= 0) this.moCoeff++;
return true;
}if (minuszeta > 0) {
minuszeta = -minuszeta;
this.moCoeff--;
}if (this.moCoeff >= this.moCoefficients.length) return false;
var coef = slater.coef * this.moCoefficients[this.moCoeff++];
if (coef == 0) {
this.atomIndex = -1;
return true;
}coef *= this.moFactor;
if (this.atomIndex != lastAtom) this.thisAtom.setXYZ (this, true);
var a = slater.x;
var b = slater.y;
var c = slater.z;
var d = slater.r;
if (a == -2) for (var ix = this.xMax; --ix >= this.xMin; ) {
var dx2 = this.X2[ix];
if (this.havePoints) this.setMinMax (ix);
for (var iy = this.yMax; --iy >= this.yMin; ) {
var dy2 = this.Y2[iy];
var dx2y2 = dx2 + dy2;
this.vd = this.voxelDataTemp[ix][(this.havePoints ? 0 : iy)];
for (var iz = this.zMax; --iz >= this.zMin; ) {
var dz2 = this.Z2[iz];
var r2 = dx2y2 + dz2;
var r = Math.sqrt (r2);
var exponent = minuszeta * r;
if (exponent < -50.0) continue;
var value = (coef * Math.exp (exponent) * (3 * dz2 - r2));
switch (d) {
case 3:
value *= r;
case 2:
value *= r2;
break;
case 1:
value *= r;
break;
}
this.vd[(this.havePoints ? 0 : iz)] += value;
}
}
}
 else if (b == -2) for (var ix = this.xMax; --ix >= this.xMin; ) {
var dx2 = this.X2[ix];
if (this.havePoints) this.setMinMax (ix);
for (var iy = this.yMax; --iy >= this.yMin; ) {
var dy2 = this.Y2[iy];
var dx2y2 = dx2 + dy2;
var dx2my2 = coef * (dx2 - dy2);
this.vd = this.voxelDataTemp[ix][(this.havePoints ? 0 : iy)];
for (var iz = this.zMax; --iz >= this.zMin; ) {
var dz2 = this.Z2[iz];
var r2 = dx2y2 + dz2;
var r = Math.sqrt (r2);
var exponent = minuszeta * r;
if (exponent < -50.0) continue;
var value = dx2my2 * Math.exp (exponent);
switch (d) {
case 3:
value *= r;
case 2:
value *= r2;
break;
case 1:
value *= r;
break;
}
this.vd[(this.havePoints ? 0 : iz)] += value;
}
}
}
 else for (var ix = this.xMax; --ix >= this.xMin; ) {
var dx2 = this.X2[ix];
var vdx = coef;
switch (a) {
case 3:
vdx *= this.X[ix];
case 2:
vdx *= dx2;
break;
case 1:
vdx *= this.X[ix];
break;
}
if (this.havePoints) this.setMinMax (ix);
for (var iy = this.yMax; --iy >= this.yMin; ) {
var dy2 = this.Y2[iy];
var dx2y2 = dx2 + dy2;
var vdy = vdx;
switch (b) {
case 3:
vdy *= this.Y[iy];
case 2:
vdy *= dy2;
break;
case 1:
vdy *= this.Y[iy];
break;
}
this.vd = this.voxelDataTemp[ix][(this.havePoints ? 0 : iy)];
for (var iz = this.zMax; --iz >= this.zMin; ) {
var dz2 = this.Z2[iz];
var r2 = dx2y2 + dz2;
var r = Math.sqrt (r2);
var exponent = minuszeta * r;
if (exponent < -50.0) continue;
var value = vdy * Math.exp (exponent);
switch (c) {
case 3:
value *= this.Z[iz];
case 2:
value *= dz2;
break;
case 1:
value *= this.Z[iz];
break;
}
switch (d) {
case 3:
value *= r;
case 2:
value *= r2;
break;
case 1:
value *= r;
break;
}
this.vd[(this.havePoints ? 0 : iz)] += value;
}
}
}
return true;
}, "~N");
Clazz.defineMethod (c$, "dumpInfo", 
 function (shell) {
if (this.doShowShellType) {
JU.Logger.debug ("\n\t\t\tprocessShell: " + shell + " type=" + J.quantum.QS.getQuantumShellTag (shell) + " nGaussians=" + this.nGaussians + " atom=" + this.atomIndex);
this.doShowShellType = false;
}if (JU.Logger.isActiveLevel (6) && this.gaussianPtr != this.lastGaussianPtr) {
this.lastGaussianPtr = this.gaussianPtr;
for (var ig = 0; ig < this.nGaussians; ig++) {
var alpha = this.gaussians[this.gaussianPtr + ig][0];
var c1 = this.gaussians[this.gaussianPtr + ig][1];
JU.Logger.debug ("\t\t\tGaussian " + (ig + 1) + " alpha=" + alpha + " c=" + c1);
}
}var so = J.quantum.MOCalculation.getShellOrder (shell);
for (var i = 0; i < this.map.length; i++) {
var n = this.map[i] + this.moCoeff - this.map.length + i + 1;
var c = this.coeffs[i];
JU.Logger.debug ("MO coeff " + (so == null ? "?" : so[i]) + " " + n + "\t" + c + "\t" + this.thisAtom.atom);
}
}, "~N");
c$.getShellOrder = Clazz.defineMethod (c$, "getShellOrder", 
 function (i) {
return (i < 0 || i >= J.quantum.MOCalculation.shellOrder.length ? null : J.quantum.MOCalculation.shellOrder[i]);
}, "~N");
Clazz.defineMethod (c$, "calculateElectronDensity", 
function () {
if (this.points != null) return;
for (var ix = this.nX; --ix >= 0; ) for (var iy = this.nY; --iy >= 0; ) for (var iz = this.nZ; --iz >= 0; ) {
var x = this.voxelData[ix][iy][iz];
this.integration += x * x;
}


var volume = this.stepBohr[0] * this.stepBohr[1] * this.stepBohr[2];
this.integration *= volume;
JU.Logger.info ("Integrated density = " + this.integration);
});
Clazz.defineStatics (c$,
"CUT", -50,
"ROOT3", 1.73205080756887729,
"shellOrder",  Clazz.newArray (-1, [ Clazz.newArray (-1, ["S"]),  Clazz.newArray (-1, ["X", "Y", "Z"]),  Clazz.newArray (-1, ["S", "X", "Y", "Z"]),  Clazz.newArray (-1, ["d0/z2", "d1+/xz", "d1-/yz", "d2+/x2-y2", "d2-/xy"]),  Clazz.newArray (-1, ["XX", "YY", "ZZ", "XY", "XZ", "YZ"]),  Clazz.newArray (-1, ["f0/2z3-3x2z-3y2z", "f1+/4xz2-x3-xy2", "f1-/4yz2-x2y-y3", "f2+/x2z-y2z", "f2-/xyz", "f3+/x3-3xy2", "f3-/3x2y-y3"]),  Clazz.newArray (-1, ["XXX", "YYY", "ZZZ", "XYY", "XXY", "XXZ", "XZZ", "YZZ", "YYZ", "XYZ"])]));
});
