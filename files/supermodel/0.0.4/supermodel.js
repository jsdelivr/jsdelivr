(function(Backbone){

  // The global object.
  var root = this;

  // Expose Supermodel to the global object.
  var Supermodel = root.Supermodel = {};

  // Current version.
  Supermodel.VERSION = '0.0.4';

  // Local reference to Collection.
  var Collection = Backbone.Collection;

  // Use Backbone's `extend` for sugar.
  var extend = Backbone.Model.extend;

  // # Association
  //
  // Track associations between models.  Associated attributes are used and
  // then removed during `parse`.
  var Association = function(model, options) {
    this.required(options, 'name');
    _.extend(this, _.pick(options, 'name', 'where', 'source', 'store'));
    _.defaults(this, {
      source: this.name,
      store: '_' + this.name
    });

    // Store a reference to this association by name after ensuring it's
    // unique.
    var ctor = model;
    do {
      if (!ctor.associations()[this.name]) continue;
      throw new Error('Association already exists: ' + this.name);
    } while (ctor = ctor.parent);
    model.associations()[this.name] = this;

    // Listen for relevant events.
    if (this.initialize) model.all().on('initialize', this.initialize, this);
    if (this.change) model.all().on('change', this.change, this);
    if (this.parse) model.all().on('parse', this.parse, this);
    if (this.destroy) model.all().on('destroy', this.destroy, this);
    if (this.create) model.all().on('add', this.create, this);
  };

  Association.extend = extend;

  _.extend(Association.prototype, {

    // Notify `model` of its association with `other` using the `inverse`
    // option.
    associate: function(model, other) {
      if (!this.inverse) return;
      model.trigger('associate:' + this.inverse, model, other);
    },

    // Notify `model` of its dissociation with `other` using the `inverse`
    // option.
    dissociate: function(model, other) {
      if (!this.inverse) return;
      model.trigger('dissociate:' + this.inverse, model, other);
    },

    // Throw if the specified options are not provided.
    required: function(options) {
      var option;
      for (var i = 1; i < arguments.length; i++) {
        if (options[option = arguments[i]]) continue;
        throw new Error('Option required: ' + option);
      }
    },

    // Wrap a function in order to capture it's context, prepend it to the
    // arguments and call it with the current context.
    andThis: function(func) {
      var context = this;
      return function() {
        return func.apply(context, [this].concat(_.toArray(arguments)));
      };
    }

  });

  // ## One
  //
  // One side of a one-to-one or one-to-many association.
  var One = Association.extend({

    constructor: function(model, options) {
      this.required(options, 'inverse', 'model');
      Association.apply(this, arguments);
      _.extend(this, _.pick(options, 'inverse', 'model'));
      _.defaults(this, {
        id: this.name + '_id'
      });
      model.all()
        .on('associate:' + this.name, this.replace, this)
        .on('dissociate:' + this.name, this.remove, this);
    },

    // Assign the getter/setter when a model is created.
    create: function(model) {
      model[this.name] = _.bind(this.access, this, model);
    },

    // Return or replace the associated model.
    access: function(model, other) {
      if (arguments.length < 2) return model[this.store];
      this.replace(model, other);
    },

    // Parse the models attributes.  If `source` isn't found use the `id`
    // attribute.
    initialize: function(model) {
      this.parse(model, model.attributes);
      var id = model.get(this.id);
      if (id != null) this.replace(model, id);
    },

    // If `source` is provided, use it to initialize the association after
    // removing it from the response object.
    parse: function(model, resp) {
      if (!_.has(resp, this.source)) return;
      var attrs = resp[this.source];
      delete resp[this.source];
      this.replace(model, attrs);
    },

    // Update the association when the `id` attribute changes.
    change: function(model) {
      if (!model.hasChanged(this.id)) return;
      this.replace(model, model.get(this.id));
    },

    // Remove the current association.
    remove: function(model) {
      this.replace(model, null);
    },

    // When a model is destroyed, its association should be removed.
    destroy: function(model) {
      var other = model[this.store];
      if (!other) return;
      this.remove(model);
      this.dissociate(other, model);
    },

    // Replace the current association with `other`, taking care to remove the
    // current association first.
    replace: function(model, other) {
      var id, current;

      if (!model) return;
      current = model[this.store];

      // If `other` is a primitive, assume it's an id.
      if (other != null && !_.isObject(other)) {
        id = other;
        (other = {})[this.model.prototype.idAttribute] = id;
      }

      // Is `other` already the current model?
      if (other && !(other instanceof Model)) other = this.model.create(other);
      if (current === other) return;

      // Tear down the current association.
      if (!other) model.unset(this.id);
      if (current) {
        delete model[this.store];
        this.dissociate(current, model);
      }

      if (!other) return;

      // Set up the new association.
      model.set(this.id, other.id);
      model[this.store] = other;
      this.associate(other, model);
    }

  });

  // # ManyToOne
  // The many side of a one-to-many association.
  var ManyToOne = Association.extend({

    constructor: function(model, options) {
      this.required(options, 'inverse', 'collection');
      Association.apply(this, arguments);
      _.extend(this, _.pick(options, 'collection', 'inverse'));
      model.all()
        .on('associate:' + this.name, this._associate, this)
        .on('dissociate:' + this.name, this._dissociate, this);
    },

    // When a model is created, instantiate the associated collection and
    // assign it using `store`.
    create: function(model) {
      if (!model[this.name]) model[this.name] = _.bind(this.get, this, model);
    },

    // Return the associated collection.
    get: function(model) {
      var collection = model[this.store];
      if (collection) return collection;

      // Create the collection for storing the associated models.  Listen for
      // "add", "remove", and "reset" events and act accordingly.
      collection = model[this.store] = new this.collection()
      .on('add', this.add, this)
      .on('remove', this.remove, this)
      .on('reset', this.reset, this);

      // We'll need to know what model "owns" this collection in order to
      // handle events that it triggers.
      collection.owner = model;

      return collection;
    },

    // Use the `source` property to reset the collection with the given models
    // after removing it from the response object.
    parse: function(model, resp) {
      var attrs = resp[this.source];
      if (!attrs) return;
      delete resp[this.source];
      var collection = this.get(model);
      attrs = collection.parse(attrs);

      // If `where` is not specified, reset the collection and bail.
      if (!this.where) {
        collection.reset(attrs);
        return;
      }

      // Reset the collection after filtering the models from `attrs`.
      collection.reset(_.filter(_.map(attrs, function(attrs) {
        return new collection.model(attrs);
      }), this.where));
    },

    // Parse the attributes to initialize a new model.
    initialize: function(model) {
      this.parse(model, model.attributes);
    },

    // Models added to the collection should be associated with the owner.
    add: function(model, collection) {
      if (!model || !collection) return;
      this.associate(model, collection.owner);
    },

    // Models removed from the collection should be dissociated from the owner.
    remove: function(model, collection) {
      if (!model || !collection) return;
      this.dissociate(model, collection.owner);
    },

    // After a reset, all new models should be associated with the owner.
    reset: function(collection) {
      if (!collection) return;
      collection.each(function(model) {
        this.associate(model, collection.owner);
      }, this);
    },

    // If the owner is destroyed, all models in the collection should be
    // dissociated from it.
    destroy: function(model) {
      var collection;
      if (!model || !(collection = model[this.store])) return;
      collection.each(function(other) {
        this.dissociate(other, model);
      }, this);
    },

    // Associated models should be added to the collection.
    _associate: function(model, other) {
      if (!model || !other) return;
      if (this.where && !this.where(other)) return;
      this.get(model).add(other);
    },

    // Dissociated models should be removed from the collection.
    _dissociate: function(model, other) {
      if (!model || !other || !model[this.store]) return;
      model[this.store].remove(other);
    }

  });

  // # ManyToMany
  //
  // One side of a many-to-many association.
  var ManyToMany = Association.extend({

    constructor: function(model, options) {
      this.required(options, 'collection', 'through', 'source');
      Association.apply(this, arguments);
      _.extend(this, _.pick(options, 'collection', 'through'));
      this._associate = this.andThis(this._associate);
      this._dissociate = this.andThis(this._dissociate);
    },

    // When a new model is created, assign the getter.
    create: function(model) {
      if (!model[this.name]) model[this.name] = _.bind(this.get, this, model);
    },

    // Lazy load the associated collection to avoid initialization costs.
    get: function(model) {
      var collection = model[this.store];
      if (collection) return collection;

      // Create a new collection.
      collection = new this.collection();

      // We'll need to know what model "owns" this collection in order to
      // handle events that it triggers.
      collection.owner = model;
      model[this.store] = collection;

      // Initialize listeners and models.
      this.reset(model[this.through]()
        .on('add', this.add, this)
        .on('remove', this.remove, this)
        .on('reset', this.reset, this)
        .on('associate:' + this.source, this._associate)
        .on('dissociate:' + this.source, this._dissociate));

      return collection;
    },

    // Add models to the collection when added to the through collection.
    add: function(model, through) {
      if (!model || !through || !(model = model[this.source]())) return;
      if (this.where && !this.where(model)) return;
      through.owner[this.name]().add(model);
    },

    // Remove models from the collection when removed from the through
    // collection after checking for other instances.
    remove: function(model, through) {
      if (!model || !through || !(model = model[this.source]())) return;
      var exists = through.any(function(o) {
        return o[this.source]() === model;
      }, this);
      if (!exists) through.owner[this.name]().remove(model);
    },

    // Reset when the through collection is reset.
    reset: function(through) {
      if (!through) return;
      var models = _.compact(_.uniq(_.invoke(through.models, this.source)));
      if (this.where) models = _.filter(models, this.where);
      through.owner[this.name]().reset(models);
    },

    // Add associated models.
    _associate: function(through, model, other) {
      if (!through || !model || !other) return;
      if (this.where && !this.where(other)) return;
      through.owner[this.name]().add(other);
    },

    // Remove dissociated models, taking care to check for other instances.
    _dissociate: function(through, model, other) {
      if (!through || !model || !other) return;
      var exists = through.any(function(o) {
        return o[this.source]() === other;
      }, this);
      if (!exists) through.owner[this.name]().remove(other);
    }

  });

  // # has
  // Avoid naming collisions by providing one entry point for associations.
  var Has = function(model) {
    this.model = model;
  };

  _.extend(Has.prototype, {

    // ## one
    // *Create a one-to-one or one-to-many association.*
    //
    // Options:
    //
    // * **inverse** - (*required*) The name of the inverse association.
    // * **model** - (*required*) The model constructor for the association.
    // * **id** - The associated id is stored here.
    //   Defaults to `name` + '_id'.
    // * **source** - The attribute where nested data is stored.
    //   Defaults to `name`.
    // * **store** - The property to store the association in.
    //   Defaults to '_' + `name`.
    one: function(name, options) {
      options.name = name;
      new One(this.model, options);
      return this;
    },

    // ## many
    // *Create a many-to-one or many-to-many association.*
    //
    // Options:
    //
    // * **collection** - (*required*) The collection constructor.
    // * **inverse** - (*required for many-to-one associations*) The name of the
    //   inverse association.
    // * **through** - (*required for many-to-many associations*) The name of the
    //   through association.
    // * **source** - (*required for many-to-many associations*) The attribute
    //   where nested data is stored.
    // * **store** - The property to store the association in.
    //   Defaults to '_' + `name`.
    many: function(name, options) {
      options.name = name;
      var Association = options.through ? ManyToMany : ManyToOne;
      new Association(this.model, options);
      return this;
    }

  });

  // # Model
  var Model = Supermodel.Model = Backbone.Model.extend({

    // The attribute to store the cid in for lookup.
    cidAttribute: 'cid',

    initialize: function() {
      // Use `"cid"` for retrieving models by `attributes.cid`.
      this.set(this.cidAttribute, this.cid);

      // Add the model to `all` for each constructor in its prototype chain.
      var ctor = this.constructor;
      do { ctor.all().add(this); } while (ctor = ctor.parent);

      // Trigger 'initialize' for listening associations.
      this.trigger('initialize', this);
    },

    // While `"cid"` is used for tracking models, it should not be persisted.
    toJSON: function() {
      var o = Backbone.Model.prototype.toJSON.apply(this, arguments);
      delete o[this.cidAttribute];
      return o;
    },

    // Associations are initialized/updated during `parse`.  They listen for
    // the `'parse'` event and remove the appropriate properties after parsing.
    parse: function(resp) {
      this.trigger('parse', this, resp);
      return resp;
    }

  }, {

    // ## create
    // Create a new model after checking for existence of a model with the same
    // id.
    create: function(attrs, options) {
      var model;
      var all = this.all();
      var cid = attrs && attrs[this.prototype.cidAttribute];
      var id = attrs && attrs[this.prototype.idAttribute];

      // If `attrs` belongs to an existing model, return it.
      if (cid && (model = all.getByCid(cid)) && model.attributes === attrs) {
        return model;
      }

      // If a model already exists for `id`, return it.
      if (id && (model = all.get(id))) {
        model.parse(attrs);
        model.set(attrs);
        return model;
      }

      if (!id) return new this(attrs, options);

      // Throw if a model already exists with the same id in a superclass.
      var ctor = this;
      do {
        if (!ctor.all().get(id)) continue;
        throw new Error('Model with id "' + id + '" already exists.');
      } while (ctor = ctor.parent);

      return new this(attrs, options);
    },

    // Create associations for a model.
    has: function() {
      return new Has(this);
    },

    // Return a collection of all models for a particular constructor.
    all: function() {
      return this._all || (this._all = new Collection());
    },

    // Return a hash of all associations for a particular constructor.
    associations: function() {
      return this._associations || (this._associations = {});
    },

    // Models and associations are tracked via `all` and `associations`,
    // respectively.  `reset` removes all model references to allow garbage
    // collection.
    reset: function() {
      this._all = new Collection();
      this._associations = {};
    }

  });

}).call(this, Backbone);
