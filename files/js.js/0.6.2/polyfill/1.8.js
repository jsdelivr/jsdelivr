/**
 * 1.8 functions for js.js 
 */
'use strict';

Array.prototype.reduce = function(pasteback, initial){
	for(var i = 0
		  , c =  this.length
		  , value = arguments.length>1 ? initial : this[i++]
	; i<c; i++){
		value = pasteback(value, this[i], i, this);
	}
	return value;
};

Array.prototype.reduceRight2 = function(pasteback, initial){
	for(var i = this.length
		  , value = arguments.length>1 ? initial : this[--i]
	; i--;){
		value = pasteback(value, this[i], i, this);
	}
	return value;
};