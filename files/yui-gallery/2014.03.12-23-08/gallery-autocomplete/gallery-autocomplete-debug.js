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



}, 'gallery-2010.01.27-20' ,{requires:['node', 'plugin', 'gallery-value-change', 'event-key'], optional:['event-custom']});
YUI.add('gallery-ac-widget', function(Y) {




/**
 * The default display widget for the AutoComplete component.
 * This is what is expected when you say "autocomplete".
 * @class ACWidget
 * @inherits Widget
 **/

function ACWidget () { ACWidget.superclass.constructor.apply(this, arguments) };

// shorthands
// TODO: Uppercase all of these.
var BOUND = "_bound",
    selectedIndex = "selectedIndex",
    _selectedIndex = "_selectedIndex",
    _originalValue = "_originalValue",
    YArrayeach = Y.Array.each,
    queryValue = "queryValue";


Y.ACWidget = Y.extend(
    ACWidget,
    Y.Widget,
    { // prototype
        initializer : function () {
            var self = this;
            self.after({
                queryChanged : self.syncUI,
                dataChanged : self.syncUI
            });
            self.hide();
        },
        /**
         * Method to display the widget.  Just inserts the widget after
         * the ACPlugin's host object and sets the size appropriately.
         *
         * @for ACWidget
         * @public
         **/
        renderUI : function () {
            var ac = this.get("ac");
            if (!ac) {
                Y.log("Attach before attempting to render the widget", "error", "ac-widget");
                return;
            }
            ac.get("host").insert(this.get("boundingBox"), "after");
            this.setSize();
            return;
        },
        /**
         * Get the size of the ACPlugin's host object, and then set the widget's width
         * to the same size.  Defined thusly so that it's easy to override.
         *
         * @public
         * @for ACWidget
         **/
        setSize : function () {            
            return this.set("width", this.get("ac").get("host").getComputedStyle("width"));
        },
        /**
         * Bind the necessary event handles, unbinding if there were any other handles
         * in place already.
         *
         * @param ac {Object} Optionally set the ACPlugin object at the same time,
         * that it can be easily re-bound in the ac setter.
         **/
        bindUI : function (ac) {
            var widget = this,
                cb = widget.get("contentBox"), //INHERITED
                currentAC = widget.get("ac"),
                category = Y.stamp(widget)+"|";
            
            if (ac && currentAC !== ac && widget[BOUND]) {
                // supplied something, it's new, and we're bound to something else.
                Y.detach(category);
                widget[BOUND] = 0; // small and falsey
            }
            ac = ac || currentAC;
            
            // if we have an ac, and we're not bound right now, then bind.
            if (ac && !widget[BOUND]) {
                widget[BOUND] = 1;
                cb.delegate(category+"click", widget.click, "li", widget);
                Y.on(category+"click", widget.hide, document); //INHERITED
                ac.on(category+"ac:load", function (e) {
                    widget
                        .setAttrs({
                            query : e.query,
                            data : e.results
                        })
                        .syncUI()
                        .show();
                });
                // TODO: ac: should be superfluous
                // if it's not, then file a bug, because that would mean it broken
                ac.on(category+"ac:query", function (e) {
                    widget.set("query", e.value).syncUI();
                });
                ac.on(category+"ac:next", widget.next, widget);
                ac.on(category+"ac:previous", widget.previous, widget);
                ac.on(category+"ac:hide", widget.hide, widget); //INHERITED
            };
            return widget;
        },
        /**
         * If there is data, then set the markup.
         * Otherwise, do nothing.
         **/
        syncUI : function () {
            var self = this,
                data = self.get("data"),
                query = self.get("query");
            if (!data) return self;
            self[_selectedIndex] = -1;
            self[_originalValue] = "";
            self.get("contentBox").set("content", self.getListMarkup(data)); //INHERITED
            return self;
        },
        /**
         * Given a set of data, return the markup that should go in the widget.
         * @param {Array} The data object, some array-ish thing.
         * @return {String} The markup that goes in the widget.
         **/
        getListMarkup : function (data) {
            var self = this,
                listTemplate = self.get("listTpl"),
                markup = [];
            YArrayeach(data, function (item) {
                markup.push(self.getItemMarkup(item));
            });
            return listTemplate.replace(/\{list\}/g, markup.join(""));
        },
        /**
         * Given a single item, return the markup for that item.
         * @param {String} the data item
         * @return {String} The markup, generated based on the itemTpl
         **/
        getItemMarkup : function (item) {
            return this.get("itemTpl")
                .replace(/\{term\}/g, item)
                .replace(/\{hilite\}/g, this.getHiliteMarkup(item))
                // .replace(/<([^<>]*)<[^>]*>([^<>]*)>/g, '<$1$2>');
        },
        /**
         * Given a single item, return the markup with the query terms hilighted.
         * @param {String} The data item
         * @return {String} The string with the query terms hilighted, according to the
         * hiliteTpl attr.
         **/
        getHiliteMarkup : function (item) {
            var self = this,
                queryTerms = regexpEscape(self.get("query")).split(/\s+/)
                out = item;
            //TODO: use Y.cache on this fn so that the regexp is only created
            // once per term/queryTerms
            var findRegexp = new RegExp("("+queryTerms.join("|")+")", "g"),
                replRegexp = self.get("hiliteTpl")
                    .replace(/\$/g, '\\$')
                    .replace(/\{term\}/g, '$1');
            
            return out.replace(findRegexp, replRegexp);
            
            // YArrayeach(queryTerms, function (term) {
            //     if (!term) return;
            //     term = regexpEscape(term);
            //     out = out.replace(
            //         new RegExp(term, "g"),
            //         self.get("hiliteTpl").replace(/\{term\}/g, term)
            //     );
            // });
            // return out;
        },
        /**
         * The handler for the ACPlugin's ac:next event.
         **/
        next : function () {
            var self = this;
            
            return (
                self.get("visible") ? self.selectNext()
                : self.get("data") ? self.show()
                : self
            );
        },
        /**
         * Select the next item in the list.  Called by next() when the widget is visible.
         */
        selectNext : function () {
            return this.set(selectedIndex, this.get(selectedIndex) + 1);
        },
        /**
         * Select the previous item in the list. Called by previous() when the widget is visible.
         **/
        selectPrevious : function () {
            return this.set(selectedIndex, this.get(selectedIndex) - 1);
        },
        /**
         * Select the previous item in the list if the widget is visible.
         **/
        previous : function () {
            return this.get("visible") ? this.selectPrevious() : this;
        },
        /**
         * Get the nth item in the list using the itemSelector attr.
         * Note that, for compatibility with NodeList.item(), this is zero-indexed.
         * However, the CSS nth-item selector is one-indexed, so we add 1 to the arg.
         * @param n {Number} The item to retrieve (zero-indexed)
         **/
        item : function (n) {
            return this.get("contentBox")
                .one(this.get("itemSelector").replace(/\{n\}/g, regexpEscape(n + 1)));
        },
        /**
         * The click handler, set the ACPlugin queryValue to the text of the clicked element,
         * and then hides the widget.
         *
         * @param e {Object} The event object, or anything with a currentTarget.get("text")
         **/
        click : function (e) {
            var self = this,
                ac = self.get("ac"),
                val = e.currentTarget.get("text");
            ac.set(queryValue, val);
            self[_selectedIndex] = -1;
            self._currentValue = val;
            ac.get("host").focus();
            self.hide();
        }
    },
    { // statics
        NAME : "ACWidget",
        ATTRS : {
            /**
             * The ACPlugin object to hook into.
             **/
            ac : {
                setter : function (ac) {
                    if (!this[BOUND]) return; // it'll get bound when it renders
                    this.bindUI(ac);
                },
                validator : function (ac) {
                    // TODO: Add some testing here.
                    return true
                }
            },
            /**
             * The data provided by an ac:load event
             **/
            data : {
                validator : function (d) { return d && d.length > 0 }
            },
            /**
             * The query provided along with the data set in an ac:load event.
             * This is used to hilite the items in the list.
             **/
            query : { value : "" },
            /**
             * The markup template for the list of items.
             **/
            listTpl : { value : "<ul>{list}</ul>" },
            /**
             * The item template for each item in the list
             **/
            itemTpl : { value : "<li>{hilite}</li>" },
            /**
             * The CSS selector used to find items in the list.
             * Note that {n} in this case is one-indexed, not zero-indexed.
             **/
            itemSelector : { value : "ul li:nth-child({n})" },
            /**
             * The template used to hilite terms
             **/
            hiliteTpl : { value : "<em>{term}</em>" }
        } // ATTRS
    } // statics
);
/**
 * The item that is selected, for example when the user presses the down arrow to cycle
 * through the available results.
 * 
 * Changing this value causes the ACPlugin to set its queryValue to the new setting.
 * Setting it to -1 makes it go back to what the user had entered.
 * Setting it to less than -1 or greater than the number of items will cause it to wrap around.
 *
 * @attr selectedIndex
 * @for ACWidget
 **/
// don't define this one inline, so that we can compress the key
// 
ACWidget.ATTRS[selectedIndex] = {
    value : -1,
    // validator should be the name to of an instance method
    validator : function (si) {
        var d = this.get("data");
        return d && Y.Lang.isNumber(si);
    },
    getter : function () { return this[_selectedIndex] },
    setter : function (si) {
        var self = this,
            current = self.get(selectedIndex),
            d = self.get("data"),
            l = d && d.length,
            ac = self.get("ac"),
            selClass = this.getClassName("selected"); //INHERITED
        if (isNaN(current)) current = -1;
        if (!d || !l) return;
        
        // first normalize them both to a number between
        // (-1)..(d.length - 1) where -1 means "what the user typed"
        // this should probably be a function, rather than copy pasta.
        // but for this small a snippet of code, it's fewer bytes to just
        // copy, especially when gzip gets at it.
        while (si < -1) si += l + 1;
        si = (si + 1) % (l + 1) - 1;
        current = (current + 1) % (l + 1) - 1;
                            
        // actually set it, the rest is just monkey business.
        self[_selectedIndex] = si;
        
        // hang onto this, we'll need it later.
        if (current === -1) {
            self[_originalValue] = ac.get(queryValue);
        }
        
        // nothing changing!
        if (current === si) return;
        
        // undo the current one, but only if it's not -1
        var curItem = self.get("contentBox").one("."+selClass);
        if (curItem) curItem.removeClass(selClass);
        
        // handle the new thing
        if (si === -1) {
            // back to the start
            ac.set(queryValue, this[_originalValue]);
        } else {
            var newItem = self.item(si);
            if (newItem) newItem.addClass(selClass);
            ac.set(queryValue, d[si]);
        }
        return si;
    }
}; // selectedIndex

/**
 * Escape the characters that regexes care about.
 * @private
 **/
//TODO: Feature request (with code) to put this in Lang.
function regexpEscape (text) {
    return (""+text).replace(/([\^\/.*+?|()[\]{}\\])/g, '\\$1');
}


}, 'gallery-2010.01.27-20' ,{requires:['widget','gallery-ac-plugin']});


YUI.add('gallery-autocomplete', function(Y){}, 'gallery-2010.01.27-20' ,{use:['gallery-ac-plugin']});

