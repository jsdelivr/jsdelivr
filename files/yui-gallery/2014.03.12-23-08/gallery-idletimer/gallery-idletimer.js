YUI.add('gallery-idletimer', function(Y) {

/*
 * Copyright (c) 2009 Nicholas C. Zakas. All rights reserved.
 * http://www.nczonline.net/
 */

/**
 * Idle timer
 * @module gallery-idletimer
 */

//-------------------------------------------------------------------------
// Private variables
//-------------------------------------------------------------------------

var idle    = false,        //indicates if the user is idle
    tId     = -1,           //timeout ID
    enabled = false,        //indicates if the idle timer is enabled
    doc = Y.config.doc,     //shortcut for document object
    timeout = 30000;        //the amount of time (ms) before the user is considered idle

//-------------------------------------------------------------------------
// Private functions
//-------------------------------------------------------------------------
    
/* (intentionally not documented)
 * Handles a user event indicating that the user isn't idle.
 * @param {Event} event A DOM2-normalized event object.
 * @return {void}
 */
function handleUserEvent(event){

    //clear any existing timeout
    clearTimeout(tId);
    
    //if the idle timer is enabled
    if (enabled){
    
        if (/visibilitychange/.test(event.type)){
            toggleIdleState(doc.hidden || doc.msHidden || doc.webkitHidden || doc.mozHidden);
        } else {
            //if it's idle, that means the user is no longer idle
            if (idle){
                toggleIdleState();           
            } 
        }

        //set a new timeout
        tId = setTimeout(toggleIdleState, timeout);
    }    
}

/* (intentionally not documented)
 * Toggles the idle state and fires an appropriate event.
 * @param {Boolean} force (Optional) the value to set idle to.
 * @return {void}
 */
function toggleIdleState(force){

    var changed = false;
    if (typeof force != "undefined"){
        if (force != idle){
            idle = force;
            changed = true;
        }
    } else {
        idle = !idle;
        changed = true;
    }
    
    if (changed){
        //fire appropriate event
        Y.IdleTimer.fire(idle ? "idle" : "active");    
    }
}

//-------------------------------------------------------------------------
// Public interface
//-------------------------------------------------------------------------

/**
 * Centralized control for determining when a user has become idle
 * on the current page.
 * @class IdleTimer
 * @static
 */
Y.IdleTimer = {
    
    /**
     * Indicates if the idle timer is running or not.
     * @return {Boolean} True if the idle timer is running, false if not.
     * @method isRunning
     * @static
     */
    isRunning: function(){
        return enabled;
    },
    
    /**
     * Indicates if the user is idle or not.
     * @return {Boolean} True if the user is idle, false if not.
     * @method isIdle
     * @static
     */        
    isIdle: function(){
        return idle;
    },
    
    /**
     * Starts the idle timer. This adds appropriate event handlers
     * and starts the first timeout.
     * @param {int} newTimeout (Optional) A new value for the timeout period in ms.
     * @return {void}
     * @method start
     * @static
     */ 
    start: function(newTimeout){
        
        //set to enabled
        enabled = true;
        
        //set idle to false to begin with
        idle = false;
        
        //assign a new timeout if necessary
        if (typeof newTimeout == "number"){
            timeout = newTimeout;
        }
        
        //assign appropriate event handlers
        Y.on("mousemove", handleUserEvent, doc);
        Y.on("mousedown", handleUserEvent, doc);
        Y.on("keydown", handleUserEvent, doc);

        //need to add the old-fashioned way
        if (doc.addEventListener) {
            doc.addEventListener("msvisibilitychange", handleUserEvent, false);
            doc.addEventListener("webkitvisibilitychange", handleUserEvent, false);
            doc.addEventListener("mozvisibilitychange", handleUserEvent, false);
        }
        
        //set a timeout to toggle state
        tId = setTimeout(toggleIdleState, timeout);
    },
    
    /**
     * Stops the idle timer. This removes appropriate event handlers
     * and cancels any pending timeouts.
     * @return {void}
     * @method stop
     * @static
     */         
    stop: function(){
    
        //set to disabled
        enabled = false;
        
        //clear any pending timeouts
        clearTimeout(tId);
        
        //detach the event handlers
        Y.detach("mousemove", handleUserEvent, doc);
        Y.detach("mousedown", handleUserEvent, doc);
        Y.detach("keydown", handleUserEvent, doc);

        if (doc.removeEventListener) {
            doc.removeEventListener("msvisibilitychange", handleUserEvent, false);
            doc.removeEventListener("webkitvisibilitychange", handleUserEvent, false);
            doc.removeEventListener("mozvisibilitychange", handleUserEvent, false);
        }
      
    }

};

//inherit event functionality
Y.augment(Y.IdleTimer, Y.Event.Target);


}, 'gallery-2012.09.12-20-02' ,{requires:['event','event-custom']});
