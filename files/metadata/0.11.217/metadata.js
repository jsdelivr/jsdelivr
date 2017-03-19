/*!
 metadata.js v0.11.217, built:2016-08-08 &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 metadata.js may be freely distributed under the AGPL-3.0. To obtain _Oknosoft Commercial license_, contact info@oknosoft.ru
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
//! moment.js locale configuration
//! locale : Russian [ru]
//! author : Viktorminator : https://github.com/Viktorminator
//! Author : Menelion Elensúle : https://github.com/Oire
//! author : Коренберг Марк : https://github.com/socketpair

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, function (moment) { 'use strict';


    function plural(word, num) {
        var forms = word.split('_');
        return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
    }
    function relativeTimeWithPlural(number, withoutSuffix, key) {
        var format = {
            'mm': withoutSuffix ? 'минута_минуты_минут' : 'минуту_минуты_минут',
            'hh': 'час_часа_часов',
            'dd': 'день_дня_дней',
            'MM': 'месяц_месяца_месяцев',
            'yy': 'год_года_лет'
        };
        if (key === 'm') {
            return withoutSuffix ? 'минута' : 'минуту';
        }
        else {
            return number + ' ' + plural(format[key], +number);
        }
    }
    var monthsParse = [/^янв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[йя]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^ноя/i, /^дек/i];

    // http://new.gramota.ru/spravka/rules/139-prop : § 103
    // Сокращения месяцев: http://new.gramota.ru/spravka/buro/search-answer?s=242637
    // CLDR data:          http://www.unicode.org/cldr/charts/28/summary/ru.html#1753
    var ru = moment.defineLocale('ru', {
        months : {
            format: 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split('_'),
            standalone: 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_')
        },
        monthsShort : {
            // по CLDR именно "июл." и "июн.", но какой смысл менять букву на точку ?
            format: 'янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.'.split('_'),
            standalone: 'янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.'.split('_')
        },
        weekdays : {
            standalone: 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
            format: 'воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу'.split('_'),
            isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/
        },
        weekdaysShort : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
        weekdaysMin : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
        monthsParse : monthsParse,
        longMonthsParse : monthsParse,
        shortMonthsParse : monthsParse,

        // полные названия с падежами, по три буквы, для некоторых, по 4 буквы, сокращения с точкой и без точки
        monthsRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,

        // копия предыдущего
        monthsShortRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,

        // полные названия с падежами
        monthsStrictRegex: /^(январ[яь]|феврал[яь]|марта?|апрел[яь]|ма[яй]|июн[яь]|июл[яь]|августа?|сентябр[яь]|октябр[яь]|ноябр[яь]|декабр[яь])/i,

        // Выражение, которое соотвествует только сокращённым формам
        monthsShortStrictRegex: /^(янв\.|февр?\.|мар[т.]|апр\.|ма[яй]|июн[ья.]|июл[ья.]|авг\.|сент?\.|окт\.|нояб?\.|дек\.)/i,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D MMMM YYYY г.',
            LLL : 'D MMMM YYYY г., HH:mm',
            LLLL : 'dddd, D MMMM YYYY г., HH:mm'
        },
        calendar : {
            sameDay: '[Сегодня в] LT',
            nextDay: '[Завтра в] LT',
            lastDay: '[Вчера в] LT',
            nextWeek: function (now) {
                if (now.week() !== this.week()) {
                    switch (this.day()) {
                        case 0:
                            return '[В следующее] dddd [в] LT';
                        case 1:
                        case 2:
                        case 4:
                            return '[В следующий] dddd [в] LT';
                        case 3:
                        case 5:
                        case 6:
                            return '[В следующую] dddd [в] LT';
                    }
                } else {
                    if (this.day() === 2) {
                        return '[Во] dddd [в] LT';
                    } else {
                        return '[В] dddd [в] LT';
                    }
                }
            },
            lastWeek: function (now) {
                if (now.week() !== this.week()) {
                    switch (this.day()) {
                        case 0:
                            return '[В прошлое] dddd [в] LT';
                        case 1:
                        case 2:
                        case 4:
                            return '[В прошлый] dddd [в] LT';
                        case 3:
                        case 5:
                        case 6:
                            return '[В прошлую] dddd [в] LT';
                    }
                } else {
                    if (this.day() === 2) {
                        return '[Во] dddd [в] LT';
                    } else {
                        return '[В] dddd [в] LT';
                    }
                }
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : 'через %s',
            past : '%s назад',
            s : 'несколько секунд',
            m : relativeTimeWithPlural,
            mm : relativeTimeWithPlural,
            h : 'час',
            hh : relativeTimeWithPlural,
            d : 'день',
            dd : relativeTimeWithPlural,
            M : 'месяц',
            MM : relativeTimeWithPlural,
            y : 'год',
            yy : relativeTimeWithPlural
        },
        meridiemParse: /ночи|утра|дня|вечера/i,
        isPM : function (input) {
            return /^(дня|вечера)$/.test(input);
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 4) {
                return 'ночи';
            } else if (hour < 12) {
                return 'утра';
            } else if (hour < 17) {
                return 'дня';
            } else {
                return 'вечера';
            }
        },
        ordinalParse: /\d{1,2}-(й|го|я)/,
        ordinal: function (number, period) {
            switch (period) {
                case 'M':
                case 'd':
                case 'DDD':
                    return number + '-й';
                case 'D':
                    return number + '-го';
                case 'w':
                case 'W':
                    return number + '-я';
                default:
                    return number;
            }
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 1st is the first week of the year.
        }
    });

    return ru;

}));
/**
 * Глобальные переменные и общие методы фреймворка __metadata.js__ <i>Oknosoft data engine</i>
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * Экспортирует глобальную переменную __$p__ типа {{#crossLink "MetaEngine"}}{{/crossLink}}
 * @module  common
 */


/**
 * Фреймворк добавляет в прототипы _Object_ и _Number_<br />
 * несколько методов - синтаксический сахар для _наследования_ и работы со _свойствами_
 * @class Object
 * @constructor
 */


Object.defineProperties(Object.prototype, {

	/**
	 * Синтаксический сахар для defineProperty
	 * @method __define
	 * @for Object
	 */
	__define: {
		value: function( key, descriptor ) {
			if( descriptor ) {
				Object.defineProperty( this, key, descriptor );
			} else {
				Object.defineProperties( this, key );
			}
			return this;
		}
	},

	/**
	 * Реализует наследование текущим конструктором свойств и методов конструктора Parent
	 * @method _extend
	 * @for Object
	 * @param Parent {Function}
	 */
	_extend: {
		value: function( Parent ) {
			var F = function() { };
			F.prototype = Parent.prototype;
			this.prototype = new F();
			this.prototype.constructor = this;
			this.__define("superclass", {
				value: Parent.prototype,
				enumerable: false
			});
		}
	},

	/**
	 * Копирует все свойства из src в текущий объект исключая те, что в цепочке прототипов src до Object
	 * @method _mixin
	 * @for Object
	 * @param src {Object} - источник
	 * @return {this}
	 */
	_mixin: {
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
		}
	},

	/**
	 * Создаёт копию объекта
	 * @method _clone
	 * @for Object
	 * @param src {Object|Array} - исходный объект
	 * @param [exclude_propertyes] {Object} - объект, в ключах которого имена свойств, которые не надо копировать
	 * @returns {Object|Array} - копия объекта
	 */
	_clone: {
		value: function() {
			if(!this || "object" !== typeof this)
				return this;
			var p, v, c = "function" === typeof this.pop ? [] : {};
			for(p in this){
				if (this.hasOwnProperty(p)){
					v = this[p];
					if(v){
						if("function" === typeof v || v instanceof DataObj || v instanceof DataManager || v instanceof Date)
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
		}
	}
});

/**
 * Метод округления в прототип числа
 * @method round
 * @for Number
 */
if(!Number.prototype.round)
	Number.prototype.round = function(places) {
		var multiplier = Math.pow(10, places);
		return (Math.round(this * multiplier) / multiplier);
	};

/**
 * Метод дополнения лидирующими нулями в прототип числа
 * @method pad
 * @for Number
 */
if(!Number.prototype.pad)
	Number.prototype.pad = function(size) {
		var s = String(this);
		while (s.length < (size || 2)) {s = "0" + s;}
		return s;
	};

/**
 * Полифил обсервера и нотифаера
 */
if(!Object.observe && !Object.unobserve && !Object.getNotifier){
	Object.prototype.__define({

		/**
		 * Подключает наблюдателя
		 * @method observe
		 * @for Object
		 */
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

		/**
		 * Отключает наблюдателя
		 * @method unobserve
		 * @for Object
		 */
		unobserve: {
			value: function(target, observer) {
				if(!target._observers)
					return;
				for(var i=0; i<target._observers.length; i++){
					if(target._observers[i]===observer){
						target._observers.splice(i, 1);
						break;
					}
				}
			},
			enumerable: false
		},

		/**
		 * Возвращает объект нотификатора
		 * @method getNotifier
		 * @for Object
		 */
		getNotifier: {
			value: function(target) {
				var timer;
				return {
					notify: function (noti) {

						if(!target._observers || !noti)
							return;

						if(!noti.object)
							noti.object = target;

						target._notis.push(noti);
						noti = null;

						if(timer)
							clearTimeout(timer);

						timer = setTimeout(function () {
							//TODO: свернуть массив оповещений перед отправкой
							if(target._notis.length){
								target._observers.forEach(function (observer) {
									observer(target._notis);
								});
								target._notis.length = 0;
							}
							timer = false;

						}, 4);
					}
				}
			},
			enumerable: false
		}

	});
}


/**
 * Для совместимости со старыми модулями, публикуем $p глобально
 * Кроме этой переменной, metadata.js ничего не экспортирует
 */
var $p = new MetaEngine();


/**
 * ### Metadata.js - проект с открытым кодом
 * Приглашаем к сотрудничеству всех желающих. Будем благодарны за любую помощь
 *
 * ### Почему Metadata.js?
 * Библиотека предназначена для разработки бизнес-ориентированных и учетных offline-first браузерных приложений
 * и содержит JavaScript реализацию [Объектной модели 1С](http://v8.1cru/overview/Platform.htm).
 * Библиотека эмулирует наиболее востребованные классы API 1С внутри браузера или Node.js, дополняя их средствами автономной работы и обработки данных на клиенте.
 *
 * ### Для кого?
 * Для разработчиков мобильных и браузерных приложений, которым близка парадигма 1С _на базе бизнес-объектов: документов и справочников_,
 * но которым тесно в рамках традиционной платформы 1С.<br />
 * Metadata.js предоставляет программисту:
 * - высокоуровневые [data-объекты](http://www.oknosoft.ru/upzp/apidocs/classes/DataObj.html), схожие по функциональности с документами, регистрами и справочниками платформы 1С
 * - инструменты декларативного описания метаданных и автогенерации интерфейса, схожие по функциональности с метаданными и формами платформы 1С
 * - средства событийно-целостной репликации и эффективные классы обработки данных, не имеющие прямых аналогов в 1С
 *
 * ### Контекст metadata.js
 * [metadata.js](https://github.com/oknosoft/metadata.js), экспортирует в глобальную область видимости переменную __$p__ типа {{#crossLink "MetaEngine"}}{{/crossLink}}
 *
 * @class MetaEngine
 * @static
 * @menuorder 00
 * @tooltip Контекст metadata.js
 */
function MetaEngine() {

	this.__define({

		version: {
			value: "0.11.217",
			writable: false
		},

		toString: {
			value: function(){
				return "Oknosoft data engine. v:" + this.version;
			},
			writable: false
		},

		/**
		 * ### Коллекция вспомогательных методов
		 *
		 * @property utils
		 * @type Utils
		 * @final
		 */
		utils: {
			value: new Utils()
		},

		/**
		 * ### Буфер для строковых и двоичных данных, внедряемых в скрипт
		 * В этой структуре живут, например, sql текст инициализации таблиц, xml-строки форм и менюшек и т.д.
		 *
		 * @property injected_data
		 * @type Object
		 * @final
		 */
		injected_data: {
			value: {},
			writable: false
		},

		/**
		 * Наша promise-реализация ajax
		 *
		 * @property ajax
		 * @type Ajax
		 * @final
		 */
		ajax: {
			value: new Ajax(),
			writable: false
		},

		/**
		 * Сообщения пользователю и строки нитернационализации
		 * @property msg
		 * @type Messages
		 * @final
		 */
		msg: {
			value: new Messages(),
			writable: false
		},

		/**
		 * Интерфейс к данным в LocalStorage, AlaSQL и IndexedDB
		 * @property wsql
		 * @type WSQL
		 * @final
		 */
		wsql: {
			value: new WSQL(),
			writable: false
		},

		/**
		 * Обработчики событий приложения
		 * Подробнее см. модули {{#crossLinkModule "events"}}{{/crossLinkModule}} и {{#crossLinkModule "events.ui"}}{{/crossLinkModule}}
		 * @property eve
		 * @type AppEvents
		 * @final
		 */
		eve: {
			value: new AppEvents(),
			writable: false
		},

		/**
		 * Aes для шифрования - дешифрования данных
		 *
		 * @property aes
		 * @type Aes
		 * @final
		 */
		aes: {
			value: new Aes("metadata.js"),
			writable: false
		},

		/**
		 * ### Moment для операций с интервалами и датами
		 *
		 * @property moment
		 * @type Function
		 * @final
		 */
		moment: {
			get: function () { return this.utils.moment; }
		},

		/**
		 * ### Подмешивает в объект свойства с иерархией объекта patch
		 * В отличии от `_mixin`, не замещает, а дополняет одноименные свойства
		 *
		 * @method _patch
		 * @param obj {Object}
		 * @param patch {Object}
		 * @return {Object} - исходный объект с подмешанными свойствами
		 */
		_patch: {
			value: function (obj, patch) {
				for(var area in patch){

					if(typeof patch[area] == "object"){
						if(obj[area] && typeof obj[area] == "object")
							$p._patch(obj[area], patch[area]);
						else
							obj[area] = patch[area];
					}else
						obj[area] = patch[area];
				}
				return obj;
			}
		},

		/**
		 * Абстрактный поиск значения в коллекции
		 * @method _find
		 * @param a {Array}
		 * @param val {DataObj|String}
		 * @param val {Array|String} - имена полей, в которых искать
		 * @return {*}
		 * @private
		 */
		_find: {
			value: function(a, val, columns){
				//TODO переписать с учетом html5 свойств массивов
				var o, i, finded;
				if(typeof val != "object"){
					for(i in a){ // ищем по всем полям объекта
						o = a[i];
						for(var j in o){
							if(typeof o[j] !== "function" && $p.utils.is_equal(o[j], val))
								return o;
						}
					}
				}else{
					for(i in a){ // ищем по ключам из val
						o = a[i];
						finded = true;
						for(var j in val){
							if(typeof o[j] !== "function" && !$p.utils.is_equal(o[j], val[j])){
								finded = false;
								break;
							}
						}
						if(finded)
							return o;
					}
				}
			}
		},

		/**
		 * Выясняет, удовлетворяет ли объект `o` условию `selection`
		 * @method _selection
		 * @param o {Object}
		 * @param [selection]
		 * @private
		 */
		_selection: {
			value: function (o, selection) {

				var ok = true, j, sel, is_obj;

				if(selection){
					// если отбор является функцией, выполняем её, передав контекст
					if(typeof selection == "function")
						ok = selection.call(this, o);

					else{
						// бежим по всем свойствам `selection`
						for(j in selection){

							sel = selection[j];
							is_obj = typeof(sel) === "object";

							// пропускаем служебные свойства
							if(j.substr(0, 1) == "_")
								continue;

							// если свойство отбора является функцией, выполняем её, передав контекст
							else if(typeof sel == "function"){
								ok = sel.call(this, o, j);
								if(!ok)
									break;

								// если свойство отбора является объектом `or`, выполняем Array.some() TODO: здесь напрашивается рекурсия
							}else if(j == "or" && Array.isArray(sel)){
								ok = sel.some(function (element) {
									var key = Object.keys(element)[0];
									if(element[key].hasOwnProperty("like"))
										return o[key] && o[key].toLowerCase().indexOf(element[key].like.toLowerCase())!=-1;
									else
										return $p.utils.is_equal(o[key], element[key]);
								});
								if(!ok)
									break;

								// если свойство отбора является объектом `like`, сравниваем подстроку
							}else if(is_obj && sel.hasOwnProperty("like")){
								if(!o[j] || o[j].toLowerCase().indexOf(sel.like.toLowerCase())==-1){
									ok = false;
									break;
								}

								// если свойство отбора является объектом `not`, сравниваем на неравенство
							}else if(is_obj && sel.hasOwnProperty("not")){
								if($p.utils.is_equal(o[j], sel.not)){
									ok = false;
									break;
								}

								// если свойство отбора является объектом `in`, выполняем Array.some()
							}else if(is_obj && sel.hasOwnProperty("in")){
								ok = sel.in.some(function(element) {
									return $p.utils.is_equal(element, o[j]);
								});
								if(!ok)
									break;

								// если свойство отбора является объектом `lt`, сравниваем на _меньше_
							}else if(is_obj && sel.hasOwnProperty("lt")){
								ok = o[j] < sel.lt;
								if(!ok)
									break;

								// если свойство отбора является объектом `gt`, сравниваем на _больше_
							}else if(is_obj && sel.hasOwnProperty("gt")){
								ok = o[j] > sel.gt;
								if(!ok)
									break;

								// если свойство отбора является объектом `between`, сравниваем на _вхождение_
							}else if(is_obj && sel.hasOwnProperty("between")){
								var tmp = o[j];
								if(typeof tmp != "number")
									tmp = $p.utils.fix_date(o[j]);
								ok = (tmp >= sel.between[0]) && (tmp <= sel.between[1]);
								if(!ok)
									break;

							}else if(!$p.utils.is_equal(o[j], sel)){
								ok = false;
								break;
							}
						}
					}
				}

				return ok;
			}
		},

		/**
		 * ### Поиск массива значений в коллекции
		 * Кроме стандартного поиска по равенству значений,
		 * поддержаны операторы `in`, `not` и `like` и фильтрация через внешнюю функцию
		 * @method _find_rows
		 * @param arr {Array}
		 * @param selection {Object|function} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"} или {not: значение}
		 * @param callback {Function}
		 * @return {Array}
		 * @private
		 */
		_find_rows: {
			value: function(arr, selection, callback){

				var o, res = [], top, count = 0;

				if(selection){
					if(selection._top){
						top = selection._top;
						delete selection._top;
					}else
						top = 300;
				}

				for(var i in arr){
					o = arr[i];

					// выполняем колбэк с элементом и пополняем итоговый массив
					if($p._selection.call(this, o, selection)){
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
			}
		},

		/**
		 * ### Подключает обработчики событий
		 *
		 * @method on
		 * @param name {String|Object} - имя события
		 * @param fn {Function} - функция - обработчик
		 * @returns {*}
		 */
		on: {
			value: function (name, fn) {
				if(typeof name == "object"){
					for(var n in name){
						if(!name[n]._evnts)
							name[n]._evnts = [];
						name[n]._evnts.push(this.eve.attachEvent(n, name[n]));
					}
				}else
					return this.eve.attachEvent(name, fn);
			}
		},

		/**
		 * ### Отключает обработчики событий
		 *
		 * @method off
		 * @param id {String|Number|Function}
		 */
		off: {
			value: function (id) {
				if(typeof id == "function" && id._evnts){
					id._evnts.forEach(function (id) {
						$p.eve.detachEvent(id);
					});
				}else if(!id)
					$p.eve.detachAllEvents();
				else
					$p.eve.detachEvent(id);
			}
		},

		/**
		 * ### Запись журнала регистрации
		 *
		 * @method record_log
		 * @param err
		 */
		record_log: {
			value: function (err) {
				if($p.ireg && $p.ireg.$log)
					$p.ireg.$log.record(err);
				console.log(err);
			}
		},

		/**
		 * ### Mетаданные конфигурации
		 * @property md
		 * @type Meta
		 * @static
		 */
		md: {
			value: new Meta()
		},

		/**
		 * Коллекция менеджеров перечислений
		 * @property enm
		 * @type Enumerations
		 * @static
		 */
		enm: {
			value: new (
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
				})
		},

		/**
		 * Коллекция менеджеров справочников
		 * @property cat
		 * @type Catalogs
		 * @static
		 */
		cat: {
			value: 	new (
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
			)
		},

		/**
		 * Коллекция менеджеров документов
		 * @property doc
		 * @type Documents
		 * @static
		 */
		doc: {
			value: 	new (
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
				})
		},

		/**
		 * Коллекция менеджеров регистров сведений
		 * @property ireg
		 * @type InfoRegs
		 * @static
		 */
		ireg: {
			value: 	new (
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
				})
		},

		/**
		 * Коллекция менеджеров регистров накопления
		 * @property areg
		 * @type AccumRegs
		 * @static
		 */
		areg: {
			value: 	new (
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
				})
		},

		/**
		 * Коллекция менеджеров регистров бухгалтерии
		 * @property aссreg
		 * @type AccountsRegs
		 * @static
		 */
		aссreg: {
			value: 	new (
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
				})
		},

		/**
		 * Коллекция менеджеров обработок
		 * @property dp
		 * @type DataProcessors
		 * @static
		 */
		dp: {
			value: 	new (
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
				})
		},

		/**
		 * Коллекция менеджеров отчетов
		 * @property rep
		 * @type Reports
		 * @static
		 */
		rep: {
			value: new (
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
				})
		},

		/**
		 * Коллекция менеджеров планов счетов
		 * @property cacc
		 * @type ChartsOfAccounts
		 * @static
		 */
		cacc: {
			value: 	new (

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
				})
		},

		/**
		 * Коллекция менеджеров планов видов характеристик
		 * @property cch
		 * @type ChartsOfCharacteristics
		 * @static
		 */
		cch: {
			value: new (

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
				})
		},

		/**
		 * Коллекция менеджеров задач
		 * @property tsk
		 * @type Tasks
		 * @static
		 */
		tsk: {
			value: 	new (

				/**
				 * ### Коллекция менеджеров задач
				 * - Состав коллекции определяется метаданными используемой конфигурации
				 * - Тип элементов коллекции: {{#crossLink "TaskManager"}}{{/crossLink}}
				 *
				 * @class Tasks
				 * @static
				 */
					function Tasks(){
					this.toString = function(){return $p.msg.meta_task_mgr};
				})
		},

		/**
		 * Коллекция менеджеров бизнес-процессов
		 * @property bp
		 * @type Tasks
		 * @static
		 */
		bp: {
			value: 	new (

				/**
				 * ### Коллекция бизнес-процессов
				 * - Состав коллекции определяется метаданными используемой конфигурации
				 * - Тип элементов коллекции: {{#crossLink "BusinessProcessManager"}}{{/crossLink}}
				 *
				 * @class BusinessProcesses
				 * @static
				 */
					function BusinessProcesses(){
					this.toString = function(){return $p.msg.meta_bp_mgr};
				})
		},

		DataManager: {
			value: DataManager
		},

		RefDataManager: {
			value: RefDataManager
		},

		DataProcessorsManager: {
			value: DataProcessorsManager
		},

		EnumManager: {
			value: EnumManager
		},

		RegisterManager: {
			value: RegisterManager
		},

		InfoRegManager: {
			value: InfoRegManager
		},

		InfoRegManager: {
			value: InfoRegManager
		},

		LogManager: {
			value: LogManager
		},

		AccumRegManager: {
			value: AccumRegManager
		},

		CatManager: {
			value: CatManager
		},

		ChartOfCharacteristicManager: {
			value: ChartOfCharacteristicManager
		},

		ChartOfAccountManager: {
			value: ChartOfAccountManager
		},

		DocManager: {
			value: DocManager
		},

		TaskManager: {
			value: TaskManager
		},

		BusinessProcessManager: {
			value: BusinessProcessManager
		},

		DataObj: {
			value: DataObj
		},

		CatObj: {
			value: CatObj
		},

		DocObj: {
			value: DocObj
		},

		DataProcessorObj: {
			value: DataProcessorObj
		},

		TaskObj: {
			value: TaskObj
		},

		BusinessProcessObj: {
			value: BusinessProcessObj
		},

		EnumObj: {
			value: EnumObj
		},

		RegisterRow: {
			value: RegisterRow
		},

		TabularSection: {
			value: TabularSection
		},

		TabularSectionRow: {
			value: TabularSectionRow
		}

	});
}

/**
 * ### Коллекция вспомогательных методов
 * @class Utils
 * @static
 * @menuorder 35
 * @tooltip Вспомогательные методы
 */
function Utils() {

	/**
	 * ### Moment для операций с интервалами и датами
	 *
	 * @property moment
	 * @type Function
	 * @final
	 */
	this.moment = typeof moment == "function" ? moment : require('moment');
	this.moment._masks = {
		date:       "DD.MM.YY",
		date_time:  "DD.MM.YYYY HH:mm",
		ldt:        "DD MMMM YYYY, HH:mm",
		iso:        "YYYY-MM-DDTHH:mm:ss"
	};


	/**
	 * ### Приводит значение к типу Дата
	 *
	 * @method fix_date
	 * @param str {String|Number|Date} - приводиме значение
	 * @param [strict=false] {Boolean} - если истина и значение не приводится к дате, возвращать пустую дату
	 * @return {Date|*}
	 */
	this.fix_date = function(str, strict){

		if(str instanceof Date)
			return str;
		else{
			var m = this.moment(str, ["DD-MM-YYYY", "DD-MM-YYYY HH:mm", "DD-MM-YYYY HH:mm:ss", "DD-MM-YY HH:mm", "YYYYDDMMHHmmss", this.moment.ISO_8601]);
			return m.isValid() ? m.toDate() : (strict ? this.blank.date : str);
		}
	};

	/**
	 * ### Извлекает guid из строки или ссылки или объекта
	 *
	 * @method fix_guid
	 * @param ref {*} - значение, из которого надо извлечь идентификатор
	 * @param generate {Boolean} - указывает, генерировать ли новый guid для пустого значения
	 * @return {String}
	 */
	this.fix_guid = function(ref, generate){

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

		if(this.is_guid(ref) || generate === false)
			return ref;

		else if(generate)
			return this.generate_guid();

		else
			return this.blank.guid;
	};

	/**
	 * ### Приводит значение к типу Число
	 *
	 * @method fix_number
	 * @param str {*} - приводиме значение
	 * @param [strict=false] {Boolean} - конвертировать NaN в 0
	 * @return {Number}
	 */
	this.fix_number = function(str, strict){
		var v = parseFloat(str);
		if(!isNaN(v))
			return v;
		else if(strict)
			return 0;
		else
			return str;
	};

	/**
	 * ### Приводит значение к типу Булево
	 *
	 * @method fix_boolean
	 * @param str {String}
	 * @return {boolean}
	 */
	this.fix_boolean = function(str){
		if(typeof str === "string")
			return !(!str || str.toLowerCase() == "false");
		else
			return !!str;
	};

	/**
	 * ### Пустые значения даты и уникального идентификатора
	 *
	 * @property blank
	 * @type Blank
	 * @final
	 */
	this.blank = {
		date: this.fix_date("0001-01-01T00:00:00"),
		guid: "00000000-0000-0000-0000-000000000000",
		by_type: function(mtype){
			var v;
			if(mtype.is_ref)
				v = this.guid;
			else if(mtype.date_part)
				v = this.date;
			else if(mtype["digits"])
				v = 0;
			else if(mtype.types && mtype.types[0]=="boolean")
				v = false;
			else
				v = "";
			return v;
		}
	};

	/**
	 * ### Приводит тип значения v к типу метаданных
	 *
	 * @method fetch_type
	 * @param str {*} - значение (обычно, строка, полученная из html поля ввода)
	 * @param mtype {Object} - поле type объекта метаданных (field.type)
	 * @return {*}
	 */
	this.fetch_type = function(str, mtype){
		var v = str;
		if(mtype.is_ref)
			v = this.fix_guid(str);
		else if(mtype.date_part)
			v = this.fix_date(str, true);
		else if(mtype["digits"])
			v = this.fix_number(str, true);
		else if(mtype.types[0]=="boolean")
			v = this.fix_boolean(str);
		return v;
	};

	/**
	 * ### Добавляет days дней к дате
	 *
	 * @method date_add_day
	 * @param date {Date} - исходная дата
	 * @param days {Number} - число дней, добавляемых к дате (может быть отрицательным)
	 * @return {Date}
	 */
	this.date_add_day = function(date, days, reset_time){
		var newDt = new Date(date);
		newDt.setDate(date.getDate() + days);
		if(reset_time)
			newDt.setHours(0,-newDt.getTimezoneOffset(),0,0);
		return newDt;
	}

	/**
	 * ### Генерирует новый guid
	 *
	 * @method generate_guid
	 * @return {String}
	 */
	this.generate_guid = function(){
		var d = new Date().getTime();
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x7|0x8)).toString(16);
		});
	};

	/**
	 * ### Проверяет, является ли значение guid-ом
	 *
	 * @method is_guid
	 * @param v {*} - проверяемое значение
	 * @return {Boolean} - true, если значение соответствует регурярному выражению guid
	 */
	this.is_guid = function(v){
		if(typeof v !== "string" || v.length < 36)
			return false;
		else if(v.length > 36)
			v = v.substr(0, 36);
		return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v)
	};

	/**
	 * ### Проверяет, является ли значение пустым идентификатором
	 *
	 * @method is_empty_guid
	 * @param v {*} - проверяемое значение
	 * @return {Boolean} - true, если v эквивалентен пустому guid
	 */
	this.is_empty_guid = function (v) {
		return !v || v === this.blank.guid;
	};

	/**
	 * ### Проверяет, является ли значенние Data-объектным типом
	 *
	 * @method is_data_obj
	 * @param v {*} - проверяемое значение
	 * @return {Boolean} - true, если значение является ссылкой
	 */
	this.is_data_obj = function(v){
		return v && v instanceof DataObj;
	};

	/**
	 * ### Проверяет, является ли значенние менеджером объектов данных
	 *
	 * @method is_data_mgr
	 * @param v {*} - проверяемое значение
	 * @return {Boolean} - true, если значение является ссылкой
	 */
	this.is_data_mgr = function(v){
		return v && v instanceof DataManager;
	};

	/**
	 * ### Сравнивает на равенство ссылочные типы и примитивные значения
	 *
	 * @method is_equal
	 * @param v1 {DataObj|String}
	 * @param v2 {DataObj|String}
	 * @return {boolean} - true, если значенния эквивалентны
	 */
	this.is_equal = function(v1, v2){

		if(v1 == v2)
			return true;
		else if(typeof v1 === typeof v2)
			return false;

		return (this.fix_guid(v1, false) == this.fix_guid(v2, false));
	};

	/**
	 * ### Читает данные из блоба
	 * Возвращает промис с прочитанными данными
	 *
	 * @param blob {Blob}
	 * @param [type] {String} - если type == "data_url", в промисе будет возвращен DataURL, а не текст
	 * @return {Promise}
	 */
	this.blob_as_text = function (blob, type) {

		return new Promise(function(resolve, reject){
			var reader = new FileReader();
			reader.onload = function(event){
				resolve(reader.result);
			};
			reader.onerror = function(err){
				reject(err);
			};
			if(type == "data_url")
				reader.readAsDataURL(blob);
			else
				reader.readAsText(blob);
		});

	};

}

/**
 * ### Наша promise-реализация ajax
 * - Поддерживает basic http авторизацию
 * - Позволяет установить перед отправкой запроса специфические заголовки
 * - Поддерживает получение и отправку данных с типом `blob`
 * - Позволяет отправлять запросы типа `get`, `post`, `put`, `patch`, `delete`
 *
 * @class Ajax
 * @static
 * @menuorder 31
 * @tooltip Работа с http
 */
function Ajax() {


	function _call(method, url, post_data, auth, before_send) {

		// Возвращаем новое Обещание
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
							password = $p.aes.Ctr.decrypt($p.ajax.password);
							
						}else{
							username = $p.wsql.get_user_param("user_name");
							password = $p.aes.Ctr.decrypt($p.wsql.get_user_param("user_pwd"));
							
							if(!username && $p.job_prm && $p.job_prm.guest_name){
								username = $p.job_prm.guest_name;
								password = $p.aes.Ctr.decrypt($p.job_prm.guest_pwd);
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
	 * На этапе отладки считаем всех пользователей полноправными
	 * @type {boolean}
	 */
	this.root = true;

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



/**
 * Интерфейс к localstorage, alasql и pouchdb
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  common
 * @submodule wsql
 */


/**
 * ### Интерфейс к localstorage, alasql и pouchdb
 * - Обеспечивает взаимодействие с локальными и серверными данными
 * - Обслуживает локальные параметры пользователя
 *
 * @class WSQL
 * @static
 * @menuorder 33
 * @tooltip Данные localstorage
 */
function WSQL(){

	var wsql = this,
		ls,
		user_params = {};

	this.__define({

		/**
		 * Поправка времени javascript
		 * @property js_time_diff
		 * @type Number
		 */
		js_time_diff: {
			value: -(new Date("0001-01-01")).valueOf()
		},

		/**
		 * Поправка времени javascript с учетом пользовательского сдвига из константы _time_diff_
		 * @property time_diff
		 * @type Number
		 */
		time_diff: {
			get: function () {
				var diff = this.get_user_param("time_diff", "number");
				return (!diff || isNaN(diff) || diff < 62135571600000 || diff > 62135622000000) ? this.js_time_diff : diff;
			}
		},

		/**
		 * ### Устанавливает параметр в user_params и localStorage
		 *
		 * @method set_user_param
		 * @param prm_name {string} - имя параметра
		 * @param prm_value {string|number|object|boolean} - значение
		 * @async
		 */
		set_user_param: {
			value: function(prm_name, prm_value){

				var str_prm = prm_value;
				if(typeof prm_value == "object")
					str_prm = JSON.stringify(prm_value);

				else if(prm_value === false)
					str_prm = "";

				ls.setItem($p.job_prm.local_storage_prefix+prm_name, str_prm);
				user_params[prm_name] = prm_value;
			}
		},

		/**
		 * ### Возвращает значение сохраненного параметра из localStorage
		 * Параметр извлекается с приведением типа
		 *
		 * @method get_user_param
		 * @param prm_name {String} - имя параметра
		 * @param [type] {String} - имя типа параметра. Если указано, выполняем приведение типов
		 * @return {*} - значение параметра
		 */
		get_user_param: {
			value: function(prm_name, type){

				if(!user_params.hasOwnProperty(prm_name) && ls)
					user_params[prm_name] = this.fetch_type(ls.getItem($p.job_prm.local_storage_prefix+prm_name), type);

				return user_params[prm_name];
			}
		},

		/**
		 * Выполняет sql запрос к локальной базе данных, возвращает Promise
		 * @param sql
		 * @param params
		 * @return {Promise}
		 * @async
		 */
		promise: {
			value: function(sql, params) {
				return new Promise(function(resolve, reject){
					wsql.alasql(sql, params || [], function(data, err) {
						if(err) {
							reject(err);
						} else {
							resolve(data);
						}
					});
				});
			}
		},

		/**
		 * Сохраняет настройки формы или иные параметры объекта _options_
		 * @method save_options
		 * @param prefix {String} - имя области
		 * @param options {Object} - сохраняемые параметры
		 * @return {Promise}
		 * @async
		 */
		save_options: {
			value: function(prefix, options){
				return wsql.set_user_param(prefix + "_" + options.name, options);
			}
		},

		/**
		 * Восстанавливает сохраненные параметры в объект _options_
		 * @method restore_options
		 * @param prefix {String} - имя области
		 * @param options {Object} - объект, в который будут записаны параметры
		 */
		restore_options: {
			value: function(prefix, options){
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
			}
		},

		/**
		 * Приведение типов при операциях с `localStorage`
		 * @method fetch_type
		 * @param prm
		 * @param type
		 * @returns {*}
		 */
		fetch_type: {
			value: 	function(prm, type){
				if(type == "object"){
					try{
						prm = JSON.parse(prm);
					}catch(e){
						prm = {};
					}
					return prm;
				}else if(type == "number")
					return $p.utils.fix_number(prm, true);
				else if(type == "date")
					return $p.utils.fix_date(prm, true);
				else if(type == "boolean")
					return $p.utils.fix_boolean(prm);
				else
					return prm;
			}
		},

		/**
		 * ### Указатель на alasql
		 * @property alasql
		 * @type Function
		 */
		alasql: {
			value: typeof alasql != "undefined" ? alasql : require("alasql")
		},

		/**
		 * ### Создаёт и заполняет умолчаниями таблицу параметров
		 *
		 * @method init_params
		 * @return {Promise}
		 * @async
		 */
		init_params: {

			value: function(){

				// префикс параметров LocalStorage
				// TODO: отразить в документации, что если префикс пустой, то параметры не инициализируются
				if(!$p.job_prm.local_storage_prefix && !$p.job_prm.create_tables)
					return Promise.resolve();

				if(typeof localStorage === "undefined"){

					// локальное хранилище внутри node.js
					if(typeof WorkerGlobalScope === "undefined"){
						ls = new require('node-localstorage').LocalStorage('./localstorage');

					}else{
						ls = {
							setItem: function (name, value) {

							},
							getItem: function (name) {

							}
						};
					}

				} else
					ls = localStorage;

				// значения базовых параметров по умолчанию
				var nesessery_params = [
					{p: "user_name",		v: "", t:"string"},
					{p: "user_pwd",			v: "", t:"string"},
					{p: "browser_uid",		v: $p.utils.generate_guid(), t:"string"},
					{p: "zone",             v: $p.job_prm.hasOwnProperty("zone") ? $p.job_prm.zone : 1, t: $p.job_prm.zone_is_string ? "string" : "number"},
					{p: "enable_save_pwd",	v: $p.job_prm.enable_save_pwd,	t:"boolean"},
					{p: "autologin",		v: "",	t:"boolean"},
					{p: "skin",		        v: "dhx_web", t:"string"},
					{p: "rest_path",		v: "", t:"string"}
				],	zone;

				// подмешиваем к базовым параметрам настройки приложения
				if($p.job_prm.additional_params)
					nesessery_params = nesessery_params.concat($p.job_prm.additional_params);

				// если зона не указана, устанавливаем "1"
				if(!ls.getItem($p.job_prm.local_storage_prefix+"zone"))
					zone = $p.job_prm.hasOwnProperty("zone") ? $p.job_prm.zone : 1;
				// если зона указана в url, используем её
				if($p.job_prm.url_prm.hasOwnProperty("zone"))
					zone = $p.job_prm.zone_is_string ? $p.job_prm.url_prm.zone : $p.utils.fix_number($p.job_prm.url_prm.zone, true);
				if(zone !== undefined)
					wsql.set_user_param("zone", zone);

				// дополняем хранилище недостающими параметрами
				nesessery_params.forEach(function(o){
					if(wsql.get_user_param(o.p, o.t) == undefined ||
						(!wsql.get_user_param(o.p, o.t) && (o.p.indexOf("url") != -1)))
						wsql.set_user_param(o.p, $p.job_prm.hasOwnProperty(o.p) ? $p.job_prm[o.p] : o.v);
				});

				// сообщяем движку pouch пути и префиксы
				var pouch_prm = {
					path: wsql.get_user_param("couch_path", "string") || $p.job_prm.couch_path || "",
					zone: wsql.get_user_param("zone", "number"),
					prefix: $p.job_prm.local_storage_prefix,
					suffix: wsql.get_user_param("couch_suffix", "string") || ""
				};
				if(pouch_prm.path){

					/**
					 * ### Указатель на локальные и сетевые базы PouchDB
					 * @property pouch
					 * @for WSQL
					 * @type Pouch
					 */
					wsql.__define("pouch", { value: new Pouch()	});
					wsql.pouch.init(pouch_prm);
				}

				// создаём таблицы alasql
				if(this.create_tables){
					this.alasq(this.create_tables, []);
					this.create_tables = "";
				}


			}
		},

		/**
		 * Удаляет таблицы WSQL. Например, для последующего пересоздания при изменении структуры данных
		 * @method drop_tables
		 * @param callback {Function}
		 * @async
		 */
		drop_tables: {
			value: function(callback){
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
			}
		}

	});

	/**
	 * ### Указатель на aladb
	 * @property alasql
	 * @type alasql.Database
	 */
	this.__define({
		aladb: {
			value: new this.alasql.Database('md')
		}
	});

}

/**
 * Глобальные переменные и общие методы фреймворка __metadata.js__ <i>Oknosoft data engine</i>
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  common
 * @submodule common.ui
 */


/**
 * Описание структуры колонки формы списка
 * @class Col_struct
 * @param id
 * @param width
 * @param type
 * @param align
 * @param sort
 * @param caption
 * @constructor
 */
function Col_struct(id,width,type,align,sort,caption){
	this.id = id;
	this.width = width;
	this.type = type;
	this.align = align;
	this.sort = sort;
	this.caption = caption;
}

/**
 * ### Объекты интерфейса пользователя
 * @class InterfaceObjs
 * @static
 * @menuorder 40
 * @tooltip Контекст UI
 */
function InterfaceObjs(){

	var iface = this;

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
	 * @param size {Number|Object} - требуемый размер картинки
	 * @param padding {Number} - отступ от границы viewBox
	 * @return {String} - отмасштабированная строка svg
	 */
	this.scale_svg = function(svg_current, size, padding){
		var j, k, svg_head, svg_body, head_ind, vb_ind, svg_head_str, vb_str, viewBox, svg_j = {};

		var height = typeof size == "number" ? size : size.height,
			width = typeof size == "number" ? (size * 1.5).round(0) : size.width,
			max_zoom = typeof size == "number" ? Infinity : (size.zoom || Infinity);

		head_ind = svg_current.indexOf(">");
		svg_head_str = svg_current.substring(5, head_ind);
		svg_head = svg_head_str.split(' ');
		svg_body = svg_current.substr(head_ind+1);
		svg_body = svg_body.substr(0, svg_body.length - 6);

		// получаем w, h и формируем viewBox="0 0 400 100"
		for(j in svg_head){
			svg_current = svg_head[j].split("=");
			if("width,height,x,y".indexOf(svg_current[0]) != -1){
				svg_current[1] = Number(svg_current[1].replace(/"/g, ""));
				svg_j[svg_current[0]] = svg_current[1];
			}
		}

		if((vb_ind = svg_head_str.indexOf("viewBox="))!=-1){
			vb_str = svg_head_str.substring(vb_ind+9);
			viewBox = 'viewBox="' + vb_str.substring(0, vb_str.indexOf('"')) + '"';
		}else{
			viewBox = 'viewBox="' + (svg_j.x || 0) + ' ' + (svg_j.y || 0) + ' ' + (svg_j.width - padding) + ' ' + (svg_j.height - padding) + '"';
		}

		var init_height = svg_j.height,
			init_width = svg_j.width;

		k = (height - padding) / init_height;
		svg_j.height = height;
		svg_j.width = (init_width * k).round(0);

		if(svg_j.width > width){
			k = (width - padding) / init_width;
			svg_j.height = (init_height * k).round(0);
			svg_j.width = width;
		}

		if(k > max_zoom){
			k = max_zoom;
			svg_j.height = (init_height * k).round(0);
			svg_j.width = (init_width * k).round(0);
		}

		svg_j.x = (svg_j.x * k).round(0);
		svg_j.y = (svg_j.y * k).round(0);

		return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" ' +
			'width="' + svg_j.width + '" ' +
			'height="' + svg_j.height + '" ' +
			'x="' + svg_j.x + '" ' +
			'y="' + svg_j.y + '" ' +
			'xml:space="preserve" ' + viewBox + '>' + svg_body + '</svg>';
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
			iface.hash_route();
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
			res = $p.eve.callEvent("hash_route", [hprm]),
			mgr;

		if((res !== false) && (!iface.before_route || iface.before_route(event) !== false)){

			if($p.ajax.authorized){

				if(hprm.ref && typeof _md != "undefined"){
					// если задана ссылка, открываем форму объекта
					mgr = _md.mgr_by_class_name(hprm.obj);
					if(mgr)
						mgr[hprm.frm || "form_obj"](iface.docs, hprm.ref)

				}else if(hprm.view && iface.swith_view){
					// если задано имя представления, переключаем главную форму
					iface.swith_view(hprm.view);

				}

			}
		}

		if(event)
			return iface.cancel_bubble(event);
	};

	/**
	 * Запрещает всплывание события
	 * @param e {MouseEvent|KeyboardEvent}
	 * @returns {Boolean}
	 */
	this.cancel_bubble = function(e) {
		var evt = (e || event);
		if (evt && evt.stopPropagation)
			evt.stopPropagation();
		if (evt && !evt.cancelBubble)
			evt.cancelBubble = true;
		return false
	};

	/**
	 * Конструктор описания колонки динамического списка
	 * @type {Col_struct}
	 * @constructor
	 */
	this.Col_struct = Col_struct;

	/**
	 *
	 * @param items {Array} - закладки сайдбара
	 * @param buttons {Array} - кнопки дополнительной навигации
	 * @param [icons_path] {String} - путь к иконам сайдбара
	 */
	this.init_sidebar = function (items, buttons, icons_path) {

		// наблюдатель за событиями авторизации и синхронизации
		iface.btn_auth_sync = new iface.OBtnAuthSync();

		// кнопки навигации справа сверху
		iface.btns_nav = function (wrapper) {
			return iface.btn_auth_sync.bind(new iface.OTooolBar({
				wrapper: wrapper,
				class_name: 'md_otbnav',
				width: '260px', height: '28px', top: '3px', right: '3px', name: 'right',
				buttons: buttons,
				onclick: function (name) {
					iface.main.cells(name).setActive(true);
					return false;
				}
			}))
		};

		// основной сайдбар
		iface.main = new dhtmlXSideBar({
			parent: document.body,
			icons_path: icons_path || "dist/imgs/",
			width: 180,
			header: true,
			template: "tiles",
			autohide: true,
			items: items,
			offsets: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			}
		});

		// подписываемся на событие навигации по сайдбару
		iface.main.attachEvent("onSelect", function(id){

			var hprm = $p.job_prm.parse_url();
			if(hprm.view != id)
				iface.set_hash(hprm.obj, hprm.ref, hprm.frm, id);

			iface["view_" + id](iface.main.cells(id));

		});

		// включаем индикатор загрузки
		iface.main.progressOn();

		// активируем страницу
		var hprm = $p.job_prm.parse_url();
		if(!hprm.view || iface.main.getAllItems().indexOf(hprm.view) == -1){
			iface.set_hash(hprm.obj, hprm.ref, hprm.frm, "doc");
		} else
			setTimeout(iface.hash_route);
	};

	/**
	 * ### Страница "Все объекты"
	 * похожа на подменю "все функции" тонкого клиента 1С
	 *
	 * @class All_meta_objs
	 * @param cont {dhtmlXCellObject} - контейнер для размещения страницы
	 * @param [classes] {Array} - список классов. Если параметр пропущен, будут показаны все классы метаданных
	 * @param [frm_attr] {Object} - дополнительные настройки, которые будут переданы создаваемым формам списка
	 * @constructor
	 */
	function All_meta_objs(cont, classes, frm_attr) {

		this.layout = cont.attachLayout({
			pattern: "2U",
			cells: [{
				id: "a",
				text: "Разделы",
				collapsed_text: "Разделы",
				width: 220
			}, {
				id: "b",
				text: "Раздел",
				header: false
			}],
			offsets: { top: 0, right: 0, bottom: 0, left: 0}
		});

		// дерево используемых метаданных
		this.tree = this.layout.cells("a").attachTreeView();
		this.tree.attachEvent("onSelect", function (name, mode) {
			if(!mode)
				return;
			var mgr = $p.md.mgr_by_class_name(name);
			if(mgr instanceof DataProcessorsManager){
				// для отчетов и обработок используем форму отчета
				mgr.form_rep(this.layout.cells("b"), frm_attr || {hide_header: true});

			}else if(mgr){
				// для остальных объектов показываем форму списка
				mgr.form_list(this.layout.cells("b"), frm_attr || {hide_header: true});
			}

		}.bind(this));


		if(!classes){
			var md_classes = $p.md.get_classes();
			classes = [];
			for(var cl in md_classes){
				if(md_classes[cl].length)
					classes.push(cl);
			}
		}

		// если тип объектов только один, скрываем иерархию
		if(classes.length == 1){
			$p.md.get_classes()[classes[0]].forEach(function (name) {
				var key = classes[0]+"."+name,
					meta = $p.md.get(key);
				if(!meta.hide){
					this.tree.addItem(key, meta.list_presentation || meta.synonym);
					this.tree.setItemIcons(key, {file: "icon_1c_"+classes[0]});
				}
			}.bind(this));

		}else{
			classes.forEach(function (id) {
				this.tree.addItem(id, $p.msg["meta_"+id]);
				this.tree.setItemIcons(id, {file: "icon_1c_"+id, folder_opened: "icon_1c_"+id, folder_closed: "icon_1c_"+id});
				$p.md.get_classes()[id].forEach(function (name) {
					var key = id+"."+name,
						meta = $p.md.get(key);
					if(!meta.hide){
						this.tree.addItem(key, meta.list_presentation || meta.synonym, id);
						this.tree.setItemIcons(key, {file: "icon_1c_"+id});
					}
				}.bind(this));
			}.bind(this));
		}
	}

	/**
	 * ### Страница "Все объекты"
	 * @property All_meta_objs
	 * @type {All_meta_objs}
	 */
	this.All_meta_objs = All_meta_objs;

	/**
	 * ### Страница общих настроек
	 * @param cont {dhtmlXCellObject} - контейнер для размещения страницы
	 * @constructor
	 */
	function Setting2col(cont) {

		// закладка основных настроек
		cont.attachHTMLString($p.injected_data['view_settings.html']);
		this.cont = cont.cell.querySelector(".dhx_cell_cont_tabbar");
		this.cont.style.overflow = "auto";

		// первая колонка настроек
		this.form2 = (function (cont) {

			var form = new dhtmlXForm(cont, [

				{ type:"settings", labelWidth:80, position:"label-left"  },

				{type: "label", labelWidth:320, label: "Адрес CouchDB", className: "label_options"},
				{type:"input" , inputWidth: 220, name:"couch_path", label:"Путь:", validate:"NotEmpty"},
				{type:"template", label:"",value:"",
					note: {text: "Можно указать как относительный, так и абсолютный URL публикации CouchDB", width: 320}},

				{type: "label", labelWidth:320, label: "Адрес http сервиса 1С", className: "label_options"},
				{type:"input" , inputWidth: 220, name:"rest_path", label:"Путь", validate:"NotEmpty"},
				{type:"template", label:"",value:"",
					note: {text: "Можно указать как относительный, так и абсолютный URL публикации 1С OData", width: 320}},

				{type: "label", labelWidth:320, label: "Значение разделителя данных", className: "label_options"},
				{type:"input" , inputWidth: 220, name:"zone", label:"Зона:", numberFormat: ["0", "", ""], validate:"NotEmpty,ValidInteger"},
				{type:"template", label:"",value:"", note: {text: "Для неразделенной публикации, зона = 0", width: 320}},

				{type: "label", labelWidth:320, label: "Суффикс базы пользователя", className: "label_options"},
				{type:"input" , inputWidth: 220, name:"couch_suffix", label:"Суффикс:"},
				{type:"template", label:"",value:"",
					note: {text: "Назначается абоненту при регистрации", width: 320}},

				{type:"block", blockOffset: 0, name:"block_buttons", list:[
					{type: "button", name: "save", value: "<i class='fa fa-floppy-o fa-lg'></i>", tooltip: "Применить настройки и перезагрузить программу"},
					{type:"newcolumn"},
					{type: "button", offsetLeft: 20, name: "reset", value: "<i class='fa fa-refresh fa-lg'></i>", tooltip: "Стереть справочники и перезаполнить данными сервера"}
				]
				}
			]);

			form.cont.style.fontSize = "100%";

			// инициализация свойств
			["zone", "couch_path", "couch_suffix", "rest_path"].forEach(function (prm) {
				if(prm == "zone")
					form.setItemValue(prm, $p.wsql.get_user_param(prm));
				else
					form.setItemValue(prm, $p.wsql.get_user_param(prm) || $p.job_prm[prm]);
			});

			form.attachEvent("onChange", function (name, value, state){
				$p.wsql.set_user_param(name, name == "enable_save_pwd" ? state || "" : value);
			});

			form.disableItem("couch_suffix");

			if(!$p.job_prm.rest_path)
				form.disableItem("rest_path");

			form.attachEvent("onButtonClick", function(name){

				if(name == "save"){

					// завершаем синхронизацию
					$p.wsql.pouch.log_out();

					// перезагружаем страницу
					setTimeout(function () {
						$p.eve.redirect = true;
						location.reload(true);
					}, 1000);

				} else if(name == "reset"){

					dhtmlx.confirm({
						title: "Сброс данных",
						text: "Стереть справочники и перезаполнить данными сервера?",
						cancel: $p.msg.cancel,
						callback: function(btn) {
							if(btn)
								$p.wsql.pouch.reset_local_data();
						}
					});
				}
			});

			return form;

		})(this.cont.querySelector("[name=form2]").firstChild);

		// вторая колонка настроек
		this.form1 = (function (cont) {

			var form = new dhtmlXForm(cont, [
				{ type:"settings", labelWidth:320, position:"label-left"  },

				{type: "label", label: "Тип устройства", className: "label_options"},
				{ type:"block", blockOffset: 0, name:"block_device_type", list:[
					{ type:"settings", labelAlign:"left", position:"label-right"  },
					{ type:"radio" , name:"device_type", labelWidth:120, label:'<i class="fa fa-desktop"></i> Компьютер', value:"desktop"},
					{ type:"newcolumn"   },
					{ type:"radio" , name:"device_type", labelWidth:150, label:'<i class="fa fa-mobile fa-lg"></i> Телефон, планшет', value:"phone"}
				]  },
				{type:"template", label:"",value:"", note: {text: "Класс устройства определяется автоматически, но пользователь может задать его явно", width: 320}},

				{type: "label", label: "Сохранять пароль пользователя", className: "label_options"},
				{type:"checkbox", name:"enable_save_pwd", label:"Разрешить:", labelWidth:90, checked: $p.wsql.get_user_param("enable_save_pwd", "boolean")},
				{type:"template", label:"",value:"", note: {text: "Не рекомендуется, если к компьютеру имеют доступ посторонние лица", width: 320}},
				{type:"template", label:"",value:"", note: {text: "", width: 320}},

				{type: "label", label: "Подключаемые модули", className: "label_options"},
				{type:"input" , position:"label-top", inputWidth: 320, name:"modifiers", label:"Модификаторы:", value: $p.wsql.get_user_param("modifiers"), rows: 3, style:"height:80px;"},
				{type:"template", label:"",value:"", note: {text: "Список дополнительных модулей", width: 320}}

			]);

			form.cont.style.fontSize = "100%";

			// инициализация свойств
			form.checkItem("device_type", $p.job_prm.device_type);

			// подключаем обработчик изменения значений в форме
			form.attachEvent("onChange", function (name, value, state){
				$p.wsql.set_user_param(name, name == "enable_save_pwd" ? state || "" : value);

			});

			form.disableItem("modifiers");
			form.getInput("modifiers").onchange = function () {
				$p.wsql.set_user_param("modifiers", this.value);
			};

			return form;

		})(this.cont.querySelector("[name=form1]").firstChild);

	}

	/**
	 * ### Страница общих настроек
	 * @property Setting2col
	 * @type {Setting2col}
	 */
	this.Setting2col = Setting2col;
}

$p.__define({

	/**
	 * Объекты интерфейса пользователя
	 * @property iface
	 * @for MetaEngine
	 * @type InterfaceObjs
	 * @static
	 */
	iface: {
		value: new InterfaceObjs(),
		writable: false
	},

	/**
	 * ### Текущий пользователь
	 * Свойство определено после загрузки метаданных и входа впрограмму
	 * @property current_user
	 * @type CatUsers
	 * @final
	 */
	current_user: {
		get: function () {
			return $p.cat && $p.cat.users ?
				$p.cat.users.by_id($p.wsql.get_user_param("user_name")) :
				$p.utils.blank.guid;
		}
	},

	/**
	 * ### Права доступа текущего пользователя.
	 * Свойство определено после загрузки метаданных и входа впрограмму
	 * @property current_acl
	 * @type CcatUsers_acl
	 * @final
	 */
	current_acl: {
		get: function () {
			var res = {};
			if($p.cat && $p.cat.users_acl){
				$p.cat.users_acl.find_rows({owner: $p.current_user}, function (o) {
					res = o;
					return false;
				})
			}
			return res;
		}
	},

	/**
	 * Загружает скрипты и стили синхронно и асинхронно
	 * @method load_script
	 * @for MetaEngine
	 * @param src {String} - url ресурса
	 * @param type {String} - "link" или "script"
	 * @param [callback] {Function} - функция обратного вызова после загрузки скрипта
	 * @async
	 */
	load_script: {
		value: function (src, type, callback) {

			return new Promise(function(resolve, reject){

				var s = document.createElement(type);
				if (type == "script") {
					s.type = "text/javascript";
					s.src = src;
					s.async = true;
					s.addEventListener('load', callback ? function () {
						callback();
						resolve();
					} : resolve, false);

				} else {
					s.type = "text/css";
					s.rel = "stylesheet";
					s.href = src;
				}
				document.head.appendChild(s);

				if(type != "script")
					resolve()

			});
		}
	}

});
/**
 * Содержит методы и подписки на события PouchDB
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module common
 * @submodule pouchdb
 */

/**
 * ### Интерфейс локальной и сетевой баз данных PouchDB
 * Содержит абстрактные методы методы и подписки на события PouchDB, отвечает за авторизацию, синхронизацию и доступ к данным в IndexedDB и на сервере
 *
 * @class Pouch
 * @static
 * @menuorder 34
 * @tooltip Данные pouchdb
 */
function Pouch(){

	var t = this,
		_paths = {},
		_local, _remote, _auth, _data_loaded;

	t.__define({

		/**
		 * Конструктор PouchDB
		 */
		DB: {
			value: typeof PouchDB === "undefined" ?
				require('pouchdb-core')
					.plugin(require('pouchdb-adapter-memory'))
					.plugin(require('pouchdb-adapter-http'))
					.plugin(require('pouchdb-replication'))
					.plugin(require('pouchdb-mapreduce')) : PouchDB
		},

		init: {

			value: function (attr) {

				_paths._mixin(attr);

				if(_paths.path && _paths.path.indexOf("http") != 0 && typeof location != "undefined")
					_paths.path = location.protocol + "//" + location.host + _paths.path;
			}
		},

		/**
		 * ### Локальные базы PouchDB
		 *
		 * @property local
		 * @type {{ram: PouchDB, doc: PouchDB, meta: PouchDB, sync: {}}}
		 */
		local: {
			get: function () {
				if(!_local){
					var opts = {auto_compaction: true, revs_limit: 2};
					_local = {
						ram: new t.DB(_paths.prefix + _paths.zone + "_ram", opts),
						doc: new t.DB(_paths.prefix + _paths.zone + "_doc", opts),
						meta: new t.DB(_paths.prefix + "meta", opts),
						sync: {}
					}
				}
				if(_paths.path && !_local._meta){
					_local._meta = new t.DB(_paths.path + "meta", {
						auth: {
							username: "guest",
							password: "meta"
						},
						skip_setup: true
					});
					t.run_sync(_local.meta, _local._meta, "meta");
				}
				return _local;
			}
		},

		/**
		 * ### Базы PouchDB на сервере
		 *
		 * @property remote
		 * @type {{ram: PouchDB, doc: PouchDB}}
		 */
		remote: {
			get: function () {
				if(!_remote && _auth){
					_remote = {
						ram: new t.DB(_paths.path + _paths.zone + "_ram", {
							auth: {
								username: _auth.username,
								password: _auth.password
							},
							skip_setup: true
						}),
						doc: new t.DB(_paths.path + _paths.zone + "_doc" + _paths.suffix, {
							auth: {
								username: _auth.username,
								password: _auth.password
							},
							skip_setup: true
						})
					}
				}
				return _remote;
			}
		},

		/**
		 * ### Выполняет авторизацию и запускает репликацию
		 * @method log_in
		 * @param username {String}
		 * @param password {String}
		 * @return {Promise}
		 */
		log_in: {
			value: function (username, password) {

				// реквизиты гостевого пользователя для демобаз
				if(username == undefined && password == undefined){
					username = $p.job_prm.guest_name;
					password = $p.aes.Ctr.decrypt($p.job_prm.guest_pwd);
				}

				if(_auth){
					if(_auth.username == username)
						return Promise.resolve();
					else
						return Promise.reject();
				}

				return $p.ajax.get_ex(_paths.path + _paths.zone + "_ram", {username: username, password: password})
					.then(function (req) {
						_auth = {username: username, password: password};
						setTimeout(function () {
							dhx4.callEvent("log_in", [username]);
						});
						return {
							ram: t.run_sync(t.local.ram, t.remote.ram, "ram"),
							doc: t.run_sync(t.local.doc, t.remote.doc, "doc")
						}
					});
			}
		},

		/**
		 * ### Останавливает синхронизации и снимает признак авторизованности
		 * @method log_out
		 */
		log_out: {
			value: function () {

				if(_auth){
					if(_local.sync.doc){
						try{
							_local.sync.doc.cancel();
						}catch(err){}
					}
					if(_local.sync.ram){
						try{
							_local.sync.ram.cancel();
						}catch(err){}
					}
					_auth = null;
				}

				if(_remote && _remote.ram)
					delete _remote.ram;

				if(_remote && _remote.doc)
					delete _remote.doc;

				_remote = null;

				dhx4.callEvent("log_out");
			}
		},

		/**
		 * ### Уничтожает локальные данные
		 * Используется при изменении структуры данных на сервере
		 *
		 * @method reset_local_data
		 */
		reset_local_data: {
			value: function () {

				var destroy_ram = t.local.ram.destroy.bind(t.local.ram),
					destroy_doc = t.local.doc.destroy.bind(t.local.doc),
					do_reload = function (){
						setTimeout(function () {
							$p.eve.redirect = true;
							location.reload(true);
						}, 1000);
					};

				t.log_out();

				setTimeout(function () {
					destroy_ram()
						.then(destroy_doc)
						.catch(destroy_doc)
						.then(do_reload)
						.catch(do_reload);
				}, 1000);

			}
		},

		/**
		 * ### Загружает условно-постоянные данные из базы ram в alasql
		 * Используется при инициализации данных на старте приложения
		 *
		 * @method load_data
		 */
		load_data: {
			value: function () {

				var options = {
					limit : 200,
					include_docs: true
				},
					_page = {
						total_rows: 0,
						limit: options.limit,
						page: 0,
						start: Date.now()
					};

				// бежим по всем документам из ram
				return new Promise(function(resolve, reject){

					function fetchNextPage() {
						t.local.ram.allDocs(options, function (err, response) {

							if (response) {

								// широковещательное оповещение о загрузке порции локальных данных
								_page.page++;
								_page.total_rows = response.total_rows;
								_page.duration = Date.now() - _page.start;
								$p.eve.callEvent("pouch_load_data_page", [_page]);

								if (t.load_changes(response, options))
									fetchNextPage();
								else{
									resolve();
									// широковещательное оповещение об окончании загрузки локальных данных
									_data_loaded = true;
									$p.eve.callEvent("pouch_load_data_loaded", [_page]);
									_page.note = "pouch_load_data_loaded";
									$p.record_log(_page);
								}

							} else if(err){
								reject(err);
								// широковещательное оповещение об ошибке загрузки
								$p.eve.callEvent("pouch_load_data_error", [err]);
							}
						});
					}

					t.local.ram.info()
						.then(function (info) {
							if(info.doc_count >= ($p.job_prm.pouch_ram_doc_count || 10)){
								// широковещательное оповещение о начале загрузки локальных данных
								$p.eve.callEvent("pouch_load_data_start", [_page]);
								fetchNextPage();
							}else{
								$p.eve.callEvent("pouch_load_data_error", [info]);
								reject(info);
							}
						});
				});

			}
		},

		/**
		 * ### Информирует об авторизованности на сервере CouchDB
		 *
		 * @property authorized
		 */
		authorized: {
			get: function () {
				return _auth && _auth.username;
			}
		},


		/**
		 * ### Информирует о загруженности данных
		 *
		 * @property data_loaded
		 */
		data_loaded: {
			get: function () {
				return !!_data_loaded;
			}
		},

		/**
		 * ### Запускает процесс синхронизвации
		 *
		 * @method run_sync
		 * @param local {PouchDB}
		 * @param remote {PouchDB}
		 * @param id {String}
		 * @return {Promise.<TResult>}
		 */
		run_sync: {
			value: function (local, remote, id){

				var linfo, _page;

				return local.info()
					.then(function (info) {

						linfo = info;
						return remote.info()

					})
					.then(function (rinfo) {

						// для базы "ram", сервер мог указать тотальную перезагрузку данных
						// в этом случае - очищаем базы и перезапускаем браузер
						if(id != "ram")
							return rinfo;

						return remote.get("data_version")
							.then(function (v) {
								if(v.version != $p.wsql.get_user_param("couch_ram_data_version")){

									// если это не первый запуск - перезагружаем
									if($p.wsql.get_user_param("couch_ram_data_version"))
										rinfo = t.reset_local_data();

									// сохраняем версию в localStorage
									$p.wsql.set_user_param("couch_ram_data_version", v.version);

								}
								return rinfo;
							})
							.catch(function (err) {
								$p.record_log(err);
							})
							.then(function () {
								return rinfo;
							});

					})
					.then(function (rinfo) {

						if(!rinfo)
							return;

						if(id == "ram" && linfo.doc_count < ($p.job_prm.pouch_ram_doc_count || 10)){
							// широковещательное оповещение о начале загрузки локальных данных
							_page = {
								total_rows: rinfo.doc_count,
								local_rows: linfo.doc_count,
								docs_written: 0,
								limit: 200,
								page: 0,
								start: Date.now()
							};
							$p.eve.callEvent("pouch_load_data_start", [_page]);

						}else if(id == "doc"){
							// широковещательное оповещение о начале синхронизации базы doc
							setTimeout(function () {
								$p.eve.callEvent("pouch_doc_sync_start");
							});
						}

						// ram и meta синхронизируем в одну сторону, doc в демо-режиме, так же, в одну сторону
						var method = (id == "ram" || id == "meta" || $p.wsql.get_user_param("zone") == $p.job_prm.zone_demo) ? local.replicate.from : local.sync,
							options = {
								live: true,
								retry: true,
								batch_size: 200,
								batches_limit: 8
							};

						// если указан клиентский или серверный фильтр - подключаем
						if(id == "meta")
							options.filter = "auth/meta";

						else if($p.job_prm.pouch_filter && $p.job_prm.pouch_filter[id])
							options.filter = $p.job_prm.pouch_filter[id];

						_local.sync[id] = method(remote, options);

						_local.sync[id]
							.on('change', function (change) {
								// yo, something changed!
								if(id == "ram"){
									t.load_changes(change);

									if(linfo.doc_count < ($p.job_prm.pouch_ram_doc_count || 10)){

										// широковещательное оповещение о загрузке порции данных
										_page.page++;
										_page.docs_written = change.docs_written;
										_page.duration = Date.now() - _page.start;
										$p.eve.callEvent("pouch_load_data_page", [_page]);

										if(_page.docs_written >= _page.total_rows){

											// широковещательное оповещение об окончании загрузки локальных данных
											_data_loaded = true;
											$p.eve.callEvent("pouch_load_data_loaded", [_page]);
											_page.note = "pouch_load_data_loaded";
											$p.record_log(_page);
										}

									}
								}
								$p.eve.callEvent("pouch_change", [id, change]);

							}).on('paused', function (info) {
							// replication was paused, usually because of a lost connection
							if(info)
								$p.eve.callEvent("pouch_paused", [id, info]);

						}).on('active', function (info) {
							// replication was resumed
							$p.eve.callEvent("pouch_active", [id, info]);

						}).on('denied', function (info) {
							// a document failed to replicate, e.g. due to permissions
							$p.eve.callEvent("pouch_denied", [id, info]);

						}).on('complete', function (info) {
							// handle complete
							$p.eve.callEvent("pouch_complete", [id, info]);

						}).on('error', function (err) {
							// totally unhandled error (shouldn't happen)
							$p.eve.callEvent("pouch_error", [id, err]);

						});

						return _local.sync[id];
					});
			}
		},

		/**
		 * ### Читает объект из pouchdb
		 *
		 * @method load_obj
		 * @param tObj {DataObj} - объект данных, который необходимо прочитать - дозаполнить
		 * @return {Promise.<DataObj>} - промис с загруженным объектом
		 */
		load_obj: {
			value: function (tObj) {

				return tObj._manager.pouch_db.get(tObj._manager.class_name + "|" + tObj.ref)
					.then(function (res) {
						delete res._id;
						delete res._rev;
						tObj._mixin(res)._set_loaded();
					})
					.catch(function (err) {
						if(err.status != 404)
							throw err;
					})
					.then(function (res) {
						return tObj;
					});
			}
		},

		/**
		 * ### Записывает объект в pouchdb
		 *
		 * @method load_obj
		 * @param tObj {DataObj} - записываемый объект
		 * @param attr {Object} - ополнительные параметры записи
		 * @return {Promise.<DataObj>} - промис с записанным объектом
		 */
		save_obj: {
			value: function (tObj, attr) {

				var tmp = tObj._obj._clone(),
					db = tObj._manager.pouch_db;
				
				tmp._id = tObj._manager.class_name + "|" + tObj.ref;
				delete tmp.ref;

				if(attr.attachments)
					tmp._attachments = attr.attachments;

				return (tObj.is_new() ? Promise.resolve() : db.get(tmp._id))
					.then(function (res) {
						if(res){
							tmp._rev = res._rev;
							for(var att in res._attachments){
								if(!tmp._attachments)
									tmp._attachments = {};
								if(!tmp._attachments[att])
									tmp._attachments[att] = res._attachments[att];
							}
						}
					})
					.catch(function (err) {
						if(err.status != 404)
							throw err;
					})
					.then(function () {
						return db.put(tmp);
					})
					.then(function () {
						
						if(tObj.is_new())
							tObj._set_loaded(tObj.ref);
						
						if(tmp._attachments){
							if(!tObj._attachments)
								tObj._attachments = {};
							for(var att in tmp._attachments){
								if(!tObj._attachments[att] || !tmp._attachments[att].stub)
									tObj._attachments[att] = tmp._attachments[att];
							}
						}
						
						tmp = null;
						attr = null;
						return tObj;
					});
			}
		},

		/**
		 * ### Загружает в менеджер изменения или полученные через allDocs данные
		 *
		 * @method load_changes
		 * @param changes
		 * @param options
		 * @return {boolean}
		 */
		load_changes: {
			value: function(changes, options){

				var docs, doc, res = {}, cn, key;

				if(!options){
					if(changes.direction){
						if(changes.direction != "pull")
							return;
						docs = changes.change.docs;
					}else
						docs = changes.docs;

				}else
					docs = changes.rows;

				if (docs.length > 0) {
					if(options){
						options.startkey = docs[docs.length - 1].key;
						options.skip = 1;
					}

					docs.forEach(function (rev) {
						doc = options ? rev.doc : rev;
						if(!doc){
							if((rev.value && rev.value.deleted))
								doc = {
									_id: rev.id,
									_deleted: true
								};
							else if(rev.error)
								return;
						}
						key = doc._id.split("|");
						cn = key[0].split(".");
						doc.ref = key[1];
						delete doc._id;
						delete doc._rev;
						if(!res[cn[0]])
							res[cn[0]] = {};
						if(!res[cn[0]][cn[1]])
							res[cn[0]][cn[1]] = [];
						res[cn[0]][cn[1]].push(doc);
					});

					for(var mgr in res){
						for(cn in res[mgr])
							if($p[mgr] && $p[mgr][cn])
								$p[mgr][cn].load_array(res[mgr][cn], true);
					}

					res	= changes = docs = doc = null;
					return true;
				}

				return false;
			}
		},

		/**
		 * Формирует архив полной выгрузки базы для сохранения в файловой системе клиента
		 * @method backup_database
		 * @param [do_zip] {Boolean} - указывает на необходимость архивировать стоки таблиц в озу перед записью файла
		 * @async
		 */

		backup_database: {
			value: function(do_zip){

				// получаем строку create_tables

				// получаем строки для каждой таблицы

				// складываем все части в файл
			}
		},

		/**
		 * Восстанавливает базу из архивной копии
		 * @method restore_database
		 * @async
		 */
		restore_database: {
			value: function(do_zip){

				// получаем строку create_tables

				// получаем строки для каждой таблицы

				// складываем все части в файл
			}

		}

	});

}



/**
 * Строковые константы интернационализации
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module common
 * @submodule i18n
 */


/**
 * ### Сообщения пользователю и строки интернационализации
 *
 * @class Messages
 * @static
 * @menuorder 61
 * @tooltip i18n
 */
function Messages(){

	this.toString = function(){return "Интернационализация сообщений"};


	/**
	 * Добавляет коллекциям менеджеров и метаданным русские синонимы, как свойства объекта _window_
	 * @method russian_names
	 */
	this.russian_names = function(){
		if($p.job_prm.russian_names){

			// глобальный контекст
			window.__define({
				"Метаданные": {
					get: function(){return $p.md},
					enumerable: false
				},
				"Справочники": {
					get: function(){return $p.cat},
					enumerable: false
				},
				"Документы": {
					get: function(){return $p.doc},
					enumerable: false
				},
				"РегистрыСведений": {
					get: function(){return $p.ireg},
					enumerable: false
				},
				"РегистрыНакопления": {
					get: function(){return $p.areg},
					enumerable: false
				},
				"РегистрыБухгалтерии": {
					get: function(){return $p.accreg},
					enumerable: false
				},
				"Обработки": {
					get: function(){return $p.dp},
					enumerable: false
				},
				"Отчеты": {
					get: function(){return $p.rep},
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
	 * расширяем мессанджер
	 */
	if(typeof window !== "undefined" && "dhtmlx" in window){

		/**
		 * Показывает информационное сообщение или confirm
		 * @method show_msg
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
		 */
		this.show_not_implemented = function(){
			$p.msg.show_msg({type: "alert-warning",
				text: $p.msg.not_implemented,
				title: $p.msg.main_title});
		};

	}
}

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

/**
 * Строки сообщений и элементов интерфейса
 */
(function (msg){

	// публичные методы, экспортируемые, как свойства $p.msg
	msg.store_url_od = "https://chrome.google.com/webstore/detail/hcncallbdlondnoadgjomnhifopfaage";

	msg.argument_is_not_ref = "Аргумент не является ссылкой";
	msg.addr_title = "Ввод адреса";

	msg.cache_update_title = "Обновление кеша браузера";
	msg.cache_update = "Выполняется загрузка измененных файлов<br/>и их кеширование в хранилище браузера";
	msg.cancel = "Отмена";

	msg.delivery_area_empty = "Укажите район доставки";

	msg.empty_login_password = "Не указаны имя пользователя или пароль";
	msg.empty_response = "Пустой ответ сервера";
	msg.empty_geocoding = "Пустой ответ геокодера. Вероятно, отслеживание адреса запрещено в настройках браузера";
	msg.error_geocoding = "Ошибка геокодера";

	msg.error_auth = "Авторизация пользователя не выполнена";
	msg.error_critical = "Критическая ошибка";
	msg.error_metadata = "Ошибка загрузки метаданных конфигурации";
	msg.error_network = "Ошибка сети или сервера - запрос отклонен";
	msg.error_rights = "Ограничение доступа";
	msg.error_low_acl = "Недостаточно прав для выполнения операции";

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
	msg.logged_in = "Авторизован под именем: ";
	msg.log_out_title = "Отключиться от сервера?";
	msg.log_out_break = "<br/>Завершить синхронизацию?";
	msg.sync_title = "Обмен с сервером";
	msg.sync_complite = "Синхронизация завершена";

	msg.main_title = "Окнософт: заказ дилера ";
	msg.mark_delete_confirm = "Пометить объект %1 на удаление?";
	msg.mark_undelete_confirm = "Снять пометку удаления с объекта %1?";
	msg.meta = {
		cat: "Справочник",
		doc: "Документ",
		cch: "План видов характеристик",
		cacc: "Планы счетов",
		tsk : "Задача",
		ireg: "Регистр сведений",
		areg: "Регистр накопления",
		bp: "Бизнес процесс",
		ts_row: "Строка табличной части",
		dp: "Обработка",
		rep: "Отчет"
	},
	msg.meta_cat = "Справочники";
	msg.meta_doc = "Документы";
	msg.meta_cch = "Планы видов характеристик";
	msg.meta_cacc = "Планы счетов";
	msg.meta_tsk = "Задачи";
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
	msg.meta_task_mgr = "Менеджер задач";
	msg.meta_bp_mgr = "Менеджер бизнес-процессов";
	msg.meta_reports_mgr = "Менеджер отчетов";
	msg.meta_charts_of_accounts_mgr = "Менеджер планов счетов";
	msg.meta_charts_of_characteristic_mgr = "Менеджер планов видов характеристик";
	msg.meta_extender = "Модификаторы объектов и менеджеров";

	msg.modified_close = "Объект изменен<br/>Закрыть без сохранения?";
	msg.mandatory_title = "Обязательный реквизит";
	msg.mandatory_field = "Укажите значение реквизита '%1'";

	msg.no_metadata = "Не найдены метаданные объекта '%1'";
	msg.no_selected_row = "Не выбрана строка табличной части '%1'";
	msg.no_dhtmlx = "Библиотека dhtmlx не загружена";
	msg.not_implemented = "Не реализовано в текущей версии";

	msg.offline_request = "Запрос к серверу в автономном режиме";
	msg.onbeforeunload = "Окнософт: легкий клиент. Закрыть программу?";
	msg.order_sent_title = "Подтвердите отправку заказа";
	msg.order_sent_message = "Отправленный заказ нельзя изменить.<br/>После проверки менеджером<br/>он будет запущен в работу";

	msg.report_error = "<i class='fa fa-exclamation-circle fa-2x fa-fw'></i> Ошибка";
	msg.report_prepare = "<i class='fa fa-spinner fa-spin fa-2x fa-fw'></i> Подготовка отчета";
	msg.report_need_prepare = "<i class='fa fa-info fa-2x fa-fw'></i> Нажмите 'Сформировать' для получения отчета";
	msg.report_need_online = "<i class='fa fa-plug fa-2x fa-fw'></i> Нет подключения. Отчет недоступен в автономном режиме";

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

})($p.msg);





/**
 * Метаданные на стороне js: конструкторы, заполнение, кеширование, поиск
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  metadata
 * @submodule meta_meta
 * @requires common
 */


/**
 * ### Хранилище метаданных конфигурации
 * Важнейший объект `metadata.js`. Содержит описание всех классов данных приложения.<br />
 * По данным этого объекта, при старте приложения, формируются менеджеры данных, строятся динамические конструкторы объектов данных,
 * обеспечивается ссылочная типизация, рисуются автоформы объектов и списков.
 *
 * @class Meta
 * @static
 * @menuorder 02
 * @tooltip Описание метаданных
 */
function Meta() {

	var _m;

	_md = this;




	// загружает метаданные из pouchdb
	function meta_from_pouch(meta_db){

		return meta_db.info()
			.then(function () {
				return meta_db.get('meta');

			})
			.then(function (doc) {
				_m = doc;
				doc = null;
				return meta_db.get('meta_patch');

			}).then(function (doc) {
				$p._patch(_m, doc);
				doc = null;
				delete _m._id;
				delete _m._rev;
			});
	}


	// создаёт объекты менеджеров
	_md.create_managers = function(){};

	/**
	 * ### Инициализирует метаданные
	 * загружает описание метаданных из локального или сетевого хранилища
	 */
	_md.init = function (meta_db) {

		var confirm_count = 0,
			is_local = !meta_db || ($p.wsql.pouch && meta_db == $p.wsql.pouch.local.meta),
			is_remote = meta_db && ($p.wsql.pouch && meta_db == $p.wsql.pouch.local._meta);
		
		function do_init(){

			if(meta_db && !is_local && !is_remote){
				_m = meta_db;
				meta_db = null;

				_md.create_managers();

			}else{

				return meta_from_pouch(meta_db || $p.wsql.pouch.local.meta)
					.then(function () {
						if(is_local){
							_md.create_managers();

						}else{
							return _m;
						}
					})
					.catch($p.record_log);
			}
		}

		function do_reload(){

			dhtmlx.confirm({
				title: $p.msg.file_new_date_title,
				text: $p.msg.file_new_date,
				ok: "Перезагрузка",
				cancel: "Продолжить",
				callback: function(btn) {

					if(btn){

						$p.wsql.pouch.log_out();

						setTimeout(function () {
							$p.eve.redirect = true;
							location.reload(true);
						}, 1000);
						
					}else{

						confirm_count++;
						setTimeout(do_reload, confirm_count * 30000);
						
					}
				}
			});
			
		}

		// этот обработчик нужен только при инициализации, когда в таблицах meta еще нет данных
		$p.on("pouch_change", function (dbid, change) {

			if (dbid != "meta")
				return;

			if(!_m)
				do_init();
				
			else{
				
				// если изменились метаданные, запланировать перезагрузку
				if(performance.now() > 20000 && change.docs.some(function (doc) {
						return doc._id.substr(0,4)!='meta';
					}))
					do_reload();

			}
			
		});

		return do_init();

	};

	/**
	 * Возвращает описание объекта метаданных
	 * @method get
	 * @param class_name {String} - например, "doc.calc_order"
	 * @param [field_name] {String}
	 * @return {Object}
	 */
	_md.get = function(class_name, field_name){

		var np = class_name.split(".");

		if(!field_name)
			return _m[np[0]][np[1]];

		var res = {multiline_mode: false, note: "", synonym: "", tooltip: "", type: {is_ref: false,	types: ["string"]}},
			is_doc = "doc,tsk,bp".indexOf(np[0]) != -1,
			is_cat = "cat,cch,cacc,tsk".indexOf(np[0]) != -1;

		if(is_doc && field_name=="number_doc"){
			res.synonym = "Номер";
			res.tooltip = "Номер документа";
			res.type.str_len = 11;

		}else if(is_doc && field_name=="date"){
			res.synonym = "Дата";
			res.tooltip = "Дата документа";
			res.type.date_part = "date_time";
			res.type.types[0] = "date";

		}else if(is_doc && field_name=="posted"){
			res.synonym = "Проведен";
			res.type.types[0] = "boolean";

		}else if(is_cat && field_name=="id"){
			res.synonym = "Код";

		}else if(is_cat && field_name=="name"){
			res.synonym = "Наименование";

		}else if(field_name=="_deleted"){
			res.synonym = "Пометка удаления";
			res.type.types[0] = "boolean";

		}else if(field_name=="is_folder"){
			res.synonym = "Это группа";
			res.type.types[0] = "boolean";

		}else if(field_name=="ref"){
			res.synonym = "Ссылка";
			res.type.is_ref = true;
			res.type.types[0] = class_name;

		}else if(field_name)
			res = _m[np[0]][np[1]].fields[field_name];

		else
			res = _m[np[0]][np[1]];

		return res;
	};

	/**
	 * Возвращает структуру метаданных конфигурации
	 * @method get_classes
	 */
	_md.get_classes = function () {
		var res = {};
		for(var i in _m){
			res[i] = [];
			for(var j in _m[i])
				res[i].push(j);
		}
		return res;
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
	};

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
	 * @param mf {Object} - описание типа поля mf.type
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
			if(rt.length == 1 || row[f] == $p.utils.blank.guid)
				return mf_mgr(rt[0]);

			else if(array_enabled)
				return rt;

			else if((property = row[f]) instanceof DataObj)
				return property._manager;

			else if($p.utils.is_guid(property) && property != $p.utils.blank.guid){
				for(var i in rt){
					mgr = rt[i];
					if(mgr.get(property, false, true))
						return mgr;
				}
			}
		}else{

			// Получаем объект свойства
			if($p.utils.is_data_obj(property))
				oproperty = property;
			else if($p.utils.is_guid(property))
				oproperty = $p.cch.properties.get(property, false);
			else
				return;
			
			if($p.utils.is_data_obj(oproperty)){

				if(oproperty.is_new())
					return $p.cat.property_values;

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
	_md.control_by_type = function (type, val) {
		var ft;

		if(typeof val == "boolean" && type.types.indexOf("boolean") != -1){
			ft = "ch";

		} else if(typeof val == "number" && type.digits) {
			if(type.fraction_figits < 5)
				ft = "calck";
			else
				ft = "edn";

		} else if(val instanceof Date && type.date_part){
			ft = "dhxCalendar";
			
		} else if(type.is_ref){
			ft = "ocombo";

		} else if(type.date_part) {
			ft = "dhxCalendar";

		} else if(type.digits) {
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
			DeletionMark: '_deleted',
			Description: 'name',
			DataVersion: 'data_version',    // todo: не сохранять это поле в pouchdb
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
			Ссылка: 'ref',
			LineNumber: 'row'
		};
		if(synJS[v])
			return synJS[v];
		return _m.syns_js[_m.syns_1с.indexOf(v)] || v;
	};

	_md.syns_1с = function (v) {
		var syn1c = {
			_deleted: 'DeletionMark',
			name: 'Description',
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
		return _m.syns_1с[_m.syns_js.indexOf(v)] || v;
	};

	_md.printing_plates = function (pp) {
		if(pp)
			for(var i in pp.doc)
				_m.doc[i].printing_plates = pp.doc[i];

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

		return name + _md.syns_js(pn[1]);

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

		return name + _md.syns_1с(pn[1]);

	};


	/**
	 * Создаёт таблицы WSQL для всех объектов метаданных
	 * @method create_tables
	 * @return {Promise.<T>}
	 * @async
	 */
	_md.create_tables = function(callback, attr){

		var cstep = 0, data_names = [], managers = _md.get_classes(), class_name,
			create = (attr && attr.postgres) ? "" : "USE md; ";

		function on_table_created(){

			cstep--;
			if(cstep==0){
				if(callback)
					callback(create);
				else
					alasql.utils.saveFile("create_tables.sql", create);
			} else
				iteration();
		}

		function iteration(){
			var data = data_names[cstep-1];
			create += data["class"][data.name].get_sql_struct(attr) + "; ";
			on_table_created();
		}

		// TODO переписать на промисах и генераторах и перекинуть в синкер
		"enm,cch,cacc,cat,bp,tsk,doc,ireg,areg".split(",").forEach(function (mgr) {
			for(class_name in managers[mgr])
				data_names.push({"class": $p[mgr], "name": managers[mgr][class_name]});
		});
		cstep = data_names.length;

		iteration();

	};


}

/**
 * Конструкторы менеджеров данных
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  metadata
 * @submodule meta_mngrs
 * @requires common
 */


/**
 * ### Абстрактный менеджер данных
 * Не используется для создания прикладных объектов, но является базовым классом,
 * от которого унаследованы менеджеры как ссылочных данных, так и объектов с суррогратным ключом и несохраняемых обработок<br />
 * См. так же:
 * - {{#crossLink "EnumManager"}}{{/crossLink}} - менеджер перечислений
 * - {{#crossLink "RefDataManager"}}{{/crossLink}} - абстрактный менеджер ссылочных данных
 * - {{#crossLink "CatManager"}}{{/crossLink}} - менеджер регистров накопления
 * - {{#crossLink "ChartOfCharacteristicManager"}}{{/crossLink}} - менеджер регистров накопления
 * - {{#crossLink "ChartOfAccountManager"}}{{/crossLink}} - менеджер регистров накопления
 * - {{#crossLink "DocManager"}}{{/crossLink}} - менеджер регистров накопления
 * - {{#crossLink "DataProcessorsManager"}}{{/crossLink}} - менеджер обработок
 * - {{#crossLink "RegisterManager"}}{{/crossLink}} - абстрактный менеджер регистра (накопления, сведений и бухгалтерии)
 * - {{#crossLink "InfoRegManager"}}{{/crossLink}} - менеджер регистров сведений
 * - {{#crossLink "LogManager"}}{{/crossLink}} - менеджер журнала регистрации
 * - {{#crossLink "AccumRegManager"}}{{/crossLink}} - менеджер регистров накопления
 * - {{#crossLink "TaskManager"}}{{/crossLink}} - менеджер задач
 * - {{#crossLink "BusinessProcessManager"}}{{/crossLink}} - менеджер бизнес-процессов
 *
 * @class DataManager
 * @constructor
 * @param class_name {string} - имя типа менеджера объекта. например, "doc.calc_order"
 * @menuorder 10
 * @tooltip Менеджер данных
 */
function DataManager(class_name){

	var _meta = _md.get(class_name),

		_events = {

			/**
			 * ### После создания
			 * Возникает после создания объекта. В обработчике можно установить значения по умолчанию для полей и табличных частей
			 * или заполнить объект на основании данных связанного объекта
			 *
			 * @event after_create
			 * @for DataManager
			 */
			after_create: [],

			/**
			 * ### После чтения объекта с сервера
			 * Имеет смысл для объектов с типом кеширования ("doc", "doc_remote", "meta", "e1cib").
			 * т.к. структура _DataObj_ может отличаться от прототипа в базе-источнике, в обработчике можно дозаполнить или пересчитать реквизиты прочитанного объекта
			 * 
			 * @event after_load
			 * @for DataManager
			 */
			after_load: [],

			/**
			 * ### Перед записью
			 * Возникает перед записью объекта. В обработчике можно проверить корректность данных, рассчитать итоги и т.д.
			 * Запись можно отклонить, если у пользователя недостаточно прав, либо введены некорректные данные
			 *
			 * @event before_save
			 * @for DataManager
			 */
			before_save: [],

			/**
			 * ### После записи
			 *
			 * @event after_save
			 * @for DataManager
			 */
			after_save: [],

			/**
			 * ### При изменении реквизита шапки или табличной части
			 *
			 * @event value_change
			 * @for DataManager
			 */
			value_change: [],

			/**
			 * ### При добавлении строки табличной части
			 *
			 * @event add_row
			 * @for DataManager
			 */
			add_row: [],

			/**
			 * ### При удалении строки табличной части
			 *
			 * @event del_row
			 * @for DataManager
			 */
			del_row: []
		};

	this.__define({

		/**
		 * ### Способ кеширования объектов этого менеджера
		 *
		 * Выполняет две функции:
		 * - Указывает, нужно ли сохранять (искать) объекты в локальном кеше или сразу топать на сервер
		 * - Указывает, нужно ли запоминать представления ссылок (инверсно).
		 * Для кешируемых, представления ссылок запоминать необязательно, т.к. его быстрее вычислить по месту
		 * @property cachable
		 * @for DataManager
		 * @type String - ("ram", "doc", "doc_remote", "meta", "e1cib")
		 * @final
		 */
		cachable: {
			get: function () {

				// перечисления кешируются всегда
				if(class_name.indexOf("enm.") != -1)
					return "ram";

				// Если в метаданных явно указано правило кеширования, используем его
				if(_meta.cachable)
					return _meta.cachable;

				// документы, отчеты и обработки по умолчанию кешируем в idb, но в память не загружаем
				if(class_name.indexOf("doc.") != -1 || class_name.indexOf("dp.") != -1 || class_name.indexOf("rep.") != -1)
					return "doc";

				// остальные классы по умолчанию кешируем и загружаем в память при старте
				return "ram";

			}
		},


		/**
		 * ### Имя типа объектов этого менеджера
		 * @property class_name
		 * @for DataManager
		 * @type String
		 * @final
		 */
		class_name: {
			value: class_name,
			writable: false
		},

		/**
		 * ### Указатель на массив, сопоставленный с таблицей локальной базы данных
		 * Фактически - хранилище объектов данного класса
		 * @property alatable
		 * @for DataManager
		 * @type Array
		 * @final
		 */
		alatable: {
			get : function () {
				return $p.wsql.aladb.tables[this.table_name] ? $p.wsql.aladb.tables[this.table_name].data : []
			}
		},

		/**
		 * ### Метаданные объекта
		 * указатель на фрагмент глобальных метаданных, относящмйся к текущему объекту
		 *
		 * @method metadata
		 * @for DataManager
		 * @return {Object} - объект метаданных
		 */
		metadata: {
			value: function(field){
				if(field)
					return _meta.fields[field] || _meta.tabular_sections[field];
				else
					return _meta;
			}
		},

		/**
		 * ### Добавляет подписку на события объектов данного менеджера
		 * В обработчиках событий можно реализовать бизнес-логику при создании, удалении и изменении объекта.
		 * Например, заполнение шапки и табличных частей, пересчет одних полей при изменении других и т.д.
		 *
		 * @method on
		 * @for DataManager
		 * @param name {String|Object} - имя события [after_create, after_load, before_save, after_save, value_change, add_row, del_row]
		 * @param [method] {Function} - добавляемый метод, если не задан в объекте первым параметром
		 *
		 * @example
		 *
		 *     // Обработчик при создании документа
		 *     // @this {DataObj} - обработчик вызывается в контексте текущего объекта
		 *     $p.doc.nom_prices_setup.on("after_create", function (attr) {
		 *       // присваиваем новый номер документа
		 *       return this.new_number_doc();
		 *     });
		 *
		 *     // Обработчик события "при изменении свойства" в шапке или табличной части при редактировании в форме объекта
		 *     // @this {DataObj} - обработчик вызывается в контексте текущего объекта
		 *     $p.doc.nom_prices_setup.on("add_row", function (attr) {
		 *       // установим валюту и тип цен по умолчению при добавлении строки
		 *       if(attr.tabular_section == "goods"){
		 *         attr.row.price_type = this.price_type;
		 *         attr.row.currency = this.price_type.price_currency;
		 *       }
		 *     });
		 *
		 */
		on: {
			value: function (name, method) {
				if(typeof name == "object"){
					for(var n in name){
						if(name.hasOwnProperty(n))
							_events[n].push(name[n]);
					}
				}else
					_events[name].push(method);
			}
		},

		/**
		 * ### Удаляет подписку на событие объектов данного менеджера
		 *
		 * @method off
		 * @for DataManager
		 * @param name {String} - имя события [after_create, after_load, before_save, after_save, value_change, add_row, del_row]
		 * @param [method] {Function} - удаляемый метод. Если не задан, будут отключены все обработчики событий `name`
		 */
		off: {
			value: function (name, method) {

			}
		},

		/**
		 * ### Выполняет методы подписки на событие
		 * Служебный, внутренний метод, вызываемый формами и обсерверами при создании и изменении объекта данных<br/>
		 * Выполняет в цикле все назначенные обработчики текущего события<br/>
		 * Если любой из обработчиков вернул `false`, возвращает `false`. Иначе, возвращает массив с результатами всех обработчиков
		 *
		 * @method handle_event
		 * @for DataManager
		 * @param obj {DataObj} - объект, в котором произошло событие
		 * @param name {String} - имя события
		 * @param attr {Object} - дополнительные свойства, передаваемые в обработчик события
		 * @return {Boolean|Array.<*>}
		 * @private
		 */
		handle_event: {
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
				if(res.length){
					if(res.length == 1)
					// если значение единственное - возвращчем его
						return res[0];
					else{
						// если среди значений есть промисы - возвращаем all
						if(res.some(function (v) {return typeof v === "object" && v.then}))
							return Promise.all(res);
						else
							return res;
					}
				}

			}
		},

		/**
		 * ### Хранилище объектов данного менеджера
		 */
		by_ref: {
			value: {}
		}
	});

}

DataManager.prototype.__define({

	/**
	 * ### Имя семейства объектов данного менеджера
	 * Примеры: "справочников", "документов", "регистров сведений"
	 * @property family_name
	 * @for DataManager
	 * @type String
	 * @final
	 */
	family_name: {
		get : function () {
			return $p.msg["meta_"+this.class_name.split(".")[0]+"_mgr"].replace($p.msg.meta_mgr+" ", "");
		}
	},

	/**
	 * ### Имя таблицы объектов этого менеджера в базе alasql
	 * @property table_name
	 * @type String
	 * @final
	 */
	table_name: {
		get : function(){
			return this.class_name.replace(".", "_");
		}
	},

	/**
	 * ### Найти строки
	 * Возвращает массив дата-объектов, обрезанный отбором _selection_<br />
	 * Eсли отбор пустой, возвращаются все строки, закешированные в менеджере.
	 * Имеет смысл для объектов, у которых _cachable = "ram"_
	 * @method find_rows
	 * @param selection {Object} - в ключах имена полей, в значениях значения фильтра или объект {like: значение}
	 * @param [callback] {Function} - в который передается текущий объект данных на каждой итерации
	 * @return {Array}
	 */
	find_rows: {
		value: function(selection, callback){
			return $p._find_rows.call(this, this.by_ref, selection, callback);
		}
	},

	/**
	 * ### Дополнительные реквизиты
	 * Массив дополнителных реквизитов (аналог подсистемы `Свойства` БСП) вычисляется через
	 * ПВХ `НазначениеДополнительныхРеквизитов` или справочник `НазначениеСвойствКатегорийОбъектов`
	 *
	 * @property extra_fields
	 * @type Array
	 */
	extra_fields: {
		value : function(obj){

			// ищем предопределенный элемент, сответствующий классу данных
			var destinations = $p.cat.destinations || $p.cch.destinations,
				pn = _md.class_name_to_1c(this.class_name).replace(".", "_"),
				res = [];

			if(destinations){
				destinations.find_rows({predefined_name: pn}, function (destination) {
					var ts = destination.extra_fields || destination.ДополнительныеРеквизиты;
					if(ts){
						ts.each(function (row) {
							if(!row._deleted && !row.ПометкаУдаления)
								res.push(row.property || row.Свойство);
						});
					}
					return false;
				})

			}

			return res;
		}
	},

	/**
	 * ### Дополнительные свойства
	 * Массив дополнителных свойств (аналог подсистемы `Свойства` БСП) вычисляется через
	 * ПВХ `НазначениеДополнительныхРеквизитов` или справочник `НазначениеСвойствКатегорийОбъектов`
	 *
	 * @property extra_properties
	 * @type Array
	 */
	extra_properties: {
		value : function(obj){
			return [];
		}
	},

	/**
	 * ### Имя функции - конструктора объектов или строк табличных частей
	 *
	 * @method obj_constructor
	 * @param ts_name {String}
	 * @return {Function}
	 */
	obj_constructor: {
		value: function (ts_name) {
			var parts = this.class_name.split("."),
				fn_name = parts[0].charAt(0).toUpperCase() + parts[0].substr(1) + parts[1].charAt(0).toUpperCase() + parts[1].substr(1);

			return ts_name ? fn_name + ts_name.charAt(0).toUpperCase() + ts_name.substr(1) + "Row" : fn_name;

		}
	}

});



/**
 * ### Выводит фрагмент списка объектов данного менеджера, ограниченный фильтром attr в grid
 *
 * @method sync_grid
 * @for DataManager
 * @param grid {dhtmlXGridObject}
 * @param attr {Object}
 */
DataManager.prototype.sync_grid = function(attr, grid){

	var mgr = this;

	function request(){

		if(attr.custom_selection){
			return attr.custom_selection(attr);
			
		}else if(mgr.cachable == "ram"){

			// запрос к alasql
			if(attr.action == "get_tree")
				return $p.wsql.promise(mgr.get_sql_struct(attr), [])
					.then($p.iface.data_to_tree);

			else if(attr.action == "get_selection")
				return $p.wsql.promise(mgr.get_sql_struct(attr), [])
					.then(function(data){
						return $p.iface.data_to_grid.call(mgr, data, attr);
					});

		}else if(mgr.cachable.indexOf("doc") == 0){

			// todo: запрос к pouchdb
			if(attr.action == "get_tree")
				return mgr.pouch_tree(attr);

			else if(attr.action == "get_selection")
				return mgr.pouch_selection(attr);

		} else {

			// запрос к серверу по сети
			if(attr.action == "get_tree")
				return mgr.rest_tree(attr);

			else if(attr.action == "get_selection")
				return mgr.rest_selection(attr);

		}
	}

	function to_grid(res){

		return new Promise(function(resolve, reject) {

			if(typeof res == "string"){

				if(res.substr(0,1) == "{")
					res = JSON.parse(res);

				// загружаем строку в грид
				if(grid && grid.parse){
					grid.xmlFileUrl = "exec";
					grid.parse(res, function(){
						resolve(res);
					}, "xml");
				}else
					resolve(res);

			}else if(grid instanceof dhtmlXTreeView && grid.loadStruct){
				grid.loadStruct(res, function(){
					resolve(res);
				});

			}else
				resolve(res);

		});

	}
	
	// TODO: переделать обработку catch()
	return request()
		.then(to_grid)
		.catch($p.record_log);

};

/**
 * ### Возвращает массив доступных значений для комбобокса
 * @method get_option_list
 * @for DataManager
 * @param val {DataObj|String} - текущее значение
 * @param [selection] {Object} - отбор, который будет наложен на список
 * @param [selection._top] {Number} - ограничивает длину возвращаемого массива
 * @return {Promise.<Array>}
 */
DataManager.prototype.get_option_list = function(val, selection){

	var t = this, l = [], input_by_string, text, sel;

	function check(v){
		if($p.utils.is_equal(v.value, val))
			v.selected = true;
		return v;
	}

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

	if(t.cachable == "ram" || (selection && selection._local)) {
		t.find_rows(selection, function (v) {
			l.push(check({text: v.presentation, value: v.ref}));
		});
		return Promise.resolve(l);

	}else if(t.cachable != "e1cib"){
		return t.pouch_find_rows(selection)
			.then(function (data) {
				data.forEach(function (v) {
					l.push(check({
						text: v.presentation,
						value: v.ref}));
				});
				return l;
			});

	}else{
		// для некешируемых выполняем запрос к серверу
		var attr = { selection: selection, top: selection._top},
			is_doc = t instanceof DocManager || t instanceof BusinessProcessManager;
		delete selection._top;

		if(is_doc)
			attr.fields = ["ref", "date", "number_doc"];

		else if(t.metadata().main_presentation_name)
			attr.fields = ["ref", "name"];
		else
			attr.fields = ["ref", "id"];

		return _rest.load_array(attr, t)
			.then(function (data) {
				data.forEach(function (v) {
					l.push(check({
						text: is_doc ? (v.number_doc + " от " + $p.moment(v.date).format($p.moment._masks.ldt)) : (v.name || v.id),
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
 * ### Возаращает строку xml для инициализации PropertyGrid
 * служебный метод, используется {{#crossLink "OHeadFields"}}{{/crossLink}}
 * @method get_property_grid_xml
 * @param oxml {Object} - объект с иерархией полей (входной параметр - правила)
 * @param o {DataObj} - объект данных, из полей и табличных частей которого будут прочитаны значения
 * @param extra_fields {Object} - объект с описанием допреквизитов
 * @param extra_fields.ts {String} - имя табчасти
 * @param extra_fields.title {String} - заголовок в oxml, под которым следует расположить допреквизиты // "Дополнительные реквизиты", "Свойства изделия", "Параметры"
 * @param extra_fields.selection {Object} - отбор, который следует приминить к табчасти допреквизитов
 * @return {String} - XML строка в терминах dhtml.PropertyGrid
 * @private
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
						if(i != "predefined_name" && !mf.fields[i].hide)
							oxml[" "].push(i);
				}

				if(mf.tabular_sections && mf.tabular_sections.extra_fields)
					oxml["Дополнительные реквизиты"] = [];
			}


		},

		txt_by_type = function (fv, mf) {

			if($p.utils.is_data_obj(fv))
				txt = fv.presentation;
			else
				txt = fv;

			if(mf.type.is_ref){
				;
			} else if(mf.type.date_part) {
				txt = $p.moment(txt).format($p.moment._masks[mf.type.date_part]);

			} else if(mf.type.types[0]=="boolean") {
				txt = txt ? "1" : "0";
			}
		},

		by_type = function(fv){

			ft = _md.control_by_type(mf.type, fv);
			txt_by_type(fv, mf);

		},

		add_xml_row = function(f, tabular){
			if(tabular){
				var pref = f.property || f.param || f.Параметр || f.Свойство,
					pval = f.value != undefined ? f.value : f.Значение;
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
				row_id = f.id;
				mf = extra_fields && extra_fields.metadata && extra_fields.metadata[row_id];
				if(!mf)
					mf = {synonym: f.synonym};
				else if(f.synonym)
					mf.synonym = f.synonym;

				ft = f.type;
				txt = "";
				if(f.hasOwnProperty("txt"))
					txt = f.txt;
				else if((v = o[row_id]) !== undefined)
					txt_by_type(v, mf.type ? mf : _md.get(t.class_name, row_id));

			}else if(extra_fields && extra_fields.metadata && ((mf = extra_fields.metadata[f]) !== undefined)){
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
			var added = false,
				destinations_extra_fields = t.extra_fields(o),
				pnames = "property,param,Свойство,Параметр".split(","),
				//meta_extra_fields = o._metadata.tabular_sections[extra_fields.ts].fields,
				meta_extra_fields = o[extra_fields.ts]._owner._metadata.tabular_sections[o[extra_fields.ts]._name].fields,
				pname;

			// Если в объекте не найдены предопределенные свойства - добавляем
			if(pnames.some(function (name) {
				if(meta_extra_fields[name]){
					pname = name;
					return true;
				}
			})){
				o[extra_fields.ts].forEach(function (row) {
					var index = destinations_extra_fields.indexOf(row[pname]);
					if(index != -1)
						destinations_extra_fields.splice(index, 1);
				});
				destinations_extra_fields.forEach(function (property) {
					var row = o[extra_fields.ts].add();
					row[pname] = property;
				});
			};

			// Добавляем строки в oxml с учетом отбора, который мог быть задан в extra_fields.selection
			o[extra_fields.ts].find_rows(extra_fields.selection, function (row) {
				add_xml_row(row, extra_fields.ts);

			});
			//if(!added)
			//	add_xml_row({param: $p.cch.properties.get("", false)}, "params"); // fake-строка, если в табчасти нет допреквизитов

		}

		if(i!=" ") gd += '</row>';                          // если блок был открыт - закрываем
	}
	gd += '</rows>';
	return gd;
};



/**
 * Печатает объект
 * @method print
 * @param ref {DataObj|String} - guid ссылки на объект
 * @param model {String|DataObj.cst.formulas} - идентификатор команды печати
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

	setTimeout(tune_wnd_print, 3000);

	// если _printing_plates содержит ссылку на обрабочтик печати, используем его
	if(this._printing_plates[model] instanceof DataObj)
		model = this._printing_plates[model];	
	
	// если существует локальный обработчик, используем его
	if(model instanceof DataObj && model.execute){

		if(ref instanceof DataObj)
			return model.execute(ref)
				.then(tune_wnd_print);
		else
			return this.get(ref, true, true)
				.then(model.execute.bind(model))
				.then(tune_wnd_print);

	}else{
		
		// иначе - печатаем средствами 1С или иного сервера
		var rattr = {};
		$p.ajax.default_attr(rattr, $p.job_prm.irest_url());
		rattr.url += this.rest_name + "(guid'" + $p.utils.fix_guid(ref) + "')" +
			"/Print(model=" + model + ", browser_uid=" + $p.wsql.get_user_param("browser_uid") +")";

		return $p.ajax.get_and_show_blob(rattr.url, rattr, "get")
			.then(tune_wnd_print);
	}

};

/**
 * Возвращает промис со структурой печатных форм объекта
 * @return {Promise.<Object>}
 */
DataManager.prototype.printing_plates = function(){
	var rattr = {}, t = this;

	if(!t._printing_plates){
		if(t.metadata().printing_plates)
			t._printing_plates = t.metadata().printing_plates;

		else if(t.metadata().cachable == "ram" || (t.metadata().cachable && t.metadata().cachable.indexOf("doc") == 0)){
			t._printing_plates = {};
		}
	}

	if(!t._printing_plates && $p.ajax.authorized){
		$p.ajax.default_attr(rattr, $p.job_prm.irest_url());
		rattr.url += t.rest_name + "/Print()";
		return $p.ajax.get_ex(rattr.url, rattr)
			.then(function (req) {
				t._printing_plates = JSON.parse(req.response);
				return t._printing_plates;
			})
			.catch(function () {
			})
			.then(function (pp) {
				return pp || (t._printing_plates = {});
			});
	}

	return Promise.resolve(t._printing_plates);

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
	
	RefDataManager.superclass.constructor.call(this, class_name);
	
}
RefDataManager._extend(DataManager);

RefDataManager.prototype.__define({

	/**
	 * Помещает элемент ссылочных данных в локальную коллекцию
	 * @method push
	 * @param o {DataObj}
	 * @param [new_ref] {String} - новое значение ссылки объекта
	 */
	push: {
		value: function(o, new_ref){
			if(new_ref && (new_ref != o.ref)){
				delete this.by_ref[o.ref];
				this.by_ref[new_ref] = o;
			}else
				this.by_ref[o.ref] = o;
		}
	},

	/**
	 * Выполняет перебор элементов локальной коллекции
	 * @method each
	 * @param fn {Function} - функция, вызываемая для каждого элемента локальной коллекции
	 */
	each: {
		value: 	function(fn){
			for(var i in this.by_ref){
				if(!i || i == $p.utils.blank.guid)
					continue;
				if(fn.call(this, this.by_ref[i]) == true)
					break;
			}
		}
	},

	/**
	 * Синоним для each()
	 */
	forEach: {
		value: function (fn) {
			return this.each.call(this, fn);
		}
	},

	/**
	 * Возвращает объект по ссылке (читает из датабазы или локального кеша) если идентификатор пуст, создаёт новый объект
	 * @method get
	 * @param ref {String|Object} - ссылочный идентификатор
	 * @param [force_promise] {Boolean} - Если истина, возвращает промис, даже для локальных объектов. Если ложь, ищет только в локальном кеше
	 * @param [do_not_create] {Boolean} - Не создавать новый. Например, когда поиск элемента выполняется из конструктора
	 * @return {DataObj|Promise.<DataObj>}
	 */
	get: {
		value: function(ref, force_promise, do_not_create){

			var o = this.by_ref[ref] || this.by_ref[(ref = $p.utils.fix_guid(ref))];

			if(!o){
				if(do_not_create && !force_promise)
					return;
				else
					o = new $p[this.obj_constructor()](ref, this, true);
			}

			if(force_promise === false)
				return o;

			else if(force_promise === undefined && ref === $p.utils.blank.guid)
				return o;

			if(o.is_new()){
				return o.load();	// читаем из 1С или иного сервера

			}else if(force_promise)
				return Promise.resolve(o);

			else
				return o;
		}
	},

	/**
	 * ### Создаёт новый объект типа объектов текущего менеджера
	 * Для кешируемых объектов, все действия происходят на клиенте<br />
	 * Для некешируемых, выполняется обращение к серверу для получения guid и значений реквизитов по умолчанию
	 *
	 * @method create
	 * @param [attr] {Object} - значениями полей этого объекта будет заполнен создаваемый объект
	 * @param [fill_default] {Boolean} - признак, надо ли заполнять (инициализировать) создаваемый объект значениями полей по умолчанию
	 * @return {Promise.<*>}
	 */
	create: {
		value: function(attr, fill_default){

			if(!attr || typeof attr != "object")
				attr = {};
			if(!attr.ref || !$p.utils.is_guid(attr.ref) || $p.utils.is_empty_guid(attr.ref))
				attr.ref = $p.utils.generate_guid();

			var o = this.by_ref[attr.ref];
			if(!o){

				o = new $p[this.obj_constructor()](attr, this);

				if(!fill_default && attr.ref && attr.presentation && Object.keys(attr).length == 2){
					// заглушка ссылки объекта

				}else{

					if(o instanceof DocObj && o.date == $p.utils.blank.date)
						o.date = new Date();

					// Триггер после создания
					var after_create_res = this.handle_event(o, "after_create");

					if(after_create_res === false)
						return Promise.resolve(o);

					else if(typeof after_create_res === "object" && after_create_res.then)
						return after_create_res;

					// выполняем обработчик после создания объекта и стандартные действия, если их не запретил обработчик
					if(this.cachable == "e1cib" && fill_default){
						var rattr = {};
						$p.ajax.default_attr(rattr, $p.job_prm.irest_url());
						rattr.url += this.rest_name + "/Create()";
						return $p.ajax.get_ex(rattr.url, rattr)
							.then(function (req) {
								return o._mixin(JSON.parse(req.response), undefined, ["ref"]);
							});
					}

				}
			}

			return Promise.resolve(o);
		}
	},

	/**
	 * Удаляет объект из alasql и локального кеша
	 * @method unload_obj
	 * @param ref
	 */
	unload_obj: {
		value: function(ref) {
			delete this.by_ref[ref];
			this.alatable.some(function (o, i, a) {
				if(o.ref == ref){
					a.splice(i, 1);
					return true;
				}
			});
		}
	},

	/**
	 * Находит первый элемент, в любом поле которого есть искомое значение
	 * @method find
	 * @param val {*} - значение для поиска
	 * @param columns {String|Array} - колонки, в которых искать
	 * @return {DataObj}
	 */
	find: {
		value: function(val, columns){
			return $p._find(this.by_ref, val, columns);
		}
	},

	/**
	 * сохраняет массив объектов в менеджере
	 * @method load_array
	 * @param aattr {Array} - массив объектов для трансформации в объекты ссылочного типа
	 * @param forse {Boolean} - перезаполнять объект
	 * @async
	 */
	load_array: {
		value: function(aattr, forse){

			var ref, obj, res = [];

			for(var i=0; i<aattr.length; i++){

				ref = $p.utils.fix_guid(aattr[i]);
				obj = this.by_ref[ref];

				if(!obj){
					obj = new $p[this.obj_constructor()](aattr[i], this);
					if(forse)
						obj._set_loaded();

				}else if(obj.is_new() || forse){
					obj._mixin(aattr[i]);
					obj._set_loaded();
				}

				res.push(obj);
			}
			return res;
		}
	},

	/**
	 * Находит перую папку в пределах подчинения владельцу
	 * @method first_folder
	 * @param owner {DataObj|String}
	 * @return {DataObj} - ссылка найденной папки или пустая ссылка
	 */
	first_folder: {
		value: function(owner){
			for(var i in this.by_ref){
				var o = this.by_ref[i];
				if(o.is_folder && (!owner || $p.utils.is_equal(owner, o.owner)))
					return o;
			}
			return this.get();
		}
	},
	
	/**
	 * Возаращает массив запросов для создания таблиц объекта и его табличных частей
	 * @method get_sql_struct
	 * @param attr {Object}
	 * @param attr.action {String} - [create_table, drop, insert, update, replace, select, delete]
	 * @return {Object|String}
	 */
	get_sql_struct: {
		value: function(attr){
			var t = this,
				cmd = t.metadata(),
				res = {}, f, f0, trunc_index = 0,
				action = attr && attr.action ? attr.action : "create_table";


			function sql_selection(){

				var ignore_parent = !attr.parent,
					parent = attr.parent || $p.utils.blank.guid,
					owner,
					initial_value = attr.initial_value || $p.utils.blank.guid,
					filter = attr.filter || "",
					set_parent = $p.utils.blank.guid;

				function list_flds(){
					var flds = [], s = "_t_.ref, _t_.`_deleted`";

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
								(owner == $p.utils.blank.guid ? 1 : 0) + " OR _t_.owner = '" + owner + "') AND (" + (filter ? 0 : 1);
						else
							s = " WHERE (" + (ignore_parent || filter ? 1 : 0) + " OR _t_.parent = '" + parent + "') AND (" + (filter ? 0 : 1);

					}else{
						if(cmd["has_owners"])
							s = " WHERE (" + (owner == $p.utils.blank.guid ? 1 : 0) + " OR _t_.owner = '" + owner + "') AND (" + (filter ? 0 : 1);
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

					s += ") AND (_t_.ref != '" + $p.utils.blank.guid + "')";


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

										else if(typeof sel[key] == "object"){

											if($p.utils.is_data_obj(sel[key]))
												s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";

											else{
												var keys = Object.keys(sel[key]),
													val = sel[key][keys[0]],
													mf = cmd.fields[key],
													vmgr;

												if(mf && mf.type.is_ref){
													vmgr = _md.value_mgr({}, key, mf.type, true, val);
												}

												if(keys[0] == "not")
													s += "\n AND (not _t_." + key + " = '" + val + "') ";

												else
													s += "\n AND (_t_." + key + " = '" + val + "') ";
											}

										}else if(typeof sel[key] == "string")
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
							owner = $p.utils.blank.guid;
					}

					// ссылка родителя во взаимосвязи с начальным значением выбора
					if(initial_value !=  $p.utils.blank.guid && ignore_parent){
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
					sql += t.table_name+" (ref uuid PRIMARY KEY NOT NULL, _deleted boolean";

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
					sql += "`"+t.table_name+"` (ref CHAR PRIMARY KEY NOT NULL, `_deleted` BOOLEAN";

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
				var fields = ["ref", "_deleted"],
					sql = "INSERT INTO `"+t.table_name+"` (ref, `_deleted`",
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
		}
	},

	/**
	 * ШапкаТаблицыПоИмениКласса
	 */
	caption_flds: {
		value: function(attr){

			var _meta = attr.metadata || this.metadata(),
				str_def = "<column id=\"%1\" width=\"%2\" type=\"%3\" align=\"%4\" sort=\"%5\">%6</column>",
				acols = [],	s = "";

			if(_meta.form && _meta.form.selection){
				acols = _meta.form.selection.cols;

			}else if(this instanceof DocManager){
				acols.push(new Col_struct("date", "160", "ro", "left", "server", "Дата"));
				acols.push(new Col_struct("number_doc", "140", "ro", "left", "server", "Номер"));

				if(_meta.fields.note)
					acols.push(new Col_struct("note", "*", "ro", "left", "server", _meta.fields.note.synonym));

				if(_meta.fields.responsible)
					acols.push(new Col_struct("responsible", "*", "ro", "left", "server", _meta.fields.responsible.synonym));


			}else if(this instanceof ChartOfAccountManager){
				acols.push(new Col_struct("id", "140", "ro", "left", "server", "Код"));
				acols.push(new Col_struct("presentation", "*", "ro", "left", "server", "Наименование"));

			}else{

				acols.push(new Col_struct("presentation", "*", "ro", "left", "server", "Наименование"));
				//if(_meta.has_owners){
				//	acols.push(new Col_struct("owner", "*", "ro", "left", "server", _meta.fields.owner.synonym));
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
		}
	},

	/**
	 * Догружает с сервера объекты, которых нет в локальном кеше
	 * @method load_cached_server_array
	 * @param list {Array} - массив строк ссылок или объектов со свойством ref
	 * @param alt_rest_name {String} - альтернативный rest_name для загрузки с сервера
	 * @return {Promise}
	 */
	load_cached_server_array: {
		value: function (list, alt_rest_name) {

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
		}
	},

	/**
	 * Возаращает предопределенный элемент по имени предопределенных данных
	 * @method predefined
	 * @param name {String} - имя предопределенного
	 * @return {DataObj}
	 */
	predefined: {
		value: function(name){

			if(!this._predefined)
				this._predefined = {};

			if(!this._predefined[name]){

				this._predefined[name] = this.get();

				this.find_rows({predefined_name: name}, function (el) {
					this._predefined[name] = el;
					return false;
				});
			}

			return this._predefined[name];
		}
	}

});



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

}
DataProcessorsManager._extend(DataManager);

DataProcessorsManager.prototype.__define({

	/**
	 * Создаёт экземпляр объекта обработки
	 * @method
	 * @return {DataProcessorObj}
	 */
	create: {
		value: function(){
			return new $p[this.obj_constructor()]({}, this);
		}
	},

	/**
	 * fake-метод, не имеет смысла для обработок, т.к. они не кешируются в alasql. Добавлен, чтобы не ругалась форма обхекта при закрытии
	 * @method unload_obj
	 * @param ref
	 */
	unload_obj: {
		value: function() {	}
	}
});



/**
 * ### Абстрактный менеджер перечисления
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "Enumerations"}}{{/crossLink}}
 *
 * @class EnumManager
 * @extends RefDataManager
 * @param class_name {string} - имя типа менеджера объекта. например, "enm.open_types"
 * @constructor
 */
function EnumManager(class_name) {

	EnumManager.superclass.constructor.call(this, class_name);

	var a = $p.md.get(class_name);
	for(var i in a)
		new EnumObj(a[i], this);

}
EnumManager._extend(RefDataManager);

EnumManager.prototype.__define({

	get: {
		value: function(ref){

			if(ref instanceof EnumObj)
				return ref;

			else if(!ref || ref == $p.utils.blank.guid)
				ref = "_";

			var o = this[ref];
			if(!o)
				o = new EnumObj({name: ref}, this);

			return o;
		}
	},

	push: {
		value: function(o, new_ref){
			this.__define(new_ref, {
				value : o
			});
		}
	},

	each: {
		value: function (fn) {
			this.alatable.forEach(function (v) {
				if(v.ref && v.ref != "_" && v.ref != $p.utils.blank.guid)
					fn.call(this[v.ref]);
			}.bind(this));
		}
	}
});

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
	var l = [], synonym = "", sref;

	function check(v){
		if($p.utils.is_equal(v.value, val))
			v.selected = true;
		return v;
	}

	if(selection){
		for(var i in selection){
			if(i.substr(0,1)=="_")
				continue;
			else if(i == "ref"){
				sref = selection[i].hasOwnProperty("in") ? selection[i].in : selection[i];
			}
			else
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
		if(sref){
			if(Array.isArray(sref)){
				if(!sref.some(function (sv) {
						return sv.name == v.ref || sv.ref == v.ref || sv == v.ref;
					}))
					return;
			}else{
				if(sref.name != v.ref && sref.ref != v.ref && sref != v.ref)
					return;
			}
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

	RegisterManager.superclass.constructor.call(this, class_name);

	/**
	 * Помещает элемент ссылочных данных в локальную коллекцию
	 * @method push
	 * @param o {RegisterRow}
	 * @param [new_ref] {String} - новое значение ссылки объекта
	 */
	this.push = function(o, new_ref){
		if(new_ref && (new_ref != o.ref)){
			delete this.by_ref[o.ref];
			this.by_ref[new_ref] = o;
		}else
			this.by_ref[o.ref] = o;
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
		else if(typeof attr == "string")
			attr = {ref: attr};
		
		if(attr.ref && return_row)
			return force_promise ? Promise.resolve(this.by_ref[attr.ref]) : this.by_ref[attr.ref];
		
		attr.action = "select";

		var arr = $p.wsql.alasql(this.get_sql_struct(attr), attr._values),
			res;

		delete attr.action;
		delete attr._values;

		if(arr.length){
			if(return_row)
				res = this.by_ref[this.get_ref(arr[0])];
			else{
				res = [];
				for(var i in arr)
					res.push(this.by_ref[this.get_ref(arr[i])]);
			}
		}
		
		return force_promise ? Promise.resolve(res) : res;
	};

	/**
	 * Удаляет объект из alasql и локального кеша
	 * @method unload_obj
	 * @param ref
	 */
	this.unload_obj = function(ref) {
		delete this.by_ref[ref];
		this.alatable.some(function (o, i, a) {
			if(o.ref == ref){
				a.splice(i, 1);
				return true;
			}
		});
	};

	/**
	 * сохраняет массив объектов в менеджере
	 * @method load_array
	 * @param aattr {array} - массив объектов для трансформации в объекты ссылочного типа
	 * @param forse {Boolean} - перезаполнять объект
	 * @async
	 */
	this.load_array = function(aattr, forse){

		var ref, obj, res = [];

		for(var i=0; i<aattr.length; i++){

			ref = this.get_ref(aattr[i]);
			obj = this.by_ref[ref];

			if(!obj && !aattr[i]._deleted){
				obj = new $p[this.obj_constructor()](aattr[i], this);
				if(forse)
					obj._set_loaded();

			}else if(obj && aattr[i]._deleted){
				obj.unload();
				continue;

			}else if(obj.is_new() || forse){
				obj._mixin(aattr[i]);
				obj._set_loaded();
			}

			res.push(obj);
		}
		return res;
	};

}
RegisterManager._extend(DataManager);

RegisterManager.prototype.__define({

	/**
	 * Возаращает запросов для создания таблиц или извлечения данных
	 * @method get_sql_struct
	 * @for RegisterManager
	 * @param attr {Object}
	 * @param attr.action {String} - [create_table, drop, insert, update, replace, select, delete]
	 * @return {Object|String}
	 */
	get_sql_struct: {
		value: function(attr) {
			var t = this,
				cmd = t.metadata(),
				res = {}, f,
				action = attr && attr.action ? attr.action : "create_table";

			function sql_selection(){

				var filter = attr.filter || "";

				function list_flds(){
					var flds = [], s = "_t_.ref";

					if(cmd.form && cmd.form.selection){
						cmd.form.selection.fields.forEach(function (fld) {
							flds.push(fld);
						});

					}else{

						for(var f in cmd["dimensions"]){
							flds.push(f);
						}
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

					var s = " WHERE (" + (filter ? 0 : 1);

					if(t.sql_selection_where_flds){
						s += t.sql_selection_where_flds(filter);

					}

					s += ")";


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

										else if(typeof sel[key] == "object"){

											if($p.utils.is_data_obj(sel[key]))
												s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";

											else{
												var keys = Object.keys(sel[key]),
													val = sel[key][keys[0]],
													mf = cmd.fields[key],
													vmgr;

												if(mf && mf.type.is_ref){
													vmgr = _md.value_mgr({}, key, mf.type, true, val);
												}

												if(keys[0] == "not")
													s += "\n AND (not _t_." + key + " = '" + val + "') ";

												else
													s += "\n AND (_t_." + key + " = '" + val + "') ";
											}

										}else if(typeof sel[key] == "string")
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

					return "";
				}

				// строка фильтра
				if(filter && filter.indexOf("%") == -1)
					filter = "%" + filter + "%";

				var sql;
				if(t.sql_selection_list_flds)
					sql = t.sql_selection_list_flds();
				else
					sql = ("SELECT %2 FROM `" + t.table_name + "` AS _t_ %j %3 %4 LIMIT 300")
						.replace("%2", list_flds())
						.replace("%j", join_flds())
					;

				return sql.replace("%3", where_flds()).replace("%4", order_flds());

			}

			function sql_create(){

				var sql = "CREATE TABLE IF NOT EXISTS ",
					first_field = true;

				if(attr && attr.postgres){
					sql += t.table_name+" (";

					if(cmd.splitted){
						sql += "zone integer";
						first_field = false;
					}

					for(f in cmd.dimensions){
						if(first_field){
							sql += f;
							first_field = false;
						}else
							sql += ", " + f;
						sql += _md.sql_type(t, f, cmd.dimensions[f].type, true) + _md.sql_composite(cmd.dimensions, f, "", true);
					}

					for(f in cmd.resources)
						sql += ", " + f + _md.sql_type(t, f, cmd.resources[f].type, true) + _md.sql_composite(cmd.resources, f, "", true);

					for(f in cmd.attributes)
						sql += ", " + f + _md.sql_type(t, f, cmd.attributes[f].type, true) + _md.sql_composite(cmd.attributes, f, "", true);

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
					sql += "`"+t.table_name+"` (ref CHAR PRIMARY KEY NOT NULL, `_deleted` BOOLEAN";

					//sql += _md.sql_mask(f) + _md.sql_type(t, f, cmd.dimensions[f].type) + _md.sql_composite(cmd.dimensions, f);

					for(f in cmd.dimensions)
						sql += _md.sql_mask(f) + _md.sql_type(t, f, cmd.dimensions[f].type);

					for(f in cmd.resources)
						sql += _md.sql_mask(f) + _md.sql_type(t, f, cmd.resources[f].type);

					for(f in cmd.attributes)
						sql += _md.sql_mask(f) + _md.sql_type(t, f, cmd.attributes[f].type);

					// sql += ", PRIMARY KEY (";
					// first_field = true;
					// for(f in cmd["dimensions"]){
					// 	if(first_field){
					// 		sql += "`" + f + "`";
					// 		first_field = false;
					// 	}else
					// 		sql += _md.sql_mask(f);
					// }
				}

				sql += ")";

				return sql;
			}

			function sql_update(){
				// "INSERT OR REPLACE INTO user_params (prm_name, prm_value) VALUES (?, ?);
				var sql = "INSERT OR REPLACE INTO `"+t.table_name+"` (",
					fields = [],
					first_field = true;

				for(f in cmd.dimensions){
					if(first_field){
						sql += f;
						first_field = false;
					}else
						sql += ", " + f;
					fields.push(f);
				}
				for(f in cmd.resources){
					sql += ", " + f;
					fields.push(f);
				}
				for(f in cmd.attributes){
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

			else if(action == "get_selection")
				res = sql_selection();

			return res;
		}
	},

	get_ref: {
		value: function(attr){

			if(attr instanceof RegisterRow)
				attr = attr._obj;

			if(attr.ref)
				return attr.ref;

			var key = "",
				dimensions = this.metadata().dimensions;

			for(var j in dimensions){
				key += (key ? "¶" : "");
				if(dimensions[j].type.is_ref)
					key += $p.utils.fix_guid(attr[j]);

				else if(!attr[j] && dimensions[j].type.digits)
					key += "0";

				else if(dimensions[j].date_part)
					key += $p.moment(attr[j] || $p.utils.blank.date).format($p.moment.defaultFormatUtc);

				else if(attr[j]!=undefined)
					key += String(attr[j]);

				else
					key += "$";
			}
			return key;
		}
	},

	caption_flds: {
		value: function(attr){

			var _meta = attr.metadata || this.metadata(),
				str_def = "<column id=\"%1\" width=\"%2\" type=\"%3\" align=\"%4\" sort=\"%5\">%6</column>",
				acols = [],	s = "";

			if(_meta.form && _meta.form.selection){
				acols = _meta.form.selection.cols;

			}else{

				for(var f in _meta["dimensions"]){
					acols.push(new Col_struct(f, "*", "ro", "left", "server", _meta["dimensions"][f].synonym));
				}
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
		}
	},

	create: {
		value: function(attr){

			if(!attr || typeof attr != "object")
				attr = {};


			var o = this.by_ref[attr.ref];
			if(!o){

				o = new $p[this.obj_constructor()](attr, this);

				// Триггер после создания
				var after_create_res = this.handle_event(o, "after_create");

				if(after_create_res === false)
					return Promise.resolve(o);

				else if(typeof after_create_res === "object" && after_create_res.then)
					return after_create_res;
			}

			return Promise.resolve(o);
		}
	}
});



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

	this.__define({

		/**
		 * Добавляет запись в журнал
		 * @param msg {String|Object|Error} - текст + класс события
		 * @param [msg.obj] {Object} - дополнительный json объект
		 */
		record: {
			value: function(msg){

				if(msg instanceof Error){
					if(console)
						console.log(msg);
					msg = {
						class: "error",
						note: msg.toString()
					}
				}else if(typeof msg == "object" && !msg.class && !msg.obj){
					msg = {
						class: "obj",
						obj: msg,
						note: msg.note
					};
				}else if(typeof msg != "object")
					msg = {note: msg};

				msg.date = Date.now() + $p.wsql.time_diff;

				// уникальность ключа
				if(!smax)
					smax = alasql.compile("select MAX(`sequence`) as `sequence` from `ireg_$log` where `date` = ?");
				var res = smax([msg.date]);
				if(!res.length || res[0].sequence === undefined)
					msg.sequence = 0;
				else
					msg.sequence = parseInt(res[0].sequence) + 1;

				// класс сообщения
				if(!msg.class)
					msg.class = "note";

				$p.wsql.alasql("insert into `ireg_$log` (`ref`, `date`, `sequence`, `class`, `note`, `obj`) values (?,?,?,?,?,?)",
					[msg.date + "¶" + msg.sequence, msg.date, msg.sequence, msg.class, msg.note, msg.obj ? JSON.stringify(msg.obj) : ""]);

			}
		},

		/**
		 * Сбрасывает события на сервер
		 * @method backup
		 * @param [dfrom] {Date}
		 * @param [dtill] {Date}
		 */
		backup: {
			value: function(dfrom, dtill){

			}
		},

		/**
		 * Восстанавливает события из архива на сервере
		 * @method restore
		 * @param [dfrom] {Date}
		 * @param [dtill] {Date}
		 */
		restore: {
			value: function(dfrom, dtill){

			}
		},

		/**
		 * Стирает события в указанном диапазоне дат
		 * @method clear
		 * @param [dfrom] {Date}
		 * @param [dtill] {Date}
		 */
		clear: {
			value: function(dfrom, dtill){

			}
		},

		show: {
			value: function (pwnd) {

			}
		},

		get: {
			value: function (ref, force_promise, do_not_create) {

				if(typeof ref == "object")
					ref = ref.ref || "";

				if(!this.by_ref[ref]){

					if(force_promise === false)
						return undefined;

					var parts = ref.split("¶");
					$p.wsql.alasql("select * from `ireg_$log` where date=" + parts[0] + " and sequence=" + parts[1]).forEach(function (row) {
						new RegisterRow(row, this);
					}.bind(this));
				}

				return force_promise ? Promise.resolve(this.by_ref[ref]) : this.by_ref[ref];
			}
		},

		get_sql_struct: {
			value: function(attr){

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
			}
		},

		caption_flds: {
			value: function (attr) {

				var str_def = "<column id=\"%1\" width=\"%2\" type=\"%3\" align=\"%4\" sort=\"%5\">%6</column>",
					acols = [], s = "";


				acols.push(new Col_struct("date", "200", "ro", "left", "server", "Дата"));
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
			}
		},

		data_to_grid: {
			value: function (data, attr) {
				var xml = "<?xml version='1.0' encoding='UTF-8'?><rows total_count='%1' pos='%2' set_parent='%3'>"
						.replace("%1", data.length).replace("%2", attr.start)
						.replace("%3", attr.set_parent || "" ),
					caption = this.caption_flds(attr);

				// при первом обращении к методу добавляем описание колонок
				xml += caption.head;

				data.forEach(function(r){
					xml += "<row id=\"" + r.ref + "\"><cell>" +
						$p.moment(r.date - $p.wsql.time_diff).format("DD.MM.YYYY HH:mm:ss") + "." + r.sequence + "</cell>" +
						"<cell>" + (r.class || "") + "</cell><cell>" + (r.note || "") + "</cell></row>";
				});

				return xml + "</rows>";
			}
		}
	});

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

	CatManager.superclass.constructor.call(this, class_name);

	// реквизиты по метаданным
	if(this.metadata().hierarchical && this.metadata().group_hierarchy){

		/**
		 * ### Признак "это группа"
		 * @property is_folder
		 * @for CatObj
		 * @type {Boolean}
		 */
		$p[this.obj_constructor()].prototype.__define("is_folder", {
			get : function(){ return this._obj.is_folder || false},
			set : function(v){ this._obj.is_folder = $p.utils.fix_boolean(v)},
			enumerable: true,
			configurable: true
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


	DocManager.superclass.constructor.call(this, class_name);

}
DocManager._extend(RefDataManager);

/**
 * ### Абстрактный менеджер задач
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "Tasks"}}{{/crossLink}}
 *
 * @class TaskManager
 * @extends CatManager
 * @constructor
 * @param class_name {string}
 */
function TaskManager(class_name){

	TaskManager.superclass.constructor.call(this, class_name);

}
TaskManager._extend(CatManager);

/**
 * ### Абстрактный менеджер бизнес-процессов
 * Экземпляры объектов этого класса создаются при выполнении конструктора {{#crossLink "Meta"}}{{/crossLink}}
 * в соответствии с описанием метаданных конфигурации и помещаются в коллекцию {{#crossLink "BusinessProcesses"}}{{/crossLink}}
 *
 * @class BusinessProcessManager
 * @extends CatManager
 * @constructor
 * @param class_name {string}
 */
function BusinessProcessManager(class_name){

	BusinessProcessManager.superclass.constructor.call(this, class_name);

}
BusinessProcessManager._extend(CatManager);


/**
 * Конструкторы объектов данных
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  metadata
 * @submodule meta_objs
 * @requires common
 */


/**
 * ### Абстрактный объект данных
 * Прародитель как ссылочных объектов (документов и справочников), так и регистров с суррогатным ключом и несохраняемых обработок<br />
 * См. так же:
 * - {{#crossLink "EnumObj"}}{{/crossLink}} - ПеречислениеОбъект
 * - {{#crossLink "CatObj"}}{{/crossLink}} - СправочникОбъект
 * - {{#crossLink "DocObj"}}{{/crossLink}} - ДокументОбъект
 * - {{#crossLink "DataProcessorObj"}}{{/crossLink}} - ОбработкаОбъект
 * - {{#crossLink "TaskObj"}}{{/crossLink}} - ЗадачаОбъект
 * - {{#crossLink "BusinessProcessObj"}}{{/crossLink}} - БизнеспроцессОбъект
 * - {{#crossLink "RegisterRow"}}{{/crossLink}} - ЗаписьРегистраОбъект
 *
 * @class DataObj
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
 * @constructor
 * @menuorder 20
 * @tooltip Объект данных
 */
function DataObj(attr, manager) {

	var tmp,
		_ts_ = {},
		_obj = {},
		_data = {
			_is_new: !(this instanceof EnumObj)
		};

	// если объект с такой ссылкой уже есть в базе, возвращаем его и не создаём нового
	if(!(manager instanceof DataProcessorsManager) && !(manager instanceof EnumManager))
		tmp = manager.get(attr, false, true);

	if(tmp){
		attr = null;
		return tmp;
	}


	if(manager instanceof EnumManager)
		_obj.ref = attr.name;

	else if(!(manager instanceof RegisterManager)){
		_obj.ref = $p.utils.fix_guid(attr);

	}else
		_obj.ref = manager.get_ref(attr);


	this.__define({

		/**
		 * ### Фактическое хранилище данных объекта
		 * Оно же, запись в таблице объекта локальной базы данных
		 * @property _obj
		 * @type Object
		 * @final
		 */
		_obj: {
			value: _obj,
			configurable: true
		},

		/**
		 * Хранилище ссылок на табличные части - не сохраняется в базе данных
		 * @property _ts_
		 */
		_ts_: {
			value: function( name ) {
				if( !_ts_[name] ) {
					_ts_[name] = new TabularSection(name, this);
				}
				return _ts_[name];
			},
			configurable: true
		},

		/**
		 * Указатель на менеджер данного объекта
		 * @property _manager
		 * @type DataManager
		 * @final
		 */
		_manager: {
			value : manager
		},

		/**
		 * Пользовательские данные - аналог `AdditionalProperties` _Дополнительные cвойства_ в 1С
		 * @property _data
		 * @type DataManager
		 * @final
		 */
		_data: {
			value : _data,
			configurable: true
		}

	});


	if(manager.alatable && manager.push){
		manager.alatable.push(_obj);
		manager.push(this, _obj.ref);
	}

	attr = null;

}


DataObj.prototype._getter = function (f) {

	var mf = this._metadata.fields[f].type,
		res = this._obj ? this._obj[f] : "",
		mgr, ref;

	if(f == "type" && typeof res == "object")
		return res;

	else if(f == "ref"){
		return res;

	}else if(mf.is_ref){
		if(mf.digits && typeof res === "number")
			return res;

		if(mf.hasOwnProperty("str_len") && !$p.utils.is_guid(res))
			return res;

		if(mgr = _md.value_mgr(this._obj, f, mf)){
			if($p.utils.is_data_mgr(mgr))
				return mgr.get(res, false);
			else
				return $p.utils.fetch_type(res, mgr);
		}

		if(res){
			console.log([f, mf, this._obj]);
			return null;
		}

	}else if(mf.date_part)
		return $p.utils.fix_date(this._obj[f], true);

	else if(mf.digits)
		return $p.utils.fix_number(this._obj[f], !mf.hasOwnProperty("str_len"));

	else if(mf.types[0]=="boolean")
		return $p.utils.fix_boolean(this._obj[f]);

	else
		return this._obj[f] || "";
};

DataObj.prototype.__setter = function (f, v) {

	var mf = this._metadata.fields[f].type,
		mgr;

	if(f == "type" && v.types)
		this._obj[f] = v;

	else if(f == "ref")

		this._obj[f] = $p.utils.fix_guid(v);

	else if(mf.is_ref){

		if(mf.digits && typeof v == "number" || mf.hasOwnProperty("str_len") && typeof v == "string" && !$p.utils.is_guid(v)){
			this._obj[f] = v;

		}else {
			this._obj[f] = $p.utils.fix_guid(v);

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
				}else if(!$p.utils.is_data_mgr(mgr))
					this._obj[f] = $p.utils.fetch_type(v, mgr);
			}else{
				if(typeof v != "object")
					this._obj[f] = v;
			}
		}

	}else if(mf.date_part)
		this._obj[f] = $p.utils.fix_date(v, true);

	else if(mf.digits)
		this._obj[f] = $p.utils.fix_number(v, !mf.hasOwnProperty("str_len"));

	else if(mf.types[0]=="boolean")
		this._obj[f] = $p.utils.fix_boolean(v);

	else
		this._obj[f] = v;
	
};

DataObj.prototype.__notify = function (f) {
	if(!this._data._silent)
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
	this._data._modified = true;

};

DataObj.prototype._getter_ts = function (f) {
	return this._ts_(f);
};

DataObj.prototype._setter_ts = function (f, v) {
	var ts = this._ts_(f);
	if(ts instanceof TabularSection && Array.isArray(v))
		ts.load(v);
};

DataObj.prototype.__define({

	/**
	 * ### valueOf
	 * для операций сравнения возвращаем guid
	 */
	valueOf: {
		value: function () {
			return this.ref;
		}
	},

	/**
	 * ### toJSON
	 * для сериализации возвращаем внутренний _obj
	 */
	toJSON: {
		value: function () {
			return this._obj;
		}
	},

	/**
	 * ### toString
	 * для строкового представления используем
	 */
	toString: {
		value: function () {
			return this.presentation;
		}
	},

	/**
	 * Метаданные текущего объекта
	 * @property _metadata
	 * @for DataObj
	 * @type Object
	 * @final
	 */
	_metadata: {
		get : function(){
			return this._manager.metadata()
		}
	},

	/**
	 * Пометка удаления
	 * @property _deleted
	 * @for DataObj
	 * @type Boolean
	 */
	_deleted: {
		get : function(){
			return !!this._obj._deleted
		}
	},

	/**
	 * Признак модифицированности
	 */
	_modified: {
		get : function(){
			if(!this._data)
				return false;
			return !!(this._data._modified)
		}
	},

	/**
	 * Возвращает "истина" для нового (еще не записанного или не прочитанного) объекта
	 * @method is_new
	 * @for DataObj
	 * @return {boolean}
	 */
	is_new: {
		value: function(){
			return this._data._is_new;
		}
	},

	/**
	 * Метод для ручной установки признака _прочитан_ (не новый)
	 */
	_set_loaded: {
		value: function(ref){
			this._manager.push(this, ref);
			this._data._modified = false;
			this._data._is_new = false;
		}
	},

	/**
	 * Установить пометку удаления
	 * @method mark_deleted
	 * @for DataObj
	 * @param deleted {Boolean}
	 */
	mark_deleted: {
		value: function(deleted){
			this._obj._deleted = !!deleted;
			this.save();
			this.__notify('_deleted');
		}
	},

	/**
	 * guid ссылки объекта
	 * @property ref
	 * @for DataObj
	 * @type String
	 */
	ref: {
		get : function(){ return this._obj.ref},
		set : function(v){ this._obj.ref = $p.utils.fix_guid(v)},
		enumerable : true,
		configurable: true
	},

	/**
	 * Проверяет, является ли ссылка объекта пустой
	 * @method empty
	 * @return {boolean} - true, если ссылка пустая
	 */
	empty: {
		value: function(){
			return $p.utils.is_empty_guid(this._obj.ref);
		}
	},

	/**
	 * Читает объект из внешней или внутренней датабазы асинхронно.
	 * В отличии от _mgr.get(), принудительно перезаполняет объект сохранёнными данными
	 * @method load
	 * @for DataObj
	 * @return {Promise.<DataObj>} - промис с результатом выполнения операции
	 * @async
	 */
	load: {
		value: function(){

			var reset_modified = function () {
					reset_modified = null;
					this._data._modified = false;
					return this;
				}.bind(this);

			if(this.ref == $p.utils.blank.guid){
				if(this instanceof CatObj)
					this.id = "000000000";
				else
					this.number_doc = "000000000";

				return Promise.resolve(this);

			}else{
				if(this._manager.cachable && this._manager.cachable != "e1cib"){
					return $p.wsql.pouch.load_obj(this).then(reset_modified);

				} else
					return _rest.load_obj(this).then(reset_modified);
			}


		}
	},

	/**
	 * Освобождает память и уничтожает объект
	 * @method unload
	 * @for DataObj
	 */
	unload: {
		value: function(){
			var f, obj = this._obj;

			this._manager.unload_obj(this.ref);

			if(this._observers)
				this._observers.length = 0;

			if(this._notis)
				this._notis.length = 0;

			for(f in this._metadata.tabular_sections)
				this[f].clear(true);

			for(f in this){
				if(this.hasOwnProperty(f))
					delete this[f];
			}
			for(f in obj)
				delete obj[f];
			["_ts_","_obj","_data"].forEach(function (f) {
				delete this[f];
			}.bind(this));
			f = obj = null;
		}
	},

	/**
	 * ### Записывает объект
	 * Ввыполняет подписки на события перед записью и после записи<br />
	 * В зависимости от настроек, выполняет запись объекта во внешнюю базу данных
	 *
	 * @method save
	 * @for DataObj
	 * @param [post] {Boolean|undefined} - проведение или отмена проведения или просто запись
	 * @param [operational] {Boolean} - режим проведения документа (Оперативный, Неоперативный)
	 * @param [attachments] {Array} - массив вложений
	 * @return {Promise.<DataObj>} - промис с результатом выполнения операции
	 * @async
	 */
	save: {
		value: function (post, operational, attachments) {

			if(this instanceof DocObj && typeof post == "boolean"){
				this.posted = post;
			}

			var saver,
				
				before_save_res = this._manager.handle_event(this, "before_save"),
				
				reset_modified = function () {

					if(before_save_res !== false)
						this._data._modified = false;

					saver = null;
					before_save_res = null;
					reset_modified = null;
					
					return this;
				}.bind(this);

			// для объектов с иерархией установим пустого родителя, если иной не указан
			if(this._metadata.hierarchical && !this._obj.parent)
				this._obj.parent = $p.utils.blank.guid;

			// для справочников, требующих код и пустым кодом, присваиваем код
			if(!this.id && this._metadata.code_length && this._manager.cachable != "ram"){

				var prefix = (($p.current_acl && $p.current_acl.prefix) || "") + ($p.wsql.get_user_param("zone") + "-"),
					code_length = this._metadata.code_length - prefix.length,
					part = "",
					res = $p.wsql.alasql("select max(id) as id from ? where id like '" + prefix + "%'", [this._manager.alatable]);

				// TODO: вынести установку кода в отдельную функцию

				if(res.length){
					var num0 = res[0].id || "";
					for(var i = num0.length-1; i>0; i--){
						if(isNaN(parseInt(num0[i])))
							break;
						part = num0[i] + part;
					}
					part = (parseInt(part || 0) + 1).toFixed(0);
				}else{
					part = "1";
				}
				while (part.length < code_length)
					part = "0" + part;

				this.id = prefix + part;
			}

			// для документов, контролируем заполненность даты
			if(this instanceof DocObj && $p.utils.blank.date == this.date)
				this.date = new Date();

			// если не указаны обязательные реквизиты
			if($p.msg && $p.msg.show_msg){
				for(var mf in this._metadata.fields){
					if(this._metadata.fields[mf].mandatory && !this._obj[mf]){
						$p.msg.show_msg({
							title: $p.msg.mandatory_title,
							type: "alert-error",
							text: $p.msg.mandatory_field.replace("%1", this._metadata.fields[mf].synonym)
						});
						before_save_res = false;
						return Promise.reject(reset_modified());
					}
				}	
			}

			// если процедуры перед записью завершились неудачно или запись выполнена нестандартным способом - не продолжаем
			if(before_save_res === false)
				return Promise.resolve(this).then(reset_modified);

			// если пользовательский обработчик перед записью вернул промис, его и возвращаем
			else if(before_save_res instanceof Promise || typeof before_save_res === "object" && before_save_res.then)
				return before_save_res.then(reset_modified);

			
			// в зависимости от типа кеширования, получаем saver
			if(this._manager.cachable && this._manager.cachable != "e1cib"){
				saver = $p.wsql.pouch.save_obj;

			} else {
				// запрос к серверу 1C по сети
				saver = _rest.save_irest;

			}

			// Сохраняем во внешней базе
			return saver(
				this, {
					post: post,
					operational: operational,
					attachments: attachments
				})
			// и выполняем обработку после записи
				.then(function (obj) {
					return obj._manager.handle_event(obj, "after_save");
				})
				.then(reset_modified);
		}
	},

	/**
	 * ### Возвращает присоединенный объект или файл
	 * @method get_attachment
	 * @for DataObj
	 * @param att_id {String} - идентификатор (имя) вложения
	 */
	get_attachment: {
		value: function (att_id) {
			return this._manager.get_attachment(this.ref, att_id);
		}
	},

	/**
	 * ### Сохраняет объект или файл во вложении
	 * Вызывает {{#crossLink "DataManager/save_attachment:method"}} одноименный метод менеджера {{/crossLink}} и передаёт ссылку на себя в качестве контекста
	 * 
	 * @method save_attachment
	 * @for DataObj
	 * @param att_id {String} - идентификатор (имя) вложения
	 * @param attachment {Blob|String} - вложениe
	 * @param [type] {String} - mime тип
	 * @return Promise.<DataObj>
	 * @async
	 */
	save_attachment: {
		value: function (att_id, attachment, type) {
			return this._manager.save_attachment(this.ref, att_id, attachment, type);
		}
	},

	/**
	 * ### Удаляет присоединенный объект или файл
	 * Вызывает одноименный метод менеджера и передаёт ссылку на себя в качестве контекста
	 * 
	 * @method delete_attachment
	 * @for DataObj
	 * @param att_id {String} - идентификатор (имя) вложения
	 * @async
	 */
	delete_attachment: {
		value: function (att_id) {
			return this._manager.get_attachment(this.ref, att_id);
		}
	},

	/**
	 * ### Включает тихий режим
	 * Режим, при котором объект не информирует мир об изменениях своих свойств.<br />
	 * Полезно, например, при групповых изменениях, чтобы следящие за объектом формы не тратили время на перерисовку при изменении каждого совйтсва
	 *
	 * @method _silent
	 * @for DataObj
	 * @param [v] {Boolean}
	 */
	_silent: {
		value: function (v) {
			if(typeof v == "boolean")
				this._data._silent = v;
			else{
				this._data._silent = true;
				setTimeout(function () {
					this._data._silent = false;	
				}.bind(this));
			}			
		}
	},

	/**
	 * ### Выполняет команду печати
	 * Вызывает одноименный метод менеджера и передаёт себя в качестве объекта печати
	 *
	 * @method print
	 * @for DataObj
	 * @param model {String} - идентификатор макета печатной формы
	 * @param [wnd] - указатель на форму, из которой произведён вызов команды печати
	 * @return {*|{value}|void}
	 * @async
	 */
	print: {
		value: function (model, wnd) {
			return this._manager.print(this, model, wnd);
		}
	}
	
});


/**
 * ### Абстрактный класс СправочникОбъект
 * @class CatObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
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

			if(this.name || this.id){
				// return this._metadata.obj_presentation || this._metadata.synonym + " " + this.name || this.id;
				return this.name || this.id || this._metadata.obj_presentation || this._metadata.synonym;
			}else
				return _presentation;

		},
		set : function(v){
			if(v)
				_presentation = String(v);
		}
	});

	if(attr && typeof attr == "object"){
		if(attr._not_set_loaded){
			delete attr._not_set_loaded;
			this._mixin(attr);
		}else{
			this._mixin(attr);
			if(!$p.utils.is_empty_guid(this.ref) && (attr.id || attr.name))
				this._set_loaded(this.ref);
		}
	}

	attr = null;

}
CatObj._extend(DataObj);

/**
 * ### Код элемента справочника
 * @property id
 * @type String|Number
 */
CatObj.prototype.__define('id', {
	get : function(){ return this._obj.id || ""},
	set : function(v){
		this.__notify('id');
		this._obj.id = v;
	},
	enumerable: true
});

/**
 * ### Наименование элемента справочника
 * @property name
 * @type String
 */
CatObj.prototype.__define('name', {
	get : function(){ return this._obj.name || ""},
	set : function(v){
		this.__notify('name');
		this._obj.name = String(v);
	},
	enumerable: true
});


/**
 * ### Абстрактный класс ДокументОбъект
 * @class DocObj
 * @extends DataObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {RefDataManager}
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

			if(this.number_doc)
				return (this._metadata.obj_presentation || this._metadata.synonym) + ' №' + this.number_doc + " от " + $p.moment(this.date).format($p.moment._masks.ldt);
			else
				return _presentation;

		},
		set : function(v){
			if(v)
				_presentation = String(v);
		}
	});

	if(attr && typeof attr == "object")
		this._mixin(attr);

	if(!$p.utils.is_empty_guid(this.ref) && attr.number_doc)
		this._set_loaded(this.ref);

	attr = null;
}
DocObj._extend(DataObj);

function doc_props_date_number(proto){
	proto.__define({

		/**
		 * Номер документа
		 * @property number_doc
		 * @type {String|Number}
		 */
		number_doc: {
			get : function(){ return this._obj.number_doc || ""},
			set : function(v){
				this.__notify('number_doc');
				this._obj.number_doc = v;
			},
			enumerable: true
		},

		/**
		 * Дата документа
		 * @property date
		 * @type {Date}
		 */
		date: {
			get : function(){ return this._obj.date || $p.utils.blank.date},
			set : function(v){
				this.__notify('date');
				this._obj.date = $p.utils.fix_date(v, true);
			},
			enumerable: true
		}
	});
}

DocObj.prototype.__define({

	/**
	 * Признак проведения
	 * @property posted
	 * @type {Boolean}
	 */
	posted: {
		get : function(){ return this._obj.posted || false},
		set : function(v){
			this.__notify('posted');
			this._obj.posted = $p.utils.fix_boolean(v);
		},
		enumerable: true
	}

});
doc_props_date_number(DocObj.prototype);


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
		attr[f] = $p.utils.fetch_type("", cmd.fields[f].type);
	for(f in cmd["tabular_sections"])
		attr[f] = [];

	this._mixin(attr);

}
DataProcessorObj._extend(DataObj);


/**
 * ### Абстрактный класс ЗадачаОбъект
 * @class TaskObj
 * @extends CatObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {DataManager}
 */
function TaskObj(attr, manager) {

	// выполняем конструктор родительского объекта
	TaskObj.superclass.constructor.call(this, attr, manager);


}
TaskObj._extend(CatObj);
doc_props_date_number(TaskObj.prototype);


/**
 * ### Абстрактный класс БизнесПроцессОбъект
 * @class BusinessProcessObj
 * @extends CatObj
 * @constructor
 * @param attr {Object} - объект с реквизитами в свойствах или строка guid ссылки
 * @param manager {DataManager}
 */
function BusinessProcessObj(attr, manager) {

	// выполняем конструктор родительского объекта
	BusinessProcessObj.superclass.constructor.call(this, attr, manager);


}
BusinessProcessObj._extend(CatObj);
doc_props_date_number(BusinessProcessObj.prototype);


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

EnumObj.prototype.__define({

	/**
	 * Порядок элемента перечисления
	 * @property order
	 * @for EnumObj
	 * @type Number
	 */
	order: {
		get : function(){ return this._obj.sequence},
		set : function(v){ this._obj.sequence = parseInt(v)},
		enumerable: true
	},

	/**
	 * Наименование элемента перечисления
	 * @property name
	 * @for EnumObj
	 * @type String
	 */
	name: {
		get : function(){ return this._obj.ref},
		set : function(v){ this._obj.ref = String(v)},
		enumerable: true
	},

	/**
	 * Синоним элемента перечисления
	 * @property synonym
	 * @for EnumObj
	 * @type String
	 */
	synonym: {
		get : function(){ return this._obj.synonym || ""},
		set : function(v){ this._obj.synonym = String(v)},
		enumerable: true
	},

	/**
	 * Представление объекта
	 * @property presentation
	 * @for EnumObj
	 * @type String
	 */
	presentation: {
		get : function(){
			return this.synonym || this.name;
		}
	},

	/**
	 * Проверяет, является ли ссылка объекта пустой
	 * @method empty
	 * @for EnumObj
	 * @return {boolean} - true, если ссылка пустая
	 */
	empty: {
		value: function(){
			return !this.ref || this.ref == "_";
		}
	}
});


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

	for(var check in manager.metadata().dimensions){
		if(!attr.hasOwnProperty(check) && attr.ref){
			var keys = attr.ref.split("¶");
			Object.keys(manager.metadata().dimensions).forEach(function (fld, ind) {
				this[fld] = keys[ind];
			}.bind(this));
			break;
		}
	}

}
RegisterRow._extend(DataObj);

RegisterRow.prototype.__define({

	/**
	 * Метаданные строки регистра
	 * @property _metadata
	 * @for RegisterRow
	 * @type Object
	 */
	_metadata: {
		get: function () {
			var _meta = this._manager.metadata();
			if (!_meta.fields)
				_meta.fields = ({})._mixin(_meta.dimensions)._mixin(_meta.resources)._mixin(_meta.attributes);
			return _meta;
		}
	},

	/**
	 * Ключ записи регистра
	 */
	ref: {
		get : function(){ 
			return this._manager.get_ref(this);
		},
		enumerable: true
	},

	presentation: {
		get: function () {
			return this._metadata.obj_presentation || this._metadata.synonym;
		}
	}
});


/**
 * Конструкторы табличных частей
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
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
 * @menuorder 21
 * @tooltip Табличная часть
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
 * @return {TabularSection}
 */
TabularSection.prototype.clear = function(silent){

	for(var i in this._obj)
		delete this._obj[i];
	this._obj.length = 0;

	if(!silent && !this._owner._data._silent)
		Object.getNotifier(this._owner).notify({
			type: 'rows',
			tabular: this._name
		});

	return this;
};

/**
 * Удаляет строку табличной части
 * @method del
 * @param val {Number|TabularSectionRow} - индекс или строка табчасти
 */
TabularSection.prototype.del = function(val, silent){
	
	var index, _obj = this._obj;
	
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

	_obj.forEach(function (row, index) {
		row.row = index + 1;
	});

	if(!silent && !this._owner._data._silent)
		Object.getNotifier(this._owner).notify({
			type: 'rows',
			tabular: this._name
		});

	this._owner._data._modified = true;
};

/**
 * Находит первую строку, содержащую значение
 * @method find
 * @param val {*} - значение для поиска
 * @param columns {String|Array} - колонки, в которых искать
 * @return {TabularSectionRow}
 */
TabularSection.prototype.find = function(val, columns){
	var res = $p._find(this._obj, val, columns);
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

	if(!this._owner._data._silent)
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
TabularSection.prototype.add = function(attr, silent){

	var row = new $p[this._owner._manager.obj_constructor(this._name)](this);

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

	if(!silent && !this._owner._data._silent)
		Object.getNotifier(this._owner).notify({
			type: 'rows',
			tabular: this._name
		});

	attr = null;
	
	this._owner._data._modified = true;
	
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
 * Псевдоним для each
 * @type {TabularSection.each|*}
 */
TabularSection.prototype.forEach = TabularSection.prototype.each;

/**
 * Сворачивает табличную часть
 * @param [dimensions] {Array|String}
 * @param [resources] {Array|String}
 */
TabularSection.prototype.group_by = function (dimensions, resources) {

	try{
		var res = this.aggregate(dimensions, resources, "SUM", true);
		return this.clear(true).load(res);

	}catch(err){}
};

/**
 * Сортирует табличную часть
 * @param fields {Array|String}
 */
TabularSection.prototype.sort = function (fields) {

	if(typeof fields == "string")
		fields = fields.split(",");

	var sql = "select * from ? order by ", res = true;
	fields.forEach(function (f) {
		f = f.trim().replace(/\s{1,}/g," ").split(" ");
		if(res)
			res = false;
		else
			sql += ", ";
		sql += "`" + f[0] + "`";
		if(f[1])
			sql += " " + f[1];
	});

	try{
		res = $p.wsql.alasql(sql, [this._obj]);
		return this.clear(true).load(res);

	}catch(err){
		$p.record_log(err);
	}
};

/**
 * Вычисляет агрегатную функцию по табличной части. Не изменяет исходный объект
 * @param [dimensions] {Array|String}
 * @param [resources] {Array|String}
 * @param [aggr] {String} = SUM, COUNT, MIN, MAX, FIRST, LAST, AVG, AGGR, ARRAY, REDUCE
 * @return {*}
 */
TabularSection.prototype.aggregate = function (dimensions, resources, aggr, ret_array) {

	if(typeof dimensions == "string")
		dimensions = dimensions.split(",");
	if(typeof resources == "string")
		resources = resources.split(",");
	if(!aggr)
		aggr = "sum";

	// для простых агрегатных функций, sql не используем
	if(!dimensions.length && resources.length == 1 && aggr == "sum"){
		return this._obj.reduce(function(sum, row, index, array) {
			return sum + row[resources[0]];
		}, 0);
	}

	var sql, res = true;

	resources.forEach(function (f) {
		if(!sql)
			sql = "select " + aggr + "(`" + f + "`) `" + f + "`";
		else
			sql += ", " + aggr + "(`" + f + "`) `" + f + "`";
	});
	dimensions.forEach(function (f) {
		if(!sql)
			sql = "select `" + f + "`";
		else
			sql += ", `" + f + "`";
	});
	sql += " from ? ";
	dimensions.forEach(function (f) {
		if(res){
			sql += "group by ";
			res = false;
		}
		else
			sql += ", ";
		sql += "`" + f + "`";
	});

	try{
		res = $p.wsql.alasql(sql, [this._obj]);
		if(!ret_array){
			if(resources.length == 1)
				res = res.length ? res[0][resources[0]] : 0;
			else
				res = res.length ? res[0] : {};
		}
		return res;

	}catch(err){
		$p.record_log(err);
	}
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

	if(!this._owner._data._silent)
		Object.getNotifier(t._owner).notify({
			type: 'rows',
			tabular: t._name
		});

	return t;
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
			if($p.utils.is_data_obj(r[f]))
				data.push(r[f].presentation);
			else
				data.push(r[f]);
		});
		grid_data.rows.push({ id: r.row, data: data });
	});
	if(grid.objBox){
		try{
			grid.parse(grid_data, "json");
			grid.callEvent("onGridReconstructed", []);
		} catch (e){}
	}
};

TabularSection.prototype.toJSON = function () {
	return this._obj;
};


/**
 * ### Aбстрактная строка табличной части
 * 
 * @class TabularSectionRow
 * @constructor
 * @param owner {TabularSection} - табличная часть, которой принадлежит строка
 * @menuorder 22
 * @tooltip Строка табчасти
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
		return new $p[this._owner._owner._manager.obj_constructor(this._owner._name)](this._owner)._mixin(this._obj);
	},
	enumerable : false
});

TabularSectionRow.prototype._getter = DataObj.prototype._getter;

TabularSectionRow.prototype._setter = function (f, v) {

	if(this._obj[f] == v || (!v && this._obj[f] == $p.utils.blank.guid))
		return;

	if(!this._owner._owner._data._silent)
		Object.getNotifier(this._owner._owner).notify({
			type: 'row',
			row: this,
			tabular: this._owner._name,
			name: f,
			oldValue: this._obj[f]
		});

	// учтём связь по типу
	if(this._metadata.fields[f].choice_type){
		var prop;
		if(this._metadata.fields[f].choice_type.path.length == 2)
			prop = this[this._metadata.fields[f].choice_type.path[1]];
		else
			prop = this._owner._owner[this._metadata.fields[f].choice_type.path[0]];
		if(prop && prop.type)
			v = $p.utils.fetch_type(v, prop.type);
	}

	DataObj.prototype.__setter.call(this, f, v);
	this._owner._owner._data._modified = true;

};


/**
 * Дополняет классы {{#crossLink "DataObj"}}{{/crossLink}} и {{#crossLink "DataManager"}}{{/crossLink}} методами чтения,<br />
 * записи и синхронизации через стандартный интерфейс <a href="http://its.1c.ru/db/v83doc#bookmark:dev:TI000001362">OData</a>
 * /a/unf/odata/standard.odata
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  metadata
 * @submodule rest
 * @requires common
 */

/**
 * ### Методы общего назначения для работы с rest
 * 
 * @class Rest
 * @static
 * @menuorder 35
 * @tooltip Работа с rest 1С
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
		var res = fld + " gt datetime'" + $p.moment(dfrom).format($p.moment._masks.iso) + "'";
		if(dtill)
			res += " and " + fld + " lt datetime'" + $p.moment(dtill).format($p.moment._masks.iso) + "'";
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
			cm = mgr.metadata(),
			mf = cm.fields,
			mts = cm.tabular_sections,
			ts, f, tf, row, syn, synts, vmgr;

		if(mgr instanceof RefDataManager){
			if(rdata.hasOwnProperty("DeletionMark"))
				o._deleted = rdata.DeletionMark;

			if(rdata.hasOwnProperty("DataVersion"))
				;
			if(rdata.hasOwnProperty("Ref_Key"))
				o.ref = rdata.Ref_Key;

		}else{
			mf = ({})._mixin(cm.dimensions)._mixin(cm.resources)._mixin(cm.attributes);
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
			if(cm.main_presentation_name){
				if(rdata.hasOwnProperty("Description"))
					o.name = rdata.Description;
				else if(rdata.hasOwnProperty("name"))
					o.name = rdata.name;
			}

			if(cm.code_length){
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
	 * @return {Promise.<DataObj>} - промис с загруженным объектом
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
	get : function(){
		var fp = this.class_name.split("."),
			csyn = {
				cat: "Catalog",
				doc: "Document",
				ireg: "InformationRegister",
				areg: "AccumulationRegister",
				cch: "ChartOfCharacteristicTypes",
				cacc: "ChartOfAccounts",
				tsk: "Task",
				bp: "BusinessProcess"
			};
		return csyn[fp[0]] + "_" + _md.syns_1с(fp[1]);
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
					_deleted: ro["DeletionMark"],
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

		}else if(t instanceof TaskManager){
			flds.push("name as presentation");
			flds.push("date");
			flds.push("number_doc");
			flds.push("completed");

		}else if(t instanceof BusinessProcessManager){
			flds.push("date");
			flds.push("number_doc");
			flds.push("started");
			flds.push("finished");

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
		flds.push("_deleted");

		return s;

	})();


	$p.ajax.default_attr(attr, (!cmd.irest && $p.job_prm.rest) ? $p.job_prm.rest_url() : $p.job_prm.irest_url());
	attr.url += (cmd.irest && cmd.irest.selection ? cmd.irest.selection : this.rest_name) + "?allowedOnly=true&$format=json&$top=1000&" + select;

	if(_md.get(t.class_name, "date") && (attr.date_from || attr.date_till)){
		attr.url += "&$filter=" + _rest.filter_date("Date", attr.date_from, attr.date_till);
		filter_added = true;
	}

	if(cmd["hierarchical"] && attr.parent){
		attr.url += filter_added ? " and " : "&$filter=";
		attr.url += "Parent_Key eq guid'" + attr.parent + "'";
		filter_added = true;
	}

	if(cmd["has_owners"] && attr.owner){
		attr.url += filter_added ? " and " : "&$filter=";
		attr.url += "Owner_Key eq guid'" + attr.owner + "'";
		filter_added = true;
	}

	if(attr.filter){
		attr.url += filter_added ? " and " : "&$filter=";
		attr.url += "$filter eq '" + attr.filter + "'";
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
					if(mf){
						if(syn.indexOf("_Key") == -1 && mf.type.is_ref && mf.type.types.length && mf.type.types[0].indexOf("enm.")==-1)
							syn += "_Key";

						if(mf.type.date_part)
							o[fldsyn] = $p.moment(ro[syn]).format($p.moment._masks[mf.type.date_part]);

						else if(mf.type.is_ref){
							if(!ro[syn] || ro[syn] == $p.utils.blank.guid)
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
					}
				});
				ares.push(o);
			}
			return $p.iface.data_to_grid.call(t, ares, attr);
		});

};

InfoRegManager.prototype.rest_slice_last = function(selection){

	if(!selection.period)
		selection.period = $p.utils.date_add_day(new Date(), 1);

	var t = this,
		cmd = t.metadata(),
		period = "Period=datetime'" + $p.moment(selection.period).format($p.moment._masks.iso) + "'",
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
				condition+= syn+" eq "+$p.utils.fix_number(selection[fld]);

			else if(mf.type.date_part)
				condition+= syn+" eq datetime'"+ $p.moment(selection[fld]).format($p.moment._masks.iso) +"'";

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
		.replace('%d', $p.moment().format($p.moment.defaultFormatUtc)),

		prop = '\n<d:Ref_Key>' + this.ref + '</d:Ref_Key>' +
			'\n<d:DeletionMark>' + this._deleted + '</d:DeletionMark>',
			// '\n<d:DataVersion>' + this.data_version + '</d:DataVersion>',

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
					v = $p.moment(v).format($p.moment.defaultFormatUtc);

			}else if(v == undefined)
				continue;


			prop+= prefix + pname + '>' + v + '</d:' + pname + '>';
		}
	}

	if(this instanceof DocObj){
		prop+= '\n<d:Date>' + $p.moment(this.date).format($p.moment.defaultFormatUtc) + '</d:Date>';
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
 * Дополняет классы {{#crossLink "DataObj"}}{{/crossLink}} и {{#crossLink "DataManager"}}{{/crossLink}} методами чтения,<br />
 * записи и синхронизации с базами PouchDB
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  metadata
 * @submodule meta_pouchdb
 * @requires common
 */



DataManager.prototype.__define({

	/**
	 * Загружает объекты из PouchDB по массиву ссылок
	 */
	pouch_load_array: {
		value: function (refs, with_attachments) {

			var options = {
				limit : refs.length + 1,
				include_docs: true,
				keys: refs.map(function (v) {
					return this.class_name + "|" + v;
				}.bind(this))
			};
			if(with_attachments){
				options.attachments = true;
				options.binary = true;
			}

			return this.pouch_db.allDocs(options)
				.then(function (result) {
					return $p.wsql.pouch.load_changes(result, {});
				})
		}
	},

	/**
	 * Загружает объекты из PouchDB, обрезанные по view
	 */
	pouch_load_view: {
		value: function (_view) {

			var t = this, doc, res = [],
				options = {
					limit : 1000,
					include_docs: true,
					startkey: t.class_name + "|",
					endkey: t.class_name + '|\uffff'
				};

			return new Promise(function(resolve, reject){

				function process_docs(err, result) {

					if (result) {

						if (result.rows.length){

							options.startkey = result.rows[result.rows.length - 1].key;
							options.skip = 1;

							result.rows.forEach(function (rev) {
								doc = rev.doc;
								key = doc._id.split("|");
								doc.ref = key[1];
								// наполняем
								res.push(doc);
							});

							t.load_array(res);
							res.length = 0;
							
							t.pouch_db.query(_view, options, process_docs);

						}else{
							resolve();
						}

					} else if(err){
						reject(err);
					}
				}

				t.pouch_db.query(_view, options, process_docs);

			});
		}
	},

	/**
	 * Возвращает базу PouchDB, связанную с объектами данного менеджера
	 * @property pouch_db
	 * @for DataManager
	 */
	pouch_db: {
		get: function () {
			if(this.cachable.indexOf("_remote") != -1)
				return $p.wsql.pouch.remote[this.cachable.replace("_remote", "")];
			else
				return $p.wsql.pouch.local[this.cachable] || $p.wsql.pouch.remote[this.cachable];
		}
	},

	/**
	 * ### Найти строки
	 * Возвращает массив дата-объектов, обрезанный отбором _selection_<br />
	 * Eсли отбор пустой, возвращаются все строки из PouchDB.
	 *
	 * @method pouch_find_rows
	 * @for DataManager
	 * @param selection {Object|function} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"} или {not: значение}
	 * @param [selection._top] {Number}
	 * @param [selection._skip] {Number}
	 * @param [selection._raw] {Boolean} - если _истина_, возвращаются сырые данные, а не дата-объекты
	 * @param [selection._total_count] {Boolean} - если _истина_, вычисляет общее число записей под фильтром, без учета _skip и _top
	 * @return {Promise.<Array>}
	 */
	pouch_find_rows: {
		value: function (selection) {

			var t = this, doc, res = [],
				_raw, _view, _total_count, top, calc_count,
				top_count = 0, skip = 0, skip_count = 0,
				options = {
					limit : 100,
					include_docs: true,
					startkey: t.class_name + "|",
					endkey: t.class_name + '|\uffff'
				};

			

			if(selection){

				if(selection._top){
					top = selection._top;
					delete selection._top;
				}else
					top = 300;

				if(selection._raw) {
					_raw = selection._raw;
					delete selection._raw;
				}

				if(selection._total_count) {
					_total_count = selection._total_count;
					delete selection._total_count;
				}

				if(selection._view) {
					_view = selection._view;
					delete selection._view;
				}
				
				if(selection._key) {

					if(selection._key._order_by == "des"){
						options.startkey = selection._key.endkey || selection._key + '\uffff';
						options.endkey = selection._key.startkey || selection._key;
						options.descending = true;
					}else{
						options.startkey = selection._key.startkey || selection._key;
						options.endkey = selection._key.endkey || selection._key + '\uffff';
					}
				}

				if(typeof selection._skip == "number") {
					skip = selection._skip;
					delete selection._skip;
				}
				
				if(selection._attachments) {
					options.attachments = true;
					options.binary = true;
					delete selection._attachments;
				}




			}

			// если сказано посчитать все строки...
			if(_total_count){

				calc_count = true;
				_total_count = 0;

				// если нет фильтра по строке или фильтр растворён в ключе
				if(Object.keys(selection).length <= 1){

					// если фильтр в ключе, получаем все строки без документов
					if(selection._key && selection._key.hasOwnProperty("_search")){
						options.include_docs = false;
						options.limit = 100000;

						return t.pouch_db.query(_view, options)
							.then(function (result) {

								result.rows.forEach(function (row) {

									// фильтруем
									if(!selection._key._search || row.key[row.key.length-1].toLowerCase().indexOf(selection._key._search) != -1){

										_total_count++;

										// пропукскаем лишние (skip) элементы
										if(skip) {
											skip_count++;
											if (skip_count < skip)
												return;
										}

										// ограничиваем кол-во возвращаемых элементов
										if(top) {
											top_count++;
											if (top_count > top)
												return;
										}

										res.push(row.id);
									}
								});

								delete options.startkey;
								delete options.endkey;
								if(options.descending)
									delete options.descending;
								options.keys = res;
								options.include_docs = true;

								return t.pouch_db.allDocs(options);

							})
							.then(function (result) {
								return {
									rows: result.rows.map(function (row) {

										var doc = row.doc;

										doc.ref = doc._id.split("|")[1];

										if(!_raw){
											delete doc._id;
											delete doc._rev;
										}

										return doc;
									}),
									_total_count: _total_count
								};
							})
					}
					
				}
				
			}

			// бежим по всем документам из ram
			return new Promise(function(resolve, reject){

				function process_docs(err, result) {

					if (result) {

						if (result.rows.length){

							options.startkey = result.rows[result.rows.length - 1].key;
							options.skip = 1;

							result.rows.forEach(function (rev) {
								doc = rev.doc;

								key = doc._id.split("|");
								doc.ref = key[1];

								if(!_raw){
									delete doc._id;
									delete doc._rev;
								}

								// фильтруем
								if(!$p._selection.call(t, doc, selection))
									return;

								if(calc_count)
									_total_count++;
								
								// пропукскаем лишние (skip) элементы
								if(skip) {
									skip_count++;
									if (skip_count < skip)
										return;
								}

								// ограничиваем кол-во возвращаемых элементов
								if(top) {
									top_count++;
									if (top_count > top)
										return;
								}

								// наполняем
								res.push(doc);
							});

							if(top && top_count > top && !calc_count) {
								resolve(_raw ? res : t.load_array(res));

							}else
								fetch_next_page();

						}else{
							if(calc_count){
								resolve({
									rows: _raw ? res : t.load_array(res),
									_total_count: _total_count
								});
							}else
								resolve(_raw ? res : t.load_array(res));
						}

					} else if(err){
						reject(err);
					}
				}

				function fetch_next_page() {

					if(_view)
						t.pouch_db.query(_view, options, process_docs);
						
					else
						t.pouch_db.allDocs(options, process_docs);
				}

				fetch_next_page();

			});


		}
	},

	/**
	 * ### Возвращает набор данных для динсписка
	 *
	 * @method pouch_selection
	 * @for DataManager
	 * @param attr
	 * @return {Promise.<Array>}
	 */
	pouch_selection: {
		value: function (attr) {

			var t = this,
				cmd = attr.metadata || t.metadata(),
				flds = ["ref", "_deleted"], // поля запроса
				selection = {
					_raw: true,
					_total_count: true,
					_top: attr.count || 30,
					_skip: attr.start || 0
				},   // условие см. find_rows()
				ares = [], o, mf, fldsyn;
			
			// набираем поля
			if(cmd.form && cmd.form.selection){
				cmd.form.selection.fields.forEach(function (fld) {
					flds.push(fld);
				});

			}else if(t instanceof DocManager){
				flds.push("posted");
				flds.push("date");
				flds.push("number_doc");

			}else if(t instanceof TaskManager){
				flds.push("name as presentation");
				flds.push("date");
				flds.push("number_doc");
				flds.push("completed");

			}else if(t instanceof BusinessProcessManager){
				flds.push("date");
				flds.push("number_doc");
				flds.push("started");
				flds.push("finished");

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

			// набираем условие
			// фильтр по дате
			if(_md.get(t.class_name, "date") && (attr.date_from || attr.date_till)){

				if(!attr.date_from)
					attr.date_from = new Date("2015-01-01");
				if(!attr.date_till)
					attr.date_till = $p.utils.date_add_day(new Date(), 1);

				selection.date = {between: [attr.date_from, attr.date_till]};

			}
			
			// фильтр по родителю
			if(cmd["hierarchical"] && attr.parent)
				selection.parent = attr.parent;

			// добавляем условия из attr.selection
			if(attr.selection){
				if(Array.isArray(attr.selection)){
					attr.selection.forEach(function (asel) {
						for(fldsyn in asel)
							if(fldsyn[0] != "_" || fldsyn == "_view" || fldsyn == "_key")
								selection[fldsyn] = asel[fldsyn];
					});
				}else
					for(fldsyn in attr.selection)
						if(fldsyn[0] != "_" || fldsyn == "_view" || fldsyn == "_key")
							selection[fldsyn] = attr.selection[fldsyn];
			}

			// прибиваем фильтр по дате, если он встроен в ключ
			if(selection._key && selection._key._drop_date && selection.date) {
				delete selection.date;
			}

			// строковый фильтр по полям поиска, если он не описан в ключе
			if(attr.filter && (!selection._key || !selection._key._search)) {
				if(cmd.input_by_string.length == 1)
					selection[cmd.input_by_string] = {like: attr.filter};
				else{
					selection.or = [];
					cmd.input_by_string.forEach(function (ifld) {
						var flt = {};
						flt[ifld] = {like: attr.filter};
						selection.or.push(flt);
					});
				}	
			}

			// обратная сортировка по ключу, если есть признак сортировки в ключе и 'des' в атрибутах
			if(selection._key && selection._key._order_by){
				selection._key._order_by = attr.direction;
			}
			
			// фильтр по владельцу
			//if(cmd["has_owners"] && attr.owner)
			//	selection.owner = attr.owner;

			return t.pouch_find_rows(selection)
				.then(function (rows) {
					
					if(rows.hasOwnProperty("_total_count") && rows.hasOwnProperty("rows")){
						attr._total_count = rows._total_count;
						rows = rows.rows
					}

					rows.forEach(function (doc) {

						// наполняем
						o = {};
						flds.forEach(function (fld) {

							if(fld == "ref") {
								o[fld] = doc[fld];
								return;
							}else if(fld.indexOf(" as ") != -1){
								fldsyn = fld.split(" as ")[1];
								fld = fld.split(" as ")[0].split(".");
								fld = fld[fld.length-1];
							}else
								fldsyn = fld;

							mf = _md.get(t.class_name, fld);
							if(mf){

								if(mf.type.date_part)
									o[fldsyn] = $p.moment(doc[fld]).format($p.moment._masks[mf.type.date_part]);

								else if(mf.type.is_ref){
									if(!doc[fld] || doc[fld] == $p.utils.blank.guid)
										o[fldsyn] = "";
									else{
										var mgr	= _md.value_mgr(o, fld, mf.type, false, doc[fld]);
										if(mgr)
											o[fldsyn] = mgr.get(doc[fld]).presentation;
										else
											o[fldsyn] = "";
									}
								}else if(typeof doc[fld] === "number" && mf.type.fraction_figits)
									o[fldsyn] = doc[fld].toFixed(mf.type.fraction_figits);

								else
									o[fldsyn] = doc[fld];
							}
						});
						ares.push(o);
					});

					return $p.iface.data_to_grid.call(t, ares, attr);
				})
				.catch($p.record_log);

		}
	},

	/**
	 * ### Возвращает набор данных для дерева динсписка
	 *
	 * @method pouch_tree
	 * @for DataManager
	 * @param attr
	 * @return {Promise.<Array>}
	 */
	pouch_tree: {
		value: function (attr) {

			return this.pouch_find_rows({
				is_folder: true,
				_raw: true,
				_top: attr.count || 300,
				_skip: attr.start || 0
			})
				.then(function (rows) {
					rows.sort(function (a, b) {
						if (a.parent == $p.utils.blank.guid && b.parent != $p.utils.blank.guid)
							return -1;
						if (b.parent == $p.utils.blank.guid && a.parent != $p.utils.blank.guid)
							return 1;
						if (a.name < b.name)
							return -1;
						if (a.name > b.name)
							return 1;
						return 0;
					});
					return rows.map(function (row) {
						return {
							ref: row.ref,
							parent: row.parent,
							presentation: row.name
						}
					});
				})
				.then($p.iface.data_to_tree);
		}
	},

	/**
	 * ### Сохраняет присоединенный файл
	 *
	 * @method save_attachment
	 * @for DataManager
	 * @param ref
	 * @param att_id
	 * @param attachment
	 * @param type
	 * @return {Promise}
	 * @async
	 */
	save_attachment: {
		value: function (ref, att_id, attachment, type) {

			if(!type)
				type = {type: "text/plain"};

			if(!(attachment instanceof Blob) && type.indexOf("text") == -1)
				attachment = new Blob([attachment], {type: type});

			// получаем ревизию документа
			var _rev,
				db = this.pouch_db;
			ref = this.class_name + "|" + $p.utils.fix_guid(ref);

			return db.get(ref)
				.then(function (res) {
					if(res)
						_rev = res._rev;
				})
				.catch(function (err) {
					if(err.status != 404)
						throw err;
				})
				.then(function () {
					return db.putAttachment(ref, att_id, _rev, attachment, type);
				});

		}
	},

	/**
	 * Получает присоединенный к объекту файл
	 * @param ref
	 * @param att_id
	 * @return {Promise}
	 */
	get_attachment: {
		value: function (ref, att_id) {

			return this.pouch_db.getAttachment(this.class_name + "|" + $p.utils.fix_guid(ref), att_id);

		}
	},

	/**
	 * Удаляет присоединенный к объекту файл
	 * @param ref
	 * @param att_id
	 * @return {Promise}
	 */
	delete_attachment: {
		value: function (ref, att_id) {

			// получаем ревизию документа
			var _rev,
				db = this.pouch_db;
			ref = this.class_name + "|" + $p.utils.fix_guid(ref);

			return db.get(ref)
				.then(function (res) {
					if(res)
						_rev = res._rev;
				})
				.catch(function (err) {
					if(err.status != 404)
						throw err;
				})
				.then(function () {
					return db.removeAttachment(ref, att_id, _rev);
				});
		}
	}

});

DocObj.prototype.__define({
	
	/**
	 * Устанавливает новый номер документа
	 */
	new_number_doc: {

		value: function () {

			var obj = this,
				prefix = (($p.current_acl && $p.current_acl.prefix) || "") +
					(obj.organization && obj.organization.prefix ? obj.organization.prefix : ($p.wsql.get_user_param("zone") + "-")),
				code_length = obj._metadata.code_length - prefix.length,
				part = "";

			return obj._manager.pouch_db.query("doc/number_doc",
				{
					limit : 1,
					include_docs: false,
					startkey: [obj._manager.class_name, prefix + '\uffff'],
					endkey: [obj._manager.class_name, prefix],
					descending: true
				})
				.then(function (res) {
					if(res.rows.length){
						var num0 = res.rows[0].key[1];
						for(var i = num0.length-1; i>0; i--){
							if(isNaN(parseInt(num0[i])))
								break;
							part = num0[i] + part;
						}
						part = (parseInt(part || 0) + 1).toFixed(0);
					}else{
						part = "1";
					}
					while (part.length < code_length)
						part = "0" + part;
					obj.number_doc = prefix + part;

					return obj;
				});
		}
	}
});

/**
 * ### Кнопки авторизации и синхронизации
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  widgets
 * @submodule btn_auth_sync
 * @requires common
 */

/**
 * ### Невизуальный компонент для управления кнопками авторизации и синхронизации на панелях инструментов
 * Изменяет текст, всплывающие подсказки и обработчики нажатий кнопок в зависимости от ...
 *
 * @class OBtnAuthSync
 * @constructor
 * @menuorder 57
 * @tooltip Кнопки авторизации
 */
$p.iface.OBtnAuthSync = function OBtnAuthSync() {

	var bars = [], spin_timer;

	//$(t.tb_nav.buttons.bell).addClass("disabledbutton");

	function btn_click(){

		if($p.wsql.pouch.authorized)
			dhtmlx.confirm({
				title: $p.msg.log_out_title,
				text: $p.msg.logged_in + $p.wsql.pouch.authorized + $p.msg.log_out_break,
				cancel: $p.msg.cancel,
				callback: function(btn) {
					if(btn){
						$p.wsql.pouch.log_out();
					}
				}
			});
		else
			$p.iface.frm_auth({
				modal_dialog: true
				//, try_auto: true
			});
	}

	function set_spin(spin){

		if(spin && spin_timer){
			clearTimeout(spin_timer);

		}else{
			bars.forEach(function (bar) {
				if(spin)
					bar.buttons.sync.innerHTML = '<i class="fa fa-refresh fa-spin md-fa-lg"></i>';
				else{
					if($p.wsql.pouch.authorized)
						bar.buttons.sync.innerHTML = '<i class="fa fa-refresh md-fa-lg"></i>';
					else
						bar.buttons.sync.innerHTML = '<i class="fa fa-ban md-fa-lg"></i>';
				}
			});
		}
		spin_timer = spin ? setTimeout(set_spin, 3000) : 0;
	}

	function set_auth(){

		bars.forEach(function (bar) {

			if($p.wsql.pouch.authorized){
				// bar.buttons.auth.title = $p.msg.logged_in + $p.wsql.pouch.authorized;
				// bar.buttons.auth.innerHTML = '<i class="fa fa-sign-out md-fa-lg"></i>';
				bar.buttons.auth.title = "Отключиться от сервера";
				bar.buttons.auth.innerHTML = '<span class="span_user">' + $p.wsql.pouch.authorized + '</span>';
				bar.buttons.sync.title = "Синхронизация выполняется...";
				bar.buttons.sync.innerHTML = '<i class="fa fa-refresh md-fa-lg"></i>';
			}else{
				bar.buttons.auth.title = "Войти на сервер и включить синхронизацию данных";
				bar.buttons.auth.innerHTML = '&nbsp;<i class="fa fa-sign-in md-fa-lg"></i><span class="span_user">Вход...</span>';
				bar.buttons.sync.title = "Синхронизация не выполняется - пользователь не авторизован на сервере";
				bar.buttons.sync.innerHTML = '<i class="fa fa-ban md-fa-lg"></i>';
					//'<i class="fa fa-refresh fa-stack-1x"></i>' +
					//'<i class="fa fa-ban fa-stack-2x text-danger"></i>' +
					//'</span>';
			}
		})
	}

	/**
	 * Привязывает обработчики к кнопке
	 * @param btn
	 */
	this.bind = function (bar) {
		bar.buttons.auth.onclick = btn_click;
		//bar.buttons.auth.onmouseover = null;
		//bar.buttons.auth.onmouseout = null;
		bar.buttons.sync.onclick = null;
		// bar.buttons.sync.onmouseover = sync_mouseover;
		// bar.buttons.sync.onmouseout = sync_mouseout;
		bars.push(bar);
		setTimeout(set_auth);
		return bar;
	};

	$p.on({
		pouch_load_data_start: function (page) {

			if(!$p.iface.sync)
				$p.iface.wnd_sync();
			$p.iface.sync.create($p.eve.stepper);
			$p.eve.stepper.frm_sync.setItemValue("text_bottom", "Читаем справочники");

			if(page.hasOwnProperty("local_rows") && page.local_rows < 10){
				$p.eve.stepper.wnd_sync.setText("Первый запуск - подготовка данных");
				$p.eve.stepper.frm_sync.setItemValue("text_processed", "Загрузка начального образа");
			}else{
				$p.eve.stepper.wnd_sync.setText("Загрузка данных из IndexedDB");
				$p.eve.stepper.frm_sync.setItemValue("text_processed", "Извлечение начального образа");
			}

			set_spin(true);
		},

		pouch_load_data_page: function (page) {
			set_spin(true);
			if($p.eve.stepper.wnd_sync){
				var docs_written = page.docs_written || page.page * page.limit;
				$p.eve.stepper.frm_sync.setItemValue("text_current", "Обработано элементов: " + docs_written + " из " + page.total_rows);
				$p.eve.stepper.frm_sync.setItemValue("text_bottom", "Текущий запрос: " + page.page + " (" + (100 * docs_written/page.total_rows).toFixed(0) + "%)");
			}
		},

		pouch_change: function (id, page) {
			set_spin(true);
		},

		pouch_load_data_loaded: function (page) {
			if($p.eve.stepper.wnd_sync){
				if(page.docs_written){
					$p.iface.sync.close();
					// setTimeout(function () {
					// 	$p.iface.sync.close();
					// 	$p.eve.redirect = true;
					// 	location.reload(true);
					// }, 2000);
				}else{
					$p.iface.sync.close();
				}
			}
		},

		pouch_load_data_error: function (err) {
			set_spin();
			if($p.eve.stepper.wnd_sync)
				$p.iface.sync.close();
		},

		log_in: function (username) {
			set_auth();
		},

		log_out: function () {
			set_auth();
		}
	});
};



/**
 * Расширение типов ячеек dhtmlXGrid
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
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

	return $p.iface.cancel_bubble(e);
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
	 * @return {boolean} - если "истина", значит объект был изменён
	 */
	t.detach=function(){
		if(t.combo){

			if(t.combo.getComboText){
				t.setValue(t.combo.getComboText());         // текст в элементе управления
				if(!t.combo.getSelectedValue())
					t.combo.callEvent("onChange");
				var res = !$p.utils.is_equal(t.val, t.getValue());// compares the new and the old values
				t.combo.unload();
				return res;

			} else if(t.combo.unload){
				t.combo.unload();
			}
		}
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
				password = $p.aes.Ctr.decrypt($p.ajax.password);
				
			}else{
				if($p.job_prm.guest_name){
					username = $p.job_prm.guest_name;
					password = $p.aes.Ctr.decrypt($p.job_prm.guest_pwd);
					
				}else{
					username = $p.wsql.get_user_param("user_name");
					password = $p.aes.Ctr.decrypt($p.wsql.get_user_param("user_pwd"));
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

/**
 * Проверяет, видна ли ячейка
 * TODO: учесть слой, модальность и т.д.
 */
dhtmlXCellObject.prototype.is_visible = function () {
	var rect = this.cell.getBoundingClientRect();
	return rect.right > 0 && rect.bottom > 0;
};


$p.iface.data_to_grid = function (data, attr){

	if(this.data_to_grid)
		return this.data_to_grid(data, attr);

	function cat_picture_class(r){
		var res;
		if(r.hasOwnProperty("posted")){
			res = r.posted ? "cell_doc_posted" : "cell_doc";
		}else{
			res = r.is_folder ? "cell_ref_folder" : "cell_ref_elm";
		}

		if(r._deleted)
			res = res + "_deleted";
		return res ;
	}

	function do_format(v){

		if(v instanceof Date){
			if(v.getHours() || v.getMinutes())
				return $p.moment(v).format($p.moment._masks.date_time);
			else
				return $p.moment(v).format($p.moment._masks.date);

		}else
			return typeof v == "number" ? v : $p.iface.normalize_xml(v || "");
	}

	var xml = "<?xml version='1.0' encoding='UTF-8'?><rows total_count='%1' pos='%2' set_parent='%3'>"
			.replace("%1", attr._total_count || data.length).replace("%2", attr.start)
			.replace("%3", attr.set_parent || "" ),
		caption = this.caption_flds(attr);

	// при первом обращении к методу добавляем описание колонок
	xml += caption.head;

	data.forEach(function(r){
		xml +=  "<row id=\"" + r.ref + "\"><cell class=\"" + cat_picture_class(r) + "\">" + do_format(r[caption.acols[0].id]) + "</cell>";
		for(var col=1; col < caption.acols.length; col++ )
			xml += "<cell>" + do_format(r[caption.acols[col].id]) + "</cell>";

		xml += "</row>";
	});

	return xml + "</rows>";
};

/**
 * Создаёт иерархический объект для построения dhtmlxTreeView
 * @param data
 * @return {*[]}
 */
$p.iface.data_to_tree = function (data) {

	var res = [{id: $p.utils.blank.guid, text: "..."}];

	function add_hierarchically(arr, row){
		var curr = {id: row.ref, text: row.presentation, items: []};
		arr.push(curr);
		$p._find_rows(data, {parent: row.ref}, function(r){
			add_hierarchically(curr.items, r);
		});
		if(!curr.items.length)
			delete curr.items;
	}
	$p._find_rows(data, {parent: $p.utils.blank.guid}, function(r){
		add_hierarchically(res, r);
	});

	return res;
};



/**
 * ### Визуальный компонент - гиперссылка с выпадающим списком для выбора значения
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  widgets
 * @submodule  wdg_dropdown_list
 * @requires common
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
 * @menuorder 57
 * @tooltip Гиперссылка со списком
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
		return $p.iface.cancel_bubble(e);
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
 * ### Динамическое дерево иерархического справочника
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * 
 * @module  widgets
 * @submodule wdg_dyn_tree
 * @requires common
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
 * @menuorder 54
 * @tooltip Дерево справочника
 */
dhtmlXCellObject.prototype.attachDynTree = function(mgr, filter, callback) {

	if(this.setCollapsedText)
		this.setCollapsedText("Дерево");

	if(!filter)
		filter = {is_folder: true};

	var tree = this.attachTreeView();

	// tree.setImagePath(dhtmlx.image_path + 'dhxtree' + dhtmlx.skin_suffix());
	// tree.setIconsPath(dhtmlx.image_path + 'dhxtree' + dhtmlx.skin_suffix());
	// if($p.job_prm.device_type == "desktop")
	// 	tree.enableKeyboardNavigation(true);

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

		mgr.sync_grid({
			action: "get_tree",
			filter: filter
		}, tree)
			.then(function (res) {
				if(callback)
					callback(res);
			});

	});

	return tree;
};
/**
 * ### Визуальный компонент OCombo
 * Поле с выпадающим списком + функция выбора из списка
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module widgets
 * @submodule wdg_ocombo
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
 * @param [attr.metadata] {Object} - описание метаданных поля. Если не указано, описание запрашивается у объекта
 * @param [attr.width] {Number} - если указано, фиксирует ширину элемента
 * @constructor
 * @menuorder 51
 * @tooltip Поле со списком
 */
function OCombo(attr){

	var _obj, _field, _meta, _mgr, _property, popup_focused,
		t = this,
		_pwnd = {
			on_select: attr.on_select || function (selv) {
				_obj[_field] = selv;
			}
		};

	// если нас открыли из окна,
	// которое может быть модальным - сохраняем указатель на метод модальности родительского окна
	if(attr.pwnd && attr.pwnd.setModal)
		_pwnd.setModal = attr.pwnd.setModal.bind(attr.pwnd);

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
		if(_obj && _field)
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

		// для связей параметров выбора, значение берём из объекта
		if(_meta.choice_links)
			_meta.choice_links.forEach(function (choice) {
				if(choice.name && choice.name[0] == "selection"){
					if(_obj instanceof TabularSectionRow){
						if(choice.path.length < 2)
							filter[choice.name[1]] = typeof choice.path[0] == "function" ? choice.path[0] : _obj._owner._owner[choice.path[0]];
						else
							filter[choice.name[1]] = _obj[choice.path[1]];
					}else
						filter[choice.name[1]] = typeof choice.path[0] == "function" ? choice.path[0] : _obj[choice.path[0]];
				}
			});

		// у параметров выбора, значение живёт внутри отбора
		if(_meta.choice_params)
			_meta.choice_params.forEach(function (choice) {
				
				var fval = Array.isArray(choice.path) ? {in: choice.path} : choice.path;

				if(!filter[choice.name])
					filter[choice.name] = fval;

				else if(Array.isArray(filter[choice.name]))
					filter[choice.name].push(fval);

				else{
					filter[choice.name] = [filter[choice.name]];
					filter[choice.name].push(fval);
				}
			});

		// если в метаданных указано строить список по локальным данным, подмешиваем эту информацию в фильтр
		if(_meta._option_list_local)
			filter._local = true;

		if(text)
			filter.presentation = {like: text};

		return filter;
	}

	// обработчики событий

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
						o.form_obj(attr.pwnd);
					});

		} else if(this.name == "open"){
			if(_obj && _obj[_field] && !_obj[_field].empty())
				_obj[_field].form_obj(attr.pwnd);

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
					}
					_mgr = null;
					tmgr = null;
					tmeta = null;
					tobj = null;
					tfield = null;
				});
		}

		if(e)
			return $p.iface.cancel_bubble(e);
	}

	function popup_hide(){
		popup_focused = false;
		setTimeout(function () {
			if(!popup_focused){
				if($p.iface.popup.p && $p.iface.popup.p.onmouseover)
					$p.iface.popup.p.onmouseover = null;
				if($p.iface.popup.p && $p.iface.popup.p.onmouseout)
					$p.iface.popup.p.onmouseout = null;
				$p.iface.popup.clear();
				$p.iface.popup.hide();
			}
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

	function oncontextmenu(e) {
		setTimeout(popup_show, 10);
		e.preventDefault();
		return false;
	}

	function onkeyup(e) {
		if(_mgr instanceof EnumManager)
			return;

		if(e.keyCode == 115){ // F4
			if(e.ctrlKey && e.shiftKey){
				if(!_obj[_field].empty())
					_obj[_field].form_obj(attr.pwnd);

			}else if(!e.ctrlKey && !e.shiftKey){
				if(_mgr)
					_mgr.form_selection(_pwnd, {
						initial_value: _obj[_field].ref,
						selection: [get_filter()]
					});
			}
			return $p.iface.cancel_bubble(e);
		}
	}

	function onfocus(e) {
		setTimeout(function () {
			if(t && t.getInput)
				t.getInput().select();
		}, 50);
	}

	t.getButton().addEventListener("mouseover", popup_show);

	t.getButton().addEventListener("mouseout", popup_hide);

	t.getBase().addEventListener("click", $p.iface.cancel_bubble);

	t.getBase().addEventListener("contextmenu", oncontextmenu);

	t.getInput().addEventListener("keyup", onkeyup);

	t.getInput().addEventListener("focus", onfocus);


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

		if(_obj){
			if(_obj instanceof TabularSectionRow)
				Object.unobserve(_obj._owner._owner, observer);
			else
				Object.unobserve(_obj, observer);
		}

		_obj = attr.obj;
		_field = attr.field;
		_property = attr.property;

		if(attr.metadata)
			_meta = attr.metadata;

		else if(_property){
			_meta = _obj._metadata.fields[_field]._clone();
			_meta.type = _property.type;

		}else
			_meta = _obj._metadata.fields[_field];

		t.clearAll();
		_mgr = _md.value_mgr(_obj, _field, _meta.type);

		if(_mgr || attr.get_option_list){
			// загружаем список в 30 строк
			(attr.get_option_list || _mgr.get_option_list).call(_mgr, _obj[_field], get_filter())
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

		t.getButton().removeEventListener("mouseover", popup_show);

		t.getButton().removeEventListener("mouseout", popup_hide);

		t.getBase().removeEventListener("click", $p.iface.cancel_bubble);

		t.getBase().removeEventListener("contextmenu", oncontextmenu);

		t.getInput().removeEventListener("keyup", onkeyup);

		t.getInput().removeEventListener("focus", onfocus);

		if(_obj){
			if(_obj instanceof TabularSectionRow)
				Object.unobserve(_obj._owner._owner, observer);
			else
				Object.unobserve(_obj, observer);
		}
		
		if(t.conf && t.conf.tm_confirm_blur)
			clearTimeout(t.conf.tm_confirm_blur);
		
		_obj = null;
		_field = null;
		_meta = null;
		_mgr = null;
		_pwnd = null;
		
		try{ _unload.call(t); }catch(e){}
	};

	// биндим поле объекта
	if(attr.obj && attr.field)
		this.attach(attr);
	// устанавливаем url фильтрации
	this.enableFilteringMode("between", "dummy", false, false);

	// свойство для единообразного доступа к значению
	this.__define({
		value: {
			get: function () {
				if(_obj)
					return _obj[_field];
			}
		}
	});

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
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module odaterangepicker
 * Created 02.08.2016
 */

function ODateRangePicker(container, attr) {

	var _cont = this._cont = document.createElement('div');

	if(container instanceof dhtmlXCellObject){
		container.appendObject(this._cont);
	}else{
		container.appendChild(this._cont);
	}

	this._cont.className = "odaterangepicker";
	this._cont.innerHTML = '<i class="fa fa-calendar"></i>&nbsp; <span></span> &nbsp;<i class="fa fa-caret-down"></i>';

	this.__define({

		set_text: {
			value: 	function() {
				$('span', _cont).html(this.date_from.format('DD MMM YY') + ' - ' + this.date_till.format('DD MMM YY'));
			}
		},

		on: {
			value: function (event, fn) {
				return $(_cont).on(event, fn);
			}
		},

		date_from: {
			get: function () {
				return $(_cont).data('daterangepicker').startDate;
			},
			set: function (v) {
				$(_cont).data('daterangepicker').setStartDate(v);
				this.set_text()
			}
		},

		date_till: {
			get: function () {
				return $(_cont).data('daterangepicker').endDate;
			},
			set: function (v) {
				$(_cont).data('daterangepicker').setEndDate(v);
				this.set_text()
			}
		}
	});

	$(_cont).daterangepicker({
		startDate: attr.date_from ? moment(attr.date_from) : moment().subtract(29, 'days'),
		endDate: moment(attr.date_till),
		showDropdowns: true,
		alwaysShowCalendars: true,
		opens: "left",
		ranges: {
			'Сегодня': [moment(), moment()],
			'Вчера': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
			'Последние 7 дней': [moment().subtract(6, 'days'), moment()],
			'Последние 30 дней': [moment().subtract(29, 'days'), moment()],
			'Этот месяц': [moment().startOf('month'), moment().endOf('month')],
			'Прошлый месяц': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		}
	}, this.set_text.bind(this));

	this.set_text();

}

$p.iface.ODateRangePicker = ODateRangePicker;
/**
 * ### Визуальный компонент - реквизиты шапки объекта
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  widgets
 * @submodule wdg_ohead_fields
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
 * @param [attr.metadata] {Object} - описание метаданных реквизитов. Если не указано, описание запрашивается у объекта
 * @constructor
 * @menuorder 52
 * @tooltip Редактор полей DataObj
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
		_grid = _cell.attachGrid(),
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
			if (!synced && _grid.clearAll && _tsname == change.tabular){
				synced = true;
				_grid.clearAll();
				_grid.parse(_mgr.get_property_grid_xml(_oxml, _obj, {
					title: attr.ts_title,
					ts: _tsname,
					selection: _selection,
					metadata: _meta
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
		if(pname || _grid && _grid.getSelectedRowId())
			return _pwnd.on_select(new_value);
	});
	_grid.attachEvent("onCheckbox", function(rId, cInd, state){
		if(_obj[rId] != undefined)
			return _pwnd.on_select(state, {obj: _obj, field: rId});
	});
	_grid.attachEvent("onKeyPress", function(code,cFlag,sFlag){

		switch(code) {
			case 13:    //  enter
			case 9:     //  tab
				if (_grid.editStop)
					_grid.editStop();
				break;

			case 46:    //  del
				break;
		};

	});
	if(attr.read_only){
		_grid.setEditable(false);
	}

	_grid.__define({

		selection: {
			get: function () {
				return _selection;
			},
			set: function (sel) {
				_selection = sel;
				this.reload;
			}
		},
		
		reload: {
			value: function () {
				observer_rows([{tabular: _tsname}]);
			}
		},

		get_cell_field: {
			value: function () {

				if(!_obj)
					return;

				var res = {row_id: _grid.getSelectedRowId()},
					fpath = res.row_id.split("|");

				if(fpath.length < 2)
					return {obj: _obj, field: fpath[0]}._mixin(_pwnd);
				else {
					var vr;
					if(_selection){
						_obj[fpath[0]].find_rows(_selection, function (row) {
							if(row.property == fpath[1] || row.param == fpath[1] || row.Свойство == fpath[1] || row.Параметр == fpath[1]){
								vr = row;
								return false;
							}
						});
					}else
						vr = _obj[fpath[0]].find(fpath[1]);
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
			},
			enumerable: false
		},

		_obj: {
			get: function () {
				return _obj;
			}
		},

		_owner_cell: {
			get: function () {
				return _cell;
			}
		},

		destructor: {
			value: function () {

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
			}
		},

		/**
		 * Подключает поле объекта к элементу управления<br />
		 * Параметры аналогичны конструктору
		 */
		attach: {
			value: function (attr) {

				if (_obj)
					Object.unobserve(_obj, observer);

				if(_extra_fields && _extra_fields instanceof TabularSection)
					Object.unobserve(_obj, observer_rows);

				if(attr.oxml)
					_oxml = attr.oxml;

				if(attr.selection)
					_selection = attr.selection;

				_obj = attr.obj;
				_meta = attr.metadata || _obj._metadata.fields;
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
					Object.observe(_obj, observer_rows, ["row", "rows"]);

				// заполняем табчасть данными
				if(_tsname && !attr.ts_title)
					attr.ts_title = _obj._metadata.tabular_sections[_tsname].synonym;
				observer_rows([{tabular: _tsname}]);

			}
		}

	});


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
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  widgets
 * @submodule wdg_otabular
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
 * @param [attr.metadata] {Object} - описание метаданных табличной части. Если не указано, описание запрашивается у объекта
 * @param [attr.selection] {Object} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"} или {not: значение}
 * @constructor
 * @menuorder 53
 * @tooltip Редактор таличной части
 */
dhtmlXCellObject.prototype.attachTabular = function(attr) {


	var _obj = attr.obj,
		_tsname = attr.ts,
		_ts = _obj[_tsname],
		_mgr = _obj._manager,
		_meta = attr.metadata || _mgr.metadata().tabular_sections[_tsname].fields,
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
	_grid.enableAccessKeyMap();

	/**
	 * добавляет строку табчасти
	 */
	_grid._add_row = function(){
		if(!attr.read_only){

			var row = _ts.add();

			if(_mgr.handle_event(_obj, "add_row",
					{
						tabular_section: _tsname,
						grid: _grid,
						row: row,
						wnd: _pwnd.pwnd
					}) === false)
				return;

			setTimeout(function () {
				_grid.selectRowById(row.row);
			}, 100);
		}
	};

	/**
	 * удаляет строку табчасти
	 */
	_grid._del_row = function(){
		if(!attr.read_only){
			var rId = get_sel_index();

			if(rId != undefined){

				if(_mgr.handle_event(_obj, "del_row", 
						{
							tabular_section: _tsname,
							grid: _grid,
							row: rId,
							wnd: _pwnd.pwnd
						}) === false)
					return;

				_ts.del(rId);

				setTimeout(function () {
					_grid.selectRowById(rId < _ts.count() ? rId + 1 : rId);
				}, 100);
			}
		}
	};
	

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
	 * обработчик изменения значения примитивного типа
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
				cell: (rId && cInd) ? _grid.cells(rId, cInd) : (_grid.getSelectedCellIndex() >=0 ? _grid.cells() : null),
				wnd: _pwnd.pwnd
			});

		if(typeof ret_code !== "boolean"){
			cell_field.obj[cell_field.field] = nValue;
			ret_code = true;
		}
		return ret_code;
	}

	/**
	 * наблюдатель за изменениями насбор строк табчасти
	 * @param changes
	 */
	function observer_rows(changes){
		if(_grid.clearAll){
			changes.some(function(change){
				if (change.type == "rows" && change.tabular == _tsname){
					_ts.sync_grid(_grid, _selection);
					return true;
				}
			});	
		}
	}

	/**
	 * наблюдатель за изменениями значений в строках табчасти
	 * @param changes
	 */
	function observer(changes){
		if(changes.length > 20){
			try{_ts.sync_grid(_grid, _selection);} catch(err){}
		} else
			changes.forEach(function(change){
				if (_tsname == change.tabular){
					if(!change.row || _grid.getSelectedRowId() != change.row.row)
						_ts.sync_grid(_grid, _selection);
					else{
						if(_grid.getColIndexById(change.name) != undefined)
							_grid.cells(change.row.row, _grid.getColIndexById(change.name))
								.setCValue($p.utils.is_data_obj(change.row[change.name]) ? change.row[change.name].presentation : change.row[change.name]);
					}
				}
			});
	}


	// панель инструментов табличной части
	_toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix());
	_toolbar.loadStruct(attr.toolbar_struct || $p.injected_data["toolbar_add_del.xml"], function(){
		
		this.attachEvent("onclick", function(btn_id){

			switch(btn_id) {

				case "btn_add":
					_grid._add_row();
					break;

				case "btn_delete":
					_grid._del_row();
					break;
			}

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
		_toolbar.forEachItem(function (name) {
			if(["btn_add", "btn_delete"].indexOf(name) != -1)
				_toolbar.disableItem(name);
		});
	}

	_grid.__define({

		// TODO: реализовать свойство selection и его инициализацию через attr
		selection: {
			get: function () {
				return _selection;
			},
			set: function (sel) {
				_selection = sel;
				observer_rows([{tabular: _tsname, type: "rows"}]);
			}
		},

		destructor: {
			value: function () {

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
			}
		},

		get_cell_field: {
			value: function () {

				if(_ts){

					var rindex = get_sel_index(true),
						cindex = _grid.getSelectedCellIndex(),
						row, col;

					if(rindex != undefined){
						row = _ts.get(rindex);

					}else if(_grid._last){
						row = _ts.get(_grid._last.row);
					}

					if(cindex >=0){
						col = _grid.getColumnId(cindex);
					}else if(_grid._last){
						col = _grid.getColumnId(_grid._last.cindex);
					}

					if(row && col){
						return {obj: row, field: col}._mixin(_pwnd);
					}

				}
			}
		},

		refresh_row: {
			value: function (row) {
				_grid.selectRowById(row.row);
				_grid.forEachCell(row.row, function(cellObj,ind){
					var val = row[_grid.getColumnId(ind)];
					cellObj.setCValue($p.utils.is_data_obj(val) ? val.presentation : val);
				});
			}
		}
	});

	_grid.attachEvent("onEditCell", tabular_on_edit);

	_grid.attachEvent("onRowSelect", function(rid,ind){
		if(_ts){
			_grid._last = {
				row: rid-1,
				cindex: ind
			}
		}
	});

	// заполняем табчасть данными
	observer_rows([{tabular: _tsname, type: "rows"}]);

	// начинаем следить за объектом и, его табчастью допреквизитов
	Object.observe(_obj, observer, ["row"]);
	Object.observe(_obj, observer_rows, ["rows"]);

	return _grid;
};


/**
 * ### Виджет элементов фильтра для панели инструментов форм списка и выбора
 * объединяет поля выбора периода и поле ввода фильтра
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  widgets
 * @submodule wdg_filter
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
 * @menuorder 57
 * @tooltip Фильтр динсписка
 */
$p.iface.Toolbar_filter = function Toolbar_filter(attr) {

	var t = this,
		input_filter_changed = 0,
		input_filter_width = $p.job_prm.device_type == "desktop" ? 300 : 120,
		custom_selection = {};

	if(!attr.pos)
		attr.pos = 6;

	t.__define({

		custom_selection: {
			get: function () {
				return custom_selection;
			},
			enumerable: false,
			configurable: false
		},

		toolbar: {
			get: function () {
				return attr.toolbar;
			},
			enumerable: false,
			configurable: false
		},

		call_event: {
			value: function () {

				if(input_filter_changed){
					clearTimeout(input_filter_changed);
					input_filter_changed = 0;
				}

				attr.onchange.call(t, t.get_filter());
			}
		}

	});

	function onkeydown(){

		if(input_filter_changed)
			clearTimeout(input_filter_changed);

		input_filter_changed = setTimeout(function () {
			if(input_filter_changed)
				t.call_event();
		}, 500);
	}

	// заготовка для адаптивного фильтра
	t.toolbar.addText("div_filter", attr.pos, "");
	t.div = t.toolbar.objPull[t.toolbar.idPrefix + "div_filter"];
	attr.pos++;

	// Поля ввода периода
	if(attr.manager instanceof DocManager || attr.period){

		// управляем доступностью дат в миникалендаре
		function set_sens(inp, k) {
			if (k == "min")
				t.сalendar.setSensitiveRange(inp.value, null);
			else
				t.сalendar.setSensitiveRange(null, inp.value);
		}

		input_filter_width = $p.job_prm.device_type == "desktop" ? 180 : 120;

		t.toolbar.addInput("input_date_from", attr.pos, "", $p.job_prm.device_type == "desktop" ? 80 : 72);
		attr.pos++;
		t.toolbar.addText("lbl_date_till", attr.pos, "-");
		attr.pos++;
		t.toolbar.addInput("input_date_till", attr.pos, "", $p.job_prm.device_type == "desktop" ? 80 : 72);
		attr.pos++;

		t.input_date_from = t.toolbar.getInput("input_date_from");
		//t.input_date_from.setAttribute("readOnly", "true");
		t.input_date_from.onclick = function(){ set_sens(t.input_date_till,"max"); };

		t.input_date_till = t.toolbar.getInput("input_date_till");
		//t.input_date_till.setAttribute("readOnly", "true");
		t.input_date_till.onclick = function(){ set_sens(t.input_date_from,"min"); };

		// подключаем календарь к инпутам
		t.сalendar = new dhtmlXCalendarObject([t.input_date_from, t.input_date_till]);
		t.сalendar.attachEvent("onclick", t.call_event);

		// начальные значения периода
		if(!attr.date_from)
			attr.date_from = new Date((new Date()).getFullYear().toFixed() + "-01-01");
		if(!attr.date_till)
			attr.date_till = $p.utils.date_add_day(new Date(), 1);
		t.input_date_from.value=$p.moment(attr.date_from).format("L");
		t.input_date_till.value=$p.moment(attr.date_till).format("L");
	}

	// текстовое поле фильтра по подстроке
	if(!attr.hide_filter){

		t.toolbar.addSeparator("filter_sep", attr.pos);
		attr.pos++;

		t.toolbar.addInput("input_filter", attr.pos, "", input_filter_width);
		t.input_filter = t.toolbar.getInput("input_filter");
		t.input_filter.onchange = t.call_event;
		t.input_filter.onkeydown = onkeydown;
		t.input_filter.type = "search";
		t.input_filter.setAttribute("placeholder", "Фильтр");

		t.toolbar.addSpacer("input_filter");

	}else if(t.input_date_till)
		t.toolbar.addSpacer("input_date_till");

	else if(t.toolbar.getItemText("btn_delete"))
		t.toolbar.addSpacer("btn_delete");


};
$p.iface.Toolbar_filter.prototype.__define({

	get_filter: {
		value: function (exclude_custom) {

			var res = {
				date_from: this.input_date_from ? $p.utils.date_add_day(dhx4.str2date(this.input_date_from.value), 0, true) : "",
				date_till: this.input_date_till ? $p.utils.date_add_day(dhx4.str2date(this.input_date_till.value), 1, true) : "",
				filter: this.input_filter ? this.input_filter.value : ""
			}, fld, flt;

			if(!exclude_custom){
				for(fld in this.custom_selection){
					if(!res.selection)
						res.selection = [];
					flt = {};
					flt[fld] = this.custom_selection[fld].value;
					res.selection.push(flt);
				}
			}

			return res;
		}
	},

	add_filter: {
		value: function (elm) {

			var pos = this.toolbar.getPosition("input_filter") - 2,
				id = dhx4.newId(),
				width = (this.toolbar.getWidth("input_filter") / 2).round(0);

			this.toolbar.setWidth("input_filter", width);
			this.toolbar.addText("lbl_"+id, pos, elm.text || "");
			pos++;
			this.toolbar.addInput("input_"+id, pos, "", width);

			this.custom_selection[elm.name] = this.toolbar.getInput("input_"+id);
		}
	}
});

/**
 * Формы визуализации и изменения параметров объекта
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
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

	var wnd_dat = (_dxw || $p.iface.w).createWindow({
		id: dhx4.newId(),
		left: attr.left || 700,
		top: attr.top || 20,
		width: attr.width || 220,
		height: attr.height || 300,
		move: true,
		park: !attr.allow_close,
		center: !!attr.center,
		resize: true,
		caption: attr.caption || "Tools"
	});

	// если окно не помещается в области - двигаем
	var _dxw_area = {
		x: (_dxw || $p.iface.w).vp.clientWidth,
		y: (_dxw || $p.iface.w).vp.clientHeight
	}, _move;
	
	if(wnd_dat.getPosition()[0] + wnd_dat.getDimension()[0] > _dxw_area.x){
		_dxw_area.x = _dxw_area.x - wnd_dat.getDimension()[0];
		_move = true;
	}else
		_dxw_area.x = wnd_dat.getPosition()[0];
	
	if(wnd_dat.getPosition()[1] + wnd_dat.getDimension()[1] > _dxw_area.y){
		_dxw_area.y = _dxw_area.y - wnd_dat.getDimension()[1];
		_move = true;
	}else
		_dxw_area.y = wnd_dat.getPosition()[1];
		
	if(_move){
		if(_dxw_area.x<0 || _dxw_area.y<0)
			wnd_dat.maximize();
		else
			wnd_dat.setPosition(_dxw_area.x, _dxw_area.y);
	}

	_dxw = null;

	if(attr.hasOwnProperty('allow_minmax') && !attr.allow_minmax)
		wnd_dat.button('minmax').hide();

	if(attr.allow_close)
		wnd_dat.button('park').hide();
	else
		wnd_dat.button('close').hide();

	// обработчик при закрытии - анализируем модальность
	wnd_dat.attachEvent("onClose", function () {
		
		var allow_close = typeof attr.on_close == "function" ? attr.on_close(wnd_dat) : true;
		
		if(allow_close){

			// восстанавливаем модальность родительского окна
			if(attr.pwnd_modal && attr.pwnd && attr.pwnd.setModal)
				attr.pwnd.setModal(1);

			return allow_close;
		}
						
	});

	wnd_dat.setIconCss('without_icon');
	wnd_dat.cell.parentNode.children[1].classList.add('dat_gui');

	$p.iface.bind_help(wnd_dat, attr.help_path);

	wnd_dat.elmnts = {grids: {}};

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
		if(attr.pwnd && attr.pwnd.setModal){
			attr.pwnd_modal = attr.pwnd.isModal();
			attr.pwnd.setModal(0);
		}			
		wnd_dat.setModal(1);
	}

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
			source.o[f] = $p.utils.fix_number(selv, true);
		else
			source.o[f] = selv;

	}else if(f.indexOf("fprms") > -1){
		var row = $p._find(source.o.fprms, f.split("|")[1]);
		row.value = selv;
	}

	pgrid.cells().setValue($p.utils.is_data_obj(selv) ? selv.presentation : selv || "");
	

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
 * Создаёт форму авторизации с обработчиками перехода к фидбэку и настройкам,
 * полем входа под гостевой ролью, полями логина и пароля и кнопкой входа
 * @method frm_auth
 * @for InterfaceObjs
 * @param attr {Object} - параметры формы
 * @param [attr.cell] {dhtmlXCellObject}
 * @return {Promise}
 */
$p.iface.frm_auth = function (attr, resolve, reject) {

	if(!attr)
		attr = {};

	var _cell, _frm, w, were_errors;

	if(attr.modal_dialog){
		if(!attr.options)
			attr.options = {
				name: "frm_auth",
				caption: "Вход на сервер",
				width: 360,
				height: 300,
				center: true,
				allow_close: true,
				allow_minmax: true,
				modal: true
			};
		_cell = $p.iface.dat_blank(attr._dxw, attr.options);
		_cell.attachEvent("onClose",function(win){
			if(were_errors){
				if(reject)
					reject(err);
			}else if(resolve)
				resolve();
			return true;
		});
		_frm = _cell.attachForm();

	}else{
		_cell = attr.cell || $p.iface.docs;
		_frm = $p.iface.auth = _cell.attachForm();
		$p.msg.show_msg($p.msg.init_login, _cell);
	}


	function do_auth(login, password){
		
		$p.ajax.username = login;
		$p.ajax.password = $p.aes.Ctr.encrypt(password);

		if(login){

			if($p.wsql.get_user_param("user_name") != login)
				$p.wsql.set_user_param("user_name", login);					// сохраняем имя пользователя в базе

			//$p.eve.log_in(attr.onstep)
			$p.wsql.pouch.log_in(login, password)
				.then(function () {

					if($p.wsql.get_user_param("enable_save_pwd")){
						if($p.aes.Ctr.decrypt($p.wsql.get_user_param("user_pwd")) != password)
							$p.wsql.set_user_param("user_pwd", $p.aes.Ctr.encrypt(password));   // сохраняем имя пользователя в базе
						
					}else if($p.wsql.get_user_param("user_pwd") != "")
						$p.wsql.set_user_param("user_pwd", "");

					$p.eve.logged_in = true;
					if(attr.modal_dialog)
						_cell.close();
					else if(resolve)
						resolve();

				})
				.catch(function (err) {
					were_errors = true;
					_frm.onerror(err);
				})
				.then(function () {
					if($p.iface.sync)
						$p.iface.sync.close();
					if(_cell && _cell.progressOff){
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

		were_errors = false;
		this.resetValidateCss();

		if(this.getCheckedValue("type") == "guest"){

			var login = this.getItemValue("guest"),
				password = "";
			if($p.job_prm.guests && $p.job_prm.guests.length){
				$p.job_prm.guests.some(function (g) {
					if(g.username == login){
						password = $p.aes.Ctr.decrypt(g.password);
						return true;
					}
				});
			}
			do_auth.call(this, login, password);

		}else if(this.getCheckedValue("type") == "auth"){
			do_auth.call(this, this.getItemValue("login"), this.getItemValue("password"));

		}
	}

	// загружаем структуру формы
	_frm.loadStruct($p.injected_data["form_auth.xml"], function(){

		var selected;

		// если указан список гостевых пользователей
		if($p.job_prm.guests && $p.job_prm.guests.length){

			var guests = $p.job_prm.guests.map(function (g) {
					var v = {
						text: g.username,
						value: g.username
					};
					if($p.wsql.get_user_param("user_name") == g.username){
						v.selected = true;
						selected = g.username;
					}
					return v;
				});

			if(!selected){
				guests[0].selected = true;
				selected = guests[0].value;
			}

			_frm.reloadOptions("guest", guests);
		}

		// после готовности формы читаем пользователя из локальной датабазы
		if($p.wsql.get_user_param("user_name") && $p.wsql.get_user_param("user_name") != selected){
			_frm.setItemValue("login", $p.wsql.get_user_param("user_name"));
			_frm.setItemValue("type", "auth");

			if($p.wsql.get_user_param("enable_save_pwd") && $p.wsql.get_user_param("user_pwd")){
				_frm.setItemValue("password", $p.aes.Ctr.decrypt($p.wsql.get_user_param("user_pwd")));
			}
		}

		// позиционируем форму по центру
		if(!attr.modal_dialog){
			if((w = ((_cell.getWidth ? _cell.getWidth() : _cell.cell.offsetWidth) - 500)/2) >= 10)
				_frm.cont.style.paddingLeft = w.toFixed() + "px";
			else
				_frm.cont.style.paddingLeft = "20px";
		}

		setTimeout(function () {

			dhx4.callEvent("on_draw_auth", [_frm]);

			if(($p.wsql.get_user_param("autologin") || attr.try_auto) && (selected || ($p.wsql.get_user_param("user_name") && $p.wsql.get_user_param("user_pwd"))))
				auth_click.call(_frm);

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

	return $p.iface.cancel_bubble(evt);
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
					{id:"oper_cacc", text: $p.msg.meta_cacc, item:[]},
					{id:"oper_tsk", text: $p.msg.meta_tsk, item:[]}
				]}, mdn, md,

				// бежим по справочникам
					tlist = meta_tree.item[0].item;
				for(mdn in $p.cat){
					if(typeof $p.cat[mdn] == "function")
						continue;
					md = $p.cat[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.cat." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				// бежим по документам
				tlist = meta_tree.item[1].item;
				for(mdn in $p.doc){
					if(typeof $p.doc[mdn] == "function")
						continue;
					md = $p.doc[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.doc." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				// бежим по планам видов характеристик
				tlist = meta_tree.item[2].item;
				for(mdn in $p.cch){
					if(typeof $p.cch[mdn] == "function")
						continue;
					md = $p.cch[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.cch." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				// бежим по планам счетов
				tlist = meta_tree.item[3].item;
				for(mdn in $p.cacc){
					if(typeof $p.cacc[mdn] == "function")
						continue;
					md = $p.cacc[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.cacc." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				// бежим по задачам
				tlist = meta_tree.item[4].item;
				for(mdn in $p.tsk){
					if(typeof $p.tsk[mdn] == "function")
						continue;
					md = $p.tsk[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.tsk." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				iface.tree.parse(meta_tree, function(){
					var hprm = $p.job_prm.parse_url();
					if(hprm.obj){
						iface.tree.selectItem(hprm.view+"."+hprm.obj, true);
					}
				}, "json");

			}else{
				iface.tree.loadXML(iface.tree.tree_filteres, function(){

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
 * @menuorder 54
 * @tooltip Командная панель
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
			div.children[i].classList.remove('selected');
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
		if(attr.onclick)
			attr.onclick.call(_this, this.name.replace(attr.name + '_', ''), attr.name);
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

				if(attr.on_popup)
					attr.on_popup($p.iface.popup, bdiv);
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

	if(attr.top) div.style.top = attr.top;
	if(attr.left) div.style.left = attr.left;
	if(attr.bottom) div.style.bottom = attr.bottom;
	if(attr.right) div.style.right = attr.right;
	if(attr.paddingRight) div.style.paddingRight = attr.paddingRight;
	if(attr.paddingLeft) div.style.paddingLeft = attr.paddingLeft;

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

	// если имя начинается с sep_ - это разделитель
	bdiv.className = (battr.name.indexOf("sep_") == 0) ? 'md_otooolbar_sep' : 'md_otooolbar_button';
	if(battr.hasOwnProperty("class_name"))
		bdiv.classList.add(battr.class_name);

	if(battr.img)
		html = '<img src="' + (attr ? attr.image_path : '') + battr.img + '">';
	if(battr.b)
		html +='<b style="vertical-align: super;"> ' + battr.b + '</b>';
	else if(battr.text)
		html +='<span style="vertical-align: super;"> ' + battr.text + '</span>';
	else if(battr.css)
		bdiv.classList.add(battr.css);
	bdiv.innerHTML = html;

	if(battr.float) bdiv.style.float = battr.float;
	if(battr.clear) bdiv.style.clear = battr.clear;
	if(battr.width) bdiv.style.width = battr.width;
	if(battr.paddingRight) bdiv.style.paddingRight = battr.paddingRight;
	if(battr.paddingLeft) bdiv.style.paddingLeft = battr.paddingLeft;

	if(battr.tooltip)
		bdiv.title = battr.tooltip;

	return bdiv;
};

/**
 * Поле ввода адреса связанная с ним форма ввода адреса
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
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
				return $p.iface.cancel_bubble(e);
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
			ti.onclick=$p.iface.cancel_bubble;		//blocks onclick event
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
			return !$p.utils.is_equal(t.val, t.getValue());				// compares the new and the old values
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

		process_address_fields().then(frm_create);


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
					metadata: {
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

			if($p.utils.is_data_obj(selv))
				_delivery_area = selv;
			else
				_delivery_area = $p.cat.delivery_areas.get(selv, false);

			clear_street = old != _delivery_area;

			if(!$p.utils.is_data_obj(_delivery_area))
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

		function process_address_fields(){

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
			
			return new Promise(function(resolve, reject){

				if(!$p.ipinfo)
					$p.ipinfo = new IPInfo();

				if(window.google && window.google.maps)
					resolve();
				else{
					$p.load_script("//maps.google.com/maps/api/js?callback=$p.ipinfo.location_callback", "script", function(){});

					var google_ready = $p.eve.attachEvent("geo_google_ready", function () {
						
						if(watch_dog)
							clearTimeout(watch_dog);
						
						if(google_ready){
							$p.eve.detachEvent(google_ready);
							google_ready = null;
							resolve();	
						}
					});

					// Если Google не ответил - информируем об ошибке и продолжаем
					var watch_dog = setTimeout(function () {

						if(google_ready){
							$p.eve.detachEvent(google_ready);
							google_ready = null;
						}
						$p.msg.show_msg({
							type: "alert-warning",
							text: $p.msg.error_geocoding + " Google",
							title: $p.msg.main_title
						});

						resolve();

					}, 10000);
				}

			})
				.then(function () {

					// если есть координаты $p.ipinfo, используем их
					// иначе - Москва
					if(v.coordinates.length){
						// если координаты есть в Расчете, используем их
						v.latitude = v.coordinates[0];
						v.longitude = v.coordinates[1];

					}else if(obj.shipping_address){
						// если есть строка адреса, пытаемся геокодировать
						do_geocoding(function (results, status) {
							if (status == google.maps.GeocoderStatus.OK) {
								v.latitude = results[0].geometry.location.lat();
								v.longitude = results[0].geometry.location.lng();
							}
						});

					}else if($p.ipinfo.latitude && $p.ipinfo.longitude ){
						v.latitude = $p.ipinfo.latitude;
						v.longitude = $p.ipinfo.longitude;

					}else{
						v.latitude = 55.635924;
						v.longitude = 37.6066379;
						$p.msg.show_msg($p.msg.empty_geocoding);
					}
					
				});			

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
 * Форма абстрактного объекта данных {{#crossLink "DataObj"}}{{/crossLink}}, в том числе, записей регистров
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
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
		_meta = _mgr.metadata(),
		o = attr.o,
		wnd, options, created, create_id, _title, close_confirmed;

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

				if(on_create || check_modified()){

					if(_wnd){

						// выгружаем попапы
						if(_wnd.elmnts)
							["vault", "vault_pop"].forEach(function (elm) {
								if (_wnd.elmnts[elm] && _wnd.elmnts[elm].unload)
									_wnd.elmnts[elm].unload();
							});

						// информируем мир о закрытии формы
						if(_mgr && _mgr.class_name)
							$p.eve.callEvent("frm_close", [_mgr.class_name, (o && o._obj ? o.ref : "")]);
						
						if(_wnd.conf){
							_wnd.detachToolbar();
							_wnd.detachStatusBar();
							_wnd.conf.unloading = true;
							_wnd.detachObject(true);
						}
					}
					frm_unload(on_create);

				}
			};
			wnd.elmnts = {grids: {}};

		}else{
			// форма в модальном диалоге
			options = {
				name: 'wnd_obj_' + _mgr.class_name,
				wnd: {
					top: 80 + Math.random()*40,
					left: 120 + Math.random()*80,
					width: 700,
					height: 400,
					modal: true,
					center: false,
					pwnd: pwnd,
					allow_close: true,
					allow_minmax: true,
					on_close: frm_close,
					caption: (_meta.obj_presentation || _meta.synonym)
				}
			};
			wnd = $p.iface.dat_blank(null, options.wnd);
		}

		if(!wnd.ref)
			wnd.__define({

				/**
				 * Возвращает ссылку текущего объекта
				 */
				ref: {
					get: function(){
						return o ? o.ref : $p.utils.blank.guid;
					},
					enumerable: false,
					configurable: true
				},

				/**
				 * Обновляет текст заголовка формы
				 */
				set_text: {
					value: function(force) {
						if(attr && attr.set_text || wnd && wnd.setText){

							var title = o.presentation;
							
							if(!title)
								return;

							if(o instanceof CatObj)
								title = (_meta.obj_presentation || _meta.synonym) + ': ' + title;

							else if(o instanceof DocObj)
								title += o.posted ? " (проведен)" : " (не проведен)";

							if(o._modified && title.lastIndexOf("*")!=title.length-1)
								title += " *";

							else if(!o._modified && title.lastIndexOf("*")==title.length-1)
								title = title.replace(" *", "");

							if(force || _title !== title){
								_title = title;
								if(attr.set_text)
									attr.set_text(title);
								else
									wnd.setText(title);
							}
						}
					},
					enumerable: false,
					configurable: true
				}
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

			// если мы приклеены к ячейке, сдвигаем toolbar на 4px
			if(wnd === pwnd)
				this.cont.style.top = "4px";

			this.addSpacer("btn_unpost");
			this.attachEvent("onclick", attr.toolbar_click || toolbar_click);

			// учтём права для каждой роли на каждый объект
			if($p.current_acl && $p.current_acl._acl){

				var acn = _mgr.class_name.split("."),
					_acl = $p.current_acl._acl[acn[0]][acn[1]] || "e";

				if(_mgr instanceof DocManager && _acl.indexOf("p") != -1){
					this.enableItem("btn_post");
					this.setItemText("btn_save_close", "<b>Провести и закрыть</b>");
				}else
					this.hideItem("btn_post");

				if(_mgr instanceof DocManager && _acl.indexOf("o") != -1)
					this.enableItem("btn_unpost");
				else
					this.hideItem("btn_unpost");


				if(_acl.indexOf("e") == -1){
					this.hideItem("btn_save_close");
					this.disableItem("btn_save");
				}

			}

			if(attr.on_select)
				this.setItemText("btn_save_close", "Записать и выбрать");

			// для ссылочных типов
			if(_mgr instanceof CatManager || _mgr instanceof DocManager){

				// добавляем команды печати
				_mgr.printing_plates().then(function (pp) {
					for(var pid in pp)
						wnd.elmnts.frm_toolbar.addListOption("bs_print", pid, "~", "button", pp[pid].toString());
				});

				// попап для присоединенных файлов
				wnd.elmnts.vault_pop = new dhtmlXPopup({
					toolbar: this,
					id: "btn_files"
				});
				wnd.elmnts.vault_pop.attachEvent("onShow", show_vault);
				
			}else
				this.disableItem("bs_print");

			// кнопка закрытия для приклеенной формы
			if(wnd != pwnd){
				this.hideItem("btn_close");
			}

		});

		created = true;
	}




	/**
	 * Наблюдатель за изменением объекта
	 * Пока здесь только установка заголовка формы
	 * @param changes
	 */
	function observer(changes) {
		if(o && wnd)
			wnd.set_text();
	}

	/**
	 * ПриЧтенииНаСервере - инициализация при чтении объекта
	 */
	function frm_fill(){

		if(!created){
			clearTimeout(create_id);
			frm_create();
		}

		/**
		 * Устанавливаем текст заголовка формы
		 */
		wnd.set_text();
		if(!attr.hide_header && wnd.showHeader)
			wnd.showHeader();

		/**
		 * закладки табличных частей
		 */
		if(attr.draw_tabular_sections)
			attr.draw_tabular_sections(o, wnd, tabular_init);

		else if(!o.is_folder){
			if(_meta.form && _meta.form.obj && _meta.form.obj.tabular_sections_order)
				_meta.form.obj.tabular_sections_order.forEach(function (ts) {
					tabular_init(ts);
				});

			else
				for(var ts in _meta.tabular_sections){
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

			// учтём права для каждой роли на каждый объект
			var acn = _mgr.class_name.split("."), _acl;
			if($p.current_acl && $p.current_acl._acl)
				_acl = $p.current_acl._acl[acn[0]][acn[1]] || "e";
			else
				_acl = "e";

			wnd.elmnts.pg_header = wnd.elmnts.tabs.tab_header.attachHeadFields({
				obj: o,
				pwnd: wnd,
				read_only: _acl.indexOf("e") == -1
			});
			wnd.attachEvent("onResizeFinish", function(win){
				wnd.elmnts.pg_header.enableAutoHeight(false, wnd.elmnts.tabs.tab_header._getHeight()-20, true);
			});
		}

		/**
		 * начинаем следить за объектом
		 */
		Object.observe(o, observer, ["update", "row"]);


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

		else if(btn_id=="btn_post")
			save("post");

		else if(btn_id=="btn_unpost")
			save("unpost");

		else if(btn_id=="btn_close")
			wnd.close();

		else if(btn_id=="btn_go_connection")
			go_connection();

		else if(btn_id.substr(0,4)=="prn_")
			_mgr.print(o, btn_id, wnd);

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
		wnd.elmnts.frm_tabs.addTab('tab_'+name, '&nbsp;'+_meta.tabular_sections[name].synonym+'&nbsp;');
		wnd.elmnts.tabs['tab_'+name] = wnd.elmnts.frm_tabs.cells('tab_'+name);

		// учтём права для каждой роли на каждый объект
		var acn = _mgr.class_name.split("."), _acl;
		if($p.current_acl && $p.current_acl._acl)
			_acl = $p.current_acl._acl[acn[0]][acn[1]] || "e";
		else
			_acl = "e";

		wnd.elmnts.grids[name] = wnd.elmnts.tabs['tab_'+name].attachTabular({
			obj: o,
			ts: name,
			pwnd: wnd,
			read_only: _acl.indexOf("e") == -1,
			toolbar_struct: toolbar_struct
		});

		if(_acl.indexOf("e") == -1){
			var tabular = wnd.elmnts.tabs['tab_'+name].getAttachedToolbar();
			tabular.disableItem("btn_add");
			tabular.disableItem("btn_delete");
		}

	}

	function save(action){

		wnd.progressOn();
		
		var post;
		if(o instanceof DocObj){
			if(action == "post")
				post = true;

			else if(action == "unpost")
				post = false;

			else if(action == "close"){
				var acn = _mgr.class_name.split("."),
					_acl = $p.current_acl._acl[acn[0]][acn[1]] || "e";
				if(_acl.indexOf("p") != -1)
					post = true;
			}
		}

		o.save(post)
			.then(function(){

				wnd.progressOff();

				if(action == "close"){
					if(attr.on_select)
						attr.on_select(o);
					wnd.close();
					
				}else
					wnd.set_text();
			})
			.catch(function(err){
				wnd.progressOff();
				if(err instanceof Error)
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
			delete wnd.set_text;
			Object.unobserve(o, observer);
			_mgr = wnd = o = _meta = options = pwnd = attr = null;
		}
	}

	/**
	 * Задаёт вопрос о записи изменений и делает откат при необходимости
	 */
	function check_modified() {
		if(o._modified && !close_confirmed){
			dhtmlx.confirm({
				title: o.presentation,
				text: $p.msg.modified_close,
				cancel: $p.msg.cancel,
				callback: function(btn) {
					if(btn){
						close_confirmed = true;
						// закрыть изменённый без сохранения - значит прочитать его из pouchdb
						if(o._manager.cachable == "ram")
							this.close();

						else{
							if(o.is_new()){
								o.unload();
								this.close();
							}else{
								setTimeout(o.load.bind(o), 100);
								this.close();
							}
						}
					}
				}.bind(wnd)
			});
			return false;
		}
		return true;
	}

	function frm_close(wnd){

		if(check_modified()){
			
			setTimeout(frm_unload);

			// выгружаем попапы
			if(wnd && wnd.elmnts)
				["vault", "vault_pop"].forEach(function (elm) {
					if (wnd.elmnts[elm] && wnd.elmnts[elm].unload)
						wnd.elmnts[elm].unload();
				});

			// информируем мир о закрытии формы
			if(_mgr && _mgr.class_name)
				$p.eve.callEvent("frm_close", [_mgr.class_name, (o && o._obj ? o.ref : "")]);

			return true;
		}
	}


	// (пере)создаём статическую часть формы
	create_id = setTimeout(frm_create);

	// читаем объект из локального SQL или получаем с сервера
	if($p.utils.is_data_obj(o)){

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

		if(pwnd && pwnd.progressOn)
			pwnd.progressOn();

		return _mgr.get(attr.hasOwnProperty("ref") ? attr.ref : attr, true, true)
			.then(function(tObj){
				o = tObj;
				tObj = null;
				if(pwnd && pwnd.progressOff)
					pwnd.progressOff();
				return frm_fill();
			})
			.catch(function (err) {
				if(pwnd && pwnd.progressOff)
					pwnd.progressOff();
				wnd.close();
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
 * Форма абстрактного отчета {{#crossLink "DataProcessorsManager"}}{{/crossLink}}
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module wnd_rep
 * Created 03.08.2016
 */

DataProcessorsManager.prototype.form_rep = function(pwnd, attr) {

	var _mgr = this,
		_meta = _mgr.metadata(),
		wnd, options, _title, close_confirmed;

	if(!attr)
		attr = {};
	if(!attr.date_from)
		attr.date_from = new Date((new Date()).getFullYear().toFixed() + "-01-01");
	if(!attr.date_till)
		attr.date_till = new Date((new Date()).getFullYear().toFixed() + "-12-31");

	/**
	 * ПриСозданииНаСервере - инициализация при создании формы, до чтения объекта
	 */
	function frm_create(){


		// создаём и настраиваем окно формы
		if((pwnd instanceof dhtmlXLayoutCell || pwnd instanceof dhtmlXSideBarCell || pwnd instanceof dhtmlXCarouselCell)
			&& (attr.bind_pwnd || attr.Приклеить)) {

			// если вернулись на ту же самую закладку, ничего делать не надо
			if(wnd == pwnd && wnd._mgr == _mgr)
				return;

			// форма объекта приклеена к области контента или другой форме
			if(typeof pwnd.close == "function")
				pwnd.close(true);

			wnd = pwnd;
			wnd.close = function (on_create) {
				var _wnd = wnd || pwnd;

				if(on_create || check_modified()){

					if(_wnd){

						if(_wnd.conf){
							_wnd.detachToolbar();
							_wnd.detachStatusBar();
							_wnd.conf.unloading = true;
							_wnd.detachObject(true);
						}
					}
					frm_unload(on_create);

				}
			};
			wnd.elmnts = {grids: {}};

		}else{
			// форма в модальном диалоге
			options = {
				name: 'wnd_rep_' + _mgr.class_name,
				wnd: {
					top: 80 + Math.random()*40,
					left: 120 + Math.random()*80,
					width: 700,
					height: 400,
					modal: true,
					center: false,
					pwnd: pwnd,
					allow_close: true,
					allow_minmax: true,
					on_close: frm_close,
					caption: (_meta.obj_presentation || _meta.synonym)
				}
			};
			wnd = $p.iface.dat_blank(null, options.wnd);
		}

		// указатели на объект и менеджер
		wnd._mgr = _mgr;
		wnd.report = _mgr.create();


		if(!wnd.set_text)
			wnd.__define({

				/**
				 * Обновляет текст заголовка формы
				 */
				set_text: {
					value: function(force) {
						if(attr && attr.set_text || wnd && wnd.setText){

							var title = (_meta.obj_presentation || _meta.synonym);

							if(force || _title !== title){
								_title = title;
								if(attr.set_text)
									attr.set_text(title);
								else
									wnd.setText(title);
							}
						}
					},
					configurable: true
				}
			});

		/**
		 *	Разбивка на отчет и параметры
		 */
		wnd.elmnts.layout = wnd.attachLayout({
			pattern: "2U",
			cells: [{
				id: "a",
				text: "Отчет",
				header: false
			}, {
				id: "b",
				text: "Параметры",
				collapsed_text: "Параметры",
				width: 220

			}],
			offsets: { top: 0, right: 0, bottom: 0, left: 0}
		});

		// панель инструментов формы
		wnd.elmnts.frm_toolbar = wnd.attachToolbar();
		wnd.elmnts.frm_toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix());
		wnd.elmnts.frm_toolbar.loadStruct(attr.toolbar_struct || $p.injected_data["toolbar_rep.xml"], function(){

			// если мы приклеены к ячейке, сдвигаем toolbar на 4px
			if(wnd === pwnd)
				this.cont.style.top = "4px";

			this.addSpacer("btn_run");
			this.attachEvent("onclick", attr.toolbar_click || toolbar_click);

		});

		// устанавливаем текст заголовка формы
		wnd.set_text();
		if(!attr.hide_header && wnd.showHeader)
			wnd.showHeader();

		// создаём HandsontableDocument
		wnd.elmnts.table = new $p.HandsontableDocument(wnd.elmnts.layout.cells("a"),
			{allow_offline: wnd.report.allow_offline, autorun: false})
			.then(function (rep) {
				if(!rep._online)
					return wnd.elmnts.table = null;
			});

		// контейнер для элементов параметров отчета
		wnd.elmnts.frm_prm = document.createElement("DIV");
		wnd.elmnts.frm_prm.style = "height: 100%; min-height: 300px; width: 100%";
		wnd.elmnts.layout.cells("b").attachObject(wnd.elmnts.frm_prm);

		// daterangepicker
		wnd.report.daterange = new $p.iface.ODateRangePicker(wnd.elmnts.frm_prm, attr);

	}

	/**
	 * обработчик нажатия кнопок командных панелей
	 */
	function toolbar_click(btn_id){

		if(btn_id=="btn_close"){
			wnd.close();

		}else if(btn_id=="btn_run"){
			wnd.report.build().then(show).catch(show);

		}else if(btn_id=="btn_print"){
			//_mgr.import(null, wnd.report);

		}else if(btn_id=="btn_save"){
			//_mgr.import(null, wnd.report);

		}else if(btn_id=="btn_load"){
			//_mgr.import(null, wnd.report);

		}else if(btn_id=="btn_export"){
			//_mgr.export({items: [wnd.report], pwnd: wnd, obj: true} );
		}

	}

	/**
	 * показывает отчет или ошибку (если data instanceof error)
	 */
	function show(data) {
		wnd.elmnts.table.requery(data);
	}

	/**
	 * освобождает переменные после закрытия формы
	 */
	function frm_unload(on_create){

		if(attr && attr.on_close && !on_create)
			attr.on_close();

		if(!on_create){
			delete wnd.set_text;

			// уничтожаем табличный документ
			if(wnd.elmnts.table)
				wnd.elmnts.table.hot.destroy();

			// уничтожаем daterangepicker
			if(wnd.report.daterange)
				wnd.report.daterange.remove();

			wnd.report = null;

			_mgr = wnd = _meta = options = pwnd = attr = null;
		}
	}

	frm_create();

	return wnd;

};

/**
 * Абстрактная форма списка и выбора выбора объектов ссылочного типа (документов и справочников)<br />
 * Может быть переопределена в {{#crossLink "RefDataManager"}}менеджерах{{/crossLink}} конкретных классов
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  wnd_selection
 */

/**
 * Форма выбора объекта данных
 * @method form_selection
 * @param pwnd {dhtmlXWindowsCell} - указатель на родительскую форму
 * @param attr {Object} - параметры инициализации формы
 * @param [attr.initial_value] {DataObj} - начальное значение выбора
 * @param [attr.parent] {DataObj} - начальное значение родителя для иерархических справочников
 * @param [attr.on_select] {Function} - callback при выборе значения
 * @param [attr.on_grid_inited] {Function} - callback после инициализации грида
 * @param [attr.on_new] {Function} - callback после создания нового объекта
 * @param [attr.on_edit] {Function} - callback перед вызовом редактора
 * @param [attr.on_close] {Function} - callback при закрытии формы
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
		_meta = attr.metadata || _mgr.metadata(),
		has_tree = _meta["hierarchical"] && !(_mgr instanceof ChartOfAccountManager),
		wnd, s_col = 0,
		a_direction = "asc",
		previous_filter = {},
		on_select = pwnd.on_select || attr.on_select;


	// создаём и настраиваем форму
	if(has_tree && attr.initial_value && attr.initial_value!= $p.utils.blank.guid && !attr.parent)
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
			wnd = $p.iface.w.createWindow(null, 0, 0, 700, 500);
			wnd.centerOnScreen();
			wnd.setModal(1);
			wnd.button('park').hide();
			wnd.button('minmax').show();
			wnd.button('minmax').enable();
			wnd.attachEvent("onClose", frm_close);
		}

		$p.iface.bind_help(wnd);
		if(wnd.setText && !attr.hide_text)
			wnd.setText('Список ' + (_mgr.class_name.indexOf("doc.") == -1 ? 'справочника "' : 'документов "') + (_meta["list_presentation"] || _meta.synonym) + '"');

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

			// если мы приклеены к ячейке, сдвигаем toolbar на 4px
			if(wnd === pwnd){
				this.cont.parentElement.classList.add("dhx_cell_toolbar_no_borders");
				this.cont.parentElement.classList.remove("dhx_cell_toolbar_def");
				this.cont.style.top = "4px";
			}

			// текстовое поле фильтра по подстроке
			var tbattr = {
				manager: _mgr,
				toolbar: this,
				onchange: input_filter_change,
				hide_filter: attr.hide_filter
			};
			if(attr.date_from) tbattr.date_from = attr.date_from;
			if(attr.date_till) tbattr.date_till = attr.date_till;
			if(attr.period) tbattr.period = attr.period;
			wnd.elmnts.filter = new $p.iface.Toolbar_filter(tbattr);

			
			// учтём права для каждой роли на каждый объект
			if($p.current_acl && $p.current_acl._acl){
				var acn = _mgr.class_name.split("."),
					_acl = $p.current_acl._acl[acn[0]][acn[1]] || "e";

				if(_acl.indexOf("i") == -1)
					this.hideItem("btn_new");

				if(_acl.indexOf("v") == -1)
					this.hideItem("btn_edit");

				if(_acl.indexOf("d") == -1)
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
			if(_mgr.printing_plates)
				_mgr.printing_plates().then(function (pp) {
					var added;
					for(var pid in pp){
						wnd.elmnts.toolbar.addListOption("bs_print", pid, "~", "button", pp[pid].toString());
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

		wnd._mgr = _mgr;
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
				if(w != wnd && (w.isModal() || $p.iface.w.getTopmostWindow() == w))
					do_exit = true;
			});
			return do_exit;
		}

		if(wnd && wnd.is_visible && wnd.is_visible()){
			if (evt.ctrlKey && evt.keyCode == 70){ // фокус на поиск по {Ctrl+F}
				if(!check_exit()){
					setTimeout(function(){
						if(wnd.elmnts.filter.input_filter && $p.job_prm.device_type == "desktop")
							wnd.elmnts.filter.input_filter.focus();
					});
					return $p.iface.cancel_bubble(evt);
				}

			} else if(evt.shiftKey && evt.keyCode == 116){ // requery по {Shift+F5}
				if(!check_exit()){
					setTimeout(function(){
						wnd.elmnts.grid.reload();
					});
					if(evt.preventDefault)
						evt.preventDefault();
					return $p.iface.cancel_bubble(evt);
				}

			} else if(evt.keyCode == 27){ // закрытие по {ESC}
				if(!check_exit()){
					setTimeout(function(){
						wnd.close();
					});
				}
			}
		}
	}

	function input_filter_change(flt){
		if(wnd && wnd.elmnts){
			if(has_tree){
				if(flt.filter)
					wnd.elmnts.cell_tree.collapse();
				else
					wnd.elmnts.cell_tree.expand();
			}
			wnd.elmnts.grid.reload();
		}
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
				setTimeout(function(){
					if(grid && grid.reload)
						grid.reload();
				}, 20);
			});
			tree.attachEvent("onSelect", function(id, mode){	// довешиваем обработчик на дерево
				if(!mode)
					return;
				if(this.do_not_reload)
					delete this.do_not_reload;
				else
					setTimeout(function(){
						if(grid && grid.reload)
							grid.reload();
					}, 20);
			});
			tree.attachEvent("onDblClick", function(id){
				select(id);
			});

		}else{
			cell_grid = wnd;
			setTimeout(function(){
				if(grid && grid.reload)
					grid.reload();
			}, 20);
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
			_mgr.sync_grid(filter, grid);
			return false;
		});
		grid.attachEvent("onRowDblClicked", function(rId, cInd){
			if(tree && tree.items[rId]){
				tree.selectItem(rId);
				var pid = tree.getParentId(rId);
				if(pid && pid != $p.utils.blank.guid)
					tree.openItem(pid);
			}else
				select(rId);
		});

		if($p.iface.docs && $p.iface.docs.getViewName && $p.iface.docs.getViewName() == "oper")
			grid.enableMultiselect(true);

		// эту функцию будем вызывать снаружи, чтобы перечитать данные
		grid.reload = function(){

			var filter = get_filter();
			if(!filter)
				return Promise.resolve();

			cell_grid.progressOn();
			grid.clearAll();

			return _mgr.sync_grid(filter, grid)
				.then(function(xml){
					if(typeof xml === "object"){
						$p.msg.check_soap_result(xml);
					}else if(!grid_inited){
						if(filter.initial_value){
							var xpos = xml.indexOf("set_parent"),
								xpos2 = xml.indexOf("'>", xpos),
								xh = xml.substr(xpos+12, xpos2-xpos-12);
							if($p.utils.is_guid(xh)){
								if(has_tree){
									tree.do_not_reload = true;
									tree.selectItem(xh, false);
								}
							}
							grid.selectRowById(filter.initial_value);

						}else if(filter.parent && $p.utils.is_guid(filter.parent) && has_tree){
							tree.do_not_reload = true;
							tree.selectItem(filter.parent, false);
						}
						grid.setColumnMinWidth(200, grid.getColIndexById("presentation"));
						grid.enableAutoWidth(true, 1200, 600);
						grid.setSizes();
						grid_inited = true;
						if(wnd.elmnts.filter.input_filter && $p.job_prm.device_type == "desktop")
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
	 *	обработчик нажатия кнопок командных панелей
	 */
	function toolbar_click(btn_id){

		if(btn_id=="btn_select"){
			select();

		}else if(btn_id=="btn_new"){

			_mgr.create({}, true)
				.then(function (o) {

					if(attr.on_new)
						attr.on_new(o, wnd);

					else if($p.job_prm.keep_hash){
						o.form_obj(wnd);

					} else{
						o._set_loaded(o.ref);
						$p.iface.set_hash(_mgr.class_name, o.ref);
					}
				});


		}else if(btn_id=="btn_edit") {
			var rId = wnd.elmnts.grid.getSelectedRowId();
			if (rId){
				if(attr.on_edit)
					attr.on_edit(_mgr, rId, wnd);

				else if($p.job_prm.keep_hash){

					_mgr.form_obj(wnd, {ref: rId});

				} else
					$p.iface.set_hash(_mgr.class_name, rId);
			}else
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
			mark_deleted();

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
			wnd.elmnts.tree.items[rId] &&
			wnd.elmnts.tree.getSelectedId() != rId){
			wnd.elmnts.tree.selectItem(rId, true);
			return;
		}

		// запрещаем выбирать элементы, если в метаданных указано выбирать только папки
		// TODO: спозиционировать сообщение над выбранным элементом
		if(rId && folders === true && wnd.elmnts.grid.cells(rId, 0).cell.classList.contains("cell_ref_elm")){
			$p.msg.show_msg($p.msg.select_grp);
			return;
		}


		if((!rId && wnd.elmnts.tree) || (wnd.elmnts.tree && wnd.elmnts.tree.getSelectedId() == rId)){
			if(folders === false){
				$p.msg.show_msg($p.msg.select_elm);
				return;
			}
			rId = wnd.elmnts.tree.getSelectedId();
		}

		if(rId){

			if(attr.on_edit)
				attr.on_edit(_mgr, rId, wnd);

			else if(on_select){

				_mgr.get(rId, true)
					.then(function(selv){
						wnd.close();
						on_select.call(pwnd.grid || pwnd, selv);
					});

			} else if($p.job_prm.keep_hash){

				_mgr.form_obj(wnd, {ref: rId});

			} else
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

	function mark_deleted(){
		var rId = wnd.elmnts.grid.getSelectedRowId();
		if(rId){
			_mgr.get(rId, true, true)
				.then(function (o) {

					dhtmlx.confirm({
						title: $p.msg.main_title,
						text: o._deleted ? $p.msg.mark_undelete_confirm.replace("%1", o.presentation) : $p.msg.mark_delete_confirm.replace("%1", o.presentation),
						cancel: "Отмена",
						callback: function(btn) {
							if(btn)
								o.mark_deleted(!o._deleted);
						}
					});
				});
		}else
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
			_mgr = wnd = _meta = previous_filter = on_select = pwnd = attr = null;
		}
	}

	function frm_close(){

		setTimeout(frm_unload, 10);

		// если в родительском установлен обработчик выгрузки нашего - вызываем с контекстом грида
		if(pwnd.on_unload)
			pwnd.on_unload.call(pwnd.grid || pwnd);

		if(_frm_close){
			$p.eve.detachEvent(_frm_close);
			_frm_close = null;
		}

		return true;
	}

	/**
	 * формирует объект фильтра по значениям элементов формы и позиции пейджинга
	 * @param start {Number} - начальная запись = skip
	 * @param count {Number} - количество записей на странице
	 * @return {*|{value, enumerable}}
	 */
	function get_filter(start, count){
		var filter = wnd.elmnts.filter.get_filter()
				._mixin({
					action: "get_selection",
					metadata: _meta,
					class_name: _mgr.class_name,
					order_by: wnd.elmnts.grid.columnIds[s_col] || s_col,
					direction: a_direction,
					start: start || ((wnd.elmnts.grid.currentPage || 1)-1)*wnd.elmnts.grid.rowsBufferOutSize,
					count: count || wnd.elmnts.grid.rowsBufferOutSize,
					get_header: (previous_filter.get_header == undefined)
				}),
			tparent = has_tree ? wnd.elmnts.tree.getSelectedId() : null;

		if(attr.date_from && !filter.date_from)
			filter.date_from = attr.date_from;

		if(attr.date_till && !filter.date_till)
			filter.date_till = attr.date_till;

		if(attr.initial_value)
			filter.initial_value = attr.initial_value;

		if(attr.custom_selection)
			filter.custom_selection = attr.custom_selection;

		if(attr.selection){
			if(!filter.selection)
				filter.selection = attr.selection;

			else if(Array.isArray(attr.selection)){
				attr.selection.forEach(function (flt) {
					filter.selection.push(flt);
				});

			}else{
				for(var fld in attr.selection){
					if(!res.selection)
						res.selection = [];
					var flt = {};
					flt[fld] = attr.selection[fld];
					filter.selection.push(flt);
				}
			}
			//if(Array.isArray(attr.selection) && attr.selection.length){
			//	filter._mixin(attr.selection[0]);
			//}
		}

		if(attr.owner && !filter.owner)
			filter.owner = attr.owner;

		filter.parent = ((tparent  || attr.parent) && !filter.filter) ? (tparent || attr.parent) : null;
		if(has_tree && !filter.parent)
			filter.parent = $p.utils.blank.guid;


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
	
	/**
	 * подписываемся на событие закрытия формы объекта, чтобы обновить список и попытаться спозиционироваться на нужной строке 
	 */
	var _frm_close = $p.eve.attachEvent("frm_close", function (class_name, ref) {
		if(_mgr && _mgr.class_name == class_name){
			wnd.elmnts.grid.reload()
				.then(function () {
					if(!$p.utils.is_empty_guid(ref))
						wnd.elmnts.grid.selectRowById(ref, false, true, true);
				});
		}
	});

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
			delete _stepper.frm_sync;
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
 * Процедуры импорта и экспорта данных
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module metadata
 * @submodule import_export
 * @requires common
 */


/**
 * ### Экспортирует данные в файл или в строковую переменную или на сервер
 * - Выгружаться может как единичный объект, так и коллекция объектов
 * - В параметрах метода либо интерактивно могут задаваться правила экспорта, такие как:
 *   - Формат формируемого файла (json, xlsx, sql)
 *   - Дополнять ли формируемый файл информацией о метаданных (типы и связи полей)
 *   - Включать ли в формируемый файл данные связанных объектов<br />(например, выгружать вместе с заказом объекты номенклатуры и характеристик)
 *
 * @method export
 * @for DataManager
 * @param attr {Object} - параметры экспорта
 * @param [attr.pwnd] {dhtmlXWindows} - указатель на родительскую форму
 * 
 * @example
 *
 *     //	обработчик нажатия кнопок командной панели формы списка
 *     function toolbar_click(btn_id){
 *       if(btn_id=="btn_import"){
 *         // открываем диалог импорта объектов текущего менеджера
 *         _mgr.import();
 *       }else if(btn_id=="btn_export"){
 *         // открываем диалог экспорта объектов текущего менеджера и передаём ссылку текущей строки
 *         // если ссылка не пустая, будет предложено экспортировать единственный объект
 *         // при необходимости, в диалоге можно указать экспорт всех объектов текущего менеджера
 *         _mgr.export(wnd.elmnts.grid.getSelectedRowId());
 *       }
 *     }
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
						if($p.utils.fix_guid(items[i]) == obj.ref){
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
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module common
 * @submodule events
 */

/**
 * ### Обработчики событий приложения
 *
 * Cм. так же, модули {{#crossLinkModule "events"}}{{/crossLinkModule}} и {{#crossLinkModule "events_browser"}}{{/crossLinkModule}}
 *
 * @class AppEvents
 * @static
 * @menuorder 30
 * @tooltip Движок событий
 */
function AppEvents() {

	this.__define({

		/**
		 * ### Запускает процесс инициализаци параметров и метаданных
		 *
		 * @method run
		 * @for AppEvents
		 *
		 */
		init: {
			value: function () {
				$p.__define("job_prm", {
					value: new JobPrm(),
					writable: false
				});
				$p.wsql.init_params();
			}
		},

		/**
		 * ### Добавляет объекту методы генерации и обработки событий
		 *
		 * @method do_eventable
		 * @for AppEvents
		 * @param obj {Object} - объект, которому будут добавлены eventable свойства
		 */
		do_eventable: {
			value: function (obj) {

				function attach(name, func) {
					name = String(name).toLowerCase();
					if (!this._evnts.data[name])
						this._evnts.data[name] = {};
					var eventId = $p.utils.generate_guid();
					this._evnts.data[name][eventId] = func;
					return eventId;
				}

				function detach(eventId) {

					if(!eventId){
						return detach_all.call(this);
					}

					for (var a in this._evnts.data) {
						var k = 0;
						for (var b in this._evnts.data[a]) {
							if (b == eventId) {
								this._evnts.data[a][b] = null;
								delete this._evnts.data[a][b];
							} else {
								k++;
							}
						}
						if (k == 0) {
							this._evnts.data[a] = null;
							delete this._evnts.data[a];
						}
					}
				}

				 function detach_all() {
					for (var a in this._evnts.data) {
						for (var b in this._evnts.data[a]) {
							this._evnts.data[a][b] = null;
							delete this._evnts.data[a][b];
						}
						this._evnts.data[a] = null;
						delete this._evnts.data[a];
					}
				}

				function call(name, params) {
					name = String(name).toLowerCase();
					if (this._evnts.data[name] == null)
						return true;
					var r = true;
					for (var a in this._evnts.data[name]) {
						r = this._evnts.data[name][a].apply(this, params) && r;
					}
					return r;
				}

				function ontimer() {

					for(var name in this._evnts.evnts){
						var l = this._evnts.evnts[name].length;
						if(l){
							for(var i=0; i<l; i++){
								this.emit(name, this._evnts.evnts[name][i]);
							}
							this._evnts.evnts[name].length = 0;
						}
					}

					this._evnts.timer = 0;
				}

				obj.__define({

					_evnts: {
						value: {
							data: {},
							timer: 0,
							evnts: {}
						}
					},

					on: {
						value: attach
					},

					attachEvent: {
						value: attach
					},

					off: {
						value: detach
					},

					detachEvent: {
						value: detach
					},

					detachAllEvents: {
						value: detach_all
					},

					checkEvent: {
						value: function(name) {
							name = String(name).toLowerCase();
							return (this._evnts.data[name] != null);
						}
					},

					callEvent: {
						value: call
					},

					emit: {
						value: call
					},

					emit_async: {
						value: function callEvent(name, params){

							if(!this._evnts.evnts[name])
								this._evnts.evnts[name] = [];

							this._evnts.evnts[name].push(params);

							if(this._evnts.timer)
								clearTimeout(this._evnts.timer);

							this._evnts.timer = setTimeout(ontimer.bind(this), 4);
						}
					}

				});
			}
		}
	});

	// если мы внутри браузера и загружен dhtmlx, переносим в AppEvents свойства dhx4
	if(typeof window !== "undefined" && window.dhx4){
		for(var p in dhx4){
			this[p] = dhx4[p];
			delete dhx4[p];
		}
		window.dhx4 = this;

	}else if(typeof WorkerGlobalScope === "undefined"){

		// мы внутри Nodejs

		this.do_eventable(this);

	}

}

/**
 * ### Параметры работы программы
 * - Хранит глобальные настройки варианта компиляции (_Заказ дилера_, _Безбумажка_, _Демо_ и т.д.)
 * - Настройки извлекаются из файла "settings" при запуске приложения и дополняются параметрами url,
 * которые могут быть переданы как через search (?), так и через hash (#)
 * - см. так же, {{#crossLink "WSQL/get_user_param:method"}}{{/crossLink}} и {{#crossLink "WSQL/set_user_param:method"}}{{/crossLink}} - параметры, изменяемые пользователем
 *
 * @class JobPrm
 * @static
 * @menuorder 04
 * @tooltip Параметры приложения
 */
function JobPrm(){

	function base_url(){
		return $p.wsql.get_user_param("rest_path") || $p.job_prm.rest_path || "/a/zd/%1/odata/standard.odata/";
	}

	function parse_url(){

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
	}

	this.__define({

		/**
		 * Осуществляет синтаксический разбор параметров url
		 * @method parse_url
		 * @return {Object}
		 */
		parse_url: {
			value: parse_url
		},

		offline: {
			value: false,
			writable: true
		},

		local_storage_prefix: {
			value: "",
			writable: true
		},

		create_tables: {
			value: true,
			writable: true
		},

		/**
		 * Содержит объект с расшифровкой параметров url, указанных при запуске программы
		 * @property url_prm
		 * @type {Object}
		 * @static
		 */
		url_prm: {
			value: typeof window != "undefined" ? parse_url() : {}
		},

		/**
		 * Адрес стандартного интерфейса 1С OData
		 * @method rest_url
		 * @return {string}
		 */
		rest_url: {
			value: function () {
				var url = base_url(),
					zone = $p.wsql.get_user_param("zone", $p.job_prm.zone_is_string ? "string" : "number");
				if(zone)
					return url.replace("%1", zone);
				else
					return url.replace("%1/", "");
			}
		},

		/**
		 * Адрес http интерфейса библиотеки интеграции
		 * @method irest_url
		 * @return {string}
		 */
		irest_url: {
			value: function () {
				var url = base_url(),
					zone = $p.wsql.get_user_param("zone", $p.job_prm.zone_is_string ? "string" : "number");
				url = url.replace("odata/standard.odata", "hs/rest");
				if(zone)
					return url.replace("%1", zone);
				else
					return url.replace("%1/", "");
			}
		}
	});

	// подмешиваем параметры, заданные в файле настроек сборки
	$p.eve.callEvent("settings", [this]);

	// подмешиваем параметры url
	// Они обладают приоритетом над настройками по умолчанию и настройками из settings.js
	for(var prm_name in this){
		if(prm_name !== "url_prm" && typeof this[prm_name] !== "function" && this.url_prm.hasOwnProperty[prm_name])
			this[prm_name] = this.url_prm[prm_name];
	}

}

/**
 * ### Модификатор отложенного запуска
 * Служебный объект, реализующий отложенную загрузку модулей,<br />
 * в которых доопределяется (переопределяется) поведение объектов и менеджеров конкретных типов
 *
 * @class Modifiers
 * @constructor
 * @menuorder 62
 * @tooltip Внешние модули
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
	 * @method detache
	 * @param method {Function}
	 */
	this.detache = function (method) {
		var index = methods.indexOf(method);
		if(index != -1)
			methods.splice(index, 1);
	};

	/**
	 * Отменяет все подписки
	 * @method clear
	 */
	this.clear = function () {
		methods.length = 0;
	};

	/**
	 * Загружает и выполняет методы модификаторов
	 * @method execute
	 */
	this.execute = function (context) {

		// выполняем вшитые в сборку модификаторы
		var res, tres;
		methods.forEach(function (method) {
			if(typeof method === "function")
				tres = method(context);
			else
				tres = $p.injected_data[method](context);
			if(res !== false)
				res = tres;
		});
		return res;
	};

	/**
	 * выполняет подключаемые модификаторы
	 * @method execute_external
	 * @param data
	 */
	this.execute_external = function (data) {

		var paths = $p.wsql.get_user_param("modifiers");

		if(paths){
			paths = paths.split('\n').map(function (path) {
				if(path)
					return new Promise(function(resolve, reject){
						$p.load_script(path, "script", resolve);
					});
				else
					return Promise.resolve();
			});
		}else
			paths = [];

		return Promise.all(paths)
			.then(function () {
				this.execute(data);
			}.bind(this));
	};

}


/**
 * Этот фрагмент кода выполняем только в браузере
 * Created 28.12.2015<br />
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module common
 * @submodule events.ui
 */

$p.eve.__define({

	/**
	 * Устанавливает состояние online/offline в параметрах работы программы
	 * @method set_offline
	 * @for AppEvents
	 * @param offline {Boolean}
	 */
	set_offline: {
		value: function(offline){
			var current_offline = $p.job_prm['offline'];
			$p.job_prm['offline'] = !!(offline || $p.wsql.get_user_param('offline', 'boolean'));
			if(current_offline != $p.job_prm['offline']){
				// предпринять действия
				current_offline = $p.job_prm['offline'];

			}
		}
	},

	/**
	 * Тип устройства и ориентация экрана
	 * @method on_rotate
	 * @for AppEvents
	 * @param e {Event}
	 */
	on_rotate: {
		value: function (e) {
			$p.job_prm.device_orient = (window.orientation == 0 || window.orientation == 180 ? "portrait":"landscape");
			if (typeof(e) != "undefined")
				$p.eve.callEvent("onOrientationChange", [$p.job_prm.device_orient]);
		}
	},

	/**
	 * Шаги синхронизации (перечисление состояний)
	 * @property steps
	 * @for AppEvents
	 * @type SyncSteps
	 */
	steps: {
		value: {
			load_meta: 0,           // загрузка метаданных из файла
			authorization: 1,       // авторизация на сервере 1С или Node (в автономном режиме шаг не выполняется)
			create_managers: 2,     // создание менеджеров объектов
			process_access:  3,     // загрузка данных пользователя, обрезанных по RLS (контрагенты, договоры, организации)
			load_data_files: 4,     // загрузка данных из файла зоны
			load_data_db: 5,        // догрузка данных с сервера 1С или Node
			load_data_wsql: 6,      // загрузка данных из локальной датабазы (имеет смысл, если локальная база не в ОЗУ)
			save_data_wsql: 7       // кеширование данных из озу в локальную датабазу
		}
	},

	/**
	 * Авторизация на сервере 1С
	 * @method log_in
	 * @for AppEvents
	 * @param onstep {Function} - callback обработки состояния. Функция вызывается в начале шага
	 * @return {Promise.<T>} - промис, ошибки которого должен обработать вызывающий код
	 * @async
	 */
	log_in: {
		value: function(onstep){

			var irest_attr = {},
				mdd;

			// информируем о начале операций
			onstep($p.eve.steps.load_meta);

			// выясняем, доступен ли irest (наш сервис) или мы ограничены стандартным rest-ом
			// параллельно, проверяем авторизацию
			$p.ajax.default_attr(irest_attr, $p.job_prm.irest_url());

			return ($p.job_prm.offline ? Promise.resolve({responseURL: "", response: ""}) : $p.ajax.get_ex(irest_attr.url, irest_attr))

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
					mdd = res;
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
					$p.eve.callEvent("log_in", [$p.ajax.authorized = true]);

					if(typeof res == "string")
						res = JSON.parse(res);

					if($p.msg.check_soap_result(res))
						return;

					if($p.wsql.get_user_param("enable_save_pwd"))
						$p.wsql.set_user_param("user_pwd", $p.ajax.password);

					else if($p.wsql.get_user_param("user_pwd"))
						$p.wsql.set_user_param("user_pwd", "");

					// сохраняем разницу времени с сервером
					if(res.now_1c && res.now_js)
						$p.wsql.set_user_param("time_diff", res.now_1c - res.now_js);

				})

				// читаем справочники с ограниченным доступом, которые могли прибежать вместе с метаданными
				.then(function () {

					// здесь же, уточняем список печатных форм
					_md.printing_plates(mdd.printing_plates);

				});
		}
	}

});


/**
 * Этот фрагмент кода выполняем только в браузере
 * События окна внутри воркера и Node нас не интересуют
 */
(function(w, eve, msg){

	var timer_setted = false,
		cache;

	/**
	 * Отслеживаем онлайн
	 */
	w.addEventListener('online', eve.set_offline);
	w.addEventListener('offline', function(){eve.set_offline(true);});

	/**
	 * ждём готовности документа
	 */
	w.addEventListener('load', function(){

		/**
		 * Инициализацию выполняем с небольшой задержкой,
		 * чтобы позволить сторонним скриптам подписаться на событие onload и сделать свои черные дела
		 */
		setTimeout(function () {

			/**
			 * Метод может быть вызван сторонним сайтом через post_message
			 * @param url
			 */
			function navigate(url){
				if(url && (location.origin + location.pathname).indexOf(url)==-1)
					location.replace(url);
			}

			/**
			 * Инициализируем параметры пользователя,
			 * проверяем offline и версию файлов
			 */
			function init_params(){

				function load_css(){

					var surl = dhtmlx.codebase, load_dhtmlx = true, load_meta = true;
					if(surl.indexOf("cdn.jsdelivr.net")!=-1)
						surl = "//cdn.jsdelivr.net/metadata/latest/";

					// стили загружаем только при необходимости
					for(var i=0; i < document.styleSheets.length; i++){
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
					step_size: 57,
					files: 0
				};

				eve.set_offline(!navigator.onLine);

				// инициализируем метаданные и обработчик при начале работы интерфейса
				setTimeout(function () {

					// устанавливаем параметры localStorage
					$p.wsql.init_params();

					// читаем локальные данные в ОЗУ
					$p.wsql.pouch.load_data()
						.catch($p.record_log);

					// если есть сплэш, удаляем его
					var splash;
					if(splash = document.querySelector("#splash"))
						splash.parentNode.removeChild(splash);

					eve.callEvent("iface_init", [$p]);

				}, 10);


				msg.russian_names();

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
					//cache.addEventListener('downloading', do_cache_update_msg, false);

					// Процесс скачивания ресурсов. Индикатор прогресса изменяется
					//cache.addEventListener('progress', do_cache_update_msg,	false);

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
			}

			// проверяем совместимость браузера
			if(!w.JSON || !w.indexedDB){
				eve.redirect = true;
				msg.show_msg({type: "alert-error", text: msg.unsupported_browser, title: msg.unsupported_browser_title});
				throw msg.unsupported_browser;
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
			$p.__define("job_prm", {
				value: new JobPrm(),
				writable: false
			});

			/**
			 * если в job_prm указано использование геолокации, геокодер инициализируем с небольшой задержкой
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
			if ($p.job_prm.use_google_geo) {

				// подгружаем скрипты google
				if(!window.google || !window.google.maps){
					$p.on("iface_init", function () {
						setTimeout(function(){
							$p.load_script("//maps.google.com/maps/api/js?callback=$p.ipinfo.location_callback", "script", function(){});
						}, 100);
					});

				}else
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

			if(typeof(w.orientation)=="undefined")
				$p.job_prm.device_orient = w.innerWidth>w.innerHeight ? "landscape" : "portrait";
			else
				eve.on_rotate();
			w.addEventListener("orientationchange", eve.on_rotate, false);

			$p.job_prm.__define("device_type", {
				get: function () {
					var device_type = $p.wsql.get_user_param("device_type");
					if(!device_type){
						device_type = (function(i){return (i<800?"phone":(i<1024?"tablet":"desktop"));})(Math.max(screen.width, screen.height));
						$p.wsql.set_user_param("device_type", device_type);
					}
					return device_type;
				},
				set: function (v) {
					$p.wsql.set_user_param("device_type", v);
				}
			});


			/**
			 * слушаем события клавиатуры
			 */
			document.body.addEventListener("keydown", function (ev) {
				eve.callEvent("keydown", [ev]);
			}, false);

			setTimeout(init_params, 10);

		}, 10);

		function do_reload(){
			if(!$p.ajax.authorized){
				eve.redirect = true;
				location.reload(true);
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

})(window, $p.eve, $p.msg);

/**
 * Объекты для доступа к геокодерам Яндекс, Google и sypexgeo<br />
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016<br />
 * Created 16.04.2016
 *
 * @module geocoding
 */

/**
 * ### Данные геолокации
 * Объект предоставляет доступ к функциям _геокодирования браузера_, а так же - геокодерам _Яндекс_ и _Гугл_
 *
 * @class IPInfo
 * @static
 * @menuorder 60
 * @tooltip Данные геолокации
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

		/**
		 * Выполняет синтаксический разбор частей адреса
		 */
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
		},

		/**
		 * Функция обратного вызова для карт Google
		 */
		location_callback: {
			value: function(){

				_ggeocoder = new google.maps.Geocoder();

				$p.eve.callEvent("geo_google_ready");

				if(navigator.geolocation)
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

								$p.eve.callEvent("geo_current_position", [$p.ipinfo.components({}, _parts.address_components)]);
							}
						});

					}, $p.record_log, {
						timeout: 30000
					}
				);
			}
		}
	});
	
}

/**
 * Конструкторы табличных документов печатных форм и отчетов<br/>
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016<br/>
 * Created 17.04.2016
 *
 * @module reporting
 */

/**
 * Объект для построения печатных форм и отчетов
 *
 * @param [attr] {Object} - размер листа, ориентация, поля и т.д.
 * @constructor
 */
function SpreadsheetDocument(attr) {

	this._attr = {
		orientation: "portrait",
		title: "",
		content: document.createElement("DIV")
	};

	if(attr && typeof attr == "string"){
		this.content = attr;

	} else if(typeof attr == "object"){
		this._mixin(attr);
	}
	attr = null;
}
SpreadsheetDocument.prototype.__define({

	clear: {
		value: function () {
			while (this._attr.content.firstChild) {
				this._attr.content.removeChild(this._attr.content.firstChild);
			}
		}
	},

	/**
	 * Выводит область ячеек в табличный документ
	 */
	put: {
		value: function (range, attr) {

			var elm;

			if(range instanceof HTMLElement){
				elm = document.createElement(range.tagName);
				elm.innerHTML = range.innerHTML;
				if(!attr)
					attr = range.attributes;
			}else{
				elm = document.createElement("DIV");
				elm.innerHTML = range;
			}

			if(attr){
				Object.keys(attr).forEach(function (key) {
					if(key == "id" || attr[key].name == "id")
						return;
					elm.setAttribute(attr[key].name || key, attr[key].value || attr[key]);
				});
			}

			this._attr.content.appendChild(elm);
		}
	},

	content: {
		get: function () {
			return this._attr.content
		},
		set: function (v) {

			this.clear();

			if(typeof v == "string")
				this._attr.content.innerHTML = v;

			else if(v instanceof HTMLElement)
				this._attr.content.innerHTML = v.innerHTML;

		}
	},

	title: {
		get: function () {
			return this._attr.title
		},
		set: function (v) {

			this._attr.title = v;

		}
	}
});

/**
 * Экспортируем конструктор SpreadsheetDocument, чтобы экземпляры печатного документа можно было создать снаружи
 * @property SpreadsheetDocument
 * @for MetaEngine
 * @type {function}
 */
$p.SpreadsheetDocument = SpreadsheetDocument;


/**
 * Табличный документ для экранных отчетов
 * @param container {HTMLElement|dhtmlXCellObject} - элемент DOM, в котором будет размещена таблица
 * @param [attr] {Object} - атрибуты инициплизации  
 * @constructor
 */
function HandsontableDocument(container, attr) {

	var init = function () {
		
		if(this._then)
			this._then(this);

	}.bind(this);
	
	this._online = (attr && attr.allow_offline) || (navigator.onLine && $p.wsql.pouch.authorized);
	
	if(container instanceof dhtmlXCellObject){
		this._cont = document.createElement('div');
		container.detachObject(true);
		container.attachObject(this._cont);
	}else{
		this._cont = container;
	}

	this._cont.classList.add("handsontable_wrapper");
	if(!this._online){
		this._cont.innerHTML = $p.msg.report_need_online;
	}else{
		this._cont.innerHTML = attr.autorun ? $p.msg.report_prepare : $p.msg.report_need_prepare;
	}

	this.then = function (callback) {
		this._then = callback;
		return this;
	};

	this.requery = function (opt) {

		if(this.hot)
			this.hot.destroy();

		if(opt instanceof Error){
			this._cont.innerHTML = $p.msg.report_error + (opt.name ? " <b>" + opt.name + "</b>" : "") + (opt.message ? " " + opt.message : "");
		}else{
			this._cont.innerHTML = "";
			this.hot = new Handsontable(this._cont, opt);
		}
	};


	// отложенная загрузка handsontable и зависимостей
	if(typeof Handsontable != "function" && this._online){

		$p.load_script("https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.4.0/pikaday.min.js","script")
			.then(function () {
				return $p.load_script("https://cdnjs.cloudflare.com/ajax/libs/numbro/1.9.2/numbro.min.js","script")
			})
			.then(function () {
				return $p.load_script("https://cdn.jsdelivr.net/g/zeroclipboard,handsontable@0.26(handsontable.min.js)","script")
			})
			.then(function () {
				return Promise.all([
					$p.load_script("https://cdn.jsdelivr.net/handsontable/0.26/handsontable.min.css","link"),
					$p.load_script("https://cdnjs.cloudflare.com/ajax/libs/numbro/1.9.2/languages/ru-RU.min.js","script")
				]);
			})
			.then(init);

	}else{
		setTimeout(init);
	}
	
}

/**
 * Экспортируем конструктор HandsontableDocument, чтобы экземпляры табличного документа можно было создать снаружи
 * @property HandsontableDocument
 * @for MetaEngine
 * @type {function}
 */
$p.HandsontableDocument = HandsontableDocument;
$p.injected_data._mixin({"form_auth.xml":"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<items>\n\t<item type=\"settings\" position=\"label-left\" labelWidth=\"80\" inputWidth=\"180\" noteWidth=\"180\"/>\n\t<item type=\"fieldset\" name=\"data\" inputWidth=\"auto\" label=\"Авторизация\">\n\n        <item type=\"radio\" name=\"type\" labelWidth=\"auto\" position=\"label-right\" checked=\"true\" value=\"guest\" label=\"Гостевой (демо) режим\">\n            <item type=\"select\" name=\"guest\" label=\"Роль\">\n                <option value=\"Дилер\" label=\"Дилер\"/>\n            </item>\n        </item>\n\n\t\t<item type=\"radio\" name=\"type\" labelWidth=\"auto\" position=\"label-right\" value=\"auth\" label=\"Есть учетная запись\">\n\t\t\t<item type=\"input\" value=\"\" name=\"login\" label=\"Логин\" validate=\"NotEmpty\" />\n\t\t\t<item type=\"password\" value=\"\" name=\"password\" label=\"Пароль\" validate=\"NotEmpty\" />\n\t\t</item>\n\n\t\t<item type=\"button\" value=\"Войти\" name=\"submit\"/>\n\n        <item type=\"template\" name=\"text_options\" className=\"order_dealer_options\" inputWidth=\"170\"\n              value=\"&lt;a href='#' onclick='$p.iface.open_settings();' title='Страница настроек программы' &gt; &lt;i class='fa fa-cog fa-lg'&gt;&lt;/i&gt; Настройки &lt;/a&gt; &lt;a href='//www.oknosoft.ru/feedback' target='_blank' style='margin-left: 9px;' title='Задать вопрос через форму обратной связи' &gt; &lt;i class='fa fa-question-circle fa-lg'&gt;&lt;/i&gt; Вопрос &lt;/a&gt;\"  />\n\n\t</item>\n</items>","toolbar_add_del.xml":"<?xml version=\"1.0\" encoding='utf-8'?>\r\n<toolbar>\r\n    <item id=\"sep0\" type=\"separator\"/>\r\n    <item type=\"button\" id=\"btn_add\"    text=\"&lt;i class='fa fa-plus-circle fa-fw'&gt;&lt;/i&gt; Добавить\" title=\"Добавить строку\"  />\r\n    <item type=\"button\" id=\"btn_delete\" text=\"&lt;i class='fa fa-times fa-fw'&gt;&lt;/i&gt; Удалить\"  title=\"Удалить строку\" />\r\n</toolbar>","toolbar_obj.xml":"<?xml version=\"1.0\" encoding='utf-8'?>\r\n<toolbar>\r\n    <item id=\"sep0\" type=\"separator\"/>\r\n    <item type=\"button\" id=\"btn_save_close\" text=\"&lt;b&gt;Записать и закрыть&lt;/b&gt;\" title=\"Рассчитать, записать и закрыть\" />\r\n    <item type=\"button\" id=\"btn_save\" text=\"&lt;i class='fa fa-floppy-o fa-fw'&gt;&lt;/i&gt;\" title=\"Рассчитать и записать данные\"/>\r\n    <item type=\"button\" id=\"btn_post\" enabled=\"false\" text=\"&lt;i class='fa fa-check-square-o fa-fw'&gt;&lt;/i&gt;\" title=\"Провести документ\" />\r\n    <item type=\"button\" id=\"btn_unpost\" enabled=\"false\" text=\"&lt;i class='fa fa-square-o fa-fw'&gt;&lt;/i&gt;\" title=\"Отмена проведения\" />\r\n\r\n    <item type=\"button\" id=\"btn_files\" text=\"&lt;i class='fa fa-paperclip fa-fw'&gt;&lt;/i&gt;\" title=\"Присоединенные файлы\"/>\r\n\r\n    <item type=\"buttonSelect\" id=\"bs_print\" text=\"&lt;i class='fa fa-print fa-fw'&gt;&lt;/i&gt;\" title=\"Печать\" openAll=\"true\">\r\n    </item>\r\n\r\n    <item type=\"buttonSelect\" id=\"bs_create_by_virtue\" text=\"&lt;i class='fa fa-bolt fa-fw'&gt;&lt;/i&gt;\" title=\"Создать на основании\" openAll=\"true\" >\r\n        <item type=\"button\" id=\"btn_message\" enabled=\"false\" text=\"Сообщение\" />\r\n    </item>\r\n\r\n    <item type=\"buttonSelect\" id=\"bs_go_to\" text=\"&lt;i class='fa fa-external-link fa-fw'&gt;&lt;/i&gt;\" title=\"Перейти\" openAll=\"true\" >\r\n        <item type=\"button\" id=\"btn_go_connection\" enabled=\"false\" text=\"Связи\" />\r\n    </item>\r\n\r\n    <item type=\"buttonSelect\"   id=\"bs_more\"  text=\"&lt;i class='fa fa-th-large fa-fw'&gt;&lt;/i&gt;\"  title=\"Дополнительно\" openAll=\"true\">\r\n\r\n        <item type=\"button\" id=\"btn_import\" text=\"&lt;i class='fa fa-upload fa-fw'&gt;&lt;/i&gt; Загрузить из файла\" />\r\n        <item type=\"button\" id=\"btn_export\" text=\"&lt;i class='fa fa-download fa-fw'&gt;&lt;/i&gt; Выгрузить в файл\" />\r\n    </item>\r\n\r\n    <item id=\"sep1\" type=\"separator\"/>\r\n    <item type=\"button\" id=\"btn_close\" text=\"&lt;i class='fa fa-times fa-fw'&gt;&lt;/i&gt;\" title=\"Закрыть форму\"/>\r\n    <item id=\"sep2\" type=\"separator\"/>\r\n\r\n</toolbar>\r\n","toolbar_ok_cancel.xml":"<?xml version=\"1.0\" encoding='utf-8'?>\r\n<toolbar>\r\n    <item id=\"btn_ok\"       type=\"button\"   img=\"\"  imgdis=\"\"   text=\"&lt;b&gt;Ок&lt;/b&gt;\"  />\r\n    <item id=\"btn_cancel\"   type=\"button\"\timg=\"\"  imgdis=\"\"   text=\"Отмена\" />\r\n</toolbar>","toolbar_rep.xml":"<?xml version=\"1.0\" encoding='utf-8'?>\r\n<toolbar>\r\n    <item id=\"sep0\" type=\"separator\"/>\r\n    <item type=\"button\" id=\"btn_run\" text=\"&lt;i class='fa fa-play fa-fw'&gt;&lt;/i&gt; Сформировать\" title=\"Сформировать отчет\"/>\r\n\r\n    <item type=\"buttonSelect\"   id=\"bs_more\"  text=\"&lt;i class='fa fa-th-large fa-fw'&gt;&lt;/i&gt;\"  title=\"Дополнительно\" openAll=\"true\">\r\n\r\n        <item type=\"button\" id=\"btn_print\" text=\"&lt;i class='fa fa-print fa-fw'&gt;&lt;/i&gt; Печать\" />\r\n\r\n        <item id=\"sep3\" type=\"separator\"/>\r\n\r\n        <item type=\"button\" id=\"btn_export\" text=\"&lt;i class='fa fa-file-excel-o fa-fw'&gt;&lt;/i&gt; Выгрузить в файл\" />\r\n\r\n        <item id=\"sep4\" type=\"separator\"/>\r\n\r\n        <item type=\"button\" id=\"btn_import\" text=\"&lt;i class='fa fa-folder-open-o fa-fw'&gt;&lt;/i&gt; Выбрать вариант\" />\r\n        <item type=\"button\" id=\"btn_export\" text=\"&lt;i class='fa fa-floppy-o fa-fw'&gt;&lt;/i&gt; Сохранить вариант\" />\r\n\r\n    </item>\r\n\r\n    <item id=\"sep1\" type=\"separator\"/>\r\n\r\n</toolbar>\r\n","toolbar_selection.xml":"<?xml version=\"1.0\" encoding='utf-8'?>\r\n<toolbar>\r\n\r\n    <item id=\"sep0\" type=\"separator\"/>\r\n\r\n    <item id=\"btn_select\"   type=\"button\"   title=\"Выбрать элемент списка\" text=\"&lt;b&gt;Выбрать&lt;/b&gt;\"  />\r\n\r\n    <item id=\"sep1\" type=\"separator\"/>\r\n    <item id=\"btn_new\"      type=\"button\"\ttext=\"&lt;i class='fa fa-plus-circle fa-fw'&gt;&lt;/i&gt;\"\ttitle=\"Создать\" />\r\n    <item id=\"btn_edit\"     type=\"button\"\ttext=\"&lt;i class='fa fa-pencil fa-fw'&gt;&lt;/i&gt;\"\ttitle=\"Изменить\" />\r\n    <item id=\"btn_delete\"   type=\"button\"\ttext=\"&lt;i class='fa fa-times fa-fw'&gt;&lt;/i&gt;\"\ttitle=\"Удалить\" />\r\n    <item id=\"sep2\" type=\"separator\"/>\r\n\r\n    <item type=\"buttonSelect\" id=\"bs_print\" text=\"&lt;i class='fa fa-print fa-fw'&gt;&lt;/i&gt; Печать\" openAll=\"true\" >\r\n    </item>\r\n\r\n    <item type=\"buttonSelect\"   id=\"bs_more\"    text=\"&lt;i class='fa fa-th-large fa-fw'&gt;&lt;/i&gt;\" title=\"Дополнительно\" openAll=\"true\">\r\n        <item id=\"btn_requery\"  type=\"button\"\ttext=\"&lt;i class='fa fa-refresh fa-fw'&gt;&lt;/i&gt; Обновить список\" />\r\n    </item>\r\n\r\n    <item id=\"sep3\" type=\"separator\"/>\r\n\r\n</toolbar>"});
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
/**
* AES implementation in JavaScript                                   (c) Chris Veness 2005-2016
*                                                                                   MIT Licence
* www.movable-type.co.uk/scripts/aes.html
*/



/**
 * AES (Rijndael cipher) encryption routines,
 *
 * Reference implementation of FIPS-197 http://csrc.nist.gov/publications/fips/fips197/fips-197.pdf.
 *
 * @namespace
 */
function Aes(default_key) {

	'use strict';


	var Aes = this;


	/**
	 * AES Cipher function: encrypt 'input' state with Rijndael algorithm [§5.1];
	 *   applies Nr rounds (10/12/14) using key schedule w for 'add round key' stage.
	 *
	 * @param   {number[]}   input - 16-byte (128-bit) input state array.
	 * @param   {number[][]} w - Key schedule as 2D byte-array (Nr+1 x Nb bytes).
	 * @returns {number[]}   Encrypted output state array.
	 */
	Aes.cipher = function(input, w) {
		var Nb = 4;               // block size (in words): no of columns in state (fixed at 4 for AES)
		var Nr = w.length/Nb - 1; // no of rounds: 10/12/14 for 128/192/256-bit keys

		var state = [[],[],[],[]];  // initialise 4xNb byte-array 'state' with input [§3.4]
		for (var i=0; i<4*Nb; i++) state[i%4][Math.floor(i/4)] = input[i];

		state = Aes.addRoundKey(state, w, 0, Nb);

		for (var round=1; round<Nr; round++) {
			state = Aes.subBytes(state, Nb);
			state = Aes.shiftRows(state, Nb);
			state = Aes.mixColumns(state, Nb);
			state = Aes.addRoundKey(state, w, round, Nb);
		}

		state = Aes.subBytes(state, Nb);
		state = Aes.shiftRows(state, Nb);
		state = Aes.addRoundKey(state, w, Nr, Nb);

		var output = new Array(4*Nb);  // convert state to 1-d array before returning [§3.4]
		for (var i=0; i<4*Nb; i++) output[i] = state[i%4][Math.floor(i/4)];

		return output;
	};


	/**
	 * Perform key expansion to generate a key schedule from a cipher key [§5.2].
	 *
	 * @param   {number[]}   key - Cipher key as 16/24/32-byte array.
	 * @returns {number[][]} Expanded key schedule as 2D byte-array (Nr+1 x Nb bytes).
	 */
	Aes.keyExpansion = function(key) {
		var Nb = 4;            // block size (in words): no of columns in state (fixed at 4 for AES)
		var Nk = key.length/4; // key length (in words): 4/6/8 for 128/192/256-bit keys
		var Nr = Nk + 6;       // no of rounds: 10/12/14 for 128/192/256-bit keys

		var w = new Array(Nb*(Nr+1));
		var temp = new Array(4);

		// initialise first Nk words of expanded key with cipher key
		for (var i=0; i<Nk; i++) {
			var r = [key[4*i], key[4*i+1], key[4*i+2], key[4*i+3]];
			w[i] = r;
		}

		// expand the key into the remainder of the schedule
		for (var i=Nk; i<(Nb*(Nr+1)); i++) {
			w[i] = new Array(4);
			for (var t=0; t<4; t++) temp[t] = w[i-1][t];
			// each Nk'th word has extra transformation
			if (i % Nk == 0) {
				temp = Aes.subWord(Aes.rotWord(temp));
				for (var t=0; t<4; t++) temp[t] ^= Aes.rCon[i/Nk][t];
			}
			// 256-bit key has subWord applied every 4th word
			else if (Nk > 6 && i%Nk == 4) {
				temp = Aes.subWord(temp);
			}
			// xor w[i] with w[i-1] and w[i-Nk]
			for (var t=0; t<4; t++) w[i][t] = w[i-Nk][t] ^ temp[t];
		}

		return w;
	};


	/**
	 * Apply SBox to state S [§5.1.1]
	 * @private
	 */
	Aes.subBytes = function(s, Nb) {
		for (var r=0; r<4; r++) {
			for (var c=0; c<Nb; c++) s[r][c] = Aes.sBox[s[r][c]];
		}
		return s;
	};


	/**
	 * Shift row r of state S left by r bytes [§5.1.2]
	 * @private
	 */
	Aes.shiftRows = function(s, Nb) {
		var t = new Array(4);
		for (var r=1; r<4; r++) {
			for (var c=0; c<4; c++) t[c] = s[r][(c+r)%Nb];  // shift into temp copy
			for (var c=0; c<4; c++) s[r][c] = t[c];         // and copy back
		}          // note that this will work for Nb=4,5,6, but not 7,8 (always 4 for AES):
		return s;  // see asmaes.sourceforge.net/rijndael/rijndaelImplementation.pdf
	};


	/**
	 * Combine bytes of each col of state S [§5.1.3]
	 * @private
	 */
	Aes.mixColumns = function(s, Nb) {
		for (var c=0; c<4; c++) {
			var a = new Array(4);  // 'a' is a copy of the current column from 's'
			var b = new Array(4);  // 'b' is a•{02} in GF(2^8)
			for (var i=0; i<4; i++) {
				a[i] = s[i][c];
				b[i] = s[i][c]&0x80 ? s[i][c]<<1 ^ 0x011b : s[i][c]<<1;
			}
			// a[n] ^ b[n] is a•{03} in GF(2^8)
			s[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3]; // {02}•a0 + {03}•a1 + a2 + a3
			s[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3]; // a0 • {02}•a1 + {03}•a2 + a3
			s[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3]; // a0 + a1 + {02}•a2 + {03}•a3
			s[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3]; // {03}•a0 + a1 + a2 + {02}•a3
		}
		return s;
	};


	/**
	 * Xor Round Key into state S [§5.1.4]
	 * @private
	 */
	Aes.addRoundKey = function(state, w, rnd, Nb) {
		for (var r=0; r<4; r++) {
			for (var c=0; c<Nb; c++) state[r][c] ^= w[rnd*4+c][r];
		}
		return state;
	};


	/**
	 * Apply SBox to 4-byte word w
	 * @private
	 */
	Aes.subWord = function(w) {
		for (var i=0; i<4; i++) w[i] = Aes.sBox[w[i]];
		return w;
	};


	/**
	 * Rotate 4-byte word w left by one byte
	 * @private
	 */
	Aes.rotWord = function(w) {
		var tmp = w[0];
		for (var i=0; i<3; i++) w[i] = w[i+1];
		w[3] = tmp;
		return w;
	};


// sBox is pre-computed multiplicative inverse in GF(2^8) used in subBytes and keyExpansion [§5.1.1]
	Aes.sBox =  [0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
		0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
		0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
		0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
		0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
		0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
		0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
		0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
		0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
		0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
		0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
		0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
		0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
		0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
		0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
		0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];


// rCon is Round Constant used for the Key Expansion [1st col is 2^(r-1) in GF(2^8)] [§5.2]
	Aes.rCon = [ [0x00, 0x00, 0x00, 0x00],
		[0x01, 0x00, 0x00, 0x00],
		[0x02, 0x00, 0x00, 0x00],
		[0x04, 0x00, 0x00, 0x00],
		[0x08, 0x00, 0x00, 0x00],
		[0x10, 0x00, 0x00, 0x00],
		[0x20, 0x00, 0x00, 0x00],
		[0x40, 0x00, 0x00, 0x00],
		[0x80, 0x00, 0x00, 0x00],
		[0x1b, 0x00, 0x00, 0x00],
		[0x36, 0x00, 0x00, 0x00] ];


	/**
	 * Aes.Ctr: Counter-mode (CTR) wrapper for AES.
	 *
	 * This encrypts a Unicode string to produces a base64 ciphertext using 128/192/256-bit AES,
	 * and the converse to decrypt an encrypted ciphertext.
	 *
	 * See http://csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf
	 *
	 * @augments Aes
	 */
	Aes.Ctr = {};


	/**
	 * Encrypt a text using AES encryption in Counter mode of operation.
	 *
	 * Unicode multi-byte character safe
	 *
	 * @param   {string} plaintext - Source text to be encrypted.
	 * @param   {string} password - The password to use to generate a key for encryption.
	 * @param   {number} nBits - Number of bits to be used in the key; 128 / 192 / 256.
	 * @returns {string} Encrypted text.
	 *
	 * @example
	 *   var encr = Aes.Ctr.encrypt('big secret', 'pāşšŵōřđ', 256); // 'lwGl66VVwVObKIr6of8HVqJr'
	 */
	Aes.Ctr.encrypt = function(plaintext, password, nBits) {
		var blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
		if (!(nBits==128 || nBits==192 || nBits==256))
			nBits = 128;
		plaintext = utf8Encode(plaintext);
		password = utf8Encode(password || default_key);

		// use AES itself to encrypt password to get cipher key (using plain password as source for key
		// expansion) - gives us well encrypted key (though hashed key might be preferred for prod'n use)
		var nBytes = nBits/8;  // no bytes in key (16/24/32)
		var pwBytes = new Array(nBytes);
		for (var i=0; i<nBytes; i++) {  // use 1st 16/24/32 chars of password for key
			pwBytes[i] = i<password.length ?  password.charCodeAt(i) : 0;
		}
		var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes)); // gives us 16-byte key
		key = key.concat(key.slice(0, nBytes-16));  // expand key to 16/24/32 bytes long

		// initialise 1st 8 bytes of counter block with nonce (NIST SP800-38A §B.2): [0-1] = millisec,
		// [2-3] = random, [4-7] = seconds, together giving full sub-millisec uniqueness up to Feb 2106
		var counterBlock = new Array(blockSize);

		var nonce = (new Date()).getTime();  // timestamp: milliseconds since 1-Jan-1970
		var nonceMs = nonce%1000;
		var nonceSec = Math.floor(nonce/1000);
		var nonceRnd = Math.floor(Math.random()*0xffff);
		// for debugging: nonce = nonceMs = nonceSec = nonceRnd = 0;

		for (var i=0; i<2; i++) counterBlock[i]   = (nonceMs  >>> i*8) & 0xff;
		for (var i=0; i<2; i++) counterBlock[i+2] = (nonceRnd >>> i*8) & 0xff;
		for (var i=0; i<4; i++) counterBlock[i+4] = (nonceSec >>> i*8) & 0xff;

		// and convert it to a string to go on the front of the ciphertext
		var ctrTxt = '';
		for (var i=0; i<8; i++) ctrTxt += String.fromCharCode(counterBlock[i]);

		// generate key schedule - an expansion of the key into distinct Key Rounds for each round
		var keySchedule = Aes.keyExpansion(key);

		var blockCount = Math.ceil(plaintext.length/blockSize);
		var ciphertext = '';

		for (var b=0; b<blockCount; b++) {
			// set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
			// done in two stages for 32-bit ops: using two words allows us to go past 2^32 blocks (68GB)
			for (var c=0; c<4; c++) counterBlock[15-c] = (b >>> c*8) & 0xff;
			for (var c=0; c<4; c++) counterBlock[15-c-4] = (b/0x100000000 >>> c*8);

			var cipherCntr = Aes.cipher(counterBlock, keySchedule);  // -- encrypt counter block --

			// block size is reduced on final block
			var blockLength = b<blockCount-1 ? blockSize : (plaintext.length-1)%blockSize+1;
			var cipherChar = new Array(blockLength);

			for (var i=0; i<blockLength; i++) {
				// -- xor plaintext with ciphered counter char-by-char --
				cipherChar[i] = cipherCntr[i] ^ plaintext.charCodeAt(b*blockSize+i);
				cipherChar[i] = String.fromCharCode(cipherChar[i]);
			}
			ciphertext += cipherChar.join('');

			// if within web worker, announce progress every 1000 blocks (roughly every 50ms)
			if (typeof WorkerGlobalScope != 'undefined' && self instanceof WorkerGlobalScope) {
				if (b%1000 == 0) self.postMessage({ progress: b/blockCount });
			}
		}

		ciphertext =  base64Encode(ctrTxt+ciphertext);

		return ciphertext;
	};


	/**
	 * Decrypt a text encrypted by AES in counter mode of operation
	 *
	 * @param   {string} ciphertext - Cipher text to be decrypted.
	 * @param   {string} password - Password to use to generate a key for decryption.
	 * @param   {number} nBits - Number of bits to be used in the key; 128 / 192 / 256.
	 * @returns {string} Decrypted text
	 *
	 * @example
	 *   var decr = Aes.Ctr.decrypt('lwGl66VVwVObKIr6of8HVqJr', 'pāşšŵōřđ', 256); // 'big secret'
	 */
	Aes.Ctr.decrypt = function(ciphertext, password, nBits) {
		var blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
		if (!(nBits==128 || nBits==192 || nBits==256))
			nBits = 128;
		ciphertext = base64Decode(ciphertext);
		password = utf8Encode(password || default_key);

		// use AES to encrypt password (mirroring encrypt routine)
		var nBytes = nBits/8;  // no bytes in key
		var pwBytes = new Array(nBytes);
		for (var i=0; i<nBytes; i++) {
			pwBytes[i] = i<password.length ?  password.charCodeAt(i) : 0;
		}
		var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));
		key = key.concat(key.slice(0, nBytes-16));  // expand key to 16/24/32 bytes long

		// recover nonce from 1st 8 bytes of ciphertext
		var counterBlock = new Array(8);
		var ctrTxt = ciphertext.slice(0, 8);
		for (var i=0; i<8; i++) counterBlock[i] = ctrTxt.charCodeAt(i);

		// generate key schedule
		var keySchedule = Aes.keyExpansion(key);

		// separate ciphertext into blocks (skipping past initial 8 bytes)
		var nBlocks = Math.ceil((ciphertext.length-8) / blockSize);
		var ct = new Array(nBlocks);
		for (var b=0; b<nBlocks; b++) ct[b] = ciphertext.slice(8+b*blockSize, 8+b*blockSize+blockSize);
		ciphertext = ct;  // ciphertext is now array of block-length strings

		// plaintext will get generated block-by-block into array of block-length strings
		var plaintext = '';

		for (var b=0; b<nBlocks; b++) {
			// set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
			for (var c=0; c<4; c++) counterBlock[15-c] = ((b) >>> c*8) & 0xff;
			for (var c=0; c<4; c++) counterBlock[15-c-4] = (((b+1)/0x100000000-1) >>> c*8) & 0xff;

			var cipherCntr = Aes.cipher(counterBlock, keySchedule);  // encrypt counter block

			var plaintxtByte = new Array(ciphertext[b].length);
			for (var i=0; i<ciphertext[b].length; i++) {
				// -- xor plaintext with ciphered counter byte-by-byte --
				plaintxtByte[i] = cipherCntr[i] ^ ciphertext[b].charCodeAt(i);
				plaintxtByte[i] = String.fromCharCode(plaintxtByte[i]);
			}
			plaintext += plaintxtByte.join('');

			// if within web worker, announce progress every 1000 blocks (roughly every 50ms)
			if (typeof WorkerGlobalScope != 'undefined' && self instanceof WorkerGlobalScope) {
				if (b%1000 == 0) self.postMessage({ progress: b/nBlocks });
			}
		}

		plaintext = utf8Decode(plaintext);  // decode from UTF8 back to Unicode multi-byte chars

		return plaintext;
	};


	/* Extend String object with method to encode multi-byte string to utf8
	 * - monsur.hossa.in/2012/07/20/utf-8-in-javascript.html
	 * - note utf8Encode is an identity function with 7-bit ascii strings, but not with 8-bit strings;
	 * - utf8Encode('x') = 'x', but utf8Encode('ça') = 'Ã§a', and utf8Encode('Ã§a') = 'ÃÂ§a'*/
	function utf8Encode(str) {
		//return unescape( encodeURIComponent( str ) );

		return encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
			return String.fromCharCode('0x' + p1);
		});
	}

	/* Extend String object with method to decode utf8 string to multi-byte */
	function utf8Decode(str) {
		try {
			return decodeURIComponent( escape( str ) );
		} catch (e) {
			return str; // invalid UTF-8? return as-is
		}
	}

	/* Extend String object with method to encode base64
	 * - developer.mozilla.org/en-US/docs/Web/API/window.btoa, nodejs.org/api/buffer.html
	 * - note: btoa & Buffer/binary work on single-byte Unicode (C0/C1), so ok for utf8 strings, not for general Unicode...
	 * - note: if btoa()/atob() are not available (eg IE9-), try github.com/davidchambers/Base64.js */
	function base64Encode(str) {
		if (typeof btoa != 'undefined') return btoa(str); // browser
		if (typeof Buffer != 'undefined') return new Buffer(str, 'binary').toString('base64'); // Node.js
		throw new Error('No Base64 Encode');
	}

	/* Extend String object with method to decode base64 */
	function base64Decode(str) {
		if (typeof atob != 'undefined') return atob(str); // browser
		if (typeof Buffer != 'undefined') return new Buffer(str, 'base64').toString('binary'); // Node.js
		throw new Error('No Base64 Decode');
	}

}

if (typeof module != 'undefined' && module.exports) module.exports = Aes;


/**
 * rubles.js — сумма прописью https://github.com/meritt/rubles
 * &copy; [Алексей Симоненко](mailto:alexey@simonenko.su), [simonenko.su](http://simonenko.su)
 * @module rubles.js
 */

(function() {
	'use strict';

	var words = [
		[
			'', 'один', 'два', 'три', 'четыре', 'пять', 'шесть',
			'семь', 'восемь', 'девять', 'десять', 'одиннадцать',
			'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать',
			'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'
		],
		[
			'', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят',
			'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'
		],
		[
			'', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот',
			'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'
		]
	];

	var toFloat = function(number) {
		return parseFloat(number);
	};

	var plural = function(count, options) {
		if (options.length !== 3) {
			return false;
		}

		count = Math.abs(count) % 100;
		var rest = count % 10;

		if (count > 10 && count < 20) {
			return options[2];
		}

		if (rest > 1 && rest < 5) {
			return options[1];
		}

		if (rest === 1) {
			return options[0];
		}

		return options[2];
	};

	var parseNumber = function(number, count) {
		var first;
		var second;
		var numeral = '';

		if (number.length === 3) {
			first = number.substr(0, 1);
			number = number.substr(1, 3);
			numeral = '' + words[2][first] + ' ';
		}

		if (number < 20) {
			numeral = numeral + words[0][toFloat(number)] + ' ';
		} else {
			first = number.substr(0, 1);
			second = number.substr(1, 2);
			numeral = numeral + words[1][first] + ' ' + words[0][second] + ' ';
		}

		if (count === 0) {
			numeral = numeral + plural(number, ['рубль', 'рубля', 'рублей']);
		} else if (count === 1) {
			if (numeral !== '  ') {
				numeral = numeral + plural(number, ['тысяча ', 'тысячи ', 'тысяч ']);
				numeral = numeral.replace('один ', 'одна ').replace('два ', 'две ');
			}
		} else if (count === 2) {
			if (numeral !== '  ') {
				numeral = numeral + plural(number, ['миллион ', 'миллиона ', 'миллионов ']);
			}
		} else if (count === 3) {
			numeral = numeral + plural(number, ['миллиард ', 'миллиарда ', 'миллиардов ']);
		}

		return numeral;
	};

	var parseDecimals = function(number) {
		var text = plural(number, ['копейка', 'копейки', 'копеек']);

		if (number === 0) {
			number = '00';
		} else if (number < 10) {
			number = '0' + number;
		}

		return ' ' + number + ' ' + text;
	};

	var rubles = function(number) {
		if (!number) {
			return false;
		}

		var type = typeof number;
		if (type !== 'number' && type !== 'string') {
			return false;
		}

		if (type === 'string') {
			number = toFloat(number.replace(',', '.'));

			if (isNaN(number)) {
				return false;
			}
		}

		if (number <= 0) {
			return false;
		}

		var splt;
		var decimals;

		number = number.toFixed(2);
		if (number.indexOf('.') !== -1) {
			splt = number.split('.');
			number = splt[0];
			decimals = splt[1];
		}

		var numeral = '';
		var length = number.length - 1;
		var parts = '';
		var count = 0;
		var digit;

		while (length >= 0) {
			digit = number.substr(length, 1);
			parts = digit + parts;

			if ((parts.length === 3 || length === 0) && !isNaN(toFloat(parts))) {
				numeral = parseNumber(parts, count) + numeral;
				parts = '';
				count++;
			}

			length--;
		}

		numeral = numeral.replace(/\s+/g, ' ');

		if (decimals) {
			numeral = numeral + parseDecimals(toFloat(decimals));
		}

		return numeral;
	};

	/**
	 * Сумму прописью в прототип числа
	 */
	if(!Number.prototype.in_words)
		Number.prototype.in_words = function() {
			return rubles(this);
		};

})();
/*!
* @version: 2.1.24
* @author: Dan Grossman http://www.dangrossman.info/
* @copyright: Copyright (c) 2012-2016 Dan Grossman. All rights reserved.
* @license: Licensed under the MIT license. See http://www.opensource.org/licenses/mit-license.php
* @website: https://www.improvely.com/
*/
// Follow the UMD template https://github.com/umdjs/umd/blob/master/templates/returnExportsGlobal.js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Make globaly available as well
        define(['moment', 'jquery'], function (moment, jquery) {
            return (root.daterangepicker = factory(moment, jquery));
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node / Browserify
        //isomorphic issue
        var jQuery = (typeof window != 'undefined') ? window.jQuery : undefined;
        if (!jQuery) {
            jQuery = require('jquery');
            if (!jQuery.fn) jQuery.fn = {};
        }
        module.exports = factory(require('moment'), jQuery);
    } else {
        // Browser globals
        root.daterangepicker = factory(root.moment, root.jQuery);
    }
}(this, function(moment, $) {
    var DateRangePicker = function(element, options, cb) {

        //default settings for options
        this.parentEl = 'body';
        this.element = $(element);
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
        this.minDate = false;
        this.maxDate = false;
        this.dateLimit = false;
        this.autoApply = false;
        this.singleDatePicker = false;
        this.showDropdowns = false;
        this.showWeekNumbers = false;
        this.showISOWeekNumbers = false;
        this.showCustomRangeLabel = true;
        this.timePicker = false;
        this.timePicker24Hour = false;
        this.timePickerIncrement = 1;
        this.timePickerSeconds = false;
        this.linkedCalendars = true;
        this.autoUpdateInput = true;
        this.alwaysShowCalendars = false;
        this.ranges = {};

        this.opens = 'right';
        if (this.element.hasClass('pull-right'))
            this.opens = 'left';

        this.drops = 'down';
        if (this.element.hasClass('dropup'))
            this.drops = 'up';

        this.buttonClasses = 'btn btn-sm';
        this.applyClass = 'btn-success';
        this.cancelClass = 'btn-default';

        this.locale = {
            direction: 'ltr',
            format: 'DD.MM.YYYY',
            separator: ' - ',
            applyLabel: 'Применить',
            cancelLabel: 'Отмена',
            weekLabel: 'W',
            customRangeLabel: 'Произвольные даты',
            daysOfWeek: moment.weekdaysMin(),
            monthNames: moment.monthsShort(),
            firstDay: moment.localeData().firstDayOfWeek()
        };

        this.callback = function() { };

        //some state information
        this.isShowing = false;
        this.leftCalendar = {};
        this.rightCalendar = {};

        //custom options from user
        if (typeof options !== 'object' || options === null)
            options = {};

        //allow setting options with data attributes
        //data-api options will be overwritten with custom javascript options
        options = $.extend(this.element.data(), options);

        //html template for the picker UI
        if (typeof options.template !== 'string' && !(options.template instanceof $))
            options.template = '<div class="daterangepicker dropdown-menu">' +
                '<div class="calendar left">' +
                    '<div class="daterangepicker_input">' +
                      '<input class="input-mini form-control" type="text" name="daterangepicker_start" value="" />' +
                      '<i class="fa fa-calendar glyphicon glyphicon-calendar"></i>' +
                      '<div class="calendar-time">' +
                        '<div></div>' +
                        '<i class="fa fa-clock-o glyphicon glyphicon-time"></i>' +
                      '</div>' +
                    '</div>' +
                    '<div class="calendar-table"></div>' +
                '</div>' +
                '<div class="calendar right">' +
                    '<div class="daterangepicker_input">' +
                      '<input class="input-mini form-control" type="text" name="daterangepicker_end" value="" />' +
                      '<i class="fa fa-calendar glyphicon glyphicon-calendar"></i>' +
                      '<div class="calendar-time">' +
                        '<div></div>' +
                        '<i class="fa fa-clock-o glyphicon glyphicon-time"></i>' +
                      '</div>' +
                    '</div>' +
                    '<div class="calendar-table"></div>' +
                '</div>' +
                '<div class="ranges">' +
                    '<div class="range_inputs">' +
                        '<button class="applyBtn" disabled="disabled" type="button"></button> ' +
                        '<button class="cancelBtn" type="button"></button>' +
                    '</div>' +
                '</div>' +
            '</div>';

        this.parentEl = (options.parentEl && $(options.parentEl).length) ? $(options.parentEl) : $(this.parentEl);
        this.container = $(options.template).appendTo(this.parentEl);

        //
        // handle all the possible options overriding defaults
        //

        if (typeof options.locale === 'object') {

            if (typeof options.locale.direction === 'string')
                this.locale.direction = options.locale.direction;

            if (typeof options.locale.format === 'string')
                this.locale.format = options.locale.format;

            if (typeof options.locale.separator === 'string')
                this.locale.separator = options.locale.separator;

            if (typeof options.locale.daysOfWeek === 'object')
                this.locale.daysOfWeek = options.locale.daysOfWeek.slice();

            if (typeof options.locale.monthNames === 'object')
              this.locale.monthNames = options.locale.monthNames.slice();

            if (typeof options.locale.firstDay === 'number')
              this.locale.firstDay = options.locale.firstDay;

            if (typeof options.locale.applyLabel === 'string')
              this.locale.applyLabel = options.locale.applyLabel;

            if (typeof options.locale.cancelLabel === 'string')
              this.locale.cancelLabel = options.locale.cancelLabel;

            if (typeof options.locale.weekLabel === 'string')
              this.locale.weekLabel = options.locale.weekLabel;

            if (typeof options.locale.customRangeLabel === 'string')
              this.locale.customRangeLabel = options.locale.customRangeLabel;

        }
        this.container.addClass(this.locale.direction);

        if (typeof options.startDate === 'string')
            this.startDate = moment(options.startDate, this.locale.format);

        if (typeof options.endDate === 'string')
            this.endDate = moment(options.endDate, this.locale.format);

        if (typeof options.minDate === 'string')
            this.minDate = moment(options.minDate, this.locale.format);

        if (typeof options.maxDate === 'string')
            this.maxDate = moment(options.maxDate, this.locale.format);

        if (typeof options.startDate === 'object')
            this.startDate = moment(options.startDate);

        if (typeof options.endDate === 'object')
            this.endDate = moment(options.endDate);

        if (typeof options.minDate === 'object')
            this.minDate = moment(options.minDate);

        if (typeof options.maxDate === 'object')
            this.maxDate = moment(options.maxDate);

        // sanity check for bad options
        if (this.minDate && this.startDate.isBefore(this.minDate))
            this.startDate = this.minDate.clone();

        // sanity check for bad options
        if (this.maxDate && this.endDate.isAfter(this.maxDate))
            this.endDate = this.maxDate.clone();

        if (typeof options.applyClass === 'string')
            this.applyClass = options.applyClass;

        if (typeof options.cancelClass === 'string')
            this.cancelClass = options.cancelClass;

        if (typeof options.dateLimit === 'object')
            this.dateLimit = options.dateLimit;

        if (typeof options.opens === 'string')
            this.opens = options.opens;

        if (typeof options.drops === 'string')
            this.drops = options.drops;

        if (typeof options.showWeekNumbers === 'boolean')
            this.showWeekNumbers = options.showWeekNumbers;

        if (typeof options.showISOWeekNumbers === 'boolean')
            this.showISOWeekNumbers = options.showISOWeekNumbers;

        if (typeof options.buttonClasses === 'string')
            this.buttonClasses = options.buttonClasses;

        if (typeof options.buttonClasses === 'object')
            this.buttonClasses = options.buttonClasses.join(' ');

        if (typeof options.showDropdowns === 'boolean')
            this.showDropdowns = options.showDropdowns;

        if (typeof options.showCustomRangeLabel === 'boolean')
            this.showCustomRangeLabel = options.showCustomRangeLabel;

        if (typeof options.singleDatePicker === 'boolean') {
            this.singleDatePicker = options.singleDatePicker;
            if (this.singleDatePicker)
                this.endDate = this.startDate.clone();
        }

        if (typeof options.timePicker === 'boolean')
            this.timePicker = options.timePicker;

        if (typeof options.timePickerSeconds === 'boolean')
            this.timePickerSeconds = options.timePickerSeconds;

        if (typeof options.timePickerIncrement === 'number')
            this.timePickerIncrement = options.timePickerIncrement;

        if (typeof options.timePicker24Hour === 'boolean')
            this.timePicker24Hour = options.timePicker24Hour;

        if (typeof options.autoApply === 'boolean')
            this.autoApply = options.autoApply;

        if (typeof options.autoUpdateInput === 'boolean')
            this.autoUpdateInput = options.autoUpdateInput;

        if (typeof options.linkedCalendars === 'boolean')
            this.linkedCalendars = options.linkedCalendars;

        if (typeof options.isInvalidDate === 'function')
            this.isInvalidDate = options.isInvalidDate;

        if (typeof options.isCustomDate === 'function')
            this.isCustomDate = options.isCustomDate;

        if (typeof options.alwaysShowCalendars === 'boolean')
            this.alwaysShowCalendars = options.alwaysShowCalendars;

        // update day names order to firstDay
        if (this.locale.firstDay != 0) {
            var iterator = this.locale.firstDay;
            while (iterator > 0) {
                this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
                iterator--;
            }
        }

        var start, end, range;

        //if no start/end dates set, check if an input element contains initial values
        if (typeof options.startDate === 'undefined' && typeof options.endDate === 'undefined') {
            if ($(this.element).is('input[type=text]')) {
                var val = $(this.element).val(),
                    split = val.split(this.locale.separator);

                start = end = null;

                if (split.length == 2) {
                    start = moment(split[0], this.locale.format);
                    end = moment(split[1], this.locale.format);
                } else if (this.singleDatePicker && val !== "") {
                    start = moment(val, this.locale.format);
                    end = moment(val, this.locale.format);
                }
                if (start !== null && end !== null) {
                    this.setStartDate(start);
                    this.setEndDate(end);
                }
            }
        }

        if (typeof options.ranges === 'object') {
            for (range in options.ranges) {

                if (typeof options.ranges[range][0] === 'string')
                    start = moment(options.ranges[range][0], this.locale.format);
                else
                    start = moment(options.ranges[range][0]);

                if (typeof options.ranges[range][1] === 'string')
                    end = moment(options.ranges[range][1], this.locale.format);
                else
                    end = moment(options.ranges[range][1]);

                // If the start or end date exceed those allowed by the minDate or dateLimit
                // options, shorten the range to the allowable period.
                if (this.minDate && start.isBefore(this.minDate))
                    start = this.minDate.clone();

                var maxDate = this.maxDate;
                if (this.dateLimit && maxDate && start.clone().add(this.dateLimit).isAfter(maxDate))
                    maxDate = start.clone().add(this.dateLimit);
                if (maxDate && end.isAfter(maxDate))
                    end = maxDate.clone();

                // If the end of the range is before the minimum or the start of the range is
                // after the maximum, don't display this range option at all.
                if ((this.minDate && end.isBefore(this.minDate, this.timepicker ? 'minute' : 'day')) 
                  || (maxDate && start.isAfter(maxDate, this.timepicker ? 'minute' : 'day')))
                    continue;

                //Support unicode chars in the range names.
                var elem = document.createElement('textarea');
                elem.innerHTML = range;
                var rangeHtml = elem.value;

                this.ranges[rangeHtml] = [start, end];
            }

            var list = '<ul>';
            for (range in this.ranges) {
                list += '<li data-range-key="' + range + '">' + range + '</li>';
            }
            if (this.showCustomRangeLabel) {
                list += '<li data-range-key="' + this.locale.customRangeLabel + '">' + this.locale.customRangeLabel + '</li>';
            }
            list += '</ul>';
            this.container.find('.ranges').prepend(list);
        }

        if (typeof cb === 'function') {
            this.callback = cb;
        }

        if (!this.timePicker) {
            this.startDate = this.startDate.startOf('day');
            this.endDate = this.endDate.endOf('day');
            this.container.find('.calendar-time').hide();
        }

        //can't be used together for now
        if (this.timePicker && this.autoApply)
            this.autoApply = false;

        if (this.autoApply && typeof options.ranges !== 'object') {
            this.container.find('.ranges').hide();
        } else if (this.autoApply) {
            this.container.find('.applyBtn, .cancelBtn').addClass('hide');
        }

        if (this.singleDatePicker) {
            this.container.addClass('single');
            this.container.find('.calendar.left').addClass('single');
            this.container.find('.calendar.left').show();
            this.container.find('.calendar.right').hide();
            this.container.find('.daterangepicker_input input, .daterangepicker_input > i').hide();
            if (this.timePicker) {
                this.container.find('.ranges ul').hide();
            } else {
                this.container.find('.ranges').hide();
            }
        }

        if ((typeof options.ranges === 'undefined' && !this.singleDatePicker) || this.alwaysShowCalendars) {
            this.container.addClass('show-calendar');
        }

        this.container.addClass('opens' + this.opens);

        //swap the position of the predefined ranges if opens right
        if (typeof options.ranges !== 'undefined' && this.opens == 'right') {
            this.container.find('.ranges').prependTo( this.container.find('.calendar.left').parent() );
        }

        //apply CSS classes and labels to buttons
        this.container.find('.applyBtn, .cancelBtn').addClass(this.buttonClasses);
        if (this.applyClass.length)
            this.container.find('.applyBtn').addClass(this.applyClass);
        if (this.cancelClass.length)
            this.container.find('.cancelBtn').addClass(this.cancelClass);
        this.container.find('.applyBtn').html(this.locale.applyLabel);
        this.container.find('.cancelBtn').html(this.locale.cancelLabel);

        //
        // event listeners
        //

        this.container.find('.calendar')
            .on('click.daterangepicker', '.prev', $.proxy(this.clickPrev, this))
            .on('click.daterangepicker', '.next', $.proxy(this.clickNext, this))
            .on('mousedown.daterangepicker', 'td.available', $.proxy(this.clickDate, this))
            .on('mouseenter.daterangepicker', 'td.available', $.proxy(this.hoverDate, this))
            .on('mouseleave.daterangepicker', 'td.available', $.proxy(this.updateFormInputs, this))
            .on('change.daterangepicker', 'select.yearselect', $.proxy(this.monthOrYearChanged, this))
            .on('change.daterangepicker', 'select.monthselect', $.proxy(this.monthOrYearChanged, this))
            .on('change.daterangepicker', 'select.hourselect,select.minuteselect,select.secondselect,select.ampmselect', $.proxy(this.timeChanged, this))
            .on('click.daterangepicker', '.daterangepicker_input input', $.proxy(this.showCalendars, this))
            .on('focus.daterangepicker', '.daterangepicker_input input', $.proxy(this.formInputsFocused, this))
            .on('blur.daterangepicker', '.daterangepicker_input input', $.proxy(this.formInputsBlurred, this))
            .on('change.daterangepicker', '.daterangepicker_input input', $.proxy(this.formInputsChanged, this));

        this.container.find('.ranges')
            .on('click.daterangepicker', 'button.applyBtn', $.proxy(this.clickApply, this))
            .on('click.daterangepicker', 'button.cancelBtn', $.proxy(this.clickCancel, this))
            .on('click.daterangepicker', 'li', $.proxy(this.clickRange, this))
            .on('mouseenter.daterangepicker', 'li', $.proxy(this.hoverRange, this))
            .on('mouseleave.daterangepicker', 'li', $.proxy(this.updateFormInputs, this));

        if (this.element.is('input') || this.element.is('button')) {
            this.element.on({
                'click.daterangepicker': $.proxy(this.show, this),
                'focus.daterangepicker': $.proxy(this.show, this),
                'keyup.daterangepicker': $.proxy(this.elementChanged, this),
                'keydown.daterangepicker': $.proxy(this.keydown, this)
            });
        } else {
            this.element.on('click.daterangepicker', $.proxy(this.toggle, this));
        }

        //
        // if attached to a text input, set the initial value
        //

        if (this.element.is('input') && !this.singleDatePicker && this.autoUpdateInput) {
            this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
            this.element.trigger('change');
        } else if (this.element.is('input') && this.autoUpdateInput) {
            this.element.val(this.startDate.format(this.locale.format));
            this.element.trigger('change');
        }

    };

    DateRangePicker.prototype = {

        constructor: DateRangePicker,

        setStartDate: function(startDate) {
            if (typeof startDate === 'string')
                this.startDate = moment(startDate, this.locale.format);

            if (typeof startDate === 'object')
                this.startDate = moment(startDate);

            if (!this.timePicker)
                this.startDate = this.startDate.startOf('day');

            if (this.timePicker && this.timePickerIncrement)
                this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);

            if (this.minDate && this.startDate.isBefore(this.minDate)) {
                this.startDate = this.minDate;
                if (this.timePicker && this.timePickerIncrement)
                    this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
            }

            if (this.maxDate && this.startDate.isAfter(this.maxDate)) {
                this.startDate = this.maxDate;
                if (this.timePicker && this.timePickerIncrement)
                    this.startDate.minute(Math.floor(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
            }

            if (!this.isShowing)
                this.updateElement();

            this.updateMonthsInView();
        },

        setEndDate: function(endDate) {
            if (typeof endDate === 'string')
                this.endDate = moment(endDate, this.locale.format);

            if (typeof endDate === 'object')
                this.endDate = moment(endDate);

            if (!this.timePicker)
                this.endDate = this.endDate.endOf('day');

            if (this.timePicker && this.timePickerIncrement)
                this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);

            if (this.endDate.isBefore(this.startDate))
                this.endDate = this.startDate.clone();

            if (this.maxDate && this.endDate.isAfter(this.maxDate))
                this.endDate = this.maxDate;

            if (this.dateLimit && this.startDate.clone().add(this.dateLimit).isBefore(this.endDate))
                this.endDate = this.startDate.clone().add(this.dateLimit);

            this.previousRightTime = this.endDate.clone();

            if (!this.isShowing)
                this.updateElement();

            this.updateMonthsInView();
        },

        isInvalidDate: function() {
            return false;
        },

        isCustomDate: function() {
            return false;
        },

        updateView: function() {
            if (this.timePicker) {
                this.renderTimePicker('left');
                this.renderTimePicker('right');
                if (!this.endDate) {
                    this.container.find('.right .calendar-time select').attr('disabled', 'disabled').addClass('disabled');
                } else {
                    this.container.find('.right .calendar-time select').removeAttr('disabled').removeClass('disabled');
                }
            }
            if (this.endDate) {
                this.container.find('input[name="daterangepicker_end"]').removeClass('active');
                this.container.find('input[name="daterangepicker_start"]').addClass('active');
            } else {
                this.container.find('input[name="daterangepicker_end"]').addClass('active');
                this.container.find('input[name="daterangepicker_start"]').removeClass('active');
            }
            this.updateMonthsInView();
            this.updateCalendars();
            this.updateFormInputs();
        },

        updateMonthsInView: function() {
            if (this.endDate) {

                //if both dates are visible already, do nothing
                if (!this.singleDatePicker && this.leftCalendar.month && this.rightCalendar.month &&
                    (this.startDate.format('YYYY-MM') == this.leftCalendar.month.format('YYYY-MM') || this.startDate.format('YYYY-MM') == this.rightCalendar.month.format('YYYY-MM'))
                    &&
                    (this.endDate.format('YYYY-MM') == this.leftCalendar.month.format('YYYY-MM') || this.endDate.format('YYYY-MM') == this.rightCalendar.month.format('YYYY-MM'))
                    ) {
                    return;
                }

                this.leftCalendar.month = this.startDate.clone().date(2);
                if (!this.linkedCalendars && (this.endDate.month() != this.startDate.month() || this.endDate.year() != this.startDate.year())) {
                    this.rightCalendar.month = this.endDate.clone().date(2);
                } else {
                    this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
                }

            } else {
                if (this.leftCalendar.month.format('YYYY-MM') != this.startDate.format('YYYY-MM') && this.rightCalendar.month.format('YYYY-MM') != this.startDate.format('YYYY-MM')) {
                    this.leftCalendar.month = this.startDate.clone().date(2);
                    this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
                }
            }
            if (this.maxDate && this.linkedCalendars && !this.singleDatePicker && this.rightCalendar.month > this.maxDate) {
              this.rightCalendar.month = this.maxDate.clone().date(2);
              this.leftCalendar.month = this.maxDate.clone().date(2).subtract(1, 'month');
            }
        },

        updateCalendars: function() {

            if (this.timePicker) {
                var hour, minute, second;
                if (this.endDate) {
                    hour = parseInt(this.container.find('.left .hourselect').val(), 10);
                    minute = parseInt(this.container.find('.left .minuteselect').val(), 10);
                    second = this.timePickerSeconds ? parseInt(this.container.find('.left .secondselect').val(), 10) : 0;
                    if (!this.timePicker24Hour) {
                        var ampm = this.container.find('.left .ampmselect').val();
                        if (ampm === 'PM' && hour < 12)
                            hour += 12;
                        if (ampm === 'AM' && hour === 12)
                            hour = 0;
                    }
                } else {
                    hour = parseInt(this.container.find('.right .hourselect').val(), 10);
                    minute = parseInt(this.container.find('.right .minuteselect').val(), 10);
                    second = this.timePickerSeconds ? parseInt(this.container.find('.right .secondselect').val(), 10) : 0;
                    if (!this.timePicker24Hour) {
                        var ampm = this.container.find('.right .ampmselect').val();
                        if (ampm === 'PM' && hour < 12)
                            hour += 12;
                        if (ampm === 'AM' && hour === 12)
                            hour = 0;
                    }
                }
                this.leftCalendar.month.hour(hour).minute(minute).second(second);
                this.rightCalendar.month.hour(hour).minute(minute).second(second);
            }

            this.renderCalendar('left');
            this.renderCalendar('right');

            //highlight any predefined range matching the current start and end dates
            this.container.find('.ranges li').removeClass('active');
            if (this.endDate == null) return;

            this.calculateChosenLabel();
        },

        renderCalendar: function(side) {

            //
            // Build the matrix of dates that will populate the calendar
            //

            var calendar = side == 'left' ? this.leftCalendar : this.rightCalendar;
            var month = calendar.month.month();
            var year = calendar.month.year();
            var hour = calendar.month.hour();
            var minute = calendar.month.minute();
            var second = calendar.month.second();
            var daysInMonth = moment([year, month]).daysInMonth();
            var firstDay = moment([year, month, 1]);
            var lastDay = moment([year, month, daysInMonth]);
            var lastMonth = moment(firstDay).subtract(1, 'month').month();
            var lastYear = moment(firstDay).subtract(1, 'month').year();
            var daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
            var dayOfWeek = firstDay.day();

            //initialize a 6 rows x 7 columns array for the calendar
            var calendar = [];
            calendar.firstDay = firstDay;
            calendar.lastDay = lastDay;

            for (var i = 0; i < 6; i++) {
                calendar[i] = [];
            }

            //populate the calendar with date objects
            var startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
            if (startDay > daysInLastMonth)
                startDay -= 7;

            if (dayOfWeek == this.locale.firstDay)
                startDay = daysInLastMonth - 6;

            var curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]);

            var col, row;
            for (var i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, 'hour')) {
                if (i > 0 && col % 7 === 0) {
                    col = 0;
                    row++;
                }
                calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
                curDate.hour(12);

                if (this.minDate && calendar[row][col].format('YYYY-MM-DD') == this.minDate.format('YYYY-MM-DD') && calendar[row][col].isBefore(this.minDate) && side == 'left') {
                    calendar[row][col] = this.minDate.clone();
                }

                if (this.maxDate && calendar[row][col].format('YYYY-MM-DD') == this.maxDate.format('YYYY-MM-DD') && calendar[row][col].isAfter(this.maxDate) && side == 'right') {
                    calendar[row][col] = this.maxDate.clone();
                }

            }

            //make the calendar object available to hoverDate/clickDate
            if (side == 'left') {
                this.leftCalendar.calendar = calendar;
            } else {
                this.rightCalendar.calendar = calendar;
            }

            //
            // Display the calendar
            //

            var minDate = side == 'left' ? this.minDate : this.startDate;
            var maxDate = this.maxDate;
            var selected = side == 'left' ? this.startDate : this.endDate;
            var arrow = this.locale.direction == 'ltr' ? {left: 'chevron-left', right: 'chevron-right'} : {left: 'chevron-right', right: 'chevron-left'};

            var html = '<table class="table-condensed">';
            html += '<thead>';
            html += '<tr>';

            // add empty cell for week number
            if (this.showWeekNumbers || this.showISOWeekNumbers)
                html += '<th></th>';

            if ((!minDate || minDate.isBefore(calendar.firstDay)) && (!this.linkedCalendars || side == 'left')) {
                html += '<th class="prev available"><i class="fa fa-' + arrow.left + ' glyphicon glyphicon-' + arrow.left + '"></i></th>';
            } else {
                html += '<th></th>';
            }

            var dateHtml = this.locale.monthNames[calendar[1][1].month()] + calendar[1][1].format(" YYYY");

            if (this.showDropdowns) {
                var currentMonth = calendar[1][1].month();
                var currentYear = calendar[1][1].year();
                var maxYear = (maxDate && maxDate.year()) || (currentYear + 5);
                var minYear = (minDate && minDate.year()) || (currentYear - 50);
                var inMinYear = currentYear == minYear;
                var inMaxYear = currentYear == maxYear;

                var monthHtml = '<select class="monthselect">';
                for (var m = 0; m < 12; m++) {
                    if ((!inMinYear || m >= minDate.month()) && (!inMaxYear || m <= maxDate.month())) {
                        monthHtml += "<option value='" + m + "'" +
                            (m === currentMonth ? " selected='selected'" : "") +
                            ">" + this.locale.monthNames[m] + "</option>";
                    } else {
                        monthHtml += "<option value='" + m + "'" +
                            (m === currentMonth ? " selected='selected'" : "") +
                            " disabled='disabled'>" + this.locale.monthNames[m] + "</option>";
                    }
                }
                monthHtml += "</select>";

                var yearHtml = '<select class="yearselect">';
                for (var y = minYear; y <= maxYear; y++) {
                    yearHtml += '<option value="' + y + '"' +
                        (y === currentYear ? ' selected="selected"' : '') +
                        '>' + y + '</option>';
                }
                yearHtml += '</select>';

                dateHtml = monthHtml + yearHtml;
            }

            html += '<th colspan="5" class="month">' + dateHtml + '</th>';
            if ((!maxDate || maxDate.isAfter(calendar.lastDay)) && (!this.linkedCalendars || side == 'right' || this.singleDatePicker)) {
                html += '<th class="next available"><i class="fa fa-' + arrow.right + ' glyphicon glyphicon-' + arrow.right + '"></i></th>';
            } else {
                html += '<th></th>';
            }

            html += '</tr>';
            html += '<tr>';

            // add week number label
            if (this.showWeekNumbers || this.showISOWeekNumbers)
                html += '<th class="week">' + this.locale.weekLabel + '</th>';

            $.each(this.locale.daysOfWeek, function(index, dayOfWeek) {
                html += '<th>' + dayOfWeek + '</th>';
            });

            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';

            //adjust maxDate to reflect the dateLimit setting in order to
            //grey out end dates beyond the dateLimit
            if (this.endDate == null && this.dateLimit) {
                var maxLimit = this.startDate.clone().add(this.dateLimit).endOf('day');
                if (!maxDate || maxLimit.isBefore(maxDate)) {
                    maxDate = maxLimit;
                }
            }

            for (var row = 0; row < 6; row++) {
                html += '<tr>';

                // add week number
                if (this.showWeekNumbers)
                    html += '<td class="week">' + calendar[row][0].week() + '</td>';
                else if (this.showISOWeekNumbers)
                    html += '<td class="week">' + calendar[row][0].isoWeek() + '</td>';

                for (var col = 0; col < 7; col++) {

                    var classes = [];

                    //highlight today's date
                    if (calendar[row][col].isSame(new Date(), "day"))
                        classes.push('today');

                    //highlight weekends
                    if (calendar[row][col].isoWeekday() > 5)
                        classes.push('weekend');

                    //grey out the dates in other months displayed at beginning and end of this calendar
                    if (calendar[row][col].month() != calendar[1][1].month())
                        classes.push('off');

                    //don't allow selection of dates before the minimum date
                    if (this.minDate && calendar[row][col].isBefore(this.minDate, 'day'))
                        classes.push('off', 'disabled');

                    //don't allow selection of dates after the maximum date
                    if (maxDate && calendar[row][col].isAfter(maxDate, 'day'))
                        classes.push('off', 'disabled');

                    //don't allow selection of date if a custom function decides it's invalid
                    if (this.isInvalidDate(calendar[row][col]))
                        classes.push('off', 'disabled');

                    //highlight the currently selected start date
                    if (calendar[row][col].format('YYYY-MM-DD') == this.startDate.format('YYYY-MM-DD'))
                        classes.push('active', 'start-date');

                    //highlight the currently selected end date
                    if (this.endDate != null && calendar[row][col].format('YYYY-MM-DD') == this.endDate.format('YYYY-MM-DD'))
                        classes.push('active', 'end-date');

                    //highlight dates in-between the selected dates
                    if (this.endDate != null && calendar[row][col] > this.startDate && calendar[row][col] < this.endDate)
                        classes.push('in-range');

                    //apply custom classes for this date
                    var isCustom = this.isCustomDate(calendar[row][col]);
                    if (isCustom !== false) {
                        if (typeof isCustom === 'string')
                            classes.push(isCustom);
                        else
                            Array.prototype.push.apply(classes, isCustom);
                    }

                    var cname = '', disabled = false;
                    for (var i = 0; i < classes.length; i++) {
                        cname += classes[i] + ' ';
                        if (classes[i] == 'disabled')
                            disabled = true;
                    }
                    if (!disabled)
                        cname += 'available';

                    html += '<td class="' + cname.replace(/^\s+|\s+$/g, '') + '" data-title="' + 'r' + row + 'c' + col + '">' + calendar[row][col].date() + '</td>';

                }
                html += '</tr>';
            }

            html += '</tbody>';
            html += '</table>';

            this.container.find('.calendar.' + side + ' .calendar-table').html(html);

        },

        renderTimePicker: function(side) {

            // Don't bother updating the time picker if it's currently disabled
            // because an end date hasn't been clicked yet
            if (side == 'right' && !this.endDate) return;

            var html, selected, minDate, maxDate = this.maxDate;

            if (this.dateLimit && (!this.maxDate || this.startDate.clone().add(this.dateLimit).isAfter(this.maxDate)))
                maxDate = this.startDate.clone().add(this.dateLimit);

            if (side == 'left') {
                selected = this.startDate.clone();
                minDate = this.minDate;
            } else if (side == 'right') {
                selected = this.endDate.clone();
                minDate = this.startDate;

                //Preserve the time already selected
                var timeSelector = this.container.find('.calendar.right .calendar-time div');
                if (!this.endDate && timeSelector.html() != '') {

                    selected.hour(timeSelector.find('.hourselect option:selected').val() || selected.hour());
                    selected.minute(timeSelector.find('.minuteselect option:selected').val() || selected.minute());
                    selected.second(timeSelector.find('.secondselect option:selected').val() || selected.second());

                    if (!this.timePicker24Hour) {
                        var ampm = timeSelector.find('.ampmselect option:selected').val();
                        if (ampm === 'PM' && selected.hour() < 12)
                            selected.hour(selected.hour() + 12);
                        if (ampm === 'AM' && selected.hour() === 12)
                            selected.hour(0);
                    }

                }

                if (selected.isBefore(this.startDate))
                    selected = this.startDate.clone();

                if (maxDate && selected.isAfter(maxDate))
                    selected = maxDate.clone();

            }

            //
            // hours
            //

            html = '<select class="hourselect">';

            var start = this.timePicker24Hour ? 0 : 1;
            var end = this.timePicker24Hour ? 23 : 12;

            for (var i = start; i <= end; i++) {
                var i_in_24 = i;
                if (!this.timePicker24Hour)
                    i_in_24 = selected.hour() >= 12 ? (i == 12 ? 12 : i + 12) : (i == 12 ? 0 : i);

                var time = selected.clone().hour(i_in_24);
                var disabled = false;
                if (minDate && time.minute(59).isBefore(minDate))
                    disabled = true;
                if (maxDate && time.minute(0).isAfter(maxDate))
                    disabled = true;

                if (i_in_24 == selected.hour() && !disabled) {
                    html += '<option value="' + i + '" selected="selected">' + i + '</option>';
                } else if (disabled) {
                    html += '<option value="' + i + '" disabled="disabled" class="disabled">' + i + '</option>';
                } else {
                    html += '<option value="' + i + '">' + i + '</option>';
                }
            }

            html += '</select> ';

            //
            // minutes
            //

            html += ': <select class="minuteselect">';

            for (var i = 0; i < 60; i += this.timePickerIncrement) {
                var padded = i < 10 ? '0' + i : i;
                var time = selected.clone().minute(i);

                var disabled = false;
                if (minDate && time.second(59).isBefore(minDate))
                    disabled = true;
                if (maxDate && time.second(0).isAfter(maxDate))
                    disabled = true;

                if (selected.minute() == i && !disabled) {
                    html += '<option value="' + i + '" selected="selected">' + padded + '</option>';
                } else if (disabled) {
                    html += '<option value="' + i + '" disabled="disabled" class="disabled">' + padded + '</option>';
                } else {
                    html += '<option value="' + i + '">' + padded + '</option>';
                }
            }

            html += '</select> ';

            //
            // seconds
            //

            if (this.timePickerSeconds) {
                html += ': <select class="secondselect">';

                for (var i = 0; i < 60; i++) {
                    var padded = i < 10 ? '0' + i : i;
                    var time = selected.clone().second(i);

                    var disabled = false;
                    if (minDate && time.isBefore(minDate))
                        disabled = true;
                    if (maxDate && time.isAfter(maxDate))
                        disabled = true;

                    if (selected.second() == i && !disabled) {
                        html += '<option value="' + i + '" selected="selected">' + padded + '</option>';
                    } else if (disabled) {
                        html += '<option value="' + i + '" disabled="disabled" class="disabled">' + padded + '</option>';
                    } else {
                        html += '<option value="' + i + '">' + padded + '</option>';
                    }
                }

                html += '</select> ';
            }

            //
            // AM/PM
            //

            if (!this.timePicker24Hour) {
                html += '<select class="ampmselect">';

                var am_html = '';
                var pm_html = '';

                if (minDate && selected.clone().hour(12).minute(0).second(0).isBefore(minDate))
                    am_html = ' disabled="disabled" class="disabled"';

                if (maxDate && selected.clone().hour(0).minute(0).second(0).isAfter(maxDate))
                    pm_html = ' disabled="disabled" class="disabled"';

                if (selected.hour() >= 12) {
                    html += '<option value="AM"' + am_html + '>AM</option><option value="PM" selected="selected"' + pm_html + '>PM</option>';
                } else {
                    html += '<option value="AM" selected="selected"' + am_html + '>AM</option><option value="PM"' + pm_html + '>PM</option>';
                }

                html += '</select>';
            }

            this.container.find('.calendar.' + side + ' .calendar-time div').html(html);

        },

        updateFormInputs: function() {

            //ignore mouse movements while an above-calendar text input has focus
            if (this.container.find('input[name=daterangepicker_start]').is(":focus") || this.container.find('input[name=daterangepicker_end]').is(":focus"))
                return;

            this.container.find('input[name=daterangepicker_start]').val(this.startDate.format(this.locale.format));
            if (this.endDate)
                this.container.find('input[name=daterangepicker_end]').val(this.endDate.format(this.locale.format));

            if (this.singleDatePicker || (this.endDate && (this.startDate.isBefore(this.endDate) || this.startDate.isSame(this.endDate)))) {
                this.container.find('button.applyBtn').removeAttr('disabled');
            } else {
                this.container.find('button.applyBtn').attr('disabled', 'disabled');
            }

        },

        move: function() {
            var parentOffset = { top: 0, left: 0 },
                containerTop;
            var parentRightEdge = $(window).width();
            if (!this.parentEl.is('body')) {
                parentOffset = {
                    top: this.parentEl.offset().top - this.parentEl.scrollTop(),
                    left: this.parentEl.offset().left - this.parentEl.scrollLeft()
                };
                parentRightEdge = this.parentEl[0].clientWidth + this.parentEl.offset().left;
            }

            if (this.drops == 'up')
                containerTop = this.element.offset().top - this.container.outerHeight() - parentOffset.top;
            else
                containerTop = this.element.offset().top + this.element.outerHeight() - parentOffset.top;
            this.container[this.drops == 'up' ? 'addClass' : 'removeClass']('dropup');

            if (this.opens == 'left') {
                this.container.css({
                    top: containerTop,
                    right: parentRightEdge - this.element.offset().left - this.element.outerWidth(),
                    left: 'auto'
                });
                if (this.container.offset().left < 0) {
                    this.container.css({
                        right: 'auto',
                        left: 9
                    });
                }
            } else if (this.opens == 'center') {
                this.container.css({
                    top: containerTop,
                    left: this.element.offset().left - parentOffset.left + this.element.outerWidth() / 2
                            - this.container.outerWidth() / 2,
                    right: 'auto'
                });
                if (this.container.offset().left < 0) {
                    this.container.css({
                        right: 'auto',
                        left: 9
                    });
                }
            } else {
                this.container.css({
                    top: containerTop,
                    left: this.element.offset().left - parentOffset.left,
                    right: 'auto'
                });
                if (this.container.offset().left + this.container.outerWidth() > $(window).width()) {
                    this.container.css({
                        left: 'auto',
                        right: 0
                    });
                }
            }
        },

        show: function(e) {
            if (this.isShowing) return;

            // Create a click proxy that is private to this instance of datepicker, for unbinding
            this._outsideClickProxy = $.proxy(function(e) { this.outsideClick(e); }, this);

            // Bind global datepicker mousedown for hiding and
            $(document)
              .on('mousedown.daterangepicker', this._outsideClickProxy)
              // also support mobile devices
              .on('touchend.daterangepicker', this._outsideClickProxy)
              // also explicitly play nice with Bootstrap dropdowns, which stopPropagation when clicking them
              .on('click.daterangepicker', '[data-toggle=dropdown]', this._outsideClickProxy)
              // and also close when focus changes to outside the picker (eg. tabbing between controls)
              .on('focusin.daterangepicker', this._outsideClickProxy);

            // Reposition the picker if the window is resized while it's open
            $(window).on('resize.daterangepicker', $.proxy(function(e) { this.move(e); }, this));

            this.oldStartDate = this.startDate.clone();
            this.oldEndDate = this.endDate.clone();
            this.previousRightTime = this.endDate.clone();

            this.updateView();
            this.container.show();
            this.move();
            this.element.trigger('show.daterangepicker', this);
            this.isShowing = true;
        },

        hide: function(e) {
            if (!this.isShowing) return;

            //incomplete date selection, revert to last values
            if (!this.endDate) {
                this.startDate = this.oldStartDate.clone();
                this.endDate = this.oldEndDate.clone();
            }

            //if a new date range was selected, invoke the user callback function
            if (!this.startDate.isSame(this.oldStartDate) || !this.endDate.isSame(this.oldEndDate))
                this.callback(this.startDate, this.endDate, this.chosenLabel);

            //if picker is attached to a text input, update it
            this.updateElement();

            $(document).off('.daterangepicker');
            $(window).off('.daterangepicker');
            this.container.hide();
            this.element.trigger('hide.daterangepicker', this);
            this.isShowing = false;
        },

        toggle: function(e) {
            if (this.isShowing) {
                this.hide();
            } else {
                this.show();
            }
        },

        outsideClick: function(e) {
            var target = $(e.target);
            // if the page is clicked anywhere except within the daterangerpicker/button
            // itself then call this.hide()
            if (
                // ie modal dialog fix
                e.type == "focusin" ||
                target.closest(this.element).length ||
                target.closest(this.container).length ||
                target.closest('.calendar-table').length
                ) return;
            this.hide();
            this.element.trigger('outsideClick.daterangepicker', this);
        },

        showCalendars: function() {
            this.container.addClass('show-calendar');
            this.move();
            this.element.trigger('showCalendar.daterangepicker', this);
        },

        hideCalendars: function() {
            this.container.removeClass('show-calendar');
            this.element.trigger('hideCalendar.daterangepicker', this);
        },

        hoverRange: function(e) {

            //ignore mouse movements while an above-calendar text input has focus
            if (this.container.find('input[name=daterangepicker_start]').is(":focus") || this.container.find('input[name=daterangepicker_end]').is(":focus"))
                return;

            var label = e.target.getAttribute('data-range-key');

            if (label == this.locale.customRangeLabel) {
                this.updateView();
            } else {
                var dates = this.ranges[label];
                this.container.find('input[name=daterangepicker_start]').val(dates[0].format(this.locale.format));
                this.container.find('input[name=daterangepicker_end]').val(dates[1].format(this.locale.format));
            }

        },

        clickRange: function(e) {
            var label = e.target.getAttribute('data-range-key');
            this.chosenLabel = label;
            if (label == this.locale.customRangeLabel) {
                this.showCalendars();
            } else {
                var dates = this.ranges[label];
                this.startDate = dates[0];
                this.endDate = dates[1];

                if (!this.timePicker) {
                    this.startDate.startOf('day');
                    this.endDate.endOf('day');
                }

                if (!this.alwaysShowCalendars)
                    this.hideCalendars();
                this.clickApply();
            }
        },

        clickPrev: function(e) {
            var cal = $(e.target).parents('.calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month.subtract(1, 'month');
                if (this.linkedCalendars)
                    this.rightCalendar.month.subtract(1, 'month');
            } else {
                this.rightCalendar.month.subtract(1, 'month');
            }
            this.updateCalendars();
        },

        clickNext: function(e) {
            var cal = $(e.target).parents('.calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month.add(1, 'month');
            } else {
                this.rightCalendar.month.add(1, 'month');
                if (this.linkedCalendars)
                    this.leftCalendar.month.add(1, 'month');
            }
            this.updateCalendars();
        },

        hoverDate: function(e) {

            //ignore mouse movements while an above-calendar text input has focus
            //if (this.container.find('input[name=daterangepicker_start]').is(":focus") || this.container.find('input[name=daterangepicker_end]').is(":focus"))
            //    return;

            //ignore dates that can't be selected
            if (!$(e.target).hasClass('available')) return;

            //have the text inputs above calendars reflect the date being hovered over
            var title = $(e.target).attr('data-title');
            var row = title.substr(1, 1);
            var col = title.substr(3, 1);
            var cal = $(e.target).parents('.calendar');
            var date = cal.hasClass('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];

            if (this.endDate && !this.container.find('input[name=daterangepicker_start]').is(":focus")) {
                this.container.find('input[name=daterangepicker_start]').val(date.format(this.locale.format));
            } else if (!this.endDate && !this.container.find('input[name=daterangepicker_end]').is(":focus")) {
                this.container.find('input[name=daterangepicker_end]').val(date.format(this.locale.format));
            }

            //highlight the dates between the start date and the date being hovered as a potential end date
            var leftCalendar = this.leftCalendar;
            var rightCalendar = this.rightCalendar;
            var startDate = this.startDate;
            if (!this.endDate) {
                this.container.find('.calendar td').each(function(index, el) {

                    //skip week numbers, only look at dates
                    if ($(el).hasClass('week')) return;

                    var title = $(el).attr('data-title');
                    var row = title.substr(1, 1);
                    var col = title.substr(3, 1);
                    var cal = $(el).parents('.calendar');
                    var dt = cal.hasClass('left') ? leftCalendar.calendar[row][col] : rightCalendar.calendar[row][col];

                    if ((dt.isAfter(startDate) && dt.isBefore(date)) || dt.isSame(date, 'day')) {
                        $(el).addClass('in-range');
                    } else {
                        $(el).removeClass('in-range');
                    }

                });
            }

        },

        clickDate: function(e) {

            if (!$(e.target).hasClass('available')) return;

            var title = $(e.target).attr('data-title');
            var row = title.substr(1, 1);
            var col = title.substr(3, 1);
            var cal = $(e.target).parents('.calendar');
            var date = cal.hasClass('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];

            //
            // this function needs to do a few things:
            // * alternate between selecting a start and end date for the range,
            // * if the time picker is enabled, apply the hour/minute/second from the select boxes to the clicked date
            // * if autoapply is enabled, and an end date was chosen, apply the selection
            // * if single date picker mode, and time picker isn't enabled, apply the selection immediately
            // * if one of the inputs above the calendars was focused, cancel that manual input
            //

            if (this.endDate || date.isBefore(this.startDate, 'day')) { //picking start
                if (this.timePicker) {
                    var hour = parseInt(this.container.find('.left .hourselect').val(), 10);
                    if (!this.timePicker24Hour) {
                        var ampm = this.container.find('.left .ampmselect').val();
                        if (ampm === 'PM' && hour < 12)
                            hour += 12;
                        if (ampm === 'AM' && hour === 12)
                            hour = 0;
                    }
                    var minute = parseInt(this.container.find('.left .minuteselect').val(), 10);
                    var second = this.timePickerSeconds ? parseInt(this.container.find('.left .secondselect').val(), 10) : 0;
                    date = date.clone().hour(hour).minute(minute).second(second);
                }
                this.endDate = null;
                this.setStartDate(date.clone());
            } else if (!this.endDate && date.isBefore(this.startDate)) {
                //special case: clicking the same date for start/end,
                //but the time of the end date is before the start date
                this.setEndDate(this.startDate.clone());
            } else { // picking end
                if (this.timePicker) {
                    var hour = parseInt(this.container.find('.right .hourselect').val(), 10);
                    if (!this.timePicker24Hour) {
                        var ampm = this.container.find('.right .ampmselect').val();
                        if (ampm === 'PM' && hour < 12)
                            hour += 12;
                        if (ampm === 'AM' && hour === 12)
                            hour = 0;
                    }
                    var minute = parseInt(this.container.find('.right .minuteselect').val(), 10);
                    var second = this.timePickerSeconds ? parseInt(this.container.find('.right .secondselect').val(), 10) : 0;
                    date = date.clone().hour(hour).minute(minute).second(second);
                }
                this.setEndDate(date.clone());
                if (this.autoApply) {
                  this.calculateChosenLabel();
                  this.clickApply();
                }
            }

            if (this.singleDatePicker) {
                this.setEndDate(this.startDate);
                if (!this.timePicker)
                    this.clickApply();
            }

            this.updateView();

            //This is to cancel the blur event handler if the mouse was in one of the inputs
            e.stopPropagation();

        },

        calculateChosenLabel: function() {
          var customRange = true;
          var i = 0;
          for (var range in this.ranges) {
              if (this.timePicker) {
                  if (this.startDate.isSame(this.ranges[range][0]) && this.endDate.isSame(this.ranges[range][1])) {
                      customRange = false;
                      this.chosenLabel = this.container.find('.ranges li:eq(' + i + ')').addClass('active').html();
                      break;
                  }
              } else {
                  //ignore times when comparing dates if time picker is not enabled
                  if (this.startDate.format('YYYY-MM-DD') == this.ranges[range][0].format('YYYY-MM-DD') && this.endDate.format('YYYY-MM-DD') == this.ranges[range][1].format('YYYY-MM-DD')) {
                      customRange = false;
                      this.chosenLabel = this.container.find('.ranges li:eq(' + i + ')').addClass('active').html();
                      break;
                  }
              }
              i++;
          }
          if (customRange && this.showCustomRangeLabel) {
              this.chosenLabel = this.container.find('.ranges li:last').addClass('active').html();
              this.showCalendars();
          }
        },

        clickApply: function(e) {
            this.hide();
            this.element.trigger('apply.daterangepicker', this);
        },

        clickCancel: function(e) {
            this.startDate = this.oldStartDate;
            this.endDate = this.oldEndDate;
            this.hide();
            this.element.trigger('cancel.daterangepicker', this);
        },

        monthOrYearChanged: function(e) {
            var isLeft = $(e.target).closest('.calendar').hasClass('left'),
                leftOrRight = isLeft ? 'left' : 'right',
                cal = this.container.find('.calendar.'+leftOrRight);

            // Month must be Number for new moment versions
            var month = parseInt(cal.find('.monthselect').val(), 10);
            var year = cal.find('.yearselect').val();

            if (!isLeft) {
                if (year < this.startDate.year() || (year == this.startDate.year() && month < this.startDate.month())) {
                    month = this.startDate.month();
                    year = this.startDate.year();
                }
            }

            if (this.minDate) {
                if (year < this.minDate.year() || (year == this.minDate.year() && month < this.minDate.month())) {
                    month = this.minDate.month();
                    year = this.minDate.year();
                }
            }

            if (this.maxDate) {
                if (year > this.maxDate.year() || (year == this.maxDate.year() && month > this.maxDate.month())) {
                    month = this.maxDate.month();
                    year = this.maxDate.year();
                }
            }

            if (isLeft) {
                this.leftCalendar.month.month(month).year(year);
                if (this.linkedCalendars)
                    this.rightCalendar.month = this.leftCalendar.month.clone().add(1, 'month');
            } else {
                this.rightCalendar.month.month(month).year(year);
                if (this.linkedCalendars)
                    this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, 'month');
            }
            this.updateCalendars();
        },

        timeChanged: function(e) {

            var cal = $(e.target).closest('.calendar'),
                isLeft = cal.hasClass('left');

            var hour = parseInt(cal.find('.hourselect').val(), 10);
            var minute = parseInt(cal.find('.minuteselect').val(), 10);
            var second = this.timePickerSeconds ? parseInt(cal.find('.secondselect').val(), 10) : 0;

            if (!this.timePicker24Hour) {
                var ampm = cal.find('.ampmselect').val();
                if (ampm === 'PM' && hour < 12)
                    hour += 12;
                if (ampm === 'AM' && hour === 12)
                    hour = 0;
            }

            if (isLeft) {
                var start = this.startDate.clone();
                start.hour(hour);
                start.minute(minute);
                start.second(second);
                this.setStartDate(start);
                if (this.singleDatePicker) {
                    this.endDate = this.startDate.clone();
                } else if (this.endDate && this.endDate.format('YYYY-MM-DD') == start.format('YYYY-MM-DD') && this.endDate.isBefore(start)) {
                    this.setEndDate(start.clone());
                }
            } else if (this.endDate) {
                var end = this.endDate.clone();
                end.hour(hour);
                end.minute(minute);
                end.second(second);
                this.setEndDate(end);
            }

            //update the calendars so all clickable dates reflect the new time component
            this.updateCalendars();

            //update the form inputs above the calendars with the new time
            this.updateFormInputs();

            //re-render the time pickers because changing one selection can affect what's enabled in another
            this.renderTimePicker('left');
            this.renderTimePicker('right');

        },

        formInputsChanged: function(e) {
            var isRight = $(e.target).closest('.calendar').hasClass('right');
            var start = moment(this.container.find('input[name="daterangepicker_start"]').val(), this.locale.format);
            var end = moment(this.container.find('input[name="daterangepicker_end"]').val(), this.locale.format);

            if (start.isValid() && end.isValid()) {

                if (isRight && end.isBefore(start))
                    start = end.clone();

                this.setStartDate(start);
                this.setEndDate(end);

                if (isRight) {
                    this.container.find('input[name="daterangepicker_start"]').val(this.startDate.format(this.locale.format));
                } else {
                    this.container.find('input[name="daterangepicker_end"]').val(this.endDate.format(this.locale.format));
                }

            }

            this.updateView();
        },

        formInputsFocused: function(e) {

            // Highlight the focused input
            this.container.find('input[name="daterangepicker_start"], input[name="daterangepicker_end"]').removeClass('active');
            $(e.target).addClass('active');

            // Set the state such that if the user goes back to using a mouse, 
            // the calendars are aware we're selecting the end of the range, not
            // the start. This allows someone to edit the end of a date range without
            // re-selecting the beginning, by clicking on the end date input then
            // using the calendar.
            var isRight = $(e.target).closest('.calendar').hasClass('right');
            if (isRight) {
                this.endDate = null;
                this.setStartDate(this.startDate.clone());
                this.updateView();
            }

        },

        formInputsBlurred: function(e) {

            // this function has one purpose right now: if you tab from the first
            // text input to the second in the UI, the endDate is nulled so that
            // you can click another, but if you tab out without clicking anything
            // or changing the input value, the old endDate should be retained

            if (!this.endDate) {
                var val = this.container.find('input[name="daterangepicker_end"]').val();
                var end = moment(val, this.locale.format);
                if (end.isValid()) {
                    this.setEndDate(end);
                    this.updateView();
                }
            }

        },

        elementChanged: function() {
            if (!this.element.is('input')) return;
            if (!this.element.val().length) return;
            if (this.element.val().length < this.locale.format.length) return;

            var dateString = this.element.val().split(this.locale.separator),
                start = null,
                end = null;

            if (dateString.length === 2) {
                start = moment(dateString[0], this.locale.format);
                end = moment(dateString[1], this.locale.format);
            }

            if (this.singleDatePicker || start === null || end === null) {
                start = moment(this.element.val(), this.locale.format);
                end = start;
            }

            if (!start.isValid() || !end.isValid()) return;

            this.setStartDate(start);
            this.setEndDate(end);
            this.updateView();
        },

        keydown: function(e) {
            //hide on tab or enter
            if ((e.keyCode === 9) || (e.keyCode === 13)) {
                this.hide();
            }
        },

        updateElement: function() {
            if (this.element.is('input') && !this.singleDatePicker && this.autoUpdateInput) {
                this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
                this.element.trigger('change');
            } else if (this.element.is('input') && this.autoUpdateInput) {
                this.element.val(this.startDate.format(this.locale.format));
                this.element.trigger('change');
            }
        },

        remove: function() {
            this.container.remove();
            this.element.off('.daterangepicker');
            this.element.removeData();
        }

    };

    $.fn.daterangepicker = function(options, callback) {
        this.each(function() {
            var el = $(this);
            if (el.data('daterangepicker'))
                el.data('daterangepicker').remove();
            el.data('daterangepicker', new DateRangePicker(el, options, callback));
        });
        return this;
    };

    return DateRangePicker;

}));

return $p;
}));
