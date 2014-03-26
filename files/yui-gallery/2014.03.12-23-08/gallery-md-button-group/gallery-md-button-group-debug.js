YUI.add('gallery-md-button-group', function(Y) {

/**
* Provides a container to group buttons.
* It can hold instances of Y.Button, Y.ButtonToggle or Y.ButtonSeparator.
* @module gallery-md-button-group
*/

"use strict";

var Lang = Y.Lang,
	BBX = 'boundingBox',
	EVENT_PRESS = 'press',
	LABEL = 'label';

/**
 * The ButtonSeparator class provides a passive divider to use in between groups of buttons
 * @class ButtonSeparator
 * @extends Y.Widget
 * @constructor
 */
Y.ButtonSeparator = Y.Base.create(
	'buttonSeparator',
	Y.Widget,
	[],
	{
		/**
		 * Overrides the standard bounding box template to produce a &lt;span&gt;
		 * @property BOUNDING_TEMPLATE
		 * @type String
		 */
		BOUNDING_TEMPLATE: '<span />'
	},
	{
	}
);
	
/**
 * The ButtonGroup class provides a container for sets of Buttons.
 * All buttons added will be extended with Y.WidgetChild.
 * @class ButtonGroup
 * @extends Y.Widget
 * @uses Y.WidgetParent, Y.Makenode
 * @constructor
 * @param cfg {object} Configuration attributes
 */


Y.ButtonGroup = Y.Base.create(
	'buttonGroup', 
	Y.Widget, 
	[Y.WidgetParent,Y.MakeNode], 
	{
		/**
		 * Overrides the standard bounding box template to produce a &lt;fieldset&gt;
		 * @property BOUNDING_TEMPLATE
		 * @type String
		 */
		BOUNDING_TEMPLATE: '<fieldset />',
		/**
		 * Sets the listener for the addChild event to extend children with Y.WidgetChild.
		 * Publishes the <code>press</code> event
		 */
		initializer: function () {
			this.on('addChild', function (ev) {
				var child = ev.child,
					WC = Y.WidgetChild;
				if (child) {
					if (child instanceof Y.Button || child instanceof Y.ButtonSeparator) {
						if (!child.ancestor) {
						
							Y.augment(child, WC);
							
							child.addAttrs(child._protectAttrs(WC.ATTRS));
							
							WC.constructor.apply(child);
						}
					} else {
						ev.preventDefault();
					}
				}
			});
		},
		

		/**
		 * Sets listeners for the press event of child buttons, see <a href="#method__onButtonPress">_onButtonPress</a>.
		 * @method bindUI
		 */
		bindUI : function() {

			this.on(['button:press','buttonToggle:press'], this._onButtonPress ,this);
		},
		/**
		 * Processes the press event of child Buttons to enforce the <a href="#config__alwaysSelected">_alwaysSelected</a> attribute,
		 * and to propagate the press event
		 * @method _onButtonPress
		 * @param ev {EventFacade}
		 * @private
		 */
		_onButtonPress: function(ev) {
			if(this.get('alwaysSelected')) {
				var selection = this.get('selection'),
					button = ev.target;

				if(selection === button || // selection is the button OR
					( 
						selection instanceof Y.ArrayList &&		// selection is an array AND
						selection.size() === 1 &&				// there is only one item AND
						selection.item(0) === button			// that one item is the button
					)
				) {
					ev.preventDefault();
					return;
				}
			}
			this.fire(EVENT_PRESS, {pressed: ev.target});
		},
		/**
		 * Sets the label of the container from the value of the <a href="#config_label">label</a> configuration attribute.
		 * Creates the &lt;legend&gt; element to hold it if it does not exists.
		 * @method _uiSetLabel
		 * @param value {String} text to be shown
		 * @private
		 */
		_uiSetLabel: function (value) {
			if (!this._labelNode) {
				this.get(BBX).prepend(this._makeNode());
				this._locateNodes();
			}
			this._labelNode.setContent(value);
		}

	}, {
		/**
		 * Template for the &lt;legend&gt; element to hold the label.  Used by MakeNode.
		 * @property Y.ButtonGroup._TEMPLATE
		 * @type String
		 * @static
		 * @protected
		 */
		_TEMPLATE: '<legend class="{c label}">{@ label}</legend>',
		/**
		 * Creates the label className key to be used in the template
		 * @property Y.ButtonGroup._CLASS_NAMES
		 * @type [Strings]
		 * @static
		 * @protected
		 */
		_CLASS_NAMES: [LABEL],
		/**
		 * Hooks up <a href="method__uiSetLabel">_uiSetLabel</a> to respond to changes in the <a href="#config_label">label</a> attribute.
		 * @property Y.ButtonGroup._ATTRS_2_UI
		 * @type Object
		 * @static
		 * @protected
		 */
		_ATTRS_2_UI: {
			BIND: LABEL,
			SYNC: LABEL
		},
		_PUBLISH: {
			press:null
		},
		ATTRS : {
			/**
			 * Holds the label for this group of buttons
			 * @attribute label
			 * @type String
			 * @default ""
			 */
			label : {
				value:'',
				validator : Lang.isString
			},

			/**
			 * Defines the default type of child to be contained in this group.  
			 * Used by WidgetParent to create the default children
			 * @attribute defaultChildType
			 * @type object
			 * @default Y.Button
			 */
			defaultChildType : {
				value : Y.Button
			},

			/**
			 * Forces this group to always have at least one toggle button selected
			 * @attribute alwaysSelected
			 * @type Boolean
			 * @default false
			 */
			alwaysSelected : {
				value : false,
				validator: Lang.isBoolean
			}
		}
	}
);


}, 'gallery-2011.10.06-19-55' ,{skinnable:true, requires:['base-base', 'widget-parent', 'widget-child', 'gallery-makenode', 'gallery-md-button']});
