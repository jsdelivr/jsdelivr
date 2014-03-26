YUI.add('gallery-intl-bidi', function(Y) {

Y.mix(Y.namespace("Intl"), {
    // All Unicode characters of bidi class 'R' (RTL) and 'AL' (RTL Arabic) as per Unicode 5.2. (Non-BMP characters are supported.)
    _rtlChars: "[\uD83A\uD83B][\uDC00-\uDFFF]|[\u0590\u05BE\u05C0\u05C3\u05C6\u05C8-\u05FF\u0604\u0605\u0608\u060B\u060D\u061B-\u064A\u065F\u066D-\u066F\u0671-\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u070E\u0710\u0712-\u072F\u074B-\u07A5\u07B1-\u07EA\u07F4\u07F5\u07FA-\u0815\u081A\u0824\u0828\u082E-\u08FF\u200F\uFB1D\uFB1F-\uFB28\uFB2A-\uFD3D\uFD40-\uFDCF\uFDF0-\uFDFC\uFDFE\uFDFF\uFE70-\uFEFE]|\uD803[\uDC00-\uDE5F\uDE7F-\uDFFF]|\uD802[\uDC00-\uDD1E\uDD20-\uDE00\uDE04\uDE07-\uDE0B\uDE10-\uDE37\uDE3B-\uDE3E\uDE40-\uDF38\uDF40-\uDFFF]",
    // All Unicode characters of *any* bidi class except 'L' (LTR), 'R' (RTL), and 'AL' (RTL Arabic) as per Unicode 5.2. (Non-BMP characters are supported.)
    _neutralChars: "[\uDB40-\uDB43][\uDC00-\uDFFF]|\uD802[\uDD1F\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDF39-\uDF3F]|\uD804[\uDC80\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA]|\uD803[\uDE60-\uDE7E]|\uD800[\uDD01\uDD40-\uDD8A\uDD90-\uDD9B\uDDFD]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDD00-\uDD0A]|[\u0000-\u0040\u005B-\u0060\u007B-\u00A9\u00AB-\u00B4\u00B6-\u00B9\u00BB-\u00BF\u00D7\u00F7\u02B9\u02BA\u02C2-\u02CF\u02D2-\u02DF\u02E5-\u02ED\u02EF-\u036F\u0374\u0375\u037E\u0384\u0385\u0387\u03F6\u0483-\u0489\u058A\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0600-\u0603\u0606\u0607\u0609\u060A\u060C\u060E-\u061A\u064B-\u065E\u0660-\u066C\u0670\u06D6-\u06E4\u06E7-\u06ED\u06F0-\u06F9\u070F\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07F6-\u07F9\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0900-\u0902\u093C\u0941-\u0948\u094D\u0951-\u0955\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u09F2\u09F3\u09FB\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AF1\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0BF3-\u0BFA\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C78-\u0C7E\u0CBC\u0CCC\u0CCD\u0CE2\u0CE3\u0CF1\u0CF2\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E3F\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39-\u0F3D\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F90-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135F\u1390-\u1399\u1400\u1680\u169B\u169C\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DB\u17DD\u17F0-\u17F9\u1800-\u180E\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1940\u1944\u1945\u19DE-\u19FF\u1A17\u1A18\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1DC0-\u1DE6\u1DFD-\u1DFF\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2000-\u200D\u2010-\u2070\u2074-\u207E\u2080-\u208E\u20A0-\u20B8\u20D0-\u20F0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u2150-\u215F\u2189\u2190-\u2335\u237B-\u2394\u2396-\u23E8\u2400-\u2426\u2440-\u244A\u2460-\u249B\u24EA-\u26AB\u26AD-\u26CD\u26CF-\u26E1\u26E3\u26E8-\u26FF\u2701-\u2704\u2706-\u2709\u270C-\u2727\u2729-\u274B\u274D\u274F-\u2752\u2756-\u275E\u2761-\u2794\u2798-\u27AF\u27B1-\u27BE\u27C0-\u27CA\u27CC\u27D0-\u27FF\u2900-\u2B4C\u2B50-\u2B59\u2CE5-\u2CEA\u2CEF-\u2CF1\u2CF9-\u2CFF\u2DE0-\u2E31\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3000-\u3004\u3008-\u3020\u302A-\u3030\u3036\u3037\u303D-\u303F\u3099-\u309C\u30A0\u30FB\u31C0-\u31E3\u321D\u321E\u3250-\u325F\u327C-\u327E\u32B1-\u32BF\u32CC-\u32CF\u3377-\u337A\u33DE\u33DF\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA60D-\uA60F\uA66F-\uA673\uA67C-\uA67F\uA6F0\uA6F1\uA700-\uA721\uA788\uA802\uA806\uA80B\uA825\uA826\uA828-\uA82B\uA838\uA839\uA874-\uA877\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uABE5\uABE8\uABED\uFB1E\uFB29\uFD3E\uFD3F\uFDD0-\uFDEF\uFDFD\uFE00-\uFE19\uFE20-\uFE26\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFEFF\uFF01-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFF0-\uFFFF]|\uD835[\uDEDB\uDF15\uDF4F\uDF89\uDFC3\uDFCE-\uDFFF]|\uD834[\uDD67-\uDD69\uDD73-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE00-\uDE45\uDF00-\uDF56]",

    // This function must be called if _rtlChars or _neutralChars is
    // overridden, so the regular expressions could be regenerated.
    _initializeBidiPatterns: function () {
        // A regular expression matching all right-to-left paragraphs
        this._rtlPattern = new RegExp("^(?:" + this._neutralChars + ")*(?:" + this._rtlChars + ")"); // ^N*R
        // A regular expression matching paragraphs with only neutral paragraphs
        this._neturalPattern = new RegExp("^(?:" + this._neutralChars + ")*$"); // ^N*$
    },

    // Changes the list of bidi characters that define the behavior of the
    // detectDirection method.
    // Both parameters should be strings that would define regular expressions.
    // Set each parameter to 'undefined' (or leave
    // it undefined) in order to use the previous value.
    //
    // This should only be used in very rare cases, like when there are
    // privately defined characters used. Use extreme care when using this
    // method. The behavior of the detectDirection function is not
    // well-defined if there is any string that would match both rtlChars
    // and neutralChars, or if any of those parameters match anything other
    // than a non-empty set of Unicode characters (it is OK to use two
    // UTF-16 units to refer to characters outside the BMP).    
    setBidiChars: function (rtlChars, neutralChars) {
        if (rtlChars !== undefined) {
            this._rtlChars = rtlChars;
        }
        if (neutralChars !== undefined) {
            this._neutralChars = neutralChars;
        }
        this._initializeBidiPatterns();
    },


    // Takes two parameters, and returns the detected bidi direction, based
    // on the Unicode Bidirectional Algorithm (UBA).
    //
    // The return value is "ltr" for left-to-right, "rtl" for right-to-left,
    // or "" for neutral paragraphs.
    //
    // The first parameter is the text, direction of which is to be
    // determined. It is required.
    //
    // The second parameter, fallbackDirection, is optional. When present
    // and either equal to "ltr", or "rtl", the function will return that type
    // instead of "" when the paragraph is only made of neutral characters.
    // Otherwise, it is ignored.
    //
    // The second parameter has two main uses: 1) It runs faster than
    // letting the function return "" and then re-interpret it as some
    // other type based on the context; 2) It can simplify the code using
    // the function in some scenarios.
    //
    // If 100% conformance to unmodified UBA is required (you probably
    // don't want that, as it biases neutral strings towards
    // left-to-right), run the function with the second parameter set to
    // "ltr".
    detectDirection: function (text, fallbackDirection) {
        if (this._rtlPattern.test(text)) {
            return "rtl";
        } else if (fallbackDirection === "ltr") {
            return "ltr";
        } else if (this._neturalPattern.test(text)) {
            if (fallbackDirection === "rtl") {
                return "rtl";
            }
            else {
                return "";
            }
        } else {
            return "ltr";
        }
    }
});

Y.Intl._initializeBidiPatterns();

Y.mix(Y.namespace("Intl"), { bidiDirection: Y.Intl.detectDirection }); // For backward compatibility


}, 'gallery-2010.09.29-18-36' );
