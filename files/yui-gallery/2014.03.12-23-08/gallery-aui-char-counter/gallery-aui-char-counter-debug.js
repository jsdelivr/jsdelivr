YUI.add('gallery-aui-char-counter', function(A) {

/**
 * The CharCounter Utility
 *
 * @module aui-char-counter
 */

var L = A.Lang,
	isNumber = L.isNumber,

	CHAR_COUNTER = 'char-counter',
	COUNTER = 'counter',
	INPUT = 'input',
	MAX_LENGTH = 'maxLength',
	SCROLL_LEFT = 'scrollLeft',
	SCROLL_TOP = 'scrollTop';

/**
 * <p><img src="assets/images/aui-char-counter/main.png"/></p>
 *
 * A base class for CharCounter, providing:
 * <ul>
 *    <li>Limit the number of characters allowed in an input box</li>
 *    <li>Display the number of characters left</li>
 * </ul>
 *
 * Quick Example:<br/>
 *
 * <pre><code>var instance = new A.CharCounter({
 *  input: '#elementId',
 *  counter: '#counterDisplayId',
 *  maxLength: 10
 * });
 * </code></pre>
 *
 * Check the list of <a href="CharCounter.html#configattributes">Configuration Attributes</a> available for
 * CharCounter.
 *
 * @class CharCounter
 * @uses AUI~input~handle
 * @param config {Object} Object literal specifying widget configuration properties.
 * @constructor
 * @extends Base
 */
var CharCounter = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property CharCounter.NAME
		 * @type String
		 * @static
		 */
		NAME: CHAR_COUNTER,

		/**
		 * Static property used to define the default attribute
		 * configuration for the CharCounter.
		 *
		 * @property CharCounter.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			/**
			 * Node or Selector to display the information of the counter.
			 *
			 * @attribute counter
			 * @default null
			 * @type {Node | String}
			 */
			counter: {
				setter: A.one
			},

			/**
			 * Max number of characters the <a
	         * href="CharCounter.html#config_input">input</a> can have.
			 *
			 * @attribute maxLength
			 * @default Infinity
			 * @type Number
			 */
			maxLength: {
				lazyAdd: false,
				setter: function(v) {
					return this._setMaxLength(v);
				},
				value: Infinity,
				validator: isNumber
			},

			/**
			 * Node or Selector for the input field. Required.
			 *
			 * @attribute input
			 * @default null
			 * @type {Node | String}
			 */
			input: {
				setter: A.one
			}
		},

		EXTENDS: A.Base,

		prototype: {
			/**
			 * Event handler for the input <a
		     * href="module_aui-event.html">aui-event</a> event.
			 *
			 * @property handler
			 * @type EventHandle
			 * @protected
			 */
			handler: null,

			/**
			 * Construction logic executed during CharCounter instantiation. Lifecycle.
			 *
			 * @method initializer
			 * @protected
			 */
			initializer: function() {
				var instance = this;

				instance.bindUI();

				instance.checkLength();
			},

			/**
			 * Bind the events on the CharCounter UI. Lifecycle.
			 *
			 * @method bindUI
			 * @protected
			 */
			bindUI: function() {
				var instance = this;
				var input = instance.get(INPUT);

				instance.publish('maxLength');

				instance.after('maxLengthChange', instance.checkLength);

				if (input) {
					// use cross browser input-handler event
					instance.handler = input.on(INPUT, A.bind(instance._onInputChange, instance));
				}
			},

			/**
			 * Sync the CharCounter UI. Lifecycle.
			 *
			 * @method syncUI
			 * @protected
			 */
			syncUI: function() {
				var instance = this;
				var counter = instance.get(COUNTER);

				if (counter) {
					var value = instance.get(INPUT).val();

					counter.html(
						instance.get(MAX_LENGTH) - value.length
					);
				}
			},

			/**
			 * Descructor lifecycle implementation for the CharCounter class.
			 * Purges events attached to the node (and all child nodes).
			 *
			 * @method destroy
			 * @protected
			 */
			destroy: function() {
				var instance = this;

				if (instance.handler) {
					instance.handler.detach();
				}
			},

			/**
			 * Check the current value of the <a
		     * href="CharCounter.html#config_input">input</a>, truncate the data if
		     * needed, and re-sync the UI. Fired from <a
		     *  href="CharCounter.html#method__onInputChange">_onInputChange</a>.
			 *
			 * @method checkLength
			 */
			checkLength: function() {
				var instance = this;
				var input = instance.get(INPUT);
				var maxLength = instance.get(MAX_LENGTH);

				if (!input) {
					return false; // NOTE: return
				}

				var value = input.val();
				var scrollTop = input.get(SCROLL_TOP);
				var scrollLeft = input.get(SCROLL_LEFT);

				if (value.length > maxLength) {
					input.val(
						value.substring(0, maxLength)
					);
				}

				if (value.length == maxLength) {
					instance.fire('maxLength');
				}

				input.set(SCROLL_TOP, scrollTop);
				input.set(SCROLL_LEFT, scrollLeft);

				instance.syncUI();
			},

			/**
			 * Fired on input value change.
			 *
			 * @method _onInputChange
			 * @param {EventFacade} event
			 * @protected
			 */
			_onInputChange: function(event) {
				var instance = this;

				instance.checkLength();
			},

			/**
			 * Setter for <a href="CharCounter.html#config_maxLength">maxLength</a>.
			 *
			 * @method _setMaxLength
			 * @param {Number} v Value of the new <a
		     * href="CharCounter.html#config_maxLenght">maxLenght</a>.
			 * @protected
			 * @return {Number}
			 */
			_setMaxLength: function(v) {
				var instance = this;
				var input = instance.get(INPUT);

				if (input && (v < Infinity)) {
					input.set(MAX_LENGTH, v);
				}

				return v;
			}
		}
	}
);

A.CharCounter = CharCounter;


}, 'gallery-2010.08.18-17-12' ,{requires:['gallery-aui-base','gallery-aui-event-input'], skinnable:false});
