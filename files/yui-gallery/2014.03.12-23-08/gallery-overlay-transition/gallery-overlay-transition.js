YUI.add('gallery-overlay-transition', function(Y) {

var L = Y.Lang;

Y.Plugin.TransitionOverlay = Y.Base.create("overlayTransitionPlugin", Y.Plugin.Base, [], {

    _showing : false,
    _styleCache : false,

    initializer : function(config) {
        var t = this,
            eventArgs = { preventable : false, emitFacade : false, bubbles : false };
        
        // Override default _uiSetVisible method
        t.doBefore("_uiSetVisible", t._uiAnimSetVisible); 
        
        //cache references
        t._host = t.get("host");
        t._bb = t._host.get("boundingBox");
        
        t.publish({
            start : eventArgs,
            end   : eventArgs
        });
        
        //if the first visible change is from hidden to showing, handle that
        if(t.get("styleOverride")) {
            t._styleCache = {};
            
            t._host.once("visibleChange", function(o) {
                (o.newVal && !o.prevVal) && t._applyDefaultStyle();
            }, t);
        }
    },
    
    destructor : function() {
        this._host = this._bb = null;
    },
    
    _applyDefaultStyle : function() {
        var hide = this.get("hide"),
            bb = this._bb;
        
        //cache the previous versions of our style
        Y.Object.each(hide, function(v, p) {
            var style = bb.getComputedStyle(p);
            
            //if we asked for an invalid property it'll return the bounding box Node, so check for that first
            (style !== bb) && (this._styleCache[p] = style);
        }, this);
        
        //apply default hidden style
        (!this._host.get("visible")) && bb.setStyles(hide);
    },
    
    _uiAnimSetVisible : function(val) {
        var host = this._host,
            showing;
        
        if (host.get("rendered")) {
            this._showing = val;
            
            this.fire("start", val);
            
            val && this._uiSetVisible(true);
            
            this._bb.transition((val) ? this.get("show") : this.get("hide"), Y.bind(function() {
                this.fire("end", val);
                
                (!val) && this._uiSetVisible(false);
            }, this));
            
            return new Y.Do.Prevent("AnimPlugin prevented default show/hide");
        }
    },

    /*
     * The original Widget _uiSetVisible implementation
     */
    _uiSetVisible : function(val) {
        this._bb.toggleClass(this._host.getClassName("hidden"), !val);
    },
    
    _optionsMerge : function(value) {
        return Y.merge(this.getAttrs([ "duration", "easing" ]), value);
    }
}, {
    NS : "transitionPlugin",
    ATTRS : {
        duration : { 
            value : 0.25 
        },
        
        easing : {
            value : "ease-in"
        },
        
        styleOverride : { 
            value : true,
            validator : L.isBoolean
        },
        
        hide : {
            value : { 
                opacity : 0 
            },
            setter : "_optionsMerge"
        },

        show : {
            value : { 
                opacity : 1 
            },
            setter : "_optionsMerge"
        }
    }
});


}, 'gallery-2011.07.13-21-54' ,{requires:['plugin','base-build','event-custom','transition']});
