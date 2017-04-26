ej.addCulture( "si", {
	name: "si",
	englishName: "Sinhala",
	nativeName: "සිංහල",
	language: "si",
	numberFormat: {
		groupSizes: [3,2],
		negativeInfinity: "-අනන්තය",
		positiveInfinity: "අනන්තය",
		percent: {
			groupSizes: [3,2]
		},
		currency: {
			pattern: ["($ n)","$ n"],
			symbol: "රු."
		}
	},
	calendars: {
		standard: {
			"/": "-",
			firstDay: 1,
			days: {
				names: ["ඉරිදා","සඳුදා","අඟහරුවාදා","බදාදා","බ්\u200dරහස්පතින්දා","සිකුරාදා","සෙනසුරාදා"],
				namesAbbr: ["ඉරිදා","සඳුදා","කුජදා","බුදදා","ගුරුදා","කිවිදා","ශනිදා"],
				namesShort: ["ඉ","ස","අ","බ","බ්\u200dර","සි","සෙ"]
			},
			months: {
				names: ["ජනවාරි","පෙබරවාරි","මාර්තු","අ\u200cප්\u200dරේල්","මැයි","ජූනි","ජූලි","අ\u200cගෝස්තු","සැප්තැම්බර්","ඔක්තෝබර්","නොවැම්බර්","දෙසැම්බර්",""],
				namesAbbr: ["ජන.","පෙබ.","මාර්තු.","අප්\u200dරේල්.","මැයි","ජූනි","ජූලි","අගෝ.","සැප්.","ඔක්.","නොවැ.","දෙසැ.",""]
			},
			AM: ["පෙ.ව.","පෙ.ව.","පෙ.ව."],
			PM: ["ප.ව.","ප.ව.","ප.ව."],
			patterns: {
				d: "yyyy-MM-dd",
				D: "yyyy MMMM' මස 'dd' වැනිදා 'dddd",
				t: "tt h:mm",
				T: "tt h:mm:ss",
				f: "yyyy MMMM' මස 'dd' වැනිදා 'dddd tt h:mm",
				F: "yyyy MMMM' මස 'dd' වැනිදා 'dddd tt h:mm:ss",
				M: "MMMM dd",
				Y: "yyyy MMMM"
			}
		}
	}
});