define(['window'], function(win) {
	'use strict';

	var Public = {
		browser: browser(),
		os: os()
	};


    function browser() {
    	var browser = "Unknown browser";
        if(!!window.chrome && !(!!window.opera))  browser = 'chrome'; // Chrome 1+
        if(typeof InstallTrigger !== 'undefined')  browser = 'firefox'; // Firefox 1.0+
        if(!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0)  browser = 'opera'; // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
        if(/*@cc_on!@*/false || !!document.documentMode)  browser = 'ie'; // At least IE6
        if(Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0)  browser = 'safari'; // At least Safari 3+: "[object HTMLElementConstructor]"
    	
    	return browser;
    }

    function os() {
    	var OSName="Unknown OS";
		if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
		if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
		if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
		if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";

		return OSName;
    }

	return Public;

});