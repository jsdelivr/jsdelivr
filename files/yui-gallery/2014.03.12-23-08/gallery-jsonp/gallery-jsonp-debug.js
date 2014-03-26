YUI.add('gallery-jsonp', function(Y) {

var isObject   = Y.Lang.isObject,
    isFunction = Y.Lang.isFunction;

/**
 * <p>Provides a JSONPRequest class for repeated JSONP calls, and a convenience
 * method Y.jsonp(url, callback) to instantiate and send a JSONP request.</p>
 *
 * <p>The callback for the response can be named in the url explicitly or
 * provided in the configuration (second parameter to the constructor).
 *
 * <p>By default, the query parameter string &quot;callback=???&quot; will be
 * searched for in the url (??? can be anything).  If it's not found, it will
 * be added on.  If the JSONP service uses a different parameter name or url
 * format, you can override this behavior with the <code>format</code> property
 * in the callback config.</p>
 *
 * <p>The second parameter can be a callback function that accepts the JSON
 * payload as its argument, or a configuration object supporting the keys:</p>
 * <ul>
 *   <li>on - map of callback subscribers
 *      <ul>
 *         <li>success - function handler for successful transmission</li>
 *         <li>failure - function handler for failed transmission</li>
 *         <li>timeout - function handler for transactions that timeout</li>
 *      </ul>
 *  </li>
 *  <li>format  - override function for inserting the proxy name in the url</li>
 *  <li>timeout - the number of milliseconds to wait before giving up</li>
 *  <li>context - becomes <code>this</code> in the callbacks</li>
 *  <li>args    - array of subsequent parameters to pass to the callbacks</li>
 * </ul>
 *
 * @module gallery-jsonp
 * @class JSONPRequest
 * @constructor
 * @param url {String} the url of the JSONP service
 * @param callback {Object|Function} the default callback configuration or
 *                                   success handler
 */
function JSONPRequest() {
    this._init.apply( this, arguments );
}

/**
 * RegExp used by the default URL formatter to insert the generated callback
 * name into the JSONP url.  Looks for a query param callback=.  If a value is
 * assigned, it will be clobbered.
 *
 * @member JSONPRequest._pattern
 * @type RegExp
 * @default /\bcallback=.*?(?=&|$)/i
 * @protected
 * @static
 */
JSONPRequest._pattern = /\bcallback=(.*?)(?=&|$)/i;

/**
 * Template used by the default URL formatter to add the callback function name
 * to the url.
 *
 * @member JSONPRequest._template
 * @type String
 * @default "callback={callback}"
 * @protected
 * @static
 */
JSONPRequest._template = "callback={callback}";

JSONPRequest.prototype = {
    /**
     * Set up the success and failure handlers and the regex pattern used
     * to insert the temporary callback name in the url.
     *
     * @method _init
     * @param url {String} the url of the JSONP service
     * @param callback {Object|Function} Optional success callback or config
     *                  object containing success and failure functions and
     *                  the url regex.
     * @protected
     */
    _init : function ( url, callback ) {
        this.url = url;

        callback = callback || {};

        if ( isFunction( callback ) ) {
            callback = { on: { success: callback } };
        }

        callback.on = callback.on || {};

        if ( !callback.on.success ) {
            callback.on.success = this._getCallbackFromUrl( url );
        }

        // Apply defaults and store
        this._config = Y.merge( {
                on     : {},
                context: this,
                args   : [],
                format : this._format
            }, callback );

    },

    /**
     * <p>Parses the url for a callback named explicitly in the string.
     * Override this if the target JSONP service uses a different query
     * parameter or url format.</p>
     *
     * <p>If the callback is declared inline, the corresponding function will
     * be returned.  Otherwise null.</p>
     *
     * @method _getCallbackFromUrl
     * @param url { String } the url to search in
     * @return { Function } the callback function if found, or null
     * @protected
     */
    _getCallbackFromUrl: function ( url ) {
        var match = url.match( JSONPRequest._pattern ),
            callback, context, bits, i;

        if ( match ) {
            // resolve from the global
            context = Y.config.win;

            // callback=foo.bar.func => [ 'func', 'bar', 'foo' ]
            // @TODO doesn't support bracket notation (callback=foo["bar"].func)
            bits = match[1].split( /\./ ).reverse();

            callback = bits.shift();

            for ( i = bits.length - 1; i >= 0; --i ) {
                context = context[ bits[ i ] ];
                if ( !isObject( context ) ) {
                    return null;
                }
            }

            if ( isObject( context ) && isFunction( context[ callback ] ) ) {
                // bind to preserve context declared inline, so
                // callback=foo.bar.func => 'this' is foo.bar in func
                return Y.bind( context[ callback ], context );
            }
        }

        return null;
    },

    /** 
     * Issues the JSONP request.
     *
     * @method send
     * @chainable
     */
    send : function ( callback ) {
        if ( !this._config.on.success ) {
            Y.log( "No success handler defined.  Aborting JSONP request.", "warn", "jsonp" );
            return this;
        }

        var proxy  = Y.guid().replace( /-/g, '_' ),
            config = this._config,
            url    = config.format.call( this,
                        this.url, 'YUI.Env.JSONP.' + proxy );

        function wrap( fn ) {
            return ( isFunction( fn ) ) ?
                function ( data ) {
                    delete YUI.Env.JSONP[ proxy ];
                    fn.apply( config.context, [ data ].concat( config.args ) );
                } :
                null;
        }

        // Temporary un-sandboxed function alias
        YUI.Env.JSONP[ proxy ] = wrap( config.on.success );

        Y.Get.script( url, {
            onFailure: wrap( config.on.failure ),
            onTimeout: wrap( config.on.timeout || config.on.failure ),
            timeout  : config.timeout
        } );

        return this;
    },

    /**
     * Default url formatter.  Looks for callback= in the url and appends it
     * if not present.  The supplied proxy name will be assigned to the query
     * param.  Override this method by passing a function as the
     * &quot;format&quot; property in the config object to the constructor.
     *
     * @method _format
     * @param url { String } the original url
     * @param proxy {String} the function name that will be used as a proxy to
     *      the configured callback methods.
     * @return {String} fully qualified JSONP url
     * @protected
     */
    _format: function ( url, proxy ) {
        var callback  = JSONPRequest._template.replace(/\{callback\}/, proxy),
            lastChar;

        if (JSONPRequest._pattern.test(url)) {
            return url.replace(JSONPRequest._pattern, callback);
        } else {
            lastChar = url.slice(-1);
            if (lastChar !== '&' && lastChar !== '?') {
                url += (url.indexOf('?') > -1) ? '&' : '?';
            }
            return url + callback;
        }
    }

};

Y.JSONPRequest = JSONPRequest;

/**
 *
 * @method Y.jsonp
 * @param url {String} the url of the JSONP service with the {callback}
 *          placeholder where the callback function name typically goes.
 * @param c {Function|Object} Callback function accepting the JSON payload
 *          as its argument, or a configuration object (see above).
 * @return {JSONPRequest}
 * @static
 */
Y.jsonp = function (url,c) {
    return new Y.JSONPRequest(url,c).send();
};

if (!YUI.Env.JSONP) {
    YUI.Env.JSONP = {};
}


}, 'gallery-2010.08.11-20-39' ,{requires:['get','oop']});
