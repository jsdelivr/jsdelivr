
    // Destroy Module
    // ==============

    // Destroy
    // -------
    //    Removes the plugin from the page

    selectBoxIt.destroy = function(callback) {

        // Stores the plugin context inside of the self variable
        var self = this;

        self._destroySelectBoxIt();

        // Calls the jQueryUI Widget Factory destroy method
        $.Widget.prototype.destroy.call(self);

        // Provides callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Internal Destroy Method
    // -----------------------
    //    Removes the plugin from the page

    selectBoxIt._destroySelectBoxIt = function() {

        // Stores the plugin context inside of the self variable
        var self = this;

        // Unbinds all of the dropdown list event handlers with the `selectBoxIt` namespace
        self.dropdown.unbind(".selectBoxIt").

        // Undelegates all of the dropdown list event handlers with the `selectBoxIt` namespace
        undelegate(".selectBoxIt");

        // If the original select box has been placed inside of the new drop down container
        if ($.contains(self.dropdownContainer[0], self.originalElem)) {

            // Moves the original select box before the drop down container
            self.dropdownContainer.before(self.selectBox);

        }

        // Remove all of the `selectBoxIt` DOM elements from the page
        self.dropdownContainer.remove();

        // Shows the original dropdown list
        self.selectBox.removeAttr("style").show();

        // Triggers the custom `destroy` event on the original select box
        self.triggerEvent("destroy");

        // Maintains chainability
        return self;

    };