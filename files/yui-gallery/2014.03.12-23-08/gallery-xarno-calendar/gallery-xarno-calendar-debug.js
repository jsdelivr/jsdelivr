YUI.add('gallery-xarno-calendar', function(Y) {

/**
 * @class Xarno.Calendar
 * @extends Widget
 * @version 1.0.0
 */
  var EVENT_SELECT = 'select',
      EVENT_UPDATE = 'update',
      DATE = 'date',
      LANG = Y.Lang;

  Y.namespace('Xarno').Calendar = Y.Base.create('xarno-calendar', Y.Widget, [Y.WidgetStdMod], {
    
    /**
     * Local storage of calendar node to prevent lookups
     *
     * @property _cal
     * @protected
     * @since 1.0.0
     */
    _cal : null,
    
    /**
     * Publishes events for update and select
     * 
     * @method initializer
     * @public
     * @since 1.0.0
     */
    initializer : function(config) {
      Y.log('initializer', 'info', 'Y.Xarno.Calendar');
      
      this.publish(EVENT_UPDATE, { defaultFn: this._defUpdateFn });
      this.publish(EVENT_SELECT, { defaultFn: this._defSelectFn });
    },
    
    /**
     * Builds the day name list and builds the calendar days
     * 
     * @method renderUI
     * @public
     * @since 1.0.0 
     */
    renderUI : function() {
      Y.log('renderUI', 'info', 'Y.Xarno.Calendar');
      
      this._cal = Y.Node.create(this.get('calendarTemplate'));
      this._buildDaysOfTheWeek();
      this._buildDays();
    },
    
    /**
     * Delegates the day clicks to fire the selected event. Binds a date
     *   change to update the calendar.
     * 
     * @method bindUI
     * @public
     * @since 1.0.0
     */
    bindUI : function() {
      Y.log('bindUI', 'info', 'Y.Xarno.Calendar');
      this.after('dateChange', function(e) {
        this.fire(EVENT_UPDATE);
      }, this);
      
      this._cal.delegate('click', function(e){
        this.fire(EVENT_SELECT, {click: e});
      }, '.liner', this);
    },
    
    /**
     * Adds the calendar to the body. This should be in renderUI but
     *   is not allowed to have mutiple updates in the renderUI method
     * 
     * @method syncUI
     * @public 1.0.0
     * @since 1.0.0
     */
    syncUI : function() {
      Y.log('syncUI', 'info', 'Y.Xarno.Calendar');
      this.setStdModContent('body', this._cal, 'after');
    },
    
    /**
     * Displays previous month
     * 
     * @method prevMonth
     * @public
     * @return Y.Xarno.Calendar
     * @chainable
     * @since 1.0.0
     */
    prevMonth : function() {
      Y.log('prevMonth', 'info', 'Y.Xarno.Calendar');
      var d = this.get(DATE);
      d.setMonth(d.getMonth() - 1);
      
      this.set(DATE, d);
      
      return this;
    },
    
    /**
     * Displays next month
     * 
     * @method nextMonth
     * @public
     * @return Y.Xarno.Calendar
     * @chainable
     * @since 1.0.0
     */
    nextMonth : function() {
      Y.log('nextMonth', 'info', 'Y.Xarno.Calendar');
      var d = this.get(DATE);
      d.setMonth(d.getMonth() + 1);
      
      this.set(DATE, d);
      
      return this;
    },
    
    /**
     * Displays previous year
     * 
     * @method prevYear
     * @public
     * @return Y.Xarno.Calendar
     * @chainable
     * @since 1.0.0
     */
    prevYear : function() {
      Y.log('prevYear', 'info', 'Y.Xarno.Calendar');
      var d = this.get(DATE);
      d.setFullYear(d.getFullYear() - 1);
      
      this.set(DATE, d);
      
      return this;
    },
    
    /**
     * Displays next year
     * 
     * @method nextYear
     * @public
     * @since 1.0.0
     * @return Y.Xarno.Calendar
     * @chainable
     */
    nextYear : function() {
      Y.log('nextYear', 'info', 'Y.Xarno.Calendar');
      var d = this.get(DATE);
      d.setFullYear(d.getFullYear() + 1);
      
      this.set(DATE, d);
      
      return this;
    },
    
    /**
     * Returns todays date as the date
     * 
     * @method _dateValueFn
     * @protected
     * @since 1.0.0
     */
    _dateValueFn : function(val) {
      Y.log('_setDate', 'info', 'Y.Xarno.Calendar');
      return new Date();
    },
    
    /**
     * Sets the value of the start of the week to zero, unless one requested
     * 
     * @method _weekStartSetter
     * @protected
     * @since 1.0.0
     */
    _weekStartSetter : function(val) {
      Y.log('_weekStartSetter', 'info', 'Y.Xarno.Calendar');
      return (val) ? 1 : 0;
    },
    
    /**
     * Gets the current month and hides the days that are not visible
     *   for the month and hides days not visible for the previous
     *   and next month, then selects dateSelected if it is in the
     *   current month
     * 
     * @method _defUpdateFn
     * @protected
     * @since 1.0.0
     */
    _defUpdateFn : function(e) {
      Y.log('_defUpdateFn', 'info', 'Y.Xarno.Calendar');
      
      // check for dates in range as selected
      var d = new Date(this.get(DATE)),
          ds = new Date(d), de = new Date(d),
          selected = this.get('dateSelected'),
          cal = this._cal, i, l, 
          weekStart = this.get('weekStart'),
          showDays = [], classNode = Y.Node.create('<b />'),
          visibleDays = 28 + weekStart;
        
      classNode.set('className', cal.get('className'));
        
      // set to last day of the month
      d.setMonth(d.getMonth() + 1); 
      d.setDate(0);
      
      // dates to show if any
      showDays = ['d29','d30','d31'].splice(0,  d.getDate() - 28);
      classNode.replaceClass('d[0-9]+', showDays.join(' '));
      visibleDays += showDays.length;

      // show days previous
      d.setDate(0); 
      
      // loop through the days and add classnames for shown days
      showDays = [];
      if ( d.getDate() - (d.getDate() - d.getDay() + weekStart) < 7) {
        for (i = d.getDate() - d.getDay() + weekStart, l = d.getDate(); i <= l; i++) {
          showDays.push('p' + i);
        }
        visibleDays += showDays.length;
      }
      classNode.replaceClass('p[0-9]+', showDays.join(' '));
      
      // show days next. 6 rows * 7 days per row = 42 days total
      showDays = [];
      for ( i=1, l = 42 - (visibleDays - weekStart); i <= l; i++ ) {
        showDays.push('n' + i);
      }
      classNode.replaceClass('n[0-9]+', showDays.join(' '));
      
      // update calendar classname
      cal.set('className', classNode.get('className'));

      
      // highlight selected
      if (selected) {
        ds.setDate(1);
        de.setMonth(de.getMonth() + 1); de.setDate(0); // last day of current month
        
        if(ds <= selected && de >= selected) {
          this._cal.one('.day-' + selected.getDate()).addClass('selected');
          return;
        }
      }
      this._cal.all('.selected').removeClass('selected');
      
    },
    
    /**
     * Selects the date clicked to the dateSelected. If the date clicked
     *   is in the previous or next month, the calendar is updated to 
     *   that month
     * 
     * @method _defSelectFn
     * @protected
     * @since 1.0.0
     */
    _defSelectFn : function(e) {
      Y.log('_defSelectFn', 'info', 'Y.Xarno.Calendar');
      e = e.click;

      var d = new Date(this.get(DATE)), 
        day = e.currentTarget.ancestor();
      
      this._cal.all('.selected').removeClass('selected');
      
      if (day.hasClass('previous')) {
        d.setMonth(d.getMonth() - 1);
        d.setDate(e.currentTarget.get('text'));
        this.set('dateSelected', d);
        this.prevMonth();
        return;
      } else if (day.hasClass('next')) {
        d.setMonth(d.getMonth() + 1);
        d.setDate(e.currentTarget.get('text'));
        this.set('dateSelected', d);
        this.nextMonth();
        return;
      }
      
      day.addClass('selected');
      d.setDate(e.currentTarget.get('text'));
      this.set('dateSelected', d);
      
    },
    
    /**
     * Builds a list of the names of the days of the week
     * 
     * @method _buildDaysOfTheWeek
     * @protected
     * @since 1.0.0
     */
    _buildDaysOfTheWeek : function() {
      var days = this.get('daysOfTheWeek'),
          weekStart = this.get('weekStart'),
          dayList = '', i, l;
        
        if(weekStart > 0) {
          days.push(days.splice(0, weekStart));
        }
        
        dayList = '<ul class="day-list">';
        for ( i=0, l= days.length; i<l; i++) {
              dayList += '<li class="day-name"><span class="liner">' + days[i] + '</span></li>';
        }
        dayList += '</ul>';
        
      this.setStdModContent('body', dayList);
    },
    
    /**
     * Builds a list of the days to be used in the calendar
     * 
     * @method _buildDays
     * @protected
     * @since 1.0.0
     */
    _buildDays : function() {
      Y.log('_build', 'info', 'Y.Xarno.Calendar');
      var days = '', i, l,
          d = this.get('dayTemplate'),
          p = this.get('previousDayTemplate'),
          n = this.get('nextDayTemplate');
      
      // previous days
      for (i=22, l=31; i <= l; i++) {
        days += LANG.sub(p, { count: i});
      }
      
      // current days
      for (i=1, l=31; i <= l; i++) {
        days += LANG.sub(d, { count: i});
      }
      
      // next days
      for (i=1, l=14; i <= l; i++) {
        days += LANG.sub(n, { count: i});
      }
      
      // add days
      this._cal.setContent(days);
      
      // notify of update
      this.fire(EVENT_UPDATE);
    }
    
    
  }, {
    ATTRS : {
    
      /**
       * Current date
       * 
       * @property date
       * @since 1.0.0
       */
      date : {
        valueFn : '_dateValueFn'
      },
      
      /**
       * Current date selected
       * 
       * @property dateSelected
       * @since 1.0.0
       */
      dateSelected : {
        value : null
      },
      
      /**
       * List of the days of the week to be displayed above each column
       * 
       * @property daysOfTheWeek
       * @since 1.0.0
       */
      daysOfTheWeek : {
        value : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
      },
      
      /**
       * Sets the calendar start week to either Sunday(0) or Monday(1)
       * 
       * @property weekStart
       * @since 1.0.0
       */
      weekStart : {
        value : 0,
        setter : '_weekStartSetter'
      },
      
      /**
       * Template to be used for the calendar. The parent node will be
       *   used if a nested template is provided.
       * 
       * @property calendarTemplate
       * @since 1.0.0
       */
      calendarTemplate : {
        value : '<ul />'
      },
      
      /**
       * Template used for each day of the current month.
       * 
       * @property dayTemplate
       * @since 1.0.0
       */
      dayTemplate : {
        value : '<li class="day day-{count}"><a class="liner">{count}</a></li>'
      },
      
      /**
       * Template used for each day of the previous month.
       * 
       * @property previousDayTemplate
       * @since 1.0.0
       */
      previousDayTemplate : {
        value : '<li class="day previous previous-day-{count}"><span class="liner">{count}</span></li>'
      },
      
      /**
       * Template used for each day of the next month.
       * 
       * @property nextDayTemplate
       * @since 1.0.0
       */
      nextDayTemplate : {
        value : '<li class="day next next-day-{count}"><span class="liner">{count}</span></li>'
      }
    }
  });


}, 'gallery-2011.02.02-21-07' ,{requires:['base-build','widget','widget-stdmod']});
