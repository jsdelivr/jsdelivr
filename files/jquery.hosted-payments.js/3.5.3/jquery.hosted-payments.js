/*!
 * Copyright (c) 2016 ETS Corporation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */
// Closure
(function(){

	/**
	 * Decimal adjustment of a number.
	 *
	 * @param	{String}	type	The type of adjustment.
	 * @param	{Number}	value	The number.
	 * @param	{Integer}	exp		The exponent (the 10 logarithm of the adjustment base).
	 * @returns	{Number}			The adjusted value.
	 */
	function decimalAdjust(type, value, exp) {
		// If the exp is undefined or zero...
		if (typeof exp === 'undefined' || +exp === 0) {
			return Math[type](value);
		}
		value = +value;
		exp = +exp;
		// If the value is not a number or the exp is not an integer...
		if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
			return NaN;
		}
		// Shift
		value = value.toString().split('e');
		value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
		// Shift back
		value = value.toString().split('e');
		return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
	}

	// Decimal round
	if (!Math.round10) {
		Math.round10 = function(value, exp) {
			return decimalAdjust('round', value, exp);
		};
	}
	// Decimal floor
	if (!Math.floor10) {
		Math.floor10 = function(value, exp) {
			return decimalAdjust('floor', value, exp);
		};
	}
	// Decimal ceil
	if (!Math.ceil10) {
		Math.ceil10 = function(value, exp) {
			return decimalAdjust('ceil', value, exp);
		};
	}

})();
/* jquery.signalR.core.js */
/*global window:false */
/*!
 * ASP.NET SignalR JavaScript Library v2.2.0
 * http://signalr.net/
 *
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *
 */

/// <reference path="Scripts/jquery-1.6.4.js" />
/// <reference path="jquery.signalR.version.js" />
(function ($, window, undefined) {

    var resources = {
        nojQuery: "jQuery was not found. Please ensure jQuery is referenced before the SignalR client JavaScript file.",
        noTransportOnInit: "No transport could be initialized successfully. Try specifying a different transport or none at all for auto initialization.",
        errorOnNegotiate: "Error during negotiation request.",
        stoppedWhileLoading: "The connection was stopped during page load.",
        stoppedWhileNegotiating: "The connection was stopped during the negotiate request.",
        errorParsingNegotiateResponse: "Error parsing negotiate response.",
        errorDuringStartRequest: "Error during start request. Stopping the connection.",
        stoppedDuringStartRequest: "The connection was stopped during the start request.",
        errorParsingStartResponse: "Error parsing start response: '{0}'. Stopping the connection.",
        invalidStartResponse: "Invalid start response: '{0}'. Stopping the connection.",
        protocolIncompatible: "You are using a version of the client that isn't compatible with the server. Client version {0}, server version {1}.",
        sendFailed: "Send failed.",
        parseFailed: "Failed at parsing response: {0}",
        longPollFailed: "Long polling request failed.",
        eventSourceFailedToConnect: "EventSource failed to connect.",
        eventSourceError: "Error raised by EventSource",
        webSocketClosed: "WebSocket closed.",
        pingServerFailedInvalidResponse: "Invalid ping response when pinging server: '{0}'.",
        pingServerFailed: "Failed to ping server.",
        pingServerFailedStatusCode: "Failed to ping server.  Server responded with status code {0}, stopping the connection.",
        pingServerFailedParse: "Failed to parse ping server response, stopping the connection.",
        noConnectionTransport: "Connection is in an invalid state, there is no transport active.",
        webSocketsInvalidState: "The Web Socket transport is in an invalid state, transitioning into reconnecting.",
        reconnectTimeout: "Couldn't reconnect within the configured timeout of {0} ms, disconnecting.",
        reconnectWindowTimeout: "The client has been inactive since {0} and it has exceeded the inactivity timeout of {1} ms. Stopping the connection."
    };

    if (typeof ($) !== "function") {
        // no jQuery!
        throw new Error(resources.nojQuery);
    }

    var signalR,
        _connection,
        _pageLoaded = (window.document.readyState === "complete"),
        _pageWindow = $(window),
        _negotiateAbortText = "__Negotiate Aborted__",
        events = {
            onStart: "onStart",
            onStarting: "onStarting",
            onReceived: "onReceived",
            onError: "onError",
            onConnectionSlow: "onConnectionSlow",
            onReconnecting: "onReconnecting",
            onReconnect: "onReconnect",
            onStateChanged: "onStateChanged",
            onDisconnect: "onDisconnect"
        },
        ajaxDefaults = {
            processData: true,
            timeout: null,
            async: true,
            global: false,
            cache: false
        },
        log = function (msg, logging) {
            if (logging === false) {
                return;
            }
            var m;
            if (typeof (window.console) === "undefined") {
                return;
            }
            m = "[" + new Date().toTimeString() + "] SignalR: " + msg;
            if (window.console.debug) {
                window.console.debug(m);
            } else if (window.console.log) {
                window.console.log(m);
            }
        },

        changeState = function (connection, expectedState, newState) {
            if (expectedState === connection.state) {
                connection.state = newState;

                $(connection).triggerHandler(events.onStateChanged, [{ oldState: expectedState, newState: newState }]);
                return true;
            }

            return false;
        },

        isDisconnecting = function (connection) {
            return connection.state === signalR.connectionState.disconnected;
        },

        supportsKeepAlive = function (connection) {
            return connection._.keepAliveData.activated &&
                   connection.transport.supportsKeepAlive(connection);
        },

        configureStopReconnectingTimeout = function (connection) {
            var stopReconnectingTimeout,
                onReconnectTimeout;

            // Check if this connection has already been configured to stop reconnecting after a specified timeout.
            // Without this check if a connection is stopped then started events will be bound multiple times.
            if (!connection._.configuredStopReconnectingTimeout) {
                onReconnectTimeout = function (connection) {
                    var message = signalR._.format(signalR.resources.reconnectTimeout, connection.disconnectTimeout);
                    connection.log(message);
                    $(connection).triggerHandler(events.onError, [signalR._.error(message, /* source */ "TimeoutException")]);
                    connection.stop(/* async */ false, /* notifyServer */ false);
                };

                connection.reconnecting(function () {
                    var connection = this;

                    // Guard against state changing in a previous user defined even handler
                    if (connection.state === signalR.connectionState.reconnecting) {
                        stopReconnectingTimeout = window.setTimeout(function () { onReconnectTimeout(connection); }, connection.disconnectTimeout);
                    }
                });

                connection.stateChanged(function (data) {
                    if (data.oldState === signalR.connectionState.reconnecting) {
                        // Clear the pending reconnect timeout check
                        window.clearTimeout(stopReconnectingTimeout);
                    }
                });

                connection._.configuredStopReconnectingTimeout = true;
            }
        };

    signalR = function (url, qs, logging) {
        /// <summary>Creates a new SignalR connection for the given url</summary>
        /// <param name="url" type="String">The URL of the long polling endpoint</param>
        /// <param name="qs" type="Object">
        ///     [Optional] Custom querystring parameters to add to the connection URL.
        ///     If an object, every non-function member will be added to the querystring.
        ///     If a string, it's added to the QS as specified.
        /// </param>
        /// <param name="logging" type="Boolean">
        ///     [Optional] A flag indicating whether connection logging is enabled to the browser
        ///     console/log. Defaults to false.
        /// </param>

        return new signalR.fn.init(url, qs, logging);
    };

    signalR._ = {
        defaultContentType: "application/x-www-form-urlencoded; charset=UTF-8",

        ieVersion: (function () {
            var version,
                matches;

            if (window.navigator.appName === 'Microsoft Internet Explorer') {
                // Check if the user agent has the pattern "MSIE (one or more numbers).(one or more numbers)";
                matches = /MSIE ([0-9]+\.[0-9]+)/.exec(window.navigator.userAgent);

                if (matches) {
                    version = window.parseFloat(matches[1]);
                }
            }

            // undefined value means not IE
            return version;
        })(),

        error: function (message, source, context) {
            var e = new Error(message);
            e.source = source;

            if (typeof context !== "undefined") {
                e.context = context;
            }

            return e;
        },

        transportError: function (message, transport, source, context) {
            var e = this.error(message, source, context);
            e.transport = transport ? transport.name : undefined;
            return e;
        },

        format: function () {
            /// <summary>Usage: format("Hi {0}, you are {1}!", "Foo", 100) </summary>
            var s = arguments[0];
            for (var i = 0; i < arguments.length - 1; i++) {
                s = s.replace("{" + i + "}", arguments[i + 1]);
            }
            return s;
        },

        firefoxMajorVersion: function (userAgent) {
            // Firefox user agents: http://useragentstring.com/pages/Firefox/
            var matches = userAgent.match(/Firefox\/(\d+)/);
            if (!matches || !matches.length || matches.length < 2) {
                return 0;
            }
            return parseInt(matches[1], 10 /* radix */);
        },

        configurePingInterval: function (connection) {
            var config = connection._.config,
                onFail = function (error) {
                    $(connection).triggerHandler(events.onError, [error]);
                };

            if (config && !connection._.pingIntervalId && config.pingInterval) {
                connection._.pingIntervalId = window.setInterval(function () {
                    signalR.transports._logic.pingServer(connection).fail(onFail);
                }, config.pingInterval);
            }
        }
    };

    signalR.events = events;

    signalR.resources = resources;

    signalR.ajaxDefaults = ajaxDefaults;

    signalR.changeState = changeState;

    signalR.isDisconnecting = isDisconnecting;

    signalR.connectionState = {
        connecting: 0,
        connected: 1,
        reconnecting: 2,
        disconnected: 4
    };

    signalR.hub = {
        start: function () {
            // This will get replaced with the real hub connection start method when hubs is referenced correctly
            throw new Error("SignalR: Error loading hubs. Ensure your hubs reference is correct, e.g. <script src='/signalr/js'></script>.");
        }
    };

    _pageWindow.load(function () { _pageLoaded = true; });

    function validateTransport(requestedTransport, connection) {
        /// <summary>Validates the requested transport by cross checking it with the pre-defined signalR.transports</summary>
        /// <param name="requestedTransport" type="Object">The designated transports that the user has specified.</param>
        /// <param name="connection" type="signalR">The connection that will be using the requested transports.  Used for logging purposes.</param>
        /// <returns type="Object" />

        if ($.isArray(requestedTransport)) {
            // Go through transport array and remove an "invalid" tranports
            for (var i = requestedTransport.length - 1; i >= 0; i--) {
                var transport = requestedTransport[i];
                if ($.type(transport) !== "string" || !signalR.transports[transport]) {
                    connection.log("Invalid transport: " + transport + ", removing it from the transports list.");
                    requestedTransport.splice(i, 1);
                }
            }

            // Verify we still have transports left, if we dont then we have invalid transports
            if (requestedTransport.length === 0) {
                connection.log("No transports remain within the specified transport array.");
                requestedTransport = null;
            }
        } else if (!signalR.transports[requestedTransport] && requestedTransport !== "auto") {
            connection.log("Invalid transport: " + requestedTransport.toString() + ".");
            requestedTransport = null;
        } else if (requestedTransport === "auto" && signalR._.ieVersion <= 8) {
            // If we're doing an auto transport and we're IE8 then force longPolling, #1764
            return ["longPolling"];

        }

        return requestedTransport;
    }

    function getDefaultPort(protocol) {
        if (protocol === "http:") {
            return 80;
        } else if (protocol === "https:") {
            return 443;
        }
    }

    function addDefaultPort(protocol, url) {
        // Remove ports  from url.  We have to check if there's a / or end of line
        // following the port in order to avoid removing ports such as 8080.
        if (url.match(/:\d+$/)) {
            return url;
        } else {
            return url + ":" + getDefaultPort(protocol);
        }
    }

    function ConnectingMessageBuffer(connection, drainCallback) {
        var that = this,
            buffer = [];

        that.tryBuffer = function (message) {
            if (connection.state === $.signalR.connectionState.connecting) {
                buffer.push(message);

                return true;
            }

            return false;
        };

        that.drain = function () {
            // Ensure that the connection is connected when we drain (do not want to drain while a connection is not active)
            if (connection.state === $.signalR.connectionState.connected) {
                while (buffer.length > 0) {
                    drainCallback(buffer.shift());
                }
            }
        };

        that.clear = function () {
            buffer = [];
        };
    }

    signalR.fn = signalR.prototype = {
        init: function (url, qs, logging) {
            var $connection = $(this);

            this.url = url;
            this.qs = qs;
            this.lastError = null;
            this._ = {
                keepAliveData: {},
                connectingMessageBuffer: new ConnectingMessageBuffer(this, function (message) {
                    $connection.triggerHandler(events.onReceived, [message]);
                }),
                lastMessageAt: new Date().getTime(),
                lastActiveAt: new Date().getTime(),
                beatInterval: 5000, // Default value, will only be overridden if keep alive is enabled,
                beatHandle: null,
                totalTransportConnectTimeout: 0 // This will be the sum of the TransportConnectTimeout sent in response to negotiate and connection.transportConnectTimeout
            };
            if (typeof (logging) === "boolean") {
                this.logging = logging;
            }
        },

        _parseResponse: function (response) {
            var that = this;

            if (!response) {
                return response;
            } else if (typeof response === "string") {
                return that.json.parse(response);
            } else {
                return response;
            }
        },

        _originalJson: window.JSON,

        json: window.JSON,

        isCrossDomain: function (url, against) {
            /// <summary>Checks if url is cross domain</summary>
            /// <param name="url" type="String">The base URL</param>
            /// <param name="against" type="Object">
            ///     An optional argument to compare the URL against, if not specified it will be set to window.location.
            ///     If specified it must contain a protocol and a host property.
            /// </param>
            var link;

            url = $.trim(url);

            against = against || window.location;

            if (url.indexOf("http") !== 0) {
                return false;
            }

            // Create an anchor tag.
            link = window.document.createElement("a");
            link.href = url;

            // When checking for cross domain we have to special case port 80 because the window.location will remove the 
            return link.protocol + addDefaultPort(link.protocol, link.host) !== against.protocol + addDefaultPort(against.protocol, against.host);
        },

        ajaxDataType: "text",

        contentType: "application/json; charset=UTF-8",

        logging: false,

        state: signalR.connectionState.disconnected,

        clientProtocol: "1.5",

        reconnectDelay: 2000,

        transportConnectTimeout: 0,

        disconnectTimeout: 30000, // This should be set by the server in response to the negotiate request (30s default)

        reconnectWindow: 30000, // This should be set by the server in response to the negotiate request 

        keepAliveWarnAt: 2 / 3, // Warn user of slow connection if we breach the X% mark of the keep alive timeout

        start: function (options, callback) {
            /// <summary>Starts the connection</summary>
            /// <param name="options" type="Object">Options map</param>
            /// <param name="callback" type="Function">A callback function to execute when the connection has started</param>
            var connection = this,
                config = {
                    pingInterval: 300000,
                    waitForPageLoad: true,
                    transport: "auto",
                    jsonp: false
                },
                initialize,
                deferred = connection._deferral || $.Deferred(), // Check to see if there is a pre-existing deferral that's being built on, if so we want to keep using it
                parser = window.document.createElement("a");

            connection.lastError = null;

            // Persist the deferral so that if start is called multiple times the same deferral is used.
            connection._deferral = deferred;

            if (!connection.json) {
                // no JSON!
                throw new Error("SignalR: No JSON parser found. Please ensure json2.js is referenced before the SignalR.js file if you need to support clients without native JSON parsing support, e.g. IE<8.");
            }

            if ($.type(options) === "function") {
                // Support calling with single callback parameter
                callback = options;
            } else if ($.type(options) === "object") {
                $.extend(config, options);
                if ($.type(config.callback) === "function") {
                    callback = config.callback;
                }
            }

            config.transport = validateTransport(config.transport, connection);

            // If the transport is invalid throw an error and abort start
            if (!config.transport) {
                throw new Error("SignalR: Invalid transport(s) specified, aborting start.");
            }

            connection._.config = config;

            // Check to see if start is being called prior to page load
            // If waitForPageLoad is true we then want to re-direct function call to the window load event
            if (!_pageLoaded && config.waitForPageLoad === true) {
                connection._.deferredStartHandler = function () {
                    connection.start(options, callback);
                };
                _pageWindow.bind("load", connection._.deferredStartHandler);

                return deferred.promise();
            }

            // If we're already connecting just return the same deferral as the original connection start
            if (connection.state === signalR.connectionState.connecting) {
                return deferred.promise();
            } else if (changeState(connection,
                            signalR.connectionState.disconnected,
                            signalR.connectionState.connecting) === false) {
                // We're not connecting so try and transition into connecting.
                // If we fail to transition then we're either in connected or reconnecting.

                deferred.resolve(connection);
                return deferred.promise();
            }

            configureStopReconnectingTimeout(connection);

            // Resolve the full url
            parser.href = connection.url;
            if (!parser.protocol || parser.protocol === ":") {
                connection.protocol = window.document.location.protocol;
                connection.host = parser.host || window.document.location.host;
            } else {
                connection.protocol = parser.protocol;
                connection.host = parser.host;
            }

            connection.baseUrl = connection.protocol + "//" + connection.host;

            // Set the websocket protocol
            connection.wsProtocol = connection.protocol === "https:" ? "wss://" : "ws://";

            // If jsonp with no/auto transport is specified, then set the transport to long polling
            // since that is the only transport for which jsonp really makes sense.
            // Some developers might actually choose to specify jsonp for same origin requests
            // as demonstrated by Issue #623.
            if (config.transport === "auto" && config.jsonp === true) {
                config.transport = "longPolling";
            }

            // If the url is protocol relative, prepend the current windows protocol to the url. 
            if (connection.url.indexOf("//") === 0) {
                connection.url = window.location.protocol + connection.url;
                connection.log("Protocol relative URL detected, normalizing it to '" + connection.url + "'.");
            }

            if (this.isCrossDomain(connection.url)) {
                connection.log("Auto detected cross domain url.");

                if (config.transport === "auto") {
                    // TODO: Support XDM with foreverFrame
                    config.transport = ["webSockets", "serverSentEvents", "longPolling"];
                }

                if (typeof (config.withCredentials) === "undefined") {
                    config.withCredentials = true;
                }

                // Determine if jsonp is the only choice for negotiation, ajaxSend and ajaxAbort.
                // i.e. if the browser doesn't supports CORS
                // If it is, ignore any preference to the contrary, and switch to jsonp.
                if (!config.jsonp) {
                    config.jsonp = !$.support.cors;

                    if (config.jsonp) {
                        connection.log("Using jsonp because this browser doesn't support CORS.");
                    }
                }

                connection.contentType = signalR._.defaultContentType;
            }

            connection.withCredentials = config.withCredentials;

            connection.ajaxDataType = config.jsonp ? "jsonp" : "text";

            $(connection).bind(events.onStart, function (e, data) {
                if ($.type(callback) === "function") {
                    callback.call(connection);
                }
                deferred.resolve(connection);
            });

            connection._.initHandler = signalR.transports._logic.initHandler(connection);

            initialize = function (transports, index) {
                var noTransportError = signalR._.error(resources.noTransportOnInit);

                index = index || 0;
                if (index >= transports.length) {
                    if (index === 0) {
                        connection.log("No transports supported by the server were selected.");
                    } else if (index === 1) {
                        connection.log("No fallback transports were selected.");
                    } else {
                        connection.log("Fallback transports exhausted.");
                    }

                    // No transport initialized successfully
                    $(connection).triggerHandler(events.onError, [noTransportError]);
                    deferred.reject(noTransportError);
                    // Stop the connection if it has connected and move it into the disconnected state
                    connection.stop();
                    return;
                }

                // The connection was aborted
                if (connection.state === signalR.connectionState.disconnected) {
                    return;
                }

                var transportName = transports[index],
                    transport = signalR.transports[transportName],
                    onFallback = function () {
                        initialize(transports, index + 1);
                    };

                connection.transport = transport;

                try {
                    connection._.initHandler.start(transport, function () { // success
                        // Firefox 11+ doesn't allow sync XHR withCredentials: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#withCredentials
                        var isFirefox11OrGreater = signalR._.firefoxMajorVersion(window.navigator.userAgent) >= 11,
                            asyncAbort = !!connection.withCredentials && isFirefox11OrGreater;

                        connection.log("The start request succeeded. Transitioning to the connected state.");

                        if (supportsKeepAlive(connection)) {
                            signalR.transports._logic.monitorKeepAlive(connection);
                        }

                        signalR.transports._logic.startHeartbeat(connection);

                        // Used to ensure low activity clients maintain their authentication.
                        // Must be configured once a transport has been decided to perform valid ping requests.
                        signalR._.configurePingInterval(connection);

                        if (!changeState(connection,
                                            signalR.connectionState.connecting,
                                            signalR.connectionState.connected)) {
                            connection.log("WARNING! The connection was not in the connecting state.");
                        }

                        // Drain any incoming buffered messages (messages that came in prior to connect)
                        connection._.connectingMessageBuffer.drain();

                        $(connection).triggerHandler(events.onStart);

                        // wire the stop handler for when the user leaves the page
                        _pageWindow.bind("unload", function () {
                            connection.log("Window unloading, stopping the connection.");

                            connection.stop(asyncAbort);
                        });

                        if (isFirefox11OrGreater) {
                            // Firefox does not fire cross-domain XHRs in the normal unload handler on tab close.
                            // #2400
                            _pageWindow.bind("beforeunload", function () {
                                // If connection.stop() runs runs in beforeunload and fails, it will also fail
                                // in unload unless connection.stop() runs after a timeout.
                                window.setTimeout(function () {
                                    connection.stop(asyncAbort);
                                }, 0);
                            });
                        }
                    }, onFallback);
                }
                catch (error) {
                    connection.log(transport.name + " transport threw '" + error.message + "' when attempting to start.");
                    onFallback();
                }
            };

            var url = connection.url + "/negotiate",
                onFailed = function (error, connection) {
                    var err = signalR._.error(resources.errorOnNegotiate, error, connection._.negotiateRequest);

                    $(connection).triggerHandler(events.onError, err);
                    deferred.reject(err);
                    // Stop the connection if negotiate failed
                    connection.stop();
                };

            $(connection).triggerHandler(events.onStarting);

            url = signalR.transports._logic.prepareQueryString(connection, url);

            connection.log("Negotiating with '" + url + "'.");

            // Save the ajax negotiate request object so we can abort it if stop is called while the request is in flight.
            connection._.negotiateRequest = signalR.transports._logic.ajax(connection, {
                url: url,
                error: function (error, statusText) {
                    // We don't want to cause any errors if we're aborting our own negotiate request.
                    if (statusText !== _negotiateAbortText) {
                        onFailed(error, connection);
                    } else {
                        // This rejection will noop if the deferred has already been resolved or rejected.
                        deferred.reject(signalR._.error(resources.stoppedWhileNegotiating, null /* error */, connection._.negotiateRequest));
                    }
                },
                success: function (result) {
                    var res,
                        keepAliveData,
                        protocolError,
                        transports = [],
                        supportedTransports = [];

                    try {
                        res = connection._parseResponse(result);
                    } catch (error) {
                        onFailed(signalR._.error(resources.errorParsingNegotiateResponse, error), connection);
                        return;
                    }

                    keepAliveData = connection._.keepAliveData;
                    connection.appRelativeUrl = res.Url;
                    connection.id = res.ConnectionId;
                    connection.token = res.ConnectionToken;
                    connection.webSocketServerUrl = res.WebSocketServerUrl;

                    // The long poll timeout is the ConnectionTimeout plus 10 seconds
                    connection._.pollTimeout = res.ConnectionTimeout * 1000 + 10000; // in ms

                    // Once the server has labeled the PersistentConnection as Disconnected, we should stop attempting to reconnect
                    // after res.DisconnectTimeout seconds.
                    connection.disconnectTimeout = res.DisconnectTimeout * 1000; // in ms

                    // Add the TransportConnectTimeout from the response to the transportConnectTimeout from the client to calculate the total timeout
                    connection._.totalTransportConnectTimeout = connection.transportConnectTimeout + res.TransportConnectTimeout * 1000;

                    // If we have a keep alive
                    if (res.KeepAliveTimeout) {
                        // Register the keep alive data as activated
                        keepAliveData.activated = true;

                        // Timeout to designate when to force the connection into reconnecting converted to milliseconds
                        keepAliveData.timeout = res.KeepAliveTimeout * 1000;

                        // Timeout to designate when to warn the developer that the connection may be dead or is not responding.
                        keepAliveData.timeoutWarning = keepAliveData.timeout * connection.keepAliveWarnAt;

                        // Instantiate the frequency in which we check the keep alive.  It must be short in order to not miss/pick up any changes
                        connection._.beatInterval = (keepAliveData.timeout - keepAliveData.timeoutWarning) / 3;
                    } else {
                        keepAliveData.activated = false;
                    }

                    connection.reconnectWindow = connection.disconnectTimeout + (keepAliveData.timeout || 0);

                    if (!res.ProtocolVersion || res.ProtocolVersion !== connection.clientProtocol) {
                        protocolError = signalR._.error(signalR._.format(resources.protocolIncompatible, connection.clientProtocol, res.ProtocolVersion));
                        $(connection).triggerHandler(events.onError, [protocolError]);
                        deferred.reject(protocolError);

                        return;
                    }

                    $.each(signalR.transports, function (key) {
                        if ((key.indexOf("_") === 0) || (key === "webSockets" && !res.TryWebSockets)) {
                            return true;
                        }
                        supportedTransports.push(key);
                    });

                    if ($.isArray(config.transport)) {
                        $.each(config.transport, function (_, transport) {
                            if ($.inArray(transport, supportedTransports) >= 0) {
                                transports.push(transport);
                            }
                        });
                    } else if (config.transport === "auto") {
                        transports = supportedTransports;
                    } else if ($.inArray(config.transport, supportedTransports) >= 0) {
                        transports.push(config.transport);
                    }

                    initialize(transports);
                }
            });

            return deferred.promise();
        },

        starting: function (callback) {
            /// <summary>Adds a callback that will be invoked before anything is sent over the connection</summary>
            /// <param name="callback" type="Function">A callback function to execute before the connection is fully instantiated.</param>
            /// <returns type="signalR" />
            var connection = this;
            $(connection).bind(events.onStarting, function (e, data) {
                callback.call(connection);
            });
            return connection;
        },

        send: function (data) {
            /// <summary>Sends data over the connection</summary>
            /// <param name="data" type="String">The data to send over the connection</param>
            /// <returns type="signalR" />
            var connection = this;

            if (connection.state === signalR.connectionState.disconnected) {
                // Connection hasn't been started yet
                throw new Error("SignalR: Connection must be started before data can be sent. Call .start() before .send()");
            }

            if (connection.state === signalR.connectionState.connecting) {
                // Connection hasn't been started yet
                throw new Error("SignalR: Connection has not been fully initialized. Use .start().done() or .start().fail() to run logic after the connection has started.");
            }

            connection.transport.send(connection, data);
            // REVIEW: Should we return deferred here?
            return connection;
        },

        received: function (callback) {
            /// <summary>Adds a callback that will be invoked after anything is received over the connection</summary>
            /// <param name="callback" type="Function">A callback function to execute when any data is received on the connection</param>
            /// <returns type="signalR" />
            var connection = this;
            $(connection).bind(events.onReceived, function (e, data) {
                callback.call(connection, data);
            });
            return connection;
        },

        stateChanged: function (callback) {
            /// <summary>Adds a callback that will be invoked when the connection state changes</summary>
            /// <param name="callback" type="Function">A callback function to execute when the connection state changes</param>
            /// <returns type="signalR" />
            var connection = this;
            $(connection).bind(events.onStateChanged, function (e, data) {
                callback.call(connection, data);
            });
            return connection;
        },

        error: function (callback) {
            /// <summary>Adds a callback that will be invoked after an error occurs with the connection</summary>
            /// <param name="callback" type="Function">A callback function to execute when an error occurs on the connection</param>
            /// <returns type="signalR" />
            var connection = this;
            $(connection).bind(events.onError, function (e, errorData, sendData) {
                connection.lastError = errorData;
                // In practice 'errorData' is the SignalR built error object.
                // In practice 'sendData' is undefined for all error events except those triggered by
                // 'ajaxSend' and 'webSockets.send'.'sendData' is the original send payload.
                callback.call(connection, errorData, sendData);
            });
            return connection;
        },

        disconnected: function (callback) {
            /// <summary>Adds a callback that will be invoked when the client disconnects</summary>
            /// <param name="callback" type="Function">A callback function to execute when the connection is broken</param>
            /// <returns type="signalR" />
            var connection = this;
            $(connection).bind(events.onDisconnect, function (e, data) {
                callback.call(connection);
            });
            return connection;
        },

        connectionSlow: function (callback) {
            /// <summary>Adds a callback that will be invoked when the client detects a slow connection</summary>
            /// <param name="callback" type="Function">A callback function to execute when the connection is slow</param>
            /// <returns type="signalR" />
            var connection = this;
            $(connection).bind(events.onConnectionSlow, function (e, data) {
                callback.call(connection);
            });

            return connection;
        },

        reconnecting: function (callback) {
            /// <summary>Adds a callback that will be invoked when the underlying transport begins reconnecting</summary>
            /// <param name="callback" type="Function">A callback function to execute when the connection enters a reconnecting state</param>
            /// <returns type="signalR" />
            var connection = this;
            $(connection).bind(events.onReconnecting, function (e, data) {
                callback.call(connection);
            });
            return connection;
        },

        reconnected: function (callback) {
            /// <summary>Adds a callback that will be invoked when the underlying transport reconnects</summary>
            /// <param name="callback" type="Function">A callback function to execute when the connection is restored</param>
            /// <returns type="signalR" />
            var connection = this;
            $(connection).bind(events.onReconnect, function (e, data) {
                callback.call(connection);
            });
            return connection;
        },

        stop: function (async, notifyServer) {
            /// <summary>Stops listening</summary>
            /// <param name="async" type="Boolean">Whether or not to asynchronously abort the connection</param>
            /// <param name="notifyServer" type="Boolean">Whether we want to notify the server that we are aborting the connection</param>
            /// <returns type="signalR" />
            var connection = this,
                // Save deferral because this is always cleaned up
                deferral = connection._deferral;

            // Verify that we've bound a load event.
            if (connection._.deferredStartHandler) {
                // Unbind the event.
                _pageWindow.unbind("load", connection._.deferredStartHandler);
            }

            // Always clean up private non-timeout based state.
            delete connection._.config;
            delete connection._.deferredStartHandler;

            // This needs to be checked despite the connection state because a connection start can be deferred until page load.
            // If we've deferred the start due to a page load we need to unbind the "onLoad" -> start event.
            if (!_pageLoaded && (!connection._.config || connection._.config.waitForPageLoad === true)) {
                connection.log("Stopping connection prior to negotiate.");

                // If we have a deferral we should reject it
                if (deferral) {
                    deferral.reject(signalR._.error(resources.stoppedWhileLoading));
                }

                // Short-circuit because the start has not been fully started.
                return;
            }

            if (connection.state === signalR.connectionState.disconnected) {
                return;
            }

            connection.log("Stopping connection.");

            changeState(connection, connection.state, signalR.connectionState.disconnected);

            // Clear this no matter what
            window.clearTimeout(connection._.beatHandle);
            window.clearInterval(connection._.pingIntervalId);

            if (connection.transport) {
                connection.transport.stop(connection);

                if (notifyServer !== false) {
                    connection.transport.abort(connection, async);
                }

                if (supportsKeepAlive(connection)) {
                    signalR.transports._logic.stopMonitoringKeepAlive(connection);
                }

                connection.transport = null;
            }

            if (connection._.negotiateRequest) {
                // If the negotiation request has already completed this will noop.
                connection._.negotiateRequest.abort(_negotiateAbortText);
                delete connection._.negotiateRequest;
            }

            // Ensure that initHandler.stop() is called before connection._deferral is deleted
            if (connection._.initHandler) {
                connection._.initHandler.stop();
            }

            // Trigger the disconnect event
            $(connection).triggerHandler(events.onDisconnect);

            delete connection._deferral;
            delete connection.messageId;
            delete connection.groupsToken;
            delete connection.id;
            delete connection._.pingIntervalId;
            delete connection._.lastMessageAt;
            delete connection._.lastActiveAt;

            // Clear out our message buffer
            connection._.connectingMessageBuffer.clear();

            return connection;
        },

        log: function (msg) {
            log(msg, this.logging);
        }
    };

    signalR.fn.init.prototype = signalR.fn;

    signalR.noConflict = function () {
        /// <summary>Reinstates the original value of $.connection and returns the signalR object for manual assignment</summary>
        /// <returns type="signalR" />
        if ($.connection === signalR) {
            $.connection = _connection;
        }
        return signalR;
    };

    if ($.connection) {
        _connection = $.connection;
    }

    $.connection = $.signalR = signalR;

}(window.jQuery, window));
/* jquery.signalR.transports.common.js */
// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.md in the project root for license information.

/*global window:false */
/// <reference path="jquery.signalR.core.js" />

(function ($, window, undefined) {

    var signalR = $.signalR,
        events = $.signalR.events,
        changeState = $.signalR.changeState,
        startAbortText = "__Start Aborted__",
        transportLogic;

    signalR.transports = {};

    function beat(connection) {
        if (connection._.keepAliveData.monitoring) {
            checkIfAlive(connection);
        }

        // Ensure that we successfully marked active before continuing the heartbeat.
        if (transportLogic.markActive(connection)) {
            connection._.beatHandle = window.setTimeout(function () {
                beat(connection);
            }, connection._.beatInterval);
        }
    }

    function checkIfAlive(connection) {
        var keepAliveData = connection._.keepAliveData,
            timeElapsed;

        // Only check if we're connected
        if (connection.state === signalR.connectionState.connected) {
            timeElapsed = new Date().getTime() - connection._.lastMessageAt;

            // Check if the keep alive has completely timed out
            if (timeElapsed >= keepAliveData.timeout) {
                connection.log("Keep alive timed out.  Notifying transport that connection has been lost.");

                // Notify transport that the connection has been lost
                connection.transport.lostConnection(connection);
            } else if (timeElapsed >= keepAliveData.timeoutWarning) {
                // This is to assure that the user only gets a single warning
                if (!keepAliveData.userNotified) {
                    connection.log("Keep alive has been missed, connection may be dead/slow.");
                    $(connection).triggerHandler(events.onConnectionSlow);
                    keepAliveData.userNotified = true;
                }
            } else {
                keepAliveData.userNotified = false;
            }
        }
    }

    function getAjaxUrl(connection, path) {
        var url = connection.url + path;

        if (connection.transport) {
            url += "?transport=" + connection.transport.name;
        }

        return transportLogic.prepareQueryString(connection, url);
    }

    function InitHandler(connection) {
        this.connection = connection;

        this.startRequested = false;
        this.startCompleted = false;
        this.connectionStopped = false;
    }

    InitHandler.prototype = {
        start: function (transport, onSuccess, onFallback) {
            var that = this,
                connection = that.connection,
                failCalled = false;

            if (that.startRequested || that.connectionStopped) {
                connection.log("WARNING! " + transport.name + " transport cannot be started. Initialization ongoing or completed.");
                return;
            }

            connection.log(transport.name + " transport starting.");

            that.transportTimeoutHandle = window.setTimeout(function () {
                if (!failCalled) {
                    failCalled = true;
                    connection.log(transport.name + " transport timed out when trying to connect.");
                    that.transportFailed(transport, undefined, onFallback);
                }
            }, connection._.totalTransportConnectTimeout);

            transport.start(connection, function () {
                if (!failCalled) {
                    that.initReceived(transport, onSuccess);
                }
            }, function (error) {
                // Don't allow the same transport to cause onFallback to be called twice
                if (!failCalled) {
                    failCalled = true;
                    that.transportFailed(transport, error, onFallback);
                }

                // Returns true if the transport should stop;
                // false if it should attempt to reconnect
                return !that.startCompleted || that.connectionStopped;
            });
        },

        stop: function () {
            this.connectionStopped = true;
            window.clearTimeout(this.transportTimeoutHandle);
            signalR.transports._logic.tryAbortStartRequest(this.connection);
        },

        initReceived: function (transport, onSuccess) {
            var that = this,
                connection = that.connection;

            if (that.startRequested) {
                connection.log("WARNING! The client received multiple init messages.");
                return;
            }

            if (that.connectionStopped) {
                return;
            }

            that.startRequested = true;
            window.clearTimeout(that.transportTimeoutHandle);

            connection.log(transport.name + " transport connected. Initiating start request.");
            signalR.transports._logic.ajaxStart(connection, function () {
                that.startCompleted = true;
                onSuccess();
            });
        },

        transportFailed: function (transport, error, onFallback) {
            var connection = this.connection,
                deferred = connection._deferral,
                wrappedError;

            if (this.connectionStopped) {
                return;
            }

            window.clearTimeout(this.transportTimeoutHandle);

            if (!this.startRequested) {
                transport.stop(connection);

                connection.log(transport.name + " transport failed to connect. Attempting to fall back.");
                onFallback();
            } else if (!this.startCompleted) {
                // Do not attempt to fall back if a start request is ongoing during a transport failure.
                // Instead, trigger an error and stop the connection.
                wrappedError = signalR._.error(signalR.resources.errorDuringStartRequest, error);

                connection.log(transport.name + " transport failed during the start request. Stopping the connection.");
                $(connection).triggerHandler(events.onError, [wrappedError]);
                if (deferred) {
                    deferred.reject(wrappedError);
                }

                connection.stop();
            } else {
                // The start request has completed, but the connection has not stopped.
                // No need to do anything here. The transport should attempt its normal reconnect logic.
            }
        }
    };

    transportLogic = signalR.transports._logic = {
        ajax: function (connection, options) {
            return $.ajax(
                $.extend(/*deep copy*/ true, {}, $.signalR.ajaxDefaults, {
                    type: "GET",
                    data: {},
                    xhrFields: { withCredentials: connection.withCredentials },
                    contentType: connection.contentType,
                    dataType: connection.ajaxDataType
                }, options));
        },

        pingServer: function (connection) {
            /// <summary>Pings the server</summary>
            /// <param name="connection" type="signalr">Connection associated with the server ping</param>
            /// <returns type="signalR" />
            var url,
                xhr,
                deferral = $.Deferred();

            if (connection.transport) {
                url = connection.url + "/ping";

                url = transportLogic.addQs(url, connection.qs);

                xhr = transportLogic.ajax(connection, {
                    url: url,
                    success: function (result) {
                        var data;

                        try {
                            data = connection._parseResponse(result);
                        }
                        catch (error) {
                            deferral.reject(
                                signalR._.transportError(
                                    signalR.resources.pingServerFailedParse,
                                    connection.transport,
                                    error,
                                    xhr
                                )
                            );
                            connection.stop();
                            return;
                        }

                        if (data.Response === "pong") {
                            deferral.resolve();
                        }
                        else {
                            deferral.reject(
                                signalR._.transportError(
                                    signalR._.format(signalR.resources.pingServerFailedInvalidResponse, result),
                                    connection.transport,
                                    null /* error */,
                                    xhr
                                )
                            );
                        }
                    },
                    error: function (error) {
                        if (error.status === 401 || error.status === 403) {
                            deferral.reject(
                                signalR._.transportError(
                                    signalR._.format(signalR.resources.pingServerFailedStatusCode, error.status),
                                    connection.transport,
                                    error,
                                    xhr
                                )
                            );
                            connection.stop();
                        }
                        else {
                            deferral.reject(
                                signalR._.transportError(
                                    signalR.resources.pingServerFailed,
                                    connection.transport,
                                    error,
                                    xhr
                                )
                            );
                        }
                    }
                });
            }
            else {
                deferral.reject(
                    signalR._.transportError(
                        signalR.resources.noConnectionTransport,
                        connection.transport
                    )
                );
            }

            return deferral.promise();
        },

        prepareQueryString: function (connection, url) {
            var preparedUrl;

            // Use addQs to start since it handles the ?/& prefix for us
            preparedUrl = transportLogic.addQs(url, "clientProtocol=" + connection.clientProtocol);

            // Add the user-specified query string params if any
            preparedUrl = transportLogic.addQs(preparedUrl, connection.qs);

            if (connection.token) {
                preparedUrl += "&connectionToken=" + window.encodeURIComponent(connection.token);
            }

            if (connection.data) {
                preparedUrl += "&connectionData=" + window.encodeURIComponent(connection.data);
            }

            return preparedUrl;
        },

        addQs: function (url, qs) {
            var appender = url.indexOf("?") !== -1 ? "&" : "?",
                firstChar;

            if (!qs) {
                return url;
            }

            if (typeof (qs) === "object") {
                return url + appender + $.param(qs);
            }

            if (typeof (qs) === "string") {
                firstChar = qs.charAt(0);

                if (firstChar === "?" || firstChar === "&") {
                    appender = "";
                }

                return url + appender + qs;
            }

            throw new Error("Query string property must be either a string or object.");
        },

        // BUG #2953: The url needs to be same otherwise it will cause a memory leak
        getUrl: function (connection, transport, reconnecting, poll, ajaxPost) {
            /// <summary>Gets the url for making a GET based connect request</summary>
            var baseUrl = transport === "webSockets" ? "" : connection.baseUrl,
                url = baseUrl + connection.appRelativeUrl,
                qs = "transport=" + transport;

            if (!ajaxPost && connection.groupsToken) {
                qs += "&groupsToken=" + window.encodeURIComponent(connection.groupsToken);
            }

            if (!reconnecting) {
                url += "/connect";
            } else {
                if (poll) {
                    // longPolling transport specific
                    url += "/poll";
                } else {
                    url += "/reconnect";
                }

                if (!ajaxPost && connection.messageId) {
                    qs += "&messageId=" + window.encodeURIComponent(connection.messageId);
                }
            }
            url += "?" + qs;
            url = transportLogic.prepareQueryString(connection, url);

            if (!ajaxPost) {
                url += "&tid=" + Math.floor(Math.random() * 11);
            }

            return url;
        },

        maximizePersistentResponse: function (minPersistentResponse) {
            return {
                MessageId: minPersistentResponse.C,
                Messages: minPersistentResponse.M,
                Initialized: typeof (minPersistentResponse.S) !== "undefined" ? true : false,
                ShouldReconnect: typeof (minPersistentResponse.T) !== "undefined" ? true : false,
                LongPollDelay: minPersistentResponse.L,
                GroupsToken: minPersistentResponse.G
            };
        },

        updateGroups: function (connection, groupsToken) {
            if (groupsToken) {
                connection.groupsToken = groupsToken;
            }
        },

        stringifySend: function (connection, message) {
            if (typeof (message) === "string" || typeof (message) === "undefined" || message === null) {
                return message;
            }
            return connection.json.stringify(message);
        },

        ajaxSend: function (connection, data) {
            var payload = transportLogic.stringifySend(connection, data),
                url = getAjaxUrl(connection, "/send"),
                xhr,
                onFail = function (error, connection) {
                    $(connection).triggerHandler(events.onError, [signalR._.transportError(signalR.resources.sendFailed, connection.transport, error, xhr), data]);
                };


            xhr = transportLogic.ajax(connection, {
                url: url,
                type: connection.ajaxDataType === "jsonp" ? "GET" : "POST",
                contentType: signalR._.defaultContentType,
                data: {
                    data: payload
                },
                success: function (result) {
                    var res;

                    if (result) {
                        try {
                            res = connection._parseResponse(result);
                        }
                        catch (error) {
                            onFail(error, connection);
                            connection.stop();
                            return;
                        }

                        transportLogic.triggerReceived(connection, res);
                    }
                },
                error: function (error, textStatus) {
                    if (textStatus === "abort" || textStatus === "parsererror") {
                        // The parsererror happens for sends that don't return any data, and hence
                        // don't write the jsonp callback to the response. This is harder to fix on the server
                        // so just hack around it on the client for now.
                        return;
                    }

                    onFail(error, connection);
                }
            });

            return xhr;
        },

        ajaxAbort: function (connection, async) {
            if (typeof (connection.transport) === "undefined") {
                return;
            }

            // Async by default unless explicitly overidden
            async = typeof async === "undefined" ? true : async;

            var url = getAjaxUrl(connection, "/abort");

            transportLogic.ajax(connection, {
                url: url,
                async: async,
                timeout: 1000,
                type: "POST"
            });

            connection.log("Fired ajax abort async = " + async + ".");
        },

        ajaxStart: function (connection, onSuccess) {
            var rejectDeferred = function (error) {
                    var deferred = connection._deferral;
                    if (deferred) {
                        deferred.reject(error);
                    }
                },
                triggerStartError = function (error) {
                    connection.log("The start request failed. Stopping the connection.");
                    $(connection).triggerHandler(events.onError, [error]);
                    rejectDeferred(error);
                    connection.stop();
                };

            connection._.startRequest = transportLogic.ajax(connection, {
                url: getAjaxUrl(connection, "/start"),
                success: function (result, statusText, xhr) {
                    var data;

                    try {
                        data = connection._parseResponse(result);
                    } catch (error) {
                        triggerStartError(signalR._.error(
                            signalR._.format(signalR.resources.errorParsingStartResponse, result),
                            error, xhr));
                        return;
                    }

                    if (data.Response === "started") {
                        onSuccess();
                    } else {
                        triggerStartError(signalR._.error(
                            signalR._.format(signalR.resources.invalidStartResponse, result),
                            null /* error */, xhr));
                    }
                },
                error: function (xhr, statusText, error) {
                    if (statusText !== startAbortText) {
                        triggerStartError(signalR._.error(
                            signalR.resources.errorDuringStartRequest,
                            error, xhr));
                    } else {
                        // Stop has been called, no need to trigger the error handler
                        // or stop the connection again with onStartError
                        connection.log("The start request aborted because connection.stop() was called.");
                        rejectDeferred(signalR._.error(
                            signalR.resources.stoppedDuringStartRequest,
                            null /* error */, xhr));
                    }
                }
            });
        },

        tryAbortStartRequest: function (connection) {
            if (connection._.startRequest) {
                // If the start request has already completed this will noop.
                connection._.startRequest.abort(startAbortText);
                delete connection._.startRequest;
            }
        },

        tryInitialize: function (persistentResponse, onInitialized) {
            if (persistentResponse.Initialized) {
                onInitialized();
            }
        },

        triggerReceived: function (connection, data) {
            if (!connection._.connectingMessageBuffer.tryBuffer(data)) {
                $(connection).triggerHandler(events.onReceived, [data]);
            }
        },

        processMessages: function (connection, minData, onInitialized) {
            var data;

            // Update the last message time stamp
            transportLogic.markLastMessage(connection);

            if (minData) {
                data = transportLogic.maximizePersistentResponse(minData);

                transportLogic.updateGroups(connection, data.GroupsToken);

                if (data.MessageId) {
                    connection.messageId = data.MessageId;
                }

                if (data.Messages) {
                    $.each(data.Messages, function (index, message) {
                        transportLogic.triggerReceived(connection, message);
                    });

                    transportLogic.tryInitialize(data, onInitialized);
                }
            }
        },

        monitorKeepAlive: function (connection) {
            var keepAliveData = connection._.keepAliveData;

            // If we haven't initiated the keep alive timeouts then we need to
            if (!keepAliveData.monitoring) {
                keepAliveData.monitoring = true;

                transportLogic.markLastMessage(connection);

                // Save the function so we can unbind it on stop
                connection._.keepAliveData.reconnectKeepAliveUpdate = function () {
                    // Mark a new message so that keep alive doesn't time out connections
                    transportLogic.markLastMessage(connection);
                };

                // Update Keep alive on reconnect
                $(connection).bind(events.onReconnect, connection._.keepAliveData.reconnectKeepAliveUpdate);

                connection.log("Now monitoring keep alive with a warning timeout of " + keepAliveData.timeoutWarning + ", keep alive timeout of " + keepAliveData.timeout + " and disconnecting timeout of " + connection.disconnectTimeout);
            } else {
                connection.log("Tried to monitor keep alive but it's already being monitored.");
            }
        },

        stopMonitoringKeepAlive: function (connection) {
            var keepAliveData = connection._.keepAliveData;

            // Only attempt to stop the keep alive monitoring if its being monitored
            if (keepAliveData.monitoring) {
                // Stop monitoring
                keepAliveData.monitoring = false;

                // Remove the updateKeepAlive function from the reconnect event
                $(connection).unbind(events.onReconnect, connection._.keepAliveData.reconnectKeepAliveUpdate);

                // Clear all the keep alive data
                connection._.keepAliveData = {};
                connection.log("Stopping the monitoring of the keep alive.");
            }
        },

        startHeartbeat: function (connection) {
            connection._.lastActiveAt = new Date().getTime();
            beat(connection);
        },

        markLastMessage: function (connection) {
            connection._.lastMessageAt = new Date().getTime();
        },

        markActive: function (connection) {
            if (transportLogic.verifyLastActive(connection)) {
                connection._.lastActiveAt = new Date().getTime();
                return true;
            }

            return false;
        },

        isConnectedOrReconnecting: function (connection) {
            return connection.state === signalR.connectionState.connected ||
                   connection.state === signalR.connectionState.reconnecting;
        },

        ensureReconnectingState: function (connection) {
            if (changeState(connection,
                        signalR.connectionState.connected,
                        signalR.connectionState.reconnecting) === true) {
                $(connection).triggerHandler(events.onReconnecting);
            }
            return connection.state === signalR.connectionState.reconnecting;
        },

        clearReconnectTimeout: function (connection) {
            if (connection && connection._.reconnectTimeout) {
                window.clearTimeout(connection._.reconnectTimeout);
                delete connection._.reconnectTimeout;
            }
        },

        verifyLastActive: function (connection) {
            if (new Date().getTime() - connection._.lastActiveAt >= connection.reconnectWindow) {
                var message = signalR._.format(signalR.resources.reconnectWindowTimeout, new Date(connection._.lastActiveAt), connection.reconnectWindow);
                connection.log(message);
                $(connection).triggerHandler(events.onError, [signalR._.error(message, /* source */ "TimeoutException")]);
                connection.stop(/* async */ false, /* notifyServer */ false);
                return false;
            }

            return true;
        },

        reconnect: function (connection, transportName) {
            var transport = signalR.transports[transportName];

            // We should only set a reconnectTimeout if we are currently connected
            // and a reconnectTimeout isn't already set.
            if (transportLogic.isConnectedOrReconnecting(connection) && !connection._.reconnectTimeout) {
                // Need to verify before the setTimeout occurs because an application sleep could occur during the setTimeout duration.
                if (!transportLogic.verifyLastActive(connection)) {
                    return;
                }

                connection._.reconnectTimeout = window.setTimeout(function () {
                    if (!transportLogic.verifyLastActive(connection)) {
                        return;
                    }

                    transport.stop(connection);

                    if (transportLogic.ensureReconnectingState(connection)) {
                        connection.log(transportName + " reconnecting.");
                        transport.start(connection);
                    }
                }, connection.reconnectDelay);
            }
        },

        handleParseFailure: function (connection, result, error, onFailed, context) {
            var wrappedError = signalR._.transportError(
                signalR._.format(signalR.resources.parseFailed, result),
                connection.transport,
                error,
                context);

            // If we're in the initialization phase trigger onFailed, otherwise stop the connection.
            if (onFailed && onFailed(wrappedError)) {
                connection.log("Failed to parse server response while attempting to connect.");
            } else {
                $(connection).triggerHandler(events.onError, [wrappedError]);
                connection.stop();
            }
        },

        initHandler: function (connection) {
            return new InitHandler(connection);
        },

        foreverFrame: {
            count: 0,
            connections: {}
        }
    };

}(window.jQuery, window));
/* jquery.signalR.transports.webSockets.js */
// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.md in the project root for license information.

/*global window:false */
/// <reference path="jquery.signalR.transports.common.js" />

(function ($, window, undefined) {

    var signalR = $.signalR,
        events = $.signalR.events,
        changeState = $.signalR.changeState,
        transportLogic = signalR.transports._logic;

    signalR.transports.webSockets = {
        name: "webSockets",

        supportsKeepAlive: function () {
            return true;
        },

        send: function (connection, data) {
            var payload = transportLogic.stringifySend(connection, data);

            try {
                connection.socket.send(payload);
            } catch (ex) {
                $(connection).triggerHandler(events.onError,
                    [signalR._.transportError(
                        signalR.resources.webSocketsInvalidState,
                        connection.transport,
                        ex,
                        connection.socket
                    ),
                    data]);
            }
        },

        start: function (connection, onSuccess, onFailed) {
            var url,
                opened = false,
                that = this,
                reconnecting = !onSuccess,
                $connection = $(connection);

            if (!window.WebSocket) {
                onFailed();
                return;
            }

            if (!connection.socket) {
                if (connection.webSocketServerUrl) {
                    url = connection.webSocketServerUrl;
                } else {
                    url = connection.wsProtocol + connection.host;
                }

                url += transportLogic.getUrl(connection, this.name, reconnecting);

                connection.log("Connecting to websocket endpoint '" + url + "'.");
                connection.socket = new window.WebSocket(url);

                connection.socket.onopen = function () {
                    opened = true;
                    connection.log("Websocket opened.");

                    transportLogic.clearReconnectTimeout(connection);

                    if (changeState(connection,
                                    signalR.connectionState.reconnecting,
                                    signalR.connectionState.connected) === true) {
                        $connection.triggerHandler(events.onReconnect);
                    }
                };

                connection.socket.onclose = function (event) {
                    var error;

                    // Only handle a socket close if the close is from the current socket.
                    // Sometimes on disconnect the server will push down an onclose event
                    // to an expired socket.

                    if (this === connection.socket) {
                        if (opened && typeof event.wasClean !== "undefined" && event.wasClean === false) {
                            // Ideally this would use the websocket.onerror handler (rather than checking wasClean in onclose) but
                            // I found in some circumstances Chrome won't call onerror. This implementation seems to work on all browsers.
                            error = signalR._.transportError(
                                signalR.resources.webSocketClosed,
                                connection.transport,
                                event);

                            connection.log("Unclean disconnect from websocket: " + (event.reason || "[no reason given]."));
                        } else {
                            connection.log("Websocket closed.");
                        }

                        if (!onFailed || !onFailed(error)) {
                            if (error) {
                                $(connection).triggerHandler(events.onError, [error]);
                            }

                            that.reconnect(connection);
                        }
                    }
                };

                connection.socket.onmessage = function (event) {
                    var data;

                    try {
                        data = connection._parseResponse(event.data);
                    }
                    catch (error) {
                        transportLogic.handleParseFailure(connection, event.data, error, onFailed, event);
                        return;
                    }

                    if (data) {
                        // data.M is PersistentResponse.Messages
                        if ($.isEmptyObject(data) || data.M) {
                            transportLogic.processMessages(connection, data, onSuccess);
                        } else {
                            // For websockets we need to trigger onReceived
                            // for callbacks to outgoing hub calls.
                            transportLogic.triggerReceived(connection, data);
                        }
                    }
                };
            }
        },

        reconnect: function (connection) {
            transportLogic.reconnect(connection, this.name);
        },

        lostConnection: function (connection) {
            this.reconnect(connection);
        },

        stop: function (connection) {
            // Don't trigger a reconnect after stopping
            transportLogic.clearReconnectTimeout(connection);

            if (connection.socket) {
                connection.log("Closing the Websocket.");
                connection.socket.close();
                connection.socket = null;
            }
        },

        abort: function (connection, async) {
            transportLogic.ajaxAbort(connection, async);
        }
    };

}(window.jQuery, window));
/* jquery.signalR.transports.serverSentEvents.js */
// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.md in the project root for license information.

/*global window:false */
/// <reference path="jquery.signalR.transports.common.js" />

(function ($, window, undefined) {

    var signalR = $.signalR,
        events = $.signalR.events,
        changeState = $.signalR.changeState,
        transportLogic = signalR.transports._logic,
        clearReconnectAttemptTimeout = function (connection) {
            window.clearTimeout(connection._.reconnectAttemptTimeoutHandle);
            delete connection._.reconnectAttemptTimeoutHandle;
        };

    signalR.transports.serverSentEvents = {
        name: "serverSentEvents",

        supportsKeepAlive: function () {
            return true;
        },

        timeOut: 3000,

        start: function (connection, onSuccess, onFailed) {
            var that = this,
                opened = false,
                $connection = $(connection),
                reconnecting = !onSuccess,
                url;

            if (connection.eventSource) {
                connection.log("The connection already has an event source. Stopping it.");
                connection.stop();
            }

            if (!window.EventSource) {
                if (onFailed) {
                    connection.log("This browser doesn't support SSE.");
                    onFailed();
                }
                return;
            }

            url = transportLogic.getUrl(connection, this.name, reconnecting);

            try {
                connection.log("Attempting to connect to SSE endpoint '" + url + "'.");
                connection.eventSource = new window.EventSource(url, { withCredentials: connection.withCredentials });
            }
            catch (e) {
                connection.log("EventSource failed trying to connect with error " + e.Message + ".");
                if (onFailed) {
                    // The connection failed, call the failed callback
                    onFailed();
                } else {
                    $connection.triggerHandler(events.onError, [signalR._.transportError(signalR.resources.eventSourceFailedToConnect, connection.transport, e)]);
                    if (reconnecting) {
                        // If we were reconnecting, rather than doing initial connect, then try reconnect again
                        that.reconnect(connection);
                    }
                }
                return;
            }

            if (reconnecting) {
                connection._.reconnectAttemptTimeoutHandle = window.setTimeout(function () {
                    if (opened === false) {
                        // If we're reconnecting and the event source is attempting to connect,
                        // don't keep retrying. This causes duplicate connections to spawn.
                        if (connection.eventSource.readyState !== window.EventSource.OPEN) {
                            // If we were reconnecting, rather than doing initial connect, then try reconnect again
                            that.reconnect(connection);
                        }
                    }
                },
                that.timeOut);
            }

            connection.eventSource.addEventListener("open", function (e) {
                connection.log("EventSource connected.");

                clearReconnectAttemptTimeout(connection);
                transportLogic.clearReconnectTimeout(connection);

                if (opened === false) {
                    opened = true;

                    if (changeState(connection,
                                         signalR.connectionState.reconnecting,
                                         signalR.connectionState.connected) === true) {
                        $connection.triggerHandler(events.onReconnect);
                    }
                }
            }, false);

            connection.eventSource.addEventListener("message", function (e) {
                var res;

                // process messages
                if (e.data === "initialized") {
                    return;
                }

                try {
                    res = connection._parseResponse(e.data);
                }
                catch (error) {
                    transportLogic.handleParseFailure(connection, e.data, error, onFailed, e);
                    return;
                }

                transportLogic.processMessages(connection, res, onSuccess);
            }, false);

            connection.eventSource.addEventListener("error", function (e) {
                var error = signalR._.transportError(
                    signalR.resources.eventSourceError,
                    connection.transport,
                    e);

                // Only handle an error if the error is from the current Event Source.
                // Sometimes on disconnect the server will push down an error event
                // to an expired Event Source.
                if (this !== connection.eventSource) {
                    return;
                }

                if (onFailed && onFailed(error)) {
                    return;
                }

                connection.log("EventSource readyState: " + connection.eventSource.readyState + ".");

                if (e.eventPhase === window.EventSource.CLOSED) {
                    // We don't use the EventSource's native reconnect function as it
                    // doesn't allow us to change the URL when reconnecting. We need
                    // to change the URL to not include the /connect suffix, and pass
                    // the last message id we received.
                    connection.log("EventSource reconnecting due to the server connection ending.");
                    that.reconnect(connection);
                } else {
                    // connection error
                    connection.log("EventSource error.");
                    $connection.triggerHandler(events.onError, [error]);
                }
            }, false);
        },

        reconnect: function (connection) {
            transportLogic.reconnect(connection, this.name);
        },

        lostConnection: function (connection) {
            this.reconnect(connection);
        },

        send: function (connection, data) {
            transportLogic.ajaxSend(connection, data);
        },

        stop: function (connection) {
            // Don't trigger a reconnect after stopping
            clearReconnectAttemptTimeout(connection);
            transportLogic.clearReconnectTimeout(connection);

            if (connection && connection.eventSource) {
                connection.log("EventSource calling close().");
                connection.eventSource.close();
                connection.eventSource = null;
                delete connection.eventSource;
            }
        },

        abort: function (connection, async) {
            transportLogic.ajaxAbort(connection, async);
        }
    };

}(window.jQuery, window));
/* jquery.signalR.transports.foreverFrame.js */
// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.md in the project root for license information.

/*global window:false */
/// <reference path="jquery.signalR.transports.common.js" />

(function ($, window, undefined) {

    var signalR = $.signalR,
        events = $.signalR.events,
        changeState = $.signalR.changeState,
        transportLogic = signalR.transports._logic,
        createFrame = function () {
            var frame = window.document.createElement("iframe");
            frame.setAttribute("style", "position:absolute;top:0;left:0;width:0;height:0;visibility:hidden;");
            return frame;
        },
        // Used to prevent infinite loading icon spins in older versions of ie
        // We build this object inside a closure so we don't pollute the rest of   
        // the foreverFrame transport with unnecessary functions/utilities.
        loadPreventer = (function () {
            var loadingFixIntervalId = null,
                loadingFixInterval = 1000,
                attachedTo = 0;

            return {
                prevent: function () {
                    // Prevent additional iframe removal procedures from newer browsers
                    if (signalR._.ieVersion <= 8) {
                        // We only ever want to set the interval one time, so on the first attachedTo
                        if (attachedTo === 0) {
                            // Create and destroy iframe every 3 seconds to prevent loading icon, super hacky
                            loadingFixIntervalId = window.setInterval(function () {
                                var tempFrame = createFrame();

                                window.document.body.appendChild(tempFrame);
                                window.document.body.removeChild(tempFrame);

                                tempFrame = null;
                            }, loadingFixInterval);
                        }

                        attachedTo++;
                    }
                },
                cancel: function () {
                    // Only clear the interval if there's only one more object that the loadPreventer is attachedTo
                    if (attachedTo === 1) {
                        window.clearInterval(loadingFixIntervalId);
                    }

                    if (attachedTo > 0) {
                        attachedTo--;
                    }
                }
            };
        })();

    signalR.transports.foreverFrame = {
        name: "foreverFrame",

        supportsKeepAlive: function () {
            return true;
        },

        // Added as a value here so we can create tests to verify functionality
        iframeClearThreshold: 50,

        start: function (connection, onSuccess, onFailed) {
            var that = this,
                frameId = (transportLogic.foreverFrame.count += 1),
                url,
                frame = createFrame(),
                frameLoadHandler = function () {
                    connection.log("Forever frame iframe finished loading and is no longer receiving messages.");
                    if (!onFailed || !onFailed()) {
                        that.reconnect(connection);
                    }
                };

            if (window.EventSource) {
                // If the browser supports SSE, don't use Forever Frame
                if (onFailed) {
                    connection.log("Forever Frame is not supported by SignalR on browsers with SSE support.");
                    onFailed();
                }
                return;
            }

            frame.setAttribute("data-signalr-connection-id", connection.id);

            // Start preventing loading icon
            // This will only perform work if the loadPreventer is not attached to another connection.
            loadPreventer.prevent();

            // Build the url
            url = transportLogic.getUrl(connection, this.name);
            url += "&frameId=" + frameId;

            // add frame to the document prior to setting URL to avoid caching issues.
            window.document.documentElement.appendChild(frame);

            connection.log("Binding to iframe's load event.");

            if (frame.addEventListener) {
                frame.addEventListener("load", frameLoadHandler, false);
            } else if (frame.attachEvent) {
                frame.attachEvent("onload", frameLoadHandler);
            }

            frame.src = url;
            transportLogic.foreverFrame.connections[frameId] = connection;

            connection.frame = frame;
            connection.frameId = frameId;

            if (onSuccess) {
                connection.onSuccess = function () {
                    connection.log("Iframe transport started.");
                    onSuccess();
                };
            }
        },

        reconnect: function (connection) {
            var that = this;

            // Need to verify connection state and verify before the setTimeout occurs because an application sleep could occur during the setTimeout duration.
            if (transportLogic.isConnectedOrReconnecting(connection) && transportLogic.verifyLastActive(connection)) {
                window.setTimeout(function () {
                    // Verify that we're ok to reconnect.
                    if (!transportLogic.verifyLastActive(connection)) {
                        return;
                    }

                    if (connection.frame && transportLogic.ensureReconnectingState(connection)) {
                        var frame = connection.frame,
                            src = transportLogic.getUrl(connection, that.name, true) + "&frameId=" + connection.frameId;
                        connection.log("Updating iframe src to '" + src + "'.");
                        frame.src = src;
                    }
                }, connection.reconnectDelay);
            }
        },

        lostConnection: function (connection) {
            this.reconnect(connection);
        },

        send: function (connection, data) {
            transportLogic.ajaxSend(connection, data);
        },

        receive: function (connection, data) {
            var cw,
                body,
                response;

            if (connection.json !== connection._originalJson) {
                // If there's a custom JSON parser configured then serialize the object
                // using the original (browser) JSON parser and then deserialize it using
                // the custom parser (connection._parseResponse does that). This is so we
                // can easily send the response from the server as "raw" JSON but still 
                // support custom JSON deserialization in the browser.
                data = connection._originalJson.stringify(data);
            }

            response = connection._parseResponse(data);

            transportLogic.processMessages(connection, response, connection.onSuccess);

            // Protect against connection stopping from a callback trigger within the processMessages above.
            if (connection.state === $.signalR.connectionState.connected) {
                // Delete the script & div elements
                connection.frameMessageCount = (connection.frameMessageCount || 0) + 1;
                if (connection.frameMessageCount > signalR.transports.foreverFrame.iframeClearThreshold) {
                    connection.frameMessageCount = 0;
                    cw = connection.frame.contentWindow || connection.frame.contentDocument;
                    if (cw && cw.document && cw.document.body) {
                        body = cw.document.body;

                        // Remove all the child elements from the iframe's body to conserver memory
                        while (body.firstChild) {
                            body.removeChild(body.firstChild);
                        }
                    }
                }
            }
        },

        stop: function (connection) {
            var cw = null;

            // Stop attempting to prevent loading icon
            loadPreventer.cancel();

            if (connection.frame) {
                if (connection.frame.stop) {
                    connection.frame.stop();
                } else {
                    try {
                        cw = connection.frame.contentWindow || connection.frame.contentDocument;
                        if (cw.document && cw.document.execCommand) {
                            cw.document.execCommand("Stop");
                        }
                    }
                    catch (e) {
                        connection.log("Error occured when stopping foreverFrame transport. Message = " + e.message + ".");
                    }
                }

                // Ensure the iframe is where we left it
                if (connection.frame.parentNode === window.document.body) {
                    window.document.body.removeChild(connection.frame);
                }

                delete transportLogic.foreverFrame.connections[connection.frameId];
                connection.frame = null;
                connection.frameId = null;
                delete connection.frame;
                delete connection.frameId;
                delete connection.onSuccess;
                delete connection.frameMessageCount;
                connection.log("Stopping forever frame.");
            }
        },

        abort: function (connection, async) {
            transportLogic.ajaxAbort(connection, async);
        },

        getConnection: function (id) {
            return transportLogic.foreverFrame.connections[id];
        },

        started: function (connection) {
            if (changeState(connection,
                signalR.connectionState.reconnecting,
                signalR.connectionState.connected) === true) {

                $(connection).triggerHandler(events.onReconnect);
            }
        }
    };

}(window.jQuery, window));
/* jquery.signalR.transports.longPolling.js */
// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.md in the project root for license information.

/*global window:false */
/// <reference path="jquery.signalR.transports.common.js" />

(function ($, window, undefined) {

    var signalR = $.signalR,
        events = $.signalR.events,
        changeState = $.signalR.changeState,
        isDisconnecting = $.signalR.isDisconnecting,
        transportLogic = signalR.transports._logic;

    signalR.transports.longPolling = {
        name: "longPolling",

        supportsKeepAlive: function () {
            return false;
        },

        reconnectDelay: 3000,

        start: function (connection, onSuccess, onFailed) {
            /// <summary>Starts the long polling connection</summary>
            /// <param name="connection" type="signalR">The SignalR connection to start</param>
            var that = this,
                fireConnect = function () {
                    fireConnect = $.noop;

                    connection.log("LongPolling connected.");
                    onSuccess();
                },
                tryFailConnect = function (error) {
                    if (onFailed(error)) {
                        connection.log("LongPolling failed to connect.");
                        return true;
                    }

                    return false;
                },
                privateData = connection._,
                reconnectErrors = 0,
                fireReconnected = function (instance) {
                    window.clearTimeout(privateData.reconnectTimeoutId);
                    privateData.reconnectTimeoutId = null;

                    if (changeState(instance,
                                    signalR.connectionState.reconnecting,
                                    signalR.connectionState.connected) === true) {
                        // Successfully reconnected!
                        instance.log("Raising the reconnect event");
                        $(instance).triggerHandler(events.onReconnect);
                    }
                },
                // 1 hour
                maxFireReconnectedTimeout = 3600000;

            if (connection.pollXhr) {
                connection.log("Polling xhr requests already exists, aborting.");
                connection.stop();
            }

            connection.messageId = null;

            privateData.reconnectTimeoutId = null;

            privateData.pollTimeoutId = window.setTimeout(function () {
                (function poll(instance, raiseReconnect) {
                    var messageId = instance.messageId,
                        connect = (messageId === null),
                        reconnecting = !connect,
                        polling = !raiseReconnect,
                        url = transportLogic.getUrl(instance, that.name, reconnecting, polling, true /* use Post for longPolling */),
                        postData = {};

                    if (instance.messageId) {
                        postData.messageId = instance.messageId;
                    }

                    if (instance.groupsToken) {
                        postData.groupsToken = instance.groupsToken;
                    }

                    // If we've disconnected during the time we've tried to re-instantiate the poll then stop.
                    if (isDisconnecting(instance) === true) {
                        return;
                    }

                    connection.log("Opening long polling request to '" + url + "'.");
                    instance.pollXhr = transportLogic.ajax(connection, {
                        xhrFields: {
                            onprogress: function () {
                                transportLogic.markLastMessage(connection);
                            }
                        },
                        url: url,
                        type: "POST",
                        contentType: signalR._.defaultContentType,
                        data: postData,
                        timeout: connection._.pollTimeout,
                        success: function (result) {
                            var minData,
                                delay = 0,
                                data,
                                shouldReconnect;

                            connection.log("Long poll complete.");

                            // Reset our reconnect errors so if we transition into a reconnecting state again we trigger
                            // reconnected quickly
                            reconnectErrors = 0;

                            try {
                                // Remove any keep-alives from the beginning of the result
                                minData = connection._parseResponse(result);
                            }
                            catch (error) {
                                transportLogic.handleParseFailure(instance, result, error, tryFailConnect, instance.pollXhr);
                                return;
                            }

                            // If there's currently a timeout to trigger reconnect, fire it now before processing messages
                            if (privateData.reconnectTimeoutId !== null) {
                                fireReconnected(instance);
                            }

                            if (minData) {
                                data = transportLogic.maximizePersistentResponse(minData);
                            }

                            transportLogic.processMessages(instance, minData, fireConnect);

                            if (data &&
                                $.type(data.LongPollDelay) === "number") {
                                delay = data.LongPollDelay;
                            }

                            if (isDisconnecting(instance) === true) {
                                return;
                            }

                            shouldReconnect = data && data.ShouldReconnect;
                            if (shouldReconnect) {
                                // Transition into the reconnecting state
                                // If this fails then that means that the user transitioned the connection into a invalid state in processMessages.
                                if (!transportLogic.ensureReconnectingState(instance)) {
                                    return;
                                }
                            }

                            // We never want to pass a raiseReconnect flag after a successful poll.  This is handled via the error function
                            if (delay > 0) {
                                privateData.pollTimeoutId = window.setTimeout(function () {
                                    poll(instance, shouldReconnect);
                                }, delay);
                            } else {
                                poll(instance, shouldReconnect);
                            }
                        },

                        error: function (data, textStatus) {
                            var error = signalR._.transportError(signalR.resources.longPollFailed, connection.transport, data, instance.pollXhr);

                            // Stop trying to trigger reconnect, connection is in an error state
                            // If we're not in the reconnect state this will noop
                            window.clearTimeout(privateData.reconnectTimeoutId);
                            privateData.reconnectTimeoutId = null;

                            if (textStatus === "abort") {
                                connection.log("Aborted xhr request.");
                                return;
                            }

                            if (!tryFailConnect(error)) {

                                // Increment our reconnect errors, we assume all errors to be reconnect errors
                                // In the case that it's our first error this will cause Reconnect to be fired
                                // after 1 second due to reconnectErrors being = 1.
                                reconnectErrors++;

                                if (connection.state !== signalR.connectionState.reconnecting) {
                                    connection.log("An error occurred using longPolling. Status = " + textStatus + ".  Response = " + data.responseText + ".");
                                    $(instance).triggerHandler(events.onError, [error]);
                                }

                                // We check the state here to verify that we're not in an invalid state prior to verifying Reconnect.
                                // If we're not in connected or reconnecting then the next ensureReconnectingState check will fail and will return.
                                // Therefore we don't want to change that failure code path.
                                if ((connection.state === signalR.connectionState.connected ||
                                    connection.state === signalR.connectionState.reconnecting) &&
                                    !transportLogic.verifyLastActive(connection)) {
                                    return;
                                }

                                // Transition into the reconnecting state
                                // If this fails then that means that the user transitioned the connection into the disconnected or connecting state within the above error handler trigger.
                                if (!transportLogic.ensureReconnectingState(instance)) {
                                    return;
                                }

                                // Call poll with the raiseReconnect flag as true after the reconnect delay
                                privateData.pollTimeoutId = window.setTimeout(function () {
                                    poll(instance, true);
                                }, that.reconnectDelay);
                            }
                        }
                    });

                    // This will only ever pass after an error has occured via the poll ajax procedure.
                    if (reconnecting && raiseReconnect === true) {
                        // We wait to reconnect depending on how many times we've failed to reconnect.
                        // This is essentially a heuristic that will exponentially increase in wait time before
                        // triggering reconnected.  This depends on the "error" handler of Poll to cancel this 
                        // timeout if it triggers before the Reconnected event fires.
                        // The Math.min at the end is to ensure that the reconnect timeout does not overflow.
                        privateData.reconnectTimeoutId = window.setTimeout(function () { fireReconnected(instance); }, Math.min(1000 * (Math.pow(2, reconnectErrors) - 1), maxFireReconnectedTimeout));
                    }
                }(connection));
            }, 250); // Have to delay initial poll so Chrome doesn't show loader spinner in tab
        },

        lostConnection: function (connection) {
            if (connection.pollXhr) {
                connection.pollXhr.abort("lostConnection");
            }
        },

        send: function (connection, data) {
            transportLogic.ajaxSend(connection, data);
        },

        stop: function (connection) {
            /// <summary>Stops the long polling connection</summary>
            /// <param name="connection" type="signalR">The SignalR connection to stop</param>

            window.clearTimeout(connection._.pollTimeoutId);
            window.clearTimeout(connection._.reconnectTimeoutId);

            delete connection._.pollTimeoutId;
            delete connection._.reconnectTimeoutId;

            if (connection.pollXhr) {
                connection.pollXhr.abort();
                connection.pollXhr = null;
                delete connection.pollXhr;
            }
        },

        abort: function (connection, async) {
            transportLogic.ajaxAbort(connection, async);
        }
    };

}(window.jQuery, window));
/* jquery.signalR.hubs.js */
// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.md in the project root for license information.

/*global window:false */
/// <reference path="jquery.signalR.core.js" />

(function ($, window, undefined) {

    var eventNamespace = ".hubProxy",
        signalR = $.signalR;

    function makeEventName(event) {
        return event + eventNamespace;
    }

    // Equivalent to Array.prototype.map
    function map(arr, fun, thisp) {
        var i,
            length = arr.length,
            result = [];
        for (i = 0; i < length; i += 1) {
            if (arr.hasOwnProperty(i)) {
                result[i] = fun.call(thisp, arr[i], i, arr);
            }
        }
        return result;
    }

    function getArgValue(a) {
        return $.isFunction(a) ? null : ($.type(a) === "undefined" ? null : a);
    }

    function hasMembers(obj) {
        for (var key in obj) {
            // If we have any properties in our callback map then we have callbacks and can exit the loop via return
            if (obj.hasOwnProperty(key)) {
                return true;
            }
        }

        return false;
    }

    function clearInvocationCallbacks(connection, error) {
        /// <param name="connection" type="hubConnection" />
        var callbacks = connection._.invocationCallbacks,
            callback;

        if (hasMembers(callbacks)) {
            connection.log("Clearing hub invocation callbacks with error: " + error + ".");
        }

        // Reset the callback cache now as we have a local var referencing it
        connection._.invocationCallbackId = 0;
        delete connection._.invocationCallbacks;
        connection._.invocationCallbacks = {};

        // Loop over the callbacks and invoke them.
        // We do this using a local var reference and *after* we've cleared the cache
        // so that if a fail callback itself tries to invoke another method we don't 
        // end up with its callback in the list we're looping over.
        for (var callbackId in callbacks) {
            callback = callbacks[callbackId];
            callback.method.call(callback.scope, { E: error });
        }
    }

    // hubProxy
    function hubProxy(hubConnection, hubName) {
        /// <summary>
        ///     Creates a new proxy object for the given hub connection that can be used to invoke
        ///     methods on server hubs and handle client method invocation requests from the server.
        /// </summary>
        return new hubProxy.fn.init(hubConnection, hubName);
    }

    hubProxy.fn = hubProxy.prototype = {
        init: function (connection, hubName) {
            this.state = {};
            this.connection = connection;
            this.hubName = hubName;
            this._ = {
                callbackMap: {}
            };
        },

        constructor: hubProxy,

        hasSubscriptions: function () {
            return hasMembers(this._.callbackMap);
        },

        on: function (eventName, callback) {
            /// <summary>Wires up a callback to be invoked when a invocation request is received from the server hub.</summary>
            /// <param name="eventName" type="String">The name of the hub event to register the callback for.</param>
            /// <param name="callback" type="Function">The callback to be invoked.</param>
            var that = this,
                callbackMap = that._.callbackMap;

            // Normalize the event name to lowercase
            eventName = eventName.toLowerCase();

            // If there is not an event registered for this callback yet we want to create its event space in the callback map.
            if (!callbackMap[eventName]) {
                callbackMap[eventName] = {};
            }

            // Map the callback to our encompassed function
            callbackMap[eventName][callback] = function (e, data) {
                callback.apply(that, data);
            };

            $(that).bind(makeEventName(eventName), callbackMap[eventName][callback]);

            return that;
        },

        off: function (eventName, callback) {
            /// <summary>Removes the callback invocation request from the server hub for the given event name.</summary>
            /// <param name="eventName" type="String">The name of the hub event to unregister the callback for.</param>
            /// <param name="callback" type="Function">The callback to be invoked.</param>
            var that = this,
                callbackMap = that._.callbackMap,
                callbackSpace;

            // Normalize the event name to lowercase
            eventName = eventName.toLowerCase();

            callbackSpace = callbackMap[eventName];

            // Verify that there is an event space to unbind
            if (callbackSpace) {
                // Only unbind if there's an event bound with eventName and a callback with the specified callback
                if (callbackSpace[callback]) {
                    $(that).unbind(makeEventName(eventName), callbackSpace[callback]);

                    // Remove the callback from the callback map
                    delete callbackSpace[callback];

                    // Check if there are any members left on the event, if not we need to destroy it.
                    if (!hasMembers(callbackSpace)) {
                        delete callbackMap[eventName];
                    }
                } else if (!callback) { // Check if we're removing the whole event and we didn't error because of an invalid callback
                    $(that).unbind(makeEventName(eventName));

                    delete callbackMap[eventName];
                }
            }

            return that;
        },

        invoke: function (methodName) {
            /// <summary>Invokes a server hub method with the given arguments.</summary>
            /// <param name="methodName" type="String">The name of the server hub method.</param>

            var that = this,
                connection = that.connection,
                args = $.makeArray(arguments).slice(1),
                argValues = map(args, getArgValue),
                data = { H: that.hubName, M: methodName, A: argValues, I: connection._.invocationCallbackId },
                d = $.Deferred(),
                callback = function (minResult) {
                    var result = that._maximizeHubResponse(minResult),
                        source,
                        error;

                    // Update the hub state
                    $.extend(that.state, result.State);

                    if (result.Progress) {
                        if (d.notifyWith) {
                            // Progress is only supported in jQuery 1.7+
                            d.notifyWith(that, [result.Progress.Data]);
                        } else if(!connection._.progressjQueryVersionLogged) {
                            connection.log("A hub method invocation progress update was received but the version of jQuery in use (" + $.prototype.jquery + ") does not support progress updates. Upgrade to jQuery 1.7+ to receive progress notifications.");
                            connection._.progressjQueryVersionLogged = true;
                        }
                    } else if (result.Error) {
                        // Server hub method threw an exception, log it & reject the deferred
                        if (result.StackTrace) {
                            connection.log(result.Error + "\n" + result.StackTrace + ".");
                        }

                        // result.ErrorData is only set if a HubException was thrown
                        source = result.IsHubException ? "HubException" : "Exception";
                        error = signalR._.error(result.Error, source);
                        error.data = result.ErrorData;

                        connection.log(that.hubName + "." + methodName + " failed to execute. Error: " + error.message);
                        d.rejectWith(that, [error]);
                    } else {
                        // Server invocation succeeded, resolve the deferred
                        connection.log("Invoked " + that.hubName + "." + methodName);
                        d.resolveWith(that, [result.Result]);
                    }
                };

            connection._.invocationCallbacks[connection._.invocationCallbackId.toString()] = { scope: that, method: callback };
            connection._.invocationCallbackId += 1;

            if (!$.isEmptyObject(that.state)) {
                data.S = that.state;
            }

            connection.log("Invoking " + that.hubName + "." + methodName);
            connection.send(data);

            return d.promise();
        },

        _maximizeHubResponse: function (minHubResponse) {
            return {
                State: minHubResponse.S,
                Result: minHubResponse.R,
                Progress: minHubResponse.P ? {
                    Id: minHubResponse.P.I,
                    Data: minHubResponse.P.D
                } : null,
                Id: minHubResponse.I,
                IsHubException: minHubResponse.H,
                Error: minHubResponse.E,
                StackTrace: minHubResponse.T,
                ErrorData: minHubResponse.D
            };
        }
    };

    hubProxy.fn.init.prototype = hubProxy.fn;

    // hubConnection
    function hubConnection(url, options) {
        /// <summary>Creates a new hub connection.</summary>
        /// <param name="url" type="String">[Optional] The hub route url, defaults to "/signalr".</param>
        /// <param name="options" type="Object">[Optional] Settings to use when creating the hubConnection.</param>
        var settings = {
            qs: null,
            logging: false,
            useDefaultPath: true
        };

        $.extend(settings, options);

        if (!url || settings.useDefaultPath) {
            url = (url || "") + "/signalr";
        }
        return new hubConnection.fn.init(url, settings);
    }

    hubConnection.fn = hubConnection.prototype = $.connection();

    hubConnection.fn.init = function (url, options) {
        var settings = {
                qs: null,
                logging: false,
                useDefaultPath: true
            },
            connection = this;

        $.extend(settings, options);

        // Call the base constructor
        $.signalR.fn.init.call(connection, url, settings.qs, settings.logging);

        // Object to store hub proxies for this connection
        connection.proxies = {};

        connection._.invocationCallbackId = 0;
        connection._.invocationCallbacks = {};

        // Wire up the received handler
        connection.received(function (minData) {
            var data, proxy, dataCallbackId, callback, hubName, eventName;
            if (!minData) {
                return;
            }

            // We have to handle progress updates first in order to ensure old clients that receive
            // progress updates enter the return value branch and then no-op when they can't find
            // the callback in the map (because the minData.I value will not be a valid callback ID)
            if (typeof (minData.P) !== "undefined") {
                // Process progress notification
                dataCallbackId = minData.P.I.toString();
                callback = connection._.invocationCallbacks[dataCallbackId];
                if (callback) {
                    callback.method.call(callback.scope, minData);
                }
            } else if (typeof (minData.I) !== "undefined") {
                // We received the return value from a server method invocation, look up callback by id and call it
                dataCallbackId = minData.I.toString();
                callback = connection._.invocationCallbacks[dataCallbackId];
                if (callback) {
                    // Delete the callback from the proxy
                    connection._.invocationCallbacks[dataCallbackId] = null;
                    delete connection._.invocationCallbacks[dataCallbackId];

                    // Invoke the callback
                    callback.method.call(callback.scope, minData);
                }
            } else {
                data = this._maximizeClientHubInvocation(minData);

                // We received a client invocation request, i.e. broadcast from server hub
                connection.log("Triggering client hub event '" + data.Method + "' on hub '" + data.Hub + "'.");

                // Normalize the names to lowercase
                hubName = data.Hub.toLowerCase();
                eventName = data.Method.toLowerCase();

                // Trigger the local invocation event
                proxy = this.proxies[hubName];

                // Update the hub state
                $.extend(proxy.state, data.State);
                $(proxy).triggerHandler(makeEventName(eventName), [data.Args]);
            }
        });

        connection.error(function (errData, origData) {
            var callbackId, callback;

            if (!origData) {
                // No original data passed so this is not a send error
                return;
            }

            callbackId = origData.I;
            callback = connection._.invocationCallbacks[callbackId];

            // Verify that there is a callback bound (could have been cleared)
            if (callback) {
                // Delete the callback
                connection._.invocationCallbacks[callbackId] = null;
                delete connection._.invocationCallbacks[callbackId];

                // Invoke the callback with an error to reject the promise
                callback.method.call(callback.scope, { E: errData });
            }
        });

        connection.reconnecting(function () {
            if (connection.transport && connection.transport.name === "webSockets") {
                clearInvocationCallbacks(connection, "Connection started reconnecting before invocation result was received.");
            }
        });

        connection.disconnected(function () {
            clearInvocationCallbacks(connection, "Connection was disconnected before invocation result was received.");
        });
    };

    hubConnection.fn._maximizeClientHubInvocation = function (minClientHubInvocation) {
        return {
            Hub: minClientHubInvocation.H,
            Method: minClientHubInvocation.M,
            Args: minClientHubInvocation.A,
            State: minClientHubInvocation.S
        };
    };

    hubConnection.fn._registerSubscribedHubs = function () {
        /// <summary>
        ///     Sets the starting event to loop through the known hubs and register any new hubs 
        ///     that have been added to the proxy.
        /// </summary>
        var connection = this;

        if (!connection._subscribedToHubs) {
            connection._subscribedToHubs = true;
            connection.starting(function () {
                // Set the connection's data object with all the hub proxies with active subscriptions.
                // These proxies will receive notifications from the server.
                var subscribedHubs = [];

                $.each(connection.proxies, function (key) {
                    if (this.hasSubscriptions()) {
                        subscribedHubs.push({ name: key });
                        connection.log("Client subscribed to hub '" + key + "'.");
                    }
                });

                if (subscribedHubs.length === 0) {
                    connection.log("No hubs have been subscribed to.  The client will not receive data from hubs.  To fix, declare at least one client side function prior to connection start for each hub you wish to subscribe to.");
                }

                connection.data = connection.json.stringify(subscribedHubs);
            });
        }
    };

    hubConnection.fn.createHubProxy = function (hubName) {
        /// <summary>
        ///     Creates a new proxy object for the given hub connection that can be used to invoke
        ///     methods on server hubs and handle client method invocation requests from the server.
        /// </summary>
        /// <param name="hubName" type="String">
        ///     The name of the hub on the server to create the proxy for.
        /// </param>

        // Normalize the name to lowercase
        hubName = hubName.toLowerCase();

        var proxy = this.proxies[hubName];
        if (!proxy) {
            proxy = hubProxy(this, hubName);
            this.proxies[hubName] = proxy;
        }

        this._registerSubscribedHubs();

        return proxy;
    };

    hubConnection.fn.init.prototype = hubConnection.fn;

    $.hubConnection = hubConnection;

}(window.jQuery, window));
/* jquery.signalR.version.js */
// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.md in the project root for license information.

/*global window:false */
/// <reference path="jquery.signalR.core.js" />
(function ($, undefined) {
    $.signalR.version = "2.2.0";
}(window.jQuery));

/*!
 * ASP.NET SignalR JavaScript Library v2.2.0
 * http://signalr.net/
 *
 * Copyright Microsoft Open Technologies, Inc. All rights reserved.
 * Licensed under the Apache 2.0
 * https://github.com/SignalR/SignalR/blob/master/LICENSE.md
 *
 */

/// <reference path="..\..\SignalR.Client.JS\Scripts\jquery-1.6.4.js" />
/// <reference path="jquery.signalR.js" />
(function ($, window, undefined) {
    /// <param name="$" type="jQuery" />
    "use strict";

    if (typeof ($.signalR) !== "function") {
        throw new Error("SignalR: SignalR is not loaded. Please ensure jquery.signalR-x.js is referenced before ~/signalr/js.");
    }

    var signalR = $.signalR;

    function makeProxyCallback(hub, callback) {
        return function () {
            // Call the client hub method
            callback.apply(hub, $.makeArray(arguments));
        };
    }

    function registerHubProxies(instance, shouldSubscribe) {
        var key, hub, memberKey, memberValue, subscriptionMethod;

        for (key in instance) {
            if (instance.hasOwnProperty(key)) {
                hub = instance[key];

                if (!(hub.hubName)) {
                    // Not a client hub
                    continue;
                }

                if (shouldSubscribe) {
                    // We want to subscribe to the hub events
                    subscriptionMethod = hub.on;
                } else {
                    // We want to unsubscribe from the hub events
                    subscriptionMethod = hub.off;
                }

                // Loop through all members on the hub and find client hub functions to subscribe/unsubscribe
                for (memberKey in hub.client) {
                    if (hub.client.hasOwnProperty(memberKey)) {
                        memberValue = hub.client[memberKey];

                        if (!$.isFunction(memberValue)) {
                            // Not a client hub function
                            continue;
                        }

                        subscriptionMethod.call(hub, memberKey, makeProxyCallback(hub, memberValue));
                    }
                }
            }
        }
    }

    $.hubConnection.prototype.createHubProxies = function () {
        var proxies = {};
        this.starting(function () {
            // Register the hub proxies as subscribed
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, true);

            this._registerSubscribedHubs();
        }).disconnected(function () {
            // Unsubscribe all hub proxies when we "disconnect".  This is to ensure that we do not re-add functional call backs.
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, false);
        });

        proxies['transvaultHub'] = this.createHubProxy('transvaultHub'); 
        proxies['transvaultHub'].client = { };
        proxies['transvaultHub'].server = {
            cancelTransaction: function (apiKey, correlationId) {
                return proxies['transvaultHub'].invoke.apply(proxies['transvaultHub'], $.merge(["CancelTransaction"], $.makeArray(arguments)));
             },

            registerClientWithApiKey: function (apiKey) {
                return proxies['transvaultHub'].invoke.apply(proxies['transvaultHub'], $.merge(["RegisterClientWithApiKey"], $.makeArray(arguments)));
             }
        };

        return proxies;
    };

    signalR.hub = $.hubConnection("/hp/v3/adapters/transvault", { useDefaultPath: false });
    $.extend(signalR, signalR.hub.createHubProxies());

}(window.jQuery, window));
(function() {

    "use strict";
    /*
     * setup patterns
     */
    var patterns = {};
    patterns.isNumber = "[0-9]+";
    patterns.isNotEmpty = "\S+";
    patterns.isEmail = ".+\@.+\..+";

    /*
     * setup urls
     */
    var shouldMatch = function(value, regex, message) {

        if (typeof value === "undefined") {
            throw new TypeError("Property cannot be undefined.");
        }

        value = value + "";

        var pattern = new RegExp(regex);

        if (!pattern.test(value)) {
            throw new Error(message);
        }

    };

    /*
     * findElement
     */
    var findCount = 0;
    var findDeferred = jQuery.Deferred();
    var findElement = function(id) {

        if (id.nodeType) {
            findDeferred.resolve(id);
            return findDeferred;
        }

        if (!!document.getElementById(id)) {
            findDeferred.resolve(document.getElementById(id));
            return findDeferred;
        }

        setTimeout(function() {
            if (findCount < 25) {
                findCount++;
                findElement(id);
            } else {
                findDeferred.reject();
            }
        }, 25);

        return findDeferred;

    };

    /*
     * Query help
     */
    var toQueryString = function(obj) {

        var parts = [],
            url = "";

        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
            }
        }

        url = "&" + parts.join("&");

        return url;
    };

    /*
     * Export "hp"
     */
    window.hp = {};

    /*
     * hp Types
     */
    hp.types = {};
    hp.types.Event = "Event";
    hp.types.Product = "Product";
    hp.types.Adapter = "Adapter";

    /*
     * hp Models
     */
    hp.models = {};

    hp.models.Item = function(label, price) {
        this.label = label;
        this.price = parseFloat(price, 2);
    };

    /*
     * Options
     * @param: merchantClientId 
     * @param: merchantPrimaryEmail
     * @param: merchantSecondaryEmail
     * @param: showMemoField
     * @param: merchantGoogleAnalytics
     * @param: customOrderId
     * @param: customFormName
     */
    hp.models.Options = function(merchantClientId, merchantPrimaryEmail, merchantSecondaryEmail, showMemoField, merchantGoogleAnalytics, customOrderId, customFormName, customSubjectLine) {

        this.name = customFormName || "Checkout";
        this.CID = merchantClientId;
        this.email = merchantPrimaryEmail;

        shouldMatch(this.CID, patterns.isNumber, "Client ID should be digits only.");
        shouldMatch(this.email, patterns.isEmail, "Primary email should be a valid email address.");

        if (typeof merchantGoogleAnalytics !== "undefined") {
            this.ga = merchantGoogleAnalytics;
        }

        if (typeof customSubjectLine !== "undefined") {
            this.subject = customSubjectLine;
        }

        if (typeof merchantSecondaryEmail !== "undefined") {
            this.repoEmail = merchantSecondaryEmail;
            shouldMatch(this.repoEmail, patterns.isEmail, "Secondary email should be a valid email address.");
        }

        if (typeof showMemoField !== "undefined") {
            this.showMemoField = showMemoField.toString().toLowerCase() === "true" ? "True" : "False";
        }

        if (typeof customOrderId !== "undefined") {
            this.orderId = customOrderId;
            shouldMatch(this.orderId, patterns.isNumber, "Customer order Id must be a valid number.");
        }

    };

    /*
     * Setup
     * @param: type 
     * @param: model
     */
    hp.Setup = function(type, options) {

        if (!(type in hp.types)) {
            throw new Error("Please specify type. 'hp.Types.Event' or 'hp.Types.Product'");
        }

        this.type = type;
        this.options = options;

        this.hasItems = false;

        this.items = {
            priceLabels: "",
            price: ""
        };

    };

    /*
     * addItem (prototype)
     * @param: item 
     */
    hp.Setup.prototype.addItem = function(item) {
        this.items.priceLabels += (this.items.price === "" ? "" : ",") + item.label;
        this.items.price += (this.items.price === "" ? "" : ",") + item.price;
        this.hasItems = true;
        return this;
    };

    /*
     * createForm (prototype)
     * @param: containerElementId 
     */
    hp.Setup.prototype.createForm = function(containerElementId, baseUrl) {

        var deferred = jQuery.Deferred();
        var iframe = document.createElement("iframe");
        var href = document.createElement("a");
        href.href = baseUrl;

        iframe.setAttribute("seamless", "seamless");
        iframe.setAttribute("marginheight", "0");
        iframe.setAttribute("marginwidth", "0");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("horizontalscrolling", "no");
        iframe.setAttribute("verticalscrolling", "no");
        iframe.style.overflowY = "hidden";
        iframe.style.border = "none";
        iframe.width = "640";
        iframe.className = "inactive";

        iframe.style.opacity = "0";
        iframe.style.transition = "all 450ms 25ms cubic-bezier(0.175, 0.885, 0.320, 1)";
        iframe.style.webkitTransition = "all 450ms 25ms cubic-bezier(0.175, 0.885, 0.320, 1)";
        iframe.style.mozTransition = "all 450ms 25ms cubic-bezier(0.175, 0.885, 0.320, 1)";
        iframe.style.msTransition = "all 450ms 25ms cubic-bezier(0.175, 0.885, 0.320, 1)";
        iframe.style.oTransition = "all 450ms 25ms cubic-bezier(0.175, 0.885, 0.320, 1)";

        var url = href.protocol + "//" + href.host;

        if (this.type == hp.types.Event) {
            url = url + "/hp/v1/event";
            iframe.height = "1311";
        }

        if (this.type == hp.types.Product) {
            url = url + "/hp/v1/item";
            iframe.height = "1220";
        }

        url = url + "?" + toQueryString(this.options);

        if (!this.hasItems) {
            url = url + "&price=0";
        } else {
            url = url + toQueryString(this.items);
        }

        iframe.src = url
            .replace("item?&", "item?")
            .replace("event?&", "event?")
            .toString();

        iframe.onload = function() {
            deferred.resolve(iframe);
            iframe.className = "active";
            iframe.style.opacity = "1";
        };

        findElement(containerElementId).then(function(element) {
            element.appendChild(iframe);
        });

        return deferred;

    };

    $(function(){
        $("[data-inventory], [data-event]").hp();
    });

})();

(function($, window, document, undefined) {

    "use strict";

    // Production steps of ECMA-262, Edition 5, 15.4.4.19
    // Reference: http://es5.github.io/#x15.4.4.19
    if (!Array.prototype.map) {

        Array.prototype.map = function(callback, thisArg) {

            var T, A, k;

            if (this === null) {
                throw new TypeError(' this is null or not defined');
            }

            // 1. Let O be the result of calling ToObject passing the |this| 
            //    value as the argument.
            var O = Object(this);

            // 2. Let lenValue be the result of calling the Get internal 
            //    method of O with the argument "length".
            // 3. Let len be ToUint32(lenValue).
            var len = O.length >>> 0;

            // 4. If IsCallable(callback) is false, throw a TypeError exception.
            // See: http://es5.github.com/#x9.11
            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function');
            }

            // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
            if (arguments.length > 1) {
                T = thisArg;
            }

            // 6. Let A be a new array created as if by the expression new Array(len) 
            //    where Array is the standard built-in constructor with that name and 
            //    len is the value of len.
            A = new Array(len);

            // 7. Let k be 0
            k = 0;

            // 8. Repeat, while k < len
            while (k < len) {

                var kValue, mappedValue;

                // a. Let Pk be ToString(k).
                //   This is implicit for LHS operands of the in operator
                // b. Let kPresent be the result of calling the HasProperty internal 
                //    method of O with argument Pk.
                //   This step can be combined with c
                // c. If kPresent is true, then
                if (k in O) {

                    // i. Let kValue be the result of calling the Get internal 
                    //    method of O with argument Pk.
                    kValue = O[k];

                    // ii. Let mappedValue be the result of calling the Call internal 
                    //     method of callback with T as the this value and argument 
                    //     list containing kValue, k, and O.
                    mappedValue = callback.call(T, kValue, k, O);

                    // iii. Call the DefineOwnProperty internal method of A with arguments
                    // Pk, Property Descriptor
                    // { Value: mappedValue,
                    //   Writable: true,
                    //   Enumerable: true,
                    //   Configurable: true },
                    // and false.

                    // In browsers that support Object.defineProperty, use the following:
                    // Object.defineProperty(A, k, {
                    //   value: mappedValue,
                    //   writable: true,
                    //   enumerable: true,
                    //   configurable: true
                    // });

                    // For best browser support, use the following:
                    A[k] = mappedValue;
                }
                // d. Increase k by 1.
                k++;
            }

            // 9. return A
            return A;
        };
    }

    if (!Function.prototype.clone) {

        Function.prototype.clone = function() {
            var cloneObj = this;
            if (this.__isClone) {
                cloneObj = this.__clonedFrom;
            }

            var temp = function() {
                return cloneObj.apply(this, arguments);
            };
            for (var key in this) {
                temp[key] = this[key];
            }

            temp.__isClone = true;
            temp.__clonedFrom = cloneObj;

            return temp;
        };

    }

    if (!String.prototype.startsWith) {

        String.prototype.startsWith = function(searchString, position) {
            position = position || 0;
            return this.indexOf(searchString, position) === position;
        };

    }

    if (!String.prototype.includes) {

        String.prototype.includes = function() {
            return String.prototype.indexOf.apply(this, arguments) !== -1;
        };

    }

    if (!String.prototype.startsWith) {

        String.prototype.startsWith = function(searchString, position) {
            position = position || 0;
            return this.indexOf(searchString, position) === position;
        };

    }

    if (!Date.prototype.toISOString) {
        (function() {

            function pad(number) {
                var r = String(number);
                if (r.length === 1) {
                    r = '0' + r;
                }
                return r;
            }

            Date.prototype.toISOString = function() {
                return this.getUTCFullYear() + '-' + pad(this.getUTCMonth() + 1) + '-' + pad(this.getUTCDate()) + 'T' + pad(this.getUTCHours()) + ':' + pad(this.getUTCMinutes()) + ':' + pad(this.getUTCSeconds()) + '.' + String((this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5) + 'Z';
            };

        }());
    }

    /*
     * Export "hp"
     */
    window.hp = hp || {};
    window.hp.Utils = hp.Utils || {};

    // exposes defaults
    hp.Utils.defaults = {};

    // exposes plugins
    hp.Utils.plugins = {};

    // entry type
    hp.EntryType = {};
    hp.EntryType.DEVICE_CAPTURED = "DEVICE_CAPTURED";
    hp.EntryType.KEYED_CARD_PRESENT = "KEYED_CARD_PRESENT";
    hp.EntryType.KEYED_CARD_NOT_PRESENT = "KEYED_CARD_NOT_PRESENT";

    // entry type
    hp.PaymentType = {};
    hp.PaymentType.CHARGE = "CHARGE";
    hp.PaymentType.REFUND = "REFUND";
    hp.PaymentType.CREATE_INSTRUMENT = "CREATE_INSTRUMENT";
    hp.PaymentType.CANCEL = "CANCEL";
    hp.PaymentType.ISSUE = "ISSUE";
    hp.PaymentType.ADD_FUNDS = "ADD_FUNDS";

    // exposes payments (for split payment methods)
    hp.Utils.payments = [];

    // expose inital boolean for embeded instrument
    hp.Utils.hasPaymentInstrument = false;

    // A variety of CSS based identifiers
    var handleLegacyCssClassApplication = function(classPrefix, $form) {

        var activeClass = "hp-content-active",
            currentClass = "hp-form-" + classPrefix,
            $hp = $form.find(".hp");

        var $parent = $hp
            .removeClass("hp-form-emoney hp-form-transvault hp-form-bank hp-form-code hp-form-cc hp-form-gc hp-form-success hp-form-error")
            .addClass("hp hp-form")
            .addClass(currentClass);

        $parent.find(".hp-content").removeClass(activeClass);

        var $content = $parent.find(".hp-content-" + classPrefix).addClass(activeClass);

        setTimeout(function() {
            $form
                .find(".hp")
                .addClass("hp-active");
        }, 0);

        return {
            parent: $parent,
            content: $content
        };

    };

    var setEntryType = function(entryType) {

        var result = hp.EntryType.KEYED_CARD_NOT_PRESENT;

        entryType = entryType.toString().toLowerCase().replace(/_/gi, "");

        switch (entryType) {
            case "devicecaptured":
                result = hp.EntryType.DEVICE_CAPTURED;
                break;
            case "keyedcardpresent":
                result = hp.EntryType.KEYED_CARD_PRESENT;
                break;
            case "keyedcardnotpresent":
                result = hp.EntryType.KEYED_CARD_NOT_PRESENT;
                break;
            default:
                result = hp.EntryType.KEYED_CARD_NOT_PRESENT;
        }

        return result;

    };

    var setPaymentType = function(paymentType) {

        var result = hp.PaymentType.CHARGE;

        paymentType = paymentType.toString().toLowerCase().replace(/_/gi, "");

        switch (paymentType) {
            case "charge":
                result = hp.PaymentType.CHARGE;
                break;
            case "refund":
                result = hp.PaymentType.REFUND;
                break;
            default:
                result = hp.PaymentType.CHARGE;
        }

        return result;

    };

    var log = function() {

        if (typeof console !== "undefined" && typeof console.log !== "undefined") {

            var args = Array.prototype.slice.call(arguments);

            for (var i = 0; i < args.length; i++) {

                var val = args[i];

                if (typeof val === "string") {
                    args[i] = "Hosted Payments v3 (debug): " + val;
                }

            }

            console.log.apply(console, args);
            return;
        }

    };

    var getVersion = function() {
        return hp.Utils.defaults.version;
    };

    var setVersion = function(version) {
        hp.Utils.defaults.version = version;
    };

    var setPaymentInstrument = function() {
        if (typeof hp.Utils.defaults.instrumentId !== "undefined" && hp.Utils.defaults.instrumentId !== "") {
            hp.Utils.hasPaymentInstrument = true;
            return;
        }

        hp.Utils.hasPaymentInstrument = false;
    };

    var generateGuild = function() {

        var d = null;

        if (window.performance && window.performance.now) {
            d = window.performance.now();
        } else if (Date.now) {
            d = Date.now();
        } else {
            d = new Date().getTime();
        }

        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });

        return uuid;
    };

    var updateAvsInfo = function(avsStreet, avsZip) {

        if (typeof avsZip === "undefined") {
            avsZip = "";
        }

        if (typeof avsStreet === "undefined") {
            avsStreet = "";
        }

        hp.Utils.defaults.billingAddress.addressLine1 = avsStreet;
        hp.Utils.defaults.billingAddress.postalCode = avsZip;

    };

    var showLoader = function() {

        if ($(".hp-error-container").is(":visible")) {
            hideError();
        }

        $(".hp-loading-container").addClass("hp-loading-container-active");
    };

    var hideLoader = function() {
        $(".hp-loading-container").removeClass("hp-loading-container-active");
    };

    var showError = function(message) {

        if ($(".hp-loading-container").is(":visible")) {
            hideLoader();
        }

        $(".hp-error-container").addClass("hp-error-container-active");

        var $message = $(".hp-error-container .hp-error-message"),
            isArray = typeof message !== "undefined" && typeof message.push !== "undefined",
            list = "<p>Please review the following errors: </p><ul class=\"hp-error-message-list\">{{errors}}</ul>";

        if (isArray) {

            var errors = "";

            for (var i = 0; i < message.length; i++) {
                errors += "<li>" + message[i] + "</li>";
            }

            list = list.replace("{{errors}}", errors);

            $message.html(list);

        } else {
            $message.text(message);
        }

        $(".hp-error-container .hp-error-disclaimer a").on("click", hideError);

    };

    var hideError = function() {

        $(".hp-error-container").removeClass("hp-error-container-active");
        $(".hp-error-container .hp-error-disclaimer a").off("click");

        hp.Utils.defaults.onErrorDismissCallback();

    };

    // sets up iframe DOM
    var createInstance = function($element, callback) {

        // Create wrapping HTML
        var $wrapper = [
            '<div class="hp hp-form">',
                '<div class="hp-loading-container">',
                    '<span class="hp-loading-text">Loading</span>',
                    '<div class="hp-loading"><span></span><span></span><span></span><span></span></div>',
                '</div>',
                '<div class="hp-error-container">',
                    '<span class="hp-error-text">{{error}} </span>',
                    '<div class="hp-error-message"></div>',
                    '<hr />',
                    '<div class="hp-error-disclaimer">If you feel that the above error was made by a mistake please contact our support at {{phone}}. <br /><br /><a href="javascript:;">&times; Dismiss error</a></div>',
                '</div>',
                '<div class="hp-row">',
                    '<div class="hp-col hp-col-left">',
                        '<ul class="hp-nav">',
                        '{{nav}}',
                        '</ul>',
                        '<div class="hp-support">',
                            '<strong>Help &amp; support</strong>',
                            '<p>Having issues with your payments? Call us at {{phone}}.</p>',
                        '</div>',
                        '<div class="hp-secure">',
                            '<div class="hp-cards">',
                                '<img class="hp-cards-icons" src="https://cdn.rawgit.com/etsms/106383645ba54667a82be0a6af599d8c/raw/18bfa3c78067a3104ce0025911900b2813442da2/amex-card-icon.svg" alt="AMEX" />',
                                '<img class="hp-cards-icons" src="https://cdn.rawgit.com/etsms/6928189390fabc35274fb4c5e050d97a/raw/5ace5093fbd78be1f2ec1b1b3a98cf8a9ae847b8/diners-card-icon.svg" alt="Diners" />',
                                '<img class="hp-cards-icons" src="https://cdn.rawgit.com/etsms/97bdce0c2be41b5e3e7d42f665d7e579/raw/94e5724101103c8c427192cdf5e5e04581240b1f/discover-card-icon.svg" alt="Discover" />',
                                '<img class="hp-cards-icons" src="https://cdn.rawgit.com/etsms/4df8161921e2349011bd7129a647be60/raw/cd7984e257825f010ebd38448bcad762b353f216/jcb-card-icon.svg" alt="JCB" />',
                                '<img class="hp-cards-icons" src="https://cdn.rawgit.com/etsms/25c8538814ffa61a43cb86bd71601f92/raw/cd7c9ff69acd3cb77be6dca4e9ff65aa5e3b8d36/mastercard-card-icon.svg" alt="Master Card" />',
                                '<img class="hp-cards-icons" src="https://cdn.rawgit.com/etsms/8f367f38b7ffb77b1a1a7e13de9c2731/raw/086944f18033f96996e18aa03e1393565b0b16dc/visa-card-icon.svg" alt="VISA" />',
                                '<img class="hp-cards-icons" src="https://cdn.rawgit.com/etsms/c2568c3f7343be79032ac7a717fa80de/raw/7923fdf2aacffbc6baf62454cc4213b46b943596/emoney-card-icon.svg" alt="EMoney" />',
                                '<img class="hp-cards-icons" src="https://cdn.rawgit.com/etsms/cd2abb29142a84bb16fbeb3d07a7aefa/raw/a17760bdd23cf1d90c22c8a2235f8d6e6753663e/gift-card-icon.svg" alt="Gift Cards" />',
                            '</div>',
                            '<a class="hp-secure-icon" href="https://www.etsms.com/" target="_blank" title="ETS - Electronic Transaction Systems">',
                                '<img src="https://cdn.rawgit.com/etsms/a5b6be8ebd898748ec829538bd4b603e/raw/df1b8a1e296ea12b90742328d036848af19fef1f/secure-icon.svg" alt="Secured by ETS" />',
                            '</a>',
                            '<small class="hp-version">',
                                '<span class="' + (hp.Utils.getAmount() === 0 || hp.Utils.defaults.ignoreSubmission === true ? "hide " : "") + (hp.Utils.defaults.paymentType === hp.PaymentType.CHARGE ? "hp-version-charge" : "hp-version-refund") + '">' + (hp.Utils.defaults.paymentType === hp.PaymentType.CHARGE ? "Charge" : "Refund") + ' amount: <span class="hp-version-amount">' + hp.Utils.formatCurrency(hp.Utils.getAmount()) + '</span></span><br />',
                                'Hosted Payments ' + hp.Utils.getVersion(),
                            '</small>',
                        '</div>',
                    '</div>',
                    '<div class="hp-col hp-col-right">',
                        '{{order}}',
                        '<div class="hp-content hp-content-success">{{success}}</div>',
                    '</div>',
                '</div>',
            '</div>'
        ].join("");

        hp.Utils.plugins.CreditCard = new hp.CreditCard($element);
        hp.Utils.plugins.BankAccount = new hp.BankAccount($element);
        hp.Utils.plugins.Code = new hp.Code($element);
        hp.Utils.plugins.Success = new hp.Success($element);
        hp.Utils.plugins.Transvault = new hp.Transvault($element);
        hp.Utils.plugins.GiftCard = new hp.GiftCard($element);

        $element.html(
            $wrapper
            .replace("{{success}}", hp.Utils.plugins.Success
                .createTemplate()
                .replace("{{redirectLabel}}", hp.Utils.defaults.defaultRedirectLabel)
                .replace("{{successLabel}}", hp.Utils.defaults.defaultSuccessLabel)
            )
            .replace(/{{phone}}/gi, hp.Utils.defaults.defaultPhone)
            .replace("{{error}}", hp.Utils.defaults.defaultErrorLabel)
            .replace("{{order}}", hp.Utils.createOrder())
            .replace("{{nav}}", hp.Utils.createNav())
        );

        var $parent = $element.find(".hp"),
            $types = $parent.find(".hp-type"),
            activeClass = "hp-active";

        if (!$parent.length) {
            throw new Error("hosted-payments.js : Could not locate template.");
        }

        if (!$types.length) {
            throw new Error("hosted-payments.js : Could not locate template.");
        }

        $types.off("click").on("click", function(e) {

            e.preventDefault();

            var $this = $(this),
                currentIndex = $this.index();

            $types
                .removeClass(activeClass)
                .eq(currentIndex)
                .addClass(activeClass);

            // Wait for DOM to finish loading before querying
            $(function() {

                if (!!$this.attr("class").match(/hp-cc/gi)) {
                    callback(hp.Utils.plugins.CreditCard);
                }

                if (!!$this.attr("class").match(/hp-bank/gi)) {
                    callback(hp.Utils.plugins.BankAccount);
                }

                if (!!$this.attr("class").match(/hp-emoney/gi)) {
                    callback(hp.Utils.plugins.EMoney);
                }

                if (!!$this.attr("class").match(/hp-code/gi)) {

                    // Takes focus off link so that a swipe may occur on the HP element
                    $this.find("a").blur();

                    callback(hp.Utils.plugins.Code);
                }

                if (!!$this.attr("class").match(/hp-transvault/gi)) {
                    callback(hp.Utils.plugins.Transvault);
                }

                if (!!$this.attr("class").match(/hp-gc/gi)) {
                    callback(hp.Utils.plugins.GiftCard);
                }

            });


        }).eq(0).trigger("click");
    };

    // success page
    var showSuccessPage = function(delay) {

        var deferred = jQuery.Deferred(), 
            timeout = typeof delay === "undefined" ? 0 : delay;

        setTimeout(function() {

            hp.Utils.hideError();
            hp.Utils.hideLoader();
            hp.Utils.plugins.Success.init();

            $(".hp-col-left .hp-type")
                .off("click")
                .removeClass("hp-active");

            deferred.resolve();

        }, timeout);

        return deferred;
    };

    var setAmount = function(amount) {
        hp.Utils.defaults.amount = Math.abs(Math.round10(parseFloat(amount), -2));
        $(".hp.hp-form .hp-version-amount").text(formatCurrency(hp.Utils.defaults.amount));
    };

    var getAmount = function() {
        return hp.Utils.defaults.amount;
    };

    var createNav = function() {

        var defaultAreas = hp.Utils.defaults.paymentTypeOrder,
            html = '',
            creditCard = '',
            bankAccount = '',
            code = '',
            transvault = '',
            giftcard = '';

        if (defaultAreas.indexOf(0) >= 0) {
            creditCard = '<li class="hp-type hp-cc"><a href="javascript:void(0);"><img src="https://cdn.rawgit.com/etsms/9e2e4c55564ca8eba12f9fa3e7064299/raw/93965040e6e421e1851bfe7a15af92bdc722fa43/credt-card-icon.svg" alt="Credit Card" /> <span>Credit Card</span></a></li>';
        }

        if (defaultAreas.indexOf(1) >= 0) {
            bankAccount = '<li class="hp-type hp-bank"><a href="javascript:void(0);"><img src="https://cdn.rawgit.com/etsms/af49afe3c1c1cb41cb3204a45492bd47/raw/78e935c7e5290923dba15e8b595aef7c95b2292e/ach-icon.svg" alt="ACH and Bank Account" /> <span>Bank (ACH)</span></a></li>';
        }

        if (defaultAreas.indexOf(2) >= 0) {
            code = '<li class="hp-type hp-code"><a href="javascript:void(0);"><img src="https://cdn.rawgit.com/etsms/c70317acba59d3d5b60e5999d5feeab8/raw/764478d2660f97d002eb3bd3177b725a410f694d/swipe-icon.svg" alt="Swipe or Scan" /> <span>Swipe\\Scan</span></a></li>';
        }

        if (defaultAreas.indexOf(3) >= 0) {
            transvault = '<li class="hp-type hp-transvault"><a href="javascript:void(0);"><img src="https://cdn.rawgit.com/etsms/5363122967f20bd31d6630529cb17c3f/raw/0a0ae6a30247ced8ed5c0c85f2b42072b59b8fba/transvault-icon.svg" alt="Hosted Transvault" /> <span>Transvault</span></a></li>';
        }

        if (defaultAreas.indexOf(4) >= 0) {
            giftcard = '<li class="hp-type hp-gc"><a href="javascript:void(0);"><img src="https://cdn.rawgit.com/etsms/2e9f0f3bb754a7910ffbdbd16ea9926a/raw/27ce16494e375ff8d04deb918ffd76d743397488/gift-icon.svg" alt="Gift Card" /> <span>Gift Card</span></a></li>';
        }

        for (var i = 0; i < defaultAreas.length; i++) {

            if (defaultAreas[i] === 0) {
                html += creditCard;
            }

            if (defaultAreas[i] === 1) {
                html += bankAccount;
            }

            if (defaultAreas[i] === 2) {
                html += code;
            }

            if (defaultAreas[i] === 3) {
                html += transvault;
            }

            if (defaultAreas[i] === 4) {
                html += giftcard;
            }
        }

        return html;

    };

    var createOrder = function() {

        var defaultAreas = hp.Utils.defaults.paymentTypeOrder,
            html = '',
            creditCard = '',
            bankAccount = '',
            code = '',
            transvault = '',
            giftcard = '';

        if (defaultAreas.indexOf(0) >= 0) {
            creditCard = '<div class="hp-content hp-content-cc">{{creditCard}}</div>'.replace("{{creditCard}}", hp.Utils.plugins.CreditCard.createTemplate(hp.Utils.defaults.defaultCardCharacters, hp.Utils.defaults.defaultNameOnCardName, hp.Utils.defaults.defaultDateCharacters));
        }

        if (defaultAreas.indexOf(1) >= 0) {
            bankAccount = '<div class="hp-content hp-content-bank">{{bankAccount}}</div>'.replace("{{bankAccount}}", hp.Utils.plugins.BankAccount.createTemplate(hp.Utils.defaults.defaultName, hp.Utils.defaults.defaultAccountNumberCharacters, hp.Utils.defaults.defaultRoutingNumberCharacters));
        }

        if (defaultAreas.indexOf(2) >= 0) {
            code = '<div class="hp-content hp-content-code">{{code}}</div>'.replace("{{code}}", hp.Utils.plugins.Code.createTemplate(hp.Utils.defaults.defaultCardCharacters, hp.Utils.defaults.defaultNameOnCardNameSwipe, hp.Utils.defaults.defaultDateCharacters));
        }

        if (defaultAreas.indexOf(3) >= 0) {
            transvault = '<div class="hp-content hp-content-transvault">{{transvault}}</div>'.replace("{{transvault}}", hp.Utils.plugins.Transvault.createTemplate());
        }

        if (defaultAreas.indexOf(4) >= 0) {
            giftcard = '<div class="hp-content hp-content-gc">{{giftcard}}</div>'.replace("{{giftcard}}", hp.Utils.plugins.GiftCard.createTemplate(hp.Utils.defaults.defaultCardCharacters, hp.Utils.defaults.defaultNameOnCardName, ( +(new Date().getFullYear().toString().substring(2,4)) + 3 ) ));
        }

        for (var i = 0; i < defaultAreas.length; i++) {

            if (defaultAreas[i] === 0) {
                html += creditCard;
            }

            if (defaultAreas[i] === 1) {
                html += bankAccount;
            }

            if (defaultAreas[i] === 2) {
                html += code;
            }

            if (defaultAreas[i] === 3) {
                html += transvault;
            }

            if (defaultAreas[i] === 4) {
                html += giftcard;
            }
        }

        return html;
    };

    var setSession = function(session, isApiKey) {

        var currentSession = getSession();

        if (session.length <= 36 && !isApiKey) {
            currentSession.sessionToken = session;
        }

        if (isApiKey) {
            currentSession.apiKey = session;
        }

        hp.Utils.defaults.session = currentSession;

    };

    var getSession = function() {

        var currentSession = {};
        currentSession.sessionToken = "";
        currentSession.apiKey = "";

        currentSession.sessionToken = hp.Utils.defaults.session ? (hp.Utils.defaults.session.sessionToken ? hp.Utils.defaults.session.sessionToken : "") : "";
        currentSession.apiKey = hp.Utils.defaults.session ? (hp.Utils.defaults.session.apiKey ? hp.Utils.defaults.session.apiKey : "") : "";

        return currentSession;
    };

    var isEMoneyCardNumber = function(cardNumber) {

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function(str) {
                return this.slice(0, str.length) == str;
            };
        }

        return cardNumber.startsWith("627571");

    };

    var buildResultObjectByType = function(response) {

        var deferred = jQuery.Deferred();

        var isBankAccount = function(req) {

            var isBank = false;

            if (typeof req.properties !== "undefined" && typeof req.properties.accountNumber !== "undefined") {
                isBank = true;
            }

            return isBank;

        };

        var isEMoney = function(req) {

            if (isBankAccount(req)) {
                return false;
            }

            if (typeof req.type !== "undefined" && ((req.type.toLowerCase() === "emoney") || (req.type.toLowerCase() === "creditcard") || (req.type.toLowerCase() === "ach"))) {
                return true;
            }

            return false;

        };

        var isCreditCard = function(req) {

            if (isBankAccount(req)) {
                return false;
            }

            if (isEMoney(req)) {
                return false;
            }

            if (typeof req.properties !== "undefined" && typeof req.properties.cardNumber !== "undefined") {
                return true;
            }

            return false;

        };

        var isTrackAccount = function(req) {

            if (isBankAccount(req)) {
                return false;
            }

            if (isEMoney(req)) {
                return false;
            }

            if (isCreditCard(req)) {
                return false;
            }

            if (typeof req.properties !== "undefined" && (typeof req.properties.trackOne !== "undefined" || typeof req.properties.trackTwo !== "undefined" || typeof req.properties.trackThree !== "undefined")) {
                return true;
            }

            return false;

        };

        if (typeof response.splice === "function") {

            var responses = [],
                isCreateOnly = hp.Utils.getAmount() === 0;

            for (var i = 0; i < response.length; i++) {

                var res = response[i],
                    createdOn = (new Date()).toISOString(),
                    payment = res.request,
                    message = "Transaction processed.",
                    session = getSession(),
                    lastFour = "",
                    name = "",
                    type = "",
                    expirationDate = "",
                    isError = res.isException ? true : false,
                    status = "Success",
                    payload = payment.__request,
                    swipe = payment.__request.__swipe,
                    isAch = isBankAccount(payload),
                    isEm = isEMoney(payload),
                    isCC = isCreditCard(payload),
                    isTrack = isTrackAccount(payload),
                    isScan = (typeof swipe !== "undefined");

                // For BANK ACCOUNT objects
                if (isAch) {

                    message = "Transaction pending.";
                    lastFour = payload.properties.accountNumber.substr(payload.properties.accountNumber.length - 4) + "";
                    name = payload.name;
                    type = "ACH";

                }

                // For WALLET objects
                if (isEm) {

                    var reqType = payload.type.toLowerCase();

                    if (reqType === "ach") {
                        name = payload.bankName;
                        lastFour = payload.accountNumber.replace(/\*/gi, "");
                    } else if (reqType === "creditcard") {
                        name = payload.nameOnCard;
                        lastFour = payload.cardNumber.substr(payload.cardNumber.length - 4) + "";
                        expirationDate = payload.properties.expirationDate;
                    } else {
                        name = payload.email;
                        lastFour = payload.cardNumber.substr(payload.cardNumber.length - 4) + "";
                    }

                    type = "EMONEY";

                }

                // For Credit Card requests
                if (isCC) {

                    lastFour = payload.properties.cardNumber.substr(payload.properties.cardNumber.length - 4) + "";
                    name = payload.properties.nameOnCard;
                    type = $.payment.cardType(payload.properties.cardNumber).toUpperCase();
                    expirationDate = payload.properties.expirationDate;

                }

                if (isError) {
                    status = "Error";
                }

                if (isScan) {

                    lastFour = swipe.cardNumber.substr(swipe.cardNumber.length - 4);
                    name = swipe.nameOnCard;
                    type = $.payment.cardType(swipe.cardNumber).toUpperCase();
                    expirationDate = swipe.expMonth + "/" + swipe.expYear;

                }

                if (isCreateOnly) {
                    message = "Payment instrumented created.";
                } else if (hp.Utils.defaults.PaymentType === hp.PaymentType.REFUND) {
                    message = "Transaction refunded.";
                }

                var successResponse = {
                    "status": status,
                    "amount": payment.amount,
                    "message": (isError ? res.description : message),
                    "token": session.sessionToken,
                    "transaction_id": res.transactionId,
                    "transaction_approval_code": "",
                    "transaction_avs_street_passed": false,
                    "transaction_avs_postal_code_passed": false,
                    "transaction_currency": "USD$",
                    "transaction_status_indicator": "",
                    "transaction_type": hp.Utils.defaults.paymentType,
                    "transaction_tax": 0,
                    "transaction_surcharge": 0,
                    "transaction_gratuity": 0,
                    "transaction_cashback": 0,
                    "transaction_total": payment.amount,
                    "correlation_id": getCorrelationId(),
                    "instrument_id": payment.instrumentId,
                    "instrument_type": type,
                    "instrument_last_four": lastFour,
                    "instrument_expiration_date": expirationDate,
                    "instrument_verification_method": "",
                    "instrument_entry_type": hp.Utils.defaults.entryType,
                    "instrument_entry_type_description": isTrack ? "MAGNETIC_SWIPE" : "KEY_ENTRY",
                    "instrument_verification_results": "",
                    "created_on": createdOn,
                    "customer_name": name,
                    "customer_signature": "https://images.pmoney.com/00000000",
                    "anti_forgery_token": hp.Utils.defaults.antiForgeryToken,
                    "application_identifier": "Hosted Payments",
                    "application_response_code": "",
                    "application_issuer_data": ""
                };

                responses.push(successResponse);

            }

            if (isCreateOnly) {

                deferred.resolve(responses);

            } else {

                var responseCount = responses.length || 0,
                    currentCount = 0;

                $.each(responses, function(index) {

                    var statusRequest = {
                        "status": {
                            "statusRequest": {
                                "token": hp.Utils.getSession().sessionToken,
                                "transactionId": responses[index].transaction_id
                            }
                        }
                    };

                    hp.Utils.makeRequest(statusRequest).then(function(statusResponse) {

                        if (statusResponse.type === "Transaction" && typeof statusResponse.properties !== "undefined") {
                            var isACH = statusResponse.properties.accountType === "BankAccount";
                            responses[currentCount].transaction_approval_code = isACH ? "" : statusResponse.properties.approvalCode;
                            responses[currentCount].transaction_avs_postal_code_passed = isACH ? true : statusResponse.properties.postalCodeCheck;
                            responses[currentCount].transaction_avs_street_passed = isACH ? true : statusResponse.properties.addressLine1Check;
                            responses[currentCount].customer_signature = (statusResponse.properties.signatureRef === null || statusResponse.properties.signatureRef === undefined || statusResponse.properties.signatureRef === "") ? "https://images.pmoney.com/00000000" : statusResponse.properties.signatureRef;
                            responses[currentCount].message = (responses[currentCount].message + " " + (statusResponse.properties.message + ".")).toLowerCase().replace(" .", "");
                            responses[currentCount].instrument_verification_results = isACH ? false : true;
                            responses[currentCount].instrument_verification_method = isACH ? "" : "SIGNATURE";
                        }

                        currentCount = currentCount + 1;

                        if (currentCount === responseCount) {
                            deferred.resolve(responses);
                        }

                    });

                });

            }

        } else {
            var newResponse = [];
            newResponse.push(response);
            return buildResultObjectByType(newResponse);
        }

        return deferred;

    };

    var requestTypes = {};

    requestTypes.SIGN_IN = "signIn";
    requestTypes.SIGN_IN_REQUEST = "signInRequest";
    requestTypes.SIGN_IN_RESPONSE = "signInResponse";

    requestTypes.CHARGE = "charge";
    requestTypes.CHARGE_REQUEST = "chargeRequest";
    requestTypes.CHARGE_RESPONSE = "chargeResponse";

    requestTypes.REFUND = "refund";
    requestTypes.REFUND_REQUEST = "refundRequest";
    requestTypes.REFUND_RESPONSE = "refundResponse";

    requestTypes.TRANSVAULT = "transvault";
    requestTypes.TRANSVAULT_REQUEST = "transvaultRequest";
    requestTypes.TRANSVAULT_RESPONSE = "transvaultResponse";

    requestTypes.CREATE_PAYMENT_INSTRUMENT = "createPaymentInstrument";
    requestTypes.CREATE_PAYMENT_INSTRUMENT_REQUEST = "createPaymentInstrumentRequest";
    requestTypes.CREATE_PAYMENT_INSTRUMENT_RESPONSE = "createPaymentInstrumentResponse";

    requestTypes.WALLET = "wallet";
    requestTypes.WALLET_REQUEST = "walletRequest";
    requestTypes.WALLET_RESPONSE = "walletResponse";

    requestTypes.STATUS = "status";
    requestTypes.STATUS_REQUEST = "statusRequest";
    requestTypes.STATUS_RESPONSE = "statusResponse";

    var getObjectResponseFromData = function(data) {

        var memberName = "";
        var requestMemberName = "";
        var responseMemberName = "";
        var result = {};
        var isResponse = false;

        if (requestTypes.SIGN_IN in data) {
            memberName = requestTypes.SIGN_IN;
            requestMemberName = requestTypes.SIGN_IN_REQUEST;
            responseMemberName = requestTypes.SIGN_IN_RESPONSE;
        }

        if (requestTypes.CHARGE in data) {
            memberName = requestTypes.CHARGE;
            requestMemberName = requestTypes.CHARGE_REQUEST;
            responseMemberName = requestTypes.CHARGE_RESPONSE;
        }

        if (requestTypes.REFUND in data) {
            memberName = requestTypes.REFUND;
            requestMemberName = requestTypes.REFUND_REQUEST;
            responseMemberName = requestTypes.REFUND_RESPONSE;
        }

        if (requestTypes.TRANSVAULT in data) {
            memberName = requestTypes.TRANSVAULT;
            requestMemberName = requestTypes.TRANSVAULT_REQUEST;
            responseMemberName = requestTypes.TRANSVAULT_RESPONSE;
        }

        if (requestTypes.CREATE_PAYMENT_INSTRUMENT in data) {
            memberName = requestTypes.CREATE_PAYMENT_INSTRUMENT;
            requestMemberName = requestTypes.CREATE_PAYMENT_INSTRUMENT_REQUEST;
            responseMemberName = requestTypes.CREATE_PAYMENT_INSTRUMENT_RESPONSE;
        }

        if (requestTypes.WALLET in data) {
            memberName = requestTypes.WALLET;
            requestMemberName = requestTypes.WALLET_REQUEST;
            responseMemberName = requestTypes.WALLET_RESPONSE;
        }

        if (requestTypes.STATUS in data) {
            memberName = requestTypes.STATUS;
            requestMemberName = requestTypes.STATUS_REQUEST;
            responseMemberName = requestTypes.STATUS_RESPONSE;
        }

        if (requestTypes.CHARGE_RESPONSE in data) {
            memberName = requestTypes.CHARGE_RESPONSE;
            isResponse = true;
        }

        if (requestTypes.REFUND_RESPONSE in data) {
            memberName = requestTypes.REFUND_RESPONSE;
            isResponse = true;
        }

        if (requestTypes.TRANSVAULT_RESPONSE in data) {
            memberName = requestTypes.TRANSVAULT_RESPONSE;
            isResponse = true;
        }

        if (requestTypes.SIGN_IN_RESPONSE in data) {
            memberName = requestTypes.SIGN_IN_RESPONSE;
            isResponse = true;
        }

        if (requestTypes.CREATE_PAYMENT_INSTRUMENT_RESPONSE in data) {
            memberName = requestTypes.CREATE_PAYMENT_INSTRUMENT_RESPONSE;
            isResponse = true;
        }

        if (requestTypes.WALLET_RESPONSE in data) {
            memberName = requestTypes.WALLET_RESPONSE;
            isResponse = true;
        }

        if (requestTypes.STATUS_RESPONSE in data) {
            memberName = requestTypes.STATUS_RESPONSE;
            isResponse = true;
        }

        if (memberName === "") {
            throw new Error("hosted-payments.utils.js - Could not parse data from response/request object.");
        }

        if (!isResponse) {
            if (typeof data[memberName][responseMemberName] !== "undefined") {
                result = data[memberName][responseMemberName];
            } else if (typeof data[memberName][requestMemberName] !== "undefined") {
                result = data[memberName][requestMemberName];
            } else {
                throw new Error("hosted-payments.utils.js - Could not parse data from response/request object.");
            }
        } else {
            result = data[memberName];
        }

        return result;

    };

    var promptAvs = function($element) {

        var deferred = jQuery.Deferred();

        if (!hp.Utils.defaults.promptForAvs) {
            deferred.resolve();
            return deferred;
        }

        if (typeof $element === "undefined") {
            $element = $(".hp-form");
        }

        if ($element.find(".hp-avs-prompt").length) {
            $element.find(".hp-avs-prompt").remove();
        }

        setTimeout(function() {

            var template = [
                '<div class="hp-avs-prompt">',
                    '<div class="hp-avs-prompt-container">',
                        '<p>Billing Address</p>',
                        '<div class="hp-avs-prompt-left">',
                            '<label class="hp-label-avs" for="avsStreet">Address <span class="hp-avs-required">*</span></label>',
                            '<div class="hp-input hp-input-avs hp-input-avs-street">',
                                '<input placeholder="Street Address" value="' + hp.Utils.defaults.billingAddress.addressLine1 + '" name="avsStreet" id="avsStreet" autocomplete="on" type="text" pattern="\\d*">',
                            '</div>',
                        '</div>',
                        '<div class="hp-avs-prompt-right">',
                            '<div class="hp-pull-left">',
                                '<label class="hp-label-avs" for="avsZip">City</label>',
                                '<div class="hp-input hp-input-avs hp-input-avs-city">',
                                    '<input placeholder="City" autocomplete="on" type="text">',
                                '</div>',
                            '</div>',
                            '<div class="hp-pull-left">',
                                '<label class="hp-label-avs" for="avsZip">State</label>',
                                '<div class="hp-input hp-input-avs hp-input-avs-state">',
                                    '<input placeholder="State" autocomplete="on" type="text">',
                                '</div>',
                            '</div>',
                            '<div class="hp-pull-left">',
                                '<label class="hp-label-avs" for="avsZip">Zip <span class="hp-avs-required">*</span></label>',
                                '<div class="hp-input hp-input-avs hp-input-avs-zip">',
                                    '<input placeholder="Zipcode" value="' + hp.Utils.defaults.billingAddress.postalCode + '" name="avsZip" id="avsZip" autocomplete="on" type="text" pattern="\\d*">',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<br class="hp-break" />',
                        '<hr>',
                        '<button class="hp-submit hp-avs-submit">Submit Payment</button>',
                        hp.Utils.defaults.allowAvsSkip ? '<a class="hp-avs-skip" href="javascript:;">Skip \'Address Verification\'</a>' : '',
                    '</div>',
                '</div>'
            ].join("");

            $element.prepend(template);

            var $avsPrompt = $element.find(".hp-avs-prompt"),
                avsZipValue = "",
                avsStreetValue = "";

            var handleSubmit = function(e) {
                e.preventDefault();

                hp.Utils.updateAvsInfo(avsStreetValue, avsZipValue);

                $element.removeClass("hp-avs-active");
                $avsPrompt.removeClass("active");
                deferred.resolve();

                setTimeout(function(){
                    $element.find(".hp-avs-prompt").remove();
                }, 0);
            };

            $avsPrompt.find(".hp-input-avs input").on("focus blur keyup", function(e) {

                e.preventDefault();

                if ($(this).attr("name") === "avsStreet") {
                    avsStreetValue = $(this).val();
                }

                if ($(this).attr("name") === "avsZip") {
                    avsZipValue = $(this).val();
                }

                var keycode = (e.keyCode ? e.keyCode : e.which);
                                
                if (keycode === 13) {
                    handleSubmit(e);
                }

            });

            $avsPrompt.find(".hp-avs-submit").on("click", handleSubmit);

            if (hp.Utils.defaults.allowAvsSkip) {

                $avsPrompt.find(".hp-avs-skip").on("click", function(e) {
                    e.preventDefault();

                    $element.removeClass("hp-avs-active");
                    $avsPrompt.removeClass("active");
                    deferred.resolve();

                    setTimeout(function(){
                        $element.find(".hp-avs-prompt").remove();
                    }, 0);

                    hp.Utils.defaults.onAvsDismissCallback();

                });

            }

            $element.addClass("hp-avs-active");
            $avsPrompt.addClass("active");

        }, 0);

        $element.find(".hp-input-avs-street input").focus();

        return deferred;

    };

    // basic http requests
    var makeRequest = function(data, isSync) {

        var deferred = jQuery.Deferred();

        var requestObject = {
            url: hp.Utils.defaults.baseUrl + encodeURI("?dt=" + new Date().getTime()),
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            crossDomain: true,
            data: JSON.stringify(data)
        };

        if (hp.Utils.defaults.paymentService.toLowerCase() === "emoney") {
            requestObject.headers = {
                'X-EMoney-Manager': generateGuild()
            };
        }

        if (isSync) {
            requestObject.async = false;
        }

        $.ajax(requestObject).success(function(res) {

            var requestData = getObjectResponseFromData(data);

            if (res.error) {
                res.error.request = requestData;
                deferred.resolve(res.error);
                return;
            }

            var result = getObjectResponseFromData(res);
            result.request = requestData;

            deferred.resolve(result);

        }).error(deferred.reject);

        return deferred;

    };

    var reset = function(options) {
        
        var element = hp.Utils.__instance.element;

        try {
            $.connection.hub.stop();
        } catch (e) { }

        $(element).empty();

        hp.Utils.__instance.element = element;

        if (typeof options.entryType !== "undefined") {
            options.entryType = hp.Utils.setEntryType(options.entryType);
        }

        if (typeof options.paymentType !== "undefined") {
            options.paymentType = hp.Utils.setPaymentType(options.paymentType);
        }

        hp.Utils.defaults = jQuery.extend({}, hp.Utils.defaults, options);

        hp.Utils.__instance.init();
        hp.Utils.__instance = hp.Utils.__instance;

    };

    var signIn = function() {

        var deferred = jQuery.Deferred(),
            createdOn = (new Date()).toISOString(),
            sessionId = getSession().sessionToken,
            apiKey = getSession().apiKey;

        hp.Utils.makeRequest({
            "signIn": {
                "signInRequest": {
                    "apiKey": apiKey
                }
            }
        }).then(function(res) {
            hp.Utils.setSession(res.token);
            deferred.resolve(res);
        }, function(res) {

            var errorResponse = {
                "status": "Error",
                "message": "We're sorry. Payments cannot accepted at this time. Please try again later.",
                "created_on": createdOn,
                "token": sessionId
            };

            if (!hp.Utils.shouldErrorPostBack()) {
                hp.Utils.showError(errorResponse.message);
                hp.Utils.defaults.errorCallback(errorResponse);
            } else {
                hp.Utils.buildFormFromObject(errorResponse).then(function($form) {
                    $form.attr("action", hp.Utils.defaults.errorCallback).submit();
                });
            }

            deferred.reject();

        });

        return deferred;

    };


    var formatCurrency = function(amount) {
        var aDigits = amount.toFixed(2).split(".");
        aDigits[0] = aDigits[0].split("").reverse().join("").replace(/(\d{3})(?=\d)/g, "$1,").split("").reverse().join("");
        return "$" + aDigits.join(".");
    };

    var hasChecked = false;

    var checkHttpsConnection = function() {

        if (!hasChecked && (location.hostname === "localhost" || location.hostname === "")) {
            hasChecked = true;
        }

        if (location.protocol !== "https:" && !hasChecked) {
            hp.Utils.showError("This connection is untrusted. Make sure you're visting this website using 'HTTPS'!");
        }

    };

    var getBalance = function(sessionId, cardNumber) {

        var balance = 0,
            settings = {
                url: hp.Utils.defaults.baseUrl + encodeURI("?dt=" + new Date().getTime()),
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                crossDomain: true,
                data: JSON.stringify({
                    "balance": {
                        "balanceRequest": {
                            "token": sessionId,
                            "cardNumber": cardNumber
                        }
                    }
                }),
                async: false
            };

        if (hp.Utils.defaults.paymentService.toString().toLowerCase() === "emoney") {
            settings.headers = {
                'X-EMoney-Manager': generateGuild()
            };
        }

        $.ajax(settings).success(function(res) {

            if (res.balanceResponse)
                balance = res.balanceResponse.balance;

        }).error(function() {
            balance = 0;
        });

        return balance;

    };

    var isEmail = function(email) {
        return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(email);
    };

    var validateEMoneyData = function(formData, callback) {

        var errors = [];

        if (typeof formData.email === "undefined" || formData.email === "") {
            errors.push({
                type: "email",
                message: "Please provide an email address."
            });
        }

        if (typeof formData.email !== "undefined" && !isEmail(formData.email)) {
            errors.push({
                type: "email",
                message: "The email provided did not validate."
            });
        }

        if (typeof formData.password === "undefined" || formData.password === "") {
            errors.push({
                type: "password",
                message: "Please provide a password."
            });
        }

        if (typeof formData.password !== "undefined" && formData.password.length <= 6) {
            errors.push({
                type: "password",
                message: "Please provide a valid password."
            });
        }

        if (errors.length) {
            return callback(errors, formData);
        }

        return callback(null, formData);

    };

    var validateBankAccountData = function(formData, callback) {

        var errors = [];

        if (typeof formData.accountNumber === "undefined" || formData.accountNumber === "") {
            errors.push({
                type: "accountNumber",
                message: "Account number on card cannot be empty."
            });
        }

        if (typeof formData.accountNumber !== "undefined" && formData.accountNumber.length <= 8) {
            errors.push({
                type: "accountNumber",
                message: "The account number must be atleast 8 characters."
            });
        }

        if (typeof formData.routingNumber === "undefined" || formData.routingNumber === "") {
            errors.push({
                type: "routingNumber",
                message: "Routing number be empty."
            });
        }

        if (typeof formData.routingNumber !== "undefined" && formData.routingNumber.length !== 9) {
            errors.push({
                type: "routingNumber",
                message: "Routing number must be 9 characters."
            });
        }

        if (typeof formData.name === "undefined" || formData.name === "") {
            errors.push({
                type: "name",
                message: "Name cannot be empty."
            });
        }

        if (typeof formData.name !== "undefined" && formData.name.length <= 1) {
            errors.push({
                type: "name",
                message: "Name must be greater than one character."
            });
        }

        if (errors.length) {
            return callback(errors, formData);
        }


        return callback(null, formData);
    };

    var shouldErrorPostBack = function() {

        var options = hp.Utils.defaults;

        if (typeof options.errorCallback !== "function" && typeof options.errorCallback !== "undefined") {
            return true;
        }

        return false;
    };

    var shouldSuccessPostBack = function() {

        var options = hp.Utils.defaults;

        if (typeof options.successCallback !== "function" && typeof options.successCallback !== "undefined") {
            return true;
        }

        return false;

    };

    // Validate Credit Card Data
    var validateCreditCardData = function(formData, callback) {

        var errors = [];

        if (!$.payment.validateCardNumber(formData.cardNumber)) {
            errors.push({
                type: "cc",
                message: "Card number is invalid."
            });
        }

        if (!$.payment.validateCardExpiry(formData._expiryMonth, formData._expiryYear)) {
            errors.push({
                type: "date",
                message: "Expiration date is invalid."
            });
        }

        if (!$.payment.validateCardCVC(formData.cvv, formData.cardType)) {
            errors.push({
                type: "cvv",
                message: "CVV is not valid for this card type."
            });
        }

        if (typeof formData.name === "undefined" || formData.name === "") {
            errors.push({
                type: "name",
                message: "Name on card cannot be empty."
            });
        }

        if (typeof formData.name !== "undefined" && formData.name.length <= 1) {
            errors.push({
                type: "name",
                message: "Name on card must be greater than one character."
            });
        }

        if (errors.length) {
            return callback(errors, formData);
        }

        return callback(null, formData);

    };

    var buildAntiForgeryInput = function() {

        var result = "";

        if (hp.Utils.defaults.antiForgeryToken === "" || hp.Utils.defaults.antiForgeryName === "") {
            return null;
        }

        if (hp.Utils.defaults.antiForgeryToken.startsWith(".") || hp.Utils.defaults.antiForgeryToken.startsWith("#") || hp.Utils.defaults.antiForgeryToken.includes("[")) {
            result = $(hp.Utils.defaults.antiForgeryToken).eq(0).val() || $(hp.Utils.defaults.antiForgeryToken).eq(0).text();
        } else {
            result = hp.Utils.defaults.antiForgeryToken;
        }

        if (typeof result === "undefined" || result === "") {
            return null;
        }

        return $("<input />", {
            "type": "hidden",
            "name": hp.Utils.defaults.antiForgeryName,
            "value": result
        });
    };

    var buildFormFromObject = function(obj) {

        var deferred = jQuery.Deferred(),
            $antiForgeryInput = buildAntiForgeryInput();

        setTimeout(function() {

            var formId = "FRM" + (new Date()).getTime().toString(),
                $form = $("<form />", {
                    "method": "POST",
                    "id": formId
                });

            if (!$.isEmptyObject(obj)) {

                if (typeof obj.push === "function") {

                    for (var i = obj.length - 1; i >= 0; i--) {

                        var objInArray = obj[i];

                        for (var objKey in objInArray) {

                            $form.append($("<input />", {
                                "type": "hidden",
                                "name": objKey + "[" + i + "]",
                                "value": objInArray[objKey]
                            }));

                        }

                    }


                } else {

                    for (var key in obj) {

                        $form.append($("<input />", {
                            "type": "hidden",
                            "name": key,
                            "value": obj[key]
                        }));

                    }

                }

                if ($antiForgeryInput) {
                    $form.append($antiForgeryInput);
                }

                $(document.body).prepend($form);

                return deferred.resolve($("#" + formId));
            }

            return deferred.reject();

        }, 0);

        return deferred;

    };

    var getTerminalId = function() {
        return hp.Utils.defaults.terminalId || "";
    };

    var getCorrelationId = function() {
        return hp.Utils.defaults.correlationId.length ? hp.Utils.defaults.correlationId : generateGuild();
    };

    var setContainerClass = function($instance) {

        var mobileClass = "hp-form-mobile",
            tabletClass = "hp-form-tablet",
            desktopClass = "hp-form-desktop";

        var currentWidth = $instance.outerWidth(true, true),
            containerElement = $instance.find(".hp");

        containerElement
            .removeClass(mobileClass)
            .removeClass(tabletClass)
            .removeClass(desktopClass);

        setTimeout(function() {

            if (currentWidth >= 615) {
                containerElement.addClass(desktopClass);
                return;
            }

            if (currentWidth >= 420) {
                containerElement.addClass(tabletClass);
                return;
            }

            if (currentWidth >= 320) {
                containerElement.addClass(mobileClass);
                return;
            }

        }, 0);

    };

    var handleError = function(res) {

        var errorResponse = {
            "status": "Error",
            "message": "Your session is no longer valid. Please refresh your page and try again.",
            "created_on": (new Date()).toISOString(),
            "token": getSession().sessionToken
        };

        if (typeof res === "undefined") {

            if (!hp.Utils.shouldErrorPostBack()) {
                hp.Utils.showError(errorResponse.message);
                hp.Utils.defaults.errorCallback(errorResponse);
            } else {
                hp.Utils.buildFormFromObject(errorResponse).then(function($form) {
                    $form.attr("action", hp.Utils.defaults.errorCallback).submit();
                });
            }

            return;
        }

        var message = "";

        if (typeof res.message !== "undefined") {
            message = res.message;
        } else if (typeof res.description !== "undefined") {
            message = res.description;
        } else if (typeof res.error !== "undefined" && typeof res.error.description !== "undefined") {
            message = res.error.description;
        } else {
            message = res;
        }

        errorResponse.message = message;

        if (hp.Utils.shouldErrorPostBack()) {
            hp.Utils.buildFormFromObject(errorResponse).then(function($form) {
                $form.attr("action", hp.Utils.defaults.errorCallback).submit();
            });
        } else {
            hp.Utils.showError(errorResponse.message);
            hp.Utils.defaults.errorCallback(errorResponse);
        }

    };


    var handleSuccess = function(res) {

        var errorResponse = {
            "status": "Error",
            "message": "Your session is no longer valid. Please refresh your page and try again.",
            "created_on": (new Date()).toISOString(),
            "token": getSession().sessionToken
        };

        if (typeof res === "undefined") {

            if (!hp.Utils.shouldErrorPostBack()) {
                hp.Utils.showError(errorResponse.message);
                hp.Utils.defaults.errorCallback(errorResponse);
            } else {
                hp.Utils.buildFormFromObject(errorResponse).then(function($form) {
                    $form.attr("action", hp.Utils.defaults.errorCallback).submit();
                });
            }

            return;

        }

        var response = res.length > 1 ? res : res[0];

        if (hp.Utils.shouldSuccessPostBack()) {
            hp.Utils.buildFormFromObject(response).then(function($form) {
                $form.attr("action", hp.Utils.defaults.successCallback).submit();
            });
        } else {
            hp.Utils.defaults.successCallback(response);
        }
    };

    var setupPluginInstances = function($element) {

        var deferred = jQuery.Deferred();

        // Handle instance
        hp.Utils.createInstance($element, function(instance) {

            // The same elements across many instances
            var $this = $element,
                $submit = $this.find(".hp-submit"),
                $all = $this.find(".hp-input"),
                clearInputs = $.noop();

            hp.Utils.checkHttpsConnection();

            instance.init();
            instance.attachEvents();

            /*
             * Transvault 
             *      Methods for handling swipes through a terminal
             * @description:
             *      Invoke terminal and communicate to this instance unqiuely
             */
            if (instance.isTransvault()) {

                $this
                    .off()
                    .on("hp.transvaultSuccess", function(e, data) {

                        var _response = data;

                        instance.showSuccess();
                        hp.Utils.hideLoader();

                        if (!hp.Utils.shouldSuccessPostBack()) {
                            hp.Utils.defaults.successCallback(_response);
                        } else {
                            hp.Utils.buildFormFromObject(_response).then(function($form) {
                                $form.attr("action", hp.Utils.defaults.successCallback).submit();
                            });
                        }

                    })
                    .on("hp.transvaultError", function(e, data) {

                        var message = "";
                        var bypass = false;

                        if (typeof data !== "undefined" && typeof data.error !== "undefined") {
                            message = data.error.description;
                        } else if (typeof data !== "undefined" && typeof data.error === "undefined") {
                            message = data;
                        } else {
                            message = "Unable to parse message from server. Most likely an unhandled event.";
                            bypass = true;
                        }

                        var errorResponse = {
                            "status": bypass ? "Warning" : "Error",
                            "message": message,
                            "created_on": createdOn,
                            "token": sessionId
                        };

                        if (bypass) {
                            console.warn(errorResponse);
                            console.dir(data);
                            return;
                        }

                        if (!hp.Utils.shouldErrorPostBack()) {
                            hp.Utils.showError(errorResponse.message);
                            hp.Utils.defaults.errorCallback(errorResponse);
                        } else {
                            hp.Utils.buildFormFromObject(errorResponse).then(function($form) {
                                $form.attr("action", hp.Utils.defaults.errorCallback).submit();
                            });
                        }

                        try {
                            $.connection.hub.stop();
                        } catch (e) { }

                    });

            }


            /*
             * Code 
             *      Methods for handling barcodes & swipes
             * @description:
             *      Should handle encrypted MSR reads
             *      Should handle non-encrypted MSR reads
             *      Should handle non-encrypted Barcode reads
             */
            if (instance.isCode() || instance.isBankAccount() || instance.isCreditCard() || instance.isGiftCard()) {

                $this
                    .off()
                    .on("hp.submit", function(e, eventResponse) {

                        if (eventResponse.type === instance.requestTypes.charge) {
                            instance.handleSuccess(eventResponse.res);
                            hp.Utils.hideLoader();
                        }

                        if (eventResponse.type === instance.requestTypes.error) {
                            instance.handleError(eventResponse.res);
                            hp.Utils.hideLoader();
                        }

                        instance.clearInputs();

                    });

            }

            deferred.resolve();

        });


        return deferred;
    };

    /*
     * Export "Utils"
     */
    hp.Utils.handleLegacyCssClassApplication = handleLegacyCssClassApplication;
    hp.Utils.makeRequest = makeRequest;
    hp.Utils.validateCreditCardData = validateCreditCardData;
    hp.Utils.validateBankAccountData = validateBankAccountData;
    hp.Utils.validateEMoneyData = validateEMoneyData;
    hp.Utils.buildFormFromObject = buildFormFromObject;
    hp.Utils.buildAntiForgeryInput = buildAntiForgeryInput;
    hp.Utils.createInstance = createInstance;
    hp.Utils.showSuccessPage = showSuccessPage;
    hp.Utils.getAmount = getAmount;
    hp.Utils.setAmount = setAmount;
    hp.Utils.getSession = getSession;
    hp.Utils.setSession = setSession;
    hp.Utils.getBalance = getBalance;
    hp.Utils.formatCurrency = formatCurrency;
    hp.Utils.buildResultObjectByType = buildResultObjectByType;
    hp.Utils.generateGuild = generateGuild;
    hp.Utils.createOrder = createOrder;
    hp.Utils.createNav = createNav;
    hp.Utils.getCorrelationId = getCorrelationId;
    hp.Utils.setContainerClass = setContainerClass;
    hp.Utils.shouldSuccessPostBack = shouldSuccessPostBack;
    hp.Utils.shouldErrorPostBack = shouldErrorPostBack;
    hp.Utils.getTerminalId = getTerminalId;
    hp.Utils.getVersion = getVersion;
    hp.Utils.setVersion = setVersion;
    hp.Utils.showLoader = showLoader;
    hp.Utils.hideLoader = hideLoader;
    hp.Utils.showError = showError;
    hp.Utils.hideError = hideError;
    hp.Utils.setPaymentInstrument = setPaymentInstrument;
    hp.Utils.log = log;
    hp.Utils.setEntryType = setEntryType;
    hp.Utils.setPaymentType = setPaymentType;
    hp.Utils.updateAvsInfo = updateAvsInfo;
    hp.Utils.promptAvs = promptAvs;
    hp.Utils.checkHttpsConnection = checkHttpsConnection;
    hp.Utils.handleError = handleError;
    hp.Utils.handleSuccess = handleSuccess;
    hp.Utils.signIn = signIn;
    hp.Utils.setupPluginInstances = setupPluginInstances;
    hp.Utils.reset = reset;

})(jQuery, window, document);

(function($, window, document, undefined) {
	
	"use strict";

    /*
     * Export "hp"
     */
    window.hp = hp || {};

	function Success($element) {
        this.context = null;
        this.$parent = null;
        this.$content = null;
    	this.$element = $element;
        this.formData = { _isValid: false };
    }

	Success.prototype.init = function () { 

        var context = hp.Utils.handleLegacyCssClassApplication("success", this.$element),
        	$parent = context.parent,
        	$content = context.content;

        $parent
            .find(".icon.success")
            .addClass("animate")
            .show();

        this.context = context;
        this.$parent = $parent;
        this.$content = $content;

	};

	Success.prototype.createTemplate = function() {

		var $html = [
			'<div class="hp-success-visual"></div>',
			'<h2 class="hp-success-label">{{successLabel}}</h2>',
			'<p class="text-muted">{{redirectLabel}}</p>'
		].join("");

		return $html;

	};

    Success.prototype.showSuccess = function(delay) {
        return hp.Utils.showSuccessPage(delay);
    };

    Success.prototype.isCreditCard = function() { 
        return false; 
    };

    Success.prototype.isBankAccount = function() { 
        return false; 
    };

    Success.prototype.isEMoney = function() { 
        return false; 
    };
    
    Success.prototype.isSuccessPage = function() { 
        return true; 
    };
    
    Success.prototype.isCode = function() { 
        return false; 
    };

    Success.prototype.isGiftCard = function() {
        return false;
    };

    /*
     * Export "Credit Card"
     */
    hp.Success = Success;

})(jQuery, window, document);
(function($, window, document, undefined) {

    "use strict";

    /*
     * Export "hp"
     */
    window.hp = hp || {};

    /*
     * Credit Card Class
     */
    function CreditCard($element) {
        this.context = null;
        this.$parent = null;
        this.$content = null;
        this.$loader = null;
        this.$element = $element;
        this.formData = {
            _isValid: false
        };

        this.requestTypes = {};
        this.requestTypes.createPaymentInstrument = 0;
        this.requestTypes.charge = 1;
        this.requestTypes.error = 9;

        // session
        this.instrumentId = "";
        this.transactionId = "";
    }

    var $cc = null,
        $cvv = null,
        $month = null,
        $year = null,
        $name = null,
        $submit = null,
        $visualcc = null,
        $visualmonth = null,
        $visualyear = null,
        $visualname = null,
        $visualcard = null,
        $all = null,
        $fancy = null;

    var sessionId = "",
        createdOn = (new Date()).toISOString();

    CreditCard.prototype.init = function() {

        sessionId = hp.Utils.getSession().sessionToken;

        // utils call
        var context = hp.Utils.handleLegacyCssClassApplication("cc", this.$element),
            $parent = context.parent,
            $content = context.content;

        // Clean parent, notify on complete.
        $parent
            .removeClass("hp-back")
            .trigger("hp.notify");

        this.context = context;
        this.$parent = $parent;
        this.$content = $content;
        this.$loader = $parent.find(".hp-img-loading").eq(0);
        this.wasOnceEMoney = false;

        $cc = this.$content.find(".hp-input-cc input");
        $cvv = this.$content.find(".hp-input-cvv input");
        $month = this.$content.find(".hp-input-month select");
        $year = this.$content.find(".hp-input-year select");
        $name = this.$content.find(".hp-input-name input");
        $submit = this.$content.find(".hp-submit");
        $visualcc = this.$content.find(".hp-card-visual-number");
        $visualmonth = this.$content.find(".hp-card-visual-expiry-month");
        $visualyear = this.$content.find(".hp-card-visual-expiry-year");
        $visualname = this.$content.find(".hp-card-visual-name");
        $visualcard = this.$content.find(".hp-card-visual");
        $visualcard = this.$content.find(".hp-card-visual");
        $all = this.$content.find(".hp-input");
        $fancy = $([$month, $year]);

        $fancy.fancySelect({
            includeBlank: true
        });
    };

    CreditCard.prototype.clearInputs = function() {

        this.formData = {
            _isValid: false
        };

        $visualcc.html(hp.Utils.defaults.defaultCardCharacters);
        $visualmonth.html(hp.Utils.defaults.defaultDateCharacters);
        $visualyear.html(hp.Utils.defaults.defaultDateCharacters);
        $visualname.text(hp.Utils.defaults.defaultNameOnCardName);
        $visualcard.parent().removeClass().addClass("hp-content hp-content-cc hp-content-active");
        $name.removeAttr("disabled").val("");
        $month.removeAttr("disabled");
        $year.removeAttr("disabled");
        $cvv.removeAttr("disabled").val("");
        $cc.removeAttr("disabled").val("");
        $submit.removeAttr("disabled");
        $submit.text("Submit Payment");

    };

    CreditCard.prototype.createTemplate = function(defaultCardCharacters, defaultNameOnCardName, defaultDateCharacters) {

        if (hp.Utils.defaults.paymentTypeOrder.indexOf(0) < 0) {
            return "";
        }

        if (typeof defaultCardCharacters === "undefined" || typeof defaultNameOnCardName === "undefined" || typeof defaultDateCharacters === "undefined") {
            throw new Error("hosted-payments.credit-card.js : Cannot create template. Arguments are null or undefined.");
        }

        var generateYearList = function(input) {

            var min = new Date().getFullYear(),
                max = (new Date().getFullYear()) + 10,
                select = "";

            for (var i = min; i <= max; i++) {

                if (i === min) {
                    select += '<option selected="selected">';
                } else {
                    select += "<option>";
                }

                select += i.toString();
                select += "</option>";
            }

            return select;
        };

        var generateMonthList = function(input) {

            var min = 1,
                select = "";

            for (var i = min; i <= 12; i++) {

                if (i === (new Date().getMonth() + 1)) {
                    select += '<option selected="selected">';
                } else {
                    select += "<option>";
                }

                if (i < 10) {
                    select += "0" + i.toString();
                } else {
                    select += i.toString();
                }

                select += "</option>";
            }

            return select;
        };

        var parseDatesTemplates = function(input) {
            return input
                .replace("{{monthList}}", generateMonthList())
                .replace("{{yearList}}", generateYearList());
        };

        var $html = [
            '<div class="hp-card-visual">',
            '<div class="hp-card-visual-number">' + defaultCardCharacters + '</div>',
            '<div class="hp-card-visual-name">' + defaultNameOnCardName + '</div>',
            '<div class="hp-card-visual-expiry">',
            '<span class="hp-card-visual-expiry-label">Month/Year</span>',
            '<span class="hp-card-visual-expiry-label-alt">Valid Thru</span>',
            '<span class="hp-card-visual-expiry-value"><span class="hp-card-visual-expiry-month">' + defaultDateCharacters + '</span><span>/</span><span class="hp-card-visual-expiry-year">' + defaultDateCharacters + '</span></span>',
            '</div>',
            '</div>',
            '<div class="hp-input-wrapper">',
            '<div class="hp-input hp-input-cc">',
            '<input placeholder="Enter Card Number" autocomplete="on" type="text" pattern="\\d*">',
            '</div>',
            '<div class="hp-input hp-input-name">',
            '<input placeholder="Enter Full Name" value="' + hp.Utils.defaults.customerName + '" autocomplete="on" type="text">',
            '</div>',
            '<br class="hp-break" />',
            '<div class="hp-input-container hp-input-container-date">',
            '<div class="hp-input hp-input-month">',
            '<select autocomplete="on">',
            '{{monthList}}',
            '</select>',
            '</div>',
            '<div class="hp-input hp-input-year">',
            '<select autocomplete="on">',
            '{{yearList}}',
            '</select>',
            '</div>',
            '</div>',
            '<div class="hp-input hp-input-third hp-input-cvv">',
            '<input placeholder="Enter CVV" autocomplete="off" type="text" pattern="\\d*">',
            '<span class="hp-input-cvv-image"></span>',
            '</div>',
            '<br class="hp-break" />',
            '<button class="hp-submit">' + (hp.Utils.defaults.promptForAvs ? "Verify Billing Address &#10144;" : "Submit Payment") + '</button>',
            '</div>'
        ].join("");

        return parseDatesTemplates($html);

    };

    CreditCard.prototype.showSuccess = function(delay) {
        return hp.Utils.showSuccessPage(delay);
    };

    CreditCard.prototype.detachEvents = function() {
        $cc.off().val("");
        $cvv.off().val("");
        $name.off().val(hp.Utils.defaults.customerName);
        $submit.off();
        $month.off("focus");
        $year.off("focus");
        $fancy.trigger("disable.fs");
        this.$parent.trigger("hp.notify");
        this.handleNotify();
    };

    CreditCard.prototype.handleCreditCardInput = function(cardNumber) {

        if (cardNumber === "") {
            $visualcc.html(hp.Utils.defaults.defaultCardCharacters);
            return;
        }

        var cardType = $.payment.cardType(cardNumber);

        if (cardType === null && this.wasOnceEMoney) {
            var date = new Date();
            $name.val("").trigger("keyup").removeAttr("readonly");
            $month.removeAttr("readonly").val(date.getMonth() <= 9 ? "0" + date.getMonth() : date.getMonth()).trigger("change");
            $year.removeAttr("readonly").val(date.getFullYear()).trigger("change");
            $fancy.trigger("enable.fs");
            $cvv.val("").trigger("keyup").removeAttr("readonly");
        }

        if (cardType === "emoney") {
            $name.val("EMoney Card").trigger("keyup").attr("readonly", "readonly");
            $month.val("12").trigger("change").attr("readonly", "readonly");
            $year.val("2025").trigger("change").attr("readonly", "readonly");
            $cvv.val("999").trigger("keyup").attr("readonly", "readonly");
            $fancy.trigger("disable.fs");
            this.wasOnceEMoney = true;
        }

        this.formData.cardNumber = cardNumber.replace(/\s/gi, "");
        this.formData.cardType = cardType;
        $visualcc.text(cardNumber);

    };

    CreditCard.prototype.handleMonthInput = function(expiryMonth) {

        if (expiryMonth === "") {
            $visualmonth.html(hp.Utils.defaults.defaultDateCharacters);
            return;
        }

        this.formData._expiryMonth = $.trim(expiryMonth);
        $visualmonth.text(expiryMonth);

        setTimeout(function() {
            $month.next().text(expiryMonth);
        }, 0);

    };


    CreditCard.prototype.handleYearInput = function(expiryYear) {

        if (expiryYear === "") {
            $visualyear.html(hp.Utils.defaults.defaultDateCharacters);
            return;
        }

        this.formData._expiryYear = $.trim(expiryYear);
        $visualyear.text(expiryYear.substring(2));

        setTimeout(function() {
            $year.next().text(expiryYear);
        }, 0);

    };

    CreditCard.prototype.handleNameInput = function(name) {

        if (name === "") {
            $visualname.text(hp.Utils.defaults.defaultNameOnCardName);
            return;
        }

        this.formData.name = $.trim(name);
        $visualname.text(name);

    };

    CreditCard.prototype.handleCVVInput = function(cvv) {
        this.formData.cvv = $.trim(cvv);
    };

    CreditCard.prototype.handleCharge = function(res) {

        var that = this,
            hasBalance = true,
            cardBalance = 0;

        var errorResponse = {
            "status": "Error",
            "message": "The payment instrument provided had no remaining funds and will not be applied to the split payment.",
            "created_on": createdOn,
            "token": sessionId
        };

        var requestModel = {};

        if (hp.Utils.defaults.paymentType == hp.PaymentType.CHARGE) {

            requestModel = {
                "charge": {
                    "chargeRequest": {
                        "token": hp.Utils.getSession().sessionToken,
                        "transactionId": this.transactionId,
                        "amount": hp.Utils.getAmount(),
                        "entryType": hp.Utils.defaults.entryType,
                        "instrumentId": this.instrumentId,
                        "correlationId": hp.Utils.getCorrelationId(),
                        "__request": res.request
                    }
                }
            };

        }

        if (hp.Utils.defaults.paymentType == hp.PaymentType.REFUND) {

            requestModel = {
                "refund": {
                    "refundRequest": {
                        "token": hp.Utils.getSession().sessionToken,
                        "transactionId": this.transactionId,
                        "amount": hp.Utils.getAmount(),
                        "entryType": hp.Utils.defaults.entryType,
                        "instrumentId": this.instrumentId,
                        "correlationId": hp.Utils.getCorrelationId(),
                        "__request": res.request
                    }
                }
            };

        }

        hp.Utils.makeRequest(requestModel)
            .then(hp.Utils.buildResultObjectByType)
            .then(function(promiseResponse) {

                that.$parent.trigger("hp.submit", {
                    "type": that.requestTypes.charge,
                    "res": promiseResponse
                });

            })
            .fail(function(promiseResponse) {

                if (typeof promiseResponse.responseJSON !== "undefined") {
                    promiseResponse = promiseResponse.responseJSON;
                }

                that.$parent.trigger("hp.submit", {
                    "type": that.requestTypes.error,
                    "res": promiseResponse
                });

            });

    };

    CreditCard.prototype.handleSubmit = function() {

        var that = this;

        if (!that.formData._isValid) {
            $visualcard.addClass("hp-card-invalid");
            setTimeout(function() {
                $visualcard.removeClass("hp-card-invalid");
            }, 2000);
            return;
        }

        $submit.attr("disabled", "disabled").text("Submitting...");

        hp.Utils.promptAvs().then(function() {

                hp.Utils.showLoader();

                return hp.Utils.makeRequest({
                    "createPaymentInstrument": {
                        "createPaymentInstrumentRequest": {
                            "correlationId": hp.Utils.getCorrelationId(),
                            "token": hp.Utils.getSession().sessionToken,
                            "name": that.formData.name,
                            "properties": {
                                "cardNumber": that.formData.cardNumber,
                                "expirationDate": that.formData._expiryMonth + "/" + that.formData._expiryYear,
                                "cvv": that.formData.cvv,
                                "nameOnCard": that.formData.name
                            },
                            "billingAddress": {
                                "addressLine1": hp.Utils.defaults.billingAddress.addressLine1,
                                "postalCode": hp.Utils.defaults.billingAddress.postalCode
                            }
                        }
                    }
                });

            })
            .then(function(res) {

                if (res.isException) {

                    that.$parent.trigger("hp.submit", {
                        "type": 9,
                        "res": res
                    });

                    return;
                }

                that.instrumentId = res.instrumentId;
                that.transactionId = res.transactionId;

                that.$parent.trigger("hp.submit", {
                    "type": 0,
                    "res": res
                });

                that.handleCharge(res);

            }).fail(function(err) {

                if (typeof err.responseJSON !== "undefined") {
                    err = err.responseJSON;
                }

                that.$parent.trigger("hp.submit", {
                    "type": 9,
                    "res": err
                });

            });

    };

    CreditCard.prototype.handleSuccess = function(res) {
        
        hp.Utils.handleSuccess(res);

        if (typeof hp.Utils.defaults.successCallback !== "function") {
            this.showSuccess();
        }

    };

    CreditCard.prototype.handleError = function(res) {
        hp.Utils.handleError(res);
        this.clearInputs();
    };

    CreditCard.prototype.attachEvents = function() {

        this.detachEvents();

        var $this = this;

        $fancy.trigger("enable.fs");

        hp.Utils.setContainerClass($this.$element);

        $cc
            .payment('formatCardNumber')
            .on("keyup", function() {

                var cardNumber = $(this).val();
                var cardType = $.payment.cardType(cardNumber);

                $this.$parent.removeClass("hp-back");

                if (cardType) {
                    $this.$content
                        .removeClass()
                        .addClass("hp-content hp-content-cc hp-content-active")
                        .addClass("hp-content-card-" + cardType);
                }

                $this.handleCreditCardInput(cardNumber);
                $this.$parent.trigger("hp.cc", cardNumber);
                $this.$parent.trigger("hp.notify");
                $this.handleNotify();

            });

        $cvv
            .payment('formatCardCVC').on("focus", function() {

                $this.$parent.addClass("hp-back");
                $this.$parent.trigger("hp.notify");
                $this.handleNotify();

            }).on("keyup", function(e) {

                var cvv = $(this).val();
                $this.handleCVVInput(cvv);
                $this.$parent.trigger("hp.cvv", cvv);
                $this.$parent.trigger("hp.notify");
                $this.handleNotify();

            });

        $name
            .on("focus", function() {

                $this.$parent.trigger("hp.notify");
                $this.handleNotify();
                $this.$parent.removeClass("hp-back");

            }).on("keyup", function(e) {

                var name = $(this).val();
                $this.handleNameInput(name);
                $this.$parent.trigger("hp.name", name);
                $this.$parent.trigger("hp.notify");
                $this.handleNotify();

            });

        if (hp.Utils.defaults.customerName !== "") {
            $name.trigger("keyup");
        }

        $month
            .on("focus", function(e) {
                $(".hp-input-active").removeClass("hp-input-active");
                $(this).parents(".hp-input").addClass("hp-input-active");
            })
            .on("change.fs", function(e) {

                var month = $(this).val();
                $this.handleMonthInput(month);
                $this.$parent.removeClass("hp-back");
                $this.$parent.trigger("hp.expiryMonth", month);
                $this.$parent.trigger("hp.notify");
                $this.handleNotify();

            })
            .on("blur", function(e) {
                $(".hp-input-active").removeClass("hp-input-active");
            })
            .trigger("change.fs");

        $year
            .on("focus", function(e) {
                $(".hp-input-active").removeClass("hp-input-active");
                $(this).parents(".hp-input").addClass("hp-input-active");
            })
            .on("change.fs", function(e) {

                var year = $(this).val();
                $this.handleYearInput(year);
                $this.$parent.removeClass("hp-back");
                $this.$parent.trigger("hp.expiryYear", year);
                $this.$parent.trigger("hp.notify");
                $this.handleNotify();

            })
            .on("blur", function(e) {
                $(".hp-input-active").removeClass("hp-input-active");
            })
            .trigger("change.fs");

        $submit
            .on("click", function(e) {
                e.preventDefault();
                $this.handleSubmit();
                $this.$parent.trigger("hp.notify");
                $this.handleNotify();
            });

        this.$parent.trigger("hp.notify");
        this.handleNotify();

    };

    CreditCard.prototype.handleNotify = function() {

        if (typeof this.formData._expiryYear !== "undefined" && typeof this.formData._expiryMonth !== "undefined") {
            this.formData.expirationDate = $.trim(this.formData._expiryMonth + this.formData._expiryYear.substring(2));
        }

        var $this = this;

        hp.Utils.validateCreditCardData(this.formData, function(error, data) {

            $all.removeClass("hp-error");

            if (!error) {
                $this.formData._isValid = true;
                return;
            }

            for (var err in error) {

                if (error[err].type === "cc") {

                    if ($cc.val() !== "") {
                        $cc.parent().addClass("hp-error");
                    }

                }

                if (error[err].type === "cvv") {

                    if ($cvv.val() !== "") {
                        $cvv.parent().addClass("hp-error");
                    }

                }

                if (error[err].type === "date") {

                    if ($year.val() !== "" && $month.val() !== "") {
                        $year.parent().addClass("hp-error");
                        $month.parent().addClass("hp-error");
                    }

                }

                if (error[err].type === "name") {

                    if ($name.val() !== "") {
                        $name.parent().addClass("hp-error");
                    }

                }

            }

        });

    };

    CreditCard.prototype.isCreditCard = function() {
        return true;
    };

    CreditCard.prototype.isBankAccount = function() {
        return false;
    };

    CreditCard.prototype.isEMoney = function() {
        return false;
    };

    CreditCard.prototype.isCode = function() {
        return false;
    };

    CreditCard.prototype.isSuccessPage = function() {
        return false;
    };

    CreditCard.prototype.isTransvault = function() {
        return false;
    };

    CreditCard.prototype.isGiftCard = function() {
        return false;
    };

    /*
     * Export "Credit Card"
     */
    hp.CreditCard = CreditCard;

})(jQuery, window, document);

(function($, window, document, undefined) {

    "use strict";

    /*
     * Export "hp"
     */
    window.hp = hp || {};

    /*
     * Credit Card Class
     */
    function GiftCard($element) {
        this.context = null;
        this.$parent = null;
        this.$content = null;
        this.$loader = null;
        this.$element = $element;
        this.formData = {
            _isValid: false
        };
    }

    var sessionId = "",
        createdOn = (new Date()).toISOString();

    GiftCard.prototype.init = function() {

        sessionId = hp.Utils.getSession().sessionToken;

        // utils call
        var context = hp.Utils.handleLegacyCssClassApplication("gc", this.$element),
            $parent = context.parent,
            $content = context.content;

        // Clean parent, notify on complete.
        $parent
            .removeClass("hp-back")
            .trigger("hp.notify");

        this.context = context;
        this.$parent = $parent;
        this.$content = $content;
        this.totalPages = $content.find(".hp-page").length;
        this.currrentPage = 0;
    };

    GiftCard.prototype.clearInputs = function() {

        this.formData = {
            _isValid: false
        };

    };

    GiftCard.prototype.createTemplate = function(defaultCardCharacters, defaultNameOnCardName, defaultDateCharacters) {

        if (hp.Utils.defaults.paymentTypeOrder.indexOf(4) < 0) {
            return "";
        }

        var $html = [
            '<div class="hp-page hp-page-0 hp-page-active">',
                '<h2>Swipe, scan, or manually<br /> enter a gift card.</h2><br />',
                '<div class="hp-card-visual">',
                    '<div class="hp-card-visual-number">' + defaultCardCharacters + '</div>',
                    '<div class="hp-card-visual-name">' + defaultNameOnCardName + '</div>',
                    '<div class="hp-card-visual-expiry">',
                        '<span class="hp-card-visual-expiry-label">Month/Year</span>',
                        '<span class="hp-card-visual-expiry-label-alt">Valid Thru</span>',
                        '<span class="hp-card-visual-expiry-value"><span class="hp-card-visual-expiry-month">12</span><span>/</span><span class="hp-card-visual-expiry-year">' + defaultDateCharacters + '</span></span>',
                    '</div>',
                '</div>',
                '<div class="hp-input-wrapper">',
                    '<div class="hp-input-group hp-clearfix">',
                        '<div class="hp-input hp-input-gc hp-pull-left">',
                            '<input placeholder="Enter Card Number" autocomplete="on" type="text" pattern="\\d*">',
                        '</div>',
                        '<button class="hp-submit hp-pull-left">Submit</button>',
                    '</div>',
                    '<hr />',
                    '<button class="hp-submit hp-submit-success">Issue a new Gift Card</button>',
                '</div>',
            '</div>',
            '<div class="hp-page hp-page-1">',
                '<h2>Page 1.</h2><br />',
            '</div>',
            '<div class="hp-page hp-page-2">',
                '<h2>Page 2.</h2><br />',
            '</div>',
            '<div class="hp-page hp-page-3">',
                '<h2>Page 3.</h2><br />',
            '</div>',
            '<div class="hp-page hp-page-4">',
                '<h2>Page 4.</h2><br />',
            '</div>',
            '<div class="hp-page hp-page-5">',
                '<h2>Page 5.</h2><br />',
            '</div>',
            '<br />'
        ].join("");

        return $html;

    };

    GiftCard.prototype.goTo = function(pageNumber) {
        
        if (pageNumber === "first") {
            pageNumber = 0;
        }

        if (pageNumber === "last") {
            pageNumber = (this.totalPages - 1);
        }

        var num = +pageNumber;

        if (num < 0) {
            num = 0;
        }

        if (num > this.totalPages) {
            num = this.totalPages;
        }

        this.$content
            .find(".hp-page")
            .removeClass("hp-page-active")
            .filter(".hp-page-" + num)
            .addClass("hp-page-active");

        this.currrentPage = num;
        this.$parent.trigger("hp.notify", { "type" : "page", "value" : num });

    };

    
    GiftCard.prototype.next = function() {
        var page = this.currrentPage + 1;
        this.goTo(page === this.totalPages ? "first" : page);
    };

    
    GiftCard.prototype.prev = function() {
        this.goTo(this.currrentPage === 0 ? "last" : this.currrentPage - 1);
    };

    GiftCard.prototype.showSuccess = function(delay) {
        return hp.Utils.showSuccessPage(delay);
    };

    GiftCard.prototype.detachEvents = function() {
        this.$parent.trigger("hp.notify");
        this.handleNotify();
    };

    GiftCard.prototype.handleCharge = function(res) {

        var that = this,
            hasBalance = true,
            cardBalance = 0;

        var errorResponse = {
            "status": "Error",
            "message": "The payment instrument provided had no remaining funds and will not be applied to the split payment.",
            "created_on": createdOn,
            "token": sessionId
        };

        hp.Utils.makeRequest({
                "charge": {
                    "chargeRequest": {
                        "correlationId": hp.Utils.getCorrelationId(),
                        "token": hp.Utils.getSession().sessionToken,
                        "transactionId": this.transactionId,
                        "instrumentId": this.instrumentId,
                        "entryType" : hp.Utils.defaults.entryType,
                        "amount": hp.Utils.getAmount(),
                        "__request": res.request
                    }
                }
            })
            .then(hp.Utils.buildResultObjectByType)
            .then(function(promiseResponse) {

                that.$parent.trigger("hp.submit", {
                    "type": that.requestTypes.charge,
                    "res": promiseResponse
                });

            })
            .fail(function(promiseResponse) {

                if (typeof promiseResponse.responseJSON !== "undefined") {
                    promiseResponse = promiseResponse.responseJSON;
                }

                that.$parent.trigger("hp.submit", {
                    "type": that.requestTypes.error,
                    "res": promiseResponse
                });

            });

    };

    GiftCard.prototype.handleSubmit = function() {

        var that = this;

        if (!that.formData._isValid) {
            return;
        }

        $submit.attr("disabled", "disabled").text("Submitting...");

        hp.Utils.promptAvs().then(function(){
            
            hp.Utils.showLoader();

            return hp.Utils.makeRequest({
                "createPaymentInstrument": {
                    "createPaymentInstrumentRequest": {
                        "correlationId": hp.Utils.getCorrelationId(),
                        "token": hp.Utils.getSession().sessionToken,
                        "name": that.formData.name,
                        "properties": {
                            "cardNumber": that.formData.cardNumber,
                            "expirationDate": that.formData._expiryMonth + "/" + that.formData._expiryYear,
                            "cvv": that.formData.cvv,
                            "nameOnCard": that.formData.name
                        },
                        "billingAddress": {
                            "addressLine1": hp.Utils.defaults.billingAddress.addressLine1,
                            "postalCode": hp.Utils.defaults.billingAddress.postalCode
                        }
                    }
                }
            });

        })
        .then(function(res) {

            if (res.isException) {

                that.$parent.trigger("hp.submit", {
                    "type": 9,
                    "res": res
                });

                return;
            }

            that.instrumentId = res.instrumentId;
            that.transactionId = res.transactionId;

            that.$parent.trigger("hp.submit", {
                "type": 0,
                "res": res
            });

            that.handleCharge(res);

        }).fail(function(err) {

            if (typeof err.responseJSON !== "undefined") {
                err = err.responseJSON;
            }

            that.$parent.trigger("hp.submit", {
                "type": 9,
                "res": err
            });

        });

    };

    GiftCard.prototype.handleSuccess = function(res) {
        hp.Utils.handleSuccess(res);
        this.showSuccess();
    };

    GiftCard.prototype.handleError = function(res) {
        hp.Utils.handleError(res);
        this.clearInputs();
    };

    GiftCard.prototype.attachEvents = function() {

        this.$parent.trigger("hp.notify");
        this.handleNotify();

    };

    GiftCard.prototype.handleNotify = function() {

        var $this = this;

        hp.Utils.validateCreditCardData(this.formData, function(error, data) {

            if (!error) {
                $this.formData._isValid = true;
                return;
            }

            for (var err in error) {

            }

        });

    };

    GiftCard.prototype.isCreditCard = function() {
        return true;
    };

    GiftCard.prototype.isBankAccount = function() {
        return false;
    };

    GiftCard.prototype.isEMoney = function() {
        return false;
    };

    GiftCard.prototype.isCode = function() {
        return false;
    };

    GiftCard.prototype.isSuccessPage = function() {
        return false;
    };

    GiftCard.prototype.isTransvault = function() {
        return false;
    };

    GiftCard.prototype.isGiftCard = function() {
        return true;
    };

    /*
     * Export "Credit Card"
     */
    hp.GiftCard = GiftCard;

})(jQuery, window, document);

(function($, window, document, undefined) {

    "use strict";

    /*
     * Export "hp"
     */
    window.hp = hp || {};

    /*
     * Bank Account Class
     */
    function BankAccount($element) {
        this.context = null;
        this.$parent = null;
        this.$content = null;
        this.$element = $element;
        this.formData = { _isValid: false };

        this.requestTypes = {};
        this.requestTypes.createPaymentInstrument = 0;
        this.requestTypes.charge = 1;
        this.requestTypes.error = 9;
    }

    var $fullname = null,
        $accountNumber = null,
        $routingNumber = null,
        $visualaccount = null,
        $visualbank = null,
        $visualrouting = null,
        $visualfullname = null,
        $all = null,
        $submit;

    var sessionId = "",
        createdOn = (new Date()).toISOString();

    BankAccount.prototype.init = function() {

        sessionId = hp.Utils.getSession().sessionToken;

        // utils call
        var context = hp.Utils.handleLegacyCssClassApplication("bank", this.$element),
            $parent = context.parent,
            $content = context.content;

        // Clean parent, notify on complete.
        $parent
            .trigger("hp.notify");

        this.context = context;
        this.$parent = $parent;
        this.$content = $content;

        $fullname = this.$content.find(".hp-input-fullname input");
        $accountNumber = this.$content.find(".hp-input-account input");
        $routingNumber = this.$content.find(".hp-input-routing input");
        $visualaccount = this.$content.find(".hp-bank-visual-account");
        $visualbank = this.$content.find(".hp-bank-visual");
        $visualrouting = this.$content.find(".hp-bank-visual-routing");
        $visualfullname = this.$content.find(".hp-bank-visual-name");
        $submit = this.$content.find(".hp-submit");
        $all = this.$content.find(".hp-input");

    };

    BankAccount.prototype.clearInputs = function() {

        this.formData = {
            _isValid: false
        };

        $all.each(function() {
            $(this).find("input").val("");
        });

        $visualfullname.html(hp.Utils.defaults.defaultName);
        $visualaccount.html(hp.Utils.defaults.defaultAccountNumberCharacters);
        $visualrouting.html(hp.Utils.defaults.defaultRoutingNumberCharacters);
        $visualbank.parent().removeClass().addClass("hp-content hp-content-bank hp-content-active");

    };

    BankAccount.prototype.createTemplate = function(defaultName, defaultAccountNumberCharacters, defaultRoutingNumberCharacters) {

        if (hp.Utils.defaults.paymentTypeOrder.indexOf(1) < 0) {
            return "";
        }

        if (typeof defaultAccountNumberCharacters === "undefined" || typeof defaultRoutingNumberCharacters === "undefined" || typeof defaultName === "undefined") {
            throw new Error("hosted-payments.bank-account.js : Cannot create template. Arguments are null or undefined.");
        }

        var $html = [
            '<div class="hp-bank-visual">',
            '<div class="hp-bank-visual-image"></div>',
            '<div class="hp-bank-visual-logo"></div>',
            '<div class="hp-bank-visual-name">' + defaultName + '</div>',
            '<div class="hp-bank-visual-account">' + defaultAccountNumberCharacters + '</div>',
            '<div class="hp-bank-visual-routing">' + defaultRoutingNumberCharacters + '</div>',
            '</div>',
            '<div class="hp-input-wrapper">',
            '<div class="hp-input hp-input-fullname">',
            '<input placeholder="Enter Full Name" value="' + hp.Utils.defaults.customerName + '" autocomplete="on" type="text">',
            '</div>',
            '<div class="hp-break" >',
            '<div class="hp-input hp-input-account">',
            '<input placeholder="Account Number" autocomplete="on" type="text" pattern="\\d*">',
            '</div>',
            '<div class="hp-input hp-input-routing">',
            '<input placeholder="Routing Number" autocomplete="on" type="text" pattern="\\d*">',
            '</div>',
            '</div>',
            '<button class="hp-submit">Submit Payment</button>',
            '<p class="info">* Please note that bank account (ACH) transactions may take up to 3 days to process. This time period varies depending on the your issuing bank. For more information please visit us at <a href="https://www.etsms.com/" target="_blank">https://etsms.com</a>.</p>',
            '</div>'
        ].join("");

        return $html;

    };


    BankAccount.prototype.detachEvents = function() {

        this.$content.find(".hp-input-account input").off().val("");
        this.$content.find(".hp-input-fullname input").off().val(hp.Utils.defaults.customerName);
        this.$content.find(".hp-input-routing input").off().val("");
        this.$content.find(".hp-submit").off();
        this.$parent.trigger("hp.notify");
        this.handleNotify();

    };

    BankAccount.prototype.handleRoutingInput = function(routingNumber) {

        if (routingNumber === "") {
            return $visualrouting.html(hp.Utils.defaults.defaultRoutingNumberCharacters);
        }

        this.formData.routingNumber = $.trim(routingNumber);
        $visualrouting.text(routingNumber);

    };

    BankAccount.prototype.handleAccountInput = function(accountNumber) {

        if (accountNumber === "") {
            return $visualaccount.html(hp.Utils.defaults.defaultAccountNumberCharacters);
        }

        this.formData.accountNumber = $.trim(accountNumber);
        $visualaccount.text(accountNumber);

    };

    BankAccount.prototype.handleNameInput = function(name) {

        if (name === "") {
            return $visualfullname.html(hp.Utils.defaults.defaultName);
        }

        this.formData.name = $.trim(name);
        $visualfullname.text(name);

    };

    BankAccount.prototype.attachEvents = function() {

        this.detachEvents();

        var $this = this;

        $this.$content.find(".hp-input-account input")
            .payment('restrictNumeric')
            .on("keyup, keydown, keypress, change, input", function() {

                var that = $(this),
                    count = that.val().length;

                if (count > 16) {
                    var value = that.val().substr(0, 16);
                    that.val(value);
                }

                var accountNumber = $(this).val();

                $this.$parent.removeClass("hp-back");

                $this.$content
                    .removeClass()
                    .addClass("hp-content hp-content-bank hp-content-active");


                $this.handleAccountInput(accountNumber);
                $this.$parent.trigger("hp.account", accountNumber);
                $this.$parent.trigger("hp.notify");
                $this.handleNotify();

            });

        $this.$content.find(".hp-input-fullname input")
            .on("keyup, keydown, keypress, change, input", function() {

                var name = $(this).val();

                $this.$parent.removeClass("hp-back");

                $this.handleNameInput(name);
                $this.$parent.trigger("hp.name", name);
                $this.$parent.trigger("hp.notify");
                $this.handleNotify();

            });

        if (hp.Utils.defaults.customerName !== "") {
            setTimeout(function() {
                $this.$content.find(".hp-input-fullname input").val(hp.Utils.defaults.customerName);
                $this.$content.find(".hp-input-fullname input").trigger("keyup");
                $this.$parent.trigger("hp.name", hp.Utils.defaults.customerName);
                $this.handleNameInput(hp.Utils.defaults.customerName);
                $this.handleNotify();
            }, 0);
        }

        $this.$content.find(".hp-input-routing input")
            .payment('restrictNumeric')
            .on("keyup, keydown, keypress, change, input", function(e) {

                var that = $(this),
                    count = that.val().length;

                if (count > 9) {
                    var value = that.val().substr(0, 9);
                    that.val(value);
                }

                var routingNumber = $(this).val();
                $this.$parent.removeClass("hp-back");
                $this.handleRoutingInput(routingNumber);
                $this.$parent.trigger("hp.routing", routingNumber);
                $this.$parent.trigger("hp.notify");
                $this.handleNotify();

            });

        $this.$content.find(".hp-submit")
            .on("click", function(e) {
                e.preventDefault();
                $this.handleSubmit();
                $this.$parent.trigger("hp.notify");
                $this.handleNotify();
            });

        this.$parent.trigger("hp.notify");
        this.handleNotify();
    };

    BankAccount.prototype.handleNotify = function() {

        var $this = this;

        hp.Utils.validateBankAccountData(this.formData, function(error, data) {

            $all.removeClass("hp-error");

            if (!error) {
                $this.formData._isValid = true;
                return;
            }

            for (var err in error) {

                if (error[err].type === "accountNumber") {

                    if ($accountNumber.val() !== "") {
                        $accountNumber.parent().addClass("hp-error");
                    }

                }

                if (error[err].type === "routingNumber") {

                    if ($routingNumber.val() !== "") {
                        $routingNumber.parent().addClass("hp-error");
                    }

                }

                if (error[err].type === "name") {

                    if ($fullname.val() !== "") {
                        $fullname.parent().addClass("hp-error");
                    }

                }

            }

        });

    };

    BankAccount.prototype.showSuccess = function(delay) {
        return hp.Utils.showSuccessPage(delay);
    };

    BankAccount.prototype.handleCharge = function(res) {

        var $this = this;

        var requestModel = {};

        if (hp.Utils.defaults.paymentType == hp.PaymentType.CHARGE) {

            requestModel = {
                "charge": {
                    "chargeRequest": {
                        "correlationId": hp.Utils.getCorrelationId(),
                        "token": hp.Utils.getSession().sessionToken,
                        "transactionId": $this.transactionId,
                        "instrumentId": $this.instrumentId,
                        "amount": hp.Utils.getAmount(),
                        "__request": res.request
                    }
                }
            };

        }

        if (hp.Utils.defaults.paymentType == hp.PaymentType.REFUND) {

            requestModel = {
                "refund": {
                    "refundRequest": {
                        "correlationId": hp.Utils.getCorrelationId(),
                        "token": hp.Utils.getSession().sessionToken,
                        "transactionId": $this.transactionId,
                        "instrumentId": $this.instrumentId,
                        "amount": hp.Utils.getAmount(),
                        "__request": res.request
                    }
                }
            };

        }

        hp.Utils.makeRequest(requestModel)
            .then(hp.Utils.buildResultObjectByType)
            .then(function(promiseResponse) {

                $this.$parent.trigger("hp.submit", {
                    "type": $this.requestTypes.charge,
                    "res": promiseResponse
                });

            })
            .fail(function(promiseResponse) {

                if (typeof promiseResponse.responseJSON !== "undefined") {
                    promiseResponse = promiseResponse.responseJSON;
                }

                $this.$parent.trigger("hp.submit", {
                    "type": $this.requestTypes.error,
                    "res": promiseResponse
                });

            });

    };

    BankAccount.prototype.handleSuccess = function(res) {
        hp.Utils.handleSuccess(res);

        if (typeof hp.Utils.defaults.successCallback !== "function") {
            this.showSuccess();
        }
    };

    BankAccount.prototype.handleError = function(res) {
        hp.Utils.handleError(res);
        this.clearInputs();
    };

    BankAccount.prototype.handleSubmit = function() {

        var $this = this;

        if (!$this.formData._isValid) {
            $visualbank.addClass("hp-bank-invalid");
            setTimeout(function() {
                $visualbank.removeClass("hp-bank-invalid");
            }, 2000);
            return;
        }

        $submit.attr("disabled", "disabled").text("Submitting...");
        hp.Utils.showLoader();

        $submit
            .attr("disabled", "disabled")
            .text("Processing payment...");

        hp.Utils.makeRequest({
            "createPaymentInstrument": {
                "createPaymentInstrumentRequest": {
                    "correlationId": hp.Utils.getCorrelationId(),
                    "token": hp.Utils.getSession().sessionToken,
                    "name": $this.formData.name,
                    "properties": {
                        "accountNumber": $this.formData.accountNumber,
                        "routingNumber": $this.formData.routingNumber,
                        "bankName": $this.formData.name
                    },
                    "billingAddress": {
                        "addressLine1": hp.Utils.defaults.billingAddress.addressLine1,
                        "postalCode": hp.Utils.defaults.billingAddress.postalCode
                    }
                }
            }
        }).then(function(res) {

            if (res.isException) {

                $this.$parent.trigger("hp.submit", {
                    "type": 9,
                    "res": res
                });

                return;
            }

            $this.instrumentId = res.instrumentId;
            $this.transactionId = res.transactionId;

            $this.$parent.trigger("hp.submit", {
                "type": 0,
                "res": res
            });

            $this.handleCharge(res);

        }).fail(function(err) {

            if (typeof err.responseJSON !== "undefined") {
                err = err.responseJSON;
            }

            $this.$parent.trigger("hp.submit", {
                "type": 9,
                "res": err
            });

        });

    };

    BankAccount.prototype.isCreditCard = function() {
        return false; 
    };

    BankAccount.prototype.isBankAccount = function() {
        return true; 
    };

    BankAccount.prototype.isEMoney = function() {
        return false; 
    };

    BankAccount.prototype.isSuccessPage = function() {
        return false; 
    };

    BankAccount.prototype.isCode = function() {
        return false; 
    };

    BankAccount.prototype.isTransvault = function() {
        return false; 
    };

    BankAccount.prototype.isGiftCard = function() {
        return false;
    };

    /*
     * Export "Bank Account"
     */
    hp.BankAccount = BankAccount;

})(jQuery, window, document);

(function($, window, document, undefined) {

    "use strict";

    /*
     * Export "hp"
     */
    window.hp = hp || {};

    /*
     * Bank Account Class
     */
    function Code($element) {
        this.context = null;
        this.$parent = null;
        this.$content = null;
        this.$element = $element;

        this.requestTypes = {};
        this.requestTypes.createPaymentInstrument = 0;
        this.requestTypes.charge = 1;
        this.requestTypes.error = 9;

        // session
        this.instrumentId = "";
        this.transactionId = "";

        this.formData = {
            _isValid: false
        };
    }

    var $visualcodecc = null,
        $visualcodemonth = null,
        $visualcodeyear = null,
        $visualcodename = null,
        $visualcode = null,
        $all = null;

    var sessionId = "",
        createdOn = (new Date()).toISOString();

    Code.prototype.init = function() {

        sessionId = hp.Utils.getSession().sessionToken;

        // utils call
        var context = hp.Utils.handleLegacyCssClassApplication("code", this.$element),
            $parent = context.parent,
            $content = context.content;

        // Clean parent, notify on complete.
        $parent
            .trigger("hp.notify");

        this.context = context;
        this.$parent = $parent;
        this.$content = $content;

        $visualcodecc = this.$content.find(".hp-card-visual-number");
        $visualcodemonth = this.$content.find(".hp-card-visual-expiry-month");
        $visualcodeyear = this.$content.find(".hp-card-visual-expiry-year");
        $visualcodename = this.$content.find(".hp-card-visual-name");
        $visualcode = this.$content.find(".hp-card-visual.hp-card-visual-flat");
        $all = this.$content.find(".hp-input");

    };

    Code.prototype.clearInputs = function() {

        this.formData = {
            _isValid: false
        };

        $visualcode.removeClass("hp-card-visual-flat-active");
        $visualcodecc.html(hp.Utils.defaults.defaultCardCharacters);
        $visualcodemonth.html(hp.Utils.defaults.defaultDateCharacters);
        $visualcodeyear.html(hp.Utils.defaults.defaultDateCharacters);
        $visualcodename.html(hp.Utils.defaults.defaultNameOnCardNameSwipe);

    };

    Code.prototype.createTemplate = function(defaultCardCharacters, defaultNameOnCardName, defaultDateCharacters) {

        if (hp.Utils.defaults.paymentTypeOrder.indexOf(2) < 0) {
            return "";
        }

        if (typeof defaultCardCharacters === "undefined" || typeof defaultNameOnCardName === "undefined" || typeof defaultDateCharacters === "undefined") {
            throw new Error("hosted-payments.code.js : Cannot create template. Arguments are null or undefined.");
        }

        var $html = [
            '<div class="hp-code-title">To begin: Swipe a card or scan a barcode.</div>',
                '<div class="hp-code-image"></div>',
                '<div class="hp-card-visual hp-card-visual-flat">',
                    '<div class="hp-card-visual-number">' + defaultCardCharacters + '</div>',
                    '<div class="hp-card-visual-name">' + defaultNameOnCardName + '</div>',
                    '<div class="hp-card-visual-expiry">',
                    '<span class="hp-card-visual-expiry-label">Month/Year</span>',
                    '<span class="hp-card-visual-expiry-label-alt">Valid Thru</span>',
                    '<span class="hp-card-visual-expiry-value"><span class="hp-card-visual-expiry-month">' + defaultDateCharacters + '</span><span>/</span><span class="hp-card-visual-expiry-year">' + defaultDateCharacters + '</span></span>',
                '</div>',
            '</div>'
        ].join("");

        return $html;

    };

    Code.prototype.detachEvents = function() {

        this.$content.find(".hp-submit").off();
        this.$parent.off("hp.swipped");
        this.$parent.trigger("hp.notify");
        $(document).off("hp.global_swipped");
        $(window).off("keydown");

    };

    Code.prototype.attachEvents = function() {

        this.detachEvents();

        var $this = this;

        $(document).pos();

        $(document).on("hp.global_swipped_start", function(event, data) {
            hp.Utils.defaults.onSwipeStartCallback();
        });

        $(document).on("hp.global_swipped_end", function(event, data) {
            hp.Utils.defaults.onSwipeEndCallback(data);

            if (!hp.Utils.defaults.ignoreSubmission) {
                $this.handleSubmit(data);                
            }
        });

        // Kills spacebar page-down event
        $(window).on("keydown",function(e) {
            return e.keyCode != 32;
        });

    };

    Code.prototype.handleCharge = function(res) {

        var hasBalance = true,
            $this = this,
            cardBalance = 0;

        var errorResponse = {
            "status": "Error",
            "message": "The payment instrument provided had no remaining funds and will not be applied to the split payment.",
            "created_on": createdOn,
            "token": sessionId
        };

        var requestModel = {};

        if (hp.Utils.defaults.paymentType == hp.PaymentType.CHARGE) {

            requestModel = {
                "charge": {
                    "chargeRequest": {
                        "correlationId": hp.Utils.getCorrelationId(),
                        "token": hp.Utils.getSession().sessionToken,
                        "transactionId": res.transactionId,
                        "instrumentId": res.instrumentId,
                        "amount": hp.Utils.getAmount(),
                        "entryType" : hp.Utils.defaults.entryType,
                        "__request": res.request
                    }
                }
            };

        }

        if (hp.Utils.defaults.paymentType == hp.PaymentType.REFUND) {

            requestModel = {
                "refund": {
                    "refundRequest": {
                        "correlationId": hp.Utils.getCorrelationId(),
                        "token": hp.Utils.getSession().sessionToken,
                        "transactionId": res.transactionId,
                        "instrumentId": res.instrumentId,
                        "amount": hp.Utils.getAmount(),
                        "entryType" : hp.Utils.defaults.entryType,
                        "__request": res.request
                    }
                }
            };

        }

        hp.Utils.makeRequest(requestModel)
            .then(hp.Utils.buildResultObjectByType)
            .then(function(promiseResponse) {

                $this.$parent.trigger("hp.submit", {
                    "type": $this.requestTypes.charge,
                    "res": promiseResponse
                });

            })
            .fail(function(promiseResponse) {

                if (typeof promiseResponse.responseJSON !== "undefined") {
                    promiseResponse = promiseResponse.responseJSON;
                }

                $this.$parent.trigger("hp.submit", {
                    "type": $this.requestTypes.error,
                    "res": promiseResponse
                });

            });
    };

    Code.prototype.handleSubmit = function(data) {

        var $this = this;

        if (!data.is_valid) {
            $this.$parent.trigger("hp.submit", {
                "type": $this.requestTypes.error,
                "res": "Bad swipe. Please try again."
            });
            return;
        }

        if (data.name_on_card) {
            $this.formData.nameOnCard = data.name_on_card;
        }

        if (data.card_exp_date_year) {
            $this.formData.expYear = data.current_year + data.card_exp_date_year;
        }

        if (data.card_exp_date_month) {
            $this.formData.expMonth = data.card_exp_date_month;
        }

        if (data.card_number) {
            $this.formData.cardNumber = $.payment.formatCardNumber(data.card_number);
            $this.formData.cardType = $.payment.cardType(data.card_number);
        }

        $visualcodename.text($this.formData.nameOnCard);
        $visualcodecc.text($this.formData.cardNumber);
        $visualcodeyear.text($this.formData.expYear.substring($this.formData.expYear.length - 2));
        $visualcodemonth.text($this.formData.expMonth);

        $this.formData.trackOne = data.track_one;
        $this.formData.trackTwo = data.track_two;
        $this.formData.trackThree = data.track_three;
        $this.formData.ksn = data.ksn;

        $visualcode.addClass("hp-card-visual-flat-active");

        $this.formData._isValid = data.is_valid;
        $this.formData._isEMoney = data.is_emoney;

        var cardProperties = {};

        if ($this.formData._isValid && $this.formData.ksn !== "" && !$this.formData._isEMoney) {
            cardProperties = {
                "trackOne": $this.formData.trackOne,
                "trackTwo": $this.formData.trackTwo,
                "trackThree": $this.formData.trackThree,
                "ksn": $this.formData.ksn
            };
        }

        if (this.formData._isValid && $this.formData.ksn === "" && !$this.formData._isEMoney) {
            cardProperties = {
                "trackOne": $this.formData.trackOne,
                "trackTwo": $this.formData.trackTwo,
                "trackThree": "",
                "ksn": ""
            };
        }

        if (this.formData._isValid && $this.formData._isEMoney) {
            cardProperties = {
                "cardNumber": $this.formData.cardNumber.replace(/\s/gi, ""),
                "cvv": "999",
                "expirationDate": $this.formData.expMonth + "/" + $this.formData.expYear,
                "nameOnCard": $this.formData.nameOnCard
            };
        }

        hp.Utils.promptAvs().then(function(){

            return hp.Utils.makeRequest({
                "createPaymentInstrument": {
                    "createPaymentInstrumentRequest": {
                        "correlationId": hp.Utils.getCorrelationId(),
                        "token": hp.Utils.getSession().sessionToken,
                        "name": $this.formData.nameOnCard,
                        "properties": cardProperties,
                        "billingAddress": {
                            "addressLine1": hp.Utils.defaults.billingAddress.addressLine1,
                            "postalCode": hp.Utils.defaults.billingAddress.postalCode
                        },
                        "__swipe" : $this.formData
                    }
                }
            });

        }).then(function(res) {

            if (res.isException) {

                $this.$parent.trigger("hp.submit", {
                    "type": $this.requestTypes.error,
                    "res": res
                });

                return;
            }

            $this.instrumentId = res.instrumentId;
            $this.transactionId = res.transactionId;

            hp.Utils.showLoader();

            $this.$parent.trigger("hp.submit", {
                "type": 0,
                "res": res
            });

            $this.handleCharge(res);

        }).fail(function(err) {

            if (typeof err.responseJSON !== "undefined") {
                err = err.responseJSON;
            }

            $this.$parent.trigger("hp.submit", {
                "type": $this.requestTypes.error,
                "res": err
            });

        });

    };

    Code.prototype.handleSuccess = function(res) {
        hp.Utils.handleSuccess(res);

        if (typeof hp.Utils.defaults.successCallback !== "function") {
            this.showSuccess();
        }
    };

    Code.prototype.handleError = function(res) {
        hp.Utils.handleError(res);
        this.clearInputs();
    };

    Code.prototype.showSuccess = function(delay) {
        return hp.Utils.showSuccessPage(delay);
    };

    Code.prototype.isCreditCard = function() {
        return false;
    };

    Code.prototype.isCode = function() {
        return true;
    };

    Code.prototype.isBankAccount = function() {
        return false;
    };

    Code.prototype.isEMoney = function() {
        return false;
    };

    Code.prototype.isSuccessPage = function() {
        return false;
    };

    Code.prototype.isTransvault = function() {
        return false;
    };

    Code.prototype.isGiftCard = function() {
        return false;
    };

    /*
     * Export "Bank Account"
     */
    hp.Code = Code;

})(jQuery, window, document);

(function($, window, document, undefined) {

    "use strict";

    /*
     * Export "hp"
     */
    window.hp = hp || {};

    var messages = {
        "AuthorizationResponse": "Authorizing",
        "BeginSale": "Terminal active",
        "LoginSuccess": "Terminal active",
        "ExecuteCommand": "Terminal active",
        "DisplayAmount": "Waiting for customer",
        "DisplayForm": "Waiting for customer",
        "FindTermsAndConditions": "Waiting for customer",
        "Idle": "Waiting for customer",
        "Offline": "Terminal offline",
        "ProcessingError": "Declined",
        "ReadCardRequest": "Waiting for customer",
        "SetEmvPaymentType": "Checking EMV card type",
        "Gratuity": "Waiting for tip/gratuity",
        "CardInserted": "Perfoming EMV",
        "CardRemoved": "EMV Complete",
        "WaitingForSignature": "Waiting for signature",
        "DownloadingSignature": "Waiting for signature",
        "Signature": "Waiting for signature",
        "SignatureBlocks": "Waiting for signature",
        "StopTransaction": "Authorizing",
        "TermsAndConditions": "Waiting for TOC acceptance",
        "Operation Cancelled by User": "Transaction cancelled!"
    };

    var getMessage = function(eventName) {

        if (typeof eventName === "undefined") {
            eventName = "Idle";
        }

        var msg = messages[eventName];

        if (msg !== null && typeof message !== "undefined") {
            msg = messages.Idle;
        }

        return msg;
    };

    /*
     * Transvault Class
     */
    function Transvault($element) {
        this.context = null;
        this.$parent = null;
        this.$content = null;
        this.$element = $element;
        this.formData = {
            _isValid: false
        };
    }

    Transvault.prototype.init = function() {

        // utils call
        var context = hp.Utils.handleLegacyCssClassApplication("transvault", this.$element),
            $parent = context.parent,
            $content = context.content;

        // Clean parent, notify on complete.
        $parent
            .trigger("hp.notify");

        this.context = context;
        this.$parent = $parent;
        this.$content = $content;
        this.transvaultHub = $.connection.transvaultHub;
        this.shouldConnect = true;
        this.$btn = null;

        this.terminalId = hp.Utils.getTerminalId();
        this.connectionId = "0";
        this.correlationId = "";
        this.transactionId = hp.Utils.generateGuild();
    };

    Transvault.prototype.createTemplate = function() {

        if (hp.Utils.defaults.paymentTypeOrder.indexOf(3) < 0) {
            return "";
        }

        var $html = [
            '<div class="hp-transvault-visual">',
                '<div class="hp-transvault-visual-image {{isAlt}}">',
                    '<img class="event event-default" src="https://cdn.rawgit.com/etsms/786cb7bdd1d077acc10d7d7e08a4241f/raw/58a2ec726610c18c21716ae6023f7c6d776b5a71/terminal-loading.svg" alt="Status" />',
                '</div>',
                '<p class="hp-input-transvault-message {{isAlt}}">',
                    'Disconnected <span></span>',
                '</p>',
                '<button class="hp-submit hp-submit-danger">Cancel Request</button>',
            '</div>'
        ].join("");

        $html = $html.replace(/{{isAlt}}/gi, (hp.Utils.getTerminalId().startsWith("1") || hp.Utils.getTerminalId().startsWith("3")) ? "alt" : "");

        return $html;

    };

    Transvault.prototype.detachEvents = function() {
        this.$parent.off("hp.transvaultSuccess");
        this.$parent.off("hp.transvaultError");
        this.$parent.off("hp.transvaultProgress");
        this.$parent.find(".hp-submit").off();
        this.$parent.trigger("hp.notify");
    };

    Transvault.prototype.attachEvents = function() {

        this.detachEvents();

        var $this = this;

        $this.transvaultHub.connection.url = hp.Utils.defaults.baseUrl + "/transvault";
        $this.setupWebockets();

        $this.$parent.find(".hp-submit").on("click", function(e){
            e.preventDefault();
            $this.cancelTransaction();
            $(this).attr("disabled", "disabled").text("Canceling...");
            $this.setMessage("Canceling transaction");
        });

    };

    Transvault.prototype.onSuccess = function(response) {

        var $this = this,
            props = response.Properties;

        if (!props.ACCT) {
            props.ACCT = "";
        }

        if (!props.AN) {
            props.AN = "";
        }

        if (!props.AC) {
            props.AC = "";
        }

        if (!props.SD) {
            props.SD = "https://images.pmoney.com/00000000";
        } else {
            props.SD = props.SD.toLowerCase();
        }

        if (!props.CRDT) {
            props.CRDT = "";
        } else {
            props.CRDT = props.CRDT.toUpperCase().replace("ETS", "");
        }

        if (!props.RD) {
            props.RD = "";
        }

        if (!props.CEM) {
            props.CEM = "";
        } else {
            props.CEM = props.CEM
                .replace(/\s/gi, "_")
                .toUpperCase();
        }

        if (!props.EMV_APAN) {
            props.EMV_APAN = "";
        }

        if (!props.EMV_APN) {
            props.EMV_APN = "";
        }

        if (!props.CHN) {
            props.CHN = "";
        }

        if (!props.EMV_AID) {
            props.EMV_AID = "";
        }

        if (!props.EMV_TVR) {
            props.EMV_TVR = "";
        }

        if (!props.EMV_IAD) {
            props.EMV_IAD = "";
        }

        if (!props.EMV_TSI) {
            props.EMV_TSI = "";
        }

        if (!props.EMV_ARC) {
            props.EMV_ARC = "";
        }

        if (!props.EMV_TA) {
            props.EMV_TA = "";
        }

        if (!props.TCCT) {
            props.TCCT = "USD$";
        }

        if (!props.EMD) {
            props.EMD = "";
        } else {
            props.EMD = props.EMD
                .replace(/\s/gi, "_")
                .toUpperCase();
        }

        if (!props.CVMD) {
            props.CVMD = "";
        }

        if (!props.TT) {
            props.TT = "PURCHASE";
        }

        if (!props.VA) {

            props.VA = 0;

        } else {

            if (typeof props.VA === "string") {
                props.VA = +(props.VA.replace("$", ""));
            } else {
                props.VA = +(props.VA);
            }

        }

        if (!props.GA) {

            props.GA = 0;

        } else {

            if (typeof props.GA === "string") {
                props.GA = +(props.GA.replace("$", ""));
            } else {
                props.GA = +(props.GA);
            }

        }

        if (!props.TAX) {

            props.TAX = 0;

        } else {

            if (typeof props.TAX === "string") {
                props.TAX = +(props.TAX.replace("$", ""));
            } else {
                props.TAX = +(props.TAX);
            }

        }

        if (!props.CBA) {

            props.CBA = 0;

        } else {

            if (typeof props.CBA === "string") {
                props.CBA = +(props.CBA.replace("$", ""));
            } else {
                props.CBA = +(props.CBA);
            }

        }

        if (!props.SA) {

            props.SA = 0;

        } else {

            if (typeof props.SA === "string") {
                props.SA = +(props.SA.replace("$", ""));
            } else {
                props.SA = +(props.SA);
            }

        }

        if (!props.ED) {
            props.ED = "";
        } else {
            var year = (new Date().getFullYear().toString().substring(0, 2)) + props.ED.substr(2);
            var month = props.ED.substr(0, 2);
            props.ED = month + "/" + year;
        }

        if (props.AN === "" && props.EMV_APAN !== "") {
            props.AN = props.EMV_APAN;
        }

        if (props.AN !== "") {
            props.AN = props.AN.replace(/\*|\X|\x/gi, "");
        }

        if (props.AN.length > 4) {
            props.AN = props.AN.substr(props.AN.length - 4);
        }

        if (props.EMV_APN !== "") {
            props.CHN = props.EMV_APN;
        }

        var successResponse = {
            "status": "Success",
            "message": $.trim(props.RD),
            "amount": props.TA,
            "token": hp.Utils.getSession().sessionToken,
            "anti_forgery_token": hp.Utils.defaults.antiForgeryToken,
            "transaction_id": props.ETT,
            "transaction_approval_code": props.AC,
            "transaction_avs_street_passed": true,
            "transaction_avs_postal_code_passed": true,
            "transaction_currency": props.TCCT,
            "transaction_status_indicator": props.EMV_TSI,
            "transaction_type": props.TT,
            "transaction_tax": props.TAX,
            "transaction_surcharge": props.SA,
            "transaction_gratuity": props.GA,
            "transaction_cashback": props.CBA,
            "transaction_total": props.VA,
            "instrument_id": props.ACCT,
            "instrument_type": props.CRDT,
            "instrument_last_four": props.AN,
            "instrument_expiration_date": props.ED,
            "instrument_verification_method": props.CVMD,
            "instrument_entry_type": props.CEM,
            "instrument_entry_type_description": props.EMD,
            "instrument_verification_results": props.EMV_TVR,
            "created_on": (new Date()).toISOString(),
            "customer_name": props.CHN,
            "customer_signature": props.SD,
            "correlation_id": $this.correlationId,
            "application_identifier": props.EMV_AID,
            "application_response_code": props.EMV_ARC,
            "application_issuer_data": props.EMV_IAD
        };

        $this.$parent.trigger("hp.transvaultSuccess", successResponse);
    };

    Transvault.prototype.onError = function(response) {
        var $this = this;
        $this.$parent.trigger("hp.transvaultError", response);
    };

    Transvault.prototype.setMessage = function(message) {
        this.$parent.find(".hp-input-transvault-message").text(message);
    };

    Transvault.prototype.onEvent = function(response) {

        var $this = this,
            msg = getMessage(response);

        $this.setMessage(msg);

        $this.$parent.trigger("hp.transvaultEvent", msg);

        if (response === "DownloadingSignature") {
            hp.Utils.showLoader();
        }

    };

    Transvault.prototype.cancelTransaction = function() {

        var token = hp.Utils.getSession().sessionToken,
            correlationId = hp.Utils.getCorrelationId();

        if (this.transvaultHub && this.transvaultHub.server && this.transvaultHub.server.cancelTransaction) {
            this.transvaultHub.server.cancelTransaction(token, correlationId);
        }

    };

    Transvault.prototype.onCancelled = function() {

        this.$parent.find(".event-default").hide();
        this.$parent.find(".hp-submit").hide();

    };

    Transvault.prototype.setupWebockets = function(amount) {

        var $this = this,
            $message = $this.$parent.find(".hp-input-transvault-message");

        amount = amount || hp.Utils.getAmount();
        $this.correlationId = hp.Utils.getCorrelationId();

        if (!$this.shouldConnect) {
            return;
        }

        $message.off("click").removeClass("hp-input-transvault-message-btn").text("Connecting");

        setTimeout(function() {

            $this.transvaultHub.client.onSuccess = function(res) {
                $this.onSuccess(res);
            };

            $this.transvaultHub.client.onError = function(res) {
                
                if (res === "Operation Cancelled by User") {
                    $this.onEvent(res);
                    $this.onCancelled();
                    return;
                }

                $this.onError(res);
            };

            $this.transvaultHub.client.onEvent = function(res) {
                $this.onEvent(res);
            };

            $this.transvaultHub.connection.start({
                    withCredentials: false,
                    jsonp: true
                })
                .done(function() {

                    var token = hp.Utils.getSession().sessionToken;

                    $this.transvaultHub.server.registerClientWithApiKey(token);

                    hp.Utils.makeRequest({
                        "transvault": {
                            "transvaultRequest": {
                                "token": token,
                                "amount": amount,
                                "transactionId": $this.transactionId,
                                "correlationId": $this.correlationId,
                                "entryType": hp.Utils.defaults.entryType,
                                "terminalId": $this.terminalId,
                                "action": hp.Utils.defaults.paymentType
                            }
                        }
                    }).then(function(res) {

                        $this.$parent.trigger("hp.transvaultProgress");

                    }, function(err) {

                        $this.$parent.trigger("hp.transvaultError", err.responseJSON);

                        $message.css("color", "#FC5F45").text("Could not connect!");

                    });

                })
                .fail(function(err) {

                    $message.css("color", "#FC5F45").text("Could not connect!");

                });

        }, 0);

        $this.$parent.trigger("hp.notify");

    };

    Transvault.prototype.showSuccess = function(delay) {

        if (typeof hp.Utils.defaults.successCallback !== "function") {
            hp.Utils.showSuccessPage(delay);
        }
        
    };

    Transvault.prototype.isCreditCard = function() {
        return false;
    };

    Transvault.prototype.isBankAccount = function() {
        return false;
    };

    Transvault.prototype.isEMoney = function() {
        return false;
    };

    Transvault.prototype.isSuccessPage = function() {
        return false;
    };

    Transvault.prototype.isCode = function() {
        return false;
    };

    Transvault.prototype.isTransvault = function() {
        return true;
    };

    Transvault.prototype.isGiftCard = function() {
        return false;
    };

    /*
     * Export "Transvault"
     */
    hp.Transvault = Transvault;

})(jQuery, window, document);

// Generated by CoffeeScript 1.7.1
(function() {
  var $, cardFromNumber, cardFromType, cards, defaultFormat, formatBackCardNumber, formatBackExpiry, formatCardNumber, formatExpiry, formatForwardExpiry, formatForwardSlashAndSpace, hasTextSelected, luhnCheck, reFormatCardNumber, reFormatExpiry, restrictCVC, restrictCardNumber, restrictExpiry, restrictNumeric, setCardType,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = jQuery;

  $.payment = {};

  $.payment.fn = {};

  $.fn.payment = function() {
    var args, method;
    method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return $.payment.fn[method].apply(this, args);
  };

  defaultFormat = /(\d{1,4})/g;

  cards = [
    {
      type: 'visaelectron',
      pattern: /^4(026|17500|405|508|844|91[37])/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'maestro',
      pattern: /^(5(018|0[23]|[68])|6(39|7))/,
      format: defaultFormat,
      length: [12, 13, 14, 15, 16, 17, 18, 19],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'forbrugsforeningen',
      pattern: /^600/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'dankort',
      pattern: /^5019/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'visa',
      pattern: /^4/,
      format: defaultFormat,
      length: [13, 16],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'mastercard',
      pattern: /^5[0-5]/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'amex',
      pattern: /^3[47]/,
      format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
      length: [15],
      cvcLength: [3, 4],
      luhn: true
    }, {
      type: 'dinersclub',
      pattern: /^3[0689]/,
      format: defaultFormat,
      length: [14],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'discover',
      pattern: /^6([045]|22)/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'jcb',
      pattern: /^35/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'emoney',
      pattern: /^627571/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true
    }
  ];

  cardFromNumber = function(num) {
    var card, _i, _len;
    num = (num + '').replace(/\D/g, '');
    for (_i = 0, _len = cards.length; _i < _len; _i++) {
      card = cards[_i];
      if (card.pattern.test(num)) {
        return card;
      }
    }
  };

  cardFromType = function(type) {
    var card, _i, _len;
    for (_i = 0, _len = cards.length; _i < _len; _i++) {
      card = cards[_i];
      if (card.type === type) {
        return card;
      }
    }
  };

  luhnCheck = function(num) {
    var digit, digits, odd, sum, _i, _len;
    odd = true;
    sum = 0;
    digits = (num + '').split('').reverse();
    for (_i = 0, _len = digits.length; _i < _len; _i++) {
      digit = digits[_i];
      digit = parseInt(digit, 10);
      if ((odd = !odd)) {
        digit *= 2;
      }
      if (digit > 9) {
        digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  };

  hasTextSelected = function($target) {
    var _ref;
    if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== $target.prop('selectionEnd')) {
      return true;
    }
    if (typeof document !== "undefined" && document !== null ? (_ref = document.selection) != null ? typeof _ref.createRange === "function" ? _ref.createRange().text : void 0 : void 0 : void 0) {
      return true;
    }
    return false;
  };

  reFormatCardNumber = function(e) {
    return setTimeout(function() {
      var $target, value;
      $target = $(e.currentTarget);
      value = $target.val();
      value = $.payment.formatCardNumber(value);
      return $target.val(value);
    });
  };

  formatCardNumber = function(e) {
    var $target, card, digit, length, re, upperLength, value;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    $target = $(e.currentTarget);
    value = $target.val();
    card = cardFromNumber(value + digit);
    length = (value.replace(/\D/g, '') + digit).length;
    upperLength = 16;
    if (card) {
      upperLength = card.length[card.length.length - 1];
    }
    if (length >= upperLength) {
      return;
    }
    if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
      return;
    }
    if (card && card.type === 'amex') {
      re = /^(\d{4}|\d{4}\s\d{6})$/;
    } else {
      re = /(?:^|\s)(\d{4})$/;
    }
    if (re.test(value)) {
      e.preventDefault();
      return setTimeout(function() {
        return $target.val(value + ' ' + digit);
      });
    } else if (re.test(value + digit)) {
      e.preventDefault();
      return setTimeout(function() {
        return $target.val(value + digit + ' ');
      });
    }
  };

  formatBackCardNumber = function(e) {
    var $target, value;
    $target = $(e.currentTarget);
    value = $target.val();
    if (e.which !== 8) {
      return;
    }
    if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
      return;
    }
    if (/\d\s$/.test(value)) {
      e.preventDefault();
      return setTimeout(function() {
        return $target.val(value.replace(/\d\s$/, ''));
      });
    } else if (/\s\d?$/.test(value)) {
      e.preventDefault();
      return setTimeout(function() {
        return $target.val(value.replace(/\s\d?$/, ''));
      });
    }
  };

  reFormatExpiry = function(e) {
    return setTimeout(function() {
      var $target, value;
      $target = $(e.currentTarget);
      value = $target.val();
      value = $.payment.formatExpiry(value);
      return $target.val(value);
    });
  };

  formatExpiry = function(e) {
    var $target, digit, val;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    $target = $(e.currentTarget);
    val = $target.val() + digit;
    if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
      e.preventDefault();
      return setTimeout(function() {
        return $target.val("0" + val + " / ");
      });
    } else if (/^\d\d$/.test(val)) {
      e.preventDefault();
      return setTimeout(function() {
        return $target.val("" + val + " / ");
      });
    }
  };

  formatForwardExpiry = function(e) {
    var $target, digit, val;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    $target = $(e.currentTarget);
    val = $target.val();
    if (/^\d\d$/.test(val)) {
      return $target.val("" + val + " / ");
    }
  };

  formatForwardSlashAndSpace = function(e) {
    var $target, val, which;
    which = String.fromCharCode(e.which);
    if (!(which === '/' || which === ' ')) {
      return;
    }
    $target = $(e.currentTarget);
    val = $target.val();
    if (/^\d$/.test(val) && val !== '0') {
      return $target.val("0" + val + " / ");
    }
  };

  formatBackExpiry = function(e) {
    var $target, value;
    $target = $(e.currentTarget);
    value = $target.val();
    if (e.which !== 8) {
      return;
    }
    if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
      return;
    }
    if (/\s\/\s\d?$/.test(value)) {
      e.preventDefault();
      return setTimeout(function() {
        return $target.val(value.replace(/\s\/\s\d?$/, ''));
      });
    }
  };

  restrictNumeric = function(e) {
    var input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
  };

  restrictCardNumber = function(e) {
    var $target, card, digit, value;
    $target = $(e.currentTarget);
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    if (hasTextSelected($target)) {
      return;
    }
    value = ($target.val() + digit).replace(/\D/g, '');
    card = cardFromNumber(value);
    if (card) {
      return value.length <= card.length[card.length.length - 1];
    } else {
      return value.length <= 16;
    }
  };

  restrictExpiry = function(e) {
    var $target, digit, value;
    $target = $(e.currentTarget);
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    if (hasTextSelected($target)) {
      return;
    }
    value = $target.val() + digit;
    value = value.replace(/\D/g, '');
    if (value.length > 6) {
      return false;
    }
  };

  restrictCVC = function(e) {
    var $target, digit, val;
    $target = $(e.currentTarget);
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    if (hasTextSelected($target)) {
      return;
    }
    val = $target.val() + digit;
    return val.length <= 4;
  };

  setCardType = function(e) {
    var $target, allTypes, card, cardType, val;
    $target = $(e.currentTarget);
    val = $target.val();
    cardType = $.payment.cardType(val) || 'unknown';
    if (!$target.hasClass(cardType)) {
      allTypes = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = cards.length; _i < _len; _i++) {
          card = cards[_i];
          _results.push(card.type);
        }
        return _results;
      })();
      $target.removeClass('unknown');
      $target.removeClass(allTypes.join(' '));
      $target.addClass(cardType);
      $target.toggleClass('identified', cardType !== 'unknown');
      return $target.trigger('payment.cardType', cardType);
    }
  };

  $.payment.fn.formatCardCVC = function() {
    this.payment('restrictNumeric');
    this.on('keypress', restrictCVC);
    return this;
  };

  $.payment.fn.formatCardExpiry = function() {
    this.payment('restrictNumeric');
    this.on('keypress', restrictExpiry);
    this.on('keypress', formatExpiry);
    this.on('keypress', formatForwardSlashAndSpace);
    this.on('keypress', formatForwardExpiry);
    this.on('keydown', formatBackExpiry);
    this.on('change', reFormatExpiry);
    this.on('input', reFormatExpiry);
    return this;
  };

  $.payment.fn.formatCardNumber = function() {
    this.payment('restrictNumeric');
    this.on('keypress', restrictCardNumber);
    this.on('keypress', formatCardNumber);
    this.on('keydown', formatBackCardNumber);
    this.on('keyup', setCardType);
    this.on('paste', reFormatCardNumber);
    this.on('change', reFormatCardNumber);
    this.on('input', reFormatCardNumber);
    this.on('input', setCardType);
    return this;
  };

  $.payment.fn.restrictNumeric = function() {
    this.on('keypress', restrictNumeric);
    return this;
  };

  $.payment.fn.cardExpiryVal = function() {
    return $.payment.cardExpiryVal($(this).val());
  };

  $.payment.cardExpiryVal = function(value) {
    var month, prefix, year, _ref;
    value = value.replace(/\s/g, '');
    _ref = value.split('/', 2), month = _ref[0], year = _ref[1];
    if ((year != null ? year.length : void 0) === 2 && /^\d+$/.test(year)) {
      prefix = (new Date).getFullYear();
      prefix = prefix.toString().slice(0, 2);
      year = prefix + year;
    }
    month = parseInt(month, 10);
    year = parseInt(year, 10);
    return {
      month: month,
      year: year
    };
  };

  $.payment.validateCardNumber = function(num) {
    var card, _ref;
    num = (num + '').replace(/\s+|-/g, '');
    if (!/^\d+$/.test(num)) {
      return false;
    }
    card = cardFromNumber(num);
    if (!card) {
      return false;
    }
    return (_ref = num.length, __indexOf.call(card.length, _ref) >= 0) && (card.luhn === false || luhnCheck(num));
  };

  $.payment.validateCardExpiry = function(month, year) {
    var currentTime, expiry, _ref;
    if (typeof month === 'object' && 'month' in month) {
      _ref = month, month = _ref.month, year = _ref.year;
    }
    if (!(month && year)) {
      return false;
    }
    month = $.trim(month);
    year = $.trim(year);
    if (!/^\d+$/.test(month)) {
      return false;
    }
    if (!/^\d+$/.test(year)) {
      return false;
    }
    if (!((1 <= month && month <= 12))) {
      return false;
    }
    if (year.length === 2) {
      if (year < 70) {
        year = "20" + year;
      } else {
        year = "19" + year;
      }
    }
    if (year.length !== 4) {
      return false;
    }
    expiry = new Date(year, month);
    currentTime = new Date;
    expiry.setMonth(expiry.getMonth() - 1);
    expiry.setMonth(expiry.getMonth() + 1, 1);
    return expiry > currentTime;
  };

  $.payment.validateCardCVC = function(cvc, type) {
    var card, _ref;
    cvc = $.trim(cvc);
    if (!/^\d+$/.test(cvc)) {
      return false;
    }
    card = cardFromType(type);
    if (card != null) {
      return _ref = cvc.length, __indexOf.call(card.cvcLength, _ref) >= 0;
    } else {
      return cvc.length >= 3 && cvc.length <= 4;
    }
  };

  $.payment.cardType = function(num) {
    var _ref;
    if (!num) {
      return null;
    }
    return ((_ref = cardFromNumber(num)) != null ? _ref.type : void 0) || null;
  };

  $.payment.formatCardNumber = function(num) {
    var card, groups, upperLength, _ref;
    card = cardFromNumber(num);
    if (!card) {
      return num;
    }
    upperLength = card.length[card.length.length - 1];
    num = num.replace(/\D/g, '');
    num = num.slice(0, upperLength);
    if (card.format.global) {
      return (_ref = num.match(card.format)) != null ? _ref.join(' ') : void 0;
    } else {
      groups = card.format.exec(num);
      if (groups == null) {
        return;
      }
      groups.shift();
      groups = $.grep(groups, function(n) {
        return n;
      });
      return groups.join(' ');
    }
  };

  $.payment.formatExpiry = function(expiry) {
    var mon, parts, sep, year;
    parts = expiry.match(/^\D*(\d{1,2})(\D+)?(\d{1,4})?/);
    if (!parts) {
      return '';
    }
    mon = parts[1] || '';
    sep = parts[2] || '';
    year = parts[3] || '';
    if (year.length > 0 || (sep.length > 0 && !(/\ \/?\ ?/.test(sep)))) {
      sep = ' / ';
    }
    if (mon.length === 1 && (mon !== '0' && mon !== '1')) {
      mon = "0" + mon;
      sep = ' / ';
    }
    return mon + sep + year;
  };

}).call(this);

(function($) {

    var defaults = {}

    $.fn.pos = function(options) {

        //define instance for use in child functions

        var $this = $(this),
            cardNumberRegex = new RegExp(/^(?:%B|\;)([0-9]+)/ig),
            nameOnCardRegex = new RegExp(/(?:\^(.*)\^)/ig),
            expirationDateRegex = new RegExp(/(?:\^(?:.*)\^|=)(\d{4})/ig),
            trackRegex = new RegExp(/\|([A-Z0-9]+)(?=\|)/ig),
            unencryptedTrackRegex = new RegExp(/^(.*?\?)(;.*)/ig),
            hasTrack = false;

        var data = {
            swipe: ''
        };

        //set default options
        defaults = {
            swipe: true
        };

        // helper
        var hasValue = function(match, index) {
            var result = false;

            try {
                result = typeof match[index] !== "undefined";
            } catch (err) {}

            return result;
        }

        //extend options
        $this.options = $.extend(true, {}, defaults, options);

        $this.off("keypress").on("keypress", function(event) {

            if ($this.options.swipe) {

                if (event.which != 13) {

                    data.swipe += String.fromCharCode(event.which);

                    if (data.swipe.length == 2 && data.swipe == "%B") {
                        $this.trigger("hp.global_swipped_start");
                    }

                    return;
                }

                var result = {
                    track_one: "",
                    track_two: "",
                    track_three: "",
                    ksn: "",
                    card_number: "",
                    name_on_card: "",
                    card_exp_date_month: "",
                    card_exp_date_year: "",
                    is_valid: true,
                    is_emoney: false,
                    current_year: new Date().getFullYear().toString().substring(0, 2)
                };

                var parsedCardNumberResult = cardNumberRegex.exec(data.swipe),
                    parsedNameOnCardResult = nameOnCardRegex.exec(data.swipe),
                    parsedExpirationDateResult = expirationDateRegex.exec(data.swipe),
                    parsedTrackResult = data.swipe.match(trackRegex),
                    parsedUnencryptedResult = unencryptedTrackRegex.exec(data.swipe);

                // Assign card number result:
                if (parsedCardNumberResult != null && parsedCardNumberResult.length) {
                    result.card_number = parsedCardNumberResult[1];
                }

                // Assign name on card result:
                if (parsedNameOnCardResult != null && parsedNameOnCardResult.length) {

                    var name = parsedNameOnCardResult[1];

                    if (name.indexOf(",") === -1) {
                        name = name.replace(/\/+|\d+/gi, " ");
                    } else {
                        name = $.trim(name.replace(/\//gi, " ").replace(/\W+/gi, " "));
                    }


                    if (name.split(" ").length > 2) {
                        name = name.split(" ")[1] + " " + name.split(" ")[2] + " " + name.split(" ")[0];
                    } else {
                        name = name.split(" ")[1] + " " + name.split(" ")[0];
                    }

                    result.name_on_card = name;
                }

                // Assign expiration date result:
                if (parsedExpirationDateResult != null && parsedExpirationDateResult.length) {

                    var date = parsedExpirationDateResult[1],
                        year = date.substring(0, 2),
                        month = date.substring(2);

                    // current century : new Date().getFullYear().toString().substring(0, 2)

                    result.card_exp_date_year = year;
                    result.card_exp_date_month = month;
                }


                // Clean matches
                if (parsedTrackResult != null && parsedTrackResult.length) {

                    parsedTrackResult = parsedTrackResult.map(function(match) {
                        return match.replace("|", "");
                    });

                    // Assign track one result:
                    if (hasValue(parsedTrackResult, 1)) {
                        result.track_one = parsedTrackResult[1];
                    }

                    // Assign track two result:
                    if (hasValue(parsedTrackResult, 2)) {
                        result.track_two = parsedTrackResult[2];
                    }

                    // Assign track three result:
                    if (parsedTrackResult.length >= 10 && hasValue(parsedTrackResult, 3)) {
                        result.track_three = parsedTrackResult[3];
                    }

                    // Assign ksn result:
                    if (parsedTrackResult.length >= 10 && hasValue(parsedTrackResult, 8)) {
                        result.ksn = parsedTrackResult[8];
                    } else if (parsedTrackResult.length === 9) {
                        result.ksn = parsedTrackResult[7];
                    }

                } else if (parsedUnencryptedResult != null && parsedUnencryptedResult.length >= 3) {

                    result.track_one = parsedUnencryptedResult[1];
                    result.track_two = parsedUnencryptedResult[2];

                } else {
                    result.is_valid = false;
                }


                if (event.which == 13) {

                    // Handles Gift Card Scan
                    if (!result.is_valid && result.card_number.indexOf("627571") !== -1) {
                        result.is_valid = true;
                        result.is_emoney = true;
                        result.name_on_card = "EMoney Card";
                        result.card_exp_date_year = (+(new Date().getFullYear().toString().substring(2)) + 9).toString();
                        result.card_exp_date_month = "12";
                    }

                    if (data.swipe.indexOf("%E?") !== -1 || data.swipe.indexOf("+E?") !== -1 || data.swipe.indexOf(";E?") !== -1) {
                        result.is_valid = false;
                    }

                    if (result.name_on_card === "") {
                        result.name_on_card = "Unknown Card";
                    }

                    result.name_on_card = $.trim(result.name_on_card.replace("undefined", ""));

                    $this.trigger("hp.global_swipped_end", result);
                    data.swipe = '';
                }

            }

        });
    };

})(jQuery);

// Generated by CoffeeScript 1.4.0
(function() {
  var $;

  $ = window.jQuery || window.Zepto || window.$;

  $.fn.fancySelect = function(opts) {
    var isiOS, settings;
    if (opts == null) {
      opts = {};
    }
    settings = $.extend({
      forceiOS: false,
      includeBlank: false,
      optionTemplate: function(optionEl) {
        return optionEl.text();
      },
      triggerTemplate: function(optionEl) {
        return optionEl.text();
      }
    }, opts);
    isiOS = !!navigator.userAgent.match(/iP(hone|od|ad)/i);
    return this.each(function() {
      var copyOptionsToList, disabled, options, sel, trigger, updateTriggerText, wrapper;
      sel = $(this);
      if (sel.hasClass('fancified') || sel[0].tagName !== 'SELECT') {
        return;
      }
      sel.addClass('fancified');
      sel.css({
        width: 1,
        height: 1,
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 0
      });
      sel.wrap('<div class="fancy-select">');
      wrapper = sel.parent();
      if (sel.data('class')) {
        wrapper.addClass(sel.data('class'));
      }
      wrapper.append('<div class="trigger">');
      if (!(isiOS && !settings.forceiOS)) {
        wrapper.append('<ul class="options">');
      }
      trigger = wrapper.find('.trigger');
      options = wrapper.find('.options');
      disabled = sel.prop('disabled');
      if (disabled) {
        wrapper.addClass('disabled');
      }
      updateTriggerText = function() {
        var triggerHtml;
        triggerHtml = settings.triggerTemplate(sel.find(':selected'));
        return trigger.html(triggerHtml);
      };
      sel.on('blur.fs', function() {
        if (trigger.hasClass('open')) {
          return setTimeout(function() {
            return trigger.trigger('close.fs');
          }, 120);
        }
      });
      trigger.on('close.fs', function() {
        trigger.removeClass('open');
        return options.removeClass('open');
      });
      trigger.on('click.fs', function() {
        var offParent, parent;
        if (!disabled) {
          trigger.toggleClass('open');
          if (isiOS && !settings.forceiOS) {
            if (trigger.hasClass('open')) {
              return sel.focus();
            }
          } else {
            if (trigger.hasClass('open')) {
              parent = trigger.parent();
              offParent = parent.offsetParent();
              if ((parent.offset().top + parent.outerHeight() + options.outerHeight() + 20) > $(window).height() + $(window).scrollTop()) {
                options.addClass('overflowing');
              } else {
                options.removeClass('overflowing');
              }
            }
            options.toggleClass('open');
            if (!isiOS) {
              return sel.focus();
            }
          }
        }
      });
      sel.on('enable', function() {
        sel.prop('disabled', false);
        wrapper.removeClass('disabled');
        disabled = false;
        return copyOptionsToList();
      });
      sel.on('disable', function() {
        sel.prop('disabled', true);
        wrapper.addClass('disabled');
        return disabled = true;
      });
      sel.on('change.fs', function(e) {
        if (e.originalEvent && e.originalEvent.isTrusted) {
          return e.stopPropagation();
        } else {
          return updateTriggerText();
        }
      });
      sel.on('keydown', function(e) {
        var hovered, newHovered, w;
        w = e.which;
        hovered = options.find('.hover');
        hovered.removeClass('hover');
        if (!options.hasClass('open')) {
          if (w === 13 || w === 32 || w === 38 || w === 40) {
            e.preventDefault();
            return trigger.trigger('click.fs');
          }
        } else {
          if (w === 38) {
            e.preventDefault();
            if (hovered.length && hovered.index() > 0) {
              hovered.prev().addClass('hover');
            } else {
              options.find('li:last-child').addClass('hover');
            }
          } else if (w === 40) {
            e.preventDefault();
            if (hovered.length && hovered.index() < options.find('li').length - 1) {
              hovered.next().addClass('hover');
            } else {
              options.find('li:first-child').addClass('hover');
            }
          } else if (w === 27) {
            e.preventDefault();
            trigger.trigger('click.fs');
          } else if (w === 13 || w === 32) {
            e.preventDefault();
            hovered.trigger('mousedown.fs');
          } else if (w === 9) {
            if (trigger.hasClass('open')) {
              trigger.trigger('close.fs');
            }
          }
          newHovered = options.find('.hover');
          if (newHovered.length) {
            options.scrollTop(0);
            return options.scrollTop(newHovered.position().top - 12);
          }
        }
      });
      options.on('mousedown.fs', 'li', function(e) {
        var clicked;
        clicked = $(this);
        sel.val(clicked.data('raw-value'));
        if (!isiOS) {
          sel.trigger('blur.fs').trigger('focus.fs');
        }
        options.find('.selected').removeClass('selected');
        clicked.addClass('selected');
        trigger.addClass('selected');
        return sel.val(clicked.data('raw-value')).trigger('change.fs').trigger('blur.fs').trigger('focus.fs');
      });
      options.on('mouseenter.fs', 'li', function() {
        var hovered, nowHovered;
        nowHovered = $(this);
        hovered = options.find('.hover');
        hovered.removeClass('hover');
        return nowHovered.addClass('hover');
      });
      options.on('mouseleave.fs', 'li', function() {
        return options.find('.hover').removeClass('hover');
      });
      copyOptionsToList = function() {
        var selOpts;
        updateTriggerText();
        if (isiOS && !settings.forceiOS) {
          return;
        }
        selOpts = sel.find('option');
        return sel.find('option').each(function(i, opt) {
          var optHtml;
          opt = $(opt);
          if (!opt.prop('disabled') && (opt.val() || settings.includeBlank)) {
            optHtml = settings.optionTemplate(opt);
            if (opt.prop('selected')) {
              return options.append("<li data-raw-value=\"" + (opt.val()) + "\" class=\"selected\">" + optHtml + "</li>");
            } else {
              return options.append("<li data-raw-value=\"" + (opt.val()) + "\">" + optHtml + "</li>");
            }
          }
        });
      };
      sel.on('update.fs', function() {
        wrapper.find('.options').empty();
        return copyOptionsToList();
      });
      return copyOptionsToList();
    });
  };

}).call(this);
/*
 *  jQuery Hosted Payments - v3.1.0
 *
 *  Made by Erik Zettersten
 *  Under MIT License
 */
(function($, window, document, undefined) {

    var pluginName = "hp",
        defaults = {};

    defaults.version = "v3";
    defaults.amount = 0;
    defaults.baseUrl = "https://www.etsemoney.com/hp/v3/adapters";
    defaults.defaultCardCharacters = "&middot;&middot;&middot;&middot; &middot;&middot;&middot;&middot; &middot;&middot;&middot;&middot; &middot;&middot;&middot;&middot;";
    defaults.defaultDateCharacters = "&middot;&middot;";
    defaults.defaultNameOnCardName = "Name On Card";
    defaults.defaultNameOnCardNameSwipe = "Swipe/Scan Card";
    defaults.defaultName = "Full Name";
    defaults.defaultPhone = "800-834-7790";
    defaults.defaultErrorLabel = "Declined";
    defaults.defaultRedirectLabel = "You are being redirected...";
    defaults.defaultSuccessLabel = "Transaction Complete!";
    defaults.paymentTypeOrder = [0, 1];
    defaults.paymentService = "EFT";
    defaults.defaultAccountNumberCharacters = "&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;";
    defaults.defaultRoutingNumberCharacters = "&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;";
    defaults.correlationId = "";
    defaults.successCallback = $.noop;
    defaults.errorCallback = $.noop;
    defaults.onSwipeStartCallback = $.noop;
    defaults.onSwipeEndCallback = $.noop;
    defaults.onAvsDismissCallback = $.noop;
    defaults.onErrorDismissCallback = $.noop;
    defaults.ignoreSubmission = false;
    defaults.terminalId = "";
    defaults.instrumentId = "";
    defaults.apiKey = "";
    defaults.paymentType = hp.PaymentType.CHARGE; // "CHARGE", "REFUND"
    defaults.entryType = hp.EntryType.KEYED_CARD_NOT_PRESENT; // "DEVICE_CAPTURED", "KEYED_CARD_PRESENT", "KEYED_CARD_NOT_PRESENT"
    defaults.billingAddress = {};
    defaults.billingAddress.addressLine1 = "";
    defaults.billingAddress.postalCode = "";
    defaults.antiForgeryToken = "";
    defaults.antiForgeryName = "__RequestVerificationToken";
    defaults.customerName = "";
    defaults.promptForAvs = false;
    defaults.allowAvsSkip = true;

    function Plugin(element, options) {

        this._name = pluginName;
        this.element = element;

        if (typeof options.entryType !== "undefined") {
            options.entryType = hp.Utils.setEntryType(options.entryType);
        }

        if (typeof options.paymentType !== "undefined") {
            options.paymentType = hp.Utils.setPaymentType(options.paymentType);
        }

        hp.Utils.defaults = jQuery.extend({}, defaults, options);

        this.init();
        hp.Utils.__instance = this;
    }

    /*
     * Main
     */
    var intialize = function() {

        var that = this,
            $element = $(that.element),
            sessionId = "",
            apiKey = "",
            createdOn = (new Date()).toISOString();

        if (hp.Utils.getSession().apiKey === "") {

            if (typeof $element.data("etsKey") !== "undefined") {
                apiKey = $element.data("etsKey").toString();
                hp.Utils.defaults.apiKey = apiKey;
            } else {
                apiKey = hp.Utils.defaults.apiKey;
            }

            hp.Utils.setSession(apiKey, true);
        }
        
        if (typeof $element.data("avsStreet") !== "undefined") {
            hp.Utils.defaults.billingAddress.addressLine1 = $element.data("avsStreet").toString();
        }

        if (typeof $element.data("avsZip") !== "undefined") {
            hp.Utils.defaults.billingAddress.postalCode = $element.data("avsZip").toString();
        }

        if (typeof $element.data("entryType") !== "undefined") {
            hp.Utils.defaults.entryType = hp.Utils.setEntryType($element.data("entryType"));
        }

        if (typeof $element.data("paymentType") !== "undefined") {
            hp.Utils.defaults.paymentType = hp.Utils.setPaymentType($element.data("paymentType"));
        }

        if (typeof $element.data("promptForAvs") !== "undefined") {
            hp.Utils.defaults.promptForAvs = $element.data("promptForAvs").toString().toLowerCase() == "false" ? false : true;
        }

        if (typeof $element.data("allowAvsSkip") !== "undefined") {
            hp.Utils.defaults.allowAvsSkip = $element.data("allowAvsSkip").toString().toLowerCase() == "false" ? false : true;
        }

        if (typeof $element.data("correlationId") !== "undefined") {
            hp.Utils.defaults.correlationId = $element.data("correlationId").toString();
        }

        if (typeof $element.data("terminalId") !== "undefined") {
            hp.Utils.defaults.terminalId = $element.data("terminalId").toString();
        }

        if (typeof $element.data("instrumentId") !== "undefined") {
            hp.Utils.defaults.instrumentId = $element.data("instrumentId").toString();
        }

        if (typeof $element.data("baseUrl") !== "undefined") {
            hp.Utils.defaults.baseUrl = $element.data("baseUrl").toString();
        }

        if (typeof $element.data("customerName") !== "undefined") {
            hp.Utils.defaults.customerName = $element.data("customerName").toString();
        }

        if (typeof $element.data("defaultPhone") !== "undefined") {
            hp.Utils.defaults.defaultPhone = $element.data("defaultPhone").toString();
        }

        if (typeof $element.data("errorLabel") !== "undefined") {
            hp.Utils.defaults.defaultErrorLabel = $element.data("errorLabel").toString();
        }

        if (typeof $element.data("redirectLabel") !== "undefined") {
            hp.Utils.defaults.defaultRedirectLabel = $element.data("redirectLabel").toString();
        }

        if (typeof $element.data("successLabel") !== "undefined") {
            hp.Utils.defaults.defaultSuccessLabel = $element.data("successLabel").toString();
        }

        if (typeof $element.data("ignoreSubmission") !== "undefined") {
            hp.Utils.defaults.ignoreSubmission = $element.data("ignoreSubmission").toString().toLowerCase() === "true";
        }

        if (typeof $element.data("paymentTypeOrder") !== "undefined") {
            hp.Utils.defaults.paymentTypeOrder = $.trim($element.data("paymentTypeOrder")
                .toString()
                .replace(" ", ""))
                .split(",")
                .map(function(item) {
                    return +item;
                });
        }

        if (typeof $element.data("amount") !== "undefined") {
            hp.Utils.setAmount($element.data("amount"));
        }

        if (typeof $element.data("antiForgeryToken") !== "undefined") {
            hp.Utils.defaults.antiForgeryToken = $element.data("antiForgeryToken").toString();
        } else {
            hp.Utils.defaults.antiForgeryToken = hp.Utils.generateGuild();
        }

        if (typeof $element.data("antiForgeryName") !== "undefined") {
            hp.Utils.defaults.antiForgeryName = $element.data("antiForgeryName").toString();
        }

        $element.attr("data-ets-key", hp.Utils.generateGuild());

        hp.Utils.setPaymentInstrument();
        hp.Utils.signIn();
        hp.Utils.setupPluginInstances($element);

    };

    $.extend(Plugin.prototype, {

        init: function() {

            var $element = $(this.element),
                name = "",
                type = hp.types.Adapter;

            if ($element.data("event") !== null && typeof $element.data("event") !== "undefined") {
                type = hp.types.Event;
                name = $element.data("event");
            }

            if ($element.data("inventory") !== null && typeof $element.data("inventory") !== "undefined") {
                type = hp.types.Product;
                name = $element.data("inventory");
            }

            // Get outer wrapper width and set css class for mobile purposes
            hp.Utils.setContainerClass($element);

            if (type === hp.types.Event) {

                name = $element.data("event");

            } else if (type === hp.types.Product) {

                name = $element.data("inventory");

            } else if (type === hp.types.Adapter) {

                intialize.call(this);

                return;
            }

            var email = $element.data("email"),
                bcc = $element.data("bcc"),
                clientId = $element.data("client"),
                showMemoField = typeof $element.data("memo") === "undefined" ? false : true,
                ga = $element.data("ga"),
                orderId = $element.data("order"),
                subject = $element.data("subject");

            var setup = new hp.Setup(type, new hp.models.Options(clientId, email, bcc, showMemoField, ga, orderId, name, subject));

            $element.find("[data-item]").each(function() {
                var item = new hp.models.Item($(this).data("item"), $(this).data("price"));
                setup.addItem(item);
            });

            $element.empty();

            setup.createForm(this.element, hp.Utils.defaults.baseUrl).then(function(iframe) {
                $element
                    .width(iframe.width)
                    .height(iframe.height)
                    .css("margin", "0 auto");
            });

        }
    });

    $.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
        return this;
    };

})(jQuery, window, document);
