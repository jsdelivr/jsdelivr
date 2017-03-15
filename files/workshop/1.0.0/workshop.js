; var Workshop = (function(){

/**
 * Workshop Namespace
 * @namespace
*/
var Workshop = {};

// *************************
// DOM
// *************************
Object.defineProperty(document, "getElementsByAttributeName", {
	enumerable:false,
	value: function _getElAttName(name, type){
		if(name.includes('*') || (name instanceof RegExp)){
			return Array.from(document.querySelectorAll(type || '*')).filter(function(el){
				var ok = false;
				Array.from(el.attributes).forEach( function(attr){
					if(name instanceof RegExp){
						ok = attr.name.match(name);
					} else {
						ok = attr.name.startsWith(name.slice(0, name.indexOf('*')));
					}
				});
				return ok;
			});
		} else {
			return document.querySelectorAll("["+name+"]");
		}
	}
});

Object.defineProperty(document, "getElementsByAttribute", {
	enumerable:false,
	value: function _getElAttName(name, value){
		return document.querySelectorAll("["+name+"="+value+"]");
	}
});

// *************************
// Object
// *************************
Object.defineProperty(Object, "equals", {
	enumerable: false,
	value: function _objEq(obj1, obj2){
		for(var p in obj1){
			if(typeof obj2[p] == 'undefined') return false;
			if(obj2[p] != obj1[p]) return false;
		}

		for(var p in obj2){
			if(typeof obj1[p] == 'undefined') return false;
			if(obj2[p] != obj1[p]) return false;
		}
		return true;
	}
});

Object.defineProperty(Object, "isStrictlyEqual", {
	enumerable: false,
	value: function _objEq(obj1, obj2){
		for(var p in obj1){
			if(typeof obj2[p] == 'undefined') return false;
			if(obj2[p] !== obj1[p]) return false;
		}

		for(var p in obj2){
			if(typeof obj1[p] == 'undefined') return false;
			if(obj2[p] !== obj1[p]) return false;
		}
		return true;
	}
});

Object.defineProperty(Object, "duplicate", {
	enumerable: false,
	writable: false,
	value: function _duplicateObject(obj){
		if(obj instanceof Array) return obj.duplicate();
		var res = {};
		for(var p in obj){
			if(obj[p] instanceof Object){
				res[p] = Object.duplicate(obj[p]);
			}else{
				res[p] = obj[p];
			}
		}

		return res;
	}
});

Object.defineProperty(Object, "compare", {
	enumerable:false,
	value:function(obj1, obj2, fields){
		for(var i = 0; i < fields.length; i++){
			var p = fields[i];
			if(typeof obj1[p] == 'undefined' || typeof obj2[p] == 'undefined') return false;
			if(obj1[p] != obj2[p]) return false;
		}
		return true;
	}
});

Object.defineProperty(Object, "sort", {
	enumerable: false,
	value: function(obj){
		var sortedKeys = Object.keys(obj).sort();
		var result = {};
		sortedKeys.forEach(function(key){
			result[key] = obj[key];
		});

		return result;
	}
});

// *************************
// Arrays
// *************************

/**
 * Finds an object in an array thanks to a single property
 * @param {string} prop - The property to look for (i.e. "id")
 * @param {} value - The value to match in the obejct
 * @returns {Object} Returns found object or NULL 
*/
Object.defineProperty(Array.prototype, "findObjectByProperty", {
	value: function _findObjectByProp (prop, value) {
		for(var i = 0; i<this.length; i++){
			if (this[i][prop] == value){
				this[i].found_index = i;
				return this[i];
			}
		}
		return null;
	},
	enumerable: false,
	writable:false,
});


/**
 * Finds multiple objects in an array thanks to a single property
 * @param {string} prop - The property to look for (i.e. "id")
 * @param {} value - The value to match in the obejct
 * @returns {Object} Returns found object or NULL
*/
Object.defineProperty(Array.prototype, "findObjectsByProperty", {
	value: function _findObjectsByProp (prop, value) {
		var results = [];
		for(var i = 0; i<this.length; i++){
			if (this[i][prop] == value){
				this[i].found_index = i;
				results.push(this[i]);
			}
		}
		return (results.length == 0) ? null : results;
	},
	enumerable: false,
	writable: false
});

Object.defineProperty(Array.prototype, "first", {
	get : function(){
		return this[0];
	},

	set : function(a){
		this[0] = a;
	},
	enumerable: false,
});

Object.defineProperty(Array.prototype, "lastIndexByProperty", {
	enumerable: false,
	writable: false,
	value: function _lastIndexProp(property, value){
		var res = this.findObjectsByProp(property, value);
		if(res == []) return;
		res = res.sort(function(a, b){
			return a.found_index - b.found_index;
		});
		return res.last.found_index;
	}
});

Object.defineProperty(Array.prototype, "firstIndexByProperty", {
	enumerable: false,
	writable: false,
	value: function _firstIndexProp(property, value){
		var res = this.findObjectsByProp(property, value);
		if(res == []) return;
		res = res.sort(function(a, b){
			return a.found_index - b.found_index;
		});
		return res[0].found_index;
	}
});

Object.defineProperty(Array.prototype, "indexOfObject", {
	enumerable: false,
	writable: false,
	value:function _indexObject(obj, startingAt, compareFields){
		var func = Object.isStrictlyEqual;
		if(typeof compareFields != 'undefined'){
			func = Object.compare
		}
	
		if(typeof startingAt == 'undefined') startingAt = 0;
		for(var i = startingAt; i < this.length; i++){
			if(func(this[i], obj, compareFields)){
				return i;
			}
		}
		return -1;
	}
});

Object.defineProperty(Array.prototype, "last", {
	get : function(){
		return this[this.length - 1];
	},

	set : function(a){
		this[this.length - 1] = a;
	},
	enumerable: false,
});

Object.defineProperty(Array.prototype, "isUnique", {
	enumerable:false,
	get:function(){
		var notUniqueElements = [];
		for(var i = 0; i < this.length; i++){
			if(this.indexOf(this[i], i+1) != -1){
				notUniqueElements.push(this[i]);
			}
		}
		if(notUniqueElements.length > 0) return {result: false, not_unique: notUniqueElements};
		return {result:true};
	}
});

Object.defineProperty(Array.prototype, "duplicate", {
	enumerable: false,
	value: function(){
		return this.slice(0);
	}
});

// *************************
// Numbers
// *************************

/**
 * Checks if number is between A and B (A<x<B)
 * @param {number} a - The lower value to check against
 * @param {number} b - The upper value to check against
 * @returns {bool}
*/
Object.defineProperty(Number.prototype, "isBetween", {
	value: function _isBetween (a, b, includes){
		if (!includes) includes = 0;
		switch(includes){
			case -1 :
				if(this >= a && this < b) return true;
				break;
			case 2 :
				if(this >= a && this <= b) return true;
				break;
			case 1 :
				if(this > a && this <= b) return true;
				break;
			case 0 :
				if(this > a && this < b) return true;
				break;
		}
		return false;
	},
	enumerable: false,
	writable: false
});

// *************************
// Math
// *************************

Math.ZERO = 0;
Math.GOLDEN_RATIO = (Math.sqrt(5)+1)/2;
Math.INVERSE_GOLDEN_RATIO = 1/Math.GOLDEN_RATIO;
Math.GOOGOL = 1e100;
	// Physics
Math.G = 9.80665;
Math.AU = 1.4959787066 * 1e11;

Math.map = {
	/**
	 * Maps a vlaue to a linear function
	 * @param {number} value - Value to find in function
	 * @param {point} point1 - First point of function, described as {x:, y:}
	 * @param {point} point2 - Second point of function, described as {x:, y:}
	 * @returns {number} The corresponding Y value of the given value (as f(value) = y)
	*/
	linear: function _mapLinear(val, point1, point2){
		if (point1.x == point2.x) throw new Error("In a linear expression xa and xb cannot be the same value");;
		if (point1.y == point2.y) throw new Error("In a linear expression ya and yb cannot be the same value");

		var a = (point2.y-point1.y)/(point2.x-point1.x);
		var b = point1.y - (a*point1.x);
		return a*val + b;
	},

	/**
	 * Maps a value form given bounds
	 * @param {number} value - The value to map
	 * @param {Object} from - The 'from' values, given as: {min:, max:}
	 * @param {Object} to - The 'to' values, given as : {min:, max:}
	 * @returns {number} Value mapped to input value 
	*/
	bounds : function _mapBounds (val, _in, _out){
		return Math.map.linear(val, {x:_in.min, y: _out.min}, {x:_in.max, y:_out.max});
	},
};

Math.die = function(sides){
	this.sides = sides;

	this.roll = function(){
		return Math.ceil(Math.random() * this.sides);
	}
};

Math.roll_die = function _rollDie (number, sides){
	if(typeof number == "undefined"){
		number = 1;
	}

	if(typeof sides == "undefined"){
		sides = 6;
	}

	var sum = 0;
	for(var i = 0; i < number; i++){
		sum += Math.ceil(Math.random() * sides);
	}

	return sum;
};


Math.randomInt = function _randomInt(from, to){
	return Math.floor(Math.random() * (to-from) + from);
}

/**
 * Mathematical Sum
 * @param {int} from - First value of sum
 * @param {int} to - Las value of sum
 * @param {sting} formula - Formula to sum, as "Math.pow(x,2) + (Math.log(x))"
 * @param {int} [step] - The step to advance in sum, default is 1
 * @memberof Math
*/
Math.sum = function _mathSum(from, to, formula, step){
	//if no step defined step = 1
	step = step ? step : 1;
	to += step;

	var res = 0;
	for(var i = from; i < to; i = i + step){
		var tempFor = formula.replace('x', i);
		res += eval(tempFor);
	}

	return res
};

/**
 * Mathematical Sum
 * @param {int} from - First value of multiplication
 * @param {int} to - Las value of multiplication
 * @param {sting} formula - Formula to multiplicate, as "Math.pow(x,2) + (Math.log(x))"
 * @param {int} [step] - The step to advance in multiplication, default is 1
 * @memberof Math
*/
Math.mult = function _mathMult(from, to, formula, step){
	//if no step defined step = 1
	step = step ? step : 1;
	to += step;

	var res = 1;
	for(var i = from; i < to; i = i + step){
		var tempFor = formula.replace('x', i);
		res *= eval(tempFor);
	}

	return res;
};

Math.hypothenuse = function _hypothenuse(a, b){
	return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

/********************************
			STRIGNS
********************************/
Object.defineProperty(String.prototype, "reverse", {
	enumerable: false,
	value: function(){
		return this.split("").reverse().join("");
	}
});

/********************************
			FORMS
********************************/
Object.defineProperty(HTMLFormElement.prototype, "validate", {
	enumerable:false,
	value: function(outlineNormal, outlineValidation){
		if(typeof outlineNormal == 'undefined') outlineNormal = "none";
		if(typeof outlineValidation == 'undefined') outlineValidation = "#c62828 solid 1px";
		
		for(var i = 0; i < this.elements.length; i++){
			this.elements[i].style.outline = "none";
			if(this.elements[i].getAttribute("optional") === true || this.elements[i].getAttribute("optional") == "") continue;
			if(this.elements[i].value == ""){
				this.elements[i].style.outline = "#c62828 solid 1px";
				return false;
			}else{
				this.elements[i].style.outile = outlineNormal;
			}
		}

		return true;

	}
});


//AJAX

XMLHttpRequest.prototype.setRequestHeaders = function _setRequestHeaders(rh, defaultCT){
	if(!defaultCT) defaultCT = 'application/json';

	for(var header in rh){
		this.setRequestHeader(header, rh[header]);
	}
}


function workshop_ajax (params, callback, onupload){
	//params = url, method, callback(err, resp), data, async, debug, status, rh
	if (typeof params == 'undefined'){
		throw new Error("Parameters are required");
	}

	if(typeof params.debug == 'undefined' || params.debug == null) params.debug = false; 

	if (typeof params.url == 'undefined'){
		throw new Error("URL is required for Workshop.ajax");
	}

	if (typeof params.method == 'undefined' || (params.method != "GET" && params.method != "POST" && params.method != "DELETE" && params.method != "PUT")){
		throw new Error("method for Workshop.ajax is required and must be GET, POST, DELETE or PUT only");
	}

	var xml = new XMLHttpRequest();
	xml.onreadystatechange = function(){
		if(xml.readyState == 4){
			if (xml.status == (params.status || 200)){
				//readyState 4 = end of call and success
				if (typeof callback != 'undefined') callback(null, xml.responseText, xml);
				return xml.responseText;
			} else {
				if(params.debug) console.log("XMl Error: readyState: ", xml.readyState, " status:", xml.status);
				if (typeof callback != 'undefined') callback({error: {message: xml.statusText, state: xml.readyState, status: xml.status}}, xml.responseText, xml);
			}
		}
	};

	if(onupload){
		xml.upload.onloadstarts = onupload.onloadstarts || null;
		xml.upload.onprogress = onupload.onprogress || null;
		xml.upload.onerror = xml.upload.onabort = xml.upload.ontimeout = onupload.onerror || null;
		xml.upload.onload = onupload.onload || null;
		xml.upload.onloadend = onupload.onloadend || null;
	}

	xml.onerror = function(){
		if(params.debug) console.log("XMl Error: readyState: ", xml.readyState, " status:", xml.status);
		if (typeof callback != 'undefined') callback({error: {message: xml.statusText, state: xml.readyState, status: xml.status}}, xml.responseText, xml);
	};

	var async;
	if (typeof params.async != 'undefined'){
		async = params.async;
	}else{
		async = true;
	}

	if (params.method == "GET" || params.method == "DELETE"){

		if (typeof params.data == 'undefined'){
			xml.open(params.method, params.url, async);
			xml.setRequestHeaders(params.headers || {});
			xml.send();
		}else{
			var url = (params.url.substring(params.url.length-1, params.url.length) == "/")? "?" : "/?";
			for (var key in params.data){
				url += key + "=" + params.data[key] + "&";
			}
			url = url.substring(0,url.length-1);
			params.url += url;
			xml.open(params.method, params.url, async);
			xml.setRequestHeaders(params.headers || {});
			xml.send();
		}

	}else if(params.method == "POST" || params.method == "PUT"){
		xml.open(params.method, params.url, async);
			xml.setRequestHeaders(params.headers || {});
		if (typeof params.data != 'undefined'){
			if(params.headers && params.headers['Content-Type'] && params.headers['Content-Type'] == 'application/json'){
				xml.send(JSON.stringify(params.data));
			} else {
				xml.send(params.data);
			}
		}else{
			xml.send();
		}
	}
}

// Navigator


/**
 * This function is executed on request end (success or error) of Workshop.ajax()
 * @callback ajaxCallback
 * @param {Object} err - Error result of ajax call, {success:true} if no error, {error:{message:, status:, state:}} if error
 * @param {string} data - Data received from server 
*/


/**
 * Performs a request to distant server via XMLHttpRequest
 * @param {Object} params - Parameters for performing an ajax call (method, url...)
 * @param {string} params.url - Full url for request (without GET data), e.g.: "http://domain.com/some/path"
 * @param {string} params.method - Method for request, only allows GET, POST, PUT and DELETE
 * @param {Object} params.requestHeaders - Request headers to set to request, as JavaScript object, e.g. {'Content-Type': 'application/json'}
 * @param {Object} params.data - Data to send with request. If method is GET or DELETE, data will be appended to url, if POST or PUT, will be sent normally.
 * @param {ajaxCallback} callback - Function to execute on end of request
 * @param {bool} params.async - If request should be asynchronous or not, default is true
 * @param {int} params.status - Http status to wait for before callback, default is 200
 * @param {bool} params.debug - If function should display debug info in console
 * @memberof Workshop
*/

Workshop.ajax = workshop_ajax;


Workshop.getDeviceOrientation = function _getDeviceOrientation (callback) {
	window.addEventListener('deviceorientation', callback);
}

Workshop.getDeviceMotion = function _getDeviceMotion (callback) {
	window.addEventListener('devicemotion', callback);
}

Workshop.getDeviceMovement = function _deviceMovement (callback) {
	var resp = {};
	window.addEventListener('deviceorientation', function(data){
		resp.alpha = data.alpha;
		resp.beta = data.beta;
		resp.gamma = data.gamma;

		callback(resp);
	});

	window.addEventListener('devicemotion', function(data){
		resp.acceleration = data.acceleration;
		resp.gravity = data.accelerationIncludingGravity;

		callback(resp);
	});
}

// Geolocation


/**
 * This function is executed on request end (success) of Workshop.getGeoLocation
 * @callback geoCallback
 * @param {Object} data - Data received after geoLoc request.
 * @returns {Object} geoloc - {coords: {latitude:, longitude:}, accuracy:, altitude: {value:, accuracy:}, speed:, timestamp}
*/

/**
 * Gets geolocation from browser
 * @param {geoCallback} callback - Function to call if geoloc success
 * @param {function} error - Function to call in case of error
 * @memberof Workshop
*/
Workshop.getGeoLocation = function _getGeoLocation(callback, error){
	if(!navigator){
		var err = {
			message:"Navigator does not exist",
			code: 101
		};
		error(err);
		return;
	}

	if(!navigator.geolocation){
		var err = {
			message:"Geolocation not available in this browser",
			code : 102
		};
		error(err);
		return;
	}

	function success(geoloc){
		var resp = {
			coords:{
				latitude: geoloc.coords.latitude,
				longitude: geoloc.coords.longitude
			},
			
			accuracy: geoloc.coords.accuracy,
			
			altitude: {
				value: geoloc.coords.altitude,
				accuracy: geoloc.coords.altitudeAccuracy
			},

			speed: geoloc.coords.speed,

			timestamp: geoloc.timestamp

		};

		callback(resp);
		return geoloc;
	}

	function error(err){
		error(err);
		return;
	}

	var geo = navigator.geolocation.getCurrentPosition(success, error);
};

// Notifications

Workshop.notifications = {
	subscribe : subscribeToGCM,
	unsubscribe: unsubscribeFromGCM,
	init: registerPushInit,

	config: {
		debug: true,
		setDebug: function(on_off){
			if(on_off){
				Workshop.notifications.config.debug = true;
				console.log("Set debug to true");
			}else{
				Workshop.notifications.config.debug = false;
				console.log("Set debug to false");
			}
		},

		isEnabled : false,
		_server_endpoint: null,
		_service_worker: null,
		setServiceWorker: function(sw_path){
			if(!sw_path || typeof sw_path == "undefined"){
				throw new Error("Service Worker Path must be defined");
			}

			Workshop.notifications.config._service_worker = sw_path;			
		},
		setServerEndpoint : function(endpoint){
			if(!endpoint || typeof endpoint == "undefined"){
				throw new Error("Endpoint must be defined");
			}

			Workshop.notifications.config._server_endpoint = endpoint;
		}
	},

};

/*************
	TIME
*************/
Object.defineProperty(Date.prototype, "toSeconds", {
	enumerable: false,
	value: function _toSeconds(){
		return this.getHours()*3600 + this.getMinutes()*3600 + this.getSeconds();
	}
});

Object.defineProperty(Date.prototype, "toFormatted", {
	enumerable: false,
	value: function _dateToFormatted(format, object){
		var o = {
			h:this.getHours(),
			m: this.getMinutes(),
			s: this.getSeconds(),
		};

		switch(format){
			case "hh":
				return ret({hours:o.h});
			case "hh:mm":
				return ret({hours:o.h, minutes:o.m});
			case "hh:mm:ss":
				return ret({hours:o.h, minutes:o.m, seconds:o.s});
			default:
				return ret({hours:o.h, minutes:o.m, seconds:o.s});
		}

		function ret(hourObj){
			if(object){
				return hourObj;
			}else{
				var str = "";
				for(var f in hourObj){
					str+=hourObj[f] + ":";
				}
				return str.substring(0, str.length-1);
			}
		}
	}
});

Object.defineProperty(Date.prototype, "minutes", {
	get: function(){
		return this.getMinutes();
	},

	set: function(minutes) {
		this.setMinutes(minutes);
	}
});

Object.defineProperty(Date.prototype, "hours", {
	get: function(){
		return this.getHours();
	},

	set: function(hours) {
		this.setHours(hours);
	}
});

Object.defineProperty(Date.prototype, "seconds", {
	get: function(){
		return this.getSeconds();
	},

	set: function(seconds) {
		this.setSeconds(seconds);
	}
});

Date.prototype.toDecimal = function _toDecimal(){
	var transform = 100000 / 86400;

	var s = this.getSeconds();
	var m = this.getMinutes();
	var h = this.getHours();

	var total_60 = h*3600 + m*60 + s;
	var total_10 = total_60 * transform;

	var hours = total_10 / Math.pow(100,2);
		var minutes = (hours - Math.floor(hours)) * 100;
	hours = Math.floor(hours);

	var seconds = Math.floor((minutes - Math.floor(minutes)) * 100);
	minutes = Math.floor(minutes);

	return {
		string: hours+":"+minutes+":"+seconds,
		date:{
			hours:hours,
			minutes:minutes,
			seconds: seconds
		},

	};
};


// Libraries

	// Notifications

function registerPushInit(callback, error) {
	if(Workshop.notifications.config.debug) console.log("Entered registerPushInit");
	if(!callback || typeof callback == "undefined"){
		throw new Error("Callback must be defined");
	}

	if(!'serviceWorker' in navigator){
		var err = {
			message: "ServiceWorkers not supported in this navigator",
			code: 1001
		};
		error(err);
		return;
	}else{
		if(!Workshop.notifications.config._service_worker || typeof Workshop.notifications.config._service_worker == 'undefined'){
			throw new Error("Workshop service worker is not defined, please use Workshop.notifications.config.setServiceWorker('./path/to/sw.js')");
		}

		if(Workshop.notifications.config.debug) console.log("Service worker path: ", Workshop.notifications.config._service_worker);
		navigator.serviceWorker.register(Workshop.notifications.config._service_worker).then(function(){
			init(error);
		});
	}

	function init(error){
		if(Workshop.notifications.config.debug) console.log("Entered init");

		error = (error) ? error : function(err){console.log(err)};

		if(!('showNotification' in ServiceWorkerRegistration.prototype)){
			var err = {
				message: 'showNotification not supported by ServiceWorkerRegistration',
				code:1002
			};
			error(err);
			return;
		}

		if(Notification.permission === 'denied'){
			var err = {
				message: 'Permission for notifications is denied',
				code:1003
			};

			error(err);
			return;
		}

		if(!('PushManager' in window)){
			var err = {
				message: "PushManager not supported",
				code:1003
			};
			error(err);
			return;
		}

		navigator.serviceWorker.ready.then(function(serviceWorkerRegistration){
			
			if(Workshop.notifications.config.debug) console.log("Entered serviceWorker.ready on init", serviceWorkerRegistration);

			serviceWorkerRegistration.pushManager.getSubscription()
				.then(function(subscription){

					if(!subscription){
						var err = {
							message: 'No Current Subscription',
							code: 1006
						};
						error(err);
						callback(false, {from: {name: "getSubscription", code: 1}});
						return;
					}

					if(Workshop.notifications.config.debug) console.log("Got Subscription on Init: ", subscription);

					sendToServer(subscription);

					callback(true,{from: {name: "getSubscription", code: 1}});
				})
				.catch(function(err){
					error(err);
					return;
				});
		});
	}

}

function subscribeToGCM(callback, error){
	if(Workshop.notifications.config.debug) console.log("Entered subscribe");

	if(!callback || typeof callback == "undefined"){
		throw new Error("Callback must be defined");
	}

	error = (error) ? error : function(err){console.log(err)};

	navigator.serviceWorker.ready.then(function(serviceWorkerRegistration){
		serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly:true})
		.then(function(subscription){
			if(Workshop.notifications.config.debug) console.log("Entered subscribre on pushManager:", subscription);
			callback(true, {from: {name: "subscribe", code: 2}});
			return sendToServer(subscription);
		})
		.catch(function(e){

			if(Notification.permission === 'denied'){
				var err = {
					message: 'Permission to notify denied',
					code: 1003
				};
				error(err);
				callback(false, {from: {name: "subscribe", code: 3}});
				return;
			}else{
				var err = {
					message: 'Error with subscription (check manifest.json, and if it\'s loaded in your browser, or well written)',
					original: e,
					code: 1004
				};
				callback(false, {from: {name: "subscribe", code: 4}});
				error(err);
				return;
			}

		});
	});
}

function unsubscribeFromGCM (callback, error) {
	if(Workshop.notifications.config.debug) console.log("Entered unsubscribe");

	if(!callback || typeof callback == "undefined"){
		throw new Error("Callback must be defined");
	}
	error = (error) ? error : function(err){console.log(err)};

	navigator.serviceWorker.ready.then(function(serviceWorkerRegistration){
		serviceWorkerRegistration.pushManager.getSubscription().
		then(function(pushSubscription){
			if(!pushSubscription){
				// do something
				callback(false, {from: {name: "getSubscription", code: 5}});
				return;
			}

			var sub_id = pushSubscription.subscriptionId;
			// SEND TO SERVER TO REMOVE FROM DB

			pushSubscription.unsubscribe().then(function(successful){
				callback(true, {from: {name: "unsubscribe", code: 6}});
			}).catch(function(e){
				var err = {
					message: 'Error while unsibscribing: ' + e,
					code: 1005,
				};
				callback(false, {from: {name: "unsubscribe", code: 6}});
				error(err);
				return;
			});
		})
		.catch(function(e){
			var err = {
					message: 'Error while unsibscribing: ' + e,
					code: 1004,
				};
			callback(false, {from: {name: "getSubscription", code: 7}});
			error(err);

			return;
		});
	});
}

function sendToServer(what) {
	if(Workshop.notifications.config.debug) console.log("Sending to server (", Workshop.notifications.config._server_endpoint, ") :", what);
	var options = {
		url: Workshop.notifications.config._server_endpoint,
		method:"POST",
		data:{
			subscription : what.endpoint.toString()
		}
	};
	var callback = function(resp){
		console.log("Resp from server:", resp);
	};
	

	Workshop.ajax(options, callback);
}


// Events
var event_config = {};

Object.defineProperty(Object.prototype, "onWSEvent", {
	enumerable:false,
	value: function(events, callback){
		if(!(events instanceof Array)){
			// if not array we put the only element in an array
			if(events instanceof Object){
				throw new Error("onWS only accepts an event as string or an array of events as strings");
				return;
			}

			events = [events];
		}

		for(var i = 0 ; i < events.length; i++){
			var event = events[i];

			if(event == '*'){
				for(var e in event_config){
					var event_handler = event_config[e];
					event_handler.push({
						fun: callback,
						this: this
					});
				}
				// we continue to prevent adding '*' to the events database
				continue;
			}

			if(!(event in event_config)){
				Workshop.events.add(event);
			}

			event_config[event].push({
				fun:callback,
				this: this
			});
		}
	}
});

Workshop.events = {};

Workshop.events.add = function _addEvent(event, force){
	if(typeof force == "undefined") force = false;
	if((event in event_config) && !force){
		throw new Error("Event already exists, if you want to clear it please use Workshop.events.add('event',true)");
		return;
	}
	event_config[event] = [];
};

Workshop.events.emit = function _emitEvent(event, data){
	if(!(event in event_config)){
		// check if we are emitting all events
		if(event === '*'){
			for(var e in event_config){
				var event = event_config[e];
				for(var c in event_config[event]){
					var callee = event_config[event][c];
					try{
						callee.fun.call(callee.this, data);
					}catch(e){}
				}
			}
			return;
		}

		throw new Error(event + " does not exist, please use an existing event");
		return;
	}

	for(var c in event_config[event]){
		var callee = event_config[event][c];
		try{
			callee.fun.call(callee.this, data);
		}catch(e){}
	}
};

Workshop.events.clear = function(){
	event_config = {};
};

// Bindings
var bindings_config = {
	show: function(){
		this.style.display = '';
	},

	hide: function(){
		this.style.display = 'none';
	},

	disable: function(){
		this.setAttribute('disabled', 'disabled');
	},

	enable: function () {
		this.removeAttribute('disabled');
	},

	model: function(){
	},
};

Workshop.bindings = {};

Workshop.bindings.scan = function workshop_scan(){

};

Workshop.Maybe = function(val){
	this.__value = val;
};

Workshop.Maybe.of = function(val){
	return new Workshop.Maybe(val);
};

Workshop.Maybe.prototype.isNothing = function(){
	return (this.__value === null || this.__value === undefined);
};

Workshop.Maybe.prototype.map = function(func) {
	if(this.isNothing()){
		return Workshop.Maybe.of(null);
	}

	return Workshop.Maybe.of(func(this.__value));
};

Workshop.Maybe.prototype.join = function(){
	return this.__value;
};

Workshop.Maybe.prototype.return = Workshop.Maybe.prototype.join;

Workshop.getQueryParams = function workshop_getQueryParams() {
	var res = {};
	var params = window.location.search.split('&');
	params.forEach(function(param){
		if(param.indexOf('?') == 0){
			param = param.slice(1, param.length);
		}
		param = param.split('=');
		res[param[0]] = param[1];
	});

	return res;
};
})();