YUI.add('gallery-async-command-delay', function(Y) {

/**
 * @module gallery-async-command-delay
 */
(function (Y, moduleName) {
    'use strict';
    
    var _string_delay = 'delay',
        _string_delayed = 'delayed',
        _string_run = 'run',
        
        _Do = Y.Do,
        _DoAlterReturn = _Do.AlterReturn,
        _DoPrevent = _Do.Prevent,
        _Plugin = Y.Plugin,
        
        _delay = Y.delay;

    /**
     * Asynchronous command delay plugin.
     * @class AsyncCommandDelay
     * @extends Plugin.Base
     * @namespace Plugin
     * @param {Object} config Configuration Object.
     */
    _Plugin.AsyncCommandDelay = Y.Base.create(moduleName, _Plugin.Base, [], {
        initializer: function () {
            var me = this,
            
                host = me.get('host'),
                run = host.run;
            
            me.afterHostMethod(_string_run, function () {
                return new _DoAlterReturn(_string_delayed, host);
            });
            
            me.beforeHostMethod(_string_run, function () {
                _delay(run, me.get(_string_delay)).call(host);
                return new _DoPrevent(_string_delayed);
            });
        }
    }, {
        ATTRS: {
            /**
             * Approximate delay in milliseconds to wait between the time run is
             * called and when the command function is executed.
             * @attribute delay
             * @default 0
             * @initonly
             * @type Number
             */
            delay: {
                value: 0,
                writeOnce: 'initOnly'
            }
        },
        NS: _string_delay
    });
}(Y, arguments[1]));


}, 'gallery-2012.06.20-20-07' ,{requires:['gallery-async-command', 'gallery-delay', 'plugin'], skinnable:false});
