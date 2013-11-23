// Output modes:
////////////////////////////////////////////////////////////////

// Each output mode gets its own closure, 
// distinct from the validity closure.

// Install the tooltip output.
(function($) {
    $.validity.outputs.tooltip = {
        tooltipClass:"validity-tooltip",
    
        start:function() {
            $("." + $.validity.outputs.tooltip.tooltipClass)
                .remove();
        },
        
        end:function(results) {
            /*// If not valid and scrollTo is enabled, scroll the page to the first error.
            if (!results.valid && $.validity.settings.scrollTo) {
                return;
                document.body.scrollTop = $("." + $.validity.outputs.tooltip.tooltipClass)
                    .offset()
                    .top;
            }*/
        },

        raise:function($obj, msg) {
            var pos = $obj.offset();
            pos.left += $obj.width() + 18;
            pos.top += 8;
            
            $(
                "<div class=\"validity-tooltip\">" + 
                    msg +
                    "<div class=\"validity-tooltip-outer\">" +
                        "<div class=\"validity-tooltip-inner\"></div>" + 
                    "</div>" +
                "</div>"
            )
                .click(function() {
                    $obj.focus();
                    $(this).fadeOut();
                })
                .css(pos)
                .hide()
                .appendTo("body")
                .fadeIn();
        },

        raiseAggregate:function($obj, msg) {
            // Just raise the error on the last input.
            if ($obj.length) {
                this.raise($obj.filter(":last"), msg);
            }
        }
    };
})(jQuery);


// Install the label output.
(function($) {
    function getIdentifier($obj) {
        return $obj.attr('id').length ?
            $obj.attr('id') :
            $obj.attr('name');
    }

    $.validity.outputs.label = {
        cssClass:"error",
    
        start:function() {
            // Remove all the existing error labels.
            $("." + $.validity.outputs.label.cssClass)
                .remove();
        },
        
        end:function(results) {
            // If not valid and scrollTo is enabled, scroll the page to the first error.
            if (!results.valid && $.validity.settings.scrollTo) {
                location.hash = $("." + $.validity.outputs.label.cssClass + ":eq(0)").attr('for');
            }
        },

        raise:function($obj, msg) {
            var 
                labelSelector = "." + $.validity.outputs.label.cssClass + "[for='" + getIdentifier($obj) + "']";

            // If an error label already exists for the bad input just update its text:
            if ($(labelSelector).length) {
                $(labelSelector).text(msg);
            }

            // Otherwize create a new one and stick it after the input:
            else {
                $("<label/>")
                    .attr("for", getIdentifier($obj))
                    .addClass($.validity.outputs.label.cssClass)
                    .text(msg)

                    // In the case that the element does not have an id
                    // then the for attribute in the label will not cause
                    // clicking the label to focus the element. This line 
                    // will make that happen.
                    .click(function() {
                        if ($obj.length) {
                            $obj[0].select();
                        }
                    })

                    .insertAfter($obj);
            }
        },

        raiseAggregate:function($obj, msg) {
            // Just raise the error on the last input.
            if ($obj.length) {
                this.raise($($obj.get($obj.length - 1)), msg);
            }
        }
    };
})(jQuery);

// Install the modal output.
(function($) {
    var 
        // Class to apply to modal errors.
        errorClass = "validity-modal-msg",
        
        // The selector for the element where modal errors will me injected semantically.
        container = "body";
        
    $.validity.outputs.modal = {
        start:function() {
            // Remove all the existing errors.
            $("." + errorClass).remove();
        },
        
        end:function(results) {
            // If not valid and scrollTo is enabled, scroll the page to the first error.
            if (!results.valid && $.validity.settings.scrollTo) {
                location.hash = $("." + errorClass + ":eq(0)").attr('id');
            }
        },

        raise:function($obj, msg) {
            if ($obj.length) {
                var 
                    off = $obj.offset(),
                    obj = $obj.get(0),

                    // Design a style object based off of the input's location.
                    errorStyle = {
                        left:parseInt(off.left + $obj.width() + 4, 10) + "px",
                        top:parseInt(off.top - 10, 10) + "px"
                    };
                    
                // Create one and position it next to the input.
                $("<div/>")
                    .addClass(errorClass)
                    .css(errorStyle)
                    .text(msg)
                    .click($.validity.settings.modalErrorsClickable ?
                        function() { $(this).remove(); } : null
                    )
                    .appendTo(container);
            }
        },

        raiseAggregate:function($obj, msg) {
            // Just raise the error on the last input.
            if ($obj.length) {
                this.raise($($obj.get($obj.length - 1)), msg);
            }
        }
    };
})(jQuery);

// Install the summary output
(function($) {
    var 
        // Container contains the summary. This is the element that is shown or hidden.
        container = ".validity-summary-container",
        
        // Erroneous refers to an input with an invalid value,
        // not the error message itself.
        erroneous = "validity-erroneous",
        
        // Selector for erroneous inputs.
        errors = "." + erroneous,
        
        // The wrapper for entries in the summary.
        wrapper = "<li/>",

        // Buffer to contain all the error messages that build up during validation.
        // When validation ends, it'll be flushed into the summary.
        // This way, the summary doesn't flicker empty then fill up.
        buffer = [];

    $.validity.outputs.summary = {
        start:function() {
            $(errors).removeClass(erroneous);
            buffer = [];
        },

        end:function(results) {
            // Hide the container and empty its summary.
            $(container)
                .hide()
                .find("ul")
                    .html('');

            // If there are any errors at all:
            // (Otherwise the container shouldn't be shown):
            if (buffer.length) {
                // Use integer based iteration for solution to Issue 7.
                for (var i = 0; i < buffer.length; ++i) {
                    $(wrapper)
                        .text(buffer[i])
                        .appendTo(container + " ul");
                }

                $(container).show();
                
                // If scrollTo is enabled, scroll the page to the first error.
                if ($.validity.settings.scrollTo) {
                    location.hash = $(errors + ":eq(0)").attr("id");
                }
            }
        },

        raise:function($obj, msg) {
            buffer.push(msg);
            $obj.addClass(erroneous);
        },

        raiseAggregate:function($obj, msg) {
            this.raise($obj, msg);
        },
        
        container:function() {
            document.write(
                "<div class=\"validity-summary-container\">" + 
                    "The form didn't submit for the following reason(s):" +
                    "<ul></ul>" +
                "</div>"
            );
        }
    };
})(jQuery);
