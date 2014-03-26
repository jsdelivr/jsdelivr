YUI.add('gallery-inspector', function(Y) {

/**
 * Real-time attribute inspector widget.
 *
 * @module gallery-inspector
 * @class Inspector
 * @extends Widget
 * @uses WidgetStack
 * @constructor
 * @param {Object} config Configuration object.
 */

var Lang       = Y.Lang,
    Node       = Y.Node,
    Widget     = Y.Widget,
    YArray     = Y.Array,
    YObject    = Y.Object,
    
    // Lots of shorthands.
    BOUNDING_BOX  = 'boundingBox',
    CHECKED       = 'checked',
    COLLAPSED     = 'collapsed',
    CONTENT_BOX   = 'contentBox',
    DISPLAY       = 'display',
    EMPTY_STRING  = '',
    EXCLUDE       = 'exclude',
    FILTER        = 'filter',
    HEIGHT        = 'height',
    INCLUDE       = 'include',
    HOST          = 'host',
    HOST_ATTRS    = 'hostAttrs',
    NAME          = 'name',
    NONE          = 'none',
    OFFSET_HEIGHT = 'offsetHeight',
    PAUSED        = 'paused',
    STRINGS       = 'strings',
    TEXT_CONTENT  = 'textContent',
    VALUE         = 'value',
    
    TYPE_ARRAY     = 'array',
    TYPE_BOOLEAN   = 'boolean',
    TYPE_DATE      = 'date',
    TYPE_ERROR     = 'error',
    TYPE_FUNCTION  = 'function',
    TYPE_NULL      = 'null',
    TYPE_NUMBER    = 'number',
    TYPE_OBJECT    = 'object',
    TYPE_REGEXP    = 'regexp',
    TYPE_STRING    = 'string',
    TYPE_UNDEFINED = 'undefined',
    
    TYPE_DEFAULT = 'default',
    TYPE_YNODE   = 'node',
    
    _CLASS_COLLAPSED     = '_CLASS_COLLAPSED',
    _CLASS_EVEN          = '_CLASS_EVEN',
    _CLASS_FILTER        = '_CLASS_FILTER',
    _CLASS_NAME_CELL     = '_CLASS_NAME_CELL',
    _CLASS_ODD           = '_CLASS_ODD',
    _CLASS_VALUE         = '_CLASS_VALUE',
    _CLASS_VALUE_CELL    = '_CLASS_VALUE_CELL',
    _SELECTOR_COLLAPSE   = '_SELECTOR_COLLAPSE',
    _SELECTOR_FILTER     = '_SELECTOR_FILTER',
    _SELECTOR_NAME_CELL  = '_SELECTOR_NAME_CELL',
    _SELECTOR_PAUSE      = '_SELECTOR_PAUSE',
    _SELECTOR_VALUE_CELL = '_SELECTOR_VALUE_CELL',
    
    // For stacking multiple Inspector instances upon intitial render.
    INSTANCE_COUNT = 0,
    
    UI_SRC = Widget.UI_SRC,
    
    substitute = Y.substitute,
    
Inspector = Y.Base.create('inspector', Widget, [Y.WidgetStack], {
    
    // -- Public Lifecycle Methods ---------------------------------------------
    
    initializer: function (config) {
        INSTANCE_COUNT += 1;
        
        this._events     = [];
        this._hostEvents = [];
        this._attrNodes  = {};
        
        this[_CLASS_COLLAPSED]     = this.getClassName(COLLAPSED);
        this[_CLASS_EVEN]          = this.getClassName('even');
        this[_CLASS_FILTER]        = this.getClassName(FILTER);
        this[_CLASS_NAME_CELL]     = this.getClassName('name-cell');
        this[_CLASS_ODD]           = this.getClassName('odd');
        this[_CLASS_VALUE]         = this.getClassName(VALUE);
        this[_CLASS_VALUE_CELL]    = this.getClassName('value-cell');
        this[_SELECTOR_COLLAPSE]   = '.' + this.getClassName('collapse');
        this[_SELECTOR_FILTER]     = '.' + this[_CLASS_FILTER];
        this[_SELECTOR_NAME_CELL]  = '.' + this[_CLASS_NAME_CELL];
        this[_SELECTOR_PAUSE]      = '.' + this.getClassName('pause');
        this[_SELECTOR_VALUE_CELL] = '.' + this[_CLASS_VALUE_CELL];
    },
    
    destructor: function () {
        INSTANCE_COUNT -= 1;
        
        this._purgeEvents(this._events.concat(this._hostEvents));
        
        if (this._dd) {
            this._dd.destroy();
        }
    },
    
    renderUI: function () {
        this._renderHead();
        this._renderBody();
        this._renderFoot();
    },
    
    bindUI: function () {
        var contentBox = this.get(CONTENT_BOX),
            filterNode = contentBox.one(this[_SELECTOR_FILTER]);
        
        this._events.concat([
            this.get(HOST).after('destroyedChange',
                    this._afterHostDestroyedChange, this),
            
            contentBox.one(this[_SELECTOR_COLLAPSE]).on('click',
                    this._onCollapseClick, this),
            contentBox.one(this[_SELECTOR_PAUSE]).on('click',
                    this._onPauseClick, this),
            
            filterNode.on('valueChange', this._onFilter, this),
            filterNode.on('key', this._onFilterEscapeKey, 'up:27', this),
            
            this.after({
                collapsedChange: this._afterCollapsedChange,
                draggableChange: this._afterDraggableChange,
                hostAttrsChange: this._afterHostAttrsChange,
                excludeChange  : this._afterExcludeChange,
                filterChange   : this._afterFilterChange,
                includeChange  : this._afterIncludeChange,
                pausedChange   : this._afterPausedChange
            })
        ]);
    },
    
    syncUI: function () {
        this._uiSetCollapsed(this.get(COLLAPSED));
        this._uiSetDraggable(this.get('draggable'));
        this._uiSetFilter(this.get(FILTER));
        this._uiSetPaused(this.get(PAUSED));
        
        this._uiSetPosition();
        
        this._syncAttrs();
    },
    
    // -- Protected Prototype Methods ------------------------------------------
    
    /**
     * Sets up event handlers for host attribute value change events.
     *
     * @method _bindHostValueChangeEvents
     * @protected
     */
    _bindHostValueChangeEvents: function () {
        var attrs  = this.get(HOST_ATTRS),
            host   = this.get(HOST),
            events = [];
        
        YArray.each(attrs, function (name) {
            events.push(host.after(name + 'Change',
                    Y.bind(this._afterHostAttrValueChange, this, name)));
        }, this);
        
        this._hostEvents = events;
    },
    
    /**
     * Formats a value for display based on its type.
     *
     * @method _formatValue
     * @param {Any} value The value to format.
     * @protected
     */
    _formatValue: function (value) {
        var escapeHtml = Y.Escape.html,
            type       = Lang.type(value),
            subs;
        
        switch (type) {
        case TYPE_OBJECT:
            if (value instanceof Node) {
                type  = TYPE_YNODE;
                value = escapeHtml(value.toString().split(' ')[0]);
            }
            else if (value instanceof Boolean) {
                type  = TYPE_BOOLEAN;
                value = value.toString();
            }
            else if (value instanceof Number) {
                type  = TYPE_NUMBER;
                value = value.toString();
            }
            else if (value instanceof String) {
                type  = TYPE_STRING;
                value = '"' + escapeHtml(value.toString()) + '"';
            }
            else {
                // TODO: Support more objects
                value = '[object]';
            }
            break;
            
        case TYPE_ARRAY:
            // TODO: Support arrays
            value = '[array]';
            break;
            
        case TYPE_FUNCTION:
            // TODO: Support functions
            value = '[function]';
            break;
            
        case TYPE_BOOLEAN:
            value = value.toString();
            break;
            
        case TYPE_STRING:
            value = '"' + escapeHtml(value.toString()) + '"';
            break;
            
        case TYPE_NUMBER:
            value = escapeHtml(value.toString());
            break;
            
        case TYPE_NULL:
        case TYPE_UNDEFINED:
            value = type;
            break;
            
        case TYPE_ERROR:
        case TYPE_REGEXP:
            value = escapeHtml(value.toString());
            break;
        
        case TYPE_DATE:
            type  = TYPE_DATE;
            value = escapeHtml(value.toString());
            break;
            
        default:
            type  = TYPE_DEFAULT;
            value = escapeHtml(value.toString());
        }
        
        subs = {
            inspector_value_class: this[_CLASS_VALUE],
            inspector_type_class : this.getClassName('type-' + type),
            str_value         : value
        };
        
        return substitute(Inspector.VALUE_TEMPLATE, subs);
        
        // These old ideas might be useful for better array/object support.
        
        // if (Lang.isArray(value)) {
        //     YArray.each(value, function (v, i) {
        //         var tmp = this._formatValue(v, depth);
        //         
        //         if (tmp) {
        //             formattedValue += '<li><b>' + escape(i.toString()) + '</b> ' + tmp + '</li>';
        //         }
        //     }, this);
        // }
        // else if (Lang.isObject(value)) {
        //     YObject.each(value, function (v, k) {
        //         var tmp = this._formatValue(v, depth);
        //         
        //         if (tmp) {
        //             formattedValue += '<li><b>' + escape(k) + '</b> ' + tmp + '</li>';
        //         }
        //     }, this);
        // }
    },
    
    /**
     * Detaches all event handles in the given array.
     *
     * @method _purgeEvents
     * @param {Array} events Array of event handles.
     * @protected
     */
    _purgeEvents: function (events) {
        while (events && events.length) {
            events.pop().detach();
        }
    },
    
    /**
     * Renders a single row (name column only) for the given attribute name.
     *
     * @method _renderAttr
     * @param {String} name Attribute name.
     * @param {Number} i Index.
     * @protected
     */
    _renderAttr: function(name, i) {
        var guid        = Y.guid(),
            parityClass = i % 2 === 0 ? this[_CLASS_EVEN] : this[_CLASS_ODD],
            subs        = {
                inspector_row_parity_class: parityClass,
                inspector_name_cell_class : this[_CLASS_NAME_CELL],
                inspector_value_cell_class: this[_CLASS_VALUE_CELL],
                str_name: name,
                id_guid : guid
            },
            node  = Node.create(substitute(Inspector.ATTR_TEMPLATE, subs)),
            tbody = this._tbody;
            
        tbody.append(node);
        
        this._attrNodes[name] = tbody.one('#' + guid);
    },
    
    /**
     * Renders all rows (name column only) for all attributes.
     *
     * @method _renderAttrs
     * @protected
     */
    _renderAttrs: function () {
        var attrs = this.get(HOST_ATTRS).sort();
        
        this._tbody.empty(true);
        
        YArray.each(attrs, this._renderAttr, this);
    },
    
    /**
     * Renders the body section of the UI. Intended for use only during the
     * render lifecycle.
     *
     * @method _renderBody
     * @protected
     */
    _renderBody: function () {
        var contentBox = this.get(CONTENT_BOX),
            strings    = this.get(STRINGS),
            subs       = {
                str_name          : strings.name,
                str_value         : strings.value,
                inspector_bd_class: this.getClassName('bd')
            },
            body = Node.create(substitute(Inspector.BODY_TEMPLATE, subs));
        
        this._body  = body;
        this._tbody = body.one('tbody');
        
        contentBox.append(body);
    },
    
    /**
     * Renders the footer section of the UI. Intended for use only during the
     * render lifecycle.
     *
     * @method _renderFoot
     * @protected
     */
    _renderFoot: function () {
        var contentBox = this.get(CONTENT_BOX),
            strings    = this.get(STRINGS),
            subs       = {
                str_filter                 : strings.filter_attrs,
                str_pause                  : strings.pause,
                inspector_checkbox_class   : this.getClassName('checkbox'),
                inspector_controls_class   : this.getClassName('controls'),
                inspector_ft_class         : this.getClassName('ft'),
                inspector_pause_class      : this.getClassName('pause'),
                inspector_pause_label_class: this.getClassName('pause-label'),
                inspector_searchbox_class  : this[_CLASS_FILTER]
            };
        
        this._foot = Node.create(substitute(Inspector.FOOTER_TEMPLATE, subs));
        
        contentBox.append(this._foot);
    },
    
    /**
     * Renders the header section of the UI. Intended for use only during the
     * render lifecycle.
     *
     * @method _renderHead
     * @protected
     */
    _renderHead: function () {
        var contentBox = this.get(CONTENT_BOX),
            strings    = this.get(STRINGS),
            subs       = {
                str_collapse            : strings.collapse,
                str_name                : this.get(NAME),
                str_title               : strings.title,
                inspector_button_class  : this.getClassName('button'),
                inspector_collapse_class: this.getClassName('collapse'),
                inspector_hd_class      : this.getClassName('hd'),
                inspector_name_class    : this.getClassName(NAME),
                inspector_title_class   : this.getClassName('title')
            };

        this._head = Node.create(substitute(Inspector.HEADER_TEMPLATE, subs));

        contentBox.append(this._head);
    },
    
    /**
     * Syncs the host's attributes with the Inspector instance and applies any
     * <code>include</code> or <code>exclude</code> filters.
     *
     * @method _syncAttrs
     * @protected
     */
    _syncAttrs: function () {
        var host    = this.get(HOST),
            attrs   = host.getAttrs(),
            exclude = this.get(EXCLUDE),
            include = this.get(INCLUDE);
        
        YObject.each(attrs, function (value, name) {
            if (include.length && include.indexOf(name) === -1) {
                delete attrs[name];
            }
            else if (exclude.length && exclude.indexOf(name) !== -1) {
                delete attrs[name];
            }
        });
        
        this._set(HOST_ATTRS, YObject.keys(attrs));
    },
    
    // -- Protected UI Methods -------------------------------------------------
    
    /**
     * Filters visible attributes by the given filter value.
     *
     * @method _uiFilterAttrs
     * @param {String} value Filter value.
     * @protected
     */
    _uiFilterAttrs: function (value) {
        var selector = this[_SELECTOR_NAME_CELL],
            hide     = [],
            show     = [],
            cell;
            
        YObject.each(this._attrNodes, function (node) {
            if (value) {
                cell = node.one(selector);
                
                if (cell.get(TEXT_CONTENT).indexOf(value) !== -1) {
                    show.push(node);
                }
                else {
                    hide.push(node);
                }
            }
            else {
                show.push(node);
            }
        });
        
        Y.all(hide).setStyle(DISPLAY, NONE);
        Y.all(show).setStyle(DISPLAY, EMPTY_STRING);
    },
    
    /**
     * Sets the host destroyed state in the UI.
     *
     * @method _uiSetHostDestroyed
     * @protected
     */
    _uiSetHostDestroyed: function () {
        var node = this._head.one('.' + this.getClassName(NAME));
        
        if (node) {
            node.addClass(this.getClassName('destroyed'));
        }
    },
    
    /**
     * Sets the value for the given attribute name.
     *
     * @method _uiSetAttrValue
     * @param {String} name Attribute name.
     * @param {Any} value Attribute value.
     * @protected
     */
    _uiSetAttrValue: function(name, value) {
        var node = this._attrNodes[name],
            cell = node.one(this[_SELECTOR_VALUE_CELL]);
        
        cell.setContent(this._formatValue(value));
    },
    
    /**
     * Sets the value for all attributes.
     *
     * @method _uiSetAttrValues
     * @protected
     */
    _uiSetAttrValues: function () {
        var host  = this.get(HOST),
            attrs = this.get(HOST_ATTRS);
        
        YArray.each(attrs, function (name) {
            this._uiSetAttrValue(name, host.get(name));
        }, this);
    },
    
    /**
     * Sets the height of the UI. Sets the body height to the specified height
     * minus the combined heights of the header and footer. Overrides
     * <code>Widget.prototype._uiSetHeight</code>.
     *
     * @method _uiSetHeight
     * @param {Number} height Height.
     * @protected
     */
    _uiSetHeight: function (height) {
        Inspector.superclass._uiSetHeight.apply(this, arguments);

        if (this._head && this._foot) {
            height = this.get(BOUNDING_BOX).get(OFFSET_HEIGHT) -
                    this._head.get(OFFSET_HEIGHT) -
                    this._foot.get(OFFSET_HEIGHT);
                    
            this._body.setStyle(HEIGHT, height - 2 + 'px');
        }
    },
    
    /**
     * Sets the UI collapsed state.
     *
     * @method _uiSetCollapsed
     * @param {Boolean} collapsed Whether the UI should be collapsed.
     * @protected
     */
    _uiSetCollapsed : function (collapsed) {
        var boundingBox = this.get(BOUNDING_BOX),
            button      = this._head.one(this[_SELECTOR_COLLAPSE]),
            buttonText, height, method;
            
        if (collapsed) {
            buttonText = this.get(STRINGS + '.expand');
            height     = this._head.get(OFFSET_HEIGHT);
            method     = 'addClass';
        }
        else {
            buttonText = this.get(STRINGS + '.collapse');
            height     = this.get(HEIGHT);
            method     = 'removeClass';
        }
        
        boundingBox[method](this[_CLASS_COLLAPSED]);
        button.setContent(buttonText);
        
        this._uiSetHeight(height);
    },
    
    /**
     * Sets the UI draggable state.
     *
     * @method _uiSetDraggable
     * @param {Boolean} draggable Whether the UI should be draggable.
     * @protected
     */
    _uiSetDraggable: function (draggable) {
        if (this._dd) {
            this._dd.set('lock', !draggable);
        }
        else if (draggable) {
            this._dd = new Y.DD.Drag({
                node   : this.get(BOUNDING_BOX),
                handles: ['.' + this.getClassName('hd')]
            }).plug(Y.Plugin.DDConstrained);
        }
    },
    
    /**
     * Sets the UI filter input witht the given filter value.
     *
     * @method _uiSetFilter
     * @param {String} value Filter value.
     * @protected
     */
    _uiSetFilter: function (value) {
        var node = this._foot.one(this[_SELECTOR_FILTER]);
        
        if (node) {
            node.set(VALUE, value);
        }
    },
    
    /**
     * Sets the UI paused state.
     *
     * @method _uiSetPaused
     * @param {Boolean} paused Whether the UI should be paused.
     * @protected
     */
    _uiSetPaused : function (paused) {
        var node = this._foot.one(this[_SELECTOR_PAUSE]);

        if (node) {
            node.set(CHECKED, paused);
        }
    },
    
    /**
     * Sets the UI position and zIndex, adjusting for the presence of other
     * Inspector instances, such that they appear to stack. Intended to be
     * called during the syncUI lifecycle event.
     *
     * @method _uiSetPosition
     * @protected
     */
    _uiSetPosition: function () {
        var boundingBox = this.get(BOUNDING_BOX),
            count       = INSTANCE_COUNT - 1,
            offset      = this._head.get(OFFSET_HEIGHT);
            
        boundingBox.setStyle('top', (count * offset) + 'px');
        
        this.set('zIndex', this.get('zIndex') + count);
    },
    
    /**
     * Mini lifecycle for updating all attributes. Purges existing host events,
     * re-renders all attributes, then binds new host events.
     *
     * @method _uiSyncAttrs
     * @protected
     */
    _uiSyncAttrs: function () {
        this._purgeEvents(this._hostEvents);
        
        this._renderAttrs();
        
        this._uiSetAttrValues();
        this._uiFilterAttrs(this.get(FILTER));
        
        this._bindHostValueChangeEvents();
    },
    
    // -- Protected Host Event Handlers ----------------------------------------
    
    /**
     * Handles <code>[attribute]Change</code> events on the host.
     *
     * @method _afterHostAttrValueChange
     * @param {String} name Attribute name.
     * @param {EventFacade} e
     * @protected
     */
    _afterHostAttrValueChange: function (name, e) {
        if (!this.get(PAUSED)) {
            this._uiSetAttrValue(name, e.newVal);
        }
    },
    
    /**
     * Handles <code>destroyedChange</code> events on the host.
     *
     * @method _afterHostDestroyedChange
     * @param {EventFacade} e
     * @protected
     */
    _afterHostDestroyedChange: function (e) {
        if (e.newVal) {
            this._uiSetHostDestroyed();
        }
    },
    
    // -- Protected Event Handlers ---------------------------------------------
    
    /**
     * Handles <code>collaspedChange</code> events.
     *
     * @method _afterCollapsedChange
     * @param {EventFacade} e
     * @protected
     */
    _afterCollapsedChange: function (e) {
        this._uiSetCollapsed(e.newVal);
    },
    
    /**
     * Handles <code>draggableChange</code> events.
     *
     * @method _afterDraggableChange
     * @param {EventFacade} e
     * @protected
     */
    _afterDraggableChange: function (e) {
        this._uiSetDraggable(e.newVal);
    },
    
    /**
     * Handles <code>excludeChange</code> events.
     *
     * @method _afterExcludeChange
     * @param {EventFacade} e
     * @protected
     */
    _afterExcludeChange: function (e) {
        this._syncAttrs();
    },
    
    /**
     * Handles <code>filterChange</code> events.
     *
     * @method _afterFilterChange
     * @param {EventFacade} e
     * @protected
     */
    _afterFilterChange: function (e) {
        var filter = e.newVal;
        
        if (e.src !== UI_SRC) {
            this._uiSetFilter(filter);
        }
        
        this._uiFilterAttrs(filter);
    },
    
    /**
     * Handles <code>hostAttrsChange</code> events.
     *
     * @method _afterHostAttrsChange
     * @param {EventFacade} e
     * @protected
     */
    _afterHostAttrsChange: function (e) {
        this._uiSyncAttrs();
    },
    
    /**
     * Handles <code>includeChange</code> events.
     *
     * @method _afterIncludeChange
     * @param {EventFacade} e
     * @protected
     */
    _afterIncludeChange: function (e) {
        this._syncAttrs();
    },
    
    /**
     * Handles <code>pausedChange</code> events.
     *
     * @method _afterPausedChange
     * @param {EventFacade} e
     * @protected
     */
    _afterPausedChange : function (e) {
        var paused = e.newVal;

        if (e.src !== UI_SRC) {
            this._uiSetPaused(paused);
        }
        
        if (!paused) {
            this._syncAttrs();
        }
    },
    
    /**
     * Handles <code>click</code> events on the collapse button.
     *
     * @method _onCollapseClick
     * @param {EventFacade} e
     * @protected
     */
    _onCollapseClick: function (e) {
        this.set(COLLAPSED, !this.get(COLLAPSED));
    },
    
    /**
     * Handles <code>click</code> events on the pause checkbox.
     *
     * @method _onPauseClick
     * @param {EventFacade} e
     * @protected
     */
    _onPauseClick: function (e) {
        this.set(PAUSED, e.target.get(CHECKED), {src: UI_SRC});
    },
    
    /**
     * Handles <code>valueChange</code> events on the filter input.
     *
     * @method _onFilter
     * @param {EventFacade} e
     * @protected
     */
    _onFilter: function (e) {
        this.set(FILTER, e.newVal);
    },
    
    /**
     * Handles <code>esc</code> <code>keyUp</code> events on the filter input.
     *
     * @method _onFilterEscapeKey
     * @param {EventFacade} e
     * @protected
     */
    _onFilterEscapeKey: function (e) {
        this.set(FILTER, null);
    }
},
{
    ATTRS: {
        /**
         * If <code>true</code>, Inspector will initially render collapsed.
         *
         * @attribute collapsed
         * @type Boolean
         * @default false
         */
        collapsed: {
            value    : false,
            validator: Lang.isBoolean
        },
        
        /**
         * If <code>true</code> Inspector will be draggable, with the header
         * node as the drag handle.
         *
         * @attribute draggable
         * @type Boolean
         * @default true
         */
        draggable: {
            value    : true,
            validator: Lang.isBoolean
        },
        
        /**
         * Array of attribute names to exclude from being displayed.
         *
         * @attribute exclude
         * @type Array
         */
        exclude: {
            value    : [],
            validator: Lang.isArray
        },
        
        /**
         * Filter text value.
         *
         * @attribute filter
         * @type String
         */
        filter: {
            value: ''
        },
        
        // The "height" attribute is documented in Widget.
        height: {
            value: '300px'
        },
        
        /**
         * The object to inspect.
         *
         * @attribute host
         * @type Object
         * @writeonce
         */
        host: {
            value    : null,
            writeOnce: 'initOnly',
            validator: function (v) {
                return v instanceof Y.Base;
            }
        },
        
        /**
         * Name/value pairs of the host object's attributes.
         *
         * @attribute hostAttrs
         * @type Object
         * @readonly
         */
        hostAttrs: {
            value   : {},
            readOnly: true
        },
        
        /**
         * Array of attribute names to include. Opposite of, and overrides
         * <code>exclude</code>.
         *
         * @attribute include
         * @type Array
         */
        include: {
            value    : [],
            validator: Lang.isArray
        },
        
        /**
         * Display name of the Inspector instance. If not specified, the host
         * object's <code>name</code> property will be used if present.
         *
         * @attribute name
         * @type String
         * @writeonce
         */
        name: {
            value    : null,
            writeOnce: 'initOnly',
            getter   : function (value) {
                var host, name;
                
                if (value) {
                    name = value;
                }
                else {
                    host = this.get(HOST);
                    name = host.name ? host.name : '[No name]';
                }
                
                return name;
            }
        },
        
        /**
         * If <code>true</code>, Inspector will intitally be paused.
         *
         * @attribute paused
         * @type Boolean
         * @default false
         */
        paused: {
            value: false,
            validator : Lang.isBoolean
        },
        
        /**
         * Translatable strings used by Inspector.
         *
         * @attribute strings
         * @type Object
         */
        strings: {
            valueFn: function () {
                // return Y.Intl.get('gallery-inspector');
                return {
                    collapse    : 'Collapse',
                    expand      : 'Expand',
                    filter_attrs: 'Filter attributes',
                    name        : 'Name',
                    pause       : 'Pause',
                    title       : 'Inspector',
                    value       : 'Value'
                };
            }
        },
        
        // The "width" attribute is documented in Widget.
        width: {
            value: '275px'
        }
        
        // The "zIndex" attribute is documented in WidgetStack.
    },
    
    CSS_PREFIX: Y.ClassNameManager.getClassName('inspector'),
    
    BODY_TEMPLATE:
        '<div class="{inspector_bd_class}">' +
            '<table>' +
                '<thead>' +
                    '<tr>' +
                        '<th scope="col">{str_name}</th>' +
                        '<th scope="col">{str_value}</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody></tbody>' +
            '</table>' +
        '</div>',
    
    FOOTER_TEMPLATE:
        '<div class="{inspector_ft_class}">' +
            '<div class="{inspector_controls_class}">' +
                '<label class="{inspector_pause_label_class}">' +
                    '<input type="checkbox" class="{inspector_checkbox_class} ' +
                        '{inspector_pause_class}" value="1">{str_pause}' +
                '</label>' +
                '<input type="search" class="{inspector_searchbox_class}"' +
                    'placeholder="{str_filter}"/>' +
            '</div>'+
        '</div>',
    
    HEADER_TEMPLATE:
        '<div class="{inspector_hd_class}">' +
            '<h4 class="{inspector_title_class}">{str_title}: ' +
                '<span class="{inspector_name_class}">{str_name}</span></h4>' +
            '<button type="button" class="' +
               '{inspector_button_class} {inspector_collapse_class}">{str_collapse}' +
           '</button>' +
        '</div>',
    
    ATTR_TEMPLATE:
        '<tr id="{id_guid}" class="{inspector_row_parity_class}">' +
            '<th class="{inspector_name_cell_class}" scope="row">{str_name}</th>' +
            '<td class="{inspector_value_cell_class}"></td>' +
        '</tr>',
            
    VALUE_TEMPLATE:
        '<span class="{inspector_value_class} {inspector_type_class}">' +
            '{str_value}' +
        '</span>'
});

Y.Inspector = Inspector;


}, 'gallery-2011.05.12-13-26' ,{requires:['dd-constrain', 'escape', 'event-key', 'event-valuechange', 'substitute', 'widget', 'widget-stack'], skinnable:true});
