/*!
 * Defunctr 1.1.2
 * https://github.com/cinecove/defunctr
 *
 * Copyright 2012 - 2016 Cinecove Digital, LLC and other contributors
 * Released under the MIT license
 * https://github.com/cinecove/defunctr/blob/master/LICENSE.md
 *
 * Build Date: 2016-01-13T13:58:40
 */

window.defunctr = window.Defunctr = (function (window, document, undefined) {
    var version = '1.1.2',
    r = {},
    docElement = document.documentElement,
    defunctr = 'defunctr',
    prefix = '',
	gtoff = docElement.className.indexOf('defunctr-gt-off') > 0,
    ltoff = docElement.className.indexOf('defunctr-lt-off') > 0,
    voff = docElement.className.indexOf('defunctr-version-off') > 0,
    onlyie = docElement.className.indexOf('defunctr-ie-only') > 0,
	tests = [];

    r.detective = (function (window, document, undefined) {
        var r = {};
        r.isWebkit = (function (document, undefined) { return 'WebkitTransform' in document.documentElement.style; /* v 1+ */})(document);
        r.isOpera = (function (window, undefined) { return !!(window.opera && window.opera.version); /* 8.0+ */ })(window);
        r.isIE = (function (window, undefined) { return 'ActiveXObject' in window; /*return (document.all != undefined) && !self.isOpera;*/ })(window);
        r.isFirefox = (function (document, undefined) { return 'MozBoxSizing' in document.documentElement.style; /* 0.8+ */ })(document);
        r.isSafari = (function (window, undefined) { return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0; /*v 3+ */ })(window);
		r.isKhtml = (function (document, undefined) { return 'KhtmlMarquee' in document.documentElement.style })(document);
		r.isOperaNext  = (function (self, navigator, undefined) { return self.isWebkit && /(Opera|OPR)/.test(navigator.userAgent); })(r, navigator);
        r.isChrome = (function (self, undefined) { return !self.isSafari && !self.isOperaNext && self.isWebkit; })(r);

        r.ieBelowVersion6 = (function (self, document, undefined) { return self.isIE && !(document.compatMode != undefined); })(r, document);
        r.ieBelowVersion7 = (function (self, window, undefined) { return self.isIE && !(window.XMLHttpRequest != undefined); })(r, window);
        r.ieBelowVersion8 = (function (self, document, undefined) { return self.isIE && !(document.querySelector != undefined); })(r, document);
        r.ieBelowVersion9 = (function (self, document, undefined) { return self.isIE && !(document.addEventListener != undefined); })(r, document);
        r.ieBelowVersion10 = (function (self, window, undefined) { return self.isIE && !(window.atob != undefined); })(r, window);
        r.ieAboveVersion5 = (function (self, window, undefined) { return self.isIE && (document.compatMode != undefined); })(r, window);
        r.ieAboveVersion6 = (function (self, window, undefined) { return self.isIE && (window.XMLHttpRequest != undefined); })(r, window);
        r.ieAboveVersion7 = (function (self, document, undefined) { return r.isIE && (document.querySelector != undefined); })(r, document);
        r.ieAboveVersion8 = (function (self, window, undefined) { return self.isIE && (document.addEventListener != undefined); })(r, window);
        r.ieAboveVersion9 = (function (self, window, undefined) { return self.isIE && (window.atob != undefined); })(r, window);
        r.ieIsVersion6 = (function (self, undefined) { return self.ieAboveVersion5 && self.ieBelowVersion7; })(r);
        r.ieIsVersion7 = (function (self, undefined) { return self.ieAboveVersion6 && self.ieBelowVersion8; })(r);
        r.ieIsVersion8 = (function (self, undefined) { return self.ieAboveVersion7 && self.ieBelowVersion9; })(r);
        r.ieIsVersion9 = (function (self, undefined) { return self.ieAboveVersion8 && self.ieBelowVersion10; })(r);


        r.chromeIsAbove15 = (function (window, undefined) { return !!(window.chrome && window.chrome.webstore && window.chrome.webstore.install); })(window);


        r.standardsCompliant = (function (self, undefined) { return r.ieAboveVersion9; })(r);
        return r;
    })(window, document);

    tests[prefix + 'ie'] = function () { return r.detective.isIE; };
    if (!onlyie) {
        tests[prefix + 'chrome'] = function () { return r.detective.isChrome; };
        tests[prefix + 'safari'] = function () { return r.detective.isSafari; };
        tests[prefix + 'opera'] = function () { return r.detective.isOpera; };
        tests[prefix + 'opera-next'] = function() { return r.detective.isOperaNext; };
        tests[prefix + 'firefox'] = function () { return r.detective.isFirefox; };
		tests[prefix + 'khtml'] = function () { return r.detective.isKhtml; };
		tests[prefix + 'webkit'] = function () { return r.detective.isWebkit; };
    }

    if (!ltoff) {
        tests[prefix + 'ie-lt-7'] = function () { return r.detective.ieBelowVersion7; };
        tests[prefix + 'ie-lt-8'] = function () { return r.detective.ieBelowVersion8; };
        tests[prefix + 'ie-lt-9'] = function () { return r.detective.ieBelowVersion9; };
        tests[prefix + 'ie-lt-10'] = function () { return r.detective.ieBelowVersion10; };
    }

    if (!gtoff) {
        tests[prefix + 'ie-gt-6'] = function () { return r.detective.ieAboveVersion6; };
        tests[prefix + 'ie-gt-7'] = function () { return r.detective.ieAboveVersion7; };
        tests[prefix + 'ie-gt-8'] = function () { return r.detective.ieAboveVersion8; };
        tests[prefix + 'ie-gt-9'] = function () { return r.detective.ieAboveVersion9; };
    }

    if (!voff) {
        tests[prefix + 'ie-version-7'] = function () { return r.detective.ieIsVersion7; };
        tests[prefix + 'ie-version-8'] = function () { return r.detective.ieIsVersion8; };
        tests[prefix + 'ie-version-9'] = function () { return r.detective.ieIsVersion9; };
    }

    r.version = version;

    for (var key in tests) {
        window.Modernizr.addTest(key, tests[key]);
    }

    docElement.className = docElement.className.replace(/\bdefunctr-gt-off\b/, '');
    docElement.className = docElement.className.replace(/\bdefunctr-lt-off\b/, '');
    docElement.className = docElement.className.replace(/\bdefunctr-version-off\b/, '');
    docElement.className = docElement.className.replace(/\bdefunctr-ie-only\b/, '');

    return r;
})(this, this.document);

