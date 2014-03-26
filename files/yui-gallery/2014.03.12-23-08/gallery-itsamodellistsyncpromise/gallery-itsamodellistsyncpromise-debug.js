YUI.add('gallery-itsamodellistsyncpromise', function (Y, NAME) {

'use strict';

/*jshint maxlen:205 */

/**
 *
 * This module extends Y.ModelList by introducing Promised sync-methods. It also transforms Y.ModelList's sync-events into true events
 * with a defaultFunc which can be prevented. This means the 'on'-events will be fired before syncing and the 'after'-events after syncing.
 *
 * @module gallery-itsamodellistsyncpromise
 * @class Y.ModelList
 * @constructor
 * @since 0.5
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://itsasbreuk.nl</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/
   var YModelList = Y.ModelList,
       Lang = Y.Lang,
       YArray = Y.Array,
       YObject = Y.Object,
       PUBLISHED = '_pub_',
       READ = 'read',
       APPEND = 'append',
       DELETE = 'delete',
       READAPPEND = READ+APPEND,
       MODELSYNC = 'modelsync',
       GALLERY_ITSA = 'gallery-itsa',
       LOW_PROMISE = 'promise',
       GALLERYITSAMODELSYNCPROMISE = GALLERY_ITSA+MODELSYNC+LOW_PROMISE,
       REMOVABLE_BY_SYNCPROMISE = '_removableby'+LOW_PROMISE,
       AVAILABLESYNCMESSAGES = {
           load: true,
           reload: true,
           save: true,
           submit: true,
           destroy: true
       },
       DEFFN = '_defFn_',
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
    ERROR = 'error',

    /**
     * Fired when all changed models of the modellist are saved through the Model-sync layer.
     * @event save
     * @param e {EventFacade} Event Facade including:
     * @param e.promise {Y.Promise} promise passed by with the eventobject
     * @param e.promiseReject {Function} handle to the reject-method
     * @param e.promiseResolve {Function} handle to the resolve-method
     * @since 0.1
    **/
    SAVE = 'save',

   /**
     * Fired when models are submitted through the Model-sync layer.
     * @event submit
     * @param e {EventFacade} Event Facade including:
     * @param e.promise {Y.Promise} promise passed by with the eventobject
     * @param e.promiseReject {Function} handle to the reject-method
     * @param e.promiseResolve {Function} handle to the resolve-method
     * @since 0.1
    **/
    SUBMIT = 'submit',

   /**
     * Fired when models are read from the ModelList-sync layer.
     * @event load
     * @param e {EventFacade} Event Facade including:
     * @param e.promise {Y.Promise} promise passed by with the eventobject
     * @param e.promiseReject {Function} handle to the reject-method
     * @param e.promiseResolve {Function} handle to the resolve-method
     * @since 0.1
    **/
    LOAD = 'load',

   /**
     * Fired when models are reloaded from the ModelList-sync layer.
     * @event reload
     * @param e {EventFacade} Event Facade including:
     * @param e.promise {Y.Promise} promise passed by with the eventobject
     * @param e.promiseReject {Function} handle to the reject-method
     * @param e.promiseResolve {Function} handle to the resolve-method
     * @since 0.5
    **/
    RELOAD = 'reload',

   /**
     * Fired when models are appended to the ModelList by the ModelList-sync layer.
     * @event loadappend
     * @param e {EventFacade} Event Facade including:
     * @param e.promise {Y.Promise} promise passed by with the eventobject
     * @param e.promiseReject {Function} handle to the reject-method
     * @param e.promiseResolve {Function} handle to the resolve-method
     * @since 0.1
    **/
    LOADAPPEND = LOAD+APPEND,

   /**
     * Fired when models are destroyed from the ModelList-sync layer.
     * @event destroymodels
     * @param e {EventFacade} Event Facade including:
     * @param e.promise {Y.Promise} promise passed by with the eventobject
     * @param e.promiseReject {Function} handle to the reject-method
     * @param e.promiseResolve {Function} handle to the resolve-method
     * @since 0.1
    **/
    DESTROY = 'destroy',
    DESTROYMODELS = DESTROY+'models',
    PROMISE = 'Promise',

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

/**
 * Define this property if you want default 'options' to be applied when syncing.
 * This object is passed through to the synclayer, merged with the options-object passed throug the syncmethod.
 *
 * @method defSyncOptions
 * @property defSyncOptions
 * @type Object
 * @default null
**/

/**
 * Makes sync-messages to target the specified messageViewer. You can only target to 1 MessageViewer at the same time.<br>
 * See gallery-itsamessageviewer for more info.
 *
 * @method addMessageTarget
 * @param itsamessageviewer {Y.ITSAMessageViewer|Y.ITSAPanel}
 * @since 0.4
*/
YModelList.prototype.addMessageTarget = function(itsamessageviewer) {
    Y.log('addMessageTarget', 'info', 'ITSA-ModellistSyncPromise');
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
                Y.log('Y.ModelList.addMessageTarget() is targetted to an invalid Y.ITSAMessageViewer', 'warn', 'ModellistSyncPromise');
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
YModelList.prototype.defSyncOptions = function() {
    Y.log('defSyncOptions', 'info', 'ITSA-ModellistSyncPromise');
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
  * @method destroymodels
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
 * @method destroymodelsPromise
 * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
 *                 implementation to determine what options it supports or requires, if any.
 *   @param {Boolean} [options.remove=false] If `true`, the model will be deleted via the sync layer in addition to the instance being destroyed.
 *   @param {String} [options.syncmessage] Message that should appear on a Y.ITSAMessageViewer during asynchronious destruction. Will overrule the default message. See gallery-itsamessageviewer.
 * @return {Y.Promise} promised response --> resolve(response) OR reject(reason). (examine reason.message).
**/

/**
 * Destroys this model instance and removes it from its containing lists, if any.
 * <br /><br />
 * Deprecated, use destroyModelsPromise instead (as long as available both methods ect the same).
 * <br /><br />
  * This method will fire an `error` event when syncing (using options.remove=true) should fail.
 * <br /><br />
 * <b>CAUTION</b> The sync-method with action 'destroy' <b>must call its callback-function</b> in order to work as espected!
 *
 * @method destroyPromise
 * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
 *                 implementation to determine what options it supports or requires, if any.
 * @return {Y.Promise} promised response --> resolve(response) OR reject(reason). (examine reason.message).
 * @deprecated
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
 * @return {Y.Promise} promised response --> resolve(response) OR reject(reason) (examine reason.message).
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
  * <b>CAUTION</b> The sync-method with action 'readappend' <b>must call its callback-function</b> in order to work as espected!
  *
  * @method loadappend
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
 * <b>CAUTION</b> The sync-method with action 'readappend' <b>must call its callback-function</b> in order to work as espected!
 *
 * @method loadappendPromise
 * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
 *                 implementation to determine what options it supports or requires, if any.
 *   @param {String} [options.syncmessage] Message that should appear on a Y.ITSAMessageViewer during asynchronious loading. Will overrule the default message. See gallery-itsamessageviewer.
 * @return {Y.Promise} promised response --> resolve(response) OR reject(reason) (examine reason.message).
**/

/**
 * Saves this model to the server.
 *
 * This method delegates to the `sync()` method to perform the actual save operation, which is an asynchronous action.
 * Specify a 'callback' function to be notified of success or failure.
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
 *   @param {String} [options.syncmessage] Message that should appear on a Y.ITSAMessageViewer during saving destruction. Will overrule the default message. See gallery-itsamessageviewer.
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

/**
 * Submits this model to the server.
 *
 * This method delegates to the `sync()` method to perform the actual save operation, which is an asynchronous action.
 * Specify a 'callback' function to be notified of success or failure.
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
 * @method submit
 * @param {Object} [options] Options to be passed to `sync()` and to `set()` when setting synced attributes.
 *                           It's up to the custom sync implementation to determine what options it supports or requires, if any.
 *   @param {String} [options.syncmessage] Message that should appear on a Y.ITSAMessageViewer during asynchronous submission. Will overrule the default message. See gallery-itsamessageviewer.
 * @param {Function} [callback] Called when the sync operation finishes.
 *   @param {Error|null} callback.err If an error occurred or validation failed, this parameter will contain the error.
 *                                    If the sync operation succeeded, 'err' will be null.
 *   @param {Any} callback.response The server's response. This value will be passed to the `parse()` method,
 *                                  which is expected to parse it and return an attribute hash.
 * @chainable
*/

/**
 * Submits this model to the server.
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
 * @method submitPromise
 * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
 *                 implementation to determine what options it supports or requires, if any.
 *   @param {String} [options.syncmessage] Message that should appear on a Y.ITSAMessageViewer during asynchronous submission. Will overrule the default message. See gallery-itsamessageviewer.
 * @return {Y.Promise} promised response --> resolve(response) OR reject(reason). (examine reason.message).
**/

/**
  * Loads models from the server, but does not add the new models through 'reset'. Instead, all individual models are updated/removed/added.<br />
  * This is useful in situations where you have the modellist bound to a view and you don't want a complete re-render of the view, but only of the changed models.
  * This method delegates to the `sync()` method to perform the actual read-operation, which is an asynchronous action. Specify a 'callback' function to
  * be notified of success or failure.
  * <br /><br />
  * An unsuccessful reload operation will fire an `error` event with the `src` value "reload".
  * <br /><br />
  * If the reload operation succeeds and one or more of the loaded attributes
  * differ from this model's current attributes, a `change` event will be fired.
  * <br /><br />
  * To keep track of the proccess, it is preferable to use <b>reloadPromise()</b>.<br />
  * This method will fire the events: 'reload' or ERROR after syncing.
  * <br /><br />
  * <b>CAUTION</b> The sync-method with action 'read' <b>must call its callback-function</b> in order to work as espected!
  *
  * @method reload
  * @param {Object} [options] Options to be passed to `sync()` and to `set()` when setting the loaded attributes.
  *                           It's up to the custom sync implementation to determine what options it supports or requires, if any.
  *   @param {String} [options.syncmessage] Message that should appear on a Y.ITSAMessageViewer during asynchronious loading. Will overrule the default message. See gallery-itsamessageviewer.
  * @param {callback} [callback] Called when the sync operation finishes.
  *   @param {Error|null} callback.err If an error occurred, this parameter will contain the error. If the sync operation succeeded, 'err' will be null.
  *   @param {Any} callback.response The server's response. This value will be passed to the `parse()` method, which is expected to parse it and return an attribute hash.
  * @chainable
  * @since 0.5
 */

/**
 * Loads models from the server, but does not add the new models through 'reset'. Instead, all individual models are updated/removed/added.<br />
 * This is useful in situations where you have the modellist bound to a view and you don't want a complete re-render of the view, but only of the changed models.
 * <br /><br />
 * This method delegates to the `sync()` method to perform the actual reload-operation, which is an asynchronous action.
 * <br /><br />
 * An unsuccessful reload operation will fire an `error` event with the `src` value "reload".
 * <br /><br />
 * If the reload operation succeeds and one or more of the loaded attributes differ from this model's current attributes, a `change` event will be fired.
 * <br /><br />
 * <b>CAUTION</b> The sync-method with action 'read' <b>must call its callback-function</b> in order to work as espected!
 *
 * @method reloadPromise
 * @param {Object} [options] Options to be passed to `sync()`. It's up to the custom sync
 *                 implementation to determine what options it supports or requires, if any.
 *   @param {String} [options.syncmessage] Message that should appear on a Y.ITSAMessageViewer during asynchronious loading. Will overrule the default message. See gallery-itsamessageviewer.
 * @return {Y.Promise} promised response --> resolve(response) OR reject(reason) (examine reason.message).
 * @since 0.5
**/

YArray.each(
    [LOAD, LOADAPPEND, RELOAD, SAVE, SUBMIT, DESTROYMODELS],
    function(Fn) {
        YModelList.prototype[Fn] = function(options, callback) {
            var instance = this,
                promise;

            Y.log(Fn, 'info', 'ITSA-ModellistSyncPromise');
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
        YModelList.prototype[Fn+PROMISE] = function (options) {
            Y.log(Fn+PROMISE, 'info', 'ITSA-ModellistSyncPromise');
            return this._createPromise(Fn, options);
        };
    }
);

/**
 * Removes the messageViewer-target that was set up by addMessageTarget().
 *
 * @method removeMessageTarget
 * @since 0.1
*/
YModelList.prototype.removeMessageTarget = function() {
    Y.log('removeMessageTarget', 'info', 'ITSA-ModellistSyncPromise');
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
YModelList.prototype.setSyncMessage = function(type, message) {
    Y.log('setSyncMessage', 'info', 'ITSA-ModellistSyncPromise');
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
YModelList.prototype._createPromise = function(type, options) {
    var instance = this,
        promise, promiseResolve, promiseReject, extraOptions;

    Y.log('_createPromise', 'info', 'ITSA-ModellistSyncPromise');
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
        options: Y.merge(options) // making passing only optins to other events possible
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
                                                                                  defaultFn: instance[DEFFN+type],
                                                                                  preventedFn: instance._prevDefFn
                                                                                }
                                                                               ));
/*jshint expr:false */
    instance.fire(type, extraOptions);
    return promise;
};

/**
 * Destroys all models within this modellist.
 * <b>Caution:</b> The current version uses the Model's synclayer, NOT ModelList's synclayer.
 *
 * This method delegates to the Model's`sync()` method to perform the actual destroy
 * operation, which is an asynchronous action. Within the Y.Model-class, you <b>must</b> specify a _callback_ function to
 * make the promise work.
 *
 * An unsuccessful destroy operation will fire an `error` event with the `src` value "destroy".
 *
 * @method _defFn_destroymodels
 * @private
 * @param {Object} [options] Options to be passed to all Model's`sync()`. It's up to the custom sync
 *                 implementation to determine what options it supports or requires, if any.
 * @return {Y.Promise} promised response --> resolve(response, options) OR reject(reason).
**/
YModelList.prototype[DEFFN+DESTROYMODELS] = function(e) {
    var instance = this,
        destroylist = [],
        options = e.options;

    Y.log('_defFn_destroymodels', 'info', 'Itsa-ModellistSyncPromise');
    instance.each(
        function(model) {
            destroylist.push(model.destroyPromise(options));
        }
    );
    Y.batch.apply(Y, destroylist).then(
//            Y.Promise.every(destroylist).then(
        function(response) {
            e.promiseResolve(response);
        },
        function(err) {
            e.promiseReject(new Error(err));
        }
    );
    return e.promise;
};

/**
 * Loads models from the server and adds them into the ModelList.<br />
 * Previous items will be retained: new will be added.<br /><br />
 *
 * This method delegates to the `sync()` method, by using the 'readappend' action.
 * This is an asynchronous action. You <b>must</b> specify a _callback_ function to
 * make the promise work.
 *
 * An unsuccessful load operation will fire an `error` event with the `src` value "loadappend".
 *
 * If the load operation succeeds and one or more of the loaded attributes
 * differ from this model's current attributes, a `change` event will be fired for every Model.
 *
 * @method _defFn_loadappend
 * @param {Object} [options] Options to be passed to `sync()`. The custom sync
 *                 implementation can determine what options it supports or requires, if any.
 * @private
 * @return {Y.Promise} promised response --> resolve(response, options) OR reject(reason).
**/

/**
 * Loads models from the server and adds them into the ModelList.<br />
 * Previous items will be replaced. Use loadappendPromise to append the items.<br /><br />
 *
 * This method delegates to the `sync()` method, by using the 'read' action.
 * This is an asynchronous action. You <b>must</b> specify a _callback_ function to
 * make the promise work.
 *
 * An unsuccessful load operation will fire an `error` event with the `src` value "load".
 *
 * If the load operation succeeds and one or more of the loaded attributes
 * differ from this model's current attributes, a `change` event will be fired for every Model.
 *
 * @method _defFn_load
 * @param {Object} [options] Options to be passed to `sync()`. The custom sync
 *                 implementation can determine what options it supports or requires, if any.
 * @private
 * @return {Y.Promise} promised response --> resolve(response, options) OR reject(reason).
**/

/**
 * Loads models from the server and updates the ModelList.<br />
 * New models are added, existing models updated and non-existing models removed from the list<br /><br />
 *
 * This method delegates to the `sync()` method, by using the 'read' action.
 * This is an asynchronous action. You <b>must</b> specify a _callback_ function to
 * make the promise work.
 *
 * An unsuccessful load operation will fire an `error` event with the `src` value "reload".
 *
 * If the load operation succeeds and one or more of the loaded attributes
 * differ from this model's current attributes, a `change` event will be fired for every Model.
 *
 * @method _defFn_reload
 * @param {Object} [options] Options to be passed to `sync()`. The custom sync
 *                 implementation can determine what options it supports or requires, if any.
 * @private
 * @return {Y.Promise} promised response --> resolve(response, options) OR reject(reason).
 * @since 0.5
**/
YArray.each(
    [LOAD, LOADAPPEND, RELOAD],
    function(eventType) {
        YModelList.prototype[DEFFN+eventType] = function (e) {
            var instance = this,
                options = e.options || {},
                //options.append is for compatiblility with previous versions
                // where you could call: loadPromise({append: true});
                readsync = ((eventType===LOADAPPEND) || options.append) ? READAPPEND : READ,
                errFunc, successFunc;

            Y.log(DEFFN+eventType, 'info', 'ITSA-ModelListSyncPromise');
            errFunc = function(err) {
                var facade = {
                    options: options,
                    error: err,
                    src: eventType
                };
                instance._lazyFireErrorEvent(facade);
                e.promiseReject(new Error(err));
            };
            successFunc = function(response) {
                var parsed, idAttribute;
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
                //options.append is for compatiblility with previous versions
                // where you could call: loadPromise({append: true});
                if ((eventType===LOADAPPEND) || options.append) {
                    instance.add(parsed, options);
                }
                else if (eventType===LOAD) {
                    instance.reset(parsed, options);
                }
                else { // (eventType===RELOAD)
                    // process the whole modellist: update/delete/add
                    // first: mark all current models so that they can be removed when no longer needed
                    instance.each(
                        function(model) {
                            model[REMOVABLE_BY_SYNCPROMISE] = true;
                        }
                    );
                    // next: process the serverresponse and either update or add the model
                    idAttribute = (instance.model && instance.model.prototype.idAttribute) || 'id';
                    YArray.each(
                        parsed,
                        function(modelobj) {
                            var key = modelobj[idAttribute],
                                availableModelOrObject, availableModel;
                            availableModelOrObject = availableModel = key && instance.getById(key);
                            // in case of LML --> revive the object into a model to activate model's change-event
                            if (availableModel) {
/*jshint expr:true */
                                instance.revive && (availableModel=instance.revive(availableModel));
/*jshint expr:false */
                                availableModel.setAttrs(modelobj, options);
                                delete availableModelOrObject[REMOVABLE_BY_SYNCPROMISE];
                            }
                            else {
                                instance.add(modelobj, options);
                            }
                        }
                    );
                    // last step: remove all items in the list that are still marked for removal
                    instance.each(
                        function(model) {
/*jshint expr:true */
                            model[REMOVABLE_BY_SYNCPROMISE] && instance.remove(model);
/*jshint expr:false */
                        }
                    );
                }
                e.promiseResolve(response);
            };
            if (instance.syncPromise) {
                // use the syncPromise-layer
                instance._syncTimeoutPromise(readsync, options).then(
                    successFunc,
                    errFunc
                );
            }
            else {
                instance.sync(readsync, options, function (err, response) {
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
    }
);

/**
 * Saves all modified models within this modellist to the server.
 * <b>Caution:</b> within the current version the Model's synclayer is used, NOT ModelList's synclayer.
 * Therefore, you get multiple requests for all modified Models.
 *
 * This method delegates to the Model's`sync()` method to perform the actual save
 * operation, which is an asynchronous action. Within the Y.Model-class, you <b>must</b> specify a _callback_ function to
 * make the promise work.
 *
 * An unsuccessful save operation will fire an `error` event with the `src` value "save".
 *
 * If the save operation succeeds and one or more of the attributes returned in
 * the server's response differ from this model's current attributes, a
 * `change` event will be fired.
 *
 * @method _defFn_save
 * @param {Object} [options] Options to be passed to all Model's`sync()`. It's up to the custom sync
 *                 implementation to determine what options it supports or requires, if any.
 * @private
 * @return {Y.Promise} promised response --> resolve(response, options) OR reject(reason).
**/
YModelList.prototype[DEFFN+SAVE] = function(e) {
    var instance = this,
        savelist = [],
        options = e.options;
    Y.log('_defFn_save', 'info', 'Itsa-ModellistSyncPromise');
    instance.each(
        function(model) {
            if (model.isModified()) {
                savelist.push(model.savePromise(options));
            }
        }
    );
    Y.batch.apply(Y, savelist).then(
//            Y.Promise.every(savelist).then(
        function(response) {
            e.promiseResolve(response);
        },
        function(err) {
            e.promiseReject(new Error(err));
        }
    );
    return e.promise;
};

/**
 * Submits all models within this modellist to the server.
 * <b>Caution:</b> within the current version the Model's synclayer is used, NOT ModelList's synclayer.
 * Therefore, you get multiple requests for all Models.
 *
 * This method delegates to the Model's`sync()` method to perform the actual submit
 * operation, which is an asynchronous action. Within the Y.Model-class, you <b>must</b> specify a _callback_ function to
 * make the promise work.
 *
 * An unsuccessful submit operation will fire an `error` event with the `src` value "submit".
 *
 * @method _defFn_submit
 * @param {Object} [options] Options to be passed to all Model's`sync()`. It's up to the custom sync
 *                 implementation to determine what options it supports or requires, if any.
 * @private
 * @return {Y.Promise} promised response --> resolve(response, options) OR reject(reason).
**/
YModelList.prototype[DEFFN+SUBMIT] = function(e) {
    var instance = this,
        submitlist = [],
        options = e.options;

    Y.log('_defFn_submit', 'info', 'Itsa-ModellistSyncPromise');
    instance.each(
        function(model) {
/*jshint expr:true */
            model.submitPromise && submitlist.push(model.submitPromise(options));
/*jshint expr:false */
        }
    );
    Y.batch.apply(Y, submitlist).then(
//            Y.Promise.every(submitlist).then(
        function(response) {
            e.promiseResolve(response);
        },
        function(err) {
            e.promiseReject(new Error(err));
        }
    );
    return e.promise;
};

/**
 * Fires the ERROR-event and -if not published yet- publish it broadcasted to Y.
 * Because the error-event is broadcasted to Y, it can be catched by gallery-itsaerrorreporter.
 *
 * @method _lazyFireErrorEvent
 * @param {Object} [facade] eventfacade.
 * @private
**/
YModelList.prototype._lazyFireErrorEvent = function(facade) {
    var instance = this;

    Y.log('_lazyFireErrorEvent', 'info', 'ITSA-ModellistSyncPromise');
    // lazy publish
    if (!instance._errorEvent) {
        instance._errorEvent = instance.publish(ERROR, {
            broadcast: 1
        });
    }
    instance.fire(ERROR, facade);
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
   *  @private
   *  @return {CustomEvent} the custom event
   *
  **/
YModelList.prototype._publishAsync = function(type, opts) {
    var instance = this,
        asyncEvent = instance.publish(type, opts);

    Y.log('_publishAsync', 'info', 'ITSA-ModellistSyncPromise');
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
                        Y.log("Error in defaultFn or after subscriber: " + (catchErr && (catchErr.message || catchErr)), ERROR);
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
                                Y.log("Error in defaultFn or after subscriber: " + (catchErr && (catchErr.message || catchErr)), ERROR);
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
                    Y.log("Error in defaultFn or after subscriber: " + (reason && (reason.message || reason)), ERROR);
                    return false;
                });
        },
        function(reason) {
            var facade = {
                error   : (reason && (reason.message || reason)),
                src     : 'ModelList._publishAsync()'
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
YModelList.prototype._prevDefFn = function(e) {
    Y.log('_prevDefFn', 'info', 'ITSA-ModellistSyncPromise');
    e.promiseReject(new Error('preventDefaulted'));
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
YModelList.prototype._syncTimeoutPromise = function(action, options) {
    var instance = this;

    Y.log('_syncTimeoutPromise', 'info', 'ITSA-ModellistSyncPromise');
    return instance.defSyncOptions().then(
        function(defoptions) {
            var syncpromise = instance.syncPromise(action, Y.merge(defoptions, options));
            if (!(syncpromise instanceof Y.Promise)) {
                return new Y.Promise(function (resolve, reject) {
                    var errormessage = 'syncPromise is rejected --> '+action+' not defined as a Promise inside syncPromise()';
                    Y.log('_syncTimeoutPromise: '+errormessage, 'warn', 'ITSA-ModellistSyncPromise');
                    reject(new Error(errormessage));
                });
            }
            return syncpromise;
        }
    );
};

// for backwards compatibility:
YModelList.prototype.destroyPromise = YModelList.prototype.destroyModelPromise;

}, 'gallery-2014.01.28-00-45', {
    "requires": [
        "yui-base",
        "base-base",
        "base-build",
        "node-base",
        "json-parse",
        "promise",
        "model",
        "model-list",
        "gallery-itsamodelsyncpromise",
        "gallery-itsamodulesloadedpromise",
        "gallery-itsautils"
    ]
});
