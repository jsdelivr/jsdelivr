YUI.add('gallery-plugin-simple-datatable-paginate-client', function(Y) {

/**
 * A paginate plugin that handles item paging on the client. All items must be
 *   loaded into the datatable for the paginate plugin to page the items.
 * @class SDTPaginateClient
 * @extends Y.Plugin.Paginate.Base
 * @version 1.0.0
 */
Y.namespace('Plugin').SDTPaginateClient = Y.Base.create('sdt-paginate-client', Y.Plugin.Paginate.Base, [], {

  /**
   * Attaches default after events to changes in logic sesitive attributes
   * @public
   * @method initializer
   * @return void
   * @since 1.0.0
   */
  initializer : function () {
    this.afterHostEvent('rowsChange', this._afterHostRowsChange);
    this.afterHostEvent('render', this._setup);
  },

  destructor : function() {
    var host = this.get('host');
    host.setRows(host.get('rows'));
  },

  /**
   * Requeries the data and reflows the content
   * @public
   * @method refresh
   * @return this
   * @chainable
   * @since 1.0.0
   */
  refresh : function() {

    var items = this.get('items'),
        pagedItems = [], currentIndex;

    if(!items) {
      this._setup();
      return this;
    }

    this._updateCurrentIndex();

    currentIndex = this.get('currentIndex') - 1;

    pagedItems = items.slice(currentIndex, Math.min(items.length, currentIndex + this.get('itemsPerPage')));

    this.get('host').setRows(pagedItems);

    return this;
  },

  /**
   * Updates widget with new paged content
   * @protected
   * @method _afterCurrentPageNumberChange
   * @return void
   * @since 1.0.0
   */
  _afterCurrentPageNumberChange : function(e) {
    this.refresh();
  },
  
  _setup : function(e) {
    var items = this.get('host').get('rows');
    this.set('totalItems', items.length);
    this.set('items', items);
    this.refresh();
  },

  _afterHostRowsChange : function(e) {
    this._setup();
  }


}, {
  NS : 'paginate',
  ATTRS : {
    items : {}
  }
});


}, 'gallery-2010.09.08-19-45' ,{requires:['gallery-plugin-paginate-base']});
