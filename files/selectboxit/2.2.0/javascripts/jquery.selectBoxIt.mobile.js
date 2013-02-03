$(function() {

    // Mobile
    // ------
    //      Supports mobile browsers

    $.selectBox.selectBoxIt.prototype._mobile = function(callback) {

        if(this.options["isMobile"]()) {

            this._applyNativeSelect();

        }

        //Maintains chainability
        return this;

    };

});