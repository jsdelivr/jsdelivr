YUI.add('gallery-popup-calendar-group', function(Y) {

    Y.PopupCalendarGroup = Y.Base.create('popup-calendar-group', Y.Base, [], {

        initializer: function(config) {
            Y.log('initializer', 'info', this.name);

            var startInput = config.calendars[0].start.input,
                minDate = startInput.getData('min-date'),
                maxDate = startInput.getData('max-date');

            if (!config.startDate) {
                if (minDate) {
                    this.set('startDate', minDate);
                } else {
                    this.set('startDate', new Date());
                }
            }

            if (!config.endDate) {
                if (maxDate) {
                    this.set('endDate', maxDate);
                }
            }

            Y.Array.each(config.calendars, this._instantiateCalendars, this);
        },

        _instantiateCalendars: function(calendars) {
            Y.log('_instantiateCalendars', 'info', this.name);

            var config = this.get('config'),
                start = calendars.start,
                startInput = start.input,
                end = calendars.end,
                endInput = end.input;

            if (typeof startInput == 'string') { start.input = Y.one(startInput); }
            if (typeof endInput == 'string') { end.input = Y.one(endInput); }

            var filterFunction = config.filterFunction,
                rules = config.rules;

            if (filterFunction && rules) {
                config.customRenderer = {
                    filterFunction: filterFunction,
                    rules: rules
                };
                this.set('filterFunction', filterFunction);
            }

            Y.mix(start, config);
            Y.mix(end, config);

            var startCal = calendars.start.cal = new Y.PopupCalendar(start),
                endCal = calendars.end.cal = new Y.PopupCalendar(end),
                startDateSelectedFn = Y.bind(start.dateSelected, startCal),
                endDateSelectedFn = Y.bind(end.dateSelected, endCal),
                today = new Date();

            this._dateSelectedFn(today, startCal);
            this._dateSelectedFn(today, endCal);

            startCal.on('dateSelected', function(e) {
                var date = e.newSelection[0];

                startDateSelectedFn(e);
                this.set('selectedStartDate', date);
                endCal.set('minimumDate', date);

                this._dateSelectedFn(date, endCal, "end");
            }, this);

            endCal.on('dateSelected', function(e) {
                var date = e.newSelection[0];

                endDateSelectedFn(e);
                this.set('selectedEndDate', date);
                startCal.set('maximumDate', date);

                this._dateSelectedFn(date, startCal, "start");
            }, this);

            this.set('calendars', calendars);
        },

        _dateSelectedFn: function(date, cal, type) {
            Y.log('_dateSelectedFn', 'info', this.name);

            cal.set('disabledDatesRule', "disabledDates");
            cal.set('customRenderer', {
                rules: cal._buildDisabledRule(date, type),
                filterFunction: this.filterFunction
            });
        },

        destructor: function() {
            Y.log('destructor', 'info', this.name);
        }

    }, {
        ATTRS: {
            /*
             * General calendar config to be applied to
             * all instances of calendar
             *
             * @attribute config
             * @default null
             */
            config: {
                value: null
            },
            /*
             * The container to search for calendars
             *
             * @attribute container
             * @default Y
             */
            container: {
                value: Y,
                setter: function(node) {
                    if (typeof node == 'string') {
                        return Y.one(node);
                    } else {
                        return node;
                    }
                }
            },

            /*
             * An array of the calendars in this group
             *
             * @attribute calendars
             * @default null
             */
            calendars: {
                value: null
            },

            /*
             * The filter function for the groups rules
             *
             * @property filterFunction
             * @public
             */
            filterFunction: {
                value : null
            },

            /*
             * The start date of the range
             *
             * @property startDate
             * @public
             */
            startDate: {
                value: null
            },

            /*
             * The end date of the range
             *
             *
             */
            endDate: {
                value: null
            },

            /*
             * Selected date of the start calendar
             *
             *
             */
            selectedStartDate: {
                value: null
            },

            /*
             * Selected date of the end calendar
             *
             *
             */
            selectedEndDate: {
                value: null
            }
        }
    });


}, 'gallery-2012.05.09-20-27' ,{requires:['gallery-popup-calendar', 'calendar'], skinnable:false});
