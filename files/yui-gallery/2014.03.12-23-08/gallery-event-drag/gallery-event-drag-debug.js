YUI.add('gallery-event-drag', function(Y) {

/**
 * <p>Provides subscribable drag events from Node or NodeLists.  Subscribing
 * to any of the events causes the node to be plugged with Y.Plugin.Drag.  The
 * config object passed can be used to set Drag instance attributes or add
 * additional Plugins to the Drag instance such as Y.Plugin.DDProxy.</p>
 *
 * Config properties are formatted and tested for a corresponding Y.Plugin.* as
 * 'somePlugin' => Y.Plugin.DDSomePlugin if the property name doesn't already
 * start with "DD".  So { proxy: true } and { DDProxy: true } are functionally
 * equivalent.  Both add Y.Plugin.DDProxy to the Drag instance.</p>
 *
 * <pre><code>node.on('drag:start', fn, { proxy: true, data: 123 });</code></pre>
 *
 * <p>This adds Y.Plugin.DDProxy to the Drag instance and also set's the Drag instance's data attribute.</p>
 *
 * <p>Passing any value will result in the Plugin being added, but if you pass
 * an object literal as the value, it will be sent to the Plugin's
 * constructor.</p>
 *
 * <pre><code>node.on('drag:end', fn, {
 *     constrained: { constrain2node: '#container' }
 * });</code></pre>
 *
 * <p>This adds Y.Plugin.DDConstrained to the Drag instance using the specified
 * configuration.</p>
 *
 * <p>A custom detach handle is returned, whose detach method unplugs the
 * Y.Plugin.Drag from the node(s).</p>
 *
 * <p>Supported events are:</p>
 * <ul>
 *   <li>drag or drag:drag</li>
 *   <li>drag:start</li>
 *   <li>drag:end</li>
 *   <li>drag:mouseDown</li>
 *   <li>drag:afterMouseDown</li>
 *   <li>drag:removeHandle</li>
 *   <li>drag:addHandle</li>
 *   <li>drag:removeInvalid</li>
 *   <li>drag:addInvalid</li>
 *   <li>drag:align</li>
 * </ul>
 * 
 * <p>Additionally, the default callback context is overridden to the
 * subscribing Node unless otherwise specified during the subscription.
 * So &quot;this&quot; in the callback will refer to the node.  On the
 * event object passed to subscribers, <code>e.currentTarget</code> is also the
 * Node regardless of context override.  The Drag instance is available from
 * the Node as <code>node.dd</code>.</p>
 *
 * @module event-drag
 */

/**
 * Also &quot;drag:drag&quot;.  Subscribes to the respective event on the generated Drag instance.
 *
 * @event drag
 * @param type {String} 'drag'
 * @param fn {Function} the callback function
 * @param id {String|Node|etc} the element to bind (typically document)
 * @param conf {Object} (optional) configuration to pass to Drag constructor
 * @return {Event.Handle} the detach handle
 */
var eventPlugin = Y.Env.evt.plugins,
    nodeEvents  = Y.Node.DOM_EVENTS,
    events = [
        'drag',
        'drag:start',
        'drag:drag',
        'drag:end',
        'drag:mouseDown',
        'drag:afterMouseDown',
        'drag:removeHandle',
        'drag:addHandle',
        'drag:removeInvalid',
        'drag:addInvalid',
        'drag:align'
    ],
    eventDef, i;

eventDef = {
    on: function (type, fn, el, conf, ctx) {
        var nodes    = eventPlugin.drag._getNodes(el),
            args     = Y.Array(arguments, 4, true);
            
        args.unshift(fn);

        type = type.indexOf(':') > -1 ? type : 'drag:' + type;

        nodes.each(function (node) {
            if (!node.dd) {
                node.plug(Y.Plugin.Drag);
            }

            eventPlugin.drag._applyConfig(node.dd, conf);

            args[1] = ctx || node;

            var callback = Y.rbind.apply(Y, args);

            node.dd.on(type, function (e) {
                e.currentTarget = node;
                callback(e);
            });
        });

        return {
            detach: function () {
                nodes.each(function (node) {
                    node.unplug(Y.Plugin.Drag);
                });
            }
        };
    },

    /**
     * Normalizes the third param of on() to a NodeList.  The resulting list
     * may be empty.
     *
     * @method _getNodes
     * @param el {String|Node|NodeList|HTMLElement|Array} valid context for on()
     * @return NodeList
     * @protected
     */
    _getNodes : function (el) {
        el = el || [];

        if (el instanceof Y.NodeList) {
            return el;
        } else if (Y.Lang.isString(el) || Y.Event._isValidCollection(el)) {
            return Y.all(el);
        } else {
            return Y.all(Y.Array(Y.Node.getDOMNode(el) || []));
        }
    },

    /**
     * Applies the attribute values from the config object to the Drag instance.
     * Also checks for loaded Plugins by the name of the property to apply.
     *
     * @method _applyConfig
     * @param dd {Y.Plugin.Drag} the Drag plugin for the node
     * @param conf {Object} the attribute configuration
     * @protected
     */
    _applyConfig : function (dd, conf) {
        var k, plugin, pname, pconf;

        if (conf) {
            for (k in conf) {
                if (conf.hasOwnProperty(k)) {
                    pname  = k;
                    if (k.indexOf('DD') !== 0) {
                        pname = 'DD' + k.charAt(0).toUpperCase() + k.slice(1);
                    }
                    pconf  = Y.Lang.isObject(conf[k]) ? conf[k] : {};
                    plugin = Y.Plugin[pname];

                    if (plugin) {
                        dd.plug(plugin, pconf);
                    } else {
                        dd.set(k, conf[k]);
                    }
                }
            }
        }
    }
};

// Add all the events, defined by the same algo.
for (i = events.length - 1; i >= 0; --i) {
    eventPlugin[events[i]] = nodeEvents[events[i]] = eventDef;
}


/**
 * Also &quot;drag:drag&quot;.  Subscribes to the respective event on the generated Drag instance.
 *
 * @event drag
 * @param type {String} 'drag'
 * @param fn {Function} the callback function
 * @param id {String|Node|etc} the element to bind (typically document)
 * @param conf {Object} (optional) configuration to pass to Drag constructor
 * @return {Event.Handle} the detach handle
 */

/**
 * Subscribes to the respective event on the generated Drag instance.
 *
 * @event drag:start
 * @param type {String} 'drag:start'
 * @param fn {Function} the callback function
 * @param id {String|Node|etc} the element to bind (typically document)
 * @param conf {Object} (optional) configuration to pass to Drag constructor
 * @return {Event.Handle} the detach handle
 */

/**
 * Subscribes to the respective event on the generated Drag instance.
 *
 * @event drag:end
 * @param type {String} 'drag:end'
 * @param fn {Function} the callback function
 * @param id {String|Node|etc} the element to bind (typically document)
 * @param conf {Object} (optional) configuration to pass to Drag constructor
 * @return {Event.Handle} the detach handle
 */

/**
 * Subscribes to the respective event on the generated Drag instance.
 *
 * @event drag:mouseDown
 * @param type {String} 'drag:mouseDown'
 * @param fn {Function} the callback function
 * @param id {String|Node|etc} the element to bind (typically document)
 * @param conf {Object} (optional) configuration to pass to Drag constructor
 * @return {Event.Handle} the detach handle
 */

/**
 * Subscribes to the respective event on the generated Drag instance.
 *
 * @event drag:afterMouseDown
 * @param type {String} 'drag:afterMouseDown'
 * @param fn {Function} the callback function
 * @param id {String|Node|etc} the element to bind (typically document)
 * @param conf {Object} (optional) configuration to pass to Drag constructor
 * @return {Event.Handle} the detach handle
 */

/**
 * Subscribes to the respective event on the generated Drag instance.
 *
 * @event drag:removeHandle
 * @param type {String} 'drag:removeHandle'
 * @param fn {Function} the callback function
 * @param id {String|Node|etc} the element to bind (typically document)
 * @param conf {Object} (optional) configuration to pass to Drag constructor
 * @return {Event.Handle} the detach handle
 */

/**
 * Subscribes to the respective event on the generated Drag instance.
 *
 * @event drag:addHandle
 * @param type {String} 'drag:addHandle'
 * @param fn {Function} the callback function
 * @param id {String|Node|etc} the element to bind (typically document)
 * @param conf {Object} (optional) configuration to pass to Drag constructor
 * @return {Event.Handle} the detach handle
 */

/**
 * Subscribes to the respective event on the generated Drag instance.
 *
 * @event drag:removeInvalid
 * @param type {String} 'drag:removeInvalid'
 * @param fn {Function} the callback function
 * @param id {String|Node|etc} the element to bind (typically document)
 * @param conf {Object} (optional) configuration to pass to Drag constructor
 * @return {Event.Handle} the detach handle
 */

/**
 * Subscribes to the respective event on the generated Drag instance.
 *
 * @event drag:addInvalid
 * @param type {String} 'drag:addInvalid'
 * @param fn {Function} the callback function
 * @param id {String|Node|etc} the element to bind (typically document)
 * @param conf {Object} (optional) configuration to pass to Drag constructor
 * @return {Event.Handle} the detach handle
 */

/**
 * Subscribes to the respective event on the generated Drag instance.
 *
 * @event drag:align
 * @param type {String} 'drag:align'
 * @param fn {Function} the callback function
 * @param id {String|Node|etc} the element to bind (typically document)
 * @param conf {Object} (optional) configuration to pass to Drag constructor
 * @return {Event.Handle} the detach handle
 */


}, 'gallery-2009.11.02-20' ,{optional:['dd-proxy','dd-constrain'], requires:['dd-plugin']});
