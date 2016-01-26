$(function() {

    //Set Options
    // ----------
    //      Accepts an object to replace plugin options
    //      properties of the plugin options object

    $.selectBox.selectBoxIt.prototype.setOptions = function(newOptions, callback) {

        var self = this;

        $.Widget.prototype._setOptions.apply(self, arguments);

        // If the `showFirstOption` option is true
        if (self.options["showFirstOption"]) {

            // Shows the first option in the dropdown list
            self.listItems.eq(0).show();

        }

        // If the `showFirstOption` option is false
        else {

            // Hides the first option in the dropdown list
            self.listItems.eq(0).hide();

        }

        if(self.options["defaultIcon"]) {

            self.divImage.attr("class", self.options["defaultIcon"] + " selectboxit-arrow");

        }

        if(self.options["downArrowIcon"]) {

            self.downArrow.attr("class", self.options["downArrowIcon"] + " selectboxit-arrow");

        }

        // If the defaultText option is set, make sure the dropdown list default text reflects this value
        if (self.options["defaultText"]) {

            self.divText.text(self.options["defaultText"]);

        }

        // Provide callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

});