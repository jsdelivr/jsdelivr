YUI.add('gallery-anim-morph', function(Y) {

var module = Y.namespace('gallery.anim.morph');

/**
 * Morph animation class to swap between two nodes.
 *
 * @class Morph
 * @module gallery.anim.morph
 * @extends Widget
 * @constructor
 *
 */
module.Morph = Y.Base.create('gallery-anim-morph', Y.Widget, [], {

    _animate: true,

    /**
     * Perform the animated version of the Morph.
     *
     * @method _perform_anim_morph
     * @param {Event} ev
     * @param {Node} src
     * @param {Node} target
     * @private
     *
     */
    _perform_anim_morph: function (ev, src, target) {
        var that = this,
            src_height = src.getComputedStyle('height').replace('px', ''),
            target_height = target.getComputedStyle('height');

        target.addClass('hidden');
        src.setStyle('opacity', 0);
        src.removeClass('hidden');
        src.setStyle('height', target_height);

        var fade_in = new Y.Anim({
            node: src,
            to: {opacity: 1},
            duration: 1,
            easing: 'easeIn'
            });

        var resize = new Y.Anim({
            node: src,
            to: {height: src_height},
            duration: 0.5,
            easing: 'easeOut'
            });

        resize.on('end', function () {
            src.setStyle('height', 'auto');
            that.fire('morphed');
        });

        fade_in.run();
        resize.run();
    },

    /**
     * Pass an optional animate boolean flag to skip animations. Useful
     * for initial states/testing.
     *
     * @method initializer
     * @param {Object} cfg
     *
     */
    initializer: function(cfg) {
        if (Y.Lang.isValue(cfg.animate)) {
            this._animate = cfg.animate;
        } else {
            this._animate = true;
        }
    },

    /**
     * Perform the morph animation between the nodes.
     *
     * @method morph
     * @param {Bool} reverse the animation back.
     *
     */
    morph: function(reverse) {
        var srcNode = this.get(reverse ? 'targetNode' : 'srcNode');
        var targetNode = this.get(reverse ? 'srcNode' : 'targetNode');

        if (this._animate) {
            var that = this,
                fade_out = new Y.Anim({
                    node: targetNode,
                    to: {opacity: 0},
                    duration: 0.2,
                    easing: 'easeOut'
                    });

            fade_out.on('end', this._perform_anim_morph, this, targetNode, srcNode);
            fade_out.run();

        } else {
            targetNode.addClass('hidden');
            srcNode.removeClass('hidden');
            srcNode.setStyle('height', 'auto');
            this.fire('morphed');
        }
    },

    /**
     * Reverse the animation effect.
     *
     * Shortcut for morph(true)
     *
     * @method reverse
     *
     */
    reverse: function () {
        this.morph(true);
    }
},{
    ATTRS: {
        /**
         * The DOM node to be morphed from.
         *
         * @attribute targetNode
         * @default null
         * @type String|Node
         *
         */
        targetNode: {
            value: null,
            setter: function(val) {
                return Y.one(val);
            }
        }
    }
});


}, 'gallery-2012.07.18-13-22' ,{requires:['anim', 'base', 'node', 'widget'], skinnable:false});
