YUI.add('gallery-itsadatetimepicker', function (Y, NAME) {

'use strict';

/**
 *
 * Class ITSADateTimePicker
 *
 *
 * Class that pickes dates and times using Promises. It can be used as a date-picker, time-picker or both.<br />
 * The Class also can render 3 button-Nodes with calendar-icon, time-icon or both.
 *
 * @module gallery-itsadatetimepicker
 * @extends Base
 * @class ITSADateTimePicker
 * @constructor
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://itsasbreuk.nl</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

var Lang = Y.Lang,
    YNode = Y.Node,
    YArray = Y.Array,
    WIDGET_CLASS = 'itsa-datetimepicker',
    LOADING_CLASS = WIDGET_CLASS + '-loading',
    UNCLOSABLE_CLASS = WIDGET_CLASS + '-unclosable',
    PANEL_CLASS = WIDGET_CLASS + '-panel',
    TIME_CHANGED_CLASS = WIDGET_CLASS + '-timechanged',
    RENDERDELAY = 1000, //Time in ms to wait for the datetimepicker to render. Because you probably won't need it right away,
                        // We don't need to slower things down during startup.
    CALENDAR_ID = WIDGET_CLASS + '-datepicker',
    TIMEDIAL_ID = WIDGET_CLASS + '-timepicker',
    TIMEDIAL_HIDDEN = TIMEDIAL_ID + '-hidden',
    HEADERCONTENT_DATE = 'Select date',
    HEADERCONTENT_DATETIME = 'Select date and time',
    HEADERCONTENT_TIME = 'Select time',

    YUI3BUTTON_CLASS = 'yui3-button',
    ITSA_BUTTON_DATETIME_CLASS = 'itsa-button-datetime',
    BUTTON_DATE_CLASS = WIDGET_CLASS + '-icondate',
    BUTTON_TIME_CLASS = WIDGET_CLASS + '-icontime',
    BUTTON_DATETIME_CLASS = WIDGET_CLASS + '-icondatetime',

    BUTTON_DATE = '<button class="'+YUI3BUTTON_CLASS+' '+ITSA_BUTTON_DATETIME_CLASS+'"><span class="'+BUTTON_DATE_CLASS+'"></span></button>',
    BUTTON_DATETIME = '<button class="'+YUI3BUTTON_CLASS+' '+ITSA_BUTTON_DATETIME_CLASS+'"><span class="'+BUTTON_DATETIME_CLASS+'"></span></button>',
    BUTTON_TIME = '<button class="'+YUI3BUTTON_CLASS+' '+ITSA_BUTTON_DATETIME_CLASS+'"><span class="'+BUTTON_TIME_CLASS+'"></span></button>',

    EVENT_DATEPICKER = '_datetimepicker:',
    EVENT_SELECTDATE = EVENT_DATEPICKER + 'selectdate',
    EVENT_SELECTBUTTON = EVENT_DATEPICKER + 'selected',
    EVENT_CANCEL = EVENT_DATEPICKER + 'cancel',

    DEFAULT_CONFIG = {
        titleDate: HEADERCONTENT_DATE,
        titleDateTime: HEADERCONTENT_DATETIME,
        titleTime: HEADERCONTENT_TIME,
        alignToNode: null,
        modal: false,
        dragable: false,
        forceSelectdate: false,
        minTime: '00:00',
        maxTime: '24:00',
        timeFormat: '%H:%M',
        resetStr: 'Reset',
        tooltipHandle: 'Drag to set time',
        selectOnRelease: true,
        customRenderer: {},
        showPrevMonth: false,
        showNextMonth: false,
        headerRenderer: '%B %Y',
        minimumDate: null,
        maximumDate: null,
        enabledDatesRule: null,
        disabledDatesRule: null
    },

    PARSTEINT = function(value) {
        return parseInt(value, 10);
    };

//===============================================================================================

Y.ITSADateTimePicker = Y.Base.create('itsadatetimepicker', Y.Base, [], {

        /**
         * Reference to the Y.Panel-instance
         * @property panel
         * @default null
         * @type Y.Panel
         * @since 0.1
        */

        /**
         * Reference to the Y.Calendar-instance
         * @property calendar
         * @default null
         * @type Y.Calendar
         * @since 0.1
        */

        /**
         * Reference to the Y.Dial-instance
         * @property timedial
         * @default null
         * @type Y.Dial
         * @since 0.1
        */

        /**
         * Internal reference to the closebutton.
         * @property _closebutton
         * @private
         * @default null
         * @type Y.Node
         * @since 0.1
        */

        /**
         * Internal reference to the dialhandle-Node.
         * @property _dialHandle
         * @private
         * @default null
         * @type Y.Node
         * @since 0.1
        */

        /**
         * Internal list of all eventhandlers bound by this widget.
         * @property _eventhandlers
         * @private
         * @default []
         * @type Array
         * @since 0.1
        */

        /**
         * Internal reference to the timerobject that is used to delay the rendering.
         * @property _panelRendererDelay
         * @private
         * @default null
         * @type Object
         * @since 0.1
        */

        /**
         * Internal reference to the resetnode.
         * @property _resetNode
         * @private
         * @default null
         * @type Y.Node
         * @since 0.1
        */

        /**
         * Internal property that holds the format of how the Dial-time should be rendered in the Dial-instance.
         * @property _timeFormat
         * @private
         * @default null
         * @type String
         * @since 0.1
        */

        /**
         * Reference to the Node inside Y.Dial-instance that draws the selected time.
         * @property _timeNode
         * @private
         * @default null
         * @type Y.Node
         * @since 0.1
        */

        /**
         * Internal backupstate of getTime()'s config.selectOnRelease.
         * @property _timepickerSelectOnRelease
         * @private
         * @default null
         * @type Y.Node
         * @since 0.1
        */

        /**
         * Internal state of the picker to be closable or not
         * @property _unclosable
         * @private
         * @default null
         * @type Boolean
         * @since 0.1
        */

        /**
         * Reference to Y.one('window')
         * @property _window
         * @private
         * @default null
         * @type Y.Node
         * @since 0.1
        */

        /**
         * @method initializer
         * @protected
         * @since 0.1
        */
        initializer : function() {
            var instance = this;

            instance._eventhandlers = [];
            instance._window = Y.one('window');
            instance._renderUI();
            instance._bindUI();
            Y.one('body').removeClass(LOADING_CLASS);
         },

        /**
         * Generates an Y.Node of the type 'button'. Is NOT part of the DOM yet --> you need to place it inside the DOM yourself.
         * This method is available in order you create a nice button which can be used to call for a datetime-Promise.
         *
         * @method dateNode
         * @return {Y.Node} Node of the type 'button' with a calendaricon inside.
         * @since 0.1
        */
        dateNode : function() {
            return YNode.create(BUTTON_DATE);
        },

        /**
         * Generates an Y.Node of the type 'button'. Is NOT part of the DOM yet --> you need to place it inside the DOM yourself.
         * This method is available in order you create a nice button which can be used to call for a datetime-Promise.
         *
         * @method datetimeNode
         * @return {Y.Node} Node of the type 'button' with a calendaricon and timeicon inside.
         * @since 0.1
        */
        datetimeNode : function() {
            return YNode.create(BUTTON_DATETIME);
        },

        /**
         * Picks a date using a pop-up Calendar.
         *
         * @method getDate
         * @param {Date} [initialDate] Date-object that holds the initial date-time for the picker. If not set, then the current date-time is used.
         * @param {Object} [config] Object to adjust the behaviour of the picker. Defaults to the attribute 'defaultConfig'.
         * @param {String} [config.title] Title on the Panel-instance
         * @param {Y.Node} [config.alignToNode] The node that causes the picker to appear. When set, the picker is aligned to this Node.
         * @param {Boolean} [config.modal] Whether the Panel-instance should appear modal
         * @param {Boolean} [config.dragable] Whether the Panel-instance is dragable
         * @param {Boolean} [config.forceSelectdate] Force the promise always to become fulfilled by hiding the close-button
         * @param {Object} [config.customRenderer] customRenderer that is passed to the Calendar-instance
         * @param {Boolean} [config.showPrevMonth] showPrevMonth that is passed to the Calendar-instance
         * @param {Boolean} [config.showNextMonth] showNextMonth that is passed to the Calendar-instance
         * @param {String} [config.headerRenderer] headerRenderer that is passed to the Calendar-instance
         * @param {Date} [config.minimumDate] minimumDate that is passed to the Calendar-instance
         * @param {Date} [config.maximumDate] maximumDate that is passed to the Calendar-instance
         * @param {String} [config.enabledDatesRule] enabledDatesRule that is passed to the Calendar-instance
         * @param {String} [config.disabledDatesRule] disabledDatesRule that is passed to the Calendar-instance
         * @return {Y.Promise} the promised selected Date-object. The Fulfilled-function has 1 parameter: newDate.
         * If the Date-picker was closed, the promise is Rejected.
         * @since 0.1
        */
        getDate : function(initialDate, config) {
            var instance = this,
                promise;

            instance._saveShow(1, initialDate, config);
            promise = new Y.Promise(
                function(resolve, reject) {
                    var resolvehandler, rejecthandler;
                    // use Y.once --> it will automaticly detach the subscription!
                    resolvehandler = Y.once(
                        EVENT_SELECTDATE,
                        function(e) {
                            rejecthandler.detach();
                            var selectedDate = e.newDate;
                            selectedDate.setMilliseconds(0);
                            selectedDate.setSeconds(0);
                            selectedDate.setMinutes(0);
                            selectedDate.setHours(0);
                            instance.hide(true, true);
                            resolve(selectedDate);
                        }
                    );
                    rejecthandler = Y.once(
                        EVENT_CANCEL,
                        function() {
                            resolvehandler.detach();
                            // picker will automaticly be hidden.
                            // just for sure, also hide the calendarinstance
                            instance.calendar.hide();
                            reject(new Error('canceled'));
                        }
                    );
                }
            );
            return promise;
         },

        /**
         * Picks a date+time using a pop-up Calendar+Dial.
         *
         * @method getDateTime
         * @param {Date} [initialDateTime] Date-object that holds the initial values for the picker. If not set then the current date-time is used.
         * @param {Object} [config] Object to adjust the behaviour of the picker. Defaults to the attribute 'defaultConfig'.
         * @param {String} [config.title] Title on the Panel-instance
         * @param {Y.Node} [config.alignToNode] The node that causes the panel to appear. When set, the picker is aligned to this Node.
         * @param {Boolean} [config.modal] Whether the Panel-instance should appear modal
         * @param {Boolean} [config.dragable] Whether the Panel-instance is dragable
         * @param {Boolean} [config.forceSelectdate] Force the promise always to become fulfilled by hiding the close-button
         * @param {String} [config.minTime] Lowest timevalue that can be picked. Should be in format 'h:m', 'h:mm' or 'hh:mm'
         * @param {String} [config.maxTime] Highest timevalue that can be picked. Should be in format 'h:m', 'h:mm' or 'hh:mm'
         * @param {String} [config.timeformat] Format of the timestring inside the Dial-instance
         * @param {String} [config.resetStr] resetStr that is passed to the Dial-instance (timepicker)
         * @param {String} [config.tooltipHandle] tooltipHandle that is passed to the Dial-instance (timepicker)
         * @param {Object} [config.customRenderer] customRenderer that is passed to the Calendar-instance
         * @param {Boolean} [config.showPrevMonth] showPrevMonth that is passed to the Calendar-instance
         * @param {Boolean} [config.showNextMonth] showNextMonth that is passed to the Calendar-instance
         * @param {String} [config.headerRenderer] headerRenderer that is passed to the Calendar-instance
         * @param {Date} [config.minimumDate] minimumDate that is passed to the Calendar-instance
         * @param {Date} [config.maximumDate] maximumDate that is passed to the Calendar-instance
         * @param {String} [config.enabledDatesRule] enabledDatesRule that is passed to the Calendar-instance
         * @param {String} [config.disabledDatesRule] disabledDatesRule that is passed to the Calendar-instance
         * @return {Y.Promise} the promised selected Date-object. The Fulfilled-function has 1 parameter: newDate.
         * If the DateTime-picker was closed, the promise is Rejected.
         * @since 0.1
        */
        getDateTime : function(initialDateTime, config) {
            var instance = this,
                promise;

            config = config || {};
            config.selectOnRelease = false;
            instance._saveShow(2, initialDateTime, config);
            promise = new Y.Promise(
                function(resolve, reject) {
                    var resolvehandler, rejecthandler;
                    // use Y.once --> it will automaticly detach the subscription!
                    resolvehandler = Y.once(
                        EVENT_SELECTBUTTON,
                        function() {
                            rejecthandler.detach();
                            var selectedDateTime = instance.calendar.get('selectedDates')[0],
                                timedialValue = PARSTEINT(instance.timedial.get('value')),
                                newHours = Math.floor(timedialValue/60),
                                newMinutes = timedialValue - (60*newHours);
                            selectedDateTime.setMilliseconds(0);
                            selectedDateTime.setSeconds(0);
                            selectedDateTime.setMinutes(newMinutes);
                            selectedDateTime.setHours(newHours);
                            instance.hide(true, true);
                            resolve(selectedDateTime);
                        }
                    );
                    rejecthandler = Y.once(
                        EVENT_CANCEL,
                        function() {
                            resolvehandler.detach();
                            // picker will automaticly be hidden.
                            // just for sure, also hide the calendarinstance
                            instance.calendar.hide();
                            instance._toggleTimePicker(false, false);
                            reject(new Error('canceled'));
                        }
                    );
                }
            );
            return promise;
         },

        /**
         * Picks a time using a pop-up Dial.
         *
         * @method getTime
         * @param {Date} [initialTime] Date-object that holds the initial values for the picker. If not set, then the current date-time is used.
         * @param {Object} [config] Object to adjust the behaviour of the picker. Defaults to the attribute 'defaultConfig'.
         * @param {String} [config.title] Title on the Panel-instance
         * @param {Y.Node} [config.alignToNode] The node that causes the panel to appear. When set, the picker is aligned to this Node.
         * @param {Boolean} [config.modal] Whether the Panel-instance should appear modal
         * @param {Boolean} [config.dragable] Whether the Panel-instance is dragable
         * @param {Boolean} [config.forceSelectdate] Force the promise always to become fulfilled by hiding the close-button
         * @param {String} [config.minTime] Lowest timevalue that can be picked. Should be in format 'h:m', 'h:mm' or 'hh:mm'
         * @param {String} [config.maxTime] Highest timevalue that can be picked. Should be in format 'h:m', 'h:mm' or 'hh:mm'
         * @param {String} [config.timeformat] Format of the timestring inside the Dial-instance
         * @param {String} [config.resetStr] resetStr that is passed to the Dial-instance (timepicker)
         * @param {String} [config.tooltipHandle] tooltipHandle that is passed to the Dial-instance (timepicker)
         * @param {String} [config.selectOnRelease] When only timepicker: select time when mouse releases the dial, without a Selectbutton.
         * @return {Y.Promise} the promised selected Date-object. The Fulfilled-function has 1 parameter: newDate.
         * If the Time-picker was closed, the promise is Rejected.
         * @since 0.1
        */
        getTime : function(initialTime, config) {
            var instance = this,
                promise;

            instance._saveShow(3, initialTime, config);
            promise = new Y.Promise(
                function(resolve, reject) {
                    var resolvehandler, rejecthandler;
                    // use Y.once --> it will automaticly detach the subscription!
                    resolvehandler = Y.once(
                        EVENT_SELECTBUTTON,
                        function() {
                            rejecthandler.detach();
                            var timedialValue = PARSTEINT(instance.timedial.get('value')),
                                newHours = Math.floor(timedialValue/60),
                                newMinutes = timedialValue - (60*newHours),
                                selectedTime = new Date(1900, 0, 1, newHours, newMinutes, 0, 0);
                            instance.hide(true, true);
                            resolve(selectedTime);
                        }
                    );
                    rejecthandler = Y.once(
                        EVENT_CANCEL,
                        function() {
                            resolvehandler.detach();
                            // picker will automaticly be hidden.
                            // just for sure, also hide the calendarinstance
                            instance._toggleTimePicker(false, false);
                            reject(new Error('canceled'));
                        }
                    );
                }
            );
            return promise;
         },

        /**
         * Hides the picker-instance. And fires the cancelEvent which will make the Promise to be rejected.
         *
         * @method hide
         * @param [force] {Boolean} Force closing, even when config.forceSelectdate is set to true
         * @param [silent] {Boolean} To suppres the cancelevent
         * @since 0.1
        */
        hide : function(force, silent) {
            var instance = this;

            force = Lang.isBoolean(force) && force;
            if (instance.panel.get('visible') && (force || !instance._unclosable)) {
                instance.calendar.hide();
                instance._toggleTimePicker(false, false);
                instance.panel.hide();
                if (!silent) {
                    Y.fire(EVENT_CANCEL);
                }
            }
         },

        /**
         * Generates an Y.Node of the type 'button'. Is NOT part of the DOM yet --> you need to place it inside the DOM yourself.
         * This method is available in order you create a nice button which can be used to call for a datetime-Promise.
         *
         * @method timeNode
         * @return {Y.Node} Node of the type 'button' with a timeicon inside.
         * @since 0.1
        */
        timeNode : function() {
            return YNode.create(BUTTON_TIME);
        },

        /**
         * Cleans up bindings
         *
         * @method destructor
         * @protected
         * @since 0.1
        */
        destructor: function() {
            var instance = this;

            instance._clearEventhandlers();
            if (instance._panelRendererDelay) {
                instance._panelRendererDelay.cancel();
            }
            instance.timedial.destroy();
            instance.calendar.destroy();
        },

        //===============================================================================================
        // private methods
        //===============================================================================================

        /**
         * Sets up DOM and CustomEvent listeners for the widget.
         *
         * @method _bindUI
         * @private
         * @protected
         * @since 0.1
         */
        _bindUI: function() {
            var instance = this,
                eventhandlers = instance._eventhandlers,
                panel = instance.panel;

            panel.onceAfter(
                'render',
                function() {
                    var boundingBox = panel.get('boundingBox'),
                        closebutton;
                    instance._closebutton = closebutton = boundingBox.one('.yui3-button-close');
                    eventhandlers.push(
                        closebutton.on(
                            'click',
                            function() {
                                /**
                                * Fired when the Panel is closed without saving the values.
                                * No need to listen to --> the promises are using this event internally.
                                *
                                * @event _datetimepicker:cancel
                                * @private
                                * @since 0.1
                                */
                                if (!instance._unclosable) {
                                    // we must first set visibility of the panel to true, otherwise hide() supresses the action.
                                    instance.panel.set('visible', true);
                                    instance.hide();
                                }
                            }
                        )
                    );
                    eventhandlers.push(
                        Y.on(
                            'keydown',
                            function(e) {
                                if ((e.keyCode === 27) && !instance._unclosable && instance.panel.get('focused')) { // escape
                                    instance.hide();
                                }
                            }
                        )
                    );
                    instance._fillPanel();
                }
            );
            instance._panelRendererDelay = Y.later(
                RENDERDELAY,
                instance,
                function() {
                    instance._panelRendererDelay = null;
                    panel.render();
                }
            );
        },

        /**
         * Cleaning up all eventlisteners
         *
         * @method _clearEventhandlers
         * @private
         * @since 0.1
        */
        _clearEventhandlers : function() {
            var eventhandlers = this._eventhandlers;

            YArray.each(
                eventhandlers,
                function(item){
                    item.detach();
                }
            );
            eventhandlers.length = 0;
        },

        /**
         * Creates (renderes) the Y.Dial-instance that is used for selecting times.
         *
         * @method _createTimeDial
         * @private
         * @since 0.1
        */
        _createTimeDial : function() {
            var instance = this,
                contentBox = instance.panel.get('contentBox'),
                timedial;

            instance.timedial = timedial = new Y.Dial({
                min:0,
                max:1440,
                stepsPerRevolution: 720,
                value: 0
            });
            timedial.onceAfter(
                'render',
                function() {
                    instance._timeNode = contentBox.one('.yui3-dial-label-string');
                    instance._resetNode = contentBox.one('.yui3-dial-reset-string');
                    instance._dialHandle = contentBox.one('.yui3-dial-handle');
                    instance._eventhandlers.push(
                        timedial._dd1.on(
                            'drag:end',
                            instance._afterDialChange,
                            instance
                        )
                    );
                }
            );
            timedial.render(contentBox.one('.'+TIMEDIAL_ID));
            instance._eventhandlers.push(
                timedial.after(
                    'valueChange',
                    function(e) {
                        var newVal = parseInt(e.newVal, 10),
                            newHours = Math.floor(newVal/60),
                            newMinutes = newVal - (60*newHours),
                            timeNode = instance._timeNode;
                        timeNode.setHTML(instance._renderDialTime(newHours, newMinutes));
                        timeNode.addClass(TIME_CHANGED_CLASS);
                    }
                )
            );
        },

        _afterDialChange : function() {
            var instance = this;

            if (instance._timepickerSelectOnRelease) {
                Y.fire(EVENT_SELECTBUTTON);
            }
        },

        /**
         * Creates (renderes) the Y.Calendar-instance that is used for selecting dates.
         *
         * @method _createCalendar
         * @private
         * @since 0.1
        */
        _createCalendar : function() {
            var instance = this;

            instance.calendar = new Y.Calendar({
                height:'250px',
                width:'250px',
                showPrevMonth: true,
                showNextMonth: true,
                visible: false,
                date: new Date()
            });
            instance._eventhandlers.push(
                instance.calendar.on(
                    'dateClick',
                    Y.rbind(instance._calendarNewDate, instance)
                )
            );
            instance.calendar.render(instance.panel.get('contentBox').one('.'+CALENDAR_ID));
        },

        /**
         * Fires an event with the new selected Date.
         *
         * @method _calendarNewDate
         * @param {EventFacade} e
         * @private
         * @since 0.1
        */
        _calendarNewDate : function(e) {
            var instance = this,
                newdate;

            // only if the calendar is visible --> there is also a new date set before showing up!
            if (instance.calendar.get('visible')) {
                newdate = e.date;
                /**
                * Fired when a new Date is selected from the Panel's Calendar-instance.
                * No need to listen to --> the promises are using this event internally.
                *
                * @event _datetimepicker:selectdate
                * @param {Date} newDate the selected date
                * @private
                * @since 0.1
                */
                Y.fire(EVENT_SELECTDATE, {newDate: newdate});
            }
        },

        /**
         * Fills the Panel-instance. Meaning: renderes the innerContent by creating the Calendar-instance, the Dial-instance and a Select-button.
         *
         * @method _createCalendar
         * @private
         * @since 0.1
        */
        _fillPanel : function() {
            var instance = this,
                panel = instance.panel,
                boundingBox = panel.get('boundingBox'),
                selectButton;

            boundingBox.addClass(PANEL_CLASS);
            instance._createCalendar();
            instance._createTimeDial();
            selectButton = {
                value : 'Select',
                action: function(e) {
                    e.preventDefault();
                    /**
                    * Fired when new values are selected by the Panel by pressing the 'Select'-button
                    * Only will appear when the time can be selected (otherwise there won't be a select-button in the first place)
                    * No need to listen to --> the promises are using this event internally.
                    *
                    * @event _datetimepicker:selected
                    * @private
                    * @since 0.1
                    */
                    Y.fire(EVENT_SELECTBUTTON);
                },
                section: Y.WidgetStdMod.FOOTER
            };
            panel.addButton(selectButton);
        },

        /**
         * Renderes the time in the right format (stored inside the property '_timeFormat')
         * One can change the format by calling the Promises with config = {timeformat: 'someformat'}
         *
         * @method _calendarNewDate
         * @param {Int} hours
         * @param {Int} minutes
         * @private
         * @since 0.1
        */
        _renderDialTime : function(hours, minutes) {
            var instance = this,
                time = new Date(1900, 0, 1, hours, minutes, 0, 0);

            return Y.Date.format(time, {format: instance._timeFormat});
        },

        /**
         * Renderes the Picker-panel. The innerContent of the panel -however- will be rendered with a delay by the method: '_fillPanel'.
         *
         * @method _renderUI
         * @private
         * @protected
         * @since 0.1
         */
        _renderUI: function() {
            var instance = this;

            instance.panel = new Y.Panel({
                zIndex: 15000,
                modal   : false,
                visible: false,
                render  : false, // we will render after some delaytime, specified with RENDERDELAY
                fillHeight: null,
                hideOn: [],
                bodyContent : '<div class="'+CALENDAR_ID+'"></div><div class="'+TIMEDIAL_ID+'"></div>'
            });
        },

        /**
         * Will call _show() but only if the picker-panel is rendered. If not, than it will wait for the rendering to be finished.
         *
         * @method _saveShow
         * @param {Int} modus internal type to tell whether a date, datetime or time needs to be picked (1,2 or 3)
         * @param {Date} [initialDateTime] date-object that holds the initial values for the picker. If not set then the current date-time is used.
         * @param {Object} [config] object to adjust the behaviour of the picker.
         * @param {String} [config.title] Title on the Panel-instance
         * @param {Y.Node} [config.alignToNode] The node that causes the picker to appear. When set, the picker is aligned to this Node.
         * @param {Boolean} [config.modal] Whether the Panel-instance should appear modal
         * @param {Boolean} [config.dragable] Whether the Panel-instance is dragable
         * @param {Boolean} [config.forceSelectdate] Force the promise always to become fulfilled by hiding the close-button
         * @param {String} [config.minTime] Lowest timevalue that can be picked. Should be in format 'h:m', 'h:mm' or 'hh:mm'
         * @param {String} [config.maxTime] Highest timevalue that can be picked. Should be in format 'h:m', 'h:mm' or 'hh:mm'
         * @param {String} [config.timeformat] Format of the rendered timestring (default = '%H:%M')
         * @param {String} [config.resetStr] resetStr that is passed to the Dial-instance (timepicker)
         * @param {String} [config.tooltipHandle] tooltipHandle that is passed to the Dial-instance (timepicker)
         * @param {String} [config.selectOnRelease] When only timepicker: select time when mouse releases the dial, without a Selectbutton.
         * @param {Object} [config.customRenderer] customRenderer that is passed to the Calendar-instance
         * @param {Boolean} [config.showPrevMonth] showPrevMonth that is passed to the Calendar-instance
         * @param {Boolean} [config.showNextMonth] showNextMonth that is passed to the Calendar-instance
         * @param {String} [config.headerRenderer] headerRenderer that is passed to the Calendar-instance
         * @param {Date} [config.minimumDate] minimumDate that is passed to the Calendar-instance
         * @param {Date} [config.maximumDate] maximumDate that is passed to the Calendar-instance
         * @param {String} [config.enabledDatesRule] enabledDatesRule that is passed to the Calendar-instance
         * @param {String} [config.disabledDatesRule] disabledDatesRule that is passed to the Calendar-instance
         * @private
         * @since 0.1
        */
        _saveShow : function(modus, initialDateTime, config) {
            var instance = this,
                panel = instance.panel;

            if (panel.get('rendered')) {
                instance._show(modus, initialDateTime, config || {});
            }
            else {
                panel.onceAfter(
                    'render',
                    function() {
                        instance._show(modus, initialDateTime, config || {});
                    }
                );
            }
            if (instance._panelRendererDelay) {
                instance._panelRendererDelay.cancel();
                panel.render();
            }
        },

        /**
         * Shows the picker-instance, ready to select a date and/or time.
         *
         * @method _show
         * @param {Int} modus internal type to tell whether a date, datetime or time needs to be picked (1,2 or 3)
         * @param {Date} [initialDateTime] date-object that holds the initial values for the picker. If not set then the current date-time is used.
         * @param {Object} [config] object to adjust the behaviour of the picker.
         * @param {String} [config.title] Title on the Panel-instance
         * @param {Y.Node} [config.alignToNode] The node that causes the picker to appear. When set, the picker is aligned to this Node.
         * @param {Boolean} [config.modal] Whether the Panel-instance should appear modal
         * @param {Boolean} [config.dragable] Whether the Panel-instance is dragable
         * @param {Boolean} [config.forceSelectdate] Force the promise always to become fulfilled by hiding the close-button
         * @param {String} [config.minTime] Lowest timevalue that can be picked. Should be in format 'h:m', 'h:mm' or 'hh:mm'
         * @param {String} [config.maxTime] Highest timevalue that can be picked. Should be in format 'h:m', 'h:mm' or 'hh:mm'
         * @param {String} [config.timeformat] Format of the rendered timestring
         * @param {String} [config.resetStr] resetStr that is passed to the Dial-instance (timepicker)
         * @param {String} [config.tooltipHandle] tooltipHandle that is passed to the Dial-instance (timepicker)
         * @param {String} [config.selectOnRelease] When only timepicker: select time when mouse releases the dial, without a Selectbutton.
         * @param {Object} [config.customRenderer] customRenderer that is passed to the Calendar-instance
         * @param {Boolean} [config.showPrevMonth] showPrevMonth that is passed to the Calendar-instance
         * @param {Boolean} [config.showNextMonth] showNextMonth that is passed to the Calendar-instance
         * @param {String} [config.headerRenderer] headerRenderer that is passed to the Calendar-instance
         * @param {Date} [config.minimumDate] minimumDate that is passed to the Calendar-instance
         * @param {Date} [config.maximumDate] maximumDate that is passed to the Calendar-instance
         * @param {String} [config.enabledDatesRule] enabledDatesRule that is passed to the Calendar-instance
         * @param {String} [config.disabledDatesRule] disabledDatesRule that is passed to the Calendar-instance
         * @private
         * @since 0.1
        */
        _show : function(modus, initialDateTime, config) {
            var instance = this,
                panel = instance.panel,
                presentedDate = initialDateTime || new Date(),
                timeNode = instance._timeNode,
                userConfig = Y.merge(instance.get('defaultConfig'), config),
                timedial = instance.timedial,
                calendar = instance.calendar,
                rightAlign, window, winWidth, currentScroll, panelWidth, nodeX, nodeWidth, calAttrs, minutes, hours,
                dialvalue, minPanelWidth, alignToNode, minTime, maxTime, minTimeValue, maxTimeValue, timesplitArray,
                minMinutes, maxMinutes, minHours, maxHours;

            alignToNode = userConfig.alignToNode;
            if (panel.get('visible')) {
                // previous picker is up --> we need to reject the promise by firing an EVENT_CANCEL-event:
                instance.hide();
            }
            if (modus<3) {
                calendar.deselectDates();
                calendar.selectDates(presentedDate);
                calendar.set('date', presentedDate);
                if (Lang.isObject(config)) {
                    // Only accept limited properties. Also reset to default on new requests
                    calAttrs = {
                        customRenderer: userConfig.customRenderer,
                        showPrevMonth: userConfig.showPrevMonth,
                        showNextMonth: userConfig.showNextMonth,
                        headerRenderer: userConfig.headerRenderer,
                        minimumDate: userConfig.minimumDate,
                        maximumDate: userConfig.maximumDate,
                        enabledDatesRule: userConfig.enabledDatesRule,
                        disabledDatesRule: userConfig.disabledDatesRule
                    };
                    calendar.setAttrs(calAttrs);
                }
                calendar.show();
            }
            else {
                calendar.hide();
            }
            if (modus>1) {
                instance._resetNode.setHTML(userConfig.resetStr);
                instance._dialHandle.setAttribute('title', userConfig.tooltipHandle);
                instance._timeFormat = userConfig.timeFormat;
                minTime = userConfig.minTime;
                maxTime = userConfig.maxTime;
                if (typeof minTime === 'string') {
                    timesplitArray = minTime.split(':');
                    if (timesplitArray.length===2) {
                        minHours = parseInt(timesplitArray[0], 10);
                        minMinutes = parseInt(timesplitArray[1], 10);
                        minTimeValue = minMinutes+60*minHours;
                    }
                }
                if (typeof maxTime === 'string') {
                    timesplitArray = maxTime.split(':');
                    if (timesplitArray.length===2) {
                        maxHours = parseInt(timesplitArray[0], 10);
                        maxMinutes = parseInt(timesplitArray[1], 10);
                        maxTimeValue = maxMinutes+60*maxHours;
                    }
                }
                if (!minTimeValue) {
                    minTimeValue = 0;
                }
                if (!maxTimeValue) {
                    maxTimeValue = 1440;
                }
                timedial.set('min', minTimeValue);
                timedial.set('max', maxTimeValue);
                hours = presentedDate.getHours();
                minutes = presentedDate.getMinutes();
                dialvalue = minutes+60*hours;
                if (dialvalue<minTimeValue) {
                    dialvalue=minTimeValue;
                    hours = minHours;
                    minutes = minMinutes;
                }
                if (dialvalue>maxTimeValue) {
                    dialvalue=maxTimeValue;
                    hours = maxHours;
                    minutes = maxMinutes;
                }
                timedial.set('value', dialvalue);
                timedial._originalValue = dialvalue;
                timeNode.setHTML(instance._renderDialTime(hours, minutes));
                timeNode.removeClass(TIME_CHANGED_CLASS);
                instance._toggleTimePicker(true, !userConfig.selectOnRelease);

            }
            else {
                instance._toggleTimePicker(false, false);
            }
            if (userConfig.alignToNode instanceof Y.Node) {
                window = instance._window;
                if (window) {
                    winWidth = PARSTEINT(window.get('winWidth'));
                    currentScroll = PARSTEINT(window.get('docScrollX'));
                    // check minwidth when no other fontsize is set:
                    // values are just read before after rendering...
                    switch (modus) {
                        case 1: minPanelWidth = 285;
                        break;
                        case 2: minPanelWidth = 155;
                        break;
                        case 3: minPanelWidth = 415;
                        break;
                    }
                    panelWidth = Math.max(panel.get('boundingBox').get('offsetWidth'), minPanelWidth);
                    nodeX = alignToNode.getX();
                    nodeWidth = alignToNode.get('offsetWidth');
                    rightAlign = ((nodeX+nodeWidth+panelWidth)<(currentScroll+winWidth)) || ((nodeX+nodeWidth)<panelWidth);
                }
                panel.align(
                    alignToNode,
                    (rightAlign ? [Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.TR] : [Y.WidgetPositionAlign.TR, Y.WidgetPositionAlign.BR])
                );
            }
            else {
                panel.centered();
            }
            panel.set('modal', userConfig.modal);
            switch (modus) {
                case 1:
                    panel.set('headerContent', userConfig.title || userConfig.titleDate);
                    break;
                case 2:
                    panel.set('headerContent', userConfig.title || userConfig.titleDateTime);
                    break;
                case 3:
                    panel.set('headerContent', userConfig.title || userConfig.titleTime);
            }
            if (userConfig.dragable) {
                if (!panel.hasPlugin('dd')) {
                    panel.plug(Y.Plugin.Drag);
                    panel.dd.addHandle('.yui3-widget-hd');
                }
                else if (panel.hasPlugin('dd')) {
                    panel.unplug('dd');
                }
            }
            else if (panel.hasPlugin('dd')) {
                panel.unplug('dd');
            }
            // backup 2 properties for later use
            instance._unclosable = userConfig.forceSelectdate;
            instance._timepickerSelectOnRelease = userConfig.selectOnRelease;
            instance._closebutton.toggleClass(UNCLOSABLE_CLASS, instance._unclosable);
            panel.show();
            panel.focus();
         },

        /**
         * Toggles the visibility of the timepicker (Y.Dial-instance) together with the Select-button.
         *
         * @method _toggleTimePicker
         * @param {Boolean} timeVisible whether the time-selector will be visible or not
         * @param {Boolean} selectButtonVisible whether the selectButton will be visible or not
         * @private
         * @since 0.1
        */
        _toggleTimePicker : function(timeVisible, selectButtonVisible) {
            var instance = this;

            instance.timedial.get('boundingBox').toggleClass(TIMEDIAL_HIDDEN, !timeVisible);
            instance._resetNode.toggleClass(TIMEDIAL_HIDDEN, !selectButtonVisible);
            instance.panel.get('contentBox').one('.yui3-widget-ft').toggleClass(TIMEDIAL_HIDDEN, !selectButtonVisible);
        }

    }, {
        ATTRS : {
            /**
             * @description Determines the default layout and behaviour of the date-time picker. The finale appearance
             * of the picker can be overruled per promisecall (with an own config-object)<br />
             * <br />
             * <b>defaultConfig.titleDate</b>: <i>(default='Select date')</i> Title on the Date-picker<br />
             * <b>defaultConfig.titleDateTime</b>: <i>(default='Select date and time')</i> Title on the DateTime-picker<br />
             * <b>defaultConfig.titleTime</b>: <i>(default='Select time')</i> Title on the Time-picker<br />
             * <b>defaultConfig.alignToNode</b>: <i>(default=null)</i> The node that causes the picker to appear.
               When set, the picker is aligned to this Node.<br />
             * <b>defaultConfig.modal</b>: <i>(default=false)</i> Whether the Panel-instance should appear modal<br />
             * <b>defaultConfig.dragable</b>: <i>(default=false)</i> Whether the Panel-instance is dragable<br />
             * <b>defaultConfig.forceSelectdate</b>: <i>(default=false)</i>
             * Force the promise always to become fulfilled by hiding the close-button<br />
             * <b>defaultConfig.minTime</b>: <i>(default='00:00')</i> Lowest timevalue that can be picked.
               Should be in format 'h:m', 'h:mm' or 'hh:mm'<br />
             * <b>defaultConfig.maxTime</b>: <i>(default='24:00')</i> Highest timevalue that can be picked.
               Should be in format 'h:m', 'h:mm' or 'hh:mm'<br />
             * <b>defaultConfig.timeformat</b>: <i>(default='%H:%M')</i> Format of the rendered timestring<br />
             * <b>defaultConfig.resetStr</b>: <i>(default='Reset')</i> resetStr that is passed to the Dial-instance (timepicker)<br />
             * <b>defaultConfig.tooltipHandle</b>: <i>(default='Drag to set time')</i>
             * tooltipHandle that is passed to the Dial-instance (timepicker)<br />
             * <b>defaultConfig.selectOnRelease</b>: <i>(default=true)</i> When only timepicker: select time when mouse releases the dial,
               without a Selectbutton.<br />
             * <b>defaultConfig.customRenderer</b>: <i>(default={})</i> customRenderer that is passed to the Calendar-instance<br />
             * <b>defaultConfig.showPrevMonth</b>: <i>(default=false)</i> showPrevMonth that is passed to the Calendar-instance<br />
             * <b>defaultConfig.showNextMonth</b>: <i>(default=false)</i> showNextMonth that is passed to the Calendar-instance<br />
             * <b>defaultConfig.headerRenderer</b>: <i>(default='%B %Y')</i> headerRenderer that is passed to the Calendar-instance<br />
             * <b>defaultConfig.minimumDate</b>: <i>(default=null)</i> minimumDate that is passed to the Calendar-instance<br />
             * <b>defaultConfig.maximumDate</b>: <i>(default=null)</i> maximumDate that is passed to the Calendar-instance<br />
             * <b>defaultConfig.enabledDatesRule</b>: <i>(default=null)</i> enabledDatesRule that is passed to the Calendar-instance<br />
             * <b>defaultConfig.disabledDatesRule</b>: <i>(default=null)</i> disabledDatesRule that is passed to the Calendar-instance
             * @attribute defaultConfig
             * @type Object
            */
            defaultConfig : {
                value: DEFAULT_CONFIG,
                validator: function(val) {
                    return (Lang.isObject(val));
                },
                setter: function(val) {
                    return Y.merge(DEFAULT_CONFIG, val);
                }
            }
        }
    }
);

if (!Y.Global.ItsaDateTimePicker) {
    Y.Global.ItsaDateTimePicker = new Y.ITSADateTimePicker();
}

Y.ItsaDateTimePicker = Y.Global.ItsaDateTimePicker;

}, 'gallery-2013.10.02-20-26', {
    "requires": [
        "base",
        "node-base",
        "node-screen",
        "panel",
        "calendar",
        "dial",
        "promise",
        "cssbutton",
        "datatype-date-format",
        "dd-plugin"
    ],
    "skinnable": true
});
