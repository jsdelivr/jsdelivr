YUI.add('gallery-model-relate', function(Y) {

/**
An extension for model and a set of classes that allow relationships to be
defined between models

@module ModelRelate
**/

/**
Object that represents a relationship between two models

@class ToManyRelationship
**/
var ToManyRelationship = {
    /**
    @property toMany
    @type {String}
    @private
    **/
    type: 'toMany',


    /**
    Initializes the related property of this model

    @method _initRelated
    @private
    **/
    _initRelated: function() {
        var self = this;

        self.related = new self.listType({model: self.relatedModel});

        self._handles.push(self.related.on('remove', self._onRelatedRemove, self));

        self._refreshRelationship();
    },


    /**
    @method _destroyRelated
    @private
    **/
    _destroyRelated: function() {
        this.related.destroy();
    },


    /**
    Clears out any existing related models and adds the given
    models to the relationship.  Models are not checked to see
    if they match the relationship.

    @method _setRelated
    @param {Array} models
    @private
    **/
    _setRelated: function(models) {
        var related = this.related,
            fn = related.isEmpty() ? 'add' : 'reset';

        related[fn](models);
    },


    /**
    Sets attributes on related models. Primarily called after
    a relationship key has changed on a related model from a
    create sync operation.

    @method _setRelatedAttr
    @param {String} name The name of the attribute to set
    @param {Mixed} value The value to set
    @param {Object} options Any options to pass to the attribute set method
    @private
    **/
    _setRelatedAttr: function(name, value, options) {
        this.related.each(function(m) {
            m.set(name, value, options);
        });
    },


    /**
    After a model is added to the related list, check for any models that
    match the relationship and add them to the relationship modelList

    @method _afterStoreAdd
    @param {EventFacade} e
    @private
    **/
    _afterStoreAdd: function(e) {
        var self = this,
            model = e.model;

        if (self._checkRelationship(model)) {
            self.related.add(model, e);
            self.fire('add', e);
        }
    },


    /**
    After a model is removed from the store, remove it from the
    relationship if it exists

    @method _afterStoreRemove
    @param {EventFacade} e
    @private
    **/
    _afterStoreRemove: function(e) {
        var self = this,
            model = e.model;

        if (self.related.indexOf(model) !== -1) {
            self.related.remove(model, e);
            self.fire('remove',  e);
        }
    },


    /**
    After a related key has changed on a model in the store,
    we need to determine whether or not it still belongs in
    the list of related models

    @method _afterRelatedKeyChange
    @param {EventFacade} e
    @protected
    @private
    **/
    _afterRelatedKeyChange: function(e) {
        e.model = e.target;

        if (e.src === 'create') {
            // if the key changed as the result of a create, dont
            // do anything
            return;
        } else if (this.related.indexOf(e.model) !== -1) {
            // if the changed model is already in the list
            // we need to remove it
            e.unregister = true;
            this._afterStoreRemove(e);
        } else {
            // otherwise hand off to the add handler to see
            // if the new key matches the relationship
            this._afterStoreAdd(e);
        }
    },


    /**
    If the model is not being deleted, we want to persist the destroyed state in our
    relationship, so prevent the default remove fn from executing

    @method _onRelatedRemove
    @param {EventFacade} e
    @private
    **/
    _onRelatedRemove: function(e) {
        // if we arent unregistering or deleting this model from the persistence
        // layer, dont remove it from the store (the default behavior)
        if (e.unregister || e['delete']) {
        } else {
            e.preventDefault();
        }
    }
};
/**
An extension for model and a set of classes that allow relationships to be
defined between models

@module ModelRelate
**/

/**
Object that represents a relationship between two models

@class ToOneRelationship
**/
var ToOneRelationship = {
    type: 'toOne',


    /**
    Initializes the related property of this model

    @method _initRelated
    @private
    **/
    _initRelated: function() {
        this._refreshRelationship();
    },


    /**
    Clears out any existing related models and adds the given
    models to the relationship.  Models are not checked to see
    if they match the relationship.

    @method _setRelated
    @param {Array} models
    @private
    **/
    _setRelated: function(models) {
        var self = this,
            m;

        models = Y.Array(models);

        m = models[0] || null;

        if (self.related) {
            this.fire('remove', {model: self.related});
        }


        self.related = m;

        if (self.related) {
            this.fire('add', {model: self.related});
        }
    },


    /**
    Sets attributes on related models. Primarily called after
    a relationship key has changed on a related model from a
    create sync operation.

    @method _setRelatedAttr
    @param {String} name The name of the attribute to set
    @param {Mixed} value The value to set
    @param {Object} options Any options to pass to the attribute set method
    @private
    **/
    _setRelatedAttr: function(name, value, options) {
        this.related && this.related.set(name, value, options);
    },


    /**
    After a model is added to the related list, check for any models that
    match the relationship and add them to the relationship modelList

    @method _afterStoreAdd
    @param {EventFacade} e
    @private
    **/
    _afterStoreAdd: function(e) {
        var self = this,
            model = e.model;

        if (!self.related && self._checkRelationship(model)) {
            self._setRelated(model);
        }
    },


    /**
    After a model is removed from the store, remove it from the
    relationship if it exists

    @method _afterStoreRemove
    @param {EventFacade} e
    @private
    **/
    _afterStoreRemove: function(e) {
        var self = this,
            m = e.model;

        if (m === self.related) {
            self._refreshRelationship();
        }
    },


    /**
    After a related key has changed on a model in the store,
    we need to determine whether or not it still belongs in
    the list of related models

    @method _afterRelatedKeyChange
    @param {EventFacade} e
    @protected
    @private
    **/
    _afterRelatedKeyChange: function(e) {
        e.model = e.target;

        if (e.src === 'create') {
            // if the key changed as the result of a create, dont
            // do anything
            return;
        } else if (this.related === e.model) {
            // if the changed model is already in the list
            // we need to remove it
            e.unregister = true;
            this._afterStoreRemove(e);
        } else {
            // otherwise hand off to the add handler to see
            // if the new key matches the relationship
            this._afterStoreAdd(e);
        }
    }
};
/**
An extension for model and a set of classes that allow relationships to be
defined between models

@module ModelRelate
**/
var store = Y.ModelStore;


/**
Object that manages a relationship between two or more models

@class ModelRelationship
@constructor
@uses EventTarget
@param {Object} config Configuration object
**/
function ModelRelationshp(config) {
    var self = this;

    if (!store) {
        Y.error('Cannot create relationship. ModelStore not found.');
    }

    Y.stamp(this);

    self.name = config.name;
    self.model = config.model;
	self.key = config.key || config.model.idAttribute || 'id';
	self.relatedModel = store._getModelCtor(config.relatedModel);
	self.relatedKey = config.relatedKey || self.key;

    if (config.type === 'toMany') {
        self.listType = config.listType || Y.ModelList;
        Y.mix(self, ToManyRelationship, true);
    } else if (config.type === 'toOne') {
        Y.mix(self, ToOneRelationship, true);
    } else {
        Y.error('Cannot create relationship. ' + config.type + ' is not a valid relationship type.');
    }

    self.init();
}


/**
@property toOne
@type {String}
@static
**/
ModelRelationshp.toOne = 'toOne';


/**
@property toMany
@type {String}
@static
**/
ModelRelationshp.toMany = 'toMany';



ModelRelationshp.prototype = {
    /**
    The type of the relationship. Either toOne or toMany

    @property type
    @type String
    **/
    type: null,


    /**
    The related model(s).  A single model for a toOne relationship
    or a modelList for a toMany relationship

    @property related
    @type Mixed
    **/
    related: null,


    /**
    Initializer

    @method init
    @param {Object} config Configuration object
    **/
    init: function(config) {
        var self = this;


        self._handles = [];
        self._storeList = store.getList(self.relatedModel);

        self._initRelated();
        self._initEvents();
    },


    /**
    Destructor

    @method destroy
    **/
    destroy: function() {

        this._detachEvents();

        this._storeList = null;

        this._destroyRelated();

        this._related = null;
    },


    /**
    {model.toString} {type} relationship {name} [guid]

    @method toString
    @protected
    **/
    toString: function() {
        var self = this;

        return self.model.toString() + ' ' + self.type + ' relationship ' + self.name + '[' + Y.stamp(this, true) + ']';
    },


    /**
    Returns true if a model matches the primary/related key relationship

    @method _checkRelationship
    @param {Model} model The model to check
    @return {Boolean} true if the model matches the relationship, false if not
    @protected
    **/
    _checkRelationship: function(model) {
        return model.get(this.relatedKey) == this.model.get(this.key);
    },


    /**
    Destroy a related list.  not the models.
    poorly named.  need to fix that.

    @method _destroyRelated
    @protected
    **/
    _destroyRelated: function() {},


    /**
    Detach events from this relationship.

    @method _detachEvents
    @private
    **/
    _detachEvents: function() {
        Y.each(this._handles, function(handle) {
            handle.detach();
        });

        this._handles = [];
    },


    /**
    Returns an array of models that match the primary/related key relationship

    @method _findRelated
    @protected
    **/
    _findRelated: function(models) {
        var self = this;

        return Y.Array.filter(self._storeList._items, self._checkRelationship, self);
    },


    /**
    Initializes any events for this relationship

    @method _initEvents
    @protected
    **/
    _initEvents: function() {
        var self = this,
            h = self._handles,
            cfg = {
                bubbles: true,
                emitFacade: true,
                prefix: 'modelRelationship',
                preventable: false
            };

        /**
        Fired when a model has been added to this relationship

        @event add
        @param {EventFacade} e Event object with a model property
        which refers to the model that was added to the relationship
        **/
        this.publish('add', cfg);

        /**
        Fired when a model has been removed from this relationship

        @event remove
        @param {EventFacade} e Event object with a model property
        which refers to the model that was removed from the relationship
        **/
        this.publish('remove', cfg);

        // if the key on the src changes
        h.push(self.model.on(self.key + 'Change', self._onKeyChange, self));

        // if the key on the src changes, we might need to refresh our relationship
        h.push(self.model.after(self.key + 'Change', self._afterKeyChange, self));

        // after the relatedKey is changed on a related model, remove it from the relationship
        h.push(self._storeList.after('*:' + self.relatedKey + 'Change', self._afterRelatedKeyChange, self));

        h.push(self._storeList.on('error', function(e) {
        }));

        // after a related model is added
        h.push(self._storeList.after('add', self._afterStoreAdd, self));

        // after a related model is removed
        h.push(self._storeList.after('remove', self._afterStoreRemove, self));
    },


    /**
    Initializes the related property of this model

    @method _initRelated
    @protected
    **/
    _initRelated: function() {},


    /**
    Clears out the related models and refreshes the related models
    from the store

    @method _refreshRelationship
    @private
    **/
    _refreshRelationship: function(e) {
        this._setRelated(this._findRelated());
    },


    /**
    Clears out any existing related models and adds the given
    models to the relationship.  Models are not checked to see
    if they match the relationship.

    @method _setRelated
    @param {Array} models
    @protected
    **/
    _setRelated: function(models) {},


    /**
    Sets attributes on related models. Primarily called after
    a relationship key has changed on a related model from a
    create sync operation.

    @method _setRelatedAttr
    @param {String} name The name of the attribute to set
    @param {Mixed} value The value to set
    @param {Object} options Any options to pass to the attribute set method
    @protected
    **/
    _setRelatedAttr: function(name, value, options) {},


    /**
    If a key has changed on this model as the result of a sync 'create',
    we need to update any related models with the new key. If the key
    change was not a result of a 'create', refresh the relationship to
    see if there are any models that match the new key

    @method _afterKeyChange
    @param {EventFacade} e
    @private
    **/
    _afterKeyChange: function(e) {
        if (e.src === 'create') {
            // if the src = create we changed the id of this model
            // in response to a save, silently update any related
            // models to the new key

            this._setRelatedAttr(e.attrName, e.newVal, {src: 'create', silent: true});
        } else {
            this._refreshRelationship();
        }
    },


    /**
    After a model is added to the related list, check for any models that
    match the relationship and add them to the relationship modelList

    @method _afterStoreAdd
    @param {EventFacade} e
    @protected
    **/
    _afterStoreAdd: function(e) {},


    /**
    After a model is removed from the store, remove it from the
    relationship if it exists

    @method _afterStoreRemove
    @param {EventFacade} e
    @protected
    **/
    _afterStoreRemove: function(e) {},


    /**
    After a related key has changed on a model in the store,
    we need to determine whether or not it still belongs in
    the list of related models

    @method _afterRelatedKeyChange
    @param {EventFacade} e
    @protected
    **/
    _afterRelatedKeyChange: function(e) {},


    /**
    Check the state of the model to determine if the key changed as a result
    of a sync 'create'.  If so set the src property of the eventFacade so we
    can propagate that this came from a 'create'.

    @method _onKeyChange
    @param {EventFacade} e
    @private
    **/
    _onKeyChange: function(e) {
        var m = e.target;

        // if this relationship is keyed off the id of model and
        // we changed the id of this model in response to a save,
        // set the src of the event facade to tell the after handler
        if (e.attrName === m.idAttribute && m.isNew()) {
            e.src = 'create';
        }
    }
};

Y.ModelRelationship = Y.augment(ModelRelationshp, Y.EventTarget);
/**
An extension for model and a set of classes that allow relationships to be
defined between models

@module ModelRelate
**/
var RELS = 'relationships',
    REL_PREFIX = '_rel_';


/**
Model extension for defining relationships between models

@class ModelRelate
@example
    Y.Base.create('parentModel', Y.Model, [Y.ModelRelate], {
        // prototype methods
    }, {
        ATTRS: {
            // model attributes
        },
        RELATIONSHIPS: {
            'children': {
                type: 'toMany',
                key: 'id'
                relatedModel: 'childModel',
                relatedKey: 'parentId'
            }
        }
    });
**/
function ModelRelate() {}


ModelRelate.ATTRS = {
    /**
    Overrides default model behavior.
    For models that dont have an explicit id set, use the
    clientId

    @attribute id
    @default clientId
    **/
    id: {
        valueFn : function() {
            return this.get('clientId');
        }
    },


    /**
    Whether relationship attributes should be included
    in the output from getAttrs

    @attribute outputRelationships
    @type {Boolean}
    **/
    outputRelationships: {
        value: false
    }
};


/**
Default set of relationships for this object.  Defined just like the
ATTRS property.  ie. an object literal of relationship configs.  See
the <a href="#method_addRelationship">addRelationship</a> method for the
list of configuration properties

@property RELATIONSHIPS
@static
@type {Object}
@example
    RELATIONSHIPS: {
        Employees: {
            type: 'toMany',
            key: 'id',
            relatedModel: 'EmployeeModel',
            relatedKey: 'companyId'
        },
        Customers: {
            type: 'toMany',
            key: 'id',
            relatedModel: 'CustomerModel',
            relatedKey: 'companyId'
        }
    }
**/


ModelRelate.prototype = {
    /**
    Whether this model is registered with the model store

    @type {Boolean}
    @property registered
    **/
    _registered: false,


    /**
    initializer lifecycle method

    @method initializer
    @protected
    **/
    initializer: function(config) {
        var self = this,
            relationships = self._aggregateRelationships();


        config = config || {};

        self._modelRelateHandles = [
            // AOP method for checking to see if we need to unregister the model if its
            // being deleted from the sync layer
            Y.Do.before(self._doBeforeDestroy, self, 'destroy', self),

            // AOP method for removing relationship attributes from getAttrs return value
            Y.Do.after(self._doAfterGetAttrs, self, 'getAttrs', self)
        ];

        // init the relationships
        Y.each(relationships, function(rels) {
            Y.each(rels, self._addRelationshipAttr, self);
        });

        // after we're done initializing, register this model
        self.after('initializedChange', function(e) {
            if (config.register !== false) {
                self.register();
            }
        });
    },


    /**
    destructor lifecycle method

    @method destructor
    @protected
    **/
    destructor: function() {
        var handles = this._modelRelateHandles;

        Y.each(handles, function(handle) {
            handle.detach();
        });

        this._modelRelateHandles = null;

        this._destroyRelationships();
    },


    /**
    Adds a relationship with the given config to this model.

    @method addRelationship
    @param {String} name A name for the relationship
    @param {Object} config Object literal of configuration properties
      @param {String} config.type The type of relationship; toOne or toMany
      @param {String} [config.key] The key on this model to use for the relationship
      @param {String|Function} config.relatedModel The related model type
      @param {String} [config.relatedKey] The key on the related model to use for
        the relationship
      @param {String|Function} [config.listType=ModelList] A custom modelList to use
        for the relationship (toMany relationships only)
    **/
    addRelationship: function(name, config) {
        this._addRelationshipAttr(config, name);

        return this;
    },


    /**
    Gets related models from a relationship

    @method getRelated
    @param {String} name The name of the relationship
    @return {Model|ModelList|null} Models related to this model.
      For toMany relationships this will always be a model-list.
      For toOne relationships, this will be a model instance or
      null if no model matches the relationship.
    **/
    getRelated: function(name) {
        var rel = this.getRelationship(name);

        return rel && rel.related;
    },


    /**
    Gets a relationship by name

    @method getRelationship
    @param {String} name The name of the relationship
    @return {ModelRelationship|null} The relationship of the given name
    **/
    getRelationship: function(name) {
        return this.get(this._relName(name));
    },


    /**
    Overrides the default model implementation.  Newness
    is determined if the models id attribute is the same
    as the clientId attribute

    @method isNew
    @return {Boolean}
    **/
    isNew: function() {
        return this.get('clientId') === this.get('id');
    },


    /**
    Is this model registered with the store

    @method isRegistered
    @return {Boolean}
    **/
    isRegistered: function() {
        return this._registered;
    },


    /**
    Registers this model with the model store
    TODO:  should we have register and unregister events?

    @method register
    @chainable
    **/
    register: function() {
        if (!store) {
        } else if (this.isRegistered()) {
        } else {
            this._registered = (store.registerModel(this) === this);
        }

        return this;
    },


    /**
    Removes a relationship

    @method removeRelationship
    @param {String} name The name of the relationship
    @chainable
    **/
    removeRelationship: function(name) {
        var self = this,
            rel = self.getRelationship(name),
            relName = self._relName(name);

        if (rel) {
            rel.destroy();
        }

        self.removeAttr(relName);
        self._state.remove(relName, RELS);

        return self;
    },


    /**
    {name} [id:guid]

    @method toString
    @protected
    **/
    toString: function() {
        return this.name + '[' + this.get('id') + ':' + Y.stamp(this, true) + ']';
    },


    /**
    Unregisters this model from the model store
    and destroys all its relationships

    @method unregister
    @chainable
    **/
    unregister: function() {
        if (!store) {
        } else if (!this.isRegistered()) {
        } else {
            this._registered = (store.unregisterModel(this) === this);
        }

        this._destroyRelationships();

        return this;
    },


    /**
    Creates an attribute on this object from a relationship config
    literal.  The resulting attribute will be readOnly and lazyLoaded

    @method _addRelationshipAttr
    @param {Object} config Object literal of configuration properties
    @param {String} name A name for the relationship
    @private
    **/
    _addRelationshipAttr: function(config, name) {
        var self = this,
            relName = self._relName(name),
            attrCfg = {};

        attrCfg.readOnly = true;

        // lazyAdd in the config object takes precedence
        attrCfg.lazyAdd = true;

        // by using a setter we can transform the attribute value
        // from a config object to a Model.Relationship instance
        // during the attribute initilization phase therefore not
        // firing any attribute change events.
        attrCfg.setter = function(cfg) {
            return new Y.ModelRelationship(cfg);
        };

        // initially the value is a configuration object literal
        // but when the attribute is initialized, the setter will
        // be executed and the value after initilization will be
        // a Model.Relationship instance.
        attrCfg.value = Y.merge(config, {name: name, model: this});

        // add the relationship as an attribute
        self.addAttr(relName, attrCfg, true);

        // addAttr returns 'this' so we have to check state[ADDED]
        // to see if the attribute added successfully or not
        if (self._state.get(relName, 'added')) {
            // attribute added successfully, add a state entry
            // for this relationship
            self._state.add(relName, RELS, name);
        }
    },


    /**
    Aggregates relationships from the class heirarchy

    @method _aggregateRelationships
    @return {Array} Array of relationship configs
    @private
    **/
    _aggregateRelationships: function() {
        var c = this.constructor,
            relationships = [];

        while (c) {
            // Add to relationships
            if (c.RELATIONSHIPS) {
                relationships[relationships.length] = c.RELATIONSHIPS;
            }

            c = c.superclass ? c.superclass.constructor : null;
        }

        return relationships;
    },


    /**
    AOP method fired after getAttrs that removes
    relationships from the list of attributes returned

    @method _doAfterGetAttrs
    @protected
    **/
    _doAfterGetAttrs: function() {
        var state = this._state,
            retVal = Y.Do.currentRetVal;

        if (!this.get('outputRelationships')) {
            Y.each(retVal, function(val, key, o) {
                if (state.get(key, RELS)) {
                    delete o[key];
                }
            });
        }

        delete retVal.outputRelationships;

        return new Y.Do.AlterReturn('removed relationship meta from getAttrs return', retVal);
    },


    /**
    AOP method fired before destroy that configures relationships
    to be destroyed if the model is being deleted

    @method _doBeforeDestroy
    @protected
    **/
    _doBeforeDestroy: function(options, callback) {
        var newCb;


        // Allow callback as only arg.
        if (typeof options === 'function') {
            callback = options;
            options  = {};
        }

        if (options && (options.unregister || options['delete'])) {
            this.deleted = true;

            // we are unregistering or deleting this model permanently.
            // need to build a callback function to do the cleanup
            newCb = Y.bind(function(err) {
                if (err) {
                    this.deleted = false;
                } else {
                    // we deleted this model, destroy all its relationships
                    this._destroyRelationships();
                }

                // call the original callback
                callback && callback.apply(null, arguments);
            }, this);

            // alter the arguments to the original destroy method to pass our new callback
            return new Y.Do.AlterArgs(this.toString() + ' deleted, modifying callback to destroy model relationships', [options, newCb]);
        }
    },


    /**
    Destroys all relationships on this model

    @method _destroyRelationships
    @private
    **/
    _destroyRelationships: function() {
        var state = this._state.data;
        
        // check each object in the state data for a 
        // relationship property.  if it has one, remove
        // that relationship
        Y.each(state, function(o, n) {
            var relName = o[RELS];
            
            if (relName) {
                this.removeRelationship(relName);
            }

        }, this);
    },


    /**
    Returns the internal relationship name

    @method _relName
    @param {String} name The user provided relationship name
    @return {String} The internal relationship name
    @private
    **/
    _relName: function(name) {
        return REL_PREFIX + name;
    }
};

Y.ModelRelate = ModelRelate;


}, 'gallery-2012.04.18-20-14' ,{requires:['base', 'event-custom', 'array-extras', 'model-list', 'gallery-model-store']});
