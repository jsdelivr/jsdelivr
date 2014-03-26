YUI.add('gallery-patch-340-multicalendar', function(Y) {

Y.CalendarBase.prototype.initializer = function () {
  this._paneProperties = {};
  this._calendarId = Y.guid('calendar');
  this._selectedDates = {};
  this._rules = {};
  this.storedDateCells = {};
};


}, 'gallery-2011.08.24-23-44' ,{requires:['calendar-base']});
