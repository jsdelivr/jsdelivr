$(function() {

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

});