YUI.add('gallery-md-model', function(Y) {

/**
Record-based data model with APIs for getting, setting, validating, and
syncing attribute values, as well as events for being notified of model changes.
 
@module gallery-md-model
**/
 
/**
Record-based data model with APIs for getting, setting, validating, and
syncing attribute values, as well as events for being notified of model changes.
 
In most cases, you'll want to create your own subclass of Y.GalleryModel and
customize it to meet your needs. In particular, the sync() and validate()
methods are meant to be overridden by custom implementations. You may also want
to override the parse() method to parse non-generic server responses.
 
@class Y.GalleryModel
@constructor
@param [cfg] {Object} Initial configuration attribute plus:
@param [cfg.values] {Object}  Sets initial values for the model.  
	Model will be marked as new and not modified (as if just loaded).
	If GalleryModel is extended with any of the multi-record extensions,
	this will not work until <a href="http://yuilibrary.com/projects/yui3/ticket/2529898">this bug</a> is fixed:
	Use `new Y.GalleryModel().add(values)` instead.
@extends Base
**/
	"use strict";
	
	var Lang = Y.Lang,
		YArray = Y.Array,
		YObject = Y.Object,
		EVT_CHANGE = 'change',
		EVT_LOADED = 'loaded',
		EVT_ERROR = 'error',
		EVT_SAVED = 'saved',
		EVT_RESET = 'reset',
		IS_MODIFIED = 'isModified',
		IS_NEW = 'isNew',
		DOT = '.',
		CHANGE = 'Change',
		ADD = 'add',
		UNDO = 'undo',
		NULL_FN = function (){};
	

	Y.GalleryModel = Y.Base.create(
		NAME,
		Y.Base, 
		[],
		{
			/**
			 * Hash of values indexed by field name
			 * @property _values
			 * @type Object
			 * @private
			 */
			_values: null,
			/**
			 * Hash of values as loaded from the remote source, 
			 * presumed to be the current value there.
			 * @property _loadedValues
			 * @type Object
			 * @private
			 */
			_loadedValues: null,
			/**
			 * Array of field names that make up the primary key for this record
			 * @property _primaryKeys
			 * @type Array
			 * @private
			 */
			_primaryKeys: null,
			/*
			 * Y.Base lifecycle method
			 */
			initializer: function  (cfg) {
				this._values = {};
				this._loadedValues = {};
				/**
				 * Fired whenever a value or values are changed. 
				 * If changed via {{#crossLink "Y.GalleryModel/setValues"}}{{/crossLink}} the facade will not contain a __name__.  
				 * Instead, __prevVals__ and __newVals__ (both plural) properties will contain 
				 * hashes with the names and values of the fields changed.
				 * After firing the event for a group of fields changed via {{#crossLink "Y.GalleryModel/setValues"}}{{/crossLink}},
				 * a new change event will be fired for each individual field changed.
				 * For individual field changes via {{#crossLink "Y.GalleryModel/setValue"}}{{/crossLink}}, the __name__, __prevVal__ and __newVal__
				 * will be provided.
				 * The event can be prevented on a per group change basis or per individual field change.
				 * Preventing the change on a particular field will not prevent the others from being changed.
				 * @event change
				 * @param ev {EventFacade} containing:
				 * @param [ev.name] {String} Name of the field changed
				 * @param [ev.newVal] {Any} New value of the field.
				 * @param [ev.prevVal] {Any} Previous value of the field.
				 * @param [ev.newVals] {Object} Hash with the new values for the listed fields.
				 * @param [ev.prevVals] {Object} Hash with the previous values for the listed fields.
				 * @param ev.src {String|null} Source of the change event, if any.
				 */
				this.publish(EVT_CHANGE, {
					defaultFn: this._defSetValue
				});
				/**
				 * Fired when new data has been received from the remote source.  
				 * It will also be fired even on a {{#crossLink "Y.GalleryModel/save"}}{{/crossLink}} operation if the response contains values.
				 * The parsed values can be altered on the before (on) listener.
				 * @event loaded
				 * @param ev {EventFacade} containing:
				 * @param ev.response {Object} Response data as received from the remote source
				 * @param ev.parsed {Object} Data as returned from the parse method.
				 * @param ev.options {Object} Options as received by the {{#crossLink "Y.GalleryModel/load"}}{{/crossLink}} method.
				 * @param ev.callback {Function} Function to call at the end of the load process
				 * @param ev.src {String} the source of the load, usually `'load'`
				 */
				this.publish(EVT_LOADED, {
					defaultFn:this._defDataLoaded,
					preventedFn: this._stoppedDataLoaded,
					stoppedFn: this._stoppedDataLoaded
				});
				/**
				 * Fired when the data has been saved to the remote source
				 * The event cannot be prevented.  
				 * The developer has full control of what is
				 * about to be saved and when it is saved so it would be pointless
				 * to try to prevent it at this stage.  This is in contrast to
				 * the {{#crossLink "Y.GalleryModel/loaded:event"}}{{/crossLink}} event where the developer has no control of what might
				 * come from the server and might wish to do something about it.
				 * If in reply to the save operation the server replies with data, 
				 * the __response__ and __parsed__ properties will be filled.
				 * @event saved
				 * @param ev {EventFacade} containing:
				 * @param [ev.response] {Object} Response data as received from the remote source, if any.
				 * @param [ev.parsed] {Object} Data as returned from the parse method, if any.
				 * @param ev.options {Object} Options as received by the {{#crossLink "Y.GalleryModel/save"}}{{/crossLink}} method.
				 * @param ev.callback {Function} Function to call at the end of the load process
				 * @param ev.src {String} the source of the save, usually `'save'`
				 */
				this.publish(EVT_SAVED, {
					preventable: false
				});
				cfg = cfg || {};
				if (Lang.isObject(cfg.values)) {
					this.after('init',this._setInitialValues);
				}
			},
			/**
			 * Sets the initial values if any were provided to the constructor.
			 * It is only ever called after the initialization of this class and all its extensions
			 * and only if the arguments to the constructor had a `values` attribute
			 * @method _setInitialValues
			 * @param ev {EventFacade} in particular:
			 * @param ev.cfg.values {Object} values to be set
			 * @private
			 */
			_setInitialValues: function (ev) {
				this.setValues(ev.cfg.values, 'init');
				this._set(IS_MODIFIED, false);
				this._set(IS_NEW, true);
				this._loadedValues = Y.clone(this._values);
			},
			/**
			 * Destroys this model instance and removes it from its containing lists, if
			 * any.

			 * If __options.remove__ is true then this method also delegates to the
			 * {{#crossLink "Y.GalleryModel/sync"}}{{/crossLink}} method to delete the model from the persistence layer.

			 * @method destroy
			 * @param [options] {Object} Options passed on to the {{#crossLink "Y.GalleryModel/sync"}}{{/crossLink}} method, if required.
			 * @param [options.remove=false] {Boolean} if true, the data will also be erased from the server.
			 * @param [callback] {function} function to be called when the sync operation finishes.
			 *		@param callback.err {string|null} Error message, if any or null.
			 *		@param callback.response {Any} The server response as received by {{#crossLink "Y.GalleryModel/sync"}}{{/crossLink}}.
			 * @chainable
			 */
			destroy: function (options, callback) {
				if (Lang.isFunction(options)) {
					callback = options;
					options = {};
				} else if (!options) {
					options = {};
				}
				callback = callback || NULL_FN;
				var self = this,
					finish = function (err) {
						if (!err) {
							YArray.each(self.lists.concat(), function (list) {
								list.remove(self, options);
							});

							Y.GalleryModel.superclass.destroy.call(self);
						}

						callback.apply(self, arguments);
					};

				if (options.remove) {
					this.sync('delete', options, finish);
				} else {
					finish();
				}

				return this;
			},
			/**
			 * Returns the value of the field named
			 * @method getValue
			 * @param name {string}  Name of the field to return.
			 * @return {Any} the value of the field requested.  
			 */ 
			getValue: function (name) {
				return this._values[name];
			},
			/**
			 * Returns a hash with all values using the field names as keys.
			 * @method getValues
			 * @return {Object} a hash with all the fields with the field names as keys.
			 */ 
			getValues: function() {
				return Y.clone(this._values);
			},
			/**
			 * Sets the value of the named field. 
			 * Fires the {{#crossLink "Y.GalleryModel/change:event"}}{{/crossLink}} event if the new value is different from the current one.
			 * Primary key fields cannot be changed unless still `undefined`.
			 * @method setValue
			 * @param name {string} Name of the field to be set
			 * @param value {Any} Value to be assigned to the field
			 * @param [src] {Any} Source of the change in the value.
			 * @chainable
			 */
			setValue: function (name, value, src) {
				var prevVal = this._values[name];
				if (prevVal !== value && (this._primaryKeys.indexOf(name) === -1 || Lang.isUndefined(prevVal))) {
					this.fire(EVT_CHANGE, {
						name:name,
						newVal:value,
						prevVal:prevVal,
						src: src
					});
				}
				return this;
			},
			/**
			 * Default function for the change event, sets the value and marks the model as modified.
			 * @method _defSetValue
			 * @param ev {EventFacade} (see {{#crossLink "Y.GalleryModel/change:event"}}{{/crossLink}} event)
			 * @private
			 */
			_defSetValue: function (ev) {
				var self = this;
				if (ev.name) {
					self._values[ev.name] = ev.newVal;
					self._set(IS_MODIFIED, true);
				} else {
					YObject.each(ev.newVals, function (value, name) {
						self.setValue(name, value, ev.src);
					});
				}
			},
			/**
			 * Sets a series of values.   
			 * It simply loops over the hash of values provided calling {{#crossLink "Y.GalleryModel/setValue"}}{{/crossLink}} on each.
			 * Fires the {{#crossLink "Y.GalleryModel/change:event"}}{{/crossLink}} event.
			 * @method setValues
			 * @param values {Object} hash of values to change
			 * @param [src] {Any} Source of the changes
			 * @chainable
			 */
			setValues: function (values, src) {
				var self = this,
					prevVals = {};
					
				YObject.each(values, function (value, name) {
					prevVals[name] = self.getValue(name);
				});
				this.fire(EVT_CHANGE, {
					newVals:values,
					prevVals:prevVals,
					src: src
				});
				return self;
			},
			/**
			 * Returns a hash indexed by field name, of all the values in the model that have changed since the last time
			 * they were synchornized with the remote source.   Each entry has a __prevVal__ and __newVal__ entry.
			 * @method getChangedValues
			 * @return {Object} Hash of all entries changed since last synched.
			 * Each entry has a __newVal__ and __prevVal__ property contaning original and changed values.
			 */
			getChangedValues: function() {
				var changed = {}, 
					prev, 
					loaded = this._loadedValues;

				YObject.each(this._values, function (value, name) {
					prev = loaded[name];
					if (prev !== value) {
						changed[name] = {prevVal:prev, newVal: value};
					}
				});
				return changed;
			},
			/**
			 * Returns a hash with the values of the primary key fields, indexed by their field names
			 * @method getPKValues
			 * @return {Object} Hash with the primary key values, indexed by their field names
			 */
			getPKValues: function () {
				var pkValues = {},
					self = this;
				YArray.each(self._primaryKeys, function (name) {
					pkValues[name] = self._values[name];
				});
				return pkValues;
			},
			/**
				Returns an HTML-escaped version of the value of the specified string
				attribute. The value is escaped using Y.Escape.html().

				@method getAsHTML
				@param {String} name Attribute name or object property path.
				@return {String} HTML-escaped attribute value.
			**/
			getAsHTML: function (name) {
				var value = this.getValue(name);
				return Y.Escape.html(Lang.isValue(value) ? String(value) : '');
			},

			/**
			 * Returns a URL-encoded version of the value of the specified field,
			 * or a full URL with `name=value` sets for all fields if no name is given.
			 * The names and values are encoded using the native `encodeURIComponent()`
			 * function.

			 * @method getAsURL
			 * @param [name] {String}  Field name.
			 * @return {String} URL-encoded field value if name is given or URL encoded set of `name=value` pairs for all fields.
			 */
			getAsURL: function (name) {
				var value = this.getValue(name),
					url = [];
				if (name) {
					return encodeURIComponent(Lang.isValue(value) ? String(value) : '');
				} 
				YObject.each(value, function (value, name) {
					if (Lang.isValue(value)) {
						url.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
					}
				});
				return url.join('&');
			},

			/**
			 * Default function for the {{#crossLink "Y.GalleryModel/loaded:event"}}{{/crossLink}} event. 
			 * Does the actual setting of the values just loaded and calls the callback function.
			 * @method _defDataLoaded
			 * @param ev {EventFacade} see loaded event
			 * @private
			 */
			_defDataLoaded: function (ev) {
				var self = this;
				self.setValues(ev.parsed, ev.src);
				self._set(IS_MODIFIED, false);
				self._set(IS_NEW, false);
				self._loadedValues = Y.clone(self._values);
				ev.callback.call(self,null, ev.response);
			},
			/**
			 * Function called when the {{#crossLink "Y.GalleryModel/loaded:event"}}{{/crossLink}} event is prevented, stopped or halted
			 * so that the callback is called with a suitable error
			 * @method _stoppedDataLoaded
			 * @param ev {EventFacade}
			 * @private
			 */
			_stoppedDataLoaded: function (ev) {
				ev.details[0].callback.call(this, 'Load event halted');
			},
			/**
				Loads this model from the server.

				This method delegates to the {{#crossLink "Y.GalleryModel/sync"}}{{/crossLink}} method to perform the actual load
				operation, which is an asynchronous action. Specify a __callback__ function to
				be notified of success or failure.

				A successful load operation will fire a {{#crossLink "Y.GalleryModel/loaded:event"}}{{/crossLink}} event, while an unsuccessful
				load operation will fire an {{#crossLink "Y.GalleryModel/error:event"}}{{/crossLink}} event with the `src` set to `"load"`.

				@method load
				@param [options] {Object} Options to be passed to {{#crossLink "Y.GalleryModel/sync"}}{{/crossLink}}.
					Usually these will be or will include the keys used by the remote source 
					to locate the data to be loaded.
					They will be passed on unmodified to the {{#crossLink "Y.GalleryModel/sync"}}{{/crossLink}} method.
					It is up to {{#crossLink "Y.GalleryModel/sync"}}{{/crossLink}} to determine what they mean.
				@param [callback] {callback} <span class="flag deprecated">deprecated</span> 
					Use `this.load(options).after('loaded', callback)` instead.
			
					Called when the sync operation finishes. Callback will receive:
					@param callback.err {string|null} Error message, if any or null.
					@param callback.response {Any} The server response as received by sync(),
				@chainable
			**/
			load: function (options, callback) {
				var self = this;

				if (Lang.isFunction(options)) {
					callback = options;
					options = {};
				} else if (!options) {
					options = {};
				}
				callback = callback || NULL_FN;

				self.sync('read', options, function (err, response) {
					var facade = {
							options : options,
							response: response,
							src: 'load',
							callback: callback
						};

					if (err) {
						facade.error = err;

						self.fire(EVT_ERROR, facade);
						callback.apply(self, arguments);
					} else {
						self._values = {};

						facade.parsed = self.parse(response);
						self.fire(EVT_LOADED, facade);
					}
				});

				return self;
			},

			/**
				Called to parse the __response__ when a response is received from the server.
				This method receives a server __response__ and is expected to return a
				value hash.

				The default implementation assumes that __response__ is either an attribute
				hash or a JSON string that can be parsed into an attribute hash. If
				__response__ is a JSON string and either Y.JSON or the native JSON object
				are available, it will be parsed automatically. If a parse error occurs, an
				error event will be fired and the model will not be updated.

				You may override this method to implement custom parsing logic if necessary.

				@method parse
				@param {Any} response Server response.
				@return {Object} Values hash.
			**/
			parse: function (response) {
				if (typeof response === 'string') {
					try {
						return Y.JSON.parse(response);
					} catch (ex) {
						this.fire(EVT_ERROR, {
							error : ex,
							response: response,
							src : 'parse'
						});

						return null;
					}
				}

				return response;
			},



			/**
				Saves this model to the server.

				This method delegates to the {{#crossLink "Y.GalleryModel/sync"}}{{/crossLink}} method to perform the actual save
				operation, which is an asynchronous action. Specify a __callback__ function to
				be notified of success or failure.

				A successful save operation will fire a {{#crossLink "Y.GalleryModel/saved:event"}}{{/crossLink}} event, while an unsuccessful
				load operation will fire an {{#crossLink "Y.GalleryModel/error:event"}}{{/crossLink}} event with the 'src' property set to `"save"`.

				If the save operation succeeds and the {{#crossLink "Y.GalleryModel/parse"}}{{/crossLink}} method returns non-empty values
				from the response received from the server a {{#crossLink "Y.GalleryModel/loaded:event"}}{{/crossLink}} event will also be fired to read those values.

				@method save
				@param {Object} [options] Options to be passed to {{#crossLink "Y.GalleryModel/sync"}}{{/crossLink}}. 
					It's up to the custom sync implementation
					to determine what options it supports or requires, if any.
				@param {Function} [callback] Called when the sync operation finishes.
					@param callback.err {string|null} Error message, if any or null.
					@param callback.response {Any} The server response as received by {{#crossLink "Y.GalleryModel/sync"}}{{/crossLink}},
				@chainable
			**/
			save: function (options, callback) {
				var self = this;

				if (Lang.isFunction(options)) {
					callback = options;
					options = {};
				} else if (!options) {
					options = {};
				}
				callback = callback || NULL_FN;

				self._validate(self.getValues(), function (err) {
					if (err) {
						callback.call(self, err);
						return;
					}

					self.sync(self.get(IS_NEW) ? 'create' : 'update', options, function (err, response) {
						var facade = {
								options : options,
								response: response,
								src: 'save'
							};

						if (err) {
							facade.error = err;

							self.fire(EVT_ERROR, facade);
						} else {
							facade.parsed = self.parse(response);
							facade.callback = callback;
							self._set(IS_MODIFIED, false);
							self._set(IS_NEW, false);
							self._loadedValues = Y.clone(self._values);
							self.fire(EVT_SAVED, facade);
							if (facade.parsed) {
								self.fire(EVT_LOADED, facade);
								return self; // the loaded event will take care of calling the callback
							}
						}
						callback.apply(self, arguments);
					});
				});

				return self;
			},
			/**
			 * Restores the values when last loaded, saved or created.
			 * @method reset
			 * @chainable
			 */
			reset: function() {
				this._values = Y.clone(this._loadedValues);
				this.fire(EVT_RESET);
				return this;
			},
			/**
				Override this method to provide a custom persistence implementation for this
				model. The default just calls the callback without actually doing anything.

				This method is called internally by {{#crossLink "Y.GalleryModel/load"}}{{/crossLink}}, 
				{{#crossLink "Y.GalleryModel/save"}}{{/crossLink}}, 
				and {{#crossLink "Y.GalleryModel/destroy"}}{{/crossLink}} (when `options.remove==true).

				@method sync
				@param {String} action Sync action to perform. May be one of the following:

					* create: Store a newly-created model for the first time.
					* read  : Load an existing model.
					* update: Update an existing model.
					* delete: Delete an existing model.

				@param {Object} [options] Sync options. It's up to the custom sync
					implementation to determine what options it supports or requires, if any.
				@param {Function} [callback] Called when the sync operation finishes.
					@param {Error|null} callback.err If an error occurred, this parameter will
						contain the error. If the sync operation succeeded, __err__ will be
						falsy.
					@param {Any} [callback.response] The server's response. This value will
						be passed to the {{#crossLink "Y.GalleryModel/parse"}}{{/crossLink}} method, which is expected to parse it and
						return an attribute hash.
			**/
			sync: function (action, options, callback) {
				(callback || NULL_FN).call(this);
			},
			/**
				Override this method to provide custom validation logic for this model.

				This method gives you a hook to validate a hash of all
				attributes before the model is saved. This method is called automatically
				before {{#crossLink "Y.GalleryModel/save"}}{{/crossLink}} takes any action. 
				If validation fails, the {{#crossLink "Y.GalleryModel/save"}}{{/crossLink}} call
				will be aborted.

				In your validation method, call the provided callback function with no
				arguments to indicate success. To indicate failure, pass a single argument,
				which may contain an error message, an array of error messages, or any other
				value. This value will be passed along to the error event.

				@example

					model.validate = function (attrs, callback) {
						if (attrs.pie !== true) {
							// No pie?! Invalid!
							callback('Must provide pie.');
							return;
						}

						// Success!
						callback();
					};

				@method validate
				@param {Object} attrs Hash containing all model attributes to
				be validated.
				@param {Function} callback Validation callback. Call this function when your
				validation logic finishes. To trigger a validation failure, pass any
				value as the first argument to the callback (ideally a meaningful
				validation error of some kind).

				@param {Any} [callback.err] Validation error. Don't provide this
				argument if validation succeeds. If validation fails, set this to an
				error message or some other meaningful value. It will be passed
				along to the resulting error event.
			**/
			validate: function (attrs, callback) {
				(callback || NULL_FN).call(this);
			},
			/**
				Calls the public, overridable validate() method and fires an error event
				if validation fails.

				@method _validate
				@param {Object} attributes Attribute hash.
				@param {Function} callback Validation callback.
				@param {Any} [callback.err] Value on failure, non-value on success.
				@protected
			**/
			_validate: function (attributes, callback) {
				var self = this;

				self.validate(attributes, function (err) {
					if (Lang.isValue(err)) {
						// Validation failed. Fire an error.
						self.fire(EVT_ERROR, {
							attributes: attributes,
							error : err,
							src : 'validate'
						});

						callback.call(self, err);
						return;
					}

					callback.call(self);
				});

			},
			/**
			 * The default implementation calls {{#crossLink "Y.GalleryModel/getValues"}}{{/crossLink}}
			 * so that it returns a copy of the record.  
			 * The developer may redefine this method to serialize this object
			 * in any way that might be needed.  
			 * For example, it might be desirable to call 
			 * {{#crossLink "Y.GalleryModel/getChangedValues"}}{{/crossLink}}
			 * to return only changed fields, along with 
			 * {{#crossLink "Y.GalleryModel/getPKValues"}}{{/crossLink}} 
			 * to identify the record with the changes.
			 * @method toJSON
			 * @return {Object} Copy of this model field values.
			 */
			toJSON: function () {
				return this.getValues();
			},
			/**
			 * Getter for the {{#crossLink "Y.GalleryModel/isModified:attribute"}}{{/crossLink}} attribute.
			 * If the value contains a dot (`'.'`) the modified state of the field named as a sub-attribute will be returned.
			 * Otherwise, the modified status of the whole record will be returned.
			 * @method _isModifiedGetter
			 * @param value {Any} Value stored for the attribute. 
			 * @value name {String} Name of the attribute/sub-attribute being modified
			 * @return {Boolean} State of the record/field
			 * @protected
			 */
			_isModifiedGetter: function (value, name) {
				name = name.split(DOT);
				if (name.length > 1) {
					name = name[1];
					var ret = {};
					ret[name] = this._values[name] !== this._loadedValues[name];
					return ret;
				}
				return value;
			},
			/**
			 * Getter for the {{#crossLink "Y.GalleryModel/isNew:attribute"}}{{/crossLink}} attribute.
			 * If the value contains a dot (`'.'`) the 'new' state of the field named as a sub-attribute will be returned.
			 * Otherwise, the 'new' status of the whole record will be returned.
			 * @method _isNewGetter
			 * @param value {Any} Value stored for the attribute. 
			 * @value name {String} Name of the attribute/sub-attribute being modified
			 * @return {Boolean} State of the record/field
			 * @protected
			 */
			_isNewGetter: function (value, name) {
				name = name.split(DOT);
				if (name.length > 1) {
					name = name[1];
					var ret = {};
					ret[name] = !this._loadedValues.hasOwnProperty(name);
					return ret;
				}
				return value;
			},
			/**
			 * Setter for the {{#crossLink "Y.GalleryModel/primaryKeys:attribute"}}{{/crossLink}} attribute.
			 * If the value is already set, no further changes will be allowed.
			 * If the value is not an array, it will be converted to one.
			 * @method _primaryKeysSetter
			 * @param value {Any} Value stored for the attribute. 
			 * @return {Array} Primary keys
			 * @protected
			 */
			_primaryKeysSetter: function (value) {
				if (this._primaryKeys && this._primaryKeys.length) {
					return Y.Attribute.INVALID_VALUE;
				}
				value = new YArray(value);
				this._primaryKeys = value;
				return value;
			},
			/**
			 * Getter for the {{#crossLink "Y.GalleryModel/primaryKeys:attribute"}}{{/crossLink}} attribute.
			 * If the name contains a dot (`'.'`) it will return a boolean indicating 
			 * whether the field named as a sub-attribute is part of the primary key.
			 * Otherwise, it returns the array of primary key fields.
			 * @method  _primaryKeysGetter
			 * @param value {Array} Names of the primary key fields
			 * @param name {String} Name of the attribute/sub-attribute requested.
			 * @return {Array|Boolean} Array of the primary key field names or Boolean indicating if the asked for field is part of it.
			 * @private
			 */
			_primaryKeysGetter: function (value, name) {
				name = name.split(DOT);
				if (name.length > 1) {
					name = name[1];
					var ret = {};
					ret[name] = value.indexOf(name) !== -1;
					return ret;
				}
				return (value || []).concat();  // makes sure to return a copy, not the original.
			}
		},
		{
			ATTRS: {
				/**
				 * Indicates whether any of the fields has been changed since created or loaded.
				 * Field names can be given as sub-attributes to indicate if any particular field has beeen changed.
				 * `model.get('isModified.name')` returns `true` if the field `name` has been modified.
				 * <b>Note:</b> contrary to common practice in Attributes with sub-attributes, 
				 * requesting the state of the record does not
				 * return an object with the state of each individual field keyed by field name,
				 * but the state of the record as a whole, which is far more useful.
				 * @attribute isModified
				 * @type Boolean
				 * @readonly
				 * @default false
				 */
				isModified: {
					readOnly: true,
					value:false,
					validator:Lang.isBoolean,
					getter: '_isModifiedGetter'
				},
				/**
				 * Indicates that the model is new and has not been modified since creation.
				 * Field names can be given as sub-attributes to indicate if any particular field is new.
				 * `model.get('isNew.name')` returns `true` if the field `name` is new.
				 * <b>Note:</b> contrary to common practice in Attributes with sub-attributes, 
				 * requesting the state of the record does not
				 * return an object with the state of each individual field keyed by field name,
				 * but the state of the record as a whole, which is far more useful.
				 * @attribute isNew
				 * @type Boolean
				 * @readonly
				 * @default true
				 */
				isNew: {
					readOnly: true,
					value:true,
					validator:Lang.isBoolean,
					getter: '_isNewGetter'
				},
				/**
				 * List of fields making the primary key of this model. 
				 * Primary Key fields cannot be modified once initially loaded.
				 * It can be set as an array of field names or, if the key is made of a single field, a string with the name of that field.
				 * It will always be returned as an array.
				 * Field names can be given as a sub-attribute to ask whether a particular field is a primary key, thus:
				 * `model.get('primaryKeys.name')` returns `true` if the field `name` is a primary key.
				 * It can only be set once.
				 * @attribute primaryKeys
				 * @writeonce
				 * @type array
				 * @default []
				 */
				primaryKeys: {
					setter:'_primaryKeysSetter',
					getter:'_primaryKeysGetter',
					lazyAdd: false,
					value: []
				}
			}

		}
	);
		
	/**
	 * An extension for Y.GalleryModel that provides a single level of undo for each field.
	 * It will never undo a field to `undefined` since it assumes an undefined field had not been set.
	 * @class Y.GalleryModelSimpleUndo
	 */
	Y.GalleryModelSimpleUndo = function () {};
	
	Y.GalleryModelSimpleUndo.prototype = {
		initializer: function () {
			this._lastChange = {};
			if (this._addPreserve) {
				this._addPreserve('_lastChange');
			}
			this.after(EVT_CHANGE, this._trackChange);
			this.on([EVT_LOADED, EVT_SAVED, EVT_RESET], this._resetUndo);	
		},
		/**
		 * Event listener for the after value change event, it tracks changes for each field.  
		 * It retains only the last change for each field.
		 * @method _trackChange
		 * @param ev {EventFacade} As provided by the {{#crossLink "Y.GalleryModel/change:event"}}{{/crossLink}} event
		 * @private
		 */
		_trackChange: function (ev) {
			if (ev.name && ev.src !== UNDO) {
				this._lastChange[ev.name] = ev.prevVal;
			}
		},
		/**
		 * After load or save operations, it drops any changes it might have tracked.
		 * @method _resetUndo
		 * @private
		 */
		_resetUndo: function () {
			this._lastChange = {};
		},
		/**
		 * Reverts one level of change for a specific field or all fields
		 * @method undo
		 * @param [name] {String} If provided it will undo that particular field,
		 *	otherwise, it undoes the whole record.
		 * @chainable
		 */
		undo: function (name) {
			var self = this;
			if (name) {
				if (self._lastChange[name] !== undefined) {		
					self.setValue(name, self._lastChange[name], UNDO);
					delete self._lastChange[name];
				}
			} else {
				YObject.each(self._lastChange, function (value, name) {
					if (value !== undefined) {
						self.setValue(name, value, UNDO);
					}
				});
				self._lastChange = {};
			}
			return self;
		}
	};
	
	/**
	 * Provides multiple levels of undo in strict chronological order 
	 * whatever the field was at each stage.
	 * Changes done on multiple fields via setValues
	 * will also be undone in one step.
	 * @class Y.GalleryModelChronologicalUndo
	 */
	Y.GalleryModelChronologicalUndo = function () {};
	
	Y.GalleryModelChronologicalUndo.prototype = {
		initializer: function () {
			this._changes = [];
			if (this._addPreserve) {
				this._addPreserve('_changes');
			}
			this.after(EVT_CHANGE, this._trackChange);
			this.on([EVT_LOADED,EVT_SAVED,EVT_RESET], this._resetUndo);
		},
		/**
		 * Event listener for the after value change event, it tracks changes for each field.  
		 * It keeps a stack of each change.  
		 * @method _trackChange
		 * @param ev {EventFacade} As provided by the {{#crossLink "Y.GalleryModel/change:event"}}{{/crossLink}} event
		 * @private
		 */
		_trackChange: function (ev) {
			if (ev.src !== UNDO) {
				this._changes.push(ev.details);
			}
		},
		/**
		 * After load or save operations, it drops any changes it might have tracked.
		 * @method _resetUndo
		 * @private
		 */
		_resetUndo: function () {
			this._changes = [];
		},
		/**
		 * Reverts one level of field changes.
		 * @method undo
		 * @chainable
		 */
		undo: function () {
			var ev = this._changes.pop();
			if (ev) {
				if (ev.name) {
					this.setValue(ev.name, ev.prevVal, UNDO);
				} else {
					this.setValues(ev.prevVals, UNDO);
				}
			}
			if (this._changes.length === 0) {
				this._set(IS_MODIFIED, false);
			}
			return this;
		}
	};
	
	/**
	 * Allows GalleryModel to handle a set of records using the Flyweight pattern.
	 * It exposes one record at a time from a shelf of records.
	 * Exposed records can be selected by setting the {{#crossLink "Y.GalleryModel/index:attribute"}}{{/crossLink}} attribute.
	 * @class Y.GalleryModelMultiRecord
	 */
	
	var INDEX = 'index',
		MR = function () {};
	
	MR.prototype = {
		/**
		 * Added this property to have `ModelSync.REST getURL()` return the proper URL.
		 * @property _isYUIModelList
		 * @type Boolean
		 * @value true
		 * @private
		 */
		_isYUIModelList: true,
		initializer: function () {
			this._shelves = [];
			this._currentIndex = 0;
			this._addPreserve('_values','_loadedValues','_isNew','_isModified');
		},
		/**
		 * Sets the initial values if any were provided to the constructor.
		 * It is only ever called after the initialization of this class and all its extensions
		 * and only if the arguments to the constructor had a `values` attribute.
		 * It overrides the {{#crossLink "Y.GalleryModel/_setInitialValues"}}{{/crossLink}} 
		 * so as to handle arrays.
		 * @method _setInitialValues
		 * @param ev {EventFacade} in particular:
		 * @param ev.cfg.values {Object} values to be set
		 * @private
		 */
		_setInitialValues: function (ev) {
			this.add(ev.cfg.values);
		},

		/**
		 * Index of the shelf for the record being exposed.
		 * Use {{#crossLink "Y.GalleryModel/index:attribute"}}{{/crossLink}} attribute to check/set the index value.
		 * @property _currentIndex
		 * @type integer
		 * @default 0
		 * @private
		 */
		_currentIndex: 0,
		/**
		 * Storage for the records when not exposed.
		 * @property _shelves
		 * @type Array
		 * @private
		 */
		_shelves: null,
		/**
		 * Saves the exposed record into the shelves at the position specified or given by {{#crossLink "Y.GalleryModelMultiRecord/_currentIndex"}}{{/crossLink}}
		 * @method _shelve
		 * @param [index=this._currentIndex] {Integer} Position to shelve it in
		 * @private
		 */
		_shelve: function(index) {
			if (index === undefined) {
				index = this._currentIndex;
			}
			var self = this,
				current = {};
			YArray.each(self._preserve, function (name) {
				current[name] = self[name];
			});
			self._shelves[index] = current;
			
		},
		/**
		 * Retrives and exposes the record from the shelf at the position specified or given by {{#crossLink "Y.GalleryModelMultiRecord/_currentIndex"}}{{/crossLink}}
		 * @method _fetch
		 * @param [index=this._currentIndex] {Integer} Position to fetch it from.
		 * @private
		 */
		_fetch: function (index) {
			if (index === undefined) {
				index = this._currentIndex;
			} else {
				this._currentIndex = index;
			}
			var self = this,
				current = self._shelves[index];
				
			if (Lang.isUndefined(current)) {
				this._initNew();
			} else {
				YArray.each(self._preserve, function (name) {
					self[name] = current[name];
				});
			}
			
		},
		/**
		 * Adds the names of properties that are to be preserved in the shelf when moving,
		 * and taken out of the shelf when fetching.
		 * @method _addPreserve
		 * @param name* {String} any number of names or array of names of properties to be preserved.
		 * @protected
		 */
		_addPreserve: function () {
			this._preserve = (this._preserve || []).concat(Array.prototype.slice.call(arguments));
		},
		
		/**
		 * Initializes an exposed record
		 * @method _initNew
		 * @private
		 */
		_initNew: function () {
			this._values = {};
			this._loadedValues = {};
			this._isNew = true;
			this._isModified = false;
		},
		/**
		 * Adds a new record at the index position given or at the end.
		 * The new record becomes the current.
		 * @method add
		 * @param values {Object|Array} set of values to set. 
		 * If it is an array, it will call itself for each of the items in it.
		 * @param [index] {Integer} position to add the values at or at the end if not provided.  
		 * @chainable
		 */
		add: function(values, index) {
			var self = this;
			if (Lang.isArray(values)) {
				YArray.each(values, function (value, i) {
					self.add(value, (index?index + i:undefined));
				});
				return self;
			}
			if (self.get(IS_MODIFIED) || !self.get(IS_NEW)) {
				self._shelve();
			}
			if (index === undefined) {
				index = self._shelves.length;
			}
			self._shelves.splice(index, 0, {});
			self._currentIndex = index;
			self._initNew();
			self.setValues(values, ADD);
			return self;
		},
		/**
		 * Executes the given function for each record in the set.
		 * The function will run in the scope of the model so it can use 
		 * `this.{{#crossLink "Y.GalleryModel/getValue"}}{{/crossLink}}()`
		 * or any such method to access the values of the current record.
		 * Returning exactly `false` from the function spares shelving the record.
		 * If the callback function does not modify the record, 
		 * returning `false` will improve performance.
		 * @method each
		 * @param fn {function} function to execute, it will be provided with:
		 * @param fn.index {integer} index of the record exposed
		 * @chainable
		 */
		each: function(fn) {
			var self = this;
			self._shelve();
			YArray.each(self._shelves, function (shelf, index) {
				self._currentIndex = index;
				self._fetch(index);
				if (fn.call(self, index) !== false) {
					self._shelve(index);
				}
			});
			return self;
		},
		/**
		 * Executes the given function for each record in the set.
		 * The function will run in the scope of the model so it can use 
		 * `this.{{#crossLink "Y.GalleryModel/getValue"}}{{/crossLink}}`
		 * or any such method to access the values of the current record.
		 * It is faster than using {{#crossLink "Y.GalleryModelMultiRecord/each"}}{{/crossLink}} 
		 * and then checking the {{#crossLink "Y.GalleryModel/isModified:attribute"}}{{/crossLink}} attribute
		 * Returning exactly `false` from the function spares shelving the record.
		 * If the callback function does not modify the record, 
		 * returning `false` will improve performance.
		 * @method eachModified
		 * @param fn {function} function to execute, it will be provided with:
		 * @param fn.index {integer} index of the record exposed
		 * @chainable
		 */
		eachModified:function(fn) {
			var self = this;
			self._shelve();
			YArray.each(self._shelves,  function (shelf, index) {
				if (self._shelves[index][IS_MODIFIED]) {
					self._currentIndex = index;
					self._fetch(index);
					if (fn.call(self, index) !== false) {
						self._shelve(index);
					}
				}
			});
			return self;
		},
		/**
		 * Calls {{#crossLink "Y.GalleryModel/save"}}{{/crossLink}} on each record modified.
		 * This is not the best saving strategy for saving batches of records,
		 * but it is the easiest and safest.  Implementors are encouraged to 
		 * design their own.
		 * @method saveAllModified
		 * @chainable
		 */
		saveAllModified: function () {
			this.eachModified(this.save);
			return this;
		},
		/**
		 * This is a documentation entry only, this method does not define `load`. 
		 * This extension redefines the default action for the {{#crossLink "Y.GalleryModel/loaded:event"}}{{/crossLink}} event so 
		 * that if a load returns an array of records, they will be added to the shelves. 
		 * Existing records are kept, call {{#crossLink "Y.GalleryModelMultiRecord/empty"}}{{/crossLink}} if they should be discarded. 
		 * See method {{#crossLink "Y.GalleryModel/load"}}{{/crossLink}} of {{#crossLink "Y.GalleryModel"}}{{/crossLink}} for further info.
		 * @method load
		 */ 
		/**
		 * Default action for the loaded event, checks if the parsed response is an array
		 * and saves it into the shelves, otherwise it calls the default loader for single records.
		 * @method _defDataLoaded
		 * @param ev {EventFacade} facade produced by load.
		 * @private
		 */
		_defDataLoaded: function (ev) {
			var self = this,
				shelves = self._shelves;
			if (Lang.isArray(ev.parsed)) {
				if (shelves.length && (self.get(IS_MODIFIED) || !self.get(IS_NEW))) {
					self._shelve();
				}
				YArray.each(ev.parsed, function (values) {
					shelves.push({
						_values: values,
						_loadedValues: Y.clone(values),
						isNew: false,
						isModified:false
					});
				});
				self._fetch();
				if (self._sort) {
					self._sort();
				}
				ev.callback.call(self,null, ev.response);
			} else {
				Y.GalleryModel.prototype._defDataLoaded.apply(self, arguments);
			}
			
		},
		/**
		 * Returns the number of records stored, skipping over empty slots.
		 * @method size
		 * @return {Integer} number of records in the shelves
		 */
		size: function() {
			var count = 0;
			YArray.each(this._shelves, function () {
				count +=1;
			});
			return count;
		},
		/**
		 * Empties the shelves of any records as well as the exposed record
		 * @method empty
		 * @chainable
		 */
		empty: function () {
			this._shelves = [];
			this._currentIndex = 0;
			this.reset();
			return this;
		},
		/**
		 * Setter for the {{#crossLink "Y.GalleryModelMultiRecord/index:attribute"}}{{/crossLink}} attribute.
		 * Validates and copies the current index value into {{#crossLink "Y.GalleryModel/_currentIndex"}}{{/crossLink}}.
		 * It shelves the current record and fetches the requested one. 
		 * @method _indexSetter
		 * @param value {integer} new value for the index
		 * @return {integer|INVALID_VALUE} new value for the index or INVALID_VALUE if invalid.
		 * @private
		 */
		_indexSetter: function (value) {
			if (Lang.isNumber(value) && value >= 0 && value < this._shelves.length) {
				this._shelve(this._currentIndex);
				this._currentIndex = value = parseInt(value,10);
				this._fetch(value);
				return value;
			}
			return Y.Attribute.INVALID_VALUE;
		},
		/**
		 * Getter for the {{#crossLink "Y.GalleryModelMultiRecord/index:attribute"}}{{/crossLink}} attribute
		 * Returns the value from {{#crossLink "Y.GalleryModelMultiRecord/_currentIndex"}}{{/crossLink}}
		 * @method _indexGetter
		 * @return {integer} value of the index
		 * @private
		 */
		_indexGetter: function () {
			return this._currentIndex;
		},
		/**
		 * Getter for the {{#crossLink "Y.GalleryModel/isNew:attribute"}}{{/crossLink}} attribute used only for GalleryModelMultiRecord
		 * so that it is read from the shelf and not from the actual attribute, 
		 * which is expensive to shelve
		 * @method _isNewGetter
		 * @param value {Boolean} value stored in the attribute, it is ignored.
		 * @param name {String} name of the attribute.  
		 *		If it contains a dot, the original getter is called.
		 * @return {Boolean} state of the attribute
		 * @private
		 */
		_isNewGetter: function (value, name) {
			if (name.split(DOT).length > 1) {
				return Y.GalleryModel.prototype._isNewGetter.apply(this, arguments);
			}
			return this._isNew;
			
		},
		/**
		 * Setter for the {{#crossLink "Y.GalleryModel/isNew:attribute"}}{{/crossLink}} attribute used only for GalleryModelMultiRecord
		 * so that it is written into the shelf and not into the actual attribute, 
		 * which is expensive to shelve
		 * @method _isNewSetter
		 * @param value {Boolean} value stored in the attribute.
		 * @return {Boolean} the same value as received.
		 * @private
		 */
		_isNewSetter: function (value) {
			return (this._isNew = value);
		},
		/**
		 * Getter for the {{#crossLink "Y.GalleryModel/isModified:attribute"}}{{/crossLink}} attribute used only for GalleryModelMultiRecord
		 * so that it is read from the shelf and not from the actual attribute, 
		 * which is expensive to shelve
		 * @method _isModifiedGetter
		 * @param value {Boolean} value stored in the attribute, it is ignored.
		 * @param name {String} name of the attribute.  
		 *		If it contains a dot, the original getter is called.
		 * @return {Boolean} state of the attribute
		 * @private
		 */
		_isModifiedGetter:  function (value, name) {
			if (name.split(DOT).length > 1) {
				return Y.GalleryModel.prototype._isModifiedGetter.apply(this, arguments);
			}
			return this._isModified;
			
		},
		/**
		 * Setter for the {{#crossLink "Y.GalleryModel/isModified:attribute"}}{{/crossLink}} attribute used only for GalleryModelMultiRecord
		 * so that it is written into the shelf and not into the actual attribute, 
		 * which is expensive to shelve
		 * @method _isModifiedSetter
		 * @param value {Boolean} value stored in the attribute.
		 * @return {Boolean} the same value as received.
		 * @private
		 */
		_isModifiedSetter:  function (value) {
			return (this._isModified = value);
		}
			
		
	};
	
	MR.ATTRS = {
		/**
		 * Index of the record exposed.
		 * @attribute index
		 * @type Integer
		 * @default 0
		 */
		index: {
			value: 0,
			setter:'_indexSetter',
			getter:'_indexGetter'
		},
		/**
		 * Merges the new setter into the existing {{#crossLink "Y.GalleryModel/isNew:attribute"}}{{/crossLink}} attribute
		 * @attribute isNew
		 */
		isNew: {
			setter:'_isNewSetter'
		},
		/**
		 * Merges the new setter into the existing {{#crossLink "Y.GalleryModel/isModified:attribute"}}{{/crossLink}} attribute.
		 * @attribute isModified
		 */
		isModified: {
			setter: '_isModifiedSetter'
		}
	};
	
	Y.GalleryModelMultiRecord = MR;
	
	/**
	 * Extension to sort records stored in {{#crossLink "Y.GalleryModel"}}{{/crossLink}}, extended with {{#crossLink "Y.GalleryModelMultiRecord"}}{{/crossLink}}
	 * It is incompatible with {{#crossLink "Y.GalleryModelPrimaryKeyIndex"}}{{/crossLink}}
	 * @class Y.GalleryModelSortedMultiRecord
	 */
	var SFIELD = 'sortField',
		SDIR = 'sortDir',
		ASC = 'asc',
		DESC = 'desc',
		SMR = function () {};
	
	SMR.prototype = {
		/**
		 * Compare function used in sorting.
		 * @method _compare
		 * @param a {object} shelf to compare
		 * @param b {object} shelf to compare
		 * @return {integer} -1, 0 or 1 as required by Array.sort
		 * @private
		 */
		_compare: null,
		/**
		 * Initializer lifecycle method.  
		 * Ensures proper defaults, sets the compare method and
		 * sets listeners for relevant events
		 * @method initializer
		 * @protected
		 */
		initializer: function () {
			if (this.get(SFIELD) === undefined) {
				this._set(SFIELD, this.get('primaryKeys')[0]);
			}
			this._setCompare();
			this.after([SFIELD + CHANGE, SDIR + CHANGE], this._sort);
			this.after(EVT_CHANGE, this._afterChange);
		},
		/**
		 * Sets the compare function to be used in sorting the records
		 * based on the {{#crossLink "Y.GalleryModelSortedMultiRecord/sortField:attribute"}}{{/crossLink}} 
		 * and {{#crossLink "Y.GalleryModelSortedMultiRecord/sortDir:attribute"}}{{/crossLink}} 
		 * attributes and stores it into this._compare
		 * @method _setCompare
		 * @private
		 */
		_setCompare: function () {
			var sortField = this.get(SFIELD),
				sortAsc = this.get(SDIR) === ASC?1:-1,
				compareValue = (Lang.isFunction(sortField)?
					sortField:
					function(values) {
						return values[sortField];
					}
				);
			this._compare = function(a, b) {
				var aValue = compareValue(a._values),
					bValue = compareValue(b._values);

				return (aValue < bValue ? -1 : (aValue > bValue ? 1 : 0)) * sortAsc;
			};
		},
		/**
		 * Sorts the shelves whenever the 
		 * {{#crossLink "Y.GalleryModelSortedMultiRecord/sortField:attribute"}}{{/crossLink}} 
		 * or {{#crossLink "Y.GalleryModelSortedMultiRecord/sortDir:attribute"}}{{/crossLink}} 
		 * attributes change.
		 * @method _sort
		 * @private
		 */
		_sort: function() {
			this._setCompare();
			this._shelve();
			this._shelves.sort(this._compare);
			this._shelves.splice(this.size());
			this._fetch(0);
		},
		/**
		 * Listens to value changes and if the name of the field is that of the 
		 * {{#crossLink "Y.GalleryModelSortedMultiRecord/sortField:attribute"}}{{/crossLink}} attribute 
		 * or if {{#crossLink "Y.GalleryModelSortedMultiRecord/sortField:attribute"}}{{/crossLink}} 
		 * is a function, it will relocate the record to its proper sort order
		 * @method _afterChange
		 * @param ev {EventFacade} Event façade as produced by the {{#crossLink "Y.GalleryModel/change:event"}}{{/crossLink}}  event
		 * @private
		 */
		_afterChange: function (ev) {
			var fieldName = ev.name,
				sField = this.get(SFIELD),
				index,
				currentIndex = this._currentIndex,
				shelves = this._shelves,
				currentShelf;

			if (fieldName && ev.src !== ADD && (Lang.isFunction(sField) || fieldName === sField)) {
				// The shelf has to be emptied otherwise _findIndex may match itself.
				currentShelf = shelves.splice(currentIndex,1)[0];
				index = this._findIndex(currentShelf._values);
				shelves.splice(index,0,currentShelf);
				this._currentIndex = index;
			}
		},
		/**
		 * Finds the correct index position of a record within the shelves
		 * according to the current 
		 * {{#crossLink "Y.GalleryModelSortedMultiRecord/sortField:attribute"}}{{/crossLink}} 
		 * or {{#crossLink "Y.GalleryModelSortedMultiRecord/sortDir:attribute"}}{{/crossLink}} 
		 * attributes
		 * @method _findIndex
		 * @param values {Object} values of the record to be located
		 * @return {Integer} location for the record
		 * @private
		 */
		_findIndex: function (values) {
			var shelves = this._shelves,
				low = 0, 
				high = shelves.length, 
				index = 0,
				cmp = this._compare,
				vals = {_values: values};
				
			while (low < high) {
				index = Math.floor((high + low) / 2);
				switch(cmp(vals, shelves[index])) {
					case 1:
						low = index + 1;
						break;
					case -1:
						high = index;
						break;
					default:
						low = high = index;
				}
				
			}
			return low;
			
		},
		/**
		 * Adds a new record at its proper position according to the sort configuration.
		 * It overrides  
		 * {{#crossLink "Y.GalleryModelMultiRecord"}}{{/crossLink}}'s own
		 * {{#crossLink "Y.GalleryModelMultiRecord/add"}}{{/crossLink}} 
		 * method, ignoring the index position requested, if any.
		 * The new record becomes the current.
		 * @method add
		 * @param values {Object|Array} set of values to set. 
		 * If it is an array, it will call itself for each of the items in it.
		 * @chainable
		 */
		add: function(values) {
			if (Lang.isArray(values)) {
				YArray.each(values, this.add, this);
				return this;
			}
			var shelves = this._shelves,
				index = 0;
				
			index = this._findIndex(values);
			this._currentIndex = index;
			shelves.splice(index, 0, {});
			this._initNew();
			this.setValues(values, ADD);
			this._shelve(index);
			return this;
		},
		/**
		 * Locates a record by value.  The record will be located by the field
		 * given in the {{#crossLink "Y.GalleryModelSortedMultiRecord/sortField:attribute"}}{{/crossLink}}
		 *  attribute.   It will return the index of the
		 * record in the shelves or `null` if not found.
		 * By default it will expose that record.
		 * If {{#crossLink "Y.GalleryModelSortedMultiRecord/sortField:attribute"}}{{/crossLink}} 
		 * contains a function, it will return `null` and do nothing.
		 * Since sort fields need not be unique, find may return any of the records
		 * with the same value for that field.
		 * @method find
		 * @param value {Any} value to be found
		 * @param [move] {Boolean} exposes the record found, defaults to `true`
		 * @return {integer | null} index of the record found or `null` if not found.
		 * Be sure to differentiate a return of `0`, a valid index, from `null`, a failed search.
		 */
		find: function (value, move) {
			var sfield = this.get(SFIELD),
				index,
				values = {};
			if (Lang.isFunction(sfield)) {
				return null;
			}
			values[sfield] = value;
			index = this._findIndex(values);
			if (this._shelves[index]._values[sfield] !== value) {
				return null;
			}
			if (move || arguments.length < 2) {
				this.set(INDEX, index);
			}
			return index;
		}
	};
	SMR.ATTRS = {
		/**
		 * Name of the field to sort by or function to build the value used for comparisson.
		 * If a function, it will receive a reference to the record to be sorted;
		 * it should return the value to be used for comparisson.  Functions are
		 * used when sorting on multiple keys, which the function should return
		 * concatenated, or when any of the fields needs some pre-processing.
		 * @attribute sortField
		 * @type String | Function
		 * @default first primary key field
		 */
		sortField: {
			validator: function (value){
				return Lang.isString(value) || Lang.isFunction(value);
			}
		},
		/**
		 * Sort direction either `"asc"` for ascending or `"desc"` for descending
		 * @attribute sortDir
		 * @type String
		 * @default "asc"
		 */
		sortDir: {
			validator: function (value) {
				return value === DESC || value === ASC;
			},
			value: ASC
		}
	};
	Y.GalleryModelSortedMultiRecord = SMR;
	
	/**
	 * Extension to store the records in the GalleryModel using the field in the 
	 * {{#crossLink "Y.GalleryModel/primaryKeys:attribute"}}{{/crossLink}} attribute as its index.
	 * The primary key __must__ be a __single__ __unique__ __integer__ field.
	 * It should be used along {{#crossLink "Y.GalleryModelMultiRecord"}}{{/crossLink}}.
	 * It is incompatible with {{#crossLink "Y.GalleryModelSortedMultiRecord"}}{{/crossLink}}.
	 * @class Y.GalleryModelPrimaryKeyIndex
	 */
	var PKI = function () {};
	PKI.prototype = {
		/**
		 * Adds a new record at the index position given by its primary key.
		 * The new record becomes the current.
		 * @method add
		 * @param values {Object|Array} set of values to set. 
		 * If it is an array, it will call itself for each of the items in it.
		 * @chainable
		 */
		add: function(values) {
			if (Lang.isArray(values)) {
				YArray.each(values, this.add, this);
				return this;
			}
			if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {
				this._shelve();
			}
			this._currentIndex = values[this._primaryKeys[0]];
			this._initNew();
			this.setValues(values, ADD);
			return this;
		},
		/**
		 * Default action for the {{#crossLink "Y.GalleryModel/loaded:event"}}{{/crossLink}} event, 
		 * checks if the parsed response is an array
		 * and saves it into the shelves using the value of the primary key field for its index.
		 * The model will be left positioned at the item with the lowest key value.
		 * If the primary key field has not been declared, items will not be loaded.
		 * If the primary key field is not unique, the duplicate will overwrite the previous.
		 * @method _defDataLoaded
		 * @param ev {EventFacade} facade produced by the {{#crossLink "Y.GalleryModel/loaded:event"}}{{/crossLink}} event, 
		 * @private
		 */
		_defDataLoaded: function (ev) {
			var self = this,
				shelves = self._shelves,
				pk = self._primaryKeys[0];
				
			if (Lang.isUndefined(pk)) {
				return;
			}	
			if (self.get(IS_MODIFIED) || !self.get(IS_NEW)) {
				self._shelve();
			}
			YArray.each(new YArray(ev.parsed), function (values) {
				shelves[values[pk]] = {
					_values: values,
					_loadedValues: Y.clone(values),
					isNew: false,
					isModified:false
				};
			});
			YArray.some(shelves, function (shelf, index) {
				self._fetch(index);
				return true;
			});
			ev.callback.call(self,null, ev.response);
		
		},
		/**
		 * Sugar method added because items might not be contiguous so 
		 * adding one to the index does not always get you to the next item.
		 * If there is no next element, `null` will be returned and the
		 * collection will still point to the last item.
		 * @method next
		 * @return {integer} index of the next item or `null` if none found
		 */
		next: function () {
			if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {
				this._shelve();
			}
			var shelves = this._shelves,
				index = this._currentIndex + 1, 
				l = shelves.length;
			while (index < l && !shelves.hasOwnProperty(index)) {
				index +=1;
			}
			if (index === l) {
				return null;
			}
			this._fetch(index);
			return index;
		},
		/**
		 * Sugar method added because items might not be contiguous so 
		 * subtracting one to the index does not always get you to the previous item.
		 * If there is no next element, `null` will be returned and the
		 * collection will still point to the first item.
		 * @method previous
		 * @return {integer} index of the previous item or `null` if none found
		 */
		previous: function () {
			if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {
				this._shelve();
			}
			var shelves = this._shelves,
				index = this._currentIndex - 1;
			while (index >= 0 && !shelves.hasOwnProperty(index)) {
				index -=1;
			}
			if (index === -1) {
				return null;
			}
			this._fetch(index);
			return index;
		}
		
	};
	Y.GalleryModelPrimaryKeyIndex = PKI;



}, 'gallery-2012.09.05-20-01' ,{requires:['base'], skinnable:false});
