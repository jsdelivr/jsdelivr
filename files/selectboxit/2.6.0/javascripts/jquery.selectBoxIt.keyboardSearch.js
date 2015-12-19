// Keyboard Search Module
// ======================

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

    // _Set Current Search Option
    // -------------------------
    //      Sets the currently selected dropdown list search option

    $.selectBox.selectBoxIt.prototype._setCurrentSearchOption = function(currentOption) {

        var self = this;

        // Does not change the current option if `showFirstOption` is false and the matched search item is the hidden first option.
        // Otherwise, the current option value is updated
        if (self.listItems.eq(currentOption).is(":visible") && self.listItems.eq(currentOption).data("disabled") !== true) {

            // Calls the `blur` event of the currently selected dropdown list option
            self.listItems.eq(self.currentFocus).blur();

            // Sets `currentIndex` to the currently selected dropdown list option
            self.currentIndex = currentOption;

            // Sets `currentFocus` to the currently selected dropdown list option
            self.currentFocus = currentOption;

            // Focuses the currently selected dropdown list option
            self.listItems.eq(self.currentFocus).focus();

            // Updates the scrollTop so that the currently selected dropdown list option is visible to the user
            self._scrollToView("search");

            // Triggers the custom `search` event on the original select box
            self.triggerEvent("search");

        }

        //Maintains chainability
        return self;

    };

    // _Search Algorithm
    // -----------------
    //      Uses regular expressions to find text matches
    $.selectBox.selectBoxIt.prototype._searchAlgorithm = function(currentIndex, alphaNumeric) {

        var self = this,

            // Boolean to determine if a pattern match exists
            matchExists = false,

            // Iteration variable used in the outermost for loop
            x,

            // Iteration variable used in the nested for loop
            y,

            // Variable used to cache the length of the text array (Small enhancement to speed up traversing)
            arrayLength;

        // Loops through the text array to find a pattern match
        for (x = currentIndex, arrayLength = self.textArray.length; x < arrayLength; x += 1) {

            // Nested for loop to help search for a pattern match with the currently traversed array item
            for (y = 0; y < arrayLength; y += 1) {

                // Searches for a match
                if (self.textArray[y].search(alphaNumeric) !== -1) {

                    // `matchExists` is set to true if there is a match
                    matchExists = true;

                    // Exits the nested for loop
                    y = arrayLength;

                }

            } // End nested for loop

            //If a match does not exist
            if (!matchExists) {

                // Sets the current text to the last entered character
                self.currentText = self.currentText.charAt(self.currentText.length - 1).

                // Escapes the regular expression to make sure special characters are seen as literal characters instead of special commands
                replace(/[|()\[{.+*?$\\]/g, "\\$0");

                // Resets the regular expression with the new value of `self.currentText`
                alphaNumeric = new RegExp(self.currentText, "gi");

            }

            // Searches based on the first letter of the dropdown list options text if the currentText < 2 characters
            if (self.currentText.length < 3) {

                alphaNumeric = new RegExp(self.currentText.charAt(0), "gi");

                //If there is a match based on the first character
                if ((self.textArray[x].charAt(0).search(alphaNumeric) !== -1)) {

                    //Sets properties of that dropdown list option to make it the currently selected option
                    self._setCurrentSearchOption(x);

                    //Increments the current index by one
                    self.currentIndex += 1;

                    //Exits the search
                    return false;

                }
            }

            // If `self.currentText` > 1 character
            else {

                // If there is a match based on the entire string
                if ((self.textArray[x].search(alphaNumeric) !== -1)) {

                    // Sets properties of that dropdown list option to make it the currently selected option
                    self._setCurrentSearchOption(x);

                    // Exits the search
                    return false;
                }
            }

            // If the current text search is an exact match
            if (self.textArray[x].toLowerCase() === self.currentText.toLowerCase()) {

                // Sets properties of that dropdown list option to make it the currently selected option
                self._setCurrentSearchOption(x);

                // Resets the current text search to a blank string to start fresh again
                self.currentText = "";

                // Exits the search
                return false;

            }
        }

        //Returns true if there is not a match at all
        return true;
    };

    // Search
    // ------
    //      Calls searchAlgorithm()
    $.selectBox.selectBoxIt.prototype.search = function(alphaNumericKey, rememberPreviousSearch, callback) {

        var self = this;

        // If the search method is being called internally by the plugin, and not externally as a method by a user
        if (rememberPreviousSearch) {

            // Continued search with history from past searches.  Properly escapes the regular expression
            self.currentText += alphaNumericKey.replace(/[|()\[{.+*?$\\]/g, "\\$0");

        }

        else {

            // Brand new search.  Properly escapes the regular expression
            self.currentText = alphaNumericKey.replace(/[|()\[{.+*?$\\]/g, "\\$0");

        }

        // Wraps the current user text search in a regular expression that is case insensitive and searches globally
        var alphaNumeric = new RegExp(self.currentText, "gi"),

            // Calls `searchAlgorithm` which searches an array that contains all of the dropdown list option values.
            notFound = self._searchAlgorithm(self.currentIndex, alphaNumeric);

        // Searches the list again if a match is not found.  This is needed, because the first search started at the array indece of the currently selected dropdown list option, and does not search the options before the current array indece.
        // If there are many similar dropdown list options, starting the search at the indece of the currently selected dropdown list option is needed to properly traverse the text array.
        if (notFound) {

            // Searches the dropdown list values starting from the beginning of the text array
            self._searchAlgorithm(0, alphaNumeric);

        }

        // Provide callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

}));