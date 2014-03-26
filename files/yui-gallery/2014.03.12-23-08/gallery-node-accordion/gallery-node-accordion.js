YUI.add('gallery-node-accordion', function(Y) {

/**
* <p>The Accordion Node Plugin makes it easy to transform existing 
* markup into an accordion element with expandable and collapsable elements, 
* elements are  easy to customize, and only require a small set of dependencies.</p>
* 
* 
* <p>To use the Accordion Node Plugin, simply pass a reference to the plugin to a 
* Node instance's <code>plug</code> method.</p>
* 
* <p>
* <code>
* &#60;script type="text/javascript"&#62; <br>
* <br>
*       //  Call the "use" method, passing in "gallery-node-accordion".  This will <br>
*       //  load the script and CSS for the Accordion Node Plugin and all of <br>
*       //  the required dependencies. <br>
* <br>
*       YUI().use("gallery-node-accordion", function(Y) { <br>
* <br>
*           //  Use the "contentready" event to initialize the accordion when <br>
*           //  the element that represente the accordion <br>
*           //  (&#60;div id="accordion-1"&#62;) is ready to be scripted. <br>
* <br>
*           Y.on("contentready", function () { <br>
* <br>
*               //  The scope of the callback will be a Node instance <br>
*               //  representing the accordion (&#60;div id="accordion-1"&#62;). <br>
*               //  Therefore, since "this" represents a Node instance, it <br>
*               //  is possible to just call "this.plug" passing in a <br>
*               //  reference to the Accordion Node Plugin. <br>
* <br>
*               this.plug(Y.Plugin.NodeAccordion); <br>
* <br>
*           }, "#accordion-1"); <br>
* <br>      
*       }); <br>
* <br>  
*   &#60;/script&#62; <br>
* </code>
* </p>
*
* <p>The Accordion Node Plugin has several configuration properties that can be 
* set via an object literal that is passed as a second argument to a Node 
* instance's <code>plug</code> method.
* </p>
*
* <p>
* <code>
* &#60;script type="text/javascript"&#62; <br>
* <br>
*       //  Call the "use" method, passing in "gallery-node-accordion".  This will <br>
*       //  load the script and CSS for the Accordion Node Plugin and all of <br>
*       //  the required dependencies. <br>
* <br>
*       YUI().use("gallery-node-accordion", function(Y) { <br>
* <br>
*           //  Use the "contentready" event to initialize the accordion when <br>
*           //  the element that represente the accordion <br>
*           //  (&#60;div id="accordion-1"&#62;) is ready to be scripted. <br>
* <br>
*           Y.on("contentready", function () { <br>
* <br>
*               //  The scope of the callback will be a Node instance <br>
*               //  representing the accordion (&#60;div id="accordion-1"&#62;). <br>
*               //  Therefore, since "this" represents a Node instance, it <br>
*               //  is possible to just call "this.plug" passing in a <br>
*               //  reference to the Accordion Node Plugin. <br>
* <br>
*               this.plug(Y.Plugin.NodeAccordion, { anim: true, effect: Y.Easing.backIn });
* <br><br>
*           }, "#accordion-1"); <br>
* <br>      
*       }); <br>
* <br>  
*   &#60;/script&#62; <br>
* </code>
* </p>
* 
* @module gallery-node-accordion
*/

//  Util shortcuts

var getClassName = Y.ClassNameManager.getClassName,
    anims = {},
    WHEELS = {fast:0.1,slow:0.6,normal:0.4},

    //  Frequently used strings
    ACCORDION = "accordion",
    ACCORDIONITEM = "item",
    SCROLL_HEIGHT = "scrollHeight",
    SCROLL_WIDTH = "scrollWidth",
    WIDTH = "width",
    HEIGHT = "height",
    PX = "px",
    HOST = "host",

    //  Attribute keys
    ATTR_ORIENTATION = 'orientation',
    ATTR_FADE        = 'fade',
    ATTR_MULTIPLE    = 'multiple',
    ATTR_PERSISTENT  = 'persistent',
    ATTR_SPEED       = 'speed',
    ATTR_ANIM        = 'anim',
    ATTR_ITEMS       = 'items',
    ATTR_TRIGGER_SEL = 'triggerSelector',
    ATTR_ITEM_SEL    = 'itemSelector',
    ATTR_ITEM_BD_SEL = 'itemBodySelector',

    //  CSS class names
    CLASS_ACCORDION              = getClassName(ACCORDION),
    CLASS_ACCORDION_HIDDEN       = getClassName(ACCORDION, 'hidden'),
    CLASS_ACCORDION_ITEM         = getClassName(ACCORDION, ACCORDIONITEM),
    CLASS_ACTIVE                 = getClassName(ACCORDION, ACCORDIONITEM, "active"),
    CLASS_SLIDING                = getClassName(ACCORDION, ACCORDIONITEM, "sliding"),
    CLASS_ACCORDION_ITEM_HD      = getClassName(ACCORDION, ACCORDIONITEM, "hd"),
    CLASS_ACCORDION_ITEM_BD      = getClassName(ACCORDION, ACCORDIONITEM, "bd"),
    CLASS_BD_SLIDING             = getClassName(ACCORDION, ACCORDIONITEM, "bd", "sliding"),
    CLASS_ACCORDION_ITEM_FT      = getClassName(ACCORDION, ACCORDIONITEM, "ft"),
    CLASS_ACCORDION_ITEM_TRIGGER = getClassName(ACCORDION, ACCORDIONITEM, "trigger"),

    //  CSS selectors
    PERIOD = ".",
    FC = '>.',
    SC  = ' .',
    CS = ', ',
    DEFAULT_ITEM_SELECTOR    =  FC + CLASS_ACCORDION_ITEM,
    DEFAULT_ITEM_BD_SELECTOR = PERIOD + CLASS_ACCORDION_ITEM_BD,
    DEFAULT_TRIGGER_SELECTOR =  DEFAULT_ITEM_SELECTOR + PERIOD + CLASS_ACCORDION_ITEM_TRIGGER + CS +
                                DEFAULT_ITEM_SELECTOR + FC + PERIOD + CLASS_ACCORDION_ITEM_TRIGGER + CS +
                                DEFAULT_ITEM_SELECTOR + FC + CLASS_ACCORDION_ITEM_HD + SC + CLASS_ACCORDION_ITEM_TRIGGER + CS +
                                DEFAULT_ITEM_SELECTOR + FC + CLASS_ACCORDION_ITEM_FT + SC + CLASS_ACCORDION_ITEM_TRIGGER;

function _computeSize (n, s) {
    return n.get('region')[s];
}

/**
* The NodeAccordion class is a plugin for a Node instance.  The class is used via  
* the <a href="Node.html#method_plug"><code>plug</code></a> method of Node and 
* should not be instantiated directly.
* @namespace Y.Plugin
* @class NodeAccordion
*/

Y.namespace('Plugin').NodeAccordion = Y.Base.create("NodeAccordion", Y.Plugin.Base, [], {

    // Prototype Properties for NodeAccordion

    /** 
    * @property _root
    * @description Node instance representing the root node in the accordion.
    * @default null
    * @protected
    * @type Node
    */
    _root: null,
    
    _eventHandler: null,

    initializer: function (config) {
        var instance = this;
        if ((instance._root = instance.get(HOST))) {

            //  close all items and open the actived ones
            instance.get(ATTR_ITEMS).each(function(item) {
                if (item.hasClass(CLASS_ACTIVE)) {
                    instance.expandItem(item);
                } else {
                    instance.collapseItem(item);
                }
            });

            //  Wire up all event handlers
            instance._eventHandler = instance._root.delegate('click', function(e) {
                instance.toggleItem(e.currentTarget); // probably is better to pass the ancestor for the item
                e.target.blur();
                e.halt();
            }, instance.get(ATTR_TRIGGER_SEL));

            // removing the hidden class if exists, in case the accordion is hidden by default, 
            // and also adding the default accordion class just in case
            instance._root.replaceClass(CLASS_ACCORDION_HIDDEN, CLASS_ACCORDION);
        }
    },

    destructor: function () {
        var instance = this;
        if (instance._eventHandler) {
            instance._eventHandler.detach();
        }
        instance._eventHandler = null;
    },

    //  Protected methods

    /**
     * @method _slidingBegin
     * @description just adding the corresponding sliding classes.
     * @protected
     * @param {Node} item Item Node reference
     * @param {Node} bd Item Body Node reference
     * @param {boolean} active whether or not we should also add the active class
     */
    _slidingBegin: function(item, bd, active) {
        item.addClass(CLASS_SLIDING);
        bd.addClass(CLASS_BD_SLIDING);
        if (active) {
            item.addClass(CLASS_ACTIVE);
        }
    },

    /**
     * @method _slidingEnd
     * @description just removing the corresponding sliding classes.
     * @protected
     * @param {Node} item Item Node reference
     * @param {Node} bd Item Body Node reference
     * @param {boolean} active whether or not we should also remove the active class
     */
    _slidingEnd: function(item, bd, active) {
        item.removeClass(CLASS_SLIDING);
        bd.removeClass(CLASS_BD_SLIDING);
        if (active) {
            item.removeClass(CLASS_ACTIVE);
        }
    },

    /**
     * @method _getItemBody
     * @description Searching for the body of an item based on an item node reference or an index order.
     * @protected
     * @param {Node|Number} node Item Node reference or Item index.
     * @return {Node} The matching DOM node or null if none found.
     */
    _getItemBody: function(node) {
        var bd, sel = this.get(ATTR_ITEM_BD_SEL);
        if (Y.Lang.isNumber(node)) {
            node = this.get(ATTR_ITEMS).item(node); 
        }
        // getting the child element with bd class
        bd = node.one(sel);
        if (!bd) {
            node = node.next();
            // the bd element is not a child element, it might be the next child element
            bd = ( (node && node.test(sel)) ? node : null );
            // this is needed to support a more semantic markup, like this one:
            /*
                <dl id="myaccordion3" class="yui3-accordion">
                    <dt class="yui3-accordion-item yui3-accordion-item-trigger">option 1</dt>
                    <dd class="yui3-accordion-item-bd" id="bd5">content here...</dd>
                    <dt class="yui3-accordion-item yui3-accordion-item-trigger">option 2</dt>
                    <dd class="yui3-accordion-item-bd" id="bd6">content here...</dd>
                </dl>
            */
        }
        return bd;
    },

    /**
     * @method _getItem
     * @description Searching for an item based on a node reference or an index order.
     * @protected
     * @param {Node|Number} node Node reference or Node index.
     * @return {Node} The matching DOM node or null if none found.
     */
    _getItem: function(node) {
        if (Y.Lang.isNumber(node)) {
            node = this.get(ATTR_ITEMS).item(node);
        }
        var fn = function(n) {
            return n.hasClass(CLASS_ACCORDION_ITEM);
        };
        if (node && !node.hasClass(CLASS_ACCORDION_ITEM)) {
            return node.ancestor( fn );
        }
        return node;
    },  
    
    /**
     * @method _animate
     * @description Using Y.Anim to expand or collapse an item.
     * @protected
     * @param {String} id Global Unique ID for the animation.
     * @param {Object} conf Configuration object for the animation.
     * @param {Function} fn callback function that should be executed after the end of the anim.
     * @return {Object} Animation handler.
     */
    _animate: function(id, conf, fn) {
        var anim = anims[id], 
            instance = this;
        // if the animation is underway: we need to stop it...
        if ((anim) && (anim.get ('running'))) {
            anim.stop();
        }
        if (Y.Lang.isFunction(instance.get(ATTR_ANIM))) {
            conf.easing = instance.get(ATTR_ANIM);
        }
        anim = new Y.Anim(conf);
        anim.on('end', fn, instance);
        anim.run();
        anims[id] = anim;
        return anim;
    },
        
    /**
    * @method _openItem
    * @description Open an item.
    * @protected
    * @param {Node} item Node instance representing an item.
    */
    _openItem: function (item) {
        var instance = this, 
            bd, 
            id, 
            fn, 
            fs,
            i,
            list = instance.get(ATTR_ITEMS),
            o = instance.get (ATTR_ORIENTATION),
            conf = {
                duration: instance.get(ATTR_SPEED),
                to: {
                    scroll: []
                }
            },
            mirror, mirror_bd;
        // if the item is not already opened
        if (item && list.size() && !item.hasClass(CLASS_ACTIVE) && (bd = instance._getItemBody(item)) && (id = Y.stamp(bd))) {
            // closing all the selected items if neccesary
            if (!instance.get(ATTR_MULTIPLE)) {
                //  close all items and open the actived ones
                mirror = instance._root.one(FC+CLASS_ACTIVE);
            }
            // opening the selected element, based on the orientation, timer and anim attributes...
            conf.to[o] = (o==WIDTH?bd.get(SCROLL_WIDTH):bd.get(SCROLL_HEIGHT)); 
            conf.node = bd;
            instance._slidingBegin(item, bd, true);
            fn = function() {
                instance._slidingEnd(item, bd);
                // TODO: broadcasting the corresponding event (close)...
            };
            if (!instance.get(ATTR_ANIM)) {
                // animation manually
                // getting the desired dimension from the current item
                fs = _computeSize(bd, o);
                // override the desired dimension from the mirror if exists
                if (mirror && (mirror_bd = instance._getItemBody(mirror))) {
                    fs = _computeSize(mirror_bd, o);
                    instance._slidingBegin(mirror, mirror_bd);
                }
                for (i=1;i<=conf.to[o];i++){
                    if (mirror && mirror_bd) {
                      mirror_bd.setStyle (o, (fs-i)+PX);
                    }
                    bd.setStyle (o, i+PX);
                }
                if (mirror && mirror_bd) {
                    instance._slidingEnd(mirror, mirror_bd, true);
                }
                fn();
            } else {
                // scrolling effect
                conf.to.scroll = [0,0];
                // appliying fadeIn
                if (instance.get(ATTR_FADE)) { 
                  conf.to.opacity = 1;
                }
                if (Y.Lang.isObject(mirror)) {
                    instance._closeItem(mirror);
                }
                instance._animate(id, conf, fn);
            }
        }
    },

    /**
    * @method _closeItem 
    * @description Closes the specified item.
    * @protected
    * @param {Node} item Node instance representing an item.
    */
    _closeItem: function (item) {

        var instance = this, 
            bd, 
            id, 
            fn, 
            fs,
            i,
            list = instance.get(ATTR_ITEMS),
            o = instance.get (ATTR_ORIENTATION),
            conf = {
                duration: instance.get(ATTR_SPEED), 
                to: {
                    scroll: []
                }
            };
        if (item && list.size() && (bd = instance._getItemBody(item)) && (id = Y.stamp(bd))) {
            // closing the item, based on the orientation, timer and anim attributes...
            conf.to[o] = (o==HEIGHT?instance.get('minHeight'):instance.get('minWidth'));
            conf.node = bd;
            instance._slidingBegin(item, bd);
            fn = function() {
                instance._slidingEnd(item, bd, true);
                // todo: broadcasting the corresponding event (close)...
            };
            if (!instance.get(ATTR_ANIM)) {
                // animation manually
                fs = _computeSize(bd, o);
                for (i=fs;i>=conf.to[o];i--){
                    bd.setStyle (o, i+PX);
                }
                fn();
            } else {
                // scrolling effect
                conf.to.scroll = (o==WIDTH?[bd.get(SCROLL_WIDTH),0]:[0,bd.get(SCROLL_HEIGHT)]);
                // appliying fadeIn
                if (instance.get(ATTR_FADE)) { 
                    conf.to.opacity = 0;
                }
                instance._animate(id, conf, fn);
            }
        }
        
    },

    //  Public methods

    //  Generic DOM Event handlers
    /**
    * @method expandAllItems
    * @description Expanding all items.
    * @public
    * @return {object} Plugin reference for chaining
    */
    expandAllItems: function () {
        var instance = this;
        if (instance.get(ATTR_MULTIPLE)) {
            instance.get(ATTR_ITEMS).each(function (node) {
                instance.expandItem(node);
            });
        }
        return instance;
    },
    
    /**
    * @method collapseAllItems
    * @description Collapsing all items.
    * @public
    * @return {object} Plugin reference for chaining
    */
    collapseAllItems: function () {
        var instance = this;
        if (instance.get(ATTR_MULTIPLE) || !instance.get(ATTR_PERSISTENT)) {
            instance.get(ATTR_ITEMS).each(function (node) {
                instance.collapseItem(node);
            });
        }
        return instance;
    },
    
    /**
    * @method expandItem
    * @description Expand a certain item.
    * @public
    * @param {Node} node Node reference
    * @return {object} Plugin reference for chaining
    */
    expandItem: function ( node ) {
        var instance = this,
            item = instance._getItem(node);
        if (item) {
            instance._openItem (item);
        }
        return instance;
    },
    
    /**
    * @method collapseItem
    * @description Collapse a certain item.
    * @public
    * @param {Node} node Node reference
    * @return {object} Plugin reference for chaining
    */
    collapseItem: function ( node ) {
        var instance = this,
            item = instance._getItem(node);
        if (item && item.hasClass(CLASS_ACTIVE) && (instance.get(ATTR_MULTIPLE) || !instance.get(ATTR_PERSISTENT))) {
            instance._closeItem(item);
        }
        return instance;
    },
    
    /**
    * @method toggleItem
    * @description toggle a certain item.
    * @public
    * @param {object} node Node reference
    * @return {object} Plugin reference for chaining
    */
    toggleItem: function ( node ) {
        var instance = this,
            item = instance._getItem(node);
        if (item) {
            // if the item is already opened, and is multiple and not persistent
            if (item.hasClass(CLASS_ACTIVE) && (instance.get(ATTR_MULTIPLE) || !instance.get(ATTR_PERSISTENT))) {
                instance._closeItem (item);
            } else {
                instance._openItem (item);
            }
        }
        return instance;
    }

}, {

    // Static Properties for NodeAccordion
    
    NS: ACCORDION,
    
    /**
     * @property DynamicForm.ATTRS
     * @type Object
     * @static
     */
    ATTRS : {
    
        /**
        * Nodes representing the list of active items.
        *
        * @attribute activeItems
        * @readOnly
        * @type Y.NodeList
        */
        activeItems: {
            readOnly: true,
            getter: function (value) {
                return this._root.all(FC+CLASS_ACTIVE);
            }
        },
    
        /**
        * Nodes representing the list of items.
        *
        * @attribute items
        * @readOnly
        * @type Y.NodeList
        */
        items: {
            readOnly: true,
            getter: function (value) {
                return this._root.all(this.get(ATTR_ITEM_SEL));
            }
        },
        
        /**
        * orientation defines if the accordion will use width or height to expand and collapse items.
        *
        * @attribute orientation
        * @writeOnce
        * @default height
        * @type string
        */
        orientation: {
            value: HEIGHT,
            writeOnce: true
        },
    
        /**
        * Boolean indicating that animation should include opacity to fade in/out the content of the item.
        *
        * @attribute fade
        * @default false
        * @type boolean
        */  
        fade: {
            value: false
        },
    
        /**
        * Boolean indicating that Y.Anim should be used to expand and collapse items.
        * It also supports a function with an specific effect.
        * <p>
        * <code>
        * &#60;script type="text/javascript"&#62; <br>
        * <br>
        *       //  Call the "use" method, passing in "anim" and "gallery-node-accordion". <br>
        * <br>
        *       YUI().use("anim", "gallery-node-accordion", function(Y) { <br>
        * <br>
        *           Y.one("#myaccordion").plug(Y.Plugin.NodeAccordion, {<br>
        *               anim: Y.Easing.backIn<br>
        *           }); <br>
        * <br>  
        *   &#60;/script&#62; <br>
        * </code>
        * </p>
        * 
        * @attribute anim
        * @default false
        * @type {boolean|function}
        */
    
        anim: {
            value: false,
            validator : function (v) {
                return !Y.Lang.isUndefined(Y.Anim);
            }
        },
    
        /**
        * Boolean indicating that more than one item can be opened at the same time.
        *
        * @attribute multiple
        * @default true
        * @type boolean
        */
        multiple: {
            value: true
        },
    
        /**
        * Boolean indicating that one of the items should be open at any given time.
        *
        * @attribute persistent
        * @default false
        * @type boolean
        */  
        persistent: {
            value: false
        },
    
        /**
        * Numeric value indicating the speed in mili-seconds for the animation process.
        * Also support three predefined strings in lowercase:
        * <ol>
        * <li>fast = 0.1</li>
        * <li>normal = 0.4</li>
        * <li>slow = 0.6</li>
        * </ol>
        * 
        * @attribute speed
        * @default 0.4
        * @type numeric
        */  
        speed: {
            value: 0.4,
            validator : function (v) {
                return (Y.Lang.isNumber(v) || (Y.Lang.isString(v) && WHEELS.hasOwnProperty(v)));
            },
            setter : function (v) {
                return (WHEELS.hasOwnProperty(v)?WHEELS[v]:v);
            }
        },

        /**
        * Selector used in the delegate statement to identify trigger elements within the accordion markup. 
        * A trigger element is a DOM element that can be clicked to expand/collapse an individual pane in the accordion.
        * This selector is relative to the plugin HOST and NOT relative to the itemSelector due the fact that the 
        * itemSelector itself could pontencially be the trigger as well.
        * @attribute triggerSelector
        * @initOnly
        * @value .yui3-accordion-item.yui3-accordion-item-trigger, .yui3-accordion-item>.yui3-accordion-item-trigger, .yui3-accordion-item>.yui3-accordion-item-hd .yui3-accordion-item-trigger, .yui3-accordion-item>.yui3-accordion-item-ft .yui3-accordion-item-trigger
        * @type string
        */  
        triggerSelector: {
            initOnly: true,
            value: DEFAULT_TRIGGER_SELECTOR
        },

        /**
        * Selector used to identify items within the according markup.
        * An item represents a pane in the accordion.
        * This selector is relative to the plugin HOST.
        * @attribute itemSelector
        * @initOnly
        * @value .yui3-accordion-item
        * @type string
        */  
        itemSelector: {
            initOnly: true,
            value: DEFAULT_ITEM_SELECTOR
        },

        /**
        * Selector used to identify the body of an item within the according markup.
        * The body represents the element that will be animated. This selector is relative
        * to the itemSelector attribute. In can also represent the DOM element next to the
        * itemSelector match in case you want to use tables or DD/DT/DL markup structures.
        * @attribute itemBodySelector
        * @initOnly
        * @value .yui3-accordion-item-bd
        * @type string
        */
        itemBodySelector: {
            initOnly: true,
            value: DEFAULT_ITEM_BD_SELECTOR
        },

        /**
        * You can specify what will be the height of the element when collapse (only for vertical accordions).
        * Sometimes forcing the height to 0 breaks the layout in IE6. This depends on the mode.
        * @attribute minHeight
        * @initOnly
        * @value 0
        * @type number
        */
        minHeight: {
            value: 0
        },

        /**
        * You can specify what will be the width of the element when collapse (only for horizontal accordions).
        * @attribute minWidth
        * @initOnly
        * @value 0
        * @type number
        */
        minWidth: {
            value: 0
        }

    }

});


}, 'gallery-2011.03.02-20-58' ,{skinnable:true, optional:['anim'], requires:['node-base', 'node-style', 'plugin', 'base', 'node-event-delegate', 'classnamemanager']});
