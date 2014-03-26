YUI.add('gallery-aui-overlay-context', function(A) {

/**
 * The OverlayContext Utility
 *
 * @module aui-overlay
 * @submodule aui-overlay-context
 */

var L = A.Lang,
	isString = L.isString,
	isNumber = L.isNumber,
	isObject = L.isObject,
	isBoolean = L.isBoolean,

	isNodeList = function(v) {
		return (v instanceof A.NodeList);
	},

	ALIGN = 'align',
	BL = 'bl',
	BOUNDING_BOX = 'boundingBox',
	CANCELLABLE_HIDE = 'cancellableHide',
	OVERLAY_CONTEXT = 'overlaycontext',
	CURRENT_NODE = 'currentNode',
	FOCUSED = 'focused',
	HIDE = 'hide',
	HIDE_DELAY = 'hideDelay',
	HIDE_ON = 'hideOn',
	HIDE_ON_DOCUMENT_CLICK = 'hideOnDocumentClick',
	MOUSEDOWN = 'mousedown',
	SHOW = 'show',
	SHOW_DELAY = 'showDelay',
	SHOW_ON = 'showOn',
	TL = 'tl',
	TRIGGER = 'trigger',
	VISIBLE = 'visible';

/**
 * <p><img src="assets/images/aui-overlay-context/main.png"/></p>
 *
 * A base class for OverlayContext, providing:
 * <ul>
 *    <li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *    <li>Able to display an <a href="Overlay.html">Overlay</a> at a specified corner of an element <a href="OverlayContext.html#config_trigger">trigger</a></li>
 * </ul>
 *
 * Quick Example:<br/>
 *
 * <pre><code>var instance = new A.OverlayContext({
 *  boundingBox: '#OverlayBoundingBox',
 *  hideOn: 'mouseleave',
 *  showOn: 'mouseenter',
 *	trigger: '.menu-trigger'
 * }).render();
 * </code></pre>
 *
 * Check the list of <a href="OverlayContext.html#configattributes">Configuration Attributes</a> available for
 * OverlayContext.
 *
 * @class OverlayContext
 * @constructor
 * @extends OverlayBase
 * @param config {Object} Object literal specifying widget configuration properties.
 */
var OverlayContext = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property OverlayContext.NAME
		 * @type String
		 * @static
		 */
		NAME: OVERLAY_CONTEXT,

		/**
		 * Static property used to define the default attribute
		 * configuration for the OverlayContext.
		 *
		 * @property OverlayContext.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			/**
			 * Inherited from <a href="Overlay.html#config_align">Overlay</a>.
			 *
			 * @attribute align
			 * @default { node: null, points: [ TL, BL ] }
			 * @type Object
			 */
			align: {
	            value: { node: null, points: [ TL, BL ] }
	        },

			/**
			 * Cancel auto hide delay if the user interact with the Overlay
	         * (focus, click, mouseover)
			 *
			 * @attribute cancellableHide
			 * @default true
			 * @type boolean
			 */
			cancellableHide: {
				value: true,
				validator: isBoolean
			},

			/**
			 * OverlayContext allow multiple elements to be the
	         * <a href="OverlayContext.html#config_trigger">trigger</a>, the
	         * currentNode stores the current active one.
			 *
			 * @attribute currentNode
			 * @default First item of the
	         * <a href="OverlayContext.html#config_trigger">trigger</a> NodeList.
			 * @type Node
			 */
			currentNode: {
				valueFn: function() {
					// define default currentNode as the first item from trigger
					return this.get(TRIGGER).item(0);
				}
			},

			delay: {
				value: null,
				validator: isObject
			},

			/**
			 * The event which is responsible to hide the OverlayContext.
			 *
			 * @attribute hideOn
			 * @default mouseout
			 * @type String
			 */
			hideOn: {
				lazyAdd: false,
				value: 'mouseout',
				setter: function(v) {
					return this._setHideOn(v);
				}
			},

			/**
			 * If true the instance is registered on the
	         * <a href="OverlayContextManager.html">OverlayContextManager</a> static
	         * class and will be hide when the user click on document.
			 *
			 * @attribute hideOnDocumentClick
			 * @default true
			 * @type boolean
			 */
			hideOnDocumentClick: {
				lazyAdd: false,
				setter: function(v) {
					return this._setHideOnDocumentClick(v);
				},
				value: true,
				validator: isBoolean
			},

			/**
			 * Number of milliseconds after the hide method is invoked to hide the
	         * OverlayContext.
			 *
			 * @attribute hideDelay
			 * @default 0
			 * @type Number
			 */
			hideDelay: {
				value: 0
			},

			/**
			 * The event which is responsible to show the OverlayContext.
			 *
			 * @attribute showOn
			 * @default mouseover
			 * @type String
			 */
			showOn: {
				lazyAdd: false,
				value: 'mouseover',
				setter: function(v) {
					return this._setShowOn(v);
				}
			},

			/**
			 * Number of milliseconds after the show method is invoked to show the
	         * OverlayContext.
			 *
			 * @attribute showDelay
			 * @default 0
			 * @type Number
			 */
			showDelay: {
				value: 0,
				validator: isNumber
			},

			/**
			 * Node, NodeList or Selector which will be used as trigger elements
	         * to show or hide the OverlayContext.
			 *
			 * @attribute trigger
			 * @default null
			 * @type {Node | NodeList | String}
			 */
			trigger: {
				lazyAdd: false,
				setter: function(v) {
					if (isNodeList(v)) {
						return v;
					}
					else if (isString(v)) {
						return A.all(v);
					}

					return new A.NodeList([v]);
				}
			},

			/**
			 * If true the OverlayContext is visible by default after the render phase.
	         * Inherited from <a href="Overlay.html">Overlay</a>.
			 *
			 * @attribute visible
			 * @default false
			 * @type boolean
			 */
			visible: {
				value: false
			}
		},

		EXTENDS: A.OverlayBase,

		constructor: function(config) {
			var instance = this;

			instance._hideTask = new A.DelayedTask(instance.hide, instance);
			instance._showTask = new A.DelayedTask(instance.show, instance);

			instance._showCallback = null;
			instance._hideCallback = null;

			OverlayContext.superclass.constructor.apply(this, arguments);
		},

		prototype: {
			/**
			 * Bind the events on the OverlayContext UI. Lifecycle.
			 *
			 * @method bindUI
			 * @protected
			 */
			bindUI: function(){
				var instance = this;
				var boundingBox = instance.get(BOUNDING_BOX);

				boundingBox.on(MOUSEDOWN, instance._stopTriggerEventPropagation);

				instance.before('triggerChange', instance._beforeTriggerChange);
				instance.before('showOnChange', instance._beforeShowOnChange);
				instance.before('hideOnChange', instance._beforeHideOnChange);

				instance.after('triggerChange', instance._afterTriggerChange);
				instance.after('showOnChange', instance._afterShowOnChange);
				instance.after('hideOnChange', instance._afterHideOnChange);

				boundingBox.on('click', A.bind(instance._cancelAutoHide, instance));
				boundingBox.on('mouseenter', A.bind(instance._cancelAutoHide, instance));
				boundingBox.on('mouseleave', A.bind(instance._invokeHideTaskOnInteraction, instance));
				instance.after('focusedChange', A.bind(instance._invokeHideTaskOnInteraction, instance));

				instance.on('visibleChange', instance._onVisibleChangeOverlayContext);
			},

			/**
			 * Hides the OverlayContext.
			 *
			 * @method hide
			 */
			hide: function() {
				var instance = this;

				instance.clearIntervals();

				instance.fire('hide');

				OverlayContext.superclass.hide.apply(instance, arguments);
			},

			/**
			 * Shows the OverlayContext.
			 *
			 * @method hide
			 */
			show: function(event) {
				var instance = this;

				instance.clearIntervals();

				instance.updateCurrentNode(event);

				instance.fire('show');

				OverlayContext.superclass.show.apply(instance, arguments);

				instance.refreshAlign();
			},

			/**
			 * Toggles visibility of the OverlayContext.
			 *
			 * @method toggle
			 * @param {EventFacade} event
			 */
			toggle: function(event) {
				var instance = this;

				if (instance.get(VISIBLE)) {
					instance._hideTask.delay( instance.get(HIDE_DELAY), null, null, [event] );
				}
				else {
					instance._showTask.delay( instance.get(SHOW_DELAY), null, null, [event] );
				}
			},

			/**
			 * Clear the intervals to show or hide the OverlayContext. See
		     * <a href="OverlayContext.html#config_hideDelay">hideDelay</a> and
		     * <a href="OverlayContext.html#config_showDelay">showDelay</a>.
			 *
			 * @method clearIntervals
			 */
			clearIntervals: function() {
				this._hideTask.cancel();
				this._showTask.cancel();
			},

			/**
			 * Refreshes the alignment of the OverlayContext with the
		     * <a href="OverlayContext.html#config_currentNode">currentNode</a>. See
		     * also <a href="OverlayContext.html#config_align">align</a>.
			 *
			 * @method refreshAlign
			 */
			refreshAlign: function() {
				var instance = this;
				var align = instance.get(ALIGN);
				var currentNode = instance.get(CURRENT_NODE);

				if (currentNode) {
					instance._uiSetAlign(currentNode, align.points);
				}
			},

			/**
			 * Update the
		     * <a href="OverlayContext.html#config_currentNode">currentNode</a> with the
		     * <a href="OverlayContext.html#config_align">align</a> node or the
		     * event.currentTarget and in last case with the first item of the
		     * <a href="OverlayContext.html#config_trigger">trigger</a>.
			 *
			 * @method updateCurrentNode
			 * @param {EventFacade} event
			 */
			updateCurrentNode: function(event) {
				var instance = this;
				var align = instance.get(ALIGN);
				var trigger = instance.get(TRIGGER);
				var currentTarget = null;

				if (event) {
					currentTarget = event.currentTarget;
				}

				var node = align.node || currentTarget || trigger.item(0);

				if (node) {
					instance.set(CURRENT_NODE, node);
				}
			},

			/**
			 * Handles the logic for the
		     * <a href="OverlayContext.html#method_toggle">toggle</a>.
			 *
			 * @method _toggle
			 * @param {EventFacade} event 
			 * @protected
			 */
			_toggle: function(event) {
				var instance = this;
				var currentTarget = event.currentTarget;

				// check if the target is different and simulate a .hide() before toggle
				if (instance._lastTarget != currentTarget) {
					instance.hide();
				}

				instance.toggle(event);

				event.stopPropagation();

				instance._lastTarget = currentTarget;
			},

			/**
			 * Fires after the <a href="OverlayContext.html#config_showOn">showOn</a>
		     * attribute change.
			 *
			 * @method _afterShowOnChange
			 * @param {EventFacade} event
			 * @protected
			 */
			_afterShowOnChange: function(event) {
				var instance = this;
				var wasToggle = event.prevVal == instance.get(HIDE_ON);

				if (wasToggle) {
					var trigger = instance.get(TRIGGER);

					// if wasToggle remove the toggle callback
					trigger.detach(event.prevVal, instance._hideCallback);
					// and re attach the hide event
					instance._setHideOn( instance.get(HIDE_ON) );
				}
			},

			/**
			 * Fires after the <a href="OverlayContext.html#config_hideOn">hideOn</a>
		     * attribute change.
			 *
			 * @method _afterHideOnChange
			 * @param {EventFacade} event
			 * @protected
			 */
			_afterHideOnChange: function(event) {
				var instance = this;
				var wasToggle = event.prevVal == instance.get(SHOW_ON);

				if (wasToggle) {
					var trigger = instance.get(TRIGGER);

					// if wasToggle remove the toggle callback
					trigger.detach(event.prevVal, instance._showCallback);
					// and re attach the show event
					instance._setShowOn( instance.get(SHOW_ON) );
				}
			},

			/**
			 * Fires after the <a href="OverlayContext.html#config_trigger">trigger</a>
		     * attribute change.
			 *
			 * @method _afterTriggerChange
			 * @param {EventFacade} event
			 * @protected
			 */
			_afterTriggerChange: function(event) {
				var instance = this;

				instance._setShowOn( instance.get(SHOW_ON) );
				instance._setHideOn( instance.get(HIDE_ON) );
			},

			/**
			 * Fires before the <a href="OverlayContext.html#config_showOn">showOn</a>
		     * attribute change.
			 *
			 * @method _beforeShowOnChange
			 * @param {EventFacade} event
			 * @protected
			 */
			_beforeShowOnChange: function(event) {
				var instance = this;
				var trigger = instance.get(TRIGGER);

				// detach the old callback
				trigger.detach(event.prevVal, instance._showCallback);
			},

			/**
			 * Fires before the <a href="OverlayContext.html#config_hideOn">hideOn</a>
		     * attribute change.
			 *
			 * @method _beforeHideOnChange
			 * @param {EventFacade} event
			 * @protected
			 */
			_beforeHideOnChange: function(event) {
				var instance = this;
				var trigger = instance.get(TRIGGER);

				// detach the old callback
				trigger.detach(event.prevVal, instance._hideCallback);
			},

			/**
			 * Fires before the <a href="OverlayContext.html#config_trigger">trigger</a>
		     * attribute change.
			 *
			 * @method _beforeTriggerChange
			 * @param {EventFacade} event
			 * @protected
			 */
			_beforeTriggerChange: function(event) {
				var instance = this;
				var trigger = instance.get(TRIGGER);
				var showOn = instance.get(SHOW_ON);
				var hideOn = instance.get(HIDE_ON);

				trigger.detach(showOn, instance._showCallback);
				trigger.detach(hideOn, instance._hideCallback);
				trigger.detach(MOUSEDOWN, instance._stopTriggerEventPropagation);
			},

			/**
			 * Cancel hide event if the user does some interaction with the
		     * OverlayContext (focus, click or mouseover).
			 * 
			 * @method _cancelAutoHide
			 * @param {EventFacade} event
			 * @protected
			 */
			_cancelAutoHide: function(event) {
				var instance = this;

				if (instance.get(CANCELLABLE_HIDE)) {
					instance.clearIntervals();
				}

				event.stopPropagation();
			},

			/**
			 * Invoke the hide event when the OverlayContext looses the focus.
			 * 
			 * @method _invokeHideTaskOnInteraction
			 * @param {EventFacade} event
			 * @protected
			 */
			_invokeHideTaskOnInteraction: function(event) {
				var instance = this;
				var cancellableHide = instance.get(CANCELLABLE_HIDE);
				var focused = instance.get(FOCUSED);

				if (!focused && !cancellableHide) {
					instance._hideTask.delay( instance.get(HIDE_DELAY) );
				}
			},

			/**
			 * Fires when the <a href="OverlayContext.html#config_visible">visible</a>
		     * attribute changes.
			 *
			 * @method _onVisibleChangeOverlayContext
			 * @param {EventFacade} event
			 * @protected
			 */
			_onVisibleChangeOverlayContext: function(event) {
				var instance = this;

				if (event.newVal && instance.get('disabled')) {
					event.preventDefault();
				}
			},

			/**
			 * Helper method to invoke event.stopPropagation().
			 * 
			 * @method _stopTriggerEventPropagation
			 * @param {EventFacade} event
			 * @protected
			 */
			_stopTriggerEventPropagation: function(event) {
				event.stopPropagation();
			},

			/**
			 * Setter for the <a href="OverlayContext.html#config_hideOn">hideOn</a>
		     * attribute.
			 *
			 * @method _setHideOn
			 * @param {String} eventType Event type
			 * @protected
			 * @return {String}
			 */
			_setHideOn: function(eventType) {
				var instance = this;
				var trigger = instance.get(TRIGGER);
				var toggle = eventType == instance.get(SHOW_ON);

				if (toggle) {
					instance._hideCallback = A.bind(instance._toggle, instance);

					// only one attached event is enough for toggle
					trigger.detach(eventType, instance._showCallback);
				}
				else {
					var delay = instance.get(HIDE_DELAY);

					instance._hideCallback = function(event) {
						instance._hideTask.delay(delay, null, null, [event]);

						event.stopPropagation();
					};
				}

				trigger.on(eventType, instance._hideCallback);

				return eventType;
			},

			/**
			 * Setter for the
		     * <a href="OverlayContext.html#config_hideOnDocumentClick">hideOnDocumentClick</a>
		     * attribute.
			 *
			 * @method _setHideOn
			 * @param {boolean} value
			 * @protected
			 * @return {boolean}
			 */
			_setHideOnDocumentClick: function(value) {
				var instance = this;

				if (value) {
					A.OverlayContextManager.register(instance);
				}
				else {
					A.OverlayContextManager.remove(instance);
				}

				return value;
			},

			/**
			 * Setter for the <a href="OverlayContext.html#config_showOn">showOn</a>
		     * attribute.
			 *
			 * @method _setShowOn
			 * @param {String} eventType Event type
			 * @protected
			 * @return {String}
			 */
			_setShowOn: function(eventType) {
				var instance = this;
				var trigger = instance.get(TRIGGER);
				var toggle = eventType == instance.get(HIDE_ON);

				if (toggle) {
					instance._showCallback = A.bind(instance._toggle, instance);

					// only one attached event is enough for toggle
					trigger.detach(eventType, instance._hideCallback);
				}
				else {
					var delay = instance.get(SHOW_DELAY);

					instance._showCallback = function(event) {
						instance._showTask.delay(delay, null, null, [event]);

						event.stopPropagation();
					};
				}

				if (eventType != MOUSEDOWN) {
					trigger.on(MOUSEDOWN, instance._stopTriggerEventPropagation);
				}
				else {
					trigger.detach(MOUSEDOWN, instance._stopTriggerEventPropagation);
				}

				trigger.on(eventType, instance._showCallback);

				return eventType;
			}
		}
	}
);

A.OverlayContext = OverlayContext;

/**
 * A base class for OverlayContextManager:
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class OverlayContextManager
 * @constructor
 * @extends OverlayManager
 * @static
 */
A.OverlayContextManager = new A.OverlayManager({});

A.on(MOUSEDOWN, function() { A.OverlayContextManager.hideAll(); }, A.getDoc());


}, 'gallery-2010.08.18-17-12' ,{requires:['gallery-aui-overlay-manager','gallery-aui-delayed-task']});
