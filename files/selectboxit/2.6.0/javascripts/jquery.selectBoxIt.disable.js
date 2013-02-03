// Disable Module
// ==============

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

    // Disable
    // -------
    //      Disables the new dropdown list

    $.selectBox.selectBoxIt.prototype.disable = function(callback) {

        var self = this;

        if(!self.options["disabled"]) {

            // Makes sure the dropdown list is closed
            self.close();

            // Triggers a `disable` custom event on the original select box
            self.triggerEvent("disable");

            // Sets the `disabled` attribute on the original select box
           self.selectBox.attr("disabled", "disabled");

           // Makes the dropdown list not focusable by removing the `tabindex` attribute
           self.div.removeAttr("tabindex")

           // Enabled styling for disabled state
           .addClass("selectboxit-disabled");

           // Calls the jQueryUI Widget Factory disable method to make sure all options are correctly synced
           $.Widget.prototype.disable.call(self);

        }

        // Provides callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Disable Option
    // --------------
    //      Disables a single drop down option

    $.selectBox.selectBoxIt.prototype.disableOption = function(index, callback) {

        var self = this, currentSelectBoxOption, hasNextEnabled, hasPreviousEnabled;

        // If an index is passed to target an individual drop down option
        if(typeof index === "number") {

            // Makes sure the dropdown list is closed
            self.close();

            // The select box option being targeted
            currentSelectBoxOption = self.selectBox.find("option").eq(index);

            // Triggers a `disable-option` custom event on the original select box and passes the disabled option
            self.triggerEvent("disable-option");

            // Disables the targeted select box option
            currentSelectBoxOption.attr("disabled", "disabled");

            // Disables the drop down option
            self.listItems.eq(index).attr("data-disabled", "true").

            // Applies disabled styling for the drop down option
            addClass(self.disabledClasses);

            // If the currently selected drop down option is the item being disabled
            if(self.currentFocus === index) {

                hasNextEnabled = self.listItems.eq(self.currentFocus).nextAll("li").not("[data-disabled='true']").first().length;

                hasPreviousEnabled = self.listItems.eq(self.currentFocus).prevAll("li").not("[data-disabled='true']").first().length;

                // If there is a currently enabled option beneath the currently selected option
                if(hasNextEnabled) {

                    // Selects the option beneath the currently selected option
                    self.moveDown();

                }

                // If there is a currently enabled option above the currently selected option
                else if(hasPreviousEnabled) {

                    // Selects the option above the currently selected option
                    self.moveUp();

                }

                // If there is not a currently enabled option
                else {

                    // Disables the entire drop down list
                    self.disable();

                }

            }

        }

        // Provides callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    //_Is Disabled
    // -----------
    //      Checks the original select box for the
    //    disabled attribute

    $.selectBox.selectBoxIt.prototype._isDisabled = function(callback) {

        var self = this;

        //If the original select box is disabled
        if (self.originalElem.disabled) {

            //Disables the dropdown list
            self.disable();
        }

        //Maintains chainability
        return self;

    };

}));