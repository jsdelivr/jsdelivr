YUI.add('gallery-tipsy', function (Y, NAME) {

    

var Lang = Y.Lang,
    getCN = Y.ClassNameManager.getClassName,

    //HTML5 Data Attributes
    DATA_CONTENT = 'data-content',
    DATA_PLACEMENT = 'data-placement',

    //Classes
    TIPSY = 'tipsy',
    FADE = 'fade',
    IN = 'in',

    CLASSES = {
        fade: getCN(TIPSY, FADE),
        fadeIn: getCN(TIPSY, IN)
    };


Y.Tipsy = Y.Base.create("tipsy", Y.Widget, [Y.WidgetPointer, Y.WidgetPosition, Y.WidgetPositionAlign, Y.WidgetStack], {

    _handles    : [],

    //constructor
    initializer : function(config) {

    },

    //clean up on destruction
    destructor : function() {
        Y.each(this._handles, function(v, k, o) {
            v.detach();
        });
    },

    renderUI : function () {
        this.get('boundingBox').addClass(CLASSES.fade).setAttribute('role', 'tooltip');
    },

    bindUI : function () {
        var del = this.get('delegate'),
            selector = this.get('selector'),
            showOn = this.get('showOn');

        //showOn = ['event1', 'event2']
        if (Lang.isArray(showOn) || Lang.isString(showOn)) {
            this._handles.push(del.delegate(showOn, this._handleDelegateStart, selector, this));
        }

        //showOn = { events: ['event1', 'event2'] }
        else if (Lang.isObject(showOn) && !showOn.node) {
            this._handles.push(del.delegate(showOn.events, this._handleDelegateStart, selector, this));
        }

        //showOn = { node: '#selector', events: ['event1', 'event2'] }
        else if (Lang.isObject(showOn) && showOn.node && showOn.events) {
            this._handles.push(Y.one(showOn.selector).on(showOn.events, this._handleDelegateStart, this));
        }
        else {
            Y.log('The showOn attribute should contain an array of events, or an object with keys "selector" (string), and "events" (array of events)');
        }
    },

    _handleDelegateStart : function (e) {
        var del = this.get('delegate'),
            selector = this.get('selector'),
            hideOn = this.get('hideOn'),
            node = e.currentTarget;

        if (Lang.isArray(hideOn) || Lang.isString(hideOn)) {
            this._handles.push(del.delegate(hideOn, this._handleDelegateEnd, selector, this));
        }

        //hideOn = { events: ['event1', 'event2'] }
        else if (Lang.isObject(hideOn) && !hideOn.selector) {
            this._handles.push(del.delegate(hideOn.events, this._handleDelegateEnd, selector, this));
        }

        //hideOn = { node: '#selector', events: ['event1', 'event2'] }
        else if (Lang.isObject(hideOn) && hideOn.selector && hideOn.events) {
            this._handles.push(Y.one(hideOn.selector).on(hideOn.events, this._handleDelegateEnd, this));
        }
        else {
            Y.log('The hideOn attribute should contain an array of events, or an object with keys "selector" (string), and "events" (array of events)');
        }

        this.showTooltip(node);
    },

    _handleDelegateEnd: function (e) {
        this.hideTooltip();
    },

    showTooltip : function (node) {
        this._setTooltipContent(node);
        this._alignTooltip(node);
        this.alignPointer(node);
        this._showTooltip();
        this.get('boundingBox').addClass(CLASSES.fadeIn).setAttribute('aria-hidden', 'false');
        node.setAttribute('aria-describedby', this.get('boundingBox').getAttribute('id'));
    },
    
    _showTooltip: function () {
        this.set('visible', true);
    },

    hideTooltip : function () {
        this.get('boundingBox').removeClass(CLASSES.fadeIn).setAttrs({
            'aria-hidden': 'true',
            //clear out all inline styles
            'styles': ''
        });
        this._hideTooltip();
    },
    
    _hideTooltip: function () {
        this.set('visible', false);
    },

    _setTooltipContent: function (node) {

        var content = (node.hasAttribute(DATA_CONTENT)) ? node.getAttribute(DATA_CONTENT) : this.get('content'),
            contentBox = this.get('contentBox');

        contentBox.setHTML(content);
    },
    
    _alignTooltip : function (node) {
        var placement = (node.hasAttribute(DATA_PLACEMENT)) ? node.getAttribute(DATA_PLACEMENT) : this.get('placement');

        switch (placement) {
            case "above":
                this.align(node, ["bc", "tc"]);
                break;
            case "left":
                this.align(node, ["rc", "lc"]);
                break;
            case "below":
                this.align(node, ["tc", "bc"]);
                break;
            case "right":
                this.align(node, ["lc", "rc"]);
                break;
            default:
                break;
        }            
    }
},
{
    NS : "tipsy",

    ATTRS : {
        content : { 
            value : ''
        },

        selector: {
            value: null
        },

        zIndex: {
            value: 2
        },

        showOn: {
            value: ['mouseover', 'touchstart', 'focus']
        },

        hideOn: {
            value: ['mouseout', 'touchend', 'blur']
        },
        
        delegate: {
            value: null,
            setter: function(val) {
                return Y.one(val) || Y.one("document");
            }
        }
    }
});


}, 'gallery-2013.03.27-22-06', {
    "requires": [
        "yui-base",
        "widget",
        "widget-position-align",
        "gallery-widget-pointer",
        "widget-stack",
        "classnamemanager"
    ],
    "skinnable": true
});
