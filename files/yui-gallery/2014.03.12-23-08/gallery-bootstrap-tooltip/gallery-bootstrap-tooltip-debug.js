YUI.add('gallery-bootstrap-tooltip', function(Y) {

/**

This is a drop-in for the Twitter Bootstrap tooltips, so you don't have to
schlep in jQuery.

@module gallery-bootstrap-tooltip
**/

/**
This is a drop-in for the Twitter Bootstrap tooltips, so you don't have to
schlep in jQuery.

See http://twitter.github.com/bootstrap/javascript.html#tooltips for more
information.

You will need to include the Bootstrap CSS. This is only the JavaScript.

There are selectors you can use to narrow down and implement several tooltips
at once. The most sensible example is to match any link with a `rel="tooltip"`
attribute.

    YUI().use('gallery-bootstrap-tooltip', function(Y) {
        var tooltipManager = new Y.Bootstrap.Tooltip({ selector : '*[rel=tooltip]' });
    });

@class Bootstrap.Tooltip
@constructor
@extends Widget
@uses WidgetPosition
@uses WidgetStack
@uses WidgetPositionAlign
@uses WidgetPositionConstrain
**/

var NS = Y.namespace('Bootstrap');

NS.Tooltip = Y.Base.create("bootstrapTooltip", Y.Widget, [ Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.WidgetPositionConstrain], {
    eventIn  : 'mouseover',
    eventOut : 'mouseout',
    tooltip  : null,
    template : '<div><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',

    BOUNDING_TEMPLATE : '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',

    initializer : function() {
        var selector = this.get('selector'),
            trigger  = this.get('trigger'),
            eventIn  = trigger === 'hover' ? this.eventIn : 'focus',
            eventOut = trigger === 'hover' ? this.eventOut : 'blur';

        this._cssPrefix = 'tooltip';

        if ( selector ) {
            Y.delegate(eventIn,  this._showFn, document.body, selector, this);
            Y.delegate(eventOut, this._hideFn, document.body, selector, this);
        }

        this.after('titleChange', this.setContent, this);

        this.set('visible', false);
        this.render();
    },

    _showFn : function(e) {
        var target = e.target,
            delay  = this.get('delay'),
            title  = target.getAttribute('title'),
            box    = this.get('boundingBox');

        if ( !title ) {
            title = target.getAttribute('data-original-title');
        } else {
            target.removeAttribute('title');
            target.setAttribute('data-original-title', title);
        }
        this.set('title', title);
        this._hoverState  = 'in';
        this._showTimeout = Y.later( delay, this, this._show, { target: target } );
    },

    _show : function(data) {
        var box     = this.get('boundingBox'),
            animate = this.get('animation'),
            place   = this.get('placement'),
            target  = data.target;

        if ( this._hoverState === 'in' ) {
            box.show();

            if ( target ) {
                this.set('align', { node : target, points: this._getAlignment(place) });
            }
            if ( animate ) {
                box.transition({
                    duration : 0,
                    opacity  : 1
                }, function() {
                    box.addClass('fade');
                });
            }
            box.addClass('in');
            box.addClass( place );
        }
    },

    _hideFn : function() {
        var delay  = this.get('delay');

        this._hoverState  = 'out';
        this._showTimeout = Y.later( delay, this, this._hide );
    },

    _hide : function() {
        var box = this.get('boundingBox'),
            animate = this.get('animation');

        if ( this._hoverState === 'out' ) {
            if ( box.hasClass('fade') ) {
                box.transition({
                    duration : 1,
                    opacity  : 0
                }, function() {
                    box.removeClass('fade');
                    box.removeClass('in');
                    box.hide();
                });
            } else {
                box.removeClass('fade');
                box.removeClass('in');
            }
        }
    },

    _getAlignment : function(placement) {
        if ( placement === 'bottom' ) {
            return [ Y.WidgetPositionAlign.TC, Y.WidgetPositionAlign.BC ];
        }
        else if ( placement === 'left' ) {
            return [ Y.WidgetPositionAlign.RC, Y.WidgetPositionAlign.LC ];
        }
        else if ( placement === 'right' ) {
            return [ Y.WidgetPositionAlign.LC, Y.WidgetPositionAlign.RC ];
        }
        else {
            return [ Y.WidgetPositionAlign.BC, Y.WidgetPositionAlign.TC ];
        }
    },

    _defaultCB : function() {
        return this.get('boundingBox').one('.tooltip-inner');
    },

    setContent : function(e) {
        var title = this.get('title'),
            box   = this.get('contentBox');

        box.setContent(title);
        Y.Array.each( 'fade in top bottom left right'.split(' '), function(c) {
            box.removeClass(c);
        });
    }
}, {
    ATTRS: {
        /**
        Whether or not to animate the display of the tooltip

        @attribute animation
        @default true
        @type boolean
        **/
        animation : { value : true },
        /**
        Where to place the tooltip. Valid values are top, bottom, left or right.

        @attribute placement
        @default top
        @type String
        **/
        placement : { value : 'top' },
        /**
        Selector to listen to. Defaults to false, and attaches no
        delegation events. Set to a valid selector and any event will
        fire it.

        @attribute selector
        @default false
        @type String | boolean
        **/
        selector  : { value : false },
        /**
        What event to listen for. This must be an event that
        bubbles. Hover or click will work as expected.

        @attribute trigger
        @default hover
        @type String
        **/
        trigger   : { value : 'hover' },
        /**
        The content of the tooltip to display. This is updated each time the
        event is triggered. Set by the <code>setContent</code> method.

        @attribute title
        @default ''
        @type String
        **/
        title     : { value : '' },
        /**
        Delay in hiding and showing the tooltip.

        @attribute delay
        @default 0
        @type Number
        **/
        delay     : { value : 0 },
        /**
        Attribute to show if the tooltip is visible or not.

        @attribute visible
        @default false
        @type boolean
        **/
        visible   : { value : false }
    }
});



}, 'gallery-2012.08.22-20-00' ,{requires:['anim','transition','widget','base','widget-position-align','widget-stack','widget-position','widget-position-constrain']});
