YUI.add('gallery-aui-tree-view', function(A) {

/**
 * The TreeView Utility
 *
 * @module aui-tree
 * @submodule aui-tree-view
 */

var L = A.Lang,
	isString = L.isString,

	BOUNDING_BOX = 'boundingBox',
	CHILDREN = 'children',
	CONTAINER = 'container',
	CONTENT = 'content',
	CONTENT_BOX = 'contentBox',
	DOT = '.',
	FILE = 'file',
	HITAREA = 'hitarea',
	ICON = 'icon',
	LABEL = 'label',
	LAST_SELECTED = 'lastSelected',
	LEAF = 'leaf',
	NODE = 'node',
	OWNER_TREE = 'ownerTree',
	ROOT = 'root',
	SPACE = ' ',
	TREE = 'tree',
	TREE_VIEW = 'tree-view',
	TYPE = 'type',
	VIEW = 'view',

	concat = function() {
		return Array.prototype.slice.call(arguments).join(SPACE);
	},

	isTreeNode = function(v) {
		return ( v instanceof A.TreeNode );
	},

	getCN = A.ClassNameManager.getClassName,

	CSS_TREE_HITAREA = getCN(TREE, HITAREA),
	CSS_TREE_ICON = getCN(TREE, ICON),
	CSS_TREE_LABEL = getCN(TREE, LABEL),
	CSS_TREE_NODE_CONTENT = getCN(TREE, NODE, CONTENT),
	CSS_TREE_ROOT_CONTAINER = getCN(TREE, ROOT, CONTAINER),
	CSS_TREE_VIEW_CONTENT = getCN(TREE, VIEW, CONTENT);

/**
 * <p><img src="assets/images/aui-tree-view/main.png"/></p>
 *
 * A base class for TreeView, providing:
 * <ul>
 *    <li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 * </ul>
 *
 * Quick Example:<br/>
 *
 * <pre><code>var tree2 = new A.TreeView({
 *  	width: 200,
 *  	type: 'normal',
 *  	boundingBox: '#tree',
 *  	children: [
 *  		{ label: 'Folder 1', children: [ { label: 'file' }, { label: 'file' }, { label: 'file' } ] },
 *  		{ label: 'Folder 2', expanded: true, children: [ { label: 'file' }, { label: 'file' } ] },
 *  		{ label: 'Folder 3', children: [ { label: 'file' } ] },
 *  		{ label: 'Folder 4', expanded: true, children: [ { label: 'Folder 4-1', expanded: true, children: [ { label: 'file' } ] } ] }
 *  	]
 *  })
 *  .render();
 * </code></pre>
 *
 * Check the list of <a href="TreeView.html#configattributes">Configuration Attributes</a> available for
 * TreeView.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class TreeView
 * @constructor
 * @extends TreeData
 */
var TreeView = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property TreeView.NAME
		 * @type String
		 * @static
		 */
		NAME: TREE_VIEW,

		/**
		 * Static property used to define the default attribute
		 * configuration for the TreeView.
		 *
		 * @property TreeView.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			/**
			 * Type of the treeview (i.e. could be 'file' or 'normal').
			 *
			 * @attribute type
			 * @default 'file'
			 * @type String
			 */
			type: {
				value: FILE,
				validator: isString
			},

			/**
			 * Last selected TreeNode.
			 *
			 * @attribute lastSelected
			 * @default null
			 * @type TreeNode
			 */
			lastSelected: {
				value: null,
				validator: isTreeNode
			},

			/**
			 * IO metadata for loading the children using ajax.
			 *
			 * @attribute io
			 * @default null
			 * @type Object
			 */
			io: {
				value: null
			},

			paginator: {
				value: null
			}
		},

		EXTENDS: A.TreeData,

		prototype: {
			CONTENT_TEMPLATE: '<ul></ul>',

			/**
			 * Bind the events on the TreeView UI. Lifecycle.
			 *
			 * @method bindUI
			 * @protected
			 */
			bindUI: function() {
				var instance = this;

				instance._delegateDOM();
			},

			/**
			 * Create the DOM structure for the TreeView. Lifecycle.
			 *
			 * @method renderUI
			 * @protected
			 */
			renderUI: function() {
				var instance = this;

				instance._renderElements();
			},

			/**
			 * Sync the TreeView UI. Lifecycle.
			 *
			 * @method syncUI
			 * @protected
			 */
			syncUI: function() {
				var instance = this;

				instance.refreshIndex();
			},

			registerNode: function(node) {
				var instance = this;

				// when the node is appended to the TreeView set the OWNER_TREE
				node.set(OWNER_TREE, instance);

				TreeView.superclass.registerNode.apply(this, arguments);
			},

			/**
			 * Create TreeNode from HTML markup.
			 *
			 * @method _createFromHTMLMarkup
			 * @param {Node} container
			 * @protected
			 */
			_createFromHTMLMarkup: function(container) {
				var instance = this;

				container.all('> li').each(function(node) {
					// use firstChild as label
					var labelEl = node.one('> *').remove();
					var label = labelEl.outerHTML();

					// avoid memory leak
					docFrag = null;

					var treeNode = new A.TreeNode({
						boundingBox: node,
						label: label
					});

					var deepContainer = node.one('> ul');

					if (deepContainer) {
						// if has deepContainer it's not a leaf
						treeNode.set(LEAF, false);
						treeNode.set(CONTAINER, deepContainer);

						// render node before invoke the recursion
						treeNode.render();

						// propagating markup recursion
						instance._createFromHTMLMarkup(deepContainer);
					}
					else {
						treeNode.render();
					}

					// find the parent TreeNode...
					var parentNode = node.get(PARENT_NODE).get(PARENT_NODE);
					var parentTreeNode = A.Widget.getByNode(parentNode);

					// and simulate the appendChild.
					parentTreeNode.appendChild(treeNode);
				});
			},

			/**
			 * Render elements.
			 *
			 * @method _renderElements
			 * @protected
			 */
			_renderElements: function() {
				var instance = this;
				var contentBox = instance.get(CONTENT_BOX);
				var children = instance.get(CHILDREN);
				var type = instance.get(TYPE);
				var CSS_TREE_TYPE = getCN(TREE, type);

				contentBox.addClass(CSS_TREE_VIEW_CONTENT);

				instance.set(CONTAINER, contentBox);

				contentBox.addClass(
					concat(CSS_TREE_TYPE, CSS_TREE_ROOT_CONTAINER)
				);

				if (children.length) {
					// if has children appendChild them
					instance.eachChildren(function(node) {
						instance.appendChild(node, true);
					});
				}
				else {
					// if children not specified try to create from markup
					instance._createFromHTMLMarkup(contentBox);
				}
			},

			/**
			 * Delegate events.
			 *
			 * @method _delegateDOM
			 * @protected
			 */
			_delegateDOM: function() {
				var instance = this;
				var boundingBox = instance.get(BOUNDING_BOX);

				// expand/collapse delegations
				boundingBox.delegate('click', A.bind(instance._onClickHitArea, instance), DOT+CSS_TREE_HITAREA);
				boundingBox.delegate('dblclick', A.bind(instance._onClickHitArea, instance), DOT+CSS_TREE_ICON);
				boundingBox.delegate('dblclick', A.bind(instance._onClickHitArea, instance), DOT+CSS_TREE_LABEL);
				// other delegations
				boundingBox.delegate('mouseenter', A.bind(instance._onMouseEnterNodeEl, instance), DOT+CSS_TREE_NODE_CONTENT);
				boundingBox.delegate('mouseleave', A.bind(instance._onMouseLeaveNodeEl, instance), DOT+CSS_TREE_NODE_CONTENT);
				boundingBox.delegate('click', A.bind(instance._onClickNodeEl, instance), DOT+CSS_TREE_NODE_CONTENT);
			},

			/**
			 * Fires on click the TreeView (i.e. set the select/unselect state).
			 *
			 * @method _onClickNodeEl
			 * @param {EventFacade} event
			 * @protected
			 */
			_onClickNodeEl: function(event) {
				var instance = this;
				var treeNode = instance.getNodeByChild( event.currentTarget );

				if (treeNode && !treeNode.isSelected()) {
					var lastSelected = instance.get(LAST_SELECTED);

					// select drag node
					if (lastSelected) {
						lastSelected.unselect();
					}

					treeNode.select();
				}
			},

			/**
			 * Fires on <code>mouseeneter</code> the TreeNode.
			 *
			 * @method _onMouseEnterNodeEl
			 * @param {EventFacade} event
			 * @protected
			 */
			_onMouseEnterNodeEl: function(event) {
				var instance = this;
				var treeNode = instance.getNodeByChild( event.currentTarget );

				if (treeNode) {
					treeNode.over();
				}
			},

			/**
			 * Fires on <code>mouseleave</code> the TreeNode.
			 *
			 * @method _onMouseLeaveNodeEl
			 * @param {EventFacade} event
			 * @protected
			 */
			_onMouseLeaveNodeEl: function(event) {
				var instance = this;
				var treeNode = instance.getNodeByChild( event.currentTarget );

				if (treeNode) {
					treeNode.out();
				}
			},

			/**
			 * Fires on <code>click</code> the TreeNode hitarea.
			 *
			 * @method _onClickHitArea
			 * @param {EventFacade} event
			 * @protected
			 */
			_onClickHitArea: function(event) {
				var instance = this;
				var treeNode = instance.getNodeByChild( event.currentTarget );

				if (treeNode) {
					treeNode.toggle();
				}
			}
		}
	}
);

A.TreeView = TreeView;

/*
* TreeViewDD - Drag & Drop
*/
var isNumber = L.isNumber,

	ABOVE = 'above',
	APPEND = 'append',
	BELOW = 'below',
	BLOCK = 'block',
	BODY = 'body',
	CLEARFIX = 'clearfix',
	DEFAULT = 'default',
	DISPLAY = 'display',
	DOWN = 'down',
	DRAG = 'drag',
	DRAGGABLE = 'draggable',
	DRAG_CURSOR = 'dragCursor',
	DRAG_NODE = 'dragNode',
	EXPANDED = 'expanded',
	HELPER = 'helper',
	INSERT = 'insert',
	OFFSET_HEIGHT = 'offsetHeight',
	PARENT_NODE = 'parentNode',
	SCROLL_DELAY = 'scrollDelay',
	STATE = 'state',
	TREE_DRAG_DROP = 'tree-drag-drop',
	UP = 'up',

	DDM = A.DD.DDM,

	CSS_HELPER_CLEARFIX = getCN(HELPER, CLEARFIX),
	CSS_ICON = getCN(ICON),
	CSS_TREE_DRAG_HELPER = getCN(TREE, DRAG, HELPER),
	CSS_TREE_DRAG_HELPER_CONTENT = getCN(TREE, DRAG, HELPER, CONTENT),
	CSS_TREE_DRAG_HELPER_LABEL = getCN(TREE, DRAG, HELPER, LABEL),
	CSS_TREE_DRAG_INSERT_ABOVE = getCN(TREE, DRAG, INSERT, ABOVE),
	CSS_TREE_DRAG_INSERT_APPEND = getCN(TREE, DRAG, INSERT, APPEND),
	CSS_TREE_DRAG_INSERT_BELOW = getCN(TREE, DRAG, INSERT, BELOW),
	CSS_TREE_DRAG_STATE_APPEND = getCN(TREE, DRAG, STATE, APPEND),
	CSS_TREE_DRAG_STATE_INSERT_ABOVE = getCN(TREE, DRAG, STATE, INSERT, ABOVE),
	CSS_TREE_DRAG_STATE_INSERT_BELOW = getCN(TREE, DRAG, STATE, INSERT, BELOW),

	HELPER_TPL = '<div class="'+CSS_TREE_DRAG_HELPER+'">'+
					'<div class="'+[CSS_TREE_DRAG_HELPER_CONTENT, CSS_HELPER_CLEARFIX].join(SPACE)+'">'+
						'<span class="'+CSS_ICON+'"></span>'+
						'<span class="'+CSS_TREE_DRAG_HELPER_LABEL+'"></span>'+
					'</div>'+
				 '</div>';

/**
 * A base class for TreeViewDD, providing:
 * <ul>
 *    <li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *    <li>DragDrop support for the TreeNodes</li>
 * </ul>
 *
 * Quick Example:<br/>
 *
 * Check the list of <a href="TreeViewDD.html#configattributes">Configuration Attributes</a> available for
 * TreeViewDD.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class TreeViewDD
 * @constructor
 * @extends TreeView
 */
var TreeViewDD = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property TreeViewDD.NAME
		 * @type String
		 * @static
		 */
		NAME: TREE_DRAG_DROP,

		/**
		 * Static property used to define the default attribute
		 * configuration for the TreeViewDD.
		 *
		 * @property TreeViewDD.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			/**
			 * Dragdrop helper element.
			 *
			 * @attribute helper
			 * @default null
			 * @type Node | String
			 */
			helper: {
				value: null
			},

			/**
			 * Delay of the scroll while dragging the TreeNodes.
			 *
			 * @attribute scrollDelay
			 * @default 100
			 * @type Number
			 */
			scrollDelay: {
				value: 100,
				validator: isNumber
			}
		},

		EXTENDS: A.TreeView,

		prototype: {
			/**
			 * Direction of the drag (i.e. could be 'up' or 'down').
			 *
			 * @property direction
			 * @type String
			 * @protected
			 */
			direction: BELOW,

			/**
			 * Drop action (i.e. could be 'append', 'below' or 'above').
			 *
			 * @attribute dropAction
			 * @default null
			 * @type String
			 */
			dropAction: null,

			/**
			 * Last Y.
			 *
			 * @attribute lastY
			 * @default 0
			 * @type Number
			 */
			lastY: 0,

			node: null,

			/**
			 * Reference for the current drop node.
			 *
			 * @attribute nodeContent
			 * @default null
			 * @type Node
			 */
			nodeContent: null,

			/**
			 * Descructor lifecycle implementation for the TreeViewDD class.
			 * Purges events attached to the node (and all child nodes).
			 *
			 * @method destructor
			 * @protected
			 */
			destructor: function() {
				var instance = this;
				var helper = instance.get(HELPER);

				if (helper) {
					helper.remove(true);
				}

				instance.eachChildren(
					function(child) {
						if (child.get(DRAGGABLE)) {
							var dd = DDM.getDrag(child.get(CONTENT_BOX));

							if (dd) {
								dd.destroy();
							}
						}
					},
					true
				);
			},

			/**
			 * Bind the events on the TreeViewDD UI. Lifecycle.
			 *
			 * @method bindUI
			 * @protected
			 */
			bindUI: function() {
				var instance = this;

				TreeViewDD.superclass.bindUI.apply(this, arguments);

				instance._bindDragDrop();
			},

			/**
			 * Create the DOM structure for the TreeViewDD. Lifecycle.
			 *
			 * @method renderUI
			 * @protected
			 */
			renderUI: function() {
				var instance = this;

				TreeViewDD.superclass.renderUI.apply(this, arguments);

				// creating drag helper and hiding it
				var helper = A.Node.create(HELPER_TPL).hide();

				// append helper to the body
				A.one(BODY).append(helper);

				instance.set(HELPER, helper);

				// set DRAG_CURSOR to the default arrow
				DDM.set(DRAG_CURSOR, DEFAULT);
			},

			/**
			 * Setup DragDrop on the TreeNodes.
			 *
			 * @method _createDrag
			 * @param {Node} node
			 * @protected
			 */
			_createDrag: function(node) {
				var instance = this;

				if (!instance.dragTimers) {
					instance.dragTimers = [];
				}

				if (!DDM.getDrag(node)) {
					var dragTimers = instance.dragTimers;
					// dragDelay is a incremental delay for create the drag instances
					var dragDelay = 50 * dragTimers.length;

					// wrapping the _createDrag on a setTimeout for performance reasons
					var timer = setTimeout(
						function() {
							if (!DDM.getDrag(node)) {
								// creating delayed drag instance
								var drag = new A.DD.Drag({
									bubbleTargets: instance,
									node: node,
									target: true
								})
								.plug(A.Plugin.DDProxy, {
									moveOnEnd: false,
									positionProxy: false,
									borderStyle: null
								})
								.plug(A.Plugin.DDNodeScroll, {
									scrollDelay: instance.get(SCROLL_DELAY),
									node: instance.get(BOUNDING_BOX)
								});
							}

							A.Array.removeItem(dragTimers, timer);
						},
						dragDelay
					);

					dragTimers.push(timer);
				}
			},

			/**
			 * Bind DragDrop events.
			 *
			 * @method _bindDragDrop
			 * @protected
			 */
			_bindDragDrop: function() {
				var instance = this;
				var boundingBox = instance.get(BOUNDING_BOX);

				instance._createDragInitHandler = A.bind(
					function() {
						// set init elements as draggable
						instance.eachChildren(function(child) {
							if (child.get(DRAGGABLE)) {
								instance._createDrag( child.get(CONTENT_BOX) );
							}
						}, true);

						boundingBox.detach('mouseover', instance._createDragInitHandler);
					},
					instance
				);

				// only create the drag on the init elements if the user mouseover the boundingBox for init performance reasons
				boundingBox.on('mouseover', instance._createDragInitHandler);

				// when append new nodes, make them draggable
				instance.after('insert', A.bind(instance._afterAppend, instance));
				instance.after('append', A.bind(instance._afterAppend, instance));

				// drag & drop listeners
				instance.on('drag:align', instance._onDragAlign);
				instance.on('drag:start', instance._onDragStart);
				instance.on('drop:exit', instance._onDropExit);
				instance.after('drop:hit', instance._afterDropHit);
				instance.on('drop:hit', instance._onDropHit);
				instance.on('drop:over', instance._onDropOver);
			},

			/**
			 * Set the append CSS state on the passed <code>nodeContent</code>.
			 *
			 * @method _appendState
			 * @param {Node} nodeContent
			 * @protected
			 */
			_appendState: function(nodeContent) {
				var instance = this;

				instance.dropAction = APPEND;

				instance.get(HELPER).addClass(CSS_TREE_DRAG_STATE_APPEND);

				nodeContent.addClass(CSS_TREE_DRAG_INSERT_APPEND);
			},

			/**
			 * Set the going down CSS state on the passed <code>nodeContent</code>.
			 *
			 * @method _goingDownState
			 * @param {Node} nodeContent
			 * @protected
			 */
			_goingDownState: function(nodeContent) {
				var instance = this;

				instance.dropAction = BELOW;

				instance.get(HELPER).addClass(CSS_TREE_DRAG_STATE_INSERT_BELOW);

				nodeContent.addClass(CSS_TREE_DRAG_INSERT_BELOW);
			},

			/**
			 * Set the going up CSS state on the passed <code>nodeContent</code>.
			 *
			 * @method _goingUpState
			 * @param {Node} nodeContent
			 * @protected
			 */
			_goingUpState: function(nodeContent) {
				var instance = this;

				instance.dropAction = ABOVE;

				instance.get(HELPER).addClass(CSS_TREE_DRAG_STATE_INSERT_ABOVE);

				nodeContent.addClass(CSS_TREE_DRAG_INSERT_ABOVE);
			},

			/**
			 * Set the reset CSS state on the passed <code>nodeContent</code>.
			 *
			 * @method _resetState
			 * @param {Node} nodeContent
			 * @protected
			 */
			_resetState: function(nodeContent) {
				var instance = this;
				var helper = instance.get(HELPER);

				helper.removeClass(CSS_TREE_DRAG_STATE_APPEND);
				helper.removeClass(CSS_TREE_DRAG_STATE_INSERT_ABOVE);
				helper.removeClass(CSS_TREE_DRAG_STATE_INSERT_BELOW);

				if (nodeContent) {
					nodeContent.removeClass(CSS_TREE_DRAG_INSERT_ABOVE);
					nodeContent.removeClass(CSS_TREE_DRAG_INSERT_APPEND);
					nodeContent.removeClass(CSS_TREE_DRAG_INSERT_BELOW);
				}
			},

			/**
			 * Update the CSS node state (i.e. going down, going up, append etc).
			 *
			 * @method _updateNodeState
			 * @param {EventFacade} event
			 * @protected
			 */
			_updateNodeState: function(event) {
				var instance = this;
				var drag = event.drag;
				var drop = event.drop;
				var nodeContent = drop.get(NODE);
				var dropNode = nodeContent.get(PARENT_NODE);
				var dragNode = drag.get(NODE).get(PARENT_NODE);
				var dropTreeNode = A.Widget.getByNode(dropNode);

				// reset the classNames from the last nodeContent
				instance._resetState(instance.nodeContent);

				// cannot drop the dragged element into any of its children
				// using DOM contains method for performance reason
				if ( !dragNode.contains(dropNode) ) {
					// nArea splits the height in 3 areas top/center/bottom
					// these areas are responsible for defining the state when the mouse is over any of them
					var nArea = nodeContent.get(OFFSET_HEIGHT) / 3;
					var yTop = nodeContent.getY();
					var yCenter = yTop + nArea*1;
					var yBottom = yTop + nArea*2;
					var mouseY = drag.mouseXY[1];

					// UP: mouse on the top area of the node
					if ((mouseY > yTop) && (mouseY < yCenter)) {
						instance._goingUpState(nodeContent);
					}
					// DOWN: mouse on the bottom area of the node
					else if (mouseY > yBottom) {
						instance._goingDownState(nodeContent);
					}
					// APPEND: mouse on the center area of the node
					else if ((mouseY > yCenter) && (mouseY < yBottom)) {
						// if it's a folder set the state to append
						if (dropTreeNode && !dropTreeNode.isLeaf()) {
							instance._appendState(nodeContent);
						}
						// if it's a leaf we need to set the ABOVE or BELOW state instead of append
						else {
							if (instance.direction == UP) {
								instance._goingUpState(nodeContent);
							}
							else {
								instance._goingDownState(nodeContent);
							}
						}
					}
				}

				instance.nodeContent = nodeContent;
			},

			/**
			 * Fires after the append event.
			 *
			 * @method _handleEvent
			 * @param {EventFacade} event append event facade
			 * @protected
			 */
			_afterAppend: function(event) {
				var instance = this;
				var treeNode = event.tree.node;

				if (treeNode.get(DRAGGABLE)) {
					instance._createDrag( treeNode.get(CONTENT_BOX) );
				}
			},

			/**
			 * Fires after the drop hit event.
			 *
			 * @method _afterDropHit
			 * @param {EventFacade} event drop hit event facade
			 * @protected
			 */
			_afterDropHit: function(event) {
				var instance = this;
				var dropAction = instance.dropAction;
				var dragNode = event.drag.get(NODE).get(PARENT_NODE);
				var dropNode = event.drop.get(NODE).get(PARENT_NODE);

				var dropTreeNode = A.Widget.getByNode(dropNode);
				var dragTreeNode = A.Widget.getByNode(dragNode);

				var output = instance.getEventOutputMap(instance);

				output.tree.dropNode = dropTreeNode;
				output.tree.dragNode = dragTreeNode;

				if (dropAction == ABOVE) {
					dropTreeNode.insertBefore(dragTreeNode);

					instance.bubbleEvent('dropInsert', output);
				}
				else if (dropAction == BELOW) {
					dropTreeNode.insertAfter(dragTreeNode);

					instance.bubbleEvent('dropInsert', output);
				}
				else if (dropAction == APPEND) {
					if (dropTreeNode && !dropTreeNode.isLeaf()) {
						dropTreeNode.appendChild(dragTreeNode);

						if (!dropTreeNode.get(EXPANDED)) {
							// expand node when drop a child on it
							dropTreeNode.expand();
						}

						instance.bubbleEvent('dropAppend', output);
					}
				}

				instance._resetState(instance.nodeContent);

				// bubbling drop event
				instance.bubbleEvent('drop', output);

				instance.dropAction = null;
			},

			/**
			 * Fires on drag align event.
			 *
			 * @method _onDragAlign
			 * @param {EventFacade} event append event facade
			 * @protected
			 */
			_onDragAlign: function(event) {
				var instance = this;
				var lastY = instance.lastY;
				var y = event.target.lastXY[1];

				// if the y change
				if (y != lastY) {
					// set the drag direction
					instance.direction = (y < lastY) ? UP : DOWN;
				}

				instance.lastY = y;
			},

			/**
			 * Fires on drag start event.
			 *
			 * @method _onDragStart
			 * @param {EventFacade} event append event facade
			 * @protected
			 */
			_onDragStart: function(event) {
				var instance = this;
				var drag = event.target;
				var dragNode = drag.get(NODE).get(PARENT_NODE);
				var dragTreeNode = A.Widget.getByNode(dragNode);
				var lastSelected = instance.get(LAST_SELECTED);

				// select drag node
				if (lastSelected) {
					lastSelected.unselect();
				}

				dragTreeNode.select();

				// initialize drag helper
				var helper = instance.get(HELPER);
				var helperLabel = helper.one(DOT+CSS_TREE_DRAG_HELPER_LABEL);

				// show helper, we need display block here, yui dd hide it with display none
				helper.setStyle(DISPLAY, BLOCK).show();

				// set the CSS_TREE_DRAG_HELPER_LABEL html with the label of the dragged node
				helperLabel.html( dragTreeNode.get(LABEL) );

				// update the DRAG_NODE with the new helper
				drag.set(DRAG_NODE, helper);
			},

			/**
			 * Fires on drop over event.
			 *
			 * @method _onDropOver
			 * @param {EventFacade} event append event facade
			 * @protected
			 */
			_onDropOver: function(event) {
				var instance = this;

				instance._updateNodeState(event);
			},

			/**
			 * Fires on drop hit event.
			 *
			 * @method _onDropHit
			 * @param {EventFacade} event append event facade
			 * @protected
			 */
			_onDropHit: function(event) {
				var dropNode = event.drop.get(NODE).get(PARENT_NODE);
				var dropTreeNode = A.Widget.getByNode(dropNode);

				if (!isTreeNode(dropTreeNode)) {
					event.preventDefault();
				}
			},

			/**
			 * Fires on drop exit event.
			 *
			 * @method _onDropExit
			 * @param {EventFacade} event append event facade
			 * @protected
			 */
			_onDropExit: function() {
				var instance = this;

				instance.dropAction = null;

				instance._resetState(instance.nodeContent);
			}
		}
	}
);

A.TreeViewDD = TreeViewDD;


}, 'gallery-2011.02.09-21-32' ,{requires:['gallery-aui-tree-node','dd-drag','dd-drop','dd-proxy'], skinnable:true});
