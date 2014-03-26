YUI.add('gallery-model-store', function(Y) {

/**
Contains a singleton (ModelStore) that keeps track of managed models

@module model-store
**/

/**
Singleton that keeps track of models via a register method. Registered models
are put into ModelList instances that are maintained by the store. The lists are
keyed by the name of the model and can be retrieved by the getList method. The
store itself is just a global registry for models and does not fire any events.
The lists do all the work and any event handlers should be attached to them.

@class ModelStore
@static
**/
Y.ModelStore = function() {
    return {
        /**
        The unique identifier for this object

        @property _yuid
        @type {String}
        @private
        **/
        _yuid: Y.guid(),


        /**
        The hash of lists maintained by the store

        @property _lists
        @type {Object}
        @default {}
        @protected
        **/
        _lists: {},


        /**
        Finds a model in the store by its id
        TODO:  expand this to search on more than just id

        @method find
        @param {mixed} model A Model instance, a Model constructor
          or a string representation of the Model constructor relative
          to the current scope. ex. 'MyApp.Models.FooModel'
        @param {mixed} The id of the model we are looking for
        @return {Model|null} The found model or null if no model could be found
        **/
        find: function(model, id) {
            var list = this.getList(model, false);

            return list && list.getById(id);
        },


        /**
        Gets a list of models in the store for a given model.  A list
        will be created if one does not already exist.

        @method getList
        @param {mixed} model A Model instance, a Model constructor
          or a string representation of the Model constructor relative
          to the current scope. ex. 'MyApp.Models.FooModel'
        @param {Boolean} create Flag indicating whether we want to create
          a list if one doesnt already exist.  Defaults to true
        @return {ModelList} A modelList of the given model
        **/
        getList: function(model, create) {
            var self = this,
                list;

            create = (create !== false);

            return self._lists[self._getModelName(model)] || (create && self._createList(model));
        },


        /**
        ModelStore[guid]

        @method toString
        @protected
        **/
        toString: function() {
            return 'ModelStore[' + this._yuid + ']';
        },


        /**
        Registers a model with the store

        @method registerModel
        @param {Model} model A Model instance
        @return {Model} The model instance
        **/
        registerModel: function(model) {
            var list = this.getList(model),
                added;

            added = list.add(model);

            return added;
        },


        /**
        Unregisters all models in the store

        @method unregisterAll
        **/
        unregisterAll: function() {
            Y.each(this._lists, function(list) {
                list.destroy();
            });

            this._lists = {};
        },


        /**
        Unregisters a model in the store

        @method unregisterModel
        @param {Model} model The model instance we want to remove
        @return {Model} The model instance
        **/
        unregisterModel: function(model) {
            var list = this.getList(model);

            list.remove(model, {'unregister': true});

            return model;
        },


        /**
        Creates a list for a given model

        @method _createList
        @param {mixed} model A Model instance, a Model constructor
          or a string representation of the Model constructor relative
          to the current scope. ex. 'MyApp.Models.FooModel'
        @return {ModelList} A modelList for the given model
        @private
        **/
        _createList: function(model) {
            var self = this,
                ctor = self._getModelCtor(model),
                list = null;

            if (ctor) {
                list = new Y.ModelList({model: ctor});

                self._lists[ctor.NAME] = list;

                self._initList(list);
            } else {
                Y.log('Couldnt create store list from model ' + model.toString(), 'warn', 'model-store');
            }

            return list;
        },



        /**
        Returns the constructor function of a given model

        NOTE: tried to use Y.cached here but model comes in as
          BuiltClass when passing a model constructor, so it kept
          getting confused.  still want to implement some sort of caching

        @method _getModelCtor
        @param {mixed} model A Model instance, a Model constructor
          or a string representation of the Model constructor relative
          to the current scope. ex. 'MyApp.Models.FooModel'
        @return {Function} The constructor function for the given model,
          or null if the model constructor could not be determined
        @private
        **/
        _getModelCtor: function(model) {
            var ctor = null;

            if (Y.Lang.isString(model)) {
                model = Y.namespace(model);
            }

            if (model instanceof Y.Model) {
                ctor = model.constructor;
            } else if (model.superclass && model.superclass.constructor instanceof Y.Model.constructor) {
                ctor = model;
            }

            return ctor;
        },


        /**
        Determines the name of a model

        @method _getModelName
        @param {mixed} model A Model instance, a Model constructor
          or a string representation of the Model constructor relative
          to the current scope. ex. 'MyApp.Models.FooModel'
        @return {String} The name of the model, or 'unknown' if the model
          name could not be determined
        @private
        **/
        _getModelName: function(model) {
            var ctor = this._getModelCtor(model);

            return ctor ? ctor.NAME : 'unknown';
        },


        /**
        Initializes the store list by adding event handlers and setting a store property

        @method _initList
        @param {ModelList} list The model list we are initializing
        @return {ModelList} The initialized model list
        @private
        @chainable
        **/
        _initList: function(list) {
            var self = this;

            list.store = true;

            list.on('error', function(e) {
                Y.log(self.toString() + ' ' + e.src + ' ' + e.model.toString() + ' ' + e.error, 'error', 'model-store');
            });

            list.on('remove', function(e) {
                // if we arent unregistering or deleting this model from the persistence
                // layer, dont remove it from the store (the default behavior)
                if (!(e.unregister || e['delete'])) {
                    Y.log(self.toString() + ' not removing ' + e.model.toString(), 'info', 'model-store');
                    e.preventDefault();
                } else {
                    Y.log(self.toString() + ' removing ' + e.model.toString(), 'info', 'model-store');
                }
            });

            return list;
        }
    };
}();


}, 'gallery-2012.04.18-20-14' ,{requires:['base', 'model', 'model-list']});
