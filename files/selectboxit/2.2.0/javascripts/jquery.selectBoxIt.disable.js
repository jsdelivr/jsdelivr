$(function() {

    //Disable
    // ------
    //      Disables the new dropdown list

    $.selectBox.selectBoxIt.prototype.disable = function(callback) {

        var self = this;

        if(!self.options["disabled"]) {

            //Makes sure the dropdown list is closed
            self.close();

            //Triggers a `disable` custom event on the original select box
            self.selectBox.trigger("disable").

            //Sets the `disabled` attribute on the original select box
            attr("disabled", "disabled");

            //Makes the dropdown list not focusable by removing the `tabindex` attribute
            self.div.removeAttr("tabindex")

            //Enabled styling for disabled state
            .addClass("selectboxit-disabled");

            // Calls the jQueryUI Widget Factory disable method to make sure all options are correctly synced
            $.Widget.prototype.disable.call(self);

            //Provides callback function support
            self._callbackSupport(callback);

            //Maintains chainability
            return self;

        }

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