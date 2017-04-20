/**
 Author: Mahdi Jaberzadeh Ansari
 Email: mahdijaberzadehansari@yahoo.co.uk
 Library: FarsiGradJS
 Description: By using this library you can create gradient colored text in Persian (Farsi) or Arabic sentences.
 Licence: MIT Licence
 Version 1.0.5
 Date: 22 Sep 2016
 call this method like this:
 var html = FarsiGradientText(str, '#00FF00', '#FFFFFF', '#FF0000');
 Please note the number of colors are not limited in this new version and also you have to pass colors as text but with
 #(Sharp) character to specify that this color is a hex number.
 */
// JavaScript Document
var FarsiGradientText = function(Text){
    "use strict";
    var flagJump = false;
    var colors = new Array();
    for (var i = 1; i < arguments.length; i++) {
        colors[i - 1] = arguments[i];
    }
    var PrintableChar = function (str, index) {
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function (obj, start) {
                for (var i = (start || 0), j = this.length; i < j; i++) {
                    if (this[i] === obj) {
                        return i;
                    }
                }
                return -1;
            }
        }
        var NoneCountinuesLetters = new Array('\u0622'/*آ*/, '\u0627'/*ا*/, '\u0671'/*ٱ*/, '\u0623'/*أ*/, '\u0625'/*إ*/, '\u0624'/*ؤ*/, '\u0621'/*ء*/,
            '\u062F'/*د*/, '\u0630'/*ذ*/,
            '\u0631'/*ر*/, '\u0632'/*ز*/, '\u0698'/*ژ*/,
            '\u0648'/*و*/
        );
        var FaAlefLetters = new Array('\u0622'/*آ*/, '\u0627'/*ا*/, '\u0623'/*أ*/, '\u0625'/*إ*/);
        var WhiteSpaces = new Array('\u200C'/*ZWNJ*/, '\u0020'/*Space*/, '\u00A0'/*No-break space*/, '\u0009'/*Character tabulation*/, '\u000A'/*Line feed (lf)*/, '\u000B'/*Line tabulation*/, '\u000D'/*Carriage return (cr)*/);
        var FaSigns = new Array('\u064B'/*(ـً)*/ /*تنوين نصب*/, '\u064C'/*(ـٌ)*/ /*تنوين رفع*/, '\u064D'/*(ـٍ)*/ /*تنوين جر*/, '\u064E'/*(ـَ)*/ /*فتحه*/, '\u064F'/*(ـُ)*/ /*ضمه*/, '\u0650'/*(ـِ)*/ /*كسره*/, '\u0651'/*(ـّ)*/ /*تشديد*/, '\u0652'/*(ـْ)*/ /*ساكن*/);
        var FaRealLetters = new Array('\u0622'/*آ*/, '\u0627'/*ا*/, '\u0671'/*ٱ*/, '\u0623'/*أ*/, '\u0625'/*إ*/, '\u0624'/*ؤ*/, '\u0626'/*ئ*/,
            '\u0628'/*ب*/, '\u067E'/*پ*/, '\u062A'/*ت*/, '\u062B'/*ث*/,
            '\u062C'/*ج*/, '\u0686'/*چ*/, '\u062D'/*ح*/, '\u062E'/*خ*/,
            '\u062F'/*د*/, '\u0630'/*ذ*/,
            '\u0631'/*ر*/, '\u0632'/*ز*/, '\u0698'/*ژ*/,
            '\u0633'/*س*/, '\u0634'/*ش*/,
            '\u0635'/*ص*/, '\u0636'/*ض*/,
            '\u0637'/*ط*/, '\u0638'/*ظ*/,
            '\u0639'/*ع*/, '\u063A'/*غ*/, '\u0641'/*ف*/, '\u0642'/*ق*/,
            '\u06A9'/*ک*/, '\u0643'/*ك*/, '\u06AF'/*گ*/,
            '\u0644'/*ل*/, '\u0645'/*م*/,
            '\u0646'/*ن*/,
            '\u0648'/*و*/,
            '\u0647'/*ه*/, '\u0629'/*ة*/,
            '\u06CC'/*ی*/, '\u0649'/*ى*/, '\u064A'/*ي*/,
            '\u0640'/*ـ*/ /*كشيدگي حروف يا خط كرسي*/,
            '\u200D'/*ZWJ*/
        );
        var SeparateFaLetters = new Array('\uFE81'/*ﺁ*/, '\uFE8D'/*ﺍ*/, '\uFB50'/*ﭐ*/, '\uFE83'/*ﺃ*/, '\uFE87'/*ﺇ*/, '\uFE85'/*ﺅ*/, '\uFE89'/*ﺉ*/,
            '\uFE8F'/*ﺏ*/, '\uFB56'/*ﭖ*/, '\uFE95'/*ﺕ*/, '\uFE99'/*ﺙ*/,
            '\uFE9D'/*ﺝ*/, '\uFB7A'/*ﭺ*/, '\uFEA1'/*ﺡ*/, '\uFEA5'/*ﺥ*/,
            '\uFEA9'/*ﺩ*/, '\uFEAB'/*ﺫ*/,
            '\uFEAD'/*ﺭ*/, '\uFEAF'/*ﺯ*/, '\uFB8A'/*ﮊ*/,
            '\uFEB1'/*ﺱ*/, '\uFEB5'/*ﺵ*/,
            '\uFEB9'/*ﺹ*/, '\uFEBD'/*ﺽ*/,
            '\uFEC1'/*ﻁ*/, '\uFEC5'/*ﻅ*/,
            '\uFEC9'/*ﻉ*/, '\uFECD'/*ﻍ*/, '\uFED1'/*ﻑ*/, '\uFED5'/*ﻕ*/,
            '\uFB8E'/*ﮎ*/, '\uFED9'/*ﻙ*/, '\uFB92'/*ﮒ*/,
            '\uFEDD'/*ﻝ*/, '\uFEE1'/*ﻡ*/,
            '\uFEE5'/*ﻥ*/,
            '\uFEED'/*ﻭ*/,
            '\uFEE9'/*ﻩ*/, '\uFE93'/*ﺓ*/,
            '\uFBFC'/*ﯼ*/, '\uFEEF'/*ﻯ*/, '\uFEF1'/*ﻱ*/,
            '\u0640'/*ـ*/ /*كشيدگي حروف يا خط كرسي*/,
            '\u200D'/*ZWJ*/
        );
        var FirstFaLetters = new Array('\uFE81'/*ﺁ*/, '\uFE8D'/*ﺍ*/, '\uFB50'/*ﭐ*/, '\uFE83'/*ﺃ*/, '\uFE87'/*ﺇ*/, '\uFE85'/*ﺅ*/, '\uFE8B'/*ﺋ*/,
            '\uFE91'/*ﺑ*/, '\uFB58'/*ﭘ*/, '\uFE97'/*ﺗ*/, '\uFE9B'/*ﺛ*/,
            '\uFE9F'/*ﺟ*/, '\uFB7C'/*ﭼ*/, '\uFEA3'/*ﺣ*/, '\uFEA7'/*ﺧ*/,
            '\uFEA9'/*ﺩ*/, '\uFEAB'/*ﺫ*/,
            '\uFEAD'/*ﺭ*/, '\uFEAF'/*ﺯ*/, '\uFB8A'/*ﮊ*/,
            '\uFEB3'/*ﺳ*/, '\uFEB7'/*ﺷ*/,
            '\uFEBB'/*ﺻ*/, '\uFEBF'/*ﺿ*/,
            '\uFEC3'/*ﻃ*/, '\uFEC7'/*ﻇ*/,
            '\uFECB'/*ﻋ*/, '\uFECF'/*ﻏ*/, '\uFED3'/*ﻓ*/, '\uFED7'/*ﻗ*/,
            '\uFB90'/*ﮐ*/, '\uFEDB'/*ﻛ*/, '\uFB94'/*ﮔ*/,
            '\uFEDF'/*ﻟ*/, '\uFEE3'/*ﻣ*/,
            '\uFEE7'/*ﻧ*/, '\uFEED'/*ﻭ*/,
            '\uFEEB'/*ﻫ*/, '\uFEEB'/*ﻫ*/,
            '\uFBFE'/*ﯾ*/, '\uFEF3'/*ﻳ*/, '\uFEF3'/*ﻳ*/,
            '\u0640'/*ـ*/ /*كشيدگي حروف يا خط كرسي*/,
            '\u200D'/*ZWJ*/
        );
        var MiddleFaLetters = new Array('\uFE82'/*ﺂ*/, '\uFE8E'/*ﺎ*/, '\uFB51'/*ﭑ*/, '\uFE84'/*ﺄ*/, '\uFE88'/*ﺈ*/, '\uFE86'/*ﺆ*/, '\uFE8C'/*ﺌ*/,
            '\uFE92'/*ﺒ*/, '\uFB59'/*ﭙ*/, '\uFE98'/*ﺘ*/, '\uFE9C'/*ﺜ*/,
            '\uFEA0'/*ﺠ*/, '\uFB7D'/*ﭽ*/, '\uFEA4'/*ﺤ*/, '\uFEA8'/*ﺨ*/,
            '\uFEAA'/*ﺪ*/, '\uFEAC'/*ﺬ*/,
            '\uFEAE'/*ﺮ*/, '\uFEB0'/*ﺰ*/, '\uFB8B'/*ﮋ*/,
            '\uFEB4'/*ﺴ*/, '\uFEB8'/*ﺸ*/,
            '\uFEBC'/*ﺼ*/, '\uFEC0'/*ﻀ*/,
            '\uFEC4'/*ﻄ*/, '\uFEC8'/*ﻈ*/,
            '\uFECC'/*ﻌ*/, '\uFED0'/*ﻐ*/, '\uFED4'/*ﻔ*/, '\uFED8'/*ﻘ*/,
            '\uFB91'/*ﮑ*/, '\uFEDC'/*ﻜ*/, '\uFB95'/*ﮕ*/,
            '\uFEE0'/*ﻠ*/, '\uFEE4'/*ﻤ*/,
            '\uFEE8'/*ﻨ*/, '\uFEEE'/*ﻮ*/,
            '\uFEEC'/*ﻬ*/, '\uFEEC'/*ﻬ*/,
            '\uFBFF'/*ﯿ*/, '\uFEF4'/*ﻴ*/, '\uFEF4'/*ﻴ*/,
            '\u0640'/*ـ*/ /*كشيدگي حروف يا خط كرسي*/,
            '\u200D'/*ZWJ*/
        );
        var EndFaLetters = new Array('\uFE82'/*ﺂ*/, '\uFE8E'/*ﺎ*/, '\uFB51'/*ﭑ*/, '\uFE84'/*ﺄ*/, '\uFE88'/*ﺈ*/, '\uFE86'/*ﺆ*/, '\uFE8A'/*ﺊ*/,
            '\uFE90'/*ﺐ*/, '\uFB57'/*ﭗ*/, '\uFE96'/*ﺖ*/, '\uFE9A'/*ﺚ*/,
            '\uFE9E'/*ﺞ*/, '\uFB7B'/*ﭻ*/, '\uFEA2'/*ﺢ*/, '\uFEA6'/*ﺦ*/,
            '\uFEAA'/*ﺪ*/, '\uFEAC'/*ﺬ*/,
            '\uFEAE'/*ﺮ*/, '\uFEB0'/*ﺰ*/, '\uFB8B'/*ﮋ*/,
            '\uFEB2'/*ﺲ*/, '\uFEB6'/*ﺶ*/,
            '\uFEBA'/*ﺺ*/, '\uFEBE'/*ﺾ*/,
            '\uFEC2'/*ﻂ*/, '\uFEC6'/*ﻆ*/,
            '\uFECA'/*ﻊ*/, '\uFECE'/*ﻎ*/, '\uFED2'/*ﻒ*/, '\uFED6'/*ﻖ*/,
            '\uFB8F'/*ﮏ*/, '\uFEDA'/*ﻚ*/, '\uFB93'/*ﮓ*/,
            '\uFEDE'/*ﻞ*/, '\uFEE2'/*ﻢ*/,
            '\uFEE6'/*ﻦ*/, '\uFEEE'/*ﻮ*/,
            '\uFEEA'/*ﻪ*/, '\uFE94'/*ﺔ*/,
            '\uFBFD'/*ﯽ*/, '\uFEF0'/*ﻰ*/, '\uFEF2'/*ﻲ*/,
            '\u0640'/*ـ*/ /*كشيدگي حروف يا خط كرسي*/,
            '\u200D'/*ZWJ*/
        );
        var prevChar = null, currChar = null, nextChar = null;
        var j = index - 1;
        if (index > 0) {
            prevChar = str[j];
        }
        // Passes Erab to previous letter
        while (FaSigns.indexOf(prevChar) >= 0 && prevChar != null) {
            if (j > 1)
                prevChar = str[--j];
            else
                prevChar = null;
        }
        if (index < str.length)
            currChar = str[index];
        if (index < str.length - 1)
            nextChar = str[index + 1];
        // Passes Erab to next letter
        var j = index + 1;
        while (FaSigns.indexOf(nextChar) >= 0 && nextChar != null) {
            if (j < str.length - 1)
                nextChar = str[++j];
            else
                nextChar = null;
        }
        if (FaRealLetters.indexOf(currChar) < 0)
            return currChar;
        else {
            if (prevChar == null || NoneCountinuesLetters.indexOf(prevChar) >= 0 || WhiteSpaces.indexOf(prevChar) >= 0) { // if the previous letter is not connected
                if (nextChar == null || FaRealLetters.indexOf(nextChar) < 0 || WhiteSpaces.indexOf(nextChar) >= 0) { // if the next letter is not connected
                    return SeparateFaLetters[FaRealLetters.indexOf(currChar)];
                }
                else if (nextChar != null && FaRealLetters.indexOf(nextChar) >= 0) { // if the next letter is part of the persian letters
                    if (currChar == '\u0644'/*ل*/ && FaAlefLetters.indexOf(nextChar) >= 0) {
                        flagJump = true;
                        switch (nextChar) {
                            case '\u0622'/*آ*/
                            :
                                return '\uFEF5'/*ﻵ*/;
                                break;
                            case '\u0627'/*ا*/
                            :
                                return '\uFEFB'/*ﻻ*/;
                                break;
                            case '\u0623'/*أ*/
                            :
                                return '\uFEF7'/*ﻷ*/;
                                break;
                            case '\u0625'/*إ*/
                            :
                                return '\uFEF9'/*ﻹ*/;
                                break;
                        }
                    }
                    return FirstFaLetters[FaRealLetters.indexOf(currChar)];
                }
            }
            else if (prevChar != null && FaRealLetters.indexOf(prevChar) >= 0 && NoneCountinuesLetters.indexOf(prevChar) < 0) { // if the previous letter is part of the connected Persian letters
                //console.log(prevChar);
                if (nextChar == null || FaRealLetters.indexOf(nextChar) < 0 || WhiteSpaces.indexOf(nextChar) >= 0) { // if the next char does not have a connection to the current letter
                    return EndFaLetters[FaRealLetters.indexOf(currChar)];
                }
                else if (nextChar != null && FaRealLetters.indexOf(nextChar) >= 0) { // if the next letter is part of the Persian letters
                    if (currChar == '\u0644'/*ل*/ && FaAlefLetters.indexOf(nextChar) >= 0) {
                        flagJump = true;
                        switch (nextChar) {
                            case '\u0622'/*آ*/
                            :
                                return '\uFEF6'/*ﻶ*/;
                                break;
                            case '\u0627'/*ا*/
                            :
                                return '\uFEFC'/*ﻼ*/;
                                break;
                            case '\u0623'/*أ*/
                            :
                                return '\uFEF8'/*ﻸ*/;
                                break;
                            case '\u0625'/*إ*/
                            :
                                return '\uFEFA'/*ﻺ*/;
                                break;
                        }
                    }
                    return MiddleFaLetters[FaRealLetters.indexOf(currChar)];
                }
            }
        }
    };
    //Generate Hex for HTML
    var hexToStr = function (n) {
        n = n.toString(16);
        if (n.length === 6) return '#' + n;
        return '#000000'.substr(0, 7 - n.length) + n;
    };
    //Next color    
    var fadeHex = function (hex, hex2, ratio) {
        var r = hex >> 16;
        var g = hex >> 8 & 0xFF;
        var b = hex & 0xFF;
        r += ((hex2 >> 16) - r) * ratio;
        g += ((hex2 >> 8 & 0xFF) - g) * ratio;
        b += ((hex2 & 0xFF) - b) * ratio;
        return (r << 16 | g << 8 | b);
    };
    //Generate Hex for calculate
    var strToHex = function (str) {
        var hex = (str.indexOf("#") === 0) ? str.substring(1) : str;
        hex = parseInt("0x" + hex, 16);
        return hex;
    };
    // Gives the indexes of spilit points
    var splitPoints = function (length, n) {
        if (n <= 0)
            return [];
        var rest = length % n,
            restUsed = rest,
            partLength = Math.floor(length / n),
            result = [];
        for (var i = 0; i < length; i += partLength) {
            var end = partLength + i,
                add = false;
            if (rest !== 0 && restUsed) {
                end++;
                restUsed--;
                add = true;
            }
            if (end > 0)
                result.push([i + 1, end]);
            if (add) {
                i++;
            }
        }
        return result;
    };
    // Exception area
    if (typeof Text !== 'string')
        throw 'The first parameter should be a string';
    if (colors.length < 1)
        throw 'At least one color must be provided via arguments';
    // Start of coloring
    var result = "<span style='direction:rtl;' data-text = \"" + Text.replace(/"/g, '&quot;') + "\" >";
    var slices = splitPoints(Text.length, colors.length - 1);
    if (slices.length == 0) {
        result += "<span style='color:" + colors[0] + ";'>";
        result += Text;
        result += "</span>";
    } else {
        for (var j = 0; j < slices.length; j++) {
            var startIndex = slices[j][0] - 1;
            var endIndex = slices[j][1] - 1;
            var steps = endIndex - startIndex + 1;
            var startHex = strToHex(colors[j]);
            var endHex = strToHex(colors[j + 1]);

            for (var i = startIndex, k = 1; i < Text.length && i <= endIndex; i++, k++) {
                if (!flagJump) {
                    var ratio = k / steps;
                    var nowColor = fadeHex(startHex, endHex, ratio);
                    var color = hexToStr(nowColor);
                    result += "<span style='color:" + color + ";'>";
                    result += PrintableChar(Text, i);
                    result += "</span>";
                }
                else
                    flagJump = false;
            }
        }
    }
    result += '</span>';
    return result;
};
