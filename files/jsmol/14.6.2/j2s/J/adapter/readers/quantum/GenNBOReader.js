Clazz.declarePackage ("J.adapter.readers.quantum");
Clazz.load (["J.adapter.readers.quantum.MOReader"], "J.adapter.readers.quantum.GenNBOReader", ["java.lang.Boolean", "$.Exception", "$.Float", "java.util.Hashtable", "JU.AU", "$.Lst", "$.PT", "$.Rdr", "$.SB", "J.quantum.QS", "JU.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.isOutputFile = false;
this.nboType = "";
this.nOrbitals0 = 0;
this.isArchive = false;
Clazz.instantialize (this, arguments);
}, J.adapter.readers.quantum, "GenNBOReader", J.adapter.readers.quantum.MOReader);
Clazz.defineMethod (c$, "initializeReader", 
function () {
var line1 = this.rd ().trim ();
this.isArchive = (line1.indexOf ("$GENNBO") >= 0 || line1.indexOf ("$NBO") >= 0);
if (this.isArchive) {
this.readData47 ();
return;
}var isOK;
var line2 = this.rd ();
this.line = line1 + line2;
this.isOutputFile = (line2.indexOf ("****") >= 0);
if (this.isOutputFile) {
isOK = this.getFile31 ();
Clazz.superCall (this, J.adapter.readers.quantum.GenNBOReader, "initializeReader", []);
this.moData.put ("isNormalized", Boolean.TRUE);
} else if (line2.indexOf ("s in the AO basis:") >= 0) {
this.nboType = line2.substring (1, line2.indexOf ("s"));
this.asc.setCollectionName (line1 + ": " + this.nboType + "s");
isOK = this.getFile31 ();
} else {
this.nboType = "AO";
this.asc.setCollectionName (line1 + ": " + this.nboType + "s");
isOK = this.readData31 (line1);
}if (!isOK) JU.Logger.error ("Unimplemented shell type -- no orbitals avaliable: " + this.line);
if (this.isOutputFile) return;
if (isOK) this.readMOs ();
this.continuing = false;
});
Clazz.overrideMethod (c$, "finalizeSubclassReader", 
function () {
this.appendLoadNote ("NBO type " + this.nboType);
this.finalizeReaderASCR ();
});
Clazz.defineMethod (c$, "readMOs", 
 function () {
this.nOrbitals0 = this.orbitals.size ();
this.getFile46 ();
var isMO = !this.nboType.equals ("AO");
var nAOs = this.nOrbitals;
this.nOrbitals = this.orbitals.size ();
this.line = null;
for (var i = this.nOrbitals0; i < this.nOrbitals; i++) {
var mo = this.orbitals.get (i);
var coefs =  Clazz.newFloatArray (nAOs, 0);
mo.put ("coefficients", coefs);
if (isMO) {
if (this.line == null) {
while (this.rd () != null && Float.isNaN (this.parseFloatStr (this.line))) {
}
} else {
this.line = null;
}this.fillFloatArray (this.line, 0, coefs);
this.line = null;
} else {
coefs[i] = 1;
}}
if (this.nboType.equals ("NBO")) {
var occupancies =  Clazz.newFloatArray (this.nOrbitals - this.nOrbitals0, 0);
this.fillFloatArray (null, 0, occupancies);
for (var i = this.nOrbitals0; i < this.nOrbitals; i++) {
var mo = this.orbitals.get (i);
mo.put ("occupancy", Float.$valueOf (occupancies[i - this.nOrbitals0]));
}
}this.moData.put (this.nboType + "_coefs", this.orbitals);
this.setMOData (false);
this.moData.put ("isNormalized", Boolean.TRUE);
this.moData.put ("nboType", this.nboType);
JU.Logger.info ((this.orbitals.size () - this.nOrbitals0) + " orbitals read");
});
Clazz.overrideMethod (c$, "checkLine", 
function () {
if (this.line.indexOf ("SECOND ORDER PERTURBATION THEORY ANALYSIS") >= 0 && !this.orbitalsRead) {
this.nboType = "NBO";
var data = this.getFileData (".37");
if (data == null) return true;
var readerSave = this.reader;
this.reader = JU.Rdr.getBR (data);
this.rd ();
this.rd ();
this.readMOs ();
this.reader = readerSave;
this.orbitalsRead = false;
return true;
}return this.checkNboLine ();
});
Clazz.defineMethod (c$, "getFileData", 
 function (ext) {
var fileName = this.htParams.get ("fullPathName");
var pt = fileName.lastIndexOf (".");
if (pt < 0) pt = fileName.length;
fileName = fileName.substring (0, pt);
this.moData.put ("nboRoot", fileName);
fileName += ext;
var data = this.vwr.getFileAsString3 (fileName, false, null);
JU.Logger.info (data.length + " bytes read from " + fileName);
if (data.length == 0 || data.indexOf ("java.io.FileNotFound") >= 0) throw  new Exception (" supplemental file " + fileName + " was not found");
return data;
}, "~S");
Clazz.defineMethod (c$, "getFile31", 
 function () {
var data = this.getFileData (".31");
var readerSave = this.reader;
this.reader = JU.Rdr.getBR (data);
return (this.readData31 (null) && (this.reader = readerSave) != null);
});
Clazz.defineMethod (c$, "getFile46", 
 function () {
var data = this.getFileData (".46");
var readerSave = this.reader;
this.reader = JU.Rdr.getBR (data);
this.readData46 ();
this.reader = readerSave;
});
Clazz.defineMethod (c$, "readData47", 
 function () {
this.allowNoOrbitals = true;
this.discardLinesUntilContains ("$COORD");
this.asc.newAtomSet ();
this.asc.setAtomSetName (this.rd ().trim ());
while (this.rd ().indexOf ("$END") < 0) {
var tokens = this.getTokens ();
this.addAtomXYZSymName (tokens, 2, null, null).elementNumber = this.parseIntStr (tokens[0]);
}
this.discardLinesUntilContains ("$BASIS");
var centers = this.getIntData ();
var labels = this.getIntData ();
this.discardLinesUntilContains ("NSHELL =");
this.shellCount = this.parseIntAt (this.line, 10);
this.gaussianCount = this.parseIntAt (this.rd (), 10);
this.rd ();
var ncomp = this.getIntData ();
var nprim = this.getIntData ();
var nptr = this.getIntData ();
this.shells =  new JU.Lst ();
this.gaussians = JU.AU.newFloat2 (this.gaussianCount);
for (var i = 0; i < this.gaussianCount; i++) this.gaussians[i] =  Clazz.newFloatArray (6, 0);

this.nOrbitals = 0;
var ptCenter = 0;
var l = this.line;
for (var i = 0; i < this.shellCount; i++) {
var slater =  Clazz.newIntArray (4, 0);
var nc = ncomp[i];
slater[0] = centers[ptCenter] - 1;
this.line = "";
for (var ii = 0; ii < nc; ii++) this.line += labels[ptCenter++] + " ";

if (!this.fillSlater (slater, nc, nptr[i] - 1, nprim[i])) return;
}
this.line = l;
this.getAlphasAndExponents ();
this.nboType = "AO";
this.readMOs ();
this.continuing = false;
});
Clazz.defineMethod (c$, "getIntData", 
 function () {
while (this.line.indexOf ("=") < 0) this.rd ();

var s = this.line.substring (this.line.indexOf ("=") + 1);
this.line = "";
while (this.rd ().indexOf ("=") < 0 && this.line.indexOf ("$") < 0) s += this.line;

var tokens = JU.PT.getTokens (s);
var f =  Clazz.newIntArray (tokens.length, 0);
for (var i = f.length; --i >= 0; ) f[i] = this.parseIntStr (tokens[i]);

return f;
});
Clazz.defineMethod (c$, "fillSlater", 
 function (slater, n, pt, ng) {
this.nOrbitals += n;
switch (n) {
case 1:
slater[1] = 0;
break;
case 3:
if (!this.getDFMap (this.line, 1, J.adapter.readers.quantum.GenNBOReader.$P_LIST, 3)) return false;
slater[1] = 1;
break;
case 4:
if (!this.getDFMap (this.line, 2, J.adapter.readers.quantum.GenNBOReader.SP_LIST, 1)) return false;
slater[1] = 2;
break;
case 5:
if (!this.getDFMap (this.line, 3, J.adapter.readers.quantum.GenNBOReader.$DS_LIST, 3)) return false;
slater[1] = 3;
break;
case 6:
if (!this.getDFMap (this.line, 4, J.adapter.readers.quantum.GenNBOReader.$DC_LIST, 3)) return false;
slater[1] = 4;
break;
case 7:
if (!this.getDFMap (this.line, 5, J.adapter.readers.quantum.GenNBOReader.$FS_LIST, 3)) return false;
slater[1] = 5;
break;
case 10:
if (!this.getDFMap (this.line, 6, J.adapter.readers.quantum.GenNBOReader.$FC_LIST, 3)) return false;
slater[1] = 6;
break;
}
slater[2] = pt;
slater[3] = ng;
this.shells.addLast (slater);
return true;
}, "~A,~N,~N,~N");
Clazz.defineMethod (c$, "getAlphasAndExponents", 
 function () {
for (var j = 0; j < 5; j++) {
if (this.line.indexOf ("=") < 0) this.rd ();
if (this.line.indexOf ("$END") >= 0) break;
this.line = this.line.substring (this.line.indexOf ("=") + 1);
var temp = this.fillFloatArray (this.line, 0,  Clazz.newFloatArray (this.gaussianCount, 0));
for (var i = 0; i < this.gaussianCount; i++) {
this.gaussians[i][j] = temp[i];
if (j > 1) this.gaussians[i][5] += temp[i];
}
}
for (var i = 0; i < this.gaussianCount; i++) {
if (this.gaussians[i][1] == 0) this.gaussians[i][1] = this.gaussians[i][5];
}
if (this.debugging) {
JU.Logger.debug (this.shells.size () + " slater shells read");
JU.Logger.debug (this.gaussians.length + " gaussian primitives read");
}});
Clazz.defineMethod (c$, "readData31", 
 function (line1) {
if (line1 == null) {
line1 = this.rd ();
this.rd ();
}this.rd ();
var tokens = JU.PT.getTokens (this.rd ());
var ac = this.parseIntStr (tokens[0]);
this.shellCount = this.parseIntStr (tokens[1]);
this.gaussianCount = this.parseIntStr (tokens[2]);
this.rd ();
this.asc.newAtomSet ();
this.asc.setAtomSetName (this.nboType + "s: " + line1.trim ());
this.asc.setCurrentModelInfo ("nboType", this.nboType);
for (var i = 0; i < ac; i++) {
tokens = JU.PT.getTokens (this.rd ());
var z = this.parseIntStr (tokens[0]);
if (z < 0) continue;
var atom = this.asc.addNewAtom ();
atom.elementNumber = z;
this.setAtomCoordTokens (atom, tokens, 1);
}
this.shells =  new JU.Lst ();
this.gaussians = JU.AU.newFloat2 (this.gaussianCount);
for (var i = 0; i < this.gaussianCount; i++) this.gaussians[i] =  Clazz.newFloatArray (6, 0);

this.rd ();
this.nOrbitals = 0;
for (var i = 0; i < this.shellCount; i++) {
tokens = JU.PT.getTokens (this.rd ());
var slater =  Clazz.newIntArray (4, 0);
slater[0] = this.parseIntStr (tokens[0]) - 1;
var n = this.parseIntStr (tokens[1]);
var pt = this.parseIntStr (tokens[2]) - 1;
var ng = this.parseIntStr (tokens[3]);
this.line = this.rd ().trim ();
if (!this.fillSlater (slater, n, pt, ng)) return false;
}
this.rd ();
this.getAlphasAndExponents ();
return true;
}, "~S");
Clazz.defineMethod (c$, "readData46", 
 function () {
var tokens = JU.PT.getTokens (this.rd ());
var ipt = 1;
if (tokens[1].equals ("ALPHA")) {
ipt = 2;
if (this.haveNboOrbitals) {
tokens = JU.PT.getTokens (this.discardLinesUntilContains ("BETA"));
this.alphaBeta = "beta";
} else {
this.alphaBeta = "alpha";
this.haveNboOrbitals = true;
}this.line = tokens[0] + " " + tokens[2];
}if (this.parseIntStr (tokens[ipt]) != this.nOrbitals) {
JU.Logger.error ("file 46 number of orbitals does not match nOrbitals: " + this.nOrbitals);
return;
}var sb =  new JU.SB ();
sb.append (this.line);
while (this.rd () != null && this.line.indexOf ("ALPHA") < 0 && this.line.indexOf ("BETA") < 0) sb.append (this.line);

sb.appendC (' ');
var data = JU.PT.rep (sb.toString (), " )", ")");
var n = data.length - 1;
sb =  new JU.SB ();
for (var i = 0; i < n; i++) {
var c = data.charAt (i);
switch (c) {
case '(':
case '-':
if (data.charAt (i + 1) == ' ') i++;
break;
case ' ':
if (JU.PT.isDigit (data.charAt (i + 1)) || data.charAt (i + 1) == '(') continue;
break;
}
sb.appendC (c);
}
tokens = JU.PT.getTokens (sb.toString ());
this.moData.put ("nboLabels", tokens);
for (var i = 0; i < this.nOrbitals; i++) this.setMO ( new java.util.Hashtable ());

( new J.quantum.QS ()).setNboLabels (tokens, this.nOrbitals, this.orbitals, this.nOrbitals0, this.nboType);
});
Clazz.defineStatics (c$,
"$P_LIST", "101   102   103",
"SP_LIST", "1     101   102   103",
"$DS_LIST", "255   252   253   254   251",
"$DC_LIST", "201   204   206   202   203   205",
"$FS_LIST", "351   352   353   354   355   356   357",
"$FC_LIST", "301   307   310   304   302   303   306   309   308   305");
});
