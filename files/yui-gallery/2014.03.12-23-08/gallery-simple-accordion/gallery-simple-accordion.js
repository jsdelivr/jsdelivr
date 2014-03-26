YUI.add('gallery-simple-accordion', function(Y) {

/**
 *  Simple accordion using an html list
 *  
 *  @author alejandro soto
 *  
 */
YUI.add('gallery-simple-accordion', function (Y) {

    function SimpleAccordion(config) {
        SimpleAccordion.superclass.constructor.apply(this, arguments);
    }

    SimpleAccordion.NAME = 'simple-accordion';

    SimpleAccordion.ATTRS = {};

    Y.extend(SimpleAccordion, Y.Base, {
        
        config: null,
        
        _ACCORDION_ITEM: '.accordion-item',
        _ACCORDION_ITEM_LINK: '.accordion-item-link',
        _ACCORDION_ITEM_CONTENT: '.accordion-item-content',
        _HIDE: 'hide',
        _SHOW: 'show',
        _SELECTED: 'selected',
        
        /**
         * This constructor method initializes the object and start rendering the carousel
         * 
         * @param cfg Module external configuration
         */
        initializer: function (cfg) {
            this.config = cfg;
            this._initializesItemClicked();
        },
        
        /**
         * Initializes the carousel
         * 
         */
        _initializesItemClicked: function() {
            var cfg = this.config;
            var me = this;
            if (me.hasItems()) {
                cfg.mainNode.delegate('click', function(e) {
                    e.preventDefault();
                    me._deselectAllItems();
                    var li = e.target.get('parentNode');
                    var itemContent = li.one(me._ACCORDION_ITEM_CONTENT);
                    li.addClass(me._SELECTED);
                    if (itemContent) {
                        itemContent.removeClass(me._HIDE);
                        itemContent.addClass(me._SHOW);
                    }
                    console.info('event clicked');
                }, me._ACCORDION_ITEM_LINK);
            }
        },
        
        /**
         * Deselects all the items in the list
         * 
         */
        _deselectAllItems: function() {
            var cfg = this.config;
            cfg.mainNode.all(this._ACCORDION_ITEM).removeClass(this._SELECTED);
            cfg.mainNode.all(this._ACCORDION_ITEM_CONTENT).removeClass(this._SHOW);
            cfg.mainNode.all(this._ACCORDION_ITEM_CONTENT).addClass(this._HIDE);
        },
        
        /**
         * Validates if the list has items
         * 
         */
        hasItems: function () {
            var cfg = this.config;
            return cfg.mainNode && cfg.mainNode.all(this._ACCORDION_ITEM_LINK).size() > 0;
        },
        
        /**
         * Destructor
         * 
         */
        destructor: function () {
        
        }
    });

    Y.SimpleAccordion = SimpleAccordion;
}, '0.0.1', {
    requires: ['base', 'node', 'node-event-delegate']
});


}, 'gallery-2012.09.26-20-36' ,{requires:['base','node','node-event-delegate'], skinnable:true});
