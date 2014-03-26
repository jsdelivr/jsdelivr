YUI.add('gallery-aui-editable', function(A) {

/**
 * The Editable Utility
 *
 * @module aui-editable
 */

var Lang = A.Lang,
	LString = Lang.String,
	isFunction = Lang.isFunction,

	getClassName = A.ClassNameManager.getClassName,

	HOVER = 'hover',
	NAME = 'editable',

	CSS_EDITING = getClassName(NAME, 'editing'),
	CSS_HOVER = getClassName(NAME, HOVER),

	CONTENT_BOX = 'contentBox';

/**
 * <p><img src="assets/images/aui-editable/main.png"/></p>
 *
 * A base class for Editable, providing:
 * <ul>
 *    <li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *    <li>Edit in place elements</li>
 * </ul>
 *
 * Quick Example:<br/>
 *
 * <pre><code>var instance = new A.Editable({
 *   node: '#editor'
 * }).render();
 * </code></pre>
 *
 * Check the list of <a href="Editable.html#configattributes">Configuration Attributes</a> available for
 * Editable.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class Editable
 * @constructor
 * @extends Component
 */
var Editable = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property Editable.NAME
		 * @type String
		 * @static
		 */
		NAME: NAME,

		/**
		 * Static property used to define the default attribute
		 * configuration for the Editable.
		 *
		 * @property Editable.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			/**
			 * <a href="ButtonItem.html">ButtonItem</a> constructor Object for the
		     * cancelButton.
			 *
			 * @attribute cancelButton
			 * @default Button constructor Object.
			 * @type String
			 */
			cancelButton: {
				valueFn: function() {
					var instance = this;

					return {
						id: 'cancel',
						icon: 'circle-close',
						handler: {
							context: instance,
							fn: instance.cancel
						}
					};
				}
			},

			/**
			 * Content text.
			 *
			 * @attribute contentText
			 * @default ''
			 * @type String
			 */
			contentText: {
				value: '',
				setter: function(value) {
					var instance = this;

					value = Lang.trim(value);

					instance._toText(value);

					return value;
				}
			},

			/**
			 * Function to format the input text displayed on the input.
			 *
			 * @attribute formatInput
			 * @default null
			 * @type function
			 */
			formatInput: {
				value: null,
				validator: isFunction
			},

			/**
			 * Function to format the output text displayed on the input.
			 *
			 * @attribute formatOutput
			 * @default null
			 * @type function
			 */
			formatOutput: {
				value: null,
				validator: isFunction
			},

			/**
			 * Node to setup the editable.
			 *
			 * @attribute node
			 * @type Node
			 */
			node: {
				setter: function(value) {
					var node = A.one(value);

					if (!node) {
						A.error('AUI.Editable: Invalid Node Given: ' + value);
					}

					return node;
				}
			},

			/**
			 * Event type to initialize the editable.
			 *
			 * @attribute eventType
			 * @default 'click'
			 * @type String
			 */
			eventType: {
				value: 'click'
			},

			/**
			 * Node to render the editable.
			 *
			 * @attribute renderTo
			 * @type String | Node
			 */
			renderTo: {
				value: document.body,
				setter: function(value) {
					var instance = this;

					var node;

					if (value == 'node') {
						node = instance.get(value);
					}
					else {
						node = A.one(value);
					}

					if (!node) {
						A.error('AUI.Editable: Invalid renderTo Given: ' + value);
					}

					return node;
				}
			},

			/**
			 * <a href="ButtonItem.html">ButtonItem</a> constructor Object for the
		     * saveButton.
			 *
			 * @attribute saveButton
			 * @default Button constructor Object.
			 * @type String
			 */
			saveButton: {
				valueFn: function() {
					var instance = this;

					return {
						id: 'save',
						icon: 'circle-check',
						handler: {
							context: instance,
							fn: instance.save
						}
					};
				}
			},

			/**
			 * Array with icons for the <a href="Toolbar.html">Toolbar</a>.
			 *
			 * @attribute icons
			 * @default []
			 * @type Array
			 */
			icons: {
				value: []
			},

			/**
			 * Type of the input used to edit the <a
		     * href="Editable.html#config_node">node</a>.
			 *
			 * @attribute inputType
			 * @default 'text'
			 * @type String
			 */
			inputType: {
				value: 'text',
				setter: function(value) {
					var instance = this;

					if (value != 'text' && value != 'textarea') {
						value = A.Attribute.INVALID_VALUE;
					}

					return value;
				}
			},

			visible: {
				value: false
			}
		},

		UI_ATTRS: ['node'],

		prototype: {
			/**
			 * Construction logic executed during Editable instantiation. Lifecycle.
			 *
			 * @method initializer
			 * @protected
			 */
			initializer: function() {
				var instance = this;

				instance._uiSetNode(instance.get('node'));

				instance._createEvents();
			},

			/**
			 * Create the DOM structure for the Editable. Lifecycle.
			 *
			 * @method renderUI
			 * @protected
			 */
			renderUI: function() {
				var instance = this;

				var contentBox = instance.get(CONTENT_BOX);
				var inputType = instance.get('inputType');

				var comboConfig = {};

				var icons = instance.get('icons');

				if (icons !== false) {
					var cancelButton = instance.get('cancelButton');
					var saveButton = instance.get('saveButton');

					if (cancelButton !== false) {
						icons.push(cancelButton);
					}

					if (saveButton !== false) {
						icons.push(saveButton);
					}

					comboConfig.icons = icons;
				}

				if (inputType != 'text') {
					A.mix(
						comboConfig,
						{
							field: {
								autoSize: true
							},
							fieldWidget: A.Textarea
						}
					);
				}

				var comboBox = new A.Combobox(comboConfig).render(contentBox);

				instance._comboBox = comboBox;

				instance.inputNode = comboBox.get('node');
			},

			/**
			 * Bind the events on the Editable UI. Lifecycle.
			 *
			 * @method bindUI
			 * @protected
			 */
			bindUI: function() {
				var instance = this;

				var contentBox = instance.get(CONTENT_BOX);
				var node = instance.get('node');

				var inputNode = instance.inputNode;

				inputNode.on('keypress', instance._onKeypressEditable, instance);

				instance.after('contentTextChange', instance._syncContentText);

				contentBox.swallowEvent('click');

				A.getDoc().after('click', instance._afterFocusedChangeEditable, instance);
			},

			/**
			 * Sync the Editable UI. Lifecycle.
			 *
			 * @method syncUI
			 * @protected
			 */
			syncUI: function() {
				var instance = this;

				var currentText = instance.get('node').get('innerHTML');

				currentText = currentText.replace(/\n|\r/gim, '');
				currentText = Lang.trim(currentText);

				currentText = instance._toText(currentText);

				instance._setInput(currentText);

				instance.set(
					'contentText',
					currentText,
					{
						initial: true
					}
				);
			},

			/**
			 * Cancel the editable. Return to the original state.
			 *
			 * @method cancel
			 */
			cancel: function() {
				var instance = this;

				instance.fire('cancel');
			},

			/**
			 * Save the editable. Fires the
			 * <a href="Editable.html#event_save">save</a> event.
			 *
			 * @method save
			 */
			save: function(event) {
				var instance = this;

				instance.fire('save');
			},

			/**
			 * Fires the <a href="Editable.html#event_stopEditing">stopEditing</a>
	         * event.
			 *
			 * @method _afterFocusedChangeEditable
			 * @param {EventFacade} event
			 * @protected
			 */
			_afterFocusedChangeEditable: function(event) {
				var instance = this;

				instance.fire('stopEditing', instance.get('visible'));
			},

			/**
			 * Create the Events.
			 *
			 * @method _createEvents
			 * @protected
			 */
			_createEvents: function() {
				var instance = this;

				/**
				 * Handles the startEditing event.
				 *
				 * @event startEditing
				 * @preventable _defStartEditingFn
				 * @param {Event.Facade} event The startEditing event.
				 * @type {Event.Custom}
				 */
				instance.publish(
					'startEditing',
					{
						bubbles: true,
						defaultFn: instance._defStartEditingFn,
						emitFacade: true,
						queable: false
					}
				);

				/**
				 * Handles the stopEditing event.
				 *
				 * @event stopEditing
				 * @preventable _defStopEditingFn
				 * @param {Event.Facade} event The stopEditing event.
				 * @type {Event.Custom}
				 */
				instance.publish(
					'stopEditing',
					{
						bubbles: true,
						defaultFn: instance._defStopEditingFn,
						emitFacade: true,
						queable: false
					}
				);

				/**
				 * Handles the save event.
				 *
				 * @event save
				 * @preventable _defSaveFn
				 * @param {Event.Facade} event The save event.
				 * @type {Event.Custom}
				 */
				instance.publish(
					'save',
					{
						bubbles: true,
						defaultFn: instance._defSaveFn,
						emitFacade: true,
						queable: false
					}
				);

				/**
				 * Handles the cancel event.
				 *
				 * @event cancel
				 * @preventable _defCancelFn
				 * @param {Event.Facade} event The cancel event.
				 * @type {Event.Custom}
				 */
				instance.publish(
					'cancel',
					{
						bubbles: true,
						defaultFn: instance._defCancelFn,
						emitFacade: true,
						queable: false
					}
				);
			},

			/**
			 * Fires the cancel event.
			 *
			 * @method _defCancelFn
			 * @param {EventFacade} event cancel event facade
			 * @protected
			 */
			_defCancelFn: function(event) {
				var instance = this;

				instance.fire('stopEditing', false);
			},

			/**
			 * Fires the startEditing event.
			 *
			 * @method _defStartEditingFn
			 * @param {EventFacade} event startEditing event facade
			 * @protected
			 */
			_defStartEditingFn: function(event) {
				var instance = this;

				var boundingBox = instance.get('boundingBox');
				var node = instance.get('node');

				var inputNode = instance.inputNode;

				var nodeHeight = node.get('offsetHeight');
				var nodeWidth = node.get('offsetWidth');

				instance.show();

				node.addClass(CSS_EDITING);

				var xy = node.getXY();

				boundingBox.setStyles(
					{
						height: nodeHeight + 'px',
						left: xy[0] + 'px',
						top: xy[1] + 'px',
						width: nodeWidth + 'px'
					}
				);

				var inputField = instance._comboBox._field;

				inputField.set('width', nodeWidth);
				inputField.fire('adjustSize');

				inputNode.focus();
				inputNode.select();
			},

			/**
			 * Fires the stopEditing event.
			 *
			 * @method _defStopEditingFn
			 * @param {EventFacade} event stopEditing event facade
			 * @protected
			 */
			_defStopEditingFn: function(event, save) {
				var instance = this;

				instance.hide();

				instance.get('node').removeClass(CSS_EDITING);

				if (save) {
					instance.set('contentText', instance.inputNode.get('value'));
				}
				else {
					instance._setInput(instance.get('contentText'));
				}
			},

			/**
			 * Fires the save event.
			 *
			 * @method _defSaveFn
			 * @param {EventFacade} event save event facade
			 * @protected
			 */
			_defSaveFn: function(event) {
				var instance = this;

				instance.fire('stopEditing', true);
			},

			/**
			 * Fires <code>onkeypress</code> occurs on the editable element.
			 *
			 * @method _onKeypressEditable
			 * @param {EventFacade} event
			 * @protected
			 */
			_onKeypressEditable: function(event) {
				var instance = this;

				var keyCode = event.keyCode;

				if (keyCode == 27) {
					event.preventDefault();

					instance.cancel();
				}
				else if (keyCode == 13 && (instance.get('inputType') == 'text')) {
					instance.save();
				}
			},

			/**
			 * Fires <code>onmouseenter</code> occurs on the editable element.
			 *
			 * @method _onMouseEnterEditable
			 * @param {EventFacade} event
			 * @protected
			 */
			_onMouseEnterEditable: function(event) {
				var instance = this;

				instance.get('node').addClass(CSS_HOVER);
			},

			/**
			 * Fires <code>onmouseleave</code> occurs on the editable element.
			 *
			 * @method _onMouseLeaveEditable
			 * @param {EventFacade} event
			 * @protected
			 */
			_onMouseLeaveEditable: function(event) {
				var instance = this;

				instance.get('node').removeClass(CSS_HOVER);
			},

			/**
			 * Set the value of the <a
	         * href="Editable.html#property_inputNode">inputNode</a>.
			 *
			 * @method _setInput
			 * @param {String} value Value of the input.
			 * @protected
			 */
			_setInput: function(value) {
				var instance = this;

				var inputFormatter = instance.get('formatInput');

				if (inputFormatter) {
					value = inputFormatter.call(instance, value);
				}
				else {
					value = instance._toText(value);
				}

				instance.inputNode.set('value', LString.unescapeEntities(value));
			},

			/**
			 * Set the <code>innerHTML</code> of the <a
	         * href="Editable.html#config_node">node</a>.
			 *
			 * @method _setOutput
			 * @param {String} value
			 * @protected
			 */
			_setOutput: function(value) {
				var instance = this;

				var outputFormatter = instance.get('formatOutput');

				if (outputFormatter) {
					value = outputFormatter.call(instance, value);
				}
				else {
					value = instance._toHTML(value);
				}

				instance.get('node').set('innerHTML', value);
			},

			/**
			 * Fires when start editing.
			 *
			 * @method _startEditing
			 * @param {EventFacade} event
			 * @protected
			 */
			_startEditing: function(event) {
				var instance = this;

				if (!instance.get('rendered')) {
					instance.render(instance.get('renderTo'));
				}

				instance.fire('startEditing');

				event.halt();
			},

			/**
			 * Sync the content text.
			 *
			 * @method _syncContentText
			 * @param {EventFacade} event
			 * @protected
			 */
			_syncContentText: function(event) {
				var instance = this;

				if (!event.initial) {
					var contentText = event.newVal;

					instance._setInput(contentText);
					instance._setOutput(contentText);
				}
			},

			/**
			 * Converts the new lines <code>\n</code> to <code><br/></code> (i.e.,
	         * nl2br).
			 *
			 * @method _toHTML
			 * @param {String} text Input text.
			 * @protected
			 * @return {String}
			 */
			_toHTML: function(text) {
				var instance = this;

				return String(text).replace(/\n/gim, '<br/>');
			},

			/**
			 * Converts HTML to text.
			 *
			 * @method _toText
			 * @param {String} text HTML input.
			 * @protected
			 * @return {String}
			 */
			_toText: function(text) {
				var instance = this;

				text = String(text);

				text = text.replace(/<br\s*\/?>/gim, '\n');

				text = text.replace(/(<\/?[^>]+>|\t)/gim, '');

				return text;
			},

			/**
			 * Handles the updating of the UI when the node is set.
			 *
			 * @method _uiSetNode
			 * @param {Node} node.
			 * @protected
			 */

			_uiSetNode: function(node) {
				var instance = this;

				if (instance._mouseEnterHandler) {
					instance._mouseEnterHandler.detach();
				}

				if (instance._mouseLeaveHandler) {
					instance._mouseLeaveHandler.detach();
				}

				if (instance._interactionHandler) {
					instance._interactionHandler.detach();
				}

				var eventType = instance.get('eventType');

				instance._mouseEnterHandler = node.on('mouseenter', instance._onMouseEnterEditable, instance);
				instance._mouseLeaveHandler = node.on('mouseleave', instance._onMouseLeaveEditable, instance);

				instance._interactionHandler = node.on(eventType, instance._startEditing, instance);
			}
		}
	}
);

A.Editable = Editable;


}, 'gallery-2011.02.09-21-32' ,{requires:['gallery-aui-base','gallery-aui-form-combobox'], skinnable:true});
