YUI.add('gallery-async-command', function(Y) {

/**
 * @module gallery-async-command
 */
(function (Y, moduleName) {
    'use strict';
    
    var _string_args = 'args',
        _string_complete = 'complete',
        _string_failure = 'failure',
        _string_initOnly = 'initOnly',
        _string_start = 'start',
        _string_success = 'success',
        
        _Base = Y.Base,
        
        _createCompleteFunction,
        _false = false,
        _isArray = Y.Lang.isArray,
        _true = true;
    
    /**
    * Asynchronous command class.
    * @class AsyncCommand
    * @extends Base
    * @param {Object} config Configuration Object.
    */
    Y.AsyncCommand = _Base.create(moduleName, _Base, [], {
        initializer: function () {
            var me = this;

            /**
            * Fired when the command function completes.
            * @event complete
            * @fireonce
            * @param error Optional error value.
            * @param {Boolean} failed Indicates the failed status of the
            * command.
            * @param value Optional return value from the command function.
            */
            me.publish(_string_complete, {
                defaultFn: function () {
                    me._set('completed', _true);
                },
                fireOnce: _true
            });

            /**
            * Fired when the command function fails.
            * @event failure
            * @fireonce
            * @param error Optional error value.
            * @protected
            */
            me.publish(_string_failure, {
                defaultFn: function (eventFacade) {
                    var error = eventFacade.error;

                    me._set('error', error);
                    me._set('failed', _true);

                    me.fire(_string_complete, {
                        error: error,
                        failed: _true
                    });
                },
                fireOnce: _true
            });

            /**
            * Fired when the command function starts.
            * @event start
            * @fireonce
            * @protected
            */
            me.publish(_string_start, {
                defaultFn: function () {
                    me._set('started', _true);
                    me.get('fn').apply(me.get('ctx'), me.get(_string_args));
                },
                fireOnce: _true
            });

            /**
            * Fired when the command function succeeds.
            * @event success
            * @fireonce
            * @param value Optional return value from the command function.
            * @protected
            */
            me.publish(_string_success, {
                defaultFn: function (eventFacade) {
                    var value = eventFacade.value;

                    me._set('value', value);

                    me.fire(_string_complete, {
                        failed: _false,
                        value: value
                    });
                },
                fireOnce: _true
            });

            me.get(_string_args).unshift(_createCompleteFunction(me));
        },
        /**
        * Execute the command function.
        * @method run
        * @chainable
        */
        run: function () {
            this.fire(_string_start);
            return this;
        }
    }, {
        ATTRS: {
            /**
            * Array of arguments to be passed to the command function.
            * A special callback function is automatically added as the first
            * argument.
            * @attribute args
            * @default []
            * @initonly
            * @type Array
            */
            args: {
                setter: function (args) {
                    if (!_isArray(args)) {
                        args = [
                            args
                        ];
                    }

                    return args;
                },
                value: [],
                writeOnce: _string_initOnly
            },
            /**
            * Boolean value indicating the completed status of the command.
            * @attribute completed
            * @default false
            * @readonly
            * @type Boolean
            */
            completed: {
                readOnly: _true,
                value: _false
            },
            /**
            * Execution context for the command function.
            * @attribute ctx
            * @initonly
            */
            ctx: {
                value: null,
                writeOnce: _string_initOnly
            },
            /**
            * Error value passed to the failure event.
            * @attribute error
            * @readonly
            */
            error: {
                readOnly: _true,
                value: null
            },
            /**
            * Boolean value indicating the failed status of the command.
            * @attribute failed
            * @default false
            * @readonly
            * @type Boolean
            */
            failed: {
                readOnly: _true,
                value: _false
            },
            /**
            * The command function to execute.  This function receives a special
            * success callback function as the first parameter.  The success
            * callback function has a method parameter called fail.  One of
            * these callback functions must be called in order to complete the
            * command.
            * @attribute fn
            * @initonly
            * @type Function
            */
            fn: {
                value: function (success) {
                    success();
                },
                writeOnce: _string_initOnly
            },
            /**
            * Boolean value indicating the started status of the command.
            * @attribute started
            * @default false
            * @readonly
            * @type Boolean
            */
            started: {
                readOnly: _true,
                value: _false
            },
            /**
            * Value passed to the success event.
            * @attribute value
            * @readonly
            */
            value: {
                readOnly: _true,
                value: null
            }
        }
    });
    
    _createCompleteFunction = function (asyncCommand) {
        var successFunction = function (value) {
            asyncCommand.fire(_string_success, {
                value: value
            });
        };
        
        successFunction.fail = function (error) {
            asyncCommand.fire(_string_failure, {
                error: error
            });
        };
        
        return successFunction;
    };
}(Y, arguments[1]));


}, 'gallery-2012.06.20-20-07' ,{requires:['base'], skinnable:false});
