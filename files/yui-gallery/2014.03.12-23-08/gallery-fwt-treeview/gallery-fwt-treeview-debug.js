YUI.add('gallery-fwt-treeview', function (Y, NAME) {

/**
 * Creates a Treeview using the FlyweightTreeManager Widget to handle its nodes.
 * It creates the tree based on an object passed as the `tree` attribute in the constructor.
 * @example
 *
	var tv = new Y.FWTreeView({tree: [
		{
			label:'label 0',
			children: [
				{
					label: 'label 0-0',
					children: [
						{label: 'label 0-0-0'},
						{label: 'label 0-0-1'}
					]
				},
				{label: 'label 0-1'}
			]
		},
		{label: 'label 1'}

	]});
	tv.render('#container');

 * @module gallery-fwt-treeview
 */
'use strict';
/*jslint white: true */
var Lang = Y.Lang,
    FWTV,
    FWTN,
    HASH = '#',
	getCName = Y.ClassNameManager.getClassName,
	cName = function (name) {
		return getCName('fw-treeview', name);
	},
	CBX = 'contentBox',
    EXPANDED = 'expanded',
    SEL_ENABLED = 'selectionEnabled',
    SELECTED = 'selected',
    CHANGE = 'Change',
	NOT_SELECTED = 0,
	PARTIALLY_SELECTED = 1,
	FULLY_SELECTED = 2;
/**
 * TreeView widget.
 * It creates the tree based on an object passed as the `tree` attribute in the constructor.
 * @example
 *
    var tv = new Y.FWTreeView({tree: [
        {
            label:'label 0',
            children: [
                {
                    label: 'label 0-0',
                    children: [
                        {label: 'label 0-0-0'},
                        {label: 'label 0-0-1'}
                    ]
                },
                {label: 'label 0-1'}
            ]
        },
        {label: 'label 1'}

    ]});
    tv.render('#container');

 *
 * @class FWTreeView
 * @extends FlyweightTreeManager
 * @constructor
 * @param config {Object} Configuration attributes, amongst them:
 * @param config.tree {Array} Array of strings or objects defining the first level of nodes.
 * If a string, it will be used as the label, if an object, it may contain:
 * @param config.tree.label {String} Text of HTML markup to be shown in the node
 * @param [config.tree.expanded=true] {Boolean} Whether the children of this node should be visible.
 * @param [config.tree.children] {Array} Further definitions for the children of this node
 * @param [config.tree.type=FWTreeNode] {FWTreeNode | String} Class used to create instances for this node.
 * It can be a reference to an object or a name that can be resolved as `Y[name]`.
 * @param [config.tree.id=Y.guid()] {String} Identifier to assign to the DOM element containing this node.
 * @param [config.tree.template] {String} Template for this particular node.
 */
FWTV = Y.Base.create(
    NAME,
    Y.FlyweightTreeManager,
    [],
    {
        /**
         * Array of iNodes containing a flat list of all nodes visible regardless
         * of their depth in the tree.
         * Used to handle keyboard navigation.
         * @property _visibleSequence
         * @type Array or null
         * @default null
         * @private
         */
        _visibleSequence: null,
        /**
         * Index, within {{#crossLink "_visibleSequence"}}{{/crossLink}}, of the iNode having the focus.
         * Used for keyboard navigation.
         * @property _visibleIndex
         * @type Integer
         * @default null
         * @private
         */
        _visibleIndex: null,
        /**
         * Widget lifecycle method
         * @method initializer
         * @param config {object} configuration object of which
         * `tree` contains the tree configuration.
         */
        initializer: function (config) {
            this._domEvents = ['click'];
            this._loadConfig(config.tree);
        },
        /**
         * Overrides the same function to process the selected attribute
         * @method _initNodes
         * @param parentINode {Object} Parent of the iNodes to be set
         * @protected
         */
        _initNodes: function (parentINode) {
            FWTV.superclass._initNodes.call(this, parentINode);
            parentINode[SELECTED] = parentINode[SELECTED]?FULLY_SELECTED:NOT_SELECTED;
        },
        /**
         * Widget lifecyle method.
         * Adds the `tree` role to the content box.
         * @method renderUI
         * @protected
         */
        renderUI: function () {
            FWTV.superclass.renderUI.apply(this, arguments);
            this.get(CBX).set('role','tree');
        },
        /**
         * Widget lifecyle method.
         * Sets the keydown listener to handle keyboard navigation.
         * @method bindUI
         * @protected
         */
        bindUI: function () {
            FWTV.superclass.bindUI.apply(this, arguments);
            this._eventHandles.push(this.get(CBX).on('keydown', this._onKeyDown, this));
        },
        /**
         * Listener for keyboard events to handle keyboard navigation
         * @method _onKeyDown
         * @param ev {EventFacade} Standard YUI key facade
         * @private
         */
        _onKeyDown: function (ev) {
            var self = this,
                key = ev.keyCode,
                iNode = this._focusedINode,
                seq = this._visibleSequence,
                index = this._visibleIndex,
                fwNode,
                fireKey = function (which) {
                    fwNode = self._poolFetch(iNode);
                    ev.container = ev.target;
                    ev.target = Y.one(HASH + iNode.id);
                    self.fire(which, {
                        domEvent:ev,
                        node: fwNode
                    });
                    fwNode.fire(which);
                };
            if(iNode) {

                switch (key) {
                    case 38: // up
                        if (!seq) {
                            seq = this._rebuildSequence();
                            index = seq.indexOf(iNode);
                        }
                        index -=1;
                        if (index >= 0) {
                            iNode = seq[index];
                            self._visibleIndex = index;
                        } else {
                            iNode = null;
                        }
                        break;
                    case 39: // right
                        fwNode = self._poolFetch(iNode);
                        if (fwNode.get(EXPANDED)) {
                            if (iNode.children && iNode.children.length) {
                                iNode = iNode.children[0];
                            } else {
                                iNode = null;
                            }
                        } else {
                            fwNode.set(EXPANDED, true);
                            iNode = null;
                        }
                        break;
                    case 40: // down
                        if (!seq) {
                            seq = self._rebuildSequence();
                            index = seq.indexOf(iNode);
                        }
                        index +=1;
                        if (index < seq.length) {
                            iNode = seq[index];
                            self._visibleIndex = index;
                        } else {
                            iNode = null;
                        }
                        break;
                    case 37: // left
                        fwNode = self._poolFetch(iNode);
                        if (fwNode.get(EXPANDED) && iNode.children) {
                            fwNode.set(EXPANDED, false);
                            iNode = null;
                        } else {
                            iNode = iNode._parent;
                            if (iNode === self._tree) {
                                iNode = null;
                            }
                        }

                        break;
                    case 36: // home
                        iNode = self._tree.children && self._tree.children[0];
                        break;
                    case 35: // end
                        index = self._tree.children && self._tree.children.length;
                        if (index) {
                            iNode = self._tree.children[index -1];
                        } else {
                            iNode = null;
                        }
                        break;
                    case 13: // enter
                        fireKey('enterkey');
                        iNode = null;
                        break;
                    case 32: // spacebar
                        fireKey('spacebar');
                        iNode = null;
                        break;
                    case 106: // asterisk on the numeric keypad
                        self.expandAll();
                        break;
                    default: // initial
                        iNode = null;
                        break;
                }
                if (fwNode) {
                    self._poolReturn(fwNode);
                }
                if (iNode) {
                    self._focusOnINode(iNode);
                    ev.halt();
                    return false;
                }
            }
            return true;
        },
        /**
         * Listener for the focus event.
         * Updates the node receiving the focus when the widget gets the focus.
         * @method _aferFocus
         * @param ev {EventFacade} Standard event facade
         * @private
         */
        _afterFocus: function (ev) {
            var iNode = this._findINodeByElement(ev.domEvent.target);
            this._focusOnINode(iNode);
            if (this._visibleSequence) {
                this._visibleIndex = this._visibleSequence.indexOf(iNode);
            }
        },
        /**
         * Rebuilds the array of {{#crossLink "_visibleSequence"}}{{/crossLink}} that can be traversed with the up/down arrow keys
         * @method _rebuildSequence
         * @private
         */
        _rebuildSequence: function () {
            var seq = [],
                root = this.getRoot(),
                forOneLevel = function (fwNode) {
                    if (fwNode.get(EXPANDED)) {
                        fwNode.forSomeChildren(function (fwNode) {
                            seq.push(fwNode._iNode);
                            forOneLevel(fwNode);
                        });
                    }
                };
            forOneLevel(root);
            root.release();
            return (this._visibleSequence = seq);

        },
        /**
         * Overrides the default CONTENT_TEMPLATE to make it an unordered list instead of a div
         * @property CONTENT_TEMPLATE
         * @type String
         */
        CONTENT_TEMPLATE: '<ul></ul>'

    },
    {
        ATTRS: {
            /**
             * Override for the `defaultType` value of FlyweightTreeManager
             * so it creates FWTreeNode instances instead of the default.
             * @attribute defaultType
             * @type String
             * @default 'FWTreeNode'
             */
            defaultType: {
                value: 'FWTreeNode'
            },
            /**
             * Enables toggling by clicking on the label item instead of just the toggle icon.
             * @attribute toggleOnLabelClick
             * @type Boolean
             * @default false
             */
            toggleOnLabelClick: {
                value:false,
                validator:Lang.isBoolean
            }
        }
    }
);

/**
 * TreeView provides all the events that Widget relays from the DOM.
 * It adds an additional property to the EventFacade called `node`
 * that points to the TreeNode instance that received the event.
 *
 * This instance is pooled and will be discarded upon return from the listener.
 * If you need to hold on to this instance,
 * use the {{#crossLink "TreeNode/hold"}}{{/crossLink}} method to preserve it.
 * @event -any DOM event-
 * @param type {String} The full name of the event fired
 * @param ev {EventFacade} Standard YUI event facade for DOM events plus:
 * @param ev.node {TreeNode} TreeNode instance that received the event
 */
/**
 * Fires when the space bar is pressed.
 * Used internally to toggle node selection.
 * @event spacebar
 * @param ev {EventFacade} YUI event facade for keyboard events, including:
 * @param ev.domEvent {Object} The original event produced by the DOM, except:
 * @param ev.domEvent.target {Node} The DOM element that had the focus when the key was pressed
 * @param ev.node {FWTreeNode} The node that had the focus when the key was pressed
 */
/**
 * Fires when the enter key is pressed.
 * @event enterkey
 * @param ev {EventFacade} YUI event facade for keyboard events, including:
 * @param ev.domEvent {Object} The original event produced by the DOM, except:
 * @param ev.domEvent.target {Node} The DOM element that had the focus when the key was pressed
 * @param ev.node {FWTreeNode} The node that had the focus when the key was pressed
 */
Y.FWTreeView = FWTV;/**
 *  This class must not be generated directly.
 *  Instances of it will be provided by FWTreeView as required.
 *
 *  Subclasses might be defined based on it.
 *  Usually, they will add further attributes and redefine the TEMPLATE to
 *  show those extra attributes.
 *
 *  @class FWTreeNode
 *  @extends FlyweightTreeNode
 *  @constructor
 */
 FWTN = Y.Base.create(
    'fw-treenode',
    Y.FlyweightTreeNode,
    [],
    {
        initializer: function() {
            this._root._eventHandles.push(
                this.after('click', this._afterClick),
                this.after(SELECTED + CHANGE, this._afterSelectedChange),
                this.after('spacebar', this.toggleSelection),
                this.after(EXPANDED + CHANGE, this._afterExpandedChanged),
                this.after('selectionEnabled' + CHANGE, this._afterSelectionEnabledChange)
            );
        },
        /**
         * Listens to changes in the expanded attribute to invalidate and force
         * a rebuild of the list of visible nodes
         * the user can navigate through via the keyboard.
         * @method _afterExpandedChanged
         * @protected
         */
        _afterExpandedChanged: function () {
            this._root._visibleSequence = null;
        },
        /**
         * Responds to the click event by toggling the node
         * @method _afterClick
         * @param ev {EventFacade}
         * @private
         */
        _afterClick: function (ev) {
            var target = ev.domEvent.target,
                CNAMES = FWTN.CNAMES;
            if (target.hasClass(CNAMES.CNAME_TOGGLE)) {
                this.toggle();
            } else if (target.hasClass(CNAMES.CNAME_SELECTION)) {
                this.toggleSelection();
            } else if (target.hasClass(CNAMES.CNAME_LABEL) || target.hasClass(CNAMES.CNAME_ICON)) {
                if (this.get('root').get('toggleOnLabelClick')) {
                    this.toggle();
                }
            }
        },
        /**
         * Sugar method to toggle the selected state of a node.
         * See {{#crossLink "selected:attribute"}}{{/crossLink}}.
         * @method toggleSelection
         */
        toggleSelection: function() {
            this.set(SELECTED, (this._iNode[SELECTED]?NOT_SELECTED:FULLY_SELECTED));
        },
        /**
         * Responds to the change in the {{#crossLink "label:attribute"}}{{/crossLink}} attribute.
         * @method _afterLabelChange
         * @param ev {EventFacade} standard attribute change event facade
         * @private
         */
        _afterLabelChange: function (ev) {
            var el = Y.one(HASH + this._iNode.id + ' .' + FWTN.CNAMES.CNAME_LABEL);
            if (el) {
                el.setHTML(ev.newVal);
            }
        },
        /**
         * Changes the UI to reflect the selected state and propagates the selection up and/or down.
         * @method _afterSelectedChange
         * @param ev {EventFacade} out of which
         * @param ev.src {String} if not undefined it can be `'propagateUp'` or `'propagateDown'`
         * so that propagation goes in just one direction and doesn't bounce back.
         * @private
         */
        _afterSelectedChange: function (ev) {
            var selected = ev.newVal,
                prefix = FWTN.CNAMES.CNAME_SEL_PREFIX + '-',
                el;
            if (!this.get(SEL_ENABLED)) {
                return;
            }
            if (!this.isRoot()) {
                el = Y.one(HASH + this.get('id'));
                if (el) {
                    el.replaceClass(prefix + ev.prevVal, prefix + selected);
                    el.set('aria-checked', this._ariaCheckedGetter());
                }
                if (this.get('propagateUp') && ev.src !== 'propagatingDown') {
                    this.getParent()._childSelectedChange().release();
                }
                if (this.get('propagateDown') && ev.src !== 'propagatingUp') {
                    this.forSomeChildren(function(node) {
                        node.set(SELECTED , selected, {src:'propagatingDown'});
                    });
                }
            }
        },
        /**
         * Changes the UI to reflect whether the item has selection enabled.
         * @method _afterSelectionEnabledChange
         * @param ev {EventFacade} Attribute event change facade
         * @private
         */
        _afterSelectionEnabledChange: function (ev) {
            var selected = this._iNode[SELECTED],
                el = Y.one(HASH + this.get('id')),
                prefix = FWTN.CNAMES.CNAME_SEL_PREFIX + '-';
            if (ev.newVal) {
                el.replaceClass(prefix + 'null', prefix + selected);
            } else {
                el.replaceClass(prefix + selected, prefix + 'null');
            }

        },
        /**
         * Getter for the {{#crossLink "_aria_checked:attribute"}}{{/crossLink}}.
         * Translate the internal {{#crossLink "selected:attribute"}}{{/crossLink}}
         * to the strings the `aria_checked` attribute expects
         * @method _ariaCheckedGetter
         * @return {String} One of 'false', 'true' or 'mixed'
         * @private
         */
        _ariaCheckedGetter: function () {
            return ['false','mixed','true'][this.get(SELECTED) ||0];
        },
        /**
         * Setter for the {{ćrossLink "selected:attribute}}{{/crossLink}}.
         * Translates a truish or falsy value into FULLY_SELECTED or NOT_SELECTED.
         * @method _selectedSetter
         * @param value
         * @private
         */
        _selectedSetter: function (value) {
            return (value?FULLY_SELECTED:NOT_SELECTED);
        },
        /**
         * Getter for the `selected` attribute.
         * Returns false when selection is not enabled.
         * @method _selectedGetter
         * @param value {integer} current value
         * @return {integer} current value or false if not enabled
         * @private
         */
        _selectedGetter: function (value) {
            return (this.get(SEL_ENABLED)?value||0:null);
        },
        /**
         * Getter for both the `propagateUp` and `propagateDown` attributes.
         * @method _propagateGetter
         * @param value {Boolean} current value
         * @return {Boolean} the state of the attribute
         * @private
         */
        _propagateGetter: function (value) {
            return (this.get(SEL_ENABLED)?(value !== false):false);
        },
        /**
         * Overrides the original in FlyweightTreeNode so as to propagate the selected state
         * on dynamically loaded nodes.
         * @method _dynamicLoadReturn
         * @private
         */
        _dynamicLoadReturn: function () {
            FWTN.superclass._dynamicLoadReturn.apply(this, arguments);
            if (this.get('propagateDown')) {
                var selected = this.get(SELECTED);
                this.forSomeChildren(function(node) {
                    node.set(SELECTED , selected, {src:'propagatingDown'});
                });
            }
            this._root._visibleSequence = null;

        },
        /**
         * When propagating selection up, it is called by a child when changing its selected state
         * so that the parent adjusts its own state accordingly.
         * @method _childSelectedChange
         * @private
         */
        _childSelectedChange: function () {
            var count = 0, selCount = 0, value, prevVal = this._iNode[SELECTED];
            this.forSomeChildren(function (node) {
                count +=2;
                selCount += node.get(SELECTED);
            });
            // While this is not solved:  http://yuilibrary.com/projects/yui3/ticket/2532810
            // This is the good line:
            //this.set(SELECTED, (selCount === 0?NOT_SELECTED:(selCount === count?FULLY_SELECTED:PARTIALLY_SELECTED)), {src:'propagatingUp'});
            // This is the patch:
            value = (selCount === 0?NOT_SELECTED:(selCount === count?FULLY_SELECTED:PARTIALLY_SELECTED));
            this._iNode[SELECTED] = value;
            this._afterSelectedChange({
                prevVal: prevVal,
                newVal: value,
                src: 'propagatingUp'
            });
            // end of the patch
            return this;
        }

    },
    {
        /**
         * Outer template to produce the markup for a node in the tree.
         * It replaces the standard one provided by FlyweightTreeNode.
         * Adds the proper ARIA role and node selection.
         * @property OUTER_TEMPLATE
         * @type String
         * @static
         */
        OUTER_TEMPLATE: '<li id="{id}" class="{CNAME_NODE} {CNAME_SEL_PREFIX}-{selected}" ' +
                'role="treeitem" aria-expanded="{expanded}" aria-checked="{_aria_checked}">' +
            '{INNER_TEMPLATE}' +
            '<ul class="{CNAME_CHILDREN}" role="group">{children}</ul></li>',
        /**
         * Template to produce the markup for a node in the tree.
         * It replaces the standard one provided by FlyweightTreeNode.
         * Adds places for the toggle and selection icons, an extra app-dependent icon and the label.
         * @property INNER_TEMPLATE
         * @type String
         *
         * @static
         */
        INNER_TEMPLATE: '<div tabIndex="{tabIndex}" class="{CNAME_CONTENT}"><div class="{CNAME_TOGGLE}"></div>' +
            '<div class="{CNAME_ICON}"></div><div class="{CNAME_SELECTION}"></div><div class="{CNAME_LABEL}">{label}</div></div>',
        /**
         * Collection of classNames to set in the template.
         * @property CNAMES
         * @type Object
         * @static
         * @final
         */
        CNAMES: {
            CNAME_TOGGLE: cName('toggle'),
            CNAME_ICON: cName('icon'),
            CNAME_SELECTION: cName('selection'),
            CNAME_SEL_PREFIX: cName('selected-state'),
            CNAME_LABEL: cName('label')
        },
        /**
         * Constant to use with the `selected` attribute to indicate the node is not selected.
         * @property NOT_SELECTED
         * @type integer
         * @value 0
         * @static
         * @final
         */
        NOT_SELECTED:NOT_SELECTED,
        /**
         * Constant to use with the `selected` attribute to indicate some
         * but not all of the children of this node are selected.
         * This state should only be acquired by upward propagation from descendants.
         * @property PARTIALLY_SELECTED
         * @type integer
         * @value 1
         * @static
         * @final
         */
        PARTIALLY_SELECTED:PARTIALLY_SELECTED,
        /**
         * Constant to use with the `selected` attribute to indicate the node is selected.
         * @property FULLY_SELECTED
         * @type integer
         * @value 2
         * @static
         * @final
         */
        FULLY_SELECTED:FULLY_SELECTED,
        ATTRS: {
            /**
             * Selected/highlighted state of the node.
             *
             * The node selection mechanism is always enabled though it might not be visible.
             * It only sets a suitable className on the tree node.
             * The module is provided with a default CSS style that makes node selection visible.
             * To enable it, add the `yui3-fw-treeview-checkbox` className to the container of the tree.
             *
             * `selected` can return
             *
             * - Y.FWTreeNode.NOT\_SELECTED (0) not selected
             * - Y.FWTreeNode.PARTIALLY\_SELECTED (1) partially selected: some children are selected, some not or partially selected.
             * - Y.FWTreeNode.FULLY\_SELECTED (2) fully selected.
             * - null when {{#crossLing "selectionEnabled:attribute"}}{{/crossLink}} is not enabled
             *
             * `selected`can be set to:
             *
             * - any true value:  will produce a FULLY\_SELECTED state.
             * - any false value: will produce a NOT\_SELECTED state.
             *
             * The partially selected state can only be the result of selection propagating up from a child node.
             * Since PARTIALLY\_SELECTED cannot be set, leaving just two possible values for setting,
             * any true or false value will be valid when setting.  However, no matter what values were
             * used when setting, one of the three possible values above will be returned.
             *
             * @attribute selected
             * @type Integer
             * @default NOT_SELECTED
             */
            selected: {
                value:NOT_SELECTED,
                setter: '_selectedSetter',
                getter: '_selectedGetter'
            },
            /**
             * String value equivalent to the {{#crossLink "selected:attribute"}}{{/crossLink}}
             * for use in template expansion.
             * @attribute _aria_checked
             * @type String
             * @default false
             * @readonly
             * @protected
             */
            _aria_checked: {
                readOnly: true,
                getter: '_ariaCheckedGetter'
            },
            /**
             * Enables node selection. Nodes with selection enabled w
             * @attribute selectEnabled
             * @type Boolean
             * @default true
             */
            selectionEnabled: {
                value: true,
                validator: Lang.isBoolean
            },
            /**
             * Whether selection of one node should propagate to its parent.
             * See {{#crossLink "selected:attribute"}}{{/crossLink}}.
             * @attribute propagateUp
             * @type Boolean
             * @default true
             */
            propagateUp: {
                value: true,
                validator: Lang.isBoolean,
                getter: '_propagateGetter'
            },
            /**
             * Whether selection of one node should propagate to its children.
             * See {{#crossLink "selected:attribute"}}{{/crossLink}}.
             * @attribute propagateDown
             * @type Boolean
             * @default true
             */
            propagateDown: {
                value: true,
                validator: Lang.isBoolean,
                getter: '_propagateGetter'
            }
        }
    }
);

/**
 * Fires when the space bar is pressed.
 * Used internally to toggle node selection.
 * @event spacebar
 * @param ev {EventFacade} YUI event facade for keyboard events, including:
 * @param ev.domEvent {Object} The original event produced by the DOM, except:
 * @param ev.domEvent.target {Node} The DOM element that had the focus when the key was pressed
 * @param ev.node {FWTreeNode} The node that had the focus when the key was pressed
 */
/**
 * Fires when the enter key is pressed.
 * @event enterkey
 * @param ev {EventFacade} YUI event facade for keyboard events, including:
 * @param ev.domEvent {Object} The original event produced by the DOM, except:
 * @param ev.domEvent.target {Node} The DOM element that had the focus when the key was pressed
 * @param ev.node {FWTreeNode} The node that had the focus when the key was pressed
 */
/**
 * Fires when this node is clicked.
 * Used internally to toggle expansion or selection when clicked
 * on the corresponding icons.
 *
 * It cannot be prevented.  This is a helper event, the actual event
 * happens on the TreeView instance and it is relayed here for convenience.
 * @event click
 * @param ev {EventFacade} Standard YUI event facade for mouse events.
 */

Y.FWTreeNode = FWTN;

}, 'gallery-2012.12.12-21-11', {"requires": ["gallery-flyweight-tree", "widget", "base-build"], "skinnable": true});
