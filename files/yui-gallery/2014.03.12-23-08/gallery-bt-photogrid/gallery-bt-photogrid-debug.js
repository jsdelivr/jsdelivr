YUI.add('gallery-bt-photogrid', function (Y, NAME) {

/**
 * Provide PhotoGrid class to rendering a lot of photo in many kinds of layout
 *
 * @module gallery-bt-photogrid
 * @static
 */

var COLUMN_CHANGE = 'columnWidthChange',
    RENDER_FINISHED = 'renderFinished',

    RENDER_INTERVAL = 100,

    PREFIX = 'bpg_',

    CLASSES = {
        COLUMN: PREFIX + 'column',
        MODULE: PREFIX + 'module',
        RENDER: PREFIX + 'render',
        ERROR: PREFIX + 'error'
    },

    HTMLS = {
        COLUMN: '<div class="' + CLASSES.COLUMN + '"></div>'
    },

    GRID_CFGS = {
        vertical: 1,
        horizontal: 1
    },

/**
 * PhotoGrid is a Widget which can help you to render a lot of photo in different patterns.
 *
 * @class PhotoGrid
 * @constructor
 * @namespace Bottle
 * @extends Widget
 * @uses Bottle.SyncScroll
 * @param [config] {Object} Object literal with initial attribute values

 */
PhotoGrid = Y.Base.create('btphotogrid', Y.Widget, [Y.Bottle.SyncScroll], {
    initializer: function () {
        this.parseImageData();

        this.set('syncScrollMethod', this._updateColumns);

        /**
         * Fired when all grid rendered
         *
         * @event renderFinished
         */
        this.publish(RENDER_FINISHED);

        /**
         * internal eventhandlers, keep for destructor
         *
         * @property _bpgEventHandlers
         * @type EventHandle
         * @private
         */
        this._bpgEventHandlers = this.after(COLUMN_CHANGE, this._updateColumns);
    },

    destructor: function () {
        this._bpgEventHandlers.detach();
        delete this._bpgEventHandlers;
    },

    renderUI: function () {
        this._updateColumns(true);
    },

    /**
     * append new html into photogrid. the html will be parsed into photogrid then render
     *
     * @method append
     * @param html {String} new html string
     */
    append: function (html) {
        var N = Y.Node.create(html);

        this.parseImageData((N.getDOMNode().nodeType === 11) ? Y.Node.create('<div>' + html + '</div>') : N, true);
        this.renderImages(true);
    },

    /**
     * parse image data from a node
     *
     * @method parseImageData
     * @param [node] {Node} node to parse data. If omitted, Widget ContentBox will be used.
     * @param [append=false] {Boolean} <b>true</b> to append data. <b>false</b> or ommited to clean old image data.
     */
    parseImageData: function (node, append) {
        var images = append ? this._bpgImages : [],
            that = this,
            css = this.get('photoNode'),
            hid = Y.one('.btHidden') || Y.one('body').appendChild(Y.Node.create('<div class="btHidden"></div>')),
            P = node || this.get('contentBox');

        if (!append) {
            /**
             * internal unloaded image count
             *
             * @property _bpgPending
             * @type Number
             * @protected
             */
            this._bpgPending = 0;
        }

        P.all(this.get('moduleNode')).each(function (O) {
            var image = {
                icon: O.getData('icon'),
                img: O.getData('img'),
                width: O.getData('width'),
                height: O.getData('height'),
                module: O.addClass(CLASSES.MODULE),
                error: false
            },
            P = O.one(css);

            if (!image.icon) {
                return;
            }

            image.load = Y.Node.create('<img src="' + image.icon + '" />');

            if (P) {
                P.append(image.load);
            } else {
                O.insert(image.load, 0);
            }

            if (!image.height || !image.width) {
                this._bpgPending += 1;

                image.load.once('load', function (E) {
                    var O = E.target;

                    if (Y.UA.ie) {
                        image.loadie = new Image();
                        image.loadie.src = image.icon;
                        this.height = this.loadie.height;
                        this.width = this.loadie.width;
                    } else {
                        this.height = O.get('height');
                        this.width = O.get('width');
                    }

                    that._bpgPending -= 1;
                }, image);

                image.load.once('error', function () {
                    this.error = true;
                    that._bpgPending -= 1;
                }, image);
            }

            // Append to document to start image load, only required by IE9+
            hid.append(O);
            images.push(image);
        }, this);

        /**
         * internal image meta data
         *
         * @property _bpgImages
         * @type Array
         * @protected
         */
        this._bpgImages = images;
    },

    /**
     * Get the column with minimal height
     *
     * @method _minColumn
     * @protected
     */
    _minColumn: function () {
        var minI = Number.MAX_VALUE,
            minO;

        this.get('contentBox').all('> div').each(function (O) {
            var H = O.get('offsetHeight');

            if (H < minI) {
                minI = H;
                minO = O;
            }
        });

        return minO;
    },

    /**
     * rendering images
     *
     * @method renderImages
     * @param [start] {Node} node to parse data. If omitted, Widget ContentBox will be used.
     */
    renderImages: function (start) {
        var img,
            delay = RENDER_INTERVAL;

        if (start && this._bpgRendering) {
            return;
        }

        if (start) {
            this.get('contentBox').addClass(CLASSES.RENDER);
        }

        this._bpgRendering = true;

        if (this._bpgImages.length <= this._bpgRendered) {
            this._bpgRendering = false;
            this.get('contentBox').removeClass(CLASSES.RENDER);
            this.syncScroll();
            this.fire(RENDER_FINISHED);
            return;
        }

        img = this._bpgImages[this._bpgRendered];

        if (img.width || img.error) {
            if (img.error) {
                img.load.setAttribute('src', this.get('errorImage'));
                img.module.addClass(CLASSES.ERROR);
            }
            this._minColumn().append(img.module);
            this._bpgRendered += 1;
            delay = 1;
        }

        Y.later(delay, this, this.renderImages);
    },

    /**
     * update Widget width with parent node
     *
     * @method _updateColumns
     * @param [refresh] {Boolean} <b>true</b> to clean contencBox
     * @protected
     */
    _updateColumns: function (refresh) {
        var P = this.get('contentBox'),
            W = P.get('offsetWidth'),
            w = this.get('columnWidth'),
            N = Math.round(W / w),
            a = Math.floor(W / N),
            f = W - a * (N - 1),
            HTML = HTMLS.COLUMN,
            render = refresh || (this._bpgColumns !== N),
            I;

        if (render) {
            // clean content box
            P.all(this.get('moduleNode')).remove();
            P.set('innerHTML', '');

            /**
             * Keep current computed column number
             *
             * @property _bpgColumns
             * @protected
             */
            this._bpgColumns = N;

            for (I = 0;I < N;I++) {
                P.append(HTML);
            }
        }

        P.all('> div').each(function (O, I) {
            O.set('offsetWidth', I ? a : f);
        });

        this.syncScroll();

        if (render) {
            /**
             * internal rendered image
             *
             * @property _bpgRendered
             * @type Number
             * @protected
             */
            this._bpgRendered = 0;
            this.renderImages(true);
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
         * Default error Image.
         *
         * @attribute errorImage
         * @type String
         * @default 'about:blank'
         */
        errorImage: {
            value: 'http://l.yimg.com/f/i/tw/map/i/cpx.gif',
            validator: Y.Lang.isString
        },

        /**
         * Default column width. Column number will be decided by
           Math.round(parentWidth / columnWidth), and then all these columns will be fitted equally.
         *
         * @attribute columnWidth
         * @type Number
         * @default 200
         */
        columnWidth: {
            value: 200,
            validator: function (V) {
                return (V * 1 > 0);
            },
            setter: function (V) {
                return V * 1;
            }
        },

        /**
         * Rendering mode of PhotoGrid, should be one of: 'vertical', 'horizontal'
         *
         * @attribute gridType
         * @type String
         * @default vertical
         */
        gridType: {
            value: 'vertical',
            validator: function (V) {
                return GRID_CFGS[V] ? true : false;
            }
        },

        /**
         * Default module child nodes css selector.
         *
         * @attribute moduleNode
         * @type String
         * @default '> div'
         */
        moduleNode: {
            value: '> div',
            validator: Y.Lang.isString
        },

        /**
         * Default image child node css selector. If can not find the Node, a new image node will be inserted under the module node.
         *
         * @attribute photoNode
         * @type String
         * @default '.img'
         */
        photoNode: {
            value: '.img',
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
        errorImage: function (srcNode) {
            return srcNode.getData('error-image');
        },
        columnWidth: function (srcNode) {
            return srcNode.getData('column-width');
        },
        gridType: function (srcNode) {
            return srcNode.getData('grid-type');
        },
        moduleNode: function (srcNode) {
            return srcNode.getData('module-node');
        },
        photoNode: function (srcNode) {
            return srcNode.getData('photo-node');
        }
    }
});

Y.namespace('Bottle').PhotoGrid = PhotoGrid;


}, 'gallery-2013.04.10-22-48', {"requires": ["gallery-bt-syncscroll"]});
