$(function() {

    // Disable
    // -------
    //      Disables the new dropdown list

    $.selectBox.selectBoxIt.prototype.disable = function(callback) {

        var self = this;

        if(!self.options["disabled"]) {

            // Makes sure the dropdown list is closed
            self.close();

            // Triggers a `disable` custom event on the original select box
            self.selectBox.trigger("disable").

            // Sets the `disabled` attribute on the original select box
           attr("disabled", "disabled");

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

        var self = this, currentSelectBoxOption, currentIndex = 0, hasNextEnabled, hasPreviousEnabled;

        // If an index is passed to target an individual drop down option
        if(typeof index === "number") {

            // Makes sure the dropdown list is closed
            self.close();

            // The select box option being targeted
            currentSelectBoxOption = self.selectBox.find("option").eq(index);

            currentIndex = self.options["showFirstOption"] ? index: ((index - 1) >= 0 ? index: 0 );

            // Triggers a `disable-option` custom event on the original select box and passes the disabled option
            self.selectBox.trigger("disable-option", currentSelectBoxOption);

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

});