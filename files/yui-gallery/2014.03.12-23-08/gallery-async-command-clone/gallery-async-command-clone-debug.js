YUI.add('gallery-async-command-clone', function(Y) {

/**
 * @module gallery-async-command-clone
 */
(function (Y, moduleName) {
    'use strict';
    
    var _Plugin = Y.Plugin;
    
    /**
     * Asynchronous command clone plugin.
     * @class AsyncCommandClone
     * @extends Plugin.Base
     * @namespace Plugin
     * @param {Object} config Configuration Object.
     */
    _Plugin.AsyncCommandClone = Y.Base.create(moduleName, _Plugin.Base, [], {
        /**
         * Clones the host AsyncCommand instance in a new unused state.
         * @method clone
         * @return {AsyncCommand}
         */
        clone: function () {
            var config = this.get('host').getAttrs([
                'args',
                'ctx',
                'fn'
            ]);
            
            config.args = config.args.slice(1);
            
            return new Y.AsyncCommand(config);
        }
    }, {
        NS: 'clone'
    });
}(Y, arguments[1]));


}, 'gallery-2012.06.20-20-07' ,{requires:['gallery-async-command', 'plugin'], skinnable:false});
