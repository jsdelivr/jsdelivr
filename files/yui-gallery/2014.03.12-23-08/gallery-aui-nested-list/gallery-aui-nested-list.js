YUI.add('gallery-aui-nested-list', function(A) {

/**
 * The NestedList Utility - Full documentation coming soon.
 *
 * @module aui-nested-list
 */

var L = A.Lang,
	isString = L.isString,
	isFunction = L.isFunction,

	BLOCK = 'block',
	BODY = 'body',
	DD = 'dd',
	DISPLAY = 'display',
	DOWN = 'down',
	DRAG_NODE = 'dragNode',
	DROP_CONDITION = 'dropCondition',
	DROP_CONTAINER = 'dropContainer',
	DROP_ON = 'dropOn',
	FLOAT = 'float',
	HEIGHT = 'height',
	HELPER = 'helper',
	HIDDEN = 'hidden',
	LEFT = 'left',
	NESTED_LIST = 'nested-list',
	NODE = 'node',
	NODES = 'nodes',
	NONE = 'none',
	OFFSET_HEIGHT = 'offsetHeight',
	PLACEHOLDER = 'placeholder',
	PROXY = 'proxy',
	PX = 'px',
	RIGHT = 'right',
	SORT_CONDITION = 'sortCondition',
	UP = 'up',
	VISIBILITY = 'visibility',
	VISIBLE = 'visible',

	DDM = A.DD.DDM,

	isNodeList = function(v) {
		return (v instanceof A.NodeList);
	};

/**
 * A base class for NestedList, providing:
 * <ul>
 *    <li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *    <li>Nested sortable utility</li>
 * </ul>
 *
 * Quick Example:<br/>
 *
 * <pre><code>var nl = new A.NestedList({
 *  	nodes: '#demo li',
 *  	dropContainer: 'ul.droppable'
 *  });
 * </code></pre>
 *
 * Check the list of <a href="NestedList.html#configattributes">Configuration Attributes</a> available for
 * NestedList.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class NestedList
 * @constructor
 * @extends Base
 */
var NestedList = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property NestedList.NAME
		 * @type String
		 * @static
		 */
		NAME: NESTED_LIST,

		/**
		 * Static property used to define the default attribute
		 * configuration for the NestedList.
		 *
		 * @property NestedList.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			dd: {
				value: null
			},

			dropCondition: {
				value: function() {
					return true;
				},
				setter: function(v) {
					return A.bind(v, this);
				},
				validator: isFunction
			},

			dropContainer: {
				value: function(event) {
					var instance = this;
					var drop = event.drop;
					var dropNode = drop.get(NODE);
					var dropOn = instance.get(DROP_ON);

					return dropNode.one(dropOn);
				},
				validator: isFunction
			},

			dropOn: {
				validator: isString
			},

			helper: {
				value: null
			},

			nodes: {
				setter: function(v) {
					return this._setNodes(v);
				}
			},

			placeholder: {
				value: null
			},

			proxy: {
				value: null,
				setter: function(val) {
					return A.merge(
						{
							moveOnEnd: false,
							positionProxy: false
						},
						val || {}
					);
				}
			},

			sortCondition: {
				value: function() {
					return true;
				},
				setter: function(v) {
					return A.bind(v, this);
				},
				validator: isFunction
			}
		},

		EXTENDS: A.Base,

		prototype: {
			/**
			 * Construction logic executed during NestedList instantiation. Lifecycle.
			 *
			 * @method initializer
			 * @protected
			 */
			initializer: function() {
				var instance = this;
				var nodes = instance.get(NODES);

				// drag & drop listeners
				instance.on('drag:align', instance._onDragAlign);
				instance.on('drag:end', instance._onDragEnd);
				instance.on('drag:exit', instance._onDragExit);
				instance.on('drag:mouseDown', instance._onDragMouseDown);
				instance.on('drag:over', instance._onDragOver);
				instance.on('drag:start', instance._onDragStart);

				instance._createHelper();

				if (nodes) {
					instance.addAll(nodes);
				}
			},

			/*
			* Methods
			*/
			add: function(node) {
				var instance = this;

				instance._createDrag(node);
			},

			addAll: function(nodes) {
				var instance = this;

				nodes.each(function(node) {
					instance.add(node);
				});
			},

			_createDrag: function(node) {
				var instance = this;
				var helper = instance.get(HELPER);

				if (!DDM.getDrag(node)) {
					var dragOptions = {
						bubbleTargets: instance,
						node: node,
						target: true
					};

					var proxyOptions = instance.get(PROXY);

					if (helper) {
						proxyOptions.borderStyle = null;
					}

					// creating delayed drag instance
					var dd = new A.DD.Drag(
						A.mix(dragOptions, instance.get(DD))
					)
					.plug(A.Plugin.DDProxy, proxyOptions);
				}
			},

			_createHelper: function() {
				var instance = this;
				var helper = instance.get(HELPER);

				if (helper) {
					// append helper to the body
					A.one(BODY).append( helper.hide() );

					instance.set(HELPER, helper);
				}
			},

			_updatePlaceholder: function(event, cancelAppend) {
				var instance = this;
				var drag = event.target;
				var drop = event.drop;
				var dragNode = drag.get(NODE);
				var dropNode = drop.get(NODE);
				var dropOn = instance.get(DROP_ON);

				var dropContainer = instance.get(DROP_CONTAINER);

				if (dropContainer) {
					var container = dropContainer.apply(instance, arguments);
				}

				var floating = false;
				var xDirection = instance.XDirection;
				var yDirection = instance.YDirection;

				if (dropNode.getStyle(FLOAT) != NONE) {
					floating = true;
				}

				var placeholder = instance.get(PLACEHOLDER);

				if (!placeholder) {
					// if no placeholder use the dragNode instead
					placeholder = dragNode;
				}

				if (!placeholder.contains(dropNode)) {
					// check for the user dropCondition
					var dropCondition = instance.get(DROP_CONDITION);

					// if there is a container waiting for nodes to be appended it's priority
					if (container && !cancelAppend && dropCondition(event)) {
						// this checking avoid the parent bubbling drag:over
						if (!container.contains(placeholder) &&
							!placeholder.contains(container)) {
								// append placeholder on the found container
								container.append(placeholder);
						}
					}
					// otherwise, check if it's floating and the xDirection
					// or if it's not floating and the yDirection
					else {
						if (floating && (xDirection == LEFT) || !floating && (yDirection == UP)) {
							// LEFT or UP directions means to place the placeholder before
							dropNode.placeBefore(placeholder);
						}
						else {
							// RIGHT or DOWN directions means to place the placeholder after
							dropNode.placeAfter(placeholder);
						}
					}
				}
			},

			/*
			* Listeners
			*/
			_onDragAlign: function(event) {
				var instance = this;
				var lastX = instance.lastX;
				var lastY = instance.lastY;
				var xy = event.target.lastXY;

				var x = xy[0];
				var y = xy[1];

				// if the y change
				if (y != lastY) {
					// set the drag vertical direction
					instance.YDirection = (y < lastY) ? UP : DOWN;
				}

				// if the x change
				if (x != lastX) {
					// set the drag horizontal direction
					instance.XDirection = (x < lastX) ? LEFT : RIGHT;
				}

				instance.lastX = x;
				instance.lastY = y;
			},

			_onDragEnd: function(event) {
				var instance = this;
				var drag = event.target;
				var dragNode = drag.get(NODE);
				var placeholder = instance.get(PLACEHOLDER);

				if (placeholder) {
					dragNode.show();
					placeholder.hide();

					if (!dragNode.contains(placeholder)) {
						// position dragNode after the placeholder
						placeholder.placeAfter(dragNode);
					}
				}
			},

			_onDragExit: function(event) {
				var instance = this;
				var sortCondition = instance.get(SORT_CONDITION);

				if (sortCondition(event)) {
					instance._updatePlaceholder(event, true);
				}
			},

			_onDragMouseDown: function(event) {
				var instance = this;
				var drag = event.target;
				var helper = instance.get(HELPER);

				if (helper) {
					// update the DRAG_NODE with the new helper
					drag.set(DRAG_NODE, helper);
				}
			},

			_onDragStart: function(event) {
		 		var instance = this;
				var drag = event.target;
				var node = drag.get(NODE);
				var helper = instance.get(HELPER);
				var placeholder = instance.get(PLACEHOLDER);

				if (placeholder) {
					// update placeholder height
					placeholder.setStyle(
						HEIGHT,
						node.get(OFFSET_HEIGHT) + PX
					);

					node.hide();
					placeholder.show();
					// position placeholder after the node
					node.placeAfter(placeholder);

					if (helper) {
						// show helper, we need display block here, yui dd hide it with display none
						helper.setStyles({
							display: BLOCK,
							visibility: VISIBLE
						}).show();
					}
				}
		 	},

			_onDragOver: function(event) {
				var instance = this;
				var sortCondition = instance.get(SORT_CONDITION);

				if (sortCondition(event)) {
					instance._updatePlaceholder(event);
				}
			},

			/*
			* Setters
			*/
			_setNodes: function(v) {
				var instance = this;

				if (isNodeList(v)) {
					return v;
				}
				else if (isString(v)) {
					return A.all(v);
				}

				return new A.NodeList([v]);
			}
		}
	}
);

A.NestedList = NestedList;


}, 'gallery-2010.08.18-17-12' ,{skinnable:false, requires:['gallery-aui-base','dd-drag','dd-drop','dd-proxy']});
