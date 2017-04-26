Clazz.declarePackage ("J.adapter.readers.more");
Clazz.load (["J.adapter.smarter.AtomSetCollectionReader"], "J.adapter.readers.more.BinaryDcdReader", ["JU.BS", "$.P3", "$.SB", "JU.Escape", "$.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.nModels = 0;
this.nAtoms = 0;
this.nFree = 0;
this.bsFree = null;
this.xAll = null;
this.yAll = null;
this.zAll = null;
Clazz.instantialize (this, arguments);
}, J.adapter.readers.more, "BinaryDcdReader", J.adapter.smarter.AtomSetCollectionReader);
Clazz.overrideMethod (c$, "setup", 
function (fullPath, htParams, reader) {
this.isBinary = true;
this.setupASCR (fullPath, htParams, reader);
}, "~S,java.util.Map,~O");
Clazz.overrideMethod (c$, "initializeReader", 
function () {
this.initializeTrajectoryFile ();
});
Clazz.overrideMethod (c$, "processBinaryDocument", 
function () {
var bytes =  Clazz.newByteArray (40, 0);
this.binaryDoc.setStream (null, this.binaryDoc.readInt () == 0x54);
this.binaryDoc.readInt ();
this.nModels = this.binaryDoc.readInt ();
this.binaryDoc.readInt ();
this.binaryDoc.readInt ();
this.binaryDoc.readInt ();
this.binaryDoc.readInt ();
this.binaryDoc.readInt ();
this.binaryDoc.readInt ();
var ndegf = this.binaryDoc.readInt ();
this.nFree = Clazz.doubleToInt (ndegf / 3);
var nFixed = this.binaryDoc.readInt ();
this.binaryDoc.readInt ();
this.binaryDoc.readByteArray (bytes, 0, 36);
this.binaryDoc.readInt ();
this.binaryDoc.readInt ();
this.binaryDoc.readInt ();
var sb =  new JU.SB ();
for (var i = 0, n = this.binaryDoc.readInt (); i < n; i++) sb.append (this.binaryDoc.readString (80).trim ()).appendC ('\n');

this.binaryDoc.readInt ();
JU.Logger.info ("BinaryDcdReadaer:\n" + sb);
this.binaryDoc.readInt ();
this.nAtoms = this.binaryDoc.readInt ();
this.binaryDoc.readInt ();
this.nFree = this.nAtoms - nFixed;
if (nFixed != 0) {
this.binaryDoc.readInt ();
this.bsFree = JU.BS.newN (this.nFree);
for (var i = 0; i < this.nFree; i++) this.bsFree.set (this.binaryDoc.readInt () - 1);

this.binaryDoc.readInt ();
JU.Logger.info ("free: " + this.bsFree.cardinality () + " " + JU.Escape.eBS (this.bsFree));
}this.readCoordinates ();
JU.Logger.info ("Total number of trajectory steps=" + this.trajectorySteps.size ());
});
Clazz.defineMethod (c$, "readFloatArray", 
 function () {
var n = Clazz.doubleToInt (this.binaryDoc.readInt () / 4);
var data =  Clazz.newFloatArray (n, 0);
for (var i = 0; i < n; i++) data[i] = this.binaryDoc.readFloat ();

n = Clazz.doubleToInt (this.binaryDoc.readInt () / 4);
return data;
});
Clazz.defineMethod (c$, "readCoordinates", 
 function () {
var ac = (this.bsFilter == null ? this.templateAtomCount : (this.htParams.get ("filteredAtomCount")).intValue ());
for (var i = 0; i < this.nModels; i++) if (this.doGetModel (++this.modelNumber, null)) {
var trajectoryStep =  new Array (ac);
if (!this.getTrajectoryStep (trajectoryStep)) return;
this.trajectorySteps.addLast (trajectoryStep);
if (this.isLastModel (this.modelNumber)) return;
} else {
this.readFloatArray ();
this.readFloatArray ();
this.readFloatArray ();
}
});
Clazz.defineMethod (c$, "getTrajectoryStep", 
 function (trajectoryStep) {
try {
var ac = trajectoryStep.length;
var n = -1;
var x = this.readFloatArray ();
var y = this.readFloatArray ();
var z = this.readFloatArray ();
var bs = (this.xAll == null ? null : this.bsFree);
if (bs == null) {
this.xAll = x;
this.yAll = y;
this.zAll = z;
}for (var i = 0, vpt = 0; i < this.nAtoms; i++) {
var pt =  new JU.P3 ();
if (bs == null || bs.get (i)) {
pt.set (x[vpt], y[vpt], z[vpt]);
vpt++;
} else {
pt.set (this.xAll[i], this.yAll[i], this.zAll[i]);
}if (this.bsFilter == null || this.bsFilter.get (i)) {
if (++n == ac) return true;
trajectoryStep[n] = pt;
}}
return true;
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
return false;
} else {
throw e;
}
}
}, "~A");
});
