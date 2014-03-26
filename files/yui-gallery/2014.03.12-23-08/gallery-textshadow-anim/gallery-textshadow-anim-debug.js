YUI.add('gallery-textshadow-anim', function(Y) {

/*
 * Copyright (c) 2010 Patrick Cavit. All rights reserved.
 * http://www.patcavit.com/
 */

//figure out the shadow type
var NUM = function(n) {
        return parseInt(n, 10);
    },
    FLOOR = Math.floor,
    lengthRegex = /(\-?[\d\.]+(px)?)/,
    colorRegex = /\s*(rgb\(.+\)|#\w{3,6}|[^#]?[a-z]{3,})\s*/i, //doesn't have to be exact!
    parseStyle = function(style) {
        var color = [ "rgb(0, 0, 0)", 0, 0, 0 ],
            lengths = [ 0, 0, 0 ],
            pieces, tokens, length, i, l, t, tl, lc;
        
        if(!style || style === "none") {
            return {
                lengths : lengths,
                color : color
            };
        }
        
        pieces = style.split(colorRegex);
        
        for(i = 0, l = pieces.length; i < l; i++) {
            if(pieces[i].length) {
                if(colorRegex.test(pieces[i])) {
                    color = Y.Color.re_RGB.exec(Y.Color.toRGB(pieces[i]));
                } else {
                    tokens = pieces[i].split(" ");
                    
                    lc = 0;
                    
                    for(t = 0, tl = tokens.length; t < tl; t++) {
                        length = tokens[t].match(lengthRegex);
                        
                        if(length && length.length) {
                            lengths[lc++] = length[0];
                            continue;
                        }
                    }
                }
            }
        }
        
        return {
            color : color,
            lengths : lengths
        };
    };

Y.Anim.behaviors.textShadow = {
    set : function(anim, att, from, to, elapsed, duration, fn) {
        from = parseStyle((typeof from == "object") ? from.getStyle("textShadow") : from);
        to = parseStyle((typeof to == "object") ? to.getStyle("textShadow") : to);
        
        var fromColor = from.color,
            fromLengths = from.lengths,
            toColor = to.color,
            toLengths = to.lengths;
        
        if(!fromColor || fromColor.length < 2 || !toColor || toColor.length < 2) {
            Y.error('invalid from or to');
        }
        
        if(fromLengths.length != toLengths.length) {
            Y.error("invalid length");
        }
        
        anim._node.setStyle("textShadow",
            'rgb(' + [ FLOOR(fn(elapsed, NUM(fromColor[1]), NUM(toColor[1]) - NUM(fromColor[1]), duration)),
                       FLOOR(fn(elapsed, NUM(fromColor[2]), NUM(toColor[2]) - NUM(fromColor[2]), duration)),
                       FLOOR(fn(elapsed, NUM(fromColor[3]), NUM(toColor[3]) - NUM(fromColor[3]), duration))
                     ].join(', ') + ')' +
            fn(elapsed, NUM(fromLengths[0]), NUM(toLengths[0]) - NUM(fromLengths[0]), duration) + "px " +
            fn(elapsed, NUM(fromLengths[1]), NUM(toLengths[1]) - NUM(fromLengths[1]), duration) + "px " +
            fn(elapsed, NUM(fromLengths[2]), NUM(toLengths[2]) - NUM(fromLengths[2]), duration) + "px ");
    },
    
    //emulate Y.Node.scrubVal behavior where we return a node reference
    get: function(anim, att) {
        return anim._node.getComputedStyle("textShadow") || anim._node;
    }
};


}, 'gallery-2010.09.22-20-15' ,{requires:['anim-base']});
