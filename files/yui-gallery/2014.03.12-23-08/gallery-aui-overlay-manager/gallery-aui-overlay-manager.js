YUI.add('gallery-aui-overlay-manager', function(A) {

/**
 * The OverlayManager Utility
 *
 * @module aui-overlay
 * @submodule aui-overlay-manager
 */

var Lang = A.Lang,
	isArray = Lang.isArray,
	isBoolean = Lang.isBoolean,
	isNumber = Lang.isNumber,
	isString = Lang.isString,

	BOUNDING_BOX = 'boundingBox',
	DEFAULT = 'default',
	HOST = 'host',
	OVERLAY_MANAGER = 'OverlayManager',
	GROUP = 'group',
	Z_INDEX = 'zIndex',
	Z_INDEX_BASE = 'zIndexBase';

	/**
	 * <p><img src="assets/images/aui-overlay-manager/main.png"/></p>
	 *
	 * A base class for OverlayManager, providing:
	 * <ul>
	 *    <li>Grouping overlays</li>
	 *    <li>Show or hide the entire group of registered overlays</li>
	 *    <li>Basic Overlay Stackability (zIndex support)</li>
	 * </ul>
	 *
	 * Quick Example:<br/>
	 *
	 * <pre><code>var groupOverlayManager = new A.OverlayManager();
	 * groupOverlayManager.register([overlay1, overlay2, overlay3]);
     * groupOverlayManager.hideAll();
	 * </code></pre>
	 *
	 * Check the list of <a href="OverlayManager.html#configattributes">Configuration Attributes</a> available for
	 * OverlayManager.
	 *
	 * @param config {Object} Object literal specifying widget configuration properties.
	 *
	 * @class OverlayManager
	 * @constructor
	 * @extends Base
	 */
	var OverlayManager = A.Component.create(
		{
			/**
			 * Static property provides a string to identify the class.
			 *
			 * @property OverlayManager.NAME
			 * @type String
			 * @static
			 */
			NAME: OVERLAY_MANAGER.toLowerCase(),

			/**
			 * Static property used to define the default attribute
			 * configuration for the OverlayManager.
			 *
			 * @property OverlayManager.ATTRS
			 * @type Object
			 * @static
			 */
			ATTRS: {
				/**
				 * The zIndex base to be used on the stacking for all overlays
                 * registered on the OverlayManager.
				 *
				 * @attribute zIndexBase
				 * @default 1000
				 * @type Number
				 */
				zIndexBase: {
					value: 1000,
					validator: isNumber,
					setter: function(value) {
						return parseInt(value, 10);
					}
				}
			},

			EXTENDS: A.Base,

			prototype: {
				/**
				 * Construction logic executed during OverlayManager instantiation. Lifecycle.
				 *
				 * @method initializer
				 * @protected
				 */
				initializer: function() {
					var instance = this;

					instance._overlays = [];
				},

				/**
				 * Set the passed overlay zIndex to the highest value.
				 *
				 * @method bringToTop
				 * @param {Overlay} overlay Instance of
		         * <a href="Overlay.html">Overlay</a>.
				 */
				bringToTop: function(overlay) {
					var instance = this;

					var overlays = instance._overlays.sort(instance.sortByZIndexDesc);

					var highest = overlays[0];

					if (highest !== overlay) {
						var overlayZ = overlay.get(Z_INDEX);
						var highestZ = highest.get(Z_INDEX);

						overlay.set(Z_INDEX, highestZ + 1);

						overlay.set('focused', true);
					}
				},

				/**
				 * Descructor lifecycle implementation for the OverlayManager class.
				 * Purges events attached to the node (and all child nodes).
				 *
				 * @method destructor
				 * @protected
				 */
				destructor: function() {
					var instance = this;

					instance._overlays = [];
				},

				/**
				 * Register the passed <a href="Overlay.html">Overlay</a> to this
		         * OverlayManager.
				 *
				 * @method register
				 * @param {Overlay} overlay <a href="Overlay.html">Overlay</a> instance to be registered
				 * @return {Array} Registered overlays
				 */
				register: function (overlay) {
					var instance = this;

					var overlays = instance._overlays;

					if (isArray(overlay)) {
						A.Array.each(overlay, function(o) {
							instance.register(o);
						});
					}
					else {
						var zIndexBase = instance.get(Z_INDEX_BASE);
						var registered = instance._registered(overlay);

						if (
							!registered && overlay &&
							((overlay instanceof A.Overlay) ||
							(A.Component && overlay instanceof A.Component))
						) {
							var boundingBox = overlay.get(BOUNDING_BOX);

							overlays.push(overlay);

							var zIndex = overlay.get(Z_INDEX) || 0;
							var newZIndex = overlays.length + zIndex + zIndexBase;

							overlay.set(Z_INDEX, newZIndex);

							overlay.on('focusedChange', instance._onFocusedChange, instance);
							boundingBox.on('mousedown', instance._onMouseDown, instance);
						}
					}

					return overlays;
				},

				/**
				 * Remove the passed <a href="Overlay.html">Overlay</a> from this
		         * OverlayManager.
				 *
				 * @method remove
				 * @param {Overlay} overlay <a href="Overlay.html">Overlay</a> instance to be removed
				 * @return {null}
				 */
				remove: function (overlay) {
					var instance = this;

					var overlays = instance._overlays;

					if (overlays.length) {
						return A.Array.removeItem(overlays, overlay);
					}

					return null;
				},

				/**
				 * Loop through all registered <a href="Overlay.html">Overlay</a> and
		         * execute a callback.
				 *
				 * @method each
				 * @param {function} fn Callback to be executed on the
		         * <a href="Array.html#method_each">Array.each</a>
				 * @return {null}
				 */
				each: function(fn) {
					var instance = this;

					var overlays = instance._overlays;

					A.Array.each(overlays, fn);
				},

				/**
				 * Invoke the <a href="Overlay.html#method_show">show</a> method from
		         * all registered Overlays.
				 *
				 * @method showAll
				 */
				showAll: function() {
					this.each(
						function(overlay) {
							overlay.show();
						}
					);
				},

				/**
				 * Invoke the <a href="Overlay.html#method_hide">hide</a> method from
		         * all registered Overlays.
				 *
				 * @method hideAll
				 */
				hideAll: function() {
					this.each(
						function(overlay) {
							overlay.hide();
						}
					);
				},

				/**
				 * zIndex comparator. Used on Array.sort.
				 *
				 * @method sortByZIndexDesc
				 * @param {Overlay} a Overlay
				 * @param {Overlay} b Overlay
				 * @return {Number}
				 */
				sortByZIndexDesc: function(a, b) {
					if (!a || !b || !a.hasImpl(A.WidgetStack) || !b.hasImpl(A.WidgetStack)) {
						return 0;
					}
					else {
						var aZ = a.get(Z_INDEX);
						var bZ = b.get(Z_INDEX);

						if (aZ > bZ) {
							return -1;
						} else if (aZ < bZ) {
							return 1;
						} else {
							return 0;
						}
					}
				},

				/**
				 * Check if the overlay is registered.
				 *
				 * @method _registered
				 * @param {Overlay} overlay Overlay
				 * @protected
				 * @return {boolean}
				 */
				_registered: function(overlay) {
					var instance = this;

					return A.Array.indexOf(instance._overlays, overlay) != -1;
				},

				/**
				 * Mousedown event handler, used to invoke
		         * <a href="OverlayManager.html#method_bringToTop">bringToTop</a>.
				 *
				 * @method _onMouseDown
				 * @param {EventFacade} event
				 * @protected
				 */
				_onMouseDown: function(event) {
					var instance = this;
					var overlay = A.Widget.getByNode(event.currentTarget || event.target);
					var registered = instance._registered(overlay);

					if (overlay && registered) {
						instance.bringToTop(overlay);
					}
				},

				/**
				 * Fires when the <a href="Widget.html#config_focused">focused</a>
		         * attribute change. Used to invoke
		         * <a href="OverlayManager.html#method_bringToTop">bringToTop</a>.
				 *
				 * @method _onFocusedChange
				 * @param {EventFacade} event
				 * @protected
				 */
				_onFocusedChange: function(event) {
					var instance = this;

					if (event.newVal) {
						var overlay = event.currentTarget || event.target;
						var registered = instance._registered(overlay);

						if (overlay && registered) {
							instance.bringToTop(overlay);
						}
					}
				}
			}
		}
	);

	A.OverlayManager = OverlayManager;


}, 'gallery-2010.08.18-17-12' ,{requires:['gallery-aui-base','gallery-aui-overlay-base','overlay','plugin']});
