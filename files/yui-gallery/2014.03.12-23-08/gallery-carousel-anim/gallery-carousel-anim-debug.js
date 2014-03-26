YUI.add('gallery-carousel-anim', function(Y) {

/**
 * Create an animation plugin for the Carousel widget.
 *
 * @class CarouselAnimPlugin
 * @extends Plugin.Base
 * @param config {Object} Configuration options for the widget
 * @constructor
 */
function CarouselAnimPlugin() {
    CarouselAnimPlugin.superclass.constructor.apply(this, arguments);
}

// Some useful abbreviations
var JS = Y.Lang,
    // Carousel custom events
    /**
     * @event afterScroll
     * @description          fires after the Carousel has scrolled its view
     *                       port.  The index of the first and last visible
     *                       items in the view port are passed back.
     * @param {Event}  ev    The <code>afterScroll</code> event
     * @param {Number} first The index of the first visible item in the view
     *                       port
     * @param {Number} last  The index of the last visible item in the view
     *                       port
     * @type Event.Custom
     */
    AFTERSCROLL_EVENT = "afterScroll",

    /**
     * @event beforeScroll
     * @description          fires before the Carousel scrolls its view port.
     *                       The index of the first and last visible items
     *                       in the view port are passed back.
     * @param {Event}  ev    The <code>afterScroll</code> event
     * @param {Number} first The index of the first visible item in the view
     *                       port
     * @param {Number} last  The index of the last visible item in the view
     *                       port
     * @type Event.Custom
     */
    BEFORESCROLL_EVENT = "beforeScroll";

/**
 * The identity of the plugin.
 *
 * @property CarouselAnimPlugin.NAME
 * @type String
 * @default "carouselAnimPlugin"
 * @readOnly
 * @protected
 * @static
 */
CarouselAnimPlugin.NAME = "carouselAnimPlugin";

/**
 * The namespace for the plugin.
 *
 * @property CarouselAnimPlugin.NS
 * @type String
 * @default "anim"
 * @readOnly
 * @protected
 * @static
 */
CarouselAnimPlugin.NS = "anim";

/**
 * Static property used to define the default attribute configuration of the
 * plugin.
 *
 * @property CarouselAnimPlugin.ATTRS
 * @type Object
 * @protected
 * @static
 */
CarouselAnimPlugin.ATTRS = {
    /**
     * The configuration of the animation attributes for the Carousel. The
     * speed attribute takes the value in seconds; the effect attribute is used
     * to set one of the Animation Utility's built-in effects
     * (like YAHOO.util.Easing.easeOut)
     */
    animation: {
        validator: "_validateAnimation",
        value: { speed: 0, effect: Y.Easing.easeOut }
    }
};

Y.CarouselAnimPlugin = Y.extend(CarouselAnimPlugin, Y.Plugin.Base, {
    /**
     * Initialize the Animation plugin and plug the necessary events.
      *
      * @method initializer
      * @protected
     */
    initializer: function (config) {
        this.beforeHostMethod("scrollTo", this.animateAndScrollTo);
    },

    /**
     * Animate and scroll the Carousel widget to make the item at index
     * visible.
     *
     * @method animateAndScrollTo
     * @param {Number} index The index to be scrolled to
     * @public
     */
    animateAndScrollTo: function (index) {
        var self = this, carousel = self.get("host"),
            anim, animation, cb, first, from, isVertical, to;

        if (carousel.get("rendered")) {
            Y.log("animateAndScrollTo(" + index + ") invoked", "info",
                  CarouselAnimPlugin.NAME);
            animation = self.get("animation");
            if (carousel && animation.speed > 0) {
                index = carousel._getCorrectedIndex(index);
                if (isNaN(index)) {
                    return new Y.Do.Prevent();
                }
                cb = carousel.get("contentBox");
                isVertical = carousel.get("isVertical");
                if (isVertical) {
                    from = { top: carousel.get("top") };
                    to = { top: carousel._getOffsetForIndex(index) };
                } else {
                    from = { left: carousel.get("left") };
                    to = { left: carousel._getOffsetForIndex(index) };
                }
                first = carousel.getFirstVisible();
                self.fire(BEFORESCROLL_EVENT,
                        { first: first,
                          last: first + carousel.get("numVisible") });
                anim = new Y.Anim({
                    node: cb,
                    from: from,
                    to: to,
                    duration: animation.speed,
                    easing: animation.effect
                });
                anim.on("end", Y.bind(self._afterAnimEnd, self, index));
                anim.run();
                return new Y.Do.Prevent();
            }
        }

        return false;
    },

    /**
     * Update the "selectedItem".
     *
     * @method _afterAnimEnd
     * @param {Number} pos The new position of the "selectedItem"
     * @protected
     */
    _afterAnimEnd: function (pos) {
        var self = this, carousel = self.get("host");
        carousel.set("selectedItem", pos);
    },

    /**
     * Validate the animation configuration attribute.
     *
     * @method _validateAnimation
     * @param {Object} config The animation configuration
     * @protected
     */
    _validateAnimation: function (config) {
        var rv = false;

        Y.log("_validateAnimation called with " + config, "info",
              CarouselAnimPlugin.NAME);
        if (JS.isObject(config)) {
            if (JS.isNumber(config.speed)) {
                rv = true;
            }
            if (!JS.isUndefined(config.effect) &&
                !JS.isFunction(config.effect)) {
                rv = false;
            }
        }

        return rv;
    },

    /*
     * The animation object.
     */
    _animObj: null
});


}, 'gallery-2012.03.23-18-00' ,{requires:['gallery-carousel', 'anim', 'plugin', 'pluginhost']});
