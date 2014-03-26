YUI.add('gallery-datepicker', function (Y, NAME) {

/**
 * YUI3 Date Picker - A calendar popup for date input form elements
 *
 * @module gallery-datepicker
 */

/**
 * @param args {Object} arguments for constructing the datepicker, most important is the "input" argument.
 * @class DatePicker
 * @constructor
 */
Y.DatePicker = function (args) {
    this.args = args;
    this.format = "%Y-%m-%d";
    if (this.args.showTime) {
        this.format += " %H:%M:%S";
    }
    this.createFormElements();
    this.createPopup();
};

/**
 * Creates the popup calendar panel, with an invisible overlay that will
 * hide it whenever you click outside the popup. The popup will be hidden
 * by default.
 *
 * @method createPopup
 * @protected
 */
Y.DatePicker.prototype.createPopup = function () {
    var zIndex = 10055, body = Y.one("body");
    this.container = Y.Node.create("<div/>");
    this.container.setStyle("display", "none");
    this.container.setStyle("position", "absolute");
    this.container.setStyle("zIndex", zIndex + 1);
    this.container.setStyles({
        display: "none", position: "absolute", zIndex: zIndex + 1,
        left: "0px", top: "0px"});
    this.calendar = new Y.Calendar({
        render: this.container,
        visible: true
    });
    this.calendar.on("selectionChange", function (e) {
        this.setDate(e.newSelection[0]);
        this.hideContainer();
    }, this);
    if (this.args.minimumDate) {
        this.setMinimumDate(this.args.minimumDate);
    }
    if (this.args.maximumDate) {
        this.setMaximumDate(this.args.maximumDate);
    }
    this.overlay = Y.Node.create("<div/>");
    this.overlay.setStyles({
        top: "0px", left: "0px",
        width: "100%", height: "100%", display: "none",
        position: "fixed", zIndex: zIndex
    });
    body.addClass("yui3-skin-sam");
    body.append(this.overlay);
    body.append(this.container);
    this.overlay.on("click", this.hideContainer, this);
    this.container.on("click", function (e) {e.stopPropagation();});
};

/**
 * Creates the form elements around the input box, such as the button
 * which launches the calendar.
 *
 * @method createFormElements
 * @protected
 */
Y.DatePicker.prototype.createFormElements = function () {
    this.input = Y.one(this.args.input);
    this.calendarLauncher = Y.Node.create('<input type="button"/>');
    this.calendarLauncher.addClass("cal-launcher");
    if (this.args.btnContent) {
        this.calendarLauncher.setHTML(this.args.btnContent);
    }
    this.input.insert(this.calendarLauncher, "after");
    this.calendarLauncher.on("click", this.showContainer, this);
    if (this.args.date) {
        this.setDate(this.args.date, true);
    }
};

/**
 * Parses the input box and returns the currently selected date object.
 *
 * @method getDate
 * @return {Date}
 */
Y.DatePicker.prototype.getDate = function () {
    return this.parseDate(this.input.get("value"));
};

/**
 * Sets the currently selected date, if discardOldTime is false (or not
 * used) it will merge the previously selected time into the new date,
 * which is useful when a date is selected from the calendar widget.
 *
 * @method setDate
 * @protected
 * @param {Date} newDate
 * @param {boolean} discardOldTime
 */
Y.DatePicker.prototype.setDate = function (newDate, discardOldTime) {
    var oldDate, str;
    if (!discardOldTime) {
        oldDate = this.parseDate(this.input.get("value"));
        if (oldDate) {
            newDate.setHours(oldDate.getHours());
            newDate.setMinutes(oldDate.getMinutes());
            newDate.setSeconds(oldDate.getSeconds());
            newDate.setMilliseconds(oldDate.getMilliseconds());
        }
    }
    str = Y.DataType.Date.format(newDate, {format: this.format});
    this.input.set("value", str);
};

/**
 * Sets the minimum selectable date.
 *
 * @method setMinimumDate
 * @param {Date} minimumDate
 */
Y.DatePicker.prototype.setMinimumDate = function (minimumDate) {
    this.minimumDate = minimumDate;
    this.setCustomRenderer();
};

/**
 * Sets the maximum selectable date.
 *
 * @method setMaximumDate
 * @param {Date} maximumDate
 */
Y.DatePicker.prototype.setMaximumDate = function (maximumDate) {
    this.maximumDate = maximumDate;
    this.setCustomRenderer();
};

/**
 * Sets the custom renderer for the calendar to respect the minimum and
 * maximum dates selected if used.
 *
 * @method setCustomRenderer
 * @protected
 */
Y.DatePicker.prototype.setCustomRenderer = function () {
    if (this.customRenderer) {
        return;
    }
    var self, canBeSelected, filterFunction, f;
    self = this;
    canBeSelected = function (date) {
        if (self.maximumDate && date > self.maximumDate) {
            return false;
        }
        if (self.minimumDate && date < self.minimumDate) {
            return false;
        }
        return true;
    };
    filterFunction = function (date, node) {
        if (canBeSelected(date)) {
            node.removeClass("yui3-calendar-selection-disabled");
        }
        else {
            node.addClass("yui3-calendar-selection-disabled");
        }
    };
    this.calendar.set("customRenderer",
        {filterFunction: filterFunction, rules: {all: "all"}});
    f = this.calendar._canBeSelected;
    this.calendar._canBeSelected = function (date) {
        if (!canBeSelected(date)) {
            return false;
        }
        return f.call(self.calendar, date);
    };
    this.customRenderer = true;
};

/**
 * Parses the date in the input box. It recognizes iso8601 formatted
 * dates with everything optional up to the year. So "1999" is valid,
 * just as "2006-04-20", or "2008-01-01 15:30:55", but "foo" is not. Used
 * just before the calendar is * shown so that it can be focused on the
 * correct date.
 *
 * @method parseDate
 * @protected
 */
Y.DatePicker.prototype.parseDate = function (str) {
    if (!str) {
        return null;
    }
    var m = str.match(/^(\d{4})(?:-(\d{1,2})(?:-(\d{1,2})(?:[ T](\d{1,2})(?::(\d{1,2})(?::(\d{1,2}))?)?)?)?)?$/);
    if (!m) {
        return null;
    }
    return new Date(m[1], m[2] - 1 || 0, m[3] || 1, m[4] || 0, m[5] || 0, m[6] || 0);
};

/**
 * Shows the calendar popup.
 *
 * @method showContainer
 * @protected
 */
Y.DatePicker.prototype.showContainer = function (e) {
    if (e) {
        e.preventDefault();
    }
    if (this.onshow) {
        this.onshow();
    }
    var x, y, date;
    x = this.calendarLauncher.getX();
    y = this.calendarLauncher.getY() +
            parseInt(this.calendarLauncher.getComputedStyle("height"), 10);
    this.container.setStyles({left: x, top: y});
    date = this.parseDate(this.input.get("value"));
    if (date) {
        this.calendar._addDateToSelection(date, true);
        this.calendar.set("date", date);
    }
    else {
        this.calendar.set("date", new Date());
    }
    this.overlay.setStyle("display", "block");
    this.container.setStyle("display", "block");
};

/**
 * Hides the calendar popup.
 *
 * @method hideContainer
 * @protected
 */
Y.DatePicker.prototype.hideContainer = function () {
    this.overlay.setStyle("display", "none");
    this.container.setStyle("display", "none");
};



}, 'gallery-2013.03.13-20-05', {"requires": ["yui-base", "calendar", "node", "datatype-date"], "skinnable": true});
