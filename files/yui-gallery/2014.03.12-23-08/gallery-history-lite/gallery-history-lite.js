YUI.add('gallery-history-lite', function(Y) {

/**
 * The History Lite utility is similar in purpose to the YUI Browser History
 * utility, but with a more flexible API, no initialization or markup
 * requirements, limited IE6/7 support, and a much smaller footprint.
 *
 * @module gallery-history-lite
 */

/**
 * @class HistoryLite
 * @static
 */

var w       = Y.config.win,
    docMode = Y.config.doc.documentMode,
    encode  = encodeURIComponent,
    loc     = w.location,

    // IE8 supports the hashchange event, but only in IE8 Standards
    // Mode. However, IE8 in IE7 compatibility mode still defines the
    // event (but never fires it), so we can't just sniff for the event. We
    // also can't just sniff for IE8, since other browsers will eventually
    // support this event as well. Thanks Microsoft!
    supportsHashChange = w.onhashchange !== undefined &&
            (docMode === undefined || docMode > 7),

    lastHash,
    pollInterval,
    HistoryLite,

    /**
     * Fired when the history state changes.
     *
     * @event history-lite:change
     * @param {EventFacade} Event facade with the following additional
     *     properties:
     * <dl>
     *   <dt>changed</dt>
     *   <dd>
     *     name:value pairs of history parameters that have been added or
     *     changed
     *   </dd>
     *   <dt>removed</dt>
     *   <dd>
     *     name:value pairs of history parameters that have been removed
     *     (values are the old values)
     *   </dd>
     * </dl>
     */
    EV_HISTORY_CHANGE = 'history-lite:change';

// -- Private Methods ------------------------------------------------------

/**
 * Creates a hash string from the specified object of name/value parameter
 * pairs.
 *
 * @method createHash
 * @param {Object} params name/value parameter pairs
 * @return {String} hash string
 * @private
 */
function createHash(params) {
    var hash = [];

    Y.each(params, function (value, name) {
        if (Y.Lang.isValue(value)) {
            hash.push(encode(name) + '=' + encode(value));
        }
    });

    return '#' + hash.join('&');
}

/**
 * Wrapper around <code>decodeURIComponent()</code> that also converts +
 * chars into spaces.
 *
 * @method decode
 * @param {String} string string to decode
 * @return {String} decoded string
 * @private
 */
function decode(string) {
    return decodeURIComponent(string.replace(/\+/g, ' '));
}

/**
 * Gets the current URL hash.
 *
 * @method getHash
 * @return {String}
 * @private
 */
var getHash;

if (Y.UA.gecko) {
    // We branch at runtime for Gecko since window.location.hash in Gecko
    // returns a decoded string, and we want all encoding untouched.
    getHash = function () {
        var matches = /#.*$/.exec(loc.href);
        return matches && matches[0] ? matches[0] : '';
    };
} else {
    getHash = function () {
        return loc.hash;
    };
}

/**
 * Sets the browser's location hash to the specified string.
 *
 * @method setHash
 * @param {String} hash
 * @private
 */
function setHash(hash) {
    loc.hash = hash;
}

// -- Private Event Handlers -----------------------------------------------

/**
 * Handles changes to the location hash and fires the history-lite:change
 * event if necessary.
 *
 * @method handleHashChange
 * @param {String} newHash new hash value
 * @private
 */
function handleHashChange(newHash) {
    var lastParsed    = HistoryLite.parseQuery(lastHash),
        newParsed     = HistoryLite.parseQuery(newHash),
        changedParams = {},
        removedParams = {},
        isChanged;

    // Figure out what changed.
    Y.each(newParsed, function (value, name) {
        if (value !== lastParsed[name]) {
            changedParams[name] = value;
            isChanged = true;
        }
    });

    // Figure out what was removed.
    Y.each(lastParsed, function (value, name) {
        if (!newParsed.hasOwnProperty(name)) {
            removedParams[name] = value;
            isChanged = true;
        }
    });

    if (isChanged) {
        HistoryLite.fire(EV_HISTORY_CHANGE, {
            changed: changedParams,
            newVal : newHash,
            prevVal: lastHash,
            removed: removedParams
        });
    }
}

/**
 * Default handler for the history-lite:change event. Stores the new hash
 * for later comparison and event triggering.
 *
 * @method defaultChangeHandler
 * @param {EventFacade} e
 * @private
 */
function defaultChangeHandler(e) {
    lastHash = e.newVal;
}

Y.HistoryLite = HistoryLite = {
    // -- Public Methods ---------------------------------------------------

    /**
     * Adds a history entry with changes to the specified parameters. Any
     * parameters with a <code>null</code> or <code>undefined</code> value
     * will be removed from the new history entry.
     *
     * @method add
     * @param {String|Object} params query string, hash string, or object
     *     containing name/value parameter pairs
     * @param {Boolean} silent if <em>true</em>, a history change event will
     *     not be fired for this change
     */
    add: function (params, silent) {
        var newHash = createHash(Y.merge(HistoryLite.parseQuery(getHash()),
                Y.Lang.isString(params) ? HistoryLite.parseQuery(params) : params));

        if (silent) {
            defaultChangeHandler({newVal: newHash});
        }

        setHash(newHash);
    },

    /**
     * Gets the current value of the specified history parameter, or an
     * object of name/value pairs for all current values if no parameter
     * name is specified.
     *
     * @method get
     * @param {String} name (optional) parameter name
     * @return {Object|mixed}
     */
    get: function (name) {
        var params = HistoryLite.parseQuery(getHash());
        return name ? params[name] : params;
    },

    /**
     * Parses a query string or hash string into an object of name/value
     * parameter pairs.
     *
     * @method parseQuery
     * @param {String} query query string or hash string
     * @return {Object}
     */
    parseQuery: function (query) {
        var matches = query.match(/([^\?#&]+)=([^&]+)/g) || [],
            params  = {},
            i, len, param;

        for (i = 0, len = matches.length; i < len; ++i) {
            param = matches[i].split('=');
            params[decode(param[0])] = decode(param[1]);
        }

        return params;
    }
};

// Make HistoryLite an event target and publish the change event.
Y.augment(HistoryLite, Y.EventTarget, true, null, {emitFacade: true});

HistoryLite.publish(EV_HISTORY_CHANGE, {
    broadcast: 2,
    defaultFn: defaultChangeHandler
});

// Start watching for hash changes.
lastHash = getHash();

if (supportsHashChange) {
    Y.Node.DOM_EVENTS.hashchange = true;

    Y.on('hashchange', function () {
        handleHashChange(getHash());
    }, w);
} else {
    pollInterval = pollInterval || Y.later(50, HistoryLite, function () {
        var hash = getHash();

        if (hash !== lastHash) {
            handleHashChange(hash);
        }
    }, null, true);
}


}, 'gallery-2009.12.15-22' ,{requires:['event-custom','event-custom-complex','node']});
