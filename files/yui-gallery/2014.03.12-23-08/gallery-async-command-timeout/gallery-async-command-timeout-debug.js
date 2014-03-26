YUI.add('gallery-async-command-timeout', function(Y) {

/**
 * @module gallery-async-command-timeout
 */
(function (Y, moduleName) {
    'use strict';
    
    var _string_timeout = 'timeout',
        
        _Plugin = Y.Plugin,
        
        _invoke = Y.Array.invoke,
        _later = Y.later;

    /**
     * Asynchronous command timeout plugin.
     * @class AsyncCommandTimeout
     * @extends Plugin.Base
     * @namespace Plugin
     * @param {Object} config Configuration Object.
     */
    _Plugin.AsyncCommandTimeout = Y.Base.create(moduleName, _Plugin.Base, [], {
        destructor: function () {
            var me = this;
            
            _invoke(me._subs, 'detach');
            
            if (me._timer) {
                me._timer.cancel();
                delete me._timer;
            }
        },
        initializer: function () {
            var me = this,
                host = me.get('host'),
                timeout = me.get(_string_timeout);
            
            if (!timeout) {
                return;
            }
            
            me._subs = [
                host.on('start', function () {
                    me._timer = _later(timeout, host, host.fire, [
                        'failure',
                        {
                            error: _string_timeout
                        }
                    ]);
                }),
                host.on('success', function (eventFacade) {
                    if (host.get('completed')) {
                        eventFacade.preventDefault();
                    } else if (me._timer) {
                        me._timer.cancel();
                    }

                    delete me._timer;
                })
            ];
        }
    }, {
        ATTRS: {
            /**
             * Approximate timeout in milliseconds to wait for success before
             * the command automatically fails.  Must be a non-negative integer.
             * A value of 0 disables the timeout.
             * @attribute timeout
             * @default 0
             * @initonly
             * @type Number
             */
            timeout: {
                value: 0,
                writeOnce: 'initOnly'
            }
        },
        NS: _string_timeout
    });
}(Y, arguments[1]));


}, 'gallery-2012.06.20-20-07' ,{requires:['array-invoke', 'gallery-async-command', 'plugin'], skinnable:false});
