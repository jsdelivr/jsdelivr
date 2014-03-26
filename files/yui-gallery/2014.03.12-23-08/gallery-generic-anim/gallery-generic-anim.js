YUI.add('gallery-generic-anim', function(Y) {

/*
 * Copyright (c) 2010 Patrick Cavit. All rights reserved.
 * http://www.patcavit.com/
 */

var L = Y.Lang;

Y.GenericAnim = Y.Base.create("genericAnim", Y.Base, [], {
    _frame : 0,
    _timer : null,
    _start : null,
    
    initializer : function() {
        var args = { preventable : false, emitFacade : false };
        this.publish("step", args);
        this.publish("complete", args);
        this.publish("stopped", args);
        this.publish("end", args);
    },
    
    run : function() {
        this.publish("start", {
            defaultFn : function() {
                var steps = this.get("steps");
                
                this._frame = 0;
                
                if(this._timer && L.isFunction(this._timer.cancel)) {
                    
                    this._timer.cancel();
                }
                
                this._timer = Y.later(Math.floor(this.get("duration") / steps), this, function() {
                    if(this._frame < steps) {
                        
                        this.fire("step", ++this._frame);
                    } else {
                        
                        this._timer.cancel();
                        this.fire("complete");
                        this.fire("end");
                    }
                }, null, true);
            }
        }).fire();
    },
    
    stop : function() {
        if(this._timer && L.isFunction(this._timer.cancel)) {
            
            this._timer.cancel();
            this.fire("stopped");
            this.fire("end");
        }
    },
    
    destructor : function() { 
        this.stop();
        this._timer = null;
    }
}, {
    NS : "anim",
    ATTRS : {
        duration : {
            value : 0.5,
            getter : function(val) {
                return Math.floor(val * 1000);
            }
        },
        
        steps : {
            value : 10,
            validator : L.isNumber
        }
    }
});


}, 'gallery-2010.09.22-20-15' ,{requires:['base']});
