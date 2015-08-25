/**
 * 1.8.1 functions for js.js 
 */
'use strict';

(function(){
	var _start = /^[\s\uFEFF\xA0]+/
	  , _end = /[\s\uFEFF\xA0]+$/
	  ;
	
	String.prototype.trim = function(){
		return this.replace(_start, '').replace(_end, '');
	};
	
	// not standard
	String.prototype.trimLeft = function(){
		return this.replace(_start, '');
	};
	
	// not standard
	String.prototype.trimRight = function(){
		return this.replace(_end, '');
	};
})();


