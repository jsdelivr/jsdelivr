YUI.add('gallery-datatable-selection', function (Y, NAME) {

/**
 A class extension for DataTable that adds "highlight" and "select" actions via mouse selection.
 The extension works in either "cell" mode or "row" mode (set via attribute [selectionMode](#attr_selectionMode)).

 Highlighting is controlled by the [highlightMode](#attr_highlightMode) attribute (either "cell" or "row").
 (Highlighting provides a "mouseover" indication only), and a delegated "mouseover" event is defined in this module.

 Selection is provided via "click" listeners, by setting a delegated "click" handler on the TD or TR elements.

 This extension includes the ability to select "multiple" items, by setting the [selectionMulti](#attr_selectionMulti)
 attribute (enabled using browser multi-select click modifier, i.e. "Cmd" key on Mac OSX or "Ctrl" key on Windows / Linux).

 Additionally, a "range" selection capability is provided by using the browser range selector click key modifier,
 specifically the Shift key on most systems.

 The extension has been written to allow preserving the "selected" rows or cells during "sort" operations.  This is
 accomplished by storing the selected TR's basis record, specifically the "clientId" attribute which remains unique
 after sorting operations.

 Specific attributes are provided that can be read for current selections, including the ATTRS [selectedRows](#attr_selectedRows),
 and [selectedCells](#attr_selectedCells).

 Typical usage would be to set the "selectionMode" and "highlightMode" attributes (and selectionMulti if desired) and then
 to provide a positive control (like a BUTTON or A link) to process the selections.  Two events are provided,  [selection](#event_selection)
 and [selected](#event_selected) but these fire for every "click" action, which may not be ideal -- especially for multi selections.

 @module gallery-datatable-selection
 @class Y.DataTable.Selection
 @extends Y.DataTable
 @author Todd Smith
 @since 3.6.0
 **/
function DtSelection() {}

DtSelection.ATTRS = {
    /**
     * Node for the most recent "highlighted" item, either TD or TR
     * @attribute highlighted
     * @type {Node}
     * @default null
     */
    highlighted : {
        value:      null,
        validator:  function(v){ return (v instanceof Y.Node) || v === null; }
    },

    /**
     * Node for the most recent "selected" item, either TD or TR
     * @attribute selected
     * @type {Node}
     * @default null
     */
    selected:{
        value:      null,
        validator:  function(v){ return (v instanceof Y.Node) || v === null; }
    },

    /**
     * Set the current mode for highlighting, either for a single TD (as "cell") or for a
     * full TR (as "row") or "none" for no highlighting
     * @attribute highlightMode
     * @type {String}
     * @default 'none'
     */
    highlightMode:{
        value:      'none',
        setter:     '_setHighlightMode',
        validator:  function(v){
            if (!Y.Lang.isString(v)) {
                return false;
            }
            return (v === 'none' || v === 'cell' || v ==='row' ) ? true : false;
        }
    },

    /**
     * Set the current mode for indicating selections, either for a single TD (as "cell") or for a
     * full TR (as "row") or 'none' for no selection
     *
     * @attribute selectionMode
     * @type {String}
     * @default 'none'
     */
    selectionMode:{
        value:      'none',
        setter:     '_setSelectionMode',
        validator:  function(v){
            if (!Y.Lang.isString(v)) {
                return false;
            }
            return (v === 'none' || v === 'cell' || v ==='row' ) ? true : false;
        }
    },

    /**
     * Attribute that holds the selected TR's associated with either the selected "rows" or the
     *  TR's that are related to the selected "cells", duplicates are excluded.
     *
     * On input, accepts an Array of record indices for rows that should be set as "selected".
     * (Please refer to method [_setSelectedRows](#method__setSelectedRows))
     *
     *          dt.set('selectedRows',[ 1, 5, 9, 11]);
     *          // selects the 2nd, 6th, 10th and 12th records
     *
     * For reading this setting, it returns an Array of objects containing {tr,record,recordIndex} for each
     *  selected "row"; where "tr" is a Y.Node instance and "record" is the Model for the TR and "recordIndex" is the
     *  record index within the current dataset.
     * (Please refer to method [_getSelectedRows](#method__getSelectedRows))
     *
     * @attribute selectedRows
     * @type {Array}
     * @default []
     */
    selectedRows: {
        value:      [],
        validator:  Y.Lang.isArray,
        getter:     '_getSelectedRows',
        setter:     '_setSelectedRows'
    },

    /**
     * Attribute that holds the selected TD's associated with the selected "cells", or related to the
     *  selected "rows" if that is the `selectionMode`.
     *
     *  On input, an Array can be provided to pre-set as "selected" cells, defined as each element being
     *  in {record,column} format; where "record" is the record index (or clientId) and "column" is either
     *  the column index or the key/name for the column.
     *  (Please see method [_setSelectedCells](#method__setSelectedCells) for reference).
     *
     *          dt.set('selectedCells',[{record:0,column:'fname'}, {record:187,column:7} ]);
     *
     *  For reading the selected cells (via "get"), an array is returned with contains {Object} elements
     *  that describe the row / column combinations of each currently selected cell.
     *  (Please see method [_getSelectedCells](#method__getSelectedCells) for full information on the returned objects).
     *
     * @attribute selectedCells
     * @type {Array}
     * @default []
     */
    selectedCells: {
        value:      [],
        validator:  Y.Lang.isArray,
        setter:     '_setSelectedCells',
        getter:     '_getSelectedCells'
    },

    /**
     * Flag to allow either single "selections" (false) or multiple selections (true).
     * For Macintosh OSX-type systems the modifier key "Cmd" is held for multiple selections,
     *  and for Windows or Linux type systems the modifier key is "Ctrl".
     *
     * @attribute selectionMulti
     * @type {Boolean}
     * @default false
     */
    selectionMulti: {
        value:      false,
        validator:  Y.Lang.isBoolean
    }

};


Y.mix( DtSelection.prototype, {

    /**
     * @property _selections
     * @type Array
     * @default null
     * @static
     * @protected
     */
    _selections: null,

    /**
     * Holder for the classname for the "highlight" TR or TD
     * @property _classHighlight
     * @type String
     * @default null
     * @static
     * @protected
     */
    _classHighlight: null,

    /**
     * Holder for the classname for the "selected" TR or TD
     * @property _classSelected
     * @type String
     * @default null
     * @static
     * @protected
     */
    _classSelected: null,

    /**
     * Holder for the most recent "click" event modifier keys from last click,
     *  used for assessing "multi" selections.
     *
     * Contains properties;  altKey, ctrlKey, shiftKey, metaKey, button and which
     *
     * Filled initially by .initializer and on each Table "click".
     *
     * @property _clickModifiers
     * @type Object
     * @default null
     * @static
     * @protected
     */
    _clickModifiers: null,

    /**
     * Holder for the event subscription handles so that this compoent can be destroyed
     *  by removing listeners
     *
     * @property _subscrSelectComp
     * @type Array of EventHandles
     * @default null
     * @static
     * @protected
     */
    _subscrSelectComp : null,

    /**
     * Holder for the event subscription handles so that this compoent can be destroyed
     *  by removing listeners
     *
     * @property _subscrSelect
     * @type EventHandle
     * @default null
     * @static
     * @protected
     */
    _subscrSelect : null,

    /**
     * Holder for the event subscription handles so that this compoent can be destroyed
     *  by removing listeners
     *
     * @property _subscrHighlight
     * @type EventHandle
     * @default null
     * @static
     * @protected
     */
    _subscrHighlight : null,


//------------------------------------------------------------------------------------------------------
//        L I F E C Y C L E    M E T H O D S
//------------------------------------------------------------------------------------------------------

    /**
     * Initializes and sets initial bindings for the datatable-selection module
     * @method initializer
     * @protected
     */
    initializer: function(){
        this._bindSelector();
    },

    /**
     * Destructor to clean up bindings.
     * @method destructor
     * @protected
     */
    destructor: function () {
        this._unbindSelector();
    },



//------------------------------------------------------------------------------------------------------
//        P U B L I C     M E T H O D S
//------------------------------------------------------------------------------------------------------

    /**
     * Method to enable the datatable-selection module
     * @method disableSelection
     * @public
     */
    enableSelection: function(){
        this.disableSelection();
        this._bindSelector();
    },

    /**
     * Method to disable the datatable-selection module (cleans up listeners and user interface).
     * @method disableSelection
     * @public
     */
    disableSelection: function(){
        this.clearAll();
        this._unbindSelector();
    },

    /**
     * Returns the Column object (from the original "columns") associated with the input TD Node.
     * @method getColumnByTd
     * @param {Node} cell Node of TD for which column object is desired
     * @return {Object} column The column object entry associated with the desired cell
     * @public
     */
    getColumnByTd:  function(cell){
        var colName = this.getColumnNameByTd(cell);
        return (colName) ? this.getColumn(colName) : null;
    },


    /**
     * Returns the column "key" or "name" string for the requested TD Node
     * @method getColumnNameByTd
     * @param {Node} cell Node of TD for which column name is desired
     * @return {String} colName Column name or key name
     * @public
     */
    getColumnNameByTd: function(cell){
        var classes = cell.get('className').split(" "),
            regCol  = new RegExp( this.getClassName('col') + '-(.*)'),
            colName;

        Y.Array.some(classes,function(item) {
            var colmatch =  item.match(regCol);
            if ( colmatch && Y.Lang.isArray(colmatch) && colmatch[1] ) {
                colName = colmatch[1];
                return true;
            }
        });

        return colName || null;
    },

    /**
     * Removes all "selected" classes from DataTable and resets internal selections counters and "selected" attribute.
     * @method clearSelections
     * @public
     */
    clearSelections: function(){
        this._selections = [];
        this.set('selected',null);
        this._clearAll(this._classSelected);
    },

    /**
     * Removes all "highlight" classes from DataTable and resets `highlighted` attribute.
     * @method clearHighlighted
     * @public
     */
    clearHighlighted: function(){
        this.set('highlighted',null);
        this._clearAll(this._classHighlight);
    },

    /**
     * Removes all highlighting and selections on the DataTable.
     * @method clearAll
     * @public
     */
    clearAll: function(){
        this.clearSelections();
        this.clearHighlighted();
    },

//------------------------------------------------------------------------------------------------------
//        P R I V A T E    M E T H O D S
//------------------------------------------------------------------------------------------------------

    /**
     * Sets listeners and initial class names required for this "datatable-selector" module
     *
     * Note:  Delegated "click" listeners are defined in _setSelectedMode and _setHightlightMode methods
     *
     * @method _bindSelector
     * @private
     */
    _bindSelector: function(){
        this._selections = [];
        this._subscrSelectComp = [];

        this._subscrSelectComp.push( this.on('highlightedChange',this._highlightChange) );
        this._subscrSelectComp.push( this.on('selectedChange',this._selectedChange) );

        // set CSS classes for highlighting and selected,
        //    currently as  ".yui3-datatable-sel-highlighted" and ".yui3-datatable-sel-selected"
        this._classHighlight = this.getClassName('sel','highlighted');
        this._classSelected  = this.getClassName('sel','selected');

        //
        //  These listeners are here solely for "sort" actions, to allow preserving the "selections"
        //   pre-sort and re-applying them after the TBODY has been sorted and displayed
        //
    //    this._subscrSelectComp.push( this.before('sort', this._beforeResetDataSelect) );
        this._subscrSelectComp.push( this.after('sort', this._afterResetDataSelect) );
    //        this._subscrSelectComp.push( this.data.before('*:reset', Y.bind('_beforeResetDataSelect', this) ) );
    //        this._subscrSelectComp.push( this.data.after('*:reset', Y.bind('_afterResetDataSelect', this) ) );

        // track click modifier keys from last click, this is the tempalte
        this._clickModifiers = {
            ctrlKey:null, altKey:null, metaKey:null, shiftKey:null, which:null, button:null
        };
    },

    /**
     * Cleans up listener event handlers and static properties.
     * @method _unbindSelector
     * @private
     */
    _unbindSelector: function(){

        // clear all current visual UI settings
        this._clearAll(this._classHighlight);
        this._clearAll(this._classSelected);

        // detach listener on DT "click" event
        if ( this._subscrSelect && this._subscrSelect.detach ) {
            this._subscrSelect.detach();
        }
        this._subscrSelect = null;

        // detach listener on DT "mouseenter" event
        if ( this._subscrHighlight && this._subscrHighlight.detach ) {
            this._subscrHighlight.detach();
        }
        this._subscrHighlight = null;

        // clear up other listeners set in bindSelector ...
        if ( this._subscrHighlight
            && this._subscrHighlight.detach ) {
                this._subscrHighlight.detach();
        }
        this._subscrHighlight = null;

        // Clear up the overall component listeners (array)
        Y.Array.each( this._subscrSelectComp,function(item){
            if (!item) {
                return;
            }

            if(Y.Lang.isArray(item)) {
                Y.Array.each(item,function(si){
                    si.detach();
                });
            } else if (item.detach) {
                item.detach();
            }
        });
        this._subscrSelectComp = null;

        // clean up static props set
        this._clickModifiers = null;
        this._selections = null;
        this._classHighlight = null;
        this._classSelected  = null;

    },

    /**
     * Method that updates the "highlighted" classes for the selection and unhighlights the prevVal
     * @method _highlightChange
     * @param o
     * @private
     */
    _highlightChange: function(o) {
        this._processNodeAction(o,'highlight',true);
        return;
    },

    /**
     * Method that updates the "selected" classes for the selection and un-selects the prevVal.
     * This method works with multiple selections (via ATTR `selectionMulti` true) by pushing
     * the current selection to the this._selections property.
     *
     * @method _selectedChange
     * @param o
     * @private
     */
    _selectedChange: function(o){
        // Evaluate a flag to determine whether previous selections should be cleared or "kept"
        var keepPrev, keepRange, tar, sobj;

        if ( Y.UA.os.search('macintosh') === 0 ) {
            keepPrev =  this.get('selectionMulti') === true && this._clickModifiers.metaKey === true;
        } else {
            keepPrev =  this.get('selectionMulti') === true && this._clickModifiers.ctrlKey === true;
        }

        keepRange = this.get('selectionMulti') === true && this._clickModifiers.shiftKey === true;

        // clear any SHIFT selected text first ...
        this._clearDOMSelection();

        // if not-multi mode and more than one selection, clear them first ...
        if ( !keepPrev && !keepRange && this._selections.length>1 ) {
            this.clearSelections();
        }

        if ( keepRange ) {

            this._processRange(o);

        }  else {

            // Process the action ... updating 'select' class
            tar = this._processNodeAction(o,'select', !keepPrev );

            if ( !keepPrev ) {
                this._selections = [];
            }

            if(this.get('selectionMode')==='row') {
                this._selections.push( this._selectTr(tar) );
            } else {
                this._selections.push( this._selectTd(tar) );
            }

        }

        this.fire('selected',{
            ochange: o,
            record: this.getRecord(o.newVal)
        });

        //
        //  Fire a generic "selection" event that returns selected data according to the current "selectionMode" setting
        //
        sobj = { selectionMode : this.get('selectionMode')  };

        if(this.get('selectionMode')==='cell') {
            sobj.cells = this.get('selectedCells');
        } else if (this.get('selectionMode')==='row') {
            sobj.rows = this.get('selectedRows');
        }

        this.fire('selection',sobj);
    },

    /**
     * Event that fires on every "select" action and returns the LAST SELECTED item, either a cell or a row.
     * Please see the event "selection" which provides a cumulative total of all selected items as opposed to
     * just the last item.   (Fired from method [_selectedChange](#method__selectedChange)
     *
     * @event selected
     * @param {Object} obj Return object
     * @param {Object} obj.ochange Change event object passed from attribute 'selected'
     * @param {Object} obj.record DataTable record (Y.Model) instance for the selection
     */

    /**
     * Event that fires on every DataTable "select" event, returns current selections, either cells or rows depending
     * on the current "selectionMode".  (Fired from method [_selectedChange](#method__selectedChange)
     *
     *
     * @event selection
     * @param {Object} obj Return object
     * @param {Object} obj.selectionMode Current setting of attribute [selectionMode](#attr_selectionMode)
     * @param {Object} obj.cells Returns the current setting of the attribute [selectedCells](#attr_selectedCells)
     * @param {Object} obj.rows Returns the current setting of the attribute [selectedRows](#attr_selectedRows)
     */


    /**
     * Called when a "range" selection is detected (i.e. SHIFT key held during click) that selects
     * a range of TD's or TR's (depending on [selectionMode](#attr_selectionMode) setting.
     *
     * @method _processRange
     * @param {Node} o Last clicked TD of range selection
     * @private
     */
    _processRange: function(o) {
        var tarNew  = o.newVal,
            tarPrev = o.prevVal || null,
            newRec, newRecI, newCol, newColI, prevRec, prevRecI, prevCol, prevColI, delCol, delRow,
            coldir, rowdir, cell, i, j, tr, sel;

        //
        //  Process through the first and last targets ...
        //
        if ( tarNew && tarPrev ) {
            newRec  = this.getRecord(tarNew);
            newRecI = this.data.indexOf(newRec);
            newCol  = this.getColumnNameByTd(tarNew);
            newColI = Y.Array.indexOf(this.get('columns'),this.getColumn(newCol));
            prevRec  = this.getRecord(tarPrev);
            prevRecI = this.data.indexOf(prevRec);
            prevCol  = this.getColumnNameByTd(tarPrev);
            prevColI = Y.Array.indexOf(this.get('columns'),this.getColumn(prevCol));

            // Calculate range offset ... delCol (horiz) and delRow (vertically)
            delCol = newColI - prevColI;
            delRow = newRecI - prevRecI;

            // if we have valid deltas, update the range cells.
            if ( delCol !== null && delRow !== null) {

                if (Y.Lang.isArray(this._selections) ) {
                    this.clearSelections();
                }

                // Select a range of CELLS (i.e. TD's) ...
                if ( this.get('selectionMode') === 'cell' ) {
                    coldir = (delCol<0) ? -1 : 1;
                    rowdir = (delRow<0) ? -1 : 1;
                    cell = tarPrev;

                    for(j=0; j<=Math.abs(delRow); j++) {
                        for(i=0; i<=Math.abs(delCol); i++) {
                            cell = this.getCell(tarPrev,[rowdir*(j),coldir*(i)]);
                            if (cell) {
                                cell.addClass(this._classSelected);
                                sel = this._selectTd(cell);
                                this._selections.push( sel );
                            }
                        }
                    }
                // Select a range of ROWS (i.e. TR's)
                } else if ( this.get('selectionMode') === 'row' ) {

                    rowdir = (delRow<0) ? -1 : 1;
                    tr = this.getRow(prevRecI);

                    for(j=0; j<=Math.abs(delRow); j++) {
                        tr = this.getRow(prevRecI+rowdir*(j));
                        if (tr) {
                            tr.addClass(this._classSelected);
                            sel = this._selectTr(tr);
                            this._selections.push( sel );
                        }
                    }

                }

            }

        }

    },


    /**
     * Returns the current settings of row selections, includes multiple selections.  If the
     * current `selectionMode` is "cell" mode, this function returns the unique "records" associated with
     * the selected cells.
     *
     * **Returned** `rows` {Array} of objects in format;
     * <ul>
     *   <li>`rows.tr` {Node} Node instance of the TR that was selected</li>
     *   <li>`rows.record` {Model} The Model associated with the data record for the selected TR</li>
     *   <li>`rows.recordIndex` {Integer} The record index of the selected TR within the current "data" set</li>
     *   <li>`rows.recordClientId {String} The record clientId attribute setting</li>
     * </ul>

     * @method _getSelectedRows
     * @return {Array} rows Array of selected "rows" as objects in {tr,record,recordIndex} format
     * @private
     */
    _getSelectedRows: function(){
        var trs  = [],
            rows = [],
            tr, rec;
        
        Y.Array.each(this._selections,function(item){
            if(!item || !item.recClient) {
                return;
            }

            tr  = this.getRow(item.recClient);

            // if and only if, it's a TR and not in "trs" array ... then add it
            if ( Y.Array.indexOf(trs,tr) === -1 ) {
                rec = this.data.getByClientId( item.recClient );
                trs.push( tr );
                rows.push({
                    tr:             tr,    // this is an OLD, stale TR from pre-sort
                    record:         rec,
                    recordIndex:    this.data.indexOf(rec),
                    recordClientId: item.recClient
                });
            }
        },this);
        return rows;
    },



    /**
     * Getter method that returns an Array of the selected cells in record/column coordinate format.
     * If rows or TR elements were selected, it adds all of the row's child TD's.
     *
     * **Returned** `cells` {Array} of objects in format;
     * <ul>
     *   <li>`cells.td` {Node} TD Node for this cell.</li>
     *   <li>`cells.record` {Model} Record for this cell as a Y.Model</li>
     *   <li>`cells.recordIndex` {Integer} Record index for this cell in the current "data" set</li>
     *   <li>`cells.column` {Object} Column for this cell defined in original "columns" DataTable attribute</li>
     *   <li>`cells.columnName` {String} Column name or key associated with this cell</li>
     *   <li>`cells.columnIndex` {Integer} Column index of the column, within the "columns" data</li>
     * </ul>
     *
     * @method _getSelectedCells
     * @return {Array} cells The selected cells in {record,recordIndex,column,columnName,columnIndex} format
     * @private
     */
    _getSelectedCells: function(){
        var cells = [],
            cols  = this.get('columns'),
            col, tr, rec;

        Y.Array.each(this._selections,function(item){
            if (!item) {
                return;
            }

            if ( item.td ) {
                col = this.getColumn(item.colName);
                tr  = item.tr;
                rec = this.data.getByClientId(item.recClient);

                cells.push({
                    td:          item.td,
                    record:      rec,
                    recordIndex: this.data.indexOf(rec),
                    recordClientId:  item.recClient,
                    column:      col,
                    columnName:  item.colName,
                    columnIndex: Y.Array.indexOf(cols,col)
                });
            } else if ( item.tr ) {
                tr = item.tr;
                rec = this.data.getByClientId(item.recClient);
                var tdNodes = tr.all("td");
                if ( tdNodes ) {
                    tdNodes.each(function(td){
                        col = this.getColumnByTd(td);
                        cells.push({
                            td:          td,
                            record:      rec,
                            recordIndex: this.data.indexOf(rec),
                            recordClientId:  item.recClient,
                            column:      col,
                            columnName:  col.key || col.name,
                            columnIndex: Y.Array.indexOf(cols,col)
                        });
                    },this);
                }
            }
        },this);
        return cells;
    },

    /**
     * Setter method for attribute `selectedCells` that takes an array of cells as input and sets them
     * as the current selected set with appropriate visual class.
     *
     * @method _setSelectedCells
     * @param {Array} val The desired cells to set as selected, in {record:,column:} format
     * @param {String|Number} val.record Record for this cell as either record index or record clientId
     * @param {String|Number} val.column Column for this cell as either the column index or "key" or "name"
     * @return {Array}
     * @private
     */
    _setSelectedCells: function(val){
        this._selections = [];
        if ( Y.Lang.isArray(val) && this.data.size() > val.length ) {
            Y.Array.each(val,function(item) {
                var row, col, td, ckey,sel;
                row = ( Y.Lang.isNumber(item.record) ||
                    typeof item.record ==='string') ? this.getRow( item.record ) : row;
                col = ( Y.Lang.isNumber(item.column) ||
                    typeof item.column ==='string' ) ? this.getColumn(item.column) : col;

                if ( row && col ) {
                    ckey = col.key || col.name;
                    if ( ckey ) {
                        td  = row.one('.'+this.getClassName('col')+'-'+ckey);
                        sel = this._selectTd(td);
                        if(sel) {
                            this._selections.push(sel);
                        }
                        td.addClass(this._classSelected);
                    }
                }

            },this);
        }
        return val;
    },


    /**
     * A setter method for attribute `selectedRows` that takes as input an array of desired DataTable
     * record indices to be "selected", clears existing selections and sets the "selected" records and
     * highlights the TR's
     *
     * @method _setSelectedRows
     * @param  {Array} val Array of record indices (or record "clientId") desired to be set as selected.
     * @return {Array} records Array of DataTable records (Y.Model) for each selection chosen
     * @private
     */
    _setSelectedRows: function(val){
        this._selections = [];
        if ( Y.Lang.isArray(val) && this.data.size() > val.length ) {
            Y.Array.each(val,function(item){
                var tr = this.getRow(item),
                    sel;
                if ( tr ) {
                    sel = this._selectTr(tr);
                    if(sel) {
                        this._selections.push( sel );
                    }
                    tr.addClass(this._classSelected);
                }
            },this);
        }
        return val;
    },


    /**
     * Method that returns a TD's "selection obj" expected for the _selections buffer
     * @method _selectTd
     * @param tar {Node}  A Node instance of TD to be prepared for selection
     * @return {Object} obj Returned object includes properties (td,tr,recClient,colName)
     * @private
     */
    _selectTd : function(tar){
        var rec,col,rtn=false;
        if(tar && tar.get('tagName').toLowerCase() === 'td') {
            rec = this.getRecord(tar.ancestor());
            col = this.getColumnByTd(tar);
            rtn = {
                td:        tar,
                tr:        tar.ancestor(),
                recClient: (rec) ? rec.get('clientId') : null,
                colName:   col.key || col.name || null
            };
        }
        return rtn;
    },

    /**
     * Method that returns a TR's "selection obj" expected for the _selections buffer
     * @method _selectTr
     * @param tar {Node}  A Node instance of TR to be prepared for selection
     * @return {Object} obj Returned object includes properties (tr,recClient)
     * @private
     */
    _selectTr : function(tar){
        var rec, rtn = false;
        if(tar && tar.get('tagName').toLowerCase() === 'tr') {
            rec = this.getRecord(tar);
            rtn = {
                tr:        tar,
                recClient: (rec) ? rec.get('clientId') : null
            };
        }
        return rtn;
    },


    /**
     * Method is fired AFTER a "reset" action takes place on the "data", usually related to a column sort.
     * This function reads the pre-sorted selections that were stored by  [_beforeResetDataSelect](#method__beforeResetDataSelect)
     * temporarily in this._selections.
     *
     * Depending upon the current "selectionMode", either post-sorted TBODY selections are re-applied, by determining either
     * the TR's (from the Model data) or the TD's (from the Model and Column Index data).
     *
     * @method _afterResetDataSelect
     * @private
     */
    _afterResetDataSelect: function() {
        if( !this._selections || this._selections.length === 0 ) {
            return;
        }
        var tr, td, buffer = [], colIndex, col,
            cols = this.get('columns');

        this._clearAll(this._classSelected);


        Y.Array.each(this._selections,function(item){
            if( this.get('selectionMode') === 'row' && item.recClient ) {
                // the "item" is a Model pushed prior to the "sort" action ...
                tr = this.getRow(item.recClient);
                if( tr ) {
                    buffer.push( this._selectTr(tr) );
                    tr.addClass(this._classSelected);
                }
            } else if (this.get('selectionMode') === 'cell' && item.recClient && item.colName ) {
                tr = this.getRow(item.recClient);
                col = this.getColumn(item.colName);
                colIndex = Y.Array.indexOf(cols,col);
                td = (tr && colIndex >= 0) ? tr.all("td").item(colIndex) : null;
                if(tr && td) {
                    buffer.push( this._selectTd(td) );
                    td.addClass(this._classSelected);
                }
            }
        },this);

        // swap out the temporary buffer, for the current selections ...
        this._selections = buffer;

    },

    /**
     * Method used to derive from the clicked selection, either the TR or TD of the selection, and
     * returns the current `selectionMode` or `highlightMode` Node (based on the setting of prefix).
     *
     * This method adds the required class, and if erasePrev is true, removes the class from the prior setting.
     *
     * @method _processNodeAction
     * @param {Object} o Attribute change event object
     * @param {String} prefix
     * @param {Boolean} erasePrev
     * @return {Node} node Returned target Y.Node, either TR or TD based upon current `selectionMode` or `highlightMode`
     * @private
     */
    _processNodeAction: function(o, prefix, erasePrev ){
        var tar = o.newVal,
            tarNew, tarPrev, modeName, className;

        if ( prefix === 'highlight') {
            modeName  = prefix + 'Mode';
            className = this._classHighlight;
        } else if ( prefix === 'select' ) {
            modeName  = 'selectionMode';
            className = this._classSelected;
        }

        if ( this.get(modeName) === "cell" ) {
            tarNew  = tar || null;
            tarPrev = o.prevVal || null;
        } else if ( this.get(modeName) === "row" ) {
            if ( tar ) {
                tarNew = (tar.get('tagName').search(/td/i) === 0 ) ? tar.ancestor('tr')
                    : ( tar.get('tagName').search(/tr/i) === 0 ) ? tar : null ;
            }
            tarPrev = o.prevVal;
            if (tarPrev) {
                tarPrev = (tarPrev.get('tagName').search(/td/i) === 0 ) ? tarPrev.ancestor('tr')
                    : ( tarPrev.get('tagName').search(/tr/i) === 0 ) ? tarPrev : null ;
            }
        }

        if ( tarPrev && erasePrev ) {
            tarPrev.removeClass(className);
        }

        if ( tarNew ) {
            tarNew.addClass(className);
        }

        return tarNew;
    },


    /**
     * Method removes the specified `type` CSS class from all nodes within the TBODY data node.
     * @method _clearAll
     * @param {String} type Class name to remove from all nodes attached to TBODY DATA
     * @private
     */
    _clearAll: function(type){
        var nodes = this.get('boundingBox').one("."+this.getClassName('data'));
        if ( nodes ) {
            nodes.all('.'+type).removeClass(type);
        }
    },

    /**
     * Setter for `highlightMode` attribute, removes prior event handle (if exists) and defines
     * a new delegated "mouseover" handler that updates the `highlighted` attribute.
     *
     * A change to this setting clears all prior highlighting.
     *
     * @method _setHighlightMode
     * @param val
     * @return {*}
     * @private
     */
    _setHighlightMode: function(val){
        if ( this._subscrHighlight ) {
            this._subscrHighlight.detach();
        }

        if(val==='none') {
            return;
        } else if (val.toLowerCase) {
            val = val.toLowerCase();
        }

        this._subscrHighlight = this.delegate("mouseover",function(e){
                var tar = e.currentTarget;
                this.set('highlighted',tar);
            },"tr td",this);

        //this._clearAll(this._classHighlight);
        this.clearHighlighted();
        return val;
    },

    /**
     * Setter for `selectionMode` attribute, removes prior event handle (if exists) and defines
     * a new delegated "click" handler that updates the `selected` attribute.
     *
     * A change to this setting clears all prior selections.
     *
     * @method _setSelectionMode
     * @param val
     * @return {*}
     * @private
     */
    _setSelectionMode: function(val){
        var oSelf = this;
        if ( this._subscrSelect ) {
            this._subscrSelect.detach();
        }

        if(val==='none') {
            return;
        } else if (val.toLowerCase) {
            val = val.toLowerCase();
        }

        this._subscrSelect = this.delegate("click",function(e){
                var tar = e.currentTarget;

               // Disabled 11/16/12: was preventing checkbox listeners to fire
               // e.halt(true);

                oSelf._clickModifiers = {
                    ctrlKey:  e.ctrlKey,
                    altKey:   e.altKey,
                    metaKey:  e.metaKey,
                    shiftKey: e.shiftKey,
                    which:    e.which,
                    button:   e.button
                };

                oSelf.set('selected',tar);

            },"tr td",oSelf);
        //this._clearAll(this._classSelected);
        this.clearSelections();
        return val;
    },

    /**
     * Helper method to clear DOM "selected" text or ranges
     * @method _clearDOMSelection
     * @private
     */
    _clearDOMSelection: function(){
        var sel = (Y.config.win.getSelection) ? Y.config.win.getSelection()
            : (Y.config.doc.selection) ? Y.config.doc.selection : null;

        if ( sel && sel.empty ) {
            sel.empty();   // works on chrome
        }
        if ( sel && sel.removeAllRanges ) {
            sel.removeAllRanges();  // works on FireFox
        }
    }

});

Y.DataTable.Selection = DtSelection;
Y.Base.mix(Y.DataTable, [Y.DataTable.Selection]);



}, 'gallery-2012.12.19-21-23', {"skinnable": "true", "requires": ["base-build", "datatable-base", "event-custom"]});
