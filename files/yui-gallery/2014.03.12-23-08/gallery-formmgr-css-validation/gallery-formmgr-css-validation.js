YUI.add('gallery-formmgr-css-validation', function(Y) {

"use strict";

/**********************************************************************
 * <p>FormManager CSS Validation provides basic functionality for
 * pre-validating user input based on CSS classes set on form elements.</p>
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
 * @module gallery-formmgr
 * @submodule gallery-formmgr-css-validation
 */

/**
 * @class FormManager
 */

Y.namespace('FormManager');

// pre-validation classes

var required_class    = 'yiv-required';
var length_class_re   = /(?:^|\s+)yiv-length:\[([0-9]+)?,([1-9][0-9]*)?\](?:\s+|$)/;
var integer_class_re  = /(?:^|\s+)yiv-integer(?::\[([-+]?[0-9]+)?,([-+]?[0-9]+)?\])?(?:\s+|$)/;
var decimal_class_re  = /(?:^|\s+)yiv-decimal(?::\[([-+]?(?:[0-9]+\.?|[0-9]+\.[0-9]+|\.[0-9]+))?,([-+]?(?:[0-9]+\.?|[0-9]+\.[0-9]+|\.[0-9]+))?\])?(?:\s+|$)/;

/**
 * Regular expression used to determine if a value is an integer.
 * This can be localized, e.g., allow for thousands separator.
 * 
 * @property integer_value_re
 * @type {RegExp}
 * @static
 */
Y.FormManager.integer_value_re = /^[-+]?[0-9]+$/;

/**
 * Regular expression used to determine if a value is a decimal number.
 * This can be localized, e.g., use the correct decimal separator.
 * 
 * @property decimal_value_re
 * @type {RegExp}
 * @static
 */
Y.FormManager.decimal_value_re = /^[-+]?(?:[0-9]+\.?|[0-9]*\.[0-9]+)$/;

/**
 * <p>Map of localizable strings used by pre-validation.</p>
 * 
 * <dl>
 * <dt>validation_error</dt>
 * <dd>Displayed in <code>status_node</code> by <code>notifyErrors()</code> when pre-validation fails.</dd>
 * <dt>required_string</dt>
 * <dd>Displayed when <code>yiv-required</code> fails on an input field.</dd>
 * <dt>required_menu</dt>
 * <dd>Displayed when <code>yiv-required</code> fails on a select element.</dd>
 * <dt>length_too_short, length_too_long, length_out_of_range</dt>
 * <dd>Displayed when <code>yiv-length</code> fails on an input field.</dd>
 * <dt>integer, integer_too_small, integer_too_large, integer_out_of_range</dt>
 * <dd>Displayed when <code>yiv-integer</code> fails on an input field.</dd>
 * <dt>decimal, decimal_too_small, decimal_too_large, decimal_out_of_range</dt>
 * <dd>Displayed when <code>yiv-decimal</code> fails on an input field.</dd>
 * </dl>
 * 
 * @property Strings
 * @type {Object}
 * @static
 */
Y.FormManager.Strings =
{
	validation_error:     'Correct errors in the highlighted fields before continuing.',

	required_string:      'This field requires a value.',
	required_menu:        'This field is required. Choose a value from the pull-down list.',

	length_too_short:     'Enter text that is at least {min} characters or longer.',
	length_too_long:      'Enter text that is up to {max} characters long.',
	length_out_of_range:  'Enter text that is {min} to {max} characters long.',

	integer:              'Enter a whole number (no decimal point).',
	integer_too_small:    'Enter a number that is {min} or higher (no decimal point).',
	integer_too_large:    'Enter a number that is {max} or lower (no decimal point).',
	integer_out_of_range: 'Enter a number between or including {min} and {max} (no decimal point).',

	decimal:              'Enter a number.',
	decimal_too_small:    'Enter a number that is {min} or higher.',
	decimal_too_large:    'Enter a number that is {max} or lower.',
	decimal_out_of_range: 'Enter a number between or including {min} and {max}.'
};

function hasLimit(
	/* string */	s)
{
	return (!Y.Lang.isUndefined(s) && s.length > 0);
}

/**
 * Validate an input based on its CSS data.
 * 
 * @method validateFromCSSData
 * @static
 * @param e {Element|Node} The field to validate.
 * @param [msg_list] {Map} Map of message types to custom messages.
 * @return {Object} Status
 * <dl>
 * <dt>keepGoing</dt>
 * <dd>(Boolean) <code>true</code> if further validation should be done.</dd>
 * <dt>error</dt>
 * <dd>(String) The error message, if any.</dd>
 * </dl>
 */
Y.FormManager.validateFromCSSData = function(
	/* element */	e,
	/* map */		msg_list)
{
	var Strings = Y.FormManager.Strings;

	if (e._node)
	{
		e = e._node;
	}

	var required = Y.DOM.hasClass(e, required_class);
	if (required && e.value === '')
	{
		var msg = null;
		if (msg_list && msg_list.required)
		{
			msg = msg_list.required;
		}
		else if (e.tagName.toLowerCase() == 'select')
		{
			msg = Strings.required_menu;
		}
		else
		{
			msg = Strings.required_string;
		}
		return { keepGoing: false, error: msg };
	}
	else if (!required && e.value === '')
	{
		return { keepGoing: false };
	}

	if (e.className)
	{
		var m = e.className.match(length_class_re);
		if (m && m.length)
		{
			if (hasLimit(m[1]) && hasLimit(m[2]) &&
				parseInt(m[1], 10) > parseInt(m[2], 10))
			{
				Y.error(e.name+' has min_length > max_length', null, 'FormManager');
			}

			var msg     = null;
			var has_min = (hasLimit(m[1]) && m[1] !== '0');
			if (has_min && hasLimit(m[2]))
			{
				msg = Strings.length_out_of_range;
			}
			else if (has_min)
			{
				msg = Strings.length_too_short;
			}
			else if (hasLimit(m[2]))
			{
				msg = Strings.length_too_long;
			}

			if (e.value && hasLimit(m[1]) &&
				e.value.length < parseInt(m[1], 10))
			{
				if (msg_list && msg_list.min_length)
				{
					msg = msg_list.min_length;
				}
				msg = Y.substitute(msg, {min: parseInt(m[1], 10), max: parseInt(m[2], 10)});
				return { keepGoing: false, error: msg };
			}
			if (e.value && hasLimit(m[2]) &&
				e.value.length > parseInt(m[2], 10))
			{
				if (msg_list && msg_list.max_length)
				{
					msg = msg_list.max_length;
				}
				msg = Y.substitute(msg, {min: parseInt(m[1], 10), max: parseInt(m[2], 10)});
				return { keepGoing: false, error: msg };
			}
		}

		var m = e.className.match(integer_class_re);
		if (m && m.length)
		{
			if (hasLimit(m[1]) && hasLimit(m[2]) &&
				parseInt(m[1], 10) > parseInt(m[2], 10))
			{
				Y.error(e.name+' has min_value > max_value', null, 'FormManager');
			}

			var value = parseInt(e.value, 10);
			if (e.value &&
				(!Y.FormManager.integer_value_re.test(e.value) ||
				 (hasLimit(m[1]) && value < parseInt(m[1], 10)) ||
				 (hasLimit(m[2]) && value > parseInt(m[2], 10))))
			{
				var msg = null;
				if (msg_list && msg_list.integer)
				{
					msg = msg_list.integer;
				}
				else if (hasLimit(m[1]) && hasLimit(m[2]))
				{
					msg = Strings.integer_out_of_range;
				}
				else if (hasLimit(m[1]))
				{
					msg = Strings.integer_too_small;
				}
				else if (hasLimit(m[2]))
				{
					msg = Strings.integer_too_large;
				}
				else
				{
					msg = Strings.integer;
				}
				msg = Y.substitute(msg, {min: parseInt(m[1], 10), max: parseInt(m[2], 10)});
				return { keepGoing: false, error: msg };
			}
		}

		var m = e.className.match(decimal_class_re);
		if (m && m.length)
		{
			if (hasLimit(m[1]) && hasLimit(m[2]) &&
				parseFloat(m[1]) > parseFloat(m[2]))
			{
				Y.error(e.name+' has min_value > max_value', null, 'FormManager');
			}

			var value = parseFloat(e.value);
			if (e.value &&
				(!Y.FormManager.decimal_value_re.test(e.value) ||
				 (hasLimit(m[1]) && value < parseFloat(m[1])) ||
				 (hasLimit(m[2]) && value > parseFloat(m[2]))))
			{
				var msg = null;
				if (msg_list && msg_list.decimal)
				{
					msg = msg_list.decimal;
				}
				else if (hasLimit(m[1]) &&
						 hasLimit(m[2]))
				{
					msg = Strings.decimal_out_of_range;
				}
				else if (hasLimit(m[1]))
				{
					msg = Strings.decimal_too_small;
				}
				else if (hasLimit(m[2]))
				{
					msg = Strings.decimal_too_large;
				}
				else
				{
					msg = Strings.decimal;
				}
				msg = Y.substitute(msg, {min: parseFloat(m[1], 10), max: parseFloat(m[2], 10)});
				return { keepGoing: false, error: msg };
			}
		}
	}

	return { keepGoing: true };
};

/**
 * Trim leading and trailing whitespace from the specified fields, except
 * when a field has the CSS class yiv-no-trim.
 * 
 * @method cleanValues
 * @static
 * @param e {Array} The fields to clean.
 * @return {boolean} <code>true</code> if there are any file inputs.
 */
Y.FormManager.cleanValues = function(
	/* array */	e)
{
	var has_file_inputs = false;
	for (var i=0; i<e.length; i++)
	{
		var input = e[i];
		var type  = input.type && input.type.toLowerCase();
		if (type == 'file')
		{
			has_file_inputs = true;
		}
		else if (type == 'select-multiple')
		{
			// don't change the value
		}
		else if (input.value && !Y.DOM.hasClass(input, 'yiv-no-trim'))
		{
			input.value = Y.Lang.trim(input.value);
		}
	}

	return has_file_inputs;
};

/**
 * <p>Names of supported status values, highest precedence first.</p>
 * 
 * <p>This is static because it links to CSS rules that define the
 * appearance of each status type:  .formmgr-has{status}</p>
 * 
 * @property status_order
 * @type {Array}
 * @default [ 'error', 'warn', 'success', 'info' ]
 * @static
 */
Y.FormManager.status_order =
[
	'error',
	'warn',
	'success',
	'info'
];

/**
 * Get the precedence of the given status name.
 * 
 * @method getStatusPrecedence
 * @static
 * @param status {String} The name of the status value.
 * @return {int} The position in the <code>status_order</code> array.
 */
Y.FormManager.getStatusPrecedence = function(
	/* string */	status)
{
	for (var i=0; i<Y.FormManager.status_order.length; i++)
	{
		if (status == Y.FormManager.status_order[i])
		{
			return i;
		}
	}

	return Y.FormManager.status_order.length;
};

/**
 * Compare two status values.
 * 
 * @method statusTakesPrecedence
 * @static
 * @param orig_status {String} The name of the original status value.
 * @param new_status {String} The name of the new status value.
 * @return {boolean} <code>true</code> if <code>new_status</code> takes precedence over <code>orig_status</code>
 */
Y.FormManager.statusTakesPrecedence = function(
	/* string */	orig_status,
	/* string */	new_status)
{
	return (!orig_status || Y.FormManager.getStatusPrecedence(new_status) < Y.FormManager.getStatusPrecedence(orig_status));
};


}, 'gallery-2012.05.23-19-56' ,{requires:['substitute']});
