Clazz.declarePackage ("J.adapter.readers.xtal");
Clazz.load (["J.adapter.smarter.AtomSetCollectionReader"], "J.adapter.readers.xtal.SiestaReader", ["java.lang.Double"], function () {
c$ = Clazz.decorateAsClass (function () {
this.noAtoms = 0;
this.unitCellData = null;
Clazz.instantialize (this, arguments);
}, J.adapter.readers.xtal, "SiestaReader", J.adapter.smarter.AtomSetCollectionReader);
Clazz.prepareFields (c$, function () {
this.unitCellData =  Clazz.newFloatArray (9, 0);
});
Clazz.overrideMethod (c$, "initializeReader", 
function () {
this.doApplySymmetry = true;
});
Clazz.overrideMethod (c$, "checkLine", 
function () {
if (this.line.contains ("%block LatticeVectors")) {
if (this.doGetModel (++this.modelNumber, null)) this.readCellThenAtomsCartesian ();
return true;
} else if (this.line.contains ("outcoor: Atomic coordinates")) {
if (this.doGetModel (++this.modelNumber, null)) this.readAtomsCartGeomThenCell ();
return true;
}return true;
});
Clazz.defineMethod (c$, "setCell", 
 function () {
this.fillFloatArray (null, 0, this.unitCellData);
this.addPrimitiveLatticeVector (0, this.unitCellData, 0);
this.addPrimitiveLatticeVector (1, this.unitCellData, 3);
this.addPrimitiveLatticeVector (2, this.unitCellData, 6);
});
Clazz.defineMethod (c$, "readCellThenAtomsCartesian", 
 function () {
this.newAtomSet ();
this.setCell ();
this.discardLinesUntilContains ("AtomicCoordinatesFormat Ang");
this.rd ();
this.setFractionalCoordinates (false);
while (this.rd () != null && this.line.indexOf ("%endblock Atomic") < 0) {
var tokens = this.getTokens ();
this.addAtomXYZSymName (tokens, 0, null, tokens[4]);
}
this.noAtoms = this.asc.ac;
});
Clazz.defineMethod (c$, "newAtomSet", 
 function () {
this.applySymmetryAndSetTrajectory ();
this.asc.newAtomSet ();
this.setSpaceGroupName ("P1");
this.setFractionalCoordinates (false);
});
Clazz.defineMethod (c$, "readAtomsCartGeomThenCell", 
 function () {
this.readLines (1);
this.newAtomSet ();
var atom0 = this.asc.ac;
for (var i = 0; i < this.noAtoms; i++) {
var tokens = this.getTokens ();
var atom = this.asc.addNewAtom ();
atom.atomName = tokens[4];
var x = this.parseFloatStr (tokens[0]);
var y = this.parseFloatStr (tokens[1]);
var z = this.parseFloatStr (tokens[2]);
atom.set (x, y, z);
this.rd ();
}
this.discardLinesUntilContains ("outcell: Unit cell vectors");
this.setCell ();
var atoms = this.asc.atoms;
var ac = this.asc.ac;
for (var i = atom0; i < ac; i++) this.setAtomCoord (atoms[i]);

this.discardLinesUntilContains ("siesta: E_KS(eV) = ");
var tokens = this.getTokens ();
var energy = Double.$valueOf (Double.parseDouble (tokens[3]));
this.asc.setAtomSetEnergy ("" + energy, energy.floatValue ());
this.asc.setCurrentModelInfo ("Energy", energy);
this.asc.setInfo ("Energy", energy);
this.asc.setAtomSetName ("Energy = " + energy + " eV");
});
});
