// Set Option Module
// =================

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

    //Set Option
    // ----------
    //      Accepts an string key, a value, and a callback function to replace a single
    //      property of the plugin options object

    $.selectBox.selectBoxIt.prototype.setOption = function(key, value, callback) {

        var self = this;

        // If a user sets the `showFirstOption` to false
        if (key === "showFirstOption" && !value) {

            //Hides the first option in the dropdown list
            self.listItems.eq(0).hide();

        }

        // If a user sets the `showFirstOption` to true
        else if (key === "showFirstOption" && value) {

            //Shows the first option in the dropdown list
            self.listItems.eq(0).show();

        }

        else if(key === "defaultIcon" && value) {

            self.divImage.attr("class", value + " selectboxit-arrow");

        }

        else if(key === "downArrowIcon" && value) {

            self.downArrow.attr("class", value + " selectboxit-arrow");

        }

        // If a user sets the defaultText option
        else if (key === "defaultText") {

            // Sets the new dropdown list default text
            self.divText.text(value);

        }

        $.Widget.prototype._setOption.apply(self, arguments);

        // Provides callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

}));