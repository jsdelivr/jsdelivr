YUI.add('gallery-md-timespinner', function (Y, NAME) {

/*js lint white: true, nomen: true, maxerr: 50, indent: 4 */
/*gl obal Y*/
/**
* Shows and accepts a time via a set of spinners.
* It can run showing the current time.
* @module gallery-md-timespinner
*/
"use strict";

var Spinner = Y.Spinner,
    Lang = Y.Lang,
    CBX = 'contentBox',
    BBX = 'boundingBox',
    CHANGE = 'Change',
    VALUE = 'value',
    UI = 'ui',
    SHOW_AMPM = 'showAmPm',
    INTERVAL = 'interval',
    SHOW_SECONDS = 'showSeconds',
    RUNNING = 'running',
    AFTER = 'after',
    WRAPPED = 'wrapped',
    HOURS = 'hours',
    MINUTES = 'minutes',
    SECONDS = 'seconds',
    AMPM = 'ampm';
/**
 * The TimeSpinner shows a set of spinners for hour, minute and optionally seconds and AM/PM.
 * @class TimeSpinner
 * @extends Widget
 * @uses Y.Spinner, Y.MakeNode
 * @constructor
 * @param cfg {object} (optional) configuration attributes
 */
Y.TimeSpinner = Y.Base.create(
    'timeSpinner',
    Y.Widget,
    [Y.MakeNode],
    {
        /**
         * Reference to the Spinner showing the hours.
         * @property _hourSp
         * @type Y.Spinner
         * @default null
         * @private
         */
        _hourSp: null,
        /**
         * Reference to the Spinner showing the minutes.
         * @property _minSp
         * @type Y.Spinner
         * @default null
         * @private
         */
        _minSp: null,
        /**
         * Reference to the Spinner showing the seconds.
         * @property _secSp
         * @type Y.Spinner
         * @default null
         * @private
         */
        _secSp: null,
        /**
         * Reference to the Spinner showingam/pm.
         * @property _ampmSp
         * @type Y.Spinner
         * @default null
         * @private
         */
        _ampmSp: null,
        /**
         * Reference to the timer created by Y.later that updates the time.
         * @property _timer
         * @type timer object
         * @default null
         * @private
         */
        _timer: null,
        /**
         * Difference in milliseconds in between the current time and that displayed.
         * Used when the timer is running to display times other than the current time.
         * @property _offset
         * @type Number
         * @default 0
         * @private
         */
        _offset: 0,

        /** Used to store the moment when the timer was stopped
         * @property _frozenTime
         * @type Number (milliseconds)
         * @default 0
         * @private
         */
        _frozenTime: 0,

        /**
         * Helper factory to make a single Spinner
         * @method _spFact
         * @param which {String} ClassName key for the spinner and strings subkey for its title
         * @param cfg {object} (optional) configuration attribute overrides
         * @param where {Node} (optional) where to render it
         * @return {Spinner} Spinner instance
         * @private
         */
        _spFact: function (which, cfg, where) {
            var sp = new Spinner(Y.merge({
                min: 0,
                max: 59,
                wraparound: true,
                'strings.input': this.get('strings.' + which)
            },cfg)).render(where);
            sp.get(BBX).addClass(this._classNames[which]);
            return sp;
        },
        /**
         * Renders the hours and minutes spinners.
         * The other two, being optional, are rendered when set.
         * @method renderUI
         * @protected
         */
        renderUI: function() {
            var cbx = this.get(CBX);

            this._hourSp = this._spFact(HOURS, this.get(SHOW_AMPM)?{min:1,max:12}:{max:23}, cbx);
            this._minSp = this._spFact(MINUTES, null, cbx);
        },
        /**
         * Sets the listeners for events from the hours and minutes spinners.
         * @method bindUI
         * @protected
         */
        bindUI: function () {
            this._eventHandles = [
                this._hourSp.after(VALUE + CHANGE, this._afterValueChange, this),
                this._minSp.after(VALUE + CHANGE, this._afterValueChange, this),
                this._minSp.after(WRAPPED, this._afterWrapped, this)
            ];
        },

        destroy: function () {
            if (this._timer) {
                this._timer.cancel();
            }
            Y.each([].concat(this._eventHandles,this._secondsEventHandles,this._ampmEventHandle), function (eh) {
                if (eh) {
                    eh.detach();
                }
            });
            Y.TimeSpinner.superclass.destroy.call(this);
        },

        /**
         * Creates or destroys the seconds spinner and attaches/detaches the event listeners.
         * @method _uiSetSeconds
         * @param value {Boolean} whether to show the seconds spinner or not
         * @private
         */
        _uiSetShowSeconds: function(value) {
            if (value) {
                this._secSp = this._spFact(SECONDS,{
                    value: this.get(VALUE).getSeconds()
                });
                this._minSp.get(BBX).insert(this._secSp.get(BBX), AFTER);
                this._secondsEventHandles = [
                    this._secSp.after(VALUE + CHANGE, this._afterValueChange, this),
                    this._secSp.after(WRAPPED, this._afterWrapped, this)
                ];
            } else if (this._secSp) {
                if (this._secSp) {
                    Y.each(this._secondsEventHandles, function (eh) {
                        eh.detach();
                    });
                    this._secSp.destroy();
                    this._secSp = null;
                }
            }
        },
        /**
         * Creates or destroys the am/pm spinner and attaches/detaches the event listeners.
         * @method _uiSetAmpm
         * @param value {Boolean} whether to show the am/pm spinner or not
         * @private
         */
        _uiSetShowAmPm: function (value) {
            if (value) {
                this._ampmSp = this._spFact(AMPM, {
                    max:1,
                    formatter: function(value) {
                        return value?'PM':'AM';
                    },
                    parser: function (value) {
                        switch (value.toUpperCase()) {
                            case 'AM':
                                return 0;
                            case 'PM':
                                return 1;
                            default:
                                return false;
                        }
                    }
                });
                (this._secSp?this._secSp.get(BBX):this._minSp.get(BBX)).insert(this._ampmSp.get(BBX), AFTER);
                this._ampmEventHandle = this._ampmSp.after(VALUE + CHANGE, this._afterValueChange, this);
                this._hourSp.setAttrs({
                    max: 12,
                    min: 1
                });
                this._uiSetValue(this.get(VALUE));
            } else {
                this._hourSp.setAttrs({
                    max: 23,
                    min: 0
                });
                if (this._ampmSp) {
                    this._ampmEventHandle.detach();
                    this._ampmSp.destroy();
                    this._ampmSp = null;
                }
            }
        },
        /**
         * Shows the current value in the set of spinners
         * @method _uiSetValue
         * @param value {Date} value to be shown
         * @param src {String} source of the change in value.
         *        If src===UI, the value comes from the spinners, it needs not be refreshed
         * @private
         */
        _uiSetValue: function (value, src) {
            if (src === UI) {
                return;
            }
            this._setting = true;
            var hours = value.getHours();
            if (this._ampmSp) {
                this._hourSp.set(VALUE, (hours % 12) || 12);
                this._ampmSp.set(VALUE, hours >= 12?1:0);
            } else {
                this._hourSp.set(VALUE, hours);
            }
            this._minSp.set(VALUE, value.getMinutes());
            if (this._secSp) {
                this._secSp.set(VALUE, value.getSeconds());
            }
            this._setting = false;
        },

        /**
         * Sets the interval for refreshing the display
         * @method _uiSetInterval
         * @param value {number} milliseconds in between refreshes
         * @private
         */
        _uiSetInterval: function (value) {
            if (this._timer) {
                this._timer.cancel();
            }
            if (value) {
                this._timer = Y.later(value, this, this._updateTime, [], true);
            }
        },
        /**
         * Sets the timer running.
         * @method _uiSetRunning
         * @param value {Boolean} run or not
         * @private
         */
        _uiSetRunning: function (value) {
            this._uiSetInterval(value && this.get(INTERVAL));
            this._frozenTime = Date.now();
        },

        /**
         * Listener for a change in any of the spinners, sets the value.
         * @method _afterValueChange
         * @private
         */
        _afterValueChange: function () {
            if (this._setting) {
                return;
            }
            var d = new Date();
            d.setHours((this._hourSp.get(VALUE) + (this._ampmSp? 12 * this._ampmSp.get(VALUE):0)) % 24);
            d.setMinutes(this._minSp.get(VALUE));
            d.setSeconds(this._secSp?this._secSp.get(VALUE):0);
            this.set(VALUE, d, {src: UI});
        },

        /**
         * Listener for the wrapped event of the spinners to propagate
         * the changes from seconds to minutes and minutes to hours.
         * @method
         * @param ev {EventFacade} to find out which one wrapped and which way
         * @private
         */
        _afterWrapped: function (ev) {
            var dir = ev.newVal > ev.prevVal?-1:1;
            if (ev.target === this._secSp) {
                this._minSp.set(VALUE, this._minSp.get(VALUE) + dir);
            }
            if (ev.target === this._minSp) {
                this._hourSp.set(VALUE, this._hourSp.get(VALUE) + dir);
            }
        },

        /**
         * Callback for the interval timer to update the time shown
         * @method _updateTime
         * @private
         */
        _updateTime: function() {
            this._uiSetValue(this._getTime());
        },
        /**
         * Getter for the time value.  It returns the current time minus the offset
         * or the time when it was stopped.
         * @method _getTime
         * @return {Date} Time shown
         * @private
         */
        _getTime: function() {
            if (this.get(RUNNING)) {
                return new Date(Date.now() - this._offset);
            } else {
                return new Date(this._frozenTime - this._offset);
            }
        },
        /**
         * Setter for the time value.
         * It calculates and saves the offset in between the current time and that set.
         * @method _setTime
         * @param value {Date} time to be shown
         * @private
         */
        _setTime: function (value) {
            this._offset = Date.now() - value.getTime();
            return value;
        },

        /**
         * Helper method to set the timer running.
         * Same as <code>this.set('running', true);</code>
         * @method start
         */
        start: function () {
            this.set(RUNNING, true);
        },
        /**
         * Helper method to stop the timer.
         * Same as <code>this.set('running', false);</code>
         * @method stop
         */
        stop: function () {
            this.set(RUNNING, false);
        }
    },
    {
        _CLASS_NAMES: [HOURS, MINUTES, SECONDS, AMPM],
        ATTRS: {
            /**
             * Whether to show the am/pm indicator or show a 24 hours timer.
             * @attribute showAmPm
             * @type Boolean
             * @default false
             */
            showAmPm : {
                value:false,
                validator: Lang.isBoolean
            },
            /**
             * Whether to show the seconds indicator
             * @attribute showSeconds
             * @type Boolean
             * @default true
             */
            showSeconds:{
                value:true,
                validator: Lang.isBoolean
            },
            /**
             * Value of the timer
             * @attribute value
             * @type Date
             * @default time at initialization or current time if running
             */
            value: {
                valueFn: function() {
                    return new Date();
                },
                validator: function (value) {
                    return value instanceof Date;
                },
                getter:'_getTime',
                setter:'_setTime'
            },

            /**
             * How often to refresh the time displayed
             * @attribute interval
             * @type Number (milliseconds)
             * @default 500
             */
            interval: {
                value: 500,
                validator: Lang.isNumber
            },

            /**
             * Whether the timer is running.
             * @attribute running
             * @type Boolean
             * @default true
             */
            running: {
                value: true,
                validator: Lang.isBoolean
            },

            /**
             * Set of localizable strings to be used as tooltips on the spinners.
             * @attribute strings
             */
            strings: {
                value: {
                    hours:HOURS,
                    minutes:MINUTES,
                    seconds: SECONDS,
                    ampm: 'am/pm'
                }
            }
        },
        _ATTRS_2_UI: {
            BIND: [INTERVAL, RUNNING, SHOW_AMPM, SHOW_SECONDS, VALUE],
            SYNC: [INTERVAL, RUNNING, SHOW_AMPM, SHOW_SECONDS, VALUE]
        }
    }
);


}, 'gallery-2013.01.23-21-59', {"requires": ["gallery-md-spinner", "gallery-makenode"]});
