ej.addCulture( "fa", {
	name: "fa",
	englishName: "Persian",
	nativeName: "فارسى",
	language: "fa",
	isRTL: true,
	numberFormat: {
		pattern: ["n-"],
		",": "،",
		".": "/",
		"NaN": "مبهم",
		negativeInfinity: "منهای بی نهایت",
		positiveInfinity: "بی نهایت",
		percent: {
			",": "،",
			".": "/"
		},
		currency: {
			pattern: ["$n-","$n"],
			",": "،",
			".": "/",
			symbol: "ريال"
		}
	},
	calendars: {
		standard: {
			firstDay: 6,
			days: {
				names: ["يكشنبه","دوشنبه","سه شنبه","چهارشنبه","پنجشنبه","جمعه","شنبه"],
				namesAbbr: ["يكشنبه","دوشنبه","سه شنبه","چهارشنبه","پنجشنبه","جمعه","شنبه"],
				namesShort: ["ی","د","س","چ","پ","ج","ش"]
			},
			months: {
				names: ["ژانويه","فوريه","مارس","آوريل","مه","ژوئن","ژوئيه","اوت","سپتامبر","اُكتبر","نوامبر","دسامبر",""],
				namesAbbr: ["ژانويه","فوريه","مارس","آوريل","مه","ژوئن","ژوئيه","اوت","سپتامبر","اُكتبر","نوامبر","دسامبر",""]
			},
			AM: ["ق.ظ","ق.ظ","ق.ظ"],
			PM: ["ب.ظ","ب.ظ","ب.ظ"],
			patterns: {
				d: "dd/MM/yyyy",
				D: "dddd، dd MMMM yyyy",
				t: "hh:mm tt",
				T: "hh:mm:ss tt",
				f: "dddd، dd MMMM yyyy hh:mm tt",
				F: "dddd، dd MMMM yyyy hh:mm:ss tt",
				M: "d MMMM",
				Y: "MMMM, yyyy"
			}
		},
		Hijri: {
			name: "Hijri",
			firstDay: 6,
			days: {
				names: ["يكشنبه","دوشنبه","سه شنبه","چهارشنبه","پنجشنبه","جمعه","شنبه"],
				namesAbbr: ["يكشنبه","دوشنبه","سه شنبه","چهارشنبه","پنجشنبه","جمعه","شنبه"],
				namesShort: ["ی","د","س","چ","پ","ج","ش"]
			},
			months: {
				names: ["محرم","صفر","ربیع الاول","ربیع الثانی","جمادی الاول","جمادی الثانی","رجب","شعبان","رمضان","شوال","ذی القعده","ذی الحجه",""],
				namesAbbr: ["محرم","صفر","ربیع الاول","ربیع الثانی","جمادی الاول","جمادی الثانی","رجب","شعبان","رمضان","شوال","ذی القعده","ذی الحجه",""]
			},
			AM: ["ق.ظ","ق.ظ","ق.ظ"],
			PM: ["ب.ظ","ب.ظ","ب.ظ"],
			twoDigitYearMax: 1451,
			patterns: {
				d: "dd/MM/yyyy",
				D: "dddd'،' dd MMMM yyyy",
				t: "hh:mm tt",
				T: "hh:mm:ss tt",
				f: "dddd'،' dd MMMM yyyy hh:mm tt",
				F: "dddd'،' dd MMMM yyyy hh:mm:ss tt",
				M: "d MMMM",
				Y: "MMMM, yyyy"
			},
			convert: {
                    // Adapted to Script from System.Globalization.HijriCalendar
                    ticks1970: 62135596800000,
                    // number of days leading up to each month
                    monthDays: [0, 30, 59, 89, 118, 148, 177, 207, 236, 266, 295, 325, 355],
                    minDate: -42521673600000,
                    maxDate: 253402300799999,
                    // The number of days to add or subtract from the calendar to accommodate the variances
                    // in the start and the end of Ramadan and to accommodate the date difference between
                    // countries/regions. May be dynamically adjusted based on user preference, but should
                    // remain in the range of -2 to 2, inclusive.
                    hijriAdjustment: 0,
                    toGregorian: function(hyear, hmonth, hday) {
                        var daysSinceJan0101 = this.daysToYear(hyear) + this.monthDays[hmonth] + hday - 1 - this.hijriAdjustment;
                        // 86400000 = ticks per day
                        var gdate = new Date(daysSinceJan0101 * 86400000 - this.ticks1970);
                        // adjust for timezone, because we are interested in the gregorian date for the same timezone
                        // but ticks in javascript is always from GMT, unlike the server were ticks counts from the base
                        // date in the current timezone.
                        gdate.setMinutes(gdate.getMinutes() + gdate.getTimezoneOffset());
                        return gdate;
                    },
                    fromGregorian: function(gdate) {
                        if ((gdate < this.minDate) || (gdate > this.maxDate)) return null;
                        var ticks = this.ticks1970 + (gdate-0) - gdate.getTimezoneOffset() * 60000,
                            daysSinceJan0101 = Math.floor(ticks / 86400000) + 1 + this.hijriAdjustment;
                        // very particular formula determined by someone smart, adapted from the server-side implementation.
                        // it approximates the hijri year.
                        var hday, hmonth, hyear = Math.floor(((daysSinceJan0101 - 227013) * 30) / 10631) + 1,
                            absDays = this.daysToYear(hyear),
                            daysInYear = this.isLeapYear(hyear) ? 355 : 354;
                        // hyear is just approximate, it may need adjustment up or down by 1.
                        if (daysSinceJan0101 < absDays) {
                            hyear--;
                            absDays -= daysInYear;
                        }
                        else if (daysSinceJan0101 === absDays) {
                            hyear--;
                            absDays = this.daysToYear(hyear);
                        }
                        else {
                            if (daysSinceJan0101 > (absDays + daysInYear)) {
                                absDays += daysInYear;
                                hyear++;
                            }
                        }
                        // determine month by looking at how many days into the hyear we are
                        // monthDays contains the number of days up to each month.
                        hmonth = 0;
                        var daysIntoYear = daysSinceJan0101 - absDays;
                        while (hmonth <= 11 && daysIntoYear > this.monthDays[hmonth]) {
                            hmonth++;
                        }
                        hmonth--;
                        hday = daysIntoYear - this.monthDays[hmonth];
                        return [hyear, hmonth, hday];
                    },
                    daysToYear: function(year) {
                        // calculates how many days since Jan 1, 0001
                        var yearsToYear30 = Math.floor((year - 1) / 30) * 30,
                            yearsInto30 = year - yearsToYear30 - 1,
                            days = Math.floor((yearsToYear30 * 10631) / 30) + 227013;
                        while (yearsInto30 > 0) {
                            days += (this.isLeapYear(yearsInto30) ? 355 : 354);
                            yearsInto30--;
                        }
                        return days;
                    },
                    isLeapYear: function(year) {
                        return ((((year * 11) + 14) % 30) < 11);
                    }
			}
		},
		Gregorian_TransliteratedFrench: {
			name: "Gregorian_TransliteratedFrench",
			firstDay: 6,
			days: {
				names: ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
				namesAbbr: ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
				namesShort: ["ح","ن","ث","ر","خ","ج","س"]
			},
			months: {
				names: ["جانفييه","فيفرييه","مارس","أفريل","مي","جوان","جوييه","أوت","سبتمبر","اكتوبر","نوفمبر","ديسمبر",""],
				namesAbbr: ["جانفييه","فيفرييه","مارس","أفريل","مي","جوان","جوييه","أوت","سبتمبر","اكتوبر","نوفمبر","ديسمبر",""]
			},
			AM: ["ق.ظ","ق.ظ","ق.ظ"],
			PM: ["ب.ظ","ب.ظ","ب.ظ"],
			patterns: {
				d: "MM/dd/yyyy",
				D: "dddd, MMMM dd, yyyy",
				t: "hh:mm tt",
				T: "hh:mm:ss tt",
				f: "dddd, MMMM dd, yyyy hh:mm tt",
				F: "dddd, MMMM dd, yyyy hh:mm:ss tt",
				M: "dd MMMM",
				Y: "MMMM, yyyy"
			}
		},
		Gregorian_TransliteratedEnglish: {
			name: "Gregorian_TransliteratedEnglish",
			firstDay: 6,
			days: {
				names: ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
				namesAbbr: ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
				namesShort: ["أ","ا","ث","أ","خ","ج","س"]
			},
			months: {
				names: ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",""],
				namesAbbr: ["يناير","فبراير","مارس","ابريل","مايو","يونيو","يوليو","اغسطس","سبتمبر","اكتوبر","نوفمبر","ديسمبر",""]
			},
			AM: ["ق.ظ","ق.ظ","ق.ظ"],
			PM: ["ب.ظ","ب.ظ","ب.ظ"],
			patterns: {
				d: "MM/dd/yyyy",
				D: "dddd, MMMM dd, yyyy",
				t: "hh:mm tt",
				T: "hh:mm:ss tt",
				f: "dddd, MMMM dd, yyyy hh:mm tt",
				F: "dddd, MMMM dd, yyyy hh:mm:ss tt",
				M: "dd MMMM",
				Y: "MMMM, yyyy"
			}
		}
	}
});