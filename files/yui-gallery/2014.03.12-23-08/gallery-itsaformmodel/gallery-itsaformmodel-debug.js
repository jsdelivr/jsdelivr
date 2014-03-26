YUI.add('gallery-itsaformmodel', function (Y, NAME) {

'use strict';

/*jshint maxlen:200 */

/**
 *
 * Extends Y.Model by adding methods through which they can create editable form-elements, which represent and are bound to the propery-value.
 * This model is for defining the UI-structure for all Model's properties and for firing model-events for
 * Y.ITSAFormModel does not rendering to the dom itself. That needs to be done by an Y.View-instance, like Y.ITSAViewModel.
 *
 * @module gallery-itsaformmodel
 * @extends Model
 * @uses gallery-itsamodelsyncpromise
 * @class ITSAFormModel
 * @constructor
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://itsasbreuk.nl</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

var YArray = Y.Array,
    YObject = Y.Object,
    YNode = Y.Node,
    Lang = Y.Lang,
    YIntl = Y.Intl,
    ITSAFormElement = Y.ITSAFormElement,
    NOTIFICATION = 'notification',
    DATACHANGED = 'datachanged',
    WANTRELOAD = 'wantreload',
    NORELOADMSG = 'noreloadmsg',
    UNDEFINED_ELEMENT = 'UNDEFINED FORM-ELEMENT',
    INPUT_REQUIRED = 'inputrequired',
    INVISIBLE_CLASS = 'itsa-invisible',
    DUPLICATE_NODE = '<span style="background-color:F00; color:#FFF">DUPLICATED FORMELEMENT is not allowed</span>',
    MS_TIME_TO_INSERT = 5000, // time to insert the nodes, we set this time to avoid unnecessary onavailable listeners.
    MS_MIN_TIME_FORMELEMENTS_INDOM_BEFORE_REMOVE = 172800000, // for GC --> 2 days in ms
    MS_BEFORE_CLEANUP = 86400000, // for GC: timer that periodic runs _garbageCollect
    TRUE = 'true',
//    LI_ICON = 'i[class^="itsaicon-"], i[class*=" itsaicon-"]',
//    ITSA_BUSY = 'itsa-busy',
//    ITSA_LOADIMG = 'itsaicon-form-loading',
//    DATA_SPIN_BUSY = 'data-spinbusy',
    DISABLED = 'disabled',
    WAS_DISABLED = 'was-'+DISABLED,
    DISABLED_CHECK = DISABLED+'-checked',
    BUTTON = 'button',
    PURE_BUTTON_DISABLED = 'pure-'+BUTTON+'-'+DISABLED,
    DISABLED_BEFORE = '-before',
    SPAN_DATA_FOR_IS = 'span[data-for="',
    SLIDER = 'slider',
    EDITORBASE = 'editorBase',
    ASK_TO_CLICK_EVENT = 'itsabutton-asktoclick',
    ONENTER = 'onenter',
    SUBMITONENTER = 'submit'+ONENTER,
    PRIMARYBTNONENTER = 'primarybtn'+ONENTER,
    DATA_ = 'data-',
    DATA_SUBMITONENTER = DATA_+SUBMITONENTER,
    DATA_PRIMARYBTNONENTER = DATA_+PRIMARYBTNONENTER,
    DATA_FOCUSNEXTONENTER = DATA_+'focusnext'+ONENTER,
    VALID_BUTTON_TYPES = {
        button: true,
        destroy: true,
        remove: true,
        reset: true,
        save: true,
        submit: true,
        load: true
    },
    GALLERY_ITSA = 'gallery-itsa',
    GALLERYITSAFORMMODEL = GALLERY_ITSA + 'formmodel',
    FUNCTION = 'function',
    RENDERPROMISE = 'renderpromise',
    CLICK = 'click',
    SAVE = 'save',
    LOAD = 'load',
    DESTROY = 'destroy',
    REMOVE = 'remove',
    PROMISE = 'Promise',
   /**
     * Fired after model is submitted from the sync layer.
     * @event submit
     * @param e {EventFacade} Event Facade including:
     * @param [e.options] {Object} The options=object that was passed to the sync-layer, if there was one.
     * @param [e.parsed] {Object} The parsed version of the sync layer's response to the submit-request, if there was a response.
     * @param [e.response] {any} The sync layer's raw, unparsed response to the submit-request, if there was one.
     * @since 0.1
    **/
    SUBMIT = 'submit',
    DATE = 'date',
    TIME = 'time',
    DATETIME = DATE+TIME,
    NUMBER = 'number',
    STRING = 'string',
    BOOLEAN = 'boolean',
    PICKER = 'picker',
    ERROR = 'error',
    DATA = 'data',
    VALUE = 'value',
    TYPE = 'type',
    DATA_BUTTON_SUBTYPE = DATA+'-'+BUTTON+'sub'+TYPE,
    DATA_BUTTON_TYPE = DATA+'-'+BUTTON+TYPE,

    DATA_MODELATTRIBUTE = DATA+'-modelattribute',
    ID = 'id',
    DATA_CONTENT = DATA+'-content',

    FOCUS_NEXT_ELEMENTS = {
        text: true,
        number: true,
        password: true,
        email: true,
        url: true
    },

    /**
      * Fired when a the UI is reset, either by clicking on a reset-button or by calling formmodel.reset();
      * No defaultFunction, so listen to the 'on' and 'after' event are the same.
      *
      * @event reset
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      *
    **/
    RESET = 'reset',

    /**
      * Fired by input-elements that can force a 'focusnext' when they detect an enter-key.
      * No defaultFunction, so listen to the 'on' and 'after' event are the same.
      *
      * @event focusnext
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.Node} The node that fired the event.
      * @since 0.1
    **/
    FOCUS_NEXT = 'focusnext',

    /**
      * Fired by the modelinstance when validation fails.
      *
      * @event validationerror
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.nodelist {Y.NodeList} reference to the element-nodes that are validated wrongly
      * @param e.src {String|null} the source that cause validation to be checked
      * @since 0.1
    **/
    VALIDATION_ERROR = 'validationerror',

    /**
      * Event fired after a UI-formelement changes its value from a userinput (not when updated internally).
      * defaultfunction: _defFn_uichanged() always will be executed, unless the event is preventDefaulted or halted.
      *
      * @event uichanged
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.value {Date} current value of the property
      * @param e.node {Y.Node} reference to the element-node
      * @param e.nodeid {String} id of the element-node (without '#')
      * @param e.formElement {Object} reference to the form-element
      *
    **/
    UI_CHANGED = 'uichanged',

    /**
      * Fired when a button -rendered by this modelinstance using renderBtn()- is clicked.
      * No defaultFunction, so listen to the 'on' and 'after' event are the same.
      *
      * @event button:click
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.value {Any} Should be used to identify the button --> defined during rendering: is either config.value or labelHTML
      * @param e.buttonNode {Y.Node} reference to the buttonnode
      * @param e.formElement {Object} reference to the form-element
      *
    **/
    BUTTON_CLICK = BUTTON+':'+CLICK,

    /**
      * Fired when a button -rendered by this modelinstance using renderDestroyBtn()- is clicked.
      * The defaultfunction: destroy() always will be executed, unless the event is preventDefaulted or halted.
      *
      * @event destroy:click
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.value {Any} Should be used to identify the button --> defined during rendering: is either config.value or labelHTML
      * @param e.buttonNode {Y.Node} reference to the buttonnode
      * @param e.formElement {Object} reference to the form-element
      *
    **/
    DESTROY_CLICK = DESTROY+':'+CLICK,

    /**
      * Fired when a button -rendered by this modelinstance using renderRemoveBtn()- is clicked.
      * The defaultfunction: destroy({remove: true}) always will be executed, unless the event is preventDefaulted or halted.
      *
      * @event remove:click
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.value {Any} Should be used to identify the button --> defined during rendering: is either config.value or labelHTML
      * @param e.buttonNode {Y.Node} reference to the buttonnode
      * @param e.formElement {Object} reference to the form-element
      *
    **/
    REMOVE_CLICK = REMOVE+':'+CLICK,

    /**
      * Fired when a button -rendered by this modelinstance using renderSubmitBtn()- is clicked.
      * The defaultfunction: submit() always will be executed, unless the event is preventDefaulted or halted.
      *
      * @event submit:click
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.value {Any} Buttonvalue: could be used to identify the button --> defined during rendering by config.value
      * @param e.buttonNode {Y.Node} reference to the buttonnode
      * @param e.formElement {Object} reference to the form-element
      *
    **/
    SUBMIT_CLICK = SUBMIT+':'+CLICK,

    /**
      * Fired when a button -rendered by this modelinstance using renderResetBtn()- is clicked.
      * The defaultfunction: reset() always will be executed, unless the event is preventDefaulted or halted.
      *
      * @event reset:click
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.value {Any} Buttonvalue: could be used to identify the button --> defined during rendering by config.value
      * @param e.buttonNode {Y.Node} reference to the buttonnode
      * @param e.formElement {Object} reference to the form-element
      *
    **/
    RESET_CLICK = RESET+':'+CLICK,

    /**
      * Fired when a button -rendered by this modelinstance using renderSaveBtn()- is clicked.
      * The defaultfunction: save() always will be executed, unless the event is preventDefaulted or halted.
      *
      * @event save:click
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.value {Any} Buttonvalue: could be used to identify the button --> defined during rendering by config.value
      * @param e.buttonNode {Y.Node} reference to the buttonnode
      * @param e.formElement {Object} reference to the form-element
      *
    **/
    SAVE_CLICK = SAVE+':'+CLICK,

    /**
      * Fired when a button -rendered by this modelinstance using renderLoadBtn()- is clicked.
      * The defaultfunction: load() always will be executed, unless the event is preventDefaulted or halted.
      *
      * @event load:click
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.value {Any} Buttonvalue: could be used to identify the button --> defined during rendering by config.value
      * @param e.buttonNode {Y.Node} reference to the buttonnode
      * @param e.formElement {Object} reference to the form-element
      *
    **/
    LOAD_CLICK = LOAD+':'+CLICK,

    /**
      * Fired when a datepickerbutton -rendered by this modelinstance- is clicked.
      * The defaultfunction: _defFn_changedate() always will be executed, unless the event is preventDefaulted or halted.
      *
      * @event datepickerclick
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.value {Date} current value of the property
      * @param e.buttonNode {Y.Node} reference to the buttonnode
      * @param e.formElement {Object} reference to the form-element
      *
    **/
    DATEPICKER_CLICK = DATE+PICKER+CLICK,

    /**
      * Fired when a timepickerbutton -rendered by this modelinstance- is clicked.
      * The defaultfunction: _defFn_changedate() always will be executed, unless the event is preventDefaulted or halted.
      *
      * @event timepickerclick
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.value {Date} current value of the property
      * @param e.buttonNode {Y.Node} reference to the buttonnode
      * @param e.formElement {Object} reference to the form-element
      *
    **/
    TIMEPICKER_CLICK = TIME+PICKER+CLICK,

    /**
      * Fired when a datetimepickerbutton -rendered by this modelinstance- is clicked.
      * The defaultfunction: _defFn_changedate() always will be executed, unless the event is preventDefaulted or halted.
      *
      * @event datetimepickerclick
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.value {Date} current value of the property
      * @param e.buttonNode {Y.Node} reference to the buttonnode
      * @param e.formElement {Object} reference to the form-element
      *
    **/
    DATETIMEPICKER_CLICK = DATE+TIME+PICKER+CLICK,

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
    },

    BROADCAST = "broadcast",
    PUBLISHED = "published",
    MODIFIABLE_NEWDEF = {
        readOnly:1,
        writeOnce:1,
        getter:1,
        broadcast:1,
        formtype:1,
        formconfig:1
    },

ITSAFormModel = Y.ITSAFormModel = Y.Base.create('itsaformmodel', Y.Model, [], {}, {
    _ATTR_CFG: ['formtype', 'formconfig', 'validationerror']
});

ITSAFormModel.prototype._widgetValueFields = {}; // private prototypeobject can be filled by setWidgetValueField()

ITSAFormModel.prototype._allowedFormTypes = { // allowed string-formelement types
    text: true,
    number: true,
    password: true,
    textarea: true,
    checkbox: true,
    date: true,
    time: true,
    datetime: true,
    email: true,
    url: true,
    plain: true
};

ITSAFormModel.prototype._dateTimeTypes = { // proper date/time-formelement types
    date: true,
    time: true,
    datetime: true
};

ITSAFormModel.prototype._datePickerClicks = { // proper date/timepicker clicks-formelement types
    datepickerclick: true,
    timepickerclick: true,
    datetimepickerclick: true
};

/**
 * Sets up the toolbar during initialisation. Calls render() as soon as the hosts-editorframe is ready
 *
 * @method initializer
 * @protected
 * @since 0.1
 */
ITSAFormModel.prototype.initializer = function() {
    var instance = this;

    Y.log('initializer', 'info', 'ITSAFormModel');
   // -- Public Properties -------------------------------------------------

   /**
    * Internal list that holds event-references
    * @property _eventhandlers
    * @default []
    * @private
    * @type Array
    */
    instance._eventhandlers = [];

   /**
    * internal backup of all created formelements: both attribute and buttons, referenced by nodeid's
    * @property _FORM_elements
    * @default {}
    * @private
    * @type Object
    */
    instance._FORM_elements = {};

   /**
    * internal backup of which attribute generated what all nodeid's, referenced by attribute-name's
    * @property _ATTRS_nodes
    * @default {}
    * @private
    * @type Object
    */
    instance._ATTRS_nodes = {},

   /**
    * internal backup of which nodeid's have been inserted in the dom before, referenced by nodeid's
    * object-properties are 'true' when not found the be removed from the dom yet and a timestamps when
    * out of the dom (stamped with the time out-of-dom was registered)
    * @property _knownNodeIds
    * @default {}
    * @private
    * @type Object
    */
    instance._knownNodeIds = {}, // private prototypeobject that records all nodeid's that are created

   /**
    * internal flag that tells whether updates on a UI-element should be stored at once.
    * @property _lifeUpdate
    * @default false
    * @private
    * @type Boolean
    */
    instance._lifeUpdate = false;

    /**
     * Internal objects with internationalized buttonlabels
     *
     * @property _intl
     * @private
     * @type Object
    */
    instance._intl = YIntl.get(GALLERYITSAFORMMODEL);

   /**
    * internal hash with references to the renderBtn-functions, referenced by type ('button', 'destroy', 'remove', 'reset', 'save', 'load', 'submit').
    * @property _renderBtnFns
    * @private
    * @type Object
    */
    instance._renderBtnFns = {
        button: instance.renderBtn,
        destroy: instance.renderDestroyBtn,
        remove: instance.renderRemoveBtn,
        reset: instance.renderResetBtn,
        save: instance.renderSaveBtn,
        load: instance.renderLoadBtn,
        submit: instance.renderSubmitBtn
    };

    instance.publish(
        UI_CHANGED,
        {
            defaultFn: Y.bind(instance._defFn_uichanged, instance),
            emitFacade: true
        }
    );
    instance.publish(
        DESTROY_CLICK,
        {
            defaultFn: Y.bind(instance.destroy, instance),
            emitFacade: true
        }
    );
    instance.publish(
        REMOVE_CLICK,
        {
            defaultFn: Y.bind(instance.destroy, instance, {remove: true, fromInternal: true}),
            emitFacade: true
        }
    );
    instance.publish(
        SUBMIT_CLICK,
        {
            defaultFn: Y.bind(instance.submit, instance, {fromInternal: true}),
            emitFacade: true
        }
    );
    instance.publish(
        RESET_CLICK,
        {
            defaultFn: function() {
                instance.reset(); // without argument
            },
            emitFacade: true
        }
    );
    instance.publish(
        SAVE_CLICK,
        {
            defaultFn: Y.bind(instance.save, instance, {fromInternal: true}),
            emitFacade: true
        }
    );
    instance.publish(
        LOAD_CLICK,
        {
            defaultFn: Y.bind(instance.load, instance, {fromInternal: true}),
            emitFacade: true
        }
    );
    instance.publish(
        DATEPICKER_CLICK,
        {
            defaultFn: Y.bind(instance._defFn_changedate, instance),
            emitFacade: true
        }
    );
    instance.publish(
        TIMEPICKER_CLICK,
        {
            defaultFn: Y.bind(instance._defFn_changedate, instance),
            emitFacade: true
        }
    );
    instance.publish(
        DATETIMEPICKER_CLICK,
        {
            defaultFn: Y.bind(instance._defFn_changedate, instance),
            emitFacade: true
        }
    );

    instance._bindUI();
    instance._gcTimer = Y.later(MS_BEFORE_CLEANUP, instance, instance._garbageCollect, null, true);
};

/**
 * This is a variant to 'validate()', but meant for UI-emenents.<br />
 * Validates accross attributevalues interactive. F.i: you might have 2 password-fields, one for confirmation.
 * In that case both need to be the same.
 * <br />
 * <br />
 * Return an array with all the attributenames+validationerrormessages that are invalid. To do this, you should create an array
 * and fill it with objects with the properties: 'attribute' and 'validationerror' (both String-type).
 * <br />
 * <br />
 * This method needs to be overridden if needed, by default it is empty.
 * <br />
 * <b>Caution</b> don't read attribute-values with formmodel.get(), but read UI-values with formmodel.getUI() because you need to compare the values
 * as they exist in the UI-elements.
 *
 * @example
 *        model.crossValidation = function() {
 *            var instance = this,
 *                errorattrs = [];
 *            if (instance.getUI('password') !== instance.getUI('passwordcheck')) {
 *                errorattrs.push({
 *                    attribute: 'password',
 *                    validationerror: 'password and password-check are not the same'
 *                });
 *                errorattrs.push({
 *                    attribute: 'passwordcheck',
 *                    validationerror: 'password and password-check are not the same'
 *                });
 *            }
 *            return errorattrs;
 *        }
 *
 * @method crossValidation
 * @return {Array|null} array with objects that failed crossValidation. The objects have the properties 'attribute' and 'validationerror'
 * @since 0.1
*/
ITSAFormModel.prototype.crossValidation = function() {
    Y.log('crossValidation is not overruled --> return empty', 'info', 'ITSAFormModel');
    // empty by default --> can be overridden.
    // should return an array with objects, where the objects have the fields: o.node {Y.Node} and a.validationerror {String}
};

/**
 * Disables all UI-elements so that there is no userinteraction possible. F.i. for usage when submitting a form.
 *
 * @method disableUI
 * @since 0.1
 *
*/
ITSAFormModel.prototype.disableUI = function() {
    var instance = this,
        formelements = instance._FORM_elements;

    Y.log('disableUI', 'info', 'ITSAFormModel');
    YObject.each(
        formelements,
        function(formelement, nodeid) {
            // always check if the nodes are still available in the dom: they might be gone!
            var node = Y.one('#'+nodeid),
                widget = formelement.widget,
                isButton, wasDisabled, labelnode, isDateTime;
            if (node) {
                if (widget) {
                    wasDisabled = widget.get(DISABLED) && !node.getData(DISABLED_CHECK);
                    if (!wasDisabled) {
        /*jshint expr:true */
                        try {
                            (formelement.type.NAME===EDITORBASE) ? widget.hide() : widget.disable();
                        }
                        catch (err) {
                        }
        /*jshint expr:false */
                        // if the widget is slider, then also disable the valuespan
                        if (formelement.type.NAME===SLIDER) {
                            labelnode = Y.one(SPAN_DATA_FOR_IS+nodeid+'"]');
        /*jshint expr:true */
                            labelnode && labelnode.setAttribute(DISABLED, DISABLED);
        /*jshint expr:false */
                        }
                    }
                }
                else {
                    isButton = (node.get('tagName')==='BUTTON') && (node.getAttribute(TYPE)===BUTTON);
                    isDateTime = (node.getAttribute('data-datetimepicker')===TRUE);
                    wasDisabled = node.get(DISABLED) && !node.getData(DISABLED_CHECK);
                    if (isButton) {
                        wasDisabled = wasDisabled || (node.hasClass(PURE_BUTTON_DISABLED) && !node.getData(DISABLED_CHECK));
/*jshint expr:true */
                        wasDisabled || node.addClass(PURE_BUTTON_DISABLED);
                    }
                    wasDisabled || node.setAttribute(DISABLED, DISABLED);
/*jshint expr:false */
                    node.setData(WAS_DISABLED, wasDisabled);
                    if (isDateTime) {
                        labelnode = Y.one(SPAN_DATA_FOR_IS+nodeid+'"]');
/*jshint expr:true */
                        labelnode && labelnode.setAttribute(DISABLED, DISABLED);
/*jshint expr:false */
                    }
                }
                node.setData(DISABLED_CHECK, true);
/*jshint expr:true */
                wasDisabled && node.setData(DISABLED_BEFORE, true);
/*jshint expr:false */
            }
        }
    );
};

/**
 * Cleans up internal references of everything the formmodel has inserted in the dom.
 * Only to be used when destroyed - or when a containernode gets empty.
 *
 * @method cleanup
 * @param [container] {Y.Node} only cleanup items inside this container
 * @protected
 * @since 0.1
*/
ITSAFormModel.prototype.cleanup = function(container) {
    var instance = this;
/*jshint expr:true */
    container ? instance._cleanupContainer(container) : instance._cleanup();
/*jshint expr:false */
};

/**
 * Enables all UI-elements so that there is userinteraction possible again. For usage in conjunction with disableUI().
 *
 * @method enableUI
 * @since 0.1
 *
*/
ITSAFormModel.prototype.enableUI = function() {
    var instance = this,
        formelements = instance._FORM_elements;

    Y.log('enableUI', 'info', 'ITSAFormModel');
    YObject.each(
        formelements,
        function(formelement, nodeid) {
            // always check if the nodes are still available in the dom: they might be gone!
            var node = Y.one('#'+nodeid),
                widget = formelement.widget,
                isButton, nodeWasDisabled, labelnode, isDateTime;
            if (node) {
                nodeWasDisabled = node.getData(DISABLED_BEFORE);
                if (nodeWasDisabled) {
                    node.clearData(DISABLED_BEFORE);
                }
                else {
                    if (widget) {
        /*jshint expr:true */
                        (formelement.type.NAME===EDITORBASE) ? widget.show() : widget.enable();
        /*jshint expr:false */
                        // if the widget is slider, then also disable the valuespan
                            if (formelement.type.NAME===SLIDER) {
                            labelnode = Y.one(SPAN_DATA_FOR_IS+nodeid+'"]');
        /*jshint expr:true */
                            labelnode && labelnode.removeAttribute(DISABLED);
        /*jshint expr:false */
                        }
                    }
                    else {
                        isButton = (node.get('tagName')==='BUTTON') && (node.getAttribute(TYPE)===BUTTON);
                        isDateTime = (node.getAttribute('data-datetimepicker')===TRUE);
                        if (!node.getData(WAS_DISABLED)) {
                            node.removeAttribute(DISABLED);
/*jshint expr:true */
                            isButton && node.removeClass(PURE_BUTTON_DISABLED);
/*jshint expr:false */
                        }
                        node.clearData(WAS_DISABLED);
                        if (isDateTime) {
                            labelnode = Y.one(SPAN_DATA_FOR_IS+nodeid+'"]');
/*jshint expr:true */
                            labelnode && labelnode.removeAttribute(DISABLED);
/*jshint expr:false */
                        }
                    }
                }
                node.clearData(DISABLED_CHECK);
            }
        }
    );
};

/**
 * Returns an object of the arrribute's current UI-elements {object} that is present in the DOM.
 * In the rare case that the attribute has multiple UI-elements, the first UI will be returned.
 * 'attribute' can be a model-attribute or a buttons 'name'.
 *
 * @method getCurrentFormElement
 * @param attribute {String} name of the attribute or buttonname which FormElements need to be returned.
 * @return {Object} Returnvalue is an ITSAFormElement-object. This object is as specified
 * by gallery-itsaformelement, extended with the property 'node'<ul>
 *                  <li>config --> {object} reference to the original configobject</li>
 *                  <li>html   --> {String} rendered Node which is NOT part of the DOM! Must be inserted manually, or using Y.ITSAFormModel</li>
 *                  <li>name   --> {String} convenience-property===config.name</li>
 *                  <li>node   --> {Y.Node}</li>
 *                  <li>nodeid --> {String} created node's id (without #)</li>
 *                  <li>type   --> {String|WidgetClass} the created type
 *                  <li>widget --> {Widget-instance}handle to the created widgetinstance</li></ul>

 * @since 0.1
 *
*/
ITSAFormModel.prototype.getCurrentFormElement = function(attribute) {
    Y.log('getCurrentFormElement of attribute '+attribute, 'info', 'ITSAFormModel');
    return this.getCurrentFormElements(attribute)[0] || null;
};

/**
 * Returns an array with arrribute's current UI-elements {object} that are present in the DOM.
 * Mostly this will hold one item, but there might be cases where an attribute has multiple UI's in the dom.
 * 'attribute' can be a model-attribute or a buttons 'name'.
 *
 * @method getCurrentFormElements
 * @param attribute {String} name of the attribute or buttonname which FormElements need to be returned.
 * @return {Array} Returnvalue is an array of ITSAFormElement-objects. These objects are as specified
 * by gallery-itsaformelement, extended with the property 'node'<ul>
 *                  <li>config --> {object} reference to the original configobject</li>
 *                  <li>html   --> {String} rendered Node which is NOT part of the DOM! Must be inserted manually, or using Y.ITSAFormModel</li>
 *                  <li>name   --> {String} convenience-property===config.name</li>
 *                  <li>node   --> {Y.Node}</li>
 *                  <li>nodeid --> {String} created node's id (without #)</li>
 *                  <li>type   --> {String|WidgetClass} the created type
 *                  <li>widget --> {Widget-instance}handle to the created widgetinstance</li></ul>

 * @since 0.1
 *
*/
ITSAFormModel.prototype.getCurrentFormElements = function(attribute) {
  var instance = this,
      attributenodes = instance._ATTRS_nodes[attribute],
      currentElements = [],
      formelement;

    Y.log('getCurrentFormElements of attribute '+attribute, 'info', 'ITSAFormModel');
    if (attributenodes) {
        // attribute is an attribute --> looking this way is quicker then iterating through instance._FORM_elements
        YArray.each(
            attributenodes,
            function(nodeid) {
                var node = Y.one('#'+nodeid);
                if (node) {
                    formelement = instance._FORM_elements[nodeid];
                    formelement.node = node;
                    currentElements.push(formelement);
                }
            }
        );
    }
    else {
        // looking for the buttons by iterating through instance._FORM_elements
        YObject.each(
            instance._FORM_elements,
            function(formelement) {
                var node = Y.one('#'+formelement.nodeid);
                if (node && node.getAttribute('name')===attribute) {
                    formelement.node = node;
                    currentElements.push(formelement);
                }
            }
        );
    }
    return currentElements;
};

/**
 * Returns the UI-value of a formelement into its Model-attribute. This might differ from the attribute-value as it resides in the Model-instance.
 * If the attribute has multiple UI in the dom, then it returns the value of the first UI-element. Which should be equal to all other UI-elements
 * byt moduledesign.
 *
 * @method getUI
 * @param attribute {String} name of the attribute which UI-value is to be returned.
 * @return {Any} value of the UI-element that correspons with the attribute.
 * @since 0.1
 *
*/
ITSAFormModel.prototype.getUI = function(attribute) {
    var instance = this,
        formElement, formElements, nodeid, nodeids, node, value, widget, type;

    Y.log('getUI', 'info', 'ITSAFormModel');
    nodeids = instance._ATTRS_nodes[attribute];
    nodeid = nodeids && (nodeids.length>0) && nodeids[0];
    formElements = instance._FORM_elements;
    formElement = nodeid && formElements[nodeid];
    if (formElement && (node=Y.one('#'+nodeid)) && node.getAttribute(DATA_MODELATTRIBUTE)) {
        widget = formElement.widget;
        type = formElement.type;
        value = widget ? instance._getWidgetValue(widget, type) : node.get(VALUE);
        if (Lang.isValue(value)) {
/*jshint expr:true */
            instance._dateTimeTypes[type] && (value = new Date(parseInt(value, 10)));
            (type===NUMBER) && (value = formElement.config.digits ? parseFloat(value) : parseInt(value, 10));
/*jshint expr:false */
        }
    }
    return value;
};

/**
 * Finds the unvalidated UI-values that belongs to this modelinstance.
 *
 * @method getUnvalidatedUI
 * @return {Y.NodeList} the found Nodes which validation failed
 * @since 0.1
 */
ITSAFormModel.prototype.getUnvalidatedUI  = function() {
    var instance = this,
        node, valid, crossvalidation, unvalidNodes = [];

    Y.log('getUnvalidatedUI', 'info', 'ITSAFormModel');
    YObject.each(
        this._FORM_elements,
        function(formelement) {
            if (!formelement.widget) {
                node = Y.one('#'+formelement.nodeid);
                if (node && (node.get('tagName')!=='BUTTON')) {
                    valid = instance._validValue(node, formelement, formelement.name, node.get(VALUE));
                    instance._setNodeValidation(node, valid);
/*jshint expr:true */
                    valid || unvalidNodes.push(node);
/*jshint expr:false */
                }
            }
        }
    );
    // next we check 'crossValidation', this is done second, because the first step (validate per attribute) might set validation valid
    crossvalidation = instance.crossValidation();
    if (Lang.isArray(crossvalidation) && (crossvalidation.length>0)) {
        YArray.each(
            crossvalidation,
            function(item) {
                var attribute = item.attribute,
                    attributenodes = attribute && instance._ATTRS_nodes[attribute];
                if (attributenodes) {
                    YArray.each(
                        attributenodes,
                        function(nodeid) {
                            var node = Y.one('#'+nodeid),
                                validationerror = item.validationerror,
                                error;
                            if (node) {
                                error = ((typeof validationerror === STRING) ? validationerror : null);
                                instance._setNodeValidation(node, false, error);
                                unvalidNodes.push(node);
                            }
                        }
                    );
                }
            }
        );
    }
    Y.log('getUnvalidatedUI found '+unvalidNodes.length+' wrong validated formelement', 'info', 'ITSAFormModel');
    return new Y.NodeList(unvalidNodes);
};

/**
 * Updates the configuration of an attribute which has already been added.
 * rewritten because we need to be able to change formtype and formconfig.
 * <p>
 * The properties which can be modified through this interface are limited
 * to the following subset of attributes, which can be safely modified
 * after a value has already been set on the attribute: readOnly, writeOnce,
 * broadcast and getter.
 * </p>
 * @method modifyAttr
 * @param {String} name The name of the attribute whose configuration is to be updated.
 * @param {Object} config An object with configuration property/value pairs, specifying the configuration properties to modify.
 */
ITSAFormModel.prototype.modifyAttr = function(name, config) {
    var host = this, // help compression
        prop, state;

    if (host.attrAdded(name)) {

        if (host._isLazyAttr(name)) {
            host._addLazyAttr(name);
        }

        state = host._state;
        for (prop in config) {
            if (MODIFIABLE_NEWDEF[prop] && config.hasOwnProperty(prop)) {
                state.add(name, prop, config[prop]);

                // If we reconfigured broadcast, need to republish
                if (prop === BROADCAST) {
                    state.remove(name, PUBLISHED);
                }
            }
        }
    }
    /*jshint maxlen:200*/
    if (!host.attrAdded(name)) {Y.log('Attribute modifyAttr:' + name + ' has not been added. Use addAttr to add the attribute', 'warn', 'ITSAFormModel');}
    /*jshint maxlen:150 */
};

/**
 * Removes the UI by firing the 'remove'-event. ALSO invokes the synclayer --> use 'destroy' or 'destroyPromise' if you don'nt want to invoke the synclayer.
 * model-promisses are provided by the module 'gallery-itsamodelsyncpromise' which is loaded by this module.
 *
 * @method remove
 * @since 0.1
*/
ITSAFormModel.prototype[REMOVE] = function() {
    Y.log(REMOVE, 'info', 'ITSAFormModel');
    this.fire(REMOVE);
};

/**
 *
 * Renderes a formelement-button. In order to be able to take action once the button is clicked, you can use config.value,
 * otherwise 'labelHTML' will automaticly be the e.value inside the eventlistener. By specifying 'config',
 * the button can be configured in more detail.
 * <br />Imagebuttons can be set through 'labelHTML', f.i.: '<i class="icon-press"></i> press me'
 *
 * @method renderBtn
 * @param labelHTML {String} Text on the button (equals buttonName whennot specified).
 * @param [config] {Object} config (which that is passed through to Y.ITSAFormElement)
 * @param [config.value] {String} returnvalue which is available inside the eventlistener through e.value
 * @param [config.data] {String} when wanting to add extra data to the button, f.i. 'data-someinfo="somedata"'
 * @param [config.disabled=false] {Boolean}
 * @param [config.hidden=false] {Boolean}
 * @param [config.hotkey] {String|Object} character that act as a hotkey: 'alt+char' will focus and click the button.
 *                                 The hotkey-character will be marked with the css-class 'itsa-hotkey' (span-element), which underscores by default, but can be overruled.
 *                                 If you want to Internationize, the you need to supply an object where the properties are the language-tag and the values a string (character).
 *                                 F.i. {us: 'a', nl: 'o'}. When Internationize, there will be no hotkey when the used language is not found in the hotkey-object.
 * @param [config.classname] for adding extra classnames to the button
 * @param [config.focusable=true] {Boolean}
 * @param [config.primary=false] {Boolean} making it the primary-button
 * @param [config.spinbusy=false] {Boolean} making a buttonicon to spin if busy
 * @param [config.tooltip] {String} tooltip when Y.Tipsy or Y.Tipsy is used
 * @return {String} stringified version of the button which can be inserted in the dom.
 * @since 0.1
 *
 */
ITSAFormModel.prototype.renderBtn = function(labelHTML, config) {
    Y.log('renderBtn', 'info', 'ITSAFormModel');
    return this._renderBtn(labelHTML, config, BUTTON);
};

/**
 *
 * Renderes a formelement-destroybutton. 'destroy' differs from 'remove' by NOT calling the destroy-method from the persistence layer (no syncing destroy).
 * By specifying 'config', the button can be configured in more detail.
 * <br />Imagebuttons can be set through 'labelHTML', f.i.: '<i class="icon-destroy"></i> destroy'
 *
 * @method renderDestroyBtn
 * @param labelHTML {String} Text on the button (equals buttonName whennot specified).
 * @param [config] {Object} config (which that is passed through to Y.ITSAFormElement)
 * @param [config.value] {String} returnvalue which is available inside the eventlistener through e.value
 * @param [config.data] {String} when wanting to add extra data to the button, f.i. 'data-someinfo="somedata"'
 * @param [config.disabled=false] {Boolean}
 * @param [config.hidden=false] {Boolean}
 * @param [config.hotkey] {String|Object} character that act as a hotkey: 'alt+char' will focus and click the button.
 *                                 The hotkey-character will be marked with the css-class 'itsa-hotkey' (span-element), which underscores by default, but can be overruled.
 *                                 If you want to Internationize, the you need to supply an object where the properties are the language-tag and the values a string (character).
 *                                 F.i. {us: 'a', nl: 'o'}. When Internationize, there will be no hotkey when the used language is not found in the hotkey-object.
 * @param [config.classname] for adding extra classnames to the button
 * @param [config.focusable=true] {Boolean}
 * @param [config.primary=false] {Boolean} making it the primary-button
 * @param [config.spinbusy=false] {Boolean} making a buttonicon to spin if busy
 * @param [config.tooltip] {String} tooltip when Y.Tipsy or Y.Tipsy is used
 * @return {String} stringified version of the button which can be inserted in the dom.
 * @since 0.1
 *
 */
ITSAFormModel.prototype.renderDestroyBtn = function(labelHTML, config) {
    Y.log('renderDestroyBtn', 'info', 'ITSAFormModel');
    return this._renderBtn(labelHTML, config, DESTROY);
};

/**
 *
 * Renderes a formelement-loadbutton.
 * By specifying 'config', the button can be configured in more detail.
 * <br />Imagebuttons can be set through 'labelHTML', f.i.: '<i class="icon-load"></i> load'
 *
 * @method renderLoadBtn
 * @param labelHTML {String} Text on the button (equals buttonName whennot specified).
 * @param [config] {Object} config (which that is passed through to Y.ITSAFormElement)
 * @param [config.value] {String} returnvalue which is available inside the eventlistener through e.value
 * @param [config.data] {String} when wanting to add extra data to the button, f.i. 'data-someinfo="somedata"'
 * @param [config.disabled=false] {Boolean}
 * @param [config.hidden=false] {Boolean}
 * @param [config.hotkey] {String|Object} character that act as a hotkey: 'alt+char' will focus and click the button.
 *                                 The hotkey-character will be marked with the css-class 'itsa-hotkey' (span-element), which underscores by default, but can be overruled.
 *                                 If you want to Internationize, the you need to supply an object where the properties are the language-tag and the values a string (character).
 *                                 F.i. {us: 'a', nl: 'o'}. When Internationize, there will be no hotkey when the used language is not found in the hotkey-object.
 * @param [config.classname] for adding extra classnames to the button
 * @param [config.focusable=true] {Boolean}
 * @param [config.primary=false] {Boolean} making it the primary-button
 * @param [config.spinbusy=false] {Boolean} making a buttonicon to spin if busy
 * @param [config.tooltip] {String} tooltip when Y.Tipsy or Y.Tipsy is used
 * @return {String} stringified version of the button which can be inserted in the dom.
 * @since 0.1
 *
 */
ITSAFormModel.prototype.renderLoadBtn = function(labelHTML, config) {
    Y.log('renderLoadBtn', 'info', 'ITSAFormModel');
    return this._renderBtn(labelHTML, config, LOAD);
};

/**
 *
 * Renderes a formelement-removebutton. 'remove' differs from 'destroy' by calling the destroy-method from the persistence layer (syncing destroy).
 * By specifying 'config', the button can be configured in more detail.
 * <br />Imagebuttons can be set through 'labelHTML', f.i.: '<i class="icon-remove"></i> remove'
 *
 * @method renderRemoveBtn
 * @param labelHTML {String} Text on the button (equals buttonName whennot specified).
 * @param [config] {Object} config (which that is passed through to Y.ITSAFormElement)
 * @param [config.value] {String} returnvalue which is available inside the eventlistener through e.value
 * @param [config.data] {String} when wanting to add extra data to the button, f.i. 'data-someinfo="somedata"'
 * @param [config.disabled=false] {Boolean}
 * @param [config.hidden=false] {Boolean}
 * @param [config.hotkey] {String|Object} character that act as a hotkey: 'alt+char' will focus and click the button.
 *                                 The hotkey-character will be marked with the css-class 'itsa-hotkey' (span-element), which underscores by default, but can be overruled.
 *                                 If you want to Internationize, the you need to supply an object where the properties are the language-tag and the values a string (character).
 *                                 F.i. {us: 'a', nl: 'o'}. When Internationize, there will be no hotkey when the used language is not found in the hotkey-object.
 * @param [config.classname] for adding extra classnames to the button
 * @param [config.focusable=true] {Boolean}
 * @param [config.primary=false] {Boolean} making it the primary-button
 * @param [config.spinbusy=false] {Boolean} making a buttonicon to spin if busy
 * @param [config.tooltip] {String} tooltip when Y.Tipsy or Y.Tipsy is used
 * @return {String} stringified version of the button which can be inserted in the dom.
 * @since 0.1
 *
 */
ITSAFormModel.prototype.renderRemoveBtn = function(labelHTML, config) {
    Y.log('renderRemoveBtn', 'info', 'ITSAFormModel');
    return this._renderBtn(labelHTML, config, REMOVE);
};

/**
 *
 * Renderes a formelement-resetbutton.
 * By specifying 'config', the button can be configured in more detail.
 * <br />Imagebuttons can be set through 'labelHTML', f.i.: '<i class="icon-reset"></i> reset'
 *
 * @method renderResetBtn
 * @param labelHTML {String} Text on the button (equals buttonName whennot specified).
 * @param [config] {Object} config (which that is passed through to Y.ITSAFormElement)
 * @param [config.value] {String} returnvalue which is available inside the eventlistener through e.value
 * @param [config.data] {String} when wanting to add extra data to the button, f.i. 'data-someinfo="somedata"'
 * @param [config.disabled=false] {Boolean}
 * @param [config.hidden=false] {Boolean}
 * @param [config.hotkey] {String|Object} character that act as a hotkey: 'alt+char' will focus and click the button.
 *                                 The hotkey-character will be marked with the css-class 'itsa-hotkey' (span-element), which underscores by default, but can be overruled.
 *                                 If you want to Internationize, the you need to supply an object where the properties are the language-tag and the values a string (character).
 *                                 F.i. {us: 'a', nl: 'o'}. When Internationize, there will be no hotkey when the used language is not found in the hotkey-object.
 * @param [config.classname] for adding extra classnames to the button
 * @param [config.focusable=true] {Boolean}
 * @param [config.primary=false] {Boolean} making it the primary-button
 * @param [config.spinbusy=false] {Boolean} making a buttonicon to spin if busy
 * @param [config.tooltip] {String} tooltip when Y.Tipsy or Y.Tipsy is used
 * @return {String} stringified version of the button which can be inserted in the dom.
 * @since 0.1
 *
 */
ITSAFormModel.prototype.renderResetBtn = function(labelHTML, config) {
    Y.log('renderResetBtn', 'info', 'ITSAFormModel');
    return this._renderBtn(labelHTML, config, RESET);
};

/**
 *
 * Renderes a formelement-savebutton.
 * By specifying 'config', the button can be configured in more detail.
 * <br />Imagebuttons can be set through 'labelHTML', f.i.: '<i class="icon-save"></i> save'
 *
 * @method renderSaveBtn
 * @param labelHTML {String} Text on the button (equals buttonName whennot specified).
 * @param [config] {Object} config (which that is passed through to Y.ITSAFormElement)
 * @param [config.value] {String} returnvalue which is available inside the eventlistener through e.value
 * @param [config.data] {String} when wanting to add extra data to the button, f.i. 'data-someinfo="somedata"'
 * @param [config.disabled=false] {Boolean}
 * @param [config.hidden=false] {Boolean}
 * @param [config.hotkey] {String|Object} character that act as a hotkey: 'alt+char' will focus and click the button.
 *                                 The hotkey-character will be marked with the css-class 'itsa-hotkey' (span-element), which underscores by default, but can be overruled.
 *                                 If you want to Internationize, the you need to supply an object where the properties are the language-tag and the values a string (character).
 *                                 F.i. {us: 'a', nl: 'o'}. When Internationize, there will be no hotkey when the used language is not found in the hotkey-object.
 * @param [config.classname] for adding extra classnames to the button
 * @param [config.focusable=true] {Boolean}
 * @param [config.primary=false] {Boolean} making it the primary-button
 * @param [config.spinbusy=false] {Boolean} making a buttonicon to spin if busy
 * @param [config.tooltip] {String} tooltip when Y.Tipsy or Y.Tipsy is used
 * @return {String} stringified version of the button which can be inserted in the dom.
 * @since 0.1
 *
 */
ITSAFormModel.prototype.renderSaveBtn = function(labelHTML, config) {
    Y.log('renderSaveBtn', 'info', 'ITSAFormModel');
    return this._renderBtn(labelHTML, config, SAVE);
};

/**
 *
 * Renderes a formelement-submitbutton.
 * By specifying 'config', the button can be configured in more detail.
 * <br />Imagebuttons can be set through 'labelHTML', f.i.: '<i class="icon-submit"></i> submit'
 *
 * @method renderSubmitBtn
 * @param labelHTML {String} Text on the button (equals buttonName whennot specified).
 * @param [config] {Object} config (which that is passed through to Y.ITSAFormElement)
 * @param [config.value] {String} returnvalue which is available inside the eventlistener through e.value
 * @param [config.data] {String} when wanting to add extra data to the button, f.i. 'data-someinfo="somedata"'
 * @param [config.disabled=false] {Boolean}
 * @param [config.hidden=false] {Boolean}
 * @param [config.hotkey] {String|Object} character that act as a hotkey: 'alt+char' will focus and click the button.
 *                                 The hotkey-character will be marked with the css-class 'itsa-hotkey' (span-element), which underscores by default, but can be overruled.
 *                                 If you want to Internationize, the you need to supply an object where the properties are the language-tag and the values a string (character).
 *                                 F.i. {us: 'a', nl: 'o'}. When Internationize, there will be no hotkey when the used language is not found in the hotkey-object.
 * @param [config.classname] for adding extra classnames to the button
 * @param [config.focusable=true] {Boolean}
 * @param [config.primary=false] {Boolean} making it the primary-button
 * @param [config.spinbusy=false] {Boolean} making a buttonicon to spin if busy
 * @param [config.tooltip] {String} tooltip when Y.Tipsy or Y.Tipsy is used
 * @return {String} stringified version of the button which can be inserted in the dom.
 * @since 0.1
 *
 */
ITSAFormModel.prototype.renderSubmitBtn = function(labelHTML, config) {
    Y.log('renderSubmitBtn', 'info', 'ITSAFormModel');
    return this._renderBtn(labelHTML, config, SUBMIT);
};

/**
 *
 * Renderes an attribute into its formelement.
 *
 * @method renderFormElement
 * @param attribute {String} attribute that needs to be rendered.
 * @return {String} stringified version of the element which can be inserted in the dom.
 * @since 0.1
 *
*/
ITSAFormModel.prototype.renderFormElement = function(attribute) {
    var instance = this,
        knownNodeIds = instance._knownNodeIds,
        formelements, attributenodes, attr, attrconfig, formelement, element, formtype, formconfig, valuefield,
        nodeid, widget, iswidget, widgetValuefieldIsarray, iseditorbase;
    Y.log('renderFormElement', 'info', 'ITSAFormModel');
    formelements = instance._FORM_elements;
    attributenodes = instance._ATTRS_nodes;
    attr = instance.get(attribute);
    attrconfig = instance._getAttrCfg(attribute);
    formtype = attrconfig.formtype || 'text';
    iswidget = ((typeof formtype === FUNCTION) && formtype.NAME);
    if (iswidget || instance._allowedFormTypes[formtype]) {
        formconfig = attrconfig.formconfig || {};
        formconfig.value = attr;
        // in case of a widget, also set its value property
        if (iswidget) {
            valuefield = instance._getWidgetValueField(formtype);
/*jshint expr:true */
            formconfig.widgetconfig || (formconfig.widgetconfig = {});
/*jshint expr:false */
            // some widgets like Y.ToggleButton can have different valuefields. We need to check them all.
            // In those cases, valuefield is an array.
            widgetValuefieldIsarray = (typeof valuefield !== STRING);
            if (widgetValuefieldIsarray) {
                YArray.each(
                    valuefield,
                    function(field) {
                        formconfig.widgetconfig[field] = attr;
                    }
                );
            }
            else {
                formconfig.widgetconfig[valuefield] = attr;
            }
        }
        formconfig.modelattribute = true;
        formconfig.name = attribute;
        formconfig.tooltipinvalid = attrconfig.validationerror;
        formconfig.removerequired = true; // disable by setting false
        delete formconfig.pattern; // do not use pattern --> user should use validation
        formconfig.removepattern = true; // specify to remove the pattern property
        // hide the element by adding a invisible-classname --> we wmake it visible once it gets the right data (after inserted in the dom):
        formconfig.hideatstartup = true;
        // now generate the element
        formelement = ITSAFormElement.getElement(formtype, formconfig);
        // store in instance._FORM_elements
        nodeid = formelement.nodeid;
        formelements[nodeid] = formelement;
        // store in instance._ATTRS_nodes
/*jshint expr:true */
        attributenodes[attribute] || (attributenodes[attribute]=[]);
/*jshint expr:false */
        attributenodes[attribute].push(nodeid);
        // if widget, then we need to add an eventlistener for valuechanges:
        widget = formelement.widget;
        if (widget) {
            widget.addTarget(instance); // making widgets-events shown at formmodelinstance
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            // The last thing we need to do is, set some action when the node gets into the dom: We need to
            // make sure the UI-element gets synced with the current attribute-value once it gets into the dom
            // and after that we make it visible and store it internally, so we know the node has been inserted
            iseditorbase = (formtype.NAME===EDITORBASE);
            Y.use(iseditorbase ? GALLERY_ITSA+'editor'+RENDERPROMISE : GALLERY_ITSA+'widget'+RENDERPROMISE, function() {
                widget.renderPromise().then(
                    function() {
                        var node = Y.one('#'+nodeid);
                        widget.addTarget(instance);
                        if (knownNodeIds[nodeid]) {
                            // was rendered before --> we need to replace it by an errornode
                            Y.log('renderFormElement --> nodeid '+nodeid+' for attribute '+attribute+' was already inserted in the dom: won\'t be rendered again', 'warn', 'ITSAFormModel');
                            node.insert(DUPLICATE_NODE, 'replace');
                        }
                        else {
                            knownNodeIds[nodeid] = true;
                            // preferably remove the hissen class after updating content.
                            // but EditorBase cannot get new content when made invivible
/*jshint expr:true */
                            iseditorbase && node.removeClass(INVISIBLE_CLASS);
/*jshint expr:false */
                            instance._modelToUI(nodeid);
/*jshint expr:true */
                            !iseditorbase && node.removeClass(INVISIBLE_CLASS);
/*jshint expr:false */
                        }
                    }
                );
            });
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            if (widgetValuefieldIsarray) {
                YArray.each(
                    valuefield,
                    function(field) {
                        instance._eventhandlers.push(
                            widget.after(
                                field+'Change',
                                function(e) {
                                    var type = UI_CHANGED,
                                        payload;
                                    if (!e.fromInternal) {
                                        payload = {
                                            target: instance,
                                            value: e.newVal,
                                            formElement: formelement,
                                            node: Y.one('#'+nodeid),
                                            nodeid: nodeid,
                                            type: type
                                        };
                                        // refireing, but now by the instance:
                                        instance.fire(type, payload);
                                    }
                                }
                            )
                        );
                    }
                );
            }
            else {
                instance._eventhandlers.push(
                    widget.after(
                        valuefield+'Change',
                        function(e) {
                            var type = UI_CHANGED,
                                payload;
                            if (!e.fromInternal) {
                                payload = {
                                    target: instance,
                                    value: e.newVal,
                                    formElement: formelement,
                                    node: Y.one('#'+nodeid),
                                    nodeid: nodeid,
                                    type: type
                                };
                                // refireing, but now by the instance:
                                instance.fire(type, payload);
                            }
                        }
                    )
                );
            }
        }
        else {
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            // The last thing we need to do is, set some action when the node gets into the dom: We need to
            // make sure the UI-element gets synced with the current attribute-value once it gets into the dom
            // and after that we make it visible and store it internally, so we know the node has been inserted
            YNode.availablePromise('#'+nodeid, MS_TIME_TO_INSERT).then(
                function(node) {
                    if (knownNodeIds[nodeid]) {
                        // was rendered before --> we need to replace it by an errornode
                        Y.log('renderFormElement --> nodeid '+nodeid+' for attribute '+attribute+' was already inserted in the dom: won\'t be rendered again', 'warn', 'ITSAFormModel');
                        node.insert(DUPLICATE_NODE, 'replace');
                    }
                    else {
                        knownNodeIds[nodeid] = true;
                        instance._modelToUI(nodeid);
                        node.removeClass(INVISIBLE_CLASS);
                        if (instance._dateTimeTypes[formtype]) {
                            node = Y.one('span.formatvalue[data-for="'+nodeid+'"]');
/*jshint expr:true */
                            node && node.removeClass(INVISIBLE_CLASS);
/*jshint expr:false */
                        }
                    }
                },
                function(reason) {
                    Y.log('renderFormElement of attribute '+attribute+' failed '+reason, 'warn', 'ITSAFormModel');
                }
            );
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        }
        element = formelement.html;
        if (formelement.widget) {
            formelement.widget.addTarget(instance);
        }
    }
    else {
        element = UNDEFINED_ELEMENT;
    }
    return element;
};

/**
 * Resets attribute's initial state-values and syncs these to the UI. Thus both models attribute as well as the UI are effected.
 *
 * @method reset
 * @since 0.1
*/
ITSAFormModel.prototype.reset = function() {
    var instance = this,
        payload;

    Y.log('reset', 'info', 'ITSAFormModel');
    instance._internalChange = true;
    ITSAFormModel.superclass.reset.apply(instance, arguments);
    if (arguments.length===0) {
        // only original call --> when arguments===1 then the superclass is calling this method from one of its attributes
        instance._internalChange = null;
        instance._modelToUI();
        instance._removeValidation();
        payload = {
            type: RESET,
            target: instance
        };
        instance.fire(RESET, payload);
    }
};

/**
 * Sets the 'life-update'-status to true or false
 *
 * @method setLifeUpdate
 * @chainable;
 * @since 0.1
*/
ITSAFormModel.prototype.setLifeUpdate = function(value) {
    var instance = this;

    Y.log('setLifeUpdate '+value, 'info', 'ITSAFormModel');
/*jshint expr:true */
    (typeof value === BOOLEAN) && (instance._lifeUpdate = value);
/*jshint expr:false */
    return instance;
};

/**
 * Creates the hash that holds the attribute-values which should be used during a resetclick-event.
 * Call this method to freese the state that possibly needs to be restored.
 * <u>note:</u> if not called, than the hash holds the inititial model-attributes during creation.
 *
 * @method setResetAttrs
 * @since 0.1
*/
ITSAFormModel.prototype.setResetAttrs = function() {
    var instance = this,
        allAttrs = instance.getAttrs();
    Y.log('setResetAttrs', 'info', 'ITSAFormModel');
    delete allAttrs.clientId;
    delete allAttrs.destroyed;
    delete allAttrs.initialized;
    if (instance.idAttribute !== ID) {
        delete allAttrs.id;
    }
    YObject.each(
        allAttrs,
        function(value, name) {
/*jshint expr:true */
            value && instance._state.add(name, 'initValue', value);
/*jshint expr:false */
        }
    );
};

/**
 * Defines the valuefield for widget that hold the valu in an attribute other than VALUE.
 * You must specify EVERY widget with a different valuefield that you want as a formmodel.
 * The values are stored in the prototype, so you need to declare them only once. Y.ITSACheckbo and Y.ITSASelectList
 * are already declared.
 *
 * @method setWidgetValueField
 * @param widgetClassname {String} the widgets classname
 * @param valueField {String|Array} the widgets valuefield. In case the Widget can have more than one valuefield (Y.ToggleButton does), you can supply an array of Strings
 * @static
 * @since 0.1
 */
ITSAFormModel.setWidgetValueField = function(widgetClassname, valueField) {
    Y.log('setWidgetValueField', 'info', 'ITSAFormModel');
    this._widgetValueFields[widgetClassname] = valueField;
};

ITSAFormModel.prototype.setWidgetValueField = ITSAFormModel.setWidgetValueField;

/**
 * Submits this model to the server.
 *
 * This method delegates to the `sync()` method to perform the actual submit operation, which is an asynchronous action.
 * Specify a 'callback' function to be notified of success or failure.
 * <br /><br />
 * A successful submit operation will fire a `submit` event, while an unsuccessful save operation will fire an `error` event with the `src` value "submit".
 * <br /><br />
 * To keep track of the proccess, it is preferable to use <b>submitPromise()</b>.<br />
 * An unsuccessful submit operation will fire an `error` event with the `src` value "submit".
 * <br /><br />
 * <b>CAUTION</b> The sync-method with action 'submit' <b>must call its callback-function</b> in order to work as espected!
 *
 * @method submit
 * @param {Object} [options] Options to be passed to `sync()`.
 *                           It's up to the custom sync implementation to determine what options it supports or requires, if any.
 *   @param {String} [options.statusmessage] Message that should appear on a Y.ITSAMessageViewer during asynchronous submission. Will overrule the default message. See gallery-itsamessageviewer.
 * @param {Function} [callback] Called when the sync operation finishes.
 *   @param {Error|null} callback.err If an error occurred or validation failed, this parameter will contain the error.
 *                                    If the sync operation succeeded, 'err' will be null.
 *   @param {Any} callback.response The server's response, if any. This value will be passed to the `parse()` method,
 *                                  which is expected to parse it and return an attribute hash.
 * @chainable
*/
ITSAFormModel.prototype[SUBMIT] = function(options, callback) {
    var instance = this,
        promise;

    Y.log(SUBMIT, 'info', 'ITSAFormModel');
/*jshint expr:true */
    (promise=instance.submitPromise(options)) && callback && promise.then(
        function(response) {
            callback(null, response);
        },
        function(err) {
            callback(err);
        }
    );
/*jshint expr:false */
    return instance;
};

/**
 * Submits this model to the server.
 * <br /><br />
 * This method delegates to the `sync()` method to perform the actual submit
 * operation, which is Y.Promise. Read the Promise.then() and look for resolve(response) OR reject(reason).
 * <br /><br />
 * An unsuccessful submit operation will fire an `error` event with the `src` value "submit".
 * <br /><br />
 * <b>CAUTION</b> The sync-method with action 'submit' <b>must call its callback-function</b> in order to work as espected!
 *
 * @method submitPromise
 * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
 *                 implementation to determine what options it supports or requires, if any.
 *   @param {String} [options.statusmessage] Message that should appear on a Y.ITSAMessageViewer during asynchronous submission. Will overrule the default message. See gallery-itsamessageviewer.
 * @return {Y.Promise} promised response --> resolve(response) OR reject(reason). (examine reason.message).
**/
ITSAFormModel.prototype[SUBMIT+PROMISE] = function(options) {
    Y.log('submitPromise', 'info', 'ITSA-ModelSyncPromise');
    return this._createPromise(SUBMIT, options);
    // method _createPromise is supplied by gallery-itsamodelsyncpromise
    // it will publish the submit-event with defaultfn _defFn_submit, which is defined in this module
};

/**
 * Returns a this model's attributes rendered as UI-elements, that can be passed to Y.JSON.stringify() or used for other nefarious purposes.
 * Be aware that all property-values are html-strings: when templating with micro-template, use '<%==' instead of '<%=' to access the properties.
 * <br />
 * All original attribute-<u>values</u> are available with underscore-properties like: <b>_attributename</b>.
 * <br /><br />
 * By specifying 'buttons', you can render extra buttons. 'buttons' needs to be an object or an array that holds objects, with the next properties:
 *
 * <ul>
 * <li>propertykey --> reference-key which will be part (a property) of the result</li>
 * <li>type --> 'button', 'destroy', 'remove', 'reset', 'save' 'load' or 'submit'</li>
 * <li>labelHTML --> text rendered on the button</li>
 * <li>config --> config-object that is passed through the renderBtn-function</li>
 * </ul>
 * The buttons-object is used to call the related 'renderBtn' method.
 *
 * @method toJSONUI
 * @param [buttons] {Array|Object} button object, or array of buttonobjects. The objects whould consist of this structure:<br />
 * <ul>
 * <li>propertykey --> reference-key which will be part (a property) of the result</li>
 * <li>type --> 'button', 'destroy', 'remove', 'reset', 'save', 'load' or 'submit'</li>
 * <li>labelHTML --> text rendered on the button</li>
 * <li>config --> config-object that is passed through the renderBtn-function</li>
 * </ul>
 * @param [template] {String} template in which it will render: if you know the template on forehand, you better pass it through: this makes the method cpu-efficitient.
 * @return {Object} Copy of this model's attributes.
 * @since 0.1
 */
ITSAFormModel.prototype.toJSONUI = function(buttons, template) {
    var instance = this,
        UIattrs = {},
        allAttrs = instance.getAttrs(),
        renderBtnFns = instance._renderBtnFns,
        propertykey, type, labelHTML, config, originalJSON, propertyEmbraced, propertyEmbracedMicro, needProccess;

    Y.log('toJSONUI', 'info', 'ITSAFormModel');
    delete allAttrs.clientId;
    delete allAttrs.destroyed;
    delete allAttrs.initialized;
    if (instance.idAttribute !== ID) {
        delete allAttrs.id;
    }
    YObject.each(
        allAttrs,
        function(value, key) {
            if (template) {
                // renderFormElement is heavy: we don't want to call it for attributes that will not be rendered
                propertyEmbraced = new RegExp('{'+key+'}');
                propertyEmbracedMicro = new RegExp('<%==? (data|this).'+key+' %>');
                needProccess = propertyEmbraced.test(template) || propertyEmbracedMicro.test(template);
            }
/*jshint expr:true */
            (!template || needProccess) && (UIattrs[key]=instance.renderFormElement(key));
/*jshint expr:false */
        }
    );
    if (Lang.isObject(buttons)) {
        propertykey = buttons.propertykey;
        type = buttons.type;
        labelHTML = buttons.labelHTML;
        config = buttons.config;
/*jshint expr:true */
        propertykey && type && renderBtnFns[type] && (UIattrs[propertykey]=renderBtnFns[type].call(instance, labelHTML, config));
/*jshint expr:false */
    }
    else if (Lang.isArray(buttons)) {
        YArray.each(
            buttons,
            function(buttonobject) {
                propertykey = buttonobject.propertykey;
                type = buttonobject.type;
                labelHTML = buttonobject.labelHTML;
                config = buttonobject.config;
/*jshint expr:true */
                propertykey && type && renderBtnFns[type] && (UIattrs[propertykey]=renderBtnFns[type].call(instance, labelHTML, config));
/*jshint expr:false */
            }
        );
    }
    // now, we might need the original values, f.i. when using js with microtemplates. So we create references to the 'real' values by defining
    // all original properties with an extra underscore
    originalJSON = instance.toJSON();
    YObject.each(
        originalJSON,
        function(value, key) {
            UIattrs['_'+key] = value;
        }
    );
    return UIattrs;
};

/**
 * Copies the UI-value of a formelement into its Model-attribute.
 *
 * @method UIToModel
 * @param [nodeid] {String} nodeid of the formelement (without '#'), when left empty, all formelement-properties are set.
 * @since 0.1
 * @chainable
 *
*/
ITSAFormModel.prototype.UIToModel = function(nodeid) {
    var instance = this,
        formElement, formElements, options, node, value, attribute, widget, type;
    Y.log('UItoModel', 'info', 'ITSAFormModel');
    formElements = instance._FORM_elements;
    formElement = nodeid && formElements[nodeid];
    if (formElement && (node=Y.one('#'+nodeid)) && node.getAttribute(DATA_MODELATTRIBUTE)) {
        widget = formElement.widget;
        type = formElement.type;
        value = widget ? instance._getWidgetValue(widget, type) : node.get(VALUE);
        attribute = formElement.name;
        if (Lang.isValue(value)) {
            options = {formelement: true}; // set Attribute with option: '{formelement: true}' --> Form-Views might not want to re-render.
/*jshint expr:true */
            instance._dateTimeTypes[type] && (value = new Date(parseInt(value, 10)));
            (type===NUMBER) && (value = formElement.config.digits ? parseFloat(value) : parseInt(value, 10));
/*jshint expr:false */
            instance.set(attribute, value, options);
        }
    }
    else if (!nodeid) {
        // save all attributes
        YObject.each(
            instance._ATTRS_nodes,
            function(attributenodes) {
                YArray.each(
                    attributenodes,
                    function(nodeid) {
                        instance.UIToModel(nodeid);
                    }
                );
            }
        );
    }
    return instance;
};

/**
  * Translates the given 'text; through Y.Int of this module. Possible text's that can be translated are:
  * <ul>
  *   <li>datachanged</li>
  *   <li>entervalidnumber</li>
  *   <li>enterrightformat</li>
  *   <li>inputrequired</li>
  *   <li>noreloadmsg</li>
  *   <li>notification</li>
  *   <li>unvalidated</li>
  *   <li>wantreload</li>
  * </ul>
  *
  * @method translate
  * @param text {String} the text to be translated
  * @return {String} --> Translated text or the original text (if no translattion was possible)
  * @since 0.4
**/
ITSAFormModel.prototype.translate = function(text) {
    Y.log('translate', 'info', 'ITSA-ViewModel');
    return this._intl[text] || text;
};

/**
  * Translates the given 'text; through Y.Int of this module. Possible text's that can be translated are:
  * <ul>
  *   <li>datachanged</li>
  *   <li>entervalidnumber</li>
  *   <li>enterrightformat</li>
  *   <li>inputrequired</li>
  *   <li>noreloadmsg</li>
  *   <li>notification</li>
  *   <li>unvalidated</li>
  *   <li>wantreload</li>
  * </ul>
  *
  * @method translatePromise
  * @static
  * @param text {String} the text to be translated
  * @return {Y.Promise} resolve(translated) --> Translated text or the original text (if no translattion was possible)
  * @since 0.4
**/
ITSAFormModel.translatePromise = function(text) {
    Y.log('translatePromise', 'info', 'ITSA-ViewModel');
    return Y.usePromise('intl').then(
        function() {
            var intl = YIntl.get(GALLERYITSAFORMMODEL);
            return intl[text] || text;
        },
        function() {
            return text;
        }
    );
};
ITSAFormModel.prototype.translatePromise = ITSAFormModel.translatePromise;

/**
 * Returns wheter all visible UI-elements are right validated.
 *
 * @method validated
 * @return {Boolean} whether all visible UI-elements are right validated.
 * @since 0.1
 */
ITSAFormModel.prototype.validated  = function() {
    Y.log('validated', 'info', 'ITSAFormModel');
    return (this.getUnvalidatedUI().size()===0);
};


/**
 * Cleans up bindings and removes plugin
 * @method destructor
 * @protected
 * @since 0.1
*/
ITSAFormModel.prototype.destructor = function() {
    var instance = this;
    Y.log('destructor', 'info', 'ITSAFormModel');
    instance._clearEventhandlers();
    instance._removeTargets();
    instance.cleanup();
    instance._widgetValueFields = {};
    instance._gcTimer.cancel();
};

//===============================================================================================
// private methods
//===============================================================================================

Y.Node.prototype.displayInDoc = function() {
    var node = this,
        displayed = node.inDoc();
    while (node && displayed) {
        displayed = (node.getStyle('display')!=='none');
/*jshint expr:true */
        displayed && (node = node.get('parentNode'));
/*jshint expr:false */
    }
    return displayed;
};

/**
 * Setting up eventlisteners
 *
 * @method _bindUI
 * @private
 * @since 0.1
 *
*/
ITSAFormModel.prototype._bindUI = function() {
    var instance = this,
        eventhandlers = instance._eventhandlers,
        body = Y.one('body');

    Y.log('_bindUI', 'info', 'ITSAFormModel');
    // listening for a click on any 'datetimepicker'-button or a click on any 'form-element'-button in the dom
    // CAUTIOUS: DO NOT try to create the first argument (selector), for that failed!, we check for 'formelement'
    // inside the subscriber
    eventhandlers.push(
        body.delegate(
            [DATEPICKER_CLICK, TIMEPICKER_CLICK, DATETIMEPICKER_CLICK, BUTTON_CLICK, LOAD_CLICK,
             SAVE_CLICK, DESTROY_CLICK, REMOVE_CLICK, SUBMIT_CLICK, RESET_CLICK],
            function(e) {
               Y.log('onsubscriptor '+e.type+' caucht on BODY-element', 'info', 'ITSAFormModel');
               var type = e.type,
                   node = e.target,
                   formelement = instance._FORM_elements[node.get(ID)],
                   payload, value, datevalue;
                if (formelement) {
                    e.preventDefault(); // prevent the form to be submitted
                    value = node.getAttribute(VALUE);
                    if (instance._datePickerClicks[type]) {
                        datevalue = new Date();
                        datevalue.setTime(parseInt(value, 10));
                        value = datevalue;
                    }
                    payload = {
                        target: instance,
                        value: value,
                        formElement: instance._FORM_elements[node.get(ID)],
                        buttonNode: node,
                        type: type
                    };
                    // refireing, but now by the instance:
                    instance.fire(type, payload);
                }
            }
        )
    );

    // listening for a click on any widget-element's parentnode and prevent the buttonclick form sending forms
//    eventhandlers.push(
//        body.delegate(
//            'click',
//            function(e) {
//                e.preventDefault(); // prevent the form to be submitted
//            },
//            '.itsa-widget-parent, .itsa-panel'
//            '.itsa-panel'
//        )
//    );

    // listening life for valuechanges
    eventhandlers.push(
        body.delegate(
            'valuechange',
            function(e) {
                Y.log('delegatesubscriptor valuechange delegated to body.someformelement', 'info', 'ITSAFormModel');
                var node = e.target,
                    type = UI_CHANGED,
                    payload = {
                        target: instance,
                        value: node.get(VALUE),
                        formElement: instance._FORM_elements[node.get(ID)],
                        node: node,
                        nodeid: node.get(ID),
                        type: type
                    };
                // refireing, but now by the instance:
                instance.fire(type, payload);
            },
            function(delegatedNode, e){ // node === e.target
                // only process if node's id is part of this ITSAFormModel-instance:
                return e && e.target && instance._FORM_elements[e.target.get(ID)];
            }
        )
    );

    // listening life for changes outside the UI --> do we need to update the UI? (Latency compensation)
    eventhandlers.push(
        instance.after(
            '*:change',
            function(e) {
                var attributeNamesObjects = e.changed,
                    atributeIsUI = false;
                Y.log('aftersubscriptor '+e.type, 'info', 'ITSAFormModel');
                // if e.formelement, then the changes came from the UI
                if (!instance._internalChange && !e.formelement && !e.fromInternal) {
                    // first check whether the attribute that changed was transformed to an UI-element
                    YObject.some(
                        attributeNamesObjects,
                        function(value, key) {
                            atributeIsUI = instance._ATTRS_nodes[key];
                            return atributeIsUI;
                        }
                    );
/*jshint expr:true */
                    atributeIsUI && Y.use(GALLERY_ITSA+'dialog', function() {
                        var intl = instance._intl;
                        if (instance._lifeUpdate) {
                            // the first parameter in the response needs to be 'null' and not the promise result
                            Y.confirm(intl[NOTIFICATION], intl[DATACHANGED]+'.<br />'+intl[WANTRELOAD]+'? ('+intl[NORELOADMSG]+').').then(
                                Y.bind(instance._modelToUI, instance, null),
                                Y.bind(instance.UIToModel, instance, null)
                            );
                        }
                        else {
                            // the first parameter in the response needs to be 'null' and not the promise result
                            Y.confirm(intl[NOTIFICATION], intl[DATACHANGED]+'.<br />'+intl[WANTRELOAD]+'?').then(
                                Y.bind(instance._modelToUI, instance, null)
                            );
                        }
                    });
/*jshint expr:false */
                }
                else if (e.fromInternal) {
                    instance._modelToUI();
                }
            }
        )
    );

    // listening life for valuechanges
    eventhandlers.push(
        body.delegate(
            'keydown',
            function(e) {
                Y.log('delegatedsubscriptor keypress delegated to bode.someformelement with e.keyCode===13', 'info', 'ITSAFormModel');
                e.halt(); // need to do so, otherwise there will be multiple events for every node up the tree until body
                // now it depends: there will be a focus-next OR the model will submit.
                // It depends on the value of DATA_SUBMITONENTER
                var node = e.target,
                    submitonenter = (node.getAttribute(DATA_SUBMITONENTER)==='true'),
                    primarybtnonenter = (node.getAttribute(DATA_PRIMARYBTNONENTER)==='true'),
                    type, payload, primarybtnNode;
                if (primarybtnonenter && (primarybtnNode=instance._findPrimaryBtnNode())) {
                    primarybtnNode.simulate(CLICK);
                }
                else if (submitonenter) {
                    instance.submit({fromInternal: true});
                }
                else {
                    type = FOCUS_NEXT;
                    payload = {
                        target: e.target,
                        type: type
                    };
                    // refireing, but now by the instance:
                    instance.fire(type, payload);
                }
            },
            function(delegatedNode, e){ // node === e.target
                // only process if node's id is part of this ITSAFormModel-instance and if enterkey is pressed
                var node = e.target,
                    formelement = instance._FORM_elements[node.get(ID)];
                return (formelement && (e.keyCode===13) &&
                        (FOCUS_NEXT_ELEMENTS[formelement.type] || (node.getAttribute(DATA_SUBMITONENTER)==='true') ||
                         (node.getAttribute(DATA_PRIMARYBTNONENTER)==='true') || (node.getAttribute(DATA_FOCUSNEXTONENTER)==='true')));
            }
        )
    );

    eventhandlers.push(
        instance.on(
            [SAVE_CLICK, SUBMIT_CLICK],
            function(e) {
                Y.log('onsubscriptor '+SUBMIT_CLICK, 'info', 'ITSAFormModel');
                var unvalidNodes;
                unvalidNodes = instance.getUnvalidatedUI();
                if (!unvalidNodes.isEmpty()) {
                    e.preventDefault();
                    instance.fire(VALIDATION_ERROR, {target: instance, nodelist: unvalidNodes, src: e.type});
                }
                else {
                    instance.UIToModel();
                }
            }
        )
    );

    eventhandlers.push(
        Y.Intl.on( // subscribe to the on-event, so the model updates before the views, which are subscribed to the after-event
            'intl:langChange',
            function() {
                Y.log('onsubscriptor intl:langChange', 'info', 'ITSAFormModel');
                instance._intl = Y.Intl.get(GALLERYITSAFORMMODEL);
            }
        )
    );

    // listening for 'asktoclick-event' which is fired by ITSAFormElement when a user presses a alt+key hotkey that belongs to a button-element
    eventhandlers.push(
        Y.on(
            ASK_TO_CLICK_EVENT,
            function(e) {
                Y.log('onsubscriptor '+ASK_TO_CLICK_EVENT, 'info', 'ITSAFormModel');
                var buttonNode = e.buttonNode,
                    type;
                if (instance._FORM_elements[buttonNode.get('id')]) {
                    type = buttonNode.get('value');
                    instance.fire((VALID_BUTTON_TYPES[type] ? type : BUTTON)+':click', {buttonNode: buttonNode, value: type});
                }
            }
        )
    );

};

/**
 * Cleans up internal references of everything the formmodel has inserted in the dom.
 * Only to be used when destroyed - or when a containernode gets empty.
 *
 * @method _cleanup
 * @protected
 * @private
 * @since 0.1
*/
ITSAFormModel.prototype._cleanup = function() {
    var instance = this,
        formelements = instance.getCurrentFormElements(),
        node;
    YArray.each(
        formelements,
        function(formelement) {
/*jshint expr:true */
            formelement.widget && formelement.widget.destroy(true);
/*jshint expr:false */
            node = Y.one('#'+formelement.nodeid);
            if (node) {
                node.get('childNodes').destroy(true);
                node.remove(true);
            }
        }
    );
    instance._FORM_elements = {};
    instance._ATTRS_nodes = {};
    instance._knownNodeIds = {};
};

/**
 * Cleans up internal references of everything the formmodel has inserted inside the container.
 * Only to be used when a containernode gets empty.
 *
 * @method _cleanupContainer
 * @param [container] {Y.Node} only cleanup items inside this container
 * @protected
 * @private
 * @since 0.1
*/
ITSAFormModel.prototype._cleanupContainer = function(container) {
    var instance = this,
        attributenodes = instance._ATTRS_nodes,
        formelements = instance._FORM_elements,
        knownNodeIds = instance._knownNodeIds,
        knowdIdsRemoval = [],
        node, formelement, attribute, indexofitem;
    YObject.each(
        knownNodeIds,
        function(value, nodeid) {
            formelement = formelements[nodeid];
            node = container.one('#'+nodeid);
            // remove node
            if (node) {
/*jshint expr:true */
                formelement.widget && formelement.widget.destroy(true);
/*jshint expr:false */
                node.get('childNodes').destroy(true);
                node.remove(true);
                delete formelements[nodeid];
                // now find the inside the array _ATTRS_nodes[attribute] for the item that holds ref. to the nodeid
                attribute = formelement.name;
                indexofitem = attributenodes[attribute].indexOf(nodeid);
/*jshint expr:true */
                indexofitem && attributenodes[attribute].splice(indexofitem, 1);
/*jshint expr:false */
                // now store the nodeid, because it has to be removed from instance._knownNodeIds
                knowdIdsRemoval.push(nodeid);
            }
        }
    );
    // now remove it from knownNodeIds
    YArray.each(
        knowdIdsRemoval,
        function(nodeid) {
            delete knownNodeIds[nodeid];
        }
    );
};

/**
 * Cleaning up all eventlisteners
 *
 * @method _clearEventhandlers
 * @private
 * @since 0.1
 *
*/
ITSAFormModel.prototype._clearEventhandlers = function() {
    Y.log('_clearEventhandlers', 'info', 'ITSAFormModel');
    YArray.each(
        this._eventhandlers,
        function(item){
            item.detach();
        }
    );
};

/**
 *
 * Default function for the 'datepickerclick'-, 'timepickerclick'- and 'datetimepickerclick'-event
 *
 * @method _defFn_changedate
 * @param e {EventFacade} Event Facade including:
 * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
 * @param e.value {Any} Should be used to identify the button --> defined during rendering: is either config.value or labelHTML
 * @param e.buttonNode {Y.Node} reference to the buttonnode
 * @param e.formElement {Object} reference to the form-element
 * @private
 * @protected
 * @since 0.1
 *
*/
ITSAFormModel.prototype._defFn_changedate = function(e) {
    Y.log('_defFn_changedate', 'info', 'ITSAFormModel');

    var instance = e.target,
        type = e.type,
        node = e.buttonNode,
        picker = Y.ItsaDateTimePicker,
        formElement = e.formElement,
        date = Lang.isDate(e.value) ? e.value : (new Date()),
        promise, dateformat, tipsycontent;
    if (type===DATEPICKER_CLICK) {
        promise = Y.bind(picker.getDate, picker);
    }
    else if (type===TIMEPICKER_CLICK) {
        promise = Y.bind(picker.getTime, picker);
    }
    else if (type===DATETIMEPICKER_CLICK) {
        promise = Y.bind(picker.getDateTime, picker);
    }
    promise(new Date(date), {alignToNode: node, modal: true, forceSelectdate: false})
    .then(
        function(newdate) {
          // first we need to use the new datevalue and reflect it (update) to the UI-element
          dateformat = formElement.config.format;
          instance._updateDateTimeUI(formElement.name, newdate, type, dateformat);
          if (instance._lifeUpdate) {
              instance.UIToModel(node.get(ID));
          }
        },
        function() {
            return true; // switch rejectstatus to fulfilled by returning a value
        }
    )
    .then(
        function() {
            // should always be called
            var type = FOCUS_NEXT,
                payload = {
                    target: node,
                    type: type
                };
            // be carefull: button might not exist anymore, when the view is rerendered
            if (node) {
                node.removeAttribute(DATA_CONTENT);
                try {
                    // ALWAYS focus nodes using try/catch to prevent js-error when node not in the dom
                    node.focus();
                }
                catch(err) {}
                tipsycontent = node.getAttribute(DATA+'-contentvalid');
/*jshint expr:true */
                tipsycontent && node.setAttribute(DATA_CONTENT, tipsycontent);
/*jshint expr:false */
            }
            instance.fire(type, payload);
        }
    );
};

/**
 * DefaultFn for the 'submit'-event
 *
 * @method _defFn_submit
 * @param e {EventTarget}
 * @param e.promise {Y.Promise} promise passed by with the eventobject
 * @param e.promiseReject {Function} handle to the reject-method
 * @param e.promiseResolve {Function} handle to the resolve-method
 * @private
 * @return {Y.Promise} do not handle yourself: is handled by internal eventsystem.
 * @since 0.1
*/
ITSAFormModel.prototype['_defFn_'+SUBMIT] = function(e) {
    var instance = this,
        options = e.options,
        promiseReject = e.promiseReject,
        errFunc, successFunc, unvalidNodes,
        facade = {
            options : options
        };

    Y.log('_defFn_submit', 'info', 'ITSA-ModelSyncPromise');
        instance._validate(instance.toJSON(), function (validateErr) {
            if (validateErr) {
                facade.error = validateErr;
                facade.src = SUBMIT;
                instance._lazyFireErrorEvent(facade);
                promiseReject(new Error(validateErr));
            }
            else {
                errFunc = function(err) {
                    facade.error = err;
                    facade.src   = SUBMIT;
                    instance._lazyFireErrorEvent(facade);
                    promiseReject(new Error(err));
                };
                successFunc = function(response) {
                    var parsed;
                    e.response = response;
                    parsed = PARSED(response);
                    if (parsed.responseText) {
                        // XMLHttpRequest
                        parsed = parsed.responseText;
                    }
                    if (YObject.keys(parsed).length>0) {
                        e.parsed = parsed;
/*jshint expr:true */
                        // fromInternal is used to suppress Y.ITSAFormModel to notificate changes
                        instance.setAttrs(parsed, (options.fromInternal=true) && options);
/*jshint expr:false */
                    }
                    instance.changed = {};
                    e.promiseResolve(response);
                };
                if ((unvalidNodes=instance.getUnvalidatedUI()) && unvalidNodes.isEmpty()) {
                    if (instance.syncPromise) {
                        // use the syncPromise-layer
                        instance._syncTimeoutPromise(SUBMIT, options).then(
                            successFunc,
                            errFunc
                        );
                    }
                    else {
                        // use the sync-layer
                        instance.sync(SUBMIT, options, function (err, response) {
                            if (err) {
                                errFunc(err);
                            }
                            else {
                                successFunc(response);
                            }
                        });
                    }
                }
                else {
                    // because we have an Y.ITSAFormModel instance, ._intl.unvalidated is available
                    errFunc(instance._intl.unvalidated);
                    instance.fire(VALIDATION_ERROR, {target: instance, nodelist: unvalidNodes, src: SUBMIT});
                }
            }
        });
    return e.promise;
};

/**
 *
 * Default function for the 'uichanged'-event which counts for every UI-formelements (meaning no buttons).
 *
 * @method _defFn_uichanged
 * @param e {EventFacade} Event Facade including:
 * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
 * @param e.value {Date} current value of the property
 * @param e.node {Y.Node} reference to the element-node
 * @param e.nodeid {String} id of the element-node (without '#')
 * @param e.formElement {Object} reference to the form-element
 * @private
 * @protected
 * @since 0.1
 *
*/
ITSAFormModel.prototype._defFn_uichanged = function(e) {
    // should not be called by widgets
    var instance = this,
        formelement = e.formElement,
        attribute = formelement.name,
        type = formelement.type,
        value = e.value,
        node, valid, field;

    Y.log('_defFn_uichanged, attribute  '+formelement.name, 'info', 'ITSAFormModel');
    if (formelement.widget) {
        field = this._getWidgetValueField(type);
        if (typeof field === STRING) {
            instance._updateSimularWidgetUI(e.nodeid, attribute, field, value);
        }
        else {
            YArray.each(
                field,
                function(onefield) {
                    instance._updateSimularWidgetUI(e.nodeid, attribute, onefield, value, true);
                }
            );
        }
    }
    else {
        node = e.node;
        valid = instance._validValue(node, formelement, attribute, value);
        instance._updateSimularUI(node, attribute, value, valid);
        if (instance._lifeUpdate && valid) {
            instance.UIToModel(node.get(ID));
        }
    }
};

/**
 * Search for the primary buttonnode - if defined. Only returns the node if it is found in the DOM.
 *
 * @method _findPrimaryBtnNode
 * @private
 * @return {Y.Node} the button's Node
 * @since 0.2
 */
ITSAFormModel.prototype._findPrimaryBtnNode = function() {
    var formelements = this._FORM_elements,
        foundNode;
    YObject.some(
        formelements,
        function(formelement, nodeid) {
            var primary = formelement.config.primary,
                primaryBtn = (typeof primary === BOOLEAN) && primary;
            foundNode = primaryBtn && Y.one('#'+nodeid);
            return foundNode;
        }
    );
    return foundNode;
};

/**
 * Runs the garbagecollector, cleaning up internal refferences of node's that were once in the dom, but not there anymore
 *
 * @method _garbageCollect
 * @private
 * @protected
 * @since 0.1
 */
ITSAFormModel.prototype._garbageCollect = function() {
    var instance = this,
        timestamp = (new Date()).getTime(),
        attributenodes = instance._ATTRS_nodes,
        formelements = instance._FORM_elements,
        knownNodeIds = instance._knownNodeIds,
        knowdIdsRemoval = [],
        attributenodeids, index, formelement, attribute;

    Y.log('_garbageCollect', 'info', 'ITSAFormModel');
    timestamp -= MS_MIN_TIME_FORMELEMENTS_INDOM_BEFORE_REMOVE;
    YObject.each(
        knownNodeIds,
        function(value, nodeid, obj) {
            if (typeof value === BOOLEAN) {
                // has no timestamp, thus it hasn't been detected as removed from the dom
                if (!Y.one('#'+nodeid)) {
                    // not in the dom anymore --> add a timestamp
                    Y.log('_garbageCollect marked time of node '+nodeid, 'info', 'ITSAFormModel');
                    obj[nodeid] = (new Date()).getTime();
                }
            }
            else {
                // has a timedstamp -- check if it is timedout
                if (value<timestamp) {
                    Y.log('_garbageCollect removed node '+nodeid, 'info', 'ITSAFormModel');
                    formelement = formelements[nodeid];
                    attribute = formelement.name;
                    attributenodeids = attributenodes[attribute];
                    index = attributenodeids && YArray.indexOf(attributenodeids, nodeid);
                    delete formelements[nodeid];
                    if (index>0) {
                        attributenodeids.splice(index, 1);
                    }
                    // now store the nodeid, because it has to be removed from instance._knownNodeIds
                    knowdIdsRemoval.push(nodeid);
                }
            }
        }
    );
    // now remove it from knownNodeIds
    YArray.each(
        knowdIdsRemoval,
        function(nodeid) {
            delete knownNodeIds[nodeid];
        }
    );
};

/**
 * Returns the widgets value. That is, the getter of tha attribute that represents the VALUE (determined by _getWidgetValueField).
 *
 * @method _getWidgetValue
 * @param widget {Widget} the widgetinstance
 * @param type {String|widgetClass} the elementtype to be created. Can also be a widgetclass.
 *                                         --> see ItsaFormElement for the attribute 'type' for further information.
 * @return {String} the valuefield (attribute-name in case of widget).
 * @private
 * @since 0.1
 */
ITSAFormModel.prototype._getWidgetValue = function(widget, type) {
    Y.log('_getWidgetValue', 'info', 'ITSAFormModel');
    if (widget && (type.NAME===EDITORBASE) && widget.itsatoolbar) {
        return widget.itsatoolbar.getContent(); // better cleanedup content
    }
    var field = this._getWidgetValueField(type);
    // In case of multiple fields, they all should be thes same, so we can take the first item of the array.
    return (widget && widget.get((typeof field === STRING) ? field : field[0]));
};

/**
 * Renderes the field or attribute that holds the value. With ordinary form-elements this will be VALUE,
 * but widgets might have a value-property with another name.
 *
 * @method _getWidgetValueField
 * @param type {String|widgetClass} the elementtype to be created. Can also be a widgetclass.
 *                                         --> see ItsaFormElement for the attribute 'type' for further information.
 * @return {String|Array} the valuefield (attribute-name in case of widget). Some Widgets -like ToggleButton- can have different
 * valuefiels: in that case an array is returned.
 * @private
 * @since 0.1
 */
ITSAFormModel.prototype._getWidgetValueField = function(type) {
    Y.log('_getWidgetValueField', 'info', 'ITSAFormModel');
    var iswidget = ((typeof type === FUNCTION) && type.NAME);
    return (iswidget && this._widgetValueFields[type.NAME]) || VALUE;
};

/**
 * Copies the Model-attribute-value into the UI-formelement.
 *
 * @method _modelToUI
 * @param [nodeid] {String} nodeid of the formelement (without '#'), when left empty, all formelement-properties are set.
 * @private
 * @since 0.1
 *
*/
ITSAFormModel.prototype._modelToUI = function(nodeid) {
    var instance = this,
        formElement, formElements, node, value, attribute, widget, type, dateformat, field;
    Y.log('_modelToUI', 'info', 'ITSAFormModel');
    formElements = instance._FORM_elements;
    formElement = nodeid && formElements[nodeid];
    if (formElement && (node=Y.one('#'+nodeid)) && node.getAttribute(DATA_MODELATTRIBUTE)) {
        widget = formElement.widget;
        attribute = formElement.name;
        value = instance.get(attribute, value) || '';
        if (widget) {
            field = this._getWidgetValueField(formElement.type);
            widget.set(((typeof field === STRING) ? field : field[0]), value, {fromInternal: true});
        }
        else {
            type = formElement.type;
            if (instance._dateTimeTypes[type]) {
                dateformat = formElement.config.format;
                instance._updateDateTimeUI(formElement.name, value, type, dateformat);
            }
            else {
                node.set(VALUE, value);
            }
        }
    }
    else if (!nodeid) {
        // save all attributes
        YObject.each(
            instance._FORM_elements,
            function(formelement, nodeid) {
                instance._modelToUI(nodeid);
            }
        );
    }
};

/**
 * Cleaning up all widgettargets
 *
 * @method _removeTargets
 * @private
 * @since 0.1
 *
*/
ITSAFormModel.prototype._removeTargets = function() {
    var instance = this;

    Y.log('_removeTargets', 'info', 'ITSAFormModel');
    YObject.each(
        instance._FORM_elements,
        function(formElement) {
            var widget = formElement.widget;
            if (widget) {
                widget.removeTarget(instance);
            }
        }
    );
};

/**
 * Removes the node-attribute 'data-valid' from all UI-elements that belong to this modelinstance.
 *
 * @method _removeValidation
 * @private
 * @since 0.1
 */
ITSAFormModel.prototype._removeValidation  = function() {
    var instance = this;

    Y.log('_removeValidation', 'info', 'ITSAFormModel');
    YObject.each(
        instance._FORM_elements,
        function(formelement) {
            var node = Y.one('#'+formelement.nodeid);
/*jshint expr:true */
            node && instance._setNodeValidation(node, true);
/*jshint expr:false */
        }
    );
};

/**
 *
 * Renderes a formelement-button. In order to be able to take action once the button is clicked, you can use config.value,
 * otherwise 'labelHTML' will automaticly be the e.value inside the eventlistener. By specifying 'config',
 * the button can be configured in more detail.
 * <br />Imagebuttons can be set through 'labelHTML', f.i.: '<i class="icon-press"></i> press me'
 *
 * @method _renderBtn
 * @private
 * @param labelHTML {String} Text on the button (equals buttonName whennot specified).
 * @param [config] {Object} config (which that is passed through to Y.ITSAFormElement)
 * @param [config.value] {String} returnvalue which is available inside the eventlistener through e.value
 * @param [config.data] {String} when wanting to add extra data to the button, f.i. 'data-someinfo="somedata"'
 * @param [config.disabled=false] {Boolean}
 * @param [config.hidden=false] {Boolean}
 * @param [config.hotkey] {String|Object} character that act as a hotkey: 'alt+char' will focus and click the button.
 *                                 The hotkey-character will be marked with the css-class 'itsa-hotkey' (span-element), which underscores by default, but can be overruled.
 *                                 If you want to Internationize, the you need to supply an object where the properties are the language-tag and the values a string (character).
 *                                 F.i. {us: 'a', nl: 'o'}. When Internationize, there will be no hotkey when the used language is not found in the hotkey-object.
 * @param [config.classname] for adding extra classnames to the button
 * @param [config.focusable=true] {Boolean}
 * @param [config.primary=false] {Boolean} making it the primary-button
 * @param [config.spinbusy=false] {Boolean} making a buttonicon to spin if busy
 * @param [config.tooltip] {String} tooltip when Y.Tipsy or Y.Tipsy is used
 * @param [buttontype] {String} type of button that needs to be rendered
 * @return {String} stringified version of the button which can be inserted in the dom.
 * @since 0.1
 *
 */
ITSAFormModel.prototype._renderBtn = function(labelHTML, config, buttontype) {
    var instance = this,
        formelements = instance._FORM_elements,
        knownNodeIds = instance._knownNodeIds,
        formbutton, nodeid;

    Y.log('renderBtn', 'info', 'ITSAFormModel');
/*jshint expr:true */
    config || (config = {});
    buttontype || (buttontype = BUTTON);
    labelHTML || (labelHTML = buttontype);
    config[DATA] || (config[DATA] = '');
    config[VALUE] || (config[VALUE]=buttontype);
/*jshint expr:false */
    config[DATA] += ' '+DATA_BUTTON_SUBTYPE+'="'+buttontype+'"';
    config.buttontype = BUTTON;
    config.labelHTML = labelHTML;
    formbutton = ITSAFormElement.getElement(BUTTON, config);
    nodeid = formbutton.nodeid;
    // store in instance._FORM_elements
    formelements[nodeid] = formbutton;
    // make sure elements gets removed from instance._FORM_elements
    // when the element is inserted in the dom and gets removed from the dom again
    YNode.availablePromise('#'+nodeid, MS_TIME_TO_INSERT).then(
        function(node) {
            if (knownNodeIds[nodeid]) {
                // was rendered before --> we need to replace it by an errornode
                Y.log('renderBtn --> nodeid '+nodeid+' for button '+config.labelHTML+' was already inserted in the dom: won\'t be rendered again', 'warn', 'ITSAFormModel');
                node.insert(DUPLICATE_NODE, 'replace');
            }
            else {
                knownNodeIds[nodeid] = true;
            }
        }
    );
    return formbutton.html;
};

/**
 *
 * Updates all Date-Time UI-elements (its time-value on the span-element that represent the time) when a datetime-picker changes its value.
 * Has only effect on the label --> the pickervalue is not stored in the modelsattribute by this function.
 *
 * @method _updateDateTimeUI
 * @param attribute {String} attribute that is changed by a UI-element
 * @param newdate {Date} the new date-time
 * @param type {String} which type (DATE, TIME, or DATETIME)
 * @param dateformat {String} the format on the span-element that represent the time
 * @private
 * @since 0.1
 *
*/
ITSAFormModel.prototype._updateDateTimeUI = function(attribute, newdate, type, dateformat) {
    var instance = this,
        attributenodes = instance._ATTRS_nodes[attribute];
    if (attributenodes) {
        if (!dateformat) {
            if (type===DATE) {
                dateformat = '%x';
            }
            else if (type===TIME) {
                dateformat = '%X';
            }
            else {
                dateformat = '%x %X';
            }
        }
        YArray.each(
            attributenodes,
            function(nodeid) {
                var node = Y.one('#'+nodeid),
                    labelnode = Y.one('span[data-for="'+nodeid+'"]'),
                    validdate = Lang.isDate(newdate);
/*jshint expr:true */
                validdate && node && node.set(VALUE, newdate.getTime());
                labelnode && labelnode.set('text', validdate ? Y.Date.format(newdate, {format: dateformat}) : ('invalid Date: '+newdate));
/*jshint expr:false */
            }
        );
    }
};

/**
 *
 * Updates all simular non-widget UI-elements when one of its value changes.
 *
 * @method _updateSimularUI
 * @param changedNode {Node} the formelement-node that changed value
 * @param attribute {String} attribute that is changed by a UI-element
 * @param newvalue {String} the new value
 * @param valid {Boolean|null} whether the new value is validated
 * @private
 * @since 0.1
 *
*/
ITSAFormModel.prototype._updateSimularUI = function(changedNode, attribute, newvalue, valid) {
    var instance = this,
        attributenodes = instance._ATTRS_nodes[attribute];

    Y.log('_updateSimularUI changedNode '+changedNode+' attribute: '+attribute+' newvalue:'+newvalue, 'info', 'ITSAFormModel');
    if (attributenodes) {
      YArray.each(
          attributenodes,
          function(nodeid) {
              var node = Y.one('#'+nodeid);
              if (node) {
/*jshint expr:true */
                  (node!==changedNode) && node.set(VALUE, newvalue);
/*jshint expr:false */
                 instance._setNodeValidation(node, valid);
              }
          }
      );
    }
};

/**
 * Sets node validation-state by specifying 'data-valid' true or false. Also sets valid- or invalid-tooltip.
 *
 * @method _setNodeValidation
 * @param node {Y.Node} node which validation should be set
 * @param validated {Boolean} validated or not
 * @param [tooltip] {String} to force a specific tooltip-message
 * @private
 * @since 0.1
*/
ITSAFormModel.prototype._setNodeValidation  = function(node, validated, tooltip) {
    var newContent;

    Y.log('_setNodeValidation node '+node.get("id")+' --> '+validated, 'info', 'ITSAFormModel');
    node.setAttribute(DATA+'-valid', validated);
    newContent = tooltip || node.getAttribute(DATA_CONTENT + (validated ? 'valid' : 'invalid'));
/*jshint expr:true */
    !validated && !tooltip && (newContent==='') && (newContent=this._intl[INPUT_REQUIRED]);
/*jshint expr:false */
    if (newContent) {
        node.setAttribute(DATA_CONTENT, newContent);
    }
    else {
        node.removeAttribute(DATA_CONTENT);
    }
};

/**
 *
 * Updates all Widget UI-elements when a widget changes its value.
 *
 * @method _updateSimularWidgetUI
 * @param changedNodeId {String} the nodeid (without '#') of the widget's container that caused the change
 * @param attribute {String} attribute that is changed by a UI-element
 * @param valueattribute {String} the widgets value-attribute
 * @param value {Any} widgets new value
 * @private
 * @since 0.1
 *
*/
ITSAFormModel.prototype._updateSimularWidgetUI = function(changedNodeId, attribute, valueattribute, value, multiplefields) {
    var instance = this,
        attributenodes = instance._ATTRS_nodes[attribute],
        formelement, widget;
    Y.log('_updateSimularWidgetUI changedNodeId '+changedNodeId+' attribute: '+attribute+' valueattribute:'+valueattribute+' newvalue:'+value, 'info', 'ITSAFormModel');
    if (attributenodes) {
        YArray.each(
            attributenodes,
            function(nodeid) {
                // update widgetvalue
                formelement = instance._FORM_elements[nodeid];
                widget = formelement && formelement.widget;
                if ((nodeid!==changedNodeId) || multiplefields) { // in case of multiplefields always set the attribute, to make sure are fields are set
/*jshint expr:true */
                    widget && widget.set(valueattribute, value);
/*jshint expr:false */
                }
                // in case of slider: update valueattribute --> do this for ALL sliders
                if (widget && (formelement.type.NAME===SLIDER)) {
                    var labelnode = Y.one('span[data-for="'+nodeid+'"]');
/*jshint expr:true */
                    labelnode && labelnode.set('text', value);
/*jshint expr:false */
                }
            }
        );
    }
    if (instance._lifeUpdate) {
        instance.UIToModel(changedNodeId);
    }
};

/**
 * Checks whether the UI-value of a formelement has validated value. Not meant for widgets
 *
 * @method _validValue
 * @param node {Y.Node} node of the formelement
 * @param formelement {Object} item from the internal list instance._FORM_elements
 * @param attribute {String} name of the attribute
 * @param value {String} value of formelement
 * @private
 * @return {Boolean} true when valid
 * @since 0.1
 */
ITSAFormModel.prototype._validValue = function(node, formelement, attribute, value) {
    var instance = this,
        type = formelement.type,
        typeok = ((type===DATE) || (type===TIME) || (type===DATETIME) || (type==='checkbox')),
        attrconfig, attrValidationFunc, nodePattern, validByAttrFunc, validByPattern, nodeRequired, formconfigrequired, formconfig, emptyNodeOk, validByRequired;

    Y.log('_validValue attribute  '+attribute, 'info', 'ITSAFormModel');

    if (!typeok) { // typeok are types that are always is ok, for it was created by the datetimepicker, or a checkbox
        // because 'required' is removed from the nodeattribute, we need to check this from formconfig
        attrconfig = instance._getAttrCfg(attribute);
        formconfig = attrconfig.formconfig;
        formconfigrequired = formconfig && formconfig.required;
        nodeRequired = ((typeof formconfigrequired === BOOLEAN) && formconfigrequired) || (type==='password');
        emptyNodeOk = ((value==='') && !nodeRequired);
        if (!emptyNodeOk) {
            attrValidationFunc = attrconfig.validator;
            nodePattern = node.getAttribute(DATA+'-pattern');
            validByAttrFunc = !attrValidationFunc || attrValidationFunc((type===NUMBER ? (formelement.config.digits ? parseFloat(value) : parseInt(value, 10)) : value));
/*jshint expr:true */
            (typeof validByAttrFunc === BOOLEAN) || (validByAttrFunc=false);
/*jshint expr:false */
            validByPattern = !nodePattern || new RegExp(nodePattern, "i").test(value);
            validByRequired = ((value!=='') || !nodeRequired);
        }
    }
    Y.log('attribute is validated '+(typeok || emptyNodeOk || (validByAttrFunc && validByPattern && validByRequired)),
          (typeok || emptyNodeOk || (validByAttrFunc && validByPattern && validByRequired)) ? 'info' : 'warn', 'ITSAFormModel');
    return typeok || emptyNodeOk || (validByAttrFunc && validByPattern && validByRequired);
};

ITSAFormModel.prototype._widgetValueFields.itsacheckbox = 'checked';
ITSAFormModel.prototype._widgetValueFields.itsacheckboxgroup = 'checked';
ITSAFormModel.prototype._widgetValueFields.toggleButton = ['checked','pressed'];
ITSAFormModel.prototype._widgetValueFields.editorBase = 'content';

//===================================================================
//===================================================================

// Define synthetic events to Y.Event. Choosing not to document these by altering the commentcode
/*
  * Node-event fired when the normal button is clicked.
  * that is: generated through renderBtn() and not a specified button like 'save', or 'submit'.
  *
  * @event button:click
  * @param e {EventFacade} Event Facade including:
  * @param e.target {Y.Node} The ButtonNode that was clicked
  *
*/

/*
  * Node-event fired when the destroy-button is clicked.
  *
  * @event destroy:click
  * @param e {EventFacade} Event Facade including:
  * @param e.target {Y.Node} The ButtonNode that was clicked
  *
*/

/*
  * Node-event fired when the save-button is clicked.
  *
  * @event save:click
  * @param e {EventFacade} Event Facade including:
  * @param e.target {Y.Node} The ButtonNode that was clicked
  *
*/

YArray.each(
    [BUTTON, SAVE, DESTROY, REMOVE, LOAD],
    function(eventtype) {
        var conf = {
            on : function(node, subscription, notifier) {
                // To make detaching easy, a common pattern is to add the subscription
                // for the supporting DOM event to the subscription object passed in.
                // This is then referenced in the detach() method below.
                subscription._handle = node.on(CLICK, function (e) {
                    var targetNode = e.target;
                    // It could be that targetNode is an innerNode of the button! (in case of imagebuttons) --> we do a 1 level up check:
                    if (targetNode && (targetNode.get('tagName')!=='BUTTON')) {
                        targetNode = targetNode.get('parentNode');
                        e.target = targetNode;
                    }
                    if (targetNode && ((targetNode.getAttribute(DATA_BUTTON_TYPE)===BUTTON) && (targetNode.getAttribute(DATA_BUTTON_SUBTYPE)===eventtype))) {
                        // The notifier triggers the subscriptions to be executed.
                        // Pass its fire() method the triggering DOM event facade
                        notifier.fire(e);
                    }
                });
            },
            // The logic executed when the 'tripleclick' subscription is `detach()`ed
            detach : function(node, subscription) {
                // Clean up supporting DOM subscriptions and other external hooks
                // when the synthetic event subscription is detached.
                subscription._handle.detach();
            }
        };
        conf.delegate = conf.on;
        conf.detachDelegate = conf.detach;
        Y.Event.define(eventtype+':'+CLICK, conf);
    }
);

}, 'gallery-2014.02.26-18-54', {
    "requires": [
        "yui-base",
        "event-valuechange",
        "intl",
        "base-base",
        "attribute-base",
        "attribute-extras",
        "base-build",
        "selector-css2",
        "model",
        "datatype-date-format",
        "node-base",
        "node-style",
        "node-core",
        "oop",
        "yui-later",
        "node-event-delegate",
        "node-event-simulate",
        "event-synthetic",
        "event-base",
        "event-custom-base",
        "event-custom",
        "json-parse",
        "gallery-itsanodepromise",
        "gallery-itsamodulesloadedpromise",
        "gallery-itsadatetimepicker",
        "gallery-itsamodelsyncpromise",
        "gallery-itsaformelement"
    ],
    "lang": [
        "ar",
        "bg",
        "bs",
        "cs",
        "da",
        "de",
        "en",
        "es",
        "fa",
        "fi",
        "fr",
        "he",
        "hi",
        "hr",
        "hu",
        "it",
        "ja",
        "nb",
        "nl",
        "pl",
        "pt",
        "ru",
        "sk",
        "sr",
        "sv",
        "uk",
        "zh"
    ]
});
