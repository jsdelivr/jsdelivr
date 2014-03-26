YUI.add('gallery-async', function(Y) {

/**
 * @module gallery-async
 */
(function (Y, moduleName) {
    'use strict';
    
    var _string_complete = 'complete',
        _string_initOnly = 'initOnly',
        
        _run = {
            all: '_runAll',
            queue: '_runQueue'
        },
        
        _Array = Y.Array,
        _AsyncCommand = Y.AsyncCommand,
        _Lang = Y.Lang,
        
        _createAndRun,
        _each = _Array.each,
        _instanceOf = Y.instanceOf,
        _isArray = _Lang.isArray,
        _isFunction = _Lang.isFunction,
        _isString = _Lang.isString,
        _map = _Array.map,
        _merge = Y.merge,
        _unnest = _Array.unnest,
    
        /**
        * Asynchronous command runner class.
        * @class Async
        * @extends AsyncCommand
        * @param {Object} config Configuration Object.
        */
        _class = Y.Base.create(moduleName, _AsyncCommand, [], {
            initializer: function () {
                var me = this,
                    run = _run[me.get('mode')];
                
                if (run) {
                    me._set('fn', function (success) {
                        me[run].call(me, success, me.get('run'));
                    });
                }
            },
            /**
            * Command function for all mode.
            * @method _runAll
            * @param {Function} success
            * @param {[AsyncCommand]} run
            * @protected
            */
            _runAll: function (success, run) {
                var commandCount = run.length,
                    completeCount = 0,
                    value = [];

                _each(run, function (asyncCommand, index) {
                    asyncCommand.run().after(_string_complete, function (eventFacade) {
                        if (eventFacade.failed) {
                            success.fail(eventFacade.error);
                            return;
                        }

                        completeCount += 1;
                        value[index] = eventFacade.value;

                        if (completeCount === commandCount) {
                            success(value);
                        }
                    });
                });

                if (!commandCount) {
                    success(value);
                }
            },
            /**
            * Command function for queue mode.
            * @method _runAll
            * @param {Function} success
            * @param {[AsyncCommand]} run
            * @param {Number} index
            * @param {Array} value
            * @protected
            */
            _runQueue: function (success, run, index, value) {
                index = index || 0;
                value = value || [];

                if (index >= run.length) {
                    success(value);
                    return;
                }

                run[index].run().after(_string_complete, function (eventFacade) {
                    if (eventFacade.failed) {
                        success.fail(eventFacade.error);
                        return;
                    }

                    value[index] = eventFacade.value;

                    this._runQueue(success, run, index + 1, value);
                }, this);
            }
        }, {
            ATTRS: {
                /**
                * The inherited args attribute is protected.
                * @attribute args
                * @default []
                * @initonly
                * @protected
                * @type Array
                */
               /**
                * A config object passed to the AsyncCommand constructor when
                * instantiating dynamically.
                * @attribute config
                * @default {}
                * @initonly
                * @type Object
                */
                config: {
                    value: {},
                    writeOnce: _string_initOnly
                },
                /**
                * The inherited ctx attribute is protected.
                * @attribute ctx
                * @initonly
                * @protected
                */
                /**
                * The inherited fn attribute is protected.
                * @attribute fn
                * @initonly
                * @protected
                * @type Function
                */
                /**
                * Value indicating the run mode.  Possible modes are:
                * <dl>
                *     <dt>
                *         all
                *     </dt>
                *     <dd>
                *         This mode runs all commands.  The commands might be
                *         completed out of order.  The run completes once all
                *         commands have completed.  The run fails if any command
                *         fails.
                *     </dd>
                *     <dt>
                *         queue
                *     </dt>
                *     <dd>
                *         This mode runs one command at a time.  It waits for
                *         the first command to complete before moving on to the
                *         next one.  The run completes when the last command has
                *         completed.  The run fails if a command fails and the
                *         remaining commands are not run.
                *     </dd>
                * </dl>
                * @attribute mode
                * @default 'queue'
                * @initonly
                * @type String
                */
                mode: {
                    value: 'queue',
                    writeOnce: _string_initOnly
                },
                /**
                * An array of AsyncCommands to run.  Command functions,
                * AsyncCommand config objects, and named command strings will
                * get converted to instances of AsyncCommand.
                * @attribute run
                * @default []
                * @initonly
                * @type [AsyncCommand]
                */
                run: {
                    setter: function (run) {
                        var config = this.get('config');
                        
                        return _map(_isArray(run) ? run : [
                            run
                        ], function (item) {
                            if (_instanceOf(item, _AsyncCommand)) {
                                return item;
                            }
                            
                            if (_isString(item)) {
                                item = _class.commands[item] || {};
                            }
                            
                            if (_isFunction(item)) {
                                return new _AsyncCommand(_merge(config, {
                                    fn: item
                                }));
                            }
                            
                            return new _AsyncCommand(_merge(config, item));
                        });
                    },
                    value: [],
                    writeOnce: _string_initOnly
                }
            },
            /**
             * This is a static object that stores named command definitions for
             * repeat use.  This object's keys are the names of commands.  The
             * values can either command functions or AsyncCommand config
             * objects.
             * @property commands
             * @static
             * @type Object
             */
            commands: {},
            /**
            * Creates and runs an instance of Async in 'all' mode.  This method
            * accepts an unlimited number of arguments.  Arguments can be
            * command functions, AsyncCommand config objects, instances of
            * AsyncCommand, instances of Async, or arrays containing any of the
            * above.
            * @method runAll
            * @return {Async}
            * @static
            */
            runAll: function () {
                return _createAndRun({}, 'all', _unnest(arguments));
            },
            /**
            * Creates and runs an instance of Async in 'all' mode.  This method
            * accepts an unlimited number of arguments.  The first argument is a
            * config object passed to the AsyncCommand constructor when
            * instantiating dynamically.  The rest of the arguments can be
            * command functions, AsyncCommand config objects, instances of
            * AsyncCommand, instances of Async, or arrays containing any of the
            * above.
            * @method runAllWithConfig
            * @return {Async}
            * @static
            */
            runAllWithConfig: function () {
                var args = _Array(arguments);
                
                return _createAndRun(args.shift(), 'all', _unnest(args));
            },
            /**
            * Creates and runs an instance of Async in 'queue' mode.  This
            * method accepts an unlimited number of parameters.  Parameters can
            * be command functions, AsyncCommand config objects, instances of
            * AsyncCommand, instances of Async, or arrays containing any of the
            * above.
            * @method runQueue
            * @return {Async}
            * @static
            */
            runQueue: function () {
                return _createAndRun({}, 'queue', _unnest(arguments));
            },
            /**
            * Creates and runs an instance of Async in 'queue' mode.  This
            * method accepts an unlimited number of parameters.  The first
            * argument is a config object passed to the AsyncCommand constructor
            * when instantiating dynamically.  The rest of the arguments can
            * be command functions, AsyncCommand config objects, instances of
            * AsyncCommand, instances of Async, or arrays containing any of the
            * above.
            * @method runQueue
            * @return {Async}
            * @static
            */
            runQueueWithConfig: function () {
                var args = _Array(arguments);
                
                return _createAndRun(args.shift(), 'queue', _unnest(args));
            }
        });
    
    _createAndRun = function (config, mode, run) {
        return new _class({
            config: config,
            mode: mode,
            run: run
        }).run();
    };
    
    Y.Async = _class;
}(Y, arguments[1]));


}, 'gallery-2012.06.20-20-07' ,{requires:['array-extras', 'gallery-array-unnest', 'gallery-async-command'], skinnable:false});
