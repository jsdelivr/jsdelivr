YUI.add('gallery-aui-tooltip', function(A) {

/**
 * The Tooltip Utility - A standard tooltip implementation for providing additional information when hovering over a target element.
 *
 * @module aui-tooltip
 */

var L = A.Lang,
	isString = L.isString,
	isUndefined = L.isUndefined,
	isBoolean = L.isBoolean,

	BL = 'bl',
	TR = 'tr',
	BLANK = '',
	ATTR = 'attr',
	TITLE = 'title',
	CURRENT_NODE = 'currentNode',
	SECTION = 'section',
	TRIGGER = 'trigger',
	BODY_CONTENT = 'bodyContent',
	TOOLTIP = 'tooltip';

/**
 * <p><img src="assets/images/aui-tooltip/main.png"/></p>
 *
 * A base class for Tooltip, providing:
 * <ul>
 *    <li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *    <li>Additional information when hovering over a target element</li>
 * </ul>
 *
 * Quick Example:<br/>
 *
 * <pre><code>var instance = new A.Tooltip({
 *	trigger: '#element',
 *	align: { points: [ 'lc', 'rc' ] },
 *	bodyContent: 'Simple tooltip'
 * }).render();
 * </code></pre>
 *
 * Check the list of <a href="Tooltip.html#configattributes">Configuration Attributes</a> available for
 * Tooltip.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class Tooltip
 * @constructor
 * @extends OverlayContextPanel
 */
var Tooltip = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property Tooltip.NAME
		 * @type String
		 * @static
		 */
		NAME: TOOLTIP,

		/**
		 * Static property used to define the default attribute
		 * configuration for the Tooltip.
		 *
		 * @property Tooltip.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			/**
			 * See <a href="OverlayContextPanel.html#config_anim">OverlayContextPanel anim</a>.
			 *
			 * @attribute anim
			 * @default { show: false }
			 * @type Object
			 */
			anim: {
				value: {
					show: false
				}
			},

			/**
			 * See <a href="Overlay.html#config_align">OverlayContextPanel align</a>.
			 *
			 * @attribute align
			 * @default { node: null, points: [ BL, TR ] }
			 * @type Object
			 */
			align: {
				value: { node: null, points: [ BL, TR ] }
			},

			/**
			 * See <a href="OverlayContext.html#config_showOn">OverlayContext showOn</a>.
			 *
			 * @attribute showOn
			 * @default mouseover
			 * @type String
			 */
			showOn: {
				value: 'mouseover'
			},

			/**
			 * See <a href="OverlayContext.html#config_showOn">OverlayContext showOn</a>.
			 *
			 * @attribute hideOn
			 * @default mouseout
			 * @type String
			 */
			hideOn: {
				value: 'mouseout'
			},

			/**
			 * See <a href="OverlayContext.html#config_hideDelay">OverlayContext hideDelay</a>.
			 *
			 * @attribute hideDelay
			 * @default 500
			 * @type Number
			 */
			hideDelay: {
				value: 500
			},

			/**
			 * Use the content of the <code>title</code> attribute as the Tooltip
	         * content.
			 *
			 * @attribute title
			 * @default false
			 * @type boolean
			 */
			title: {
				value: false,
				validator: isBoolean
			}
		},

		EXTENDS: A.OverlayContextPanel,

		prototype: {
			/**
			 * Bind the events on the Tooltip UI. Lifecycle.
			 *
			 * @method bindUI
			 * @protected
			 */
			bindUI: function() {
				var instance = this;

				Tooltip.superclass.bindUI.apply(instance, arguments);
			},

			/**
			 * Over-ride the <code>show</code> to invoke the
		     * <a href="Tooltip.html#method__loadBodyContentFromTitle">_loadBodyContentFromTitle</a>.
		     * See <a href="OverlayContext.html#config_show">OverlayContext show</a>.
			 *
			 * @method show
			 */
			show: function() {
				var instance = this;
				var bodyContent = instance.get(BODY_CONTENT);

				Tooltip.superclass.show.apply(instance, arguments);

				if (instance.get(TITLE)) {
					instance._loadBodyContentFromTitle( instance.get(CURRENT_NODE) );
				}
			},

			/**
			 * Use the <code>title</code> content of the <code>currentNode</code> as
		     * the content of the Tooltip.
			 *
			 * @method _loadBodyContentFromTitle
			 * @param {Node} currentNode Current node being used by the Tooltip
			 * @protected
			 */
			_loadBodyContentFromTitle: function(currentNode) {
				var instance = this;
				var trigger = instance.get(TRIGGER);

				if (!instance._titles) {
					instance._titles = trigger.attr(TITLE);

					// prevent default browser tooltip for title
					trigger.attr(TITLE, BLANK);
				}

				if (currentNode) {
					var index = trigger.indexOf(currentNode);
					var title = instance._titles[index];

					instance.set(BODY_CONTENT, title);
				}
			},

			/**
			 * Fires after the attribute <code>bodyContent</code> change.
			 *
			 * @method _afterBodyChange
			 * @param {EventFacade} e
			 * @protected
			 */
			_afterBodyChange: function(e) {
				var instance = this;

				Tooltip.superclass._afterBodyChange.apply(this, arguments);

				// need to refreshAlign() after body change
				instance.refreshAlign();
			}
		}
	}
);

A.Tooltip = Tooltip;


}, 'gallery-2010.08.18-17-12' ,{skinnable:true, requires:['gallery-aui-overlay-context-panel']});
