angular.module("ngLocale",[],["$provide",function(a){a.value("$locale",{DATETIME_FORMATS:{AMPMS:["f.m.","e.m."],DAY:"s\u00f8ndag mandag tirsdag onsdag torsdag fredag l\u00f8rdag".split(" "),MONTH:"januar februar marts april maj juni juli august september oktober november december".split(" "),SHORTDAY:"s\u00f8n man tir ons tor fre l\u00f8r".split(" "),SHORTMONTH:"jan. feb. mar. apr. maj jun. jul. aug. sep. okt. nov. dec.".split(" "),fullDate:"EEEE 'den' d. MMMM y",longDate:"d. MMM y",medium:"dd/MM/yyyy HH.mm.ss",
mediumDate:"dd/MM/yyyy",mediumTime:"HH.mm.ss","short":"dd/MM/yy HH.mm",shortDate:"dd/MM/yy",shortTime:"HH.mm"},NUMBER_FORMATS:{CURRENCY_SYM:"kr",DECIMAL_SEP:",",GROUP_SEP:".",PATTERNS:[{gSize:3,lgSize:3,macFrac:0,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,macFrac:0,maxFrac:2,minFrac:2,minInt:1,negPre:"-",negSuf:"\u00a0\u00a4",posPre:"",posSuf:"\u00a0\u00a4"}]},id:"da",pluralCat:function(a){return 1==a?"one":"other"}})}]);
