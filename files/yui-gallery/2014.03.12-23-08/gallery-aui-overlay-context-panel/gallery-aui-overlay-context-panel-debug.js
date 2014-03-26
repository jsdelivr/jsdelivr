YUI.add('gallery-aui-overlay-context-panel', function(A) {

/**
 * The OverlayContextPanel Utility
 *
 * @module aui-overlay
 * @submodule aui-overlay-context-panel
 */

var L = A.Lang,
	isBoolean = L.isBoolean,
	isString = L.isString,
	isObject = L.isObject,

	ALIGN = 'align',
	ANIM = 'anim',
	ARROW = 'arrow',
	BACKGROUND_COLOR = 'backgroundColor',
	BLANK = '',
	BOUNDING_BOX = 'boundingBox',
	CLICK = 'click',
	CONTENT_BOX = 'contentBox',
	CONTEXTPANEL = 'overlaycontextpanel',
	DEFAULT = 'default',
	DOT = '.',
	END = 'end',
	HIDDEN = 'hidden',
	INNER = 'inner',
	OPACITY = 'opacity',
	POINTER = 'pointer',
	SHOW_ARROW = 'showArrow',
	STATE = 'state',
	STYLE = 'style',
	VISIBLE = 'visible',

	BC = 'bc',
	BL = 'bl',
	BR = 'br',
	CC = 'cc',
	LB = 'lb',
	LC = 'lc',
	LT = 'lt',
	RB = 'rb',
	RC = 'rc',
	RL = 'rl',

	getCN = A.ClassNameManager.getClassName,

	CSS_CONTEXTPANEL = getCN(CONTEXTPANEL),
	CSS_CONTEXTPANEL_ARROW = getCN(CONTEXTPANEL, ARROW, BLANK),
	CSS_CONTEXTPANEL_HIDDEN = getCN(CONTEXTPANEL, HIDDEN),
	CSS_CONTEXTPANEL_POINTER = getCN(CONTEXTPANEL, POINTER),
	CSS_CONTEXTPANEL_POINTER_INNER = getCN(CONTEXTPANEL, POINTER, INNER),
	CSS_STATE_DEFAULT = getCN(STATE, DEFAULT),

	TPL_POINTER = '<div class="' + [ CSS_STATE_DEFAULT, CSS_CONTEXTPANEL_POINTER ].join(' ') + '"></div>',
	TPL_POINTER_INNER = '<div class="' + CSS_CONTEXTPANEL_POINTER_INNER + '"></div>';

/**
 * <p><img src="assets/images/aui-overlay-context-panel/main.png"/></p>
 *
 * A base class for OverlayContextPanel, providing:
 * <ul>
 *	<li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *	<li>Customizable arrow</li>
 *	<li>Optional animation when show or hide</li>
 * </ul>
 *
 * Quick Example:<br/>
 * 
 * <pre><code>var instance = new A.OverlayContextPanel({
 *  bodyContent: 'Here s a sample OverlayContextPanel.',
 *  boundingBox: '#overlay-context-panel',
 *  trigger: '#triggerButton',
 *  cancellableHide: true,
 *  hideDelay: 200,
 *  hideOnDocumentClick: false,
 *  anim: true
 * }).render();
 * </code></pre>
 *
 * Check the list of <a href="OverlayContextPanel.html#configattributes">Configuration Attributes</a> available for
 * OverlayContextPanel.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class OverlayContextPanel
 * @constructor
 * @extends OverlayContext
 */
var OverlayContextPanel = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property OverlayContextPanel.NAME
		 * @type String
		 * @static
		 */
		NAME: CONTEXTPANEL,

		/**
		 * Static property used to define the default attribute
		 * configuration for the OverlayContextPanel.
		 *
		 * @property OverlayContextPanel.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			/**
			 * Enable or disable the animation for hide and show. Used as the
			 * <a href="Anim.html">Anim</a> configuration attributes.
			 *
			 * <pre><code>anim: {
			 *  show: {
			 *  	duration: .9
			 *  },
			 *  hide: {
			 *  	duration: .2
			 *  }
			 * }
			 * </code></pre>
			 * 
			 * @attribute anim
			 * @default { show: false }
			 * @type Object
			 */
			anim: {
				lazyAdd: false,
				value: {
					show: false
				},
				setter: function(v) {
					return this._setAnim(v);
				}
			},

			/**
			 * Position where the arrow will be placed. See
			 * <a href="OverlayContextPanel.html#config_showArrow">showArrow</a>. If it's
			 * not set, it will get the value set on the
			 * <a href="OverlayContext.html#config_align">align</a> point. Here is a
			 * list of valid arrows 'bc', 'bl', 'br', 'cc', 'lb', 'lc', 'lt', 'rb',
			 * 'rc', 'rl'.
			 *
			 * @attribute arrow
			 * @default null
			 * @type String
			 */
			arrow: {
				value: null,
				validator: isString
			},

			/**
			 * See <a href="OverlayContext.html#config_hideOn">hideOn</a>.
			 *
			 * @attribute hideOn
			 * @default click
			 * @type String
			 */
			hideOn: {
				value: CLICK
			},

			/**
			 * See <a href="OverlayContext.html#config_showOn">showOn</a>.
			 *
			 * @attribute showOn
			 * @default click
			 * @type String
			 */
			showOn: {
				value: CLICK
			},

			/**
			 * If true the OverlayContextPanel will show an arrow positioned on the
			 * <a href="OverlayContextPanel.html#config_arrow">arrow</a> point.
			 *
			 * @attribute showArrow
			 * @default true
			 * @type boolean
			 */
			showArrow: {
				lazyAdd: false,
				value: true,
				validator: isBoolean
			},

			/**
			 * Gives stacking habilities to the OverlayContextPanel.
			 *
			 * @attribute stack
			 * @default true
			 * @type boolean
			 */
			stack: {
				lazyAdd: false,
				value: true,
				setter: function(v) {
					return this._setStack(v);
				},
				validator: isBoolean
			}
		},

		EXTENDS: A.OverlayContext,

		prototype: {
			/**
			 * Bind the events on the OverlayContextPanel UI. Lifecycle.
			 *
			 * @method bindUI
			 * @protected
			 */
			bindUI: function() {
				var instance = this;

				instance.after('showArrowChange', instance._afterShowArrowChange);

				instance.before('show', instance._beforeShow);

				OverlayContextPanel.superclass.bindUI.apply(instance, arguments);
			},

			/**
			 * Create the DOM structure for the OverlayContextPanel. Lifecycle.
			 *
			 * @method renderUI
			 * @protected
			 */
			renderUI: function() {
				var instance = this;

				instance._renderElements();
			},

			/**
			 * Sync the OverlayContextPanel UI. Lifecycle.
			 *
			 * @method syncUI
			 * @protected
			 */
			syncUI: function() {
				var instance = this;

				instance._syncElements();
			},

			/**
			 * Aligns the OverlayContextPanel to the provided node (or viewport) using the
			 * provided points. Inherited from
			 * <a href="Overlay.html#method_align">Overlay</a>.
			 *
			 * @method align
			 * @param {Node | String | null} node A reference (or selector string) for
			 * the Node which with the OverlayContextPanel is to be aligned.
			 * @param {Array[2]} points A two element array, specifying the points on
			 * the OverlayContextPanel and node/viewport which need to be aligned.
			 */
			align: function (node, points) {
				var instance = this;

				OverlayContextPanel.superclass.align.apply(this, arguments);

				instance._syncElements();
			},

			/**
			 * OverlayContextPanel uses a imageless arrow, which involves some CSS technics.
			 * This method is meant to fix the color of the borders of the arrow.
			 *
			 * @method fixPointerColor
			 */
			fixPointerColor: function() {
				var instance = this;
				var contentBox = instance.get(CONTENT_BOX);
				var pointer = contentBox.one(DOT+CSS_CONTEXTPANEL_POINTER_INNER);

				pointer.removeAttribute(STYLE);

				var bColor = contentBox.getStyle(BACKGROUND_COLOR);
				var border = 'borderBottomColor';

				var right = [
					DOT+CSS_CONTEXTPANEL_ARROW+RB,
						DOT+CSS_CONTEXTPANEL_ARROW+RC,
							DOT+CSS_CONTEXTPANEL_ARROW+RL
				]
				.join(',');

				var bottom = [
					DOT+CSS_CONTEXTPANEL_ARROW+BR,
						DOT+CSS_CONTEXTPANEL_ARROW+BC,
							DOT+CSS_CONTEXTPANEL_ARROW+BL
				]
				.join(',');

				var left = [
					DOT+CSS_CONTEXTPANEL_ARROW+LB,
						DOT+CSS_CONTEXTPANEL_ARROW+LC,
							DOT+CSS_CONTEXTPANEL_ARROW+LT
				]
				.join(',');

				if (contentBox.test(right)) {
					border = 'borderLeftColor';
				}
				else if (contentBox.test(bottom)) {
					border = 'borderTopColor';
				}
				else if (contentBox.test(left)) {
					border = 'borderRightColor';
				}

				pointer.setStyle(border, bColor);
			},

			/**
			 * Normalize the align point value. The align point 'cc' is not a valid
			 * position for the arrow and then it's normalized to the 'bc' point.
			 *
			 * @method getAlignPoint
			 * @return {String}
			 */
			getAlignPoint: function() {
				var instance = this;
				var overlayPoint = instance.get(ALIGN).points[0];

				if (overlayPoint == CC) {
					// CC is not a valid position for the arrow
					overlayPoint = BC;
				}

				return instance.get(ARROW) || overlayPoint;
			},

			/**
			 * Hides the OverlayContextPanel.
			 *
			 * @method hide
			 * @param {EventFacade} event 
			 */
			hide: function(event) {
				var instance = this;

				if(instance._hideAnim) {
					var visible = instance.get(VISIBLE);

					if (visible) {
						instance._hideAnim.once(END, function() {
							OverlayContextPanel.superclass.hide.apply(instance, arguments);
						});

						instance._hideAnim.run();
					}
				}
				else {
					OverlayContextPanel.superclass.hide.apply(instance, arguments);
				}
			},

			/**
			 * Render DOM elements for the OverlayContextPanel.
			 *
			 * @method _renderElements
			 * @protected
			 */
			_renderElements: function() {
				var instance = this;
				var contentBox = instance.get(CONTENT_BOX);
				var align = instance.get(ALIGN);
				var overlayPoint = align.points[0];

				contentBox.addClass(CSS_STATE_DEFAULT);

				instance._pointerNode = A.Node.create(TPL_POINTER).append(TPL_POINTER_INNER);

				contentBox.append(
					instance._pointerNode
				);
			},

			/**
			 * Sync the UI of the OverlayContextPanel elements.
			 *
			 * @method _syncElements
			 * @protected
			 */
			_syncElements: function() {
				var instance = this;
				var contentBox = instance.get(CONTENT_BOX);
				var pointerNode = instance._pointerNode;
				var overlayPoint = instance.getAlignPoint();

				if (instance.get(SHOW_ARROW)) {
					pointerNode.removeClass(CSS_CONTEXTPANEL_HIDDEN);
					contentBox.removeClass(CSS_CONTEXTPANEL_ARROW + instance._lastOverlayPoint);
					contentBox.addClass(CSS_CONTEXTPANEL_ARROW + overlayPoint);

					instance.fixPointerColor();
				}
				else {
					pointerNode.addClass(CSS_CONTEXTPANEL_HIDDEN);
				}

				instance._lastOverlayPoint = overlayPoint;
			},

			/**
			 * Setter for the
			 * <a href="OverlayContextPanel.html#config_stack">stack</a> attribute.
			 *
			 * @method _setStack
			 * @param {boolean} value
			 * @protected
			 * @return {boolean}
			 */
			_setStack: function(value) {
				var instance = this;

				if (value) {
					A.OverlayContextPanelManager.register(instance);
				}
				else {
					A.OverlayContextPanelManager.remove(instance);
				}

				return value;
			},

			/**
			 * Setter for the
			 * <a href="OverlayContextPanel.html#config_anim">anim</a> attribute.
			 *
			 * @method _setAnim
			 * @param {Object} value
			 * @protected
			 * @return {Object}
			 */
			_setAnim: function(value) {
				var instance = this;
				var boundingBox = instance.get(BOUNDING_BOX);

				if (value) {
					var defaults = {
						node: boundingBox,
						duration: 0.1
					};

					var showOptions = A.merge(defaults, {
						from: { opacity: 0 },
						to: { opacity: 1 }
					});

					var hideOptions = A.merge(defaults, {
						from: { opacity: 1 },
						to: { opacity: 0 }
					});

					if (isObject(value)) {
						// loading user settings for animation
						showOptions = A.merge(showOptions, value.show);
						hideOptions = A.merge(hideOptions, value.hide);
					}

					instance._showAnim = new A.Anim(showOptions);
					instance._hideAnim = new A.Anim(hideOptions);

					// if anim.show or anim.hide === false, cancel respective animation
					if (isObject(value)) {
						if (value.show === false) {
							instance._showAnim = null;
						}

						if (value.hide === false) {
							instance._hideAnim = null;
						}
					}
				}

				return value;
			},

			/**
			 * Fires before show the OverlayContextPanel.
			 *
			 * @method _beforeShow
			 * @param {EventFacade} event 
			 * @protected
			 */
			_beforeShow: function(event) {
				var instance = this;
				var boundingBox = instance.get(BOUNDING_BOX);
				var visible = instance.get(VISIBLE);

				if(!visible && instance._showAnim) {
					boundingBox.setStyle(OPACITY, 0);

					instance._showAnim.run();
				}
				else {
					boundingBox.setStyle(OPACITY, 1);
				}
			},

			/**
			 * Fires after showArrow attribute changes.
			 *
			 * @method _afterShowArrowChange
			 * @param {EventFacade} event 
			 * @protected
			 */
			_afterShowArrowChange: function() {
				var instance = this;

				instance._syncElements();
			}
		}
	}
);

A.OverlayContextPanel = OverlayContextPanel;

/**
 * A base class for OverlayContextPanelManager:
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class OverlayContextPanelManager
 * @constructor
 * @extends OverlayManager
 * @static
 */
A.OverlayContextPanelManager = new A.OverlayManager({
	zIndexBase: 1000
});


}, 'gallery-2011.02.09-21-32' ,{requires:['gallery-aui-overlay-context','anim'], skinnable:true});
