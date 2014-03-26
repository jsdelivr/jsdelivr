YUI.add('gallery-y64', function(Y) {

/*global YUI*/
var Base64 = Y.Base64;

/*
 * Copyright (c) 2009 Nicholas C. Zakas. All rights reserved.
 * http://www.nczonline.net/
 */

/**
 * Y64 encoder/decoder
 * @module gallery-y64
 */

/**
 * Y64 encoder/decoder
 * @class Y64
 * @static
 */
Y.Y64 = {
    
    /**
     * Y64-decodes a string of text.
     * @param {String} text The text to decode.
     * @return {String} The Y64-decoded string.
     */    
    decode: function(text){

        //ignore white space
        text = text.replace(/\s/g,"");
            
        //first check for any unexpected input
        if(!(/^[a-z0-9\._\s]+\-{0,2}$/i.test(text)) || text.length % 4 > 0){
            throw new Error("Not a Y64-encoded string.");
        }    
    
        //change to base64 format
        text = text.replace(/[\._\-]/g, function(match){
            switch(match){
                case ".": return "+";
                case "-": return "=";
                case "_": return "/";
            }
        });
        
        //decode it
        return Base64.decode(text);
    
    },


    /**
     * Y64-encodes a string of text.
     * @param {String} text The text to encode.
     * @return {String} The Y64-encoded string.
     */
    encode: function(text){
        
        if (/([^\u0000-\u00ff])/.test(text)){
            throw new Error("Can't Y64 encode non-ASCII characters.");
        }   
     
        //first, base64 encode
        var output = Base64.encode(text);
        
        //then, replace the appropriate characters
        output = output.replace(/[\+=\/]/g, function(match){
            switch(match){
                case "+": return ".";
                case "=": return "-";
                case "/": return "_";
            }
        });        
        
        return output;
    }

};


}, 'gallery-2010.06.16-19-51' ,{requires:['gallery-base64']});
