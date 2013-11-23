(function (){
/**!
 * Binary Ajax 0.1.10
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
 * Licensed under the MPL License [http://www.nihilogic.dk/licenses/mpl-license.txt]
 *
 *
 * Javascript EXIF Reader 0.1.4
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
 * Licensed under the MPL License [http://www.nihilogic.dk/licenses/mpl-license.txt]
 */


var BinaryFile=function(j,k,l){var h=j,i=k||0,b=0;this.getRawData=function(){return h};"string"==typeof j&&(b=l||h.length,this.getByteAt=function(a){return h.charCodeAt(a+i)&255},this.getBytesAt=function(a,b){for(var c=[],f=0;f<b;f++)c[f]=h.charCodeAt(a+f+i)&255;return c});this.getLength=function(){return b};this.getSByteAt=function(a){a=this.getByteAt(a);return 127<a?a-256:a};this.getShortAt=function(a,b){var c=b?(this.getByteAt(a)<<8)+this.getByteAt(a+1):(this.getByteAt(a+1)<<8)+this.getByteAt(a);
0>c&&(c+=65536);return c};this.getSShortAt=function(a,b){var c=this.getShortAt(a,b);return 32767<c?c-65536:c};this.getLongAt=function(a,b){var c=this.getByteAt(a),f=this.getByteAt(a+1),e=this.getByteAt(a+2),g=this.getByteAt(a+3),c=b?(((c<<8)+f<<8)+e<<8)+g:(((g<<8)+e<<8)+f<<8)+c;0>c&&(c+=4294967296);return c};this.getSLongAt=function(a,b){var c=this.getLongAt(a,b);return 2147483647<c?c-4294967296:c};this.getStringAt=function(a,b){for(var c=[],f=this.getBytesAt(a,b),e=0;e<b;e++)c[e]=String.fromCharCode(f[e]);
return c.join("")};this.getCharAt=function(a){return String.fromCharCode(this.getByteAt(a))};this.toBase64=function(){return window.btoa(h)};this.fromBase64=function(a){h=window.atob(a)}},EXIF={};
(function(){function j(b){if(255!=b.getByteAt(0)||216!=b.getByteAt(1))return!1;for(var a=2,d=b.getLength();a<d;){if(255!=b.getByteAt(a))return i&&console.log("Not a valid marker at offset "+a+", found: "+b.getByteAt(a)),!1;var c=b.getByteAt(a+1);if(22400==c||225==c)return i&&console.log("Found 0xFFE1 marker"),h(b,a+4,b.getShortAt(a+2,!0)-2);a+=2+b.getShortAt(a+2,!0)}}function k(b,a,d,c,f){for(var e=b.getShortAt(d,f),g={},h=0;h<e;h++){var j=d+12*h+2,k=c[b.getShortAt(j,f)];!k&&i&&console.log("Unknown tag: "+
b.getShortAt(j,f));g[k]=l(b,j,a,d,f)}return g}function l(b,a,d,c,f){var e=b.getShortAt(a+2,f),c=b.getLongAt(a+4,f),d=b.getLongAt(a+8,f)+d;switch(e){case 1:case 7:if(1==c)return b.getByteAt(a+8,f);d=4<c?d:a+8;a=[];for(e=0;e<c;e++)a[e]=b.getByteAt(d+e);return a;case 2:return b.getStringAt(4<c?d:a+8,c-1);case 3:if(1==c)return b.getShortAt(a+8,f);d=2<c?d:a+8;a=[];for(e=0;e<c;e++)a[e]=b.getShortAt(d+2*e,f);return a;case 4:if(1==c)return b.getLongAt(a+8,f);a=[];for(e=0;e<c;e++)a[e]=b.getLongAt(d+4*e,f);
return a;case 5:if(1==c)return b.getLongAt(d,f)/b.getLongAt(d+4,f);a=[];for(e=0;e<c;e++)a[e]=b.getLongAt(d+8*e,f)/b.getLongAt(d+4+8*e,f);return a;case 9:if(1==c)return b.getSLongAt(a+8,f);a=[];for(e=0;e<c;e++)a[e]=b.getSLongAt(d+4*e,f);return a;case 10:if(1==c)return b.getSLongAt(d,f)/b.getSLongAt(d+4,f);a=[];for(e=0;e<c;e++)a[e]=b.getSLongAt(d+8*e,f)/b.getSLongAt(d+4+8*e,f);return a}}function h(b,a){if("Exif"!=b.getStringAt(a,4))return i&&console.log("Not valid EXIF data! "+b.getStringAt(a,4)),!1;
var d,c=a+6;if(18761==b.getShortAt(c))d=!1;else if(19789==b.getShortAt(c))d=!0;else return i&&console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)"),!1;if(42!=b.getShortAt(c+2,d))return i&&console.log("Not valid TIFF data! (no 0x002A)"),!1;if(8!=b.getLongAt(c+4,d))return i&&console.log("Not valid TIFF data! (First offset not 8)",b.getShortAt(c+4,d)),!1;var f=k(b,c,c+8,EXIF.TiffTags,d);if(f.ExifIFDPointer){var e=k(b,c,c+f.ExifIFDPointer,EXIF.Tags,d),g;for(g in e){switch(g){case "LightSource":case "Flash":case "MeteringMode":case "ExposureProgram":case "SensingMethod":case "SceneCaptureType":case "SceneType":case "CustomRendered":case "WhiteBalance":case "GainControl":case "Contrast":case "Saturation":case "Sharpness":case "SubjectDistanceRange":case "FileSource":e[g]=
EXIF.StringValues[g][e[g]];break;case "ExifVersion":case "FlashpixVersion":e[g]=String.fromCharCode(e[g][0],e[g][1],e[g][2],e[g][3]);break;case "ComponentsConfiguration":e[g]=EXIF.StringValues.Components[e[g][0]]+EXIF.StringValues.Components[e[g][1]]+EXIF.StringValues.Components[e[g][2]]+EXIF.StringValues.Components[e[g][3]]}f[g]=e[g]}}if(f.GPSInfoIFDPointer)for(g in d=k(b,c,c+f.GPSInfoIFDPointer,EXIF.GPSTags,d),d){switch(g){case "GPSVersionID":d[g]=d[g][0]+"."+d[g][1]+"."+d[g][2]+"."+d[g][3]}f[g]=
d[g]}return f}var i=!1;EXIF.Tags={36864:"ExifVersion",40960:"FlashpixVersion",40961:"ColorSpace",40962:"PixelXDimension",40963:"PixelYDimension",37121:"ComponentsConfiguration",37122:"CompressedBitsPerPixel",37500:"MakerNote",37510:"UserComment",40964:"RelatedSoundFile",36867:"DateTimeOriginal",36868:"DateTimeDigitized",37520:"SubsecTime",37521:"SubsecTimeOriginal",37522:"SubsecTimeDigitized",33434:"ExposureTime",33437:"FNumber",34850:"ExposureProgram",34852:"SpectralSensitivity",34855:"ISOSpeedRatings",
34856:"OECF",37377:"ShutterSpeedValue",37378:"ApertureValue",37379:"BrightnessValue",37380:"ExposureBias",37381:"MaxApertureValue",37382:"SubjectDistance",37383:"MeteringMode",37384:"LightSource",37385:"Flash",37396:"SubjectArea",37386:"FocalLength",41483:"FlashEnergy",41484:"SpatialFrequencyResponse",41486:"FocalPlaneXResolution",41487:"FocalPlaneYResolution",41488:"FocalPlaneResolutionUnit",41492:"SubjectLocation",41493:"ExposureIndex",41495:"SensingMethod",41728:"FileSource",41729:"SceneType",
41730:"CFAPattern",41985:"CustomRendered",41986:"ExposureMode",41987:"WhiteBalance",41988:"DigitalZoomRation",41989:"FocalLengthIn35mmFilm",41990:"SceneCaptureType",41991:"GainControl",41992:"Contrast",41993:"Saturation",41994:"Sharpness",41995:"DeviceSettingDescription",41996:"SubjectDistanceRange",40965:"InteroperabilityIFDPointer",42016:"ImageUniqueID"};EXIF.TiffTags={256:"ImageWidth",257:"ImageHeight",34665:"ExifIFDPointer",34853:"GPSInfoIFDPointer",40965:"InteroperabilityIFDPointer",258:"BitsPerSample",
259:"Compression",262:"PhotometricInterpretation",274:"Orientation",277:"SamplesPerPixel",284:"PlanarConfiguration",530:"YCbCrSubSampling",531:"YCbCrPositioning",282:"XResolution",283:"YResolution",296:"ResolutionUnit",273:"StripOffsets",278:"RowsPerStrip",279:"StripByteCounts",513:"JPEGInterchangeFormat",514:"JPEGInterchangeFormatLength",301:"TransferFunction",318:"WhitePoint",319:"PrimaryChromaticities",529:"YCbCrCoefficients",532:"ReferenceBlackWhite",306:"DateTime",270:"ImageDescription",271:"Make",
272:"Model",305:"Software",315:"Artist",33432:"Copyright"};EXIF.GPSTags={"0":"GPSVersionID",1:"GPSLatitudeRef",2:"GPSLatitude",3:"GPSLongitudeRef",4:"GPSLongitude",5:"GPSAltitudeRef",6:"GPSAltitude",7:"GPSTimeStamp",8:"GPSSatellites",9:"GPSStatus",10:"GPSMeasureMode",11:"GPSDOP",12:"GPSSpeedRef",13:"GPSSpeed",14:"GPSTrackRef",15:"GPSTrack",16:"GPSImgDirectionRef",17:"GPSImgDirection",18:"GPSMapDatum",19:"GPSDestLatitudeRef",20:"GPSDestLatitude",21:"GPSDestLongitudeRef",22:"GPSDestLongitude",23:"GPSDestBearingRef",
24:"GPSDestBearing",25:"GPSDestDistanceRef",26:"GPSDestDistance",27:"GPSProcessingMethod",28:"GPSAreaInformation",29:"GPSDateStamp",30:"GPSDifferential"};EXIF.StringValues={ExposureProgram:{"0":"Not defined",1:"Manual",2:"Normal program",3:"Aperture priority",4:"Shutter priority",5:"Creative program",6:"Action program",7:"Portrait mode",8:"Landscape mode"},MeteringMode:{"0":"Unknown",1:"Average",2:"CenterWeightedAverage",3:"Spot",4:"MultiSpot",5:"Pattern",6:"Partial",255:"Other"},LightSource:{"0":"Unknown",
1:"Daylight",2:"Fluorescent",3:"Tungsten (incandescent light)",4:"Flash",9:"Fine weather",10:"Cloudy weather",11:"Shade",12:"Daylight fluorescent (D 5700 - 7100K)",13:"Day white fluorescent (N 4600 - 5400K)",14:"Cool white fluorescent (W 3900 - 4500K)",15:"White fluorescent (WW 3200 - 3700K)",17:"Standard light A",18:"Standard light B",19:"Standard light C",20:"D55",21:"D65",22:"D75",23:"D50",24:"ISO studio tungsten",255:"Other"},Flash:{"0":"Flash did not fire",1:"Flash fired",5:"Strobe return light not detected",
7:"Strobe return light detected",9:"Flash fired, compulsory flash mode",13:"Flash fired, compulsory flash mode, return light not detected",15:"Flash fired, compulsory flash mode, return light detected",16:"Flash did not fire, compulsory flash mode",24:"Flash did not fire, auto mode",25:"Flash fired, auto mode",29:"Flash fired, auto mode, return light not detected",31:"Flash fired, auto mode, return light detected",32:"No flash function",65:"Flash fired, red-eye reduction mode",69:"Flash fired, red-eye reduction mode, return light not detected",
71:"Flash fired, red-eye reduction mode, return light detected",73:"Flash fired, compulsory flash mode, red-eye reduction mode",77:"Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",79:"Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",89:"Flash fired, auto mode, red-eye reduction mode",93:"Flash fired, auto mode, return light not detected, red-eye reduction mode",95:"Flash fired, auto mode, return light detected, red-eye reduction mode"},
SensingMethod:{1:"Not defined",2:"One-chip color area sensor",3:"Two-chip color area sensor",4:"Three-chip color area sensor",5:"Color sequential area sensor",7:"Trilinear sensor",8:"Color sequential linear sensor"},SceneCaptureType:{"0":"Standard",1:"Landscape",2:"Portrait",3:"Night scene"},SceneType:{1:"Directly photographed"},CustomRendered:{"0":"Normal process",1:"Custom process"},WhiteBalance:{"0":"Auto white balance",1:"Manual white balance"},GainControl:{"0":"None",1:"Low gain up",2:"High gain up",
3:"Low gain down",4:"High gain down"},Contrast:{"0":"Normal",1:"Soft",2:"Hard"},Saturation:{"0":"Normal",1:"Low saturation",2:"High saturation"},Sharpness:{"0":"Normal",1:"Soft",2:"Hard"},SubjectDistanceRange:{"0":"Unknown",1:"Macro",2:"Close view",3:"Distant view"},FileSource:{3:"DSC"},Components:{"0":"",1:"Y",2:"Cb",3:"Cr",4:"R",5:"G",6:"B"}};EXIF.getData=function(b,a){if(!b.complete)return!1;b.exifdata?a&&a():BinaryAjax(b.src,function(d){d=j(d.binaryResponse);b.exifdata=d||{};a&&a()});return!0};
EXIF.getTag=function(b,a){if(b.exifdata)return b.exifdata[a]};EXIF.getAllTags=function(b){if(!b.exifdata)return{};var b=b.exifdata,a={},d;for(d in b)b.hasOwnProperty(d)&&(a[d]=b[d]);return a};EXIF.pretty=function(b){if(!b.exifdata)return"";var b=b.exifdata,a="",d;for(d in b)b.hasOwnProperty(d)&&(a="object"==typeof b[d]?a+(d+" : ["+b[d].length+" values]\r\n"):a+(d+" : "+b[d]+"\r\n"));return a};EXIF.readFromBinaryFile=function(b){return j(b)}})();


FileAPI.support.exif = true;


FileAPI.addInfoReader(/^image/, function (file/**File*/, callback/**Function*/){
	if( !file.__exif ){
		var defer = file.__exif = FileAPI.defer();

		FileAPI.readAsBinaryString(file, function (evt){
			if( evt.type == 'load' ){
				var binaryString = evt.result;
				var oFile = new BinaryFile(binaryString, 0, file.size);
				var exif  = EXIF.readFromBinaryFile(oFile);

				defer.resolve(false, { 'exif': exif || {} });
			}
			else if( evt.type == 'error' ){
				defer.resolve('read_as_binary_string_exif');
			}
		});
	}

	file.__exif.then(callback);
});
})();
