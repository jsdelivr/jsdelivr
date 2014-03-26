YUI.add('gallery-taptotop', function(Y) {


'use strict';

// A regular link will scroll to the top just fine, but we want smooth, animated scroll,
// maybe with easing even. And we only want to reveal this control after the user 
// scrolls down a tad. And it would be nice to just plug this in without any additional
// markkup. Hence making this a plugin.

function TapToTopPlugin(config) {
    TapToTopPlugin.superclass.constructor.apply(this, arguments);
}
TapToTopPlugin.NAME = 'tapToTopPlugin';
TapToTopPlugin.NS = 'tapToTop';
TapToTopPlugin.ATTRS = {
    TRIGGERING_DISTANCE: {
        value: 100
    },
    CSS_CLASS_SHOWN: {
        value: 'shown'
    }
};

Y.extend(TapToTopPlugin, Y.Plugin.Base, {

    initializer: function () {
        var host = this.get('host');

        if (!host.one('#tapToTop')) {
            host.append('<a id="tapToTop" href="#top" title="Top of page">Top of page<span class="circumflex"><span class="bar"></span><span class="bar"></span></span></a>');
        }

        this.btn = host.one('#tapToTop');

        this.btnListener = this.btn.on('click', this._handleClick, this);
        this.windowListener = Y.on('scroll', this._handleWindowScroll, Y.config.win, this);

        this.scrollAnimation = new Y.Anim({
            node: Y.one('body'),
            easing: 'easeOut',
            to: {
                scrollTop: 0
            }
        });
    },

    destructor: function () {
        this.btnListener.detach();
        this.windowListener.detach();
    },

    _handleClick: function (e) {
        e.preventDefault();
        this._scroll();
    },

    _scroll: function () {
        this.scrollAnimation.run();
    },

    _show: function () {
        this.btn.addClass(this.get('CSS_CLASS_SHOWN'));
    },

    _hide: function () {
        this.btn.removeClass(this.get('CSS_CLASS_SHOWN'));
    },

    _handleWindowScroll: function (e) {
        // listen for window scroll events, and when the window scrolls past n px, show the node
        if (e.currentTarget.get('pageYOffset') > this.get('TRIGGERING_DISTANCE')) {
            this._show();
        } else {
            this._hide();
        }
    }

});

Y.TapToTopPlugin = TapToTopPlugin;



}, 'gallery-2012.10.24-20-01' ,{requires:['node','event','plugin','anim-base','anim-easing'], skinnable:true});
