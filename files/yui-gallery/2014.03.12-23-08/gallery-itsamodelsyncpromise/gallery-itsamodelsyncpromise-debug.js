YUI.add('gallery-itsamodelsyncpromise', function (Y, NAME) {

'use strict';

/*jshint maxlen:205 */

/**
 *
 * This module extends Y.Model by introducing Promised sync-methods. It also transforms Y.Model's sync-events into true events with a defaultFunc which can be prevented.
 * This means the 'on'-events will be fired before syncing and the 'after'-events after syncing.
 *
 * @module gallery-itsamodelsyncpromise
 * @class Y.Model
 * @constructor
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://itsasbreuk.nl</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

var YModel = Y.Model,
    Lang = Y.Lang,
    YObject = Y.Object,
    YArray = Y.Array,
    DESTROY = 'destroy',
    LOAD = 'load',
    SAVE = 'save',
    SUBMIT = 'submit',
    ERROR = 'error',
    DELETE = 'delete',
    READ = 'read',
    DESTROYED = DESTROY+'ed',
    PUBLISHED = '_pub_',
    ROMISE = 'romise',
    PROMISE = 'P'+ROMISE,
    AVAILABLESYNCMESSAGES = {
        load: true,
        save: true,
        submit: true,
        destroy: true
    },
    MODELSYNC = 'modelsync',
    GALLERY_ITSA = 'gallery-itsa',
    GALLERYITSAMODELSYNCPROMISE = GALLERY_ITSA+MODELSYNC+'p'+ROMISE,
/**
 * Fired when an error occurs, such as when an attribute (or property) doesn't validate or when
 * the sync layer submit-function returns an error.
 * @event error
 * @param e {EventFacade} Event Facade including:
 * @param e.error {any} Error message.
 * @param e.src {String} Source of the error. May be one of the following (or any
 *                     custom error source defined by a Model subclass):
 *
 * `submit`: An error submitting the model from within a sync layer.
 *
 * `attributevalidation`: An error validating an attribute (or property). The attribute (or objectproperty)
 *                        that failed validation will be provided as the `attribute` property on the event facade.
 *
 * @param e.attribute {String} The attribute/property that failed validation.
 * @param e.validationerror {String} The errormessage in case of attribute-validation error.
**/

/**
 * Fired when model is destroyed. In case {remove: true} is used, the after-event occurs after the synlayer is finished.
 * @event destroy
 * @param e {EventFacade} Event Facade including:
 * @param e.promise {Promise} The promise that is automaticly created during the event. You could examine this instead of listening to both the `after`- and `error`-event.
 * @param [e.options] {Object} The options=object that was passed to the sync-layer, if there was one.
statusmessage
 * @since 0.1
**/

/**
 * Fired when model needs to be read from the sync layer. The after-event occurs after the synlayer is finished.
 * @event load
 * @param e {EventFacade} Event Facade including:
 * @param e.promise {Promise} The promise that is automaticly created during the event. You could examine this instead of listening to both the `after`- and `error`-event.
 * @param [e.options] {Object} The options=object that was passed to the sync-layer, if there was one.
 * @param [e.response] {any} The sync layer's raw, unparsed response to the submit-request, if there was one.
 *                            This value is only available in the after-event.
 * @since 0.1
**/

/**
 * Fired when model needs to be saved through the sync layer. The after-event occurs after the synlayer is finished.
 * @event save
 * @param e {EventFacade} Event Facade including:
 * @param e.promise {Promise} The promise that is automaticly created during the event. You could examine this instead of listening to both the `after`- and `error`-event.
 * @param [e.options] {Object} The options=object that was passed to the sync-layer, if there was one.
 * @param [e.parsed] {Object} The parsed version of the sync layer's response to the save-request, if there was a response.
 *                            This value is only available in the after-event.
 * @param [e.response] {any} The sync layer's raw, unparsed response to the save-request, if there was one.
 *                            This value is only available in the after-event.
 * @since 0.1
**/

PARSED = function (response) {
    if (typeof response === 'string') {
        try {
            return Y.JSON.fullparse(response);
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
};

// -- Mixing extra Methods to Y.Model -----------------------------------

/**
 * Makes sync-messages to target the specified messageViewer. You can only target to 1 MessageViewer at the same time.<br>
 * See gallery-itsamessageviewer for more info.
 *
 * @method addMessageTarget
 * @param itsamessageviewer {Y.ITSAMessageViewer|Y.ITSAPanel}
 * @since 0.1
*/
YModel.prototype.addMessageTarget = function(itsamessageviewer) {
    Y.log('addMessageTarget', 'info', 'ITSA-ModelSyncPromise');
    var instance = this;
    Y.usePromise(GALLERY_ITSA+'messagecontroller', GALLERY_ITSA+'messageviewer', GALLERY_ITSA+'panel', GALLERY_ITSA+'viewmodel').then(
        function() {
            return Y.ITSAMessageController.isReady();
        }
    ).then(
        function() {
/*jshint expr:true */
            (itsamessageviewer instanceof Y.ITSAPanel) && (itsamessageviewer=itsamessageviewer._itsastatusbar);
            itsamessageviewer || ((itsamessageviewer instanceof Y.ITSAViewModel) && (itsamessageviewer=itsamessageviewer._itsastatusbar));
/*jshint expr:false */
            if (itsamessageviewer instanceof Y.ITSAMessageViewer) {
/*jshint expr:true */
                instance._itsamessageListener && instance.removeMessageTarget();
/*jshint expr:false */
                instance._itsamessageListener = instance.on(
                    [LOAD, SUBMIT, SAVE, DESTROY],
                    function(e) {
                        var options = e.options,
                            remove = options.remove || options[DELETE],
                            type = e.type,
                            typesplit = type.split(':'),
                            subtype = typesplit[1] || typesplit[0],
                            statushandle, syncMessages;
                        if ((subtype!==DESTROY) || remove) {
                            syncMessages = instance._defSyncMessages;
                            statushandle = itsamessageviewer.showStatus(
                                               e.syncmessage || (syncMessages && syncMessages[subtype]) || Y.Intl.get(GALLERYITSAMODELSYNCPROMISE)[subtype],
                                               {source: MODELSYNC, busy: true}
                                           );
                            e.promise.then(
                                function() {
                                    itsamessageviewer.removeStatus(statushandle);
                                },
                                function() {
                                    itsamessageviewer.removeStatus(statushandle);
                                }
                            );
                        }
                    }
                );
                instance._itsamessagedestroylistener1 = instance.onceAfter(DESTROY, function() {
                    instance._itsamessageListener.detach();
                });
                instance._itsamessagedestroylistener2 = itsamessageviewer.once(DESTROY, function() {
                    instance._itsamessageListener.detach();
                });
            }
            else {
                Y.log('Y.Model.addMessageTarget() is targetted to an invalid Y.ITSAMessageViewer', 'warn', 'ModelSyncPromise');
            }
        }
    );
};

/**
 * Promise that returns the default-options (object) that will be passed through the synclayer.
 * Is used as the syncoptions, along with manual syncoptions that could be supplied. Both objects are merged (actually cloned).
 *
 * @method defSyncOptions
 * @return {Y.Promise} --> resolve(defaultOptionsObject) NEVER reject
**/
YModel.prototype.defSyncOptions = function() {
    Y.log('defSyncOptions', 'info', 'ITSA-ModelSyncPromise');
    return new Y.Promise(function (resolve) {
        resolve({});
    });
};

/**
  * Destroys this model instance and removes it from its containing lists, if any. The 'callback', if one is provided,
  * will be called after the model is destroyed.<br /><br />
  * If `options.remove` is `true`, then this method delegates to the `sync()` method to delete the model from the persistence layer, which is an
  * asynchronous action. In this case, the 'callback' (if provided) will be called after the sync layer indicates success or failure of the delete operation.
  * <br /><br />
  * To keep track of the proccess, it is preferable to use <b>destroyPromise()</b>.<br />
  * This method will fire an `error` event when syncing (using options.remove=true) should fail.
  * <br /><br />
  * <b>CAUTION</b> The sync-method with action 'destroy' <b>must call its callback-function</b> in order to work as espected!
  *
  * @method destroy
  * @param {Object} [options] Sync options. It's up to the custom sync implementation to determine what options it supports or requires, if any.
  *   @param {Boolean} [options.remove=false] If `true`, the model will be deleted via the sync layer in addition to the instance being destroyed.
  *   @param {String} [options.syncmessage] Message that should appear on a Y.ITSAMessageViewer during asynchronious destruction. Will overrule the default message. See gallery-itsamessageviewer.
  * @param {callback} [callback] Called after the model has been destroyed (and deleted via the sync layer if `options.remove` is `true`).
  *   @param {Error|null} callback.err If an error occurred, this parameter will contain the error. Otherwise 'err' will be null.
  *   @param {Any} callback.response The server's response. This value will be passed to the `parse()` method, which is expected to parse it and return an attribute hash.
  * @chainable
*/

/**
 * Destroys this model instance and removes it from its containing lists, if any.
 * <br /><br />
 * If `options.remove` is `true`, then this method delegates to the `sync()`
 * method to delete the model from the persistence layer, which is an
 * asynchronous action.
 * <br /><br />
  * This method will fire an `error` event when syncing (using options.remove=true) should fail.
 * <br /><br />
 * <b>CAUTION</b> The sync-method with action 'destroy' <b>must call its callback-function</b> in order to work as espected!
 *
 * @method destroyPromise
 * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
 *                 implementation to determine what options it supports or requires, if any.
 *   @param {Boolean} [options.remove=false] If `true`, the model will be deleted via the sync layer in addition to the instance being destroyed.
 *   @param {String} [options.syncmessage] Message that should appear on a Y.ITSAMessageViewer during asynchronious destruction. Will overrule the default message. See gallery-itsamessageviewer.
 * @return {Y.Promise} promised response --> resolve(response) OR reject(reason). (examine reason.message).
**/

/**
  * Loads this model from the server.<br />
  * This method delegates to the `sync()` method to perform the actual load
  * operation, which is an asynchronous action. Specify a 'callback' function to
  * be notified of success or failure.
  * <br /><br />
  * An unsuccessful load operation will fire an `error` event with the `src` value "load".
  * <br /><br />
  * If the load operation succeeds and one or more of the loaded attributes
  * differ from this model's current attributes, a `change` event will be fired.
  * <br /><br />
  * To keep track of the proccess, it is preferable to use <b>loadPromise()</b>.<br />
  * This method will fire 2 events: 'loadstart' before syncing and 'load' or ERROR after syncing.
  * <br /><br />
  * <b>CAUTION</b> The sync-method with action 'read' <b>must call its callback-function</b> in order to work as espected!
  *
  * @method load
  * @param {Object} [options] Options to be passed to `sync()` and to `set()` when setting the loaded attributes.
  *                           It's up to the custom sync implementation to determine what options it supports or requires, if any.
 *   @param {String} [options.syncmessage] Message that should appear on a Y.ITSAMessageViewer during asynchronious loading. Will overrule the default message. See gallery-itsamessageviewer.
  * @param {callback} [callback] Called when the sync operation finishes.
  *   @param {Error|null} callback.err If an error occurred, this parameter will contain the error. If the sync operation succeeded, 'err' will be null.
  *   @param {Any} callback.response The server's response. This value will be passed to the `parse()` method, which is expected to parse it and return an attribute hash.
  * @chainable
 */

/**
 * Loads this model from the server.
 * <br /><br />
 * This method delegates to the `sync()` method to perform the actual load
 * operation, which is an asynchronous action.
 * <br /><br />
 * An unsuccessful load operation will fire an `error` event with the `src` value "load".
 * <br /><br />
 * If the load operation succeeds and one or more of the loaded attributes
 * differ from this model's current attributes, a `change` event will be fired.
 * <br /><br />
 * <b>CAUTION</b> The sync-method with action 'read' <b>must call its callback-function</b> in order to work as espected!
 *
 * @method loadPromise
 * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
 *                 implementation to determine what options it supports or requires, if any.
 *   @param {String} [options.syncmessage] Message that should appear on a Y.ITSAMessageViewer during asynchronious loading. Will overrule the default message. See gallery-itsamessageviewer.
 * @return {Y.Promise} promised response --> resolve(response) where response is an object with all model-attributes as properties OR reject(reason) (examine reason.message).
**/

/**
 * Saves this model to the server.
 *
 * This method delegates to the `sync()` method to perform the actual save operation, which is an asynchronous action.
 * Specify a 'callback' function to be notified of success or failure, or better: use savePromise().
 * <br /><br />
 * An unsuccessful save operation will fire an `error` event with the `src` value "save".
 * <br /><br />
 * If the save operation succeeds and one or more of the attributes returned in the server's response differ from this model's current attributes,
 * a `change` event will be fired.
 * <br /><br />
 * If the operation succeeds, but you let the server return an <b>id=-1</b> then the model is assumed to be destroyed. This will lead to fireing the `destroy` event.
 * <br /><br />
 * To keep track of the process, it is preferable to use <b>savePromise()</b>.<br />
 * This method will fire 2 events: 'savestart' before syncing and 'save' or ERROR after syncing.
 * <br /><br />
 * <b>CAUTION</b> The sync-method with action 'save' <b>must call its callback-function</b> in order to work as espected!
 *
 * @method save
 * @param {Object} [options] Options to be passed to `sync()` and to `set()` when setting synced attributes.
 *                           It's up to the custom sync implementation to determine what options it supports or requires, if any.
 *   @param {String} [options.syncmessage] Message that should appear on a Y.ITSAMessageViewer during asynchronious saving. Will overrule the default message. See gallery-itsamessageviewer.
 * @param {Function} [callback] Called when the sync operation finishes.
 *   @param {Error|null} callback.err If an error occurred or validation failed, this parameter will contain the error.
 *                                    If the sync operation succeeded, 'err' will be null.
 *   @param {Any} callback.response The server's response. This value will be passed to the `parse()` method,
 *                                  which is expected to parse it and return an attribute hash.
 * @chainable
*/

/**
 * Saves this model to the server.
 * <br /><br />
 * This method delegates to the `sync()` method to perform the actual save
 * operation, which is an asynchronous action.
 * <br /><br />
 * An unsuccessful save operation will fire an `error` event with the `src` value "save".
 * <br /><br />
 * If the save operation succeeds and one or more of the attributes returned in
 * the server's response differ from this model's current attributes, a
 * `change` event will be fired.
 * <br /><br />
 * If the operation succeeds, but you let the server return an <b>id=-1</b> then the model is assumed to be destroyed. This will lead to fireing the `destroy` event.
 * <br /><br />
 * <b>CAUTION</b> The sync-method with action 'save' <b>must call its callback-function</b> in order to work as espected!
 *
 * @method savePromise
 * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
 *                 implementation to determine what options it supports or requires, if any.
 *   @param {String} [options.syncmessage] Message that should appear on a Y.ITSAMessageViewer during asynchronious saving. Will overrule the default message. See gallery-itsamessageviewer.
 * @return {Y.Promise} promised response --> resolve(response) OR reject(reason). (examine reason.message).
**/

YArray.each(
    [LOAD, DESTROY, SAVE],
    function(Fn) {
        YModel.prototype[Fn] = function(options, callback) {
            var instance = this,
                promise;

            Y.log(Fn, 'info', 'ITSA-ModelSyncPromise');
            // by overwriting the default 'save'-method we manage to fire 'destroystart'-event.
        /*jshint expr:true */
            (promise=instance[Fn+PROMISE](options)) && callback && promise.then(
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
        YModel.prototype[Fn+PROMISE] = function (options) {
            Y.log(Fn+PROMISE, 'info', 'ITSA-ModelSyncPromise');
            return this._createPromise(Fn, options);
        };
    }
);

//===============================================================================================
/**
 * This method can be defined in descendend classes.<br />
 * If syncPromise is defined, then the syncPromise() definition will be used instead of sync() definition.<br />
 * In case an invalid 'action' is defined, the promise will be rejected.
 *
 * @method syncPromise
 * @param action {String} The sync-action to perform.
 * @param [options] {Object} Sync options. The custom synclayer should pass through all options-properties to the server.
 * @return {Y.Promise} returned response for each 'action' --> response --> resolve(dataobject) OR reject(reason).
 * The returned 'dataobject' might be an object or a string that can be turned into a json-object
*/
//===============================================================================================

/**
 * Removes the messageViewer-target that was set up by addMessageTarget().
 *
 * @method removeMessageTarget
 * @since 0.1
*/
YModel.prototype.removeMessageTarget = function() {
    Y.log('removeMessageTarget', 'info', 'ITSA-ModelSyncPromise');
    var instance = this;
/*jshint expr:true */
    instance._itsamessageListener && instance._itsamessageListener.detach();
    instance._itsamessagedestroylistener1 && instance._itsamessagedestroylistener1.detach();
    instance._itsamessagedestroylistener2 && instance._itsamessagedestroylistener2.detach();
/*jshint expr:false */
    instance._itsamessageListener = null;
};

/**
 * Defines the syncmessage to be used when calling the synclayer. When not defined (and not declared during calling the syncmethod by 'options.syncmessage'),
 * a default i18n-message will be used.
 * See gallery-itsamessageviewer for more info about syncmessages.
 *
 * @method setSyncMessage
 * @param type {String} the syncaction = 'load'|'save'|destroy'|'submit'
 * @param message {String} the syncmessage that should be viewed by a Y.ITSAMessageViewer
 * @chainable
 * @since 0.4
*/
YModel.prototype.setSyncMessage = function(type, message) {
    Y.log('setSyncMessage', 'info', 'ITSA-ModelSyncPromise');
    var instance = this;
/*jshint expr:true */
    instance._defSyncMessages || (instance._defSyncMessages={});
    AVAILABLESYNCMESSAGES[type] && (instance._defSyncMessages[type]=message);
/*jshint expr:false */
    return instance;
};

/**
 * Private function that creates the promises for all promise-events
 *
 * @method _createPromise
 * @param type {String} Method to create a promise for
 * @param options {Object} options to be send with the event
 * @private
 * @since 0.3
*/
YModel.prototype._createPromise = function(type, options) {
    var instance = this,
        promise, promiseResolve, promiseReject, extraOptions;

    Y.log('_createPromise', 'info', 'ITSA-ModelSyncPromise');
    promise = new Y.Promise(function (resolve, reject) {
        promiseResolve = resolve;
        promiseReject = reject;
    });
    // we pass the promise, together with the resolve and reject handlers as an option to the event.
    // this way we can fullfill the promise in the defaultFn or prevDefaultFn.
    extraOptions = {
        promise: promise,
        promiseResolve: promiseResolve,
        promiseReject: promiseReject,
        response: '', // making available at the after listener
        parsed: {}, // making available at the after listener
        options: Y.merge(options) // making passing only options to other events possible
    };
/*jshint expr:true */
    Lang.isObject(options) && YObject.each(
        options,
        function(value, key) {
            extraOptions[key] = value;
        }
    );
    // lazy publish the event
    instance[PUBLISHED+type] || (instance[PUBLISHED+type]=instance._publishAsync(type,
                                                                                {
                                                                                  defaultTargetOnly: true,
                                                                                  emitFacade: true,
                                                                                  broadcast: 1,
                                                                                  defaultFn: instance['_defFn_'+type],
                                                                                  preventedFn: instance._prevDefFn
                                                                                }
                                                                               ));
/*jshint expr:false */
    instance.fire(type, extraOptions);
    return promise;
};

/**
 * DefaultFn for the 'destroy'-event
 *
 * @method _defFn_destroy
 * @param e {EventTarget}
 * @param e.promise {Y.Promise} promise passed by with the eventobject
 * @param e.promiseReject {Function} handle to the reject-method
 * @param e.promiseResolve {Function} handle to the resolve-method
 * @private
 * @return {Y.Promise} do not handle yourself: is handled by internal eventsystem.
 * @since 0.3
*/
YModel.prototype._defFn_destroy = function(e) {
    var instance = this,
        promiseResolve = e.promiseResolve,
        promiseReject = e.promiseReject,
        options = e.options,
        remove = options.remove || options[DELETE],
        errFunc, successFunc, finish;

    Y.log('_defFn_destroy', 'info', 'ITSA-ModelSyncPromise');
    if (instance.get(DESTROYED)) {
        promiseReject(new Error('Model is already destroyed'));
    }
    else {
        finish = function() {
            // first the destruction through Base needs to be done
            instance._baseDestroy();
            YArray.each(instance.lists.concat(), function (list) {
                list.remove(instance, options);
            });
        };
        // next the typical Model-destroy-code:
        if (remove) {
            errFunc = function(err) {
                var facade = {
                    error   : err,
                    src     : DESTROY,
                    options : options
                };
                instance._lazyFireErrorEvent(facade);
                promiseReject(new Error(err));
            };
            successFunc = function(response) {
                finish();
                promiseResolve(response);
            };
            if (instance.syncPromise) {
                // use the syncPromise-layer
                instance._syncTimeoutPromise(DELETE, options).then(
                    successFunc,
                    errFunc
                );
            }
            else {
                instance.sync(DELETE, options, function (err, response) {
                    if (err) {
                        errFunc(err);
                    }
                    else {
                        successFunc(response);
                    }
                });
            }
        } else {
            finish();
            promiseResolve();
        }
    }
    return e.promise;
};

/**
 * DefaultFn for the 'load'-event
 *
 * @method _defFn_load
 * @param e {EventTarget}
 * @param e.promise {Y.Promise} promise passed by with the eventobject
 * @param e.promiseReject {Function} handle to the reject-method
 * @param e.promiseResolve {Function} handle to the resolve-method
 * @private
 * @return {Y.Promise} do not handle yourself: is handled by internal eventsystem.
 * @since 0.3
*/
YModel.prototype._defFn_load = function(e) {
    var instance = this,
        options = e.options,
        errFunc, successFunc;

    Y.log('_defFn_load', 'info', 'ITSA-ModelSyncPromise');
    errFunc = function(err) {
        var facade = {
            options: options,
            error: err,
            src: LOAD
        };
        instance._lazyFireErrorEvent(facade);
        e.promiseReject(new Error(err));
    };
    successFunc = function(response) {
        var parsed;
        e.response = response;
        parsed = PARSED(response);
        if (parsed.responseText) {
            // XMLHttpRequest
            if (parsed.responseText) {
                // XMLHttpRequest
                parsed = PARSED(parsed.responseText);
            }
        }
        e.parsed = parsed;
        instance.setAttrs(parsed, options);
        instance.changed = {};
        e.promiseResolve(response);
    };
    if (instance.syncPromise) {
        // use the syncPromise-layer
        instance._syncTimeoutPromise(READ, options).then(
            successFunc,
            errFunc
        );
    }
    else {
        instance.sync(READ, options, function (err, response) {
            if (err) {
                errFunc(err);
            }
            else {
                successFunc(response);
            }
        });
    }
    return e.promise;
};

/**
 * DefaultFn for the 'save'-event
 *
 * @method _defFn_save
 * @param e {EventTarget}
 * @param e.promise {Y.Promise} promise passed by with the eventobject
 * @param e.promiseReject {Function} handle to the reject-method
 * @param e.promiseResolve {Function} handle to the resolve-method
 * @private
 * @return {Y.Promise} do not handle yourself: is handled by internal eventsystem.
 * @since 0.3
*/
YModel.prototype._defFn_save = function(e) {
    var instance = this,
        usedmethod = instance.isNew() ? 'create' : 'update',
        options = e.options,
        promiseReject = e.promiseReject,
        errFunc, successFunc, unvalidNodes,
        facade = {
            options : options,
            method: usedmethod
        };

    Y.log('_defFn_save', 'info', 'ITSA-ModelSyncPromise');
    if (!instance.isModified()) {
        promiseReject(new Error('Model will not be saved: not modified'));
    }
    else {
        instance._validate(instance.toJSON(), function (validateErr) {
            if (validateErr) {
                facade.error = validateErr;
                facade.src = SAVE;
                instance._lazyFireErrorEvent(facade);
                promiseReject(new Error(validateErr));
            }
            else {
                errFunc = function(err) {
                    facade.error = err;
                    facade.src   = SAVE;
                    instance._lazyFireErrorEvent(facade);
                    promiseReject(new Error(err));
                };
                successFunc = function(response) {
                    var parsed;
                    e.response = response;
                    parsed = PARSED(response);
                    if (parsed.responseText) {
                        // XMLHttpRequest
                        parsed = PARSED(parsed.responseText);
                    }
                    if (YObject.keys(parsed).length>0) {
                        e.parsed = parsed;
                        // if removed then fire destroy-event (not through synclayer), else update data
/*jshint expr:true */
                        // fromInternal is used to suppress Y.ITSAFormModel to notificate changes
                        (parsed.id===-1) ? instance.destroy() : instance.setAttrs(parsed, (options.fromInternal=true) && options);
/*jshint expr:false */
                    }
                    instance.changed = {};
                    e.promiseResolve(response);
                };
                // in case of Y.ITSAFormModel, we first check whether all fields are validated
                if (!instance.toJSONUI || ((unvalidNodes=instance.getUnvalidatedUI()) && unvalidNodes.isEmpty())) {
                    if (instance.syncPromise) {
                        // use the syncPromise-layer
                        instance._syncTimeoutPromise(usedmethod, options).then(
                            successFunc,
                            errFunc
                        );
                    }
                    else {
                        instance.sync(usedmethod, options, function (err, response) {
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
                    instance.fire('validationerror', {target: instance, nodelist: unvalidNodes, src: SAVE});
                }
            }
        });
    }
    return e.promise;
};

/**
 * Prevented defaultFn as a Promise. Makes internal e.promise to be rejected.
 *
 * @method _prevDefFn
 * @param e {EventTarget}
 * @param e.promise {Y.Promise} promise passed by with the eventobject
 * @param e.promiseReject {Function} handle to the reject-method
 * @param e.promiseResolve {Function} handle to the resolve-method
 * @private
 * @since 0.3
*/
YModel.prototype._prevDefFn = function(e) {
    Y.log('_prevDefFn', 'info', 'ITSA-ModelSyncPromise');
    e.promiseReject(new Error('preventDefaulted'));
};

 /**
   * Hack with the help of Luke Smith: https://gist.github.com/lsmith/6664382/d688740bb91f9ecfc3c89456a82f30d35c5095cb
   * Variant of publish(), but works with asynchronious defaultFn and preventedFn.
   *
   * Creates a new custom event of the specified type.  If a custom event
   * by that name already exists, it will not be re-created.  In either
   * case the custom event is returned.
   *
   * @method _publishAsync
   *
   * @param type {String} the type, or name of the event
   * @param opts {object} optional config params.  Valid properties are:
   *
   *  <ul>
   *    <li>
   *   'broadcast': whether or not the YUI instance and YUI global are notified when the event is fired (false)
   *    </li>
   *    <li>
   *   'bubbles': whether or not this event bubbles (true)
   *              Events can only bubble if emitFacade is true.
   *    </li>
   *    <li>
   *   'context': the default execution context for the listeners (this)
   *    </li>
   *    <li>
   *   'defaultFn': the default function to execute when this event fires if preventDefault was not called
   *    </li>
   *    <li>
   *   'emitFacade': whether or not this event emits a facade (false)
   *    </li>
   *    <li>
   *   'prefix': the prefix for this targets events, e.g., 'menu' in 'menu:click'
   *    </li>
   *    <li>
   *   'fireOnce': if an event is configured to fire once, new subscribers after
   *   the fire will be notified immediately.
   *    </li>
   *    <li>
   *   'async': fireOnce event listeners will fire synchronously if the event has already
   *    fired unless async is true.
   *    </li>
   *    <li>
   *   'preventable': whether or not preventDefault() has an effect (true)
   *    </li>
   *    <li>
   *   'preventedFn': a function that is executed when preventDefault is called
   *    </li>
   *    <li>
   *   'queuable': whether or not this event can be queued during bubbling (false)
   *    </li>
   *    <li>
   *   'silent': if silent is true, debug messages are not provided for this event.
   *    </li>
   *    <li>
   *   'stoppedFn': a function that is executed when stopPropagation is called
   *    </li>
   *
   *    <li>
   *   'monitored': specifies whether or not this event should send notifications about
   *   when the event has been attached, detached, or published.
   *    </li>
   *    <li>
   *   'type': the event type (valid option if not provided as the first parameter to publish)
   *    </li>
   *  </ul>
   *
   *  @return {CustomEvent} the custom event
   *  @private
   *
  **/
YModel.prototype._publishAsync = function(type, opts) {
    var instance = this,
        asyncEvent = instance.publish(type, opts);
    Y.log('_publishAsync', 'info', 'ITSA-ModelSyncPromise');

/*jshint expr:true */
    opts && (opts.broadcast===1) && instance.addTarget(Y);
    opts && (opts.broadcast===2) && instance.addTarget(YUI);
/*jshint expr:false */
    asyncEvent._firing = new Y.Promise(function (resolve) { resolve(); });

    asyncEvent.fire = function (data) {
        var args  = Y.Array(arguments, 0, true),
            stack, next;

        asyncEvent._firing = asyncEvent._firing.then(function () {
            stack = {
                id: asyncEvent.id,
                next: asyncEvent,
                silent: asyncEvent.silent,
                stopped: 0,
                prevented: 0,
                bubbling: null,
                type: asyncEvent.type,
                defaultTargetOnly: asyncEvent.defaultTargetOnly
            };
            asyncEvent.details = args;
            // Execute on() subscribers
            var subs = asyncEvent._subscribers,
                args2 = [],
                e, i, len;

                args2.push.apply(args2, data);
                e = asyncEvent._createFacade(args2);

            e.target = e.target || instance;
            if (subs) {
                for (i = 0, len = subs.length; i < len; ++i) {
                    try {
                        subs[i].fn.call(subs[i].context, e);
                    }
                    catch (catchErr) {
                        Y.log("Error in on subscriber: " + (catchErr && (catchErr.message || catchErr)), ERROR);
                    }
                }
            }
            // Execute on() subscribers for each bubble target and their respective targets:
            if (asyncEvent.bubbles && !asyncEvent.stopped) {
                instance.bubble(asyncEvent, args, null, stack);
                e.prevented = Math.max(e.prevented, stack.prevented);
            }
            // Resolve the _firing promise with either prefentedFn promise if it was prevented, or with a promise for
            // the result of the defaultFn followed by the execution of the after subs.
            return e.prevented ?
                asyncEvent.preventedFn.call(instance, e).then(null, function (reason) {
                    Y.log("Error in preventedFn: " + (reason && (reason.message || reason)), ERROR);
                    return false;
                }) :
                asyncEvent.defaultFn.call(instance, e).then(function () {
                    // no need to handle 'response' it is merged into 'e' within the defaultfunction
                    // Execute after() subscribers

                    subs = asyncEvent._afters;
                    if (subs) {
                        for (i = 0, len = subs.length; i < len; ++i) {
                            try {
                                subs[i].fn.call(subs[i].context, e);
                            }
                            catch (catchErr) {
                                Y.log("Error in after subscriber: " + (catchErr && (catchErr.message || catchErr)), ERROR);
                            }
                        }
                    }
                    // Execute after() subscribers for each bubble target and their respective targets:
                    if (stack.afterQueue) {
                        while ((next = stack.afterQueue.last())) {
                            next();
                        }
                    }

                // Catch errors/preventions and reset the promise state to fulfilled for
                // the next call to fire();
                }).then(null, function (reason) {
                    Y.log("Error in after subscriber: " + (reason && (reason.message || reason)), ERROR);
                    return false;
                });
        },
        function(reason) {
            var facade = {
                error   : (reason && (reason.message || reason)),
                src     : 'Model._publishAsync()'
            };
            Y.log("Error in _publishAsync: " + (reason && (reason.message || reason)), ERROR);
            instance._lazyFireErrorEvent(facade);
        });
    };

    asyncEvent._fire = function (args) {
        return asyncEvent.fire(args[0]);
    };
    return asyncEvent;
};

/**
 * Fires the ERROR-event and -if not published yet- publish it broadcasted to Y.
 * Because the error-event is broadcasted to Y, it can be catched by gallery-itsaerrorreporter.
 *
 * @method _lazyFireErrorEvent
 * @param {Object} [facade] eventfacade.
 * @private
**/
YModel.prototype._lazyFireErrorEvent = function(facade) {
    var instance = this;

    Y.log('_lazyFireErrorEvent', 'info', 'ITSA-ModelSyncPromise');
    // lazy publish
    if (!instance._errorEvent) {
        instance._errorEvent = instance.publish(ERROR, {
            broadcast: 1
        });
    }
    instance.fire(ERROR, facade);
};

/**
 * This method is used internally and returns syncPromise() that is called with 'action'.
 * If 'action' is not handled as a Promise -inside syncPromise- then this method will reject the promisi.
 *
 * @method _syncTimeoutPromise
 * @param action {String} The sync-action to perform.
 * @param [options] {Object} Sync options. The custom synclayer should pass through all options-properties to the server.
 * @return {Y.Promise} returned response for each 'action' --> response --> resolve(dataobject) OR reject(reason).
 * The returned 'dataobject' might be an object or a string that can be turned into a json-object
 * @private
 * @since 0.2
*/
YModel.prototype._syncTimeoutPromise = function(action, options) {
    var instance = this;

    Y.log('_syncTimeoutPromise', 'info', 'ITSA-ModelSyncPromise');
    return instance.defSyncOptions().then(
        function(defoptions) {
            var syncpromise = instance.syncPromise(action, Y.merge(defoptions, options));
            if (!(syncpromise instanceof Y.Promise)) {
                return new Y.Promise(function (resolve, reject) {
                    var errormessage = 'syncPromise is rejected --> '+action+' not defined as a Promise inside syncPromise()';
                    Y.log('_syncTimeoutPromise: '+errormessage, 'warn', 'ITSA-ModelSyncPromise');
                    reject(new Error(errormessage));
                });
            }
            return syncpromise;
        }
    );
};

}, 'gallery-2014.01.28-00-45', {
    "requires": [
        "yui-base",
        "intl",
        "base-base",
        "base-build",
        "node-base",
        "json-parse",
        "promise",
        "model",
        "gallery-itsamodulesloadedpromise",
        "gallery-itsautils"
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
