/* jquery Selectboxit - v2.6.0 - 2013-1-8
* http://www.gregfranko.com/jQuery.selectBoxIt.js/
* Copyright (c) 2012 Greg Franko; Licensed MIT */

// Immediately-Invoked Function Expression (IIFE) [Ben Alman Blog Post](http://benalman.com/news/2010/11/immediately-invoked-function-expression/) that calls another IIFE that contains all of the plugin logic.  I used this pattern so that anyone viewing this code would not have to scroll to the bottom of the page to view the local parameters that were passed to the main IIFE.

;(function (selectBoxIt) {

    //ECMAScript 5 Strict Mode: [John Resig Blog Post](http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/)
    "use strict";

    // Calls the second IIFE and locally passes in the global jQuery, window, and document objects
    selectBoxIt(window.jQuery, window, document);

}

// Locally passes in `jQuery`, the `window` object, the `document` object, and an `undefined` variable.  The `jQuery`, `window` and `document` objects are passed in locally, to improve performance, since javascript first searches for a variable match within the local variables set before searching the global variables set.  All of the global variables are also passed in locally to be minifier friendly. `undefined` can be passed in locally, because it is not a reserved word in JavaScript.

(function ($, window, document, undefined) {

    // ECMAScript 5 Strict Mode: [John Resig Blog Post](http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/)
    "use strict";

    // Calling the jQueryUI Widget Factory Method
    $.widget("selectBox.selectBoxIt", {

        // Plugin version

        VERSION: "2.6.0",

        // These options will be used as defaults
        options: {

            // **showEffect**: Accepts String: "none", "fadeIn", "show", "slideDown", or any of the jQueryUI show effects (i.e. "bounce")
            "showEffect": "none",

            // **showEffectOptions**: Accepts an object literal.  All of the available properties are based on the jqueryUI effect options
            "showEffectOptions": {},

            // **showEffectSpeed**: Accepts Number (milliseconds) or String: "slow", "medium", or "fast"
            "showEffectSpeed": "medium",

            // **hideEffect**: Accepts String: "none", "fadeOut", "hide", "slideUp", or any of the jQueryUI hide effects (i.e. "explode")
            "hideEffect": "none",

            // **hideEffectOptions**: Accepts an object literal.  All of the available properties are based on the jqueryUI effect options
            "hideEffectOptions": {},

            // **hideEffectSpeed**: Accepts Number (milliseconds) or String: "slow", "medium", or "fast"
            "hideEffectSpeed": "medium",

            // **showFirstOption**: Shows the first dropdown list option within the dropdown list options list
            "showFirstOption": true,

            // **defaultText**: Overrides the text used by the dropdown list selected option to allow a user to specify custom text.  Accepts a String.
            "defaultText": "",

            // **defaultIcon**: Overrides the icon used by the dropdown list selected option to allow a user to specify a custom icon.  Accepts a String (CSS class name(s)).
            "defaultIcon": "",

            // **downArrowIcon**: Overrides the default down arrow used by the dropdown list to allow a user to specify a custom image.  Accepts a String (CSS class name(s)).
            "downArrowIcon": "",

            // **theme**: Provides theming support for Twitter Bootstrap and jQueryUI
            "theme": "bootstrap",

            // **keydownOpen**: Opens the dropdown if the up or down key is pressed when the dropdown is focused
            "keydownOpen": true,

            // **isMobile**: Function to determine if a user's browser is a mobile browser
            "isMobile": function() {

                // Adapted from http://www.detectmobilebrowsers.com
                var ua = navigator.userAgent || navigator.vendor || window.opera;

                // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                return (/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);

            },

            "nostyle": false,

            // **native**: Triggers the native select box when a user interacts with the drop down
            "native": false,

            // **aggressiveChange**: Will select a drop down item (and trigger a change event) when a user navigates to the item via the keyboard (up and down arrow or search), before a user selects an option with a click or the enter key
            "aggressiveChange": false

        },

        // _Create
        // -------
        //      Sets the Plugin Instance variables and
        //      constructs the plugin.  Only called once.
        _create: function() {

            var self = this;

            // The original select box DOM element
            self.originalElem = self.element[0];

            // The original select box DOM element wrapped in a jQuery object
            self.selectBox = self.element;

            // All of the original select box options
            self.selectItems = self.element.find("option");

            // The first option in the original select box
            self.firstSelectItem = self.element.find("option").slice(0, 1);

            // The index of the currently selected dropdown list option
            self.currentFocus = 0;

            // Keeps track of which blur events will hide the dropdown list options
            self.blur = true;

            // The html document height
            self.documentHeight = $(document).height();

            // Array holding all of the original select box options text
            self.textArray = [];

            // Maintains search order in the `search` method
            self.currentIndex = 0;

            // Whether or not the dropdown list opens up or down (depending on how much room is on the page)
            self.flipped = false;

            self.disabledClasses = (function() {

                if(self.options.theme === "bootstrap") {

                    return "disabled";

                }
                else if(self.options.theme === "jqueryui") {

                    return "ui-state-disabled";

                }
                else if(self.options.theme === "jquerymobile") {

                    return "ui-disabled";

                }
                else {

                    return "selectboxit-disabled";

                }

            }());

            // Creates the div elements that will become the dropdown
            // Creates the ul element that will become the dropdown options list
            // Hides the original select box and adds the new plugin DOM elements to the page
            // Hides the original select box and adds the new plugin DOM elements to the page
            // Adds event handlers to the new dropdown list
            self._createDiv()._createUnorderedList()._replaceSelectBox()._eventHandlers();

            if(self.originalElem.disabled && self.disable) {

                // Disables the dropdown list if the original dropdown list had the `disabled` attribute
                self.disable();

            }

            // If the Aria Accessibility Module has been included
            if(self._ariaAccessibility) {

                // Adds ARIA accessibillity tags to the dropdown list
                self._ariaAccessibility();

            }

            if(self.options["theme"] === "bootstrap") {

                // Adds Twitter Bootstrap classes to the dropdown list
                self._twitterbootstrap();

            }

            else if(this.options["theme"] === "jqueryui") {

                // Adds jQueryUI classes to the dropdown list
                self._jqueryui();

            }

            else if(this.options["theme"] === "jquerymobile") {

                // Adds jQueryUI classes to the dropdown list
                self._jquerymobile();

            }

            else {

                // Adds regular classes to the dropdown list
                self._addClasses();

            }

            // Adds mobile support
            self._mobile();

            // If the native option is set to true
            if(self.options["native"]) {

                // Triggers the native select box when a user is interacting with the drop down
                this._applyNativeSelect();

            }

            // Triggers a custom `create` event on the original dropdown list
            self.triggerEvent("create");

            // Maintains chainability
            return self;

        },

        // _Create Div
        // -----------
        //      Creates new div and span elements to replace
        //      the original select box with a dropdown list
        _createDiv: function() {

            var self = this;

            // Creates a span element that contains the dropdown list text value
            self.divText = $("<span/>", {

                // Dynamically sets the span `id` attribute
                "id": (self.originalElem.id || "") && self.originalElem.id + "SelectBoxItText",

                "class": "selectboxit-text",

                // IE specific attribute to not allow the element to be selected
                "unselectable": "on",

                // Sets the span `text` to equal the original select box default value
                "text": self.firstSelectItem.text()

            }).

            // Sets the HTML5 data attribute on the divText `span` element
            attr("data-val", self.originalElem.value);

            // Creates a span element that contains the dropdown list text value
            self.divImage = $("<i/>", {

                // Dynamically sets the span `id` attribute
                "id": (self.originalElem.id || "") && self.originalElem.id + "SelectBoxItDefaultIcon",

                "class": "selectboxit-default-icon",

                // IE specific attribute to not allow the element to be selected
                "unselectable": "on"

            });

            // Creates a div to act as the new dropdown list
            self.div = $("<span/>", {

                // Dynamically sets the div `id` attribute
                "id": (self.originalElem.id || "") && self.originalElem.id + "SelectBoxIt",

                "class": "selectboxit" + " " + (self.selectBox.attr("class") || ""),

                "style": self.selectBox.attr("style"),

                // Sets the div `name` attribute to be the same name as the original select box
                "name": self.originalElem.name,

                // Sets the div `tabindex` attribute to 0 to allow the div to be focusable
                "tabindex": self.selectBox.attr("tabindex") || "0",

                // IE specific attribute to not allow the element to be selected
                "unselectable": "on"

            }).

            // Appends the default text to the inner dropdown list div element
            append(self.divImage).append(self.divText);

            // Create the div container that will hold all of the dropdown list dom elements
            self.divContainer = $("<span/>", {

                "id": (self.originalElem.id || "") && self.originalElem.id + "SelectBoxItContainer",

                "class": "selectboxit-container"

            }).

            // Appends the inner dropdown list div element to the dropdown list container div element
            append(self.div);

            // Maintains chainability
            return self;

        },

        // _Create Unordered List
        // ----------------------
        //      Creates an unordered list element to hold the
        //        new dropdown list options that directly match
        //        the values of the original select box options
        _createUnorderedList: function() {

            // Storing the context of the widget
            var self = this,

                dataDisabled,

                optgroupClass,

                optgroupElement,

                iconClass,

                iconUrl,

                iconUrlClass,

                iconUrlStyle,

                // Declaring the variable that will hold all of the dropdown list option elements
                currentItem = "",

                // Creates an unordered list element
                createdList = $("<ul/>", {

                    // Sets the unordered list `id` attribute
                    "id": (self.originalElem.id || "") && self.originalElem.id + "SelectBoxItOptions",

                    "class": "selectboxit-options",

                    //Sets the unordered list `tabindex` attribute to -1 to prevent the unordered list from being focusable
                    "tabindex": -1

                });

            // Checks the `showFirstOption` plugin option to determine if the first dropdown list option should be shown in the options list.
            if (!self.options["showFirstOption"]) {

                // Excludes the first dropdown list option from the options list
                self.selectItems = self.selectBox.find("option").slice(1);
            }

            // Loops through the original select box options list and copies the text of each
            // into new list item elements of the new dropdown list
            self.selectItems.each(function(index) {

                optgroupClass = "";

                optgroupElement = "";

                dataDisabled = $(this).prop("disabled");

                iconClass = $(this).data("icon") || "";

                iconUrl = $(this).data("iconurl") || "";

                iconUrlClass = iconUrl ? "selectboxit-option-icon-url": "";

                iconUrlStyle = iconUrl ? 'style="background-image:url(\'' + iconUrl + '\');"': "";

                // If the current option being traversed is within an optgroup

                if($(this).parent().is("optgroup")) {

                    optgroupClass = "selectboxit-optgroup-option";

                    if($(this).index() === 0) {

                         optgroupElement = '<div class="selectboxit-optgroup-header" data-disabled="true">' + $(this).parent().first().attr("label") + '</div>';

                    }

                }

                // Uses string concatenation for speed (applies HTML attribute encoding)
                currentItem += optgroupElement + '<li id="' + index + '" data-val="' + self.htmlEscape(this.value) + '" data-disabled="' + dataDisabled + '" class="' + optgroupClass + " selectboxit-option" + ($(this).attr("class") || "") + '" style="' + ($(this).attr("style") || "") + '"><a class="selectboxit-option-anchor"><i class="selectboxit-option-icon ' + iconClass + ' ' + iconUrlClass + '"' + iconUrlStyle + '></i>' + self.htmlEscape($(this).text()) + '</a></li>';

                // Stores all of the original select box options text inside of an array
                // (Used later in the `searchAlgorithm` method)
                self.textArray[index] = $(this).text();

                // Checks the original select box option for the `selected` attribute
                if (this.selected) {

                    //Replace the default text with the selected option
                    self.divText.text($(this).text());

                    //Set the currently selected option
                    self.currentFocus = index;
                }

            });

            // If the `defaultText` option is being used
            if (self.options["defaultText"]) {

                //Overrides the current dropdown default text with the value the user specifies in the `defaultText` option
                self.divText.text(self.options["defaultText"]);
            }

            // If the `defaultText` HTML5 data attribute is being used
            if (self.selectBox.data("text")) {

                // Overrides the current dropdown default text with the value from the HTML5 `defaultText` value
                self.divText.text(self.selectBox.data("text"));

                self.options["defaultText"] = self.selectBox.data("text");

            }

            // Append the list item to the unordered list
            createdList.append(currentItem);

            // Stores the dropdown list options list inside of the `list` instance variable
            self.list = createdList;

            // Append the dropdown list options list to the div container element
            self.divContainer.append(self.list);

            // Stores the individual dropdown list options inside of the `listItems` instance variable
            self.listItems = self.list.find("li");

            // Sets the 'selectboxit-option-first' class name on the first drop down option
            self.listItems.first().addClass("selectboxit-option-first");


            // Sets the 'selectboxit-option-last' class name on the last drop down option
            self.listItems.last().addClass("selectboxit-option-last");

            // Set the disabled CSS class for select box options
            self.list.find("li[data-disabled='true']").not(".optgroupHeader").addClass(self.disabledClasses);

            // If the first select box option is disabled, and the user has chosen to not show the first select box option
            if (self.currentFocus === 0 && !self.options["showFirstOption"] && self.listItems.eq(0).hasClass(self.disabledClasses)) {

                //Sets the default value of the dropdown list to the first option that is not disabled
                self.currentFocus = +self.listItems.not(".ui-state-disabled").first().attr("id");

            }

            self.divImage.addClass(self.selectBox.data("icon") || self.options["defaultIcon"] || self.listItems.eq(self.currentFocus).find("i").attr("class"));

            self.divImage.attr("style", self.listItems.eq(self.currentFocus).find("i").attr("style"));

            //Maintains chainability
            return self;

        },

        // _Replace Select Box
        // -------------------
        //      Hides the original dropdown list and inserts
        //        the new DOM elements
        _replaceSelectBox: function() {

            var self = this;

            // Hides the original select box
            self.selectBox.css("display", "none").

            // Adds the new dropdown list to the page directly after the hidden original select box element
            after(self.divContainer);

            // The height of the dropdown list
            var height = self.div.height();

            // The down arrow element of the dropdown list
            self.downArrow = $("<i/>", {

                // Dynamically sets the span `id` attribute of the dropdown list down arrow
                "id": (self.originalElem.id || "") && self.originalElem.id + "SelectBoxItArrow",

                "class": "selectboxit-arrow",

                // IE specific attribute to not allow the dropdown list text to be selected
                "unselectable": "on"

            });

            // The down arrow container element of the dropdown list
            self.downArrowContainer = $("<span/>", {

                // Dynamically sets the span `id` attribute for the down arrow container element
                "id": (self.originalElem.id || "") && self.originalElem.id + "SelectBoxItArrowContainer",

                "class": "selectboxit-arrow-container",

                // IE specific attribute to not allow the dropdown list text to be selected
                "unselectable": "on"

            }).

            // Inserts the down arrow element inside of the down arrow container element
            append(self.downArrow);

            // Appends the down arrow element to the dropdown list
            self.div.append(this.options["nostyle"] ? self.downArrow : self.downArrowContainer);

            if (!self.options["nostyle"]) {

                // The dynamic CSS of the down arrow container element
                self.downArrowContainer.css({

                    "height": height + "px"

                });

                // Dynamically adds the `max-width` and `line-height` CSS styles of the dropdown list text element
                self.divText.css({

                    "line-height": self.div.css("height"),

                    "max-width": self.div.outerWidth() - (self.downArrowContainer.outerWidth() + self.divImage.outerWidth())
                
                });

                self.divImage.css({

                    "margin-top": height / 4

                });

                // Adds the `selectboxit-selected` class name to the currently selected drop down option
                self.listItems.removeClass("selectboxit-selected").eq(self.currentFocus).addClass("selectboxit-selected");

            }

            // Maintains chainability
            return self;

        },

        // _Scroll-To-View
        // ---------------
        //      Updates the dropdown list scrollTop value
        _scrollToView: function(type) {

            var self = this,

                // The current scroll positioning of the dropdown list options list
                listScrollTop = self.list.scrollTop(),

                // The height of the currently selected dropdown list option
                currentItemHeight = self.listItems.eq(self.currentFocus).height(),

                // The relative distance from the currently selected dropdown list option to the the top of the dropdown list options list
                currentTopPosition = self.listItems.eq(self.currentFocus).position().top,

                // The height of the dropdown list option list
                listHeight = self.list.height();

            // Scrolling logic for a text search
            if (type === "search") {

                // Increases the dropdown list options `scrollTop` if a user is searching for an option
                // below the currently selected option that is not visible
                if (listHeight - currentTopPosition < currentItemHeight) {

                    // The selected option will be shown at the very bottom of the visible options list
                    self.list.scrollTop(listScrollTop + (currentTopPosition - (listHeight - currentItemHeight)));

                }

                // Decreases the dropdown list options `scrollTop` if a user is searching for an option above the currently selected option that is not visible
                else if (currentTopPosition < -1) {

                    self.list.scrollTop(currentTopPosition - currentItemHeight);

                }
            }

            // Scrolling logic for the `up` keyboard navigation
            else if (type === "up") {

                // Decreases the dropdown list option list `scrollTop` if a user is navigating to an element that is not visible
                if (currentTopPosition < -1) {

                    self.list.scrollTop(listScrollTop - Math.abs(self.listItems.eq(self.currentFocus).position().top));

                }
            }

            // Scrolling logic for the `down` keyboard navigation
            else if (type === "down") {

                // Increases the dropdown list options `scrollTop` if a user is navigating to an element that is not fully visible
                if (listHeight - currentTopPosition < currentItemHeight) {

                    // Increases the dropdown list options `scrollTop` by the height of the current option item.
                    self.list.scrollTop((listScrollTop + (Math.abs(self.listItems.eq(self.currentFocus).position().top) - listHeight + currentItemHeight)));

                }
            }

            // Maintains chainability
            return self;

        },

        // _Callback
        // ---------
        //      Call the function passed into the method
        _callbackSupport: function(callback) {

            var self = this;

            // Checks to make sure the parameter passed in is a function
            if ($.isFunction(callback)) {

                // Calls the method passed in as a parameter and sets the current `SelectBoxIt` object that is stored in the jQuery data method as the context(allows for `this` to reference the SelectBoxIt API Methods in the callback function. The `div` DOM element that acts as the new dropdown list is also passed as the only parameter to the callback
                callback.call(self, self.div);

            }

            // Maintains chainability
            return self;

        },

        // Open
        // ----
        //      Opens the dropdown list options list
        open: function(callback) {

            var self = this;

            if (self._dynamicPositioning) {

                // Dynamically positions the dropdown list options list
                self._dynamicPositioning();

            }

            if(!this.list.is(":visible")) {

                // Triggers a custom "open" event on the original select box
                self.triggerEvent("open");

                // Determines what jQuery effect to use when opening the dropdown list options list
                switch (self.options["showEffect"]) {

                    // Uses `no effect`
                    case "none":

                        // Does not require a callback function because this animation will complete before the call to `scrollToView`
                        self.list.show();

                       // Updates the list `scrollTop` attribute
                       self._scrollToView("search");

                    break;

                    // Uses the jQuery `show` special effect
                    case "show":

                        // Requires a callback function to determine when the `show` animation is complete
                        self.list.show(self.options["showEffectSpeed"], function() {

                            // Updates the list `scrollTop` attribute
                            self._scrollToView("search");

                        });

                    break;

                   // Uses the jQuery `slideDown` special effect
                   case "slideDown":

                       // Requires a callback function to determine when the `slideDown` animation is complete
                       self.list.slideDown(self.options["showEffectSpeed"], function() {

                           // Updates the list `scrollTop` attribute
                           self._scrollToView("search");

                       });

                   break;

                  // Uses the jQuery `fadeIn` special effect
                  case "fadeIn":

                      // Does not require a callback function because this animation will complete before the call to `scrollToView`
                      self.list.fadeIn(self.options["showEffectSpeed"]);

                      // Updates the list `scrollTop` attribute
                      self._scrollToView("search");

                  break;

                  // If none of the above options were passed, then a `jqueryUI show effect` is expected
                  default:

                     // Allows for custom show effects via the [jQueryUI core effects](http://http://jqueryui.com/demos/show/)
                     self.list.show(self.options["showEffect"], self.options["showEffectOptions"], self.options["showEffectSpeed"], function() {

                         // Updates the list `scrollTop` attribute
                         self._scrollToView("search");

                     });

                 break;

                }

            }

            // Provide callback function support
            self._callbackSupport(callback);

            // Maintains chainability
            return self;

        },

        // Close
        // -----
        //      Closes the dropdown list options list
        close: function(callback) {

            var self = this;

            if(self.list.is(":visible")) {

                // Triggers a custom "close" event on the original select box
                self.triggerEvent("close");

                // Determines what jQuery effect to use when closing the dropdown list options list
                switch (self.options["hideEffect"]) {

                    // Uses `no effect`
                    case "none":

                        // Does not require a callback function because this animation will complete before the call to `scrollToView`
                        self.list.hide();

                        // Updates the list `scrollTop` attribute
                        self._scrollToView("search");

                    break;

                    // Uses the jQuery `hide` special effect
                    case "hide":

                        self.list.hide(self.options["hideEffectSpeed"]);

                    break;

                    // Uses the jQuery `slideUp` special effect
                    case "slideUp":

                    self.list.slideUp(self.options["hideEffectSpeed"]);

                    break;

                    // Uses the jQuery `fadeOut` special effect
                    case "fadeOut":

                        self.list.fadeOut(self.options["hideEffectSpeed"]);

                    break;

                    // If none of the above options were passed, then a `jqueryUI hide effect` is expected
                    default:

                        // Allows for custom hide effects via the [jQueryUI core effects](http://http://jqueryui.com/demos/hide/)
                        self.list.hide(self.options["hideEffect"], self.options["hideEffectOptions"], self.options["hideEffectSpeed"], function() {

                            //Updates the list `scrollTop` attribute
                            self._scrollToView("search");

                        });

                    break;
                }

            }

            // Provide callback function support
            self._callbackSupport(callback);

            // Maintains chainability
            return self;

        },


        // _Event Handlers
        // ---------------
        //      Adds event handlers to the new dropdown list
        _eventHandlers: function() {

            // LOCAL VARIABLES
            var self = this,

                upKey = 38,

                downKey = 40,

                enterKey = 13,

                backspaceKey = 8,

                tabKey = 9,

                spaceKey = 32,

                escKey = 27;

            // Select Box events
            this.div.bind({

                // `click` event with the `selectBoxIt` namespace
                "click.selectBoxIt": function() {

                    // Used to make sure the div becomes focused (fixes IE issue)
                    self.div.trigger("focus", true);

                    // The `click` handler logic will only be applied if the dropdown list is enabled
                    if (!self.originalElem.disabled) {

                        // Triggers the `click` event on the original select box
                        self.triggerEvent("click");

                        // If the dropdown list options list is visible when a user clicks on the dropdown list
                        if (self.list.is(":visible")) {

                            // Closes the dropdown list options list
                            self.close();
                        }

                        // If the dropdown list options list is not visible when a user clicks on the dropdown list
                        else {

                            // Shows the dropdown list options list
                            self.open();
                        }
                    }
                },

                // `mousedown` event with the `selectBoxIt` namespace
                "mousedown.selectBoxIt": function() {

                    // Stores data in the jQuery `data` method to help determine if the dropdown list gains focus from a click or tabstop.  The mousedown event fires before the focus event.
                    $(this).data("mdown", true);
                },

                // `blur` event with the `selectBoxIt` namespace.  Uses special blur logic to make sure the dropdown list closes correctly
                "blur.selectBoxIt": function() {

                    // If `self.blur` property is true
                    if (self.blur) {

                        // Triggers both the `blur` and `focusout` events on the original select box.
                        // The `focusout` event is also triggered because the event bubbles
                        // This event has to be used when using event delegation (such as the jQuery `delegate` or `on` methods)
                        // Popular open source projects such as Backbone.js utilize event delegation to bind events, so if you are using Backbone.js, use the `focusout` event instead of the `blur` event
                        self.triggerEvent("blur");

                        //If the dropdown options list is visible
                        if (self.list.is(":visible")) {
                            //Closes the dropdown list options list
                            self.close();
                        }
                    }
                },

                "focus.selectBoxIt": function(event, internal) {

                    // Stores the data associated with the mousedown event inside of a local variable
                    var mdown = $(this).data("mdown");

                    // Removes the jQuery data associated with the mousedown event
                    $(this).removeData("mdown");

                    // If a mousedown event did not occur and no data was passed to the focus event (this correctly triggers the focus event), then the dropdown list gained focus from a tabstop
                    if (!mdown && !internal) {

                        setTimeout(function() {

                            // Triggers the `tabFocus` custom event on the original select box
                            self.triggerEvent("tab-focus");

                        }, 0);

                    }

                    // Only trigger the `focus` event on the original select box if the dropdown list is hidden (this verifies that only the correct `focus` events are used to trigger the event on the original select box
                    if(!self.list.is(":visible") && !internal) {

                        //Triggers the `focus` default event on the original select box
                        self.triggerEvent("focus");

                    }

                },

                // `keydown` event with the `selectBoxIt` namespace.  Catches all user keyboard navigations
                "keydown.selectBoxIt": function(e) {

                    // Stores the `keycode` value in a local variable
                    var currentKey = e.keyCode;

                    // Supports keyboard navigation
                    switch (currentKey) {

                        // If the user presses the `down key`
                        case downKey:

                            // Prevents the page from moving down
                            e.preventDefault();

                            // If the plugin options allow keyboard navigation
                            if (self.moveDown) {

                                if(self.options["keydownOpen"]) {

                                    if(self.list.is(":visible")) {

                                        self.moveDown();

                                    }

                                    else {

                                        self.open();

                                    }

                                }

                                else {

                                    // Moves the focus down to the dropdown list option directly beneath the currently selected selectbox option
                                    self.moveDown();

                                }

                            }

                            if(self.options["keydownOpen"]) {

                                self.open();

                            }

                            break;

                        //If the user presses the `up key`
                        case upKey:

                            // Prevents the page from moving up
                            e.preventDefault();

                            // If the plugin options allow keyboard navigation
                            if (self.moveUp) {

                                if(self.options["keydownOpen"]) {

                                    if(self.list.is(":visible")) {

                                        self.moveUp();

                                    }

                                    else {

                                        self.open();

                                    }

                                }

                                else {

                                    // Moves the focus down to the dropdown list option directly beneath the currently selected selectbox option
                                    self.moveUp();

                                }

                            }

                            if(self.options["keydownOpen"]) {

                                self.open();

                            }

                            break;

                        // If the user presses the `enter key`
                        case enterKey:

                            var activeElem = self.list.find("li." + self.focusClass);
            
                            // If there is no active Elem yet
                            if(!activeElem.length) {

                                activeElem = self.listItems.first();

                            }

                            // Updates the dropdown list value
                            self._update(activeElem);

                            // Prevents the default event from being triggered
                            e.preventDefault();

                            // Checks to see if the dropdown list options list is open
                            if (self.list.is(":visible")) {

                                // Closes the dropdown list options list
                                self.close();

                            }

                            // Triggers the `enter` events on the original select box
                            self.triggerEvent("enter");

                            break;

                        // If the user presses the `tab key`
                        case tabKey:

                            // Triggers the custom `tab-blur` event on the original select box
                            self.triggerEvent("tab-blur");

                            break;

                        // If the user presses the `backspace key`
                        case backspaceKey:

                            // Prevents the browser from navigating to the previous page in its history
                            e.preventDefault();

                            // Triggers the custom `backspace` event on the original select box
                            self.triggerEvent("backspace");

                            break;

                        // If the user presses the `escape key`
                        case escKey:

                            // Closes the dropdown options list
                            self.close();

                            break;

                        // Default is to break out of the switch statement
                        default:

                            break;

                    }

                },

                // `keypress` event with the `selectBoxIt` namespace.  Catches all user keyboard text searches since you can only reliably get character codes using the `keypress` event
                "keypress.selectBoxIt": function(e) {

                    // Sets the current key to the `keyCode` value if `charCode` does not exist.  Used for cross
                    // browser support since IE uses `keyCode` instead of `charCode`.
                    var currentKey = e.charCode || e.keyCode,

                        // Converts unicode values to characters
                        alphaNumericKey = String.fromCharCode(currentKey);

                    // If the user presses the `space bar`
                    if (currentKey === spaceKey) {

                        // Prevents the browser from scrolling to the bottom of the page
                        e.preventDefault();

                    }

                    // If the plugin options allow text searches
                    if (self.search) {

                        // Calls `search` and passes the character value of the user's text search
                        self.search(alphaNumericKey, true, "");

                    }

                },

                // `mousenter` event with the `selectBoxIt` namespace .The mouseenter JavaScript event is proprietary to Internet Explorer. Because of the event's general utility, jQuery simulates this event so that it can be used regardless of browser.
                "mouseenter.selectBoxIt": function() {

                    // Trigger the `mouseenter` event on the original select box
                    self.triggerEvent("mouseenter");

                },

                // `mouseleave` event with the `selectBoxIt` namespace. The mouseleave JavaScript event is proprietary to Internet Explorer. Because of the event's general utility, jQuery simulates this event so that it can be used regardless of browser.
                "mouseleave.selectBoxIt": function() {

                    // Trigger the `mouseleave` event on the original select box
                    self.triggerEvent("mouseleave");

                }

            });

            // Select box options events that set the dropdown list blur logic (decides when the dropdown list gets
            // closed)
            self.list.bind({

                // `mouseover` event with the `selectBoxIt` namespace
                "mouseover.selectBoxIt": function() {

                    // Prevents the dropdown list options list from closing
                    self.blur = false;
                },

                // `mouseout` event with the `selectBoxIt` namespace
                "mouseout.selectBoxIt": function() {

                    // Allows the dropdown list options list to close
                    self.blur = true;
                },

                // `focusin` event with the `selectBoxIt` namespace
                "focusin.selectBoxIt": function() {

                    // Prevents the default browser outline border to flicker, which results because of the `blur` event
                    self.div.focus();
                }

            })

            // Select box individual options events bound with the jQuery `delegate` method.  `Delegate` was used because binding individual events to each list item (since we don't know how many there will be) would decrease performance.  Instead, we bind each event to the unordered list, provide the list item context, and allow the list item events to bubble up (`event bubbling`). This greatly increases page performance because we only have to bind an event to one element instead of x number of elements. Delegates the `click` event with the `selectBoxIt` namespace to the list items
            .delegate("li", "click.selectBoxIt", function() {

                self._update($(this));

                self.triggerEvent("option-click");

                // If the current drop down option is not disabled
                if ($(this).attr("data-disabled") === "false") {

                    // Closes the drop down list
                    self.close();

                }

            })

            // Delegates the `focus` event with the `selectBoxIt` namespace to the list items
            .delegate("li", "focus.selectBoxIt", function() {

                // Removes the hover class from the previous drop down option
                self.listItems.not($(this)).removeAttr("data-active");

                $(this).attr("data-active", "");

                if(self.options["aggressiveChange"]) {

                    self._update($(this));

                }

            });

            // Original dropdown list events
            self.selectBox.bind({

                // `change` event handler with the `selectBoxIt` namespace
                "change.selectBoxIt, internal-change.selectBoxIt": function(event, internal) {

                    // If the user called the change method
                    if(!internal) {

                        var currentOption = self.list.find('li[data-val="' + self.originalElem.value + '"]');

                        // If there is a dropdown option with the same value as the original select box element
                        if(currentOption.length) {

                            self.listItems.eq(self.currentFocus).removeClass(self.focusClass);

                            self.currentFocus = +currentOption.attr("id");



                        }

                    }

                    // Sets the new dropdown list text to the value of the current option
                    self.divText.text(self.listItems.eq(self.currentFocus).find("a").text()).attr("data-val", self.originalElem.value);

                    if(self.listItems.eq(self.currentFocus).find("i").attr("class")) {

                        self.divImage.attr("class", self.listItems.eq(self.currentFocus).find("i").attr("class")).addClass("selectboxit-default-icon");

                        self.divImage.attr("style", self.listItems.eq(self.currentFocus).find("i").attr("style"));
                    }

                    // Triggers a custom changed event on the original select box
                    self.triggerEvent("changed");

                },

                // `disable` event with the `selectBoxIt` namespace
                "disable.selectBoxIt": function() {

                    // Adds the `disabled` CSS class to the new dropdown list to visually show that it is disabled
                    self.div.addClass(self.disabledClasses);

                },

                // `enable` event with the `selectBoxIt` namespace
                "enable.selectBoxIt": function() {

                    // Removes the `disabled` CSS class from the new dropdown list to visually show that it is enabled
                    self.div.removeClass(self.disabledClasses);

                }

            });

            // Maintains chainability
            return self;

        },

        // _update
        // -------
        //      Updates the drop down and select box with the current value
        _update: function(elem) {

            var self = this;

            if (elem.attr("data-disabled") === "false") {

                // If the default text option is set and the current drop down option is not disabled
                if ((self.options["defaultText"] && self.divText.text() === self.options["defaultText"])) {

                    // Updates the dropdown list value
                    self.divText.text(self.listItems.eq(self.currentFocus).text()).

                    trigger("internal-change");

                }

                else {

                    // Sets the original dropdown list value and triggers the `change` event on the original select box
                    self.selectBox.val(elem.attr("data-val"));

                    // Sets `currentFocus` to the currently focused dropdown list option.
                    // The unary `+` operator casts the string to a number
                    // [James Padolsey Blog Post](http://james.padolsey.com/javascript/terse-javascript-101-part-2/)
                    self.currentFocus = +elem.attr("id");

                    // Triggers the dropdown list `change` event if a value change occurs
                    if (self.originalElem.value !== self.divText.attr("data-val")) {

                        self.triggerEvent("change");

                    }

                }

            }

        },

        // _addClasses
        // -----------
        //      Adds SelectBoxIt CSS classes
        _addClasses: function(obj) {

            var self = this,

                focusClass = obj.focusClasses || "selectboxit-focus",

                buttonClass = obj.buttonClasses || "selectboxit-btn",

                listClass = obj.listClasses || "selectboxit-dropdown";

            self.focusClass = focusClass;

            self.selectedClass = "selectboxit-selected";

            self.downArrow.addClass(self.selectBox.data("downarrow") || self.options["downArrowIcon"] || obj.arrowClasses);

            // Adds the correct container class to the dropdown list
            self.divContainer.addClass(obj.containerClasses);

            // Adds the correct class to the dropdown list
            self.div.addClass(buttonClass);

            // Adds the default class to the dropdown list options
            self.list.addClass(listClass);

            // Select box individual option events
            self.listItems.bind({

                // `focus` event with the `selectBoxIt` namespace
                "focus.selectBoxIt": function() {

                    // Adds the focus CSS class to the currently focused dropdown list option
                    $(this).addClass(focusClass);

                },

                // `blur` event with the `selectBoxIt` namespace
                "blur.selectBoxIt": function() {

                    // Removes the focus CSS class from the previously focused dropdown list option
                    $(this).removeClass(focusClass);

                }

            });

            // Select box events
            self.selectBox.bind({

                // `click` event with the `selectBoxIt` namespace
                "open.selectBoxIt": function() {

                    var currentElem = self.list.find("li[data-val='" + self.divText.attr("data-val") + "']");

                    // If no current element can be found, then select the first drop down option
                    if(!currentElem.length) {

                        currentElem = self.listItems.first();

                    }

                    self.currentFocus = +currentElem.attr("id");

                    var activeElem = self.listItems.eq(self.currentFocus);

                    // Removes the focus class from the dropdown list and adds the library focus class for both the dropdown list and the currently selected dropdown list option
                    self.div.removeClass(focusClass);

                    self.listItems.removeClass(self.selectedClass);

                    self.listItems.removeAttr("data-active").not(activeElem).removeClass(focusClass);

                    activeElem.addClass(focusClass).addClass(self.selectedClass);

                },

                "blur.selectBoxIt": function() {

                    self.div.removeClass(focusClass);

                },

                // `mousenter` event with the `selectBoxIt` namespace
                "mouseenter.selectBoxIt": function() {

                    self.div.addClass(focusClass);

                },

                // `mouseleave` event with the `selectBoxIt` namespace
                "mouseleave.selectBoxIt": function() {

                    // Removes the focus CSS class on the previously hovered drop down list option
                    self.div.removeClass(focusClass);

                }

            });

            self.listItems.bind({

                "mouseenter.selectBoxIt": function() {

                    // If the currently moused over drop down option is not disabled
                    if($(this).attr("data-disabled") === "false") {

                        self.listItems.removeAttr("data-active");

                        $(this).addClass(focusClass).attr("data-active", "");

                        // Sets the dropdown list individual options back to the default state and sets the focus CSS class on the currently hovered option
                        self.listItems.not($(this)).removeClass(focusClass);

                        $(this).addClass(focusClass);

                        self.currentFocus = +$(this).attr("id");

                    }

                },

                "mouseleave.selectBoxIt": function() {

                    // If the currently moused over drop down option is not disabled
                    if($(this).attr("data-disabled") === "false") {

                        // Removes the focus class from the previous drop down option
                        self.listItems.not($(this)).removeClass(focusClass).removeAttr("data-active");

                    }

                }

            });

            $(".selectboxit-option-icon").not(".selectboxit-default-icon").css("margin-top", self.downArrowContainer.height()/4);

            // Maintains chainability
            return self;

        },

        // _jqueryui
        // ---------
        //      Adds jQueryUI CSS classes
        _jqueryui: function() {

            var self = this;

            self._addClasses({

                focusClasses: "ui-state-focus",

                arrowClasses: "ui-icon ui-icon-triangle-1-s",

                buttonClasses: "ui-widget ui-state-default",

                listClasses: "ui-widget ui-widget-content",

                containerClasses: ""

            });

            // Maintains chainability
            return self;

        },

        // _twitterbootstrap
        // -----------------
        //      Adds Twitter Bootstrap CSS classes
        _twitterbootstrap: function() {

            var self = this;

            self._addClasses({

                focusClasses: "active",

                arrowClasses: "caret",

                buttonClasses: "btn",

                listClasses: "dropdown-menu",

                containerClasses: ""

            });

            // Maintains chainability
            return self;

        },

        // _jquerymobile
        // -------------
        //      Adds jQuery Mobile CSS classes
        _jquerymobile: function() {

            var self = this,
                theme = self.selectBox.attr("data-theme") || "c";

            self._addClasses({

                focusClasses: "ui-btn-active-" + theme + " ui-btn-down-" + theme,

                arrowClasses: "ui-icon ui-icon-arrow-d ui-icon-shadow",

                buttonClasses: "ui-btn ui-btn-icon-right ui-btn-corner-all ui-shadow ui-btn-up-" + theme,

                listClasses: "ui-btn ui-btn-icon-right ui-btn-corner-all ui-shadow ui-btn-up-" + theme,

                containerClasses: ""

            });

            // Maintains chainability
            return self;

        },

        // Destroy
        // -------
        //    Removes the plugin from the page

        destroy: function(callback) {

            var self = this;

            self._destroySelectBoxIt();

            // Calls the jQueryUI Widget Factory destroy method
            $.Widget.prototype.destroy.call(self);

            //Provides callback function support
            self._callbackSupport(callback);

            //Maintains chainability
            return self;

        },

        // Internal Destroy Method
        // -----------------------
        //    Removes the plugin from the page
        _destroySelectBoxIt: function() {

            var self = this;

            //Unbinds all of the dropdown list event handlers with the `selectBoxIt` namespace
            self.div.unbind(".selectBoxIt").

            //Undelegates all of the dropdown list event handlers with the `selectBoxIt` namespace
            undelegate(".selectBoxIt");

            //Remove all of the `selectBoxIt` DOM elements from the page
            self.divContainer.remove();

            //Triggers the custom `destroy` event on the original select box
            self.triggerEvent("destroy");

            // Shows the original dropdown list
            self.selectBox.removeAttr("style").show();

            //Maintains chainability
            return self;

        },

        // Refresh
        // -------
        //    The dropdown will rebuild itself.  Useful for dynamic content.

        refresh: function(callback) {

            var self = this;

            // Destroys the plugin and then recreates the plugin
            self._destroySelectBoxIt()._create(true)._callbackSupport(callback);

            self.triggerEvent("refresh");

            //Maintains chainability
            return self;

        },

        // Apply Native Select
        // -------------------
        //      The dropdown will use the native select box functionality

        _applyNativeSelect: function() {

            var self = this,
                currentOption;

            self.divContainer.css({

                "position": "static"

            });

            // Positions the original select box directly over top the new dropdown list using position absolute and "hides" the original select box using an opacity of 0.  This allows the mobile browser "wheel" interface for better usability.
            self.selectBox.css({

                "display": "block",

                "width": self.div.outerWidth(),

                "height": self.div.outerHeight(),

                "opacity": "0",

                "position": "absolute",

                "top": self.div.offset().top,

                "bottom": self.div.offset().bottom,

                "left": self.div.offset().left,

                "right": self.div.offset().right,

                "cursor": "pointer",

                "z-index": "999999"

            }).bind({

                "changed.selectBoxIt": function() {

                    currentOption = self.selectBox.find("option").filter(":selected");

                    // Sets the new dropdown list text to the value of the original dropdown list
                    self.divText.text(currentOption.text());

                    if(self.list.find('li[data-val="' + currentOption.val() + '"]').find("i").attr("class")) {

                        self.divImage.attr("class", self.list.find('li[data-val="' + currentOption.val() + '"]').find("i").attr("class")).addClass("selectboxit-default-icon");

                    }

                }

            });

        },

        _mobile: function(callback) {

            var self = this;

            if(this.options["isMobile"]()) {

                window.console.log('is mobile');

                self._applyNativeSelect();

            }

            //Maintains chainability
            return this;

        },

        // HTML Escape
        // -----------
        //      HTML encodes a string
        htmlEscape: function(str) {
    
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

        },

        // triggerEvent
        // ------------
        //      Trigger's an external event on the original select box
        triggerEvent: function(eventName) {

            var self = this,
                // Finds the currently option index
                currentIndex = self.options["showFirstOption"] ? self.currentFocus : ((self.currentFocus - 1) >= 0 ? self.currentFocus: 0 );

            // Triggers the custom option-click event on the original select box and passes the select box option
            self.selectBox.trigger(eventName, { "elem": self.selectBox.eq(currentIndex), "dropdown-elem": self.listItems.eq(self.currentFocus) });

            // Maintains chainability
            return self;

        }

    });

})); // End of core module