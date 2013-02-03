// Accessibility Module
// ====================

// Immediately-Invoked Function Expression (IIFE) [Ben Alman Blog Post](http://benalman.com/news/2010/11/immediately-invoked-function-expression/) that calls another IIFE that contains all of the plugin logic.  I used this pattern so that anyone viewing this code would not have to scroll to the bottom of the page to view the local parameters that were passed to the main IIFE.

(function (selectBoxIt) {

    //ECMAScript 5 Strict Mode: [John Resig Blog Post](http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/)
    "use strict";

    // Calls the second IIFE and locally passes in the global jQuery, window, and document objects
    selectBoxIt(window.jQuery, window, document);

}

// Locally passes in `jQuery`, the `window` object, the `document` object, and an `undefined` variable.  The `jQuery`, `window` and `document` objects are passed in locally, to improve performance, since javascript first searches for a variable match within the local variables set before searching the global variables set.  All of the global variables are also passed in locally to be minifier friendly. `undefined` can be passed in locally, because it is not a reserved word in JavaScript.

(function ($, window, document, undefined) {

    // ECMAScript 5 Strict Mode: [John Resig Blog Post](http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/)
    "use strict";

    //_ARIA Accessibility
    // ------------------
    //      Adds ARIA (Accessible Rich Internet Applications)
    //      Accessibility Tags to the Select Box

    $.selectBox.selectBoxIt.prototype._ariaAccessibility = function() {

        var self = this;

        //Adds `ARIA attributes` to the dropdown list
        self.div.attr({

            //W3C `combobox` description: A presentation of a select; usually similar to a textbox where users can type ahead to select an option.
            "role": "combobox",

            //W3C `aria-autocomplete` description: Indicates whether user input completion suggestions are provided.
            "aria-autocomplete": "list",

            //W3C `aria-expanded` description: Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed.
            "aria-expanded": "false",

            //W3C `aria-owns` description: The value of the aria-owns attribute is a space-separated list of IDREFS that reference one or more elements in the document by ID. The reason for adding aria-owns is to expose a parent/child contextual relationship to assistive technologies that is otherwise impossible to infer from the DOM.
            "aria-owns": self.list.attr("id"),

            //W3C `aria-activedescendant` description: This is used when a composite widget is responsible for managing its current active child to reduce the overhead of having all children be focusable. Examples include: multi-level lists, trees, and grids.
            "aria-activedescendant": self.listItems.eq(self.currentFocus).attr("id"),

            //W3C `aria-label` description:  It provides the user with a recognizable name of the object.
            "aria-label": $("label[for='" + self.originalElem.id + "']").text() || "",

            //W3C `aria-live` description: Indicates that an element will be updated.
            //Use the assertive value when the update needs to be communicated to the user more urgently.
            "aria-live": "assertive"
        }).

        //Dynamically adds `ARIA attributes` if the new dropdown list is enabled or disabled
        bind({

            //Select box custom `disable` event with the `selectBoxIt` namespace
            "disable.selectBoxIt" : function() {

                //W3C `aria-disabled` description: Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
                self.div.attr("aria-disabled", "true");

            },

            //Select box custom `enable` event with the `selectBoxIt` namespace
            "enable.selectBoxIt" : function() {

                //W3C `aria-disabled` description: Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
                self.div.attr("aria-disabled", "false");

            }

        });

        //Adds ARIA attributes to the dropdown list options list
        self.list.attr({

            //W3C `listbox` description: A widget that allows the user to select one or more items from a list of choices.
            "role": "listbox",

            //Indicates that the dropdown list options list is currently hidden
            "aria-hidden": "true"
        });

        //Adds `ARIA attributes` to the dropdown list options
        self.listItems.attr({

            //This must be set for each element when the container element role is set to `listbox`
            "role": "option"
        });

        //Dynamically updates the new dropdown list `aria-label` attribute after the original dropdown list value changes
        self.selectBox.bind({

            //Custom `change` event with the `selectBoxIt` namespace
            "change.selectBoxIt": function() {

                //Provides the user with a recognizable name of the object.
                self.divText.attr("aria-label", self.originalElem.value);

            },

            //Custom `open` event with the `selectBoxIt` namespace
            "open.selectBoxIt": function() {

                //Indicates that the dropdown list options list is currently visible
                self.list.attr("aria-hidden", "false");

                //Indicates that the dropdown list is currently expanded
                self.div.attr("aria-expanded", "true");

            },

            //Custom `close` event with the `selectBoxIt` namespace
            "close.selectBoxIt": function() {

                //Indicates that the dropdown list options list is currently hidden
                self.list.attr("aria-hidden", "true");

                //Indicates that the dropdown list is currently collapsed
                self.div.attr("aria-expanded", "false");

            }

        });

        //Maintains chainability
        return self;

    };

}));