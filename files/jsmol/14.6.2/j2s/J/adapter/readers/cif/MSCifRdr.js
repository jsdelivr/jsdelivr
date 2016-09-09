Clazz.declarePackage ("J.adapter.readers.cif");
Clazz.load (["J.adapter.readers.cif.MSRdr"], "J.adapter.readers.cif.MSCifRdr", ["java.lang.Character", "$.Double", "JU.M3", "$.Matrix", "$.PT"], function () {
c$ = Clazz.decorateAsClass (function () {
this.field = null;
this.comSSMat = null;
Clazz.instantialize (this, arguments);
}, J.adapter.readers.cif, "MSCifRdr", J.adapter.readers.cif.MSRdr);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J.adapter.readers.cif.MSCifRdr, []);
});
Clazz.defineMethod (c$, "processEntry", 
function () {
var cr = this.cr;
if (cr.key.equals ("_cell_commen_t_section_1")) {
this.isCommensurate = true;
this.commensurateSection1 = cr.parseIntStr (cr.data);
}if (cr.key.startsWith ("_cell_commen_supercell_matrix")) {
this.isCommensurate = true;
if (this.comSSMat == null) this.comSSMat = JU.M3.newM3 (null);
var tokens = JU.PT.split (cr.key, "_");
var r = cr.parseIntStr (tokens[tokens.length - 2]);
var c = cr.parseIntStr (tokens[tokens.length - 1]);
if (r > 0 && c > 0) this.comSSMat.setElement (r - 1, c - 1, cr.parseFloatStr (cr.data));
}});
Clazz.defineMethod (c$, "processLoopBlock", 
function () {
var cr = this.cr;
var key = cr.key;
if (key.equals ("_cell_subsystem_code")) return this.processSubsystemLoopBlock ();
if (!key.startsWith ("_cell_wave") && !key.contains ("fourier") && !key.contains ("legendre") && !key.contains ("_special_func")) {
if (key.contains ("crenel_ortho")) cr.appendLoadNote ("WARNING: Orthogonalized non-Legendre functions not supported.\nThe following block has been ignored. Use Legendre functions instead.\n\n" + cr.parser.skipLoop (true) + "=================================\n");
return 0;
}if (cr.asc.iSet < 0) cr.asc.newAtomSet ();
cr.parseLoopParametersFor ("_atom_site", J.adapter.readers.cif.MSCifRdr.modulationFields);
var tok;
if (cr.key2col[8] != -1) {
cr.key2col[5] = cr.key2col[6] = cr.key2col[7] = -1;
}while (cr.parser.getData ()) {
var ignore = false;
var type_id = null;
var atomLabel = null;
var axis = null;
var pt =  Clazz.newDoubleArray (-1, [NaN, NaN, NaN]);
var c = NaN;
var w = NaN;
var fid = null;
var n = cr.parser.getColumnCount ();
for (var i = 0; i < n; ++i) {
switch (tok = this.fieldProperty (cr, i)) {
case 1:
cr.haveCellWaveVector = true;
case 0:
case 40:
case 41:
case 42:
pt[0] = pt[1] = pt[2] = 0;
case 13:
case 25:
case 50:
case 35:
case 43:
case 44:
case 45:
switch (tok) {
case 1:
type_id = "W_";
break;
case 0:
type_id = "F_";
break;
case 40:
case 41:
case 42:
fid = "?" + this.field;
pt[2] = 1;
continue;
case 43:
case 44:
case 45:
atomLabel = axis = "*";
case 13:
case 25:
case 50:
case 35:
type_id = Character.toUpperCase (J.adapter.readers.cif.MSCifRdr.modulationFields[tok].charAt (11)) + "_";
break;
}
type_id += this.field;
break;
case 46:
type_id = "J_O";
pt[0] = pt[2] = 1;
axis = "0";
atomLabel = this.field;
break;
case 30:
type_id = "O_0";
axis = "0";
atomLabel = this.field;
break;
case 18:
type_id = "D_S";
axis = "0";
atomLabel = this.field;
break;
case 55:
type_id = "M_T";
axis = "0";
atomLabel = this.field;
break;
case 61:
type_id = "D_L";
atomLabel = this.field;
break;
case 65:
type_id = "U_L";
atomLabel = this.field;
break;
case 69:
type_id = "O_L";
atomLabel = this.field;
break;
case 11:
case 24:
case 48:
case 33:
atomLabel = this.field;
break;
case 12:
case 49:
case 62:
axis = this.field;
if (this.modAxes != null && this.modAxes.indexOf (axis.toUpperCase ()) < 0) ignore = true;
break;
case 66:
case 34:
axis = this.field.toUpperCase ();
break;
default:
var f = cr.parseFloatStr (this.field);
switch (tok) {
case 64:
case 71:
case 68:
pt[0] = f;
if (f != 0) pt[2] = 0;
break;
case 27:
case 31:
case 15:
case 52:
case 37:
case 77:
case 73:
case 75:
pt[2] = 0;
case 2:
case 5:
case 19:
case 56:
pt[0] = f;
break;
case 8:
type_id += "_coefs_";
pt =  Clazz.newDoubleArray (this.modDim, 0);
pt[0] = f;
break;
case 16:
case 28:
case 53:
case 38:
pt[0] = f;
pt[2] = 1;
break;
case 70:
case 74:
case 26:
axis = "0";
case 63:
case 67:
case 3:
case 6:
case 9:
case 17:
case 29:
case 54:
case 39:
case 32:
case 20:
case 57:
case 47:
case 14:
case 51:
case 36:
case 72:
case 76:
pt[1] = f;
break;
case 4:
case 7:
case 10:
case 21:
case 58:
pt[2] = f;
break;
case 22:
case 59:
c = f;
break;
case 23:
case 60:
w = f;
break;
}
break;
}
}
if (ignore || type_id == null || atomLabel != null && !atomLabel.equals ("*") && cr.rejectAtomName (atomLabel)) continue;
var ok = true;
for (var j = 0, nzero = pt.length; j < pt.length; j++) if (Double.isNaN (pt[j]) || pt[j] > 1e100 || pt[j] == 0 && --nzero == 0) {
ok = false;
break;
}
if (!ok) continue;
switch (type_id.charAt (0)) {
case 'C':
case 'D':
case 'O':
case 'M':
case 'U':
case 'J':
if (atomLabel == null || axis == null) continue;
if (type_id.equals ("D_S") || type_id.equals ("M_T")) {
if (Double.isNaN (c) || Double.isNaN (w)) continue;
if (pt[0] != 0) this.addMod (type_id + "#x;" + atomLabel, fid,  Clazz.newDoubleArray (-1, [c, w, pt[0]]));
if (pt[1] != 0) this.addMod (type_id + "#y;" + atomLabel, fid,  Clazz.newDoubleArray (-1, [c, w, pt[1]]));
if (pt[2] != 0) this.addMod (type_id + "#z;" + atomLabel, fid,  Clazz.newDoubleArray (-1, [c, w, pt[2]]));
continue;
}if (type_id.indexOf ("_L") == 1) {
if (type_id.startsWith ("U")) type_id += Clazz.doubleToInt (pt[1]);
 else axis += Clazz.doubleToInt (pt[1]);
}type_id += "#" + axis + ";" + atomLabel;
break;
}
this.addMod (type_id, fid, pt);
}
return 1;
});
Clazz.defineMethod (c$, "addMod", 
 function (id, fid, params) {
if (fid != null) id += fid;
this.addModulation (null, id, params, -1);
}, "~S,~S,~A");
Clazz.defineMethod (c$, "processSubsystemLoopBlock", 
 function () {
var cr = this.cr;
cr.parseLoopParameters (null);
while (cr.parser.getData ()) {
this.fieldProperty (cr, 0);
var id = this.field;
this.addSubsystem (id, this.getSparseMatrix (cr, "_w_", 1, 3 + this.modDim));
}
return 1;
});
Clazz.defineMethod (c$, "getSparseMatrix", 
 function (cr, term, i, dim) {
var m =  new JU.Matrix (null, dim, dim);
var a = m.getArray ();
var key;
var p;
var n = cr.parser.getColumnCount ();
for (; i < n; ++i) {
if ((p = this.fieldProperty (cr, i)) < 0 || !(key = cr.parser.getColumnName (p)).contains (term)) continue;
var tokens = JU.PT.split (key, "_");
var r = cr.parseIntStr (tokens[tokens.length - 2]);
var c = cr.parseIntStr (tokens[tokens.length - 1]);
if (r > 0 && c > 0) a[r - 1][c - 1] = cr.parseFloatStr (this.field);
}
return m;
}, "J.adapter.readers.cif.CifReader,~S,~N,~N");
Clazz.defineMethod (c$, "fieldProperty", 
 function (cr, i) {
return ((this.field = cr.parser.getColumnData (i)).length > 0 && this.field.charAt (0) != '\0' ? cr.col2key[i] : -1);
}, "J.adapter.readers.cif.CifReader,~N");
Clazz.defineStatics (c$,
"FWV_ID", 0,
"WV_ID", 1,
"WV_X", 2,
"WV_Y", 3,
"WV_Z", 4,
"FWV_X", 5,
"FWV_Y", 6,
"FWV_Z", 7,
"JANA_FWV_Q1_COEF", 8,
"JANA_FWV_Q2_COEF", 9,
"JANA_FWV_Q3_COEF", 10,
"FWV_DISP_LABEL", 11,
"FWV_DISP_AXIS", 12,
"FWV_DISP_SEQ_ID", 13,
"FWV_DISP_COS", 14,
"FWV_DISP_SIN", 15,
"FWV_DISP_MODULUS", 16,
"FWV_DISP_PHASE", 17,
"DISP_SPEC_LABEL", 18,
"DISP_SAW_AX", 19,
"DISP_SAW_AY", 20,
"DISP_SAW_AZ", 21,
"DISP_SAW_C", 22,
"DISP_SAW_W", 23,
"FWV_OCC_LABEL", 24,
"FWV_OCC_SEQ_ID", 25,
"FWV_OCC_COS", 26,
"FWV_OCC_SIN", 27,
"FWV_OCC_MODULUS", 28,
"FWV_OCC_PHASE", 29,
"OCC_SPECIAL_LABEL", 30,
"OCC_CRENEL_C", 31,
"OCC_CRENEL_W", 32,
"FWV_U_LABEL", 33,
"FWV_U_TENS", 34,
"FWV_U_SEQ_ID", 35,
"FWV_U_COS", 36,
"FWV_U_SIN", 37,
"FWV_U_MODULUS", 38,
"FWV_U_PHASE", 39,
"FD_ID", 40,
"FO_ID", 41,
"FU_ID", 42,
"FDP_ID", 43,
"FOP_ID", 44,
"FUP_ID", 45,
"JANA_OCC_ABS_LABEL", 46,
"JANA_OCC_ABS_O_0", 47,
"FWV_SPIN_LABEL", 48,
"FWV_SPIN_AXIS", 49,
"FWV_SPIN_SEQ_ID", 50,
"FWV_SPIN_COS", 51,
"FWV_SPIN_SIN", 52,
"FWV_SPIN_MODULUS", 53,
"FWV_SPIN_PHASE", 54,
"SPIN_SPEC_LABEL", 55,
"SPIN_SAW_AX", 56,
"SPIN_SAW_AY", 57,
"SPIN_SAW_AZ", 58,
"SPIN_SAW_C", 59,
"SPIN_SAW_W", 60,
"LEG_DISP_LABEL", 61,
"LEG_DISP_AXIS", 62,
"LEG_DISP_ORDER", 63,
"LEG_DISP_COEF", 64,
"LEG_U_LABEL", 65,
"LEG_U_TENS", 66,
"LEG_U_ORDER", 67,
"LEG_U_COEF", 68,
"LEG_OCC_LABEL", 69,
"LEG_OCC_ORDER", 70,
"LEG_OCC_COEF", 71,
"DEPR_FD_COS", 72,
"DEPR_FD_SIN", 73,
"DEPR_FO_COS", 74,
"DEPR_FO_SIN", 75,
"DEPR_FU_COS", 76,
"DEPR_FU_SIN", 77,
"modulationFields",  Clazz.newArray (-1, ["*_fourier_wave_vector_seq_id", "_cell_wave_vector_seq_id", "_cell_wave_vector_x", "_cell_wave_vector_y", "_cell_wave_vector_z", "*_fourier_wave_vector_x", "*_fourier_wave_vector_y", "*_fourier_wave_vector_z", "*_fourier_wave_vector_q1_coeff", "*_fourier_wave_vector_q2_coeff", "*_fourier_wave_vector_q3_coeff", "*_displace_fourier_atom_site_label", "*_displace_fourier_axis", "*_displace_fourier_wave_vector_seq_id", "*_displace_fourier_param_cos", "*_displace_fourier_param_sin", "*_displace_fourier_param_modulus", "*_displace_fourier_param_phase", "*_displace_special_func_atom_site_label", "*_displace_special_func_sawtooth_ax", "*_displace_special_func_sawtooth_ay", "*_displace_special_func_sawtooth_az", "*_displace_special_func_sawtooth_c", "*_displace_special_func_sawtooth_w", "*_occ_fourier_atom_site_label", "*_occ_fourier_wave_vector_seq_id", "*_occ_fourier_param_cos", "*_occ_fourier_param_sin", "*_occ_fourier_param_modulus", "*_occ_fourier_param_phase", "*_occ_special_func_atom_site_label", "*_occ_special_func_crenel_c", "*_occ_special_func_crenel_w", "*_u_fourier_atom_site_label", "*_u_fourier_tens_elem", "*_u_fourier_wave_vector_seq_id", "*_u_fourier_param_cos", "*_u_fourier_param_sin", "*_u_fourier_param_modulus", "*_u_fourier_param_phase", "*_displace_fourier_id", "*_occ_fourier_id", "*_u_fourier_id", "*_displace_fourier_param_id", "*_occ_fourier_param_id", "*_u_fourier_param_id", "*_occ_fourier_absolute_site_label", "*_occ_fourier_absolute", "*_moment_fourier_atom_site_label", "*_moment_fourier_axis", "*_moment_fourier_wave_vector_seq_id", "*_moment_fourier_param_cos", "*_moment_fourier_param_sin", "*_moment_fourier_param_modulus", "*_moment_fourier_param_phase", "*_moment_special_func_atom_site_label", "*_moment_special_func_sawtooth_ax", "*_moment_special_func_sawtooth_ay", "*_moment_special_func_sawtooth_az", "*_moment_special_func_sawtooth_c", "*_moment_special_func_sawtooth_w", "*_displace_legendre_atom_site_label", "*_displace_legendre_axis", "*_displace_legendre_param_order", "*_displace_legendre_param_coeff", "*_u_legendre_atom_site_label", "*_u_legendre_tens_elem", "*_u_legendre_param_order", "*_u_legendre_param_coeff", "*_occ_legendre_atom_site_label", "*_occ_legendre_param_order", "*_occ_legendre_param_coeff", "*_displace_fourier_cos", "*_displace_fourier_sin", "*_occ_fourier_cos", "*_occ_fourier_sin", "*_u_fourier_cos", "*_u_fourier_sin"]),
"NONE", -1);
});
