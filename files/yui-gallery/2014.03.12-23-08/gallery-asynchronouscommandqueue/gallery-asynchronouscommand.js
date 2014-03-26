YUI.add('gallery-asynchronouscommand', function(Y) {

/**
 * @module gallery-asynchronouscommandqueue
 */

'use strict';

var _class;

/**
 * Asynchronous Command.
 * @class AsynchronousCommand
 * @constructor
 * @extends Y.Base
 * @namespace Y
 * @param {Object} config Configuration Object.
 */
_class = function (config) {
    _class.superclass.constructor.call(this, config);
};

_class.ATTRS = {
    /**
     * Function arguments.
     * @attribute args
     * @type Array
     * @writeOnce
     */
    args: {
        value: [],
        writeOnce: 'initOnly'
    },
    /**
     * @attribute completed
     * @final
     * @type Boolean
     */
    completed: {
        readOnly: true,
        value: false
    },
    /**
     * @attribute context
     * @type Object
     * @writeOnce
     */
    context: {
        value: Y.config.win,
        writeOnce: 'initOnly'
    },
    /**
     * @attribute delay
     * @type Number
     * @writeOnce
     */
    delay: {
        value: 0,
        writeOnce: 'initOnly'
    },
    /**
     * Function to call on execute.
     * This function will be passed asynchronousCommand followed by anything in the args array.
     * This function must call asynchronousCommand.fire('complete');
     * @attribute fn
     * @type Function
     * @writeOnce
     */
    fn: {
        value: function (asynchronousCommand) {
            asynchronousCommand.fire('complete');
        },
        writeOnce: 'initOnly'
    },
    /**
     * @attribute started
     * @final
     * @type Boolean
     */
    started: {
        readOnly: true,
        value: false
    }
};

_class.NAME = 'AsynchronousCommand';

Y.extend(_class, Y.Base, {
    /**
     * @method execute
     * @return {Object} this
     */
    execute: function () {
        Y.later(this.get('delay'), this, function () {
            this.fire('start');
            this.get('fn').apply(this.get('context'), this.get('args'));
        });
        return this;
    },
    initializer: function () {
        this.publish('complete', {
            fireOnce: true
        });
        this.publish('start', {
            fireOnce: true
        });

        var args = this.get('args');

        if (!Y.Lang.isArray(args)) {
            args = [args];
        }

        args.unshift(this);
        this._set('args', args);

        this.on('complete', function () {
            this._set('completed', true);
        }, this);

        this.on('start', function () {
            this._set('started', true);
        }, this);
    }
});

Y.AsynchronousCommand = _class;


}, 'gallery-2011.04.13-22-38' ,{requires:['base'], skinnable:false});
