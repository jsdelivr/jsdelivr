// Wait Module
// ===========

// Immediately-Invoked Function Expression (IIFE) [Ben Alman Blog Post](http://benalman.com/news/2010/11/immediately-invoked-function-expression/) that calls another IIFE that contains all of the plugin logic.  I used this pattern so that anyone viewing this code would not have to scroll to the bottom of the page to view the local parameters that were passed to the main IIFE.

(function (selectBoxIt) {

    //ECMAScript 5 Strict Mode: [John Resig Blog Post](http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/)
    "use strict";

    // Calls the second IIFE and locally passes in the global jQuery, window, and document objects
    selectBoxIt(window.jQuery, window, document);

}

// Locally passes in `jQuery`, the `window` object, the `document` object, and an `undefined` variable.  The `jQuery`, `window` and `document` objects are passed in locally, to improve performance, since javascript first searches for a variable match within the local variables set before searching the global variables set.  All of the global variables are also passed in locally to be minifier friendly. `undefined` can be passed in locally, because it is not a reserved word in JavaScript.

(function ($, window, document, undefined) {

    // ECMAScript 5 Strict Mode: [John Resig Blog Post](http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/)
    "use strict";

    // Wait
    // ----
    //    Delays execution by the amount of time
    //    specified by the parameter

    $.selectBox.selectBoxIt.prototype.wait = function(time, callback) {

        var self = this,

            // The timeout variable stores a Deferred Object, which will be resolved after the time specified in the parameter
            timeout = this.returnTimeout(time);

        // Once the Deferred object is resolved, call the callback function
        timeout.then(function() {

            // Provide callback function support
            self._callbackSupport(callback);

        });
        
        // Maintains chainability
        return self;

    };

    //Return timeout
    // -------------
    //    Returns a Deferred Object after the time
    //    specified by the parameter

    $.selectBox.selectBoxIt.prototype.returnTimeout = function(time) {

        //Returns a Deferred Object
        return $.Deferred(function(dfd) {

            //Call the JavaScript `setTimeout function and resolve the Deferred Object
            setTimeout(dfd.resolve, time);

        });

    };

}));