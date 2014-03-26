YUI.add('gallery-time-format', function(Y) {

    /**
     * DateTime Utility
     * Built on top of YUI datatype-date to display
     * absolute / relative datetime format
     * @module gallery-time-format
     */

    // refer: http://en.wikipedia.org/wiki/ISO_8601
    var ISO8601_REGEX = /(\d{4})-?(\d{2})(?:-?(\d{2}))?T(\d{2}):(\d{2})(?::(\d{2}))?(\+\d{2}|Z|)/,
        EMPTY_STRING = '';

    /**
     * ISO8601 polyfill to accept hyphen-omitted input
     *
     * @private
     * @method toDate
     * @param {String} iso8601DateTime ISO8601 datetime string
     * @return Date native Date object, or empty string if given value is invalid
     */
    function toDate(iso8601DateTime) {
        var date = new Date(null),
            dt = iso8601DateTime.match(ISO8601_REGEX),
            designator;

        if (!dt) {
            Y.log('input time is not in ISO8601 format', 'error');
            return EMPTY_STRING;
        }

        // skip input
        dt.shift();
        designator = dt.pop();

        date.setFullYear(dt.shift(), dt.shift() - 1, dt.shift());
        if (dt[0]) { date.setUTCHours(dt.shift()); }
        if (dt[0]) { date.setUTCMinutes(dt.shift()); }
        if (dt[0]) { date.setUTCSeconds(dt.shift()); }

        return date;
    }

    /**
     * @public
     * @method format
     * @param {String|Object} oDate ISO8601 datetime string or native Date object
     * @param {String|Object} oConfig (optional) configuration objects, fallback >
     * @param {Number} relativeDelta upperbound (in seconds) given to decide to s>
     * @param {Date} from a Date object to compare with
     * @return formatted string
     */
    Y.Do.before(function (oDate, oConfig) {
        var relativeDelta,
            advice,
            from;

        if (Y.Lang.isString(oDate)) {
            oDate = toDate(oDate);
        }

        if (!oDate) {
            throw new Error("time is required");
        }

        oConfig = Y.Lang.isString(oConfig) ? { format: oConfig } : oConfig || {};
        relativeDelta = oConfig.relativeDelta || 0;
        from = oConfig.from || new Date();

        // based on AOP concept, we need a duck-punch mechanism (advice)
        // to alter original logic and arguments
        if (Y.Lang.isNumber(relativeDelta) && relativeDelta > 0 && from - oDate <= relativeDelta * 1000) {

            advice = Y.Do.after(function () {

                // detach after event avoid further processing
                Y.Do.detach(advice);

                return new Y.Do.AlterReturn('relative advice', Y.toRelativeTime(oDate, from));

            }, Y.DataType.Date, 'format');

            return new Y.Do.Prevent('return relative format instead');
        }

        return new Y.Do.AlterArgs('altered configs', [oDate, oConfig]);

    }, Y.DataType.Date, 'format');


}, 'gallery-2012.08.01-13-16' ,{requires:['datatype-date','gallery-torelativetime','event-custom-base'], skinnable:false});
