/**
 * [jquery.calendario.js] (v5.0.1) ~~[Copyright 2016, Boží Ďábel]~~
 */

+function ($) {
  'use strict';

  var Calendario = function (element, options) {
    this.init('calendario', element, options)
  }

  Calendario.INFO = {
    EMAIL : '%email%',
	FEED : '%feed%',
	NAME : 'HangingTime!',
	VERSION : '5.0.1',
	UNIQUE : '%unique%',
	USER : '%user%',
	UPDATEURL : '%url%'
  }

  Calendario.DEFAULTS = {
    weeks : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    weekabbrs : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthabbrs : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    displayWeekAbbr : false,
    displayMonthAbbr : false,
    startIn : 1,
    fillEmpty: true,
    zone: '00:00',
	events : ['click', 'focus'],
    checkUpdate: true,
    weekdays: 'MON, TUE, WED, THU, FRI',
    weekends: 'SAT, SUN',
    format: 'MM-DD-YYYY',
    feed: 'http://calendario.t15.org/sync/'
  }

  Calendario.prototype.init = function (type, element, options) {
    this.INFO      = Calendario.INFO
    this.type      = type
    this.$element  = $(element)
    this.options   = $.extend({}, Calendario.DEFAULTS, this.$element.data(), options)
    this.today     = new Date()
    this.month     = (isNaN(this.options.month) || this.options.month === null) ? this.today.getMonth() : this.options.month - 1
    this.year      = (isNaN(this.options.year) || this.options.year === null) ? this.today.getFullYear() : this.options.year
    this.caldata   = this.processCaldata(this.options.caldata)
    this.curData   = []
    this.syncData  = {}
    this.generateTemplate()
    this.initEvents()
  }

  Calendario.prototype.sync = function (data) {
    var self = this
    $.post(self.options.feed, {info: self.INFO, caldata: data, domain: document.domain}, function(d){ self.syncData = d }, 'json')
    return data
  }

  Calendario.prototype.initEvents = function () {
    this.$element.on(this.options.events.join('.calendario ').trim() + '.calendario', 'div.fc-row > div:not(:empty)', function(e) {
      $(this).trigger($.Event('onDay' + e.type.charAt(0).toUpperCase() + e.type.slice(1)), [$(this).data('bz.calendario.dateprop')])
    })
  }
  
  Calendario.prototype.propDate = function () {
    var self = this, month, year, day, hc, tdata, data
    this.$element.find('div.fc-row > div').filter(':not(:empty)').each(function() {
      hc = $(this).children('span.fc-date').hasClass('fc-emptydate'), day = $(this).children('span.fc-date').text()
      month = (hc && day <= 31 && day >= 24 ? self.month - 1 : (hc && day >= 1 && day <= 7 ? self.month + 1 : self.month))
      year = (month == 12 ? self.year + 1 : (month == -1 ? self.year - 1 : self.year))
      month = (month == 12 ? 0 : (month == -1 ? 11 : month))
	  tdata = self.curData[day] ? self.curData[day] : false
	  if(tdata) {
        data = {html: [], allDay: [], startTime: [], endTime: [], note: [], content: [], url: []}
        $.each(tdata.startTime, function(i, v){
			if(v.getDate() == day && v.getMonth() == month && v.getFullYear() == year) {
				data.startTime.push(v)
				data.endTime.push(tdata.endTime[i])
				data.allDay.push(tdata.allDay[i])
				data.html.push(tdata.html[i])
				data.note.push(tdata.note[i])
				data.content.push(tdata.content[i])
				data.url.push(tdata.url[i])
			}
		});
		if(data.html.length == 0) data = false
	  } else {
		  data = false
	  }
      var dateProp = {
        'day' : $(this).children('span.fc-date').text(),
        'month' : month + 1,
        'monthname' : self.options.displayMonthAbbr ? self.options.monthabbrs[month] : self.options.months[month],
        'year' : year,
        'weekday' : $(this).index() + self.options.startIn,
        'weekdayname' : self.options.weeks[($(this).index() == 6 ? 0 : $(this).index() + self.options.startIn)],
        'data' : data
      }
      $(this).data('bz.calendario.dateprop', dateProp)
    })
  }

  Calendario.prototype.insertToCaldata = function(key, c, date, data, f) {
    if(!data[key]) data[key] = []
    c.repeat ? c.day = [date[f.DD], c.endDate.split('-')[f.DD]] : c.day = [date[f.DD], date[f.DD]]
    c.repeat ? c.month = [date[f.MM], c.endDate.split('-')[f.MM]] : c.month = [date[f.MM], date[f.MM]]
    c.repeat ? c.year = [date[f.YYYY], c.endDate.split('-')[f.YYYY]] : c.year = [date[f.YYYY], date[f.YYYY]]
    c.category = c.category ? 'calendar-' + c.category.split('-').pop() : 'calendar-default'
    return data[key].push(c) ? data : data
  }

  Calendario.prototype.processCaldata = function (obj) {
    var data = {}, self = this
	var format = {}
	$.each(this.options.format.toUpperCase().split('-'), function(key, val) {
		format[val] = key
	})
    $.each(obj, function(key, val){
      $.each(val, function(i, c){
        if(c.repeat == 'INTERVAL' || c.repeat == 'EVERYDAY') c.repeat = 'MON, TUE, WED, THU, FRI, SAT, SUN'
        else if(c.repeat == 'WEEKDAYS') c.repeat = self.options.weekdays
        else if(c.repeat == 'WEEKENDS') c.repeat = self.options.weekends
        if($.inArray(c.repeat, [undefined, 'YEARLY', 'MONTHLY']) != -1) data = self.insertToCaldata(parseInt(key.split('-')[format.DD]), c, key.split('-'), data, format)
        else if(c.repeat) {
          $.each(c.repeat.split(','), function(v, k){
            data = self.insertToCaldata(k.trim(), $.extend(c, {repeat: 'WEEKLY'}), key.split('-'), data, format)
          })
        }
      })
    })
    return self.sync(data)
  }

  Calendario.prototype.toDObj = function(time, day) {
    var zoneH = parseInt(this.options.zone.split(':')[0])
    var zoneM = parseInt(this.options.zone.charAt(0) + this.options.zone.split(':')[1])
    var hour = parseInt(time.split(':')[0]) - zoneH
    var minutes = parseInt(time.split(':')[1]) - zoneM
    return new Date(Date.UTC(this.year, this.month, day, hour, minutes, 0, 0))
  }

  Calendario.prototype.parseDay = function(c, day) {
    if(!this.curData[day]) this.curData[day] = {html: [], allDay: [], startTime: [], endTime: [], note: [], content: [], url: []}
    c.allDay  ? this.curData[day].allDay.push(true) : this.curData[day].allDay.push(false)
    c.allDay  ? this.curData[day].startTime.push(this.toDObj('00:00', day)) : this.curData[day].startTime.push(this.toDObj(c.startTime, day))
    c.allDay  ? this.curData[day].endTime.push(this.toDObj('23:59', day)) : this.curData[day].endTime.push(this.toDObj(c.endTime, day))
    c.note    ? this.curData[day].note.push(c.note) : this.curData[day].note.push('')
	c.content ? this.curData[day].content.push(c.content) : this.curData[day].content.push('')
	c.url     ? this.curData[day].url.push(c.url) : this.curData[day].url.push('')
    var i = c.url ? this.curData[day].html.push('<a class="' + c.category + '" href="' + c.url + '">' + c.content +'</a>') - 1
                  : this.curData[day].html.push('<span class="' + c.category + '">' + c.content + '</span>') - 1
    this.curData[day].html[i] += '<time class="fc-allday" datetime="' + this.curData[day].allDay[i] + '"></time>'
    this.curData[day].html[i] += '<time class="fc-starttime" datetime="' + this.curData[day].startTime[i].toISOString() + '"></time>'
    this.curData[day].html[i] += '<time class="fc-endtime" datetime="' + this.curData[day].endTime[i].toISOString() + '"></time>'
    this.curData[day].html[i] += '<note>' + this.curData[day].note[i] + '</note>'
	this.isProperlyParsed = true
  }

  Calendario.prototype.parseDataToDay = function(data, day, dbobj) {
    var self = $.extend({}, this, dbobj)
	self.isProperlyParsed = false
    $.each(data, function(i, c) {
      if(!c) {/*ignore*/}
      else if(c.repeat == 'YEARLY' || c.repeat == 'MONTHLY' || c.repeat == 'WEEKLY') {
        if(self.year >= c.year[0] && self.year <= c.year[1]) {
          if(c.repeat == 'YEARLY' && (self.month + 1) == c.month[0]) self.parseDay(c, day)
          if(self.year == c.year[0] && (self.month + 1) >= c.month[0]) {
            if(c.repeat == 'MONTHLY') self.parseDay(c, day)
            if(c.repeat == 'WEEKLY') {
              if(c.month[0] + c.year[0] == c.month[1] + c.year[1]) {
                if(c.month[0] == (self.month + 1) && c.day[1] >= day && day >= c.day[0]) self.parseDay(c, day)
              } else if(c.month[0] == (self.month + 1) && day >= c.day[0]) self.parseDay(c, day)
              else if(c.year[0] == c.year[1] && c.month[1] > (self.month + 1) && c.month[0] < (self.month + 1)) self.parseDay(c, day)
              else if(c.year[0] == c.year[1] && c.month[1] == (self.month + 1) && day <= c.day[1]) self.parseDay(c, day)
              else if(c.year[0] != c.year[1] && c.month[0] < (self.month + 1)) self.parseDay(c, day)
            }
          } else if(c.year[0] < self.year && self.year < c.year[1]) {
            if(c.repeat == 'MONTHLY' || c.repeat == 'WEEKLY') self.parseDay(c, day)
          } else if((self.month + 1) <= c.month[1] && self.year == c.year[1]) {
            if(c.repeat == 'MONTHLY') self.parseDay(c, day)
            if(c.repeat == 'WEEKLY' && day <= c.day[1] && (self.month + 1) == c.month[1]) self.parseDay(c, day)
            else if(c.repeat == 'WEEKLY' && c.year[0] != c.year[1] && (self.month + 1) < c.month[1]) self.parseDay(c, day)
          }
        }
      } else if(self.year == c.year[0] && (self.month + 1) == c.month[0]) self.parseDay(c, day)
    })
    if(this.curData[day] && self.isProperlyParsed) return '<div class="fc-calendar-event">' + this.curData[day].html.join('</div><div class="fc-calendar-event">') + '</div>'
    else return ''
  }

  Calendario.prototype.generateTemplate = function(callback) {
    this.curData = []
    var head     = this.getHead()
    var body     = this.getBody()
    var rowClass = ''

    if(this.rowTotal == 4) rowClass = 'fc-four-rows'
    else if(this.rowTotal == 5) rowClass = 'fc-five-rows'
    else if(this.rowTotal == 6) rowClass = 'fc-six-rows'

    this.$cal = $('<div class="fc-calendar ' + rowClass + '">').append(head, body)
    this.$element.find('div.fc-calendar').remove().end().append(this.$cal)
    this.propDate()
    this.$element.trigger($.Event('shown.calendar.calendario'))
    if(callback) callback.call()
    return true
  }

  Calendario.prototype.getHead = function () {
    var html = '<div class="fc-head">', pos, j
    for(var i = 0; i <= 6; i++) {
      pos = i + this.options.startIn
      j = pos > 6 ? pos - 6 - 1 : pos
      html += '<div>' + (this.options.displayWeekAbbr ? this.options.weekabbrs[j] : this.options.weeks[j]) + '</div>'
    }
    return html + '</div>'
  }

  Calendario.prototype.getBody = function() {
    var d            = new Date(this.year, this.month + 1, 0)
    var monthLength  = d.getDate()
    var firstDay     = new Date(this.year, d.getMonth(), 1)
    var pMonthLength = new Date(this.year, this.month, 0).getDate()
    var html         = '<div class="fc-body"><div class="fc-row">'
    var day          = 1
	var month        = 1
	var year         = 1
	var empDay       = 1
    var startingDay  = firstDay.getDay()
    var pos          = 0
    var p            = 0
    var inner        = ''
    var today        = false
    var past         = false
    var content      = ''
    var idx          = 0
    var data         = ''
	var dbobj        = {}
    var cellClasses  = ''

    for (var i = 0; i < 7; i++) {
      for (var j = 0; j <= 6; j++) {
        pos     = startingDay - this.options.startIn
        p       = pos < 0 ? 6 + pos + 1 : pos
        inner   = ''
        today   = this.month === this.today.getMonth() && this.year === this.today.getFullYear() && day === this.today.getDate()
        past    = this.year < this.today.getFullYear() || this.month < this.today.getMonth() && this.year === this.today.getFullYear() ||
                  this.month === this.today.getMonth() && this.year === this.today.getFullYear() && day < this.today.getDate()
        content = ''
        idx     = j + this.options.startIn > 6 ? j + this.options.startIn - 6 - 1 : j + this.options.startIn
        dbobj   = {}

        if(this.options.fillEmpty && (j < p || i > 0)) {
          if(day > monthLength) {
            empDay = day++ - monthLength
			year = (this.month + 1) == 12 ? this.year + 1 : this.year
            month = (this.month + 1) == 12 ? 0 : this.month + 1
          } else if (day == 1) {
            empDay = pMonthLength++ - p + 1
			year = (this.month - 1) == -1 ? this.year - 1 : this.year
			month = (this.month - 1) == -1 ? 11 : this.month - 1
          }
          if(day > monthLength || day == 1) {
		    today = month === this.today.getMonth() && year === this.today.getFullYear() && empDay === this.today.getDate()
            past = year < this.today.getFullYear() || month < this.today.getMonth() && year === this.today.getFullYear() ||
                   month === this.today.getMonth() && year === this.today.getFullYear() && empDay < this.today.getDate()
            dbobj = {'month': month, 'year': year}
			inner = '<span class="fc-date fc-emptydate">' + empDay + '</span><span class="fc-weekday">' + this.options.weekabbrs[idx] + '</span>'
		    data = Array.prototype.concat(this.caldata[empDay], this.caldata[this.options.weekabbrs[idx].toUpperCase()])
            .sort(function(a, b){
              return (a.allDay ? '00:00' : a.startTime).replace(':','') - (b.allDay ? '00:00' : b.startTime).replace(':','')
            })
		    if(data) content += this.parseDataToDay(data, empDay, dbobj)
            if(content !== '') inner += '<div class="fc-calendar-events">' + content + '</div>'
		  }
        }
          
        if (day <= monthLength && (i > 0 || j >= p)) {
          inner = '<span class="fc-date">' + day + '</span><span class="fc-weekday">' + this.options.weekabbrs[idx] + '</span>'
          data = Array.prototype.concat(this.caldata[day], this.caldata[this.options.weekabbrs[idx].toUpperCase()])
          .sort(function(a, b){
            return (a.allDay ? '00:00' : a.startTime).replace(':','') - (b.allDay ? '00:00' : b.startTime).replace(':','')
          })
          if(data) content += this.parseDataToDay(data, day, dbobj)
          if(content !== '') inner += '<div class="fc-calendar-events">' + content + '</div>'
          ++day;
        }

        cellClasses = (today ? 'fc-today ' : (past ? 'fc-past ' : 'fc-future ')) + (content !== '' ? 'fc-content' : '')
        html += (cellClasses !== '' ? '<div class="' + cellClasses.trim() + '">' : '<div>') + inner + '</div>'
      }

      if(day > monthLength) {
        this.rowTotal = i + 1
        break
      } else html += '</div><div class="fc-row">'
    }
    return html + '</div></div>'
  }

  Calendario.prototype.move = function(period, dir, callback) {
    if(dir === 'previous') {
      if(period === 'month') {
        this.year = this.month > 0 ? this.year : --this.year
        this.month = this.month > 0 ? --this.month : 11
      } else if(period === 'year') this.year = --this.year
    } 
    else if(dir === 'next') {
      if(period === 'month'){
        this.year = this.month < 11 ? this.year : ++this.year
        this.month = this.month < 11 ? ++this.month : 0
      } else if(period === 'year') this.year = ++this.year
    }
    return this.generateTemplate(callback)
  }

  Calendario.prototype.option = function(option, value) {
    if(value) return this.options[option] = value
    else return this.options[option]
  }
  
  Calendario.prototype.getYear = function() {
    return this.year
  }

  Calendario.prototype.getMonth = function() {
    return this.month + 1
  }

  Calendario.prototype.getMonthName = function() {
    return this.options.displayMonthAbbr ? this.options.monthabbrs[this.month] : this.options.months[this.month]
  }
  
  Calendario.prototype.getCell = function(day, data) {
    if (!data) return this.$cal.find("span.fc-date").filter(function(){return $(this).text() == day}).parent()
    else return this.$cal.find("span.fc-date").filter(function(){return $(this).text() == day}).parent().data('bz.calendario.dateprop')
  }

  Calendario.prototype.setData = function(caldata, clear) {
    if(clear) this.caldata = this.processCaldata(caldata)
    else $.extend(this.caldata, this.processCaldata(caldata))
    return this.generateTemplate()
  }

  Calendario.prototype.gotoNow = function(callback) {
    this.month = this.today.getMonth()
    this.year = this.today.getFullYear()
    return this.generateTemplate(callback)
  }

  Calendario.prototype.gotoMonth = function(month, year, callback) {
    this.month = month - 1
    this.year = year
    return this.generateTemplate(callback);
  }

  Calendario.prototype.gotoPreviousMonth = function(callback) {
    return this.move('month', 'previous', callback)
  }

  Calendario.prototype.gotoPreviousYear = function(callback) {
    return this.move('year', 'previous', callback)
  }

  Calendario.prototype.gotoNextMonth = function(callback) {
    return this.move('month', 'next', callback)
  }

  Calendario.prototype.gotoNextYear = function(callback){
    return this.move('year', 'next', callback)
  }

  Calendario.prototype.feed = function() {
    return this.syncData.feed ? this.syncData.feed : 'not-available'
  }

  Calendario.prototype.version = function() {
    return this.INFO.VERSION
  }

  function Plugin(option, value1, value2, value3) {
    var val = ''
    this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bz.calendario')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bz.calendario', (data = new Calendario(this, options)))
      if (typeof option == 'string' && $.isFunction(data[option])) return val = data[option](value1, value2, value3)
      else if (typeof option == 'string') return val = data['option'](value1, value2)
    })
    if(val) return val
    else $(document).trigger($.Event('finish.calendar.calendario'))
  }

  var old = $.fn.calendario

  $.fn.calendario             = Plugin
  $.fn.calendario.Constructor = Calendario

  $.fn.calendario.noConflict = function () {
    $.fn.calendario = old
    return this
  }  
}(jQuery);
