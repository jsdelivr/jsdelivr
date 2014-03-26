YUI.add('gallery-itsalogin', function (Y, NAME) {

'use strict';

/*jshint maxlen:200 */


var ITSAMessageControllerClass = Y.ITSAMessageControllerClass,
    ITSAMessageControllerInstance = Y.ITSAMessageController,
    ITSADialogClass = Y.ITSADialogClass,
    ITSADialogInstance = Y.ITSADialog,
    YArray = Y.Array,
    YIntl = Y.Intl,
    BOOLEAN = 'boolean',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    UNDERSCORE = '_',
    OGIN = 'ogin',
    LOGIN = 'l'+OGIN,
    TEXT = 'text',
    GET = 'get',
    GET_LOGIN = GET+'L'+OGIN,
    APP = 'application',
    TYPE = 'type',
    ICONDIALOG = 'itsaicon-dialog-',
    ICON_INFO = ICONDIALOG+INFO,
    ICON_QUESTION = ICONDIALOG+'question',
    USERNAME = 'username',
    PASSWORD = 'password',
    FORGOT = 'forgot',
    MAIL = 'mail',
    EMAIL = 'e'+MAIL,
    ADDRESS = 'address',
    FUNCTION = 'function',
    EMAILADDRESS = EMAIL+ADDRESS,
    USERNAME_OR_PASSWORD = USERNAME+'or'+PASSWORD,
    FORGOT_USERNAME = FORGOT+USERNAME,
    FORGOT_PASSWORD = FORGOT+PASSWORD,
    FORGOT_PASSWORD_EMAIL = FORGOT_PASSWORD+EMAIL,
    FORGOT_USERNAME_OR_PASSWORD = FORGOT+USERNAME_OR_PASSWORD,
    CREATE_ACCOUNT = 'createaccount',
    SEND = 'send',
    RESET = 'reset',
    SEND_USERNAME = SEND+USERNAME,
    CHANGE = 'change',
    RESET_PASSWORD = RESET+PASSWORD,
    CHANGE_PASSWORD = CHANGE+PASSWORD,
    SHOW_PASSWORD = 'show'+PASSWORD,
    PASSWORD_CHANGE = PASSWORD+CHANGE,
    PASSWORD_CHANGED = PASSWORD_CHANGE+'d',
    VERIFY = 'verify',
    VERIFY_PASSWORD = VERIFY+PASSWORD,
    VERIFICATIONERROR = 'verification'+ERROR,
    CHANGE_YOUR_PASSWORD = CHANGE+'your'+PASSWORD,
    NEWPASSWORD = 'NewPassword',
    VERIFYNEWPASSWORD = 'verify'+NEWPASSWORD,
    SHOWNEWPASSWORD = 'show'+NEWPASSWORD,
    MESSAGE = 'message',
    MESSAGERESOLVE = MESSAGE+'resolve',
    LOGGEDIN = 'loggedin',
    STAYLOGGEDIN = 'stay'+LOGGEDIN,
    GALLERYITSAI18NLOGIN = 'gallery-itsa-i18n-login',
    CHECK = 'check',
    RECIEVEDMAILWITHINSTRUCTIONS = 'receivedmailwithinstructions',
    CHECKSPAMBOX = CHECK+'spambox',
    CHECKMAIL = CHECK+'mail',
    CLASSNAME = 'classname',
    PRIMARYBTNONENTER = 'primarybtnonenter',
    FULLSELECT = 'fullselect',
    LABEL = 'label',
    PLACEHOLDER = 'placeholder',
    REQUIRED = 'required',
    ITSA = 'itsa',
    ITSA_LOGIN = ITSA+'-'+LOGIN,
    DIALOG = 'dialog',
    ITSADIALOG = ITSA+DIALOG,
    SPANWRAPPER = '<span class="itsa-messagewrapper">',
    FIELDSET_START = '<fieldset class="'+ITSA_LOGIN+'">',
    ENDSPAN = '</span>',
    DIVCLASS_PURECONTROLGROUP = '<div class="pure-control-group">',
    ENDDIV = '</div>',
    DIVCLASS_ITSA = '<div class="itsa-',
    ENDFIELDSET = '</fieldset>',
    IMG = 'img',
    SUBMIT = 'submit',
    BTN_ = 'btn_',
    BTNSUBMIT = BTN_+SUBMIT,
    CONTENTBOX = 'contentBox',
    IMGBTN_ = IMG+BTN_,
    BUTTON = 'button',
    DIALOG_FORGOTBUTTON = DIALOG+'-'+FORGOT+BUTTON,
    INPUTNAMEIS = 'input[name="',
    ITSABUTTON_ICONLEFT = 'itsabutton-iconleft',
    I_CLASS_ITSADIALOG = '<i class="itsaicon-dialog',
    STRING = 'string',

    PARSED = function (response) {
        if (typeof response === 'string') {
            try {
                return Y.JSON.parse(response);
            } catch (ex) {
                this.fire(ERROR, {
                    error   : ex,
                    response: response,
                    src     : 'parse'
                });
                return {};
            }
        }
        return response || {};
    };

//===========================================================================================================
//===========================================================================================================
//===========================================================================================================

/**
 * Provides extra Y.getLogin() to Y.ITSADialog. See ITSADialog.
 *
 * @module gallery-itsalogin
 * @for ITSAMessageController
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://theinternetwizard.net</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

/**
 *
 * Renderes a login-panel where the user can fill in a username and password. Using config, the behaviour of the panel can be extended
 * by introducing several sub-panels:<br>
 *
 *      <ul>
 *          <li><code>changepassword-panel</code> will show up when the server responses to button==='getlogin' with {status: 'CHANGEPASSWORD'}</li>
 *          <li><code>forgot-username-or-password-panel</code> is available when config.regain==='usernameorpassword'</li>
 *          <li><code>forgotusername-panel</code> is available when config.regain==='usernameorpassword' || 'username'</li>
 *          <li><code>forgotpassword-panel</code> is available when config.regain==='usernameorpassword' || 'password'</li>
 *          <li><code>createaccount-panel</code> needs to be set-up by the developer, using config.createAccount: createAccountPromise --> see examples</li>
 *      </ul>
 *
 * @method _getLogin
 * @param [title] {String} title of the login-panel.
 * @param [message] {String} message inside the login-panel.
 * @param [config] {Object} config (which that is also bound to Y.ITSAMessage._config which passes through to Y.ITSAMessageController).
 * @param [config.createAccount] {function} should internally generate a Y.ITSAMessageController.queueMessage with level==='warn'.
 * @param [config.icon] {String} icon-classname of the login-dialog (see gallerycss-itsa-dialog for icon classnames)
 * @param [config.iconQuestion] {String} icon-classname of the retrieve username/password-dialogs (see gallerycss-itsa-dialog for icon classnames)
 * @param [config.imageButtons] {Boolean} creates panel-buttons with image-icons.
 * @param [config.formconfigPassword] {Object} formconfig that passes through to the password-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.formconfigRemember] {Object} formconfig that passes through to the remember-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.formconfigShowPassword] {Object} formconfig that passes through to the ''show password'-ITSACheckbox when users retrieve their password.
 * @param [config.formconfigUsername] {Object} formconfig that passes through to the username-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.messageChangePassword] {String} Message that appears on the 'change-password'-form (overrules the default)
 * @param [config.messageForgotPassword] {String} Message that appears on the 'forgot-password'-form (overrules the default)
 * @param [config.messageForgotUsername] {String} Message that appears on the 'forgot-username'-form (overrules the default)
 * @param [config.messageForgotUsernameOrPassword] {String} Message that appears on the 'forgot-username-or-password'-form (overrules the default)
 * @param [config.regain] {String} to be used to regain username or password. Should be either 'usernameorpassword' || 'username' || 'password'.
 * @param [config.required] {Boolean} removes the closebutton.
 * @param [config.showStayLoggedin] {Boolean} shows an iOS-stylisch checkbox that is bound to the result.remember-property of the resolve-callback.
 * @param [config.showNewPassword] {Boolean} When password-change: input can be made visible by an Y.ITSACheckbox.
 * @param [config.titleChangePassword] {String} Title that appears on the 'change-password'-form (overrules the default)
 * @param [config.titleForgotPassword] {String} Title that appears on the 'forgot-password'-form (overrules the default)
 * @param [config.titleForgotUsername] {String} Title that appears on the 'forgot-username'-form (overrules the default)
 * @param [config.titleForgotUsernameOrPassword] {String} Title that appears on the 'orgot-username-or-password'-form (overrules the default)
 * @param [config.usernameIsEmail] {Boolean} when set, the email-pattern will be active
 * @param [config.validatorPassword] {Function} validator that passes through to the password-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.validatorUsername] {Function} validator that passes through to the username/email-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.valuePassword] {String} the default value for 'password' that passes through to the password-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.valueRemember] {String} the default value for 'remember' that passes through to the remember-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.valueUsername] {String} the default value for 'username' that passes through to the username-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.validationerrorPassword] {String} validationerror that passes through to the password-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.validationerrorUsername] {String} validationerror that passes through to the username-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.verifyNewPassword] {Boolean} When password-change: need to verify new password.
 * @param sync {Y.Promise} sync-layer that communicates with the server
 * @return {Y.Promise} Promise that holds valid logindata (if resolved) --> resolve(result) result={username, password, remember} OR reject(reason)
 * @private
 * @since 0.1
 */

ITSAMessageControllerClass.prototype[UNDERSCORE+GET_LOGIN] = function(title, message, config, sync) {
    var instance = this,
        intl = ITSADialogInstance._intl,
        params = instance._retrieveLoginParams(title, message, config, sync),
        MyITSAMessage, formconfigUsername, formconfigPassword, formconfigRemember, syncPromise, regain, rememberValue, newmessage, createAccountPromiseLoop,
        imageButtons, footer, primaryButton, forgotButton, createAccountPromise, required, showStayLoggedin, usernameIsEmail;
    title = params.title;
    newmessage = params.message;
    config = params.config;
    syncPromise = params.syncPromise;

    createAccountPromise = (typeof config.createAccount === FUNCTION) && config.createAccount;
    primaryButton = BTNSUBMIT;
    required = ((typeof config.required === BOOLEAN) && config.required) || false;
    usernameIsEmail = ((typeof config.usernameIsEmail === BOOLEAN) && config.usernameIsEmail) || false;
    showStayLoggedin = ((typeof config.showStayLoggedin === BOOLEAN) && config.showStayLoggedin) || false;
    imageButtons = (typeof config.imageButtons === BOOLEAN) && config.imageButtons;
    regain = config.regain;
/*jshint expr:true */
    regain && usernameIsEmail && (regain=PASSWORD);
/*jshint expr:false */
    forgotButton = (regain===USERNAME_OR_PASSWORD) || (regain===USERNAME) || (regain===PASSWORD);
    footer = (forgotButton ? '{'+BTN_+FORGOT+'}' : '');
/*jshint expr:true */
    createAccountPromise && (footer += '{'+BTN_+CREATE_ACCOUNT+'}');
/*jshint expr:false */
    footer += '{'+BTNSUBMIT+'}';

    if (imageButtons) {
        footer = footer.replace(/\{btn_/g, '{'+IMGBTN_);
        primaryButton = primaryButton.replace(/btn_/g, IMGBTN_);
    }

    // setting config for username:
    formconfigUsername = config.formconfigUsername || {};
/*jshint expr:true */
    formconfigUsername[LABEL] || formconfigUsername[PLACEHOLDER] || (formconfigUsername[LABEL]=intl[usernameIsEmail ? EMAILADDRESS : USERNAME]);
/*jshint expr:false */
    formconfigUsername[FULLSELECT] = true;
    formconfigUsername[PRIMARYBTNONENTER] = false;
    formconfigUsername[CLASSNAME] = ITSA_LOGIN + (formconfigUsername[CLASSNAME] ? ' '+formconfigUsername[CLASSNAME] : '');
    formconfigUsername[REQUIRED] = true;

    // setting config for password:
    formconfigPassword = config.formconfigPassword || {};
/*jshint expr:true */
    formconfigPassword[LABEL] || formconfigPassword[PLACEHOLDER] || (formconfigPassword[LABEL]=intl[PASSWORD]);
/*jshint expr:false */
    formconfigPassword[FULLSELECT] = true;
    formconfigPassword[PRIMARYBTNONENTER] = true;
    formconfigPassword[CLASSNAME] = ITSA_LOGIN + (formconfigPassword[CLASSNAME] ? ' '+formconfigPassword[CLASSNAME] : '');
    formconfigPassword[REQUIRED] = true;

    // setting config for remember:
    formconfigRemember = config.formconfigRemember || {};
    formconfigRemember.widgetconfig = {
        primarybtnonenter: true
    };
/*jshint expr:true */
    formconfigUsername[LABEL] && !formconfigPassword[LABEL] && (formconfigPassword[LABEL] = ' ');
    formconfigPassword[LABEL] && !formconfigUsername[LABEL] && (formconfigUsername[LABEL] = ' ');
    formconfigRemember[LABEL] || (formconfigRemember[LABEL]=intl[STAYLOGGEDIN]);
/*jshint expr:false */
    formconfigRemember.switchlabel = true;
    rememberValue = ((typeof config.valueRemember === BOOLEAN) && config.valueRemember) || false;

    return instance.isReady().then(
        function() {
            var itsamessage;
            MyITSAMessage = Y.Base.create('itsamessageinput', Y.ITSAMessage, [], null, {
                                  ATTRS: {
                                      username: {
                                          value: config.valueUsername || '',
                                          formtype: usernameIsEmail? 'email' : 'text',
                                          formconfig: formconfigUsername,
                                          validator: config.validatorUsername,
                                          validationerror: config.validationerrorUsername
                                      },
                                      password: {
                                          value: config.valuePassword || '',
                                          formtype: PASSWORD,
                                          formconfig: formconfigPassword,
                                          validator: config.validatorPassword,
                                          validationerror: config.validationerrorPassword
                                      },
                                      remember: {
                                          value: (showStayLoggedin && rememberValue) || false,
                                          formtype: Y.ITSACheckbox,
                                          formconfig: formconfigRemember
                                      }
                                  }
                              });
            newmessage = SPANWRAPPER + newmessage + ENDSPAN+
                      FIELDSET_START+
                           DIVCLASS_PURECONTROLGROUP+'{'+USERNAME+'}'+ENDDIV+
                           DIVCLASS_PURECONTROLGROUP+'{'+PASSWORD+'}'+ENDDIV+
                           (showStayLoggedin ? DIVCLASS_ITSA+'login-checkbox">'+'{remember}'+ENDDIV : '')+
                      ENDFIELDSET;
            itsamessage = new MyITSAMessage();
            itsamessage.syncPromise = syncPromise;
            itsamessage._config = config;
            itsamessage.icon = config.icon || ICON_INFO;
            itsamessage.target = ITSADIALOG; // widgetname that should handle this newmessage
            itsamessage.title = title;
            itsamessage.message = newmessage;
            itsamessage.footer = footer;
            itsamessage.setSyncMessage(SUBMIT, intl.attemptlogin);
            itsamessage.imageButtons = imageButtons;
            itsamessage.closeButton = !required;
            itsamessage.priority = config.priority;
            itsamessage.primaryButton = config.primaryButton || primaryButton; // config.primaryButton should overrule primaryButton
            itsamessage.timeoutReject = config.timeoutReject;
            itsamessage.level = INFO; // always needs no be at infolevel, because forgot-username/password will show at warn-level
            itsamessage.source = config.source || APP;
            itsamessage.messageType = GET_LOGIN;
            itsamessage._submitBtn = GET+LOGIN; // NOT GET_LOGIN --> that would be 'getLogin', while GET+LOGIN === 'getlogin'
            itsamessage.buttonLabels = [
                {buttonType: BTNSUBMIT, labelHTML: intl[LOGIN]},
                {buttonType: IMG+BTNSUBMIT, labelHTML: I_CLASS_ITSADIALOG+'-login"></i>'+intl[LOGIN]}
            ];
            itsamessage.customBtns = [];
/*jshint expr:true */
            createAccountPromise && itsamessage.customBtns.push(
                imageButtons ?
                {
                    buttonId: IMGBTN_+CREATE_ACCOUNT,
                    labelHTML: I_CLASS_ITSADIALOG+'-user"></i>'+intl[CREATE_ACCOUNT],
                    config: {
                        value: CREATE_ACCOUNT,
                        classname: ITSABUTTON_ICONLEFT
                    }
                } :
                {
                    buttonId: BTN_+CREATE_ACCOUNT,
                    labelHTML: intl[CREATE_ACCOUNT],
                    config: {
                        value: CREATE_ACCOUNT
                    }
                }
            );
/*jshint expr:false */
            // Next: if the user want a 'forgot-button' then set it up
            if (forgotButton) {
                // first an extra button for itsamessage on the first dialog:
                itsamessage.customBtns.push(
                    imageButtons ?
                    {
                        buttonId: IMGBTN_+FORGOT,
                        labelHTML: I_CLASS_ITSADIALOG+'-question"></i>'+intl[FORGOT],
                        config: {
                            value: FORGOT,
                            classname: ITSABUTTON_ICONLEFT
                        }
                    } :
                    {
                        buttonId: BTN_+FORGOT,
                        labelHTML: intl[FORGOT],
                        config: {
                            value: FORGOT
                        }
                    }
                );
                itsamessage.on(MESSAGERESOLVE, function(e) {
                    if (e.attrs && (e.attrs.button===FORGOT)) {
                        e.preventDefault(); // prevents the panel from resolving
                        ITSADialogInstance._panels[INFO].focusInitialItem()
                        .then(
                            null,
                            function() {
                                return true; // fulfill the chain
                            }
                        )
                        .then(
                            function() {
                                return (regain===USERNAME_OR_PASSWORD) ? ITSADialogInstance._regainFn_UnPw(config) : true;
                            }
                        )
                        .then(
                            function(result) {
                                if ((result.button===FORGOT_USERNAME) || (regain===USERNAME)) {
                                    return ITSADialogInstance._regainFn_Un(config, syncPromise);
                                }
                                else if ((result.button===FORGOT_PASSWORD) || (regain===PASSWORD)) {
                                    return ITSADialogInstance._regainFn_Pw(config, syncPromise);
                                }
                            },
                            function(reason) {
/*jshint expr:true */
                                (reason instanceof Error) && Y.showError(reason.message);
/*jshint expr:false */
                            }
                        );
                    }
                });
            }

/*jshint expr:true */
            createAccountPromise && (createAccountPromiseLoop=function(syncFn) {
                return createAccountPromise(syncFn)
                .then(
                    function(response) {
                        var responseObj = PARSED(response),
                            returnValue;
                        (newmessage=responseObj.message) && Y.showMessage(responseObj.title, newmessage, {priority: true});
                        (response.status==='RETRY') && (returnValue=createAccountPromiseLoop(syncFn));
                        (response.status==='LOGIN') && (returnValue=response);
                        return returnValue || instance[UNDERSCORE+GET_LOGIN](title, message, (config.priority=true) && config, sync);
                    },
                    function() {
                        return instance[UNDERSCORE+GET_LOGIN](title, message, (config.priority=true) && config, sync);
                    }
                );
            });
/*jshint expr:false */
            return createAccountPromise ?
                instance.queueMessage(itsamessage).then(
                    function(response) {
                        return (response.button===CREATE_ACCOUNT) ? createAccountPromiseLoop(syncPromise) : response;
                    }
                ) :
                instance.queueMessage(itsamessage);
        }
    );
};

/**
  * Rearanges the 4 parameters that are passed through to login(). Because some of the are optional.<br>
  * Returns an object where you are sure that all properties are indeed those that the developer send through.
  *
  * @method _retrieveLoginParams
  * @param title {String} 1st parameter of login()
  * @param message {String} 2nd parameter of login()
  * @param config {Object} 3th parameter of login()
  * @param syncPromise {Y.Promise} 4th parameter of login()
  * @private
  * @return {Object} with properties: title, message, config and syncPromise
  * @since 0.1
**/
ITSAMessageControllerClass.prototype._retrieveLoginParams = function(title, message, config, syncPromise) {
    var withTitle = (typeof message === STRING),
        withMessage, withConfig;
    if (!withTitle) {
        syncPromise = config;
        config = message;
        message = title;
        title = null;
    }
    withMessage = (typeof message === STRING);
    if (!withMessage) {
        //  oops, just passed an object --> perhaps it is an error-object?
        syncPromise = config;
        config = {};
        message = (message && (message.message || ''));
        title = null;
    }
    withConfig = (typeof config === 'object');
    if (!withConfig) {
        syncPromise = config;
        config = {};
    }
    // when no syncPromise is defined, we need to reject the syncpromise.
/*jshint expr:true */
    (typeof syncPromise === FUNCTION) || (syncPromise=function() {
        var msg = 'no syncPromise defined';
        return new Y.Promise(function (resolve, reject) {
            reject(new Error(msg));
        });
    });
/*jshint expr:false */
    return {
        title: title,
        message: message,
        config: config,
        syncPromise: syncPromise
    };
};

//===========================================================================================================
//===========================================================================================================
//===========================================================================================================

/**
 *
 * @module gallery-itsalogin
 * @for ITSADialog
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://theinternetwizard.net</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

/**
 * Internal objects with internationalized login-messages
 *
 * @property _intl
 * @private
 * @type Object
*/
ITSADialogClass.prototype._intl = YIntl.get(GALLERYITSAI18NLOGIN);

/**
  * Translates the given 'text; through Y.Int of this module. Possible text's that can be translated are:
  * <ul>
  *     <li>attemplogin</li>
  *     <li>changepassword</li>
  *     <li>changeyourpassword</li>
  *     <li>checkmail</li>
  *     <li>checkspambox</li>
  *     <li>confirmpassword</li>
  *     <li>createaccount</li>
  *     <li>createnewaccount</li>
  *     <li>email</li>
  *     <li>emailaddress</li>
  *     <li>emailalreadytaken</li>
  *     <li>enterlogin</li>
  *     <li>entersignupaddress</li>
  *     <li>error</li>
  *     <li>failed</li>
  *     <li>failedcreateaccount</li>
  *     <li>forgot</li>
  *     <li>forgotlogin</li>
  *     <li>forgotpassword</li>
  *     <li>forgotusername</li>
  *     <li>forgotusernameorpassword</li>
  *     <li>forgotwhat</li>
  *     <li>iforgotpassword</li>
  *     <li>iforgotusername</li>
  *     <li>loggedin</li>
  *     <li>loggedinas</li>
  *     <li>loggedout</li>
  *     <li>loggingout</li>
  *     <li>login</li>
  *     <li>loginblocked</li>
  *     <li>loginrightlevel</li>
  *     <li>logout</li>
  *     <li>needchangepassword</li>
  *     <li>noaccess</li>
  *     <li>password</li>
  *     <li>passwordchange</li>
  *     <li>passwordchanged</li>
  *     <li>passwordnotaccepted</li>
  *     <li>passwordnotchanged</li>
  *     <li>passwordwassend</li>
  *     <li>pleaseenterlogin</li>
  *     <li>remember</li>
  *     <li>rememberme</li>
  *     <li>resetpassword</li>
  *     <li>receivedmail</li>
  *     <li>receivedmailwithinstructions</li>
  *     <li>retrievedirectpasswordinstructions</li>
  *     <li>retrievepasswordinstructions</li>
  *     <li>retrievedirectpasswordinstructionsmaillogin</li>
  *     <li>retrievepasswordinstructionsmaillogin</li>
  *     <li>sendusername</li>
  *     <li>show</li>
  *     <li>showinput</li>
  *     <li>showpassword</li>
  *     <li>signup</li>
  *     <li>stayloggedin</li>
  *     <li>successfully</li>
  *     <li>successlogin</li>
  *     <li>toomanyattempts</li>
  *     <li>unknownemail</li>
  *     <li>unknownlogin</li>
  *     <li>unknownusername</li>
  *     <li>unspecifiederror</li>
  *     <li>username</li>
  *     <li>usernamealreadytaken</li>
  *     <li>usernamewassend</li>
  *     <li>verificationerror</li>
  *     <li>verify</li>
  *     <li>verifypassword</li>
  *     <li>wrongemailorpassword</li>
  *     <li>wrongpassword</li>
  *     <li>wrongusernameorpassword</li>
  *     <li>youareloggedin</li>
  *     <li>youareloggedinas</li>
  * </ul>
  *
  * @method translate
  * @param text {String} the text to be translated
  * @return {String} --> Translated text or the original text (if no translattion was possible)
  * @since 0.1
**/
ITSADialogClass.prototype.translate = function(text) {
    return this._intl[text] || text;
};

//*********************************************************************************************

/*
 * Creates a changepassword-panel with the UI-fields: password, verifypassword and showpassword
 *
 * @method _changePwFn
 * @private
 * @param username {String} current valid username/emailaddress
 * @param password {String} current valid password
 * @param [config] {Object}
 * @param [config.formconfigPassword] {Object} formconfig that passes through to the password-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.formconfigVerifyPassword] {Object} formconfig that passes through to the verify-assword-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.formconfigShowPassword] {Object} formconfig that passes through to the ''show password'-ITSACheckbox when users retrieve their password.
 * @param [config.iconQuestion] {String} icon-classname of the retrieve username/password-dialogs (see gallerycss-itsa-dialog for icon classnames)
 * @param [config.imageButtons] {Boolean} creates panel-buttons with image-icons.
 * @param [config.messageChangePassword] {String} Message that appears on the 'change-password'-form (overrules the default)
 * @param [config.showNewPassword] {Boolean} When password-change: input can be made visible by an Y.ITSACheckbox.
 * @param [config.titleChangePassword] {String} Title that appears on the 'change-password'-form (overrules the default)
 * @param [config.validationerrorPassword] {String} validationerror that passes through to the password-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.validatorPassword] {Function} validator that passes through to the password-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.verifyNewPassword] {Boolean} When password-change: need to verify new password.
 * @param syncPromise {Y.Promise} the same sync-Promise that was passed through when calling login()
 * @return {Y.Promise} going through Y.ITSAMessageController
 * @since 0.1
 *
*/
ITSADialogClass.prototype._changePwFn = function(username, password, config, syncPromise) {
    var verifyNewPassword = ((typeof config[VERIFYNEWPASSWORD] === BOOLEAN) && config[VERIFYNEWPASSWORD]) || true,
        showNewPassword = ((typeof config[SHOWNEWPASSWORD] === BOOLEAN) && config[SHOWNEWPASSWORD]) || true,
        intl = ITSADialogInstance._intl,
        changePassword, formconfigPassword, formconfigVerifyPassword, formconfigShowPassword, MyChangePassword, message, imageButtons;
    // setting config for username:
    formconfigPassword = config.formconfigPassword || {};
/*jshint expr:true */
    formconfigPassword[LABEL] || formconfigPassword[PLACEHOLDER] || (formconfigPassword[LABEL]=intl[PASSWORD]);
/*jshint expr:false */
    formconfigPassword[FULLSELECT] = true;
    formconfigPassword[PRIMARYBTNONENTER] = !verifyNewPassword;
    formconfigPassword[CLASSNAME] = ITSA_LOGIN + (formconfigPassword[CLASSNAME] ? ' '+formconfigPassword[CLASSNAME] : '');
    formconfigPassword[REQUIRED] = true;

    // setting config for username:
    formconfigVerifyPassword = config.formconfigVerifyPassword || {};
/*jshint expr:true */
    formconfigVerifyPassword[LABEL] || formconfigVerifyPassword[PLACEHOLDER] || (formconfigVerifyPassword[LABEL]=intl['verify'+PASSWORD]);
/*jshint expr:false */
    formconfigVerifyPassword[FULLSELECT] = true;
    formconfigVerifyPassword[PRIMARYBTNONENTER] = true;
    formconfigVerifyPassword[CLASSNAME] = ITSA_LOGIN + (formconfigVerifyPassword[CLASSNAME] ? ' '+formconfigVerifyPassword[CLASSNAME] : '');
    formconfigVerifyPassword[REQUIRED] = true;

    formconfigShowPassword = config.formconfigShowPassword || {};
    formconfigShowPassword.widgetconfig = {
        primarybtnonenter: true
    };
/*jshint expr:true */
    formconfigShowPassword[LABEL] || formconfigShowPassword[PLACEHOLDER] || (formconfigShowPassword[LABEL]=intl[SHOW_PASSWORD]);
/*jshint expr:false */
    formconfigShowPassword.switchlabel = true;
    MyChangePassword = Y.Base.create('itsamessagechangepw', Y.ITSAMessage, [], {
                          crossValidation: function() {
                              var instance = this,
                                  errorattrs = [];
                              if (verifyNewPassword && (instance.get(PASSWORD) !== instance.get(VERIFY_PASSWORD))) {
                                  errorattrs.push({
                                      attribute: PASSWORD,
                                      validationerror: intl[VERIFICATIONERROR]
                                  });
                                  errorattrs.push({
                                      attribute: VERIFY_PASSWORD,
                                      validationerror: intl[VERIFICATIONERROR]
                                  });
                              }
                              return errorattrs;
                          }
                       }, {
                           ATTRS: {
                                username: {
                                    value: username
                                },
                                oldpassword: {
                                    value: password
                                },
                                password: {
                                    formtype: PASSWORD,
                                    formconfig: formconfigPassword,
                                    validator: config.validatorPassword,
                                    validationerror: config.validationerrorPassword
                                },
                                verifypassword: {
                                    formtype: PASSWORD,
                                    formconfig: formconfigVerifyPassword,
                                    validator: config.validatorPassword,
                                    validationerror: config.validationerrorPassword
                                },
                                showpassword: {
                                    value: false,
                                    formtype: Y.ITSACheckbox,
                                    formconfig: formconfigShowPassword
                                }
                           }
                       });
    message = SPANWRAPPER + (config.messageChangePassword || intl.needchangepassword) + ENDSPAN+
              FIELDSET_START+
                   DIVCLASS_PURECONTROLGROUP+'{'+PASSWORD+'}'+ENDDIV+
                   (verifyNewPassword ? DIVCLASS_PURECONTROLGROUP+'{'+VERIFY_PASSWORD+'}'+ENDDIV : '')+
                   (showNewPassword ? DIVCLASS_ITSA+'login-checkbox">{'+SHOW_PASSWORD+'}'+ENDDIV : '')+
              ENDFIELDSET;
    changePassword = new MyChangePassword();
    changePassword.syncPromise = syncPromise;
    imageButtons = (typeof config.imageButtons === BOOLEAN) && config.imageButtons;
    changePassword.icon = config.iconQuestion || ICON_INFO;
    changePassword.title = config.titleChangePassword || intl[CHANGE_YOUR_PASSWORD];
    changePassword.message = message;
    changePassword.level = WARN;
    changePassword.noAudio = true;
    changePassword.config = config;
    changePassword.target = ITSADIALOG; // widgetname that should handle this message
    changePassword.source = config.source || APP;
    changePassword.messageType = CHANGE_PASSWORD;
    changePassword.closeButton = true;
    changePassword.footer = '{'+(imageButtons ? IMG : '')+BTNSUBMIT+'}';
    changePassword.primaryButton = (imageButtons ? IMG : '')+BTNSUBMIT;
    changePassword._submitBtn = CHANGE_PASSWORD;
    changePassword.buttonLabels = [
        {buttonType: (imageButtons ? IMG : '')+BTNSUBMIT, labelHTML: (imageButtons ? I_CLASS_ITSADIALOG+'-switch"></i>' : '')+intl[CHANGE_PASSWORD]}
    ];
    if (showNewPassword) {
        changePassword.setLifeUpdate(true);
        changePassword.after('showpasswordChange', function(e) {
            var panelwarn = ITSADialogInstance._panels[WARN],
                inputpassword = panelwarn.get(CONTENTBOX).one(INPUTNAMEIS+PASSWORD+'"]'),
                inputverifypassword = panelwarn.get(CONTENTBOX).one(INPUTNAMEIS+VERIFY_PASSWORD+'"]'),
                checked = e.newVal;
            inputpassword.setAttribute(TYPE, (checked ? TEXT : PASSWORD));
            inputverifypassword.setAttribute(TYPE, (checked ? TEXT : PASSWORD));
        });
    }
    return ITSAMessageControllerInstance.queueMessage(changePassword);
};

/*
 * Creates a forgotusernameorpassword-panel with 2 buttons: 'forgotusername' and 'forgotpassword'
 *
 * @method _regainFn_UnPw
 * @private
 * @param config {object} config of the original Y.ITSAMessage-instance that was generated by the login-panel
 * @param [config.iconQuestion] {String} icon-classname of the retrieve username/password-dialogs (see gallerycss-itsa-dialog for icon classnames)
 * @param [config.imageButtons] {Boolean} creates panel-buttons with image-icons.
 * @param [config.messageForgotUsernameOrPassword] {String} Message that appears on the 'forgot-username-or-password'-form (overrules the default)
 * @param [config.titleForgotUsernameOrPassword] {String} Title that appears on the 'orgot-username-or-password'-form (overrules the default)
 * @return {Y.Promise} going through Y.ITSAMessageController
 * @since 0.1
 *
*/
ITSADialogClass.prototype._regainFn_UnPw = function(config) {
    var intl = ITSADialogInstance._intl,
        imageButtons = (typeof config.imageButtons === BOOLEAN) && config.imageButtons,
        message = '<form>'+
                  (config.messageForgotUsernameOrPassword || intl[FORGOT+'what']) +
                  DIVCLASS_ITSA+DIALOG_FORGOTBUTTON+' '+ITSADIALOG+'-firstbutton">{'+(imageButtons ? IMG : '')+BTN_+FORGOT_USERNAME+'}'+ENDDIV+
                  DIVCLASS_ITSA+DIALOG_FORGOTBUTTON+'">{'+(imageButtons ? IMG : '')+BTN_+FORGOT_PASSWORD+'}'+ENDDIV+
                  '</form>',
        forgotMessage = new Y.ITSAMessage();
    forgotMessage.icon = config.iconQuestion || ICON_QUESTION;
    forgotMessage.title = config.titleForgotUsernameOrPassword || intl[FORGOT_USERNAME_OR_PASSWORD];
    forgotMessage.level = WARN;
    forgotMessage.noAudio = true;
    forgotMessage.footer = null;
    forgotMessage._config = config;
    forgotMessage.target = ITSADIALOG; // widgetname that should handle this message
    forgotMessage.source = config.source || APP;
    forgotMessage.messageType = FORGOT_USERNAME_OR_PASSWORD;
    forgotMessage.message = message;
    forgotMessage.closeButton = true;
    if (imageButtons) {
        forgotMessage.customBtns=[
            {
                buttonId: IMGBTN_+FORGOT_USERNAME,
                labelHTML: I_CLASS_ITSADIALOG+'-user"></i>'+intl[FORGOT_USERNAME],
                config: {
                    value: FORGOT_USERNAME,
                    classname: ITSABUTTON_ICONLEFT
                }
            },
            {
                buttonId: IMGBTN_+FORGOT_PASSWORD,
                labelHTML: I_CLASS_ITSADIALOG+'-key"></i>'+intl[FORGOT_PASSWORD],
                config: {
                    value: FORGOT_PASSWORD,
                    classname: ITSABUTTON_ICONLEFT
                }
            }
        ];
    }
    else {
        forgotMessage.customBtns=[
            {
                buttonId: BTN_+FORGOT_USERNAME,
                labelHTML: intl[FORGOT_USERNAME],
                config: {
                    value: FORGOT_USERNAME
                }
            },
            {
                buttonId: BTN_+FORGOT_PASSWORD,
                labelHTML: intl[FORGOT_PASSWORD],
                config: {
                    value: FORGOT_PASSWORD
                }
            }
        ];
    }
    return ITSAMessageControllerInstance.queueMessage(forgotMessage);
};

/*
 * Creates a forgotusername-panel with one UI-field: 'emailaddress'
 *
 * @method _regainFn_Un
 * @private
 * @param config {object} config of the original Y.ITSAMEssage-instance that was generated by the login-panel
 * @param [config.formconfigUsername] {Object} formconfig that passes through to the username-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.iconQuestion] {String} icon-classname of the retrieve username/password-dialogs (see gallerycss-itsa-dialog for icon classnames)
 * @param [config.imageButtons] {Boolean} creates panel-buttons with image-icons.
 * @param [config.messageForgotUsername] {String} Message that appears on the 'forgot-username'-form (overrules the default)
 * @param [config.titleForgotUsername] {String} Title that appears on the 'forgot-username'-form (overrules the default)
 * @param [config.validationerrorEmail] {String} validationerror that passes through to the username-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.validatorEmail] {Function} validator that passes through to the email-attribute of the underlying Y.ITSAMessage-instance.
 * @param syncPromise {Y.Promise} the same sync-Promise that was passed through when calling login()
 * @return {Y.Promise} going through Y.ITSAMessageController
 * @since 0.1
 *
*/
ITSADialogClass.prototype._regainFn_Un = function(config, syncPromise) {
    var formconfigForgotUsername, MyForgotUsername, message, forgotUsername, imageButtons, intl;
    intl = ITSADialogInstance._intl;
    // setting config for username:
    formconfigForgotUsername = config.formconfigForgotUsername || {};
/*jshint expr:true */
    formconfigForgotUsername[LABEL] || formconfigForgotUsername[PLACEHOLDER] || (formconfigForgotUsername[LABEL]=intl[EMAIL]);
/*jshint expr:false */
    formconfigForgotUsername[FULLSELECT] = true;
    formconfigForgotUsername[PRIMARYBTNONENTER] = true;
    formconfigForgotUsername[CLASSNAME] = ITSA_LOGIN + (formconfigForgotUsername[CLASSNAME] ? ' '+formconfigForgotUsername[CLASSNAME] : '');
    formconfigForgotUsername[REQUIRED] = true;

    MyForgotUsername = Y.Base.create('itsamessageforgotun', Y.ITSAMessage, [], null, {
                           ATTRS: {
                               emailaddress: {
                                   formtype: EMAIL,
                                   formconfig: formconfigForgotUsername,
                                   validator: config.validatorEmail || config.validatorUsername,
                                   validationerror: config.validationerrorEmail || config.validationerrorUsername
                               }
                           }
                       });
    message = SPANWRAPPER + (config.messageForgotUsername || intl.entersignupaddress) + ENDSPAN+
              FIELDSET_START+
                   DIVCLASS_PURECONTROLGROUP+'{'+EMAILADDRESS+'}'+ENDDIV+
              ENDFIELDSET;
    forgotUsername = new MyForgotUsername();
    forgotUsername.syncPromise = syncPromise;
    imageButtons = (typeof config.imageButtons === BOOLEAN) && config.imageButtons;
    forgotUsername.icon = config.iconQuestion || ICON_QUESTION;
    forgotUsername.title = config.titleForgotUsername || intl[FORGOT_USERNAME];
    forgotUsername.message = message;
    forgotUsername.level = WARN;
    forgotUsername.noAudio = true;
    forgotUsername.config = config;
    forgotUsername.target = ITSADIALOG; // widgetname that should handle this message
    forgotUsername.source = config.source || APP;
    forgotUsername.messageType = FORGOT_USERNAME;
    forgotUsername._submitBtn = FORGOT_USERNAME;
    forgotUsername.closeButton = true;
    forgotUsername.primaryButton = (imageButtons ? IMG : '')+BTNSUBMIT;
    forgotUsername.footer = '{'+(imageButtons ? IMG : '')+BTNSUBMIT+'}';
    forgotUsername.buttonLabels = [
        {buttonType: (imageButtons ? IMG : '')+BTNSUBMIT, labelHTML: (imageButtons ? I_CLASS_ITSADIALOG+'-mail"></i>' : '')+intl[SEND_USERNAME]}
    ];
    return ITSAMessageControllerInstance.queueMessage(forgotUsername);
};

/* Internal function
 *
 * Creates a forgotpassword-panel with one UI-field: 'username' (or 'emailaddress' in case config.usernameIsEmail===true)
 *
 * @method _regainFn_Pw
 * @private
 * @param config {object} config of the original Y.ITSAMEssage-instance that was generated by the login-panel
 * @param [config.formconfigPassword] {Object} formconfig that passes through to the password-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.iconQuestion] {String} icon-classname of the retrieve username/password-dialogs (see gallerycss-itsa-dialog for icon classnames)
 * @param [config.imageButtons] {Boolean} creates panel-buttons with image-icons.
 * @param [config.messageForgotPassword] {String} Message that appears on the 'forgot-password'-form (overrules the default)
 * @param [config.titleForgotPassword] {String} Title that appears on the 'forgot-password'-form (overrules the default)
 * @param [config.usernameIsEmail] {Boolean} when set, the email-pattern will be active
 * @param [config.validationerrorEmail] {String} validationerror that passes through to the username-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.validatorEmail] {Function} validator that passes through to the email-attribute of the underlying Y.ITSAMessage-instance.
 * @param syncPromise {Y.Promise} the same sync-Promise that was passed through when calling login()
 * @return {Y.Promise} going through Y.ITSAMessageController
 * @since 0.1
 *
*/
ITSADialogClass.prototype._regainFn_Pw = function(config, syncPromise) {
    var formconfigForgotPassword, MyForgotPassword, message, forgotPassword, imageButtons, intl, usernameIsEmail;
    intl = ITSADialogInstance._intl;
    usernameIsEmail = ((typeof config.usernameIsEmail === BOOLEAN) && config.usernameIsEmail) || false;
    // setting config for username:
    formconfigForgotPassword = config.formconfigPassword || {};
/*jshint expr:true */
    formconfigForgotPassword.label || formconfigForgotPassword[PLACEHOLDER] || (formconfigForgotPassword.label=intl[usernameIsEmail ? EMAILADDRESS : USERNAME]);
/*jshint expr:false */
    formconfigForgotPassword[FULLSELECT] = true;
    formconfigForgotPassword[PRIMARYBTNONENTER] = true;
    formconfigForgotPassword[CLASSNAME] = ITSA_LOGIN + (formconfigForgotPassword[CLASSNAME] ? ' '+formconfigForgotPassword[CLASSNAME] : '');
    formconfigForgotPassword[REQUIRED] = true;

    MyForgotPassword = Y.Base.create('itsamessageforgotpw', Y.ITSAMessage, [], null, {
                           ATTRS: {
                               username: {
                                   formtype: usernameIsEmail? 'email' : 'text',
                                   formconfig: formconfigForgotPassword,
                                   validator: config.validatorEmail || config.validatorUsername,
                                   validationerror: config.validationerrorEmail || config.validationerrorUsername
                               }
                           }
                       });
    message = SPANWRAPPER + (config.messageForgotPassword || (usernameIsEmail ? intl.retrievepasswordinstructionsmaillogin : intl.retrievepasswordinstructions)) + ENDSPAN+
              FIELDSET_START+
                   DIVCLASS_PURECONTROLGROUP+'{'+USERNAME+'}'+ENDDIV+
              ENDFIELDSET;
    forgotPassword = new MyForgotPassword();
    forgotPassword.syncPromise = syncPromise;
    imageButtons = (typeof config.imageButtons === BOOLEAN) && config.imageButtons;
    forgotPassword.icon = config.iconQuestion || ICON_QUESTION;
    forgotPassword.title = config.titleForgotPassword || intl[FORGOT_PASSWORD];
    forgotPassword.message = message;
    forgotPassword.level = WARN;
    forgotPassword.noAudio = true;
    forgotPassword.config = config;
    forgotPassword.target = ITSADIALOG; // widgetname that should handle this message
    forgotPassword.source = config.source || APP;
    forgotPassword.messageType = usernameIsEmail ? FORGOT_PASSWORD_EMAIL : FORGOT_PASSWORD;
    forgotPassword._submitBtn = FORGOT_PASSWORD;
    forgotPassword.closeButton = true;
    forgotPassword.primaryButton = (imageButtons ? IMG : '')+BTNSUBMIT;
    forgotPassword.footer = '{'+(imageButtons ? IMG : '')+BTNSUBMIT+'}';
    forgotPassword.buttonLabels = [
        {buttonType: (imageButtons ? IMG : '')+BTNSUBMIT, labelHTML: (imageButtons ? I_CLASS_ITSADIALOG+'-mail"></i>' : '')+intl[RESET_PASSWORD]}
    ];
    return ITSAMessageControllerInstance.queueMessage(forgotPassword);
};

//==========================================================================================================
//==========================================================================================================

// setting up subscribers to the submit-events

ITSADialogInstance.isRendered().then(
    function() {
        YArray.each(
            [INFO, WARN],
            function(level) {
                var panel = ITSADialogInstance._panels[level];
                ITSADialogInstance._eventhandlers.push(
                    panel.on('*:submit', function(e) {
                        var itsamessage = e.target,
                            messageType = itsamessage.messageType;
                        if ((messageType===GET_LOGIN) || (messageType=== CHANGE_PASSWORD) ||
                            (messageType=== FORGOT_USERNAME) || (messageType=== FORGOT_PASSWORD) || (messageType===FORGOT_PASSWORD_EMAIL)) {
                            itsamessage._set(BUTTON, itsamessage._submitBtn);
                        }
                    })
                );
                ITSADialogInstance._eventhandlers.push(
                    panel.after('*:submit', function(e) {
                        var itsamessage = e.target;
                        // Cautious: e.response is NOT available in the after-bubble chain --> see Y.ITSAFormModel - know issues
                        e.promise.then(
                            function(response) {
                                var responseObj = PARSED(response),
                                    intl = ITSADialogInstance._intl,
                                    messageType = itsamessage.messageType,
                                    contentBox, message, facade, config, itsamessageconfig;
                                if (responseObj && responseObj.status) {
                                    if (responseObj.status==='ERROR') {
                                        message = responseObj.message || intl.unspecifiederror;
                                        // production-errors will be shown through the messagecontroller
                                        Y.showError(responseObj.title || intl[ERROR], message);
                                        itsamessage.reject(message);
                                    }
                                    else if ((messageType===CREATE_ACCOUNT) && (responseObj.status==='LOGIN')) {
                                        facade = Y.merge(responseObj, itsamessage.toJSON());
                                        itsamessage.resolve(facade);
                                    }
                                    else if (responseObj.status==='OK') {
                                        facade = Y.merge(responseObj, itsamessage.toJSON());
                                        itsamessage.resolve(facade);
                                        // fire the login-event in case messageType===GET_LOGIN
                                        if (messageType===GET_LOGIN) {
                                            Y.fire(LOGGEDIN, facade);
/*jshint expr:true */
                                            (message=responseObj.message) && Y.showMessage(responseObj.title, message);
/*jshint expr:false */
                                        }
                                        else if ((messageType===FORGOT_USERNAME) || (messageType===FORGOT_PASSWORD) || (messageType===FORGOT_PASSWORD_EMAIL)) {
                                            itsamessageconfig = itsamessage._config;
                                            message = itsamessageconfig.instructionMessage || (intl[RECIEVEDMAILWITHINSTRUCTIONS] + ', ' + intl[CHECKSPAMBOX]);
                                            config = {
                                                level: WARN,
                                                noAudio: true,
                                                target: ITSADIALOG, // widgetname that should handle this message
                                                source: itsamessageconfig.source || APP,
                                                messageType: 'instructions'
                                            };
                                            // show message at warn-level, to be sure it overrules the current loginpanel
                                            Y.showMessage(config.instructionTitle || intl[CHECKMAIL], message, config);
                                        }
                                        else if (messageType===PASSWORD_CHANGE) {
                                              itsamessageconfig = itsamessage._config;
                                              message = itsamessageconfig.passwordChangedMessage || (intl[PASSWORD_CHANGED]);
                                              config = {
                                                  level: WARN,
                                                  noAudio: true,
                                                  target: ITSADIALOG, // widgetname that should handle this message
                                                  source: itsamessageconfig.source || APP,
                                                  messageType: PASSWORD_CHANGED
                                              };
                                              // show message at warn-level, to be sure it overrules the current loginpanel
                                              Y.showMessage(config.passwordChangeTitle || intl[PASSWORD_CHANGE], message, config);
                                              itsamessage.resolve();
                                        }
                                    }
                                    else if ((messageType===GET_LOGIN) && (responseObj.status==='NOACCESS')) {
                                        message = responseObj.message || intl.loginblocked;
                                        // production-errors will be shown through the messagecontroller
                                        Y.showError(responseObj.title || intl[ERROR], message);
                                        itsamessage.reject(message);
                                    }
                                    else if ((responseObj.status==='RETRY') &&
                                             ((messageType===GET_LOGIN) || (messageType===FORGOT_USERNAME) || (messageType===CREATE_ACCOUNT) ||
                                              (messageType===FORGOT_PASSWORD) || (messageType===FORGOT_PASSWORD_EMAIL) || (messageType===CHANGE_PASSWORD))) {
                        /*jshint expr:true */
                                        if (messageType===CREATE_ACCOUNT) {
                                            Y.alert(responseObj.title || intl.failed, responseObj.message || intl.failedcreateaccount);
                                        }
                                        else {
                                            responseObj.title && panel.set('title', responseObj.title);
                                            (messageType===GET_LOGIN) && (message = responseObj.message || intl.unknownlogin);
                                            (messageType===CHANGE_PASSWORD) && (message = responseObj.message || intl.passwordnotaccepted);
                                            (messageType===FORGOT_PASSWORD) && (message = responseObj.message || intl.unknownusername);
                                            (messageType===FORGOT_PASSWORD_EMAIL) && (message = responseObj.message || intl.unknownemail);
                                            (messageType===FORGOT_USERNAME) && (message = responseObj.message || intl.unknownemail);
                            /*jshint expr:false */
                                            if (message) {
                                                contentBox = panel.get(CONTENTBOX);
                                                contentBox.one('.itsa-messagewrapper').setHTML(message);
                                            }
                                        }
                                    }
                                    else if ((messageType===GET_LOGIN) && (responseObj.status==='CHANGEPASSWORD')) {
                                        ITSADialogInstance._changePwFn(itsamessage.get(USERNAME), itsamessage.get(PASSWORD), itsamessage._config, itsamessage.syncPromise).then(
                                            function(response) {
                                                var newResponseObj = PARSED(response);
                                                // itsamessage is the original getLogin-message with level===INFO
                                                // the message that came from '_changePwFn' is submitted and is shown with status==='OK'
                                                facade = Y.merge(responseObj, newResponseObj, itsamessage.toJSON(), {password: response.password});
                                                // overrule password, because the new password is appropriate
                                                itsamessage.resolve(facade);
                                                // fire the login-event in case messageType===GET_LOGIN
                                                Y.fire(LOGGEDIN, facade);
/*jshint expr:true */
                                                (message=responseObj.message) && Y.showMessage(responseObj.title, message);
/*jshint expr:false */
                                            },
                                            function(reason) {
                                                message = intl.passwordnotchanged;
                                                // production-errors will be shown through the messagecontroller
                                                Y.showError(intl[ERROR], message);
                                            }
                                        );
                                    }
                                    else {
                                        // program-errors will be shown by fireing events. They can be seen by using Y.ITSAErrorReporter
                                        message = 'Wrong response.status found: '+responseObj.status;
                                        facade = {src: 'Y.ITSALogin.submit()', msg: message};
                                        panel.fire('warn', facade);
                                        itsamessage.reject(message);
                                    }
                                }
                                else {
                                    // program-errors will be shown by fireing events. They can be seen by using Y.ITSAErrorReporter
                                    message = 'Response returned without response.status';
                                    facade = {src: 'Y.ITSALogin.submit()', msg: message};
                                    panel.fire('warn', facade);
                                    itsamessage.reject(message);
                                }
                            }
                        ).then(
                            null,
                            function(catchErr) {
                                var message = (catchErr && (catchErr.message || catchErr)) || 'Undefined error during submission';
                                // production-errors will be shown through the messagecontroller
                                Y.showWarning(message);
                            }
                        );
                    })
                );
            }
        );
    }
);

// Cautious: do not use 'Y. login' without whitespace: yogi build cannot hanlde this!!!
/**
 *
 * Renderes a login-panel where the user can fill in a username and password. Using config, the behaviour of the panel can be extended
 * by introducing several sub-panels:<br>
 *
 *      <ul>
 *          <li><code>changepassword-panel</code> will show up when the server responses to button==='getlogin' with {status: 'CHANGEPASSWORD'}</li>
 *          <li><code>forgot-username-or-password-panel</code> is available when config.regain==='usernameorpassword'</li>
 *          <li><code>forgotusername-panel</code> is available when config.regain==='usernameorpassword' || 'username'</li>
 *          <li><code>forgotpassword-panel</code> is available when config.regain==='usernameorpassword' || 'password'</li>
 *          <li><code>createaccount-panel</code> needs to be set-up by the developer, using config.createAccount: createAccountPromise --> see examples</li>
 *      </ul>
 *
 * @method Y.getLogin
 *
 * @param [title] {String} title of the login-panel.
 * @param [message] {String} message inside the login-panel.
 * @param [config] {Object} config (which that is also bound to Y.ITSAMessage._config which passes through to Y.ITSAMessageController).
 * @param [config.createAccount] {function} should internally generate a Y.ITSAMessageController.queueMessage with level==='warn'.
 * @param [config.icon] {String} icon-classname of the login-dialog (see gallerycss-itsa-dialog for icon classnames)
 * @param [config.iconQuestion] {String} icon-classname of the retrieve username/password-dialogs (see gallerycss-itsa-dialog for icon classnames)
 * @param [config.imageButtons] {Boolean} creates panel-buttons with image-icons.
 * @param [config.formconfigPassword] {Object} formconfig that passes through to the password-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.formconfigRemember] {Object} formconfig that passes through to the remember-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.formconfigShowPassword] {Object} formconfig that passes through to the ''show password'-ITSACheckbox when users retrieve their password.
 * @param [config.formconfigUsername] {Object} formconfig that passes through to the username-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.messageChangePassword] {String} Message that appears on the 'change-password'-form (overrules the default)
 * @param [config.messageForgotPassword] {String} Message that appears on the 'forgot-password'-form (overrules the default)
 * @param [config.messageForgotUsername] {String} Message that appears on the 'forgot-username'-form (overrules the default)
 * @param [config.messageForgotUsernameOrPassword] {String} Message that appears on the 'forgot-username-or-password'-form (overrules the default)
 * @param [config.regain] {String} to be used to regain username or password. Should be either 'usernameorpassword' || 'username' || 'password'.
 * @param [config.required] {Boolean} removes the closebutton.
 * @param [config.showStayLoggedin] {Boolean} shows an iOS-stylisch checkbox that is bound to the result.remember-property of the resolve-callback.
 * @param [config.showNewPassword] {Boolean} When password-change: input can be made visible by an Y.ITSACheckbox.
 * @param [config.titleChangePassword] {String} Title that appears on the 'change-password'-form (overrules the default)
 * @param [config.titleForgotPassword] {String} Title that appears on the 'forgot-password'-form (overrules the default)
 * @param [config.titleForgotUsername] {String} Title that appears on the 'forgot-username'-form (overrules the default)
 * @param [config.titleForgotUsernameOrPassword] {String} Title that appears on the 'orgot-username-or-password'-form (overrules the default)
 * @param [config.usernameIsEmail] {Boolean} when set, the email-pattern will be active
 * @param [config.validatorPassword] {Function} validator that passes through to the password-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.validatorUsername] {Function} validator that passes through to the username/email-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.valuePassword] {String} the default value for 'password' that passes through to the password-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.valueRemember] {String} the default value for 'remember' that passes through to the remember-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.valueUsername] {String} the default value for 'username' that passes through to the username-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.validationerrorPassword] {String} validationerror that passes through to the password-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.validationerrorUsername] {String} validationerror that passes through to the username-attribute of the underlying Y.ITSAMessage-instance.
 * @param [config.verifyNewPassword] {Boolean} When password-change: need to verify new password.
 * @param sync {Y.Promise} sync-layer that communicates with the server
 * @return {Y.Promise} Promise that holds valid logindata (if resolved) --> resolve(result) result={username, password, remember} OR reject(reason)
 * @since 0.1
 */
Y[GET_LOGIN] = Y.bind(ITSAMessageControllerInstance[UNDERSCORE+GET_LOGIN], ITSAMessageControllerInstance);

}, 'gallery-2013.12.20-18-06', {
    "requires": [
        "yui-base",
        "intl",
        "base-build",
        "base-base",
        "promise",
        "json-parse",
        "oop",
        "gallery-itsa-i18n-login",
        "gallery-itsamessagecontroller",
        "gallery-itsacheckbox",
        "gallery-itsadialog",
        "gallery-itsamessage",
        "gallery-itsaviewmodelpanel",
        "gallerycss-itsa-base",
        "gallerycss-itsa-animatespin",
        "gallerycss-itsa-dialog"
    ],
    "skinnable": true
});
