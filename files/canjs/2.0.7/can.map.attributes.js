/*!
 * CanJS - 2.0.7
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Wed, 26 Mar 2014 16:12:33 GMT
 * Licensed MIT
 * Includes: can/map/attributes
 * Download from: http://canjs.com
 */
(function(undefined) {

    // ## map/attributes/attributes.js
    var __m1 = (function(can, Map) {
        can.each([
                can.Map,
                can.Model
            ], function(clss) {
                // in some cases model might not be defined quite yet.
                if (clss === undefined) {
                    return;
                }
                var isObject = function(obj) {
                    return typeof obj === 'object' && obj !== null && obj;
                };
                can.extend(clss, {

                        attributes: {},


                        convert: {
                            'date': function(str) {
                                var type = typeof str;
                                if (type === 'string') {
                                    str = Date.parse(str);
                                    return isNaN(str) ? null : new Date(str);
                                } else if (type === 'number') {
                                    return new Date(str);
                                } else {
                                    return str;
                                }
                            },
                            'number': function(val) {
                                return parseFloat(val);
                            },
                            'boolean': function(val) {
                                if (val === 'false' || val === '0' || !val) {
                                    return false;
                                }
                                return true;
                            },
                            'default': function(val, oldVal, error, type) {
                                // Convert can.Model types using .model and .models
                                if (can.Map.prototype.isPrototypeOf(type.prototype) && typeof type.model === 'function' && typeof type.models === 'function') {
                                    return type[can.isArray(val) ? 'models' : 'model'](val);
                                }
                                if (can.Map.prototype.isPrototypeOf(type.prototype)) {
                                    if (can.isArray(val) && typeof type.List === 'function') {
                                        return new type.List(val);
                                    }
                                    return new type(val);
                                }
                                if (typeof type === 'function') {
                                    return type(val, oldVal);
                                }
                                var construct = can.getObject(type),
                                    context = window,
                                    realType;
                                // if type has a . we need to look it up
                                if (type.indexOf('.') >= 0) {
                                    // get everything before the last .
                                    realType = type.substring(0, type.lastIndexOf('.'));
                                    // get the object before the last .
                                    context = can.getObject(realType);
                                }
                                return typeof construct === 'function' ? construct.call(context, val, oldVal) : val;
                            }
                        },

                        serialize: {
                            'default': function(val, type) {
                                return isObject(val) && val.serialize ? val.serialize() : val;
                            },
                            'date': function(val) {
                                return val && val.getTime();
                            }
                        }
                    });
                // overwrite setup to do this stuff
                var oldSetup = clss.setup;

                clss.setup = function(superClass, stat, proto) {
                    var self = this;
                    oldSetup.call(self, superClass, stat, proto);
                    can.each(['attributes'], function(name) {
                        if (!self[name] || superClass[name] === self[name]) {
                            self[name] = {};
                        }
                    });
                    can.each([
                            'convert',
                            'serialize'
                        ], function(name) {
                            if (superClass[name] !== self[name]) {
                                self[name] = can.extend({}, superClass[name], self[name]);
                            }
                        });
                };
            });

        can.Map.prototype.__convert = function(prop, value) {
            // check if there is a
            var Class = this.constructor,
                oldVal = this.attr(prop),
                type, converter;
            if (Class.attributes) {
                // the type of the attribute
                type = Class.attributes[prop];
                converter = Class.convert[type] || Class.convert['default'];
            }
            return value === null || !type ? value : converter.call(Class, value, oldVal, function() {}, type);
        };

        can.List.prototype.serialize = function(attrName, stack) {
            return can.makeArray(can.Map.prototype.serialize.apply(this, arguments));
        };
        can.Map.prototype.serialize = function(attrName, stack) {
            var where = {}, Class = this.constructor,
                attrs = {};
            stack = can.isArray(stack) ? stack : [];
            stack.push(this._cid);
            if (attrName !== undefined) {
                attrs[attrName] = this[attrName];
            } else {
                attrs = this.__get();
            }
            can.each(attrs, function(val, name) {
                var type, converter;
                // If this is an observe, check that it wasn't serialized earlier in the stack.
                if (val instanceof can.Map && can.inArray(val._cid, stack) > -1) {
                    // Since this object has already been serialized once,
                    // just reference the id (or undefined if it doesn't exist).
                    where[name] = val.attr('id');
                } else {
                    type = Class.attributes ? Class.attributes[name] : 0;
                    converter = Class.serialize ? Class.serialize[type] : 0;
                    // if the value is an object, and has a attrs or serialize function
                    where[name] = val && typeof val.serialize === 'function' ?
                    // call attrs or serialize to get the original data back
                    val.serialize(undefined, stack) :
                    // otherwise if we have  a converter
                    converter ?
                    // use the converter
                    converter(val, type) :
                    // or return the val
                    val;
                }
            });
            if (typeof attrs.length !== 'undefined') {
                where.length = attrs.length;
            }
            return attrName !== undefined ? where[attrName] : where;
        };
        return can.Map;
    })(window.can, undefined, undefined);

})();