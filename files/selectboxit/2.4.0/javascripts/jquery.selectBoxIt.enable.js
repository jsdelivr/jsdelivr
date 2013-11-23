$(function() {

    //Enable
    // -----
    //      Enables the new dropdown list

    $.selectBox.selectBoxIt.prototype.enable = function(callback) {

        var self = this;

        if(self.options["disabled"]) {

            // Triggers a `enable` custom event on the original select box
            self.selectBox.trigger("enable").

            // Removes the `disabled` attribute from the original dropdown list
            removeAttr("disabled");

            // Make the dropdown list focusable
            self.div.attr("tabindex", 0)

            // Disable styling for disabled state
            .removeClass(self.disabledClasses);
                
            $.Widget.prototype.enable.call(self);

            // Provide callback function support
            self._callbackSupport(callback);

            }

            //Maintains chainability
            return self;

        };

    // Enable Option
    // -------------
    //      Disables a single drop down option

    $.selectBox.selectBoxIt.prototype.enableOption = function(index, callback) {

        var self = this, currentSelectBoxOption, currentIndex = 0, hasNextEnabled, hasPreviousEnabled;

        // If an index is passed to target an individual drop down option
        if(typeof index === "number") {

            // The select box option being targeted
            currentSelectBoxOption = self.selectBox.find("option").eq(index);

            currentIndex = self.options["showFirstOption"] ? index: ((index - 1) >= 0 ? index: 0 );

            // Triggers a `enable-option` custom event on the original select box and passes the enabled option
            self.selectBox.trigger("enable-option", currentSelectBoxOption);

            // Disables the targeted select box option
            currentSelectBoxOption.removeAttr("disabled");

            // Disables the drop down option
            self.listItems.eq(index).attr("data-disabled", "false").

            // Applies disabled styling for the drop down option
            removeClass(self.disabledClasses);

        }

        // Provides callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

});