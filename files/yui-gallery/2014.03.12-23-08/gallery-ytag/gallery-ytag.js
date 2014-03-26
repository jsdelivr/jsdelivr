YUI.add('gallery-ytag', function(Y) {

var YTag = Y.namespace('YTag');

function YTagPlugin(config) {
    YTagPlugin.superclass.constructor.apply(this, arguments);
}

YTagPlugin.NAME = 'ytagPlugin';
YTagPlugin.NS = 'ytag';
YTagPlugin.ATTRS = {};

YTagPlugin._buildCfg = {
    custom: {
        NS: function(prop, receiver, supplier) {
            receiver.NS = YTagPlugin.NS;
        }
    }
};

Y.extend(YTagPlugin, Y.Plugin.Base, {
    getData: function() {
        return Y.merge({}, this.get('host').getDOMNode().dataset); // Merge out string map
    }
});

function listen(name, plugin) {
    Y.on('inserted', function(e) {
        e.target.plug(plugin);
    }, name);
}

function register(name, plugin) {
    if (plugin) {
        listen(name, plugin);
    } else { // Need to load plugin
        Y.use('ytag-' + name, function(Y) {
            listen(name, Y.namespace('YTag.Tags')[name]);
        });
    }
}

YTag.register = register;
YTag.Plugin = YTagPlugin;


}, 'gallery-2012.06.20-20-07' ,{requires:['node', 'base', 'plugin', 'gallery-event-inserted'], skinnable:false});
