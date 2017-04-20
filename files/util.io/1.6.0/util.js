(function(scope) {
    'use strict';
    
    var Scope = scope.window ? window : global;
    
    if (typeof module === 'object' && module.exports)
        module.exports = new UtilProto();
    else
        Scope.Util = new UtilProto();
    
    function UtilProto() {
        var Util = this;
        
        /*
         * apply arguemnts to constructor
         *
         * @param constructo
         * @param args
         */
        this.applyConstructor   = function(constructor, args) {
            var F = function () {
                return constructor.apply(this, args);
            };
            
            F.prototype = constructor.prototype;
            return new F();
        };
        
        /**
         * Функция ищет в имени файла расширение
         * и если находит возвращает true
         * @param name - получает имя файла
         * @param ext - расширение
         */
        this.checkExt           = function(name, ext) {
            var isMatch, str,
                type        = Util.type(ext),
                regStr      = '\\.({{ exts }})$',
                regExp;
            
            switch(type) {
            case 'string':
                regStr      = Util.render(regStr, {
                    exts: ext
                });
                
                regExp      = new RegExp(regStr, 'i');
                isMatch     = regExp.test(name);
                
                break;
            
            case 'array':
                str         = ext.join('|');
                isMatch     = Util.checkExt(name, str);
                
                break;
            }
            
            return !!isMatch;
        };
        
        this.check              = new checkProto();
        
        function checkProto() {
            /**
             * Check is all arguments with names present
             * 
             * @param name
             * @param arg
             * @param type
             */
            var check = function check(args, names) {
                var msg         = '',
                    template    = '',
                    name        = '',
                    
                    lenNames    = names.length,
                    lenArgs     = args.length,
                    lessArgs    = lenArgs < lenNames;
                
                if (lessArgs) {
                    template    = '{{ name }} coud not be empty!';
                    name        = names[lenNames - 1];
                    
                    msg         = Util.render(template, {
                        name: name
                    });
                    
                    throw(Error(msg));
                }
                
                return check;
            };
            
            /**
             * Check is type of arg with name is equal to type
             * 
             * @param name
             * @param arg
             * @param type
             */
            check.type  = function(name, arg, type) {
                var is = Util.type(arg) === type;
                
                if (!is)
                    throw(Error(name + ' should be ' + type));
                
                return check;
            };
            
            return check;
        }
        
        /**
         * Copy properties from from to to
         * 
         * @param from
         * @param to
         */
        this.copyObj                = function(to, from) {
            if (!from) {
                from    = to;
                to      = {};
            }
            
            if (to)
                Object.keys(from).forEach(function(name) {
                    to[name]    = from[name];
                });
            
            return to;
        };
        
        /**
         * copy objFrom properties to target
         * 
         * @target
         * @objFrom
         */
        this.extend                 = function(target, objFrom) {
            var obj,
                keys, 
                proto,
                isFunc  = Util.type.function(objFrom),
                isArray = Util.type.array(objFrom),
                isObj   = Util.type.object(target),
                ret     = isObj ? target : {};
            
            if (isArray)
                objFrom.forEach(function(item) {
                   ret = Util.extend(target, item); 
                });
                   
            
            else if (objFrom) {
                obj     = isFunc ? new objFrom() : objFrom;
                keys    = Object.keys(obj);
                
                if (!keys.length) {
                    proto = Object.getPrototypeOf(objFrom);
                    keys  = Object.keys(proto);
                }
                
                keys.forEach(function(name) {
                    ret[name] = obj[name];
                });
            }
            
            return ret;
        };
        
        /**
         * extend proto
         * 
         * @obj
         */
        this.extendProto           = function(obj) {
            var ret, F      = function() {};
            F.prototype     = Util.extend({}, obj);
            ret             = new F();
            
            return ret;
        };
        
        this.json               = new JsonProto();
        
        function JsonProto() {
            /**
             * @param str
             */   
            this.parse      = function(str) {
                var obj;
                
                Util.exec.try(function() {
                    obj = JSON.parse(str);
                });
                
                return obj;
            },
            
            /**
             * @param obj
             */
            this.stringify  = function(obj) {
                var str;
                
                Util.exec.try(function() {
                    str = JSON.stringify(obj, null, 4);
                });
                
                return str;
            };
        }
        /**
         * function check is strings are equal
         * @param {String} str1
         * @param {String, Array} str2
         */
        this.strCmp                 = function(str1, str2) {
            var isEqual,
                type    = Util.type(str2);
            
            switch(type) {
            case 'array':
                str2.some(function(str) {
                    isEqual = Util.strCmp(str1, str);
                    
                    return isEqual;
                });
                break;
            
            case 'string':
                isEqual = str1 === str2;
                
                break;
            }
                
            return isEqual;
            
        };
        
        /**
         * function log pArg if it's not empty
         * @param pArg
         */
        this.log                    = function() {
            var args        = this.slice(arguments),
                console     = Scope.console,
                lDate       = '[' + Util.getDate() + '] ';
                
            if (console && args.length && args[0]) {
                args.unshift(lDate);
                
                console.log.apply(console, args);
                
                args.shift();
            }
            
            return args.join(' ');
        };
        
        /**
         * function remove substring from string
         * @param str
         * @param substr
         */
        this.rmStr                  = function(str, substr, isOnce) {
            var replace,
                strArray    = [],
                isString    = Util.type.string(str),
                isArray     = Util.type.array(substr),
                replaceStr  = function(str, strItem) {
                    var ret = str.replace(strItem, '');
                    
                    return ret;
                };
            
            replace         = isOnce ? replaceStr : Util.replaceStr;
            
            if (isString && substr)  {
                if (isArray)
                    strArray = substr;
                else
                    strArray.push(substr);
                
                strArray.forEach(function(strItem) {
                    str = replace(str, strItem, '');
                });
            }
            
            return str;
        };
        
        /**
         * function remove substring from string one time
         * @param str
         * @param substr
         */
        this.rmStrOnce              = function(str, substr) {
            var ONCE    = true;
            
            str = Util.rmStr(str, substr, ONCE);
            
            return str;
        };
        
        /**
         * function replase pFrom to pTo in pStr
         * @param str
         * @param from
         * @param to
         * @param notEscape
         */
        this.replaceStr             = function(str, from, to, notEscape) {
            var regExp,
                isStr   = Util.type.string(str);
            
            if (isStr && from) {
                if (!notEscape)
                    from = Util.escapeRegExp(from);
                
                regExp  = new RegExp(from, 'g');
                str     = str.replace(regExp, to);
            }
           
            return str;
        };
        
        this.escapeRegExp = function(str) {
            var isStr   = Util.type.string(str);
            
            if (isStr)
                str = str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            
            return str;
        };
        
        /**
         * get regexp from wild card
         */
        this.getRegExp              = function(wildcard) {
            var regExp;
            
            if (!wildcard)
                wildcard = '*';
            
            wildcard    = '^' + wildcard; /* search from start of line */
            wildcard    = Util.replaceStr(wildcard, '.', '\\.');
            wildcard    = Util.replaceStr(wildcard, '*', '.*');
            wildcard    = Util.replaceStr(wildcard, '?', '.?\\');
            wildcard    += '$'; /* search to end of line */
            
            regExp      = new RegExp(wildcard);
            
            return regExp;
        };
        
        /**
         * function render template with view
         * @templ
         * @view
         */
        this.render                  = function(templ, view) {
            var ret,
                NOT_ESCAPE  = true,
                SPACES      = '\\s*',
                symbols     = ['{{' + SPACES, SPACES + '}}'];
            
            ret = Util.ownRender(templ, view, symbols, NOT_ESCAPE);
                    
            return ret;
        };
        
        /**
         * function render template with view and own symbols
         *
         * @param templ
         * @param view
         * @param symbols
         * @param notEscape
         */
        this.ownRender                  = function(templ, view, symbols, notEscape) {
            var str, expr,
                ret         = templ,
                firstChar,
                secondChar;
                
            firstChar   = symbols[0];
            secondChar  = symbols[1]  || firstChar;
            
            Object
                .keys(view)
                .forEach(function(param) {
                    str     = view[param];
                    str     = Util.exec(str) || str;
                    expr    = firstChar + param + secondChar;
                    ret     = Util.replaceStr(ret, expr, str, notEscape);
                });
            
            expr        = firstChar + '.*' + secondChar;
            ret         = Util.replaceStr(ret, expr, '', notEscape);
            
            return ret;
        };
        
        this.type                   = new TypeProto();
        
        function TypeProto() {
            /**
             * get type of variable
             * 
             * @param variable
             */
            function type(variable) {
                var regExp      = new RegExp('\\s([a-zA-Z]+)'),
                    str         = {}.toString.call(variable),
                    typeBig     = str.match(regExp)[1],
                    result      = typeBig.toLowerCase();
                
                return result;
            }
            
            /**
             * functions check is variable is type of name
             * 
             * @param variable
             */
            function typeOf(name, variable) {
                return type(variable) === name;
            }
            
            function typeOfSimple(name, variable) {
                return typeof variable === name;
            }
            
            ['arrayBuffer', 'object', 'file', 'array']
                .forEach(function(name) {
                    type[name] = typeOf.bind(null, name);
                });
            
            ['string', 'undefined', 'boolean', 'number', 'function']
                .forEach(function(name) {
                    type[name] = typeOfSimple.bind(null, name);
                });
            
            return type;
        }
        
        /**
         * function makes new array based on first
         * 
         * @param array
         */
        this.slice                  = function(array, begin, end) {
            var ret = [];
            
            if (array)
                ret = [].slice.call(array, begin, end);
            
            return ret;
        };
        
        /**
         * function calls forEach for all array like variables
         * 
         * @param array
         */
        this.forEach                = function(array, callback) {
            var ret = [];
            
            if (array)
                ret = [].forEach.call(array, callback);
            
            return ret;
        };
        
        this.exec                       = new ExecProto();
        
        function ExecProto() {
            /**
             * function do save exec of function
             * @param callback
             * @param arg1
             * ...
             * @param argN
             */
            var exec        = function(callback) {
                var ret,
                    isFunc  = Util.type.function(callback),
                    args    = Util.slice(arguments, 1);
               
                if (isFunc)
                    ret     = callback.apply(null, args);
                
                return ret;
            };
            
            /*
             * return function that calls callback with arguments
             */
            
            exec.with           =  function(callback) {
                var result,
                    bind        = Function.bind;
                
                arguments[0]    = null;
                result          = bind.apply(callback, arguments);
                
                return result;
            };
             
             /**
             * return save exec function
             * @param callback
             */
            exec.ret        = function() {
                var result,
                    args        = Util.slice(arguments);
                
                args.unshift(exec);
                result          = exec.with.apply(null, args);
                
                return result;
            };
            
            /**
             * function do conditional save exec of function
             * @param condition
             * @param callback
             * @param func
             */
            exec.if         = function(condition, callback, func) {
                var ret;
                
                if (condition)
                    exec(callback, condition);
                else
                    exec(func, callback);
                
                return ret;
            };
            
            /**
             * exec function if it exist in object
             * 
             * @param obj
             * @param name
             * @param arg
             */
            exec.ifExist                = function(obj, name, arg) {
                var ret,
                    func    = obj && obj[name];
                
                if (func)
                    func    = func.apply(obj, arg);
                
                return ret;
            };
            
            exec.parallel   = function(funcs, callback) {
                var keys        = [],
                    callbackWas = false,
                    arr         = [],
                    obj         = {},
                    count       = 0,
                    countFuncs  = 0,
                    type        = Util.type(funcs);
                
                Util.check(arguments, ['funcs', 'callback']);
                
                switch(type) {
                case 'array':
                    countFuncs  = funcs.length;
                    
                    funcs.forEach(function(func, num) {
                        exec(func, function() {
                            checkFunc(num, arguments, arr);
                        });
                    });
                    break;
                
                case 'object':
                    keys        = Object.keys(funcs);
                    countFuncs  = keys.length;
                    
                    keys.forEach(function(name) {
                        var func    = funcs[name];
                        
                        exec(func, function() {
                            checkFunc(name, arguments, obj);
                        });
                    });
                    break;
                }
                
                function checkFunc(num, data, all) {
                    var args    = Util.slice(data, 1),
                        isLast  = false,
                        error   = data[0],
                        length  = args.length;
                    
                    ++count;
                    
                    isLast = count === countFuncs;
                    
                    if (!error)
                        if (length >= 2)
                            all[num] = args;
                        else
                            all[num] = args[0];
                    
                    if (!callbackWas && (error || isLast)) {
                        callbackWas = true;
                        
                        if (type === 'array')
                            callback.apply(null, [error].concat(all));
                        else
                            callback(error, all);
                    }
                }
            };
            
            /**
             * load functions thrue callbacks one-by-one
             * @param funcs {Array} - array of functions
             */
            exec.series             = function(funcs) {
                var func, callback,
                    isArray     = Util.type.array(funcs);
                
                if (isArray) {
                    func        = funcs.shift();
                    
                    callback    = function() {
                        return exec.series(funcs);
                    };
                    
                    exec(func, callback);
                }
            };
            
           /**
             * function execute param function in
             * try...catch block
             * 
             * @param callback
             */
            exec.try                = function(callback) {
                var ret;
                try {
                    ret = callback();
                } catch(error) {
                    ret = error;
                }
                
                return ret;
            };
            
            return exec;
        }
        
        /**
         * function gets file extension
         * @param pFileName
         * @return Ext
         */
        this.getExt                     = function(name) {
            var ret     = '',
                dot,
                isStr   = Util.type.string(name);
            
            if (isStr) {
                dot = name.lastIndexOf('.');
                
                if (~dot)
                    ret = name.substr(dot);
            }
            
            return ret;
        };
        
       /**
         * get values from Object Array name properties
         * or 
         * @pObj
         */
        this.getNamesFromObjArray       = function(arr) {
            var ret     = [],
                isArray = Util.type.array(arr);
            
            if (arr && !isArray)
                arr = arr.data;
            
            if (arr)
                arr.forEach(function(item) {
                    ret.push(item.name || item);
                });
            
            return ret;
        };
        
        /**
         * find object by name in arrray
         *  
         * @param array
         * @param name
         */
        this.findObjByNameInArr         = function(array, name) {
            var ret,
                isArray = Util.type.array(array);
            
            if (isArray) {
                array.some(function(item) {
                    var is = item.name === name,
                        isArray = Util.type.array(item);
                    
                    if (is)
                        ret = item;
                    else if (isArray)
                        item.some(function(item) {
                            is = item.name === name;
                            
                            if (is)
                                ret = item.data;
                        });
                    
                    return is;
                });
            }
            
            return ret;
        };
        
        /** 
         * Gets current time in format hh:mm:ss
         */
        this.getTime                    = function() {
            var ret,
                date        = new Date(),
                hours       = date.getHours(),
                minutes     = date.getMinutes(),
                seconds     = date.getSeconds();
                
            minutes         = minutes < 10 ? '0' + minutes : minutes;
            seconds         = seconds < 10 ? '0' + seconds : seconds;
            
            ret            = hours + ':' + minutes + ':' + seconds;
            
            return ret;
        };
        
        
        /**
         * start timer
         * @param name
         */
        this.time                       = function(name) {
            var console     = Scope.console;
            
            Util.exec.ifExist(console, 'time', [name]);
            
            return this;
        };
        
        /**
         * stop timer
         * @param name
         */
        this.timeEnd                   = function(name) {
            var console    = Scope.console;
            
            Util.exec.ifExist(console, 'timeEnd', [name]);
            
            return this;
        };
        
        /** 
         * Gets current date in format yy.mm.dd hh:mm:ss
         */
        this.getDate                    = function() {
            var date    = Util.getShortDate(),
                time    = Util.getTime(),
                ret     = date + ' ' + time;
            
            return ret;
        };
        
        this.getShortDate               = function() {
            var ret,
                date    = new Date(),
                day     = date.getDate(),
                month   = date.getMonth() + 1,
                year    = date.getFullYear();
                
            if (month <= 9)
                month = '0' + month;
            
            ret         = year + '.' + month + '.' + day;
            
            return ret;
        };
    }
    
})(this);
