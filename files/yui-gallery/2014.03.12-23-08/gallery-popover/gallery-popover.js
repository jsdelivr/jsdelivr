YUI.add('gallery-popover', function (Y, NAME) {


var DATA_HEADER = 'data-header',
    DATA_BODY = 'data-content',
    DATA_FOOTER = 'data-footer',

    WidgetStdMod = Y.WidgetStdMod;

Y.Popover = Y.Base.create("popover", Y.Tipsy, [Y.WidgetStdMod], {
    _setTooltipContent: function (node) {        
        var headerContent = (node.hasAttribute(DATA_HEADER)) ? node.getAttribute(DATA_HEADER) : this.get('headerContent'),
            bodyContent = (node.hasAttribute(DATA_BODY)) ? node.getAttribute(DATA_BODY) : this.get('bodyContent'),
            footerContent = (node.hasAttribute(DATA_FOOTER)) ? node.getAttribute(DATA_FOOTER) : this.get('footerContent'),
            contentBox = this.get('contentBox');

        this.setStdModContent(WidgetStdMod.HEADER, headerContent, WidgetStdMod.REPLACE);
        this.setStdModContent(WidgetStdMod.BODY, bodyContent, WidgetStdMod.REPLACE);
        this.setStdModContent(WidgetStdMod.FOOTER, footerContent, WidgetStdMod.REPLACE);
    }
});


}, 'gallery-2013.03.27-22-06', {"requires": ["base-build", "gallery-tipsy", "widget-stdmod"], "skinnable": true});
