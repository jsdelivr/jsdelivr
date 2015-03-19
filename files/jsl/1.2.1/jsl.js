// ==UserScript==
// @name          JoeSimmons' Library
// @namespace     http://userscripts.org/users/23652
// @description   A JavaScript library used by JoeSimmons
// @include       *
// @copyright     JoeSimmons
// @version       1.2.1
// @license       http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @grant         GM_addStyle
// ==/UserScript==

/**
    WIKI ==> https://github.com/joesimmons/jsl/wiki/
**/

(function (window, undefined) {

    'use strict'; // use strict mode in ECMAScript-5

    var version = '1.2.1'; // this will be used for JSL.prototype.version
    var intervals = []; // for the setInterval/clearInterval methods

    // regular expressions
    var rSelector = /^\*|^\.[a-z][\w\d-]*|^#[^ ]+|^[a-z]+|^\[a-z]+/i; // matches a CSS selector
    var rXpath = /^\.?\/{1,2}[a-zA-Z\*]+/;                            // matches an XPath query
    var rHTML = /<[^>]+>/;                                            // matches a string of HTML
    var rHyphenated = /-([a-zA-Z])/g;                                 // matches alphabetic, hyphenated strings
    var rElementObject = /^\[object HTML([a-zA-Z]+)?Element\]$/;      // matches the toString value of an element
    var rWindowObject = /^\[object Window\]$/;                        // matches the toString value of a window object
    var rValidVarname = /^[a-zA-Z$_][a-zA-Z0-9$_]*$/;                 // matches a valid variable name

    // compatibility methods for browsers that don't support ECMAScript-5
    var compat = {
        'arr_indexOf' : function (searchElement, fromIndex) {
            var index = parseInt(fromIndex || 0, 10), len = this.length;
                index = index < 0 ? len + index : index; // handle negative fromIndex
                index = !(index > 0) ? 0 : index; // handle out of range and/or NaN fromIndex

            while (index < len && index >= 0) {
                if (this[index] === searchElement) {
                    return index;
                }
                index += 1;
            }

            return -1;
        },
        /*
        'filter' : function (fn, oThis) {
            var index, value, len = this.length, ret = [];

            for (index = 0; index < len; index += 1) {
                value = this[index];
                if ( fn.call(oThis, value, index, this) ) {
                    ret.push(value);
                }
            }

            return ret;
        },
        */
        'forEach' : function (fn, oThis) {
            var index, len;

            for (index = 0, len = this.length; index < len; index += 1) {
                fn.call(oThis, this[index], index, this);
            }
        },
        'map' : function (fn, oThis) {
            var index, newArr = [], len;

            for (index = 0, len = this.length; index < len; index += 1) {
                newArr[index] = fn.call(oThis, this[index], index, this);
            }

            return newArr;
        },
        'reduce' : function (fn, initialValue) {
            var index, len, value, isValueSet = false;

            if (arguments.length > 1) {
                value = initialValue;
                isValueSet = true;
            }

            for (index = 0, len = this.length; index < len; index += 1) {
                if (isValueSet) {
                    value = fn(value, this[index], index, this);
                } else {
                    value = this[index];
                    isValueSet = true;
                }
            }

            return value;
        }
    };

    // gets a method from an object's prototype. returns undefined if not found
    var getMethod = function (obj, method) {
        if (typeof XPCNativeWrapper === 'function' && typeof XPCNativeWrapper.unwrap === 'function') {
            obj = XPCNativeWrapper.unwrap(obj);
        } else if (obj.wrappedJSObject) {
            obj = obj.wrappedJSObject;
        }

        if (obj.prototype && typeof obj.prototype[method] === 'function') {
            return obj.prototype[method];
        }
    };

    // original methods for some common uses
    var core = {
        // array
        'arr_indexOf' : getMethod(Array, 'indexOf') || compat.arr_indexOf,
        'concat' : getMethod(Array, 'concat'),
        'filter' : getMethod(Array, 'filter') || compat.filter,
        'forEach' : getMethod(Array, 'forEach') || compat.forEach,
        'map' : getMethod(Array, 'map') || compat.map,
        'reduce' : getMethod(Array, 'reduce') || compat.reduce,
        'slice' : getMethod(Array, 'slice'),

        // object
        'hasOwnProperty' : getMethod(Object, 'hasOwnProperty'),
        'toString' : getMethod(Object, 'toString'),
    };

    var JSL = function JSL(selector, context) {
        return new JSL.fn.init(selector, context);
    };

    // a simple class for dealing with event listener handlers
    var handlers = {
        stack : [],

        add : function (thisElement, type, fn) {
            this.stack.push({
                element : thisElement,
                type : type,
                fn : fn
            });
        },

        get : function (thisElement, type) {
            var events = [];
                type = typeof type === 'string' ? type : '*';

            JSL.each(this.stack, function (thisEventObj) {
                if (thisElement === thisEventObj.element) {
                    if (type === '*' || thisEventObj.type === type) {
                        events.push(thisEventObj);
                    }
                }
            });

            return events;
        },

        remove : function (thisElement, type) {
            var handlerIndices = [], that = this;

            // find all the indices of what we need to remove
            JSL.each(handlers.get(thisElement, type), function (thisEventObj, index, array) {
                handlerIndices.push(
                    core.arr_indexOf.call(that.stack, thisEventObj)
                );
            });

            // remove all the indices here, using a separate array of indices
            // we can't do this as we loop over the (stack) array itself, because
            // we would be removing values as they are being iterated through
            JSL.each(handlerIndices, function (thisIndex) {
                that.stack.splice(thisIndex, 1);
            });
        }
    };

    // Node.prototype.matchesSelector compat for vendor prefixes
    function matchesSelector(element, selector) {
        if (element && typeof selector === 'string') {
            if (typeof element.mozMatchesSelector === 'function') {
                // Mozilla
                return element.mozMatchesSelector(selector);
            } else if (typeof element.webkitMatchesSelector === 'function') {
                // Webkit
                return element.webkitMatchesSelector(selector);
            } else if (typeof element.oMatchesSelector === 'function') {
                // Opera
                return element.oMatchesSelector(selector);
            } else if (typeof element.msMatchesSelector === 'function') {
                // IE
                return element.msMatchesSelector(selector);
            }
        }

        return false;
    }

    // calls 'this' with the first parameter as the first argument 
    function call(a) {
        return this(a);
    }

    function toCamelCase(string) {
        return string.replace(rHyphenated, function (fullMatch, firstGroup) {
            return firstGroup.toUpperCase();
        });
    }

    // walkTheDom by Douglas Crockford
    function walkTheDom(node, func) {
        func(node);
        node = node.firstChild;

        while (node) {
            walkTheDom(node, func);
            node = node.nextSibling;
        }
    }

    // can pluck a key out of an object
    function pluck(obj) {
        var subs = this.split('.'),
            ret = obj, i;

        for (i = 0; i < subs.length; i += 1) {
            ret = ret[ subs[i] ];
            if (ret == null) {
                return '';
            }
        }

        return ret;
    }

    function sum(curValue, nextValue) {
        return curValue + nextValue;
    }

    function sumInt(curValue, nextValue) {
        return parseInt(curValue, 10) + parseInt(nextValue, 10);
    }

    // internal function for throwing errors, so the user gets
    // some sort of hint as to why their operation failed
    function error(errorString) {
        if (typeof window.Error === 'function') {
            throw new Error(errorString);
        } else if (typeof window.console === 'object' && typeof console.error === 'function') {
            console.error(errorString);
        }
    }

    // will copy an element and return a new copy with the same event listeners
    function cloneElement(thisElement) {
        var newElement = thisElement.cloneNode(true);

        // clone event listeners of element
        JSL.each(handlers.get(thisElement), function (thisEventObj) {
            JSL.addEvent(newElement, thisEventObj.type, thisEventObj.fn);
        });

        return newElement;
    }

    function getEachElements(array, selector, key, type) {
        var newElementsArray = [],
            isValidSelector = typeof selector === 'string' && selector.trim() !== '';

        JSL.each(array, function (currentElement) {
            while ( currentElement = currentElement[key] ) { // note: intentional assignment
                if (type > 0 ? currentElement.nodeType === type : true) {
                    if ( isValidSelector === false || JSL(currentElement).filter(selector).exists ) {
                        newElementsArray.push(currentElement);
                        return;
                    }
                }
            }
        });

        return newElementsArray;
    }

    // this will take 
    function doElementOperationOnEach(args, op) {
        var newElementsArray = [], newElement,
            passedElements = JSL.create.apply(JSL, args);

        if (this.exists) {
            if (JSL.typeOf(passedElements) === 'array') {
                this.each(function (thisElement) {
                    JSL.each(passedElements, function (passedElement) {
                        // clone the element
                        var newElement = cloneElement(passedElement);

                        // add the new elements to an array
                        newElementsArray.push(newElement);

                        // perform the passed operation on the element
                        op(thisElement, newElement);
                    });
                });
            } else {
                this.each(function (thisElement) {
                    // clone the element
                    var newElement = cloneElement(passedElements);

                    // add the new elements to an array
                    newElementsArray.push(newElement);

                    // perform the passed operation on the element
                    op(thisElement, newElement);
                });
            }
        }

        return newElementsArray;
    }

    // define JSL's prototype, aka JSL.fn
    JSL.fn = JSL.prototype = {
        isJSL : true,
        constructor : JSL,
        length : 0,
        version : version,

        // similar to jQuery. JSL is just the init constructor
        init : function (selector, context) {
            var selectorStringValue = core.toString.call(selector),
                that = this,
                elems = [];

            switch (typeof selector) {
                case 'string': {  // -- STRING --
                    if ( selector.match(rXpath) ) {
                        // handle an XPath expression
                        elems = JSL.xpath({expression : selector, type : 7, context : context});
                    } else if ( selector.match(rHTML) ) {
                        // reserved for html code creation
                        // not sure if I want to implement it
                    } else if ( selector.match(rSelector) ) {
                        if (JSL.typeOf(context) === 'array') {
                            // handle an array being passed as the context
                            return that.find.call(context, selector);
                        } else if (typeof context === 'string') {
                            // handle a selector being passsed as the context
                            context = JSL(context);
                            if (context.exists) {
                                return JSL(selector, context[0]);
                            }
                        } else if (context != null && context.isJSL === true && context.exists) {
                            // handle a JSL object being passsed as the context
                            return JSL( selector, context[0] );
                        } else {
                            // handle a regular element being passed as the context
                            context = context != null && context.querySelectorAll ? context : document;
                            elems = context.querySelectorAll(selector);
                        }
                    }
                    break;
                }
                // ---------------------------------------------------
                case 'object': {  // -- OBJECT --
                    if (selector != null) {
                        if (selector.isJSL === true) {
                            // handle a JSL object
                            return selector;
                        } else if ( core.hasOwnProperty.call(selector, 'length') ) {
                            // handle an array-like object
                            elems = selector;
                        } else if ( selectorStringValue.match(rElementObject) || selectorStringValue.match(rWindowObject) ) {
                            // handle a single element
                            elems = [selector];
                        }
                    }
                    break;
                }
                // ---------------------------------------------------
                default: {        // -- UNKNOWN --
                    if ( selectorStringValue.match(rElementObject) || selectorStringValue.match(rWindowObject) ) {
                        // handle elements that are typeof === 'function'
                        // e.g., object, applet, embed
                        elems = [selector];
                    }
                }
            }

            // define the length property of our object wrapper
            that.length = elems.length;

            // bind the elements to array-like key:value pairs in our wrapper
            // e.g., this[0] ==> element
            JSL.each(elems, function (value, index) {
                that[index] = value;
            });

            return that;
        },

        // --- STARTING LINE FOR THE JSL WRAPPER METHODS
        add : function (selector, context) {
            var newElements = JSL(selector, context).raw(),
                allElements = core.concat.call(this.raw(), newElements);
            return JSL(allElements);
        },

        addEvent : function (type, fn) {
            return this.each(function (thisElement) {
                JSL.addEvent(thisElement, type, fn);
            });
        },

        after : function () {
            var newElementsArray = doElementOperationOnEach.call(this, JSL.toArray(arguments), function (baseElement, newElement) {
                var parent = baseElement.parentNode,
                    next = baseElement.nextSibling;

                if (parent) {
                    if (next) {
                        // add the newElement after the current element
                        parent.insertBefore(newElement, next);
                    } else {
                        // nextSibling didn't exist. just append to its parent
                        parent.appendChild(newElement);
                    }
                }
            });

            return JSL(newElementsArray);
        },

        append : function () {
            var newElementsArray = doElementOperationOnEach.call(this, JSL.toArray(arguments), function (baseElement, newElement) {
                baseElement.appendChild(newElement);
            });

            return JSL(newElementsArray);
        },

        attribute : function (name, value) {
            var ret = '', valueIsValid = value != null;

            if ( typeof name === 'string' && this.exists ) {
                    this.each(function (elem) {
                        if (valueIsValid) {
                            elem.setAttribute(name, value);
                        } else {
                            ret += elem.getAttribute(name) || '';
                        }
                    });
            }

            return valueIsValid ? this : ret;
        },

        before : function () {
            var newElementsArray = doElementOperationOnEach.call(this, JSL.toArray(arguments), function (baseElement, newElement) {
                var parent = baseElement.parentNode;

                // add the newElement before the current element
                if (parent) {
                    parent.insertBefore(newElement, baseElement);
                }
            });

            return JSL(newElementsArray);
        },

        center : function () {
            return this.each(function (thisElement) {
                thisElement = JSL(thisElement);
                thisElement.css('position', 'fixed');
                thisElement.css('top', Math.floor( (window.innerHeight - thisElement.height) / 2 ) + 'px');
                thisElement.css('left', Math.floor( (window.innerWidth - thisElement.width) / 2 ) + 'px');
            });
        },

        clone : function () {
            var clonedElements = core.map.call(this, cloneElement); // variable for clarity
            return JSL(clonedElements);
        },

        css : function (name, value) {
            if (typeof name === 'string') {
                // convert the hyphenated string to camel-case
                name = toCamelCase(name);

                if (typeof value === 'string') {
                    return this.each(function (thisElement) {
                        if (name in thisElement.style) {
                            thisElement.style[name] = value;
                        }
                    });
                }

                return core.map.call(this, pluck, 'style.' + name).join('');
            } else {
                return this;
            }
        },

        each : function (fn, oThis) {
            if (this.exists) {
                JSL.each(this, fn, oThis);
            }

            return this;
        },

        get exists() {
            return this.length > 0 && this[0] != null;
        },

        filter : function (selector) {
            var newElementsArray = [];

            if (typeof selector === 'string') {
                this.each(function (thisElement) {
                    if ( matchesSelector(thisElement, selector) ) {
                        newElementsArray.push(thisElement);
                    }
                });
            }

            // returns an empty JSL object if no elements are matched
            return JSL(newElementsArray);
        },

        find : function (selector) {
            var arrayOfMatchesArrays = core.map.call(this, function (thisElement) {
                var matches = thisElement.querySelectorAll(selector);
                return JSL.toArray(matches);
            });
            var singleArrayOfMatches = arrayOfMatchesArrays.length > 0 ?
                core.reduce.call(arrayOfMatchesArrays, function (a, b) {
                    return core.concat.call(a, b);
            }) : [];

            return JSL(singleArrayOfMatches);
        },

        first : function () {
            return this.get(0);
        },

        get : function (index) {
            index = index === 'first' ? 0 : index === 'last' ? -1 : parseInt(index, 10);

            if ( !isNaN(index) ) {
                return JSL( index < 0 ? this[this.length + index] : this[index] );
            }

            return JSL.toArray(this);
        },

        get height() {
            var arrayOfElemHeights = core.map.call(this, pluck, 'offsetHeight');
            return core.reduce.call(arrayOfElemHeights, sum);
        },

        has : function (selector) {
            var newElementsArray = [];

            if ( typeof selector === 'string' && selector.match(rSelector) ) {
                this.each(function (thisElement) {
                    if ( JSL(selector, thisElement).exists ) {
                        newElementsArray.push(thisElement);
                    }
                });
            }

            return JSL(newElementsArray);
        },

        hide : function () {
            return this.css('display', 'none');
        },

        /*
        get inView(passedContainer) {
            var isInView = false;
            
            this.each(function (thisElement) {
                var container = passedContainer || thisElement.parentNode;
                var visible = !!( (container.scrollTop + container.offsetHeight) >= thisElement.offsetTop &&
                           (container.scrollTop - thisElement.offsetHeight) <= thisElement.offsetTop );

                if (visible) {
                    isInView = true;
                }
            });
        },
        */

        is : function (selector) {
            for (var i = 0; i < this.length; i += 1) {
                if ( matchesSelector(this[i], selector) ) {
                    return true;
                }
            }
            
            return false;
        },
        
        isnt : function (selector) {
            return !this.is(selector);
        },

        last : function (selector) {
            return this.get(-1);
        },

        next : function (selector) {
            return JSL( getEachElements(this, selector, 'nextSibling', 1) );
        },

        not : function (selector) {
            var newElementsArray = [];

            if ( typeof selector === 'string' && selector.match(rSelector) ) {
                this.each(function (thisElement) {
                    if ( JSL(thisElement).isnt(selector) ) {
                        newElementsArray.push(thisElement);
                    }
                });
            }

            return JSL(newElementsArray);
        },

        parent : function (selector) {
            return JSL( getEachElements(this, selector, 'parentNode', 1) );
        },

        prepend : function () {
            var newElementsArray = doElementOperationOnEach.call(this, JSL.toArray(arguments), function (baseElement, newElement) {
                var firstChild = baseElement.firstChild;

                if (firstChild) {
                    baseElement.insertBefore(newElement, firstChild);
                }
            });

            return JSL(newElementsArray);
        },

        prev : function (selector) {
            return JSL( getEachElements(this, selector, 'previousSibling', 1) );
        },

        prop : function (name, value) {
            var valueIsValid = value != null, ret;

            if (typeof name === 'string' && this.exists) {
                    this.each(function (thisElement) {
                        if (valueIsValid) {
                            thisElement[name] = value;
                        } else {
                            if (typeof ret === 'undefined') {
                                ret = thisElement[name];
                            } else {
                                ret += thisElement[name];
                            }
                        }
                    });
            }

            return valueIsValid ? this : ret;
        },

        raw : function () {
            return [].slice.call(this, 0);
        },

        remove : function () {
            return this.each(function (element) {
                var parent = element.parentNode;
                if (element && parent) {
                    parent.removeChild(element);
                }
            });
        },

        removeAttribute : function (attributeName) {
            return this.each(function (thisElement) {
                thisElement.removeAttribute(attributeName);
            });
        },

        removeEvent : function (type) {
            return this.each(function (thisElement) {
                JSL.removeEvent(thisElement, type);
            });
        },

        replace : function () {
            var newElementsArray = doElementOperationOnEach.call(this, JSL.toArray(arguments), function (baseElement, newElement) {
                var parent = baseElement.parentNode;

                if (parent) {
                    parent.replaceChild(newElement, baseElement);
                }
            });

            return JSL(newElementsArray);
        },

        show : function (value) {
            value = typeof value === 'string' ? value : 'inline';
            return this.css('display', value);
        },
        
        text : function (passedText, append) {
            // handle setting text
            if (typeof passedText === 'string') {
                if (append !== true) {
                    this.each(function (thisElement) {
                        JSL('.//text()', thisElement).each(function (textNode) {
                            textNode.data = '';
                        });
                    });
                }

                this.append('text', passedText);
                return this;
            }

            // handle getting text
            return core.reduce.call(this, function (curValue, nextElement) {
                return curValue + nextElement.textContent;
            }, '');
        },

        toggle : function () {
            return this.each(function (thisElement) {
                thisElement = JSL(thisElement);

                if (thisElement.visible) {
                    thisElement.hide();
                } else {
                    thisElement.show();
                }
            });
        },

        value : function (passedValue) {
            var elem = this[0],
                tagName = elem && elem.tagName || '',
                selectedOptions = [],
                rInputTypeBlacklist = /button|checkbox|file|image|radio|reset|submit/,
                passedValueType = JSL.typeOf(passedValue);

            if (passedValue == null) {
                // no arguments were passed, return a value
                    if (tagName === 'SELECT') {
                        if ( elem.hasAttribute('multiple') ) {
                            JSL.each(elem.options, function (thisOption) {
                                if (thisOption.selected) {
                                    selectedOptions.push(thisOption.value);
                                }
                            });

                            return selectedOptions;
                        } else {
                            return elem.options[elem.selectedIndex].value;
                        }
                    } else if ( tagName === 'INPUT' && !elem.type.match(rInputTypeBlacklist) ) {
                        return elem.value;
                    }
                    if (tagName === 'TEXTAREA') {
                        return elem.value;
                    }
            } else {
                // an argument was passed, set the value on each element
                return this.each(function (thisElement) {
                    var tagName = thisElement.tagName;

                    if (tagName === 'SELECT') {
                        if (thisElement.hasAttribute('multiple') && passedValueType === 'array') {
                                JSL.each(thisElement.options, function (thisOption) {
                                    JSL.each(passedValue, function (thisPassedValue) {
                                        if (thisOption.value == thisPassedValue) {
                                            thisOption.selected = true;
                                            return 'stop';
                                        } else {
                                            thisOption.selected = false;
                                        }
                                    });
                                });
                        } else {
                            JSL.each(thisElement.options, function (thisOption) {
                                thisOption.selected = thisOption.value == passedValue;
                            });
                        }
                    } else if (tagName === 'INPUT') {
                        if ( !thisElement.type.match(rInputTypeBlacklist) ) {
                            thisElement.value = passedValue;
                        } else if (thisElement.type === 'checkbox' || thisElement.type === 'radio') {
                            if (passedValueType === 'array') {
                                JSL.each(passedValue, function (thisPassedValue) {
                                    if (thisElement.value == thisPassedValue) {
                                        thisElement.checked = true;
                                        return 'stop';
                                    } else {
                                        thisElement.checked = false;
                                    }
                                });
                            } else if (thisElement.value == passedValue) {
                                 thisElement.checked = true;
                            }
                        }
                    } else if (tagName === 'TEXTAREA') {
                        thisElement.value = passedValue;
                    }
                });
            }

            return null;
        },

        get visible() {
            return Math.max(this.width, this.height) > 0;
        },

        get width() {
            var arrayOfElemHeights = core.map.call(this, pluck, 'offsetWidth');
            return core.reduce.call(arrayOfElemHeights, sum);
        },
    };

    // give the init function the JSL prototype for later instantiation
    JSL.fn.init.prototype = JSL.fn;

    // extend method. can extend any object it's run upon
    JSL.fn.extend = JSL.extend = function (obj) {
        var name, copy;

        for (name in obj) {
            copy = obj[name];

            if ( !core.hasOwnProperty.call(this, name) && typeof copy !== 'undefined' ) {
                this[name] = copy;
            }
        }
    };

    // --- STARTLING LINE FOR THE DIRECT JSL METHODS
    JSL.extend({
        addEvent : function (thisElement, type, fn) {
            if (thisElement != null && typeof type === 'string' && typeof fn === 'function') {
                if (typeof thisElement.addEventListener === 'function') {
                    thisElement.addEventListener(type, fn, false);
                } else if (typeof thisElement.attachEvent === 'function') {
                    type = 'on' + type;
                    thisElement.attachEvent(type, fn);
                } else {
                    return;
                }

                handlers.add(thisElement, type, fn);
            }
        },

        addScript : function (contents, id, node) {
            var newElement = document.createElement('script');
            newElement.id = id || ( 'jsl-script-' + JSL.random(999) );
            newElement.innerHTML = contents;

            node = node || document.head || document.querySelector('html > head');
            node.appendChild(newElement);

            return {
                remove : function () {
                    node.removeChild(newElement);
                }
            };
        },

        addStyle : function (css, id, node) {
            id = id || ( 'jsl-style-' + JSL.random(999) );
            node = node || document.head || document.querySelector('html > head');
            if (node) {
                node.appendChild(
                    JSL.create('style', {id : id, type : 'text/css'}, [ JSL.create('text', css) ] )
                );
            }
        },

        alias : function (newAlias) {
            if (typeof newAlias === 'string' && newAlias.match(rValidVarname) && typeof window[newAlias] === 'undefined') {
                window[newAlias] = JSL;
            }
        },

        clearInterval : function (index) {
            if (typeof index === 'number' && index < intervals.length) {
                window.clearTimeout( intervals[index] );
                intervals[index] = null;
            }
        },

        create : function (elementName, descObj, kidsArray) {
            var argsLength = arguments.length,
                typeValue, prop, val, HTMLholder, ret, i;

            // handle text node creation and HTML strings
            if (argsLength === 2 && elementName === 'text' && typeof descObj === 'string') {
                return document.createTextNode(descObj);
            } else if ( argsLength === 1 && typeof elementName === 'string' && elementName.match(rHTML) ) {
                // take the HTML string and put it inside a div
                HTMLholder = document.createElement('div');
                HTMLholder.innerHTML = elementName;

                // add each childNode to an array to return
                ret = [];
                ret.push.apply(ret, HTMLholder.childNodes);
                return ret.length > 0 ? (ret.length === 1 ? ret[0] : ret) : null;
            } else if (argsLength > 1 && typeof elementName === 'string' && typeof descObj === 'object') {
                ret = document.createElement(elementName + '');

                for (prop in descObj) {
                    if ( core.hasOwnProperty.call(descObj, prop) ) {
                        val = descObj[prop];
                        if (prop.indexOf('on') === 0 && typeof val === 'function') {
                            JSL.addEvent(ret, prop.substring(2), val);
                        } else if ( prop !== 'style' && prop !== 'class' && prop in ret && typeof ret[prop] !== 'undefined' ) {
                            ret[prop] = val;
                        } else {
                            ret.setAttribute(prop, val);
                        }
                    }
                }

                if (JSL.typeOf(kidsArray) === 'array') {
                    JSL.each(kidsArray, function (kid) {
                        var val, item, i;

                        if (typeof kid === 'string') {
                            val = JSL.create(kid)

                            if (JSL.typeOf(val) === 'array') {
                                for (i = 0; i < val.length; i += 1) {
                                    ret.appendChild( val[i] );
                                }
                            } else if (JSL.typeOf(kid) === 'element') {
                                ret.appendChild(kid);
                            }
                        } else if (JSL.typeOf(kid) === 'element') {
                            ret.appendChild(kid);
                        }
                    });
                }

                return ret;
            } else if (argsLength === 1 && JSL.typeOf(elementName) === 'element') {
                return elementName;
            }
        },

        each : function (passedArray, fn, oThis) {
            var isOthisUndefined = typeof oThis !== 'undefined',
                index, len, otherThis, value;

            for (index = 0; index < passedArray.length; index += 1) {
                value = passedArray[index];
                otherThis = isOthisUndefined ? oThis : value;
                if (fn.call(otherThis, value, index, passedArray) === 'stop') {
                    break;
                }
            }
        },

        loop : function (maxIterations, fn) {
            var args = JSL.toArray(arguments), i;

            if (typeof maxIterations === 'number' && maxIterations > 0 && typeof fn === 'function') {
                args = args.slice(2);
                for (i = 0; i < maxIterations; i += 1) {
                    fn.apply(null, args);
                }
            }
        },

        random : function (maxInteger) {
            var rand = 0;

            while (rand <= 0 || rand > maxInteger) {
                rand = Math.floor( Math.random() * maxInteger ) + 1;
            }

            return rand;
        },

        removeEvent : function (thisElement, type) {
            JSL.each(handlers.get(thisElement, type), function (thisEventObj) {
                if (typeof thisElement.removeEventListener === 'function') {
                    thisEventObj.element.removeEventListener(thisEventObj.type, thisEventObj.fn, false);
                } else if (typeof thisElement.detachEvent === 'function') {
                    type = 'on' + type;
                    thisEventObj.element.detachEvent(thisEventObj.type, thisEventObj.fn);
                }

                handlers.remove(thisElement, type);
            });
        },

        runAt : function (state, func, oThis) {
            var args = JSL.toArray(arguments), intv,

                // compose a list of the 4 states, to use .indexOf() upon later
                states = ['uninitialized', 'loading', 'interactive', 'complete'],

                // in-case they pass [start/end] instead of [loading/complete]
                state = state.replace('start', 'loading').replace('end', 'complete');

            // this will run their function with the specified arguments, if any,
            // and a custom 'this' value, if specified
            function runFunc() {
                func.apply( oThis, args.slice(3) );
            }

            // this will run on each state change if the specified state is
            // not achieved yet. it will run their function when it is achieved
            function checkState() {
                if (document.readyState === state) {
                    runFunc();
                    JSL.clearInterval(intv);
                }
            }

            if ( core.arr_indexOf.call(states, state) <= core.arr_indexOf.call(states, document.readyState) ) {
                // we are at, or have missed, our desired state
                // run the specified function
                runFunc();
            } else {
                intv = JSL.setInterval(checkState, 200);
            }
        },

        setInterval : function (func, delay) {
            var index = intervals.length,
                delay_orig = delay,
                count = 1, startTime;

            function doRe(func, delay) {
                return window.setTimeout(function () {
                    // drift accomodation
                    var difference = ( new Date().getTime() ) - startTime,
                        correctTime = delay_orig * count,
                        drift = difference - correctTime;

                    // execute the function before setting a new timeout
                    func.call(null);

                    // fix for when a timeout takes longer than double the original delay time to execute
                    if (drift > delay_orig) {
                        drift = delay_orig;
                    }

                    // save the reference of the new timeout in our 'intervals' stack
                    if (intervals[index] !== null) {
                        intervals[index] = doRe(func, delay_orig - drift);
                    }

                    count += 1;
                }, delay);
            }

            startTime = new Date().getTime();
            intervals[index] = doRe(func, delay_orig);

            return index;
        },

        toArray : function (arr) {
            var newArr = [], // new array to store the values into
                len = arr.length || arr.snapshotLength,
                item, i;

            if (typeof len === 'number' && len > 0) {
                if (typeof arr.snapshotItem === 'function') {
                    for (i = 0; ( item = arr.snapshotItem(i) ); i += 1) {
                        newArr.push(item);
                    }
                } else {
                    // if the specified 'list' is array-like, use slice on it
                    // to convert it to an array
                    newArr = core.slice.call(arr, 0);
                }
            }

            return newArr;
        },
        /*
        toString : function (item) {
            switch( JSL.typeOf(item) ) {
                case 'object': {
                    // todo
                }
                case 'array': {
                    // todo
                }
                case 'string': case 'number': {
                    return item + '';
                }
                default: {
                    return core.toString.call(item);
                }
            }
        },
        */
        // typeOf by Douglas Crockford. modified by JoeSimmons
        typeOf : function (value) {
            var s = typeof value,
                ostr = core.toString.call(value);
            if (s === 'object' || s === 'function') {
                if (value) {
                    if (ostr === '[object Array]') {
                        s = 'array';
                    } else if ( ostr === '[object Text]' || ostr.match(rElementObject) ) {
                        s = 'element';
                    } else if (ostr === '[object HTMLCollection]') {
                        s = 'collection';
                    } else if (ostr === '[object NodeList]') {
                        s = 'nodelist';
                    } else if (ostr === '[object Arguments]') {
                        s = 'arguments';
                    }
                } else {
                    s = 'null';
                }
            }
            return s;
        },

        /* to-do
        waitFor : function (info) {
            // function to wait for an element to be loaded,
            //     and optionally wait until a verifier function
            //     called returns true to load a 'done' callback
                {
                    selector : '#foo',

                    context : bar,

                    time : 10,

                    verifier : function (elem) {
                        return elem != null && elem.tagName === 'SPAN';
                    },

                    done : function (elem) {
                        doCallback(elem);
                    }
                }
        },
        */

        xpath : function (obj) {
            var type = obj.type || 7,
                types = {
                    '1' : 'numberValue',
                    '2' : 'stringValue',
                    '3' : 'booleanValue',
                    '8' : 'singleNodeValue',
                    '9' : 'singleNodeValue'
                },
                expression = obj.expression,
                context = obj.context || document,
                doc = document, xp;

                if (typeof context.evaluate === 'function') {
                    doc = context;
                } else if (typeof context.ownerDocument.evaluate === 'function') {
                    doc = context.ownerDocument;
                }

                xp = doc.evaluate(expression, context, null, type, null);

            if (!expression) {
                error('An expression must be supplied for JSL.xpath()');
                return null;
            }

            if ( types[type] ) {
                return xp[ types[ type ] ];
            } else {
                return JSL.toArray(xp);
            }
        }
    });

    // assign JSL to the window object
    window.JSL = window._J = JSL;

    // just for testing purposes
    // unsafeWindow.JSL = unsafeWindow._J = JSL;

}(window));

/* 
// JSL test button
// use it to test code on user click (non-automatic)
(function () {
    var mo = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            var target = mutation.target;

            if (mutation.attributeName === 'value' && target.value !== 'Run JSL test') {
                target.value = 'Run JSL test';
            }
        });
    });

    JSL(document.body).append(
        'input',
        {
            id : 'jsl_user_test',
            type : 'button',
            value : 'Run JSL test',
            style : 'display: block; position: fixed; top: 4px; right: 4px; z-index: 999999; padding: 2px 14px; font-size: 11pt; font-family: Arial, Verdana;',
            onclick : function () {
                JSL('body input').value('radio2');
            }
        }
    );

    mo.observe( JSL('#jsl_user_test')[0], { attributes : true } );
}());
 */
