YUI.add('gallery-datatable-state', function(Y) {

"use strict";

/**
 * @module gallery-datatable-state
 */

/**********************************************************************
 * <p>Plugin for DataTable to preserve state, either on a single page or
 * across pages.</p>
 *
 * @main gallery-datatable-state
 * @class DataTableState
 * @namespace Plugin
 * @extends Plugin.Base
 * @constructor
 * @param config {Object} configuration
 */
function State(
	/* object */ config)
{
	State.superclass.constructor.call(this, config);
}

State.NAME = "DataTableStatePlugin";
State.NS   = "state";

State.ATTRS =
{
	/**
	 * Id of a column (usually not displayed) that yields a
	 * unique value for each record.  The saved state is index by the value
	 * of this column.
	 *
	 * @attribute uniqueIdKey
	 * @type {String}
	 * @required
	 */
	uniqueIdKey:
	{
		validator: Y.Lang.isString
	},

	/**
	 * List of objects specifying the values to be saved before
	 * the table is re-rendered.  Each object must define:
	 * <dl>
	 * <dt>column</dt>
	 * <dd>the column key</dd>
	 * <dt>node or widget</dt>
	 * <dd>CSS selector to find either the node or the widget container inside a cell</dd>
	 * <dt>key</dt>
	 * <dd>the value to pass to get/set</dd>
	 * <dt>temp</dt>
	 * <dd>true if the state should be cleared when paginating</dd>
	 * </dl>
	 * If a value should not be maintained when paginating, specify temp:true.
	 *
	 * @attribute save
	 * @type {Array}
	 * @required
	 */
	save:
	{
		value:     [],
		validator: Y.Lang.isArray
	},

	/**
	 * Paginator that triggers clearing of temporary state.  If
	 * this is not specified, temp:true will have no effect in the "save"
	 * configuration.
	 * 
	 * @attribute paginator
	 * @type {Paginator}
	 */
	paginator:
	{
		validator: function(value)
		{
			return (!value || Y.Lang.isObject(value));
		}
	}
};

function removeKey(key, obj)
{
	delete obj[key];
}

function clearState(key)
{
	Y.each(this.state, Y.bind(removeKey, null, key));
}

function analyzeColumns()
{
	var list = this.get('host')._displayColumns;

	Y.each(this.get('save'), function(item)
	{
		item.column_index = Y.Array.findIndexOf(list, function(c)
		{
			return c.key === item.column;
		});

		if (item.column_index < 0)
		{
			clearState.call(this, item.column);
		}
	},
	this);
}

function saveState()
{
	var host   = this.get('host');
	var count  = host.data.size();
	var id_key = this.get('uniqueIdKey');
	Y.each(this.get('save'), function(item)
	{
		if (item.column_index < 0)
		{
			return;
		}

		for (var i=0; i<count; i++)
		{
			var value = null;

			var cell = host.getCell([i, item.column_index]);
			if (cell)
			{
				if (item.node)
				{
					var node = cell.one(item.node);
					if (node)
					{
						value = node.get(item.key);
					}
				}
				else if (item.widget)
				{
					var widget = Y.Widget.getByNode(cell.one(item.widget));
					if (widget)
					{
						value = widget.get(item.key);
					}
				}
			}

			var rec = host.getRecord(i);
			var id  = rec.get(id_key);
			if (!this.state[id])
			{
				this.state[id] = {};
			}
			this.state[ id ][ item.column ] = value;
		}
	},
	this);
}

function restoreState()
{
	var host   = this.get('host');
	var count  = host.data.size();
	var id_key = this.get('uniqueIdKey');
	Y.each(this.get('save'), function(item)
	{
		if (item.column_index < 0)
		{
			return;
		}

		for (var i=0; i<count; i++)
		{
			var rec   = host.getRecord(i);
			var state = this.state[ rec.get(id_key) ];
			if (state)
			{
				var value = state[ item.column ];
				var cell  = host.getCell([i, item.column_index]);
				if (cell)
				{
					if (item.node)
					{
						var node = cell.one(item.node);
						if (node)
						{
							node.set(item.key, value);
						}
					}
					else if (item.widget)
					{
						var widget = Y.Widget.getByNode(cell.one(item.widget));
						if (widget)
						{
							widget.set(item.key, value);
						}
					}
				}
			}
		}
	},
	this);
}

function clearTempState()
{
	Y.each(this.get('save'), function(item)
	{
		if (item.column_index < 0 || item.temp)
		{
			clearState.call(this, item.column);
		}
	},
	this);
}

function listenToPaginator(pg)
{
	pg.on('datatable-state-paginator|changeRequest', clearTempState, this);
}

Y.extend(State, Y.Plugin.Base,
{
	initializer: function(config)
	{
		this.state = {};
		this.on('uniqueIdKeyChange', function()
		{
			this.state = {};
		});

		if (config.paginator)
		{
			listenToPaginator.call(this, config.paginator)
		}

		this.on('paginatorChange', function(e)
		{
			Y.detach('datatable-state-paginator|*');

			if (e.newVal)
			{
				listenToPaginator.call(this, e.newVal);
			}
		});

		analyzeColumns.call(this);
		this.after('saveChange', analyzeColumns);
		this.afterHostEvent('columnsChange', analyzeColumns);

		var host        = this.get('host');
		var self        = this;
		var orig_syncUI = this.orig_syncUI = host.syncUI;
		host.syncUI = function()
		{
			saveState.call(self);
			orig_syncUI.apply(host, arguments);
			restoreState.call(self);
		}

		this.onHostEvent('dataChange', saveState);
		this.afterHostEvent('dataChange', function()
		{
			Y.later(0, this, restoreState);
		});
	},

	destructor: function()
	{
		this.get('host').syncUI = this.orig_syncUI;
	},

	/**
	 * @method getState
	 * @return {Object} state for each row, indexed by uniqueIdKey and column key
	 */
	getState: function()
	{
		saveState.call(this);
		return this.state;
	}
});

Y.namespace("Plugin");
Y.Plugin.DataTableState = State;


}, 'gallery-2012.05.23-19-56' ,{requires:['datatable','plugin','gallery-funcprog','gallery-node-optimizations']});
