Clazz.declarePackage ("J.quantum");
Clazz.load (["J.api.JmolNMRInterface", "java.util.Hashtable"], "J.quantum.NMRCalculation", ["java.lang.Double", "$.Float", "$.NullPointerException", "JU.BS", "$.Lst", "$.PT", "$.V3", "JU.Escape", "$.Logger", "$.Tensor", "JV.FileManager"], function () {
c$ = Clazz.decorateAsClass (function () {
this.vwr = null;
this.isotopeData = null;
this.shiftRefsPPM = null;
Clazz.instantialize (this, arguments);
}, J.quantum, "NMRCalculation", null, J.api.JmolNMRInterface);
Clazz.prepareFields (c$, function () {
this.shiftRefsPPM =  new java.util.Hashtable ();
});
Clazz.makeConstructor (c$, 
function () {
});
Clazz.overrideMethod (c$, "setViewer", 
function (vwr) {
this.vwr = vwr;
this.getData ();
return this;
}, "JV.Viewer");
Clazz.overrideMethod (c$, "getQuadrupolarConstant", 
function (efg) {
if (efg == null) return 0;
var a = this.vwr.ms.at[efg.atomIndex1];
return (this.getIsotopeData (a, 2) * efg.eigenValues[2] * 2.349647144641375E8);
}, "JU.Tensor");
Clazz.defineMethod (c$, "getInteractionTensorList", 
 function (type, bsA) {
if (type != null) type = type.toLowerCase ();
var bsModels = this.vwr.ms.getModelBS (bsA, false);
var bs1 = this.getAtomSiteBS (bsA);
var iAtom = (bs1.cardinality () == 1 ? bs1.nextSetBit (0) : -1);
var list =  new JU.Lst ();
for (var i = bsModels.nextSetBit (0); i >= 0; i = bsModels.nextSetBit (i + 1)) {
var tensors = this.vwr.ms.getInfo (i, "interactionTensors");
if (tensors == null) continue;
var n = tensors.size ();
for (var j = 0; j < n; j++) {
var t = tensors.get (j);
if (type == null || t.type.equals (type) && t.isSelected (bs1, iAtom)) list.addLast (t);
}
}
return list;
}, "~S,JU.BS");
Clazz.defineMethod (c$, "getAtomSiteBS", 
 function (bsA) {
if (bsA == null) return null;
var bs =  new JU.BS ();
var atoms = this.vwr.ms.at;
var models = this.vwr.ms.am;
for (var i = bsA.nextSetBit (0); i >= 0; i = bsA.nextSetBit (i + 1)) {
if (!bsA.get (i)) continue;
var a = atoms[i];
bs.set (models[a.mi].firstAtomIndex - 1 + a.atomSite);
}
return bs;
}, "JU.BS");
Clazz.overrideMethod (c$, "getUniqueTensorSet", 
function (bsAtoms) {
var bs =  new JU.BS ();
var atoms = this.vwr.ms.at;
for (var i = this.vwr.ms.mc; --i >= 0; ) {
var bsModelAtoms = this.vwr.getModelUndeletedAtomsBitSet (i);
bsModelAtoms.and (bsAtoms);
if (this.vwr.ms.getUnitCell (i) == null) continue;
for (var j = bsModelAtoms.nextSetBit (0); j >= 0; j = bsModelAtoms.nextSetBit (j + 1)) if (atoms[j].atomSite != atoms[j].i + 1) bsModelAtoms.clear (j);

bs.or (bsModelAtoms);
for (var j = bsModelAtoms.nextSetBit (0); j >= 0; j = bsModelAtoms.nextSetBit (j + 1)) {
var ta = atoms[j].getTensors ();
if (ta == null) continue;
for (var jj = ta.length; --jj >= 0; ) {
var t = ta[jj];
if (t == null) continue;
for (var k = bsModelAtoms.nextSetBit (j + 1); k >= 0; k = bsModelAtoms.nextSetBit (k + 1)) {
var tb = atoms[k].getTensors ();
if (tb == null) continue;
for (var kk = tb.length; --kk >= 0; ) {
if (t.isEquiv (tb[kk])) {
bsModelAtoms.clear (k);
bs.clear (k);
break;
}}
}
}
}
}
return bs;
}, "JU.BS");
Clazz.defineMethod (c$, "getJCouplingHz", 
function (a1, a2, type, isc) {
return this.getIsoOrAnisoHz (true, a1, a2, type, isc);
}, "JM.Atom,JM.Atom,~S,JU.Tensor");
Clazz.overrideMethod (c$, "getIsoOrAnisoHz", 
function (isIso, a1, a2, type, isc) {
if (isc == null) {
type = this.getISCtype (a1, type);
if (type == null || a1.mi != a2.mi) return 0;
var bs =  new JU.BS ();
bs.set (a1.i);
bs.set (a2.i);
var list = this.getInteractionTensorList (type, bs);
if (list.size () == 0) return NaN;
isc = list.get (0);
} else {
a1 = this.vwr.ms.at[isc.atomIndex1];
a2 = this.vwr.ms.at[isc.atomIndex2];
}return (this.getIsotopeData (a1, 1) * this.getIsotopeData (a2, 1) * (isIso ? isc.isotropy () : isc.anisotropy ()) * 0.0167840302932219);
}, "~B,JM.Atom,JM.Atom,~S,JU.Tensor");
Clazz.defineMethod (c$, "getISCtype", 
 function (a1, type) {
var tensors = this.vwr.ms.getInfo (a1.mi, "interactionTensors");
if (tensors == null) return null;
type = (type == null ? "" : type.toLowerCase ());
var pt = -1;
if ((pt = type.indexOf ("_hz")) >= 0 || (pt = type.indexOf ("_khz")) >= 0 || (pt = type.indexOf ("hz")) >= 0 || (pt = type.indexOf ("khz")) >= 0) type = type.substring (0, pt);
if (type.length == 0) type = "isc";
return type;
}, "JM.Atom,~S");
Clazz.overrideMethod (c$, "getDipolarConstantHz", 
function (a1, a2) {
if (JU.Logger.debugging) JU.Logger.debug (a1 + " g=" + this.getIsotopeData (a1, 1) + "; " + a2 + " g=" + this.getIsotopeData (a2, 1));
var v = (-this.getIsotopeData (a1, 1) * this.getIsotopeData (a2, 1) / Math.pow (a1.distance (a2), 3) * 1054.5717253362893);
return (v == 0 || a1 === a2 ? NaN : v);
}, "JM.Atom,JM.Atom");
Clazz.overrideMethod (c$, "getDipolarCouplingHz", 
function (a1, a2, vField) {
var v12 = JU.V3.newVsub (a2, a1);
var r = v12.length ();
var costheta = v12.dot (vField) / r / vField.length ();
return (this.getDipolarConstantHz (a1, a2) * (3 * costheta - 1) / 2);
}, "JM.Atom,JM.Atom,JU.V3");
Clazz.defineMethod (c$, "getIsotopeData", 
 function (a, iType) {
var iso = a.getIsotopeNumber ();
var sym = a.getElementSymbolIso (false);
var d = this.isotopeData.get (iso == 0 ? sym : "" + iso + sym);
return (d == null ? 0 : d[iType]);
}, "JM.Atom,~N");
Clazz.defineMethod (c$, "getData", 
 function () {
var br = null;
try {
var debugging = JU.Logger.debugging;
br = JV.FileManager.getBufferedReaderForResource (this.vwr, this, "J/quantum/", "nmr_data.txt");
this.isotopeData =  new java.util.Hashtable ();
var line;
while ((line = br.readLine ()) != null) {
if (debugging) JU.Logger.info (line);
if (line.indexOf ("#") >= 0) continue;
var tokens = JU.PT.getTokens (line);
var name = tokens[0];
var defaultIso = tokens[2] + name;
if (debugging) JU.Logger.info (name + " default isotope " + defaultIso);
for (var i = 3; i < tokens.length; i += 3) {
var n = Integer.parseInt (tokens[i]);
var isoname = n + name;
var dataGQ =  Clazz.newDoubleArray (-1, [n, Double.parseDouble (tokens[i + 1]), Double.parseDouble (tokens[i + 2])]);
if (debugging) JU.Logger.info (isoname + "  " + JU.Escape.eAD (dataGQ));
this.isotopeData.put (isoname, dataGQ);
}
var defdata = this.isotopeData.get (defaultIso);
if (defdata == null) {
JU.Logger.error ("Cannot find default NMR data in nmr_data.txt for " + defaultIso);
throw  new NullPointerException ();
}defdata[0] = -defdata[0];
this.isotopeData.put (name, defdata);
}
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
JU.Logger.error ("Exception " + e.toString () + " reading " + "nmr_data.txt");
} else {
throw e;
}
} finally {
try {
br.close ();
} catch (ee) {
if (Clazz.exceptionOf (ee, Exception)) {
} else {
throw ee;
}
}
}
});
Clazz.overrideMethod (c$, "getInfo", 
function (what) {
if (what.equals ("all")) {
var map =  new java.util.Hashtable ();
map.put ("isotopes", this.isotopeData);
map.put ("shiftRefsPPM", this.shiftRefsPPM);
return map;
}if (JU.PT.isDigit (what.charAt (0))) return this.isotopeData.get (what);
var info =  new JU.Lst ();
for (var e, $e = this.isotopeData.entrySet ().iterator (); $e.hasNext () && ((e = $e.next ()) || true);) {
var key = e.getKey ();
if (JU.PT.isDigit (key.charAt (0)) && key.endsWith (what)) info.addLast (e.getValue ());
}
return info;
}, "~S");
Clazz.overrideMethod (c$, "getChemicalShift", 
function (atom) {
var v = this.getMagneticShielding (atom);
if (Float.isNaN (v)) return v;
var ref = this.shiftRefsPPM.get (atom.getElementSymbol ());
return (ref == null ? 0 : ref.floatValue ()) - v;
}, "JM.Atom");
Clazz.overrideMethod (c$, "getMagneticShielding", 
function (atom) {
var t = this.vwr.ms.getAtomTensor (atom.i, "ms");
return (t == null ? NaN : t.isotropy ());
}, "JM.Atom");
Clazz.overrideMethod (c$, "getState", 
function (sb) {
if (this.shiftRefsPPM.isEmpty ()) return false;
for (var nuc, $nuc = this.shiftRefsPPM.entrySet ().iterator (); $nuc.hasNext () && ((nuc = $nuc.next ()) || true);) sb.append ("  set shift_").append (nuc.getKey ()).append (" ").appendO (nuc.getValue ()).append ("\n");

return true;
}, "JU.SB");
Clazz.overrideMethod (c$, "setChemicalShiftReference", 
function (element, value) {
if (element == null) {
this.shiftRefsPPM.clear ();
return false;
}element = element.substring (0, 1).toUpperCase () + element.substring (1);
this.shiftRefsPPM.put (element, Float.$valueOf (value));
return true;
}, "~S,~N");
Clazz.overrideMethod (c$, "getTensorInfo", 
function (tensorType, infoType, bs) {
if ("".equals (tensorType)) tensorType = null;
infoType = (infoType == null ? ";all." : ";" + infoType + ".");
var data =  new JU.Lst ();
var list1;
if (";dc.".equals (infoType)) {
var atoms = this.vwr.ms.at;
for (var i = bs.nextSetBit (0); i >= 0; i = bs.nextSetBit (i + 1)) for (var j = bs.nextSetBit (i + 1); j >= 0; j = bs.nextSetBit (j + 1)) {
list1 =  new JU.Lst ();
list1.addLast (Integer.$valueOf (atoms[i].i));
list1.addLast (Integer.$valueOf (atoms[j].i));
list1.addLast (Float.$valueOf (this.getDipolarConstantHz (atoms[i], atoms[j])));
data.addLast (list1);
}

return data;
}if (tensorType == null || tensorType.startsWith ("isc")) {
var isJ = infoType.equals (";j.");
var isEta = infoType.equals (";eta.");
var list = this.getInteractionTensorList (tensorType, bs);
var n = (list == null ? 0 : list.size ());
for (var i = 0; i < n; i++) {
var t = list.get (i);
list1 =  new JU.Lst ();
list1.addLast (Integer.$valueOf (t.atomIndex1));
list1.addLast (Integer.$valueOf (t.atomIndex2));
list1.addLast (isEta || isJ ? Float.$valueOf (this.getIsoOrAnisoHz (isJ, null, null, null, t)) : t.getInfo (infoType));
data.addLast (list1);
}
if (tensorType != null) return data;
}var isChi = tensorType != null && tensorType.startsWith ("efg") && infoType.equals (";chi.");
var isFloat = (isChi || JU.Tensor.isFloatInfo (infoType));
for (var i = bs.nextSetBit (0); i >= 0; i = bs.nextSetBit (i + 1)) {
if (tensorType == null) {
var a = this.vwr.ms.getAtomTensorList (i);
if (a != null) for (var j = 0; j < a.length; j++) data.addLast ((a[j]).getInfo (infoType));

} else {
var t = this.vwr.ms.getAtomTensor (i, tensorType);
data.addLast (t == null ? (isFloat ? Float.$valueOf (0) : "") : isChi ? Float.$valueOf (this.getQuadrupolarConstant (t)) : t.getInfo (infoType));
}}
return data;
}, "~S,~S,JU.BS");
Clazz.overrideMethod (c$, "getMinDistances", 
function (md) {
var bsPoints1 = md.points.get (0);
var n1 = bsPoints1.cardinality ();
if (n1 == 0 || !(Clazz.instanceOf (md.points.get (1), JU.BS))) return null;
var bsPoints2 = md.points.get (1);
var n2 = bsPoints2.cardinality ();
if (n1 < 2 && n2 < 2) return null;
var htMin =  new java.util.Hashtable ();
var atoms = this.vwr.ms.at;
for (var i = bsPoints1.nextSetBit (0); i >= 0; i = bsPoints1.nextSetBit (i + 1)) {
var a1 = atoms[i];
var name = a1.getAtomName ();
for (var j = bsPoints2.nextSetBit (0); j >= 0; j = bsPoints2.nextSetBit (j + 1)) {
var a2 = atoms[j];
var d = Clazz.floatToInt (a2.distanceSquared (a1) * 100);
if (d == 0) continue;
var name1 = a2.getAtomName ();
var key = (name.compareTo (name1) < 0 ? name + name1 : name1 + name);
var min = htMin.get (key);
if (min == null) {
min = Integer.$valueOf (d);
htMin.put (key, min);
continue;
}if (d < min.intValue ()) htMin.put (key, Integer.$valueOf (d));
}
}
return htMin;
}, "JM.MeasurementData");
Clazz.defineStatics (c$,
"MAGNETOGYRIC_RATIO", 1,
"QUADRUPOLE_MOMENT", 2,
"e_charge", 1.60217646e-19,
"h_planck", 6.62606957e-34,
"h_bar_planck", 1.0545717253362894E-34,
"DIPOLAR_FACTOR", 1054.5717253362893,
"J_FACTOR", 0.0167840302932219,
"Q_FACTOR", 2.349647144641375E8,
"resource", "nmr_data.txt");
});
