YUI.add('gallery-back-button', function(Y) {

/**
 * The Back Button utility provides a simple API for detecting when a page is
 * returned to via the back button. Arbitrary data can be stored on the page and
 * retrieved when returning to the page.
 *
 * The Back Button Utility is not a full-fledged history manager. Its sole
 * purpose is to detect back button activity on a page-by-page basis.
 *
 * @module back-button
 */

/**
 * The BackButton class provides a simple data store and a <code>return</code>
 * event indicating a page was returned to via the back button.
 *
 * @class BackButton
 * @constructor
 * @param {Object} config configuration object containing the following
 *   properties:
 *
 * <dl>
 *   <dt>storageNode (String|HTMLElement|Node)</dt>
 *   <dd>
 *     A text input to store data
 *   <dd>
 * </dl>
 */

var JSON       = Y.JSON,
    Lang       = Y.Lang,
    Obj        = Y.Object,
    
    EVT_RETURN = 'return',
    NAME       = 'backButton',
    
BackButton = function (config) {
  this._init.apply(this, arguments);
};

Y.augment(BackButton, Y.EventTarget, null, null, {
  emitFacade : true,
  prefix     : 'backButton',
  preventable: false,
  queueable  : true
});

// -- Public Static Properties -------------------------------------------------
BackButton.NAME = NAME;

Y.mix(BackButton.prototype, {
  // -- Initialization ---------------------------------------------------------
  
  /**
   * Initializes this BackButton instance.
   *
   * @method _init
   * @param {Object} config configuration object
   * @protected
   */
  _init: function (config) {
    /**
     * Fired when stored data is detected on the page.
     *
     * @event backButton:return
     * @param {EventFacade} e Event facade with the following additional
     *   properties:
     *
     * <dl>
     *   <dt>data</dt>
     *   <dd>
     *     Object containing key/value pairs of all detected data
     *   </dd>
     * </dl>
     */
    this.publish(EVT_RETURN, {
      fireOnce : true,
      defaultFn: Y.bind(this._defReturnFn, this)
    });
    
    this._storage = Y.one(config.storageNode);
    
    if (this._detectData()) {
      this._fireReturnEvent();
    }
  },
  
  // -- Public Instance Methods ------------------------------------------------
  
  /**
   * Stores an item for the specified key or keys. If a key already exists in
   * the data store, it will be replaced.
   *
   * @method add
   * @param {Object|String} item|key object containing key/value pairs or the
   *   name of a single key
   * @param {mixed} (optional) if <i>item</i> is the name of a single key,
   *   <i>value</i> will become its new value
   * @chainable
   */
  add: function (item, value) {
    var key;
    
    if (Lang.isString(item)) {
      key       = item;
      item      = {};
      item[key] = value;
    }
    
    this._storeData(Y.mix(this._data || {}, item, true));
    
    return this;
  },
  
  /**
   * Removes all items from the data store.
   *
   * @method clear
   * @chainable
   */
  clear: function () {
    this._storeData(null);
    
    return this;
  },
  
  /**
   * Returns the value for the specified <i>key</i>, or an object containing
   * key/value pairs for all stored data if no key is specified.
   *
   * @method get
   * @param {String} key (optional)
   * @return {Object|mixed} value of the specified key, or an object containing
   *   key/value pairs for all stored data
   */
  get: function (key) {
    var data = this._data;
    
    if (key) {
      return Obj.owns(data, key) ? data[key] : undefined;
    } else {
      return Y.mix({}, data, true);
    }
  },
  
  // -- Protected Event Handlers -----------------------------------------------
  
  /**
   * Default return event handler.
   *
   * @method _defReturnFn
   * @param {EventFacade} e return event facade
   * @protected
   */
  _defReturnFn: function (e) {
    this.clear();
  },
  
  // -- Protected Instance Methods ---------------------------------------------
  
  /**
   * Called by _init() to detect previously stored data.
   *
   * @method _detectsData
   * @return {Boolean} <i>true</i> if data was detected, <i>false</i> otherwise
   * @protected
   */
  _detectData: function () {
    var data = this._storage.get('value');

    if (data) {
      try {
        data = JSON.parse(data);
      } catch (e) {}
    }
    
    this._data = data || null;
    
    return !!this._data;
  },
  
  /**
   * Fires the "return" event. Called by _init() when data is detected on the
   * page.
   *
   * @method _fireReturnEvent
   * @protected
   */
  _fireReturnEvent: function () {
    this.fire(EVT_RETURN, {data: this._data});
  },
  
  /**
   * Stores the given object.
   *
   * @method _storeData
   * @param {Object} data the data to store
   * @protected
   */
  _storeData: function (data) {
    this._data = data;
    this._storage.set('value', data ? JSON.stringify(data) : '');
  }
}, true);

Y.BackButton = BackButton;


}, 'gallery-2010.05.19-19-08' ,{requires:['event-custom-base','json','node-base']});
