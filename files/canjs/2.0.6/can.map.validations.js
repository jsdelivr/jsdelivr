/*!
 * CanJS - 2.0.6
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Fri, 14 Mar 2014 21:59:17 GMT
 * Licensed MIT
 * Includes: can/map/validations
 * Download from: http://canjs.com
 */
(function(undefined) {

    // ## map/attributes/attributes.js
    var __m8 = (function(can, Map) {
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

    // ## map/validations/validations.js
    var __m1 = (function(can) {
        //validations object is by property.  You can have validations that
        //span properties, but this way we know which ones to run.
        //  proc should return true if there's an error or the error message
        var validate = function(attrNames, options, proc) {
            // normalize argumetns
            if (!proc) {
                proc = options;
                options = {};
            }
            options = options || {};
            attrNames = typeof attrNames === 'string' ? [attrNames] : can.makeArray(attrNames);
            // run testIf if it exists
            if (options.testIf && !options.testIf.call(this)) {
                return;
            }
            var self = this;
            can.each(attrNames, function(attrName) {
                // Add a test function for each attribute
                if (!self.validations[attrName]) {
                    self.validations[attrName] = [];
                }
                self.validations[attrName].push(function(newVal) {
                    // if options has a message return that, otherwise, return the error
                    var res = proc.call(this, newVal, attrName);
                    return res === undefined ? undefined : options.message || res;
                });
            });
        };
        var old = can.Map.prototype.__set;
        can.Map.prototype.__set = function(prop, value, current, success, error) {
            var self = this,
                validations = self.constructor.validations,
                errorCallback = function(errors) {
                    var stub = error && error.call(self, errors);
                    // if 'setter' is on the page it will trigger
                    // the error itself and we dont want to trigger
                    // the event twice. :)
                    if (stub !== false) {
                        can.trigger(self, 'error', [
                                prop,
                                errors
                            ], true);
                    }
                    return false;
                };
            old.call(self, prop, value, current, success, errorCallback);
            if (validations && validations[prop]) {
                var errors = self.errors(prop);
                if (errors) {
                    errorCallback(errors);
                }
            }
            return this;
        };
        can.each([
                can.Map,
                can.Model
            ], function(clss) {
                // in some cases model might not be defined quite yet.
                if (clss === undefined) {
                    return;
                }
                var oldSetup = clss.setup;

                can.extend(clss, {
                        setup: function(superClass) {
                            oldSetup.apply(this, arguments);
                            if (!this.validations || superClass.validations === this.validations) {
                                this.validations = {};
                            }
                        },

                        validate: validate,


                        validationMessages: {
                            format: 'is invalid',
                            inclusion: 'is not a valid option (perhaps out of range)',
                            lengthShort: 'is too short',
                            lengthLong: 'is too long',
                            presence: 'can\'t be empty',
                            range: 'is out of range',
                            numericality: 'must be a number'
                        },


                        validateFormatOf: function(attrNames, regexp, options) {
                            validate.call(this, attrNames, options, function(value) {
                                if (typeof value !== 'undefined' && value !== null && value !== '' && String(value)
                                    .match(regexp) === null) {
                                    return this.constructor.validationMessages.format;
                                }
                            });
                        },


                        validateInclusionOf: function(attrNames, inArray, options) {
                            validate.call(this, attrNames, options, function(value) {
                                if (typeof value === 'undefined') {
                                    return;
                                }
                                for (var i = 0; i < inArray.length; i++) {
                                    if (inArray[i] === value) {
                                        return;
                                    }
                                }
                                return this.constructor.validationMessages.inclusion;
                            });
                        },


                        validateLengthOf: function(attrNames, min, max, options) {
                            validate.call(this, attrNames, options, function(value) {
                                if ((typeof value === 'undefined' || value === null) && min > 0 || typeof value !== 'undefined' && value !== null && value.length < min) {
                                    return this.constructor.validationMessages.lengthShort + ' (min=' + min + ')';
                                } else if (typeof value !== 'undefined' && value !== null && value.length > max) {
                                    return this.constructor.validationMessages.lengthLong + ' (max=' + max + ')';
                                }
                            });
                        },


                        validatePresenceOf: function(attrNames, options) {
                            validate.call(this, attrNames, options, function(value) {
                                if (typeof value === 'undefined' || value === '' || value === null) {
                                    return this.constructor.validationMessages.presence;
                                }
                            });
                        },


                        validateRangeOf: function(attrNames, low, hi, options) {
                            validate.call(this, attrNames, options, function(value) {
                                if ((typeof value === 'undefined' || value === null) && low > 0 || typeof value !== 'undefined' && value !== null && (value < low || value > hi)) {
                                    return this.constructor.validationMessages.range + ' [' + low + ',' + hi + ']';
                                }
                            });
                        },


                        validatesNumericalityOf: function(attrNames) {
                            validate.call(this, attrNames, function(value) {
                                var res = !isNaN(parseFloat(value)) && isFinite(value);
                                if (!res) {
                                    return this.constructor.validationMessages.numericality;
                                }
                            });
                        }
                    });
            });

        can.extend(can.Map.prototype, {

                errors: function(attrs, newVal) {
                    // convert attrs to an array
                    if (attrs) {
                        attrs = can.isArray(attrs) ? attrs : [attrs];
                    }
                    var errors = {}, self = this,
                        // helper function that adds error messages to errors object
                        // attr - the name of the attribute
                        // funcs - the validation functions
                        addErrors = function(attr, funcs) {
                            can.each(funcs, function(func) {
                                var res = func.call(self, isTest ? self.__convert ? self.__convert(attr, newVal) : newVal : self.attr(attr));
                                if (res) {
                                    if (!errors[attr]) {
                                        errors[attr] = [];
                                    }
                                    errors[attr].push(res);
                                }
                            });
                        }, validations = this.constructor.validations,
                        isTest = attrs && attrs.length === 1 && arguments.length === 2;
                    // go through each attribute or validation and
                    // add any errors
                    can.each(attrs || validations || {}, function(funcs, attr) {
                        // if we are iterating through an array, use funcs
                        // as the attr name
                        if (typeof attr === 'number') {
                            attr = funcs;
                            funcs = validations[attr];
                        }
                        // add errors to the
                        addErrors(attr, funcs || []);
                    });
                    // return errors as long as we have one
                    return can.isEmptyObject(errors) ? null : isTest ? errors[attrs[0]] : errors;
                }
            });
        return can.Map;
    })(window.can, __m8);

})();