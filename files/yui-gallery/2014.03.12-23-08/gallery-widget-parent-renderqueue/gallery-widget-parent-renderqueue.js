YUI.add('gallery-widget-parent-renderqueue', function(Y) {

/**
Plugin for WidgetParent that uses an async-queue to render children

@module widget-parent-render-queue
**/

var NAME = 'renderqueue',
    HOST = 'host',
    TIMEOUT = 'timeout';

/**
Plugin for WidgetParent providing async-queue functionality for
rendering child widgets

@class WidgetParentRenderQueue
@constructor
@extends Plugin.Base
@param {Object} config User configuration object
**/
function RenderQueue(config) {
    RenderQueue.superclass.constructor.apply(this, arguments);
}


/**
Static property provides a string to identify the class.

@property NAME
@type {String}
@static
**/
RenderQueue.NAME = NAME;


/**
Static property provides a string to identify the namespace.

@property NS
@type {String}
@static
**/
RenderQueue.NS = NAME;


/**
Static property used to define the default attribute
configuration for the plugin.

@property ATTRS
@type {Object}
@static
**/
RenderQueue.ATTRS = {
    /**
    Queue execution timer
     *
    @attribute timeout
    @default Y.AsyncQueue.defaults.timeout (currently 10ms)
    **/
    timeout: {
        value: Y.AsyncQueue.defaults.timeout
    }
};


Y.extend(RenderQueue, Y.Plugin.Base, {
    /**
    the async queue instance

    @property _queue
    @private
    **/
    _queue: null,


    /**
    event handles to detach on unplug

    @property _handles
    @private
    **/
    _handles: null,


    /**
    Initializer lifecycle method for the plugin.

    @method initializer
    @param {Object} config
    @protected
    **/
    initializer: function(cfg) {
        var host = this.get(HOST),
            version = Y.version.split('.'),
            h, q;

        h = this._handles = [];

        q = this._queue = new Y.AsyncQueue();

        // set the defaults for the queue
        q.defaults.context = host;
        q.defaults.timeout = this.get(TIMEOUT);

        // add the plugin and host as a bubble target for queue events
        q.addTarget(this);

        this.on(TIMEOUT + 'Change', function(e) {
            q.defaults.timeout = e.newVal;
        });

        this.beforeHostMethod('_uiAddChild', this._doBefore_uiAddChild);
    },


    /**
    Destructor lifecycle implementation for the plugin.  Resets all
    child widgets to their default state

    HostMethod/Event listeners are automatically
    detached by plugin base destructor

    @method destructor
    @protected
    **/
    destructor: function() {
        // detach any handles created on widget children
        Y.each(this._handles, function(handle) {
            handle.detach();
        });

        //clean up all events on the queue
        this._queue.detachAll();
        this._queue = null;
    },


    /**
    AOP method fired before _uiAddChild that adds the
    default _uiAddChild rendering method to an async-queue
    and prevents the initial call to _uiAddChild from
    executing

    @method _doBefore_uiAddChild
    @protected
    **/
    _doBefore_uiAddChild: function(child, parentNode) {
        var self = this,
            host = self.get(HOST),
            q = self._queue;

        q.add({
            fn:  Y.WidgetParent.prototype._uiAddChild,
            args: [child, parentNode],
            context: host
        }).run();

        return new Y.Do.Prevent();
    }
});

Y.namespace('Plugin').WidgetParentRenderQueue = RenderQueue;


}, 'gallery-2011.11.30-20-58' ,{requires:['widget', 'plugin', 'async-queue']});
