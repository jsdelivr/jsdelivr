// Dynamic Positioning Module
// ==========================

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

    //_Dynamic positioning
    // ------------------
    //      Dynamically positions the dropdown list options list

    $.selectBox.selectBoxIt.prototype._dynamicPositioning = function() {

        var self = this,

            // Returns the x and y coordinates of the dropdown list options list relative to the document
            listOffsetTop = self.div.offset().top,

            // The height of the dropdown list options list
            listHeight = self.list.data("max-height") || self.list.outerHeight(),

            // The height of the dropdown list DOM element
            selectBoxHeight = self.div.outerHeight(),

            windowHeight = $(window).height(),

            windowScrollTop = $(window).scrollTop(),

            topToBottom = (listOffsetTop + selectBoxHeight + listHeight <= windowHeight + windowScrollTop),

            bottomReached = !topToBottom;

        if(!self.list.data("max-height")) {

            self.list.data("max-height", self.list.outerHeight());

        }

        // Makes sure the original select box is hidden
        self.selectBox.css("display", "none");

        // If there is room on the bottom of the viewport to display the drop down options
        if (!bottomReached) {

            self.list.css("max-height", self.list.data("max-height"));

            // Sets custom CSS properties to place the dropdown list options directly below the dropdown list
            self.list.css("top", "auto");

        }

        // If there is room on the top of the viewport
        else if((self.div.offset().top - windowScrollTop) >= listHeight) {

            self.list.css("max-height", self.list.data("max-height"));

            // Sets custom CSS properties to place the dropdown list options directly above the dropdown list
            self.list.css("top", (self.div.position().top - self.list.outerHeight()));

        }

        // If there is not enough room on the top or the bottom
        else {

            var outsideBottomViewport = Math.abs((listOffsetTop + selectBoxHeight + listHeight) - (windowHeight + windowScrollTop)),

                outsideTopViewport = Math.abs((self.div.offset().top - windowScrollTop) - listHeight);

            // If there is more room on the bottom
            if(outsideBottomViewport < outsideTopViewport) {

                self.list.css("max-height", self.list.data("max-height") - outsideBottomViewport - (selectBoxHeight/2));

                self.list.css("top", "auto");

            }

            // If there is more room on the top
            else {

                self.list.css("max-height", self.list.data("max-height") - outsideTopViewport - (selectBoxHeight/2));

                // Sets custom CSS properties to place the dropdown list options directly above the dropdown list
                self.list.css("top", (self.div.position().top - self.list.outerHeight()));

            }

        }

        // Maintains chainability
        return self;

    };

}));