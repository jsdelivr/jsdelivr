YUI.add('gallery-plugin-simple-datatable-filter', function(Y) {


Y.namespace('Plugin').SDTFilter = Y.Base.create('sdt-filter', Y.Plugin.Base, [], {

    _hostCache : null,
	
	_workingCache : null,
	
	_searchColumns : {},
	
	_host : null,
	
    initializer : function() {
		Y.log('initializer', 'info', 'Y.Plugin.SDTFilter');
		
		this._host = this.get('host');
        this._hostCache = this._host.get('rows');
		this.recache();
		
        // _updateCache when host changes
		this.beforeHostMethod('setRows', this._updateCacheFromMethod, this);
        this.afterHostEvent('rowsChange', this._updateCacheFromEvent, this);
		
		// autorun filterby on plug
		if(this.get('filterBy')) {
			this.filter(this.get('filterBy'));
		}
    },
	
	recache : function() {
		Y.log('recache', 'info', 'Y.Plugin.SDTFilter');
		this._workingCache = this._hostCache.concat();
	},
	
	destructor : function() {
		Y.log('destructor', 'info', 'Y.Plugin.SDTFilter');
		this._host._buildRows(this._hostCache);
	},

    search : function(val) {
		Y.log('search', 'info', 'Y.Plugin.SDTFilter');
        return (val instanceof RegExp) ? this.searchByRegExp(val) : this.searchByString(val);
    },
	
	multiSearch : function(obj) {
		Y.log('multiSearch', 'info', 'Y.Plugin.SDTPlugin');
		var key;
		for (key in obj) {
			this.set('column', key);
			this.search( obj[key] );
		}
		return this._workingCache;
	},

    searchByRegExp : function(exp) {
		Y.log('searchByRegExp', 'info', 'Y.Plugin.SDTFilter');
		
		var rows = [], i, l, rowObj, item,
		column = this.get('column');
		
        // indexOf val
		for (i = 0, l = this._workingCache.length; i<l; i++) {
		
			rowObj = this._workingCache[i];
			if (column) {
				if (rowObj[column]) {
					item = rowObj[column];
					
					if (exp.test(item)) {
						rows.push(rowObj);
						continue;
					}
				}
			} else {
				for (column in rowObj) {
					if (column.substring(0,2) === '__') {
						continue;
					}
					if (rowObj[column]) {
						item = rowObj[column].toString();
						if (exp.test(item)) {
							rows.push(rowObj);
							break;
						}
					}
				}
				column = null;
			}
		}

        // return array of rows
		this._workingCache = rows;
		return rows;
    },

    searchByString : function(val) {
		Y.log('searchByString', 'info', 'Y.Plugin.SDTFilter');
		
		var rows = [], i, l, rowObj, item,
		column = this.get('column'), 
		strict = this.get('strict');
        // indexOf val
		for (i = 0, l = this._workingCache.length; i<l; i++) {
		
			rowObj = this._workingCache[i];
			if (column) {
				if (rowObj[column]) {
					item = rowObj[column].toString();
					
					if (strict) {
						if (item.indexOf(val) >= 0) {
							rows.push(rowObj);
							continue;
						}
					} else {
						if (item.toLowerCase().indexOf(val.toLowerCase()) >= 0) {
							rows.push(rowObj);
							continue;
						}
					}
				}
			} else {
				for (column in rowObj) {
					if (column.substring(0,2) === '__') {
						continue;
					}
					if (rowObj[column]) {
						item = rowObj[column].toString();
						if (strict) {
							if (item.indexOf(val) >= 0) {
								rows.push(rowObj);
								break;
							}
						} else {
							if (item.toLowerCase().indexOf(val.toLowerCase()) >= 0) {
								rows.push(rowObj);
								break;
							}
						}
					}
				}
				column = null;
			}
		}

        // return array of rows
		this._workingCache = rows;
		return rows;
    },

	filterOn : function(column, value) {
		Y.log('filterOn', 'info', 'Y.Plugin.SDTFilter');
		if (this._searchColumns[column]) {
			// need to refilter from the original host cache
			this.recache();
			this._searchColumns[column] = value;
			this._updateHost( this.multiSearch(this._searchColumns) );
		} else {
			// new column, continue filter from working cache
			this._searchColumns[column] = value;
			this.set('column', column);
			this._updateHost( this.search(value) );
		}
	},
	
    filter : function(val) {
		Y.log('filter', 'info', 'Y.Plugin.SDTFilter');
		
		this.set('filterBy', val);
		this.recache();
		
        // if not array, get array from this.search(val)
		if (!Y.Lang.isArray(val)) {
		  val = this.search(val);
		}
		
        this._updateHost(val);
    },
	
	_updateCacheFromMethod : function(rows) {
		Y.log('_updateCacheFromParam', 'info', 'Y.Plugin.SDTFilter');
		
		var filterBy = this.get('filterBy');
        this._hostCache = rows;
		this.recache();
		
		if (this.get('refilterOnUpdate') && filterBy) {
			this.filter(filterBy);
			return new Y.Do.Prevent();
		}
	},

    _updateCacheFromEvent : function(e) {
		Y.log('_updateCache', 'info', 'Y.Plugin.SDTFilter');
		
		var filterBy = this.get('filterBy');
        this._hostCache = e.newVal;
		this.recache();
		
		if (this.get('refilterOnUpdate') && filterBy) {
			this.filter(filterBy);
		}
    },
	
    _updateHost : function(rows) {
		Y.log('_filter', 'info', 'Y.Plugin.SDTFilter');
		this._host._buildRows(rows);
    }

}, {
	NS : 'filter',
	ATTRS : {
	    filteredRows : {
			readOnly : true
		},
		column : {
			value : ''
		},
		filterBy : {},
		refilterOnUpdate : {
		  value : true
		},
		strict : {
		  value : false
		}
	}
});


}, 'gallery-2010.12.10-17-31' ,{requires:['base-build','plugin']});
