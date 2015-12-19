/*!
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 *
 *               CASCADE FRAMEWORK 1.0
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 *
 *
 * Copyright 2013, John Slegers
 * Released under the MIT license
 * http://jslegers.github.com/cascadeframework/license.html
 *
 *
 * This means you can use Cascade Framework for any project,
 * whether commercial or not.
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 *
 * 
 * Cascade Framework also contains the following goodies,
 * which all have the same or similar 'permissive licenses :
 *
 *
 * Includes polyfills by Joshua Bell
 * http://www.calormen.com/polyfill/
 * Released in public domain
 *
 *
 * Includes Google ExplorerCanvas
 * https://code.google.com/p/explorercanvas/
 * Released under the Apache 2.0 license
 *
 *
 * Includes Google Prettify
 * https://code.google.com/p/google-code-prettify/
 * Released under the Apache 2.0 license
 *
 *
 * Includes Yepnope
 * http://yepnopejs.com/
 * Released under the WTFPL license
 *
 *
 * Includes Modernizr
 * http://modernizr.com/
 * Released under the MIT license
 *
 *
 * Includes lodash
 * http://lodash.com/
 * Released under the MIT license
 *
 *
 * Includes jQuery
 * http://jquery.com/
 * Released under the MIT license
 *
 *
 * Includes jQuery Easing plugin
 * http://gsgd.co.uk/sandbox/jquery/easing/
 * Released under the BSD license
 *
 *
 * Includes jQuery Flot plugin
 * http://www.flotcharts.org/
 * Released under the MIT license
 *
 *
 * Includes the Font Awesome webfont
 * http://fortawesome.github.com/Font-Awesome/
 * Released under the SIL Open Font License
 *
 *
 *
 *
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 *
 * Cascade Framework was inspired by many articles and projects
 * 
 * Especially these authors are worth mentioning :
 *             
 *             Nicolle Sullivan
 *             Jonathan Snook
 *             Chris Coyier
 *             Eric Meyer
 *             Nicolas Gallagher
 *             Paul Irish
 *             Mark Otto
 *             Jacob Thornton
 *
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * Date: 2013-03-15
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

window.App = (function( window, document ) {
    var root = 'cascadeframework'; 
    var App = {
        path : window.location.pathname.split(/[\\/]/) ,
        testfilename : true,
        logging : false,
        rootpath : '',
        jsroot : 'assets/js/',
        log : (function(value) {
            if(App.logging){
                console.log(value);
            }
        })
    };
    
    if(App.path[App.path.length-1] == '' || App.path[App.path.length-1] == root){
        App.filename = App.jsroot + 'page/index.js';
    } else {
        App.filename = App.jsroot + 'page/'+App.path[App.path.length-1].split( '.' )[0]+'.js';
    }

    App.checkFile = function(fileUrl) {
        if(App.testfilename){
            var req = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
            if (req) {
                try {
                    req.open('HEAD', fileUrl, false);
                    req.send();
                    if (req.status === 0 || req.status == 200){
                        return true;
                    }
                } catch(err) {
                    
                }
            }
            return false;
        } else {
            return true;
        }
    }
    
    App.initialize = function(callback){
        var l = document.createElement('script');
        l.src = App.jsroot + 'lib/app/loader.js';
        l.type = 'text/javascript';
        l.async = 'true';
        l.onload = l.onreadystatechange = function() {
            var rs = this.readyState;
            if (rs && rs != 'complete' && rs != 'loaded') return;
            callback();
        };
        var s = document.scripts[0];
        s.parentNode.insertBefore(l, s);
    }
    
    return App;
})(this, this.document);

(function() {
    App.initialize(function(){
        var console = App.jsroot + 'lib/polyfills/console.js',
        detector = App.jsroot + 'lib/app/detector.js',
        site = App.jsroot + 'site.js';
        Loader([{
            test: window.console,
            success: [detector, site],
            failure: [console, detector, site],
            callback: {
                console: function () {
                    App.log("Console shiv loaded!");
                },
                detector: function () {
                    App.log("Detector loaded!");
                }
            }
        },{
            load: (document.location.protocol === 'https:' ? '//ssl' : 'http://www') + '.google-analytics.com/ga.js',
            complete: function() {
                _gaq.push(['_setAccount', 'UA-38735730-1'], ['_trackPageview']);
            }
        }
        ]);
    });
}());