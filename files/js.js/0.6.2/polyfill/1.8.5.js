/**
 * 1.8.5 functions for js.js 
 */
Array.isArray = function(arg){
	return Object.prototype.toString.call(arg) === '[object Array]';
};

// Date.prototype.toJson
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toJSON 

Object.create = function(){
	return (Object.create = (function(){
		var blank = function(){};
		return function(prototype){
			blank.prototype = prototype;
			var result = new blank;
			blank.prototype = null;
			return result;
		};
	})()).apply(this, arguments);
};

Object.keys = function(target) {
	return	(Object.keys = ({toString : null}).propertyIsEnumerable('toString') ?
	
		function(target) {
			var keys = [], key;
			for (key in target)
				Object.prototype.hasOwnProperty.call(target, key) &&
					keys.push(key);
			return keys;
		} :
		(function(has){
			var $feed = [
					'toString'
				  , 'toLocaleString'
				  , 'valueOf'
				  , 'hasOwnProperty'
				  , 'isPrototypeOf'
				  , 'propertyIsEnumerable'
				  , 'constructor'
				]
			  , $length = $feed.length
			  ;
			  
			return function(target) {
				var keys = []
				  , key
				  ;
				for (key in target)
					has.call(target, key) &&
						keys.push(key);
				key = $length;
				while (key--)
					has.call(target, $feed[key]) &&
						keys.push($feed[key]);
				return keys;
			};
		})(Object.prototype.hasOwnProperty)
	).apply(this, arguments);
};