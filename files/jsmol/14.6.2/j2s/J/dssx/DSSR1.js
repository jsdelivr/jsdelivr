Clazz.declarePackage ("J.dssx");
Clazz.load (["J.dssx.AnnotationParser"], "J.dssx.DSSR1", ["java.lang.Character", "JU.BS", "$.Lst", "$.PT", "JM.HBond", "JM.BasePair", "JU.Escape", "$.Logger"], function () {
c$ = Clazz.declareType (J.dssx, "DSSR1", J.dssx.AnnotationParser);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J.dssx.DSSR1, []);
});
Clazz.overrideMethod (c$, "calculateDSSRStructure", 
function (vwr, bsAtoms) {
var bs = vwr.ms.getModelBS (bsAtoms == null ? vwr.bsA () : bsAtoms, true);
var s = "";
for (var i = bs.nextSetBit (0); i >= 0; i = bs.nextSetBit (i + 1)) s += this.getDSSRForModel (vwr, i) + "\n";

return s;
}, "JV.Viewer,JU.BS");
Clazz.defineMethod (c$, "getDSSRForModel", 
 function (vwr, modelIndex) {
var info = null;
var out = null;
while (true) {
if (!vwr.ms.am[modelIndex].isBioModel) break;
info = vwr.ms.getModelAuxiliaryInfo (modelIndex);
if (info.containsKey ("dssr")) break;
var bs = vwr.getModelUndeletedAtomsBitSet (modelIndex);
bs.and (vwr.ms.getAtoms (2097166, null));
if (bs.nextClearBit (0) < 0) {
info = null;
break;
}try {
var name = vwr.setLoadFormat ("=dssrModel/", '=', false);
name = JU.PT.rep (name, "%20", " ");
JU.Logger.info ("fetching " + name + "[pdb data]");
var data = vwr.getPdbAtomData (bs, null, false, false);
data = vwr.getFileAsString3 (name + data, false, null);
var x = vwr.parseJSON (data);
if (x != null) {
info.put ("dssr", x);
this.setGroup1 (vwr.ms, modelIndex);
this.fixDSSRJSONMap (x);
this.setBioPolymers (vwr.ms.am[modelIndex], false);
}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
info = null;
out = "" + e;
} else {
throw e;
}
}
break;
}
return (info != null ? JU.PT.rep (JU.Escape.escapeMap ((info.get ("dssr")).get ("counts")), ",", ",\n") : out == null ? "model has no nucleotides" : out);
}, "JV.Viewer,~N");
Clazz.overrideMethod (c$, "fixDSSRJSONMap", 
function (map) {
var s = "";
try {
this.fixIndices (map, "kissingLoops", "hairpin");
this.fixIndices (map, "coaxStacks", "stem");
if (map.containsKey ("counts")) s += "_M.dssr.counts = " + map.get ("counts").toString () + "\n";
if (map.containsKey ("dbn")) s += "_M.dssr.dbn = " + map.get ("dbn").toString ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
return s;
}, "java.util.Map");
Clazz.defineMethod (c$, "fixIndices", 
 function (map, key, root) {
var indices = root + "_indices";
var original = root + "s";
var lst = map.get (key);
if (lst != null) {
var hpins = map.get (original);
for (var i = lst.size (); --i >= 0; ) {
var kmap = lst.get (i);
var khlist = kmap.get (indices);
var n = khlist.size ();
if (n > 0) {
var khpins =  new JU.Lst ();
kmap.put (original, khpins);
for (var j = n; --j >= 0; ) khpins.addLast (hpins.get ((khlist.get (j)).intValue () - 1));

}}
}}, "java.util.Map,~S,~S");
Clazz.overrideMethod (c$, "getBasePairs", 
function (vwr, modelIndex) {
var ms = vwr.ms;
var info = ms.getInfo (modelIndex, "dssr");
var pairs = (info == null ? null : info.get ("pairs"));
var singles = (info == null ? null : info.get ("ssSegments"));
if (pairs == null && singles == null) {
this.setBioPolymers (vwr.ms.am[modelIndex], true);
return;
}var bsAtoms = ms.am[modelIndex].bsAtoms;
try {
var bs =  new JU.BS ();
var atoms = ms.at;
if (pairs != null) for (var i = pairs.size (); --i >= 0; ) {
var map = pairs.get (i);
var unit1 = map.get ("nt1");
var unit2 = map.get ("nt2");
var a1 = ms.getSequenceBits (unit1, bsAtoms, bs).nextSetBit (0);
bs.clearAll ();
var a2 = ms.getSequenceBits (unit2, bsAtoms, bs).nextSetBit (0);
bs.clearAll ();
JM.BasePair.add (map, this.setRes (atoms[a1]), this.setRes (atoms[a2]));
}
if (singles != null) for (var i = singles.size (); --i >= 0; ) {
var map = singles.get (i);
var units = map.get ("nts_long");
ms.getSequenceBits (units, bsAtoms, bs);
for (var j = bs.nextSetBit (0); j >= 0; j = bs.nextSetBit (j + 1)) this.setRes (atoms[j]);

}
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
JU.Logger.error ("Exception " + e + " in DSSRParser.getBasePairs");
} else {
throw e;
}
}
}, "JV.Viewer,~N");
Clazz.defineMethod (c$, "setBioPolymers", 
 function (m, b) {
var n = m.getBioPolymerCount ();
for (var i = n; --i >= 0; ) {
var bp = m.bioPolymers[i];
if (bp.isNucleic ()) (bp).isDssrSet = b;
}
}, "JM.BioModel,~B");
Clazz.defineMethod (c$, "setRes", 
 function (atom) {
var m = atom.group;
(m.bioPolymer).isDssrSet = true;
return m;
}, "JM.Atom");
Clazz.overrideMethod (c$, "getAtomBits", 
function (vwr, key, dbObj, annotationCache, type, modelIndex, bsModel) {
if (dbObj == null) return  new JU.BS ();
var doCache = !key.contains ("NOCACHE");
if (!doCache) {
key = JU.PT.rep (key, "NOCACHE", "").trim ();
}var bs = (doCache ? annotationCache.get (key) : null);
if (bs != null) return bs;
bs =  new JU.BS ();
if (doCache) annotationCache.put (key, bs);
try {
var pt = key.toLowerCase ().indexOf (" where ");
if (pt < 0) {
key = key.toLowerCase ();
pt = "..bulges.nts_long..coaxstacks.stems.pairs.nt*..hairpins.nts_long..hbonds.atom1_id;atom2_id..helices.pairs.nt*..iloops.nts_long..isocanonpairs.nt*..junctions.nts_long..kissingloops.hairpins.nts_long..multiplets.nts_long..nonstack.nts_long..nts.nt_id..pairs.nt*..sssegments.nts_long..stacks.nts_long..stems.pairs.nt*..".indexOf (".." + key) + 2;
var len = key.length;
if (pt < 2) return bs;
while (pt >= 2 && len > 0) {
if ("..bulges.nts_long..coaxstacks.stems.pairs.nt*..hairpins.nts_long..hbonds.atom1_id;atom2_id..helices.pairs.nt*..iloops.nts_long..isocanonpairs.nt*..junctions.nts_long..kissingloops.hairpins.nts_long..multiplets.nts_long..nonstack.nts_long..nts.nt_id..pairs.nt*..sssegments.nts_long..stacks.nts_long..stems.pairs.nt*..".substring (pt + len, pt + len + 2).equals ("..")) key = "[select (" + key + ")]";
dbObj = vwr.extractProperty (dbObj, key, -1);
pt += len + 1;
var pt1 = "..bulges.nts_long..coaxstacks.stems.pairs.nt*..hairpins.nts_long..hbonds.atom1_id;atom2_id..helices.pairs.nt*..iloops.nts_long..isocanonpairs.nt*..junctions.nts_long..kissingloops.hairpins.nts_long..multiplets.nts_long..nonstack.nts_long..nts.nt_id..pairs.nt*..sssegments.nts_long..stacks.nts_long..stems.pairs.nt*..".indexOf (".", pt);
key = "..bulges.nts_long..coaxstacks.stems.pairs.nt*..hairpins.nts_long..hbonds.atom1_id;atom2_id..helices.pairs.nt*..iloops.nts_long..isocanonpairs.nt*..junctions.nts_long..kissingloops.hairpins.nts_long..multiplets.nts_long..nonstack.nts_long..nts.nt_id..pairs.nt*..sssegments.nts_long..stacks.nts_long..stems.pairs.nt*..".substring (pt, pt1);
len = key.length;
}
} else {
key = key.substring (0, pt).trim () + "[select * " + key.substring (pt + 1) + "]";
dbObj = vwr.extractProperty (dbObj, key, -1);
}bs.or (vwr.ms.getAtoms (1086324744, dbObj.toString ()));
bs.and (bsModel);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.println (e.toString () + " in AnnotationParser");
bs.clearAll ();
} else {
throw e;
}
}
return bs;
}, "JV.Viewer,~S,~O,java.util.Map,~N,~N,JU.BS");
Clazz.overrideMethod (c$, "getHBonds", 
function (ms, modelIndex, vHBonds, doReport) {
var info = ms.getInfo (modelIndex, "dssr");
var list;
if (info == null || (list = info.get ("hbonds")) == null) return "no DSSR hydrogen-bond data";
var bsAtoms = ms.am[modelIndex].bsAtoms;
var unit1 = null;
var unit2 = null;
var a1 = 0;
var a2 = 0;
try {
var bs =  new JU.BS ();
for (var i = list.size (); --i >= 0; ) {
var map = list.get (i);
unit1 = map.get ("atom1_id");
a1 = ms.getSequenceBits (unit1, bsAtoms, bs).nextSetBit (0);
if (a1 < 0) {
JU.Logger.error ("Atom " + unit1 + " was not found");
continue;
}unit2 = map.get ("atom2_id");
bs.clearAll ();
a2 = ms.getSequenceBits (unit2, bsAtoms, bs).nextSetBit (0);
if (a2 < 0) {
JU.Logger.error ("Atom " + unit2 + " was not found");
continue;
}bs.clearAll ();
var energy = 0;
vHBonds.addLast ( new JM.HBond (ms.at[a1], ms.at[a2], 2048, 1, 0, energy));
}
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
return "DSSR reports " + list.size () + " hydrogen bonds";
}, "JM.ModelSet,~N,JU.Lst,~B");
Clazz.overrideMethod (c$, "setGroup1", 
function (ms, modelIndex) {
var info = ms.getInfo (modelIndex, "dssr");
var list;
if (info == null || (list = info.get ("nts")) == null) return;
var m = ms.am[modelIndex];
var bsAtoms = m.bsAtoms;
var atoms = ms.at;
var bs =  new JU.BS ();
for (var i = list.size (); --i >= 0; ) {
var map = list.get (i);
var ch = (map.get ("nt_code")).charAt (0);
if (!Character.isLowerCase (ch)) continue;
var unit1 = map.get ("nt_id");
ms.bioModelset.getAllSequenceBits (unit1, bsAtoms, bs);
JU.Logger.info ("" + ch + " " + unit1 + " " + bs);
atoms[bsAtoms.nextSetBit (0)].group.group1 = ch;
bs.clearAll ();
}
}, "JM.ModelSet,~N");
Clazz.defineStatics (c$,
"DSSR_PATHS", "..bulges.nts_long..coaxstacks.stems.pairs.nt*..hairpins.nts_long..hbonds.atom1_id;atom2_id..helices.pairs.nt*..iloops.nts_long..isocanonpairs.nt*..junctions.nts_long..kissingloops.hairpins.nts_long..multiplets.nts_long..nonstack.nts_long..nts.nt_id..pairs.nt*..sssegments.nts_long..stacks.nts_long..stems.pairs.nt*..");
});
