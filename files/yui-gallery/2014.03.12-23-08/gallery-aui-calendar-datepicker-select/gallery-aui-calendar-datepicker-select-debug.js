YUI.add('gallery-aui-calendar-datepicker-select', function(A) {

/**
 * The DatePickerSelect Utility
 *
 * @module aui-calendar
 * @submodule aui-calendar-datepicker-select
 */

var L = A.Lang,
	isArray = L.isArray,

	nodeSetter = function(v) {
		return A.one(v);
	},

	createSelect = function() {
		return A.Node.create(SELECT_TPL);
	},

	APPEND_ORDER = 'appendOrder',
	BASE_NAME = 'baseName',
	BLANK = '',
	BODY = 'body',
	BUTTON = 'button',
	CALENDAR = 'calendar',
	CLEARFIX = 'clearfix',
	CURRENT_DAY = 'currentDay',
	CURRENT_MONTH = 'currentMonth',
	CURRENT_YEAR = 'currentYear',
	DATA_COMPONENT_ID = 'data-auiComponentID',
	DATEPICKER = 'datepicker',
	DATE_FORMAT = 'dateFormat',
	DAY = 'day',
	DAY_FIELD = 'dayField',
	DAY_FIELD_NAME = 'dayFieldName',
	DISPLAY = 'display',
	DISPLAY_BOUNDING_BOX = 'displayBoundingBox',
	DOT = '.',
	HELPER = 'helper',
	MAX_DATE = 'maxDate',
	MIN_DATE = 'minDate',
	MONTH = 'month',
	MONTH_FIELD = 'monthField',
	MONTH_FIELD_NAME = 'monthFieldName',
	NAME = 'name',
	OPTION = 'option',
	POPULATE_DAY = 'populateDay',
	POPULATE_MONTH = 'populateMonth',
	POPULATE_YEAR = 'populateYear',
	SELECT = 'select',
	SELECTED = 'selected',
	TRIGGER = 'trigger',
	WRAPPER = 'wrapper',
	YEAR = 'year',
	YEAR_FIELD = 'yearField',
	YEAR_FIELD_NAME = 'yearFieldName',
	YEAR_RANGE = 'yearRange',

	getCN = A.ClassNameManager.getClassName,

	CSS_DATEPICKER = getCN(DATEPICKER),
	CSS_DATEPICKER_BUTTON_WRAPPER = getCN(DATEPICKER, BUTTON, WRAPPER),
	CSS_DATEPICKER_DAY = getCN(DATEPICKER, DAY),
	CSS_DATEPICKER_DISPLAY = getCN(DATEPICKER, DISPLAY),
	CSS_DATEPICKER_MONTH = getCN(DATEPICKER, MONTH),
	CSS_DATEPICKER_SELECT_WRAPPER = getCN(DATEPICKER, SELECT, WRAPPER),
	CSS_DATEPICKER_YEAR = getCN(DATEPICKER, YEAR),
	CSS_HELPER_CLEARFIX = getCN(HELPER, CLEARFIX),

	SELECT_TPL = '<select></select>',
	SELECT_OPTION_TPL = '<option></option>',
	DISPLAY_BOUNDING_BOX_TPL = '<div></div>',
	WRAPPER_BUTTON_TPL = '<div class="'+ CSS_DATEPICKER_BUTTON_WRAPPER +'"></div>',
	WRAPPER_SELECT_TPL = '<div class='+ CSS_DATEPICKER_SELECT_WRAPPER +'></div>';

/**
 * <p><img src="assets/images/aui-calendar-datepicker-select/main.png"/></p>
 *
 * A base class for DatePickerSelect, providing:
 * <ul>
 *    <li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *    <li>Select a date from Calendar to select elements</li>
 * </ul>
 *
 * Quick Example:<br/>
 *
 * <pre><code>var instance = new A.DatePickerSelect({
 *  displayBoundingBox: '#displayBoundingBoxId',
 *  // locale: 'pt-br',
 *  dateFormat: '%m/%d/%y',
 *  yearRange: [ 1970, 2009 ]
 * }).render();
 * </code></pre>
 *
 * Check the list of <a href="DatePickerSelect.html#configattributes">Configuration Attributes</a> available for
 * DatePickerSelect.
 *
 * @class DatePickerSelect
 * @param config {Object} Object literal specifying widget configuration properties.
 * @constructor
 * @extends Calendar
 */
var DatePickerSelect = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property DatePickerSelect.NAME
		 * @type String
		 * @static
		 */
		NAME: DATEPICKER,

		/**
		 * Static property used to define the default attribute
		 * configuration for the DatePickerSelect.
		 *
		 * @property DatePickerSelect.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			/**
			 * The order the selects elements are appended to the
	         * <a href="DatePickerSelect.html#config_displayBoundingBox">displayBoundingBox</a>.
			 *
			 * @attribute appendOrder
			 * @default [ 'm', 'd', 'y' ]
			 * @type Array
			 */
			appendOrder: {
				value: [ 'm', 'd', 'y' ],
				validator: isArray
			},

			/**
			 * A basename to identify the select elements from this
	         * DatePickerSelect.
			 *
			 * @attribute baseName
			 * @default datepicker
			 * @type String
			 */
			baseName: {
				value: DATEPICKER
			},

			/**
			 * The container
	         * <a href="Widget.html#config_boundingBox">boundingBox</a> to house the
	         * selects and button. The
	         * <a href="Widget.html#config_boundingBox">boundingBox</a> attribute is
	         * used on the Calendar Overlay.
			 *
			 * @attribute displayBoundingBox
			 * @default null
			 * @type {Node | String}
			 */
			displayBoundingBox: {
				value: null,
				setter: nodeSetter
			},

			/**
			 * HTML element to receive the day value when a date is selected.
			 *
			 * @attribute dayField
			 * @default Generated HTML select element
			 * @type {Node | String}
			 */
			dayField: {
				setter: nodeSetter,
				valueFn: createSelect
			},

			/**
			 * HTML element to receive the month value when a date is selected.
			 *
			 * @attribute monthField
			 * @default Generated HTML select element
			 * @type {Node | String}
			 */
			monthField: {
				setter: nodeSetter,
				valueFn: createSelect
			},

			/**
			 * HTML element to receive the year value when a date is selected.
			 *
			 * @attribute yearField
			 * @default Generated HTML select element
			 * @type {Node | String}
			 */
			yearField: {
				setter: nodeSetter,
				valueFn: createSelect
			},

			/**
			 * Name attribute used on the
	         * <a href="DatePickerSelect.html#config_dayField">dayField</a>.
			 *
			 * @attribute dayFieldName
			 * @default day
			 * @type String
			 */
			dayFieldName: {
				value: DAY
			},

			/**
			 * Name attribute used on the
	         * <a href="DatePickerSelect.html#config_monthField">monthField</a>.
			 *
			 * @attribute monthFieldName
			 * @default month
			 * @type String
			 */
			monthFieldName: {
				value: MONTH
			},

			/**
			 * Name attribute used on the
	         * <a href="DatePickerSelect.html#config_yearField">yearField</a>.
			 *
			 * @attribute yearFieldName
			 * @default year
			 * @type String
			 */
			yearFieldName: {
				value: YEAR
			},

			/**
			 * Trigger element to open the calendar. Inherited from
	         * <a href="OverlayContext.html#config_trigger">OverlayContext</a>.
			 *
			 * @attribute trigger
			 * @default Generated HTLM div element
			 * @type {Node | String}
			 */
			trigger: {
				valueFn: function() {
					return A.Node.create(WRAPPER_BUTTON_TPL).cloneNode();
				}
			},

			/**
			 * If true the Calendar is visible by default after the render phase.
	         * Inherited from
	         * <a href="OverlayContext.html#config_trigger">OverlayContext</a>.
			 *
			 * @attribute visible
			 * @default false
			 * @type boolean
			 */
			visible: {
				value: false
			},

			/**
			 * Year range to be displayed on the year select element. By default
	         * it displays from -10 to +10 years from the current year.
			 *
			 * @attribute yearRange
			 * @default [ year - 10, year + 10 ]
			 * @type Array
			 */
			yearRange: {
				valueFn: function() {
					var year = new Date().getFullYear();

					return [ year - 10, year + 10 ];
				},
				validator: isArray
			},

			/**
			 * Inherited from
	         * <a href="Calendar.html#config_setValue">Calendar</a>.
			 *
			 * @attribute setValue
			 * @default false
			 * @type boolean
			 */
			setValue: {
				value: false
			},

			/**
			 * If true the select element for the days will be automatic
	         * populated.
			 *
			 * @attribute populateDay
			 * @default true
			 * @type boolean
			 */
			populateDay: {
				value: true
			},

			/**
			 * If true the select element for the month will be automatic
	         * populated.
			 *
			 * @attribute populateMonth
			 * @default true
			 * @type boolean
			 */
			populateMonth: {
				value: true
			},

			/**
			 * If true the select element for the year will be automatic
	         * populated.
			 *
			 * @attribute populateYear
			 * @default true
			 * @type boolean
			 */
			populateYear: {
				value: true
			}
		},

		EXTENDS: A.Calendar,

		prototype: {
			/**
			 * Create the DOM structure for the DatePickerSelect. Lifecycle.
			 *
			 * @method renderUI
			 * @protected
			 */
			renderUI: function() {
				var instance = this;

				DatePickerSelect.superclass.renderUI.apply(this, arguments);

				instance._renderElements();
				instance._renderTriggerButton();
			},

			/**
			 * Bind the events on the DatePickerSelect UI. Lifecycle.
			 *
			 * @method bindUI
			 * @protected
			 */
			bindUI: function() {
				var instance = this;

				DatePickerSelect.superclass.bindUI.apply(this, arguments);

				instance.after('datesChange', instance._selectCurrentValues);
				instance.after('currentMonthChange', instance._afterSetCurrentMonth);
				instance.after('disabledChange', instance._afterDisabledChangeDatePicker);

				instance._bindSelectEvents();
			},

			/**
			 * Sync the DatePickerSelect UI. Lifecycle.
			 *
			 * @method syncUI
			 * @protected
			 */
			syncUI: function() {
				var instance = this;

				DatePickerSelect.superclass.syncUI.apply(this, arguments);

				instance._pupulateSelects();
				instance._selectCurrentValues();
			},

			/**
			 * Fired after
		     * <a href="DatePickerSelect.html#config_disabled">disabled</a> is set.
			 *
			 * @method _afterDisabledChangeDatePicker
			 * @param {EventFacade} event
			 * @protected
			 */
			_afterDisabledChangeDatePicker: function(event) {
				var instance = this;

				var disabled = event.newVal;

				instance.get(DAY_FIELD).set('disabled', disabled);
				instance.get(MONTH_FIELD).set('disabled', disabled);
				instance.get(YEAR_FIELD).set('disabled', disabled);
			},

			/**
			 * Gets an Array with the field elements in the correct order defined
		     * on <a href="DatePickerSelect.html#config_appendOrder">appendOrder</a>.
			 *
			 * @method _getAppendOrder
			 * @protected
			 * @return {Array}
			 */
			_getAppendOrder: function() {
				var instance = this;
				var appendOrder = instance.get(APPEND_ORDER);

				var mapping = {
					d: instance.get(DAY_FIELD),
					m: instance.get(MONTH_FIELD),
					y: instance.get(YEAR_FIELD)
				};

				var firstField = mapping[ appendOrder[0] ];
				var secondField = mapping[ appendOrder[1] ];
				var thirdField = mapping[ appendOrder[2] ];

				var id = instance.get('id');

				firstField.setAttribute(DATA_COMPONENT_ID, id);
				secondField.setAttribute(DATA_COMPONENT_ID, id);
				thirdField.setAttribute(DATA_COMPONENT_ID, id);

				return [ firstField, secondField, thirdField ];
			},

			/**
			 * Render DOM elements for the DatePickerSelect.
			 *
			 * @method _renderElements
			 * @protected
			 */
			_renderElements: function() {
				var instance = this;
				var displayBoundingBox = instance.get(DISPLAY_BOUNDING_BOX);

				if (!displayBoundingBox) {
					displayBoundingBox = A.Node.create(DISPLAY_BOUNDING_BOX_TPL);

					instance.set(DISPLAY_BOUNDING_BOX, displayBoundingBox);

					A.one(BODY).append(displayBoundingBox);
				}

				var dayField = instance.get(DAY_FIELD);
				var monthField = instance.get(MONTH_FIELD);
				var yearField = instance.get(YEAR_FIELD);

				dayField.addClass(CSS_DATEPICKER_DAY);
				monthField.addClass(CSS_DATEPICKER_MONTH);
				yearField.addClass(CSS_DATEPICKER_YEAR);

				displayBoundingBox.addClass(CSS_DATEPICKER);
				displayBoundingBox.addClass(CSS_DATEPICKER_DISPLAY);
				displayBoundingBox.addClass(CSS_HELPER_CLEARFIX);

				instance._selectWrapper = A.Node.create(WRAPPER_SELECT_TPL);

				// setting name of the fields
				monthField.set(NAME, instance.get(MONTH_FIELD_NAME));
				yearField.set(NAME, instance.get(YEAR_FIELD_NAME));
				dayField.set(NAME, instance.get(DAY_FIELD_NAME));

				// append elements
				var orderedFields = instance._getAppendOrder();

				instance._selectWrapper.append(orderedFields[0]);
				instance._selectWrapper.append(orderedFields[1]);
				instance._selectWrapper.append(orderedFields[2]);

				displayBoundingBox.append( instance._selectWrapper );
			},

			/**
			 * Render DOM element for the trigger button of the DatePickerSelect.
			 *
			 * @method _renderTriggerButton
			 * @protected
			 */
			_renderTriggerButton: function() {
				var instance = this;
				var trigger = instance.get(TRIGGER).item(0);
				var displayBoundingBox = instance.get(DISPLAY_BOUNDING_BOX);

				instance._buttonItem = new A.ButtonItem(CALENDAR);

				displayBoundingBox.append(trigger);

				trigger.setAttribute(DATA_COMPONENT_ID, instance.get('id'));

				if ( trigger.test(DOT+CSS_DATEPICKER_BUTTON_WRAPPER) ) {
					// use Button if the user doesn't specify a trigger
					instance._buttonItem.render(trigger);
				}
			},

			/**
			 * Bind events on each select element (change, keypress, etc).
			 *
			 * @method _bindSelectEvents
			 * @protected
			 */
			_bindSelectEvents: function() {
				var instance = this;
				var selects = instance._selectWrapper.all(SELECT);

				selects.on('change', A.bind(instance._onSelectChange, instance));
				selects.on('keypress', A.bind(instance._onSelectChange, instance));
			},

			/**
			 * Select the current values for the day, month and year to the respective
		     * input field.
			 *
			 * @method _selectCurrentValues
			 * @protected
			 */
			_selectCurrentValues: function() {
				var instance = this;

				instance._selectCurrentDay();
				instance._selectCurrentMonth();
				instance._selectCurrentYear();
			},

			/**
			 * Select the current day on the respective input field.
			 *
			 * @method _selectCurrentDay
			 * @protected
			 */
			_selectCurrentDay: function() {
				var instance = this;
				var currentDate = instance.getCurrentDate();

				instance.get(DAY_FIELD).val(
					String(currentDate.getDate())
				);
			},

			/**
			 * Select the current month on the respective input field.
			 *
			 * @method _selectCurrentMonth
			 * @protected
			 */
			_selectCurrentMonth: function() {
				var instance = this;
				var currentDate = instance.getCurrentDate();

				instance.get(MONTH_FIELD).val(
					String(currentDate.getMonth())
				);
			},

			/**
			 * Select the current year on the respective input field.
			 *
			 * @method _selectCurrentYear
			 * @protected
			 */
			_selectCurrentYear: function() {
				var instance = this;
				var currentDate = instance.getCurrentDate();

				instance.get(YEAR_FIELD).val(
					String(currentDate.getFullYear())
				);
			},

			/**
			 * Populate each select element with the correct data for the day, month
		     * and year.
			 *
			 * @method _pupulateSelects
			 * @protected
			 */
			_pupulateSelects: function() {
				var instance = this;

				instance._populateDays();
				instance._populateMonths();
				instance._populateYears();

				// restricting dates based on the selects values
				var monthOptions = instance.get(MONTH_FIELD).all(OPTION);
				var yearOptions = instance.get(YEAR_FIELD).all(OPTION);

				var mLength = monthOptions.size() - 1;
				var yLength = yearOptions.size() - 1;

				var firstMonth = monthOptions.item(0).val();
				var firstYear = yearOptions.item(0).val();
				var lastMonth = monthOptions.item(mLength).val();
				var lastYear = yearOptions.item(yLength).val();

				var maxMonthDays = instance.getDaysInMonth(lastYear, lastMonth);

				var minDate = new Date(firstYear, firstMonth, 1);
				var maxDate = new Date(lastYear, lastMonth, maxMonthDays);

				instance.set(MAX_DATE, maxDate);
				instance.set(MIN_DATE, minDate);
			},

			/**
			 * Populate the year select element with the correct data.
			 *
			 * @method _populateYears
			 * @protected
			 */
			_populateYears: function() {
				var instance = this;
				var yearRange = instance.get(YEAR_RANGE);
				var yearField = instance.get(YEAR_FIELD);

				if (instance.get(POPULATE_YEAR)) {
					instance._populateSelect(yearField, yearRange[0], yearRange[1]);
				}
			},

			/**
			 * Populate the month select element with the correct data.
			 *
			 * @method _populateMonths
			 * @protected
			 */
			_populateMonths: function() {
				var instance = this;
				var monthField = instance.get(MONTH_FIELD);
				var localeMap = instance._getLocaleMap();
				var monthLabels = localeMap.B;

				if (instance.get(POPULATE_MONTH)) {
					instance._populateSelect(monthField, 0, (monthLabels.length - 1), monthLabels);
				}
			},

			/**
			 * Populate the day select element with the correct data.
			 *
			 * @method _populateDays
			 * @protected
			 */
			_populateDays: function() {
				var instance = this;
				var dayField = instance.get(DAY_FIELD);
				var daysInMonth = instance.getDaysInMonth();

				if (instance.get(POPULATE_DAY)) {
					instance._populateSelect(dayField, 1, daysInMonth);
				}
			},

			/**
			 * Populate a select element with the data passed on the params.
			 *
			 * @method _populateSelect
			 * @param {HTMLSelectElement} select Select to be populated
			 * @param {Number} fromIndex Index to start
			 * @param {Number} toIndex Index to end
			 * @param {Object} values Object with labels to be used as content of each
		     * option. Optional.
			 * @protected
			 * @return {String}
			 */
			_populateSelect: function(select, fromIndex, toIndex, labels, values) {
				var i = 0;
				var index = fromIndex;
				var instance = this;

				select.empty();
				labels = labels || [];
				values = values || [];

				while (index <= toIndex) {
					var value = values[index] || index;
					var label = labels[index] || index;

					A.Node.getDOMNode(select).options[i] = new Option(label, index);

					i++;
					index++;
				}
			},

			/**
			 * Fired on any select change.
			 *
			 * @method _onSelectChange
			 * @param {EventFacade} event
			 * @protected
			 */
			_onSelectChange: function(event) {
				var instance = this;
				var target = event.currentTarget || event.target;
				var monthChanged = target.test(DOT+CSS_DATEPICKER_MONTH);

				var currentDay = instance.get(DAY_FIELD).val();
				var currentMonth = instance.get(MONTH_FIELD).val();
				var currentYear = instance.get(YEAR_FIELD).val();

				instance.set(CURRENT_DAY, currentDay);
				instance.set(CURRENT_MONTH, currentMonth);
				instance.set(CURRENT_YEAR, currentYear);

				if (monthChanged) {
					instance._afterSetCurrentMonth();
				}

				instance._selectDate();
			},

			/**
			 * Fired after
		     * <a href="DatePickerSelect.html#config_currentMonth">currentMonth</a> is set.
			 *
			 * @method _afterSetCurrentMonth
			 * @param {EventFacade} event
			 * @protected
			 */
			_afterSetCurrentMonth: function(event) {
				var instance = this;

				instance._populateDays();
				instance._selectCurrentDay();
			}
		}
	}
);

A.DatePickerSelect = DatePickerSelect;


}, 'gallery-2010.06.07-17-52' ,{skinnable:true, requires:['gallery-aui-calendar-base','gallery-aui-button-item']});
