YUI.add('gallery-itsaviewmodel', function (Y, NAME) {

'use strict';

/*jshint maxlen:235 */

/**
 *
 * View ITSAViewModel
 *
 *
 * @module gallery-itsaviewmodel
 * @extends View
 * @class ITSAViewModel
 * @constructor
 * @since 0.3
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://itsasbreuk.nl</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

var ITSAViewModel,
    PLUGIN_TIMEOUT = 4000, // timeout within the plugin of itsatabkeymanager should be loaded
    Lang = Y.Lang,
    YArray = Y.Array,
    YObject = Y.Object,
    YIntl = Y.Intl,
    ITSA = 'itsa',
    ITSA_ = ITSA+'-',
    PURE_FORM = 'pure-form',
    DEF_FORM_CLASS = PURE_FORM+' '+PURE_FORM+'-aligned',
    BUTTON_ICON_LEFT = ITSA+'button-iconleft',
    IMAGE_BUTTON_TEMPLATE = '<i class="itsaicon-form-{type}"></i>',
    YTemplateMicro = Y.Template.Micro,
    FORM_CAPITALIZED = 'FORM',
    TEMPLATE = 'template',
    CHANGE = 'Change',
    TAGNAME = 'tagName',
    GALLERY = 'gallery-',
    ITSAVIEWMODEL = ITSA+'viewmodel',
    FOCUSED_CLASS = ITSA_+'focused',
    STYLED = 'styled',
    BUTTON = 'button',
    MODEL = 'model',
    SAVE_FIRSTCAP = 'Save',
    SUBMIT_FIRSTCAP = 'Submit',
    LOAD_FIRSTCAP = 'Load',
    DESTROY_FIRSTCAP = 'Destroy',
    RESET_FIRSTCAP = 'Reset',
    PROMISE = 'Promise',
    DESTROYED = 'destroyed',
    DELETE = 'delete',
    DEF_FN = '_defFn_',
    STATUS = 'status',
    STATUSBAR = STATUS+'bar',
    CAP_STATUSBAR = STATUS+'Bar',
    BOOLEAN = 'boolean',
    STRING = 'string',
    EDITABLE = 'editable',
    CONTAINER = 'container',
    VIEWRENDERED = 'viewrendered',
    DEF_PREV_FN = '_defPrevFn_',
    ITSATABKEYMANAGER = ITSA+'tabkeymanager',
    FOCUSMANAGED = 'focusManaged',
    DISABLED = 'disabled',
    DATA_ITSASTATUSBAR = 'data-itsa'+STATUSBAR,
    PURE_BUTTON_DISABLED = 'pure-'+BUTTON+'-'+DISABLED,
    VALID_BUTTON_TYPES = {
        button: true,
        destroy: true,
        remove: true,
        reset: true,
        save: true,
        submit: true,
        load: true
    },
    PROTECTED_BUTTON_TYPES = {
        btn_abort: true,
        btn_cancel: true,
        btn_close: true,
        btn_destroy: true,
        btn_ignore: true,
        btn_load: true,
        btn_no: true,
        btn_ok: true,
        btn_remove: true,
        btn_reset: true,
        btn_retry: true,
        btn_save: true,
        btn_submit: true,
        btn_yes: true,
        imgbtn_abort: true,
        imgbtn_cancel: true,
        imgbtn_close: true,
        imgbtn_destroy: true,
        imgbtn_ignore: true,
        imgbtn_load: true,
        imgbtn_no: true,
        imgbtn_ok: true,
        imgbtn_remove: true,
        imgbtn_reset: true,
        imgbtn_retry: true,
        imgbtn_save: true,
        imgbtn_submit: true,
        imgbtn_yes: true,
        spinbtn_load: true,
        spinbtn_remove: true,
        spinbtn_save: true,
        spinbtn_submit: true
    },

    DESTROY = 'destroy',
    REMOVE = 'remove',
    LOAD = 'load',
    RESET = 'reset',
    SAVE = 'save',
    SUBMIT = 'submit',

    CLICK = 'click',
    CLICKOUTSIDE = CLICK+'outside',
    ABORT = 'abort',
    CANCEL = 'cancel',
    CLOSE = 'close',
    IGNORE = 'ignore',
    NO = 'no',
    OK = 'ok',
    RETRY = 'retry',
    YES = 'yes',
    BTN = 'btn_',
    BTN_ABORT = BTN+ABORT,
    BTN_CANCEL = BTN+CANCEL,
    BTN_CLOSE = BTN+CLOSE,
    BTN_DESTROY = BTN+DESTROY,
    BTN_IGNORE = BTN+IGNORE,
    BTN_LOAD = BTN+LOAD,
    BTN_NO = BTN+NO,
    BTN_OK = BTN+OK,
    BTN_REMOVE = BTN+REMOVE,
    BTN_RESET = BTN+RESET,
    BTN_RETRY = BTN+RETRY,
    BTN_SAVE = BTN+SAVE,
    BTN_SUBMIT = BTN+SUBMIT,
    BTN_YES = BTN+YES,
    IMG = 'img',
    IMGBTN_ABORT = IMG+BTN_ABORT,
    IMGBTN_CANCEL = IMG+BTN_CANCEL,
    IMGBTN_CLOSE = IMG+BTN_CLOSE,
    IMGBTN_DESTROY = IMG+BTN_DESTROY,
    IMGBTN_IGNORE = IMG+BTN_IGNORE,
    IMGBTN_LOAD = IMG+BTN_LOAD,
    IMGBTN_NO = IMG+BTN_NO,
    IMGBTN_OK = IMG+BTN_OK,
    IMGBTN_REMOVE = IMG+BTN_REMOVE,
    IMGBTN_RESET = IMG+BTN_RESET,
    IMGBTN_RETRY = IMG+BTN_RETRY,
    IMGBTN_SAVE = IMG+BTN_SAVE,
    IMGBTN_SUBMIT = IMG+BTN_SUBMIT,
    IMGBTN_YES = IMG+BTN_YES,
    SPIN = 'spin',
    SPINBTN_LOAD = SPIN+BTN_LOAD,
    SPINBTN_REMOVE = SPIN+BTN_REMOVE,
    SPINBTN_SAVE = SPIN+BTN_SAVE,
    SPINBTN_SUBMIT = SPIN+BTN_SUBMIT,
    UPPERCASE = 'uppercase',
    LOWERCASE = 'lowercase',
    CAPITALIZE = 'capitalize',
    ITSA_BUTTON = ITSA_+BUTTON+'-',
    ITSABUTTON_UPPERCASE = ITSA_BUTTON+UPPERCASE,
    ITSABUTTON_LOWERCASE = ITSA_BUTTON+LOWERCASE,
    ITSABUTTON_CAPITALIZE = ITSA_BUTTON+CAPITALIZE,
    BUTTONTRANSFORM = BUTTON+'Transform',
    GALLERY_ITSASTATUSBAR = GALLERY+ITSA+STATUSBAR,
    GALLERY_ITSAMODELSYNCPROMISE = GALLERY+ITSA+MODEL+'syncpromise',
    ITSAVIEW_ = 'itsaview-',
    STATUSBAR_CLASS = ITSAVIEW_+STATUSBAR,
    ENDDIV = '</div>',
    STATUSBAR_TEMPLATE = '<div class="'+STATUSBAR_CLASS+'">'+ENDDIV,
    WRAPPERDIV = '<div class="'+ITSAVIEW_+'wrapper">',
    /**
      * Fired when a UI-element needs to focus to the next element (in case of editable view).
      * The defaultFunc will refocus to the next field (when the view has focus).
      * Convenience-event alias for the underlying model-event. Can be prevented or halted.
      *
      * @event focusnext
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.Node} The node that fired the event.
      * @param e.model {Y.Model} modelinstance bound to the view
      * @param e.modelEventFacade {EventFacade} eventfacade that was passed through by the model that activated this event
      * @since 0.1
    **/
    FOCUS_NEXT = 'focusnext',

    /**
      * Fired when validation fails.
      * Convenience-event alias for the underlying model-event. Can NOT be prevented or halted.
      *
      * @event validationerror
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.nodelist {Y.NodeList} reference to the element-nodes that are validated wrongly
      * @param e.model {Y.Model} modelinstance bound to the view
      * @param e.modelEventFacade {EventFacade} eventfacade that was passed through by the model that activated this event
      * @since 0.1
    **/
    VALIDATION_ERROR = 'validationerror',

    /**
      * Fired after a UI-formelement changes its value from a userinput (not when updated internally).
      * Convenience-event alias for the underlying model-event. Can be prevented or halted.
      *
      * @event uichanged
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.value {Date} current value of the property
      * @param e.node {Y.Node} reference to the element-node
      * @param e.nodeid {String} id of the element-node (without '#')
      * @param e.formElement {Object} reference to the form-element
      * @param e.model {Y.Model} modelinstance bound to the view
      * @param e.modelEventFacade {EventFacade} eventfacade that was passed through by the model that activated this event
      *
    **/
    UI_CHANGED = 'uichanged',

    /**
      * Fired when a template-button {btn_button} or {imgbtn_button} is clicked.
      * Convenience-event alias for the underlying model-event. Can be prevented or halted.
      *
      * @event buttonclick
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.value {Any} Should be used to identify the button --> defined during rendering: is either config.value or labelHTML
      * @param e.buttonNode {Y.Node} reference to the buttonnode
      * @param e.formElement {Object} reference to the form-element
      * @param e.model {Y.Model} modelinstance bound to the view
      * @param e.modelEventFacade {EventFacade} eventfacade that was passed through by the model that activated this event
      *
    **/
    BUTTON_CLICK = BUTTON+CLICK,

    /**
      * Fired when a template-button {btn_close} or {imgbtn_close} is clicked.
      * Convenience-event alias for the underlying model-event. Can be prevented or halted.
      *
      * @event buttonclose
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.value {String} always === 'close'
      * @param e.buttonNode {Y.Node} reference to the buttonnode
      * @param e.formElement {Object} reference to the form-element
      * @param e.model {Y.Model} modelinstance bound to the view
      * @param e.modelEventFacade {EventFacade} eventfacade that was passed through by the model that activated this event
      *
    **/
    BUTTON_CLOSE = BUTTON+CLOSE,

    /**
      * Fired when a template-button {btn_destroy} or {imgbtn_destroy} is clicked.
      * Convenience-event alias for the underlying model-event. Can be prevented or halted.
      *
      * @event destroyclick
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.value {Any} Should be used to identify the button --> defined during rendering: is either config.value or labelHTML
      * @param e.buttonNode {Y.Node} reference to the buttonnode
      * @param e.formElement {Object} reference to the form-element
      * @param e.model {Y.Model} modelinstance bound to the view
      * @param e.modelEventFacade {EventFacade} eventfacade that was passed through by the model that activated this event
      *
    **/
    DESTROY_CLICK = DESTROY+CLICK,

    /**
      * Fired when a template-button {btn_remove}, {imgbtn_remove} or {spinbtn_remove} is clicked.
      * Convenience-event alias for the underlying model-event. Can be prevented or halted.
      *
      * @event removeclick
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.value {Any} Should be used to identify the button --> defined during rendering: is either config.value or labelHTML
      * @param e.buttonNode {Y.Node} reference to the buttonnode
      * @param e.formElement {Object} reference to the form-element
      * @param e.model {Y.Model} modelinstance bound to the view
      * @param e.modelEventFacade {EventFacade} eventfacade that was passed through by the model that activated this event
      *
    **/
    REMOVE_CLICK = REMOVE+CLICK,

    /**
      * Fired when a template-button {btn_load}, {imgbtn_load} or {spinbtn_load} is clicked.
      * Convenience-event alias for the underlying model-event. Can be prevented or halted.
      *
      * @event loadclick
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.value {Any} Buttonvalue: could be used to identify the button --> defined during rendering by config.value
      * @param e.buttonNode {Y.Node} reference to the buttonnode
      * @param e.formElement {Object} reference to the form-element
      * @param e.model {Y.Model} modelinstance bound to the view
      * @param e.modelEventFacade {EventFacade} eventfacade that was passed through by the model that activated this event
      *
    **/
    LOAD_CLICK = LOAD+CLICK,

    /**
      * Fired when a template-button {btn_submit}, {imgbtn_submit} or {spinbtn_submit} is clicked.
      * Convenience-event alias for the underlying model-event. Can be prevented or halted.
      *
      * @event submitclick
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.value {Any} Buttonvalue: could be used to identify the button --> defined during rendering by config.value
      * @param e.buttonNode {Y.Node} reference to the buttonnode
      * @param e.formElement {Object} reference to the form-element
      * @param e.model {Y.Model} modelinstance bound to the view
      * @param e.modelEventFacade {EventFacade} eventfacade that was passed through by the model that activated this event
      *
    **/
    SUBMIT_CLICK = SUBMIT+CLICK,

    /**
      * Fired when a template-button {btn_reset} or {imgbtn_reset} is clicked.
      * Convenience-event alias for the underlying model-event. Can be prevented or halted.
      *
      * @event resetclick
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.value {Any} Buttonvalue: could be used to identify the button --> defined during rendering by config.value
      * @param e.buttonNode {Y.Node} reference to the buttonnode
      * @param e.formElement {Object} reference to the form-element
      * @param e.model {Y.Model} modelinstance bound to the view
      * @param e.modelEventFacade {EventFacade} eventfacade that was passed through by the model that activated this event
      *
    **/
    RESET_CLICK = RESET+CLICK,

    /**
      * Fired when a template-button {btn_save}, {imgbtn_save} or {spinbtn_save} is clicked.
      * Convenience-event alias for the underlying model-event. Can be prevented or halted.
      *
      * @event saveclick
      * @param e {EventFacade} Event Facade including:
      * @param e.target {Y.ITSAFormModel} The ITSAFormModel-instance
      * @param e.value {Any} Buttonvalue: could be used to identify the button --> defined during rendering by config.value
      * @param e.buttonNode {Y.Node} reference to the buttonnode
      * @param e.formElement {Object} reference to the form-element
      * @param e.model {Y.Model} modelinstance bound to the view
      * @param e.modelEventFacade {EventFacade} eventfacade that was passed through by the model that activated this event
      *
    **/
    SAVE_CLICK = SAVE+CLICK;

//===============================================================================================
//
// First: extend Y.Node with the method cleanup()
//
//===============================================================================================

function ITSANodeCleanup() {}

Y.mix(ITSANodeCleanup.prototype, {

    //
    // Destroys all widgets inside the node by calling widget.destroy(true);
    //
    // @method cleanup
    // @param destroyAllNodes {Boolean} If true, all nodes contained within the Widget are removed and destroyed.
    //                        Defaults to false due to potentially high run-time cost.
    // @since 0.3
    //
    //
    cleanupWidgets: function(destroyAllNodes) {
        var node = this,
            YWidget = Y.Widget;

        Y.log('cleanupWidgets', 'info', 'Itsa-NodeCleanup');
        if (YWidget) {
            node.all('.yui3-widget').each(
                function(widgetNode) {
                    if (node.one('#'+widgetNode.get('id'))) {
                        var widgetInstance = YWidget.getByNode(widgetNode);
                        if (widgetInstance) {
                            widgetInstance.destroy(destroyAllNodes);
                        }
                    }
                }
            );
        }
    },

    //
    // Cleansup the node by calling node.empty(), as well as destroying all widgets that lie
    // within the node by calling widget.destroy(true);
    //
    // @method cleanup
    // @since 0.3
    //
    //
    cleanup: function(widgets) {
        var node = this;

        Y.log('cleanup', 'info', 'Itsa-NodeCleanup');
/*jshint expr:true */
        widgets && node.cleanupWidgets(true);
/*jshint expr:false */
        // NOT node.empty, for that will remove each and separate node from the dom which make it flickr!
        node.get('childNodes').destroy(true);
    }

}, true);

Y.Node.ITSANodeCleanup = ITSANodeCleanup;

Y.Base.mix(Y.Node, [ITSANodeCleanup]);

//===============================================================================================
//
// Next we create the widget
//
//===============================================================================================

ITSAViewModel = Y.ITSAViewModel = Y.Base.create(ITSAVIEWMODEL, Y.View, [], {},
    {
        ATTRS : {
            /**
             * CSS text-transform of all buttons. Should be:
             * <ul>
             *   <li>null --> leave as it is</li>
             *   <li>uppercase</li>
             *   <li>lowercase</li>
             *   <li>capitalize --> First character uppercase, the rest lowercase</li>
             * </ul>
             *
             * @attribute buttonTransform
             * @default null
             * @type {String}
             */
            buttonTransform: {
                value: null,
                validator: function(val) {
                    return (val===null) || (val===UPPERCASE) || (val===LOWERCASE) || (val===CAPITALIZE);
                }
            },
            /**
             * Makes the View to render the editable-version of the Model. Only when the Model has <b>Y.Plugin.ITSAEditModel</b> plugged in.
             *
             * @attribute editable
             * @type {Boolean}
             * @default false
             * @since 0.3
             */
            editable: {
                value: false,
                validator: function(v){
                    return (typeof v === BOOLEAN);
                },
                getter: function(v) {
                    var model = this.get(MODEL);
                    return (v && model && model.toJSONUI);
                }
            },
            /**
             * Determines whether tabbing through the elements is managed by gallery-itsatabkeymanager.
             *
             * @attribute focusManaged
             * @type {Boolean}
             * @default true
             * @since 0.3
             */
            focusManaged: {
                value: true,
                validator: function(v){
                    return (typeof v === BOOLEAN);
                }
            },
            /**
             * The Y.Model that will be rendered in the view. May also be an Object, which is handy in case the source is an
             * item of a Y.LazyModelList. If you pass a String-value, then the text is rendered as it is, assuming no model-instance.
             *
             * @attribute model
             * @type {Y.Model|Object|String}
             * @default {}
             * @since 0.3
             */
            model: {
                value: {},
                validator: function(v){ return ((v===null) || Lang.isObject(v) || (typeof v === STRING) || (v instanceof Y.Model)); },
                setter: '_setModel'
            },
            /**
             * Flag that indicates whether this instance is part of multiple views. Should normally left true.
             * ITSAViewModelPanel sets this to 'false' because it has instances inside the body and footer.
             * When set false, the functionality of locking the view (when needed) is set of and should be done by the parentwidget.
             *
             * @attribute partOfMultiView
             * @type {Boolean}
             * @default true
             * @since 0.4
             */
            partOfMultiView: {
                value: false,
                initOnly: true,
                validator: function(v){
                    return (typeof v === BOOLEAN);
                }
            },

            /**
             * Whether the view should have a statusbar (Y.ITSAStatusbar). Targeting should be done directly at the view-instance. See gallery-itsastatusbar.
             *
             * @attribute statusBar
             * @type Boolean
             * @default false
             * @since 0.3
            */
            statusBar : {
                value: false,
                validator: function(val) {
                    return (typeof val===BOOLEAN);
                }
            },

            /**
             * Styles the view by adding the className 'itsaviewmodel-styled' to the container.
             *
             * @attribute styled
             * @type {Boolean}
             * @default true
             * @since 0.3
             */
            styled: {
                value: true,
                validator: function(v){
                    return (typeof v === BOOLEAN);
                }
            },

          /**
           * Template for the bodysection to render the Model. The attribute MUST be a template that can be processed by either <i>Y.Lang.sub or Y.Template.Micro</i>,
           * where Y.Lang.sub is more lightweight. If you use Y.ITSAFormModel as 'model' and 'editable' is set true, be aware that all property-values are <u>html-strings</u>.
           * Should you templating with micro-templates <b>you need to look for the docs</b> what is the right way to do.
           *
           * <u>If you set this attribute after the view is rendered, the view will be re-rendered.</u>
           *
           * @attribute template
           * @type {String}
           * @default null
           * @since 0.3
           */
            template: {
                value: null,
                validator: function(v) {
                    return (typeof v === STRING);
                },
                getter: function(v) {
                    var instance = this;
                    // Because _textTemplate might exists in case of clear text instead of a model, we need to return the right template.
                    return instance._textTemplate || ((v===null) ? (instance.warnNoTemplate ? instance._intl.undefined_template : '') : v);
                }
            }
        }
    }
);

// prototype flag that tells whether 'gallerycss-itsa-form' has been loaded
ITSAViewModel.prototype._formcss_loaded = false;

/**
 * @method initializer
 * @protected
 * @since 0.3
*/
ITSAViewModel.prototype.initializer = function() {
    var instance = this,
        model = instance.get(MODEL),
        renderpromise;

    Y.log('initializer', 'info', 'ITSA-ViewModel');

    renderpromise = instance._renderPromise = new Y.Promise(function (resolve) {
        instance._renderPromiseResolve = resolve;
    });

    /**
     * Internal objects with internationalized buttonlabels
     *
     * @property _intl
     * @private
     * @type Object
    */
    instance._intl = YIntl.get(GALLERY+ITSAVIEWMODEL);

    /**
     * Warns when a user forgets to add a template
     *
     * @property warnNoTemplate
     * @type Boolean
     * @default true
    */
    instance.warnNoTemplate = true;

    /**
     * PreventDefault function of destroyclick-event.
     * Will pass the 'preventDefault'-method through to the underlying model
     *
     * @method _defPrevFn_destroyclick
     * @private
     * @protected
    */

    /**
     * PreventDefault function of removeclick-event.
     * Will pass the 'preventDefault'-method through to the underlying model
     *
     * @method _defPrevFn_removeclick
     * @private
     * @protected
    */

    /**
     * PreventDefault function of resetclick-event.
     * Will pass the 'preventDefault'-method through to the underlying model
     *
     * @method _defPrevFn_resetclick
     * @private
     * @protected
    */

    /**
     * PreventDefault function of saveclick-event.
     * Will pass the 'preventDefault'-method through to the underlying model
     *
     * @method _defPrevFn_saveclick
     * @private
     * @protected
    */

    /**
     * PreventDefault function of submitclick-event.
     * Will pass the 'preventDefault'-method through to the underlying model
     *
     * @method _defPrevFn_submitclick
     * @private
     * @protected
    */

    /**
     * PreventDefault function of validationerror-event.
     * Will pass the 'preventDefault'-method through to the underlying model
     *
     * @method _defPrevFn_validationerror
     * @private
     * @protected
    */

    /**
     * PreventDefault function of buttonclick-event.
     * Will pass the 'preventDefault'-method through to the underlying model
     *
     * @method _defPrevFn_buttonclick
     * @private
     * @protected
    */

    /**
     * PreventDefault function of loadclick-event.
     * Will pass the 'preventDefault'-method through to the underlying model
     *
     * @method _defPrevFn_loadclick
     * @private
     * @protected
    */

    /**
     * PreventDefault function of uichanged-event.
     * Will pass the 'preventDefault'-method through to the underlying model
     *
     * @method _defPrevFn_uichanged
     * @private
     * @protected
    */

    YArray.each(
        [DESTROY_CLICK, REMOVE_CLICK, RESET_CLICK, SAVE_CLICK, SUBMIT_CLICK, BUTTON_CLICK, LOAD_CLICK, UI_CHANGED],
        function(event) {
            instance[DEF_PREV_FN+event] = function(e) {
                Y.log('preventDefaultFn of '+event, 'info', 'ITSA-ViewModel');
                e.modelEventFacade.preventDefault();
            };
            // publishing event
            instance.publish(
                event,
                {
                    preventedFn: Y.bind(instance[DEF_PREV_FN+event], instance),
                    emitFacade: true
                }
            );
        }
    );

    // publishing event 'focusnext'
    instance.publish(
        FOCUS_NEXT,
        {
            defaultFn: Y.bind(instance[DEF_FN+FOCUS_NEXT], instance),
            emitFacade: true
        }
    );

    // publishing event 'validationerror'
    instance.publish(
        VALIDATION_ERROR,
        {
            defaultFn: Y.bind(instance[DEF_FN+VALIDATION_ERROR], instance),
            preventedFn: Y.bind(instance[DEF_PREV_FN+VALIDATION_ERROR], instance),
            emitFacade: true
        }
    );

    /**
     * Internal flag that tells wheter a Template.Micro is being used.
     * @property _isMicroTemplate
     * @private
     * @default null
     * @type Boolean
    */

    /**
     * Internal Function that is generated to automaticly make use of the template.
     * The function has the structure of: _modelRenderer = function(model) {return {String}};
     * @property _modelRenderer
     * @private
     * @default function(model) {return ''};
     * @type Function
    */

    /**
     * Internal flag that indicates wheter the view is set locked just before another lockView command is about to execute
     * @property _lockedBefore
     * @private
     * @default null
     * @type Boolean
    */

    /**
     * Internal flag that indicates wheter the view is set locked
     * @property _locked
     * @private
     * @default null
     * @type Boolean
    */

    /**
     * Internal list of all eventhandlers bound by this widget.
     * @property _eventhandlers
     * @private
     * @default []
     * @type Array
    */
    instance._eventhandlers = [];

    /**
     * Internal template to be used when MODEL is no model but just clear text.
     *
     * @property _textTemplate
     * @private
     * @default null
     * @type String
    */

    instance._contIsForm = (instance.get(CONTAINER).get(TAGNAME)===FORM_CAPITALIZED);

/*jshint expr:true */
    model && model.addTarget && model.addTarget(instance);
    model && instance.get(TEMPLATE) && instance._setTemplateRenderer();
/*jshint expr:false */

    /**
     * Internal hash with custom buttons
     *
     * @property _customBtns
     * @private
     * @default {}
     * @type Object
    */
    instance._customBtns = {};

    instance._hotkeys = {};

    /**
     * Internal hash with custom buttonlabels
     *
     * @property _customBtnLabels
     * @private
     * @default {}
     * @type Object
    */
    instance._customBtnLabels = {};
    instance._createButtons();
};

/**
 *
 * Defines a custom property that can be refered to using templating, f.i. {btn_button_1}
 * <br />Imagebuttons can be set through 'labelHTML', f.i.: '<i class="icon-press"></i> press me' --> see module 'gallerycss-itsa-base' for more info.
 *
 * @method addCustomBtn
 * @param buttonId {String} unique id that will be used as the reference-property during templating. F.i. {btn_button_1}
 * @param labelHTML {String} Text on the button (equals buttonId when not specified). You can use imagebuttons: see module 'gallerycss-itsa-base' how to create.
 * @param [config] {Object} config (which that is passed through to Y.ITSAFormElement)
 * @param [config.value] {String} returnvalue which is available inside the eventlistener through e.value
 * @param [config.data] {String} when wanting to add extra data to the button, f.i. 'data-someinfo="somedata"'
 * @param [config.disabled=false] {Boolean}
 * @param [config.hidden=false] {Boolean}
 * @param [config.hotkey] {String} character that act as a hotkey: 'alt+char' will focus and click the button.
 *                                 The hotkey-character will be marked with the css-class 'itsa-hotkey' (span-element), which underscores by default, but can be overruled.
 *                                 If you want to Internationize, the you need to supply an object where the properties are the language-tag and the values a string (character).
 *                                 F.i. {us: 'a', nl: 'o'}. When Internationize, there will be no hotkey when the used language is not found in the hotkey-object.
 * @param [config.classname] for adding extra classnames to the button
 * @param [config.focusable=true] {Boolean}
 * @param [config.primary=false] {Boolean} making it the primary-button
 * @param [config.spinbusy=false] {Boolean} making a buttonicon to spin if busy
 * @param [config.tooltip] {String} tooltip when Y.Tipsy or Y.Tipsy is used
 * @since 0.3
 *
 */
ITSAViewModel.prototype.addCustomBtn = function(buttonId, labelHTML, config) {
    var instance = this;

    Y.log('addCustomBtn '+buttonId, 'info', 'ITSA-ViewModel');
    if (!PROTECTED_BUTTON_TYPES[buttonId]) {
        instance._customBtns[buttonId] = {
            config: config,
            labelHTML: labelHTML || buttonId
        };
    }
};

/**
 * Creates custom buttons for multiple buttons. Passes through to addCustomBtn (see that method for possible buttonvalues).
 *
 * @method addCustomBtns
 * @param buttons {Array} Array of objects with properties buttons.buttonId, buttons.labelHTML and optionally buttonConfig.config
 * @since 0.4
 *
*/
ITSAViewModel.prototype.addCustomBtns = function(buttons) {
    var instance = this;
    Y.log('addCustomBtns', 'info', 'ITSA-ViewModel');
/*jshint expr:true */
    Lang.isArray(buttons) && (YArray.each(
        buttons,
        function(buttonConfig) {
            buttonConfig.buttonId && buttonConfig.labelHTML && instance.addCustomBtn(buttonConfig.buttonId, buttonConfig.labelHTML, buttonConfig.config);
        }
    ));
/*jshint expr:false */
};

/**
 * Makes sync-messages to target the specified messageViewer. Passes through to the underlying model-instance (if available).
 * You can only target to 1 MessageViewer at the same time.<br>
 * See gallery-itsamessageviewer for more info.
 *
 * @method addMessageTarget
 * @param itsamessageviewer {Y.ITSAMessageViewer|Y.ITSAPanel}
 * @since 0.1
*/
ITSAViewModel.prototype.addMessageTarget = function(itsamessageviewer) {
    var model = this.get(MODEL);
/*jshint expr:true */
    model && model.addMessageTarget && model.addMessageTarget(itsamessageviewer);
/*jshint expr:false */
};

/**
 * Blur the focus of the view's container-node by removing the 'itsa-focused' class.
 *
 * @method blur
 * @since 0.3
 *
*/
ITSAViewModel.prototype.blur = function() {
    Y.log('blur', 'info', 'ITSA-ViewModel');
    this.get(CONTAINER).removeClass(FOCUSED_CLASS);
};

/**
 * Sets focus to the view's container-node by adding the 'itsa-focused' class. In case of focusable UI-elements, te right element regains the focus.
 *
 * @method focus
 * @since 0.3
 *
*/
ITSAViewModel.prototype.focus = function() {
    Y.log('focus', 'info', 'ITSA-ViewModel');

    var instance = this,
        container = instance.get(CONTAINER);

    instance.isRendered().then(
        function() {
            container.addClass(FOCUSED_CLASS);
            container.pluginReady(ITSATABKEYMANAGER, PLUGIN_TIMEOUT).then(
                function(itsatabkeymanager) {
                    itsatabkeymanager._retrieveFocus();
                }
            );
        }
    );
};

/**
 * Sets focus to the initial item.
 *
 * @method focusInitialItem
 * @since 0.4
 * return {Y.Promise} when item gets focussed
*/
ITSAViewModel.prototype.focusInitialItem = function() {
    var instance = this,
        container = instance.get(CONTAINER);

    Y.log('focusInitialItem', 'info', 'ITSA-ViewModel');
    return container.pluginReady(ITSATABKEYMANAGER, PLUGIN_TIMEOUT).then(
        function(itsatabkeymanager) {
            container.addClass(FOCUSED_CLASS);
            itsatabkeymanager.focusInitialItem();
        }
    );
};

/**
 * Promise that will be resolved once the view is rendered.
 * This is asynchronious, because it also takes into account asynchronous loading of the tabkeymanager.
 *
 * @method isRendered
 * @return {Y.Promise} promised response --> resolve() OR reject(reason).
 * @since 0.2
*/
ITSAViewModel.prototype.isRendered = function() {
    Y.log('isRendered', 'info', 'ITSA-ViewModel');
    return this._renderPromise;
};

/**
 * Locks the view (all UI-elements of the form-model) in case model is Y.ITSAFormModel and the view is editable.
 * @method lockView
*/
ITSAViewModel.prototype.lockView = function() {
    var instance = this,
        model = instance.get(MODEL),
        // hidden parameter: 'nolock'
        nolock = arguments[0],
        canDisableModel = (instance.get(EDITABLE) && model && model.toJSONUI);

    Y.log('lockView', 'info', 'ITSA-ViewModel');
/*jshint expr:true */
    canDisableModel ? model.disableUI() : instance.get(CONTAINER).all('button').addClass(PURE_BUTTON_DISABLED);
    nolock || (instance._locked=true);
/*jshint expr:false */
};

/**
 * Removes custom buttonlabels defined with setButtonLabel().
 * Available buttontypes are:
 * <ul>
 *   <li>btn_abort</li>
 *   <li>btn_cancel</li>
 *   <li>btn_close</li>
 *   <li>btn_destroy</li>
 *   <li>btn_ignore</li>
 *   <li>btn_load</li>
 *   <li>btn_no</li>
 *   <li>btn_ok</li>
 *   <li>btn_remove</li>
 *   <li>btn_reset</li>
 *   <li>btn_retry</li>
 *   <li>btn_save</li>
 *   <li>btn_submit</li>
 *   <li>btn_yes</li>
 *   <li>imgbtn_abort</li>
 *   <li>imgbtn_cancel</li>
 *   <li>imgbtn_close</li>
 *   <li>imgbtn_destroy</li>
 *   <li>imgbtn_ignore</li>
 *   <li>imgbtn_load</li>
 *   <li>imgbtn_no</li>
 *   <li>imgbtn_ok</li>
 *   <li>imgbtn_remove</li>
 *   <li>imgbtn_reset</li>
 *   <li>imgbtn_retry</li>
 *   <li>imgbtn_save</li>
 *   <li>imgbtn_submit</li>
 *   <li>imgbtn_yes</li>
 *   <li>spinbtn_load</li>
 *   <li>spinbtn_remove</li>
 *   <li>spinbtn_save</li>
 *   <li>spinbtn_submit</li>
 * </ul>
 *
 * @method removeButtonLabel
 * @param [buttonType] {String} the buttontype which text was replaced, one of those mentioned above. If none specified, all custom labels are removed.
 * @since 0.3
 *
*/
ITSAViewModel.prototype.removeButtonLabel = function(buttonType) {
    var instance = this;
    Y.log('removeButtonLabel', 'info', 'ITSA-ViewModel');
/*jshint expr:true */
    buttonType ? (delete instance._customBtnLabels[buttonType]) : (instance._customBtnLabels = {});
/*jshint expr:false */
};

/**
 * Removes custom buttons defined with addCustomBtn().
 *
 * @method removeCustomBtn
 * @param [buttonId] {String} unique id that was used as the reference-property during templating. F.i. {btn_button_1}. if none specified, all custom buttons are removed.
 * @since 0.3
 *
*/
ITSAViewModel.prototype.removeCustomBtn = function(buttonId) {
    var instance = this;
    Y.log('removeCustomBtn', 'info', 'ITSA-ViewModel');
    delete this._customBtns[buttonId];
/*jshint expr:true */
    buttonId ? (delete instance._customBtns[buttonId]) : (instance._customBtns = {});
/*jshint expr:false */
};

/**
 * Removes custom buttonlabels defined with setButtonHotKey().
 * 'buttontype' should be one of the folowing buttonTypes:
 * <ul>
 *   <li>btn_abort</li>
 *   <li>btn_cancel</li>
 *   <li>btn_close</li>
 *   <li>btn_destroy</li>
 *   <li>btn_ignore</li>
 *   <li>btn_load</li>
 *   <li>btn_no</li>
 *   <li>btn_ok</li>
 *   <li>btn_remove</li>
 *   <li>btn_reset</li>
 *   <li>btn_retry</li>
 *   <li>btn_save</li>
 *   <li>btn_submit</li>
 *   <li>btn_yes</li>
 *   <li>imgbtn_abort</li>
 *   <li>imgbtn_cancel</li>
 *   <li>imgbtn_close</li>
 *   <li>imgbtn_destroy</li>
 *   <li>imgbtn_ignore</li>
 *   <li>imgbtn_load</li>
 *   <li>imgbtn_no</li>
 *   <li>imgbtn_ok</li>
 *   <li>imgbtn_remove</li>
 *   <li>imgbtn_reset</li>
 *   <li>imgbtn_retry</li>
 *   <li>imgbtn_save</li>
 *   <li>imgbtn_submit</li>
 *   <li>imgbtn_yes</li>
 *   <li>spinbtn_load</li>
 *   <li>spinbtn_remove</li>
 *   <li>spinbtn_save</li>
 *   <li>spinbtn_submit</li>
 * </ul>
 *
 * @method removeHotKey
 * @param [buttonType] {String} the buttontype whose hotkey should be removed --> should be one of the types mentioned above. If none specified, all hotkeys are removed.
 * @since 0.3
 *
*/
ITSAViewModel.prototype.removeHotKey = function(buttonType) {
    Y.log('removeHotKey', 'info', 'ITSA-ViewModel');

    var instance = this;
/*jshint expr:true */
    buttonType ? (delete instance._hotkeys[buttonType]) : (instance._hotkeys = {});
/*jshint expr:false */
    instance._createButtons();
};

/**
 * Removes the messageViewer-target that was set up by addMessageTarget().
 *
 * @method removeMessageTarget
 * @since 0.1
*/
ITSAViewModel.prototype.removeMessageTarget = function() {
    var model = this.get(MODEL);
/*jshint expr:true */
    model && model.removeMessageTarget && model.removeMessageTarget();
/*jshint expr:false */
};

/**
 * Removes the primarybutton (if set).
 *
 * @method removePrimaryButton
 * @since 0.5
**/
ITSAViewModel.prototype.removePrimaryButton = function() {
    var instance = this,
        buttons = instance._buttons;

    Y.log('removePrimaryButton', 'info', 'ITSA-ViewModel');
    YArray.each(
        buttons,
        function(button) {
            button.config.primary = false;
        }
    );
};

/**
 * Method that is responsible for rendering the Model into the view.
 *
 * @method render
 * @param [clear] {Boolean} whether to clear the view = making it empty without the template.
 * normally you don't want this: leaving empty means the Model is drawn.
 * @private
 * @chainable
 * @since 0.3
 *
*/
ITSAViewModel.prototype.render = function (clear, modelchange) {
    var instance = this,
        container = instance.get(CONTAINER),
        model = instance.get(MODEL),
        editMode = instance.get(EDITABLE),
        statusbar = instance.get(CAP_STATUSBAR),
        statusbarinstance = instance._itsastatusbar,
        itsaDateTimePicker = Y.Global.ItsaDateTimePicker,
        html = (clear || !model) ? '' : instance._modelRenderer(model),
        withfocusmanager;

    Y.log('render', 'info', 'ITSA-ViewModel');
/*jshint expr:true */
    // we should do a cleanup always, BUT
    // due to a bug that we haven't found yet, cleanup is no good when using itsaviewmodelpanel, where the footer
    // gets rerendered --> some node in the footer gets referenced while it doesn;t exists anymore.
    // that's why the conditional is created.

    // WELL: it seems we cannot call cleanup in no cases at all --> after *:change the view will be rerendered and
    // this seems to lead into buttons not listening to click (empty model-internals)
    // THUS: commented next line:

   // modelchange && !instance.get('partOfMultiView') && model && model.toJSONUI && model.cleanup();
   modelchange && model && model.toJSONUI && model.cleanup(container);



/*jshint expr:false */
    // Render this view's HTML into the container element.
    // Because Y.Node.setHTML DOES NOT destroy its nodes (!) but only remove(), we destroy them ourselves first
    if (editMode || instance._isMicroTemplate) {
        if (editMode) {
            instance._initialEditAttrs = model.getAttrs();
        }
// STILL there is a bug that we see when using gallery-itsaviewlogin: container.cleanup messes thing up.
// that is why temporarely commented clenaup:

       container.cleanup(instance._rendered);

    }
    else {
        // we should do a cleanup always, BUT
        // due to a bug that we haven't found yet, cleanup is no good when using itsaviewmodelpanel, where the footer
        // gets rerendered --> some node in the footer gets referenced while it doesn;t exists anymore.
        // that's why the conditional is created.
        if (!modelchange || !instance.get('partOfMultiView')) {
// STILL there is a bug that we see when using gallery-itsaviewlogin: container.cleanup messes thing up.
// that is why temporarely commented clenaup:

           container.cleanup(false);
        }
    }
    // Append the container element to the DOM if it's not on the page already.
    if (!instance._rendered) {
/*jshint expr:true */
        container.inDoc() || ((instance._newContainer=true) && Y.one('body').append(container));
/*jshint expr:false */
        container.addClass(ITSAVIEWMODEL);
        container.toggleClass(ITSAVIEWMODEL+'-'+STYLED, instance.get(STYLED));
        instance._setButtonTransform(instance.get(BUTTONTRANSFORM));
        instance._bindUI();
    }
    instance._rendered = true;
/*jshint expr:true */
    (html.length>0) && editMode && instance._viewNeedsForm && (html=(statusbar ? WRAPPERDIV : '')+'<form class="'+DEF_FORM_CLASS+'">'+html+'</form>'+(statusbar ? ENDDIV : ''));
/*jshint expr:false */

/*jshint expr:true */
    statusbar && (statusbarinstance || (html+=STATUSBAR_TEMPLATE));
/*jshint expr:false */

    container.setHTML(html);
    if (statusbar) {
        container.setAttribute(DATA_ITSASTATUSBAR, 'true');
        if (statusbarinstance) {
            container.append(statusbarinstance.get('parentNode'));
        }
        else {
            Y.usePromise(GALLERY_ITSASTATUSBAR).then(
                function() {
                    var node = container.one('.'+STATUSBAR_CLASS);
                    statusbarinstance = instance._itsastatusbar = new Y.ITSAStatusbar({parentNode: node});
                    // to make targeting Y.ITSAMessages to this instance posible:
                    instance._viewName = statusbarinstance._viewName;
                    if (model) {
                        Y.batch(Y.usePromise(GALLERY_ITSAMODELSYNCPROMISE), statusbarinstance.isReady()).then(
                            function() {
                                model.addMessageTarget(instance._itsastatusbar);
                            }
                        );
                    }
                    instance._repositionStatusbar();
                }
            );
        }
    }
    else {
        container.removeAttribute(DATA_ITSASTATUSBAR);
        instance._viewName = null;
    }

    withfocusmanager = editMode && instance.get(FOCUSMANAGED);
    instance._setFocusManager(withfocusmanager);
    if (withfocusmanager) {
        Y.usePromise(GALLERY+ITSATABKEYMANAGER).then(
            function() {
                instance._renderPromiseResolve();
                instance.fire(VIEWRENDERED, {target: instance});
            }
        );
    }
    else {
        instance._renderPromiseResolve();
        instance.fire(VIEWRENDERED, {target: instance});
    }

    if (itsaDateTimePicker && itsaDateTimePicker.panel.get('visible')) {
        itsaDateTimePicker.hide(true);
    }
    return instance;
};

/**
 * Creates a custom label for the buttons that are referenced by one of the folowing buttonTypes:
 * <ul>
 *   <li>btn_abort</li>
 *   <li>btn_cancel</li>
 *   <li>btn_close</li>
 *   <li>btn_destroy</li>
 *   <li>btn_ignore</li>
 *   <li>btn_load</li>
 *   <li>btn_no</li>
 *   <li>btn_ok</li>
 *   <li>btn_remove</li>
 *   <li>btn_reset</li>
 *   <li>btn_retry</li>
 *   <li>btn_save</li>
 *   <li>btn_submit</li>
 *   <li>btn_yes</li>
 *   <li>imgbtn_abort</li>
 *   <li>imgbtn_cancel</li>
 *   <li>imgbtn_close</li>
 *   <li>imgbtn_destroy</li>
 *   <li>imgbtn_ignore</li>
 *   <li>imgbtn_load</li>
 *   <li>imgbtn_no</li>
 *   <li>imgbtn_ok</li>
 *   <li>imgbtn_remove</li>
 *   <li>imgbtn_reset</li>
 *   <li>imgbtn_retry</li>
 *   <li>imgbtn_save</li>
 *   <li>imgbtn_submit</li>
 *   <li>imgbtn_yes</li>
 *   <li>spinbtn_load</li>
 *   <li>spinbtn_remove</li>
 *   <li>spinbtn_save</li>
 *   <li>spinbtn_submit</li>
 * </ul>
 * 'labelHTML' may consist <u>{label}</u> which will be replaced by the default internationalized labelHTML. This way you can create imagebuttons that still hold the default label.
 * <b>Note</b> The default buttonLabels are internationalized, this feature will be lost when using this method (unless you use <u>{label}</u> in the new labelHTML).
 *
 * @method setButtonLabel
 * @param buttonType {String} the buttontype which text should be replaced, which should be one of the types mentioned above.
 * @param labelHTML {String} new button-label
 * @since 0.3
 *
*/
ITSAViewModel.prototype.setButtonLabel = function(buttonType, labelHTML) {
    var instance = this;

    Y.log('setButtonLabel '+buttonType+' --> '+labelHTML, 'info', 'ITSA-ViewModel');
/*jshint expr:true */
    PROTECTED_BUTTON_TYPES[buttonType] && (typeof labelHTML === STRING) && (labelHTML.length>0) && (instance._customBtnLabels[buttonType]=labelHTML);
/*jshint expr:false */
};

/**
 * Creates custom labels for multiple buttons. Passes through to setButtonLabel (see that method for possible buttonvalues).
 *
 * @method setButtonLabels
 * @param buttons {Array} Array of objects with properties buttons.buttonType and buttonConfig.labelHTML
 * @since 0.4
 *
*/
ITSAViewModel.prototype.setButtonLabels = function(buttons) {
    var instance = this;
    Y.log('setButtonLabels', 'info', 'ITSA-ViewModel');
/*jshint expr:true */
    Lang.isArray(buttons) && (YArray.each(
        buttons,
        function(buttonConfig) {
            buttonConfig.buttonType && buttonConfig.labelHTML && instance.setButtonLabel(buttonConfig.buttonType, buttonConfig.labelHTML);
        }
    ));
/*jshint expr:false */
};

/**
 * Creates a listener to the specific hotkey (character). The hotkey will be bound to the specified buttonType, that should be one of types mentioned below.
 * The hotkey-character will be marked with the css-class 'itsa-hotkey' (span-element), which underscores by default, but can be overruled.
 * <ul>
 *   <li>btn_abort</li>
 *   <li>btn_cancel</li>
 *   <li>btn_close</li>
 *   <li>btn_destroy</li>
 *   <li>btn_ignore</li>
 *   <li>btn_load</li>
 *   <li>btn_no</li>
 *   <li>btn_ok</li>
 *   <li>btn_remove</li>
 *   <li>btn_reset</li>
 *   <li>btn_retry</li>
 *   <li>btn_save</li>
 *   <li>btn_submit</li>
 *   <li>btn_yes</li>
 *   <li>imgbtn_abort</li>
 *   <li>imgbtn_cancel</li>
 *   <li>imgbtn_close</li>
 *   <li>imgbtn_destroy</li>
 *   <li>imgbtn_ignore</li>
 *   <li>imgbtn_load</li>
 *   <li>imgbtn_no</li>
 *   <li>imgbtn_ok</li>
 *   <li>imgbtn_remove</li>
 *   <li>imgbtn_reset</li>
 *   <li>imgbtn_retry</li>
 *   <li>imgbtn_save</li>
 *   <li>imgbtn_submit</li>
 *   <li>imgbtn_yes</li>
 *   <li>spinbtn_load</li>
 *   <li>spinbtn_remove</li>
 *   <li>spinbtn_save</li>
 *   <li>spinbtn_submit</li>
 * </ul>
 *
 * @method setHotKey
 * @param buttonType {String} the buttontype which receives the hotkey, which should be one of the types mentioned above.
 * @param hotkey {String|Object} character that act as a hotkey: 'alt+char' will focus and click the button.
 *                               The hotkey-character will be marked with the css-class 'itsa-hotkey' (span-element), which underscores by default, but can be overruled.
 *                               If you want to Internationize, the you need to supply an object where the properties are the language-tag and the values a string (character).
 *                               F.i. {us: 'a', nl: 'o'}. When Internationize, there will be no hotkey when the used language is not found in the hotkey-object.
 * @since 0.3
 *
*/
ITSAViewModel.prototype.setHotKey = function(buttonType, hotkey) {
    var instance = this;

    Y.log('setHotKey', 'info', 'ITSA-ViewModel');
/*jshint expr:true */
    PROTECTED_BUTTON_TYPES[buttonType] && ((typeof hotkey === STRING) || Lang.isObject(hotkey)) && (instance._hotkeys[buttonType]=hotkey) && instance._createButtons();
/*jshint expr:false */
};

/**
 * Creates hotkeys for multiple buttons. Passes through to setHotKey (see that method for possible buttonvalues).
 *
 * @method setHotKeys
 * @param buttons {Array} Array of objects with properties buttons.buttonType and buttonConfig.hotkey
 * @since 0.4
 *
*/
ITSAViewModel.prototype.setHotKeys = function(buttons) {
    var instance = this;
    Y.log('setHotKeys', 'info', 'ITSA-ViewModel');
/*jshint expr:true */
    Lang.isArray(buttons) && (YArray.each(
        buttons,
        function(buttonConfig) {
            buttonConfig.buttonType && buttonConfig.hotkey && instance.setHotKey(buttonConfig.buttonType, buttonConfig.hotkey);
        }
    ));
/*jshint expr:false */
};

/**
 * Sets the primarybutton of one of the next buttontypes:
 * <ul>
 *   <li>btn_abort</li>
 *   <li>btn_cancel</li>
 *   <li>btn_close</li>
 *   <li>btn_destroy</li>
 *   <li>btn_ignore</li>
 *   <li>btn_load</li>
 *   <li>btn_no</li>
 *   <li>btn_ok</li>
 *   <li>btn_remove</li>
 *   <li>btn_reset</li>
 *   <li>btn_retry</li>
 *   <li>btn_save</li>
 *   <li>btn_submit</li>
 *   <li>btn_yes</li>
 *   <li>imgbtn_abort</li>
 *   <li>imgbtn_cancel</li>
 *   <li>imgbtn_close</li>
 *   <li>imgbtn_destroy</li>
 *   <li>imgbtn_ignore</li>
 *   <li>imgbtn_load</li>
 *   <li>imgbtn_no</li>
 *   <li>imgbtn_ok</li>
 *   <li>imgbtn_remove</li>
 *   <li>imgbtn_reset</li>
 *   <li>imgbtn_retry</li>
 *   <li>imgbtn_save</li>
 *   <li>imgbtn_submit</li>
 *   <li>imgbtn_yes</li>
 *   <li>spinbtn_load</li>
 *   <li>spinbtn_remove</li>
 *   <li>spinbtn_save</li>
 *   <li>spinbtn_submit</li>
 * </ul>
 *
 * @method setPrimaryButton
 * @param buttonType {String} the buttontype which receives the hotkey, which should be one of the types mentioned above.
 * @since 0.4
**/
ITSAViewModel.prototype.setPrimaryButton = function(buttonType) {
    var instance = this,
        buttons = instance._buttons;
    if (PROTECTED_BUTTON_TYPES[buttonType]) {
        Y.log('setPrimaryButton buttontype '+buttonType, 'info', 'ITSA-ViewModel');
        YArray.each(
            buttons,
            function(button) {
                button.config.primary = (button.propertykey===buttonType);
            }
        );
    }
    else {
        Y.log('setPrimaryButton --> invalid buttontype '+buttonType, 'warn', 'ITSA-ViewModel');
    }
};

/**
  * Returns the view's model-attributes by calling its model.toJSON(). If model is an object
  * then the object will return as it is.
  * @method toJSON
  * @return {Object} Copy of this model's attributes.
  * @since 0.3
 **/
ITSAViewModel.prototype.toJSON = function() {
    var model = this.get(MODEL);

    Y.log('toJSON', 'info', 'ITSA-ViewModel');
    return (model instanceof Y.Model) ? model.toJSON() : model;
};

/**
  * Translates the given 'text; through Y.Int of this module. Possible text's that can be translated are:
  * <ul>
  *   <li>abort</li>
  *   <li>cancel</li>
  *   <li>close</li>
  *   <li>destroy</li>
  *   <li>ignore</li>
  *   <li>load</li>
  *   <li>reload</li>
  *   <li>no</li>
  *   <li>ok</li>
  *   <li>remove</li>
  *   <li>reset</li>
  *   <li>retry</li>
  *   <li>save</li>
  *   <li>submit</li>
  *   <li>yes</li>
  * </ul>
  *
  * @method translate
  * @param text {String} the text to be translated
  * @return {Y.Promise} resolve(translated) --> Translated text or the original text (if no translattion was possible)
  * @since 0.3
**/
ITSAViewModel.prototype.translate = function(text) {
    Y.log('translate', 'info', 'ITSA-ViewModel');
    return this._intl[text] || text;
};

/**
  * Translates the given 'text; through Y.Int of this module. Possible text's that can be translated are:
  * <ul>
  *   <li>abort</li>
  *   <li>cancel</li>
  *   <li>close</li>
  *   <li>destroy</li>
  *   <li>ignore</li>
  *   <li>load</li>
  *   <li>reload</li>
  *   <li>no</li>
  *   <li>ok</li>
  *   <li>remove</li>
  *   <li>reset</li>
  *   <li>retry</li>
  *   <li>save</li>
  *   <li>submit</li>
  *   <li>yes</li>
  * </ul>
  *
  * @method translatePromise
  * @static
  * @param text {String} the text to be translated
  * @return {Y.Promise} resolve(translated) --> Translated text or the original text (if no translattion was possible)
  * @since 0.3
**/
ITSAViewModel.translatePromise = function(text) {
    Y.log('translatePromise', 'info', 'ITSA-ViewModel');
    return Y.usePromise('intl').then(
        function() {
            var intl = YIntl.get(GALLERY+ITSAVIEWMODEL);
            return intl[text] || text;
        },
        function() {
            return text;
        }
    );
};
ITSAViewModel.prototype.translatePromise = ITSAViewModel.translatePromise;

/**
 * Unlocks the view (all UI-elements of the form-model) in case model is Y.ITSAFormModel and the view is editable.
 *
 * @method unlockView
 * @since 0.3
*/
ITSAViewModel.prototype.unlockView = function() {
    var instance = this,
        model = instance.get(MODEL),
        canEnableModel = (instance.get(EDITABLE) && model && model.toJSONUI);

    Y.log('unlockView', 'info', 'ITSA-ViewModel');
/*jshint expr:true */
    canEnableModel ? model.enableUI() : instance.get(CONTAINER).all('button').removeClass(PURE_BUTTON_DISABLED);
/*jshint expr:false */
    instance._locked = false;
};

/**
 * Cleans up bindings
 * @method destructor
 * @protected
 * @since 0.3
*/
ITSAViewModel.prototype.destructor = function() {
    var instance = this,
        model = instance.get(MODEL),
        statusbarinstance = instance._itsastatusbar,
        container = instance.get(CONTAINER);

    Y.log('destructor', 'info', 'ITSA-ViewModel');
/*jshint expr:true */
    model && model.removeTarget && model.removeTarget(instance);
/*jshint expr:false */
    instance._itsastatusbar = null;

    if (statusbarinstance) {
/*jshint expr:true */
        model && model.removeMessageTarget(statusbarinstance);
/*jshint expr:false */
        statusbarinstance.destroy();
    }

    instance._clearEventhandlers();
    instance._customBtns = {};
    instance._customBtnLabels = {};
    instance._hotkeys = {};

    container.empty();
    if (instance._newContainer) {
        container.remove(true);
    }
    else {
        container.removeClass(ITSAVIEWMODEL+'-'+STYLED);
        container.destroy(true);
    }
  };

//===============================================================================================
// private methods
//===============================================================================================

/**
 * Sets up DOM and CustomEvent listeners for the view.
 *
 * @method _bindUI
 * @private
 * @protected
  * @since 0.3
*/
ITSAViewModel.prototype._bindUI = function() {
    var instance = this,
        container = instance.get(CONTAINER),
        eventhandlers = instance._eventhandlers;
    Y.log('_bindUI', 'info', 'ITSA-ViewModel');

    eventhandlers.push(
        instance.after(
            MODEL+CHANGE,
            function(e) {
                Y.log('aftersubscriptor '+e.type, 'info', 'ITSA-ViewModel');
                var prevVal = e.prevVal,
                    newVal = e.newVal,
                    prevFormModel = prevVal && prevVal.toJSONUI,
                    newFormModel = newVal && newVal.toJSONUI,
                    statusbar = instance.get(CAP_STATUSBAR);
                if (prevVal) {
/*jshint expr:true */
                    prevVal.removeTarget && prevVal.removeTarget(instance);
                    statusbar && prevVal.removeMessageTarget(instance._itsastatusbar);
                }
                if (newVal) {
                    newVal.addTarget && newVal.addTarget(instance);
                    if (statusbar) {
                        Y.usePromise(GALLERY_ITSAMODELSYNCPROMISE).then(
                            function() {
                                newVal.addMessageTarget(instance._itsastatusbar);
                            }
                        );
                    }
                }
                (prevFormModel !== newFormModel) && newFormModel && instance.get(TEMPLATE) && instance._setTemplateRenderer();
/*jshint expr:false */
                instance.render(false, prevFormModel);
            }
        )
    );
    eventhandlers.push(
        instance.after(
            TEMPLATE+CHANGE,
            function() {
                Y.log('aftersubscriptor templateChange', 'info', 'ITSA-ViewModel');
                if (instance.get(MODEL)) {
                    instance._setTemplateRenderer();
                    instance.render();
                }
            }
        )
    );
    eventhandlers.push(
        instance.after(
            CAP_STATUSBAR+CHANGE,
            Y.bind(instance.render, instance)
        )
    );
    eventhandlers.push(
        instance.after(
            '*:'+RESET,
            function() {
                Y.log('aftersubscriptor reset', 'info', 'ITSA-ViewModel');
                if (instance._isMicroTemplate) {
                    // need to re-render because the code might have made items visible/invisible based on their value
                    instance.render();
                }
                else {
                    container.pluginReady(ITSATABKEYMANAGER, PLUGIN_TIMEOUT).then(
                        function(itsatabkeymanager) {
                            itsatabkeymanager.focusInitialItem();
                        }
                    );
                }
            }
        )
    );
    eventhandlers.push(
        instance.after(
            EDITABLE+CHANGE,
            function() {
                Y.log('aftersubscriptor editableChange', 'info', 'ITSA-ViewModel');
                var model = instance.get(MODEL);
                // if model.toJSONUI exists, then we need to rerender
                if (instance.get(TEMPLATE) && model && model.toJSONUI) {
                    instance._setTemplateRenderer();
                    instance.render();
                }
            }
        )
    );
    eventhandlers.push(
        instance.after(
            '*:change',
            function(e) {
                Y.log('aftersubscriptor '+e.type, 'info', 'ITSA-ViewModel');
                if ((e.target instanceof Y.Model) && !e.formelement) {
                    instance.render();
                }
            }
        )
    );

/*jshint expr:true */
    instance.get('partOfMultiView') || eventhandlers.push(
        instance.on(
            '*:datepickerclick',
            function() {
                Y.log('onsubscriptor *:datepickerclick', 'info', 'ITSA-ViewModel');
                instance.lockView();
                instance.once('*:'+FOCUS_NEXT, function() {
                    instance.unlockView();
                });
            }
        )
    );

    instance.get('partOfMultiView') || eventhandlers.push(
        instance.on(
            '*:'+RESET,
            Y.bind(instance._disableSaveBtns, instance)
        )
    );

    instance.get('partOfMultiView') || eventhandlers.push(
        instance.on(
            ['*:'+SUBMIT, '*:'+SAVE, '*:'+LOAD, '*:'+DESTROY],
            function(e) {
                Y.log('onsubscriptor '+e.type, 'info', 'ITSA-ViewModel');
                var promise = e.promise,
                    model = e.target,
                    eventType = e.type.split(':')[1],
                    options = e.options,
                    messageController = Y.ITSAMessageController,
                    statusbar = model._itsamessageListener || (messageController && messageController._targets[MODEL+'sync']),
                    destroyWithoutRemove = ((eventType===DESTROY) && options && (options.remove || options[DELETE])),
                    prevAttrs;
                if (!destroyWithoutRemove && (model instanceof Y.Model)) {
                    if ((eventType===SUBMIT) || (eventType===SAVE)) {
                        prevAttrs = model.getAttrs();
                        instance.get(EDITABLE) && model.UIToModel();
                    }
                    if ((eventType!==SAVE) || (model.isModified())) {
                        instance._lockedBefore = instance._locked;
                        instance.lockView(true);
                        statusbar || instance._setSpin(eventType, true);
                        (eventType===DESTROY) || promise.then(
                            function() {
                                ((eventType===LOAD) || (eventType===SUBMIT) || (eventType===SAVE)) && model.setResetAttrs();
                            },
                            function() {
                                ((eventType===SUBMIT) || (eventType===SAVE)) && model.setAttrs(prevAttrs, {fromInternal: true});
                                return true; // make promise fulfilled
                            }
                        ).then(
                            function() {
                                statusbar || instance._setSpin(eventType, false);
                                instance._lockedBefore || instance.unlockView();
                                (eventType===SUBMIT) || instance._disableSaveBtns();
                                container.pluginReady(ITSATABKEYMANAGER, PLUGIN_TIMEOUT).then(
                                    function(itsatabkeymanager) {
                                        itsatabkeymanager.focusInitialItem();
                                    }
                                );
                            }
                        );
                    }
                    else {
                        (eventType===SAVE) && instance._disableSaveBtns();
                    }
                }
            }
        )
    );
/*jshint expr:false */

    eventhandlers.push(
        instance.on(
            '*:nodeChange', // cones from EditorBase
            function(e) {
                Y.log('aftersubscriptor '+e.type, 'info', 'ITSA-ViewModel');
                instance._enableSaveBtns();
            }
        )
    );
    eventhandlers.push(
        instance.after(
            '*:destroy',
            function(e) {
                Y.log('aftersubscriptor '+e.type, 'info', 'ITSA-ViewModel');
                if (e.target instanceof Y.Model) {
                    instance.render(true);
                }
            }
        )
    );
    eventhandlers.push(
        instance.after(
            CONTAINER+CHANGE,
            function(e) {
                Y.log('aftersubscriptor '+e.type, 'info', 'ITSA-ViewModel');
                instance._contIsForm = (e.newVal.get(TAGNAME)===FORM_CAPITALIZED);
            }
        )
    );
    eventhandlers.push(
        container.after(
            CLICK,
            function() {
                Y.log('container aftersubscriptor click', 'info', 'ITSA-ViewModel');
                container.addClass(FOCUSED_CLASS); // do not call focus(), because the tabkeymanager will set focus to UI itself: don't do this twice
            }
        )
    );
    eventhandlers.push(
        container.after(
            CLICKOUTSIDE,
            function() {
                Y.log('container aftersubscriptor clickoutsie', 'info', 'ITSA-ViewModel');
                container.removeClass(FOCUSED_CLASS);
            }
        )
    );
    eventhandlers.push(
        Y.Intl.after( // subscribe to the after event, so the formmodel gets updated sooner: that one is subscribing the on-event
            'intl:lang'+CHANGE,
            function() {
                Y.log('Y.Intl aftersubscriptor intl:langChange', 'info', 'ITSA-ViewModel');
                instance._intl = Y.Intl.get(GALLERY+ITSAVIEWMODEL);
                instance.render();
            }
        )
    );
    eventhandlers.push(
        instance.after(
            STYLED+CHANGE,
            function(e) {
                Y.log('aftersubscriptor styledChange', 'info', 'ITSA-ViewModel');
                container.toggleClass(ITSAVIEWMODEL+'-'+STYLED, e.newVal);
            }
        )
    );
    eventhandlers.push(
        instance.after(
            FOCUSMANAGED+CHANGE,
            function(e) {
                Y.log('aftersubscriptor '+e.type, 'info', 'ITSA-ViewModel');
                instance._setFocusManager(e.newVal);
            }
        )
    );

    eventhandlers.push(
        instance.after(
            BUTTONTRANSFORM+CHANGE,
            function(e) {
                Y.log('aftersubscriptor '+e.type, 'info', 'ITSA-ViewModel');
                instance._setButtonTransform(e.newVal);
            }
        )
    );

    eventhandlers.push(
        instance.after(
            UI_CHANGED,
            Y.bind(instance._enableSaveBtns, instance)
        )
    );

    YArray.each(
        [CLICK, VALIDATION_ERROR, UI_CHANGED, FOCUS_NEXT],
        function(event) {
            eventhandlers.push(
                instance.on(
                    '*:'+event,
                    function(e) {
                        Y.log('onsubscriptor '+e.type, 'info', 'ITSA-ViewModel');
                        var validEvent = true,
                            newevent = event,
                            payload, button;
                        // check if e.target!==instance, because it checks by *: and will recurse
                        // also check if e.currentTarget===instance, because you might get double events after itsamodelsyncpromise did _asyncPublishing
                        if ((e.target!==instance) && (e.currentTarget===instance)) {
                            if (event===CLICK) {
                                button = e.type.split(':')[0];
                                if (VALID_BUTTON_TYPES[button]) {
                                    newevent = button+event; // refire without ':'
                                }
                                else {
                                   validEvent = false;
                                }
                            }
                            payload = {
                                type: newevent,
                                model: instance.get(MODEL),
                                modelEventFacade: e,
                                target: instance,
                                value: e.value,
                                node: e.node,
                                nodeid: e.nodeid,
                                nodelist: e.nodelist, // in case of VALIDATION_ERROR
                                formElement: e.formElement
                            };
                            Y.log('refiring model-event '+newevent+' by itsaviewmodel', 'info', 'ITSA-ViewModel');
                            if (validEvent) {
                                instance.fire(newevent, payload);
                                if ((newevent===BUTTON_CLICK) && (e.value===CLOSE)) {
                                    // also fire the buttonclose-event
                                    payload.type = newevent = BUTTON_CLOSE;
                                    instance.fire(newevent, payload);
                                }
                            }
                        }
                    }
                )
            );
        }
    );
};

/**
 * Saves the view's model-instance.
 *
 * @method modelSave
 * @since 0.3
 *
*/

/**
 * Destroys the view's model-instance.
 *
 * @method modelDestroy
 * @since 0.3
 *
*/

/**
 * Loads the view's model-instance.
 *
 * @method modelLoad
 * @since 0.3
 *
*/

/**
 * Resets the view's model-instance: which causes UI-elements to reset (in case of a editable form)
 *
 * @method modelReset
 * @since 0.3
 *
*/

/**
 * Submits the view's model-instance.
 *
 * @method modelSubmit
 * @since 0.3
 *
*/
YArray.each(
    [SAVE_FIRSTCAP, SUBMIT_FIRSTCAP, LOAD_FIRSTCAP, DESTROY_FIRSTCAP, RESET_FIRSTCAP],
    function(fn) {
        ITSAViewModel.prototype[MODEL+fn] = function() {
            var instance = this,
                model = instance.get(MODEL);

            Y.log(MODEL+fn, 'info', 'ITSA-ViewModel');
/*jshint expr:true */
            (model instanceof Y.Model) && !model.get(DESTROYED) && model[DEF_FN+fn] && model[DEF_FN+fn]();
/*jshint expr:false */
        };
    }
);

/**
 * Saves the view's model-instance using model.savePromise().
 *
 * @method modelSavePromise
 * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
 *                 implementation to determine what options it supports or requires, if any.
 * @return {Y.Promise} promised response --> resolve(response) OR reject(reason).
 * @since 0.3
 *
*/

/**
 * Destroys the view's model-instance using model.destroyPromise().
 *
 * @method modelDestroyPromise
 * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
 *                 implementation to determine what options it supports or requires, if any.
 * @return {Y.Promise} promised response --> resolve(response) OR reject(reason).
 * @since 0.3
 *
*/

/**
 * Loads the view's model-instance using model.loadPromise().
 *
 * @method modelLoadPromise
 * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
 *                 implementation to determine what options it supports or requires, if any.
 * @return {Y.Promise} promised response --> resolve(response) OR reject(reason).
 * @since 0.3
 *
*/

/**
 * Submits the view's model-instance using model.submitPromise().
 *
 * @method modelSubmitPromise
 * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
 *                 implementation to determine what options it supports or requires, if any.
 * @return {Y.Promise} promised response --> resolve(response) OR reject(reason).
 * @since 0.3
 *
*/
YArray.each(
    [SAVE_FIRSTCAP, SUBMIT_FIRSTCAP, LOAD_FIRSTCAP, DESTROY_FIRSTCAP],
    function(fn) {
        ITSAViewModel.prototype[MODEL+fn+PROMISE] = function() {
            var instance = this,
                model = instance.get(MODEL),
                fnLower = fn.toLowerCase();

            Y.log(MODEL+fn+PROMISE, 'info', 'ITSA-ViewModel');
/*jshint expr:true */
            return ((model instanceof Y.Model) && !model.get(DESTROYED) && model[fnLower+PROMISE]) || null;
        };
/*jshint expr:false */
    }
);

/**
 * Cleaning up all eventlisteners
 *
 * @method _clearEventhandlers
 * @private
 * @since 0.3
 *
*/
ITSAViewModel.prototype._clearEventhandlers = function() {
    Y.log('_clearEventhandlers', 'info', 'ITSA-ViewModel');
    YArray.each(
        this._eventhandlers,
        function(item){
            item.detach();
        }
    );
};

/**
 * Creates button-properties so that the templates can refer them. The next button-properties are defined:
 * <ul>
 *   <li>btn_abort</li>
 *   <li>btn_cancel</li>
 *   <li>btn_close</li>
 *   <li>btn_destroy</li>
 *   <li>btn_ignore</li>
 *   <li>btn_load</li>
 *   <li>btn_no</li>
 *   <li>btn_ok</li>
 *   <li>btn_remove</li>
 *   <li>btn_reset</li>
 *   <li>btn_retry</li>
 *   <li>btn_save</li>
 *   <li>btn_submit</li>
 *   <li>btn_yes</li>
 *   <li>imgbtn_abort</li>
 *   <li>imgbtn_cancel</li>
 *   <li>imgbtn_close</li>
 *   <li>imgbtn_destroy</li>
 *   <li>imgbtn_ignore</li>
 *   <li>imgbtn_load</li>
 *   <li>imgbtn_no</li>
 *   <li>imgbtn_ok</li>
 *   <li>imgbtn_remove</li>
 *   <li>imgbtn_reset</li>
 *   <li>imgbtn_retry</li>
 *   <li>imgbtn_save</li>
 *   <li>imgbtn_submit</li>
 *   <li>imgbtn_yes</li>
 *   <li>spinbtn_load</li>
 *   <li>spinbtn_remove</li>
 *   <li>spinbtn_save</li>
 *   <li>spinbtn_submit</li>
 * </ul>
 *
 * @method _createButtons
 * @private
 * @protected
 * @since 0.3
 *
*/
ITSAViewModel.prototype._createButtons = function() {
    var instance = this,
        customBtnLabels = instance._customBtnLabels,
        hotkeys = instance._hotkeys;

    Y.log('_createButtons', 'info', 'ITSA-ViewModel');
    instance._buttons = [
        {
            propertykey: BTN_ABORT,
            type: BUTTON,
            config: {value: ABORT, hotkey: hotkeys[BTN_ABORT]},
            labelHTML: function() { return customBtnLabels[BTN_ABORT] ? Lang.sub(customBtnLabels[BTN_ABORT], {label: instance._intl[ABORT]}) : instance._intl[ABORT]; }
        },
        {
            propertykey: BTN_CANCEL,
            type: BUTTON,
            config: {value: CANCEL, hotkey: hotkeys[BTN_CANCEL]},
            labelHTML: function() { return customBtnLabels[BTN_CANCEL] ? Lang.sub(customBtnLabels[BTN_CANCEL], {label: instance._intl[CANCEL]}) : instance._intl[CANCEL]; }
        },
        {
            propertykey: BTN_CLOSE,
            type: BUTTON,
            config: {value: CLOSE, hotkey: hotkeys[BTN_CLOSE]},
            labelHTML: function() { return customBtnLabels[BTN_CLOSE] ? Lang.sub(customBtnLabels[BTN_CLOSE], {label: instance._intl[CLOSE]}) : instance._intl[CLOSE]; }
        },
        {
            propertykey: BTN_DESTROY,
            type: DESTROY,
            config: {value: DESTROY, hotkey: hotkeys[BTN_DESTROY]},
            labelHTML: function() { return customBtnLabels[BTN_DESTROY] ? Lang.sub(customBtnLabels[BTN_DESTROY], {label: instance._intl[DESTROY]}) : instance._intl[DESTROY]; }
        },
        {
            propertykey: BTN_IGNORE,
            type: BUTTON,
            config: {value: IGNORE, hotkey: hotkeys[BTN_IGNORE]},
            labelHTML: function() { return customBtnLabels[BTN_IGNORE] ? Lang.sub(customBtnLabels[BTN_IGNORE], {label: instance._intl[IGNORE]}) : instance._intl[IGNORE]; }
        },
        {
            propertykey: BTN_LOAD,
            type: LOAD,
            config: {value: LOAD, hotkey: hotkeys[BTN_LOAD]},
            labelHTML: function() { return customBtnLabels[BTN_LOAD] ? Lang.sub(customBtnLabels[BTN_LOAD], {label: instance._intl[LOAD]}) : instance._intl[LOAD]; }
        },
        {
            propertykey: BTN_NO,
            type: BUTTON,
            config: {value: NO, hotkey: hotkeys[BTN_NO]},
            labelHTML: function() { return customBtnLabels[BTN_NO] ? Lang.sub(customBtnLabels[BTN_NO], {label: instance._intl[NO]}) : instance._intl[NO]; }
        },
        {
            propertykey: BTN_OK,
            type: BUTTON,
            config: {value: OK, hotkey: hotkeys[BTN_OK]},
            labelHTML: function() { return customBtnLabels[BTN_OK] ? Lang.sub(customBtnLabels[BTN_OK], {label: instance._intl[OK]}) : instance._intl[OK]; }
        },
        {
            propertykey: BTN_REMOVE,
            type: REMOVE,
            config: {value: REMOVE, hotkey: hotkeys[BTN_REMOVE]},
            labelHTML: function() { return customBtnLabels[BTN_REMOVE] ? Lang.sub(customBtnLabels[BTN_REMOVE], {label: instance._intl[REMOVE]}) : instance._intl[REMOVE]; }
        },
        {
            propertykey: BTN_RESET,
            type: RESET,
            config: {value: RESET, hotkey: hotkeys[BTN_RESET]},
            labelHTML: function() { return customBtnLabels[BTN_RESET] ? Lang.sub(customBtnLabels[BTN_RESET], {label: instance._intl[RESET]}) : instance._intl[RESET]; }
        },
        {
            propertykey: BTN_RETRY,
            type: BUTTON,
            config: {value: RETRY, hotkey: hotkeys[BTN_RETRY]},
            labelHTML: function() { return customBtnLabels[BTN_RETRY] ? Lang.sub(customBtnLabels[BTN_RETRY], {label: instance._intl[RETRY]}) : instance._intl[RETRY]; }
        },
        {
            propertykey: BTN_SAVE,
            type: SAVE,
            config: {classname: PURE_BUTTON_DISABLED, value: SAVE, hotkey: hotkeys[BTN_SAVE]},
            labelHTML: function() { return customBtnLabels[BTN_SAVE] ? Lang.sub(customBtnLabels[BTN_SAVE], {label: instance._intl[SAVE]}) : instance._intl[SAVE]; }
        },
        {
            propertykey: BTN_SUBMIT,
            type: SUBMIT,
            config: {value: SUBMIT, hotkey: hotkeys[BTN_SUBMIT]},
            labelHTML: function() {return customBtnLabels[BTN_SUBMIT] ? Lang.sub(customBtnLabels[BTN_SUBMIT], {label: instance._intl[SUBMIT]}) : instance._intl[SUBMIT]; }
        },
        {
            propertykey: BTN_YES,
            type: BUTTON,
            config: {value: YES, hotkey: hotkeys[BTN_YES]},
            labelHTML: function() { return customBtnLabels[BTN_YES] ? Lang.sub(customBtnLabels[BTN_YES], {label: instance._intl[YES]}) : instance._intl[YES]; }
        },
        {
            propertykey: IMGBTN_ABORT,
            type: BUTTON,
            config: {classname: BUTTON_ICON_LEFT, value: ABORT, hotkey: hotkeys[IMGBTN_ABORT]},
            labelHTML: function() { return customBtnLabels[IMGBTN_ABORT] ? Lang.sub(customBtnLabels[IMGBTN_ABORT], {label: instance._intl[ABORT]}) : (Lang.sub(IMAGE_BUTTON_TEMPLATE, {type: ABORT})+instance._intl[ABORT]); }
        },
        {
            propertykey: IMGBTN_CANCEL,
            type: BUTTON,
            config: {classname: BUTTON_ICON_LEFT, value: CANCEL, hotkey: hotkeys[IMGBTN_CANCEL]},
            labelHTML: function() { return customBtnLabels[IMGBTN_CANCEL] ? Lang.sub(customBtnLabels[IMGBTN_CANCEL], {label: instance._intl[CANCEL]}) : (Lang.sub(IMAGE_BUTTON_TEMPLATE, {type: CANCEL})+instance._intl[CANCEL]); }
        },
        {
            propertykey: IMGBTN_CLOSE,
            type: BUTTON,
            config: {classname: BUTTON_ICON_LEFT, value: CLOSE, hotkey: hotkeys[IMGBTN_CLOSE]},
            labelHTML: function() { return customBtnLabels[IMGBTN_CLOSE] ? Lang.sub(customBtnLabels[IMGBTN_CLOSE], {label: instance._intl[CLOSE]}) : (Lang.sub(IMAGE_BUTTON_TEMPLATE, {type: CANCEL})+instance._intl[CLOSE]); }
        },
        {
            propertykey: IMGBTN_DESTROY,
            type: DESTROY,
            config: {classname: BUTTON_ICON_LEFT, value: DESTROY, hotkey: hotkeys[IMGBTN_DESTROY]},
            labelHTML: function() { return customBtnLabels[IMGBTN_DESTROY] ? Lang.sub(customBtnLabels[IMGBTN_DESTROY], {label: instance._intl[DESTROY]}) : (Lang.sub(IMAGE_BUTTON_TEMPLATE, {type: DESTROY})+instance._intl[DESTROY]); }
        },
        {
            propertykey: IMGBTN_IGNORE,
            type: BUTTON,
            config: {classname: BUTTON_ICON_LEFT, value: IGNORE, hotkey: hotkeys[IMGBTN_IGNORE]},
            labelHTML: function() { return customBtnLabels[IMGBTN_IGNORE] ? Lang.sub(customBtnLabels[IMGBTN_IGNORE], {label: instance._intl[IGNORE]}) : (Lang.sub(IMAGE_BUTTON_TEMPLATE, {type: IGNORE})+instance._intl[IGNORE]); }
        },
        {
            propertykey: IMGBTN_LOAD,
            type: LOAD,
            config: {classname: BUTTON_ICON_LEFT, value: LOAD, hotkey: hotkeys[IMGBTN_LOAD]},
            labelHTML: function() { return customBtnLabels[IMGBTN_LOAD] ? Lang.sub(customBtnLabels[IMGBTN_LOAD], {label: instance._intl[LOAD]}) : (Lang.sub(IMAGE_BUTTON_TEMPLATE, {type: LOAD})+instance._intl[LOAD]); }
        },
        {
            propertykey: IMGBTN_NO,
            type: BUTTON,
            config: {classname: BUTTON_ICON_LEFT, value: NO, hotkey: hotkeys[IMGBTN_NO]},
            labelHTML: function() { return customBtnLabels[IMGBTN_NO] ? Lang.sub(customBtnLabels[IMGBTN_NO], {label: instance._intl[NO]}) : (Lang.sub(IMAGE_BUTTON_TEMPLATE, {type: NO})+instance._intl[NO]); }
        },
        {
            propertykey: IMGBTN_OK,
            type: BUTTON,
            config: {classname: BUTTON_ICON_LEFT, value: OK, hotkey: hotkeys[IMGBTN_OK]},
            labelHTML: function() { return customBtnLabels[IMGBTN_OK] ? Lang.sub(customBtnLabels[IMGBTN_OK], {label: instance._intl[OK]}) : (Lang.sub(IMAGE_BUTTON_TEMPLATE, {type: OK})+instance._intl[OK]); }
        },
        {
            propertykey: IMGBTN_REMOVE,
            type: REMOVE,
            config: {classname: BUTTON_ICON_LEFT, value: REMOVE, hotkey: hotkeys[IMGBTN_REMOVE]},
            labelHTML: function() { return customBtnLabels[IMGBTN_REMOVE] ? Lang.sub(customBtnLabels[IMGBTN_REMOVE], {label: instance._intl[REMOVE]}) : (Lang.sub(IMAGE_BUTTON_TEMPLATE, {type: REMOVE})+instance._intl[REMOVE]); }
        },
        {
            propertykey: IMGBTN_RESET,
            type: RESET,
            config: {classname: BUTTON_ICON_LEFT, value: RESET, hotkey: hotkeys[IMGBTN_RESET]},
            labelHTML: function() { return customBtnLabels[IMGBTN_RESET] ? Lang.sub(customBtnLabels[IMGBTN_RESET], {label: instance._intl[RESET]}) : (Lang.sub(IMAGE_BUTTON_TEMPLATE, {type: RESET})+instance._intl[RESET]); }
        },
        {
            propertykey: IMGBTN_RETRY,
            type: BUTTON,
            config: {classname: BUTTON_ICON_LEFT, value: RETRY, hotkey: hotkeys[IMGBTN_RETRY]},
            labelHTML: function() { return customBtnLabels[IMGBTN_RETRY] ? Lang.sub(customBtnLabels[IMGBTN_RETRY], {label: instance._intl[RETRY]}) : (Lang.sub(IMAGE_BUTTON_TEMPLATE, {type: RETRY})+instance._intl[RETRY]); }
        },
        {
            propertykey: IMGBTN_SAVE,
            type: SAVE,
            config: {classname: PURE_BUTTON_DISABLED+' '+BUTTON_ICON_LEFT, value: SAVE, hotkey: hotkeys[IMGBTN_SAVE]},
            labelHTML: function() { return customBtnLabels[IMGBTN_SAVE] ? Lang.sub(customBtnLabels[IMGBTN_SAVE], {label: instance._intl[SAVE]}) : (Lang.sub(IMAGE_BUTTON_TEMPLATE, {type: SAVE})+instance._intl[SAVE]); }
        },
        {
            propertykey: IMGBTN_SUBMIT,
            type: SUBMIT,
            config: {classname: BUTTON_ICON_LEFT, value: SUBMIT, hotkey: hotkeys[IMGBTN_SUBMIT]},
            labelHTML: function() { return customBtnLabels[IMGBTN_SUBMIT] ? Lang.sub(customBtnLabels[IMGBTN_SUBMIT], {label: instance._intl[SUBMIT]}) : (Lang.sub(IMAGE_BUTTON_TEMPLATE, {type: SUBMIT})+instance._intl[SUBMIT]); }
        },
        {
            propertykey: IMGBTN_YES,
            type: BUTTON,
            config: {classname: BUTTON_ICON_LEFT, value: YES, hotkey: hotkeys[IMGBTN_YES]},
            labelHTML: function() { return customBtnLabels[IMGBTN_YES] ? Lang.sub(customBtnLabels[IMGBTN_YES], {label: instance._intl[YES]}) : (Lang.sub(IMAGE_BUTTON_TEMPLATE, {type: YES})+instance._intl[YES]); }
        },
        {
            propertykey: SPINBTN_LOAD,
            type: LOAD,
            config: {spinbusy: true, classname: BUTTON_ICON_LEFT, value: LOAD, hotkey: hotkeys[SPINBTN_LOAD]},
            labelHTML: function() { return customBtnLabels[SPINBTN_LOAD] ? Lang.sub(customBtnLabels[SPINBTN_LOAD], {label: instance._intl[LOAD]}) : (Lang.sub(IMAGE_BUTTON_TEMPLATE, {type: LOAD})+instance._intl[LOAD]); }
        },
        {
            propertykey: SPINBTN_REMOVE,
            type: REMOVE,
            config: {spinbusy: true, classname: BUTTON_ICON_LEFT, value: REMOVE, hotkey: hotkeys[SPINBTN_REMOVE]},
            labelHTML: function() { return customBtnLabels[SPINBTN_REMOVE] ? Lang.sub(customBtnLabels[SPINBTN_REMOVE], {label: instance._intl[REMOVE]}) : (Lang.sub(IMAGE_BUTTON_TEMPLATE, {type: REMOVE})+instance._intl[REMOVE]); }
        },
        {
            propertykey: SPINBTN_SAVE,
            type: SAVE,
            config: {spinbusy: true, classname: PURE_BUTTON_DISABLED+' '+BUTTON_ICON_LEFT, value: SAVE, hotkey: hotkeys[SPINBTN_SAVE]},
            labelHTML: function() { return customBtnLabels[SPINBTN_SAVE] ? Lang.sub(customBtnLabels[SPINBTN_SAVE], {label: instance._intl[SAVE]}) : (Lang.sub(IMAGE_BUTTON_TEMPLATE, {type: SAVE})+instance._intl[SAVE]); }
        },
        {
            propertykey: SPINBTN_SUBMIT,
            type: SUBMIT,
            config: {spinbusy: true, classname: BUTTON_ICON_LEFT, value: SUBMIT, hotkey: hotkeys[SPINBTN_SUBMIT]},
            labelHTML: function() { return customBtnLabels[SPINBTN_SUBMIT] ? Lang.sub(customBtnLabels[SPINBTN_SUBMIT], {label: instance._intl[SUBMIT]}) : (Lang.sub(IMAGE_BUTTON_TEMPLATE, {type: SUBMIT})+instance._intl[SUBMIT]); }
        }
    ];
};

/**
 * default function of focusnext-event.
 * Will refocus to the next focusable UI-element.
 *
 * @method _defFn_focusnext
 * @private
*/
ITSAViewModel.prototype[DEF_FN+FOCUS_NEXT] = function() {
    Y.log('defaultFn of '+FOCUS_NEXT, 'info', 'ITSA-ViewModel');
    var instance = this,
        container = instance.get(CONTAINER);

/*jshint expr:true */
    container.hasClass(FOCUSED_CLASS) && container.pluginReady(ITSATABKEYMANAGER, PLUGIN_TIMEOUT).then(
        function(itsatabkeymanager) {
            Y.log('focus to next field', 'info', 'ITSA-ViewModel');
            itsatabkeymanager.next();
        },
        function() {
            Y.log('No focus to next field: Y.Plugin.ITSATabKeyManager not plugged in', 'info', 'ITSA-ViewModel');
        }
    );
/*jshint expr:false */
};

ITSAViewModel.prototype[DEF_PREV_FN+VALIDATION_ERROR] = function(e) {
    Y.log('preventDefaultFn of '+VALIDATION_ERROR, 'info', 'ITSA-ViewModel');
    e.modelEventFacade.preventDefault();
};

/**
 * default function of validation-error.
 * Will refocus to the next focusable UI-element.
 *
 * @method _defFn_validationerror
 * @private
*/
ITSAViewModel.prototype[DEF_FN+VALIDATION_ERROR] = function(e) {
    var node = e.nodelist && e.nodelist.item(0);

    Y.log('defaultFn of '+VALIDATION_ERROR, 'info', 'ITSA-ViewModel');
    //focus first item that misses validation
    if (node) {
        // if the node does not have focus yet, setting the focus will lead to tipy-popup.
        // when it already has the focus, no tipsy. Thus we need to popup ourselves
        // because Y.Tipsy.showTooltip() does not respond to the 'hideon' events, we will call _handleDelegateStart manually:

        if (node.getDOMNode()===Y.config.doc.activeElement) {
            Y.ITSAFormElement.tipsyInvalid._handleDelegateStart({currentTarget: node})
        }
        else {
            try {
                // ALWAYS focus nodes using try/catch to prevent js-error when node not in the dom
                node.focus();
            }
            catch(err) {}
        }
        node.scrollIntoView();
    }
};

/**
 * Disables 'save-buttons' when the model UI-elements gets in initial state
 *
 * @method _disableSaveBtns
 * @private
 * @since 0.4
*/
ITSAViewModel.prototype._disableSaveBtns = function() {
    var instance = this,
        saveButtons = instance.get(CONTAINER).all('button[data-buttonsubtype="save"]');
    saveButtons.addClass(PURE_BUTTON_DISABLED);
};

/**
 * Enables 'save-buttons' that were disabled when the model UI-elements were in initial state
 *
 * @method _enableSaveBtns
 * @private
 * @since 0.4
*/
ITSAViewModel.prototype._enableSaveBtns = function() {
    var instance = this,
        saveButtons = instance.get(CONTAINER).all('button[data-buttonsubtype="save"]');
    saveButtons.removeClass(PURE_BUTTON_DISABLED);
};

/**
 * Sets the right className to the container for making text-transForm of buttons. Configured by attribute 'buttonTransform'.<br />
 * Either one of these values:
 * <ul>
 *   <li>null --> leave as it is</li>
 *   <li>uppercase</li>
 *   <li>lowercase</li>
 *   <li>capitalize --> First character uppercase, the rest lowercase</li>
 * </ul>
 *
 * @method _setButtonTransform
 * @param type {String} new text-transform value
 * @private
 * @since 0.2
*/
ITSAViewModel.prototype._setButtonTransform = function(type) {
    var container = this.get(CONTAINER);

    Y.log('_setButtonTransform ', 'info', 'ITSAPanel');
    container.toggleClass(ITSABUTTON_UPPERCASE, (type===UPPERCASE));
    container.toggleClass(ITSABUTTON_LOWERCASE, (type===LOWERCASE));
    container.toggleClass(ITSABUTTON_CAPITALIZE, (type===CAPITALIZE));
};

/**
 * Sets or unsets the focusManager (provided by gallery-itsatabkeymanager)
 *
 * @method _setFocusManager
 * @private
 * @param activate {Boolean}
 * @since 0.3
 *
*/
ITSAViewModel.prototype._setFocusManager = function(activate) {
    var instance = this,
        container = instance.get(CONTAINER),
        itsatabkeymanager = container.itsatabkeymanager;
    Y.log('_setFocusManager to '+activate, 'info', 'ITSA-ViewModel');
    if (activate) {
        // If Y.Plugin.ITSATabKeyManager is plugged in, then refocus to the first item
        Y.use(GALLERY+ITSATABKEYMANAGER, function() {
            if (!instance.get(DESTROYED)) {
                if (itsatabkeymanager) {
                    itsatabkeymanager.refresh(container);
                }
                else {
                    container.plug(Y.Plugin.ITSATabKeyManager);
                    itsatabkeymanager = container.itsatabkeymanager;
                    instance.addTarget(itsatabkeymanager);
                }
                if (container.hasClass(FOCUSED_CLASS)) {
                    container.itsatabkeymanager.focusInitialItem();
                }
            }
        });
    }
    else {
/*jshint expr:true */
        itsatabkeymanager && instance.removeTarget(itsatabkeymanager) && container.unplug(ITSATABKEYMANAGER);
/*jshint expr:false */
    }
};

/**
 * Setter for attribute MODEL
 *
 * @method _setModel
 * @private
 * @param v {String|Object|Model}
 * @since 0.3
 *
*/
ITSAViewModel.prototype._setModel = function(v) {
    var instance = this;
    // in case model is a string --> not a real model is set: we just need to render clear text.
    // to achieve this, we create a new model-object with no properties and we define this._textTemplate
    // which will be used as the template (= text without properties)
    if (typeof v === STRING) {
        instance._textTemplate = v;
        v = {};
    }
    else {
        instance._textTemplate = null;
    }
    if (!instance._formcss_loaded && v && v.toJSONUI) {
        instance._formcss_loaded = true;
        Y.use('gallerycss-itsa-form'); // asynchroniously load iconfonts
    }
    return v;
};

/**
 * Transforms the buttonicon into a 'spinner'-icon or reset to original icon.
 * In case there are multiple of the same buttontypes rendered, all are affected.
 *
 * @method _setSpin
 * @private
 * @param buttonType {String} buttontype which is to be affected.
 * @param spin {Boolean} whether to spin or not (=return to default).
 * @since 0.3
 *
*/
ITSAViewModel.prototype._setSpin = function(buttonType, spin) {
    var instance = this,
        buttonicons = instance.get(CONTAINER).all('[data-buttonsubtype="'+buttonType+'"] i');
    buttonicons.toggleClass('itsaicon-form-loading', spin);
    buttonicons.toggleClass('itsa-busy', spin);
};

/**
 * Function-factory that binds a function to the property '_modelRenderer'. '_modelRenderer' will be defined like
 * _modelRenderer = function(model) {return {String}};
 * which means: it will return a rendered String that is modified by the attribute 'template'. The rendering
 * is done either by Y.Lang.sub or by Y.Template.Micro, depending on the value of 'template'.
 *
 * @method _setTemplateRenderer
 * @param editTemplate {Any} whether or not the template should use UI-elements - from Y.ITSAFormElement
 * @private
 * @chainable
 * @since 0.3
 *
*/
ITSAViewModel.prototype._setTemplateRenderer = function() {
    var instance = this,
        template = instance.get(TEMPLATE),
        editMode = instance.get(EDITABLE),
        isMicroTemplate, ismicrotemplate, compiledModelEngine, buttonsToJSON;
    Y.log('_clearEventhandlers', 'info', 'ITSA-ViewModel');
    isMicroTemplate = function() {
        var microTemplateRegExp = /<%(.+)%>/;
        return microTemplateRegExp.test(template);
    };
    buttonsToJSON = function(jsondata, model, micro) {
        var propertykey, type, labelHTML, config, propertyEmbraced;
        YArray.each(
            instance._buttons,
            function(buttonobject) {
                propertykey = buttonobject.propertykey;
                propertyEmbraced = micro ? (new RegExp('<%==? (data|this).'+propertykey+' %>')) : (new RegExp('{'+propertykey+'}'));
                if (propertyEmbraced.test(template)) {
                    type = buttonobject.type;
                    labelHTML = buttonobject.labelHTML(); // is a function!
                    config = buttonobject.config;
                    jsondata[propertykey] = model._renderBtnFns[type] && model._renderBtnFns[type].call(model, labelHTML, config);
                }
            }
        );
        // now add the custom buttons
        YObject.each(
            instance._customBtns,
            function(buttonobject, propertykey) {
                propertyEmbraced = micro ? (new RegExp('<%==? (data|this).'+propertykey+' %>')) : (new RegExp('{'+propertykey+'}'));
                if (propertyEmbraced.test(template)) {
                    labelHTML = buttonobject.labelHTML; // is a property
                    config = buttonobject.config;
                    jsondata[propertykey] = model._renderBtnFns[BUTTON] && model._renderBtnFns[BUTTON].call(model, labelHTML, config);
                }
            }
        );
    };
    ismicrotemplate = instance._isMicroTemplate = isMicroTemplate();
    if (ismicrotemplate) {
        compiledModelEngine = YTemplateMicro.compile(template);
        instance._modelRenderer = function(model) {
            var jsondata = editMode ? model.toJSONUI(null, template) : instance.toJSON();
            // if model is instance of Y.ITSAFormModel, then add the btn_buttontype-properties:
/*jshint expr:true */
            model.toJSONUI && buttonsToJSON(jsondata, model, true);
/*jshint expr:false */
            return compiledModelEngine(jsondata);
        };
    }
    else {
        instance._modelRenderer = function(model) {
            var jsondata = editMode ? model.toJSONUI(null, template) : instance.toJSON();
/*jshint expr:true */
            model.toJSONUI && buttonsToJSON(jsondata, model, false);
/*jshint expr:false */
            return Lang.sub(template, jsondata);
        };
    }
    // now check whether there is a form-element inside the template.
    // If not, then we need to generate one during render.
    instance._viewNeedsForm = !instance._contIsForm && !(/<form([^>]*)>/.test(template));
};

}, 'gallery-2014.02.26-18-54', {
    "requires": [
        "yui-base",
        "gallery-itsapluginpromise",
        "intl",
        "base-base",
        "base-build",
        "view",
        "widget-base",
        "template-base",
        "template-micro",
        "model",
        "node-style",
        "event-custom",
        "event-outside",
        "event-custom-base",
        "oop",
        "promise",
        "pluginhost-base",
        "gallery-itsamodulesloadedpromise",
        "gallerycss-itsa-base"
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
    ],
    "skinnable": true
});
