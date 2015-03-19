/**
 * DOM.js is a lightweight & fast cross browser library for
 * dom traversal and manipulation.
 *
 * @author Dawid Kraczowski <Mighty Mosquito>
 * @license MIT
 */
;(function (window, document, undefined) {

    /**
     * Array.indexOf support
     * @param {Array} array
     * @param {*} obj
     * @returns {number}
     * @private
     */
    function _indexOf(array, obj) {
        if (Array.prototype.indexOf) {
            return Array.prototype.indexOf.call(array, obj);
        }
        for (var i = 0, j = array.length; i < j; i++) {
            if (array[i] === obj) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Checks if given value is an array
     * @param {*} object
     * @returns {boolean}
     * @private
     */
    function _isArray(object) {
        return Object.prototype.toString.call(object) === '[object Array]';
    }

    /**
     * Checks if given value is a string
     * @param {*} object
     * @returns {boolean}
     * @private
     */
    function _isString(object) {
        return typeof object === 'string';
    }

    /**
     * Checks if given value is an object
     * @param {*} object
     * @returns {boolean}
     * @private
     */
    function _isObject(object) {
        return typeof object === 'object';
    }

    /**
     * Checks if object is iterable
     * @param {Object} object
     * @returns {boolean}
     * @private
     */
    function _isIterable(object) {
        if (object['length'] !== undefined && object.length > 0) {
            return true;
        }
        return false;
    }

    var addListener = document.addEventListener ? 'addEventListener' : 'attachEvent',
        removeListener = document.removeEventListener ? 'removeEventListener' : 'detachEvent',
        eventPrefix = document.addEventListener ? '' : 'on',
        createEvent = document.createEvent ? 'createEvent' : 'createEventObject',
        dispatchEvent = document.dispatchEvent ? 'dispatchEvent' : 'fireEvent',
        Dom = {},
        cssNameProperty = function(prop) {return prop;};

    //is trident 4?
    var ua = navigator.userAgent;
    var re  = new RegExp('Trident/([0-9]{1,}[\.0-9]{0,})');
    if (re.exec(ua) != null) {
        rv = parseFloat( RegExp.$1 );
        if (rv == 4) {
            cssNameProperty = function(prop) {
                for(var exp=/-([a-z0-9])/; exp.test(prop); prop = prop.replace(exp,RegExp.$1.toUpperCase()));
                return prop;
            };
        }
    }

    /**
     * Normalized Event object
     *
     * @param {DOMEvent} e
     * @constructor
     */
    Dom.Event = function(e) {
        var _e = e;

        /**
         * Stops event bubbling
         */
        Dom.Event.prototype.stopPropagation = function() {
            if (_e.stopPropagation) {
                _e.stopPropagation();
            } else {
                _e.cancelBubble = true;
            }
        };

        /**
         * Prevents default behaviour
         */
        Dom.Event.prototype.preventDefault = function() {
            if (_e.preventDefault) {
                _e.preventDefault();
            } else {
                _e.returnValue = false;
            }
        };

        /**
         * Return native event object
         * @returns {DOMEvent}
         */
        Dom.Event.prototype.event = function() {
            return _e;
        };


        this.target = _e.target || _e.srcElement;
        this.ctrlKey = _e.ctrlKey;
        this.shiftKey = _e.shiftKey;
        this.altKey = _e.altKey;
        this.relativeY = _e.layerY || _e.offsetY;
        this.relativeX = _e.layerX || _e.offsetX;
        this.x = _e.x || _e.clientX;
        this.y = _e.y || _e.clientY;
    };

    /**
     * Mouse events
     */
    Dom.Event.ON_CLICK = 'click';
    Dom.Event.ON_DBLCLICK = 'dblclick';
    Dom.Event.ON_CONTEXTMENU = 'contextmenu';
    Dom.Event.ON_MOUSEDOWN = 'mousedown';
    Dom.Event.ON_MOUSEENTER = 'mouseenter';
    Dom.Event.ON_MOUSELEAVE = 'mouseleave';
    Dom.Event.OM_MOUSEMOVE = 'mousemove';
    Dom.Event.ON_MOUSEOVER = 'mouseover';
    Dom.Event.ON_MOUSEOUT = 'mouseout';
    Dom.Event.ON_MOUSEUP = 'mouseup';
    Dom.Event.ON_MOUSEMOVE = 'mousemove';

    /**
     * Keyboard events
     */
    Dom.Event.ON_KEYDOWN = 'keydown';
    Dom.Event.ON_KEYUP = 'keyup';
    Dom.Event.ON_KEYPRESS = 'keypress';

    /**
     * UI Events
     */

    //form events
    Dom.Event.ON_SELECT = 'select';
    Dom.Event.ON_RESET = 'reset';
    Dom.Event.ON_FOCUS = 'focus';
    Dom.Event.ON_BLUR = 'blur';
    Dom.Event.ON_SUBMIT = 'submit';
    Dom.Event.ON_CHANGE = 'change';

    //frame/window events
    Dom.Event.ON_LOAD = 'load';
    Dom.Event.ON_UNLOAD = 'unload';
    Dom.Event.ON_RESIZE = 'resize';
    Dom.Event.ON_UNLOAD = 'unload';
    Dom.Event.ON_ERROR = 'error';
    Dom.Event.ON_SCROLL = 'scroll';

    /**
     * Drag and drop events
     */
    Dom.Event.ON_DRAG = 'drag';
    Dom.Event.ON_DRAGSTART = 'dragstart';
    Dom.Event.ON_DRAGEND = 'dragend';
    Dom.Event.ON_DRAGENTER = 'dragenter';
    Dom.Event.ON_DRAGLEAVE = 'dragleave';
    Dom.Event.ON_DRAGOVER = 'dragover';
    Dom.Event.ON_DROP = 'drop';

    /**
     * Attaches javascript listener to the element(s) for the given event type
     *
     * @param {HTMLElement|NodeList} element
     * @param {String} event
     * @param {Function} listener
     *
     * @returns {HTMLElement|false} returns HTMLElement if listener has been attached
     */
    Dom.addListener = function (element, event, listener) {
        if (element === undefined) {
            return false;
        }

        if (_isIterable(element)) {
            for (var i = 0, n = element.length; i < n; i++) {
                Dom.addListener(element[i], event, listener);
            }
            return element;
        }

        element._event = element._event || {};
        element._event[event] = element._event[event] || { keys:[], values:[] };

        //checks if listener already exists
        if (_indexOf(element._event[event].keys, listener) != -1) {
            return element;
        }

        element._event[event].keys.push(listener);
        var _listener = function(e) {
            var evt = new Dom.Event(e);
            if (listener.call(element, evt) === false) {
                e.stop();
            }
        };
        element._event[event].values.push(_listener);

        element[addListener](eventPrefix + event, _listener);

        return element;
    };

    /**
     * Execute all handlers and behaviors attached to the element(s)
     * for the given event type
     *
     * @param {HTMLElement|NodeList} element
     * @param {string} type
     * @param {Object} options event options
     * @returns {Event}
     */
    Dom.dispatch = function(element, type, options) {
        if (element === undefined) {
            return false;
        }

        if (_isIterable(element)) {
            for (var i = 0, n = element.length; i < n; i++) {
                Dom.dispatch(element[i], type, options);
            }
            return element;
        }

        if (!options) {
            options = {};
        }

        var o = {
                type: type,
                view: options.view || element.ownerDocument.defaultView,
                detail: options.detail || 1,
                screenX: options.screenX || 0,
                screenY: options.screenY || 0,
                clientX: options.clientX || 0,
                clientY: options.clientY || 0,
                button: options.button || 0,
                ctrlKey: options.ctrlKey || false,
                altKey: options.altKey || false,
                shiftKey: options.shiftKey || false,
                metaKey: options.metaKey || false,
                bubbles: options.bubbles || true,
                cancelable: options.cancelable || true
            },
            eventObjects = {
                'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
                'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
            },
            eventClass = 'Event',
            event;

        for (var name in eventObjects) {
            if (eventObjects[name].test(type)) { eventClass = name; break; }
        }

        if (document.createEvent) {
            event = element.ownerDocument.createEvent(eventClass);
            if (eventClass = 'MouseEvents') {
                event.initMouseEvent( o.type, o.bubbles, o.cancelable, o.view,
                    o.detail, o.screenX, o.screenY, o.clientX, o.clientY, o.ctrlKey,
                    o.altKey, o.shiftKey, o.metaKey, 0, null);
            } else {
                event.initEvent(type, o.bubbles, o.cancelable);
            }
            element.dispatchEvent(event);
            return event;

        } else if (document.createEventObject) {
            o.clientX = o.pointerX;
            o.clientY = o.pointerY;
            event = document.createEventObject();
            for (var key in o) {
                event[key] = o[key];
            }
            element.fireEvent(eventPrefix + type, event);
            return event;
        }

    };

    /**
     * Removes javascript listener from the element(s) for the given event type.
     * @param {HTMLElement|NodeList} element
     * @param {String} event
     * @param {Function} listener
     * @returns {*}
     */
    Dom.removeListener = function (element, event, listener) {
        if (element === undefined) {
            return false;
        }
        if (_isIterable(element)) {
            for (var i = 0, n = element.length; i < n; i++) {
                Dom.removeListener(element[i], event, listener);
            }
            return element;
        }

        if (!element._event || !element._event[event]) {
            return false;
        }

        var key = _indexOf(element._event[event].keys, listener);
        if (key === -1) {
            return false;
        }
        var _listener = element._event[event].values[key];

        element[removeListener](eventPrefix + event, _listener);
        delete element._event[event].values[key];
        delete element._event[event].keys[key];

        return element;
    };

    /**
     * Determine whether a supplied listener is attached to the element
     *
     * @param {HTMLElement} element
     * @param {String} event
     * @param {Function} listener
     * @returns {boolean}
     */
    Dom.hasListener = function (element, event, listener) {
        if (!element._event || !element._event[event]) {
            return false;
        }
        return _indexOf(element._event[event].keys, listener) !== -1;
    };

    /* Dom Event Aliases */

    /**
     * Bind an event handler to the “click” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param {Function} listener
     * @returns {HTMLElement|false}
     */
    Dom.onClick = function (element, listener) {
        return Dom.addListener(element, Dom.Event.ON_CLICK, listener);
    };

    /**
     * Bind an event handler to the “dblclick” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {HTMLElement|false}
     */
    Dom.onDblClick = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_DBLCLICK, listener);
    };

    /**
     * Bind an event handler to the “onmouseover” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {HTMLElement|false}
     */
    Dom.onMouseOver = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_MOUSEOVER, listener);
    };

    /**
     * Bind an event handler to the “onmouseout” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {HTMLElement|false}
     */
    Dom.onMouseOut = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_MOUSEOUT, listener);
    };

    /**
     * Bind an event handler to the “onmousedown” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {HTMLElement|false}
     */
    Dom.onMouseDown = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_MOUSEDOWN, listener);
    };

    /**
     * Bind an event handler to the “onmouseup” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {HTMLElement|false}
     */
    Dom.onMouseUp = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_MOUSEUP, listener);
    };

    /**
     * Bind an event handler to the “onmouseenter” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {HTMLElement|false}
     */
    Dom.onMouseEnter = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_MOUSEENTER, listener);
    };

    /**
     * Bind an event handler to the “onmouseleave” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {HTMLElement|false}
     */
    Dom.onMouseLeave = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_MOUSELEAVE, listener);
    };

    /**
     * Bind an event handler to the “mousemove” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {HTMLElement|false}
     */
    Dom.onMouseMove = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_MOUSEMOVE, listener);
    };


    /**
     * Bind an event handler to the “ondrag” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {HTMLElement|false}
     */
    Dom.onDrag = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_DRAG, listener);
    };

    /**
     * Bind an event handler to the “ondragstart” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {HTMLElement|false}
     */
    Dom.onDragStart = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_DRAGSTART, listener);
    };

    /**
     * Bind an event handler to the “ondragend” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {HTMLElement|false}
     */
    Dom.onDragEnd = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_DRAGEND, listener);
    };

    /**
     * Bind an event handler to the “focus” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {HTMLElement|false}
     */
    Dom.onFocus = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_FOCUS, listener);
    };

    /**
     * Bind an event handler to the “blur” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {HTMLElement|false}
     */
    Dom.onBlur = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_BLUR, listener);
    };

    /**
     * Bind an event handler to the “select” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {HTMLElement|false}
     */
    Dom.onSelect = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_SELECT, listener);
    };

    /**
     * Bind an event handler to the “change” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {HTMLElement|false}
     */
    Dom.onChange = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_CHANGE, listener);
    };

    /**
     * Bind an event handler to the “submit” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {HTMLElement|false}
     */
    Dom.onSubmit = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_SUBMIT, listener);
    };

    /**
     * Bind an event handler to the “reset” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {HTMLElement|false}
     */
    Dom.onReset = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_RESET, listener);
    };

    /**
     * Bind an event handler to the “load” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {HTMLElement|false}
     */
    Dom.onLoad = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_LOAD, listener);
    };

    /**
     * Bind an event handler to the “scroll” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {HTMLElement|false}
     */
    Dom.onScroll = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_SCROLL, listener);
    };

    /**
     * Bind an event handler to the “unload” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {HTMLElement|false}
     */
    Dom.onUnload = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_UNLOAD, listener);
    };

    /**
     * Bind an event handler to the “resize” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {HTMLElement|false}
     */
    Dom.onResize = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_RESIZE, listener);
    };

    /**
     * Bind an event handler to the “keydown” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param {Function} listener
     * @returns {HTMLElement|false}
     */
    Dom.onKeyDown = function (element, listener) {
        return Dom.addListener(element, Dom.Event.ON_KEYDOWN, listener);
    };

    /**
     * Bind an event handler to the “keyup” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param {Function} listener
     * @returns {HTMLElement|false}
     */
    Dom.onKeyUp = function (element, listener) {
        return Dom.addListener(element, Dom.Event.ON_KEYUP, listener);
    };

    /**
     * Bind an event handler to the “keypress” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param {Function} listener
     * @returns {HTMLElement|false}
     */
    Dom.onKeyPress = function (element, listener) {
        return Dom.addListener(element, Dom.Event.ON_KEYPRESS, listener);
    };

    /* Dom Traversal */

    /**
     * Finds HTMLElements that match css pattern
     *
     * Supported from IE 8.0, FF 3.5, Chrome 4.0, Safari 3.1
     * @param {String} selector
     * @returns {NodeList}
     */
    Dom.find = function (selector) {
        return document.querySelectorAll(selector);
    };

    /**
     * Returns HTMLElement with given id
     *
     * @param {String} id
     * @returns {HTMLElement}
     */
    Dom.id = function (id) {
        return document.getElementById(id);
    };

    /**
     * Finds HTMLElements that match given tagname
     *
     * @param {String} name
     * @returns {NodeList}
     */
    Dom.findByTagName = function (name) {
        return document.getElementsByTagName(name);
    };

    /**
     * Finds HTMLElements with given class name
     *
     * Supported from IE 8.0, FF 3.5, Chrome 4.0, Safari 3.1
     * @param name
     * @returns {NodeList}
     */
    Dom.findByClass = function (name) {
        if (name.substring(0,1) == ".") {
            name = name.substring(1);
        }

        if (document.getElementsByClassName) {
            return document.getElementsByClassName(name);
        }

        if(document.querySelector && document.querySelectorAll ) {
            return document.querySelectorAll("." + name);
        }
    };

    /**
     * Gets the parent of the html element
     *
     * @param {HTMLElement} element
     * @returns {HTMLElement}
     */
    Dom.parent = function(element) {
        return element.parentNode;
    };

    /**
     * Gets children elements of html element. Text nodes are ommited by default.
     * To get textnodes tag must be set to true, eg.
     *
     *      Dom.children(element, true)
     *
     * @param {HTMLElement} element
     * @param {String|boolean} tag filters children by tag name or tells to retrieve text nodes as well
     * @returns {NodeList|Array}
     */
    Dom.children = function(element, tag) {

        if (typeof tag === 'boolean' && tag) {
            return element.childNodes;
        }

        var result = [];

        if (_isString(tag)) {

            for (var i = 0, j = element.childNodes.length; i < j; i++) {
                if (element.childNodes[i].nodeName.toLowerCase() === tag.toLowerCase()) {
                    result.push(element.childNodes[i]);
                }
            }
            return result;
        }

        for (var i in element.childNodes) {
            if (element.childNodes[i].nodeType === 1) {
                result.push(element.childNodes[i]);
            }
        }

        return result;
    };

    /**
     * Gets following sibling element of the HTMLElement
     *
     * @param {HTMLElement} element
     * @returns {HTMLElement}
     */
    Dom.next = function(element) {
        var result = element.nextSibling;
        if (result.nodeType != 1) {
            return Dom.next(result);
        }
        return result;
    };

    /**
     * Gets previous sibling element of the HTMLElement
     *
     * @param {HTMLElement} element
     * @returns {HTMLElement}
     */
    Dom.previous = function(element) {
        var result = element.previousSibling;
        if (result.nodeType != 1) {
            return Dom.previous(result);
        }
        return result;
    };

    /* Dom Manipulation */

    /**
     * Gets or sets element attributes
     * if the attribute is not defined this method
     * return an empty string
     *
     * @param element
     * @param attribute
     * @param {*} attribute attribute name or names
     *
     * @example
     * Dom.attribute(el, "href"); // returns href attribute's value of the element
     * Dom.attribute(el, ["href", "target"]); //returns object of attributed of the element
     * Dom.attribute(el, {href: "#new"}); //sets href attribute's value
     */
    Dom.attribute = function(element, attribute)  {

        //get one attribute
        if (typeof attribute === "string") {

            var result;

            if (attribute === 'class' && element['className'] !== undefined) {//class?
                result = element.className;
            } else if (attribute === 'for' && element['htmlFor'] !== undefined) {//for?
                result = element.htmlFor;
            } else if (attribute === 'value' && element['value'] !== undefined) {//value?
                result = element.value;
            } else {
                result = element.getAttribute(attribute);
            }

            if (result === '') {
                result = null;
            }
            return result;
        }

        //get many
        if (_isArray(attribute)) {
            var result = {};
            for (var i in attribute) {
                result[attribute[i]] = Dom.attribute(element, attribute[i]);
            }
            return result;
        }

        //set attribute(s)
        if (_isObject(attribute)) {
            for (var i in attribute) {


                if (attribute[i] === null) {
                    element.removeAttribute(i);
                } else {
                    element.setAttribute(i, attribute[i]);
                }
            }
            return attribute;
        }

        return false;
    };

    /**
     * Sets or gets HTMLElement's style
     *
     * @param {HTMLElement} element
     * @param {Object} style key value pair object
     * @returns {Object|false}
     */
    Dom.css = function(element, style) {

        //get one element
        if (typeof style === "string") {
            return element.style[cssNameProperty(style)];
        }

        //get array of elements
        if (_isArray(style)) {
            var css = {};
            for (var i in style) {
                css[style[i]] = element.style[cssNameProperty(style[i])];
            }
            return css;
        }

        if (_isObject(style)) {
            //set csses
            for (var i in style) {
                element.style[cssNameProperty(i)] = style[i];
            }
            return style;
        }

        return false;
    };

    /**
     * Gets css classes of the given element
     *
     * @param {HTMLElement} element
     * @returns {Array}
     */
    Dom.getClass = function(element) {
        if (element === undefined) {
            return false;
        }
        var attribute = Dom.attribute(element, 'class');
        if (!attribute) {
            return [];
        }
        attribute = attribute.split(' ');
        var classNames = [];
        for (var i in attribute) {
            if (attribute[i] === '') {
                continue;
            }
            classNames.push(attribute[i]);
        }
        return classNames;
    };

    /**
     * Checks whether html element is assigned to the given class(es)
     *
     * @param element
     * @param {String|Array} className
     * @returns {boolean}
     */
    Dom.hasClass = function(element, className) {
        if (element === undefined) {
            return false;
        }

        if (_isString(className)) {
            return _indexOf(Dom.getClass(element), className) > -1 ? true : false;
        } else if (_isArray(className)) {
            var elementClasses = Dom.getClass(element);
            for (var i in className) {
                if (_indexOf(className[i], elementClasses) === -1) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }

        return false;
    };

    /**
     * Assign new css class(es) to the html element(s)
     *
     * @param {HTMLElement} element
     * @param {String} className
     * @returns {boolean}
     */
    Dom.addClass = function(element, className) {
        if (element === undefined) {
            return false;
        }

        if (_isIterable(element)) {
            for (var i = 0, n = element.length; i < n; i++) {
                Dom.addClass(element[i], className);
            }
            return;
        }

        if (_isArray(className)) {
            for (var i in className) {
                Dom.addClass(element, className[i]);
            }
            return;
        }

        var classes = Dom.getClass(element);

        if (_indexOf(classes, className) === -1) {
            classes.push(className);
        }
        classes = classes.join(' ');
        Dom.attribute(element, {class: classes});
    };

    /**
     * Removes html element's assignment to the css class(es)
     *
     * @param {HTMLElement} element
     * @param {String} className
     */
    Dom.removeClass = function(element, className) {
        if (element === undefined) {
            return;
        }

        if (_isIterable(element)) {
            for (var i = 0, n = element.length; i < n; i++) {
                Dom.removeClass(element[i], className);
            }
            return;
        }

        var classes = Dom.getClass(element);
        var i = _indexOf(classes, className);

        if (i === -1) {
            return;
        }
        classes.splice(i, 1);
        Dom.attribute(element, {class: classes.join(' ')});

    };

    /**
     * Creates html element(s)
     *
     * @param {String} html
     * @return {HTMLElement}
     */
    Dom.create = function(html) {
        var div = document.createElement('div');
        var doc = document.createDocumentFragment();
        Dom.html(div, html);
        var children = Dom.children(div);

        for (var i = 0, j = children.length; i < j; i++) {
            Dom.append(doc, children[i]);
        }

        return doc;
    };

    /**
     * Creates a copy of a node, and returns the clone.
     *
     * @param {HTMLElement} element
     * @return {HTMLElement}
     */
    Dom.copy = function(element) {
        return element.cloneNode(true);
    };

    /**
     * Gets or sets inner html of HTMLElement
     *
     * @param {HTMLElement} element
     * @param {String} string
     * @returns {String}
     */
    Dom.html = function(element, string) {

        if (_isString(string)) {
            element.innerHTML = string;
            return string;
        }

        return element.innerHTML;
    };

    /**
     * Gets or sets text value of the HTML element
     *
     * @param {HTMLElement} element
     * @param {String} string
     * @returns {*}
     */
    Dom.text = function(element, string) {

        if (_isString(string)) {

            if (element.innerText) {
                element.innerText = string;
            } else {
                element.textContent = string;
            }
            return string;
        }

        if (element.innerText) {
            return element.innerText;
        }

        return element.textContent;
    };

    /**
     * Inserts content specified by the html argument at the end of HTMLElement
     *
     * @param {HTMLElement} element
     * @param {String|HTMLElement} html
     * @return {HTMLElement} inserted element
     */
    Dom.append = function(element, html) {

        if (_isString(html)) {
            html = Dom.create(html);
        }
        element.appendChild(html);
        return html;
    };

    /**
     * Inserts content specified by the html argument at the beginning of HTMLElement
     *
     * @param {HTMLElement} element
     * @param {String|HTMLElement} html
     * @returns {HTMLElement} inserted element
     */
    Dom.prepend = function(element, html) {

        if (_isString(html)) {
            html = Dom.create(html);
        }
        element.insertBefore(html, element.firstChild);
        return html;
    };

    /**
     * Inserts content specified by the html argument after the HTMLElement
     *
     * @param {HTMLElement} element
     * @param {String|HTMLElement} html
     * @returns {HTMLElement} inserted element
     */
    Dom.after = function(element, html) {

        if (_isString(html)) {
            html = Dom.create(html);
        }

        element.parentNode.insertBefore(html, element.nextSibling);
        return html;
    };

    /**
     * Inserts content specified by the html argument before the HTMLElement
     *
     * @param {HTMLElement} element
     * @param {String|HTMLElement} html
     * @returns {HTMLElement} inserted element
     */
    Dom.before = function(element, html) {

        if (_isString(html)) {
            html = Dom.create(html);
        }

        element.insertBefore(html, element);
        return html;
    };

    /**
     * Replaces given html element with content specified in html parameter
     *
     * @param {HTMLElement} element
     * @param {String|HTMLElement} html
     * @returns {HTMLElement} inserted element
     */
    Dom.replace = function(element, html) {
        if (_isString(html)) {
            html = Dom.create(html);
        }
        element.parentNode.replaceChild(html, element);
        return html;
    };

    /**
     * Removes HTMLElement from dom tree
     *
     * @param {HTMLElement} element
     * @returns {HTMLElement} removed element
     */
    Dom.remove = function(element) {
        var parent = element.parentNode;
        return parent.removeChild(element);
    };

    //export dom
    window.Dom = Dom;

})(this, document);