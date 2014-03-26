YUI.add('gallery-formvalidator', function(Y) {

/**
     * @module Validator
     * @title Form Validator Widget
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * @namespace Validator
     * This is the main form validator class. This widget will allow developers to easily
     * transform a standard form into a fully interactive form that handle almost all
     * invalid inputs gracefully and improve user experience.
     * @class Form
     */
    var YL = Y.Lang, S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    },
    /**
     * This will make a random guid id.  This is useful for ensuring ajax requests
     * don't get cached.
     */
    guid = function() {
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    },
    /**
     * THis will get all submit buttons in the form that are to be a part of the form validator.
     * This will exclude forms inside of other forms that are going to use the form validator.
     */
    GETSUBMITBUTTONS = function(parent){
        var rtVl = [],children,i;
        if ((parent.tagName !== null && parent.tagName !== undefined) && (parent.tagName.toLowerCase() == 'input') && (parent.type == 'submit')){
            return [parent];
        }
        children = parent.children;
        if (children === null || children === undefined){
            children = parent.childNodes;
        }
        for (i = 0 ; i < children.length; ++i){
            rtVl = rtVl.concat(GETSUBMITBUTTONS(children[i]));
        }
        return rtVl;
    },
    /**
     * Returns true if the given dom is marked as a form (inline).
     */
    ISFORM = function(dom){
        var formIndicator;
        if (dom.getAttribute === null || dom.getAttribute === undefined){
            return false;
        }
        formIndicator = dom.getAttribute('formvalidator:Form');
        if (formIndicator === null || formIndicator === undefined){
            return false;
        }
        formIndicator = formIndicator.toLowerCase();
        return (formIndicator == 'yes') || (formIndicator == 'true');
    },
    /**
     * This will collect all inputs with inline declarations.
     */
    GETINLINEDECLARATIONS = function(parent){
        var rtVl = [],isGroup = false,children = null,i=0,inlineIndicator,groupIndicator;
        if (parent.getAttribute !== null && parent.getAttribute !== undefined){
            inlineIndicator = parent.getAttribute('formvalidator:FormField');
            groupIndicator = parent.getAttribute('formvalidator:FormGroup');
            // add parent to the return value if the parent is a form field

            if ((inlineIndicator !== null && inlineIndicator !== undefined) && ((inlineIndicator.toLowerCase() == 'true') || (inlineIndicator.toLowerCase() == 'yes'))){
                rtVl[0] = parent;
            }
            if ((groupIndicator !== null && groupIndicator !== undefined) && ((groupIndicator.toLowerCase() == 'true') || (groupIndicator.toLowerCase() == 'yes'))){
                isGroup = true;
            }
        }

        children = parent.children;
        if (children === null || children === undefined){
            children = parent.childNodes;
        }
        for (i = 0 ; i < children.length; ++i){
            // if the element in an inner form, we skip it, as we do not want to add
            // that form's inputs to the this form
            if (!ISFORM(children[i])){
                rtVl = rtVl.concat(GETINLINEDECLARATIONS(children[i]));
            }
        }
        // groups need to have their members placed inside json structure so those
        // inputs can be put into the group, instead of on the main level.
        if (isGroup){
            return [
            {
                isGroup:true,
                groupDOM:parent,
                members:rtVl
            }
            ];
        }
        else{
            return rtVl;
        }
    };
    /**
     * @constructor
     * This will initailize the form validator with the given configuration json object
     * @param {Object} config Configuration object containing everything for configuring the form validator object.
     */
    function _Validator(config){
        _Validator.superclass.constructor.apply(this,arguments);
        this._initializeEvents();
        this.initializeInputs();
        this.initializeButtons();
        this.checkFormValues();
        this.on('inputfield:onchanged',this.onFormValueChanged);
        if (this.get('checkOnSubmit')){
            this.enableButtons();
        }
        this.publish(_Validator.CE_ONSUBMIT);
    }
    _Validator.staticFunctions = {
        /**
         * Static function that will set a boolean value for a property
         * @method BOOLEANSETTER
         * @static
         * @param {boolean|string} val value of yes/no/true/false
         */
        BOOLEANSETTER:function(val){
            if (YL.isBoolean(val)){
                return val;
            }
            else if (YL.isString(val)){
                return val.toLowerCase() == 'true';
            }
            else{
                return val !== null && val !== undefined;
            }
        }
    };
    Y.augment(_Validator, Y.EventTarget);
    // attributes
    _Validator.ATTRS = {
        /**
         * This is used for custom inputs so their validator object can be stored in the form
         * until the instance of is pulled out of an inline attribute
         * @property customGlobal
         * @type Object
         */
        customGlobal:{
            value:{}
        },
        /**
         * This is the form DOM object (or any DOM object) that surrounds
         * the inputs of the form. (NOTE: Not all inputs HAVE to be inside the form dom if your using the JSON method
         * to declar your fields).
         * @property form
         * @type HTMLElement
         */
        form:{
            setter:function(el){
                var rtVl = el;
                if (YL.isString(el)){
                    rtVl = Y.DOM.byId(el);
                }
                if (rtVl === null || rtVl === undefined){
                    throw 'Invalid form: Form with id ' + el + ' does not exist';
                }
                return rtVl;
            },
            value:null
        },
        /**
         * Default value is false, when set to true, indicators on inputs, and the form's status will only
         * update when the submit button is clicked.
         * @property checkOnSubmit
         * @type boolean
         */
        checkOnSubmit:{
            value:false,
            setter:_Validator.staticFunctions.BOOLEANSETTER

        },
        /**
         * This is a function that is called after the form is checked, and is valid, but before
         * the actual submit takes place.  If this function returns true, the form will submit,
         * if it returns false, the form submission will not proceed.
         * @property onSubmit
         * @type Function
         */
        onSubmit:{
            value:null
        },
        /**
         * This is the scope in which the onSubmit function will be executed.  If this
         * is null, the function will be executed in the global scope.
         * @property onSubmitScope
         * @type Object
         */
        onSubmitScope:{
            value:null
        },
        /**
         * This is a setting passed onto each field added to the validator.  If
         * this is true, the input field will create an incorrect indicator based
         * setting in the configuration object passed to the field, or on the default settings passed to it
         * from this class.
         * @property createIncorrectIndicator
         * @type boolean
         */
        createIncorrectIndicator:{
            value:false
        },
        /**
         * This is a setting passed onto each field added to the validator.  If
         * this is true, the input field will create an correct indicator based
         * setting in the configuration object passed to the field, or on the default settings passed to it
         * from this class.
         * @property createIncorrectIndicator
         * @type boolean
         */
        createCorrectIndicator:{
            value:false
        },
        /**
         * This is the name of the type of dom object used to create the indicators.
         * The default is SPAN
         * @property defaultIndicatorDomType
         * @type string
         */
        defaultIndicatorDomType:{
            value:'SPAN'
        },
        /**
         * The default css used when creating the incorrect indicator dynamically.  This
         * css value is '' by default, and will be passed to any input field added
         * to the validator if they do not already have this property set in their configuration.
         * @property defaultIncorrectIndicatorCss
         * @type string
         */
        defaultIncorrectIndicatorCss:{
            value:''
        },
        /**
         * The default css used when creating the correct indicator dynamically.  This
         * css value is '' by default, and will be passed to any input field added
         * to the validator if they do not already have this property set in their configuration.
         * @property defaultCorrectIndicatorCss
         * @type string
         */
        defaultCorrectIndicatorCss:{
            value:''
        },
        /**
         * The default text that will be used to set the innerHTML of the correct indicator
         * when it is created dynamically. A non breakable space by default, and will be passed to any input field added
         * to the validator if they do not already have this property set in their configuration.
         * @property correctIndicatorText
         * @type string
         */
        correctIndicatorText:{
            value:'&nbsp;'
        },
        /**
         * The default text that will be used to set the innerHTML of the incorrect indicator
         * when it is created dynamically. A non breakable space by default, and will be passed to any input field added
         * to the validator if they do not already have this property set in their configuration.
         * @property correctIndicatorText
         * @type string
         */
        incorrectIndicatorText:{
            value:'&nbsp;'
        },
        /**
         * This will hold the JSON configuration for all inputs passed to the form validator.
         * This will be intereated through, and the actual input field objects created
         * when the form is initialized.
         * @property fieldJSON
         * @type Object[]
         */
        fieldJSON:{
            value:[]
        },
        /**
         * This will hold the JSON configuration for all buttons passed to the form validator.
         * This will be intereated through, and the actual button objects created
         * when the form is initialized.
         * @property buttonJSON
         * @type Object[]
         */
        buttonJSON:{
            value:[]
        },
        /**
         * This is a list of input field objects that represent inputs that are to be validated using the validator.
         * @property inputFields
         * @type BaseInputField[]
         */
        inputFields:{
            value:[]
        },
        /**
         * List of buttons that will only enable if all the inputs on the form
         * validator are correct.
         * @property buttons
         * @type Button[]
         */
        buttons:{
            value:[]
        },
        /**
         * List of ids of submit buttons that are exempt from the form validator.  For instance, you may
         * have a submit button that deletes the data pertaining to the record open in the form.
         * Obviously the form should not have to be filled in correctly to do this.
         * @property excludedButtons
         * @type string[]
         */
        excludedButtons:{
            value:[]
        }
    };
    _Validator.NAME = 'Validator';
    /**
     * This is the event that is invoked the form is submitted.
     * @event onsubmit
     */
    _Validator.CE_ONSUBMIT = 'form:onsubmit';
    Y.extend(_Validator,Y.Base,{
        /**
         * This function will process the input field configurations in the fieldJSON
         * property, and have all fields instantiated and initialized and stored
         * in the inputFields property.
         * @method initializeInputs
         */
        initializeInputs:function(){
            var fields = this.get('fieldJSON'),i,newField,syncDom;
            for (i = 0 ; i < fields.length; ++i){
                newField = new fields[i].type(fields[i].atts,false);
                syncDom = newField.getInputDOM();
                if (syncDom !== null && syncDom !== undefined){
                    newField.synchronize(syncDom);
                }
                this.addInput(newField);
            }
            this.initializeInlineInputs(); // now do the inline, done after so that if some data is inline, and some and json, we don't re-add the input field from inline
        },
        /**
         * This will return an input with the given id.  Any inputs with a null
         * id will never be returned from this function.
         * @method getInput
         * @return {BaseInputField} field with the given id.
         */
        getInput:function(id){
            if (id === null || id === undefined){
                return null; // if they use null, we don't want anything coming back, if we didn't exit here, an item with a null id might be returned, and that would be bad practice
            }
            var inputFields = this.get('inputFields'),i,rtVl;
            for (i = 0 ; i < inputFields.length ; ++i){
                if (inputFields[i].getId() == id){
                    return inputFields[i];
                }
                if (inputFields[i].isGroup()){
                    rtVl = inputFields[i].getInput(id);
                    if (rtVl !== null && rtVl !== undefined){
                        return rtVl;
                    }
                }
            }
            return null;
        },
        /**
         * This will clear all inputs.  If silent mode is true, the indicators and buttons
         * will not update until an input is changed, or a submit button is pressed.
         * @method clear
         * @param {boolean} silent If set to true, the form validator's status will not update.
         */
        clear:function(silent){
            var inputFields = this.get('inputFields'),i;
            for (i = 0 ; i < inputFields.length ; ++i){
                inputFields[i].clear(silent);
            }
        },
        /**
         * This will take the new field that is to be added to the form, and apply any
         * default settings from the Form's defaults to the input field, if they haven't been set.
         * For instance, defaultCorrectIndicatorCss will be applied to correctIndicatorCss property
         * in the input field if that property has not been set for the newField
         * @method setupInput
         * @param {BaseInputField} newField Input field that is to be added to the Form.
         */
        setupInput:function(newField){
            // setup the defaults
            newField.set('createIncorrectIndicator',this.get('createIncorrectIndicator'));
            newField.set('createCorrectIndicator',this.get('createCorrectIndicator'));
            this.checkAttribute(newField,'defaultIncorrectIndicatorCss','incorrectIndicatorCss');
            this.checkAttribute(newField,'defaultCorrectIndicatorCss','correctIndicatorCss');
            this.checkAttribute(newField,'defaultIndicatorDomType','indicatorType');
            this.checkAttribute(newField,'correctIndicatorText','correctIndicatorText');
            this.checkAttribute(newField,'incorrectIndicatorText','incorrectIndicatorText');
            newField.initializeInput(this);
            // if we are only checking on submit, then the events on the inputs do not need to be listened for
            // this will gain us some performance.
            if (!this.get('checkOnSubmit')){
                newField.initializeEvents();
            }
            newField.addTarget(this);
        },
        /**
         * This will add the given field to the form validator.  It will first, setup
         * the input using the setupInput function, then it will add it to it's list
         * of input fields.
         * @method addInput
         * @param {BaseInputField} newField Input field that is to be added to the Form.
         */
        addInput:function(newField){
            this.setupInput(newField);
            var inputFields = this.get('inputFields');
            inputFields[inputFields.length] = newField;
        },
        /**
         * This function will initialize inputs that are declared inline.  If they are already
         * declared in the JSON, then their JSON definition is updated with any settings that are set inline.
         * @method initializeInlineInputs
         */
        initializeInlineInputs:function(){
            var inlineFields = GETINLINEDECLARATIONS(this.get('form')),i;
            for (i = 0 ; i < inlineFields.length; ++i){
                this.addInlineInput(inlineFields[i]);
            }
        },
        /**
         * This will add all the member doms to the given group JSON def.
         * @method constructInlineGroup
         */
        constructInlineGroup:function(group){
            var memberDOMS = group.members,theGroup = this.getInput(group.groupDOM.id),groupNew = false,i,tempInput,type,newField;
            if (theGroup === null || theGroup === undefined){
                groupNew = true;
                theGroup = new Y.GroupBaseField({
                    groupDOM:group.groupDOM
                    },false);
                theGroup.synchronize(group.groupDOM);
            }

            for (i = 0 ; i < memberDOMS.length; ++i){
                tempInput = this.getInput(memberDOMS[i].id);
                if (memberDOMS[i].isGroup){
                    theGroup.addInput(this.constructInlineGroup(memberDOMS[i]));
                }
                // if the field exists already, don't do anything
                // For inputs with no ids, they cannot be put in through JSON, only inline, so we don't need to worry
                else if (tempInput === null || tempInput === undefined) {
                    type = Y[memberDOMS[i].getAttribute('formvalidator:type')];
                    newField = new type({
                        inputDOM:memberDOMS[i]
                        },false);
                    this.setupInput(newField);
                    theGroup.addInput(newField,this);
                    newField.synchronize(memberDOMS[i]);
                }
            }
            if (groupNew){
                this.setupInput(theGroup);
            }
            return theGroup;
        },
        /**
         * This will take the given inputDOM, extract all form validator specific
         * attributes from the DOM object, and create an input field from that and add
         * it to this form validator.
         * @method addInlineInput
         * @param {HTMLEelement} inputDOM Element that has form validator attributes declared.
         */
        addInlineInput:function(inputDOM){
            var newField = null,tempInput,type;
            // if it is a group, only the group is added, the members belong only to the group
            if (inputDOM.isGroup){
                newField = this.constructInlineGroup(inputDOM);
                this.addInput(newField);
            }
            else{
                tempInput = this.getInput(inputDOM.id);
                if (tempInput !== null && tempInput !== undefined){
                    inputDOM.id = 'formvalidator:' + guid();
                }
                type = Y[inputDOM.getAttribute('formvalidator:type')];
                newField = new type({
                    inputDOM:inputDOM
                },false);
                this.addInput(newField);
                newField.synchronize(inputDOM);
            }
        },
        /**
         * This is used to check to see if an attributes has been set on the target, if
         * not then the attName property is used to retreive a default value set in the Form's
         * main object.
         * @method checkAttribute
         * @param {BaseInputField} target The input field who's attribute is being checked
         * @param {string} attName Name of the attribute in the main form validator object that holds the Default value if the target's targetAttName has no value
         * @param {strubg} targetAttName Name of the target's attribute that is being checked for a value
         */
        checkAttribute:function(target,attName,targetAttName){
            var targetAttValue = target.get(targetAttName);
            if (targetAttValue === null || targetAttValue === undefined){
                target.set(targetAttName,this.get(attName));
            }
        },
        /**
         * This will initialize all buttons given in the button list, well as
         * any submit buttons in the form not in the exclude list
         * @method initializeButtons
         */
        initializeButtons:function(){
            var buttonJSON = this.get('buttonJSON'),
            buttons = this.get('buttons'),
            excludedButtons = this.get('excludedButtons'),i,j,submitButtons,found,buttonEl;
            for (i = 0; i < buttonJSON.length; ++i){
                buttons[i] = new Y.Button(buttonJSON[i]);
                buttonEl = buttons[i].get('buttonEl');
                if (buttonEl.type == 'button'){
                    Y.Event.attach('click',this.submitForm,buttonEl,this,true);
                }
            }
            // now we find all buttons in the form that are NOT excluded.
            submitButtons = GETSUBMITBUTTONS(this.get('form'));
            for (i = 0 ; i < submitButtons.length; ++i){
                found = false;
                for (j = 0 ; j < excludedButtons.length ; ++j){
                    if (excludedButtons[j] == submitButtons[i].id){
                        found = true;
                        break;
                    }
                }
                if (!found){
                    buttons[buttons.length] = new Y.Button({
                        buttonEl:submitButtons[i]
                    });
                }
            }
        },
        /**
         * This will call the form's submit method.  If the form is not valid, the form
         * will not submit.
         * @method submitForm
         */
        submitForm:function(){
            var form = this.get('form');
            if (form.submit !== null && form.submit !== undefined){
                form.submit();
            }
        },
        /**
         * This will initialize the submit and reset events on the form validator.  The form
         * validator will listen for these events and cancel any if need be.
         * @method _initializeEvents
         */
        _initializeEvents:function(){
            Y.Event.attach('submit',this._onFormSubmit,this.get('form'),this,true);
            Y.Event.attach('reset',this._onFormReset,this.get('form'),this,true);
        },
        /**
         * This will get called when the form is submitted.  This will prevent the event
         * from succeeding if the form is invalid.
         * @method _onFormSubmit
         * @param {Event} ev Event that caused the submit
         */
        _onFormSubmit:function(ev){
            var onSubmitFunc = this.get('onSubmit'),
            onSubmitScope = this.get('onSubmitScope'),
            rtVl = true;
            if (onSubmitFunc !== null && onSubmitFunc !== undefined){
                if (onSubmitScope !== null && onSubmitScope !== undefined){
                    onSubmitScope.anonymousCall = onSubmitFunc;
                    rtVl = onSubmitScope.anonymousCall();
                    onSubmitScope.anonymousCall = null;
                }
                else{
                    rtVl = onSubmitFunc();
                }
            }
            if (!this.checkFormValues()){
                ev.preventDefault();
                return;
            }
            else if (!rtVl){
                ev.preventDefault();
            }
            this.fire(_Validator.CE_ONSUBMIT);
        },
        /**
         * This will get called when the form is reset, this will cause the form to recheck all it's values
         * and show the proper indicators.
         * @method _onFormReset
         * @param {Event} ev Event that caused the reset.
         */
        _onFormReset:function(ev){
            //console.debug('form reset');
            var that = this;
            setTimeout(function(){
                that.checkFormValues();
            },100);
            this.checkFormValues();
        },
        /**
         * Called when a value in the form changes.  This will determine if the submit buttons
         * are enabled and disabled.
         * @method onFormValueChanged
         */
        onFormValueChanged:function(){
            var inputFields = this.get('inputFields'),
            rtVl = true,i;
            for (i = 0 ; i < inputFields.length; ++i){
                rtVl = rtVl && inputFields[i].isValid();
            }
            // now if rtVl is false, we disable all buttons, otherwise, we enable all buttons.
            if (rtVl){
                this.enableButtons();
            }
            else{
                this.disableButtons();
            }
            return rtVl;
        },
        /**
         * Checks the form values and makes sure the proper indicators are showing and returns
         * true if the form is considered valid.
         * @method checkFormValues
         * @return {boolean} true if the form is valid.
         */
        checkFormValues:function(){
            var inputFields = this.get('inputFields'),
            rtVl = true,i;
            for (i = 0 ; i < inputFields.length; ++i){
                rtVl = inputFields[i].checkIndicators() && rtVl;
            }
            // now if rtVl is false, we disable all buttons, otherwise, we enable all buttons.
            if (rtVl){
                this.enableButtons();
            }
            else{
                this.disableButtons();
            }
            return rtVl;
        },
        /**
         * This will disable all submit buttons
         * @method disableButtons
         */
        disableButtons:function(){
            if (this.get('checkOnSubmit')){
                return; // don't disable buttons if its check on submit only
            }
            var buttons = this.get('buttons'),i;
            for (i = 0 ; i < buttons.length; ++i){
                buttons[i].disable();
            }
        },
        /**
         * This will enable all submit buttons
         * @method enableButtons
         */
        enableButtons:function(){
            var buttons = this.get('buttons'),i;
            for (i = 0 ; i < buttons.length; ++i){
                buttons[i].enable();
            }
        }
    });
    Y.Validator = _Validator;
/**
     * @namespace Validator
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * This is a button object that will represent a button that is controlled
     * by the form validator.  The buttons only function will be to enable and disable
     * depending on the validity of the data entered on the form.
     * @class Button
     */
    /**
     * @constructor
     * This will initialize the button with the given configuration
     * @param {Object} config Configuration for the button that will be applied to the properties of the button (Probably just a button el)
     */
    function _Button(config){
        _Button.superclass.constructor.apply(this,arguments);
    }
    _Button.ATTRS = {
        /**
         * This is the button that will be enable/disabled by the form validator
         * @property buttonEl
         * @type {HTMLElement}
         */
        buttonEl:{
            value:null,
            setter:function(el){
                var rtVl = el;
                if (YL.isString(el)){
                    rtVl = Y.DOM.byId(el);
                }
                if (rtVl === null || rtVl === undefined){
                    throw 'Invalid button: Button with id ' + el + ' does not exist';
                }
                return rtVl;
            }
        }
    };
    _Button.NAME = 'Button';
    Y.extend(_Button,Y.Base,{
        /**
         * This will enable the button
         * @method enable
         */
        enable:function(){
            this.get('buttonEl').disabled = false;
        },
        /**
         * This will disable the button
         * @method disable
         */
        disable:function(){
            this.get('buttonEl').disabled = true;
        }
    });
    Y.Button = _Button;
/**
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * @namespace Validator
     * This class is what all INput fields used in the form validator will inherit from.  This provides
     * the basic general attributes and functions required by all input fields.
     * @class BaseInputField
     * @extends Base
     */
    /**
     * @constructor This will store all the attributes given as parameters
     */
    function _BaseInputField(){
        _BaseInputField.superclass.constructor.apply(this,arguments);
        this.publish(_BaseInputField.CE_ONCHANGE);
        this.checkPrompt();
    }
    Y.augment(_BaseInputField, Y.EventTarget);
    _BaseInputField.staticVariables = {
        MAX_INTEGER:2147483647,
        INTEGERREGEX:/(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)/,
        DOUBLEREGEX:/(^-?\d\d*\.\d+$)|(^-?\d\d*$)|(^-?\.\d\d*$)/,
        EMAILREGEX:/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    };

    _BaseInputField.staticFunctions = {
        /**
         * This is the setter used for setting regular expression properties.  IF the value is a string,
         * it will parse the regular expression and return it.  If it is a regex, it will simply return the
         * value passed in.
         * @method standardRegexSetter
         * @param {String|Regex} val
         * @static
         */
        standardRegexSetter:function(val){
            if (YL.isString(val)){
                var valToUse = val;
                if (valToUse.indexOf('/') === 0){
                    valToUse = valToUse.substring(1);
                }
                if (valToUse.charAt(valToUse.length - 1) == '/'){
                    valToUse = valToUse.substring(0,valToUse.length - 1);
                }
                return new RegExp(valToUse);
            }
            else{
                return val;
            }
        },
        /**
         * Static function for setting an dom element as an attribute.  This will
         * allow that attribute to support an id or the element itself.
         * @method standardElSetter
         * @static
         * @param {HTMLElement|String} el Id or el that is to be set for the property in question.
         */
        standardElSetter:function(el){
            if (el === null || el === undefined){
                return null;
            }
            var rtVl = el;
            if (YL.isString(el)){
                rtVl = Y.DOM.byId(el);
            }
            if (rtVl === null || rtVl === undefined){
                return el;
            }
            else{
                return rtVl;
            }
        },
        /**
         * Static function that will set a boolean value for a property
         * @method BOOLEANSETTER
         * @static
         * @param {boolean|string} val value of yes/no/true/false
         */
        BOOLEANSETTER:function(val){
            if (YL.isBoolean(val)){
                return val;
            }
            else if (YL.isString(val)){
                return val.toLowerCase() == 'true';
            }
            else{
                return val !== null && val !== undefined;
            }
        }
    };
    _BaseInputField.ATTRS = {
        /**
         * This will be set to true if the Incorrect indicator is to be created
         * upon instantiation of the input field.
         * @property createIncorrectIndicator
         * @type boolean
         */
        createIncorrectIndicator:{
            value:false
        },
        /**
         * This will be set to true if the correct indicator is to be created
         * upon instantiation of the input field.
         * @property createCorrectIndicator
         * @type boolean
         */
        createCorrectIndicator:{
            value:false
        },
        /**
         * This is the DOM element type for the indicator.  The default for
         * this will be span.
         * @property indicatorType
         * @type string
         */
        indicatorType:{
            value:null
        },
        /**
         * This is the css that is to be applied to the indicator.  Default
         * will be correctIndicator
         * @property correctIndicatorCss
         * @type string
         */
        correctIndicatorCss:{
            value:null
        },
        /**
         * This is the css that is to be applied to the indicator.  Default
         * will be incorrectIndicator
         * @property incorrectIndicatorCss
         * @type string
         */
        incorrectIndicatorCss:{
            value:null
        },
        /**
         * If set, this will be shown to indicate that the input is correct
         * @property correctIndicator
         * @type HTMLElement
         */
        correctIndicator:{
            value:null,
            setter:_BaseInputField.staticFunctions.standardElSetter
        },
        /**
         * This will be the text that will be used inside the DOM of the incorrect indicator.
         * If none is provided, none will be used
         * @property incorrectIndicatorText
         * @type string
         */
        incorrectIndicatorText:{
            value:null
        },
        /**
         * This will be the text that will be used inside the DOM of the correct indicator.
         * If none is provided, none will be used
         * @property correctIndicatorText
         * @type string
         */
        correctIndicatorText:{
            value:null
        },
        /**
         * If set, this will be shown to indicate that the input is incorrect
         * @property incorrectIndicator
         * @type HTMLElement
         */
        incorrectIndicator:{
            value:null,
            setter:_BaseInputField.staticFunctions.standardElSetter
        },
        /**
         * If set, this will be applied to the the input to signify that it is correct
         * @property correctCss
         * @type string
         */
        correctCss:{
            value:null
        },
        /**
         * If set, this will be applied to the the input to signify that it is incorrect
         * @property incorrectCss
         * @type string
         */
        incorrectCss:{
            value:null
        },
        /**
         * This is set to true when the input is considered disabled.  False otherwise
         * @property disabled
         * @type boolean
         */
        disabled:{
            value:false
        },
        /**
         * If false, this will signal that the input is considered off, and is not factored
         * into the validation.
         * @property isOn
         * @type boolean
         */
        isOn:{
            value:true
        },
        /**
         * If set, this will show that the input is considered optional, and if not filled
         * in, won't cause the form to be invalid.
         * @property optional
         * @type boolean
         */
        optional:{
            value:false
        },
        /**
         * This must provide a function and an html element.  A scope may be optionally provided. <br />
         * &#123;fn: function(el, field) {}, scope: this, el: 'validation-prompt'&#124;
         * @property validationPrompt
         * @type HTMLElement
         */
        validationPrompt: {
            value: null,
            setter: function(val) {
                if (!YL.isObject(val)) {
                    return null;
                }
                else if (!val.el) {
                    return null;
                }
                else if (!val.fn) {
                    val.fn = function(el, field) {
                        if (!field.isValid() && !field.isEmpty()) {
                            el.style.display = '';
                        }
                        else {
                            el.style.display = 'none';
                        }
                    }
                }
                val.el = _BaseInputField.staticFunctions.standardElSetter(val.el);
                val.el.style.display = 'none'; // start off as hidden.
                return val;
            }
        }
    };
    _BaseInputField.NAME = 'BaseInputField';
    /**
     * This is the even that is invoked when the input field is considered changed
     * @event onchange
     */
    _BaseInputField.CE_ONCHANGE = 'inputfield:onchanged';
    Y.extend(_BaseInputField,Y.Base,{
        /**
         * To be overridden by subclasses.  This will typically initialize all inidicators
         * and any other initialization that is required
         * @method initializeInput
         * @param {Validator.Form} validator Validator to which the Base Input gets default values from.
         */
        initializeInput:function(validator){},
        /**
         * This will return the dom that represents the input.  This will be overriden
         * by all subclasses
         * @method getInputDOM
         * @return {HTMLElement} input dom for this field.
         */
        getInputDOM:function(){return null;},
        /**
         * Returns true if the given input is turned on.
         * @method inputIsOn
         * @return {boolean} true if the input is on.
         */
        inputIsOn:function(){
            return this.get('isOn');
        },
        /**
         * This will clear the input of all value.  This is typically overriden
         * by the subclasses
         * @param {boolean} silent Set to true if the change event is NOT to be fired afterwards, as a result the form
         * would not be updated to reflect any changes.
         */
        clear:function(silent) {},
        isGroup:function(){return false;},
        /**
         * This will set the disabled attribute to false.
         * @method enable
         */
        enable:function(){
            this.set('disabled',false);
        },
        /**
         * This will set the disabled attribute to true.
         * @method disable
         */
        disable:function(){
            this.set('disabled',true);
        },
        /**
         * This will syncronize all attributes found inline in the EL.
         * Inline attributes will override JSON defined attributes.
         * @method synchronize
         * @param {HTMLElement} el Element that will have inline attributes pertaining to the input.
         */
        synchronize:function(el){
            var attributes = this.getAttrs(false),value,key;
            for (key in attributes){
                if (true){ // get rid of warning in YUI builder.
                    value = el.getAttribute('formvalidator:' + key);
                    if (value !== null && value !== undefined){
                        this.set(key,value);
                    }
                }
            }
        },
        /**
         * Returns true if the input for the field is valid.  This must
         * be overridden by the subclasses.
         * @method isValid
         * @return {boolean} returns true if the input for the field is valid.
         */
        isValid:function(){
            throw 'Plesae override the isValid function';
        },
        /**
         * This will turn the input off.  After this it will not be considered
         * in determining if the form is valid.
         * @method turnOff
         */
        turnOff:function() {
            this.set('isOn',false);
            this._evtOnChange();
        },
        /**
         * This will turn the input on.  After this it WILL be considered
         * in determining if the form is valid.
         * @method turnOn
         */
        turnOn:function() {
            this.set('isOn',true);
            this._evtOnChange();
        },
        /**
         * This will ensure the proper css and/or dom is showing to indicate
         * that the input is valid or invalid.
         * @method checkIndicators
         */
        checkIndicators: function () {},
        /**
         * This will ensure the validation prompt function gets called and the
         * proper validation tip gets displayed.
         * @method checkPrompt
         */
        checkPrompt: function () {
            var prompt = this.get('validationPrompt'), scope, fn;
            if (!prompt) {
                return;
            }
            // if the input is not on, then hide the validation prompt
            if (!this.inputIsOn()) {
                prompt.el.style.display = 'none';
                return;
            }
            scope = prompt.scope || {};
            fn = prompt.fn || function() {};
            fn.call(scope, prompt.el, this);
        },
        /**
         * This will be overriden by subclasses, but this will hide the incorrect
         * indicator and show the correct indicator if there is one.  It will also
         * apply the correct css to the input if there is correct css defined.
         * @method showCorrectIndicator
         */
        showCorrectIndicator:function(){},
        /**
         * This will be overriden by subclasses, but this will hide the correct
         * indicator and show the incorrect indicator if there is one.  It will also
         * apply the incorrect css to the input if there is incorrect css defined.
         * @method showCorrectIndicator
         */
        showIncorrectIndicator:function(){},
        /**
         * This will be overriden by subclasses, but this will hide all indicators
         * and remove all indicator css from the input.
         */
        showNoIndicators:function(){},
        /**
         * This function will setup the input field based on the attributes
         * given in the constructor and attributes that may be inline in the DOM.
         * @method setup
         */
        setupIndicators:function(){
            var correctIndicator = this.get('correctIndicator'),
            incorrectIndicator = this.get('incorrectIndicator');
            if (this.get('createCorrectIndicator')){
                this.set('correctIndicator',this.setupDomItem(correctIndicator,this.get('correctIndicatorText'),this.get('correctIndicatorCss')));
            }
            if (this.get('createIncorrectIndicator')){
                this.set('incorrectIndicator',this.setupDomItem(incorrectIndicator,this.get('incorrectIndicatorText'),this.get('incorrectIndicatorCss')));
            }
        },
        /**
         * If the given EL is a string, it will create a dom object and have it inserted
         * beside the input.  It will then ensure that all the defaults are set on the dom.
         * @method setupDomItem.
         * @param {HTMLElement} el Element that will be used as an indicator.
         * @param {String} html Html that will go inside the el
         * @param {String} className className that is to be applied to the el.
         */
        setupDomItem:function(el,html,className){
            var theDom = el;
            // create the dom element, and then insert it beside the input dom.
            if ((theDom === null || theDom === undefined) || YL.isString(theDom)){
                theDom = document.createElement(this.get('indicatorType'));
                if (el !== null && el !== undefined){
                    theDom.id = el;
                }
                this.insertBeside(theDom);
                theDom.innerHTML = html;
            }
            if ((theDom.className === '' || theDom.className === null || theDom.className === undefined) && (className !== null && className !== undefined)){
                theDom.className = className;
            }
            return theDom;
        },
        /**
         * The input can optionally override this function so they can
         * retrieve their particular input from the form validator.  If they do
         * not override this, then everyting will still work, they just won't be
         * able to retreive it by name from the form validator.
         * @method getId
         * @return {number} the id of the input field
         */
        getId:function() {return null;},
        /**
         * Returns true if the input for the field is considered empty
         * @method isEmpty
         * @return {boolean} True if the input field is considered empty.
         */
        isEmpty:function(){
            throw 'Plesae override the isEmpty function';
        },
        /**
         * This will initialize the events that will notify this input if it was changed
         * If target is null, then the target will be the Input Field.
         * @method initializeEvents
         */
        initializeEvents:function(target){},
        /**
         * This will get called when the input is changed, which will in turn fire the inputChangedEvent.
         * If the input is in a group, the group's event will get fired, not the field's
         * @method _evtOnChange
         */
        _evtOnChange:function(e){
            this.checkPrompt();
            this.checkIndicators();
            this.fire(_BaseInputField.CE_ONCHANGE);
        },
        /**
         * This function will insert the given el beside the main input.  This must be overriden
         * in the subclasses.  To implement this, simply find the parent of the current input
         * starting from the body tag or the form tag and work your way down until you find it.
         * @method insertBeside
         * @param {HTMLElement} el DOM object to be insert beside the main input.
         */
        insertBeside:function(el) {},
        /**
         * Initializer, called before the class is instantiated
         * @method initializer
         */
        initializer:function() {},
        /**
         * destructor, called after the class is destroyed
         * @method destructor
         */
        destructor:function(){}
    });
    Y.BaseInputField = _BaseInputField;
/**
     * @namespace Validator
     * This class is the text base input field and will be extended by all
     * Inputs who's values will be text based in anyway.  Examples include a number input,
     * select box or a text input.
     * @class TextBaseField
     * @extends BaseInputField
     */
    /**
     * @constructor
     * This will setup the text base field with the all the settings.  These settings
     * are contained in the config parameter
     * @param {Object} config Configuratino settings for the input.
     * @param {boolean} initialize Flag that says whether or not to call the initialize input function
     */
    function _TextBaseField(config,initialize){
        _TextBaseField.superclass.constructor.apply(this,arguments);
        // next the correct and incorrect indicators need to be setup.
        if (initialize){
            this.initializeInput();
        }
        this.get('textType');
    }
    _TextBaseField.ATTRS = {
        /**
         * This will state the maximum length of the string in the input.  This
         * value is 255 by default.
         * @property maxLength
         * @type Number
         */
        maxLength:{
            value:255,
            setter:function(val){
                if (val < 0){
                    return 255;
                }
                else{
                    return val;
                }
            }
        },
        /**
         * Formatter used for formatting the result typed into the text field.
         * This can be a function that takes the input text and returns it in a
         * desired format, or it could be an object that has a format function.
         * @property formatter
         * @type {Function|Object}
         */
        formatter:{
            value:null,
            setter:function(val){
                if (val === null || val === undefined){
                    return null;
                }
                if (YL.isFunction(val)){
                    return val;
                }
                else if (YL.isObject(val)){
                    if (val.format === null || val === undefined){
                        throw 'Formatter object must have a formatter function';
                    }
                    return val;
                }
                else{
                    throw 'Formatter must be an object or a function';
                }
            }
        },
        /**
         * Regular expression the input must match in order for the input to be correct.
         * If set to null, this is ignored in the isValid function.
         * @property regex
         * @type regex
         */
        regex:{
            value:null,
            setter:Y.BaseInputField.staticFunctions.standardRegexSetter
        },
        /**
         * This property is optional for those who wish to use the pre-canned regular expressions.
         * This can be set to any of the following types <br/>
         * <ul>
         *  <li>Email</li>
         *  <li>Phone</li>
         *  <li>CreditCard</li>
         *  <li>Zipcode</li>
         *  <li>Postalcode</li>
         * </ul>
         * @property textType
         * @type string
         */
        textType:{
            lazy:false,
            value:null,
            setter:function(val){
                if (val === null || val === undefined){
                    return null;
                }
                else if (val.toLowerCase() == 'email'){
                    this.set('regex',Y.BaseInputField.staticVariables.EMAILREGEX);
                }
                else if (val.toLowerCase() == 'phone'){
                    this.set('regex',/^([(]?[2-9]\d{2}[)]?)[ ]*-?[ ]*(\d{3})[ ]*-?[ ]*(\d{4})$/);
                }
                else if (val.toLowerCase() == 'creditcard'){
                    this.set('regex',/[0-9]{4} {0,1}[0-9]{4} {0,1}[0-9]{4} {0,1}[0-9]{4}/);
                }
                else if (val.toLowerCase() == 'zipcode'){
                    this.set('regex',/^(\d{5})([\s]*-[\s]*\d{4})?$/);
                }
                else if (val.toLowerCase() == 'postalcode'){
                    this.set('regex',/^[a-zA-Z]{1}[0-9]{1}[a-zA-Z]{1}[\s]*[0-9]{1}[a-zA-Z]{1}[0-9]{1}$/);
                }
                return val;
            }
        },
        /**
         * This is the main input DOM that the validator will check input on.
         * @property inputDOM
         * @type HTMLElement
         */
        inputDOM:{
            value:null,
            setter:Y.BaseInputField.staticFunctions.standardElSetter
        }
    };
    _TextBaseField.NAME = 'TextBaseField';
    Y.extend(_TextBaseField,Y.BaseInputField,{
        /**
         * This will setup the indicators for the input
         * @method initializeInput
         */
        initializeInput:function(){
            this.setupIndicators();
        },
        /**
         * This will reset the text field to ''
         * @method clear
         * @param {boolean} silent Set to true if you do not want the clear to invoke a form validator change event.
         */
        clear:function(silent){
            this.get('inputDOM').value = '';
            if (silent !== true){
                this._evtOnChange();
            }
        },
        /**
         * This will return the dom that represents the input.
         * @method getInputDOM
         * @return {HTMLElement} input dom for this field.
         */
        getInputDOM:function(){return this.get('inputDOM');},
        /**
         * This will disable the input.
         * @method disable
         */
        disable:function(){
            _TextBaseField.superclass.disable.call(this);
            this.get('inputDOM').disabled = true;
        },
        /**
         * This will enable the input.
         * @method enable
         */
        enable:function(){
            _TextBaseField.superclass.enable.call(this);
            this.get('inputDOM').disabled = false;
        },
        /**
         * Returns true only if the input is not empty, and it is not longer than the maximum length setting
         * @method isValid
         * @return {boolean} true if the input is not empty, and it is not longer than the maximum length setting
         */
        isValid:function(){
            if (!this.get('isOn')){
                return true; // is always valid if off
            }
            if (this.get('optional') && this.isEmpty()){
                return true;
            }
            var regex = this.get('regex'),
            value = this.get('inputDOM').value;
            if ((regex !== null && regex !== undefined) && (!regex.test(value))){
                return false; // return false if the value does not match the format of the set regular expression
            }
            return !this.isEmpty() && value.length <= this.get('maxLength');
        },
        /**
         * Returns the id of the input dom
         * @method getId
         * @return {string} id of the input dom.
         */
        getId:function(){
            return this.get('inputDOM').id;
        },
        /**
         * Returns true if the input dom has an empty string value.
         * @method isEmpty
         * @return {boolean} true if the input is not ''
         */
        isEmpty:function(){
            return (this.get('inputDOM').value === '');
        },
        /**
         * This will ensure the input is formatted as desired using the formatter, but only
         * if the input is valid.  If it does not match the regular expression, this will not call
         * the format method/object's format method.
         * @method checkFormat
         */
        checkFormat:function(){
            if (!this.isValid()){
                return; // input has to be valid first
            }
            if (!this.inputIsOn()){
                return; // if its off, who cares
            }
            var formatter = this.get('formatter'),inputDOM;
            if (formatter === null || formatter === undefined){
                return;
            }
            inputDOM = this.get('inputDOM');
            if (YL.isFunction(formatter)){
                inputDOM.value = formatter(inputDOM.value);
            }
            else{
                inputDOM.value = formatter.format(inputDOM.value);
            }
        },
        /**
         * This will ensure the proper css and/or dom is showing to indicate
         * that the input is valid or invalid.
         * @method checkIndicators
         * @return {boolean} True if input is valid
         */
        checkIndicators:function(){
            if (!this.inputIsOn()){
                this.showNoIndicators();
                return true;
            }
            else if (this.get('optional') && this.isEmpty()){
                this.showNoIndicators();
                return true;
            }
            else if (this.isValid()){
                this.showCorrectIndicator();
                this.checkFormat();
                return true;
            }
            else{
                this.showIncorrectIndicator();
                return false;
            }
        },
        /**
         * This will ensure that the incorrect indicator is hidden and the incorrect css is not used, and will
         * ensure that the correct indicator is showing, and the correct css is applied.
         * @method showCorrectIndicator
         */
        showCorrectIndicator:function(){
            var inputDom = this.get('inputDOM'),
            correctIndicator = this.get('correctIndicator'),
            incorrectIndicator = this.get('incorrectIndicator');

            this.checkFormat();
            Y.DOM.removeClass(inputDom,this.get('incorrectCss'));
            Y.DOM.addClass(inputDom,this.get('correctCss'));
            if (correctIndicator !== null && correctIndicator !== undefined){
                correctIndicator.style.display = '';
            }
            if (incorrectIndicator !== null && incorrectIndicator !== undefined){
                incorrectIndicator.style.display = 'none';
            }
        },
        /**
         * This will ensure that the correct indicator is hidden and the correct css is not used, and will
         * ensure that the incorrect indicator is showing, and the correct css is applied.
         * @method showCorrectIndicator
         */
        showIncorrectIndicator:function(){
            var inputDom = this.get('inputDOM'),
            correctIndicator = this.get('correctIndicator'),
            incorrectIndicator = this.get('incorrectIndicator');
            Y.DOM.addClass(inputDom,this.get('incorrectCss'));
            Y.DOM.removeClass(inputDom,this.get('correctCss'));
            if (correctIndicator !== null && correctIndicator !== undefined){
                correctIndicator.style.display = 'none';
            }
            if (incorrectIndicator !== null && incorrectIndicator !== undefined){
                incorrectIndicator.style.display = '';
            }
        },
        /**
         * This will ensure NO indicators are showing.
         * method @showNoIndicators
         */
        showNoIndicators:function(){
            var inputDom = this.get('inputDOM'),
            correctIndicator = this.get('correctIndicator'),
            incorrectIndicator = this.get('incorrectIndicator');
            Y.DOM.removeClass(inputDom,this.get('incorrectCss'));
            Y.DOM.removeClass(inputDom,this.get('correctCss'));
            if (correctIndicator !== null && correctIndicator !== undefined){
                correctIndicator.style.display = 'none';
            }
            if (incorrectIndicator !== null && incorrectIndicator !== undefined){
                incorrectIndicator.style.display = 'none';
            }
        },
        /**
         * This function will insert the given el beside the inputDOM.
         * @method insertBeside
         * @param {HTMLElement} el DOM object to be insert beside the main input.
         */
        insertBeside:function(el) {
            if (Y.DOM.insertAfter) {
                Y.DOM.insertAfter(el,this.get('inputDOM'));
            }
            else {
                Y.DOM.addHTML(this.get('inputDOM'), el, 'after');
            }
            
        },
        /**
         * This will attach the keyup event to the input dom.
         * @method initializeEvents
         * @param {HTMLElement} target The Object that will be listening to the key up and blur events of the input DOM.
         */
        initializeEvents:function(target){
            var theTarget = target;
            if (theTarget === null || theTarget === undefined){
                theTarget = this;
            }
            Y.Event.attach('keyup',theTarget._evtOnChange,this.get('inputDOM'),theTarget,true);
            Y.Event.attach('blur',theTarget._evtOnChange,this.get('inputDOM'),theTarget,true);
        }
    });
    Y.TextBaseField = _TextBaseField;
/**
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * @namespace Validator
     * This will represent a checkbox field in the form validator.  Checkbox
     * field can be put into a group based field or left on its' own.
     *
     * @class CheckboxField
     * @extends BaseInputField
     */
    /**
     * @constructor
     * This will initialize the element with the given configuration.  Most of this will
     * be passed to the BaseInputField.
     * @param {Object} config Configuration for the checkbox field.  Probably just the validWhenChecked property
     */
    function _CheckboxField(config){
        _CheckboxField.superclass.constructor.apply(this,arguments);
    }
    _CheckboxField.ATTRS = {
        /**
         * The dom that represents the checkbox
         * @property inputDOM
         * @type HTMLElement
         */
        inputDOM:{
            value:null,
            setter:Y.BaseInputField.staticFunctions.standardElSetter
        },
        /**
         * If set to true, this checkbox will be considered valid if checked
         * @property validWhenChecked
         * @type boolean
         */
        validWhenChecked:{
            value:true
        }
    };
    _CheckboxField.NAME = 'CheckboxField';
    Y.extend(_CheckboxField,Y.BaseInputField,{
        /**
         * Sets up the indicators
         * @method initializeInput
         */
        initializeInput:function(){
            this.setupIndicators();
            //this.initializeEvents();
        },
        /**
         * This will return the dom that represents the input.
         * @method getInputDOM
         * @return {HTMLElement} input dom for this field.
         */
        getInputDOM:function(){return this.get('inputDOM');},
        /**
         * This will set the checkbox back to unchecked if checked is valid, and checked, if unchecked is valid.
         * @method clear
         */
        clear:function(silent){
            this.get('inputDOM').checked = !this.get('validWhenChecked');
            if (silent !== true){
                this._evtOnChange();
            }
        },
        /**
         * This disables the checkbox
         * @method disable
         */
        disable:function(){
            _CheckboxField.superclass.disable.call(this);
            this.get('inputDOM').disabled = true;
        },
        /**
         * This enables the checkbox
         * @method enable
         */
        enable:function(){
            _CheckboxField.superclass.enable.call(this);
            this.get('inputDOM').disabled = false;
        },
        /**
         * Returns true only if the input is not empty, and it is not longer than the maximum length setting
         * @method isValid
         * @return {boolean} true if the input is not empty, and it is not longer than the maximum length setting
         */
        isValid:function(){
            if (!this.get('isOn')){
                return true; // is always valid if off
            }
            var validWhenChecked = this.get('validWhenChecked'),
            checked = this.get('inputDOM').checked;
            return (validWhenChecked && checked) || (!validWhenChecked && !checked);
        },
        /**
         * Returns the id of the group based field.
         * @method getId
         * @return {String} id of the checkbox dom.
         */
        getId:function(){
            return this.get('inputDOM').id;
        },
        /**
         * Returns the true if the checkbox input is invalid.
         * @method isEmpty
         * @return {boolean} true if the checkbox is not valid.
         */
        isEmpty:function(){
            return !this.isValid();
        },
        /**
         * This will ensure no indicators are showing, or css applied to the input that
         * would signify correctness or incorrectness.
         * @method showNoIndicators
         */
        showNoIndicators:function(){
            var dom = this.get('inputDOM'),
            correctIndicator = this.get('correctIndicator'),
            incorrectIndicator = this.get('incorrectIndicator');

            Y.DOM.removeClass(dom,this.get('incorrectCss'));
            Y.DOM.removeClass(dom,this.get('correctCss'));
            if (correctIndicator !== null && correctIndicator !== undefined){
                correctIndicator.style.display = 'none';
            }
            if (incorrectIndicator !== null && incorrectIndicator !== undefined){
                incorrectIndicator.style.display = 'none';
            }
        },
        /**
         * This will ensure the proper css and/or dom is showing to indicate
         * that the input is valid or invalid.
         * @method checkIndicators
         * @return {boolean} True if input is valid
         */
        checkIndicators:function(){
            var dom = this.get('inputDOM'),
            correctIndicator = this.get('correctIndicator'),
            incorrectIndicator = this.get('incorrectIndicator');
            if (!this.get('isOn')){
                this.showNoIndicators();
                return this.isValid();
            }
            else if (this.isValid()){
                if (dom !== null && dom !== undefined){
                    Y.DOM.removeClass(dom,this.get('incorrectCss'));
                    Y.DOM.addClass(dom,this.get('correctCss'));
                }
                if (correctIndicator !== null && correctIndicator !== undefined){
                    correctIndicator.style.display = '';
                }
                if (incorrectIndicator !== null && incorrectIndicator !== undefined){
                    incorrectIndicator.style.display = 'none';
                }
                return true;
            }
            else{
                if (dom !== null && dom !== undefined){
                    Y.DOM.addClass(dom,this.get('incorrectCss'));
                    Y.DOM.removeClass(dom,this.get('correctCss'));
                }
                if (correctIndicator !== null && correctIndicator !== undefined){
                    correctIndicator.style.display = 'none';
                }
                if (incorrectIndicator !== null && incorrectIndicator !== undefined){
                    incorrectIndicator.style.display = '';
                }
                return false;
            }
        },
        /**
         * Inidicators are usually applicable to checkboxes, so creating them dynamically doesn't
         * make much sense, this method does nothing.
         * @method insertBeside
         * @param {HTMLElement} el DOM object to be insert beside the main input.
         */
        insertBeside:function(el) {
        },
        /**
         * This will initialize the checkbox so the form status is updated when the checkbox is clicked.
         * @method initializeEvents
         * @param {HTMLElement} target The object that will be listening to the events of the click event of the input DOM
         */
        initializeEvents:function(target){
            var theTarget = target;
            if (theTarget === null || theTarget === undefined){
                theTarget = this;
            }
            Y.Event.attach('click',theTarget._evtOnChange,this.get('inputDOM'),theTarget,true);
        }
    });
    Y.CheckboxField = _CheckboxField;
/**
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * @namespace Validator
     * This is a catch all class for types of input that do not fit the existing input types.
     * @class CustomField
     * @extends BaseInputField
     */
    /**
     * @constructor
     * Takes the given configuration and initializes the input field's properties.
     */
    function _CustomField(config){
        _CustomField.superclass.constructor.apply(this,arguments);
    }
    _CustomField.ATTRS = {
        /**
         * This will be an object that can optionally implement all the
         * functions used by an input field.  This can also be a function, which
         * retrieves the object, or a string, which can be the name of an instance
         * object or function call to retreive it.
         * @property emptyValue
         * @type {Object}
         */
        validatorObject:{
            setter:function(val){
                if (val === null || val === undefined){
                    throw 'You must provide a validator object to the custom input';
                }
                var rtVl = null;
                if (YL.isString(val)){
                    rtVl = validatorGlobal[val];//eval(val);
                }
                else if (YL.isFunction(val)){
                    rtVl = val();
                }
                else if (YL.isObject(val)){
                    rtVl = val;
                }

                if (rtVl === null || rtVl === undefined){
                    throw 'Your validator object must be a object';
                }
                else{
                    return rtVl;
                }
            }
        },
        /**
         * Property that can be optional set for the custom input for looking up the object
         */
        id:{
            value:null
        }
    };
    _CustomField.NAME = 'CustomField';
    Y.extend(_CustomField,Y.BaseInputField,{
        /**
         * This will ensure the proper dom is showing to indicate
         * that the input is valid or invalid.
         * @method checkIndicators
         * @return {boolean} True if input is valid
         */
        checkIndicators:function(){
            var correctIndicator = this.get('correctIndicator'),
            incorrectIndicator = this.get('incorrectIndicator');
            if (this.isValid()){
                if (correctIndicator !== null && correctIndicator !== undefined){
                    correctIndicator.style.display = '';
                }
                if (incorrectIndicator !== null && incorrectIndicator !== undefined){
                    incorrectIndicator.style.display = 'none';
                }
                return true;
            }
            else{
                if (correctIndicator !== null && correctIndicator !== undefined){
                    correctIndicator.style.display = 'none';
                }
                if (incorrectIndicator !== null && incorrectIndicator !== undefined){
                    incorrectIndicator.style.display = '';
                }
                return false;
            }
        },
        /**
         * If the id is set, that value will be returned.  If not, then it will
         * see if the validator object
         * @method getId
         * @return {String} id The id that was set to the custom validator on initialization.
         */
        getId:function(){
            var rtVl = this.get('id');
            if (rtVl === null || rtVl === undefined){
                rtVl = this.executeFunction('getId',null);
            }
            return rtVl;
        },
        /**
         * This will execute the function with the specified name on the validator object
         * @method executeFunction
         * @private
         * @return {Object} value returned from the function call
         */
        executeFunction:function(name,defaultReturn){
            var obj = this.get('validatorObject');
            if (YL.isFunction(obj[name])){
                return obj[name]();
            }
            return defaultReturn;
        },
        /**
         * This will execute the function with the given name with the assumption it returns nothing
         * @method executeVoidFunction
         * @private
         */
        executeVoidFunction:function(name){
            var obj = this.get('validatorObject');
            if (YL.isFunction(obj[name])){
                obj[name]();
            }
        },
        /**
         * Calls the disable function on the custom validator object if it exists.
         * @method disable
         */
        disable:function(){
            _CustomField.superclass.disable.call(this);
            this.executeVoidFunction('disable');
        },
        /**
         * Calls the enable function on the custom validator object if it exists.
         * @method enable
         */
        enable:function(){
            _CustomField.superclass.enable.call(this);
            this.executeVoidFunction('enable');
        },
        /**
         * Calls the turnOff function on the custom validator object if it exists.
         * @method turnOff
         */
        turnOff:function(){
            _CustomField.superclass.turnOff.call(this);
            this.executeVoidFunction('turnOff');
        },
        /**
         * Calls the turnOn function on the custom validator object if it exists.
         * @method turnOn
         */
        turnOn:function(){
            _CustomField.superclass.turnOn.call(this);
            this.executeVoidFunction('turnOn');
        },
        /**
         * Calls the clear function on the custom validator object if it exists.
         * @method clear
         * @param {boolean} silent True if the clear action will not invoke an on change event.
         */
        clear:function(silent){
            var obj = this.get('validatorObject');
            if (YL.isFunction(obj.clear)){
                obj.clear(silent);
            }
            if (silent !== true){
                this._evtOnChange();
            }
        },
        /**
         * Executs the custom validator object's isEmpty function
         * @return {boolean} returns what the validator object's empty function returns.
         */
        isEmpty:function(){
            return this.executeFunction('isEmpty',false);
        },
        /**
         * Returns true if the value selected in the dom doesn't match the value
         * set for the emptyValue property.
         * @return {boolean} false if the value in the select input matches the specified empty value
         */
        isValid:function(){
            return this.executeFunction('isValid',false);
        },
        /**
         * This will call the insertBeside function on the validator Object if it exists.  It will
         * pass the dom object that is to be inserted.
         * @method insertBeside
         * @param {HTMLElement} el DOM object to be insert beside the main input.
         */
        insertBeside:function(el) {
            var obj = this.get('validatorObject');
            if (YL.isFunction(obj.insertBeside)){
                obj.insertBeside(el);
            }
        }
    });
    Y.CustomField = _CustomField;
/**
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * @namespace Validator
     * This input field is for text input of doubles or floats.
     * @class DoubleField
     * @extends TextBaseField
     */
    /**
     * @constructor
     * This will initialize the double field, and its' base fields properties.
     * @param {Object} config Configuration JSON.
     */
    function _DoubleField(config){
        _DoubleField.superclass.constructor.apply(this,arguments);
        this.set('regex',Y.BaseInputField.staticVariables.DOUBLEREGEX);
    }
    _DoubleField.ATTRS = {
        /**
         * This is set to true if the minimum allowed values boundary is inclusive
         * @property minInclusive
         * @type boolean
         */
        minInclusive:{
            value:true,
            setter:Y.BaseInputField.staticFunctions.BOOLEANSETTER
        },
        /**
         * This is set to true if the maximum allowed values boundary is inclusive
         * @property maxInclusive
         * @type boolean
         */
        maxInclusive:{
            value:true,
            setter:Y.BaseInputField.staticFunctions.BOOLEANSETTER
        },
        /**
         * This is the minimum allowed value in the double field.  Default value
         * is the minimum value for an integer
         * @property min
         * @type number
         */
        min:{
            value:0,
            setter:function(val){
                var rtVl = val;
                if (!YL.isNumber(rtVl)){
                    rtVl = parseFloat(rtVl);
                }
                if (!YL.isNumber(rtVl)){
                    throw 'Invalid value given for min: ' + val;
                }
                if (rtVl < (-1)*Y.BaseInputField.staticVariables.MAX_INTEGER){
                    return (-1)*Y.BaseInputField.staticVariables.MAX_INTEGER;
                }
                return rtVl;
            }
        },
        /**
         * This is the maximum allowed value in the double field. Default value
         * is the maximum value for an integer
         * @property max
         * @type number
         */
        max:{
            value:Y.BaseInputField.staticVariables.MAX_INTEGER,
            setter:function(val){
                var rtVl = val;
                if (!YL.isNumber(rtVl)){
                    rtVl = parseFloat(rtVl);
                }
                if (!YL.isNumber(rtVl)){
                    throw 'Invalid value given for max: ' + val;
                }
                if (rtVl > Y.BaseInputField.staticVariables.MAX_INTEGER){
                    return Y.BaseInputField.staticVariables.MAX_INTEGER;
                }
                return rtVl;
            }
        },
        /**
         * If set, this will restrict the number of decimal places allowed on the double.  This could
         * be done with regular expression, but this makes it a bit easier for everyone.
         * @property maxDecimalPlaces
         * @type number
         */
        maxDecimalPlaces:{
            value:-1,
            setter:function(val){
                var rtVl = val;
                if (!YL.isNumber(rtVl)){
                    rtVl = parseInt(rtVl,10);
                }
                if (!YL.isNumber(rtVl)){
                    throw 'Invalid value given for decimal places: ' + val;
                }
                else{
                    return val;
                }
            }
        }
    };
    _DoubleField.NAME = 'DoubleField';
    Y.extend(_DoubleField,Y.TextBaseField,{
        /**
         * This will return true if the input matches the double regular expression
         * and, if max decimals are set, the number of decimals places.
         * @method isValid
         * @return {boolean} true if the input is a valid double.
         */
        isValid:function(){
            if (!_DoubleField.superclass.isValid.call(this)){
                return false; // return false if it doesn't match the double regex
            }
            else if (this.get('optional') && this.isEmpty()){
                return true;
            }
            var value = this.get('inputDOM').value,numVal = 0,minInclusive,maxInclusive,min,max,decimals,
            maxDecimals = this.get('maxDecimalPlaces');
            if ((maxDecimals != -1) && (value.indexOf('.') != -1)){
                decimals = value.split('.')[1];
                if (decimals.length > maxDecimals) {
                    return false;
                }
            }
            try{numVal = parseFloat(value,10);}
            catch(e){return false;}

            if (numVal.toString() === null || numVal.toString() === undefined){
                return false;
            }
            if (numVal.toString().toLowerCase() == 'nan'){
                return false;
            }

            minInclusive = this.get('minInclusive');
            maxInclusive = this.get('maxInclusive');
            min = this.get('min');
            max = this.get('max');

            if (minInclusive && (min > numVal)){
                return false;
            }
            else if (!minInclusive && (min >= numVal)){
                return false;
            }
            else if (maxInclusive && (max < numVal)){
                return false;
            }
            else if (!maxInclusive && (max <= numVal)){
                return false;
            }
            else{
                return true;
            }
        }
    });
    Y.DoubleField = _DoubleField;
/**
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * @namespace Validator
     * This input field is for text input of whole numbers.
     * @class IntegerField
     * @extends DoubleField
     */
    /**
     * @constructor
     * This will initialize the integer field, and its' base fields properties.  This
     * will also set the integer regular expression in the Base class.  This will
     * require all inputs to have an integer format.
     * @param {Object} config Configuration JSON.
     */
    function _IntegerField(config){
        _IntegerField.superclass.constructor.apply(this,arguments);
        this.set('regex',Y.BaseInputField.staticVariables.INTEGERREGEX);
    }
    _IntegerField.ATTRS = {};
    _IntegerField.NAME = 'IntegerField';
    Y.extend(_IntegerField,Y.DoubleField,{
        /**
         * This method returns true if the input in the input DOM's value matches
         * the format required for an integer.
         * @method isValid
         * @return {boolean} true if the field is a valid integer
         */
        isValid:function(){
            if (!_IntegerField.superclass.isValid.call(this)){
                return false; // return false if it doesn't match the double regex
            }
            else if (this.get('optional') && this.isEmpty()){
                return true;
            }

            var value = this.get('inputDOM').value,theVal = 0;
            if ( value.indexOf( '.' ) != -1 ){
                return false; // don't allow numbers with decimals
            }
            try{theVal = parseInt(value,10);}
            catch(e){return false;}

            if ( theVal.toString().toLowerCase() == 'nan' ){
                return false;
            }
            else{
                return true;
            }
        }
    });
    Y.IntegerField = _IntegerField;
/**
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * @namespace Validator
     * This class is the text base input field and will be extended by all
     * Inputs who's values will be text based in anyway.  Examples include a number input,
     * select box or a text input.
     * @class GroupBaseField
     * @extends BaseInputField
     */
    /**
     * @constructor
     * This will initialize the group with the given configuration json object.
     * @param {Object} config JSON configuration object containing the properties of the GroupBaseField
     */
    function _GroupBaseField(config){
        _GroupBaseField.superclass.constructor.apply(this,arguments);
    }
    _GroupBaseField.ATTRS = {
        /**
         * This is the dom that contains the group's child elements.  This is optional
         * as the group's child inputs do not have to be contained in a dom element
         * @property groupDOM
         * @type HTMLElement
         */
        groupDOM:{
            value:null,
            setter:Y.BaseInputField.staticFunctions.standardElSetter
        },
        /**
         * This will contain the raw json of the input fields that will belong
         * to the group input.
         * @property membersJSON
         * @type Object[]
         */
        membersJSON:{
            value:[]
        },
        /**
         * When the member inputs are process and instantiated they are placed
         * in this collection where they are persisted.
         * @property members
         * @type BaseInputField[]
         */
        members:{
            value:[],
            setter:function(val){
                if (YL.isArray(val)){
                    return val;
                }
                else{
                    throw 'The members property of a group must be an array';
                }
            }
        },
        /**
         * Minimum number of inputs that need to be properly filled in for this to be valid.
         * 0 to state that none have to be filled in. If not set, this is property is not used.
         * @property minValid
         * @type {number}
         */
        minValid:{
            value:null,
            setter:function(val){
                if (val === null || val === undefined){
                    return null;
                }
                var theVal = val,max;
                if (!YL.isNumber(theVal)){
                    theVal = parseInt(theVal,10);
                }
                if (theVal < 1){
                    throw 'The minimum must be greater than 1';
                }

                max = this.get('maxValid');
                if ((max !== null && max !== undefined) && (theVal > max)){
                    throw 'Minimum must be less than or equal to maximum';
                }
                else{
                    return theVal;
                }
            }
        },
        /**
         * Maximum nuymber of fields that can be filled in.  Anymore (valid or not) and the group is invalid.
         * If not set, this is property is not used.
         * @property maxValid
         * @type number
         */
        maxValid:{
            value:null,
            setter:function(val){
                if (val === null || val === undefined){
                    return null;
                }
                if (val < 1){
                    throw 'The maximum must be greater than 1';
                }
                var min = this.get('minValid');
                if ((min !== null && min !== undefined) && (val < min)){
                    throw 'Maximum must be greater than or equal to minimum';
                }
                else{
                    return val;
                }
            }
        },
        /**
         * Property that can be optional set for the custom input for looking up the object
         * @property id
         * @type string
         */
        id:{
            value:null
        }
    };
    _GroupBaseField.NAME = 'GroupBaseField';
    Y.extend(_GroupBaseField,Y.BaseInputField,{
        /**
         * Indicator function to help the form validator deal with the regular inputs and group
         * inputs differently on some occasions.
         * @method isGroup
         * @return boolean True all the time, as this is infact a group
         */
        isGroup:function(){return true;},
        /**
         * This will return the dom that represents the input.
         * @method getInputDOM
         * @return {HTMLElement} input dom for this field.
         */
        getInputDOM:function(){return this.get('groupDOM');},
        /**
         * This will return any member input with the given id.
         * @method getInput
         * @param {string} id Id of an input
         * @return {BaseInputField} The field with the given id, null if no such field exists
         */
        getInput:function(id){
            var members = this.get('members'),rtVl,i;
            for (i = 0; i < members.length; ++i){
                if (members[i].getId() == id){
                    return members[i];
                }
                if (members[i].isGroup()){
                    rtVl = members[i].getInput(id);
                    if (rtVl !== null && rtVl !== undefined){
                        return rtVl;
                    }
                }
            }
            return null;
        },
        /**
         * This will call the clear method (in silent mode) on all member inputs.
         * If silent is true, it will then fire its own on change event.
         * @method clear
         * @param {boolean} silent True if this will call the on change event
         */
        clear:function(silent){
            var members = this.get('members'),i;
            for (i = 0; i < members.length; ++i){
                members[i].clear(true);
            }
            if (silent !== true){
                this._evtOnChange();
            }
        },
        /**
         * This will disable all the inputs in the group
         * @method disable
         */
        disable:function(){
            _GroupBaseField.superclass.disable.call(this);
            var members = this.get('members'),i;
            for (i = 0; i < members.length; ++i){
                members[i].disable();
            }
        },
        /**
         * This will enable all the inputs in the group
         * @method enable
         */
        enable:function(){
            _GroupBaseField.superclass.enable.call(this);
            var members = this.get('members'),i;
            for (i = 0; i < members.length; ++i){
                members[i].enable();
            }
        },
        /**
         * This will turn on all the members of the group, including the group as well
         * @method turnOn
         */
        turnOn:function(){
            _GroupBaseField.superclass.turnOn.call(this);
            var members = this.get('members'),i;
            for (i = 0; i < members.length; ++i){
                members[i].turnOn();
            }
            this.checkIndicators();
        },
        /**
         * This will turn off all the members of the group, including the group as well
         * @method turnOff
         */
        turnOff:function(){
            _GroupBaseField.superclass.turnOff.call(this);
            var members = this.get('members'),i;
            for (i = 0; i < members.length; ++i){
                members[i].turnOff();
            }
        },
        /**
         * This will take the members json and initialize the inputs.  Validator
         * is required for setting up the field based on settings given to the
         * main form validator.
         * @method initializeInput
         * @param {Validator} validator The validator this input gets it's default values from.
         */
        initializeInput:function(validator){
            var membersJSON = this.get('membersJSON'),
            members = this.get('members'),newField,i;
            for (i = 0 ; i < membersJSON.length; ++i){
                 newField = new membersJSON[i].type(membersJSON[i].atts,false);
                 validator.setupInput(newField);
                 members[members.length] = newField;
            }
            this.setupIndicators();
            this.checkIndicators();
        },
        /**
         * This will add the given field to the group as an input.
         * @method addInput
         * @param {BaseInputField} newField The new field to be added to the group.
         */
        addInput:function(newField){
            var members = this.get('members');
            members[members.length] = newField;
        },
        /**
         * Returns true only if the input is not empty, and it is not longer than the maximum length setting
         * @method isValid
         * @return {boolean} true if the input is not empty, and it is not longer than the maximum length setting
         */
        isValid:function(){
            if (this.get('optional') && this.isEmpty()){
                return true;
            }
            var members = this.get('members'),
            numValid = 0,
            groupOn = this.get('isOn'),rtVl = true,empty,valid,minValid,maxValid,i;
            for (i = 0; i < members.length; ++i){
                empty = members[i].isEmpty();
                valid = members[i].isValid();

                if (!empty && valid){
                    numValid++;
                }
                else if (!empty){
                    return !groupOn; // if not empty, and not valid then the whole group is invalid (only if the group is on
                }
            }
            if (groupOn){
                minValid = this.get('minValid');
                maxValid = this.get('maxValid');
                if (minValid !== null && minValid !== undefined){
                    rtVl = minValid <= numValid;
                }
                if (maxValid !== null && maxValid !== undefined){
                    rtVl = (maxValid >= numValid) && rtVl;
                }
            }
            return rtVl;
        },
        /**
         * Returns the id of the group based field.
         * @method getId
         * @return {string} id of the group base field if the id property was set, null otherwise.
         */
        getId:function(){
            var id = this.get('id'),groupDOM;
            if (id !== null && id !== undefined){
                return id;
            }
            groupDOM = this.get('groupDOM');
            if (groupDOM !== null && groupDOM !== undefined){
                return groupDOM.id;
            }
            else{
                return null;
            }
        },
        /**
         * Returns true all the members of the group are empty
         * @method isEmpty
         * @return {boolean} true if all members of the group are empty
         */
        isEmpty:function(){
            var members = this.get('members'),i;
            for (i = 0; i < members.length; ++i){
                if (!members[i].isEmpty()){
                    return false;
                }
            }
            return true;
        },
        /**
         * This will show the correct indicator, and apply the correct css to the input
         * if they are set for the group.  It will also ensure the incorrect indicator
         * is not showing, and incorrect css is not applied.
         * @method showCorrectIndicator
         */
        showCorrectIndicator:function(){
            var groupDom = this.get('groupDOM'),
            correctIndicator = this.get('correctIndicator'),
            incorrectIndicator = this.get('incorrectIndicator');
            if (groupDom !== null && groupDom !== undefined){
                Y.DOM.removeClass(groupDom,this.get('incorrectCss'));
                Y.DOM.addClass(groupDom,this.get('correctCss'));
            }
            if (correctIndicator !== null && correctIndicator !== undefined){
                correctIndicator.style.display = '';
            }
            if (incorrectIndicator !== null && incorrectIndicator !== undefined){
                incorrectIndicator.style.display = 'none';
            }
        },
        /**
         * This will show the incorrect indicator, and apply the incorrect css to the input
         * if they are set for the group.  It will also ensure the correct indicator
         * is not showing, and correct css is not applied.
         * @method showIncorrectIndicator
         */
        showIncorrectIndicator:function(){
            var groupDom = this.get('groupDOM'),
            correctIndicator = this.get('correctIndicator'),
            incorrectIndicator = this.get('incorrectIndicator');
            if (groupDom !== null && groupDom !== undefined){
                Y.DOM.addClass(groupDom,this.get('incorrectCss'));
                Y.DOM.removeClass(groupDom,this.get('correctCss'));
            }
            if (correctIndicator !== null && correctIndicator !== undefined){
                correctIndicator.style.display = 'none';
            }
            if (incorrectIndicator !== null && incorrectIndicator !== undefined){
                incorrectIndicator.style.display = '';
            }
        },
        /**
         * This will ensure all indicators are not showing, and no indicator css
         * is applied to the input
         * @method showNoIndicators
         */
        showNoIndicators:function(){
            var groupDom = this.get('groupDOM'),
            correctIndicator = this.get('correctIndicator'),
            incorrectIndicator = this.get('incorrectIndicator');
            if (groupDom !== null && groupDom !== undefined){
                Y.DOM.removeClass(groupDom,this.get('incorrectCss'));
                Y.DOM.removeClass(groupDom,this.get('correctCss'));
            }
            if (correctIndicator !== null && correctIndicator !== undefined){
                correctIndicator.style.display = 'none';
            }
            if (incorrectIndicator !== null && incorrectIndicator !== undefined){
                incorrectIndicator.style.display = 'none';
            }
        },
        /**
         * This will ensure the proper css and/or dom is showing to indicate
         * that the input is valid or invalid.  This will also ensure that the
         * right indicators are showing on the children of the group.  Any change
         * in a member of the group will cause this method in the group to be executed.
         * @method checkIndicators
         * @return {boolean} True if input is valid
         */
        checkIndicators:function(){
            var members = this.get('members'),
            numValid = 0,
            oneInvalid = false,
            groupOn = this.get('isOn'),
            empty,i,valid,rtVl = true,minValid,maxValid;
            for (i = 0; i < members.length; ++i){
                empty = members[i].isEmpty();
                valid = members[i].isValid();
                if (!groupOn){
                    members[i].showNoIndicators();
                }
                else if (this.get('optional') && this.isEmpty()){
                    members[i].showNoIndicators();
                }
                else if (!empty && valid){
                    numValid++;
                    members[i].showCorrectIndicator();
                }
                else if (!empty){
                    members[i].showIncorrectIndicator();
                    oneInvalid = true;
                }
                else{
                    members[i].showNoIndicators();
                }
            }
            // if one was not empty and invalid, then return false;
            if (!oneInvalid){
                minValid = this.get('minValid');
                maxValid = this.get('maxValid');
                if (minValid !== null && minValid !== undefined){
                    rtVl = minValid <= numValid;
                }
                if (maxValid !== null && maxValid !== undefined){
                    rtVl = (maxValid >= numValid) && rtVl;
                }
            }
            else{
                rtVl = false;
            }
            if (!groupOn){
                this.showNoIndicators();
                return true;
            }
            else if (this.get('optional') && this.isEmpty()){
                this.showNoIndicators();
                return true;
            }
            else if (rtVl){
                this.showCorrectIndicator();
                return true;
            }
            else{
                this.showIncorrectIndicator();
                return false;
            }
        },
        /**
         * Indicators are not created dynamically for groups at the moment.
         * @method insertBeside
         * @param {HTMLElement} el DOM object to be insert beside the main input.
         */
        insertBeside:function(el) {
        },
        /**
         * This will go through each member and initialize their event.
         * @method initializeEvents
         * @param {Object} target The target that will be listening to the events of the members.
         */
        initializeEvents:function(target){
            var theTarget = target,members = this.get('members'),i;
            if (theTarget === null || theTarget === undefined){
                theTarget = this;
            }
            for (i = 0; i < members.length; ++i){
                members[i].initializeEvents(theTarget); // the members will use the parent target as their event catcher
                // this will cause the events to bubble up in the group.
            }
            //this.checkIndicators();
        }
    });
    Y.GroupBaseField = _GroupBaseField;
/**
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * @namespace Validator
     * This field is for password input on a form.  This would be used for having users
     * select a password, and requiring a minimum strength to be required.
     * @class PasswordField
     * @extends TextBaseField
     */
    /**
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * @namespace Validator
     * This field is for password input on a form.  This would be used for having users
     * select a password, and requiring a minimum strength to be required.
     * @class PasswordField
     * @extends TextBaseField
     */
    /**
     * @constructor
     * This will initialize the password field using the given json configuration
     * @param {Object} config Configuration object
     */
    function _PasswordField(config){
        _PasswordField.superclass.constructor.apply(this,arguments);
    }
    _PasswordField.staticVariables = {
        // default strong password
        StrongPassword:/^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).*$/,
        // default medium password
        MediumPassword:/^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$/,
        // default minimum password
        MinimumPassword:/(?=.{6,}).*/
    };
    _PasswordField.ATTRS = {
        /**
         * This is the required level of strength for the password field to be
         * considered valid.  In this field, 1=min, 2=med, 3=max.  You
         * can set this property by using min, med, or max, or 1,2 or 3.  The default
         * strength level is medium.
         * @property requiredLevel
         * @type {string|number}
         */
        requiredLevel:{
            value:2,
            setter:function(val){
                if (val === null || val === undefined){
                    return 'med'; // medium by default
                }
                if (YL.isNumber(val)){
                    return val;
                }
                else if (YL.isString(val)){
                    if (val != 'min' && val != 'med' && val != 'max'){
                        throw 'Invalid level requirement, please use min, med or max';
                    }
                    if (val == 'min'){
                        return 1;
                    }
                    else if (val == 'med'){
                        return 2;
                    }
                    else if (val == 'max'){
                        return 3;
                    }
                    else{
                        return 2;
                    }
                }
                throw 'Invalid level requirement, please use min, med or max';
            }
        },
        /**
         * The dom object that appears when the first level of strength has been met (min)
         * @property minIndicator
         * @type HTMLElement
         */
        minIndicator:{
            value:null,
            setter:Y.BaseInputField.staticFunctions.standardElSetter
        },
        /**
         * The dom object that appears when the second level of strength has been met (med)
         * @property medIndicator
         * @type HTMLElement
         */
        medIndicator:{
            value:null,
            setter:Y.BaseInputField.staticFunctions.standardElSetter
        },
        /**
         * The dom object that appears when the third level of strength has been met (max)
         * @property medIndicator
         * @type HTMLElement
         */
        maxIndicator:{
            value:null,
            setter:Y.BaseInputField.staticFunctions.standardElSetter
        },
        /**
         * This is the regular expression that determines if the minimum (first) level of
         * strength has been met.  The default is 8 alpha numeric characters.
         * @property min
         * @type regex
         */
        min:{
            value:_PasswordField.staticVariables.MinimumPassword,
            setter:Y.BaseInputField.staticFunctions.standardRegexSetter
        },
        /**
         * This is the regular expression that determines if the medium (second) level of
         * strength has been met.  The default is 8 alpha numeric characters with letters and symbols.
         * @property med
         * @type regex
         */
        med:{
            value:_PasswordField.staticVariables.MediumPassword,
            setter:Y.BaseInputField.staticFunctions.standardRegexSetter
        },
        /**
         * This is the regular expression that determines if the maximum (third) level of
         * strength has been met.
         * @property max
         * @type regex
         */
        max:{
            value:_PasswordField.staticVariables.StrongPassword,
            setter:Y.BaseInputField.staticFunctions.standardRegexSetter
        }
    };
    _PasswordField.NAME = 'PasswordField';
    Y.extend(_PasswordField,Y.TextBaseField,{
        /**
         * This will return true if the required level of strength has been
         * met by the current input.
         * @method isValid
         * @return {boolean} true if the required level of password strength has been met.
         */
        isValid:function(){
            if (!this.get('isOn')){
                return true;
            }
            else if (this.get('optional') && this.isEmpty()){
                return true;
            }
            var requiredLevel = this.get('requiredLevel'),
            matchedLevel = this.getMatchedLevel();
            return requiredLevel <= matchedLevel;
        },
        /**
         * This will return the level which the input matches
         * @method getMatchedLevel
         * @return {number} the level of password strength that has been reached, 0 if none have.
         */
        getMatchedLevel:function(){
            var value = this.get('inputDOM').value;
            if (this.get('max').test(value)){
                return 3;
            }
            else if (this.get('med').test(value)){
                return 2;
            }
            else if (this.get('min').test(value)){
                return 1;
            }
            else{
                return 0;
            }
        },
        /**
         * This will show the proper indicator based on the strength of the password
         * put in the password field.
         * @method showPasswordIndicator
         */
        showPasswordIndicator:function(){
            var maxIndicator = this.get('maxIndicator'),
            medIndicator = this.get('medIndicator'),
            minIndicator = this.get('minIndicator'),
            level = this.getMatchedLevel();
            if (maxIndicator !== null && maxIndicator !== undefined){
                maxIndicator.style.display = 'none';
            }
            if (medIndicator !== null && medIndicator !== undefined){
                medIndicator.style.display = 'none';
            }
            if (minIndicator !== null && minIndicator !== undefined){
                minIndicator.style.display = 'none';
            }
            if (!this.get('isOn')){
                return; // we don't show password indicator if the password field is off
            }
            else if (this.get('optional') && this.isEmpty()){
                return; // don't display the indicator if this field is optional'
            }

            if ((level == 3) && (maxIndicator !== null && maxIndicator !== undefined)){
                maxIndicator.style.display = '';
            }
            else if ((level == 2) && (medIndicator !== null && medIndicator !== undefined)){
                medIndicator.style.display = '';
            }
            else if ((level == 1) && (minIndicator !== null && minIndicator !== undefined)){
                minIndicator.style.display = '';
            }
        },
        /**
         * This will ensure the proper password indicator is shown, as well
         * as the proper indicators showing if the field is valid or invalid.
         * @method checkIndicators
         * @return {boolean} true if this password field is considered valid.
         */
        checkIndicators:function(){
            var rtVl = _PasswordField.superclass.checkIndicators.call(this);
            this.showPasswordIndicator();
            return rtVl;
        },
        /**
         * Calls the super class' showCorrectIndicator, then ensures the proper
         * password strength indicator is shown.
         * @method showCorrectIndicator
         */
        showCorrectIndicator:function(){
            _PasswordField.superclass.showCorrectIndicator.call(this);
            this.showPasswordIndicator();
        },
        /**
         * Calls the super class' showIncorrectIndicator, then ensures the proper
         * password strength indicator is shown.
         * @method showIncorrectIndicator
         */
        showIncorrectIndicator:function(){
            _PasswordField.superclass.showIncorrectIndicator.call(this);
            this.showPasswordIndicator();
        },
        /**
         * Calls the super class' showNoIndicators, then ensures the proper
         * password strength indicator is shown.
         * @method showNoIndicators
         */
        showNoIndicators:function(){
            _PasswordField.superclass.showNoIndicators.call(this);
            this.showPasswordIndicator();
        }
    });
    Y.PasswordField = _PasswordField;
/**
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * @namespace Validator
     * This field is for matching two inputs on the form.  For instance, this would
     * be useful for having users re-enter passwords, or re-enter e-mail addresses.
     * @class MatchField
     * @extends TextBaseField
     */
    /**
     * @constructor
     * This will initialize the match field with the given JSON configuration
     * @param {Object} config Configuration JSON object.
     */
    function _MatchField(config){
        _MatchField.superclass.constructor.apply(this,arguments);
    }
    _MatchField.ATTRS = {
        /**
         * This is the dom that the match field will compare the input of its' own dom against.
         * @property matchDOM
         * @type HTMLElement
         */
        matchDOM:{
            value:null,
            setter:Y.BaseInputField.staticFunctions.standardElSetter
        },
        /**
         * If set to true, this will do a case sensitive match on the two input DOM's values
         * in order to determine if this field is valid.  True by default
         * @property caseSensitive
         * @type boolean
         */
        caseSensitive:{
            value:true,
            setter:Y.BaseInputField.staticFunctions.BOOLEANSETTER

        }
    };
    _MatchField.NAME = 'MatchField';
    Y.extend(_MatchField,Y.TextBaseField,{
        /**
         * This will return true if the match dom's value matches the input Dom's value.  The comparison
         * will be case sensitive depending on the case sensitive property.  The input is also NOT trimmed
         * so leading or tailing whitespace is included in the comparison.
         * @method isValid
         * @return {boolean} true if the match dom's value matches the input dom's value.
         */
        isValid:function(){
            if (!this.get('isOn')){
                return true;
            }
            else if (this.get('optional') && this.isEmpty()){
                return true;
            }
            var matchDom = this.get('matchDOM'),
            inputDom = this.get('inputDOM');
            if (this.isEmpty()){
                return false;
            }
            if (this.get('caseSensitive')){
                return matchDom.value == inputDom.value;
            }
            else{
                return matchDom.value.toLowerCase() == inputDom.value.toLowerCase();
            }
        }
    });
    Y.MatchField = _MatchField;
/**
     * @requires yahoo.base, yahoo.dom, yahoo.event
     * @namespace Validator
     * This field is for SELET input.  This will ensure that a non-empty value is
     * selected in the field in order for it to be considered valid.
     * @class SelectField
     * @extends TextBaseField
     */
    /**
     * @constructor
     * This will initialize the field with the given configuration json.
     * @param {Object} config Configuration json object.
     */
    function _SelectField(config){
        _SelectField.superclass.constructor.apply(this,arguments);
    }
    _SelectField.ATTRS = {
        /**
         * This will be the value of the option that specifies no selected
         * value.  '' by default.
         * @property emptyValue
         * @type String
         */
        emptyValue:{
            value:'',
            setter:function(val){
                if (val === null || val === undefined){
                    return '';
                }
                else{
                    return val;
                }
            }
        }
    };
    _SelectField.NAME = 'SelectField';
    Y.extend(_SelectField,Y.TextBaseField,{
        /**
         * Returns true if the value in the select input matches the specified empty value
         * @return {boolean} true if the value in the select input matches the specified empty value
         */
        isEmpty:function(){
            var value = this.get('inputDOM').value;
            return value == this.get('emptyValue');
        },
        /**
         * This will set the select field back to its' empty value.
         * @method clear
         * @param {boolean} silent If true, this function will not invoke the on change event listener.
         */
        clear:function(silent){
            this.get('inputDOM').value = this.get('emptyValue');
            if (silent !== true){
                this._evtOnChange();
            }
        },
        /**
         * Returns true if the value selected in the dom doesn't match the value
         * set for the emptyValue property.
         * @return {boolean} false if the value in the select input matches the specified empty value
         */
        isValid:function(){
            if (!this.get('isOn')){
                return true; // is always valid if off
            }
            else if (this.get('optional') && this.isEmpty()){
                return true;
            }
            var value = this.get('inputDOM').value;
            return value != this.get('emptyValue');
        },
        /**
         * This will attach the onchange event to the select DOM
         * @method initializeEvents
         * @param {Object} target Object who will be listening for the select field's change event.
         */
        initializeEvents:function(target){
            var theTarget = target;
            if (theTarget === null || theTarget === undefined){
                theTarget = this;
            }
            Y.Event.attach('change',theTarget._evtOnChange,this.get('inputDOM'),theTarget,true);
        }
    });
    Y.SelectField = _SelectField;


}, 'gallery-2010.06.09-20-45' ,{requires:['node', 'event', 'dom', 'base']});
