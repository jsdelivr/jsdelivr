YUI.add('gallery-async-progress', function(Y) {

/**
 * @module gallery-async-progress
 */
(function (Y, moduleName) {
    'use strict';
    
    var _string_progress = 'progress',
        
        _Plugin = Y.Plugin,
        
        _invoke = Y.Array.invoke;

    /**
     * Asynchronous command runner progress plugin.
     * @class Plugin.AsyncProgress
     * @extends Plugin.Base
     * @param {Object} config Configuration Object.
     */
    _Plugin.AsyncProgress = Y.Base.create(moduleName, _Plugin.Base, [], {
        destructor: function () {
            _invoke(this._subs, 'detach');
        },
        initializer: function () {
            var completed = 0,
                host = this.get('host'),
                run = host.get('run'),
                total = run.length;
                
            this._subs = _invoke(run, 'on', 'complete', function () {
                completed += 1;
                
                /**
                 * @event progress
                 * @for Async
                 * @param {Number} completed
                 * @param {Number} total
                 */
                host.fire(_string_progress, {
                    completed: completed,
                    total: total
                });
            });
        }
    }, {
        NS: _string_progress
    });
}(Y, arguments[1]));


}, 'gallery-2012.06.20-20-07' ,{requires:['array-invoke', 'gallery-async', 'plugin'], skinnable:false});
