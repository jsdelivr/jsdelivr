YUI.add('gallery-ttw-button', function(Y) {

/**
This module provides the style and behavior for TipTheWeb Tip Buttons.

Adding TipTheWeb Tip Buttons to your website encourages people to support your
work by tipping it.

@url http://tiptheweb.org/
@see http://tiptheweb.org/docs/integration/buttons/
@module gallery-ttw-button
**/

var TipWidget,

    TIP_URL         = 'http://tiptheweb.org/tip/',
    TIP_URL_SECURE  = 'https://tiptheweb.org/tip/',

    isSecure = Y.config.win.location.protocol === 'https:',
    
    YQueryString    = Y.QueryString,
    parseQuery      = YQueryString.parse,
    stringifyQuery  = YQueryString.stringify,
    
    widget;

// *** TipWidget *** //

TipWidget = function(){};
TipWidget.prototype = {
    
    url         : null,
    iframe      : null,
    container   : null,
    _initialized: false,
    
    init : function () {
        this.container  = Y.Node.create('<div class="ttw-widget-overlay" />').plug(Y.Plugin.Align);
        this.iframe     = Y.Node.create('<iframe />').setAttrs({
            frameBorder : '0',
            scrolling   : 'no'
        });
        
        this.container.append('<span class="ttw-widget-overlay-loading" />');
        Y.Node.create('<span class="ttw-widget-overlay-close" />')
            .appendTo(this.container)
            .on('click', Y.bind(this.close, this));
            
        this.container.append(this.iframe);
        
        Y.one('win').on('message', Y.bind(this._handleMessage, this));
        
        this._initialized = true;
    },
    
    open : function (data) {
        if ( ! this._initialized) { this.init(); }
        data || (data = {});
        
        var win = Y.config.win,
            loc = win.location.toString(),
            url = (isSecure ? TIP_URL_SECURE : TIP_URL) + '?' + stringifyQuery({
                link    : data.link || loc,
                title   : data.title || '',
                r       : loc
            });
        
        // redirect if 
        if (win.screen.width <= 480) {
            url += '&mode=mobile';
            win.top.location = url;
            return this;
        }
        
        url += '&mode=embed';
        if (this.url !== url) {
            this.url = url;
            this.iframe.set('src', url);
        }
        
        this.container.appendTo('body');
        
        return this.center();
    },
    
    close : function () {
        if (this._initialized) {
            this.container.remove().setStyle('width', null);
        }
        return this;
    },
    
    center : function (resize) {
        var container = this.container;
        container.align.center(container.get('viewportRegion'), resize);
        return this;
    },
    
    _handleMessage : function (e) {
        if (this.url.indexOf(e._event.origin) !== 0) { return; }
        
        var message = e._event.data.split(':'),
            type    = message[0],
            data    = message[1];
        
        switch (type) {
        case 'close':
            this.close();
            break;
            
        case 'width':
            this.container.setStyle('width', data);
            this.center();
            break;
        }
    }
    
};

function getTipData (button) {
    var href        = button.get('href') || '',
        queryIndex  = href.indexOf('?'),
        queryString = queryIndex > -1 ? href.substr(queryIndex + 1) : '';
    
    return parseQuery(queryString);
}

function handleButtonClick (e) {
    e.preventDefault();
    widget || (widget = new TipWidget());
    widget.open(getTipData(e.currentTarget));
}

Y.delegate('click', handleButtonClick, Y.config.doc, 'a.ttw-button');


}, 'gallery-2011.06.08-20-04' ,{requires:['node-base', 'node-event-delegate', 'align-plugin', 'querystring-parse-simple', 'querystring-stringify-simple'], skinnable:false});
