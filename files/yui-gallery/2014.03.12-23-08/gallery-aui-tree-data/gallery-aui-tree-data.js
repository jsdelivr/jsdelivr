YUI.add('gallery-aui-tree-data', function(A) {

/**
 * The TreeData Utility
 *
 * @module aui-tree
 * @submodule aui-tree-data
 */

var L = A.Lang,
	isArray = L.isArray,
	isObject = L.isObject,
	isString = L.isString,
	isUndefined = L.isUndefined,

	BOUNDING_BOX = 'boundingBox',
	CHILDREN = 'children',
	CONTAINER = 'container',
	DOT = '.',
	ID = 'id',
	INDEX = 'index',
	NEXT_SIBLING = 'nextSibling',
	NODE = 'node',
	OWNER_TREE = 'ownerTree',
	PARENT_NODE = 'parentNode',
	PREV_SIBLING = 'prevSibling',
	PREVIOUS_SIBLING = 'previousSibling',
	TREE = 'tree',
	TREE_DATA = 'tree-data',

	isTreeNode = function(v) {
		return ( v instanceof A.TreeNode );
	},

	getCN = A.ClassNameManager.getClassName,

	CSS_TREE_NODE = getCN(TREE, NODE);

/**
 * A base class for TreeData, providing:
 * <ul>
 *    <li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *    <li>Handle the data of the tree</li>
 *    <li>Basic DOM implementation (append/remove/insert)</li>
 *    <li>Indexing management to handle the children nodes</li>
 * </ul>
 *
 * Check the list of <a href="TreeData.html#configattributes">Configuration Attributes</a> available for
 * TreeData.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class TreeData
 * @constructor
 * @extends Base
 */
var TreeData = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property TreeData.NAME
		 * @type String
		 * @static
		 */
		NAME: TREE_DATA,

		/**
		 * Static property used to define the default attribute
		 * configuration for the TreeData.
		 *
		 * @property TreeData.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			/**
			 * Container to nest children nodes. If has cntainer it's not a leaf.
			 *
			 * @attribute container
			 * @default null
			 * @type Node | String
			 */
			container: {
				setter: A.one
			},

			/**
			 * Array of children (i.e. could be a JSON metadata object or a TreeNode instance).
			 *
			 * @attribute children
			 * @default []
			 * @type Array
			 */
			children: {
				value: [],
				validator: isArray,
				setter: function(v) {
					return this._setChildren(v);
				}
			},

			/**
			 * Index the nodes.
			 *
			 * @attribute index
			 * @default {}
			 * @type Object
			 */
			index: {
				value: {}
			}
		},

		prototype: {
			/**
			 * Empty UI_EVENTS.
			 *
			 * @property UI_EVENTS
			 * @type Object
			 * @protected
			 */
			UI_EVENTS: {},

			/**
			 * Construction logic executed during TreeData instantiation. Lifecycle.
			 *
			 * @method initializer
			 * @protected
			 */
			initializer: function() {
				var instance = this;

				// binding on initializer, needed before .render() phase
				instance.publish('move');
				instance.publish('collapseAll', { defaultFn: instance._collapseAll });
				instance.publish('expandAll', { defaultFn: instance._expandAll });
				instance.publish('append', { defaultFn: instance._appendChild });
				instance.publish('remove', { defaultFn: instance._removeChild });

				TreeData.superclass.initializer.apply(this, arguments);
			},

			/**
			 * Descructor lifecycle implementation for the TreeData class.
			 * Purges events attached to the node (and all child nodes).
			 *
			 * @method destructor
			 * @protected
			 */
			destructor: function() {
				var instance = this;

				instance.eachChildren(function(node) {
					node.destroy();
				}, true);
			},

			/**
			 * Get a TreeNode by id.
			 *
			 * @method getNodeById
			 * @param {String} uid
			 * @return {TreeNode}
			 */
			getNodeById: function(uid) {
				var instance = this;

				return instance.get(INDEX)[uid];
			},

			/**
			 * Whether the TreeNode is registered on this TreeData.
			 *
			 * @method isRegistered
			 * @param {TreeNode} node
			 * @return {boolean}
			 */
			isRegistered: function(node) {
				var instance = this;

				return !!(instance.get(INDEX)[ node.get(ID) ]);
			},

			/**
			 * Update the references of the passed TreeNode.
			 *
			 * @method updateReferences
			 * @param {node} TreeNode
			 * @param {parentNode} TreeNode
			 * @param {ownerTree} TreeView
			 */
			updateReferences: function(node, parentNode, ownerTree) {
				var instance = this;
				var oldParent = node.get(PARENT_NODE);
				var oldOwnerTree = node.get(OWNER_TREE);
				var moved = oldParent && (oldParent != parentNode);

				if (oldParent) {
					if (moved) {
						// when moved update the oldParent children
						var children = oldParent.get(CHILDREN);

						A.Array.removeItem(children, instance);

						oldParent.set(CHILDREN, children);
					}

					oldParent.unregisterNode(node);
				}

				if (oldOwnerTree) {
					oldOwnerTree.unregisterNode(node);
				}

				// update parent reference when registered
				node.set(PARENT_NODE, parentNode);

				// update the ownerTree of the node
				node.set(OWNER_TREE, ownerTree);

				if (parentNode) {
					// register the new node on the parentNode index
					parentNode.registerNode(node);
				}

				if (ownerTree) {
					// register the new node to the ownerTree index
					ownerTree.registerNode(node);
				}

				if (oldOwnerTree != ownerTree) {
					// when change the OWNER_TREE update the children references also
					node.eachChildren(function(child) {
						instance.updateReferences(child, child.get(PARENT_NODE), ownerTree);
					});
				}

				// trigger move event
				if (moved) {
					var output = instance.getEventOutputMap(node);

					output.tree.oldParent = oldParent;
					output.tree.oldOwnerTree = oldOwnerTree;

					instance.bubbleEvent('move', output);
				}
			},

			/**
			 * Refresh the index (i.e. re-index all nodes).
			 *
			 * @method refreshIndex
			 */
			refreshIndex: function() {
				var instance = this;

				// reset index
				instance.updateIndex({});

				// get all descendent children - deep
				instance.eachChildren(function(node) {
					instance.registerNode(node);
				}, true);
			},

			/**
			 * Register the passed TreeNode on this TreeData.
			 *
			 * @method registerNode
			 * @param {TreeNode} node
			 */
			registerNode: function(node) {
				var instance = this;
				var uid = node.get(ID);
				var index = instance.get(INDEX);

				if (uid) {
					index[uid] = node;
				}

				instance.updateIndex(index);
			},

			/**
			 * Update the <a href="TreeData.html#config_index">index</a> attribute value.
			 *
			 * @method updateIndex
			 * @param {Object} index
			 */
			updateIndex: function(index) {
				var instance = this;

				if (index) {
					instance.set(INDEX, index);
				}
			},

			/**
			 * Unregister the passed TreeNode from this TreeData.
			 *
			 * @method unregisterNode
			 * @param {TreeNode} node
			 */
			unregisterNode: function(node) {
				var instance = this;
				var index = instance.get(INDEX);

				delete index[ node.get(ID) ];

				instance.updateIndex(index);
			},

			/**
			 * Collapse all children of the TreeData.
			 *
			 * @method collapseAll
			 */
			collapseAll: function() {
				var instance = this;
				var output = instance.getEventOutputMap(instance);

				instance.fire('collapseAll', output);
			},

			/**
			 * Collapse all children of the TreeData.
			 *
			 * @method _collapseAll
			 * @protected
			 */
			_collapseAll: function(event) {
				var instance = this;

				instance.eachChildren(function(node) {
					node.collapse();
				}, true);
			},

			/**
			 * Expand all children of the TreeData.
			 *
			 * @method expandAll
			 */
			expandAll: function() {
				var instance = this;
				var output = instance.getEventOutputMap(instance);

				instance.fire('expandAll', output);
			},

			/**
			 * Expand all children of the TreeData.
			 *
			 * @method _expandAll
			 * @protected
			 */
			_expandAll: function(event) {
				var instance = this;

				instance.eachChildren(function(node) {
					node.expand();
				}, true);
			},

			/**
			 * Select all children of the TreeData.
			 *
			 * @method selectAll
			 */
			selectAll: function() {
				var instance = this;

				instance.eachChildren(function(child) {
					child.select();
				}, true);
			},

			/**
			 * Unselect all children of the TreeData.
			 *
			 * @method selectAll
			 */
			unselectAll: function() {
				var instance = this;

				instance.eachChildren(function(child) {
					child.unselect();
				}, true);
			},

			/**
			 * Loop each children and execute the <code>fn</code> callback.
			 *
			 * @method eachChildren
			 * @param {function} fn callback
			 * @param {boolean} fn recursive
			 */
			eachChildren: function(fn, deep) {
				var instance = this;
				var children = instance.getChildren(deep);

				A.Array.each(children, function(node) {
					if (node) {
						fn.apply(instance, arguments);
					}
				});
			},

			/**
			 * Loop each parent node and execute the <code>fn</code> callback.
			 *
			 * @method eachChildren
			 * @param {function} fn callback
			 */
			eachParent: function(fn) {
				var instance = this;
				var parentNode = instance.get(PARENT_NODE);

				while (parentNode) {
					if (parentNode) {
						fn.apply(instance, [parentNode]);
					}
					parentNode = parentNode.get(PARENT_NODE);
				}
			},

			/**
			 * Bubble event to all parent nodes.
			 *
			 * @method bubbleEvent
			 * @param {String} eventType
			 * @param {Array} args
			 * @param {boolean} cancelBubbling
			 * @param {boolean} stopActionPropagation
			 */
			bubbleEvent: function(eventType, args, cancelBubbling, stopActionPropagation) {
				var instance = this;

				// event.stopActionPropagation == undefined, invoke the event native action
				instance.fire(eventType, args);

				if (!cancelBubbling) {
					var parentNode = instance.get(PARENT_NODE);

					// Avoid execution of the native action (private methods) while propagate
					// for example: private _appendChild() is invoked only on the first level of the bubbling
					// the intention is only invoke the user callback on parent nodes.
					args = args || {};

					if (isUndefined(stopActionPropagation)) {
						stopActionPropagation = true;
					}

					args.stopActionPropagation = stopActionPropagation;

					while(parentNode) {
						parentNode.fire(eventType, args);
						parentNode = parentNode.get(PARENT_NODE);
					}
				}
			},

			/**
			 * Create a TreeNode instance.
			 *
			 * @method createNode
			 * @param {Object} options
			 * @return {TreeNode}
			 */
			createNode: function(options) {
				var instance = this;
				var classType = options.type;

				if (isString(classType) && A.TreeNode.nodeTypes) {
					classType = A.TreeNode.nodeTypes[classType];
				}

				if (!classType) {
					classType = A.TreeNode;
				}

				return new classType(options);
			},

			/**
			 * Append a child node to the TreeData.
			 *
			 * @method appendChild
			 * @param {TreeNode} node
			 * @param {boolean} cancelBubbling
			 */
			appendChild: function(node, cancelBubbling) {
				var instance = this;
				var output = instance.getEventOutputMap(node);

				instance.bubbleEvent('append', output, cancelBubbling);
			},

			/**
			 * Append a child node to the TreeData.
			 *
			 * @method _appendChild
			 * @param {TreeNode} node
			 * @param {boolean} cancelBubbling
			 * @protected
			 */
			_appendChild: function(event) {
				// stopActionPropagation while bubbling
				if (event.stopActionPropagation) {
					return false;
				}

				var instance = this;
				var node = event.tree.node;
				var ownerTree = instance.get(OWNER_TREE);
				var children = instance.get(CHILDREN);

				// updateReferences first
				instance.updateReferences(node, instance, ownerTree);
				// and then set the children, to have the appendChild propagation
				// the PARENT_NODE references should be updated
				var length = children.push(node);
				instance.set(CHILDREN, children);

				// updating prev/nextSibling attributes
				var prevIndex = length - 2;
				var prevSibling = instance.item(prevIndex);

				node.set(NEXT_SIBLING, null);
				node.set(PREV_SIBLING, prevSibling);

				instance.get(CONTAINER).append(
					node.get(BOUNDING_BOX)
				);

				// render node after it's appended
				node.render();
			},

			/**
			 * Get a TreeNode children by index.
			 *
			 * @method item
			 * @param {Number} index
			 * @return {TreeNode}
			 */
			item: function(index) {
				var instance = this;

				return instance.get(CHILDREN)[index];
			},

			/**
			 * Index of the passed TreeNode on the <a
		     * href="TreeData.html#config_children">children</a> attribute.
			 *
			 * @method indexOf
			 * @param {TreeNode} node
			 * @return {Number}
			 */
			indexOf: function(node) {
				var instance = this;

				return A.Array.indexOf( instance.get(CHILDREN), node );
			},

			/**
			 * Whether the TreeData contains children or not.
			 *
			 * @method hasChildNodes
			 * @return {boolean}
			 */
			hasChildNodes: function() {
				return ( this.get(CHILDREN).length > 0 );
			},

			/**
			 * Get an Array of the children nodes of the current TreeData.
			 *
			 * @method getChildren
			 * @param {boolean} deep
			 * @return {Array}
			 */
			getChildren: function(deep) {
				var instance = this;
				var cNodes = [];
				var children = instance.get(CHILDREN);

				cNodes = cNodes.concat(children);

				if (deep) {
					instance.eachChildren(function(child) {
						cNodes = cNodes.concat( child.getChildren(deep) );
					});
				}

				return cNodes;
			},

			/**
			 * Get an object containing metadata for the custom events.
			 *
			 * @method getEventOutputMap
			 * @param {TreeData} node
			 * @return {Object}
			 */
			getEventOutputMap: function(node) {
				var instance = this;

				return {
					tree: {
						instance: instance,
						node: node || instance
					}
				};
			},

			/**
			 * Remove the passed <code>node</code> from the current TreeData.
			 *
			 * @method removeChild
			 * @param {TreeData} node
			 */
			removeChild: function(node) {
				var instance = this;
				var output = instance.getEventOutputMap(node);

				instance.bubbleEvent('remove', output);
			},

			/**
			 * Remove the passed <code>node</code> from the current TreeData.
			 *
			 * @method _removeChild
			 * @param {TreeData} node
			 */
			_removeChild: function(event) {
				// stopActionPropagation while bubbling
				if (event.stopActionPropagation) {
					return false;
				}

				var instance = this;
				var node = event.tree.node;
				var ownerTree = instance.get(OWNER_TREE);

				if (instance.isRegistered(node)) {
					// update parent reference when removed
					node.set(PARENT_NODE, null);

					// unregister the node
					instance.unregisterNode(node);

					// no parent, no ownerTree
					node.set(OWNER_TREE, null);

					if (ownerTree) {
						// unregister the removed node from the tree index
						ownerTree.unregisterNode(node);
					}

					// remove child from the container
					node.get(BOUNDING_BOX).remove();

					var children = instance.get(CHILDREN);

					A.Array.removeItem(children, node);
					instance.set(CHILDREN, children);
				}
			},

			/**
			 * Delete all children of the current TreeData.
			 *
			 * @method empty
			 */
			empty: function() {
				var instance = this;

				instance.eachChildren(function(node) {
					var parentNode = node.get(PARENT_NODE);

					if (parentNode) {
						parentNode.removeChild(node);
					}
				});
			},

			/**
			 * Insert <code>treeNode</code> before or after the <code>refTreeNode</code>.
			 *
			 * @method insert
			 * @param {TreeNode} treeNode
			 * @param {TreeNode} refTreeNode
			 * @param {TreeNode} where 'before' or 'after'
			 */
			insert: function(treeNode, refTreeNode, where) {
				var instance = this;
				refTreeNode = refTreeNode || this;

				if (refTreeNode == treeNode) {
					return false; // NOTE: return
				}
				var refParentTreeNode = refTreeNode.get(PARENT_NODE);

				if (treeNode && refParentTreeNode) {
					var nodeBoundinBox = treeNode.get(BOUNDING_BOX);
					var refBoundinBox = refTreeNode.get(BOUNDING_BOX);
					var ownerTree = refTreeNode.get(OWNER_TREE);

					if (where == 'before') {
						refBoundinBox.placeBefore(nodeBoundinBox);
					}
					else if (where == 'after') {
						refBoundinBox.placeAfter(nodeBoundinBox);
					}

					var refSiblings = [];
					// using the YUI selector to regenerate the index based on the real dom
					// this avoid misscalculations on the nodes index number
					var DOMChildren = refParentTreeNode.get(BOUNDING_BOX).all('> ul > li');

					DOMChildren.each(function(child) {
						refSiblings.push( A.Widget.getByNode(child) );
					});

					// updating prev/nextSibling attributes
					treeNode.set(
						NEXT_SIBLING,
						A.Widget.getByNode( nodeBoundinBox.get(NEXT_SIBLING) )
					);
					treeNode.set(
						PREV_SIBLING,
						A.Widget.getByNode( nodeBoundinBox.get(PREVIOUS_SIBLING) )
					);

					// update all references
					refTreeNode.updateReferences(treeNode, refParentTreeNode, ownerTree);

					// updating refParentTreeNode childTreeNodes
					refParentTreeNode.set(CHILDREN, refSiblings);
				}

				// render treeNode after it's inserted
				treeNode.render();

				// invoking insert event
				var output = refTreeNode.getEventOutputMap(treeNode);

				output.tree.refTreeNode = refTreeNode;

				refTreeNode.bubbleEvent('insert', output);
			},

			/**
			 * Insert <code>treeNode</code> after the <code>refTreeNode</code>.
			 *
			 * @method insertAfter
			 * @param {TreeNode} treeNode
			 * @param {TreeNode} refTreeNode
			 */
			insertAfter: function(treeNode, refTreeNode) {
				refTreeNode.insert(treeNode, refTreeNode, 'after');
			},

			/**
			 * Insert <code>treeNode</code> before the <code>refTreeNode</code>.
			 *
			 * @method insertBefore
			 * @param {TreeNode} treeNode
			 * @param {TreeNode} refTreeNode
			 */
			insertBefore: function(treeNode, refTreeNode) {
				refTreeNode.insert(treeNode, refTreeNode, 'before');
			},

			/**
			 * Get a TreeNode instance by a child DOM Node.
			 *
			 * @method getNodeByChild
			 * @param {Node} child
			 * @return {TreeNode}
			 */
			getNodeByChild: function(child) {
				var instance = this;
				var treeNodeEl = child.ancestor(DOT+CSS_TREE_NODE);

				if (treeNodeEl) {
					return instance.getNodeById( treeNodeEl.attr(ID) );
				}

				return null;
			},

			/**
			 * Setter for <a href="TreeData.html#config_children">children</a>.
			 *
			 * @method _setChildren
			 * @protected
			 * @param {Array} v
			 * @return {Array}
			 */
			_setChildren: function(v) {
				var instance = this;
				var childNodes = [];

				A.Array.each(v, function(node) {
					if (node) {
						if (!isTreeNode(node) && isObject(node)) {
							// creating node from json
							node = instance.createNode(node);
						}

						// before render the node, make sure the PARENT_NODE and OWNER_TREE references are updated
						// this is required on the render phase of the TreeNode (_createNodeContainer)
						// to propagate the events callback (appendChild/expand)
						if (!isTreeNode(instance)) {
							node.set(OWNER_TREE, instance);
						}

						node.render();

						// avoid duplicated children on the childNodes list
						if (A.Array.indexOf(childNodes, node) == -1) {
							childNodes.push(node);
						}
					}
				});

				return childNodes;
			}
		}
	}
);

A.TreeData = TreeData;


}, 'gallery-2011.02.09-21-32' ,{skinnable:false, requires:['gallery-aui-base']});
