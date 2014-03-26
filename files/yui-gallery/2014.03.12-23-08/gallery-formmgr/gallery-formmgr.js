YUI.add('gallery-formmgr', function (Y, NAME) {

"use strict";

/**********************************************************************
 * <p>FormManager provides support for initializing a form, pre-validating
 * user input, and displaying messages returned by the server.</p>
 * 
 * <p>Also see the documentation for gallery-formmgr-css-validation.</p>
 * 
 * @module gallery-formmgr
 * @main gallery-formmgr
 */

/**
 * <p><strong>Required Markup Structure</strong></p>
 * 
 * <p>Each element (or tighly coupled set of elements) must be contained by
 * an element that has the CSS class <code>formmgr-row</code>.  Within each
 * row, validation messages are displayed inside the container with CSS
 * class <code>formmgr-message-text</code>.
 * 
 * <p>When a message is displayed inside a row, the CSS class
 * <code>formmgr-has{type}</code> is placed on the row container and the
 * containing fieldset (if any), where <code>{type}</code> is the message
 * type passed to <code>displayMessage()</code>.</p>
 * 
 * <p><strong>Initializing the Form</strong></p>
 * 
 * <p>Default values can be either encoded in the markup or passed to the
 * FormManager constructor via <code>config.default_value_map</code>.  (The
 * former method is obviously better for progressive enhancement.)  The
 * values passed to the constructor override the values encoded in the
 * markup.</p>
 * 
 * <p><code>prepareForm()</code> must be called before the form is
 * displayed.  To initialize focus to the first element in a form, call
 * <code>initFocus()</code>.  If the form is in an overlay, you can delay
 * these calls until just before showing the overlay.</p>
 * 
 * <p>The default values passed to the constructor are inserted by
 * <code>populateForm()</code>.  (This is automatically called by
 * <code>prepareForm()</code>.)</p>
 * 
 * <p><strong>Displaying Messages</strong></p>
 * 
 * <p>To display a message for a single form row, call
 * <code>displayMessage()</code>.  To display a message for the form in
 * general, call <code>displayFormMessage()</code>.  These functions can be
 * used for initializing the error display when the page loads, for
 * displaying the results of pre-validation, and for displaying the results
 * of submitting a form via XHR.</p>
 *
 * <p><strong>Specifying Validations</strong></p>
 *
 * <p>The following classes can be applied to a form element for
 * pre-validation:</p>
 *
 * <dl>
 * <dt><code>yiv-required</code></dt>
 * <dd>Value must not be empty.</dd>
 *
 * <dt><code>yiv-length:[x,y]</code></dt>
 * <dd>String must be at least x characters and at most y characters.
 * At least one of x and y must be specified.</dd>
 *
 * <dt><code>yiv-integer:[x,y]</code></dt>
 * <dd>The integer value must be at least x and at most y.
 * x and y are both optional.</dd>
 *
 * <dt><code>yiv-decimal:[x,y]</code></dt>
 * <dd>The decimal value must be at least x and at most y.  Exponents are
 * not allowed.  x and y are both optional.</dd>
 * </dl>
 *
 * <p>If we ever need to allow exponents, we can use yiv-float.</p>
 *
 * <p>The following functions allow additional pre-validation to be
 * attached to individual form elements:</p>
 *
 * <dl>
 * <dt><code>setRegex()</code></dt>
 * <dd>Sets the regular expression that must match in order for the value
 * to be acceptable.</dd>
 *
 * <dt><code>setFunction()</code></dt>
 * <dd>Sets the function that must return true in order for the value to
 * be acceptable.  The function is called in the scope of the Form
 * object with the arguments:  the form and the element.</dd>
 * </dl>
 *
 * <p><code>setErrorMessages()</code> specifies the error message to be
 * displayed when a pre-validation check fails.</p>
 *
 * <p>Functions are expected to call <code>displayMessage()</code>
 * directly.</p>
 *
 * <p>More complex pre-validations can be added by overriding
 * <code>postValidateForm()</code>, described below.</p>
 *
 * <p>Validation normally strips leading and trailing whitespace from every
 * value.  If you have a special case where this should not be done, add
 * the CSS class <code>yiv-no-trim</code> to the input field.</p>
 *
 * <p>Derived classes may also override the following functions:</p>
 *
 * <dl>
 * <dt><code>prePrepareForm</code>(arguments passed to prepareForm)</dt>
 * <dd>Called before filling in default values for the form elements.
 * Return false to cancel dialog.</dd>
 *
 * <dt><code>postPrepareForm</code>(arguments passed to prepareForm)</dt>
 * <dd>Called after filling in default values for the form elements.</dd>
 *
 * <dt><code>postValidateForm</code>(form)</dt>
 * <dd>Called after performing the basic pre-validations.  Returns
 * true if the form contents are acceptable.  Reports error if there
 * is a problem.</dd>
 * </dl>
 *
 * @class FormManager
 * @constructor
 * @param form_name {String} The name attribute of the HTML form.
 * @param config {Object} Configuration.
 *		<code>status_node</code> is an optional element in which to display
 *		overall status.  <code>default_value_map</code> is an optional
 *		mapping of form element names to default values.  Default values
 *		encoded in the markup will be merged into this map, but values
 *		passed to the constructor will take precedence.
 */

function FormManager(
	/* string */	form_name,
	/* object */	config)		// {status_node, default_value_map}
{
	config = config || {};
	FormManager.superclass.constructor.call(this, config);

	this.form_name   = form_name;
	this.status_node = Y.one(config.status_node);
	this.enabled     = true;

	// default values for form elements

	this.default_value_map = config.default_value_map || {};

	// pre-validation methods

	this.validation =
	{
		fn:    {},	// function for validating each element id
		regex: {}	// regex for validating each element id
	};

	// error messages

	this.validation_msgs = {};		// message list, keyed on type, for each element id

	this.has_messages = false;
	this.has_errors   = false;

	// buttons -- disabled during submission

	this.button_list      = [];
	this.user_button_list = [];

	// file uploading is nasty

	this.has_file_inputs = false;
}

/**
 * The CSS class which marks each row of the form.  Typically, each field
 * (or a very tightly coupled set of fields) is placed in a separate row.
 * 
 * @property row_marker_class
 * @type {String}
 */
FormManager.row_marker_class = 'formmgr-row';

/**
 * The CSS class which marks each field in a row of the form.  This enables
 * messaging when multiple fields are in a single row.
 * 
 * @property field_marker_class
 * @type {String}
 */
FormManager.field_marker_class = 'formmgr-field';

/**
 * The CSS class which marks the container for the status message within a
 * row of the form.
 * 
 * @property status_marker_class
 * @type {String}
 */
FormManager.status_marker_class = 'formmgr-message-text';

/**
 * The CSS class placed on <code>status_node</code> when it is empty.
 * 
 * @property status_none_class
 * @type {String}
 */
FormManager.status_none_class = 'formmgr-status-hidden';

/**
 * The CSS class placed on <code>status_node</code> when
 * <code>displayFormMessage()</code> is called with
 * <code>error=false</code>.
 * 
 * @property status_success_class
 * @type {String}
 */
FormManager.status_success_class = 'formmgr-status-success';

/**
 * The CSS class placed on <code>status_node</code> when
 * <code>displayFormMessage()</code> is called with
 * <code>error=true</code>.
 * 
 * @property status_failure_class
 * @type {String}
 */
FormManager.status_failure_class = 'formmgr-status-failure';

/**
 * The prefix for all CSS classes placed on a form row when pre-validation
 * fails.  The full CSS class is formed by appending the value from
 * `Y.FormManager.status_order`.
 * 
 * @property row_status_prefix
 * @type {String}
 */
FormManager.row_status_prefix = 'formmgr-has';

// By using functions for the internal values, we allow the above constants
// to be changed before they are first used.

var cached_status_pattern;
var cached_row_status_pattern;
var cached_row_status_regex;

function statusPattern()
{
	if (!cached_status_pattern)
	{
		cached_status_pattern = FormManager.status_success_class+'|'+FormManager.status_failure_class;
	}
	return cached_status_pattern;
}

function rowStatusPattern()
{
	if (!cached_row_status_pattern)
	{
		cached_row_status_pattern = FormManager.row_status_prefix + '([^\\s]+)';
	}
	return cached_row_status_pattern;
}

function rowStatusRegex()
{
	if (!cached_row_status_regex)
	{
		cached_row_status_regex = new RegExp(Y.Node.class_re_prefix + rowStatusPattern() + Y.Node.class_re_suffix);
	}
	return cached_row_status_regex;
}

/**
 * Get the status of the given fieldset or form row.
 * 
 * @method getElementStatus
 * @static
 * @param e {String|Object} The descriptor or DOM element.
 * @return {mixed} The status (String) or <code>false</code>.
 */
FormManager.getElementStatus = function(
	/* string/object */	e)
{
	var m = Y.one(e).get('className').match(rowStatusRegex());
	return (m && m.length > 1 ? m[1] : false);
};

function getId(
	/* string/Node/object */	e)
{
	if (Y.Lang.isString(e))
	{
		return e.replace(/^#/, '');
	}
	else if (e._node)
	{
		return e.get('id');
	}
	else
	{
		return e.id;
	}
}

function _populateForm()
{
	var collect_buttons = (this.button_list.length === 0);

	for (var i=0; i<this.form.elements.length; i++)
	{
		var e = this.form.elements[i];

		var name = e.tagName;
		var type = (e.type ? e.type.toLowerCase() : null);
		if (collect_buttons &&
			(type == 'submit' || type == 'reset' || name == 'BUTTON'))
		{
			this.button_list.push(e);
		}

		if (!e.name)
		{
			continue;
		}

		var v = this.default_value_map[ e.name ];
		if (name == 'INPUT' && type == 'file')
		{
			e.value = '';
		}
		else if (Y.Lang.isUndefined(v))
		{
			// save value for next time

			if (name == 'INPUT' &&
				(type == 'password' || type == 'text'))
			{
				this.default_value_map[ e.name ] = e.value;
			}
			else if (name == 'INPUT' && type == 'checkbox')
			{
				this.default_value_map[ e.name ] = (e.checked ? e.value : '');
			}
			else if (name == 'INPUT' && type == 'radio')
			{
				var rb = this.form[ e.name ];	// null if dynamically generated in IE
				if (rb && !rb.length)
				{
					this.default_value_map[ e.name ] = rb.value;
				}
				else if (rb)
				{
					this.default_value_map[ e.name ] = rb[0].value;

					for (var j=0; j<rb.length; j++)
					{
						if (rb[j].checked)
						{
							this.default_value_map[ e.name ] = rb[j].value;
							break;
						}
					}
				}
			}
			else if ((name == 'SELECT' && type == 'select-one') ||
					 name == 'TEXTAREA')
			{
				this.default_value_map[ e.name ] = e.value;
			}
		}
		else if (name == 'INPUT' &&
				 (type == 'password' || type == 'text'))
		{
			e.value = v;
		}
		else if (name == 'INPUT' &&
				 (type == 'checkbox' || type == 'radio'))
		{
			e.checked = (e.value == v);
		}
		else if (name == 'SELECT' && type == 'select-one')
		{
			e.value = v;
			if (e.selectedIndex >= 0 &&
				e.options[ e.selectedIndex ].value !== v.toString())
			{
				e.selectedIndex = -1;
			}
		}
		else if (name == 'TEXTAREA')
		{
			e.value = v;
		}
	}
}

function _isChanged(i)
{
	var e = this.form.elements[i];
	if (!e.name)
	{
		return false;
	}

	var type = (e.type ? e.type.toLowerCase() : null);
	var name = e.tagName;
	var v    = this.default_value_map[ e.name ];
	if (v === null || typeof v === 'undefined')
	{
		v = '';
	}

	if (name == 'INPUT' && type == 'file')
	{
		if (e.value)
		{
			return true;
		}
	}
	else if (name == 'INPUT' &&
			 (type == 'password' || type == 'text' || type == 'file'))
	{
		if (e.value != v)
		{
			return true;
		}
	}
	else if (name == 'INPUT' &&
			 (type == 'checkbox' || type == 'radio'))
	{
		var checked = (e.value == v);
		if ((checked && !e.checked) || (!checked && e.checked))
		{
			return true;
		}
	}
	else if ((name == 'SELECT' && type == 'select-one') ||
			 name == 'TEXTAREA')
	{
		if (e.value != v)
		{
			return true;
		}
	}
	else
	{
		return false;
	}
}

/**
 * <p>Exposed for use by Y.QueryBuilder</p>
 * 
 * <p>Clear the message for the given field.</p>
 * 
 * @method clearMessage
 * @static
 * @param e {Element|Node} the field
 */
FormManager.clearMessage = function(e)
{
	var p = Y.one(e).getAncestorByClassName(Y.FormManager.row_marker_class);
	if (p && p.hasClass(rowStatusPattern()))
	{
		p.all('.'+Y.FormManager.status_marker_class).set('innerHTML', '');
		p.removeClass(rowStatusPattern());

		p.all('.'+Y.FormManager.field_marker_class).removeClass(rowStatusPattern());
	}
};

/**
 * <p>Exposed for use by Y.QueryBuilder</p>
 * 
 * <p>Display a message for the form row containing the specified element.
 * The message will only be displayed if no message with a higher
 * precedence is already visible. (see Y.FormManager.status_order)</p>
 * 
 * @method displayMessage
 * @static
 * @param e {String|Object} The selector for the element or the element itself
 * @param msg {String} The message
 * @param type {String} The message type (see Y.FormManager.status_order)
 * @param [had_messages] {boolean} `true` if the form already has messages displayed
 * @param [scroll] {boolean} `true` if the form row should be scrolled into view
 * @return {boolean} true if the message was displayed, false if a higher precedence message was already there
 */
FormManager.displayMessage = function(
	/* id/object */	e,
	/* string */	msg,
	/* string */	type,
	/* boolean */	had_messages,
	/* boolean */	scroll)
{
	if (Y.Lang.isUndefined(scroll))
	{
		scroll = !had_messages;
	}

	e     = Y.one(e);
	var p = e.getAncestorByClassName(FormManager.row_marker_class);
	if (p && FormManager.statusTakesPrecedence(FormManager.getElementStatus(p), type))
	{
		var f = p.all('.'+FormManager.field_marker_class);
		if (f)
		{
			f.removeClass(rowStatusPattern());
		}

		if (msg)
		{
			p.one('.'+FormManager.status_marker_class).set('innerHTML', msg);
		}

		var new_class = FormManager.row_status_prefix + type;
		p.replaceClass(rowStatusPattern(), new_class);

		f = e.getAncestorByClassName(FormManager.field_marker_class, true);
		if (f)
		{
			f.replaceClass(rowStatusPattern(), new_class);
		}

		var fieldset = e.getAncestorByTagName('fieldset');
		if (fieldset && FormManager.statusTakesPrecedence(FormManager.getElementStatus(fieldset), type))
		{
			fieldset.removeClass(rowStatusPattern());
			fieldset.addClass(FormManager.row_status_prefix + type);
		}

		if (scroll && e.get('offsetHeight') !== 0)
		{
			p.scrollIntoView();
			e.focus();
		}

		return true;
	}

	return false;
};

Y.extend(FormManager, Y.Plugin.Host,
{
	/* *********************************************************************
	 * Access functions.
	 */

	/**
	 * @method getForm
	 * @return {DOM} The form DOM element.
	 */
	getForm: function()
	{
		if (!this.form)
		{
			this.form = Y.config.doc.forms[ this.form_name ];
		}
		return this.form;
	},

	/**
	 * @method hasFileInputs
	 * @return {boolean} <code>true</code> if the form contains file inputs.  These require special treatment when submitting via XHR.
	 */
	hasFileInputs: function()
	{
		return this.has_file_inputs;
	},

	/**
	 * @method setStatusNode
	 * @param node {String|Y.Node} the node in which status should be displayed
	 */
	setStatusNode: function(
		/* Node */	node)
	{
		this.status_node = Y.one(node);
	},

	/**
	 * Set the default values for all form elements.
	 * 
	 * @method setDefaultValues
	 * @param default_value_map {Object|Model} Mapping of form element names to values.
	 */
	setDefaultValues: function(
		/* object */	map)
	{
		if (Y.Model && (map instanceof Y.Model))
		{
			map = map.getAttrs();
		}

		this.default_value_map = map;
	},

	/**
	 * Set the default values for a single form element.
	 * 
	 * @method setDefaultValue
	 * @param field_name {String} The form element name.
	 * @param default_value {String|Int|Float} The default value.
	 */
	setDefaultValue: function(
		/* string*/		field_name,
		/* string */	default_value)
	{
		this.default_value_map[ field_name ] = default_value;
	},

	/**
	 * Store the current form values in <code>default_value_map</code>.
	 * 
	 * @method saveCurrentValuesAsDefault
	 */
	saveCurrentValuesAsDefault: function()
	{
		this.default_value_map = {};
		this.button_list       = [];
		_populateForm.call(this);
	},

	/* *********************************************************************
	 * Validation control
	 */

	/**
	 * Set the validation function for a form element.
	 * 
	 * @method setFunction
	 * @param id {String|Object} The selector for the element or the element itself
	 * @param f {Function|String|Object}
	 *  The function to call after basic validations succeed.  If this
	 *  is a String, it is resolved in the scope of the FormManager
	 *  object.  If this is an object, it must be `{fn:,
	 *  scope:}`.  The function will then be invoked in the
	 *  specified scope.
	 */
	setFunction: function(
		/* string */				id,
		/* function/string/obj */	f)
	{
		this.validation.fn[ getId(id) ] = f;
	},

	/**
	 * <p>Set the regular expression used to validate the field value.</p>
	 * 
	 * <p><strong>Since there is no default message for failed regular
	 * expression validation, this function will complain if you have not
	 * already called `setErrorMessages()` or
	 * `addErrorMessage` to specify an error message.</strong></p>
	 * 
	 * @method setRegex
	 * @param id {String|Object} The selector for the element or the element itself
	 * @param regex {String|RegExp} The regular expression to use
	 * @param flags {String} If regex is a String, these are the flags used to construct a RegExp.
	 */
	setRegex: function(
		/* string */		id,
		/* string/RegExp */	regex,
		/* string */		flags)		// ignored if regex is RegExp object
	{
		id = getId(id);

		if (Y.Lang.isString(regex))
		{
			this.validation.regex[id] = new RegExp(regex, flags);
		}
		else
		{
			this.validation.regex[id] = regex;
		}

		if (!this.validation_msgs[id] || !this.validation_msgs[id].regex)
		{
			Y.error(Y.substitute('No error message provided for regex validation of {id}!', {id:id}), null, 'FormManager');
		}
	},

	/**
	 * <p>Set the error messages for a form element.  This can be used to
	 * override the default messages for individual elements</p>
	 * 
	 * <p>The valid error types are:</p>
	 * <dl>
	 * <dt><code>required</code></dt>
	 * <dd>&nbsp;</dd>
	 * <dt><code>min_length</code></dt>
	 * <dd><code>{min}</code> and <code>{max}</code> are replaced</dd>
	 * <dt><code>max_length</code></dt>
	 * <dd><code>{min}</code> and <code>{max}</code> are replaced</dd>
	 * <dt><code>integer</code></dt>
	 * <dd><code>{min}</code> and <code>{max}</code> are replaced</dd>
	 * <dt><code>decimal</code></dt>
	 * <dd><code>{min}</code> and <code>{max}</code> are replaced</dd>
	 * <dt><code>regex</code></dt>
	 * <dd>This <string>must</strong> be set for elements which validate with regular expressions.</dd>
	 * </dl>
	 * 
	 * @method setErrorMessages
	 * @param id {String|Object} The selector for the element or the element itself
	 * @param map {Object} Map of error types to error messages.
	 */
	setErrorMessages: function(
		/* string */	id,
		/* object */	map)
	{
		this.validation_msgs[ getId(id) ] = map;
	},

	/**
	 * Set one particular error message for a form element.
	 * 
	 * @method addErrorMessage
	 * @param id {String|Object} The selector for the element or the element itself
	 * @param error_type {String} The error message type.  Refer to setErrorMessages() for details.
	 * @param msg {String} The error message
	 */
	addErrorMessage: function(
		/* string */	id,
		/* string */	error_type,
		/* string */	msg)
	{
		id = getId(id);
		if (!this.validation_msgs[id])
		{
			this.validation_msgs[id] = {};
		}
		this.validation_msgs[id][error_type] = msg;
	},

	/**
	 * Reset all values in the form to the defaults specified in the markup.
	 * 
	 * @method clearForm
	 */
	clearForm: function()
	{
		this.clearMessages();
		this.form.reset();
		this.postPopulateForm();
	},

	/**
	 * Reset all values in the form to the defaults passed to the
	 * constructor or to `setDefaultValues()`.
	 * 
	 * @method populateForm
	 */
	populateForm: function()
	{
		this.clearMessages();

		_populateForm.call(this);

		// let derived class adjust

		this.postPopulateForm();
	},

	/**
	 * Hook for performing additional actions after `populateForm()`
	 * completes.
	 * 
	 * @method postPopulateForm
	 */
	postPopulateForm: function()
	{
	},

	/**
	 * Check if form values have been modified.
	 * 
	 * @method isChanged
	 * @return {boolean} `false` if all form elements have the default values passed to the constructor
	 */
	isChanged: function()
	{
		for (var i=0; i<this.form.elements.length; i++)
		{
			if (_isChanged.call(this, i))
			{
				return true;
			}
		}

		return false;
	},

	/**
	 * Return the modified values.
	 * 
	 * @method getChanges
	 * @return {Object} map of form element names to new values
	 */
	getChanges: function()
	{
		var result = {};
		for (var i=0; i<this.form.elements.length; i++)
		{
			if (_isChanged.call(this, i))
			{
				var e            = this.form.elements[i];
				result[ e.name ] = e.value;
			}
		}

		return result;
	},

	/**
	 * Prepare the form for display.
	 * 
	 * @method prepareForm
	 * @return {boolean} <code>true</code> if both pre & post hooks are happy
	 */
	prepareForm: function()
	{
		this.getForm();

		if (!this.prePrepareForm.apply(this, arguments))
		{
			return false;
		}

		// fill in starting values

		this.populateForm();

		return this.postPrepareForm.apply(this, arguments);
	},

	/**
	 * Hook called before <code>prepareForm()</code> executes.
	 * 
	 * @method prePrepareForm
	 * @return {boolean} <code>false</code> cancels <code>prepareForm()</code>.
	 */
	prePrepareForm: function()
	{
		return true;
	},

	/**
	 * Hook called after <code>prepareForm()</code> executes.
	 * 
	 * @method postPrepareForm
	 * @return {boolean} Return value from this function is returned by <code>prepareForm()</code>.
	 */
	postPrepareForm: function()
	{
		return true;
	},

	/**
	 * Set focus to first input field.  If a page contains multiple forms,
	 * only call this for one of them.
	 * 
	 * @method initFocus
	 */
	initFocus: function()
	{
		for (var i=0; i<this.form.elements.length; i++)
		{
			var e = this.form.elements[i];
			if (e.disabled || e.offsetHeight === 0)
			{
				continue;
			}

			var name = e.tagName;
			var type = (e.type ? e.type.toLowerCase() : null);

			if ((name == 'INPUT' &&
				 (type == 'file' || type == 'password' || type == 'text')) ||
				name == 'TEXTAREA')
			{
				e.focus();
				e.select();
				break;
			}
		}
	},

	/**
	 * @method validateForm
	 * @return {Boolean} true if all validation checks passed
	 */
	validateForm: function()
	{
		this.clearMessages();
		var status = true;

		var e                = this.form.elements;
		this.has_file_inputs = FormManager.cleanValues(e);

		for (var i=0; i<e.length; i++)
		{
			var e_id     = e[i].id;
			var msg_list = this.validation_msgs[e_id];

			var info = FormManager.validateFromCSSData(e[i], msg_list);
			if (info.error)
			{
				this.displayMessage(e[i], info.error, 'error');
				status = false;
				continue;
			}

			if (info.keepGoing)
			{
				if (this.validation.regex[e_id] &&
					!this.validation.regex[e_id].test(e[i].value))
				{
					this.displayMessage(e[i], msg_list ? msg_list.regex : null, 'error');
					status = false;
					continue;
				}
			}

			var f     = this.validation.fn[e_id];
			var scope = this;
			if (Y.Lang.isFunction(f))
			{
				// use it
			}
			else if (Y.Lang.isString(f))
			{
				f = scope[f];
			}
			else if (f && f.scope)
			{
				scope = f.scope;
				f     = (Y.Lang.isString(f.fn) ? scope[f.fn] : f.fn);
			}
			else
			{
				f = null;
			}

			if (f && !f.call(scope, this.form, Y.one(e[i])))
			{
				status = false;
				continue;
			}
		}

		if (!this.postValidateForm(this.form))
		{
			status = false;
		}

		if (!status)
		{
			this.notifyErrors();
		}

		return status;
	},

	/**
	 * Hook called at the end of `validateForm()`.  This is the best place
	 * to put holistic validations that touch multiple form elements.
	 * 
	 * @method postValidateForm
	 * @return {boolean} `false` if validation fails
	 */
	postValidateForm: function(
		/* DOM element */	form)
	{
		return true;
	},

	/* *********************************************************************
	 * Buttons can be disabled during submission.
	 */

	/**
	 * Register an object that can be disabled.  The object must support
	 * the set('disabled', ...) API.  (The exception is DOM nodes, since
	 * they are automatically wrapped in Y.Node.)  Buttons contained within
	 * the form DOM element are automatically registered.
	 * 
	 * @method registerButton
	 * @param el {String|Object} The selector for the element or the element itself
	 */
	registerButton: function(
		/* string/object */ el)
	{
		var info =
		{
			e: Y.Lang.isString(el) || el.tagName ? Y.one(el) : el
		};

		this.user_button_list.push(info);
	},

	/**
	 * @method isFormEnabled
	 * @return {boolean} <code>true</code> if form is enabled
	 */
	isFormEnabled: function()
	{
		return this.enabled;
	},

	/**
	 * Enable all the registered buttons.
	 * 
	 * @method enableForm
	 */
	enableForm: function()
	{
		this.setFormEnabled(true);
	},

	/**
	 * Disable all the registered buttons.
	 * 
	 * @method disableForm
	 */
	disableForm: function()
	{
		this.setFormEnabled(false);
	},

	/**
	 * Set the enabled state all the registered buttons.
	 * 
	 * @method setFormEnabled
	 * @param enabled {boolean} <code>true</code> to enable the form, <code>false</code> to disable the form
	 */
	setFormEnabled: function(
		/* boolean */	enabled)
	{
		this.enabled = enabled;

		var disabled = ! enabled;
		for (var i=0; i<this.button_list.length; i++)
		{
			this.button_list[i].disabled = disabled;
		}

		for (i=0; i<this.user_button_list.length; i++)
		{
			var info = this.user_button_list[i];
			info.e.set('disabled', disabled);
		}
	},

	/* *********************************************************************
	 * Message display
	 */

	/**
	 * @method hasMessages
	 * @return {boolean} <code>true</code> if there are any messages displayed, of any type
	 */
	hasMessages: function()
	{
		return this.has_messages;
	},

	/**
	 * @method hasErrors
	 * @return {boolean} <code>true</code> if there are any error messages displayed
	 */
	hasErrors: function()
	{
		return this.has_errors;
	},

	/**
	 * Get the message type displayed for the row containing the specified element.
	 * 
	 * @method getRowStatus
	 * @param e {String|Object} The selector for the element or the element itself
	 * @return {mixed} The status (String) or <code>false</code>.
	 */
	getRowStatus: function(
		/* id/object */	e)
	{
		var p = Y.one(e).getAncestorByClassName(FormManager.row_marker_class, true);
		return FormManager.getElementStatus(p);
	},

	/**
	 * Clear all messages in <code>status_node</code> and the form rows.
	 * 
	 * @method clearMessages
	 */
	clearMessages: function()
	{
		this.has_messages = false;
		this.has_errors   = false;

		if (this.status_node)
		{
			this.status_node.set('innerHTML', '');
			this.status_node.replaceClass(statusPattern(), FormManager.status_none_class);
		}

		Y.Array.each(this.form.elements, function(e)
		{
			var type = (e.type ? e.type.toLowerCase() : null);
			if (e.tagName != 'BUTTON' && type != 'submit' && type != 'reset')
			{
				FormManager.clearMessage(e);
			}
		});

		Y.one(this.form).all('fieldset').removeClass(rowStatusPattern());
	},

	/**
	 * Display a message for the form row containing the specified element.
	 * The message will only be displayed if no message with a higher
	 * precedence is already visible. (see Y.FormManager.status_order)
	 * 
	 * @method displayMessage
	 * @param e {String|Object} The selector for the element or the element itself
	 * @param msg {String} The message
	 * @param type {String} The message type (see Y.FormManager.status_order)
	 * @param [scroll] {boolean} `true` if the form row should be scrolled into view
	 * @return {boolean} true if the message was displayed, false if a higher precedence message was already there
	 */
	displayMessage: function(
		/* id/object */	e,
		/* string */	msg,
		/* string */	type,
		/* boolean */	scroll)
	{
		if (FormManager.displayMessage(e, msg, type, this.has_messages, scroll))
		{
			this.has_messages = true;
			if (type == 'error')
			{
				this.has_errors = true;
			}

			return true;
		}
		else
		{
			return false;
		}
	},

	/**
	 * Displays a generic message in <code>status_node</code> stating that
	 * the form data failed to validate.  Override this if you want to get
	 * fancy.
	 * 
	 * @method notifyErrors
	 */
	notifyErrors: function()
	{
		this.displayFormMessage(FormManager.Strings.validation_error, true, false);
	},

	/**
	 * Display a message in <code>status_node</code>.
	 * 
	 * @method displayFormMessage
	 * @param msg {String} The message
	 * @param error {boolean} <code>true</code> if the message is an error
	 * @param scroll {boolean} <code>true</code> if <code>status_node</code> should be scrolled into view
	 */
	displayFormMessage: function(
		/* string */	msg,
		/* boolean */	error,
		/* boolean */	scroll)
	{
		if (Y.Lang.isUndefined(scroll))
		{
			scroll = true;
		}

		if (this.status_node)
		{
			if (!this.status_node.innerHTML)
			{
				this.status_node.replaceClass(
					FormManager.status_none_class,
					(error ? FormManager.status_failure_class :
							 FormManager.status_success_class));
				this.status_node.set('innerHTML', msg);
			}

			if (scroll)
			{
				this.status_node.scrollIntoView();
			}
		}
		else
		{
		}
	}
});

// static data & functions from gallery-formmgr-css-validation
Y.aggregate(FormManager, Y.FormManager);

Y.FormManager = FormManager;


}, 'gallery-2014.02.20-23-55', {
    "requires": [
        "pluginhost-base",
        "gallery-node-optimizations",
        "gallery-formmgr-css-validation"
    ],
    "optional": [
        "gallery-scrollintoview"
    ]
});
