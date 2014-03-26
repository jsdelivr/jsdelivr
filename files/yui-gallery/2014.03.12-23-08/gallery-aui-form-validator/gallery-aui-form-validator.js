YUI.add('gallery-aui-form-validator', function(A) {

// API inspired on the amazing jQuery Form Validation - http://jquery.bassistance.de/validate/

var L = A.Lang,
	O = A.Object,
	isBoolean = L.isBoolean,
	isDate = L.isDate,
	isEmpty = O.isEmpty,
	isFunction = L.isFunction,
	isObject = L.isObject,
	isString = L.isString,
	trim = L.trim,

	DASH = '-',
	DOT = '.',
	EMPTY_STRING = '',
	FORM_VALIDATOR = 'form-validator',
	INVALID_DATE = 'Invalid Date',
	PIPE = '|',

	BLUR_HANDLERS = 'blurHandlers',
	CHECKBOX = 'checkbox',
	CONTAINER = 'container',
	CONTAINER_ERROR_CLASS = 'containerErrorClass',
	CONTAINER_VALID_CLASS = 'containerValidClass',
	CONTENT_BOX = 'contentBox',
	ERROR = 'error',
	ERROR_CLASS = 'errorClass',
	EXTRACT_CSS_PREFIX = 'extractCssPrefix',
	EXTRACT_RULES = 'extractRules',
	FIELD = 'field',
	FIELD_CONTAINER = 'fieldContainer',
	FIELD_STRINGS = 'fieldStrings',
	INPUT_HANDLERS = 'inputHandlers',
	MESSAGE = 'message',
	MESSAGE_CONTAINER = 'messageContainer',
	NAME = 'name',
	RADIO = 'radio',
	RULES = 'rules',
	SELECT_TEXT = 'selectText',
	SHOW_ALL_MESSAGES = 'showAllMessages',
	SHOW_MESSAGES = 'showMessages',
	STACK = 'stack',
	STACK_ERROR_CONTAINER = 'stackErrorContainer',
	TYPE = 'type',
	VALID = 'valid',
	VALIDATE_ON_BLUR = 'validateOnBlur',
	VALIDATE_ON_INPUT = 'validateOnInput',
	VALID_CLASS = 'validClass',

	EV_BLUR = 'blur',
	EV_ERROR_FIELD = 'errorField',
	EV_INPUT = 'input',
	EV_RESET = 'reset',
	EV_SUBMIT = 'submit',
	EV_SUBMIT_ERROR = 'submitError',
	EV_VALIDATE_FIELD = 'validateField',
	EV_VALID_FIELD = 'validField',

	getCN = A.ClassNameManager.getClassName,

	CSS_ERROR = getCN(FORM_VALIDATOR, ERROR),
	CSS_ERROR_CONTAINER = getCN(FORM_VALIDATOR, ERROR, CONTAINER),
	CSS_VALID = getCN(FORM_VALIDATOR, VALID),
	CSS_VALID_CONTAINER = getCN(FORM_VALIDATOR, VALID, CONTAINER),

	CSS_FIELD = getCN(FIELD),
	CSS_MESSAGE = getCN(FORM_VALIDATOR, MESSAGE),
	CSS_STACK_ERROR = getCN(FORM_VALIDATOR, STACK, ERROR),

	TPL_MESSAGE = '<div class="'+CSS_MESSAGE+'"></div>',
	TPL_STACK_ERROR = '<label class="'+CSS_STACK_ERROR+'"></label>',

	UI_ATTRS = [ EXTRACT_RULES, VALIDATE_ON_BLUR, VALIDATE_ON_INPUT ];

YUI.AUI.defaults.FormValidator = {
	STRINGS: {
		DEFAULT: 'Please fix this field.',
		acceptFiles: 'Please enter a value with a valid extension ({0}).',
		alpha: 'Please enter only apha characters.',
		alphanum: 'Please enter only aphanumeric characters.',
		date: 'Please enter a valid date.',
		digits: 'Please enter only digits.',
		email: 'Please enter a valid email address.',
		equalTo: 'Please enter the same value again.',
		max: 'Please enter a value less than or equal to {0}.',
		maxLength: 'Please enter no more than {0} characters.',
		min: 'Please enter a value greater than or equal to {0}.',
		minLength: 'Please enter at least {0} characters.',
		number: 'Please enter a valid number.',
		range: 'Please enter a value between {0} and {1}.',
		rangeLength: 'Please enter a value between {0} and {1} characters long.',
		required: 'This field is required.',
		url: 'Please enter a valid URL.'
	},

	REGEX: {
		alpha: /^[a-z_]+$/i,

		alphanum: /^\w+$/,

		digits: /^\d+$/,

		number: /^[+\-]?(\d+([.,]\d+)?)+$/,

		// Regex from Scott Gonzalez Email Address Validation: http://projects.scottsplayground.com/email_address_validation/
		email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,

		// Regex from Scott Gonzalez IRI: http://projects.scottsplayground.com/iri/
		url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
	},

	RULES: {
		acceptFiles: function(val, node, ruleValue) {
			var regex = null;

			if (isString(ruleValue)) {
				// convert syntax (jpg, png) or (jpg png) to regex syntax (jpg|png)
				var extensions = ruleValue.split(/,\s*|\b\s*/).join(PIPE);

				regex = new RegExp('[.](' + extensions + ')$', 'i');
			}

			return regex && regex.test(val);
		},

		date: function(val, node, ruleValue) {
			var date = new Date(val);

			return (isDate(date) && (date != INVALID_DATE) && !isNaN(date));
		},

		equalTo: function(val, node, ruleValue) {
			var comparator = A.one(ruleValue);

			return comparator && (trim(comparator.val()) == val);
		},

		max: function(val, node, ruleValue) {
			return (FormValidator.toNumber(val) <= ruleValue);
		},

		maxLength: function(val, node, ruleValue) {
			return (val.length <= ruleValue);
		},

		min: function(val, node, ruleValue) {
			return (FormValidator.toNumber(val) >= ruleValue);
		},

		minLength: function(val, node, ruleValue) {
			return (val.length >= ruleValue);
		},

		range: function(val, node, ruleValue) {
			var num = FormValidator.toNumber(val);

			return (num >= ruleValue[0]) && (num <= ruleValue[1]);
		},

		rangeLength: function(val, node, ruleValue) {
			var length = val.length;

			return (length >= ruleValue[0]) && (length <= ruleValue[1]);
		},

		required: function(val, node, ruleValue) {
			var instance = this;

			if (A.FormValidator.isCheckable(node)) {
				var name = node.get(NAME);
				var elements = instance.getElementsByName(name);

				return (elements.filter(':checked').size() > 0);
			}
			else {
				return !!val;
			}
		}
	}
};

var FormValidator = A.Component.create({
	NAME: FORM_VALIDATOR,

	ATTRS: {
		containerErrorClass: {
			value: CSS_ERROR_CONTAINER,
			validator: isString
		},

		containerValidClass: {
			value: CSS_VALID_CONTAINER,
			validator: isString
		},

		errorClass: {
			value: CSS_ERROR,
			validator: isString
		},

		extractCssPrefix: {
			value: CSS_FIELD+DASH,
			validator: isString
		},

		extractRules: {
			value: true,
			validator: isBoolean
		},

		fieldContainer: {
			value: DOT+CSS_FIELD
		},

		fieldStrings: {
			value: {},
			validator: isObject
		},

		messageContainer: {
			getter: function(val) {
				return A.Node.create(val).clone();
			},
			value: TPL_MESSAGE
		},

		render: {
			value: true
		},

		strings: {
			valueFn: function() {
				return YUI.AUI.defaults.FormValidator.STRINGS;
			}
		},

		rules: {
			validator: isObject,
			value: {}
		},

		selectText: {
			value: true,
			validator: isBoolean
		},

		showMessages: {
			value: true,
			validator: isBoolean
		},

		showAllMessages: {
			value: false,
			validator: isBoolean
		},

		stackErrorContainer: {
			getter: function(val) {
				return A.Node.create(val).clone();
			},
			value: TPL_STACK_ERROR
		},

		validateOnBlur: {
			value: true,
			validator: isBoolean
		},

		validateOnInput: {
			value: false,
			validator: isBoolean
		},

		validClass: {
			value: CSS_VALID,
			validator: isString
		}
	},

	isCheckable: function(node) {
		var nodeType = node.get(TYPE).toLowerCase();

		return (nodeType == CHECKBOX || nodeType == RADIO);
	},

	toNumber: function(val) {
		return parseFloat(val) || 0;
	},

	EXTENDS: A.Widget,

	UI_ATTRS: UI_ATTRS,

	prototype: {
		CONTENT_TEMPLATE: null,
		UI_EVENTS: {},

		initializer: function() {
			var instance = this;

			instance.blurHandlers = [];
			instance.errors = {};
			instance.inputHandlers = [];
			instance.stackErrorContainers = {};
		},

		bindUI: function() {
			var instance = this;

			instance._createEvents();
			instance._bindValidation();
		},

		addFieldError: function(field, ruleName) {
			var instance = this;
			var errors = instance.errors;
			var name = field.get(NAME);

			if (!errors[name]) {
				errors[name] = [];
			}

			errors[name].push(ruleName);
		},

		clearFieldError: function(field) {
			var instance = this;

			delete instance.errors[field.get(NAME)];
		},

		eachRule: function(fn) {
			var instance = this;

			A.each(
				instance.get(RULES),
				function(rule, fieldName) {
					if (isFunction(fn)) {
						fn.apply(instance, [rule, fieldName]);
					}
				}
			);
		},

		findFieldContainer: function(field) {
			var instance = this;
			var fieldContainer = instance.get(FIELD_CONTAINER);

			if (fieldContainer) {
				return field.ancestor(fieldContainer);
			}
		},

		focusInvalidField: function() {
			var instance = this;
			var contentBox = instance.get(CONTENT_BOX);
			var field = contentBox.one(DOT+CSS_ERROR);

			if (field) {
				if (instance.get(SELECT_TEXT)) {
					field.selectText();
				}

				field.focus();
			}
		},

		getElementsByName: function(name) {
			var instance = this;

			return instance.get(CONTENT_BOX).all('[name="' + name + '"]');
		},

		getField: function(field) {
			var instance = this;

			if (isString(field)) {
				field = instance.getElementsByName(field).item(0);
			}

			return field;
		},

		getFieldError: function(field) {
			var instance = this;

			return instance.errors[field.get(NAME)];
		},

		getFieldStackErrorContainer: function(field) {
			var instance = this;
			var name = field.get(NAME);
			var stackContainers = instance.stackErrorContainers;

			if (!stackContainers[name]) {
				stackContainers[name] = instance.get(STACK_ERROR_CONTAINER);
			}

			return stackContainers[name];
		},

		getFieldErrorMessage: function(field, rule) {
			var instance = this;
			var fieldName = field.get(NAME);
			var fieldStrings = instance.get(FIELD_STRINGS)[fieldName] || {};
			var fieldRules = instance.get(RULES)[fieldName];

			var strings = instance.getStrings();
			var substituteRulesMap = {};

			if (rule in fieldRules) {
				var ruleValue = A.Array(fieldRules[rule]);

				A.each(
					ruleValue,
					function(value, index) {
						substituteRulesMap[index] = [value].join(EMPTY_STRING);
					}
				);
			}

			var message = (fieldStrings[rule] || strings[rule] || strings.DEFAULT);

			return A.substitute(message, substituteRulesMap);
		},

		hasErrors: function() {
			var instance = this;

			return !isEmpty(instance.errors);
		},

		highlight: function(field, valid) {
			var instance = this;
			var fieldContainer = instance.findFieldContainer(field);

			instance._highlightHelper(
				field,
				instance.get(ERROR_CLASS),
				instance.get(VALID_CLASS),
				valid
			);

			instance._highlightHelper(
				fieldContainer,
				instance.get(CONTAINER_ERROR_CLASS),
				instance.get(CONTAINER_VALID_CLASS),
				valid
			);
		},

		unhighlight: function(field) {
			var instance = this;

			instance.highlight(field, true);
		},

		printStackError: function(field, container, errors) {
			var instance = this;

			if (!instance.get(SHOW_ALL_MESSAGES)) {
				errors = errors.slice(0, 1);
			}

			container.empty();

			A.each(
				errors,
				function(error, index) {
					var message = instance.getFieldErrorMessage(field, error);
					var messageEl = instance.get(MESSAGE_CONTAINER).addClass(error);

					container.append(
						messageEl.html(message)
					);
				}
			);
		},

		resetAllFields: function() {
			var instance = this;

			instance.eachRule(
				function(rule, fieldName) {
					var field = instance.getField(fieldName);

					instance.resetField(field);
				}
			);
		},

		resetField: function(field) {
			var instance = this;
			var stackContainer = instance.getFieldStackErrorContainer(field);

			stackContainer.remove();

			instance.resetFieldCss(field);

			instance.clearFieldError(field);
		},

		resetFieldCss: function(field) {
			var instance = this;
			var fieldContainer = instance.findFieldContainer(field);

			var removeClasses = function(elem, classAttrs) {
				if (elem) {
					A.each(classAttrs, function(attrName) {
						elem.removeClass(
							instance.get(attrName)
						);
					});
				}
			};

			removeClasses(field, [VALID_CLASS, ERROR_CLASS]);
			removeClasses(fieldContainer, [CONTAINER_VALID_CLASS, CONTAINER_ERROR_CLASS]);
		},

		validatable: function(field) {
			var instance = this;
			var fieldRules = instance.get(RULES)[field.get(NAME)];

			var required = fieldRules.required;
			var hasValue = YUI.AUI.defaults.FormValidator.RULES.required.apply(instance, [field.val(), field]);

			return (required || (!required && hasValue));
		},

		validate: function() {
			var instance = this;

			instance.eachRule(
				function(rule, fieldName) {
					instance.validateField(fieldName);
				}
			);

			instance.focusInvalidField();
		},

		validateField: function(field) {
			var instance = this;
			var fieldNode = instance.getField(field);

			if (fieldNode) {
				var validatable = instance.validatable(fieldNode);

				instance.resetField(fieldNode);

				if (validatable) {
					instance.fire(EV_VALIDATE_FIELD, {
						validator: {
							field: fieldNode
						}
					});
				}
			}
		},

		_bindValidation: function() {
			var instance = this;
			var form = instance.get(CONTENT_BOX);

			form.on(EV_RESET, A.bind(instance._onFormReset, instance));
			form.on(EV_SUBMIT, A.bind(instance._onFormSubmit, instance));
		},

		_createEvents: function() {
			var instance = this;

			// create publish function for kweight optimization
			var publish = function(name, fn) {
				instance.publish(name, {
		            defaultFn: fn
		        });
			};

			publish(
				EV_ERROR_FIELD,
				instance._defErrorFieldFn
			);

			publish(
				EV_VALID_FIELD,
				instance._defValidFieldFn
			);

			publish(
				EV_VALIDATE_FIELD,
				instance._defValidateFieldFn
			);
		},

		_defErrorFieldFn: function(event) {
			var instance = this;
			var validator = event.validator;
			var field = validator.field;

			instance.highlight(field);

			if (instance.get(SHOW_MESSAGES)) {
				var stackContainer = instance.getFieldStackErrorContainer(field);

				field.placeBefore(stackContainer);

				instance.printStackError(
					field,
					stackContainer,
					validator.errors
				);
			}
		},

		_defValidFieldFn: function(event) {
			var instance = this;
			var field = event.validator.field;

			instance.unhighlight(field);
		},

		_defValidateFieldFn: function(event) {
			var instance = this;
			var field = event.validator.field;
			var fieldRules = instance.get(RULES)[field.get(NAME)];

			A.each(
				fieldRules,
				function(ruleValue, ruleName) {
					var rule = YUI.AUI.defaults.FormValidator.RULES[ruleName];
					var fieldValue = trim(field.val());

					if (isFunction(rule) &&
						!rule.apply(instance, [fieldValue, field, ruleValue])) {

						instance.addFieldError(field, ruleName);
					}
				}
			);

			var fieldErrors = instance.getFieldError(field);

			if (fieldErrors) {
				instance.fire(EV_ERROR_FIELD, {
					validator: {
						field: field,
						errors: fieldErrors
					}
				});
			}
			else {
				instance.fire(EV_VALID_FIELD, {
					validator: {
						field: field
					}
				});
			}
		},

		_highlightHelper: function(field, errorClass, validClass, valid) {
			if (field) {
				if (valid) {
					field.removeClass(errorClass).addClass(validClass);
				}
				else {
					field.removeClass(validClass).addClass(errorClass);
				}
			}
		},

		_onBlurField: function(event) {
			var instance = this;
			var fieldName = event.currentTarget.get(NAME);

			instance.validateField(fieldName);
		},

		_onFieldInputChange: function(event) {
			var instance = this;

			instance.validateField(event.currentTarget);
		},

		_onFormSubmit: function(event) {
			var instance = this;

			var data = {
				validator: {
					formEvent: event
				}
			};

			instance.validate();

			if (instance.hasErrors()) {
				data.validator.errors = instance.errors;

				instance.fire(EV_SUBMIT_ERROR, data);

				event.halt();
			}
			else {
				instance.fire(EV_SUBMIT, data);
			}
		},

		_onFormReset: function(event) {
			var instance = this;

			instance.resetAllFields();
		},

		// helper method for k-weight optimizations
		_bindValidateHelper: function(bind, evType, fn, handler) {
			var instance = this;

			instance._unbindHandlers(handler);

			if (bind) {
				instance.eachRule(
					function(rule, fieldName) {
						var field = instance.getElementsByName(fieldName);

						instance[handler].push(
							field.on(evType, A.bind(fn, instance))
						);
					}
				);
			}
		},

		_uiSetExtractRules: function(val) {
			var instance = this;

			if (val) {
				var form = instance.get(CONTENT_BOX);
				var rules = instance.get(RULES);
				var extractCssPrefix = instance.get(EXTRACT_CSS_PREFIX);

				A.each(
					YUI.AUI.defaults.FormValidator.RULES,
					function(ruleValue, ruleName) {
						var query = [DOT, extractCssPrefix, ruleName].join(EMPTY_STRING);

						form.all(query).each(
							function(node) {
								if (node.get(TYPE)) {
									var fieldName = node.get(NAME);

									if (!rules[fieldName]) {
										rules[fieldName] = {};
									}

									if (!(ruleName in rules[fieldName])) {
										rules[fieldName][ruleName] = true;
									}
								}
							}
						);
					}
				);
			}
		},

		_uiSetValidateOnInput: function(bind) {
			var instance = this;

			instance._bindValidateHelper(bind, EV_INPUT, instance._onFieldInputChange, INPUT_HANDLERS);
		},

		_uiSetValidateOnBlur: function(bind) {
			var instance = this;

			instance._bindValidateHelper(bind, EV_BLUR, instance._onBlurField, BLUR_HANDLERS);
		},

		_unbindHandlers: function(handler) {
			var instance = this;

			A.each(
				instance[handler],
				function(handler) {
					handler.detach();
				}
			);

			instance[handler] = [];
		}
	}
});

A.each(
	YUI.AUI.defaults.FormValidator.REGEX,
	function(regex, key) {
		YUI.AUI.defaults.FormValidator.RULES[key] = function(val, node, ruleValue) {
			return YUI.AUI.defaults.FormValidator.REGEX[key].test(val);
		};
	}
);

A.FormValidator = FormValidator;


}, 'gallery-2010.08.18-17-12' ,{requires:['gallery-aui-base','gallery-aui-event-input','selector-css3','substitute']});
