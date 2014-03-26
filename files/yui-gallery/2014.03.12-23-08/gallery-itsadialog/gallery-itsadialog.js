YUI.add('gallery-itsadialog', function (Y, NAME) {

'use strict';

/**
 * This module adds three dialog-promises to YUI:
 *
 * Y.alert()
 * Y.prompt()
 * Y.confirm()
 *
 *
 * @module gallery-itsadialog
 * @class Y
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://theinternetwizard.net</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

var LOADDELAY = 5000, // lazy load 'gallery-itsadialogbox' after 5 seconds
      GALLERY_ITSADIALOGBOX = 'gallery-itsadialogbox',
      ACTION_HIDE = '_actionHide',
      ABORT = 'abort',
      IGNORE = 'ignore',
      YES = 'yes',
      NO = 'no',
      CANCEL = 'cancel',
      ERROR = 'error',
      YESNO = 'yesno',
      RETRY = 'retry',
      INPUT = 'input',
      NUMBER = 'number',
      LOGIN = 'login',
      WARN = 'warn',
      OBJECT = 'object',
      CONFIRMATION_BUTTONS = {
          footer: [
              {name: NO, label: 'No', action: ACTION_HIDE, isDefault: true},
              {name: YES, label: 'Yes', action: ACTION_HIDE}
          ]
      },
      CONFIRMATION_RETRY_BUTTONS = {
          footer: [
              {name: ABORT, label:'Abort', action: ACTION_HIDE},
              {name: IGNORE, label:'Ignore', action: ACTION_HIDE},
              {name: RETRY, label:'Retry', action: ACTION_HIDE, isDefault: true}
          ]
      },
      ITSADialogInstance;

function ITSADialog() {}

if (!Y.Global.ITSADialog) {
    Y.mix(ITSADialog.prototype, {
        /**
         * Returns the proper function of ItsaDialog (gallery-itsadialogbox) to be used.
         *
         * @method _getFunction
         * @param [options] {object}
         * @param [options.type] {String}  Passed by to determine which method of ItsaDialog to be called. Default === 'showMessage'
         * @private
         * @since 0.1
        */
        _getFunction : function(options) {
            // Caution: Y.Global.ItsaDialog is NOT the same as Y.Global.ITSADialog:
            // Y.Global.ItsaDialog is the dialog-widget that comes from gallery-itsadialogbox and uses callback-funcs.
            var useFunction,
                  type = options && options.type,
                  ItsaDialog = Y.Global.ItsaDialog;

            if (type===WARN) {
                useFunction = Y.bind(ItsaDialog.showWARN, ItsaDialog);
            }
            else if (type===ERROR) {
                useFunction = Y.bind(ItsaDialog.showErrorMessage, ItsaDialog);
            }
            else if (type===YESNO) {
                useFunction = Y.bind(ItsaDialog.getConfirmation, ItsaDialog);
            }
            else if (type===RETRY) {
                useFunction = Y.bind(ItsaDialog.getRetryConfirmation, ItsaDialog);
            }
            else if (type===INPUT) {
                useFunction = Y.bind(ItsaDialog.getInput, ItsaDialog);
            }
            else if (type===NUMBER) {
                useFunction = Y.bind(ItsaDialog.getNumber, ItsaDialog);
            }
            else if (type===LOGIN) {
                useFunction = Y.bind(ItsaDialog.getLogin, ItsaDialog);
            }
            else {
                // default
                useFunction = Y.bind(ItsaDialog.showMessage, ItsaDialog);
            }
            return useFunction;
        },

        /**
         * Pops-up an alert-dialog --> dialog with no input-field and only an 'OK'-button.
         *
         * @method _alert
         * @param [title] {String} Title on the dialogbox (header).
         * @param message {String} Message to display. (may be the first argument)
         * @param [options] {object}
         * @param [options.type] {String} Determines which dialogbox to pop-up --> null|'message'|'warn'|'error' (null == 'message')
         * @private
         * @return {Y.Promise}
         * <br />resolve() --> without parameters, no reject.
         * @since 0.1
        */
        _alert : function(title, message, options) {
            var instance = this;

            // make it possible to pass 'options' as second argument:
            if (!message || (typeof message === OBJECT)) {
                options = message;
                message = title;
                title = '';
            }
            options = options || {};
            return Y.usePromise(GALLERY_ITSADIALOGBOX).then(
                function() {
                    return new Y.Promise(function (resolve) {
                        // We cannot use Y.Global.ItsaDialog here, because at render-time, it does not exist
                        // therefore we call an internal function that does exist, which can call Y.Global.ItsaDialog itself.
                        instance._getFunction(options)(
                            title,
                            message,
                            function() {
                                resolve();
                            }
                        );
                    });
                }
            );
        },

        /**
         * Pops-up an prompt-dialog --> dialog with input-fields and an 'CANCEL' + 'OK' buttons, or In case of 'login', only an 'OK'-button.
         * <br />There are three possible dialog-types:
         * <br /><b>'input'</b> --> one string-field
         * <br /><b>'number'</b> --> one integer-field
         * <br /><b>'login'</b> --> two string-fields - used for username and password (the second field is marked)
         * <br /> which dialogtype to use can be set with 'options.type'.
         *
         * @method _prompt
         * @param [title] {String} Title on the dialogbox (header).
         * @param message {String} Message to display. (may be the first argument)
         * @param [options] {object}
         * @param [options.type] {String} Determines which dialogbox to pop-up --> null|'input'|'number'|'login' (null == 'input')
         * @param [options.value] {String|number} --> only in case of options.type==='number' or 'input'
         * @param [options.min] {Number} --> only in case of options.type==='number'
         * @param [options.max] {Number} --> only in case of options.type==='number'
         * @param [options.labelUsername] {String} --> only in case of options.type==='login'
         * @param [options.labelPassword] {String} --> only in case of options.type==='login'
         * @param [options.defaultUsername] {String} --> only in case of options.type==='login'
         * @param [options.defaultPassword] {String} --> only in case of options.type==='login'
         * @private
         * @return {Y.Promise}
         * <br />resolve(response) --> response.value || response.username+response.password.
         * <br />reject(reason) --> reason which is always the button 'cancel' being pressed.
         * @since 0.1
        */
        _prompt : function(title, message, options) {
            var instance = this;

            // make it possible to pass 'options' as second argument:
            if (!message || (typeof message === OBJECT)) {
                options = message;
                message = title;
                title = '';
            }
            options = options || {};
            options.type = options.type || INPUT;
            return Y.usePromise(GALLERY_ITSADIALOGBOX).then(
                function() {
                    return new Y.Promise(function (resolve, reject) {
                        // We cannot use Y.Global.ItsaDialog here, because at render-time, it does not exist
                        // therefore we call an internal function that does exist, which can call Y.Global.ItsaDialog itself.
                        if (options.type===NUMBER) {
                            instance._getFunction(options)(
                                title,
                                message,
                                options.value || '',
                                options.min,
                                options.max,
                                function(e) {
                                    // callback function
                                    var promiseReject = (e.buttonName === CANCEL);
                                    if (promiseReject) {
                                        reject(new Error('input cancelled'));
                                    }
                                    else {
                                        resolve(e);
                                    }
                                }
                            );
                        }
                        else {
                            instance._getFunction(options)(
                                title,
                                message,
                                (options.type===INPUT) ? (options.value || '') : options,
                                function(e) {
                                    // callback function.
                                    // In case of 'input' --> only e.value is present
                                    // In case of 'login' --> e.username, e.password and e.savechecked are present
                                    var promiseReject = (e.buttonName === CANCEL);
                                    if (promiseReject) {
                                        reject(new Error('input cancelled'));
                                    }
                                    else {
                                        resolve(e);
                                    }
                                }
                            );
                        }
                    });
                }
            );
        },

        /**
         * Pops-up a confirm-dialog --> dialog with no input-field confirm-buttons.
         * <br />There are two possible dialog-types:
         * <br /><b>'yesno'</b> --> comes with yes-no buttons
         * <br /><b>'retry'</b> --> comes with abort-ignore-retry buttons
         * <br /> which dialogtype to use can be set with 'options.type'.
         *
         * @method _confirm
         * @param [title] {String} Title on the dialogbox (header).
         * @param question {String} Message to display. (may be the first argument)
         * @param [options] {object}
         * @param [options.type] {String} Determines which dialogbox to pop-up --> null|'yesno'|'retry' (null == 'yesno')
         * @param [options.defaultBtn] {String} 'yes'|'no'|'abort'|'ignore'|'retry'  (null == 'no'|'retry')
         * @private
         * @return {Y.Promise}
         * <br />resolve(button) --> button === 'buttonname'.
         * <br />reject(reason) --> which is 'not confirmed' (when 'no' pressed using yesno-buttons) OR 'aborted'  (with abort|ignore|retry-buttons).
         * @since 0.1
        */
        _confirm : function(title, question, options) {
            var instance = this,
                  buttons, rejectmessage;

            // make it possible to pass 'options' as second argument:
            if (!question || (typeof question === OBJECT)) {
                options = question;
                question = title;
                title = '';
            }
            options = options || {};
            options.type = options.type || YESNO;
            if (options.type===RETRY) {
                buttons = CONFIRMATION_RETRY_BUTTONS;
                rejectmessage = 'aborted';
                if (options.defaultBtn===ABORT) {
                    buttons.footer[0].isDefault = true;
                    buttons.footer[2].isDefault = false;
                }
                else if (options.defaultBtn==='ignore') {
                    buttons.footer[1].isDefault = true;
                    buttons.footer[2].isDefault = false;
                }
            }
            else {
                // 'yesno'
                buttons =  CONFIRMATION_BUTTONS;
                rejectmessage = 'not confirmed';
                if (options.defaultBtn===YES) {
                    buttons.footer[0].isDefault = false;
                    buttons.footer[1].isDefault = true;
                }
            }
            return Y.usePromise(GALLERY_ITSADIALOGBOX).then(
                function() {
                    return new Y.Promise(function (resolve, reject) {
                        // We cannot use Y.Global.ItsaDialog here, because at render-time, it does not exist
                        // therefore we call an internal function that does exist, which can call Y.Global.ItsaDialog itself.
                        instance._getFunction(options)(
                            title,
                            question,
                            function(e) {
                                // callback function
                                var button = e.buttonName,
                                      promiseReject = ((button === NO) || (button === ABORT));
                                if (promiseReject) {
                                    reject(new Error(rejectmessage));
                                }
                                else {
                                    resolve(button);
                                }
                            },
                            null,
                            null,
                            buttons
                        );
                    });
                }
            );
        }
    });

    Y.Global.ITSADialog = new ITSADialog();
    // now lazyload 'gallery-itsadialogbox'
    Y.later(
        LOADDELAY,
        Y,
        Y.use,
        GALLERY_ITSADIALOGBOX
    );
}

ITSADialogInstance = Y.Global.ITSADialog;

/**
 * Pops-up an alert-dialog --> dialog with no input-field and only an 'OK'-button.
 *
 * @method Y.alert
 * @param [title] {String} Title on the dialogbox (header).
 * @param message {String} Message to display. (may be the first argument)
 * @param [options] {object}
 * @param [options.type] {String} Determines which dialogbox to pop-up --> null|'message'|'warn'|'error' (null == 'message')
 * @return {Y.Promise}
 * <br />resolve() --> without parameters, no reject.
 * @since 0.1
*/
Y.alert = Y.rbind(ITSADialogInstance._alert, ITSADialogInstance);

/**
 * Pops-up an prompt-dialog --> dialog with input-fields and an 'CANCEL' + 'OK' buttons, or In case of 'login', only an 'OK'-button.
 * <br />There are three possible dialog-types:
 * <br /><b>'input'</b> --> one string-field
 * <br /><b>'number'</b> --> one integer-field
 * <br /><b>'login'</b> --> two string-fields - used for username and password (the second field is marked)
 * <br /> which dialogtype to use can be set with 'options.type'.
 *
 * @method Y.prompt
 * @param [title] {String} Title on the dialogbox (header).
 * @param message {String} Message to display. (may be the first argument)
 * @param [options] {object}
 * @param [options.type] {String} Determines which dialogbox to pop-up --> null|'input'|'number'|'login' (null == 'input')
 * @param [options.value] {String|number} --> only in case of options.type==='number' or 'input'
 * @param [options.min] {Number} --> only in case of options.type==='number'
 * @param [options.max] {Number} --> only in case of options.type==='number'
 * @param [options.labelUsername] {String} --> only in case of options.type==='login'
 * @param [options.labelPassword] {String} --> only in case of options.type==='login'
 * @param [options.defaultUsername] {String} --> only in case of options.type==='login'
 * @param [options.defaultPassword] {String} --> only in case of options.type==='login'
 * @return {Y.Promise}
 * <br />resolve(response) --> response.value || response.username+response.password.
 * <br />reject(reason) --> reason which is always the button 'cancel' being pressed.
 * @since 0.1
*/
Y.prompt = Y.rbind(ITSADialogInstance._prompt, ITSADialogInstance);

/**
 * Pops-up a confirm-dialog --> dialog with no input-field confirm-buttons.
 * <br />There are two possible dialog-types:
 * <br /><b>'yesno'</b> --> comes with yes-no buttons
 * <br /><b>'retry'</b> --> comes with abort-ignore-retry buttons
 * <br /> which dialogtype to use can be set with 'options.type'.
 *
 * @method Y.confirm
 * @param [title] {String} Title on the dialogbox (header).
 * @param message {String} Message to display. (may be the first argument)
 * @param [options] {object}
 * @param [options.type] {String} Determines which dialogbox to pop-up --> null|'yesno'|'retry' (null == 'yesno')
 * @param [options.defaultBtn] {String} 'yes'|'no'|'abort'|'ignore'|'retry'  (null == 'no'|'retry')
 * @return {Y.Promise}
 * <br />resolve(button) --> button === 'buttonname'.
 * <br />reject(reason) --> which is 'not confirmed' (when 'no' pressed using yesno-buttons) OR 'aborted'  (with abort|ignore|retry-buttons).
 * @since 0.1
*/
Y.confirm = Y.rbind(ITSADialogInstance._confirm, ITSADialogInstance);

}, 'gallery-2013.08.22-21-03', {
    "requires": [
        "yui-base",
        "promise",
        "event-custom-base",
        "yui-later",
        "oop",
        "gallery-itsamodulesloadedpromise"
    ]
});
