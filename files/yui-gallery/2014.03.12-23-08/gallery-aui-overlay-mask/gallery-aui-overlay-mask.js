YUI.add('gallery-aui-overlay-mask', function(A) {

/**
 * The OverlayMask Utility
 *
 * @module aui-overlay
 * @submodule aui-overlay-mask
 */

var L = A.Lang,
	isArray = L.isArray,
	isString = L.isString,
	isNumber = L.isNumber,
	isValue = L.isValue,

	CONFIG = A.config,

	UA = A.UA,

	IE6 = (UA.ie && UA.version.major <= 6),

	ABSOLUTE = 'absolute',
	ALIGN_POINTS = 'alignPoints',
	BACKGROUND = 'background',
	BOUNDING_BOX = 'boundingBox',
	CONTENT_BOX = 'contentBox',
	FIXED = 'fixed',
	HEIGHT = 'height',
	OFFSET_HEIGHT = 'offsetHeight',
	OFFSET_WIDTH = 'offsetWidth',
	OPACITY = 'opacity',
	OVERLAY_MASK = 'overlaymask',
	POSITION = 'position',
	TARGET = 'target',
	WIDTH = 'width';

/**
 * A base class for OverlayMask, providing:
 * <ul>
 *    <li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *    <li>Cross browser mask functionality to cover an element or the entire page</li>
 *    <li>Customizable mask (i.e., background, opacity)</li>
 * </ul>
 *
 * Quick Example:<br/>
 *
 * <pre><code>var instance = new A.OverlayMask().render();</code></pre>
 *
 * Check the list of <a href="OverlayMask.html#configattributes">Configuration Attributes</a> available for
 * OverlayMask.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class OverlayMask
 * @constructor
 * @extends OverlayBase
 */
var OverlayMask = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property OverlayMask.NAME
		 * @type String
		 * @static
		 */
		NAME: OVERLAY_MASK,

		/**
		 * Static property used to define the default attribute
		 * configuration for the OverlayMask.
		 *
		 * @property OverlayMask.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			/**
			 * Points to align the <a href="Overlay.html">Overlay</a> used as
	         * mask.
			 *
			 * @attribute alignPoints
			 * @default [ 'tl', 'tl' ]
			 * @type Array
			 */
			alignPoints: {
				value: [ 'tl', 'tl' ],
				validator: isArray
	        },

			/**
			 * Background color of the mask.
			 *
			 * @attribute background
			 * @default null
			 * @type String
			 */
			background: {
				lazyAdd: false,
				value: null,
				validator: isString,
				setter: function(v) {
					if (v) {
						this.get(CONTENT_BOX).setStyle(BACKGROUND, v);
					}

					return v;
				}
			},

			/**
			 * Node where the mask will be positioned and re-dimensioned. The
	         * default is the document, which means that if not specified the mask
	         * takes the full screen.
			 *
			 * @attribute target
			 * @default document
			 * @type Node | String
			 */
			target: {
				cloneDefaultValue: false,
				lazyAdd: false,
				value: CONFIG.doc,
				setter: function(v) {
					var instance = this;

					var target = A.one(v);

					var isDoc = instance._isDoc = target.compareTo(CONFIG.doc);
					var isWin = instance._isWin = target.compareTo(CONFIG.win);

					instance._fullPage = isDoc || isWin;

					return target;
				}
			},

			/**
			 * CSS opacity of the mask.
			 *
			 * @attribute opacity
			 * @default .5
			 * @type Number
			 */
			opacity: {
				value: 0.5,
				validator: isNumber,
				setter: function(v) {
					return this._setOpacity(v);
				}
			},

			/**
			 * Use shim option.
			 *
			 * @attribute shim
			 * @default True on IE.
			 * @type boolean
			 */
			shim: {
				value: A.UA.ie
			},

			/**
			 * If true the Overlay is visible by default after the render phase.
	         * Inherited from <a href="Overlay.html">Overlay</a>.
			 *
			 * @attribute visible
			 * @default false
			 * @type boolean
			 */
			visible: {
				value: false
			},

			/**
			 * zIndex of the OverlayMask.
			 *
			 * @attribute zIndex
			 * @default 1000
			 * @type Number
			 */
			zIndex: {
				value: 1000
			}
		},

		EXTENDS: A.OverlayBase,

		prototype: {
			/**
			 * Bind the events on the OverlayMask UI. Lifecycle.
			 *
			 * @method bindUI
			 * @protected
			 */
			bindUI: function() {
				var instance = this;

				OverlayMask.superclass.bindUI.apply(this, arguments);

				instance.after('targetChange', instance._afterTargetChange);
				instance.after('visibleChange', instance._afterVisibleChange);

				// window:resize YUI normalized event is not working, bug?
				A.on('windowresize', A.bind(instance.refreshMask, instance));
			},

			/**
			 * Sync the OverlayMask UI. Lifecycle.
			 *
			 * @method syncUI
			 * @protected
			 */
			syncUI: function() {
				var instance = this;

				instance.refreshMask();
			},

			/**
			 * Get the size of the
		     * <a href="OverlayMask.html#config_target">target</a>. Used to dimension
		     * the mask node.
			 *
			 * @method getTargetSize
			 * @return {Object} Object containing the { height: height, width: width }.
			 */
			getTargetSize: function() {
				var instance = this;
				var target = instance.get(TARGET);

				var isDoc = instance._isDoc;
				var isWin = instance._isWin;

				var height = target.get(OFFSET_HEIGHT);
				var width = target.get(OFFSET_WIDTH);

				if (IE6) {
					// IE6 doesn't support height/width 100% on doc/win
					if (isWin) {
						width = A.DOM.winWidth();
						height = A.DOM.winHeight();
					}
					else if (isDoc) {
						width = A.DOM.docWidth();
						height = A.DOM.docHeight();
					}
				}
				// good browsers...
				else if (instance._fullPage) {
					height = '100%';
					width = '100%';
				}

				return { height: height, width: width };
			},

			/**
			 * Repaint the OverlayMask UI, respecting the
		     * <a href="OverlayMask.html#config_target">target</a> size and the
		     * <a href="OverlayMask.html#config_alignPoints">alignPoints</a>.
			 *
			 * @method refreshMask
			 */
			refreshMask: function() {
				var instance = this;
				var alignPoints = instance.get(ALIGN_POINTS);
				var target = instance.get(TARGET);
				var boundingBox = instance.get(BOUNDING_BOX);
				var targetSize = instance.getTargetSize();

				var fullPage = instance._fullPage;

				boundingBox.setStyles({
					position: (IE6 || !fullPage) ? ABSOLUTE : FIXED,
					left: 0,
					top: 0
				});

				var height = targetSize.height;
				var width = targetSize.width;

				if (isValue(height)) {
					instance.set(HEIGHT, height);
				}

				if (isValue(width)) {
					instance.set(WIDTH, width);
				}

				// if its not a full mask...
				if ( !fullPage ) {
					// if the target is not document|window align the overlay
					instance.align(target, alignPoints);
				}
			},

			/**
			 * Setter for <a href="Paginator.html#config_opacity">opacity</a>.
			 *
			 * @method _setOpacity
			 * @protected
			 * @param {Number} v
			 * @return {Number}
			 */
			_setOpacity: function(v) {
				var instance = this;

				instance.get(CONTENT_BOX).setStyle(OPACITY, v);

				return v;
			},

			/**
			 * Invoke the <code>OverlayMask.superclass._uiSetVisible</code>. Used to
		     * reset the <code>opacity</code> to work around IE bugs when set opacity
		     * of hidden elements.
			 *
			 * @method _uiSetVisible
			 * @param {boolean} val
			 * @protected
			 */
			_uiSetVisible: function(val) {
				var instance = this;

				OverlayMask.superclass._uiSetVisible.apply(this, arguments);

				if (val) {
					instance._setOpacity(
						instance.get(OPACITY)
					);
				}
			},

			/**
			 * Fires after the value of the
			 * <a href="Paginator.html#config_target">target</a> attribute change.
			 *
			 * @method _afterTargetChange
			 * @param {EventFacade} event
			 * @protected
			 */
			_afterTargetChange: function(event) {
				var instance = this;

				instance.refreshMask();
			},

			/**
			 * Fires after the value of the
			 * <a href="Paginator.html#config_visible">visible</a> attribute change.
			 *
			 * @method _afterVisibleChange
			 * @param {EventFacade} event
			 * @protected
			 */
			_afterVisibleChange: function(event) {
				var instance = this;

				instance._uiSetVisible(event.newVal);
			},

			/**
			 * UI Setter for the 
			 * <a href="Paginator.html#config_xy">XY</a> attribute.
			 *
			 * @method _uiSetXY
			 * @param {EventFacade} event
			 * @protected
			 */
			_uiSetXY: function() {
				var instance = this;

				if (!instance._fullPage || IE6) {
					OverlayMask.superclass._uiSetXY.apply(instance, arguments);
				}
			}
		}
	}
);

A.OverlayMask = OverlayMask;


}, 'gallery-2011.02.09-21-32' ,{requires:['gallery-aui-base','gallery-aui-overlay-base','event-resize'], skinnable:true});
