/**
 * 1.6 functions for js.js 
 */
'use strict';

Array.prototype.indexOf = function(needle, fromIndex) {
	for (var i = Number(fromIndex || 0), c = this.length; i < c; i++) {
		if (this[i] === needle)
			return i;
	}
	return -1;
};

Array.prototype.lastIndexOf = function(needle, fromIndex) {
	var i = this.length;
	if (fromIndex) {
		i = fromIndex > 0 ? fromIndex > i ? i : fromIndex + 1 : i + fromIndex + 1;
	}
	while (i--) {
		if (this[i] === needle)
			return i;
	}
	return -1;
};

Array.prototype.forEach = function(method, that) {
	that = that || this;
	for (var i = 0, c = this.length; i < c; i++)
		method.call(that, this[i], i, this);
};

Array.prototype.every = function(method, that) {
	that = that || this;
	var i = this.length;
	while (i--) {
		if (!method.call(that, this[i], i, this))
			return false;
	}
	return true;
};

Array.prototype.filter = function(method, that){
	that = that || this;
	for (var i = 0, c = this.length, value, result = []; i < c; i++){
		value = this[i];		
		if(method.call(that, value, i, this))
			result.push(value);
	}
	return result;
};

Array.prototype.map = function(method, that){
	console.log('map');
	that = that || this;
	var i = this.length
	  , result = []
	  ;
	
	console.log(i);
	while(i--)
		result[i] = method.call(that, this[i], i, this);
	
	console.log(result);
	
	return result;
};

Array.prototype.some = function(method, that) {
	that = that || this;
	var i = this.length;
	while (i--) {
		if (method.call(that, this[i], i, this))
			return true;
	}
	return false;
};