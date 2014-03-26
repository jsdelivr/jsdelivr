YUI.add('gallery-aui-progressbar', function(A) {

/**
 * The ProgressBar Utility provides a visual means of showing progress of an
 * ongoing operation. The ProgressBar can be enhanced via CSS styles to provide
 * different colors, shapes and textures. The bar can move horizontally or
 * vertically. The movement can be enhanced by using the Animation utility.
 *
 * @module aui-progressbar
 */

var L = A.Lang,
	isNumber = L.isNumber,
	isString = L.isString,

	BLANK = '',
	DOT = '.',
	SPACE = ' ',

	AUTO = 'auto',
	BOUNDING_BOX = 'boundingBox',
	COMPLETE = 'complete',
	CONTENT_BOX = 'contentBox',
	HEIGHT = 'height',
	HORIZONTAL = 'horizontal',
	LABEL = 'label',
	LINE_HEIGHT = 'lineHeight',
	MAX = 'max',
	MIN = 'min',
	OFFSET_HEIGHT = 'offsetHeight',
	ORIENTATION = 'orientation',
	PROGRESS_BAR = 'progress-bar',
	PX = 'px',
	RATIO = 'ratio',
	STATUS = 'status',
	STATUS_NODE = 'statusNode',
	STEP = 'step',
	TEXT = 'text',
	TEXT_NODE = 'textNode',
	VALUE = 'value',
	VERTICAL = 'vertical',
	WIDTH = 'width',

	toNumber = function(v) {
		return parseFloat(v) || 0;
	},

	getCN = A.ClassNameManager.getClassName,

	CSS_HORIZONTAL = getCN(PROGRESS_BAR, HORIZONTAL),
	CSS_STATUS = getCN(PROGRESS_BAR, STATUS),
	CSS_TEXT = getCN(PROGRESS_BAR, TEXT),
	CSS_VERTICAL = getCN(PROGRESS_BAR, VERTICAL),

	TPL_STATUS = '<div class="'+CSS_STATUS+'"></div>',
	TPL_TEXT = '<div class="'+CSS_TEXT+'"></div>';

/**
 * <p><img src="assets/images/aui-progressbar/main.png"/></p>
 *
 * A base class for Progressbar, providing:
 * <ul>
 *    <li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *    <li>A visual means of showing progress of an ongoing operation</li>
 *    <li>Can be enhanced via CSS styles to provide different colors, shapes and textures</li>
 *    <li>The bar can move horizontally or vertically</li>
 *    <li>The movement can be enhanced by using the Animation utility</li>
 * </ul>
 *
 * Quick Example:<br/>
 * 
 * <pre><code>var progress = new A.ProgressBar({
 *	boundingBox: '#boudingBox',
 * 	orientation: 'horizontal',
 * 	width: 300
 * })
 * .render();
 * </code></pre>
 *
 * Check the list of <a href="ProgressBar.html#configattributes">Configuration Attributes</a> available for
 * ProgressBar.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class ProgressBar
 * @constructor
 * @extends Component
 */
var ProgressBar = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property ProgressBar.NAME
		 * @type String
		 * @static
		 */
		NAME: PROGRESS_BAR,

		/**
		 * Static property used to define the default attribute
		 * configuration for the ProgressBar.
		 *
		 * @property ProgressBar.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			/**
			 * Display height of the progressbar.
			 *
			 * @attribute height
			 * @default 25
			 * @type int | String
			 */
			height: {
				valueFn: function() {
					return this.get(BOUNDING_BOX).get(OFFSET_HEIGHT) || 25;
				}
			},

			/**
			 * Display label of the progressbar. If not specified try to query
             * using HTML_PARSER an element inside contentBox which matches
             * <code>aui-progressbar-text</code> and get its innerHTML to be
             * used as label.
			 *
			 * @attribute label
			 * @default ''
			 * @type String
			 */
			label: {
				value: BLANK
			},

			/**
			 * Represents the top value for the bar. The bar will be fully
             * extended when reaching this value. Values higher than this will
             * be ignored.
			 *
			 * @attribute max
			 * @default 100
			 * @type int
			 */
			max: {
				validator: isNumber,
				value: 100
			},

			/**
			 * Represents the lowest value for the bar. The bar will be
             * totally collapsed when reaching this value. Values lower than
             * this will be ignored.
			 *
			 * @attribute min
			 * @default 0
			 * @type int
			 */
			min: {
				validator: isNumber,
				value: 0
			},

			/**
			 * Display orientation of the progressbar (i.e. vertical or
             * horizontal).
			 *
			 * @attribute orientation
			 * @default 'horizontal'
			 * @type String
			 */
			orientation: {
				value: HORIZONTAL,
				validator: function(val) {
					return isString(val) && (val === HORIZONTAL || val === VERTICAL);
				}
			},

			/**
			 * Calculate the ratio based on <code>max</code> and
             * <code>min</code> values.
			 *
			 * @attribute ratio
			 * @readOnly
			 * @type number
			 */
			ratio: {
				getter: '_getRatio',
				readOnly: true
			},

			/**
			 * Calculate the progressbar step based on <code>ratio</code>
             * value.
			 *
			 * @attribute step
			 * @readOnly
			 * @type number
			 */
			step: {
				getter: '_getStep',
				readOnly: true
			},

			/**
			 * DOM Node to display the satus bar of the progressbar. If not
             * specified try to query using HTML_PARSER an element inside
             * contentBox which matches <code>aui-progressbar-status</code>.
			 *
			 * @attribute statusNode
			 * @default Generated div element.
			 * @type String
			 */
			statusNode: {
				valueFn: function() {
					return A.Node.create(TPL_STATUS);
				}
			},

			/**
			 * DOM Node to display the text of the progressbar. If not
             * specified try to query using HTML_PARSER an element inside
             * contentBox which matches <code>aui-progressbar-text</code>.
			 *
			 * @attribute textNode
			 * @default Generated div element.
			 * @type String
			 */
			textNode: {
				valueFn: function() {
					return A.Node.create(TPL_TEXT);
				}
			},

			/**
			 * The value for the bar. Valid values are in between the minValue
             * and maxValue attributes.
			 *
			 * @attribute value
			 * @default 0
			 * @type int | String
			 */
			value: {
				setter: toNumber,
				validator: function(val) {
					return isNumber(toNumber(val)) && ((val >= this.get(MIN)) && (val <= this.get(MAX)));
				},
				value: 0
			}
		},

		/**
		 * Object hash, defining how attribute values are to be parsed from
		 * markup contained in the widget's content box.
		 *
		 * @property ProgressBar.HTML_PARSER
		 * @type Object
		 * @static
		 */
		HTML_PARSER: {
			label: function(contentBox) {
				var textNode = contentBox.one(DOT+CSS_TEXT);

				if (textNode) {
					return textNode.html();
				}
			},

			statusNode: DOT+CSS_STATUS,

			textNode: DOT+CSS_TEXT
		},

		UI_ATTRS: [LABEL, ORIENTATION, VALUE],

		prototype: {
			/**
			 * Create the DOM structure for the ProgressBar. Lifecycle.
			 *
			 * @method renderUI
			 * @protected
			 */
			renderUI: function() {
				var instance = this;

				instance._renderStatusNode();
				instance._renderTextNode();
			},

			/**
			 * Calculate the contentBox size based on the
             * <code>orientation</code> of the progressbar. If the orientation
             * is HORIZONTAL get the width, if the orientation is VERTICAL get
             * the height.
			 *
			 * @method _getContentBoxSize
			 * @protected
			 * @return {number}
			 */
			_getContentBoxSize: function() {
				var instance = this;
				var contentBox = instance.get(CONTENT_BOX);

				return toNumber(
					contentBox.getStyle(
						this.get(ORIENTATION) === HORIZONTAL ? WIDTH : HEIGHT
					)
				);
			},

			/**
			 * Calculate the number of pixels to set the <code>statusNode</code>.
			 *
			 * @method _getPixelStep
			 * @protected
			 * @return {number}
			 */
			_getPixelStep: function() {
				var instance = this;

				return instance._getContentBoxSize() * instance.get(RATIO);
			},

			/**
			 * Calculate the ratio based on <code>max</code> and
             * <code>min</code> values.
			 *
			 * @method _getRatio
			 * @protected
			 * @return {number}
			 */
			_getRatio: function() {
				var instance = this;
				var min = instance.get(MIN);
				var ratio = (instance.get(VALUE) - min) / (instance.get(MAX) - min);

				return Math.max(ratio, 0);
			},

			/**
			 * Calculate the progressbar step based on <code>ratio</code>
             * value.
			 *
			 * @method _getStep
			 * @protected
			 * @return {number}
			 */
			_getStep: function() {
				return this.get(RATIO) * 100;
			},

			/**
			 * Render the <code>statusNode</code> of the progressbar.
			 *
			 * @method _renderStatusNode
			 * @protected
			 */
			_renderStatusNode: function() {
				var instance = this;

				instance.get(CONTENT_BOX).append(
					instance.get(STATUS_NODE)
				);
			},

			/**
			 * Render the <code>textNode</code> of the progressbar.
			 *
			 * @method _renderStatusNode
			 * @protected
			 */
			_renderTextNode: function() {
				var instance = this;

				instance.get(CONTENT_BOX).append(
					instance.get(TEXT_NODE)
				);
			},

			/**
			 * Invoked automatically by the UI_ATTRS Widget API when bind or sync the
             * <code>label</code> attribute.
			 *
			 * @method _uiSetLabel
			 * @param {String} val Display label
			 * @protected
			 */
			_uiSetLabel: function(val) {
				this.get(TEXT_NODE).html(val);
			},

			/**
			 * Invoked automatically by the UI_ATTRS Widget API when bind or sync the
             * <code>orientation</code> attribute.
			 *
			 * @method _uiSetOrientation
			 * @param {String} val Orientation
			 * @protected
			 */
			_uiSetOrientation: function(val) {
				var instance = this;
				var boundingBox = instance.get(BOUNDING_BOX);
				var horizontal = (val === HORIZONTAL);

				boundingBox.toggleClass(CSS_HORIZONTAL, horizontal);
				boundingBox.toggleClass(CSS_VERTICAL, !horizontal);

				instance._uiSizeTextNode();
			},

			/**
			 * Invoked automatically by the UI_ATTRS Widget API when bind or sync the
             * <code>value</code> attribute.
			 *
			 * @method _uiSetValue
			 * @param {String} val Progress value
			 * @protected
			 */
			_uiSetValue: function(val) {
				var instance = this;
				var statusNode = instance.get(STATUS_NODE);
				var pixelStep = instance._getPixelStep();

				var styles = {};

				if (instance.get(ORIENTATION) === HORIZONTAL) {
					styles = {
						height: '100%',
						top: AUTO,
						width: pixelStep+PX
					};
				}
				else {
					 styles = {
						height: pixelStep+PX,
						top: toNumber(instance._getContentBoxSize() - pixelStep)+PX,
						width: '100%'
					};
				}

				if (instance.get(STEP) >= 100) {
					instance.fire(COMPLETE);
				}

				statusNode.setStyles(styles);
			},

			/**
			 * Sync the size of the ProgressBar when some UI attribute change.
			 *
			 * @method _uiSizeTextNode
			 * @protected
			 */
			_uiSizeTextNode: function() {
				var instance = this;
				var contentBox = instance.get(CONTENT_BOX);
				var textNode = instance.get(TEXT_NODE);

				textNode.setStyle(
					LINE_HEIGHT,
					contentBox.getStyle(HEIGHT)
				);
			}
		}
	}
);

A.ProgressBar = ProgressBar;


}, 'gallery-2011.02.09-21-32' ,{requires:['gallery-aui-base'], skinnable:true});
