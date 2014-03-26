YUI.add('gallery-async-pause', function(Y) {

/**
 * @module gallery-async-pause
 */
(function (Y, moduleName) {
    'use strict';
    
    var _string__args = '_args',
        _string__resumed = '_resumed',
        _string_host = 'host',
        _string_paused = 'paused',
        
        _false = false,
        _true = true,
        
        _DoPrevent = Y.Do.Prevent,
        _Plugin = Y.Plugin;

    /**
     * Asynchronous command runner pause plugin.
     * @class AsyncPause
     * @extends Plugin.Base
     * @namespace Plugin
     * @param {Object} config Configuration Object.
     */
    _Plugin.AsyncPause = Y.Base.create(moduleName, _Plugin.Base, [], {
        initializer: function () {
            var me = this;
                
            if (me.get(_string_host).get('mode') === 'queue') {
                me.beforeHostMethod('_runQueue', function () {
                    if (me.get(_string_paused)) {
                        me._set(_string__args, arguments);
                        return new _DoPrevent(_string_paused);
                    }

                    return null;
                });
            }
        },
        /**
         * Pause the run.  Does not stop a command that is currently running,
         * the run will pause before the next command runs.
         * @method pause
         * @chainable
         */
        pause: function () {
            return this._set(_string_paused, _true);
        },
        /**
         * Resumes a paused run.  If a command is currently running, the paused
         * state may not be updated immediately.  Resume does nothing if the run
         * is not paused or not started yet or already complete.
         * @method resume
         * @chainable
         */
        resume: function () {
            var argsChangeListener,
                completeListener,
                me = this,
                
                args = me.get(_string__args),
                host = me.get(_string_host),
                runQueue = host._runQueue,
                
                resume = function (args) {
                    me._setAttrs({
                        paused: _false,
                        _args: null,
                        _resumed: _false
                    });
                    runQueue.apply(host, args);
                };
            
            if (!me.get(_string_paused) || me.get(_string__resumed)) {
                return me;
            }
            
            if (!host.get('started') || host.get('completed')) {
                me._set(_string_paused, _false);
                return me;
            }

            if (args) {
                resume(args);
                return me;
            }
            
            me._set(_string__resumed, _true);
            
            argsChangeListener = me.once('_argsChange', function (eventFacade) {
                completeListener.detach();
                resume(eventFacade.newVal);
            });
            
            completeListener = host.on('complete', function () {
                argsChangeListener.detach();
            });
            
            return me;
        }
    }, {
        ATTRS: {
            /**
             * Boolean value indicating the paused status of the run.
             * @attribute paused
             * @default false
             * @readonly
             * @type Boolean
             */
            paused: {
                readonly: _true,
                value: _false
            },
            /**
             * Paused _runQueue arguments.
             * @attribute _args
             * @protected
             * @readonly
             * @type Array
             */
            _args: {
                readOnly: _true,
                value: null
            },
            /**
             * Boolean value indicating the resumed status of the run.
             * @attribute _resumed
             * @protected
             * @readonly
             * @type Array
             */
            _resumed: {
                readOnly: _true,
                value: _false
            }
        },
        NS: 'pause'
    });
}(Y, arguments[1]));


}, 'gallery-2012.06.20-20-07' ,{requires:['gallery-async', 'plugin'], skinnable:false});
