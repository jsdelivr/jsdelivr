// Copyright (c) 2012 Florian H., https://github.com/js-coder https://github.com/js-coder/cookie.js

!function (document, undefined) {

   var utils = {

      isArray: Array.isArray || function (value) { // Checks if `value` is an array created with `[]` or `new Array`.
         return Object.prototype.toString.call(value) === '[object Array]';
      },

      isPlainObj: function (value) { // Checks if `value` is an object that was created with `{}` or `new Object`.
         return value === Object(value);
      },

      toArray: function (value) { // Converts an array-like object to an array - for example `arguments`.
         return Array.prototype.slice.call(value);
      },

      getKeys: Object.keys || function (obj) { // Get the keys of an object.
         var keys = [],
             key = '';
         for (key in obj) {
            if (obj.hasOwnProperty(key)) keys.push(key);
         }
         return keys;
      },

      retrieve: function (value, fallback) { // Returns fallback if the value is undefined, otherwise value.
         return value === undefined ? fallback : value;
      }

   };

   var cookie = function () {
      return cookie.get.apply(cookie, arguments);
   };

   cookie.set = function (key, value, options) {

      if (utils.isPlainObj(key)) {

         for (var k in key) {
            if (key.hasOwnProperty(k)) this.set(k, key[k]);
         }

      } else {

         options = options || {};
         var expires = options.expires || '',
             expiresType = typeof(expires),
             path = options.path ? ';path=' + options.path : '',
             domain = options.domain ? ';domain=' + options.domain : '',
             secure = options.secure ? ';secure' : '';
         if (expiresType === 'string' && expires !== '') expires = ';expires=' + expires;
         else if (expiresType === 'number') { // this is needed because IE does not support max-age
            var d = new Date;
            d.setTime(d.getTime() + 60 * 60 * 24 * expires);
            expires = ';expires=' + d.toGMTString();
         } else if (expires.hasOwnProperty('toGMTString')) expires = ';expires=' + expires.toGMTString();

         document.cookie = escape(key) + '=' + escape(value) + expires + path + domain + secure;

      }

      return this; // to allow chaining

   };

   cookie.remove = function (keys) {

      keys = utils.isArray(keys) ? keys : utils.toArray(arguments);

      for (var i = 0, l = keys.length; i < l; i++) {
         this.set(keys[i], '', {
            expires: -1
         });
      }


      return this; // to allow chaining
   };

   cookie.empty = function () {

      return this.remove(utils.getKeys(this.all()));

   };

   cookie.get = function (keys, fallback) {

      fallback = fallback || undefined;
      var cookies = this.all();

      if (utils.isArray(keys)) {

         var result = {};

         for (var i = 0, l = keys.length; i < l; i++) {
            var value = keys[i];
            result[value] = utils.retrieve(cookies[value], fallback);
         }

         return result;

      } else return utils.retrieve(cookies[keys], fallback);

   };

   cookie.all = function () {

      if (document.cookie === '') return {};

      var cookies = document.cookie.split('; '),
           result = {};

      for (var i = 0, l = cookies.length; i < l; i++) {
         var item = cookies[i].split('=');
         result[item[0]] = unescape(item[1]);
      }

      return result;

   };

   cookie.enabled = function () {

      var ret = cookie.set('a', 'b').get('a') === 'b';
      cookie.remove('a');
      return ret;

   };

   if (typeof define === 'function' && define.amd) {
      define(function () {
         return cookie;
      });
   } else window.cookie = cookie;

}(document);