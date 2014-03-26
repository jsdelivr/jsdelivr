YUI.add('gallery-bootstrap-alert', function(Y) {

/**
A Plugin which provides fading Alert behaviors on a Node with compatible syntax
and markup from Twitter's Bootstrap project.

@module gallery-bootstrap-alert
**/

/**
A Plugin which provides fading Alert behaviors on a Node with compatible syntax
and markup from Twitter's Bootstrap project.

This makes it possible to have dynamic behaviors without incorporating any
JavaScript. However, it can be manually plugged into any node or node list.

    var node = Y.one('.someNode');
    // Duration is in seconds
    node.plug( Y.Bootstrap.Alert, { duration : 5 } );

    node.alert.close();

@class Bootstrap.Alert
**/

function AlertPlugin(config) {
    AlertPlugin.superclass.constructor.apply(this, arguments);

    this.config = Y.mix( config, this.defaults );

    var selector = this.config.selector;

    this._node = config.host;

    /**
    Fires when the close method is called, or when any close item has been
    clicked

    @event close
    @preventable _dismissAlertFn
    **/
    this.publish('close', { preventable : true, defaultFn : this._dismissAlertFn });

    this._node.delegate('click', function(e) { this.fire('close'); }, selector, this);
}


AlertPlugin.NAME = 'Bootstrap.Alert';
AlertPlugin.NS   = 'alert';

Y.extend(AlertPlugin, Y.Plugin.Base, {
    /**
    @property defaults
    @type Object
    @default { duration : 0.5, selector : '.close', transition : true, destroy : true }
    **/
    defaults : {
        duration     : 0.5,
        selector     : '.close',
        transition   : true,
        destroy      : true
    },

    /**
    @method close
    @description Closes the alert target (the host) and removes the node.
    **/
    close: function() {
        // Just a fake event facade.
        this.fire('close', { currentTarget : this._node.one('.close') });
    },

    /**
    @method _dismissAlertFn
    @description Internal method to handle the transitions and fire the
    closed event
    @protected
    **/
    _dismissAlertFn: function(e) {
        // This could be called from directly inside the plugin or just
        // violating encapsulation entirely. I didn't want to go through
        // instantiation overhead for what really will amount to a single and
        // direct call.
        var target = e.currentTarget,
            alert,
            config,
            is_plugin,
            destroy,
            completed;

        // If we have a node, use that. If not, find an ancestor that matches.
        if ( Y.instanceOf( this, AlertPlugin ) ) {
            alert     = this._node;
            config    = this.config;
            is_plugin = this;
        } else {
            alert  = e.target.ancestor('div.' + ( target.getData('dismiss') || 'alert' ) );
            config = AlertPlugin.prototype.defaults;
        }

        destroy = config.destroy ? true : false;

        completed = function() {
            if ( destroy ) { this.remove(); };
            alert.fire('closed');
            if ( is_plugin ) {
                is_plugin.fire('closed');
            }
        };

        if ( alert ) {
            e.preventDefault();
            if ( config.transition && alert.hasClass('fade') ) {
                alert.transition(
                    {
                        duration : config.duration,
                        opacity  : 0
                    },
                    completed
                );
            } else {
                alert.hide();
                completed.apply( alert );
            }
        }
    }
});

Y.namespace('Bootstrap').Alert = AlertPlugin;



}, 'gallery-2012.08.22-20-00' ,{requires:['plugin','transition','event','event-delegate']});
