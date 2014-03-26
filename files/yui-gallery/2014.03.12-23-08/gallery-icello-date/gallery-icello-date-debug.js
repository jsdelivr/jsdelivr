YUI.add('gallery-icello-date', function(Y) {

'use strict';

Y.namespace('Icello.Date');

Y.Icello.Date.addMonths = function (date, months) {
    Y.log('', 'info', 'Icello Date addMonths');

    var dPlusMonths = null,
        dPlusMonthsDayOne = null,
        dPlusMonthsDayLast = null,
        inputMonth = date.getMonth() + months,
        expectedMonth = inputMonth % 12,
        d = null;

    dPlusMonths = new Date(date.getFullYear(), inputMonth, date.getDate());

    if (expectedMonth === dPlusMonths.getMonth()) {
        d = dPlusMonths;
    } else {
        dPlusMonthsDayOne = new Date(date.getFullYear(), inputMonth, 1);
        dPlusMonthsDayLast = new Date(dPlusMonthsDayOne.getFullYear(), dPlusMonthsDayOne.getMonth(), Y.DataType.Date.daysInMonth(dPlusMonthsDayOne));
        d = dPlusMonthsDayLast;
    }

    return d;
};

Y.Icello.Date.areDaysEqual = function (date1, date2) {
    Y.log('', 'info', 'Icello Date areDaysEqual');

    var y1 = date1.getFullYear(),
        y2 = date2.getFullYear(),
        m1 = date1.getMonth(),
        m2 = date2.getMonth(),
        d1 = date1.getDay(),
        d2 = date2.getDay();

    return y1 === y2 && m1 === m2 && d1 === d2;
};

Y.Icello.Date.formatShortDate = function (date) {
    Y.log('', 'info', 'Icello Date formatShortDate');
    var sb = [date.getMonth() + 1, '/', date.getDate(), '/', date.getFullYear()];
    return sb.join('');
};


}, 'gallery-2012.05.16-20-37' ,{requires:['datatype-date-math'], skinnable:false});
