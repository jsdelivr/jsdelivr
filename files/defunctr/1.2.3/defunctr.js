/*!
 * Defunctr 1.2.3
 * https://github.com/cinecove/defunctr
 *
 * Copyright 2012 - 2016 Cinecove Digital, LLC and other contributors
 * Released under the MIT license
 * https://github.com/cinecove/defunctr/blob/master/LICENSE.md
 *
 * Build Date: 2016-05-08T18:10:48-0500
 */

(function modularize(context, window, factory) {
    var requireDocument = function requireDocument(document) {
        if (!document) {
            throw new Error("Defunctr requires a window with a document.");
        } else {
            return true;
        }
    };

    var modn = window.Modernizr;

    if (typeof define === "function" && define.amd) {
        /* amd support */
        if (requireDocument(window.document)) {
            define("defunctr", ["Modernizr"], function def(modernizr) {
                return factory(context, window, window.document, modernizr);
            });
        }
    } else if (typeof module === "object" && typeof module.exports === "object") {
        /* require and node support */
        module.exports = window.document ? factory(context, window, window.document, modn, true) : function def(w) {
            if (requireDocument(w.document)) {
                return factory(context, w, w.document, modn);
            }
        };
    } else if (typeof exports === "object" && exports) {
        /* other commonjs types */
        exports = window.document ? factory(context, window, window.document, modn, true) : function def(w) {
            if (requireDocument(w.document)) {
                return factory(context, w, w.document, modn);
            }
        };
    } else {
        factory(context, window, window.document, modn);
    }
}(this, typeof window !== "undefined" ? window : this, function def(context, window, document, mod, noGlobal) {
	var version = '1.2.3',
		modernizr = mod,
		r = {},
		docElement = document.documentElement,
		defunctr = 'defunctr',
		prefix = '',
		gtoff = docElement.className.indexOf('defunctr-gt-off') > 0,
		ltoff = docElement.className.indexOf('defunctr-lt-off') > 0,
		voff = docElement.className.indexOf('defunctr-version-off') > 0,
		onlyie = docElement.className.indexOf('defunctr-ie-only') > 0,
		tests = [];

    if (typeof modernizr === 'undefined') {
        throw new Error("Modernizr was not found.");
    }

    r.detective = (function detective(window, document) {
        var r = {};

        r.isWebkit = (
			function isWebkit(document) {
				return 'WebkitTransform' in document.documentElement.style && typeof window.msWriteProfilerMark === 'undefined'; /* v 1+ */
			}
		)(document);

        r.isOpera = (
			function isOpera(window) {
				return Boolean(window.opera && window.opera.version); /* 8.0+ */
			}
		)(window);

        r.isIE = (
			function isIE(window) {
				return 'ActiveXObject' in window; /*return (document.all != undefined) && !self.isOpera;*/
			}
		)(window);

        r.isFirefox = (
			function isFirefox(document) {
				return 'MozBoxSizing' in document.documentElement.style; /* 0.8+ */
			}
		)(document);

        r.isSafari = (
			function isSafari(window) {
				return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0; /*v 3+ */
			}
		)(window);

        r.isKhtml = (
			function isKhtml(document) {
				return 'KhtmlMarquee' in document.documentElement.style;
			}
		)(document);

        r.isOperaNext = (
			function isOperaNext(self, navigator) {
				return self.isWebkit && /(Opera|OPR)/.test(navigator.userAgent);
			}
		)(r, window.navigator);

        r.isChrome = (
			function isChrome(self) {
				return !self.isSafari && !self.isOperaNext && self.isWebkit;
			}
		)(r);

        r.isEdge = (
			function isEdge(self, window) {
				return !('ActiveXObject' in window) && (typeof window.Event === 'function') && (typeof window.msWriteProfilerMark !== 'undefined');
			}
		)(r, window);

        r.isUndetected = (
			function isUndetected(self) {
				return !((self.isWebkit) || (self.isOpera) || (self.isIE) || (self.isFirefox) || (self.isSafari) || (self.isKhtml) || (self.isOperaNext) || (self.isEdge));
			}
		)(r);


        r.ieAboveVersion5 = (
			function ieAboveVersion5(self, document) {
				return self.isIE && (typeof document.compatMode !== 'undefined' && document.compatMode !== 'BackCompat');
			}
		)(r, document);

        r.ieAboveVersion6 = (
			function ieAboveVersion6(self, window) {
				return self.isIE && self.ieAboveVersion5 && (typeof window.XMLHttpRequest !== 'undefined');
			}
		)(r, window);

        r.ieAboveVersion7 = (
			function ieAboveVersion7(self, document) {
				return self.isIE && (typeof document.querySelector !== 'undefined');
			}
		)(r, document);

        r.ieAboveVersion8 = (
			function ieAboveVersion8(self, document) {
				return self.isIE && (typeof document.addEventListener !== 'undefined');
			}
		)(r, document);

        r.ieAboveVersion9 = (
			function ieAboveVersion9(self, window) {
				return self.isIE && (typeof window.atob !== 'undefined');
			}
		)(r, window);

        r.ieAboveVersion10 = (
			function ieAboveVersion10(self, window) {
				return self.isIE && (typeof window.atob !== 'undefined') && (typeof window.ActiveXObject === 'undefined');
			}
		)(r, window);

        r.ieAboveVersion11 = (
			function ieAboveVersion11(self, window) {
				return self.isIE && (typeof window.Event === 'function');
			}
		)(r, window);


        r.ieBelowVersion6 = (
			function ieBelowVersion6(self, document) {
				return self.isIE && (typeof document.compatMode === 'undefined' || document.compatMode === 'BackCompat');
			}
		)(r, document);

        r.ieBelowVersion7 = (
			function ieBelowVersion7(self, window, document) {
				return self.isIE && (typeof window.XMLHttpRequest === 'undefined' || document.compatMode === 'BackCompat');
			}
		)(r, window, document);

        r.ieBelowVersion8 = (
			function ieBelowVersion8(self, document) {
				return self.isIE && (typeof document.querySelector === 'undefined');
			}
		)(r, document);

        r.ieBelowVersion9 = (
			function ieBelowVersion9(self, document) {
				return self.isIE && (typeof document.addEventListener === 'undefined');
			}
		)(r, document);

        r.ieBelowVersion10 = (
			function ieBelowVersion10(self, window) {
				return self.isIE && (typeof window.atob === 'undefined');
			}
		)(r, window);

        r.ieBelowVersion11 = (
			function ieBelowVersion11(self, window) {
				return self.isIE && (window.atob !== undefined) && (typeof window.ActiveXObject !== 'undefined');
			}
		)(r, window);

        r.ieBelowVersion12 = (
			function ieBelowVersion12(self, window) {
				return self.isIE && (typeof window.Event !== 'function');
			}
		)(r, window);


        r.ieIsVersion6 = (
			function ieIsVersion6(self) {
				return self.ieAboveVersion5 && self.ieBelowVersion7;
			}
		)(r);

        r.ieIsVersion7 = (
			function ieIsVersion7(self) {
				return self.ieAboveVersion6 && self.ieBelowVersion8;
			}
		)(r);

        r.ieIsVersion8 = (
			function ieIsVersion8(self) {
				return self.ieAboveVersion7 && self.ieBelowVersion9;
			}
		)(r);

        r.ieIsVersion9 = (
			function ieIsVersion9(self) {
				return self.ieAboveVersion8 && self.ieBelowVersion10;
			}
		)(r);

        r.ieIsVersion10 = (
			function ieIsVersion10(self) {
				return self.ieAboveVersion9 && self.ieBelowVersion11;
			}
		)(r);

        r.ieIsVersion11 = (
			function ieIsVersion11(self) {
				return self.ieAboveVersion10 && self.ieBelowVersion12;
			}
		)(r);


        r.chromeIsAbove15 = (
			function chromeIsAbove15(window) {
				return Boolean(window.chrome && window.chrome.webstore && window.chrome.webstore.install);
			}
		)(window);


        r.standardsCompliant = (
			function standardsCompliant(self) {
				return self.ieAboveVersion9 || !self.isIE;
			}
		)(r);

        return r;
    })(window, document);

    tests[prefix + 'ie'] = function test() { return r.detective.isIE; };
    if (!onlyie) {
        tests[prefix + 'chrome'] = function test() {
			return r.detective.isChrome;
		};

        tests[prefix + 'safari'] = function test() {
			return r.detective.isSafari;
		};

        tests[prefix + 'opera'] = function test() {
			return r.detective.isOpera;
		};

        tests[prefix + 'opera-next'] = function test() {
			return r.detective.isOperaNext;
		};

        tests[prefix + 'firefox'] = function test() {
			return r.detective.isFirefox;
		};

        tests[prefix + 'khtml'] = function test() {
			return r.detective.isKhtml;
		};

        tests[prefix + 'webkit'] = function test() {
			return r.detective.isWebkit;
		};

        tests[prefix + 'edge'] = function test() {
			return r.detective.isEdge;
		};

        tests[prefix + 'undetected-browser'] = function test() {
			return r.detective.isUndetected;
		};

    }

    if (!ltoff) {
        tests[prefix + 'ie-lt-6'] = function test() {
			return r.detective.ieBelowVersion6;
		};

        tests[prefix + 'ie-lt-7'] = function test() {
			return r.detective.ieBelowVersion7;
		};

        tests[prefix + 'ie-lt-8'] = function test() {
			return r.detective.ieBelowVersion8;
		};

        tests[prefix + 'ie-lt-9'] = function test() {
			return r.detective.ieBelowVersion9;
		};

        tests[prefix + 'ie-lt-10'] = function test() {
			return r.detective.ieBelowVersion10;
		};

        tests[prefix + 'ie-lt-11'] = function test() {
			return r.detective.ieBelowVersion11;
		};

        tests[prefix + 'ie-lt-12'] = function test() {
			return r.detective.ieBelowVersion12;
		};

    }

    if (!gtoff) {
        tests[prefix + 'ie-gt-6'] = function test() {
			return r.detective.ieAboveVersion6;
		};

        tests[prefix + 'ie-gt-7'] = function test() {
			return r.detective.ieAboveVersion7;
		};

        tests[prefix + 'ie-gt-8'] = function test() {
			return r.detective.ieAboveVersion8;
		};

        tests[prefix + 'ie-gt-9'] = function test() {
			return r.detective.ieAboveVersion9;
		};

        tests[prefix + 'ie-gt-10'] = function test() {
			return r.detective.ieAboveVersion10;
		};

        tests[prefix + 'ie-gt-11'] = function test() {
			return r.detective.ieAboveVersion11;
		};
    }

    if (!voff) {
        tests[prefix + 'ie-version-7'] = function test() {
			return r.detective.ieIsVersion7;
		};

        tests[prefix + 'ie-version-8'] = function test() {
			return r.detective.ieIsVersion8;
		};

        tests[prefix + 'ie-version-9'] = function test() {
			return r.detective.ieIsVersion9;
		};

        tests[prefix + 'ie-version-10'] = function test() {
			return r.detective.ieIsVersion10;
		};

        tests[prefix + 'ie-version-11'] = function test() {
			return r.detective.ieIsVersion11;
		};
    }

    r.version = version;

    for (var key in tests) {
		if ({}.hasOwnProperty.call(tests, key)) {
			modernizr.addTest(key, tests[key]);
		}
    }

    docElement.className = docElement.className.replace(/\bdefunctr-gt-off\b/, '');
    docElement.className = docElement.className.replace(/\bdefunctr-lt-off\b/, '');
    docElement.className = docElement.className.replace(/\bdefunctr-version-off\b/, '');
    docElement.className = docElement.className.replace(/\bdefunctr-ie-only\b/, '');

    if (!noGlobal) {
        window.defunctr = window.Defuntr = r;
    }

    return r;
}));


