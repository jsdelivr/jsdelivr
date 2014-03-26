YUI.add('gallery-animloop', function(Y) {

/*
 * Copyright (c) 2011 Nicholas C. Zakas. All rights reserved.
 * http://www.nczonline.net/
 */

/**
 * Animation loop for optimizing game animation control. Based on
 * technique described at http://nokarma.org/2010/02/02/javascript-game-development-the-game-loop/.
 * @module gallery-animloop
 */
/*global YUI*/

//-----------------------------------------------------------------------------
// Local Variables
//-----------------------------------------------------------------------------

var run = false,                    //determines if the loop should be executed
    runLoop,                        //method that starts the loop
    event = {type:"beforedraw"},    //event that fires before it's time to draw
    AnimLoop;                       //main object

//-----------------------------------------------------------------------------
// Main Object
//-----------------------------------------------------------------------------

/**
 * Represents an animation loop, set for optimal frames-per-second rates
 * using either setInterval() or available requestAnimationFrame methods.
 * In order to use, assign an event handler to the "beforedraw" event,
 * this is where you should do any calculations for animation.
 * @class AnimLoop
 * @static
 */
AnimLoop = {

    /**
     * Starts the animation loop.
     * @method start
     * @return {void}
     */
    start: function(){
        if (!run){
            Y.log("Request to start animation loop.", "info", "AnimLoop");
            run = true;
            runLoop();
        }
    },
    
    /**
     * Stops the animation loop by setting the run variable to false.
     * The next time a draw happens, this flag is checked and the
     * animation loop will be aborted.
     * @method stop
     * @return {void}
     */
    stop: function(){
        Y.log("Request to stop animation loop.", "info", "AnimLoop");                
        run = false;
    }
};

//inherit custom events
Y.augment(AnimLoop, Y.Event.Target);

//determine the best function to use for drawing
runLoop = (function(){
    var innerFunction,
        intervalId;
    if (window.mozRequestAnimationFrame){
        innerFunction = function() {
            if (run){
                Y.log("Running using mozRequestAnimationFrame.", "info", "AnimLoop");
            
                AnimLoop.fire(event);
                window.mozRequestAnimationFrame(innerFunction);
            }  
            Y.log("Stopping animation loop.", "info", "AnimLoop");
        };
    } else if (window.webkitRequestAnimationFrame){
        innerFunction = function() {
            if (run){
                Y.log("Running using webkitRequestAnimationFrame.", "info", "AnimLoop");
                AnimLoop.fire(event);
                window.webkitRequestAnimationFrame(innerFunction);
            }  
        };
        Y.log("Stopping animation loop.", "info", "AnimLoop");
    } else {
        innerFunction = function(){
            intervalId = setInterval(function(){
                if (run){
                    Y.log("Running using setInterval.", "info", "AnimLoop");
                    AnimLoop.fire(event);
                } else {
                    Y.log("Stopping animation loop.", "info", "AnimLoop");
                    clearInterval(intervalId);
                }
            }, 1000 / 60);
        
        }
    }
    
    return innerFunction;
})();

//export
Y.AnimLoop = AnimLoop;


}, 'gallery-2011.02.09-21-32' ,{requires:['event-base','event-custom-base']});
