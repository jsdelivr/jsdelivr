angular.module("ngLocale",[],["$provide",function(b){b.value("$locale",{DATETIME_FORMATS:{AMPMS:["pre podne","popodne"],DAY:"nedelja ponedeljak utorak sreda \u010detvrtak petak subota".split(" "),MONTH:"januar februar mart april maj jun jul avgust septembar oktobar novembar decembar".split(" "),SHORTDAY:"ned pon uto sre \u010det pet sub".split(" "),SHORTMONTH:"jan feb mar apr maj jun jul avg sep okt nov dec".split(" "),fullDate:"EEEE, dd. MMMM y.",longDate:"dd. MMMM y.",medium:"dd.MM.y. HH.mm.ss",
mediumDate:"dd.MM.y.",mediumTime:"HH.mm.ss","short":"d.M.yy. HH.mm",shortDate:"d.M.yy.",shortTime:"HH.mm"},NUMBER_FORMATS:{CURRENCY_SYM:"din",DECIMAL_SEP:",",GROUP_SEP:".",PATTERNS:[{gSize:3,lgSize:3,macFrac:0,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,macFrac:0,maxFrac:2,minFrac:2,minInt:1,negPre:"-",negSuf:"\u00a0\u00a4",posPre:"",posSuf:"\u00a0\u00a4"}]},id:"sr-latn",pluralCat:function(a){return 1==a%10&&11!=a%100?"one":a==(a|0)&&2<=a%10&&4>=a%10&&
(12>a%100||14<a%100)?"few":0==a%10||a==(a|0)&&5<=a%10&&9>=a%10||a==(a|0)&&11<=a%100&&14>=a%100?"many":"other"}})}]);
