YUI.add('gallery-yui3treeview-ng', function(Y) {


	var getClassName = Y.ClassNameManager.getClassName,
		BOUNDING_BOX = "boundingBox",
		CONTENT_BOX = "contentBox",
		TREEVIEW = "treeview",
		TREENODE = "treenode",
		CHECKBOXTREEVIEW = "checkboxtreeview",
		CHECKBOXTREENODE = "checkboxtreenode",
		classNames = {
			tree : getClassName(TREENODE),
			content : getClassName(TREENODE, "content"),
			label : getClassName(TREENODE, "label"),
			labelContent : getClassName(TREENODE, "label-content"),
			toggle : getClassName(TREENODE, "toggle-control"),
			collapsed : getClassName(TREENODE, "collapsed"),
			leaf : getClassName(TREENODE, "leaf"),
			lastnode : getClassName(TREENODE, "last"),
			checkbox : getClassName(CHECKBOXTREENODE, "checkbox")
		},
		checkStates = { // Check states for checkbox tree
			unchecked: 10,
			halfchecked: 20,
			checked: 30
		},
		checkStatesClasses = {
			10 : getClassName(CHECKBOXTREENODE, "checkbox-unchecked"),
			20 : getClassName(CHECKBOXTREENODE, "checkbox-halfchecked"),
			30 : getClassName(CHECKBOXTREENODE, "checkbox-checked")
		},
		findChildren;

/*
 * Used in HTML_PARSERs to find children of the current widget
 */
	findChildren = function (srcNode, selector) {
		var descendants = srcNode.all(selector),
			children = Array(),
			child;
			
			descendants.each(function(node) {
				child = {
					srcNode : node,
					boundingBox : node,
					contentBox : node.one("> ul")
				};
				children.push(child);
			});
			return children;
	};

/**
 * TreeView widget. Provides a tree style widget, with a hierachical representation of it's components.
 * It extends WidgetParent and WidgetChild, please refer to it's documentation for more info.   
 * This widget represents the root cotainer for TreeNode objects that build the actual tree structure. 
 * Therefore this widget will not usually have any visual representation. Its also responsible for handling node events.
 * @class TreeView
 * @constructor
 * @uses WidgetParent
 * @extends Widget
 * @param {Object} config User configuration object.
 */
	Y.TreeView = Y.Base.create(TREEVIEW, Y.Widget, [Y.WidgetParent], {

		CONTENT_TEMPLATE :  "<ul></ul>",

		initializer : function (config) {
			this.publish("nodeToggle", {
				defaultFn: this._nodeToggleDefaultFn
			});
			this.publish("nodeCollapse", {
				defaultFn: this._nodeCollapseDefaultFn
			});
			this.publish("nodeExpand", {
				defaultFn: this._nodeExpandDefaultFn
			});
			this.publish("nodeClick", {
				defaultFn: this._nodeClickDefaultFn
			});
		},

		/**
			* Default event handler for "nodeclick" event
			* @method _nodeClickDefaultFn
			* @protected
			*/
		_nodeClickDefaultFn: function(e) {
		},

		/**
			* Default event handler for "toggleTreeState" event
			* @method _nodeToggleDefaultFn
			* @protected
			*/
		_nodeToggleDefaultFn: function(e) {
			if (e.treenode.get("collapsed")) {
				this.fire("nodeExpand", {treenode: e.treenode});
			} else {
				this.fire("nodeCollapse", {treenode: e.treenode});
			}
		},

		/**
			* Default event handler for "collapse" event
			* @method _nodeCollapseDefaultFn
			* @protected
			*/
		_nodeCollapseDefaultFn: function(e) {
			e.treenode.collapse();
		},

		/**
			* Default event handler for "expand" event
			* @method _expandStateDefaultFn
			* @protected
			*/
		_nodeExpandDefaultFn: function(e) {
			e.treenode.expand();
		},

		/**
		 * Sets child event handlers
		 * @method _setChildEventHandlers
		 * @protected
		 */
		_setChildEventHandlers : function () {
			var parent;
			this.after("addChild", function(e) {
				parent = e.child.get("parent");
				if (e.child.get("isLast") && parent.size() > 1) {
					parent.item(e.child.get("index")-1)._unmarkLast();
				}
			});
			
			this.on("removeChild", function(e) {
				parent = e.child.get("parent");
				if ((parent.size() == 1) || e.child.get("index") === 0) {
					return;
				}
				if (e.child.get("isLast")) {
					parent.item(e.child.get("index")-1)._markLast();
				}
			});
		},
		
		/**
			* Handles internal tree click events
			* @method _onClickEvents
			* @protected
			*/
		_onClickEvents : function (event) {
			var target = event.target,
				twidget = Y.Widget.getByNode(target),
				toggle = false;
			
			event.preventDefault();
			
			twidget = Y.Widget.getByNode(target);
			if (!twidget instanceof Y.TreeNode) {
				return;
			}
			if (twidget.get("isLeaf")) {
				return;
			}
			
			Y.Array.each(target.get("className").split(" "), function(className) {
				switch (className) {
					case classNames.toggle:
						toggle = true;
						break;
					case classNames.labelContent:
						if (this.get("toggleOnLabelClick")) {
							toggle = true;
						}
						break;
				}
			}, this);

			if (toggle) {
				this.fire("nodeToggle", {treenode: twidget});
			}
		},
		
		/**
		 * Handles internal tree keyboard interaction
		 * @method _onKeyEvents
		 * @protected
		 */
		_onKeyEvents : function (event) {
			var target = event.target,
				twidget = Y.Widget.getByNode(target),
				keycode = event.keyCode,
				collapsed = twidget.get("collapsed");
				
			if (twidget.get("isLeaf")) {
				return;
			}
			
			if ( ((keycode == 39) && collapsed) || ((keycode == 37) && !collapsed) ) {
				this.fire("nodeToggle", {treenode: twidget});
			}			   
		},
							   
        bindUI : function() {
            var boundingBox = this.get(BOUNDING_BOX);
			boundingBox.on("click", this._onClickEvents, this);
			boundingBox.on("keypress", this._onKeyEvents, this);

			boundingBox.delegate("click", Y.bind(function(e) {
				var twidget = Y.Widget.getByNode(e.target);
				if (twidget instanceof Y.TreeNode) {
					this.fire("nodeclick", {treenode: twidget});
				}
			}, this), "."+classNames.label);
			
			this._setChildEventHandlers();
			
			boundingBox.plug(Y.Plugin.NodeFocusManager, {
				descendants: ".yui3-treenode-label",
				keys: {
					next: "down:40",    // Down arrow
					previous: "down:38" // Up arrow 
				},
				circular: false
			});
		}

	}, {
		
		NAME : TREEVIEW,
		ATTRS : {
			/**
			 * @attribute defaultChildType
			 * @type String
			 * @readOnly
			 * @default child type definition
			 */
			defaultChildType : {  
				value: "TreeNode",
				readOnly: true
			},
			/**
			 * @attribute toggleOnLabelClick
			 * @type Boolean
			 * @whether to toogle tree state on label clicks with addition to toggle control clicks
			 */
			toggleOnLabelClick : {
				value: true,
				validator: Y.Lang.isBoolean
			},
			/**
			 * @attribute startCollapsed
			 * @type Boolean
			 * @wither to render tree nodes expanded or collapsed by default
			 */
			startCollapsed : {
				value: true,
				validator: Y.Lang.isBoolean
			},
			/**
			 * @attribute loadOnDemand
			 * @type boolean
			 *
			 * @description Whether children of this node can be loaded on demand
			 * (when this tree node is expanded, for example).
			 * Use with gallery-yui3treeview-ng-datasource.
			 */
			loadOnDemand : {
				value: false,
				validator: Y.Lang.isBoolean
			}
		},
		HTML_PARSER : {
			children : function (srcNode) {
				return findChildren(srcNode, "> li");
			}
		}
	});

/**
 * TreeNode widget. Provides a tree style node widget.
 * It extends WidgetParent and WidgetChild, please refer to it's documentation for more info.   
 * @class TreeNode
 * @constructor
 * @uses WidgetParent, WidgetChild
 * @extends Widget
 * @param {Object} config User configuration object.
 */
	Y.TreeNode = Y.Base.create(TREENODE, Y.Widget, [Y.WidgetParent, Y.WidgetChild], {

		/**
		 * Flag to determine if the tree is being rendered from markup or not
		 * @property _renderFromMarkup
		 * @protected
		 */
		_renderFromMarkup : false,

		CONTENT_TEMPLATE :  "<ul></ul>",
		
		BOUNDING_TEMPLATE : "<li></li>",
								
		TREENODELABEL_TEMPLATE : "<a class={labelClassName} role='treeitem' href='#'></a>",
		TREENODELABELCONTENT_TEMPLATE : "<span class={labelContentClassName}>{label}</span>",
		
		TOGGLECONTROL_TEMPLATE : "<span class={toggleClassName}></span>",

		bindUI : function() {
			// Both TreeVew and TreeNode share the same child event handling
			Y.TreeView.prototype._setChildEventHandlers.apply(this, arguments);
		},
		
		/**
			* Renders TreeNode
			* @method renderUI
			* @protected
			*/
		renderUI : function() {
			var boundingBox = this.get(BOUNDING_BOX),
                treeLabel,
				treeLabelHTML,
				labelContent,
				labelContentHTML,
				toggleControlHTML,
				label,
				isLeaf;
				
			toggleControlHTML = Y.substitute(this.TOGGLECONTROL_TEMPLATE,{toggleClassName: classNames.toggle});
			isLeaf = this.get("isLeaf");
			
			if (this._renderFromMarkup) {
				treeLabel = boundingBox.one(":first-child");
				treeLabel.set("role", "treeitem");
				treeLabel.addClass(classNames.label);
				labelContent = treeLabel.removeChild(treeLabel.one(":first-child"));
				labelContent.addClass(classNames.labelContent);
			} else {
				label = this.get("label");

				treeLabelHTML = Y.substitute(this.TREENODELABEL_TEMPLATE, {labelClassName: classNames.label});
				labelContentHTML = Y.substitute(this.TREENODELABELCONTENT_TEMPLATE, {labelContentClassName: classNames.labelContent, label: label});
				labelContent = labelContentHTML;
				
				treeLabel = Y.Node.create(treeLabelHTML);
				boundingBox.prepend(treeLabel);
			}

			if (!isLeaf) {
				treeLabel.appendChild(toggleControlHTML).appendChild(labelContent);
			} else {
				treeLabel.append(labelContent);
			}

			boundingBox.set("role","presentation");

			if (!isLeaf) {
				if (this.get("root").get("startCollapsed")) {
					boundingBox.addClass(classNames.collapsed);   
				} else {
					if (this.size() === 0) { // Nodes (not leafs) without children should start in collapsed mode
						boundingBox.addClass(classNames.collapsed);   
					}
				}
			}

			if (isLeaf) {
				boundingBox.addClass(classNames.leaf);
			}
			
			if (this.get("isLast")) {
				this._markLast();
			}
		},

		/**
		 * Marks this node as the last one in list
		 * @method _markLast
		 * @protected
		 */
		_markLast : function() {
			this.get(BOUNDING_BOX).addClass(classNames.lastnode);
		},

		/**
		 * Unmarks this node as the last one in list
		 * @method _markLast
		 * @protected
		 */
		_unmarkLast : function() {
			this.get(BOUNDING_BOX).removeClass(classNames.lastnode);
		},
		
		/**
			* Collapse the tree
			* @method collapse
			*/
		collapse : function () {
			var boundingBox = this.get(BOUNDING_BOX);
			if (!boundingBox.hasClass(classNames.collapsed)) {
				boundingBox.toggleClass(classNames.collapsed);
			}
		},

		/**
			* Expands the tree
			* @method expand
			*/
		expand : function () {
			var boundingBox = this.get(BOUNDING_BOX);
			if (boundingBox.hasClass(classNames.collapsed)) {
				boundingBox.toggleClass(classNames.collapsed);
			}
		},

		/**
		 * Toggle current expaned/collapsed tree state
		 * @method toggleState
		 */
        toggleState : function () {
			this.get(BOUNDING_BOX).toggleClass(classNames.collapsed);
		},

		/**
		 * Returns breadcrumbs path of labels from root of the tree to this node (inclusive)
		 * @method path
		 * @param cfg {Object} An object literal with the following properties:
		 *     <dl>
		 *     <dt><code>labelAttr</code></dt>
		 *     <dd>Attribute name to use for node representation. Can be any attribute of TreeNode</dd>
		 *     <dt><code>reverse</code></dt>
		 *     <dd>Return breadcrumbs from the node to root instead of root to the node</dd>
		 *     </dl>
		 * @return {Array} array of node labels
		 */
		path : function(cfg) {
			var bc = Array(),
				node = this;
			if (!cfg) {
				cfg = {};
			}
			if (!cfg.labelAttr) {
				cfg.labelAttr = "label";
			}
			while (node && (node instanceof Y.TreeNode) ) {
				bc.unshift(node.get(cfg.labelAttr));
				node = node.get("parent");
			}
			if (cfg.reverse) {
				bc = bc.reverse();
			}
			return bc;
		},

		/**
			* Returns toggle control node
			* @method _getToggleControlNode
			* @protected
			*/
		_getToggleControlNode : function() {
			return this.get(BOUNDING_BOX).one("." + classNames.toggle);
		},
			
		/**
			* Returns label content node
			* @method _getLabelContentNode
			* @protected
			*/
		_getLabelContentNode : function() {
			return this.get(BOUNDING_BOX).one("." + classNames.labelContent);
		}

    }, { 
		NAME : TREENODE,
		ATTRS : {
			/**
				* @attribute defaultChildType
				* @type String
				* @readOnly
				* @description default child type definition
				*/
			defaultChildType : {  
				value: "TreeNode",
				readOnly: true
			},
			/**
				* @attribute label
				* @type String
				*
				* @description TreeNode node label 
				*/
			label : {
				validator: Y.Lang.isString,
				value: ""
			},
			/**
				* @attribute loadOnDemand
				* @type boolean
				*
				* @description Whether children of this node can be loaded on demand
				* (when this tree node is expanded, for example).
				* Use with gallery-yui3treeview-ng-datasource.
				*/
			loadOnDemand : {
				value: false,
				validator: Y.Lang.isBoolean
			},
			/**
				* @attribute collapsed
				* @type Boolean
				* @readOnly
				*
				* @description Represents current treenode state - whether its collapsed or extended
				*/
			collapsed : {
				value: null,
				getter: function() {
					return this.get(BOUNDING_BOX).hasClass(classNames.collapsed);
				},
				readOnly: true
			},
			/**
				* @attribute clabel
				* @type String
				*
				* @description Canonical label for the node. 
				* You can set it to anything you like and use later with your external tools.
				*/
			clabel : {
				value: "",
				validator: Y.Lang.isString
			},
			/**
				* @attribute nodeId
				* @type String
				*
				* @description Signifies id of this node.
				* You can set it to anything you like and use later with your external tools.
				*/
			nodeId : {
				value: "",
				validator: Y.Lang.isString
			},
			/**
				* @attribute isLeaf
				* @type Boolean
				*
				* @description Signifies whether this node is a leaf node.
				* Nodes with loadOnDemand set to true are not considered leafs.
				*/
			isLeaf : {
				value: null,
				getter: function() {
					return (this.size() > 0 ? false : true) && (!this.get("loadOnDemand"));
				},
				readOnly: true
			},
			/**
			 * @attribute isLast
			 * @type Boolean
			 *
			 * @description Signifies whether this node is the last child of its parent.
			 */
			isLast : {
				value: null,
				getter: function() {
					return (this.get("index") + 1 == this.get("parent").size());
				},
				readOnly: true
			}
		},
		HTML_PARSER: {
			children : function (srcNode) {
				return findChildren(srcNode, "> ul > li");
			},
			
			label : function(srcNode) {
				var labelContentNode = srcNode.one("> a > span");
				if (labelContentNode !== null) {
					this._renderFromMarkup = true;
					return labelContentNode.getContent();
				}
			}
		}
	});

/**
 * CheckBoxTreeView widget. Extrends TreeView widget to support relevant events and methods od checkbox tree.
 * This widget represents the root cotainer for CheckBoxTreeNode objects that build the actual tree structure. 
 * Therefore this widget will not usually have any visual representation. Its also responsible for handling node events.
 * @class CheckBoxTreeView
 * @constructor
 * @extends TreeView
 * @param {Object} config User configuration object.
 */
	Y.CheckBoxTreeView = Y.Base.create(CHECKBOXTREEVIEW, Y.TreeView, [], {
		
		initializer : function(config) {
			this.publish("check", {
				defaultFn: this._checkDefaultFn
			});
		},
		
		/**
		 * Default event handler for "check" event
		 * @method _nodeClickDefaultFn
		 * @protected
		 */
		_checkDefaultFn: function(e) {
			e.treenode.toggleCheckedState();
		},
		
		bindUI: function() {
			var boundingBox = this.get(BOUNDING_BOX);
			Y.CheckBoxTreeView.superclass.bindUI.apply(this, arguments);
			
			boundingBox.on("click", function(e) {
				var twidget = Y.Widget.getByNode(e.target),
					check = false;
				if (twidget instanceof Y.CheckBoxTreeNode) {
					Y.Array.each(e.target.get("className").split(" "), function (className) {
						switch (className) {
							case classNames.checkbox:
								check = true;
								break;
							case classNames.labelContent:
								if (this.get("checkOnLabelClick")) {
									check = true;
								}
								break;
						}
					}, this);
			
					if (check) {
						this.fire("check", {treenode: twidget});
					}
				}
			}, this);
			
			boundingBox.on("keypress", function(e) {
				var target = e.target,
					twidget = Y.Widget.getByNode(target),
					keycode = e.keyCode;
				
				if (!twidget instanceof Y.CheckBoxTreeNode) {
					return;
				}
				
				if (keycode == 32) {
					this.fire("check", {treenode: twidget});
					e.preventDefault();
				} 
			}, this);
		},

		/**
		 * Returns the list of nodes that are roots of checked subtrees
		 * @method getChecked
		 * @return {Array} array of tree nodes
		 */
		getChecked : function() {
			var checkedChildren = Array(),
				halfcheckedChildren = Array(),
				child,
				analyzeChild;
				
				this.each(function (child) {
					if (child.get("checked") == checkStates.checked) {
						checkedChildren.push(child);
					} else if (child.get("checked") == checkStates.halfchecked) {
						halfcheckedChildren.push(child);
					}
				});
				
				analyzeChild = function (child) {
					if (child.get("checked") == checkStates.checked) {
						checkedChildren.push(child);
					} else if (child.get("checked") == checkStates.halfchecked) {
						halfcheckedChildren.push(child);
					}
				};
				
				while (halfcheckedChildren.length > 0) {
					child = halfcheckedChildren.pop();
					child.each(analyzeChild);
				}
				return checkedChildren;   
		},
		
		/**
		 * Returns list of pathes (breadcrumbs) of nodes that are roots of checked subtrees
		 * @method getCheckedPaths
		 * @param cfg {Object} An object literal with the following properties:
		 *     <dl>
		 *     <dt><code>labelAttr</code></dt>
		 *     <dd>Attribute name to use for node representation. Can be any attribute of TreeNode</dd>
		 *     <dt><code>reverse</code></dt>
		 *     <dd>Return breadcrumbs from the node to root instead of root to the node</dd>
		 *     </dl>
		 * @return {Array} array of node label arrays
		 */
		getCheckedPaths : function(cfg) {
			var nodes = this.getChecked(),
			nodeArray = Array();
			
			if (!cfg) {
				cfg = {};
			}
			if (!cfg.labelAttr) {
				cfg.labelAttr = "label";
			}
			
			Y.Array.each(nodes, function(node) {
				nodeArray.push(node.path(cfg));
			});
			return nodeArray;
		}
		
	}, {
		NAME : CHECKBOXTREEVIEW,
		ATTRS : {
			/**
			 * @attribute defaultChildType
			 * @type String
			 * @readOnly
			 * @default child type definition
			 */
			defaultChildType : {  
				value: "CheckBoxTreeNode",
				readOnly: true
			},
			/**
			 * @attribute checkOnLabelClick
			 * @type Boolean
			 * @whether to change node checked state on label clicks with addition to checkbox control clicks
			 */
			checkOnLabelClick : {
				value: true,
				validator: Y.Lang.isBoolean
			}
		}
	});
	
/**
 * CheckBoxTreeNode widget. Provides a tree style node widget with checkbox
 * It extends Y.TreeNode, please refer to it's documentation for more info.   
 * @class CheckBoxTreeNode
 * @constructor
 * @extends Widget
 * @param {Object} config User configuration object.
 */
	Y.CheckBoxTreeNode = Y.Base.create(CHECKBOXTREENODE, Y.TreeNode, [], {
		
		initializer : function() {
			this.publish("childCheckedSateChange", {
				defaultFn: this._childCheckedSateChangeDefaultFn,
				bubbles: false
			});
		},
		
		/**
		* Default handler for childCheckedSateChange. Updates this parent state
		* to match current children states.
		* @method _childCheckedSateChangeDefaultFn
		* @protected
		*/
		_childCheckedSateChangeDefaultFn : function(e) {
			var checkedChildren = 0,
				halfCheckedChildren = 0,
				cstate;
			
			this.each(function(child) {
				cstate = child.get("checked");
				if (cstate == checkStates.checked) {
					checkedChildren++;
				}
				if (cstate == checkStates.halfchecked) {
					halfCheckedChildren++;
				}
			});
				
			if (checkedChildren == this.size()) {
				this.set("checked", checkStates.checked);
			} else if (checkedChildren > 0 || halfCheckedChildren > 0) {
				this.set("checked", checkStates.halfchecked);
			} else {
				this.set("checked", checkStates.unchecked);
			}
			
			if (!this.isRoot()) {
				this.get("parent").fire("childCheckedSateChange");
			}
		},
		
		bindUI : function() {
			Y.CheckBoxTreeNode.superclass.bindUI.apply(this, arguments);
			this.on("checkedChange", this._onCheckedChange);
		},
		
		/**
		* Event handler that updates UI according to checked attribute change
		* @method _onCheckedChange
		* @protected
		*/
		_onCheckedChange: function(e) {
			e.stopPropagation();
			this._updateCheckedStateUI(e.prevVal, e.newVal);
		},
		
		/**
		* Synchronize CSS classes to conform to checked state
		* @method _updateCheckedStateUI
		* @protected
		*/
		_updateCheckedStateUI : function(oldState, newState) {
			var checkBox = this._getCheckBoxNode();
			checkBox.removeClass(checkStatesClasses[oldState]);
			checkBox.addClass(checkStatesClasses[newState]);
		},
		
		/**
		* Returns checkbox node
		* @method _getCheckBoxNode
		* @protected
		*/
		_getCheckBoxNode : function() {
			return this.get(BOUNDING_BOX).one("." + classNames.checkbox);
		},
		
		CHECKBOX_TEMPLATE : "<span class={checkboxClassName}></span>",
		
		renderUI : function() {
			var parentNode,
			labelContentNode,
			checkboxNode;
			
			Y.CheckBoxTreeNode.superclass.renderUI.apply(this, arguments);
			
			checkboxNode = Y.Node.create(Y.substitute(this.CHECKBOX_TEMPLATE, {checkboxClassName: classNames.checkbox}));
			labelContentNode = this._getLabelContentNode();
			parentNode = labelContentNode.get("parentNode");
			labelContentNode.remove();
			checkboxNode.append(labelContentNode);
			parentNode.append(checkboxNode);
			
			// update state
			this._getCheckBoxNode().addClass(checkStatesClasses[this.get("checked")]);
			
			// reuse CSS
			this.get(CONTENT_BOX).addClass(classNames.content);
		},
		
		syncUI : function() {
			Y.CheckBoxTreeNode.superclass.syncUI.apply(this, arguments);
			this._syncChildren();
		},
		
		
		/**
		* Toggles checked / unchecked state of the node
		* @method toggleCheckedState
		*/
		toggleCheckedState : function() {
			if (this.get("checked") == checkStates.checked) {
				this._uncheck();
			} else {
				this._check();
			}
			this.get("parent").fire("childCheckedSateChange");
		},
		
		/**
		 * Sets this node as checked and propagates to children
		 * @method _check
		 * @protected
		 */
		_check : function() {
			this.set("checked", checkStates.checked);
			this.each(function(child) {
				child._check();
			});
		},
		
		/**
		 * Set this node as unchecked and propagates to children
		 * @method _uncheck
		 * @protected
		 */
		_uncheck : function() {
			this.set("checked", checkStates.unchecked);
			this.each(function(child) {
				child._uncheck();
			});
		},
		
		/**
		 * Synchronizes children states to match the state of the current node
		 * @method _uncheck
		 * @protected
		 */
		_syncChildren : function() {
			if (this.get("checked") == checkStates.unchecked) {
				this._uncheck();
			} else if (this.get("checked") == checkStates.checked) {
				this._check();
			} else {
				this.each(function (child) {
					child._syncChildren();
				});
			}
		}
		
	}, {
		NAME : CHECKBOXTREENODE,
		ATTRS : {
			/**
			* @attribute defaultChildType
			* @type String
			* @readOnly
			* @description default child type definition
			*/
			defaultChildType : {  
				value: "CheckBoxTreeNode",
				readOnly: true
			},
			/**
			* @attribute checked
			* @type {String|Number}
			* @description default child type definition. Accepts either <code>unchecked</code>, <code>halfchecked</code>, <code>checked</code>
			* or correspondingly 10, 20, 30.
			*/
			checked : {
				value : 10,
				setter : function(val) {
					var returnVal = Y.Attribute.INVALID_VALUE;
					if (checkStates[val] !== null) {
						returnVal = checkStates[val];
					} else if ([10, 20, 30].indexOf(val) >= 0) {
						returnVal = val;
					}
					return returnVal;
				}
			}
		}
	});


}, 'gallery-2012.08.29-20-10' ,{skinnable:true, requires:['substitute', 'widget', 'widget-parent', 'widget-child', 'node-focusmanager', 'array-extras']});
