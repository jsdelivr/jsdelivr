YUI.add('gallery-mediator', function(Y) {

/*global YUI*/
/*
 * Copyright (c) 2011 Yahoo! Inc. All rights reserved.
 * Author: Nicholas C. Zakas, nczonline.net
 */

/**
 * Mediator pattern in JavaScript. For more info on Mediator pattern:
 * http://en.wikipedia.org/wiki/Mediator_pattern
 * @module gallery-mediator
 */
    
/**
 * Implementation of the mediator pattern. Purposely does not
 * require Y.Event.Target to avoid confusion with regular
 * event target pattern and also to keep the code as light
 * and simple as possible.
 * @class Mediator
 * @static
 */
Y.Mediator = function(){
    /**
     * Array of listeners.
     * @type Array
     * @property _listeners
     * @private
     */
    this._listeners = {};
};

Y.Mediator.prototype = {

    //restore constructor
    constructor: Y.Mediator,

    /**
     * Broadcasts a message throughout the system, calling any
     * registered callbacks.
     * @param {String} name The name of the message to fire.
     * @param {variant} data (Optional) Any additional data.
     * @return {void}
     * @method broadcast
     */
    broadcast: function(name, data){
        var i, len,
            nameListeners = this._listeners[name];
            
        if (nameListeners){                
            /*
             * Create a clone of the array list. This handles the case where
             * a callback calls listen() or unlisten() and thus alters the number of
             * listeners. Using the clone ensures that the original listeners all
             * get called.
             */
            nameListeners = nameListeners.concat();
            for (i=0, len=nameListeners.length; i < len; i++){
                nameListeners[i].callback.call(nameListeners[i].scope, {
                    type: name,
                    data: data
                });
            }        
        }    
    },
    
    /**
     * Registers a listener for a particular message.
     * @param {String} name The name of the message to listen for.
     * @param {Function} callback The function to call when the message occurs.
     * @param {Object} scope The value for "this" inside of the callback.
     * @return {void}
     * @method listen
     */
    listen: function(name, callback, scope){
        var listeners = this._listeners;
        
        if (!listeners[name]){
            listeners[name] = [];
        }
        
        /*
         * In my experience, the #1 cause of issues with callback functions
         * is that someone passes in a value that they think contains a 
         * function but actually doesn't. Then when something tries to call
         * that function, there's an error that's hard to track down. Throwing
         * an error here allows you to trap the issue at the listen() method,
         * which is where the wrong value is being passed in. This improves
         * debugging such issues dramatically.
         */
        if (typeof callback == "function"){
            listeners[name].push({
                callback: callback,
                scope:scope
            });
        } else {
            throw new Error("Callback must be a function.");
        }
    },
    
    /**
     * Unregisters a listener for a particular message. The callback function
     * and the scope must match the ones passed into listen() to be removed.
     * @param {String} name The name of the message the listener was registered for.
     * @param {Function} callback The function to remove.
     * @param {Object} scope The value for "this" inside of the callback.
     * @return {Boolean} True if the callback was removed, false if not.
     * @method listen
     */
    unlisten: function(name, callback, scope){
        var i, len,
            nameListeners = this._listeners[name],
            removed = false;
            
        if (nameListeners){
            for (i=0, len=nameListeners.length; i < len; i++){
                if (nameListeners[i].callback === callback && nameListeners[i].scope === scope){
                    nameListeners[i].splice(i, 1);
                    removed = true;
                    break;
                }
            }        
        }
        
        return removed;
    }

};


}, 'gallery-2011.04.27-17-14' );
