YUI.add('gallery-treeble', function (Y, NAME) {

"use strict";

/**
 * @module gallery-treeble
 */

/**********************************************************************
 * <p>Hierarchical data source.</p>
 *
 * <p>TreebleDataSource converts a tree of DataSources into a flat list of
 * visible items.  The merged list must be paginated if the number of child
 * nodes might be very large.  To turn on this feature, set
 * paginateChildren:true.</p>
 * 
 * <p>The tree must be immutable.  The total number of items available from
 * each DataSource must remain constant.  (The one exception to this rule
 * is that filtering and sorting are allowed.  This is done by detecting
 * that the request parameters have changed.)</p>
 * 
 * @namespace DataSource
 * @class Treeble
 * @extends DataSource.Local
 * @constructor
 * @param config {Object}
 */

function TreebleDataSource()
{
	TreebleDataSource.superclass.constructor.apply(this, arguments);
}

TreebleDataSource.NAME = "treebleDataSource";

TreebleDataSource.ATTRS =
{
	/**
	 * <p>The root datasource.</p>
	 * 
	 * <p>You <em>must</em> directly set a <code>treeble_config</code>
	 * object on this datasource.  (You cannot use
	 * <code>set('treeble_config',...)</code>.) <code>treeble_config</code> can
	 * contain the following configuration:</p>
	 * 
	 * <dl>
	 * <dt>generateRequest</dt>
	 * <dd>(required) The function to convert the initial request into
	 *		a request usable by the actual DataSource.  This function takes
	 *		two arguments: state (sort,dir,startIndex,resultCount) and path
	 *		(an array of node indices telling how to reach the node).
	 *		</dd>
	 * <dt>requestCfg</dt>
	 * <dd>(optional) Configuration object passed as <code>cfg</code> to
	 *		<code>sendRequest</code>.</dd>
	 * <dt>schemaPluginConfig</dt>
	 * <dd>(required) Object to pass to <code>plug</code> to install a schema.</dd>
	 * <dt>cachePluginConfig</dt>
	 * <dd>(optional) Object to pass to <code>plug</code> to install a cache.</dd>
	 * <dt>childNodesKey</dt>
	 * <dd>(semi-optional) The name of the key inside a node which contains
	 *		the data used to construct the DataSource for retrieving the children.
	 *		This config is only required if you provide a custom parser.</dd>
	 * <dt>nodeOpenKey</dt>
	 * <dd>(optional) The name of the key inside a node which contains
	 *		the initial open state of the node.  If it is true, the node will
	 *		automatically be opened the first time it is shown.  (After that,
	 *		it will remember the state set by the user.)</dd>
	 * <dt>startIndexExpr</dt>
	 * <dd>(optional) OGNL expression telling how to extract the startIndex
	 *		from the received data, e.g., <code>.meta.startIndex</code>.
	 *		If it is not provided, startIndex is always assumed to be zero.</dd>
	 * <dt>totalRecordsExpr</dt>
	 * <dd>(semi-optional) OGNL expression telling how to extract the total number
	 *		of records from the received data, e.g., <code>.meta.totalRecords</code>.
	 *		If this is not provided, <code>totalRecordsReturnExpr</code> must be
	 *		specified.</dd>
	 * <dt>totalRecordsReturnExpr</dt>
	 * <dd>(semi-optional) OGNL expression telling where in the response to store
	 *		the total number of records, e.g., <code>.meta.totalRecords</code>.
	 *		This is only appropriate for DataSources that always return the
	 *		entire data set.  If this is not provided,
	 *		<code>totalRecordsExpr</code> must be specified.  If both are provided,
	 *		<code>totalRecordsExpr</code> takes priority.</dd>
	 * </dl>
	 * 
	 * @attribute root
	 * @type {DataSource}
	 * @writeonce
	 */
	root:
	{
		writeOnce: true
	},

	/**
	 * Pass <code>true</code> to paginate the result after merging child
	 * nodes into the list.  The default (<code>false</code>) is to
	 * paginate only root nodes, so all children are visible.
	 * 
	 * @attribute paginateChildren
	 * @type {boolean}
	 * @default false
	 * @writeonce
	 */
	paginateChildren:
	{
		value:     false,
		validator: Y.Lang.isBoolean,
		writeOnce: true
	},

	/**
	 * The key in each record that stores an identifier which is unique
	 * across the entire tree.  If this is not specified, then all nodes
	 * will close when the data is sorted.
	 * 
	 * @attribute uniqueIdKey
	 * @type {String}
	 */
	uniqueIdKey:
	{
		validator: Y.Lang.isString
	}
};

/**
 * @event toggled
 * @description Fires after an element is opened or closed.
 * @param path {Array} the path to the toggled element
 * @param open {Boolean} the new state of the element
 */

/*

	Each element in this._open contains information about an openable,
	top-level node and is the root of a tree of open (or previously opened)
	items.  Each node in a tree contains the following data:

		index:      {Number} sorting key; the index of the node
		open:       null if never opened, true if open, false otherwise
		ds:         {DataSource} source for child nodes
		childTotal: {Number} total number of child nodes
		children:   {Array} (recursive) child nodes which are or have been opened
		parent:     {Object} parent item

	Each level is sorted by index to allow simple traversal in display
	order.

 */

function populateOpen(
	/* object */	parent,
	/* array */		open,
	/* object */	req)
{
	var data          = req.data;
	var startIndex    = req.start;
	var childNodesKey = req.ds.treeble_config.childNodesKey;
	var nodeOpenKey   = req.ds.treeble_config.nodeOpenKey;

	for (var j=0; j<open.length; j++)
	{
		if (open[j].index >= startIndex)
		{
			break;
		}
	}

	var uniqueIdKey = this.get('uniqueIdKey');

	var result = true;
	for (var k=0; k<data.length; k++)
	{
		var i = startIndex + k;
		var ds = data[k][ childNodesKey ];
		if (!ds)
		{
			continue;
		}

		while (j < open.length && open[j].index < i)
		{
			open.splice(j, 1);
			result = false;

			if (uniqueIdKey)
			{
				delete this._open_cache[ data[k][ uniqueIdKey ] ];
			}
		}

		if (j >= open.length || open[j].index > i)
		{
			var item =
			{
				index:      i,
				open:       null,
				ds:         ds,
				children:   [],
				childTotal: 0,
				parent:     parent
			};

			var cached_item = null;
			if (uniqueIdKey)
			{
				cached_item = this._open_cache[ data[k][ uniqueIdKey ] ];
				if (cached_item)
				{
					item.open       = cached_item.open;
					item.childTotal = cached_item.childTotal;
					this._redo      = this._redo || item.open;
				}

				this._open_cache[ data[k][ uniqueIdKey ] ] = item;
			}

			if (!cached_item && nodeOpenKey && data[k][ nodeOpenKey ])
			{
				this._toggle.push(req.path.concat(i));
			}

			open.splice(j, 0, item);
		}

		j++;
	}

	return result;
}

// TODO: worth switching to binary search?
function searchOpen(
	/* array */	list,
	/* int */	nodeIndex)
{
	for (var i=0; i<list.length; i++)
	{
		if (list[i].index == nodeIndex)
		{
			return list[i];
		}
	}

	return false;
}

function getNode(
	/* array */	path)
{
	var open = this._open;
	var last = path.length-1;
	for (var i=0; i<last; i++)
	{
		var node = searchOpen(open, path[i]);
		open     = node.children;
	}

	return searchOpen(open, path[last]);
}

function countVisibleNodes(

	// not sent by initiator

	/* array */ open)
{
	var total = 0;
	if (!open)
	{
		open  = this._open;
		total = this._topNodeTotal;
	}

	if (this.get('paginateChildren'))
	{
		for (var i=0; i<open.length; i++)
		{
			var node = open[i];
			if (node.open)
			{
				total += node.childTotal;
				total += countVisibleNodes.call(this, node.children);
			}
		}
	}

	return total;
}

function requestTree(flush_toggle)
{
	if (!flush_toggle)
	{
		var save_toggle = this._toggle.slice(0);
	}

	this._cancelAllRequests();

	if (!flush_toggle)
	{
		this._toggle = save_toggle;
	}

	this._redo                = false;
	this._generating_requests = true;

	var req = this._callback.request;
	if (this.get('paginateChildren'))
	{
		this._slices = getVisibleSlicesPgAll(req.startIndex, req.resultCount,
											 this.get('root'), this._open);
	}
	else
	{
		this._slices = getVisibleSlicesPgTop(req.startIndex, req.resultCount,
											 this.get('root'), this._open);
	}

	requestSlices.call(this, req);

	this._generating_requests = false;
	checkFinished.call(this);
}

function getVisibleSlicesPgTop(
	/* int */			skip,
	/* int */			show,
	/* DataSource */	ds,
	/* array */			open,

	// not sent by initiator

	/* array */			path)
{
	open = open.concat(
	{
		index:      -1,
		open:       true,
		childTotal: 0,
		children:   null
	});

	if (!path)
	{
		path = [];
	}

	var slices = [],
		send   = false;

	var m = 0, prev = -1, presend = false;
	for (var i=0; i<open.length; i++)
	{
		var node = open[i];
		if (!node.open)
		{
			continue;
		}

		var delta = node.index - prev;

		if (m + delta >= skip + show ||
			node.index == -1)
		{
			slices.push(
			{
				ds:    ds,
				path:  path.slice(0),
				start: send ? m : skip,
				end:   skip + show - 1
			});

			if (m + delta == skip + show && node.childTotal > 0)
			{
				slices = slices.concat(
					getVisibleSlicesPgTop(0, node.childTotal, node.ds,
										  node.children, path.concat(node.index)));
			}

			return slices;
		}
		else if (!send && m + delta == skip)
		{
			presend = true;
		}
		else if (m + delta > skip)
		{
			slices.push(
			{
				ds:    ds,
				path:  path.slice(0),
				start: send ? prev + 1 : skip,
				end:   m + delta - 1
			});
			send = true;
		}

		m += delta;

		if (send && node.childTotal > 0)
		{
			slices = slices.concat(
				getVisibleSlicesPgTop(0, node.childTotal, node.ds,
									  node.children, path.concat(node.index)));
		}

		prev = node.index;
		send = send || presend;
	}
}

function getVisibleSlicesPgAll(
	/* int */			skip,
	/* int */			show,
	/* DataSource */	rootDS,
	/* array */			open,

	// not sent by initiator

	/* array */			path,
	/* node */			parent,
	/* int */			pre,
	/* bool */			send,
	/* array */			slices)
{
	if (!parent)
	{
		path   = [];
		parent = null;
		pre    = 0;
		send   = false;
		slices = [];
	}

	var ds = parent ? parent.ds : rootDS;

	open = open.concat(
	{
		index:      parent ? parent.childTotal : -1,
		open:       true,
		childTotal: 0,
		children:   null
	});

	var n = 0, m = 0, prev = -1;
	for (var i=0; i<open.length; i++)
	{
		var node = open[i];
		if (!node.open)
		{
			continue;
		}

		var delta = node.index - prev;
		if (node.children === null)
		{
			delta--;	// last item is off the end
		}

		if (pre + n + delta >= skip + show ||
			node.index == -1)
		{
			slices.push(
			{
				ds:    ds,
				path:  path.slice(0),
				start: m + (send ? 0 : skip - pre - n),
				end:   m + (skip + show - 1 - pre - n)
			});

			return slices;
		}
		else if (!send && pre + n + delta == skip)
		{
			send = true;
		}
		else if (pre + n + delta > skip)
		{
			slices.push(
			{
				ds:    ds,
				path:  path.slice(0),
				start: m + (send ? 0 : skip - pre - n),
				end:   m + delta - 1
			});
			send = true;
		}

		n += delta;
		m += delta;

		if (node.childTotal > 0)
		{
			var info = getVisibleSlicesPgAll(skip, show, rootDS, node.children,
											 path.concat(node.index),
											 node, pre+n, send, slices);
			if (Y.Lang.isArray(info))
			{
				return info;
			}
			else
			{
				n   += info.count;
				send = info.send;
			}
		}

		prev = node.index;
	}

	// only reached when parent != null

	var info =
	{
		count: n,
		send:  send
	};
	return info;
}

function requestSlices(
	/* object */	request)
{
	for (var i=0; i<this._slices.length; i++)
	{
		var slice = this._slices[i];
		var ds    = slice.ds;
		var req   = findRequest.call(this, ds);
		if (req)
		{
			if (Y.Console)
			{
				if (req.end+1 < slice.start)
				{
					Y.error('TreebleDataSource found discontinuous range');
				}

				if (req.path.length != slice.path.length)
				{
					Y.error('TreebleDataSource found path length mismatch');
				}
				else
				{
					for (var j=0; j<slice.path.length; j++)
					{
						if (req.path[j] != slice.path[j])
						{
							Y.error('TreebleDataSource found path mismatch');
							break;
						}
					}
				}
			}

			req.end = slice.end;
		}
		else
		{
			this._req.push(
			{
				ds:    ds,
				path:  slice.path,
				start: slice.start,
				end:   slice.end
			});
		}
	}

	request = Y.clone(request, true);
	for (var i=0; i<this._req.length; i++)
	{
		var req             = this._req[i];
		request.startIndex  = req.start;
		request.resultCount = req.end - req.start + 1;

		req.txId = req.ds.sendRequest(
		{
			request: req.ds.treeble_config.generateRequest(request, req.path),
			cfg:     req.ds.treeble_config.requestCfg,
			callback:
			{
				success: Y.rbind(treeSuccess, this, i),
				failure: Y.rbind(treeFailure, this, i)
			}
		});
	}
}

function findRequest(
	/* DataSource */	ds)
{
	for (var i=0; i<this._req.length; i++)
	{
		var req = this._req[i];
		if (ds == req.ds)
		{
			return req;
		}
	}

	return null;
}

function treeSuccess(e, reqIndex)
{
	if (!e.response || e.error ||
		!Y.Lang.isArray(e.response.results))
	{
		treeFailure.apply(this, arguments);
		return;
	}

	var req = searchTxId(this._req, e.tId, reqIndex);
	if (!req)
	{
		return;		// cancelled request
	}

	if (!this._topResponse && req.ds == this.get('root'))
	{
		this._topResponse = e.response;
	}

	req.txId  = null;
	req.resp  = e.response;
	req.error = false;

	var dataStartIndex = 0;
	if (req.ds.treeble_config.startIndexExpr)
	{
		eval('dataStartIndex=req.resp'+req.ds.treeble_config.startIndexExpr);
	}

	var sliceStartIndex = req.start - dataStartIndex;
	req.data            = e.response.results.slice(sliceStartIndex, req.end - dataStartIndex + 1);
	setNodeInfo(req.data, req.start, req.path, req.ds);

	var parent = (req.path.length > 0 ? getNode.call(this, req.path) : null);
	var open   = (parent !== null ? parent.children : this._open);
	if (!populateOpen.call(this, parent, open, req))
	{
		treeFailure.apply(this, arguments);
		return;
	}

	if (!parent && req.ds.treeble_config.totalRecordsExpr)
	{
		eval('this._topNodeTotal=e.response'+req.ds.treeble_config.totalRecordsExpr);
	}
	else if (!parent && req.ds.treeble_config.totalRecordsReturnExpr)
	{
		this._topNodeTotal = e.response.results.length;
	}

	checkFinished.call(this);
}

function treeFailure(e, reqIndex)
{
	var req = searchTxId(this._req, e.tId, reqIndex);
	if (!req)
	{
		return;		// cancelled request
	}

	this._cancelAllRequests();

	this._callback.error    = e.error;
	this._callback.response = e.response;
	this.fire('response', this._callback);
}

function setNodeInfo(
	/* array */			list,
	/* int */			offset,
	/* array */			path,
	/* datasource */	ds)
{
	var depth = path.length;
	for (var i=0; i<list.length; i++)
	{
		list[i]._yui_node_depth = depth;
		list[i]._yui_node_path  = path.concat(offset+i);
		list[i]._yui_node_ds    = ds;
	}
}

function searchTxId(
	/* array */	req,
	/* int */	id,
	/* int */	fallbackIndex)
{
	for (var i=0; i<req.length; i++)
	{
		if (req[i].txId === id)
		{
			return req[i];
		}
	}

	// synch response arrives before setting txId

	if (fallbackIndex < req.length &&
		Y.Lang.isUndefined(req[ fallbackIndex ].txId))
	{
		return req[ fallbackIndex ];
	}

	return null;
}

function checkFinished()
{
	if (this._generating_requests)
	{
		return;
	}

	var count = this._req.length;
	for (var i=0; i<count; i++)
	{
		if (!this._req[i].resp)
		{
			return;
		}
	}

	if (this._redo)
	{
		Y.Lang.later(0, this, requestTree);
		return;
	}
	else if (this._toggle.length > 0)
	{
		var t = this._toggle.shift();
		this.toggle(t, Y.clone(this._callback.request, true),
		{
			fn: function()
			{
				Y.Lang.later(0, this, requestTree);
			},
			scope: this
		});
		return;
	}

	var response = { meta:{} };
	Y.mix(response, this._topResponse, true);
	response.results = [];
	response         = Y.clone(response, true);

	count = this._slices.length;
	for (i=0; i<count; i++)
	{
		var slice = this._slices[i];
		var req   = findRequest.call(this, slice.ds);
		if (!req)
		{
			Y.error('Failed to find request for a slice');
			continue;
		}

		var j    = slice.start - req.start;
		var data = req.data.slice(j, j + slice.end - slice.start + 1);

		response.results = response.results.concat(data);
	}

	var rootDS = this.get('root');
	if (rootDS.treeble_config.totalRecordsExpr)
	{
		eval('response'+rootDS.treeble_config.totalRecordsExpr+'='+countVisibleNodes.call(this));
	}
	else if (rootDS.treeble_config.totalRecordsReturnExpr)
	{
		eval('response'+rootDS.treeble_config.totalRecordsReturnExpr+'='+countVisibleNodes.call(this));
	}

	this._callback.response = response;
	this.fire('response', this._callback);
}

function toggleSuccess(e, node, completion, path)
{
	if (node.ds.treeble_config.totalRecordsExpr)
	{
		eval('node.childTotal=e.response'+node.ds.treeble_config.totalRecordsExpr);
	}
	else if (node.ds.treeble_config.totalRecordsReturnExpr)
	{
		node.childTotal = e.response.results.length;
	}

	node.open     = true;
	node.children = [];
	complete(completion);

	this.fire('toggled',
	{
		path: path,
		open: node.open
	});
}

function toggleFailure(e, node, completion, path)
{
	node.childTotal = 0;

	node.open     = true;
	node.children = [];
	complete(completion);

	this.fire('toggled',
	{
		path: path,
		open: node.open
	});
}

function complete(f)
{
	if (Y.Lang.isFunction(f))
	{
		f();
	}
	else if (f && f.fn)
	{
		f.fn.apply(f.scope || window, Y.Lang.isUndefined(f.args) ? [] : f.args);
	}
}

function compareRequests(r1, r2)
{
	var k1 = Y.Object.keys(r1),
		k2 = Y.Object.keys(r2);

	if (k1.length != k2.length)
	{
		return false;
	}

	for (var i=0; i<k1.length; i++)
	{
		var k = k1[i];
		if (k != 'startIndex' && k != 'resultCount' && r1[k] !== r2[k])
		{
			return false;
		}
	}

	return true;
}

Y.extend(TreebleDataSource, Y.DataSource.Local,
{
	initializer: function(config)
	{
		if (!config.root)
		{
			Y.error('TreebleDataSource requires DataSource');
		}

		if (!config.root.treeble_config.childNodesKey)
		{
			var fields = config.root.schema.get('schema').resultFields;
			if (!fields || !Y.Lang.isArray(fields))
			{
				Y.error('TreebleDataSource root DataSource requires schema.resultFields because treeble_config.childNodesKey was not specified.');
			}

			for (var i=0; i<fields.length; i++)
			{
				if (Y.Lang.isObject(fields[i]) && fields[i].parser == 'treebledatasource')
				{
					config.root.treeble_config.childNodesKey = fields[i].key;
					break;
				}
			}

			if (!config.root.treeble_config.childNodesKey)
			{
				Y.error('TreebleDataSource requires treeble_config.childNodesKey configuration to be set on root DataSource');
			}
		}

		if (!config.root.treeble_config.generateRequest)
		{
			Y.error('TreebleDataSource requires treeble_config.generateRequest configuration to be set on root DataSource');
		}

		if (!config.root.treeble_config.totalRecordsExpr && !config.root.treeble_config.totalRecordsReturnExpr)
		{
			Y.error('TreebleDataSource requires either treeble_config.totalRecordsExpr or treeble_config.totalRecordsReturnExpr configuration to be set on root DataSource');
		}

		this._open       = [];
		this._open_cache = {};
		this._toggle     = [];
		this._req        = [];
	},

	/**
	 * @method isOpen
	 * @param path {Array} Path to node
	 * @return {boolean} true if the node is open
	 */
	isOpen: function(path)
	{
		var list = this._open;
		for (var i=0; i<path.length; i++)
		{
			var node = searchOpen.call(this, list, path[i]);
			if (!node || !node.open)
			{
				return false;
			}
			list = node.children;
		}

		return true;
	},

	/**
	 * Toggle the specified node between open and closed.  When a node is
	 * opened for the first time, this requires a request to the
	 * DataSource.  Any code that assumes the node has been opened must be
	 * passed in as a completion function.
	 * 
	 * @method toggle
	 * @param path {Array} Path to the node
	 * @param request {Object} {sort,dir,startIndex,resultCount}
	 * @param completion {Function|Object} Function to call when the operation completes.  Can be object: {fn,scope,args}
	 * @return {boolean} false if the path to the node has not yet been fully explored or is not openable, true otherwise
	 */
	toggle: function(path, request, completion)
	{
		var list = this._open;
		for (var i=0; i<path.length; i++)
		{
			var node = searchOpen.call(this, list, path[i]);
			if (!node)
			{
				return false;
			}
			list = node.children;
		}

		if (node.open === null)
		{
			request.startIndex  = 0;
			request.resultCount = 0;
			node.ds.sendRequest(
			{
				request: node.ds.treeble_config.generateRequest(request, path),
				cfg:     node.ds.treeble_config.requestCfg,
				callback:
				{
					success: Y.rbind(toggleSuccess, this, node, completion, path),
					failure: Y.rbind(toggleFailure, this, node, completion, path)
				}
			});
		}
		else
		{
			node.open = !node.open;
			complete(completion);

			this.fire('toggled',
			{
				path: path,
				open: node.open
			});
		}
		return true;
	},

	_defRequestFn: function(e)
	{
		// wipe out all state if the request parameters change

		if (this._callback && !compareRequests(this._callback.request, e.request))
		{
			this._open = [];
		}

		this._callback = e;
		requestTree.call(this, true);
	},

	_cancelAllRequests: function()
	{
		this._req    = [];
		this._toggle = [];
		delete this._topResponse;
	}
});

Y.TreebleDataSource = TreebleDataSource;
Y.namespace('DataSource').Treeble = TreebleDataSource;
/**
 * @module gallery-treeble
 */

/**
 * <p>Converts data to a DataSource.  Data can be an object containing both
 * <code>dataType</code> and <code>liveData</code>, or it can be <q>free
 * form</q>, e.g., an array of records or an XHR URL.</p>
 *
 * @class Parsers
 */

/**
 * @method treebledatasource
 * @static
 * @param oData {mixed} Data to convert.
 * @return {DataSource} The new data source.
 */
Y.namespace("Parsers").treebledatasource = function(oData)
{
	if (!oData)
	{
		return null;
	}

	var type = oData.dataType;
	if (type)
	{
		// use it
	}
	else if (Y.Lang.isString(oData))
	{
		type = 'IO';
	}
	else if (Y.Lang.isFunction(oData))
	{
		type = 'Function';
	}
	else
	{
		type = 'Local';
	}

	var src            = oData.dataType ? oData.liveData : oData;
	var treeble_config = this.get('host').treeble_config;
	if (type == 'Local')
	{
		treeble_config = Y.clone(treeble_config, true);
		delete treeble_config.startIndexExpr;
		delete treeble_config.totalRecordsExpr;
	}
	else if (type == 'Function')
	{
		src = Y.Lang.isString(src) ? window[ src ] : src;
	}

	var ds            = new Y.DataSource[ type ]({ source: src });
	ds.treeble_config = treeble_config;

	if (ds.treeble_config.schemaPluginConfig)
	{
		ds.plug(Y.clone(ds.treeble_config.schemaPluginConfig, true));
	}

	if (ds.treeble_config.cachePluginConfig)
	{
		ds.plug(Y.clone(ds.treeble_config.cachePluginConfig, true));
	}

	return ds;
};
/**********************************************************************
 * Treeble displays a tree of data in a table.
 *
 * @module gallery-treeble
 * @main gallery-treeble
 */

/**
 * Extension to DataTable for displaying tree data.
 *
 * @class Treeble
 * @extends DataTable
 * @constructor
 * @param config {Object}
 */
function Treeble()
{
	Treeble.superclass.constructor.apply(this, arguments);
}

Treeble.NAME = "datatable";		// same styling

/**
 * <p>Formatter for open/close twistdown.</p>
 *
 * @method twistdownFormatter
 * @static
 * @param sendRequest {Function} Function that reloads DataTable
 */
Treeble.buildTwistdownFormatter = function(sendRequest)
{
	return function(o)
	{
		o.td.addClass('treeble-nub');

		var ds  = this.datasource.get('datasource');
		var key = ds.get('root').treeble_config.childNodesKey;

		if (o.data[key])
		{
			var path = o.data._yui_node_path;

			o.td.addClass('row-toggle');
			o.td.replaceClass('row-(open|closed)',
				ds.isOpen(path) ? 'row-open' : 'row-closed');

			YUI.Env.add(Y.Node.getDOMNode(o.td), 'click', function()
			{
				ds.toggle(path, {}, sendRequest);
			});

			o.cell.set('innerHTML', '<a class="treeble-expand-nub" href="javascript:void(0);"></a>');
		}

		return false;	// discard Y.Node instances
	};
};

/**
 * <p>Default formatter for indented column.</p>
 *
 * @method treeValueFormatter
 * @static
 */
Treeble.treeValueFormatter = function(o)
{
	var depth_class = 'treeble-depth-'+o.data._yui_node_depth;
	o.rowClass     += ' ' + depth_class;
	o.className    += ' treeble-value';
	return '<span class="'+depth_class+'">'+o.value+'</span>';
};

Y.extend(Treeble, Y.DataTable,
{
	plug: function(plugin, config)
	{
		if (plugin === Y.Plugin.DataTableDataSource)
		{
			var recordType = this.get('recordType');
			recordType.ATTRS[ config.datasource.get('root').treeble_config.childNodesKey ] = {};
			recordType.ATTRS._yui_node_path  = {};
			recordType.ATTRS._yui_node_depth = {};
		}

		Treeble.superclass.plug.apply(this, arguments);
	}
});

Y.Treeble = Treeble;


}, 'gallery-2013.04.03-19-53', {"skinnable": "true", "requires": ["datasource", "datatable"]});
