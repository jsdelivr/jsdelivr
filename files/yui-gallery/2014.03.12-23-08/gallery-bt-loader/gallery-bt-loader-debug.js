YUI.add('gallery-bt-loader', function (Y, NAME) {

/**
 * Provide Loader class to handle user interaction and ajax loading
 *
 * @module gallery-bt-loader
 * @static
 */

var PREFIX = 'blo_',

    CLASSES = {
        ERROR: PREFIX + 'error',
        LOADING: PREFIX + 'loading',
        LOADED: PREFIX + 'loaded'
    },

    ACTIONS = {
        append: function (C, O, D) {
            O.addClass(CLASSES.LOADED);
            C.append(D);
        },
        insert: function (C, O, D) {
            O.addClass(CLASSES.LOADED);
            C.insert(D, 0);
        },
        refresh: function (C, O, D) {
            O.addClass(CLASSES.LOADED);
            C.insert(D, 'replace');
        },
        replace: function (C, O, D) {
            O.addClass(CLASSES.LOADED).replace(D);
        }
    },

    PARSERS = {
        json: function (D) {
            try {
                return Y.JSON.parse(D);
            } catch (e) {
                return null;
            }
        },
        none: function (D) {
            return D;
        }
    },

    SELECTORS = {
        json: function (D, S) {
            var ss = S.split(/\./),
                I;

            for (I=0;I<ss.length;I++) {
                D = D[ss[I]];
                if (D === undefined) {
                    return;
                }
            }
            return D;
        },
        none: function (D, S) {
            return (S === '*') ? D : Y.Selector.query(S, Y.DOM.create(D), true);
        }
    },

    validateAction = function (V) {
        return ACTIONS[V] ? true : false;
    },

/**
 * Loader is a Widget which can help you to handle user interaction and ajax loading
 *
 * @class Loader
 * @constructor
 * @namespace Bottle
 * @extends Widget
 * @uses Bottle.SyncScroll
 * @param [config] {Object} Object literal with initial attribute values

 */
Loader = Y.Base.create('btloader', Y.Widget, [Y.Bottle.SyncScroll], {
    initializer: function () {
        var cb = this.get('contentBox');

        /**
         * internal eventhandlers, keep for destructor
         *
         * @property _bloEventHandlers
         * @type EventHandle
         * @private
         */
        this._bloEventHandlers = new Y.EventHandle([
            cb.delegate('click', this._handleClick, this.get('actionNode'), this)
        ]);
    },

    destructor: function () {
        this._bloEventHandlers.detach();
        delete this._bloEventHandlers;
    },

    bindUI: function () {
    },

    /**
     * handle click action
     *
     * @method _handleClick
     * @protected
     */
    _handleClick: function (E) {
        var O = E.currentTarget;

        O.removeClass(CLASSES.ERROR).addClass(CLASSES.LOADING);
        E.preventDefault();

        Y.io(O.getAttribute(this.get('actionAttr')), {
            on: {
                success: this._handleIOSuccess,
                failure: this._handleIOFailure
            },
            context: this,
            'arguments': {
                target: O
            }
        });
    },

    /**
     * handle ajax success response
     *
     * @method _handleIOSuccess
     * @protected
     */
    _handleIOSuccess: function (id, R, cfg) {
        var parser = this.get('parser'),
            data = parser(R.responseText),
            O = cfg.target,
            oa = O.getData('action'),
            action = validateAction(oa) ? oa : this.get('action');

        O.removeClass(CLASSES.LOADING);

        if (!data) {
            return this._handleIOFailure(id, R, cfg);
        }

        /**
         * Static property, a callback function executed when a loader success
           loaded new data. arguments are: Loader, dara, clickedNode.
         *
         * @property SUCCESSCB
         * @type Function
         * @static
         */
        if (Y.Bottle.Loader.SUCCESSCB) {
            Y.Bottle.Loader.SUCCESSCB(this, data, O);
        }

        if (this._selector) {
            data = this._selector(data, this.get('selector'));
        }

        ACTIONS[action](this.get('contentBox'), O, data);
        this.syncScroll();
    },

    /**
     * handle ajax failed response
     *
     * @method _handleIOFailure
     * @protected
     */
    _handleIOFailure: function (id, R, cfg) {
        var O = cfg.target;

        O.removeClass(CLASSES.LOADING).addClass(CLASSES.ERROR);

        /**
         * Static property, a callback function executed when a loader failed
           loading new data. arguments are: Loader, response, clickedNode.
         *
         * @property FAILURECB
         * @type Function
         * @static
         */
        if (Y.Bottle.Loader.FAILURECB) {
            Y.Bottle.Loader.FAILURECB(this, R, cfg);
        }
    }
}, {
    /**
     * Static property used to define the default attribute configuration.
     *
     * @property ATTRS
     * @type Object
     * @static
     * @protected
     */
    ATTRS: {
        /**
         * Defines which nodes will be monitered. When these node be clicked, do loading task.
         *
         * @attribute actionNode
         * @type String
         * @default 'a'
         */
        actionNode: {
            writeOnce: true,
            validator: Y.Lang.isString
        },

        /**
         * Defines which attribute will be used to load new data when the node is clicked.
         *
         * @attribute actionAttr
         * @type String
         * @default 'href'
         */
        actionAttr: {
            validator: Y.Lang.isString
        },

        /**
         * Default action when data loaded, should be one of 'append', 'insert', 'refresh', 'replace'.
         *
         * @attribute action
         * @type String
         * @default 'append'
         */
        action: {
            validator: validateAction
        },

        /**
         * Default parser for ajax data, should be one of 'json', 'none', or a Function.
           If data can not be parsed, the ajax will be a 'failed' case.
         *
         * @attribute parser
         * @type String|Function
         * @default 'none'
         */
        parser: {
            validator: function (V) {
                return Y.Lang.isFunction(V) || (PARSERS[V] ? true : false);
            },
            setter: function (V) {
                if (PARSERS[V]) {
                    this._selector = SELECTORS[V];
                }
                return PARSERS[V] || V;
            }
        },

        /**
         * Default selector string for responsed data. For HTML data, this value should be
           css selector; For json data, this value should be something like data.hash.value
           (will return JSONData.data.hash.value). When set to '*', all ajax response will
           be selected. If can not select anything, the ajax will be a 'failed' case.
         *
         * @attribute selector
         * @type String
         * @default '*'
         */
        selector: {
            validator: Y.Lang.isString
        }
    },

    /**
     * Static property used to define the default HTML parsing rules
     *
     * @property HTML_PARSER
     * @static
     * @protected
     * @type Object
     */
    HTML_PARSER: {
        actionNode: function (srcNode) {
            return srcNode.getData('action-node') || 'a';
        },
        actionAttr: function (srcNode) {
            return srcNode.getData('action-attr') || 'href';
        },
        action: function (srcNode) {
            return srcNode.getData('action') || 'append';
        },
        parser: function (srcNode) {
            return srcNode.getData('parser') || 'none';
        },
        selector: function (srcNode) {
            return srcNode.getData('selector') || '*';
        }
    }
});

Y.namespace('Bottle').Loader = Loader;


}, 'gallery-2013.04.10-22-48', {"requires": ["gallery-bt-syncscroll", "io-base", "json-parse"]});
