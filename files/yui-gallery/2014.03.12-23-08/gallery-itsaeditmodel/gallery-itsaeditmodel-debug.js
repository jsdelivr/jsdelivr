YUI.add('gallery-itsaeditmodel', function (Y, NAME) {

'use strict';

/**
 * ITSAEditModel Plugin
 *
 *
 * Plugin for Y.Model that extends Y.Model-instances into having editable properties.
 * After pluged-in, Each property can be rendered into a form-element by using: <i>yourModel.itsaeditmodel.formelement()</i>
 * You can also retreive a copy of the model's attributes with: <i>yourModel.itsaeditmodel.toJSON()</i>
 *
 * Use the attribute 'template' to specify how the rendering will look like.
 *
 *
 * @module gallery-itsaeditmodel
 * @class ITSAEditModel
 * @extends Plugin.Base
 * @constructor
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://itsasbreuk.nl</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

var body = Y.one('body'),
    Lang = Y.Lang,
    YArray = Y.Array,
    YObject = Y.Object,
    UNDEFINED_VALUE = 'undefined value',
    MESSAGE_WARN_MODELCHANGED = 'The data you are editing has been changed from outside the form. '+
                                'If you save your data, then these former changed will be overridden.',
    EVT_DATETIMEPICKER_CLICK = 'datetimepickerclick',
    ITSABUTTON_DATETIME_CLASS = 'itsa-button-datetime',
    ITSAFORMELEMENT_DATE_CLASS = 'itsa-datetimepicker-icondate',
    ITSAFORMELEMENT_TIME_CLASS = 'itsa-datetimepicker-icontime',
    ITSAFORMELEMENT_DATETIME_CLASS = 'itsa-datetimepicker-icondatetime',
    FORMELEMENT_CLASS = 'yui3-itsaformelement',
    ITSAFORMELEMENT_BUTTONTYPE_CLASS = FORMELEMENT_CLASS + '-button',
    ITSAFORMELEMENT_LIFECHANGE_CLASS = FORMELEMENT_CLASS + '-lifechange',
    ITSAFORMELEMENT_CHANGED_CLASS = FORMELEMENT_CLASS + '-changed',
    ITSAFORMELEMENT_ENTERNEXTFIELD_CLASS = FORMELEMENT_CLASS + '-enternextfield',
    BUTTON_BUTTON_CLASS = FORMELEMENT_CLASS + '-button',
    ADD_BUTTON_CLASS = FORMELEMENT_CLASS + '-add',
    SUBMIT_BUTTON_CLASS = FORMELEMENT_CLASS + '-submit',
    RESET_BUTTON_CLASS = FORMELEMENT_CLASS + '-reset',
    SAVE_BUTTON_CLASS = FORMELEMENT_CLASS + '-save',
    DESTROY_BUTTON_CLASS = FORMELEMENT_CLASS + '-destroy',
    STOPEDIT_BUTTON_CLASS = FORMELEMENT_CLASS + '-stopedit',
    DEFAULTCONFIG = {
        name : 'undefined-name',
        type : '',
        value : '',
        keyValidation : null,
        validation : null,
        validationMessage : '',
        autoCorrection : null,
        className : null,
        dateFormat : null,
        initialFocus : false,
        selectOnFocus : false,
        widgetConfig : {}
    },
    GET_PROPERTY_FROM_CLASS = function(className) {
        var regexp = /yui3-itsaformelement-property-(\w+)/;

        Y.log('GET_PROPERTY_FROM_CLASS', 'info', 'Itsa-EditModel');
        return regexp.test(className) ? RegExp.$1 : null;
    },
    EVT_INTERNAL = 'internal',
    // next five events are declared within the initialiser:
    EVT_SUBMIT_CLICK = 'submitclick',
    EVT_ADD_CLICK = 'addclick',
    EVT_SAVE_CLICK = 'saveclick',
    EVT_RESET_CLICK = 'resetclick',
    EVT_DESTROY_CLICK = 'destroyclick',
    EVT_STOPEDIT_CLICK = 'stopeditclick',

   /**
     * Fired to be caught by ItsaDialog. This event occurs when there is a warning (for example Model changed outside the editview).
     * @event focusnext
     * @param e {EventFacade} Event Facade including:
     * @param e.message {String} The warningmessage.
     * @since 0.1
    **/
    EVT_FOCUS_NEXT = 'focusnext',
   /**
     * Fired to be caught by ItsaDialog. This event occurs when there is a warning (for example Model changed outside the editview).
     * @event dialog:warn
     * @param e {EventFacade} Event Facade including:
     * @param e.message {String} The warningmessage.
     * @since 0.1
    **/
    EVT_DIALOG_WARN = 'dialog:warn',
    /**
      * Event fired after an input-elements value is changed.
      * @event inputchange
      * @param e {EventFacade} Event Facade including:
      * @param e.inputNode {Y.Node} The Input-Node that was clicked
      * @param e.elementId {String} Id of the Node that chancged value.
      * @param e.property {String} The property-name of the Object (or the Model's attribute-name)
    **/
    EVT_INPUT_CHANGE = 'inputchange',
    /**
      * Event fired when an input-elements value is changed (life, without blurring): valuechange.
      * @event inputvaluechange
      * @param e {EventFacade} Event Facade including:
      * @param e.inputNode {Y.Node} The Input-Node that was clicked
      * @param e.elementId {String} Id of the Node that chancged value.
      * @param e.property {String} The property-name of the Object (or the Model's attribute-name)
    **/
    EVT_VALUE_CHANGE = 'inputvaluechange',
    /**
      * Event fired when a normal button (elementtype) is clicked.
      * @event buttonclick
      * @param e {EventFacade} Event Facade including:
      * @param e.buttonNode {Y.Node} The Button-Node that was clicked
      * @param e.property {String} The property-name of the Object (or the Model's attribute-name)
      * @param [e.model] {Y.Model} This modelinstance.
    **/
    EVT_BUTTON_CLICK = 'buttonclick',
   /**
     * Fired after the plugin is pluggedin and ready to be referenced by the host. This is LATER than after the 'init'-event,
     * because the latter will be fired before the namespace Model.itsaeditmodel exists.
     * @event pluggedin
     * @since 0.1
    **/
    EVT_PLUGGEDIN = 'pluggedin';

Y.namespace('Plugin').ITSAEditModel = Y.Base.create('itsaeditmodel', Y.Plugin.Base, [], {

        /**
         * Sets up the toolbar during initialisation. Calls render() as soon as the hosts-editorframe is ready
         *
         * @method initializer
         * @protected
         * @since 0.1
         */
        initializer : function() {
            var instance = this,
                host;

            Y.log('initializer', 'info', 'Itsa-EditModel');
           // -- Public Properties -------------------------------------------------

           /**
            * The plugin's host, which should be a Model-instance (or descendent)
            * @property host
            * @default host-instance
            * @type Y.Model
            */
            instance.host = instance.get('host');

           /**
            * Internal list that holds event-references
            * @property _eventhandlers
            * @default []
            * @private
            * @type Array
            */
            instance._eventhandlers = [];

           /**
            * An instance of Y.ITSAFormElement that is used to generate the form-html of the elements.
            * @property _itsaformelement
            * @default null
            * @private
            * @type Y.ITSAFormElement-instance
            */
            instance._itsaformelement = null;

           /**
            * internal backup of all property-configs
            * @property _configAttrs
            * @default {}
            * @private
            * @type Object
            */
            instance._configAttrs = {};

           /**
            * internal backup of all rendered node-id's
            * @property _elementIds
            * @default {}
            * @private
            * @type Object
            */
            instance._elementIds = {};

           /**
            * internal flag that tells whether automaicly saving needs to happen in case properties have changed
            * @property _needAutoSaved
            * @default false
            * @private
            * @type Boolean
            */
            instance._needAutoSaved = false;

           /**
            * Internal reference to Y.later timerobject for autosaving
            * @property _autoSaveTimer
            * @default null
            * @private
            * @type timer-Object
            */
            instance._autoSaveTimer = null;

           /**
            * Internal reference to Y.later timerobject that is used to fire a 'pluggedin'-event once 'itsaeditmodel' is available on the host.
            * @property _fireEventTimer
            * @default null
            * @private
            * @type timer-Object
            */
            instance._fireEventTimer = null;

            host = instance.host;
            instance._itsaformelement = new Y.ITSAFormElement();
            /**
              * Event fired when the submit-button is clicked.
              * defaultFunction = _defPluginSubmitFn
              * @event submitclick
              * @param e {EventFacade} Event Facade including:
              * @param e.currentTarget {Y.Node} The Button-Node that was clicked
              * @param e.property {String} The property-name of the Object (or the Model's attribute-name)
            **/
            host.publish(
                EVT_SUBMIT_CLICK,
                {
                    defaultFn: Y.rbind(instance._defPluginSubmitFn, instance),
                    emitFacade: true
                }
            );
            /**
              * Event fired when the add-button is clicked.
              * defaultFunction = _defPluginAddFn
              * @event addclick
              * @param e {EventFacade} Event Facade including:
              * @param e.newModel {Y.Model} The new model-instance.
              * @param e.currentTarget {Y.Node} The Button-Node that was clicked
              * @param e.property {String} The property-name of the Object (or the Model's attribute-name)
            **/
            host.publish(
                EVT_ADD_CLICK,
                {
                    defaultFn: Y.rbind(instance._defPluginAddFn, instance),
                    emitFacade: true
                }
            );
            /**
              * Event fired when the reset-button is clicked.
              * defaultFunction = _defPluginResetFn
              * @event resetclick
              * @param e {EventFacade} Event Facade including:
              * @param e.currentTarget {Y.Node} The Button-Node that was clicked
              * @param e.property {String} The property-name of the Object (or the Model's attribute-name)
            **/
            host.publish(
                EVT_RESET_CLICK,
                {
                    defaultFn: Y.rbind(instance._defPluginResetFn, instance),
                    emitFacade: true
                }
            );
            /**
              * Event fired when the save-button is clicked.
              * defaultFunction = _defPluginSaveFn
              * @event saveclick
              * @param e {EventFacade} Event Facade including:
              * @param e.currentTarget {Y.Node} The Button-Node that was clicked
              * @param e.property {String} The property-name of the Object (or the Model's attribute-name)
            **/
            host.publish(
                EVT_SAVE_CLICK,
                {
                    defaultFn: Y.rbind(instance._defPluginSaveFn, instance),
                    emitFacade: true
                }
            );
            /**
              * Event fired when the destroy-button is clicked.
              * defaultFunction = _defPluginDestroyFn
              * @event destroyclick
              * @param e {EventFacade} Event Facade including:
              * @param e.currentTarget {Y.Node} The Button-Node that was clicked
              * @param e.property {String} The property-name of the Object (or the Model's attribute-name)
            **/
            host.publish(
                EVT_DESTROY_CLICK,
                {
                    // DO NOT use _defDestroyFn --> this is used by the model itself and would make _defDestroyFn of the model
                    // to be excecuted when the plugin is unplugged (!????)
                    defaultFn: Y.rbind(instance._defPluginDestroyFn, instance),
                    emitFacade: true
                }
            );
            /**
              * Event fired when the stopedit-button is clicked.
              * defaultFunction = _defPluginStopEditFn
              * @event stopeditclick
              * @param e {EventFacade} Event Facade including:
              * @param e.currentTarget {Y.Node} The Button-Node that was clicked
              * @param e.property {String} The property-name of the Object (or the Model's attribute-name)
            **/
            host.publish(
                EVT_STOPEDIT_CLICK,
                {
                    // DO NOT use _defDestroyFn --> this is used by the model itself and would make _defDestroyFn of the model
                    // to be excecuted when the plugin is unplugged (!????)
                    defaultFn: Y.rbind(instance._defPluginStopEditFn, instance),
                    emitFacade: true
                }
            );
            instance._bindUI();
            instance.addTarget(host);
            // now a VERY tricky one...
            // We need to fire an event that tells the plugin is pluged in, but it seemed that when listening in the host,
            // host.itsaeditmodel will be read imediately after the event fired --> this seems to be BEFORE the event is registred!!!
            // So, we wait until the real registering is finished and THEN fire the event!
            instance._fireEventTimer = Y.later(
                50,
                instance,
                function() {
                    if (host.itsaeditmodel) {
                        instance._fireEventTimer.cancel();
                        instance.fire(EVT_PLUGGEDIN);
                    }
                },
                null,
                true
            );
        },

        /**
         * Renderes a button to a formelement. You must specify 'config', so the renderer knows at least its type.
         *
         * @method getButton
         * @param buttonText {String} Text on the button.
         * @param config {String} config that is passed through to ItsaFormElement
         * @param config.type {String} Property-type --> see ItsaFormElement for the attribute 'type' for further information.
         * @param [config.className] {String} Additional className that is passed on the value, during rendering.
         * @param [config.initialFocus] {Boolean} Whether this element should have the initial focus.
         * @param [config.selectOnFocus] {Boolean} Whether this element should completely be selected when it gets focus.
         * @return {String} property (or attributes), rendered as a form-element. The rendered String should be added to the DOM yourself.
         * @since 0.1
         */
        getButton : function(buttonText, config) {
            var instance = this,
                value = buttonText,
                name = buttonText.replace(/ /g,'_'),
                useConfig = Y.merge(DEFAULTCONFIG, config || {}, {name: name, value: value}),
                type = useConfig.type,
                renderedFormElement, nodeId;

            Y.log('getButton', 'info', 'Itsa-EditModel');
            if (name && config && ((type==='button') || (type==='reset') || (type==='submit') || (type==='save') ||
                                   (type==='destroy') || (type==='stopedit'))) {
                instance._configAttrs[name] = useConfig;
                if (!instance._elementIds[name]) {
                    instance._elementIds[name] = Y.guid();
                }
                nodeId = instance._elementIds[name];
                renderedFormElement = instance._itsaformelement.render(useConfig, nodeId);
                // after rendering we are sure definitely sure what type we have (even if not specified)
                if (instance._isDateTimeType(useConfig.type)) {
                    Y.use('gallery-itsadatetimepicker');
                }
            }
            else {
                renderedFormElement = '';
            }
            return renderedFormElement;
        },

        /**
         * Renderes the property (Model's attribute) into a formelement. You must specify 'config', so the renderer knows at least its type.
         * Only call this method for existing attributes. If you need buttons, you can use 'getButton'.
         *
         * @method getElement
         * @param propertyName {String} the property (or attribute in case of Model) which should be rendered to a formelement
         * @param config {String} config that is passed through to ItsaFormElement
         * @param config.type {String} Property-type --> see ItsaFormElement for the attribute 'type' for further information.
         * @param [config.keyValidation] {Function} Validation during every keypress.
         * @param [config.validation] {Function} Validation after changing the value (onblur). The function should return true or false.
         * @param [config.validationMessage] {String} The message that will be returned on a validationerror.
         * @param [config.autoCorrection] {Function} If set, inputvalue will be replaced by the returnvalue of this function.
         * @param [config.className] {String} Additional className that is passed on the value, during rendering.
         * @param [config.dateFormat] {String} To format a Date-value.
         * @param [config.initialFocus] {Boolean} Whether this element should have the initial focus.
         * @param [config.selectOnFocus] {Boolean} Whether this element should completely be selected when it gets focus.
         * @param [config.widgetConfig] {Object} Config that will be added to the underlying widget (in case of Date/Time values).
         * @param [predefValue] {Any} In case you don't want the current value, but need a rendered String based on a different predefined value.
         * @return {String} property (or attributes), rendered as a form-element. The rendered String should be added to the DOM yourself.
         * @since 0.1
         */
        getElement : function(propertyName, config, predefValue) {
            var instance = this,
                value = predefValue || instance.host.get(propertyName),
                useConfig = Y.merge(DEFAULTCONFIG, config || {}, {name: propertyName, value: value}),
                renderedFormElement, nodeId;

            Y.log('getElement', 'info', 'Itsa-EditModel');
            if (propertyName && config) {
                instance._configAttrs[propertyName] = useConfig;
                if (!instance._elementIds[propertyName]) {
                    instance._elementIds[propertyName] = Y.guid();
                }
                nodeId = instance._elementIds[propertyName];
                renderedFormElement = instance._itsaformelement.render(useConfig, nodeId);
                // after rendering we are sure definitely sure what type we have (even if not specified)
                if (instance._isDateTimeType(useConfig.type)) {
                    Y.use('gallery-itsadatetimepicker');
                }
            }
            else {
                renderedFormElement = '';
            }
            return renderedFormElement;
        },

       /**
        * Saves the editable field to the model and saves the model to the server.
        * It is actually the same method as savePromise (gallery-itsamodelsyncpromise), with
        * the exception that the editable fields are first synced to the model.
        *
        * This method delegates to the `sync()` method to perform the actual save
        * operation, which is an asynchronous action. Specify a _callback_ function to
        * be notified of success or failure.
        *
        * A successful save operation will fire a `save` event, while an unsuccessful
        * save operation will fire an `error` event with the `src` value "save".
        *
        * If the save operation succeeds and one or more of the attributes returned in
        * the server's response differ from this model's current attributes, a
        * `change` event will be fired.
        *
        * @method savePromise
        * @param {Object} [options] Options to be passed to `sync()` and to `set()`
        *     when setting synced attributes. It's up to the custom sync implementation
        *     to determine what options it supports or requires, if any.
        *  @param {Function} [callback] Called when the sync operation finishes.
        *     @param {Error|null} callback.err If an error occurred or validation
        *     failed, this parameter will contain the error. If the sync operation
        *     succeeded, _err_ will be `null`.
        *     @param {Any} callback.response The server's response. This value will
        *     be passed to the `parse()` method, which is expected to parse it and
        *     return an attribute hash.
        * @return {Y.Promise} promised response --> resolve(response, options) OR reject(reason).
        **/
        savePromise : function(options) {
            var instance = this,
                updateMode = instance.get('updateMode');

            Y.log('savePromise', 'info', 'Itsa-EditModel');
            instance._needAutoSaved = false;
            if (updateMode!==3) {
                instance._editFieldsToModel();
            }
            return instance.host.savePromise(options);
        },

       /**
         * Saves the editable field to the model and submits the model to the server.
         * It is actually the same method as submitPromise (gallery-itsamodelsyncpromise), with
         * the exception that the editable fields are first synced to the model.
         *
         * This method delegates to the `sync()` method to perform the actual submit
         * operation, which is Y.Promise. Read the Promise.then() and look for resolve(response, options) OR reject(reason).
         *
         * A successful submit-operation will also fire a `submit` event, while an unsuccessful
         * submit operation will fire an `error` event with the `src` value "submit".
         *
         * <b>CAUTION</b> The sync-method MUST call its callback-function to make the promised resolved.
         * @method submitPromise
         * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
         *                 implementation to determine what options it supports or requires, if any.
         * @return {Y.Promise} promised response --> resolve(response, options) OR reject(reason).
        **/
        submitPromise: function(options) {
            var instance = this,
                updateMode = instance.get('updateMode');

            Y.log('submitPromise', 'info', 'Itsa-EditModel');
            instance._needAutoSaved = false;
            if (updateMode!==3) {
                instance._editFieldsToModel();
            }
            return instance.host.submitPromise(options);
        },

        /**
         * Renderes a copy of all Model's attributes.
         * Should you omit 'configAttrs' then the renderer will try to find out the types automaticly.
         *
         * @method toJSON
         * @param configAttrs {Object} Every property of the host object/model can be defined as a property of configAttrs as well.
         * The value should also be an object: the config of the property that is passed to the ITSAFormElement.
         * @param configAttrs.hostProperty1 {Object} config of hostProperty1 (as example, you should use a real property here)
         * @param [configAttrs.hostProperty2] {Object} config of hostProperty2 (as example, you should use a real property here)
         * @param [configAttrs.hostProperty3] {Object} config of hostProperty3 (as example, you should use a real property here)
         * @return {Object} Copy of the host's objects or model's attributes, rendered as form-elements.
         * The rendered String should be added to the DOM yourself.
         * @since 0.1
         */
        toJSON : function(configAttrs) {
            var instance = this,
                host = instance.host,
                allproperties, useConfig, nodeId, mergedConfigAttrs;

            Y.log('toJSON', 'info', 'Itsa-EditModel');
            if (configAttrs) {
                // we NEED to use clone() and NOT merge()
                // In case of more simultanious instances, they must not have the same source or they would interfere
                mergedConfigAttrs = Y.clone(configAttrs);
                allproperties = Y.merge(host.getAttrs());
                // now modify all the property-values into formelements
                YObject.each(
                    allproperties,
                    function(value, key, object) {
                        useConfig = Y.merge(DEFAULTCONFIG, (mergedConfigAttrs && mergedConfigAttrs[key]) || {}, {name: key, value: value});
                        if (mergedConfigAttrs[key]) {
                            mergedConfigAttrs[key].name = key;
                            mergedConfigAttrs[key].value = value;
                            if (!instance._elementIds[key]) {
                                instance._elementIds[key] = Y.guid();
                            }
                            nodeId = instance._elementIds[key];
                            object[key] = instance._itsaformelement.render(useConfig, nodeId);
                        }
                        else {
                            delete object[key];
                        }
                    }
                );
                // Next, we need to look for buttons tht are not part of the attributes
                YObject.each(
                    mergedConfigAttrs,
                    function(config, key) {
                        var type = config.type;
                        if ((type==='button') || (type==='reset') || (type==='submit') || (type==='save') ||
                            (type==='destroy') || (type==='stopedit')) {
                            useConfig = Y.merge(DEFAULTCONFIG, config, {name: key, value: config.buttonText || UNDEFINED_VALUE});
                            if (!instance._elementIds[key]) {
                                instance._elementIds[key] = Y.guid();
                            }
                            nodeId = instance._elementIds[key];
                            allproperties[key] = instance._itsaformelement.render(useConfig, nodeId);
                        }
                    }
                );
                instance._configAttrs = mergedConfigAttrs;
            }
            else {
                allproperties = '';
                instance._configAttrs = {};
            }
            return allproperties;
        },

        /**
         * Cleans up bindings and removes plugin
         * @method destructor
         * @protected
         * @since 0.1
        */
        destructor : function() {
            var instance = this;
            Y.log('destructor', 'info', 'Itsa-EditModel');
            if (instance._autoSaveTimer) {
                instance._autoSaveTimer.cancel();
            }
            if (instance._fireEventTimer) {
                instance._fireEventTimer.cancel();
            }
            instance._clearEventhandlers();
            instance._itsaformelement.destroy();
            instance._configAttrs = {};
            instance._elementIds = {};
            instance.removeTarget(instance.host);
        },

        //===============================================================================================
        // private methods
        //===============================================================================================

        /**
         * Autostorefunction that is called by timerinterval 'autosaveInterval' in case 'updateMode'===2
         * @method _autoStore
         * @protected
        */
        _autoStore : function() {
            var instance = this;

            Y.log('_autoStore', 'info', 'Itsa-EditModel');
            if (instance._needAutoSaved) {
                instance._editFieldsToModel();
                instance._needAutoSaved = false;
            }
        },

        /**
         * Setting up eventlisteners
         *
         * @method _bindUI
         * @private
         * @since 0.1
         *
        */
        _bindUI : function() {
            var instance = this,
                eventhandlers = instance._eventhandlers;

            Y.log('_bindUI', 'info', 'Itsa-EditModel');
            eventhandlers.push(
                Y.on(
                    EVT_DATETIMEPICKER_CLICK,
                    function(e) {
                        var button = e.buttonNode,
                            span = button.one('span'),
                            valuespan = button.previous('span'),
                            picker = Y.ItsaDateTimePicker,
                            propertyName = e.property,
                            propertyconfig = instance._configAttrs[propertyName],
                            value = instance.host.get(propertyName),
                            widgetconfig = (propertyconfig && propertyconfig.widgetConfig) || {},
                            promise;
                        if (e.elementId===instance._elementIds[propertyName]) {
                            if (span.hasClass(ITSAFORMELEMENT_DATE_CLASS)) {
                                promise = Y.rbind(picker.getDate, picker);
                            }
                            else if (span.hasClass(ITSAFORMELEMENT_TIME_CLASS)) {
                                promise = Y.rbind(picker.getTime, picker);
                            }
                            else if (span.hasClass(ITSAFORMELEMENT_DATETIME_CLASS)) {
                                promise = Y.rbind(picker.getDateTime, picker);
                            }
                            widgetconfig.alignToNode = button;
                            promise(value, widgetconfig).then(
                                function(newdate) {
                                    var newRenderedElement;
                                    instance._storeProperty(valuespan, propertyName, newdate, true);
                                    // because _setProperty setts the attribute with {fromEditModel: true},
                                    // the view does not re-render. We change the fieldvalue ourselves
                                    // first ask for ITSAFormElement how the render will look like
                                    // then axtract the value from within
                                    newRenderedElement = instance.getElement(propertyName, propertyconfig, propertyconfig.value);
                                    valuespan.setHTML(instance._getDateTimeValueFromRender(newRenderedElement));
                                    button.focus();
                                },
                                function() {
                                    // be carefull: button might not exist anymore, when the view is rerendered and making the promise to be rejected!
                                    if (button) {
                                        button.focus();
                                    }
                                }
                            );
                        }
                    }
                )
            );
            eventhandlers.push(
                Y.on(
                    [EVT_INTERNAL+EVT_RESET_CLICK, EVT_INTERNAL+EVT_SUBMIT_CLICK, EVT_INTERNAL+EVT_SAVE_CLICK, EVT_INTERNAL+EVT_BUTTON_CLICK,
                                                 EVT_INTERNAL+EVT_ADD_CLICK, EVT_INTERNAL+EVT_DESTROY_CLICK, EVT_INTERNAL+EVT_STOPEDIT_CLICK],
                    function(e) {
                        if ((e.elementId===instance._elementIds[e.property])) {
                            // stop the original event to prevent double events
                            e.halt();
                            // make the host fire the event
                            var payload = {type: e.type};
                            Y.rbind(instance._fireModelEvent, instance, e.type, payload)();
                        }
                    }
                )
            );
            eventhandlers.push(
                Y.on(
                    EVT_FOCUS_NEXT,
                    function(e) {
                        if (e.elementId===instance._elementIds[e.property]) {
                            // stop the original event to prevent double events
                            e.halt();
                            // make the host fire the event
                            instance.fire(EVT_FOCUS_NEXT, e);
                        }
                    }
                )
            );
            eventhandlers.push(
                Y.on(
                    EVT_VALUE_CHANGE,
                    function(e) {
                        if (e.elementId===instance._elementIds[e.property]) {
                            instance._storeProperty(e.inputNode, e.property, e.inputNode.get('value'));
                        }
                    }
                )
            );
            eventhandlers.push(
                Y.on(
                    EVT_INPUT_CHANGE,
                    function(e) {
                        if (e.elementId===instance._elementIds[e.property]) {
                            instance._storeProperty(e.inputNode, e.property, e.inputNode.get('value'), true);
                        }
                    }
                )
            );
            //============================================================================================
            // if the model gets changed and it wasn't this module, than fire an event.
            // So the developer can use this to listen for these changes and react on them
            instance.host.on(
                '*:change',
                function(e) {
                    if (e.target instanceof Y.Model) {
                        Y.fire(EVT_DIALOG_WARN, {message: MESSAGE_WARN_MODELCHANGED});
                    }
                }
            );
            //============================================================================================


        },

        /**
         * Cleaning up all eventlisteners
         *
         * @method _clearEventhandlers
         * @private
         * @since 0.1
         *
        */
        _clearEventhandlers : function() {
            Y.log('_clearEventhandlers', 'info', 'Itsa-EditModel');
            YArray.each(
                this._eventhandlers,
                function(item){
                    item.detach();
                }
            );
        },

        /**
         * The default destroyFunction of the 'destroyclick'-event. Will call the server with all Model's properties.
         * @method _defPluginDestroyFn
         * @protected
        */
        _defPluginDestroyFn : function() {
            var instance = this;
//                syncOptions = instance.get('syncOptions'),
//                options;

            Y.log('_defPluginDestroyFn', 'info', 'Itsa-EditModel');
            instance._needAutoSaved = false;
            // I would love to have the next method here: because the could be prevented this way (as part of defaultFunc)
            // However, within the defaultFunc, it seems we cannot augment the eventFacade... ); --> https://github.com/yui/yui3/issues/685
            // That's why the functions are transported to the method '_fireModelEvent'

            // options = Y.merge({remove: true}, syncOptions.destroy || {}});
            // e.promise = instance.host.destroyPromise(options);
        },

        /**
         * The default stopeditFunction of the 'stopeditclick'-event.
         * @method _defPluginStopEditFn
         * @protected
        */
        _defPluginStopEditFn : function() {
            var instance = this;

            Y.log('_defPluginStopEditFn', 'info', 'Itsa-EditModel');
            instance._needAutoSaved = false;
            instance.host.unplug('itsaeditmodel');
        },

        /**
         * The default addFunction of the 'addclick'-event. Will call the server with all Model's properties.
         * @method _defPluginAddFn
         * @protected
        */
        _defPluginAddFn : function() {
            var instance = this;

            Y.log('_defPluginAddFn', 'info', 'Itsa-EditModel');
            instance._needAutoSaved = false;
            // no sync('create') --> leave this to the view
        },

        /**
         * The default submitFunction of the 'resetclick'-event. Will call the server with all Model's properties.
         * @method _defPluginResetFn
         * @protected
        */
        _defPluginResetFn : function() {
            var instance = this;

            Y.log('_defPluginResetFn', 'info', 'Itsa-EditModel');
            instance._needAutoSaved = false;
            // no sync('reset') --> leave this to the view
        },

        /**
         * The default submitFunction of the 'submitclick'-event. Will call the server with all Model's properties.
         * @method _defPluginSubmitFn
         * @protected
        */
        _defPluginSubmitFn : function() {
            // Within the defaultFunc, it seems we cannot augment the eventFacade... );
            Y.log('_defPluginSubmitFn', 'info', 'Itsa-EditModel');
            this._defStoreFn('submit');
        },

        /**
         * Saves all editable properties to the Model and calls the models synclayer.
         * @method _defSaveFn
         * @protected
        */
        _defPluginSaveFn : function() {
            // Within the defaultFunc, it seems we cannot augment the eventFacade... );
            Y.log('_defPluginSaveFn', 'info', 'Itsa-EditModel');

            this._defStoreFn('save');
        },

        /**
         * Function that is used by save and _defPluginSubmitFn to store the modelvalues.
         * @method _defStoreFn
         * @param mode {String} type of update
         * @protected
        */
        _defStoreFn : function() {
            var instance = this,
                updateMode = instance.get('updateMode');
//                syncOptions, options;

            Y.log('_defStoreFn', 'info', 'Itsa-EditModel');
            instance._needAutoSaved = false;
            if (updateMode!==3) {
                instance._editFieldsToModel();
            }
            // I would love to have the next methods here: because the could be prevented this way (as part of defaultFunc)
            // However, within the defaultFunc, it seems we cannot augment the eventFacade... ); --> https://github.com/yui/yui3/issues/685
            // That's why the functions are transported to the method '_fireModelEvent'
/*
            if (mode === 'save') {
                syncOptions = instance.get('syncOptions');
                options = syncOptions[mode] || {};
                e.promise = instance.host.savePromise(options);
            }
            else if (mode === 'submit') {
                syncOptions = instance.get('syncOptions');
                options = syncOptions[mode] || {};
                e.promise = instance.host.submitPromise(options);
            }
*/
        },

        /**
         * Transports the formelement-values to the model or object
         *
         * @method _editFieldsToModel
         * @private
         * @since 0.1
         *
        */
        _editFieldsToModel: function() {
            var instance = this,
                configAttrs = instance._configAttrs,
                newModelAttrs = {};

            Y.log('_editFieldsToModel', 'info', 'Itsa-EditModel');
            YObject.each(
                configAttrs,
                function(propertyvalue, property) {
                    newModelAttrs[property] = propertyvalue.value;
                }
            );
            instance._setProperty(null, newModelAttrs);
        },

        /**
         * Lets the host-model fire an model:eventName event
         *
         * @method _fireModelEvent
         * @param eventName {String} event to be fired (model:eventName)
         * @param eventPayLoad {eventTarget} payload
         * @private
         * @since 0.1
         *
        */
        _fireModelEvent: function(eventName, eventPayload) {
            var instance = this,
                host = instance.host,
                ModelClass, currentConfig, newModel, syncOptions, options;

            Y.log('_fireModelEvent', 'info', 'Itsa-EditModel');
            eventPayload.target = host;
            if (eventName === EVT_ADD_CLICK) {
                ModelClass = instance.get('newModelClass');
                newModel = new ModelClass();
                currentConfig = Y.clone(instance.getAttrs());
                newModel.plug(Y.Plugin.ITSAEditModel, currentConfig);
                eventPayload.newModel = newModel;
            }
            // I would love to have the next methods inside _defStoreFn: because the could be prevented this way (as part of defaultFunc)
            // However, within the defaultFunc, it seems we cannot augment the eventFacade... ); --> https://github.com/yui/yui3/issues/685
            // That's why the functions are transported to here
            if (eventName === EVT_SAVE_CLICK) {
                syncOptions = instance.get('syncOptions');
                options = syncOptions.save || {};
                eventPayload.promise = instance.host.savePromise(options);
            }
            else if (eventName === EVT_SUBMIT_CLICK) {
                syncOptions = instance.get('syncOptions');
                options = syncOptions.submit || {};
                eventPayload.promise = instance.host.submitPromise(options);
            }
            else if (eventName === EVT_DESTROY_CLICK) {
                syncOptions = instance.get('syncOptions');
                options = Y.merge({remove: true}, syncOptions.destroy || {});
                eventPayload.promise = instance.host.destroyPromise(options);
            }
            host.fire(eventName, eventPayload);
        },

        /**
         * Extracts the date-time value from the rendered Date-time String.
         *
         * @method _getDateTimeValueFromRender
         * @param renderedElement {String} The rendered elementstring from which the info needs to be extracted
         * @return {Any} Attribute value, or `undefined` if the attribute doesn't exist, or 'null' if no model is passed.
         * @private
         * @since 0.1
         *
        */
        _getDateTimeValueFromRender : function(renderedElement) {
            var regexp = /<span[^>]+>([^<]*)</;

            Y.log('_getDateTimeValueFromRender', 'info', 'Itsa-EditModel');
            return regexp.test(renderedElement) ? RegExp.$1 : '';
        },

        /**
         * Check if the property-type is a date, time or datetime type.
         *
         * @method _isDateTimeType
         * @param type {String} propertytype to check
         * @return {Boolean} whether the type is a date-time type
         * @private
         * @since 0.1
         *
        */
        _isDateTimeType : function(type) {
            Y.log('_isDateTime', 'info', 'Itsa-EditModel');
            return (type==='date') || (type==='time') || (type==='datetime');
        },

        /**
         * Sets the value of a property (or in case of Model, the attribute). Regardless which type the host is.
         * In case
         *
         * @method _setProperty
         * @param [propertyName] {String} Propertyname or -in case or Model- attribute-name. If set to 'null' then all attributes are set.
                  In tha case 'value' should be a hash containing properties and values, which can be passed through to 'Model.setAttrs()'
         * @param value {Any} The new value to be set.
         * @private
         * @since 0.1
         *
        */
        _setProperty: function(propertyName, value) {
            var instance = this,
                host = instance.host,
                options = {fromEditModel: true}, // set Attribute with option: '{fromEditModel: true}' --> now the view knows it must not re-render.
                propertyconfig;

            Y.log('_setProperty', 'info', 'Itsa-EditModel');
            propertyconfig = instance._configAttrs[propertyName];
            if (propertyconfig) {
                propertyconfig.value = value;
            }
            if (propertyName) {
                host.set(propertyName, value, options);
            }
            else {
                host.setAttrs(value, options);
            }
        },

        /**
         * Saves the value of a property (or in case of Model, the attribute). Regardless which type the host is.
         * It will <store> the value. It might be set to the Model, but that deppends on the value of 'updateMode'.
         * In order to do that it might call _setProperty.
         *
         * @method _storeProperty
         * @param node {Y.Node} node that holds the formelement that was changed.
         * @param propertyName {String} Propertyname or -in case or Model- attribute-name.
         * @param value {Any} The new value to be set.
         * @param finished {Boolean} Whether the final value is reached. Some types (like text) can store before they reach
                  their final value.
         * @private
         * @since 0.1
         *
        */
        _storeProperty: function(node, propertyName, value, finished) {
            var instance = this,
                updateMode = instance.get('updateMode'),
                isObject = Lang.isObject(value),
                payload = {
                    node: node,
                    property: propertyName,
                    newVal: (isObject ? Y.merge(value) : value),
                    finished: finished
                },
                propertyconfig, setProperty, attributevalue;

            Y.log('_storeProperty', 'info', 'Itsa-EditModel');
            propertyconfig = instance._configAttrs[propertyName];
            if (propertyconfig) {
                payload.prevValue = isObject ? Y.merge(propertyconfig.value) : propertyconfig.value;
                propertyconfig.value = value;
            }
            else {
                attributevalue = instance.host.get(propertyName);
                payload.prevValue = isObject ? Y.merge(attributevalue) : attributevalue;
            }
            setProperty = ((updateMode===3) || ((updateMode===1) && finished));
            if (setProperty) {
                instance._setProperty(propertyName, value);
            }
            else {
                node.addClass(ITSAFORMELEMENT_CHANGED_CLASS);
                if (updateMode===2) {
                    instance._needAutoSaved = true;
                }
            }
            /**
              * Event fired when a property changed during editing. This is regardless of whether the property is changed.
              * Using these events will help you -for instance- with hiding formelements based on property-values.<br />
              * The evennames consist of the propertyname+'Change'.
              * @event propertynameChange
              * @param e {EventFacade} Event Facade including:
              * @param e.node {Y.Node} The Node that was changed
              * @param e.property {String} The Model's attribute-name that was changed.
              * @param e.newVal {Any} The new value
              * @param e.newVal {Any} The previous value
              * @param e.finished {Boolean} Whether the attribute finished changing. Some attributes (input, textarea's) can fire
              *        this event during editing while still busy (not blurring): they have finished set to false.
            **/
            instance.fire(propertyName+'Change', payload);
        }

    }, {
        NS : 'itsaeditmodel',
        ATTRS : {
            /**
             * Sets the interval to do an 'autosave' during editing input/textfields.
             * Only applies in situations where the attribute 'updateMode'===2. Value should be in <b>seconds</b> between 1-3600.
             * @attribute autosaveInterval
             * @type Int
             * @default 30
             * @since 0.1
            */
            autosaveInterval : {
                value: 30,
                validator: function(val) {
                    return ((typeof val === 'number') && (val>0) && (val<=3600));
                },
                setter: function(val) {
                    Y.log('autosaveInterval setter: '+val, 'info', 'Itsa-EditModel');
                    var instance = this,
                        updateMode = instance.get('updateMode');
                    if (instance._autoSaveTimer) {
                        instance._autoSaveTimer.cancel();
                    }
                    if (updateMode===2) {
                        instance._autoSaveTimer = Y.later(
                            1000*val,
                            instance,
                            instance._autoStore,
                            null,
                            true
                        );
                    }
                }
            },
            /**
             * Every property of the object/model you want to edit, should be defined as a property of configAttrs.
             * Every property-definition is an object: the config of the property that is passed to the ITSAFormElement.<br />
             * Example: <br />
             * editmodelConfigAttrs.property1 = {Object} config of property1 (as example, you should use a real property here)<br />
             * editmodelConfigAttrs.property2 = {Object} config of property2 (as example, you should use a real property here)<br />
             * editmodelConfigAttrs.property3 = {Object} config of property3 (as example, you should use a real property here)<br />
             *
             * @attribute editmodelConfigAttrs
             * @type {Object}
             * @default {}
             * @since 0.1
             */
            editmodelConfigAttrs: {
                value: {},
                validator: function(v){
                    return Lang.isObject(v);
                }
            },
            /**
             * Object with the properties: <b>destroy</b>, <b>save</b> and <b>submit</b>. For every property you might want to
             * specify the options-object that will be passed through to the sync- or destroy-method. The destroymethod will
             * <i>always</i> be called with 'remove=true', in order to call the sync-method.
             * @attribute syncOptions
             * @type Object
             * @default {}
             * @since 0.1
            */
            syncOptions : {
                value: {},
                validator: function(val) {
                    return Lang.isObject(val);
                }
            },
            /**
             * Specifies the Class of new created Models (that is, when a model:addclick event occurs).
             * @attribute newModelClass
             * @type Model
             * @default Y.Model
             * @since 0.1
            */
            newModelClass : {
                value: Y.Model
            },
            /**
             * Template of how to render the model in the view. You can <b>only use Y.Lang.sub templates</b> where the attribute/properties
             * should be specified between brackets. Example: 'Name: {firstname} {lastname}'.<br />
             * Or you can use Y.Template.Micro: 'Name: <%= data.firstname + " " + data.lastename %>'
             * @attribute template
             * @type String
             * @default null
             * @since 0.1
            */
            template : {
                value: null,
                validator: function(val) {
                    return (typeof val==='string');
                }
            },
            /**
             * When to update the edited value to the Model. You can use 4 states:<br /><br />
             * 0 = only on Model.save <i>(or when dave-button is pressed)</i><br />
             * 1 = after the attribute finished updating <i>in case of textfields: when blurring</i><br />
             * 2 = autosave, based on the interval defined with attribute 'autosaveInterval'<br />
             * 3 = life, immediate updates <i>in case of textfields: after every valueChange</i><br /><br />
             * @attribute updateMode
             * @type Int
             * @default 0
             * @since 0.1
            */
            updateMode : {
                value: 0,
                lazyAdd: false, // in case of value
                validator: function(val) {
                    return ((typeof val === 'number') && (val>=0) && (val<=3));
                },
                setter: function(val) {
                    Y.log('updateMode setter: '+val, 'info', 'Itsa-EditModel');
                    var instance = this,
                        autosaveInterval = instance.get('autosaveInterval');
                    if (val) {
                        instance._autoSaveTimer = Y.later(
                            1000*autosaveInterval,
                            instance,
                            instance._autoStore,
                            null,
                            true
                        );
                    }
                    else {
                        if (instance._autoSaveTimer) {
                            instance._autoSaveTimer.cancel();
                        }
                    }
                }
            }
        }
    }
);

//===================================================================
// adding plug and unplug features to Y.Model:
Y.augment(Y.Model, Y.Plugin.Host);

// now we need to set global eventhandlers, but only once.
// unfortunatly they need to keep in memory, even when unplugged.
// however: they only get there once, so no memoryleaks
  body.delegate(
      'click',
      function(e) {
          var button = e.currentTarget,
              span = button.previous('span');
          // stop the original event to prevent double events
          e.halt();
          // set the focus manually. This will cause the View to be focussed as well --> now the focusmanager works for this View-instance
          button.focus();
          Y.use('gallery-itsadatetimepicker', function(Y) {
              e.elementId = span.get('id');
              e.type = EVT_DATETIMEPICKER_CLICK;
              e.buttonNode = button;
              e.property = GET_PROPERTY_FROM_CLASS(span.getAttribute('class'));
              Y.fire(EVT_DATETIMEPICKER_CLICK, e);
          });
      },
      '.'+ITSABUTTON_DATETIME_CLASS
  );
  body.delegate(
      'valuechange',
      function(e) {
          var inputnode = e.currentTarget;
          // seems that e.halt() cannot be called here ???
          e.elementId = inputnode.get('id');
          e.inputNode = inputnode;
          e.property = GET_PROPERTY_FROM_CLASS(inputnode.getAttribute('class'));
          e.type = EVT_VALUE_CHANGE;
          Y.fire(EVT_VALUE_CHANGE, e);
      },
      '.'+ITSAFORMELEMENT_LIFECHANGE_CLASS
  );
  body.delegate(
      'change',
      function(e) {
          var inputnode = e.currentTarget;
          // seems that e.halt() cannot be called here ???
          e.elementId = inputnode.get('id');
          e.inputNode = inputnode;
          e.property = GET_PROPERTY_FROM_CLASS(inputnode.getAttribute('class'));
          e.type = EVT_INPUT_CHANGE;
          Y.fire(EVT_INPUT_CHANGE, e);
      },
      '.'+ITSAFORMELEMENT_LIFECHANGE_CLASS
  );
  body.delegate(
      'keypress',
      function(e) {
          if (e.keyCode===13) {
              // stop the original event to prevent double events
              e.halt();
              var inputnode = e.currentTarget;
              // seems that e.halt() cannot be called here ???
              e.elementId = inputnode.get('id');
              e.inputNode = inputnode;
              e.property = GET_PROPERTY_FROM_CLASS(inputnode.getAttribute('class'));
              e.type = EVT_FOCUS_NEXT;
              Y.fire(EVT_FOCUS_NEXT, e);
          }
      },
      '.'+ITSAFORMELEMENT_ENTERNEXTFIELD_CLASS
  );
  body.delegate(
      'click',
      function(e) {
          var button = e.currentTarget,
              classNames = button.getAttribute('class');
          // stop the original event to prevent double events
          e.halt();
          // set the focus manually. This will cause the View to be focussed as well --> now the focusmanager works for this View-instance
          button.focus();
          e.elementId = button.get('id');
          e.buttonNode = button;
          e.property = GET_PROPERTY_FROM_CLASS(button.getAttribute('class'));
          if (classNames.indexOf(SUBMIT_BUTTON_CLASS) !== -1) {
              e.type = EVT_SUBMIT_CLICK;
              Y.fire(EVT_INTERNAL+EVT_SUBMIT_CLICK, e);
          }
          else if (classNames.indexOf(RESET_BUTTON_CLASS) !== -1) {
              e.type = EVT_RESET_CLICK;
              Y.fire(EVT_INTERNAL+EVT_RESET_CLICK, e);
          }
          else if (classNames.indexOf(SAVE_BUTTON_CLASS) !== -1) {
              e.type = EVT_SAVE_CLICK;
              Y.fire(EVT_INTERNAL+EVT_SAVE_CLICK, e);
          }
          else if (classNames.indexOf(DESTROY_BUTTON_CLASS) !== -1) {
              e.type = EVT_DESTROY_CLICK;
              Y.fire(EVT_INTERNAL+EVT_DESTROY_CLICK, e);
          }
          else if (classNames.indexOf(STOPEDIT_BUTTON_CLASS) !== -1) {
              e.type = EVT_STOPEDIT_CLICK;
              Y.fire(EVT_INTERNAL+EVT_STOPEDIT_CLICK, e);
          }
          else if (classNames.indexOf(ADD_BUTTON_CLASS) !== -1) {
              e.type = EVT_ADD_CLICK;
              Y.fire(EVT_INTERNAL+EVT_ADD_CLICK, e);
          }
          else if (classNames.indexOf(BUTTON_BUTTON_CLASS) !== -1) {
              // check this one as the last one: the others ALL have this class as well
              e.type = EVT_BUTTON_CLICK;
              Y.fire(EVT_INTERNAL+EVT_BUTTON_CLICK, e);
          }
      },
      '.'+ITSAFORMELEMENT_BUTTONTYPE_CLASS
  );


}, 'gallery-2013.05.10-00-54', {
    "requires": [
        "yui-base",
        "base-build",
        "node-base",
        "node-event-delegate",
        "plugin",
        "pluginhost-base",
        "lazy-model-list",
        "event-valuechange",
        "gallery-itsamodelsyncpromise",
        "gallery-itsaformelement"
    ]
});
