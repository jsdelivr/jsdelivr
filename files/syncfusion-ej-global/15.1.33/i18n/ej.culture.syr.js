ej.addCulture( "syr", {
	name: "syr",
	englishName: "Syriac",
	nativeName: "ܣܘܪܝܝܐ",
	language: "syr",
	isRTL: true,
	numberFormat: {
		currency: {
			pattern: ["-n $","n $"],
			symbol: "ܠ.ܣ.\u200f"
		}
	},
	calendars: {
		standard: {
			days: {
				names: ["ܚܕ ܒܫܒܐ","ܬܪܝܢ ܒܫܒܐ","ܬܠܬܐ ܒܫܒܐ","ܐܪܒܥܐ ܒܫܒܐ","ܚܡܫܐ ܒܫܒܐ","ܥܪܘܒܬܐ","ܫܒܬܐ"],
				namesAbbr: ["\u070fܐ \u070fܒܫ","\u070fܒ \u070fܒܫ","\u070fܓ \u070fܒܫ","\u070fܕ \u070fܒܫ","\u070fܗ \u070fܒܫ","\u070fܥܪܘܒ","\u070fܫܒ"],
				namesShort: ["ܐ","ܒ","ܓ","ܕ","ܗ","ܥ","ܫ"]
			},
			months: {
				names: ["ܟܢܘܢ ܐܚܪܝ","ܫܒܛ","ܐܕܪ","ܢܝܣܢ","ܐܝܪ","ܚܙܝܪܢ","ܬܡܘܙ","ܐܒ","ܐܝܠܘܠ","ܬܫܪܝ ܩܕܝܡ","ܬܫܪܝ ܐܚܪܝ","ܟܢܘܢ ܩܕܝܡ",""],
				namesAbbr: ["\u070fܟܢ \u070fܒ","ܫܒܛ","ܐܕܪ","ܢܝܣܢ","ܐܝܪ","ܚܙܝܪܢ","ܬܡܘܙ","ܐܒ","ܐܝܠܘܠ","\u070fܬܫ \u070fܐ","\u070fܬܫ \u070fܒ","\u070fܟܢ \u070fܐ",""]
			},
			AM: ["ܩ.ܛ","ܩ.ܛ","ܩ.ܛ"],
			PM: ["ܒ.ܛ","ܒ.ܛ","ܒ.ܛ"],
			patterns: {
				d: "dd/MM/yyyy",
				D: "dd MMMM, yyyy",
				t: "hh:mm tt",
				T: "hh:mm:ss tt",
				f: "dd MMMM, yyyy hh:mm tt",
				F: "dd MMMM, yyyy hh:mm:ss tt",
				M: "MMMM dd",
				Y: "MMMM, yyyy"
			}
		}
	}
});
