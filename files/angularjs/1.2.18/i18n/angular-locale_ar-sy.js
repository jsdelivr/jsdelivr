angular.module("ngLocale",[],["$provide",function(b){b.value("$locale",{DATETIME_FORMATS:{AMPMS:["\u0635","\u0645"],DAY:"\u0627\u0644\u0623\u062d\u062f \u0627\u0644\u0627\u062b\u0646\u064a\u0646 \u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621 \u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621 \u0627\u0644\u062e\u0645\u064a\u0633 \u0627\u0644\u062c\u0645\u0639\u0629 \u0627\u0644\u0633\u0628\u062a".split(" "),MONTH:"\u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u062b\u0627\u0646\u064a;\u0634\u0628\u0627\u0637;\u0622\u0630\u0627\u0631;\u0646\u064a\u0633\u0627\u0646;\u0623\u064a\u0627\u0631;\u062d\u0632\u064a\u0631\u0627\u0646;\u062a\u0645\u0648\u0632;\u0622\u0628;\u0623\u064a\u0644\u0648\u0644;\u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u0623\u0648\u0644;\u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u062b\u0627\u0646\u064a;\u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u0623\u0648\u0644".split(";"),
SHORTDAY:"\u0627\u0644\u0623\u062d\u062f \u0627\u0644\u0627\u062b\u0646\u064a\u0646 \u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621 \u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621 \u0627\u0644\u062e\u0645\u064a\u0633 \u0627\u0644\u062c\u0645\u0639\u0629 \u0627\u0644\u0633\u0628\u062a".split(" "),SHORTMONTH:"\u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u062b\u0627\u0646\u064a;\u0634\u0628\u0627\u0637;\u0622\u0630\u0627\u0631;\u0646\u064a\u0633\u0627\u0646;\u0623\u064a\u0627\u0631;\u062d\u0632\u064a\u0631\u0627\u0646;\u062a\u0645\u0648\u0632;\u0622\u0628;\u0623\u064a\u0644\u0648\u0644;\u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u0623\u0648\u0644;\u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u062b\u0627\u0646\u064a;\u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u0623\u0648\u0644".split(";"),
fullDate:"EEEE\u060c d MMMM\u060c y",longDate:"d MMMM\u060c y",medium:"dd\u200f/MM\u200f/yyyy h:mm:ss a",mediumDate:"dd\u200f/MM\u200f/yyyy",mediumTime:"h:mm:ss a","short":"d\u200f/M\u200f/yyyy h:mm a",shortDate:"d\u200f/M\u200f/yyyy",shortTime:"h:mm a"},NUMBER_FORMATS:{CURRENCY_SYM:"\u00a3",DECIMAL_SEP:"\u066b",GROUP_SEP:"\u066c",PATTERNS:[{gSize:0,lgSize:0,macFrac:0,maxFrac:3,minFrac:0,minInt:1,negPre:"",negSuf:"-",posPre:"",posSuf:""},{gSize:0,lgSize:0,macFrac:0,maxFrac:2,minFrac:2,minInt:1,negPre:"\u00a4\u00a0",
negSuf:"-",posPre:"\u00a4\u00a0",posSuf:""}]},id:"ar-sy",pluralCat:function(a){return 0==a?"zero":1==a?"one":2==a?"two":a==(a|0)&&3<=a%100&&10>=a%100?"few":a==(a|0)&&11<=a%100&&99>=a%100?"many":"other"}})}]);
