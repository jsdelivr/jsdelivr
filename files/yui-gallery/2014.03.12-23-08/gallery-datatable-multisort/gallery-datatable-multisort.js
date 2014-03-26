YUI.add('gallery-datatable-multisort', function(Y) {

/**
 * Plugs DataTable with Multi column sorting functionality.
 *
 * @module datatable
 * @submodule datatable-multisort
 */

/**
 * Adds column sorting to DataTable.
 * @class DataTableSort
 * @extends Plugin.Base
 */
var YgetClassName = Y.ClassNameManager.getClassName,

    DATATABLE = "datatable",
    COLUMN = "column",
    ASC = "asc",
    DESC = "desc",

    //TODO: Don't use hrefs - use tab/arrow/enter
    TEMPLATE = '<a class="{link_class}" title="{link_title}" href="{link_href}">{value}</a>';


function DataTableMultiSort() {
    DataTableMultiSort.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
Y.mix(DataTableMultiSort, {
    /**
     * The namespace for the plugin. This will be the property on the host which
     * references the plugin instance.
     *
     * @property NS
     * @type String
     * @static
     * @final
     * @value "multisort"
     */
    NS: "multisort",

    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "dataTableMultiSort"
     */
    NAME: "dataTableMultiSort",

/////////////////////////////////////////////////////////////////////////////
//
// ATTRIBUTES
//
/////////////////////////////////////////////////////////////////////////////
    ATTRS: {
        /**
        * @attribute trigger
        * @description Defines the trigger that causes a column to be sorted:
        * {event, selector}, where "event" is an event type and "selector" is
        * is a node query selector.
        * @type Object
        * @default {event:"click", selector:"th"}
        * @writeOnce "initOnly"
        */
        trigger: {
            value: {event:"click", selector:"th"},
            writeOnce: "initOnly"
        },
        
        /**
        * @attribute lastSortedBy
        * @description Describes last known sort state: {key,dir}, where
        * "key" is column key and "dir" is either "asc" or "desc".
        * @type Object
        */
        lastSortedBy: {
            setter: "_setLastSortedBy",
            lazyAdd: false
        },
        
        /**
        * @attribute template
        * @description Tokenized markup template for TH sort element.
        * @type String
        * @default '<a class="{link_class}" title="{link_title}" href="{link_href}">{value}</a>'
        */
        template: {
            value: TEMPLATE
        },

        /**
         * Strings used in the UI elements.
         *
         * The strings used are defaulted from the datatable-sort language pack
         * for the language identified in the YUI "lang" configuration (which
         * defaults to "en").
         *
         * Configurable strings are "sortBy" and "reverseSortBy", which are
         * assigned to the sort link's title attribute.
         *
         * @attribute strings
         * @type {Object}
         */
        strings: {
            valueFn: function () { return Y.Intl.get('datatable-multisort'); }
        }
    }
});

/////////////////////////////////////////////////////////////////////////////
//
// PROTOTYPE
//
/////////////////////////////////////////////////////////////////////////////
Y.extend(DataTableMultiSort, Y.Plugin.Base, {

    /////////////////////////////////////////////////////////////////////////////
    //
    // METHODS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * Initializer.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
        var dt = this.get("host"),
            trigger = this.get("trigger");
            
        dt.get("recordset").plug(Y.Plugin.RecordsetMultisort, {dt: dt});
        dt.get("recordset").multisort.addTarget(dt);
        
        // Wrap link around TH value
        this.doBefore("_createTheadThNode", this._beforeCreateTheadThNode);
        
        // Add class
        this.doBefore("_attachTheadThNode", this._beforeAttachTheadThNode);
        this.doBefore("_attachTbodyTdNode", this._beforeAttachTbodyTdNode);

        // Attach trigger handlers
        dt.delegate(trigger.event, Y.bind(this._onEventSortColumn,this), trigger.selector);

        // Attach UI hooks
        dt.after("recordsetMultisort:sort", function() {
            this._uiSetRecordset(this.get("recordset"));
        });
        this.on("lastSortedByChange", function(e) {
            this._uiSetLastSortedBy(e.prevVal, e.newVal, dt);
        });

        //TODO
        //dt.after("recordset:mutation", function() {//reset lastSortedBy});
        
        //TODO
        //add Column sortFn ATTR
        
        // Update UI after the fact (render-then-plug case)
        if(dt.get("rendered")) {
            dt._uiSetColumnset(dt.get("columnset"));
            this._uiSetLastSortedBy(null, this.get("lastSortedBy"), dt);
        }
    },

    /**
    * @method _setLastSortedBy
    * @description Normalizes lastSortedBy
    * @param val Array {key, dir}
    * @return Array {key, dir, notdir}
    * @private
    */
    _setLastSortedBy: function(val) {
        if (Y.Lang.isArray(val)) {
			for (var i = 0; i < val.length; i++)
                    val[i].notdir = (val[i].dir === "desc") ? "asc" : "desc";
					
            return val;
        } else {
			return null;
		}
    },
	
	/**
    * @method _getLastSortedByKey
    * @description Get the sort object for a key
    * @param key string 
    * @return Object {key, dir, notdir}
    * @private
    */
	_getLastSortedByKey: function(key) {
		var sortArray = this.get('lastSortedBy');
		for (var i = 0; sortArray && i < sortArray.length; i++) {
			if (sortArray[i].key == key) {
				return sortArray[i];
			}
		}
		
		return null;
	},

    /**
     * Updates sort UI.
     *
     * @method _uiSetLastSortedBy
     * @param val {Object} New lastSortedBy Array {key, dir}.
     * @param dt {Y.DataTable.Base} Host.
     * @protected
     */
    _uiSetLastSortedBy: function(prevVal, newVal, dt) {
        var strings    = this.get('strings'),
            columnset  = dt.get("columnset"),
            prevKey    = prevVal && prevVal.key,
            newKey     = newVal && newVal.key,
            prevClass  = prevVal && dt.getClassName(prevVal.dir),
            newClass   = newVal && dt.getClassName(newVal.dir),
            prevColumn = columnset.keyHash[prevKey],
            newColumn  = columnset.keyHash[newKey],
            tbodyNode  = dt._tbodyNode,
            fromTemplate = Y.Lang.sub,
            th, sortArrow, sortLabel;

        // Clear previous UI
		for (var i = 0; prevVal && i < prevVal.length; i++) {
			prevKey = prevVal[i].key,
			prevColumn = columnset.keyHash[prevKey],
			prevClass  = dt.getClassName(prevVal[i].dir);
			if (prevColumn && prevClass) {
				th = prevColumn.thNode;
				sortArrow = th.one('a');

				if (sortArrow) {
					sortArrow.set('title', fromTemplate(strings.sortBy, {
						column: prevColumn.get('label')
					}));
				}

				th.removeClass(prevClass);
				tbodyNode.all("." + YgetClassName(COLUMN, prevColumn.get("id")))
					.removeClass(prevClass);
			}
		}

        // Add new sort UI
		for (var i = 0; newVal && i < newVal.length; i++) {
			newKey = newVal[i].key,
			newColumn = columnset.keyHash[newKey],
			newClass  = dt.getClassName(newVal[i].dir);
			
			if (newColumn && newClass) {
				th = newColumn.thNode;
				sortArrow = th.one('a');

				if (sortArrow) {
					sortLabel = (newVal[i].dir === ASC) ? "reverseSortBy" : "sortBy";

					sortArrow.set('title', fromTemplate(strings[sortLabel], {
						column: newColumn.get('label')
					}));
				}

				th.addClass(newClass);

				tbodyNode.all("." + YgetClassName(COLUMN, newColumn.get("id")))
					.addClass(newClass);
			}
		}
    },

    /**
    * Before header cell element is created, inserts link markup around {value}.
    *
    * @method _beforeCreateTheadThNode
    * @param o {Object} {value, column, tr}.
    * @protected
    */
    _beforeCreateTheadThNode: function(o) {
        var sortedBy, sortLabel, sortArray;

        if (o.column.get("sortable")) {
			sortedBy = this._getLastSortedByKey(o.column.get('key'));
					
            sortLabel = (sortedBy && sortedBy.dir === ASC &&
                         sortedBy.key === o.column.get('key')) ?
                            "reverseSortBy" : "sortBy";

            o.value = Y.Lang.sub(this.get("template"), {
                link_class: o.link_class || "",
                link_title: Y.Lang.sub(this.get('strings.' + sortLabel), {
                                column: o.column.get('label')
                            }),
                link_href: "#",
                value: o.value
            });
        }
    },

    /**
    * Before header cell element is attached, sets applicable class names.
    *
    * @method _beforeAttachTheadThNode
    * @param o {Object} {value, column, tr}.
    * @protected
    */
    _beforeAttachTheadThNode: function(o) {
		var lastSortedBy = this._getLastSortedByKey(o.column.get('key'));
			
		var key = lastSortedBy && lastSortedBy.key,
            dir = lastSortedBy && lastSortedBy.dir,
            notdir = lastSortedBy && lastSortedBy.notdir;

        // This Column is sortable
        if(o.column.get("sortable")) {
            o.th.addClass(YgetClassName(DATATABLE, "sortable"));
        }
        // This Column is currently sorted
        if(key && (key === o.column.get("key"))) {
            o.th.replaceClass(YgetClassName(DATATABLE, notdir), YgetClassName(DATATABLE, dir));
        }
    },

    /**
    * Before header cell element is attached, sets applicable class names.
    *
    * @method _beforeAttachTbodyTdNode
    * @param o {Object} {record, column, tr, headers, classnames, value}.
    * @protected
    */
    _beforeAttachTbodyTdNode: function(o) {
        var lastSortedBy = this._getLastSortedByKey(o.column.get('key'));
			
		var key = lastSortedBy && lastSortedBy.key,
            dir = lastSortedBy && lastSortedBy.dir,
            notdir = lastSortedBy && lastSortedBy.notdir;

        // This Column is sortable
        if(o.column.get("sortable")) {
            o.td.addClass(YgetClassName(DATATABLE, "sortable"));
        }
        // This Column is currently sorted
        if(key && (key === o.column.get("key"))) {
            o.td.replaceClass(YgetClassName(DATATABLE, notdir), YgetClassName(DATATABLE, dir));
        }
    },
    /**
    * In response to the "trigger" event, sorts the underlying Recordset and
    * updates the lastSortedBy attribute.
    *
    * @method _onEventSortColumn
    * @param o {Object} {value, column, tr}.
    * @protected
    */
    _onEventSortColumn: function(e) {
        e.halt();
        //TODO: normalize e.currentTarget to TH
        var table  = this.get("host"),
            column = table.get("columnset").idHash[e.currentTarget.get("id")],
			lastSortedBy = [],
			recordsetSortArray = [],
            key, field, lastSort, desc, sorter;
 
		var sortArray = this.get("lastSortedBy");
		for (var i = 0; sortArray && i < sortArray.length; i++)
			if (sortArray[i].key == column.get('key')) {
				lastSort = sortArray[i];
			} else if (e.shiftKey) {
				recordsetSortArray.push({field: sortArray[i].key, desc: sortArray[i].dir === DESC});
				lastSortedBy.push({key: sortArray[i].key, dir: sortArray[i].dir});			
			}

        if (column.get("sortable")) {
            key       = column.get("key");
            field     = column.get("field");
            lastSort  = lastSort || {};
            desc      = (lastSort.key === key && lastSort.dir === ASC);
            sorter    = column.get("sortFn");

			
			recordsetSortArray.push({field: field, desc: desc});
			lastSortedBy.push({key: key, dir: (desc) ? DESC : ASC});
            table.get("recordset").multisort.sort(recordsetSortArray, sorter);

            this.set("lastSortedBy", lastSortedBy);
        }
    }
});

Y.namespace("Plugin").DataTableMultiSort = DataTableMultiSort;


}, 'gallery-2011.11.30-20-58' ,{lang:['en'], requires:['datatable-base', 'plugin', 'gallery-recordset-multisort'], skinnable:true});
