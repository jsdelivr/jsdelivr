"use strict"
window.ref = {};

Object.defineProperties(window.ref, {

  keys: {
    enumerable: false,
    writable: true,
    configurable: false,
    value: {}
  },

  /**
   * @method find
   * Retrieve the DOM element(s) for the given selector. This method provides
   * an **unmanaged** reference object.
   * @private
   * @param {String} selector
   * The selector (CSS-style).
   * @returns {ref}
   * Returns an instance of the reference.
   */
  find: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(value){
      var html = typeof value !== 'string',
          els = html === false ? document.querySelectorAll(value) : value,
          me = this,
          result = null;

      if (els.length === 1) {

        if (!els[0].hasOwnProperty('isArray')){
          Object.defineProperties(els[0],{
            isArray: {
              enumerable: false,
              get: function(){return false;}
            }
          });
        }

        if (!els[0].hasOwnProperty('find')){
          Object.defineProperties(els[0],{
            find: {
              enumerable: true,
              value: function(selector){
                if (typeof value !== 'string'){
                  return window.ref.find(value.querySelectorAll(selector));
                }
                return window.ref.find((value+' > '+selector).trim());
              }
            }
          });
        }

        if (!els[0].hasOwnProperty('forward')){
          Object.defineProperty(els[0],'forward', {
            enumerable: true,
            writable: false,
            configurable: false,
            value: function(trigger,event){
              if (BUS === undefined){
                return console.error('The event BUS is required for forward().');
              }
              var fn = function(e){
                BUS.emit(event,e);
              };
              this.addEventListener(trigger,fn);
            }
          });
        }
        result = els[0];
      } else {

        var base = Array.prototype.slice.call(els);

        // Apply querySelector/All to the response for chaining.
        Object.defineProperties(base,{
          querySelector: {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function(selector){
              if (typeof value === 'string'){
                return document.querySelector((value+' > '+selector).trim());
              }
              return value.querySelector(selector.trim());
            }
          },

          querySelectorAll: {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function(selector){
              if (typeof value === 'string'){
                return document.querySelectorAll((value+' > '+selector).trim());
              }
              return value.querySelectorAll(selector.trim());
            }
          },

          addEventListener: {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function(evt,fn){
              this.forEach(function(el){
                el.addEventListener(evt,fn);
              });
            }
          },

          removeEventListener: {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function(evt,fn){
              this.forEach(function(el){
                el.removeEventListener(evt,fn);
              });
            }
          },

          find: {
            enumerable: true,
            value: function(selector){
              if (typeof value === 'string'){
                return window.ref.find((value+' > '+selector).trim());
              }
              return window.ref.find(value.querySelectorAll(selector));
            }
          },

          isArray: {
            enumerable: false,
            get: function(){return true;}
          },

          forward: {
            enumerable: true,
            writable: false,
            configurable: false,
            value: function(trigger,event){
              if (BUS === undefined){
                return console.error('The event BUS is required for react().');
              }
              var fn = function(e){
                BUS.emit(event,e);
              };
              this.forEach(function(el){
                el.addEventListener(trigger,fn);
              });
            }
          }
        });
        result = base;
      }

      return result;
    }
  },

  /**
   * @method create
   * Add a reference.
   * @param {String} [key]
   * The key/name of the reference. For example, if this is `myElement`,
   * then `ref.myElement` will return a pointer to this reference.
   * @param {string} selector
   * The CSS selector path.
   */
  create: {
    enumerble: true,
    writable: false,
    configurable: false,
    value: function(key, value) {
      // If the key is not provided but the value is a DOM element, make
      // an ephemeral reference.
      if (!value && typeof key !== 'string'){
        return this.find(key);
      }

      // Basic error checking
      if (typeof key !== 'string' && typeof key !== 'number') {
        throw new Error('Cannot add a non-alphanumeric selector reference.');
      }
      if (key.trim().length === 0) {
        throw new Error('Cannot add a blank selector reference.');
      }
      if (value === undefined || value === null || value.trim().length === 0) {
        throw new Error('Cannot create a null/undefined selector reference.');
      }

      // Create a reference object
      var cleankey = this.cleanKey(key), me = this;
      Object.defineProperty(window.ref, cleankey, {
        enumerable: false,
        writable: true,
        configurable: true,
        value: value
      });

      Object.defineProperty(window.ref, key, {
        enumerable: true,
        get: function(){
          return me.find(value);
        },
        set: function(val) {
          if (val === undefined || val === null || val.trim().length === 0) {
            throw new Error('Cannot create a null/undefined selector reference.');
          }
          window.ref[cleankey] = val;
        }
      });

      this.keys[key] = value;
      this.keys[this.cleanKey(key)] = value;
    }
  },

  /**
   * @method remove
   * Removes a key from the reference manager.
   */
  remove: {
    enumerable: true,
    writable: false,
    configurable: false,
    value: function(key) {
      if (this.key) {
        delete this.key;
        delete this.keys[key];
      }
      var ck = this.cleanKey(key);
      if (this[ck]) {
        delete this[ck];
        delete this.keys[ck];
      }
    }
  },

  /**
   * @method cleanKey
   * Creates a clean version of the key used to uniquely identify the reference.
   * @private
   * @param {String} key
   * The key to clean.
   */
  cleanKey: {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(key) {
      return key.replace(/[^A-Za-z0-9\_\#\$\@\-\+]/gi, '') + key.length;
    }
  },

  /**
   * @property json
   * A JSON representation of the managed keys and their associated selectors.
   * @returns {Object}
   * A key:selector object.
   */
  json: {
    enumerable: true,
    get: function() {
      var me = this,
        obj = {};
      Object.keys(this).forEach(function(el) {
        if (me.hasOwnProperty(el) && ['json','find','remove'].indexOf(el.trim().toLowerCase()) < 0 && typeof me[el] !== 'function') {
          obj[el] = me.keys[el];
        }
      });
      return obj;
    }
  }

});
