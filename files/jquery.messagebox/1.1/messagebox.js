/***********************************************************************************************************************
MessageBox - A jQuery Plugin to replace Javascript's window.alert(), window.confirm() and window.prompt() functions
    Author          : Gaspare Sganga
    Version         : 1.1
    License         : MIT
    Documentation   : http://gasparesganga.com/labs/jquery-message-box/
***********************************************************************************************************************/
(function($, undefined){
    // Global Variables
    var _active = false;
    var _queue  = [];
    
    // Default Settings
    var _defaults = {
        buttonDone  : "OK",
        buttonFail  : undefined,
        message     : "",
        input       : false,
        speed       : 200,
        top         : "25%",
        width       : undefined
    };

    $.MessageBoxSetup = function(options){
        $.extend(true, _defaults, options);
    };

    $.MessageBox = function(options){
        if (typeof options != "object") options = {message : options};
        var deferred = $.Deferred();
        var settings = $.extend(true, {}, _defaults, options);
        // Add MessageBox to the Queue
        _queue.push({
            deferred : deferred,
            settings : settings,
        });
        _ExecuteQueue();
        // Return Deferred
        return deferred.promise();
    };


    function _ExecuteQueue(){
        if (_active || !_queue.length) return;
        var queueItem   = _queue.shift();
        var settings    = queueItem.settings;
        _active = true;
        
        // Overlay
        var overlay = $("<div>", {
            id  : "messagebox_overlay"
        }).appendTo("body");
        
        // MessageBox
        var messageBox = $("<div>", {
            id  : "messagebox"
        }).data("queueItem", queueItem).appendTo(overlay);
        if (settings.width !== undefined) messageBox.width(settings.width);
        
        // Content
        var content = $("<div>", {
            id      : "messagebox_content",
            html    : settings.message
        }).appendTo(messageBox);
        
        // Input
        if (settings.input) {
            var input = (typeof settings.input == "boolean") ? $("<input>", {type : "text"}) : $(settings.input);
            input
                .attr("id", "messagebox_content_input")
                .appendTo(content)
                .trigger("focus");
        }
        
        // Buttons
        var buttons = $("<div>", {
            id  : "messagebox_buttons"
        }).appendTo(messageBox);
        $("<button>", {
            id      : "messagebox_button_done",
            text    : settings.buttonDone
        }).on("click", _Button_Click).appendTo(buttons);
        if (settings.buttonFail) $("<button>", {
            id      : "messagebox_button_fail",
            text    : settings.buttonFail
        }).on("click", _Button_Click).prependTo(buttons);
        
        // Attach Window's Events Handlers
        $(window)
            .on("resize",   {messageBox : messageBox}, _Window_Resize)
            .on("keydown",  _Window_KeyDown)
            .triggerHandler("resize");
        
        // Show MessageBox
        messageBox.animate({
            top : settings.top
        }, settings.speed);
    }


    // ******************************
    //  EVENTS
    // ******************************
    function _Button_Click(event){
        var $this       = $(event.currentTarget);
        var messageBox  = $this.closest("#messagebox");
        var inputValue  = messageBox.find("#messagebox_content_input").val();
        var queueItem   = messageBox.data("queueItem");
        messageBox.animate({
            top : "-100%"
        }, queueItem.settings.speed, function(){
            // Remove Window's Events Handlers
            $(window)
                .off("resize",  _Window_Resize)
                .off("keydown", _Window_KeyDown);
            // Remove Overlay
            $("#messagebox_overlay").remove();
            // Resolve or Reject Deferred
            if ($this.attr("id") == "messagebox_button_done") {
                queueItem.deferred.resolve(inputValue);
            } else {
                queueItem.deferred.reject(inputValue);
            }
            // Execute next Queue item
            _active = false;
            _ExecuteQueue();
        });
    }

    function _Window_Resize(event){
        var messageBox = event.data.messageBox;
        messageBox.css("left", ($(event.currentTarget).width() - messageBox.outerWidth()) / 2);
    }

    function _Window_KeyDown(event) {
        if (event.keyCode === 27) {
            if (!$("#messagebox_button_fail").trigger("click").length) $("#messagebox_button_done").trigger("click");
            return false;
        } else if (event.keyCode === 13) {
            $("#messagebox_button_done").trigger("click");
            return false;
        }
    }

}(jQuery));