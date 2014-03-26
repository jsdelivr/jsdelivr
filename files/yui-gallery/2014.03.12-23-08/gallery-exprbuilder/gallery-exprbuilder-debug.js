YUI.add('gallery-exprbuilder', function (Y, NAME) {

"use strict";

/**
 * @module gallery-exprbuilder
 */

/**
 * Widget which helps user to build a query expression.
 * 
 * @main gallery-exprbuilder
 * @class ExpressionBuilder
 * @extends Widget
 * @constructor
 * @param config {Object} Widget configuration
 */
function ExpressionBuilder(config)
{
	ExpressionBuilder.superclass.constructor.call(this, config);
}

ExpressionBuilder.NAME = "exprbuilder";

ExpressionBuilder.ATTRS =
{
	/**
	 * The id of the textarea form field.
	 * 
	 * @attribute fieldId
	 * @type {String}
	 * @default Y.guid()
	 * @writeonce
	 */
	fieldId:
	{
		value:     Y.guid(),
		validator: Y.Lang.isString,
		writeOnce: true
	},

	/**
	 * The name of the textarea form field.
	 * 
	 * @attribute fieldName
	 * @type {String}
	 * @default ""
	 * @writeonce
	 */
	fieldName:
	{
		value:     '',
		validator: Y.Lang.isString,
		writeOnce: true
	},

	/**
	 * The FormManager to use when validating the constructed expression.
	 * 
	 * @attribute formMgr
	 * @type {Y.FormManager}
	 * @default null
	 * @writeonce
	 */
	formMgr:
	{
		validator: function(o) { return (!o || o instanceof Y.FormManager); },
		writeOnce: true
	},

	/**
	 * The QueryBuilder to help the user construct the expression.  The
	 * widget must not be rendered.  For each variable type, the values of
	 * the configured operations must be the pattern to be inserted into
	 * the expression. {value} will be replaced by the value entered by the
	 * user.
	 * 
	 * @attribute queryBuilder
	 * @type {Y.QueryBuilder}
	 * @default null
	 * @required
	 * @writeonce
	 */
	queryBuilder:
	{
		validator: function(o) { return (!o || o instanceof Y.QueryBuilder); },
		writeOnce: true
	},

	/**
	 * A map of QueryBuilder operators to objects defining
	 * {operator,pattern}.  This is needed if a variable type generates
	 * multiple values, and the values must be combined with something
	 * other than AND.
	 * 
	 * @attribute combinatorMap
	 * @type {Object}
	 * @default null
	 */
	combinatorMap:
	{
		validator: Y.Lang.isObject
	},

	/**
	 * The label for the Insert Parentheses button.
	 * 
	 * @attribute parenLabel
	 * @type {String}
	 * @default "()"
	 * @writeonce
	 */
	parenLabel:
	{
		value:     '()',
		validator: Y.Lang.isString,
		writeOnce: true
	},

	/**
	 * The label for the AND button.
	 * 
	 * @attribute andLabel
	 * @type {String}
	 * @default "AND"
	 * @writeonce
	 */
	andLabel:
	{
		value:     'AND',
		validator: Y.Lang.isString,
		writeOnce: true
	},

	/**
	 * The label for the OR button.
	 * 
	 * @attribute orLabel
	 * @type {String}
	 * @default "OR"
	 * @writeonce
	 */
	orLabel:
	{
		value:     'OR',
		validator: Y.Lang.isString,
		writeOnce: true
	},

	/**
	 * The label for the NOT button.
	 * 
	 * @attribute notLabel
	 * @type {String}
	 * @default "NOT"
	 * @writeonce
	 */
	notLabel:
	{
		value:     'NOT',
		validator: Y.Lang.isString,
		writeOnce: true
	},

	/**
	 * The label for the Clear button.
	 * 
	 * @attribute clearLabel
	 * @type {String}
	 * @default "Clear"
	 * @writeonce
	 */
	clearLabel:
	{
		value:     'Clear',
		validator: Y.Lang.isString,
		writeOnce: true
	},

	/**
	 * The label for the Insert button.
	 * 
	 * @attribute insertLabel
	 * @type {String}
	 * @default "Insert"
	 * @writeonce
	 */
	insertLabel:
	{
		value:     'Insert',
		validator: Y.Lang.isString,
		writeOnce: true
	},

	/**
	 * The label for the Reset button.
	 * 
	 * @attribute resetLabel
	 * @type {String}
	 * @default "Cancel"
	 * @writeonce
	 */
	resetLabel:
	{
		value:     'Cancel',
		validator: Y.Lang.isString,
		writeOnce: true
	},

	/**
	 * The error message for an unclosed parenthesis. <q>context</q> is
	 * replaced by the portion of the expression that generated the error.
	 * 
	 * @attribute tooManyParensError
	 * @type {String}
	 * @default 'The expression contains an extra closing parenthesis at "{context}".'
	 */
	tooManyParensError:
	{
		value:     'The expression contains an extra closing parenthesis at "{context}...".',
		validator: Y.Lang.isString
	},

	/**
	 * The error message for an unmatched single quote.
	 * 
	 * @attribute unmatchedSingleQuoteError
	 * @type {String}
	 * @default 'The expression contains an unmatched single quote.'
	 */
	unmatchedSingleQuoteError:
	{
		value:     'The expression contains an unmatched single quote at "{context}...".',
		validator: Y.Lang.isString
	},

	/**
	 * The error message for an unclosed parenthesis.
	 * 
	 * @attribute unclosedParenError
	 * @type {String}
	 * @default 'The expression contains an unclosed parenthesis.'
	 */
	unclosedParenError:
	{
		value:     'The expression contains an unclosed parenthesis at "{context}...".',
		validator: Y.Lang.isString
	},

	/**
	 * The error message when the user forgets to select a variable for
	 * insertion.
	 * 
	 * @attribute noVariableSelectedError
	 * @type {String}
	 * @default 'Please choose a variable.'
	 */
	noVariableSelectedError:
	{
		value:     'Please choose a variable.',
		validator: Y.Lang.isString
	}
};

function updateIERange()
{
	this.ie_range = document.selection.createRange();
}

function insertText(text, offset)
{
	offset = offset || text.length;

	this.field.focus();
	var el = Y.Node.getDOMNode(this.field);

	if (el.setSelectionRange)		// For Mozilla/WebKit
	{
		var start = el.selectionStart;
		el.value =
			el.value.substring(0, start) +
			text +
			el.value.substring(el.selectionEnd, el.value.length);

		var index = start + offset;
		el.setSelectionRange(index, index);
	}
	else if (document.selection)	// For IE
	{
		if (!this.ie_range)
		{
			this.ie_range = document.selection.createRange();
		}

		var r  = this.ie_range.duplicate();
		r.text = text;

		this.ie_range.move('character', offset);
		this.ie_range.select();
	}
}

function paren(e)
{
	insertText.call(this, '()', 1);
	e.halt();
}

function handler(key)
{
	return function(e)
	{
		insertText.call(this, ' ' + this.get(key+'Label') + ' ');
		e.halt();
	};
}

function clear(e)
{
	this.clear();
	e.halt();
}

function insertQB(e)
{
	var qb = this.get('queryBuilder');
	if (!qb.validateFields())
	{
		e.halt();
		return;
	}

	var query = qb.toDatabaseQuery();
	if (query.length === 0)
	{
		var el = qb.get('contentBox').one('select');
		qb.displayFieldMessage(el, this.get('noVariableSelectedError'), 'error');
		e.halt();
		return;
	}

	var map = this.get('combinatorMap');

	var s     = '';
	var op    = ' ' + this.get('andLabel') + ' ';
	for (var i=0; i<query.length; i++)
	{
		var q = query[i];

		if (i > 0)
		{
			s += op;
		}
		s += q[0];

		var pattern = q[1];
		if (pattern.indexOf('{') == -1)
		{
			pattern += '{value}';
		}

		var combinator = map && map[ q[1] ];
		if (combinator)
		{
			op      = combinator.operator;
			pattern = combinator.pattern;
		}

		s += Y.Lang.substitute(pattern,
		{
			value: q[2].replace(/'/g, '\\\'')
		});
	}

	insertText.call(this, s);
	qb.reset();
	e.halt();
}

function resetQB(e)
{
	this.get('queryBuilder').reset();

	if (e)
	{
		e.halt();
	}
}

function setValidation(f)
{
	if (!f)
	{
		return;
	}

	var self = this;

	var orig_validateForm = f.validateForm;
	f.validateForm = function()
	{
		resetQB.call(self);
		orig_validateForm.apply(this, arguments);
	};

	f.setFunction(this.get('fieldId'), function(form, e)
	{
		return self._validateExpression(form, e, this);
	});
}

Y.extend(ExpressionBuilder, Y.Widget,
{
	initializer: function(config)
	{
		// FormManager

		setValidation.call(this, config.formMgr);
		this.after('formMgrChange', function(e)
		{
			if (e.prevVal)
			{
				e.prevVal.setFunction(this.get('fieldId'), null);
			}

			setValidation.call(this, e.newVal);
		});
	},

	renderUI: function()
	{
		var container = this.get('contentBox');
		container.set('innerHTML', this._field());

		// textarea

		this.field = container.one('#'+this.get('fieldId'));

		if (document.selection)
		{
			this.field.on('change', updateIERange, this);
		}

		// basic controls

		container.one('.'+this.getClassName('paren')).on('click', paren, this);

		var op = [ 'and', 'or', 'not' ];
		for (var i=0; i<op.length; i++)
		{
			container.one('.'+this.getClassName(op[i])).on('click', handler(op[i]), this);
		}

		container.one('.'+this.getClassName('clear')).on('click', clear, this);

		// QueryBuilder

		var qb = this.get('queryBuilder');
		if (qb)
		{
			container.appendChild(Y.Node.create(this._query()));

			qb.render(container.one('.'+this.getClassName('querybuilder')));

			container.one('.'+this.getClassName('insert')).on('click', insertQB, this);
			container.one('.'+this.getClassName('reset')).on('click', resetQB, this);
		}
	},

	destructor: function()
	{
		var qb = this.get('queryBuilder');
		if (qb)
		{
			qb.destroy();
		}

		this.ie_range = null;
	},

	/**
	 * Clears the expression.
	 * 
	 * @method clear
	 */
	clear: function()
	{
		this.field.set('value', '');
		this.field.focus();
	},

	/**
	 * Validate the expression.
	 * 
	 * @method _validateExpression
	 * @protected
	 * @return {Boolean} <code>true</code> if the expression has balanced parens and single quotes
	 */
	_validateExpression: function(form, e, form_mgr)
	{
		var s     = e.get('value');
		var paren = 0;
		var pi    = -1;
		var quote = false;
		var qi    = -1;
		for (var i=0; i<s.length; i++)
		{
			var c = s.charAt(i);
			if (!quote && c == '(')
			{
				if (paren === 0)
				{
					pi = i;
				}
				paren++;
			}
			else if (!quote && c == ')')
			{
				paren--;
				if (paren < 0)
				{
					var msg = Y.Lang.substitute(this.get('tooManyParensError'),
					{
						context: s.substr(0,i+1)
					});
					form_mgr.displayMessage(e, msg, 'error');
					return false;
				}
			}
			else if (c == '\'' && (i === 0 || s.charAt(i-1) != '\\'))
			{
				if (!quote)
				{
					qi = i;
				}
				quote = ! quote;
			}
		}

		if (quote && (paren === 0 || qi < pi))
		{
			var msg = Y.Lang.substitute(this.get('unmatchedSingleQuoteError'),
			{
				context: s.substr(0,qi+1)
			});
			form_mgr.displayMessage(e, msg, 'error');
			return false;
		}
		else if (paren > 0)
		{
			var msg = Y.Lang.substitute(this.get('unclosedParenError'),
			{
				context: s.substr(0,pi+1)
			});
			form_mgr.displayMessage(e, msg, 'error');
			return false;
		}

		return true;
	},

	//
	// Markup
	//

	/**
	 * @method _field
	 * @protected
	 * @return {String} markup for the textarea and basic buttons
	 */
	_field: function()
	{
		var markup =
			'<div class="{td}">' +
				'<textarea id="{tid}" name="{tn}" class="{ff} {ta}"></textarea>' +
			'</div>' +
			'<div class="{fctl}">' +
				'<button type="button" class="yui3-button {pc}">{paren}</button>' +
				'<button type="button" class="yui3-button {ac}">{and}</button>' +
				'<button type="button" class="yui3-button {oc}">{or}</button>' +
				'<button type="button" class="yui3-button {nc}">{not}</button>' +
				'<button type="button" class="yui3-button {cc}">{clear}</button>' +
			'</div>';

		return Y.Lang.substitute(markup,
		{
			td:     this.getClassName('field-container'),
			ff:     Y.FormManager.field_marker_class,
			ta:     this.getClassName('field'),
			tid:    this.get('fieldId'),
			tn:     this.get('fieldName'),
			fctl:   this.getClassName('controls'),
			pc:     this.getClassName('paren'),
			ac:     this.getClassName('and'),
			oc:     this.getClassName('or'),
			nc:     this.getClassName('not'),
			cc:     this.getClassName('clear'),
			paren:  this.get('parenLabel'),
			and:    this.get('andLabel'),
			or:     this.get('orLabel'),
			not:    this.get('notLabel'),
			clear:  this.get('clearLabel')
		});
	},

	/**
	 * @method _query
	 * @protected
	 * @return {String} markup for the QueryBuilder
	 */
	_query: function()
	{
		var markup =
			'<div class="{qb}"></div>' +
			'<div class="{qbctl} {fr}">' +
				'<button type="button" class="yui3-button {ic}">{insert}</button>' +
				'<button type="button" class="yui3-button {rc}">{reset}</button>' +
			'</div>';

		return Y.Lang.substitute(markup,
		{
			qb:     this.getClassName('querybuilder'),
			qbctl:  this.getClassName('querybuilder-controls'),
			fr:     Y.FormManager.row_marker_class,
			ic:     this.getClassName('insert'),
			rc:     this.getClassName('reset'),
			insert: this.get('insertLabel'),
			reset:  this.get('resetLabel')
		});
	}
});

Y.ExpressionBuilder = ExpressionBuilder;


}, 'gallery-2013.01.16-21-05', {"skinnable": "true", "requires": ["gallery-querybuilder", "gallery-formmgr"]});
