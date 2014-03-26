YUI.add('gallery-button-plugin', function (Y, NAME) {

/**
	Node plugin to handle toggle buttons and groups of mutually exclusive toggle buttons.
	Searches a given container for buttons marked with the `yui3-button-toggle` className
	and turns them into toggle buttons and also any HTML element with the `yui3-button-group-exclusive`
	className and makes the toggle buttons within it mutually exclussive.
	Adds the `selected` attribute, for toggle buttons it tells whether the button is in the pressed state,
	for groups of toggles points to the button currently presssed.
	Relies on the cssbutton module for styling.
	@module gallery-button-plugin
*/
/**
	@class ButtonPlugin
	@static
*/

var C_BUTTON = 'yui3-button',
    SELECTED = 'selected',
    CLICK = 'click',
    DOT = '.',
    ARIA_PRESSED = 'aria-pressed',
    BUTTON_TOGGLE = 1,
    GROUP_TOGGLE = 2,

    btn = {
        /**
            CSS className for selected buttons
            @property C_SELECTED
            @type String
            @default "yui3-button-selected"
            @static
         */
        C_SELECTED: C_BUTTON + '-selected',

        /**
            CSS className for non-selected buttons
            @property C_NOT_SELECTED
            @type String
            @default ""
            @static
         */
        C_NOT_SELECTED: '',


        /**
            CSS className to identify toggle buttons
            @property C_TOGGLE
            @type String
            @default "yui3-button-toggle"
            @static
         */
        C_TOGGLE: C_BUTTON + '-toggle',

        /**
            CSS className to identify elements containing mutually exclusive toggle buttons
            @property C_EXCLUSIVE
            @type String
            @default "yui3-button-group-exclusive"
            @static
         */
        C_EXCLUSIVE: C_BUTTON + '-group-exclusive',

        /**
            Getter for the augmented `selected` Node attribute
            Returns the state of the toggle button or
            a Node reference to the toggle button selected within group.
            @method _selectedGetter
            @return Boolean for toggle buttons, Node reference for groups.
            @static
            @private
        */
        _selectedGetter: function () {
            switch (this._toggleType) {
                case BUTTON_TOGGLE:
                    return this._toggleSelected;
                case GROUP_TOGGLE:
                    return this._selectedToggle;
                default:
                    return Y.Node.DEFAULT_GETTER.call(this, SELECTED);
            }
        },

        /**
            Setter for the augmented `selected` Node attribute
            @method _selectedSetter
            @param value {Boolean|Node|String}  For toggle buttons: pressed state,
                   for groups of toggles, reference or css-selector of pressed button
            @static
            @private
        */
        _selectedSetter: function(value) {
            var target = null,
                classes = this._cssClasses;
            switch (this._toggleType) {

                case BUTTON_TOGGLE:
                    if (classes.C_SELECTED) {
                        this[value?'addClass':'removeClass'](classes.C_SELECTED);
                    }
                    if (classes.C_NOT_SELECTED) {
                        this[!value?'addClass':'removeClass'](classes.C_NOT_SELECTED);
                    }
                    this[value?'setAttribute':'removeAttribute'](ARIA_PRESSED, true);
                    this._toggleSelected = !!value;
                    break;

                case GROUP_TOGGLE:
                    if (value) {
                        target = Y.one(value);
                        target.set(SELECTED, true);
                        this._selectedToggle = target;
                    } else {
                        this._selectedToggle = null;
                    }
                    this.all(DOT + classes.C_TOGGLE).each(function (node) {
                        if (node !== target) {
                            node.set(SELECTED, false);
                        }
                    });
                    break;
                default:
                    Y.Node.DEFAULT_SETTER.call(this,SELECTED, value);
                    break;
            }
            return value;
        },

        /**
            Plugs into a toggle button.
            @method _addToggleButton
            @param node {Node} Reference to the Node to be plugged into.
            @private
            @static
        */
        _addToggleButton: function (node) {
            node._toggleType = BUTTON_TOGGLE;
            node._cssClasses = this;

            if (this.C_SELECTED) {
                node.set(SELECTED, node.hasClass(this.C_SELECTED));
            } else if (this.C_NOT_SELECTED) {
                node.set(SELECTED, !node.hasClass(this.C_NOT_SELECTED));
            }
            node.on(CLICK, function () {
                this.set(SELECTED, !this.get(SELECTED));
            });

        },

        /**
            Plugs into a container of mutually exclusive toggle buttons.
            @method _addButtonGroup
            @param node {Node} Reference to the container of the buttons.
            @private
            @static
        */
        _addButtonGroup: function (node) {
            node._toggleType = GROUP_TOGGLE;
            node._cssClasses = this;

            var cssSelected = this.C_SELECTED,
                cssSelToggle = DOT + this.C_TOGGLE;

            if (cssSelected) {
                node.set(SELECTED, node.one(DOT + cssSelected));
            } else {
                node.set(SELECTED,  node.one(cssSelToggle + ':not(' + DOT + this.C_NOT_SELECTED + ')'));
            }

            node.delegate(CLICK, function(ev) {
                ev.container.set(SELECTED, this.get(SELECTED)?this:null);
            }, cssSelToggle);
        },
        /**
            Searches within the given container or the body of the document for
            buttons marked with the className `yui3-button-toggle`
            and elements with the className `yui3-button-group-exclusive` and
            plugs them with this module
            @method addToggles
            @param [container] {Node|string} Node instance or css selector of the
                button or button groups to be plugged into,
                or a container holding the buttons and groups.
                Assumes the document body if missing.
            @param [cssClasses] {Object} CSS classes to override
            @static
        */

        addToggles: function (container, cssClasses) {
            cssClasses = Y.merge({
                C_TOGGLE: btn.C_TOGGLE,
                C_SELECTED: btn.C_SELECTED,
                C_NOT_SELECTED: btn.C_NOT_SELECTED,
                C_EXCLUSIVE: btn.C_EXCLUSIVE
            }, cssClasses || {});
            container = Y.one(container || 'body');
            if (container.hasClass(cssClasses.C_TOGGLE)) {
                btn._addToggleButton.call(cssClasses,container);
            } else {
                container.all(DOT + cssClasses.C_TOGGLE).each(btn._addToggleButton, cssClasses);
            }
            if (container.hasClass(cssClasses.C_EXCLUSIVE)) {
                btn._addButtonGroup.call(cssClasses,container);
            } else {
                container.all(DOT + cssClasses.C_EXCLUSIVE).each(btn._addButtonGroup, cssClasses);
            }
        }
};


/**
    Augmented `selected` attribute.

    - For toggle buttons a Boolean that indicates whether the button is pressed.
    - For groups of toggle buttons it can be:

        * Node reference to the selected button (get or set).
        * null when none is selected or to deselect all (get or set).
        * A string representing a CSS selector (only on set).
    @for Node
    @attribute selected
*/
Y.Node.ATTRS[SELECTED] = {
    getter: btn._selectedGetter,
    setter: btn._selectedSetter
};

/**
    Signals if it is a toggle button or a group of toggle buttons.
    1 for toggle buttons, 2 for groups of toggle buttons
    @property _toggleType
    @for Node
    @type integer
    @private
 */
 /**
    Holds a reference to the only pressed toggle button within a group
    @property _selectedToggle
    @for Node
    @type Y.Node
    @private
 */
 /**
    Hash with the CSS classNames to use/apply to this Node
    @property _cssClasses
    @for Node
    @type Object
    @private
  */


Y.ButtonPlugin = btn;



}, 'gallery-2012.12.12-21-11', {"requires": ["node"], "optional": ["cssbutton"]});
