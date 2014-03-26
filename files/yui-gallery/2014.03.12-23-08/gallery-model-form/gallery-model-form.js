YUI.add('gallery-model-form', function (Y, NAME) {

/* global YUI */
/**
Binds a Y.Model instance to any form you pass in. Allows the developer
to utilize model change events and upon a save/submit, they can send the
form data as is, or fetch the Model data and do something else with it.

@module gallery-model-form
**/

/**
The Model Form class

@class ModelForm
@extends Widget
**/
Y.ModelForm = Y.Base.create('model-form', Y.Widget, [], {
    /**
    A mapping of the node/element names and types to callback
    methods to setup the event listeners

    @property fieldMap
    @type {Object}
    **/
    fieldMap: {
        'INPUT': {
            'text':'_handleTextInput',
            'checkbox':'_handleCheckboxInput',
            'radio':'_handleRadioInput'
        },
        'SELECT': {
            'select-one':'_handleSelectInput'
        },
        'TEXTAREA': {
            'textarea':'_handleTextInput'
        },
        'BUTTON': {
            'button':'_handleButtonInput'
        }
    },

    /**
    Initializer lifecycle method

    @method initializer
    @param {Object} cfg
    @protected
    **/
    initializer: function(cfg) {
        this._fields = [];
        this._eventHandles = [];
        this._formValues = {};

        if (cfg.values) { this._formValues = cfg.values; }

        this.set('model', new Y.Model());
        this._eventHandles.push(this.get('model').on('change', this._handleModelChange, this));
    },

    /**
    Destructor lifecycle method

    @method destructor
    @protected
    **/
    destructor: function() {
        (new Y.EventHandle(this._eventHandles)).detach();
        if (this.form) {
            this.form.destroy();
        }
    },
    
    /**
    Render lifecycle method.

    @method renderUI
    @protected
    **/
    renderUI: function() {
        if (this.get('markup')) {
            this.get('contentBox').setHTML(Y.Node.create(this.get('markup')));
        }
        this.form = this.get('boundingBox').one('form');
        this._parseFields();
    },

    /**
    Get the field node for the specified name

    @method getField
    @param {String} [name] the field name
    @return {HTMLInputElement} the field node
    **/
    getField: function(name) {
         return this._fields[name];
    },

    /**
    Return the form instance

    @method getForm
    @return {HTMLFormElement} the form node
    **/
    getForm: function() {
        return this.form;
    },

    /**
    Reset the form, either to the defaults passed in, or
    by setting clear to true, empty all of the form values.

    @method reset
    @param {Boolean} [clear] set to true to empty all form values
    **/
    reset: function(clear) {
        this.get('model').reset();
        if (!clear) {
            if (!Y.Object.isEmpty(this._formValues)) {
                this.get('model').setAttrs(this._formValues);
            }
        }
    },

    /**
    Some model data has been updated, update the form with the new
    values, as long as the source of the event is not the form itself

    @method _handleModelChange
    @param {EventFacade} [e] model change event
    @protected
    **/
    _handleModelChange: function(e) {
        if (e.src === 'form') { return; }

        Y.Object.each(e.changed, function(obj, key) {
            var field = this.getField(key);
            if (!Y.Lang.isUndefined(field)) {
                if (field.get('type') === 'checkbox') {
                    field.set('checked', obj.newVal);
                } else if (field.get('type') === 'radio') {
                    Y.all('input[name=' + key + ']').each(function (field) {
                        if (field.get('value') === obj.newVal) {
                            field.set('checked', true);
                        }
                    }, this);
                } else {
                    field.set('value', obj.newVal);
                }
            }

        }, this);
    },

    /**
    Parse out all of the form elements and make sure we attach an event
    listener that's appropriate for that element type. Also set the model
    attributes to the <code>values</code> we've passed in (if applicable).

    @method _parseFields
    @protected
    **/
    _parseFields: function() {
        var allFields = this.get('boundingBox').one('form').all('*'),
            model = this.get('model');

        allFields.each(function (node) {
            var nodeName = node.get('nodeName'),
                nodeType = node.get('type'),
                fieldName = node.get('name'),
                callback;
        
            if (Y.Object.hasKey(this.fieldMap, nodeName) && Y.Object.hasKey(this.fieldMap[nodeName], nodeType)) {
                callback = this.fieldMap[nodeName][nodeType];
                this[callback](node, fieldName);
                this._fields[fieldName] = node;
            }
        }, this);

        Y.Object.each(this._fields, function(field, fieldName) {
            if (!model.get(fieldName)) {
                model.set(fieldName, '', {silent: true});
            }
        });

        /* Do we have form values passed in? */
        if (!Y.Object.isEmpty(this._formValues)) {
            model.setAttrs(this._formValues);
        }
    },

    /**
    The callback to handle text input events triggered by the end user

    @method _handleTextInput
    @param {HTMLInputElement} [node] the field node to work with
    @param {String} [fieldName] the name of the field
    @protected
    **/
    _handleTextInput: function(node, fieldName) {
        var model = this.get('model');

        this._eventHandles.push(
            node.after('keyup', function(e) {
                model.set(fieldName, e.target.get('value'), {src:'form'});
            })
        );

        if (node.get('value') !== '') {
            this._formValues[fieldName] = node.get('value');
        }
    },

    /**
    The callback to handle checkbox events triggered by the end user

    @method _handleCheckboxInput
    @param {HTMLInputElement} [node] the field node to work with
    @param {String} [fieldName] the name of the field
    @protected
    **/
    _handleCheckboxInput: function(node, fieldName) {
        var model = this.get('model');

        this._eventHandles.push(
            node.after('click', function(e) {
                model.set(fieldName, e.target.get('checked'), {src:'form'});
            }, this)
        );

        if (node.get('checked')) {
            this._formValues[fieldName] = node.get('checked');
        }
    },

    /**
    The callback to handle radio button events triggered by the end user

    @method _handleRadioInput
    @param {HTMLInputElement} [node] the field node to work with
    @param {String} [fieldName] the name of the field
    @protected
    **/
    _handleRadioInput: function(node, fieldName) {
        var model = this.get('model');

        this._eventHandles.push(
            node.on('change', function(e) {
                model.set(fieldName, e.target.get('value'), {src:'form'});
            }, this)
        );

        if (node.get('checked')) {
            this._formValues[fieldName] = node.get('value');
        }
    },

    /**
    The callback to handle form select events triggered by the end user

    @method _handleSelectInput
    @param {HTMLInputElement} [node] the field node to work with
    @param {String} [fieldName] the name of the field
    @protected
    **/
    _handleSelectInput: function(node, fieldName) {
        var model = this.get('model');

        this._eventHandles.push(
            node.after('change', function(e) {
                model.set(fieldName, e.target.get('value'), {src:'form'});
            }, this)
        );

        node.get('options').each(function(option) {
            /* A YUI3 Node sets the first option to 'selected' if you do not specify otherwise */
            if (option.get('selected') && !this._formValues[fieldName]) {
                this._formValues[fieldName] = option.get('value');
            }
        }, this);
    },

    /**
    The callback to handle button events triggered by the end user

    @method _handleButtonInput
    @param {HTMLInputElement} [node] the field node to work with
    @param {String} [fieldName] the name of the field
    @protected
    **/
    _handleButtonInput: function(node, fieldName) {
        var model = this.get('model');

        this._eventHandles.push(
            node.on('click', function(e) {
                model.set(fieldName, e.target.get('value'), {src:'form'});
            })
        );

        if (node.get('value') !== '') {
            this._formValues[fieldName] = node.get('value');
        }
    }
},
{
    ATTRS: {
        /**
        The required form markup

        @attribute markup
        @type {String}
        @default ''
        **/
        markup: {
            value: ''
        },

        /**
        Will contain the <code>Y.Model</code> instance that we'll bind to the form elements

        @attribute model
        @type {Y.Model}
        @default null
        **/
        model: {
            value: null
        }
    }
});


}, 'gallery-2013.11.14-01-08', {"requires": ["yui-base", "node", "event", "model", "widget"]});
