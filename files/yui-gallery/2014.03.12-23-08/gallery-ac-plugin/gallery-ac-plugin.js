YUI.add('gallery-ac-plugin', function(Y) {

/**
 * ACPlugin - A plugin that exposes the proper events to make AutoComplete work
 * on a form element (input or textarea, typically).
 * 
 * This utility is not intended to be used in isolation, but rather as a glue
 * layer to work with ACWidget or some other display mechanism.
 **/
function ACPlugin () { ACPlugin.superclass.constructor.apply(this, arguments) };


// shorthands
var autocomplete = "autocomplete",
    YLang = Y.Lang,
    YArrayeach = Y.Array.each,
    eventDefaultBehavior = {
        // the default behavior of the query event is to check for a datasource,
        // and then make a request with it.
        query : function (e) {
            var self = this,
                ds = self.get("dataSource"),
                query = e.value,
                handler = Y.bind(handleQueryResponse, self);
            // if we have a datasource, then make the request.
            if (ds) ds.sendRequest({
                request : self.get("queryTemplate")(query),
                callback : {
                    success : handler,
                    failure : handler
                }
            });
        }
    };

Y.Plugin.ACPlugin = Y.extend(
    ACPlugin,
    Y.Plugin.Base,
    { // prototype
        initializer : function () {
            var self = this,
                host = self.get("host");
            attachHandles(self, host);

            // publish events:
            // "query" for when value changes.
            // "load" for when data returns.
            // "show" for when it's time to show something
            // "hide" for when it's time to hide
            var defaults = eventDefaultBehavior;
            YArrayeach([
                "query",
                "load",
                "show",
                "hide",
                "next",
                "previous"
            ], function (ev) { self.publish("ac:"+ev, {
                broadcast : 1,
                bubbles : 1,
                context : self,
                preventable : true,
                defaultFn : defaults[ev] || null,
                prefix : "ac"
            }) }, self);

            // manage the browser's autocomplete, since that'll interefere,
            // but we need to make sure that we don't prevent pre-filling 
            // when the user navs back to the page, unless the developer has
            // specifically disabled that feature in the markup.
            manageBrowserAC(host);
        },
        destructor : function () {
            Y.detach(Y.stamp(this)+"|");
        },
        open : function () { this.fire("ac:show") },
        next : function (e) { e.preventDefault(); this.fire("ac:next") },
        previous : function (e) { e.preventDefault(); this.fire("ac:previous") },
        close : function () { this.fire("ac:hide") }
    },
    { // statics
        NAME : "ACPlugin",
        NS : "ac",
        ATTRS : {
            /**
             * The value that will be queried.
             * 
             * By default, this is just a proxy to the host's value attr, which in
             * Node objects passes through to the underlying DOM node.
             * 
             * However, in some use cases, it may be useful to override the queryValue
             * getters and setters, for example, in the delimited case.
             *
             * Setting caches the value so that we only make new requests for user-entered
             * data, and not for programmatically-set values.  (For example, when a user
             * is scrolling through the items displayed in an  ACWidget.)
             * 
             * @for ACPlugin
             * @type {String}
             * @public
             **/
            queryValue : {
                // override these in AC plugin children as necessary.
                // for instance, the delimited getter could get the cursor location,
                // split on the delimiter, and then return the selected one.
                // the inline-replacing setter could set-and-select the rest of the word.
                getter : function () {
                    return this.get("host").get("value");
                },
                setter : function (q) {
                    this.get("host").set("value", q);
                    // keep track of what it has been explicitly set to, so that we don't
                    // try to make a query repeatedly when the user hasn't done anything.
                    return (this._cachedValue = q);
                }
            },

            /**
             * A data source object to be used to make queries and such.
             * It is not required that it be a DataSource object per se, but it
             * must provide a "sendRequest" function that takes the same sort of
             * argument as the DataSource classes.
             * 
             * It is not required to use this, as the implementor can listen to
             * ac:query events and handle them in any ad-hoc way desired.  However,
             * for the 99% use case, it's simpler to just provide a data source
             * and do things in the normal way.
             * 
             * @for ACPlugin
             * @type Object
             **/
            dataSource : {
                validator : function (ds) {
                    // quack.
                    return ds && YLang.isFunction(ds.sendRequest);
                }
            },

            /**
             * The minimum number of characters required before kicking off a query.
             * @for ACPlugin
             * @public
             * @type Number
             * @default 3
             **/
            minQueryLength : {
                value : 3,
                validator : YLang.isNumber
            },
            
            /**
             * Attribute used to convert a value into a request for the
             * DataSource.  Can be a string containing "{query}" somewhere,
             * or a function that takes a value and returns a string.
             *
             * @for ACPlugin
             * @type {Function|String}
             * @default encodeURIComponent
             * @public
             **/
            queryTemplate : {
                value : encodeURIComponent,
                setter : function (q) {
                    return (
                        YLang.isFunction(q) ? q
                        : function (query) {
                            // exchange {query} with the query,
                            // but turn \{query} into {query}, if for some reason that
                            // string needs to appear in the URL.
                            return q
                                .replace(
                                    /(^|[^\\])((\\{2})*)\{query\}/,
                                    '$1$2'+encodeURIComponent(query)
                                ).replace(
                                    /(^|[^\\])((\\{2})*)\\(\{query\})/,
                                    '$1$2$4'
                                );
                        }
                    );
                }
            }

        } // end attrs
    } // end statics
);

// helpers below

/**
 * Attach the required event handles to the host node.
 * 
 * @param self {Object} The ACPlugin instance
 * @param host {Object} The host object
 * @return {Array} A list of handles
 * @private
 **/
function attachHandles (self, host) {
    var category = Y.stamp(this)+"|";
    Y.on(category+"valueChange", valueChangeHandler, host, self);
    // next/open on down
    Y.on(category+"key", self.next, host, "down:40", self);
    // previous on up
    Y.on(category+"key", self.previous, host, "down:38", self);
    // close on escape
    Y.on(category+"key", self.close, host, "down:27", self);
};

/**
 * The handler that listens to valueChange events and decides whether or not
 * to kick off a new query.
 *
 * @param {Object} The event object
 * @private
 **/
function valueChangeHandler (e) {
    var value = e.value;
    if (!value) return this.close();
    if (value === this._cachedValue || value.length < this.get("minQueryLength")) return;
    this._cachedValue = value;
    this.fire( "ac:query", { value : e.value });
};


/**
 * A factory method that returns a function to re-enable the browser's builtin
 * AutoComplete, so that form values will be tracked.
 *
 * @private
 * @param domnode {HTMLElement} The dom node to re-enable on unload
 * @return {Function} A function that will re-enable the browser autocomplete
 **/
function browserACFixer (domnode) { return function () {
    if (domnode) domnode.setAttribute(autocomplete, "on");
    domnode = null;
}};

/**
 * Manage the browser's builtin AutoComplete behavior, so that form values
 * will be tracked in browsers that do that.
 * 
 * First, disable the browser's autocomplete, since that'll cause issues.
 * If the element is not set up to disable the browser's builtin autocomplete,
 * then set an unload listener to re-enable it.
 * 
 * @private
 * @param host {Object} The node to manage
 * @see {browserACFixer}
 **/
function manageBrowserAC (host) {
    // turn off the browser's autocomplete, but take note of it to turn
    // it back on later.
    var domnode = Y.Node.getDOMNode(host),
        bac = domnode.getAttribute(autocomplete);

    // turn the autocomplete back on so back button works, but only
    // if the user hasn't disabled it in the first place.
    if ((bac && bac !== "off") || bac === null || bac === undefined) {
        var bacf = browserACFixer(domnode);
        // hook onto both.  Concession to browser craziness.
        Y.on("beforeunload", bacf, window);
        Y.on("unload", bacf, window);
    }

    // turn off the browser's autocomplete feature, since that'll interfere.
    domnode.setAttribute(autocomplete, "off");
};

/**
 * Handle the responses from the DataSource utility, firing ac:load if there
 * are results.
 *
 * @private
 **/
function handleQueryResponse (e) {
    var res = (e && e.response && e.response.results) ? e.response.results : e;
    
    // if there is a result, and it's not an empty array
    if (res && !(res && ("length" in res) && res.length === 0)) this.fire("ac:load", {
        results : res,
        query : this.get("queryValue")
    });
};



}, 'gallery-2012.12.05-21-01' ,{requires:['node', 'plugin', 'gallery-value-change', 'event-key'], optional:['event-custom']});
