YUI.add('gallery-querybuilder-multiselect-input', function (Y, NAME) {

/**
 * @module gallery-querybuilder
 * @submodule gallery-querybuilder-multiselect-input
 */

/**********************************************************************
 * Plugin for accepting multiple strings from a specified list.  In the
 * `var_list` configuration, specify `value_list` as a list of strings.  If
 * there is more than one operator specified for this plugin, then they are
 * displayed on a menu.
 * 
 * The `value` argument passed to `QueryBuilder.appendNew()` must be an
 * array with two elements: `[ operator_name, value_list ]`, where
 * `value_list` is an array of strings.
 * 
 * If you specify `autocomplete.containerClassName` in the `var_list`
 * configuration, this CSS class will be added to the container generated
 * by the autocomplete plugin.
 * 
 * @namespace QueryBuilder
 * @class MultiselectInput
 */

Y.QueryBuilder.MultiselectInput = function(
	/* object */	query_builder,
	/* object */	config)
{
	this.qb = query_builder;

	this.op_menu_name_pattern   = config.field_prefix + 'query_op_{i}';
	this.val_input_name_pattern = config.field_prefix + 'query_val_{i}';
};

/**
 * <p>Map of localizable strings.</p>
 * 
 * <dl>
 * <dt>required</dt>
 * <dd>Displayed when the field is left empty.</dd>
 * </dl>
 * 
 * @property Strings
 * @type {Object}
 * @static
 */
Y.QueryBuilder.MultiselectInput.Strings =
{
	required: 'Please enter at least one value.'
};

Y.QueryBuilder.MultiselectInput.prototype =
{
	create: function(
		/* int */		query_index,
		/* object */	var_config,
		/* array */		op_list,
		/* array */		value)
	{
		value = value || ['', null];

		if (op_list.length > 1)
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

			if (value[0])
			{
				this.op_menu.set('value', value[0]);
			}

			if (Y.QueryBuilder.Env.has_bubble_problem)
			{
				this.op_menu.on('change', this.qb._notifyChanged, this.qb);
			}
		}
		else
		{
			this.db_query_equals = op_list[0];
		}

		var value_cell = this.qb._createContainer();
		value_cell.set('className', this.qb.getClassName('value'));
		value_cell.set('innerHTML', this._valueInput(this.valueName(query_index)));
		this.value_input = value_cell.one('input');

		return [ op_cell, value_cell ];
	},

	postCreate: function(
		/* int */		query_index,
		/* object */	var_config,
		/* array */		op_list,
		/* array */		value)
	{
		value = value || ['', null];

		Y.Lang.later(1, this, function()	// hack for IE7
		{
			if (this.value_input)		// could be destroyed
			{
				this.value_input.plug(Y.Plugin.AutoComplete,
				{
					resultFilters:     'phraseMatch',
					resultHighlighter: 'phraseMatch',
					source:            var_config.value_list,
					render:            Y.one('body')
				});

				if (var_config.autocomplete && var_config.autocomplete.containerClassName)
				{
					this.value_input.ac.get('boundingBox').addClass(var_config.autocomplete.containerClassName);
				}

				this.value_input.plug(Y.Plugin.MultivalueInput,
				{
					values: value[1]
				});

				try
				{
					this.value_input.focus();
				}
				catch (e)
				{
					// IE will complain if field is invisible, instead of just ignoring it
				}
			}
		});
	},

	destroy: function()
	{
		if (this.value_input.unplug)
		{
			this.value_input.unplug(Y.Plugin.MultivalueInput);
			this.value_input.unplug(Y.Plugin.AutoComplete);
		}

		this.op_menu     = null;
		this.value_input = null;
	},

	updateName: function(
		/* int */	new_index)
	{
		if (this.op_menu)
		{
			this.op_menu.setAttribute('name', this.operationName(new_index));
		}
		this.value_input.setAttribute('name', this.valueName(new_index));
	},

	// multiselect-input doesn't support programmatically modifying the value after initialization

//	set: function(
//		/* int */	query_index,
//		/* map */	data)
//	{
//		if (this.op_menu)
//		{
//			this.op_menu.set('value', data[ this.operationName(query_index) ]);
//		}
//	},

	toDatabaseQuery: function()
	{
		var op = this.op_menu ? this.op_menu.get('value') : this.db_query_equals;
		return [ [ op, this.value_input.mvi.get('values') ] ];
	},

	validate: function()
	{
		if (this.value_input.mvi.get('values').length === 0)
		{
			this.qb.displayFieldMessage(this.value_input, Y.QueryBuilder.MultiselectInput.Strings.required, 'error');
			return false;
		}
		else
		{
			return true;
		}
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
		/* string */ menu_name)
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
		/* string */ input_name)
	{
		// This must use an input tag!

		var markup = '<input type="text" name="{n}" class="{f} {c}"/>';

		return Y.Lang.sub(markup,
		{
			n: input_name,
			f: Y.FormManager.field_marker_class,
			c: this.qb.getClassName('field')
		});
	}
};

Y.QueryBuilder.plugin_mapping[ 'multiselect-input' ] = Y.QueryBuilder.MultiselectInput;


}, 'gallery-2013.05.29-23-38', {
    "requires": [
        "gallery-querybuilder",
        "gallery-multivalue-input",
        "autocomplete",
        "autocomplete-filters",
        "autocomplete-highlighters"
    ]
});
