
    // Set Options Module
    // ==================

    // Set Options
    // ----------
    //      Accepts an object to replace plugin options
    //      properties of the plugin options object

    selectBoxIt.setOptions = function(newOptions, callback) {

        var self = this,
            firstOption = self.listItems.eq(0);

        $.Widget.prototype._setOptions.apply(self, arguments);

        // If the `showFirstOption` option is true
        if (self.options["showFirstOption"]) {

            // Shows the first option in the dropdown list
            firstOption.show();

        }

        // If the `showFirstOption` option is false
        else {

            // Hides the first option in the dropdown list
            firstOption.hide();

        }

        if(self.options["defaultIcon"]) {

            self.dropdownImage.attr("class", self.options["defaultIcon"] + " selectboxit-arrow");

        }

        if(self.options["downArrowIcon"]) {

            self.downArrow.attr("class", self.options["downArrowIcon"] + " selectboxit-arrow");

        }

        // If the defaultText option is set, make sure the dropdown list default text reflects this value
        if (self.options["defaultText"]) {

            self._setText(self.dropdownText, self.options["defaultText"]);

        }

        // Provide callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };