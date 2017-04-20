ej.addCulture( "yo-NG", {
	name: "yo-NG",
	englishName: "Yoruba (Nigeria)",
	nativeName: "Yoruba (Nigeria)",
	language: "yo",
	numberFormat: {
		currency: {
			pattern: ["-$ n","$ n"],
			symbol: "₦"
		}
	},
	calendars: {
		standard: {
			name: "Hijri",
			days: {
				names: ["Àìkú","Ajé","Ìṣẹ́gun","Ọjọ́'rú","Ọjọ́'bọ̀","Ẹtì","Àbámẹ́ta"],
				namesAbbr: ["Àìk","Ajé","Ìṣg","Ọjr","Ọjb","Ẹti","Àbá"],
				namesShort: ["Àì","Aj","Ìṣ","Ọj","Ọb","Ẹt","Àb"]
			},
			months: {
				names: ["Oṣu Muharram","Oṣu Safar","Oṣu R Awwal","Oṣu R Aakhir","Oṣu J Awwal","Oṣu J Aakhira","Oṣu Rajab","Oṣu Sha'baan","Oṣu Ramadhan","Oṣu Shawwal","Oṣu Dhul Qa'dah","Oṣu Dhul Hijjah",""],
				namesAbbr: ["Oṣu Muharram","Oṣu Safar","Oṣu R Awwal","Oṣu R Aakhir","Oṣu J Awwal","Oṣu J Aakhira","Oṣu Rajab","Oṣu Sha'baan","Oṣu Ramadhan","Oṣu Shawwal","Oṣu Dhul Qa'dah","Oṣu Dhul Hijjah",""]
			},
			AM: ["Òwúrọ́","òwúrọ́","ÒWÚRỌ́"],
			PM: ["Alẹ̀","alẹ̀","ALẸ̀"],
			twoDigitYearMax: 1451,
			patterns: {
				d: "d/M/yyyy",
				D: "dddd, dd MMMM, yyyy",
				f: "dddd, dd MMMM, yyyy h:mm tt",
				F: "dddd, dd MMMM, yyyy h:mm:ss tt",
				M: "dd MMMM",
				Y: "MMMM,yyyy"
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
		Gregorian_Localized: {
			days: {
				names: ["Àìkú","Ajé","Ìṣẹ́gun","Ọjọ́'rú","Ọjọ́'bọ̀","Ẹtì","Àbámẹ́ta"],
				namesAbbr: ["Àìk","Ajé","Ìṣg","Ọjr","Ọjb","Ẹti","Àbá"],
				namesShort: ["Àì","Aj","Ìṣ","Ọj","Ọb","Ẹt","Àb"]
			},
			months: {
				names: ["Ṣẹ́ẹ́rẹ́","Erèlé","Ẹrẹ́nà","Igbe","Èbìbí","Okúdù","Agẹmọ","Ògún","Ọwẹ́wẹ̀","Ọ̀wàrà","Belu","Ọ̀pẹ",""],
				namesAbbr: ["Ṣẹ́ẹ́","Èrè","Ẹrẹ́","Igb","Èbì","Okd","Agẹ","Ògú","Ọwẹ","Ọ̀wà","Bel","Ọ̀pẹ",""]
			},
			AM: ["Òwúrọ́","òwúrọ́","ÒWÚRỌ́"],
			PM: ["Alẹ̀","alẹ̀","ALẸ̀"],
			patterns: {
				d: "d/M/yyyy",
				D: "dddd, dd MMMM, yyyy",
				f: "dddd, dd MMMM, yyyy h:mm tt",
				F: "dddd, dd MMMM, yyyy h:mm:ss tt",
				Y: "MMMM,yyyy"
			}
		}
	}
});
