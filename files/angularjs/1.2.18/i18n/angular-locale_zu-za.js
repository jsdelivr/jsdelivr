angular.module("ngLocale",[],["$provide",function(a){a.value("$locale",{DATETIME_FORMATS:{AMPMS:["AM","PM"],DAY:"Sonto Msombuluko Lwesibili Lwesithathu uLwesine Lwesihlanu Mgqibelo".split(" "),MONTH:"Januwari Februwari Mashi Apreli Meyi Juni Julayi Agasti Septhemba Okthoba Novemba Disemba".split(" "),SHORTDAY:"Son Mso Bil Tha Sin Hla Mgq".split(" "),SHORTMONTH:"Jan Feb Mas Apr Mey Jun Jul Aga Sep Okt Nov Dis".split(" "),fullDate:"EEEE dd MMMM y",longDate:"d MMMM y",medium:"d MMM y h:mm:ss a",mediumDate:"d MMM y",
mediumTime:"h:mm:ss a","short":"yyyy-MM-dd h:mm a",shortDate:"yyyy-MM-dd",shortTime:"h:mm a"},NUMBER_FORMATS:{CURRENCY_SYM:"R",DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{gSize:3,lgSize:3,macFrac:0,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,macFrac:0,maxFrac:2,minFrac:2,minInt:1,negPre:"(\u00a4",negSuf:")",posPre:"\u00a4",posSuf:""}]},id:"zu-za",pluralCat:function(a){return 1==a?"one":"other"}})}]);
