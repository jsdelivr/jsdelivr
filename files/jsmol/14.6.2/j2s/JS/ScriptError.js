Clazz.declarePackage ("JS");
Clazz.load (["J.api.JmolScriptEvaluator"], "JS.ScriptError", ["java.lang.NullPointerException", "JU.PT", "J.i18n.GT", "JS.ScriptException"], function () {
c$ = Clazz.decorateAsClass (function () {
this.vwr = null;
this.chk = false;
this.ignoreError = false;
this.$error = false;
this.errorMessage = null;
this.errorMessageUntranslated = null;
this.errorType = null;
this.iCommandError = 0;
Clazz.instantialize (this, arguments);
}, JS, "ScriptError", null, J.api.JmolScriptEvaluator);
Clazz.overrideMethod (c$, "getErrorMessage", 
function () {
return this.errorMessage;
});
Clazz.overrideMethod (c$, "getErrorMessageUntranslated", 
function () {
return this.errorMessageUntranslated == null ? this.errorMessage : this.errorMessageUntranslated;
});
Clazz.defineMethod (c$, "invArg", 
function () {
this.error (22);
});
Clazz.defineMethod (c$, "bad", 
function () {
this.error (2);
});
Clazz.defineMethod (c$, "integerOutOfRange", 
function (min, max) {
this.errorOrWarn (21, "" + min, "" + max, null, true);
}, "~N,~N");
Clazz.defineMethod (c$, "numberOutOfRange", 
function (min, max) {
this.errorOrWarn (36, "" + min, "" + max, null, true);
}, "~N,~N");
Clazz.defineMethod (c$, "error", 
function (iError) {
this.errorOrWarn (iError, null, null, null, false);
}, "~N");
Clazz.defineMethod (c$, "errorStr", 
function (iError, value) {
this.errorOrWarn (iError, value, null, null, false);
}, "~N,~S");
Clazz.defineMethod (c$, "errorStr2", 
function (iError, value, more) {
this.errorOrWarn (iError, value, more, null, false);
}, "~N,~S,~S");
Clazz.defineMethod (c$, "errorMore", 
function (iError, value, more, more2) {
this.errorOrWarn (iError, value, more, more2, false);
}, "~N,~S,~S,~S");
Clazz.defineMethod (c$, "warning", 
function (iError, value, more) {
this.errorOrWarn (iError, value, more, null, true);
}, "~N,~S,~S");
Clazz.defineMethod (c$, "errorOrWarn", 
 function (iError, value, more, more2, warningOnly) {
var strError = (this.ignoreError ? null : JS.ScriptError.errorString (iError, value, more, more2, true));
var strUntranslated = (this.ignoreError || !J.i18n.GT.getDoTranslate () ? null : JS.ScriptError.errorString (iError, value, more, more2, false));
if (!warningOnly) this.evalError (strError, strUntranslated);
this.showStringPrint (strError, true);
}, "~N,~S,~S,~S,~B");
Clazz.defineMethod (c$, "evalError", 
function (message, strUntranslated) {
if (this.ignoreError) throw  new NullPointerException ();
if (strUntranslated == null) strUntranslated = message;
if (!this.chk) {
this.setCursorWait (false);
this.vwr.setBooleanProperty ("refreshing", true);
this.vwr.setStringProperty ("_errormessage", strUntranslated);
}throw  new JS.ScriptException (this, message, strUntranslated, true);
}, "~S,~S");
Clazz.defineMethod (c$, "setCursorWait", 
function (TF) {
if (!this.chk) this.vwr.setCursor (TF ? 3 : 0);
}, "~B");
c$.errorString = Clazz.defineMethod (c$, "errorString", 
function (iError, value, more, more2, translated) {
var doTranslate = false;
if (!translated && (doTranslate = J.i18n.GT.getDoTranslate ()) == true) J.i18n.GT.setDoTranslate (false);
var msg;
switch (iError) {
default:
msg = "Unknown error message number: " + iError;
break;
case 0:
msg = J.i18n.GT._ ("x y z axis expected");
break;
case 1:
msg = J.i18n.GT._ ("{0} not allowed with background model displayed");
break;
case 2:
msg = J.i18n.GT._ ("bad argument count");
break;
case 3:
msg = J.i18n.GT._ ("Miller indices cannot all be zero.");
break;
case 4:
msg = J.i18n.GT._ ("bad [R,G,B] color");
break;
case 5:
msg = J.i18n.GT._ ("boolean expected");
break;
case 6:
msg = J.i18n.GT._ ("boolean or number expected");
break;
case 7:
msg = J.i18n.GT._ ("boolean, number, or {0} expected");
break;
case 56:
msg = J.i18n.GT._ ("cannot set value");
break;
case 8:
msg = J.i18n.GT._ ("color expected");
break;
case 9:
msg = J.i18n.GT._ ("a color or palette name (Jmol, Rasmol) is required");
break;
case 10:
msg = J.i18n.GT._ ("command expected");
break;
case 11:
msg = J.i18n.GT._ ("{x y z} or $name or (atom expression) required");
break;
case 12:
msg = J.i18n.GT._ ("draw object not defined");
break;
case 13:
msg = J.i18n.GT._ ("unexpected end of script command");
break;
case 14:
msg = J.i18n.GT._ ("valid (atom expression) expected");
break;
case 15:
msg = J.i18n.GT._ ("(atom expression) or integer expected");
break;
case 16:
msg = J.i18n.GT._ ("filename expected");
break;
case 17:
msg = J.i18n.GT._ ("file not found");
break;
case 18:
msg = J.i18n.GT._ ("incompatible arguments");
break;
case 19:
msg = J.i18n.GT._ ("insufficient arguments");
break;
case 20:
msg = J.i18n.GT._ ("integer expected");
break;
case 21:
msg = J.i18n.GT._ ("integer out of range ({0} - {1})");
break;
case 22:
msg = J.i18n.GT._ ("invalid argument");
break;
case 23:
msg = J.i18n.GT._ ("invalid parameter order");
break;
case 24:
msg = J.i18n.GT._ ("keyword expected");
break;
case 25:
msg = J.i18n.GT._ ("no MO coefficient data available");
break;
case 26:
msg = J.i18n.GT._ ("An MO index from 1 to {0} is required");
break;
case 27:
msg = J.i18n.GT._ ("no MO basis/coefficient data available for this frame");
break;
case 28:
msg = J.i18n.GT._ ("no MO occupancy data available");
break;
case 29:
msg = J.i18n.GT._ ("Only one molecular orbital is available in this file");
break;
case 30:
msg = J.i18n.GT._ ("{0} require that only one model be displayed");
break;
case 55:
msg = J.i18n.GT._ ("{0} requires that only one model be loaded");
break;
case 31:
msg = J.i18n.GT._ ("No data available");
break;
case 32:
msg = J.i18n.GT._ ("No partial charges were read from the file; Jmol needs these to render the MEP data.");
break;
case 33:
msg = J.i18n.GT._ ("No unit cell");
break;
case 34:
msg = J.i18n.GT._ ("number expected");
break;
case 35:
msg = J.i18n.GT._ ("number must be ({0} or {1})");
break;
case 36:
msg = J.i18n.GT._ ("decimal number out of range ({0} - {1})");
break;
case 37:
msg = J.i18n.GT._ ("object name expected after '$'");
break;
case 38:
msg = J.i18n.GT._ ("plane expected -- either three points or atom expressions or {0} or {1} or {2}");
break;
case 39:
msg = J.i18n.GT._ ("property name expected");
break;
case 40:
msg = J.i18n.GT._ ("space group {0} was not found.");
break;
case 41:
msg = J.i18n.GT._ ("quoted string expected");
break;
case 42:
msg = J.i18n.GT._ ("quoted string or identifier expected");
break;
case 43:
msg = J.i18n.GT._ ("too many rotation points were specified");
break;
case 44:
msg = J.i18n.GT._ ("too many script levels");
break;
case 45:
msg = J.i18n.GT._ ("unrecognized atom property");
break;
case 46:
msg = J.i18n.GT._ ("unrecognized bond property");
break;
case 47:
msg = J.i18n.GT._ ("unrecognized command");
break;
case 48:
msg = J.i18n.GT._ ("runtime unrecognized expression");
break;
case 49:
msg = J.i18n.GT._ ("unrecognized object");
break;
case 50:
msg = J.i18n.GT._ ("unrecognized {0} parameter");
break;
case 51:
msg = J.i18n.GT._ ("unrecognized {0} parameter in Jmol state script (set anyway)");
break;
case 52:
msg = J.i18n.GT._ ("unrecognized SHOW parameter --  use {0}");
break;
case 53:
msg = "{0}";
break;
case 54:
msg = J.i18n.GT._ ("write what? {0} or {1} \"filename\"");
break;
}
if (msg.indexOf ("{0}") < 0) {
if (value != null) msg += ": " + value;
} else {
msg = JU.PT.rep (msg, "{0}", value);
if (msg.indexOf ("{1}") >= 0) msg = JU.PT.rep (msg, "{1}", more);
 else if (more != null) msg += ": " + more;
if (msg.indexOf ("{2}") >= 0) msg = JU.PT.rep (msg, "{2}", more);
}if (doTranslate) J.i18n.GT.setDoTranslate (true);
return msg;
}, "~N,~S,~S,~S,~B");
c$.getErrorLineMessage = Clazz.defineMethod (c$, "getErrorLineMessage", 
function (functionName, filename, lineCurrent, pcCurrent, lineInfo) {
var err = "\n----";
if (filename != null || functionName != null) err += "line " + lineCurrent + " command " + (pcCurrent + 1) + " of " + (functionName == null ? filename : functionName.equals ("try") ? "try" : "function " + functionName) + ":";
err += "\n         " + lineInfo;
return err;
}, "~S,~S,~N,~N,~S");
Clazz.defineMethod (c$, "setErrorMessage", 
function (err) {
this.errorMessageUntranslated = null;
if (err == null) {
this.$error = false;
this.errorType = null;
this.errorMessage = null;
this.iCommandError = -1;
return;
}this.$error = true;
if (this.errorMessage == null) this.errorMessage = J.i18n.GT._ ("script ERROR: ");
this.errorMessage += err;
}, "~S");
Clazz.defineStatics (c$,
"ERROR_axisExpected", 0,
"ERROR_backgroundModelError", 1,
"ERROR_badArgumentCount", 2,
"ERROR_badMillerIndices", 3,
"ERROR_badRGBColor", 4,
"ERROR_booleanExpected", 5,
"ERROR_booleanOrNumberExpected", 6,
"ERROR_booleanOrWhateverExpected", 7,
"ERROR_colorExpected", 8,
"ERROR_colorOrPaletteRequired", 9,
"ERROR_commandExpected", 10,
"ERROR_coordinateOrNameOrExpressionRequired", 11,
"ERROR_drawObjectNotDefined", 12,
"ERROR_endOfStatementUnexpected", 13,
"ERROR_expressionExpected", 14,
"ERROR_expressionOrIntegerExpected", 15,
"ERROR_filenameExpected", 16,
"ERROR_fileNotFoundException", 17,
"ERROR_incompatibleArguments", 18,
"ERROR_insufficientArguments", 19,
"ERROR_integerExpected", 20,
"ERROR_integerOutOfRange", 21,
"ERROR_invalidArgument", 22,
"ERROR_invalidParameterOrder", 23,
"ERROR_keywordExpected", 24,
"ERROR_moCoefficients", 25,
"ERROR_moIndex", 26,
"ERROR_moModelError", 27,
"ERROR_moOccupancy", 28,
"ERROR_moOnlyOne", 29,
"ERROR_multipleModelsDisplayedNotOK", 30,
"ERROR_noData", 31,
"ERROR_noPartialCharges", 32,
"ERROR_noUnitCell", 33,
"ERROR_numberExpected", 34,
"ERROR_numberMustBe", 35,
"ERROR_numberOutOfRange", 36,
"ERROR_objectNameExpected", 37,
"ERROR_planeExpected", 38,
"ERROR_propertyNameExpected", 39,
"ERROR_spaceGroupNotFound", 40,
"ERROR_stringExpected", 41,
"ERROR_stringOrIdentifierExpected", 42,
"ERROR_tooManyPoints", 43,
"ERROR_tooManyScriptLevels", 44,
"ERROR_unrecognizedAtomProperty", 45,
"ERROR_unrecognizedBondProperty", 46,
"ERROR_unrecognizedCommand", 47,
"ERROR_unrecognizedExpression", 48,
"ERROR_unrecognizedObject", 49,
"ERROR_unrecognizedParameter", 50,
"ERROR_unrecognizedParameterWarning", 51,
"ERROR_unrecognizedShowParameter", 52,
"ERROR_what", 53,
"ERROR_writeWhat", 54,
"ERROR_multipleModelsNotOK", 55,
"ERROR_cannotSet", 56);
});
