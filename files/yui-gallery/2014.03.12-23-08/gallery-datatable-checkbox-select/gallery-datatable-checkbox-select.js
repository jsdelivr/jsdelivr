YUI.add('gallery-datatable-checkbox-select', function(Y) {

/**
A DataTable class extension that adds capability to provide a "checkbox" (INPUT[type=checkbox]) selection
capability via a new column, which includes "select all" checkbox in the TH.  The class uses only a few
defined attributes to add the capability.

This extension works with sorted data and with paginated DataTable (via Y.DataTable.Paginator), by retaining
a set of "primary keys" for the selected records.

Users define the "primary keys" by either setting a property flag of "primaryKey:true" in the DataTable
column configuration OR by setting the [primaryKeys](#attr_primaryKeys) attribute.

To enable the "checkbox" selection, set the attribute [checkboxSelectMode](#attr_checkboxSelectMode) to true,
which will add a new column as the first column and sets listeners for checkbox selections.

To retrieve the "checkbox" selected records, the attribute [checkboxSelected](#attr_checkboxSelected) can be
queried to return an array of objects of selected records (See method [_getCheckboxSelected](#method__getCheckboxSelected))
for details.

####Usage
		var dtable = new Y.DataTable({
		    columns: 	['port','pname', 'ptitle'],
		    data: 		ports,
		    scrollable: 'y',
		    height: 	'250px',
		
		// define two primary keys and enable checkbox selection mode ...
		    primaryKeys:		[ 'port', 'pname' ],
		    checkboxSelectMode:	true
		
		}).render("#dtable");
		
 @module DataTable
 @submodule Selection	
 @class Y.DataTable.CheckboxSelect
 @extends Y.DataTable
 @author Todd Smith
 @version 1.0.0
 @since 3.6.0
 **/
DtCheckboxSelect = function(){};

Y.mix( DtCheckboxSelect.prototype, {

    /**
     * Holder for the EventHandle for the "select all" INPUT[checkbox] click handler in the TH
     * (set via delegate in _bindCheckboxSelect)
     * @property _subscrChkAll
     * @type Array
     * @default null
     * @private
     */
    _subscrChkAll: null,


    /**
     * Holder for the EventHandle for the individual INPUT[checkbox]'s click handler within each TR
     * (set via delegate in _bindCheckboxSelect)
     * @property _subscrChk
     * @type Array
     * @default null
     * @private
     */
    _subscrChk: null,


    /**
     * Placeholder for the "checkbox" currently selected records, stored in 'primary key value' format.
     * @property _chkRecords
     * @type Array
     * @default []
     * @private
     */
    _chkRecords: [],


    /**
     * HTML template for creation of the TH column of the "checkbox" select column.
     * @property tmplTH
     * @type String
     * @default '<input type="checkbox" class="{className}" title="{columnTitleTH}"/>'
     * @public
     */
    tmplTH:     '<input type="checkbox" class="{className}" title="{columnTitleTH}"/>',


    /**
     * Key name of the "checkbox" select column that is added to DataTable's column configurations
     * @property colSelect
     * @type String
     * @default 'chkSelect'
     * @public
     */
    colSelect:  'chkSelect',

//====================   LIFECYCLE METHODS   ============================

    /**
     * Initializer, doesn't really do anything at this point ...
     * @method initializer
     * @return {*}
     * @protected
     */
    initializer: function(){

        // Currently, this doesn't do much ... see _bindCheckboxSelect

//        if(this.get('checkboxSelect'))
//        this._subscr.push( this.on('sort',this._afterSortEventChk) );
        return this;
    },

    /**
     * Unbinds the checkbox listeners and detaches any others created
     * @method destructor
     * @protected
     */
    destructor:function(){
        this._unbindCheckboxSelect();
        this._chkRecords = null;
    },


//====================   PUBLIC METHODS   ============================

    /**
     Method that selects all "checkboxes" to checked, adds all records to the selected records and
     checks the "Select All" checkbox.
     @method checkboxSelectAll
     @public
     **/
    checkboxSelectAll: function(){

        // Reset and push all pk vals as selected
        this._chkRecords = [];
        this.data.each(function(r){
            var pks = this._getPKValues(r);
            if(pks) this._chkRecords.push(pks);
        },this);

        // Update all of the the INPUTs
        this._uiCheckboxSetEach(true);

        // Set the "select all" checkbox to checked ...
        this._uiAllChecksSet(true);

        this.fire('checkboxSetAll');
    },

    /**
     * Fires after the "select all" checkbox is clicked and all records are selected
     * @event checkboxSetAll
     */

    /**
     Method that resets all "checkboxes" to unchecked, zeros the selected records and
     unchecks the "Select All" checkbox.
     @method checkboxClearAll
     @public
     **/
    checkboxClearAll: function() {
        this._chkRecords = [];

        // turn off all individual checkboxes ...
        this._uiCheckboxSetEach(false);

        // Set the "select all" checkbox to unchecked ...
        this._uiAllChecksSet(false);

        this.fire('checkboxClearAll');
    },

    /**
     * Fires after the "select all" checkbox is clicked and all records are cleared
     * @event checkboxclearAll
     */

//====================   PRIVATE METHODS   ============================

	/**
	 Method that sets "click" events (via DataTable .delegate) on the INPUT[checkbox]'s for each 
	 row TR and for the "select all" checkbox.
	 @method _bindCheckboxSelect
	 @private
	 **/
    _bindCheckboxSelect: function(){
        this._subscrChk = this.delegate("click",this._onCheckboxSelect,"tr ."+this.getClassName("checkbox","select"),this);
        this._subscrChkAll = this.delegate("click",this._onCheckboxSelectAll,"."+this.getClassName("checkbox","select","all"),this);
    },

	/**
	 Method to detach all of the listeners created by this class
	 @method _unbindCheckboxSelect
	 @private
	 **/
    _unbindCheckboxSelect: function(){
        if(this._subscrChk) this._subscrChk.detach();
        this._subscrChk = null;
        if(this._subscrChkAll) this._subscrChkAll.detach();
        this._subscrChkAll = null;
    },

	/**
	 Enables this class, by clearing the selected records, creating the UI elements and adding checkbox listeners.
	 @method _enableCheckboxSelect
	 @private
	 **/
    _enableCheckboxSelect: function(){
        this._chkRecords = [];
        this._uiAddCheckboxTH();
        this._bindCheckboxSelect();
    },

	/**
	 Disables this class, by clearing all selectors and remove the UI element and detaching listeners
	 @method _enableCheckboxSelect
	 @private
	 **/
    _disableCheckboxSelect: function(){
        this.checkboxClearAll();
        this._uiRemoveCheckboxTH();
        this._unbindCheckboxSelect();
    },

	/**
	 Setter method for attribute (checkboxSelectMode)[#attr_checkboxSelectMode] that toggles this extension on/off
	 @method _setCheckboxSelectMode
	 @private
	 **/
    _setCheckboxSelectMode: function(val){
        if(val) {
            this._enableCheckboxSelect();
        } else {
            this._disableCheckboxSelect();
        }
    },


    /**
     Getter method for [checkboxSelected](#attr_checkboxSelected) attribute, that returns the currently "checkbox" selected
     rows, returned as an array of {Object}s containing members {tr,record,pkvalues}.
	 <br/><br/><b>Returns:</b> {Array} of {Objects} selected for each row as;
	 <ul>
	 <li>`selected.tr` : TR Node for the checkbox selected row</li>
	 <li>`selected.record` : Model instance for the selected data record</li>
	 <li>`selected.pkvalues` Primary key value settings for the selected record (single value or {Object} if more than one primary key is set)</li>
	 </ul>
	 
     @method _getCheckboxSelected
     @return See above
     @private
     **/
    _getCheckboxSelected: function(){
        var recs = [];
        Y.Array.each( this._chkRecords, function(pk){
            var rec = this._getRecordforPKvalue(pk);
            recs.push({
                tr:     this.getRow(rec),
                record: rec,
                pkvalues: pk
            });
        },this);

        return recs;
    },

    /**
     Setter method for [checkboxSelected](#attr_checkboxSelected) attribute, currently only supports on input an
     Array of record indices that should be initially "checkbox" selected.

     TODO:  Need to add initial selections as "primary key" values

     @method _setCheckboxSelected
     @param {Array} rows Array of row indices to initially set as "checked"
     @return {*}
     @private
     **/
    _setCheckboxSelected: function(rows){
        if(!Y.Lang.isArray(rows)) return false;

        this.checkboxClearAll();

        var recs = [], tr, rec, pkv, inp;

        Y.Array.each( rows, function(ri) {

            rec = this.data.item(ri);
            pkv = this._getPKValues(rec);
            tr  = this.getRow(rec);

            if(rec && pkv) {
                this._chkRecords.push( pkv );
                inp = tr.one('.'+this.getClassName("checkbox","select"));
                if (inp) inp.set('checked',true);
            }
        },this);

        return rows;
    },

    /**
     Method that returns a boolean flag indicating whether the entered record represents
     a record that is currently selected (i.e. in this._chkRecords).

     This is principally used by the formatter function for the checkbox column.

     @method _getCheckboxSelectedFlag
     @param rec
     @return {Boolean} selected Either "true" or "false" depending on whether the entered row is currently "checked"
     @private
     **/
    _getCheckboxSelectedFlag: function(rec) {
        var pks = this._getPKValues(rec),
            rtn = false;

        if(Y.Lang.isObject(pks) )
            rtn = this._indexOfObjMatch(this._chkRecords,pks);
        else
            rtn = Y.Array.indexOf(this._chkRecords,pks);

        return (rtn !== -1) ? true : false;
    },


    /**
     Click handler for the added in the checkbox select INPUT[checkbox]
     @method _onCheckboxSelect
     @param {EventTarget} e
     @private
     **/
    _onCheckboxSelect: function(e){
        var chkTar = e.target,                  // the INPUT[checkbox] that triggered this
            tr     = chkTar.ancestor('tr'),     // the clicked TR
            rec    = this.getRecord(tr),        // the Model corresponding to the clicked TR
            pkv    = this._getPKValues(rec);    // primary key value object, either an individual value or an object value

        // If this change makes it "checked", then add the "pkv" to the _chkRecords array
        if(e.target.get('checked')) {
            this._chkRecords.push(pkv);
        } else {
        // The user "un-checked" this record, remove it from _chkRecords ...

            // The wonky but works amazingly well method to remove one element!
            var vals = [];
            Y.Array.each(this._chkRecords,function(s){
                if( s !== pkv ) vals.push(s);
            });
            this._chkRecords = vals;
        }
    },

    /**
     Click handler for the TH "check ALL" INPUT[checkbox]
     @method _onCheckboxSelectAll
     @param {EventTarget} e
     @private
     **/
    _onCheckboxSelectAll: function(e){
        var chkTar = e.target,
            tr     = chkTar.ancestor('tr'),
            rec    = this.getRecord(tr);

        if(e.target.get('checked'))
            this.checkboxSelectAll();
        else
            this.checkboxClearAll();
    },

    /**
     Adds a new Column with the TH element
     @method _uiAddCheckboxTH
     @private
     **/
    _uiAddCheckboxTH: function(){

        // Define a new "select" column ....
        var colSel = {
            key:        this.colSelect,

            allowHTML:  true,
            label:      Y.Lang.sub( this.tmplTH,{
                className:      this.getClassName("checkbox","select","all"),
                columnTitleTH:  "Select ALL records"
            }),

            formatter:  function(o) {
                var chkd = ( this._getCheckboxSelectedFlag(o.record) ) ? "checked" : "";
                o.value = '<input type="checkbox" class="' + this.getClassName("checkbox","select") + '" ' + chkd + '/>';
                o.className += ' center';
             }
        };

        // Retrieve the columns, and add the new column at the first index location ...
        var cols = this.get('columns');

        // only add this column if it is nonexistent in the column already ...
        if(!this.getColumn(this.colSelect) ) {
            this.addColumn(colSel,0);
            this.syncUI();
        }

    },

    /**
     Removes the "checkbox" select column from the DataTable columns attribute
     @method _uiRemoveCheckboxTH
     @private
     **/
    _uiRemoveCheckboxTH: function(){
        this.removeColumn(this.colSelect);
        this.syncUI();
    },

    /**
     Method that updates the UI on each record's INPUT[checkbox] and sets them to the entered setting (true,false).
     @method _uiCheckboxSetEach
     @param {Boolean} bool Flag indicating whether checks should be set or not
     @private
     **/
    _uiCheckboxSetEach: function(bool){
        var inps = this.get('srcNode').all("."+this.getClassName("data") + " ."+this.getClassName("checkbox","select"));
        inps.each(function(n){
            n.set('checked',bool);
        });

    },

    /**
     Method that updates the UI on the "select all" INPUT[checkbox] and sets it to the entered setting (true,false).
     @method _uiCheckboxSetEach
     @param {Boolean} bool Flag indicating whether the check should be set or not
     @private
     **/
    _uiAllChecksSet: function(bool){
        var sa = this.get('srcNode').one("."+this.getClassName("checkbox","select","all"));
        if (sa) sa.set('checked',bool);
    },


//------------   Primary Key functions  --------------

    /**
     Default value method for the (primaryKeys)[#attr_primaryKeys] attribute.  This method will search
     the defined DataTable "columns" attribute array and loop over each column, if a column has a
     property "primaryKey" that column will be added as a primary key.
     @example
            var cols = [ {key:'cust_id', label:'Cust ID', primaryKey:true},
                    {key:'ord_date', label:'Order Date'},
                    {key:'ord_id', label:'Order ID', primaryKey:true}
                    ....
                ];
            // will result in ATTR "primaryKeys" as [ 'cust_id', 'ord_id' ]

     @method _valPrimaryKeys
     @return {Array}
     @private
     **/
    _valPrimaryKeys: function(){
        var cols = this.get('columns'),
            pks = [];

        Y.Array.each(cols,function(c){
            if( c && c.primaryKey && c.primaryKey === true) {
                var ckey = c.key || c.name || null;
                if(ckey) {
                    pks.push(ckey);
                }
            }
        });
        return pks;
    },

    /**
     Setter method for the the (primaryKeys)[#attr_primaryKeys] attribute, where the input values can be
     either (a) a single {String} column key name or (b) an {Array} of column key names in {String} format.

     NOTE: If this attribute is set, it will over-ride any "primaryKey" entries from the "columns".

     @method _setPrimaryKeys
     @param {String|Array} pkn Column key (or column name) entries, either a single {String} name or an array of {Strings}
     @return {*}
     @private
     **/
    _setPrimaryKeys: function(pkn){

        if (Y.Lang.isArray(pkn))
            pks = pkn;
        else if (Y.Lang.isString(pkn))
            pks = [ pkn ];

        return pks;
    },


    /**
     Returns the corresponding record (Model) for the entered primary key setting (pkv),
     where pkv can be either a single value or an object (for multiple primary keys).

     @method _getRecordforPKvalue
     @param {Number|String|Date|Object} pkv Primary key setting to search ModelList for
     @return {Model} record Returns the record (Model) that corresponds to the key setting in pkv
     @private
     **/
    _getRecordforPKvalue: function(pkv){
        var pkeys = this.get('primaryKeys');
        var recs = this.data.filter(function(r){
            if(Y.Lang.isObject(pkv)) {
                var flag = true;
                Y.Object.each(pkv,function(v,k){
                    if(r.get(k)!== v) flag = false;
                });
                if(flag)
                    return true;
            } else {
                if(r.get(pkeys[0]) === pkv )
                    return true;
            }
        });
        return (recs && recs.length===1)  ? recs[0] : recs;
    },

    /**
     Method that returns the primary key values for the provided record "rec", either as an
     individual value (for a single primary key) or as an {Object} in key:value pairs where the
     key is the primary key name and the value is the value from this record.

     @example
            // For a record with rec = {cust_id:157, cust_name:'foo', odate:'9/12/2009', ord_no:987}
            this._getPKValues(rec);  // for one primary key "cust_id"  RETURNS 157
            this._getPKValues(rec);  // for primary keys "cust_id", "ord_no"  RETURNS {cust_id:157,ord_no:987}

     @method _getPKValues
     @param {Model} rec The record Model that the primary key values are requested for
     @return {Mixed|Object} pkv Returns the primary key values as a single value or an object key:value hash
     @private
     **/
    _getPKValues: function(rec){
        var pkeys = this.get('primaryKeys');
        if(!pkeys || !Y.Lang.isArray(pkeys) || !rec) return false;

        var rtn;
        if( pkeys.length === 1)
            rtn = rec.get(pkeys[0]);
        else {
            rtn = {};
            Y.Array.each(pkeys,function(pk){
                if( pk ) rtn[pk] = rec.get(pk);
            });
        }
        return rtn;
    },


    /**
     Function that searches an Array of Objects, looking for a matching partial object as defined by key_vals {Object},
     and returning the index of the first match.
     @method _indexOfObjMatch
     @param arr
     @param key_vals
     @return {Integer} imatch Returned index number of first match, or -1 if none found
     @private
     **/
    _indexOfObjMatch: function(arr,key_vals) {
        if(!Y.Lang.isObject(key_vals) || !Y.Lang.isArray(arr) ) return -1;
        var imatch = -1;
        Y.Array.some(arr,function(item,index){
            var bool = true;
            Y.Object.each(key_vals,function(v,k){
                if(item[k] !== v) bool = false;
            });
            if (bool) {
                imatch = index;
                return true;
            }
        });

        return imatch;
    }

});

DtCheckboxSelect.ATTRS = {

    /**
     Attribute that is used to trigger "checkbox" selection mode, and inserting of a checkbox select
     column to the current DataTable.

     @attribute checkboxSelectMode
     @type {Boolean}
     @default false
     **/
    checkboxSelectMode: {
        value:      false,
        validator:  Y.Lang.isBoolean,
        setter:     '_setCheckboxSelectMode'
    },


    /**
     Attribute that is used to retrieve the "checkbox" selected records from the DataTable at any time. 
     
     Also can be used to set initially "checked" records by entering an {Array} of record indices. (See method [_setCheckboxSelected](#method__setCheckboxSelected)).

     
     When a `get('checkboxSelected')` is requested, an {Array} of {Objects} containing members as 
     {tr,record,pkvalues} is returned for each checked row. (See method [_getCheckboxSelected](#method__getCheckboxSelected)).

     @attribute checkboxSelected
     @type {Array}
     @default []
     **/
    checkboxSelected: {
        value:      [],
        validator:  Y.Lang.isArray,
        setter:     '_setCheckboxSelected',
        getter:     '_getCheckboxSelected'
    },

    /**
     Attribute to set the "primary keys" for the DataTable that uniquely define the record (Model) attributes 
     to use to search for specific records.  
     
     Primary keys can be defined either with this attribute `primaryKeys` OR by placing an extra object property
     in the DataTable column configuration as "primaryKey:true".
     
     This attribute is more useful in use cases where the primary key is not displayed in a column.
     
     @example
	 // sets a single primary key to data field with key:'emp_id'
	 myDT.set('primaryKeys','emp_id');       		
		
	 // sets dual primary keys to two data fields with key:'inventory_id' and key:'lot_id'
	 myDT.set('primaryKeys',['inventory_id','lot_id']);  
	 // OR
	 var myDT = new Y.DataTable({
	 	columns: [ 
	 		{key:'inventory_id', label:'Inventory Code', primaryKey:true},
	 		{key:'item_code', label:'Sales Item'},
	 		{key:'lot_id', label:'Lot Code', primaryKey:true},
	 		...
	 });
     		
     @attribute primaryKeys
     @type {String|Array}
     @default See above
     **/
    primaryKeys: {
        valueFn:    '_valPrimaryKeys',
        setter:     '_setPrimaryKeys'
    }

};

Y.DataTable.CheckboxSelect = DtCheckboxSelect;
Y.Base.mix(Y.DataTable, [Y.DataTable.CheckboxSelect]);


}, 'gallery-2012.09.12-20-02' ,{requires:['datatable-base','datatable-mutable','event-custom'], skinnable:false});
