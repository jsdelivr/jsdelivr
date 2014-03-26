YUI.add('gallery-yui3treeview', function(Y) {

var getClassName = Y.ClassNameManager.getClassName,
        TREEVIEW = 'treeview',
        TREE = 'tree',
        TREELEAF = 'treeleaf',
        CONTENT_BOX = "contentBox",
        BOUNDING_BOX = "boundingBox",
        INNERHTML = "innerHTML",
        _instances = {},
        TRUE = true,
        FALSE = false,
        classNames = {
            loading : getClassName(TREEVIEW,'loading'),
            tree : getClassName(TREE),
            treeLabel : getClassName(TREEVIEW,"treelabel"),
            labelcontent : getClassName(TREEVIEW,'label-content'),
            treeview : getClassName(TREEVIEW),
            collapsed : getClassName(TREE,"collapsed"),
            leaf : getClassName(TREELEAF)
        };

        
/**
 * Treeview widget. Provides a tree style widget, with a hierachical representation of it's components.
 * It extends WidgetParent and WidgetChild, please refer to it's documentation for more info.   
 * @class TreeView
 * @constructor
 * @uses WidgetParent, WidgetChild
 * @extends Widget
 * @param {Object} config User configuration object.
 */
    Y.TreeView = Y.Base.create("treeview", Y.Widget, [Y.WidgetParent, Y.WidgetChild], {
        /**
         * Initializer lifecycle implementation for the Treeview class. 
         * <p>Registers the Treeview instance. It subscribes to the onParentChange 
         *    event which is triggered each time a new tree is added.</p>
         * <p>It publishes the toggleTreeState event, which gets fired everytime a node is
         *    collapsed/expanded</p>
         *
         * @method initializer
         * @public
         * @param  config {Object} Configuration object literal for the widget
         */
        initializer : function (config) {
            
            this.after('parentChange', this._onParentChange,this);
            this.publish('toggleTreeState', { 
                defaultFn: this._toggleTreeState
            });
            _instances[Y.stamp(this.get(BOUNDING_BOX))] = this;

        },
        
        /**
         * Flag to determine if the tree is being rendered from markup or not
         * @property _renderFromMarkup
         * @protected
         */ 
        _renderFromMarkup : FALSE,
        
        /**
         * It fires each time there is parent change. In this case, we use it to dinamically change
         * the boundingbox to be a semantic li rather than the default div.
         * It also does some rendering operations.
         * @method _onParentChange
         * @protected
         */
        _onParentChange : function () {
            var isTree = this.get("depth") > -1,
                tag = isTree ? "<li></li>" : "<div></div>",
                treeLabelHtml,
                boundingBox = this.get(BOUNDING_BOX),
                labelContainer,
                label,
                toggleControlHtml,
                treelabelClassName = this.getClassName("treelabel"),
                treeLabeltokens;
                
                //We get the anchor to retrieve the label, we add the classname
                if (this._renderFromMarkup) {
                    labelContainer = boundingBox.one(":first-child");
                    labelContainer.set("role","treeitem");
                    labelContainer.addClass(treelabelClassName);
                    label = labelContainer.get(INNERHTML);
                    toggleControlHtml = Y.substitute(this.EXPANDCONTROL_TEMPLATE,{labelcontentClassName:classNames.labelcontent, label : label});
                    labelContainer.set(INNERHTML,toggleControlHtml);
                    this.set("label",label);
                    this._renderFromMarkup = FALSE;
                } else {
                    label = this.get("label");
                    treeLabelHtml = Y.substitute(this.TREEVIEWLABEL_TEMPLATE, {treelabelClassName : treelabelClassName});
                    treeLabelHtml = Y.Node.create(treeLabelHtml);
                    toggleControlHtml = Y.substitute(this.EXPANDCONTROL_TEMPLATE,{labelcontentClassName:classNames.labelcontent, label : label});
                    treeLabelHtml.append(toggleControlHtml);
                    this._set(CONTENT_BOX,Y.Node.create("<ul></ul>"));
                    this._set(BOUNDING_BOX, Y.Node.create(tag));
                    boundingBox = this.get(BOUNDING_BOX).setContent(treeLabelHtml);
                    //Since we changed the boundigbox we need to update the _instance
                    _instances[Y.stamp(boundingBox)] = this;
                }
                
                boundingBox.set("role","presentation");
        },   
    
        CONTENT_TEMPLATE :  "<div></div>",
        
        BOUNDING_TEMPLATE : '<ul></ul>',
                              
        TREEVIEWLABEL_TEMPLATE : "<a class={treelabelClassName} role='treeitem' href='#'></a>",
        
        EXPANDCONTROL_TEMPLATE : "<span class={labelcontentClassName}>{label}</span>",
        
        /**
         * In charge of attaching events. 
         * Plugs the NodeFocusManager for keyboard support, add an event to handle collapse events
         * @method bindUI
         * @protected
         */
        bindUI: function() {
            var boundingBox,
                contentBox;
            
            if (this.isRoot()) {
                boundingBox = this.get(BOUNDING_BOX);
                contentBox = this.get(CONTENT_BOX);
                boundingBox.on("click",this.onViewEvents,this);
                boundingBox.on("keydown",this.onViewEvents,this);
                boundingBox.plug(Y.Plugin.NodeFocusManager, {
                    descendants: ".yui3-treeleaf-content, .yui3-treeview-treelabel",
                    keys: {
                        next: "down:40",    // Down arrow
                        previous: "down:38" // Up arrow 
                    },
                    circular: true
                });
            }
            
 
        }, 
    
    
        /**
         * Add class collapsed to all trees
         * @method renderUI
         * @protected
         */
        renderUI : function() {
            if (!this.isRoot()) {
                this.get(BOUNDING_BOX).addClass(classNames.collapsed);   
            }
            
            var src = this.get('srcNode'),
                items = this._items;
            
            if (items.length === 1 && (items[0] instanceof Y.TreeView)) {
              items[0].get(BOUNDING_BOX).addClass("yui3-singletree"); 
            }
        },
        
        /**
         * Toggles the collapsed/expanded class
         * @method _toggleTreeState
         * @protected
         */
        _toggleTreeState : function (target) {
            var tree = target.actionNode.ancestor('.'+classNames.treeview);   
            
            tree.toggleClass(classNames.collapsed);
        },
        
        /**
         * Collapse the tree
         * @method _collapseTree
         * @protected
         */
        _collapseTree: function (target) {
            var tree = target.ancestor('.'+classNames.treeview);   
            
            if (!tree.hasClass(classNames.collapsed)) {
                tree.toggleClass(classNames.collapsed);
            }
        },
        
        /**
         * Expands the tree
         * @method _expandTree
         * @protected
         */
        _expandTree : function (target) {
            var tree = target.ancestor('.'+classNames.treeview);   
            
            if (tree.hasClass(classNames.collapsed)) {
                tree.toggleClass(classNames.collapsed);
            }
        },
            
        /**
         * Handles all the internal treeview events. In this case, all it does it fires the
         * collaped/expand event when a treenode is clicked
         * @method onViewEvents
         * @protected
         */
        onViewEvents : function (event) {
            var target = event.target,
                keycode = event.keyCode,
                classes,
                className,
                i,
                cLength;
            
            classes = target.get("className").split(" ");
            cLength = classes.length;
            
            event.preventDefault();
            
            
            for (i=0;i<cLength;i++) {
                className = classes[i];
                switch (className) {
                    case classNames.labelcontent :
                        this.fire('toggleTreeState',{actionNode:target});
                        break;
                    case classNames.treeLabel :
                        if (keycode === 39) {
                            this._expandTree(target);
                        } else if (keycode === 37) {
                            this._collapseTree(target);
                        }
                        break;
                }
            }
        }
    }, 
        
        { 
            NAME : "treeview",
            ATTRS : {
                /**
                 * @attribute defaultChildType
                 * @type String
                 * @readOnly
                 * @default child type definition
                 */
                defaultChildType: {  
                    value: "TreeLeaf",
                    readOnly:TRUE
                },
                /**
                 * @attribute label
                 * @type Number
                 *
                 * @description TreeView node label 
                 */
                label : {
                    validator: Y.Lang.isString
                },
                /**
                 * @attribute index
                 * @type Number
                 * @readOnly
                 *
                 * @description Number representing the Widget's ordinal position in its 
                 * parent Widget.
                 */
                loadOnDemand : {
                    value : null
                }
            },
            HTML_PARSER: {
                
                children : function (srcNode) {
                    var leafs = srcNode.all("> li"),
                        isContained = srcNode.ancestor("ul"),
                        subTree,
                        children = [];
                        
                        
                        
                    if (leafs.size() > 0 || isContained) {
                        this._renderFromMarkup = true;
                    } else {
                        this.CONTENT_TEMPLATE = null;
                    }
                    
                    leafs.each(function(node) {
                        var 
                            leafContent = node.one(":first-child"),
                            child = {
                                srcNode : leafContent,
                                boundingBox :node,
                                contentBox : leafContent,
                                type : null
                            };
                            
                       subTree = node.one("> ul"); 
                        
                        if (subTree){
                            child.type = "TreeView";
                            child.contentBox = subTree;
                            child.srcNode = subTree;
                        }
                        
                        children.push(child);
                    });
                    return children;
                }      
            }
        }
    );
    
    /**
     * TreeLeaf widget. Default child type for TreeView.
     * It extends  WidgetChild, please refer to it's documentation for more info.   
     * @class TreeLeaf
     * @constructor
     * @uses WidgetChild
     * @extends Widget
     * @param {Object} config User configuration object.
     */
    Y.TreeLeaf = Y.Base.create("treeleaf", Y.Widget, [Y.WidgetChild], {

        
        CONTENT_TEMPLATE : "<span></span>",
        
        BOUNDING_TEMPLATE : "<li></li>",
        
        initializer : function () {
            _instances[Y.stamp(this.get(BOUNDING_BOX))] = this;
        },
        
        renderUI: function () {
            this.get(CONTENT_BOX).setContent(this.get("label"));
            this.get(BOUNDING_BOX).set("role","treeitem");
        }
    }, {
        NAME : "TreeLeaf",
        ATTRS : {
            label : {
                validator: Y.Lang.isString
            },
            tabIndex: {
                value: -1
            }        
        },
        HTML_PARSER: {
            label : function (srcNode) {
                return srcNode.get(INNERHTML);
            }      
        }        
    });


}, 'gallery-2011.01.03-18-30' ,{requires:['substitute', 'widget', 'widget-parent', 'widget-child', 'node-focusmanager']});
