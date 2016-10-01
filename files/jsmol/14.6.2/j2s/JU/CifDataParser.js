Clazz.declarePackage ("JU");
Clazz.load (["javajs.api.GenericCifDataParser", "java.util.Hashtable", "JU.SB"], "JU.CifDataParser", ["JU.Lst", "$.PT"], function () {
c$ = Clazz.decorateAsClass (function () {
this.reader = null;
this.br = null;
this.line = null;
this.str = null;
this.ich = 0;
this.cch = 0;
this.wasUnQuoted = false;
this.strPeeked = null;
this.ichPeeked = 0;
this.columnCount = 0;
this.columnNames = null;
this.columnData = null;
this.isLoop = false;
this.haveData = false;
this.fileHeader = null;
this.isHeader = true;
this.nullString = "\0";
Clazz.instantialize (this, arguments);
}, JU, "CifDataParser", null, javajs.api.GenericCifDataParser);
Clazz.prepareFields (c$, function () {
this.columnData =  new Array (100);
this.fileHeader =  new JU.SB ();
});
Clazz.defineMethod (c$, "setNullValue", 
function (nullString) {
this.nullString = nullString;
}, "~S");
Clazz.makeConstructor (c$, 
function () {
});
Clazz.overrideMethod (c$, "getColumnData", 
function (i) {
return this.columnData[i];
}, "~N");
Clazz.overrideMethod (c$, "getColumnCount", 
function () {
return this.columnCount;
});
Clazz.overrideMethod (c$, "getColumnName", 
function (i) {
return this.columnNames[i];
}, "~N");
Clazz.overrideMethod (c$, "set", 
function (reader, br) {
this.reader = reader;
this.br = br;
return this;
}, "javajs.api.GenericLineReader,java.io.BufferedReader");
Clazz.overrideMethod (c$, "getFileHeader", 
function () {
return this.fileHeader.toString ();
});
Clazz.overrideMethod (c$, "getAllCifData", 
function () {
this.line = "";
var key;
var data = null;
var allData =  new java.util.Hashtable ();
var models =  new JU.Lst ();
allData.put ("models", models);
try {
while ((key = this.getNextToken ()) != null) {
if (key.startsWith ("global_") || key.startsWith ("data_")) {
models.addLast (data =  new java.util.Hashtable ());
data.put ("name", key);
continue;
}if (key.startsWith ("loop_")) {
this.getAllCifLoopData (data);
continue;
}if (key.charAt (0) != '_') {
System.out.println ("CIF ERROR ? should be an underscore: " + key);
} else {
var value = this.getNextToken ();
if (value == null) {
System.out.println ("CIF ERROR ? end of file; data missing: " + key);
} else {
data.put (this.fixKey (key), value);
}}}
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
try {
if (this.br != null) this.br.close ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
return allData;
});
Clazz.defineMethod (c$, "getAllCifLoopData", 
 function (data) {
var key;
var keyWords =  new JU.Lst ();
while ((key = this.peekToken ()) != null && key.charAt (0) == '_') {
key = this.fixKey (this.getTokenPeeked ());
keyWords.addLast (key);
data.put (key,  new JU.Lst ());
}
this.columnCount = keyWords.size ();
if (this.columnCount == 0) return;
while (this.getData ()) for (var i = 0; i < this.columnCount; i++) (data.get (keyWords.get (i))).addLast (this.columnData[i]);


}, "java.util.Map");
Clazz.overrideMethod (c$, "readLine", 
function () {
try {
this.line = (this.reader == null ? this.br.readLine () : this.reader.readNextLine ());
if (this.line == null) return null;
if (this.isHeader) {
if (this.line.startsWith ("#")) this.fileHeader.append (this.line).appendC ('\n');
 else this.isHeader = false;
}return this.line;
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
return null;
} else {
throw e;
}
}
});
Clazz.overrideMethod (c$, "getData", 
function () {
if (this.isLoop) {
for (var i = 0; i < this.columnCount; ++i) if ((this.columnData[i] = this.getNextDataToken ()) == null) return false;

} else if (this.haveData) {
this.haveData = false;
} else {
return false;
}return (this.columnCount > 0);
});
Clazz.overrideMethod (c$, "skipLoop", 
function (doReport) {
var str;
var ret = (doReport ?  new JU.SB () : null);
var n = 0;
while ((str = this.peekToken ()) != null && str.charAt (0) == '_') {
if (ret != null) ret.append (str).append ("\n");
this.getTokenPeeked ();
n++;
}
if (n == 0) n = this.columnCount;
var m = 0;
while ((str = this.getNextDataToken ()) != null) {
if (ret == null) continue;
ret.append (str).append (" ");
if ((++m % n) == 0) ret.append ("\n");
}
return (ret == null ? null : ret.toString ());
}, "~B");
Clazz.overrideMethod (c$, "getNextToken", 
function () {
while (!this.strHasMoreTokens ()) if (this.setStringNextLine () == null) return null;

return this.nextStrToken ();
});
Clazz.overrideMethod (c$, "getNextDataToken", 
function () {
var str = this.peekToken ();
if (str == null) return null;
if (this.wasUnQuoted) if (str.charAt (0) == '_' || str.startsWith ("loop_") || str.startsWith ("data_") || str.startsWith ("stop_") || str.startsWith ("global_")) return null;
return this.getTokenPeeked ();
});
Clazz.overrideMethod (c$, "peekToken", 
function () {
while (!this.strHasMoreTokens ()) if (this.setStringNextLine () == null) return null;

var ich = this.ich;
this.strPeeked = this.nextStrToken ();
this.ichPeeked = this.ich;
this.ich = ich;
return this.strPeeked;
});
Clazz.overrideMethod (c$, "getTokenPeeked", 
function () {
this.ich = this.ichPeeked;
return this.strPeeked;
});
Clazz.overrideMethod (c$, "fullTrim", 
function (str) {
var pt0 = -1;
var pt1 = str.length;
while (++pt0 < pt1 && JU.PT.isWhitespace (str.charAt (pt0))) {
}
while (--pt1 > pt0 && JU.PT.isWhitespace (str.charAt (pt1))) {
}
return str.substring (pt0, pt1 + 1);
}, "~S");
Clazz.overrideMethod (c$, "toUnicode", 
function (data) {
var pt;
try {
while ((pt = data.indexOf ('\\')) >= 0) {
var c = data.charCodeAt (pt + 1);
var ch = (c >= 65 && c <= 90 ? "ABX\u0394E\u03a6\u0393HI_K\u039bMNO\u03a0\u0398P\u03a3TY_\u03a9\u039e\u03a5Z".substring (c - 65, c - 64) : c >= 97 && c <= 122 ? "\u03b1\u03b2\u03c7\u03a4\u03a5\u03c6\u03b3\u03b7\u03b9_\u03ba\u03bb\u03bc\u03bd\u03bf\u03c0\u03b8\u03c1\u03c3\u03c4\u03c5_\u03c9\u03be\u03c5\u03b6".substring (c - 97, c - 96) : "_");
data = data.substring (0, pt) + ch + data.substring (pt + 2);
}
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
return data;
}, "~S");
Clazz.overrideMethod (c$, "parseDataBlockParameters", 
function (fields, key, data, key2col, col2key) {
this.isLoop = (key == null);
var s;
if (fields == null) {
this.columnNames =  new Array (100);
} else {
if (!JU.CifDataParser.htFields.containsKey (fields[0])) for (var i = fields.length; --i >= 0; ) JU.CifDataParser.htFields.put (fields[i], Integer.$valueOf (i));

for (var i = fields.length; --i >= 0; ) key2col[i] = -1;

}this.columnCount = 0;
var pt;
var i;
if (this.isLoop) {
while (true) {
s = this.peekToken ();
if (s == null) {
this.columnCount = 0;
break;
}if (s.charAt (0) != '_') break;
pt = this.columnCount++;
s = this.fixKey (this.getTokenPeeked ());
if (fields == null) {
this.columnNames[col2key[pt] = key2col[pt] = pt] = s;
continue;
}var iField = JU.CifDataParser.htFields.get (s);
i = (iField == null ? -1 : iField.intValue ());
if ((col2key[pt] = i) != -1) key2col[i] = pt;
}
} else {
pt = key.indexOf (".");
var str0 = (pt < 0 ? key : key.substring (0, pt + 1));
while (true) {
pt = this.columnCount++;
if (key == null) {
key = this.getTokenPeeked ();
data = this.getNextToken ();
}var iField = JU.CifDataParser.htFields.get (this.fixKey (key));
i = (iField == null ? -1 : iField.intValue ());
if ((col2key[pt] = i) != -1) this.columnData[key2col[i] = pt] = data;
if ((s = this.peekToken ()) == null || !s.startsWith (str0)) break;
key = null;
}
this.haveData = (this.columnCount > 0);
}}, "~A,~S,~S,~A,~A");
Clazz.overrideMethod (c$, "fixKey", 
function (key) {
return (JU.PT.rep (key.startsWith ("_magnetic") ? key.substring (9) : key.startsWith ("_jana") ? key.substring (5) : key, ".", "_").toLowerCase ());
}, "~S");
Clazz.defineMethod (c$, "setString", 
 function (str) {
this.str = this.line = str;
this.cch = (str == null ? 0 : str.length);
this.ich = 0;
}, "~S");
Clazz.defineMethod (c$, "setStringNextLine", 
 function () {
this.setString (this.readLine ());
if (this.line == null || this.line.length == 0) return this.line;
if (this.line.charAt (0) != ';') {
if (this.str.startsWith ("###non-st#")) this.ich = 10;
return this.line;
}this.ich = 1;
var str = '\1' + this.line.substring (1) + '\n';
while (this.readLine () != null) {
if (this.line.startsWith (";")) {
str = str.substring (0, str.length - 1) + '\1' + this.line.substring (1);
break;
}str += this.line + '\n';
}
this.setString (str);
return str;
});
Clazz.defineMethod (c$, "strHasMoreTokens", 
 function () {
if (this.str == null) return false;
var ch = '#';
while (this.ich < this.cch && ((ch = this.str.charAt (this.ich)) == ' ' || ch == '\t')) ++this.ich;

return (this.ich < this.cch && ch != '#');
});
Clazz.defineMethod (c$, "nextStrToken", 
 function () {
if (this.ich == this.cch) return null;
var ichStart = this.ich;
var ch = this.str.charAt (ichStart);
if (ch != '\'' && ch != '"' && ch != '\1') {
this.wasUnQuoted = true;
while (this.ich < this.cch && (ch = this.str.charAt (this.ich)) != ' ' && ch != '\t') ++this.ich;

if (this.ich == ichStart + 1) if (this.nullString != null && (this.str.charAt (ichStart) == '.' || this.str.charAt (ichStart) == '?')) return this.nullString;
var s = this.str.substring (ichStart, this.ich);
return s;
}this.wasUnQuoted = false;
var chOpeningQuote = ch;
var previousCharacterWasQuote = false;
while (++this.ich < this.cch) {
ch = this.str.charAt (this.ich);
if (previousCharacterWasQuote && (ch == ' ' || ch == '\t')) break;
previousCharacterWasQuote = (ch == chOpeningQuote);
}
if (this.ich == this.cch) {
if (previousCharacterWasQuote) return this.str.substring (ichStart + 1, this.ich - 1);
return this.str.substring (ichStart, this.ich);
}++this.ich;
return this.str.substring (ichStart + 1, this.ich - 2);
});
Clazz.defineStatics (c$,
"KEY_MAX", 100);
c$.htFields = c$.prototype.htFields =  new java.util.Hashtable ();
Clazz.defineStatics (c$,
"grABC", "ABX\u0394E\u03a6\u0393HI_K\u039bMNO\u03a0\u0398P\u03a3TY_\u03a9\u039e\u03a5Z",
"grabc", "\u03b1\u03b2\u03c7\u03a4\u03a5\u03c6\u03b3\u03b7\u03b9_\u03ba\u03bb\u03bc\u03bd\u03bf\u03c0\u03b8\u03c1\u03c3\u03c4\u03c5_\u03c9\u03be\u03c5\u03b6");
});
