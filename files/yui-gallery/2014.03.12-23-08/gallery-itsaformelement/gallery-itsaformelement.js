YUI.add('gallery-itsaformelement', function (Y, NAME) {

'use strict';

/*jshint maxlen:215 */

/**
 *
 * Provides stringifying html-elements based on a config-object
 *
 * @module gallery-itsaformelement
 * @class ITSAFormElement
 * @static
 * @since 0.1
 *
 * <i>Copyright (c) 2012 Marco Asbreuk - http://theinternetwizard.net</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

var ITSAFormElement,
    YArray = Y.Array,
    YObject = Y.Object,
    Lang = Y.Lang,
    INTL = Y.Intl,
    ZINDEX_TIPSY = 5,
    BODY = Y.one('body'),
    MS_TIME_TO_INSERT = 5000, // time to render the inserted widgets, we set this time to avoid unnecessary onavailable listeners.
    ACTION_FROMTAB = ACTION_FROMTAB,
    DATA        = 'data',
    HOTKEY = 'hotkey',
    DATA_FOR    = DATA+'-for',
    DATA_FORHOTKEY    = DATA_FOR+HOTKEY,
    DISABLED    = 'disabled',
    WIDGET = 'widget',
    STRING = 'string',
    WIDGET_PARENT_CLASS = 'itsa-'+WIDGET+'-parent',
    PURE = 'pure',
    BUTTON = 'button',
    PUREBUTTON_CLASS = PURE+'-'+BUTTON,
    PURE_BUTTON_ACTIVE = PUREBUTTON_CLASS+'-active',
    PUREBUTTON_BORDERED_CLASS = ' itsa'+BUTTON+'-bordered',
    DATE = 'date',
    TIME = 'time',
    DATETIME = DATE+TIME,
    ITSABUTTON_DATETIME_CLASS = ' '+PUREBUTTON_CLASS+'-'+DATETIME+' itsa'+BUTTON+'-onlyicon',
    DISABLED_BUTTON_CLASS = PUREBUTTON_CLASS+'-'+DISABLED,
    PRIMARY_BUTTON_CLASS = PUREBUTTON_CLASS+'-primary',
    MODELATTRIBUTE = 'modelattribute',
    HIDEATSTARTUP = 'hideatstartup',
    INVISIBLE_CLASS = 'itsa-invisible',
    RENDERPROMISE = 'renderpromise',
    GALLERY = 'gallery',
    ITSA = '-itsa',
    EDITOR = 'editor',
    ERROR = 'error',
    BOOLEAN = 'boolean',
    SELECTOR_TIPSY = '[data-formelement][data-content]',
    DATA_VALID_FALSE = '[data-valid="false"]',
    TIPSY_FORMELEMENT = 'tipsy-formelement',
    BOUNDINGBOX = 'boundingBox',
    TOUCHSTART = 'touchstart',
    TOUCHEND = 'touchend',
    FOCUS = 'focus',
    BLUR = 'blur',
    KEYPRESS = 'keypress',
    RIGHT = 'right',

    PICKER = 'picker',
    CLICK = 'click',
    PICKER_ICON = 'itsaicon-datetime-',
    ICON_DATE_CLASS = PICKER_ICON+DATE,
    ICON_TIME_CLASS = PICKER_ICON+TIME,
    ICON_DATETIME_CLASS = PICKER_ICON+DATETIME,
    DATA_FORM_ELEMENT = ' data-formelement="true"',
    SPANCLASSISFORMAT = '<span class="format',
    ENDSPAN = '</span>',
    ITSA_HOTKEY = 'itsa-'+HOTKEY,
    HOTKEY_TEMPLATE = '<span class="'+ITSA_HOTKEY+'" data-'+HOTKEY+'="{'+HOTKEY+'}" '+DATA_FORHOTKEY+'="{nodeid}">$1'+ENDSPAN,
    ASK_TO_CLICK_EVENT = 'itsabutton-asktoclick',

    PATTERN_EMAIL = '^[\\w!#$%&\'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&\'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$',
    PATTERN_URLEND = '[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)+(/[\\w-]+)*',
    PATTERN_URLHTTP =  '^(http://)?'+PATTERN_URLEND,
    PATTERN_URLHTTPS =  '^https://'+PATTERN_URLEND,
    PATTERN_URL = '^(https?://)?'+PATTERN_URLEND,
    PATTERN_INTEGER = '^(([-]?[1-9][0-9]*)|0)$',
    PATTERN_FLOAT = '^[-]?(([1-9][0-9]*)|0)(\\.[0-9]+)?$',

    LABEL_FOR_IS = '<label for="',
    ENDLABEL_EL = '</label>',

    TEXT = 'text',
    PASSWORD = 'password',
    EMAIL = 'email',
    URL = 'url',
    RADIO = 'radio',
    CHECKBOX = 'checkbox',
    HIDDEN = 'hidden',
    TEXTAREA = 'textarea',
    DIV = 'div',
    LABEL = 'label',
    SPAN  = 'span',
    PLAIN = 'plain',
    INITIALFOCUS = 'initialfocus',
    FULLSELECT = 'fullselect',
    SUBMITONENTER = 'submitonenter',
    PRIMARYBTNONENTER = 'primarybtnonenter',
    NUMBER = 'number',

    PURERADIO    = PURE+'-'+RADIO,
    PURECHECKBOX = PURE+'-'+CHECKBOX,

    READONLY    = 'readonly',
    CHECKED     = 'checked',
    REQUIRED    = 'required',
    NAMEDEF     = 'name', // cannot use NAME
    VALUE       = 'value',
    PLACEHOLDER = 'placeholder',
    PATTERN     = 'pattern',
    CLASS       = 'class',
    LABELHTML  = 'labelHTML',
    SWITCH      = 'switch',
    SWITCHED    = SWITCH+'ed',
    SWITCHLABEL = SWITCH+LABEL,
    SWITCHVALUE = SWITCH+VALUE,
    LABELDATA        = LABEL+DATA,
    VALUESWITCHED    = VALUE+SWITCHED,
    VALUENONSWITCHED = VALUE+'non'+SWITCHED,
    FOCUSABLE      = 'focusable',
    SPINBUSY       = 'spinbusy',
    DISABLED_SUB         = '{'+DISABLED+'}',
    READONLY_SUB         = '{'+READONLY+'}',
    CHECKED_SUB          = '{'+CHECKED+'}',
    REQUIRED_SUB         = '{'+REQUIRED+'}',
    NAME_SUB             = '{'+NAMEDEF+'}',
    VALUE_SUB            = '{'+VALUE+'}',
    PLACEHOLDER_SUB      = '{'+PLACEHOLDER+'}',
    PATTERN_SUB          = '{'+PATTERN+'}',
    DATA_SUB             = '{'+DATA+'}',
    CLASS_SUB            = '{'+CLASS+'}',
    HIDDEN_SUB           = '{'+HIDDEN+'}',
    ID_SUB               = 'id="{id}"',
    VALUESWITCHED_SUB    = '{'+VALUESWITCHED+'}',
    VALUENONSWITCHED_SUB = '{'+VALUENONSWITCHED+'}',
    LABELDATA_SUB        = '{'+LABELDATA+'}',
    LABELHTML_SUB       = '{'+LABELHTML+'}',
    FOCUSABLE_SUB        = '{'+FOCUSABLE+'}',

    TYPE           = 'type',
    SUBMIT         = 'submit',
    RESET          = 'reset',
    INPUT_TYPE_IS  = '<input '+TYPE+'="',
    BUTTON_TYPE_IS = '<'+BUTTON+' '+TYPE+'="',
    CLASSNAME      = CLASS+NAMEDEF,
    LABELCLASSNAME = LABEL+'Class'+NAMEDEF,
    TYPE_SUB       = '{'+TYPE+'}',

    DATA_LABEL_DATETIME = ' data-labeldatetime="true"',
    DATA_DATETIME = DATA+'-'+DATETIME+'=', // used as node data-attribute data-datetime
    DATA_BUTTON_TYPE = DATA+'-'+BUTTON+TYPE,
    DATA_BUTTON_SUBTYPE = DATA+'-'+BUTTON+'sub'+TYPE,

    ELEMENT_UNDEFINED = '<'+SPAN+' '+ID_SUB+'>UNDEFINED ELEMENTTYPE</'+SPAN+'>',
    ELEMENT_PLAIN = '<'+SPAN+' '+ID_SUB+NAME_SUB+DATA_SUB+HIDDEN_SUB+CLASS_SUB+'>'+VALUE_SUB+'</'+SPAN+'>',
    ELEMENT_TEXT = INPUT_TYPE_IS+TEXT+'" '+ID_SUB+NAME_SUB+VALUE_SUB+PLACEHOLDER_SUB+DISABLED_SUB+REQUIRED_SUB+READONLY_SUB+PATTERN_SUB+DATA_SUB+FOCUSABLE_SUB+HIDDEN_SUB+CLASS_SUB+' />',
    ELEMENT_PASSWORD = INPUT_TYPE_IS+PASSWORD+'" '+ID_SUB+NAME_SUB+VALUE_SUB+PLACEHOLDER_SUB+DISABLED_SUB+REQUIRED_SUB+READONLY_SUB+PATTERN_SUB+DATA_SUB+FOCUSABLE_SUB+HIDDEN_SUB+CLASS_SUB+' />',
    // keep the type of URL and EMAIL to 'text' --> otherwise browsers will apply their own build-in pattern which is not as precize
    ELEMENT_EMAIL = INPUT_TYPE_IS+TEXT+'" '+ID_SUB+NAME_SUB+VALUE_SUB+PLACEHOLDER_SUB+DISABLED_SUB+REQUIRED_SUB+READONLY_SUB+DATA_SUB+FOCUSABLE_SUB+HIDDEN_SUB+CLASS_SUB+PATTERN_SUB+' />',
    ELEMENT_URL      = INPUT_TYPE_IS+TEXT+'" '+ID_SUB+NAME_SUB+VALUE_SUB+PLACEHOLDER_SUB+DISABLED_SUB+REQUIRED_SUB+READONLY_SUB+DATA_SUB+FOCUSABLE_SUB+HIDDEN_SUB+CLASS_SUB+PATTERN_SUB+' />',
    ELEMENT_NUMBER = INPUT_TYPE_IS+TEXT+'" '+ID_SUB+NAME_SUB+VALUE_SUB+PLACEHOLDER_SUB+DISABLED_SUB+REQUIRED_SUB+READONLY_SUB+DATA_SUB+FOCUSABLE_SUB+
                      HIDDEN_SUB+CLASS_SUB+PATTERN_SUB+' />',
    ELEMENT_RADIO = INPUT_TYPE_IS+RADIO+'" '+ID_SUB+NAME_SUB+VALUE_SUB+DISABLED_SUB+CHECKED_SUB+DATA_SUB+FOCUSABLE_SUB+HIDDEN_SUB+CLASS_SUB+' />',
    ELEMENT_CHECKBOX = INPUT_TYPE_IS+CHECKBOX+'" '+ID_SUB+NAME_SUB+VALUE_SUB+DISABLED_SUB+READONLY_SUB+CHECKED_SUB+DATA_SUB+FOCUSABLE_SUB+HIDDEN_SUB+CLASS_SUB+' />',
    ELEMENT_HIDDEN = INPUT_TYPE_IS+HIDDEN+'" '+ID_SUB+NAME_SUB+VALUE_SUB+' />',
    ELEMENT_TEXTAREA = '<'+TEXTAREA+' '+ID_SUB+NAME_SUB+PLACEHOLDER_SUB+DISABLED_SUB+REQUIRED_SUB+READONLY_SUB+DATA_SUB+FOCUSABLE_SUB+HIDDEN_SUB+CLASS_SUB+'>'+VALUE_SUB+'</'+TEXTAREA+'>',
    ELEMENT_WIDGET = VALUENONSWITCHED_SUB+'<'+DIV+' '+ID_SUB+NAME_SUB+HIDDEN_SUB+DATA_SUB+FOCUSABLE_SUB+CLASS_SUB+'></'+DIV+'>'+VALUESWITCHED_SUB,
    ELEMENT_BUTTON = BUTTON_TYPE_IS+TYPE_SUB+'" '+ID_SUB+NAME_SUB+VALUE_SUB+DATA_SUB+FOCUSABLE_SUB+HIDDEN_SUB+CLASS_SUB+'>'+LABELHTML_SUB+'</'+BUTTON+'>',
    ELEMENT_DATE = VALUENONSWITCHED_SUB+BUTTON_TYPE_IS+BUTTON+'" '+ID_SUB+NAME_SUB+VALUE_SUB+HIDDEN_SUB+REQUIRED_SUB+DATA_LABEL_DATETIME+READONLY_SUB+
                   ' '+DATA_DATETIME+'"'+DATE+'"'+DATA_SUB+FOCUSABLE_SUB+CLASS_SUB+'><i '+CLASS+'="'+ICON_DATE_CLASS+'"></i></'+BUTTON+'>'+VALUESWITCHED_SUB,
    ELEMENT_TIME = VALUENONSWITCHED_SUB+BUTTON_TYPE_IS+BUTTON+'" '+ID_SUB+NAME_SUB+VALUE_SUB+HIDDEN_SUB+REQUIRED_SUB+DATA_LABEL_DATETIME+READONLY_SUB+
                   ' '+DATA_DATETIME+'"'+TIME+'"'+DATA_SUB+FOCUSABLE_SUB+CLASS_SUB+'><i '+CLASS+'="'+ICON_TIME_CLASS+'"></i></'+BUTTON+'>'+VALUESWITCHED_SUB,
    ELEMENT_DATETIME = VALUENONSWITCHED_SUB+BUTTON_TYPE_IS+BUTTON+'" '+ID_SUB+NAME_SUB+VALUE_SUB+HIDDEN_SUB+REQUIRED_SUB+DATA_LABEL_DATETIME+READONLY_SUB+
                   ' '+DATA_DATETIME+'"'+DATETIME+'"'+DATA_SUB+FOCUSABLE_SUB+CLASS_SUB+'><i '+CLASS+'="'+ICON_DATETIME_CLASS+'"></i></'+BUTTON+'>'+VALUESWITCHED_SUB,

    TEMPLATES = {
        widget: ELEMENT_WIDGET,
        plain: ELEMENT_PLAIN,
        text: ELEMENT_TEXT,
        password: ELEMENT_PASSWORD,
        email: ELEMENT_EMAIL,
        url: ELEMENT_URL,
        number: ELEMENT_NUMBER,
        radio: ELEMENT_RADIO,
        checkbox: ELEMENT_CHECKBOX,
        hidden: ELEMENT_HIDDEN,
        textarea: ELEMENT_TEXTAREA,
        button: ELEMENT_BUTTON,
        reset: ELEMENT_BUTTON,
        submit: ELEMENT_BUTTON,
        date: ELEMENT_DATE,
        time: ELEMENT_TIME,
        datetime: ELEMENT_DATETIME
    },
    GETFORMATTED_DATEVALUE = function(type, name, value, format, classname, hiddenstring, disabledstring, hideatstartup, buttonnodeid) {
        var className = classname ? (' '+classname) : '',
            invisibleStarup = (hideatstartup ? (' '+INVISIBLE_CLASS) : ''),
            formattimename = ((typeof name === STRING) && (name.length>0)) ? (' formattime-'+name) : '';
        if (!format) {
            if (type==='date') {
                format = '%x';
            }
            else if (type==='time') {
                format = '%X';
            }
            else {
                format = '%x %X';
            }
        }
        // asynchronious preloading the module
        Y.use(GALLERY+ITSA+'datetimepicker');
        return SPANCLASSISFORMAT+'value'+formattimename+className+invisibleStarup+'" '+DATA_FOR+'="'+buttonnodeid+'"'+className+hiddenstring+disabledstring+'>'+Y.Date.format(value, {format: format})+ENDSPAN;
    },
    DATETIME_TYPES = { // proper date/time-formelement types
        date: true,
        time: true,
        datetime: true
    },
    FULLSELECT_TYPES = { // formelement types that are allowed to be full selected
        text: true,
        number: true,
        password: true,
        textarea: true,
        email: true,
        url: true
    },
    BUTTONS_TYPES = { // button-formelement types
        button: true,
        submit: true,
        reset: true
    },
    RADIO_CHECKBOX_TYPES = { // radio and checkbox-formelement types
        radio: true,
        checkbox: true
    },

    SUBREGEX = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g,
    SUB = function(s, o) {
        return s.replace ? s.replace(SUBREGEX, function (match, key) {
            return Y.Lang.isUndefined(o[key]) ? '' : o[key];
        }) : s;
    };

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

ITSAFormElement = Y.ITSAFormElement = {};

/**
 * Renderes a String that contains the completeFormElement definition. You can also define a widgetclass, by which the widget will
 * be created as soon as the returned 'html' gets into the dom. The next html-elements can be rendered:
 *   <ul>
 *     <li>text</li>
 *     <li>number</li>
 *     <li>password</li>
 *     <li>textarea</li>
 *     <li>radio</li>
 *     <li>checkbox</li>
 *     <li>date</li>
 *     <li>time</li>
 *     <li>datetime</li>
 *     <li>reset</li>
 *     <li>submit</li>
 *     <li>button</li>
 *     <li>email</li>
 *     <li>url</li>
 *     <li>plain</li>
 *   </ul>
 * Or when widgets need to be created, use the <u>Class</u> (<b>not instance</b>) of the widget. F.i.:
 *   <ul>
 *     <li>Y.Slider</li>
 *     <li>Y.Dial</li>
 *     <li>Y.EditorBase</li>
 *     <li>Y.ITSACheckbox</li>
 *     <li>Y.ITSASelectlist</li>
 *  </ul>
 *
 * @method getElement
 * @param type {String|widgetClass} the elementtype to be created. Can also be a widgetclass.
 * @param [config] {Object} The config-attributes for the element which is passed through to the <b>Attributes</b> of the ITSAFormElement.
 *   @param [config.labelHTML] {String} only valid for non 'datetime'-buttons.
 *   @param [config.checked=false] {Boolean} only valid for checkboxes and radiobuttons.
 *   @param [config.classname] {String} additional classname for the html-element or widget.
 *   @param [config.data] {String} for extra data-attributes, f.i. data: 'data-someinfo="somedata" data-moreinfo="moredata"'.
 *   @param [config.digits=false] {Boolean} for floating numbers: only valid for type==='number'.
 *   @param [config.disabled=false] {Boolean}
 *   @param [config.focusable=true] {Boolean} adds an extra attribute 'focusable' which can be used as a selector by the FocusManager. Also applyable for Widgets.
 *   @param [config.format] {String} Date-format: only valid for type==='date', 'time' or 'datetime'.
 *   @param [config.fullselect=false] {Boolean} selects all text when focussed --> only valid for input-elements and textarea.
 *   @param [config.hidden=false] {Boolean}
 *   @param [config.hotkey] {String|Object} character that act as a hotkey: 'alt+char' will focus the element and -in case of a button- click the button.
 *                                          The hotkey-character will be marked with the css-class 'itsa-hotkey' (span-element), which underscores by default, but can be overruled.
 *                                          If you want to Internationize, the you need to supply an object where the properties are the language-tag and the values a string (character).
 *                                          F.i. {us: 'a', nl: 'o'}. When Internationize, there will be no hotkey when the used language is not found in the hotkey-object.
 *   @param [config.initialfocus=false] {Boolean} makes this the first item that gets focus when the container gets focus.
 *   @param [config.label] {String} can by used for all elements (including Widgets and date-time), except for buttons.
 *   @param [config.labelClassname] {String} additional classname for the label. Can by used for all elements (including Widgets and date-time), except for buttons.
 *   @param [config.name] {String} used by html-forms to identify the element.
 *   @param [config.nossl=false] {Boolean} making url's to validate only on non-ssl url's. Only applyable for type==='url'.
 *   @param [config.onlyssl=false] {Boolean} making url's to validate only on ssl url's. Only applyable for type==='url'
 *   @param [config.pattern] {String} regexp pattern that should be matched. Only applyable for type==='text' or 'password'.
 *   @param [config.placeholder] {String} only applyable for input-elements and textarea.
 *   @param [config.primary=false] {Boolean} making a button the primary button. Only applyable for buttons.
 *   @param [config.primarybtnonenter=false] {Boolean} in case of text-fields: on enter-press click on the primary button. Will just add the data-attribute data-primarybtnonenter="true"
                                                       --> it is up to other modules to handle the buttonclick.
 *   @param [config.required=false] {Boolean} (defaults true for 'type===password') when data is required. Only applyable for input-elements, textarea and date/time.
 *   @param [config.readonly=false] {Boolean} not applyable for buttons.
 *   @param [config.spinbusy=false] {Boolean} making a buttonicon to spin if busy. (Actually only adds the data-attribute: data-spinbusy="true" --> which should be used by other js to make it spin).
 *                                            Only applyable for buttons.
 *   @param [config.submitonenter=false] {Boolean} in case of text-fields: on enter-press submit. Will just add the data-attribute data-submitonenter="true" --> it is up to
 *                                       other modules to handle the submission.
 *   @param [config.switchvalue=false] {Boolean} make the value go behind the element. Only applyable for type=='Y.Slider', 'date', 'time' or 'datetime'.
 *   @param [config.switchlabel=false] {Boolean} make the label go behind the element.
 *   @param [config.tooltip] {String} marks the data-attribute used by Y.Tipsy. Also applyable for Widgets.
 *   @param [config.tooltipinvalid] {String} marks the data-attribute used by Y.Tipsy in case of invalid data. Also applyable for Widgets. External routine should
 *           set this data (available as 'data-contentinvalid') into 'data-content' once invalid and replace it with 'data-contentvalid' once valid again.
 *   @param [config.value] {String} the value of the element.
 * @param [nodeid] {String} The unique id of the node (without the '#'). When not supplied, Y.guid() will generate a random one.
 * @return {object} with the following proprties:<ul>
 *                  <li>config --> {object} reference to the original configobject</li>
 *                  <li>html   --> {String} rendered Node which is NOT part of the DOM! Must be inserted manually, or using Y.ITSAFormModel</li>
 *                  <li>name   --> {String} convenience-property===config.name</li>
 *                  <li>nodeid --> {String} created node's id (without #)</li>
 *                  <li>type   --> {String|WidgetClass} the created type - passed as the first parameter</li>
 *                  <li>widget --> {Widget-instance}handle to the created widgetinstance</li></ul>
 * @since 0.1
*/
ITSAFormElement.getElement = function(type, config, nodeid) {
    var element, iswidget, WidgetClass, widget;
    nodeid = nodeid || Y.guid();
    config = config || {};
    iswidget = ((typeof type === 'function') && type.NAME);
    if (typeof type===STRING) {
        type = type.toLowerCase();
    }
    element = {
        type : type,
        nodeid : nodeid,
        config : config,
        name : config.name,
        html : ITSAFormElement._renderedElement((iswidget ? type.NAME : type), config, nodeid, iswidget)
    };
    if (iswidget) {
        WidgetClass = type;
        try {
            widget = element.widget = new WidgetClass(config.widgetconfig);
            // when it is inserted in the dom: render it
            if (type.NAME===EDITOR+'Base') {
                Y.use(GALLERY+ITSA+EDITOR+RENDERPROMISE, function() {
                    widget.renderOnAvailable('#'+nodeid, MS_TIME_TO_INSERT);
                });
            }
            else {
                Y.use(GALLERY+ITSA+WIDGET+RENDERPROMISE, function() {
                    widget.renderOnAvailable('#'+nodeid, MS_TIME_TO_INSERT);
                });
            }
        }
        catch (e) {
            Y.fire(ERROR, e);
        }
    }
    return element;
};

/**
 * Renderes a String that contains the completeFormElement definition.
 *
 * @method _renderedElement
 * @private
 * @param type {String} the elementtype
 * @param config {Object} The config-attributes for the element which is passed through to the <b>Attributes</b> of the ITSAFormElement.
 * @param nodeid {String} The unique id of the node (without the '#').
 * @param [iswidget] {Boolean} whether the element is a widget
 * @return {String} rendered Node which is NOT part of the DOM yet! Must be inserted into the DOM manually, or through Y.ITSAFORM
 * @since 0.1
*/
ITSAFormElement._renderedElement = function(type, config, nodeid, iswidget) {
    var subtituteConfig = Y.merge(config),
        isdatetime = DATETIME_TYPES[type],
        switchlabel = (typeof subtituteConfig[SWITCHLABEL]===BOOLEAN) ? subtituteConfig[SWITCHLABEL] : false,
        focusable = (typeof subtituteConfig[FOCUSABLE]===BOOLEAN) ? subtituteConfig[FOCUSABLE] : true,
        fullselect = (typeof subtituteConfig[FULLSELECT]===BOOLEAN) ? subtituteConfig[FULLSELECT] : false,
        submitonenter = (typeof subtituteConfig[SUBMITONENTER]===BOOLEAN) ? subtituteConfig[SUBMITONENTER] : false,
        primarybtnonenter = (typeof subtituteConfig[PRIMARYBTNONENTER]===BOOLEAN) ? subtituteConfig[PRIMARYBTNONENTER] : false,
        hideatstartup = (typeof subtituteConfig[HIDEATSTARTUP]===BOOLEAN) ? subtituteConfig[HIDEATSTARTUP] : false,
        tooltip = !isdatetime && config.tooltip,
        tooltipinvalid = !isdatetime && config.tooltipinvalid,
        nossl = config.nossl,
        onlyssl = config.onlyssl,
        digits = config.digits,
        value = config[VALUE],
        modelattribute = config[MODELATTRIBUTE],
        switchvalue = config[SWITCHVALUE],
        configdata = config[DATA],
        data = DATA_FORM_ELEMENT, // always initialize
        posiblehotkey = config[HOTKEY],
        labelclass, disabledbutton, primarybutton, template, surroundlabelclass, hidden, disabled, required,
        checked, purebutton, readonly, extralabel, hotkeyRegExp, hotkey, currentlang, bestlanguage, bestlanguageLength, availableLanguages, currentlanguageLength;
    // first setting up global data-attributes
/*jshint expr:true */
    configdata && (data+=' '+configdata);
    modelattribute && (data+=' data-'+MODELATTRIBUTE+'="true"');
    subtituteConfig[DATA] = data;
    if (tooltip) {
        tooltip = tooltip.replace(/"/g, '\'\''),
        subtituteConfig[DATA] += ' data-content="'+tooltip+'" data-contentvalid="'+tooltip+'"';
    }
    tooltipinvalid && (typeof tooltipinvalid === STRING) && (tooltipinvalid.length>0) && (subtituteConfig[DATA] += ' data-contentinvalid="'+tooltipinvalid.replace(/"/g, '\'\'')+'"');
    config[INITIALFOCUS] && (subtituteConfig[DATA] += ' data-'+INITIALFOCUS+'="true"');
    config[NAMEDEF] && (subtituteConfig[NAMEDEF]=' '+NAMEDEF+'="'+subtituteConfig[NAMEDEF]+'"');
    hidden = (typeof config[HIDDEN]===BOOLEAN) ? config[HIDDEN] : false;
    disabled = (typeof subtituteConfig[DISABLED]===BOOLEAN) ? subtituteConfig[DISABLED] : false;
    subtituteConfig[HIDDEN] = hidden ? (' '+HIDDEN+'="'+HIDDEN+'"') : '';
    subtituteConfig[DISABLED] = disabled ? (' '+DISABLED+'="'+DISABLED+'"') : '';
/*jshint expr:false */
    if (posiblehotkey) {
        if (Lang.isObject(posiblehotkey)) {
            currentlang = (INTL.getLang(GALLERY+'-itsaformelement') || Y.config.lang);
            availableLanguages = [];
            YObject.each(
                posiblehotkey,
                function(value, key) {
/*jshint expr:true */
                    (typeof key === STRING) && (typeof value === STRING) && availableLanguages.push(key);
/*jshint expr:false */
                }
            );
            // now search for the best avialable languagematch (which cannot be done with Y.intl.lookupBestLang):
            bestlanguageLength = 0;
            currentlanguageLength = currentlang.length;
            YArray.some(
                availableLanguages,
                function(language) {
                    var languagelength = language.length;
                    if (
                            (
                                ((languagelength>bestlanguageLength) && ((bestlanguageLength===0) || (languagelength<=currentlanguageLength))) ||
                                ((languagelength<bestlanguageLength) && (bestlanguageLength>currentlanguageLength))
                            ) &&
//                            (language.match(new RegExp('^'+currentlang)) || currentlang.match(new RegExp('^'+language)))
                            currentlang.match(new RegExp('^'+language))
                        ) {
                        bestlanguage = language;
                        bestlanguageLength = bestlanguage.length;
                    }
                    return (language===currentlang);
                }
            );
            posiblehotkey = posiblehotkey[bestlanguage];
        }
/*jshint expr:true */
        (typeof posiblehotkey === STRING) && (posiblehotkey.length===1) && (hotkey=posiblehotkey.toLowerCase());
/*jshint expr:false */
    }
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++ specific widget formatting ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    if (iswidget) {
        subtituteConfig[DATA] += ' data-type="'+type+'"';
        subtituteConfig[CLASS]=' class="'+(config[CLASSNAME] || '') + ' ' + WIDGET_PARENT_CLASS + (hideatstartup ? (' '+INVISIBLE_CLASS) : '') + '"';
        if (config[LABEL]) {
            subtituteConfig[LABELDATA] = subtituteConfig[LABELDATA] || '';
            subtituteConfig[LABELDATA] += ' data-'+WIDGET+LABEL+'="true"';
        }
        subtituteConfig[FOCUSABLE] = focusable ? (' data-'+FOCUSABLE+'="true"') : '';
        if (type==='slider') {
            // we want the value visible inside a span
            subtituteConfig[switchvalue ? VALUESWITCHED : VALUENONSWITCHED] = SPANCLASSISFORMAT+'value formatslider-'+config.name+(config[CLASSNAME] ? (' '+config[CLASSNAME]) : '')+
                                                                              '" '+DATA_FOR+'="'+nodeid+'"'+subtituteConfig[HIDDEN]+subtituteConfig[DISABLED]+'>'+value+ENDSPAN;
        }
        // now make sure we get the right 'template', by re-defining 'type'
        type = WIDGET;
    }
    else {
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++ non-widget formatting +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        required = !config['remove'+REQUIRED] && ((typeof subtituteConfig[REQUIRED]===BOOLEAN) ? subtituteConfig[REQUIRED] : (type===PASSWORD));
        readonly = (typeof subtituteConfig[READONLY]===BOOLEAN) ? subtituteConfig[READONLY] : false;
/*jshint expr:true */
        subtituteConfig[FOCUSABLE] = focusable ? (' data-'+FOCUSABLE+'="true"') : '';
        subtituteConfig[REQUIRED] = required ? (' '+REQUIRED+'="'+REQUIRED+'"') : '';
        subtituteConfig[READONLY] = readonly ? (' '+READONLY+'="'+READONLY+'"') : '';
        config[PLACEHOLDER] && (subtituteConfig[PLACEHOLDER]=' '+PLACEHOLDER+'="'+subtituteConfig[PLACEHOLDER]+'"');
        config[PATTERN] && (subtituteConfig[PATTERN]=' '+PATTERN+'="'+subtituteConfig[PATTERN]+'"');
        (type!==TEXTAREA) && (type!==PLAIN) && value && (subtituteConfig[VALUE]=' '+VALUE+'="'+subtituteConfig[VALUE]+'"');
/*jshint expr:false */

        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++ specific email formatting +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        if (type===EMAIL) {
            subtituteConfig[DATA]+=' data-subtype="email"';
            // redefine pattern
            subtituteConfig[PATTERN] = ' '+PATTERN+'="'+PATTERN_EMAIL+'"';
        }

        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++ specific url formatting +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        else if (type===URL) {
            subtituteConfig[DATA]+=' data-subtype="url"';
            if ((typeof nossl===BOOLEAN) && nossl) {
                subtituteConfig[PATTERN] =' '+PATTERN+'="'+PATTERN_URLHTTP+'"';
            }
            else if ((typeof onlyssl===BOOLEAN) && onlyssl) {
                subtituteConfig[PATTERN] =' '+PATTERN+'="'+PATTERN_URLHTTPS+'"';
            }
            else {
                subtituteConfig[PATTERN] =' '+PATTERN+'="'+PATTERN_URL+'"';
            }
        }

        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++ specific number formatting ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        else if (type===NUMBER) {
            subtituteConfig[PATTERN] =' '+PATTERN+'="'+(((typeof digits===BOOLEAN) && digits) ? PATTERN_FLOAT : PATTERN_INTEGER)+'"';
        }

        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++ specific radio and checkbox formatting ++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        else if (RADIO_CHECKBOX_TYPES[type]) {
            surroundlabelclass = (type===RADIO) ? PURERADIO : PURECHECKBOX;
            checked = (typeof subtituteConfig[CHECKED]===BOOLEAN) ? subtituteConfig[CHECKED] : false;
            subtituteConfig[CHECKED] = checked ? (' '+CHECKED+'="'+CHECKED+'"') : '';
        }

        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++ specific button/submit/reset formatting +++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        else if (BUTTONS_TYPES[type]) {
            delete subtituteConfig[LABEL]; // not allowed for buttons
            purebutton = true;
            subtituteConfig[TYPE] = type;
            subtituteConfig[DATA] += ' data-'+BUTTON+TYPE+'="'+(config[BUTTON+TYPE] || type)+'"';
            primarybutton = config.primary;
            disabledbutton = disabled;
            if (config[SPINBUSY]) {
                subtituteConfig[DATA]+=' data-'+SPINBUSY+'="true"';
                Y.use(GALLERY+'css'+ITSA+'-animatespin');
            }
/*jshint expr:true */
            config[LABELHTML] || (subtituteConfig[LABELHTML]=(value||type));
            subtituteConfig[VALUE] = ' '+VALUE+'="'+(config[VALUE] || Y.Escape.html(subtituteConfig[LABELHTML]))+'"';
/*jshint expr:false */
            // now we need to look for hotkey and surround it if appropriate
            if (hotkey && (hotkeyRegExp=new RegExp('(?![^<]*>)('+hotkey+')', 'i')) && hotkeyRegExp.test(subtituteConfig[LABELHTML])) {
                subtituteConfig[LABELHTML] = subtituteConfig[LABELHTML].replace(hotkeyRegExp, Lang.sub(HOTKEY_TEMPLATE, {hotkey: hotkey, nodeid: nodeid}));
/*jshint expr:true */
                ITSAFormElement._HKList || ITSAFormElement._actHKList();
/*jshint expr:false */
            }
        }

        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++ specific datetime formatting ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        else if (isdatetime) {
            Y.use(GALLERY+'css'+ITSA+'-'+DATETIME);
/*jshint expr:true */
            Lang.isDate(value) || (value = new Date());
/*jshint expr:false */
            purebutton = true;
            disabledbutton = disabled;
            subtituteConfig[VALUE] = ' value="'+value.getTime()+'"';
            subtituteConfig[DATA] += ' data-'+DATETIME+'picker="true"';
            subtituteConfig[switchvalue ? VALUESWITCHED : VALUENONSWITCHED] = GETFORMATTED_DATEVALUE(type, (config.name || ''), value, subtituteConfig.format,
                                                                                                     config[CLASSNAME], subtituteConfig[HIDDEN], subtituteConfig[DISABLED], hideatstartup, nodeid);
        }

        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++ ITSAFormModel uses own pattern instead of pattern by the element ++++++++++++++++++++++++++++
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        if (config.removepattern && subtituteConfig[PATTERN]) {
             // don't want pattern but want the pattern as a node-data-attribute --> this prevents the browser to focus unmatched patterns
             subtituteConfig[DATA] += ' data-'+PATTERN+'='+subtituteConfig[PATTERN].substr(9);
             delete subtituteConfig[PATTERN];
        }

/*jshint expr:true */
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        FULLSELECT_TYPES[type] && (ITSAFormElement._TXTList || ITSAFormElement._actTXTList());
        fullselect && FULLSELECT_TYPES[type] && (subtituteConfig[DATA] += ' data-'+FULLSELECT+'="true"');
        submitonenter && FULLSELECT_TYPES[type] && (subtituteConfig[DATA] += ' data-'+SUBMITONENTER+'="true"');
        primarybtnonenter && FULLSELECT_TYPES[type] && (subtituteConfig[DATA] += ' data-'+PRIMARYBTNONENTER+'="true"');

        (config[CLASSNAME] || purebutton || hideatstartup || isdatetime) && (subtituteConfig[CLASS]=' class="'+(isdatetime ? '' : (config[CLASSNAME] || ''))+
                                (purebutton ? (' '+PUREBUTTON_CLASS+PUREBUTTON_BORDERED_CLASS) : '')+
                                (isdatetime ? (ITSABUTTON_DATETIME_CLASS) : '')+
                                (disabledbutton ? (' '+DISABLED_BUTTON_CLASS) : '')+
                                (primarybutton ? (' '+PRIMARY_BUTTON_CLASS) : '')+
                                (hideatstartup ? (' '+INVISIBLE_CLASS) : '')+
                                '"');
/*jshint expr:false */
    }

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++ creating template +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    template = TEMPLATES[type] || ELEMENT_UNDEFINED;

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++ creating label ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    if (subtituteConfig[LABEL]) {
        // now we need to look for hotkey and surround it if appropriate
        if (hotkey && (hotkeyRegExp=new RegExp('(?![^<]*>)('+hotkey+')', 'i')) && hotkeyRegExp.test(subtituteConfig[LABEL])) {
            subtituteConfig[LABEL] = subtituteConfig[LABEL].replace(hotkeyRegExp, Lang.sub(HOTKEY_TEMPLATE, {hotkey: hotkey, nodeid: nodeid}));
/*jshint expr:true */
            ITSAFormElement._HKList || ITSAFormElement._actHKList();
/*jshint expr:false */
        }
/*jshint expr:true */
        switchlabel && (subtituteConfig[LABELCLASSNAME]+=' switched'+LABEL);
/*jshint expr:false */
        if (surroundlabelclass) {
            subtituteConfig[LABEL] = '<span class="formatlabel">' + subtituteConfig[LABEL] + ENDSPAN;
            labelclass = ' class="'+surroundlabelclass+(subtituteConfig[LABELCLASSNAME] ? (' '+subtituteConfig[LABELCLASSNAME]) : '') + '"';
            template = LABEL_FOR_IS+'{id}"'+HIDDEN_SUB+LABELDATA_SUB+labelclass+'>'+(switchlabel ? (template+'{label}') : ('{label}'+template))+ENDLABEL_EL;
        }
        else {
            labelclass = subtituteConfig[LABELCLASSNAME] ? (' class="'+subtituteConfig[LABELCLASSNAME] + '"') : '';
            extralabel = (isdatetime ? ('<'+LABEL) : (LABEL_FOR_IS+'{id}"'))+HIDDEN_SUB+LABELDATA_SUB+labelclass+'>{label}'+ENDLABEL_EL;
            if (switchlabel) {
                template += extralabel;
            }
            else {
                template = extralabel+template;
            }
        }
    }

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++ set nodeid ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    subtituteConfig.id=nodeid;

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++ return result +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    return SUB(template, subtituteConfig);
};

// Now create two Y.Tipsy instances which will be used to show popover-content
// because the tipsy-instances should not be present staight ahead (the user must focus the element),
// we delay and making pagerendering speedup.
//
// However, there might be situations where you need to know is tipsy is ready, for example if you focus an element with JS
// and need to be sure that tipsy pops up. For those cases, there is the promise tooltipReadyPromise()

/**
 * Reference to the Y.Tipsy instance that handles element-popups.
 *
 * @property tipsyOK
 * @since 0.2
*/

/**
 * Reference to the Y.Tipsy instance that handles invalid element-popups.
 *
 * @property tipsyInvalid
 * @since 0.2
*/

/**
 * Promise that fulfills as soon as the Tipsy-tooltip is rendered. Because it is rendered asynchroniously. <br />
 * This might be neede if you focus an element with JS and need to be sure that the tooltip will pop up.
 *
 * @method tooltipReadyPromise
 * @return {Promise} fulfills as soon as the Tipsy-tooltip is reendered.
 * @since 0.2
*/
ITSAFormElement.tooltipReadyPromise = function() {
    if (!ITSAFormElement._tooltipreadypromise) {
        ITSAFormElement._tooltipreadypromise = new Y.Promise(function (resolve, reject) {
            var tipsyOK = ITSAFormElement.tipsyOK = new Y.Tipsy({
                placement: RIGHT,
                selector: SELECTOR_TIPSY+':not('+DATA_VALID_FALSE+')',
                showOn: [TOUCHSTART, FOCUS],
                hideOn: [TOUCHEND, BLUR, KEYPRESS],
                zIndex: ZINDEX_TIPSY
            }).render(),
            tipsyInvalid = ITSAFormElement.tipsyInvalid = new Y.Tipsy({
                placement: RIGHT,
                selector: SELECTOR_TIPSY+DATA_VALID_FALSE,
                showOn: [TOUCHSTART, FOCUS],
                hideOn: [TOUCHEND, BLUR, KEYPRESS],
                zIndex: ZINDEX_TIPSY
            }).render();
            tipsyOK.get(BOUNDINGBOX).addClass(TIPSY_FORMELEMENT+'-ok');
            tipsyInvalid.get(BOUNDINGBOX).addClass(TIPSY_FORMELEMENT+'-invalid');
            // now we modify _alignTooltip, because we need to keep reference of the aligned node, in case we want to re-align
            tipsyOK._alignTooltip = function(node) {
                var instance = this;
                Y.Tipsy.prototype._alignTooltip.apply(instance, arguments);
                instance._lastnode = node;
            };
            tipsyInvalid._alignTooltip = function(node) {
                var instance = this;
                Y.Tipsy.prototype._alignTooltip.apply(instance, arguments);
                instance._lastnode = node;
            };
            Y.batch(
                tipsyOK.renderPromise(),
                tipsyInvalid.renderPromise()
            )
            .then(
                resolve,
                reject
            );
        });
    }
    return ITSAFormElement._tooltipreadypromise;
};

ITSAFormElement._pressedBtn = null;


ITSAFormElement._actHKList = function() {
    ITSAFormElement._HKList = true;
    BODY.on(
        'keydown',
        function(e) {
            var charcode = e.charCode,
                character, spannode, nodeid, possiblenode, node;
            if (e.altKey) {
                character = String.fromCharCode(charcode).toLowerCase();
                spannode = Y.one('.'+ITSA_HOTKEY+'[data-'+HOTKEY+'="'+character+'"]:not(['+DISABLED+']):not(['+READONLY+'])');
                if (spannode) {
                    nodeid = spannode.getAttribute(DATA_FORHOTKEY);
                    possiblenode = Y.one('#'+nodeid);
                }
                if (possiblenode && ((possiblenode.getStyle("visibility")==='hidden') || !possiblenode.displayInDoc())) {
                    // need to search for more nodes because this node is not reachable
                    spannode = Y.all('.'+ITSA_HOTKEY+'[data-'+HOTKEY+'="'+character+'"]:not(['+DISABLED+']):not(['+READONLY+'])');
                    spannode.some(
                        function(oneSpanNode, index) {
                            if (index>0) {
                                nodeid = oneSpanNode.getAttribute(DATA_FORHOTKEY);
                                possiblenode = Y.one('#'+nodeid);
                                node = possiblenode && (possiblenode.getStyle("visibility")!=='hidden') && possiblenode.displayInDoc() && possiblenode;
                            }
                            return node;
                        }
                    );
                }
                else {
                    node = possiblenode;
                }
                if (node) {
                    e.halt(); // need to do so, otherwise there will be multiple events for every node up the tree until body
                    node.focus();
                    if (node.get('tagName')==='BUTTON') {
                        node.addClass(PURE_BUTTON_ACTIVE);
                        Y.fire(ASK_TO_CLICK_EVENT, {buttonNode: node});
                        ITSAFormElement._pressedBtn = node;
                    }
                }
            }
        }
    );
    BODY.on(
        'keyup',
        function() {
            var button = ITSAFormElement._pressedBtn;
            if (button) {
                button.removeClass(PURE_BUTTON_ACTIVE);
                ITSAFormElement._pressedBtn = null;
            }
        }
    );
};

ITSAFormElement._actTXTList = function() {
    ITSAFormElement._TXTList = true;
// listen to focus-events on input and textarea-items
    BODY.delegate(
        FOCUS,
        function(e) {
            var node = e.target,
                fullselection = (node.getAttribute(DATA+'-'+FULLSELECT)==='true'),
                camefromtap;
    /*jshint expr:true */
            // in case of 'input', default action would be that the content is fully selected. We suppress this:
            !fullselection && node.test('input') && e.preventDefault();
    /*jshint expr:false */
            // because the behavious or selecting/cursor-to-end MUST NOT happen on a mouseclick or tap,
            // we need to make extra precautions. This is needed, because the tap-event occurs AFTER the focus-event.
            // Thus, we delay to make sure we take action after a tap-event might have been occurred

            camefromtap = node.getData(ACTION_FROMTAB);
            Y.ITSAFormElement._activeNode = node;
            if (camefromtap) {
                node.clearData(ACTION_FROMTAB);
            }
            else {
                if (fullselection) {
                    node.select();
                }
                else {
                    node.set('selectionStart', node.get('value').length);
                    // set 'scrollTop' high to make Chrome scroll the last character into view
                    node.set('scrollTop', 999999);
                }
            }
        },
        function(node, evt){
            var targetnode = evt.target;
            return (node===targetnode) && targetnode.test('input[type=text],input[type=password],textarea');
        }
    );

    // listen to focus-events on input and textarea-items
    BODY.delegate(
        'mousedown',
        function(e) {
            var node = e.target;
    /*jshint expr:true */
            (Y.ITSAFormElement._activeNode !== node) && node.setData(ACTION_FROMTAB, true);
    /*jshint expr:false */
        },
        function(node, evt){
            var targetnode = evt.target;
            return (node===targetnode) && targetnode.test('input[type=text],input[type=password],textarea');
        }
    );
};

// force making promise ready after 0.5 seconds:
Y.later(500, null, ITSAFormElement.tooltipReadyPromise);

// Define synthetic events 'datepickerclick', 'timepickerclick' and 'datetimepickerclick':

/**
  * Node-event fired when the datepicker-button is clicked.
  *
  * @event Y.Node.datepickerclick
  * @param e {EventFacade} Event Facade including:
  * @param e.target {Y.Node} The ButtonNode that was clicked
  *
**/

/**
  * Node-event fired when the timepicker-button is clicked.
  *
  * @event Y.Node.timepickerclick
  * @param e {EventFacade} Event Facade including:
  * @param e.target {Y.Node} The ButtonNode that was clicked
  *
**/

/**
  * Node-event fired when the datetimepicker-button is clicked.
  *
  * @event Y.Node.datetimepickerclick
  * @param e {EventFacade} Event Facade including:
  * @param e.target {Y.Node} The ButtonNode that was clicked
  *
**/

YArray.each(
    [DATE, TIME, DATETIME],
    function(eventtype) {
        var conf = {
            on: function (node, subscription, notifier) {
                // To make detaching easy, a common pattern is to add the subscription
                // for the supporting DOM event to the subscription object passed in.
                // This is then referenced in the detach() method below.
                subscription._handle = node.on(CLICK, function (e) {
                    var targetNode = e.target;
                    // do not compare with variabele BUTTON, because that one is lowercase
                    if (targetNode && (targetNode.get('tagName')!=='BUTTON')) {
                        targetNode = targetNode.get('parentNode');
                        e.target = targetNode;
                    }
                    if (targetNode && (targetNode.getAttribute(DATA+'-'+DATETIME)===eventtype)) {
                        // The notifier triggers the subscriptions to be executed.
                        // Pass its fire() method the triggering DOM event facade
                        notifier.fire(e);
                    }
                });
            },
            // The logic executed when the 'tripleclick' subscription is `detach()`ed
            detach: function (node, subscription) {
                // Clean up supporting DOM subscriptions and other external hooks
                // when the synthetic event subscription is detached.
                subscription._handle.detach();
            }
        };
        conf.delegate = conf.on;
        conf.detachDelegate = conf.detach;
        Y.Event.define(eventtype+PICKER+CLICK, conf);
    }
);

// Define synthetic events 'submitclick' and 'resetclick':

/**
  * Node-event fired when the submitbutton is clicked. This is not the same as the 'submit'-event because the latter
  * gets fired on a form-submit.
  *
  * @event Y.Node.submit:click
  * @param e {EventFacade} Event Facade including:
  * @param e.target {Y.Node} The ButtonNode that was clicked
  *
**/

/**
  * Node-event fired when the resetbutton is clicked. This is not the same as the 'reset'-event because the latter
  * gets fired on a form-reset.
  *
  * @event Y.Node.reset:click
  * @param e {EventFacade} Event Facade including:
  * @param e.target {Y.Node} The ButtonNode that was clicked
  *
**/

YArray.each(
    [SUBMIT, RESET],
    function(eventtype) {
        var conf = {
            on: function (node, subscription, notifier) {
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
                    if (targetNode && ((targetNode.getAttribute(DATA_BUTTON_TYPE)===eventtype) ||
                        ((targetNode.getAttribute(DATA_BUTTON_TYPE)===BUTTON) && (targetNode.getAttribute(DATA_BUTTON_SUBTYPE)===eventtype)))) {
                        // The notifier triggers the subscriptions to be executed.
                        // Pass its fire() method the triggering DOM event facade
                        notifier.fire(e);
                    }
                });
            },
            // The logic executed when the 'tripleclick' subscription is `detach()`ed
            detach: function (node, subscription) {
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


}, '@VERSION@', {
    "requires": [
        "yui-base",
        "node-core",
        "node-event-delegate",
        "datatype-date-format",
        "event-base",
        "event-synthetic",
        "yui-later",
        "promise",
        "event-tap",
        "event-custom",
        "node-style",
        "escape",
        "yui-later",
        "intl",
        "gallerycss-itsa-base",
        "gallery-tipsy",
        "gallery-itsawidgetrenderpromise"
    ],
    "skinnable": true
});
