YUI.add('gallery-aui-io-plugin', function(A) {

/**
 * The IOPlugin Utility - When plugged to a Node or Widget loads the content
 * of a URI and set as its content, parsing the <code>script</code> tags if
 * present on the code.
 *
 * @module aui-io
 * @submodule aui-io-plugin
 */

var L = A.Lang,
	isBoolean = L.isBoolean,
	isString = L.isString,

	isNode = function(v) {
		return (v instanceof A.Node);
	},

	StdMod = A.WidgetStdMod,

	TYPE_NODE = 'Node',
	TYPE_WIDGET = 'Widget',

	EMPTY = '',
	FAILURE = 'failure',
	FAILURE_MESSAGE = 'failureMessage',
	HOST = 'host',
	ICON = 'icon',
	IO = 'io',
	IO_PLUGIN = 'IOPlugin',
	LOADING = 'loading',
	LOADING_MASK = 'loadingMask',
	NODE = 'node',
	OUTER = 'outer',
	PARSE_CONTENT = 'parseContent',
	QUEUE = 'queue',
	RENDERED = 'rendered',
	SECTION = 'section',
	SHOW_LOADING = 'showLoading',
	SUCCESS = 'success',
	TYPE = 'type',
	WHERE = 'where',

	getCN = A.ClassNameManager.getClassName,

	CSS_ICON_LOADING = getCN(ICON, LOADING);

/**
 * A base class for IOPlugin, providing:
 * <ul>
 *    <li>Loads the content of a URI as content of a Node or Widget</li>
 *    <li>Use <a href="ParseContent.html">ParseContent</a> to parse the JavaScript tags from the content and evaluate them</li>
 * </ul>
 *
 * Quick Example:<br/>
 *
 * <pre><code>A.one('#content').plug(A.Plugin.IO, { uri: 'assets/content.html', method: 'GET' });</code></pre>
 *
 * Check the list of <a href="A.Plugin.IO.html#configattributes">Configuration Attributes</a> available for
 * IOPlugin.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class A.Plugin.IO
 * @constructor
 * @extends IORequest
 */
var IOPlugin = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property A.Plugin.IO.NAME
		 * @type String
		 * @static
		 */
		NAME: IO_PLUGIN,

		/**
		 * Static property provides a string to identify the namespace.
		 *
		 * @property A.Plugin.IO.NS
		 * @type String
		 * @static
		 */
		NS: IO,

		/**
		 * Static property used to define the default attribute
		 * configuration for the A.Plugin.IO.
		 *
		 * @property A.Plugin.IO.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			/**
			 * Plug IO in any object we want, the setContent will use the node to
	         * set the content.
			 *
			 * @attribute node
			 * @default null
			 * @type Node | String
			 */
			node: {
				value: null,
				getter: function(value) {
					var instance = this;

					if (!value) {
						var host = instance.get(HOST);
						var type = instance.get(TYPE);

						if (type == TYPE_NODE) {
							value = host;
						}
						else if (type == TYPE_WIDGET) {
							var section = instance.get(SECTION);

							// if there is no node for the SECTION, forces creation
							if (!host.getStdModNode(section)) {
								host.setStdModContent(section, EMPTY);
							}

							value = host.getStdModNode(section);
						}
					}

					return A.one(value);
				},
				validator: isNode
			},

			/**
			 * Message to be set on the content when the transaction fails.
			 *
			 * @attribute failureMessage
			 * @default 'Failed to retrieve content'
			 * @type String
			 */
			failureMessage: {
				value: 'Failed to retrieve content',
				validator: isString
			},

			/**
			 * Options passed to the <a href="LoadingMask.html">LoadingMask</a>.
			 *
			 * @attribute loadingMask
			 * @default {}
			 * @type Object
			 */
			loadingMask: {
				value: {}
			},

			/**
			 * If true the <a href="ParseContent.html">ParseContent</a> plugin
	         * will be plugged to the <a href="A.Plugin.IO.html#config_node">node</a>.
			 *
			 * @attribute parseContent
			 * @default true
			 * @type boolean
			 */
			parseContent: {
				value: true,
				validator: isBoolean
			},

			/**
			 * Show the <a href="LoadingMask.html">LoadingMask</a> covering the <a
	         * href="A.Plugin.IO.html#config_node">node</a> while loading.
			 *
			 * @attribute showLoading
			 * @default true
			 * @type boolean
			 */
			showLoading: {
				value: true,
				validator: isBoolean
			},

			/**
			 * Section where the content will be set in case you are plugging it
	         * on a instace of <a href="WidgetStdMod.html">WidgetStdMod</a>.
			 *
			 * @attribute section
			 * @default StdMod.BODY
			 * @type String
			 */
			section: {
				value: StdMod.BODY,
				validator: function(val) {
					return (!val || val == StdMod.BODY || val == StdMod.HEADER || val == StdMod.FOOTER);
				}
			},

			/**
			 * Type of the <code>instance</code> we are pluggin the A.Plugin.IO.
	         * Could be a Node, or a Widget.
			 *
			 * @attribute type
			 * @default 'Node'
			 * @readOnly
			 * @type String
			 */
			type: {
				readOnly: true,
				valueFn: function() {
					var instance = this;
					// NOTE: default type
					var type = TYPE_NODE;

					if (instance.get(HOST) instanceof A.Widget) {
						type = TYPE_WIDGET;
					}

					return type;
				},
				validator: isString
			},

			/**
			 * Where to insert the content, AFTER, BEFORE or REPLACE. If you're plugging a Node, there is a fourth option called OUTER that will not only replace the entire node itself. This is different from REPLACE, in that REPLACE will replace the *contents* of the node, OUTER will replace the entire Node itself.
			 *
			 * @attribute where
			 * @default StdMod.REPLACE
			 * @type String
			 */
			where: {
				value: StdMod.REPLACE,
				validator: function(val) {
					return (!val || val == StdMod.AFTER || val == StdMod.BEFORE || val == StdMod.REPLACE || val == OUTER);
				}
			}
		},

		EXTENDS: A.IORequest,

		prototype: {
			/**
			 * Bind the events on the A.Plugin.IO UI. Lifecycle.
			 *
			 * @method bindUI
			 * @protected
			 */
			bindUI: function() {
				var instance = this;

				instance.on('activeChange', instance._onActiveChange);

				instance.on(SUCCESS, instance._successHandler);
				instance.on(FAILURE, instance._failureHandler);

				if ((instance.get(TYPE) == TYPE_WIDGET) && instance.get(SHOW_LOADING)) {
					var host = instance.get(HOST);

					host.after('heightChange', instance._syncLoadingMaskUI, instance);
					host.after('widthChange', instance._syncLoadingMaskUI, instance);
				}
			},

			/**
			 * Invoke the <code>start</code> method (autoLoad attribute).
			 *
			 * @method _autoStart
			 * @protected
			 */
			_autoStart: function() {
				var instance = this;

				instance.bindUI();

				IOPlugin.superclass._autoStart.apply(this, arguments);
			},

			/**
			 * Bind the ParseContent plugin on the <code>instance</code>.
			 *
			 * @method _bindParseContent
			 * @protected
			 */
			_bindParseContent: function() {
				var instance = this;
				var node = instance.get(NODE);

				if (node && !node.ParseContent && instance.get(PARSE_CONTENT)) {
					node.plug(A.Plugin.ParseContent);
				}
			},

			/**
			 * Invoke the <a href="OverlayMask.html#method_hide">OverlayMask hide</a> method.
			 *
			 * @method hideLoading
			 */
			hideLoading: function() {
				var instance = this;

				var node = instance.get(NODE);

				if (node.loadingmask) {
					node.loadingmask.hide();
				}
			},

			/**
			 * Set the content of the <a href="A.Plugin.IO.html#config_node">node</a>.
			 *
			 * @method setContent
			 */
			setContent: function(content) {
				var instance = this;

				instance._bindParseContent();

				instance._getContentSetterByType().apply(instance, [content]);

				if (instance.overlayMaskBoundingBox) {
					instance.overlayMaskBoundingBox.remove();
				}
			},

			/**
			 * Invoke the <a href="OverlayMask.html#method_show">OverlayMask show</a> method.
			 *
			 * @method showLoading
			 */
			showLoading: function() {
				var instance = this;
				var node = instance.get(NODE);

				if (node.loadingmask) {
					if (instance.overlayMaskBoundingBox) {
						node.append(instance.overlayMaskBoundingBox);
					}
				}
				else {
					node.plug(
						A.LoadingMask,
						instance.get(LOADING_MASK)
					);

					instance.overlayMaskBoundingBox = node.loadingmask.overlayMask.get('boundingBox');
				}

				node.loadingmask.show();
			},

			/**
			 * Overload to the <a href="IORequest.html#method_start">IORequest
		     * start</a> method. Check if the <code>host</code> is already rendered,
		     * otherwise wait to after render phase and to show the LoadingMask.
			 *
			 * @method start
			 */
			start: function() {
				var instance = this;
				var host = instance.get(HOST);

				if (!host.get(RENDERED)) {
					host.after('render', function() {
						instance._setLoadingUI(true);
					});
				}

				IOPlugin.superclass.start.apply(instance, arguments);
			},

			/**
			 * Get the appropriated <a
		     * href="A.Plugin.IO.html#method_setContent">setContent</a> function
		     * implementation for each <a href="A.Plugin.IO.html#config_type">type</a>.
			 *
			 * @method _getContentSetterByType
			 * @protected
			 * @return {function}
			 */
			_getContentSetterByType: function() {
				var instance = this;

				var setters = {
					// NOTE: default setter, see 'type' attribute definition
					Node: function(content) {
						var instance = this;
						// when this.get(HOST) is a Node instance the NODE is the host
						var node = instance.get(NODE);

						if (content instanceof A.NodeList) {
							content = content.toFrag();
						}

						if (content instanceof A.Node) {
							content = content._node;
						}

						var where = instance.get(WHERE);

						if (where == OUTER) {
							node.replace(content);
						}
						else {
							A.DOM.addHTML(node._node, content, where);
						}
					},

					// Widget forces set the content on the SECTION node using setStdModContent method
					Widget: function(content) {
						var instance = this;
						var host = instance.get(HOST);

						host.setStdModContent.apply(host, [
							instance.get(SECTION),
							content,
							instance.get(WHERE)
						]);
					}
				};

				return setters[this.get(TYPE)];
			},

			/**
			 * Whether the <code>show</code> is true show the LoadingMask.
			 *
			 * @method _setLoadingUI
			 * @param {boolean} show
			 * @protected
			 */
			_setLoadingUI: function(show) {
				var instance = this;

				if (instance.get(SHOW_LOADING)) {
					if (show) {
						instance.showLoading();
					}
					else {
						instance.hideLoading();
					}
				}
			},

			/**
			 * Sync the loading mask UI.
			 *
			 * @method _syncLoadingMaskUI
			 * @protected
			 */
			_syncLoadingMaskUI: function() {
				var instance = this;

				instance.get(NODE).loadingmask.refreshMask();
			},

			/**
			 * Internal success callback for the IO transaction.
			 *
			 * @method _successHandler
			 * @param {EventFavade} event
			 * @param {String} id Id of the IO transaction.
			 * @param {Object} obj XHR transaction Object.
			 * @protected
			 */
			_successHandler: function(event, id, xhr) {
				var instance = this;

				instance.setContent(
					this.get('responseData')
				);
			},

			/**
			 * Internal failure callback for the IO transaction.
			 *
			 * @method _failureHandler
			 * @param {EventFavade} event
			 * @param {String} id Id of the IO transaction.
			 * @param {Object} obj XHR transaction Object.
			 * @protected
			 */
			_failureHandler: function(event, id, xhr) {
				var instance = this;

				instance.setContent(
					instance.get(FAILURE_MESSAGE)
				);
			},

			/**
			 * Fires after the value of the
			 * <a href="A.Plugin.IO.html#config_active">active</a> attribute change.
			 *
			 * @method _onActiveChange
			 * @param {EventFacade} event
			 * @protected
			 */
			_onActiveChange: function(event) {
				var instance = this;
				var host = instance.get(HOST);
				var widget = instance.get(TYPE) == TYPE_WIDGET;

				if (!widget || (widget && host && host.get(RENDERED))) {
					instance._setLoadingUI(event.newVal);
				}
			}
		}
	}
);

A.Node.prototype.load = function(uri, config, callback) {
	var instance = this;

	var index = uri.indexOf(' ');
	var selector;

	if (index > 0) {
		selector = uri.slice(index, uri.length);

		uri = uri.slice(0, index);
	}

	if (L.isFunction(config)) {
		callback = config;
		config = null;
	}

	config = config || {};

	if (callback) {
		config.after = config.after || {};

		config.after.success = callback;
	}

	var where = config.where;

	config.uri = uri;
	config.where = where;

	if (selector) {
		config.selector = selector;
		config.where = where || 'replace';
	}

	instance.plug(A.Plugin.IO, config);

	return instance;
};

A.namespace('Plugin').IO = IOPlugin;


}, 'gallery-2011.02.09-21-32' ,{requires:['gallery-aui-overlay-base','gallery-aui-parse-content','gallery-aui-io-request','gallery-aui-loading-mask']});
