angular.module("ngLocale",[],["$provide",function(a){a.value("$locale",{DATETIME_FORMATS:{AMPMS:["a.m.","p.m."],DAY:"domingo lunes martes mi\u00e9rcoles jueves viernes s\u00e1bado".split(" "),MONTH:"enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre".split(" "),SHORTDAY:"dom lun mar mi\u00e9 jue vie s\u00e1b".split(" "),SHORTMONTH:"ene feb mar abr may jun jul ago sep oct nov dic".split(" "),fullDate:"EEEE, d 'de' MMMM 'de' y",longDate:"d 'de' MMMM 'de' y",medium:"dd/MM/yyyy HH:mm:ss",
mediumDate:"dd/MM/yyyy",mediumTime:"HH:mm:ss","short":"dd/MM/yy HH:mm",shortDate:"dd/MM/yy",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"\u20ac",DECIMAL_SEP:",",GROUP_SEP:".",PATTERNS:[{gSize:3,lgSize:3,macFrac:0,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,macFrac:0,maxFrac:2,minFrac:2,minInt:1,negPre:"-",negSuf:"\u00a0\u00a4",posPre:"",posSuf:"\u00a0\u00a4"}]},id:"es",pluralCat:function(a){return 1==a?"one":"other"}})}]);
