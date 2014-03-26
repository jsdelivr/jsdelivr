YUI.add('gallery-itsacalendarmarkeddates', function (Y, NAME) {

'use strict';

/**
 * @module gallery-itsacalendarmarkeddates
 * @class ITSACalendarMarkedDates
 * @constructor
 * @since 3.8.1
 *
 * <i>Copyright (c) 2013 Its Asbreuk - http://itsasbreuk.nl</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
**/

var Lang            = Y.Lang,
    YDate           = Y.DataType.Date,
    YObject         = Y.Object,
    arrayEach       = Y.Array.each,
    objEach         = YObject.each,
    hasKey          = YObject.hasKey,
    getCN           = Y.ClassNameManager.getClassName,
    CALENDAR        = 'calendar',
    ITSA            = 'itsa',
    CAL_DAY_MARKED  = getCN(ITSA, 'markeddate'),
    WIDGET_CLASS    = getCN(CALENDAR, ITSA, 'markeddates'),
    dateCopyObject  = function (oDate) {
                          return new Date(oDate.getTime());
                      },
    dateCopyValues  = function (aDate, bDate) {
                        bDate.setTime(aDate.getTime());
                    },
    dateEqualDays   = function(aDate, bDate) {
                          return ((aDate.getDate()===bDate.getDate()) && (aDate.getMonth()===bDate.getMonth())
                                  && (aDate.getFullYear()===bDate.getFullYear()));
                      },
    dayisGreater    = function(aDate, bDate) {
                          return (YDate.isGreater(aDate, bDate) && !dateEqualDays(aDate, bDate));
                      },
    dateAddDays     = function (oDate, numDays) {
                          oDate.setTime(oDate.getTime() + 86400000*numDays);
                      },
    dateAddMonths   = function (oDate, numMonths) {
                          var newYear = oDate.getFullYear(),
                              newMonth = oDate.getMonth() + numMonths;
                          newYear  = Math.floor(newYear + newMonth / 12);
                          newMonth = (newMonth % 12 + 12) % 12;
                          oDate.setFullYear(newYear);
                          oDate.setMonth(newMonth);
                      };

function ITSACalendarMarkedDates() {}

Y.mix(ITSACalendarMarkedDates.prototype, {


    /**
     * The hash map of marked dates, populated with
     * markDates() and unmarkDates() methods
     *
     * @property _markedDates
     * @type Object
     * @private
     * @since 3.8.1
     */

    /**
     * Internal subscriber to Calendar.after(['dateChange', 'markChange']) events
     *
     * @property _fireMarkEvent
     * @type EventHandle
     * @private
     * @since 3.8.1
     */

    /**
     * Designated initializer
     * Initializes instance-level properties of
     * calendar.
     *
     * @method initializer
     * @protected
     * @since 3.8.1
     */
    initializer : function () {
        var instance = this;

        instance._markedDates = {};
        instance.get('boundingBox').addClass(WIDGET_CLASS);
        instance.after(
            'render',
            function() {
                instance._renderMarkedDates();
                // instance._fireMarkEvent must be attached AFTER rendering.
                // this way we are sure that Calendar._afterDateChange is excecuted before instance._renderMarkedDates
                // (Calendar._afterDateChange also subscribes after-dataChange)
                instance._fireMarkEvent = instance.after(['dateChange', 'markChange'], instance._renderMarkedDates);
            }
        );
    },

    /**
     * Cleans up events
     * @method destructor
     * @protected
     * @since 3.8.1
     */
    destructor: function () {
        var instance = this;

        if (instance._fireMarkEvent) {
            instance._fireMarkEvent.detach();
        }
    },

    /**
     * Returns an Array with the marked Dates that fall with the specified Date-range.
     * If aDate is an Array, then the search will be inside this Array.
     * If aDate is a Date-Object then the search will go between the range aDate-bDate
     * (bDate included, when bDate is not specified, only aDate is taken)
     *
     * @method getMarkedDates
     * @param {Date|Array} aDate the startDate, or an Array of Dates to search within
     * @param {Date} [bDate] The last Date to search within (in case of a range aDate-bDate)
     * Will only be taken if aDate is a Date-object
     * @return {Array} Array with the marked Dates within the searchargument
     * @since 3.8.1
     */
    getMarkedDates : function (aDate, bDate) {
        var instance = this,
            markedDates = instance._markedDates,
            returnDates = [],
            year, month, day, searchDay;

        if (Lang.isArray(aDate)) {
            arrayEach(
                aDate,
                function(oneDate) {
                    if (YDate.isValidDate(oneDate)) {
                        year = oneDate.getFullYear();
                        month = oneDate.getMonth();
                        day = oneDate.getDate();
                        if (markedDates[year] && markedDates[year][month] && markedDates[year][month][day]) {
                            returnDates.push(dateCopyObject(oneDate));
                        }
                    }
                }
            );
        }
        else if (YDate.isValidDate(aDate)) {
            if (!YDate.isValidDate(bDate) || dayisGreater(aDate, bDate)) {
                bDate = dateCopyObject(aDate);
            }
            searchDay = new Date(aDate.getTime());
            do {
                year = searchDay.getFullYear();
                month = searchDay.getMonth();
                day = searchDay.getDate();
                if (markedDates[year] && markedDates[year][month] && markedDates[year][month][day]) {
                    returnDates.push(dateCopyObject(searchDay));
                }
                dateAddDays(searchDay, 1);
            }
            while (!dayisGreater(searchDay, bDate));
        }
        return returnDates;
    },

    /**
     * Returns an Array with the marked Dates that fall with the <b>Week</b> specified by the Date-argument.
     *
     * @method getMarkedDatesInWeek
     * @param {Date} oDate a Date-Object that determines the <b>Week</b> to search within.
     * @return {Array} Array with the marked Dates within the specified Week
     * @since 3.8.1
     */
    getMarkedDatesInWeek : function (oDate) {
        var instance = this,
            dayOfWeek = oDate.getDay(),
            aDate = dateCopyObject(oDate),
            bDate = dateCopyObject(oDate);

        dateAddDays(aDate, -dayOfWeek);
        dateAddDays(bDate, 6-dayOfWeek);
        return instance.getMarkedDates(aDate, bDate);
    },

    /**
     * Returns an Array with the marked Dates that fall with the <b>Month</b> specified by the Date-argument.
     *
     * @method getMarkedDatesInMonth
     * @param {Date} oDate a Date-Object that determines the <b>Month</b> to search within.
     * @return {Array} Array with the marked Dates within the specified Month
     * @since 3.8.1
     */
    getMarkedDatesInMonth : function (oDate) {
        var instance = this,
            aDate = dateCopyObject(oDate),
            bDate = YDate.addMonths(oDate, 1);

        aDate.setDate(1);
        bDate.setDate(1);
        dateAddDays(bDate, -1);
        return instance.getMarkedDates(aDate, bDate);
    },

    /**
     * Returns an Array with the marked Dates that fall with the <b>Year</b>.
     *
     * @method getMarkedDatesInYear
     * @param {int} year The <b>Year</b> to search within.
     * @return {Array} Array with the marked Dates within the specified Year
     * @since 3.8.1
     */
    getMarkedDatesInYear : function (year) {
        var instance = this,
            aDate = new Date(year, 0, 1),
            bDate = new Date(year, 11, 31);

        return instance.getMarkedDates(aDate, bDate);
    },

    /**
     * Returns whether a Date is marked
     *
     * @method dateIsMarked
     * @param {Date} oDate Date to be checked
     * @return {Boolean}
     * @since 3.8.1
     */
    dateIsMarked : function (oDate) {
        var instance = this,
            markedDates = instance._markedDates,
            year = oDate.getFullYear(),
            month = oDate.getMonth(),
            day = oDate.getDate(),
            isMarked = (markedDates[year] && markedDates[year][month] && markedDates[year][month][day]) ? true : false;

        return isMarked;
    },

    /**
     * Marks a given date or array of dates. Is appending. If you want to 'reset' with new values,
     * then first call clearMarkedDates().
     *
     * @method markDates
     * @param {Date|Array} dates A `Date` or `Array` of `Date`s.
     * @return {CalendarBase} A reference to this object
     * @chainable
     * @since 3.8.1
     */
    markDates : function (dates) {
        var instance = this;

        if (YDate.isValidDate(dates)) {
            instance._addDateToMarked(dates);
        }
        else if (Lang.isArray(dates)) {
            this._addDatesToMarked(dates);
        }
        return instance;
    },

    /**
     * Unmarks a given date or array of dates, or unmarks all in case if no param
     * all dates if no argument is specified.
     *
     * @method unmarkDates
     * @param {Date|Array} [dates] A `Date` or `Array` of `Date`s, or no
     * argument if all dates should be deselected.
     * @return {CalendarBase} A reference to this object
     * @chainable
     * @since 3.8.1
     */
    unmarkDates : function (dates) {
        var instance = this;

        if (!dates) {
            instance.clearMarkedDates();
        }
        else if (YDate.isValidDate(dates)) {
            instance._removeDateFromMarked(dates);
        }
        else if (Lang.isArray(dates)) {
            instance._removeDatesFromMarked(dates);
        }
        return instance;
    },

    /**
     * Unmarks all dates.
     *
     * @method clearMarkedDates
     * @param {boolean} noevent A Boolean specifying whether a markChange
     * event should be fired. If true, no event is fired.
     * @return {CalendarBase} A reference to this object
     * @chainable
     * @since 3.8.1
     */
    clearMarkedDates : function (noevent) {
        var instance = this,
            prevMarked;

        instance._markedDates = {};
        if (noevent) {
            instance.get('contentBox').all('.' + CAL_DAY_MARKED).removeClass(CAL_DAY_MARKED);
        }
        else {
            prevMarked = instance._getMarkedDatesList();
            instance._fireMarkChange(prevMarked);
        }
        return instance;
    },

    //--------------------------------------------------------------------------
    // Protected properties and methods
    //--------------------------------------------------------------------------

    /**
     * A utility method that fires a markChange event.
     * @method _fireMarkChange
     * @param {Array} a list of previous marked dates
     * @private
     * @since 3.8.1
     */
    _fireMarkChange : function (prevMarked) {
        /**
        * Fired when the set of marked dates changes. Contains a payload with
        * a `newMarked` and `prevMarked` property which contains an array of marked dates.
        *
        * @event markChange
        * @param {Array} newVal contains [Date] with all marked Dates
        * @param {Array} prevVal contains [Date] with all marked Dates
        * @since 3.8.1
        */
        var instance = this;

        instance.fire('markChange', {newVal: instance._getMarkedDatesList(), prevVal: prevMarked});
    },

    /**
     * Generates a list of marked dates from the hash storage.
     *
     * @method _getMarkedDatesList
     * @private
     * @protected
     * @return {Array} The array of Dates that are currently marked.
     * @since 3.8.1
     */
    _getMarkedDatesList : function () {
        var instance = this,
            output = [];

        objEach (instance._markedDates, function (year) {
            objEach (year, function (month) {
                objEach (month, function (day) {
                    output.push (day);
                }, instance);
            }, instance);
        }, instance);

        return output;
    },

    /**
     * Adds a given date to the markedDates.
     *
     * @method _addDateToMarked
     * @param {Date} oDate The date to add to the markeddates.
     * @param {int} [index] An optional parameter that is used
     * to differentiate between individual marked date and multiple
     * marked dates. If index is available, then this method does not fire an event.
     * @private
     * @since 3.8.1
     */
    _addDateToMarked : function (oDate, index) {
        var instance = this,
            year = oDate.getFullYear(),
            month = oDate.getMonth(),
            day = oDate.getDate(),
            prevMarked;

        if (!YDate.isValidDate(oDate)) {
        }
        else {
            if (!Lang.isValue(index)) {
                prevMarked = instance._getMarkedDatesList();
            }
            if (hasKey(instance._markedDates, year)) {
                if (hasKey(instance._markedDates[year], month)) {
                    instance._markedDates[year][month][day] = dateCopyObject(oDate);
                } else {
                    instance._markedDates[year][month] = {};
                    instance._markedDates[year][month][day] = dateCopyObject(oDate);
                }
            } else {
                instance._markedDates[year] = {};
                instance._markedDates[year][month] = {};
                instance._markedDates[year][month][day] = dateCopyObject(oDate);
            }
            if (!Lang.isValue(index)) {
                instance._fireMarkChange(prevMarked);
            }
        }
    },

    /**
     * Adds a given list of dates to the markedDates.
     *
     * @method _addDatesToMarked
     * @param {Array} datesArray The list of dates to add to the markedDates.
     * @private
     * @since 3.8.1
     */
    _addDatesToMarked : function (datesArray) {
        var instance = this,
            prevMarked = instance._getMarkedDatesList();

        arrayEach(datesArray, instance._addDateToMarked, instance);
        instance._fireMarkChange(prevMarked);
    },

    /**
     * Adds a given range of dates to the markedDates.
     *
     * @method _addDateRangeToMarked
     * @param {Date} startDate The first date of the given range.
     * @param {Date} endDate The last date of the given range.
     * @private
     * @since 3.8.1
     */
    _addDateRangeToMarked : function (startDate, endDate) {
        var instance = this,
            timezoneDifference = (endDate.getTimezoneOffset() - startDate.getTimezoneOffset())*60000,
            startTime = startDate.getTime(),
            endTime   = endDate.getTime(),
            prevMarked = instance._getMarkedDatesList(),
            tempTime, time, addedDate;

        if (startTime > endTime) {
            tempTime = startTime;
            startTime = endTime;
            endTime = tempTime + timezoneDifference;
        }
        else {
            endTime = endTime - timezoneDifference;
        }
        for (time = startTime; time <= endTime; time += 86400000) {
            addedDate = new Date(time);
            addedDate.setHours(12);
            instance._addDateToMarked(addedDate);
        }
        instance._fireMarkChange(prevMarked);
    },

    /**
     * Removes a given date from the markedDates.
     *
     * @method _removeDateFromMarked
     * @param {Date} oDate The date to remove from the markedDates.
     * @param {int} [index] An optional parameter that is used
     * to differentiate between individual date selections and multiple
     * date selections. If index is available, then this method does not fire an event.
     * @private
     * @since 3.8.1
     */
    _removeDateFromMarked : function (oDate, index) {
        var instance = this,
            year = oDate.getFullYear(),
            month = oDate.getMonth(),
            day = oDate.getDate(),
            prevMarked;

        if (!YDate.isValidDate(oDate)) {
        }
        else {
            if (hasKey(instance._markedDates, year) &&
                hasKey(instance._markedDates[year], month) &&
                hasKey(instance._markedDates[year][month], day))
            {
                if (Lang.isValue(index)) {
                    delete instance._markedDates[year][month][day];
                }
                else {
                    prevMarked = instance._getMarkedDatesList();
                    delete instance._markedDates[year][month][day];
                    instance._fireMarkChange(prevMarked);
                }
            }
        }
    },

    /**
     * Removes a given list of dates from the markedDates.
     *
     * @method _removeDatesFromMarked
     * @param {Array} datesArray The list of dates to remove from the markedDates.
     * @private
     * @since 3.8.1
     */
    _removeDatesFromMarked : function (datesArray) {
        var instance = this,
            prevMarked = instance._getMarkedDatesList();

        arrayEach(datesArray, instance._removeDateFromMarked, instance);
        instance._fireMarkChange(prevMarked);
    },

    /**
     * Removes a given range of dates from the markedDates.
     *
     * @method _removeDateRangeFromMarked
     * @param {Date} startDate The first date of the given range.
     * @param {Date} endDate The last date of the given range.
     * @private
     * @since 3.8.1
     */
    _removeDateRangeFromMarked : function (startDate, endDate) {
        var instance = this,
            startTime = startDate.getTime(),
            endTime   = endDate.getTime(),
            prevMarked = instance._getMarkedDatesList(),
            time;

        for (time = startTime; time <= endTime; time += 86400000) {
            instance._removeDateFromMarked(new Date(time));
        }
        instance._fireMarkChange(prevMarked);
    },

    /**
     * Rendering assist method that renders all datecells that are currently marked.
     *
     * @method _renderMarkedDates
     * @private
     * @since 3.8.1
     */
    _renderMarkedDates : function () {
        var instance = this,
            edgeMonthDate = new Date(0),
            contentBox = instance.get('contentBox'),
            paneNum, paneDate, dateArray, dateNode, col1, col2;

        instance.get('contentBox').all('.' + CAL_DAY_MARKED).removeClass(CAL_DAY_MARKED);
        for (paneNum = 0; paneNum < instance._paneNumber; paneNum++) {
            paneDate = YDate.addMonths(instance.get('date'), paneNum);
            dateArray = instance._getMarkedDatesInMonth(paneDate);
            arrayEach(dateArray, Y.bind(instance._renderMarkedDatesHelper, instance));
            if (instance.get('showPrevMonth')) {
                dateCopyValues(paneDate, edgeMonthDate);
                edgeMonthDate.setDate(1);
                col1 = instance._getDateColumn(edgeMonthDate) - 1;
                col2 = 0;
                dateNode = contentBox.one("#" + instance._calendarId + "_pane_" + paneNum + "_" + col1 + "_" + col2);
                while (dateNode) {
                    dateAddDays(edgeMonthDate, -1);
                    if (instance.dateIsMarked(edgeMonthDate)) {
                        dateNode.addClass(CAL_DAY_MARKED);
                    }
                    col1--;
                    col2--;
                    dateNode = contentBox.one("#" + instance._calendarId + "_pane_" + paneNum + "_" + col1 + "_" + col2);
                }
            }
            if (instance.get('showNextMonth')) {
                dateCopyValues(paneDate, edgeMonthDate);
                dateAddMonths(edgeMonthDate, 1);
                dateAddDays(edgeMonthDate, -1);
                col1 = instance._getDateColumn(edgeMonthDate) + 1;
                col2 = edgeMonthDate.getDate() + 1;
                dateNode = contentBox.one("#" + instance._calendarId + "_pane_" + paneNum + "_" + col1 + "_" + col2);
                while (dateNode) {
                    if (!dateNode.hasClass('yui3-calendar-column-hidden')) {
                        dateAddDays(edgeMonthDate, 1);
                    }
                    if (instance.dateIsMarked(edgeMonthDate)) {
                        dateNode.addClass(CAL_DAY_MARKED);
                    }
                    col1++;
                    col2++;
                    dateNode = contentBox.one("#" + instance._calendarId + "_pane_" + paneNum + "_" + col1 + "_" + col2);
                }
                col1 = 0;
                col2 = 30;
                dateNode = contentBox.one("#" + instance._calendarId + "_pane_" + paneNum + "_" + col1 + "_" + col2);
                while (dateNode) {
                    if (!dateNode.hasClass('yui3-calendar-column-hidden')) {
                        dateAddDays(edgeMonthDate, 1);
                    }
                    if (instance.dateIsMarked(edgeMonthDate)) {
                        dateNode.addClass(CAL_DAY_MARKED);
                    }
                    col1++;
                    col2++;
                    dateNode = contentBox.one("#" + instance._calendarId + "_pane_" + paneNum + "_" + col1 + "_" + col2);
                }
            }

        }
    },

    /**
     * A utility method that converts a Date to the columnindex of the calendar cell the Date corresponds to.
     *
     * @method _getDateColumn
     * @param {Date} oDate The Date to retreive the columnindex from
     * @protected
     * @return {int} The columnindex
     */
    _getDateColumn : function (oDate) {
        var day = oDate.getDate(),
            col = 0,
            daymod = day%7,
            paneNum = (12 + oDate.getMonth() - this.get("date").getMonth()) % 12,
            paneId = this._calendarId + "_pane_" + paneNum,
            cutoffCol = this._paneProperties[paneId].cutoffCol;

        switch (daymod) {
            case (0):
                if (cutoffCol >= 6) {
                    col = 12;
                } else {
                    col = 5;
                }
                break;
            case (1):
                    col = 6;
                break;
            case (2):
                if (cutoffCol > 0) {
                    col = 7;
                } else {
                    col = 0;
                }
                break;
            case (3):
                if (cutoffCol > 1) {
                    col = 8;
                } else {
                    col = 1;
                }
                break;
            case (4):
                if (cutoffCol > 2) {
                    col = 9;
                } else {
                    col = 2;
                }
                break;
            case (5):
                if (cutoffCol > 3) {
                    col = 10;
                } else {
                    col = 3;
                }
                break;
            case (6):
                if (cutoffCol > 4) {
                    col = 11;
                } else {
                    col = 4;
                }
                break;
        }
        return col;

    },

    /**
    * Takes in a date and marks the datecell.
    *
    * @method _renderMarkedDatesHelper
    * @param {Date} oDate Date to be marked.
    * @private
    * @since 3.8.1
    */
    _renderMarkedDatesHelper: function (oDate) {

        this._dateToNode(oDate).addClass(CAL_DAY_MARKED);
   },

    /**
     * Returns all marked dates in a specific month.
     *
     * @method _getMarkedDatesInMonth
     * @param {Date} oDate corresponding to the month for which selected dates are requested.
     * @private
     * @protected
     * @return {Array} The array of `Date`s in a given month that are currently marked.
     * @since 3.8.1
     */
    _getMarkedDatesInMonth : function (oDate) {
        var instance = this,
            year = oDate.getFullYear(),
            month = oDate.getMonth();

        if (hasKey(instance._markedDates, year) && hasKey(instance._markedDates[year], month)) {
            return YObject.values(instance._markedDates[year][month]);
        }
        else {
            return [];
        }
    }

}, true);

Y.Calendar.ITSACalendarMarkedDates = ITSACalendarMarkedDates;

Y.Base.mix(Y.Calendar, [ITSACalendarMarkedDates]);

}, 'gallery-2013.07.03-22-52', {
    "requires": [
        "base-build",
        "node-base",
        "calendar-base",
        "datatype-date",
        "datatype-date-math"
    ],
    "skinnable": true
});
