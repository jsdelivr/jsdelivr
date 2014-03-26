YUI.add('gallery-communication-layer', function(Y) {

/**
 * Provides a secure, evented communication layer for cross-domain HTML5 web
 * applications.
 *
 * @module gallery-communication-layer
 * @requires json, node-base, event-custom-base
 */

// Include the href for friendlier logs
var NAME = 'gallery-communication-layer ['+Y.config.win.location.href+']';

/**
 * @class CommunicationLayer
 * @param config {Object} Configuration object
 * @constructor
 */
function CommunicationLayer (config) {
    config = config || {};

    this._WIN               = Y.config.win;
    this._APPREADY          = 'appready';
    this._BUFFER_TIMEOUT    = config.bufferTimeout    || 10000;
    this._CALLBACK_TIMEOUT  = config.callbackTimeout  || 10000;
    this._GUID              = Y.guid();

    // Lookup for event targets that act as internal proxies.
    this._proxyFor = {};

    // Lookup for subscriptions that represent open connections.
    this._subscriptionFor = {};

    // We use the parent origin alias to look up the parent event target
    // when we don't yet know the parent's origin (i.e., before the
    // handshake completes). This should only be used during the handshake
    // or if we are not sure if the handshake has already completed.
    this._PARENT_ORIGIN_ALIAS = 'parent';
    this._parentProxy = this._createEventProxy(this._PARENT_ORIGIN_ALIAS);

    if (config.debug) {
        this._initDebugMode();
    }

    this._init();
}

CommunicationLayer.prototype = {

    /**
     * Facilitates unit tests by executing all init routines.
     *
     * @method _init
     * @private
     */
    _init: function () {
        this._initWindowMessageHandler();
        this._initParentConnection();
    },

    /**
     * Initializes the window message handler for incoming CL
     * messages.
     *
     * If the message checks out as a valid CL message, it is routed
     * to the proper internal event proxy. Malformed messages and
     * invalid CL messages are dropped.
     *
     * @method _initWindowMessageHandler
     * @private
     */
    _initWindowMessageHandler: function () {
        Y.log('Initializing window message handler', 'info', NAME);

        this._addListener(this._WIN, 'message', Y.bind(function (e) {
            var parsed,
                proxy,
                data;

            try {
                parsed = Y.JSON.parse(e.data);
            }
            catch (err) {
                Y.log('Dropping window message due to invalid data structure as part of the message', 'info', NAME);
            }

            Y.log('Received window message: '+e.data+' from '+e.origin, 'debug', NAME);

            if (this._validateEventData(parsed)) {
                data  = this._createCLEventData(e, parsed);
                proxy = this._proxyRouter(e, parsed);

                if (proxy) {
                    proxy.fire(parsed.name, data);
                }
            }
            else {
                Y.log('Dropping window message since it does not fulfill the requirements of a CL message', 'debug', NAME);
            }
        }, this));
    },

    /**
     * Event data validator for CL messages.
     *
     * @method _validateEventData
     * @param data {Object} The application event data
     * @return {Boolean}
     * @private
     */
    _validateEventData: function (data) {
        return !!(data && data.name && data.guid);
    },

    /**
     * Selects the proxy associated with the event.
     *
     * @method _proxyRouter
     * @param {Object} The window message event data
     * @param {Object} The application event data
     * @return {EventTarget} The CL proxy to route the message to
     * @private
     */
    _proxyRouter: function (evtData, appData) {
        var name   = appData.name,
            guid   = appData.guid,
            origin = evtData.origin,
            proxy  = null;

        // If there is a proxy associated with the event name, it
        // is a dedicated handshake proxy and we assume we are in
        // the middle of a handshake.
        if (this._proxyFor[name]) {
            Y.log('Proxy found for event name "'+name+'"; assuming a dedicated handshake proxy', 'debug', NAME);
            proxy = this._proxyFor[name];
        }
        else if (this._proxyFor[guid+origin]) {
            Y.log('Proxy found for guid "'+guid+'" and origin "'+origin+'"', 'debug', NAME);
            proxy = this._proxyFor[guid+origin];
        }
        else {
            Y.log('Proxy lookup failed. This should never happen!', 'error', NAME);
        }

        return proxy;
    },

    /**
     * Transforms the window message event data and the application
     * event data into an internally expected format.
     *
     * @method _createCLEventData
     * @param {Object} The window message event data
     * @param {Object} The application event data
     * @return {Object} The CL event data
     * @private
     */
    _createCLEventData: function (evtData, appData) {
        var clEventData = {
            data: appData.data,
            guid: appData.guid,
            origin: evtData.origin,
            source: evtData.source
        };

        if (appData.cbid) {
            /**
             * A callback facade that transparently invokes a
             * callback associated with another CL instance.
             */
            clEventData.callback = Y.bind(function () {
                this._postMessage(clEventData.source, {
                    name: appData.cbid,
                    guid: this._GUID,
                    data: {
                        args: Y.Array(arguments)
                    }
                }, clEventData.origin);
            }, this);
        }

        return clEventData;
    },

    /**
     * Initializes the handshake sequence with the parent
     * application unless it is the top-level window.
     *
     * @method _initParentConnection
     * @protected
     */
    _initParentConnection: function () {
        var self = this,
            win  = self._WIN,
            href = win.location.href,
            token;

        // Intentionally using `==` to accommodate IE quirksmode
        if (win.parent == win) {
            Y.log('Detected self as top-level window; aborting parent connection routine', 'info', NAME);
            return;
        }

        if (href) {
            token = self._getHandshakeToken(href);

            // We create a dedicated handshake proxy here because we
            // don't know anything about the parent until we receive
            // the ACK. Once we get that, we dispose of the
            // dedicated handshake proxy.
            self._createEventProxy(token).once(token, function (e) {
                Y.log('ACK received from parent '+e.origin, 'info', NAME);

                self._deleteEventProxy(token); // delete dedicated handshake event proxy

                self._parentSource = e.source;
                self._parentOrigin = e.origin;
                self._parentGuid   = e.guid;

                // Record the parent event proxy under the actual
                // lookup key (guid + origin).
                self._proxyFor[e.guid+e.origin] = self._parentProxy;

                Y.log('Connection established with parent '+self._parentOrigin, 'info', NAME);

                Y.log('Flushing any buffered events', 'info', NAME);
                self._parentProxy.fire(self._APPREADY);
            });

            // We don't specify the parent origin here because it is
            // unknown until the connection is established.
            self._postMessage(win.parent, {
                name: token,
                guid: self._GUID
            }, '*');
            Y.log('SYN sent to parent', 'info', NAME);
        }
    },

    /**
     * Registers an iframe with the CL. Passes a CL proxy object to
     * the callback which should be used to communicate with the
     * registered child application.
     *
     * @method register
     * @param iframe {Node} The iframe to register
     * @param cb {Function} The callback to execute upon completion
     * @param cb.proxy {Object} The CL proxy used to communicate with the child application
     * @public
     */
    register: function (iframe, cb) {
        var self = this,
            src,
            token;

        // Wrap with Y.Node if not wrapped already
        iframe = Y.one(iframe);
        src = iframe && iframe.test('iframe') && iframe.get('src');

        if (! src) {
            Y.log('Only iframes with src attributes can be registered', 'error', NAME);
            return;
        }

        token = self._getHandshakeToken(src);
        Y.log('Initiating the registration process using the token '+token, 'info', NAME);

        // We create a dedicated handshake proxy here because we
        // don't know everything we need about the child until we
        // receive the SYN. Once we get that, we dispose of the
        // dedicated handshake proxy.
        self._createEventProxy(token).once(token, function (e) {
            var origin = e.origin,
                source = e.source,
                guid   = e.guid,
                proxy,
                clProxy;

            Y.log('SYN received from child '+origin, 'info', NAME);

            // If there is a callback to receive the CL proxy, we pass it.
            if (Y.Lang.isFunction(cb)) {
                proxy = self._createEventProxy(guid+origin);
                clProxy = self._createCLProxy(proxy, {
                    origin: origin,
                    source: source,
                    guid: guid
                });

                // TODO: Pass the iframe as the second arg to the
                // callback instead since the following line creates
                // a memory leak.
                //
                // Save a reference to the iframe on the proxy
                clProxy.iframe = iframe;

                cb(clProxy);
            }

            // Delete handshake-specific event proxy
            self._deleteEventProxy(token);

            Y.log('Connection established with child '+origin, 'info', NAME);
            self._postMessage(source, {
                name: token,
                guid: self._GUID
            }, origin);

            Y.log('ACK sent to child '+origin, 'info', NAME);
        });
    },

    /**
     * Creates the CL proxy object used to communicate with the
     * registered child application.
     *
     * @method _createCLProxy
     * @param proxy {EventTarget} Internal event proxy used to manage events
     * @param winMeta {Object} Window metadata
     * @return {Object} A CL proxy
     * @private
     */
    _createCLProxy: function (proxy, winMeta) {
        var self = this,
            source = winMeta.source,
            origin = winMeta.origin,
            guid = winMeta.guid;

        return {
            /**
             * Subscribe a callback function to execute in response
             * to a child event.
             *
             * Light wrapper around the EventTarget `on` method.
             *
             * @method on
             * @param name {String} The name of the event
             * @param handler {Function} The callback to execute in response to the event
             * @param [context] {Object} Override `this` object in callback
             * @param [arg*] {Any} 0..n additional arguments to supply to the subscriber
             * @return {EventHandle} A subscription handle capable of detaching that subscription
             * @public
             */
            on: function (name, handler) {
                var args = Y.Array(arguments);

                // Replace the event handler with a wrapped version
                // that checks the origin of the window message.
                args.splice(1, 1, function (e) {
                    if (origin === e.origin) {
                        handler(e);
                    }
                });

                return proxy.on.apply(proxy, args);
            },
            /**
             * Listen to a child event one time. This is the
             * equivalent to `on` except the listener is immediately
             * detached when it is executed.
             *
             * Light wrapper around the EventTarget `once` method.
             *
             * @method once
             * @param name {String} The name of the event
             * @param handler {Function} The callback to execute in response to the event
             * @param [context] {Object} Override `this` object in callback
             * @param [arg*] {Any} 0..n additional arguments to supply to the subscriber
             * @return {EventHandle} A subscription handle capable of detaching that subscription
             * @public
             */
            once: function (name, handler) {
                var args = Y.Array(arguments);

                // Replace the event handler with a wrapped version
                // that checks the origin of the window message.
                args.splice(1, 1, function (e) {
                    if (origin === e.origin) {
                        handler(e);
                    }
                });

                return proxy.once.apply(proxy, args);
            },
            /**
             * Fire a CL event at the child by name. Supports
             * callbacks that can be invoked by the child
             * application via `e.callback()`.
             *
             * @method fire
             * @param name {String} The name of the event
             * @param [data] {Object} The event data
             * @param [cb] {Function} A callback for the child application to invoke
             * @public
             */
            fire: function (name, data, cb) {
                self._fireWindowMessageEvent(name, source, origin, {
                    data: data,
                    guid: guid,
                    callback: cb
                });
            },
           /**
            * Opens a 'persistent' connection (as opposed to
            * `fire` which only executes its callback once).
            *
            * @method open
            * @param name {String} The connection name
            * @param cb {Function} A callback
            * @return {Object} A connection object
            * @public
            */
            open: function (name, cb) {
                return self._createConnectionObject(name, cb, {
                    guid: guid,
                    source: source,
                    origin: origin
                });
            },
            /**
             * Allows the parent to subscribe to the point in time
             * when the child is ready to receive CL events.
             *
             * @method ready
             * @param cb {Function} A callback to execute when the child application is ready
             * @param [context] {Object} Override `this` object in callback
             * @public
             */
            ready: function (cb, context) {
                Y.log('Registering a callback to execute when the child is ready', 'debug', NAME);
                return proxy.on(self._APPREADY, cb, context);
            },
            /**
             * Detaches all event listeners from the CL proxy before
             * deleting it internally. This operation is
             * irreversible.
             *
             * @method purge
             * @public
             */
            purge: function () {
                if (!proxy) {
                    return;
                }

                Y.Object.each(self._proxyFor, function (value, key) {
                    if (value === proxy) {
                        self._deleteEventProxy(key);
                    }
                });

                proxy.detachAll();
                proxy = null;

                Y.log('All listeners have been detached and the internal event proxy has been destroyed', 'debug', NAME);
            }
        };
    },

    /**
     * Notifies the parent that the application is ready to receive
     * CL message events.
     *
     * @method ready
     * @public
     */
    ready: function () {
        Y.log('Ready to receive messages from the parent', 'debug', NAME);
        this._fireParentMessageEvent(this._APPREADY);
    },

    /**
     * Subscribe a callback function to execute in response to
     * a parent event.
     *
     * Light wrapper around the EventTarget `on` method.
     *
     * @method on
     * @param name {String} The name of the event
     * @param handler {Function} The callback to execute in response to the event
     * @param [context] {Object} Override `this` object in callback
     * @param [arg*] {Any} 0..n additional arguments to supply to the subscriber
     * @return {EventHandle} A subscription handle capable of detaching that subscription
     */
    on: function (name, handler) {
        var args = Y.Array(arguments);
        args.unshift({
            once: false
        });

        return this._onParentMessageEvent.apply(this, args);
    },

    /**
     * Listen to a parent event one time. This is the equivalent to
     * `on` except the listener is immediately detached when it is
     * executed.
     *
     * Light wrapper around the EventTarget `once` method.
     *
     * @method once
     * @param name {String} The name of the event
     * @param handler {Function} The callback to execute in response to the event
     * @param [context] {Object} Override `this` object in callback
     * @param [arg*] {Any} 0..n additional arguments to supply to the subscriber
     * @return {EventHandle} A subscription handle capable of detaching that subscription
     */
    once: function (name, handler) {
        var args = Y.Array(arguments);
        args.unshift({
            once: true
        });

        return this._onParentMessageEvent.apply(this, args);
    },

    /**
     * Fire a CL event at the parent by name. Supports callbacks
     * that can be invoked by the parent application via
     * `e.callback()`.
     *
     * @method fire
     * @param name {String} The name of the event
     * @param [data] {Object} The event data
     * @param [cb] {Function} A callback for the child application to invoke
     */
    fire: function (name, data, cb) {
        if (name) {
            this._fireParentMessageEvent(name, data, cb);
        }
    },

    /**
     * Opens a 'persistent' connection (as opposed to
     * <code>fire</code> which only executes its callback once).
     *
     * @method open
     * @param name {String} The connection name
     * @param cb {Function} A callback
     * @return {Object} A connection object
     * @public
     */
    open: function (name, cb) {
        if (this._parentAppIsReady()) {
            return this._createConnectionObject(name, cb, {
                guid: this._parentGuid,
                source: this._parentSource,
                origin: this._parentOrigin
            });
        }
        else {
            Y.log('A connection with the parent cannot be opened until the handshake has completed', 'warn', NAME);
        }
    },

    /**
     * Creates a connection object that represents an open
     * connection.
     *
     * @method _createConnectionObject
     * @param name {String} The connection name
     * @param cb {Function} A callback
     * @param winMeta {Object} Window metadata used to fire the event (e.g., source, origin, and guid)
     * @private
     */
    _createConnectionObject: function (name, cb, winMeta) {
        var self = this,
            cbid,
            sub;

        if (! (name && Y.Lang.isFunction(cb) && winMeta.origin && winMeta.guid)) {
            return null;
        }

        cbid = self._registerCallback(cb, winMeta.origin, winMeta.guid, name);

        Y.log('Creating a connection bound to the event name "'+name+'" and the callback "'+cbid+'"', 'info', NAME);

        return {
            write: function (data) {
                if (! self._subscriptionFor[name]) {
                    Y.log('The connection has already been closed', 'warn', NAME);
                    return;
                }

                Y.log('Writing data to the open "'+name+'" connection', 'debug', NAME);

                self._fireWindowMessageEvent(name, winMeta.source, winMeta.origin, {
                    data: data,
                    guid: winMeta.guid,
                    callback: cbid
                });
            },
            close: function () {
                sub = self._subscriptionFor[name];
                if (sub) {
                    Y.log('Closing connection for: '+name, 'info', NAME);
                    sub.detach();
                    delete self._subscriptionFor[name];
                }
            }
        };
    },

    /**
     * Fires a message event at the parent.
     *
     * Wrapper around <code>_fireWindowMessageEvent</code> that
     * buffers any message events fired at the parent if the parent
     * window is not yet ready. Note that this buffer times out
     * after a default of 10s but this is configurable via
     * <code>config.bufferTimeout</code>.
     *
     * @method _fireParentMessageEvent
     * @param name {String} The event name
     * @param [data] {Object} The event data
     * @param [cb] {Function|String} The callback or callback ID
     * @protected
     */
    _fireParentMessageEvent: function (name, data, cb) {
        var self = this,
            fireParentMessageEvent,
            sub;

        fireParentMessageEvent = function () {
            self._fireWindowMessageEvent(name, self._parentSource, self._parentOrigin, {
                data: data,
                guid: self._parentGuid,
                callback: cb
            });
        };

        if (! self._parentAppIsReady()) {
            // Buffer the message event until the parent is ready or until
            // the timeout, whichever comes first.
            sub = self._parentProxy.once(self._APPREADY, fireParentMessageEvent);

            // Kill the subscription after a timeout to prevent a memory leak
            Y.later(self._BUFFER_TIMEOUT, null, function () {
                if (! self._parentAppIsReady()) {
                    Y.log('Handshake timeout! Killing the buffered event "'+name+'" that was fired at the parent', 'warn', NAME);
                    sub.detach();
                }
            });
        }
        else {
            fireParentMessageEvent();
        }
    },

    /**
     * Determines if the parent application is ready (i.e., whether
     * or not the handshake has completed).
     *
     * @method _parentAppIsReady
     * @return {Boolean}
     * @private
     */
    _parentAppIsReady: function () {
        var evt = this._parentProxy.getEvent(this._APPREADY);
        return evt.fired;
    },

    /**
     * Gets a token to use for the handshake.
     *
     * We use the child application's origin since it is known by
     * both handshake participants.
     *
     * @method _getHandshakeToken
     * @param href {String} The URL of the window we want to establish a connection with
     * @return {String} The handshake token
     * @private
     *
     */
    _getHandshakeToken: function (href) {
        return href.replace(/[?].*$/, '').replace(/[#].*$/, '');
    },

    /**
     * Registers a callback for execution when its corresponding
     * callback facade is invoked. Times out after 10 seconds by
     * default.
     *
     * @method _registerCallback
     * @param cb {Function} The callback to register
     * @param origin {String} The origin of the application we want to register the callback against
     * @param guid {String} The guid of the application we want to register the callback against
     * @param name {String} The name of the event
     * @param [timeout] {Number} The number of ms before the subscription should time out. If this value is not provided, then it is assumed that a connection should be opened.
     */
    _registerCallback: function (cb, origin, guid, name, timeout) {
        var proxy = this._proxyFor[guid+origin],
            cbid  = Y.stamp(cb),
            timer,
            sub;

        if (! proxy) {
            Y.log('Proxy lookup failed for '+origin+' during callback registration', 'error', NAME);
            return;
        }

        // If a timeout was provided, we want to subscribe to a single
        // response generated by the callback facade corresponding to this
        // callback id within the timeout period.
        if (timeout) {
            sub = proxy.once(cbid, function (e) {
                timer.cancel();
                cb.apply(null, e.data.args); // invoke the callback with the argument array
                Y.log('Successful callback execution for event "'+name+'" using id: '+cbid, 'info', NAME);
            });

            // Kill the subscription after a timeout to prevent a memory leak
            timer = Y.later(timeout, null, function () {
                Y.log('Callback timeout! Unsubscribing the callback for event "'+name+'" using id: '+cbid, 'info', NAME);
                sub.detach();
            });
        }
        // If a timeout wasn't provided, we want to subscribe to every
        // response generated by the invocation of the callback facade
        // corresponding to this callback id.
        else {
            Y.log('Opening connection for: '+name, 'info', NAME);
            this._subscriptionFor[name] = proxy.on(cbid, function (e) {
                cb.apply(null, e.data.args); // invoke the callback with the argument array
                Y.log('Successful callback execution for event "'+name+'" using id: '+cbid, 'info', NAME);
            });
        }

        return cbid;
    },

    /**
     * Handles the creation of event proxies which are used to
     * namespace CL events internally.
     *
     * @method _createEventProxy
     * @param key {String} The key to store the proxy under
     * @return {EventTarget} The proxy
     * @private
     */
    _createEventProxy: function (key) {
        if (key) {
            Y.log('Creating event proxy for '+key, 'debug', NAME);
            var proxy = new Y.EventTarget();

            proxy.publish(this._APPREADY, {
                fireOnce: true
            });
            this._proxyFor[key] = proxy;

            return proxy;
        }
    },

    /**
     * Handles the deletion of event proxies which are used to
     * namespace CL events internally.
     *
     * @method _deleteEventProxy
     * @param key {String} The key to store the proxy under
     * @private
     */
    _deleteEventProxy: function (key) {
        Y.log('Deleting internal event proxy from the lookup table: '+key, 'debug', NAME);
        if (this._proxyFor[key]) {
            this._proxyFor[key].detachAll();
            this._proxyFor[key] = null;
        }
    },

    /**
     * Subscribe a callback function to execute in response to a
     * parent event.
     *
     * @method _onParentMessageEvent
     * @return {Object} A subscription object
     * @protected
     */
    _onParentMessageEvent: function () {
        var args   = Y.Array(arguments),
            config = args.shift(),
            method = config.once ? 'once' : 'on',
            proxy  = this._parentProxy;

        return proxy[method].apply(proxy, args);
    },

    /**
     * Fires a CL message at a window.
     *
     * Transforms the outgoing message into a structure that can be
     * understood by the CL message event handler on the other end.
     *
     * @method _fireWindowMessageEvent
     * @param name {String} The event name
     * @param source {Window} A reference to a window
     * @param origin {String} The origin of the window
     * @param o {Object} Optional arguments
     * @private
     */
    _fireWindowMessageEvent: function (name, source, origin, o) {
        var msg,
            cb;

        if (name && source && origin) {
            o   = o || {};
            cb  = o.callback;
            msg = {
                name: name,
                guid: this._GUID
            };

            if (o.data) {
                msg.data = o.data;
            }

            if (Y.Lang.isFunction(cb)) {
                msg.cbid = this._registerCallback(cb, origin, o.guid, name, this._CALLBACK_TIMEOUT);
            }
            else if (Y.Lang.isString(cb)) {
                msg.cbid = cb;
            }

            this._postMessage(source, msg, origin);
        }
    },

    /**
     * Posts a window message through the win.postMessage API.
     *
     * @method _postMessage
     * @param win {Object} window reference
     * @param msg {Object} literal object representing the message to be sent
     * @param origin {Object} reference to the origin window
     * @return {boolean} whether or not the message was sent.
     * @private
     */
    _postMessage: function (win, msg, origin) {
        if (win && win.postMessage && msg && origin) {
            win.postMessage(Y.JSON.stringify(msg), origin);
            return true;
        }
    },

    /**
     * Initializes debug mode where you can hook into communication between
     * the current application and its parent.
     *
     * @method _initDebugMode
     * @private
     */
    _initDebugMode: function () {
        var proxy = this._createEventProxy('debug');

        Y.log('Initializing debug mode', 'warn', NAME);

        // Global methods which can be used to simulate parent
        // interaction.
        YUI.CL = {
            // The method used to simulate incoming events
            fire: function (name, data) {
                proxy.fire(name, {
                    data: data
                });
            },
            // The method used to subscribe to outgoing events
            on: function () {
                return proxy.on.apply(proxy, arguments);
            },
            // The method used to subscribe to an outgoing event once
            once: function () {
                return proxy.once.apply(proxy, arguments);
            }
        };

        // Wrapping some methods on this CL instance so that we can
        // leak incoming/outgoing events through to the debug event
        // proxy.
        Y.Array.each(['fire', 'on', 'once'], function (name) {
            var orig = this[name]; // save original
            this[name] = function () {
                proxy[name].apply(proxy, arguments);
                orig.apply(this, arguments);
            };
        }, this);
    },

    // -- Y.one('window').on('message', ...) IE9 workarounds -----

    _addListener: function (el, ev, fn) {
        if (el.addEventListener) {
            el.addEventListener(ev, fn, false);
        } else if (el.attachEvent) {
            el.attachEvent('on'+ev, fn);
        } else {
            el['on'+ev] = fn;
        }
    },

    _removeListener: function(el, ev, fn) {
        if (el.removeEventListener) {
            // this can throw an uncaught exception in FF
            try {
                el.removeEventListener(ev, fn);
            } catch (ex) {}
        } else if (el && el.detachEvent) {
            el.detachEvent('on'+ev, fn);
        }
    }

};

Y.CommunicationLayer = CommunicationLayer;



}, 'gallery-2012.07.05-20-01' ,{requires:['json', 'node-base', 'event-custom-base'], skinnable:false});
