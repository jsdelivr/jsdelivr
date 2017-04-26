/*!
 * braintree-validation v1.0.0
 *
 * https://github.com/nb1987/braintree-validation
 *
 * Copyright (c) 2017 Nick Bagnall
 * Released under the MIT license
 */

(function(root, factory) {
	if (typeof define === 'function' && define.amd ) {
		define(['hosted-fields', 'jquery.validate'], factory );
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory(require('braintree-web/hosted-fields'), require('jquery-validation'));
	} else {
		factory(root.braintree.hostedFields, root.jQuery);
	}
}(this, function(hostedFields, $) {

	var hostedFieldsInstanceRef;

	/**
	 * Returns a braintree.HostedField instance name that corresponds to the passed-in frameElement
	 * @param {String} frameElement - <iframe> element whose corresponding Braintree HostedField name you want to return 
	 * @returns {String} identifying the name of the field corresponding to the passed-in frameElement 
	 */
	function getFieldNameFromFrameElement(frameElement) {
		if (hostedFieldsInstanceRef === undefined) {
			console.error('You cannot call getFieldNameFromFrameElement() without first calling validate() on the braintree.hostedFields!');
			return;
		}
		for (field in hostedFieldsInstanceRef._fields) {
			if (hostedFieldsInstanceRef._fields[field].frameElement === frameElement) {
				return field;
			}
		}
	}
	
	hostedFields.getFieldNameFromFrameElement = getFieldNameFromFrameElement;
	
	/**
	 * Returns a braintree.HostedField instance that corresponds to the passed-in frameElement
	 * @param {String} frameElement - <iframe> element whose corresponding Braintree HostedField you want to return 
	 * @returns {braintree.HostedField} corresponding to the passed-in frameElement 
	 */
	function getFieldFromFrameElement(frameElement) {
		if (hostedFieldsInstanceRef === undefined) {
			console.error('You cannot call getFieldFromFrameElement() without first calling validate() on the braintree.hostedFields!');
			return;
		}
		return hostedFieldsInstanceRef._state.fields[getFieldNameFromFrameElement(frameElement)];
	}
	
	hostedFields.getFieldFromFrameElement = getFieldFromFrameElement;
	
	/**
		* A 'wrapper' method that reads, adds to, or removes rules from the form containing the hosted fields by simply invoking 
		  jQuery validation plugin's own rules() method 
		* @see {@link https://jqueryvalidation.org/rules/} for futher information
		* @param {String} command - if not reading rules, then command to add or remove (valid options are 'add' and 'remove')
		* @param {Object} argument - the rules to add (if command parameter is 'add') or remove (if the command parameter is 'remove')
		* @returns {Object} indicating whether the form containing the hosted fields is valid or not 
	*/
	hostedFields.rules = function(command, argument) {
		if (hostedFieldsInstanceRef === undefined) {
			console.error('You cannot call rules() without first calling validate() on the braintree.hostedFields!');
			return;
		}

		var form = $(hostedFieldsInstanceRef._fields[Object.keys(hostedFieldsInstanceRef._fields)[0]].containerElement).closest('form');

		if (command) {
			switch (command) {
				case 'add':
					$(form).rules('add', argument);
					break;
				case 'remove':
					return $(form).rules('remove', argument);
			}
			return;
		} else {
			return $(form).rules();
		}
	}
	
	/**
		* A 'wrapper' method that checks validity of the form containing the hosted fields by simply invoking 
		  jQuery validation plugin's own valid() method
		* @see {@link https://jqueryvalidation.org/valid/} for futher information
		* @returns {Boolean} indicating whether the form containing the hosted fields is valid or not 
	*/
	hostedFields.valid = function() {
		if (hostedFieldsInstanceRef === undefined) {
			console.error('You cannot call valid() without first calling validate() on the braintree.hostedFields!');
			return;
		}
		
		var form = $(hostedFieldsInstanceRef._fields[Object.keys(hostedFieldsInstanceRef._fields)[0]].containerElement).closest('form');
		return $(form).valid();
	}


	/**
	 * Imbues Braintree hosted fields instance with validation (via jQuery Validation plugin) and returns a $.validator 
	 * @see {@link https://jqueryvalidation.org|jqueryvalidation.org}
	 * @param {HostedFields} hostedFieldsInstance - the Braintree hosted fields instance to validate
	 * @param {Object} options - the jQuery Validation plugin options (see https://jqueryvalidation.org/validate/)
	 * @returns {$.validator} - a validator for the form (see https://jqueryvalidation.org/category/validator/)
	 */
	hostedFields.validate = function(hostedFieldsInstance, options) {

		// warn and exit if can't find jQuery and/or jQuery validator libraries 
		if (typeof $ === 'undefined') {
			console.error('No jQuery object is defined!');
			return;
		}
		
		if (typeof $.validator === 'undefined') {
			console.error('jQuery Validation plugin not found!');
			return;
		}
		
		if (!hostedFieldsInstance._fields) {
			console.error('hostedFieldsInstance._fields has no value!');
			return;
		}
		
		hostedFieldsInstanceRef = hostedFieldsInstance;
		
		var form = $(hostedFieldsInstance._fields[Object.keys(hostedFieldsInstance._fields)[0]].containerElement).closest('form'),
			rules = (options && options.rules) || {},
			messages = (options && options.messages) || {},
			eventMap = {
				focus: function() { return new FocusEvent('focus', {bubbles: true, cancelable: true}); },
				blur: function() { return new FocusEvent('blur', {bubbles: true, cancelable: true}); },
				inputSubmitRequest: function() { return new Event('submit', {bubbles: true, cancelable: true}); },
				// the key passed in the second argument of the keyup events is arbitrary 
				empty: function() { return new Event('keyup', {bubbles: true, cancelable: true, key: 'Q'}); },
				notEmpty: function() { return new Event('keyup', {bubbles: true, cancelable: true, key: 'Q'}); },
				cardTypeChange: function() { return new Event('keyup', {bubbles: true, cancelable: true, key: 'Q'}); },
				validityChange: function() { return new Event('keyup', {bubbles: true, cancelable: true, key: 'Q'}); }
			},
			fieldDescriptionMap = {
				number: 'card number',
				cvv: 'CVV',
				expirationMonth: 'expiration month',
				expirationYear: 'expiration year',
				postalCode: 'postal code'
			};
		
		for (field in hostedFieldsInstance._fields) {
			var frameElement = $(hostedFieldsInstance._fields[field].frameElement),
				frameElementName = $(frameElement).attr('name');
			// setting the contenteditable attribute on the element ensures that it will be processed by 
			// the jQuery Validation plugin, even though it's not technically an input 
			frameElement.attr('contenteditable', true);
			$.validator.addMethod(frameElementName + '-isRequired', function(value, frameElement) {
				return !getFieldFromFrameElement(frameElement).isEmpty;
			});
			$.validator.addMethod(frameElementName + '-isValid', function(value, frameElement) {
				return getFieldFromFrameElement(frameElement).isValid;
			});
			if (frameElementName in rules) {
				if (options.debug) console.warn('You are overriding braintree-validation\'s default validation rules for the ' + 
					fieldDescriptionMap[field] + '. Please refer to the library\'s GitHub documentation if you have not already done so.');
			} else {
				rules[frameElementName] = {};
				rules[frameElementName][frameElementName + '-isRequired'] = true;
				rules[frameElementName][frameElementName + '-isValid'] = true;
			}
			if (frameElementName in messages) {
				if (options.debug) console.warn('You are overriding braintree-validation\'s default error messages for the ' + 
					fieldDescriptionMap[field] + '. Please refer to the library\'s GitHub documentation if you have not already done so.');
			} else {
				messages[frameElementName] = {};
				messages[frameElementName][frameElementName + '-isRequired'] = fieldDescriptionMap[field].charAt(0).toUpperCase() + 
					fieldDescriptionMap[field].slice(1) + ' is required.';
				messages[frameElementName][frameElementName + '-isValid'] = 'Please enter a valid ' + fieldDescriptionMap[field] + '.';
			}
		}
		
		if (options.onfocusout === false) {
			delete eventMap['blur'];
		}
		if (options.onkeyup === false) {
			delete eventMap['empty'];
			delete eventMap['notEmpty'];
			delete eventMap['validityChange'];
			delete eventMap['cardTypeChange'];
		}
		// forward Braintree events to the jQuery validation plugin
		for (braintreeEvent in eventMap) {
			(function(scopedBraintreeEvent) {
				hostedFieldsInstance.on(scopedBraintreeEvent, function(event) {
					if (scopedBraintreeEvent === 'inputSubmitRequest') {
						$(event.fields[event.emittedBy].container).closest('form')[0].dispatchEvent(eventMap[scopedBraintreeEvent]());
					} else {
						$(event.fields[event.emittedBy].container).children('iframe')[0].dispatchEvent(eventMap[scopedBraintreeEvent]());
					}
				});
			})(braintreeEvent);
		}
		
		options.rules = rules;
		options.messages = messages;
		
		// errorPlacement is not actually defined as a function in the jQuery validation plugin, so it cannot be 
		// overriden in the validator and therefore you must define it in the options passed to validate() 
		if (!options.errorPlacement) {
			options.errorPlacement = function(error, element) {
				if (getFieldNameFromFrameElement(element[0]) !== undefined) {
					error.insertAfter(element.parent());
				// the form may include non-hosted (non-Braintree) fields; use jQuery validation plugin's default implementation 
				} else {
					error.insertAfter(element);
				}
			};
		} else if (options.debug) {
			console.warn('You are overriding braintree-validation\'s default implementation of errorPlacement(). Please refer to the library\'s GitHub documentation if you have not already done so.');
		}		
		var validator = form.validate(options);
		var defaultHighlightFn = validator.settings.highlight,
			defaultUnhighlightFn = validator.settings.unhighlight,
			defaultRequiredFn = $.validator.methods.required;
		
		// additional default properties and partial overrides 
		if (options.ignore && typeof options.ignore === 'string' && options.ignore.match(/iframe/gi)) {
			if (options.debug) console.warn('iframe is being expunged from the options.ignore string.');
			validator.settings.ignore = options.ignore.replace(/iframe/gi, '');
		}
		if (!options.highlight) {
			validator.settings.highlight = function(element, errorClass, validClass) {
				var braintreeFieldName = getFieldNameFromFrameElement(element);
				if (braintreeFieldName !== undefined) {
					hostedFieldsInstance.addClass(braintreeFieldName, errorClass, function (addClassErr) {
						if (options.debug && addClassErr) console.error(addClassErr);
					});
					hostedFieldsInstance.removeClass(braintreeFieldName, validClass, function (removeClassErr) {
						if (options.debug && removeClassErr) console.error(removeClassErr);
					});
				// the form may include non-hosted (non-Braintree) fields; use jQuery validation plugin's default implementation
				} else {
					defaultHighlightFn(element, errorClass, validClass);
				}
			}
		} else if (options.debug) {
			console.warn('You are overriding braintree-validation\'s default implementation of highlight(). Please refer to the library\'s GitHub documentation if you have not already done so.');
		}
		if (!options.unhighlight) {
			validator.settings.unhighlight = function(element, errorClass, validClass) {
				if (getFieldNameFromFrameElement(element) !== undefined) {
					hostedFieldsInstance.removeClass(getFieldNameFromFrameElement(element), errorClass, function (removeClassErr) {
						if (options.debug && removeClassErr) console.error(removeClassErr);
					});
					hostedFieldsInstance.addClass(getFieldNameFromFrameElement(element), validClass, function (addClassErr) {
						if (options.debug && addClassErr) console.error(addClassErr);
					});
				// the form may include non-hosted (non-Braintree) fields; use jQuery validation plugin's default implementation
				} else {
					defaultUnhighlightFn(element, errorClass, validClass);
				}
			}
		} else if (options.debug) {
			console.warn('You are overriding braintree-validation\'s default implementation of unhighlight(). Please refer to the library\'s GitHub documentation if you have not already done so.');
		}
		
		// override the default implementation of required() so that eager validation works even pre-submission
		$.validator.addMethod('required', function(value, element, param) {
			var braintreeField = getFieldFromFrameElement(element);
			if (braintreeField !== undefined) {
				return !braintreeField.isEmpty;
			} else {
				return defaultRequiredFn.call(validator, value, element, param);
			}
		});
		
		// jQuery validation introduces additional pseudo selectors; override these to work with Braintree as well 
		var defaultBlankImplementation = $.expr.pseudos.blank;
		$.expr.pseudos.blank = function(element) {
			var braintreeField = getFieldFromFrameElement(element);
			if (braintreeField !== undefined) {
				return braintreeField.isEmpty;
			}
			return defaultBlankImplementation(element);
		};
		
		var defaultFilledImplementation = $.expr.pseudos.filled;
		$.expr.pseudos.filled = function(element) {
			var braintreeField = getFieldFromFrameElement(element);
			if (braintreeField !== undefined) {
				return !braintreeField.isEmpty;
			}
			return defaultFilledImplementation(element);
		};
		
		return validator;
	};
	
	return hostedFields;
}));