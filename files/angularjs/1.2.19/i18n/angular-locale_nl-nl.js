angular.module("ngLocale",[],["$provide",function(a){a.value("$locale",{DATETIME_FORMATS:{AMPMS:["AM","PM"],DAY:"zondag maandag dinsdag woensdag donderdag vrijdag zaterdag".split(" "),MONTH:"januari februari maart april mei juni juli augustus september oktober november december".split(" "),SHORTDAY:"zo ma di wo do vr za".split(" "),SHORTMONTH:"jan. feb. mrt. apr. mei jun. jul. aug. sep. okt. nov. dec.".split(" "),fullDate:"EEEE d MMMM y",longDate:"d MMMM y",medium:"d MMM y HH:mm:ss",mediumDate:"d MMM y",
mediumTime:"HH:mm:ss","short":"dd-MM-yy HH:mm",shortDate:"dd-MM-yy",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"\u20ac",DECIMAL_SEP:",",GROUP_SEP:".",PATTERNS:[{gSize:3,lgSize:3,macFrac:0,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,macFrac:0,maxFrac:2,minFrac:2,minInt:1,negPre:"\u00a4\u00a0",negSuf:"-",posPre:"\u00a4\u00a0",posSuf:""}]},id:"nl-nl",pluralCat:function(a){return 1==a?"one":"other"}})}]);
