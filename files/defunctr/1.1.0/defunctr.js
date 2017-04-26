/* Defunctr 1.0 | MIT & BSD | Copyright 2013 Victoria French |  http://github.com/victoriafrench/defunctr */
window.Defunctr = (function (window, document, undefined) {
    var version = '1.1.0',
    r = {};
    docElement = document.documentElement,
    docHead = document.head || document.getElementsByTagName('head')[0],
    defunctr = 'defunctr';
    prefix = '',
	gtoff = docElement.className.indexOf('defunctr-gt-off') > 0,
    ltoff = docElement.className.indexOf('defunctr-lt-off') > 0,
    voff = docElement.className.indexOf('defunctr-version-off') > 0,
    onlyie = docElement.className.indexOf('defunctr-ie-only') > 0,
	tests = [];
    
    r.detective = (function (window, document, undefined) {
        var r = {};
        r.isOpera = (function (window, undefined) { return !!(window.opera && window.opera.version); /* 8.0+ */ })(window);
        r.isIE = (function (self, document, window, undefined) { return 'ActiveXObject' in window; /*return (document.all != undefined) && !self.isOpera;*/ })(r, document, window);
        r.isFirefox = (function (document, undefined) { return 'MozBoxSizing' in document.documentElement.style; /* 0.8+ */ })(document);
        r.isSafari = (function (window, undefined) { return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0; /*v 3+ */ })(window);
        r.isChrome = (function (self, document, undefined) { return !r.isSafari && 'WebkitTransform' in document.documentElement.style; /* v 1+ */ })(r, document);
		r.isKhtml = (function (document, undefined) { return 'KhtmlMarquee' in document.documentElement.style })(document);

        r.ieBelowVersion6 = (function (self, document, undefined) { return r.isIE && !(document.compatMode != undefined); })(r, document);
        r.ieBelowVersion7 = (function (self, window, undefined) { return r.isIE && !(window.XMLHttpRequest != undefined); })(r, window);
        r.ieBelowVersion8 = (function (self, document, undefined) { return r.isIE && !(document.querySelector != undefined); })(r, document);
        r.ieBelowVersion9 = (function (self, document, undefined) { return r.isIE && !(document.addEventListener != undefined); })(r, document);
        r.ieBelowVersion10 = (function (self, window, undefined) { return r.isIE && !(window.atob != undefined); })(r, window);
        r.ieAboveVersion5 = (function (self, window, undefined) { return r.isIE && (document.compatMode != undefined); })(r, window);
        r.ieAboveVersion6 = (function (self, window, undefined) { return r.isIE && (window.XMLHttpRequest != undefined); })(r, window);
        r.ieAboveVersion7 = (function (self, document, undefined) { return r.isIE && (document.querySelector != undefined); })(r, document);
        r.ieAboveVersion8 = (function (self, window, undefined) { return r.isIE && (document.addEventListener != undefined); })(r, window);
        r.ieAboveVersion9 = (function (self, window, undefined) { return r.isIE && (window.atob != undefined); })(r, window);
        r.ieIsVersion6 = (function (self, undefined) { return r.ieAboveVersion5 && r.ieBelowVersion7; })(r);
        r.ieIsVersion7 = (function (self, undefined) { return r.ieAboveVersion6 && r.ieBelowVersion8; })(r);
        r.ieIsVersion8 = (function (self, undefined) { return r.ieAboveVersion7 && r.ieBelowVersion9; })(r);
        r.ieIsVersion9 = (function (self, undefined) { return r.ieAboveVersion8 && r.ieBelowVersion10; })(r);
        
        
        r.chromeIsAbove15 = (function (window, undefined) { return !!(window.chrome && window.chrome.webstore && window.chrome.webstore.install); })(window);


        r.standardsCompliant = (function (self, undefined) { return r.ieAboveVersion9; })(r);
        return r;
    })(window, document);
    
    tests[prefix + 'ie'] = function () { return r.detective.isIE; };
    if (!onlyie) {
        tests[prefix + 'webkit'] = function () { return r.detective.isChrome || r.detective.isSafari; };
        tests[prefix + 'chrome'] = function () { return r.detective.isChrome; };
        tests[prefix + 'safari'] = function () { return r.detective.isSafari; };
        tests[prefix + 'opera'] = function () { return r.detective.isOpera; };
        tests[prefix + 'firefox'] = function () { return r.detective.isFirefox; };
		tests[prefix + 'khtml'] = function () { return r.detective.isKhtml; };
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

    for (key in tests) {
        window.Modernizr.addTest(key, tests[key]);
    }

    docElement.className = docElement.className.replace(/\bdefunctr-gt-off\b/, '');
    docElement.className = docElement.className.replace(/\bdefunctr-lt-off\b/, '');
    docElement.className = docElement.className.replace(/\bdefunctr-version-off\b/, '');
    docElement.className = docElement.className.replace(/\bdefunctr-ie-only\b/, '');

    return r;
})(this, this.document);

