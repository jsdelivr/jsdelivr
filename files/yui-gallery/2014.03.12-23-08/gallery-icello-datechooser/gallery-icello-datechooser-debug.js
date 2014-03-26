YUI.add('gallery-icello-datechooser', function(Y) {

'use strict';

/** 
* @module gallery-icello-datechooser
*/
var getCN = Y.ClassNameManager.getClassName,
    CBX = 'contentBox',
    BASENAME = 'icello-datechooser',
    DC = BASENAME + '-viewmonth',
    MC = BASENAME + '-viewyear',
    YC = BASENAME + '-viewdecade',
    UI_SRC = Y.Widget.UI_SRC,
    IDate = Y.Icello.Date,
    YDate = Y.DataType.Date,
    sub = Y.substitute,
    styles = {
        viewmonth: {
            css_pane: getCN(DC, 'pane'),
            css_body: getCN(DC, 'body'),
            css_header: getCN(DC, 'header'),
            css_prevmonth: getCN(DC, 'prevmonth'),
            css_nextmonth: getCN(DC, 'nextmonth'),
            css_header_label: getCN(DC, 'header', 'label'),
            css_monthyear: getCN(DC, 'monthyear'),
            css_grid: getCN(DC, 'grid'),
            css_weekdayrow: getCN(DC, 'weekdayrow'),
            css_weekday: getCN(DC, 'weekday'),
            css_day: getCN(DC, 'day'),
            css_day_selected: getCN(DC, 'day', 'selected'),
            css_nextmonth_day: getCN(DC, 'nextmonth', 'day'),
            css_prevmonth_day: getCN(DC, 'prevmonth', 'day')
        },
        viewyear: {
            css_pane: getCN(MC, 'pane'),
            css_body: getCN(MC, 'body'),
            css_header: getCN(MC, 'header'),
            css_prevyear: getCN(MC, 'prevyear'),
            css_nextyear: getCN(MC, 'nextyear'),
            css_header_label: getCN(MC, 'header', 'label'),
            css_year: getCN(MC, 'year'),
            css_grid: getCN(MC, 'grid'),
            css_month: getCN(MC, 'month'),
            css_month_selected: getCN(MC, 'month', 'selected')
        },
        viewdecade: {
            css_pane: getCN(YC, 'pane'),
            css_body: getCN(YC, 'body'),
            css_header: getCN(YC, 'header'),
            css_prevdecade: getCN(YC, 'prevdecade'),
            css_nextdecade: getCN(YC, 'nextdecade'),
            css_header_label: getCN(YC, 'header', 'label'),
            css_decade: getCN(YC, 'decade'),
            css_grid: getCN(YC, 'grid'),
            css_year: getCN(YC, 'year'),
            css_year_selected: getCN(YC, 'year', 'selected'),
            css_year_outsidedecade: getCN(YC, 'year', 'outsidedecade')
        }
    },
    templates = {
        viewmonth: {
            content: '<div class="{css_pane}">{t_header}<div class="{css_body}">{t_grid}</div></div>',
            header: '<div class="{css_header}">{t_prevmonth}{t_headerlabel}{t_nextmonth}</div>',
            prevmonth: '<div class="{css_prevmonth}">&#9668;</div>',
            nextmonth: '<div class="{css_nextmonth}">&#9658;</div>',
            headerlabel: '<div class="{css_header_label}"><span class="{css_monthyear}">{month} {year}</span></div>',
            grid: '<table class="{css_grid}"><thead>{t_weekdayrow}</thead>{rows}</table>',
            weekdayrow: '<tr class="{css_weekdayrow}">{weekdays}</tr>',
            weekday: '<th class="{css_weekday}">{weekday}</th>', //used to create {weekdays}
            row: '<tr>{columns}</tr>', //used to create {rows}
            column: '<td class="{css}">{dspDay}</td>'
        },
        viewyear: {
            content: '<div class="{css_pane}">{t_header}<div class="{css_body}">{t_grid}</div></div>',
            header: '<div class="{css_header}">{t_prevyear}{t_headerlabel}{t_nextyear}</div>',
            prevyear: '<div class="{css_prevyear}">&#9668;</div>',
            nextyear: '<div class="{css_nextyear}">&#9658;</div>',
            headerlabel: '<div class="{css_header_label}"><span class="{css_year}">{year}</span></div>',
            grid: '<table class="{css_grid}">{rows}</table>',
            row: '<tr>{columns}</tr>', //used to create {rows}
            column: '<td class="{css}">{dspMonth}</td>'
        },
        viewdecade: {
            content: '<div class="{css_pane}">{t_header}<div class="{css_body}">{t_grid}</div></div>',
            header: '<div class="{css_header}">{t_prevdecade}{t_headerlabel}{t_nextdecade}</div>',
            prevdecade: '<div class="{css_prevdecade}">&#9668;</div>',
            nextdecade: '<div class="{css_nextdecade}">&#9658;</div>',
            headerlabel: '<div class="{css_header_label}"><span class="{css_decade}">{decade}</span></div>',
            grid: '<table class="{css_grid}">{rows}</table>',
            row: '<tr>{columns}</tr>', //used to create {rows}
            column: '<td class="{css}">{dspYear}</td>'
        }
    },
    fnAddDays = function (d, days) {
        var year = d.getFullYear(),
            month = d.getMonth(),
            day = d.getDate() + days;

        return new Date(year, month, day);
    },
    fnGetDecadeFirstYear = function (year) {
        var y1to3 = parseInt(year / 10, 10);
        return parseInt(y1to3 + '0', 10);
    };

Y.namespace('Icello');

/** 
* @class DateChooser
* @extends Widget
* @constructor
* @namespace Icello
*/
Y.Icello.DateChooser = Y.Base.create(
    BASENAME,
    Y.Widget,
    [Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.WidgetPositionConstrain, Y.WidgetAutohide],
    {
        initializer: function () {
            Y.log('', 'info', 'Datechooser initializer');

            /** 
            * The Date that the user has navigated to but not chosen necessarily
            * @property navdate
            * @type Date
            * @private
            */
            this.navdate = null;

            /** 
            * The Array of month abbreviations
            * @property monthsL
            * @type Array
            * @private
            */
            this.monthsL = this.getMonthsL(this.get('date'));

            /** 
            * The Array of weekday abbreviations
            * @property weekdaysL
            * @private
            */
            this.weekdaysL = this.getWeekdaysL(this.get('date'));

            this.inputNodeHandle = null;

            this.set('align', {
                node: this.get('inputNode'),
                points: [Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.BL]
            });
        },
        destructor: function () {
            Y.log('', 'info', 'Datechooser destructor');

            if (this.inputNodeHandle) {
                this.inputNodeHandle.detach();
            }
        },
        renderUI: function () {
            Y.log('', 'info', 'Datechooser renderUI');
            this.syncDates();
            this.renderViewMonth();
        },
        bindUI: function () {
            Y.log('', 'info', 'Datechooser bindUI');
            this.inputNodeHandle = this.get('inputNode').on('click', Y.bind(this.inputNodeClick, this));
            this.on('click', Y.bind(this.onClick, this));
            this.set('hideOn', [{ eventName: 'clickoutside'}]);
            this.after('dateChange', this.afterDateChange);
        },
        syncUI: function () {
            Y.log('', 'info', 'Datechooser syncUI');

        },
        onClick: function (e) {
            Y.log('', 'info', 'Datechooser onClick');
            var n = e.domEvent.target;

            if (n.hasClass(styles.viewmonth.css_day)) {
                this.onDayChoose(n.getContent());
            } else if (n.hasClass(styles.viewmonth.css_nextmonth)) {
                this.onMonthChoose(IDate.addMonths(this.navdate, 1));
            } else if (n.hasClass(styles.viewmonth.css_prevmonth)) {
                this.onMonthChoose(IDate.addMonths(this.navdate, -1));
            } else if (n.hasClass(styles.viewmonth.css_monthyear)) {
                this.onYearChoose(this.navdate);
            } else if (n.hasClass(styles.viewyear.css_nextyear)) {
                this.onYearChoose(YDate.addYears(this.navdate, 1));
            } else if (n.hasClass(styles.viewyear.css_prevyear)) {
                this.onYearChoose(YDate.addYears(this.navdate, -1));
            } else if (n.hasClass(styles.viewyear.css_month)) {
                this.onMonthChoose(this.getMonthChosenFromContent(n.getContent()));
            } else if (n.hasClass(styles.viewyear.css_year)) {
                this.onDecadeChoose(new Date(parseInt(n.getContent(), 10), this.navdate.getMonth(), this.navdate.getDate()));
            } else if (n.hasClass(styles.viewdecade.css_year)) {
                this.onYearChoose(new Date(parseInt(n.getContent(), 10), this.navdate.getMonth(), this.navdate.getDate()));
            } else if (n.hasClass(styles.viewdecade.css_nextdecade)) {
                this.onDecadeChoose(YDate.addYears(this.navdate, 10));
            } else if (n.hasClass(styles.viewdecade.css_prevdecade)) {
                this.onDecadeChoose(YDate.addYears(this.navdate, -10));
            }

            e.domEvent.halt(true);
        },
        getMonthChosenFromContent: function (content) {
            Y.log('', 'info', 'Datechooser getMonthChosenFromContent');

            var monthIndex = -1;
            Y.Array.each(this.monthsL, function (v, i) {
                if (v === content) {
                    monthIndex = i;
                }
            });

            return new Date(this.navdate.getFullYear(), monthIndex, this.navdate.getDate());
        },
        onDayChoose: function (dayChosen) {
            Y.log('', 'info', 'Datechooser onDayChoose');
            var date = this.navdate,
                year = date.getFullYear(),
                month = date.getMonth(),
                newDate = new Date(year, month, dayChosen),
                newDateDsp = (month + 1) + '/' + dayChosen + '/' + year;

            this.set('date', newDate, {source: UI_SRC});
            this.navdate = this.get('date');

            this.get('inputNode').set('value', newDateDsp);

            this.renderViewMonth();

            this.hide();
            this.fire('daySelect', { navdate: this.navdate });
        },
        onMonthChoose: function (newDate) {
            Y.log(newDate, 'info', 'DateChooser onMonthChoose');

            this.navdate = newDate;
            this.renderViewMonth();
            this.fire('monthSelect', { navdate: this.navdate });
        },
        onYearChoose: function (newDate) {
            Y.log(newDate, 'info', 'DateChooser onYearChoose');

            this.navdate = newDate;
            this.renderViewYear();
            this.fire('yearSelect', { navdate: this.navdate });
        },
        onDecadeChoose: function (newDate) {
            Y.log(newDate, 'info', 'DateChooser onDecadeChoose');

            this.navdate = newDate;
            this.renderViewDecade();
            this.fire('decadeSelect', { navdate: this.navdate });
        },
        afterDateChange: function (e) {
            Y.log('', 'info', 'DateChooser afterDateChange');
            if (e.source === UI_SRC) {
                return;
            }

            this.navdate = e.newVal;
            this.onDayChoose(this.navdate.getDate());
        },
        inputNodeClick: function () {
            Y.log('', 'info', 'DateChooser inputNodeClick');

            var hasDateChanged = false,
                oldDate = null,
                newDate = null;

            if (this.get('visible')) {
                this.hide();
                this.fire('inputClickHide');
            } else {
                oldDate = this.get('date');
                this.syncDates();
                newDate = this.get('date');

                hasDateChanged = !YDate.areEqual(oldDate, newDate);
                if (hasDateChanged) {
                    this.renderViewMonth();
                }

                this.show();
                this.fire('inputClickShow');
            }
        },
        syncDates: function () {
            Y.log('', 'info', 'Datechooser syncDates');
            this.set('date', this.get('inputNode').get('value'), {source: UI_SRC});
            this.navdate = this.get('date');
        },
        renderViewMonth: function () {
            Y.log('', 'info', 'Datechooser renderViewMonth');
            var contentBox = this.get(CBX);
            contentBox.empty();
            contentBox.appendChild(this.getViewMonthHTML());
        },
        renderViewYear: function () {
            Y.log('', 'info', 'Datechooser renderViewYear');
            var contentBox = this.get(CBX);
            contentBox.empty();
            contentBox.appendChild(this.getViewYearHTML());
        },
        renderViewDecade: function () {
            Y.log('', 'info', 'Datechooser renderViewDecade');
            var contentBox = this.get(CBX);
            contentBox.empty();
            contentBox.appendChild(this.getViewDecadeHTML());
        },
        getViewMonthHTML: function () {
            Y.log('this.navdate: ' + this.navdate, 'info', 'Datechooser getViewMonthHTML');

            var data = {},
                navdate = this.navdate,
                t = templates.viewmonth;

            Y.mix(data, styles.viewmonth);

            data.t_prevmonth = sub(t.prevmonth, data);
            data.t_nextmonth = sub(t.nextmonth, data);
            data.month = YDate.format(navdate, { format: '%B' });
            data.year = YDate.format(navdate, { format: '%Y' });
            data.t_headerlabel = sub(t.headerlabel, data);
            data.t_header = sub(t.header, data);

            data.weekdays = this.getViewMonthWeekdays();
            data.t_weekdayrow = sub(t.weekdayrow, data);
            data.rows = this.getViewMonthRows();
            data.t_grid = sub(t.grid, data);

            return sub(t.content, data);
        },
        getViewYearHTML: function () {
            Y.log('this.navdate: ' + this.navdate, 'info', 'Datechooser getViewYearHTML');

            var data = {},
                navdate = this.navdate,
                t = templates.viewyear;

            Y.mix(data, styles.viewyear);

            data.t_prevyear = sub(t.prevyear, data);
            data.t_nextyear = sub(t.nextyear, data);
            data.year = YDate.format(navdate, { format: '%Y' });
            data.t_headerlabel = sub(t.headerlabel, data);
            data.t_header = sub(t.header, data);

            data.rows = this.getViewYearRows();
            data.t_grid = sub(t.grid, data);

            return sub(t.content, data);
        },
        getViewDecadeHTML: function () {
            Y.log('this.navdate: ' + this.navdate, 'info', 'Datechooser getViewYearHTML');

            var data = {},
                navdate = this.navdate,
                t = templates.viewdecade,
                decadeFirstYear = fnGetDecadeFirstYear(navdate.getFullYear()),
                decadeLastYear = decadeFirstYear + 9;

            Y.mix(data, styles.viewdecade);

            data.t_prevdecade = sub(t.prevdecade, data);
            data.t_nextdecade = sub(t.nextdecade, data);
            data.decade = decadeFirstYear + '-' + decadeLastYear;
            data.t_headerlabel = sub(t.headerlabel, data);
            data.t_header = sub(t.header, data);

            data.rows = this.getViewDecadeRows();
            data.t_grid = sub(t.grid, data);

            return sub(t.content, data);
        },
        getViewMonthWeekdays: function () {
            Y.log('', 'info', 'Datechooser getViewMonthWeekdays');

            var weekdays = this.weekdaysL,
                t_weekday = templates.viewmonth.weekday,
                css_weekday = styles.viewmonth.css_weekday,
                sb = [];

            Y.Array.each(weekdays, function (weekday) {
                sb.push(sub(t_weekday, { weekday: weekday, css_weekday: css_weekday }));
            }, this);

            return sb.join('');
        },
        getWeekdaysL: function (todayDate) {
            Y.log('', 'info', 'Datechooser getWeekdaysL');

            var weekdays = [],
                today_num = YDate.format(todayDate, { format: '%w' }),
                daysToAdd = -(today_num),
                currDate = null,
                i = -1;

            for (i = 0; i < 7; i += 1) {
                currDate = fnAddDays(todayDate, daysToAdd);
                weekdays.push(YDate.format(currDate, { format: '%a' }));
                daysToAdd += 1;
            }
            return weekdays;
        },
        getViewMonthRows: function () {
            Y.log('', 'info', 'Datechooser getViewMonthRows');

            var sb = [],
                sbColumns = [],
                date = this.get('date'),
                navdate = this.navdate,
                dLastMonth = IDate.addMonths(navdate, -1),
                dFirstDayOfMonth = new Date(navdate.getFullYear(), navdate.getMonth(), 1),
                indexFirstDayOfMonth = dFirstDayOfMonth.getDay(),
                daysInMonth = YDate.daysInMonth(navdate),
                daysInLastMonth = YDate.daysInMonth(dLastMonth),
                i = 1,
                row = -1,
                column = -1,
                daydata = null,
                day = -1,
                dCurr = null;

            Y.log('navdate: ' + navdate, 'info', 'Datechooser getViewMonthRows');
            Y.log('daysInMonth: ' + daysInMonth, 'info', 'Datechooser getViewMonthRows');

            for (row = 0; row < 6; row += 1) {
                sbColumns = [];
                for (column = 0; column < 7; column += 1) {
                    daydata = { css: styles.viewmonth.css_day, dspDay: 0 };
                    day = i - indexFirstDayOfMonth;

                    if (day > daysInMonth) {
                        daydata.dspDay = day % daysInMonth;
                        daydata.css = styles.viewmonth.css_nextmonth_day;
                    } else if (day < 1) {
                        daydata.dspDay = daysInLastMonth + day;
                        daydata.css = styles.viewmonth.css_prevmonth_day;
                    } else {
                        daydata.dspDay = day;
                        dCurr = new Date(navdate.getFullYear(), navdate.getMonth(), day);
                        if (dCurr.getFullYear() === date.getFullYear() && dCurr.getMonth() === date.getMonth() && dCurr.getDate() === date.getDate()) {
                            daydata.css += ' ' + styles.viewmonth.css_day_selected;
                        }
                    }

                    sbColumns.push(sub(templates.viewmonth.column, daydata));

                    i += 1;
                } //end for column

                sb.push(sub(templates.viewmonth.row, { columns: sbColumns.join('') }));
            } //end for row

            return sb.join('');
        },
        getMonthsL: function (todayDate) {
            Y.log('', 'info', 'Datechooser getMonthsL');

            var months = [],
                today_num = YDate.format(todayDate, { format: '%m' }),
                monthsToAdd = -(today_num) + 1,
                currDate = null,
                i = -1;

            Y.log('todayDate: ' + todayDate, 'info', 'Datechooser getMonthsL');
            Y.log('today_num: ' + today_num, 'info', 'Datechooser getMonthsL');

            for (i = 0; i < 12; i += 1) {
                currDate = IDate.addMonths(todayDate, monthsToAdd);
                Y.log('currDate: ' + currDate, 'info', 'Datechooser getMonthsL');
                Y.log('monthsToAdd: ' + monthsToAdd, 'info', 'Datechooser getMonthsL');
                Y.log('monthDsp: ' + YDate.format(currDate, { format: '%b' }), 'info', 'Datechooser getMonthsL');
                months.push(YDate.format(currDate, { format: '%b' }));
                monthsToAdd += 1;
            }

            return months;
        },
        getViewYearRows: function () {
            Y.log('', 'info', 'Datechooser getViewYearRows');

            var sb = [],
                sbColumns = [],
                date = this.get('date'),
                navdate = this.navdate,
                monthsDspArray = this.monthsL,
                i = 0,
                row = -1,
                column = -1,
                monthdata = null,
                dCurr = null;

            for (row = 0; row < 3; row += 1) {
                sbColumns = [];
                for (column = 0; column < 4; column += 1) {
                    monthdata = { css: styles.viewyear.css_month, dspMonth: monthsDspArray[i] };

                    dCurr = new Date(navdate.getFullYear(), i, 1);
                    if (dCurr.getFullYear() === date.getFullYear() && dCurr.getMonth() === date.getMonth()) {
                        monthdata.css += ' ' + styles.viewyear.css_month_selected;
                    }

                    sbColumns.push(sub(templates.viewyear.column, monthdata));

                    i += 1;
                } //end for column

                sb.push(sub(templates.viewyear.row, { columns: sbColumns.join('') }));
            } //end for row

            return sb.join('');
        },
        getViewDecadeRows: function () {
            Y.log('', 'info', 'Datechooser getViewDecadeRows');

            var sb = [],
                sbColumns = [],
                date = this.get('date'),
                navdate = this.navdate,
                decadeFirstYear = fnGetDecadeFirstYear(navdate.getFullYear()),
                decadeLastYear = decadeFirstYear + 9,
                currYear = decadeFirstYear - 1,
                i = 0,
                row = -1,
                column = -1,
                yeardata = null;

            for (row = 0; row < 3; row += 1) {
                sbColumns = [];
                for (column = 0; column < 4; column += 1) {
                    yeardata = { css: styles.viewdecade.css_year, dspYear: currYear };

                    if (currYear === date.getFullYear()) {
                        yeardata.css += ' ' + styles.viewdecade.css_year_selected;
                    } else if (currYear < decadeFirstYear || currYear > decadeLastYear) {
                        yeardata.css += ' ' + styles.viewdecade.css_year_outsidedecade;
                    }
                    sbColumns.push(sub(templates.viewdecade.column, yeardata));

                    currYear += 1;
                    i += 1;
                } //end for column

                sb.push(sub(templates.viewdecade.row, { columns: sbColumns.join('') }));
            } //end for row

            return sb.join('');
        }

    },
    { //static members
        ATTRS: {
            /** 
            * The optional selected date of the calendar.
            * @attribute date
            * @type Date
            * @default today date
            */
            date: {
                value: new Date(),
                validator: function (val) {
                    var isValid = YDate.isValidDate(val),
                        dateParsed = Y.DataType.Date.parse(val);

                    Y.log(val + ' isValid: ' + isValid + '; dateParsed: ' + dateParsed, 'info', 'Datechooser date validator');

                    return isValid || dateParsed !== null;
                },
                setter: function (v) {
                    Y.log('', 'info', 'Datechooser date setter');

                    var vToReturn = null;

                    if (typeof v === 'string') {
                        vToReturn = Y.DataType.Date.parse(v);
                    } else {
                        vToReturn = v;
                    }

                    return vToReturn;
                }
            },
            height: {
                value: '150px',
                readOnly: true
            },
            width: {
                value: '225px',
                readOnly: true
            },
            /** 
            * The input type text element.
            * @attribute inputNode
            * @type Node|String
            */
            inputNode: {
                writeOnce: 'initOnly',
                setter: function (nodeOrId) {
                    Y.log('', 'info', 'Datechooser inputNode setter');
                    var node = nodeOrId;

                    if (typeof nodeOrId === 'string') {
                        node = Y.one(nodeOrId);
                    }

                    return node;
                }
            },
            visible: {
                value: false
            }
        }
    }
);




}, 'gallery-2012.05.16-20-37' ,{skinnable:true, requires:['widget', 'widget-position', 'widget-stack', 'widget-position-align', 'widget-position-constrain', 'widget-autohide', 'datatype-date', 'datatype-date-math', 'substitute', 'datatype-date-format', 'gallery-icello-date']});
