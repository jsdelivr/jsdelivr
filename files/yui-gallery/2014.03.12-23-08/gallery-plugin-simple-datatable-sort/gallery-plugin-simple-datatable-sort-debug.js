YUI.add('gallery-plugin-simple-datatable-sort', function(Y) {

var SORT = {
      ASC : 'asc',
      DESC : 'desc',
      KEY : 'key',
      DIRECTION : 'direction'
    };

Y.Plugin.SDTSort= Y.Base.create('sdt-sort', Y.Plugin.Base, [], {

  _host : null,

  _tHead : null,

  _sortCell : null,

  _newKey : false,

  _newSort : false,

  _delegate : null,

  initializer : function() {
    Y.log('initializer','info','plugin-sort');
    this._host = this.get('host');
    this._host.get('boundingBox').addClass(this._host.getClassName('sort'));
    this.afterHostMethod('setHeaders', this._updateTable);
    if(this._host.headersSet) {
      this._updateTable();
    }
    this.afterHostEvent('render', this._setup);
  },

  /**
   * House keeping after a we are unplugged
   *
   */
  destructor : function() {
    this._host.get('boundingBox').removeClass(this._host.getClassName('sort'));
    this._delegate.detach();
  },

  /**
   * Alternates the sort direction keeping the column selected the same
   * @since 1.0.0
   * @see _toggleSort
   * @method toggleSort
   * @return this
   * @chainable
   */
  toggleSort : function() {
    Y.log('toggleSort','info','plugin-sort');
    this._toggleSort();
    return this;
  },

  /**
   * Updates the selected column to the one provided.
   * Sorting by new key will automatically adjust the direction to ASC
   * @since 1.1.0
   * @method sortBy
   * @param key
   * @return this
   * @chainable
   */
  sortBy : function(key) {
    Y.log('sortBy','info','plugin-sort');
	this._sortCell = this._host.get('boundingBox').one('th.yui3-sdt-col-' + key);
	this._newKey = true;
    this.set(SORT.KEY, key);
    return this;
  },


  //  P R O T E C T E D  //

  /**
   *
   */
  _setup : function() {
    Y.log('_setup','info','plugin-sort');
    this.publish('sort', {defaultFn: this._defSortFn});

    this.after(SORT.KEY + 'Change', this._afterKeyChange);
    this.on(SORT.DIRECTION + 'Change', this._onDirectionChange);
    this.after(SORT.DIRECTION + 'Change', this._afterDirectionChange);

    // sort on header click
    this._delegate = this._tHead.delegate('click', function(e){
      this.fire('sort', {headerTarget: e.currentTarget});
    },'th:not([sortable="false"])',this);
  },

  /**
   *
   * @since 1.0.0
   * @protected
   * @method _updateTable
   */
  _updateTable : function(){
    Y.log('_updateTable','info','plugin-sort');
    var ascClass = this.get('ascClass'),
        descClass = this.get('descClass'),
        key = this.get(SORT.KEY),
        dir = this.get(SORT.DIRECTION),
        rows = this._host.get('rows'),
        oldToString;

    this._tHead = this._host.get('contentBox').one('thead');
    this._tHead.all('th .yui3-sdt-liner').each(function(th){
      if(!th.one('.yui3-icon')){
        th.append('<span class="yui3-icon"></span>');
      }
    });

    if(this._newSort && !this._newKey) {
      this._reverseTable();
    }else{
      // clear class names and set sorted column classname to direction class

      if(this._sortCell) {

        oldToString = Object.prototype.toString;
        Object.prototype.toString = function(){ return this[key]; };
        rows.sort();
        Object.prototype.toString = oldToString;

        if(dir === SORT.DESC) {
          rows.reverse();
        }

        this._host.setRows(rows);
        this._host.set('rows',rows);
      }
    }

    if(this._sortCell) {
      this._tHead.all('.' + ascClass).removeClass(ascClass);
      this._tHead.all('.' + descClass).removeClass(descClass);

      this._sortCell.addClass(this.get(dir + 'Class'));
    }
  },

  _reverseTable : function() {
    var tb = this._host.get('contentBox').one('tbody'),
        i, l;

    this._host.set('row', this._host.get('rows').reverse());

    for(i=0, l = tb.all('tr').size(); i < l; i++) {
      tb.insert(tb.one('tr:last-child').remove(), i);
    }
  },

  /**
   * Default function when a column is selected to sort. If key is
   *   not a new key, simply calls _toggleSort
   * @since 1.1.0
   * @see _toggleSort
   * @protected
   * @method _defSortFn
   * @param e
   */
  _defSortFn : function(e){
    Y.log('_defSortFn','info','plugin-sort');
    // check to see if we are reversing the current column, or sorting a new one
    var selectedKey = e.headerTarget.getAttribute(SORT.KEY);

    this._sortCell = e.headerTarget;

    if(this.get(SORT.KEY) !== selectedKey) {
      this._newKey = true;
      this.set(SORT.KEY, selectedKey);
    }else{
      this._newKey = false;
      this._toggleSort();
    }
  },

  /**
   * This method fires after the sort key is changed
   * Sets the new direction to asc
   * @since 1.1.0
   * @protected
   * @method _afterKeyChange
   * @param e
   */
  _afterKeyChange : function(e) {
    Y.log('_afterKeyChange','info','plugin-sort');

    if(this._sortCell.hasAttribute('defDirection')) {
      this.set(SORT.DIRECTION, this._sortCell.getAttribute('defDirection'));
    }else{
      this.set(SORT.DIRECTION, SORT.ASC);
    }
  },

  /**
   * Updates the table on the sort direction if it's not changing.
   * @since 1.1.0
   * @see _updateTable
   * @protected
   * @method _onDirectionChange
   * @param e
   */
  _onDirectionChange : function(e) {
    Y.log('_onDirectionChange','info','plugin-sort');
    if(e.newVal === e.prevVal) {
      this._newSort = false;
      this._updateTable();
    }else{
      this._newSort = true;
    }
  },

  /**
   * Updates the table after the sort direction has been changed.
   * @since 1.1.0
   * @see _updateTable
   * @protected
   * @method _afterDirectionChange
   * @param e
   */
  _afterDirectionChange : function(e) {
    Y.log('_afterDirectionChange','info','plugin-sort');
    this._updateTable();
  },

  /**
   * Custom array sort to sort object by key and direction
   * @since 1.1.1
   * @protected
   * @method keySort
   * @param key
   * @param method
   * @param a
   * @param b
   * @return int -1,0,1
   */
  _keySort : function(key, dir, a,b) {
    Y.log('_keySort','info','plugin-sort');
    a = a[key];
    b = b[key];

    if(Y.Lang.isString(a)) {
      a = a.toLowerCase();
      b = b.toString().toLowerCase();
    }

    if(a == b) { return 0; }
    if(a >  b) { return (dir === SORT.DESC) ? -1 : 1; }
    return (dir === SORT.ASC) ? -1 : 1;
  },

  /**
   * Checks the current direction and set to the opposite
   * @since 1.1.0
   * @protected
   * @method _toggleSort
   */
  _toggleSort : function() {
    Y.log('_toggleSort','info','plugin-sort');
    this.set(SORT.DIRECTION, (this.get(SORT.DIRECTION) === SORT.ASC) ? SORT.DESC : SORT.ASC );
  }

}, {

  NS : 'sort',

  SORT : SORT,

  ATTRS : {
    /**
     * Ability to customize the class used when sorted ASC
     * @since 1.1.0
     * @attribute ascClass
     * @type string
     */
    ascClass : {
      value : 'yui3-type-control-s'
    },

    /**
     * Ability to customize the class used when sorted DESC
     * @since 1.1.0
     * @attribute descClass
     * @type string
     */
    descClass : {
      value : 'yui3-type-control-n'
    },

    /**
     * Key representing the current column sorted
     * @since 1.0.0
     * @attribute sortKey
     * @type string
     */
    key : {
      validator : function(val) {
        return (this.get('host').get('headers')[val]) ? true : false;
      }
    },

    /**
     * String representing the direction the column selected is sorted
     * @since 1.0.0
     * @attribute sortDirection
     * @type string
     */
    direction : {
      setter : function (val) {
        return (val === SORT.DESC) ? SORT.DESC : SORT.ASC;
      }
    }

  }
});


}, 'gallery-2011.03.11-23-49' ,{requires:['plugin','event','selector-css3']});
