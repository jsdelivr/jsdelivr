YUI.add('gallery-querybuilder-extras', function(Y) {

/**
 * @module gallery-querybuilder-extras
 */

/**********************************************************************
 * <p>Plugin for choosing from a yui3-calendar.  In the
 * <code>var_list</code> configuration, specify <code>value_list</code> as
 * a list of objects, each defining <code>value</code> and
 * <code>text</code>.</p>
 *
 * <p>There must be exactly one operator specified for this plugin.</p>
 *
 *
 *  <p>At present John Lindal's  Y.QueryBuilder does not support calendar
 *  Creating plugin to QueryBuilder to have support
 *  @see http://yuilibrary.com/forum/viewtopic.php?p=30478#p30478
 *  </p>
 * @author mzgupta
 * @namespace QueryBuilder
 * @class Calendar
 */

var Lang = Y.Lang, has_bubble_problem = (0 < Y.UA.ie && Y.UA.ie < 9), dtdate = Y.DataType.Date;

Y.QueryBuilder.Calendar = function(
/* object */query_builder,
/* object */config) {
	this.qb = query_builder;
	this.op_menu_name_pattern = config.field_prefix + 'query_op_{i}';
	this.val_input_name_pattern = config.field_prefix + 'query_val_{i}_c{j}';
};

Y.QueryBuilder.Calendar.prototype = {
	create : function(
	/* int    */query_index,
	/* object */var_config,
	/* array  */op_list,
	/* array  */value) {
		var op_cell, value_cell1, value_cell2;
		op_cell = this.qb._createContainer();
		op_cell.set('className', this.qb.getClassName('operator'));
		op_cell.set('innerHTML', this._operationsMenu(this
				.operationName(query_index)));
		this.op_menu = op_cell.one('select');
		this.date_format = var_config.date_format || "%m/%d/%Y";

		this.value_input = [];

		/* Array to keep Normalized Javascipt date object */
		this.value_input_normalized = [];

		var options = Y.Node.getDOMNode(this.op_menu).options;

		for ( var i = 0; i < op_list.length; i++) {
			options[i] = new Option(op_list[i].text, op_list[i].value);
		}

		value = value || [ '', '' ];
		if (value[0]) {
			this.op_menu.set('value', value[0]);
		}

		if (has_bubble_problem) {
			this.op_menu.on('change', this.qb._notifyChanged, this.qb);
		}

		this._createDateRangeCalendar(var_config);

		// Input box one for first calendar
		var dt_value1 = value[1] || var_config.start_date; 
		var dt_value2 = value[2] || var_config.end_date;  
		if(value[2]){
			visible = true;
		}
		else {
			visible = op_list[0].multipleValue;
		}

		value_cell1 = this._createCellValue(query_index, var_config, op_list,
				value, dt_value1, true, 0);
		value_cell2 = this._createCellValue(query_index, var_config, op_list,
				value, dt_value2, visible, 1);

		var self = this;
		this.op_menu.on('change', function() {
			var operationSelected = this.get("value");
			for (i = 0; i < op_list.length; i++) {
				if (operationSelected === op_list[i].value) {
					if (op_list[i].multipleValue) {
						self.value_input[1].setStyle("display", "inherit");
						self.hasMultipleSelection = true;
					} else {
						self.value_input[1].setStyle("display", "none");
						self.hasMultipleSelection = false;
					}
				}
			}
		});

		//if selected operator does not require multiple value then hide second inputbox
		return [ op_cell, value_cell1, value_cell2 ];
	},

	postCreate : function(
	/* int */query_index,
	/* object */var_config,
	/* array */op_list,
	/* array */value) {
	},
	validate : function() {
		if (!this.hasMultipleSelection) {
			return true;
		}
		if (this.value_input_normalized[0] > this.value_input_normalized[1]) {
			this.qb.displayFieldMessage(this.value_input[0],
					"Please select a valid date range", "error");
			return false;
		}
		return true;
	},
	destroy : function() {
		this.op_menu = null;
		for ( var i = 0; i < this.value_input; i++) {
			this.value_input[i] = null;
		}
	},

	updateName : function(
	/* int */new_index) {
		this.op_menu.setAttribute('name', this.operationName(new_index));
		for ( var i = 0; i < this.value_input; i++) {
			this.value_input[i].setAttribute('name', this.valueName(new_index,
					i));
		}

	},

	set : function(
	/* int */query_index,
	/* map */data) {
		this.op_menu.set('value', data[this.operationName(query_index)]);
		for ( var i = 0; i < this.value_input; i++) {
			this.value_input[i].set('value', data[this
					.valueName(query_index, 1)]);
		}

	},

	toDatabaseQuery : function() {
		var values = [ this.value_input[0].get('value') ];
		if (this.hasMultipleSelection) {
			values.push(this.value_input[1].get('value'));
		}
		return [ [ this.op_menu.get('value'), values ] ];
	},

	/* *********************************************************************
	 * Form element names.
	 */

	operationName : function(
	/* int */i) {
		return Y.Lang.sub(this.op_menu_name_pattern, {
			i : i
		});
	},

	valueName : function(
	/* int */i,
	/* int */j) {
		return Y.Lang.sub(this.val_input_name_pattern, {
			i : i,
			j : j
		});
	},

	//
	// Markup
	//

	_operationsMenu : function(
	/* string */menu_name) {
		// This must use a select tag!

		var markup = '<select name="{n}" class="{f} {c}" />';

		return Y.Lang.sub(markup, {
			n : menu_name,
			f : Y.FormManager.field_marker_class,
			c : this.qb.getClassName('field')
		});
	},

	_valueInput : function(
	/* string */input_name,
	/* string */validation_class) {
		// This must use an input tag!

		var markup = '<input type="text" name="{n}" class="yiv-required {f} {c}"/>';

		return Y.Lang.sub(markup, {
			n : input_name,
			f : Y.FormManager.field_marker_class,
			c : validation_class + ' ' + this.qb.getClassName('field')
		});
	},
	_createCellValue : function(
	/* int */query_index,
	/* Object */var_config,
	/* Object */op_list,
	/* Object */value,
	/* Date */default_date,
	/* boolean */visible,
	/* int */index) {

		var value_cell, input_html;
		default_date = default_date || new Date();
		value_cell = this.qb._createContainer();
		input_html = this._valueInput(this.valueName(query_index, 0),
				var_config.validation);
		value_cell.set('className', this.qb.getClassName('value'));
		value_cell.set('innerHTML', input_html);

		this.value_input[index] = value_cell.one('input');
		this.value_input[index].set('value', value[1]); // avoid formatting
		this.value_input[index].set('value', dtdate.format(default_date, {
			format : this.date_format
		}));
		this.value_input_normalized[index] = default_date;
		this.value_input[index].on("click", Y.bind(this._showCalendarOverlay,
				this, index));

		if (!visible) {
			this.value_input[index].setStyle("display", "none");
			this.hasMultipleSelection = false;
		}

		return value_cell;
	},
	_showCalendarOverlay : function(/* int */index) {
		/*
		 *  This event handler function will always get called before _updateTheFocusedInputBox 
		 *  It will make sure which input box need to be updated
		 * */
		var WidgetPositionAlign;
		WidgetPositionAlign = Y.WidgetPositionAlign;
		var overlay = this.qb.dateRangeCalendar.overlay;
		overlay.show();
		overlay.set("align", {
			node : this.value_input[index],
			points : [ WidgetPositionAlign.TC, WidgetPositionAlign.RC ]
		});

		//Deselect all the date present in calendar
		this.qb.dateRangeCalendar.calendar.deselectDates();

		//Node in focus that will get updated when user make date selection from calendar attached to static property of QueryBuilder 
		this.qb.focusedInputBox = this.value_input[index];

		//Attached Normalized value of date for given input box of criterion row to static property of qb so that it will be updated with recent selection  
		this.qb.value_input_normalized = this.value_input_normalized;
		this.qb.focusedIndex = index;

	},
	_createDateRangeCalendar : function(/* object */var_config) {
		//Variable definition;
		var calendar_config, default_calendar_config, calendar, overlay;

		calendar_config = var_config.calendar_config || {};

		if (this.qb.dateRangeCalendar) {
			return

		}

		default_calendar_config = {
			height : "215px",
			width : "200px",
			visible : true,
			showPrevMonth : true,
			showNextMonth : true,
			date : new Date()
		};
		for (key in default_calendar_config) {
			calendar_config[key] = calendar_config[key]
					|| default_calendar_config[key];
		}

		//Instantiate the YUI3 calendar
		calendar = new Y.Calendar(calendar_config).render();

		//Instantiate the YUI3 Overlay and set calendar in the body of overlay
		overlay = new Y.Overlay({
			height : var_config.height,
			width : var_config.width,
			visible : false
		});
		overlay.render();
		overlay.plug(Y.Plugin.OverlayAutohide);
		overlay.set("bodyContent", calendar.get("boundingBox"));
		overlay.get("boundingBox").addClass("yui3-querybuilder-extras");

		//Store the instance in QueryBuilder 
		this.qb.dateRangeCalendar = {
			overlay : overlay,
			calendar : calendar
		};
		//subscribing selectionChange method of calendar and putting selected date to inputbox on focus
		calendar.on("selectionChange", this._updateTheFocusedInputBox, this);

	},
	_updateTheFocusedInputBox : function( /* Object */event) {
		/*
		 *  This event handler function must always get called after _showCalendarOverlay 
		 *  It will update the input in focus
		 * */
		var newDate = event.newSelection[0];
		if (newDate && this.qb.dateRangeCalendar) {
			this.qb.value_input_normalized[this.qb.focusedIndex] = newDate;
			this.qb.focusedInputBox.set("value", dtdate.format(newDate, {
				format : this.date_format
			}));
			this.qb.dateRangeCalendar.overlay.hide();
		}
	},
	getCalendar : function() {
		return this.qb.dateRangeCalendar.calendar;
	},
	getOverlay : function() {
		return this.qb.dateRangeCalendar.overlay;
	}
};

//Add Calendar mapping also
Y.QueryBuilder.plugin_mapping.calendar = Y.QueryBuilder.Calendar;


}, 'gallery-2012.08.08-20-03' ,{requires:['calendar','datatype-date','gallery-overlay-extras','gallery-querybuilder'], skinnable:true});
