YUI.add('gallery-nav-assist', function (Y, NAME) {

/*jslint nomen:true, indent: 4, regexp: true, white: true, sloppy: true */

    /**
     * @module gallery-nav-assist
     * @main gallery-nav-assist
     * @requires node, event, event-key, gallery-event-nav-keys, base, anim
     * @description Provides easy and custom navigation across various dom elements using keyboard.
     * shift + d : disables navigation assist
     * shift + e : enables navigation assist
     * shift + arrow: moves across different containers registered (nodes in the registry)
     * arrow down, arrow up, arrow right, arrow left:  moves across different elements within a container
     */

    //-- CONSTANTS ------------------------------------------------------------
    var NAVASSIST = Y.namespace('Navigation-Assistant'),

        SHIFT_RIGHT_ARROW = 'down:39+shift',

        SHIFT_LEFT_ARROW = 'down:37+shift',

        KEY_TO_DISABLE_NAVIGATION = 'down:68+shift',

        KEY_TO_ENABLE_NAVIGATION = 'down:69+shift',

        KEYCODE_FOR_ESC = 'down:27',

        KEYCODE_FOR_SHIFT = 16,

        KEYCODE_FOR_SPECIAL_KEY = KEYCODE_FOR_SHIFT,

        KEYCODE_FOR_ARROW_RIGHT = 39,

        KEYCODE_FOR_ARROW_LEFT = 37,

        KEYCODE_FOR_ARROW_UP = 38,

        KEYCODE_FOR_ARROW_DOWN = 40,

        NEXT_CHILD_PARAM = 'next',

        BASE_KEY_EVENT = 'keydown',

        _NEXT = true,

        _PREV = false,

        CLASS_DEFAULT_CHILD_HIGHLIGHT = 'default-child-highlight',

        NAV_POINTER = '&#182;',//translates to ¶, a symbol to recognize that focus is on a certain child element

        CLASS_NAV_POINTER = 'nav-pointer', //pointer on child element highligted

        CLASS_DEFAULT_CONTAINER_HIGHLIGHT = 'default-container-highlight',

        DEFAULT_SMOOTH_SCROLL = false,

        DEFAULT_NAV_POINTER = false,

        DEFAULT_STYLE_CONTAINER = false,

        DURATION_OF_SMOOTHSCROLL = 0.3,

        ANIMTYPE_FOR_SMOOTHSCROLL = Y.Easing.easeIn;

    NAVASSIST = function () {
        NAVASSIST.superclass.constructor.apply(this, arguments);
    };

    /**
     * @property NAME
     * @type String
     * @default Navigation Assistant
     */
    NAVASSIST.NAME = 'Navigation Assistant';

    /**
     * @property ATTRS
     * @type {Object}
     * Defines the set of attributes
     * added by this class. The name of the attribute is the key,
     * and the object literal value acts as the configuration
     * object passed to addAttrs
     */
    NAVASSIST.ATTRS = {

        /**
         * Holds the index value of the container currently active in registry
         * @attribute activeRegistryIndex
         * @type integer
         * @default null
         */
        activeRegistryIndex: {
            value: null
        },

        /**
         * Holds an array of objects, which holds information about a container eg: {node:String, isHorizontal: Boolean, rank: Integer}
         * @attribute registry
         * @type Array
         * @default []
         */
        registry: {
            value: []
        },

        /**
         * when set to true in the config will splash information about which container is active
         * @attribute debug
         * @optional
         * @type Boolean
         * @default null
         */
        debug: {
            value: null
        },

        /**
         * when set to true in the config will style the container with a default style (when the container gets selected)
         * @attribute styleContainer
         * @type Boolean
         * @default false
         */
        styleContainer: {
            value: DEFAULT_STYLE_CONTAINER
        },

        /**
         * when set to true in the config will scroll to the container which is selected in a smooth scroll animation
         * @attribute scrollAnim
         * @type Boolean
         * @default false
         */
        scrollAnim: {
            value: DEFAULT_SMOOTH_SCROLL
        },

        /**
         * when set to true in the config will add a marker ¶ to child element recognize that focus is on a certain child element
         * @attribute navPointer
         * @type Boolean
         * @default false
         */
        navPointer: {
            value: DEFAULT_NAV_POINTER
        },

        /**
         * Array containing a string of selectors indicating the dom elements if are selected by nav assist
         * have to disable nav-assist events for eg: ignore: ['#inputsearchbox'], will disable arrow-right event when this is selected
         * @attribute ignore
         * @type Array
         * @default null
         */
        ignore: {
            value: null
        }
    };
    /**
     * @class NAVASSIST
     * @extends Base
     */
    Y.NAVASSIST = Y.extend(NAVASSIST, Y.Base, {
        /**
         * @property container
         * @type {Object}
         * @default "{
            node: null,
            containerId: null,
            children: [],
            childIndexInFocus: -1,
            activeLink: null,
            isHorizontal: false,
            pullToTop: false
         }"
         * centralized approach where this container object is the source of truth and is the only thing that is activated.
         * Container Object with:
         * - navigable container id: string
         * - children[]: Node-Array that has all the child nodes of the navigable container
         * - childIndexInFocus: Integer, that indicates the current index selected for the navigable container.
         */
        container: {

            node: null,
            /*DOM elem*/

            containerId: null,
            /*String*/

            children: [],
            /*array type*/

            childIndexInFocus: -1,
            /* if there are 10 div elements in navigable container then this variable holds the index of the one in focus*/

            activeLink: null,
            /*holds the current link within a child of the container which is receiving focus*/

            isHorizontal: false,
            /*mode of alignment of the children: horizontal , or by default it is vertical*/

            pullToTop: false
            /*meant for slideshow kind of containers where you want child elements to scroll to top than being centered*/
        },

        /**
         * @private
         * @method initializer
         * @description Tasks MyClass needs to perform during
         * the init() lifecycle phase
         * Function for initialization, it default registers the node provided
         * in the constructor, during object creation.
         */
        initializer: function () {
            var self = this,
                i = 0,
                igNode,
                ignoreList; // list of div ids and class which on getting focus should disable navigation for eg: searchbox

            this.reorderRegistryByRank();
            this.activateContainerNavigation();

            Y.one('body').on('key', function () {
                self.disableAllNavigation();
            }, KEY_TO_DISABLE_NAVIGATION);

            Y.one('body').on('key', function () {
                self.enableAllNavigation();
            }, KEY_TO_ENABLE_NAVIGATION);

            Y.one('body').on('key', function () {
                //remove focus and give back native behaviour on pressing esc
                self.deactivateRegisteredContainer();
            }, KEYCODE_FOR_ESC);

            // Deactivate navigation for all the nodes under ignore

            function deact() {
                self.deactivateRegisteredContainer();
            }

            if (this.get('ignore')) {
                ignoreList = this.get('ignore');
                if (Y.Lang.isArray(ignoreList)) {
                    for (i = 0; i < ignoreList.length; i += 1) {
                        igNode = Y.one(ignoreList[i]);
                        if (igNode) {
                            igNode.on('focus', deact);
                        }
                    }
                }
            }
        },

        /**
         * @Description Function that enables all navigation on the page using keyboard
         * @method enableAllNavigation
         * @protected
         */
        enableAllNavigation: function () {
            this.activateContainerNavigation();
            this.makeNextContainerNavigable(_NEXT);
        },

        /**
         * @Description Function that disables all navigation on the page using keyboard
         * @method disableAllNavigation
         * @protected
         */
        disableAllNavigation: function () {
            this.deactivateRegisteredContainer(); //will also disable child events
            this.deactivateContainerNavigation();
        },

        /**
         * @Description Function that will register a new container-node to the registry
         * @method register
         * @chainable
         * @public
         * @return {Self}
         * @param {Object} [config] config for node being registered eg:{node:string,rank:integer,isHorizontal:boolean}
              @param {String} [config.node] The selector string (can be an id) to find the node on the dom
              @param {Integer} [config.rank] The Rank that specifies the order of container selection
              @param {Boolean} [config.isHorizontal] that specifies if the container has child elements horizontally aligned
         */
        register: function (config) {

            var regEntry = config || {},
                node = regEntry.node,
                registry = this.get('registry');

            if (Y.one(node)) {
                registry[registry.length] = regEntry;
                this.reorderRegistryByRank();
            }
            return this;
        },

        /**
         * Function that will remove an entry from the registry containing registered containers for navigation
         * @method deRegister
         * @chainable
         * @public
         * @param {Object} [config] config contains the object with node and the {node: '#id'}  '#id' can also be a css selector
         *      @param {String} [config.node] The selector string (can be an id) to find the node on the dom
         * @return {Self}
         */
        deRegister: function (config) {

            var regEntry = config || {},
                nodeId = regEntry.node,
                registry = this.get('registry'),
                node = Y.one(nodeId),
                index = null;

            if (node) {
                index = this.isNodeInRegistry(nodeId);
                //index can be 0 so don make a boolean check
                if (index !== null) {
                    registry.splice(index, 1);
                    this.reorderRegistryByRank();
                }
            }
            return this;
        },

        /**
         * Function that will return the index of the registry item if the nodeId exists in the registry
         * @method isNodeInRegistry
         * @protected
         * @param {String} Selector String that was used to register a container node
         * @return {String} index of the node id in the registry if nodeId exists inside registry else returns null if not found in registry
         */
        isNodeInRegistry: function (nodeId) {
            var i = 0,
                registry = this.get('registry'),
                len = registry.length;

            for (i = 0; i < len; i += 1) {
                if (nodeId === registry[i].node) {
                    return i;
                }
            }
            return null;
        },

        /**
         * Function that will reorder  and updates the registry by Rank provided with the node
         * @method reorderRegistryByRank
         * @protected
         */
        reorderRegistryByRank: function () {

            var registry = this.get('registry'),
                len = registry.length,
                newregistry = [],
                rank,
                j,
                i;


            for (i = 0; i < len; i += 1) {
                newregistry[i] = null;
                if (registry[i].rank === undefined) {
                    registry[i].rank = null;
                }
            }

            for (i = 0; i < len; i += 1) {
                rank = registry[i].rank;
                if (rank && rank > 0 && rank <= len) {
                    if (newregistry[rank - 1] !== null) {
                        registry[i].rank = null;
                    } else {
                        newregistry[rank - 1] = registry[i];
                    }
                }
            }

            j = 0;

            for (i = 0; i < len; i += 1) {
                rank = registry[i].rank;
                if (rank === null || rank <= 0 || rank > len) {
                    while (newregistry[j] !== null) {
                        j += 1;
                    }
                    newregistry[j] = registry[i];
                    newregistry[j].rank = j + 1; //update the null or invalid rank now
                }
            }

            this.set('registry', newregistry);
        },

        /**
         * Function that enables navigation on certain key-combination press
         * @method activateContainerNavigation
         * @protected
         */
        activateContainerNavigation: function () {

            var self = this,
                parent = Y.one('body');

            if (Y.ContainerSubscr) {
                this.deactivateContainerNavigation();
            }

            Y.ContainerSubscr = {};

            // Register Shift + right arrow key navigation
            Y.ContainerSubscr.next = parent.on('key', function () {
                self.makeNextContainerNavigable(_NEXT);
            }, SHIFT_RIGHT_ARROW);

            // Register Shift + left arrow key navigation
            Y.ContainerSubscr.prev = parent.on('key', function () {
                self.makeNextContainerNavigable(_PREV);
            }, SHIFT_LEFT_ARROW);

            // Update special key strokes on down and up
            parent.on('keyup', function (e) {
                if (e.charCode === KEYCODE_FOR_SPECIAL_KEY) {
                   self._specialKeyDown = false;
                }
            });

            parent.on('keydown', function (e) {
                if (e.charCode === KEYCODE_FOR_SPECIAL_KEY) {
                   self._specialKeyDown = true;
                }
            });
        },

        /**
         * Function that detaches all subscriptions for moving across containers
         * @method deactivateContainerNavigation
         * @protected
         */
        deactivateContainerNavigation: function () {
            var subscription,
                ContainerSubscr = Y.ContainerSubscr;

            if (ContainerSubscr) {
                for (subscription in ContainerSubscr) {
                    if (ContainerSubscr.hasOwnProperty(subscription)) {
                        ContainerSubscr[subscription].detach();
                    }
                }
                delete Y.ContainerSubscr;
            }

            this.set('activeRegistryIndex', null);
        },

        /**
         * Function that chooses the next registered container makes it navigable
         * @method makeNextContainerNavigable
         * @protected
         * @param {Boolean} shiftRight (true: get next container, false: get previous container)
         * Note: this is a single function used to navigate left and right depending on the boolean @param 1
         */
        makeNextContainerNavigable: function (shiftRight) {
            var registry = this.get('registry'),
                index,
                node,
                containerClass,
                elementClass,
                isHorizontal = false,
                pullToTop = false;

            if (registry.length > 0) {
                index = this.getNextRegistryIndex(shiftRight);

                if (index !== null && registry[index]) {
                    node = Y.one(registry[index].node);

                    if (node) {
                        isHorizontal = registry[index].isHorizontal || false;
                        pullToTop = registry[index].pullToTop || false;
                        containerClass = CLASS_DEFAULT_CONTAINER_HIGHLIGHT;
                        elementClass = CLASS_DEFAULT_CHILD_HIGHLIGHT;

                        if (registry[index].containerStyle) {
                            containerClass = registry[index].containerStyle.className || CLASS_DEFAULT_CONTAINER_HIGHLIGHT;
                        }

                        if (registry[index].elemStyle) {
                            elementClass = registry[index].elemStyle.className || CLASS_DEFAULT_CHILD_HIGHLIGHT;
                        }

                        this.deactivateRegisteredContainer();
                        this.registerContainer(node, (index + 1), isHorizontal, pullToTop, containerClass, elementClass);
                        //+1 , since rank starts from 1 to length of registry
                        this.initiateNavigation();
                    } else {
                        this.deactivateRegisteredContainer();
                    }
                }
            }
        },

        /**
         * Function that chooses the next or previous registered container index to be made navigable from registry
         * @method getNextRegistryIndex
         * @protected
         * @param {Boolean} isRightKeyPressed (true: get next container index, false: get previous container index)
         * @return {integer} valid registered container index
         */
        getNextRegistryIndex: function (isRightKeyPressed) {
            var registry = this.get('registry'),
                regLen,
                regIndex = null,
                i = 0;

            if (registry && registry.length > 0) { // if no registry exists then nothing was registered
                for (i = 0; i < registry.length; i += 1) {
                    regLen = registry.length;
                    regIndex = this.get('activeRegistryIndex');

                    if (regIndex === null) { // case when we start first time
                        regIndex = 0;
                    } else {
                        regIndex = isRightKeyPressed ? (regIndex + 1) : (regIndex - 1);

                        if (regIndex >= regLen) {
                            regIndex = 0;
                        }

                        if (regIndex < 0) {
                            regIndex = regLen - 1;
                        }
                    }

                    this.set('activeRegistryIndex', regIndex);

                    if (Y.one(registry[regIndex].node)) { //node is fine
                        return regIndex;
                    }
                }

                return regIndex;
            }

            return null;
        },

        /**
         * Function to update the Class's container object with the children of current container/node being registered.
         * @method registerContainer
         * @protected
         * @param {Object} node (Container to be scanned for its children )
         * @param {Integer} rank [1 -  maxlenofregistry] signifies priority for containers to be selected
         * @param {Boolean} isHorizontal : if true then container is rendered horizontally else otherwise
         * @param {Boolean} pullToTop: if true then the child will not be centered instead pulled to the top of the page.
         * @param {String} containerStyle custom class name for styling the container on being selected
         * @param {String} elemStyle custom class name for styling the child element of the container on being selected
         */
        registerContainer: function (node, rank, isHorizontal, pullToTop, containerStyle, elemStyle) {
            if (node) {
                this.updateChildren(node, rank, isHorizontal, pullToTop, containerStyle, elemStyle);
                //will update node-container.children as array
            }
        },

        /**
        * @method updateChildren
        * @protected
        * @param {Object} node  String representing the navigable containers id.
        * @param {integer} rank [1-maxlenofregistry] signifies priority for containers to be selected
        * @param {Boolean}  isHorizontal: if true then container is rendered horizontally else otherwise
        * @param {Boolean} pullToTop if true then the child will not be centered instead pulled to the top of the page.
        * @param {String} containerStyle custom class name for styling the container on being selected
        * @param {String} elemStyle custom class name for styling the child element of the container on being selected
        * register the container that needs navigation
        * updates the container-object:
        *   - gets all the children of the @param node, and puts them in an array.
        *   - updates the container id if it has one else generates a dummy one.
        */
        updateChildren: function (node, rank, isHorizontal, pullToTop, containerStyle, elemStyle) {
            var childrenObj = node.all('> *'),
                children = [],
                container = this.container;

            childrenObj.each(function (child, i) {
                children[i] = child;
            });

            container.isHorizontal = isHorizontal || false;
            container.pullToTop = pullToTop || false;
            container.rank = rank;
            container.node = node;
            container.children = children;
            container.containerId = node.generateID(); //generateID() returns existing node id or creates one if it doesnt exist
            container.containerClass = containerStyle;
            container.childClass = elemStyle;

        },

        /**
         * @method initiateNavigation
         * @protected
         * initiates navigation by activating registered container
         */
        initiateNavigation: function () {
            this.activateRegisteredContainer();
        },

        /**
         * @method deactivateRegisteredContainer
         * @protected
         * @Description Remove all subscriptions,css on the current navigable container and its children, reset Container object
         */
        deactivateRegisteredContainer: function () {
            this.killAllChildNavigationSubscription();

            if (this.get('styleContainer')) {
                this.removeHighlightonContainer();
            }

            this.removeHighlightonCurrentChild();
            this.resetContainer();
            this.removeNavPointer();
        },

        /**
         * @method removeHighlightonContainer
         * @protected
         * remove any CSS highlight on the current navigable container
         */
        removeHighlightonContainer: function () {
            var container = this.container,
                highlightClass;

            if (container && container.node) {
                highlightClass = this.container.containerClass || CLASS_DEFAULT_CONTAINER_HIGHLIGHT;
                container.node.removeClass(highlightClass);
            }
        },

        /**
         * @method highlightContainer
         * @protected
         * ADD CSS highlight on the current navigable container
         */
        highlightContainer: function () {
            var container = this.container,
                highlightClass;

            if (container && container.node) {
                highlightClass = this.container.containerClass || CLASS_DEFAULT_CONTAINER_HIGHLIGHT;
                container.node.addClass(highlightClass);
            }
        },

        /**
         * @method removeHighlightonCurrentChild
         * @protected
         * remove any CSS highlight on the current container's children
         */
        removeHighlightonCurrentChild: function () {
            var container = this.container,
                index = container.childIndexInFocus,
                highlightClass = container.childClass || CLASS_DEFAULT_CHILD_HIGHLIGHT;

            if (index !== null && index !== -1) {
                container.children[index].removeClass(highlightClass);
            }
        },

        /**
         * @method resetRegistryIndex
         * @protected
         * set the Attribute activeRegistryIndex to null
         */
        resetRegistryIndex: function () {
            this.set('activeRegistryIndex', null);
        },

        /**
         * @method resetContainer
         * @protected
         * Reset the contents of the container object
         */
        resetContainer: function () {
            this.container = {
                rank: null,
                /*Integer:[1,lenofregistry]*/
                node: null,
                /*DOM elem*/
                containerId: null,
                /*String*/
                children: [],
                /*array type*/
                childIndexInFocus: -1,
                /* if there are 10 div elements in navigable container then this variable holds the index of the one in focus*/
                isHorizontal: false,
                pullToTop: false
            };

            this.wasLastChild = false;
        },

        /**
         * @description Detach all the subscriptions to the body
         * @method killAllChildNavigationSubscription
         * @protected
         */
        killAllChildNavigationSubscription: function () {
            if (Y.BodySubscr) {
                this.detachAllChildSubscriptions();
            }
        },

        /**
         * @method splash
         * @protected
         * Splash a message onto the container: specifically its rank, mostly
         * meant for debugging purpose and is shown only when debug flag is on
         * @param {String} msg message to be splashed on screen
         * @param {Array} pos [x,y] denotes the coordinate on the screen where the message has to be splashed
         */
        splash: function (msg, pos) {
            var ele = '<h1 style="font-size:3em;color:#444;position:fixed;-webkit-transform: rotate(-10deg);" id="_splash">' + msg + '</h1>',
                splashnode,
                body,
                splash,
                position = pos || [0, 0];

            splashnode = Y.one('#_splash');
            body = Y.one('body');

            if (splashnode) {
                splashnode.remove();
            }

            splash = Y.DOM.create(ele); //.getDOMNode;
            body.append(splash);
            splashnode = Y.one('#_splash').setXY(position).addClass('cramDownOpacity');
        },

        /**
         * @method activateRegisteredContainer
         * @protected
         * Add CSS highlight to new container, attach key event subscriptions for the container and simulate arrow-key-down
         */
        activateRegisteredContainer: function () {
            var container = this.container,
                self = this,
                xy;

            if (container && container.node) {
                if (this.get('styleContainer')) {
                    this.highlightContainer();
                }
                // splash coordinates
                if (this.get('debug')) {
                    xy = [200, 200];
                    this.splash('Container now navigable:' + container.node.generateID(), xy);
                }
            }

            Y.BodySubscr = {};
            Y.BodySubscr.keydown = Y.one('body').on(BASE_KEY_EVENT, Y.bind(this.navigateToNextChild, this));
            Y.BodySubscr.keyup = Y.one('body').on(BASE_KEY_EVENT, Y.bind(this.navigateToPrevChild, this));
            self.navigateToNextChild(NEXT_CHILD_PARAM);
        },

        /**
         * @method isKeyChildNavigator
         * @protected
         * @param {Object} e eventFacade generated when a key is pressed
         * @return {Boolean} returns true if the keypressed is either of arrow up, arrow right, arrow left or arrow down
         * Function that checks the type of keyPress and returns true if its any of the
         * child navigation keys for eg: arrow up, down right left
         */
        isKeyChildNavigator: function (e) {
            if (e && (e.charCode === KEYCODE_FOR_ARROW_UP
                || e.charCode === KEYCODE_FOR_ARROW_LEFT
                || e.charCode === KEYCODE_FOR_ARROW_DOWN
                || e.charCode === KEYCODE_FOR_ARROW_RIGHT)) {
                return true;
            }

            return false;
        },

        /**
         * @method navigateToNextChild
         * @protected
         * @param {Object} e eventFacade generated when a key is pressed
         * Function which on keyboard down key press, will focus/navigate to next child of the container registered
         */
        navigateToNextChild: function (e) {
            var container = this.container,
                childIndexInFocus,
                newindex;

            // Ignore any combination of navigation key with special keys
            if (this.isKeyChildNavigator(e) && this._specialKeyDown) {
                return;
            }

            // Make sure that, for horizontal containers, arrowkeyDOWN doesn't do anything
            if (container) {
                if (container.isHorizontal) {
                    if (e.charCode === KEYCODE_FOR_ARROW_DOWN) {
                        return;
                    }
                } else {
                    if (e.charCode === KEYCODE_FOR_ARROW_RIGHT) {
                        return;
                    }
                }
            }

            if (e === NEXT_CHILD_PARAM ||
                    e.charCode === KEYCODE_FOR_ARROW_DOWN ||
                    e.charCode === KEYCODE_FOR_ARROW_RIGHT) {

                // To handle some edge case where we navigate back to 1st child on down key.
                this.wasLastChild = false;

                if (container) {
                    if (Y.Lang.isObject(e)) {
                        e.preventDefault();
                    }

                    childIndexInFocus = container.childIndexInFocus;
                    newindex = this.getNextIndex(childIndexInFocus);
                    container.childIndexInFocus = newindex;
                    this.bringChildtoFocus(container.children[newindex]);

                    if (this.get('navPointer')) {
                        this.setNavPointer();
                    }
                }
            }
        },

        /**
         * @method navigateToPrevChild
         * @protected
         * @param {Object} e eventFacade generated when a key is pressed
         * on keyboard up key press, will focus/navigate to previous child of the container registered
         */
        navigateToPrevChild: function (e) {
            var container = this.container,
                childIndexInFocus,
                newindex;

            // Ignore any combination of navigation key with special keys
            if (this.isKeyChildNavigator(e) && this._specialKeyDown) {
                return;
            }

            // Make sure that, for horizontal containers, arrowkeyup doesn't do
            // anything, and non-horizontal containers arrow left doesn't do
            // anything either...
            if (container) {
                if (container.isHorizontal) {
                    if (e.charCode === KEYCODE_FOR_ARROW_UP) {
                        return;
                    }
                } else {
                    if (e.charCode === KEYCODE_FOR_ARROW_LEFT) {
                        return;
                    }
                }
            }

            if (e === NEXT_CHILD_PARAM ||
                    e.charCode === KEYCODE_FOR_ARROW_UP ||
                    e.charCode === KEYCODE_FOR_ARROW_LEFT) {
                if (container) {
                    if (Y.Lang.isObject(e)) {
                        e.preventDefault();
                    }

                    childIndexInFocus = container.childIndexInFocus;
                    newindex = this.getPreviousIndex(childIndexInFocus);
                    this.bringChildtoFocus(container.children[newindex]);
                    container.childIndexInFocus = newindex;

                    if (this.get('navPointer')) {
                        this.setNavPointer();
                    }
                }
            }
        },

        /**
         * @method detachAllChildSubscriptions
         * @protected
         * @Description Function to detach navigation and all events needed to navigate within a container through the children
         */
        detachAllChildSubscriptions: function () {
            var BodySubscr = Y.BodySubscr,
                subscription;

            if (BodySubscr) {
                for (subscription in BodySubscr) {
                    if (BodySubscr.hasOwnProperty(subscription)) {
                        BodySubscr[subscription].detach();
                    }
                }
                delete Y.BodySubscr;
            }
        },

        /**
         * @method removeNavPointer
         * @protected
         * Function to remove navpointer to the selected child element (navpointer
         * is a marker that visually shows what child element is selected)
         */
        removeNavPointer: function () {
            var class_navptr = '.' + CLASS_NAV_POINTER,
                node = Y.one(class_navptr);

            if (node) {
                node.remove();
            }
        },

        /**
         * @method setNavPointer
         * @protected
         * Function to set navpointer to the selected child element (navpointer is a marker that
         * visually shows what child element is selected)
         */
        setNavPointer: function () {
            var container = this.container,
                highlightClass =  container.childClass || CLASS_DEFAULT_CHILD_HIGHLIGHT,
                n = Y.one('.' + highlightClass);

            this.removeNavPointer();

            if (n) {
                n.prepend('<span class="' + CLASS_NAV_POINTER + '">' + NAV_POINTER + '</span>');
            }
        },

        /**
         * @destructor
         * @protected
         * Function to destroy any object creations and event registerations
         */
        destructor: function () {
            if (this.anim) {
                delete this.anim;
            }
            this.disableAllNavigation();

        },

        /**
         * Function to get the next child index on key down event.
         * @param {Integer} childIndexInFocus previous child index (for eg: 0 means 1st child)
         * @return {Integer} the new child index to be navigated to or focused to.
         */
        getNextIndex: function (childIndexInFocus) {
            var container = this.container,
                numofChildren = container.children.length,
                highlightClass =  container.childClass || CLASS_DEFAULT_CHILD_HIGHLIGHT;

            if (childIndexInFocus !== -1) {
                container.children[childIndexInFocus].removeClass(highlightClass);
            }

            if (childIndexInFocus === numofChildren - 1) {
                childIndexInFocus = -1;
                this.wasLastChild = true;
            } else {
                this.wasLastChild = false;
            }

            childIndexInFocus += 1;

            return childIndexInFocus;
        },

        /**
         * Function to retrieve the child-index previous to the @param1  on key up event.
         * @param {Integer} current child index in focus (for eg: 0 means 1st child)
         * @return {Integer} the new child index to be navigated to or focused to.
         */
        getPreviousIndex: function (childIndexInFocus) {
            var container = this.container,
                numofChildren = container.children.length,
                highlightClass = container.childClass || CLASS_DEFAULT_CHILD_HIGHLIGHT;

            if (childIndexInFocus >= 0 && container.children[childIndexInFocus]) {
                container.children[childIndexInFocus].removeClass(highlightClass);
            }

            if (childIndexInFocus === 0) {
                childIndexInFocus = numofChildren;
            }

            childIndexInFocus -= 1;

            if (childIndexInFocus < 0) {
                childIndexInFocus = 0;
            }

            return childIndexInFocus;
        },

        /**
         * @method _scroll
         * @private
         * Function to scroll the window by a certain y value
         * @param: y - integer, that represents the calculated height by which scroll should happen on Y axis on window object
         */
        _scroll: function (y) {
            if (!this.get('scrollAnim')) {
                Y.config.win.scroll(0, y);
            } else {
                if (this.anim) {
                    delete this.anim;
                }

                this.anim = new Y.Anim({
                    node: 'window',
                    from: {
                        scroll: [Y.DOM.docScrollX(), Y.DOM.docScrollY()]
                    },
                    to: {
                        scroll: [Y.DOM.docScrollX(), y]
                    },
                    duration: DURATION_OF_SMOOTHSCROLL,
                    easing: ANIMTYPE_FOR_SMOOTHSCROLL
                }).run();
            }
        },

        /**
         * Function to adjust scrolling  child element which is in focus
         * @method scrollTo
         * @protected
         * @param {Object} DOM element(child node in focus of the navigable container)
         * @return {Integer} amount to scroll to get the elem under focus to the center or to the top
         */
        scrollTo: function (Node) {
            var childsY = Node.getY(),
                childHeight = Node.get('clientHeight'),
                adjustScroll = childHeight / 2,
                winHeight = Node.get('winHeight'),
                halfwinheight = winHeight / 2,
                amounttoScroll = 0;

            if (childHeight > winHeight) {
                // This is to make sure that if the child is taller than the
                // screen, just position its top at the center of the screen.
                adjustScroll = 0;
            }

            if (childsY > halfwinheight) {
                if (this.anim && this.anim.get('running')) {
                    this.anim.pause();
                }
                if (this.container && this.container.pullToTop) {
                    amounttoScroll = childsY;
                } else {
                    amounttoScroll = childsY - halfwinheight + adjustScroll; // will center the div
                }
            }

            if (Y.DOM.inViewportRegion(Y.Node.getDOMNode(Node), true, null)) {
                return null;
            }

            return amounttoScroll;
        },

        /**
         * Function to get the new child into focus and scroll to the child
         * @method bringChildtoFocus
         * @protected
         * @param {Object} Node representing the child that should gain focus.
         */
        bringChildtoFocus: function (childInFocus) {
            // Related to getting the first link on reaching a child node
            var link = childInFocus,
                linkArr = [],
                container = this.container,
                highlightClass = container.childClass || CLASS_DEFAULT_CHILD_HIGHLIGHT,
                amounttoScroll;

            if (childInFocus) {
                link = childInFocus.all('a');
            } else {
                return;
            }

            childInFocus.addClass(highlightClass).focus();
            if (this.anim && this.anim.get('running')) {
                this.anim.pause();
            }

            amounttoScroll = this.scrollTo(childInFocus);
            if (amounttoScroll) {
                this._scroll(amounttoScroll, childInFocus.getY);
            }

            if (this.activeLink) {
                this.activeLink.blur();
            }

            link.each(function (child, i) {
                linkArr[i] = child;
            });

            if (linkArr[0]) {
                linkArr[0].focus();
                this.activeLink = linkArr[0];
            }
        }
    });


}, '@VERSION@', {"requires": ["node", "event", "event-key", "gallery-event-nav-keys", "base", "anim"], "skinnable": false});
