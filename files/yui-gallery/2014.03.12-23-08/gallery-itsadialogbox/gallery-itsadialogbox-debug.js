YUI.add('gallery-itsadialogbox', function (Y, NAME) {

'use strict';

/**
 * The Itsa Dialogbox module.
 *
 *
 * Dialogbox with sugar messages
 *
 * @module gallery-itsadialogbox
 * @class ITSADialogbox
 * @extends Panel
 * @constructor
 *
 * <i>Copyright (c) 2012 Marco Asbreuk - http://theinternetwizard.net</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

// Local constants
var Lang = Y.Lang,
    ITSADIALOG_ICON_TEMPLATE = "<div class='itsadialogbox-icon {iconclass}'></div>",
    ITSADIALOG_BODY_TEMPLATE = "<div{bdclass}>{bdtext}</div>",

    ITSAFORM_TABLETEMPLATE = '<td class="itsaform-tablelabel{classnamelabel}"{paddingstyle}>{label}</td>'+
                            '<td class="itsaform-tableelement"{paddingstyle}>{element}'+
                            '<div class="itsa-formelement-validationmessage itsa-formelement-hidden">{validationMessage}</div></td>',
    ITSAFORM_INLINETEMPLATE = '<span class="itsaform-spanlabel{classnamelabel}"{marginstyle}>{label}</span>'+
                            '{element}<div class="itsa-formelement-validationmessage itsa-formelement-hidden">{validationMessage}</div>';

//======================================
Y.ITSADIALOGBOX = Y.Base.create('itsadialogbox', Y.Panel, [], {

        ICON_BUBBLE : 'icon-bubble',
        ICON_INFO : 'icon-info',
        ICON_QUESTION : 'icon-question',
        ICON_WARN : 'icon-warn',
        ICON_ERROR : 'icon-error',
        ICON_SUCCESS : 'icon-success',
        ACTION_HIDE : '_actionHide',
        ACTION_STAYALIVE : '_actionStayAlive',
        ACTION_RESET : '_actionReset',
        ACTION_CLEAR : '_actionClear',
        panelOptions : [],
        _activePanelOption : null,
        _validationButtons : null,
        _descendantChange : 0,

// -- Public Static Properties -------------------------------------------------

/**
 * Reference to the editor's instance
 * @property ICON_BUBBLE
 * @type String
 */

/**
 * Reference to the editor's instance
 * @property ICON_INFO
 * @type String
 */

/**
 * Reference to the editor's instance
 * @property ICON_QUESTION
 * @type String
 */

/**
 * Reference to the editor's instance
 * @property ICON_WARN
 * @type String
 */

/**
 * Reference to the editor's instance
 * @property ICON_ERROR
 * @type String
 */

/**
 * Reference to the editor's instance
 * @property ICON_SUCCESS
 * @type String
 */

/**
 * Reference to the hide-function that can be attached to button.action. This function closes the Panel and executes the callback.
 * @property ACTION_HIDE
 * @type String
 */

/**
 * Reference to the stayalive-function that can be attached to button.action. This function just execute the callback, but the Panel stays alive.
 * In need you just want to read the Panel-values.
 * @property ACTION_STAYALIVE
 * @type String
 */

/**
 * Reference to the clear-function that can be attached to button.action. This function will clear any form-elements.
 * @property ACTION_CLEAR
 * @type String
 */

/**
 * Reference to the reset-function that can be attached to button.action. This function will reset any form-elements.
 * @property ACTION_RESET
 * @type String
 */

/**
 * Internal Array that holds all registred paneloptions, created through definePanel()
 * @property panelOptions
 * @type Array
 */

/**
 * Internal reference to the active panelOptions (which is active after showPanel() is called
 * @property _activePanelOption
 * @type Object
 */

/**
 * Nodelist that contains all current (from _activePanelOption) buttons that have button.validated set to true.
 * @property _validationButtons
 * @type Y.NodeList
 */

/**
 * Internal count that keeps track of how many times a descendentChange has been taken place by the focusManager
 * @property _descendantChange
 * @type Int
 */

        /**
         * @method initializer
         * @protected
        */
        initializer : function() {
            Y.log('initializer', 'info', 'ITSADIALOGBOX');
            var instance = this;
            instance.get('contentBox').plug(Y.Plugin.NodeFocusManager, {
                descendants: 'button, input, textarea',
                circular: true,
                focusClass: 'focus'
            });
            instance._initiatePanels();
        },

        /**
         * Defines a new Panel and stores it to the panelOptions-Array. Returns an panelId that can be used sot show the Panel later on using
         * showPanel(panelId).<br>
         * PanelOptions is an object that can have the following fields:<br>
           <ul><li>iconClass (String) className for the icon, for example Y.Global.ItsaDialog.ICON_QUESTION</li>
               <li>form (Array) Array with objects that will be transformed to Y.FORMELEMENT objects (not currently available)</li>
               <li>buttons (Object) Which buttons to use. For example:
               <br>&nbsp;&nbsp;{
                    <br>&nbsp;&nbsp;&nbsp;&nbsp;footer: [
                        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{name:'cancel', label:'Cancel', action: Y.Global.ItsaDialog.ACTION_HIDE},
                        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{name:'ok', label:'Ok',
                                action: Y.Global.ItsaDialog.ACTION_HIDE, validation: true, isDefault: true}
                    <br>&nbsp;&nbsp;&nbsp;&nbsp;]
               &nbsp;&nbsp;}
               </li>
            </ul>
            <br><br>
            You can use 4 actionfunctions to attach at the button: Y.Global.ItsaDialog.ACTION_HIDE, Y.Global.ItsaDialog.ACTION_STAYALIVE,
            Y.Global.ItsaDialog.ACTION_RESET and Y.Global.ItsaDialog.ACTION_CLEAR
         * @method definePanel
         * @param {Object} panelOptions The config-object.
         * @return {Integer} unique panelId
        */
        definePanel: function(panelOptions) {
            Y.log('definePanel', 'info', 'ITSADIALOGBOX');
            var instance = this;
            if (Lang.isObject(panelOptions)) {
                instance.panelOptions.push(panelOptions);
                return instance.panelOptions.length - 1;
            }
            else {
                Y.log('definePanel: Panel not defined because panelOptions is no object', 'warn', 'ITSADIALOGBOX');
                return -1;
            }
        },

        /**
         * Removes a panel by its panelId (which is generated by this.definePanel())
         *
         * @method removePanel
         * @param {Int} panelId Id of the panel to be removed. Retreive this value during definePanel()
        */
        removePanel: function(panelId) {
            var instance = this;
            if ((panelId>=0) && (panelId<instance.panelOptions.length)) {instance.panelOptions.splice(panelId, 1);}
        },

        /**
         * Shows the panel when you have a panelId. For usage with custom panels. The sugarmethods (showMessage() f.i.)
         * use this method under the hood).
         *
         * @method showPanel
         * @param {Int} panelId Id of the panel that has to be shown. Retreive this value during definePanel()
         * @param {String} [title] showed in the header of the Panel.
         * @param {String} [bodyText] showed inside the Panel.
         * @param {Function} [callback] callbackfunction to be excecuted.
         * @param {Object} [context] (this) in the callback.
         * @param {String | Array} [args] Arguments for the callback.
         * @param {Object} [customButtons] In case you want custom buttons that differ from those defined during definePanel.
         * @param {String} [customIconclass] In case you want to use an iconclass that is different from to one defined during definePanel.
         *                                                        Example: Y.Global.ItsaDialog.ICON_WARN
         * @param {Object} [eventArgs] do not use, only internal (temporarely)
        */
        showPanel: function(panelId, title, bodyText, callback, context, args, customButtons, customIconclass, eventArgs) {
            Y.log('showPanel', 'info', 'ITSADIALOGBOX');
            var instance = this,
                iconClass,
                contentBox = instance.get('contentBox');
            if ((panelId>=0) && (panelId<instance.panelOptions.length)) {
                instance._activePanelOption = instance.panelOptions[panelId];
                iconClass = customIconclass || instance._activePanelOption.iconClass;
                instance.get('boundingBox').toggleClass('withicon', Lang.isString(iconClass));
                // in case no title is given, the third argument will be the callback
                if (!Lang.isString(bodyText)) {
                    args = context;
                    context = callback;
                    callback = bodyText;
                    bodyText = title;
                    title = '&nbsp;'; // making the header appear
                }
                instance.set('headerContent', title || '&nbsp;'); // always making the header appear by display &nbsp;
                instance.set('bodyContent', (iconClass ? Lang.sub(ITSADIALOG_ICON_TEMPLATE, {iconclass: iconClass}) : '')
                    + Lang.sub(ITSADIALOG_BODY_TEMPLATE, {bdclass: (iconClass ? ' class="itsadialogbox-messageindent"' : ''), bdtext: bodyText}));
                instance.set('buttons', customButtons || instance._activePanelOption.buttons || {});
                instance._activePanelOption.callback = callback;
                instance._activePanelOption.context = context;
                instance._activePanelOption.args = args;
                instance._activePanelOption.eventArgs = eventArgs;
                // refreshing focusdescendents
                contentBox.focusManager.refresh();
                // recenter dialogbox in case it has been moved
                instance.centered();
                instance.activatePanel();
                contentBox.focusManager.focus(instance._getFirstFocusNode());
                instance.show();
            }
        },

        //==============================================================================

        /**
         * Shows a Panel with the buttons: <b>Abort Ignore Retry</b><br>
         * Look for <i>e.buttonName</i> to determine which button is pressed.
         * @method getRetryConfirmation
         * @param {String} [title] showed in the header of the Panel.
         * @param {String} question showed inside the Panel.
         * @param {Function} [callback] callbackfunction to be excecuted.
         * @param {Object} [context] (this) in the callback.
         * @param {String | Array} [args] Arguments for the callback.
         * @param {Object} [customButtons] In case you want buttons other that Cancel/Ok.
         * @param {String} [customIconclass] In case you want an Icon other that ICON_QUESTION.
        */
        getRetryConfirmation: function(title, question, callback, context, args, customButtons, customIconclass) {
            Y.log('askQuestion', 'info', 'ITSADIALOGBOX');
            this.showPanel(0, title, question, callback, context, args, customButtons, customIconclass);
        },

        /**
         * Shows a Panel with the buttons: <b>No Yes</b><br>
         * Look for <i>e.buttonName</i> to determine which button is pressed.
         * @method getConfirmation
         * @param {String} [title] showed in the header of the Panel.
         * @param {String} question showed inside the Panel.
         * @param {Function} [callback] callbackfunction to be excecuted.
         * @param {Object} [context] (this) in the callback.
         * @param {String | Array} [args] Arguments for the callback.
         * @param {Object} [customButtons] In case you want buttons other that Cancel/Ok.
         * @param {String} [customIconclass] In case you want an Icon other that ICON_QUESTION.
        */
        getConfirmation: function(title, question, callback, context, args, customButtons, customIconclass) {
            Y.log('getConfirmation', 'info', 'ITSADIALOGBOX');
            this.showPanel(1, title, question, callback, context, args, customButtons, customIconclass);
        },

        /**
         * Shows a Panel with an inputfield and the buttons: <b>Cancel Ok</b><br>
         * @method getInput
         * @param {String} title showed in the header of the Panel.
         * @param {String} message showed inside the Panel.
         * @param {String} [defaultmessage] showed inside the form-input.
         * @param {Function} [callback] callbackfunction to be excecuted.
         * @param {Object} [context] (this) in the callback.
         * @param {String | Array} [args] Arguments for the callback.
         * @param {Object} [customButtons] In case you want buttons other that Cancel/Ok.
         * @param {String} [customIconclass] In case you want an Icon other that ICON_QUESTION.
         * @return {String} passed by the eventTarget in the callback<br>
         * Look for <i>e.buttonName</i> to determine which button is pressed.<br>
         * Look for <i>e.value</i> to determine the userinput.
        */
        getInput: function(title, message, defaultmessage, callback, context, args, customButtons, customIconclass) {
            Y.log('getInput', 'info', 'ITSADIALOGBOX');
            var instance = this;
            instance.inputElement = new Y.ITSAFORMELEMENT({
                name: 'value',
                type: 'input',
                value: defaultmessage,
                classNameValue: 'yui3-itsadialogbox-stringinput itsa-formelement-lastelement',
                marginTop: 10,
                initialFocus: true,
                selectOnFocus: true
            });
            instance.showPanel(2, title, message + '<br>' + instance.inputElement.render(), callback, context, args, customButtons, customIconclass);
        },

        /**
         * Shows a login-Panel with an username/password fields and the buttons: <b>Cancel Ok</b><br>
         * @method getLogin
         * @param {String} title showed in the header of the Panel.
         * @param {String} message showed inside the Panel.
         * @param {Object} [logindata] this data will be used to present the formfields and defaultinput-values.
         * @param {Function} [callback] callbackfunction to be excecuted.
         * @param {Object} [context] (this) in the callback.
         * @param {String | Array} [args] Arguments for the callback.
         * @param {Object} [customButtons] In case you want buttons other that Cancel/Ok.
         * @param {String} [customIconclass] In case you want an Icon other that ICON_QUESTION.
         * @return {String} passed by the eventTarget in the callback<br>
         * Look for <i>e.buttonName</i> to determine which button is pressed.<br>
         * Look for <i>e.value</i> to determine the userinput.
        */
        getLogin: function(title, message, logindata, callback, context, args, customButtons, customIconclass) {
            Y.log('getInput', 'info', 'ITSADIALOGBOX');
            var instance = this,
                  logintable, defaultlogindata;
            defaultlogindata = {
                labelUsername: 'username',
                labelPassword: 'password',
                defaultUsername: '',
                defaultPassword: ''
            };
            logindata = logindata || defaultlogindata;
            instance.inputElementUsername = new Y.ITSAFORMELEMENT({
                label: logindata.labelUsername || defaultlogindata.labelUsername,
                name: 'username',
                type: 'input',
                value: logindata.defaultUsername || '',
                classNameValue: 'yui3-itsadialogbox-stringinput itsa-formelement-firstelement',
                marginTop: 24,
                initialFocus: true,
                selectOnFocus: true
            });
            instance.inputElementPassword = new Y.ITSAFORMELEMENT({
                label: logindata.labelPassword || defaultlogindata.labelPassword,
                name: 'password',
                type: 'password',
                value: logindata.defaultPassword || '',
                classNameValue: 'yui3-itsadialogbox-stringinput itsa-formelement-lastelement',
                marginTop: 7,
                initialFocus: false,
                selectOnFocus: true
            });
            logintable = '<table><tbody>';
            logintable += '<tr>'+instance.inputElementUsername.render(true)+'</tr>';
            logintable += '<tr>'+instance.inputElementPassword.render(true)+'</tr>';
            logintable += '</tbody></table>';
            instance.showPanel(7, title, message + '<br>' + logintable, callback, context, args, customButtons, customIconclass);
        },

        /**
         * Shows a Panel with an inputfield and the buttons: <b>Cancel Ok</b>. Only accepts integer-number as return.<br>
         * Look for <i>e.buttonName</i> to determine which button is pressed.<br>
         * Look for <i>e.value</i> to determine the userinput.
         * @method getNumber
         * @param {String} title showed in the header of the Panel.
         * @param {String} message showed inside the Panel.
         * @param {Integer} [defaultvalue] showed inside the form-input.
         * @param {Integer} [minvalue] used for validation.
         * @param {Integer} [maxvalue] used for validation.
         * @param {Function} [callback] callbackfunction to be excecuted.
         * @param {Object} [context] (this) in the callback.
         * @param {String | Array} [args] Arguments for the callback.
         * @param {Object} [customButtons] In case you want buttons other that Cancel/Ok.
         * @param {String} [customIconclass] In case you want an Icon other that ICON_QUESTION.
         * @return {Integer} passed by the eventTarget in the callback<br>
         * Look for <i>e.buttonName</i> to determine which button is pressed.<br>
         * Look for <i>e.value</i> to determine the userinput.
        */
        getNumber: function(title, message, defaultvalue, minvalue, maxvalue, callback, context, args, customButtons, customIconclass) {
            Y.log('getNumber', 'info', 'ITSADIALOGBOX');
            var instance = this,
                withMinValue = Lang.isNumber(minvalue),
                withMaxValue = Lang.isNumber(maxvalue),
                validationMessage = '',
                eventArguments = {};
            if (withMinValue && withMaxValue) {
                validationMessage = 'Input must be between '+minvalue+' and '+maxvalue;
            }
            else {
                if (withMinValue) {
                    validationMessage = 'Input must not be below '+minvalue;
                }
                if (withMaxValue) {
                    validationMessage = 'Input must not be above '+maxvalue;
                }
            }
            instance.inputElement = new Y.ITSAFORMELEMENT({
                name: 'value',
                type: 'input',
                value: defaultvalue ? defaultvalue.toString() : '',
                label: message,
                keyValidation: function(e) {
                    Y.log('keyValidation keyCode: ' +e.keyCode + ', charCode: ' + e.charCode + ', character: '+String.fromCharCode(e.keyCode),
                             'info', 'ITSADIALOGBOX');
                    var keycode = e.keyCode,
                        node = e.target,
                        reactivation = true,
                        cursor = node.get('selectionStart'),
                        cursorEnd = node.get('selectionEnd'),
                        previousStringValue = node.get('value'),
                        safeNumericalKeyCodeToString = String.fromCharCode(((keycode>=96) && (keycode<=105)) ? keycode - 48 : keycode),
                        nextValue,
                        minValue = e.minValue,
                        maxValue = e.maxValue,
                        digits = [48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105],
                        valid = [8,9,13,27,37,38,39,40,46,48,49,50,51,52,53,54,55,56,57,173,189,45,96,97,98,99,100,101,102,103,104,105,109],
                        // 173,189,45 all can be minus-token
                        minustoken = [173,189,45,109];
                    if (Y.Array.indexOf(valid, keycode) === -1) {
                        Y.log('keyValidation failed: key ' + keycode + ' not in whitelist', 'info', 'ITSADIALOGBOX');
                        e.halt(true);
                        return false;
                    }
                    if (((e.shiftKey) && (keycode!==9) && (keycode!==37) && (keycode!==38) && (keycode!==39) &&
                                                                                     (keycode!==40)) || (e.ctrlKey) || (e.altKey) || (e.metaKey)) {
                        Y.log('keyValidation failed: zero is not allowed because of metakey other than shift-tab or shift-cursor',
                                 'info', 'ITSADIALOGBOX');
                        e.halt(true);
                        return false;
                    }
                    // no digit of zero at the beginning when minimum>0
                    if (Lang.isNumber(minValue) && (minValue>0) && (cursor===0) && ((keycode===48) || (keycode===96))) {
                        Y.log('keyValidation failed: zero is not allowed because minimum of '+minValue, 'info', 'ITSADIALOGBOX');
                        e.halt(true);
                        return false;
                    }
                    // no digit of zero at second position when first position=0
                    if ((cursor===1) && ((keycode===48) || (keycode===96)) && ((previousStringValue==='0') || (previousStringValue==='-'))) {
                        Y.log('keyValidation failed: 00 and -0 are not allowed', 'info', 'ITSADIALOGBOX');
                        e.halt(true);
                        return false;
                    }
                    // no minus at the beginning when minimum>=0
                    if (Lang.isNumber(minValue) && (minValue>=0) && (cursor===0) && (Y.Array.indexOf(minustoken, keycode) !== -1)) {
                        Y.log('keyValidation failed: minus is not allowed because minimum of '+minValue, 'info', 'ITSADIALOGBOX');
                        e.halt(true);
                        return false;
                    }
                    // no minus when not at the beginning
                    if ((cursor>0) && (Y.Array.indexOf(minustoken, keycode) !== -1)) {
                        Y.log('keyValidation failed: minus is only allowed at the beginning of the input', 'info', 'ITSADIALOGBOX');
                        e.halt(true);
                        return false;
                    }
                    // not valid when number will become lower than minimum, only check if field is modified
                    if ((Lang.isNumber(minValue) || Lang.isNumber(maxValue)) &&
                        ((Y.Array.indexOf(digits, keycode) !== -1) || (keycode===8) || (keycode===46))) {
                        // transform e.keyCode to a keyCode that can be translated to chareacter --> numerical
                        // keyboard will be transformed to normal keyboard
                        if (keycode===8) {
                            nextValue = parseInt(previousStringValue.substring(0, (cursor===cursorEnd) ? cursor-1 : cursor) +
                                                previousStringValue.substring(cursorEnd), 10);
                        }
                        else if (keycode===46) {
                            nextValue = parseInt(previousStringValue.substring(0, cursor) +
                                                previousStringValue.substring((cursor===cursorEnd) ? cursorEnd+1 : cursorEnd), 10);
                        }
                        else {
                            nextValue = parseInt(previousStringValue.substring(0, cursor) + safeNumericalKeyCodeToString +
                                                previousStringValue.substring(cursorEnd), 10);
                        }
                        Y.log('Precheck if next value ' + nextValue + ' is within range', 'info', 'ITSADIALOGBOX');
                        if (!Lang.isNumber(nextValue)) {
                            Y.log('keyValidation failed: '+nextValue+' is not a number', 'info', 'ITSADIALOGBOX');
                            if (e.showValidation) {e.showValidation();}
                            if (e.deactivatePanel) {e.deactivatePanel();}
                            reactivation = false;
                        }
                        else if (Lang.isNumber(minValue) && (nextValue<minValue)) {
                            Y.log('keyValidation failed: '+nextValue+' is lower than '+minValue, 'info', 'ITSADIALOGBOX');
                            if (e.showValidation) {e.showValidation();}
                            if (e.deactivatePanel) {e.deactivatePanel();}
                            reactivation = false;
                        }
                        else if (Lang.isNumber(maxValue) && (nextValue>maxValue)) {
                            Y.log('keyValidation failed: '+nextValue+' is higher than '+maxValue, 'info', 'ITSADIALOGBOX');
                            if (e.showValidation) {e.showValidation();}
                            if (e.deactivatePanel) {e.deactivatePanel();}
                            reactivation = false;
                        }
                    }
                    // correct possible 0x by removing leading 0
                    // because for some reason, this also is called when got blurred: do only check if number is digit
                    if ((cursor===1) && (previousStringValue==='0') && (Y.Array.indexOf(digits, keycode) !== -1)) {
                        Y.log('Autocorrection: removing leading zero', 'info', 'ITSADIALOGBOX');
                        node.set('value', '');
                    }
                    // only reactivate when the key is not a key that leaves the element
                    if ((keycode!==9) && (keycode!==13)) {
                        if (reactivation && e.hideValidation) {e.hideValidation();}
                        if (reactivation && e.activatePanel) {e.activatePanel();}
                    }
                    return true;
                },
                autoCorrection: function(e) {
                    var formelement = this,
                        minvalue = e && e.minValue,
                        maxvalue = e && e.maxValue,
                        previousValue = formelement.get('elementNode').get('value'),
                        value = ((previousValue==='') || (previousValue==='-')) ? 0 : previousValue,
                        newValue = parseInt(value, 10);
                    Y.log('autoCorrection previous: '+previousValue+', final: '+newValue, 'info', 'ITSADIALOGBOX');
                    formelement.set('value', newValue.toString());
                    if ((Lang.isNumber(minvalue) && (newValue<minvalue)) || (Lang.isNumber(maxvalue) && (newValue>maxvalue))) {
                        if (e.showValidation) {e.showValidation();}
                        if (e.activatePanel) {e.activatePanel();}
                        return false;
                    }
                    return true;
                },
                validationMessage: validationMessage,
                classNameValue: 'yui3-itsadialogbox-numberinput itsa-formelement-lastelement',
                initialFocus: true,
                selectOnFocus: true
            });
            if (Lang.isNumber(minvalue)) {eventArguments.minValue = minvalue;}
            if (Lang.isNumber(maxvalue)) {eventArguments.maxValue = maxvalue;}
            if (validationMessage) {
                eventArguments.showValidation = Y.bind(instance.inputElement.showValidation, instance.inputElement);
                eventArguments.hideValidation = Y.bind(instance.inputElement.hideValidation, instance.inputElement);
            }
            if (eventArguments.minValue || eventArguments.maxValue) {
                eventArguments.activatePanel = Y.bind(instance.activatePanel, instance);
                eventArguments.deactivatePanel = Y.bind(instance.deactivatePanel, instance);
            }
            instance.showPanel(3, title, instance.inputElement.render(), callback, context, args, customButtons, customIconclass, eventArguments);
        },

        /**
         * Shows an ErrorMessage (Panel)
         * @method showErrorMessage
         * @param {String} [title] showed in the header of the Panel.
         * @param {String} errormessage showed inside the Panel.
         * @param {Function} [callback] callbackfunction to be excecuted.
         * @param {Object} [context] (this) in the callback.
         * @param {String | Array} [args] Arguments for the callback.
        */
        showErrorMessage: function(title, errormessage, callback, context, args) {
            Y.log('showErrorMessage', 'info', 'ITSADIALOGBOX');
            this.showPanel(4, title, errormessage, callback, context, args);
        },

        /**
         * Shows a Message (Panel)
         * @method showMessage
         * @param {String} [title] showed in the header of the Panel.
         * @param {String} errormessage showed inside the Panel.
         * @param {Function} [callback] callbackfunction to be excecuted.
         * @param {Object} [context] (this) in the callback.
         * @param {String | Array} [args] Arguments for the callback.
         * @param {Object} [customButtons] In case you want buttons other that Cancel/Ok.
         * @param {String} [customIconclass] In case you want an Icon other that ICON_QUESTION.
        */
        showMessage: function(title, message, callback, context, args, customButtons, customIconclass) {
            Y.log('showMessage', 'info', 'ITSADIALOGBOX');
            this.showPanel(5, title, message, callback, context, args, customButtons, customIconclass);
        },

        /**
         * Shows an Warning (Panel)
         * @method showWarning
         * @param {String} [title] showed in the header of the Panel.
         * @param {String} warning showed inside the Panel.
         * @param {Function} [callback] callbackfunction to be excecuted.
         * @param {Object} [context] (this) in the callback.
         * @param {String | Array} [args] Arguments for the callback.
        */
        showWarning: function(title, warning, callback, context, args) {
            Y.log('showWarning', 'info', 'ITSADIALOGBOX');
            this.showPanel(6, title, warning, callback, context, args);
        },

        //==============================================================================

        /**
         * Hides the panel and executes the callback. <br>
         * Will not execute if the targetbutton has been disabled through validation.
         * @method _actionHide
         * @param {eventTarget} e
         * @private
        */
        _actionHide: function(e){
            Y.log('_actionHide', 'info', 'ITSADIALOGBOX');
            var instance = this,
                bd = instance.get('contentBox').one('.yui3-widget-bd'),
                ev = instance._serializeForm(bd),
                button = e.target;
            e.preventDefault();
            if (!button.hasClass('yui3-button-disabled')) {
                ev.buttonName = e.target.getData('name');
                instance.hide();
                if (Y.Lang.isFunction(instance._activePanelOption.callback)) {
                    Y.rbind(instance._activePanelOption.callback, instance._activePanelOption.context, ev, instance._activePanelOption.args)();
                }
            }
        },

        /**
         * Just executes the callback while the Panel stays on the screen. Used when you just want to read form-information for example.<br>
         * Will not execute if the targetbutton has been disabled through validation.
         * @method _actionStayAlive
         * @param {eventTarget} e
         * @private
        */
        _actionStayAlive: function(e){
            Y.log('_actionStayAlive', 'info', 'ITSADIALOGBOX');
            var instance = this,
                bd = instance.get('contentBox').one('.yui3-widget-bd'),
                ev = instance._serializeForm(bd),
                button = e.target;
            e.preventDefault();
            if (!button.hasClass('yui3-button-disabled')) {
                ev.buttonName = e.target.getData('name');
                if (Y.Lang.isFunction(instance._activePanelOption.callback)) {
                    Y.rbind(instance._activePanelOption.callback, instance._activePanelOption.context, ev, instance._activePanelOption.args)();
                }
            }
        },

        /**
         * Resets any form-elements inside the panel.<br>
         * Does not execute the callback.
         * --- This function does not work yet ---
         * @method _actionStayAlive
         * @param {eventTarget} e
         * @private
        */
        _actionReset: function(e){
            Y.log('_actionReset', 'info', 'ITSADIALOGBOX');
            var instance = this,
                bd = instance.get('contentBox').one('.yui3-widget-bd'),
                ev = instance._serializeForm(bd);
            e.preventDefault();
            ev.buttonName = e.target.getData('name');
        },

        /**
         * Clears all form-elements inside the panel.<br>
         * Does not execute the callback.
         * --- This function does not work yet ---
         * @method _actionStayAlive
         * @param {eventTarget} e
         * @private
        */
        _actionClear: function(e){
            Y.log('_actionClear', 'info', 'ITSADIALOGBOX');
            var instance = this,
                bd = instance.get('contentBox').one('.yui3-widget-bd'),
                ev = instance._serializeForm(bd);
            e.preventDefault();
            ev.buttonName = e.target.getData('name');
        },

        /**
         * overrules Y.panel.focus, by focussing on the panel first, and then using the focusmanager to focus on the right element.
         * @method focus
        */
        focus: function(){
            Y.log('focus', 'info', 'ITSADIALOGBOX');
            var instance = this,
                contentBox = instance.get('contentBox'),
                focusManager = contentBox.focusManager;
            // apply returns something, call just runs. First argument is 'this' in the function, next arguments are the arguments in targetfunction
            instance.constructor.superclass.focus.call(instance);
            if (focusManager) {
                focusManager.focus();
            }
        },

        /**
         * Define all eventhandlers
         * @method bindUI
        */
        bindUI: function() {
            Y.log('bindUI', 'info', 'ITSADIALOGBOX');
            var instance = this,
                contentBox = instance.get('contentBox'),
                focusManager = contentBox.focusManager;
            instance._panelListener = contentBox.on(
                'keydown',
                function (e) {
                    if (e.keyCode === 9) { // tab
                        Y.log('tabkey pressed', 'info', 'ITSADIALOGBOX');
                        e.preventDefault();
                        this.shiftFocus(e.shiftKey);
                    }
                },
                instance
            );
            instance._buttonsListener = instance.after(
                'buttonsChange',
                instance._setValidationButtons,
                instance
            );
            instance._descendantListener = focusManager.on(
                'activeDescendantChange',
                function (e) {
                    var instance = this,
                        previousDescendant = e.prevVal,
                        nextDescendant = e.newVal,
                        defaultButton,
                        isButton,
                        allDescendants = focusManager.get('descendants'),
                        sameDescendant;
                    instance._descendantChange++;
                    if (Lang.isNumber(previousDescendant) && (previousDescendant>=0)) {previousDescendant = allDescendants.item(e.prevVal);}
                    if (Lang.isNumber(nextDescendant)) {nextDescendant = allDescendants.item(e.newVal);}
                    sameDescendant = nextDescendant.compareTo(previousDescendant);
                    Y.log('new element focussed: '+nextDescendant, 'info', 'ITSADIALOGBOX');
                    defaultButton = contentBox.one('.yui3-button-primary');
                    isButton = (nextDescendant.get('tagName')==='BUTTON');
                    if (defaultButton) {
                        defaultButton.toggleClass('nofocus', ((nextDescendant!==defaultButton) && isButton));
                    }
                    // to make a pressed button highlighted, we must add a seperate class
                    allDescendants.removeClass('mousepressfocus');
                    if (isButton) {
                        nextDescendant.addClass('mousepressfocus');
                    }
                    // now: by first time showing the Panel, the focusManager activeDescendent will be called three times, before steady state
                    // in case of an element that gets focused.
                    // To make the content be selected again (if requested) look at the value of instance._descendant
                    if ((!sameDescendant || (instance._descendantChange<4)) && nextDescendant.hasClass('itsa-formelement-selectall')) {
                        Y.log('new element full selected', 'info', 'ITSADIALOGBOX');
                        nextDescendant.select();
                    }
                    if (!sameDescendant) {
                        instance._validate(isButton, nextDescendant);
                    }
                },
                instance,
                contentBox
            );
            // because the header might not exists yet (at rendering it doesn't), we have to delegate next events
            // instead of binding it to the headernode
            instance._headerMousedownListener = contentBox.delegate(
                'mousedown',
                function(e) {e.target.addClass('cursormove');},
                '.yui3-widget-hd'
            );
            instance._headerMouseupListener = contentBox.delegate(
                'mouseup',
                function(e) {e.target.removeClass('cursormove');},
                '.yui3-widget-hd'
            );
            // same for input elements
            instance._inputListener = contentBox.delegate(
                'keydown',
                instance._checkInput,
                'input',
                instance
            );
            // now, listen for checkboxes: the loose focus when they get clicked.
            instance._checkBoxListener = contentBox.delegate(
                'change',
                instance._shiftFocusFromCheckbox,
                function(){
                    var node =this;
                    return ((node.get('tagName')==='INPUT') && (node.get('type')==='checkbox'));
                },
                instance
            );
            // reset the focus when clicked on an area inside contentBox that is not an element
            contentBox.on(
                'click',
                function() {
                    // this = focusManeger
                    this.focus(this.get('activeDescendant'));
                },
                focusManager
            );
        },

        /**
         * Hides the panel and executes the callback. <br>
         * Will not execute if the targetbutton has been disabled through validation.
         * @method shiftFocus
         * @param {Boolean} [backward] direction to shift
         * @param {eventTarget} [referenceNode] startnode, when not supplied, the node that currently has focused will be used.
        */
        shiftFocus: function(backward, referenceNode) {
            Y.log('shiftFocus', 'info', 'ITSADIALOGBOX');
            var instance = this,
                focusManager = instance.get('contentBox').focusManager,
                focusManagerNodes = focusManager.get('descendants'),
                activeDescendant = referenceNode ? focusManagerNodes.indexOf(referenceNode) : focusManager.get('activeDescendant'),
                numberDescendants = focusManagerNodes.size();
                if (referenceNode || focusManager.get('focused')) {
                    if (Lang.isBoolean(backward) && backward) {
                        activeDescendant--;
                        focusManager.focus((activeDescendant<0) ? numberDescendants-1 : activeDescendant);
                    }
                    else {
                        activeDescendant++;
                        focusManager.focus((activeDescendant>=numberDescendants) ? 0 : activeDescendant);
                    }
                }
                else {
                    focusManager.focus(instance._getFirstFocusNode());
                }
        },

        /**
         * Makes the focus set on next element when a checkbox is clicked.<br>
         * @method _shiftFocusFromCheckbox
         * @param {eventTarget} e
         * @private
        */
        _shiftFocusFromCheckbox: function(e) {
            Y.log('_shiftFocusFromCheckbox '+e.target, 'info', 'ITSADIALOGBOX');
            var instance = this,
                checkboxNode = e.target;
            if (checkboxNode.hasClass('itsa-formelement-lastelement')) {
                instance.get('contentBox').focusManager.focus(instance._getDefaultButtonNode());
            }
            else {
                instance.shiftFocus(false, checkboxNode);
            }
        },

        /**
         * Internal function that is called by 'keydown'-event when using input-elements.<br>
         * If the element has keyvalidation, then its keyvalidation-function is called, which could prevent the keyinput.<br>
         * If Enter is pressed, the focus is set on the next element <b>or</b> if it's the last element the ACTION_HIDE is called<br>
         * If the element has autocorrection, autocorrect-function is called.<br>
         * If this returns false, then all buttons with button.validation=true get disabled and  ACTION_HIDE is prevented, if returns true,
         * all these buttons get enabled.
         * @method _checkInput
         * @param {eventTarget} e
         * @private
        */
        _checkInput: function(e) {
            Y.log('_checkInput', 'info', 'ITSADIALOGBOX');
            var instance = this,
                node = e.target,
                autoCorrection,
                autoCorrectResult,
                eventArgs = instance._activePanelOption.eventArgs;
            if (node.hasClass('itsa-formelement-keyvalidation') && instance.inputElement) {
                Y.mix(e, eventArgs);
                if (!instance.inputElement.get('keyValidation')(e)) {
                    return;
                }
            }
            if (e.keyCode===13) {
                Y.log('enterkey pressed', 'info', 'ITSADIALOGBOX');
                e.preventDefault();
                if (node.hasClass('itsa-formelement-lastelement')) {
                    autoCorrection = instance.inputElement && instance.inputElement.get('autoCorrection');
                    autoCorrectResult = true;
                    if (autoCorrection) {
                        autoCorrectResult = Y.bind(autoCorrection, instance.inputElement, eventArgs)();
                        if (!autoCorrectResult) {
                            eventArgs.showValidation();
                            instance.deactivatePanel();
                            instance.get('contentBox').focusManager.focus(instance._getFirstFocusNode());
                        }
                    }
                    if (autoCorrectResult) {
                        // because the callback should think the activebutton was clicked, we add the right name-data to this Node
                        node.setData('name', instance._getDefaultButtonNode().getData('name'));
                        instance._actionHide(e);
                    }
                    else {
                        node.select();
                    }
                }
                else {
                    instance.shiftFocus();
                }
            }
        },

        /**
         * Internal function that is called when an descendant changes. To validate inputelements (if present)<br>
         * If the element has autocorrection, autocorrect-function is called.<br>If this returns false, then all buttons with button.validation=true
         * get disabled, if returns true, all these buttons get enabled.
         * @method _validate
         * @private
        */
        _validate: function(isButton, node) {
            Y.log('_validate', 'info', 'ITSADIALOGBOX');
            var instance = this,
                eventArgs = instance._activePanelOption.eventArgs,
                buttonValidation = isButton && node.hasClass('itsadialogbox-button-validated'),
                autoCorrection = instance.inputElement && instance.inputElement.get('autoCorrection'),
                autoCorrectResult = true;
            if (autoCorrection && buttonValidation) {
                autoCorrectResult = Y.bind(autoCorrection, instance.inputElement, eventArgs)();
                if (!autoCorrectResult) {
                    if (eventArgs && eventArgs.showValidation) {
                        eventArgs.showValidation();
                    }
                    instance.deactivatePanel();
                }
            }
            if (autoCorrectResult) {
                if (eventArgs && eventArgs.hideValidation) {
                    eventArgs.hideValidation();
                }
                instance.activatePanel();
            }
        },

        /**
         * Enables all buttons with button.validation=true
         * @method activatePanel
        */
        activatePanel: function() {
            Y.log('activatePanel', 'info', 'ITSADIALOGBOX');
            this._validationButtons.toggleClass('yui3-button-disabled', false);
        },

        /**
         * Disnables all buttons with button.validation=true
         * @method deactivatePanel
        */
        deactivatePanel: function() {
            Y.log('deactivatePanel', 'info', 'ITSADIALOGBOX');
            this._validationButtons.toggleClass('yui3-button-disabled', true);
        },

        /**
         * Cleans up bindings
         * @method destructor
         * @protected
        */
        destructor: function() {
            Y.log('destructor', 'info', 'ITSADIALOGBOX');
            var instance = this;
            if (instance.keyDownHandle) {instance.keyDownHandle.detach();}
            if (instance._panelListener) {instance._panelListener.detach();}
            if (instance._descendantListener) {instance._descendantListener.detach();}
            if (instance._headerMousedownListener) {instance._headerMousedownListener.detach();}
            if (instance._headerMouseupListener) {instance._headerMouseupListener.detach();}
            if (instance._inputListener) {instance._inputListener.detach();}
            if (instance._checkBoxListener) {instance._checkBoxListener.detach();}
            if (instance._buttonsListener) {instance._buttonsListener.detach();}
            instance.panelOptions.length = 0;
        },

        //==============================================================================

        /**
         * Internal method that looks for all buttons with button.validation=true and markes them with a validated-class<br>
         * Will be executed when the buttons are changed.
         * @method _setValidationButtons
         * @private
        */
        _setValidationButtons : function() {
            Y.log('_setValidationButtons', 'info', 'ITSADIALOGBOX');
            var instance = this,
                buttonsObject = instance._activePanelOption.buttons,
                contentBox = instance.get('contentBox');
            contentBox.all('.itsadialogbox-button-validated').removeClass('itsadialogbox-button-validated');
            if (buttonsObject) {
                if (buttonsObject.header) {
                    Y.Array.each(
                        buttonsObject.header,
                        instance._markButtonValidated,
                        instance
                    );
                }
                if (buttonsObject.body) {
                    Y.Array.each(
                        buttonsObject.body,
                        instance._markButtonValidated,
                        instance
                    );
                }
                if (buttonsObject.footer) {
                    Y.Array.each(
                        buttonsObject.footer,
                        instance._markButtonValidated,
                        instance
                    );
                }
            }
            instance._validationButtons = contentBox.all('.itsadialogbox-button-validated');
        },

        /**
         * Internal method that markes a button with a validated-class if it has button.validation=true<br>
         * @method _markButtonValidated
         * @param {Object} buttonObject
         * @private
        */
        _markButtonValidated : function(buttonObject) {
            Y.log('_markButtonValidated '+buttonObject.name, 'info', 'ITSADIALOGBOX');
            var instance = this,
                name = buttonObject.name,
                validation,
                buttonNode;
            buttonNode = instance.getButton(name);
            if (buttonNode) {
                validation = buttonObject.validation;
                if (Lang.isBoolean(validation) && validation) {
                    buttonNode.addClass('itsadialogbox-button-validated');
                }
            }
        },

        /**
         * Definition of the predefined Panels (like showMessage() etc.)
         * @method _initiatePanels
         * @private
        */
        _initiatePanels : function() {
            Y.log('_initiatePanels', 'info', 'ITSADIALOGBOX');
            var instance = this;
            // creating getRetryConfirmation
            instance.definePanel({
                iconClass: instance.ICON_WARN,
                buttons: {
                    footer: [
                        {name:'abort', label:'Abort', action:instance.ACTION_HIDE},
                        {name:'ignore', label:'Ignore', action:instance.ACTION_HIDE},
                        {name:'retry', label:'Retry', action:instance.ACTION_HIDE, isDefault: true}
                    ]
                }
            });
            // creating getConfirmation
            instance.definePanel({
                iconClass: instance.ICON_INFO,
                buttons: {
                    footer: [
                        {name:'no', label:'No', action:instance.ACTION_HIDE, isDefault: true},
                        {name:'yes', label:'Yes', action:instance.ACTION_HIDE}
                    ]
                }
            });
            // creating getInput
            instance.definePanel({
                iconClass: instance.ICON_QUESTION,
                form: [
                    {name:'count', label:'{message}', value:'{count}'}
                ],
                buttons: {
                    footer: [
                        {name:'cancel', label:'Cancel', action:instance.ACTION_HIDE},
                        {name:'ok', label:'Ok', action:instance.ACTION_HIDE, validation: true, isDefault: true}
                    ]
                }
            });
            // creating getNumber
            instance.definePanel({
                iconClass: instance.ICON_QUESTION,
                form: [
                    {name:'count', label:'{message}', value:'{count}'}
                ],
                buttons: {
                    footer: [
                        {name:'cancel', label:'Cancel', action:instance.ACTION_HIDE},
                        {name:'ok', label:'Ok', action:instance.ACTION_HIDE, validation: true, isDefault: true}
                    ]
                }
            });
            // creating showErrorMessage
            instance.definePanel({
                iconClass: instance.ICON_ERROR,
                buttons: {
                    footer: [
                        {name:'ok', label:'Ok', action:instance.ACTION_HIDE, isDefault: true}
                    ]
                }
            });
            // creating showMessage
            instance.definePanel({
                buttons: {
                    footer: [
                        {name:'ok', label:'Ok', action:instance.ACTION_HIDE, isDefault: true}
                    ]
                }
            });
            // creating showWarning
            instance.definePanel({
                iconClass: instance.ICON_WARN,
                buttons: {
                    footer: [
                        {name:'ok', label:'Ok', action:instance.ACTION_HIDE, isDefault: true}
                    ]
                }
            });

            // creating loginPanel (id=7)
            instance.definePanel({
                iconClass: instance.ICON_INFO,
                form: [
                    {name:'username', label:'{username}', value:'{username}'},
                    {name:'password', label:'{password}', value:'{password}'}
                ],
                buttons: {
                    footer: [
                        {name:'login', label:'Login', action:instance.ACTION_HIDE, isDefault: true}
                    ]
                }
            });
        },

        /**
         * Definition of the predefined Panels (like showMessage() etc.)
         * this can be a form-element. But if no form-element has focus defined, the first form-element should get focus.
         * If no form element is present, then the defaultbutton should get focus
         * @method _getFirstFocusNode
         * @private
         * return {Y.Node} the Node that should get focus when panel is showed.
        */
        _getFirstFocusNode: function() {
            var instance = this,
                contentBox = instance.get('contentBox'),
                focusnode;
            focusnode = contentBox.one('.itsa-formelement-firstfocus') || contentBox.one('.itsa-firstformelement') ||
                                                                                                                instance._getDefaultButtonNode();
            Y.log('_getFirstFocusNode: '+focusnode, 'info', 'ITSADIALOGBOX');
            return focusnode;
        },

        /**
         * Returns the default button: the buttonNode that has the primary focus.<br>
         * This should be set during definition of PanelOptions.
         * @method _getDefaultButtonNode
         * @private
         * return {Y.Node} buttonNode
        */
        _getDefaultButtonNode: function() {
            var node = this.get('contentBox').one('.yui3-button-primary');
            Y.log('_getDefaultButtonNode: '+node, 'info', 'ITSADIALOGBOX');
            return node;
        },

        /**
         * Returns all form-elements in panel
         * @method _serializeForm
         * @private
         * return {Object} Contains all form-elements with name/value pair
        */
        _serializeForm: function(masterNode) {
            // At this moment only text-inputs are allowed.
            // at later stage, handle this by Y.ITSAFORM with a true serialize function
            Y.log('_serializeForm', 'info', 'ITSADIALOGBOX');
            var formelements = masterNode.all('.itsa-formelement'),
                  value,
                  intValue,
                  serialdata = {};
            formelements.each(
                function(formelementNode) {
                    value = formelementNode.get('value');
                    intValue = parseInt(value, 10);
                    // now check with DOUBLE == (not threedouble) to see if value == intValue --> in that case we have an integer
                    serialdata[formelementNode.get('name')] = (value===intValue.toString()) ? intValue : value;
                }
            );
            return serialdata;
        }

    }, {
        ATTRS : {
        }
    }
);

//=================================================================================

if (!Y.Global.ItsaDialog) {
    Y.Global.ItsaDialog = new Y.ITSADIALOGBOX({
        visible: false,
        centered: true,
        render : true,
        zIndex : 21000,
        modal  : true,
        bodyContent : '',
        focusOn: [
            {eventName: 'clickoutside'}
        ]
    });
    Y.Global.ItsaDialog.plug(Y.Plugin.Drag);
    Y.Global.ItsaDialog.dd.addHandle('.yui3-widget-hd');
}

Y.ItsaDialogBox = Y.Global.ItsaDialog;

//=================================================================================

// Y.ITSAFORMELEMENT should get an own module. For the short time being, we will keep it inside itsa-dialog

/**
 * Y.ITSAFORMELEMENT
 *
 * @module gallery-itsadialogbox
 * @class ITSAFormelement
 * @extends Panel
 * @constructor
 *
 * <i>Copyright (c) 2012 Marco Asbreuk - http://theinternetwizard.net</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

Y.ITSAFORMELEMENT = Y.Base.create('itsaformelement', Y.Base, [], {

        id: null,

        /**
         * Sets up the toolbar during initialisation. Calls render() as soon as the hosts-editorframe is ready
         *
         * @method initializer
         * @protected
        */
        initializer : function() {
            Y.log('initializer', 'info', 'ITSAFORM');
            this.id = Y.guid();
        },

        /**
         * Renderes a String that contains the completeFormElement definition.<br>
         * To be used in an external Form
         * @method render
         * @param {boolean} tableform If the renderedstring should be in tableform: encapsuled by td-elements (without tr)
         * @return {String} rendered String
        */
        render : function(tableform) {
            var instance = this,
                marginTop = instance.get('marginTop'),
                marginStyle = (marginTop && !tableform) ? ' style="margin-top:' + marginTop + 'px"' : '',
                paddingStyle = marginTop ? ' style="padding-top:' + marginTop + 'px"' : '',
                type = instance.get('type'),
                classNameLabel = instance.get('classNameLabel'),
                classNameValue = instance.get('classNameValue'),
                initialFocus = instance.get('initialFocus'),
                selectOnFocus = instance.get('selectOnFocus'),
                keyValidation = instance.get('keyValidation'),
                validation = instance.get('validation'),
                autoCorrection = instance.get('autoCorrection'),
                initialFocusClass = initialFocus ? ' itsa-formelement-firstfocus' : '',
                selectOnFocusClass = selectOnFocus ? ' itsa-formelement-selectall' : '',
                keyValidationClass = keyValidation ? ' itsa-formelement-keyvalidation' : '',
                validationClass = validation ? ' itsa-formelement-validation' : '',
                autoCorrectionClass = autoCorrection ? ' itsa-formelement-autocorrect' : '',
                elementClass = ' class="itsa-formelement ' + classNameValue + initialFocusClass + selectOnFocusClass + keyValidationClass +
                                          validationClass + autoCorrectionClass+'"',
                element = '';
            if (type==='input') {element = '<input id="' + instance.id + '" type="text" name="' + instance.get('name') + '" value="' +
                                                            instance.get('value') + '"' + elementClass + marginStyle + ' />';}
            if (type==='password') {element = '<input id="' + instance.id + '" type="password" name="' + instance.get('name') + '" value="' +
                                                                   instance.get('value') + '"' + elementClass + marginStyle + ' />';}
            return  Lang.sub(
                        tableform ? ITSAFORM_TABLETEMPLATE : ITSAFORM_INLINETEMPLATE,
                        {
                            marginstyle: marginStyle,
                            paddingstyle: paddingStyle,
                            label: instance.get('label'),
                            element: element,
                            classnamelabel: classNameLabel,
                            validationMessage: instance.get('validationMessage'),
                            classnamevalue: classNameValue
                        }
                    );
        },

        /**
         * Shows the validationmessage
         * @method showValidation
        */
        showValidation : function() {
            var element = this.get('elementNode');
            if (element) {
                element.get('parentNode').one('.itsa-formelement-validationmessage').toggleClass('itsa-formelement-hidden', false);
            }
        },

        /**
         * Hides the validationmessage
         * @method hideValidation
        */
        hideValidation : function() {
            var element = this.get('elementNode');
            if (element) {
                element.get('parentNode').one('.itsa-formelement-validationmessage').toggleClass('itsa-formelement-hidden', true);
            }
        },

        /**
         * Cleans up bindings
         * @method destructor
         * @protected
        */
        destructor : function() {
            Y.log('destructor', 'info', 'ITSAFORM');
            var instance = this;
            if (instance.blurevent) {instance.blurevent.detach();}
            if (instance.keyevent) {instance.keyevent.detach();}
        }

    }, {
        ATTRS : {
            /**
             * @description The value of the element
             * @attribute [value]
             * @type String | Boolean | Array(String)
            */
            name : {
                value: 'undefined-name',
                setter: function(val) {
                    var node = this.get('elementNode');
                    if (node) {
                        node.set('name', val);
                    }
                    return val;
                },
                validator: function(val) {
                    return (Lang.isString(val));
                }
            },
            /**
             * @description Must have one of the following values:
             * <ul><li>input</li><li>password</li><li>textarea</li><li>checkbox</li><li>radiogroup</li><li>selectbox</li><li>hidden</li></ul>
             * @attribute typr
             * @type String
            */
            type : {
                value: '',
                setter: function(val) {
                    if (Lang.isString(val)) {val=val.toLowerCase();}
                    return val;
                },
                validator: function(val) {
                    return (Lang.isString(val) &&
                            ((val==='input') ||
                             (val==='password') ||
                             (val==='textarea') ||
                             (val==='checkbox') ||
                             (val==='radiogroup') ||
                             (val==='selectbox') ||
                             (val==='button') ||
                             (val==='hidden')
                            )
                    );
                }
            },
            /**
             * @description The value of the element
             * @attribute [value]
             * @type String | Boolean | Array(String)
            */
            value : {
                value: null,
                setter: function(val) {
                    var node = this.get('elementNode');
                    if (node) {
                        node.set('value', val);
                    }
                    return val;
                }
            },
            /**
             * @description The label that wis present before the element
             * @attribute [label]
             * @type String
            */
            label : {
                value: '',
                validator: function(val) {
                    return (Lang.isString(val));
                }
            },
            /**
             * @description Validation during every keypress. The function that is passed will receive the keyevent, that can thus be prevented.<br>
             * Only has effect if the masterform knows how to use it through delegation: therefore it adds
             * the className 'itsa-formelement-keyvalidation'.
             * The function MUST return true or false.
             * @attribute [keyValidation]
             * @type Function
            */
            keyValidation : {
                value: null,
                validator: function(val) {
                    return (Lang.isFunction(val));
                }
            },
            /**
             * @description Validation after changing the value (onblur). The function should return true or false. In case of false,
             * the validationerror is thrown.<br>
             * Only has effect if the masterform knows how to use it through delegation:
             * therefore it adds the className 'itsa-formelement-validation'.
             * The function MUST return true or false.
             * Either use validation, or autocorrection.
             * @attribute [validation]
             * @type Function
             * @return Boolean
            */
            validation : {
                value: null,
                validator: function(val) {
                    return (Lang.isFunction(val));
                }
            },
            /**
             * @description The message that will be returned on a validationerror, this will be set within e.message.
             * @attribute [validationMessage]
             * @type String
            */
            validationMessage : {
                value: '',
                validator: function(val) {
                    return (Lang.isString(val));
                }
            },
            /**
             * @description If set, value will be replaces by the returnvalue of this function. <br>
             * Only has effect if the masterform knows how to use it through delegation: therefore
             * it adds the className 'itsa-formelement-autocorrect'.
             * The function MUST return true or false: defining whether the input is accepted.
             * Either use validation, or autocorrection.
             * @attribute [autocorrection]
             * @type Function
             * @return Boolean
            */
            autoCorrection : {
                value: null,
                validator: function(val) {
                    return (Lang.isFunction(val));
                }
            },
            /**
             * @description Additional className that is passed on the label, during rendering.<br>
             * Only applies to rendering in tableform render(true).
             * @attribute [classNameLabel]
             * @type String
            */
            classNameLabel : {
                value: '',
                validator: function(val) {
                    return (Lang.isString(val));
                }
            },
            /**
             * @description Additional className that is passed on the value, during rendering.<br>
             * Only applies to rendering in tableform render(true).
             * @attribute [classNameValue]
             * @type String
            */
            classNameValue : {
                value: '',
                validator: function(val) {
                    return (Lang.isString(val));
                }
            },
            /**
             * @description Will create extra white whitespace during rendering.<br>
             * Only applies to rendering in tableform render(true).
             * @attribute [marginTop]
             * @type Int
            */
            marginTop : {
                value: 0,
                validator: function(val) {
                    return (Lang.isNumber(val));
                }
            },
            /**
             * @description Determines whether this element should have the initial focus.<br>
             * Only has effect if the masterform knows how to use it (in fact, just the className 'itsa-formelement-firstfocus' is added).
             * @attribute [initialFocus]
             * @type Boolean
            */
            initialFocus : {
                value: false,
                validator: function(val) {
                    return (Lang.isBoolean(val));
                }
            },
            /**
             * @description Determines whether this element should completely be selected when it gets focus.<br>
             * Only has effect if the masterform knows how to use it (in fact, just the className 'itsa-formelement-selectall' is added).
             * @attribute [selectOnFocus]
             * @type Boolean
            */
            selectOnFocus : {
                value: false,
                validator: function(val) {
                    return (Lang.isBoolean(val));
                }
            },
            /**
             * @description DOM-node where the elementNode is bound to.<br>
             * Be carefull: it will only return a Node when you have manually inserted the result of this.render() into the DOM.
             * Otherwise returns null.
             * Readonly
             * @attribute [elementNode]
             * @type Y.Node
             * @readonly
            */
            elementNode : {
                value: null,
                readOnly: true,
                getter: function() {
                    return Y.one('#'+this.id);
                }
            }
        }
    }
);

}, 'gallery-2013.10.02-20-26', {
    "requires": [
        "yui-base",
        "base-build",
        "panel",
        "node-base",
        "node-event-delegate",
        "dd-plugin",
        "node-focusmanager",
        "event-valuechange",
        "event-custom-base",
        "node-core",
        "oop",
        "gallery-itsaformelement"
    ],
    "skinnable": true
});
