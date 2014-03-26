YUI.add('gallery-ratings', function(Y) {

var Lang = Y.Lang;

Y.Ratings = Y.Base.create('gallery-ratings', Y.Widget, [], {
    //HTML Template for the current rating
    CURRENT_RATING_TEMPLATE: '<li class="yui3-gallery-ratings-current" style="width:{width};">{value}</li>',
    //HTML Template for the a rating item
    ITEM_TEMPLATE: '<a href="#" title="{title}" class="{className}">{value}</a>',
    //HTML Template for the Bounding Box/Rating Content
    BOUNDING_TEMPLATE: '<div><div><ul class="yui3-gallery-ratings-star-list"></ul></div></div>',
    
    initializer: function () {
        this.after("ratingChange", this.afterRatingChange, this);
        this.after("allowClearRatingChange", this.renderList, this);
        this.after("skinChange", this.renderList, this);
        this.after("iconWidthChange", this.renderList, this);
        this.after("maxChange", this.renderList, this);
        this.after("titlesChange", this.renderList, this);
        this.after("inlineChange", this.renderList, this);
    },
    /**
    * Validates the rating is within the expected bounds 
    * @method validateRating
    * @param {number} val The rating value
    * @protected
    * @returns {boolean} true If val is a number and within bounds
    */
    validateRating: function (val) {
        return Lang.isNumber(val) && val <= this.get('max') && val >= this.get('min');
    },
    /**
    * Validates the skin is expected value
    * @method validateSkin
    * @param {number} val The skin name
    * @protected
    * @returns {boolean} true If val is a valid skin name
    */
    validateSkin : function (attrVal) {
        return Lang.isString(attrVal) && (attrVal === "default" ||  attrVal === "small");
    },
    /**
    * Calculates the width for the current rating value
    * @method getRatingWidth
    * @private
    * @returns {string} width percentage
    */
    getRatingWidth: function () {
        return Math.floor(this.get("rating") / this.get("max") * 100) + "%";
    },
    /**
    * Creates a string signifying the current rating
    * @method getRatingString
    * @protected
    * @returns {string} Current rating value out of (max) stars
    */
    getRatingString: function () {
        return "Currently " + this.get("rating") + "/" + this.get("max") + " Stars.";
    },
    /**
    * Sets up the UI for the widget
    * @method renderList
    * @protected
    */
    renderList: function () {
        var bb = this.get("boundingBox"), cb = bb.one('div'),
            ul = bb.one('ul'), i = 1, max = this.get('max'),
            titles = this.get('titles'), item, a;
        if (this.get('skin') === "small") {
            cb.addClass('yui3-gallery-ratings-small-star');
            this.set('iconWidth', 10);
        } else {
            cb.removeClass('yui3-gallery-ratings-small-star');
            this.set('iconWidth', 25);
        }
        if (this.get('inline')) {
            cb.addClass('yui3-gallery-ratings-inline');
        } else {
            cb.removeClass('yui3-gallery-ratings-inline');
        }
        ul.setStyle('width', this.get('iconWidth') * this.get('max') + "px");
        ul.empty();
        if (this.get('allowClearRating') && !cb.one('.clearRating')) {
            ul.insert(Y.Node.create(Lang.sub(this.ITEM_TEMPLATE, {
                title: "Clear Rating",
                className: 'clearRating',
                value: 0
            })),'before');
        } else if (cb.one('.clearRating')) {
            cb.one('.clearRating').destroy();
        }
        ul.append(Y.Node.create(Lang.sub(this.CURRENT_RATING_TEMPLATE, {
            width: this.getRatingWidth(),
            value: this.getRatingString()
        })));
        for (i;i <= max; i += 1) {
            item = 
            Y.Node.create(Lang.sub('<li>' + this.ITEM_TEMPLATE + '</li>', {
                title: titles[i - 1] || i + " of " + max + ' stars',
                className: 'yui3-gallery-ratings-star',
                value: i
            }));
            a = item.one('a');
            a.setStyle('width', i * this.get('iconWidth') + "px");
            a.setStyle('zIndex', this.get('max') - (i - 1));
            ul.append(item);
        }
    },
    /**
    * Stuff to do after the rating has changed
    * @method afterRatingChange
    * @param {Event} e The ratingChange event
    * @protected
    */
    afterRatingChange: function (e) {
        this.uiSetRating(e.newVal);
    },
    /**
    * Stuff to do after the rating has been clicked
    * @method onRatingClick
    * @param {Event} e The click event
    * @protected
    */
    /**
     * Fires when a rating anchor is clicked
     * @event ratingClick
     * @param {number} val The value of the rating
     */
    onRatingClick: function (e) {
        e.preventDefault();
        var val = parseFloat(e.currentTarget.get("innerHTML"));
        this.fire('ratingClick', val);
        this.set("rating", val);
    },
    /**
    * Set the current rating display, update the value in srcNode
    * @method uiSetRating
    * @param {number} val The rating value
    * @protected
    */
    uiSetRating: function (val) {
        var n = this.get("boundingBox").one(".yui3-gallery-ratings-current"),
            srcNode = this.get('srcNode');
        if (n) {
            n.setStyle("width", this.getRatingWidth());
            n.set("innerHTML", this.getRatingString());
        }
        if (srcNode.get('tagName') === 'INPUT') {
            srcNode.set('value', val);
        } else {
            srcNode.set('innerHTML', val);
        }
    },
    /**
    * The render process
    * @method renderUI
    * @private
    */
    renderUI: function () {
        this.renderList();
    },
    /**
    * The bind process
    * @method bindUI
    * @private
    */
    bindUI: function () {
        this.get('boundingBox').delegate("click", this.onRatingClick, 'a', this);
    },
    /**
    * The sync process
    * @method syncUI
    * @private
    */
    syncUI: function () {
        this.uiSetRating(this.get("rating"));
    }
    
}, {
    ATTRS: {
        /**
         * The current rating
         * @attribute rating
         * @type number
         * @default 0
         */
        rating : {
            value: 0,
            broadcast: 1,
            validator: "validateRating"
        },
        /**
         * The minimum value
         * @attribute min
         * @type number
         * @default 0
         * @private
         */
        min: {
            value: 0,
            validator: Lang.isNumber,
            readOnly: true
        },
        /**
         * The total number of "stars"
         * @attribute max
         * @type number
         * @default 5
         */
        max: {
            value: 5,
            validator: Lang.isNumber
        },
        /**
         * Display the widget as an inline widget?
         * @attribute inline
         * @type boolean
         * @default false
         */
        inline: {
            value: false,
            validator: Lang.isBoolean
        },
        /**
         * The skin for the widget ("default" | "small")
         * @attribute skin
         * @type string
         * @default "default"
         */
        skin: {
            value: "default",
            validator: "validateSkin"
        },
        /**
         * Should the clear rating button be shown? (Allows setting rating to 0)
         * @attribute allowClearRating
         * @type boolean
         * @default false
         */
        allowClearRating: {
            value: false,
            validator: Lang.isBoolean
        },
        /**
         * Render widget on instantiation
         * @attribute render
         * @type boolean
         * @default true
         */
        render: {
            value: true
        },
        /**
         * Titles to apply to rating tooltips
         * @attribute titles
         * @type Array
         * @default []
         */
        titles: {
            value: [],
            validator: Lang.isArray
        },
        /**
         * The width of rating icons, used in calculation of the rating widget width
         * @attribute iconWidth
         * @type number
         * @default 25
         * @protected
         */
        iconWidth: {
            value: 25,
            validator: Lang.isNumber
        }
    },
    HTML_PARSER: {
        rating: function (srcNode) {
            // If progressive enhancement is to be supported, return the value of "rating" based on the contents of the srcNode
            var val;
            if (srcNode.get('tagName') === "INPUT") {
                val = parseFloat(srcNode.get('value'), 10);
            } else {
                val = parseFloat(srcNode.get('innerHTML'), 10);
            }
            return Lang.isNumber(val) ? val : 0;
        }
    }
});


}, 'gallery-2011.10.20-23-28' ,{requires:['base','widget'], skinnable:true});
