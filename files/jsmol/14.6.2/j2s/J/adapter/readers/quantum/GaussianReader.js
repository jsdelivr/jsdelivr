Clazz.declarePackage ("J.adapter.readers.quantum");
Clazz.load (["J.adapter.readers.quantum.MOReader", "JU.BS"], "J.adapter.readers.quantum.GaussianReader", ["java.lang.Exception", "$.Float", "java.util.Hashtable", "JU.AU", "$.Lst", "$.PT", "$.V3", "J.adapter.readers.quantum.BasisFunctionReader", "J.adapter.smarter.SmarterJmolAdapter", "J.quantum.QS", "JU.Escape", "$.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.energyString = "";
this.energyKey = "";
this.calculationNumber = 1;
this.scanPoint = -1;
this.equivalentAtomSets = 0;
this.stepNumber = 0;
this.moModelSet = -1;
this.namedSets = null;
this.isHighPrecision = false;
this.haveHighPrecision = false;
this.allowHighPrecision = false;
Clazz.instantialize (this, arguments);
}, J.adapter.readers.quantum, "GaussianReader", J.adapter.readers.quantum.MOReader);
Clazz.prepareFields (c$, function () {
this.namedSets =  new JU.BS ();
});
Clazz.defineMethod (c$, "initializeReader", 
function () {
this.allowHighPrecision = !this.checkAndRemoveFilterKey ("NOHP");
Clazz.superCall (this, J.adapter.readers.quantum.GaussianReader, "initializeReader", []);
});
Clazz.overrideMethod (c$, "checkLine", 
function () {
if (this.line.startsWith (" Step number")) {
this.equivalentAtomSets = 0;
this.stepNumber++;
var scanPointIndex = this.line.indexOf ("scan point");
if (scanPointIndex > 0) {
this.scanPoint = this.parseIntAt (this.line, scanPointIndex + 10);
} else {
this.scanPoint = -1;
}return true;
}if (this.line.indexOf ("-- Stationary point found") > 0) {
if (this.scanPoint >= 0) this.scanPoint++;
return true;
}if (this.line.indexOf ("Input orientation:") >= 0 || this.line.indexOf ("Z-Matrix orientation:") >= 0 || this.line.indexOf ("Standard orientation:") >= 0) {
if (!this.doGetModel (++this.modelNumber, null)) {
return this.checkLastModel ();
}this.equivalentAtomSets++;
JU.Logger.info (this.asc.atomSetCount + " model " + this.modelNumber + " step " + this.stepNumber + " equivalentAtomSet " + this.equivalentAtomSets + " calculation " + this.calculationNumber + " scan point " + this.scanPoint + this.line);
this.readAtoms ();
return false;
}if (!this.doProcessLines) return true;
if (this.line.startsWith (" Energy=")) {
this.setEnergy ();
return true;
}if (this.line.startsWith (" SCF Done:")) {
this.readSCFDone ();
return true;
}if (this.line.startsWith (" Harmonic frequencies")) {
this.readFrequencies (":", true);
return true;
}if (this.line.startsWith (" Total atomic charges:") || this.line.startsWith (" Mulliken atomic charges:")) {
this.readPartialCharges ();
return true;
}if (this.line.startsWith (" Dipole moment")) {
this.readDipoleMoment ();
return true;
}if (this.line.startsWith (" Standard basis:") || this.line.startsWith (" General basis read from")) {
this.energyUnits = "";
this.calculationType = this.line.substring (this.line.indexOf (":") + 1).trim ();
return true;
}if (this.line.startsWith (" AO basis set")) {
this.readBasis ();
return true;
}if (this.line.indexOf ("Molecular Orbital Coefficients") >= 0 || this.line.indexOf ("Natural Orbital Coefficients") >= 0 || this.line.indexOf ("Natural Transition Orbitals") >= 0) {
if (!this.filterMO ()) return true;
this.readMolecularOrbitals ();
JU.Logger.info (this.orbitals.size () + " molecular orbitals read");
return true;
}if (this.line.startsWith (" Normal termination of Gaussian")) {
++this.calculationNumber;
this.equivalentAtomSets = 0;
return true;
}if (this.line.startsWith (" Mulliken atomic spin densities:")) {
this.getSpinDensities (11);
return true;
}if (this.line.startsWith (" Mulliken charges and spin densities:")) {
this.getSpinDensities (21);
return true;
}return this.checkNboLine ();
});
Clazz.defineMethod (c$, "getSpinDensities", 
 function (pt) {
this.rd ();
var data =  Clazz.newFloatArray (this.asc.getLastAtomSetAtomCount (), 0);
for (var i = 0; i < data.length; i++) data[i] = this.parseFloatStr (this.rd ().substring (pt, pt + 10));

this.asc.setAtomProperties ("spin", data, -1, false);
this.appendLoadNote (data.length + " spin densities loaded into model " + (this.asc.iSet + 1));
}, "~N");
Clazz.defineMethod (c$, "readSCFDone", 
 function () {
var tokens = JU.PT.getTokensAt (this.line, 11);
if (tokens.length < 4) return;
this.energyKey = tokens[0];
this.asc.setAtomSetEnergy (tokens[2], this.parseFloatStr (tokens[2]));
this.energyString = tokens[2] + " " + tokens[3];
this.setNames (this.energyKey + " = " + this.energyString, this.namedSets, this.equivalentAtomSets);
this.setProps (this.energyKey, this.energyString, this.equivalentAtomSets);
tokens = JU.PT.getTokens (this.rd ());
if (tokens.length > 2) {
this.setProps (tokens[0], tokens[2], this.equivalentAtomSets);
if (tokens.length > 5) this.setProps (tokens[3], tokens[5], this.equivalentAtomSets);
tokens = JU.PT.getTokens (this.rd ());
}if (tokens.length > 2) this.setProps (tokens[0], tokens[2], this.equivalentAtomSets);
});
Clazz.defineMethod (c$, "setProps", 
 function (key, value, n) {
for (var i = this.asc.iSet; --n >= 0 && i >= 0; --i) this.asc.setAtomSetModelPropertyForSet (key, value, i);

}, "~S,~S,~N");
Clazz.defineMethod (c$, "setNames", 
 function (atomSetName, namedSets, n) {
for (var i = this.asc.iSet; --n >= 0 && i >= 0; --i) if (namedSets == null || !namedSets.get (i)) this.asc.setModelInfoForSet ("name", atomSetName, i);

}, "~S,JU.BS,~N");
Clazz.defineMethod (c$, "setEnergy", 
 function () {
var tokens = this.getTokens ();
this.energyKey = "Energy";
this.energyString = tokens[1];
this.setNames ("Energy = " + tokens[1], this.namedSets, this.equivalentAtomSets);
this.asc.setAtomSetEnergy (this.energyString, this.parseFloatStr (this.energyString));
});
Clazz.defineMethod (c$, "readAtoms", 
function () {
this.asc.newAtomSet ();
this.haveHighPrecision = false;
if (this.energyKey.length != 0) this.asc.setAtomSetName (this.energyKey + " = " + this.energyString);
this.asc.setAtomSetEnergy (this.energyString, this.parseFloatStr (this.energyString));
var path = this.getTokens ()[0];
this.readLines (4);
var tokens;
while (this.rd () != null && !this.line.startsWith (" --")) {
tokens = this.getTokens ();
var atom = this.asc.addNewAtom ();
atom.elementNumber = this.parseIntStr (tokens[1]);
if (atom.elementNumber < 0) atom.elementNumber = 0;
this.setAtomCoordTokens (atom, tokens, tokens.length - 3);
}
this.asc.setAtomSetModelProperty (".PATH", "Calculation " + this.calculationNumber + (this.scanPoint >= 0 ? (J.adapter.smarter.SmarterJmolAdapter.PATH_SEPARATOR + "Scan Point " + this.scanPoint) : "") + J.adapter.smarter.SmarterJmolAdapter.PATH_SEPARATOR + path);
});
Clazz.defineMethod (c$, "readBasis", 
function () {
this.shells =  new JU.Lst ();
var gdata =  new JU.Lst ();
var ac = 0;
this.gaussianCount = 0;
this.shellCount = 0;
var lastAtom = "";
var tokens;
var doSphericalD = (this.calculationType != null && (this.calculationType.indexOf ("5D") > 0));
var doSphericalF = (this.calculationType != null && (this.calculationType.indexOf ("7F") > 0));
var isGeneral = (this.line.indexOf ("general basis input") >= 0);
if (isGeneral) {
while (this.rd () != null && this.line.length > 0) {
this.shellCount++;
tokens = this.getTokens ();
ac++;
while (this.rd ().indexOf ("****") < 0) {
var slater =  Clazz.newIntArray (4, 0);
slater[0] = ac - 1;
tokens = this.getTokens ();
var oType = tokens[0];
if (doSphericalF && oType.indexOf ("F") >= 0 || doSphericalD && oType.indexOf ("D") >= 0) slater[1] = J.adapter.readers.quantum.BasisFunctionReader.getQuantumShellTagIDSpherical (oType);
 else slater[1] = J.adapter.readers.quantum.BasisFunctionReader.getQuantumShellTagID (oType);
var nGaussians = this.parseIntStr (tokens[1]);
slater[2] = this.gaussianCount;
slater[3] = nGaussians;
if (this.debugging) JU.Logger.debug ("Slater " + this.shells.size () + " " + JU.Escape.eAI (slater));
this.shells.addLast (slater);
this.gaussianCount += nGaussians;
for (var i = 0; i < nGaussians; i++) {
this.rd ();
this.line = JU.PT.rep (this.line, "D ", "D+");
tokens = this.getTokens ();
if (this.debugging) JU.Logger.debug ("Gaussians " + (i + 1) + " " + JU.Escape.eAS (tokens, true));
gdata.addLast (tokens);
}
}
}
} else {
while (this.rd () != null && this.line.startsWith (" Atom")) {
this.shellCount++;
tokens = this.getTokens ();
var slater =  Clazz.newIntArray (4, 0);
if (!tokens[1].equals (lastAtom)) ac++;
lastAtom = tokens[1];
slater[0] = ac - 1;
var oType = tokens[4];
if (doSphericalF && oType.indexOf ("F") >= 0 || doSphericalD && oType.indexOf ("D") >= 0) slater[1] = J.adapter.readers.quantum.BasisFunctionReader.getQuantumShellTagIDSpherical (oType);
 else slater[1] = J.adapter.readers.quantum.BasisFunctionReader.getQuantumShellTagID (oType);
var nGaussians = this.parseIntStr (tokens[5]);
slater[2] = this.gaussianCount;
slater[3] = nGaussians;
this.shells.addLast (slater);
this.gaussianCount += nGaussians;
for (var i = 0; i < nGaussians; i++) {
gdata.addLast (JU.PT.getTokens (this.rd ()));
}
}
}if (ac == 0) ac = 1;
this.gaussians = JU.AU.newFloat2 (this.gaussianCount);
for (var i = 0; i < this.gaussianCount; i++) {
tokens = gdata.get (i);
this.gaussians[i] =  Clazz.newFloatArray (tokens.length, 0);
for (var j = 0; j < tokens.length; j++) this.gaussians[i][j] = this.parseFloatStr (tokens[j]);

}
JU.Logger.info (this.shellCount + " slater shells read");
JU.Logger.info (this.gaussianCount + " gaussian primitives read");
});
Clazz.defineMethod (c$, "readMolecularOrbitals", 
function () {
if (this.shells == null) return;
var mos = JU.AU.createArrayOfHashtable (5);
var data = JU.AU.createArrayOfArrayList (5);
var nThisLine = 0;
var isNOtype = this.line.contains ("Natural Orbital");
while (this.rd () != null && this.line.toUpperCase ().indexOf ("DENS") < 0) {
var tokens;
if (this.line.indexOf ("eta Molecular Orbital Coefficients") >= 0) {
this.addMOData (nThisLine, data, mos);
nThisLine = 0;
if (!this.filterMO ()) break;
}if (this.line.indexOf ("                    ") == 0) {
this.addMOData (nThisLine, data, mos);
if (isNOtype) {
tokens = this.getTokens ();
nThisLine = tokens.length;
tokens = JU.PT.getTokens (this.rd ());
} else {
tokens = JU.PT.getTokens (this.rd ());
nThisLine = tokens.length;
}for (var i = 0; i < nThisLine; i++) {
mos[i] =  new java.util.Hashtable ();
data[i] =  new JU.Lst ();
var sym;
if (isNOtype) {
mos[i].put ("occupancy", Float.$valueOf (JU.PT.parseFloat (tokens[i + 2])));
} else {
sym = tokens[i];
mos[i].put ("symmetry", sym);
if (sym.indexOf ("O") >= 0) mos[i].put ("occupancy", Float.$valueOf (2));
 else if (sym.indexOf ("V") >= 0) mos[i].put ("occupancy", Float.$valueOf (0));
}}
if (isNOtype) continue;
this.line = this.rd ().substring (21);
tokens = this.getTokens ();
if (tokens.length != nThisLine) tokens = J.adapter.smarter.AtomSetCollectionReader.getStrings (this.line, nThisLine, 10);
for (var i = 0; i < nThisLine; i++) {
mos[i].put ("energy", Float.$valueOf (JU.PT.fVal (tokens[i])));
}
continue;
} else if (this.line.length < 21 || (this.line.charAt (5) != ' ' && !JU.PT.isDigit (this.line.charAt (5)))) {
continue;
}try {
this.line = JU.PT.rep (this.line, " 0 ", "0  ");
tokens = this.getTokens ();
var type = tokens[tokens.length - nThisLine - 1].substring (1);
if (JU.PT.isDigit (type.charAt (0))) type = type.substring (1);
if (!J.quantum.QS.isQuantumBasisSupported (type.charAt (0)) && "XYZ".indexOf (type.charAt (0)) >= 0) type = (type.length == 2 ? "D" : "F") + type;
if (!J.quantum.QS.isQuantumBasisSupported (type.charAt (0))) continue;
tokens = J.adapter.smarter.AtomSetCollectionReader.getStrings (this.line.substring (this.line.length - 10 * nThisLine), nThisLine, 10);
for (var i = 0; i < nThisLine; i++) data[i].addLast (tokens[i]);

} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
JU.Logger.error ("Error reading Gaussian file Molecular Orbitals at line: " + this.line);
break;
} else {
throw e;
}
}
}
this.addMOData (nThisLine, data, mos);
this.setMOData (this.moModelSet != this.asc.atomSetCount);
this.moModelSet = this.asc.atomSetCount;
});
Clazz.defineMethod (c$, "readFrequencies", 
function (key, mustHave) {
this.discardLinesUntilContains2 (key, ":");
if (this.line == null && mustHave) throw ( new Exception ("No frequencies encountered"));
while ((this.line = this.rd ()) != null && this.line.length > 15) {
var symmetries = JU.PT.getTokens (this.rd ());
this.discardLinesUntilContains (" Frequencies");
this.isHighPrecision = (this.line.indexOf ("---") > 0);
if (this.isHighPrecision ? !this.allowHighPrecision : this.haveHighPrecision) return;
if (this.isHighPrecision && !this.haveHighPrecision) {
this.appendLoadNote ("high precision vibrational modes enabled. Use filter 'NOHP' to disable.");
this.haveHighPrecision = true;
}var width = (this.isHighPrecision ? 22 : 15);
var frequencies = JU.PT.getTokensAt (this.line, width);
var red_masses = JU.PT.getTokensAt (this.discardLinesUntilContains (this.isHighPrecision ? "Reduced masses" : "Red. masses"), width);
var frc_consts = JU.PT.getTokensAt (this.discardLinesUntilContains (this.isHighPrecision ? "Force constants" : "Frc consts"), width);
var intensities = JU.PT.getTokensAt (this.discardLinesUntilContains (this.isHighPrecision ? "IR Intensities" : "IR Inten"), width);
var iAtom0 = this.asc.ac;
var ac = this.asc.getLastAtomSetAtomCount ();
var frequencyCount = frequencies.length;
var ignore =  Clazz.newBooleanArray (frequencyCount, false);
for (var i = 0; i < frequencyCount; ++i) {
ignore[i] = !this.doGetVibration (++this.vibrationNumber);
if (ignore[i]) continue;
this.asc.cloneAtomSetWithBonds (true);
var name = this.asc.setAtomSetFrequency ("Calculation " + this.calculationNumber, symmetries[i], frequencies[i], null);
this.appendLoadNote ("model " + this.asc.atomSetCount + ": " + name);
this.namedSets.set (this.asc.iSet);
this.asc.setAtomSetModelProperty ("ReducedMass", red_masses[i] + " AMU");
this.asc.setAtomSetModelProperty ("ForceConstant", frc_consts[i] + " mDyne/A");
this.asc.setAtomSetModelProperty ("IRIntensity", intensities[i] + " KM/Mole");
}
this.discardLinesUntilContains (" Atom ");
if (this.isHighPrecision) this.fillFrequencyData (iAtom0, ac, ac, ignore, false, 23, 10, null, 0);
 else this.fillFrequencyData (iAtom0, ac, ac, ignore, true, 0, 0, null, 0);
}
}, "~S,~B");
Clazz.defineMethod (c$, "readDipoleMoment", 
function () {
var tokens = JU.PT.getTokens (this.rd ());
if (tokens.length != 8) return;
var dipole = JU.V3.new3 (this.parseFloatStr (tokens[1]), this.parseFloatStr (tokens[3]), this.parseFloatStr (tokens[5]));
JU.Logger.info ("Molecular dipole for model " + this.asc.atomSetCount + " = " + dipole);
this.asc.setCurrentModelInfo ("dipole", dipole);
});
Clazz.defineMethod (c$, "readPartialCharges", 
function () {
this.rd ();
var ac = this.asc.ac;
var i0 = this.asc.getLastAtomSetAtomIndex ();
var atoms = this.asc.atoms;
for (var i = i0; i < ac; ++i) {
while (atoms[i].elementNumber == 0) ++i;

var charge = this.parseFloatStr (JU.PT.getTokens (this.rd ())[2]);
atoms[i].partialCharge = charge;
}
JU.Logger.info ("Mulliken charges found for Model " + this.asc.atomSetCount);
});
Clazz.defineStatics (c$,
"STD_ORIENTATION_ATOMIC_NUMBER_OFFSET", 1);
});
