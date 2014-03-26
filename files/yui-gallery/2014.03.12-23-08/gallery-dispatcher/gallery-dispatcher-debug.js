YUI.add('gallery-dispatcher', function(Y) {

/**
* <p>The Dispatcher satisfies a very common need of developers using the 
* YUI library: dynamic execution of HTML Fragments or remote content. Typical strategies to 
* fulfill this need, like executing the innerHTML property or referencing remote 
* scripts, are unreliable due to browser incompatibilities. The Dispatcher normalize 
* this behavior across all a-grade browsers.
* 
* <p>To use the Dispatcher Module, simply create a new object based on Y.Dispatcher
* and pass a reference to a node that should be handled.</p>
* 
* <p>
* <code>
* &#60;script type="text/javascript"&#62; <br>
* <br>
*       //  Call the "use" method, passing in "gallery-dispatcher".  This will <br>
*       //  load the script for the Dispatcher Module and all of <br>
*       //  the required dependencies. <br>
* <br>
*       YUI().use("gallery-dispatcher", function(Y) { <br>
* <br>
*           (new Y.Dispatcher ({<br>
*               node: '#demoajax',<br>
*               content: 'Please wait... (Injecting fragment.html)'<br>
*           })).set('uri', 'fragment.html');<br>
* <br>
* <br>      
*   &#60;/script&#62; <br>
* </code>
* </p>
*
* <p>The Dispatcher has several configuration properties that can be 
* set via an object literal that is passed as a first argument during the
* initialization, or using "set" method.
* </p>
*
* @module gallery-dispatcher
*/

//  Util shortcuts
var getClassName = Y.ClassNameManager.getClassName,

//  Frequently used strings
DISPATCHER = "dispatcher",
SC = "script",
DISPATCHER_FETCH = 'fetch',
DISPATCHER_PURGE = 'purge',
DISPATCHER_BEFOREEXECUTE = 'beforeExecute',
DISPATCHER_LOAD = 'load',
DISPATCHER_READY = 'ready',
DISPATCHER_ERROR = 'error',

//  Attribute keys
ATTR_URI = 'uri',
ATTR_CONTENT = 'content',
ATTR_AUTOPURGE = 'autopurge',
ATTR_LOADING = 'loading',
ATTR_NODE = 'node',
ATTR_NORMALIZE = 'normalize',

// Regular Expressions
reBODY = /<\s*body.*?>(.*?)<\/\s*?body[^>\w]*?>/i,
reHEAD = /<\s*head.*?>(.*?)<\/\s*?head[^>\w]*?>/i,

//  CSS class names
CLASS_DISPATCHER_LOADING = getClassName(DISPATCHER, 'loading'),

// shorthands
L = Y.Lang,
isBoolean = L.isBoolean,
isString = L.isString;

//  Utility functions
function _parseContent(content, normalize) {
    var fragment = Y.Node.create('<div></div>'),
        head = fragment.cloneNode(),
        o = {}, match = null, inject = '';
    
    // if normalize is set, let's parse the head
    if (normalize && (match = reHEAD.exec(content))) {
        Y.log('normalizing scripts, links and styles from the head tag', 'info', DISPATCHER);
        fragment.setContent(match[1]).all(SC+',style,link').each(function(n) {
            head.append(n);
        });
        inject = head.get('innerHTML');
        Y.log('trying to inject this content: '+inject, 'info', DISPATCHER);
    }

    // if the content has a body tag, we should take the content of the body, if not, assume full content
    // we should also include any injection from the head if exists
    fragment.setContent(inject+((match=reBODY.exec(content))?match[1]:content));
    
    o.js = fragment.all(SC).each(function(n) {
        n.get('parentNode').removeChild(n);
    });
    o.content = fragment.get('innerHTML');

    return o;
}

function _propagateIOEvent (ev, cfg, args) {
    if (cfg && cfg.on && cfg.on[ev]) {
        cfg.on[ev].apply(cfg.context || Y, args);
    }
}

/**
* The Dispatcher class represents an object that can manage Node Elements to
* inject HTML content as the content of the Node..
* @namespace Y
* @class Dispatcher
*/
Y.Dispatcher = Y.Base.create(DISPATCHER, Y.Base, [], {

    // Prototype Properties for Dispatcher

    /** 
    * @property _queue
    * @description Execution queue.
    * @default null
    * @protected
    * @type Object
    */  
    _queue: null,

    /** 
    * @property _io
    * @description Connection Handler for AJAX requests.
    * @default null
    * @protected
    * @type Object
    */
    _io: null,

    initializer: function(config) {
        var instance = this;
        config = config || {};
        Y.log('Initializer', 'info', DISPATCHER);
        instance._queue = new Y.AsyncQueue();

        instance.after(ATTR_CONTENT + "Change", function(e) {
            instance._dispatch(e.newVal);
        });

        instance.after(ATTR_URI + "Change", function(e) {
            instance._fetch(e.newVal);
        });

        // making the trick for content and uri in case the user want to set up thru config
        if (config[ATTR_CONTENT]) {
            instance._dispatch(instance.get(ATTR_CONTENT));
        }
        if (config[ATTR_URI]) {
            instance._fetch(instance.get(ATTR_URI));
        }

    },

    destructor: function() {
        var instance = this;
        instance.stop();
        instance._queue = null;
        instance._io = null;
    },

    //  Protected methods

    /**
     * @method _executeScript
     * @description Inject an inline script into the page as part of the dispatcher process. 
     * @protected
     * @param {string} text Script code that should be executed
     * @param {Node} n A reference to the original SCRIPT tag Node, in case you want to get more specific attributes
     */
    _executeScript: function (text, jsNode) {
        var doc = Y.config.doc,
            d = ( jsNode ? jsNode.get('ownerDocument') : null ) || doc,
            h = d.one('head') || d.get('documentElement'),
            // creating a new script node to execute the inline javascrip code
            newScript = Y.one(doc.createElement(SC));

        Y.log('inline script tag: ' + text, 'info', DISPATCHER);
        if (text) {
            newScript._node.text = text;
        }
        h.appendChild(newScript);
        // removing script nodes as part of the clean up process
        newScript.remove();
        if (jsNode) {
            jsNode.remove();
        }
    },

    /**
     * @method _getScript
     * @description Inject an external script into the page as part of the dispatcher process. Due
     * the async nature of this routine, we need to run the queue after the execution.
     * @protected
     * @param {string} src URI of the script that need to be injected
     * @param {Node} n A reference to the original SCRIPT tag Node, in case you want to get more specific attributes
     */
    _getScript: function (src, jsNode) {
        var instance = this,
            q = instance._queue;
        Y.log('external script tag: ' + src, 'info', DISPATCHER);
        Y.Get.script(src, {
            autopurge: true, //removes the script node immediately after executing it
            onFailure: function(o) {
                Y.log('external script tag fails to load: ' + src, 'error', DISPATCHER);
                // notifying that an error has occurred 
                instance.fire(DISPATCHER_ERROR, o);
            },
            onEnd: function(o) {
                // continuing the async execution
                if (q) {
                    q.run();
                }
            }
        });
    },

    /**
     * @method _setContent
     * @description Set a new content into the dispatcher host node.
     * @protected
     * @param {string} content HTML code that will replace the current content
     */    
    _setContent: function (content) {
        var n = this.get(ATTR_NODE);
        Y.log('setting new content: ' + content, 'info', DISPATCHER);
        n.setContent(content);
    },

    /**
     * @method _purgeContent
     * @description Purge all the child node in preparation for a new content to be injected.
     * @protected
     */    
    _purgeContent: function() {
        var n = this.get(ATTR_NODE);
        Y.log('purging children collection', 'info', DISPATCHER);
        n.get('children').each(function(c) {
            c.purge(true);
        });
    },

    /**
     * @method _dispatch
     * @description Dispatch a content into the code, parsing out the scripts, 
     * injecting the code into the DOM, then executing the scripts.
     * @protected
     * @param {string} content html content that should be injected in the page
     * @return null
     */
    _dispatch: function(content) {
        var instance = this,
            o = _parseContent(content, instance.get(ATTR_NORMALIZE)),
            q = instance._queue,
            n = instance.get(ATTR_NODE);

        // stopping any previous process, just in case...
        instance.stop();

        if (!n) {
            Y.log('Dispatcher requires a NODE to dispatch the content', 'error', DISPATCHER);
            return;
        }

        Y.log('dispatching a new content', 'info', DISPATCHER);

        // autopurging children collection
        if (instance.get(ATTR_AUTOPURGE)) {
            q.add({
                fn: function() {
                    instance._purgeContent();
                    /**
                     * Notification event right after purging all the event listeners associated to the 
                     * Node that will be updated to avoid memory leaks. At this point, you can also destroy
                     * any object associated to that content. Immidiately after this, the new content will be
                     * injected. Use this event to clean up the mess before injecting new content.
                     *
                     * @event purge
                     * @param n {Node} a reference to the Node that was updated.
                     */
                    instance.fire(DISPATCHER_PURGE, n);
                }
            });
        }
        // injecting new content
        q.add({
            fn: function() {
                instance._setContent(o.content);
                /**
                 * Notification event right before starting the execution of the script tags associated
                 * to the current content. At this point, the content (without script tags) was already
                 * injected within the node, so, you can enhance that content right before process to the
                 * execution process.
                 *
                 * @event beforeExecute
                 * @param n {Node} a reference to the Node that was updated.
                 */
                instance.fire(DISPATCHER_BEFOREEXECUTE, n);
            }
        });
        // executing JS blocks before the injection
        o.js.each(function(jsNode) {
            if (jsNode && jsNode.get('src')) {
                q.add({
                    fn: Y.bind(instance._getScript, instance, jsNode.get('src'), jsNode),
                    autoContinue: false
                });
            } else {
                q.add({
                    fn: Y.bind(instance._executeScript, instance, jsNode._node.text, jsNode)
                });
            }
        });
        q.add({
            fn: function() {
                /**
                 * Notification event when the new content gets injected and scripts loaded and executed
                 * as well. This is the event that you should listen for to continue your programm after 
                 * dispatcher finishes the whole process.
                 *
                 * @event ready
                 */
                 instance.fire(DISPATCHER_READY);
            }
        });
        // executing the queue
        instance._queue.run();
    },
    
    /**
    * @description Fetching a remote file using Y.io. The response will be dispatched thru _dispatch method...
    * @method _fetch
    * @protected
    * @param {string} uri uri that should be loaded using Y.io
    * @return object  Reference to the connection handler
    */
    
    _fetch: function(uri) {
        var instance = this,
            defIOConfig = instance.get("ioConfig") || {}, 
            cfg;
        // stopping any previous process, just in case...
        instance.stop();

        if (!uri) {
            return false;
        }

        Y.log('dispatching a new url ' + uri, 'info', DISPATCHER);

        // minimal config + def attr ioConfig + arg cfg ; in that order or priority (single level merge)
        cfg = Y.merge({
            method: 'GET'
        }, defIOConfig);
            
        cfg.on = {
            start: function() {
                instance._set(ATTR_LOADING, true);
                Y.log('Start Loading', 'info', DISPATCHER);
                _propagateIOEvent ('start', defIOConfig, arguments);
            },
            success: function(tid, o) {
                Y.log('Success: ' + o.responseText, 'info', DISPATCHER);
                instance.set(ATTR_CONTENT, o.responseText);
                _propagateIOEvent ('success', defIOConfig, arguments);
            },
            failure: function(tid, o) {
                Y.log('Failure: ' + uri, 'warn', DISPATCHER);
                _propagateIOEvent ('failure', defIOConfig, arguments);
                /**
                 * Notification event when dispatcher fails to load the new url
                 * using io, or fails to load an external script using Y.Get.script.
                 * Use this event to fallback if an error occur.
                 *
                 * @event error
                 * @param o {object} error object from IO or Get.
                 */
                instance.fire(DISPATCHER_ERROR, o);
            },
            end: function() {
                instance._set(ATTR_LOADING, false);
                Y.log('End Loading', 'info', DISPATCHER);
                _propagateIOEvent ('end', defIOConfig, arguments);
            }
        };
        cfg.context = instance;
        return (instance._io = Y.io(uri, cfg));
    },

    //  Public methods
    
    /**
     * @method stop
     * @description Cancel the current loading and execution process immediately
     * @public
     * @return  {object} reference for chaining
     */
    stop: function() {
        var instance = this;
        instance._queue.stop();
        if (instance._io) {
            instance._io.abort();
        }
        return instance;
    }

}, {

    // Static Properties for Dispatcher
    
    EVENT_PREFIX: DISPATCHER,
    /**
     * Static property used to define the default attribute configuration of
     * the component.
     *
     * @property Y.Dispatcher.ATTRS
     * @Type Object
     * @static
     */
    ATTRS: {

        /**
        * YUI Node Object that represent a dynamic area in the page.  
        * @attribute node
        * @default null
        * @type object
        */
        node: {
            value: null,
            setter: function(n) {
                // stopping the current process if needed to define a new node
                this.stop();
                return Y.one(n);
            }
        },
        /**
        * If dispatcher should purge the DOM elements before replacing the content
        * @attribute autopurge
        * @default true
        * @type boolean
        */
        autopurge: {
            value: true,
            validator: isBoolean
        },
        /**
        * If dispatcher should analyze the content before injecting it. This will help 
        * to support full html document injection, to collect scripts and styles from head if exists, etc.
        * @attribute normalize
        * @default false
        * @type boolean
        */
        normalize: {
            value: false,
            validator: isBoolean
        },
        /**
        * URL that should be injected within the host
        * @attribute uri
        * @default null
        * @type string
        */
        uri: {
            value: null,
            validator: function(v) {
                return (v && isString(v) && (v !== ''));
            }
        },
        /**
        * default content for the dynamic area
        * @attribute content
        * @default empty
        * @type string
        */
        content: {
            value: '',
            validator: isString
        },
        /**
        * Boolean indicating that a process is undergoing.
        * 
        * @attribute loading
        * @default false
        * @readonly
        * @type {boolean}
        */
        loading: {
            value: false,
            validator: isBoolean,
            readOnly: true,
            setter: function(v) {
                var instance = this;
                Y.log('setting status to ' + v, 'info', DISPATCHER);
                if (v) {
                    /**
                     * Notification event when dispatcher starts the loading process
                     * using io. Equivalent to Y.on('io:start'). Right before this event, dispatcher 
                     * adds the loading class from the node. This event will be triggered before the 
                     * function defined under attribute "ioConfig.start". 
                     *
                     * @event fetch
                     */
                    instance.fire(DISPATCHER_FETCH);
                    instance.get(ATTR_NODE).addClass(CLASS_DISPATCHER_LOADING);
                } else {
                    /**
                     * Notification event when dispatcher finishes the loading process
                     * using io. Equivalent to Y.on('io:end'). Right after this event, dispatcher 
                     * removes the loading class from the node.This event will be triggered before the 
                     * function defined under attribute "ioConfig.end".
                     *
                     * @event load
                     */
                    instance.fire(DISPATCHER_LOAD);
                    instance.get(ATTR_NODE).removeClass(CLASS_DISPATCHER_LOADING);
                }
                return v;
            }
        },
        /**
         * Default IO Config object that will be used as base configuration for Y.io calls.
         * http://developer.yahoo.com/yui/3/io/#configuration
         *
         * @attribute ioConfig
         * @type Object
         * @default null
         */
         ioConfig: {
            value: null
         }
    }
    
});


}, 'gallery-2011.05.12-13-26' ,{requires:['base', 'node-base', 'io-base', 'get', 'async-queue', 'classnamemanager']});
