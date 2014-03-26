YUI.add('gallery-boxshadow-anim', function(Y) {

/*
 * Copyright (c) 2010 Patrick Cavit. All rights reserved.
 * http://www.patcavit.com/
 */

//figure out the shadow type
var shadowType = (function() {
        var el = document.createElement("boxshadowtest"),
            types = [ "boxShadow", "MozBoxShadow", "WebkitBoxShadow", "KhtmlBoxShadow" ],
            i, l;
        
        for(i = 0, l = types.length; i < l; i++) {
            if(typeof el.style[types[i]] !== "undefined") { 
                el = null; //clean up after ourselves
                
                return types[i];
            }
        }
    })(),
    NUM = function(n) {
        return parseInt(n, 10);
    },
    lengthRegex = /(\-?[\d\.]+(px)?)/,
    colorRegex = /\s*(rgb\(.+\)|#\w{3,6}|[^#]?[a-z]{3,})\s*/i, //doesn't have to be exact!
    parseStyle = function(style) {
        var defaultLengths = [ 0, 0, 0 ,0 ],
            defaultColor = [ "rgb(0, 0, 0)", 0, 0, 0 ],
            out, pieces, tokens, length, color, i, l, t, tl, lc;
        
        if(!style || style === "none") {
            return {
                lengths : defaultLengths,
                color : defaultColor,
                inset : false
            };
        }
        
        out = { 
            lengths : defaultLengths,
            inset : (style.indexOf("inset") != -1)
        };
        
        pieces = style.split(colorRegex);
        
        for(i = 0, l = pieces.length; i < l; i++) {
            if(pieces[i].length) {
                if(colorRegex.test(pieces[i]) && !out.color) {
                    out.color = Y.Color.re_RGB.exec(Y.Color.toRGB(pieces[i]));
                } else {
                    tokens = pieces[i].split(" ");
                    
                    lc = 0;
                    
                    for(t = 0, tl = tokens.length; t < tl; t++) {
                        length = tokens[t].match(lengthRegex);
                        
                        if(length && length.length) {
                            out.lengths[lc++] = length[0];
                            continue;
                        }
                    }
                }
            }
        }
        
        if(!out.color) {
            out.color = defaultColor;
        }
        
        if(!out.lengths.length) {
            Y.error("sending back bad output!");
        }
        
        return out;
    };

Y.Anim.behaviors.boxShadow = {
    set : function(anim, att, from, to, elapsed, duration, fn) {
        var boxShadow;
        
        from = parseStyle((typeof from == "object") ? from.getStyle(shadowType) : from);
        to = parseStyle((typeof to == "object") ? to.getStyle(shadowType) : to);
       
        if(!from.color || from.color.length < 3 || !to.color || to.color.length < 3) {
            Y.error('invalid from or to passed to color behavior');
        }
        
        if(from.lengths.length != to.lengths.length) {
            Y.error("invalid from or to length definition");
        }
        
        boxShadow = 
            fn(elapsed, NUM(from.lengths[0]), NUM(to.lengths[0]) - NUM(from.lengths[0]), duration) + "px " +
            fn(elapsed, NUM(from.lengths[1]), NUM(to.lengths[1]) - NUM(from.lengths[1]), duration) + "px " +
            fn(elapsed, NUM(from.lengths[2]), NUM(to.lengths[2]) - NUM(from.lengths[2]), duration) + "px " +
            fn(elapsed, NUM(from.lengths[3]), NUM(to.lengths[3]) - NUM(from.lengths[3]), duration) + "px " +
            'rgb(' + [
                Math.floor(fn(elapsed, NUM(from.color[1]), NUM(to.color[1]) - NUM(from.color[1]), duration)),
                Math.floor(fn(elapsed, NUM(from.color[2]), NUM(to.color[2]) - NUM(from.color[2]), duration)),
                Math.floor(fn(elapsed, NUM(from.color[3]), NUM(to.color[3]) - NUM(from.color[3]), duration))
            ].join(', ') + ')' +
            ((to.inset) ? "inset" : "");
        
        anim._node.setStyle(shadowType, boxShadow);
    },
    
    //emulate Y.Node.scrubVal behavior where we return a node reference
    get: function(anim, att) {
        return anim._node.getComputedStyle(shadowType) || anim._node;
    }
};


}, 'gallery-2010.08.18-17-12' ,{requires:['anim-base']});
