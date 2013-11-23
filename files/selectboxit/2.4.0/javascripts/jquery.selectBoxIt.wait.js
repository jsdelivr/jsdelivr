$(function() {

    //Wait
    // ---
    //    Delays execution by the amount of time
    //    specified by the parameter

    $.selectBox.selectBoxIt.prototype.wait = function(time, callback) {

        var self = this,

            // The timeout variable stores a Deferred Object, which will be resolved after the time specified in the parameter
            timeout = this.returnTimeout(time);

        // Once the Deferred object is resolved, call the callback function
        timeout.then(function() {

            // Provide callback function support
            self._callbackSupport(callback);

        });
        
        // Maintains chainability
        return self;

    };

    //Return timeout
    // -------------
    //    Returns a Deferred Object after the time
    //    specified by the parameter

    $.selectBox.selectBoxIt.prototype.returnTimeout = function(time) {

        //Returns a Deferred Object
        return $.Deferred(function(dfd) {

            //Call the JavaScript `setTimeout function and resolve the Deferred Object
            setTimeout(dfd.resolve, time);

        });

    };

});