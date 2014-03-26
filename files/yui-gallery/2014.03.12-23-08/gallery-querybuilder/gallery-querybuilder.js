YUI.add('gallery-querybuilder', function (Y, NAME) {

"use strict";

var has_bubble_problem = (0 < Y.UA.ie && Y.UA.ie < 9);

/**********************************************************************
 * Widget which allows user to build a list of query criteria, e.g., for
 * searching.  All the conditions are either AND'ed or OR'ed.  For a more
 * general query builder, see gallery-exprbuilder.
 * 
 * @main gallery-mathcanvas
 * @module gallery-querybuilder
 */

/**
 * <p>The default package provides two data types:  String (which can also
 * be used for numbers) and Select (which provides a menu of options).  The
 * plugin API allows defining additional data types, e.g., date range or
 * multi-select.  Every plugin must be registered in
 * `Y.QueryBuilder.plugin_mapping`.  Plugins must implement the following
 * functions:</p>
 *
 * <dl>
 * <dt>`constructor(qb, config)`</dt>
 * <dd>The arguments passed to the constructor are the QueryBuilder instance
 *		and the `pluginConfig` set on the QueryBuilder instance.
 *		At the minimum, this function should initalize form field name patterns
 *		using `config.field_prefix`.</dd>
 * <dt>`create(query_index, var_config, op_list, value)`<dt>
 * <dd>This function must create the additional cells for the query row and
 *		populate these cells appropriately.  (The QueryBuilder widget will
 *		insert the cells into the table.)  `var_config` is the
 *		item from the QueryBuilder's `var_list` that the user
 *		selected.  `op_list` is the item from the QueryBuilder's
 *		`operators` which matches the variable selected by the
 *		user.  `value` is optional.  If specified, it is the
 *		initial value(s) to be displayed by the plugin.</dd>
 * <dt>`postCreate(query_index, var_config, op_list, value)`</dt>
 * <dd>Optional.  If it exists, it will be called after the cells returned by
 *		`create()` have been inserted into the table.  The arguments
 *		are the same as `create()`.</dd>
 * <dt>`destroy()`</dt>
 * <dd>Destroy the plugin.  (The QueryBuilder widget will remove the cells
 *		and purge all events.)</dd>
 * <dt>`updateName(new_index)`</dt>
 * <dd>Update the names of the form fields managed by the plugin.</dd>
 * <dt>`set(query_index, data)`</dt>
 * <dd>Set the displayed value(s) by extracting values from data (a map)
 *		based on the current names of the plugin's form fields.</dd>
 * <dt>`toDatabaseQuery()`</dt>
 * <dd>Return an array of arrays.  Each inner array contains an operation
 *		and a value.  The default String and Select plugins each return
 *		a single inner array.  A date range plugin would return two inner
 *		arrays, one for the start date and one for the end date.</dd>
 * <dt>`validate()`</dt>
 * <dd>Optional.  If additional validations are required beyond the basic
 *		validations encoded in CSS, this function should check them.  If
 *		the input is not valid, call `displayFieldMessage()`
 *		on the QueryBuilder object and return false.  Otherwise, return
 *		true.</dd>
 * </dl>
 *
 * @class QueryBuilder
 * @extends Widget
 * @constructor
 * @param var_list {Array} List of variables that be included in the query.
 * @param var_list.name {String} The name of the variable.  Set as the `value` for the select option.
 * @param var_list.type {String} The variable type.  Used to determine which plugin to instantiate. Must match a key in `Y.QueryBuilder.plugin_mapping`. (You can add new plugins to this global mapping.)
 * @param var_list.text {String} The text displayed when the variable is selected.
 * @param var_list.** {Mixed} plugin-specific configuration
 * @param operators {Object} Map of variable types to list of operators. Each operator is an object defining `value` and `text`.
 * @param config {Object} Widget configuration
 */

function QueryBuilder(
	/* array */		var_list,
	/* object */	operators,
	/* object */	config)
{
	if (!Y.FormManager)
	{
		Y.FormManager =
		{
			row_marker_class:    '',
			field_marker_class:  '',
			status_marker_class: '',
			required_class:      ''
		};
	}

	// list of variables that can be queried

	this.var_list = var_list.slice(0);

	// list of possible query operations for each data type

	this.op_list      = Y.clone(operators, true);
	this.op_list.none = [];

	// table rows containing the query elements

	this.row_list = [];

	QueryBuilder.superclass.constructor.call(this, config);
}

QueryBuilder.NAME = "querybuilder";

QueryBuilder.ATTRS =
{
	/**
	 * The prompt displayed when a new item is added to the query.
	 *
	 * @attribute chooseVarPrompt
	 * @type {String}
	 * @default "Choose a variable"
	 * @writeonce
	 */
	chooseVarPrompt:
	{
		value:     'Choose a Variable',
		validator: Y.Lang.isString,
		writeOnce: true
	},

	/**
	 * All generated form field names start with this prefix.  This avoids
	 * conflicts if you have more than one QueryBuilder on a page.
	 *
	 * @attribute fieldPrefix
	 * @type {String}
	 * @default ""
	 * @writeonce
	 */
	fieldPrefix:
	{
		value:     '',
		validator: Y.Lang.isString,
		writeOnce: true
	},

	/**
	 * Configuration passed to plugins when they are constructed.
	 *
	 * @attribute pluginConfig
	 * @type {Object}
	 * @default {}
	 * @writeonce
	 */
	pluginConfig:
	{
		value:     {},
		validator: Y.Lang.isObject,
		writeOnce: true
	}
};

/**
 * @event queryChanged
 * @description Fires when the query is modified.
 * @param info {Object} `remove` is `true` if a row was removed
 */

function initVarList()
{
	this.var_list.unshift(
	{
		name: 'yui3-querybuilder-choose-prompt',
		type: 'none',
		text: this.get('chooseVarPrompt')
	});
}

function findRow(
	/* array */		row_list,
	/* element */	query_row)
{
	var count = row_list.length;
	for (var i=0; i<count; i++)
	{
		if (row_list[i].row == query_row)
		{
			return i;
		}
	}

	return -1;
}

function insertRow(
	/* event */		e,
	/* element */	query_row)
{
	e.halt();
	this.appendNew();
}

function removeRow(
	/* event */		e,
	/* element */	query_row)
{
	e.halt();

	var i = findRow(this.row_list, query_row);
	if (i >= 0)
	{
		this.remove(i);
	}
}

function changeVar(
	/* event */		e,
	/* element */	query_row)
{
	var i = findRow(this.row_list, query_row);
	if (i >= 0)
	{
		this.update(i);
	}
}

function keyUp(e)
{
	if (e.keyCode != 13)
	{
		this._notifyChanged();
	}
}

Y.extend(QueryBuilder, Y.Widget,
{
	initializer: function(config)
	{
		var field_prefix                      = this.get('fieldPrefix');
		this.var_menu_name_pattern            = field_prefix + 'query_var_{i}';
		this.get('pluginConfig').field_prefix = field_prefix;
		this.plugin_column_count              = 0;	// expands as needed

		initVarList.call(this);
	},

	renderUI: function()
	{
		var container = this.get('contentBox');
		container.on('change', this._notifyChanged, this);
		container.on('keyup', keyUp, this);

		this.table = Y.Node.create('<table></table>');
		container.appendChild(this.table);

		this.appendNew();
	},

	destructor: function()
	{
		for (var i=0; i<this.row_list.length; i++)
		{
			if (this.row_list[i].plugin)
			{
				this.row_list[i].plugin.destroy();
			}
		}

		this.row_list = null;
		this.table    = null;
	},

	/**
	 * Reset the query.
	 *
	 * @method reset
	 * @param var_list {Array} If specified, the list of available variables is replaced.
	 * @param operators {Object} If specified, the operators for all variable types will be replaced.
	 */
	reset: function(
		/* array */		var_list,
		/* object */	operators)
	{
		this._allow_remove_last_row = true;

		for (var i=this.row_list.length-1; i>=0; i--)
		{
			this.remove(i);
		}

		this._allow_remove_last_row = false;

		if (var_list)
		{
			this.var_list = var_list.slice(0);
			initVarList.call(this);
		}

		if (operators)
		{
			this.op_list      = Y.clone(operators, true);
			this.op_list.none = [];
		}

		this.has_messages = false;
		this.appendNew();
	},

	/**
	 * Append a new query condition to the table.
	 *
	 * @method appendNew
	 * @param name {String} If specified, this variable is selected.
	 * @param value {Mixed} If specified, this value is selected.  Refer to the appropriate plugin documentation to figure out what data to pass.
	 * @return {Object} plugin that was created for the row, if any
	 */
	appendNew: function(
		/* string */	name,
		/* mixed */		value)
	{
		// if has single, neutral row, use it

		if (name && this.row_list.length == 1)
		{
			var var_menu = this.row_list[0].var_menu;
			if (var_menu.get('selectedIndex') === 0)
			{
				for (var i=0; i<this.var_list.length; i++)
				{
					if (this.var_list[i].name == name)
					{
						var_menu.set('selectedIndex', i);
						break;
					}
				}

				this.update(0, value);
				return this.row_list[0].plugin;
			}
		}

		// create new row

		var new_index  = this.row_list.length;
		var query_body = Y.Node.create('<tbody></tbody>');
		query_body.set('className', Y.FormManager.row_marker_class);

		// error row

		var error_row = Y.Node.create('<tr></tr>');
		error_row.set('className', this.getClassName('error'));
		query_body.appendChild(error_row);

		var error_cell = this._createContainer();
		error_cell.set('colSpan', 1 + this.plugin_column_count);
		error_cell.set('innerHTML', '<p class="' + Y.FormManager.status_marker_class + '"></p>');
		error_row.appendChild(error_cell);

		error_row.appendChild(this._createContainer());

		// criterion row

		var query_row = Y.Node.create('<tr></tr>');
		query_row.set('className', this.getClassName('criterion'));
		query_body.appendChild(query_row);

		// cell for query variable menu

		var var_cell = this._createContainer();
		var_cell.set('className', this.getClassName('variable'));
		query_row.appendChild(var_cell);

		// menu for selecting query variable

		var_cell.set('innerHTML', this._variablesMenu(this.variableName(new_index)));

		var var_menu = var_cell.one('select');
		var_menu.on('change', changeVar, this, query_row);

		var options = Y.Node.getDOMNode(var_menu).options;
		for (var i=0; i<this.var_list.length; i++)
		{
			options[i] = new Option(this.var_list[i].text, this.var_list[i].name);
			if (this.var_list[i].name == name)
			{
				var_menu.set('selectedIndex', i);
			}
		}

		if (has_bubble_problem)
		{
			var_menu.on('change', this._notifyChanged, this);
		}

		// controls for this row

		var control_cell = this._createContainer();
		control_cell.set('className', this.getClassName('controls'));
		control_cell.set('innerHTML', this._rowControls());
		query_row.appendChild(control_cell);

		var insert_control = control_cell.one('.'+this.getClassName('insert'));
		if (insert_control)
		{
			insert_control.on('click', insertRow, this, query_row);
		}

		var remove_control = control_cell.one('.'+this.getClassName('remove'));
		if (remove_control)
		{
			remove_control.on('click', removeRow, this, query_row);
		}

		// insert into DOM after fully constructed

		this.table.appendChild(query_body);

		var obj =
		{
			body:     query_body,
			row:      query_row,
			var_menu: var_menu,
			control:  control_cell,
			error:    error_cell
		};
		this.row_list.push(obj);
		this.update(new_index, value);

		query_body.scrollIntoView();

		return this.row_list[new_index].plugin;
	},

	/**
	 * Set the value of the specified row.
	 *
	 * @method update
	 * @param row_index {int} The index of the row
	 * @param value {Mixed} If specified, the value to set (Refer to the appropriate plugin documentation to figure out what data to pass.)
	 */
	update: function(
		/* int */		row_index,
		/* string */	value)
	{
		var query_row    = this.row_list[row_index].row;
		var control_cell = this.row_list[row_index].control;

		// clear error

		this.row_list[row_index].error.one('.'+Y.FormManager.status_marker_class).set('innerHTML', '');

		// remove all but the first cell (variable name) and last cell (controls)

		if (this.row_list[row_index].plugin)
		{
			this.row_list[row_index].plugin.destroy();
			this.row_list[row_index].plugin = null;
		}

		while (query_row.get('children').size() > 2)
		{
			var child = query_row.get('children').item(0).next();
			child.remove(true);
		}

		// re-build the table row

		var var_menu     = this.row_list[row_index].var_menu;
		var selected_var = this.var_list[ var_menu.get('selectedIndex') ];

		var cells = [];
		if (selected_var.type == 'none')
		{
			query_row.addClass(this.getClassName('empty'));
		}
		else
		{
			query_row.removeClass(this.getClassName('empty'));

			this.row_list[row_index].plugin =
				new QueryBuilder.plugin_mapping[ selected_var.type ](
					this, this.get('pluginConfig'));
			cells =
				this.row_list[row_index].plugin.create(
					row_index, selected_var,
					this.op_list[ selected_var.type ], value);
		}

		while (cells.length < this.plugin_column_count)
		{
			cells.push(this._createContainer());
		}

		for (var i=0; i<cells.length; i++)
		{
			query_row.insertBefore(cells[i], control_cell);
		}

		if (cells.length > this.plugin_column_count)
		{
			var col_span = 1 + cells.length;
			for (var i=0; i<this.row_list.length; i++)
			{
				var row = this.row_list[i].row;
				this.row_list[i].error.set('colSpan', col_span);

				if (row != query_row)
				{
					var control = this.row_list[i].control;

					for (var j=this.plugin_column_count; j<cells.length; j++)
					{
						row.insertBefore(this._createContainer(), control);
					}
				}
			}

			this.plugin_column_count = cells.length;
		}

		var plugin = this.row_list[row_index].plugin;
		if (plugin && Y.Lang.isFunction(plugin.postCreate))
		{
			this.row_list[row_index].plugin.postCreate(
				row_index, selected_var,
				this.op_list[ selected_var.type ], value);
		}
	},

	/**
	 * Removes the specified row.
	 *
	 * @method remove
	 * @param row_index {int} The index of the row
	 * @return {boolean} `true` if successful
	 */
	remove: function(
		/* int */	row_index)
	{
		// sanity checks

		if (this.row_list.length <= 0)
		{
			return false;
		}

		// last row cannot be removed

		if (!this._allow_remove_last_row && this.row_list.length == 1)
		{
			var var_menu = this.row_list[0].var_menu;
			var_menu.set('selectedIndex', 0);
			this.update(0);
			this.fire('queryChanged', {remove: true});
			return true;
		}

		var query_body = this.row_list[row_index].body;
		if (query_body === null)
		{
			return false;
		}

		// remove row

		if (this.row_list[row_index].plugin)
		{
			this.row_list[row_index].plugin.destroy();
		}

		query_body.remove(true);
		this.row_list.splice(row_index, 1);

		// renumber remaining rows

		Y.Array.each(this.row_list, function(row, i)
		{
			var var_menu = row.var_menu;
			var_menu.setAttribute('name', this.variableName(i));

			var selected_var = this.var_list[ var_menu.get('selectedIndex') ];
			if (selected_var.type != 'none')
			{
				row.plugin.updateName(i);
			}
		},
		this);

		this.fire('queryChanged', {remove: true});
		return true;
	},

	/**
	 * Validate the fields in each row.
	 * 
	 * @method validateFields
	 * @return {Boolean} `true` if all values are valid
	 */
	validateFields: function()
	{
		this.clearFieldMessages();

		var status = true;
		Y.Array.each(this.row_list, function(row, i)
		{
			var info;
			row.row.all('input').some(function(n)
			{
				info = Y.FormManager.validateFromCSSData(n);

				if (info.error)
				{
					this.displayFieldMessage(n, info.error, 'error');
					status = false;
					return true;
				}
			},
			this);

			if ((!info || !info.error) && row.plugin && Y.Lang.isFunction(row.plugin.validate))
			{
				status = row.plugin.validate() && status;	// status last to guarantee call to validate()
			}
		},
		this);

		return status;
	},

	/**
	 * @method clearFieldMessages
	 */
	clearFieldMessages: function()
	{
		this.has_messages = false;

		this.get('contentBox').all('input').each(function(n)
		{
			Y.FormManager.clearMessage(n);
		});

		this.get('contentBox').all('select').each(function(n)
		{
			Y.FormManager.clearMessage(n);
		});
	},

	/**
	 * Display a message for the specified field.
	 * 
	 * @method displayFieldMessage
	 * @param e {String|Object} The selector for the element or the element itself
	 * @param msg {String} The message
	 * @param type {String} The message type (see Y.FormManager.status_order)
	 * @param [scroll] {boolean} `true` if the form row should be scrolled into view
	 * @return {boolean} true if the message was displayed, false if a higher precedence message was already there
	 */
	displayFieldMessage: function(
		/* id/object */	e,
		/* string */	msg,
		/* string */	type,
		/* boolean */	scroll)
	{
		if (Y.FormManager.displayMessage(e, msg, type, this.has_messages, scroll))
		{
			this.has_messages = true;
			return true;
		}
		else
		{
			return false;
		}
	},

	/**
	 * Returns plugin used for the specified row, if any.
	 *
	 * @method getPlugin
	 * @param row_index {int} The index of the row
	 * @return {Object} the plugin for the row, if any
	 */
	getPlugin: function(
		/* int */	row_index)
	{
		return this.row_list[row_index].plugin;
	},

	/**
	 * @method toDatabaseQuery
	 * @return {Array} list of [var, op, value] tuples suitable for a database query
	 */
	toDatabaseQuery: function()
	{
		var result = [];

		for (var i=0; i<this.row_list.length; i++)
		{
			var row    = this.row_list[i];
			var plugin = row.plugin;
			if (plugin)
			{
				var list = plugin.toDatabaseQuery();
				for (var j=0; j<list.length; j++)
				{
					result.push([ row.var_menu.get('value') ].concat(list[j]));
				}
			}
		}

		return result;
	},

	/*
	 * API for plugins
	 */

	/**
	 * @method _createContainer
	 * @protected
	 * @return {DOM element} container for one piece of a query row
	 */
	_createContainer: function()
	{
		return Y.Node.create('<td></td>');
	},

	/**
	 * Fires the queryChanged event.
	 *
	 * @method _notifyChanged
	 * @protected
	 */
	_notifyChanged: function()
	{
		this.fire('queryChanged');
	},

	/*
	 * Form element names.
	 */

	/**
	 * @method variableName
	 * @param i {int} query row index
	 * @return {String} name for the select form element listing the available query variables
	 */
	variableName: function(
		/* int */	i)
	{
		return Y.Lang.sub(this.var_menu_name_pattern, {i:i});
	},

	//
	// Markup
	//

	/**
	 * @method _variablesMenu
	 * @protected
	 * @param menu_name {String} name for the select form element
	 * @return {String} markup for the query variable menu
	 */
	_variablesMenu: function(
		/* string */	menu_name)
	{
		// This must use a select tag!

		var markup = '<select name="{n}" class="{f} {c}" />';

		return Y.Lang.sub(markup,
		{
			n: menu_name,
			f: Y.FormManager.field_marker_class,
			c: this.getClassName('field')
		});
	},

	/**
	 * @method _rowControls
	 * @protected
	 * @return {String} markup for the row controls (insert and remove)
	 */
	_rowControls: function()
	{
		var markup =
			'<button type="button" class="{cr}">&ndash;</button>' +
			'<button type="button" class="{ci}">+</button>';

		if (!this._controls_markup)
		{
			this._controls_markup = Y.Lang.sub(markup,
			{
				ci: this.getClassName('insert'),
				cr: this.getClassName('remove')
			});
		}

		return this._controls_markup;
	}
});

Y.QueryBuilder = QueryBuilder;

/**
 * <p>Environment information.</p>
 * 
 * <dl>
 * <dt>has_bubble_problem</dt>
 * <dd>True if change events from select elements do not bubble.</dd>
 * </dl>
 * 
 * @property Env
 * @type {Object}
 * @static
 */
Y.QueryBuilder.Env =
{
	has_bubble_problem: has_bubble_problem
};
/**
 * @module gallery-querybuilder
 */

/**********************************************************************
 * Plugin for accepting a string or number.  All the operators specified
 * for this plugin are displayed on a menu.
 * 
 * In the `var_list` configuration, specify `validation` to provide CSS
 * classes that will be interpreted by `Y.FormManager`.
 * 
 * To enable autocomplete, define `autocomplete` in the `var_list`
 * configuration.  The object will be used as the configuration for
 * `Y.Plugin.AutoComplete`.  If you specify
 * `autocomplete.containerClassName`, this CSS class will be added to the
 * container generated by the autocomplete plugin.
 * 
 * The `value` argument passed to `QueryBuilder.appendNew()` must be an
 * array with two elements: `[ operator_name, value ]`.
 * 
 * @namespace QueryBuilder
 * @class String
 */

QueryBuilder.String = function(
	/* object */	query_builder,
	/* object */	config)
{
	this.qb = query_builder;

	this.op_menu_name_pattern   = config.field_prefix + 'query_op_{i}';
	this.val_input_name_pattern = config.field_prefix + 'query_val_{i}';
};

QueryBuilder.String.prototype =
{
	create: function(
		/* int */		query_index,
		/* object */	var_config,
		/* array */		op_list,
		/* array */		value)
	{
		var op_cell = this.qb._createContainer();
		op_cell.set('className', this.qb.getClassName('operator'));
		op_cell.set('innerHTML', this._operationsMenu(this.operationName(query_index)));
		this.op_menu = op_cell.one('select');

		var options = Y.Node.getDOMNode(this.op_menu).options;
		for (var i=0; i<op_list.length; i++)
		{
			options[i] = new Option(op_list[i].text, op_list[i].value);
		}

		value = value || ['',''];
		if (value[0])
		{
			this.op_menu.set('value', value[0]);
		}

		if (has_bubble_problem)
		{
			this.op_menu.on('change', this.qb._notifyChanged, this.qb);
		}

		var value_cell = this.qb._createContainer();
		value_cell.set('className', this.qb.getClassName('value'));
		value_cell.set('innerHTML', this._valueInput(this.valueName(query_index), var_config.validation));
		this.value_input = value_cell.one('input');
		this.value_input.set('value', value[1]);	// avoid formatting

		return [ op_cell, value_cell ];
	},

	postCreate: function(
		/* int */		query_index,
		/* object */	var_config,
		/* array */		op_list,
		/* array */		value)
	{
		Y.Lang.later(1, this, function()	// hack for IE7
		{
			if (this.value_input)		// could be destroyed
			{
				if (var_config.autocomplete)
				{
					var config    = Y.clone(var_config.autocomplete, true);
					config.render = Y.one('body');
					this.value_input.plug(Y.Plugin.AutoComplete, config);

					if (var_config.autocomplete.containerClassName)
					{
						this.value_input.ac.get('boundingBox').addClass(var_config.autocomplete.containerClassName);
					}
				}

				this.value_input.focus();
			}
		});
	},

	destroy: function()
	{
		if (this.value_input.unplug)
		{
			this.value_input.unplug(Y.Plugin.AutoComplete);
		}

		this.op_menu     = null;
		this.value_input = null;
	},

	updateName: function(
		/* int */	new_index)
	{
		this.op_menu.setAttribute('name', this.operationName(new_index));
		this.value_input.setAttribute('name', this.valueName(new_index));
	},

	set: function(
		/* int */	query_index,
		/* map */	data)
	{
		this.op_menu.set('value', data[ this.operationName(query_index) ]);
		this.value_input.set('value', data[ this.valueName(query_index) ]);
	},

	toDatabaseQuery: function()
	{
		return [ [ this.op_menu.get('value'), this.value_input.get('value') ] ];
	},

	/* *********************************************************************
	 * Form element names.
	 */

	operationName: function(
		/* int */	i)
	{
		return Y.Lang.sub(this.op_menu_name_pattern, {i:i});
	},

	valueName: function(
		/* int */	i)
	{
		return Y.Lang.sub(this.val_input_name_pattern, {i:i});
	},

	//
	// Markup
	//

	_operationsMenu: function(
		/* string */	menu_name)
	{
		// This must use a select tag!

		var markup = '<select name="{n}" class="{f} {c}" />';

		return Y.Lang.sub(markup,
		{
			n: menu_name,
			f: Y.FormManager.field_marker_class,
			c: this.qb.getClassName('field')
		});
	},

	_valueInput: function(
		/* string */	input_name,
		/* string */	validation_class)
	{
		// This must use an input tag!

		var markup = '<input type="text" name="{n}" class="yiv-required {f} {c}"/>';

		return Y.Lang.sub(markup,
		{
			n: input_name,
			f: Y.FormManager.field_marker_class,
			c: validation_class + ' ' + this.qb.getClassName('field')
		});
	}
};
/**
 * @module gallery-querybuilder
 */

/**********************************************************************
 * Plugin for choosing from a list of values.  In the `var_list`
 * configuration, specify `value_list` as a list of objects, each defining
 * `value` and `text`.
 * 
 * There must be exactly one operator specified for this plugin.
 * 
 * The `value` argument passed to `QueryBuilder.appendNew()` must be a
 * string: the value of the menu item to select.
 * 
 * @namespace QueryBuilder
 * @class Select
 */

QueryBuilder.Select = function(
	/* object */	query_builder,
	/* object */	config)
{
	this.qb = query_builder;

	this.val_input_name_pattern = config.field_prefix + 'query_val_{i}';
};

QueryBuilder.Select.prototype =
{
	create: function(
		/* int */		query_index,
		/* object */	var_config,
		/* array */		op_list,
		/* string */	value)
	{
		var value_cell = this.qb._createContainer();
		value_cell.set('className', this.qb.getClassName('value'));
		value_cell.set('innerHTML', this._valuesMenu(this.valueName(query_index)));
		this.value_menu = value_cell.one('select');

		var options    = Y.Node.getDOMNode(this.value_menu).options;
		var value_list = var_config.value_list;
		for (var i=0; i<value_list.length; i++)
		{
			options[i] = new Option(value_list[i].text, value_list[i].value);
		}

		if (value)
		{
			this.value_menu.set('value', value);
		}

		if (has_bubble_problem)
		{
			this.value_menu.on('change', this.qb._notifyChanged, this.qb);
		}

		this.db_query_equals = op_list[0];

		return [ value_cell ];
	},

	postCreate: function(
		/* int */		query_index,
		/* object */	var_config,
		/* array */		op_list,
		/* array */		value)
	{
		this.value_menu.focus();
	},

	destroy: function()
	{
		this.value_menu = null;
	},

	updateName: function(
		/* int */	new_index)
	{
		this.value_menu.setAttribute('name', this.valueName(new_index));
	},

	set: function(
		/* int */	query_index,
		/* map */	data)
	{
		this.value_menu.set('value', data[ this.valueName(query_index) ]);
	},

	toDatabaseQuery: function()
	{
		return [ [ this.db_query_equals, this.value_menu.get('value') ] ];
	},

	/* *********************************************************************
	 * Form element names.
	 */

	valueName: function(
		/* int */	i)
	{
		return Y.Lang.sub(this.val_input_name_pattern, {i:i});
	},

	//
	// Markup
	//

	_valuesMenu: function(
		/* string */	menu_name)
	{
		// This must use a select tag!

		var markup = '<select name="{n}" class="{f} {c}" />';

		return Y.Lang.sub(markup,
		{
			n: menu_name,
			f: Y.FormManager.field_marker_class,
			c: this.qb.getClassName('field')
		});
	}
};
/**
 * @module gallery-querybuilder
 */

/**
 * @class QueryBuilder
 */

/**
 * <p>Mapping of variable types to plugin classes.  (Always introduce new
 * variable types rather than changing the existing mappings.)</p>
 * 
 * <dl>
 * <dt>string</dt>
 * <dd>Generic string.</dd>
 * <dt>number</dt>
 * <dd>Generic number.  You must specify appropriate validations, e.g., yiv-integer or yiv-decimal.</dd>
 * <dt>select</dt>
 * <dd>Generic list of values.</dd>
 * </dl>
 *
 * @property plugin_mapping
 * @type {Object}
 * @static
 */
QueryBuilder.plugin_mapping =
{
	string: QueryBuilder.String,
	number: QueryBuilder.String,
	select: QueryBuilder.Select
};


}, 'gallery-2014.02.20-23-55', {
    "skinnable": "true",
    "requires": [
        "widget",
        "gallery-formmgr"
    ],
    "optional": [
        "gallery-scrollintoview",
        "autocomplete"
    ]
});
