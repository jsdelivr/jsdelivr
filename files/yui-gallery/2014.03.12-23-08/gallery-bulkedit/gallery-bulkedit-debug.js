YUI.add('gallery-bulkedit', function (Y, NAME) {

"use strict";

/**
 * @module gallery-bulkedit
 */

/**********************************************************************
 * <p>BulkEditDataSource manages a YUI DataSource + diffs (insertions,
 * removals, changes to values).</p>
 * 
 * <p>The YUI DataSource must be immutable, e.g., if it is an XHR
 * datasource, the data must not change.</p>
 * 
 * <p>By using a DataSource, we can support both client-side pagination
 * (all data pre-loaded, best-effort save allowed) and server-side
 * pagination (load data when needed, only all-or-nothing save allowed).
 * Server-side pagination is useful when editing a large amount of existing
 * records or after uploading a large number of new records. (Store the new
 * records in a scratch space, so everything does not have to be sent back
 * to the client after parsing.)  In the case of bulk upload, server-side
 * validation will catch errors in unviewed records.</p>
 * 
 * <p>The responseSchema passed to the YUI DataSource must include a
 * comparator for each field that should not be treated like a string.
 * This comparator can either be 'string' (the default), 'integer',
 * 'decimal', 'boolean', or a function which takes two arguments.</p>
 *
 * @class BulkEdit
 * @namespace DataSource
 * @extends DataSource.Local 
 * @constructor
 * @param config {Object}
 */
function BulkEditDataSource()
{
	BulkEditDataSource.superclass.constructor.apply(this, arguments);
}

BulkEditDataSource.NAME = "bulkEditDataSource";

BulkEditDataSource.ATTRS =
{
	/**
	 * The original data.  This must be immutable, i.e., the values must
	 * not change.
	 * 
	 * @attribute ds
	 * @type {DataSource}
	 * @required
	 * @writeonce
	 */
	ds:
	{
		writeOnce: true
	},

	/**
	 * The function to convert the initial request into a request usable by
	 * the underlying DataSource.  This function takes one argument: state
	 * (startIndex,resultCount,...).
	 * 
	 * @attribute generateRequest
	 * @type {Function}
	 * @required
	 * @writeonce
	 */
	generateRequest:
	{
		validator: Y.Lang.isFunction,
		writeOnce: true
	},

	/**
	 * The name of the key in each record that stores an identifier which
	 * is unique across the entire data set.
	 * 
	 * @attribute uniqueIdKey
	 * @type {String}
	 * @required
	 * @writeonce
	 */
	uniqueIdKey:
	{
		validator: Y.Lang.isString,
		writeOnce: true
	},

	/**
	 * The function to call to generate a unique id for a new record.  The
	 * default generates "bulk-edit-new-id-#".
	 * 
	 * @attribute generateUniqueId
	 * @type {Function}
	 * @writeonce
	 */
	generateUniqueId:
	{
		value: function()
		{
			idCounter++;
			return uniqueIdPrefix + idCounter;
		},
		validator: Y.Lang.isFunction,
		writeOnce: true
	},

	/**
	 * OGNL expression telling how to extract the startIndex from the
	 * received data, e.g., <code>.meta.startIndex</code>.  If it is not
	 * provided, startIndex is always assumed to be zero.
	 * 
	 * @attribute startIndexExpr
	 * @type {String}
	 * @writeonce
	 */
	startIndexExpr:
	{
		validator: Y.Lang.isString,
		writeOnce: true
	},

	/**
	 * OGNL expression telling where in the response to store the total
	 * number of records, e.g., <code>.meta.totalRecords</code>.  This is
	 * only appropriate for DataSources that always return the entire data
	 * set.
	 * 
	 * @attribute totalRecordsReturnExpr
	 * @type {String}
	 * @writeonce
	 */
	totalRecordsReturnExpr:
	{
		validator: Y.Lang.isString,
		writeOnce: true
	},

	/**
	 * The function to call to extract the total number of
	 * records from the response.
	 * 
	 * @attribute extractTotalRecords
	 * @type {Function}
	 * @required
	 * @writeonce
	 */
	extractTotalRecords:
	{
		validator: Y.Lang.isFunction,
		writeOnce: true
	}
};

var uniqueIdPrefix = 'bulk-edit-new-id-',
	idCounter = 0,

	inserted_prefix = 'be-ds-i:',
	inserted_re     = /^be-ds-i:/,
	removed_prefix  = 'be-ds-r:',
	removed_re      = /^be-ds-r:/;

BulkEditDataSource.comparator =
{
	'string': function(a,b)
	{
		return (Y.Lang.trim(a.toString()) === Y.Lang.trim(b.toString()));
	},

	'integer': function(a,b)
	{
		return (parseInt(a,10) === parseInt(b,10));
	},

	'decimal': function(a,b)
	{
		return (parseFloat(a,10) === parseFloat(b,10));
	},

	'boolean': function(a,b)
	{
		return (((a && b) || (!a && !b)) ? true : false);
	}
};

function fromDisplayIndex(
	/* int */ index)
{
	var count = -1;
	for (var i=0; i<this._index.length; i++)
	{
		var j = this._index[i];
		if (!removed_re.test(j))
		{
			count++;
			if (count === index)
			{
				return i;
			}
		}
	}

	return false;
}

function adjustRequest()
{
	var r = this._callback.request;
	this._callback.adjust =
	{
		origStart: r.startIndex,
		origCount: r.resultCount
	};

	if (!this._index)
	{
		return;
	}

	// find index of first record to request

	var start = Math.min(r.startIndex, this._index.length);
	var end   = 0;
	for (var i=0; i<start; i++)
	{
		var j = this._index[i];
		if (!inserted_re.test(j))
		{
			end++;
		}

		if (removed_re.test(j))
		{
			start++;
		}
	}

	r.startIndex = end;

	this._callback.adjust.indexStart = i;

	// adjust number of records to request

	var count = 0;
	while (i < this._index.length && count < this._callback.adjust.origCount)
	{
		var j = this._index[i];
		if (inserted_re.test(j))
		{
			r.resultCount--;
		}

		if (removed_re.test(j))
		{
			r.resultCount++;
		}
		else
		{
			count++;
		}

		i++;
	}

	this._callback.adjust.indexEnd = i;
}

function internalSuccess(e)
{
	if (!e.response || e.error ||
		!Y.Lang.isArray(e.response.results))
	{
		internalFailure.apply(this, arguments);
		return;
	}

	// synch response arrives before setting _tId

	if (!Y.Lang.isUndefined(this._callback._tId) &&
		e.tId !== this._callback._tId)
	{
		return; 	// cancelled request
	}

	this._callback.response = e.response;
	checkFinished.call(this);
}

function internalFailure(e)
{
	if (e.tId === this._callback._tId)
	{
		this._callback.error    = e.error;
		this._callback.response = e.response;
		this.fire('response', this._callback);
	}
}

function checkFinished()
{
	if (this._generatingRequest || !this._callback.response)
	{
		return;
	}

	if (!this._fields)
	{
		this._fields = {};
		Y.Array.each(this.get('ds').schema.get('schema').resultFields, function(value)
		{
			if (Y.Lang.isObject(value))
			{
				this._fields[ value.key ] = value;
			}
		},
		this);
	}

	var response = {};
	Y.mix(response, this._callback.response);
	response.results = [];
	response         = Y.clone(response, true);

	var dataStartIndex = 0;
	if (this.get('startIndexExpr'))
	{
		eval('dataStartIndex=this._callback.response'+this.get('startIndexExpr'));
	}

	var startIndex   = this._callback.request.startIndex - dataStartIndex;
	response.results = this._callback.response.results.slice(startIndex, startIndex + this._callback.request.resultCount);

	// insertions/removals

	if (!this._index)
	{
		if (this.get('totalRecordsReturnExpr'))
		{
			eval('response'+this.get('totalRecordsReturnExpr')+'='+this._callback.response.results.length);
		}
		this._count = this.get('extractTotalRecords')(response);

		this._index = [];
		for (var i=0; i<this._count; i++)
		{
			this._index.push(i);
		}
	}
	else
	{
		var adjust = this._callback.adjust;
		for (var i=adjust.indexStart, k=0; i<adjust.indexEnd; i++, k++)
		{
			var j = this._index[i];
			if (inserted_re.test(j))
			{
				var id = j.substr(inserted_prefix.length);
				response.results.splice(k,0, Y.clone(this._new[id], true));
			}
			else if (removed_re.test(j))
			{
				response.results.splice(k,1);
				k--;
			}
		}
	}

	// save results so we can refer to them later

	var uniqueIdKey = this.get('uniqueIdKey');

	if (!this._callback.request.out_of_band)
	{
		this._records   = [];
		this._recordMap = {};

		Y.Array.each(response.results, function(value)
		{
			var rec = Y.clone(value, true);
			this._records.push(rec);
			this._recordMap[ rec[ uniqueIdKey ] ] = rec;
		},
		this);
	}

	// merge in diffs

	Y.Array.each(response.results, function(rec)
	{
		var diff = this._diff[ rec[ uniqueIdKey ] ];
		if (diff)
		{
			Y.mix(rec, diff, true);
		}
	},
	this);

	this._callback.response = response;
	this.fire('response', this._callback);
}

Y.extend(BulkEditDataSource, Y.DataSource.Local,
{
	initializer: function(config)
	{
		if (!(config.ds instanceof Y.DataSource.Local))
		{
			Y.error('BulkEditDataSource requires DataSource');
		}

		if (!config.generateRequest)
		{
			Y.error('BulkEditDataSource requires generateRequest function');
		}

		if (!config.uniqueIdKey)
		{
			Y.error('BulkEditDataSource requires uniqueIdKey configuration');
		}

		if (!config.extractTotalRecords)
		{
			Y.error('BulkEditDataSource requires extractTotalRecords function');
		}

		this._index = null;
		this._count = 0;
		this._new   = {};
		this._diff  = {};
	},

	/**
	 * @method _dataIsLocal
	 * @protected
	 * @return {boolean} true if the raw data is stored locally
	 */
	_dataIsLocal: function()
	{
		return (Y.Lang.isArray(this.get('ds').get('source')));
	},

	/**
	 * Flush the underlying datasource's cache.
	 * 
	 * @method _flushCache
	 * @protected
	 */
	_flushCache: function()
	{
		var ds = this.get('ds');
		if (ds.cache && Y.Lang.isFunction(ds.cache.flush))
		{
			ds.cache.flush();
		}
	},

	/**
	 * Use this instead of any meta information in response.
	 * 
	 * @method getRecordCount
	 * @return {Number} the total number of records
	 */
	getRecordCount: function()
	{
		return this._count;
	},

	/**
	 * @method getCurrentRecords
	 * @return {Number} the records returned by the latest request
	 */
	getCurrentRecords: function()
	{
		return this._records;
	},

	/**
	 * @method getCurrentRecordMap
	 * @return {Object} the records returned by the latest request, keyed by record id
	 */
	getCurrentRecordMap: function()
	{
		return this._recordMap;
	},

	/**
	 * @method getValue
	 * @param record_index {Number}
	 * @param key {String} field key
	 * @return {mixed} the value of the specified field in the specified record
	 */
	getValue: function(
		/* int */		record_index,
		/* string */	key)
	{
		if (!this._dataIsLocal())
		{
			Y.error('BulkEditDataSource.getValue() can only be called when using a local datasource');
		}

		var j = fromDisplayIndex.call(this, record_index);
		if (j === false)
		{
			return false;
		}

		j = this._index[j];
		if (inserted_re.test(j))
		{
			var record_id = j.substr(inserted_prefix.length);
			var record    = this._new[ record_id ];
		}
		else
		{
			var record    = this.get('ds').get('source')[j];
			var record_id = record[ this.get('uniqueIdKey') ];
		}

		if (this._diff[ record_id ] &&
			!Y.Lang.isUndefined(this._diff[ record_id ][ key ]))
		{
			return this._diff[ record_id ][ key ];
		}
		else
		{
			return record[key];
		}
	},

	/**
	 * When using a remote datasource, this will include changes made to
	 * deleted records.
	 * 
	 * @method getChanges
	 * @return {Object} map of all changed values, keyed by record id
	 */
	getChanges: function()
	{
		return this._diff;
	},

	/**
	 * @method getRemovedRecordIndexes
	 * @return {Array} list of removed record indices, based on initial ordering
	 */
	getRemovedRecordIndexes: function()
	{
		var list = [];
		Y.Array.each(this._index, function(j)
		{
			if (removed_re.test(j))
			{
				list.push(parseInt(j.substr(removed_prefix.length), 10));
			}
		});

		return list;
	},

	/**
	 * You must reload() the widget after calling this function!
	 * 
	 * @method insertRecord
	 * @protected
	 * @param index {Number} insertion index
	 * @param record {Object|String} record to insert or id of record to clone
	 * @return {String} id of newly inserted record
	 */
	insertRecord: function(
		/* int */		index,
		/* object */	record)
	{
		this._count++;

		var record_id = String(this.get('generateUniqueId')());

		this._new[ record_id ]                            = {};
		this._new[ record_id ][ this.get('uniqueIdKey') ] = record_id;

		var j = fromDisplayIndex.call(this, index);
		if (j === false)
		{
			j = this._index.length;
		}
		this._index.splice(j, 0, inserted_prefix+record_id);

		if (record && !Y.Lang.isObject(record))		// clone existing record
		{
			var s    = record.toString();
			record   = Y.clone(this._recordMap[s] || this._new[s], true);
			var diff = this._diff[s];
			if (record && diff)
			{
				Y.mix(record, diff, true);
			}
		}

		if (record)		// insert initial values into _diff
		{
			var uniqueIdKey = this.get('uniqueIdKey');
			Y.Object.each(record, function(value, key)
			{
				if (key != uniqueIdKey)
				{
					this.updateValue(record_id, key, value);
				}
			},
			this);
		}

		return record_id;
	},

	/**
	 * You must reload() the widget after calling this function!
	 * 
	 * @method removeRecord
	 * @protected
	 * @param index {Number} index of record to remove
	 * @return {boolean} true if record was removed
	 */
	removeRecord: function(
		/* int */ index)
	{
		var j = fromDisplayIndex.call(this, index);
		if (j === false)
		{
			return false;
		}

		this._count--;

		if (inserted_re.test(this._index[j]))
		{
			var record_id = this._index[j].substr(inserted_prefix.length);
			delete this._new[ record_id ];
			this._index.splice(j,1);
		}
		else
		{
			if (this._dataIsLocal())
			{
				var record_id = this.get('ds').get('source')[ this._index[j] ][ this.get('uniqueIdKey') ].toString();
			}

			this._index[j] = removed_prefix + this._index[j];
		}

		if (record_id)
		{
			delete this._diff[ record_id ];
		}

		return true;
	},

	/**
	 * Update a value in a record.
	 *
	 * @method updateValue
	 * @protected
	 * @param record_id {String}
	 * @param key {String} field key
	 * @param value {String} new item value
	 */
	updateValue: function(
		/* string */	record_id,
		/* string */	key,
		/* string */	value)
	{
		if (key == this.get('uniqueIdKey'))
		{
			Y.error('BulkEditDataSource.updateValue() does not allow changing the id for a record.  Use BulkEditDataSource.updateRecordId() instead.');
		}

		record_id = record_id.toString();

		var record = this._recordMap[ record_id ];
		if (record && this._getComparator(key)(Y.Lang.isValue(record[key]) ? record[key] : '', Y.Lang.isValue(value) ? value : ''))
		{
			if (this._diff[ record_id ])
			{
				delete this._diff[ record_id ][ key ];
			}
		}
		else	// might be new record
		{
			if (!this._diff[ record_id ])
			{
				this._diff[ record_id ] = {};
			}
			this._diff[ record_id ][ key ] = value;
		}
	},

	/**
	 * @method _getComparator
	 * @protected
	 * @param key {String} field key
	 * @return {Function} comparator function for the given field
	 */
	_getComparator: function(
		/* string */ key)
	{
		var f = (this._fields[key] && this._fields[key].comparator) || 'string';
		if (Y.Lang.isFunction(f))
		{
			return f;
		}
		else if (BulkEditDataSource.comparator[f])
		{
			return BulkEditDataSource.comparator[f];
		}
		else
		{
			return BulkEditDataSource.comparator.string;
		}
	},

	/**
	 * Merge changes into the underlying data, to flush diffs for a record.
	 * Only usable with DataSource.Local.  When using best-effort save on
	 * the server, call this for each record that was successfully saved.
	 *
	 * @method mergeChanges
	 * @param record_id {String}
	 */
	mergeChanges: function(
		/* string */ record_id)
	{
		if (!this._dataIsLocal())
		{
			Y.error('BulkEditDataSource.mergeChanges() can only be called when using a local datasource');
		}

		record_id = record_id.toString();

		function merge(rec)
		{
			if (rec[ this.get('uniqueIdKey') ].toString() === record_id)
			{
				var diff = this._diff[ record_id ];
				if (diff)
				{
					Y.mix(rec, diff, true);
					delete this._diff[ record_id ];
				}
				return true;
			}
		}

		var found = false;
		this._flushCache();

		Y.Array.some(this.get('ds').get('source'), function(value)
		{
			if (merge.call(this, value))
			{
				found = true;
				return true;
			}
		},
		this);

		if (!found)
		{
			Y.Object.some(this._new, function(value)
			{
				if (merge.call(this, value))
				{
					found = true;
					return true;
				}
			},
			this);
		}
	},

	/**
	 * <p>Completely remove a record, from both the display and the
	 * underlying data.  Only usable with DataSource.Local.  When using
	 * best-effort save on the server, call this for each record that was
	 * successfully deleted.</p>
	 * 
	 * <p>You must reload() the widget after calling this function!</p>
	 * 
	 * @method killRecord
	 * @param record_id {String}
	 */
	killRecord: function(
		/* string */ record_id)
	{
		if (!this._dataIsLocal())
		{
			Y.error('BulkEditDataSource.killRecord() can only be called when using a local datasource');
		}

		record_id = record_id.toString();

		function kill(rec)
		{
			if (rec[ this.get('uniqueIdKey') ].toString() === record_id)
			{
				var info = {};
				this.recordIdToIndex(record_id, info);

				var j = this._index[ info.internal_index ];
				this._index.splice(info.internal_index, 1);
				if (!inserted_re.test(j))
				{
					for (var i=info.internal_index; i<this._index.length; i++)
					{
						var k = this._index[i];
						if (removed_re.test(k))
						{
							this._index[i] = removed_prefix +
								(parseInt(k.substr(removed_prefix.length), 10)-1);
						}
						else if (!inserted_re.test(k))
						{
							this._index[i]--;
						}
					}
				}

				this._count--;
				delete this._diff[ record_id ];
				return true;
			}
		}

		var found = false;
		this._flushCache();

		var data = this.get('ds').get('source');
		Y.Array.some(data, function(value, i)
		{
			if (kill.call(this, value))
			{
				data.splice(i,1);
				found = true;
				return true;
			}
		},
		this);

		if (!found)
		{
			Y.Object.some(this._new, function(value, id)
			{
				if (kill.call(this, value))
				{
					delete this._new[id];
					found = true;
					return true;
				}
			},
			this);
		}
	},

	/**
	 * <p>Change the id of a record.  Only usable with DataSource.Local.
	 * When using best-effort save on the server, call this for each newly
	 * created record that was successfully saved.</p>
	 * 
	 * <p>You must reload() the widget after calling this function!</p>
	 * 
	 * @method updateRecordId
	 * @param orig_record_id {String}
	 * @param new_record_id {String}
	 */
	updateRecordId: function(
		/* string */	orig_record_id,
		/* string */	new_record_id)
	{
		if (!this._dataIsLocal())
		{
			Y.error('BulkEditDataSource.updateRecordId() can only be called when using a local datasource');
		}

		orig_record_id = orig_record_id.toString();
		new_record_id  = new_record_id.toString();

		function update(rec)
		{
			if (rec[ this.get('uniqueIdKey') ].toString() === orig_record_id)
			{
				var info = {};
				this.recordIdToIndex(orig_record_id, info);
				var j = info.internal_index;
				if (inserted_re.test(this._index[j]))
				{
					this._index[j] = inserted_prefix + new_record_id;
				}

				rec[ this.get('uniqueIdKey') ] = new_record_id;
				if (this._diff[ orig_record_id ])
				{
					this._diff[ new_record_id ] = this._diff[ orig_record_id ];
					delete this._diff[ orig_record_id ];
				}
				return true;
			}
		}

		var found = false;
		this._flushCache();

		Y.Array.some(this.get('ds').get('source'), function(value)
		{
			if (update.call(this, value))
			{
				found = true;
				return true;
			}
		},
		this);

		if (!found)
		{
			Y.Object.some(this._new, function(value, id)
			{
				if (update.call(this, value))
				{
					this._new[ new_record_id ] = value;
					delete this._new[id];
					found = true;
					return true;
				}
			},
			this);
		}
	},

	/**
	 * Find the index of the given record id.  Only usable with
	 * DataSource.Local.
	 * 
	 * @method recordIdToIndex
	 * @param record_id {String}
	 * @return {Number} index or record or -1 if not found
	 */
	recordIdToIndex: function(
		/* string */	record_id,
		/* object */	return_info)
	{
		if (!this._dataIsLocal())
		{
			Y.error('BulkEditDataSource.recordIdToIndex() can only be called when using a local datasource');
		}

		record_id = record_id.toString();

		var records = this.get('ds').get('source');
		var count   = 0;
		for (var i=0; i<this._index.length; i++)
		{
			var j   = this._index[i];
			var ins = inserted_re.test(j);
			var del = removed_re.test(j);
			if ((ins &&
				 j.substr(inserted_prefix.length) === record_id) ||
				(!ins && !del &&
				 records[j][ this.get('uniqueIdKey') ].toString() === record_id))
			{
				if (return_info)
				{
					return_info.internal_index = i;
				}
				return count;
			}

			if (!del)
			{
				count++;
			}
		}

		return -1;
	},

	/**
	 * Merges edits into data and returns result.
	 * 
	 * @method _defRequestFn
	 * @protected
	 */
	_defRequestFn: function(e)
	{
		this._callback = e;
		adjustRequest.call(this);

		this._generatingRequest = true;

		this._callback._tId = this.get('ds').sendRequest(
		{
			request: this.get('generateRequest')(this._callback.request),
			callback:
			{
				success: Y.bind(internalSuccess, this),
				failure: Y.bind(internalFailure, this)
			}
		});

		this._generatingRequest = false;
		checkFinished.call(this);
	}
});

Y.BulkEditDataSource = BulkEditDataSource;
Y.namespace('DataSource').BulkEdit = BulkEditDataSource;
/**********************************************************************
 * A widget for editing many records at once.
 *
 * @module gallery-bulkedit
 * @main gallery-bulkedit
 */

/**
 * <p>BulkEditor provides the basic structure for editing all the records
 * in a BulkEditDataSource.  The fields for editing a record are rendered
 * into a "row".  This could be a div, a tbody, or something else.</p>
 * 
 * <p>All event handlers must be placed on the container, not individual
 * DOM elements.</p>
 * 
 * <p>Errors must be returned from the server in the order in which records
 * are displayed.  Because of this, when data is sent to the server:</p>
 * <ul>
 * <li>If the server knows the ordering, you can send the diffs.  (Diffs are an unordered map, keyed on the record id.)</li>
 * <li>If the server doesn't know the ordering, you must send all the data.</li>
 * </ul>
 *
 * @class BulkEditor
 * @extends Widget
 * @constructor
 * @param config {Object}
 */
function BulkEditor()
{
	BulkEditor.superclass.constructor.apply(this, arguments);
}

BulkEditor.NAME = "bulkedit";

BulkEditor.ATTRS =
{
	/**
	 * @attribute ds
	 * @type {DataSource.BulkEdit}
	 * @required
	 * @writeonce
	 */
	ds:
	{
		validator: function(value)
		{
			return (value instanceof BulkEditDataSource);
		},
		writeOnce: true
	},

	/**
	 * Configuration for each field: type (input|select|textarea), label,
	 * validation (css, regex, msg, fn; see
	 * gallery-formmgr-css-validation).  Derived classes can require
	 * additional keys.
	 *
	 * @attribute fields
	 * @type {Object}
	 * @required
	 * @writeonce
	 */
	fields:
	{
		validator: Y.Lang.isObject,
		writeOnce: true
	},

	/**
	 * Paginator for switching between pages of records.  BulkEditor
	 * expects it to be configured to display ValidationPageLinks, so the
	 * user can see which pages have errors that need to be fixed.
	 *
	 * @attribute paginator
	 * @type {Paginator}
	 * @writeonce
	 */
	paginator:
	{
		validator: function(value)
		{
			return (value instanceof Y.Paginator);
		},
		writeOnce: true
	},

	/**
	 * Extra key/value pairs to pass in the DataSource request.
	 * 
	 * @attribute requestExtra
	 * @type {Object}
	 * @writeonce
	 */
	requestExtra:
	{
		value:     {},
		validator: Y.Lang.isObject,
		writeOnce: true
	},

	/**
	 * CSS class used to temporarily highlight a record.
	 *
	 * @attribute pingClass
	 * @type {String}
	 * @default "yui3-bulkedit-ping"
	 */
	pingClass:
	{
		value:     Y.ClassNameManager.getClassName(BulkEditor.NAME, 'ping'),
		validator: Y.Lang.isString
	},

	/**
	 * Duration in seconds that pingClass is applied to a record.
	 *
	 * @attribute pingTimeout
	 * @type {Number}
	 * @default 2
	 */
	pingTimeout:
	{
		value:     2,
		validator: Y.Lang.isNumber
	}
};

/**
 * The number of checkboxes in each column of a checkboxMultiselect field.
 * 
 * @property checkbox_multiselect_column_height
 * @type {Number}
 * @static
 */
BulkEditor.checkbox_multiselect_column_height = 6;

/**
 * @event notifyErrors
 * @description Fired when widget-level validation messages need to be displayed.
 * @param msgs {Array} the messages to display
 */
/**
 * @event clearErrorNotification
 * @description Fired when widget-level validation messages should be cleared.
 */
/**
 * @event pageRendered
 * @description Fired every time after the editor has rendered a page.
 */

var default_page_size = 1e9,

	id_prefix = 'bulk-editor',
	id_separator = '__',
	id_regex = new RegExp('^' + id_prefix + id_separator + '(.+?)(?:' + id_separator + '(.+?))?$'),

	status_prefix  = 'bulkedit-has',
	status_pattern = status_prefix + '([a-z]+)',
	status_re      = new RegExp(Y.Node.class_re_prefix + status_pattern + Y.Node.class_re_suffix),

	record_status_prefix  = 'bulkedit-hasrecord',
	record_status_pattern = record_status_prefix + '([a-z]+)',
	record_status_re      = new RegExp(Y.Node.class_re_prefix + record_status_pattern + Y.Node.class_re_suffix),

	message_container_class = Y.ClassNameManager.getClassName(BulkEditor.NAME, 'message-text'),

	perl_flags_regex = /^\(\?([a-z]+)\)/;

BulkEditor.record_container_class     = Y.ClassNameManager.getClassName(BulkEditor.NAME, 'bd');
BulkEditor.record_msg_container_class = Y.ClassNameManager.getClassName(BulkEditor.NAME, 'record-message-container');

BulkEditor.field_container_class        = Y.ClassNameManager.getClassName(BulkEditor.NAME, 'field-container');
BulkEditor.field_container_class_prefix = BulkEditor.field_container_class + '-';
BulkEditor.field_class_prefix           = Y.ClassNameManager.getClassName(BulkEditor.NAME, 'field') + '-';

function switchPage(state)
{
	this.saveChanges();

	var pg = this.get('paginator');
	pg.setTotalRecords(state.totalRecords, true);
	pg.setStartIndex(state.recordOffset, true);
	pg.setRowsPerPage(state.rowsPerPage, true);
	pg.setPage(state.page, true);
	this._updatePageStatus();
	this.reload();
}

Y.extend(BulkEditor, Y.Widget,
{
	initializer: function(config)
	{
		if (config.paginator)
		{
			config.paginator.on('changeRequest', switchPage, this);
		}

		this._hopper = [];
	},

	renderUI: function()
	{
		this.clearServerErrors();
		this.reload();
	},

	bindUI: function()
	{
		this._attachEvents(this.get('contentBox'));
	},

	/**
	 * Attaches events to the container.
	 *
	 * @method _attachEvents
	 * @param container {Node} node to which events should be attached
	 * @protected
	 */
	_attachEvents: function(
		/* node */	container)
	{
		Y.delegate('bulkeditor|click', handleCheckboxMultiselectClickOnCheckbox, container, '.checkbox-multiselect input[type=checkbox]', this);
	},

	/**
	 * @method _destroyOnRender
	 * @param o {Object} object to destroy when BulkEditor is re-rendered
	 * @protected
	 */
	_destroyOnRender: function(o)
	{
		this._hopper.push(o);
	},

	/**
	 * Reloads the current page of records.  This will erase any changes
	 * unsaved changes!
	 * 
	 * @method reload
	 */
	reload: function()
	{
		if (!this.busy)
		{
			this.plug(Y.Plugin.BusyOverlay);
		}
		this.busy.show();

		var pg = this.get('paginator');
		var request =
		{
			startIndex:  pg ? pg.getStartIndex() : 0,
			resultCount: pg ? pg.getRowsPerPage() : default_page_size
		};
		Y.mix(request, this.get('requestExtra'));

		var ds = this.get('ds');
		ds.sendRequest(
		{
			request: request,
			callback:
			{
				success: Y.bind(function(e)
				{
					this.busy.hide();

					var count = ds.getRecordCount();
					if (count > 0 && pg && pg.getStartIndex() >= count)
					{
						pg.setPage(pg.getPreviousPage());
						return;
					}

					this._render(e.response);
					this._updatePaginator(e.response);
					this.scroll_to_index = -1;
				},
				this),

				failure: Y.bind(function()
				{
					Y.log('error loading data in BulkEditor', 'error');

					this.busy.hide();
					this.scroll_to_index = -1;
				},
				this)
			}
		});
	},

	/**
	 * Save the modified values from the current page of records.
	 * 
	 * @method saveChanges
	 */
	saveChanges: function()
	{
		var ds      = this.get('ds');
		var records = ds.getCurrentRecords();
		var id_key  = ds.get('uniqueIdKey');
		Y.Object.each(this.get('fields'), function(field, key)
		{
			Y.Array.each(records, function(r)
			{
				var node = this.getFieldElement(r, key),
					tag  = node.get('tagName'),
					value;

				// Limited number of HTML form tags.  Behaviors should not be
				// changed.  Thus, not using a lookup table.

				if (tag == 'INPUT' && node.get('type').toLowerCase() == 'checkbox')
				{
					value = node.get('checked') ? field.values.on : field.values.off;
				}
				else if (tag == 'SELECT' && node.get('multiple'))
				{
					value = Y.reduce(Y.Node.getDOMNode(node).options, [], function(v, o)
					{
						if (o.selected)
						{
							v.push(o.value);
						}
						return v;
					});
				}
				else
				{
					value = node.get('value');
				}

				ds.updateValue(r[ id_key ], key, value);
			},
			this);
		},
		this);
	},

	/**
	 * Retrieve *all* the data.  Do not call this if you use server-side
	 * pagination.
	 * 
	 * @method getAllValues
	 * @param callback {Object} callback object which will be invoked by DataSource
	 */
	getAllValues: function(callback)
	{
		var request =
		{
			startIndex:  0,
			resultCount: this.get('ds').getRecordCount(),
			out_of_band: true
		};
		Y.mix(request, this.get('requestExtra'));

		this.get('ds').sendRequest(
		{
			request:  request,
			callback: callback
		});
	},

	/**
	 * @method getChanges
	 * @return {Object} map of all changed values, keyed by record id
	 */
	getChanges: function()
	{
		return this.get('ds').getChanges();
	},

	/**
	 * <p>Insert a new record.</p>
	 * 
	 * <p>You must reload() the widget after calling this function!</p>
	 * 
	 * @method insertRecord
	 * @param index {Number} insertion index
	 * @param record {Object|String} record to insert or id of record to clone
	 * @return {String} the new record's id
	 */
	insertRecord: function(
		/* int */		index,
		/* object */	record)
	{
		var record_id = this.get('ds').insertRecord(index, record);
		if (index <= this.server_errors.records.length)
		{
			this.server_errors.records.splice(index,0, { id: record_id });
			// leave entry in record_map undefined
			this._updatePageStatus();
		}
		return record_id;
	},

	/**
	 * <p>Remove a record.  The removal will be recorded in the diffs.
	 * There is no way to un-remove a record, so if you need that
	 * functionality, you may want to use highlighting to indicate removed
	 * records instead.</p>
	 * 
	 * <p>You must reload() the widget after calling this function!</p>
	 * 
	 * @method removeRecord
	 * @param index {Number}
	 * @return {Boolean} true if the record was successfully removed
	 */
	removeRecord: function(
		/* int */ index)
	{
		if (this.get('ds').removeRecord(index))
		{
			if (index < this.server_errors.records.length)
			{
				var rec = this.server_errors.records[index];
				this.server_errors.records.splice(index,1);
				delete this.server_errors.record_map[ rec[ this.get('ds').get('uniqueIdKey') ] ];
				this._updatePageStatus();
			}
			return true;
		}
		else
		{
			return false;
		}
	},

	/**
	 * @method getFieldConfig
	 * @param key {String} field key
	 * @return {Object} field configuration
	 */
	getFieldConfig: function(
		/* string */	key)
	{
		return this.get('fields')[key] || {};
	},

	/**
	 * @method getRecordContainerId
	 * @param record {String|Object} record id or record object
	 * @return {String} id of DOM element containing the record's input elements
	 */
	getRecordContainerId: function(
		/* string/object */ record)
	{
		if (Y.Lang.isString(record))
		{
			return id_prefix + id_separator + record;
		}
		else
		{
			return id_prefix + id_separator + record[ this.get('ds').get('uniqueIdKey') ];
		}
	},

	/**
	 * @method getFieldId
	 * @param record {String|Object} record id or record object
	 * @param key {String} field key
	 * @return {String} id of DOM element containing the field's input element
	 */
	getFieldId: function(
		/* string/object */	record,
		/* string */		key)
	{
		return this.getRecordContainerId(record) + id_separator + key;
	},

	/**
	 * @method getRecordAndFieldKey
	 * @param key {String|Node} field key or field input element
	 * @return {Object} object containing record and field_key
	 */
	getRecordAndFieldKey: function(
		/* string/element */	field)
	{
		var m = id_regex.exec(Y.Lang.isString(field) ? field : field.get('id'));
		if (m && m.length > 0)
		{
			return { record: this.get('ds').getCurrentRecordMap()[ m[1] ], field_key: m[2] };
		}
	},

	/**
	 * @method getRecordId
	 * @param obj {Object|Node} record object, record container, or any node inside record container
	 * @return {String} record id
	 */
	getRecordId: function(
		/* object/element */	obj)
	{
		if (Y.Lang.isObject(obj) && !obj._node)
		{
			return obj[ this.get('ds').get('uniqueIdKey') ];
		}

		var node = obj.getAncestorByClassName(BulkEditor.record_container_class, true);
		if (node)
		{
			var m  = id_regex.exec(node.get('id'));
			if (m && m.length > 0)
			{
				return m[1];
			}
		}
	},

	/**
	 * @method getRecordContainer
	 * @param record {String|Object|Node} record id, record object, record container, or any node inside record container
	 * @return {Node} node containing rendered record
	 */
	getRecordContainer: function(
		/* string/object/element */ record)
	{
		if (Y.Lang.isString(record))
		{
			var id = id_prefix + id_separator + record;
		}
		else if (record && record._node)
		{
			return record.getAncestorByClassName(BulkEditor.record_container_class, true);
		}
		else	// record object
		{
			var id = this.getRecordContainerId(record);
		}

		return Y.one('#'+id);
	},

	/**
	 * @method getFieldContainer
	 * @param record {String|Object|Node} record id, record object, record container, or any node inside record container
	 * @param key {String} field key
	 * @return {Node} node containing rendered field
	 */
	getFieldContainer: function(
		/* string/object/element */	record,
		/* string */				key)
	{
		var field = this.getFieldElement(record, key);
		return field.getAncestorByClassName(BulkEditor.field_container_class, true);
	},

	/**
	 * @method getFieldElement
	 * @param record {String|Object|Node} record id, record object, record container, or any node inside record container
	 * @param key {String} field key
	 * @return {Node} field's input element
	 */
	getFieldElement: function(
		/* string/object/element */	record,
		/* string */				key)
	{
		if (record && record._node)
		{
			record = this.getRecordId(record);
		}
		return Y.one('#'+this.getFieldId(record, key));
	},

	/**
	 * Paginate and/or scroll to make the specified record visible.  Record
	 * is pinged to help the user find it.
	 * 
	 * @method showRecordIndex
	 * @param index {Number} record index
	 */
	showRecordIndex: function(
		/* int */ index)
	{
		if (index < 0 || this.get('ds').getRecordCount() <= index)
		{
			return;
		}

		var pg    = this.get('paginator');
		var start = pg ? pg.getStartIndex() : 0;
		var count = pg ? pg.getRowsPerPage() : default_page_size;
		if (start <= index && index < start+count)
		{
			var node = this.getRecordContainer(this.get('ds').getCurrentRecords()[ index - start ]);
			node.scrollIntoView();
			this.pingRecord(node);
		}
		else if (pg)
		{
			this.scroll_to_index = index;
			pg.setPage(1 + Math.floor(index / count));
		}
	},

	/**
	 * Paginate and/or scroll to make the specified record visible.  Record
	 * is pinged to help the user find it.
	 * 
	 * @method showRecordId
	 * @param id {Number} record id
	 */
	showRecordId: function(
		/* string */ id)
	{
		var index = this.get('ds').recordIdToIndex(id);
		if (index >= 0)
		{
			this.showRecordIndex(index);
		}
	},

	/**
	 * Apply a class to the DOM element containing the record for a short
	 * while.  Your CSS can use this class to highlight the record in some
	 * way.
	 * 
	 * @method pingRecord
	 * @param record {String|Object|Node} record id, record object, record container, or any node inside record container
	 */
	pingRecord: function(
		/* string/object/element */	record)
	{
		var ping = this.get('pingClass');
		if (ping)
		{
			var node = this.getRecordContainer(record);
			node.addClass(ping);
			Y.later(this.get('pingTimeout')*1000, null, function()
			{
				node.removeClass(ping);
			});
		}
	},

	/**
	 * Render the current page of records.
	 *
	 * @method _render
	 * @protected
	 * @param response {Object} response from data source
	 */
	_render: function(response)
	{
		Y.log('_render', 'debug');

		Y.Chipper.destroy(this._hopper);
		this._hopper = [];

		var container = this.get('contentBox');
		this._renderContainer(container);
		container.set('scrollTop', 0);
		container.set('scrollLeft', 0);

		Y.Array.each(response.results, function(record)
		{
			var node = this._renderRecordContainer(container, record);
			this._renderRecord(node, record);
		},
		this);

		this.fire('pageRendered');

		if (this.auto_validate)
		{
			this.validate();
		}

		if (this.scroll_to_index >= 0)
		{
			this.showRecordIndex(this.scroll_to_index);
			this.scroll_to_index = -1;
		}
	},

	/**
	 * Derived class should override to create a structure for the records.
	 *
	 * @method _renderContainer
	 * @protected
	 * @param container {Node}
	 */
	_renderContainer: function(
		/* element */	container)
	{
		container.set('innerHTML', '');
	},

	/**
	 * Derived class must override to create a container for the record.
	 * 
	 * @method _renderRecordContainer
	 * @protected
	 * @param container {Node}
	 * @param record {Object} record data
	 */
	_renderRecordContainer: function(
		/* element */	container,
		/* object */	record)
	{
		return null;
	},

	/**
	 * Derived class can override if it needs to do more than just call
	 * _renderField() for each field.
	 * 
	 * @method _renderRecord
	 * @protected
	 * @param container {Node} record container
	 * @param record {Object} record data
	 */
	_renderRecord: function(
		/* element */	container,
		/* object */	record)
	{
		Y.Object.each(this.get('fields'), function(field, key)
		{
			this._renderField(
			{
				container: container,
				key:       key,
				value:     record[key],
				field:     field,
				record:    record
			});
		},
		this);
	},

	/**
	 * If _renderRecord is not overridden, derived class must override this
	 * function to render the field.
	 * 
	 * @method _renderField
	 * @protected
	 * @param o {Object}
	 *	container {Node} record container,
	 *	key {String} field key,
	 *	value {Mixed} field value,
	 *	field {Object} field configuration,
	 *	record {Object} record data
	 */
	_renderField: function(
		/* object */ o)
	{
	},

	/**
	 * Update the paginator to match the data source meta information.
	 * 
	 * @method _updatePaginator
	 * @protected
	 * @param response {Object} response from DataSource
	 */
	_updatePaginator: function(response)
	{
		var pg = this.get('paginator');
		if (pg)
		{
			pg.setTotalRecords(this.get('ds').getRecordCount(), true);
		}
	},

	/**
	 * Clear errors received from the server.  This clears all displayed
	 * messages.
	 * 
	 * @method clearServerErrors
	 */
	clearServerErrors: function()
	{
		if (this.server_errors && this.server_errors.page &&
			this.server_errors.page.length)
		{
			this.fire('clearErrorNotification');
		}

		this.server_errors =
		{
			page:       [],
			records:    [],
			record_map: {}
		};

		var pg = this.get('paginator');
		if (pg)
		{
			pg.set('pageStatus', []);
		}
		this.first_error_page = -1;

		this._clearValidationMessages();
	},

	/**
	 * Set page level, record level, and field level errors received from
	 * the server.  A message can be either a string (assumed to be an
	 * error) or an object providing msg and type, where type can be
	 * 'error', 'warn', 'info', or 'success'.
	 * 
	 * @method setServerErrors
	 * @param page_errors {Array} list of page-level error messages
	 * @param record_field_errors {Array} list of objects *in record display order*,
	 *		each of which defines id (String), recordError (message),
	 *		and fieldErrors (map of field keys to error messages)
	 */
	setServerErrors: function(
		/* array */	page_errors,
		/* array */	record_field_errors)
	{
		if (this.server_errors.page.length &&
			(!page_errors || !page_errors.length))
		{
			this.fire('clearErrorNotification');
		}

		this.server_errors =
		{
			page:       page_errors || [],
			records:    record_field_errors || [],
			record_map: Y.Array.toObject(record_field_errors || [], 'id')
		};

		this._updatePageStatus();

		var pg = this.get('paginator');
		if (!pg || pg.getCurrentPage() === this.first_error_page)
		{
			this.validate();
		}
		else
		{
			this.auto_validate = true;
			pg.setPage(this.first_error_page);
		}
	},

	/**
	 * Update paginator to show which pages have errors.
	 *
	 * @method _updatePageStatus
	 * @protected
	 */
	_updatePageStatus: function()
	{
		var pg = this.get('paginator');
		if (!pg)
		{
			return;
		}

		var page_size = pg ? pg.getRowsPerPage() : default_page_size;
		var status    = this.page_status.slice(0);

		this.first_error_page = -1;

		var r = this.server_errors.records;
		for (var i=0; i<r.length; i++)
		{
			if (r[i].recordError || r[i].fieldErrors)
			{
				var j     = Math.floor(i / page_size);
				status[j] = 'error';
				if (this.first_error_page == -1)
				{
					this.first_error_page = j+1;
				}
			}
		}

		pg.set('pageStatus', status);
	},

	/**
	 * Validate the visible values (if using server-side pagination) or all
	 * the values (if using client-side pagination or no pagination).
	 * 
	 * @method validate
	 * @return {Boolean} true if all checked values are acceptable
	 */
	validate: function()
	{
		this.saveChanges();

		this._clearValidationMessages();
		this.auto_validate = true;

		var status = this._validateVisibleFields();
		var pg     = this.get('paginator');
		if (!status && pg)
		{
			this.page_status[ pg.getCurrentPage()-1 ] = 'error';
		}

		status = this._validateAllPages() && status;	// status last to guarantee call

		if (!status || this.server_errors.page.length ||
			this.server_errors.records.length)
		{
			var err = this.server_errors.page.slice(0);
			if (err.length === 0)
			{
				err.push(Y.FormManager.Strings.validation_error);
			}
			this.fire('notifyErrors', { msgs: err });

			this.get('contentBox').getElementsByClassName(BulkEditor.record_container_class).some(function(node)
			{
				if (node.hasClass(status_pattern))
				{
					node.scrollIntoView();
					return true;
				}
			});
		}

		this._updatePageStatus();
		return status;
	},

	/**
	 * Validate the visible values.
	 * 
	 * @method _validateVisibleFields
	 * @protected
	 * @param container {Node} if null, uses contentBox
	 * @return {Boolean} true if all checked values are acceptable
	 */
	_validateVisibleFields: function(
		/* object */ container)
	{
		var status = true;

		if (!container)
		{
			container = this.get('contentBox');
		}

		// fields

		var e1 = container.getElementsByTagName('input');
		var e2 = container.getElementsByTagName('textarea');
		var e3 = container.getElementsByTagName('select');

		Y.FormManager.cleanValues(e1);
		Y.FormManager.cleanValues(e2);

		status = this._validateElements(e1) && status;	// status last to guarantee call
		status = this._validateElements(e2) && status;
		status = this._validateElements(e3) && status;

		// records -- after fields, since field class regex would wipe out record class

		container.getElementsByClassName(BulkEditor.record_container_class).each(function(node)
		{
			var id  = this.getRecordId(node);
			var err = this.server_errors.record_map[id];
			if (err && err.recordError)
			{
				err = err.recordError;
				if (Y.Lang.isString(err))
				{
					var msg  = err;
					var type = 'error';
				}
				else
				{
					var msg  = err.msg;
					var type = err.type;
				}
				this.displayRecordMessage(id, msg, type, false);
				status = status && !(type == 'error' || type == 'warn');
			}
		},
		this);

		return status;
	},

	/**
	 * Validate the given elements.
	 * 
	 * @method _validateElements
	 * @protected
	 * @param nodes {NodeList}
	 * @return {Boolean} true if all checked values are acceptable
	 */
	_validateElements: function(
		/* array */ nodes)
	{
		var status = true;
		nodes.each(function(node)
		{
			var field_info = this.getRecordAndFieldKey(node);
			if (!field_info)
			{
				return;
			}

			var field    = this.getFieldConfig(field_info.field_key);
			var msg_list = field.validation && field.validation.msg;

			var info = Y.FormManager.validateFromCSSData(node, msg_list);
			if (info.error)
			{
				this.displayFieldMessage(node, info.error, 'error', false);
				status = false;
				return;
			}

			if (info.keepGoing)
			{
				if (field.validation && Y.Lang.isString(field.validation.regex))
				{
					var flags = '';
					var m     = perl_flags_regex.exec(field.validation.regex);
					if (m && m.length == 2)
					{
						flags                  = m[1];
						field.validation.regex = field.validation.regex.replace(perl_flags_regex, '');
					}
					field.validation.regex = new RegExp(field.validation.regex, flags);
				}

				if (field.validation &&
					field.validation.regex instanceof RegExp &&
					!field.validation.regex.test(node.get('value')))
				{
					this.displayFieldMessage(node, msg_list && msg_list.regex, 'error', false);
					status = false;
					return;
				}
			}

			if (field.validation &&
				Y.Lang.isFunction(field.validation.fn) &&
				!field.validation.fn.call(this, node))
			{
				status = false;
				return;
			}

			var err = this.server_errors.record_map[ this.getRecordId(field_info.record) ];
			if (err && err.fieldErrors)
			{
				var f = err.fieldErrors[ field_info.field_key ];
				if (f)
				{
					if (Y.Lang.isString(f))
					{
						var msg  = f;
						var type = 'error';
					}
					else
					{
						var msg  = f.msg;
						var type = f.type;
					}
					this.displayFieldMessage(node, msg, type, false);
					status = status && !(type == 'error' || type == 'warn');
					return;
				}
			}
		},
		this);

		return status;
	},

	/**
	 * If the data is stored locally and we paginate, validate all of it
	 * and mark the pages that have invalid values.
	 * 
	 * @method _validateAllPages
	 * @protected
	 * @return {Boolean} true if all checked values are acceptable
	 */
	_validateAllPages: function()
	{
		var ds = this.get('ds');
		var pg = this.get('paginator');
		if (!pg || !ds._dataIsLocal())
		{
			return true;
		}

		if (!this.validation_node)
		{
			this.validation_node = Y.Node.create('<input></input>');
		}

		if (!this.validation_keys)
		{
			this.validation_keys = [];
			Y.Object.each(this.get('fields'), function(value, key)
			{
				if (value.validation)
				{
					this.validation_keys.push(key);
				}
			},
			this);
		}

		var count     = ds.getRecordCount(),
			page_size = pg.getRowsPerPage(),
			status    = true;
		for (var i=0; i<count; i++)
		{
			var page_status = true;
			Y.Array.each(this.validation_keys, function(key)
			{
				var field = this.get('fields')[key];
				var value = ds.getValue(i, key);

				this.validation_node.set('value', Y.Lang.isUndefined(value) ? '' : value);
				this.validation_node.set('className', field.validation.css || '');

				var info = Y.FormManager.validateFromCSSData(this.validation_node);
				if (info.error)
				{
					page_status = false;
					return;
				}

				if (info.keepGoing)
				{
					if (field.validation.regex instanceof RegExp &&
						!field.validation.regex.test(value))
					{
						page_status = false;
						return;
					}
				}
			},
			this);

			if (!page_status)
			{
				var j = Math.floor(i / page_size);
				i     = (j+1)*page_size - 1;	// skip to next page

				this.page_status[j] = 'error';
				status              = false;
			}
		}

		return status;
	},

	/**
	 * Clear all displayed messages.
	 * 
	 * @method _clearValidationMessages
	 */
	_clearValidationMessages: function()
	{
		this.has_validation_messages = false;
		this.auto_validate           = false;
		this.page_status             = [];

		this.fire('clearErrorNotification');

		var container = this.get('contentBox');

		container.getElementsByClassName(status_pattern).removeClass(status_pattern);
		container.getElementsByClassName(record_status_pattern).removeClass(record_status_pattern);
		container.getElementsByClassName(message_container_class).set('innerHTML', '');
	},

	/**
	 * Display a message for the specified field.
	 * 
	 * @method displayFieldMessage
	 * @param e {Node} field input element
	 * @param msg {String} message to display
	 * @param type {String} message type:  error, warn, info, success
	 * @param scroll {Boolean} whether or not to scroll to the field
	 */
	displayFieldMessage: function(
		/* element */	e,
		/* string */	msg,
		/* string */	type,
		/* boolean */	scroll)
	{
		if (Y.Lang.isUndefined(scroll))
		{
			scroll = !this.has_validation_messages;
		}

		var bd1     = this.getRecordContainer(e);
		var changed = this._updateRecordStatus(bd1, type, status_pattern, status_re, status_prefix);

		var bd2 = e.getAncestorByClassName(BulkEditor.field_container_class);
		if (Y.FormManager.statusTakesPrecedence(this._getElementStatus(bd2, status_re), type))
		{
			if (msg)
			{
				var m = bd2.getElementsByClassName(message_container_class);
				if (m && m.size() > 0)
				{
					m.item(0).set('innerHTML', msg);
				}
			}

			bd2.replaceClass(status_pattern, status_prefix + type);
			this.has_validation_messages = true;
		}

		if (changed && scroll)
		{
			bd1.scrollIntoView();
		}
	},

	/**
	 * Display a message for the specified record.
	 * 
	 * @method displayRecordMessage
	 * @param id {String} record id
	 * @param msg {String} message to display
	 * @param type {String} message type:  error, warn, info, success
	 * @param scroll {Boolean} whether or not to scroll to the field
	 */
	displayRecordMessage: function(
		/* string */	id,
		/* string */	msg,
		/* string */	type,
		/* boolean */	scroll)
	{
		if (Y.Lang.isUndefined(scroll))
		{
			scroll = !this.has_validation_messages;
		}

		var bd1     = this.getRecordContainer(id);
		var changed = this._updateRecordStatus(bd1, type, status_pattern, status_re, status_prefix);
		if (this._updateRecordStatus(bd1, type, record_status_pattern, record_status_re, record_status_prefix) &&
			msg)	// msg last to guarantee call
		{
			var bd2 = bd1.getElementsByClassName(BulkEditor.record_msg_container_class).item(0);
			if (bd2)
			{
				var m = bd2.getElementsByClassName(message_container_class);
				if (m && m.size() > 0)
				{
					m.item(0).set('innerHTML', msg);
				}
			}
		}

		if (changed && scroll)
		{
			bd1.scrollIntoView();
		}
	},

	/**
	 * @method _getElementStatus
	 * @protected
	 * @param n {Node}
	 * @param r {RegExp}
	 * @return {Mixed} status or false
	 */
	_getElementStatus: function(
		/* Node */	n,
		/* regex */	r)
	{
		var m = r.exec(n.get('className'));
		return (m && m.length > 1 ? m[1] : false);
	},

	/**
	 * Update the status of the node, if the new status has higher precedence.
	 *
	 * @method _updateRecordStatus
	 * @param bd {Node}
	 * @param type {String} new status
	 * @param p {String} pattern for extracting status
	 * @param r {RegExpr} regex for extracting status
	 * @param prefix {String} status prefix
	 * @return {Boolean} true if status was modified
	 */
	_updateRecordStatus: function(
		/* element */	bd,
		/* string */	type,
		/* string */	p,
		/* regex */		r,
		/* string */	prefix)
	{
		if (Y.FormManager.statusTakesPrecedence(this._getElementStatus(bd, r), type))
		{
			bd.replaceClass(p, prefix + type);
			this.has_validation_messages = true;
			return true;
		}

		return false;
	}
});

//
// Markup
//

BulkEditor.cleanHTML = function(s)
{
	return (Y.Lang.isValue(s) ? Y.Escape.html(s) : '');
};

/**
 * @property Y.BulkEditor.error_msg_markup
 * @type {String}
 * @static
 */
BulkEditor.error_msg_markup = Y.Lang.sub('<div class="{c}"></div>',
{
	c: message_container_class
});

/**
 * @method labelMarkup
 * @static
 * @param o {Object}
 *	key {String} field key,
 *	value {Mixed} field value,
 *	field {Object} field configuration,
 *	record {Object} record data
 * @return {String} markup for the label of the specified field
 */
BulkEditor.labelMarkup = function(o)
{
	var label = '<label for="{id}">{label}</label>';

	return Y.Lang.sub(label,
	{
		id:    this.getFieldId(o.record, o.key),
		label: o.field.label
	});
};

/**
 * Map of field type (input,select,textarea) to function that generates the
 * required markup.  You can add additional entries.  Each function takes a
 * single argument: an object defining
 *	key {String} field key,
 *	value {Mixed} field value,
 *	field {Object} field configuration,
 *	record {Object} record data
 *
 * @property Y.BulkEditor.markup
 * @type {Object}
 * @static
 */
BulkEditor.markup =
{
	input: function(o)
	{
		var input =
			'<div class="{cont}{key}">' +
				'{label}{msg1}' +
				'<input type="text" id="{id}" value="{value}" class="{field}{key} {yiv}" />' +
				'{msg2}' +
			'</div>';

		var label = o.field && o.field.label ? BulkEditor.labelMarkup.call(this, o) : '';

		return Y.Lang.sub(input,
		{
			cont:  BulkEditor.field_container_class + ' ' + BulkEditor.field_container_class_prefix,
			field: BulkEditor.field_class_prefix,
			key:   o.key,
			id:    this.getFieldId(o.record, o.key),
			label: label,
			value: BulkEditor.cleanHTML(o.value),
			yiv:   (o.field && o.field.validation && o.field.validation.css) || '',
			msg1:  label ? BulkEditor.error_msg_markup : '',
			msg2:  label ? '' : BulkEditor.error_msg_markup
		});
	},

	select: function(o)
	{
		var select =
			'<div class="{cont}{key}">' +
				'{label}{msg1}' +
				'<select id="{id}" class="{field}{key}">{options}</select>' +
				'{msg2}' +
			'</div>';

		var option = '<option value="{value}" {selected}>{text}</option>';

		var options = Y.Array.reduce(o.field.values, '', function(s, v)
		{
			return s + Y.Lang.sub(option,
			{
				value:    v.value,
				text:     BulkEditor.cleanHTML(v.text),
				selected: o.value && o.value.toString() === v.value ? 'selected="selected"' : ''
			});
		});

		var label = o.field && o.field.label ? BulkEditor.labelMarkup.call(this, o) : '';

		return Y.Lang.sub(select,
		{
			cont:  	 BulkEditor.field_container_class + ' ' + BulkEditor.field_container_class_prefix,
			field:   BulkEditor.field_class_prefix,
			key:     o.key,
			id:      this.getFieldId(o.record, o.key),
			label:   label,
			options: options,
			yiv:     (o.field && o.field.validation && o.field.validation.css) || '',
			msg1:    label ? BulkEditor.error_msg_markup : '',
			msg2:    label ? '' : BulkEditor.error_msg_markup
		});
	},

	checkbox: function(o)
	{
		var checkbox =
			'<div class="{cont}{key}">' +
				'<input type="checkbox" id="{id}" {value} class="{field}{key}" /> ' +
				'{label}' +
				'{msg}' +
			'</div>';

		var label = o.field && o.field.label ? BulkEditor.labelMarkup.call(this, o) : '';

		return Y.Lang.sub(checkbox,
		{
			cont:  BulkEditor.field_container_class + ' ' + BulkEditor.field_container_class_prefix,
			field: BulkEditor.field_class_prefix,
			key:   o.key,
			id:    this.getFieldId(o.record, o.key),
			label: label,
			value: o.value == o.field.values.on ? 'checked="checked"' : '',
			msg:   BulkEditor.error_msg_markup
		});
	},

	checkboxMultiselect: function(o)
	{
		return multiselectMarkup.call(this, 'checkboxes', o);
	},

	autocompleteInputMultiselect: function(o)
	{
		return multiselectMarkup.call(this, 'autocompleteMultivalueInput', o);
	},

	textarea: function(o)
	{
		var textarea =
			'<div class="{cont}{key}">' +
				'{label}{msg1}' +
				'<textarea id="{id}" class="satg-textarea-field {prefix}{key} {yiv}">{value}</textarea>' +
				'{msg2}' +
			'</div>';

		var label = o.field && o.field.label ? BulkEditor.labelMarkup.call(this, o) : '';

		return Y.Lang.sub(textarea,
		{
			cont:   BulkEditor.field_container_class + ' ' + BulkEditor.field_container_class_prefix,
			prefix: BulkEditor.field_class_prefix,
			key:    o.key,
			id:     this.getFieldId(o.record, o.key),
			label:  label,
			value:  BulkEditor.cleanHTML(o.value),
			yiv:    (o.field && o.field.validation && o.field.validation.css) || '',
			msg1:   label ? BulkEditor.error_msg_markup : '',
			msg2:   label ? '' : BulkEditor.error_msg_markup
		});
	}
};

/**
 * @method fieldMarkup
 * @static
 * @param key {String} field key
 * @param record {Object}
 * @return {String} markup for the specified field
 */
BulkEditor.fieldMarkup = function(key, record)
{
	var field = this.getFieldConfig(key);
	return BulkEditor.markup[ field.type || 'input' ].call(this,
	{
		key:    key,
		value:  record[key],
		field:  field,
		record: record
	});
};

function multiselectMarkup(type, o)
{
	var select =
		'<div class="{cont}{key}">' +
			'{label}{msg}' +
			'<div id="{id}-multiselect" class="checkbox-multiselect">{input}</div>' +
			'<select id="{id}" class="{field}{key}" multiple="multiple" style="display:none;">{options}</select>' +
		'</div>';

	var id        = this.getFieldId(o.record, o.key),
		has_value = Y.Lang.isArray(o.value);

	if (type == 'autocompleteMultivalueInput')
	{
		var input_markup = Y.Lang.sub('<input type="text" id="{id}-multivalue-input" />',
		{
			id: id
		});

		Y.later(0, this, function()
		{
			var node = Y.one('#' + id + '-multivalue-input');

			node.plug(Y.Plugin.AutoComplete,
			{
				resultFilters:     'phraseMatch',
				resultHighlighter: 'phraseMatch',
				source: Y.reduce(o.field.values, [], function(list, v)
				{
					list.push(v.text);
					return list;
				})
			})

			node.plug(Y.Plugin.MultivalueInput,
			{
				values: Y.map(o.value, function(v)
				{
					var i = Y.Array.findIndexOf(o.field.values, function(v1)
					{
						return (v === v1.value.toString());
					});

					return (i >= 0 ? o.field.values[i].text : '');
				})
			});

			node.mvi.on('valuesChange', function()
			{
				var value_list = node.mvi.get('values'),
					select     = node.ancestor('.checkbox-multiselect').next('select');

				Y.each(Y.Node.getDOMNode(select).options, function(o)
				{
					o.selected = (Y.Array.indexOf(value_list, o.text) >= 0);
				});
			});

			this._destroyOnRender(node);
		});
	}
	else if (type == 'checkboxes')
	{
		var checkbox =
			'<p class="checkbox-multiselect-checkbox">' +
				'<input type="checkbox" id="{id}-{value}" value="{value}" {checked} />&nbsp;' +
				'<label for="{id}-{value}">{label}</label>' +
			'</p>';

		var column_start = '<td class="checkbox-multiselect-column">',
			column_end   = '</td>';

		var input_markup = Y.Array.reduce(o.field.values, '', function(s, v, i)
		{
			var m = Y.Lang.sub(checkbox,
			{
				id:      id,
				value:   v.value,
				checked: has_value && Y.Array.indexOf(o.value, v.value.toString()) >= 0 ? 'checked="checked"' : '',
				label:   BulkEditor.cleanHTML(v.text)
			});

			if (i > 0 && i % BulkEditor.checkbox_multiselect_column_height === 0)
			{
				m = column_end + column_start + m;
			}

			return s + m;
		});

		input_markup =
			'<table class="checkbox-multiselect-container"><tr>' +
			column_start + input_markup + column_end +
			'</tr></table>';
	}

	var option = '<option value="{value}" {selected}>{text}</option>';

	var options = Y.Array.reduce(o.field.values, '', function(s, v)
	{
		return s + Y.Lang.sub(option,
		{
			value:    v.value,
			text:     BulkEditor.cleanHTML(v.text),
			selected: has_value && Y.Array.indexOf(o.value, v.value.toString()) >= 0 ? 'selected="selected"' : ''
		});
	});

	var label = o.field && o.field.label ? BulkEditor.labelMarkup.call(this, o) : '';

	return Y.Lang.sub(select,
	{
		cont:  	 BulkEditor.field_container_class + ' ' + BulkEditor.field_container_class_prefix,
		field:   BulkEditor.field_class_prefix,
		key:     o.key,
		id:      id,
		label:   label,
		input:   input_markup,
		options: options,
		yiv:     (o.field && o.field.validation && o.field.validation.css) || '',
		msg:     BulkEditor.error_msg_markup
	});
}

function handleCheckboxMultiselectClickOnCheckbox(e)
{
	var cb     = e.currentTarget,
		value  = cb.get('value'),
		select = cb.ancestor('.checkbox-multiselect').next('select');

	Y.some(Y.Node.getDOMNode(select).options, function(o)
	{
		if (o.value == value)
		{
			o.selected = cb.get('checked');
			return true;
		}
	});
}

Y.BulkEditor = BulkEditor;
/**
 * @module gallery-bulkedit
 */

/**
 * <p>HTMLTableBulkEditor builds an HTML table with one tbody for each
 * record.</p>
 *
 * @class HTMLTableBulkEditor
 * @extends BulkEditor 
 * @constructor
 * @param config {Object}
 */
function HTMLTableBulkEditor()
{
	HTMLTableBulkEditor.superclass.constructor.apply(this, arguments);
}

HTMLTableBulkEditor.NAME = "htmltablebulkedit";

HTMLTableBulkEditor.ATTRS =
{
	/**
	 * Configuration for each column: key, label, formatter.
	 *
	 * @attribute columns
	 * @type {Array}
	 * @required
	 * @writeonce
	 */
	columns:
	{
		validator: Y.Lang.isObject,
		writeOnce: true
	},

	/**
	 * <p>Array of event delegations that will be attached to the container
	 * via Y.delegate().  Each item is an object defining type, nodes, fn.
	 * The function will be called in the context of the BulkEditor
	 * instance.</p>
	 * 
	 * <p>Attaching events to the container before the table is created does
	 * not work in all browsers.</p>
	 *
	 * @attribute events
	 * @type {Array}
	 * @writeonce
	 */
	events:
	{
		validator: Y.Lang.isObject,
		writeOnce: true
	}
};

var cell_class        = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'cell'),
	cell_class_prefix = cell_class + '-',
	odd_class         = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'odd'),
	even_class        = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'even'),
	msg_class         = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'record-message'),
	liner_class       = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'liner'),

	input_class          = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'input'),
	textarea_class       = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'textarea'),
	select_class         = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'select'),
	checkbox_class       = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'checkbox'),
	cb_multiselect_class = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'checkbox-multiselect'),
	cb_multi_input_class = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'input-multiselect');

/**
 * Renders an input element in the cell.
 *
 * @method inputFormatter
 * @static
 * @param o {Object} cell, key, value, field, column, record
 */
HTMLTableBulkEditor.inputFormatter = function(o)
{
	o.cell.set('innerHTML', BulkEditor.markup.input.call(this, o));
	o.cell.addClass(input_class);
};

/**
 * Renders a textarea element in the cell.
 *
 * @method textareaFormatter
 * @static
 * @param o {Object} cell, key, value, field, column, record
 */
HTMLTableBulkEditor.textareaFormatter = function(o)
{
	o.cell.set('innerHTML', BulkEditor.markup.textarea.call(this, o));
	o.cell.addClass(textarea_class);
};

/**
 * Renders a select element in the cell.
 *
 * @method selectFormatter
 * @static
 * @param o {Object} cell, key, value, field, column, record
 */
HTMLTableBulkEditor.selectFormatter = function(o)
{
	o.cell.set('innerHTML', BulkEditor.markup.select.call(this, o));
	o.cell.addClass(select_class);
};

/**
 * Renders a checkbox element in the cell.
 *
 * @method checkboxFormatter
 * @static
 * @param o {Object} cell, key, value, field, column, record
 */
HTMLTableBulkEditor.checkboxFormatter = function(o)
{
	o.cell.set('innerHTML', BulkEditor.markup.checkbox.call(this, o));
	o.cell.addClass(checkbox_class);
};

/**
 * Renders a set of checkboxes for multiselect in the cell.
 *
 * @method checkboxMultiselectFormatter
 * @static
 * @param o {Object} cell, key, value, field, column, record
 */
HTMLTableBulkEditor.checkboxMultiselectFormatter = function(o)
{
	o.cell.set('innerHTML', BulkEditor.markup.checkboxMultiselect.call(this, o));
	o.cell.addClass(cb_multiselect_class);
};

/**
 * Renders a multi-value input for multiselect in the cell.
 *
 * @method autocompleteInputMultiselectFormatter
 * @static
 * @param o {Object} cell, key, value, field, column, record
 */
HTMLTableBulkEditor.autocompleteInputMultiselectFormatter = function(o)
{
	o.cell.set('innerHTML', BulkEditor.markup.autocompleteInputMultiselect.call(this, o));
	o.cell.addClass(cb_multi_input_class);
};

/**
 * Map of field type to cell formatter.
 *
 * @property Y.HTMLTableBulkEditor.defaults
 * @type {Object}
 * @static
 */
HTMLTableBulkEditor.defaults =
{
	input:
	{
		formatter: HTMLTableBulkEditor.inputFormatter
	},

	select:
	{
		formatter: HTMLTableBulkEditor.selectFormatter
	},

	checkbox:
	{
		formatter: HTMLTableBulkEditor.checkboxFormatter
	},

	checkboxMultiselect:
	{
		formatter: HTMLTableBulkEditor.checkboxMultiselectFormatter
	},

	autocompleteInputMultiselect:
	{
		formatter: HTMLTableBulkEditor.autocompleteInputMultiselectFormatter
	},

	textarea:
	{
		formatter: HTMLTableBulkEditor.textareaFormatter
	}
};

function moveFocus(e)
{
	e.halt();

	var info = this.getRecordAndFieldKey(e.target);
	if (!info)
	{
		return;
	}

	var bd = this.getRecordContainer(e.target);
	if (bd && e.keyCode == 38)
	{
		bd = bd.previous();
	}
	else if (bd)
	{
		bd = bd.next();
	}

	var id = bd && this.getRecordId(bd);
	if (id)
	{
		var field = this.getFieldElement(id, info.field_key);
		if (field)
		{
			field.focus();
			try
			{
				field.select();
			}
			catch (ex)
			{
				// select elements don't support select()
			}
		}
	}
}

Y.extend(HTMLTableBulkEditor, BulkEditor,
{
	bindUI: function()
	{
		// attach events after creating the table
	},

	_renderContainer: function(
		/* element */	container)
	{
		var table_class = Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME);

		if (!this.table ||
			container.get('firstChild').get('tagName') != 'TABLE' ||
			!container.get('firstChild').hasClass(table_class))
		{
			var s = Y.Lang.sub('<table class="{t}"><thead class="{hd}"><tr>',
			{
				t:  table_class,
				hd: Y.ClassNameManager.getClassName(HTMLTableBulkEditor.NAME, 'hd')
			});

			var row_markup = '<th class="{cell} {prefix}{key}">{label}</th>';

			s = Y.Array.reduce(this.get('columns'), s, function(s, column)
			{
				return s + Y.Lang.sub(row_markup,
				{
					cell:   cell_class,
					prefix: cell_class_prefix,
					key:    column.key,
					label:  column.label || '&nbsp;'
				});
			});

			s += '</tr></thead></table>';

			container.set('innerHTML', s);
			this.table = container.get('firstChild');

			this._attachEvents(this.table);
			Y.on('key', moveFocus, this.table, 'down:38,40+ctrl', this);

			Y.Object.each(this.get('events'), function(e)
			{
				Y.delegate(e.type, e.fn, this.table, e.nodes, this);
			},
			this);
		}
		else
		{
			while (this.table.get('children').size() > 1)
			{
				this.table.get('lastChild').remove().destroy(true);
			}
		}
	},

	_renderRecordContainer: function(
		/* element */	container,
		/* object */	record)
	{
		var body = Y.Node.create('<tbody></tbody>');
		body.set('id', this.getRecordContainerId(record));
		body.set('className',
			BulkEditor.record_container_class + ' ' +
			((this.table.get('children').size() % 2) ? odd_class : even_class));	// accounts for th row

		var msg_row = Y.Node.create('<tr></tr>');
		msg_row.set('className', BulkEditor.record_msg_container_class);

		var msg_cell = Y.Node.create('<td></td>');
		msg_cell.set('colSpan', this.get('columns').length);
		msg_cell.set('className', msg_class);
		msg_cell.set('innerHTML', BulkEditor.error_msg_markup);

		msg_row.appendChild(msg_cell);
		body.appendChild(msg_row);

		var row = Y.Node.create('<tr></tr>');
		body.appendChild(row);

		this.table.appendChild(body);
		return row;
	},

	_renderRecord: function(
		/* element */	row,
		/* object */	record)
	{
		Y.Array.each(this.get('columns'), function(column)
		{
			var key    = column.key;
			var field  = this.getFieldConfig(key);

			// create cell

			var cell = Y.Node.create('<td></td>');
			cell.set('className', cell_class + ' ' + cell_class_prefix + key);

			// create liner

			var liner = Y.Node.create('<div></div>');
			liner.set('className', liner_class);

			// fill in liner

			var f = null;
			if (Y.Lang.isFunction(column.formatter))
			{
				f = column.formatter;
			}
			else if (field.type && HTMLTableBulkEditor.defaults[ field.type ])
			{
				f = HTMLTableBulkEditor.defaults[ field.type ].formatter;
			}
			else
			{
				if (field.type)
				{
					Y.log('no defaults for type ' + field.type + ', using type "input"', 'warn', 'HTMLTableBulkEditor');
				}

				f = HTMLTableBulkEditor.defaults.input.formatter;
			}

			if (f)
			{
				f.call(this,
				{
					cell:   liner,
					key:    key,
					value:  record[key],
					field:  field,
					column: column,
					record: record
				});
			}

			// append cell

			cell.appendChild(liner);
			row.appendChild(cell);
		},
		this);
	}
});

Y.HTMLTableBulkEditor = HTMLTableBulkEditor;


}, 'gallery-2014.02.20-23-55', {
    "skinnable": "true",
    "requires": [
        "widget",
        "datasource-local",
        "gallery-busyoverlay",
        "gallery-formmgr-css-validation",
        "gallery-node-optimizations",
        "gallery-scrollintoview",
        "array-extras",
        "gallery-funcprog",
        "escape",
        "event-key",
        "gallery-nodelist-extras2",
        "gallery-chipper"
    ],
    "optional": [
        "datasource",
        "dataschema",
        "gallery-paginator",
        "autocomplete",
        "autocomplete-filters",
        "autocomplete-highlighters",
        "gallery-multivalue-input"
    ]
});
