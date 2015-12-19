$.fn.dateRules = function(options) {
	/**
	*	Declare some global variables.
	*/
	var defaults, execute, rule, temp_date = [];

	/**
	*	The default options in the dateRules method.
	*	These are some of the possible use cases i could think of.
	*/
	defaults = {
		selected: function(date) {
			if(options.hasOwnProperty('selections') && options.selections instanceof Array) {
				if(temp_date.length == 0) {
					// Had to convert date to timestamp value or else inArray won't work. 
					for(var selection in options.selections) {
						temp_date.push(options.selections[selection].getTime());
					}
				}
				return $.inArray(date.getTime(),temp_date) != -1;
			} else {
				return false;
			}
		},
		noWeekEnd: function(date) {
			return date.getDay() != 0 && date.getDay() != 6;
		},
		onlyWeekEnd: function(date) {
			return date.getDay() == 0 || date.getDay() == 6;
		},
		evenDays: function(date) {
			return date.getDate() % 2 == 0;
		},
		oddDays: function(date) {
			return date.getDate() % 2 != 0;
		},
		evenMonths: function(date) {
			return (date.getMonth() + 1) % 2 == 0;
		},
		oddMonths: function(date) {
			return (date.getMonth() + 1) % 2 != 0;
		}
	};
	/**
	*	Executes the rules and return if the date is valid.
	*/
	execute = function(date) {

		var valid = true;
		// Execute all rules.
		for(var i in rule) {
			if(defaults.hasOwnProperty(rule[i])) {
				if(!defaults[rule[i]](date)) {
					valid = false;
				}
			}
		}
		// Execute custom rule if given.
		if(options.hasOwnProperty('custom')) {
			if(!options.custom(date)) {
				valid = false;
			}
		}
		// Should return an array with true or false as per datepicker's guidelines.
		return [valid];
	};

	/**
	*	Check if the element has datepicker.
	*/
	if(this.hasClass('hasDatepicker')) {
		/**
		*	Get rule property from options and assign it to datepicker.
		*/
		if(options.hasOwnProperty('rule')) {
			rule = options.rule;
			// If a single rule is given, assign it to an array.
			if(!(rule instanceof Array)) {
				rule = [rule];
			}

			// Assign the rules check function to datepicker's beforeShowDay function.
			this.datepicker('option','beforeShowDay', execute);
		}
	}

	// Return current instance to enable jquery chaining.
	return this;
};
