$(function() {

    // Select Option
    // -------------
    //      Programatically selects a drop down option by either index or value

    $.selectBox.selectBoxIt.prototype.selectOption = function(val, callback) {

        // Stores the plugin context inside of the self variable
        var self = this;

        // Makes sure the passed in position is a number
        if(typeof val === "number") {

            // Set's the original select box value and triggers the change event (which SelectBoxIt listens for)
            self.selectBox.val(self.selectBox.find("option").eq(val).val()).change();

        }

        else if(typeof val === "string") {

            // Set's the original select box value and triggers the change event (which SelectBoxIt listens for)
            self.selectBox.val(val).change();

        }

        // Calls the callback function
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

});