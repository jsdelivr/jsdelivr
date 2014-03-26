YUI.add('gallery-aui-loading-mask', function(A) {

/**
 * The LoadingMask Utility
 *
 * @module aui-loading-mask
 */

var Lang = A.Lang,

	BOUNDING_BOX = 'boundingBox',
	CONTENT_BOX = 'contentBox',
	HIDE = 'hide',
	HOST = 'host',
	MESSAGE_EL = 'messageEl',
	NAME = 'loadingmask',
	POSITION = 'position',
	SHOW = 'show',
	STATIC = 'static',
	STRINGS = 'strings',
	TARGET = 'target',
	TOGGLE = 'toggle',

	getClassName = A.ClassNameManager.getClassName,

	CSS_LOADINGMASK = getClassName(NAME),
	CSS_MASKED = getClassName(NAME, 'masked'),
	CSS_MASKED_RELATIVE = getClassName(NAME, 'masked', 'relative'),
	CSS_MESSAGE_LOADING = getClassName(NAME, 'message'),
	CSS_MESSAGE_LOADING_CONTENT = getClassName(NAME, 'message', 'content'),

	TPL_MESSAGE_LOADING = '<div class="' + CSS_MESSAGE_LOADING + '"><div class="' + CSS_MESSAGE_LOADING_CONTENT + '">{0}</div></div>';

/**
 * <p><img src="assets/images/aui-loading-mask/main.png"/></p>
 *
 * A base class for LoadingMask, providing:
 * <ul>
 *    <li>Cross browser mask functionality to cover an element or the entire page</li>
 *    <li>Customizable mask (i.e., background, opacity)</li>
 *    <li>Display a centered "loading" message on the masked node</li>
 * </ul>
 *
 * Quick Example:<br/>
 *
 * <pre><code>node.plug(A.LoadingMask, { background: '#000' });</code></pre>
 *
 * Check the list of <a href="LoadingMask.html#configattributes">Configuration Attributes</a> available for
 * LoadingMask.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class LoadingMask
 * @constructor
 * @extends Plugin.Base
 */
var LoadingMask = A.Component.create(
	{

		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property LoadingMask.NAME
		 * @type String
		 * @static
		 */
		NAME: NAME,

		/**
		 * Static property provides a string to identify the namespace.
		 *
		 * @property LoadingMask.NS
		 * @type String
		 * @static
		 */
		NS: NAME,

		/**
		 * Static property used to define the default attribute
		 * configuration for the LoadingMask.
		 *
		 * @property LoadingMask.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			/**
			 * Node element to display the message.
			 *
			 * @attribute messageEl
			 * @default Generated HTML div element.
			 * @type String
			 */
			messageEl: {
				valueFn: function(val) {
					var instance = this;
					var strings = instance.get(STRINGS);

					return A.Node.create(
						A.substitute(TPL_MESSAGE_LOADING, [strings.loading])
					);
				}
			},

			/**
			 * Strings used on the LoadingMask. See
		     * <a href="Widget.html#method_strings">strings</a>.
			 *
			 * @attribute strings
			 * @default { loading: 'Loading&hellip;' }
			 * @type Object
			 */
			strings: {
				value: {
					loading: 'Loading&hellip;'
				}
			},

			/**
			 * Node where the mask will be positioned and re-dimensioned.
			 *
			 * @attribute target
			 * @default null
			 * @type Node | Widget
			 */
			target: {
				setter: function() {
					var instance = this;
					var target = instance.get(HOST);

					if (target instanceof A.Widget) {
						target = target.get(CONTENT_BOX);
					}

					return target;
				},
				value: null
			}
		},

		EXTENDS: A.Plugin.Base,

		prototype: {
			/**
			 * Construction logic executed during LoadingMask instantiation. Lifecycle.
			 *
			 * @method initializer
			 * @protected
			 */
			initializer: function(config) {
				var instance = this;

				instance.IGNORED_ATTRS = A.merge(
					{
						host: true
					},
					LoadingMask.ATTRS
				);

				instance.renderUI();
				instance.bindUI();

				instance._createDynamicAttrs(config);
			},

			/**
			 * Create the DOM structure for the LoadingMask. Lifecycle.
			 *
			 * @method renderUI
			 * @protected
			 */
			renderUI: function() {
				var instance = this;
				var strings = instance.get(STRINGS);

				instance._renderOverlayMask();

				instance.overlayMask.get(BOUNDING_BOX).append(
					instance.get(MESSAGE_EL)
				);
			},

			/**
			 * Bind the events on the LoadingMask UI. Lifecycle.
			 *
			 * @method bindUI
			 * @protected
			 */
			bindUI: function() {
				var instance = this;

				instance._bindOverlayMaskUI();
			},

			/**
			 * Bind events to the
	         * <a href="LoadingMask.html#property_overlayMask">overlayMask</a>.
			 *
			 * @method _bindOverlayMaskUI
			 * @protected
			 */
			_bindOverlayMaskUI: function() {
				var instance = this;

				instance.overlayMask.after('visibleChange', instance._afterVisibleChange, instance);
			},

			/**
			 * Center the
	         * <a href="LoadingMask.html#config_messageEl">messageEl</a> with the
	         * <a href="LoadingMask.html#config_target">target</a> node.
			 *
			 * @method centerMessage
			 */
			centerMessage: function() {
				var instance = this;

				instance.get(MESSAGE_EL).center(
					instance.overlayMask.get(BOUNDING_BOX)
				);
			},

			/**
			 * Invoke the
	         * <a href="LoadingMask.html#property_overlayMask">overlayMask</a>
	         * <code>refreshMask</code> method.
			 *
			 * @method refreshMask
			 */
			refreshMask: function() {
				var instance = this;

				instance.overlayMask.refreshMask();

				instance.centerMessage();
			},

			/**
			 * Fires after the value of the
			 * <a href="LoadingMask.html#config_visible">visible</a> attribute change.
			 *
			 * @method _afterVisibleChange
			 * @param {EventFacade} event
			 * @protected
			 */
			_afterVisibleChange: function(event) {
				var instance = this;
				var target = instance.get(TARGET);
				var isStaticPositioned = (target.getStyle(POSITION) == STATIC);

				target.toggleClass(CSS_MASKED, (event.newVal));
				target.toggleClass(CSS_MASKED_RELATIVE, (event.newVal && isStaticPositioned));

				if (event.newVal) {
					instance.refreshMask();
				}
			},

			/**
			 * Render
	         * <a href="LoadingMask.html#property_overlayMask">overlayMask</a>
	         * instance.
			 *
			 * @method _renderOverlayMask
			 * @protected
			 */
			_renderOverlayMask: function() {
				var instance = this;
				var target = instance.get(TARGET);

				/**
				 * Stores the <a href="OverlayMask.html">OverlayMask</a> used
	             * internally.
				 *
				 * @property overlayMask
				 * @type OverlayMask
				 * @protected
				 */
				instance.overlayMask = new A.OverlayMask(
					{
						target: target,
						cssClass: CSS_LOADINGMASK
					}
				).render(target);
			},

			/**
			 * Create dynamic attributes listeners to invoke the setter on
	         * <a href="LoadingMask.html#property_overlayMask">overlayMask</a> after
	         * the attribute is set on the LoadingMask instance.
			 *
			 * @method _createDynamicAttrs
			 * @param {Object} config Object literal specifying widget configuration properties.
			 * @protected
			 */
			_createDynamicAttrs: function(config) {
				var instance = this;

				A.each(config, function(value, key) {
					var ignoredAttr = instance.IGNORED_ATTRS[key];

					if (!ignoredAttr) {
						instance.addAttr(key, {
							setter: function(val) {
								this.overlayMask.set(key, val);

								return val;
							},
							value: value
						});
					}
				});
			}
		}
	}
);

A.each([HIDE, SHOW, TOGGLE], function(method) {
	/**
	 * Invoke the
     * <a href="LoadingMask.html#property_overlayMask">overlayMask</a>
     * <code>hide</code> method.
	 *
	 * @method hide
	 */

	/**
	 * Invoke the
     * <a href="LoadingMask.html#property_overlayMask">overlayMask</a>
     * <code>show</code> method.
	 *
	 * @method show
	 */

	/**
	 * Invoke the
     * <a href="LoadingMask.html#property_overlayMask">overlayMask</a>
     * <code>toggle</code> method.
	 *
	 * @method toggle
	 */
	LoadingMask.prototype[method] = function() {
		this.overlayMask[method]();
	};
});

A.LoadingMask = LoadingMask;


}, 'gallery-2010.08.18-17-12' ,{skinnable:true, requires:['gallery-aui-overlay-mask','plugin','substitute']});
