/*! text-formatjs | 1.0.3 | 2017-02-17 */
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        require("text-resources");
        global.CalendarData = CalendarData;
        global.CurrencyNames = CurrencyNames;
        global.FormatData = FormatData;
        global.LocaleNames = LocaleNames;
        exports["ResourceBundle"] = module.exports = factory(global);
    } else {
        factory(global);
    }
})(this, function(global) {
    function ResourceBundle() {}
    ResourceBundle.getBundle = function(baseName) {
        var locale = arguments.length > 1 && arguments[1] ? arguments[1] : Locale.getDefault();
        var bundle = _cache[baseName + "-" + locale.toLanguageTag()];
        if (bundle) {
            return bundle;
        }
        if (global[baseName]) {
            if (global[baseName][""]) {
                var language = locale.getLanguage();
                var country = locale.getCountry();
                var variant = locale.getVariant();
                var key;
                bundle = {};
                for (key in global[baseName][""]) {
                    bundle[key] = global[baseName][""][key];
                }
                if (language && language.length > 0) {
                    var code = language;
                    if (global[baseName][code]) {
                        for (key in global[baseName][code]) {
                            bundle[key] = global[baseName][code][key];
                        }
                    }
                    if (country && country.length > 0) {
                        code += "-" + country;
                        if (global[baseName][code]) {
                            for (key in global[baseName][code]) {
                                bundle[key] = global[baseName][code][key];
                            }
                        }
                        if (variant && variant.length > 0) {
                            code += "-" + variant;
                            if (global[baseName][code]) {
                                for (key in global[baseName][code]) {
                                    bundle[key] = global[baseName][code][key];
                                }
                            }
                        }
                    }
                }
                _cache[baseName + "-" + locale.toLanguageTag()] = bundle;
                return bundle;
            } else {
                return {};
            }
        } else {
            return null;
        }
    };
    var _cache = {};
    global.ResourceBundle = ResourceBundle;
    return ResourceBundle;
});

(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        exports["Locale"] = module.exports = factory(global);
    } else {
        factory(global);
    }
})(this, function(global) {
    function Locale(language, country, variant) {
        var _DISPLAY_LANGUAGE = 0;
        var _DISPLAY_COUNTRY = 1;
        var _DISPLAY_VARIANT = 2;
        // var _DISPLAY_SCRIPT = 3;
        var _language = language ? language.toLowerCase() : "";
        var _country = country ? country.toUpperCase() : "";
        var _variant = variant ? variant.toString() : "";
        var _getDisplayString = function(code, inLocale, type) {
            if (code.length == 0) {
                return "";
            }
            var bundle = ResourceBundle.getBundle("LocaleNames", inLocale);
            var key = type == _DISPLAY_VARIANT ? "%%" + code : code;
            var result = null;
            if (!result) {
                result = bundle[key];
            }
            if (result) {
                return result;
            }
            return code;
        };
        var _getDisplayVariantArray = function(bundle, inLocale) {
            if (_variant.length == 0) {
                return [];
            }
            // Split the variant name into tokens separated by '_'.
            var variants = _variant.split("_");
            // For each variant token, lookup the display name.  If
            // not found, use the variant name itself.
            var names = variants.map(function(variant) {
                return _getDisplayString(variant, inLocale, _DISPLAY_VARIANT);
            });
            return names;
        };
        this.getLanguage = function() {
            return _language;
        };
        this.getCountry = function() {
            return _country;
        };
        this.getVariant = function() {
            return _variant;
        };
        this.toLanguageTag = function() {
            var tag = "";
            if (_language.length > 0) {
                tag = _language;
            }
            if (_country.length > 0) {
                tag += "-" + _country;
            }
            if (_variant.length) {
                tag += "-" + _variant;
            }
            return tag;
        };
        this.getDisplayLanguage = function(inLocale) {
            return _getDisplayString(this.getLanguage(), inLocale, _DISPLAY_LANGUAGE);
        };
        this.getDisplayCountry = function(inLocale) {
            return _getDisplayString(this.getCountry(), inLocale, _DISPLAY_COUNTRY);
        };
        this.getDisplayVariant = function(inLocale) {
            if (_variant.length == 0) {
                return "";
            }
            var bundle = ResourceBundle.getBundle("LocaleNames", inLocale);
            var names = _getDisplayVariantArray(bundle, inLocale);
            // Get the localized patterns for formatting a list, and use
            // them to format the list.
            var listPattern = null;
            var listCompositionPattern = null;
            try {
                listPattern = bundle["ListPattern"];
                listCompositionPattern = bundle["ListCompositionPattern"];
            } catch (e) {}
            return _formatList(names, listPattern, listCompositionPattern);
        };
        this.getDisplayName = function(inLocale) {
            var bundle = ResourceBundle.getBundle("LocaleNames", inLocale);
            var languageName = this.getDisplayLanguage(inLocale);
            // var scriptName = this.getDisplayScript(inLocale);
            var countryName = this.getDisplayCountry(inLocale);
            var variantNames = _getDisplayVariantArray(bundle, inLocale);
            // Get the localized patterns for formatting a display name.
            var displayNamePattern = null;
            var listPattern = null;
            var listCompositionPattern = null;
            try {
                displayNamePattern = bundle["DisplayNamePattern"];
                listPattern = bundle["ListPattern"];
                listCompositionPattern = bundle["ListCompositionPattern"];
            } catch (e) {}
            // The display name consists of a main name, followed by qualifiers.
            // Typically, the format is "MainName (Qualifier, Qualifier)" but this
            // depends on what pattern is stored in the display locale.
            var mainName;
            var qualifierNames;
            // The main name is the language, or if there is no language, the script,
            // then if no script, the country. If there is no language/script/country
            // (an anomalous situation) then the display name is simply the variant's
            // display name.
            if (languageName.length == 0 && countryName.length == 0) {
                if (variantNames.length == 0) {
                    return "";
                } else {
                    return _formatList(variantNames, listPattern, listCompositionPattern);
                }
            }
            var names = [];
            if (languageName.length != 0) {
                names.push(languageName);
            }
            if (countryName.length != 0) {
                names.push(countryName);
            }
            if (variantNames.length != 0) {
                variantNames.forEach(function(variantName) {
                    names.push(variantName);
                });
            }
            // The first one in the main name
            mainName = names[0];
            // Others are qualifiers
            var numNames = names.length;
            qualifierNames = numNames > 1 ? names.slice(1, numNames) : new Array(0);
            // Create an array whose first element is the number of remaining
            // elements.  This serves as a selector into a ChoiceFormat pattern from
            // the resource.  The second and third elements are the main name and
            // the qualifier; if there are no qualifiers, the third element is
            // unused by the format pattern.
            var displayNames = [ qualifierNames.length != 0 ? 2 : 1, mainName, // We could also just call formatList() and have it handle the empty
            // list case, but this is more efficient, and we want it to be
            // efficient since all the language-only locales will not have any
            // qualifiers.
            qualifierNames.length != 0 ? _formatList(qualifierNames, listPattern, listCompositionPattern) : null ];
            if (displayNamePattern != null) {
                return new MessageFormat(displayNamePattern).format(displayNames);
            } else {
                // If we cannot get the message format pattern, then we use a simple
                // hard-coded pattern.  This should not occur in practice unless the
                // installation is missing some core files (FormatData etc.).
                var result = "";
                result += displayNames[1];
                if (displayNames.length > 2) {
                    result += " (";
                    result += displayNames[2];
                    result += ")";
                }
                return result;
            }
        };
    }
    var _CACHE = {};
    var _defaultLocale;
    var _initDefault = function() {
        var browserLanguageParts = global.navigator ? global.navigator.language.split("-") : [ "en", "US" ];
        var language = "";
        var country = "";
        if (browserLanguageParts.length > 0) {
            language = browserLanguageParts[0];
            if (browserLanguageParts.length > 1) {
                country = browserLanguageParts[1];
            }
        }
        _defaultLocale = _getInstance(language, country);
    };
    var _getInstance = function(language, country, variant) {
        var parts = [ language ];
        var locale;
        var key;
        if (country) {
            parts.push(country);
        }
        if (variant) {
            parts.push(variant);
        }
        key = parts.join("-");
        locale = _CACHE[key];
        if (locale) {
            return locale;
        } else {
            locale = new Locale(language, country, variant);
            _CACHE[key] = locale;
            return locale;
        }
    };
    var _formatList = function(stringList, listPattern, listCompositionPattern) {
        // If we have no list patterns, compose the list in a simple,
        // non-localized way.
        var format;
        var i;
        if (listPattern == null || listCompositionPattern == null) {
            var result = "";
            for (i = 0; i < stringList.length; ++i) {
                if (i > 0) result += ",";
                result += stringList[i];
            }
            return result;
        }
        // Compose the list down to three elements if necessary
        if (stringList.length > 3) {
            format = new MessageFormat(listCompositionPattern);
            stringList = _composeList(format, stringList);
        }
        // Rebuild the argument list with the list length as the first element
        var args = new Array(stringList.length + 1);
        for (i = 0; i < stringList.length; i++) {
            args[i + 1] = stringList[i];
        }
        args[0] = stringList.length;
        // Format it using the pattern in the resource
        format = new MessageFormat(listPattern);
        return format.format(args);
    };
    var _composeList = function(format, list) {
        if (list.length <= 3) return list;
        // Use the given format to compose the first two elements into one
        var listItems = [ list[0], list[1] ];
        var newItem = format.format(listItems);
        // Form a new list one element shorter
        var newList = new Array(list.length - 1);
        for (var i = 2; i < newList.length - 1; i++) {
            newList[i - 1] = list[i];
        }
        newList[0] = newItem;
        // Recurse
        return _composeList(format, newList);
    };
    Locale.getDefault = function() {
        if (!_defaultLocale) {
            _initDefault();
        }
        return _defaultLocale;
    };
    Locale.setDefault = function(newLocale) {
        _defaultLocale = newLocale;
    };
    Locale.forLanguageTag = function(tag) {
        var language;
        var country;
        var variant;
        var index;
        var part = tag;
        index = part.search("-");
        if (index > -1) {
            language = part.substring(0, index);
            part = part.substring(index + 1);
            index = part.search("-");
            if (index > -1) {
                country = part.substring(0, index);
                variant = part.substring(index + 1);
            } else {
                country = part;
            }
        } else {
            language = part;
        }
        return new Locale(language, country, variant);
    };
    Locale.prototype.toString = function() {
        return this.toLanguageTag();
    };
    global.Locale = Locale;
    return Locale;
});

(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        exports["CurrencyData"] = module.exports = factory(global);
    } else {
        factory(global);
    }
})(this, function(global) {
    global.CurrencyData = {
        formatVersion: "1",
        dataVersion: "140",
        all: "ADP020-AED784-AFA004-AFN971-ALL008-AMD051-ANG532-AOA973-ARS032-ATS040-AUD036-" + "AWG533-AYM945-AZM031-AZN944-BAM977-BBD052-BDT050-BEF056-BGL100-BGN975-BHD048-BIF108-" + "BMD060-BND096-BOB068-BOV984-BRL986-BSD044-BTN064-BWP072-BYB112-BYR974-" + "BZD084-CAD124-CDF976-CHF756-CLF990-CLP152-CNY156-COP170-CRC188-CSD891-CUP192-" + "CVE132-CYP196-CZK203-DEM276-DJF262-DKK208-DOP214-DZD012-EEK233-EGP818-" + "ERN232-ESP724-ETB230-EUR978-FIM246-FJD242-FKP238-FRF250-GBP826-GEL981-" + "GHC288-GHS936-GIP292-GMD270-GNF324-GRD300-GTQ320-GWP624-GYD328-HKD344-HNL340-" + "HRK191-HTG332-HUF348-IDR360-IEP372-ILS376-INR356-IQD368-IRR364-ISK352-" + "ITL380-JMD388-JOD400-JPY392-KES404-KGS417-KHR116-KMF174-KPW408-KRW410-" + "KWD414-KYD136-KZT398-LAK418-LBP422-LKR144-LRD430-LSL426-LTL440-LUF442-" + "LVL428-LYD434-MAD504-MDL498-MGA969-MGF450-MKD807-MMK104-MNT496-MOP446-MRO478-" + "MTL470-MUR480-MVR462-MWK454-MXN484-MXV979-MYR458-MZM508-MZN943-NAD516-NGN566-" + "NIO558-NLG528-NOK578-NPR524-NZD554-OMR512-PAB590-PEN604-PGK598-PHP608-" + "PKR586-PLN985-PTE620-PYG600-QAR634-ROL946-RON946-RSD941-RUB643-RUR810-RWF646-SAR682-" + "SBD090-SCR690-SDD736-SDG938-SEK752-SGD702-SHP654-SIT705-SKK703-SLL694-SOS706-" + "SRD968-SRG740-STD678-SVC222-SYP760-SZL748-THB764-TJS972-TMM795-TND788-TOP776-" + "TPE626-TRL792-TRY949-TTD780-TWD901-TZS834-UAH980-UGX800-USD840-USN997-USS998-" + "UYU858-UZS860-VEB862-VEF937-VND704-VUV548-WST882-XAF950-XAG961-XAU959-XBA955-" + "XBB956-XBC957-XBD958-XCD951-XDR960-XFO000-XFU000-XOF952-XPD964-XPF953-" + "XPT962-XTS963-XXX999-YER886-YUM891-ZAR710-ZMK894-ZWD716-ZWN942",
        AD: "EUR",
        AE: "AED",
        AF: "AFN",
        AG: "XCD",
        AI: "XCD",
        AL: "ALL",
        AM: "AMD",
        AN: "ANG",
        AO: "AOA",
        AQ: "",
        AR: "ARS",
        AS: "USD",
        AT: "EUR",
        AU: "AUD",
        AW: "AWG",
        AX: "EUR",
        AZ: "AZM;2005-12-31-20-00-00;AZN",
        BA: "BAM",
        BB: "BBD",
        BD: "BDT",
        BE: "EUR",
        BF: "XOF",
        BG: "BGN",
        BH: "BHD",
        BI: "BIF",
        BJ: "XOF",
        BL: "EUR",
        BM: "BMD",
        BN: "BND",
        BO: "BOB",
        BR: "BRL",
        BS: "BSD",
        BT: "BTN",
        BV: "NOK",
        BW: "BWP",
        BY: "BYR",
        BZ: "BZD",
        CA: "CAD",
        CC: "AUD",
        CD: "CDF",
        CF: "XAF",
        CG: "XAF",
        CH: "CHF",
        CI: "XOF",
        CK: "NZD",
        CL: "CLP",
        CM: "XAF",
        CN: "CNY",
        CO: "COP",
        CR: "CRC",
        CS: "CSD",
        CU: "CUP",
        CV: "CVE",
        CX: "AUD",
        CY: "EUR",
        CZ: "CZK",
        DE: "EUR",
        DJ: "DJF",
        DK: "DKK",
        DM: "XCD",
        DO: "DOP",
        DZ: "DZD",
        EC: "USD",
        EE: "EEK",
        EG: "EGP",
        EH: "MAD",
        ER: "ERN",
        ES: "EUR",
        ET: "ETB",
        FI: "EUR",
        FJ: "FJD",
        FK: "FKP",
        FM: "USD",
        FO: "DKK",
        FR: "EUR",
        GA: "XAF",
        GB: "GBP",
        GD: "XCD",
        GE: "GEL",
        GF: "EUR",
        GG: "GBP",
        GH: "GHS",
        GI: "GIP",
        GL: "DKK",
        GM: "GMD",
        GN: "GNF",
        GP: "EUR",
        GQ: "XAF",
        GR: "EUR",
        GS: "GBP",
        GT: "GTQ",
        GU: "USD",
        GW: "XOF",
        GY: "GYD",
        HK: "HKD",
        HM: "AUD",
        HN: "HNL",
        HR: "HRK",
        HT: "HTG",
        HU: "HUF",
        ID: "IDR",
        IE: "EUR",
        IL: "ILS",
        IM: "GBP",
        IN: "INR",
        IO: "USD",
        IQ: "IQD",
        IR: "IRR",
        IS: "ISK",
        IT: "EUR",
        JE: "GBP",
        JM: "JMD",
        JO: "JOD",
        JP: "JPY",
        KE: "KES",
        KG: "KGS",
        KH: "KHR",
        KI: "AUD",
        KM: "KMF",
        KN: "XCD",
        KP: "KPW",
        KR: "KRW",
        KW: "KWD",
        KY: "KYD",
        KZ: "KZT",
        LA: "LAK",
        LB: "LBP",
        LC: "XCD",
        LI: "CHF",
        LK: "LKR",
        LR: "LRD",
        LS: "LSL",
        LT: "LTL",
        LU: "EUR",
        LV: "LVL",
        LY: "LYD",
        MA: "MAD",
        MC: "EUR",
        MD: "MDL",
        ME: "EUR",
        MF: "EUR",
        MG: "MGA",
        MH: "USD",
        MK: "MKD",
        ML: "XOF",
        MM: "MMK",
        MN: "MNT",
        MO: "MOP",
        MP: "USD",
        MQ: "EUR",
        MR: "MRO",
        MS: "XCD",
        MT: "EUR",
        MU: "MUR",
        MV: "MVR",
        MW: "MWK",
        MX: "MXN",
        MY: "MYR",
        MZ: "MZM;2006-06-30-22-00-00;MZN",
        NA: "NAD",
        NC: "XPF",
        NE: "XOF",
        NF: "AUD",
        NG: "NGN",
        NI: "NIO",
        NL: "EUR",
        NO: "NOK",
        NP: "NPR",
        NR: "AUD",
        NU: "NZD",
        NZ: "NZD",
        OM: "OMR",
        PA: "PAB",
        PE: "PEN",
        PF: "XPF",
        PG: "PGK",
        PH: "PHP",
        PK: "PKR",
        PL: "PLN",
        PM: "EUR",
        PN: "NZD",
        PR: "USD",
        PS: "ILS",
        PT: "EUR",
        PW: "USD",
        PY: "PYG",
        QA: "QAR",
        RE: "EUR",
        RO: "ROL;2005-06-30-21-00-00;RON",
        RS: "RSD",
        RU: "RUB",
        RW: "RWF",
        SA: "SAR",
        SB: "SBD",
        SC: "SCR",
        SD: "SDG",
        SE: "SEK",
        SG: "SGD",
        SH: "SHP",
        SI: "EUR",
        SJ: "NOK",
        SK: "SKK",
        SL: "SLL",
        SM: "EUR",
        SN: "XOF",
        SO: "SOS",
        SR: "SRD",
        ST: "STD",
        SV: "SVC",
        SY: "SYP",
        SZ: "SZL",
        TC: "USD",
        TD: "XAF",
        TF: "EUR",
        TG: "XOF",
        TH: "THB",
        TJ: "TJS",
        TK: "NZD",
        TL: "USD",
        TM: "TMM",
        TN: "TND",
        TO: "TOP",
        TR: "TRL;2004-12-31-22-00-00;TRY",
        TT: "TTD",
        TV: "AUD",
        TW: "TWD",
        TZ: "TZS",
        UA: "UAH",
        UG: "UGX",
        UM: "USD",
        US: "USD",
        UY: "UYU",
        UZ: "UZS",
        VA: "EUR",
        VC: "XCD",
        VE: "VEB;2008-01-01-04-00-00;VEF",
        VG: "USD",
        VI: "USD",
        VN: "VND",
        VU: "VUV",
        WF: "XPF",
        WS: "WST",
        YE: "YER",
        YT: "EUR",
        ZA: "ZAR",
        ZM: "ZMK",
        ZW: "ZWD",
        minor0: "" + "ADP-BEF-BIF-BYB-BYR-CLF-CLP-DJF-ESP-GNF-" + "GRD-ISK-ITL-JPY-KMF-KRW-LUF-MGF-PYG-PTE-RWF-" + "TPE-TRL-VUV-XAF-XOF-XPF",
        minor1: "",
        minor3: "" + "BHD-IQD-JOD-KWD-LYD-OMR-TND",
        minorUndefined: "" + "XAG-XAU-XBA-XBB-XBC-XBD-XDR-XFO-XFU-XPD-" + "XPT-XTS-XXX"
    };
    return global.CurrencyData;
});

(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        global.CurrencyData = module.require("./currency-data");
        exports["Currency"] = module.exports = factory(global);
    } else {
        factory(global);
    }
})(this, function(global) {
    var CurrencyData = global.CurrencyData;
    function Currency(currencyCode, defaultFractionDigits, numericCode) {
        var _currencyCode = currencyCode;
        var _defaultFractionDigits = defaultFractionDigits;
        var _numericCode = numericCode;
        this.getCurrencyCode = function() {
            return _currencyCode;
        };
        this.getDefaultFractionDigits = function() {
            return _defaultFractionDigits;
        };
        this.getNumericCode = function() {
            return _numericCode;
        };
        this.getSymbol = function(locale) {
            var bundle = ResourceBundle.getBundle("CurrencyNames", locale);
            return bundle[_currencyCode];
        };
        this.getDisplayName = function(locale) {
            var bundle = ResourceBundle.getBundle("CurrencyNames", locale);
            return bundle[_currencyCode.toLowerCase()];
        };
    }
    var instances = {};
    Currency.getInstance = function(arg) {
        if (typeof arg == "string") {
            var currencyCode = arg.length > 0 ? arg : "XXX";
            var instance = instances[currencyCode];
            if (!instance) {
                var data = CurrencyData;
                var numericCode = 0;
                var defaultFractionDigit = -1;
                var result = new RegExp(currencyCode + "\\d{3}").exec(data["all"]).toString();
                if (result && result.length > 0) {
                    var regex = new RegExp(currencyCode);
                    numericCode = result.substring(3);
                    defaultFractionDigit = 2;
                    if (regex.test(data["minor0"])) {
                        defaultFractionDigit = 0;
                    }
                    if (regex.test(data["minor1"])) {
                        defaultFractionDigit = 1;
                    }
                    if (regex.test(data["minor3"])) {
                        defaultFractionDigit = 3;
                    }
                    if (regex.test(data["minorUndefined"])) {
                        defaultFractionDigit = -1;
                    }
                }
                instance = new Currency(currencyCode, defaultFractionDigit, numericCode);
                if (defaultFractionDigit != -1) {
                    instances[currencyCode] = instance;
                }
            }
            return instance;
        } else if (arg instanceof Locale) {
            var locale = arg;
            var countryCode = locale.getCountry();
            if (countryCode && countryCode.length > 0) {
                return Currency.getInstance(CurrencyData[countryCode]);
            } else {
                return new Currency("XXX", -1, 0);
            }
        } else {
            return null;
        }
    };
    Currency.prototype.toString = function() {
        return this.getCurrencyCode();
    };
    global.Currency = Currency;
    return Currency;
});

(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        exports["FieldPosition"] = module.exports = factory(global);
    } else {
        factory(global);
    }
})(this, function(global) {
    function FieldPosition(arg) {
        var _this = this;
        this.field = 0;
        this.beginIndex = 0;
        this.endIndex = 0;
        this.attribute = null;
        if (arg instanceof Format.Field) {
            this.attribute = arg;
            if (arguments.length > 1) {
                if (typeof arguments[1] == "number") {
                    this.field = arguments[1];
                }
            }
        } else if (typeof arg == "number") {
            this.field = arg;
        }
        this.__matchesField = function(attribute, field) {
            if (this.attribute) {
                return this.attribute == attribute;
            }
            return field ? this.field == field : false;
        };
        this.getFieldDelegate = function() {
            return new Delegate();
        };
        var Delegate = function Delegate() {
            this.encounteredField = false;
        };
        Delegate.prototype.formatted = function(fieldID, attr, value, start, end, buffer) {
            if (!this.encounteredField && _this.__matchesField(attr, fieldID)) {
                _this.beginIndex = start;
                _this.endIndex = end;
                this.encounteredField = start != end;
            }
        };
    }
    FieldPosition.prototype.equals = function(other) {
        if (!other) return false;
        if (!(other instanceof FieldPosition)) return false;
        if (!this.attribute) {
            if (other.attribute) {
                return false;
            }
        } else if (this.attribute != other.attribute) {
            return false;
        }
        return this.beginIndex == other.beginIndex && this.endIndex == other.endIndex && this.field == other.field;
    };
    FieldPosition.prototype.toString = function() {
        return this.constructor.name + "[field = " + this.field + ", attribute = " + this.attribute + ", beginIndex = " + this.beginIndex + ", endIndex = " + this.endIndex + "]";
    };
    global.FieldPosition = FieldPosition;
    return FieldPosition;
});

(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        exports["ParsePosition"] = module.exports = factory(global);
    } else {
        factory(global);
    }
})(this, function(global) {
    function ParsePosition(index) {
        this.index = 0;
        this.errorIndex = -1;
        this.index = index;
    }
    ParsePosition.prototype.toString = function() {
        return this.constructor.name + "[index = " + this.index + ", errorIndex = " + this.errorIndex + "]";
    };
    global.ParsePosition = ParsePosition;
    return ParsePosition;
});

(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        exports["Format"] = module.exports = factory(global);
    } else {
        factory(global);
    }
})(this, function(global) {
    function Format() {}
    Format.Field = function Field(name) {
        this.name = name;
    };
    Format.Field.prototype.constructor = Format.Field;
    Format.Field.prototype.toString = function() {
        return this.constructor.name + "(" + this.name + ")";
    };
    global.Format = Format;
    return Format;
});

(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        exports["NumberFormat"] = module.exports = factory(global);
    } else {
        factory(global);
    }
})(this, function(global) {
    function NumberFormat() {
        Format.call(this);
        var _groupingUsed = true;
        var _maximumIntegerDigits = 40;
        var _minimumIntegerDigits = 1;
        var _maximumFractionDigits = 3;
        var _minimumFractionDigits = 0;
        var _parseIntegerOnly = false;
        this.isGroupingUsed = function() {
            return _groupingUsed;
        };
        this.setGroupingUsed = function(value) {
            _groupingUsed = value;
        };
        this.getMaximumIntegerDigits = function() {
            return _maximumIntegerDigits;
        };
        this.setMaximumIntegerDigits = function(value) {
            _maximumIntegerDigits = Math.max(0, value);
            _minimumIntegerDigits = Math.min(_minimumIntegerDigits, _maximumIntegerDigits);
        };
        this.getMinimumIntegerDigits = function() {
            return _minimumIntegerDigits;
        };
        this.setMinimumIntegerDigits = function(value) {
            _minimumIntegerDigits = Math.max(0, value);
            _maximumIntegerDigits = Math.max(_minimumIntegerDigits, _maximumIntegerDigits);
        };
        this.getMaximumFractionDigits = function() {
            return _maximumFractionDigits;
        };
        this.setMaximumFractionDigits = function(value) {
            _maximumFractionDigits = Math.max(0, value);
            _minimumFractionDigits = Math.min(_minimumFractionDigits, _maximumFractionDigits);
        };
        this.getMinimumFractionDigits = function() {
            return _minimumFractionDigits;
        };
        this.setMinimumFractionDigits = function(value) {
            _minimumFractionDigits = Math.max(0, value);
            _maximumFractionDigits = Math.max(_minimumFractionDigits, _maximumFractionDigits);
        };
        this.isParseIntegerOnly = function() {
            return _parseIntegerOnly;
        };
        this.setParseIntegerOnly = function(value) {
            _parseIntegerOnly = value;
        };
    }
    // Constants used by factory methods to specify a style of format.
    var _NUMBERSTYLE = 0;
    var _CURRENCYSTYLE = 1;
    var _PERCENTSTYLE = 2;
    var _SCIENTIFICSTYLE = 3;
    var _INTEGERSTYLE = 4;
    var _getInstance = function(desiredLocale, choice) {
        var resource = ResourceBundle.getBundle("FormatData", desiredLocale);
        var numberPatterns = resource["NumberPatterns"];
        var symbols = new DecimalFormatSymbols(desiredLocale);
        var entry = choice == _INTEGERSTYLE ? _NUMBERSTYLE : choice;
        var format = new DecimalFormat(numberPatterns[entry], symbols);
        if (choice == _INTEGERSTYLE) {
            format.setMaximumFractionDigits(0);
            format.setDecimalSeparatorAlwaysShown(false);
            format.setParseIntegerOnly(true);
        } else if (choice == _CURRENCYSTYLE) {
            format.adjustForCurrencyDefaultFractionDigits();
        }
        return format;
    };
    NumberFormat.INTEGER_FIELD = 0;
    NumberFormat.FRACTION_FIELD = 1;
    NumberFormat.getInstance = function(inLocale) {
        return _getInstance(inLocale || Locale.getDefault(), _NUMBERSTYLE);
    };
    NumberFormat.getNumberInstance = function(inLocale) {
        return _getInstance(inLocale || Locale.getDefault(), _NUMBERSTYLE);
    };
    NumberFormat.getIntegerInstance = function(inLocale) {
        return _getInstance(inLocale || Locale.getDefault(), _INTEGERSTYLE);
    };
    NumberFormat.getCurrencyInstance = function(inLocale) {
        return _getInstance(inLocale || Locale.getDefault(), _CURRENCYSTYLE);
    };
    NumberFormat.getPercentInstance = function(inLocale) {
        return _getInstance(inLocale || Locale.getDefault(), _PERCENTSTYLE);
    };
    NumberFormat.prototype = Object.create(Format.prototype);
    NumberFormat.prototype.constructor = NumberFormat;
    NumberFormat.prototype.equals = function(other) {
        if (!other) {
            return false;
        }
        if (this == other) {
            return true;
        }
        if (!(other instanceof NumberFormat)) {
            return false;
        }
        return this.getMaximumIntegerDigits() == other.getMaximumIntegerDigits() && this.getMinimumIntegerDigits() == other.getMinimumIntegerDigits() && this.getMaximumFractionDigits() == other.getMaximumFractionDigits() && this.getMinimumFractionDigits() == other.getMinimumFractionDigits() && this.isGroupingUsed() == other.isGroupingUsed() && this.isParseIntegerOnly() == other.isParseIntegerOnly();
    };
    NumberFormat.Field = function Field(name) {
        Format.Field.call(this, name);
    };
    NumberFormat.Field.prototype = Object.create(Format.Field.prototype);
    NumberFormat.Field.prototype.constructor = NumberFormat.Field;
    NumberFormat.Field.INTEGER = new NumberFormat.Field("integer");
    NumberFormat.Field.FRACTION = new NumberFormat.Field("fraction");
    NumberFormat.Field.EXPONENT = new NumberFormat.Field("exponent");
    NumberFormat.Field.DECIMAL_SEPARATOR = new NumberFormat.Field("decimal separator");
    NumberFormat.Field.SIGN = new NumberFormat.Field("sign");
    NumberFormat.Field.GROUPING_SEPARATOR = new NumberFormat.Field("grouping separator");
    NumberFormat.Field.EXPONENT_SYMBOL = new NumberFormat.Field("exponent symbol");
    NumberFormat.Field.PERCENT = new NumberFormat.Field("percent");
    NumberFormat.Field.PERMILLE = new NumberFormat.Field("per mille");
    NumberFormat.Field.CURRENCY = new NumberFormat.Field("currency");
    NumberFormat.Field.EXPONENT_SIGN = new NumberFormat.Field("exponent sign");
    global.NumberFormat = NumberFormat;
    return NumberFormat;
});

(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        exports["DigitList"] = module.exports = factory(global);
    } else {
        factory(global);
    }
})(this, function(global) {
    function DigitList() {
        var _this = this;
        // var _data = [];
        var _isNegative = false;
        var _round = function(maximumDigits) {
            // Eliminate digits beyond maximum digits to be displayed.
            // Round up if appropriate.
            if (maximumDigits >= 0 && maximumDigits < _this.count) {
                if (_shouldRoundUp(maximumDigits)) {
                    // Rounding up involved incrementing digits from LSD to MSD.
                    // In most cases this is simple, but in a worst case situation
                    // (9999..99) we have to adjust the decimalAt value.
                    for (;;) {
                        --maximumDigits;
                        if (maximumDigits < 0) {
                            // We have all 9's, so we increment to a single digit
                            // of one and adjust the exponent.
                            _this.digits[0] = "1";
                            ++_this.decimalAt;
                            maximumDigits = 0;
                            // Adjust the count
                            break;
                        }
                        ++_this.digits[maximumDigits];
                        if (_this.digits[maximumDigits] <= "9") break;
                    }
                    ++maximumDigits;
                }
                _this.count = maximumDigits;
                // Eliminate trailing zeros.
                while (_this.count > 1 && _this.digits[_this.count - 1] == "0") {
                    --_this.count;
                }
            }
        };
        var _shouldRoundUp = function(maximumDigits) {
            if (maximumDigits < _this.count) {
                if (_this.digits[maximumDigits] > "5") {
                    return true;
                } else if (_this.digits[maximumDigits] == "5") {
                    for (var i = maximumDigits + 1; i < _this.count; ++i) {
                        if (_this.digits[i] != "0") {
                            return true;
                        }
                    }
                    return maximumDigits > 0 && _this.digits[maximumDigits - 1] % 2 != 0;
                }
            }
            return false;
        };
        var _isLongMIN_VALUE = function() {
            if (_this.decimalAt != _this.count || _this.count != DigitList.MAX_COUNT) {
                return false;
            }
            for (var i = 0; i < _this.count; ++i) {
                if (_this.digits[i] != LONG_MIN_REP[i]) return false;
            }
            return true;
        };
        this.decimalAt = 0;
        this.count = 0;
        this.digits = [];
        this.getDouble = function() {
            if (this.count == 0) {
                return 0;
            }
            var temp = "";
            temp += ".";
            temp += this.digits.slice(0, this.count).join("");
            temp += "E";
            temp += this.decimalAt;
            return parseFloat(temp);
        };
        this.getLong = function() {
            // for now, simple implementation; later, do proper IEEE native stuff
            if (this.count == 0) {
                return 0;
            }
            // We have to check for this, because this is the one NEGATIVE value
            // we represent.  If we tried to just pass the digits off to parseLong,
            // we'd get a parse failure.
            if (_isLongMIN_VALUE()) {
                return 0x8000000000000000;
            }
            var temp = "";
            temp += this.digits.slice(0, this.count).join("");
            for (var i = this.count; i < this.decimalAt; ++i) {
                temp += "0";
            }
            return parseInt(temp, 10);
        };
        this.fitsIntoLong = function(isPositive, ignoreNegativeZero) {
            // Figure out if the result will fit in a long.  We have to
            // first look for nonzero digits after the decimal point;
            // then check the size.  If the digit count is 18 or less, then
            // the value can definitely be represented as a long.  If it is 19
            // then it may be too large.
            // Trim trailing zeros.  This does not change the represented value.
            while (this.count > 0 && this.digits[this.count - 1] == "0") {
                --this.count;
            }
            if (this.count == 0) {
                // Positive zero fits into a long, but negative zero can only
                // be represented as a double. - bug 4162852
                return isPositive || ignoreNegativeZero;
            }
            if (this.decimalAt < this.count || this.decimalAt > DigitList.MAX_COUNT) {
                return false;
            }
            if (this.decimalAt < DigitList.MAX_COUNT) return true;
            // At this point we have decimalAt == count, and count == MAX_COUNT.
            // The number will overflow if it is larger than 9223372036854775807
            // or smaller than -9223372036854775808.
            for (var i = 0; i < this.count; ++i) {
                var dig = parseInt(this.digits[i], 10), max = parseInt(LONG_MIN_REP[i], 10);
                if (dig > max) return false;
                if (dig < max) return true;
            }
            // At this point the first count digits match.  If decimalAt is less
            // than count, then the remaining digits are zero, and we return true.
            if (this.count < this.decimalAt) return true;
            // Now we have a representation of Long.MIN_VALUE, without the leading
            // negative sign.  If this represents a positive value, then it does
            // not fit; otherwise it fits.
            return !isPositive;
        };
        this.set = function(isNegative, s, maximumDigits, fixedPoint) {
            _isNegative = isNegative;
            var len = s.length;
            var source = s.split("");
            this.decimalAt = -1;
            this.count = 0;
            var exponent = 0;
            // Number of zeros between decimal point and first non-zero digit after
            // decimal point, for numbers < 1.
            var leadingZerosAfterDecimal = 0;
            var nonZeroDigitSeen = false;
            for (var i = 0; i < len; ) {
                var c = source[i++];
                if (c == ".") {
                    this.decimalAt = this.count;
                } else if (c == "e" || c == "E") {
                    exponent = parseInt(source.slice(i, len).join(""), 10);
                    break;
                } else {
                    if (!nonZeroDigitSeen) {
                        nonZeroDigitSeen = c != "0";
                        if (!nonZeroDigitSeen && this.decimalAt != -1) ++leadingZerosAfterDecimal;
                    }
                    if (nonZeroDigitSeen) {
                        this.digits[this.count++] = c;
                    }
                }
            }
            if (this.decimalAt == -1) {
                this.decimalAt = this.count;
            }
            if (nonZeroDigitSeen) {
                this.decimalAt += exponent - leadingZerosAfterDecimal;
            }
            if (fixedPoint) {
                // The negative of the exponent represents the number of leading
                // zeros between the decimal and the first non-zero digit, for
                // a value < 0.1 (e.g., for 0.00123, -decimalAt == 2).  If this
                // is more than the maximum fraction digits, then we have an underflow
                // for the printed representation.
                if (-this.decimalAt > maximumDigits) {
                    // Handle an underflow to zero when we round something like
                    // 0.0009 to 2 fractional digits.
                    this.count = 0;
                    return;
                } else if (-this.decimalAt == maximumDigits) {
                    // If we round 0.0009 to 3 fractional digits, then we have to
                    // create a new one digit in the least significant location.
                    if (_shouldRoundUp(0)) {
                        this.count = 1;
                        ++this.decimalAt;
                        this.digits[0] = "1";
                    } else {
                        this.count = 0;
                    }
                    return;
                }
            }
            // Eliminate trailing zeros.
            while (this.count > 1 && this.digits[this.count - 1] == "0") {
                --this.count;
            }
            // Eliminate digits beyond maximum digits to be displayed.
            // Round up if appropriate.
            _round(fixedPoint ? maximumDigits + this.decimalAt : maximumDigits);
        };
    }
    var LONG_MIN_REP = "9223372036854775808".split("");
    DigitList.MAX_COUNT = 19;
    DigitList.prototype.isZero = function() {
        for (var i = 0; i < this.count; ++i) {
            if (this.digits[i] != "0") {
                return false;
            }
        }
        return true;
    };
    DigitList.prototype.clear = function() {
        this.decimalAt = 0;
        this.count = 0;
    };
    DigitList.prototype.append = function(digit) {
        this.digits.push(digit);
        this.count = this.digits.length;
    };
    DigitList.prototype.toString = function() {
        if (this.isZero()) {
            return "0";
        }
        var buf = "";
        buf += "0.";
        buf += this.digits.join("");
        buf += "x10^";
        buf += this.decimalAt;
        return buf;
    };
    global.DigitList = DigitList;
    return DigitList;
});

(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        exports["DecimalFormatSymbols"] = module.exports = factory(global);
    } else {
        factory(global);
    }
})(this, function(global) {
    function DecimalFormatSymbols(locale) {
        var _zeroDigit = null;
        var _groupingSeparator = null;
        var _decimalSeparator = null;
        var _perMill = null;
        var _percent = null;
        var _digit = null;
        var _patternSeparator = null;
        var _infinity = null;
        var _NaN = null;
        var _minusSign = null;
        var _currencySymbol = null;
        var _intlCurrencySymbol = null;
        var _monetarySeparator = null;
        var _exponential = null;
        var _exponentialSeparator = null;
        var _locale = null;
        var _currency = null;
        var _initialize = function(locale) {
            var rb = ResourceBundle.getBundle("FormatData", locale);
            var numberElements = rb["NumberElements"];
            _decimalSeparator = numberElements[0];
            _groupingSeparator = numberElements[1];
            _patternSeparator = numberElements[2];
            _percent = numberElements[3];
            _zeroDigit = numberElements[4];
            _digit = numberElements[5];
            _minusSign = numberElements[6];
            _exponential = numberElements[7];
            _exponentialSeparator = numberElements[7];
            _perMill = numberElements[8];
            _infinity = numberElements[9];
            _NaN = numberElements[10];
            if (locale.getCountry().length > 0) {
                _currency = Currency.getInstance(locale);
            }
            if (_currency != null) {
                _intlCurrencySymbol = _currency.getCurrencyCode();
                _currencySymbol = _currency.getSymbol(locale);
            } else {
                _intlCurrencySymbol = "XXX";
                _currency = Currency.getInstance(_intlCurrencySymbol);
                _currencySymbol = "\xa4";
            }
            _locale = locale;
            _monetarySeparator = _decimalSeparator;
        };
        this.getZeroDigit = function() {
            return _zeroDigit;
        };
        this.setZeroDigit = function(zeroDigit) {
            _zeroDigit = zeroDigit;
        };
        this.getGroupingSeparator = function() {
            return _groupingSeparator;
        };
        this.setGroupingSeparator = function(groupingSeparator) {
            _groupingSeparator = groupingSeparator;
        };
        this.getDecimalSeparator = function() {
            return _decimalSeparator;
        };
        this.setDecimalSeparator = function(decimalSeparator) {
            _decimalSeparator = decimalSeparator;
        };
        this.getPerMill = function() {
            return _perMill;
        };
        this.setPerMill = function(perMill) {
            _perMill = perMill;
        };
        this.getPercent = function() {
            return _percent;
        };
        this.setPercent = function(percent) {
            _percent = percent;
        };
        this.getDigit = function() {
            return _digit;
        };
        this.setDigit = function(digit) {
            _digit = digit;
        };
        this.getPatternSeparator = function() {
            return _patternSeparator;
        };
        this.setPatternSeparator = function(patternSeparator) {
            _patternSeparator = patternSeparator;
        };
        this.getInfinity = function() {
            return _infinity;
        };
        this.setInfinity = function(infinity) {
            _infinity = infinity;
        };
        this.getNaN = function() {
            return _NaN;
        };
        this.setNaN = function(NaN) {
            _NaN = NaN;
        };
        this.getMinusSign = function() {
            return _minusSign;
        };
        this.setMinusSign = function(minusSign) {
            _minusSign = minusSign;
        };
        this.getCurrencySymbol = function() {
            return _currencySymbol;
        };
        this.setCurrencySymbol = function(currency) {
            _currencySymbol = currency;
        };
        this.getInternationalCurrencySymbol = function() {
            return _intlCurrencySymbol;
        };
        this.setInternationalCurrencySymbol = function(currencyCode) {
            _intlCurrencySymbol = currencyCode;
            _currency = null;
            if (currencyCode) {
                _currency = Currency.getInstance(currencyCode);
            }
        };
        this.getCurrency = function() {
            return _currency;
        };
        this.setCurrency = function(currency) {
            if (currency) {
                _currency = currency;
                _intlCurrencySymbol = currency.getCurrencyCode();
                _currencySymbol = currency.getSymbol(_locale);
            }
        };
        this.getMonetaryDecimalSeparator = function() {
            return _monetarySeparator;
        };
        this.setMonetaryDecimalSeparator = function(separator) {
            _monetarySeparator = separator;
        };
        this.getExponentialSymbol = function() {
            return _exponential;
        };
        this.setExponentialSymbol = function(exponential) {
            _exponential = exponential;
        };
        this.getExponentSeparator = function() {
            return _exponentialSeparator;
        };
        this.setExponentSeparator = function(separator) {
            _exponentialSeparator = separator;
        };
        _initialize(locale || Locale.getDefault());
    }
    DecimalFormatSymbols.prototype.equals = function(other) {
        if (!other) return false;
        if (this == other) return true;
        if (!(other instanceof DecimalFormatSymbols)) return false;
        return this.getZeroDigit() == other.getZeroDigit() && this.getGroupingSeparator() == other.getGroupingSeparator() && this.getDecimalSeparator() == other.getDecimalSeparator() && this.getPercent() == other.getPercent() && this.getPerMill() == other.getPerMill() && this.getDigit() == other.getDigit() && this.getMinusSign() == other.getMinusSign() && this.getPatternSeparator() == other.getPatternSeparator() && this.getInfinity() == other.getInfinity() && this.getNaN() == other.getNaN() && this.getCurrencySymbol() == other.getCurrencySymbol() && this.getInternationalCurrencySymbol() == other.getInternationalCurrencySymbol() && this.getCurrency().getCurrencyCode() == other.getCurrency().getCurrencyCode() && this.getMonetaryDecimalSeparator() == other.getMonetaryDecimalSeparator() && this.getExponentSeparator() == other.getExponentSeparator();
    };
    global.DecimalFormatSymbols = DecimalFormatSymbols;
    return DecimalFormatSymbols;
});

(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        global.DigitList = module.require("./digit-list");
        exports["DecimalFormat"] = module.exports = factory(global);
    } else {
        factory(global);
    }
})(this, function(global) {
    var DigitList = global.DigitList;
    function DecimalFormat(pattern, symbols) {
        NumberFormat.call(this);
        var _super = this;
        var _this = this;
        var _PATTERN_ZERO_DIGIT = "0";
        var _PATTERN_GROUPING_SEPARATOR = ",";
        var _PATTERN_DECIMAL_SEPARATOR = ".";
        var _PATTERN_PER_MILLE = "\u2030";
        var _PATTERN_PERCENT = "%";
        var _PATTERN_DIGIT = "#";
        var _PATTERN_SEPARATOR = ";";
        var _PATTERN_EXPONENT = "E";
        var _PATTERN_MINUS = "-";
        var _CURRENCY_SIGN = "\xa4";
        var _QUOTE = "'";
        var _MAXIMUM_INTEGER_DIGITS = 2147483647;
        var _MAXIMUM_FRACTION_DIGITS = 2147483647;
        var _digitList = new DigitList();
        var _positivePrefix = "";
        var _positiveSuffix = "";
        var _negativePrefix = "-";
        var _negativeSuffix = "";
        var _posPrefixPattern;
        var _posSuffixPattern;
        var _negPrefixPattern;
        var _negSuffixPattern;
        var _symbols;
        var _multiplier = 1;
        var _groupingSize = 3;
        var _decimalSeparatorAlwaysShown = false;
        var _isCurrencyFormat = false;
        var _useExponentialNotation = false;
        var _positivePrefixFieldPositions = null;
        var _positiveSuffixFieldPositions = null;
        var _negativePrefixFieldPositions = null;
        var _negativeSuffixFieldPositions = null;
        var _minExponentDigits;
        var _expandAffixes = function() {
            // Reuse one StringBuffer for better performance
            if (_posPrefixPattern) {
                _positivePrefix = _expandAffix(_posPrefixPattern);
            }
            if (_posSuffixPattern) {
                _positiveSuffix = _expandAffix(_posSuffixPattern);
            }
            if (_negPrefixPattern) {
                _negativePrefix = _expandAffix(_negPrefixPattern);
            }
            if (_negSuffixPattern) {
                _negativeSuffix = _expandAffix(_negSuffixPattern);
            }
        };
        var _expandAffix = function(pattern) {
            var buffer = "";
            for (var i = 0; i < pattern.length; ) {
                var c = pattern.charAt(i++);
                if (c === _QUOTE) {
                    c = pattern.charAt(i++);
                    switch (c) {
                      case _CURRENCY_SIGN:
                        if (i < pattern.length && pattern.charAt(i) === _CURRENCY_SIGN) {
                            ++i;
                            buffer += _symbols.getInternationalCurrencySymbol();
                        } else {
                            buffer += _symbols.getCurrencySymbol();
                        }
                        continue;

                      case _PATTERN_PERCENT:
                        c = _symbols.getPercent();
                        break;

                      case _PATTERN_PER_MILLE:
                        c = _symbols.getPerMill();
                        break;

                      case _PATTERN_MINUS:
                        c = _symbols.getMinusSign();
                        break;
                    }
                }
                buffer += c;
            }
            return buffer;
        };
        var _expandAffixFieldPositions = function(pattern) {
            var positions = null;
            var stringIndex = 0;
            for (var i = 0; i < pattern.length; ) {
                var c = pattern.charAt(i++);
                var fp;
                if (c == _QUOTE) {
                    var field = -1;
                    var fieldID = null;
                    c = pattern.charAt(i++);
                    switch (c) {
                      case _CURRENCY_SIGN:
                        var string;
                        if (i < pattern.length && pattern.charAt(i) == _CURRENCY_SIGN) {
                            ++i;
                            string = _symbols.getInternationalCurrencySymbol();
                        } else {
                            string = _symbols.getCurrencySymbol();
                        }
                        if (string.length > 0) {
                            if (positions == null) {
                                positions = [];
                            }
                            fp = new FieldPosition(NumberFormat.Field.CURRENCY);
                            fp.beginIndex = stringIndex;
                            fp.endIndex = stringIndex + string.length;
                            positions.push(fp);
                            stringIndex += string.length;
                        }
                        continue;

                      case _PATTERN_PERCENT:
                        c = _symbols.getPercent();
                        field = -1;
                        fieldID = NumberFormat.Field.PERCENT;
                        break;

                      case _PATTERN_PER_MILLE:
                        c = _symbols.getPerMill();
                        field = -1;
                        fieldID = NumberFormat.Field.PERMILLE;
                        break;

                      case _PATTERN_MINUS:
                        c = _symbols.getMinusSign();
                        field = -1;
                        fieldID = NumberFormat.Field.SIGN;
                        break;
                    }
                    if (fieldID != null) {
                        if (positions == null) {
                            positions = [];
                        }
                        fp = new FieldPosition(fieldID, field);
                        fp.beginIndex = stringIndex;
                        fp.endIndex = stringIndex + 1;
                        positions.push(fp);
                    }
                }
                stringIndex++;
            }
            if (positions != null) {
                return positions;
            }
            return [];
        };
        var _appendAffixPattern = function(buffer, affixPattern, expAffix, localized) {
            if (affixPattern == null) {
                buffer = _appendAffix(buffer, expAffix, localized);
            } else {
                var i;
                for (var pos = 0; pos < affixPattern.length; pos = i) {
                    i = affixPattern.indexOf(_QUOTE, pos);
                    if (i < 0) {
                        buffer = _appendAffix(buffer, affixPattern.substring(pos), localized);
                        break;
                    }
                    if (i > pos) {
                        buffer = _appendAffix(buffer, affixPattern.substring(pos, i), localized);
                    }
                    var c = affixPattern.charAt(++i);
                    ++i;
                    if (c == _QUOTE) {
                        buffer += c;
                    } else if (c == _CURRENCY_SIGN && i < affixPattern.length && affixPattern.charAt(i) == _CURRENCY_SIGN) {
                        ++i;
                        buffer += c;
                    } else if (localized) {
                        switch (c) {
                          case _PATTERN_PERCENT:
                            c = _symbols.getPercent();
                            break;

                          case _PATTERN_PER_MILLE:
                            c = _symbols.getPerMill();
                            break;

                          case _PATTERN_MINUS:
                            c = _symbols.getMinusSign();
                            break;
                        }
                    }
                    buffer += c;
                }
            }
            return buffer;
        };
        var _appendAffix = function(buffer, affix, localized) {
            var needQuote;
            if (localized) {
                needQuote = affix.indexOf(_symbols.getZeroDigit()) >= 0 || affix.indexOf(_symbols.getGroupingSeparator()) >= 0 || affix.indexOf(_symbols.getDecimalSeparator()) >= 0 || affix.indexOf(_symbols.getPercent()) >= 0 || affix.indexOf(_symbols.getPerMill()) >= 0 || affix.indexOf(_symbols.getDigit()) >= 0 || affix.indexOf(_symbols.getPatternSeparator()) >= 0 || affix.indexOf(_symbols.getMinusSign()) >= 0 || affix.indexOf(_CURRENCY_SIGN) >= 0;
            } else {
                needQuote = affix.indexOf(_PATTERN_ZERO_DIGIT) >= 0 || affix.indexOf(_PATTERN_GROUPING_SEPARATOR) >= 0 || affix.indexOf(_PATTERN_DECIMAL_SEPARATOR) >= 0 || affix.indexOf(_PATTERN_PERCENT) >= 0 || affix.indexOf(_PATTERN_PER_MILLE) >= 0 || affix.indexOf(_PATTERN_DIGIT) >= 0 || affix.indexOf(_PATTERN_SEPARATOR) >= 0 || affix.indexOf(_PATTERN_MINUS) >= 0 || affix.indexOf(_CURRENCY_SIGN) >= 0;
            }
            if (needQuote) {
                buffer += "'";
            }
            if (affix.indexOf("'") < 0) {
                buffer += affix;
            } else {
                for (var j = 0; j < affix.length; ++j) {
                    var c = affix.charAt(j);
                    buffer += c;
                    if (c == "'") {
                        buffer += c;
                    }
                }
            }
            if (needQuote) {
                buffer += "'";
            }
            return buffer;
        };
        var _toPattern = function(localized) {
            var result = "";
            for (var j = 1; j >= 0; --j) {
                if (j == 1) {
                    result = _appendAffixPattern(result, _posPrefixPattern, _positivePrefix, localized);
                } else {
                    result = _appendAffixPattern(result, _negPrefixPattern, _negativePrefix, localized);
                }
                var i;
                var digitCount = _useExponentialNotation ? _this.getMaximumIntegerDigits() : Math.max(_groupingSize, _this.getMinimumIntegerDigits()) + 1;
                for (i = digitCount; i > 0; --i) {
                    if (i != digitCount && _this.isGroupingUsed() && _groupingSize != 0 && i % _groupingSize == 0) {
                        result += localized ? _symbols.getGroupingSeparator() : _PATTERN_GROUPING_SEPARATOR;
                    }
                    result += i <= _this.getMinimumIntegerDigits() ? localized ? _symbols.getZeroDigit() : _PATTERN_ZERO_DIGIT : localized ? _symbols.getDigit() : _PATTERN_DIGIT;
                }
                if (_this.getMaximumFractionDigits() > 0 || _decimalSeparatorAlwaysShown) result += localized ? _symbols.getDecimalSeparator() : _PATTERN_DECIMAL_SEPARATOR;
                for (i = 0; i < _this.getMaximumFractionDigits(); ++i) {
                    if (i < _this.getMinimumFractionDigits()) {
                        result += localized ? _symbols.getZeroDigit() : _PATTERN_ZERO_DIGIT;
                    } else {
                        result += localized ? _symbols.getDigit() : _PATTERN_DIGIT;
                    }
                }
                if (_useExponentialNotation) {
                    result += localized ? _symbols.getExponentSeparator() : _PATTERN_EXPONENT;
                    for (i = 0; i < _minExponentDigits; ++i) result += localized ? _symbols.getZeroDigit() : _PATTERN_ZERO_DIGIT;
                }
                if (j == 1) {
                    result = _appendAffixPattern(result, _posSuffixPattern, _positiveSuffix, localized);
                    if (_negSuffixPattern == _posSuffixPattern && // n == p == null
                    _negativeSuffix === _positiveSuffix || _negSuffixPattern != null && _negSuffixPattern === _posSuffixPattern) {
                        if (_negPrefixPattern != null && _posPrefixPattern != null && _negPrefixPattern === "'-" + _posPrefixPattern || _negPrefixPattern == _posPrefixPattern && // n == p == null
                        _negativePrefix === _symbols.getMinusSign() + _positivePrefix) break;
                    }
                    result += localized ? _symbols.getPatternSeparator() : _PATTERN_SEPARATOR;
                } else {
                    result = _appendAffixPattern(result, _negSuffixPattern, _negativeSuffix, localized);
                }
            }
            return result.toString();
        };
        var _append = function(result, string, delegate, positions, signAttribute) {
            var start = result.length;
            if (string.length > 0) {
                result += string;
                for (var counter = 0, max = positions.length; counter < max; counter++) {
                    var fp = positions[counter];
                    var attribute = fp.attribute;
                    if (attribute == NumberFormat.Field.SIGN) {
                        attribute = signAttribute;
                    }
                    delegate.formatted(attribute, attribute, start + fp.beginIndex, start + fp.endIndex, result);
                }
            }
            return result;
        };
        var _applyPattern = function(pattern, localized) {
            var zeroDigit = _PATTERN_ZERO_DIGIT;
            var groupingSeparator = _PATTERN_GROUPING_SEPARATOR;
            var decimalSeparator = _PATTERN_DECIMAL_SEPARATOR;
            var percent = _PATTERN_PERCENT;
            var perMill = _PATTERN_PER_MILLE;
            var digit = _PATTERN_DIGIT;
            var separator = _PATTERN_SEPARATOR;
            var exponent = _PATTERN_EXPONENT;
            var minus = _PATTERN_MINUS;
            if (localized) {
                zeroDigit = _symbols.getZeroDigit();
                groupingSeparator = _symbols.getGroupingSeparator();
                decimalSeparator = _symbols.getDecimalSeparator();
                percent = _symbols.getPercent();
                perMill = _symbols.getPerMill();
                digit = _symbols.getDigit();
                separator = _symbols.getPatternSeparator();
                exponent = _symbols.getExponentSeparator();
                minus = _symbols.getMinusSign();
            }
            var gotNegative = false;
            _decimalSeparatorAlwaysShown = false;
            _isCurrencyFormat = false;
            _useExponentialNotation = false;
            // Two variables are used to record the subrange of the pattern
            // occupied by phase 1.  This is used during the processing of the
            // second pattern (the one representing negative numbers) to ensure
            // that no deviation exists in phase 1 between the two patterns.
            var phaseOneStart = 0;
            var phaseOneLength = 0;
            var start = 0;
            for (var j = 1; j >= 0 && start < pattern.length; --j) {
                var inQuote = false;
                var prefix = "";
                var suffix = "";
                var decimalPos = -1;
                var multiplier = 1;
                var digitLeftCount = 0, zeroDigitCount = 0, digitRightCount = 0;
                var groupingCount = -1;
                // The phase ranges from 0 to 2.  Phase 0 is the prefix.  Phase 1 is
                // the section of the pattern with digits, decimal separator,
                // grouping characters.  Phase 2 is the suffix.  In phases 0 and 2,
                // percent, per mille, and currency symbols are recognized and
                // translated.  The separation of the characters into phases is
                // strictly enforced; if phase 1 characters are to appear in the
                // suffix, for example, they must be quoted.
                var phase = 0;
                // The affix is either the prefix or the suffix.
                var affixes = [];
                var affix = prefix;
                for (var pos = start; pos < pattern.length; ++pos) {
                    var ch = pattern.charAt(pos);
                    switch (phase) {
                      case 0:
                      case 2:
                        // Process the prefix / suffix characters
                        if (inQuote) {
                            // A quote within quotes indicates either the closing
                            // quote or two quotes, which is a quote literal. That
                            // is, we have the second quote in 'do' or 'don''t'.
                            if (ch == _QUOTE) {
                                if (pos + 1 < pattern.length && pattern.charAt(pos + 1) == _QUOTE) {
                                    ++pos;
                                    affix += "''";
                                } else {
                                    inQuote = false;
                                }
                                continue;
                            }
                        } else {
                            // Process unquoted characters seen in prefix or suffix
                            // phase.
                            if (ch == digit || ch == zeroDigit || ch == groupingSeparator || ch == decimalSeparator) {
                                phase = 1;
                                if (j == 1) {
                                    phaseOneStart = pos;
                                }
                                --pos;
                                // Reprocess this character
                                continue;
                            } else if (ch == _CURRENCY_SIGN) {
                                // Use lookahead to determine if the currency sign
                                // is doubled or not.
                                var doubled = pos + 1 < pattern.length && pattern.charAt(pos + 1) == _CURRENCY_SIGN;
                                if (doubled) {
                                    // Skip over the doubled character
                                    ++pos;
                                }
                                _isCurrencyFormat = true;
                                affix += doubled ? "'\xa4\xa4" : "'\xa4";
                                continue;
                            } else if (ch == _QUOTE) {
                                // A quote outside quotes indicates either the
                                // opening quote or two quotes, which is a quote
                                // literal. That is, we have the first quote in 'do'
                                // or o''clock.
                                if (ch == _QUOTE) {
                                    if (pos + 1 < pattern.length && pattern.charAt(pos + 1) == _QUOTE) {
                                        ++pos;
                                        affix += "''";
                                    } else {
                                        inQuote = true;
                                    }
                                    continue;
                                }
                            } else if (ch == separator) {
                                // Don't allow separators before we see digit
                                // characters of phase 1, and don't allow separators
                                // in the second pattern (j == 0).
                                if (phase == 0 || j == 0) {
                                    throw "Unquoted special character '" + ch + "' in pattern \"" + pattern + '"';
                                }
                                start = pos + 1;
                                pos = pattern.length;
                                continue;
                            } else if (ch == percent) {
                                if (multiplier != 1) {
                                    throw 'Too many percent/per mille characters in pattern "' + pattern + '"';
                                }
                                multiplier = 100;
                                affix += "'%";
                                continue;
                            } else if (ch == perMill) {
                                if (multiplier != 1) {
                                    throw 'Too many percent/per mille characters in pattern "' + pattern + '"';
                                }
                                multiplier = 1e3;
                                affix += "'\u2030";
                                continue;
                            } else if (ch == minus) {
                                affix += "'-";
                                continue;
                            }
                        }
                        // Note that if we are within quotes, or if this is an
                        // unquoted, non-special character, then we usually fall
                        // through to here.
                        affix += ch;
                        break;

                      case 1:
                        // Phase one must be identical in the two sub-patterns. We
                        // enforce this by doing a direct comparison. While
                        // processing the first sub-pattern, we just record its
                        // length. While processing the second, we compare
                        // characters.
                        if (j == 1) {
                            ++phaseOneLength;
                        } else {
                            if (--phaseOneLength == 0) {
                                phase = 2;
                                affixes.push(affix);
                                affix = suffix;
                            }
                            continue;
                        }
                        // Process the digits, decimal, and grouping characters. We
                        // record five pieces of information. We expect the digits
                        // to occur in the pattern ####0000.####, and we record the
                        // number of left digits, zero (central) digits, and right
                        // digits. The position of the last grouping character is
                        // recorded (should be somewhere within the first two blocks
                        // of characters), as is the position of the decimal point,
                        // if any (should be in the zero digits). If there is no
                        // decimal point, then there should be no right digits.
                        if (ch == digit) {
                            if (zeroDigitCount > 0) {
                                ++digitRightCount;
                            } else {
                                ++digitLeftCount;
                            }
                            if (groupingCount >= 0 && decimalPos < 0) {
                                ++groupingCount;
                            }
                        } else if (ch == zeroDigit) {
                            if (digitRightCount > 0) {
                                throw "Unexpected '0' in pattern \"" + pattern + '"';
                            }
                            ++zeroDigitCount;
                            if (groupingCount >= 0 && decimalPos < 0) {
                                ++groupingCount;
                            }
                        } else if (ch == groupingSeparator) {
                            groupingCount = 0;
                        } else if (ch == decimalSeparator) {
                            if (decimalPos >= 0) {
                                throw 'Multiple decimal separators in pattern "' + pattern + '"';
                            }
                            decimalPos = digitLeftCount + zeroDigitCount + digitRightCount;
                        } else if (pattern.substr(pos, exponent.length).search(exponent) > -1) {
                            if (_useExponentialNotation) {
                                throw "Multiple exponential " + 'symbols in pattern "' + pattern + '"';
                            }
                            _useExponentialNotation = true;
                            _minExponentDigits = 0;
                            // Use lookahead to parse out the exponential part
                            // of the pattern, then jump into phase 2.
                            pos = pos + exponent.length;
                            while (pos < pattern.length && pattern.charAt(pos) == zeroDigit) {
                                ++_minExponentDigits;
                                ++phaseOneLength;
                                ++pos;
                            }
                            if (digitLeftCount + zeroDigitCount < 1 || _minExponentDigits < 1) {
                                throw "Malformed exponential " + 'pattern "' + pattern + '"';
                            }
                            // Transition to phase 2
                            phase = 2;
                            affixes.push(affix);
                            affix = suffix;
                            --pos;
                            continue;
                        } else {
                            phase = 2;
                            affixes.push(affix);
                            affix = suffix;
                            --pos;
                            --phaseOneLength;
                            continue;
                        }
                        break;
                    }
                }
                affixes.push(affix);
                if (affixes.length > 0) {
                    prefix = affixes[0];
                }
                if (affixes.length > 1) {
                    suffix = affixes[1];
                }
                // Handle patterns with no '0' pattern character. These patterns
                // are legal, but must be interpreted.  "##.###" -> "#0.###".
                // ".###" -> ".0##".
                /* We allow patterns of the form "####" to produce a zeroDigitCount
                 * of zero (got that?); although this seems like it might make it
                 * possible for format() to produce empty strings, format() checks
                 * for this condition and outputs a zero digit in this situation.
                 * Having a zeroDigitCount of zero yields a minimum integer digits
                 * of zero, which allows proper round-trip patterns.  That is, we
                 * don't want "#" to become "#0" when toPattern() is called (even
                 * though that's what it really is, semantically).
                 */
                if (zeroDigitCount == 0 && digitLeftCount > 0 && decimalPos >= 0) {
                    // Handle "###.###" and "###." and ".###"
                    var n = decimalPos;
                    if (n == 0) {
                        // Handle ".###"
                        ++n;
                    }
                    digitRightCount = digitLeftCount - n;
                    digitLeftCount = n - 1;
                    zeroDigitCount = 1;
                }
                // Do syntax checking on the digits.
                if (decimalPos < 0 && digitRightCount > 0 || decimalPos >= 0 && (decimalPos < digitLeftCount || decimalPos > digitLeftCount + zeroDigitCount) || groupingCount == 0 || inQuote) {
                    throw 'Malformed pattern "' + pattern + '"';
                }
                if (j == 1) {
                    _posPrefixPattern = prefix.toString();
                    _posSuffixPattern = suffix.toString();
                    _negPrefixPattern = _posPrefixPattern;
                    // assume these for now
                    _negSuffixPattern = _posSuffixPattern;
                    var digitTotalCount = digitLeftCount + zeroDigitCount + digitRightCount;
                    /* The effectiveDecimalPos is the position the decimal is at or
                     * would be at if there is no decimal. Note that if decimalPos<0,
                     * then digitTotalCount == digitLeftCount + zeroDigitCount.
                     */
                    var effectiveDecimalPos = decimalPos >= 0 ? decimalPos : digitTotalCount;
                    _this.setMinimumIntegerDigits(effectiveDecimalPos - digitLeftCount);
                    _this.setMaximumIntegerDigits(_useExponentialNotation ? digitLeftCount + _this.getMinimumIntegerDigits() : _MAXIMUM_INTEGER_DIGITS);
                    _this.setMaximumFractionDigits(decimalPos >= 0 ? digitTotalCount - decimalPos : 0);
                    _this.setMinimumFractionDigits(decimalPos >= 0 ? digitLeftCount + zeroDigitCount - decimalPos : 0);
                    _this.setGroupingUsed(groupingCount > 0);
                    _groupingSize = groupingCount > 0 ? groupingCount : 0;
                    _multiplier = multiplier;
                    _this.setDecimalSeparatorAlwaysShown(decimalPos == 0 || decimalPos == digitTotalCount);
                } else {
                    _negPrefixPattern = prefix.toString();
                    _negSuffixPattern = suffix.toString();
                    gotNegative = true;
                }
            }
            if (pattern.length == 0) {
                _posPrefixPattern = _posSuffixPattern = "";
                _this.setMinimumIntegerDigits(0);
                _this.setMaximumIntegerDigits(_MAXIMUM_INTEGER_DIGITS);
                _this.setMinimumFractionDigits(0);
                _this.setMaximumFractionDigits(_MAXIMUM_FRACTION_DIGITS);
            }
            // If there was no negative pattern, or if the negative pattern is
            // identical to the positive pattern, then prepend the minus sign to
            // the positive pattern to form the negative pattern.
            if (!gotNegative || _negPrefixPattern === _posPrefixPattern && _negSuffixPattern === _posSuffixPattern) {
                _negSuffixPattern = _posSuffixPattern;
                _negPrefixPattern = "'-" + _posPrefixPattern;
            }
            _expandAffixes();
        };
        var _init = function(pattern, symbols) {
            var locale = Locale.getDefault();
            if (!pattern) {
                var rb = ResourceBundle.getBundle("FormatData", locale);
                var all = rb["NumberPatterns"];
                pattern = all[0];
            }
            if (symbols && symbols instanceof DecimalFormatSymbols) {
                _symbols = symbols;
            } else {
                _symbols = new DecimalFormatSymbols(locale);
            }
            _applyPattern(pattern, false);
        };
        var _subformat = function(result, delegate, isNegative, isInteger, maxIntDigits, minIntDigits, maxFraDigits, minFraDigits) {
            // NOTE: This isn't required anymore because DigitList takes care of this.
            //
            //  // The negative of the exponent represents the number of leading
            //  // zeros between the decimal and the first non-zero digit, for
            //  // a value < 0.1 (e.g., for 0.00123, -fExponent == 2).  If this
            //  // is more than the maximum fraction digits, then we have an underflow
            //  // for the printed representation.  We recognize this here and set
            //  // the DigitList representation to zero in this situation.
            //
            //  if (-digitList.decimalAt >= getMaximumFractionDigits())
            //  {
            //      digitList.count = 0;
            //  }
            var zero = _symbols.getZeroDigit();
            var zeroDelta = parseInt(zero, 10);
            // '0' is the DigitList representation of zero
            var grouping = _symbols.getGroupingSeparator();
            var decimal = _isCurrencyFormat ? _symbols.getMonetaryDecimalSeparator() : _symbols.getDecimalSeparator();
            /* Per bug 4147706, DecimalFormat must respect the sign of numbers which
             * format as zero.  This allows sensible computations and preserves
             * relations such as signum(1/x) = signum(x), where x is +Infinity or
             * -Infinity.  Prior to this fix, we always formatted zero values as if
             * they were positive.  Liu 7/6/98.
             */
            if (_digitList.isZero()) {
                _digitList.decimalAt = 0;
            }
            if (isNegative) {
                result = _append(result, _negativePrefix, delegate, _getNegativePrefixFieldPositions(), NumberFormat.Field.SIGN);
            } else {
                result = _append(result, _positivePrefix, delegate, _getPositivePrefixFieldPositions(), NumberFormat.Field.SIGN);
            }
            var iFieldStart;
            var iFieldEnd;
            var fFieldStart;
            var i;
            if (_useExponentialNotation) {
                iFieldStart = result.length;
                iFieldEnd = -1;
                fFieldStart = -1;
                // Minimum integer digits are handled in exponential format by
                // adjusting the exponent.  For example, 0.01234 with 3 minimum
                // integer digits is "123.4E-4".
                // Maximum integer digits are interpreted as indicating the
                // repeating range.  This is useful for engineering notation, in
                // which the exponent is restricted to a multiple of 3.  For
                // example, 0.01234 with 3 maximum integer digits is "12.34e-3".
                // If maximum integer digits are > 1 and are larger than
                // minimum integer digits, then minimum integer digits are
                // ignored.
                var exponent = _digitList.decimalAt;
                var repeat = maxIntDigits;
                var minimumIntegerDigits = minIntDigits;
                if (repeat > 1 && repeat > minIntDigits) {
                    // A repeating range is defined; adjust to it as follows.
                    // If repeat == 3, we have 6,5,4=>3; 3,2,1=>0; 0,-1,-2=>-3;
                    // -3,-4,-5=>-6, etc. This takes into account that the
                    // exponent we have here is off by one from what we expect;
                    // it is for the format 0.MMMMMx10^n.
                    if (exponent >= 1) {
                        exponent = (exponent - 1) / repeat * repeat;
                    } else {
                        // integer division rounds towards 0
                        exponent = (exponent - repeat) / repeat * repeat;
                    }
                    minimumIntegerDigits = 1;
                } else {
                    // No repeating range is defined; use minimum integer digits.
                    exponent -= minimumIntegerDigits;
                }
                // We now output a minimum number of digits, and more if there
                // are more digits, up to the maximum number of digits.  We
                // place the decimal point after the "integer" digits, which
                // are the first (decimalAt - exponent) digits.
                var minimumDigits = minIntDigits + minFraDigits;
                if (minimumDigits < 0) {
                    // overflow?
                    minimumDigits = 2147483647;
                }
                // The number of integer digits is handled specially if the number
                // is zero, since then there may be no digits.
                var integerDigits = _digitList.isZero() ? minimumIntegerDigits : _digitList.decimalAt - exponent;
                if (minimumDigits < integerDigits) {
                    minimumDigits = integerDigits;
                }
                var totalDigits = _digitList.count;
                if (minimumDigits > totalDigits) {
                    totalDigits = minimumDigits;
                }
                var addedDecimalSeparator = false;
                for (i = 0; i < totalDigits; ++i) {
                    if (i == integerDigits) {
                        // Record field information for caller.
                        iFieldEnd = result.length;
                        result += decimal;
                        addedDecimalSeparator = true;
                        // Record field information for caller.
                        fFieldStart = result.length;
                    }
                    result += i < _digitList.count ? (parseInt(_digitList.digits[i], 10) + zeroDelta).toString() : zero;
                }
                if (_decimalSeparatorAlwaysShown && totalDigits == integerDigits) {
                    // Record field information for caller.
                    iFieldEnd = result.length;
                    result += decimal;
                    addedDecimalSeparator = true;
                    // Record field information for caller.
                    fFieldStart = result.length;
                }
                // Record field information
                if (iFieldEnd == -1) {
                    iFieldEnd = result.length;
                }
                delegate.formatted(NumberFormat.INTEGER_FIELD, NumberFormat.Field.INTEGER, NumberFormat.Field.INTEGER, iFieldStart, iFieldEnd, result);
                if (addedDecimalSeparator) {
                    delegate.formatted(NumberFormat.Field.DECIMAL_SEPARATOR, NumberFormat.Field.DECIMAL_SEPARATOR, iFieldEnd, fFieldStart, result);
                }
                if (fFieldStart == -1) {
                    fFieldStart = result.length;
                }
                delegate.formatted(NumberFormat.FRACTION_FIELD, NumberFormat.Field.FRACTION, NumberFormat.Field.FRACTION, fFieldStart, result.length, result);
                // The exponent is output using the pattern-specified minimum
                // exponent digits.  There is no maximum limit to the exponent
                // digits, since truncating the exponent would result in an
                // unacceptable inaccuracy.
                var fieldStart = result.length;
                result += _symbols.getExponentSeparator();
                delegate.formatted(NumberFormat.Field.EXPONENT_SYMBOL, NumberFormat.Field.EXPONENT_SYMBOL, fieldStart, result.length, result);
                // For zero values, we force the exponent to zero.  We
                // must do this here, and not earlier, because the value
                // is used to determine integer digit count above.
                if (_digitList.isZero()) {
                    exponent = 0;
                }
                var negativeExponent = exponent < 0;
                if (negativeExponent) {
                    exponent = -exponent;
                    fieldStart = result.length;
                    result += _symbols.getMinusSign();
                    delegate.formatted(NumberFormat.Field.EXPONENT_SIGN, NumberFormat.Field.EXPONENT_SIGN, fieldStart, result.length, result);
                }
                _digitList.set(negativeExponent, exponent.toString(), 0, true);
                var eFieldStart = result.length;
                for (i = _digitList.decimalAt; i < _minExponentDigits; ++i) {
                    result += zero;
                }
                for (i = 0; i < _digitList.decimalAt; ++i) {
                    result += i < _digitList.count ? (parseInt(_digitList.digits[i], 10) + zeroDelta).toString() : zero;
                }
                delegate.formatted(NumberFormat.Field.EXPONENT, NumberFormat.Field.EXPONENT, eFieldStart, result.length, result);
            } else {
                iFieldStart = result.length;
                // Output the integer portion.  Here 'count' is the total
                // number of integer digits we will display, including both
                // leading zeros required to satisfy getMinimumIntegerDigits,
                // and actual digits present in the number.
                var count = minIntDigits;
                var digitIndex = 0;
                // Index into digitList.fDigits[]
                if (_digitList.decimalAt > 0 && count < _digitList.decimalAt) {
                    count = _digitList.decimalAt;
                }
                // Handle the case where getMaximumIntegerDigits() is smaller
                // than the real number of integer digits.  If this is so, we
                // output the least significant max integer digits.  For example,
                // the value 1997 printed with 2 max integer digits is just "97".
                if (count > maxIntDigits) {
                    count = maxIntDigits;
                    digitIndex = _digitList.decimalAt - count;
                }
                var sizeBeforeIntegerPart = result.length;
                for (i = count - 1; i >= 0; --i) {
                    if (i < _digitList.decimalAt && digitIndex < _digitList.count) {
                        // Output a real digit
                        result += (parseInt(_digitList.digits[digitIndex++], 10) + zeroDelta).toString();
                    } else {
                        // Output a leading zero
                        result += zero;
                    }
                    // Output grouping separator if necessary.  Don't output a
                    // grouping separator if i==0 though; that's at the end of
                    // the integer part.
                    if (_this.isGroupingUsed() && i > 0 && _groupingSize != 0 && i % _groupingSize == 0) {
                        var gStart = result.length;
                        result += grouping;
                        delegate.formatted(NumberFormat.Field.GROUPING_SEPARATOR, NumberFormat.Field.GROUPING_SEPARATOR, gStart, result.length, result);
                    }
                }
                // Determine whether or not there are any printable fractional
                // digits.  If we've used up the digits we know there aren't.
                var fractionPresent = minFraDigits > 0 || !isInteger && digitIndex < _digitList.count;
                // If there is no fraction present, and we haven't printed any
                // integer digits, then print a zero.  Otherwise we won't print
                // _any_ digits, and we won't be able to parse this string.
                if (!fractionPresent && result.length == sizeBeforeIntegerPart) {
                    result += zero;
                }
                delegate.formatted(NumberFormat.INTEGER_FIELD, NumberFormat.Field.INTEGER, NumberFormat.Field.INTEGER, iFieldStart, result.length, result);
                // Output the decimal separator if we always do so.
                var sStart = result.length;
                if (_decimalSeparatorAlwaysShown || fractionPresent) {
                    result += decimal;
                }
                if (sStart != result.length) {
                    delegate.formatted(NumberFormat.Field.DECIMAL_SEPARATOR, NumberFormat.Field.DECIMAL_SEPARATOR, sStart, result.length, result);
                }
                fFieldStart = result.length;
                for (i = 0; i < maxFraDigits; ++i) {
                    // Here is where we escape from the loop.  We escape if we've
                    // output the maximum fraction digits (specified in the for
                    // expression above).
                    // We also stop when we've output the minimum digits and either:
                    // we have an integer, so there is no fractional stuff to
                    // display, or we're out of significant digits.
                    if (i >= minFraDigits && (isInteger || digitIndex >= _digitList.count)) {
                        break;
                    }
                    // Output leading fractional zeros. These are zeros that come
                    // after the decimal but before any significant digits. These
                    // are only output if abs(number being formatted) < 1.0.
                    if (-1 - i > _digitList.decimalAt - 1) {
                        result += zero;
                        continue;
                    }
                    // Output a digit, if we have any precision left, or a
                    // zero if we don't.  We don't want to output noise digits.
                    if (!isInteger && digitIndex < _digitList.count) {
                        result += (parseInt(_digitList.digits[digitIndex++], 10) + zeroDelta).toString();
                    } else {
                        result += zero;
                    }
                }
                // Record field information for caller.
                delegate.formatted(NumberFormat.FRACTION_FIELD, NumberFormat.Field.FRACTION, NumberFormat.Field.FRACTION, fFieldStart, result.length, result);
            }
            if (isNegative) {
                result = _append(result, _negativeSuffix, delegate, _getNegativeSuffixFieldPositions(), NumberFormat.Field.SIGN);
            } else {
                result = _append(result, _positiveSuffix, delegate, _getPositiveSuffixFieldPositions(), NumberFormat.Field.SIGN);
            }
            return result;
        };
        var _subparse = function(text, parsePosition, positivePrefix, negativePrefix, digits, isExponent, status) {
            var position = parsePosition.index;
            var oldStart = parsePosition.index;
            var backup;
            var gotPositive, gotNegative;
            // check for positivePrefix; take longest
            gotPositive = text.substr(position, positivePrefix.length).search(positivePrefix) > -1;
            gotNegative = text.substr(position, negativePrefix.length).search(negativePrefix) > -1;
            if (gotPositive && gotNegative) {
                if (positivePrefix.length > negativePrefix.length) {
                    gotNegative = false;
                } else if (positivePrefix.length < negativePrefix.length) {
                    gotPositive = false;
                }
            }
            if (gotPositive) {
                position += positivePrefix.length;
            } else if (gotNegative) {
                position += negativePrefix.length;
            } else {
                parsePosition.errorIndex = position;
                return false;
            }
            // process digits or Inf, find decimal position
            status[_STATUS_INFINITE] = false;
            if (!isExponent && text.substr(position, _symbols.getInfinity().length).search(_symbols.getInfinity()) > -1) {
                position += _symbols.getInfinity().length;
                status[_STATUS_INFINITE] = true;
            } else {
                // We now have a string of digits, possibly with grouping symbols,
                // and decimal points.  We want to process these into a DigitList.
                // We don't want to put a bunch of leading zeros into the DigitList
                // though, so we keep track of the location of the decimal point,
                // put only significant digits into the DigitList, and adjust the
                // exponent as needed.
                digits.decimalAt = digits.count = 0;
                digits.digits = [];
                var zero = _symbols.getZeroDigit();
                var decimal = _isCurrencyFormat ? _symbols.getMonetaryDecimalSeparator() : _symbols.getDecimalSeparator();
                var grouping = _symbols.getGroupingSeparator();
                var exponentString = _symbols.getExponentSeparator();
                var sawDecimal = false;
                var sawExponent = false;
                var sawDigit = false;
                var exponent = 0;
                // Set to the exponent value, if any
                // We have to track digitCount ourselves, because digits.count will
                // pin when the maximum allowable digits is reached.
                var digitCount = 0;
                backup = -1;
                for (;position < text.length; ++position) {
                    var ch = text.charAt(position);
                    /* We recognize all digit ranges, not only the Latin digit range
                     * '0'..'9'.  We do so by using the Character.digit() method,
                     * which converts a valid Unicode digit to the range 0..9.
                     *
                     * The character 'ch' may be a digit.  If so, place its value
                     * from 0 to 9 in 'digit'.  First try using the locale digit,
                     * which may or MAY NOT be a standard Unicode digit range.  If
                     * this fails, try using the standard Unicode digit ranges by
                     * calling Character.digit().  If this also fails, digit will
                     * have a value outside the range 0..9.
                     */
                    var digit = parseInt(ch, 10) - parseInt(zero, 10);
                    if (digit < 0 || digit > 9) {
                        digit = parseInt(ch, 10);
                    }
                    if (digit == 0) {
                        // Cancel out backup setting (see grouping handler below)
                        backup = -1;
                        // Do this BEFORE continue statement below!!!
                        sawDigit = true;
                        // Handle leading zeros
                        if (digits.count == 0) {
                            // Ignore leading zeros in integer part of number.
                            if (!sawDecimal) {
                                continue;
                            }
                            // If we have seen the decimal, but no significant
                            // digits yet, then we account for leading zeros by
                            // decrementing the digits.decimalAt into negative
                            // values.
                            --digits.decimalAt;
                        } else {
                            ++digitCount;
                            digits.append(digit.toString());
                        }
                    } else if (digit > 0 && digit <= 9) {
                        // [sic] digit==0 handled above
                        sawDigit = true;
                        ++digitCount;
                        digits.append(digit.toString());
                        // Cancel out backup setting (see grouping handler below)
                        backup = -1;
                    } else if (!isExponent && ch == decimal) {
                        // If we're only parsing integers, or if we ALREADY saw the
                        // decimal, then don't parse this one.
                        if (_this.isParseIntegerOnly() || sawDecimal) {
                            break;
                        }
                        digits.decimalAt = digitCount;
                        // Not digits.count!
                        sawDecimal = true;
                    } else if (!isExponent && ch == grouping && _this.isGroupingUsed()) {
                        if (sawDecimal) {
                            break;
                        }
                        // Ignore grouping characters, if we are using them, but
                        // require that they be followed by a digit.  Otherwise
                        // we backup and reprocess them.
                        backup = position;
                    } else if (!isExponent && text.substr(position, exponentString.length).search(exponentString) > -1 && !sawExponent) {
                        // Process the exponent by recursively calling this method.
                        var pos = new ParsePosition(position + exponentString.length);
                        var stat = [ false, false ];
                        var exponentDigits = new DigitList();
                        if (_subparse(text, pos, "", _symbols.getMinusSign(), exponentDigits, true, stat) && exponentDigits.fitsIntoLong(stat[_STATUS_POSITIVE], true)) {
                            position = pos.index;
                            // Advance past the exponent
                            exponent = exponentDigits.getLong();
                            if (!stat[_STATUS_POSITIVE]) {
                                exponent = -exponent;
                            }
                            sawExponent = true;
                        }
                        break;
                    } else {
                        break;
                    }
                }
                if (backup != -1) {
                    position = backup;
                }
                // If there was no decimal point we have an integer
                if (!sawDecimal) {
                    digits.decimalAt = digitCount;
                }
                // Adjust for exponent, if any
                digits.decimalAt += exponent;
                // If none of the text string was recognized.  For example, parse
                // "x" with pattern "#0.00" (return index and error index both 0)
                // parse "$" with pattern "$#0.00". (return index 0 and error
                // index 1).
                if (!sawDigit && digitCount == 0) {
                    parsePosition.index = oldStart;
                    parsePosition.errorIndex = oldStart;
                    return false;
                }
            }
            // check for suffix
            if (!isExponent) {
                if (gotPositive) {
                    gotPositive = text.substr(position, _positiveSuffix.length).search(_positiveSuffix) > -1;
                }
                if (gotNegative) {
                    gotNegative = text.substr(position, _negativeSuffix.length).search(_negativeSuffix) > -1;
                }
                // if both match, take longest
                if (gotPositive && gotNegative) {
                    if (_positiveSuffix.length > _negativeSuffix.length) {
                        gotNegative = false;
                    } else if (_positiveSuffix.length < _negativeSuffix.length) {
                        gotPositive = false;
                    }
                }
                // fail if neither or both
                if (gotPositive == gotNegative) {
                    parsePosition.errorIndex = position;
                    return false;
                }
                parsePosition.index = position + (gotPositive ? _positiveSuffix.length : _negativeSuffix.length);
            } else {
                parsePosition.index = position;
            }
            status[_STATUS_POSITIVE] = gotPositive;
            if (parsePosition.index == oldStart) {
                parsePosition.errorIndex = position;
                return false;
            }
            return true;
        };
        var _getPositivePrefixFieldPositions = function() {
            if (_positivePrefixFieldPositions == null) {
                if (_posPrefixPattern) {
                    _positivePrefixFieldPositions = _expandAffixFieldPositions(_posPrefixPattern);
                } else {
                    _positivePrefixFieldPositions = [];
                }
            }
            return _positivePrefixFieldPositions;
        };
        var _getNegativePrefixFieldPositions = function() {
            if (_negativePrefixFieldPositions == null) {
                if (_negPrefixPattern) {
                    _negativePrefixFieldPositions = _expandAffixFieldPositions(_negPrefixPattern);
                } else {
                    _negativePrefixFieldPositions = [];
                }
            }
            return _negativePrefixFieldPositions;
        };
        var _getPositiveSuffixFieldPositions = function() {
            if (_positiveSuffixFieldPositions == null) {
                if (_posSuffixPattern) {
                    _positiveSuffixFieldPositions = _expandAffixFieldPositions(_posSuffixPattern);
                } else {
                    _positiveSuffixFieldPositions = [];
                }
            }
            return _positiveSuffixFieldPositions;
        };
        var _getNegativeSuffixFieldPositions = function() {
            if (_negativeSuffixFieldPositions == null) {
                if (_negSuffixPattern) {
                    _negativeSuffixFieldPositions = _expandAffixFieldPositions(_negSuffixPattern);
                } else {
                    _negativeSuffixFieldPositions = [];
                }
            }
            return _negativeSuffixFieldPositions;
        };
        this.getDecimalFormatSymbols = function() {
            return _symbols;
        };
        this.setDecimalFormatSymbols = function(decimalFormatSymbols) {
            _symbols = decimalFormatSymbols;
            _expandAffixes();
        };
        this.getPositivePrefix = function() {
            return _positivePrefix;
        };
        this.setPositivePrefix = function(value) {
            _positivePrefix = value;
            _posPrefixPattern = null;
            _positivePrefixFieldPositions = null;
        };
        this.getNegativePrefix = function() {
            return _negativePrefix;
        };
        this.setNegativePrefix = function(value) {
            _negativePrefix = value;
            _negPrefixPattern = null;
        };
        this.getPositiveSuffix = function() {
            return _positiveSuffix;
        };
        this.setPositiveSuffix = function(value) {
            _positiveSuffix = value;
            _posSuffixPattern = null;
        };
        this.getNegativeSuffix = function() {
            return _negativeSuffix;
        };
        this.setNegativeSuffix = function(value) {
            _negativeSuffix = value;
            _negSuffixPattern = null;
        };
        this.getMultiplier = function() {
            return _multiplier;
        };
        this.setMultiplier = function(multiplier) {
            _multiplier = multiplier;
        };
        this.getGroupingSize = function() {
            return _groupingSize;
        };
        this.setGroupingSize = function(groupingSize) {
            _groupingSize = groupingSize;
        };
        this.isDecimalSeparatorAlwaysShown = function() {
            return _decimalSeparatorAlwaysShown;
        };
        this.setDecimalSeparatorAlwaysShown = function(decimalSeparatorAlwaysShown) {
            _decimalSeparatorAlwaysShown = decimalSeparatorAlwaysShown;
        };
        this.getCurrency = function() {
            return _symbols.getCurrency();
        };
        this.setCurrency = function(currency) {
            if (currency) {
                _symbols.setCurrency(currency);
                if (_isCurrencyFormat) {
                    _expandAffixes();
                }
            }
        };
        this.format = function(number, toAppendTo, pos) {
            var result = typeof toAppendTo == "string" ? toAppendTo : "";
            var fieldPosition = pos && pos instanceof FieldPosition ? pos : new FieldPosition(0);
            var delegate = fieldPosition.getFieldDelegate();
            var iFieldStart;
            fieldPosition.beginIndex = 0;
            fieldPosition.endIndex = 0;
            if (isNaN(number) || !isFinite(number) && _multiplier == 0) {
                iFieldStart = result.length;
                result += _symbols.getNaN();
                delegate.formatted(NumberFormat.INTEGER_FIELD, NumberFormat.Field.INTEGER, NumberFormat.Field.INTEGER, iFieldStart, result.length, result);
                return result;
            }
            /* Detecting whether a double is negative is easy with the exception of
             * the value -0.0.  This is a double which has a zero mantissa (and
             * exponent), but a negative sign bit.  It is semantically distinct from
             * a zero with a positive sign bit, and this distinction is important
             * to certain kinds of computations.  However, it's a little tricky to
             * detect, since (-0.0 == 0.0) and !(-0.0 < 0.0).  How then, you may
             * ask, does it behave distinctly from +0.0?  Well, 1/(-0.0) ==
             * -Infinity.  Proper detection of -0.0 is needed to deal with the
             * issues raised by bugs 4106658, 4106667, and 4147706.  Liu 7/6/98.
             */
            var isNegative = (number < 0 || number == 0 && 1 / number < 0) ^ _multiplier < 0;
            if (_multiplier != 1) {
                number *= _multiplier;
            }
            if (!isFinite(number)) {
                if (isNegative) {
                    result = _append(result, _negativePrefix, delegate, _getNegativePrefixFieldPositions(), NumberFormat.Field.SIGN);
                } else {
                    result = _append(result, _positivePrefix, delegate, _getPositivePrefixFieldPositions(), NumberFormat.Field.SIGN);
                }
                iFieldStart = result.length;
                result += _symbols.getInfinity();
                delegate.formatted(NumberFormat.INTEGER_FIELD, NumberFormat.Field.INTEGER, NumberFormat.Field.INTEGER, iFieldStart, result.length, result);
                if (isNegative) {
                    result = _append(result, _negativeSuffix, delegate, _getNegativeSuffixFieldPositions(), NumberFormat.Field.SIGN);
                } else {
                    result = _append(result, _positiveSuffix, delegate, _getPositiveSuffixFieldPositions(), NumberFormat.Field.SIGN);
                }
                return result;
            }
            if (isNegative) {
                number = -number;
            }
            var maxIntDigits = _super.getMaximumIntegerDigits.call(this);
            var minIntDigits = _super.getMinimumIntegerDigits.call(this);
            var maxFraDigits = _super.getMaximumFractionDigits.call(this);
            var minFraDigits = _super.getMinimumFractionDigits.call(this);
            _digitList.set(isNegative, number.toString(), _useExponentialNotation ? maxIntDigits + maxFraDigits : maxFraDigits, !_useExponentialNotation);
            return _subformat(result, delegate, isNegative, false, maxIntDigits, minIntDigits, maxFraDigits, minFraDigits);
        };
        this.parse = function(text, pos) {
            pos = pos || new ParsePosition(0);
            // special case NaN
            if (text.substr(pos.index, _symbols.getNaN().length).search(_symbols.getNaN()) > -1) {
                pos.index = pos.index + _symbols.getNaN().length;
                return Number.NaN;
            }
            var status = [ false, false ];
            if (!_subparse(text, pos, _positivePrefix, _negativePrefix, _digitList, false, status)) {
                return null;
            }
            // special case INFINITY
            if (status[_STATUS_INFINITE]) {
                if (status[_STATUS_POSITIVE] == _multiplier >= 0) {
                    return Number.POSITIVE_INFINITY;
                } else {
                    return Number.NEGATIVE_INFINITY;
                }
            }
            if (_multiplier == 0) {
                if (_digitList.isZero()) {
                    return Number.NaN;
                } else if (status[_STATUS_POSITIVE]) {
                    return Number.POSITIVE_INFINITY;
                } else {
                    return Number.NEGATIVE_INFINITY;
                }
            }
            var gotDouble = true;
            var gotLongMinimum = false;
            var doubleResult = 0;
            var longResult = 0;
            // Finally, have DigitList parse the digits into a value.
            if (_digitList.fitsIntoLong(status[_STATUS_POSITIVE], _this.isParseIntegerOnly())) {
                gotDouble = false;
                longResult = _digitList.getLong();
                if (longResult < 0) {
                    // got Long.MIN_VALUE
                    gotLongMinimum = true;
                }
            } else {
                doubleResult = _digitList.getDouble();
            }
            // Divide by multiplier. We have to be careful here not to do
            // unneeded conversions between double and long.
            if (_multiplier != 1) {
                if (gotDouble) {
                    doubleResult /= _multiplier;
                } else {
                    // Avoid converting to double if we can
                    if (longResult % _multiplier == 0) {
                        longResult /= _multiplier;
                    } else {
                        doubleResult = longResult / _multiplier;
                        gotDouble = true;
                    }
                }
            }
            if (!status[_STATUS_POSITIVE] && !gotLongMinimum) {
                doubleResult = -doubleResult;
                longResult = -longResult;
            }
            // At this point, if we divided the result by the multiplier, the
            // result may fit into a long.  We check for this case and return
            // a long if possible.
            // We must do this AFTER applying the negative (if appropriate)
            // in order to handle the case of LONG_MIN; otherwise, if we do
            // this with a positive value -LONG_MIN, the double is > 0, but
            // the long is < 0. We also must retain a double in the case of
            // -0.0, which will compare as == to a long 0 cast to a double
            // (bug 4162852).
            if (_multiplier != 1 && gotDouble) {
                longResult = parseInt(doubleResult, 10);
                gotDouble = (doubleResult != longResult || doubleResult == 0 && 1 / doubleResult < 0) && !_this.isParseIntegerOnly();
            }
            return gotDouble ? doubleResult : longResult;
        };
        this.toPattern = function() {
            return _toPattern(false);
        };
        this.toLocalizedPattern = function() {
            return _toPattern(true);
        };
        this.applyPattern = function(pattern) {
            _applyPattern(pattern, false);
        };
        this.applyLocalizedPattern = function(pattern) {
            _applyPattern(pattern, true);
        };
        this.adjustForCurrencyDefaultFractionDigits = function() {
            var currency = _symbols.getCurrency();
            if (currency == null) {
                try {
                    currency = Currency.getInstance(_symbols.getInternationalCurrencySymbol());
                } catch (e) {}
            }
            if (currency != null) {
                var digits = currency.getDefaultFractionDigits();
                if (digits != -1) {
                    var oldMinDigits = this.getMinimumFractionDigits();
                    // Common patterns are "#.##", "#.00", "#".
                    // Try to adjust all of them in a reasonable way.
                    if (oldMinDigits == this.getMaximumFractionDigits()) {
                        this.setMinimumFractionDigits(digits);
                        this.setMaximumFractionDigits(digits);
                    } else {
                        this.setMinimumFractionDigits(Math.min(digits, oldMinDigits));
                        this.setMaximumFractionDigits(digits);
                    }
                }
            }
        };
        _init(pattern, symbols);
    }
    var _STATUS_INFINITE = 0;
    var _STATUS_POSITIVE = 1;
    var _STATUS_LENGTH = 2;
    DecimalFormat.prototype = Object.create(NumberFormat.prototype);
    DecimalFormat.prototype.constructor = DecimalFormat;
    DecimalFormat.prototype.equals = function(other) {
        if (!other) return false;
        if (!NumberFormat.prototype.equals.apply(this, [ other ])) return false;
        // super does class check
        if (!(other instanceof DecimalFormat)) return false;
        return this.toPattern() == other.toPattern() && this.getMultiplier() == other.getMultiplier() && this.getGroupingSize() == other.getGroupingSize() && this.isDecimalSeparatorAlwaysShown() == other.isDecimalSeparatorAlwaysShown() && this.getMaximumIntegerDigits() == other.getMaximumIntegerDigits() && this.getMinimumIntegerDigits() == other.getMinimumIntegerDigits() && this.getMaximumFractionDigits() == other.getMaximumFractionDigits() && this.getMinimumFractionDigits() == other.getMinimumFractionDigits() && this.getDecimalFormatSymbols().equals(other.getDecimalFormatSymbols());
    };
    global.DecimalFormat = DecimalFormat;
    return DecimalFormat;
});

(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        exports["ChoiceFormat"] = module.exports = factory(global);
    } else {
        factory(global);
    }
})(this, function(global) {
    function ChoiceFormat(newPattern) {
        NumberFormat.call(this);
        var _choiceLimits;
        var _choiceFormats;
        this.applyPattern = function(newPattern) {
            var segments = [ "", "" ];
            var newChoiceLimits = [];
            var newChoiceFormats = [];
            var count = 0;
            var part = 0;
            var startValue = 0;
            var oldStartValue = Number.NaN;
            var inQuote = false;
            for (var i = 0; i < newPattern.length; ++i) {
                var ch = newPattern.charAt(i);
                if (ch == "'") {
                    // Check for "''" indicating a literal quote
                    if (i + 1 < newPattern.length && newPattern.charAt(i + 1) == ch) {
                        segments[part] += ch;
                        ++i;
                    } else {
                        inQuote = !inQuote;
                    }
                } else if (inQuote) {
                    segments[part] += ch;
                } else if (ch == "<" || ch == "#" || ch == "\u2264") {
                    if (segments[0].length == 0) {
                        throw "";
                    }
                    try {
                        var tempBuffer = segments[0].toString();
                        if (tempBuffer === "\u221e") {
                            startValue = Number.POSITIVE_INFINITY;
                        } else if (tempBuffer === "-\u221e") {
                            startValue = Number.NEGATIVE_INFINITY;
                        } else {
                            startValue = parseFloat(segments[0]);
                        }
                    } catch (e) {
                        throw "";
                    }
                    if (ch == "<" && startValue != Number.POSITIVE_INFINITY && startValue != Number.NEGATIVE_INFINITY) {
                        startValue = ChoiceFormat.nextDouble(startValue);
                    }
                    if (startValue <= oldStartValue) {
                        throw "";
                    }
                    segments[0] = "";
                    part = 1;
                } else if (ch == "|") {
                    newChoiceLimits.push(startValue);
                    newChoiceFormats.push(segments[1].toString());
                    ++count;
                    oldStartValue = startValue;
                    segments[1] = "";
                    part = 0;
                } else {
                    segments[part] += ch;
                }
            }
            // clean up last one
            if (part == 1) {
                newChoiceLimits.push(startValue);
                newChoiceFormats.push(segments[1].toString());
                ++count;
            }
            _choiceLimits = newChoiceLimits.slice(0, count);
            _choiceFormats = newChoiceFormats.slice(0, count);
        };
        this.toPattern = function() {
            var result = "";
            for (var i = 0; i < _choiceLimits.length; ++i) {
                if (i != 0) {
                    result += "|";
                }
                // choose based upon which has less precision
                // approximate that by choosing the closest one to an integer.
                // could do better, but it's not worth it.
                var less = ChoiceFormat.previousDouble(_choiceLimits[i]);
                var tryLessOrEqual = Math.abs(_choiceLimits[i] % 1);
                var tryLess = Math.abs(less % 1);
                if (tryLessOrEqual < tryLess) {
                    result += _choiceLimits[i].toString();
                    result += "#";
                } else {
                    if (_choiceLimits[i] == Number.POSITIVE_INFINITY) {
                        result += "\u221e";
                    } else if (_choiceLimits[i] == Number.NEGATIVE_INFINITY) {
                        result += "-\u221e";
                    } else {
                        result += less.toString();
                    }
                    result += "<";
                }
                // Append choiceFormats[i], using quotes if there are special characters.
                // Single quotes themselves must be escaped in either case.
                var text = _choiceFormats[i];
                var needQuote = text.indexOf("<") >= 0 || text.indexOf("#") >= 0 || text.indexOf("\u2264") >= 0 || text.indexOf("|") >= 0;
                if (needQuote) result += "'";
                if (text.indexOf("'") < 0) result += text; else {
                    for (var j = 0; j < text.length; ++j) {
                        var c = text.charAt(j);
                        result += c;
                        if (c == "'") result += c;
                    }
                }
                if (needQuote) result += "'";
            }
            return result.toString();
        };
        this.setChoices = function(limits, formats) {
            if (limits.length != formats.length) {
                throw "Array and limit arrays must be of the same length.";
            }
            _choiceLimits = limits;
            _choiceFormats = formats;
        };
        this.getLimits = function() {
            return _choiceLimits;
        };
        this.getFormats = function() {
            return _choiceFormats;
        };
        this.format = function(number, toAppendTo, status) {
            toAppendTo = typeof toAppendTo == "string" ? toAppendTo : "";
            // find the number
            var i;
            for (i = 0; i < _choiceLimits.length; ++i) {
                if (!(number >= _choiceLimits[i])) {
                    // same as number < choiceLimits, except catchs NaN
                    break;
                }
            }
            --i;
            if (i < 0) i = 0;
            // return either a formatted number, or a string
            return toAppendTo + _choiceFormats[i];
        };
        this.parse = function(text, status) {
            // find the best number (defined as the one with the longest parse)
            status = status || new ParsePosition(0);
            var start = status.index;
            var furthest = start;
            var bestNumber = Number.NaN;
            var tempNumber = 0;
            for (var i = 0; i < _choiceFormats.length; ++i) {
                var tempString = _choiceFormats[i];
                if (text.substr(start, tempString.length).search(tempString) > -1) {
                    status.index = start + tempString.length;
                    tempNumber = _choiceLimits[i];
                    if (status.index > furthest) {
                        furthest = status.index;
                        bestNumber = tempNumber;
                        if (furthest == text.length) break;
                    }
                }
            }
            status.index = furthest;
            if (status.index == start) {
                status.errorIndex = furthest;
            }
            return bestNumber;
        };
        if (arguments.length == 2) {
            this.setChoices.apply(this, arguments);
        } else {
            this.applyPattern(newPattern);
        }
    }
    var _SIGN = 0x8000000000000000;
    var _EXPONENT = 0x7ff0000000000000;
    var _POSITIVEINFINITY = 0x7ff0000000000000;
    ChoiceFormat.previousDouble = function(d) {
        return ChoiceFormat.nextDouble(d, false);
    };
    ChoiceFormat.nextDouble = function(d, positive) {
        if (typeof positive == "undefined") {
            return ChoiceFormat.nextDouble(d, true);
        }
        /* filter out NaN's */
        if (isNaN(d)) {
            return d;
        }
        /* zero's are also a special case */
        if (d == 0) {
            var smallestPositiveDouble = Number.MIN_VALUE;
            if (positive) {
                return smallestPositiveDouble;
            } else {
                return -smallestPositiveDouble;
            }
        }
        /* if entering here, d is a nonzero value */
        return d + (positive ? 1 : -1) * 1e-15;
    };
    ChoiceFormat.prototype = Object.create(NumberFormat.prototype);
    ChoiceFormat.prototype.constructor = ChoiceFormat;
    global.ChoiceFormat = ChoiceFormat;
    return ChoiceFormat;
});

(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        exports["CalendarHelper"] = module.exports = factory(global);
    } else {
        factory(global);
    }
})(this, function(global) {
    function CalendarHelper() {}
    var _ONE_SECOND = 1e3;
    var _ONE_MINUTE = _ONE_SECOND * 60;
    var _ONE_HOUR = _ONE_MINUTE * 60;
    var _ONE_DAY = _ONE_HOUR * 24;
    var _firstDayOfWeek = 1;
    var _minimalDaysInFirstWeek = 1;
    var _getFirstWeekDate = function(weekYear, month) {
        var firstWeekDate = new Date(weekYear, !isNaN(month) ? month : 0, _minimalDaysInFirstWeek);
        firstWeekDate.setDate(firstWeekDate.getDate() - _getWeekdayDelta(firstWeekDate.getDay()));
        return firstWeekDate;
    };
    var _getWeekdayDelta = function(weekday) {
        return (weekday - (_firstDayOfWeek - 1) + 7) % 7;
    };
    CalendarHelper.setCalendarData = function(locale) {
        var rb = ResourceBundle.getBundle("CalendarData", locale);
        _firstDayOfWeek = parseInt(rb["firstDayOfWeek"], 10);
        _minimalDaysInFirstWeek = parseInt(rb["minimalDaysInFirstWeek"], 10);
    };
    CalendarHelper.getField = function(date, field) {
        switch (field) {
          case 0:
            // ERA
            return 1;

          case 1:
            // YEAR
            return date.getFullYear();

          case 2:
            // MONTH
            return date.getMonth();

          case 3:
            // WEEK_OF_YEAR
            return CalendarHelper.getWeekNumber(date);

          case 4:
            // WEEK_OF_MONTH
            return CalendarHelper.getMonthWeekNumber(date);

          case 5:
            // DATE, DAY_OF_MONTH
            return date.getDate();

          case 6:
            // DAY_OF_YEAR
            return CalendarHelper.computeDayOfYear(date);

          case 7:
            // DAY_OF_WEEK
            return date.getDay() + 1;

          case 8:
            // DAY_OF_WEEK_IN_MONTH
            return Math.floor((date.getDate() - 1) / 7 + 1);

          case 9:
            // AM_PM
            return date.getHours() < 12 ? 0 : 1;

          case 10:
            // HOUR
            return date.getHours() % 12;

          case 11:
            // HOUR_OF_DAY
            return date.getHours();

          case 12:
            // MINUTE
            return date.getMinutes();

          case 13:
            // SECOND
            return date.getSeconds();

          case 14:
            // MILLISECOND
            return date.getMilliseconds();

          case 15:
            // ZONE_OFFSET
            return date.getTimezoneOffset();

          case 16:
            // DST_OFFSET
            return 0;

          default:
            return null;
        }
    };
    CalendarHelper.setField = function(date, field, value) {
        switch (field) {
          case 0:
            // ERA
            break;

          case 1:
            // YEAR
            date.setFullYear(value);
            break;

          case 2:
            // MONTH
            date.setMonth(value);
            break;

          case 3:
            // WEEK_OF_YEAR
            date.setTime(CalendarHelper.computeDateOfWeekOfYear(date.getFullYear(), value, date.getDay()));
            break;

          case 4:
            // WEEK_OF_MONTH
            date.setTime(CalendarHelper.computeDateOfWeekOfMonth(date.getFullYear(), date.getMonth(), value, date.getDay()));
            break;

          case 5:
            // DATE, DAY_OF_MONTH
            date.setDate(value);
            break;

          case 6:
            // DAY_OF_YEAR
            date.setMonth(0, value);
            break;

          case 7:
            // DAY_OF_WEEK
            date.setDate(date.getDate() + value - (date.getDay() + 1));
            break;

          case 8:
            // DAY_OF_WEEK_IN_MONTH
            date.setDate((value - CalendarHelper.getField(date, 8)) * 7 + date.getDate());
            break;

          case 9:
            // AM_PM
            if (value == 1 && date.getHours() < 12) {
                date.setHours(date.getHours() + 12);
            }
            break;

          case 10:
          // HOUR
            case 11:
            // HOUR_OF_DAY
            date.setHours(value);
            break;

          case 12:
            // MINUTE
            date.setMinutes(value);
            break;

          case 13:
            // SECOND
            date.setSeconds(value);
            break;

          case 14:
            // MILLISECOND
            date.setMilliseconds(value);
            break;

          case 15:
            // ZONE_OFFSET
            date.setMinutes(date.getMinutes() + date.getTimezoneOffset() - value);
            break;

          case 16:
          // DST_OFFSET
            default:
            break;
        }
    };
    CalendarHelper.toISODayOfWeek = function(calendarDayOfWeek) {
        return calendarDayOfWeek == 1 ? 7 : calendarDayOfWeek - 1;
    };
    CalendarHelper.toCalendarDayOfWeek = function(isoDayOfWeek) {
        if (!CalendarHelper.isValidDayOfWeek(isoDayOfWeek)) {
            // adjust later for lenient mode
            return isoDayOfWeek;
        }
        return isoDayOfWeek == 7 ? 1 : isoDayOfWeek + 1;
    };
    CalendarHelper.isValidDayOfWeek = function(dayOfWeek) {
        return dayOfWeek > 0 && dayOfWeek <= 7;
    };
    CalendarHelper.sprintf0d = function(sb, value, width) {
        var d = value;
        if (d < 0) {
            sb += "-";
            d = -d;
            --width;
        }
        var n = 10;
        var i;
        for (i = 2; i < width; i++) {
            n *= 10;
        }
        for (i = 1; i < width && d < n; i++) {
            sb += "0";
            n /= 10;
        }
        sb += d;
        return sb;
    };
    CalendarHelper.getMonthWeekNumber = function(date) {
        return Math.ceil(((date - _getFirstWeekDate(date.getFullYear(), date.getMonth())) / _ONE_DAY + 1) / 7);
    };
    CalendarHelper.getWeekNumber = function(date) {
        var weekNumber = Math.ceil(((date - _getFirstWeekDate(date.getFullYear())) / _ONE_DAY + 1) / 7);
        return weekNumber < 1 ? CalendarHelper.getWeekNumber(new Date(date.getFullYear(), 0, 0)) : weekNumber;
    };
    CalendarHelper.getWeekYear = function(date) {
        var d = new Date(date.getTime());
        d.setDate(d.getDate() - _getWeekdayDelta(d.getDay()));
        return d.getFullYear();
    };
    CalendarHelper.computeDayOfYear = function(date) {
        var year = date.getFullYear();
        var start = new Date(year, 0, 0, 0, 0, 0, 0);
        var end = new Date(year, date.getMonth(), date.getDate(), 0, 0, 0, 0);
        return Math.floor((end - start) / _ONE_DAY);
    };
    CalendarHelper.computeDateOfWeekOfYear = function(year, weekNumber, weekday) {
        var dayOfYear = (weekNumber - 1) * 7 + _getFirstWeekDate(year).getDate() + _getWeekdayDelta(weekday);
        var daysInYear = CalendarHelper.computeDayOfYear(new Date(year + 1, 0, 0));
        if (dayOfYear < 1) {
            dayOfYear += CalendarHelper.computeDayOfYear(new Date(year, 0, 0));
            year--;
        } else if (dayOfYear > daysInYear) {
            dayOfYear -= daysInYear;
            year++;
        }
        return new Date(year, 0, dayOfYear);
    };
    CalendarHelper.computeDateOfWeekOfMonth = function(year, month, weekOfMonth, weekday) {
        var d = _getFirstWeekDate(year, month);
        var dayOfMonth = (weekOfMonth - 1) * 7 + d.getDate() + _getWeekdayDelta(weekday);
        return new Date(d.getFullYear(), d.getMonth(), dayOfMonth);
    };
    global.CalendarHelper = CalendarHelper;
    return CalendarHelper;
});

(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        exports["DateFormatSymbols"] = module.exports = factory(global);
    } else {
        factory(global);
    }
})(this, function(global) {
    function DateFormatSymbols(locale) {
        var _eras = null;
        var _months = null;
        var _shortMonths = null;
        var _weekdays = null;
        var _shortWeekdays = null;
        var _ampms = null;
        var _zoneStrings = null;
        var _localPatternChars = null;
        var _locale = null;
        var _initializeData = function(desiredLocale) {
            _locale = desiredLocale;
            // Initialize the fields from the ResourceBundle for locale.
            var resource = ResourceBundle.getBundle("FormatData", desiredLocale);
            _eras = resource["Eras"];
            _months = resource["MonthNames"];
            _shortMonths = resource["MonthAbbreviations"];
            _ampms = resource["AmPmMarkers"];
            _localPatternChars = resource["DateTimePatternChars"];
            // Day of week names are stored in a 1-based array.
            _weekdays = _toOneBasedArray(resource["DayNames"]);
            _shortWeekdays = _toOneBasedArray(resource["DayAbbreviations"]);
        };
        this.getEras = function() {
            return _eras.slice();
        };
        this.setEras = function(newEras) {
            _eras = newEras.slice();
        };
        this.getMonths = function() {
            return _months.slice();
        };
        this.setMonths = function(newMonths) {
            _months = newMonths.slice();
        };
        this.getShortMonths = function() {
            return _shortMonths.slice();
        };
        this.setShortMonths = function(newShortMonths) {
            _shortMonths = newShortMonths.slice();
        };
        this.getWeekdays = function() {
            return _weekdays.slice();
        };
        this.setWeekdays = function(newWeekdays) {
            _weekdays = newWeekdays.slice();
        };
        this.getShortWeekdays = function() {
            return _shortWeekdays.slice();
        };
        this.setShortWeekdays = function(newShortWeekdays) {
            _shortWeekdays = newShortWeekdays.slice();
        };
        this.getAmPmStrings = function() {
            return _ampms.slice();
        };
        this.setAmPmStrings = function(newAmpms) {
            _ampms = newAmpms.slice();
        };
        // TODO: Load zone strings if not initialized
        this.getZoneStrings = function() {
            var arr = [];
            for (var i = 0; i < _zoneStrings.length; i++) {
                arr.push(_zoneStrings[i].slice());
            }
            return arr;
        };
        this.setZoneStrings = function(newZoneStrings) {
            var arr = [];
            for (var i = 0; i < newZoneStrings.length; i++) {
                arr.push(newZoneStrings[i].slice());
            }
            _zoneStrings = arr;
        };
        this.getLocalPatternChars = function() {
            return _localPatternChars.toString();
        };
        this.setLocalPatternChars = function(newLocalPatternChars) {
            _localPatternChars = newLocalPatternChars.toString();
        };
        _initializeData(locale || Locale.getDefault());
    }
    var _toOneBasedArray = function(src) {
        var dst = src.slice();
        dst.unshift("");
        return dst;
    };
    DateFormatSymbols.prototype.equals = function(that) {
        if (this == that) return true;
        if (!(that && that instanceof DecimalFormatSymbols)) return false;
        return this.getEras().toString() == that.getEras().toString() && this.getMonths().toString() == that.getMonths().toString() && this.getShortMonths().toString() == that.getShortMonths().toString() && this.getWeekdays().toString() == that.getWeekdays().toString() && this.getShortWeekdays().toString() == that.getShortWeekdays().toString() && this.getAmPmStrings().toString() == that.getAmPmStrings().toString() && this.getLocalPatternChars() == that.getLocalPatternChars();
    };
    DateFormatSymbols.patternChars = "GyMdkHmsSEDFwWahKzZYuX";
    DateFormatSymbols.PATTERN_ERA = 0;
    // G
    DateFormatSymbols.PATTERN_YEAR = 1;
    // y
    DateFormatSymbols.PATTERN_MONTH = 2;
    // M
    DateFormatSymbols.PATTERN_DAY_OF_MONTH = 3;
    // d
    DateFormatSymbols.PATTERN_HOUR_OF_DAY1 = 4;
    // k
    DateFormatSymbols.PATTERN_HOUR_OF_DAY0 = 5;
    // H
    DateFormatSymbols.PATTERN_MINUTE = 6;
    // m
    DateFormatSymbols.PATTERN_SECOND = 7;
    // s
    DateFormatSymbols.PATTERN_MILLISECOND = 8;
    // S
    DateFormatSymbols.PATTERN_DAY_OF_WEEK = 9;
    // E
    DateFormatSymbols.PATTERN_DAY_OF_YEAR = 10;
    // D
    DateFormatSymbols.PATTERN_DAY_OF_WEEK_IN_MONTH = 11;
    // F
    DateFormatSymbols.PATTERN_WEEK_OF_YEAR = 12;
    // w
    DateFormatSymbols.PATTERN_WEEK_OF_MONTH = 13;
    // W
    DateFormatSymbols.PATTERN_AM_PM = 14;
    // a
    DateFormatSymbols.PATTERN_HOUR1 = 15;
    // h
    DateFormatSymbols.PATTERN_HOUR0 = 16;
    // K
    DateFormatSymbols.PATTERN_ZONE_NAME = 17;
    // z
    DateFormatSymbols.PATTERN_ZONE_VALUE = 18;
    // Z
    DateFormatSymbols.PATTERN_WEEK_YEAR = 19;
    // Y
    DateFormatSymbols.PATTERN_ISO_DAY_OF_WEEK = 20;
    // u
    DateFormatSymbols.PATTERN_ISO_ZONE = 21;
    // X
    global.DateFormatSymbols = DateFormatSymbols;
    return DateFormatSymbols;
});

(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        exports["DateFormat"] = module.exports = factory(global);
    } else {
        factory(global);
    }
})(this, function(global) {
    function DateFormat() {
        Format.call(this);
    }
    var _get = function(timeStyle, dateStyle, flags, loc) {
        if ((flags & 1) != 0) {
            if (timeStyle < 0 || timeStyle > 3) {
                throw "Illegal time style " + timeStyle;
            }
        } else {
            timeStyle = -1;
        }
        if ((flags & 2) != 0) {
            if (dateStyle < 0 || dateStyle > 3) {
                throw "Illegal date style " + dateStyle;
            }
        } else {
            dateStyle = -1;
        }
        try {
            return new SimpleDateFormat(timeStyle, dateStyle, loc);
        } catch (e) {
            return new SimpleDateFormat("M/d/yy h:mm a");
        }
    };
    DateFormat.ERA_FIELD = 0;
    DateFormat.YEAR_FIELD = 1;
    DateFormat.MONTH_FIELD = 2;
    DateFormat.DATE_FIELD = 3;
    DateFormat.HOUR_OF_DAY1_FIELD = 4;
    DateFormat.HOUR_OF_DAY0_FIELD = 5;
    DateFormat.MINUTE_FIELD = 6;
    DateFormat.SECOND_FIELD = 7;
    DateFormat.MILLISECOND_FIELD = 8;
    DateFormat.DAY_OF_WEEK_FIELD = 9;
    DateFormat.DAY_OF_YEAR_FIELD = 10;
    DateFormat.DAY_OF_WEEK_IN_MONTH_FIELD = 11;
    DateFormat.WEEK_OF_YEAR_FIELD = 12;
    DateFormat.WEEK_OF_MONTH_FIELD = 13;
    DateFormat.AM_PM_FIELD = 14;
    DateFormat.HOUR1_FIELD = 15;
    DateFormat.HOUR0_FIELD = 16;
    DateFormat.TIMEZONE_FIELD = 17;
    DateFormat.FULL = 0;
    DateFormat.LONG = 1;
    DateFormat.MEDIUM = 2;
    DateFormat.SHORT = 3;
    DateFormat.DEFAULT = DateFormat.MEDIUM;
    DateFormat.getTimeInstance = function(style, locale) {
        return _get(typeof style != "undefined" ? style : DateFormat.DEFAULT, 0, 1, locale || Locale.getDefault());
    };
    DateFormat.getDateInstance = function(style, locale) {
        return _get(0, typeof style != "undefined" ? style : DateFormat.DEFAULT, 2, locale || Locale.getDefault());
    };
    DateFormat.getDateTimeInstance = function(dateStyle, timeStyle, locale) {
        return _get(typeof timeStyle != "undefined" ? timeStyle : DateFormat.DEFAULT, typeof dateStyle != "undefined" ? dateStyle : DateFormat.DEFAULT, 3, locale || Locale.getDefault());
    };
    DateFormat.getInstance = function() {
        return DateFormat.getDateTimeInstance(DateFormat.SHORT, DateFormat.SHORT);
    };
    DateFormat.prototype = Object.create(Format.prototype);
    DateFormat.prototype.constructor = DateFormat;
    DateFormat.prototype.equals = function(other) {
        if (this == other) return true;
        return other && other instanceof DateFormat;
    };
    DateFormat.Field = function Field(name) {
        Format.Field.call(this, name);
    };
    DateFormat.Field.prototype = Object.create(Format.Field.prototype);
    DateFormat.Field.prototype.constructor = DateFormat.Field;
    DateFormat.Field.ERA = new DateFormat.Field("era");
    DateFormat.Field.YEAR = new DateFormat.Field("year");
    DateFormat.Field.MONTH = new DateFormat.Field("month");
    DateFormat.Field.DAY_OF_MONTH = new DateFormat.Field("day of month");
    DateFormat.Field.HOUR_OF_DAY1 = new DateFormat.Field("hour of day 1");
    DateFormat.Field.HOUR_OF_DAY0 = new DateFormat.Field("hour of day");
    DateFormat.Field.MINUTE = new DateFormat.Field("minute");
    DateFormat.Field.SECOND = new DateFormat.Field("second");
    DateFormat.Field.MILLISECOND = new DateFormat.Field("millisecond");
    DateFormat.Field.DAY_OF_WEEK = new DateFormat.Field("day of week");
    DateFormat.Field.DAY_OF_YEAR = new DateFormat.Field("day of year");
    DateFormat.Field.DAY_OF_WEEK_IN_MONTH = new DateFormat.Field("day of week in month");
    DateFormat.Field.WEEK_OF_YEAR = new DateFormat.Field("week of year");
    DateFormat.Field.WEEK_OF_MONTH = new DateFormat.Field("week of month");
    DateFormat.Field.AM_PM = new DateFormat.Field("am pm");
    DateFormat.Field.HOUR1 = new DateFormat.Field("hour 1");
    DateFormat.Field.HOUR0 = new DateFormat.Field("hour");
    DateFormat.Field.TIME_ZONE = new DateFormat.Field("time zone");
    global.DateFormat = DateFormat;
    return DateFormat;
});

(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        global.CalendarHelper = module.require("./calendar-helper");
        exports["SimpleDateFormat"] = module.exports = factory(global);
    } else {
        factory(global);
    }
})(this, function(global) {
    var CalendarHelper = global.CalendarHelper;
    function SimpleDateFormat() {
        DateFormat.call(this);
        var _date;
        var _numberFormat;
        var _pattern;
        var _originalNumberFormat;
        var _originalNumberPattern;
        var _minusSign = "-";
        var _hasFollowingMinusSign = false;
        var _compiledPattern;
        var _zeroDigit;
        var _formatData;
        var _defaultCenturyStart;
        var _defaultCenturyStartYear;
        var _locale;
        var _useDateFormatSymbols = false;
        var _initialize = function(loc) {
            // Verify and compile the given pattern.
            _compiledPattern = _compile(_pattern);
            _numberFormat = NumberFormat.getIntegerInstance(loc);
            _numberFormat.setGroupingUsed(false);
            _initializeDefaultCentury();
        };
        var _initializeCalendar = function(loc) {
            _date = new Date();
            CalendarHelper.setCalendarData(loc);
        };
        var _initializeDefaultCentury = function() {
            var date = new Date();
            date.setFullYear(date.getFullYear() - 80);
            _parseAmbiguousDatesAsAfter(date);
        };
        var _parseAmbiguousDatesAsAfter = function(startDate) {
            _defaultCenturyStart = startDate;
            _date = new Date(startDate.getTime());
            _defaultCenturyStartYear = _date.getFullYear();
        };
        var _compile = function(pattern) {
            var length = pattern.length;
            var inQuote = false;
            var compiledPattern = "";
            var tmpBuffer = null;
            var count = 0;
            var lastTag = -1;
            for (var i = 0; i < length; i++) {
                var c = pattern.charAt(i);
                if (c == "'") {
                    // '' is treated as a single quote regardless of being
                    // in a quoted section.
                    if (i + 1 < length) {
                        c = pattern.charAt(i + 1);
                        if (c == "'") {
                            i++;
                            if (count != 0) {
                                compiledPattern = _encode(lastTag, count, compiledPattern);
                                lastTag = -1;
                                count = 0;
                            }
                            if (inQuote) {
                                tmpBuffer += c;
                            } else {
                                compiledPattern += String.fromCharCode(_TAG_QUOTE_ASCII_CHAR << 8 | c.charCodeAt(0));
                            }
                            continue;
                        }
                    }
                    if (!inQuote) {
                        if (count != 0) {
                            compiledPattern = _encode(lastTag, count, compiledPattern);
                            lastTag = -1;
                            count = 0;
                        }
                        tmpBuffer = "";
                        inQuote = true;
                    } else {
                        var len = tmpBuffer.length;
                        if (len == 1) {
                            var ch = tmpBuffer.charAt(0);
                            if (ch < 128) {
                                compiledPattern += String.fromCharCode(_TAG_QUOTE_ASCII_CHAR << 8 | ch.charCodeAt(0));
                            } else {
                                compiledPattern += String.fromCharCode(_TAG_QUOTE_CHARS << 8 | 1);
                                compiledPattern += ch;
                            }
                        } else {
                            compiledPattern = _encode(_TAG_QUOTE_CHARS, len, compiledPattern);
                            compiledPattern += tmpBuffer;
                        }
                        inQuote = false;
                    }
                    continue;
                }
                if (inQuote) {
                    tmpBuffer += c;
                    continue;
                }
                if (!(c >= "a" && c <= "z" || c >= "A" && c <= "Z")) {
                    if (count != 0) {
                        compiledPattern = _encode(lastTag, count, compiledPattern);
                        lastTag = -1;
                        count = 0;
                    }
                    if (c < 128) {
                        // In most cases, c would be a delimiter, such as ':'.
                        compiledPattern += String.fromCharCode(_TAG_QUOTE_ASCII_CHAR << 8 | c.charCodeAt(0));
                    } else {
                        // Take any contiguous non-ASCII alphabet characters and
                        // put them in a single TAG_QUOTE_CHARS.
                        var j;
                        for (j = i + 1; j < length; j++) {
                            var d = pattern.charAt(j);
                            if (d == "'" || (d >= "a" && d <= "z" || d >= "A" && d <= "Z")) {
                                break;
                            }
                        }
                        compiledPattern += String.fromCharCode(_TAG_QUOTE_CHARS << 8 | j - i);
                        for (;i < j; i++) {
                            compiledPattern += pattern.charAt(i);
                        }
                        i--;
                    }
                    continue;
                }
                var tag;
                if ((tag = DateFormatSymbols.patternChars.indexOf(c)) == -1) {
                    throw "Illegal pattern character " + "'" + c + "'";
                }
                if (lastTag == -1 || lastTag == tag) {
                    lastTag = tag;
                    count++;
                    continue;
                }
                compiledPattern = _encode(lastTag, count, compiledPattern);
                lastTag = tag;
                count = 1;
            }
            if (inQuote) {
                throw "Unterminated quote";
            }
            if (count != 0) {
                compiledPattern = _encode(lastTag, count, compiledPattern);
            }
            // Copy the compiled pattern to a char array
            return compiledPattern.split("");
        };
        var _subFormat = function(patternCharIndex, count, delegate, buffer, useDateFormatSymbols) {
            var maxIntCount = 2147483647;
            var current = null;
            var beginOffset = buffer.length;
            var field = _PATTERN_INDEX_TO_CALENDAR_FIELD[patternCharIndex];
            var value;
            if (field == 17) {
                value = CalendarHelper.getWeekYear(_date);
            } else if (field == 1e3) {
                value = CalendarHelper.toISODayOfWeek(CalendarHelper.getField(_date, 7));
            } else {
                value = CalendarHelper.getField(_date, field);
            }
            /*var style = (count >= 4) ? 2 : 1;
            if (!useDateFormatSymbols && field != 1000) {
                current = calendar.getDisplayName(field, style, locale);
            }*/
            // Note: zeroPaddingNumber() assumes that maxDigits is either
            // 2 or maxIntCount. If we make any changes to this,
            // zeroPaddingNumber() must be fixed.
            switch (patternCharIndex) {
              case DateFormatSymbols.PATTERN_ERA:
                // 'G'
                if (useDateFormatSymbols) {
                    var eras = _formatData.getEras();
                    if (value < eras.length) current = eras[value];
                }
                if (current == null) current = "";
                break;

              case DateFormatSymbols.PATTERN_WEEK_YEAR:
              // 'Y'
                case DateFormatSymbols.PATTERN_YEAR:
                // 'y'
                if (count != 2) buffer = _zeroPaddingNumber(value, count, maxIntCount, buffer); else // count == 2
                buffer = _zeroPaddingNumber(value, 2, 2, buffer);
                // clip 1996 to 96
                break;

              case DateFormatSymbols.PATTERN_MONTH:
                // 'M'
                if (useDateFormatSymbols) {
                    var months;
                    if (count >= 4) {
                        months = _formatData.getMonths();
                        current = months[value];
                    } else if (count == 3) {
                        months = _formatData.getShortMonths();
                        current = months[value];
                    }
                } else {
                    if (count < 3) {
                        current = null;
                    }
                }
                if (current == null) {
                    buffer = _zeroPaddingNumber(value + 1, count, maxIntCount, buffer);
                }
                break;

              case DateFormatSymbols.PATTERN_HOUR_OF_DAY1:
                // 'k' 1-based.  eg, 23:59 + 1 hour =>> 24:59
                if (current == null) {
                    if (value == 0) buffer = _zeroPaddingNumber(CalendarHelper.getField(_date, 11) + 24, count, maxIntCount, buffer); else buffer = _zeroPaddingNumber(value, count, maxIntCount, buffer);
                }
                break;

              case DateFormatSymbols.PATTERN_DAY_OF_WEEK:
                // 'E'
                if (useDateFormatSymbols) {
                    var weekdays;
                    if (count >= 4) {
                        weekdays = _formatData.getWeekdays();
                        current = weekdays[value];
                    } else {
                        // count < 4, use abbreviated form if exists
                        weekdays = _formatData.getShortWeekdays();
                        current = weekdays[value];
                    }
                }
                break;

              case DateFormatSymbols.PATTERN_AM_PM:
                // 'a'
                if (useDateFormatSymbols) {
                    var ampm = _formatData.getAmPmStrings();
                    current = ampm[value];
                }
                break;

              case DateFormatSymbols.PATTERN_HOUR1:
                // 'h' 1-based.  eg, 11PM + 1 hour =>> 12 AM
                if (current == null) {
                    if (value == 0) buffer = _zeroPaddingNumber(CalendarHelper.getField(_date, 10) + 12, count, maxIntCount, buffer); else buffer = _zeroPaddingNumber(value, count, maxIntCount, buffer);
                }
                break;

              // TODO: Use time zones
                /*case DateFormatSymbols.PATTERN_ZONE_NAME: // 'z'
                    if (current == null) {
                        if (formatData.locale == null || formatData.isZoneStringsSet) {
                            int zoneIndex =
                                formatData.getZoneIndex(calendar.getTimeZone().getID());
                            if (zoneIndex == -1) {
                                value = calendar.get(Calendar.ZONE_OFFSET) +
                                    calendar.get(Calendar.DST_OFFSET);
                                buffer.append(ZoneInfoFile.toCustomID(value));
                            } else {
                                int index = (calendar.get(Calendar.DST_OFFSET) == 0) ? 1: 3;
                                if (count < 4) {
                                    // Use the short name
                                    index++;
                                }
                                String[][] zoneStrings = formatData.getZoneStringsWrapper();
                                buffer.append(zoneStrings[zoneIndex][index]);
                            }
                        } else {
                            TimeZone tz = calendar.getTimeZone();
                            boolean daylight = (calendar.get(Calendar.DST_OFFSET) != 0);
                            int tzstyle = (count < 4 ? TimeZone.SHORT : TimeZone.LONG);
                            buffer.append(tz.getDisplayName(daylight, tzstyle, formatData.locale));
                        }
                    }
                    break;*/
                case DateFormatSymbols.PATTERN_ZONE_VALUE:
                // 'Z' ("-/+hhmm" form)
                value = -CalendarHelper.getField(_date, 15);
                var width = 4;
                if (value >= 0) {
                    buffer += "+";
                } else {
                    width++;
                }
                var num = value / 60 * 100 + value % 60;
                buffer = CalendarHelper.sprintf0d(buffer, num, width);
                break;

              case DateFormatSymbols.PATTERN_ISO_ZONE:
                // 'X'
                value = -CalendarHelper.getField(_date, 15);
                if (value == 0) {
                    buffer += "Z";
                    break;
                }
                // value /=  60000;
                if (value >= 0) {
                    buffer += "+";
                } else {
                    buffer += "-";
                    value = -value;
                }
                buffer = CalendarHelper.sprintf0d(buffer, value / 60, 2);
                if (count == 1) {
                    break;
                }
                if (count == 3) {
                    buffer += ":";
                }
                buffer = CalendarHelper.sprintf0d(buffer, value % 60, 2);
                break;

              default:
                // case PATTERN_DAY_OF_MONTH:         // 'd'
                // case PATTERN_HOUR_OF_DAY0:         // 'H' 0-based.  eg, 23:59 + 1 hour =>> 00:59
                // case PATTERN_MINUTE:               // 'm'
                // case PATTERN_SECOND:               // 's'
                // case PATTERN_MILLISECOND:          // 'S'
                // case PATTERN_DAY_OF_YEAR:          // 'D'
                // case PATTERN_DAY_OF_WEEK_IN_MONTH: // 'F'
                // case PATTERN_WEEK_OF_YEAR:         // 'w'
                // case PATTERN_WEEK_OF_MONTH:        // 'W'
                // case PATTERN_HOUR0:                // 'K' eg, 11PM + 1 hour =>> 0 AM
                // case PATTERN_ISO_DAY_OF_WEEK:      // 'u' pseudo field, Monday = 1, ..., Sunday = 7
                if (current == null) {
                    buffer = _zeroPaddingNumber(value, count, maxIntCount, buffer);
                }
                break;
            }
            // switch (patternCharIndex)
            if (current != null) {
                buffer += current;
            }
            var fieldID = _PATTERN_INDEX_TO_DATE_FORMAT_FIELD[patternCharIndex];
            var f = _PATTERN_INDEX_TO_DATE_FORMAT_FIELD_ID[patternCharIndex];
            delegate.formatted(fieldID, f, f, beginOffset, buffer.length, buffer);
            return buffer;
        };
        var _zeroPaddingNumber = function(value, minDigits, maxDigits, buffer) {
            // Optimization for 1, 2 and 4 digit numbers. This should
            // cover most cases of formatting date/time related items.
            // Note: This optimization code assumes that maxDigits is
            // either 2 or Integer.MAX_VALUE (maxIntCount in format()).
            try {
                if (!_zeroDigit) {
                    _zeroDigit = _numberFormat.getDecimalFormatSymbols().getZeroDigit();
                }
                if (value >= 0) {
                    if (value < 100 && minDigits >= 1 && minDigits <= 2) {
                        if (value < 10) {
                            if (minDigits == 2) {
                                buffer += _zeroDigit.toString();
                            }
                            buffer += value.toString();
                        } else {
                            buffer += value.toString();
                        }
                        return buffer;
                    } else if (value >= 1e3 && value < 1e4) {
                        if (minDigits == 4) {
                            buffer += value.toString();
                            return buffer;
                        }
                        if (minDigits == 2 && maxDigits == 2) {
                            buffer = _zeroPaddingNumber(value % 100, 2, 2, buffer);
                            return buffer;
                        }
                    }
                }
            } catch (e) {}
            _numberFormat.setMinimumIntegerDigits(minDigits);
            _numberFormat.setMaximumIntegerDigits(maxDigits);
            buffer += _numberFormat.format(value);
            return buffer;
        };
        var _matchString = function(text, start, field, data, date) {
            var i = 0;
            var count = data.length;
            if (field == 7) i = 1;
            // There may be multiple strings in the data[] array which begin with
            // the same prefix (e.g., Cerven and Cervenec (June and July) in Czech).
            // We keep track of the longest match, and return that.  Note that this
            // unfortunately requires us to test all array elements.
            var bestMatchLength = 0, bestMatch = -1;
            for (;i < count; ++i) {
                var length = data[i].length;
                // Always compare if we have no match yet; otherwise only compare
                // against potentially better matches (longer strings).
                if (length > bestMatchLength && text.substr(start, length).search(new RegExp(data[i], "i")) > -1) {
                    bestMatch = i;
                    bestMatchLength = length;
                }
            }
            if (bestMatch >= 0) {
                CalendarHelper.setField(date, field, bestMatch);
                return start + bestMatchLength;
            }
            return -start;
        };
        var _subParseNumericZone = function(text, start, sign, count, colon) {
            var index = start;
            parse: try {
                var c = text.charAt(index++);
                // Parse hh
                var hours;
                if (!_isDigit(c)) {
                    break parse;
                }
                hours = parseInt(c, 10);
                c = text.charAt(index++);
                if (_isDigit(c)) {
                    hours = hours * 10 + parseInt(c, 10);
                } else {
                    // If no colon in RFC 822 or 'X' (ISO), two digits are
                    // required.
                    if (count > 0 || !colon) {
                        break parse;
                    }
                    --index;
                }
                if (hours > 23) {
                    break parse;
                }
                var minutes = 0;
                if (count != 1) {
                    // Proceed with parsing mm
                    c = text.charAt(index++);
                    if (colon) {
                        if (c != ":") {
                            break parse;
                        }
                        c = text.charAt(index++);
                    }
                    if (!_isDigit(c)) {
                        break parse;
                    }
                    minutes = parseInt(c, 10);
                    c = text.charAt(index++);
                    if (!_isDigit(c)) {
                        break parse;
                    }
                    minutes = minutes * 10 + parseInt(c, 10);
                    if (minutes > 59) {
                        break parse;
                    }
                }
                /*minutes += hours * 60;
                calb.set(Calendar.ZONE_OFFSET, minutes * MILLIS_PER_MINUTE * sign)
                    .set(Calendar.DST_OFFSET, 0);*/
                return index;
            } catch (e) {}
            return 1 - index;
        };
        var _isDigit = function(c) {
            return c >= "0" && c <= "9";
        };
        var _subParse = function(text, start, patternCharIndex, count, obeyCount, ambiguousYear, origPos, useFollowingMinusSignAsDelimiter, date) {
            var number = null;
            var value = 0;
            var pos = new ParsePosition(0);
            pos.index = start;
            /*if (patternCharIndex == DateFormatSymbols.PATTERN_WEEK_YEAR) {
                // use calendar year 'y' instead
                patternCharIndex = DateFormatSymbols.PATTERN_YEAR;
            }*/
            var field = _PATTERN_INDEX_TO_CALENDAR_FIELD[patternCharIndex];
            // If there are any spaces here, skip over them.  If we hit the end
            // of the string, then fail.
            for (;;) {
                if (pos.index >= text.length) {
                    origPos.errorIndex = start;
                    return -1;
                }
                var c = text.charAt(pos.index);
                if (c != " " && c != "\t") break;
                ++pos.index;
            }
            parsing: {
                // We handle a few special cases here where we need to parse
                // a number value.  We handle further, more generic cases below.  We need
                // to handle some of them here because some fields require extra processing on
                // the parsed value.
                if (patternCharIndex == DateFormatSymbols.PATTERN_HOUR_OF_DAY1 || patternCharIndex == DateFormatSymbols.PATTERN_HOUR1 || patternCharIndex == DateFormatSymbols.PATTERN_MONTH && count <= 2 || patternCharIndex == DateFormatSymbols.PATTERN_YEAR || patternCharIndex == DateFormatSymbols.PATTERN_WEEK_YEAR) {
                    // It would be good to unify this with the obeyCount logic below,
                    // but that's going to be difficult.
                    if (obeyCount) {
                        if (start + count > text.length) {
                            break parsing;
                        }
                        number = _numberFormat.parse(text.substring(0, start + count), pos);
                    } else {
                        number = _numberFormat.parse(text, pos);
                    }
                    if (number == null) {
                        if (patternCharIndex != DateFormatSymbols.PATTERN_YEAR) {
                            break parsing;
                        }
                    } else {
                        value = parseInt(number, 10);
                        if (useFollowingMinusSignAsDelimiter && value < 0 && (pos.index < text.length && text.charAt(pos.index) != _minusSign || pos.index == text.length && text.charAt(pos.index - 1) == _minusSign)) {
                            value = -value;
                            pos.index--;
                        }
                    }
                }
                var useDateFormatSymbols = true;
                var index;
                switch (patternCharIndex) {
                  case DateFormatSymbols.PATTERN_ERA:
                    // 'G'
                    if (useDateFormatSymbols) {
                        if ((index = _matchString(text, start, 0, _formatData.getEras(), date)) > 0) {
                            return index;
                        }
                    } else {}
                    break parsing;

                  case DateFormatSymbols.PATTERN_WEEK_YEAR:
                  // 'Y'
                    case DateFormatSymbols.PATTERN_YEAR:
                    // 'y'
                    /*if (!(calendar instanceof GregorianCalendar)) {
                            // calendar might have text representations for year values,
                            // such as "\u5143" in JapaneseImperialCalendar.
                            int style = (count >= 4) ? Calendar.LONG : Calendar.SHORT;
                            Map<String, Integer> map = calendar.getDisplayNames(field, style, locale);
                            if (map != null) {
                                if ((index = matchString(text, start, field, map, calb)) > 0) {
                                    return index;
                                }
                            }
                            calb.set(field, value);
                            return pos.index;
                        }*/
                    // If there are 3 or more YEAR pattern characters, this indicates
                    // that the year value is to be treated literally, without any
                    // two-digit year adjustments (e.g., from "01" to 2001).  Otherwise
                    // we made adjustments to place the 2-digit year in the proper
                    // century, for parsed strings from "00" to "99".  Any other string
                    // is treated literally:  "2250", "-1", "1", "002".
                    if (count <= 2 && pos.index - start == 2 && _isDigit(text.charAt(start)) && _isDigit(text.charAt(start + 1))) {
                        // Assume for example that the defaultCenturyStart is 6/18/1903.
                        // This means that two-digit years will be forced into the range
                        // 6/18/1903 to 6/17/2003.  As a result, years 00, 01, and 02
                        // correspond to 2000, 2001, and 2002.  Years 04, 05, etc. correspond
                        // to 1904, 1905, etc.  If the year is 03, then it is 2003 if the
                        // other fields specify a date before 6/18, or 1903 if they specify a
                        // date afterwards.  As a result, 03 is an ambiguous year.  All other
                        // two-digit years are unambiguous.
                        var ambiguousTwoDigitYear = _defaultCenturyStartYear % 100;
                        ambiguousYear[0] = value == ambiguousTwoDigitYear;
                        value += Math.floor(_defaultCenturyStartYear / 100) * 100 + (value < ambiguousTwoDigitYear ? 100 : 0);
                    }
                    date.setFullYear(value);
                    return pos.index;

                  case DateFormatSymbols.PATTERN_MONTH:
                    // 'M'
                    if (count <= 2) // i.e., M or MM.
                    {
                        // Don't want to parse the month if it is a string
                        // while pattern uses numeric style: M or MM.
                        // [We computed 'value' above.]
                        CalendarHelper.setField(date, 2, value - 1);
                        return pos.index;
                    }
                    if (useDateFormatSymbols) {
                        // count >= 3 // i.e., MMM or MMMM
                        // Want to be able to parse both short and long forms.
                        // Try count == 4 first:
                        var newStart = 0;
                        if ((newStart = _matchString(text, start, 2, _formatData.getMonths(), date)) > 0) {
                            return newStart;
                        }
                        // count == 4 failed, now try count == 3
                        if ((index = _matchString(text, start, 2, _formatData.getShortMonths(), date)) > 0) {
                            return index;
                        }
                    } else {}
                    break parsing;

                  case DateFormatSymbols.PATTERN_HOUR_OF_DAY1:
                    // 'k' 1-based.  eg, 23:59 + 1 hour =>> 24:59
                    /*if (!isLenient()) {
                            // Validate the hour value in non-lenient
                            if (value < 1 || value > 24) {
                                break parsing;
                            }
                        }*/
                    // [We computed 'value' above.]
                    if (value == 24) value = 0;
                    CalendarHelper.setField(date, 11, value);
                    return pos.index;

                  case DateFormatSymbols.PATTERN_DAY_OF_WEEK:
                    // 'E'
                    {
                        if (useDateFormatSymbols) {
                            // Want to be able to parse both short and long forms.
                            // Try count == 4 (DDDD) first:
                            var newStart = 0;
                            if ((newStart = _matchString(text, start, 7, _formatData.getWeekdays(), date)) > 0) {
                                return newStart;
                            }
                            // DDDD failed, now try DDD
                            if ((index = _matchString(text, start, 7, _formatData.getShortWeekdays(), date)) > 0) {
                                return index;
                            }
                        } else {}
                    }
                    break parsing;

                  case DateFormatSymbols.PATTERN_AM_PM:
                    // 'a'
                    if (useDateFormatSymbols) {
                        if ((index = _matchString(text, start, 9, _formatData.getAmPmStrings(), date)) > 0) {
                            return index;
                        }
                    } else {}
                    break parsing;

                  case DateFormatSymbols.PATTERN_HOUR1:
                    // 'h' 1-based.  eg, 11PM + 1 hour =>> 12 AM
                    /*if (!isLenient()) {
                            // Validate the hour value in non-lenient
                            if (value < 1 || value > 12) {
                                break parsing;
                            }
                        }*/
                    // [We computed 'value' above.]
                    if (value == 12) value = 0;
                    CalendarHelper.setField(date, 10, value);
                    return pos.index;

                  case DateFormatSymbols.PATTERN_ZONE_NAME:
                  // 'z'
                    case DateFormatSymbols.PATTERN_ZONE_VALUE:
                    // 'Z'
                    {
                        var sign = 0;
                        try {
                            var c = text.charAt(pos.index);
                            if (c == "+") {
                                sign = 1;
                            } else if (c == "-") {
                                sign = -1;
                            }
                            if (sign == 0) {
                                // Try parsing a custom time zone "GMT+hh:mm" or "GMT".
                                if ((c == "G" || c == "g") && text.length - start >= _GMT.length && text.substr(start, _GMT.length).search(new RegExp(_GMT, "i")) > -1) {
                                    pos.index = start + _GMT.length;
                                    if (text.length - pos.index > 0) {
                                        c = text.charAt(pos.index);
                                        if (c == "+") {
                                            sign = 1;
                                        } else if (c == "-") {
                                            sign = -1;
                                        }
                                    }
                                    if (sign == 0) {
                                        /* "GMT" without offset */
                                        /*calb.set(Calendar.ZONE_OFFSET, 0)
                                                .set(Calendar.DST_OFFSET, 0);*/
                                        return pos.index;
                                    }
                                    // Parse the rest as "hh:mm"
                                    var i = _subParseNumericZone(text, ++pos.index, sign, 0, true);
                                    if (i > 0) {
                                        return i;
                                    }
                                    pos.index = -i;
                                } else {}
                            } else {
                                // Parse the rest as "hhmm" (RFC 822)
                                var i = _subParseNumericZone(text, ++pos.index, sign, 0, false);
                                if (i > 0) {
                                    return i;
                                }
                                pos.index = -i;
                            }
                        } catch (e) {}
                    }
                    break parsing;

                  case DateFormatSymbols.PATTERN_ISO_ZONE:
                    // 'X'
                    {
                        if (text.length - pos.index <= 0) {
                            break parsing;
                        }
                        var sign = 0;
                        var c = text.charAt(pos.index);
                        if (c == "Z") {
                            // calb.set(Calendar.ZONE_OFFSET, 0).set(Calendar.DST_OFFSET, 0);
                            return ++pos.index;
                        }
                        // parse text as "+/-hh[[:]mm]" based on count
                        if (c == "+") {
                            sign = 1;
                        } else if (c == "-") {
                            sign = -1;
                        } else {
                            ++pos.index;
                            break parsing;
                        }
                        var i = _subParseNumericZone(text, ++pos.index, sign, count, count == 3);
                        if (i > 0) {
                            return i;
                        }
                        pos.index = -i;
                    }
                    break parsing;

                  default:
                    // case PATTERN_DAY_OF_MONTH:         // 'd'
                    // case PATTERN_HOUR_OF_DAY0:         // 'H' 0-based.  eg, 23:59 + 1 hour =>> 00:59
                    // case PATTERN_MINUTE:               // 'm'
                    // case PATTERN_SECOND:               // 's'
                    // case PATTERN_MILLISECOND:          // 'S'
                    // case PATTERN_DAY_OF_YEAR:          // 'D'
                    // case PATTERN_DAY_OF_WEEK_IN_MONTH: // 'F'
                    // case PATTERN_WEEK_OF_YEAR:         // 'w'
                    // case PATTERN_WEEK_OF_MONTH:        // 'W'
                    // case PATTERN_HOUR0:                // 'K' 0-based.  eg, 11PM + 1 hour =>> 0 AM
                    // case PATTERN_ISO_DAY_OF_WEEK:      // 'u' (pseudo field);
                    // Handle "generic" fields
                    if (obeyCount) {
                        if (start + count > text.length) {
                            break parsing;
                        }
                        number = _numberFormat.parse(text.substring(0, start + count), pos);
                    } else {
                        number = _numberFormat.parse(text, pos);
                    }
                    if (number != null) {
                        value = parseInt(number, 10);
                        if (useFollowingMinusSignAsDelimiter && value < 0 && (pos.index < text.length && text.charAt(pos.index) != _minusSign || pos.index == text.length && text.charAt(pos.index - 1) == _minusSign)) {
                            value = -value;
                            pos.index--;
                        }
                        CalendarHelper.setField(date, field, value);
                        return pos.index;
                    }
                    break parsing;
                }
            }
            // Parsing failed.
            origPos.errorIndex = pos.index;
            return -1;
        };
        var _translatePattern = function(pattern, from, to) {
            var result = "";
            var inQuote = false;
            for (var i = 0; i < pattern.length; ++i) {
                var c = pattern.charAt(i);
                if (inQuote) {
                    if (c == "'") inQuote = false;
                } else {
                    if (c == "'") inQuote = true; else if (c >= "a" && c <= "z" || c >= "A" && c <= "Z") {
                        var ci = from.indexOf(c);
                        if (ci >= 0) {
                            // patternChars is longer than localPatternChars due
                            // to serialization compatibility. The pattern letters
                            // unsupported by localPatternChars pass through.
                            if (ci < to.length) {
                                c = to.charAt(ci);
                            }
                        } else {
                            throw "Illegal pattern " + " character '" + c + "'";
                        }
                    }
                }
                result += c;
            }
            if (inQuote) throw "Unfinished quote in pattern";
            return result.toString();
        };
        var _checkNegativeNumberExpression = function() {
            if (_numberFormat instanceof DecimalFormat && _numberFormat !== _originalNumberFormat) {
                var numberPattern = _numberFormat.toPattern();
                if (numberPattern !== _originalNumberPattern) {
                    _hasFollowingMinusSign = false;
                    var separatorIndex = numberPattern.indexOf(";");
                    // If the negative subpattern is not absent, we have to analayze
                    // it in order to check if it has a following minus sign.
                    if (separatorIndex > -1) {
                        var minusIndex = numberPattern.indexOf("-", separatorIndex);
                        if (minusIndex > numberPattern.lastIndexOf("0") && minusIndex > numberPattern.lastIndexOf("#")) {
                            _hasFollowingMinusSign = true;
                            _minusSign = _numberFormat.getDecimalFormatSymbols().getMinusSign();
                        }
                    }
                    _originalNumberPattern = numberPattern;
                }
                _originalNumberFormat = _numberFormat;
            }
        };
        var _init = function() {
            if (arguments.length > 0 && arguments.length <= 2) {
                var pattern = arguments[0];
                if (arguments.length == 1) {
                    _locale = Locale.getDefault();
                    _formatData = new DateFormatSymbols(_locale);
                } else if (arguments.length == 2) {
                    var arg1 = arguments[1];
                    if (arg1 instanceof Locale) {
                        _locale = arg1;
                        _formatData = new DateFormatSymbols(_locale);
                    } else if (arg1 instanceof DateFormatSymbols) {
                        _formatData = arg1;
                        _locale = Locale.getDefault();
                        _useDateFormatSymbols = true;
                    }
                }
                _pattern = pattern;
                _initializeCalendar(_locale);
                _initialize(_locale);
            } else {
                var timeStyle = arguments.length > 0 && typeof arguments[0] != "undefined" ? arguments[0] : DateFormat.SHORT;
                var dateStyle = arguments.length > 0 && typeof arguments[1] != "undefined" ? arguments[1] : DateFormat.SHORT;
                var loc = arguments.length > 0 && typeof arguments[2] != "undefined" ? arguments[2] : Locale.getDefault();
                _locale = loc;
                // initialize calendar and related fields
                _initializeCalendar(loc);
                var r = ResourceBundle.getBundle("FormatData", loc);
                var dateTimePatterns = r["DateTimePatterns"];
                _formatData = new DateFormatSymbols(loc);
                if (timeStyle >= 0 && dateStyle >= 0) {
                    var dateTimeArgs = [ dateTimePatterns[timeStyle], dateTimePatterns[dateStyle + 4] ];
                    _pattern = MessageFormat.format(dateTimePatterns[8], dateTimeArgs);
                } else if (timeStyle >= 0) {
                    _pattern = dateTimePatterns[timeStyle];
                } else if (dateStyle >= 0) {
                    _pattern = dateTimePatterns[dateStyle + 4];
                } else {
                    throw "No date or time style specified";
                }
                _initialize(loc);
            }
        };
        this.setNumberFormat = function(newNumberFormat) {
            _numberFormat = newNumberFormat;
        };
        this.getNumberFormat = function() {
            return _numberFormat;
        };
        this.set2DigitYearStart = function(startDate) {
            _parseAmbiguousDatesAsAfter(new Date(startDate.getTime()));
        };
        this.get2DigitYearStart = function() {
            return new Date(_defaultCenturyStart.getTime());
        };
        this.format = function(date, toAppendTo, pos) {
            toAppendTo = typeof toAppendTo == "string" ? toAppendTo : "";
            pos = pos && pos instanceof FieldPosition ? pos : new FieldPosition(0);
            pos.beginIndex = pos.endIndex = 0;
            var delegate = pos.getFieldDelegate();
            // Convert input date to time field list
            _date = date;
            var useDateFormatSymbols = _useDateFormatSymbols || true;
            for (var i = 0; i < _compiledPattern.length; ) {
                var tag = _compiledPattern[i].charCodeAt(0) >>> 8;
                var count = _compiledPattern[i++].charCodeAt(0) & 255;
                if (count == 255) {
                    count = _compiledPattern[i++].charCodeAt(0) << 16;
                    count |= _compiledPattern[i++].charCodeAt(0);
                }
                switch (tag) {
                  case _TAG_QUOTE_ASCII_CHAR:
                    toAppendTo += String.fromCharCode(count);
                    break;

                  case _TAG_QUOTE_CHARS:
                    toAppendTo += _compiledPattern.slice(i, i + count).join("");
                    i += count;
                    break;

                  default:
                    toAppendTo = _subFormat(tag, count, delegate, toAppendTo, useDateFormatSymbols);
                    break;
                }
            }
            return toAppendTo;
        };
        this.parse = function(text, pos) {
            pos = pos || new ParsePosition(0);
            _checkNegativeNumberExpression();
            var start = pos.index;
            var oldStart = start;
            var textLength = text.length;
            var ambiguousYear = [ false ];
            var date = new Date(0);
            for (var i = 0; i < _compiledPattern.length; ) {
                var tag = _compiledPattern[i].charCodeAt(0) >>> 8;
                var count = _compiledPattern[i++].charCodeAt(0) & 255;
                if (count == 255) {
                    count = _compiledPattern[i++].charCodeAt(0) << 16;
                    count |= _compiledPattern[i++].charCodeAt(0);
                }
                switch (tag) {
                  case _TAG_QUOTE_ASCII_CHAR:
                    if (start >= textLength || text.charAt(start) != String.fromCharCode(count)) {
                        pos.index = oldStart;
                        pos.errorIndex = start;
                        return null;
                    }
                    start++;
                    break;

                  case _TAG_QUOTE_CHARS:
                    while (count-- > 0) {
                        if (start >= textLength || text.charAt(start) != _compiledPattern[i++]) {
                            pos.index = oldStart;
                            pos.errorIndex = start;
                            return null;
                        }
                        start++;
                    }
                    break;

                  default:
                    // Peek the next pattern to determine if we need to
                    // obey the number of pattern letters for
                    // parsing. It's required when parsing contiguous
                    // digit text (e.g., "20010704") with a pattern which
                    // has no delimiters between fields, like "yyyyMMdd".
                    var obeyCount = false;
                    // In Arabic, a minus sign for a negative number is put after
                    // the number. Even in another locale, a minus sign can be
                    // put after a number using DateFormat.setNumberFormat().
                    // If both the minus sign and the field-delimiter are '-',
                    // subParse() needs to determine whether a '-' after a number
                    // in the given text is a delimiter or is a minus sign for the
                    // preceding number. We give subParse() a clue based on the
                    // information in compiledPattern.
                    var useFollowingMinusSignAsDelimiter = false;
                    if (i < _compiledPattern.length) {
                        var nextTag = _compiledPattern[i].charCodeAt(0) >>> 8;
                        if (!(nextTag == _TAG_QUOTE_ASCII_CHAR || nextTag == _TAG_QUOTE_CHARS)) {
                            obeyCount = true;
                        }
                        if (_hasFollowingMinusSign && (nextTag == _TAG_QUOTE_ASCII_CHAR || nextTag == _TAG_QUOTE_CHARS)) {
                            var c;
                            if (nextTag == _TAG_QUOTE_ASCII_CHAR) {
                                c = _compiledPattern[i].charCodeAt(0) & 255;
                            } else {
                                c = _compiledPattern[i + 1].charCodeAt(0);
                            }
                            if (String.fromCharCode(c) == _minusSign) {
                                useFollowingMinusSignAsDelimiter = true;
                            }
                        }
                    }
                    start = _subParse(text, start, tag, count, obeyCount, ambiguousYear, pos, useFollowingMinusSignAsDelimiter, date);
                    if (start < 0) {
                        pos.index = oldStart;
                        return null;
                    }
                }
            }
            // At this point the fields of Calendar have been set.  Calendar
            // will fill in default values for missing fields when the time
            // is computed.
            pos.index = start;
            var parsedDate;
            try {
                parsedDate = new Date(date.getTime());
                // If the year value is ambiguous,
                // then the two-digit year == the default start year
                if (ambiguousYear[0]) {
                    if (parsedDate.getTime() < _defaultCenturyStart.getTime()) {
                        parsedDate.setFullYear(date.getFullYear() + 100);
                    }
                }
            } // An IllegalArgumentException will be thrown by Calendar.getTime()
            // if any fields are out of range, e.g., MONTH == 17.
            catch (e) {
                pos.errorIndex = start;
                pos.index = oldStart;
                return null;
            }
            return parsedDate;
        };
        this.toPattern = function() {
            return _pattern;
        };
        this.toLocalizedPattern = function() {
            return _translatePattern(_pattern, DateFormatSymbols.patternChars, _formatData.getLocalPatternChars());
        };
        this.applyPattern = function(pattern) {
            _compiledPattern = _compile(pattern);
            _pattern = pattern;
        };
        this.applyLocalizedPattern = function(pattern) {
            var p = _translatePattern(_pattern, DateFormatSymbols.patternChars, _formatData.getLocalPatternChars());
            _compiledPattern = _compile(p);
            _pattern = p;
        };
        this.getDateFormatSymbols = function() {
            return _formatData;
        };
        this.setDateFormatSymbols = function(newFormatSymbols) {
            _formatData = newFormatSymbols;
            _useDateFormatSymbols = true;
        };
        _init.apply(this, arguments);
    }
    var _TAG_QUOTE_ASCII_CHAR = 100;
    var _TAG_QUOTE_CHARS = 101;
    var _MILLIS_PER_MINUTE = 60 * 1e3;
    var _GMT = "GMT";
    // Map index into pattern character string to Calendar field number
    // Calendar.ERA,
    // Calendar.YEAR,
    // Calendar.MONTH,
    // Calendar.DATE,
    // Calendar.HOUR_OF_DAY,
    // Calendar.HOUR_OF_DAY,
    // Calendar.MINUTE,
    // Calendar.SECOND,
    // Calendar.MILLISECOND,
    // Calendar.DAY_OF_WEEK,
    // Calendar.DAY_OF_YEAR,
    // Calendar.DAY_OF_WEEK_IN_MONTH,
    // Calendar.WEEK_OF_YEAR,
    // Calendar.WEEK_OF_MONTH,
    // Calendar.AM_PM,
    // Calendar.HOUR,
    // Calendar.HOUR,
    // Calendar.ZONE_OFFSET,
    // Calendar.ZONE_OFFSET,
    // CalendarBuilder.WEEK_YEAR,
    // CalendarBuilder.ISO_DAY_OF_WEEK,
    // Calendar.ZONE_OFFSET
    var _PATTERN_INDEX_TO_CALENDAR_FIELD = [ 0, 1, 2, 5, 11, 11, 12, 13, 14, 7, 6, 8, 3, 4, 9, 10, 10, 15, 15, 17, 1e3, 15 ];
    // Map index into pattern character string to DateFormat field number
    var _PATTERN_INDEX_TO_DATE_FORMAT_FIELD = [ DateFormat.ERA_FIELD, DateFormat.YEAR_FIELD, DateFormat.MONTH_FIELD, DateFormat.DATE_FIELD, DateFormat.HOUR_OF_DAY1_FIELD, DateFormat.HOUR_OF_DAY0_FIELD, DateFormat.MINUTE_FIELD, DateFormat.SECOND_FIELD, DateFormat.MILLISECOND_FIELD, DateFormat.DAY_OF_WEEK_FIELD, DateFormat.DAY_OF_YEAR_FIELD, DateFormat.DAY_OF_WEEK_IN_MONTH_FIELD, DateFormat.WEEK_OF_YEAR_FIELD, DateFormat.WEEK_OF_MONTH_FIELD, DateFormat.AM_PM_FIELD, DateFormat.HOUR1_FIELD, DateFormat.HOUR0_FIELD, DateFormat.TIMEZONE_FIELD, DateFormat.TIMEZONE_FIELD, DateFormat.YEAR_FIELD, DateFormat.DAY_OF_WEEK_FIELD, DateFormat.TIMEZONE_FIELD ];
    // Maps from DateFormatSymbols index to Field constant
    var _PATTERN_INDEX_TO_DATE_FORMAT_FIELD_ID = [ DateFormat.Field.ERA, DateFormat.Field.YEAR, DateFormat.Field.MONTH, DateFormat.Field.DAY_OF_MONTH, DateFormat.Field.HOUR_OF_DAY1, DateFormat.Field.HOUR_OF_DAY0, DateFormat.Field.MINUTE, DateFormat.Field.SECOND, DateFormat.Field.MILLISECOND, DateFormat.Field.DAY_OF_WEEK, DateFormat.Field.DAY_OF_YEAR, DateFormat.Field.DAY_OF_WEEK_IN_MONTH, DateFormat.Field.WEEK_OF_YEAR, DateFormat.Field.WEEK_OF_MONTH, DateFormat.Field.AM_PM, DateFormat.Field.HOUR1, DateFormat.Field.HOUR0, DateFormat.Field.TIME_ZONE, DateFormat.Field.TIME_ZONE, DateFormat.Field.YEAR, DateFormat.Field.DAY_OF_WEEK, DateFormat.Field.TIME_ZONE ];
    var _encode = function(tag, length, buffer) {
        if (tag == DateFormat.PATTERN_ISO_ZONE && length >= 4) {
            throw "invalid ISO 8601 format: length=" + length;
        }
        if (length < 255) {
            buffer += String.fromCharCode(tag << 8 | length);
        } else {
            buffer += String.fromCharCode(tag << 8 | 255);
            buffer += String.fromCharCode(length >>> 16);
            buffer += String.fromCharCode(length & 65535);
        }
        return buffer;
    };
    SimpleDateFormat.prototype = Object.create(DateFormat.prototype);
    SimpleDateFormat.prototype.constructor = SimpleDateFormat;
    SimpleDateFormat.prototype.equals = function(that) {
        if (!DateFormat.equals.apply(this, [ that ])) return false;
        // super does class check
        if (!(that instanceof SimpleDateFormat)) return false;
        return this.toPattern() == that.toPattern() && this.getNumberFormat().equals(that.getNumberFormat());
    };
    global.SimpleDateFormat = SimpleDateFormat;
    return SimpleDateFormat;
});

(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        exports["MessageFormat"] = module.exports = factory(global);
    } else {
        factory(global);
    }
})(this, function(global) {
    var MessageFormat = function MessageFormat(pattern) {
        Format.call(this);
        var _this = this;
        var _locale;
        var _pattern;
        var _formats = new Array(_INITIAL_FORMATS);
        var _offsets = new Array(_INITIAL_FORMATS);
        var _argumentNumbers = new Array(_INITIAL_FORMATS);
        var _maxOffset = -1;
        var _makeFormat = function(position, offsetNumber, textSegments) {
            var segments = new Array(textSegments.length);
            for (var i = 0; i < textSegments.length; i++) {
                var oneseg = textSegments[i];
                segments[i] = oneseg ? oneseg.toString() : "";
            }
            // get the argument number
            var argumentNumber;
            try {
                argumentNumber = parseInt(segments[_SEG_INDEX], 10);
            } catch (e) {
                throw "can't parse argument number: " + segments[_SEG_INDEX];
            }
            if (argumentNumber < 0) {
                throw "negative argument number: " + argumentNumber;
            }
            // resize format information arrays if necessary
            if (offsetNumber >= _formats.length) {
                var newLength = _formats.length * 2;
                var newFormats = _formats.slice(0, _maxOffset + 1).concat(new Array(newLength - (_maxOffset + 1)));
                var newOffsets = _offsets.slice(0, _maxOffset + 1).concat(new Array(newLength - (_maxOffset + 1)));
                var newArgumentNumbers = _argumentNumbers.slice(0, _maxOffset + 1).concat(new Array(newLength - (_maxOffset + 1)));
                _formats = newFormats;
                _offsets = newOffsets;
                _argumentNumbers = newArgumentNumbers;
            }
            var oldMaxOffset = _maxOffset;
            _maxOffset = offsetNumber;
            _offsets[offsetNumber] = segments[_SEG_RAW].length;
            _argumentNumbers[offsetNumber] = argumentNumber;
            // now get the format
            var newFormat = null;
            if (segments[_SEG_TYPE].length != 0) {
                var type = _findKeyword(segments[_SEG_TYPE], _TYPE_KEYWORDS);
                switch (type) {
                  case _TYPE_NULL:
                    // Type "" is allowed. e.g., "{0,}", "{0,,}", and "{0,,#}"
                    // are treated as "{0}".
                    break;

                  case _TYPE_NUMBER:
                    switch (_findKeyword(segments[_SEG_MODIFIER], _NUMBER_MODIFIER_KEYWORDS)) {
                      case _MODIFIER_DEFAULT:
                        newFormat = NumberFormat.getInstance(_locale);
                        break;

                      case _MODIFIER_CURRENCY:
                        newFormat = NumberFormat.getCurrencyInstance(_locale);
                        break;

                      case _MODIFIER_PERCENT:
                        newFormat = NumberFormat.getPercentInstance(_locale);
                        break;

                      case _MODIFIER_INTEGER:
                        newFormat = NumberFormat.getIntegerInstance(_locale);
                        break;

                      default:
                        // DecimalFormat pattern
                        try {
                            newFormat = new DecimalFormat(segments[_SEG_MODIFIER], DecimalFormatSymbols.getInstance(_locale));
                        } catch (e) {
                            _maxOffset = oldMaxOffset;
                            throw e;
                        }
                        break;
                    }
                    break;

                  case _TYPE_DATE:
                  case _TYPE_TIME:
                    var mod = _findKeyword(segments[_SEG_MODIFIER], _DATE_TIME_MODIFIER_KEYWORDS);
                    if (mod >= 0 && mod < _DATE_TIME_MODIFIER_KEYWORDS.length) {
                        if (type == _TYPE_DATE) {
                            newFormat = DateFormat.getDateInstance(_DATE_TIME_MODIFIERS[mod], _locale);
                        } else {
                            newFormat = DateFormat.getTimeInstance(_DATE_TIME_MODIFIERS[mod], _locale);
                        }
                    } else {
                        // SimpleDateFormat pattern
                        try {
                            newFormat = new SimpleDateFormat(segments[_SEG_MODIFIER], _locale);
                        } catch (e) {
                            _maxOffset = oldMaxOffset;
                            throw e;
                        }
                    }
                    break;

                  case _TYPE_CHOICE:
                    try {
                        // ChoiceFormat pattern
                        newFormat = new ChoiceFormat(segments[_SEG_MODIFIER]);
                    } catch (e) {
                        _maxOffset = oldMaxOffset;
                        throw "Choice Pattern incorrect: " + segments[_SEG_MODIFIER];
                    }
                    break;

                  default:
                    _maxOffset = oldMaxOffset;
                    throw "unknown format type: " + segments[_SEG_TYPE];
                }
            }
            _formats[offsetNumber] = newFormat;
        };
        var _subformat = function(arguments, result, fp) {
            fp = fp && fp instanceof FieldPosition ? fp : new FieldPosition(0);
            // note: this implementation assumes a fast substring & index.
            // if this is not true, would be better to append chars one by one.
            var lastOffset = 0;
            var last = result.length;
            for (var i = 0; i <= _maxOffset; ++i) {
                result += _pattern.substring(lastOffset, _offsets[i]);
                lastOffset = _offsets[i];
                var argumentNumber = _argumentNumbers[i];
                if (!arguments || argumentNumber >= arguments.length) {
                    result += "{" + argumentNumber + "}";
                    continue;
                }
                // int argRecursion = ((recursionProtection >> (argumentNumber*2)) & 0x3);
                if (false) {
                    // if (argRecursion == 3){
                    // prevent loop!!!
                    result += "\ufffd";
                } else {
                    var obj = arguments[argumentNumber];
                    var arg = null;
                    var subFormatter = null;
                    if (obj == null || obj == undefined) {
                        arg = "null";
                    } else if (_formats[i]) {
                        subFormatter = _formats[i];
                        if (subFormatter instanceof ChoiceFormat) {
                            arg = _formats[i].format(obj);
                            if (arg.indexOf("{") >= 0) {
                                subFormatter = new MessageFormat(arg, _locale);
                                obj = arguments;
                                arg = null;
                            }
                        }
                    } else if (obj instanceof Number) {
                        // format number if can
                        subFormatter = NumberFormat.getInstance(_locale);
                    } else if (obj instanceof Date) {
                        // format a Date if can
                        subFormatter = DateFormat.getDateTimeInstance(DateFormat.SHORT, DateFormat.SHORT, _locale);
                    } else if (obj instanceof String) {
                        arg = obj;
                    } else {
                        arg = obj.toString();
                        if (arg == null) arg = "null";
                    }
                    // At this point we are in two states, either subFormatter
                    // is non-null indicating we should format obj using it,
                    // or arg is non-null and we should use it as the value.
                    if (subFormatter) {
                        arg = subFormatter.format(obj);
                    }
                    last = result.length;
                    result += arg;
                    if (i == 0 && fp != null && MessageFormat.Field.ARGUMENT == fp.attribute) {
                        fp.beginIndex = last;
                        fp.endIndex = result.length;
                    }
                    last = result.length;
                }
            }
            result += _pattern.substring(lastOffset, _pattern.length);
            return result;
        };
        var _init = function(pattern) {
            _locale = arguments.length > 1 ? arguments[1] : Locale.getDefault();
            _this.applyPattern(pattern);
        };
        this.applyPattern = function(pattern) {
            var segments = new Array(4);
            // Allocate only segments[SEG_RAW] here. The rest are
            // allocated on demand.
            segments[_SEG_RAW] = "";
            var part = _SEG_RAW;
            var formatNumber = 0;
            var inQuote = false;
            var braceStack = 0;
            _maxOffset = -1;
            for (var i = 0; i < pattern.length; ++i) {
                var ch = pattern.charAt(i);
                if (part == _SEG_RAW) {
                    if (ch == "'") {
                        if (i + 1 < pattern.length && pattern.charAt(i + 1) == "'") {
                            segments[part] += ch;
                            // handle doubles
                            ++i;
                        } else {
                            inQuote = !inQuote;
                        }
                    } else if (ch == "{" && !inQuote) {
                        part = _SEG_INDEX;
                        if (segments[_SEG_INDEX] == undefined) {
                            segments[_SEG_INDEX] = "";
                        }
                    } else {
                        segments[part] += ch;
                    }
                } else {
                    if (inQuote) {
                        // just copy quotes in parts
                        segments[part] += ch;
                        if (ch == "'") {
                            inQuote = false;
                        }
                    } else {
                        switch (ch) {
                          case ",":
                            if (part < _SEG_MODIFIER) {
                                if (segments[++part] == undefined) {
                                    segments[part] = "";
                                }
                            } else {
                                segments[part] += ch;
                            }
                            break;

                          case "{":
                            ++braceStack;
                            segments[part] += ch;
                            break;

                          case "}":
                            if (braceStack == 0) {
                                part = _SEG_RAW;
                                _makeFormat(i, formatNumber, segments);
                                formatNumber++;
                                // throw away other segments
                                segments[_SEG_INDEX] = null;
                                segments[_SEG_TYPE] = null;
                                segments[_SEG_MODIFIER] = null;
                            } else {
                                --braceStack;
                                segments[part] += ch;
                            }
                            break;

                          case " ":
                            // Skip any leading space chars for SEG_TYPE.
                            if (part != _SEG_TYPE || segments[_SEG_TYPE].length > 0) {
                                segments[part] += ch;
                            }
                            break;

                          case "'":
                            inQuote = true;

                          // fall through, so we keep quotes in other parts
                            default:
                            segments[part] += ch;
                            break;
                        }
                    }
                }
            }
            if (braceStack == 0 && part != 0) {
                _maxOffset = -1;
                throw "Unmatched braces in the pattern.";
            }
            _pattern = segments[0].toString();
        };
        this.toPattern = function() {
            // later, make this more extensible
            var lastOffset = 0;
            var result = "";
            for (var i = 0; i <= _maxOffset; ++i) {
                result = _copyAndFixQuotes(_pattern, lastOffset, _offsets[i], result);
                lastOffset = _offsets[i];
                result += "{" + _argumentNumbers[i];
                var fmt = _formats[i];
                if (!fmt) {} else if (fmt instanceof NumberFormat) {
                    if (fmt.equals(NumberFormat.getInstance(_locale))) {
                        result += ",number";
                    } else if (fmt.equals(NumberFormat.getCurrencyInstance(_locale))) {
                        result += ",number,currency";
                    } else if (fmt.equals(NumberFormat.getPercentInstance(_locale))) {
                        result += ",number,percent";
                    } else if (fmt.equals(NumberFormat.getIntegerInstance(_locale))) {
                        result += ",number,integer";
                    } else {
                        if (fmt instanceof DecimalFormat) {
                            result += ",number," + fmt.toPattern();
                        } else if (fmt instanceof ChoiceFormat) {
                            result += ",choice," + fmt.toPattern();
                        } else {}
                    }
                } else if (fmt instanceof DateFormat) {
                    var index;
                    for (index = _MODIFIER_DEFAULT; index < _DATE_TIME_MODIFIERS.length; index++) {
                        var df = DateFormat.getDateInstance(_DATE_TIME_MODIFIERS[index], _locale);
                        if (fmt.equals(df)) {
                            result += ",date";
                            break;
                        }
                        df = DateFormat.getTimeInstance(_DATE_TIME_MODIFIERS[index], _locale);
                        if (fmt.equals(df)) {
                            result += ",time";
                            break;
                        }
                    }
                    if (index >= _DATE_TIME_MODIFIERS.length) {
                        if (fmt instanceof SimpleDateFormat) {
                            result += ",date," + fmt.toPattern();
                        } else {}
                    } else if (index != _MODIFIER_DEFAULT) {
                        result += "," + _DATE_TIME_MODIFIER_KEYWORDS[index];
                    }
                } else {}
                result += "}";
            }
            result = _copyAndFixQuotes(_pattern, lastOffset, _pattern.length, result);
            return result.toString();
        };
        this.setLocale = function(locale) {
            _locale = locale;
        };
        this.getLocale = function() {
            return _locale;
        };
        this.setFormatsByArgumentIndex = function(newFormats) {
            for (var i = 0; i <= _maxOffset; i++) {
                var j = _argumentNumbers[i];
                if (j < newFormats.length) {
                    _formats[i] = newFormats[j];
                }
            }
        };
        this.setFormats = function(newFormats) {
            var runsToCopy = newFormats.length;
            if (runsToCopy > _maxOffset + 1) {
                runsToCopy = _maxOffset + 1;
            }
            for (var i = 0; i < runsToCopy; i++) {
                _formats[i] = newFormats[i];
            }
        };
        this.setFormatByArgumentIndex = function(argumentIndex, newFormat) {
            for (var j = 0; j <= _maxOffset; j++) {
                if (_argumentNumbers[j] == argumentIndex) {
                    _formats[j] = newFormat;
                }
            }
        };
        this.setFormat = function(formatElementIndex, newFormat) {
            _formats[formatElementIndex] = newFormat;
        };
        this.getFormatsByArgumentIndex = function() {
            var maximumArgumentNumber = -1;
            var i;
            for (i = 0; i <= _maxOffset; i++) {
                if (_argumentNumbers[i] > maximumArgumentNumber) {
                    maximumArgumentNumber = _argumentNumbers[i];
                }
            }
            var resultArray = new Array(_maxOffset + 1);
            for (i = 0; i <= _maxOffset; i++) {
                resultArray[_argumentNumbers[i]] = _formats[i];
            }
            return resultArray;
        };
        this.getFormats = function() {
            return _formats.slice(0, _maxOffset + 1);
        };
        this.format = function(arguments, result) {
            return _subformat(arguments, result || "");
        };
        this.parse = function(source, pos) {
            pos = pos || new ParsePosition(0);
            if (source == null || source == undefined) {
                var empty = [];
                return empty;
            }
            var i;
            var len;
            var maximumArgumentNumber = -1;
            for (i = 0; i <= _maxOffset; i++) {
                if (_argumentNumbers[i] > maximumArgumentNumber) {
                    maximumArgumentNumber = _argumentNumbers[i];
                }
            }
            var resultArray = new Array(maximumArgumentNumber + 1);
            var patternOffset = 0;
            var sourceOffset = pos.index;
            var tempStatus = new ParsePosition(0);
            for (i = 0; i <= _maxOffset; ++i) {
                // match up to format
                len = _offsets[i] - patternOffset;
                if (len == 0 || pattern.substr(patternOffset, len).search(source.substring(sourceOffset)) > -1) {
                    sourceOffset += len;
                    patternOffset += len;
                } else {
                    pos.errorIndex = sourceOffset;
                    return null;
                }
                // now use format
                if (_formats[i] == null) {
                    // string format
                    // if at end, use longest possible match
                    // otherwise uses first match to intervening string
                    // does NOT recursively try all possibilities
                    var tempLength = i != _maxOffset ? _offsets[i + 1] : pattern.length;
                    var next;
                    if (patternOffset >= tempLength) {
                        next = source.length;
                    } else {
                        next = source.indexOf(pattern.substring(patternOffset, tempLength), sourceOffset);
                    }
                    if (next < 0) {
                        pos.errorIndex = sourceOffset;
                        return null;
                    } else {
                        var strValue = source.substring(sourceOffset, next);
                        if (!strValue.equals("{" + _argumentNumbers[i] + "}")) resultArray[_argumentNumbers[i]] = source.substring(sourceOffset, next);
                        sourceOffset = next;
                    }
                } else {
                    tempStatus.index = sourceOffset;
                    resultArray[_argumentNumbers[i]] = _formats[i].parse(source, tempStatus);
                    if (tempStatus.index == sourceOffset) {
                        pos.errorIndex = sourceOffset;
                        return null;
                    }
                    sourceOffset = tempStatus.index;
                }
            }
            len = pattern.length - patternOffset;
            if (len == 0 || pattern.substr(patternOffset, len).search(source.substring(sourceOffset)) > -1) {
                pos.index = sourceOffset + len;
            } else {
                pos.errorIndex = sourceOffset;
                return null;
            }
            return resultArray;
        };
        _init.apply(this, Array.prototype.slice.call(arguments));
    };
    var _INITIAL_FORMATS = 10;
    // Indices for segments
    var _SEG_RAW = 0;
    var _SEG_INDEX = 1;
    var _SEG_TYPE = 2;
    var _SEG_MODIFIER = 3;
    // modifier or subformat
    // Indices for type keywords
    var _TYPE_NULL = 0;
    var _TYPE_NUMBER = 1;
    var _TYPE_DATE = 2;
    var _TYPE_TIME = 3;
    var _TYPE_CHOICE = 4;
    var _TYPE_KEYWORDS = [ "", "number", "date", "time", "choice" ];
    // Indices for number modifiers
    var _MODIFIER_DEFAULT = 0;
    // common in number and date-time
    var _MODIFIER_CURRENCY = 1;
    var _MODIFIER_PERCENT = 2;
    var _MODIFIER_INTEGER = 3;
    var _NUMBER_MODIFIER_KEYWORDS = [ "", "currency", "percent", "integer" ];
    // Indices for date-time modifiers
    var _MODIFIER_SHORT = 1;
    var _MODIFIER_MEDIUM = 2;
    var _MODIFIER_LONG = 3;
    var _MODIFIER_FULL = 4;
    var _DATE_TIME_MODIFIER_KEYWORDS = [ "", "short", "medium", "long", "full" ];
    // Date-time style values corresponding to the date-time modifiers.
    var _DATE_TIME_MODIFIERS = [ DateFormat.DEFAULT, DateFormat.SHORT, DateFormat.MEDIUM, DateFormat.LONG, DateFormat.FULL ];
    var _findKeyword = function(s, list) {
        var i;
        for (i = 0; i < list.length; ++i) {
            if (s === list[i]) return i;
        }
        // Try trimmed lowercase.
        var ls = s.trim().toLowerCase();
        if (ls != s) {
            for (i = 0; i < list.length; ++i) {
                if (ls === list[i]) return i;
            }
        }
        return -1;
    };
    var _copyAndFixQuotes = function(source, start, end, target) {
        var quoted = false;
        for (var i = start; i < end; ++i) {
            var ch = source.charAt(i);
            if (ch == "{") {
                if (!quoted) {
                    target += "'";
                    quoted = true;
                }
                target += ch;
            } else if (ch == "'") {
                target += "''";
            } else {
                if (quoted) {
                    target += "'";
                    quoted = false;
                }
                target += ch;
            }
        }
        if (quoted) {
            target += "'";
        }
        return target;
    };
    MessageFormat.format = function(pattern) {
        var fmt = new MessageFormat(pattern);
        var args = Array.prototype.slice.call(arguments, 1);
        if (args.length == 1 && Array.isArray(args[0])) {
            args = args[0];
        }
        return fmt.format(args);
    };
    MessageFormat.prototype = Object.create(Format.prototype);
    MessageFormat.prototype.constructor = MessageFormat;
    MessageFormat.Field = function Field(name) {
        Format.Field.call(this, name);
    };
    MessageFormat.Field.prototype = Object.create(Format.Field.prototype);
    MessageFormat.Field.prototype.constructor = MessageFormat.Field;
    MessageFormat.Field.ARGUMENT = new MessageFormat.Field("message argument field");
    global.MessageFormat = MessageFormat;
    return MessageFormat;
});