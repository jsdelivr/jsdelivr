/**
 * Copyright (C) 2012 Jason Feinstein
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function(){
    var Ancestry = {
        _isArray: function(obj){
            return obj.constructor.toString().indexOf("Array") !== -1;
        },
        
        _extend: function(destination, source){
            var i, len;

            for(i in source){
                if(source.hasOwnProperty(i)){
                    destination[i] = source[i];
                }
            }

            return destination;
        },
        
        /**
         * Causes ChildClass to inherit all of the methods from 
         * parentClasses, then mixes in the prototype object.
         */
        inherit: function(ChildClass, parentClasses, proto){
            if(!Ancestry._isArray(parentClasses)){
                parentClasses = [parentClasses];
            }
            
            var i = 0,
                len = parentClasses.length,
                resultPrototype = {};
            
            for(; i < len; i++){
                Ancestry._extend(resultPrototype, parentClasses[i].prototype);
            }
            Ancestry._extend(resultPrototype, proto);
            
            resultPrototype.superclasses = parentClasses;
            
            // the super constructor is the constructor of the last element in parentClasses.
            ChildClass.superconstructor = parentClasses[parentClasses.length-1];
            ChildClass.superclasses = parentClasses;
            ChildClass.prototype = resultPrototype;
        },
            
        /**
         * Determines whether or not the child class is a child of 
         * the parentCandidate.
         */
        instanceOf: function(child, parentCandidate){
            var superclasses = Ancestry._extend([], child.superclasses),
                superclass,
                children,
                i, len;
            
            if (parentCandidate === Object) {
                return true;
            }
            
            if (typeof superclasses === 'undefined') { 
                return false;
            }
            
            if (!Ancestry._isArray(superclasses)) {
                superclasses = [superclasses];
            }
            
            do {
                superclass = superclasses.shift();
                
                if (superclass === parentCandidate) {
                    return true;
                }
                
                parents = superclass.superclasses;
                
                if (typeof parents !== 'undefined') {
                    if (!Ancestry._isArray(parents)) {
                        parents = [parents]
                    }
                    
                    superclasses = superclasses.concat(parents);
                }
            } while (superclasses.length > 0);
            
            return false;
        }
    }; 
    
    if(typeof define !== 'undefined'){ // require/AMD exists.
        define([], Ancestry);
    } else if (typeof require !== 'undefined'){ // commonjs
        Ancestry._extend(exports, Ancestry);
    } else { // put in window scope
        window.Ancestry = Ancestry;
    }

})();

