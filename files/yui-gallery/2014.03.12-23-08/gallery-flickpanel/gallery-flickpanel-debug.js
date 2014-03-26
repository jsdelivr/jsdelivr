YUI.add('gallery-flickpanel', function(Y) {


'use strict';

/**
 *  Plug this into a page where you have a flickPanel and a main area,
 *  and you want to be able to flick the flickPanel out of the way.
 */

function FlickPanelPlugin(config) {
    FlickPanelPlugin.superclass.constructor.apply(this, arguments);
}

FlickPanelPlugin.NAME = 'FlickPanelPlugin';
FlickPanelPlugin.NS = 'FlickPanel';
FlickPanelPlugin.PULL_TAB_MARKUP = '<div class="pullTab"><div class="gripper">Pull-tab</div></div>';
FlickPanelPlugin.WINDOW_CHANGE_EVENT = (Y.config.win.hasOwnProperty && Y.config.win.hasOwnProperty('onorientationchange')) ? 'orientationchange' : 'resize';
FlickPanelPlugin.ATTRS = {
};

Y.extend(FlickPanelPlugin, Y.Plugin.Base, {
    initializer: function (config) {
        this.isOpen = false;
        this.deviceSupportsTouch = (Y.config.win.hasOwnProperty && Y.config.win.hasOwnProperty('ontouchstart'));
        // typically the body element
        this.root = config.root || this.get('host');
        this.animateMain = config.animateMain || false;
        // typically a node representing a sidebar or drawer
        this.flickPanelNode = config.flickPanel;
        // typically a node representing main content pushed aside by flickPanel
        this.mainNode = config.main;
        this.yVal = this.flickPanelNode.getY();
        this.xPos = 0;
        this.trackingDirection = null;
        this.flickPanelNode.append(FlickPanelPlugin.PULL_TAB_MARKUP);
        this.pullTab = this.root.one('.pullTab');

        // flickPanel tracks along with input
        // also triggers toggle at end of input, so a click will also initiate toggle
        if (this.deviceSupportsTouch) {
            this.pullTab.on('gesturemovestart', this._track, this, this);
            this.pullTab.on('gesturemove', this._track, this, this);
            this.pullTab.on('gesturemoveend', this._stopTracking, this, this);
        }

        // also listen for a page flick
        if (this.animateMain) {
            this.root.on('flick', this._onFlick, '', this);
        }

        // slide into adjusted position on orientation change
        this.windowListener_1 = Y.on(FlickPanelPlugin.WINDOW_CHANGE_EVENT, this._windowChange, Y.config.win, this);

        // flickPanel may change positioning model as page scrolls
        this.windowListener_2 = Y.on('touchmove', this._flickPanelScrollStop, Y.config.win, this);
        this.windowListener_3 = Y.on('scroll', this._flickPanelScrollStop, Y.config.win, this);

        // extra listener for toggle affordance
        this.windowListener_4 = Y.on('flickpanel.toggle.click', this._toggle, this);

    },

    destructor: function () {
        this.flickPanelNode.setStyle('position', '');
        this.pullTab.remove();
        this._closePanel();
        this.pullTab.detach();
        this.root.detach('flick', this._onFlick);
        this.windowListener_1.detach();
        this.windowListener_2.detach();
        this.windowListener_3.detach();
        this.windowListener_4.detach();
    },

    _windowChange: function () {
        /**
         *  Window change can cause dimension and positioning changes
         *  which necessitate repositioning the flickPanel.
         *  If it's open, pop it to correct open position, otherwise close.
         */
        if (this.isOpen) {
            this._slidePanels(this.flickPanelNode.get('offsetWidth'), false);
        } else {
            this._slidePanels(0, false);
        }
    },

    _onFlick: function (e) {
        // Don't respond to flick events percolating through certain components
        // TO DO: pull this out and put it into conf so that FlickPanel
        // remains clean and generalized
        if (e.target.ancestor('.yui3-scrollview-horiz') || e.target.ancestor('.yui3-carousel')) {
            return;
        }
        // get the raw event data in order to determine angle of flick
        // event-flick only determines angles >45deg, dividing them into
        // "x" and "y" axes
        var flick = e.flick,
            flickAngle,
            minDistance = 20,
            minVelocity = 0.1,
            axis = 'x',
            yMovement = (e._event.changedTouches) ? Math.abs(e._event.changedTouches[0].clientY - flick.start.clientY) : Math.abs(e.pageY - flick.start.pageY);
        if (Math.abs(flick.distance) < minDistance || Math.abs(flick.velocity) < minVelocity || flick.axis !== axis) {
            return;
        }
        // the angle can be computed using Tangent: tan(θ) = Opposite / Adjacent
        // i.e., θ = tan (-1) Opposite/Adjacent;
        // tan(flickAngle) = yMovement/flick.distance;
        // flickAngle = tan(-1) yMovement/flick.distance;
        // flickAngle = Math.atan(yMovement/flick.distance);
        // var flickAngle = Math.atan(yMovement/flick.distance);
        flickAngle = Math.atan2(yMovement, flick.distance);
        flickAngle = parseInt(flickAngle * 180 / Math.PI, 10);

        /**
         *  debugging and tuning info, please leave in place.
         */
        // if (!Y.one('#devConsole')) {
        //     Y.one('#hd-wrap').append('<div id="devConsole" style="background:black;padding:10px;color: green;position:fixed;top: 42px;right: 0px;opacity:.9;border: 2px dashed green;">Dev console</div>');
        // }
        // Y.one('#devConsole').setContent(
        //     'flick.distance: ' + flick.distance +'px<br />\
        //     flick.start.clientY: ' + flick.start.clientY +'px<br />\
        //     e._event.changedTouches[0].clientY: ' + e._event.changedTouches[0].clientY +'px<br />\
        //     yMovement: ' + yMovement +'px<br />\
        //     flickAngle:'+ flickAngle + 'deg');

        if (flickAngle <= 15) {
            this._openPanel();
        } else if (flickAngle >= 165 && flickAngle <= 180) {
            this._closePanel();
        }
    },

    _slidePanels: function (xPos, useTransition) {
        var prefix,
            transitionProperty,
            transformProperty;
        if (Y.UA.webkit) {
            prefix = '-webkit-';
        } else if (Y.UA.gecko) {
            prefix = '-moz-';
        } else if (Y.UA.opera) {
            prefix = '-o-';
        } else if (Y.UA.ie) {
            prefix = '-ms-';
        } else {
            prefix = '';
        }
        transitionProperty = (Y.UA.gecko) ? 'MozTransition' : prefix + 'transition';
        transformProperty = (Y.UA.gecko) ? 'MozTransform' : prefix + 'transform';
        if (useTransition) {
            this.flickPanelNode.setStyle(transitionProperty, prefix + 'transform .25s ease-out');
            this.mainNode.setStyle(transitionProperty, prefix + 'transform .25s ease-out');
        }
        if (this.animateMain) {
            this.mainNode.setStyle(transformProperty, 'translateX(' + xPos + 'px)');
        }
        this.flickPanelNode.setStyle(transformProperty, 'translateX(' + xPos + 'px)');
    },

    _openPanel: function () {
        var offsetWidth = this.flickPanelNode.get('offsetWidth');
        this._slidePanels(parseInt(offsetWidth, 10), true);
        this.isOpen = true;
        Y.fire('flickpanel.open', {});
    },

    _closePanel: function () {
        this._slidePanels(0, true);
        this.isOpen = false;
        Y.fire('flickpanel.close', {});
    },

    _toggle: function () {
        // test if flickPanel is displayed and actionable
        if (this.flickPanelNode.get('clientWidth') !== 0) {
            if (!this.isOpen) {
                this._openPanel();
            } else {
                this._closePanel();
            }
        }
    },

    _track: function (e) {
        if (this.xPos < e.pageX) {
            this.trackingDirection = 'opening';
        } else {
            this.trackingDirection = 'closing';
        }
        this.xPos = e.pageX;
        if (this.xPos > 0 && this.xPos < this.flickPanelNode.get('offsetWidth')) {
            this._slidePanels(this.xPos);
        }
    },

    _stopTracking: function (e) {
        // any e.halt is unwelcome, but it prevents unintended click events from occurring as you release your finger from the drag
        e.halt();
        /**
         *  What direction were we tracking in? It matters. If we're dragging to
         *  the right, we want to open by default if we're past the minThreshold.
         *  If we're swiping to the left, we want to close by default if we're
         *  past the maxThreshold.
         */
        var flickPanelWidth = this.flickPanelNode.get('offsetWidth'),
            minThreshold = Math.round(flickPanelWidth / 3),
            maxThreshold = flickPanelWidth - 22;
        this.xPos = e.pageX;
        if ((this.trackingDirection === 'opening' && this.xPos > minThreshold) || this.xPos > maxThreshold) {
            this._openPanel();
        } else {
            this._closePanel();
        }
    },

    _flickPanelScrollStop: function () {
        // locks the panel to the top of the screen when scrolling vertically
        var fp = this.flickPanelNode,
            yVal = this.yVal,
            win = Y.config.win;
        // iOS 4.x does not support position fixed
        // iOS5+ and desktop webkit support position: fixed
        if (Y.UA.ios && Y.UA.ios < 5) {
            if (win.scrollY >= yVal) {
                fp.setStyle('top', (win.scrollY - this.yVal) + 'px');
            } else {
                fp.setStyle('top', '');
            }
        } else {
            if (win.scrollY >= yVal) {
                fp.setStyle('position', 'fixed');
            } else {
                fp.setStyle('position', '');
            }
        }
    }
});

Y.FlickPanelPlugin = FlickPanelPlugin;


}, 'gallery-2012.06.27-20-10' ,{requires:['node', 'event', 'event-flick', 'event-move', 'plugin'], skinnable:false});
