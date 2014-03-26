YUI.add('gallery-inspector-plugin', function(Y) {

/**
 * Binds a new Inspector instance to an existing object.
 *
 * @module gallery-inspector
 * @submodule gallery-inspector-plugin
 */

/**
 * <p>Binds a new Inspector instance to an existing object.</p>
 *
 * <p>Example:</p>
 *
 * <pre>
 * myWidget.plug(Y.Plugin.Inspector);
 * </pre>
 *
 * @class Plugin.Inspector
 * @extends Inspector
 */
var Plugin = Y.Plugin;

function InspectorPlugin(config) {
    if (!config.render && config.render !== false) {
        config.render = true;
    }
    
    InspectorPlugin.superclass.constructor.apply(this, arguments);
}

Y.extend(InspectorPlugin, Y.Inspector, {}, {
    CSS_PREFIX: Y.ClassNameManager.getClassName('inspector'),
    NAME      : 'inspectorPlugin',
    NS        : 'inspector'
});

Plugin.Inspector = InspectorPlugin;


}, 'gallery-2011.05.12-13-26' ,{requires:['gallery-inspector']});
