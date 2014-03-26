YUI.add('gallery-datetime-input', function (Y, NAME) {

/*!
 * gallery-datetime-input
 * Copyright (C) 2012 by Markandey <tweet:@markandey>
 * YUI gallery module , that can popup datetime chooser to choose dateime for an input.
 * e.g. code
 * -----------------------------------------
 *         new Y.DateTimeInput({
 *                 inputBox:"#mydatetime"
 *          });
 * ------------------------------------------
 * Code licensed under "Do what ever you want!"
 * http://www.markandey.com/
 */

//YUI.add('gallery-datetime-input', function(Y) {
//    "use strict";
    
    /*
    * timeZoneList : list of timezone
    * @type Object
    * @private
    */
    var timeZoneList = [{
        "value": "-12.0",
        "text": "(GMT -12:00) Eniwetok, Kwajalein"
    }, {
        "value": "-11.0",
        "text": "(GMT -11:00) Midway Island, Samoa"
    }, {
        "value": "-10.0",
        "text": "(GMT -10:00) Hawaii"
    }, {
        "value": "-9.0",
        "text": "(GMT -9:00) Alaska"
    }, {
        "value": "-8.0",
        "text": "(GMT -8:00) Pacific Time (US & Canada)"
    }, {
        "value": "-7.0",
        "text": "(GMT -7:00) Mountain Time (US & Canada)"
    }, {
        "value": "-6.0",
        "text": "(GMT -6:00) Central Time (US & Canada), Mexico City"
    }, {
        "value": "-5.0",
        "text": "(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima"
    }, {
        "value": "-4.0",
        "text": "(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz"
    }, {
        "value": "-3.5",
        "text": "(GMT -3:30) Newfoundland"
    }, {
        "value": "-3.0",
        "text": "(GMT -3:00) Brazil, Buenos Aires, Georgetown"
    }, {
        "value": "-2.0",
        "text": "(GMT -2:00) Mid-Atlantic"
    }, {
        "value": "-1.0",
        "text": "(GMT -1:00 hour) Azores, Cape Verde Islands"
    }, {
        "value": "0.0",
        "text": "(GMT) Western Europe Time, London, Lisbon, Casablanca"
    }, {
        "value": "1.0",
        "text": "(GMT +1:00 hour) Brussels, Copenhagen, Madrid, Paris"
    }, {
        "value": "2.0",
        "text": "(GMT +2:00) Kaliningrad, South Africa"
    }, {
        "value": "3.0",
        "text": "(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg"
    }, {
        "value": "3.5",
        "text": "(GMT +3:30) Tehran"
    }, {
        "value": "4.0",
        "text": "(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi"
    }, {
        "value": "4.5",
        "text": "(GMT +4:30) Kabul"
    }, {
        "value": "5.0",
        "text": "(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent"
    }, {
        "value": "5.5",
        "text": "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi"
    }, {
        "value": "5.75",
        "text": "(GMT +5:45) Kathmandu"
    }, {
        "value": "6.0",
        "text": "(GMT +6:00) Almaty, Dhaka, Colombo"
    }, {
        "value": "7.0",
        "text": "(GMT +7:00) Bangkok, Hanoi, Jakarta"
    }, {
        "value": "8.0",
        "text": "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong"
    }, {
        "value": "9.0",
        "text": "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk"
    }, {
        "value": "9.5",
        "text": "(GMT +9:30) Adelaide, Darwin"
    }, {
        "value": "10.0",
        "text": "(GMT +10:00) Eastern Australia, Guam, Vladivostok"
    }, {
        "value": "11.0",
        "text": "(GMT +11:00) Magadan, Solomon Islands, New Caledonia"
    }, {
        "value": "12.0",
        "text": "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka"
    }],

    /*
    * widgetDateTimeTemplate : body template of popup
    * @type {String}
    * @private
    */
    widgetDateTimeTemplate = '<div class="yui3-gallery-datetime-selected-value">' +
                             '</div>' +
                             '<div class="yui3-gallery-datetime-calendar"></div>' +
                             '<div class="yui3-gallery-datetime-slider-ctrl-wrap">' +
                             '<div class="yui3-gallery-datetime-left-lbl">' +
                             '<label>Hour : </label><span class="yui3-gallery-datetime-sel-hrs">0</span>' +
                             '</div>' +
                             '<div class="yui3-gallery-datetime-right-slider">' +
                             '<div class="yui3-gallery-datetime-hour-slider"></div></div></div>' +
                             '<div class="yui3-gallery-datetime-slider-ctrl-wrap">' +
                             '<div class="yui3-gallery-datetime-left-lbl">' +
                             '<label>Min : </label><span class="yui3-gallery-datetime-sel-min">0</span>' +
                             '</div>' +
                             '<div class="yui3-gallery-datetime-right-slider">' +
                             '<div class="yui3-gallery-datetime-minute-slider"></div>' +
                             '</div>' +
                             '</div><div class="yui3-gallery-datetime-slider-ctrl-wrap">' +
                             '<div class="yui3-gallery-datetime-left-lbl-tz">' +
                             '<label>TimeZone: </label>' +
                             '</div>' +
                             '<div class="yui3-gallery-datetime-right-select">' +
                             '<select class="yui3-gallery-datetime-zoneselect"></select>' +
                             '</div></div>',
    
    /*
    * widgetHeaderTemplate : head template of popup
    * @type {String}
    * @private
    */
    widgetHeaderTemplate = '<div>Selected: <span class="yui3-gallery-datetime-selected-value">Fri Nov 02 2012 04:36:00 GMT+0530 (IST)</span></div>',
    

    /*
    * widgetFooterTemplate {String}: footer template of popup
    * @type {String}
    * @private
    */
    widgetFooterTemplate = '<div><button class="yui3-gallery-datetime-selected-btn yui3-button notice">Done</button></div>';

    /**
     * The DateTime Input extends the widget
     * to add popup functionality on input to pick datetime
     *
     * @module gallery-datetime-input
     * @class DateTimeInput
     * @extends Widget
     */
    Y.DateTimeInput = Y.Base.create('datetime-Input', Y.Widget, [Y.WidgetPosition, Y.WidgetPositionAlign, Y.WidgetAutohide], {

        /*
         * Adds tabindex to input elements if flag is set
         *
         * @method initializer
         * @private
         */
        initializer: function(cfg) {
            var inputNode = Y.one(cfg.inputBox);
            if(!inputNode) {
                throw 'inputBox can not be null or invalid';
            }
            this.inputNode = inputNode;
            this.oldInputNodeValue = inputNode.get('value');
            this._bindUI();
        },
        /**
         * bind events to inputNode to popup,close and reload the datetime
         * @method _bindUI
         * @private
         * @return {Undefined}
         */
        _bindUI: function() {
            var that = this;
            this.inputNode.on('focus', function() {
                Y.all(".yui3-gallery-datetime-overlay").setStyle('display', 'none');
                that.showUI();
            });
            this.inputNode.on('keyup', function() {
                if(that._loadDate) {
                    if(that.oldInputNodeValue !== that.inputNode.get('value')) {
                        if(that._valueParseTimer) {
                            clearTimeout(that._valueParseTimer);
                        }
                        that._valueParseTimer = setTimeout(function() {
                            that._loadDate(that.inputNode.get('value'));
                            that._valueParseTimer = null;
                        }, 1000);

                    }
                }
            });

        },
        /**
         * creates UI overlay if not already exits, and displays it.
         * @method showUI
         * @return {Undefined}
         */
        showUI: function() {
            if(!this.uiOverlay) {
                var overlay = new Y.Overlay({
                    headerContent: widgetHeaderTemplate,
                    bodyContent: widgetDateTimeTemplate,
                    footerContent: widgetFooterTemplate
                });
                overlay.render();
                overlay.set("align", {
                    node: this.inputNode,
                    points: this.get('alignPoints')
                });
                overlay.get('srcNode').addClass('yui3-gallery-datetime-overlay');

                this.uiOverlay = overlay;
                this._initControls();
                this._loadDate(this.inputNode.get('value'));
                this._dumpDate();
            }
            this.uiOverlay.set("align",{node:this.inputNode, points:this.get('alignPoints')});
            this.uiOverlay.get('srcNode').setStyle('display', 'block');
            this.uiOverlay.set('visible', true);
            this._calendar.set('visible', true);
        },
        /**
         * bind events to the controls created. to be called only once.
         * @method _initControls
         * @private
         * @return {Undefined}
         */
        _initControls: function() {
            var thisWidget = this,
                parentNode = this.uiOverlay.get('srcNode'),
                selectedTextNode = parentNode.one('.yui3-gallery-datetime-selected-value'),
                calendarNode = parentNode.one('.yui3-gallery-datetime-calendar'),
                hourSliderNode = parentNode.one('.yui3-gallery-datetime-hour-slider'),
                minSliderNode = parentNode.one('.yui3-gallery-datetime-minute-slider'),
                timezoneSelectNode = parentNode.one('.yui3-gallery-datetime-zoneselect'),
                hrsDisplayTextNode = parentNode.one('.yui3-gallery-datetime-sel-hrs'),
                minDisplayTextNode = parentNode.one('.yui3-gallery-datetime-sel-min'),
                selButton = parentNode.one('.yui3-gallery-datetime-selected-btn'),

                //Helper Function
                //add timeZoneOptons in the timezone select box
                addTimeZoneOptions = function() {
                    var optionTemplate = '<option value="{value}">{text}</option>',
                    optionHtml = "",i;
                    for(i = 0; i < timeZoneList.length; i++) {
                        optionHtml = optionHtml + Y.substitute(optionTemplate, timeZoneList[i]);
                    }
                    Y.one(timezoneSelectNode).appendChild(Y.Node.create(optionHtml));
                },

                //Helper Function
                // zeroPad pads zeros in the number
                zeroPad = function(num, padCount, forcePlus) {
                    num = num * 1; //force Integer
                    var pad = "" + Math.abs(num);
                    while(pad.length < padCount) {
                        pad = "0" + pad;
                    }
                    if(num < 0) {
                        return "-" + pad;
                    } else if(forcePlus) {
                        return "+" + pad;
                    } else {
                        return pad;
                    }
                },

                //Helper Function
                // Makes TimeZone string with the number
                // input 4.5 ==>0430
                makeTimeZoneString = function(value) {
                    var tzCal = value,tzMajor,tzMinor,tzStr;
                    tzMajor = Math.floor(tzCal);
                    tzMinor = tzCal * 60 % 60;
                    tzStr = zeroPad(tzMajor, 2, true) + zeroPad(tzMinor, 2);
                    return tzStr;
                },
            calendar,sliderHour,sliderMinute;
            //intialize only once
            if(thisWidget._controlsInitialized){
                return;
            }
            calendar = new Y.Calendar({
                contentBox: calendarNode,
                width: '350px',
                selectionMode: 'single',
                showPrevMonth: true,
                showNextMonth: true,
                date: new Date()
            }).render();

            sliderHour = new Y.Slider({
                min: 0,
                max: 23,
                value: 0
            }).render(hourSliderNode);

            sliderMinute = new Y.Slider({
                min: 0,
                max: 59,
                value: 0
            }).render(minSliderNode);

            addTimeZoneOptions();
            

            /**
             * Dumps Date/Time as UTC string to inputNode or widget display text.
             * @method _dumpDate
             * @param {Boolean} passive if passive is true, it will not dump new date to the inputNode.
             * @return Nothing
             */

            function dumpDate(passive) {
                var dateString = "{calpart} {hour}:{minute}:00 GMT{tz}",
                calDay = calendar.get('selectedDates')[0] || new Date(),
                tzStr;
                
                dateString = dateString.replace("{calpart}", calDay.toDateString());
                dateString = dateString.replace("{hour}", zeroPad(sliderHour.get('value'), 2));
                dateString = dateString.replace("{minute}", zeroPad(sliderMinute.get('value'), 2));
                
                tzStr = makeTimeZoneString(timezoneSelectNode.get('value'));
                dateString = dateString.replace("{tz}", tzStr);
                thisWidget._widgetDate = new Date(dateString);

                hrsDisplayTextNode.set('innerText', zeroPad(sliderHour.get('value'), 2));
                minDisplayTextNode.set('innerText', zeroPad(sliderMinute.get('value'), 2));

                selectedTextNode.set('innerText', dateString);
                if(passive !== true) {
                    thisWidget.inputNode.set('value', thisWidget._widgetDate);
                }
                thisWidget.oldInputNodeValue = thisWidget.inputNode.get('value');
            }

            /**
             * parses a dateString (UTC string) and loads in the datetime control
             * @method _loadDate
             * @param {String} stringDate
             * @return Nothing
             */

            function loadDate(stringDate) {
                if(''+new Date(stringDate)==='Invalid Date'){
                    stringDate=''+new Date();
                }
                var newlyParsedDate = new Date(stringDate),
                tzOff = newlyParsedDate.getTimezoneOffset();
                timezoneSelectNode.get('options').each(function(option) {
                    if(-1 * tzOff / 60 === option.get('value')*1) {
                        option.set('selected', true);
                    }
                });
                calendar.deselectDates();
                calendar.selectDates([newlyParsedDate]);
                calendar.set('date', newlyParsedDate);
                sliderHour.set("value", newlyParsedDate.getHours());
                sliderMinute.set("value", newlyParsedDate.getMinutes());
                
                
                // do passive dump
                dumpDate(true);
            }

            //add events to click ok
            selButton.on('click', function() {
                thisWidget.hideUI();
            });
            //add events to dump Date : calendar
            calendar.on("selectionChange", function() {
                dumpDate();
            });
            //add events to dump Date : Hour
            sliderHour.on('valueChange', function() {
                dumpDate();
            });
            //add events to dump Date : Minute
            sliderMinute.on('valueChange', function() {
                dumpDate();
            });
            //add events to dump Date : TimeZone
            Y.one(timezoneSelectNode).on('change', function() {
                dumpDate();
            });

            //Add takeaways to widgetObject
            thisWidget._calendar = calendar;
            thisWidget._sliderHour = sliderHour;
            thisWidget._sliderMinute = sliderMinute;
            thisWidget._timezoneSelectbox = timezoneSelectNode;
            thisWidget._loadDate = loadDate;
            thisWidget._dumpDate = dumpDate;
            thisWidget._controlsInitialized = true;
        },
        /**
         * hides UI
         * @method hideUI
         * @return nothing
         */
        hideUI: function() {
            if(this.uiOverlay) {
                this.uiOverlay.set('visible', false);
                this._calendar.set('visible', false);
            }
        },
        destructor:function(){
            if(this.uiOverlay) {
                this.uiOverlay.get('srcNode').remove();
                this.uiOverlay.destory();
            }
        }
    }, {
        ATTRS: {

            /**
             * inputBox which will be enhanced to have datetime input. can be set as query or node.
             *
             * @attribute inputBox
             * @type Y.Node
             * @default null
             * @public
             */
            inputBox: {
                value: null
            },


            /**
             * Presets the visibility to false to avoid a flash of
             * content in the wrong position
             * @attribute visible
             * @type bool
             * @default false
             * @public
             */
            visible: {
                value: false
            },

            /**
             * alignPoints is the way popup will align itself wrt inputNode.
             * read more http://yuilibrary.com/yui/docs/overlay/#extended-xy-positioning
             * @attribute alignPoints
             * @type bool
             * @default [Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.BL]
             * @public
             */
            alignPoints: {
                value: [Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.BL],
                setter: function(val){
                    if(this.uiOverlay){
                        this.uiOverlay.set("align",{node:this.inputNode, points:val});
                    }
                    return val;
                }
            },

            /**
             * _inputNode
             *
             * @attribute _inputNode
             * @type Y.Node
             * @default null
             * @private
             */
            _inputNode: {
                valueFn: function() {
                    return Y.one(this.get('inputBox'));
                }
            }
        }
    });


/*
}, '0.0.0', {
    skinnable: false,
    requires: ['overlay', 'cssbutton', 'event', 'calendar', 'slider', 'widget-position', 'widget-position-align', 'widget-autohide']
});*/

}, 'gallery-2012.12.12-21-11', {
    "requires": [
        "yui-base",
        "overlay",
        "cssbutton",
        "event",
        "calendar",
        "slider",
        "widget-position",
        "widget-position-align",
        "widget-autohide"
    ]
});
