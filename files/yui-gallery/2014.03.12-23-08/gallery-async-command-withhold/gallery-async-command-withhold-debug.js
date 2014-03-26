YUI.add('gallery-async-command-withhold', function(Y) {

/**
 * @module gallery-async-command-withhold
 */
(function (Y, moduleName) {
    'use strict';
    
    var _string_withhold = 'withhold',
        
        _Plugin = Y.Plugin,
        
        _delay = Y.delay;

    /**
     * Asynchronous command withhold plugin.
     * @class AsyncCommandWithhold
     * @extends Plugin.Base
     * @namespace Plugin
     * @param {Object} config Configuration Object.
     */
    _Plugin.AsyncCommandWithhold = Y.Base.create(moduleName, _Plugin.Base, [], {
        initializer: function () {
            var me = this;
            
            me.onHostEvent([
                'failure',
                'success'
            ], function (eventFacade) {
                eventFacade.preventDefault();
                
                var targetEvent = eventFacade.target.getEvent(eventFacade.type);
                
                _delay(targetEvent.defaultFn, me.get(_string_withhold)).apply(targetEvent, arguments);
            });
        }
    }, {
        ATTRS: {
            /**
             * Approximate delay in milliseconds to wait between the time the
             * command function reports completion and when the completed status
             * is updated.
             * @attribute withhold
             * @default 0
             * @initonly
             * @type Number
             */
            withhold: {
                value: 0,
                writeOnce: 'initOnly'
            }
        },
        NS: _string_withhold
    });
}(Y, arguments[1]));


}, 'gallery-2012.06.20-20-07' ,{requires:['gallery-async-command', 'gallery-delay', 'plugin'], skinnable:false});
