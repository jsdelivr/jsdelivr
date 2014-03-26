YUI.add('gallery-datetime-range', function (Y, NAME) {

"use strict";

/**
 * @module gallery-datetime-range
 */

/**********************************************************************
 * Manages a pair of Y.DateTime instances.  The ending date is constrained
 * by the min, max, and blackout ranges configured on the startDateTime
 * instance.  The range is not allowed to span a blackout, so if the start
 * date is between two blackout ranges, then the end date must be after the
 * start date and before the start of the next blackout range.
 * 
 * @main gallery-datetime-range
 * @class DateTimeRange
 * @extends Base
 * @constructor
 * @param config {Object}
 */

function DateTimeRange(config)
{
	DateTimeRange.superclass.constructor.apply(this, arguments);
}

DateTimeRange.NAME = "datetimerange";

function isDateTime(v)
{
	return (v instanceof Y.DateTime);
}

DateTimeRange.ATTRS =
{
	/**
	 * Instance of `Y.DateTime` that stores the start time.  The min and
	 * max dates and any blackout ranges must be configured on this object.
	 * 
	 * @attribute startDateTime
	 * @type {DateTime}
	 * @required
	 * @writeonce
	 */
	startDateTime:
	{
		validator: isDateTime,
		writeOnce: true
	},

	/**
	 * Instance of `Y.DateTime` that stores the end time.
	 * 
	 * @attribute endDateTime
	 * @type {DateTime}
	 * @required
	 * @writeonce
	 */
	endDateTime:
	{
		validator: isDateTime,
		writeOnce: true
	}
};

function updateEndDateTime()
{
	var sdt = this.get('startDateTime'),

		min_date_time = sdt.getDateTime() || sdt.get('minDateTime'),
		max_date_time = sdt.get('maxDateTime'),

		min_t = min_date_time ? min_date_time.date.getTime() : 0,
		max_t = max_date_time ? max_date_time.date.getTime() : 0,

		blackouts = sdt.get('blackouts').slice(0);

	// adjust max_t based on blackouts

	var found = false;

	blackouts.push([max_t, max_t]);
	for (var i=blackouts.length-2; i>=0; i--)
	{
		if (blackouts[i][1] < min_t)
		{
			max_t = blackouts[i+1][0];
			found = true;
			break;
		}
	}

	if (!found)
	{
		max_t = blackouts[0][0];
	}

	// set min/max on endDateTime

	var edt = this.get('endDateTime'),
		max = edt.get('maxDateTime');

	if (!max || min_t < max.date.getTime())
	{
		edt.set('minDateTime', min_date_time);
		min_t = -1;
	}

	edt.set('maxDateTime', max_t > 0 ? max_t : null);

	if (min_t > 0)
	{
		edt.set('minDateTime', min_date_time);
	}
}

Y.extend(DateTimeRange, Y.Base,
{
	initializer: function()
	{
		var self = this,
			sdt  = this.get('startDateTime');

		var origSClearDateTime = sdt.clearDateTime;
		sdt.clearDateTime = function()
		{
			origSClearDateTime.apply(this, arguments);
			updateEndDateTime.call(self);
		};

		// constraints

		sdt.on('limitsEnforced', updateEndDateTime, this);
		sdt.on('minDateTimeChange', updateEndDateTime, this);
		sdt.on('maxDateTimeChange', updateEndDateTime, this);
		sdt.on('blackoutsChange', updateEndDateTime, this);

		updateEndDateTime.call(this);
	}
});

Y.DateTimeRange = DateTimeRange;


}, 'gallery-2014.02.13-03-13', {"requires": ["gallery-datetime"]});
