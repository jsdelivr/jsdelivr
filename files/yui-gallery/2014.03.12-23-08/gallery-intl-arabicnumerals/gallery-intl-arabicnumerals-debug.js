YUI.add('gallery-intl-arabicnumerals', function(Y) {

Y.mix(Y.namespace("Intl"), {
    _arabicNumeralsTrans: {"\u0660": 0, "\u0661": 1, "\u0662": 2, "\u0663": 3, "\u0664": 4, "\u0665": 5, "\u0666": 6, "\u0667": 7, "\u0668": 8, "\u0669": 9},
    _extendedArabicNumeralsTrans: {"\u06F0": 0, "\u06F1": 1, "\u06F2": 2, "\u06F3": 3, "\u06F4": 4, "\u06F5": 5, "\u06F6": 6, "\u06F7": 7, "\u06F8": 8, "\u06F9": 9},
    _replaceArabicNumerals: function (str) {
        var _this = this;
        str = str.replace(/[\u0660-\u0669]/g, function (c) {return _this._arabicNumeralsTrans[c]; });
        return str.replace(/[\u06F0-\u06F9]/g, function (c) {return _this._extendedArabicNumeralsTrans[c]; });
    },
    parseInt: function (str, base) {
        if (base === null) { base = 10; } // Not sure if anybody would use another base, but if so, it's here
        return parseInt(this._replaceArabicNumerals(str), base);
    },
    parseFloat: function (str) {
        str = this._replaceArabicNumerals(str);
        return parseFloat(str.replace("\u066B", "."));

    },
	textToArabicNumerals: function (str) {
		// Change to the Proper Decimal place
		str = str.replace(/(?=(^|\D)\d+)(\.)(?=\d+(\D|$))/g, "\u066B");
		return str.replace(/\d/g, function (c) { return String.fromCharCode(parseInt(c, 10) + 0x0660); });
	},
	textToExtendedArabicNumerals: function (str) {
		// Change to the Proper Decimal place
		str = str.replace(/(?=(^|\D)\d+)(\.)(?=\d+(\D|$))/g, "\u066B");
		return str.replace(/\d/g, function (c) { return String.fromCharCode(parseInt(c, 10) + 0x06F0); });
	}
});


}, 'gallery-2012.03.23-18-00' ,{skinnable:false});
