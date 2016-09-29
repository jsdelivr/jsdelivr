ej.addCulture( "ne-NP", {
	name: "ne-NP",
	englishName: "Nepali (Nepal)",
	nativeName: "नेपाली (नेपाल)",
	language: "ne",
	numberFormat: {
		groupSizes: [3,2],
		"NaN": "अंक नभएको",
		negativeInfinity: "-∞",
		positiveInfinity: "∞",
		percent: {
			pattern: ["-n%","n%"],
			groupSizes: [3,2]
		},
		currency: {
			pattern: ["-$n","$n"],
			symbol: "रु"
		}
	},
	calendars: {
		standard: {
			days: {
				names: ["आइतवार","सोमवार","मङ्गलवार","बुधवार","बिहीवार","शुक्रवार","शनिवार"],
				namesAbbr: ["आइत","सोम","मङ्गल","बुध","बिही","शुक्र","शनि"],
				namesShort: ["आ","सो","म","बु","बि","शु","श"]
			},
			months: {
				names: ["जनवरी","फेब्रुअरी","मार्च","अप्रिल","मे","जून","जुलाई","अगस्त","सेप्टेम्बर","अक्टोबर","नोभेम्बर","डिसेम्बर",""],
				namesAbbr: ["जन","फेब","मार्च","अप्रिल","मे","जून","जुलाई","अग","सेप्ट","अक्ट","नोभ","डिस",""]
			},
			AM: ["पूर्वाह्न","पूर्वाह्न","पूर्वाह्न"],
			PM: ["अपराह्न","अपराह्न","अपराह्न"],
			patterns: {
				D: "dddd, MMMM dd, yyyy",
				f: "dddd, MMMM dd, yyyy h:mm tt",
				F: "dddd, MMMM dd, yyyy h:mm:ss tt",
				M: "dd MMMM",
				Y: "MMMM,yyyy"
			}
		}
	}
});