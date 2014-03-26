YUI.add('gallery-list-format', function (Y, NAME) {

var MODULE_NAME = "gallery-list-format",
    ListFormatter;

/**
 * ListFormatter formats lists with locale dependent rules.
 * For example, in locale en, lists are formatted into a
 * string of comma-separated values
 * @class ListFormatter
 * @namespace Intl
 * @static
 */
ListFormatter = {
    /**
     * Substitute items into corrrect positions in pattern
     * For internal use only
     * @method __sub
     * @private
     * @static
     * @param pattern {String} The pattern
     * @param item0 {String} item to replace {0} in pattern
     * @param item1 {String} item to replace {1} in pattern
     * @return {String} Result string after substitutions
     */
    __sub: function(pattern, item0, item1) {
         return pattern.replace("{0}", item0).replace("{1}", item1);
    },

    /**
     * Format list into string
     * @method format
     * @static
     * @param list {Array} The list to be formatted
     * @return {String} formatted result
     */
    format: function(list) {
         if(!Y.Lang.isArray(list)) { return ""; }
        
         var localeData = Y.Intl.get(MODULE_NAME),
             middle = localeData.listPatternMiddle || "{0}, {1}",
             start = localeData.listPatternStart || middle,
             end = localeData.listPatternEnd,
             two = localeData.listPatternTwo || end,
             len = list.length,
             result, i;

         if(len === 0) { return ""; }
         if(len === 1) { return list[0]; }
         if(len === 2) {
             return ListFormatter.__sub(two, list[0], list[1]);
         }

         result = ListFormatter.__sub(start, list[0], list[1]);
         for(i=2; i<len-1; i++) {
              result = ListFormatter.__sub(middle, result, list[i]);
         }
         result = ListFormatter.__sub(end, result, list[i]);

         return result;
    }
};

Y.Intl.ListFormatter = ListFormatter;


}, 'gallery-2013.04.17-18-52', {
    "lang": [
        "af",
        "am",
        "ar",
        "as",
        "az",
        "be",
        "bg",
        "bn",
        "bo",
        "ca",
        "cs",
        "cy",
        "da",
        "de",
        "el",
        "eo",
        "es",
        "et",
        "eu",
        "fa",
        "fi",
        "fil",
        "fo",
        "fr",
        "ga",
        "gl",
        "gsw",
        "gu",
        "gv",
        "ha",
        "haw",
        "he",
        "hi",
        "hr",
        "hu",
        "hy",
        "id",
        "ii",
        "in",
        "is",
        "it",
        "iw",
        "ja",
        "",
        "ka",
        "kk",
        "kl",
        "km",
        "kn",
        "ko",
        "kok",
        "kw",
        "lt",
        "lv",
        "mk",
        "ml",
        "mr",
        "ms",
        "mt",
        "nb",
        "ne",
        "nl",
        "nn",
        "no",
        "om",
        "or",
        "pa",
        "pl",
        "ps",
        "pt",
        "ro",
        "ru",
        "sh",
        "si",
        "sk",
        "sl",
        "so",
        "sq",
        "sr",
        "sr-Latn",
        "sr-ME",
        "sv",
        "sw",
        "ta",
        "te",
        "th",
        "ti",
        "tl",
        "tr",
        "uk",
        "ur",
        "uz",
        "vi",
        "zh",
        "zu"
    ]
});
