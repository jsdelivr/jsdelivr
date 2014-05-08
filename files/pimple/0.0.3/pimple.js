/*global String,Boolean,Object,Function */
/*
  Pimple dependency injection container 
  @copyright 2011 M.PARAISO <mparaiso@online.fr>
  @license LGPL
  @version 0.0.3
*/
(function(){
    "use strict";
    var self=this;
    /**
     * Pimple dependency injection container
     * @param {Object} object
     * @return {Boolean}
     */
    var _isFunction=function(object){
        return object instanceof Function;
    };
    var reservedProperties=['get','set','factory','raw','protect','share','toString','constructor'];
    /**
     *
     * @param {Object} definitions
     * @constructor
     */
    this.Pimple = function(definitions){
        if(!(this instanceof self.Pimple)){
            return new self.Pimple(definitions);
        }
        this._definitions={};
        for(var key in definitions){
            if(definitions.hasOwnProperty(key)){
                this.set(key,definitions[key]);
            }
        }
    };
    this.Pimple.prototype={
        /**
         *
         * @param {String} key
         * @returns {*}
         */
        get:function(key){
            if(this._definitions[key]===undefined)return;
            if(_isFunction(this._definitions[key])){
                return this._definitions[key].call(this,this);
            }
            return this._definitions[key];
        },
        /**
         * register a new service
         * @param {String} key
         * @param {Object|Function} 
         * @return {Pimple} container
         */
        set:function(key,definition){
            this._definitions[key]=definition;
            if(reservedProperties.indexOf(key)===-1){
                Object.defineProperty(this,key,{
                    get:function(){
                        return this.get(key);
                    },
                    configurable:true,
                    enumerable:true
                });
            }
            return this
        },
        /**
         * get raw service definition
         * @param {String} key
         * @returns {*}
         */
        raw:function(key){
            return this._definitions[key];
        },
        /**
         *
         * @param {Object,Function} definition
         * @return {Function}
         */
        share:function(definition){
            var cached,self=this;
            return function(){
                if(cached===undefined){
                    cached=definition.call(self,self);
                }
                return cached;
            }
        },
        /**
         * @param {Function}definition
         * @param {Object} context
         * @returns {Function}
         */
        protect:function(definition,context){
            context=context||this;
            return function(){
                return definition.bind(context);
            }
        },
        /**
         * @param {String} key
         * @param {Function} definition
         * @returns {Function}
         */
        extend:function(key,definition){
            return definition.bind(this,this.get(key),this);
        },
        /**
         * use a function to register a set of definitions
         * @param {Function} definitionProvider
         * @returns {*}
         */
        register:function(definitionProvider){
            return definitionProvider(this);
        }
    };
    if(this.define instanceof Function){
        var self=this;
        this.define('pimple',[],function(){return self.Pimple});
    }
    //CommonJS
    if(module && module.exports){
        module.exports = this.Pimple;
    }
}).apply(this);
