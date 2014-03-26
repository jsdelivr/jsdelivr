YUI.add('gallery-bootstrap-popover', function(Y) {

/**

Add small overlays of content, like those on the iPad, to any element for housing secondary information.

@module gallery-bootstrap-popover
**/

/**

Add small overlays of content, like those on the iPad, to any element for housing secondary information.

This is a drop-in replacement for the Twitter Bootstrap popovers.

See http://jshirley.github.com/bootstrap/javascript.html#popovers for more
information.

You will need to include the Bootstrap CSS. This is only the JavaScript.

There are selectors you can use to narrow down and implement several tooltips
at once. The most sensible example is to match any link with a `rel="popover"`
attribute.

    YUI().use('gallery-bootstrap-popover', function(Y) {
        var popovers = new Y.Bootstrap.Popover({ selector : '*[rel=popover]' });

        // Additionally, you can plug into a node.
        Y.one('.popover').plug( Y.Bootstrap.PopoverPlugin );
    });

@class Bootstrap.Popover
@constructor
@extends Bootstrap.Tooltip
**/

var NS   = Y.namespace('Bootstrap'),
    Lang = Y.Lang,
    sub  = Y.Lang.sub,
    PositionAlign = Y.WidgetPositionAlign,
    OFFSET_WIDTH = 'offsetWidth',
    OFFSET_HEIGHT = 'offsetHeight';

NS.Popover = Y.Base.create("bootstrapPopover", Y.Bootstrap.Tooltip, [ ], {
    prefix   : 'popover',
    template : '<h3 class="popover-title">{title}</h3><div class="popover-content">{body}</div>',

    INNER_SELECTOR : '.popover-inner',
    BOUNDING_TEMPLATE : '<div class="popover"><div class="arrow"></div><div class="popover-inner"></div></div>',

    setContent : function(e) {
        var title = this.get('title'),
            body  = this.get('body'),
            box   = this.get('contentBox');

        // YUI adds a popover-content to the contentBox element automatically
        box.removeClass('popover-content');

        box.setHTML( sub( this.template, { title : title, body : body }) );
        Y.Array.each( 'fade in top bottom left right'.split(' '), function(c) {
            box.removeClass(c);
        });
    }
});



}, 'gallery-2012.08.22-20-00' ,{requires:['gallery-bootstrap-tooltip']});
