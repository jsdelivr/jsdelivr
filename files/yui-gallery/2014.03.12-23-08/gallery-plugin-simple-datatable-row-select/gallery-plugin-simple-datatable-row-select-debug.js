YUI.add('gallery-plugin-simple-datatable-row-select', function(Y) {


var SELECTED_ROWS = 'selectedRows',
    EVENTS = {
      ROW_SELECTED : 'rowSelected'
    };

 /**
 * Adds row select functionality to Simple Datatable
 *
 * @class SDTRowSelect
 * @extends Plugin.Base
 * @version 1.3.0
 */
Y.Plugin.SDTRowSelect = Y.Base.create('simple-datatable-row-select', Y.Plugin.Base, [], {

  //  P U B L I C  //
  _host : null,
  /**
   * Classname of the widget. Used to prevent multiple look ups
   * @since 1.0.0
   */
  className : null,

  /**
   * Provides a reference to the table body
   * @since 1.0.0
   */
  tBody : null,

  _delegateEnter : null,
  _delegateLeave : null,
  _delegateClick : null,


  /**
   * Binds event to host render for setup kickoff. Binds to host
   *   rowsUpdated to reselect the row after changes
   * @since 1.0.0
   * @public
   * @method initializer
   */
  initializer : function() {
    Y.log('initializer','info','plugin-row-select');
    this._host = this.get('host');
    this._host.get('boundingBox').addClass(this._host.getClassName('row-select'));
    this.afterHostMethod('setRows', this._afterHostSetRows);
    if(this._host.rowsSet) {
      this._afterHostSetRows();
    }
    this.afterHostEvent('render', this._setup);
  },

  /**
   * House keeping after a we are unplugged
   *
   */
  destructor : function() {
    Y.log('destructor', 'info', 'plugin-row-select');
    var rowSelectClass = this._host.getClassName('row-select'),
        overClass = this._host.getClassName('over');

    this._host.get('boundingBox').removeClass(rowSelectClass);
    this._delegateEnter.detach();
    this._delegateLeave.detach();
    this._delegateClick.detach();

    this._host.get('boundingBox').all('.' + overClass).removeClass(overClass);

    this.get('selectedRows').each(function(row) {
      this._unselectRow(row);
    }, this);
  },

  /**
   * Returns the index in the array list of the row. Returns -1 if
   *   the row is not found
   * @since 1.0.0
   * @public
   * @method isSelected
   * @param row Y.Node
   */
  isSelected : function(row) {
    Y.log('isSelected','info','plugin-row-select');
    return this.get(SELECTED_ROWS).indexOf(row);
  },

  //  P R O T E C T E D  //
  /**
   * Publishes rowSelected event. Delegates mouse events to rows.
   * @since 1.0.0
   * @protected
   * @method _setup
   */
  _setup : function() {
    Y.log('_setup','info','plugin-row-select');
    var cb = this._host.get('contentBox'),
        overClass;
    this.className = this.get('host').getClassName();
    this.publish(EVENTS.ROW_SELECTED, {defaultFn: this._defSelectedFn});

    overClass = this.className + '-over';

    // allow for row highlight
    this._delegateEnter = cb.delegate('mouseenter', function(e){
      e.currentTarget.addClass(overClass);
    },'tbody tr:not([selectable="false"])');

    this._delegateLeave = cb.delegate('mouseleave', function(e){
      e.currentTarget.removeClass(overClass);
    },'tbody tr:not([selectable="false"])');

    // update selected row
    this._delegateClick = cb.delegate('click', function(e){
      this.fire(EVENTS.ROW_SELECTED, {rowTarget: e.currentTarget});
    },'tbody tr:not([selectable="false"])',this);
  },

  /**
   * Default function when a row is selected. When selected row is
   *   clicked again, removes the row from being selected.
   * @since 1.0.0
   * @protected
   * @method _defSelectedFn
   * @param e Event
   */
  _defSelectedFn : function(e) {
    Y.log('_defSelectedFn','info','plugin-row-select');

    if(this.isSelected(e.rowTarget) > -1 && this.get('toggleSelect')) {
      this._unselectRow(e.rowTarget);
    }else{
      this._selectRow(e.rowTarget);
    }
  },

  /**
   * Called when the host rows data has changed
   * @since 1.0.0
   * @protected
   * @method _afterHostRowsChanged
   * @param e Event
   */
  _afterHostSetRows : function(e) {
    Y.log('_afterHostSetRows','info','plugin-row-select');
    var discoveredRow = null,
        currentRows = this.get(SELECTED_ROWS);

    // empty the array list
    this.set(SELECTED_ROWS, new Y.ArrayList() );

    // update tbody
    this.tBody = this._host.get('contentBox').one('tbody');

    // loop through rows and reselect it if it's present
    currentRows.each(function(row) {
      discoveredRow = this.tBody.one('#' + row.get('id'));
      if(discoveredRow) {
        this._selectRow(discoveredRow);
      }
      discoveredRow = null;
    },this);
  },

  /**
   * Adds the row to the selectedRows list. If multiSelect is false,
   *   removes all other rows first.
   * @since 1.0.0
   * @see _unselectRow
   * @protected
   * @method _selectRow
   * @param row Y.Node
   */
  _selectRow : function(row) {
    Y.log('_selectRow','info','plugin-row-select');
    if(!this.get('multiSelect')) {
      this.get(SELECTED_ROWS).each(function(item) {
        this._unselectRow(item);
      }, this);
    }
    this.get(SELECTED_ROWS).add(row);
    row.addClass(this.className + '-selected');
  },

  /**
   * Removes row from the selectedRows list.
   * @since 1.0.0
   * @protected
   * @method _selectRow
   * @param row Y.Node
   */
  _unselectRow : function(row) {
    Y.log('_unselectRow','info','plugin-row-select');
    this.get(SELECTED_ROWS).remove(row, true);
    row.removeClass(this.className + '-selected');
  }

}, {
  NS : 'rowSelect',
  EVENTS : EVENTS,
  ATTRS : {
    selectedRows : {
      value : new Y.ArrayList()
    },
    multiSelect : {
      value : false
    },
    toggleSelect : {
      value : true
    }
  }
});


}, 'gallery-2010.09.08-19-45' ,{requires:['plugin', 'collection']});
