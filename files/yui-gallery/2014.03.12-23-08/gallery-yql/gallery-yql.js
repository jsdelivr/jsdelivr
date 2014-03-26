YUI.add('gallery-yql', function(Y) {

    //Global storage for the callbacks
    if (!YUI.yql) {
        YUI.yql = {};
    }
    /**
     * This class adds a sugar class to allow access to YQL (http://developer.yahoo.com/yql/).
     * @module yql
     */     
    /**
     * This class adds a sugar class to allow access to YQL (http://developer.yahoo.com/yql/).
     * @class yql
     * @extends Event.Target
     * @constructor
     * @param {String} sql The SQL statement to execute
     * @param {Function} callback The callback to execute after the query (optional).
     * @param {Object} params An object literal of extra parameters to pass along (optional).
     * @param {Object} opts An object literal of extra options to pass along to the Get Utility (optional).
     */
    var BASE_URL = ':/'+'/query.yahooapis.com/v1/public/yql?',
    yql = function (sql, callback, params, opts) {
        yql.superclass.constructor.apply(this);
        this._query(sql, callback, params, opts);
    };

    Y.extend(yql, Y.EventTarget, {
        /**
        * @private
        * @property _cb
        * @description The callback method
        */ 
        _cb: null,
        /**
        * @private
        * @property _stamp
        * @description The method name on the Global YUI object we use as the callback.
        */ 
        _stamp: null,
        /**
        * @private
        * @method _receiver
        * @description The global callback that get's called from Get.
        * @param {Object} q The JSON object from YQL.
        */
        _receiver: function(q) {
            if (q.query) {
                this.fire('query', q.query);
            }
            if (q.error) {
                this.fire('error', q.error);
            }
            if (this._cb) {
                this._cb(q);
            }
            delete YUI.yql[this._stamp];
        },
        /**
        * @private
        * @method _query
        * @description Builds the query and fire the Get call.
        * @param {String} sql The SQL statement to execute
        * @param {Function} callback The callback to execute after the query (optional).
        * @param {Object} params An object literal of extra parameters to pass along (optional).
        * @param {Object} opts An object literal of extra options to pass along to the Get Utility (optional).
        * @return Self
        */
        _query: function(sql, callback, params, opts) {
            var st = Y.stamp({}), qs = '', url = 'http';
            //Must replace the dashes with underscrores
            st = st.replace(/-/g, '_');

            this._stamp = st;
            
            this._cb = callback;

            YUI.yql[st] = Y.bind(this._receiver, this);

            if (!params) {
                params = {};
            }
            params.q = sql;
            params.format = 'json';
            params.callback = "YUI.yql." + st;
            if (!params.env) {
                params.env = 'http:/'+'/datatables.org/alltables.env';
            }

            Y.each(params, function(v, k) {
                qs += k + '=' + encodeURIComponent(v) + '&';
            });
            
            if (!opts) {
                opts = {};
            }

            if (opts.secure) {
                url = 'https';
            }

            opts.autopurge = true;
            opts.context = this;
            opts.onTimeout = function(o){
                this.fire('timeout', o);
                if (this._cb) {
                    this._cb(o);
                    this._cb = null;
                }
            };

            url += BASE_URL + qs;
            Y.Get.script(url, opts);
            return this;
        }
    });
    /**
    * @event query
    * @description Fires when the Query returns.
    * @type {Event.Custom}
    */

    /**
    * @event error
    * @description Fires when an error occurs.
    * @type {Event.Custom}
    */
    
    /**
     * @event timeout
     * @description Fires when the request has timed-out.
     * @type {Event.Custom}
     */
	
	Y.yql = yql;
	


}, 'gallery-2011.03.30-19-47' ,{requires:['get', 'event-custom']});
