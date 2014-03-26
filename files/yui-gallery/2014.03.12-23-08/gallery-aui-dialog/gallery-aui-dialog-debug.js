YUI.add('gallery-aui-dialog', function(A) {

/**
 * The Dialog Utility - The Dialog component is an extension of Panel that is
 * meant to emulate the behavior of an dialog window using a floating,
 * draggable HTML element.
 *
 * @module aui-dialog
 */

var L = A.Lang,
	isBoolean = L.isBoolean,
	isArray = L.isArray,
	isObject = L.isObject,

	BLANK = '',
	BODY_CONTENT = 'bodyContent',
	BOUNDING_BOX = 'boundingBox',
	BUTTON = 'button',
	BUTTONS = 'buttons',
	CLOSE = 'close',
	CLOSETHICK = 'closethick',
	CONSTRAIN_TO_VIEWPORT = 'constrain2view',
	CONTAINER = 'container',
	DD = 'dd',
	DEFAULT = 'default',
	DESTROY_ON_CLOSE = 'destroyOnClose',
	DIALOG = 'dialog',
	DOT = '.',
	DRAGGABLE = 'draggable',
	DRAG_INSTANCE = 'dragInstance',
	FOOTER_CONTENT = 'footerContent',
	HD = 'hd',
	HEIGHT = 'height',
	ICON = 'icon',
	ICONS = 'icons',
	IO = 'io',
	LOADING = 'loading',
	MODAL = 'modal',
	PROXY = 'proxy',
	RESIZABLE = 'resizable',
	RESIZABLE_INSTANCE = 'resizableInstance',
	STACK = 'stack',
	WIDTH = 'width',

	EV_RESIZE = 'resize:resize',
	EV_RESIZE_END = 'resize:end',

	getCN = A.ClassNameManager.getClassName,

	CSS_DIALOG = getCN(DIALOG),
	CSS_DIALOG_BUTTON = getCN(DIALOG, BUTTON),
	CSS_DIALOG_BUTTON_CONTAINER = getCN(DIALOG, BUTTON, CONTAINER),
	CSS_DIALOG_BUTTON_DEFAULT = getCN(DIALOG, BUTTON, DEFAULT),
	CSS_DIALOG_HD = getCN(DIALOG, HD),
	CSS_ICON_LOADING = getCN(ICON, LOADING),
	CSS_PREFIX = getCN(DD),

	NODE_BLANK_TEXT = document.createTextNode(''),

	TPL_BUTTON = '<button class="' + CSS_DIALOG_BUTTON + '"></button>',
	TPL_BUTTON_CONTAINER = '<div class="' + CSS_DIALOG_BUTTON_CONTAINER + '"></div>';

/**
 * <p><img src="assets/images/aui-dialog/main.png"/></p>
 *
 * A base class for Dialog, providing:
 * <ul>
 *    <li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *    <li>Emulate the behavior of an dialog window using a floating, draggable HTML element</li>
 *    <li>Interface for easily gathering information from the user without leaving the underlying page context</li>
 *    <li>Using the <a href="IOPlugin.html">IOPlugin</a>, supports the submission of form data either through an XMLHttpRequest, through a normal form submission, or through a fully script-based response</li>
 * </ul>
 *
 * Quick Example:<br/>
 *
 * <pre><code>var instance = new A.Dialog({
 *  bodyContent: 'Dialog body',
 *  centered: true,
 *  constrain2view: true,
 *  destroyOnClose: true,
 *  draggable: true,
 *  height: 250,
 *  resizable: false,
 *  stack: true,
 *  title: 'Dialog title',
 *  width: 500
 *  }).render();
 * </code></pre>
 *
 * Check the list of <a href="Dialog.html#configattributes">Configuration Attributes</a> available for
 * Dialog.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class Dialog
 * @constructor
 * @extends Panel
 * @uses WidgetPosition
 * @uses WidgetStack
 * @uses WidgetPositionAlign
 * @uses WidgetPositionConstrain
 */
var Dialog = function(config) {
	if (!A.DialogMask) {
		A.DialogMask = new A.OverlayMask().render();
	}
};

A.mix(
	Dialog,
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property Dialog.NAME
		 * @type String
		 * @static
		 */
		NAME: DIALOG,

		/**
		 * Static property used to define the default attribute
		 * configuration for the Dialog.
		 *
		 * @property Dialog.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			/**
			 * See <a href="WidgetStdMod.html#config_bodyContent">WidgetStdMod bodyContent</a>.
			 *
			 * @attribute bodyContent
			 * @default HTMLTextNode
			 * @type Node | String
			 */
			bodyContent: {
				value: NODE_BLANK_TEXT
			},

			/**
			 * <p>Array of object literals, each containing a set of properties
             * defining a button to be appended into the Dialog's footer. Each
             * button object in the buttons array can have two properties:</p>
			 *
			 * <dl>
			 *    <dt>text:</dt>
			 *    <dd>
			 *        The text that will display on the face of the button. The text can include
			 *        HTML, as long as it is compliant with HTML Button specifications.
			 *    </dd>
			 *    <dt>handler:</dt>
			 *    <dd>
			 *        A reference to a function that should fire when the button is clicked.
	         *        (In this case scope of this function is always its Dialog instance.)
			 *    </dd>
			 * </dl>
			 *
			 * @attribute buttons
			 * @default []
			 * @type Array
			 */
			buttons: {
				value: [],
				validator: isArray
			},

			/**
			 * If <code>true</code> the close icon will be displayed on the
             * Dialog header.
			 *
			 * @attribute close
			 * @default true
			 * @type boolean
			 */
			close: {
				value: true
			},

			/**
	         * Will attempt to constrain the dialog to the boundaries of the
	         * viewport region.
	         *
	         * @attribute constrain2view
	         * @type Object
	         */
			constrain2view: {
				value: false,
				validator: isBoolean
			},

			/**
			 * Invoke the <a href="Dialog.html#method_destroy">destroy</a>
             * method when the dialog is closed (i.e., remove the Dialog
             * <code>boundingBox</code> from the body, purge events etc).
			 *
			 * @attribute destroyOnClose
			 * @default false
			 * @type boolean
			 */
			destroyOnClose: {
				value: false,
				validator: isBoolean
			},

			/**
			 * Boolean specifying if the Panel should be draggable.
			 *
			 * @attribute draggable
			 * @default true
			 * @type boolean
			 */
			draggable: {
				lazyAdd: true,
				value: true,
				setter: function(v) {
					return this._setDraggable(v);
				}
			},

			/**
			 * Stores the Drag instance for the <code>A.DD.Drag</code> used by
             * this Dialog.
			 *
			 * @attribute dragInstance
			 * @default null
			 * @type A.DD.Drag
			 */
			dragInstance: {
				value: null
			},

			/**
			 * True if the Panel should be displayed in a modal fashion,
             * automatically creating a transparent mask over the document that
             * will not be removed until the Dialog is dismissed. Uses
             * <a href="OverlayMask.html">OverlayMask</a>.
			 *
			 * @attribute modal
			 * @default false
			 * @type boolean
			 */
			modal: {
				setter: function(v) {
					return this._setModal(v);
				},
				lazyAdd: false,
				value: false,
				validator: isBoolean
			},

			/**
			 * Boolean specifying if the Panel should be resizable.
			 *
			 * @attribute resizable
			 * @default true
			 * @type boolean
			 */
			resizable: {
				setter: function(v) {
					return this._setResizable(v);
				},
				value: true
			},

			/**
			 * Stores the Drag instance for the
             * <a href="Resize.html">Resize</a> used by this Dialog.
			 *
			 * @attribute resizableInstance
			 * @default null
			 * @type Resize
			 */
			resizableInstance: {
				value: null
			},

			/**
			 * If <code>true</code> give stacking habilities to the Dialog.
			 *
			 * @attribute stack
			 * @default true
			 * @type boolean
			 */
			stack: {
				lazyAdd: true,
				value: true,
				setter: function(v) {
					return this._setStack(v);
				},
				validator: isBoolean
			}
		}
	}
);

Dialog.prototype = {
	/**
	 * Construction logic executed during Dialog instantiation. Lifecycle.
	 *
	 * @method initializer
	 * @protected
	 */
	initializer: function(config) {
		var instance = this;
		var icons = instance.get(ICONS);
		var close = instance.get(CLOSE);
		var buttons = instance.get(BUTTONS);

		if (buttons && buttons.length && !instance.get(FOOTER_CONTENT)) {
			instance.set(FOOTER_CONTENT, NODE_BLANK_TEXT);
		}

		if (close) {
			var closeConfig = {
				icon: CLOSETHICK,
				id: CLOSETHICK,
				handler: {
					fn: instance.close,
					context: instance
				}
			};

			if (icons) {
				icons.push(closeConfig);
			}

			instance.set(ICONS, icons);
		}

		instance.after('render', instance._afterRenderer);
	},

	/**
	 * Bind the events on the Dialog UI. Lifecycle.
	 *
	 * @method bindUI
	 * @protected
	 */
	bindUI: function() {
		var instance = this;

		instance._bindLazyComponents();

		instance.publish('close', { defaultFn: instance._close });

		instance.on('visibleChange', instance._afterSetVisible);
	},

	/**
	 * Descructor lifecycle implementation for the Dialog class.
	 * Purges events attached to the node (and all child nodes).
	 *
	 * @method destructor
	 * @protected
	 */
	destructor: function() {
		var instance = this;
		var boundingBox = instance.get(BOUNDING_BOX);

		A.Event.purgeElement(boundingBox, true);
		A.DialogManager.remove(instance);
	},

	/**
	 * Bind a <code>mouseenter</code> listener to the <code>boundingBox</code>
     * to invoke the
     * <a href="Dialog.html#config__initLazyComponents">_initLazyComponents</a>.
     * Performance reasons.
	 *
	 * @method _bindLazyComponents
	 * @private
	 */
	_bindLazyComponents: function() {
		var instance = this;
		var boundingBox = instance.get(BOUNDING_BOX);

		boundingBox.on('mouseenter', A.bind(instance._initLazyComponents, instance));
	},

	/**
	 * Fires the close event to close the Dialog.
	 *
	 * @method close
	 */
	close: function() {
		var instance = this;

		instance.fire('close');
	},

	/**
	 * Fires after the value of the
	 * <a href="Dialog.html#config_constrain2view">constrain2view</a> attribute change.
	 *
	 * @method 
	 * @param {EventFacade} event
	 * @protected
	 */
	_afterConstrain2viewChange: function(event) {
		var instance = this;

		instance._setConstrain2view(event.newVal);
	},

	/**
	 * Fires after the render phase. Invoke
     * <a href="Dialog.html#method__initButtons">_initButtons</a>.
	 *
	 * @method _afterRenderer
	 * @param {EventFacade} event
	 * @protected
	 */
	_afterRenderer: function(event) {
		var instance = this;

		instance._initButtons();

		// forcing lazyAdd:true attrs call the setter
		instance.get(STACK);
		instance.get(IO);
	},

	/**
	 * Handles the close event logic.
	 *
	 * @method _handleEvent
	 * @param {EventFacade} event close event facade
	 * @protected
	 */
	_close: function() {
		var instance = this;

		if (instance.get(DESTROY_ON_CLOSE)) {
			instance.destroy();
		}
		else {
			instance.hide();
		}

		if (instance.get(MODAL)) {
			A.DialogMask.hide();
		}
	},

	/**
	 * Render the buttons on the footer of the Dialog.
	 *
	 * @method _initButtons
	 * @protected
	 */
	_initButtons: function() {
		var instance = this;

		var buttons = instance.get(BUTTONS);
		var container = A.Node.create(TPL_BUTTON_CONTAINER);
		var nodeModel = A.Node.create(TPL_BUTTON);

		A.each(
			buttons,
			function(button, i) {
				var node = nodeModel.clone();

				if (button.isDefault) {
					node.addClass(CSS_DIALOG_BUTTON_DEFAULT);
				}

				if (button.handler) {
					node.on('click', button.handler, instance);
				}

				node.html(button.text || BLANK);

				container.append(node);
			}
		);

		if (buttons.length) {
			instance.set(FOOTER_CONTENT, container);
		}
	},

	/**
	 * Forces <code>lazyAdd:true</code> attributtes invoke the setter methods.
	 *
	 * @method _initLazyComponents
	 * @private
	 */
	_initLazyComponents: function() {
		var instance = this;

		// forcing lazyAdd:true attrs call the setter
		if (!instance.get(DRAG_INSTANCE) && instance.get(DRAGGABLE)) {
			instance.get(DRAGGABLE);
		}

		if (!instance.get(RESIZABLE_INSTANCE) && instance.get(RESIZABLE)) {
			instance.get(RESIZABLE);
		}
	},

	/**
	 * Setter for the <a href="Dialog.html#config_constrain2view">constrain2view</a>
     * attributte. Plugs or unplugs the DDConstrained plugin on the drag instance.
	 *
	 * @method _setConstrain2view
	 * @param {Object} value Object to be passed to the A.DD.Drag constructor.
	 * @protected
	 * @return {Object}
	 */
	_setConstrain2view: function(value) {
		var instance = this;

		var dragInstance = instance.get(DRAG_INSTANCE);

		if (dragInstance) {
			if (value) {
				dragInstance.plug(
					A.Plugin.DDConstrained,
					{
						constrain2view: instance.get(CONSTRAIN_TO_VIEWPORT)
					}
				);
			}
			else {
				dragInstance.unplug(A.Plugin.DDConstrained);
			}
		}
	},

	/**
	 * Setter for the <a href="Dialog.html#config_draggable">draggable</a>
     * attributte. Initialize the A.DD.Drag on the Dialog.
	 *
	 * @method _setDraggable
	 * @param {Object} value Object to be passed to the A.DD.Drag constructor.
	 * @protected
	 * @return {Object}
	 */
	_setDraggable: function(value) {
		var instance = this;
		var boundingBox = instance.get(BOUNDING_BOX);

		var destroy = function() {
			var dragInstance = instance.get(DRAG_INSTANCE);

			if (dragInstance) {
				// TODO - YUI3 has a bug when destroy and recreates
				dragInstance.destroy();
				dragInstance.unplug(A.Plugin.DDConstrained);
			}
		};

		A.DD.DDM.CSS_PREFIX = CSS_PREFIX;

		if (value) {
			var defaults = {
				node: boundingBox,
				handles: [ DOT + CSS_DIALOG_HD ]
			};

			var dragOptions = A.merge(defaults, value || {});

			// change the drag scope callback to execute using the dialog scope
			if (dragOptions.on) {
				A.each(
					dragOptions.on,
					function(fn, eventName) {
						dragOptions.on[eventName] = A.bind(fn, instance);
					}
				);
			}

			destroy();

			var dragInstance = new A.DD.Drag(dragOptions);

			instance.set(DRAG_INSTANCE, dragInstance);

			instance.after('constrain2viewChange', instance._afterConstrain2viewChange, instance);

			instance._setConstrain2view(instance.get('constrain2view'));
		}
		else {
			destroy();
		}

		return value;
	},

	/**
	 * Setter for the <a href="Dialog.html#config_modal">modal</a> attribute.
	 *
	 * @method _setModal
	 * @param {boolean} value
	 * @protected
	 * @return {boolean}
	 */
	_setModal: function(value) {
		var instance = this;

		if (value) {
			A.DialogMask.show();
		}
		else {
			A.DialogMask.hide();
		}

		return value;
	},

	/**
	 * Setter for the <a href="Dialog.html#config_resizable">resizable</a>
     * attribute.
	 *
	 * @method _setResizable
	 * @param {boolean} value
	 * @protected
	 * @return {boolean}
	 */
	_setResizable: function(value) {
		var instance = this;
		var resizableInstance = instance.get(RESIZABLE_INSTANCE);

		var destroy = function() {
			if (resizableInstance) {
				resizableInstance.destroy();
			}
		};

		if (value) {
			var setDimensions = function(event) {
				var type = event.type;
				var info = event.info;

				if ((type == EV_RESIZE_END) ||
					((type == EV_RESIZE) && !event.currentTarget.get(PROXY))) {
						instance.set(HEIGHT, info.offsetHeight);
						instance.set(WIDTH, info.offsetWidth);
				}
			};

			destroy();

			var resize = new A.Resize(
				A.merge(
					{
						handles: 'r,br,b',
						minHeight: 100,
						minWidth: 200,
						constrain2view: true,
						node: instance.get(BOUNDING_BOX),
						proxy: true
					},
					value || {}
				)
			);

			resize.after('end', setDimensions);
			resize.after('resize', setDimensions);

			instance.set(RESIZABLE_INSTANCE, resize);

			return value;
		}
		else {
			destroy();
		}
	},

	/**
	 * Setter for the <a href="Dialog.html#config_stack">stack</a>
     * attribute.
	 *
	 * @method _setStack
	 * @param {boolean} value
	 * @protected
	 * @return {boolean}
	 */
	_setStack: function(value) {
		var instance = this;

		if (value) {
			A.DialogManager.register(instance);
		}
		else {
			A.DialogManager.remove(instance);
		}

		return value;
	},

	/**
	 * Fires after the value of the
     * <a href="Overlay.html#config_visible">visible</a> attribute change.
	 *
	 * @method _afterSetVisible
	 * @param {EventFacade} event
	 * @protected
	 */
	_afterSetVisible: function(event) {
		var instance = this;

		if (instance.get(MODAL)) {
			if (event.newVal) {
				A.DialogMask.show();
			}
			else {
				A.DialogMask.hide();
			}
		}
	}
};

A.Dialog = A.Base.build(DIALOG, A.Panel, [Dialog, A.WidgetPosition, A.WidgetStack, A.WidgetPositionAlign, A.WidgetPositionConstrain]);

/**
 * A base class for DialogManager:
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class DialogManager
 * @constructor
 * @extends OverlayManager
 * @static
 */
A.DialogManager = new A.OverlayManager(
	{
		zIndexBase: 1000
	}
);

A.mix(
	A.DialogManager,
	{
		/**
		 * Find the <a href="Widget.html">Widget</a> instance based on a child
         * element.
		 *
		 * @method findByChild
		 * @for DialogManager
		 * @param {Node | String} child Child node of the Dialog.
		 * @return {Widget}
		 */
		findByChild: function(child) {
			return A.Widget.getByNode(
				A.one(child).ancestor(DOT + CSS_DIALOG, true)
			);
		},

		/**
		 * <p>Invoke the <a href="Dialog.html#method_close">close</a> method from
         * the Dialog which contains the <code>child</code> element.</p>
		 *
		 * Example:
		 *
		 * <pre><code>A.DialogManager.closeByChild('#dialogContent1');</code></pre>
		 *
		 * @method closeByChild
		 * @for DialogManager
		 * @param {Node | String} child Child node of the Dialog.
		 * @return {Dialog}
		 */
		closeByChild: function(child) {
			return A.DialogManager.findByChild(child).close();
		},

		/**
		 * <p>Invoke the <a href="IOPlugin.html#method_start">start</a> method
         * from the <a href="IOPlugin.html">IOPlugin</a> plugged on this Dialog
         * instance. If there is no IOPlugin plugged it does nothing.</p>
         *
		 * Example:
		 *
		 * <pre><code>A.DialogManager.refreshByChild('#dialogContent1');</code></pre>
		 *
		 * @method refreshByChild
		 * @for DialogManager
		 * @param {Node | String} child Child node of the Dialog.
		 */
		refreshByChild: function(child) {
			var dialog = A.DialogManager.findByChild(child);

			if (dialog && dialog.io) {
				dialog.io.start();
			}
		}
	}
);

/**
 * A base class for DialogMask - Controls the <a
 * href="Dialog.html#config_modal">modal</a> attribute.
 *
 * @class DialogMask
 * @constructor
 * @extends OverlayMask
 * @static
 */


}, 'gallery-2011.02.09-21-32' ,{requires:['gallery-aui-panel','dd-constrain','gallery-aui-button-item','gallery-aui-overlay-manager','gallery-aui-overlay-mask','gallery-aui-io-plugin','gallery-aui-resize'], skinnable:true});
