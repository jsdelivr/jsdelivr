YUI.add('gallery-anim-native', function(Y) {

/**
* The Animation Utility provides an API for creating advanced transitions.
*
* W3C CSS Animations:
* http://www.w3.org/TR/css3-animations/
*
* Easing method values from AliceJS:
* http://blackberry.github.com/Alice/
*
* Browser support:
* http://caniuse.com/#feat=css-animation
* IE10+, FF5+, Chrome 4+, Safari/iOS 4+, Android 2.1+
*
* @module anim-native
*/

/**
* Provides the CSS3 Native Anim class, for animating CSS properties.
*
* @module anim
* @submodule anim-native
*/
    "use strict";
    /*global Y:true */
    /*jslint regexp: true*/
    var VENDOR = ['', 'Webkit', 'Moz', 'O', 'ms'].filter(function (prefix) {
            return Y.config.doc.body.style.hasOwnProperty(prefix + 'Animation');
        })[0],
        PREFIX = VENDOR ? '-' + VENDOR.toLowerCase() + '-' : VENDOR,
        ANIMATION_END_VENDORS = {
            Webkit: 'webkitAnimationEnd',
            O: 'oAnimationEnd'
        },
        ANIMATION_END_EVENT = 'animationend',
        ANIMATION_END = ANIMATION_END_VENDORS[VENDOR] || ANIMATION_END_EVENT,

        /**
         * A class for constructing animation instances.
         * @class Anim
         * @for Anim
         * @constructor
         * @extends Base
         */
        Anim = function () {
            Anim.superclass.constructor.apply(this, arguments);
        };

    Y.Node.DOM_EVENTS[ANIMATION_END] = 1;

    Anim.NAME = 'animNative';
    Anim.DIRECTIONS = {
        normal: ['normal', 'reverse'],
        alternate: ['alternate', 'alternate-reverse']
    };
    Anim.EASINGS = {
        easeNone: {p1: 0.250, p2: 0.250, p3: 0.750, p4: 0.750},
        easeIn: {p1: 0.420, p2: 0.000, p3: 1.000, p4: 1.000},
        easeOut: {p1: 0.000, p2: 0.000, p3: 0.580, p4: 1.000},
        easeBoth: {p1: 0.420, p2: 0.000, p3: 0.580, p4: 1.000},
        easeInStrong: {p1: 0.895, p2: 0.030, p3: 0.685, p4: 0.220},
        easeOutStrong: {p1: 0.165, p2: 0.840, p3: 0.440, p4: 1.000},
        easeBothStrong: {p1: 0.770, p2: 0.000, p3: 0.175, p4: 1.000},
        backIn: {p1: 0.600, p2: -0.280, p3: 0.735, p4: 0.045},
        backOut: {p1: 0.175, p2: 0.885, p3: 0.320, p4: 1.275},
        backBoth: {p1: 0.680, p2: -0.550, p3: 0.265, p4: 1.550},

        // FIXME: Defaulting these to linear
        elasticIn: {p1: 0.250, p2: 0.250, p3: 0.750, p4: 0.750},
        elasticOut: {p1: 0.250, p2: 0.250, p3: 0.750, p4: 0.750},
        elasticBoth: {p1: 0.250, p2: 0.250, p3: 0.750, p4: 0.750},
        bounceIn: {p1: 0.250, p2: 0.250, p3: 0.750, p4: 0.750},
        bounceOut: {p1: 0.250, p2: 0.250, p3: 0.750, p4: 0.750},
        bounceBoth: {p1: 0.250, p2: 0.250, p3: 0.750, p4: 0.750}
    };

    Anim.RE_UNITS = /^(-?\d*\.?\d*){1}(em|ex|px|in|cm|mm|pt|pc|%)*$/;

    /**
     * Regex of properties that should use the default unit.
     *
     * @property RE_DEFAULT_UNIT
     * @static
     */
    Anim.RE_DEFAULT_UNIT = /^width|height|top|right|bottom|left|margin.*|padding.*|border.*$/i;

    /**
     * The default unit to use with properties that pass the RE_DEFAULT_UNIT test.
     *
     * @property DEFAULT_UNIT
     * @static
     */
    Anim.DEFAULT_UNIT = 'px';

    Anim._easing = function (name) {
        var e = Anim.EASINGS[name];
        return 'cubic-bezier(' + e.p1 + ', ' + e.p2 + ', ' + e.p3 + ', ' + e.p4 + ')';
    };

    Anim._toHyphen = function (property) {
        property = property.replace(/([A-Z]?)([a-z]+)([A-Z]?)/g, function (m0, m1, m2, m3) {
            var str = ((m1) ? '-' + m1.toLowerCase() : '') + m2;

            if (m3) {
                str += '-' + m3.toLowerCase();
            }

            return str;
        });

        return property;
    };

    Anim._insert = function (rule) {
        var doc = Y.config.doc,
            ruleNum,
            style;

        if (doc.styleSheets && doc.styleSheets.length) {
            ruleNum = 0;
            try {
                if (doc.styleSheets[0].cssRules.length > 0) {
                    ruleNum = doc.styleSheets[0].cssRules.length;
                }
                doc.styleSheets[0].insertRule(rule, ruleNum);
            } catch (e) {
            }
        } else {
            style = doc.createElement('style');
            style.innerHTML = rule;
            doc.head.appendChild(style);
        }
    };

    Anim._delete = function (ruleName) {
        var doc = Y.config.doc,
            cssrules = doc.all ? 'rules' : 'cssRules',
            i;

        for (i = 0; i < doc.styleSheets[0][cssrules].length; i += 1) {
            if (doc.styleSheets[0][cssrules][i].name === ruleName) {
                doc.styleSheets[0].deleteRule(i);
                break;
            }
        }
    };

    Anim.ATTRS = {
        /**
         * The object to be animated.
         * @attribute node
         * @type Node
         */
        node: {
            setter: function (node) {
                if (node) {
                    if (typeof node === 'string' || node.nodeType) {
                        node = Y.one(node);
                    }
                }

                this._node = node;
                if (!node) {
                }
                return node;
            }
        },

        /**
         * The length of the animation.  Defaults to "1" (second).
         * @attribute duration
         * @type NUM
         */
        duration: {
            value: 1
        },

        /**
         * The method that will provide values to the attribute(s) during the animation.
         * Defaults to "easeNone".
         * @attribute easing
         * @type Function
         */
        easing: {
            value: 'easeNone',
            setter: function (e) {
                return Anim._easing(e);
            }
        },

        /**
         * The starting values for the animated properties.
         *
         * Fields may be strings, numbers, or functions.
         * If a function is used, the return value becomes the from value.
         * If no from value is specified, the DEFAULT_GETTER will be used.
         * Supports any unit, provided it matches the "to" (or default)
         * unit (e.g. `{width: '10em', color: 'rgb(0, 0, 0)', borderColor: '#ccc'}`).
         *
         * If using the default ('px' for length-based units), the unit may be omitted
         * (e.g. `{width: 100}, borderColor: 'ccc'}`, which defaults to pixels
         * and hex, respectively).
         *
         * @attribute from
         * @type Object
         */
        from: {
            value: {}
        },

        /**
         * The keyframes between 0 and 100%.
         *
         * Example: {'50%': {
         *   width: 200
         * }}
         *
         * @attribute to
         * @type Object
         */
        frames: {
            value: {}
        },

        /**
         * The ending values for the animated properties.
         *
         * Fields may be strings, numbers, or functions.
         * Supports any unit, provided it matches the "from" (or default)
         * unit (e.g. `{width: '50%', color: 'red', borderColor: '#ccc'}`).
         *
         * If using the default ('px' for length-based units), the unit may be omitted
         * (e.g. `{width: 100, borderColor: 'ccc'}`, which defaults to pixels
         * and hex, respectively).
         *
         * @attribute to
         * @type Object
         */
        to: {
            value: {}
        },

        /**
         * Date stamp for the first frame of the animation.
         * @attribute startTime
         * @type Int
         * @default 0
         * @readOnly
         */
        startTime: {
            value: 0,
            readOnly: true
        },

        /**
         * Current time the animation has been running.
         * @attribute elapsedTime
         * @type Int
         * @default 0
         * @readOnly
         */
        elapsedTime: {
            value: 0,
            readOnly: true
        },

        /**
         * Whether or not the animation is currently running.
         * @attribute running
         * @type Boolean
         * @default false
         * @readOnly
         */
        running: {
            getter: function () {
                return this.get('node').getStyle(VENDOR + 'AnimationName') !== 'none';
            },
            value: false,
            readOnly: true
        },

        /**
         * The number of seconds to delay the animation
         * @attribute delay
         * @type Int
         * @default 0
         */
        delay: {
            value: 0
        },

        /**
         * The number of times the animation should run. 'infinite' or integer.
         * @attribute iterations
         * @type Int
         * @default 1
         */
        iterations: {
            value: 1
        },

        /**
         * The number of iterations that have occurred.
         * Resets when an animation ends (reaches iteration count or stop() called).
         *
         * Note: no way to update this mid animation.
         *
         * @attribute iterationCount
         * @type Int
         * @default 0
         * @readOnly
         */
        iterationCount: {
            value: 0,
            readOnly: true
        },

        /**
         * How iterations of the animation should behave.
         * Possible values are "normal" and "alternate".
         * Normal will repeat the animation, alternate will reverse on every other pass.
         *
         * @attribute direction
         * @type String
         * @default "normal"
         */
        direction: {
            value: 'normal' // | alternate (fwd on odd, rev on even per spec)
        },

        /**
         * Whether or not the animation is currently paused.
         * @attribute paused
         * @type Boolean
         * @default false
         * @readOnly
         */
        paused: {
            getter: function () {
                return this.get('node').getStyle(VENDOR + 'AnimationPlayState') === 'paused';
            },
            readOnly: true,
            value: false
        },

        /**
         * If true, animation begins from last frame
         * @attribute reverse
         * @type Boolean
         * @default false
         */
        reverse: {
            value: false
        },

        /**
         * Perspective depth
         * @attribute perspective
         * @type int
         * @default 1000
         */
        perspective: {
            value: 1000
        },

        /**
         * X/Y axis origin
         * @attribute perspectiveOrigin
         * @type String
         * @default 'center center'
         */
        perspectiveOrigin: {
            value: 'center center'
        },

        /**
         * If 'visible' the element is show when not facing the screen. If 'hidden' the
         * element will be invisible when not facing the screen.
         * @attribute backfaceVisibility
         * @type String
         * @default 'visible'
         */
        backfaceVisibility: {
            value: 'visible'
        }
    };

    Y.extend(Anim, Y.Base, {
        initializer: function (config) {
            this._sub = null;
        },

        /**
         * Starts or resumes an animation.
         * @method run
         * @chainable
         */
        run: function () {
            if (this.get('paused')) {
                this._resume();
            } else if (!this.get('running')) {
                this._start();
            }
            return this;
        },

        /**
         * Pauses the animation and
         * freezes it in its current state and time.
         * Calling run() will continue where it left off.
         * @method pause
         * @chainable
         */
        pause: function () {
            if (this.get('running')) {
                this.get('node').setStyle(VENDOR + 'AnimationPlayState', 'paused');
                this.fire('pause');
            }
            return this;
        },

        /**
         * Stops the animation and resets its time.
         * @method stop
         * @param {Boolean} finish If true, the animation will move to the last frame
         * @chainable
         */
        stop: function (finish) {
            this._end();
            return this;
        },

        _resume: function () {
            this.get('node').setStyle(VENDOR + 'AnimationPlayState', 'running');
            this.fire('resume');
        },

        /**
         * Initializes animation. Inserts keyframes into DOM and updates node styles.
         */
        _start: function () {
            var node = this.get('node'),
                parent = node.get('parentNode'),
                name = 'anim-' + Y.guid(),
                direction = Anim.DIRECTIONS[this.get('direction')][+this.get('reverse')],
                from = this.get('from'),
                to = this.get('to'),
                frames = this.get('frames'),
                keyframes = {},
                res,
                frame,
                styles = {},
                parentStyles = {};

            node.removeAttribute('style');
            node.setAttribute('style', '');

            keyframes['0%'] = from;
            keyframes = Y.merge(keyframes, frames);
            keyframes['100%'] = to;

            res = this._render(node, name, keyframes);

            Anim._insert(res.css);

            // Apply last animation frame styles
            if (this.get('iterations') !== 'infinite') {
                frame = this.get('iterations') % (2 - this.get('reverse')) * 100;
                Y.Object.each(res.styles[frame + '%'], function (value, prop) {
                    styles[prop] = value;
                });
            }

            this.set('iterationCount', 0);

            parentStyles[VENDOR + 'Perspective'] = this.get('perspective') + 'px';
            parentStyles[VENDOR + 'PerspectiveOrigin'] = this.get('perspectiveOrigin');
            parent.setStyles(parentStyles);

            styles[VENDOR + 'AnimationName'] = name;
            styles[VENDOR + 'AnimationDuration'] = this.get('duration') + 's';
            styles[VENDOR + 'AnimationTimingFunction'] = this.get('easing');
            styles[VENDOR + 'AnimationDelay'] = this.get('delay') + 's';
            styles[VENDOR + 'AnimationIterationCount'] = this.get('iterations');
            styles[VENDOR + 'AnimationDirection'] = direction;
            styles[VENDOR + 'AnimationPlayState'] = 'running';
            styles[VENDOR + 'BackfaceVisibility'] = this.get('backfaceVisibility');

            node.setStyles(styles);

            this.fire('start');
            this._sub = node.on(ANIMATION_END, Y.bind(this._end, this));
        },

        _end: function () {
            var node = this.get('node'),
                name = node.getStyle(VENDOR + 'AnimationName'),
                styles = {};

            if (this._sub) {
                this._sub.detach();
                this._sub = null;
            }

            styles[VENDOR + 'AnimationName'] = '';
            styles[VENDOR + 'AnimationDuration'] = '';
            styles[VENDOR + 'AnimationTimingFunction'] = '';
            styles[VENDOR + 'AnimationDelay'] = '';
            styles[VENDOR + 'AnimationIterationCount'] = '';
            styles[VENDOR + 'AnimationDirection'] = '';
            styles[VENDOR + 'AnimationPlayState'] = '';
            styles[VENDOR + 'BackfaceVisibility'] = '';
            node.setStyles(styles);

            // TODO: Restore parent node perspective?

            this.set('iterationCount', this.get('iterations'));

            Anim._delete(name);
            this.fire('end', {elapsed: this.get('elapsedTime')});
        },

        /**
         * Generate CSS keyframes string and meta data.
         */
        _render: function (node, name, keyframes) {
            var css = ['@' + PREFIX + 'keyframes ' + name + ' {'],
                styles = {};

            Y.Object.each(keyframes, function (props, key) {
                css.push('\t' + key + ' {');
                styles[key] = {};

                Y.Object.each(props, function (value, prop) {
                    var parsed;

                    if (typeof value === 'function') {
                        value = value.call(this, node);
                    }

                    if (Anim.RE_DEFAULT_UNIT.test(prop)) {
                        parsed = Anim.RE_UNITS.exec(value);

                        if (parsed && !parsed[2]) {
                            value += Anim.DEFAULT_UNIT;
                        }
                    }

                    if (prop === 'transform') {
                        prop = VENDOR + 'Transform';
                    }

                    styles[key][prop] = value;
                    css.push('\t\t' + Anim._toHyphen(prop) + ': ' + value + ';');
                }, this);

                css.push('\t}');
            }, this);

            css.push('}');
            return {css: css.join('\n'), styles: styles};
        },

        destructor: function () {
            if (this._sub) {
                this._sub.detach();
                this._sub = null;
            }
        }
    });

    Y.Anim = Anim;
    Y.AnimNative = Anim;


}, 'gallery-2012.10.03-20-02' ,{skinnable:false});
