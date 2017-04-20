/***********************************************************************************************************************
MessageBox - A jQuery Plugin to replace Javascript's window.alert(), window.confirm() and window.prompt() functions
    Author          : Gaspare Sganga
    Version         : 2.2.1
    License         : MIT
    Documentation   : http://gasparesganga.com/labs/jquery-message-box/
***********************************************************************************************************************/
(function($, undefined){
    // Default Settings
    var _defaults = {
        buttonDone      : "OK",
        buttonFail      : undefined,
        buttonsOrder    : "done fail",
        customClass     : "",
        filterDone      : undefined,
        filterFail      : undefined,
        input           : false,
        message         : "",
        queue           : true,
        speed           : 200,
        top             : "25%",
        width           : "auto"
    };
    
    // Required CSS
    var _css = {
        overlay : {
            "box-sizing"    : "border-box",
            "display"       : "flex",
            "flex-flow"     : "column nowrap",
            "align-items"   : "center",
            "position"      : "fixed",
            "top"           : "0",
            "left"          : "0",
            "width"         : "100%",
            "height"        : "100%"
        },
        spacer : {
            "box-sizing"    : "border-box",
            "flex"          : "0 1 auto"
        },
        messagebox : {
            "box-sizing"    : "border-box",
            "flex"          : "0 1 auto",
            "display"       : "flex",
            "flex-flow"     : "column nowrap",
        },
        content : {
            "box-sizing"    : "border-box",
            "flex"          : "0 1 auto",
            "overflow-y"    : "auto"
        },
        buttons : {
            "box-sizing"    : "border-box",
            "flex"          : "0 0 auto"
        },
        boxSizing : {
            "box-sizing"    : "border-box"
        }
    };
    
    // Globals
    var _active         = undefined;
    var _activeStack    = [];
    var _queue          = [];
    
    // Constants
    var _constants = {
        buttonDoneName          : "buttonDone",
        buttonFailName          : "buttonFail",
        errorSpeed              : 200,
        keyCodeDone             : [13],
        keyCodeFail             : [27],
        maxHeightCoefficient    : 1.5,
        topBuffer               : 100
    };
    
    
    // **************************************************
    //  METHODS
    // **************************************************
    $.MessageBoxSetup = function(options){
        $.extend(true, _defaults, options);
    };
    
    $.MessageBox = function(options){
        if (!$.isPlainObject(options)) options = {message : options};
        var deferred    = $.Deferred();
        var settings    = $.extend(true, {}, _defaults, options);
        settings.top = $.trim(settings.top).toLowerCase();
        
        // Remove focus from active element
        $(document.activeElement).not(".messagebox_content_input").trigger("blur");
        
        // Create MessageBox instance
        var instance = {
            deferred    : deferred,
            keyCodes    : {},
            settings    : settings
        };
        if (settings.queue) {
            _queue.push(instance);
            _ExecuteQueue();
        } else {
            if (_active) _activeStack.push(_active);
            _CreateMessageBox(instance);
        }
        
        // Return Promise
        return deferred.promise();
    };
    
    
    // **************************************************
    //  FUNCTIONS
    // **************************************************
    function _ExecuteQueue(){
        if (_active || !_queue.length) return;
        _CreateMessageBox(_queue.shift());
    }
    
    function _CreateMessageBox(instance){   
        var settings = instance.settings;
        _active = instance;
        
        // Overlay
        var overlay = $("<div>", {
            class   : "messagebox_overlay"
        })
        .css(_css.overlay)
        .appendTo("body");
        
        // Spacer
        var spacer = $("<div>", {
            class   : "messagebox_spacer"
        })
        .css(_css.spacer)
        .appendTo(overlay);
        
        // MessageBox
        var messageBox = $("<div>", {
            class   : "messagebox"
        })
        .addClass(settings.customClass)
        .css(_css.messagebox)
        .data("instance", instance)
        .appendTo(overlay);
        if (settings.width) messageBox.outerWidth(settings.width);
        
        // Content
        var content = $("<div>", {
            class   : "messagebox_content",
            html    : settings.message
        })
        .css(_css.content)
        .appendTo(messageBox);
        
        // Input
        if (settings.input !== false && settings.input !== undefined && settings.input !== null) {
            var inputs = $("<div>", {
                class   : "messagebox_content_inputs",
                css     : _css.boxSizing
            }).appendTo(content);
            _ParseInputs(settings.input).appendTo(inputs).first().trigger("focus");
        }
        
        // Error
        $("<div>", {
            class   : "messagebox_content_error",
            css     : _css.boxSizing
        })
        .hide()
        .appendTo(content);
        
        // Buttons
        var buttonsWrapper = $("<div>", {
            class   : "messagebox_buttons"
        })
        .css(_css.buttons)
        .appendTo(messageBox);
        
        // Button Done
        if (settings.buttonDone) {
            var buttons = $([]);
            if (typeof settings.buttonDone === "string") {
                buttons = buttons.add(_CreateButton("messagebox_button_done", _constants.buttonDoneName, {
                    text    : settings.buttonDone, 
                    keyCode : _constants.keyCodeDone.concat(settings.buttonFail ? [] : _constants.keyCodeFail)
                }, instance));
            } else {
                $.each(settings.buttonDone, function(name, definition){
                    buttons = buttons.add(_CreateButton("messagebox_button_done", name, definition, instance));
                });
            }
            buttons.appendTo(buttonsWrapper);
        }
        
        // Button Fail
        if (settings.buttonFail) {
            var buttons = $([]);
            if (typeof settings.buttonFail === "string") {
                buttons = buttons.add(_CreateButton("messagebox_button_fail", _constants.buttonFailName, {
                    text    : settings.buttonFail, 
                    keyCode : _constants.keyCodeFail
                }, instance));
            } else {
                $.each(settings.buttonFail, function(name, definition){
                    buttons = buttons.add(_CreateButton("messagebox_button_fail", name, definition, instance));
                });
            }
            if ($.trim(settings.buttonsOrder).toLowerCase().indexOf("d") === 0) {
                buttons.appendTo(buttonsWrapper);
            } else {
                buttons.prependTo(buttonsWrapper);
            }
        }
        
        // Calculate spacer's height
        var spacerHeight    = 0;
        var spacerTopMargin = 0 - messageBox.outerHeight() - _constants.topBuffer;;
        if ($.trim(settings.top).toLowerCase() === "auto") {
            // Auto: center vertically using flexbox
            overlay.css("justify-content", "center");
            spacerTopMargin = spacerTopMargin - $(window).height();
        } else {
            // Custom: use a spacer element to workoround different browsers' flexbox specs interpretation
            overlay.css("justify-content", "flex-start");
            spacerHeight = settings.top;;
            // Calculate max-height
            if ($.trim(settings.top).toLowerCase().slice(-1) === "%")  {
                // Percentage: set a fixed percentage value too
                messageBox.css("max-height", 100 - (parseInt(settings.top, 10) * _constants.maxHeightCoefficient) + "%");
            } else {
                // Fixed: refresh on every window.resize event
                messageBox.data("fRefreshMaxHeight", true);
            }
        }
        
        // Show MessageBox    
        spacer
            .data("spacerTopMargin", spacerTopMargin)
            .css({
                "height"        : 0,
                "margin-top"    : spacerTopMargin
            })
            .animate({
                "height"        : spacerHeight,
                "margin-top"    : 0
            }, settings.speed, function(){
                _SetMaxHeight(messageBox, $(window).height());
            });
    }
    
    
    function _CreateButton(mainClass, name, definition, instance){
        if (typeof definition === "string") definition = {text : definition};
        // Button
        var button = $("<button>", {
            class   : mainClass,
            text    : definition.text || ""
        })
        .addClass(definition.class)
        .css(_css.boxSizing)
        .on("click", {name : name}, _Button_Click);
        
        // KeyCodes
        $.each(_ParseKeycodes(definition.keyCode), function(i, keyCode){
            instance.keyCodes[keyCode] = button;
        });
        
        return button;
    }
    
    function _ParseKeycodes(keyCodes){
        if (typeof keyCodes === "number" || typeof keyCodes === "string") keyCodes = [keyCodes];
        var ret = [];
        if ($.isArray(keyCodes)) {
            ret = $.map(keyCodes, function(keycode){
                return parseInt(keycode, 10) || undefined;
            });
        }
        return ret;
    }
    
    
    function _ParseInputs(settingsInput){
        // Boolean: plain textbox
        if (settingsInput === true || typeof settingsInput === "string") {
            return _FormatInput($("<input>", {
                value   : (settingsInput === true) ? "" : settingsInput,
                type    : "text"
            }), {
                autotrim    : true
            });
        }
        
        // Array: plain textboxes with default values
        if ($.isArray(settingsInput)) {
            var ret = $([]);
            $.each(settingsInput, function(i, value){
                ret = ret.add(_FormatInput($("<input>", {
                    value   : value,
                    type    : "text"
                }), {
                    autotrim    : true
                }));
            });
            return ret;
        }
        
        // Object: multiple inputs
        if ($.isPlainObject(settingsInput)) {
            var ret = $([]);
            $.each(settingsInput, function(name, definition){
                var input = _CreateInput(name, definition);
                if (definition.label !== undefined) {
                    var label = $("<label>", {
                        class   : "messagebox_content_label",
                        css     : _css.boxSizing,
                        text    : definition.label
                    });
                    input.appendTo(label);
                    ret = ret.add(label);
                } else {
                    ret = ret.add(input);
                }
            });
            return ret;
        }
        
        // Default: custom jQuery object/selector or DOM element
        return $(settingsInput);
    }
    
    function _CreateInput(name, definition){
        var type = $.trim(definition.type).toLowerCase();
        switch (type) {
            case "select":
                var select  = _FormatInput($("<select>"), {
                    name        : name, 
                    title       : definition.title,
                    autotrim    : false
                });
                var options = !$.isArray(definition.options) ? definition.options : definition.options.reduce(function(ret, item){
                    ret[item] = item;
                    return ret;
                }, {});
                if (!options) {
                    _Warning('No options provided for "' + name + '"'); 
                    options = {"" : "&nbsp;"};
                }
                var defaultSelected = false;
                $.each(options, function(value, html){
                    var option = $("<option>", {
                        value   : value,
                        html    : html
                    }).appendTo(select);
                    if (definition.default == value) {
                        option.prop("selected", true);
                        defaultSelected = true;
                    }
                });
                // Fake placeholder
                if (!defaultSelected) {
                    $("<option>", {
                        value   : "",
                        text    : definition.title
                    }).prop({
                        "disabled"  : true,
                        "selected"  : true,
                        "hidden"    : true
                    }).prependTo(select);
                    select.find("option").css("color", select.css("color"));  
                    select
                        .addClass("messagebox_content_input_selectplaceholder")
                        .prop("selectedIndex", 0)
                        .one("change", function(){
                            select.find("option").css("color", "");
                            select.removeClass("messagebox_content_input_selectplaceholder");
                        });
                }
                return select;
                
            case "text":
            case "password":
            default:
                return _FormatInput($("<input>", {
                    type        : (type === "password") ? "password" : "text",
                    maxlength   : definition.maxlength,
                    placeholder : definition.title,
                    value       : definition.default
                }), {
                    name        : name, 
                    title       : definition.title,
                    autotrim    : definition.autotrim
                });
        }
    }
    
    function _FormatInput(input, par){
        if (par.autotrim !== false) input.on("blur", _Input_Blur);
        return input
            .addClass("messagebox_content_input")
            .css(_css.boxSizing)
            .attr({
                name    : par.name,
                title   : par.title
            });
    }
    
    function _GetInputsValues(messageBox){
        var names   = [];
        var values  = [];
        messageBox.find(".messagebox_content_inputs").find("input, select").each(function(){
            var input = $(this);
            names.push(input.attr("name"));
            values.push(input.val());
        });
        if (!values.length) return undefined;
        var retObject   = {};
        var valuesOnly  = false;
        $.each(names, function(i, name){
            if (name === undefined) {
                valuesOnly = true;
                return false;
            }
            retObject[name] = values[i];
        });
        if (valuesOnly && values.length === 1) return values[0];
        return valuesOnly ? values : retObject;
    }
    
    
    function _SetMaxHeight(messageBox, h){
        if (messageBox.data("fRefreshMaxHeight")) messageBox.css("max-height", h - (messageBox.offset().top * _constants.maxHeightCoefficient));
    }
    
    function _Warning(message){
        message = "jQuery MessageBox Warning: " + message;
        if (window.console.warn) {
            console.warn(message);
        } else if (window.console.log) {
            console.log(message);
        }
    }
    
    
    // **************************************************
    //  EVENTS
    // **************************************************
    function _Input_Blur(event){
        var input = $(event.currentTarget);
        input.val($.trim(input.val()));
    }
    
    function _Button_Click(event){
        var button      = $(event.currentTarget);
        var buttonName  = event.data.name;
        var messageBox  = button.closest(".messagebox");
        var overlay     = messageBox.closest(".messagebox_overlay");
        var spacer      = overlay.children(".messagebox_spacer").first();
        var content     = messageBox.children(".messagebox_content").first();
        var error       = content.children(".messagebox_content_error").first();
        var instance    = messageBox.data("instance");
        var inputValues = _GetInputsValues(messageBox);
        var filterFunc  = button.hasClass("messagebox_button_done") ? instance.settings.filterDone : instance.settings.filterFail;
        
        // Filter
        error.hide().empty();
        var filterDef = ($.type(filterFunc) !== "function") ? $.Deferred().resolve() : $.when(filterFunc(inputValues, buttonName)).then(function(ret){
            // Bool false: abort
            if (ret === false) return $.Deferred().reject();
            var retType = $.type(ret);
            // Error: display error message and abort (NOTE: it requires jQuery 1.9+ or it will fall in the next case)
            if (retType === "error") return $.Deferred().reject(ret.message);
            // String or (jQuery) Object: display error and abort
            if (retType === "string" || retType === "object" || retType === "array") return $.Deferred().reject(ret);
            // Everything else: continue
            return $.Deferred().resolve();
        });
        
        filterDef.then(function(){
            spacer.animate({
                "height"        : 0,
                "margin-top"    : spacer.data("spacerTopMargin")
            }, instance.settings.speed, function(){
                // Remove DOM objects
                overlay.remove();
                
                // Resolve or Reject Deferred
                if (button.hasClass("messagebox_button_done")) {
                    instance.deferred.resolve(inputValues, buttonName);
                } else {
                    instance.deferred.reject(inputValues, buttonName);
                }
                
                if (_activeStack.length) {
                    // Restore the last active instance
                    _active = _activeStack.pop();
                } else {
                    // Execute next Queue instance
                    _active = undefined;
                    _ExecuteQueue();
                }
            });
        }, function(errorMessage){
            var errorMessageType = $.type(errorMessage);
            if (errorMessageType === "string" || errorMessageType === "object" || errorMessageType === "array") {
                error.css("max-width", content.width()).append(errorMessage).slideDown(_constants.errorSpeed, function(){
                    content.scrollTop(content.height());
                });
            }
        });
    }
    
    function _Window_Resize(event){
        if (!_active) return;
        var w = $(event.currentTarget).width();
        var h = $(event.currentTarget).height();
        $(document).find(".messagebox").each(function(){
            var messageBox = $(this);
            messageBox.css("min-width", (messageBox.outerWidth() > w) ? w : "");
            _SetMaxHeight(messageBox, h);
        });
    }
    
    function _Window_KeyDown(event){
        if (!_active) return;
        var button = _active.keyCodes[event.which];
        if (button) {
            button.closest(".messagebox").find(".messagebox_content_input").trigger("blur");
            button.trigger("click");
        }
    }
    
    
    $(function(){
        $(window)
            .on("resize",   _Window_Resize)
            .on("keydown",  _Window_KeyDown);
    });
    
}(jQuery));