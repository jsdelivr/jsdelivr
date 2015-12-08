/**
 * @preserve
 * 
 * CIVEM v0.0.7
 *
 * Copyright 2012, Hannu Leinonen <hleinone@gmail.com>
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function() {
	function getInputHandler(inputCallback) {
		return function(event) {
			if (event.target.type.toUpperCase() === "RADIO") {
				var radioGroup = document.getElementsByName(event.target.name)
				for (i = 0; i < radioGroup.length; i++) {
					radioGroup[i].setCustomValidity("");
				}
			} else {
				event.target.setCustomValidity("");
			}
			if (inputCallback) {
				inputCallback(event);
			}
			event.target.checkValidity();
		};
	}

	function getInvalidHandler(invalidCallback) {
		return function(event) {
			var element = event.target;
			var validity = element.validity;
			var suffix = validity.valueMissing ? "value-missing" : validity.typeMismatch ? "type-mismatch" : validity.patternMismatch ? "pattern-mismatch" : validity.tooLong ? "too-long" : validity.rangeUnderflow ? "range-underflow" : validity.rangeOverflow ? "range-overflow" : validity.stepMismatch ? "step-mismatch" : validity.customError ? "custom-error" : "";
			var specificErrormessage, genericErrormessage;
			if (suffix && (specificErrormessage = element.getAttribute("data-errormessage-" + suffix))) {
				element.setCustomValidity(specificErrormessage);
			} else if (genericErrormessage = element.getAttribute("data-errormessage")) {
				element.setCustomValidity(genericErrormessage);
			} else {
				element.setCustomValidity(element.validationMessage);
			}
			if (invalidCallback) {
				invalidCallback(event);
			}
		};
	}

	var civem = function() {
		var formElements = [];
		var inputElements = document.getElementsByTagName("input");
		var i;
		for (i = 0; i < inputElements.length; i++) {
			formElements.push(inputElements[i]);
		}
		var textareaElements = document.getElementsByTagName("textarea");
		for (i = 0; i < textareaElements.length; i++) {
			formElements.push(textareaElements[i]);
		}
		var selectElements = document.getElementsByTagName("select");
		for (i = 0; i < selectElements.length; i++) {
			formElements.push(selectElements[i]);
		}
		for (i = 0; i < formElements.length; i++) {
			var formElement = formElements[i];
			if (!formElement.willValidate) {
				continue;
			}
			console.log(formElement.tagName);
			if (formElement.tagName.toUpperCase() === "SELECT" || formElement.type.toUpperCase() === "RADIO" || formElement.type.toUpperCase() === "CHECKBOX") {
				formElement.onchange = getInputHandler(formElement.onchange);
			} else {
				formElement.oninput = getInputHandler(formElement.oninput);
			}
			formElement.oninvalid = getInvalidHandler(formElement.oninvalid);
		}
	};

	if (window.addEventListener) {
		window.addEventListener("load", civem, false);
	} else if (window.attachEvent) {
		window.attachEvent("onload", civem);
	}
}());
