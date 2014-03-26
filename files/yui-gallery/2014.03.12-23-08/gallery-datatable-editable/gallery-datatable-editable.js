YUI.add('gallery-datatable-editable', function (Y, NAME) {

/**
 A DataTable class extension that configures a DT for "editing", current deployment supports cell editing
 (and planned near-term support for row editing).

 This module is essentially a base wrapper-class to setup DT for editing with the appropriate attributes and
 listener creation / detachment.  The real guts of "datatable-editing" is in the View class definitions, within
 the gallery-datatable-celleditor-inline and gallery-datatable-celleditor-inline modules (and possibly future
 editor View class modules).

 #### Functionality

 The module is basically intended to keep track of the editing state (via [editable](#attr_editable) attribute) and
 housekeeping functions with regard to managing editor View instance creation, rendering and destruction.

 By design this module attempts to group common editor View instances wherever possible.  So for a DT with 14 columns
 all set with "inline" View classes only 1 View instance is created.
 <br/>Likewise if a DT uses 4 different "calendar" editor View types but each one as slightly different "editorConfig",
 then this module creates 4 different calendar View instances to handle the different configurations.

 Listeners are set for the "cellEditorSave" event and saved to the active "data" setting within this module.

 Additional capability is provided for cell editing situations to add CSS classes to TD's which are added to "editable"
 columns (e.g. cursor) to indicate they are "clickable".

 This module works sortable, scrollable (y-scrolling currently) to make changes to the client-side of the DT model
 (remote updates should be provided via ModelList sync or user-defined listeners.)


 #### Attributes

 Presently three attributes are provided;
 [editable](#attr_editable), [editOpenType](#attr_editOpenType) and [defaultEditor](#attr_defaultEditor).

 The primary ATTR is the [editable](#attr_editable), which is used to toggle on/off the editing state of the DT
 instance.

 The [defaultEditor](#attr_defaultEditor) attribute is used to setup a cell editor View instance to be used on all editable columns
 that don't already have an editor assigned.

 ##### Column Properties

 In addition to a few new attributes the module also recognizes some new column properties in order to support
 cell-editing in particular;
 <table>
 <tr><th>editable</th><td>{Boolean}</td><td>Flag to indicate if column is editable (set `editable:false` to exclude an
 individual column)</td></tr>
 <tr><th>editor</th><td>{String}</td><td>Name of the defined Y.DataTable.EditorOptions View configuration for this column.</td></tr>
 <tr><th>editorConfig</th><td>{Object}</td><td>Passed to the View editor class when instantiated, and Y.merge'ed in to become View class
 attributes.</td></tr>
 </table>

 When this module is loaded and the "editable:true" attribute is set, it attempts to economize on the "instantiation cost"
 of creating View instances by identifying only editor Views that are required based upon column definitions and/or the
 defaultEditor attribute. (e.g. if all columns are "text" editors, only one "text" editor View is instantiated)

 ##### ... More Info

 The module fires the event [cellEditorSave](#event_cellEditorSave), which can be listened for to provide updating
 of remote data back to a server (assuming a ModelList "sync" layer is NOT used).  Haven't provided the equivalent to
 YUI 2.x's "asyncSubmitter" because I think this event could easily be listened to in order to provide follow-on
 updating to remote data stores.

 A new class Object (Y.DataTable.EditorOptions) is added to the DataTable namespace that serves as the
 datastore of the editor View configuration properties.  Each "key" (object property) within this object
 is an entrypoint to a specific editor configuration, which are defined in the separate View class extensions (presently
 gallery-datatable-celleditor-inline and gallery-datatable-celleditor-popup. Please see those for specifics.)

 ###### KNOWN ISSUES:
   <ul>
   <li>Works minimally with "y" scrolling, "x" scrolling still needs work.</li>
   <li>Initial editor invocation is limited to "mouse" actions on TD only (although keyboard navigation cell-to-cell is available).</li>
   </ul>

 ###### FUTURE:
 This module will be amended to add support for "row" editing, if required.

 @module gallery-datatable-editable
 @class Y.DataTable.Editable
 @extends Y.DataTable
 @author Todd Smith
 @since 3.8.0
 **/
DtEditable = function(){};

// Define new attributes to support editing
DtEditable.ATTRS = {

    /**
     * A boolean flag that sets the DataTable state to allow editing (either inline or popup cell editing).
     * (May support row editing in future also)
     *
     * @attribute editable
     * @type boolean
     * @default false
     */
    editable: {
        value:      false,
        validator:  Y.Lang.isBoolean
    },

    /**
     * Defines the cell editing event type on the TD that initiates the editor, used to
     * specify the listener that invokes an editor.
     *
     * Note: IMHO The only sensible options are 'click' or 'dblclick'
     *
     * @attribute editOpenType
     * @type {String|Null}
     * @default 'dblclick'
     */
    editOpenType: {
        value:      'dblclick',
        validator:  function(v){ return Y.Lang.isString(v) || v===null; }
    },

    /**
     * Specifies a default editor name to respond to an editing event defined in [_editOpenType](#attr_editOpenType)
     * attribute.  The default editor is used if the DataTable is in editing mode (i.e. "editable:true") and if
     * the column DOES NOT include a property editable:false in its definitions.
     *
     * Cell editors are typically assigned by setting a column property (i.e. editor:'text' or 'date') on each
     * individual column.
     *
     * This attribute can be used to set a single editor to work on every column without having to define it on each
     * column.
     *
     * @attribute defaultEditor
     * @type {String|Null}
     * @default null
     */
    defaultEditor : {
        value:      null,
        validator:  function(v){ return Y.Lang.isString(v) || v === null; }
    }
};

// Add static props and public/private methods to be added to DataTable
Y.mix( DtEditable.prototype, {

// -------------------------- Placeholder Private Properties  -----------------------------

    /**
     Holds the View instance of the active cell editor currently displayed
     @property _openEditor
     @type Y.View
     @default null
     @private
     @static
     **/
    _openEditor:        null,

    /**
     Holds the current record (i.e. a Model class) of the TD being edited
     (Note: this may not always work, better to use "clientId" of the record, i.e. sorting, etc..)
     @property _openRecord
     @type Model
     @default null
     @private
     @static
     **/
    _openRecord:        null,

    /**
     Holds the column key (or name) of the TD cell being edited
     @property _openColKey
     @type String
     @default null
     @private
     @static
     **/
    _openColKey:        null,

    /**
     Holds the TD Node currently being edited
     @property _openTd
     @type Node
     @default null
     @private
     @static
     **/
    _openTd:            null,

    /**
     Holds the cell data for the actively edited TD, a complex object including the
     following;  {td, value, recClientId, colKey}
     @property _openCell
     @type Object
     @default null
     @private
     @static
     **/
    _openCell:          null,

// -------------------------- Subscriber handles  -----------------------------

    /**
     Placeholder for the DT level event listener for "editableChange" attribute.
     @property _subscrEditable
     @type EventHandle
     @default null
     @private
     @static
     **/
    _subscrEditable:     null,

    /**
     Placeholder for the DT event listener to begin editing a cell (based on editOpenType ATTR)
     @property _subscrEditOpen
     @type EventHandle
     @default null
     @private
     @static
     **/
    _subscrEditOpen: null,

    /**
     Placeholder Array for TD editor invocation event handles (i.e. click or dblclick) that
     are set on the TBODY to initiate cellEditing.
     @property _subscrCellEditors
     @type Array of EventHandles
     @default null
     @private
     @static
     **/
    _subscrCellEditors:    null,

    /**
     Placeholder for event handles for scrollable DT that listens to "scroll" events and repositions editor
     (we need two listeners, one for each of X or Y scroller)
     @property _subscrCellEditorScrolls
     @type Array of EventHandles
     @default null
     @private
     @static
     **/
    _subscrCellEditorScrolls: null,

    /**
     Shortcut to the CSS class that is added to indicate a column is editable
     @property _classColEditable
     @type String
     @default 'yui3-datatable-col-editable'
     @private
     @static
     **/
    _classColEditable:  null,

    /**
     Placeholder hash that stores the "common" editors, i.e. standard editor names that occur
     within Y.DataTable.EditorOptions and are used in this DT.

     This object holds the View instances, keyed by the editor "name" for quick hash reference.
     The object is populated in method [_buildColumnEditors](#method__buildColumnEditors).

     @property _commonEditors
     @type Object
     @default null
     @private
     @static
     **/
    _commonEditors:  null,

    /**
     Placeholder hash that stores cell editors keyed by column key (or column name) where the value
     for the associated key is either a (a) {String} which references an editor name in the [_commonEditors](#property__commonEditors)
     hash or (b) {View} instance for a customized editor View instance (typically one with specified "editorConfig" in the
     column definition).

     The object is populated in method [_buildColumnEditors](#method__buildColumnEditors).

     @property _columnEditors
     @type Object
     @default null
     @private
     @static
     **/
    _columnEditors: null,

    // future
    //_editableType:      null,   //  'cell', 'row', 'inline?'

//==========================  LIFECYCLE METHODS  =============================

    /**
     * Initializer that sets up listeners for "editable" state and sets some CSS names
     * @method initializer
     * @protected
     */
    initializer: function(){

        this._classColEditable = this.getClassName('col','editable');

        // Hacky, but works ...
        if(this.get('editable')) {
            this._onEditableChange(true);
        }

        this.after('editableChange',this._onEditableChange);

        this._bindEditable();

        return this;
    },

    /**
     * Cleans up ALL of the DT listeners and the editor View instances and generated private props
     * @method destructor
     * @protected
     */
    destructor:function() {
        // detach the "editableChange" listener on the DT
        this.set('editable',false);
        this._unbindEditable();
    },

//==========================  PUBLIC METHODS  =============================

    /**
     * Opens the given TD eventfacade or Node with it's assigned cell editor.
     *
     * @method openCellEditor
     * @param e {EventFacade|Node} Passed in object from an event OR a TD Node istance
     * @public
     */
    openCellEditor: function(e) {
        var td       = e.currentTarget || e,
            col      = this.getColumnByTd(td),
            colKey   = col.key || col.name,
            editorRef = (colKey) ? this._columnEditors[colKey] : null,
            editorInstance = (editorRef && Y.Lang.isString(editorRef) ) ? this._commonEditors[editorRef] : editorRef;

        if(!td) {
            return;
        }

        // First time in,
        if( (this._yScroll || this._xScroll) && !this._subscrCellEditorScroll) {
            this._bindEditorScroll();
        }

        //
        // Bailout if column is null, has editable:false or no editor assigned ...
        //
        if(col && col.editable === false && !editorInstance) {
            return;
        }

        // Hide any editor that may currently be open ... unless it is the currently visible one
        if(this._openEditor) {
            if ( this._openEditor === editorInstance ) {
                this._openEditor.hideEditor();
            } else {
                this.hideCellEditor();
            }
        }

        //
        //  If the editorInstance exists, populate it and show it
        //
        //TODO:  fix this to rebuild new editors if user changes a column definition on the fly
        //
        if(editorInstance) {

            //
            //  Set private props to the open TD we are editing, the editor instance, record and column name
            //
            this._openTd     = td;                      // store the TD
            this._openEditor = editorInstance;          // placeholder to the open Editor View instance
            this._openRecord = this.getRecord(td);      // placeholder to the editing Record
            this._openColKey = colKey;                  // the column key (or name)

            this._openCell   = {
                td:             td,
                value:          this._openRecord.get(colKey),
                recClientId:    this._openRecord.get('clientId'),
                colKey:         colKey
            };

            // Define listeners onto this open editor ...
            //this._bindOpenEditor( this._openEditor );

            //
            //  Set the editor Attributes and render it ... (display it!)
            //
            this._openEditor.setAttrs({
       //         hostDT: this,
                cell:   this._openCell,
                value:  this._openRecord.get(colKey)
            });

            this._openEditor.showEditor(td);

        }

    },


    /**
     * Cleans up a currently open cell editor View and unbinds any listeners that this DT had
     * set on the View.
     * @method hideCellEditor
     * @public
     */
    hideCellEditor: function(){
        if(this._openEditor) {
            this._openEditor.hideEditor();
            this._unsetEditor();
        }
    },

    /**
     * Utility method that scans through all editor instances and hides them
     * @method hideAllCellEditors
     * @private
     */
    hideAllCellEditors: function(){
        this.hideCellEditor();
        var ces = this._getAllCellEditors();
        Y.Array.each( ces, function(editor){
            if(editor && editor.hideEditor) {
                editor.hideEditor();
            }
        });
    },

    /**
     * Over-rideable method that can be used to do other user bindings ?
     *   (like hideEditor on mouseout, etc...)
     * @method bindEditorListeners
     * @public
     */
    bindEditorListeners: function(){
        return;
    },

    /**
     * Returns all cell editor View instances for the editable columns of the current DT instance
     * @method getCellEditors
     * @return editors {Array} Array containing an Object as {columnKey, cellEditor, cellEditorName}
     */
    getCellEditors: function(){
        var rtn = [], ed;
        Y.Object.each(this._columnEditors,function(v,k){
            ed = (Y.Lang.isString(v)) ? this._commonEditors[v] : v;
            rtn.push({
                columnKey:      k,
                cellEditor:     ed,
                cellEditorName: ed.get('name')
            });
        },this);
        return rtn;
    },

    /**
     * Utility method to return the cell editor View instance associated with a particular column of the
     * Datatable.
     *
     * Returns null if the given column is not editable.
     *
     * @method getCellEditor
     * @param col {Object|String|Integer} Column identifier, either the Column object, column key or column index
     * @returns {View} Cell editor instance, or null if no editor for given column
     * @public
     */
    getCellEditor: function(col) {
        var ce = this._columnEditors,
            column = (col && typeof col !== "object") ? this.getColumn(col) : null,
            colKey = (column) ? column.key || column.name : null,
            rtn = null;

        if(colKey && ce[colKey]) {
            if(Y.Lang.isString(ce[colKey])) {
                // ce[colKey] is a common editor name, like "textarea", etc..
                rtn = this._commonEditors[ ce[colKey] ];
            } else {
                rtn = ce[colKey];
            }
        }

        return rtn;

    },

    /**
     * Returns the Column object (from the original "columns") associated with the input TD Node.
     * @method getColumnByTd
     * @param cell {Node} Node of TD for which column object is desired
     * @return column {Object} The column object entry associated with the desired cell
     * @public
     */
    getColumnByTd:  function(cell){
        var colName = this.getColumnNameByTd(cell);
        return (colName) ? this.getColumn(colName) : null;
    },


    /**
     * Returns the column "key" or "name" string for the requested TD Node
     * @method getColumnNameByTd
     * @param cell {Node} Node of TD for which column name is desired
     * @return colName {String} Column key or name
     * @public
     */
    getColumnNameByTd: function(cell){
        var classes = cell.get('className').split(" "),
            regCol  = new RegExp( this.getClassName('col') + '-(.*)'),
            colName;

        Y.Array.some(classes,function(item){
            var colmatch =  item.match(regCol);
            if ( colmatch && Y.Lang.isArray(colmatch) && colmatch[1] ) {
                colName = colmatch[1];
                return true;
            }
        });

        return colName || null;
    },


//==========================  PRIVATE METHODS  =============================


    /**
     * Sets up listeners for the DT editable module,
     * @method _bindEditable
     * @private
     */
    _bindEditable: function(){
        var eotype = this.get('editOpenType');

        if(this._subscrEditable) {
            Y.Array.each(this._subscrEditable,function(eh){
                if(eh && eh.detach) {
                    eh.detach();
                }
            });
        }

        this._subscrEditable = [];

        // Check the editing open type setting ...
        eotype = (eotype && Y.Lang.isString(eotype) && eotype.search(/none/i)===-1 ) ? eotype : null;
        if(eotype) {
            if(this._subscrEditOpen) {
                this._subscrEditOpen.detach();
            }
            this._subscrEditOpen = this.delegate( eotype, this.openCellEditor,"tbody." + this.getClassName('data') + " td",this);
        }

        this._subscrEditable.push(
            Y.Do.after(this._updateAllEditableColumnsCSS,this,'syncUI'),
            this.after('sort', this._afterEditableSort),
            this.after('editOpenTypeChange',this._onEditOpenTypeChange),
            this.after('defaultEditorChange',this._onDefaultEditorChange)
        );

    },

    /**
     * Unbinds ALL of the popup editor listeners and removes column editors.
     * This should only be used when the DT is destroyed
     * @method _unbindEditable
     * @private
     */
    _unbindEditable: function() {

        // Detach 'editable' related listeners
        if(this._subscrEditable) {
            Y.Array.each(this._subscrEditable,function(eh){
                if(eh && eh.detach) {
                    eh.detach();
                }
            });
        }
        this._subscrEditable = null;

        // Detach edit opening ...
        if(this._subscrEditOpen) {
            this._subscrEditOpen.detach();
        }
        this._subscrEditOpen = null;

        // destroy any currently open editor
        if(this._openEditor && this._openEditor.destroy) {
            this._openEditor.destroy();
        }

        // Detach scrolling listeners
        if(this._subscrCellEditorScrolls && Y.Lang.isArray(this._subscrCellEditorScrolls) ) {
            Y.Array.each(this._subscrCellEditorScroll, function(dh){
                if(dh && dh.detach) {
                    dh.detach();
                }
            });
            this._subscrCellEditorScrolls = [];
        }

        this.detach('celleditor:*');

        this._unsetEditor();

        // run through all instantiated editors and destroy them
        this._destroyColumnEditors();

    },

    /**
     * Binds listeners to cell TD "open editing" events (i.e. either click or dblclick)
     * as a result of DataTable setting "editable:true".
     *
     * Also sets a body listener for ESC key, to close the current open editor.
     *
     * @method _bindCellEditingListeners
     * @private
     */
    _bindCellEditingListeners: function(){

        // clear up previous listeners, if any ...
        if(this._subscrCellEditors) {
            this._unbindCellEditingListeners();
        }

        // create listeners
        this._subscrCellEditors = [];

        // Add a ESC key listener on the body (hate doing this!) to close editor if open ...
        this._subscrCellEditors.push(
            Y.one('body').after('keydown', Y.bind(this._onKeyEsc,this) ),
            this.on('celleditor:editorSave',this._onCellEditorSave),
            this.on('celleditor:editorCancel',this._onCellEditorCancel),
            this.on('celleditor:keyDirChange',this._onKeyDirChange)
        );
    },

    /**
     * Unbinds the TD click delegated click listeners for initiating editing in TDs
     * @method _unbindCellEditingListeners
     * @private
     */
    _unbindCellEditingListeners: function(){
        if(this._subscrCellEditors) {
            Y.Array.each(this._subscrCellEditors,function(e){
                if(e && e.detach) {
                    e.detach();
                }
            });
            this._subscrCellEditors = null;
        }
    },

    /**
     * Sets up listeners for DT scrollable "scroll" events
     * @method _bindEditorScroll
     * @private
     */
    _bindEditorScroll: function() {
        this._subscrCellEditorScrolls = [];
        if(this._xScroll && this._xScrollNode) {
            this._subscrCellEditorScrolls.push( this._xScrollNode.on('scroll', this._onScrollUpdateCellEditor, this ) );
        }
        if(this._yScroll && this._yScrollNode) {
            this._subscrCellEditorScrolls.push( this._yScrollNode.on('scroll', this._onScrollUpdateCellEditor, this ) );
        }

    },


    /**
     * Listener that toggles the DT editable state, setting/unsetting the listeners associated with
     * cell editing.
     * @method _onEditableChange
     * @param o {EventFacade} Change event facade for "editable" attribute
     * @private
     */
    _onEditableChange: function(o) {
        if(o.newVal || o===true ) {

            this._bindEditable();

            // call overrideable method .... simple return by default
            this.bindEditorListeners();

            this._bindCellEditingListeners();
            this._buildColumnEditors();

        } else {

            this._unbindEditable();
            this._unbindCellEditingListeners();
            this._destroyColumnEditors();

        }

    },

    /**
     * Listener for changes on [defaultEditor](#attr_defaultEditor) attribute for this DT.
     * If the default editor is changed to a valid setting, we disable and re-enable
     * editing on the DT to reset the column editors.
     *
     * @method _onDefaultEditorChange
     * @param o {EventFacade} Change eventfacade for "defaultEditor" attribute
     * @private
     */
    _onDefaultEditorChange: function(o) {
        var defeditor = o.newVal;

        // if a valid editor is given AND we are in editing mode, toggle off/on ...
        if ( defeditor && defeditor.search(/none/i)===-1 && this.get('editable') ) {
            this.set('editable',false);
            this.set('editable',true);
        }
    },

    /**
     * Setter method for the [editOpenType](#attr_editOpenType) attribute, specifies what
     * TD event to listen to for initiating editing.
     * @method _setEditOpenType
     * @param v {String}
     * @private
     */
    _onEditOpenTypeChange: function() {
        //var eotype = o.newVal || o;
        if(this.get('editable')) {
            this.set('editable',false);
            this.set('editable',true);
        }
    },

    /**
     * Pre-scans the DT columns looking for column named editors and collects unique editors,
     * instantiates them, and adds them to the  _columnEditors array.  This method only creates
     * View instances that are required, through combination of _commonEditors and _columnEditors
     * properties.
     *
     * @method _buildColumnEditors
     * @private
     */
    _buildColumnEditors: function(){
        var cols     = this.get('columns'),
            defEditr = this.get('defaultEditor'),
            edName, colKey, editorInstance;

        if( !Y.DataTable.EditorOptions ) {
            return;
        }

        if( this._columnEditors || this._commonEditors ) {
            this._destroyColumnEditors();
        }

        this._commonEditors = {};
        this._columnEditors = {};

        //
        //  Set the default editor, if one is defined
        //
        defEditr = (defEditr && defEditr.search(/none|null/i) !==0 ) ? defEditr : null;

        //
        //  Loop over all DT columns ....
        //
        Y.Array.each(cols,function(c){
            if(!c) {
                return;
            }

            colKey = c.key || c.name;

            // An editor was defined (in column) and doesn't yet exist ...
            if(colKey && c.editable !== false) {

                edName = c.editor || defEditr;

                // This is an editable column, update the TD's for the editable column
                this._updateEditableColumnCSS(colKey,true);

                //this._editorColHash[colKey] = edName;

                //
                // If an editor is named, check if its definition exists, and that it is
                // not already instantiated.   If not, create it ...
                //

                // check for common editor ....
                if (edName && Y.DataTable.EditorOptions[edName]) {

                    if(c.editorConfig && Y.Lang.isObject(c.editorConfig) ) {

                        editorInstance = this._createCellEditorInstance(edName,c);

                        this._columnEditors[colKey] = editorInstance || null;

                    } else {

                        if( !this._commonEditors[edName] ) {
                            editorInstance = this._createCellEditorInstance(edName,c);
                            this._commonEditors[edName] = editorInstance;
                        }

                        this._columnEditors[colKey] = edName;

                    }

                }

            }
        },this);

    },

    /**
     * This method takes the given editorName (i.e. 'textarea') and if the default editor
     * configuration, adds in any column 'editorConfig' and creates the corresponding
     * cell editor View instance.
     *
     * Makes shallow copies of editorConfig: { overlayConfig, widgetConfig, templateObject }
     *
     * @method _createCellEditorInstance
     * @param editorName {String} Editor name
     * @param column {Object} Column object
     * @return editorInstance {View} A newly created editor instance for the supplied editorname and column definitions
     * @private
     */
    _createCellEditorInstance: function(editorName, column) {
        var conf_obj      = Y.clone(Y.DataTable.EditorOptions[editorName],true),
            BaseViewClass = Y.DataTable.EditorOptions[editorName].BaseViewClass,
            editorInstance;

        if(column.editorConfig && Y.Lang.isObject(column.editorConfig)) {
            conf_obj = Y.merge(conf_obj, column.editorConfig);

            if(column.editorConfig.overlayConfig) {
                conf_obj.overlayConfig = Y.merge(conf_obj.overlayConfig || {}, column.editorConfig.overlayConfig);
            }

            if(column.editorConfig.widgetConfig) {
                conf_obj.widgetConfig = Y.merge(conf_obj.widgetConfig || {}, column.editorConfig.widgetConfig);
            }

            if(column.editorConfig.templateObject) {
                conf_obj.templateObject = Y.merge(conf_obj.templateObject || {}, column.editorConfig.templateObject);
            }
            conf_obj.name = editorName;
        }

        delete conf_obj.BaseViewClass;

        //
        //  We have a valid base class, instantiate it
        //
        if(BaseViewClass){
            conf_obj.hostDT = this;
            editorInstance = new BaseViewClass(conf_obj);

            // make the one of this editor's targets ...
            editorInstance.addTarget(this);
        }

        return editorInstance;
    },

    /**
     * Loops through the column editor instances, destroying them and resetting the collection to null object
     * @method _destroyColumnEditors
     * @private
     */
    _destroyColumnEditors: function(){
        if( !this._columnEditors && !this._commonEditors ) {
            return;
        }

        var ces = this._getAllCellEditors();
        Y.Array.each(ces,function(ce){
            if(ce && ce.destroy) {
                ce.destroy();
              //  ce.destroy({remove:true});
            }
        });

        this._commonEditors = null;
        this._columnEditors = null;

        // remove editing class from all editable columns ...
        Y.Array.each( this.get('columns'), function(c){
            if(c.editable === undefined || c.editable === true) {
                this._updateEditableColumnCSS(c.key || c.name,false);
            }
        },this);

    },

    /**
     * Utility method to combine "common" and "column-specific" cell editor instances and return them
     * @method _getAllCellEditors
     * @return {Array} Of cell editor instances used for the current DT column configurations
     * @private
     */
    _getAllCellEditors: function() {
        var rtn = [];

        if( this._commonEditors ) {
            Y.Object.each(this._commonEditors,function(ce){
                if(ce && ce instanceof Y.View){
                    rtn.push(ce);
                }
            });
        }

        if( this._columnEditors ) {
            Y.Object.each(this._columnEditors,function(ce){
                if(ce && ce instanceof Y.View){
                    rtn.push(ce);
                }
            });
        }
        return rtn;
    },

    /**
     * Closes the active cell editor when a document ESC key is detected
     * @method _onKeyEsc
     * @param e {EventFacade} key listener event facade
     * @private
     */
    _onKeyEsc:  function(e) {
        if(e.keyCode===27) {
            this.hideCellEditor();
        }
    },


    /**
     * Listener to the "sort" event, so we can hide any open editors and update the editable column CSS
     *  after the UI refreshes
     * @method _afterEditableSort
     * @private
     */
    _afterEditableSort: function() {
        if(this.get('editable')) {
            this.hideCellEditor();
            this._updateAllEditableColumnsCSS();
        }
    },

    /**
     * Re-initializes the static props to null
     * @method _unsetEditor
     * @private
     */
    _unsetEditor: function(){
        // Finally, null out static props on this extension
        this._openEditor = null;
        this._openRecord = null;
        this._openColKey = null;
        this._openCell = null;
        this._openTd = null;
    },

    /**
     * Method to update all of the current TD's within the current DT to add/remove the editable CSS
     * @method _updateAllEditableColumnsCSS
     * @private
     */
    _updateAllEditableColumnsCSS : function() {
        if(this.get('editable')) {
            var cols = this.get('columns'),
                ckey;
            Y.Array.each(cols,function(col){
                ckey = col.key || col.name;
                if(ckey) {
                    this._updateEditableColumnCSS(ckey, true); //(flag) ? col.editable || true : false);
                }
            },this);
        }
    },

    /**
     * Method that adds/removes the CSS editable-column class from a DataTable column,
     * based upon the setting of the boolean "opt"
     *
     * @method _updateEditableColumnCSS
     * @param cname {String}  Column key or name to alter
     * @param opt {Boolean} True of False to indicate if the CSS class should be added or removed
     * @private
     */
    _updateEditableColumnCSS : function(cname,opt) {
        var tbody = this.get('contentBox').one('tbody.'+this.getClassName('data')),
            col   = (cname) ? this.getColumn(cname) : null,
            colEditable = col && col.editable !== false,
            tdCol;
        if(!cname || !col || !colEditable) {
            return;
        }

        colEditable = ( col.editor || (this.get('defaultEditor')!==null
            && this.get('defaultEditor').search(/none/i)!==0) ) ? true : false;

        if(!tbody || !colEditable) {
            return;
        }

        tdCol = tbody.all('td.'+this.getClassName('col',cname));

        if(tdCol && opt===true) {
            tdCol.addClass(this._classColEditable);
        } else if (tdCol) {
            tdCol.removeClass(this._classColEditable);
        }
    },

    /**
     * Listener to TD "click" events that hides a popup editor is not in the current cell
     * @method _handleCellClick
     * @param e
     * @private
     */
    _handleCellClick:  function(e){
        var td = e.currentTarget,
            cn = this.getColumnNameByTd(td);
        if (cn && this._openEditor &&  this._openEditor.get('colKey')!==cn) {
            this.hideCellEditor();
        }
    },

    /**
     * Listener that fires on a scrollable DT scrollbar "scroll" event, and updates the current XY position
     *  of the currently open Editor.
     *
     * @method _onScrollUpdateCellEditor
     * @private
     */
    _onScrollUpdateCellEditor: function(e) {
        //
        //  Only go into this dark realm if we have a TD and an editor is open ...
        //
        if(this.get('editable') && this.get('scrollable') && this._openEditor && this._openTd ) {

           var tar    = e.target,
               tarcl  = tar.get('className') || '',
               tr1    = this.getRow(0),
               trh    = (tr1) ? +tr1.getComputedStyle('height').replace(/px/,'') : 0,
               tdxy   = (this._openTd) ? this._openTd.getXY() : null,
               xmin, xmax, ymin, ymax, hidef;

            //
            // For vertical scrolling - check vertical 'y' limits
            //
            if( tarcl.search(/-y-/) !==-1 ) {

                ymin = this._yScrollNode.getY() + trh - 5;
                ymax = ymin + (+this._yScrollNode.getComputedStyle('height').replace(/px/,'')) - 2*trh;

                if(tdxy[1] >= ymin && tdxy[1] <= ymax ) {
                    if(this._openEditor.get('hidden')) {
                        this._openEditor.showEditor(this._openTd);
                    } else {
                        this._openEditor.set('xy', tdxy );
                    }
                } else {
                    hidef = true;
                }
            }

            //
            // For horizontal scrolling - check horizontal 'x' limits
            //
            if( tarcl.search(/-x-/) !==-1 ) {

                xmin = this._xScrollNode.getX();
                xmax = xmin + (+this._xScrollNode.getComputedStyle('width').replace(/px/,''));
                xmax -= +this._openTd.getComputedStyle('width').replace(/px/,'');

                if(tdxy[0] >= xmin && tdxy[0] <= xmax ) {
                    if(this._openEditor.get('hidden')) {
                        this._openEditor.showEditor(this._openTd);
                    } else {
                        this._openEditor.set('xy', tdxy );
                    }
                } else {
                    hidef = true;
                }
            }

            // If hidef is true, editor is out of view, hide it temporarily
            if(hidef) {
                this._openEditor.hideEditor(true);
            }

        }
    },

    /**
     * Listens to changes to an Editor's "keyDir" event, which result from the user
     * pressing "ctrl-" arrow key while in an editor to navigate to an cell.
     *
     * The value of "keyDir" is an Array of two elements, in [row,col] format which indicates
     * the number of rows or columns to be changed to from the current TD location
     * (See the base method .getCell)
     *
     * @method _onKeyDirChange
     * @param e {EventFacade} The attribute change event facade for the View's 'keyDir' attribute
     * @private
     */
    _onKeyDirChange : function(e) {
        var dir     = e.newVal,
            recIndex = this.data.indexOf(this._openRecord),
            col      = this.getColumn(this._openColKey),
            colIndex = Y.Array.indexOf(this.get('columns'),col),
            oldTd    = this._openTd,
            newTd, ndir, circ;

       this.hideCellEditor();

       //TODO: Implement "circular" mode, maybe thru an attribute to wrap col/row navigation
       if(circ) {

           if(dir[1] === 1 && colIndex === this.get('columns').length-1 ) {
               ndir = [0, -this.get('columns').length+1];
           } else if(dir[1] === -1 && colIndex === 0) {
               ndir = [0, this.get('columns').length-1];
           } else if(dir[0] === 1 && recIndex === this.data.size()-1 ) {
               ndir = [ -this.data.size()+1, 0];
           } else if(dir[0] === -1 && recIndex === 0) {
               ndir = [ this.data.size()-1, 0];
           }

           if(ndir) {
               dir = ndir;
           }

       }

       if(dir){
           newTd = this.getCell(oldTd, dir);
           if(newTd) {
               this.openCellEditor(newTd);
           }
       }
    },

    /**
     * Listener to the cell editor View's "editorCancel" event.  The editorCancel event
     * includes a return object with keys {td,cell,oldValue}
     *
     * @method _onCellEditorCancel
     * @param o {Object} Returned object from cell editor "editorCancel" event
     * @private
     */
    _onCellEditorCancel: function(o){
        if(o.cell && this._openRecord && this._openColKey) {
            var cell   = o.cell,
                colKey = cell.colKey || this._openColKey,
                record = this.data.getByClientId(cell.recClientId) || this._openRecord,
                ename  = this._openEditor.get('name');

            if(!this._openEditor.get('hidden')) {
                this.hideCellEditor();
            }

            this.fire('cellEditorCancel',{
                td:         o.td,
                cell:       cell,
                record:     record,
                colKey:     colKey,
                prevVal:    o.oldValue,
                editorName: ename
            });
        }

    },

    /**
     * Fired when the open Cell Editor has sent an 'editorCancel' event, typically from
     * a user cancelling editing via ESC key or "Cancel Button"
     * @event cellEditorCancel
     * @param {Object} rtn Returned Object
     *  @param {Node} td The TD Node that was edited
     *  @param {Object} cell The cell object container for the edited cell
     *  @param {Model} record Model instance of the record data for the edited cell
     *  @param {String} colKey Column key (or name) of the edited cell
     *  @param {String|Number|Date} prevVal The old (last) value of the underlying data for the cell
     *  @param {String} editorName The name attribute of the editor that updated this cell
     */

    /**
     * Listener to the cell editor View's "editorSave" event, that when fired will
     * update the Model's data value for the approrpriate column.
     *
     * The editorSave event includes a return object with keys {td,cell,newValue,oldValue}
     *
     * Note:  If a "sync" layer DOES NOT exist (i.e. DataSource), implementers can listen for
     * the "saveCellEditing" event to send changes to a remote data store.
     *
     * @method _onCellEditorSave
     * @param o {Object} Returned object from cell editor "editorSave" event
     * @private
     */
    _onCellEditorSave: function(o){
        if(o.cell && this._openRecord && this._openColKey) {
            var cell   = o.cell,
                colKey = cell.colKey || this._openColKey,
                record = this.data.getByClientId(cell.recClientId) || this._openRecord,
                ename  = this._openEditor.get('name');

            if(record){
                record.set(this._openColKey, o.newValue);
            }

            this.hideCellEditor();

            this.fire('cellEditorSave',{
                td:         o.td,
                cell:       cell,
                record:     record,
                colKey:     colKey,
                newVal:     o.newValue,
                prevVal:    o.oldValue,
                editorName: ename
            });

        }

    }

    /**
     * Event fired after a Cell Editor has sent the 'editorSave' event closing an editing session.
     * The event signature includes pertinent data on the cell, TD, record and column that was
     * edited along with the prior and new values for the cell.
     * @event cellEditorSave
     * @param {Object} rtn Returned Object
     *  @param {Node} td The TD Node that was edited
     *  @param {Object} cell The cell object container for the edited cell
     *  @param {Model} record Model instance of the record data for the edited cell
     *  @param {String} colKey Column key (or name) of the edited cell
     *  @param {String|Number|Date} newVal The new (updated) value of the underlying data for the cell
     *  @param {String|Number|Date} prevVal The old (last) value of the underlying data for the cell
     *  @param {String} editorName The name attribute of the editor that updated this cell
     */

});

Y.DataTable.Editable = DtEditable;
Y.Base.mix(Y.DataTable, [Y.DataTable.Editable]);

/**
 * This object is attached to the DataTable namespace to allow addition of "editors" in conjunction
 * with the Y.DataTable.Editable module.
 *
 * (See modules gallery-datatable-celleditor-popup and gallery-datatable-celleditor-inline for
 *  examples of the content of this object)
 *
 * @class Y.DataTable.EditorOptions
 * @extends Y.DataTable
 * @type {Object}
 * @since 3.8.0
 */
Y.DataTable.EditorOptions = {};


}, 'gallery-2013.01.16-21-05', {"supersedes": [""], "skinnable": "true", "requires": ["datatable-base", "datatype"], "optional": [""]});
