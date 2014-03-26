YUI.add('gallery-itsaviewlogin', function (Y, NAME) {

'use strict';

/*jshint maxlen:200 */

/**
 *
 * View ITSAViewLogin
 *
 *
 * @module gallery-itsaviewlogin
 * @extends ITSAViewModel
 * @class ITSAViewLogin
 * @constructor
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://itsasbreuk.nl</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/


//===============================================================================================
//
// Next we create the view
//
//===============================================================================================
var Lang = Y.Lang,
    LOADTIMEOUT = 500, // for loading gallery-itsalogin (in case simplified===true)
    ICON = 'icon',
    MESSAGE = 'message',
    MODEL = 'model',
    CONFIG = 'config',
    FORMCONFIG = 'form'+CONFIG,
    CAP_REGAIN = 'Regain',
    REGAINUN = CAP_REGAIN+'Un',
    REGAINPW = CAP_REGAIN+'Pw',
    REGAINUNPW = REGAINUN+'Pw',
    VALIDATOR = 'validator',
    VALIDATIONERROR = 'validationerror',
    MAIL = 'mail',
    EMAIL = 'e'+MAIL,
    ADDRESS = 'address',
    EMAILADDRESS = EMAIL+ADDRESS,
    BUTTON = 'button',
    PRIMARYBTNONENTER = 'primarybtnonenter',
    FULLSELECT = 'fullselect',
    REQUIRED = 'required',
    LOGGED = 'logged',
    LOGGEDIN = LOGGED+'in',
    LOGGEDOUT = LOGGED+'out',
    SIMPLIFIED = 'simplified',
    STAYLOGGEDIN = 'stay'+LOGGEDIN,
    SERNAME = 'sername',
    ASSWORD = 'assword',
    EMEMBER = 'emember',
    USERNAME = 'u'+SERNAME,
    PASSWORD = 'p'+ASSWORD,
    REMEMBER = 'r'+EMEMBER,
    CAP_USERNAME = 'U'+SERNAME,
    CAP_PASSWORD = 'P'+ASSWORD,
    CAP_REMEMBER = 'R'+EMEMBER,
    USERNAMEISEMAIL = USERNAME+'IsEmail',
    SYNC = 'sync',
    ITSA = 'itsa',
    OGIN = 'ogin',
    OGOUT = 'ogout',
    GET = 'get',
    MESSAGELOGGEDIN = 'messageLoggedin',
    CAP_GETLOGIN = GET+'L'+OGIN,
    LOGIN = 'l'+OGIN,
    LOGOUT = 'l'+OGOUT,
    ICONLOGIN = ICON+'L'+OGIN,
    ICONLOGOUT = ICON+'L'+OGOUT,
    GETLOGIN = GET+LOGIN,
    ITSA_LOGIN = ITSA+'-'+LOGIN,
    TEMPLATE = 'Template',
    LOGINTEMPLATE = LOGIN+TEMPLATE,
    LOGOUTTEMPLATE = LOGOUT+TEMPLATE,
    LABEL = 'label',
    PLACEHOLDER = 'placeholder',
    CLASSNAME = 'classname',
    SPANWRAPPER = '<span class="itsa-messagewrapper">',
    SPANBUTTONWRAPPER = '<span class="itsa-buttonwrapper itsa-buttonwrappersize-{size}">',
    FIELDSET_START = '<fieldset class="'+ITSA_LOGIN+'">',
    ENDSPAN = '</span>',
    DIVCLASS_PURECONTROLGROUP = '<div class="pure-control-group">',
    DIVCLASS_PURECONTROLS = '<div class="pure-controls">',
    DIVCLASS_ITSA = '<div class="itsa-',
    ENDFIELDSET = '</fieldset>',
    ENDDIV = '</div>',
    ERROR = 'error',
    CHANGE = 'Change',
    OBJECT = 'object',
    STRING = 'string',
    BOOLEAN = 'boolean',
    FUNCTION = 'function',
    CREATE = 'create',
    CCOUNT = 'ccount',
    IMG = 'img',
    SUBMIT = 'submit',
    FORGOT = 'forgot',
    BTN_ = 'btn_',
    BTNSUBMIT = BTN_+SUBMIT,
    IMGBTN_ = IMG+BTN_,
    CREATEACCOUNT = CREATE+'a'+CCOUNT,
    BTN_CREATEACCOUNT = 'btn_'+CREATEACCOUNT,
    CAP_CREATEACCOUNT = CREATE+'A'+CCOUNT,
    REGAIN = 'regain',
    USERNAMEORPASSWORD = USERNAME+'or'+PASSWORD,
    FORGOT_USERNAME = FORGOT+USERNAME,
    FORGOT_PASSWORD = FORGOT+PASSWORD,
    DIALOG = 'dialog',
    DESTROYED = 'destroyed',
    IMAGEBUTTONS = 'imageButtons',
    ICONTEMPLATE = '<i class="itsa-mainicon {icon} itsa-iconsize-{size}"></i>',
    ITSABUTTON_ICONLEFT = ITSA+'button-iconleft',
    TEXTBOTTOM_CLASS = ITSA+'button-textbottom',
    I_CLASS_ITSADIALOG = '<i class="itsaicon-'+DIALOG,
    CONTAINER = 'container',
    SMALL = 'small',
    LARGE = 'large',
    GALLERY = 'gallery',
    GALLERYCSS_ITSA_ = GALLERY+'css-itsa-',
    GALLERYCSS_DIALOG = GALLERYCSS_ITSA_+DIALOG,
    GALLERYCSS_FORM = GALLERYCSS_ITSA_+'form',
    GALLERYCSS_ANIMATESPIN = GALLERYCSS_ITSA_+'animatespin',
    GALLERYITSAI18NLOGIN = GALLERY+'-'+ITSA+'-i18n-login',
    GALLERYITSADIALOG = GALLERY+'-'+ITSA+DIALOG,
    GALLERYITSALOGIN = GALLERY+'-'+ITSA+LOGIN,
    ITSAVIEWLOGIN = ITSA+'view'+LOGIN,
    ITSAVIEWLOGIN_LOGGEDIN = ITSAVIEWLOGIN+'-'+LOGGED+'in',
    ITSAVIEWLOGIN_LOGGEDOUT = ITSAVIEWLOGIN+'-'+LOGGED+'out',
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


function ITSAViewLogin() {
    ITSAViewLogin.superclass.constructor.apply(this, arguments);
}

ITSAViewLogin.NAME = 'itsaviewlogin';

Y.ITSAViewLogin = Y.extend(ITSAViewLogin, Y.ITSAViewModel, {}, {
    ATTRS: {
        /**
         * Config that passes through to the 'change-password'-dialogpanel. See gallery-itsalogin.<br>
         * May consist of the following properties:<br>
         * <ul>
         * <li>formconfigPassword {Object} formconfig that passes through to the password-attribute of the underlying Y.ITSAMessage-instance</li>
         * <li>formconfigShowPassword {Object} formconfig that passes through to the ''show password'-ITSACheckbox when users retrieve their password</li>
         * <li>iconQuestion {String} icon-classname of the retrieve username/password-dialogs (see gallerycss-itsa-dialog for icon classnames)</li>
         * <li>imageButtons {Boolean} creates panel-buttons with image-icons</li>
         * <li>messageChangePassword {String} Message that appears on the 'change-password'-form (overrules the default)</li>
         * <li>showNewPassword {Boolean} When password-change: input can be made visible by an Y.ITSACheckbox</li>
         * <li>titleChangePassword] {String} Title that appears on the 'change-password'-form (overrules the default)</li>
         * <li>validationerrorPassword] {String} validationerror that passes through to the password-attribute of the underlying Y.ITSAMessage-instance</li>
         * <li>validatorPassword] {Function} validator that passes through to the password-attribute of the underlying Y.ITSAMessage-instance</li>
         * <li>verifyNewPassword] {Boolean} When password-change: need to verify new password</li>
         * </ul>
         *
         * @attribute configChangePassword
         * @type {Object}
         * @default null
         * @since 0.1
         */
        configChangePassword: {
            value: {},
            validator: function(v) {
                return (typeof v === OBJECT);
            }
        },
        /**
         * Config that passes through to the 'regain-password'-dialogpanel. See gallery-itsalogin.<br>
         * May consist of the following properties:<br>
         * <ul>
         * <li>formconfigPassword] {Object} formconfig that passes through to the password-attribute of the underlying Y.ITSAMessage-instance</li>
         * <li>iconQuestion] {String} icon-classname of the retrieve username/password-dialogs (see gallerycss-itsa-dialog for icon classnames)</li>
         * <li>imageButtons] {Boolean} creates panel-buttons with image-icons</li>
         * <li>messageForgotPassword] {String} Message that appears on the 'forgot-password'-form (overrules the default)</li>
         * <li>titleForgotPassword] {String} Title that appears on the 'forgot-password'-form (overrules the default)</li>
         * <li>usernameIsEmail] {Boolean} when set, the email-pattern will be active</li>
         * <li>validationerrorEmail] {String} validationerror that passes through to the username-attribute of the underlying Y.ITSAMessage-instance</li>
         * <li>validatorEmail] {Function} validator that passes through to the email-attribute of the underlying Y.ITSAMessage-instance</li>
         * </ul>
         *
         * @attribute configRegainPw
         * @type {Object}
         * @default null
         * @since 0.1
         */
        configRegainPw: {
            value: {},
            validator: function(v) {
                return (typeof v === OBJECT);
            },
            getter: function(v) {
                return Y.merge(v, {usernameIsEmail: this.get(USERNAMEISEMAIL)});
            }
        },
        /**
         * Config that passes through to the 'regain-username'-dialogpanel. See gallery-itsalogin.<br>
         * May consist of the following properties:<br>
         * <ul>
         * <li>formconfigUsername] {Object} formconfig that passes through to the username-attribute of the underlying Y.ITSAMessage-instance</li>
         * <li>iconQuestion] {String} icon-classname of the retrieve username/password-dialogs (see gallerycss-itsa-dialog for icon classnames)</li>
         * <li>imageButtons] {Boolean} creates panel-buttons with image-icons</li>
         * <li>messageForgotUsername] {String} Message that appears on the 'forgot-username'-form (overrules the default)</li>
         * <li>titleForgotUsername] {String} Title that appears on the 'forgot-username'-form (overrules the default)</li>
         * <li>validationerrorEmail] {String} validationerror that passes through to the username-attribute of the underlying Y.ITSAMessage-instance</li>
         * <li>validatorEmail] {Function} validator that passes through to the email-attribute of the underlying Y.ITSAMessage-instance</li>
         * </ul>
         *
         * @attribute configRegainUn
         * @type {Object}
         * @default null
         * @since 0.1
         */
        configRegainUn: {
            value: {},
            validator: function(v) {
                return (typeof v === OBJECT);
            },
            getter: function(v) {
                return Y.merge(v, {usernameIsEmail: this.get(USERNAMEISEMAIL)});
            }
        },
        /**
         * Config that passes through to the 'regain-password-or-password'-dialogpanel. See gallery-itsalogin.<br>
         * May consist of the following properties:<br>
         * <ul>
         * <li>iconQuestion] {String} icon-classname of the retrieve username/password-dialogs (see gallerycss-itsa-dialog for icon classnames)</li>
         * <li>imageButtons] {Boolean} creates panel-buttons with image-icons</li>
         * <li>messageForgotUsernameOrPassword] {String} Message that appears on the 'forgot-username-or-password'-form (overrules the default)</li>
         * <li>titleForgotUsernameOrPassword] {String} Title that appears on the 'orgot-username-or-password'-form (overrules the default)</li>
         * </ul>
         *
         * @attribute configRegainUnPw
         * @type {Object}
         * @default null
         * @since 0.1
         */
        configRegainUnPw: {
            value: {},
            validator: function(v) {
                return (typeof v === OBJECT);
            }
        },
        /**
         * Need to be a function that returns a new Promise. Should internally generate a Y.ITSAMessageController.queueMessage with level==='warn'.
         * See the examples how this works.
         *
         * @attribute createAccount
         * @type {Function}
         * @default null
         * @since 0.1
         */
        createAccount: {
            value: null,
            validator: function(v) {
                return (typeof v === FUNCTION);
            }
        },
        /**
         * Makes the View to render the editable-version of the Model. Only when the Model has <b>Y.Plugin.ITSAEditModel</b> plugged in.
         *
         * @attribute editable
         * @type {Boolean}
         * @default false
         * @since 0.1
         */
        editable: {
            value: true,
            readOnly: true
        },
        /**
         * The configobject that passes through to model.password during initialization.
         *
         * @attribute formconfigPassword
         * @type {Object}
         * @default {}
         * @since 0.1
         */
        formconfigPassword: {
            value: {},
            validator: function(v) {
                return (typeof v === OBJECT);
            },
            initOnly: true
        },
        /**
         * The configobject that passes through to model.remember during initialization.
         *
         * @attribute formconfigRemember
         * @type {Object}
         * @default {}
         * @since 0.1
         */
        formconfigRemember: {
            value: {},
            validator: function(v) {
                return (typeof v === OBJECT);
            },
            initOnly: true
        },
        /**
         * The configobject that passes through to model.username during initialization.
         *
         * @attribute formconfigUsername
         * @type {Object}
         * @default {}
         * @since 0.1
         */
        formconfigUsername: {
            value: {},
            validator: function(v) {
                return (typeof v === OBJECT);
            },
            initOnly: true
        },
        /**
         * Main icon created inside the loginview - above the fromfields, next to 'message'
         *
         * @attribute iconLogin
         * @type {String}
         * @default null
         * @since 0.1
         */
        iconLogin: {
            value: null,
            validator: function(v) {
                return (v===null) || (typeof v === STRING);
            }
        },
        /**
         * Main icon created inside the logoutview - above the fromfields, next to 'message'
         *
         * @attribute iconLogout
         * @type {String}
         * @default null
         * @since 0.1
         */
        iconLogout: {
            value: null,
            validator: function(v) {
                return (v===null) || (typeof v === STRING);
            }
        },
        /**
         * Whether to have imagebuttons
         *
         * @attribute imageButtons
         * @type {Boolean}
         * @default false
         * @since 0.1
         */
        imageButtons: {
            value: false,
            validator: function(v) {
                return (typeof v === BOOLEAN);
            },
            initOnly: true
        },
        /**
         * Set this for a custom logintemplate. Make sure it has {username}, {password}, {btn_submit}.<br>
         * Optional you could may use {btn_createaccount} and {btn_forgot}.<br>
         * By setting this attribute, you overrule the default logintemplate.
         *
         * @attribute loginTemplate
         * @type {String}
         * @default null
         * @since 0.1
         */
        loginTemplate: {
            value: null,
            validator: function(v) {
                return (v===null) || (typeof v === STRING);
            }
        },
        /**
         * Set this for a custom logouttemplate. Make sure it has {btn_submit}.<br>
         * By setting this attribute, you overrule the default logouttemplate.
         *
         * @attribute logoutTemplate
         * @type {String}
         * @default null
         * @since 0.1
         */
        logoutTemplate: {
            value: null,
            validator: function(v) {
                return (v===null) || (typeof v === STRING);
            }
        },
        /**
         * Message that appears above the formfields.
         *
         * @attribute message
         * @type {String}
         * @default null
         * @since 0.1
         */
        message: {
            value: null,
            validator: function(v) {
                return (typeof v === STRING);
            }
        },
        /**
         * Message that appears in the view when logged in. Can be set by the server when the server responses with {status: 'OK', messageLoggedin: 'your message'}
         *
         * @attribute messageLoggedin
         * @type {String}
         * @default null
         * @since 0.1
         */
        messageLoggedin: {
            value: null,
            validator: function(v) {
                return (typeof v === STRING);
            }
        },
        /**
         * The Y.Model that will be rendered in the view.
         *
         * @attribute model
         * @type {Y.Model|Object|String}
         * @default {}
         * @since 0.1
         */
        model: {
            readOnly: true
        },
        /**
         * Flag that indicates whether this instance is part of multiple views. Should normally left true.
         * ITSAViewModelPanel sets this to 'false' because it has instances inside the body and footer.
         * When set false, the functionality of locking the view (when needed) is set of and should be done by the parentwidget.
         *
         * @attribute partOfMultiView
         * @type {Boolean}
         * @default true
         * @since 0.1
         */
        partOfMultiView: {
            value: false,
            readOnly: true
        },
        /**
         * Set this attribute to make it possible to regain username or password. Should be either 'usernameorpassword' || 'username' || 'password'.
         *
         * @attribute regain
         * @type {String}
         * @default null
         * @since 0.1
         */
        regain: {
            value: null,
            validator: function(v) {
                return (v===null) || (v===USERNAMEORPASSWORD) || (v===USERNAME) || (v===PASSWORD);
            },
            initOnly: true
        },
        /**
         * Whether to show the 'stay logged in' checkbox.
         *
         * @attribute showStayLoggedin
         * @type {Boolean}
         * @default false
         * @since 0.1
         */
        showStayLoggedin: {
            value: false,
            initOnly: true
        },
        /**
         * Whether to use the simplified templates
         *
         * @attribute simplified
         * @type {Boolean}
         * @default false
         * @since 0.1
         */
        simplified: {
            value: false,
            validator: function(v) {
                return (typeof v === BOOLEAN);
            },
            initOnly: true
        },
        /**
         * Reference to the synclayer. Should be a function that returns a Y.Promise. Best way is to set up the synclayer using gallery-io-utils.
         *
         * @attribute sync
         * @type {Function}
         * @default null
         * @since 0.1
         */
        sync: {
            value: null,
            validator: function(v) {
                return (typeof v === FUNCTION);
            }
        },
       /**
        * <u>Overridden, do not set this, but you could set 'loginTemplate' and 'logoutTemplate'.</u>
        *
        * @attribute template
        * @type {String}
        * @default null
        * @since 0.1
        */
        template: {
            readOnly: true,
            getter: '_getterTempl'
        },
        /**
         * Whether an emailaddress is used as username. This will activate the email-pattern validation.
         *
         * @attribute usernameIsEmail
         * @type {Boolean}
         * @default false
         * @since 0.1
         */
        usernameIsEmail: {
            value: false,
            initOnly: true
        },
        /**
         * The validationerror that passes through to model.password during initialization.
         *
         * @attribute validationerrorPassword
         * @type {String}
         * @default null
         * @since 0.1
         */
        validationerrorPassword: {
            value: null,
            validator: function(v) {
                return (v===null) || (typeof v === STRING);
            },
            initOnly: true
        },
        /**
         * The validationerror that passes through to model.username during initialization.
         *
         * @attribute validationerrorUsername
         * @type {String}
         * @default null
         * @since 0.1
         */
        validationerrorUsername: {
            value: null,
            validator: function(v) {
                return (v===null) || (typeof v === STRING);
            },
            initOnly: true
        },
        /**
         * The validator that passes through to model.password during initialization.
         *
         * @attribute validatorPassword
         * @type {String}
         * @default null
         * @since 0.1
         */
        validatorPassword: {
            value: null,
            validator: function(v) {
                return (v===null) || (typeof v === FUNCTION);
            },
            initOnly: true
        },
        /**
         * The validator that passes through to model.username during initialization.
         *
         * @attribute validatorUsername
         * @type {String}
         * @default null
         * @since 0.1
         */
        validatorUsername: {
            value: null,
            validator: function(v) {
                return (v===null) || (typeof v === FUNCTION);
            },
            initOnly: true
        }
    }
});

/**
 * @method initializer
 * @protected
 * @since 0.1
*/
ITSAViewLogin.prototype.initializer = function() {
    var instance = this,
        eventhandlers = instance._eventhandlers,
        loginintl;

    instance._loggedin = false; // initialize
    instance.get(CONTAINER).addClass(ITSAVIEWLOGIN);
    loginintl = instance._loginintl;
    instance._setSubmitButtons(true);
    /*jshint expr:true */
    (instance.get(IMAGEBUTTONS)) && Y.usePromise(GALLERYCSS_DIALOG, GALLERYCSS_FORM, GALLERYCSS_ANIMATESPIN);
    /*jshint expr:false */
    instance._defineModel();
    if (instance.get(SIMPLIFIED)) {
        Y.later(LOADTIMEOUT, null, function() {
            Y.use(GALLERYITSALOGIN);
        });
    }
    eventhandlers.push(
        instance.after(
            USERNAME+CHANGE,
            function(e) {
                instance.get(MODEL).set(USERNAME, e.newVal);
            }
        )
    );
    eventhandlers.push(
        instance.after(
            PASSWORD+CHANGE,
            function(e) {
                instance.get(MODEL).set(PASSWORD, e.newVal);
            }
        )
    );
    eventhandlers.push(
        instance.after(
            REMEMBER+CHANGE,
            function(e) {
                instance.get(MODEL).set(REMEMBER, e.newVal);
            }
        )
    );
    eventhandlers.push(
        instance.after(
            SYNC+CHANGE,
            function(e) {
                var model = instance.get(MODEL);
                model[SYNC+'Promise']=Y.bind(e.newVal, model);
            }
        )
    );
    eventhandlers.push(
        instance.on(
            'buttonclick',
            function(e) {
                var value = e.value;
                if (value===FORGOT) {
                    Y.usePromise(GALLERYITSALOGIN).then(
                        function() {
                            var ITSADialogInstance = Y.ITSADialog,
                                regain = instance.get(REGAIN),
                                syncPromise = instance.get(SYNC);
                            instance.focusInitialItem()
                            .then(
                                null,
                                function() {
                                    return true; // fulfill the chain
                                }
                            )
                            .then(
                                function() {
                                    return (regain===USERNAMEORPASSWORD) ?
                                           ITSADialogInstance._regainFn_UnPw(instance.get(CONFIG+REGAINUNPW)) :
                                           true;
                                }
                            )
                            .then(
                                function(result) {
                                    if ((result.button===FORGOT_USERNAME) || (regain===USERNAME)) {
                                        return ITSADialogInstance._regainFn_Un(instance.get(CONFIG+REGAINUN), syncPromise);
                                    }
                                    else if ((result.button===FORGOT_PASSWORD) || (regain===PASSWORD)) {
                                        return ITSADialogInstance._regainFn_Pw(instance.get(CONFIG+REGAINPW), syncPromise);
                                    }
                                },
                                function(reason) {
    /*jshint expr:true */
                                    (reason instanceof Error) && Y.showError(reason.message);
    /*jshint expr:false */
                                }
                            );
                        }
                    );
                }
                else if (value===CREATEACCOUNT) {
                    instance.get(CAP_CREATEACCOUNT)(instance.get(SYNC)).then(
                        function(response) {
                            var responseObj = PARSED(response),
                                facade, message;
                            if (responseObj.status==='LOGIN') {
                                facade = responseObj;
                                // fire the login-event in case messageType===CAP_GETLOGIN
                                Y.fire(LOGGEDIN, facade);
    /*jshint expr:true */
                                (message=responseObj.message) && Y.showMessage(responseObj.title, message);
    /*jshint expr:false */
                            }
                            else if (responseObj.status==='ERROR') {
                                message = responseObj.message || loginintl.unspecifiederror;
                                // production-errors will be shown through the messagecontroller
                                Y.usePromise(GALLERYITSADIALOG).then(
                                    function() {
                                        Y.showError(responseObj.title || loginintl[ERROR], message);
                                    }
                                );
                            }
                            else if (responseObj.status!=='OK') {
                                // program-errors will be shown by fireing events. They can be seen by using Y.ITSAErrorReporter
                                message = 'Wrong response.status found: '+responseObj.status;
                                facade = {src: 'Y.ITSAViewLogin.createAccount()', msg: message};
                                instance.fire('warn', facade);
                            }
                        },
                        function(reason) {
/*jshint expr:true */
                            (reason instanceof Error) && Y.showError(reason.message);
/*jshint expr:false */
                        }
                    );
                }
                else if (value===LOGIN) {
                    Y.usePromise(GALLERYITSALOGIN).then(
                        function() {
                            return Y.getLogin('Login', 'Please enter login', instance.get(SYNC));
                        }
                    );
                }
            }
        )
    );
    eventhandlers.push(
        Y.after(
            LOGGEDIN,
            function(e) {
                if (!instance.get(DESTROYED)) {
                    instance._buildLogoutView(e.displayname, e.messageLoggedin);
                    instance.render();
                }
            }
        )
    );

    eventhandlers.push(
        Y.on(
            LOGGEDOUT,
            function() {
                if (!instance.get(DESTROYED)) {
                    instance._buildLoginView();
                    instance.render();
                }
            }
        )
    );

    eventhandlers.push(
        instance.on('*:submit', function(e) {
            var formmodel = e.target,
                logout = (formmodel.get('button')===LOGOUT);
            if (e.currentTarget===instance) {
                e.promise._logout = logout; // flag for aftersubscriber;
            }
        })
    );

    eventhandlers.push(
        instance.after('*:submit', function(e) {
            var formmodel = e.target,
                promise = e.promise;
            if (e.currentTarget===instance) {
                // Cautious: e.response is NOT available in the after-bubble chain --> see Y.ITSAFormModel - know issues
                promise.then(
                    function(response) {
                        var responseObj = PARSED(response),
                            loginintl = instance._loginintl,
                            messageType = formmodel.messageType,
                            message, facade;
/*jshint expr:true */
                        /**
                        * Event fired when a a user logs out.<br>
                        * Not preventable.
                        *
                        * @event loggedout
                        **/
                        promise._logout && Y.fire(LOGGEDOUT);
/*jshint expr:false */
                        if (responseObj && responseObj.status && !promise._logout) {
                            if (responseObj.status==='ERROR') {
                                message = responseObj.message || loginintl.unspecifiederror;
                                // production-errors will be shown through the messagecontroller
                                Y.usePromise(GALLERYITSADIALOG).then(
                                    function() {
                                        Y.showError(responseObj.title || loginintl[ERROR], message);
                                    }
                                );
                            }
                            else if (responseObj.status==='OK') {
                                facade = Y.merge(responseObj, formmodel.toJSON());
                                // fire the login-event in case messageType===CAP_GETLOGIN
                                /**
                                * Event fired when a a user successfully logs in.<br>
                                * Not preventable.
                                *
                                * @event loggedin
                                * @param e {EventFacade} Event Facade including 'username', 'password', 'remember' and all properties that were responsed by the server
                                *                        as an answer to the 'getlogin'-request.
                                **/
                                Y.fire(LOGGEDIN, facade);
    /*jshint expr:true */
                                (message=responseObj.message) && Y.showMessage(responseObj.title, message);
    /*jshint expr:false */
                            }
                            else if ((messageType===CAP_GETLOGIN) && (responseObj.status==='NOACCESS')) {
                                message = responseObj.message || loginintl.loginblocked;
                                // production-errors will be shown through the messagecontroller
                                Y.usePromise(GALLERYITSADIALOG).then(
                                    function() {
                                        Y.showError(responseObj.title || loginintl[ERROR], message);
                                    }
                                );
                            }
                            else if (responseObj.status==='RETRY') {
                /*jshint expr:true */
                                (message = responseObj.message || loginintl.unknownlogin);
                /*jshint expr:false */
                                Y.usePromise(GALLERYITSADIALOG).then(
                                    function() {
                                        Y.showWarning(responseObj.title || loginintl[ERROR], message);
                                    }
                                );
                            }
                            else if (responseObj.status==='CHANGEPASSWORD') {
                                Y.usePromise(GALLERYITSALOGIN).then(
                                    function() {
                                        Y.ITSADialog._changePwFn(formmodel.get(USERNAME), formmodel.get(PASSWORD), instance.get(CONFIG+CHANGE+CAP_PASSWORD), instance.get(SYNC)).then(
                                            function(response) {
                                                var newResponseObj = PARSED(response);
                                                facade = Y.merge(responseObj, newResponseObj, formmodel.toJSON(), {password: response.password});
                                                // overrule password, because the new password is appropriate
                                                Y.fire(LOGGEDIN, facade);
                    /*jshint expr:true */
                                                (message=responseObj.message) && Y.showMessage(responseObj.title, message);
                    /*jshint expr:false */
                                            },
                                            function(reason) {
                                                message = loginintl.passwordnotchanged;
                                                // production-errors will be shown through the messagecontroller
                                                Y.showError(loginintl[ERROR], message);
                                            }
                                        );
                                    }
                                );
                            }
                            else {
                                // program-errors will be shown by fireing events. They can be seen by using Y.ITSAErrorReporter
                                message = 'Wrong response.status found: '+responseObj.status;
                                facade = {src: 'Y.ITSAViewLogin.submit()', msg: message};
                                instance.fire('warn', facade);
                            }
                        }
                        else {
                            // program-errors will be shown by fireing events. They can be seen by using Y.ITSAErrorReporter
                            message = 'Response returned without response.status';
                            facade = {src: 'Y.ITSAViewLogin.submit()', msg: message};
                            instance.fire('warn', facade);
                        }
                    }
                ).then(
                    null,
                    function(catchErr) {
                        var message = (catchErr && (catchErr.message || catchErr)) || 'Undefined error during submission';
                        // production-errors will be shown through the messagecontroller
                        Y.usePromise(GALLERYITSADIALOG).then(
                            function() {
                                Y.showWarning(message);
                            }
                        );
                    }
                );
            }
        })
    );

};

/**
 * Promise that gets fulfilled as soon as the instance is ready. That is as soon as iconfonts are loaded and Y.ITSACurrentuser is read.
 *
 * @method isReady
 * @since 0.1
*/
ITSAViewLogin.prototype.isReady = function() {
    var instance = this;
/*jshint expr:true */
    instance._isReady || (instance._isReady=Y.usePromise(GALLERYCSS_DIALOG, GALLERYCSS_FORM, GALLERYCSS_ANIMATESPIN).then(
                                function() {
                                    // we might need to wait for the current user to load its data
                                    var currentuser = Y.ITSACurrentUser,
                                        currentuserKnownLoggedin;
                                    if (currentuser) {
                                        currentuserKnownLoggedin = currentuser.getCurrent().then(
                                            function(response) {
                                                var model = instance.get(MODEL);
                                                model.set(USERNAME, response[USERNAME], {silent: true});
                                                model.set(PASSWORD, response[PASSWORD], {silent: true});
                                                model.set(REMEMBER, response[REMEMBER], {silent: true});
                                                instance._buildLogoutView(response.displayname, response.messageLoggedin);
                                            },
                                            function() {
                                                instance._buildLoginView();
                                            }
                                        );
                                    }
                                    else {
                                        instance._buildLoginView();
                                    }
                                    return currentuser ? currentuserKnownLoggedin : true;
                                }
                            )
                        );
/*jshint expr:false */
    return instance._isReady;
};

/**
 * Method that is responsible for rendering the Model into the view.
 * Overrules Y.ITSAViewModel's render() because it has to wait for isReady().
 *
 * @method render
 * @private
 * @chainable
 * @since 0.1
 *
*/
ITSAViewLogin.prototype.render = function () {
    var instance = this;
    instance.isReady().then(
        null,
        function() {
            // also render when loggedout:
            return true;
        }
    ).then(
        function() {
            instance.constructor.superclass.render.call(instance);
        }
    );
    // for compatibility, make it chainable
    return instance;
};

//===============================================================================================
// private methods
//===============================================================================================

/**
 * Rebuild the view with the 'login-view', that is, when the user is logged uut.
 *
 * @method _buildLoginView
 * @private
 * @since 0.1
*/
ITSAViewLogin.prototype._buildLoginView = function() {
    var instance = this,
        loginintl = instance._loginintl,
        model = instance.get(MODEL);

    instance._loggedin = false;
    instance._displayname = null;
    instance.get(CONTAINER).addClass(ITSAVIEWLOGIN_LOGGEDOUT);
    instance.get(CONTAINER).removeClass(ITSAVIEWLOGIN_LOGGEDIN);
    instance._setSubmitButtons(true);
    model._set(BUTTON, GETLOGIN);
    model.setSyncMessage(SUBMIT, loginintl.attemptlogin);
    instance._setTemplateRenderer(true);
};

/**
 * Rebuild the view with the 'logout-view', that is, when the user is logged in.
 *
 * @method _buildLogoutView
 * @param displayname {String} The displayname that appears in the template at position {displayname}
 * @param messageLoggedin {String} The loginmessage to be shown. Is templated, so you may use '{displayname}' to show the displayname
 * @private
 * @since 0.1
*/
ITSAViewLogin.prototype._buildLogoutView = function(displayname, messageLoggedin) {
    var instance = this,
        loginintl = instance._loginintl,
        model = instance.get(MODEL);

    instance._loggedin = true;
    instance._displayname = displayname;
    instance.get(CONTAINER).addClass(ITSAVIEWLOGIN_LOGGEDIN);
    instance.get(CONTAINER).removeClass(ITSAVIEWLOGIN_LOGGEDOUT);
/*jshint expr:true */
    messageLoggedin && instance.set(MESSAGELOGGEDIN, messageLoggedin);
/*jshint expr:false */
    instance._setSubmitButtons(false);
    model._set(USERNAME, '');
    model._set(PASSWORD, '');
    model._set(REMEMBER, false);
    model._set(BUTTON, LOGOUT);
    model.setSyncMessage(SUBMIT, loginintl.loggingout);
    instance._setTemplateRenderer(false);
};

/**
 * The default simplified login-template, when attribute 'loginTemplate' is null
 *
 * @method _defComprLoginTempl
 * @private
 * @since 0.1
*/
ITSAViewLogin.prototype._defComprLoginTempl = function() {
    return '{'+BTN_+LOGIN+'}';
};

/**
 * The default simplified logout-template, when attribute 'loginTemplate' is null
 *
 * @method _defComprLogoutTempl
 * @private
 * @since 0.1
*/
ITSAViewLogin.prototype._defComprLogoutTempl = function() {
    return this._defLogoutTempl('');
};

/**
 * Creates the internal Model that is used by the view.
 *
 * @method _defineModel
 * @private
 * @protected
 * @since 0.1
*/
ITSAViewLogin.prototype._defineModel = function() {
    var instance = this,
        loginintl = instance._loginintl,
        usernameIsEmail = instance.get(USERNAMEISEMAIL),
        imagebuttons = instance.get(IMAGEBUTTONS),
        extrabuttons = [],
        MyLoginModel, formconfigUsername, formconfigPassword, formconfigRemember, model;

    formconfigUsername = instance.get(FORMCONFIG+CAP_USERNAME);
/*jshint expr:true */
    formconfigUsername[LABEL] || formconfigUsername[PLACEHOLDER] || (formconfigUsername[LABEL]=loginintl[usernameIsEmail ? EMAILADDRESS : USERNAME]);
/*jshint expr:false */
    formconfigUsername.initialfocus = true;
    formconfigUsername[FULLSELECT] = true;
    formconfigUsername[PRIMARYBTNONENTER] = false;
    formconfigUsername[CLASSNAME] = ITSA_LOGIN + (formconfigUsername[CLASSNAME] ? ' '+formconfigUsername[CLASSNAME] : '');
    formconfigUsername[REQUIRED] = true;

    // setting config for password:
    formconfigPassword = instance.get(FORMCONFIG+CAP_PASSWORD);
/*jshint expr:true */
    formconfigPassword[LABEL] || formconfigPassword[PLACEHOLDER] || (formconfigPassword[LABEL]=loginintl[PASSWORD]);
/*jshint expr:false */
    formconfigPassword[FULLSELECT] = true;
    formconfigPassword[PRIMARYBTNONENTER] = true;
    formconfigPassword[CLASSNAME] = ITSA_LOGIN + (formconfigPassword[CLASSNAME] ? ' '+formconfigPassword[CLASSNAME] : '');
    formconfigPassword[REQUIRED] = true;

    // setting config for remember:
    formconfigRemember = instance.get(FORMCONFIG+CAP_REMEMBER);
    formconfigRemember.widgetconfig = {
        primarybtnonenter: true
    };
/*jshint expr:true */
    formconfigUsername[LABEL] && !formconfigPassword[LABEL] && (formconfigPassword[LABEL] = ' ');
    formconfigPassword[LABEL] && !formconfigUsername[LABEL] && (formconfigUsername[LABEL] = ' ');
    formconfigRemember[LABEL] || (formconfigRemember[LABEL]=loginintl[STAYLOGGEDIN]);
/*jshint expr:false */
    formconfigRemember.switchlabel = true;

/*jshint expr:true */
    instance.get(REGAIN) && extrabuttons.push(imagebuttons ?
                                            {
                                                buttonId: IMGBTN_+FORGOT,
                                                labelHTML: I_CLASS_ITSADIALOG+'-question"></i>'+loginintl[FORGOT],
                                                config: {
                                                    value: FORGOT,
                                                    classname: ITSABUTTON_ICONLEFT
                                                }
                                            } :
                                            {
                                                buttonId: BTN_+FORGOT,
                                                labelHTML: loginintl[FORGOT],
                                                config: {
                                                    value: FORGOT
                                                }
                                            }
                                        );
    instance.get(CAP_CREATEACCOUNT) && extrabuttons.push(imagebuttons ?
                                            {
                                                buttonId: IMGBTN_+CREATEACCOUNT,
                                                labelHTML: I_CLASS_ITSADIALOG+'-user"></i>'+loginintl[CREATEACCOUNT],
                                                config: {
                                                    value: CREATEACCOUNT,
                                                    classname: ITSABUTTON_ICONLEFT
                                                }
                                            } :
                                            {
                                                buttonId: BTN_CREATEACCOUNT,
                                                labelHTML: loginintl[CREATEACCOUNT],
                                                config: {
                                                    value: CREATEACCOUNT
                                                }
                                            }
                                        );
    instance.get(SIMPLIFIED) && extrabuttons.push(imagebuttons ?
                                            {
                                                buttonId: IMGBTN_+LOGIN,
                                                labelHTML: I_CLASS_ITSADIALOG+'-login"></i>'+loginintl[LOGIN],
                                                config: {
                                                    value: LOGIN,
                                                    classname: ITSABUTTON_ICONLEFT+' '+TEXTBOTTOM_CLASS
                                                }
                                            } :
                                            {
                                                buttonId: BTN_+LOGIN,
                                                labelHTML: loginintl[LOGIN],
                                                config: {
                                                    value: LOGIN,
                                                    classname: TEXTBOTTOM_CLASS
                                                }
                                            }
                                        );
    (extrabuttons.length>0) && instance.addCustomBtns(extrabuttons);
/*jshint expr:false */

    MyLoginModel = Y.Base.create('itsaviewloginmodel', Y.ITSAFormModel, [], null, {
                      ATTRS: {
                          username: {
                              value: '',
                              formtype: usernameIsEmail ? 'email' : 'text',
                              formconfig: formconfigUsername,
                              validator: instance.get(VALIDATOR+CAP_USERNAME),
                              validationerror: instance.get(VALIDATIONERROR+CAP_USERNAME)
                          },
                          password: {
                              value: '',
                              formtype: PASSWORD,
                              formconfig: formconfigPassword,
                              validator: instance.get(VALIDATOR+CAP_PASSWORD),
                              validationerror: instance.get(VALIDATIONERROR+CAP_PASSWORD)
                          },
                          remember: {
                              value: false,
                              formtype: Y.ITSACheckbox,
                              formconfig: formconfigRemember
                          },
                          button: {
                              value: GETLOGIN,
                              writeOnce: 'initOnly'
                          }
                      }
                  });
    model = new MyLoginModel();
    model.setSyncMessage(SUBMIT, loginintl.attemptlogin);
    instance._set(MODEL, model);
    // need to set target manually, for the subscribers (_bindUI) aren't loaded yet:
    model.addTarget(instance);
    model.syncPromise = Y.bind(instance.get(SYNC), model);
    // redefine, because the templaterenderer was set with editable=false for there was no model
    instance._setTemplateRenderer(true);
};

/**
 * The default login-template, when attribute 'loginTemplate' is null
 *
 * @method _defLoginTempl
 * @private
 * @since 0.1
*/
ITSAViewLogin.prototype._defLoginTempl = function() {
    var instance = this,
        footer;

    footer = (instance.get(REGAIN) ? '{'+BTN_+FORGOT+'}' : '');
/*jshint expr:true */
    instance.get(CAP_CREATEACCOUNT) && (footer += '{'+BTN_CREATEACCOUNT+'}');
/*jshint expr:false */
    footer += '{'+BTNSUBMIT+'}';
    return SPANWRAPPER + (instance.get(MESSAGE) || '') + ENDSPAN+
           FIELDSET_START+
               DIVCLASS_PURECONTROLGROUP+'{'+USERNAME+'}'+ENDDIV+
               DIVCLASS_PURECONTROLGROUP+'{'+PASSWORD+'}'+ENDDIV+
               (instance.get('showStayLoggedin') ? DIVCLASS_ITSA+'login-checkbox pure-controls">'+'{remember}'+ENDDIV : '')+
               DIVCLASS_PURECONTROLS+footer+ENDDIV+
           ENDFIELDSET;
};

/**
 * The default logout-template, when attribute 'loginTemplate' is null
 *
 * @method _defLogoutTempl
 * @private
 * @since 0.1
*/
ITSAViewLogin.prototype._defLogoutTempl = function(formclass) {
    var instance = this,
        displayname = instance._displayname,
        icon = instance.get(ICONLOGOUT),
        simplified = instance.get(SIMPLIFIED),
        message = (instance.get(MESSAGELOGGEDIN) || (displayname ? instance._loginintl.youareloggedinas : instance._loginintl.youareloggedin)),
        loggedinUser = displayname || '',
        logoutBtn = '{'+BTNSUBMIT+'}';

    return '<form class="pure-form'+formclass+'">'+
               (((!instance.get(LOGOUTTEMPLATE)) && icon) ? Lang.sub(ICONTEMPLATE, {icon: icon, size: (simplified ? SMALL : LARGE)}) : '') +
               SPANWRAPPER + Lang.sub(message, {displayname: loggedinUser}) + ENDSPAN +
               Lang.sub(SPANBUTTONWRAPPER, {size: (simplified ? SMALL : LARGE)})+ logoutBtn + ENDSPAN +
           '</form>';
};

/**
 * Getter for the attribute 'template'
 *
 * @method _getterTempl
 * @private
 * @since 0.1
*/
ITSAViewLogin.prototype._getterTempl = function() {
    var instance = this,
        template = instance._loggedin ? instance._logoutTempl() : instance._loginTempl();

    return instance.get(IMAGEBUTTONS) ? template.replace(/\{btn_/g, '{'+IMGBTN_) : template;
};

/**
 * Internal objects with internationalized login-messages
 *
 * @property _loginintl
 * @private
 * @type Object
*/
ITSAViewLogin.prototype._loginintl = Y.Intl.get(GALLERYITSAI18NLOGIN);

/**
 * The template-creator for the loginview. May make use of the attribute 'loginTemplate', if it is set.
 * Otherwise, it uses its default template, either simplified or not.
 *
 * @method _loginTempl
 * @private
 * @protected
 * @since 0.1
*/
ITSAViewLogin.prototype._loginTempl = function() {
    var instance = this,
        simplified = instance.get(SIMPLIFIED),
        icon = instance.get(ICONLOGIN);

    return (icon ? Lang.sub(ICONTEMPLATE, {icon: icon, size: (simplified ? SMALL : LARGE)}) : '') +
           (instance.get(LOGINTEMPLATE) || (simplified ? instance._defComprLoginTempl() : instance._defLoginTempl()));
};

/**
 * The template-creator for the logoutview. May make use of the attribute 'logoutTemplate', if it is set.
 * Otherwise, it uses its default template, either simplified or not.
 *
 * @method _logoutTempl
 * @private
 * @protected
 * @since 0.1
*/
ITSAViewLogin.prototype._logoutTempl = function() {
    var instance = this,
        simplified = instance.get(SIMPLIFIED),
        logouttemplate = instance.get(LOGOUTTEMPLATE),
        icon = instance.get(ICONLOGOUT);

    return ((icon && logouttemplate) ? Lang.sub(ICONTEMPLATE, {icon: icon, size: (simplified ? SMALL : LARGE)}) : '') +
           (logouttemplate || (simplified ? instance._defComprLogoutTempl() : instance._defLogoutTempl(' itsaviewlogin-non'+SIMPLIFIED)));
};

/**
 * Re-sets the submitbuttons of the form to the right buttons.
 *
 * @method _setSubmitButtons
 * @param login {Boolean} whether to set the submitbuttons to 'login' - or 'logout'
 * @private
 * @protected
 * @since 0.1
*/
ITSAViewLogin.prototype._setSubmitButtons = function(login) {
    var instance = this,
        logging = login ? LOGIN : LOGOUT,
        loginintl = instance._loginintl;

    if (instance.get(IMAGEBUTTONS)) {
    /*jshint expr:true */
        instance._loggedin ? instance.removePrimaryButton() : instance.setPrimaryButton(IMGBTN_+SUBMIT);
    /*jshint expr:false */
        instance.setButtonLabel(IMGBTN_+SUBMIT, I_CLASS_ITSADIALOG+'-'+logging+'"></i>'+loginintl[logging]);
    }
    else {
    /*jshint expr:true */
        instance._loggedin ? instance.removePrimaryButton() : instance.setPrimaryButton(BTNSUBMIT);
    /*jshint expr:false */
        instance.setButtonLabel(BTNSUBMIT, loginintl[logging]);
    }
};

}, 'gallery-2013.12.20-18-06', {
    "requires": [
        "yui-base",
        "intl",
        "base-build",
        "promise",
        "gallery-itsaformmodel",
        "gallery-itsaviewmodel",
        "gallery-itsacheckbox",
        "gallery-itsa-i18n-login",
        "gallery-itsamodelsyncpromise",
        "gallery-itsamodulesloadedpromise"
    ],
    "skinnable": true
});
