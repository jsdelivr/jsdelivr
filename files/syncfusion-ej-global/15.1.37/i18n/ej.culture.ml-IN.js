ej.addCulture( "ml-IN", {
	name: "ml-IN",
	englishName: "Malayalam (India)",
	nativeName: "മലയാളം (ഭാരതം)",
	language: "ml",
	numberFormat: {
		groupSizes: [3,2],
		percent: {
			pattern: ["-%n","%n"],
			groupSizes: [3,2]
		},
		currency: {
			pattern: ["$ -n","$ n"],
			groupSizes: [3,2],
			symbol: "₹"
		}
	},
	calendars: {
		standard: {
			"/": "-",
			":": ".",
			firstDay: 1,
			days: {
				names: ["ഞായറാഴ്ച","തിങ്കളാഴ്ച","ചൊവ്വാഴ്ച","ബുധനാഴ്ച","വ്യാഴാഴ്ച","വെള്ളിയാഴ്ച","ശനിയാഴ്ച"],
				namesAbbr: ["ഞായർ.","തിങ്കൾ.","ചൊവ്വ.","ബുധൻ.","വ്യാഴം.","വെള്ളി.","ശനി."],
				namesShort: ["ഞാ","തി","ചൊ","ബു","വ്യാ","വെ","ശ"]
			},
			months: {
				names: ["ജനുവരി","ഫെബ്രുവരി","മാര്\u200d\u200cച്ച്","ഏപ്രില്\u200d","മെയ്","ജൂണ്\u200d","ജൂലൈ","ആഗസ്റ്റ്","സെപ്\u200cറ്റംബര്\u200d","ഒക്\u200cടോബര്\u200d","നവംബര്\u200d","ഡിസംബര്\u200d",""],
				namesAbbr: ["ജനുവരി","ഫെബ്രുവരി","മാര്\u200d\u200cച്ച്","ഏപ്രില്\u200d","മെയ്","ജൂണ്\u200d","ജൂലൈ","ആഗസ്റ്റ്","സെപ്\u200cറ്റംബര്\u200d","ഒക്\u200cടോബര്\u200d","നവംബര്\u200d","ഡിസംബര്\u200d",""]
			},
			patterns: {
				d: "dd-MM-yy",
				D: "dd MMMM yyyy",
				t: "HH.mm",
				T: "HH.mm.ss",
				f: "dd MMMM yyyy HH.mm",
				F: "dd MMMM yyyy HH.mm.ss",
				M: "MMMM dd",
				Y: "MMMM, yyyy"
			}
		}
	}
});
