YUI.add('gallery-popup-calendar', function(Y) {

/*
 * The Popup Calendar extends the YUI Calendar component
 * to add popup functionality to input forms.
 *
 * @module popup-calendar
 * @class PopupCalendar
 * @extends Calendar
 */

var INPUT = 'input',
    TABINDEX = "tabindex";

Y.PopupCalendar = Y.Base.create('popup-calendar', Y.Calendar, [Y.WidgetPosition, Y.WidgetPositionAlign, Y.WidgetAutohide], {

    /*
     * Adds tabindex to input elements if flag is set
     *
     * @method initializer
     * @private
     */
    initializer: function(cfg) {
            var input = cfg.input,
            minDataDate = input.getData('min-date'),
            maxDataDate = input.getData('max-date'),
            minDate, maxDate;

        this._bindEvents();
        this.setHideOn();

        this.set('tabIndex', 0);

        if(this.get('autoTabIndexFormElements')) {
            this.get(INPUT).ancestor('form').all(INPUT).setAttribute(TABINDEX, '1');
        }

        if (minDataDate) {
            minDate = this.normalizeIsoDate(minDataDate);
            this.set('startDate', minDate);
            this.set('minimumDate', minDate);

            if (!cfg.date) {
                this.set('date', new Date(minDate));
            }
        }

        if (maxDataDate) {
            maxDate = this.normalizeIsoDate(maxDataDate);
            this.set('maximumDate', maxDate);
            this.set('endDate', maxDate);
        }

        this.set('customRenderer', {
            rules: this._buildDisabledRule(),
            filterFunction: this.filterFunction
        });
    },

    /*
     * Normalizes the date for cross browser support
     *
     * @method normalizeIsoDate
     * @public
     */
    normalizeIsoDate: function(date) {
        var dateString = date.replace(/-/g, '/'),
            normalizedDate;

        normalizedDate = new Date(dateString);

        if (normalizedDate == "Invalid Date" || isNaN(normalizedDate)) {
            return new Date();
        }

        return normalizedDate
    },

    /*
     * Binds events used by the module
     *
     * @method _bindEvents
     * @private
     */
    _bindEvents: function() {

        var input = this.get(INPUT);

        input.on('focus', this.showCalendar, this);
        input.on('keydown', this.testKey, this);
        this.on('selectionChange', this._emitDate, this);
        this.after('autoFocusOnFieldFocusChange', this.setHideOn, this);
    },


    /*
     * Sets correct tabindex on popup calendar
     *
     * @method _setPopupTabindex
     * @private
     */
    _setPopupTabindex: function() {

        var input = this.get(INPUT),
            inputTabIndex = input.getAttribute(TABINDEX);

        this.get(INPUT).insert(this.get('boundingBox'), 'after');

        if (inputTabIndex === "") { inputTabIndex = "0"; }
        this.get('boundingBox').setAttribute(TABINDEX, inputTabIndex);
    },

    /*
     * Emits the selected date event
     *
     * @method _emitDate
     * @param e {object} selectionChange event object from Calendar
     * @private
     */
    _emitDate: function(e) {

        this.fire('dateSelected', e);
        this.hideCalendar();
    },

    /*
     * Tests the keycode on keydown to determine when to hide the calendar
     *
     * @method _testKey
     * @param e {object} keydown event from the input
     * @private
     */
    _testKey: function(e) {

        if (e.keyCode === 9) { this.hideCalendar(); }
    },

    /*
     * Builds the disabled dates rule because Calendar doesn't do this automatically
     *
     * @method _buildDisabledRule
     * @param date {object} javascript date object
     * @param type {string} 'start' or 'end' used for popup-calendar group
     * @private
     */
    _buildDisabledRule: function(date, type) {

        var min = this.get('startDate'),
            max = this.get('endDate'),
            rules = {}, dayRule = "", minDayRule = "",
            day, month, year, minDay, minMonth, minYear, maxDay, maxMonth, maxYear;

        if (min !== null) {
            minDay = min.getUTCDate();
            minMonth = min.getUTCMonth();
            minYear = min.getUTCFullYear();
        }

        if (max !== null) {
            maxDay = max.getUTCDate();
            maxMonth = max.getUTCMonth();
            maxYear = max.getUTCFullYear();
        }

        if (type) {

            day = date.getUTCDate() + '';
            month = date.getUTCMonth() + '';
            year = date.getUTCFullYear() + '';

            rules[year] = {};
            rules[year][month] = {};

            if (type === "start") {

                dayRule = day + "-31";
                if (minDay != 1 && minMonth == month) {
                    dayRule = "1-" + (minDay-1) + "," + dayRule;
                }

            } else if (type === "end") {

                if (minDay > day && minMonth == month) {
                    day = minDay;
                }
                dayRule = "1-" + (day-1);

            }

            rules[year][month][dayRule] = "disabledDates";

        }

        rules[minYear] = rules[minYear] || {};
        rules[maxYear] = rules[maxYear] || {};

        rules[minYear][minMonth] = rules[minYear][minMonth] || {};
        rules[maxYear][maxMonth] = rules[minYear][maxMonth] || {};

        minDayRule = '1-' + (minDay-1);
        maxDayRule = (maxDay+1) + '-31';

        rules[minYear][minMonth][minDayRule] = "disabledDates";
        rules[maxYear][maxMonth][maxDayRule] = "disabledDates";

        return rules;
    },

    /*
     * Detaches all events added to the input node
     *
     * @method destructor
     * @private
     */
    destructor: function() {

        this.get(INPUT).detachAll();
    },

    /*
     * Depending on the nagivation method we hide on
     * different events for cross browser compatibility
     *
     * @method _setHideOn
     * @public
     */
    setHideOn: function() {
        var hideEvents = [
            { eventName: 'mousedownoutside' },
            { eventName: 'key', node: Y.one('document'), keyCode: 'esc'}
        ];

        if (this.get('autoFocusOnFieldFocus')) {
            hideEvents.push({ eventName: 'keyupoutside'});
        } else {
            hideEvents.push({ eventName: 'keydownoutside'});
        }

        this.set('hideOn', hideEvents);
    },

    /*
     * Shows or renders the calendar
     *
     * @method showCalendar
     * @public
     */
    showCalendar: function() {

        if (this.get('rendered')) {
            this.show();
        } else {
            this.render();
            this._setPopupTabindex();
            this.setCalendarPosition();
            this.get('contentBox').setStyle('height', this.get('height'));
            this.get('boundingBox').setStyle('z-index', '1000');
        }

        if (this.get('autoFocusOnFieldFocus')) { this.focus(); }
    },

    /*
     * Hides the calendar - does not remove from dom.
     *
     * @method hideCalendar
     * @public
     */
    hideCalendar: function() {

        this.hide();
    },

    /*
     * Aligns the calendar to the input box. Because of an
     * issue with when align is run this needs to be run
     * after render has happened.
     *
     * @method setCalendarPosition
     * @public
     */
    setCalendarPosition: function() {
        if (this.get('align') === null) {
            this.set('align', this.get('_align'));
        }
        this.show();
    }

} , {
    ATTRS: {

        /*
         * Y.Node object of the input node
         *
         * @attribute input
         * @type Y.Node
         * @default null
         * @public
         */
        input: {
            value: null
        },

        /*
         * If the user is to autofocus on the calendar
         * when they enter the input box
         *
         * @attribute autoFocusOnFieldFocus
         * @type bool
         * @default false
         * @public
         */
        autoFocusOnFieldFocus: {
            value: false
        },

        /*
         * Automatically sets all of the input fields in
         * the form to 1 for keyboard navigation cross browser
         * when the developer forgets to do it manually
         *
         * @attribute autoTabIndexFormElements
         * @type bool
         * @default false
         * @public
         */
        autoTabIndexFormElements: {
            value: false
        },

        /*
         * Presets the visibility to false to avoid a flash of
         * content in the wrong position
         *
         * @attribute visible
         * @type bool
         * @default false
         * @public
         */
        visible: {
            value: false
        },

        /*
         * String value of the rules for disabled dates
         *
         * @attribute disabledDatesRule
         * @type string
         * @default "disabledDates"
         * @public
         */
        disabledDatesRule: {
           value: "disabledDates"
        },

        /*
         * Full calendar start date
         *
         * @attribute startDate
         * @type Date object
         * @default null
         * @public
         */
        startDate: {
            value: null
        },

        /*
         * Full calendar end date
         *
         * @attribute endDate
         * @type Date object
         * @default null
         * @public
         */
        endDate: {
            value: null
        },

        /*
         * Align default setting
         *
         * @attribute _align
         * @type object
         * @default object
         * @private
         */
        _align: {
            valueFn: function() {
                return {
                    node: this.get('input'),
                    points: [Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.TR]
                };
            }
        }
    }
});


}, 'gallery-2012.05.16-20-37' ,{skinnable:true, requires:['calendar', 'widget-position', 'widget-position-align', 'widget-autohide']});
