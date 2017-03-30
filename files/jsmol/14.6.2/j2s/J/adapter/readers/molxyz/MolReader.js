Clazz.declarePackage ("J.adapter.readers.molxyz");
Clazz.load (["J.adapter.smarter.AtomSetCollectionReader"], "J.adapter.readers.molxyz.MolReader", ["java.lang.Exception", "$.Float", "JU.PT", "J.adapter.smarter.Atom", "J.api.JmolAdapter", "JU.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.optimize2D = false;
this.haveAtomSerials = false;
this.dimension = null;
this.allow2D = true;
this.iatom0 = 0;
this.vr = null;
Clazz.instantialize (this, arguments);
}, J.adapter.readers.molxyz, "MolReader", J.adapter.smarter.AtomSetCollectionReader);
Clazz.overrideMethod (c$, "initializeReader", 
function () {
this.optimize2D = this.checkFilterKey ("2D");
});
Clazz.overrideMethod (c$, "checkLine", 
function () {
var isMDL = (this.line.startsWith ("$MDL"));
if (isMDL) {
this.discardLinesUntilStartsWith ("$HDR");
this.rd ();
if (this.line == null) {
JU.Logger.warn ("$HDR not found in MDL RG file");
this.continuing = false;
return false;
}} else if (this.line.equals ("M  END")) return true;
if (this.doGetModel (++this.modelNumber, null)) {
this.iatom0 = this.asc.ac;
this.processMolSdHeader ();
this.processCtab (isMDL);
this.vr = null;
if (this.isLastModel (this.modelNumber)) {
this.continuing = false;
return false;
}}if (this.line != null && this.line.indexOf ("$$$$") < 0) this.discardLinesUntilStartsWith ("$$$$");
return true;
});
Clazz.overrideMethod (c$, "finalizeSubclassReader", 
function () {
this.finalizeReaderMR ();
});
Clazz.defineMethod (c$, "finalizeReaderMR", 
function () {
if (this.optimize2D) this.set2D ();
this.isTrajectory = false;
this.finalizeReaderASCR ();
});
Clazz.defineMethod (c$, "processMolSdHeader", 
 function () {
var header = "";
var thisDataSetName = this.line.trim ();
header += this.line + "\n";
this.asc.setCollectionName (thisDataSetName);
this.rd ();
if (this.line == null) return;
header += this.line + "\n";
this.dimension = (this.line.length < 22 ? "3D" : this.line.substring (20, 22));
if (this.dimension.equals ("2D")) {
if (!this.allow2D) throw  new Exception ("File is 2D, not 3D");
this.appendLoadNote ("This model is 2D. Its 3D structure has not been generated.");
}this.asc.setInfo ("dimension", this.dimension);
this.rd ();
if (this.line == null) return;
this.line = this.line.trim ();
header += this.line + "\n";
if (this.line.length != 0) {
thisDataSetName += ": " + this.line;
}JU.Logger.info (header);
this.checkCurrentLineForScript ();
this.asc.setInfo ("fileHeader", header);
this.newAtomSet (thisDataSetName);
});
Clazz.defineMethod (c$, "processCtab", 
 function (isMDL) {
if (isMDL) this.discardLinesUntilStartsWith ("$CTAB");
if (this.rd () == null) return;
if (this.line.indexOf ("V3000") >= 0) {
this.optimize2D = (this.dimension.equals ("2D"));
this.vr = (this.getInterface ("J.adapter.readers.molxyz.V3000Rdr")).set (this);
this.discardLinesUntilContains ("COUNTS");
this.vr.readAtomsAndBonds (this.getTokens ());
} else {
this.readAtomsAndBonds (this.parseIntRange (this.line, 0, 3), this.parseIntRange (this.line, 3, 6));
}this.applySymmetryAndSetTrajectory ();
}, "~B");
Clazz.defineMethod (c$, "readAtomsAndBonds", 
 function (ac, bc) {
for (var i = 0; i < ac; ++i) {
this.rd ();
var len = this.line.length;
var elementSymbol;
var x;
var y;
var z;
var charge = 0;
var isotope = 0;
var iAtom = -2147483648;
x = this.parseFloatRange (this.line, 0, 10);
y = this.parseFloatRange (this.line, 10, 20);
z = this.parseFloatRange (this.line, 20, 30);
if (len < 34) {
elementSymbol = this.line.substring (31).trim ();
} else {
elementSymbol = this.line.substring (31, 34).trim ();
if (len >= 39) {
var code = this.parseIntRange (this.line, 36, 39);
if (code >= 1 && code <= 7) charge = 4 - code;
code = this.parseIntRange (this.line, 34, 36);
if (code != 0 && code >= -3 && code <= 4) {
isotope = J.api.JmolAdapter.getNaturalIsotope (J.api.JmolAdapter.getElementNumber (elementSymbol));
switch (isotope) {
case 0:
break;
case 1:
isotope = -code;
break;
default:
isotope += code;
}
}if (iAtom == -2147483648 && this.haveAtomSerials) iAtom = i + 1;
}}this.addMolAtom (iAtom, isotope, elementSymbol, charge, x, y, z);
}
for (var i = 0; i < bc; ++i) {
this.rd ();
var iAtom1;
var iAtom2;
var stereo = 0;
iAtom1 = this.line.substring (0, 3).trim ();
iAtom2 = this.line.substring (3, 6).trim ();
var order = this.parseIntRange (this.line, 6, 9);
if (this.optimize2D && order == 1 && this.line.length >= 12) stereo = this.parseIntRange (this.line, 9, 12);
order = this.fixOrder (order, stereo);
if (this.haveAtomSerials) this.asc.addNewBondFromNames (iAtom1, iAtom2, order);
 else this.asc.addNewBondWithOrder (this.iatom0 + this.parseIntStr (iAtom1) - 1, this.iatom0 + this.parseIntStr (iAtom2) - 1, order);
}
while (this.rd () != null && this.line.indexOf ("$$$$") != 0) {
if (this.line.toUpperCase ().contains ("_PARTIAL_CHARGES")) {
try {
var atoms = this.asc.atoms;
for (var i = this.parseIntStr (this.rd ()); --i >= 0; ) {
var tokens = JU.PT.getTokens (this.rd ());
var atomIndex = this.parseIntStr (tokens[0]) + this.iatom0 - 1;
var partialCharge = this.parseFloatStr (tokens[1]);
if (!Float.isNaN (partialCharge)) atoms[atomIndex].partialCharge = partialCharge;
}
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
return;
} else {
throw e;
}
}
}}
}, "~N,~N");
Clazz.defineMethod (c$, "addMolAtom", 
function (iAtom, isotope, elementSymbol, charge, x, y, z) {
switch (isotope) {
case 0:
break;
case -1:
elementSymbol = "D";
break;
case -2:
elementSymbol = "T";
break;
default:
elementSymbol = isotope + elementSymbol;
}
if (this.optimize2D && z != 0) this.optimize2D = false;
var atom =  new J.adapter.smarter.Atom ();
atom.elementSymbol = elementSymbol;
atom.formalCharge = charge;
this.setAtomCoordXYZ (atom, x, y, z);
if (iAtom == -2147483648) {
this.asc.addAtom (atom);
} else {
this.haveAtomSerials = true;
atom.atomSerial = iAtom;
this.asc.addAtomWithMappedSerialNumber (atom);
}}, "~N,~N,~S,~N,~N,~N,~N");
Clazz.defineMethod (c$, "fixOrder", 
function (order, stereo) {
switch (order) {
default:
case 0:
case -10:
return 1;
case 1:
switch (stereo) {
case 1:
return 1025;
case 3:
case 6:
return 1041;
}
break;
case 2:
case 3:
break;
case 4:
return 515;
case 5:
return 66;
case 6:
return 513;
case 7:
return 514;
case 8:
case 9:
return 33;
}
return order;
}, "~N,~N");
Clazz.defineMethod (c$, "addMolBond", 
function (iAtom1, iAtom2, order, stereo) {
order = this.fixOrder (order, stereo);
if (this.haveAtomSerials) this.asc.addNewBondFromNames (iAtom1, iAtom2, order);
 else this.asc.addNewBondWithOrder (this.iatom0 + this.parseIntStr (iAtom1) - 1, this.iatom0 + this.parseIntStr (iAtom2) - 1, order);
}, "~S,~S,~N,~N");
});
