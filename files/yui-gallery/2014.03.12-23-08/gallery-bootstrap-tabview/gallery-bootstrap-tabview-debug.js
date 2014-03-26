YUI.add('gallery-bootstrap-tabview', function(Y) {

/**

This is a drop-in for the Twitter Bootstrap tabview, so you don't have to
schlep in jQuery.


@module gallery-bootstrap-tabview
**/

/**
This is a bootstrap compatible tabview. It mostly is an extension on top of
the standard TabView, except it redefines the selectors and classes to be
compatible with the TabView that Bootstrap uses.

See http://twitter.github.com/bootstrap/javascript.html#tabs for more
information.

You will need to include the Bootstrap CSS. This is only the JavaScript.

The interface aims to be completely compatible with Y.TabView. You can read
the documentation at http://yuilibrary.com/yui/docs/tabview/

@example

    var tabs = new Y.Bootstrap.Tabview({ node: '#tabs' });
    tabs.render();

@class Bootstrap.TabView
**/

var NS  = Y.namespace('Bootstrap'),
    DOT = '.',
    
    sub = Y.Lang.sub;

NS.TabView = Y.Base.create('bootstrapTabView', Y.TabviewBase, [ ], {
    _queries      : {
                        tabview      : DOT + 'nav-tabs',
                        tabviewList  : '> ul',
                        tab          : '> ul > li',
                        tabLabel     : '> ul > li > a ',
                        tabviewPanel : '> div',
                        tabPanel     : '> div > div',
                        selectedTab  : '> ul > ' + DOT + 'active',
                        selectedPanel: '> div ' + DOT + 'active'
                    },
    _classNames   : {
                        tabview       : 'nav-tabs',
                        tabviewList   : 'nav-tabs',
                        tabviewPanel  : 'tab-pane',
                        tab           : 'nav-tab',
                        selectedTab   : 'active',
                        selectedPanel : 'active'
                    },

    LIST_TEMPLATE : '<ul class="{tabviewList}"></ul>',
    PANEL_TEMPLATE: '<div class="{tabviewPanel}"></div>',

    _afterChildAdded: function(e) {
        this.get('contentBox').focusManager.refresh();
    },

    _defListNodeValueFn: function() {
        return Y.Node.create(sub(this.LIST_TEMPLATE, this._classNames));
    },

    _defPanelNodeValueFn: function() {
        return Y.Node.create(sub(this.PANEL_TEMPLATE, this._classNames));
    },

    _afterChildRemoved: function(e) { // update the selected tab when removed
        var i = e.index,
            selection = this.get('selection');

        if (!selection) { // select previous item if selection removed
            selection = this.item(i - 1) || this.item(0);
            if (selection) {
                selection.set('selected', 1);
            }
        }

        this.get('contentBox').focusManager.refresh();
    },

    _initAria: function() {
        var contentBox = this.get('contentBox'),
            tablist = contentBox.one(this._queries.tabviewList);

        if (tablist) {
            tablist.setAttrs({
                //'aria-labelledby': 
                role: 'tablist'
            });
        }
    },

    bindUI: function() {
        //  Use the Node Focus Manager to add keyboard support:
        //  Pressing the left and right arrow keys will move focus
        //  among each of the tabs.

        this.get('contentBox').plug(Y.Plugin.NodeFocusManager, {
                        descendants: DOT + this._classNames.tabLabel,
                        keys: { next: 'down:39', // Right arrow
                                previous: 'down:37' },  // Left arrow
                        circular: true
                    });

        this.after('render', this._setDefSelection);
        this.after('addChild', this._afterChildAdded);
        this.after('removeChild', this._afterChildRemoved);
    },
    
    renderUI: function() {
        var contentBox = this.get('contentBox'); 
        this._renderListBox(contentBox);
        this._renderPanelBox(contentBox);
        this._childrenContainer = this.get('listNode');
        this._renderTabs(contentBox);
    },

    initEvents: function() {
        // TODO: detach prefix for delegate?
        // this._node.delegate('tabview|' + this.tabEventName),
        this._node.delegate(this.tabEventName,
            this.onTabEvent,
            this._queries.tab,
            this
        );
    },

    initClassNames: function(index) {
        var queries    = this._queries,
            classNames = this._classNames;

        Y.Object.each(queries, function(query, name) {
            // this === tabview._node
            if (classNames[name]) {
                var result = this.all(query);
                
                if (index !== undefined) {
                    result = result.item(index);
                }

                if (result) {
                    result.addClass(classNames[name]);
                }
            }
        }, this._node);

        this._node.addClass(classNames.tabview);
    },

    onTabEvent: function(e) {
        e.preventDefault();
        var index = -1,
            node,
            href = e.target.get('href');

        if ( href && href.indexOf('#') >= 0 ) {
            node  = this._node.one(href.substr( href.indexOf('#')));
            index = this._node.all( this._queries.tabPanel ).indexOf(node);
        }

        if ( index === -1 ) {
            index = this._node.all(this._queries.tab).indexOf(e.currentTarget);
        }

        this._select( index );
    },

    _select: function(index) {
        var _queries = this._queries,
            _classNames = this._classNames,
            node = this._node,
            oldItem = node.one(_queries.selectedTab),
            oldContent = node.one(_queries.selectedPanel),
            newItem = node.all(_queries.tab).item(index),
            newContent = node.all(_queries.tabPanel).item(index);

        if (oldItem) {
            oldItem.removeClass(_classNames.selectedTab);
        }

        if (oldContent) {
            oldContent.removeClass(_classNames.selectedPanel);
            oldContent.removeClass('in');
        }

        if (newItem) {
            newItem.addClass(_classNames.selectedTab);
        }

        if (newContent) {
            newContent.addClass(_classNames.selectedPanel);
            newContent.addClass('in');
        }
    },

    _setDefSelection: function(contentBox) {
        //  If no tab is selected, select the first tab.
        var selection = this.get('selection') || this.item(0);

        this.some(function(tab) {
            if (tab.get('selected')) {
                selection = tab;
                return true;
            }
        });
        if (selection) {
            // TODO: why both needed? (via widgetParent/Child)?
            this.set('selection', selection);
            selection.set('selected', 1);
        }
    },

    _renderListBox: function(contentBox) {
        var node = this.get('listNode');
        if (!node.inDoc()) {
            contentBox.append(node);
        }
    },

    _renderPanelBox: function(contentBox) {
        var node = this.get('panelNode');
        if (!node.inDoc()) {
            contentBox.append(node);
        }
    },

    _renderTabs: function(contentBox) {
        var _queries = this._queries,
            _classNames = this._classNames,
            tabs = contentBox.all(_queries.tab),
            panelNode = this.get('panelNode'),
            panels = (panelNode) ? this.get('panelNode').get('children') : null,
            tabview = this;

        if (tabs) { // add classNames and fill in Tab fields from markup when possible
            tabs.addClass(_classNames.tab);
            contentBox.all(_queries.tabLabel).addClass(_classNames.tabLabel);
            contentBox.all(_queries.tabPanel).addClass(_classNames.tabPanel);

            tabs.each(function(node, i) {
                var panelNode = (panels) ? panels.item(i) : null;
                tabview.add({
                    boundingBox: node,
                    contentBox: node.one(DOT + _classNames.tabLabel),
                    label: node.one(DOT + _classNames.tabLabel).get('text'),
                    panelNode: panelNode
                });
            });
        }
    }
}, {
    ATTRS: {
        defaultChildType: {  
            value: 'Tab'
        },

        listNode: {
            setter: function(node) {
                node = Y.one(node);
                if (node) {
                    node.addClass(this._classNames.tabviewList);
                }
                return node;
            },

            valueFn: '_defListNodeValueFn'
        },

        panelNode: {
            setter: function(node) {
                node = Y.one(node);
                if (node) {
                    node.addClass(this._classNames.tabviewPanel);
                }
                return node;
            },

            valueFn: '_defPanelNodeValueFn'
        },

        tabIndex: {
            value: null
        }
    },

    HTML_PARSER: {
        listNode  : function(node) {
            return this.get('contentBox').one(this._queries.tabviewList);
        },
        panelNode : function() {
            return this.get('contentBox').one(this._queries.tabviewPanel);
        }
    }
});



}, 'gallery-2012.08.22-20-00' ,{requires:['tabview']});
