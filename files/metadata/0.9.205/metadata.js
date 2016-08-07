/*!
 &copy; http://www.oknosoft.ru 2014-2015
 @license content of this file is covered by Oknosoft Commercial license. Usage without proper license is prohibited. To obtain it contact info@oknosoft.ru
 @author Evgeniy Malyarov
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.$p = factory();
  }
}(this, function() {
/**
 * Глобальные переменные и общие методы фреймворка __metadata.js__ <i>Oknosoft data engine</i>
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 *
 * Экспортирует глобальную переменную __$p__ типа {{#crossLink "MetaEngine"}}{{/crossLink}}
 * @module  common
 */

/**
 * ### Глобальный объект
 * Фреймворк [metadata.js](https://github.com/oknosoft/metadata.js), экспортирует единственную переменную __$p__ типа {{#crossLink "MetaEngine"}}{{/crossLink}}
 *
 * @class MetaEngine
 * @static
 */
function MetaEngine() {
	this.version = "0.9.205";
	this.toString = function(){
		return "Oknosoft data engine. v:" + this.version;
	};
	this.injected_data = {};
}

/**
 * Для совместимости со старыми модулями, публикуем $p глобально
 * Кроме этой переменной, metadata.js ничего не экспортирует
 */
var $p = new MetaEngine();

if(typeof window !== "undefined"){

	/**
	 * Загружает скрипты и стили синхронно и асинхронно
	 * @method load_script
	 * @for MetaEngine
	 * @param src {String} - url ресурса
	 * @param type {String} - "link" или "script"
	 * @param [callback] {Function} - функция обратного вызова после загрузки скрипта
	 * @async
	 */
	$p.load_script = function (src, type, callback) {
		var s = document.createElement(type);
		if (type == "script") {
			s.type = "text/javascript";
			s.src = src;
			if(callback){
				s.async = true;
				s.addEventListener('load', callback, false);
			}else
				s.async = false;
		} else {
			s.type = "text/css";
			s.rel = "stylesheet";
			s.href = src;
		}
		document.head.appendChild(s);
	};

}


/**
 * Фреймворк [metadata.js](https://github.com/oknosoft/metadata.js), добавляет в прототип _Object_<br />
 * несколько методов - синтаксический сахар для _наследования_ и работы со _свойствами_
 * @class Object
 * @constructor
 */

/**
 * Синтаксический сахар для defineProperty
 * @method __define
 * @for Object
 */
Object.defineProperty(Object.prototype, "__define", {
	value: function( key, descriptor ) {
		if( descriptor ) {
			Object.defineProperty( this, key, descriptor );
		} else {
			Object.defineProperties( this, key );
		}
		return this;
	},
	enumerable: false
});

Object.prototype.__define({

	/**
	 * Реализует наследование текущим конструктором свойств и методов конструктора Parent
	 * @method _extend
	 * @for Object
	 * @param Parent {Function}
	 */
	"_extend": {
		value: function( Parent ) {
			var F = function() { };
			F.prototype = Parent.prototype;
			this.prototype = new F();
			this.prototype.constructor = this;
			this.__define("superclass", {
				value: Parent.prototype,
				enumerable: false
			});
		},
		enumerable: false
	},

	/**
	 * Копирует все свойства из src в текущий объект исключая те, что в цепочке прототипов src до Object
	 * @method _mixin
	 * @for Object
	 * @param src {Object} - источник
	 * @return {Object}
	 */
	"_mixin": {
		value: function(src, include, exclude ) {
			var tobj = {}, i, f; // tobj - вспомогательный объект для фильтрации свойств, которые есть у объекта Object и его прототипа
			if(include && include.length){
				for(i = 0; i<include.length; i++){
					f = include[i];
					if(exclude && exclude.indexOf(f)!=-1)
						continue;
					// копируем в dst свойства src, кроме тех, которые унаследованы от Object
					if((typeof tobj[f] == "undefined") || (tobj[f] != src[f]))
						this[f] = src[f];
				}
			}else{
				for(f in src){
					if(exclude && exclude.indexOf(f)!=-1)
						continue;
					// копируем в dst свойства src, кроме тех, которые унаследованы от Object
					if((typeof tobj[f] == "undefined") || (tobj[f] != src[f]))
						this[f] = src[f];
				}
			}
			return this;
		},
		enumerable: false
	},

	/**
	 * Создаёт копию объекта
	 * @method _clone
	 * @for Object
	 * @param src {Object|Array} - исходный объект
	 * @param [exclude_propertyes] {Object} - объект, в ключах которого имена свойств, которые не надо копировать
	 * @returns {Object|Array} - копия объекта
	 */
	"_clone": {
		value: function() {
			if(!this || "object" !== typeof this)
				return this;
			var p, v, c = "function" === typeof this.pop ? [] : {};
			for(p in this){
				if (this.hasOwnProperty(p)){
					v = this[p];
					if(v){
						if("function" === typeof v || v instanceof DataObj || v instanceof DataManager)
							c[p] = v;

						else if("object" === typeof v)
							c[p] = v._clone();

						else
							c[p] = v;
					} else
						c[p] = v;
				}
			}
			return c;
		},
		enumerable: false
	}
});


/**
 * Полифил для обсервера и нотифаера пока не подключаем
 * Это простая заглушка, чтобы в старых браузерах не возникали исключения
 */
if(!Object.observe && !Object.unobserve && !Object.getNotifier)

	Object.prototype.__define({

		observe: {
			value: function(target, observer) {
				if(!target._observers)
					target.__define({
						_observers: {
							value: [],
							enumerable: false
						},
						_notis: {
							value: [],
							enumerable: false
						}
					});
				target._observers.push(observer);
			},
			enumerable: false
		},

		unobserve: {
			value: function(target, observer) {
				if(!target._observers)
					return;
				for(var i in target._observers){
					if(target._observers[i]===observer){
						target._observers.splice(i, 1);
						break;
					}
				}
			},
			enumerable: false
		},

		getNotifier: {
			value: function(target) {
				var timer_setted;
				return {
					notify: function (noti) {
						if(!target._observers)
							return;
						target._notis.push(noti);
						if(!timer_setted){
							timer_setted = true;
							setTimeout(function () {
								//TODO: свернуть массив оповещений перед отправкой
								target._observers.forEach(function (observer) {
									observer(target._notis);
								});
								target._notis.length = 0;
								timer_setted = false;
							}, 10);
						}
					}
				}
			},
			enumerable: false
		}
	});

/**
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 * @method dateFormat
 * @for MetaEngine
 * @param date {Date} - источник
 * @param mask {dateFormat.masks} - маска формата
 * @param utc {Boolean} Converts the date from local time to UTC/GMT
 * @return {String}
 */
$p.dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = $p.dateFormat;

		if(!mask)
			mask = $p.dateFormat.masks.ru;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) date = new Date(0);

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var _ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

/**
 * Some common format strings
 */
$p.dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
	atom:           "yyyy-mm-dd'T'HH:MM:ss'Z'",
	ru:				"dd.mm.yyyy HH:MM",
	short_ru:       "dd.mm.yyyy",
	date:           "dd.mm.yy",
	date_time:		"dd.mm.yy HH:MM"
};

/**
 * Наша promise-реализация ajax
 *
 * @property ajax
 * @for MetaEngine
 * @type Ajax
 * @static
 */
$p.ajax = new (

	/**
	 * ### Наша promise-реализация ajax
	 * - Поддерживает basic http авторизацию
	 * - Позволяет установить перед отправкой запроса специфические заголовки
	 * - Поддерживает получение и отправку данных с типом `blob`
	 * - Позволяет отправлять запросы типа `get`, `post`, `put`, `patch`, `delete`
	 *
	 * @class Ajax
	 * @static
	 */
	function Ajax() {

		function _call(method, url, post_data, auth, before_send) {

			// Возвращаем новое Обещание.
			return new Promise(function(resolve, reject) {

				// внутри Node, используем request
				if(typeof window == "undefined" && auth && auth.request){

					auth.request({
						url: encodeURI(url),
						headers : {
							"Authorization": auth.auth
						}
					},
						function (error, response, body) {
							if(error)
								reject(error);

							else if(response.statusCode != 200)
								reject({
									message: response.statusMessage,
									description: body,
									status: response.statusCode
								});

							else
								resolve({response: body});
						}
					);

				}else {

					// делаем привычные для XHR вещи
					var req = new XMLHttpRequest();

					if(window.dhx4 && window.dhx4.isIE)
						url = encodeURI(url);

					if(auth){
						var username, password;
						if(typeof auth == "object" && auth.username && auth.hasOwnProperty("password")){
							username = auth.username;
							password = auth.password;
						}else{
							if($p.ajax.username && $p.ajax.authorized){
								username = $p.ajax.username;
								password = $p.ajax.password;
							}else{
								username = $p.wsql.get_user_param("user_name");
								password = $p.wsql.get_user_param("user_pwd");
								if(!username && $p.job_prm && $p.job_prm.guest_name){
									username = $p.job_prm.guest_name;
									password = $p.job_prm.guest_pwd;
								}
							}
						}
						req.open(method, url, true, username, password);
						req.withCredentials = true;
						req.setRequestHeader("Authorization", "Basic " +
							btoa(unescape(encodeURIComponent(username + ":" + password))));
					}else
						req.open(method, url, true);

					if(before_send)
						before_send.call(this, req);

					if (method != "GET") {
						if(!this.hide_headers && !auth.hide_headers){
							req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
							req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
						}
					} else {
						post_data = null;
					}

					req.onload = function() {
						// Этот кусок вызовется даже при 404’ой ошибке
						// поэтому проверяем статусы ответа
						if (req.status == 200 && (req.response instanceof Blob || req.response.substr(0,9)!=="<!DOCTYPE")) {
							// Завершаем Обещание с текстом ответа
							if(req.responseURL == undefined)
								req.responseURL = url;
							resolve(req);
						}
						else {
							// Обламываемся, и передаём статус ошибки
							// что бы облегчить отладку и поддержку
							if(req.response)
								reject({
									message: req.statusText,
									description: req.response,
									status: req.status
								});
							else
								reject(Error(req.statusText));
						}
					};

					// отлавливаем ошибки сети
					req.onerror = function() {
						reject(Error("Network Error"));
					};

					// Делаем запрос
					req.send(post_data);
				}

			});

		}

		/**
		 * имя пользователя для авторизации на сервере
		 * @property username
		 * @type String
		 */
		this.username = "";

		/**
		 * пароль пользователя для авторизации на сервере
		 * @property password
		 * @type String
		 */
		this.password = "";

		/**
		 * признак авторизованности на сервере
		 * @property authorized
		 * @type Boolean
		 */
		this.authorized = false;

		/**
		 * Выполняет асинхронный get запрос
		 * @method get
		 * @param url {String}
		 * @return {Promise.<T>}
		 * @async
		 */
		this.get = function(url) {
			return _call.call(this, "GET", url);
		};

		/**
		 * Выполняет асинхронный post запрос
		 * @method post
		 * @param url {String}
		 * @param postData {String} - данные для отправки на сервер
		 * @return {Promise.<T>}
		 * @async
		 */
		this.post = function(url, postData) {
			if (arguments.length == 1) {
				postData = "";
			} else if (arguments.length == 2 && (typeof(postData) == "function")) {
				onLoad = postData;
				postData = "";
			} else {
				postData = String(postData);
			}
			return _call.call(this, "POST", url, postData);
		};

		/**
		 * Выполняет асинхронный get запрос с авторизацией и возможностью установить заголовки http
		 * @method get_ex
		 * @param url {String}
		 * @param auth {Boolean}
		 * @param beforeSend {Function} - callback перед отправкой запроса на сервер
		 * @return {Promise.<T>}
		 * @async
		 */
		this.get_ex = function(url, auth, beforeSend){
			return _call.call(this, "GET", url, null, auth, beforeSend);

		};

		/**
		 * Выполняет асинхронный post запрос с авторизацией и возможностью установить заголовки http
		 * @method post_ex
		 * @param url {String}
		 * @param postData {String} - данные для отправки на сервер
		 * @param auth {Boolean}
		 * @param beforeSend {Function} - callback перед отправкой запроса на сервер
		 * @return {Promise.<T>}
		 * @async
		 */
		this.post_ex = function(url, postData, auth, beforeSend){
			return _call.call(this, "POST", url, postData, auth, beforeSend);
		};

		/**
		 * Выполняет асинхронный put запрос с авторизацией и возможностью установить заголовки http
		 * @method put_ex
		 * @param url {String}
		 * @param postData {String} - данные для отправки на сервер
		 * @param auth {Boolean}
		 * @param beforeSend {Function} - callback перед отправкой запроса на сервер
		 * @return {Promise.<T>}
		 * @async
		 */
		this.put_ex = function(url, postData, auth, beforeSend){
			return _call.call(this, "PUT", url, postData, auth, beforeSend);
		};

		/**
		 * Выполняет асинхронный patch запрос с авторизацией и возможностью установить заголовки http
		 * @method patch_ex
		 * @param url {String}
		 * @param postData {String} - данные для отправки на сервер
		 * @param auth {Boolean}
		 * @param beforeSend {Function} - callback перед отправкой запроса на сервер
		 * @return {Promise.<T>}
		 * @async
		 */
		this.patch_ex = function(url, postData, auth, beforeSend){
			return _call.call(this, "PATCH", url, postData, auth, beforeSend);
		};

		/**
		 * Выполняет асинхронный delete запрос с авторизацией и возможностью установить заголовки http
		 * @method delete_ex
		 * @param url {String}
		 * @param auth {Boolean}
		 * @param beforeSend {Function} - callback перед отправкой запроса на сервер
		 * @return {Promise.<T>}
		 * @async
		 */
		this.delete_ex = function(url, auth, beforeSend){
			return _call.call(this, "DELETE", url, null, auth, beforeSend);

		};

		/**
		 * Получает с сервера двоичные данные (pdf отчета или картинку или произвольный файл) и показывает его в новом окне, используя data-url
		 * @method get_and_show_blob
		 * @param url {String} - адрес, по которому будет произведен запрос
		 * @param post_data {Object|String} - данные запроса
		 * @param [method] {String}
		 * @async
		 */
		this.get_and_show_blob = function(url, post_data, method){

			var params = "menubar=no,toolbar=no,location=no,status=no,directories=no,resizable=yes,scrollbars=yes",
				wnd_print;

			function show_blob(req){
				url = window.URL.createObjectURL(req.response);
				wnd_print = window.open(url, "wnd_print", params);
				wnd_print.onload = function(e) {
					window.URL.revokeObjectURL(url);
				};
				return wnd_print;
			}

			if(!method || (typeof method == "string" && method.toLowerCase().indexOf("post")!=-1))
				return this.post_ex(url,
					typeof post_data == "object" ? JSON.stringify(post_data) : post_data,
					true,
					function(xhr){
						xhr.responseType = "blob";
					})
					.then(show_blob);
			else
				return this.get_ex(url, true, function(xhr){
						xhr.responseType = "blob";
					})
					.then(show_blob);
		};

		/**
		 * Получает с сервера двоичные данные (pdf отчета или картинку или произвольный файл) и показывает диалог сохранения в файл
		 * @method get_and_save_blob
		 * @param url {String} - адрес, по которому будет произведен запрос
		 * @param post_data {Object|String} - данные запроса
		 * @param file_name {String} - имя файла для сохранения
		 * @return {Promise.<T>}
		 */
		this.get_and_save_blob = function(url, post_data, file_name){

			return this.post_ex(url,
				typeof post_data == "object" ? JSON.stringify(post_data) : post_data, true, function(xhr){
					xhr.responseType = "blob";
				})
				.then(function(req){
					saveAs(req.response, file_name);
				});
		};

		this.default_attr = function (attr, url) {
			if(!attr.url)
				attr.url = url;
			if(!attr.username)
				attr.username = this.username;
			if(!attr.password)
				attr.password = this.password;
			attr.hide_headers = true;

			if($p.job_prm["1c"]){
				attr.auth = $p.job_prm["1c"].auth;
				attr.request = $p.job_prm["1c"].request;
			}
		}

	}
);

/**
 * Несколько статических методов двумерной математики
 * @property m
 * @for MetaEngine
 * @static
 */
$p.m = {

	/**
	 * ПоложениеТочкиОтносительноПрямой
	 * @param x {Number}
	 * @param y {Number}
	 * @param x1 {Number}
	 * @param y1 {Number}
	 * @param x2 {Number}
	 * @param y2 {Number}
	 * @return {number}
	 */
	point_pos: function(x,y, x1,y1, x2,y2){
		if (Math.abs(x1-x2) < 0.2){return (x-x1)*(y1-y2);}	// вертикаль  >0 - справа, <0 - слева,=0 - на линии
		if (Math.abs(y1-y2) < 0.2){return (y-y1)*(x2-x1);}	// горизонталь >0 - снизу, <0 - сверху,=0 - на линии
		return (y-y1)*(x2-x1)-(y2-y1)*(x-x1);				// >0 - справа, <0 - слева,=0 - на линии
	},

	/**
	 * КоординатыЦентраДуги
	 * @param x1 {Number}
	 * @param y1 {Number}
	 * @param x2 {Number}
	 * @param y2 {Number}
	 * @param r0 {Number}
	 * @param ccw {Boolean}
	 * @return {Point}
	 */
	arc_cntr: function(x1,y1, x2,y2, r0, ccw){
		var a,b,p,r,q,yy1,xx1,yy2,xx2;
		if(ccw){
			var tmpx=x1, tmpy=y1;
			x1=x2; y1=y2; x2=tmpx; y2=tmpy;
		}
		if (x1!=x2){
			a=(x1*x1 - x2*x2 - y2*y2 + y1*y1)/(2*(x1-x2));
			b=((y2-y1)/(x1-x2));
			p=b*b+ 1;
			r=-2*((x1-a)*b+y1);
			q=(x1-a)*(x1-a) - r0*r0 + y1*y1;
			yy1=(-r + Math.sqrt(r*r - 4*p*q))/(2*p);
			xx1=a+b*yy1;
			yy2=(-r - Math.sqrt(r*r - 4*p*q))/(2*p);
			xx2=a+b*yy2;
		} else{
			a=(y1*y1 - y2*y2 - x2*x2 + x1*x1)/(2*(y1-y2));
			b=((x2-x1)/(y1-y2));
			p=b*b+ 1;
			r=-2*((y1-a)*b+x1);
			q=(y1-a)*(y1-a) - r0*r0 + x1*x1;
			xx1=(-r - Math.sqrt(r*r - 4*p*q))/(2*p);
			yy1=a+b*xx1;
			xx2=(-r + Math.sqrt(r*r - 4*p*q))/(2*p);
			yy2=a+b*xx2;
		}

		if ($p.m.point_pos(xx1,yy1, x1,y1, x2,y2)>0)
			return {x: xx1, y: yy1};
		else
			return {x: xx2, y: yy2}
	},

	/**
	 * Рассчитывает координаты точки, лежащей на окружности
	 * @param x1 {Number}
	 * @param y1 {Number}
	 * @param x2 {Number}
	 * @param y2 {Number}
	 * @param r {Number}
	 * @param arc_ccw {Boolean}
	 * @param more_180 {Boolean}
	 * @return {Point}
	 */
	arc_point: function(x1,y1, x2,y2, r, arc_ccw, more_180){
		var point = {x: (x1 + x2) / 2, y: (y1 + y2) / 2};
		if (r>0){
			var dx = x1-x2, dy = y1-y2, dr = r*r-(dx*dx+dy*dy)/4, l, h, centr;
			if(dr >= 0){
				centr = $p.m.arc_cntr(x1,y1, x2,y2, r, arc_ccw);
				dx = centr.x - point.x;
				dy = point.y - centr.y;	// т.к. Y перевернут
				l = Math.sqrt(dx*dx + dy*dy);

				if(more_180)
					h = r+Math.sqrt(dr);
				else
					h = r-Math.sqrt(dr);

				point.x += dx*h/l;
				point.y += dy*h/l;
			}
		}
		return point;
	}

};

/**
 * Пустые значения даты и уникального идентификатора
 * @property blank
 * @for MetaEngine
 * @static
 */
$p.blank = new function Blank() {
	this.date = new Date("0001-01-01");
	this.guid = "00000000-0000-0000-0000-000000000000";

	/**
	 * Возвращает пустое значение по типу метаданных
	 * @method by_type
	 * @param mtype {Object} - поле type объекта метаданных (field.type)
	 * @return {*}
	 */
	this.by_type = function(mtype){
		var v;
		if(mtype.is_ref)
			v = $p.blank.guid;
		else if(mtype.date_part)
			v = $p.blank.date;
		else if(mtype["digits"])
			v = 0;
		else if(mtype.types && mtype.types[0]=="boolean")
			v = false;
		else
			v = "";
		return v;
	};
};


/**
 * Проверяет, является ли значение guid-ом
 * @method is_guid
 * @for MetaEngine
 * @param v {*} - проверяемое значение
 * @return {Boolean} - true, если значение соответствует регурярному выражению guid
 */
$p.is_guid = function(v){
	if(typeof v !== "string" || v.length < 36)
		return false;
	else if(v.length > 36)
		v = v.substr(0, 36);
	return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v)
};

/**
 * Проверяет, является ли значение пустым идентификатором
 * @method is_empty_guid
 * @for MetaEngine
 * @param v {*} - проверяемое значение
 * @return {Boolean} - true, если v эквивалентен пустому guid
 */
$p.is_empty_guid = function (v) {
	return !v || v === $p.blank.guid;
};

/**
 * Генерирует новый guid
 * @method generate_guid
 * @for MetaEngine
 * @return {String}
 */
$p.generate_guid = function(){
	var d = new Date().getTime();
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x7|0x8)).toString(16);
	});
};

/**
 * Извлекает guid из строки или ссылки или объекта
 * @method fix_guid
 * @param ref {*} - значение, из которого надо извлечь идентификатор
 * @param generate {Boolean} - указывает, генерировать ли новый guid для пустого значения
 * @return {String}
 */
$p.fix_guid = function(ref, generate){

	if(ref && typeof ref == "string"){

	} else if(ref instanceof DataObj)
		return ref.ref;

	else if(ref && typeof ref == "object"){
		if(ref.presentation){
			if(ref.ref)
				return ref.ref;
			else if(ref.name)
				return ref.name;
		}
		else
			ref = (typeof ref.ref == "object" && ref.ref.hasOwnProperty("ref")) ?  ref.ref.ref : ref.ref;
	}

	if($p.is_guid(ref) || generate === false)
		return ref;

	else if(generate)
		return $p.generate_guid();

	else
		return $p.blank.guid;
};

/**
 * Приводит значение к типу Число
 * @method fix_number
 * @param str {*} - приводиме значение
 * @param [strict=false] {Boolean} - конвертировать NaN в 0
 * @return {Number}
 */
$p.fix_number = function(str, strict){
	var v = parseFloat(str);
	if(!isNaN(v))
		return v;
	else if(strict)
		return 0;
	else
		return str;
};

/**
 * Приводит значение к типу Булево
 * @method fix_boolean
 * @param str {String}
 * @return {boolean}
 */
$p.fix_boolean = function(str){
	if(typeof str === "string")
		return !(!str || str.toLowerCase() == "false");
	else
		return !!str;
};

/**
 * Приводит значение к типу Дата
 * @method fix_date
 * @param str {*} - приводиме значение
 * @param [strict=false] {boolean} - если истина и значение не приводится к дате, возвращать пустую дату
 * @return {Date|*}
 */
$p.fix_date = function(str, strict){
	var dfmt = /(^\d{1,4}[\.|\\/|-]\d{1,2}[\.|\\/|-]\d{1,4})(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/;
	if(str instanceof Date)
		return str;
	else if(str && typeof str == "string" && dfmt.test(str.substr(0,10))){
		var adp = str.split(" "), ad = adp[0].split("."), d, strr;
		if(ad.length == 1){
			ad = adp[0].split("/");
			if(ad.length == 1)
				ad = adp[0].split("-");
		}
		if(ad.length == 3 && ad[2].length == 4){
			strr = ad[2] + "-" + ad[1] + "-" + ad[0];
			for(var i = 1; i < adp.length; i++)
				strr += " " + adp[i];
			d=new Date(strr);
		}else
			d=new Date(str);

		if(d && d.getFullYear()>0)
			return d;
	}

	if(strict)
		return $p.blank.date;
	else
		return str;
};

/**
 * Добавляет days дней к дате
 * @method date_add_day
 * @param date {Date} - исходная дата
 * @param days {Number} - число дней, добавляемых к дате (может быть отрицательным)
 * @return {Date}
 */
$p.date_add_day = function(date, days){
	var newDt = new Date();
	newDt.setDate(date.getDate() + days);
	return newDt;
};

/**
 * Запрещает всплывание события
 * @param e {MouseEvent|KeyboardEvent}
 * @returns {Boolean}
 */
$p.cancel_bubble = function(e) {
	var evt = (e || event);
	if (evt && evt.stopPropagation)
		evt.stopPropagation();
	if (evt && !evt.cancelBubble)
		evt.cancelBubble = true;
	return false
};

/**
 * Сообщения пользователю и строки нитернационализации
 * @property msg
 * @type Messages
 * @static
 */
$p.msg = new Messages();

/**
 * ### Сообщения пользователю и строки нитернационализации
 *
 * @class Messages
 * @static
 */
function Messages(){

	this.toString = function(){return "Интернационализация сообщений"};

	/**
	 * расширяем мессанджер
	 */
	if(typeof window !== "undefined" && "dhtmlx" in window){

		/**
		 * Показывает информационное сообщение или confirm
		 * @method show_msg
		 * @for Messages
		 * @param attr {object} - атрибуты сообщения attr.type - [info, alert, confirm, modalbox, info-error, alert-warning, confirm-error]
		 * @param [delm] - элемент html в тексте которого сообщение будет продублировано
		 * @example
		 *  $p.msg.show_msg({
		 *      title:"Important!",
		 *      type:"alert-error",
		 *      text:"Error"});
		 */
		this.show_msg = function(attr, delm){
			if(!attr)
				return;
			if(typeof attr == "string"){
				if($p.iface.synctxt){
					$p.iface.synctxt.show_message(attr);
					return;
				}
				attr = {type:"info", text:attr };
			}
			if(delm && typeof delm.setText == "function")
				delm.setText(attr.text);
			dhtmlx.message(attr);
		};

		/**
		 * Проверяет корректность ответа сервера
		 * @method check_soap_result
		 * @for Messages
		 * @param res {XMLHttpRequest|Object} - полученный с сервера xhr response
		 * @return {boolean} - true, если нет ошибки
		 */
		this.check_soap_result = function(res){
			if(!res){
				$p.msg.show_msg({
					type: "alert-error",
					text: $p.msg.empty_response,
					title: $p.msg.error_critical});
				return true;

			}else if(res.error=="limit_query"){
				$p.iface.docs.progressOff();
				$p.msg.show_msg({
					type: "alert-warning",
					text: $p.msg.limit_query.replace("%1", res["queries"]).replace("%2", res["queries_avalable"]),
					title: $p.msg.srv_overload});
				return true;

			}else if(res.error=="network" || res.error=="empty"){
				$p.iface.docs.progressOff();
				$p.msg.show_msg({
					type: "alert-warning",
					text: $p.msg.error_network,
					title: $p.msg.error_critical});
				return true;

			}else if(res.error && res.error_description){
				$p.iface.docs.progressOff();
				if(res.error_description.indexOf("Недостаточно прав") != -1){
					res["error_type"] = "alert-warning";
					res["error_title"] = $p.msg.error_rights;
				}
				$p.msg.show_msg({
					type: res["error_type"] || "alert-error",
					text: res.error_description,
					title: res["error_title"] || $p.msg.error_critical
				});
				return true;

			}else if(res.error && !res.messages){
				$p.iface.docs.progressOff();
				$p.msg.show_msg({
					type: "alert-error",
					title: $p.msg.error_critical,
					text: $p.msg.unknown_error.replace("%1", "unknown_error")
				});
				return true;
			}

		};

		/**
		 * Показывает модальное сообщение о нереализованной функциональности
		 * @method show_not_implemented
		 * @for Messages
		 */
		this.show_not_implemented = function(){
			$p.msg.show_msg({type: "alert-warning",
				text: $p.msg.not_implemented,
				title: $p.msg.main_title});
		};

	}
}

/**
 * Объекты интерфейса пользователя
 * @class InterfaceObjs
 * @static
 */
function InterfaceObjs(){

	this.toString = function(){return "Объекты интерфейса пользователя"};

	/**
	 * Очищает область (например, удаляет из div все дочерние элементы)
	 * @method clear_svgs
	 * @param area {HTMLElement|String}
	 */
	this.clear_svgs = function(area){
		if(typeof area === "string")
			area = document.getElementById(area);
		while (area.firstChild)
			area.removeChild(area.firstChild);
	};

	/**
	 * Возвращает координату левого верхнего угла элемента относительно документа
	 * @method get_offset
	 * @param elm {HTMLElement} - элемент, координату которого, необходимо определить
	 * @return {Object} - {left: number, top: number}
	 */
	this.get_offset = function(elm) {
		var offset = {left: 0, top:0};
		if (elm.offsetParent) {
			do {
				offset.left += elm.offsetLeft;
				offset.top += elm.offsetTop;
			} while (elm = elm.offsetParent);
		}
		return offset;
	};

	/**
	 * Заменяет в строке критичные для xml символы
	 * @method normalize_xml
	 * @param str {string} - исходная строка, в которой надо замаскировать символы
	 * @return {XML|string}
	 */
	this.normalize_xml = function(str){
		if(!str) return "";
		var entities = { '&':  '&amp;', '"': '&quot;',  "'":  '&apos;', '<': '&lt;', '>': '&gt;'};
		return str.replace(	/[&"'<>]/g, function (s) {return entities[s];});
	};

	/**
	 * Масштабирует svg
	 * @method scale_svg
	 * @param svg_current {String} - исходная строка svg
	 * @param size {Number} - требуемый размер картинки
	 * @param padding {Number} - отступ от границы viewBox
	 * @return {String} - отмасштабированная строка svg
	 */
	this.scale_svg = function(svg_current, size, padding){
		var j, k, svg_head, svg_body, head_ind, vb_ind, svg_head_str, vb_str, viewBox, svg_j = {};

		head_ind = svg_current.indexOf(">");
		svg_head_str = svg_current.substring(5, head_ind);
		svg_head = svg_head_str.split(' ');
		svg_body = svg_current.substr(head_ind+1);
		svg_body = svg_body.substr(0, svg_body.length - 6);

		// получаем w, h и формируем viewBox="0 0 400 100"
		for(j in svg_head){
			svg_current = svg_head[j].split("=");
			if(svg_current[0] == "width" || svg_current[0] == "height"){
				svg_current[1] = Number(svg_current[1].replace(/"/g, ""));
				svg_j[svg_current[0]] = svg_current[1];
			}
		}

		if((vb_ind = svg_head_str.indexOf("viewBox="))!=-1){
			vb_str = svg_head_str.substring(vb_ind+9);
			viewBox = 'viewBox="' + vb_str.substring(0, vb_str.indexOf('"')) + '"';
		}else{
			viewBox = 'viewBox="0 0 ' + (svg_j["width"] - padding) + ' ' + (svg_j["height"] - padding) + '"';
		}
		k = size / (svg_j["height"] - padding);
		svg_j["height"] = size;
		svg_j["width"] = Math.round(svg_j["width"] * k);

		return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="' +
			svg_j["width"] + '" height="' + svg_j["height"] + '" xml:space="preserve" ' + viewBox + '>' + svg_body + '</svg>';
	};

	/**
	 * Добавляет в форму функциональность вызова справки
	 * @method bind_help
	 * @param wnd {dhtmlXWindowsCell}
	 * @param [path] {String} - url справки
	 */
	this.bind_help = function (wnd, path) {

		function frm_help(win){
			if(!win.help_path){
				$p.msg.show_msg({
					title: "Справка",
					type: "alert-info",
					text: $p.msg.not_implemented
				});
				return;
			}
		}

		if(wnd instanceof dhtmlXCellObject) {
			// TODO реализовать кнопку справки для приклеенной формы
		}else{
			if(!wnd.help_path && path)
				wnd.help_path = path;

			wnd.button('help').show();
			wnd.button('help').enable();
			wnd.attachEvent("onHelp", frm_help);
		}

	};

	/**
	 * Устанавливает hash url для сохранения истории и последующей навигации
	 * @method set_hash
	 * @param [obj] {String|Object} - имя класса или объект со свойствами к установке в хеш адреса
	 * @param [ref] {String} - ссылка объекта
	 * @param [frm] {String} - имя формы объекта
	 * @param [view] {String} - имя представления главной формы
	 */
	this.set_hash = function (obj, ref, frm, view ) {

		var ext = {},
			hprm = $p.job_prm.parse_url();

		if(arguments.length == 1 && typeof obj == "object"){
			ext = obj;
			if(ext.hasOwnProperty("obj")){
				obj = ext.obj;
				delete ext.obj;
			}
			if(ext.hasOwnProperty("ref")){
				ref = ext.ref;
				delete ext.ref;
			}
			if(ext.hasOwnProperty("frm")){
				frm = ext.frm;
				delete ext.frm;
			}
			if(ext.hasOwnProperty("view")){
				view = ext.view;
				delete ext.view;
			}
		}

		if(obj === undefined)
			obj = hprm.obj || "";
		if(ref === undefined)
			ref = hprm.ref || "";
		if(frm === undefined)
			frm = hprm.frm || "";
		if(view === undefined)
			view = hprm.view || "";

		var hash = "obj=" + obj + "&ref=" + ref + "&frm=" + frm + "&view=" + view;
		for(var key in ext){
			hash += "&" + key + "=" + ext[key];
		}

		if(location.hash.substr(1) == hash)
			this.hash_route();
		else
			location.hash = hash;
	};

	/**
	 * Выполняет навигацию при изменении хеша url
	 * @method hash_route
	 * @param event {HashChangeEvent}
	 * @return {Boolean}
	 */
	this.hash_route = function (event) {

		var hprm = $p.job_prm.parse_url(),
			res = $p.eve.hash_route.execute(hprm),
			mgr;

		if((res !== false) && (!$p.iface.before_route || $p.iface.before_route(event) !== false)){

			if($p.ajax.authorized){

				if(hprm.ref && typeof _md != "undefined"){
					// если задана ссылка, открываем форму объекта
					mgr = _md.mgr_by_class_name(hprm.obj);
					if(mgr)
						mgr[hprm.frm || "form_obj"]($p.iface.docs, hprm.ref)

				}else if(hprm.view && $p.iface.swith_view){
					// если задано имя представления, переключаем главную форму
					$p.iface.swith_view(hprm.view);

				}

			}
		}

		if(event)
			return $p.cancel_bubble(event);
	};


	/**
	 * Возникает после готовности DOM. Должен быть обработан конструктором основной формы приложения
	 * @event oninit
	 */
	this.oninit = null;

	/**
	 * Обновляет формы интерфейса пользователя раз в полторы минуты
	 * @event ontimer
	 */
	this.ontimer = null;
	setTimeout(function () {
		if($p.iface.ontimer && typeof $p.iface.ontimer === "function"){
			setInterval($p.iface.ontimer, 90000);
		}
	}, 20000);

}

/**
 * Объекты интерфейса пользователя
 * @property iface
 * @for MetaEngine
 * @type InterfaceObjs
 * @static
 */
$p.iface = new InterfaceObjs();

/**
 * ### Модификатор отложенного запуска
 * Служебный объект, реализующий отложенную загрузку модулей,<br />
 * в которых доопределяется (переопределяется) поведение объектов и менеджеров конкретных типов<br />
 *
 * @class Modifiers
 * @constructor
 */
function Modifiers(){

	var methods = [];

	/**
	 * Добавляет метод в коллекцию методов для отложенного вызова
	 * @method push
	 * @param method {Function} - функция, которая будет вызвана после инициализации менеджеров объектов данных
	 */
	this.push = function (method) {
		methods.push(method);
	};

	/**
	 * Отменяет подписку на событие
	 * @param method {Function}
	 */
	this.detache = function (method) {
		var index = methods.indexOf(method);
		if(index != -1)
			methods.splice(index, 1);
	};

	/**
	 * Загружает и выполняет методы модификаторов
	 * @method execute
	 */
	this.execute = function (data) {
		var res, tres;
		methods.forEach(function (method) {
			if(typeof method === "function")
				tres = method(data);
			else
				tres = $p.injected_data[method](data);
			if(res !== false)
				res = tres;
		});
		return res;
	};
};
$p.Modifiers = Modifiers;


/**
 * Обработчики событий приложения
 * Подробнее см. модули {{#crossLinkModule "events"}}{{/crossLinkModule}} и {{#crossLinkModule "events_browser"}}{{/crossLinkModule}}
 * @property eve
 * @for MetaEngine
 * @static
 */
$p.eve = (typeof window !== "undefined" && window.dhx4) ? dhx4 : {};
$p.eve.__define({

	onload: {
		value: new Modifiers(),
		enumerable: false,
		configurable: false
	},

	hash_route: {
		value: new Modifiers(),
		enumerable: false,
		configurable: false
	}
});

/**
 * ### Модификаторы менеджеров объектов метаданных
 * Т.к. экземпляры менеджеров и конструкторы объектов доступны в системе только после загрузки метаданных,
 * а метаданные загружаются после авторизации на сервере, методы модификаторов нельзя выполнить при старте приложения
 * @property modifiers
 * @for MetaEngine
 * @type Modifiers
 * @static
 */
$p.__define("modifiers", {
	value: new Modifiers(),
	enumerable: false,
	configurable: false
});

/**
 * ### Параметры работы программы
 * - Хранит глобальные настройки варианта компиляции (_Заказ дилера_, _Безбумажка_, _Демо_ и т.д.)
 * - Настройки извлекаются из файла "settings" при запуске приложения и дополняются параметрами url,
 * которые могут быть переданы как через search (?), так и через hash (#)
 * - см. так же, {{#crossLink "WSQL/get_user_param:method"}}{{/crossLink}} и {{#crossLink "WSQL/set_user_param:method"}}{{/crossLink}} - параметры, изменяемые пользователем
 * @class JobPrm
 * @static
 */
function JobPrm(){

	/**
	 * Осуществляет синтаксический разбор параметров url
	 * @method parse_url
	 * @return {Object}
	 */
	this.parse_url = function (){

		function parse(url_prm){
			var prm = {}, tmp = [], pairs;

			if(url_prm.substr(0, 1) === "#" || url_prm.substr(0, 1) === "?")
				url_prm = url_prm.substr(1);

			if(url_prm.length > 2){

				pairs = decodeURI(url_prm).split('&');

				// берём параметры из url
				for (var i in pairs){   //разбиваем пару на ключ и значение, добавляем в их объект
					tmp = pairs[i].split('=');
					if(tmp[0] == "m"){
						try{
							prm[tmp[0]] = JSON.parse(tmp[1]);
						}catch(e){
							prm[tmp[0]] = {};
						}
					}else
						prm[tmp[0]] = tmp[1] || "";
				}
			}

			return prm;
		}

		return parse(location.search)._mixin(parse(location.hash));
	};

	this.check_dhtmlx = true;
	this.offline = false;
	this.local_storage_prefix = "";
	this.create_tables = true;

	if(typeof window != "undefined"){

		/**
		 * Содержит объект с расшифровкой параметров url, указанных при запуске программы
		 * @property url_prm
		 * @type {Object}
		 * @static
		 */
		this.url_prm = this.parse_url();

	}else
		this.url_prm = {};

	// подмешиваем параметры, заданные в файле настроек сборки
	if(typeof $p.settings === "function")
		$p.settings(this, $p.modifiers);

	// подмешиваем параметры url
	// Они обладают приоритетом над настройками по умолчанию и настройками из settings.js
	for(var prm_name in this){
		if(prm_name !== "url_prm" && typeof this[prm_name] !== "function" && this.url_prm.hasOwnProperty[prm_name])
			this[prm_name] = this.url_prm[prm_name];
	}

	/**
	 * Устаревший метод. умрёт после перевода методов _заказа дилера_ в irest
	 * TODO: удалить этот метод
	 * @method hs_url
	 * @deprecated
	 * @return {string}
	 */
	this.hs_url = function () {
		var url = this.hs_path || "/a/zd/%1/hs/upzp",
			zone = $p.wsql.get_user_param("zone", "number");
		if(zone)
			return url.replace("%1", zone);
		else
			return url.replace("%1/", "");
	};

	function base_url(){
		return $p.wsql.get_user_param("rest_path") || $p.job_prm.rest_path || "/a/zd/%1/odata/standard.odata/";
	}

	/**
	 * Адрес стандартного интерфейса 1С OData
	 * @method rest_url
	 * @return {string}
	 */
	this.rest_url = function () {
		var url = base_url(),
			zone = $p.wsql.get_user_param("zone", "number");
		if(zone)
			return url.replace("%1", zone);
		else
			return url.replace("%1/", "");
	};

	/**
	 * Адрес http интерфейса библиотеки интеграции
	 * @method irest_url
	 * @return {string}
	 */
	this.irest_url = function () {
		var url = base_url(),
			zone = $p.wsql.get_user_param("zone", "number");
		url = url.replace("odata/standard.odata", "hs/rest");
		if(zone)
			return url.replace("%1", zone);
		else
			return url.replace("%1/", "");
	};

}
$p.JobPrm = JobPrm;


/**
 * Интерфейс локальной базы данных
 * @class WSQL
 * @static
 */
function WSQL(){

	var wsql = this,
		ls,
		user_params = {};

	if(typeof localStorage === "undefined"){

		// локальное хранилище внутри node.js
		if(typeof WorkerGlobalScope === "undefined"){
			if(typeof localStorage === "undefined")
				ls = new require('node-localstorage').LocalStorage('./localstorage');
		}

	} else
		ls = localStorage;

	function fetch_type(prm, type){
		if(type == "object"){
			try{
				prm = JSON.parse(prm);
			}catch(e){
				prm = {};
			}
			return prm;
		}else if(type == "number")
			return $p.fix_number(prm, true);
		else if(type == "date")
			return $p.fix_date(prm, true);
		else if(type == "boolean")
			return $p.fix_boolean(prm);
		else
			return prm;
	}

	//TODO реализовать поддержку postgres в Node

	/**
	 * Выполняет sql запрос к локальной базе данных, возвращает Promise
	 * @param sql
	 * @param params
	 * @return {Promise}
	 * @async
	 */
	wsql.promise = function(sql, params) {
		return new Promise(function(resolve, reject){
			wsql.alasql(sql, params || [], function(data, err) {
				if(err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	};

	/**
	 * Устанавливает параметр в user_params и базе данных
	 * @method set_user_param
	 * @param prm_name {string} - имя параметра
	 * @param prm_value {string|number|object|boolean} - значение
	 * @return {Promise}
	 * @async
	 */
	wsql.set_user_param = function(prm_name, prm_value){

		return new Promise(function(resolve, reject){

			var str_prm = prm_value;
			if(typeof prm_value == "object")
				str_prm = JSON.stringify(prm_value);

			else if(prm_value === false)
				str_prm = "";

			// localStorage в этом месте можно заменить на другое хранилище
			if(ls)
				ls.setItem($p.job_prm.local_storage_prefix+prm_name, str_prm);
			user_params[prm_name] = prm_value;

			resolve();

		});
	};

	/**
	 * Возвращает значение сохраненного параметра
	 * @method get_user_param
	 * @param prm_name {String} - имя параметра
	 * @param [type] {String} - имя типа параметра. Если указано, выполняем приведение типов
	 * @return {*} - значение параметра
	 */
	wsql.get_user_param = function(prm_name, type){

		if(!user_params.hasOwnProperty(prm_name) && ls)
			user_params[prm_name] = fetch_type(ls.getItem($p.job_prm.local_storage_prefix+prm_name), type);

		return user_params[prm_name];
	};

	/**
	 * Сохраняет настройки формы или иные параметры объекта _options_
	 * @method save_options
	 * @param prefix {String} - имя области
	 * @param options {Object} - сохраняемые параметры
	 * @return {Promise}
	 * @async
	 */
	wsql.save_options = function(prefix, options){
		return wsql.set_user_param(prefix + "_" + options.name, options);
	};

	/**
	 * Восстанавливает сохраненные параметры в объект _options_
	 * @method restore_options
	 * @param prefix {String} - имя области
	 * @param options {Object} - объект, в который будут записаны параметры
	 */
	wsql.restore_options = function(prefix, options){
		var options_saved = wsql.get_user_param(prefix + "_" + options.name, "object");
		for(var i in options_saved){
			if(typeof options_saved[i] != "object")
				options[i] = options_saved[i];
			else{
				if(!options[i])
					options[i] = {};
				for(var j in options_saved[i])
					options[i][j] = options_saved[i][j];
			}
		}
		return options;
	};

	/**
	 * ### Создаёт и заполняет умолчаниями таблицу параметров
	 * Внутри Node, в функцию следует передать ссылку на alasql
	 * @method init_params
	 * @return {Promise}
	 * @async
	 */
	wsql.init_params = function(ialasql, create_tables_sql){

		wsql.alasql = ialasql || alasql;
		wsql.aladb = new wsql.alasql.Database('md');

		var nesessery_params = [
			{p: "user_name",		v: "", t:"string"},
			{p: "user_pwd",			v: "", t:"string"},
			{p: "browser_uid",		v: $p.generate_guid(), t:"string"},
			{p: "zone",             v: $p.job_prm.hasOwnProperty("zone") ? $p.job_prm.zone : 1, t:"number"},
			{p: "enable_save_pwd",	v: "",	t:"boolean"},
			{p: "reset_local_data",	v: "",	t:"boolean"},
			{p: "autologin",		v: "",	t:"boolean"},
			{p: "cache_cat_date",	v: 0,	t:"number"},
			{p: "margin",			v: 60,	t:"number"},
			{p: "discount",			v: 15,	t:"number"},
			{p: "offline",			v: $p.job_prm.offline || "", t:"boolean"},
			{p: "skin",		        v: "dhx_web", t:"string"},
			{p: "rest_path",		v: "", t:"string"}
		], zone;



		// подмешиваем к базовым параметрам настройки приложения
		if($p.job_prm.additional_params)
			nesessery_params = nesessery_params.concat($p.job_prm.additional_params);

		// если зона не указана, устанавливаем "1"
		if(!ls.getItem($p.job_prm.local_storage_prefix+"zone"))
			zone = $p.job_prm.hasOwnProperty("zone") ? $p.job_prm.zone : 1;
		// если зона указана в url, используем её
		if($p.job_prm.url_prm.hasOwnProperty("zone"))
			zone = $p.fix_number($p.job_prm.url_prm.zone, true);
		if(zone !== undefined)
			wsql.set_user_param("zone", zone);

		// дополняем хранилище недостающими параметрами
		nesessery_params.forEach(function(o){
			if(wsql.get_user_param(o.p, o.t) == undefined ||
				(!wsql.get_user_param(o.p, o.t) && (o.p.indexOf("url") != -1)))
					wsql.set_user_param(o.p, $p.job_prm.hasOwnProperty(o.p) ? $p.job_prm[o.p] : o.v);
		});

		// сбрасываем даты, т.к. база в озу
		wsql.set_user_param("cache_cat_date", 0);
		wsql.set_user_param("reset_local_data", "");

		return new Promise(function(resolve, reject){

			if(create_tables_sql)
				wsql.alasql(create_tables_sql, [], resolve);

			else if($p.job_prm.create_tables){

				if($p.job_prm.create_tables_sql)
					wsql.alasql($p.job_prm.create_tables_sql, [], function(){
						delete $p.job_prm.create_tables_sql;
						resolve();
					});

				else if($p.injected_data["create_tables.sql"])
					wsql.alasql($p.injected_data["create_tables.sql"], [], function(){
						delete $p.injected_data["create_tables.sql"];
						resolve();
					});

				else if(typeof $p.job_prm.create_tables === "string")
					$p.ajax.get($p.job_prm.create_tables)
						.then(function (req) {
							wsql.alasql(req.response, [], resolve);
						});
				else
					resolve();
			}else
				resolve();

		});

	};

	/**
	 * Удаляет таблицы WSQL. Например, для последующего пересоздания при изменении структуры данных
	 * @method drop_tables
	 * @param callback {Function}
	 * @async
	 */
	wsql.drop_tables = function(callback){
		var cstep = 0, tmames = [];

		function ccallback(){
			cstep--;
			if(cstep<=0)
				setTimeout(callback, 10);
			else
				iteration();
		}

		function iteration(){
			var tname = tmames[cstep-1]["tableid"];
			if(tname.substr(0, 1) == "_")
				ccallback();
			else
				wsql.alasql("drop table IF EXISTS " + tname, [], ccallback);
		}

		function tmames_finded(data){
			tmames = data;
			if(cstep = data.length)
				iteration();
			else
				ccallback();
		}

		wsql.alasql("SHOW TABLES", [], tmames_finded);
	};

	/**
	 * Формирует архив полной выгрузки базы для сохранения в файловой системе клиента
	 * @method backup_database
	 * @param [do_zip] {Boolean} - указывает на необходимость архивировать стоки таблиц в озу перед записью файла
	 * @async
	 */
	wsql.backup_database = function(do_zip){

		// получаем строку create_tables

		// получаем строки для каждой таблицы

		// складываем все части в файл
	};

	/**
	 * Восстанавливает базу из архивной копии
	 * @method restore_database
	 * @async
	 */
	wsql.restore_database = function(){

	};


	/**
	 * Подключается к indexedDB
	 * @method idx_connect
	 * @param db_name {String} - имя базы
	 * @param store_name {String} - имя хранилища в базе
	 * @return {Promise.<IDBDatabase>}
	 * @async
	 */
	wsql.idx_connect = function (db_name, store_name) {

		if(!db_name)
			db_name = wsql.idx_name || $p.job_prm.local_storage_prefix || 'md';

		return new Promise(function(resolve, reject){
			var request = indexedDB.open(db_name, 1);
			request.onerror = function(err){
				reject(err);
			};
			request.onsuccess = function(){
				// При успешном открытии вызвали коллбэк передав ему объект БД
				resolve(request.result);
			};
			request.onupgradeneeded = function(e){
				// Если БД еще не существует, то создаем хранилище объектов.
				e.currentTarget.result.createObjectStore(store_name, { keyPath: "ref" });
				return wsql.idx_connect(db_name, store_name);
			}
		});
	};

	/**
	 * Сохраняет объект в indexedDB
	 * @method idx_save
	 * @param obj {DataObj|Object}
	 * @param [db] {IDBDatabase}
	 * @param [store_name] {String} - имя хранилища в базе
	 * @return {Promise}
	 * @async
	 */
	wsql.idx_save = function (obj, db, store_name) {

		return new Promise(function(resolve, reject){

			function _save(db){
				var request = db.transaction([store_name], "readwrite")
					.objectStore(store_name)
					.put(obj instanceof DataObj ? obj._obj : obj);
				request.onerror = function(err){
					reject(err);
				};
				request.onsuccess = function(){
					resolve(request.result);
				}
			}

			if(!store_name && obj._manager)
				store_name = obj._manager.table_name;

			if(db)
				_save(db);
			else
				wsql.idx_connect(null, store_name)
					.then(_save);

		});
	};

	/**
	 * Получает объект из indexedDB по ключу
	 * @method idx_get
	 * @param ref {String} - ключ
	 * @param [db] {IDBDatabase}
	 * @param store_name {String} - имя хранилища в базе
	 * @return {Promise}
	 * @async
	 */
	wsql.idx_get = function (ref, db, store_name) {

		return new Promise(function(resolve, reject){

			function _get(db){
				var request = db.transaction([store_name], "readonly")
					.objectStore(store_name)
					.get(ref);
				request.onerror = function(err){
					reject(err);
				};
				request.onsuccess = function(){
					resolve(request.result);
				}
			}

			if(db)
				_get(db);
			else
				wsql.idx_connect(null, store_name)
					.then(_get);

		});
	};

	/**
	 * Удаляет объект из indexedDB
	 * @method idx_delete
	 * @param obj {DataObj|Object|String} - объект или идентификатор
	 * @param [db] {IDBDatabase}
	 * @param [store_name] {String} - имя хранилища в базе
	 * @return {Promise}
	 * @async
	 */
	wsql.idx_delete = function (obj, db, store_name) {

		return new Promise(function(resolve, reject){

			function _delete(db){
				var request = db.transaction([store_name], "readwrite")
					.objectStore(store_name)
					.delete(obj instanceof DataObj ? obj.ref : obj);
				request.onerror = function(err){
					reject(err);
				};
				request.onsuccess = function(){
					resolve(request.result);
				}
			}

			if(!store_name && obj._manager)
				store_name = obj._manager.table_name;

			if(db)
				_delete(db);
			else
				wsql.idx_connect(null, store_name)
					.then(_delete);

		});
	};

	/**
	 * Удаляет все объекты из таблицы indexedDB
	 * @method idx_clear
	 * @param obj {DataObj|Object|String} - объект или идентификатор
	 * @param [db] {IDBDatabase}
	 * @param [store_name] {String} - имя хранилища в базе
	 * @return {Promise}
	 * @async
	 */
	wsql.idx_clear = function (obj, db, store_name) {

		return new Promise(function(resolve, reject){

			function _clear(db){
				var request = db.transaction([store_name], "readwrite")
					.objectStore(store_name)
					.clear();
				request.onerror = function(err){
					reject(err);
				};
				request.onsuccess = function(){
					resolve(request.result);
				}
			}

			if(!store_name && obj._manager)
				store_name = obj._manager.table_name;

			if(db)
				_clear(db);
			else
				wsql.idx_connect(null, store_name)
					.then(_clear);

		});
	};

};

/**
 * Экземпляр интерфейса локальной базы данных
 * @property wsql
 * @for MetaEngine
 * @type WSQL
 * @static
 */
$p.wsql = new WSQL();

/**
 * Строковые константы интернационализации
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 *
 * @module common
 * @submodule i18n
 */

var msg = $p.msg;

/**
 * русификация dateFormat
 */
$p.dateFormat.i18n = {
	dayNames: [
		"Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб",
		"Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"
	],
	monthNames: [
		"Янв", "Фев", "Maр", "Aпр", "Maй", "Июн", "Июл", "Aвг", "Сен", "Окт", "Ноя", "Дек",
		"Январь", "Февраль", "Март", "Апрель", "Maй", "Июнь", "Июль", "Август", "Сентябрь", "Oктябрь", "Ноябрь", "Декабрь"
	]
};

if(typeof window !== "undefined" && window.dhx4){
	dhx4.dateFormat.ru = "%d.%m.%Y";
	dhx4.dateLang = "ru";
	dhx4.dateStrings = {
		ru: {
			monthFullName:	["Январь","Февраль","Март","Апрель","Maй","Июнь","Июль","Август","Сентябрь","Oктябрь","Ноябрь","Декабрь"],
			monthShortName:	["Янв","Фев","Maр","Aпр","Maй","Июн","Июл","Aвг","Сен","Окт","Ноя","Дек"],
			dayFullName:	["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"],
			dayShortName:	["Вс","Пн","Вт","Ср","Чт","Пт","Сб"]
		}
	};
}

/**
 * Добавляет коллекциям менеджеров и метаданным русские синонимы, как свойства объекта _window_
 * @method russian_names
 * @for Messages
 */
$p.msg.russian_names = function(){
	if($p.job_prm.russian_names){

		// глобальный контекст
		window.__define({
			"Метаданные": {
				get: function(){return _md},
				enumerable: false
			},
			"Справочники": {
				get: function(){return _cat},
				enumerable: false
			},
			"Документы": {
				get: function(){return _doc},
				enumerable: false
			},
			"РегистрыСведений": {
				get: function(){return _ireg},
				enumerable: false
			},
			"РегистрыНакопления": {
				get: function(){return _areg},
				enumerable: false
			},
			"РегистрыБухгалтерии": {
				get: function(){return _aссreg},
				enumerable: false
			},
			"Обработки": {
				get: function(){return _dp},
				enumerable: false
			},
			"Отчеты": {
				get: function(){return _rep},
				enumerable: false
			},
			"ОбластьКонтента": {
				get: function(){return $p.iface.docs},
				enumerable: false
			},
			"Сообщить": {
				get: function(){return $p.msg.show_msg},
				enumerable: false
			},
			"Истина": {
				value: true,
				enumerable: false
			},
			"Ложь": {
				value: false,
				enumerable: false
			}

		});

		// свойства и методы менеджеров
		DataManager.prototype.__define({
				"ФормаВыбора": {
					get: function(){return this.form_selection},
					enumerable: false
				},
				"ФормаОбъекта": {
					get: function(){return this.form_obj},
					enumerable: false
				},
				"Найти": {
					get: function(){return this.find},
					enumerable: false
				},
				"НайтиСтроки": {
					get: function(){return this.find_rows},
					enumerable: false
				},
				"НайтиПоНаименованию": {
					get: function(){return this.by_name},
					enumerable: false
				}
			}
		);

		// свойства и методы объектов данных
		DataObj.prototype.__define({
				"ФормаОбъекта": {
					get: function(){return this.form_obj},
					enumerable: false
				}
			}
		);

	}
};

/**
 *  строки ФИАС адресного классификатора
 */
$p.fias = function FIAS(){};
(function (fias){

	fias.toString = function(){return "Коды адресного классификатора"};

	fias.types = ["владение", "здание", "помещение"];

	// Код, Наименование, Тип, Порядок, КодФИАС
	fias["1010"] = {name: "дом",			type: 1, order: 1, fid: 2, syn: [" д.", " д ", " дом"]};
	fias["1020"] = {name: "владение",		type: 1, order: 2, fid: 1, syn: [" вл.", " вл ", " влад.", " влад ", " владен.", " владен ", " владение"]};
	fias["1030"] = {name: "домовладение",	type: 1, order: 3, fid: 3};

	fias["1050"] = {name: "корпус",		type: 2, order: 1, syn: [" к.", " к ", " корп.", " корп ", "корпус"]};
	fias["1060"] = {name: "строение",	type: 2, order: 2, fid: 1, syn: [" стр.", " стр ", " строен.", " строен ", "строение"]};
	fias["1080"] = {name: "литера",		type: 2, order: 3, fid: 3, syn: [" л.", " л ", " лит.", " лит ", "литера"]};
	fias["1070"] = {name: "сооружение",	type: 2, order: 4, fid: 2, syn: [" соор.", " соор ", " сооруж.", " сооруж ", "сооружение"]};
	fias["1040"] = {name: "участок",	type: 2, order: 5, syn: [" уч.", " уч ", "участок"]};

	fias["2010"] = {name: "квартира",	type: 3, order: 1, syn: ["кв.", "кв ", "кварт.", "кварт ", "квартира", "-"]};
	fias["2030"] = {name: "офис",		type: 3, order: 2, syn: ["оф.", "оф ", "офис", "-"]};
	fias["2040"] = {name: "бокс",		type: 3, order: 3};
	fias["2020"] = {name: "помещение",	type: 3, order: 4};
	fias["2050"] = {name: "комната",	type: 3, order: 5, syn: ["комн.", "комн ", "комната"]};

	//	//  сокращения 1C для поддержки обратной совместимости при парсинге
	//	fias["2010"] = {name: "кв.",	type: 3, order: 6};
	//	fias["2030"] = {name: "оф.",	type: 3, order: 7};

	// Уточняющие объекты
	fias["10100000"] = {name: "Почтовый индекс"};
	fias["10200000"] = {name: "Адресная точка"};
	fias["10300000"] = {name: "Садовое товарищество"};
	fias["10400000"] = {name: "Элемент улично-дорожной сети, планировочной структуры дополнительного адресного элемента"};
	fias["10500000"] = {name: "Промышленная зона"};
	fias["10600000"] = {name: "Гаражно-строительный кооператив"};
	fias["10700000"] = {name: "Территория"};

})($p.fias);


// публичные методы, экспортируемые, как свойства $p.msg
msg.store_url_od = "https://chrome.google.com/webstore/detail/hcncallbdlondnoadgjomnhifopfaage";

msg.align_node_right = "Уравнять вертикально вправо";
msg.align_node_bottom = "Уравнять горизонтально вниз";
msg.align_node_top = "Уравнять горизонтально вверх";
msg.align_node_left = "Уравнять вертикально влево";
msg.align_set_right = "Установить размер сдвигом вправо";
msg.align_set_bottom = "Установить размер сдвигом вниз";
msg.align_set_top = "Установить размер сдвигом вверх";
msg.align_set_left = "Установить размер сдвигом влево";
msg.align_invalid_direction = "Неприменимо для элемента с данной ориентацией";
msg.argument_is_not_ref = "Аргумент не является ссылкой";
msg.addr_title = "Ввод адреса";

msg.cache_update_title = "Обновление кеша браузера";
msg.cache_update = "Выполняется загрузка измененных файлов<br/>и их кеширование в хранилище браузера";

msg.delivery_area_empty = "Укажите район доставки";

msg.empty_login_password = "Не указаны имя пользователя или пароль";
msg.empty_response = "Пустой ответ сервера";
msg.empty_geocoding = "Пустой ответ геокодера. Вероятно, отслеживание адреса запрещено в настройках браузера";

msg.error_auth = "Авторизация пользователя не выполнена";
msg.error_critical = "Критическая ошибка";
msg.error_metadata = "Ошибка загрузки метаданных конфигурации";
msg.error_network = "Ошибка сети или сервера - запрос отклонен";
msg.error_rights = "Ограничение доступа";

msg.file_size = "Запрещена загрузка файлов<br/>размером более ";
msg.file_confirm_delete = "Подтвердите удаление файла ";
msg.file_new_date = "Файлы на сервере обновлены<br /> Рекомендуется закрыть браузер и войти<br />повторно для применения обновления";
msg.file_new_date_title = "Версия файлов";

msg.init_catalogues = "Загрузка справочников с сервера";
msg.init_catalogues_meta = ": Метаданные объектов";
msg.init_catalogues_tables = ": Реструктуризация таблиц";
msg.init_catalogues_nom = ": Базовые типы + номенклатура";
msg.init_catalogues_sys = ": Технологические справочники";
msg.init_login = "Укажите имя пользователя и пароль";

msg.requery = "Повторите попытку через 1-2 минуты";

msg.limit_query = "Превышено число обращений к серверу<br/>Запросов за минуту:%1<br/>Лимит запросов:%2<br/>" + msg.requery;
msg.long_operation = "Длительная операция";

msg.main_title = "Окнософт: заказ дилера ";
msg.meta_cat = "Справочники";
msg.meta_doc = "Документы";
msg.meta_cch = "Планы видов характеристик";
msg.meta_cacc = "Планы счетов";
msg.meta_ireg = "Регистры сведений";
msg.meta_areg = "Регистры накопления";
msg.meta_mgr = "Менеджер";
msg.meta_cat_mgr = "Менеджер справочников";
msg.meta_doc_mgr = "Менеджер документов";
msg.meta_enn_mgr = "Менеджер перечислений";
msg.meta_ireg_mgr = "Менеджер регистров сведений";
msg.meta_areg_mgr = "Менеджер регистров накопления";
msg.meta_accreg_mgr = "Менеджер регистров бухгалтерии";
msg.meta_dp_mgr = "Менеджер обработок";
msg.meta_reports_mgr = "Менеджер отчетов";
msg.meta_charts_of_accounts_mgr = "Менеджер планов счетов";
msg.meta_charts_of_characteristic_mgr = "Менеджер планов видов характеристик";
msg.meta_extender = "Модификаторы объектов и менеджеров";

msg.no_metadata = "Не найдены метаданные объекта '%1'";
msg.no_selected_row = "Не выбрана строка табличной части '%1'";
msg.no_dhtmlx = "Библиотека dhtmlx не загружена";
msg.not_implemented = "Не реализовано в текущей версии";

msg.offline_request = "Запрос к серверу в автономном режиме";
msg.onbeforeunload = "Окнософт: легкий клиент. Закрыть программу?";
msg.order_sent_title = "Подтвердите отправку заказа";
msg.order_sent_message = "Отправленный заказ нельзя изменить.<br/>После проверки менеджером<br/>он будет запущен в работу";

msg.request_title = "Окнософт: Запрос регистрации";
msg.request_message = "Заявка зарегистрирована. После обработки менеджером будет сформировано ответное письмо";

msg.select_from_list = "Выбор из списка";
msg.select_grp = "Укажите группу, а не элемент";
msg.select_elm = "Укажите элемент, а не группу";
msg.select_file_import = "Укажите файл для импорта";
msg.srv_overload = "Сервер перегружен";
msg.sub_row_change_disabled = "Текущая строка подчинена продукции.<br/>Строку нельзя изменить-удалить в документе<br/>только через построитель";
msg.sync_script = "Обновление скриптов приложения:";
msg.sync_data = "Синхронизация с сервером выполняется:<br />* при первом старте программы<br /> * при обновлении метаданных<br /> * при изменении цен или технологических справочников";
msg.sync_break = "Прервать синхронизацию";
msg.sync_no_data = "Файл не содержит подходящих элементов для загрузки";

msg.unsupported_browser_title = "Браузер не поддерживается";
msg.unsupported_browser = "Несовместимая версия браузера<br/>Рекомендуется Google Chrome";
msg.supported_browsers = "Рекомендуется Chrome, Safari или Opera";
msg.unsupported_mode_title = "Режим не поддерживается";
msg.unsupported_mode = "Программа не установлена<br/> в <a href='" + msg.store_url_od + "'>приложениях Google Chrome</a>";
msg.unknown_error = "Неизвестная ошибка в функции '%1'";

msg.value = "Значение";

msg.bld_constructor = "Конструктор объектов графического построителя";
msg.bld_title = "Графический построитель";
msg.bld_empty_param = "Не заполнен обязательный параметр <br />";
msg.bld_not_product = "В текущей строке нет изделия построителя";
msg.bld_not_draw = "Отсутствует эскиз или не указана система профилей";
msg.bld_wnd_title = "Построитель изделия № ";
msg.bld_from_blocks_title = "Выбор типового блока";
msg.bld_from_blocks = "Текущее изделие будет заменено конфигурацией типового блока. Продолжить?";
msg.bld_split_imp = "В параметрах продукции<br />'%1'<br />запрещены незамкнутые контуры<br />" +
	"Для включения деления импостом,<br />установите это свойство в 'Истина'";

/**
 * Расширение типов ячеек dhtmlXGrid
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author	Evgeniy Malyarov
 *
 * Экспортирует конструкторы:
 * * **eXcell_ref** - поля ввода значений ссылочных типов
 * * **eXcell_refc** - комбобокс ссылочных типов (перечисления и короткие справочники)
 *
 * @module  wdg_dhtmlx
 * @requires common
 */

// Прототип кустомных ячеек для грида
var eXcell_proto = new eXcell();

/**
 * Обработчик клавиш {tab}, {enter} и {F4} в поле ввода
 */
eXcell_proto.input_keydown = function(e, t){

	function obj_on_select(v){
		if(t.source.on_select)
			t.source.on_select.call(t.source, v);
	}

	if(e.keyCode === 8 || e.keyCode === 46){          // по {del} и {bs} очищаем значение
		t.setValue("");
		t.grid.editStop();
		if(t.source.on_select)
			t.source.on_select.call(t.source, "");

	}else if(e.keyCode === 9 || e.keyCode === 13)
		t.grid.editStop();                          // по {tab} и {enter} заканчиваем редактирование

	else if(e.keyCode === 115)
		t.cell.firstChild.childNodes[1].onclick(e); // по {F4} открываем редактор

	else if(e.keyCode === 113){                      // по {F2} открываем форму объекта
		if(t.source.tabular_section){
			t.mgr = _md.value_mgr(t.source.row, t.source.col, t.source.row._metadata.fields[t.source.col].type);
			if(t.mgr){
				var tv = t.source.row[t.source.col];
				t.mgr.form_obj(t.source.wnd, {
					o: tv,
					on_select: obj_on_select
				});
			}

		}else if(t.fpath.length==1){
			t.mgr = _md.value_mgr(t.source.o._obj, t.fpath[0], t.source.o._metadata.fields[t.fpath[0]].type);
			if(t.mgr){
				var tv = t.source.o[t.fpath[0]];
				t.mgr.form_obj(t.source.wnd, {
					o: tv,
					on_select: obj_on_select
				});
			}
		}
	}

	return $p.cancel_bubble(e);
};

/**
 * Конструктор поля ввода со списком OCombo
 * @param cell
 */
function eXcell_ocombo(cell){

	if (!cell)
		return;

	var t = this;

	t.cell = cell;
	t.grid = cell.parentNode.grid;

	/**
	 * устанавливает текст в ячейке. например, this.setCValue("<input type='button' value='"+val+"'>",val);
	 */
	t.setValue=function(val){
		t.setCValue(val instanceof DataObj ? val.presentation : (val || ""));
	};

	/**
	 * получает значение ячейки из табличной части или поля объекта или допполя допобъекта, а не из грида
	 */
	t.getValue=function(){
		return t.grid.get_cell_value();

	};

	/**
	 * Обрабатывает событие перехода к следующему полю (окончание редактирования)
	 */
	t.shiftNext = function () {
		t.grid.editStop();
	};

	/**
	 * Cоздаёт элементы управления редактора и назначает им обработчики
	 */
	t.edit=function(){

		if(t.combo)
			return;

		t.val = t.getValue();		//save current value
		t.cell.innerHTML = "";
		t.combo = new OCombo({
			parent: t.cell
		}._mixin(t.grid.get_cell_field()));
		t.combo.getInput().focus();
	};

	/**
	 * вызывается при отключении редактора
	 */
	t.detach=function(){
		if(t.combo && t.combo.getComboText){
			t.setValue(t.combo.getComboText());         // текст в элементе управления
			if(!t.combo.getSelectedValue())
				t.combo.callEvent("onChange");
			var res = !$p.is_equal(t.val, t.getValue());// compares the new and the old values
			t.combo.unload();
			return res;
		} else
			return true;
	}
}
eXcell_ocombo.prototype = eXcell_proto;
window.eXcell_ocombo = eXcell_ocombo;

/**
 * Конструктор поля ввода значений ссылочных типов для грида
 * @param cell
 */
window.eXcell_ref = eXcell_ocombo;

/**
 * Конструктор комбобокса кешируемых ссылочных типов для грида
 */
window.eXcell_refc = eXcell_ocombo;

/**
 * Конструктор поля пароля
 */
function eXcell_pwd(cell){ //the eXcell name is defined here

	var fnedit;
	if (cell){                //the default pattern, just copy it
		this.cell = cell;
		this.grid = cell.parentNode.grid;
		eXcell_ed.call(this); //uses methods of the "ed" type
		fnedit = this.edit;
		this.edit = function(){
			fnedit.call(this);
			this.obj.type="password";
		};
		this.setValue=function(){
			this.setCValue("*********");
		};
		this.getValue=function(){
			return this.grid.get_cell_value();

		};
		this.detach=function(){
			if(this.grid.get_cell_field){
				var cf = this.grid.get_cell_field();
				cf.obj[cf.field] = this.obj.value;
			}
			this.setValue();
			fnedit = null;
			return this.val != this.getValue();
		}
	}
}
eXcell_pwd.prototype = eXcell_proto;
window.eXcell_pwd = eXcell_pwd;


dhtmlXCalendarObject.prototype._dateToStr = function(val, format) {
	if(val instanceof Date && val.getFullYear() < 1000)
		return "";
	else
		return window.dhx4.date2str(val, format||this._dateFormat, this._dateStrings());
};

eXcell_dhxCalendar.prototype.edit = function() {

	var arPos = this.grid.getPosition(this.cell);
	this.grid._grid_calendarA._show(false, false);
	this.grid._grid_calendarA.setPosition(arPos[0],arPos[1]+this.cell.offsetHeight);
	this.grid._grid_calendarA._last_operation_calendar = false;


	this.grid.callEvent("onCalendarShow", [this.grid._grid_calendarA, this.cell.parentNode.idd, this.cell._cellIndex]);
	this.cell._cediton = true;
	this.val = this.cell.val;
	if(this.val instanceof Date && this.val.getFullYear() < 1000)
		this.val = new Date();
	this._val = this.cell.innerHTML;
	var t = this.grid._grid_calendarA.draw;
	this.grid._grid_calendarA.draw = function(){};
	this.grid._grid_calendarA.setDateFormat((this.grid._dtmask||"%d.%m.%Y"));
	this.grid._grid_calendarA.setDate(this.val||(new Date()));
	this.grid._grid_calendarA.draw = t;

};

/**
 * fix ajax
 */
(function(){

	function fix_auth(t, method, url, async){
		if(url.indexOf("odata/standard.odata") != -1 || url.indexOf("/hs/rest") != -1){
			var username, password;
			if($p.ajax.authorized){
				username = $p.ajax.username;
				password = $p.ajax.password;
			}else{
				if($p.job_prm.guest_name){
					username = $p.job_prm.guest_name;
					password = $p.job_prm.guest_pwd;
				}else{
					username = $p.wsql.get_user_param("user_name");
					password = $p.wsql.get_user_param("user_pwd");
				}
			}
			t.open(method, url, async, username, password);
			t.withCredentials = true;
			t.setRequestHeader("Authorization", "Basic " +
				btoa(unescape(encodeURIComponent(username + ":" + password))));
		}else
			t.open(method, url, async);
	}

	dhx4.ajax._call = function(method, url, postData, async, onLoad, longParams, headers) {

		var t = (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
		var isQt = (navigator.userAgent.match(/AppleWebKit/) != null && navigator.userAgent.match(/Qt/) != null && navigator.userAgent.match(/Safari/) != null);

		if (async == true) {
			t.onreadystatechange = function() {
				if ((t.readyState == 4) || (isQt == true && t.readyState == 3)) { // what for long response and status 404?
					if (t.status != 200 || t.responseText == "")
						if (!dhx4.callEvent("onAjaxError", [{xmlDoc:t, filePath:url, async:async}])) return;

					window.setTimeout(function(){
						if (typeof(onLoad) == "function") {
							onLoad.apply(window, [{xmlDoc:t, filePath:url, async:async}]); // dhtmlx-compat, response.xmlDoc.responseXML/responseText
						}
						if (longParams != null) {
							if (typeof(longParams.postData) != "undefined") {
								dhx4.ajax.postLong(longParams.url, longParams.postData, onLoad);
							} else {
								dhx4.ajax.getLong(longParams.url, onLoad);
							}
						}
						onLoad = null;
						t = null;
					},1);
				}
			}
		}

		if (method == "GET") {
			url += this._dhxr(url);
		}

		t.open(method, url, async);

		// если обращение по rest или irest, добавляем авторизацию
		fix_auth(t, method, url, async);

		if (headers != null) {
			for (var key in headers) t.setRequestHeader(key, headers[key]);
		} else if (method == "POST" || method == "PUT" || method == "DELETE") {
			t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		} else if (method == "GET") {
			postData = null;
		}

		t.setRequestHeader("X-Requested-With", "XMLHttpRequest");

		t.send(postData);

		if (async != true) {
			if ((t.readyState == 4) || (isQt == true && t.readyState == 3)) {
				if (t.status != 200 || t.responseText == "") dhx4.callEvent("onAjaxError", [{xmlDoc:t, filePath:url, async:async}]);
			}
		}

		return {xmlDoc:t, filePath:url, async:async}; // dhtmlx-compat, response.xmlDoc.responseXML/responseText

	};

	dhtmlx.ajax.prototype.send = function(url,params,call){
		var x=this.getXHR();
		if (typeof call == "function")
			call = [call];
		//add extra params to the url
		if (typeof params == "object"){
			var t=[];
			for (var a in params){
				var value = params[a];
				if (value === null || value === dhtmlx.undefined)
					value = "";
				t.push(a+"="+encodeURIComponent(value));// utf-8 escaping
			}
			params=t.join("&");
		}
		if (params && !this.post){
			url=url+(url.indexOf("?")!=-1 ? "&" : "?")+params;
			params=null;
		}

		//x.open(this.post?"POST":"GET",url,!this._sync);
		fix_auth(x, this.post?"POST":"GET",url,!this._sync);

		if (this.post)
			x.setRequestHeader('Content-type','application/x-www-form-urlencoded');

		//async mode, define loading callback
		//if (!this._sync){
		var self=this;
		x.onreadystatechange= function(){
			if (!x.readyState || x.readyState == 4){
				//dhtmlx.log_full_time("data_loading");	//log rendering time
				if (call && self)
					for (var i=0; i < call.length; i++)	//there can be multiple callbacks
						if (call[i])
							call[i].call((self.master||self),x.responseText,x.responseXML,x);
				self.master=null;
				call=self=null;	//anti-leak
			}
		};
		//}

		x.send(params||null);
		return x; //return XHR, which can be used in case of sync. mode
	}

})();



$p.iface.data_to_grid = function (data, attr){

	if(this.data_to_grid)
		return this.data_to_grid(data, attr);

	function cat_picture_class(r){
		var res;
		if(r.is_folder)
			res = "cell_ref_folder";
		else
			res = "cell_ref_elm";
		if(r.deleted)
			res = res + "_deleted";
		return res ;
	}

	function do_format(r, f){
		if(f == "svg")
			return $p.iface.normalize_xml(r[f]);
		if(r[f] instanceof Date){
			if(r[f].getHours() || r.date.getMinutes())
				return $p.dateFormat(r[f], $p.dateFormat.masks.date_time);
			else
				return $p.dateFormat(r[f], $p.dateFormat.masks.date)
		}else
			return r[f] || "";
	}

	var xml = "<?xml version='1.0' encoding='UTF-8'?><rows total_count='%1' pos='%2' set_parent='%3'>"
			.replace("%1", data.length).replace("%2", attr.start)
			.replace("%3", attr.set_parent || "" ),
		caption = this.caption_flds(attr);

	// при первом обращении к методу добавляем описание колонок
	xml += caption.head;

	data.forEach(function(r){
		xml +=  "<row id=\"" + r.ref + "\"><cell class=\"" + cat_picture_class(r) + "\">" + do_format(r, [caption.acols[0].id]) + "</cell>";
		for(var col=1; col < caption.acols.length; col++ )
			xml += "<cell>" + do_format(r, [caption.acols[col].id]) + "</cell>";

		xml += "</row>";
	});

	return xml + "</rows>";
};

$p.iface.data_to_tree = function (data) {

	var xml = "<?xml version='1.0' encoding='UTF-8'?><tree id=\"0\">";

	function add_hierarchically(row, adata){
		xml = xml + "<item text=\"" + row.presentation.replace(/"/g, "'") +
			"\" id=\"" + row.ref +
			"\" im0=\"" + dhtmlx.image_cache("tree", "folderClosed") + "\">";
		$p._find_rows(adata, {parent: row.ref}, function(r){
			add_hierarchically(r, adata)
		});
		xml = xml + "</item>";
	}

	add_hierarchically({presentation: "...", ref: $p.blank.guid}, []);
	$p._find_rows(data, {parent: $p.blank.guid}, function(r){
		add_hierarchically(r, data)
	});

	return xml + "</tree>";
};



/**
 * ### Визуальный компонент - гиперссылка с выпадающим списком для выбора значения
 *
 * Created 13.11.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 * @module  wdg_dropdown_list
 */

/**
 * ### Визуальный компонент - гиперссылка с выпадающим списком
 * - Предназначен для отображения и редактирования значения перечислимого типа (короткий список)
 *
 * @class ODropdownList
 * @param attr
 * @param attr.container {HTMLElement} - контейнер, в котором будет размещен элемент
 * @param attr.title {String} - заголовок элемента
 * @param attr.values {Array} - список строковых представлений перечисления или объект, в ключах которого ключи, а в значениях - представления значений
 * @param attr.event_name {String} - имя события, которое будет генерировать элемент при изменении значения
 * @param [attr.class_name] {String} - имя класса CSS, добавляемое к стилям элемета
 * @constructor
 */
function ODropdownList(attr){

	var ul = document.createElement('ul'), li, div, a;

	function set_order_text(silent){
		a.innerHTML = attr.values[a.getAttribute("current")];
		if(attr.event_name && !silent)
			dhx4.callEvent(attr.event_name, [a.getAttribute("current")]);
	}

	function body_click(){
		div.classList.remove("open");
	}

	attr.container.innerHTML = '<div class="dropdown_list">' + attr.title + '<a href="#" class="dropdown_list"></a></div>';
	div = attr.container.firstChild;
	a = div.querySelector("a");
	a.setAttribute("current", Array.isArray(attr.values) ? "0" : Object.keys(attr.values)[0]);
	div.onclick = function (e) {
		if(!div.classList.contains("open")){
			div.classList.add("open");
		}else{
			if(e.target.tagName == "LI"){
				for(var i in ul.childNodes){
					if(ul.childNodes[i] == e.target){
						a.setAttribute("current", e.target.getAttribute("current"));
						set_order_text();
						break;
					}
				}
			}
			body_click();
		}
		return $p.cancel_bubble(e);
	};
	div.appendChild(ul);
	ul.className = "dropdown_menu";
	if(attr.class_name){
		div.classList.add(attr.class_name);
		ul.classList.add(attr.class_name);
	}

	for(var i in attr.values){
		li = document.createElement('li');
		var pos = attr.values[i].indexOf('<i');
		li.innerHTML = attr.values[i].substr(pos) + " " + attr.values[i].substr(0, pos);
		li.setAttribute("current", i);
		ul.appendChild(li);
	};

	document.body.addEventListener("keydown", function (e) {
		if(e.keyCode == 27) { // закрытие по {ESC}
			div.classList.remove("open");
		}
	});
	document.body.addEventListener("click", body_click);

	this.unload = function () {
		var child;
		while (child = div.lastChild)
			div.removeChild(child);
		attr.container.removeChild(div);
		li = ul = div = a = attr = null;
	};

	set_order_text(true);

}
$p.iface.ODropdownList = ODropdownList;
/**
 * ### Визуальный компонент OCombo
 * Поле с выпадающим списком + функция выбора из списка
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author	Evgeniy Malyarov
 *
 * @module  wdg_ocombo
 * @requires common
 */

/**
 * ### Визуальный компонент - поле с выпадающим списком
 * - Предназначен для отображения и редактирования ссылочных, в том числе, составных типов данных
 * - Унаследован от [dhtmlXCombo](http://docs.dhtmlx.com/combo__index.html)
 * - Строки списка формируются автоматически по описанию метаданных
 * - Автоматическая привязка к данным (байндинг) - при изменении значения в поле объекта, синхронно изменяются данные в элементе управления
 * - Автоматическая фильтрация по части кода или наименования
 * - Лаконичный код инициализации компонента [см. пример в Codex](http://www.oknosoft.ru/metadata/codex/#obj=0116&view=js)
 *
 * @class OCombo
 * @param attr
 * @param attr.parent {HTMLElement} - контейнер, в котором будет размещен элемент
 * @param attr.obj {DataObj|TabularSectionRow} - ссылка на редактируемый объект
 * @param attr.field {String} - имя поля редактируемого объекта
 * @param [attr.meta] {Object} - описание метаданных поля. Если не указано, описание запрашивается у объекта
 * @param [attr.width] {Number} - если указано, фиксирует ширину элемента
 * @constructor
 */
function OCombo(attr){

	var _obj, _field, _meta, _mgr, _property, popup_focused,
		t = this,
		_pwnd = {on_select: attr.on_select || function (selv) {
			_obj[_field] = selv;
		}};

	// выполняем конструктор родительского объекта
	OCombo.superclass.constructor.call(t, attr);
	if(attr.on_select){
		t.getBase().style.border = "none";
		t.getInput().style.left = "-3px";
		if(!attr.is_tabular)
			t.getButton().style.right = "9px";
	} else
		t.getBase().style.marginBottom = "4px";
	if(attr.left)
		t.getBase().style.left = left + "px";

	this.attachEvent("onChange", function(){
		_obj[_field] = this.getSelectedValue();
	});

	this.attachEvent("onBlur", function(){
		if(!this.getSelectedValue() && this.getComboText())
			this.setComboText("");
	});

	this.attachEvent("onDynXLS", function (text) {

		if(!_mgr)
			_mgr = _md.value_mgr(_obj, _field, _meta.type);

		if(_mgr){
			t.clearAll();
			_mgr.get_option_list(null, get_filter(text))
				.then(function (l) {
					if(t.addOption){
						t.addOption(l);
						t.openSelect();
					}
				});
		}

	});

	function get_filter(text){
		var filter = {_top: 30}, choice;

		if(_mgr && _mgr.metadata().hierarchical && _mgr.metadata().group_hierarchy){
			if(_meta.choice_groups_elm == "elm")
				filter.is_folder = false;
			else if(_meta.choice_groups_elm == "grp" || _field == "parent")
				filter.is_folder = true;
		}

		for(var el in _meta.choice_links){
			choice = _meta.choice_links[el];
			if(choice.name && choice.name[0] == "selection"){
				if(_obj instanceof TabularSectionRow){
					if(choice.path.length < 2)
						filter[choice.name[1]] = typeof choice.path[0] == "function" ? choice.path[0] : _obj._owner._owner[choice.path[0]];
					else
						filter[choice.name[1]] = _obj[choice.path[1]];
				}else
					filter[choice.name[1]] = typeof choice.path[0] == "function" ? choice.path[0] : _obj[choice.path[0]];
			}
		}

		if(text)
			filter.presentation = {like: text};

		return filter;
	}

	function aclick(e){
		if(this.name == "select"){
			if(_mgr)
				_mgr.form_selection(_pwnd, {
					initial_value: _obj[_field].ref,
					selection: [get_filter()]
				});
			else
				aclick.call({name: "type"});

		} else if(this.name == "add"){
			if(_mgr)
				_mgr.create({}, true)
					.then(function (o) {
						o._set_loaded(o.ref);
						o.form_obj();
					});

		} else if(this.name == "open"){
			if(_obj && _obj[_field] && !_obj[_field].empty())
				_obj[_field].form_obj();

		} else if(this.name == "type"){
			var tlist = [], tmgr, tmeta, tobj = _obj, tfield = _field;
			_meta.type.types.forEach(function (o) {
				tmgr = _md.mgr_by_class_name(o);
				tmeta = tmgr.metadata();
				tlist.push({
					presentation: tmeta.synonym || tmeta.name,
					mgr: tmgr,
					selected: _mgr === tmgr
				});
			});
			$p.iface.select_from_list(tlist)
				.then(function(v){
					if(!tobj[tfield] || (tobj[tfield] && tobj[tfield]._manager != v.mgr)){
						_mgr = v.mgr;
						_obj = tobj;
						_field = tfield;
						_meta = _obj._metadata.fields[_field];
						_mgr.form_selection({
							on_select: function (selv) {
								_obj[_field] = selv;
								_obj = null;
								_field = null;
								_meta = null;

							}}, {
							selection: [get_filter()]
						});
					};
					_mgr = null;
					tmgr = null;
					tmeta = null;
					tobj = null;
					tfield = null;
				});
		}

		if(e)
			return $p.cancel_bubble(e);
	}

	function popup_hide(){
		popup_focused = false;
		setTimeout(function () {
			if(!popup_focused)
				$p.iface.popup.hide();
		}, 300);
	}

	function popup_show(){

		if(_mgr instanceof EnumManager)
			return;

		popup_focused = true;
		var div = document.createElement('div'),
			innerHTML = "<a href='#' name='select' title='Форма выбора {F4}'>Показать все</a>" +
				"<a href='#' name='open' style='margin-left: 9px;' title='Открыть форму элемента {Ctrl+Shift+F4}'><i class='fa fa-external-link fa-fw'></i></a>";

		// для полных прав разрешаем добавление элементов
		// TODO: учесть реальные права на добавление
		if($p.ajax.root)
			innerHTML += "&nbsp;<a href='#' name='add' title='Создать новый элемент {F8}'><i class='fa fa-plus fa-fwfa-fw'></i></a>";

		// для составных типов разрешаем выбор типа
		// TODO: реализовать поддержку примитивных типов
		if(_meta.type.types.length > 1)
			innerHTML += "&nbsp;<a href='#' name='type' title='Выбрать тип значения {Alt+T}'><i class='fa fa-level-up fa-fw'></i></a>";

		div.innerHTML = innerHTML;
		for(var i=0; i<div.children.length; i++)
			div.children[i].onclick = aclick;

		$p.iface.popup.clear();
		$p.iface.popup.attachObject(div);
		$p.iface.popup.show(dhx4.absLeft(t.getButton())-77, dhx4.absTop(t.getButton()), t.getButton().offsetWidth, t.getButton().offsetHeight);

		$p.iface.popup.p.onmouseover = function(){
			popup_focused = true;
		};

		$p.iface.popup.p.onmouseout = popup_hide;
	}

	dhtmlxEvent(t.getButton(), "mouseover", popup_show);

	dhtmlxEvent(t.getButton(), "mouseout", popup_hide);

	dhtmlxEvent(t.getBase(), "click", function (e) {
		return $p.cancel_bubble(e);
	});

	dhtmlxEvent(t.getBase(), "contextmenu", function (e) {
		setTimeout(popup_show, 10);
		e.preventDefault();
		return false;
	});

	dhtmlxEvent(t.getInput(), "keyup", function (e) {

		if(_mgr instanceof EnumManager)
			return;

		if(e.keyCode == 115){ // F4
			if(e.ctrlKey && e.shiftKey){
				if(!_obj[_field].empty())
					_obj[_field].form_obj();
			}else if(!e.ctrlKey && !e.shiftKey){
				if(_mgr)
					_mgr.form_selection(_pwnd, {
						initial_value: _obj[_field].ref,
						selection: [get_filter()]
					});
			}
			return $p.cancel_bubble(e);
		}
	});

	dhtmlxEvent(t.getInput(), "focus", function (e) {
		setTimeout(function () {
			if(t && t.getInput)
				t.getInput().select();
		}, 50);
	});


	function observer(changes){
		if(!t || !t.getBase)
			return;
		else if(!t.getBase().parentElement)
			setTimeout(t.unload);
		else{
			if(_obj instanceof TabularSectionRow){

			}else
				changes.forEach(function(change){
					if(change.name == _field){
						set_value(_obj[_field]);
					}
				});
		}
	}

	function set_value(v){
		if(v && v instanceof DataObj && !v.empty()){
			if(!t.getOption(v.ref))
				t.addOption(v.ref, v.presentation);
			if(t.getSelectedValue() == v.ref)
				return;
			t.setComboValue(v.ref);
		}else if(!t.getSelectedValue()){
			t.setComboValue("");
			t.setComboText("")
		}
	}

	/**
	 * Подключает поле объекта к элементу управления<br />
	 * Параметры аналогичны конструктору
	 */
	this.attach = function (attr) {

		if(_obj)
			Object.unobserve(_obj, observer);

		_obj = attr.obj;
		_field = attr.field;
		_property = attr.property;

		if(attr.meta)
			_meta = attr.meta;

		else if(_property){
			_meta = _obj._metadata.fields[_field]._clone();
			_meta.type = _property.type;

		}else
			_meta = _obj._metadata.fields[_field];

		t.clearAll();
		_mgr = _md.value_mgr(_obj, _field, _meta.type);

		if(_mgr){
			// загружаем список в 30 строк
			_mgr.get_option_list(_obj[_field], get_filter())
				.then(function (l) {
					if(t.addOption){
						t.addOption(l);
						// если поле имеет значение - устанавливаем
						set_value(_obj[_field]);
					}
				});
		}

		// начинаем следить за объектом
		if(_obj instanceof TabularSectionRow)
			Object.observe(_obj._owner._owner, observer, ["row"]);
		else
			Object.observe(_obj, observer, ["update"]);

	};

	var _unload = this.unload;
	this.unload = function () {
		popup_hide();
		if(_obj)
			Object.unobserve(_obj, observer);
		if(t.conf && t.conf.tm_confirm_blur)
			clearTimeout(t.conf.tm_confirm_blur);
		_obj = null;
		_field = null;
		_meta = null;
		_mgr = null;
		_pwnd = null;
		try{ _unload.call(t); }catch(e){};
	};

	// биндим поле объекта
	if(attr.obj && attr.field)
		this.attach(attr);
	// устанавливаем url фильтрации
	this.enableFilteringMode("between", "dummy", false, false);

}
OCombo._extend(dhtmlXCombo);
$p.iface.OCombo = OCombo;

$p.iface.select_from_list = function (list, multy) {

	return new Promise(function(resolve, reject){

		if(!Array.isArray(list) || !list.length)
			resolve(undefined);

		else if(list.length == 1)
			resolve(list[0]);

		// создаём и показываем диалог со списком

		// параметры открытия формы
		var options = {
				name: 'wnd_select_from_list',
				wnd: {
					id: 'wnd_select_from_list',
					width: 300,
					height: 300,
					modal: true,
					center: true,
					caption: $p.msg.select_from_list,
					allow_close: true,
					on_close: function () {
						if(rid)
							resolve(list[parseInt(rid)-1]);
						return true;
					}
				}
			},
			rid, sid,
			wnd = $p.iface.dat_blank(null, options.wnd),
			_grid = wnd.attachGrid(),
			_toolbar = wnd.attachToolbar({
				items:[
					{id: "select", type: "button", text: $p.msg.select_from_list},
					{id: "cancel", type: "button", text: "Отмена"}
				],
				onClick: do_select
			});

		function do_select(id){
			if(id != "cancel")
				rid = _grid.getSelectedRowId();
			wnd.close();
		}

		_grid.setIconsPath(dhtmlx.image_path);
		_grid.setImagePath(dhtmlx.image_path);
		_grid.setHeader($p.msg.value);
		_grid.setColTypes("ro");
		_grid.enableAutoWidth(true, 1200, 600);
		_grid.attachEvent("onRowDblClicked", do_select);
		_grid.enableMultiselect(!!multy);
		_grid.setNoHeader(true);
		_grid.init();

		_toolbar.addSpacer("select");

		wnd.hideHeader();
		wnd.cell.offsetParent.querySelector(".dhxwin_brd").style.border = "none"

		// заполняем его данными
		list.forEach(function (o, i) {
			var text;
			if(typeof o == "object")
				text = o.presentation || o.text || o.toString();
			else
				text = o.toString();
			_grid.addRow(1+i, text);
			if(o.selected)
				sid = 1+i;
		});
		if(sid)
			_grid.selectRowById(sid);

	});
};
/**
 * ### Визуальный компонент - реквизиты шапки объекта
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author	Evgeniy Malyarov
 *
 * @module  wdg_ohead_fields
 * @requires common
 */

/**
 * ### Визуальный компонент - реквизиты шапки объекта
 * - Предназначен для отображения и редактирования полей {{#crossLink "DataObj"}}объекта данных{{/crossLink}}
 * - Унаследован от [dhtmlXGridObject](http://docs.dhtmlx.com/grid__index.html)
 * - Состав и типы элементов управления в дереве реквизитов формируются автоматически по описанию метаданных
 * - Программное изменение значений реквизитов объекта данных, синхронно отображается в элементе управления
 * - Редактирование в элементе управления синхронно изменяет свойства связанного объекта
 *
 * Особенность dhtmlx: экземпляр создаётся не конструктором, а функцией `attachHeadFields` (без `new`) и размещается в ячейке dhtmlXCellObject
 *
 * @class OHeadFields
 * @param attr
 * @param attr.parent {HTMLElement} - контейнер, в котором будет размещен элемент
 * @param attr.obj {DataObj} - ссылка на редактируемый объект
 * @param attr.ts {String} - имя табличной части c дополнительными реквизитами
 * @param [attr.meta] {Object} - описание метаданных реквизитов. Если не указано, описание запрашивается у объекта
 * @constructor
 */
dhtmlXCellObject.prototype.attachHeadFields = function(attr) {

	var _obj,
		_oxml,
		_meta,
		_mgr,
		_selection,
		_tsname,
		_extra_fields,
		_pwnd,
		_cell = this,
		_grid = this.attachGrid(),
		_destructor = _grid.destructor;

	// задача обсервера - перерисовать поле при изменении свойств объекта
	function observer(changes){
		if(!_obj){
			var stack = [];
			changes.forEach(function(change){
				if(stack.indexOf[change.object]==-1){
					stack.push(change.object);
					Object.unobserve(change.object, observer);
					if(_extra_fields && _extra_fields instanceof TabularSection)
						Object.unobserve(change.object, observer_rows);
				}
			});
			stack = null;

		}else if(_grid.entBox && !_grid.entBox.parentElement)
			setTimeout(_grid.destructor);

		else
			changes.forEach(function(change){
				if(change.type == "unload"){
					if(_cell && _cell.close)
						_cell.close();
					else
						_grid.destructor();
				}else
					_grid.forEachRow(function(id){
						if (id == change.name)
							_grid.cells(id,1).setValue(_obj[change.name]);
					});
			});
	}

	function observer_rows(changes){
		var synced;
		changes.forEach(function(change){
			if (!synced && _tsname == change.tabular){
				synced = true;
				_grid.clearAll();
				_grid.parse(_mgr.get_property_grid_xml(_oxml, _obj, {
					title: attr.ts_title,
					ts: _tsname,
					selection: _selection,
					meta: _meta
				}), function(){

				}, "xml");
			}
		});
	}


	new dhtmlXPropertyGrid(_grid);

	_grid.setInitWidthsP("40,60");
	_grid.setDateFormat("%d.%m.%Y %H:%i");
	_grid.init();
	//t.enableAutoHeight(false,_cell._getHeight()-20,true);
	_grid.setSizes();
	_grid.attachEvent("onPropertyChanged", function(pname, new_value, old_value){
		if(pname)
			return _pwnd.on_select(new_value);
	});
	_grid.attachEvent("onCheckbox", function(rId, cInd, state){
		if(_obj[rId] != undefined)
			return _pwnd.on_select(state, {obj: _obj, field: rId});
	});
	if(attr.read_only){
		_grid.setEditable(false);
	}


	_grid.get_cell_field = function () {

		if(!_obj)
			return;

		var res = {row_id: _grid.getSelectedRowId()},
			fpath = res.row_id.split("|");

		if(fpath.length < 2)
			return {obj: _obj, field: fpath[0]}._mixin(_pwnd);
		else {
			var vr = _obj[fpath[0]].find(fpath[1]);
			if(vr){
				res.obj = vr;
				if(vr["Значение"]){
					res.field = "Значение";
					res.property = vr.Свойство || vr.Параметр;
				} else{
					res.field = "value";
					res.property = vr.property || vr.param;
				}
				return res._mixin(_pwnd);
			}
		}
	};

	_grid.destructor = function () {

		if(_obj)
			Object.unobserve(_obj, observer);
		if(_extra_fields && _extra_fields instanceof TabularSection)
			Object.unobserve(_extra_fields, observer_rows);

		_obj = null;
		_extra_fields = null;
		_meta = null;
		_mgr = null;
		_pwnd = null;

		_destructor.call(_grid);
	};

	_grid.__define("selection", {
		get: function () {
			return _selection;
		},
		set: function (sel) {
			_selection = sel;
			observer_rows([{tabular: _tsname}]);
		},
		enumerable: false
	});

	/**
	 * Подключает поле объекта к элементу управления<br />
	 * Параметры аналогичны конструктору
	 */
	_grid.attach = function (attr) {

		if (_obj)
			Object.unobserve(_obj, observer);

		if(_extra_fields && _extra_fields instanceof TabularSection)
			Object.unobserve(_obj, observer_rows);

		if(attr.oxml)
			_oxml = attr.oxml;

		if(attr.selection)
			_selection = attr.selection;

		_obj = attr.obj;
		_meta = attr.meta || _obj._metadata.fields;
		_mgr = _obj._manager;
		_tsname = attr.ts || "";
		_extra_fields = _tsname ? _obj[_tsname] : (_obj.extra_fields || _obj["ДополнительныеРеквизиты"]);
		if(_extra_fields && !_tsname)
			_tsname = _obj.extra_fields ? "extra_fields" :  "ДополнительныеРеквизиты";
		_pwnd = {
			// обработчик выбора ссылочных значений из внешних форм, открываемых полями со списками
			on_select: function (selv, cell_field) {
				if(!cell_field)
					cell_field = _grid.get_cell_field();
				if(cell_field){

						var ret_code = _mgr.handle_event(_obj, "value_change", {
							field: cell_field.field,
							value: selv,
							tabular_section: cell_field.row_id ? _tsname : "",
							grid: _grid,
							cell: _grid.cells(cell_field.row_id || cell_field.field, 1),
							wnd: _pwnd.pwnd
						});
						if(typeof ret_code !== "boolean"){
							cell_field.obj[cell_field.field] = selv;
							ret_code = true;
						}
						return ret_code;
					}
			},
			pwnd: attr.pwnd || _cell
		};


		// начинаем следить за объектом и, его табчастью допреквизитов
		Object.observe(_obj, observer, ["update", "unload"]);

		if(_extra_fields && _extra_fields instanceof TabularSection)
			Object.observe(_obj, observer_rows, ["row"]);

		// заполняем табчасть данными
		if(_tsname && !attr.ts_title)
			attr.ts_title = _obj._metadata.tabular_sections[_tsname].synonym;
		observer_rows([{tabular: _tsname}]);

	};

	//TODO: контекстные меню для элементов и табличных частей

	//TODO: HeadFields для редактирования строки табчасти. Она ведь - тоже DataObj

	if(attr)
		_grid.attach(attr);

	return _grid;
};

dhtmlXGridObject.prototype.get_cell_value = function () {
	var cell_field = this.get_cell_field();
	if(cell_field && cell_field.obj)
		return cell_field.obj[cell_field.field];
};


/**
 * ### Визуальный компонент - табличное поле объекта
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 *
 * @module  wdg_otabular
 * @requires common
 */


/**
 * ### Визуальный компонент - табличное поле объекта
 * - Предназначен для отображения и редактирования {{#crossLink "TabularSection"}}табличной части{{/crossLink}}
 * - Унаследован от [dhtmlXGridObject](http://docs.dhtmlx.com/grid__index.html)
 * - Состав и типы колонок формируются автоматически по описанию метаданны
 * - Программное изменение состава строк и значений в полях строк синхронно отображается в элементе управления
 * - Редактирование в элементе управления синхронно изменяет свойства табличной части связанного объекта
 *
 * Особенность dhtmlx: экземпляр создаётся не конструктором, а функцией `attachTabular` (без `new`) и размещается в ячейке dhtmlXCellObject
 *
 * @class OTabular
 * @param attr
 * @param attr.parent {HTMLElement} - контейнер, в котором будет размещен элемент
 * @param attr.obj {DataObj} - ссылка на редактируемый объект
 * @param attr.ts {String} - имя табличной части
 * @param [attr.meta] {Object} - описание метаданных табличной части. Если не указано, описание запрашивается у объекта
 * @param [attr.selection] {Object} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"} или {not: значение}
 * @constructor
 */
dhtmlXCellObject.prototype.attachTabular = function(attr) {


	var _obj = attr.obj,
		_tsname = attr.ts,
		_ts = _obj[_tsname],
		_mgr = _obj._manager,
		_meta = attr.meta || _mgr.metadata().tabular_sections[_tsname].fields,
		_cell = this,
		_source = {},
		_selection = attr.selection;
	if(!_md.ts_captions(_mgr.class_name, _tsname, _source))
		return;

	var _grid = this.attachGrid(),
		_toolbar = this.attachToolbar(),
		_destructor = _grid.destructor,
		_pwnd = {
			// обработчик выбора ссылочных значений из внешних форм, открываемых полями со списками
			on_select: function (selv) {
				tabular_on_edit(2, null, null, selv);
			},
			pwnd: attr.pwnd || _cell,
			is_tabular: true
		};
	_grid.setDateFormat("%d.%m.%Y %H:%i");

	function get_sel_index(silent){
		var selId = _grid.getSelectedRowId();

		if(selId && !isNaN(Number(selId)))
			return Number(selId)-1;

		if(!silent)
			$p.msg.show_msg({
				type: "alert-warning",
				text: $p.msg.no_selected_row.replace("%1", _obj._metadata.tabular_sections[_tsname].synonym || _tsname),
				title: (_obj._metadata.obj_presentation || _obj._metadata.synonym) + ': ' + _obj.presentation
			});
	}

	/**
	 * добавляет строку табчасти
	 */
	function add_row(){
		var row = _ts.add();
		setTimeout(function () {
			_grid.selectRowById(row.row);
		}, 100);
	}

	function del_row(){
		var rId = get_sel_index();
		if(rId != undefined)
			_ts.del(rId);
	}

	/**
	 * обработчик изменения значения в таблице продукции (примитивные типы)
	 */
	function tabular_on_edit(stage, rId, cInd, nValue, oValue){

		if(stage != 2 || nValue == oValue)
			return true;

		var cell_field = _grid.get_cell_field(),
			ret_code = _mgr.handle_event(_obj, "value_change", {
				field: cell_field.field,
				value: nValue,
				tabular_section: _tsname,
				grid: _grid,
				row: cell_field.obj,
				cell: (rId && cInd) ? _grid.cells(rId, cInd) : _grid.cells(),
				wnd: _pwnd.pwnd
			});

		if(typeof ret_code !== "boolean"){
			cell_field.obj[cell_field.field] = nValue;
			ret_code = true;
		}
		return ret_code;
	}

	function observer_rows(changes){
		var synced;
		changes.forEach(function(change){
			if (!synced && _tsname == change.tabular){
				synced = true;
				_ts.sync_grid(_grid, _selection);
			}
		});
	}

	function observer(changes){
		if(changes.length > 4){
			try{_ts.sync_grid(_grid, _selection);} catch(err){};
		} else
			changes.forEach(function(change){
				if (_tsname == change.tabular){
					if(_grid.getSelectedRowId() != change.row.row)
						_ts.sync_grid(_grid, _selection);
					else{
						var xcell = _grid.cells(change.row.row, _grid.getColIndexById(change.name));
						xcell.setCValue($p.is_data_obj(change.row[change.name]) ? change.row[change.name].presentation : change.row[change.name]);
					}
				}
			});
	}


	// панель инструментов табличной части
	_toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix());
	_toolbar.loadStruct(attr.toolbar_struct || $p.injected_data["toolbar_add_del.xml"], function(){
		this.attachEvent("onclick", function(btn_id){
			if(btn_id=="btn_add")
				add_row();

			else if(btn_id=="btn_delete")
				del_row();

		});
	});

	// собственно табличная часть
	_grid.setIconsPath(dhtmlx.image_path);
	_grid.setImagePath(dhtmlx.image_path);
	_grid.setHeader(_source.headers);
	if(_source.min_widths)
		_grid.setInitWidths(_source.widths);
	if(_source.min_widths)
		_grid.setColumnMinWidth(_source.min_widths);
	if(_source.aligns)
		_grid.setColAlign(_source.aligns);
	_grid.setColSorting(_source.sortings);
	_grid.setColTypes(_source.types);
	_grid.setColumnIds(_source.fields.join(","));
	_grid.enableAutoWidth(true, 1200, 600);
	_grid.enableEditTabOnly(true);
	_grid.init();

	if(attr.read_only){
		_grid.setEditable(false);
		_toolbar.disableItem("btn_add");
		_toolbar.disableItem("btn_delete");
	}

	_grid.attachEvent("onEditCell", tabular_on_edit);

	_grid.get_cell_field = function () {
		var rindex = get_sel_index(true), cindex = _grid.getSelectedCellIndex(), row, col;
		if(_ts && rindex != undefined && cindex >=0){
			row = _ts.get(rindex);
			col = _grid.getColumnId(cindex);
			return {obj: row, field: col}._mixin(_pwnd);
		}
	};

	_grid.destructor = function () {

		if(_obj){
			Object.unobserve(_obj, observer);
			Object.unobserve(_obj, observer_rows);
		}

		_obj = null;
		_ts = null;
		_meta = null;
		_mgr = null;
		_pwnd = null;
		_cell.detachToolbar();

		_destructor.call(_grid);
	};

	// TODO: реализовать свойство selection и его инициализацию через attr
	_grid.__define("selection", {
		get: function () {
			return _selection;
		},
		set: function (sel) {
			_selection = sel;
			observer_rows([{tabular: _tsname}]);
		},
		enumerable: false
	});

	// заполняем табчасть данными
	observer_rows([{tabular: _tsname}]);

	// начинаем следить за объектом и, его табчастью допреквизитов
	Object.observe(_obj, observer, ["row"]);
	Object.observe(_obj, observer_rows, ["rows"]);

	return _grid;
};


/**
 * Виджет для панели инструментов форм списка и выбора,
 * объединяет поля выбора периода и поле ввода фильтра
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author	Evgeniy Malyarov
 *
 * @module  wdg_filter
 * @requires common
 */

/**
 * Виджет для панели инструментов форм списка и выбора,
 * объединяет поля выбора периода и поле ввода фильтра
 * @param attr {Object} - параметры создаваемого виджета
 * @param attr.manager {DataManager}
 * @param attr.toolbar {dhtmlXToolbarObject}
 * @param [attr.pos=7] {Number} - номер элемента на тулбаре, после которого вставлять виджет
 * @param [attr.date_from]
 * @param [attr.date_till]
 * @constructor
 */
$p.iface.Toolbar_filter = function (attr) {

	var t = this,
		input_filter_width = 350,
		input_filter_changed = 0;

	if(!attr.pos)
		attr.pos = 6;

	function onchange(){

		if(input_filter_changed){
			clearTimeout(input_filter_changed);
			input_filter_changed = 0;
		}

		attr.onchange.call(t, t.get_filter());
	}

	function onkeydown(){

		if(input_filter_changed)
			clearTimeout(input_filter_changed);

		input_filter_changed = setTimeout(function () {
			if(input_filter_changed)
				onchange();
		}, 600);
	}

	// Поля ввода периода
	if(attr.manager instanceof DocManager || attr.period){

		// управляем доступностью дат в миникалендаре
		function set_sens(inp, k) {
			if (k == "min")
				t.сalendar.setSensitiveRange(inp.value, null);
			else
				t.сalendar.setSensitiveRange(null, inp.value);
		}

		input_filter_width = 180;

		attr.toolbar.addText("lbl_date_from", attr.pos, "Период с:");
		attr.pos++;
		attr.toolbar.addInput("input_date_from", attr.pos, "", 72);
		attr.pos++;
		attr.toolbar.addText("lbl_date_till", attr.pos, "по:");
		attr.pos++;
		attr.toolbar.addInput("input_date_till", attr.pos, "", 72);
		attr.pos++;

		t.input_date_from = attr.toolbar.getInput("input_date_from");
		t.input_date_from.setAttribute("readOnly", "true");
		t.input_date_from.onclick = function(){ set_sens(t.input_date_till,"max"); };

		t.input_date_till = attr.toolbar.getInput("input_date_till");
		t.input_date_till.setAttribute("readOnly", "true");
		t.input_date_till.onclick = function(){ set_sens(t.input_date_from,"min"); };

		// подключаем календарь к инпутам
		t.сalendar = new dhtmlXCalendarObject([t.input_date_from, t.input_date_till]);
		t.сalendar.attachEvent("onclick", onchange);

		// начальные значения периода
		if(!attr.date_from)
			attr.date_from = new Date((new Date()).getFullYear().toFixed() + "-01-01");
		if(!attr.date_till)
			attr.date_till = $p.date_add_day(new Date(), 1);
		t.input_date_from.value=$p.dateFormat(attr.date_from, $p.dateFormat.masks.short_ru);
		t.input_date_till.value=$p.dateFormat(attr.date_till, $p.dateFormat.masks.short_ru);

	}

	// текстовое поле фильтра по подстроке
	if(!attr.hide_filter){
		attr.toolbar.addText("lbl_filter", attr.pos, "Фильтр");
		attr.pos++;
		attr.toolbar.addInput("input_filter", attr.pos, "", input_filter_width);
		t.input_filter = attr.toolbar.getInput("input_filter");
		t.input_filter.onchange = onchange;
		t.input_filter.onkeydown = onkeydown;
		t.input_filter.type = "search";

		attr.toolbar.addSpacer("input_filter");

	}else if(t.input_date_till)
		attr.toolbar.addSpacer("input_date_till");

	else if(attr.toolbar.getItemText("btn_delete"))
		attr.toolbar.addSpacer("btn_delete");

	t.get_filter = function () {
		return {
			date_from: t.input_date_from ? dhx4.str2date(t.input_date_from.value) : "",
			date_till: t.input_date_till ? dhx4.str2date(t.input_date_till.value) : "",
			filter: t.input_filter ? t.input_filter.value : ""
		}
	}


};

/**
 * Динамическое дерево иерархического справочника
 *
 * Created 22.10.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 * @module  wdg_dyn_tree
 */

/**
 * ### Визуальный компонент - динамическое дерево иерархического справочника
 *
 * Особенность dhtmlx: экземпляр создаётся не конструктором, а функцией `attachDynTree` (без `new`) и размещается в ячейке dhtmlXCellObject
 *
 * @class ODynTree
 * @param mgr {DataManager}
 * @param [callback] Function
 * @constructor
 */
dhtmlXCellObject.prototype.attachDynTree = function(mgr, filter, callback) {

	if(this.setCollapsedText)
		this.setCollapsedText("Дерево");

	if(!filter)
		filter = {is_folder: true};

	var tree = this.attachTree();
	tree.setImagePath(dhtmlx.image_path + 'dhxtree' + dhtmlx.skin_suffix());
	tree.setIconsPath(dhtmlx.image_path + 'dhxtree' + dhtmlx.skin_suffix());
	if($p.device_type == "desktop")
		tree.enableKeyboardNavigation(true);

	tree.__define({
		/**
		 * Фильтр, налагаемый на дерево
		 */
		filter: {
			get: function () {

			},
			set: function (v) {
				filter = v;
			},
			enumerable: false,
			configurable: false
		}
	});

	// !!! проверить закешированность дерева
	// !!! для неиерархических справочников дерево можно спрятать
	setTimeout(function () {
		$p.cat.load_soap_to_grid({
			action: "get_tree",
			class_name: mgr.class_name,
			filter: filter
		}, tree, callback);
	});

	return tree;
};
/**
 * Формы визуализации и изменения параметров объекта
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author	Evgeniy Malyarov
 *
 * @module common
 * @submodule wnd_dat
 */


/**
 * Форма dat - шаблон окна инструментов
 */
$p.iface.dat_blank = function(_dxw, attr) {

	// TODO: реализовать undock для аккордиона

	if(!attr)
		attr = {};
	var wnd_dat, _modified = false, wid = attr.id || 'wnd_dat_' + dhx4.newId();

	wnd_dat = (_dxw || $p.iface.w).createWindow({
		id: wid,
		left: attr.left || 900,
		top: attr.top || 20,
		width: attr.width || 220,
		height: attr.height || 300,
		move: true,
		park: !attr.allow_close,
		center: !!attr.center,
		resize: true,
		caption: attr.caption || "Tools"
	});


	_dxw = null;

	if(!attr.allow_minmax)
		wnd_dat.button('minmax').hide();

	if(attr.allow_close)
		wnd_dat.button('park').hide();
	else
		wnd_dat.button('close').hide();

	if(typeof attr.on_close == "function")
		wnd_dat.attachEvent("onClose", attr.on_close);

	wnd_dat.setIconCss('without_icon');
	wnd_dat.cell.parentNode.children[1].classList.add('dat_gui');

	$p.iface.bind_help(wnd_dat, attr.help_path);

	wnd_dat.elmnts = {grids: {}};
	wnd_dat.__define("modified", {
		get: function () {
			return _modified;
		},
		set: function (v) {
			_modified = v;
			var title = wnd_dat.getText();
			if(_modified && title.lastIndexOf("*")!=title.length-1)
				wnd_dat.setText(title + " *");
			else if(!_modified && title.lastIndexOf("*")==title.length-1)
				wnd_dat.setText(title.replace(" *", ""));
		},
		enumerable: false,
		configurable: false
	});

	wnd_dat.wnd_options = function (options) {
		var pos = wnd_dat.getPosition(),
			sizes = wnd_dat.getDimension(),
			parked = wnd_dat.isParked();
		options.left = pos[0];
		options.top = pos[1];
		options.width = sizes[0];
		options.parked = parked;
		if(!parked)
			options.height = sizes[1];

	};

	wnd_dat.bottom_toolbar = function(oattr){

		var attr = ({
				wrapper: wnd_dat.cell,
				width: '100%',
				height: '28px',
				bottom: '0px',
				left: '0px',
				name: 'tb_bottom',
				buttons: [
					{name: 'btn_cancel', text: 'Отмена', title: 'Закрыть без сохранения', width:'60px', float: 'right'},
					{name: 'btn_ok', b: 'Ок', title: 'Применить изменения', width:'30px', float: 'right'}
				],
				onclick: function (name) {
					return false;
				}
			})._mixin(oattr),

			tb_bottom = new OTooolBar(attr),
			sbar = wnd_dat.attachStatusBar({height: 12});
		sbar.style.zIndex = -1000;
		sbar.firstChild.style.backgroundColor = "transparent";
		sbar.firstChild.style.border = "none";
		return tb_bottom;
	};

	if(attr.modal){
		if(attr.pwnd && attr.pwnd.setModal)
			attr.pwnd.setModal(0);
		wnd_dat.setModal(1);
	}

	return wnd_dat;
};

/**
 * Форма dat.tree - дерево с галочками
 */
$p.iface.dat_tree = function(_dxw, attr) {

	var wnd_dat = $p.iface.dat_blank(_dxw, attr),
		layout = document.createElement("div"),
		cell_a = document.createElement("div"),
		cell_b = document.createElement("div"),
		str_form = [
			{ type:"combo" , name:"cb_sys", label:"Система"  },
			{ type:"combo" , name:"cb_clr", label:"Цвет"  },
			{ type:"settings" , labelWidth:50, inputWidth:160, offsetLeft: 0, offsetTop: 0  }
		];

	_dxw = null;

	wnd_dat.setMinDimension(250, 300);
	wnd_dat.attachObject(layout);
	layout.appendChild(cell_a);
	layout.appendChild(cell_b);
	wnd_dat.cell_a = cell_a;

	wnd_dat.tree = new dhtmlXTreeObject(cell_b, "100%", "100%", 0);
	wnd_dat.tree.setImagePath(dhtmlx.image_path + 'dhxtree' + dhtmlx.skin_suffix());
	wnd_dat.tree.setIconsPath(dhtmlx.image_path + 'dhxtree' + dhtmlx.skin_suffix());
	wnd_dat.tree.enableCheckBoxes(true, true);
	wnd_dat.tree.enableTreeImages(false);

	return wnd_dat;
};

/**
 * Форма dat.pgrid - таблица свойств
 */
$p.iface.dat_pgrid = function(_dxw, attr) {

	var wnd_dat = $p.iface.dat_blank(_dxw, attr);

	_dxw = null;

	wnd_dat.setMinDimension(320, 300);

	var pgrid = wnd_dat.elmnts.pgrid = wnd_dat.attachPropertyGrid();
	pgrid.setDateFormat("%d.%m.%Y %H:%i");
	pgrid.init();
	if(attr.grid_struct)
		pgrid.parse(
			attr.o._manager.get_property_grid_xml(attr.grid_struct, attr.v), function(){
				pgrid.enableAutoHeight(false);
				pgrid.setSizes();
				pgrid.setUserData("", "source",	{
					o: attr.v,
					grid: pgrid,
					on_select: $p.iface.pgrid_on_select,
					slist: attr.grid_slist,
					grid_on_change: attr.grid_on_change,
					wnd: wnd_dat
				});
				pgrid.attachEvent("onPropertyChanged", $p.iface.pgrid_on_change );
				pgrid.attachEvent("onCheckbox", $p.iface.pgrid_on_checkbox );
			}, "xml");

	return wnd_dat;
};

/**
 * обработчик выбора значения в свойствах (ссылочные типы)
 * вызывается в контексте this = pgrid
 * @param selv {*} выбранное значение
 */
$p.iface.pgrid_on_select = function(selv){

	if(selv===undefined)
		return;

	var pgrid = this.grid instanceof dhtmlXGridObject ? this.grid : this,
		source = pgrid.getUserData("", "source"),
		f = pgrid.getSelectedRowId();

	if(source.o[f] != undefined){
		if(typeof source.o[f] == "number")
			source.o[f] = $p.fix_number(selv, true);
		else
			source.o[f] = selv;

	}else if(f.indexOf("fprms") > -1){
		var row = $p._find(source.o.fprms, f.split("|")[1]);
		row.value = selv;
	}

	pgrid.cells().setValue($p.is_data_obj(selv) ? selv.presentation : selv || "");

	if(source.wnd)
		source.wnd.modified = true;

	if(source.grid_on_change)
		source.grid_on_change.call(pgrid, f, selv);
};

/**
 * обработчик изменения значения в свойствах (примитивные типы)
 * @param pname {String} - имя измененного свойства
 * @param new_value {*} - новое значение
 * @param old_value {*} - предыдущее значение
 */
$p.iface.pgrid_on_change = function(pname, new_value, old_value){
	if(pname)
		$p.iface.pgrid_on_select.call(this, new_value);
};

/**
 * обработчик изменения флажка в свойствах (bit)
 * @param rId {String} - идентификатор строки
 * @param cInd {Number} - идентификатор колонки
 * @param state {Boolean} - состояние чекбокса
 */
$p.iface.pgrid_on_checkbox = function(rId, cInd, state){

	var pgrid = this.grid instanceof dhtmlXGridObject ? this.grid : this,
		source = pgrid.getUserData("", "source");

	if(source.o[rId] != undefined)
		source.o[rId] = state;

	if(source.wnd)
		source.wnd.modified = true;

	if(source.grid_on_change)
		source.grid_on_change(rId, state);
};


function _clear_all(){
	$p.iface.docs.__define({
		clear_all: {
			value: function () {
				this.detachToolbar();
				this.detachStatusBar();
				this.detachObject(true);
			},
			enumerable: false
		},
		"Очистить": {
			get: function () {
				return this.clear_all;
			},
			enumerable: false
		},
		"Контейнер": {
			get: function () {
				return this.cell.querySelector(".dhx_cell_cont_layout");
			},
			enumerable: false
		}
	});
}

/**
 * Рисует стандартную раскладку (XLayout) с деревом в левой части
 * @method layout_2u
 * @for InterfaceObjs
 * @param [tree_attr] {String} - путь к файлу структуры дерева
 * @return {Object} - Псевдопромис
 */
$p.iface.layout_2u = function (tree_attr) {

	var iface = $p.iface;

	iface.main = new dhtmlXLayoutObject({
		parent: document.body,
		pattern: "2U"
	});
	iface.main.attachEvent("onCollapse", function(name){
		if(name=="b"){
			iface.docs.expand();
			return false;
		}
	});
	iface.docs = iface.main.cells('b');
	_clear_all();

	iface.cell_tree = iface.main.cells('a');
	iface.cell_tree.setText('Режим');
	iface.cell_tree.setWidth('190');
	iface.cell_tree.fixSize(false, false);
	iface.cell_tree.collapse();

	iface.tree = iface.cell_tree.attachTree();
	iface.tree.setImagePath(dhtmlx.image_path + 'dhxtree' + dhtmlx.skin_suffix());
	iface.tree.setIconsPath(dhtmlx.image_path + 'dhxtree' + dhtmlx.skin_suffix());

	
	if(tree_attr){

		// довешиваем обработчик на дерево
		iface.tree.attachEvent("onSelect", tree_attr.onselect);

		return new Promise(function(resolve, reject) {
			iface.tree.loadXML(tree_attr.path+'?v='+$p.job_prm.files_date, function(){
				this.tree_filteres = tree_attr.path;
				resolve(this);
			});
		});

	}else{
		iface.tree.attachEvent("onSelect", function(id){    // довешиваем обработчик на дерево

			var parts = id.split('.');

			if(parts.length > 1){

				if(iface.swith_view(parts[0]) == "oper"){		// открываем форму списка текущего метаданного

					var mgr = $p.md.mgr_by_class_name(id.substr(5));

					if(typeof iface.docs.close === "function" )
						iface.docs.close();

					if(mgr)
						mgr.form_list(iface.docs, {});

				}
			}
		});
		return Promise.resolve(iface.tree);
	}

};

/**
 * Рисует стандартную раскладку (XLayout) с единственной областью во весь экран.
 * В созданной области, как правило, размещают форму списка основного документа
 * @method layout_1c
 * @for InterfaceObjs
 * @return {Promise.<boolean>}
 */
$p.iface.layout_1c = function () {

	var iface = $p.iface;

	return new Promise(function(resolve, reject) {
		try{
			iface.main = new dhtmlXLayoutObject({
				parent: document.body,
				pattern: "1C",
				offsets: {top: 4, right: 4, bottom: 4, left: 4}
			});
			iface.docs = iface.main.cells('a');
			_clear_all();
			resolve(true);
		}catch(err){
			reject(err);
		}
	});
};

/**
 * Создаёт форму авторизации с обработчиками перехода к фидбэку и настройкам,
 * полем входа под гостевой ролью, полями логина и пароля и кнопкой входа
 * @method frm_auth
 * @for InterfaceObjs
 * @param attr {Object} - параметры формы
 * @param [attr.onstep] {Function} - обработчик визуализации шагов входа в систему. Если не указан, рисуется стандарное окно
 * @param [attr.cell] {dhtmlXCellObject}
 * @return {Promise}
 */
$p.iface.frm_auth = function (attr, resolve, reject) {

	if(!attr)
		attr = {};

	var _cell = attr.cell || $p.iface.docs,
		_frm = $p.iface.auth = _cell.attachForm(),
		w, were_errors;

	if(!attr.onstep)
		attr.onstep = function (step){

			var stepper = $p.eve.stepper;

			switch(step) {

				case $p.eve.steps.authorization:

					stepper.frm_sync.setItemValue("text_processed", "Авторизация");

					break;

				case $p.eve.steps.load_meta:

					// индикатор прогресса и малое всплывающее сообщение
					_cell.progressOn();
					$p.msg.show_msg($p.msg.init_catalogues + $p.msg.init_catalogues_meta, _cell);
					if(!$p.iface.sync)
						$p.iface.wnd_sync();
					$p.iface.sync.create(stepper);

					break;

				case $p.eve.steps.create_managers:

					stepper.frm_sync.setItemValue("text_processed", "Обработка метаданных");
					stepper.frm_sync.setItemValue("text_bottom", "Создаём объекты менеджеров данных...");

					break;

				case $p.eve.steps.process_access:

					break;

				case $p.eve.steps.load_data_files:

					stepper.frm_sync.setItemValue("text_processed", "Загрузка начального образа");
					stepper.frm_sync.setItemValue("text_bottom", "Читаем файлы данных зоны...");

					break;

				case $p.eve.steps.load_data_db:

					stepper.frm_sync.setItemValue("text_processed", "Загрузка изменений из 1С");
					stepper.frm_sync.setItemValue("text_bottom", "Читаем изменённые справочники");

					break;

				case $p.eve.steps.load_data_wsql:

					break;

				case $p.eve.steps.save_data_wsql:

					stepper.frm_sync.setItemValue("text_processed", "Кеширование данных");
					stepper.frm_sync.setItemValue("text_bottom", "Сохраняем таблицы в локальном SQL...");

					break;

				default:

					break;
			}

		};

	if(!$p.job_prm.files_date)
		$p.eve.update_files_version();

	function do_auth(login, password, is_guest){
		$p.ajax.username = login;
		$p.ajax.password = password;

		if(login){
			if(!is_guest)
				$p.wsql.set_user_param("user_name", login);					// сохраняем имя пользователя в базе
			if(!$p.is_guid($p.wsql.get_user_param("browser_uid")))
				$p.wsql.set_user_param("browser_uid", $p.generate_guid());	// проверяем guid браузера

			$p.eve.log_in(attr.onstep)
				.then(function () {
					if(resolve)
						resolve();
					$p.eve.logged_in = true;
					dhx4.callEvent("log_in");
				})
				.catch(function (err) {
					were_errors = true;
					if(reject)
						reject(err);
				})
				.then(function () {
					if($p.iface.sync)
						$p.iface.sync.close();
					if(_cell){
						_cell.progressOff();
						if(!were_errors && attr.hide_header)
							_cell.hideHeader();
					}
					if($p.iface.cell_tree && !were_errors)
						$p.iface.cell_tree.expand();
				});

		} else
			this.validate();
	}

	// обработчик кнопки "войти" формы авторизации
	function auth_click(name){

		this.resetValidateCss();

		if(this.getCheckedValue("type") == "guest"){
			do_auth.call(this, this.getItemValue("guest"), "", true);
			$p.wsql.set_user_param("user_name", "");

		}else if(this.getCheckedValue("type") == "auth"){
			do_auth.call(this, this.getItemValue("login"), this.getItemValue("password"));

		}
	}

	// загружаем структуру формы
	_frm.loadStruct($p.injected_data["form_auth.xml"], function(){

		// после готовности формы читаем пользователя из локальной датабазы
		if($p.wsql.get_user_param("user_name")){
			_frm.setItemValue("login", $p.wsql.get_user_param("user_name"));
			_frm.setItemValue("type", "auth");

			if($p.wsql.get_user_param("enable_save_pwd") && $p.wsql.get_user_param("user_pwd")){
				_frm.setItemValue("password", $p.wsql.get_user_param("user_pwd"));

				if($p.wsql.get_user_param("autologin"))
					auth_click();
			}
		}

		// позиционируем форму по центру
		if((w = ((_cell.getWidth ? _cell.getWidth() : _cell.cell.offsetWidth) - 500)/2) >= 10)
			_frm.cont.style.paddingLeft = w.toFixed() + "px";
		else
			_frm.cont.style.paddingLeft = "20px";

		setTimeout(function () {
			dhx4.callEvent("on_draw_auth", [_frm]);
		});
	});

	// назначаем обработчик нажатия на кнопку
	_frm.attachEvent("onButtonClick", auth_click);

	_frm.attachEvent("onKeyDown",function(inp, ev, name, value){
		if(ev.keyCode == 13){
			if(name == "password" || this.getCheckedValue("type") == "guest"){
				auth_click.call(this);
			}
		}
	});


	$p.msg.show_msg($p.msg.init_login, _cell);

	_frm.onerror = function (err) {

		$p.ajax.authorized = false;

		var emsg = err.message.toLowerCase();

		if(emsg.indexOf("auth") != -1) {
			$p.msg.show_msg({
				title: $p.msg.main_title + $p.version,
				type: "alert-error",
				text: $p.msg.error_auth
			});
			_frm.setItemValue("password", "");
			_frm.validate();

		}else if(emsg.indexOf("gateway") != -1 || emsg.indexOf("net") != -1) {
			$p.msg.show_msg({
				title: $p.msg.main_title + $p.version,
				type: "alert-error",
				text: $p.msg.error_network
			});
		}
	}

};

/**
 * Служебная функция для открытия окна настроек из гиперссылки
 * @param e
 * @return {Boolean}
 */
$p.iface.open_settings = function (e) {
	var evt = (e || (typeof event != "undefined" ? event : undefined));
	if(evt)
		evt.preventDefault();

	var hprm = $p.job_prm.parse_url();
	$p.iface.set_hash(hprm.obj, hprm.ref, hprm.frm, "settings");

	return $p.cancel_bubble(evt);
};

/**
 * Переключает вид формы между списком, календаарём и отчетами
 * @method swith_view
 * @for InterfaceObjs
 * @param name {String} - имя представления
 */
$p.iface.swith_view = function(name){

	var state,
		iface = $p.iface,

		/**
		 * Переключает состав элементов дерева
		 * @param view
		 */
		swith_tree = function(name){

			function compare_text(a, b) {
				if (a.text > b.text) return 1;
				if (a.text < b.text) return -1;
			}

			if(!iface.tree){

				var hprm = $p.job_prm.parse_url();
				if(hprm.obj) {
					var parts = hprm.obj.split('.');
					if(parts.length > 1){

						var mgr = $p.md.mgr_by_class_name(hprm.obj);

						if(typeof iface.docs.close === "function" )
							iface.docs.close();

						if(mgr)
							mgr.form_list(iface.docs, {});
					}
				}
				return;

			}else if(iface.tree._view == name || ["rep", "cal"].indexOf(name) != -1)
				return;

			iface.tree.deleteChildItems(0);
			if(name == "oper"){
				var meta_tree = {id:0, item:[
					{id:"oper_cat", text: $p.msg.meta_cat, open: true, item:[]},
					{id:"oper_doc", text: $p.msg.meta_doc, item:[]},
					{id:"oper_cch", text: $p.msg.meta_cch, item:[]},
					{id:"oper_cacc", text: $p.msg.meta_cacc, item:[]}
				]}, mdn, md,

				// бежим по справочникам
					tlist = meta_tree.item[0].item;
				for(mdn in _cat){
					if(typeof _cat[mdn] == "function")
						continue;
					md = _cat[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.cat." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				// бежим по документам
				tlist = meta_tree.item[1].item;
				for(mdn in _doc){
					if(typeof _doc[mdn] == "function")
						continue;
					md = _doc[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.doc." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				// бежим по планам видов характеристик
				tlist = meta_tree.item[2].item;
				for(mdn in _cch){
					if(typeof _cch[mdn] == "function")
						continue;
					md = _cch[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.cch." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				// бежим по планам счетов
				tlist = meta_tree.item[3].item;
				for(mdn in _cacc){
					if(typeof _cacc[mdn] == "function")
						continue;
					md = _cacc[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.cacc." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				iface.tree.parse(meta_tree, function(){
					var hprm = $p.job_prm.parse_url();
					if(hprm.obj){
						iface.tree.selectItem(hprm.view+"."+hprm.obj, true);
					}
				}, "json");

			}else{
				iface.tree.loadXML(iface.tree.tree_filteres+'?v='+$p.job_prm.files_date, function(){

				});

			}

			iface.tree._view = name;
		};

	if(name.indexOf(iface.docs.getViewName())==0)
		return iface.docs.getViewName();

	state = iface.docs.showView(name);
	if (state == true) {
		// first call, init corresponding components
		// календарь
		if(name=="cal" && !window.dhtmlXScheduler){
			$p.load_script("dist/dhtmlxscheduler.min.js", "script", function(){
				//scheduler.config.xml_date="%Y-%m-%d %H:%i";
				scheduler.config.first_hour = 8;
				scheduler.config.last_hour = 22;
				iface.docs.scheduler = iface.docs.attachScheduler(new Date("2015-11-20"), "week", "scheduler_here");
				iface.docs.scheduler.attachEvent("onBeforeViewChange", function(old_mode, old_date, mode, date){
					if(mode == "timeline"){
						$p.msg.show_not_implemented();
						return false;
					}
					return true;
				});
			});

			$p.load_script("dist/dhtmlxscheduler.css", "link");

			//}else if(name=="rep"){
			//	// подключаемый отчет
			//
			//}else if(name=="oper"){
			//	// в дереве - список метаданных, в окне - список текущего метаданного
			//

		}
	}

	swith_tree(name);

	if(name == "def")
		iface.main.showStatusBar();
	else
		iface.main.hideStatusBar();
};


/**
 * ### Визуальный компонент OTooolBar
 * Панель инструментов рисовалки и альтернативная панель инструментов прочих форм
 * - Гибкое управление размером, положением и выравниванием как самой панели, так и отдельных кнопок
 * - Кнопки и группы кнопок, иконы и текст
 * - Всплывающие подсказки с произвольным html
 *
 * @class OTooolBar
 * @param attr {Object} - параметры создаваемой панели - родитель, положение, размер и ориентация
 * @constructor
 */
function OTooolBar(attr){
	var _this = this,
		div = document.createElement('div'),
		offset, popup_focused, sub_focused, btn_focused;

	if(!attr.image_path)
		attr.image_path = dhtmlx.image_path;

	if(attr.hasOwnProperty("class_name"))
		div.className = attr.class_name;
	else
		div.className = 'md_otooolbar';

	_this.cell = div;

	_this.buttons = {};

	function bselect(select){
		for(var i=0; i<div.children.length; i++){
			var btn = div.children[i];
			if(btn.classList.contains('selected'))
				btn.classList.remove('selected');
		}
		if(select && !this.classList.contains('selected'))
			this.classList.add('selected');
	}

	function popup_hide(){
		popup_focused = false;
		setTimeout(function () {
			if(!popup_focused)
				$p.iface.popup.hide();
		}, 300);
	}

	function btn_click(){
		var tool_name = this.name.replace(attr.name + '_', '');
		if(attr.onclick)
			attr.onclick.call(_this, tool_name);
	}

	/**
	 * Добавляет кнопку на панель инструментов
	 * @method add
	 * @param battr {Object} - атрибуты создаваемой кнопки
	 */
	this.add = function(battr){

		var bdiv = $p.iface.add_button(div, attr, battr);

		bdiv.onclick = btn_click;

		bdiv.onmouseover = function(){
			if(battr.title && !battr.sub){
				popup_focused = true;

				$p.iface.popup.clear();
				$p.iface.popup.attachHTML(battr.title);
				$p.iface.popup.show(dhx4.absLeft(bdiv), dhx4.absTop(bdiv), bdiv.offsetWidth, bdiv.offsetHeight);

				$p.iface.popup.p.onmouseover = function(){
					popup_focused = true;
				};

				$p.iface.popup.p.onmouseout = popup_hide;
			}
		};

		bdiv.onmouseout = popup_hide;

		_this.buttons[battr.name] = bdiv;

		if(battr.sub){

			function remove_sub(parent){
				if(!parent)
					parent = bdiv;
				if(parent.subdiv && !sub_focused && !btn_focused){
					while(parent.subdiv.firstChild)
						parent.subdiv.removeChild(parent.subdiv.firstChild);
					parent.subdiv.parentNode.removeChild(parent.subdiv);
					parent.subdiv = null;
				}
			}

			bdiv.onmouseover = function(){

				// нужно погасить сабдивы соседей
				for(var i=0; i<bdiv.parentNode.children.length; i++){
					if(bdiv.parentNode.children[i] != bdiv && bdiv.parentNode.children[i].subdiv){
						remove_sub(bdiv.parentNode.children[i]);
						break;
					}
				}

				btn_focused = true;

				if(!this.subdiv){
					this.subdiv = document.createElement('div');
					this.subdiv.className = 'md_otooolbar';
					offset = $p.iface.get_offset(bdiv);
					if(battr.sub.align == 'right')
						this.subdiv.style.left = (offset.left + bdiv.offsetWidth - (parseInt(battr.sub.width.replace(/\D+/g,"")) || 56)) + 'px';
					else
						this.subdiv.style.left = offset.left + 'px';
					this.subdiv.style.top = (offset.top + div.offsetHeight) + 'px';
					this.subdiv.style.height = battr.sub.height || '198px';
					this.subdiv.style.width = battr.sub.width || '56px';
					for(var i in battr.sub.buttons){
						var bsub = $p.iface.add_button(this.subdiv, attr, battr.sub.buttons[i]);
						bsub.onclick = btn_click;
					}
					attr.wrapper.appendChild(this.subdiv);

					this.subdiv.onmouseover = function () {
						sub_focused = true;
					};

					this.subdiv.onmouseout = function () {
						sub_focused = false;
						setTimeout(remove_sub, 500);
					};

					if(battr.title)
						$p.iface.popup.show(dhx4.absLeft(this.subdiv), dhx4.absTop(this.subdiv), this.subdiv.offsetWidth, this.subdiv.offsetHeight);
				}

			};

			bdiv.onmouseout = function(){
				btn_focused = false;
				setTimeout(remove_sub, 500);
			}
		}
	};

	/**
	 * Выделяет кнопку по событию mouseover и снимает выделение с остальных кнопок
	 * @method select
	 * @param name {String} - имя текущей кнопки
	 */
	this.select = function(name){
		for(var i=0; i<div.children.length; i++){
			var btn = div.children[i];
			if(btn.name == attr.name + '_' + name){
				bselect.call(btn, true);
				return;
			}
		}
	};

	/**
	 * Возвращает имя выделенной кнопки
	 */
	this.get_selected = function () {
		for(var i=0; i<div.children.length; i++){
			var btn = div.children[i];
			if(btn.classList.contains('selected'))
				return btn.name;
		}
	};

	/**
	 * Деструктор объекта
	 * @method unload
	 */
	this.unload = function(){
		while(div.firstChild)
			div.removeChild(div.firstChild);
		attr.wrapper.removeChild(div);
	};


	attr.wrapper.appendChild(div);
	div.style.width = attr.width || '28px';
	div.style.height = attr.height || '150px';
	div.style.position = 'absolute';
	if(attr.top)
		div.style.top = attr.top;
	if(attr.left)
		div.style.left = attr.left;
	if(attr.bottom)
		div.style.bottom = attr.bottom;
	if(attr.right)
		div.style.right = attr.right;

	if(attr.buttons)
		attr.buttons.forEach(function(battr){
			_this.add(battr);
		});

};
$p.iface.OTooolBar = OTooolBar;

/**
 * Добавляет кнопку на панель инструментов
 * @method add_button
 * @for InterfaceObjs
 * @param parent {Element}
 * @param attr {Object}
 * @param battr {Object}
 * @returns {Element}
 */
$p.iface.add_button = function(parent, attr, battr) {
	var bdiv = document.createElement('div'), html = '';
	bdiv.name = (attr ? attr.name + '_' : '') + battr.name;
	parent.appendChild(bdiv);
	bdiv.className = 'md_otooolbar_button';
	if(battr.img)
		html = '<img src="' + (attr ? attr.image_path : '') + battr.img + '">';
	if(battr.b)
		html +='<b style="vertical-align: super;"> ' + battr.b + '</b>';
	else if(battr.text)
		html +='<span style="vertical-align: super;"> ' + battr.text + '</span>';
	else if(battr.css)
		bdiv.classList.add(battr.css);
	bdiv.innerHTML = html;

	if(battr.float)
		bdiv.style.float = battr.float;
	if(battr.clear)
		bdiv.style.clear = battr.clear;
	if(battr.width)
		bdiv.style.width = battr.width;
	return bdiv;
};

/**
 * Поле ввода адреса связанная с ним форма ввода адреса
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author	Evgeniy Malyarov
 *
 * @module  wnd_oaddress
 */

if(typeof window !== "undefined" && "dhtmlx" in window){

	/**
	 *  Конструктор поля ввода адреса
	 */
	function eXcell_addr(cell){

		if (!cell)
			return;

		var t = this, td,

			ti_keydown=function(e){
				return eXcell_proto.input_keydown(e, t);
			},

			open_selection=function(e) {
				var source = {grid: t.grid}._mixin(t.grid.get_cell_field());
				wnd_address(source);
				return $p.cancel_bubble(e);
			};

		t.cell = cell;
		t.grid = t.cell.parentNode.grid;
		t.open_selection = open_selection;

		/**
		 * Устанавливает текст в ячейке. например, this.setCValue("<input type='button' value='"+val+"'>",val);
		 */
		t.setValue=function(val){ t.setCValue(val); };

		/**
		 * Получает значение ячейки из табличной части или поля объекта или допполя допобъекта, а не из грида
		 */
		t.getValue=function(){
			return t.grid.get_cell_value();
		};

		/**
		 * Создаёт элементы управления редактора и назначает им обработчики
		 */
		t.edit=function(){
			var ti;
			t.val = t.getValue();		//save current value
			t.cell.innerHTML = '<div class="ref_div21"><input type="text" class="dhx_combo_edit" style="height: 20px;"><div class="ref_field21">&nbsp;</div></div>';

			td = t.cell.firstChild;
			ti = td.childNodes[0];
			ti.value=t.val;
			ti.onclick=$p.cancel_bubble;		//blocks onclick event
			ti.readOnly = true;
			ti.focus();
			ti.onkeydown=ti_keydown;
			td.childNodes[1].onclick=open_selection;
		};

		/**
		 * Вызывается при отключении редактора
		 */
		t.detach=function(){
			t.setValue(t.getValue());
			return !$p.is_equal(t.val, t.getValue());				// compares the new and the old values
		}
	}
	eXcell_addr.prototype = eXcell_proto;
	window.eXcell_addr = eXcell_addr;

	function wnd_address(source){

		var wnd,		// окно формы
			obj = source.obj,
			pwnd = source.pwnd,
			_delivery_area = obj.delivery_area,
			v = {		// реквизиты формы
				coordinates: obj.coordinates ? JSON.parse(obj.coordinates) : [],
				country: "Россия",
				region: "",
				city: "",
				street:	"",
				postal_code: "",
				marker: {}
			};
		v.__define("delivery_area", {
			get: function () {
				return _delivery_area;
			},
			set: function (selv) {
				pgrid_on_select(selv);

			}
		});

		process_address_fields(frm_create);


		/**
		 * ПриСозданииНаСервере
		 */
		function frm_create(){

			// параметры открытия формы
			var options = {
				name: 'wnd_addr',
				wnd: {
					id: 'wnd_addr',
					top: 130,
					left: 200,
					width: 800,
					height: 560,
					modal: true,
					center: true,
					pwnd: pwnd,
					allow_close: true,
					allow_minmax: true,
					on_close: frm_close,
					caption: obj.shipping_address
				}
			};

			// уменьшаем высоту, в случае малого фрейма
			if(pwnd && pwnd.getHeight){
				if(options.wnd.height > pwnd.getHeight())
					options.wnd.height = pwnd.getHeight();
			}

			wnd = $p.iface.dat_blank(null, options.wnd);

			//TODO: компактная кнопка выбора в заголовке формы
			// wnd.cell.parentElement.querySelector(".dhxwin_text")

			wnd.elmnts.layout = wnd.attachLayout('2E');
			wnd.elmnts.cell_frm = wnd.elmnts.layout.cells('a');
			wnd.elmnts.cell_frm.setHeight('110');
			wnd.elmnts.cell_frm.hideHeader();
			wnd.elmnts.cell_frm.fixSize(0,1);

			// TODO: переделать на OHeadFields
			wnd.elmnts.pgrid = wnd.elmnts.cell_frm.attachPropertyGrid();
			wnd.elmnts.pgrid.setDateFormat("%d.%m.%Y %H:%i");
			wnd.elmnts.pgrid.init();
			wnd.elmnts.pgrid.parse(obj._manager.get_property_grid_xml({
				" ": [
					{id: "delivery_area", path: "o.delivery_area", synonym: "Район доставки", type: "ref", txt: v.delivery_area.presentation},
					{id: "region", path: "o.region", synonym: "Регион", type: "ro", txt: v.region},
					{id: "city", path: "o.city", synonym: "Населенный пункт", type: "ed", txt: v.city},
					{id: "street", path: "o.street", synonym: "Улица, дом, корпус, литера, квартира", type: "ed", txt: v.street}
				]
			}, v), function(){
				wnd.elmnts.pgrid.enableAutoHeight(true);
				wnd.elmnts.pgrid.setInitWidthsP("40,60");
				wnd.elmnts.pgrid.setSizes();
				wnd.elmnts.pgrid.attachEvent("onPropertyChanged", pgrid_on_changed );

			}, "xml");
			wnd.elmnts.pgrid.get_cell_field = function () {
				return {
					obj: v,
					field: "delivery_area",
					on_select: pgrid_on_select,
					pwnd: wnd,
					meta: {
						"synonym": "Район",
						"tooltip": "Район (зона, направление) доставки для группировки при планировании и оптимизации маршрута геокодером",
						"choice_groups_elm": "elm",
						"type": {
							"types": [
								"cat.delivery_areas"
							],
							"is_ref": true
						}
					}};
			};

			wnd.elmnts.toolbar = wnd.attachToolbar({
				icons_path: dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix()
			});
			wnd.elmnts.toolbar.loadStruct('<toolbar><item id="btn_select" type="button" title="Установить адрес" text="&lt;b&gt;Выбрать&lt;/b&gt;" /></toolbar>',
				function(){
					this.attachEvent("onclick", toolbar_click);
				});


			wnd.elmnts.cell_map = wnd.elmnts.layout.cells('b');
			wnd.elmnts.cell_map.hideHeader();

			// если координаты есть в Расчете, используем их
			// если есть строка адреса, пытаемся геокодировать
			// если есть координаты $p.ipinfo, используем их
			// иначе - Москва
			var mapParams = {
				center: new google.maps.LatLng(v.latitude, v.longitude),
				zoom: v.street ? 15 : 12,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			wnd.elmnts.map = wnd.elmnts.cell_map.attachMap(mapParams);

			v.marker = new google.maps.Marker({
				map: wnd.elmnts.map,
				draggable: true,
				animation: google.maps.Animation.DROP,
				position: mapParams.center
			});
			google.maps.event.addListener(v.marker, 'click', marker_toggle_bounce);
			google.maps.event.addListener(v.marker, 'dragend', marker_dragend);

			refresh_grid();
		}

		/**
		 *	@desc: 	обработчик команд формы
		 *	@type:	private
		 *	@topic: 0
		 */
		function toolbar_click(btn_id){
			if(btn_id=="btn_select"){					// выполнить команду редактора построителя

				obj.delivery_area = v.delivery_area;

				assemble_address_fields();

				obj.coordinates = JSON.stringify([v.latitude, v.longitude]);

			}
			wnd.close();
		}

		/**
		 *	Обработчик выбора значения в свойствах (ссылочные типы)
		 */
		function pgrid_on_select(selv){

			if(selv===undefined)
				return;

			var old = _delivery_area, clear_street;

			if($p.is_data_obj(selv))
				_delivery_area = selv;
			else
				_delivery_area = $p.cat.delivery_areas.get(selv, false);

			clear_street = old != _delivery_area;

			if(!$p.is_data_obj(_delivery_area))
				_delivery_area = $p.cat.delivery_areas.get();

			wnd.elmnts.pgrid.cells().setValue(selv.presentation);
			delivery_area_changed(clear_street);
		}

		function delivery_area_changed(clear_street){
			// получим город и район из "района доставки"
			if(!v.delivery_area.empty() && clear_street )
				v.street = "";

			if(v.delivery_area.region){
				v.region = v.delivery_area.region;
				wnd.elmnts.pgrid.cells("region", 1).setValue(v.region);

			}else if(clear_street)
				v.region = "";

			if(v.delivery_area.city){
				v.city = v.delivery_area.city;
				wnd.elmnts.pgrid.cells("city", 1).setValue(v.city);

			}else if(clear_street)
				v.city = "";

			if(v.delivery_area.latitude && v.delivery_area.longitude){
				var LatLng = new google.maps.LatLng(v.delivery_area.latitude, v.delivery_area.longitude);
				wnd.elmnts.map.setCenter(LatLng);
				v.marker.setPosition(LatLng);
			}

			refresh_grid();
		}

		function refresh_grid(){
			wnd.elmnts.pgrid.cells("region", 1).setValue(v.region);
			wnd.elmnts.pgrid.cells("city", 1).setValue(v.city);
			wnd.elmnts.pgrid.cells("street", 1).setValue(v.street);
		}

		function addr_changed() {
			var zoom = v.street ? 15 : 12;

			if(wnd.elmnts.map.getZoom() != zoom)
				wnd.elmnts.map.setZoom(zoom);

			do_geocoding(function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					var loc = results[0].geometry.location;
					wnd.elmnts.map.setCenter(loc);
					v.marker.setPosition(loc);
					v.latitude = loc.lat();
					v.longitude = loc.lng();

					v.postal_code = $p.ipinfo.components({}, results[0].address_components).postal_code || "";
				}
			});
		}

		function assemble_addr(){
			return (v.street ? (v.street.replace(/,/g," ") + ", ") : "") +
				(v.city ? (v.city + ", ") : "") +
				(v.region ? (v.region + ", ") : "") + v.country +
				(v.postal_code ? (", " + v.postal_code) : "");
		}

		function assemble_address_fields(){

			obj.shipping_address = assemble_addr();

			var fields = '<КонтактнаяИнформация  \
				xmlns="http://www.v8.1c.ru/ssl/contactinfo" \
				xmlns:xs="http://www.w3.org/2001/XMLSchema" \
				xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"   \
				Представление="%1">   \
					<Комментарий/>  \
					<Состав xsi:type="Адрес" Страна="РОССИЯ">   \
						<Состав xsi:type="АдресРФ">'.replace('%1', obj.shipping_address);

			if(v.region)
				fields += '\n<СубъектРФ>' + v.region + '</СубъектРФ>';

			if(v.city){
				if(v.city.indexOf('г.') != -1 || v.city.indexOf('г ') != -1 || v.city.indexOf(' г') != -1)
					fields += '\n<Город>' + v.city + '</Город>';
				else
					fields += '\n<НаселПункт>' + v.city + '</НаселПункт>';
			}

			if(v.street){
				var street = (v.street.replace(/,/g," ")),
					suffix, index, house, bld, house_type, flat_type, bld_type;

				// отделяем улицу от дома, корпуса и квартиры
				for(var i in $p.fias){
					if($p.fias[i].type == 1){
						for(var j in $p.fias[i].syn){
							if((index = street.indexOf($p.fias[i].syn[j])) != -1){
								house_type = i;
								suffix = street.substr(index + $p.fias[i].syn[j].length).trim();
								street = street.substr(0, index).trim();
								break;
							}
						}
					}
					if(house_type)
						break;
				}
				if(!house_type){
					house_type = "1010";
					if((index = street.indexOf(" ")) != -1){
						suffix = street.substr(index);
						street = street.substr(0, index);
					}
				}
				fields += '\n<Улица>' + street.trim() + '</Улица>';

				// отделяем корпус и квартиру от дома
				if(suffix){

					house = suffix.toLowerCase();
					suffix = "";

					for(var i in $p.fias){
						if($p.fias[i].type == 3){
							for(var j in $p.fias[i].syn){
								if((index = house.indexOf($p.fias[i].syn[j])) != -1){
									flat_type = i;
									suffix = house.substr(index + $p.fias[i].syn[j].length);
									house = house.substr(0, index);
									break;
								}
							}
						}
						if(flat_type)
							break;
					}

					if(!flat_type){
						flat_type = "2010";
						if((index = house.indexOf(" ")) != -1){
							suffix = house.substr(index);
							house = house.substr(0, index);
						}
					}

					fields += '\n<ДопАдрЭл><Номер Тип="' + house_type +  '" Значение="' + house.trim() + '"/></ДопАдрЭл>';

				}

				if(suffix)
					fields += '\n<ДопАдрЭл><Номер Тип="' + flat_type +  '" Значение="' + suffix.trim() + '"/></ДопАдрЭл>';

			}

			if(v.postal_code)
				fields += '<ДопАдрЭл ТипАдрЭл="10100000" Значение="' + v.postal_code + '"/>';

			fields += '</Состав> \
					</Состав></КонтактнаяИнформация>';

			obj.address_fields = fields;
		}

		function process_address_fields(callback){

			if(obj.address_fields){
				v.xml = ( new DOMParser() ).parseFromString(obj.address_fields, "text/xml");
				var tmp = {}, res = {"building_room": ""}, tattr, building_room = [],
					nss = "СубъектРФ,Округ,СвРайМО,СвРайМО,ВнутригРайон,НаселПункт,Улица,Город,ДопАдрЭл,Адрес_по_документу,Местоположение".split(",");

				function get_aatributes(ca){
					if(ca.attributes && ca.attributes.length == 2){
						var res = {};
						res[ca.attributes[0].value] = ca.attributes[1].value;
						return res;
					}
				}

				for(var i in nss){
					tmp[nss[i]] = v.xml.getElementsByTagName(nss[i]);
				}
				for(var i in tmp){
					for(var j in tmp[i]){
						if(j == "length" || !tmp[i].hasOwnProperty(j))
							continue;
						if(tattr = get_aatributes(tmp[i][j])){
							if(!res[i])
								res[i] = [];
							res[i].push(tattr);
						}else if(tmp[i][j].childNodes.length){
							for(var k in tmp[i][j].childNodes){
								if(k == "length" || !tmp[i][j].childNodes.hasOwnProperty(k))
									continue;
								if(tattr = get_aatributes(tmp[i][j].childNodes[k])){
									if(!res[i])
										res[i] = [];
									res[i].push(tattr);
								}else if(tmp[i][j].childNodes[k].nodeValue){
									if(!res[i])
										res[i] = tmp[i][j].childNodes[k].nodeValue;
									else
										res[i] += " " + tmp[i][j].childNodes[k].nodeValue;
								}
							}
						}
					}
				}
				for(var i in res["ДопАдрЭл"]){

					for(var j in $p.fias){
						if(j.length != 4)
							continue;
						if(res["ДопАдрЭл"][i][j])
							building_room[$p.fias[j].type] = $p.fias[j].name + " " + res["ДопАдрЭл"][i][j];
					}

					if(res["ДопАдрЭл"][i]["10100000"])
						v.postal_code = res["ДопАдрЭл"][i]["10100000"];
				}

				v.address_fields = res;

				//
				v.region = res["СубъектРФ"] || res["Округ"] || "";
				v.city = res["Город"] || res["НаселПункт"] || "";
				v.street = (res["Улица"] || "");
				for(var i in building_room){
					v.street+= " " + building_room[i];
				}
			}

			// если есть координаты $p.ipinfo, используем их
			// иначе - Москва
			if(v.coordinates.length){
				// если координаты есть в Расчете, используем их
				v.latitude = v.coordinates[0];
				v.longitude = v.coordinates[1];
				callback();

			}else if(obj.shipping_address){
				// если есть строка адреса, пытаемся геокодировать
				do_geocoding(function (results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						v.latitude = results[0].geometry.location.lat();
						v.longitude = results[0].geometry.location.lng();
					}
					callback();
				});

			}else if($p.ipinfo.latitude && $p.ipinfo.longitude ){
				v.latitude = $p.ipinfo.latitude;
				v.longitude = $p.ipinfo.longitude;
				callback();
			}else{
				v.latitude = 55.635924;
				v.longitude = 37.6066379;
				callback();
				$p.msg.show_msg($p.msg.empty_geocoding);
			}

		}

		function do_geocoding(callback){
			var address = assemble_addr();

			$p.ipinfo.ggeocoder.geocode({ 'address': address}, callback);
		}

		function marker_toggle_bounce() {

			if (v.marker.getAnimation() != null) {
				v.marker.setAnimation(null);
			} else {
				v.marker.setAnimation(google.maps.Animation.BOUNCE);
				setTimeout(function(){v.marker.setAnimation(null)}, 1500);
			}
		}

		function marker_dragend(e) {
			$p.ipinfo.ggeocoder.geocode({'latLng': e.latLng}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[0]) {
						var addr = results[0];

						wnd.setText(addr.formatted_address);
						$p.ipinfo.components(v, addr.address_components);

						refresh_grid();

						var zoom = v.street ? 15 : 12;
						if(wnd.elmnts.map.getZoom() != zoom){
							wnd.elmnts.map.setZoom(zoom);
							wnd.elmnts.map.setCenter(e.latLng);
						}

						v.latitude = e.latLng.lat();
						v.longitude = e.latLng.lng();
					}
				}
			});
		}

		function pgrid_on_changed(pname, new_value, old_value){
			if(pname){
				if(v.delivery_area.empty()){
					new_value = old_value;
					$p.msg.show_msg({
						type: "alert",
						text: $p.msg.delivery_area_empty,
						title: $p.msg.addr_title});
					setTimeout(function(){
						wnd.elmnts.pgrid.selectRowById("delivery_area");
					}, 50);

				} else if(pname == "delivery_area")
					pgrid_on_select(new_value);
				else{
					v[wnd.elmnts.pgrid.getSelectedRowId()] = new_value;
					addr_changed();
				}
			}
		}

		function frm_close(win){
			source.grid.editStop();
			return !win.error;
		}

		return wnd;

	}

}
/**
 * Метаданные на стороне js: конструкторы, заполнение, кеширование, поиск
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 *
 * @module  metadata
 * @submodule meta_meta
 * @requires common
 */

/**
 * Проверяет, является ли значенние Data-объектным типом
 * @method is_data_obj
 * @for MetaEngine
 * @param v {*} - проверяемое значение
 * @return {Boolean} - true, если значение является ссылкой
 */
$p.is_data_obj = function(v){
	return v && v instanceof DataObj};

/**
 * приводит тип значения v к типу метаданных
 * @method fetch_type
 * @for MetaEngine
 * @param str {*} - значение (обычно, строка, полученная из html поля ввода)
 * @param mtype {Object} - поле type объекта метаданных (field.type)
 * @return {*}
 */
$p.fetch_type = function(str, mtype){
	var v = str;
	if(mtype.is_ref)
		v = $p.fix_guid(str);
	else if(mtype.date_part)
		v = $p.fix_date(str, true);
	else if(mtype["digits"])
		v = $p.fix_number(str, true);
	else if(mtype.types[0]=="boolean")
		v = $p.fix_boolean(str);
	return v;
};


/**
 * Сравнивает на равенство ссылочные типы и примитивные значения
 * @method is_equal
 * @for MetaEngine
 * @param v1 {DataObj|String}
 * @param v2 {DataObj|String}
 * @return {boolean} - true, если значенния эквивалентны
 */
$p.is_equal = function(v1, v2){

	if(v1 == v2)
		return true;
	else if(typeof v1 === typeof v2)
		return false;

	return ($p.fix_guid(v1, false) == $p.fix_guid(v2, false));
};

/**
 * Абстрактный поиск значения в коллекции
 * @method _find
 * @for MetaEngine
 * @param a {Array}
 * @param val {DataObj|String}
 * @return {*}
 * @private
 */
$p._find = function(a, val){
	//TODO переписать с учетом html5 свойств массивов
	var o, i, finded;
	if(typeof val != "object"){
		for(i in a){ // ищем по всем полям объекта
			o = a[i];
			for(var j in o){
				if(typeof o[j] !== "function" && $p.is_equal(o[j], val))
					return o;
			}
		}
	}else{
		for(i in a){ // ищем по ключам из val
			o = a[i];
			finded = true;
			for(var j in val){
				if(typeof o[j] !== "function" && !$p.is_equal(o[j], val[j])){
					finded = false;
					break;
				}
			}
			if(finded)
				return o;
		}
	}
};

/**
 * ### Поиск массива значений в коллекции
 * Кроме стандартного поиска по равенству значений,
 * поддержаны операторы `in`, `not` и `like` и фильтрация через внешнюю функцию
 * @method _find_rows
 * @for MetaEngine
 * @param arr {Array}
 * @param selection {Object|function} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"} или {not: значение}
 * @param callback {Function}
 * @return {Array}
 * @private
 */
$p._find_rows = function(arr, selection, callback){
	var ok, o, i, j, res = [], top, count = 0;

	if(selection){
		if(selection._top){
			top = selection._top;
			delete selection._top;
		}else
			top = 300;
	}

	for(i in arr){
		o = arr[i];
		ok = true;
		if(selection){
			if(typeof selection == "function")
				ok = selection(o);
			else
				for(j in selection){
					if(j.substr(0, 1) == "_")
						continue;

					else if(typeof selection[j] == "function"){
						ok = selection[j](o, j);
						if(!ok)
							break;

					}else if(j == "or" && Array.isArray(selection[j])){
						ok = selection[j].some(function (element) {
							var key = Object.keys(element)[0];
							if(element[key].hasOwnProperty("like"))
								return o[key].toLowerCase().indexOf(element[key].like.toLowerCase())!=-1;
							else
								return $p.is_equal(o[key], element[key]);
						});
						if(!ok)
							break;

					}else if(selection[j].hasOwnProperty("like")){
						if(o[j].toLowerCase().indexOf(selection[j].like.toLowerCase())==-1){
							ok = false;
							break;
						}
					}else if(selection[j].hasOwnProperty("not")){
						if($p.is_equal(o[j], selection[j].not)){
							ok = false;
							break;
						}

					}else if(selection[j].hasOwnProperty("in")){
						ok = selection[j].in.some(function(element) {
							return $p.is_equal(element, o[j]);
						});
						if(!ok)
							break;

					}else if(!$p.is_equal(o[j], selection[j])){
						ok = false;
						break;
					}
				}
		}

		// выполняем колбэк с элементом и пополняем итоговый массив
		if(ok){
			if(callback){
				if(callback.call(this, o) === false)
					break;
			}else
				res.push(o);

			// ограничиваем кол-во возвращаемых элементов
			if(top) {
				count++;
				if (count >= top)
					break;
			}
		}

	}
	return res;
};

/**
 * Абстрактный запрос к soap или базе WSQL
 * @param method
 * @param attr
 * @param async
 * @param callback
 * @private
 */
function _load(attr){

	var mgr = _md.mgr_by_class_name(attr.class_name), res_local;

	function get_tree(){

		if(mgr.cachable){
			return $p.wsql.promise(mgr.get_sql_struct(attr), [])
				.then($p.iface.data_to_tree);
		}
	}

	function get_selection(){

		if(mgr.cachable){

			return $p.wsql.promise(mgr.get_sql_struct(attr), [])
				.then(function(data){
					return $p.iface.data_to_grid.call(mgr, data, attr);
				});
		}
	}


	if(attr.action == "get_tree" && (res_local = get_tree()))
		return res_local;

	else if(attr.action == "get_selection" && (res_local = get_selection()))
		return res_local;

	else if($p.job_prm.offline)
		return Promise.reject(Error($p.msg.offline_request));

	attr.browser_uid = $p.wsql.get_user_param("browser_uid");

	return $p.ajax.post_ex($p.job_prm.hs_url(), JSON.stringify(attr), true)
		.then(function (req) {
			return req.response;
		});
}


/**
 * Коллекция менеджеров справочников
 * @property cat
 * @type Catalogs
 * @for MetaEngine
 * @static
 */
var _cat = $p.cat = new (
		/**
		 * ### Коллекция менеджеров справочников
		 * - Состав коллекции определяется метаданными используемой конфигурации
		 * - Тип элементов коллекции: {{#crossLink "CatManager"}}{{/crossLink}}
		 *
		 * @class Catalogs
		 * @static
		 */
		function Catalogs(){
			this.toString = function(){return $p.msg.meta_cat_mgr};
		}
	),

	/**
	 * Коллекция менеджеров перечислений
	 * @property enm
	 * @type Enumerations
	 * @for MetaEngine
	 * @static
	 */
	_enm = $p.enm = new (
		/**
		 * ### Коллекция менеджеров перечислений
		 * - Состав коллекции определяется метаданными используемой конфигурации
		 * - Тип элементов коллекции: {{#crossLink "EnumManager"}}{{/crossLink}}
		 *
		 * @class Enumerations
		 * @static
		 */
		function Enumerations(){
			this.toString = function(){return $p.msg.meta_enn_mgr};
	}),

	/**
	 * Коллекция менеджеров документов
	 * @property doc
	 * @type Documents
	 * @for MetaEngine
	 * @static
	 */
	_doc = $p.doc = new (
		/**
		 * ### Коллекция менеджеров документов
		 * - Состав коллекции определяется метаданными используемой конфигурации
		 * - Тип элементов коллекции: {{#crossLink "DocManager"}}{{/crossLink}}
		 *
		 * @class Documents
		 * @static
		 */
		function Documents(){
			this.toString = function(){return $p.msg.meta_doc_mgr};
	}),

	/**
	 * Коллекция менеджеров регистров сведений
	 * @property ireg
	 * @type InfoRegs
	 * @for MetaEngine
	 * @static
	 */
	_ireg = $p.ireg = new (
		/**
		 * ### Коллекция менеджеров регистров сведений
		 * - Состав коллекции определяется метаданными используемой конфигурации
		 * - Тип элементов коллекции: {{#crossLink "InfoRegManager"}}{{/crossLink}}
		 *
		 * @class InfoRegs
		 * @static
		 */
		function InfoRegs(){
			this.toString = function(){return $p.msg.meta_ireg_mgr};
	}),

	/**
	 * Коллекция менеджеров регистров накопления
	 * @property areg
	 * @type AccumRegs
	 * @for MetaEngine
	 * @static
	 */
	_areg = $p.areg = new (
		/**
		 * ### Коллекция менеджеров регистров накопления
		 * - Состав коллекции определяется метаданными используемой конфигурации
		 * - Тип элементов коллекции: {{#crossLink "RegisterManager"}}{{/crossLink}}
		 *
		 * @class AccumRegs
		 * @static
		 */
		function AccumRegs(){
			this.toString = function(){return $p.msg.meta_areg_mgr};
	}),

	/**
	 * Коллекция менеджеров регистров бухгалтерии
	 * @property aссreg
	 * @type AccountsRegs
	 * @for MetaEngine
	 * @static
	 */
	_aссreg = $p.aссreg = new (
		/**
		 * ### Коллекция менеджеров регистров бухгалтерии
		 * - Состав коллекции определяется метаданными используемой конфигурации
		 * - Тип элементов коллекции: {{#crossLink "RegisterManager"}}{{/crossLink}}
		 *
		 * @class AccountsRegs
		 * @static
		 */
			function AccountsRegs(){
			this.toString = function(){return $p.msg.meta_accreg_mgr};
		}),

	/**
	 * Коллекция менеджеров обработок
	 * @property dp
	 * @type DataProcessors
	 * @for MetaEngine
	 * @static
	 */
	_dp	= $p.dp = new (
		/**
		 * ### Коллекция менеджеров обработок
		 * - Состав коллекции определяется метаданными используемой конфигурации
		 * - Тип элементов коллекции: {{#crossLink "DataProcessorsManager"}}{{/crossLink}}
		 *
		 * @class DataProcessors
		 * @static
		 */
		function DataProcessors(){
			this.toString = function(){return $p.msg.meta_dp_mgr};
	}),

	/**
	 * Коллекция менеджеров отчетов
	 * @property rep
	 * @type Reports
	 * @for MetaEngine
	 * @static
	 */
	_rep = $p.rep = new (
		/**
		 * ### Коллекция менеджеров отчетов
		 * - Состав коллекции определяется метаданными используемой конфигурации
		 * - Тип элементов коллекции: {{#crossLink "DataProcessorsManager"}}{{/crossLink}}
		 *
		 * @class Reports
		 * @static
		 */
		function Reports(){
			this.toString = function(){return $p.msg.meta_reports_mgr};
	}),

	/**
	 * Коллекция менеджеров планов счетов
	 * @property cacc
	 * @type ChartsOfAccounts
	 * @for MetaEngine
	 * @static
	 */
	_cacc = $p.cacc = new (

		/**
		 * ### Коллекция менеджеров планов счетов
		 * - Состав коллекции определяется метаданными используемой конфигурации
		 * - Тип элементов коллекции: {{#crossLink "ChartOfAccountManager"}}{{/crossLink}}
		 *
		 * @class ChartsOfAccounts
		 * @static
		 */
			function ChartsOfAccounts(){
			this.toString = function(){return $p.msg.meta_charts_of_accounts_mgr};
		}),

	/**
	 * Коллекция менеджеров планов видов характеристик
	 * @property cch
	 * @type ChartsOfCharacteristics
	 * @for MetaEngine
	 * @static
	 */
	_cch = $p.cch = new (

		/**
		 * ### Коллекция менеджеров планов видов характеристик
		 * - Состав коллекции определяется метаданными используемой конфигурации
		 * - Тип элементов коллекции: {{#crossLink "ChartOfCharacteristicManager"}}{{/crossLink}}
		 *
		 * @class ChartsOfCharacteristics
		 * @static
		 */
			function ChartsOfCharacteristics(){
			this.toString = function(){return $p.msg.meta_charts_of_characteristic_mgr};
		}),

	/**
	 * Mетаданные конфигурации
	 */
	_md;


// КОНСТРУКТОРЫ - полная абстракция

/**
 * ### Хранилище метаданных конфигурации
 * Загружает описание из файлов на сервере, объекта или json-строки. В оффлайне используется локальный кеш
 *
 * @class Meta
 * @constructor
 * @param req {XMLHttpRequest|Object|String} - с основными метаданными
 * @param patch {XMLHttpRequest} - с дополнительными метаданными
 *
 * @example
 *    new $p.Meta('meta');
 */
function Meta(req, patch) {

	var m = (req && req.response) ? JSON.parse(req.response) : req,
		class_name;

	// Экспортируем ссылку на себя
	_md = $p.md = this;

	if(patch)
		Meta._patch(m, patch.response ? JSON.parse(patch.response) : patch);

	req = null;
	if(typeof window != "undefined"){
		patch = $p.injected_data['log.json'];
		Meta._patch(m, patch);
		patch = null;
	}

	/**
	 * Возвращает описание объекта метаданных
	 * @method get
	 * @param class_name {String} - например, "doc.calc_order"
	 * @param [field_name] {String}
	 * @return {Object}
	 */
	_md.get = function(class_name, field_name){
		var np = class_name.split("."),
			res = {multiline_mode: false, note: "", synonym: "", tooltip: "", type: {is_ref: false,	types: ["string"]}};
		if(!field_name)
			return m[np[0]][np[1]];
		if(np[0]=="doc" && field_name=="number_doc"){
			res.synonym = "Номер";
			res.tooltip = "Номер документа";
			res.type.str_len = 11;
		}else if(np[0]=="doc" && field_name=="date"){
			res.synonym = "Дата";
			res.tooltip = "Дата документа";
			res.type.date_part = "date_time";
			res.type.types[0] = "date";
		}else if(np[0]=="doc" && field_name=="posted"){
			res.synonym = "Проведен";
			res.type.types[0] = "boolean";
		}else if(np[0]=="cat" && field_name=="id"){
			res.synonym = "Код";
		}else if(np[0]=="cat" && field_name=="name"){
			res.synonym = "Наименование";
		}else if(field_name=="deleted"){
			res.synonym = "Пометка удаления";
			res.type.types[0] = "boolean";
		}else if(field_name=="is_folder"){
			res.synonym = "Это группа";
			res.type.types[0] = "boolean";
		}else if(field_name=="lc_changed"){
			res.synonym = "Изменено в 1С";
			res.tooltip = "Время записи в 1С";
			res.type.types[0] = "number";
			res.type.digits = 15;
			res.type.fraction_figits = 0;
		}else if(field_name=="ref"){
			res.synonym = "Ссылка";
			res.type.is_ref = true;
			res.type.types[0] = class_name;
		}else if(field_name)
			res = m[np[0]][np[1]].fields[field_name];
		else
			res = m[np[0]][np[1]];
		return res;
	};

	/**
	 * Возвращает структуру метаданных конфигурации
	 * @method get_classes
	 */
	_md.get_classes = function () {
		var res = {};
		for(var i in m){
			res[i] = [];
			for(var j in m[i])
				res[i].push(j);
		}
		return res;
	};

	/**
	 * Создаёт таблицы WSQL для всех объектов метаданных
	 * @method create_tables
	 * @return {Promise.<T>}
	 * @async
	 */
	_md.create_tables = function(callback, attr){

		var cstep = 0, data_names = [], managers = _md.get_classes(), class_name,
			create = (attr && attr.postgres) ? "" : "USE md;\n";

		function on_table_created(data){

			if(typeof data === "number"){
				cstep--;
				if(cstep==0){
					if(callback)
						setTimeout(function () {
							callback(create);
						}, 10);
					else
						alasql.utils.saveFile("create_tables.sql", create);
				} else
					iteration();
			}else if(data && data.hasOwnProperty("message")){
				if($p.iface && $p.iface.docs){
					$p.iface.docs.progressOff();
					$p.msg.show_msg({
						title: $p.msg.error_critical,
						type: "alert-error",
						text: data.message
					});
				}
			}
		}

		// TODO переписать на промисах и генераторах и перекинуть в синкер

		for(class_name in managers.cat)
			data_names.push({"class": _cat, "name": managers.cat[class_name]});
		cstep = data_names.length;

		for(class_name in managers.ireg){
			data_names.push({"class": _ireg, "name": managers.ireg[class_name]});
			cstep++;
		}

		for(class_name in managers.doc){
			data_names.push({"class": _doc, "name": managers.doc[class_name]});
			cstep++;
		}

		for(class_name in managers.enm){
			data_names.push({"class": _enm, "name": managers.enm[class_name]});
			cstep++;
		}

		for(class_name in managers.cch){
			data_names.push({"class": _cch, "name": managers.cch[class_name]});
			cstep++;
		}

		for(class_name in managers.cacc){
			data_names.push({"class": _cacc, "name": managers.cacc[class_name]});
			cstep++;
		}

		function iteration(){
			var data = data_names[cstep-1];
			create += data["class"][data.name].get_sql_struct(attr) + ";\n";
			on_table_created(1);
		}

		iteration();

	};

	/**
	 * Возвращает тип поля sql для типа данных
	 * @method sql_type
	 * @param mgr {DataManager}
	 * @param f {String}
	 * @param mf {Object} - описание метаданных поля
	 * @param pg {Boolean} - использовать синтаксис postgreSQL
	 * @return {*}
	 */
	_md.sql_type = function (mgr, f, mf, pg) {
		var sql;
		if((f == "type" && mgr.table_name == "cch_properties") || (f == "svg" && mgr.table_name == "cat_production_params"))
			sql = " JSON";

		else if(mf.is_ref || mf.types.indexOf("guid") != -1){
			if(!pg)
				sql = " CHAR";

			else if(mf.types.every(function(v){return v.indexOf("enm.") == 0}))
				sql = " character varying(100)";

			else if (!mf.hasOwnProperty("str_len"))
				sql = " uuid";

			else
				sql = " character varying(" + Math.max(36, mf.str_len) + ")";

		}else if(mf.hasOwnProperty("str_len"))
			sql = pg ? (mf.str_len ? " character varying(" + mf.str_len + ")" : " text") : " CHAR";

		else if(mf.date_part)
			if(!pg || mf.date_part == "date")
				sql = " Date";

			else if(mf.date_part == "date_time")
				sql = " timestamp with time zone";

			else
				sql = " time without time zone";

		else if(mf.hasOwnProperty("digits")){
			if(mf.fraction_figits==0)
				sql = pg ? (mf.digits < 7 ? " integer" : " bigint") : " INT";
			else
				sql = pg ? (" numeric(" + mf.digits + "," + mf.fraction_figits + ")") : " FLOAT";

		}else if(mf.types.indexOf("boolean") != -1)
			sql = " BOOLEAN";

		else if(mf.types.indexOf("json") != -1)
			sql = " JSON";

		else
			sql = pg ? " character varying(255)" : " CHAR";

		return sql;
	};

	/**
	 * Для полей составного типа, добавляет в sql поле описания типа
	 * @param mf
	 * @param f
	 * @param pg
	 * @return {string}
	 */
	_md.sql_composite = function (mf, f, f0, pg){
		var res = "";
		if(mf[f].type.types.length > 1 && f != "type"){
			if(!f0)
				f0 = f.substr(0, 29) + "_T";
			else{
				f0 = f0.substr(0, 29) + "_T";
			}

			if(pg)
				res = ', "' + f0 + '" character varying(255)';
			else
				res = _md.sql_mask(f0) + " CHAR";
		}
		return res;
	}

	/**
	 * Заключает имя поля в аппострофы
	 * @method sql_mask
	 * @param f
	 * @param t
	 * @return {string}
	 */
	_md.sql_mask = function(f, t){
		//var mask_names = ["delete", "set", "value", "json", "primary", "content"];
		return ", " + (t ? "_t_." : "") + ("`" + f + "`");
	};

	/**
	 * Возвращает менеджер объекта по имени класса
	 * @method mgr_by_class_name
	 * @param class_name {String}
	 * @return {DataManager|undefined}
	 * @private
	 */
	_md.mgr_by_class_name = function(class_name){
		if(class_name){
			var np = class_name.split(".");
			if(np[1] && $p[np[0]])
				return $p[np[0]][np[1]];
		}
	};

	/**
	 * Возвращает менеджер значения по свойству строки
	 * @method value_mgr
	 * @param row {Object|TabularSectionRow} - строка табчасти или объект
	 * @param f {String} - имя поля
	 * @param mf {Object} - метаданные поля
	 * @param array_enabled {Boolean} - возвращать массив для полей составного типа или первый доступный тип
	 * @param v {*} - устанавливаемое значение
	 * @return {DataManager|Array}
	 */
	_md.value_mgr = function(row, f, mf, array_enabled, v){
		var property, oproperty, tnames, rt, mgr;
		if(mf._mgr)
			return mf._mgr;

		function mf_mgr(mgr){
			if(mgr && mf.types.length == 1)
				mf._mgr = mgr;
			return mgr;
		}

		if(mf.types.length == 1){
			tnames = mf.types[0].split(".");
			if(tnames.length > 1 && $p[tnames[0]])
				return mf_mgr($p[tnames[0]][tnames[1]]);
		}else if(v && v.type){
			tnames = v.type.split(".");
			if(tnames.length > 1 && $p[tnames[0]])
				return mf_mgr($p[tnames[0]][tnames[1]]);
		}

		property = row.property || row.param;
		if(f != "value" || !property){
			rt = [];
			mf.types.forEach(function(v){
				tnames = v.split(".");
				if(tnames.length > 1 && $p[tnames[0]][tnames[1]])
					rt.push($p[tnames[0]][tnames[1]]);
			});
			if(rt.length == 1)
				return mf_mgr(rt[0]);

			else if(array_enabled)
				return rt;

			else if((property = row[f]) instanceof DataObj)
				return property._manager;

			else if($p.is_guid(property) && property != $p.blank.guid){
				for(var i in rt){
					mgr = rt[i];
					if(mgr.get(property, false, true))
						return mgr;
				}
			}
		}else{

			// Получаем объект свойства
			oproperty = _cch.properties.get(property, false);
			if($p.is_data_obj(oproperty)){

				if(oproperty.is_new())
					return _cat.property_values;

				// и через его тип выходми на мнеджера значения
				for(rt in oproperty.type.types)
					if(oproperty.type.types[rt].indexOf(".") > -1){
						tnames = oproperty.type.types[rt].split(".");
						break;
					}
				if(tnames && tnames.length > 1 && $p[tnames[0]])
					return mf_mgr($p[tnames[0]][tnames[1]]);
				else
					return oproperty.type;
			}
		}
	};

	/**
	 * Возвращает имя типа элемента управления для типа поля
	 * @method control_by_type
	 * @param type
	 * @return {*}
	 */
	_md.control_by_type = function (type) {
		var ft;
		if(type.is_ref){
			if(type.types.join().indexOf("enm.")==-1)
				ft = "ocombo";//ft = "ref"; //
			else
				ft = "refc";
		} else if(type.date_part) {
			ft = "dhxCalendar";
		} else if(type["digits"]) {
			if(type.fraction_figits < 5)
				ft = "calck";
			else
				ft = "edn";
		} else if(type.types[0]=="boolean") {
			ft = "ch";
		} else if(type.hasOwnProperty("str_len") && (type.str_len >= 100 || type.str_len == 0)) {
			ft = "txt";
		} else {
			ft = "ed";
		}
		return ft;
	};

	/**
	 * Возвращает структуру для инициализации таблицы на форме
	 * @method ts_captions
	 * @param class_name
	 * @param ts_name
	 * @param source
	 * @return {boolean}
	 */
	_md.ts_captions = function (class_name, ts_name, source) {
		if(!source)
			source = {};

		var mts = _md.get(class_name).tabular_sections[ts_name],
			mfrm = _md.get(class_name).form,
			fields = mts.fields, mf;

		// если имеются метаданные формы, используем их
		if(mfrm && mfrm.obj){

			if(!mfrm.obj.tabular_sections[ts_name])
				return;

			source._mixin(mfrm.obj.tabular_sections[ts_name]);

		}else{

			if(ts_name==="contact_information")
				fields = {type: "", kind: "", presentation: ""};

			source.fields = ["row"];
			source.headers = "№";
			source.widths = "40";
			source.min_widths = "";
			source.aligns = "";
			source.sortings = "na";
			source.types = "cntr";

			for(var f in fields){
				mf = mts.fields[f];
				if(!mf.hide){
					source.fields.push(f);
					source.headers += "," + (mf.synonym ? mf.synonym.replace(/,/g, " ") : f);
					source.types += "," + _md.control_by_type(mf.type);
					source.sortings += ",na";
				}
			}
		}

		return true;

	};

	_md.syns_js = function (v) {
		var synJS = {
			DeletionMark: 'deleted',
			Description: 'name',
			DataVersion: 'data_version',
			IsFolder: 'is_folder',
			Number: 'number_doc',
			Date: 'date',
			Дата: 'date',
			Posted: 'posted',
			Code: 'id',
			Parent_Key: 'parent',
			Owner_Key: 'owner',
			Owner:     'owner',
			Ref_Key: 'ref',
			"Ссылка": 'ref',
			LineNumber: 'row'
		};
		if(synJS[v])
			return synJS[v];
		return m.syns_js[m.syns_1с.indexOf(v)] || v;
	};

	_md.syns_1с = function (v) {
		var syn1c = {
			deleted: 'DeletionMark',
			name: 'Description',
			data_version: 'DataVersion',
			is_folder: 'IsFolder',
			number_doc: 'Number',
			date: 'Date',
			posted: 'Posted',
			id: 'Code',
			ref: 'Ref_Key',
			parent: 'Parent_Key',
			owner: 'Owner_Key',
			row: 'LineNumber'
		};
		if(syn1c[v])
			return syn1c[v];
		return m.syns_1с[m.syns_js.indexOf(v)] || v;
	};

	_md.printing_plates = function (pp) {
		if(pp)
			for(var i in pp.doc)
				m.doc[i].printing_plates = pp.doc[i];

	};

	/**
	 * Возвращает имя класса по полному имени объекта метаданных 1С
	 * @method class_name_from_1c
	 * @param name
	 */
	_md.class_name_from_1c = function (name) {

		var pn = name.split(".");
		if(pn.length == 1)
			return "enm." + name;
		else if(pn[0] == "Перечисление")
			name = "enm.";
		else if(pn[0] == "Справочник")
			name = "cat.";
		else if(pn[0] == "Документ")
			name = "doc.";
		else if(pn[0] == "РегистрСведений")
			name = "ireg.";
		else if(pn[0] == "РегистрНакопления")
			name = "areg.";
		else if(pn[0] == "РегистрБухгалтерии")
			name = "aссreg.";
		else if(pn[0] == "ПланВидовХарактеристик")
			name = "cch.";
		else if(pn[0] == "ПланСчетов")
			name = "cacc.";
		else if(pn[0] == "Обработка")
			name = "dp.";
		else if(pn[0] == "Отчет")
			name = "rep.";

		return name + pn[1];

	};

	/**
	 * Возвращает полное именя объекта метаданных 1С по имени класса metadata
	 * @method class_name_to_1c
	 * @param name
	 */
	_md.class_name_to_1c = function (name) {

		var pn = name.split(".");
		if(pn.length == 1)
			return "Перечисление." + name;
		else if(pn[0] == "enm")
			name = "Перечисление.";
		else if(pn[0] == "cat")
			name = "Справочник.";
		else if(pn[0] == "doc")
			name = "Документ.";
		else if(pn[0] == "ireg")
			name = "РегистрСведений.";
		else if(pn[0] == "areg")
			name = "РегистрНакопления.";
		else if(pn[0] == "aссreg")
			name = "РегистрБухгалтерии.";
		else if(pn[0] == "cch")
			name = "ПланВидовХарактеристик.";
		else if(pn[0] == "cacc")
			name = "ПланСчетов.";
		else if(pn[0] == "dp")
			name = "Обработка.";
		else if(pn[0] == "rep")
			name = "Отчет.";

		return name + pn[1];

	};

	_md.dates = function () {
		return {
			md_date: m["md_date"],
			cat_date: m["cat_date"]
		};
	}

	// создаём объекты менеджеров

	for(class_name in m.enm)
		_enm[class_name] = new EnumManager(m.enm[class_name], "enm."+class_name);

	for(class_name in m.cat){
		_cat[class_name] = new CatManager("cat."+class_name);
	}

	for(class_name in m.doc){
		_doc[class_name] = new DocManager("doc."+class_name);
	}

	for(class_name in m.ireg){
		if(class_name == "$log")
			_ireg[class_name] = new LogManager("ireg."+class_name);
		else
			_ireg[class_name] = new InfoRegManager("ireg."+class_name);
	}

	for(class_name in m.dp)
		_dp[class_name] = new DataProcessorsManager("dp."+class_name);

	for(class_name in m.cch)
		_cch[class_name] = new ChartOfCharacteristicManager("cch."+class_name);

	for(class_name in m.cacc)
		_cacc[class_name] = new ChartOfAccountManager("cacc."+class_name);

	// загружаем модификаторы и прочие зависимости
	$p.modifiers.execute($p);

	// широковещательное оповещение о готовности метаданных
	$p.eve.callEvent("meta");

}
$p.Meta = Meta;

/**
 * Подмешивает свойства с иерархией объекта patch в объект obj
 * @param obj
 * @param patch
 * @private
 */
Meta._patch = function(obj, patch){
	for(var area in patch){

		if(typeof patch[area] == "object"){
			if(obj[area])
				Meta._patch(obj[area], patch[area]);
			else
				obj[area] = patch[area];
		}else
			obj[area] = patch[area];

		//for(var c in patch[area]){
		//	if(!obj[area][c])
		//		obj[area][c] = {};
		//	for(var f in patch[area][c]){
		//		if(!obj[area][c][f])
		//			obj[area][c][f] = patch[area][c][f];
		//		else if(typeof obj[area][c][f] == "object")
		//			obj[area][c][f]._mixin(patch[area][c][f]);
		//	}
		//}
	}
}

/**
 * Инициализирует метаданные из встроенных данных, внешних файлов или indexeddb
 * @return {Promise}
 * @private
 */
Meta.init_meta = function (forse) {

	return new Promise(function(resolve, reject){

		if($p.injected_data['meta.json'])
			resolve(new Meta($p.injected_data['meta.json'], $p.injected_data['meta_patch.json']));

		else if($p.injected_data['meta_patch.json'])
			resolve(new Meta($p.injected_data['meta_patch.json']));

		else{

			// проверим indexeddb
			$p.wsql.idx_connect(null, 'meta')
				.then(function (db) {
					var mreq, mpatch;
					$p.wsql.idx_get('meta', db, 'meta')
						.then(function (data) {
							if(data && !forse){
								mreq = data;
								$p.wsql.idx_get('meta_patch', db, 'meta')
									.then(function (data) {
										resolve(new Meta(mreq, data));
									});
							}
							else{
								if(!$p.job_prm.files_date)
									$p.eve.update_files_version()
										.then(function () {
											from_files(db);
										});
								else
									from_files(db);
							}
						});
				});


			// в indexeddb не нашлось - грузим из файла
			function from_files(db){

				var parts = [
					$p.ajax.get($p.job_prm.data_url + "meta.json?v="+$p.job_prm.files_date),
					$p.ajax.get($p.job_prm.data_url + "meta_patch.json?v="+$p.job_prm.files_date)
				], mreq, mpatch;


				// читаем файл метаданных и файл патча метаданных
				$p.eve.reduce_promices(parts, function (req) {
						if(req instanceof XMLHttpRequest && req.status == 200){
							if(req.responseURL.indexOf("meta.json") != -1){
								mreq = JSON.parse(req.response);

							}else if(req.responseURL.indexOf("meta_patch.json") != -1)
								mpatch = JSON.parse(req.response);
						}else{
							$p.record_log(req);
						}
					})
					// создаём объект Meta() описания метаданных
					.then(function () {
						if(!mreq)
							reject(new Error("Ошибка чтения файла метаданных"));
						else{
							mreq.ref = "meta";
							$p.wsql.idx_save(mreq, db, 'meta')
								.then(function () {
									mpatch.ref = "meta_patch";
									$p.wsql.idx_save(mpatch, db, 'meta');
								})
								.then(function () {
									resolve(new Meta(mreq, mpatch));
								});
						}
					})
			}
		}

	});
}

Meta.init_static = function (forse) {

	return new Promise(function(resolve, reject){

		// проверим indexeddb
		$p.wsql.idx_connect(null, 'static')
			.then(function (db) {
				var mreq, mpatch;
				$p.wsql.idx_get('p0', db, 'static')
					.then(function (data) {

					});
			});

	});
}

/**
 * Запись журнала регистрации
 * @param err
 */
$p.record_log = function (err) {
	if($p.ireg && $p.ireg.$log)
		$p.ireg.$log.record(err);
	else
		console.log(err);
};

/**
 * Загрузка данных в grid
 * @method load_soap_to_grid
 * @for Catalogs
 * @param attr {Object} - объект с параметрами запроса SOAP
 * @param grid {dhtmlxGrid}
 * @param callback {Function}
 */
_cat.load_soap_to_grid = function(attr, grid, callback){

	function cb_callBack(res){
		if(res.substr(0,1) == "{")
			res = JSON.parse(res);

		if(typeof res == "string")
		// загружаем строку в грид
			grid.parse(res, function(){
				if(callback)
					callback(res);
			}, "xml");

		else if(callback)
			callback(res);
	}

	grid.xmlFileUrl = "exec";


	var mgr = _md.mgr_by_class_name(attr.class_name);

	if(!mgr.cachable && ($p.job_prm.rest || $p.job_prm.irest_enabled || attr.rest))
		mgr.rest_selection(attr)
			.then(cb_callBack)
			.catch($p.record_log);
	else
		_load(attr)
			.then(cb_callBack)
			.catch($p.record_log);

};
/**
 * Конструкторы менеджеров данных
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 *
 * @module  metadata
 * @submodule meta_mngrs
 * @requires common
 */



/**
 * ### Абстрактный менеджер данных
 * Не используется для создания прикладных объектов, но является базовым классом,
 * от которого унаследованы менеджеры как ссылочных данных, так и объектов с суррогратным ключом и несохраняемых обработок
 *
 * @class DataManager
 * @constructor
 * @param class_name {string} - имя типа менеджера объекта. например, "doc.calc_order"
 */
function DataManager(class_name){

	var _metadata = _md.get(class_name),
		_cachable,
		_async_write = _metadata.async_write,
		_events = {
			after_create: [],
			after_load: [],
			before_save: [],
			after_save: [],
			value_change: []
		};

	// перечисления кешируются всегда
	if(class_name.indexOf("enm.") != -1)
		_cachable = true;

	// если offline, все объекты кешируем
	else if($p.job_prm.offline)
		_cachable = true;

	// документы, отчеты и обработки по умолчанию не кешируем
	else if(class_name.indexOf("doc.") != -1 || class_name.indexOf("dp.") != -1 || class_name.indexOf("rep.") != -1)
		_cachable = false;

	// остальные классы по умолчанию кешируем
	else
		_cachable = true;

	// Если в метаданных явно указано правило кеширования, используем его
	if(!$p.job_prm.offline && _metadata.cachable != undefined)
		_cachable = _metadata.cachable != "НеКешировать";

	this.__define({

			/**
			 * Выполняет две функции:
			 * - Указывает, нужно ли сохранять (искать) объекты в локальном кеше или сразу топать на сервер
			 * - Указывает, нужно ли запоминать представления ссылок (инверсно).
			 * Для кешируемых, представления ссылок запоминать необязательно, т.к. его быстрее вычислить по месту
			 * @property cachable
			 * @for DataManager
			 * @type Boolean
			 */
			"cachable": {
				value: _cachable,
				writable: true,
				enumerable: false
			},

			/**
			 * Указывает на возможность асинхронной записи элементов данного объекта
			 * - Если online, сразу выполняем запрос к серверу
			 * - Если offline и асинхронная запись разрешена, записываем в кеш и отправляем на сервер при первой возможности
			 * - Если offline и асинхронная запись запрещена - генерируем ошибку
			 * @property async_write
			 * @for DataManager
			 * @type Boolean
			 */
			"async_write": {
				value: _async_write,
				writable: false,
				enumerable: false
			},

			/**
			 * Имя типа объектов этого менеджера
			 * @property class_name
			 * @for DataManager
			 * @type String
			 * @final
			 */
			"class_name": {
				value: class_name,
				writable: false,
				enumerable: false
			},

			/**
			 * Указатель на массив, сопоставленный с таблицей локальной базы данных
			 * Фактически - хранилище объектов данного класса
			 * @property alatable
			 * @for DataManager
			 * @type Array
			 * @final
			 */
			"alatable": {
				get : function () {
					return $p.wsql.aladb.tables[this.table_name] ? $p.wsql.aladb.tables[this.table_name].data : []
				},
				enumerable : false
			},

			/**
			 * Метаданные объекта (указатель на фрагмент глобальных метаданных, относящмйся к текущему объекту)
			 * @method metadata
			 * @for DataManager
			 * @return {Object} - объект метаданных
			 */
			"metadata": {
				value: function(field){
					if(field)
						return _metadata.fields[field] || _metadata.tabular_sections[field];
					else
						return _metadata;
				},
				enumerable: false
			},

			/**
			 * Добавляет подписку на события объектов данного менеджера
			 * @method attache_event
			 * @for DataManager
			 * @param name {String} - имя события
			 * @param method {Function} - добавляемый метод
			 * @param [first] {Boolean} - добавлять метод в начало, а не в конец коллекции
			 */
			"attache_event": {
				value: function (name, method, first) {
					if(first)
						_events[name].push(method);
					else
						_events[name].push(method);
				},
				enumerable: false
			},

			/**
			 * Выполняет методы подписки на событие
			 * @method handle_event
			 * @for DataManager
			 * @param obj {DataObj} - объект, в котором произошло событие
			 * @param name {String} - имя события
			 * @param attr {Object} - дополнительные свойства, передаваемые в обработчик события
			 * @return {Boolesn}
			 */
			"handle_event": {
				value: function (obj, name, attr) {
					var res = [], tmp;
					_events[name].forEach(function (method) {
						if(res !== false){
							tmp = method.call(obj, attr);
							if(tmp === false)
								res = tmp;
							else if(tmp)
								res.push(tmp);
						}
					});
					if(!res.length)
						return;
					else if(res.length == 1)
					// если значение единственное - возвращчем его
						return res[0];
					else{
					// если среди значений есть промисы - возвращаем all
						if(res.some(function (v) {return typeof v === "object" && v.then}))
							return Promise.all(res);
						else
							return res;
					}
				},
				enumerable: false
			}

		}
	);

	//	Создаём функции конструкторов экземпляров объектов и строк табличных частей
	var _obj_сonstructor = this._obj_сonstructor || DataObj;		// ссылка на конструктор элементов

	// Для всех типов, кроме перечислений, создаём через (new Function) конструктор объекта
	if(!(this instanceof EnumManager)){

		var obj_сonstructor_name = class_name.split(".")[1];
		this._obj_сonstructor = eval("(function " + obj_сonstructor_name.charAt(0).toUpperCase() + obj_сonstructor_name.substr(1) +
			"(attr, manager){manager._obj_сonstructor.superclass.constructor.call(this, attr, manager)})");
		this._obj_сonstructor._extend(_obj_сonstructor);

		if(this instanceof InfoRegManager){

			delete this._obj_сonstructor.prototype.deleted;
			delete this._obj_сonstructor.prototype.ref;
			delete this._obj_сonstructor.prototype.lc_changed;

			// реквизиты по метаданным
			for(var f in this.metadata().dimensions){
				this._obj_сonstructor.prototype.__define(f, {
					get : new Function("return this._getter('"+f+"')"),
					set : new Function("v", "this._setter('"+f+"',v)"),
					enumerable : true
				});
			}
			for(var f in this.metadata().resources){
				this._obj_сonstructor.prototype.__define(f, {
					get : new Function("return this._getter('"+f+"')"),
					set : new Function("v", "this._setter('"+f+"',v)"),
					enumerable : true
				});
			}

		}else{

			this._ts_сonstructors = {};             // ссылки на конструкторы строк табчастей

			// реквизиты по метаданным
			for(var f in this.metadata().fields){
				this._obj_сonstructor.prototype.__define(f, {
					get : new Function("return this._getter('"+f+"')"),
					set : new Function("v", "this._setter('"+f+"',v)"),
					enumerable : true
				});
			}

			// табличные части по метаданным
			for(var f in this.metadata().tabular_sections){

				// создаём конструктор строки табчасти
				var row_сonstructor_name = obj_сonstructor_name.charAt(0).toUpperCase() + obj_сonstructor_name.substr(1) + f.charAt(0).toUpperCase() + f.substr(1) + "Row";

				this._ts_сonstructors[f] = eval("(function " + row_сonstructor_name + "(owner) \
			{owner._owner._manager._ts_сonstructors[owner._name].superclass.constructor.call(this, owner)})");
				this._ts_сonstructors[f]._extend(TabularSectionRow);

				// в прототипе строки табчасти создаём свойства в соответствии с полями табчасти
				for(var rf in this.metadata().tabular_sections[f].fields){
					this._ts_сonstructors[f].prototype.__define(rf, {
						get : new Function("return this._getter('"+rf+"')"),
						set : new Function("v", "this._setter('"+rf+"',v)"),
						enumerable : true
					});
				}

				// устанавливаем геттер и сеттер для табличной части
				this._obj_сonstructor.prototype.__define(f, {
					get : new Function("return this._getter_ts('"+f+"')"),
					set : new Function("v", "this._setter_ts('"+f+"',v)"),
					enumerable : true
				});
			}

		}
	}

	_obj_сonstructor = null;

}

/**
 * Возвращает имя семейства объектов данного менеджера<br />
 * Примеры: "справочников", "документов", "регистров сведений"
 * @property family_name
 * @for DataManager
 * @type String
 * @final
 */
DataManager.prototype.__define("family_name", {
	get : function () {
		return $p.msg["meta_"+this.class_name.split(".")[0]+"_mgr"].replace($p.msg.meta_mgr+" ", "");
	},
	enumerable : false
});

/**
 * Регистрирует время изменения при заиси объекта для целей синхронизации
 */
DataManager.prototype.register_ex = function(){

};

/**
 * Выводит фрагмент списка объектов данного менеджера, ограниченный фильтром attr в grid
 * @method sync_grid
 * @for DataManager
 * @param grid {dhtmlXGridObject}
 * @param attr {Object}
 */
DataManager.prototype.sync_grid = function(grid, attr){

	var res;

	if(this.cachable)
		;
	else if($p.job_prm.rest || $p.job_prm.irest_enabled || attr.rest){

		if(attr.action == "get_tree")
			res = this.rest_tree();

		else if(attr.action == "get_selection")
			res = this.rest_selection();

	}

};

/**
 * Возвращает массив доступных значений для комбобокса
 * @method get_option_list
 * @for DataManager
 * @param val {DataObj|String} - текущее значение
 * @param [selection] {Object} - отбор, который будет наложен на список
 * @param [selection._top] {Number} - ограничивает длину возвращаемого массива
 * @return {Promise.<Array>}
 */
DataManager.prototype.get_option_list = function(val, selection){
	var t = this, l = [], count = 0, input_by_string, text, sel;

	function check(v){
		if($p.is_equal(v.value, val))
			v.selected = true;
		return v;
	}

	// TODO: реализовать для некешируемых объектов (rest)
	// TODO: учесть "поля поиска по строке"

	// поиск по строке
	if(selection.presentation && (input_by_string = t.metadata().input_by_string)){
		text = selection.presentation.like;
		delete selection.presentation;
		selection.or = [];
		input_by_string.forEach(function (fld) {
			sel = {};
			sel[fld] = {like: text};
			selection.or.push(sel);
		})
	}

	if(t.cachable || (selection && selection._local)){
		t.find_rows(selection, function (v) {
			l.push(check({text: v.presentation, value: v.ref}));
		});
		return Promise.resolve(l);

	}else{
		// для некешируемых выполняем запрос к серверу
		var attr = { selection: selection, top: selection._top };
		delete selection._top;



		if(t instanceof DocManager)
			attr.fields = ["ref", "date", "number_doc"];
		else if(t.metadata().main_presentation_name)
			attr.fields = ["ref", "name"];
		else
			attr.fields = ["ref", "id"];

		return _rest.load_array(attr, t)
			.then(function (data) {
				data.forEach(function (v) {
					l.push(check({
						text: t instanceof DocManager ? (v.number_doc + " от " + $p.dateFormat(v.date, $p.dateFormat.masks.ru)) : (v.name || v.id),
						value: v.ref}));
				});
				return l;
			});
	}
};

/**
 * Заполняет свойства в объекте source в соответствии с реквизитами табчасти
 * @param tabular {String} - имя табчасти
 * @param source {Object}
 */
DataManager.prototype.tabular_captions = function (tabular, source) {

};

/**
 * Возаращает строку xml для инициализации PropertyGrid
 * @method get_property_grid_xml
 * @param oxml {Object} - объект с иерархией полей (входной параметр - правила)
 * @param o {DataObj} - объект данных, из полей и табличных частей которого будут прочитаны значения
 * @param extra_fields {Object} - объект с описанием допреквизитов
 * @param extra_fields.ts {String} - имя табчасти
 * @param extra_fields.title {String} - заголовок в oxml, под которым следует расположить допреквизиты // "Дополнительные реквизиты", "Свойства изделия", "Параметры"
 * @param extra_fields.selection {Object} - отбор, который следует приминить к табчасти допреквизитов
 * @return {String} - XML строка в терминах dhtml.PropertyGrid
 */
DataManager.prototype.get_property_grid_xml = function(oxml, o, extra_fields){
	var t = this, i, j, mf, v, ft, txt, row_id, gd = '<rows>',

		default_oxml = function () {
			if(oxml)
				return;
			mf = t.metadata();

			if(mf.form && mf.form.obj && mf.form.obj.head){
				oxml = mf.form.obj.head;

			}else{
				oxml = {" ": []};

				if(o instanceof CatObj){
					if(mf.code_length)
						oxml[" "].push("id");
					if(mf.main_presentation_name)
						oxml[" "].push("name");
				}else if(o instanceof DocObj){
					oxml[" "].push("number_doc");
					oxml[" "].push("date");
				}
				if(!o.is_folder){
					for(i in mf.fields)
						if(!mf.fields[i].hide)
							oxml[" "].push(i);
				}
				if(mf.tabular_sections["extra_fields"])
					oxml["Дополнительные реквизиты"] = [];
			}


		},

		txt_by_type = function (fv, mf) {

			if($p.is_data_obj(fv))
				txt = fv.presentation;
			else
				txt = fv;

			if(mf.type.is_ref){
				;
			} else if(mf.type.date_part) {
				txt = $p.dateFormat(txt, "");

			} else if(mf.type.types[0]=="boolean") {
				txt = txt ? "1" : "0";
			}
		},

		by_type = function(fv){

			ft = _md.control_by_type(mf.type);
			txt_by_type(fv, mf);

		},

		add_xml_row = function(f, tabular){
			if(tabular){
				var pref = f["property"] || f["param"] || f["Параметр"],
					pval = f["value"] != undefined ? f["value"] : f["Значение"];
				if(pref.empty()) {
					row_id = tabular + "|" + "empty";
					ft = "ro";
					txt = "";
					mf = {synonym: "?"};

				}else{
					mf = {synonym: pref.presentation, type: pref.type};
					row_id = tabular + "|" + pref.ref;
					by_type(pval);
					if(ft == "edn")
						ft = "calck";

					if(pref.mandatory)
						ft += '" class="cell_mandatory';
				}

			}else if(typeof f === "object"){
				mf = {synonym: f.synonym};
				row_id = f.id;
				ft = f.type;
				txt = "";
				if(f.hasOwnProperty("txt"))
					txt = f.txt;
				else if((v = o[row_id]) !== undefined)
					txt_by_type(v, _md.get(t.class_name, row_id));

			}else if(extra_fields && extra_fields.meta && ((mf = extra_fields.meta[f]) !== undefined)){
				row_id = f;
				by_type(v = o[f]);

			}else if((v = o[f]) !== undefined){
				mf = _md.get(t.class_name, row_id = f);
				by_type(v);

			}else
				return;

			gd += '<row id="' + row_id + '"><cell>' + (mf.synonym || mf.name) +
				'</cell><cell type="' + ft + '">' + txt + '</cell></row>';
		};

	default_oxml();

	for(i in oxml){
		if(i!=" ")
			gd += '<row open="1"><cell>' + i + '</cell>';   // если у блока есть заголовок, формируем блок иначе добавляем поля без иерархии

		for(j in oxml[i])
			add_xml_row(oxml[i][j]);                        // поля, описанные в текущем разделе

		if(extra_fields && i == extra_fields.title && o[extra_fields.ts]){  // строки табчасти o.extra_fields
			var added = false;
			o[extra_fields.ts].find_rows(extra_fields.selection, function (row) {
				add_xml_row(row, extra_fields.ts);
			});
			//if(!added)
			//	add_xml_row({param: _cch.properties.get("", false)}, "params"); // fake-строка, если в табчасти нет допреквизитов

		}

		if(i!=" ") gd += '</row>';                          // если блок был открыт - закрываем
	}
	gd += '</rows>';
	return gd;
};

/**
 * Имя таблицы объектов этого менеджера в локальной базе данных
 * @property table_name
 * @type String
 * @final
 */
DataManager.prototype.__define("table_name", {
	get : function(){
		return this.class_name.replace(".", "_");
	},
	enumerable : false
});


/**
 * Печатает объект
 * @method print
 * @param ref {DataObj|String} - guid ссылки на объект
 * @param model {String} - идентификатор команды печати
 * @param [wnd] {dhtmlXWindows} - окно, из которого вызываем печать
 */
DataManager.prototype.print = function(ref, model, wnd){

	function tune_wnd_print(wnd_print){
		if(wnd && wnd.progressOff)
			wnd.progressOff();
		if(wnd_print)
			wnd_print.focus();
	}

	if(wnd && wnd.progressOn)
		wnd.progressOn();

	var rattr = {};
	$p.ajax.default_attr(rattr, $p.job_prm.irest_url());
	rattr.url += this.rest_name + "(guid'" + $p.fix_guid(ref) + "')" +
		"/Print(model=" + model + ", browser_uid=" + $p.wsql.get_user_param("browser_uid") +")";

	$p.ajax.get_and_show_blob(rattr.url, rattr, "get")
		.then(tune_wnd_print)
		.catch($p.record_log);
	setTimeout(tune_wnd_print, 3000);

};

/**
 * Возвращает промис со структурой печатных форм объекта
 * @return {Promise.<Object>}
 */
DataManager.prototype.printing_plates = function(){
	var rattr = {}, t = this;

	if($p.job_prm.offline)
		return Promise.resolve({});

	if(t.metadata().printing_plates)
		t._printing_plates = t.metadata().printing_plates;

	if(t._printing_plates)
		return Promise.resolve(t._printing_plates);

	$p.ajax.default_attr(rattr, $p.job_prm.irest_url());
	rattr.url += t.rest_name + "/Print()";
	return $p.ajax.get_ex(rattr.url, rattr)
		.then(function (req) {
			t.__define("_printing_plates", {
				value: JSON.parse(req.response),
				enumerable: false
			});
			return t._printing_plates;
		})
		.catch(function () {
		})
		.then(function (pp) {
			return pp || (t._printing_plates = {});
		});
};



/**
 * ### Aбстрактный менеджер ссылочных данных
 * От него унаследованы менеджеры документов, справочников, планов видов характеристик и планов счетов
 *
 * @class RefDataManager
 * @extends DataManager
 * @constructor
 * @param class_name {string} - имя типа менеджера объекта
 */
function RefDataManager(class_name) {

	var t = this,				// ссылка на себя
		by_ref={};				// приватное хранилище объектов по guid

	RefDataManager.superclass.constructor.call(t, class_name);

	/**
	 * Помещает элемент ссылочных данных в локальную коллекцию
	 * @method push
	 * @param o {DataObj}
	 */
	t.push = function(o, new_ref){
		if(new_ref && (new_ref != o.ref)){
			delete by_ref[o.ref];
			by_ref[new_ref] = o;
		}else
			by_ref[o.ref] = o;
	};

	/**
	 * Возвращает указатель на элементы локальной коллекции
	 * @method all
	 * @return {Object}
	 */
	t.all = function(){return by_ref};

	/**
	 * Выполняет перебор элементов локальной коллекции
	 * @method each
	 * @param fn {Function} - функция, вызываемая для каждого элемента локальной коллекции
	 */
	t.each = function(fn){
		for(var i in by_ref){
			if(!i || i == $p.blank.guid)
				continue;
			if(fn.call(this, by_ref[i]) == true)
				break;
		}
	};

	/**
	 * Возвращает объект по ссылке (читает из датабазы или локального кеша) если идентификатор пуст, создаёт новый объект
	 * @method get
	 * @param ref {String|Object} - ссылочный идентификатор
	 * @param [force_promise] {Boolean} - Если истина, возвращает промис, даже для локальных объектов. Если ложь, ищет только в локальном кеше
	 * @param [do_not_create] {Boolean} - Не создавать новый. Например, когда поиск элемента выполняется из конструктора
	 * @return {DataObj|Promise.<DataObj>}
	 */
	t.get = function(ref, force_promise, do_not_create){

		var o = by_ref[ref] || by_ref[(ref = $p.fix_guid(ref))];

		if(!o){
			if(do_not_create && !force_promise)
				return;
			else
				o = new t._obj_сonstructor(ref, t, true);
		}

		if(force_promise === false)
			return o;

		else if(force_promise === undefined && ref === $p.blank.guid)
			return o;

		if(!t.cachable || o.is_new()){
			return o.load();	// читаем из 1С или иного сервера

		}else if(force_promise)
			return Promise.resolve(o);

		else
			return o;
	};

	/**
	 * Создаёт новый объект типа объектов текущего менеджера<br />
	 * Для кешируемых объектов, все действия происходят на клиенте<br />
	 * Для некешируемых, выполняется обращение к серверу для получения guid и значений реквизитов по умолчанию
	 * @method create
	 * @param [attr] {Object} - значениями полей этого объекта будет заполнен создаваемый объект
	 * @param [fill_default] {Boolean} - признак, надо ли заполнять (инициализировать) создаваемый объект значениями полей по умолчанию
	 * @return {Promise.<*>}
	 */
	t.create = function(attr, fill_default){

		function do_fill(){

		}

		if(!attr || typeof attr != "object")
			attr = {};
		if(!attr.ref || !$p.is_guid(attr.ref) || $p.is_empty_guid(attr.ref))
			attr.ref = $p.generate_guid();

		var o = by_ref[attr.ref];
		if(!o){
			o = new t._obj_сonstructor(attr, t);

			if(!t.cachable && fill_default){
				var rattr = {};
				$p.ajax.default_attr(rattr, $p.job_prm.irest_url());
				rattr.url += t.rest_name + "/Create()";
				return $p.ajax.get_ex(rattr.url, rattr)
					.then(function (req) {
						return o._mixin(JSON.parse(req.response), undefined, ["ref"]);
					});
			}

			if(fill_default){
				var _obj = o._obj;
				// присваиваем типизированные значения по умолчанию
				for(var f in t.metadata().fields){
					if(_obj[f] == undefined)
						_obj[f] = "";
				}
			}
		}

		return Promise.resolve(o);
	};

	/**
	 * Удаляет объект из alasql и локального кеша
	 * @method delete_loc
	 * @param ref
	 */
	t.delete_loc = function(ref) {
		var ind;
		delete by_ref[ref];
		for(var i in t.alatable){
			if(t.alatable[i].ref == ref){
				ind = i;
				break;
			}
		}
		if(ind != undefined){
			t.alatable.splice(ind, 1);
		}
	};


	/**
	 * Находит первый элемент, в любом поле которого есть искомое значение
	 * @method find
	 * @param val {*} - значение для поиска
	 * @return {DataObj}
	 */
	t.find = function(val){
		return $p._find(by_ref, val); };

	/**
	 * ### Найти строки
	 * Возвращает массив дата-объектов, обрезанный по отбору<br />
	 * Eсли отбор пустой, возвращаются все строки, закешированные в менеджере (для кешируемых типов)
	 * Для некешируемых типов выполняет запрос к базе
	 * @method find_rows
	 * @param selection {Object} - в ключах имена полей, в значениях значения фильтра или объект {like: значение}
	 * @param callback {Function} - в который передается текущий объект данных на каждой итерации
	 * @return {Array}
	 */
	t.find_rows = function(selection, callback){
		return $p._find_rows.call(t, by_ref, selection, callback);
	};

	/**
	 * Cохраняет объект в базе 1C либо выполняет запрос attr.action
	 * @method save
	 * @param attr {Object} - атрибуты сохраняемого объекта могут быть ранее полученным DataObj или произвольным объектом (а-ля данныеформыструктура)
	 * @return {Promise.<T>} - инфо о завершении операции
	 * @async
	 */
	t.save = function(attr){
		if(attr && (attr.specify ||
			($p.is_guid(attr.ref) && !t.cachable))) {
			return _load({
				class_name: t.class_name,
				action: attr.action || "save", attr: attr
			}).then(JSON.parse);
		}else
			return Promise.reject();
	};

	/**
	 * сохраняет массив объектов в менеджере
	 * @method load_array
	 * @param aattr {Array} - массив объектов для трансформации в объекты ссылочного типа
	 * @param forse {Boolean} - перезаполнять объект
	 * @async
	 */
	t.load_array = function(aattr, forse){

		var ref, obj;

		for(var i in aattr){
			ref = $p.fix_guid(aattr[i]);
			if(!(obj = by_ref[ref])){
				obj = new t._obj_сonstructor(aattr[i], t);
				if(forse)
					obj._set_loaded();

			}else if(obj.is_new() || forse){
				obj._mixin(aattr[i]);
				obj._set_loaded();
			}

		}

	};


	/**
	 * Возаращает предопределенный элемент или ссылку предопределенного элемента
	 * @method predefined
	 * @param name {String} - имя предопределенного
	 * @return {DataObj}
	 */
	t.predefined = function(name){
		var p = t.metadata()["predefined"][name];
		if(!p)
			return undefined;
		return t.get(p.ref);
	};

	/**
	 * Находит перую папку в пределах подчинения владельцу
	 * @method first_folder
	 * @param owner {DataObj|String}
	 * @return {DataObj} - ссылка найденной папки или пустая ссылка
	 */
	t.first_folder = function(owner){
		for(var i in by_ref){
			var o = by_ref[i];
			if(o.is_folder && (!owner || $p.is_equal(owner, o.owner)))
				return o;
		}
		return t.get();
	};


}
RefDataManager._extend(DataManager);

/**
 * Возаращает массив запросов для создания таблиц объекта и его табличных частей
 * @method get_sql_struct
 * @param attr {Object}
 * @param attr.action {String} - [create_table, drop, insert, update, replace, select, delete]
 * @return {Object|String}
 */
RefDataManager.prototype.get_sql_struct = function(attr){
	var t = this,
		cmd = t.metadata(),
		res = {}, f, f0, trunc_index = 0,
		action = attr && attr.action ? attr.action : "create_table";


	function sql_selection(){

		var ignore_parent = !attr.parent,
			parent = attr.parent || $p.blank.guid,
			owner,
			initial_value = attr.initial_value || $p.blank.guid,
			filter = attr.filter || "",
			set_parent = $p.blank.guid;

		function list_flds(){
			var flds = [], s = "_t_.ref, _t_.`deleted`";

			if(cmd.form && cmd.form.selection){
				cmd.form.selection.fields.forEach(function (fld) {
					flds.push(fld);
				});

			}else if(t instanceof DocManager){
				flds.push("posted");
				flds.push("date");
				flds.push("number_doc");

			}else{

				if(cmd["hierarchical"] && cmd["group_hierarchy"])
					flds.push("is_folder");
				else
					flds.push("0 as is_folder");

				if(t instanceof ChartOfAccountManager){
					flds.push("id");
					flds.push("name as presentation");

				}else if(cmd["main_presentation_name"])
					flds.push("name as presentation");

				else{
					if(cmd["code_length"])
						flds.push("id as presentation");
					else
						flds.push("'...' as presentation");
				}

				if(cmd["has_owners"])
					flds.push("owner");

				if(cmd["code_length"])
					flds.push("id");

			}

			flds.forEach(function(fld){
				if(fld.indexOf(" as ") != -1)
					s += ", " + fld;
				else
					s += _md.sql_mask(fld, true);
			});
			return s;

		}

		function join_flds(){

			var s = "", parts;

			if(cmd.form && cmd.form.selection){
				for(var i in cmd.form.selection.fields){
					if(cmd.form.selection.fields[i].indexOf(" as ") == -1 || cmd.form.selection.fields[i].indexOf("_t_.") != -1)
						continue;
					parts = cmd.form.selection.fields[i].split(" as ");
					parts[0] = parts[0].split(".");
					if(parts[0].length > 1){
						if(s)
							s+= "\n";
						s+= "left outer join " + parts[0][0] + " on " + parts[0][0] + ".ref = _t_." + parts[1];
					}
				}
			}
			return s;
		}

		function where_flds(){

			var s;

			if(t instanceof ChartOfAccountManager){
				s = " WHERE (" + (filter ? 0 : 1);

			}else if(cmd["hierarchical"]){
				if(cmd["has_owners"])
					s = " WHERE (" + (ignore_parent || filter ? 1 : 0) + " OR _t_.parent = '" + parent + "') AND (" +
						(owner == $p.blank.guid ? 1 : 0) + " OR _t_.owner = '" + owner + "') AND (" + (filter ? 0 : 1);
				else
					s = " WHERE (" + (ignore_parent || filter ? 1 : 0) + " OR _t_.parent = '" + parent + "') AND (" + (filter ? 0 : 1);

			}else{
				if(cmd["has_owners"])
					s = " WHERE (" + (owner == $p.blank.guid ? 1 : 0) + " OR _t_.owner = '" + owner + "') AND (" + (filter ? 0 : 1);
				else
					s = " WHERE (" + (filter ? 0 : 1);
			}

			if(t.sql_selection_where_flds){
				s += t.sql_selection_where_flds(filter);

			}else if(t instanceof DocManager)
				s += " OR _t_.number_doc LIKE '" + filter + "'";

			else{
				if(cmd["main_presentation_name"] || t instanceof ChartOfAccountManager)
					s += " OR _t_.name LIKE '" + filter + "'";

				if(cmd["code_length"])
					s += " OR _t_.id LIKE '" + filter + "'";
			}

			s += ") AND (_t_.ref != '" + $p.blank.guid + "')";


			// допфильтры форм и связей параметров выбора
			if(attr.selection){
				if(typeof attr.selection == "function"){

				}else
					attr.selection.forEach(function(sel){
						for(var key in sel){

							if(typeof sel[key] == "function"){
								s += "\n AND " + sel[key](t, key) + " ";

							}else if(cmd.fields.hasOwnProperty(key)){
								if(sel[key] === true)
									s += "\n AND _t_." + key + " ";
								else if(sel[key] === false)
									s += "\n AND (not _t_." + key + ") ";
								else if(typeof sel[key] == "string" || typeof sel[key] == "object")
									s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";
								else
									s += "\n AND (_t_." + key + " = " + sel[key] + ") ";
							} else if(key=="is_folder" && cmd.hierarchical && cmd.group_hierarchy){
								//if(sel[key])
								//	s += "\n AND _t_." + key + " ";
								//else
								//	s += "\n AND (not _t_." + key + ") ";
							}
						}
					});
			}

			return s;
		}

		function order_flds(){

			if(t instanceof ChartOfAccountManager){
				return "ORDER BY id";

			}else if(cmd["hierarchical"]){
				if(cmd["group_hierarchy"])
					return "ORDER BY _t_.is_folder desc, is_initial_value, presentation";
				else
					return "ORDER BY _t_.parent desc, is_initial_value, presentation";
			}else
				return "ORDER BY is_initial_value, presentation";
		}

		function selection_prms(){

			// т.к. в процессе установки может потребоваться получение объектов, код асинхронный
			function on_parent(o){

				// ссылка родителя для иерархических справочников
				if(o){
					set_parent = (attr.set_parent = o.parent.ref);
					parent = set_parent;
					ignore_parent = false;
				}else if(!filter && !ignore_parent){
					;
				}else{
					if(t.class_name == "cat.base_blocks"){
						if(owner == $p.blank.guid)
							owner = _cat.bases.predefined("main");
						parent = t.first_folder(owner).ref;
					}
				}

				// строка фильтра
				if(filter && filter.indexOf("%") == -1)
					filter = "%" + filter + "%";

			}

			// установим владельца
			if(cmd["has_owners"]){
				owner = attr.owner;
				if(attr.selection && typeof attr.selection != "function"){
					attr.selection.forEach(function(sel){
						if(sel.owner){
							owner = typeof sel.owner == "object" ?  sel.owner.valueOf() : sel.owner;
							delete sel.owner;
						}
					});
				}
				if(!owner)
					owner = $p.blank.guid;
			}

			// ссылка родителя во взаимосвязи с начальным значением выбора
			if(initial_value !=  $p.blank.guid && ignore_parent){
				if(cmd["hierarchical"]){
					on_parent(t.get(initial_value, false))
				}else
					on_parent();
			}else
				on_parent();

		}

		selection_prms();

		var sql;
		if(t.sql_selection_list_flds)
			sql = t.sql_selection_list_flds(initial_value);
		else
			sql = ("SELECT %2, case when _t_.ref = '" + initial_value +
			"' then 0 else 1 end as is_initial_value FROM `" + t.table_name + "` AS _t_ %j %3 %4 LIMIT 300")
				.replace("%2", list_flds())
				.replace("%j", join_flds())
			;

		return sql.replace("%3", where_flds()).replace("%4", order_flds());

	}

	function sql_create(){

		var sql = "CREATE TABLE IF NOT EXISTS ";

		if(attr && attr.postgres){
			sql += t.table_name+" (ref uuid PRIMARY KEY NOT NULL, deleted boolean, lc_changed bigint";

			if(t instanceof DocManager)
				sql += ", posted boolean, date timestamp with time zone, number_doc character(11)";
			else{
				if(cmd.code_length)
					sql += ", id character("+cmd.code_length+")";
				sql += ", name character varying(50), is_folder boolean";
			}

			for(f in cmd.fields){
				if(f.length > 30){
					if(cmd.fields[f].short_name)
						f0 = cmd.fields[f].short_name;
					else{
						trunc_index++;
						f0 = f[0] + trunc_index + f.substr(f.length-27);
					}
				}else
					f0 = f;
				sql += ", " + f0 + _md.sql_type(t, f, cmd.fields[f].type, true) + _md.sql_composite(cmd.fields, f, f0, true);
			}

			for(f in cmd["tabular_sections"])
				sql += ", " + "ts_" + f + " JSON";

		}else{
			sql += "`"+t.table_name+"` (ref CHAR PRIMARY KEY NOT NULL, `deleted` BOOLEAN, lc_changed INT";

			if(t instanceof DocManager)
				sql += ", posted boolean, date Date, number_doc CHAR";
			else
				sql += ", id CHAR, name CHAR, is_folder BOOLEAN";

			for(f in cmd.fields)
				sql += _md.sql_mask(f) + _md.sql_type(t, f, cmd.fields[f].type)+ _md.sql_composite(cmd.fields, f);

			for(f in cmd["tabular_sections"])
				sql += ", " + "`ts_" + f + "` JSON";
		}

		sql += ")";

		return sql;
	}

	function sql_update(){
		// "INSERT OR REPLACE INTO user_params (prm_name, prm_value) VALUES (?, ?);
		var fields = ["ref", "deleted", "lc_changed"],
			sql = "INSERT INTO `"+t.table_name+"` (ref, `deleted`, lc_changed",
			values = "(?";

		if(t.class_name.substr(0, 3)=="cat"){
			sql += ", id, name, is_folder";
			fields.push("id");
			fields.push("name");
			fields.push("is_folder");

		}else if(t.class_name.substr(0, 3)=="doc"){
			sql += ", posted, date, number_doc";
			fields.push("posted");
			fields.push("date");
			fields.push("number_doc");

		}
		for(f in cmd.fields){
			sql += _md.sql_mask(f);
			fields.push(f);
		}
		for(f in cmd["tabular_sections"]){
			sql += ", `ts_" + f + "`";
			fields.push("ts_" + f);
		}
		sql += ") VALUES ";
		for(f = 1; f<fields.length; f++){
			values += ", ?";
		}
		values += ")";
		sql += values;

		return {sql: sql, fields: fields, values: values};
	}


	if(action == "create_table")
		res = sql_create();

	else if(["insert", "update", "replace"].indexOf(action) != -1)
		res[t.table_name] = sql_update();

	else if(action == "select")
		res = "SELECT * FROM `"+t.table_name+"` WHERE ref = ?";

	else if(action == "select_all")
		res = "SELECT * FROM `"+t.table_name+"`";

	else if(action == "delete")
		res = "DELETE FROM `"+t.table_name+"` WHERE ref = ?";

	else if(action == "drop")
		res = "DROP TABLE IF EXISTS `"+t.table_name+"`";

	else if(action == "get_tree"){
		if(!attr.filter || attr.filter.is_folder)
			res = "SELECT ref, parent, name as presentation FROM `" + t.table_name + "` WHERE is_folder order by parent, name";
		else
			res = "SELECT ref, parent, name as presentation FROM `" + t.table_name + "` order by parent, name";
	}

	else if(action == "get_selection")
		res = sql_selection();

	return res;
};

// ШапкаТаблицыПоИмениКласса
RefDataManager.prototype.caption_flds = function(attr){

	var str_def = "<column id=\"%1\" width=\"%2\" type=\"%3\" align=\"%4\" sort=\"%5\">%6</column>",
		acols = [], cmd = this.metadata(),	s = "";

	function Col_struct(id,width,type,align,sort,caption){
		this.id = id;
		this.width = width;
		this.type = type;
		this.align = align;
		this.sort = sort;
		this.caption = caption;
	}

	if(cmd.form && cmd.form.selection){
		acols = cmd.form.selection.cols;

	}else if(this instanceof DocManager){
		acols.push(new Col_struct("date", "120", "ro", "left", "server", "Дата"));
		acols.push(new Col_struct("number_doc", "120", "ro", "left", "server", "Номер"));

	}else if(this instanceof ChartOfAccountManager){
		acols.push(new Col_struct("id", "120", "ro", "left", "server", "Код"));
		acols.push(new Col_struct("presentation", "*", "ro", "left", "server", "Наименование"));

	}else{

		acols.push(new Col_struct("presentation", "*", "ro", "left", "server", "Наименование"));
		//if(cmd["has_owners"]){
		//	var owner_caption = "Владелец";
		//	acols.push(new Col_struct("owner", "200", "ro", "left", "server", owner_caption));
		//}

	}

	if(attr.get_header && acols.length){
		s = "<head>";
		for(var col in acols){
			s += str_def.replace("%1", acols[col].id).replace("%2", acols[col].width).replace("%3", acols[col].type)
				.replace("%4", acols[col].align).replace("%5", acols[col].sort).replace("%6", acols[col].caption);
		}
		s += "</head>";
	}

	return {head: s, acols: acols};
};

/**
 * Догружает с сервера объекты, которых нет в локальном кеше
 * @method load_cached_server_array
 * @param list {Array} - массив строк ссылок или объектов со свойством ref
 * @param alt_rest_name {String} - альтернативный rest_name для загрузки с сервера
 * @return {Promise}
 */
RefDataManager.prototype.load_cached_server_array = function (list, alt_rest_name) {

	var query = [], obj,
		t = this,
		mgr = alt_rest_name ? {class_name: t.class_name, rest_name: alt_rest_name} : t,
		check_loaded = !alt_rest_name;

	list.forEach(function (o) {
		obj = t.get(o.ref || o, false, true);
		if(!obj || (check_loaded && obj.is_new()))
			query.push(o.ref || o);
	});
	if(query.length){

		var attr = {
			url: "",
			selection: {ref: {in: query}}
		};
		if(check_loaded)
			attr.fields = ["ref"];

		$p.rest.build_select(attr, mgr);
		//if(dhx4.isIE)
		//	attr.url = encodeURI(attr.url);

		return $p.ajax.get_ex(attr.url, attr)
			.then(function (req) {
				var data = JSON.parse(req.response);

				if(check_loaded)
					data = data.value;
				else{
					data = data.data;
					for(var i in data){
						if(!data[i].ref && data[i].id)
							data[i].ref = data[i].id;
						if(data[i].Код){
							data[i].id = data[i].Код;
							delete data[i].Код;
						}
						data[i]._not_set_loaded = true;
					}
				}

				t.load_array(data);
				return(list);
			});

	}else
		return Promise.resolve(list);
};


/**
 * ### Абстрактный менеджер обработок
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "DataProcessors"}}{{/crossLink}}
 *
 * @class DataProcessorsManager
 * @extends DataManager
 * @param class_name {string} - имя типа менеджера объекта
 * @constructor
 */
function DataProcessorsManager(class_name){

	DataProcessorsManager.superclass.constructor.call(this, class_name);

	/**
	 * Создаёт экземпляр объекта обработки
	 * @method
	 * @return {DataProcessorObj}
	 */
	this.create = function(){
		return new this._obj_сonstructor({}, this);
	};

}
DataProcessorsManager._extend(DataManager);



/**
 * ### Абстрактный менеджер перечисления
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "Enumerations"}}{{/crossLink}}
 *
 * @class EnumManager
 * @extends RefDataManager
 * @param a {array} - массив значений
 * @param class_name {string} - имя типа менеджера объекта. например, "enm.open_types"
 * @constructor
 */
function EnumManager(a, class_name) {

	EnumManager.superclass.constructor.call(this, class_name);

	this._obj_сonstructor = EnumObj;

	this.push = function(o, new_ref){
		this.__define(new_ref, {
			value : o,
			enumerable : false
		}) ;
	};

	this.get = function(ref){

		if(ref instanceof EnumObj)
			return ref;

		else if(!ref || ref == $p.blank.guid)
			ref = "_";

		var o = this[ref];
		if(!o)
			o = new EnumObj({name: ref}, this);

		return o;
	};

	this.each = function (fn) {
		this.alatable.forEach(function (v) {
			if(v.ref && v.ref != $p.blank.guid)
				fn.call(this[v.ref]);
		});
	};

	for(var i in a)
		new EnumObj(a[i], this);

}
EnumManager._extend(RefDataManager);


/**
 * Bозаращает массив запросов для создания таблиц объекта и его табличных частей
 * @param attr {Object}
 * @param attr.action {String} - [create_table, drop, insert, update, replace, select, delete]
 * @return {Object|String}
 */
EnumManager.prototype.get_sql_struct = function(attr){

	var res = "CREATE TABLE IF NOT EXISTS ",
		action = attr && attr.action ? attr.action : "create_table";

	if(attr && attr.postgres){
		if(action == "create_table")
			res += this.table_name+
				" (ref character varying(255) PRIMARY KEY NOT NULL, sequence INT, synonym character varying(255))";
		else if(["insert", "update", "replace"].indexOf(action) != -1){
			res = {};
			res[this.table_name] = {
				sql: "INSERT INTO "+this.table_name+" (ref, sequence, synonym) VALUES ($1, $2, $3)",
				fields: ["ref", "sequence", "synonym"],
				values: "($1, $2, $3)"
			};

		}else if(action == "delete")
			res = "DELETE FROM "+this.table_name+" WHERE ref = $1";

	}else {
		if(action == "create_table")
			res += "`"+this.table_name+
				"` (ref CHAR PRIMARY KEY NOT NULL, sequence INT, synonym CHAR)";

		else if(["insert", "update", "replace"].indexOf(action) != -1){
			res = {};
			res[this.table_name] = {
				sql: "INSERT INTO `"+this.table_name+"` (ref, sequence, synonym) VALUES (?, ?, ?)",
				fields: ["ref", "sequence", "synonym"],
				values: "(?, ?, ?)"
			};

		}else if(action == "delete")
			res = "DELETE FROM `"+this.table_name+"` WHERE ref = ?";
	}



	return res;

};

/**
 * Возвращает массив доступных значений для комбобокса
 * @method get_option_list
 * @param val {DataObj|String}
 * @param [selection] {Object}
 * @param [selection._top] {Number}
 * @return {Promise.<Array>}
 */
EnumManager.prototype.get_option_list = function(val, selection){
	var l = [], synonym = "";

	function check(v){
		if($p.is_equal(v.value, val))
			v.selected = true;
		return v;
	}

	if(selection){
		for(var i in selection){
			if(i.substr(0,1)=="_")
				continue;
			synonym = selection[i];
		}
	}

	if(typeof synonym == "object"){
		if(synonym.like)
			synonym = synonym.like;
		else
			synonym = "";
	}
	synonym = synonym.toLowerCase();

	this.alatable.forEach(function (v) {
		if(synonym){
			if(!v.synonym || v.synonym.toLowerCase().indexOf(synonym) == -1)
				return;
		}
		l.push(check({text: v.synonym || "", value: v.ref}));
	});
	return Promise.resolve(l);
};


/**
 * ### Абстрактный менеджер регистра (накопления, сведений и бухгалтерии)
 *
 * @class RegisterManager
 * @extends DataManager
 * @constructor
 * @param class_name {string} - имя типа менеджера объекта. например, "ireg.prices"
 */
function RegisterManager(class_name){

	var by_ref={};				// приватное хранилище объектов по ключу записи

	this._obj_сonstructor = RegisterRow;

	RegisterManager.superclass.constructor.call(this, class_name);

	/**
	 * Помещает элемент ссылочных данных в локальную коллекцию
	 * @method push
	 * @param o {RegisterRow}
	 */
	this.push = function(o, new_ref){
		if(new_ref && (new_ref != o.ref)){
			delete by_ref[o.ref];
			by_ref[new_ref] = o;
		}else
			by_ref[o.ref] = o;
	};

	/**
	 * Возвращает массив записей c заданным отбором либо запись по ключу
	 * @method get
	 * @for InfoRegManager
	 * @param attr {Object} - объект {key:value...}
	 * @param force_promise {Boolesn} - возаращять промис, а не массив
	 * @param return_row {Boolesn} - возвращать запись, а не массив
	 * @return {*}
	 */
	this.get = function(attr, force_promise, return_row){

		if(!attr)
			attr = {};
		attr.action = "select";

		var arr = $p.wsql.alasql(this.get_sql_struct(attr), attr._values),
			res;

		delete attr.action;
		delete attr._values;

		if(arr.length){
			if(return_row)
				res = by_ref[this.get_ref(arr[0])];
			else{
				res = [];
				for(var i in arr)
					res.push(by_ref[this.get_ref(arr[i])]);
			}
		}
		return force_promise ? Promise.resolve(res) : res;
	};

	/**
	 * сохраняет массив объектов в менеджере
	 * @method load_array
	 * @param aattr {array} - массив объектов для трансформации в объекты ссылочного типа
	 * @async
	 */
	this.load_array = function(aattr){

		var key, obj, res = [];

		for(var i in aattr){

			key = this.get_ref(aattr[i]);

			if(!(obj = by_ref[key])){
				new this._obj_сonstructor(aattr[i], this);

			}else
				obj._mixin(aattr[i]);

			res.push(by_ref[key]);
		}
		return res;

	};

	/**
	 * ### Найти строки
	 * Возвращает массив дата-объектов, обрезанный по отбору<br />
	 * Eсли отбор пустой, возвращаются все строки, закешированные в менеджере (для кешируемых типов)
	 * Для некешируемых типов выполняет запрос к базе
	 * @method find_rows
	 * @param selection {Object} - в ключах имена полей, в значениях значения фильтра или объект {like: значение}
	 * @param callback {Function} - в который передается текущий объект данных на каждой итерации
	 * @return {Array}
	 */
	this.find_rows = function(selection, callback){
		return $p._find_rows.call(this, this.alatable, selection, callback);
	};

}
RegisterManager._extend(DataManager);

/**
 * Возаращает запросов для создания таблиц или извлечения данных
 * @method get_sql_struct
 * @for RegisterManager
 * @param attr {Object}
 * @param attr.action {String} - [create_table, drop, insert, update, replace, select, delete]
 * @return {Object|String}
 */
RegisterManager.prototype.get_sql_struct = function(attr) {
	var t = this,
		cmd = t.metadata(),
		res = {}, f,
		action = attr && attr.action ? attr.action : "create_table";

	function sql_create(){
		var sql = "CREATE TABLE IF NOT EXISTS ",
			first_field = true;

		if(attr && attr.postgres){
			sql += t.table_name+" ("

			if(cmd.splitted){
				sql += "zone integer";
				first_field = false;
			}

			for(f in cmd["dimensions"]){
				if(first_field){
					sql += f;
					first_field = false;
				}else
					sql += ", " + f;
				sql += _md.sql_type(t, f, cmd["dimensions"][f].type, true) + _md.sql_composite(cmd["dimensions"], f, "", true);
			}

			for(f in cmd["resources"])
				sql += ", " + f + _md.sql_type(t, f, cmd["resources"][f].type, true) + _md.sql_composite(cmd["resources"], f, "", true);

			sql += ", PRIMARY KEY (";
			first_field = true;
			if(cmd.splitted){
				sql += "zone";
				first_field = false;
			}
			for(f in cmd["dimensions"]){
				if(first_field){
					sql += f;
					first_field = false;
				}else
					sql += ", " + f;
			}

		}else{
			sql += "`"+t.table_name+"` ("

			for(f in cmd["dimensions"]){
				if(first_field){
					sql += "`" + f + "`";
					first_field = false;
				}else
					sql += _md.sql_mask(f);
				sql += _md.sql_type(t, f, cmd["dimensions"][f].type) + _md.sql_composite(cmd["dimensions"], f);
			}

			for(f in cmd["resources"])
				sql += _md.sql_mask(f) + _md.sql_type(t, f, cmd["resources"][f].type) + _md.sql_composite(cmd["resources"], f);

			sql += ", PRIMARY KEY (";
			first_field = true;
			for(f in cmd["dimensions"]){
				if(first_field){
					sql += "`" + f + "`";
					first_field = false;
				}else
					sql += _md.sql_mask(f);
			}
		}

		sql += "))";

		return sql;
	}

	function sql_update(){
		// "INSERT OR REPLACE INTO user_params (prm_name, prm_value) VALUES (?, ?);
		var sql = "INSERT OR REPLACE INTO `"+t.table_name+"` (",
			fields = [],
			first_field = true;

		for(f in cmd["dimensions"]){
			if(first_field){
				sql += f;
				first_field = false;
			}else
				sql += ", " + f;
			fields.push(f);
		}
		for(f in cmd["resources"]){
			sql += ", " + f;
			fields.push(f);
		}

		sql += ") VALUES (?";
		for(f = 1; f<fields.length; f++){
			sql += ", ?";
		}
		sql += ")";

		return {sql: sql, fields: fields};
	}

	function sql_select(){
		var sql = "SELECT * FROM `"+t.table_name+"` WHERE ",
			first_field = true;
		attr._values = [];

		for(var f in cmd["dimensions"]){

			if(first_field)
				first_field = false;
			else
				sql += " and ";

			sql += "`" + f + "`" + "=?";
			attr._values.push(attr[f]);
		}

		if(first_field)
			sql += "1";

		return sql;
	}


	if(action == "create_table")
		res = sql_create();

	else if(action in {insert:"", update:"", replace:""})
		res[t.table_name] = sql_update();

	else if(action == "select")
		res = sql_select();

	else if(action == "select_all")
		res = sql_select();

	else if(action == "delete")
		res = "DELETE FROM `"+t.table_name+"` WHERE ref = ?";

	else if(action == "drop")
		res = "DROP TABLE IF EXISTS `"+t.table_name+"`";

	return res;
};

RegisterManager.prototype.get_ref = function(attr){
	var key = "", ref,
		dimensions = this.metadata().dimensions;
	if(attr instanceof RegisterRow)
		attr = attr._obj;
	for(var j in dimensions){
		key += (key ? "_" : "");
		if(dimensions[j].type.is_ref)
			key += $p.fix_guid(attr[j]);

		else if(!attr[j] && dimensions[j].type.digits)
			key += "0";

		else if(dimensions[j].date_part)
			key += $p.dateFormat(attr[j] || $p.blank.date, $p.dateFormat.masks.atom);

		else if(attr[j]!=undefined)
			key += String(attr[j]);

		else
			key += "$";
	}
	return key;
};




/**
 * ### Абстрактный менеджер регистра сведений
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "InfoRegs"}}{{/crossLink}}
 *
 * @class InfoRegManager
 * @extends RegisterManager
 * @constructor
 * @param class_name {string} - имя типа менеджера объекта. например, "ireg.prices"
 */
function InfoRegManager(class_name){

	InfoRegManager.superclass.constructor.call(this, class_name);

}
InfoRegManager._extend(RegisterManager);

/**
 * Возаращает массив записей - срез первых значений по ключам отбора
 * @method slice_first
 * @for InfoRegManager
 * @param filter {Object} - отбор + период
 */
InfoRegManager.prototype.slice_first = function(filter){

};

/**
 * Возаращает массив записей - срез последних значений по ключам отбора
 * @method slice_last
 * @for InfoRegManager
 * @param filter {Object} - отбор + период
 */
InfoRegManager.prototype.slice_last = function(filter){

};


/**
 * ### Журнал событий
 * Хранит и накапливает события сеанса<br />
 * Является наследником регистра сведений
 * @extends InfoRegManager
 * @class LogManager
 * @static
 */
function LogManager(){

	LogManager.superclass.constructor.call(this, "ireg.$log");

	var smax;

	/**
	 * Добавляет запись в журнал
	 * @param msg {String|Object|Error} - текст + класс события
	 * @param [msg.obj] {Object} - дополнительный json объект
	 */
	this.record = function(msg){

		if(msg instanceof Error){
			if(console)
				console.log(msg);
			var err = msg;
			msg = {
				class: "error",
				note: err.toString()
			}
		}

		if(typeof msg != "object")
			msg = {note: msg};
		msg.date = Date.now() + $p.eve.time_diff();
		if(!smax)
			smax = alasql.compile("select MAX(`sequence`) as `sequence` from `ireg_$log` where `date` = ?");
		var res = smax([msg.date]);
		if(!res.length || res[0].sequence === undefined)
			msg.sequence = 0;
		else
			msg.sequence = res[0].sequence + 1;
		if(!msg.class)
			msg.class = "note";


		$p.wsql.alasql("insert into `ireg_$log` (`date`, `sequence`, `class`, `note`, `obj`) values (?, ?, ?, ?, ?)",
			[msg.date, msg.sequence, msg.class, msg.note, msg.obj ? JSON.stringify(msg.obj) : ""]);

	};

	/**
	 * Сбрасывает события на сервер
	 * @method backup
	 * @param [dfrom] {Date}
	 * @param [dtill] {Date}
	 */
	this.backup = function(dfrom, dtill){

	};

	/**
	 * Восстанавливает события из архива на сервере
	 * @method restore
	 * @param [dfrom] {Date}
	 * @param [dtill] {Date}
	 */
	this.restore = function(dfrom, dtill){

	};

	/**
	 * Стирает события в указанном диапазоне дат
	 * @method clear
	 * @param [dfrom] {Date}
	 * @param [dtill] {Date}
	 */
	this.clear = function(dfrom, dtill){

	};

	this.show = function (pwnd) {

	};

	this.get_sql_struct = function(attr){

		if(attr && attr.action == "get_selection"){
			var sql = "select * from `ireg_$log`";
			if(attr.date_from){
				if (attr.date_till)
					sql += " where `date` >= ? and `date` <= ?";
				else
					sql += " where `date` >= ?";
			}else if (attr.date_till)
				sql += " where `date` <= ?";

			return sql;

		}else
			return LogManager.superclass.get_sql_struct.call(this, attr);
	};

	this.caption_flds = function (attr) {

		var str_def = "<column id=\"%1\" width=\"%2\" type=\"%3\" align=\"%4\" sort=\"%5\">%6</column>",
			acols = [], cmd = this.metadata(),	s = "";

		function Col_struct(id,width,type,align,sort,caption){
			this.id = id;
			this.width = width;
			this.type = type;
			this.align = align;
			this.sort = sort;
			this.caption = caption;
		}

		acols.push(new Col_struct("date", "140", "ro", "left", "server", "Дата"));
		acols.push(new Col_struct("class", "100", "ro", "left", "server", "Класс"));
		acols.push(new Col_struct("note", "*", "ro", "left", "server", "Событие"));

		if(attr.get_header){
			s = "<head>";
			for(var col in acols){
				s += str_def.replace("%1", acols[col].id).replace("%2", acols[col].width).replace("%3", acols[col].type)
					.replace("%4", acols[col].align).replace("%5", acols[col].sort).replace("%6", acols[col].caption);
			}
			s += "</head>";
		}

		return {head: s, acols: acols};
	};

	this.data_to_grid = function (data, attr) {
		var xml = "<?xml version='1.0' encoding='UTF-8'?><rows total_count='%1' pos='%2' set_parent='%3'>"
				.replace("%1", data.length).replace("%2", attr.start)
				.replace("%3", attr.set_parent || "" ),
			caption = this.caption_flds(attr),
			time_diff = $p.eve.time_diff();

		// при первом обращении к методу добавляем описание колонок
		xml += caption.head;

		data.forEach(function(r){
			xml += "<row id=\"" + r.date + "_" + r.sequence + "\"><cell>" +
				$p.dateFormat(r.date - time_diff, $p.dateFormat.masks.date_time) + (r.sequence ? "." + r.sequence : "") + "</cell>" +
				"<cell>" + r.class + "</cell><cell>" + r.note + "</cell></row>";
		});

		return xml + "</rows>";
	}
}
LogManager._extend(InfoRegManager);



/**
 * ### Абстрактный менеджер регистра накопления
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "AccumRegs"}}{{/crossLink}}
 *
 * @class AccumRegManager
 * @extends RegisterManager
 * @constructor
 * @param class_name {string} - имя типа менеджера объекта. например, "areg.goods_on_stores"
 */
function AccumRegManager(class_name){

	AccumRegManager.superclass.constructor.call(this, class_name);
}
AccumRegManager._extend(RegisterManager);




/**
 * ### Абстрактный менеджер справочника
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "Catalogs"}}{{/crossLink}}
 *
 * @class CatManager
 * @extends RefDataManager
 * @constructor
 * @param class_name {string}
 */
function CatManager(class_name) {

	this._obj_сonstructor = CatObj;		// ссылка на конструктор элементов

	CatManager.superclass.constructor.call(this, class_name);

	// реквизиты по метаданным
	if(this.metadata().hierarchical && this.metadata().group_hierarchy){

		/**
		 * признак "это группа"
		 * @property is_folder
		 * @for CatObj
		 * @type {Boolean}
		 */
		this._obj_сonstructor.prototype.__define("is_folder", {
			get : function(){ return this._obj.is_folder || false},
			set : function(v){ this._obj.is_folder = $p.fix_boolean(v)},
			enumerable : true
		});
	}

}
CatManager._extend(RefDataManager);

/**
 * Возвращает объект по наименованию
 * @method by_name
 * @param name {String|Object} - искомое наименование
 * @return {DataObj}
 */
CatManager.prototype.by_name = function(name){

	var o;

	this.find_rows({name: name}, function (obj) {
		o = obj;
		return false;
	});

	if(!o)
		o = this.get();

	return o;
};

/**
 * Возвращает объект по коду
 * @method by_id
 * @param id {String|Object} - искомый код
 * @return {DataObj}
 */
CatManager.prototype.by_id = function(id){

	var o;

	this.find_rows({id: id}, function (obj) {
		o = obj;
		return false;
	});

	if(!o)
		o = this.get();

	return o;
};

/**
 * Для иерархических кешируемых справочников возвращает путь элемента
 * @param ref {String|CatObj} - ссылка или объект данных
 * @return {string} - строка пути элемента
 */
CatManager.prototype.path = function(ref){
	var res = [], tobj;

	if(ref instanceof DataObj)
		tobj = ref;
	else
		tobj = this.get(ref, false, true);
	if(tobj)
		res.push({ref: tobj.ref, presentation: tobj.presentation});

	if(tobj && this.metadata().hierarchical){
		while(true){
			tobj = tobj.parent;
			if(tobj.empty())
				break;
			res.push({ref: tobj.ref, presentation: tobj.presentation});
		}
	}
	return res;
};



/**
 * ### Абстрактный менеджер плана видов характеристик
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "ChartsOfCharacteristics"}}{{/crossLink}}
 *
 * @class ChartOfCharacteristicManager
 * @extends CatManager
 * @constructor
 * @param class_name {string}
 */
function ChartOfCharacteristicManager(class_name){

	this._obj_сonstructor = CatObj;		// ссылка на конструктор элементов

	ChartOfCharacteristicManager.superclass.constructor.call(this, class_name);

}
ChartOfCharacteristicManager._extend(CatManager);


/**
 * ### Абстрактный менеджер плана счетов
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "ChartsOfAccounts"}}{{/crossLink}}
 *
 * @class ChartOfAccountManager
 * @extends CatManager
 * @constructor
 * @param class_name {string}
 */
function ChartOfAccountManager(class_name){

	this._obj_сonstructor = CatObj;		// ссылка на конструктор элементов

	ChartOfAccountManager.superclass.constructor.call(this, class_name);

}
ChartOfAccountManager._extend(CatManager);


/**
 * ### Абстрактный менеджер документов
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "Documents"}}{{/crossLink}}
 *
 * @class DocManager
 * @extends RefDataManager
 * @constructor
 * @param class_name {string}
 */
function DocManager(class_name) {

	this._obj_сonstructor = DocObj;		// ссылка на конструктор элементов

	DocManager.superclass.constructor.call(this, class_name);


}
DocManager._extend(RefDataManager);

/**
 * Конструкторы объектов данных
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 *
 * @module  metadata
 * @submodule meta_objs
 * @requires common
 */


/**
 * ### Абстрактный объект данных
 * Прародитель как ссылочных объектов (документов и справочников), так и регистров с суррогатным ключом и несохраняемых обработок
 *
 * @class DataObj
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 * @constructor
 */
function DataObj(attr, manager) {

	var ref, tmp,
		_ts_ = {},
		_obj = {data_version: ""},
		_is_new = !(this instanceof EnumObj);

	// если объект с такой ссылкой уже есть в базе, возвращаем его и не создаём нового
	if(!(manager instanceof DataProcessorsManager) && !(manager instanceof EnumManager))
		tmp = manager.get(attr, false, true);

	if(tmp)
		return tmp;

	if(manager instanceof EnumManager)
		_obj.ref = ref = attr.name;

	else if(!(manager instanceof RegisterManager)){
		_obj.ref = ref = $p.fix_guid(attr);
		_obj.deleted = false;
		_obj.lc_changed = 0;

	}else
		ref = manager.get_ref(attr);

	/**
	 * Указатель на менеджер данного объекта
	 * @property _manager
	 * @type DataManager
	 * @final
	 */
	this.__define('_manager', {
		value : manager,
		enumerable : false
	});

	/**
	 * Возвращает "истина" для нового (еще не записанного или непрочитанного) объекта
	 * @method is_new
	 * @for DataObj
	 * @return {boolean}
	 */
	this.__define("is_new", {
		value: function(){
			return _is_new;
		},
		enumerable: false
	});

	this.__define("_set_loaded", {
		value: function(ref){
			_is_new = false;
			manager.push(this, ref);
		},
		enumerable: false
	});


	/**
	 * ### Фактическое хранилище данных объекта
	 * Оно же, запись в таблице объекта локальной базы данных
	 * @property _obj
	 * @type Object
	 * @final
	 */
	this.__define("_obj", {
		value: _obj,
		writable: false,
		enumerable: false
	});

	this.__define("_ts_", {
		value: function( name ) {
			if( !_ts_[name] ) {
				_ts_[name] = new TabularSection(name, this);
			}
			return _ts_[name];
		},
		enumerable: false
	});


	if(manager.alatable && manager.push){
		manager.alatable.push(_obj);
		manager.push(this, ref);
	}

}

DataObj.prototype.valueOf = function () {
	return this.ref;
};

/**
 * Обработчик при сериализации объекта
 * @return {*}
 */
DataObj.prototype.toJSON = function () {
	return this._obj;
};

DataObj.prototype._getter = function (f) {

	var mf = this._metadata.fields[f].type,
		mgr, ref;

	if(f == "type" && typeof this._obj[f] == "object")
		return this._obj[f];

	else if(f == "ref"){
		return this._obj[f];

	}else if(mf.is_ref){
		if(mgr = _md.value_mgr(this._obj, f, mf)){
			if(mgr instanceof DataManager)
				return mgr.get(this._obj[f], false);
			else
				return $p.fetch_type(this._obj[f], mgr);
		}else if(this._obj[f]){
			console.log([f, mf, this._obj]);
			return null;
		}

	}else if(mf.date_part)
		return $p.fix_date(this._obj[f], true);

	else if(mf.digits)
		return $p.fix_number(this._obj[f], true);

	else if(mf.types[0]=="boolean")
		return $p.fix_boolean(this._obj[f]);

	else
		return this._obj[f] || "";
};

DataObj.prototype.__setter = function (f, v) {

	var mf = this._metadata.fields[f].type,
		mgr;

	if(f == "type" && v.types)
		this._obj[f] = v;

	else if(f == "ref")

		this._obj[f] = $p.fix_guid(v);

	else if(mf.is_ref){

		this._obj[f] = $p.fix_guid(v);

		mgr = _md.value_mgr(this._obj, f, mf, false, v);

		if(mgr){
			if(mgr instanceof EnumManager){
				if(typeof v == "string")
					this._obj[f] = v;

				else if(!v)
					this._obj[f] = "";

				else if(typeof v == "object")
					this._obj[f] = v.ref || v.name || "";

			}else if(v && v.presentation){
				if(v.type && !(v instanceof DataObj))
					delete v.type;
				mgr.create(v);
			}else if(!(mgr instanceof DataManager))
				this._obj[f] = $p.fetch_type(v, mgr);
		}else{
			if(typeof v != "object")
				this._obj[f] = v;
		}

	}else if(mf.date_part)
		this._obj[f] = $p.fix_date(v, true);

	else if(mf.digits)
		this._obj[f] = $p.fix_number(v, true);

	else if(mf.types[0]=="boolean")
		this._obj[f] = $p.fix_boolean(v);

	else
		this._obj[f] = v;
};

DataObj.prototype.__notify = function (f) {
	Object.getNotifier(this).notify({
		type: 'update',
		name: f,
		oldValue: this._obj[f]
	});
};

DataObj.prototype._setter = function (f, v) {

	if(this._obj[f] == v)
		return;

	this.__notify(f);

	this.__setter(f, v);

};

DataObj.prototype._getter_ts = function (f) {
	return this._ts_(f);
};

DataObj.prototype._setter_ts = function (f, v) {
	var ts = this._ts_(f);
	if(ts instanceof TabularSection && Array.isArray(v))
		ts.load(v);
};


/**
 * Читает объект из внешней датабазы асинхронно.
 * @method load
 * @for DataObj
 * @return {Promise.<DataObj>} - промис с результатом выполнения операции
 * @async
 */
DataObj.prototype.load = function(){

	var tObj = this;

	function callback_1c(res){		// инициализация из датабазы 1C

		if(typeof res == "string")
			res = JSON.parse(res);
		if($p.msg.check_soap_result(res))
			return;

		var ref = $p.fix_guid(res);
		if(tObj.is_new() && !$p.is_empty_guid(ref))
			tObj._set_loaded(ref);

		return tObj._mixin(res);      // заполнить реквизиты шапки и табличных частей
	}

	if(tObj._manager.cachable && !tObj.is_new())
		return Promise.resolve(tObj);

	if(tObj.ref == $p.blank.guid){
		if(tObj instanceof CatObj)
			tObj.id = "000000000";
		else
			tObj.number_doc = "000000000";
		return Promise.resolve(tObj);

	}else if($p.job_prm.rest || $p.job_prm.irest_enabled)
		return _rest.load_obj(tObj);

	else
		return _load({
			class_name: tObj._manager.class_name,
			action: "load",
			ref: tObj.ref
		})
			.then(callback_1c);

};

/**
 * ### Записывает объект
 * Ввыполняет подписки на события перед записью и после записи
 * В зависимости от настроек, выполняет запись объекта во внешнюю базу данных
 * @param [post] {Boolean|undefined} - проведение или отмена проведения или просто запись
 * @param [mode] {Boolean} - режим проведения документа [Оперативный, Неоперативный]
 * @return {Promise.<T>} - промис с результатом выполнения операции
 * @async
 */
DataObj.prototype.save = function (post, operational) {

	var saver,
		before_save_res = this._manager.handle_event(this, "before_save");

	// Если процедуры перед записью завершились неудачно или запись выполнена нестандартным способом - не продолжаем
	if(before_save_res === false)
		return Promise.resolve(this);
	else if(typeof before_save_res === "object" && before_save_res.then)
		return before_save_res;

	if(this instanceof DocObj && $p.blank.date == this.date)
		this.date = new Date();

	// если доступен irest - сохраняем через него, иначе - стандартным сервисом
	if($p.job_prm.offline)
		saver = function (obj) {
			return Promise.resolve(obj);
		};
	else{
		saver = $p.job_prm.irest_enabled ? _rest.save_irest : _rest.save_rest;
	}


	// Сохраняем во внешней базе
	return saver(this, {
		post: post,
		operational: operational
	})

		// и выполняем обработку после записи
		.then(function (obj) {
			return obj._manager.handle_event(obj, "after_save");
		});
};

/**
 * Проверяет, является ли ссылка объекта пустой
 * @method empty
 * @return {boolean} - true, если ссылка пустая
 */
DataObj.prototype.empty = function(){
	return $p.is_empty_guid(this._obj.ref);
};


/**
 * Метаданные текущего объекта
 * @property _metadata
 * @for DataObj
 * @type Object
 * @final
 */
DataObj.prototype.__define('_metadata', {
	get : function(){ return this._manager.metadata()},
	enumerable : false
});

/**
 * guid ссылки объекта
 * @property ref
 * @for DataObj
 * @type String
 */
DataObj.prototype.__define('ref', {
	get : function(){ return this._obj.ref},
	set : function(v){ this._obj.ref = $p.fix_guid(v)},
	enumerable : true,
	configurable: true
});

/**
 * Пометка удаления
 * @property deleted
 * @for DataObj
 * @type Boolean
 */
DataObj.prototype.__define('deleted', {
	get : function(){ return this._obj.deleted},
	set : function(v){
		this.__notify('deleted');
		this._obj.deleted = !!v;
	},
	enumerable : true,
	configurable: true
});

/**
 * Версия данных для контроля изменения объекта другим пользователем
 * @property data_version
 * @for DataObj
 * @type String
 */
DataObj.prototype.__define('data_version', {
	get : function(){ return this._obj.data_version || ""},
	set : function(v){
		this.__notify('data_version');
		this._obj.data_version = String(v);
	},
	enumerable : true
});

/**
 * Время последнего изменения объекта в миллисекундах от начала времён для целей синхронизации
 * @property lc_changed
 * @for DataObj
 * @type Number
 */
DataObj.prototype.__define('lc_changed', {
	get : function(){ return this._obj.lc_changed || 0},
	set : function(v){
		this.__notify('lc_changed');
		this._obj.lc_changed = $p.fix_number(v, true);
	},
	enumerable : true,
	configurable: true
});



/**
 * ### Абстрактный класс СправочникОбъект
 * @class CatObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 * @async
 */
function CatObj(attr, manager) {

	var _presentation = "";

	// выполняем конструктор родительского объекта
	CatObj.superclass.constructor.call(this, attr, manager);

	/**
	 * Представление объекта
	 * @property presentation
	 * @for CatObj
	 * @type String
	 */
	this.__define('presentation', {
		get : function(){

			if(this.name || this.id)
				return this.name || this.id || this._metadata["obj_presentation"];
			else
				return _presentation;

		},
		set : function(v){
			if(v)
				_presentation = String(v);
		},
		enumerable : false
	});

	if(attr && typeof attr == "object"){
		if(attr._not_set_loaded){
			delete attr._not_set_loaded;
			this._mixin(attr);
		}else{
			this._mixin(attr);
			if(!$p.is_empty_guid(this.ref) && (attr.id || attr.name))
				this._set_loaded(this.ref);
		}
	}

}
CatObj._extend(DataObj);

/**
 * Код элемента справочника
 * @property id
 * @type String|Number
 */
CatObj.prototype.__define('id', {
	get : function(){ return this._obj.id || ""},
	set : function(v){
		this.__notify('id');
		this._obj.id = v;
	},
	enumerable : true
});

/**
 * Наименование элемента справочника
 * @property name
 * @type String
 */
CatObj.prototype.__define('name', {
	get : function(){ return this._obj.name || ""},
	set : function(v){
		this.__notify('name');
		this._obj.name = String(v);
	},
	enumerable : true
});


/**
 * ### Абстрактный класс ДокументОбъект
 * @class DocObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 * @async
 */
function DocObj(attr, manager) {

	var _presentation = "";

	// выполняем конструктор родительского объекта
	DocObj.superclass.constructor.call(this, attr, manager);

	/**
	 * Представление объекта
	 * @property presentation
	 * @for DocObj
	 * @type String
	 */
	this.__define('presentation', {
		get : function(){

			if(this.number_str || this.number_doc)
				return this._metadata["obj_presentation"] + ' №' + (this.number_str || this.number_doc) + " от " + $p.dateFormat(this.date, $p.dateFormat.masks.ru);
			else
				return _presentation;

		},
		set : function(v){
			if(v)
				_presentation = String(v);
		},
		enumerable : false
	});

	if(attr && typeof attr == "object")
		this._mixin(attr);

	if(!$p.is_empty_guid(this.ref) && attr.number_doc)
		this._set_loaded(this.ref);
}
DocObj._extend(DataObj);

/**
 * Номер документа
 * @property number_doc
 * @type {String|Number}
 */
DocObj.prototype.__define('number_doc', {
	get : function(){ return this._obj.number_doc || ""},
	set : function(v){
		this.__notify('number_doc');
		this._obj.number_doc = v;
	},
	enumerable : true
});

/**
 * Дата документа
 * @property date
 * @type {Date}
 */
DocObj.prototype.__define('date', {
	get : function(){ return this._obj.date || $p.blank.date},
	set : function(v){
		this.__notify('date');
		this._obj.date = $p.fix_date(v, true);
	},
	enumerable : true
});

/**
 * Признак проведения
 * @property posted
 * @type {Boolean}
 */
DocObj.prototype.__define('posted', {
	get : function(){ return this._obj.posted || false},
	set : function(v){
		this.__notify('posted');
		this._obj.posted = $p.fix_boolean(v);
	},
	enumerable : true
});



/**
 * ### Абстрактный класс ОбработкаОбъект
 * @class DataProcessorObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {DataManager}
 */
function DataProcessorObj(attr, manager) {

	// выполняем конструктор родительского объекта
	DataProcessorObj.superclass.constructor.call(this, attr, manager);

	var f, cmd = manager.metadata();
	for(f in cmd.fields)
		attr[f] = $p.fetch_type("", cmd.fields[f].type);
	for(f in cmd["tabular_sections"])
		attr[f] = [];

	this._mixin(attr);

	/**
	 * Освобождает память и уничтожает объект
	 * @method unload
	 */
	this.unload = function(){
		for(f in this){
			if(this[f] instanceof TabularSection){
				this[f].clear();
				delete this[f];
			}else if(typeof this[f] != "function"){
				delete this[f];
			}
		}
	};
}
DataProcessorObj._extend(DataObj);

/**
 * ### Абстрактный класс значения перечисления
 * Имеет fake-ссылку и прочие атрибуты объекта данных, но фактически - это просто значение перечисления
 *
 * @class EnumObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {EnumManager}
 */
function EnumObj(attr, manager) {

	// выполняем конструктор родительского объекта
	EnumObj.superclass.constructor.call(this, attr, manager);

	if(attr && typeof attr == "object")
		this._mixin(attr);

}
EnumObj._extend(DataObj);


/**
 * Порядок элемента перечисления
 * @property order
 * @for EnumObj
 * @type Number
 */
EnumObj.prototype.__define('order', {
	get : function(){ return this._obj.sequence},
	set : function(v){ this._obj.sequence = parseInt(v)},
	enumerable : true
});

/**
 * Наименование элемента перечисления
 * @property name
 * @for EnumObj
 * @type String
 */
EnumObj.prototype.__define('name', {
	get : function(){ return this._obj.ref},
	set : function(v){ this._obj.ref = String(v)},
	enumerable : true
});

/**
 * Синоним элемента перечисления
 * @property synonym
 * @for EnumObj
 * @type String
 */
EnumObj.prototype.__define('synonym', {
	get : function(){ return this._obj.synonym || ""},
	set : function(v){ this._obj.synonym = String(v)},
	enumerable : true
});

/**
 * Представление объекта
 * @property presentation
 * @for EnumObj
 * @type String
 */
EnumObj.prototype.__define('presentation', {
	get : function(){
		return this.synonym || this.name;
	},
	enumerable : false
});

/**
 * Проверяет, является ли ссылка объекта пустой
 * @method empty
 * @for EnumObj
 * @return {boolean} - true, если ссылка пустая
 */
EnumObj.prototype.empty = function(){
	return this.ref == "_";
};


/**
 * ### Запись (строка) регистра
 * Используется во всех типах регистров (сведений, накопления, бухгалтерии)
 *
 * @class RegisterRow
 * @extends DataObj
 * @constructor
 * @param attr {object} - объект, по которому запись будет заполнена
 * @param manager {InfoRegManager|AccumRegManager}
 */
function RegisterRow(attr, manager){

	// выполняем конструктор родительского объекта
	RegisterRow.superclass.constructor.call(this, attr, manager);

	if(attr && typeof attr == "object")
		this._mixin(attr);
}
RegisterRow._extend(DataObj);

/**
 * Метаданные строки регистра
 * @property _metadata
 * @for RegisterRow
 * @type Object
 */
RegisterRow.prototype.__define('_metadata', {
	get : function(){
		var cm = this._manager.metadata();
		if(!cm.fields)
			cm.fields = ({})._mixin(cm.dimensions)._mixin(cm.resources);
		return cm;
	},
	enumerable : false
});

RegisterRow.prototype.__define('ref', {
	get : function(){ return this._manager.get_ref(this)},
	enumerable : true
});


/**
 * Конструкторы табличных частей
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 *
 * @module  metadata
 * @submodule meta_tabulars
 * @requires common
 */


/**
 * ### Абстрактный объект табличной части
 * - Физически, данные хранятся в {{#crossLink "DataObj"}}{{/crossLink}}, а точнее - в поле типа массив и именем табчасти объекта `_obj`
 * - Класс предоставляет методы для доступа и манипуляции данными табчасти
 *
 * @class TabularSection
 * @constructor
 * @param name {String} - имя табчасти
 * @param owner {DataObj} - владелец табличной части
 */
function TabularSection(name, owner){

	// Если табчасти нет в данных владельца - создаём
	if(!owner._obj[name])
		owner._obj[name] = [];

	/**
	 * Имя табличной части
	 * @property _name
	 * @type String
	 */
	this.__define('_name', {
		value : name,
		enumerable : false
	});

	/**
	 * Объект-владелец табличной части
	 * @property _owner
	 * @type DataObj
	 */
	this.__define('_owner', {
		value : owner,
		enumerable : false
	});

	/**
	 * ### Фактическое хранилище данных объекта
	 * Оно же, запись в таблице объекта локальной базы данных
	 * @property _obj
	 * @type Object
	 */
	this.__define("_obj", {
		value: owner._obj[name],
		writable: false,
		enumerable: false
	});
}

TabularSection.prototype.toString = function(){
	return "Табличная часть " + this._owner._manager.class_name + "." + this._name
};

/**
 * Возвращает строку табчасти по индексу
 * @method get
 * @param index {Number} - индекс строки табчасти
 * @return {TabularSectionRow}
 */
TabularSection.prototype.get = function(index){
	return this._obj[index]._row;
};

/**
 * Возвращает количество элементов в табчасти
 * @method count
 * @return {Number}
 */
TabularSection.prototype.count = function(){return this._obj.length};

/**
 * очищает табличнут часть
 * @method clear
 */
TabularSection.prototype.clear = function(do_not_notify){
	for(var i in this._obj)
		delete this._obj[i];
	this._obj.length = 0;

	if(!do_not_notify)
		Object.getNotifier(this._owner).notify({
			type: 'rows',
			tabular: this._name
		});
};

/**
 * Удаляет строку табличной части
 * @method del
 * @param val {Number|TabularSectionRow} - индекс или строка табчасти
 */
TabularSection.prototype.del = function(val){
	var index, _obj = this._obj, j = 0;
	if(typeof val == "undefined")
		return;
	else if(typeof val == "number")
		index = val;
	else if(_obj[val.row-1]._row === val)
		index = val.row-1;
	else{
		for(var i in _obj)
			if(_obj[i]._row === val){
				index = Number(i);
				delete _obj[i]._row;
				break;
			}
	}
	if(index == undefined)
		return;

	_obj.splice(index, 1);

	for(var i in _obj){
		j++;
		_obj[i].row = j;
	}

	Object.getNotifier(this._owner).notify({
		type: 'rows',
		tabular: this._name
	});
};

/**
 * Находит первую строку, содержащую значение
 * @method find
 * @param val {*}
 * @return {TabularSectionRow}
 */
TabularSection.prototype.find = function(val){
	var res = $p._find(this._obj, val);
	if(res)
		return res._row;
};

/**
 * Находит строки, соответствующие отбору. Если отбор пустой, возвращаются все строки табчасти
 * @method find_rows
 * @param [selection] {Object} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"}
 * @param [callback] {Function} - в который передается строка табчасти на каждой итерации
 * @return {Array}
 */
TabularSection.prototype.find_rows = function(selection, callback){

	var t = this,
		cb = callback ? function (row) {
			return callback.call(t, row._row);
		} : null;

	return $p._find_rows.call(t, t._obj, selection, cb);

};

/**
 * Меняет местами строки табчасти
 * @method swap
 * @param rowid1 {number}
 * @param rowid2 {number}
 */
TabularSection.prototype.swap = function(rowid1, rowid2){
	var tmp = this._obj[rowid1];
	this._obj[rowid1] = this._obj[rowid2];
	this._obj[rowid2] = tmp;

	Object.getNotifier(this._owner).notify({
		type: 'rows',
		tabular: this._name
	});
};

/**
 * добавляет строку табчасти
 * @method add
 * @param attr {object} - объект со значениями полей. если некого поля нет в attr, для него используется пустое значение типа
 * @return {TabularSectionRow}
 */
TabularSection.prototype.add = function(attr, do_not_notify){

	var row = new this._owner._manager._ts_сonstructors[this._name](this);

	if(!attr)
		attr = {};

	// присваиваем типизированные значения по умолчанию
	for(var f in row._metadata.fields)
		row[f] = attr[f] || "";

	row._obj.row = this._obj.push(row._obj);
	row._obj.__define("_row", {
		value: row,
		enumerable: false
	});

	if(!do_not_notify)
		Object.getNotifier(this._owner).notify({
			type: 'rows',
			tabular: this._name
		});

	attr = null;
	return row;
};

/**
 * Выполняет цикл "для каждого"
 * @method each
 * @param fn {Function} - callback, в который передается строка табчасти
 */
TabularSection.prototype.each = function(fn){
	var t = this;
	t._obj.forEach(function(row){
		return fn.call(t, row._row);
	});
};

/**
 * загружает табличнут часть из массива объектов
 * @method load
 * @param aattr {Array} - массив объектов к загрузке
 */
TabularSection.prototype.load = function(aattr){
	var t = this, arr;
	t.clear(true);
	if(aattr instanceof TabularSection)
		arr = aattr._obj;
	else if(Array.isArray(aattr))
		arr = aattr;
	if(arr)
		arr.forEach(function(row){
			t.add(row, true);
	});

	Object.getNotifier(this._owner).notify({
		type: 'rows',
		tabular: this._name
	});
};

/**
 * Перезаполняет грид данными табчасти с учетом отбора
 * @method sync_grid
 * @param grid {dhtmlxGrid} - элемент управления
 * @param [selection] {Object} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"}
 */
TabularSection.prototype.sync_grid = function(grid, selection){
	var grid_data = {rows: []},
		columns = [];

	for(var i = 0; i<grid.getColumnCount(); i++)
		columns.push(grid.getColumnId(i));

	grid.clearAll();
	this.find_rows(selection, function(r){
		var data = [];
		columns.forEach(function (f) {
			if($p.is_data_obj(r[f]))
				data.push(r[f].presentation);
			else
				data.push(r[f]);
		});
		grid_data.rows.push({ id: r.row, data: data });
	});
	try{ grid.parse(grid_data, "json"); } catch (e){}
	grid.callEvent("onGridReconstructed", []);

};

TabularSection.prototype.toJSON = function () {
	return this._obj;
};


/**
 * ### Aбстрактная строка табличной части
 * @class TabularSectionRow
 * @constructor
 * @param owner {TabularSection} - табличная часть, которой принадлежит строка
 */
function TabularSectionRow(owner){

	var _obj = {};

	/**
	 * Указатель на владельца данной строки табличной части
	 * @property _owner
	 * @type TabularSection
	 */
	this.__define('_owner', {
		value : owner,
		enumerable : false
	});

	/**
	 * ### Фактическое хранилище данных объекта
	 * Отображается в поле типа json записи в таблице объекта локальной базы данных
	 * @property _obj
	 * @type Object
	 */
	this.__define("_obj", {
		value: _obj,
		writable: false,
		enumerable: false
	});

}

/**
 * Метаданые строки табличной части
 * @property _metadata
 * @for TabularSectionRow
 * @type Number
 */
TabularSectionRow.prototype.__define('_metadata', {
	get : function(){ return this._owner._owner._metadata["tabular_sections"][this._owner._name]},
	enumerable : false
});

/**
 * Номер строки табличной части
 * @property row
 * @for TabularSectionRow
 * @type Number
 * @final
 */
TabularSectionRow.prototype.__define("row", {
	get : function(){ return this._obj.row || 0},
	enumerable : true
});

/**
 * Копирует строку табличной части
 * @method _clone
 * @for TabularSectionRow
 * @type Number
 */
TabularSectionRow.prototype.__define("_clone", {
	value : function(){
		return new this._owner._owner._manager._ts_сonstructors[this._owner._name](this._owner)._mixin(this._obj);
	},
	enumerable : false
});

TabularSectionRow.prototype._getter = DataObj.prototype._getter;

TabularSectionRow.prototype._setter = function (f, v) {

	if(this._obj[f] == v)
		return;

	Object.getNotifier(this._owner._owner).notify({
		type: 'row',
		row: this,
		tabular: this._owner._name,
		name: f,
		oldValue: this._obj[f]
	});

	DataObj.prototype.__setter.call(this, f, v);

};


/**
 * Дополняет классы {{#crossLink "DataObj"}}{{/crossLink}} и {{#crossLink "DataManager"}}{{/crossLink}} методами чтения,<br />
 * записи и синхронизации через стандартный интерфейс <a href="http://its.1c.ru/db/v83doc#bookmark:dev:TI000001362">OData</a>
 * /a/unf/odata/standard.odata
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 *
 * @module  metadata
 * @submodule rest
 * @requires common
 */

/**
 * Методы общего назначения для работы с rest
 * @class Rest
 * @static
 */
function Rest(){

	/**
	 * Форматирует период для подстановки в запрос rest
	 * @method filter_date
	 * @param fld {String} - имя поля для фильтрации по датам
	 * @param [dfrom] {Date} - дата начала
	 * @param [dtill] {Date} - дата окончания
	 * @return {String}
	 */
	this.filter_date = function (fld, dfrom, dtill) {
		if(!dfrom)
			dfrom = new Date("2015-01-01");
		var res = fld + " gt datetime'" + $p.dateFormat(dfrom, $p.dateFormat.masks.isoDateTime) + "'";
		if(dtill)
			res += " and " + fld + " lt datetime'" + $p.dateFormat(dtill, $p.dateFormat.masks.isoDateTime) + "'";
		return res;
	};

	/**
	 * Преобразует данные, прочитанные из rest-сервиса в json-прототип DataObj
	 * @method to_data
	 * @param rdata {Object} - фрагмент ответа rest
	 * @param mgr {DataManager}
	 * @return {Object}
	 */
	this.to_data = function (rdata, mgr) {
		var o = {},
			mf = mgr.metadata().fields,
			mts = mgr.metadata().tabular_sections,
			ts, f, tf, row, syn, synts, vmgr;

		if(mgr instanceof RefDataManager){
			if(rdata.hasOwnProperty("DeletionMark"))
				o.deleted = rdata.DeletionMark;
			if(rdata.hasOwnProperty("DataVersion"))
				o.data_version = rdata.DataVersion;
			if(rdata.hasOwnProperty("Ref_Key"))
				o.ref = rdata.Ref_Key;
		}else{
			mf = []._mixin(mgr.metadata().dimensions)._mixin(mgr.metadata().resources);
		}

		if(mgr instanceof DocManager){
			if(rdata.hasOwnProperty("Number"))
				o.number_doc = rdata.Number || rdata.number_doc;
			else if(rdata.hasOwnProperty("number_doc"))
				o.number_doc = rdata.number_doc;
			if(rdata.hasOwnProperty("Date"))
				o.date = rdata.Date;
			else if(rdata.hasOwnProperty("date"))
				o.date = rdata.date;
			if(rdata.hasOwnProperty("Posted"))
				o.posted = rdata.Posted;
			else if(rdata.hasOwnProperty("posted"))
				o.posted = rdata.posted;

		} else {
			if(mgr.metadata().main_presentation_name){
				if(rdata.hasOwnProperty("Description"))
					o.name = rdata.Description;
				else if(rdata.hasOwnProperty("name"))
					o.name = rdata.name;
			}

			if(mgr.metadata().code_length){
				if(rdata.hasOwnProperty("Code"))
					o.id = rdata.Code;
				else if(rdata.hasOwnProperty("id"))
					o.id = rdata.id;
			}
		}

		for(f in mf){
			if(rdata.hasOwnProperty(f)){
				o[f] = rdata[f];
			}else{
				syn = _md.syns_1с(f);
				if(syn.indexOf("_Key") == -1 && mf[f].type.is_ref && rdata[syn+"_Key"])
					syn+="_Key";
				if(!rdata.hasOwnProperty(syn))
					continue;
				o[f] = rdata[syn];
			}
		}

		for(ts in mts){
			synts = (ts == "extra_fields" || rdata.hasOwnProperty(ts)) ? ts : _md.syns_1с(ts);
			if(!rdata.hasOwnProperty(synts))
				continue;
			o[ts] = [];
			if(rdata[synts]){
				rdata[synts].sort(function (a, b) {
					return (a.LineNumber || a.row) > (b.LineNumber || b.row);
				});
				rdata[synts].forEach(function (r) {
					row = {};
					for(tf in mts[ts].fields){
						syn = (r.hasOwnProperty(tf) || (ts == "extra_fields" && (tf == "property" || tf == "value"))) ? tf : _md.syns_1с(tf);
						if(syn.indexOf("_Key") == -1 && mts[ts].fields[tf].type.is_ref && r[syn+"_Key"])
							syn+="_Key";
						row[tf] = r[syn];
					}
					o[ts].push(row);
				});
			}
		}

		return o;
	};

	/**
	 * Выполняет запрос к rest-сервису и возвращает массив прототипов DataObj
	 * @param attr {Object} - параметры запроса
	 * @param mgr {DataManager}
	 * @return {Promise.<T>}
	 */
	this.ajax_to_data = function (attr, mgr) {
		return $p.ajax.get_ex(attr.url, attr)
			.then(function (req) {
				return JSON.parse(req.response);
			})
			.then(function (res) {
				var data = [];
				res.value.forEach(function (rdata) {
					data.push(_rest.to_data(rdata, mgr));
				});
				return data;
			});
	};

	this.build_select = function (attr, mgr) {
		var s, f, syn, type, select_str = "";

		function build_condition(fld, val){

			if(typeof val == "function"){
				f += val(mgr, fld);

			}else{

				syn = _md.syns_1с(fld);
				type = _md.get(mgr.class_name, fld);
				if(type){
					type = type.type;
					if(type.is_ref){
						if(syn.indexOf("_Key") == -1 && type.types.length && type.types[0].indexOf("enm.")==-1)
							syn += "_Key";
					}

					if(type.types.length){

						if(["boolean", "number"].indexOf(typeof val) != -1 )
							f += syn + " eq " + val;

						else if((type.is_ref && typeof val != "object") || val instanceof DataObj)
							f += syn + " eq guid'" + val + "'";

						else if(typeof val == "string")
							f += syn + " eq '" + val + "'";

						else if(typeof val == "object"){
							// TODO: учесть in, not, like
							if(val.hasOwnProperty("like"))
								f += syn + " like '%" + val.like + "%'";

							else if(val.hasOwnProperty("not")){
								f += " not (" + build_condition(fld, val.not) + ") ";
							}

							else if(val.hasOwnProperty("in")){
								f += (syn + " in (") + (type.is_ref ? val.in.map(function(v){return "guid'" + v + "'"}).join(",") : val.in.join(",")) + ") ";
							}
						}
					}
				}
			}
		}

		function build_selection(sel){
			for(var fld in sel){

				if(!f)
					f = "&$filter=";
				else
					f += " and ";

				if(fld == "or" && Array.isArray(sel[fld])){
					var first = true;
					sel[fld].forEach(function (element) {

						if(first){
							f += " ( ";
							first = false;
						}else
							f += " or ";

						var key = Object.keys(element)[0];
						build_condition(key, element[key]);

					});
					f += " ) ";

				}else
					build_condition(fld, sel[fld]);

			}
		}

		if(!attr)
			attr = {};

		// учитываем нужные поля
		if(attr.fields){
			attr.fields.forEach(function(fld){
				if(fld == "ref")
					syn = "Ref_Key";
				else{
					syn = _md.syns_1с(fld);
					type = _md.get(mgr.class_name, fld).type;
					if(type.is_ref){
						if(syn.indexOf("_Key") == -1 && type.types.length && type.types[0].indexOf("enm.")==-1)
							syn += "_Key";
					}
				}
				if(!s)
					s = "&$select=";
				else
					s += ",";
				s += syn;
			});
			select_str += s;
		}

		// учитываем отбор
		// /a/unf/hs/rest/Catalog_Контрагенты?allowedOnly=true&$format=json&$top=30&$select=Ref_Key,Description&$filter=IsFolder eq false and Description like '%б%'
		if(attr.selection){
			if(typeof attr.selection == "function"){

			}else if(Array.isArray(attr.selection))
				attr.selection.forEach(build_selection);

			else
				build_selection(attr.selection);

			if(f)
				select_str += f;
		}


		// для простых запросов используем стандартный odata 1c
		if($p.job_prm.rest &&
			mgr.rest_name.indexOf("Module_") == -1 &&
			mgr.rest_name.indexOf("DataProcessor_") == -1 &&
			mgr.rest_name.indexOf("Report_") == -1 &&
			select_str.indexOf(" like ") == -1 &&
			select_str.indexOf(" in ") == -1 &&
			!mgr.metadata().irest )
			$p.ajax.default_attr(attr, $p.job_prm.rest_url());
		// для сложных отборов либо при явном irest в метаданных, используем наш irest
		else
			$p.ajax.default_attr(attr, $p.job_prm.irest_url());

		// начинаем строить url: только разрешенные + top
		attr.url += mgr.rest_name + "?allowedOnly=true&$format=json&$top=" + (attr.top || 300) + select_str;
		//a/unf/odata/standard.odata/Document_ЗаказПокупателя?allowedOnly=true&$format=json&$select=Ref_Key,DataVersion
	};

	/**
	 * Загружает список объектов из rest-сервиса, обрезанный отбором
	 * @method load_array
	 * @for DataManager
	 * @param attr {Object} - параметры запроса
	 * @param [attr.selection] {Object} - условия отбора
	 * @param [attr.top] {Number} - максимальное число загружаемых записей
	 * @param mgr {DataManager}
	 * @return {Promise.<T>} - промис с массивом загруженных прототипов DataObj
	 * @async
	 */
	this.load_array = function (attr, mgr) {

		_rest.build_select(attr, mgr);

		return _rest.ajax_to_data(attr, mgr);
	};

	/**
	 * Читает объект из rest-сервиса
	 * @return {Promise.<T>} - промис с загруженным объектом
	 */
	this.load_obj = function (tObj) {

		var attr = {};
		$p.ajax.default_attr(attr, (!tObj._metadata.irest && $p.job_prm.rest) ? $p.job_prm.rest_url() : $p.job_prm.irest_url());
		attr.url += tObj._manager.rest_name + "(guid'" + tObj.ref + "')?$format=json";

		return $p.ajax.get_ex(attr.url, attr)
			.then(function (req) {
				return JSON.parse(req.response);
			})
			.then(function (res) {
				tObj._mixin(_rest.to_data(res, tObj._manager))._set_loaded();
				return tObj;
			})
			.catch(function (err) {
				if(err.status==404)
					return tObj;
				else
					$p.record_log(err);
			});
	};

	/**
	 * Сохраняет объект в базе irest-сервиса (наш http-интерфейс)
	 * @param tObj {DataObj} - сохраняемый объект
	 * @param attr {Object} - параметры сохранения
	 * @param attr.[url] {String} - если не указано, будет использован адрес irest из параметров работы программы
	 * @param attr.[username] {String}
	 * @param attr.[password] {String}
	 * @param attr.[post] {Boolean|undefined} - проведение или отмена проведения или просто запись
	 * @param attr.[operational] {Boolean|undefined} - режим проведения документа [Оперативный, Неоперативный]
	 * @return {Promise.<T>}
	 * @async
	 */
	this.save_irest = function (tObj, attr) {

		var post_data = JSON.stringify(tObj),
			prm = (attr.post != undefined ? ",post="+attr.post : "")+
				(attr.operational != undefined ? ",operational="+attr.operational : "");

		$p.ajax.default_attr(attr, $p.job_prm.irest_url());
		attr.url += tObj._manager.rest_name + "(guid'"+tObj.ref+"'"+prm+")";

		return $p.ajax.post_ex(attr.url, post_data, attr)
			.then(function (req) {
				return JSON.parse(req.response);
			})
			.then(function (res) {
				return tObj._mixin(res);
			});
	};

	/**
	 * Сохраняет объект в базе rest-сервиса
	 * @param tObj {DataObj} - сохраняемый объект
	 * @param attr {Object} - параметры сохранения
	 * @param attr.[url] {String} - если не указано, будет использован адрес rest из параметров работы программы
	 * @param attr.[username] {String}
	 * @param attr.[password] {String}
	 * @param attr.[post] {Boolean|undefined} - проведение или отмена проведения или просто запись
	 * @param attr.[operational] {Boolean} - режим проведения документа [Оперативный, Неоперативный]
	 * @return {Promise.<T>}
	 * @async
	 */
	this.save_rest = function (tObj, attr) {

		var atom = tObj.to_atom(),
			url;

		$p.ajax.default_attr(attr, $p.job_prm.rest_url());
		url = attr.url + tObj._manager.rest_name;

		// проверяем наличие ссылки в базе приёмника
		attr.url = url + "(guid'" + tObj.ref + "')?$format=json&$select=Ref_Key,DeletionMark";

		return $p.ajax.get_ex(attr.url, attr)
			.catch(function (err) {
				if(err.status == 404){
					return {response: JSON.stringify({is_new: true})};
				}else
					return Promise.reject(err);
			})
			.then(function (req) {
				return JSON.parse(req.response);
			})
			.then(function (data) {
				// если объект существует на стороне приемника, выполняем patch, иначе - post
				if(data.is_new)
					return $p.ajax.post_ex(url, atom, attr);
				else
					return $p.ajax.patch_ex(url + "(guid'" + tObj.ref + "')", atom, attr);
			})
			.then(function (req) {
				var data = xmlToJSON.parseString(req.response, {
					mergeCDATA: false, // extract cdata and merge with text
					grokAttr: true, // convert truthy attributes to boolean, etc
					grokText: false, // convert truthy text/attr to boolean, etc
					normalize: true, // collapse multiple spaces to single space
					xmlns: false, // include namespaces as attribute in output
					namespaceKey: '_ns', // tag name for namespace objects
					textKey: '_text', // tag name for text nodes
					valueKey: '_value', // tag name for attribute values
					attrKey: '_attr', // tag for attr groups
					cdataKey: '_cdata', // tag for cdata nodes (ignored if mergeCDATA is true)
					attrsAsObject: false, // if false, key is used as prefix to name, set prefix to '' to merge children and attrs.
					stripAttrPrefix: true, // remove namespace prefixes from attributes
					stripElemPrefix: true, // for elements of same name in diff namespaces, you can enable namespaces and access the nskey property
					childrenAsArray: false // force children into arrays
				});
				if(data.entry && data.entry.content && data.entry.updated){
					var p = data.entry.content.properties, r = {}, v;
					r.lc_changed = new Date(data.entry.updated._text);
					for(var i in p){
						if(i.indexOf("_")==0)
							continue;
						if(v = p[i].element){
							r[i] = [];
							if(Array.isArray(v)){
								for(var n in v){
									r[i][n] = {};
									for(var j in v[n])
										if(j.indexOf("_")!=0)
											r[i][n][j] = v[n][j]._text === "false" ? false : v[n][j]._text;
								}
							}else{
								r[i][0] = {};
								for(var j in v)
									if(j.indexOf("_")!=0)
										r[i][0][j] = v[j]._text === "false" ? false : v[j]._text;
							}
						}else
							r[i] = p[i]._text === "false" ? false : p[i]._text;
					}
					return _rest.to_data(r, tObj._manager);
				}
			})
			.then(function (res) {
				return tObj._mixin(res);
			});

	};
}

var _rest = $p.rest = new Rest();


/**
 * ### Имя объектов этого менеджера для запросов к rest-серверу
 * Идентификатор формируется по принципу: ПрефиксИмени_ИмяОбъектаКонфигурации_СуффиксИмени
 * - Справочник _Catalog_
 * - Документ _Document_
 * - Журнал документов _DocumentJournal_
 * - Константа _Constant_
 * - План обмена _ExchangePlan_
 * - План счетов _ChartOfAccounts_
 * - План видов расчета _ChartOfCalculationTypes_
 * - План видов характеристик _ChartOfCharacteristicTypes_
 * - Регистр сведений _InformationRegister_
 * - Регистр накопления _AccumulationRegister_
 * - Регистр расчета _CalculationRegister_
 * - Регистр бухгалтерии _AccountingRegister_
 * - Бизнес-процесс _BusinessProcess_
 * - Задача _Task_
 * - Обработка _DataProcessor_
 * - Отчет _Report_
 * - Общий модуль _Module_
 * - Внешняя обработка _ExternalDataProcessor_
 * - Внешний отчет _ExternalReport_
 *
 * @property rest_name
 * @for DataManager
 * @type String
 * @final
 */
DataManager.prototype.__define("rest_name", {
	get : function(suffix){
		var fp = this.class_name.split("."),
			csyn = {
				cat: "Catalog",
				doc: "Document",
				ireg: "InformationRegister",
				areg: "AccumulationRegister",
				cch: "ChartOfCharacteristicTypes",
				cacc: "ChartOfAccounts"
			};
		return csyn[fp[0]] + "_" + _md.syns_1с(fp[1]) + (suffix || "");
	},
	enumerable : false
});


DataManager.prototype.rest_tree = function (attr) {

	var t = this,
		cmd = t.metadata(),
		flds = [], ares = [], o, ro, syn, mf;

	$p.ajax.default_attr(attr, (!cmd.irest && $p.job_prm.rest) ? $p.job_prm.rest_url() : $p.job_prm.irest_url());
	attr.url += this.rest_name + "?allowedOnly=true&$format=json&$top=1000&$select=Ref_Key,DeletionMark,Parent_Key,Description&$filter=IsFolder eq true";

	return $p.ajax.get_ex(attr.url, attr)
		.then(function (req) {
			return JSON.parse(req.response);
		})
		.then(function (res) {
			for(var i = 0; i < res.value.length; i++) {
				ro = res.value[i];
				o = {
					ref: ro["Ref_Key"],
					deleted: ro["DeletionMark"],
					parent: ro["Parent_Key"],
					presentation: ro["Description"]
				};
				ares.push(o);
			}
			return $p.iface.data_to_tree(ares);
		});

};

DataManager.prototype.rest_selection = function (attr) {

	if(attr.action == "get_tree")
		return this.rest_tree(attr);

	var t = this,
		cmd = t.metadata(),
		flds = [],
		ares = [], o, ro, syn, mf,
		select,
		filter_added;

	select = (function(){

		var s = "$select=Ref_Key,DeletionMark";

		if(cmd.form && cmd.form.selection){
			cmd.form.selection.fields.forEach(function (fld) {
				flds.push(fld);
			});

		}else if(t instanceof DocManager){
			flds.push("posted");
			flds.push("date");
			flds.push("number_doc");

		}else{

			if(cmd["hierarchical"] && cmd["group_hierarchy"])
				flds.push("is_folder");
			else
				flds.push("0 as is_folder");

			if(cmd["main_presentation_name"])
				flds.push("name as presentation");
			else{
				if(cmd["code_length"])
					flds.push("id as presentation");
				else
					flds.push("'...' as presentation");
			}

			if(cmd["has_owners"])
				flds.push("owner");

			if(cmd["code_length"])
				flds.push("id");

		}

		flds.forEach(function(fld){
			var parts;
			if(fld.indexOf(" as ") != -1){
				parts = fld.split(" as ")[0].split(".");
				if(parts.length == 1)
					fld = parts[0];
				else if(parts[0] != "_t_")
					return;
				else
					fld = parts[1]
			}
			if(fld == "0")
				return;
			syn = _md.syns_1с(fld);
			if(_md.get(t.class_name, fld).type.is_ref){
				if(syn.indexOf("_Key") == -1 && _md.get(t.class_name, fld).type.types.length && _md.get(t.class_name, fld).type.types[0].indexOf("enm.")==-1)
					syn += "_Key";
			}

			s += "," + syn;
		});

		flds.push("ref");
		flds.push("deleted");

		return s;

	})();


	$p.ajax.default_attr(attr, (!cmd.irest && $p.job_prm.rest) ? $p.job_prm.rest_url() : $p.job_prm.irest_url());
	attr.url += (cmd.irest && cmd.irest.selection ? cmd.irest.selection : this.rest_name) + "?allowedOnly=true&$format=json&$top=1000&" + select;

	if(_md.get(t.class_name, "date")){
		attr.url += "&$filter=" + _rest.filter_date("Date", attr.date_from, attr.date_till);
		filter_added = true;
	}

	if(attr.parent){
		attr.url += filter_added ? " and " : "&$filter=";
		attr.url += "Parent_Key eq guid'" + attr.parent + "'";
		filter_added = true;
	}

	return $p.ajax.get_ex(attr.url, attr)
		.then(function (req) {
			return JSON.parse(req.response);
		})
		.then(function (res) {
			for(var i = 0; i < res.value.length; i++) {
				ro = res.value[i];
				o = {};
				flds.forEach(function (fld) {

					var fldsyn;

					if(fld == "ref") {
						o[fld] = ro["Ref_Key"];
						return;
					}else if(fld.indexOf(" as ") != -1){
						fldsyn = fld.split(" as ")[1];
						fld = fld.split(" as ")[0].split(".");
						fld = fld[fld.length-1];
					}else
						fldsyn = fld;

					syn = _md.syns_1с(fld);
					mf = _md.get(t.class_name, fld);

					if(syn.indexOf("_Key") == -1 && mf.type.is_ref && mf.type.types.length && mf.type.types[0].indexOf("enm.")==-1)
						syn += "_Key";

					if(mf.type.date_part)
						o[fldsyn] = $p.dateFormat(ro[syn], $p.dateFormat.masks[mf.type.date_part]);

					else if(mf.type.is_ref){
						if(!ro[syn] || ro[syn] == $p.blank.guid)
							o[fldsyn] = "";
						else{
							var mgr	= _md.value_mgr(o, fld, mf.type, false, ro[syn]);
							if(mgr)
								o[fldsyn] = mgr.get(ro[syn]).presentation;
							else
								o[fldsyn] = "";
						}
					}else
						o[fldsyn] = ro[syn];

				});
				ares.push(o);
			}
			return $p.iface.data_to_grid.call(t, ares, attr);
		});

};

InfoRegManager.prototype.rest_slice_last = function(selection){

	if(!selection.period)
		selection.period = $p.date_add_day(new Date(), 1);

	var t = this,
		cmd = t.metadata(),
		period = "Period=datetime'" + $p.dateFormat(selection.period, $p.dateFormat.masks.isoDateTime) + "'",
		condition = "";

	for(var fld in cmd.dimensions){

		if(selection[fld] === undefined)
			continue;

		var syn = _md.syns_1с(fld),
			mf = cmd.dimensions[fld];

		if(syn.indexOf("_Key") == -1 && mf.type.is_ref && mf.type.types.length && mf.type.types[0].indexOf("enm.")==-1){
			syn += "_Key";
			if(condition)
				condition+= " and ";
			condition+= syn+" eq guid'"+selection[fld].ref+"'";
		}else{
			if(condition)
				condition+= " and ";

			if(mf.type.digits)
				condition+= syn+" eq "+$p.fix_number(selection[fld]);

			else if(mf.type.date_part)
				condition+= syn+" eq datetime'"+$p.dateFormat(selection[fld], $p.dateFormat.masks.isoDateTime)+"'";

			else
				condition+= syn+" eq '"+selection[fld]+"'";
		}

	}

	if(condition)
		period+= ",Condition='"+condition+"'";

	$p.ajax.default_attr(selection, $p.job_prm.rest_url());
	selection.url += this.rest_name + "/SliceLast(%sl)?allowedOnly=true&$format=json&$top=1000".replace("%sl", period);

	return _rest.ajax_to_data(selection, t)
		.then(function (data) {
			return t.load_array(data);
		});
};

/**
 * Сериализует объект данных в формат xml/atom (например, для rest-сервиса 1С)
 * @param [ex_meta] {Object} - метаданные внешней по отношению к текущей базы (например, для записи в *УНФ* объекта *Заказа дилера*).
 * Если указано, вывод ограничен полями, доступными во внешней базе + используются синонимы внешней базы
 */
DataObj.prototype.to_atom = function (ex_meta) {

	var res = '<entry><category term="StandardODATA.%n" scheme="http://schemas.microsoft.com/ado/2007/08/dataservices/scheme"/>\
				\n<title type="text"/><updated>%d</updated><author/><summary/><content type="application/xml">\
				\n<m:properties xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata">\
			%p\
			\n</m:properties></content></entry>'
		.replace('%n', this._manager.rest_name)
		.replace('%d', $p.dateFormat(new Date(), $p.dateFormat.masks.atom)),

		prop = '\n<d:Ref_Key>' + this.ref + '</d:Ref_Key>' +
			'\n<d:DeletionMark>' + this.deleted + '</d:DeletionMark>' +
			'\n<d:DataVersion>' + this.data_version + '</d:DataVersion>',

		f, mf, fts, ts, mts, pname, v;

	function fields_to_atom(obj){
		var meta_fields = obj._metadata.fields,
			prefix = obj instanceof TabularSectionRow ? '\n\t<d:' : '\n<d:';

		for(f in meta_fields){
			mf = meta_fields[f];
			pname = _md.syns_1с(f);
			v = obj[f];
			if(v instanceof EnumObj)
				v = v.empty() ? "" : v.name;

			else if(v instanceof DataObj){
				if(pname.indexOf("_Key") == -1)
					pname+= '_Key';
				v = v.ref;

			}else if(mf.type.date_part){
				if(v.getFullYear() < 1000)
					v = '0001-01-01T00:00:00Z';
				else
					v = $p.dateFormat(v, $p.dateFormat.masks.atom);

			}else if(v == undefined)
				continue;


			prop+= prefix + pname + '>' + v + '</d:' + pname + '>';
		}
	}

	if(this instanceof DocObj){
		prop+= '\n<d:Date>' + $p.dateFormat(this.date, $p.dateFormat.masks.atom) + '</d:Date>';
		prop+= '\n<d:Number>' + this.number_doc + '</d:Number>';

	} else {

		if(this._metadata.main_presentation_name)
			prop+= '\n<d:Description>' + this.name + '</d:Description>';

		if(this._metadata.code_length)
			prop+= '\n<d:Code>' + this.id + '</d:Code>';

		if(this._metadata.hierarchical && this._metadata.group_hierarchy)
			prop+= '\n<d:IsFolder>' + this.is_folder + '</d:IsFolder>';

	}

	fields_to_atom(this);

	for(fts in this._metadata.tabular_sections) {

		mts = this._metadata.tabular_sections[fts];
		//if(mts.hide)
		//	continue;

		pname = 'StandardODATA.' + this._manager.rest_name + '_' + _md.syns_1с(fts) + '_RowType';
		ts = this[fts];
		if(ts.count()){
			prop+= '\n<d:' + _md.syns_1с(fts) + ' m:type="Collection(' + pname + ')">';

			ts.each(function (row) {
				prop+= '\n\t<d:element m:type="' + pname + '">';
				prop+= '\n\t<d:LineNumber>' + row.row + '</d:LineNumber>';
				fields_to_atom(row);
				prop+= '\n\t</d:element>';
			});

			prop+= '\n</d:' + _md.syns_1с(fts) + '>';

		}else
			prop+= '\n<d:' + _md.syns_1с(fts) + ' m:type="Collection(' + pname + ')" />';
	}

	return res.replace('%p', prop);

	//<d:DeletionMark>false</d:DeletionMark>
	//<d:Ref_Key>213d87ad-33d5-11de-b58f-00055d80a2b8</d:Ref_Key>
	//<d:IsFolder>false</d:IsFolder>
	//<d:Description>Новая папка</d:Description>
	//<d:Запасы m:type="Collection(StandardODATA.Document_ЗаказПокупателя_Запасы_RowType)">
	//	<d:element m:type="StandardODATA.Document_ЗаказПокупателя_Запасы_RowType">
	//		<d:LineNumber>1</d:LineNumber>
	//		<d:Номенклатура_Key>6ebf3bf7-3565-11de-b591-00055d80a2b9</d:Номенклатура_Key>
	//		<d:ТипНоменклатурыЗапас>true</d:ТипНоменклатурыЗапас>
	//		<d:Характеристика_Key>00000000-0000-0000-0000-000000000000</d:Характеристика_Key>
	//		<d:ПроцентАвтоматическойСкидки>0</d:ПроцентАвтоматическойСкидки>
	//		<d:СуммаАвтоматическойСкидки>0</d:СуммаАвтоматическойСкидки>
	//		<d:КлючСвязи>0</d:КлючСвязи>
	//	</d:element>
	//</d:Запасы>
	//<d:МатериалыЗаказчика m:type="Collection(StandardODATA.Document_ЗаказПокупателя_МатериалыЗаказчика_RowType)"/>
};


/**
 * Процедуры импорта и экспорта данных
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 *
 * @module metadata
 * @submodule import_export
 * @requires common
 */


/**
 * Осуществляет экспорт данных в файл или в строковую переменную или на сервер
 * - Экспортироваться может как единичный объект, так и коллекция объектов
 * - В параметрах метода либо интерактивно могут задаваться правила экспорта, такие как:
 *   - Формат формируемого файла (json, xlsx, sql)
 *   - Дополнять ли формируемый файл информацией о метаданных (типы и связи полей)
 *   - Включать ли в формируемый файл данные связанных объектов<br />(например, выгружать вместе с заказом объекты номенклатуры и характеристик)
 *
 * @method export
 * @for DataManager
 * @param attr {Object} - параметры экспорта
 * @param [attr.pwnd] {dhtmlXWindows} - указатель на родительскую форму
 */
DataManager.prototype.export = function(attr){

	if(attr && "string" === typeof attr)
		attr = {items: attr.split(",")};
	else if(!attr)
		attr = {items: []};


	var _mgr = this, wnd,
		options = {
			name: 'export',
			wnd: {
				top: 130,
				left: 200,
				width: 480,
				height: 350
			}
		};

	// читаем объект из локального SQL или из 1С
	frm_create();


	/**
	 * ПриСозданииНаСервере()
	 */
	function frm_create(){

		$p.wsql.restore_options("data_manager", options);
		options.wnd.caption = "Экспорт " + _mgr.family_name + " '" + (_mgr.metadata().synonym || _mgr.metadata().name) + "'";

		wnd = $p.iface.dat_blank(null, options.wnd);

		wnd.bottom_toolbar({
			buttons: [
				{name: 'btn_cancel', text: '<i class="fa fa-times fa-lg"></i> Отмена', title: 'Отмена', width:'80px', float: 'right'},
				{name: 'btn_ok', b: '<i class="fa fa-floppy-o"></i> Ок', title: 'Выполнить экспорт', width:'50px', float: 'right'}],
			onclick: function (name) {
					if(name == 'btn_ok')
						do_export();
					else
						wnd.close();
					return false;
				}
			});


		wnd.button('close').show();
		wnd.button('park').hide();
		wnd.attachEvent("onClose", frm_close);

		var str = [
			{ type:"fieldset" , name:"form_range", label:"Выгрузить", list:[
				{ type:"settings" , labelWidth:320, labelAlign:"left", position:"label-right"  },
				{ type:"radio" , name:"range", label:"Выделенные строки", value:"selected"  },
				{ type:"radio" , name:"range", label:"Весь справочник", value:"all"  }
			]},
			{ type:"fieldset" , name:"form_fieldset_2", label:"Дополнительно выгрузить", list:[
				{ type:"settings" , labelWidth:160, position:"label-right"  },
				{ type:"checkbox" , name:"meta", label:"Описание метаданных", labelAlign:"left", position:"label-right", checked: options.meta  },
				{ type:"newcolumn"   },
				{ type:"checkbox" , name:"relation", label:"Связанные объекты", position:"label-right", checked: options.relation, tooltip: "Связанные объекты по ссылкам (пока не реализовано)" }
			]  },
			{ type:"fieldset" , name:"fieldset_format", label:"Формат файла", list:[
				{ type:"settings" , labelWidth:60, labelAlign:"left", position:"label-right"  },
				{ type:"radio" , name:"format", label:"json", value:"json", tooltip: "Выгрузить в формате JSON"  },
				{ type:"newcolumn"   },
				{ type:"radio" , name:"format", label:"xlsx", value:"xlsx", tooltip: "Выгрузить в офисном формате XLSX" },
				{ type:"newcolumn"   },
				{ type:"radio" , name:"format", label:"atom", value:"atom", tooltip: "Выгрузить в формате XML Atom" }

			]  }


		];
		wnd.elmnts.frm = wnd.attachForm(str);

		wnd.elmnts.frm.setItemValue("range", options.range || "all");

		if(attr.items && attr.items.length == 1){
			if(attr.obj)
				wnd.elmnts.frm.setItemLabel("range", "selected", "Тек. объект: " + attr.items[0].presentation);
			else
				_mgr.get(attr.items[0], true).then(function (Obj) {
					wnd.elmnts.frm.setItemLabel("range", "selected", "Тек. объект: " + Obj.presentation);
				});
			wnd.elmnts.frm.setItemValue("range", "selected");

		}else if(attr.items && attr.items.length)
			wnd.elmnts.frm.setItemLabel("range", "selected", "Выделенные строки (" + attr.items.length + " элем.)");

		if(_mgr instanceof DocManager)
			wnd.elmnts.frm.setItemLabel("range", "all", "Все документы из кеша (0 элем.)");


		wnd.elmnts.frm.setItemValue("format", options.format || "json");

		wnd.elmnts.frm.attachEvent("onChange", set_availability);

		set_availability();

		if(attr.pwnd && attr.pwnd.isModal && attr.pwnd.isModal()){
			attr.set_pwnd_modal = true;
			attr.pwnd.setModal(false);
		}
		wnd.setModal(true);

	}

	function set_availability(){

		wnd.elmnts.frm.setItemValue("relation", false);
		wnd.elmnts.frm.disableItem("relation");

		if(wnd.elmnts.frm.getItemValue("range") == "all"){
			wnd.elmnts.frm.disableItem("format", "atom");
			if(wnd.elmnts.frm.getItemValue("format") == "atom")
				wnd.elmnts.frm.setItemValue("format", "json");
		}else
			wnd.elmnts.frm.enableItem("format", "atom");

		if(wnd.elmnts.frm.getItemValue("format") == "json"){
			wnd.elmnts.frm.enableItem("meta");

		}else if(wnd.elmnts.frm.getItemValue("format") == "sql"){
			wnd.elmnts.frm.setItemValue("meta", false);
			wnd.elmnts.frm.disableItem("meta");

		}else{
			wnd.elmnts.frm.setItemValue("meta", false);
			wnd.elmnts.frm.disableItem("meta");

		}
	}

	function refresh_options(){
		options.format = wnd.elmnts.frm.getItemValue("format");
		options.range = wnd.elmnts.frm.getItemValue("range");
		options.meta = wnd.elmnts.frm.getItemValue("meta");
		options.relation = wnd.elmnts.frm.getItemValue("relation");
		return options;
	}

	function do_export(){

		refresh_options();

		function export_xlsx(){
			if(attr.obj)
				$p.wsql.alasql("SELECT * INTO XLSX('"+_mgr.table_name+".xlsx',{headers:true}) FROM ?", [attr.items[0]._obj]);
			else
				$p.wsql.alasql("SELECT * INTO XLSX('"+_mgr.table_name+".xlsx',{headers:true}) FROM " + _mgr.table_name);
		}

		var res = {meta: {}, items: {}},
			items = res.items[_mgr.class_name] = [];

		//$p.wsql.aladb.tables.refs.data.push({ref: "dd274d11-833b-11e1-92c2-8b79e9a2b61c"})
		//$p.wsql.alasql('select * from cat_cashboxes where ref in (select ref from refs)')

		if(options.meta)
			res.meta[_mgr.class_name] = _mgr.metadata();

		if(options.format == "json"){

			if(attr.obj)
				items.push(attr.items[0]._obj);
			else
				_mgr.each(function (o) {
					if(options.range == "all" || attr.items.indexOf(o.ref) != -1)
						items.push(o._obj);
				});

			if(attr.items.length && !items.length)
				_mgr.get(attr.items[0], true).then(function (Obj) {
					items.push(Obj._obj);
					alasql.utils.saveFile(_mgr.table_name+".json", JSON.stringify(res, null, 4));
				});

			else
				alasql.utils.saveFile(_mgr.table_name+".json", JSON.stringify(res, null, 4));

		}else if(options.format == "xlsx"){
			if(!window.xlsx)
				$p.load_script("//cdn.jsdelivr.net/js-xlsx/latest/xlsx.core.min.js", "script", export_xlsx);
			else
				export_xlsx();

		}else if(options.format == "atom" && attr.items.length){

			var po = attr.obj ? Promise.resolve(attr.items[0]) : _mgr.get(attr.items[0], true);
			po.then(function (o) {
				alasql.utils.saveFile(_mgr.table_name+".xml", o.to_atom());
			});

		}else{
			//$p.wsql.alasql("SELECT * INTO SQL('"+_mgr.table_name+".sql') FROM " + _mgr.table_name);
			$p.msg.show_not_implemented();
		}
	}

	function frm_close(win){

		$p.iface.popup.hide();
		wnd.wnd_options(options.wnd);
		$p.wsql.save_options("data_manager", refresh_options());

		wnd.setModal(false);
		if(attr.set_pwnd_modal && attr.pwnd.setModal)
			attr.pwnd.setModal(true);

		return true;
	}


};

/**
 * Осуществляет загрузку данных из json-файла
 * @param [file] {String|Blob|undefined}
 * @param [obj] {DataObj} - если указано, загрузка осуществляется только в этот объект. остальные данные файла - игнорируются
 */
DataManager.prototype.import = function(file, obj){

	var input_file, imported;

	function import_file(event){

		function do_with_collection(cl_name, items){
			var _mgr = _md.mgr_by_class_name(cl_name);
			if(items.length){
				if(!obj){
					imported = true;
					_mgr.load_array(items, true);
				} else if(obj._manager == _mgr){
					for(var i in items){
						if($p.fix_guid(items[i]) == obj.ref){
							imported = true;
							_mgr.load_array([items[i]], true);
						}
					}
				}
			}
		}

		wnd.close();
		if(input_file.files.length){

			var reader = new FileReader();
			reader.onload = function(e) {
				try{
					var res = JSON.parse(reader.result);

					if(res.items){
						for(var cl_name in res.items)
							do_with_collection(cl_name, res.items[cl_name]);

					}else{
						["cat", "doc", "ireg", "areg", "cch", "cacc"].forEach(function (cl) {
							if(res[cl]) {
								for (var cl_name in res[cl])
									do_with_collection(cl + "." + cl_name, res.cat[cl_name]);
							}
						});
					}
					if(!imported)
						$p.msg.show_msg($p.msg.sync_no_data);

				}catch(err){
					$p.msg.show_msg(err.message);
				}
			};
			reader.readAsText(input_file.files[0]);
		}
	}

	if(!file && typeof window != undefined){

		var options = {
				name: 'import',
				wnd: {
					width: 300,
					height: 100,
					caption: $p.msg.select_file_import
				}
			},
			wnd = $p.iface.dat_blank(null, options.wnd);

		input_file = document.createElement("input");
		input_file.setAttribute("id", "json_file");
		input_file.setAttribute("type", "file");
		input_file.setAttribute("accept", ".json");
		input_file.setAttribute("value", "*.json");
		input_file.onchange = import_file;

		wnd.button('close').show();
		wnd.button('park').hide();
		wnd.attachObject(input_file);
		wnd.centerOnScreen();
		wnd.setModal(true);

		setTimeout(function () {
			input_file.click();
		}, 100);
	}
};

/**
 * Форма обновления кеша appcache
 */

function wnd_appcache ($p) {
	var _appcache = $p.iface.appcache = {},
		_stepper;

	_appcache.create = function(stepper){
		_stepper = stepper;
		frm_create();
	};

	_appcache.update = function(){
		_stepper.frm_appcache.setItemValue("text_processed", "Обработано элементов: " + _stepper.loaded + " из " + _stepper.total);

	};

	_appcache.close = function(){
		if(_stepper && _stepper.wnd_appcache){
			_stepper.wnd_appcache.close();
			delete _stepper.wnd_appcache;
		}
	};


	function frm_create(){
		_stepper.wnd_appcache = $p.iface.w.createWindow('wnd_appcache', 0, 0, 490, 250);

		var str = [
			{ type:"block" , name:"form_block_1", list:[
				{ type:"label" , name:"form_label_1", label: $p.msg.sync_script },
				{ type:"block" , name:"form_block_2", list:[
					{ type:"template",	name:"img_long", className: "img_long" },
					{ type:"newcolumn"   },
					{ type:"template",	name:"text_processed"},
					{ type:"template",	name:"text_current"},
					{ type:"template",	name:"text_bottom"}
				]  }
			]  },
			{ type:"button" , name:"form_button_1", value: $p.msg.sync_break }
		];
		_stepper.frm_appcache = _stepper.wnd_appcache.attachForm(str);
		_stepper.frm_appcache.attachEvent("onButtonClick", function(name) {
			if(_stepper)
				_stepper.do_break = true;
		});

		_stepper.wnd_appcache.setText($p.msg.long_operation);
		_stepper.wnd_appcache.denyResize();
		_stepper.wnd_appcache.centerOnScreen();
		_stepper.wnd_appcache.button('park').hide();
		_stepper.wnd_appcache.button('minmax').hide();
		_stepper.wnd_appcache.button('close').hide();
	}

}
/**
 * Форма окна длительной операции
 */

$p.iface.wnd_sync = function() {

	var _sync = $p.iface.sync = {},
		_stepper;

	_sync.create = function(stepper){
		_stepper = stepper;
		frm_create();
	};

	_sync.update = function(cats){
		_stepper.frm_sync.setItemValue("text_processed", "Обработано элементов: " + _stepper.step * _stepper.step_size + " из " + _stepper.count_all);
		var cat_list = "", md, rcount = 0;
		for(var cat_name in cats){
			rcount++;
			if(rcount > 4)
				break;
			if(cat_list)
				cat_list+= "<br />";
			md = $p.cat[cat_name].metadata();
			cat_list+= (md.list_presentation || md.synonym) + " (" + cats[cat_name].length + ")";
		}
		_stepper.frm_sync.setItemValue("text_current", "Текущий запрос: " + _stepper.step + " (" + Math.round(_stepper.step * _stepper.step_size * 100 / _stepper.count_all) + "%)");
		_stepper.frm_sync.setItemValue("text_bottom", cat_list);

	};

	_sync.close = function(){
		if(_stepper && _stepper.wnd_sync){
			_stepper.wnd_sync.close();
			delete _stepper.wnd_sync;
		}
	};


	/**
	 *	Приватные методы
	 */
	function frm_create(){

		// параметры открытия формы
		var options = {
			name: 'wnd_sync',
			wnd: {
				id: 'wnd_sync',
				top: 130,
				left: 200,
				width: 496,
				height: 290,
				modal: true,
				center: true,
				caption: "Подготовка данных"
			}
		};

		_stepper.wnd_sync = $p.iface.dat_blank(null, options.wnd);

		var str = [
			{ type:"block" , name:"form_block_1", list:[
				{ type:"label" , name:"form_label_1", label: $p.msg.sync_data },
				{ type:"block" , name:"form_block_2", list:[
					{ type:"template",	name:"img_long", className: "img_long" },
					{ type:"newcolumn"   },
					{ type:"template",	name:"text_processed"},
					{ type:"template",	name:"text_current"},
					{ type:"template",	name:"text_bottom"}
				]  }
			]  },
			{ type:"button" , name:"form_button_1", value: $p.msg.sync_break }
		];
		_stepper.frm_sync = _stepper.wnd_sync.attachForm(str);
		_stepper.frm_sync.attachEvent("onButtonClick", function(name) {
			if(_stepper)
				_stepper.do_break = true;
		});

		_stepper.frm_sync.setItemValue("text_processed", "Инициализация");
		_stepper.frm_sync.setItemValue("text_bottom", "Загружается структура таблиц...");
	}
};
/**
 * Форма абстрактного объекта данных {{#crossLink "DataObj"}}{{/crossLink}}, в том числе, отчетов и обработок
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author	Evgeniy Malyarov
 *
 * @module metadata
 * @submodule wnd_obj
 */


/**
 * ### Форма объекта данных
 * По умолчанию, форма строится автоматически по описанию метаданных.<br />
 * Метод можно переопределить для конкретного менеджера
 *
 * @method form_obj
 * @for DataManager
 * @param pwnd {dhtmlXWindows} - указатель на родительскую форму
 * @param attr {Object|DataObj|String} - параметры инициализации формы
 */
DataManager.prototype.form_obj = function(pwnd, attr){

	var _mgr = this,
		o = attr.o,
		cmd = _mgr.metadata(),
		wnd, options, created, create_id;

	/**
	 * ПриСозданииНаСервере - инициализация при создании формы, до чтения объекта
	 */
	function frm_create(){

		if(created)
			return;

		// создаём и настраиваем окно формы
		if((pwnd instanceof dhtmlXLayoutCell || pwnd instanceof dhtmlXSideBarCell || pwnd instanceof dhtmlXCarouselCell)
			&& (attr.bind_pwnd || attr.Приклеить)) {
			// форма объекта приклеена к области контента или другой форме
			if(typeof pwnd.close == "function")
				pwnd.close(true);
			wnd = pwnd;
			wnd.close = function (on_create) {
				var _wnd = wnd || pwnd;
				if(_wnd){

					// выгружаем попапы
					if(_wnd.elmnts)
						["vault", "vault_pop"].forEach(function (elm) {
							if (_wnd.elmnts[elm])
								_wnd.elmnts[elm].unload();
						});

					// информируем мир о закрытии формы
					if(_mgr && _mgr.class_name)
						dhx4.callEvent("frm_close", [_mgr.class_name, o ? o.ref : ""]);

					_wnd.detachToolbar();
					_wnd.detachStatusBar();
					if(_wnd.conf)
						_wnd.conf.unloading = true;
					_wnd.detachObject(true);
				}
				frm_unload(on_create);
			};
			wnd.elmnts = {grids: {}};

		}else{
			// форма в модальном диалоге
			options = {
				name: 'wnd_obj_' + _mgr.class_name,
				wnd: {
					id: 'wnd_obj_' + _mgr.class_name,
					top: 80 + Math.random()*40,
					left: 120 + Math.random()*80,
					width: 900,
					height: 600,
					modal: true,
					center: false,
					pwnd: pwnd,
					allow_close: true,
					allow_minmax: true,
					on_close: frm_close,
					caption: (cmd.obj_presentation || cmd.synonym)
				}
			};
			wnd = $p.iface.dat_blank(null, options.wnd);
		}

		if(!wnd.ref)
			wnd.__define("ref", {
				get: function(){
					return o ? o.ref : $p.blank.guid;
				},
				enumerable: false,
				configurable: true
			});

		/**
		 *	Закладки: шапка и табличные части
		 */
		wnd.elmnts.frm_tabs = wnd.attachTabbar({
			arrows_mode: "auto",
			offsets: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			}
		});
		wnd.elmnts.frm_tabs.addTab('tab_header','&nbsp;Реквизиты&nbsp;', null, null, true);
		wnd.elmnts.tabs = {'tab_header': wnd.elmnts.frm_tabs.cells('tab_header')};

		// панель инструментов формы
		wnd.elmnts.frm_toolbar = wnd.attachToolbar();
		wnd.elmnts.frm_toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix());
		wnd.elmnts.frm_toolbar.loadStruct(attr.toolbar_struct || $p.injected_data["toolbar_obj.xml"], function(){

			this.addSpacer("btn_unpost");
			this.attachEvent("onclick", toolbar_click);

			// TODO: учитывать права для каждой роли на каждый объект
			if(_mgr instanceof DocManager && $p.ajax.root){
				this.enableItem("btn_post");
				this.enableItem("btn_unpost");
			}else{
				this.hideItem("btn_post");
				this.hideItem("btn_unpost");
			}
			if(!$p.ajax.root){
				this.hideItem("btn_save_close");
				this.disableItem("btn_save");
			}

			if(attr.on_select)
				this.setItemText("btn_save_close", "Записать и выбрать");

			// добавляем команды печати
			if(_mgr instanceof CatManager || _mgr instanceof DocManager)
				_mgr.printing_plates().then(function (pp) {
					for(var pid in pp)
						wnd.elmnts.frm_toolbar.addListOption("bs_print", pid, "~", "button", pp[pid]);
				});
			else
				this.disableItem("bs_print");

			// кнопка закрытия для приклеенной формы
			if(wnd != pwnd){
				this.hideItem("btn_close");
			}

			// попап для присоединенных файлов
			wnd.elmnts.vault_pop = new dhtmlXPopup({
				toolbar: this,
				id: "btn_files"
			});
			wnd.elmnts.vault_pop.attachEvent("onShow", show_vault);

		});


		if($p.job_prm.russian_names){
			if(!wnd.Элементы)
				wnd.__define({
					"Элементы": {
						get: function () {
							return this.elmnts;
						},
						enumerable: false
					}
				});
			if(!wnd.elmnts.Шапка)
				wnd.elmnts.__define({
					"Шапка": {
						get: function () {
							return this.pg_header;
						},
						enumerable: false
					}
				});
		}

		created = true;
	}

	/**
	 * ПриЧтенииНаСервере - инициализация при чтении объекта
	 */
	function frm_fill(){

		if(!created){
			clearTimeout(create_id);
			frm_create();
		}

		if(!attr.hide_header){
			if(wnd.setText)
				wnd.setText((cmd.obj_presentation || cmd.synonym) + ': ' + o.presentation);
			if(wnd.showHeader)
				wnd.showHeader();
		}

		/**
		 * закладки табличных частей
		 */
		if(attr.draw_tabular_sections)
			attr.draw_tabular_sections(o, wnd, tabular_init);

		else if(!o.is_folder){
			for(var ts in cmd.tabular_sections){
				if(ts==="extra_fields")
					continue;

				if(o[ts] instanceof TabularSection){

					// настройка табличной части
					tabular_init(ts);
				}
			}
		}

		/**
		 *	закладка шапка
		 */
		if(attr.draw_pg_header)
			attr.draw_pg_header(o, wnd);
		else{
			wnd.elmnts.pg_header = wnd.elmnts.tabs.tab_header.attachHeadFields({
				obj: o,
				pwnd: wnd,
				read_only: !$p.ajax.root    // TODO: учитывать права для каждой роли на каждый объект
			});
			wnd.attachEvent("onResizeFinish", function(win){
				wnd.elmnts.pg_header.enableAutoHeight(false, wnd.elmnts.tabs.tab_header._getHeight()-20, true);
			});
		}

		return {wnd: wnd, o: o};

	}

	/**
	 * обработчик нажатия кнопок командных панелей
	 */
	function toolbar_click(btn_id){
		if(btn_id=="btn_save_close")
			save("close");

		else if(btn_id=="btn_save")
			save("save");

		else if(btn_id=="btn_close")
			wnd.close();

		else if(btn_id=="btn_go_connection")
			go_connection();

		else if(btn_id.substr(0,4)=="prn_")
			_mgr.print(o.ref, btn_id, wnd);

		else if(btn_id=="btn_import")
			_mgr.import(null, o);

		else if(btn_id=="btn_export")
			_mgr.export({items: [o], pwnd: wnd, obj: true} );

	}

	/**
	 * показывает список связанных документов
	 */
	function go_connection(){
		$p.msg.show_not_implemented();
	}

	/**
	 * создаёт и показывает диалог присоединенных файлов
	 */
	function show_vault(){

		if (!wnd.elmnts.vault) {

			var rattr = {};
			$p.ajax.default_attr(rattr, $p.job_prm.irest_url());
			rattr.url += _mgr.rest_name + "(guid'" + o.ref + "')/Files?$format=json";

			wnd.elmnts.vault = wnd.elmnts.vault_pop.attachVault(400, 250, {
				uploadUrl:  rattr.url,
				buttonClear: false,
				autoStart: true,
				filesLimit: 10
			});
			wnd.elmnts.vault.conf.wnd = wnd;

			// действия после загрузки файла
			wnd.elmnts.vault.attachEvent("onUploadFile", function(v, e){


			});

			// действия перед загрузкой файла
			wnd.elmnts.vault.attachEvent("onBeforeFileAdd", function(file){
				if(file.size <= this.getMaxFileSize())
					return true;
				$p.msg.show_msg({
					type: "alert-warning",
					text: $p.msg.file_size + this._readableSize(this.getMaxFileSize()),
					title: $p.msg.main_title});
				return false;
			});

			// действия перед удалением файла
			wnd.elmnts.vault.attachEvent("onBeforeFileRemove", function(file){

				if(wnd.elmnts.vault.file_data[file.id].delete_confirmed)
					return true;

				dhtmlx.confirm({
					title: $p.msg.main_title,
					text: $p.msg.file_confirm_delete + file.name,
					cancel: "Отмена",
					callback: function(btn) {
						if(btn)
							$p.ajax.post_ex(wnd.elmnts.vault.actionUrl(file.id, "drop"), "", true)
								.then(function(req){
									wnd.elmnts.vault.file_data[file.id].delete_confirmed = true;
									wnd.elmnts.vault._removeFileFromQueue(file.id);
								});
					}
				});
				return false;

			});

			// обновляем список присоединенных файлов

		}

	}


	/**
	 * настройка (инициализация) табличной части
	 */
	function tabular_init(name, toolbar_struct){

		// с помощью метода ts_captions(), выясняем, надо ли добавлять данную ТЧ и формируем описание колонок табчасти
		if(!_md.ts_captions(_mgr.class_name, name))
			return;

		// закладка табов табличной части
		wnd.elmnts.frm_tabs.addTab('tab_'+name, '&nbsp;'+cmd.tabular_sections[name].synonym+'&nbsp;');
		wnd.elmnts.tabs['tab_'+name] = wnd.elmnts.frm_tabs.cells('tab_'+name);

		wnd.elmnts.grids[name] = wnd.elmnts.tabs['tab_'+name].attachTabular({
			obj: o,
			ts: name,
			pwnd: wnd,
			read_only: !$p.ajax.root,
			toolbar_struct: toolbar_struct
		});

	}

	function save(action){

		wnd.progressOn();

		o.save()
			.then(function(){

				wnd.progressOff();
				wnd.modified = false;

				if(action == "close"){
					if(attr.on_select)
						attr.on_select(o);
					wnd.close();
				}
			})
			.catch(function(err){
				wnd.progressOff();
				$p.record_log(err);
			});
	}

	/**
	 * освобождает переменные после закрытия формы
	 */
	function frm_unload(on_create){

		if(attr && attr.on_close && !on_create)
			attr.on_close();

		if(!on_create){
			delete wnd.ref;
			_mgr = wnd = o = cmd = options = pwnd = attr = null;
		}
	}

	function frm_close(win){

		// TODO задать вопрос о записи изменений + перенести этот метод в $p

		setTimeout(frm_unload);

		// выгружаем попапы
		if(wnd && wnd.elmnts)
			["vault", "vault_pop"].forEach(function (elm) {
				if (wnd.elmnts[elm])
					wnd.elmnts[elm].unload();
			});

		// информируем мир о закрытии формы
		if(_mgr && _mgr.class_name)
			dhx4.callEvent("frm_close", [_mgr.class_name, o ? o.ref : ""]);

		return true;
	}

	// (пере)создаём статическую часть формы
	create_id = setTimeout(frm_create);

	// читаем объект из локального SQL или получаем с сервера
	if($p.is_data_obj(o)){
		if(o.is_new() && attr.on_select)
			return _mgr.create({}, true)
				.then(function (tObj) {
					o = tObj;
					tObj = null;
					return frm_fill();
				});
		else if(o.is_new() && !o.empty()){
			return o.load()
				.then(frm_fill);
		}else
			return Promise.resolve(frm_fill());
	}else{

		pwnd.progressOn();

		return _mgr.get(attr.hasOwnProperty("ref") ? attr.ref : attr, true)
			.then(function(tObj){
				o = tObj;
				tObj = null;
				pwnd.progressOff();
				return frm_fill();
			})
			.catch(function (err) {
				pwnd.progressOff();
				$p.record_log(err);
			});
	}

};

/**
 * ### Форма объекта данных
 * По умолчанию, форма строится автоматически по описанию метаданных.<br />
 * Метод можно переопределить для конкретного менеджера
 *
 * @method form_obj
 * @for DataObj
 * @param pwnd {dhtmlXWindows} - указатель на родительскую форму
 * @param attr {Object} - параметры инициализации формы
 */
DataObj.prototype.form_obj = function (pwnd, attr) {
	if(!attr)
		attr = {};
	attr.o = this;
	return this._manager.form_obj(pwnd, attr);
};
/**
 * Абстрактная форма списка и выбора выбора объектов ссылочного типа (документов и справочников)<br />
 * Может быть переопределена в {{#crossLink "RefDataManager"}}менеджерах{{/crossLink}} конкретных классов
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author	Evgeniy Malyarov
 *
 * @module  wnd_selection
 */

/**
 * Форма выбора объекта данных
 * @method form_selection
 * @param pwnd {dhtmlXWindows} - указатель на родительскую форму
 * @param attr {Object} - параметры инициализации формы
 * @param [attr.initial_value] {DataObj} - начальное значение выбора
 * @param [attr.parent] {DataObj} - начальное значение родителя для иерархических справочников
 * @param [attr.on_select] {Function} - callback при выборе значения
 */
DataManager.prototype.form_selection = function(pwnd, attr){

	if(!pwnd)
		pwnd = attr && attr.pwnd ? attr.pwnd : {};

	if(!attr && !(pwnd instanceof dhtmlXCellObject)){
		attr = pwnd;
		pwnd = {};
	}

	if(!attr)
		attr = {};


	var _mgr = this,
		md = _mgr.metadata(),
		has_tree = md["hierarchical"] && !(_mgr instanceof ChartOfAccountManager),
		wnd, s_col = 0,
		a_direction = "asc",
		previous_filter = {},
		on_select = pwnd.on_select || attr.on_select;


	// создаём и настраиваем форму
	if(has_tree && attr.initial_value && attr.initial_value!= $p.blank.guid && !attr.parent)
		_mgr.get(attr.initial_value, true)
			.then(function (tObj) {
				attr.parent = tObj.parent.ref;
				attr.set_parent = attr.parent;
				frm_create();
			});
	else
		frm_create();


	/**
	 *	раздел вспомогательных функций
	 */

	/**
	 * аналог 1С-ного ПриСозданииНаСервере()
	 */
	function frm_create(){

		// создаём и настраиваем окно формы
		if(pwnd instanceof dhtmlXCellObject) {
			if(!(pwnd instanceof dhtmlXTabBarCell) && (typeof pwnd.close == "function"))
				pwnd.close(true);
			wnd = pwnd;
			wnd.close = function (on_create) {
				if(wnd || pwnd){
					(wnd || pwnd).detachToolbar();
					(wnd || pwnd).detachStatusBar();
					if((wnd || pwnd).conf)
						(wnd || pwnd).conf.unloading = true;
					(wnd || pwnd).detachObject(true);
				}
				frm_unload(on_create);
			};
			if(!attr.hide_header){
				setTimeout(function () {
					wnd.showHeader();
				});
			}
		}else{
			wnd = $p.iface.w.createWindow('wnd_' + _mgr.class_name.replace(".", "_") + '_select', 0, 0, 900, 600);
			wnd.centerOnScreen();
			wnd.setModal(1);
			wnd.button('park').hide();
			wnd.button('minmax').show();
			wnd.button('minmax').enable();
			wnd.attachEvent("onClose", frm_close);
		}

		$p.iface.bind_help(wnd);
		if(wnd.setText)
			wnd.setText('Список ' + (_mgr.class_name.indexOf("doc.") == -1 ? 'справочника "' : 'документов "') + (md["list_presentation"] || md.synonym) + '"');

		document.body.addEventListener("keydown", body_keydown, false);

		// статусбар
		wnd.elmnts = {
			status_bar: wnd.attachStatusBar()
		};
		wnd.elmnts.status_bar.setText("<div id='" + _mgr.class_name.replace(".", "_") + "_select_recinfoArea'></div>");

		// командная панель формы
		wnd.elmnts.toolbar = wnd.attachToolbar();
		wnd.elmnts.toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix());
		wnd.elmnts.toolbar.loadStruct(attr.toolbar_struct || $p.injected_data["toolbar_selection.xml"], function(){

			this.attachEvent("onclick", toolbar_click);

			// текстовое поле фильтра по подстроке
			var tbattr = {
				manager: _mgr,
				toolbar: this,
				onchange: input_filter_change,
				hide_filter: attr.hide_filter
			};
			if(attr.date_from)
				tbattr.date_from = attr.date_from;
			if(attr.date_till)
				tbattr.date_till = attr.date_till;
			wnd.elmnts.filter = new $p.iface.Toolbar_filter(tbattr);

			// Если нет полных прав - разрешен только просмотр и выбор элементов
			// TODO: учитывать права для каждой роли на каждый объект
			if(!$p.ajax.root){
				this.hideItem("btn_new");
				this.hideItem("btn_edit");
				this.hideItem("btn_delete");
			}

			if(!on_select){
				this.hideItem("btn_select");
				this.hideItem("sep1");
				if($p.iface.docs && $p.iface.docs.getViewName && $p.iface.docs.getViewName() == "oper")
					this.addListOption("bs_more", "btn_order_list", "~", "button", "<i class='fa fa-briefcase fa-lg fa-fw'></i> Список заказов");
			}
			this.addListOption("bs_more", "btn_import", "~", "button", "<i class='fa fa-upload fa-lg fa-fw'></i> Загрузить из файла");
			this.addListOption("bs_more", "btn_export", "~", "button", "<i class='fa fa-download fa-lg fa-fw'></i> Выгрузить в файл");


			// добавляем команды печати
			if(_mgr instanceof CatManager || _mgr instanceof DocManager)
				_mgr.printing_plates().then(function (pp) {
					var added;
					for(var pid in pp){
						wnd.elmnts.toolbar.addListOption("bs_print", pid, "~", "button", pp[pid]);
						added = true;
					}
					if(!added)
						wnd.elmnts.toolbar.hideItem("bs_print");
				});
			else
				wnd.elmnts.toolbar.hideItem("bs_print");

			//
			create_tree_and_grid();
		});
	}

	/**
	 * Устанавливает фокус в поле фильтра
	 * @param evt {KeyboardEvent}
	 * @return {Boolean}
	 */
	function body_keydown(evt){

		/**
		 * Проверяет, нет ли других модальных форм
		 */
		function check_exit(){
			var do_exit;
			// если есть внешнее модальное, ничего обрабатывать не надо
			$p.iface.w.forEachWindow(function (w) {
				if(w.isModal() && w != wnd)
					do_exit = true;
			});
			return do_exit;
		}

		if(wnd){
			if (evt.keyCode == 113 || evt.keyCode == 115){ //{F2} или {F4}
				if(!check_exit()){
					setTimeout(function(){
						if(wnd.elmnts.filter.input_filter)
							wnd.elmnts.filter.input_filter.focus();
					});
					return $p.cancel_bubble(evt);
				}

			} else if(evt.shiftKey && evt.keyCode == 116){ // requery по {Shift+F5}
				if(!check_exit()){
					setTimeout(function(){
						wnd.elmnts.grid.reload();
					});
					if(evt.preventDefault)
						evt.preventDefault();
					return $p.cancel_bubble(evt);
				}

			} else if(evt.keyCode == 27){ // закрытие по {ESC}
				if(!check_exit()){

				}
			}
		}
	}

	function input_filter_change(flt){
		if(has_tree){
			if(flt.filter)
				wnd.elmnts.cell_tree.collapse();
			else
				wnd.elmnts.cell_tree.expand();
		}
		wnd.elmnts.grid.reload();
	}

	function create_tree_and_grid(){
		var layout, cell_tree, cell_grid, tree, grid, grid_inited;

		if(has_tree){
			layout = wnd.attachLayout('2U');

			cell_grid = layout.cells('b');
			cell_grid.hideHeader();

			cell_tree = wnd.elmnts.cell_tree = layout.cells('a');
			cell_tree.setWidth('220');
			cell_tree.hideHeader();

			tree = wnd.elmnts.tree = cell_tree.attachDynTree(_mgr, null, function(){
				setTimeout(function(){ grid.reload(); }, 20);
			});
			tree.attachEvent("onSelect", function(){	// довешиваем обработчик на дерево
				if(this.do_not_reload)
					delete this.do_not_reload;
				else
					setTimeout(function(){ grid.reload(); }, 20);
			});
			tree.attachEvent("onDblClick", function(id){
				select(id);
			});

		}else{
			cell_grid = wnd;
			setTimeout(function(){ grid.reload(); }, 20);
		}

		// настройка грида
		grid = wnd.elmnts.grid = cell_grid.attachGrid();
		grid.setIconsPath(dhtmlx.image_path);
		grid.setImagePath(dhtmlx.image_path);
		grid.setPagingWTMode(true,true,true,[20,30,60]);
		grid.enablePaging(true, 30, 8, _mgr.class_name.replace(".", "_") + "_select_recinfoArea");
		grid.setPagingSkin("toolbar", dhtmlx.skin);
		grid.attachEvent("onBeforeSorting", customColumnSort);
		grid.attachEvent("onBeforePageChanged", function(){ return !!this.getRowsNum();});
		grid.attachEvent("onXLE", function(){cell_grid.progressOff(); });
		grid.attachEvent("onXLS", function(){cell_grid.progressOn(); });
		grid.attachEvent("onDynXLS", function(start,count){
			var filter = get_filter(start,count);
			if(!filter)
				return;
			$p.cat.load_soap_to_grid(filter, grid);
			return false;
		});
		grid.attachEvent("onRowDblClicked", function(rId, cInd){
			var tree_row_index=null;
			if(tree)
				tree_row_index = tree.getIndexById(rId);
			if(tree_row_index!=null)
				tree.selectItem(rId, true);
			else select(rId);
		});

		if($p.iface.docs && $p.iface.docs.getViewName && $p.iface.docs.getViewName() == "oper")
			grid.enableMultiselect(true);

		// эту функцию будем вызывать снаружи, чтобы перечитать данные
		grid.reload = function(){
			var filter = get_filter();
			if(!filter) return;
			cell_grid.progressOn();
			grid.clearAll();
			$p.cat.load_soap_to_grid(filter, grid, function(xml){
				if(typeof xml === "object"){
					$p.msg.check_soap_result(xml);

				}else if(!grid_inited){
					if(filter.initial_value){
						var xpos = xml.indexOf("set_parent"),
							xpos2 = xml.indexOf("'>", xpos),
							xh = xml.substr(xpos+12, xpos2-xpos-12);
						if($p.is_guid(xh)){
							if(has_tree){
								tree.do_not_reload = true;
								tree.selectItem(xh, false);
							}
						}
						grid.selectRowById(filter.initial_value);

					}else if(filter.parent && $p.is_guid(filter.parent) && has_tree){
						tree.do_not_reload = true;
						tree.selectItem(filter.parent, false);
					}
					grid.setColumnMinWidth(200, grid.getColIndexById("presentation"));
					grid.enableAutoWidth(true, 1200, 600);
					grid.setSizes();
					grid_inited = true;
					if(wnd.elmnts.filter.input_filter)
						wnd.elmnts.filter.input_filter.focus();

					if(attr.on_grid_inited)
						attr.on_grid_inited();
				}
				if (a_direction && grid_inited)
					grid.setSortImgState(true, s_col, a_direction);
				cell_grid.progressOff();
			});
		};
	}

	/**
	 *	@desc: 	обработчик нажатия кнопок командных панелей
	 */
	function toolbar_click(btn_id){

		if(btn_id=="btn_select"){
			select();

		}else if(btn_id=="btn_new"){
			// TODO: м.б. записывать пустой объект и получать код-номер??
			_mgr.create({}, true)
				.then(function (o) {
					o._set_loaded(o.ref);
					$p.iface.set_hash(_mgr.class_name, o.ref);
				});


		}else if(btn_id=="btn_edit") {
			var rId = wnd.elmnts.grid.getSelectedRowId();
			if (rId)
				$p.iface.set_hash(_mgr.class_name, rId);
			else
				$p.msg.show_msg({
					type: "alert-warning",
					text: $p.msg.no_selected_row.replace("%1", ""),
					title: $p.msg.main_title
				});

		}else if(btn_id.substr(0,4)=="prn_"){
				print(btn_id);

		}else if(btn_id=="btn_order_list"){
			$p.iface.set_hash("", "", "", "def");

		}else if(btn_id=="btn_delete"){
			$p.msg.show_not_implemented();

		}else if(btn_id=="btn_import"){
			_mgr.import();

		}else if(btn_id=="btn_export"){
			_mgr.export(wnd.elmnts.grid.getSelectedRowId());

		}else if(btn_id=="btn_requery"){
			previous_filter = {};
			wnd.elmnts.grid.reload();

		}
	}

	/**
	 * выбор значения в гриде
	 * @param rId - идентификтор строки грида или дерева
	 */
	function select(rId){

		if(!rId)
			rId = wnd.elmnts.grid.getSelectedRowId();

		var folders;
		if(attr.selection){
			attr.selection.forEach(function(sel){
				for(var key in sel){
					if(key=="is_folder")
						folders = sel[key];
				}
			});
		}

		// запрещаем выбирать папки
		if(wnd.elmnts.tree &&
			wnd.elmnts.tree.getIndexById(rId) != null &&
			wnd.elmnts.tree.getSelectedItemId() != rId){
			wnd.elmnts.tree.selectItem(rId, true);
			return;
		}

		// запрещаем выбирать элементы, если в метаданных указано выбирать только папки
		// TODO: спозиционировать сообщение над выбранным элементом
		if(rId && folders === true && wnd.elmnts.grid.cells(rId, 0).cell.classList.contains("cell_ref_elm")){
			$p.msg.show_msg($p.msg.select_grp);
			return;
		}


		if((!rId && wnd.elmnts.tree) || (wnd.elmnts.tree && wnd.elmnts.tree.getSelectedItemId() == rId)){
			if(folders === false){
				$p.msg.show_msg($p.msg.select_elm);
				return;
			}
			rId = wnd.elmnts.tree.getSelectedItemId();
		}

		if(rId){
			if(on_select)
				_mgr.get(rId, true)
					.then(function(selv){
						wnd.close();
						on_select.call(pwnd.grid || pwnd, selv);
					});
			else
				$p.iface.set_hash(_mgr.class_name, rId);
		}
	}

	/**
	 *	Печатает документ
	 */
	function print(pid){
		var rId = wnd.elmnts.grid.getSelectedRowId();
		if(rId)
			_mgr.print(rId, pid, wnd);
		else
			$p.msg.show_msg({type: "alert-warning",
				text: $p.msg.no_selected_row.replace("%1", ""),
				title: $p.msg.main_title});
	}

	/**
	 * освобождает переменные после закрытия формы
	 */
	function frm_unload(on_create){

		document.body.removeEventListener("keydown", body_keydown);

		if(attr && attr.on_close && !on_create)
			attr.on_close();

		if(!on_create){
			_mgr = wnd = md = previous_filter = on_select = pwnd = attr = null;
		}
	}

	function frm_close(win){
		// проверить на ошибки, записать изменения
		// если проблемы, вернуть false

		setTimeout(frm_unload, 10);

		if(pwnd.on_unload)
			pwnd.on_unload.call(pwnd.grid || pwnd);

		return true;
	}

	/**
	 *	@desc: 	формирует объект фильтра по значениям элементов формы и позиции пейджинга
	 *			переопределяется в каждой форме
	 *	@param:	start, count - начальная запись и количество записей
	 */
	function get_filter(start, count){
		var filter = wnd.elmnts.filter.get_filter()
				._mixin({
					action: "get_selection",
					class_name: _mgr.class_name,
					order_by: s_col,
					direction: a_direction,
					start: start || ((wnd.elmnts.grid.currentPage || 1)-1)*wnd.elmnts.grid.rowsBufferOutSize,
					count: count || wnd.elmnts.grid.rowsBufferOutSize,
					get_header: (previous_filter.get_header == undefined)
				})
				._mixin(attr),

			tparent = has_tree ? wnd.elmnts.tree.getSelectedItemId() : null;

		filter.parent = ((tparent  || attr.parent) && !filter.filter) ? (tparent || attr.parent) : null;
		if(has_tree && !filter.parent)
			filter.parent = $p.blank.guid;

		for(var f in filter){
			if(previous_filter[f] != filter[f]){
				previous_filter = filter;
				return filter;
			}
		}
	}

	function customColumnSort(ind){
		var a_state = wnd.elmnts.grid.getSortingState();
		s_col=ind;
		a_direction = ((a_state[1] == "des")?"asc":"des");
		wnd.elmnts.grid.reload();
		return true;
	}

	return wnd;
};

/**
 * Форма списка объектов данных
 * @method form_list
 * @param pwnd {dhtmlXWindows} - указатель на родительскую форму
 * @param attr {Object} - параметры инициализации формы
 */
DataManager.prototype.form_list = function(pwnd, attr){
	return this.form_selection(pwnd, attr);
};
/**
 * Содержит методы обработки событий __при запуске__ программы, __перед закрытием__,<br />
 * при обновлении файлов __ApplicationCache__, а так же, при переходе в __offline__ и __online__
 *
 *	События развиваются в такой последовательности:
 *
 *	1) выясняем, совместим ли браузер. В зависимости от параметров url и параметров по умолчанию,
 *	 может произойти переход в ChromeStore или другие действия
 *
 *	2) анализируем AppCache, при необходимости обновляем скрипты и перезагружаем страницу
 *
 * 	3) инициализируем $p.wsql и комбинируем параметры работы программы с параметрами url
 *
 * 	4) если режим работы предполагает использование построителя, подключаем слушатель его событий.
 *	 по событию построителя "ready", выполняем метод initMainLayout() объекта $p.iface.
 *	 Метод initMainLayout() переопределяется во внешним, по отношению к ядру, модуле
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 *
 * @module common
 * @submodule events
 */



/**
 * Устанавливает соединение с вебсокет-сервером, обеспечивает приём и отправку сообщений
 * @class SocketMsg
 * @constructor
 */
function SocketMsg(){

	var socket_uid, ws, opened, attempt = 0, t = this;

	function reflect_react(data){
		if(data && data.type == "react"){
			try{
				var mgr = _md ? _md.mgr_by_class_name(data.class_name) : null;
				if(mgr)
					mgr.load_array([data.obj], true);

			}catch(err){
				$p.record_log(err);
			}
		}
	}

	t.connect = function(reset_attempt){

		// http://builder.local/debug.html#socket_uid=4e8b16b6-89b0-11e2-9c06-da48b440c859

		if(!socket_uid)
			socket_uid = $p.job_prm.parse_url().socket_uid || "";

		if(reset_attempt)
			attempt = 0;
		attempt++;

		// проверяем состояние и пытаемся установить ws соединение с Node
		if($p.job_prm.ws_url){
			if(!ws || !opened){
				try{
					ws = new WebSocket($p.job_prm.ws_url);

					ws.onopen = function() {
						opened = true;
						ws.send(JSON.stringify({
							socket_uid: socket_uid,
							zone: $p.wsql.get_user_param("zone"),
							browser_uid: $p.wsql.get_user_param("browser_uid"),
							_side: "js",
							_mirror: true
						}));
					};

					ws.onclose = function() {
						opened = false;
						setTimeout(t.connect, attempt < 3 ? 30000 : 600000);
					};

					ws.onmessage = function(ev) {
						var data;

						try{
							data = JSON.parse(ev.data);
						}catch(err){
							data = ev.data;
						}

						$p.eve.callEvent("socket_msg", [data]);
					};

					ws.onerror = $p.record_log;

				}catch(err){
					setTimeout(t.connect, attempt < 3 ? 30000 : 600000);
					$p.record_log(err);
				}
			}
		}
	};

	t.send = function (data) {
		if(ws && opened){
			if(!data)
				data = {};
			else if("object" != typeof data)
				data = {data: data};
			data.socket_uid = socket_uid;
			data._side = "js";
			ws.send(JSON.stringify(data));
		}
	};

	$p.eve.attachEvent("socket_msg", reflect_react);

}

/**
 * Интерфейс асинхронного обмена сообщениями
 * @property socket
 * @type {SocketMsg}
 */
$p.eve.socket = new SocketMsg();


/**
 * Читает порцию данных из веб-сервиса обмена данными
 * @method pop
 * @for AppEvents
 */
$p.eve.pop = function () {

	var cache_cat_date = $p.eve.stepper.cat_ini_date;

	// запрашиваем очередную порцию данных в 1С
	function get_cachable_portion(step){

		return _load({
			action: "get_cachable_portion",
			cache_cat_date: cache_cat_date,
			step_size: $p.eve.stepper.step_size,
			step: step || 0
		});
	}

	function update_cache_cat_date(need){
		if($p.eve.stepper.cat_ini_date > $p.wsql.get_user_param("cache_cat_date", "number"))
			$p.wsql.set_user_param("cache_cat_date", $p.eve.stepper.cat_ini_date);
		if(need)
			setTimeout(function () {
				$p.eve.pop(true);
			}, 10000);
	}

	if($p.job_prm.offline || !$p.job_prm.irest_enabled)
		return Promise.resolve(false);

	else {
		// TODO: реализовать синхронизацию на irest
		return Promise.resolve(false);
	}

	// за такт pop делаем не более 2 запросов к 1С
	return get_cachable_portion()

		// загружаем в ОЗУ данные первого запроса
		.then(function (req) {
			return $p.eve.from_json_to_data_obj(req);
		})

		.then(function (need) {
			if(need){
				return get_cachable_portion(1)

					.then(function (req) {
						return $p.eve.from_json_to_data_obj(req);
					})

					.then(function (need){
						update_cache_cat_date(need);
					});
			}
			update_cache_cat_date(need);
		});
};

/**
 * Записывает порцию данных в веб-сервис обмена данными
 * @method push
 * @for AppEvents
 */
$p.eve.push = function () {

};

$p.eve.from_json_to_data_obj = function(res) {

	var stepper = $p.eve.stepper, class_name;

	if (typeof res == "string")
		res = JSON.parse(res);
	else if(res instanceof XMLHttpRequest){
		if(res.response)
			res = JSON.parse(res.response);
		else
			res = {};
	}

	if(stepper.do_break){
		$p.iface.sync.close();
		$p.eve.redirect = true;
		location.reload(true);

	}else if(res["cat_date"] || res.force){
		if(res["cat_date"] > stepper.cat_ini_date)
			stepper.cat_ini_date = res["cat_date"];
		if(res["cat_date"] > stepper.cat_date)
			stepper.cat_date = res["cat_date"];
		if(res["count_all"])
			stepper.count_all = res["count_all"];
		if(res["current"])
			stepper.current = res["current"];

		for(class_name in res.cch)
			if(_cch[class_name])
				_cch[class_name].load_array(res.cch[class_name]);

		for(class_name in res.cacc)
			if(_cacc[class_name])
				_cacc[class_name].load_array(res.cacc[class_name]);

		for(class_name in res.cat)
			if(_cat[class_name])
				_cat[class_name].load_array(res.cat[class_name]);

		for(class_name in res.doc)
			if(_doc[class_name])
				_doc[class_name].load_array(res.doc[class_name]);

		for(class_name in res.ireg)
			if(_ireg[class_name])
				_ireg[class_name].load_array(res.ireg[class_name]);

		for(class_name in res.areg)
			if(_areg[class_name])
				_areg[class_name].load_array(res.areg[class_name]);

		// если все данные получены в первом запросе, второй можно не делать
		return res.current && (res.current >= stepper.step_size);
	}
};

// возаращает промис после выполнения всех заданий в очереди
$p.eve.reduce_promices = function(parts, callback){

	return parts.reduce(function(sequence, part_promise) {

		// Используем редуцирование что бы связать в очередь обещания, и добавить каждую главу на страницу
		return sequence.then(function() {
			return part_promise;

		})
			// загружаем все части в озу
			.then(callback)
			.catch(callback);

	}, Promise.resolve())
};

$p.eve.js_time_diff = -(new Date("0001-01-01")).valueOf();

$p.eve.time_diff = function () {
	var time_diff = $p.wsql.get_user_param("time_diff", "number");
	return (!time_diff || isNaN(time_diff) || time_diff < 62135571600000 || time_diff > 62135622000000) ? $p.eve.js_time_diff : time_diff;
};

/**
 * Этот фрагмент кода выполняем только в браузере
 * Created 28.12.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author Evgeniy Malyarov
 * @module common
 * @submodule events_browser
 */

/**
 * Этот фрагмент кода выполняем только в браузере
 * События окна внутри воркера и Node нас не интересуют
 */
(function(w){
	var eve = $p.eve,
		iface = $p.iface,
		msg = $p.msg,
		stepper = {},
		timer_setted = false,
		cache;

	/**
	 * Устанавливает состояние online/offline в параметрах работы программы
	 * @method set_offline
	 * @for AppEvents
	 * @param offline {Boolean}
	 */
	eve.set_offline = function(offline){
		var current_offline = $p.job_prm['offline'];
		$p.job_prm['offline'] = !!(offline || $p.wsql.get_user_param('offline', 'boolean'));
		if(current_offline != $p.job_prm['offline']){
			// предпринять действия
			current_offline = $p.job_prm['offline'];

		}
	};

	/**
	 * Тип устройства и ориентация экрана
	 * @param e
	 */
	eve.on_rotate = function (e) {
		$p.device_orient = (w.orientation == 0 || w.orientation == 180 ? "portrait":"landscape");
		if (typeof(e) != "undefined")
			w.dhx4.callEvent("onOrientationChange", [$p.device_orient]);
	};
	if(typeof(w.orientation)=="undefined")
		$p.device_orient = w.innerWidth>w.innerHeight ? "landscape" : "portrait";
	else
		eve.on_rotate();
	w.addEventListener("orientationchange", eve.on_rotate, false);

	$p.__define("device_type", {
		get: function () {
			var device_type = $p.wsql.get_user_param("device_type");
			if(!device_type){
				device_type = (function(i){return (i<1024?"phone":(i<1280?"tablet":"desktop"));})(Math.max(screen.width, screen.height));
				$p.wsql.set_user_param("device_type", device_type);
			}
			return device_type;
		},
		set: function (v) {
			$p.wsql.set_user_param("device_type", v);
		},
		enumerable: false,
		configurable: false
	});


	/**
	 * Отслеживаем онлайн
	 */
	w.addEventListener('online', eve.set_offline);
	w.addEventListener('offline', function(){eve.set_offline(true);});

	w.addEventListener('load', function(){

		/**
		 * Инициализацию выполняем с небольшой задержкой,
		 * чтобы позволить сторонним скриптам подписаться на событие onload и сделать свои черные дела
		 */
		setTimeout(function () {

			/**
			 * ### Данные геолокации
			 * Объект предоставляет доступ к функциям _геокодирования браузера_, а так же - геокодерам _Яндекс_ и _Гугл_
			 *
			 * @class IPInfo
			 * @static
			 */
			function IPInfo(){

				var _yageocoder,
					_ggeocoder,
					_ipgeo,
					_addr = "",
					_parts;

				/**
				 * Геокодер карт Яндекс
				 * @class YaGeocoder
				 * @static
				 */
				function YaGeocoder(){

					/**
					 * Выполняет прямое или обратное геокодирование
					 * @method geocode
					 * @param attr {Object}
					 * @return {Promise.<T>}
					 */
					this.geocode = function (attr) {
						//http://geocode-maps.yandex.ru/1.x/?geocode=%D0%A7%D0%B5%D0%BB%D1%8F%D0%B1%D0%B8%D0%BD%D1%81%D0%BA,+%D0%9F%D0%BB%D0%B5%D1%85%D0%B0%D0%BD%D0%BE%D0%B2%D0%B0+%D1%83%D0%BB%D0%B8%D1%86%D0%B0,+%D0%B4%D0%BE%D0%BC+32&format=json&sco=latlong
						//http://geocode-maps.yandex.ru/1.x/?geocode=61.4080273,55.1550362&format=json&lang=ru_RU

						return Promise.resolve(false);
					}
				}



				this.__define({

					ipgeo: {
						value: function () {
							return $p.ajax.get("//api.sypexgeo.net/")
								.then(function (req) {
									return JSON.parse(req.response);
								})
								.catch($p.record_log);
						}
					},

					/**
					 * Объект [геокодера yandex](https://tech.yandex.ru/maps/doc/geocoder/desc/concepts/input_params-docpage/)
					 * @property yageocoder
					 * @for IPInfo
					 * @type YaGeocoder
					 */
					yageocoder: {
						get : function(){

							if(!_yageocoder)
								_yageocoder = new YaGeocoder();
							return _yageocoder;
						},
						enumerable : false,
						configurable : false
					},

					/**
					 * Объект [геокодера google](https://developers.google.com/maps/documentation/geocoding/?hl=ru#GeocodingRequests)
					 * @property ggeocoder
					 * @for IPInfo
					 * @type {google.maps.Geocoder}
					 */
					ggeocoder: {
						get : function(){
							return _ggeocoder;
						},
						enumerable : false,
						configurable : false
					},

					/**
					 * Адрес геолокации пользователя программы
					 * @property addr
					 * @for IPInfo
					 * @type String
					 */
					addr: {
						get : function(){
							return _addr;
						}
					},

					parts: {
						get : function(){
							return _parts;
						}
					},

					components: {
						value : function(v, components){
							var i, c, j, street = "", street0 = "", locality = "";
							for(i in components){
								c = components[i];
								//street_number,route,locality,administrative_area_level_2,administrative_area_level_1,country,sublocality_level_1
								for(j in c.types){
									switch(c.types[j]){
										case "route":
											if(c.short_name.indexOf("Unnamed")==-1){
												street = c.short_name + (street ? (" " + street) : "");
												street0 = c.long_name.replace("улица", "").trim();
											}
											break;
										case "administrative_area_level_1":
											v.region = c.long_name;
											break;
										case "administrative_area_level_2":
											v.city = c.short_name;
											v.city_long = c.long_name;
											break;
										case "locality":
											locality = (locality ? (locality + " ") : "") + c.short_name;
											break;
										case "street_number":
											street = (street ? (street + " ") : "") + c.short_name;
											break;
										case "postal_code":
											v.postal_code = c.short_name;
											break;
										default:
											break;
									}
								}
							}
							if(v.region && v.region == v.city_long)
								if(v.city.indexOf(locality) == -1)
									v.city = locality;
								else
									v.city = "";
							else if(locality){
								if(v.city.indexOf(locality) == -1 && v.region.indexOf(locality) == -1)
									street = locality + ", " + street;
							}

							// если в адресе есть подстрока - не переписываем
							if(!v.street || v.street.indexOf(street0)==-1)
								v.street = street;

							return v;
						}
					}
				});

				this.location_callback= function(){

					_ggeocoder = new google.maps.Geocoder();

					navigator.geolocation.getCurrentPosition(function(position){

							/**
							 * Географическая широта геолокации пользователя программы
							 * @property latitude
							 * @for IPInfo
							 * @type Number
							 */
							$p.ipinfo.latitude = position.coords.latitude;

							/**
							 * Географическая долгота геолокации пользователя программы
							 * @property longitude
							 * @for IPInfo
							 * @type Number
							 */
							$p.ipinfo.longitude = position.coords.longitude;

							var latlng = new google.maps.LatLng($p.ipinfo.latitude, $p.ipinfo.longitude);

							_ggeocoder.geocode({'latLng': latlng}, function(results, status) {
								if (status == google.maps.GeocoderStatus.OK){
									if(!results[1] || results[0].address_components.length >= results[1].address_components.length)
										_parts = results[0];
									else
										_parts = results[1];
									_addr = _parts.formatted_address;

									dhx4.callEvent("geo_current_position", [$p.ipinfo.components({}, _parts.address_components)]);
								}
							});

						}, $p.record_log, {
							timeout: 30000
						}
					);
				}
			};

			function navigate(url){
				if(url && (location.origin + location.pathname).indexOf(url)==-1)
					location.replace(url);
			}

			/**
			 * Нулевым делом, создаём объект параметров работы программы, в процессе создания которого,
			 * выполняется клиентский скрипт, переопределяющий триггеры и переменные окружения
			 * Параметры имеют значения по умолчанию, могут переопределяться подключаемыми модулями
			 * и параметрами url, синтаксический разбор url производим сразу
			 * @property job_prm
			 * @for MetaEngine
			 * @type JobPrm
			 * @static
			 */
			$p.job_prm = new JobPrm();

			/**
			 * если в $p.job_prm указано использование геолокации, геокодер инициализируем с небольшой задержкой
			 */
			if($p.job_prm.use_ip_geo || $p.job_prm.use_google_geo){

				/**
				 * Данные геолокации
				 * @property ipinfo
				 * @for MetaEngine
				 * @type IPInfo
				 * @static
				 */
				$p.ipinfo = new IPInfo();

			}
			if (navigator.geolocation && $p.job_prm.use_google_geo) {

				// подгружаем скрипты google
				if(!window.google || !window.google.maps)
					$p.eve.onload.push(function () {
						setTimeout(function(){
							$p.load_script(location.protocol +
								"//maps.google.com/maps/api/js?callback=$p.ipinfo.location_callback", "script", function(){});
						}, 100);
					});
				else
					location_callback();
			}

			/**
			 * Если указано, навешиваем слушателя на postMessage
			 */
			if($p.job_prm.allow_post_message){
				/**
				 * Обработчик события postMessage сторонних окон или родительского окна (если iframe)
				 * @event message
				 * @for AppEvents
				 */
				w.addEventListener("message", function(event) {

					if($p.job_prm.allow_post_message == "*" || $p.job_prm.allow_post_message == event.origin){

						if(typeof event.data == "string"){
							try{
								var res = eval(event.data);
								if(res && event.source){
									if(typeof res == "object")
										res = JSON.stringify(res);
									else if(typeof res == "function")
										return;
									event.source.postMessage(res, "*");
								}
							}catch(e){
								$p.record_log(e);
							}
						}
					}
				});
			}

			// устанавливаем соединение с сокет-сервером
			eve.socket.connect();

			// проверяем совместимость браузера
			if(!w.JSON || !w.indexedDB){
				eve.redirect = true;
				msg.show_msg({type: "alert-error", text: msg.unsupported_browser, title: msg.unsupported_browser_title});
				throw msg.unsupported_browser;
				return;
			}

			/**
			 * Инициализируем параметры пользователя,
			 * проверяем offline и версию файлов
			 */
			function init_params(){

				$p.wsql.init_params().then(function(){

					function load_css(){

						var surl = dhtmlx.codebase, load_dhtmlx = true, load_meta = true;
						if(surl.indexOf("cdn.jsdelivr.net")!=-1)
							surl = "//cdn.jsdelivr.net/metadata/latest/"

						// стили загружаем только при необходимости
						for(i=0; i < document.styleSheets.length; i++){
							if(document.styleSheets[i].href){
								if(document.styleSheets[i].href.indexOf("dhx_web")!=-1 || document.styleSheets[i].href.indexOf("dhx_terrace")!=-1)
									load_dhtmlx = false;
								if(document.styleSheets[i].href.indexOf("metadata.css")!=-1)
									load_meta = false;
							}
						}

						// задаём основной скин
						dhtmlx.skin = $p.wsql.get_user_param("skin") || $p.job_prm.skin || "dhx_web";

						//str.replace(new RegExp(list[i] + '$'), 'finish')
						if(load_dhtmlx)
							$p.load_script(surl + (dhtmlx.skin == "dhx_web" ? "dhx_web.css" : "dhx_terrace.css"), "link");
						if(load_meta)
							$p.load_script(surl + "metadata.css", "link");

						// дополнительные стили
						if($p.job_prm.additional_css)
							$p.job_prm.additional_css.forEach(function (name) {
								if(dhx4.isIE || name.indexOf("ie_only") == -1)
									$p.load_script(name, "link");
							});

						// задаём путь к картинкам
						dhtmlx.image_path = "//oknosoft.github.io/metadata.js/lib/imgs/";

						// суффикс скина
						dhtmlx.skin_suffix = function () {
							return dhtmlx.skin.replace("dhx", "") + "/"
						};

						// запрещаем добавлять dhxr+date() к запросам get внутри dhtmlx
						dhx4.ajax.cache = true;

						/**
						 * ### Каркас оконного интерфейса
						 * См. описание на сайте dhtmlx [dhtmlXWindows](http://docs.dhtmlx.com/windows__index.html)
						 * @property w
						 * @for InterfaceObjs
						 * @type dhtmlXWindows
						 */
						$p.iface.__define("w", {
							value: new dhtmlXWindows(),
							enumerable: false
						});
						$p.iface.w.setSkin(dhtmlx.skin);

						/**
						 * ### Всплывающие подсказки
						 * См. описание на сайте dhtmlx [dhtmlXPopup](http://docs.dhtmlx.com/popup__index.html)
						 * @property popup
						 * @for InterfaceObjs
						 * @type dhtmlXPopup
						 */
						$p.iface.__define("popup", {
							value: new dhtmlXPopup(),
							enumerable: false
						});

					}

					// создавать dhtmlXWindows можно только после готовности документа
					if("dhtmlx" in w)
						load_css();

					eve.stepper = {
						step: 0,
						count_all: 0,
						cat_date: 0,
						step_size: 57,
						files: 0,
						cat_ini_date: $p.wsql.get_user_param("cache_cat_date", "number")  || 0
					};

					eve.set_offline(!navigator.onLine);

					eve.update_files_version();

					// пытаемся перейти в полноэкранный режим в мобильных браузерах
					if (document.documentElement.webkitRequestFullScreen
						&& navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)
						&& ($p.job_prm.request_full_screen || $p.wsql.get_user_param("request_full_screen"))) {
						var requestFullScreen = function(){
							document.documentElement.webkitRequestFullScreen();
							w.removeEventListener('touchstart', requestFullScreen);
						};
						w.addEventListener('touchstart', requestFullScreen, false);
					}

					/**
					 * Выполняем отложенные методы из eve.onload
					 */
					eve.onload.execute($p);

					// Если есть сплэш, удаляем его
					if(document && document.querySelector("#splash"))
						document.querySelector("#splash").parentNode.removeChild(document.querySelector("#splash"));

					// инициализируем метаданные и обработчик при начале работы интерфейса
					setTimeout(function () {
						$p.Meta.init_meta()
							.catch($p.record_log);
						iface.oninit();
					}, 20);


					$p.msg.russian_names();

					// TODO: переписать управление appcache на сервисворкерах
					if($p.wsql.get_user_param("use_service_worker", "boolean") && typeof navigator != "undefined"
						&& 'serviceWorker' in navigator && location.protocol.indexOf("https") != -1){

						// Override the default scope of '/' with './', so that the registration applies
						// to the current directory and everything underneath it.
						navigator.serviceWorker.register('metadata_service_worker.js', {scope: '/'})
							.then(function(registration) {
								// At this point, registration has taken place.
								// The service worker will not handle requests until this page and any
								// other instances of this page (in other tabs, etc.) have been closed/reloaded.
								$p.record_log('serviceWorker register succeeded');
							})
							.catch($p.record_log);

					}else if (cache = w.applicationCache){

						// обновление не требуется
						cache.addEventListener('noupdate', function(e){

						}, false);

						// Ресурсы уже кэшированнны. Индикатор прогресса скрыт.
						cache.addEventListener('cached', function(e){
							timer_setted = true;
							if($p.iface.appcache)
								$p.iface.appcache.close();
						}, false);

						// Начало скачивания ресурсов. progress_max - количество ресурсов. Показываем индикатор прогресса
						cache.addEventListener('downloading', do_cache_update_msg, false);

						// Процесс скачивания ресурсов. Индикатор прогресса изменяется
						cache.addEventListener('progress', do_cache_update_msg,	false);

						// Скачивание завершено. Скрываем индикатор прогресса. Обновляем кэш. Перезагружаем страницу.
						cache.addEventListener('updateready', function(e) {
							try{
								cache.swapCache();
								if($p.iface.appcache){
									$p.iface.appcache.close();
								}
							}catch(e){}
							do_reload();
						}, false);

						// Ошибка кеша
						cache.addEventListener('error', $p.record_log, false);
					}

				});
			}

			setTimeout(function(){

				/**
				 * проверяем поддержку промисов, при необходимости загружаем полифил
				 */
				if(typeof Promise !== "function"){
					$p.load_script("//cdn.jsdelivr.net/es6-promise/latest/es6-promise.min.js", "script", function () {
						ES6Promise.polyfill();
						init_params();
					});
				} else
					init_params();

			}, 20);

		}, 20);

		function do_reload(){
			if(!$p.ajax.authorized){
				eve.redirect = true;
				location.reload(true);
			}
		}

		function do_cache_update_msg(e){

			if(!stepper.wnd_appcache && $p.iface.appcache)
				$p.iface.appcache.create(stepper);

			else if(!timer_setted){
				timer_setted = true;
				setTimeout(do_reload, 25000);
			}

			if($p.iface.appcache){
				stepper.loaded = e.loaded || 0;
				stepper.total = e.total || 140;
				$p.iface.appcache.update();
			}

			if(stepper.do_break){
				$p.iface.appcache.close();
				setTimeout(do_reload, 1000);
			}
		}


	}, false);

	/**
	 * Обработчик события "перед закрытием окна"
	 * @event onbeforeunload
	 * @for AppEvents
	 * @returns {string} - если не путсто, браузер показывает диалог с вопросом, можно ли закрывать
	 */
	w.onbeforeunload = function(){
		if(!eve.redirect)
			return msg.onbeforeunload;
	};

	/**
	 * Обработчик back/forward событий браузера
	 * @event popstat
	 * @for AppEvents
	 */
	w.addEventListener("popstat", $p.iface.hash_route);

	/**
	 * Обработчик события изменения hash в url
	 * @event hashchange
	 * @for AppEvents
	 */
	w.addEventListener("hashchange", $p.iface.hash_route);

})(window);

/**
 * Шаги синхронизации (перечисление состояний)
 * @property steps
 * @for AppEvents
 * @type SyncSteps
 */
$p.eve.steps = {
	load_meta: 0,           // загрузка метаданных из файла
	authorization: 1,       // авторизация на сервере 1С или Node (в автономном режиме шаг не выполняется)
	create_managers: 2,     // создание менеджеров объектов
	process_access:  3,     // загрузка данных пользователя, обрезанных по RLS (контрагенты, договоры, организации)
	load_data_files: 4,     // загрузка данных из файла зоны
	load_data_db: 5,        // догрузка данных с сервера 1С или Node
	load_data_wsql: 6,      // загрузка данных из локальной датабазы (имеет смысл, если локальная база не в ОЗУ)
	save_data_wsql: 7       // кеширование данных из озу в локальную датабазу
};

/**
 * Запускает процесс входа в программу и начальную синхронизацию
 * @method log_in
 * @for AppEvents
 * @param onstep {Function} - callback обработки состояния. Функция вызывается в начале шага
 * @return {Promise.<T>} - промис, ошибки которого должен обработать вызывающий код
 * @async
 */
$p.eve.log_in = function(onstep){

	var stepper = $p.eve.stepper,
		irest_attr = {},
		data_url = $p.job_prm.data_url || "/data/",
		res,
		parts = [], mdd;

	// информируем о начале операций
	onstep($p.eve.steps.load_meta);

	// выясняем, доступен ли irest (наш сервис) или мы ограничены стандартным rest-ом
	// параллельно, проверяем авторизацию
	$p.ajax.default_attr(irest_attr, $p.job_prm.irest_url());
	res = $p.job_prm.offline ? Promise.resolve({responseURL: ""}) : $p.ajax.get_ex(irest_attr.url, irest_attr);

	return res
		.then(function (req) {
			if(!$p.job_prm.offline)
				$p.job_prm.irest_enabled = true;
			if(req.response[0] == "{")
				return JSON.parse(req.response);
		})

		.catch(function () {
			// если здесь ошибка, значит доступен только стандартный rest
		})

		.then(function (res) {


			onstep($p.eve.steps.authorization);

			// TODO: реализовать метод для получения списка ролей пользователя
			mdd = res || _md.dates();
			mdd.root = true;

			// в автономном режиме сразу переходим к чтению первого файла данных
			// если irest_enabled, значит уже авторизованы
			if($p.job_prm.offline || $p.job_prm.irest_enabled)
				return mdd;

			else
				return $p.ajax.get_ex($p.job_prm.rest_url()+"?$format=json", true)
					.then(function () {
						return mdd;
					});
		})

		// обработчик ошибок авторизации
		.catch(function (err) {

			if($p.iface.auth.onerror)
				$p.iface.auth.onerror(err);

			throw err;
		})

		// интерпретируем ответ сервера
		.then(function (res) {

			onstep($p.eve.steps.load_data_files);

			if($p.job_prm.offline)
				return res;

			// широковещательное оповещение об авторизованности на сервере
			dhx4.callEvent("authorized", [$p.ajax.authorized = true]);

			if(typeof res == "string")
				res = JSON.parse(res);

			if($p.msg.check_soap_result(res))
				return;

			if($p.wsql.get_user_param("enable_save_pwd"))
				$p.wsql.set_user_param("user_pwd", $p.ajax.password);
			else if($p.wsql.get_user_param("user_pwd"))
				$p.wsql.set_user_param("user_pwd", "");

			// обрабатываем поступившие данные
			if(res.now_1с && res.now_js)
				$p.wsql.set_user_param("time_diff", res.now_1с - res.now_js);

		})

		// сохраняем даты справочников в mdd и читаем первый файл данных
		.then(function(){

			stepper.zone = ($p.job_prm.demo ? "1" : $p.wsql.get_user_param("zone")) + "/";

			return $p.ajax.get(data_url + "zones/" + stepper.zone + "p_0.json?v="+$p.job_prm.files_date)
		})

		// из содержимого первого файла получаем количество файлов и загружаем их все
		.then(function (req) {

			var tmpres = JSON.parse(req.response);
			stepper.files = tmpres.files-1;
			stepper.step_size = tmpres.files > 0 ? Math.round(tmpres.count_all / tmpres.files) : 57;
			stepper.cat_ini_date = tmpres["cat_date"];
			$p.eve.from_json_to_data_obj(tmpres);

		})

		// формируем массив url файлов данных зоны
		.then(function () {

			parts = [];
			for(var i=1; i<=stepper.files; i++)
				parts.push($p.ajax.get(data_url + "zones/" + stepper.zone + "p_" + i + ".json?v="+$p.job_prm.files_date));
			parts.push($p.ajax.get(data_url + "zones/" + stepper.zone + "ireg.json?v="+$p.job_prm.files_date));

			return $p.eve.reduce_promices(parts, $p.eve.from_json_to_data_obj);

		})

		// если онлайн, выполняем такт обмена с 1С
		.then(function() {

			onstep($p.eve.steps.load_data_db);
			stepper.step_size = 57;
			return $p.eve.pop();

		})

		// читаем справочники с ограниченным доступом, которые могли прибежать вместе с метаданными
		.then(function () {

			if(mdd.access){
				mdd.access.force = true;
				$p.eve.from_json_to_data_obj(mdd.access);
			}

			// здесь же, уточняем список печатных форм и
			_md.printing_plates(mdd.printing_plates);

			// и запоминаем в ajax признак полноправности пользователя
			if($p.ajax.hasOwnProperty("root"))
				delete $p.ajax.root;
			$p.ajax.__define("root", {
				value: !!mdd.root,
				writable: false,
				enumerable: false
			});
		})

		// сохраняем данные в локальной датабазе
		.then(function () {
			onstep($p.eve.steps.save_data_wsql);
		});

};

$p.eve.auto_log_in = function () {
	var stepper = $p.eve.stepper,
		data_url = $p.job_prm.data_url || "/data/",
		parts = [],
		p_0;


	stepper.zone = $p.wsql.get_user_param("zone") + "/";

	// читаем файл метаданных, файл патча метаданных и первый файл снапшота
	return $p.ajax.get(data_url + "zones/" + stepper.zone + "p_0.json?v="+$p.job_prm.files_date)

		// из содержимого первого файла получаем количество файлов и загружаем их все
		.then(function (req) {

			p_0 = JSON.parse(req.response);

			stepper.files = p_0.files-1;
			stepper.step_size = p_0.files > 0 ? Math.round(p_0.count_all / p_0.files) : 57;
			stepper.cat_ini_date = p_0["cat_date"];
			$p.eve.from_json_to_data_obj(p_0);

		})

		// формируем массив url файлов данных зоны
		.then(function () {

			for(var i=1; i<=stepper.files; i++)
				parts.push($p.ajax.get(data_url + "zones/" + stepper.zone + "p_" + i + ".json?v="+$p.job_prm.files_date));
			parts.push($p.ajax.get(data_url + "zones/" + stepper.zone + "ireg.json?v="+$p.job_prm.files_date));

			return $p.eve.reduce_promices(parts, $p.eve.from_json_to_data_obj);

		})

		// читаем справочники с ограниченным доступом, которые могли прибежать вместе с метаданными
		.then(function () {
			stepper.step_size = 57;
		})
};

$p.eve.update_files_version = function () {

	if(!$p.job_prm || $p.job_prm.offline || !$p.job_prm.data_url)
		return Promise.resolve($p.wsql.get_user_param("files_date", "number") || 201601220000);

	if(!$p.job_prm.files_date)
		$p.job_prm.files_date = $p.wsql.get_user_param("files_date", "number");

	return $p.ajax.get($p.job_prm.data_url + "sync.json?v="+Date.now())
		.then(function (req) {
			var sync = JSON.parse(req.response);

			if(!$p.job_prm.confirmation && $p.job_prm.files_date != sync.files_date){

				$p.wsql.set_user_param("files_date", sync.files_date);

				if(sync.clear_meta){
					// чистим indexeddb
					$p.wsql.idx_connect(null, 'meta')
						.then(function (db) {
							return $p.wsql.idx_clear(null, db, 'meta');
						})
						.then(function () {
							return $p.wsql.idx_clear(null, db, 'static');
						})
						.catch($p.record_log);

				}else if(sync.clear_static){
					// чистим indexeddb
					$p.wsql.idx_connect(null, 'static')
						.then(function (db) {
							return $p.wsql.idx_clear(null, db, 'static');
						})
						.catch($p.record_log);
				}

				if(!$p.job_prm.files_date){
					$p.job_prm.files_date = sync.files_date;

				}else {

					$p.job_prm.confirmation = true;

					dhtmlx.confirm({
						title: $p.msg.file_new_date_title,
						text: $p.msg.file_new_date,
						ok: "Перезагрузка",
						cancel: "Продолжить",
						callback: function(btn) {

							delete $p.job_prm.confirmation;

							if(btn){
								$p.eve.redirect = true;
								location.reload(true);
							}
						}
					});
				}
			}

			return sync.files_date;

		}).catch($p.record_log)
};

/**
 * Регламентные задания синхронизапции каждые 3 минуты
 * @event ontimer
 * @for AppEvents
 */
$p.eve.ontimer = function () {

	// читаем файл версии файлов js. в случае изменений, оповещаем пользователя
	// TODO: это место желательно перенести в сервисворкер
	$p.eve.update_files_version();

};
setInterval($p.eve.ontimer, 180000);
$p.injected_data._mixin({"form_auth.xml":"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<items>\n\t<item type=\"settings\" position=\"label-left\" labelWidth=\"150\" inputWidth=\"230\" noteWidth=\"230\"/>\n\t<item type=\"fieldset\" name=\"data\" inputWidth=\"auto\" label=\"Авторизация\">\n\n        <item type=\"radio\" name=\"type\" labelWidth=\"auto\" position=\"label-right\" checked=\"true\" value=\"guest\" label=\"Гостевой (демо) режим\">\n            <item type=\"select\" name=\"guest\" label=\"Роль\">\n                <option value=\"Дилер\" label=\"Дилер\"/>\n            </item>\n        </item>\n\n\t\t<item type=\"radio\" name=\"type\" labelWidth=\"auto\" position=\"label-right\" value=\"auth\" label=\"Есть учетная запись\">\n\t\t\t<item type=\"input\" value=\"\" name=\"login\" label=\"Имя пользователя\" validate=\"NotEmpty\" />\n\t\t\t<item type=\"password\" value=\"\" name=\"password\" label=\"Пароль\" validate=\"NotEmpty\" />\n\t\t</item>\n\n\t\t<item type=\"button\" value=\"Войти\" name=\"submit\"/>\n\n        <item type=\"template\" name=\"text_options\" className=\"order_dealer_options\" inputWidth=\"231\"\n              value=\"&lt;a href='#' onclick='$p.iface.open_settings();' &gt; &lt;i class='fa fa-cog fa-lg'&gt;&lt;/i&gt; Настройки &lt;/a&gt; &lt;a href='//www.oknosoft.ru/feedback' target='_blank' style='margin-left: 9px;' &gt; &lt;i class='fa fa-question-circle fa-lg'&gt;&lt;/i&gt; Задать вопрос &lt;/a&gt;\"  />\n\n\t</item>\n</items>","toolbar_add_del.xml":"<?xml version=\"1.0\" encoding='utf-8'?>\r\n<toolbar>\r\n    <item id=\"sep0\" type=\"separator\"/>\r\n    <item type=\"button\" id=\"btn_add\"    text=\"&lt;i class='fa fa-plus-circle fa-lg'&gt;&lt;/i&gt; Добавить\" title=\"Добавить строку\"  />\r\n    <item type=\"button\" id=\"btn_delete\" text=\"&lt;i class='fa fa-times fa-lg'&gt;&lt;/i&gt; Удалить\"  title=\"Удалить строку\" />\r\n</toolbar>","toolbar_obj.xml":"<?xml version=\"1.0\" encoding='utf-8'?>\r\n<toolbar>\r\n    <item id=\"sep0\" type=\"separator\"/>\r\n    <item type=\"button\" id=\"btn_save_close\" text=\"&lt;b&gt;Записать и закрыть&lt;/b&gt;\" title=\"Рассчитать, записать и закрыть\" />\r\n    <item type=\"button\" id=\"btn_save\" text=\"&lt;i class='fa fa-floppy-o fa-lg fa-fw'&gt;&lt;/i&gt;\" title=\"Рассчитать и записать данные\"/>\r\n    <item type=\"button\" id=\"btn_post\" enabled=\"false\" text=\"&lt;i class='fa fa-check-square-o fa-lg fa-fw'&gt;&lt;/i&gt;\" title=\"Провести документ\" />\r\n    <item type=\"button\" id=\"btn_unpost\" enabled=\"false\" text=\"&lt;i class='fa fa-square-o fa-lg fa-fw'&gt;&lt;/i&gt;\" title=\"Отмена проведения\" />\r\n\r\n    <item type=\"button\" id=\"btn_files\" text=\"&lt;i class='fa fa-paperclip fa-lg fa-fw'&gt;&lt;/i&gt;\" title=\"Присоединенные файлы\"/>\r\n\r\n    <item type=\"buttonSelect\" id=\"bs_print\" text=\"&lt;i class='fa fa-print fa-lg fa-fw'&gt;&lt;/i&gt;\" title=\"Печать\" openAll=\"true\">\r\n    </item>\r\n\r\n    <item type=\"buttonSelect\" id=\"bs_create_by_virtue\" text=\"&lt;i class='fa fa-bolt fa-lg fa-fw'&gt;&lt;/i&gt;\" title=\"Создать на основании\" openAll=\"true\" >\r\n        <item type=\"button\" id=\"btn_message\" enabled=\"false\" text=\"Сообщение\" />\r\n    </item>\r\n\r\n    <item type=\"buttonSelect\" id=\"bs_go_to\" text=\"&lt;i class='fa fa-external-link fa-lg fa-fw'&gt;&lt;/i&gt;\" title=\"Перейти\" openAll=\"true\" >\r\n        <item type=\"button\" id=\"btn_go_connection\" enabled=\"false\" text=\"Связи\" />\r\n    </item>\r\n\r\n    <item type=\"buttonSelect\"   id=\"bs_more\"  text=\"&lt;i class='fa fa-th-large fa-lg fa-fw'&gt;&lt;/i&gt;\"  title=\"Дополнительно\" openAll=\"true\">\r\n\r\n        <item type=\"button\" id=\"btn_import\" text=\"&lt;i class='fa fa-upload fa-lg fa-fw'&gt;&lt;/i&gt; Загрузить из файла\" />\r\n        <item type=\"button\" id=\"btn_export\" text=\"&lt;i class='fa fa-download fa-lg fa-fw'&gt;&lt;/i&gt; Выгрузить в файл\" />\r\n    </item>\r\n\r\n    <item id=\"sep1\" type=\"separator\"/>\r\n    <item type=\"button\" id=\"btn_close\" text=\"&lt;i class='fa fa-times fa-lg fa-fw'&gt;&lt;/i&gt;\" title=\"Закрыть форму\"/>\r\n    <item id=\"sep2\" type=\"separator\"/>\r\n\r\n</toolbar>\r\n","toolbar_ok_cancel.xml":"<?xml version=\"1.0\" encoding='utf-8'?>\r\n<toolbar>\r\n    <item id=\"btn_ok\"       type=\"button\"   img=\"\"  imgdis=\"\"   text=\"&lt;b&gt;Ок&lt;/b&gt;\"  />\r\n    <item id=\"btn_cancel\"   type=\"button\"\timg=\"\"  imgdis=\"\"   text=\"Отмена\" />\r\n</toolbar>","toolbar_selection.xml":"<?xml version=\"1.0\" encoding='utf-8'?>\r\n<toolbar>\r\n\r\n    <item id=\"sep0\" type=\"separator\"/>\r\n\r\n    <item id=\"btn_select\"   type=\"button\"   title=\"Выбрать элемент списка\" text=\"&lt;b&gt;Выбрать&lt;/b&gt;\"  />\r\n\r\n    <item id=\"sep1\" type=\"separator\"/>\r\n    <item id=\"btn_new\"      type=\"button\"\ttext=\"&lt;i class='fa fa-plus-circle fa-lg'&gt;&lt;/i&gt;\"\ttitle=\"Создать\" />\r\n    <item id=\"btn_edit\"     type=\"button\"\ttext=\"&lt;i class='fa fa-pencil fa-lg'&gt;&lt;/i&gt;\"\ttitle=\"Изменить\" />\r\n    <item id=\"btn_delete\"   type=\"button\"\ttext=\"&lt;i class='fa fa-times fa-lg'&gt;&lt;/i&gt;\"\ttitle=\"Удалить\" />\r\n    <item id=\"sep2\" type=\"separator\"/>\r\n\r\n    <item type=\"buttonSelect\" id=\"bs_print\" text=\"&lt;i class='fa fa-print fa-lg'&gt;&lt;/i&gt; Печать\" openAll=\"true\" >\r\n    </item>\r\n\r\n    <item type=\"buttonSelect\"   id=\"bs_more\"    text=\"&lt;i class='fa fa-th-large fa-lg'&gt;&lt;/i&gt;\" title=\"Дополнительно\" openAll=\"true\">\r\n        <item id=\"btn_requery\"  type=\"button\"\ttext=\"&lt;i class='fa fa-refresh fa-lg fa-fw'&gt;&lt;/i&gt; Обновить список\" />\r\n    </item>\r\n\r\n    <item id=\"sep3\" type=\"separator\"/>\r\n\r\n</toolbar>","log.json":{"ireg":{"$log":{"name":"$log","note":"","synonym":"Журнал событий","dimensions":{"date":{"synonym":"Дата","multiline_mode":false,"tooltip":"Время события","type":{"types":["number"],"digits":15,"fraction_figits":0}},"sequence":{"synonym":"Порядок","multiline_mode":false,"tooltip":"Порядок следования","type":{"types":["number"],"digits":6,"fraction_figits":0}}},"resources":{"class":{"synonym":"Класс","multiline_mode":false,"tooltip":"Класс события","type":{"types":["string"],"str_len":100}},"note":{"synonym":"Комментарий","multiline_mode":true,"tooltip":"Текст события","type":{"types":["string"],"str_len":0}},"obj":{"synonym":"Объект","tooltip":"Объект, к которому относится событие","type":{"types":["string"],"str_len":0}}}}}}});
/* Copyright 2013 William Summers, metaTribal LLC
 * adapted from https://developer.mozilla.org/en-US/docs/JXON
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @author William Summers
 *
 */

var xmlToJSON = (function () {

	this.version = "1.3";

	var options = { // set up the default options
		mergeCDATA: true, // extract cdata and merge with text
		grokAttr: true, // convert truthy attributes to boolean, etc
		grokText: true, // convert truthy text/attr to boolean, etc
		normalize: true, // collapse multiple spaces to single space
		xmlns: true, // include namespaces as attribute in output
		namespaceKey: '_ns', // tag name for namespace objects
		textKey: '_text', // tag name for text nodes
		valueKey: '_value', // tag name for attribute values
		attrKey: '_attr', // tag for attr groups
		cdataKey: '_cdata', // tag for cdata nodes (ignored if mergeCDATA is true)
		attrsAsObject: true, // if false, key is used as prefix to name, set prefix to '' to merge children and attrs.
		stripAttrPrefix: true, // remove namespace prefixes from attributes
		stripElemPrefix: true, // for elements of same name in diff namespaces, you can enable namespaces and access the nskey property
		childrenAsArray: true // force children into arrays
	};

	var prefixMatch = new RegExp(/(?!xmlns)^.*:/);
	var trimMatch = new RegExp(/^\s+|\s+$/g);

	this.grokType = function (sValue) {
		if (/^\s*$/.test(sValue)) {
			return null;
		}
		if (/^(?:true|false)$/i.test(sValue)) {
			return sValue.toLowerCase() === "true";
		}
		if (isFinite(sValue)) {
			return parseFloat(sValue);
		}
		return sValue;
	};

	this.parseString = function (xmlString, opt) {
		return this.parseXML(this.stringToXML(xmlString), opt);
	}

	this.parseXML = function (oXMLParent, opt) {

		// initialize options
		for (var key in opt) {
			options[key] = opt[key];
		}

		var vResult = {},
			nLength = 0,
			sCollectedTxt = "";

		// parse namespace information
		if (options.xmlns && oXMLParent.namespaceURI) {
			vResult[options.namespaceKey] = oXMLParent.namespaceURI;
		}

		// parse attributes
		// using attributes property instead of hasAttributes method to support older browsers
		if (oXMLParent.attributes && oXMLParent.attributes.length > 0) {
			var vAttribs = {};

			for (nLength; nLength < oXMLParent.attributes.length; nLength++) {
				var oAttrib = oXMLParent.attributes.item(nLength);
				vContent = {};
				var attribName = '';

				if (options.stripAttrPrefix) {
					attribName = oAttrib.name.replace(prefixMatch, '');

				} else {
					attribName = oAttrib.name;
				}

				if (options.grokAttr) {
					vContent[options.valueKey] = this.grokType(oAttrib.value.replace(trimMatch, ''));
				} else {
					vContent[options.valueKey] = oAttrib.value.replace(trimMatch, '');
				}

				if (options.xmlns && oAttrib.namespaceURI) {
					vContent[options.namespaceKey] = oAttrib.namespaceURI;
				}

				if (options.attrsAsObject) { // attributes with same local name must enable prefixes
					vAttribs[attribName] = vContent;
				} else {
					vResult[options.attrKey + attribName] = vContent;
				}
			}

			if (options.attrsAsObject) {
				vResult[options.attrKey] = vAttribs;
			} else {}
		}

		// iterate over the children
		if (oXMLParent.hasChildNodes()) {
			for (var oNode, sProp, vContent, nItem = 0; nItem < oXMLParent.childNodes.length; nItem++) {
				oNode = oXMLParent.childNodes.item(nItem);

				if (oNode.nodeType === 4) {
					if (options.mergeCDATA) {
						sCollectedTxt += oNode.nodeValue;
					} else {
						if (vResult.hasOwnProperty(options.cdataKey)) {
							if (vResult[options.cdataKey].constructor !== Array) {
								vResult[options.cdataKey] = [vResult[options.cdataKey]];
							}
							vResult[options.cdataKey].push(oNode.nodeValue);

						} else {
							if (options.childrenAsArray) {
								vResult[options.cdataKey] = [];
								vResult[options.cdataKey].push(oNode.nodeValue);
							} else {
								vResult[options.cdataKey] = oNode.nodeValue;
							}
						}
					}
				} /* nodeType is "CDATASection" (4) */
				else if (oNode.nodeType === 3) {
					sCollectedTxt += oNode.nodeValue;
				} /* nodeType is "Text" (3) */
				else if (oNode.nodeType === 1) { /* nodeType is "Element" (1) */

					if (nLength === 0) {
						vResult = {};
					}

					// using nodeName to support browser (IE) implementation with no 'localName' property
					if (options.stripElemPrefix) {
						sProp = oNode.nodeName.replace(prefixMatch, '');
					} else {
						sProp = oNode.nodeName;
					}

					vContent = xmlToJSON.parseXML(oNode);

					if (vResult.hasOwnProperty(sProp)) {
						if (vResult[sProp].constructor !== Array) {
							vResult[sProp] = [vResult[sProp]];
						}
						vResult[sProp].push(vContent);

					} else {
						if (options.childrenAsArray) {
							vResult[sProp] = [];
							vResult[sProp].push(vContent);
						} else {
							vResult[sProp] = vContent;
						}
						nLength++;
					}
				}
			}
		} else if (!sCollectedTxt) { // no children and no text, return null
			if (options.childrenAsArray) {
				vResult[options.textKey] = [];
				vResult[options.textKey].push(null);
			} else {
				vResult[options.textKey] = null;
			}
		}

		if (sCollectedTxt) {
			if (options.grokText) {
				var value = this.grokType(sCollectedTxt.replace(trimMatch, ''));
				if (value !== null && value !== undefined) {
					vResult[options.textKey] = value;
				}
			} else if (options.normalize) {
				vResult[options.textKey] = sCollectedTxt.replace(trimMatch, '').replace(/\s+/g, " ");
			} else {
				vResult[options.textKey] = sCollectedTxt.replace(trimMatch, '');
			}
		}

		return vResult;
	}


	// Convert xmlDocument to a string
	// Returns null on failure
	this.xmlToString = function (xmlDoc) {
		try {
			var xmlString = xmlDoc.xml ? xmlDoc.xml : (new XMLSerializer()).serializeToString(xmlDoc);
			return xmlString;
		} catch (err) {
			return null;
		}
	}

	// Convert a string to XML Node Structure
	// Returns null on failure
	this.stringToXML = function (xmlString) {
		try {
			var xmlDoc = null;

			if (window.DOMParser) {

				var parser = new DOMParser();
				xmlDoc = parser.parseFromString(xmlString, "text/xml");

				return xmlDoc;
			} else {
				xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async = false;
				xmlDoc.loadXML(xmlString);

				return xmlDoc;
			}
		} catch (e) {
			return null;
		}
	}

	return this;
})();

if (typeof module != "undefined" && module !== null && module.exports) module.exports = xmlToJSON;
else if (typeof define === "function" && define.amd) define(function() {return xmlToJSON});
/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.1.20151003
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
		"use strict";
		// IE <10 is explicitly unsupported
		if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
			return;
		}
		var
			doc = view.document
		// only get URL when necessary in case Blob.js hasn't overridden it yet
			, get_URL = function() {
				return view.URL || view.webkitURL || view;
			}
			, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
			, can_use_save_link = "download" in save_link
			, click = function(node) {
				var event = new MouseEvent("click");
				node.dispatchEvent(event);
			}
			, is_safari = /Version\/[\d\.]+.*Safari/.test(navigator.userAgent)
			, webkit_req_fs = view.webkitRequestFileSystem
			, req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
			, throw_outside = function(ex) {
				(view.setImmediate || view.setTimeout)(function() {
					throw ex;
				}, 0);
			}
			, force_saveable_type = "application/octet-stream"
			, fs_min_size = 0
		// See https://code.google.com/p/chromium/issues/detail?id=375297#c7 and
		// https://github.com/eligrey/FileSaver.js/commit/485930a#commitcomment-8768047
		// for the reasoning behind the timeout and revocation flow
			, arbitrary_revoke_timeout = 500 // in ms
			, revoke = function(file) {
				var revoker = function() {
					if (typeof file === "string") { // file is an object URL
						get_URL().revokeObjectURL(file);
					} else { // file is a File
						file.remove();
					}
				};
				if (view.chrome) {
					revoker();
				} else {
					setTimeout(revoker, arbitrary_revoke_timeout);
				}
			}
			, dispatch = function(filesaver, event_types, event) {
				event_types = [].concat(event_types);
				var i = event_types.length;
				while (i--) {
					var listener = filesaver["on" + event_types[i]];
					if (typeof listener === "function") {
						try {
							listener.call(filesaver, event || filesaver);
						} catch (ex) {
							throw_outside(ex);
						}
					}
				}
			}
			, auto_bom = function(blob) {
				// prepend BOM for UTF-8 XML and text/* types (including HTML)
				if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
					return new Blob(["\ufeff", blob], {type: blob.type});
				}
				return blob;
			}
			, FileSaver = function(blob, name, no_auto_bom) {
				if (!no_auto_bom) {
					blob = auto_bom(blob);
				}
				// First try a.download, then web filesystem, then object URLs
				var
					filesaver = this
					, type = blob.type
					, blob_changed = false
					, object_url
					, target_view
					, dispatch_all = function() {
						dispatch(filesaver, "writestart progress write writeend".split(" "));
					}
				// on any filesys errors revert to saving with object URLs
					, fs_error = function() {
						if (target_view && is_safari && typeof FileReader !== "undefined") {
							// Safari doesn't allow downloading of blob urls
							var reader = new FileReader();
							reader.onloadend = function() {
								var base64Data = reader.result;
								target_view.location.href = "data:attachment/file" + base64Data.slice(base64Data.search(/[,;]/));
								filesaver.readyState = filesaver.DONE;
								dispatch_all();
							};
							reader.readAsDataURL(blob);
							filesaver.readyState = filesaver.INIT;
							return;
						}
						// don't create more object URLs than needed
						if (blob_changed || !object_url) {
							object_url = get_URL().createObjectURL(blob);
						}
						if (target_view) {
							target_view.location.href = object_url;
						} else {
							var new_tab = view.open(object_url, "_blank");
							if (new_tab == undefined && is_safari) {
								//Apple do not allow window.open, see http://bit.ly/1kZffRI
								view.location.href = object_url
							}
						}
						filesaver.readyState = filesaver.DONE;
						dispatch_all();
						revoke(object_url);
					}
					, abortable = function(func) {
						return function() {
							if (filesaver.readyState !== filesaver.DONE) {
								return func.apply(this, arguments);
							}
						};
					}
					, create_if_not_found = {create: true, exclusive: false}
					, slice
					;
				filesaver.readyState = filesaver.INIT;
				if (!name) {
					name = "download";
				}
				if (can_use_save_link) {
					object_url = get_URL().createObjectURL(blob);
					setTimeout(function() {
						save_link.href = object_url;
						save_link.download = name;
						click(save_link);
						dispatch_all();
						revoke(object_url);
						filesaver.readyState = filesaver.DONE;
					});
					return;
				}
				// Object and web filesystem URLs have a problem saving in Google Chrome when
				// viewed in a tab, so I force save with application/octet-stream
				// http://code.google.com/p/chromium/issues/detail?id=91158
				// Update: Google errantly closed 91158, I submitted it again:
				// https://code.google.com/p/chromium/issues/detail?id=389642
				if (view.chrome && type && type !== force_saveable_type) {
					slice = blob.slice || blob.webkitSlice;
					blob = slice.call(blob, 0, blob.size, force_saveable_type);
					blob_changed = true;
				}
				// Since I can't be sure that the guessed media type will trigger a download
				// in WebKit, I append .download to the filename.
				// https://bugs.webkit.org/show_bug.cgi?id=65440
				if (webkit_req_fs && name !== "download") {
					name += ".download";
				}
				if (type === force_saveable_type || webkit_req_fs) {
					target_view = view;
				}
				if (!req_fs) {
					fs_error();
					return;
				}
				fs_min_size += blob.size;
				req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
					fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
						var save = function() {
							dir.getFile(name, create_if_not_found, abortable(function(file) {
								file.createWriter(abortable(function(writer) {
									writer.onwriteend = function(event) {
										target_view.location.href = file.toURL();
										filesaver.readyState = filesaver.DONE;
										dispatch(filesaver, "writeend", event);
										revoke(file);
									};
									writer.onerror = function() {
										var error = writer.error;
										if (error.code !== error.ABORT_ERR) {
											fs_error();
										}
									};
									"writestart progress write abort".split(" ").forEach(function(event) {
										writer["on" + event] = filesaver["on" + event];
									});
									writer.write(blob);
									filesaver.abort = function() {
										writer.abort();
										filesaver.readyState = filesaver.DONE;
									};
									filesaver.readyState = filesaver.WRITING;
								}), fs_error);
							}), fs_error);
						};
						dir.getFile(name, {create: false}, abortable(function(file) {
							// delete file if it already exists
							file.remove();
							save();
						}), abortable(function(ex) {
							if (ex.code === ex.NOT_FOUND_ERR) {
								save();
							} else {
								fs_error();
							}
						}));
					}), fs_error);
				}), fs_error);
			}
			, FS_proto = FileSaver.prototype
			, saveAs = function(blob, name, no_auto_bom) {
				return new FileSaver(blob, name, no_auto_bom);
			}
			;
		// IE 10+ (native saveAs)
		if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
			return function(blob, name, no_auto_bom) {
				if (!no_auto_bom) {
					blob = auto_bom(blob);
				}
				return navigator.msSaveOrOpenBlob(blob, name || "download");
			};
		}

		FS_proto.abort = function() {
			var filesaver = this;
			filesaver.readyState = filesaver.DONE;
			dispatch(filesaver, "abort");
		};
		FS_proto.readyState = FS_proto.INIT = 0;
		FS_proto.WRITING = 1;
		FS_proto.DONE = 2;

		FS_proto.error =
			FS_proto.onwritestart =
				FS_proto.onprogress =
					FS_proto.onwrite =
						FS_proto.onabort =
							FS_proto.onerror =
								FS_proto.onwriteend =
									null;

		return saveAs;
	}(
		typeof self !== "undefined" && self
		|| typeof window !== "undefined" && window
		|| this.content
	));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
	module.exports.saveAs = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd != null)) {
	define([], function() {
		return saveAs;
	});
}
return $p;
}));
