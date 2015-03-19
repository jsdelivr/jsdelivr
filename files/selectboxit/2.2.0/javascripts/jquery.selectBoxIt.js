/* jquery Selectboxit - v2.2.0 - 2012-12-13
* http://www.gregfranko.com/jQuery.selectBoxIt.js/
* Copyright (c) 2012 Greg Franko; Licensed MIT */

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

    // Calling the jQueryUI Widget Factory Method
    $.widget("selectBox.selectBoxIt", {

        // Plugin version

        VERSION: "2.2.0",

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
            "native": false

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

            // If the Mobile Module has been included
            if(self._mobile) {

                // Adds mobile support
                self._mobile();

            }

            // If the native option is set to true
            if(self.options["native"]) {

                // Triggers the native select box when a user is interacting with the drop down
                this._applyNativeSelect();

            }

            // Triggers a custom `create` event on the original dropdown list
            self.selectBox.trigger("create");

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

                optgroupClass = "",

                optgroupElement = "",

                iconClass,

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

                dataDisabled = $(this).prop("disabled");

                iconClass = $(this).data("icon") || "";

                // If the current option being traversed is within an optgroup

                if($(this).parent().is("optgroup")) {

                    optgroupClass = "selectboxit-optgroup-option";

                    if($(this).index() === 0) {

                         optgroupElement = '<div class="selectboxit-optgroup-header" data-disabled="true">' + $(this).parent().first().attr("label") + '</div>';

                    }

                    else {

                        optgroupElement = "";

                    }

                }

                // If the current option being traversed is not within an optgroup

                else {

                    optgroupClass = "";

                }

                // Uses string concatenation for speed (applies HTML attribute encoding)
                currentItem += optgroupElement + '<li id="' + index + '" data-val="' + self.htmlEscape(this.value) + '" data-disabled="' + dataDisabled + '" class="' + optgroupClass + " selectboxit-option" + ($(this).attr("class") || "") + '" style="' + ($(this).attr("style") || "") + '"><a class="selectboxit-option-anchor"><i class="selectboxit-option-icon ' + iconClass + '"></i>' + self.htmlEscape($(this).text()) + '</a></li>';

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
            self.list.find("li[data-disabled='true']").not(".optgroupHeader").addClass("ui-state-disabled");

            // If the first select box option is disabled, and the user has chosen to not show the first select box option
            if (self.currentFocus === 0 && !self.options["showFirstOption"] && self.listItems.eq(0).hasClass("ui-state-disabled")) {

                //Sets the default value of the dropdown list to the first option that is not disabled
                self.currentFocus = +self.listItems.not(".ui-state-disabled").first().attr("id");

            }

            self.divImage.addClass(self.selectBox.data("icon") || self.options["defaultIcon"] || self.listItems.eq(self.currentFocus).find("i").attr("class"));

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
                self.selectBox.trigger("open");

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
                self.selectBox.trigger("close");

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
                    self.div.focus();

                    // The `click` handler logic will only be applied if the dropdown list is enabled
                    if (!self.originalElem.disabled) {

                        // Triggers the `click` event on the original select box
                        self.selectBox.trigger("click");

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
                        // The `focusout` event was also triggered because the event bubbles
                        // This event has to be used when using event delegation (such as the jQuery `delegate` or `on` methods)
                        // Popular open source projects such as Backbone.js utilize event delegation to bind events, so if you are using Backbone.js, use the `focusout` event instead of the `blur` event
                        self.selectBox.trigger("blur").trigger("focusout");

                        //If the dropdown options list is visible
                        if (self.list.is(":visible")) {
                            //Closes the dropdown list options list
                            self.close();
                        }
                    }
                },

                "focus.selectBoxIt": function() {

                    // Stores the data associated with the mousedown event inside of a local variable
                    var mdown = $(this).data("mdown");

                    // Removes the jQuery data associated with the mousedown event
                    $(this).removeData('mdown');

                    // If a mousedown event did not occur and no data was passed to the focus event (this correctly triggers the focus event), then the dropdown list gained focus from a tabstop
                    if (!mdown) {

                        // Triggers the `tabFocus` custom event on the original select box
                        self.selectBox.trigger("tab-focus");
                    }

                    // Only trigger the `focus` event on the original select box if the dropdown list is hidden (this verifies that only the correct `focus` events are used to trigger the event on the original select box
                    if(!self.list.is(":visible")) {

                        //Triggers the `focus` default event on the original select box
                        self.selectBox.trigger("focus").trigger("focusin");

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

                            // Prevents the default event from being triggered
                            e.preventDefault();

                            // Checks to see if the dropdown list options list is open
                            if (self.list.is(":visible")) {

                                // Closes the dropdown list options list
                                self.close();

                            }

                            self._checkDefaultText();

                            // Triggers the `enter` events on the original select box
                            self.selectBox.trigger("enter");

                            break;

                        // If the user presses the `tab key`
                        case tabKey:

                            // Triggers the custom `tab-blur` event on the original select box
                            self.selectBox.trigger("tab-blur");

                            break;

                        // If the user presses the `backspace key`
                        case backspaceKey:

                            // Prevents the browser from navigating to the previous page in its history
                            e.preventDefault();

                            // Triggers the custom `backspace` event on the original select box
                            self.selectBox.trigger("backspace");

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
                    self.selectBox.trigger("mouseenter");

                },

                // `mouseleave` event with the `selectBoxIt` namespace. The mouseleave JavaScript event is proprietary to Internet Explorer. Because of the event's general utility, jQuery simulates this event so that it can be used regardless of browser.
                "mouseleave.selectBoxIt": function() {

                    // Trigger the `mouseleave` event on the original select box
                    self.selectBox.trigger("mouseleave");

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

                if (!$(this).data("disabled")) {

                    // Sets the original dropdown list value and triggers the `change` event on the original select box
                    self.selectBox.val($(this).attr("data-val"));

                    // Sets `currentFocus` to the currently focused dropdown list option.
                    // The unary `+` operator casts the string to a number
                    // [James Padolsey Blog Post](http://james.padolsey.com/javascript/terse-javascript-101-part-2/)
                    self.currentFocus = +this.id;

                    // Closes the list after selecting an option
                    self.close();

                    // Triggers the dropdown list `change` event if a value change occurs
                    if (self.originalElem.value !== self.divText.attr("data-val")) {

                        self.selectBox.trigger("change", true);

                    }

                    self._checkDefaultText();

                    // Triggers the custom option-click event on the original select box
                    self.selectBox.trigger("option-click");
                }
            })

            // Delegates the `focus` event with the `selectBoxIt` namespace to the list items
            .delegate("li", "focus.selectBoxIt", function() {

                if (!$(this).data("disabled")) {

                    // Sets the original select box current value and triggers the change event
                    self.originalElem.value = $(this).attr("data-val");

                    // Triggers the dropdown list `change` event if a value change occurs
                    if (self.originalElem.value !== self.divText.attr("data-val")) {

                        self.selectBox.trigger("change", true);

                    }
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
                    }

                    // Triggers a custom changed event on the original select box
                    self.selectBox.trigger("changed");

                },

                // `disable` event with the `selectBoxIt` namespace
                "disable.selectBoxIt": function() {

                    // Adds the `disabled` CSS class to the new dropdown list to visually show that it is disabled
                    self.div.addClass("ui-state-disabled");
                },

                // `enable` event with the `selectBoxIt` namespace
                "enable.selectBoxIt": function() {

                    // Removes the `disabled` CSS class from the new dropdown list to visually show that it is enabled
                    self.div.removeClass("ui-state-disabled");
                }

            });

            // Maintains chainability
            return self;

        },

        // _addClasses
        // -----------
        //      Adds SelectBoxIt CSS classes
        _addClasses: function(obj) {

            var self = this,

                focusClass = obj.focusClasses || "selectboxit-focus",

                hoverClass = obj.hoverClasses || "selectboxit-hover",

                buttonClass = obj.buttonClasses || "selectboxit-btn",

                listClass = obj.listClasses || "selectboxit-dropdown";

            self.focusClass = focusClass;

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

                    // Removes the jQueryUI hover class from the dropdown list and adds the jQueryUI focus class for both the dropdown list and the currently selected dropdown list option
                    self.div.removeClass(hoverClass).add(self.listItems.eq(self.currentFocus)).

                    addClass(focusClass);

                },

                "blur.selectBoxIt": function() {

                    self.div.removeClass(focusClass);

                },

                // `mousenter` event with the `selectBoxIt` namespace
                "mouseenter.selectBoxIt": function() {

                    self.div.addClass(hoverClass);

                },

                // `mouseleave` event with the `selectBoxIt` namespace
                "mouseleave.selectBoxIt": function() {

                    // Removes the hover CSS class on the previously hovered dropdown list option
                    self.div.removeClass(hoverClass);

                }

            });

            self.listItems.bind({

                "mouseenter.selectBoxIt": function() {

                    // Sets the dropdown list individual options back to the default state and sets the hover CSS class on the currently hovered option
                    self.listItems.removeClass(focusClass);

                    $(this).addClass(hoverClass);

                },

                "mouseleave.selectBoxIt": function() {

                    $(this).removeClass(hoverClass);

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

                hoverClasses: "ui-state-hover",

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

                hoverClasses: "",

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

                hoverClasses: "ui-btn-hover-" + theme,

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

            //Triggers the custom `destroy` event on the original select box and then shows the original dropdown list
            self.selectBox.trigger("destroy").show();

            //Maintains chainability
            return self;

        },

        // Refresh
        // -------
        //    The dropdown will rebuild itself.  Useful for dynamic content.

        refresh: function(callback) {

            var self = this;

            // Destroys the plugin and then recreates the plugin
            self._destroySelectBoxIt()._create()._callbackSupport(callback);

            self.selectBox.trigger("refresh");

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

                "cursor": "pointer"

            }).bind({

                "changed": function() {

                    currentOption = self.selectBox.find("option").filter(":selected");

                    // Sets the new dropdown list text to the value of the original dropdown list
                    self.divText.text(currentOption.text());

                    if(self.list.find('li[data-val="' + currentOption.val() + '"]').find("i").attr("class")) {

                        self.divImage.attr("class", self.list.find('li[data-val="' + currentOption.val() + '"]').find("i").attr("class")).addClass("selectboxit-default-icon");

                    }

                }

            });

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

        // Check Default Text
        // ------------------
        //      Default Text Option Logic
        _checkDefaultText: function() {

            var self = this;

            // If the default text option is set and the current drop down option is not disabled
            if (self.options["defaultText"] && self.divText.text() === self.options["defaultText"]) {

                // Updates the dropdown list value
                self.divText.text(self.listItems.eq(self.currentFocus).text()).

                trigger("internal-change", true);

            }

        },

        // Select Option
        // -------------
        //      Programatically selects a drop down option by either index or value
        selectOption: function(val, callback) {

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

        }

    });

})); // End of core module
$(function() {

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

});
$(function() {

    //Disable
    // ------
    //      Disables the new dropdown list

    $.selectBox.selectBoxIt.prototype.disable = function(callback) {

        var self = this;

        if(!self.options["disabled"]) {

            //Makes sure the dropdown list is closed
            self.close();

            //Triggers a `disable` custom event on the original select box
            self.selectBox.trigger("disable").

            //Sets the `disabled` attribute on the original select box
            attr("disabled", "disabled");

            //Makes the dropdown list not focusable by removing the `tabindex` attribute
            self.div.removeAttr("tabindex")

            //Enabled styling for disabled state
            .addClass("selectboxit-disabled");

            // Calls the jQueryUI Widget Factory disable method to make sure all options are correctly synced
            $.Widget.prototype.disable.call(self);

            //Provides callback function support
            self._callbackSupport(callback);

            //Maintains chainability
            return self;

        }

    };

    //_Is Disabled
    // -----------
    //      Checks the original select box for the
    //    disabled attribute

    $.selectBox.selectBoxIt.prototype._isDisabled = function(callback) {

        var self = this;

        //If the original select box is disabled
        if (self.originalElem.disabled) {

            //Disables the dropdown list
            self.disable();
        }

        //Maintains chainability
        return self;

    };

});
$(function() {

    //_Dynamic positioning
    // ------------------
    //      Dynamically positions the dropdown list options list

    $.selectBox.selectBoxIt.prototype._dynamicPositioning = function() {

        var self = this,

            // Returns the x and y coordinates of the dropdown list options list relative to the document
            listOffsetTop = self.div.offset().top,

            // The height of the dropdown list options list
            listHeight = self.list.data("max-height") || self.list.outerHeight(),

            // The height of the dropdown list DOM element
            selectBoxHeight = self.div.outerHeight(),

            windowHeight = $(window).height(),

            windowScrollTop = $(window).scrollTop(),

            topToBottom = (listOffsetTop + selectBoxHeight + listHeight <= windowHeight + windowScrollTop),

            bottomReached = !topToBottom;

        if(!self.list.data("max-height")) {

            self.list.data("max-height", self.list.outerHeight());

        }

        // Makes sure the original select box is hidden
        self.selectBox.css("display", "none");

        // If there is room on the bottom of the viewport to display the drop down options
        if (!bottomReached) {

            self.list.css("max-height", self.list.data("max-height"));

            // Sets custom CSS properties to place the dropdown list options directly below the dropdown list
            self.list.css("top", "auto");

        }

        // If there is room on the top of the viewport
        else if((self.div.offset().top - windowScrollTop) >= listHeight) {

            self.list.css("max-height", self.list.data("max-height"));

            // Sets custom CSS properties to place the dropdown list options directly above the dropdown list
            self.list.css("top", (self.div.position().top - self.list.outerHeight()));

        }

        // If there is not enough room on the top or the bottom
        else {

            var outsideBottomViewport = Math.abs((listOffsetTop + selectBoxHeight + listHeight) - (windowHeight + windowScrollTop)),

                outsideTopViewport = Math.abs((self.div.offset().top - windowScrollTop) - listHeight);

            // If there is more room on the bottom
            if(outsideBottomViewport < outsideTopViewport) {

                self.list.css("max-height", self.list.data("max-height") - outsideBottomViewport - (selectBoxHeight/2));

                self.list.css("top", "auto");

            }

            // If there is more room on the top
            else {

                self.list.css("max-height", self.list.data("max-height") - outsideTopViewport - (selectBoxHeight/2));

                // Sets custom CSS properties to place the dropdown list options directly above the dropdown list
                self.list.css("top", (self.div.position().top - self.list.outerHeight()));

            }

        }

        // Maintains chainability
        return self;

    };

});
$(function() {

    //Enable
    // -----
    //      Enables the new dropdown list

    $.selectBox.selectBoxIt.prototype.enable = function(callback) {

        var self = this;

        if(self.options["disabled"]) {

            // Triggers a `enable` custom event on the original select box
            self.selectBox.trigger("enable").

            // Removes the `disabled` attribute from the original dropdown list
            removeAttr("disabled");

            // Make the dropdown list focusable
            self.div.attr("tabindex", 0)

            // Disable styling for disabled state
            .removeClass("selectboxit-disabled");
            
            $.Widget.prototype.enable.call(self);

            // Provide callback function support
            self._callbackSupport(callback);

            }

            //Maintains chainability
            return self;

        };

});
$(function() {

    //Move Down
    // --------
    //      Handles the down keyboard navigation logic

    $.selectBox.selectBoxIt.prototype.moveDown = function(callback) {

        var self = this;

        // Increments `currentFocus`, which represents the currently focused list item `id` attribute.
        self.currentFocus += 1;

        // Determines whether the dropdown option the user is trying to go to is currently disabled
        var disabled = self.listItems.eq(self.currentFocus).data("disabled"),

            hasNextEnabled = self.listItems.eq(self.currentFocus).nextAll("li").not("[data-disabled='true']").first().length;

        // If the user has reached the top of the list
        if (self.currentFocus === self.listItems.length) {

            // Does not allow the user to continue to go up the list
            self.currentFocus -= 1;

        }

        // If the option the user is trying to go to is disabled, but there is another enabled option
        else if (disabled && hasNextEnabled) {

            // Blur the previously selected option
            self.listItems.eq(self.currentFocus - 1).blur();

            // Call the `moveDown` method again
            self.moveDown();

            // Exit the method
            return;

        }

        // If the option the user is trying to go to is disabled, but there is not another enabled option
        else if (disabled && !hasNextEnabled) {

            self.currentFocus -= 1;

        }

        // If the user has not reached the bottom of the unordered list
        else {

            // Blurs the previously focused list item
            // The jQuery `end()` method allows you to continue chaining while also using a different selector
            self.listItems.eq(self.currentFocus - 1).blur().end().

            // Focuses the currently focused list item
            eq(self.currentFocus).focus();

            // Calls `scrollToView` to make sure the `scrollTop` is correctly updated. The `down` user action
            self._scrollToView("down");

            // Triggers the custom `moveDown` event on the original select box
            self.selectBox.trigger("moveDown");

        }

        // Provide callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    //Move Up
    // ------
    //      Handles the up keyboard navigation logic
    $.selectBox.selectBoxIt.prototype.moveUp = function(callback) {

        var self = this;

        // Increments `currentFocus`, which represents the currently focused list item `id` attribute.
        self.currentFocus -= 1;

        // Determines whether the dropdown option the user is trying to go to is currently disabled
        var disabled = self.listItems.eq(self.currentFocus).data("disabled"),

            hasPreviousEnabled = self.listItems.eq(self.currentFocus).prevAll("li").not("[data-disabled='true']").first().length;

        // If the user has reached the top of the list
        if (self.currentFocus === -1) {

            // Does not allow the user to continue to go up the list
            self.currentFocus += 1;
        }

        // If the option the user is trying to go to is disabled and the user is not trying to go up after the user has reached the top of the list
        else if (disabled && hasPreviousEnabled) {

            // Blur the previously selected option
            self.listItems.eq(self.currentFocus + 1).blur();

            // Call the `moveUp` method again
            self.moveUp();

            // Exits the method
            return;
        }

        else if (disabled && !hasPreviousEnabled) {

            self.currentFocus += 1;

        }

        // If the user has not reached the top of the unordered list
        else {

            // Blurs the previously focused list item
            // The jQuery `end()` method allows you to continue chaining while also using a different selector
            self.listItems.eq(this.currentFocus + 1).blur().end().

            // Focuses the currently focused list item
            eq(self.currentFocus).focus();

            // Calls `scrollToView` to make sure the `scrollTop` is correctly updated. The `down` user action
            self._scrollToView("up");

            // Triggers the custom `moveDown` event on the original select box
            self.selectBox.trigger("moveUp");

        }

        // Provide callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

});
$(function() {

    // _Set Current Search Option
    // -------------------------
    //      Sets the currently selected dropdown list search option

    $.selectBox.selectBoxIt.prototype._setCurrentSearchOption = function(currentOption) {

        var self = this;

        // Does not change the current option if `showFirstOption` is false and the matched search item is the hidden first option.
        // Otherwise, the current option value is updated
        if (!(currentOption === 0 && !self.options["showFirstOption"]) && self.listItems.eq(currentOption).data("disabled") !== true) {

            // Updates the default dropdown list text
            self.divText.text(self.textArray[currentOption]);

            // Calls the `blur` event of the currently selected dropdown list option
            self.listItems.eq(self.currentFocus).blur();

            // Sets `currentIndex` to the currently selected dropdown list option
            self.currentIndex = currentOption;

            // Sets `currentFocus` to the currently selected dropdown list option
            self.currentFocus = currentOption;

            // Focuses the currently selected dropdown list option
            self.listItems.eq(self.currentFocus).focus();

            // Updates the scrollTop so that the currently selected dropdown list option is visible to the user
            self._scrollToView("search");

            // Triggers the custom `search` event on the original select box
            self.selectBox.trigger("search");

        }

        //Maintains chainability
        return self;

    };

    // _Search Algorithm
    // -----------------
    //      Uses regular expressions to find text matches
    $.selectBox.selectBoxIt.prototype._searchAlgorithm = function(currentIndex, alphaNumeric) {

        var self = this,

            // Boolean to determine if a pattern match exists
            matchExists = false,

            // Iteration variable used in the outermost for loop
            x,

            // Iteration variable used in the nested for loop
            y,

            // Variable used to cache the length of the text array (Small enhancement to speed up traversing)
            arrayLength;

        // Loops through the text array to find a pattern match
        for (x = currentIndex, arrayLength = self.textArray.length; x < arrayLength; x += 1) {

            // Nested for loop to help search for a pattern match with the currently traversed array item
            for (y = 0; y < arrayLength; y += 1) {

                // Searches for a match
                if (self.textArray[y].search(alphaNumeric) !== -1) {

                    // `matchExists` is set to true if there is a match
                    matchExists = true;

                    // Exits the nested for loop
                    y = arrayLength;

                }

            } // End nested for loop

            //If a match does not exist
            if (!matchExists) {

                // Sets the current text to the last entered character
                self.currentText = self.currentText.charAt(self.currentText.length - 1).

                // Escapes the regular expression to make sure special characters are seen as literal characters instead of special commands
                replace(/[|()\[{.+*?$\\]/g, "\\$0");

                // Resets the regular expression with the new value of `self.currentText`
                alphaNumeric = new RegExp(self.currentText, "gi");

            }

            // Searches based on the first letter of the dropdown list options text if the currentText < 2 characters
            if (self.currentText.length < 3) {

                alphaNumeric = new RegExp(self.currentText.charAt(0), "gi");

                //If there is a match based on the first character
                if ((self.textArray[x].charAt(0).search(alphaNumeric) !== -1)) {

                    //Sets properties of that dropdown list option to make it the currently selected option
                    self._setCurrentSearchOption(x);

                    //Increments the current index by one
                    self.currentIndex += 1;

                    //Exits the search
                    return false;

                }
            }

            // If `self.currentText` > 1 character
            else {

                // If there is a match based on the entire string
                if ((self.textArray[x].search(alphaNumeric) !== -1)) {

                    // Sets properties of that dropdown list option to make it the currently selected option
                    self._setCurrentSearchOption(x);

                    // Exits the search
                    return false;
                }
            }

            // If the current text search is an exact match
            if (self.textArray[x].toLowerCase() === self.currentText.toLowerCase()) {

                // Sets properties of that dropdown list option to make it the currently selected option
                self._setCurrentSearchOption(x);

                // Resets the current text search to a blank string to start fresh again
                self.currentText = "";

                // Exits the search
                return false;

            }
        }

        //Returns true if there is not a match at all
        return true;
    };

    // Search
    // ------
    //      Calls searchAlgorithm()
    $.selectBox.selectBoxIt.prototype.search = function(alphaNumericKey, rememberPreviousSearch, callback) {

        var self = this;

        // If the search method is being called internally by the plugin, and not externally as a method by a user
        if (rememberPreviousSearch) {

            // Continued search with history from past searches.  Properly escapes the regular expression
            self.currentText += alphaNumericKey.replace(/[|()\[{.+*?$\\]/g, "\\$0");

        }

        else {

            // Brand new search.  Properly escapes the regular expression
            self.currentText = alphaNumericKey.replace(/[|()\[{.+*?$\\]/g, "\\$0");

        }

        // Wraps the current user text search in a regular expression that is case insensitive and searches globally
        var alphaNumeric = new RegExp(self.currentText, "gi"),

            // Calls `searchAlgorithm` which searches an array that contains all of the dropdown list option values.
            notFound = self._searchAlgorithm(self.currentIndex, alphaNumeric);

        // Searches the list again if a match is not found.  This is needed, because the first search started at the array indece of the currently selected dropdown list option, and does not search the options before the current array indece.
        // If there are many similar dropdown list options, starting the search at the indece of the currently selected dropdown list option is needed to properly traverse the text array.
        if (notFound) {

            // Searches the dropdown list values starting from the beginning of the text array
            self._searchAlgorithm(0, alphaNumeric);

        }

        // Provide callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

});
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