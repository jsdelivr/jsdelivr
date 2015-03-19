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
         * add listener to observer
         *
         * @param name          - event name
         * @param func          - function
         * @param allListeners  - listeners array
         * @param observer      - observer object
         */
        this.addListener            = function(name, func, allListeners, observer) {
            var listeners, obj,
                type    = Util.getType(name);
            
            switch(type) {
            case 'string':
                listeners       = allListeners[name];
                
                if (!listeners)
                    listeners   = allListeners[name] = [];
                
                listeners.push(func);
                
                if (func && observer)
                    observer.on(name, func);
                
                break;
            
            case 'object':
                obj = name;
                
                Object.keys(obj).forEach(function(name) {
                    func = obj[name];
                    Util.addListener(name, func, allListeners, observer);
                });
                
                break;
            }
            
            return this;
        };
        
        /**
         * remove listener from observer
         *
         * @param name          - event name
         * @param func          - function
         * @param allListeners  - listeners array
         * @param observer      - observer object
         */
        this.removeListener         = function(name, func, allListeners, observer) {
            var listeners;
            
            if (observer)
                observer.removeListener(name, func);
            
            listeners   = allListeners[name];
            
            if (listeners)
                listeners = listeners.map(function(listener) {
                    if (listener === func)
                        listener = null;
                    
                    return listener;
                });
            
            return this;
        };
        
        /**
         * Функция ищет в имени файла расширение
         * и если находит возвращает true
         * @param name - получает имя файла
         * @param ext - расширение
         */
        this.checkExt           = function(name, ext) {
            var isMatch, str,
                type        = Util.getType(ext),
                regStr      = '\\.({{ exts }})$',
                regExp;
            
            switch(type) {
            case 'string':
                regStr      = Util.render(regStr, {
                    exts: ext
                });
                
                regExp      = new RegExp(regStr, 'i');
                isMatch     = name.match(regExp);
                
                break;
            
            case 'array':
                str         = ext.join('|');
                isMatch     = Util.checkExt(name, str);
                
                break;
            }
            
            return !!isMatch;
        };
        
        this.checkArgs          = function(argsParam, names) {
            var error,
                msg         = '',
                i           = 0,
                n           = names.length,
                template    = '{{ name }} coud not be empty!';
            
            for (i = 0; i < n; i++)
                if (!argsParam[i]) {
                    msg     = Util.render(template, {
                        name: names[i]
                    });
                    
                    error   = new Error(msg);
                    throw(error);
                }
            
            return this;
        };
        
        /**
         * Check is type of arg with name is equal to type
         * 
         * @param name
         * @param arg
         * @param type
         */
        this.checkType          = function(name, arg, type) {
            var is = Util.getType(arg) === type;
            
            if (!is)
                throw(Error(name + ' should be ' + type));
            
            return this;
        };
        
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
         * copy pObj properties to pTargetObject
         * 
         * @pTarget
         * @pObj
         */
        this.extend                 = function(pTarget, PObj) {
            var i, n, lObj, 
                isFunc  = Util.isFunction(PObj),
                isArray = Util.isArray(PObj),
                isObj   = Util.isObject(pTarget),
                ret     = isObj ? pTarget : {};
            
            if (isArray)
                for (i = 0, n = PObj.length; i < n; i++)
                   ret = Util.extend(pTarget, PObj[i]);
            
            else if (PObj) {
                lObj = isFunc ? new PObj() : PObj;
                
                for(i in lObj)
                    ret[i] = lObj[i];
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
        
        /**
         * @param pJSON
         */    
        this.parseJSON               = function(str) {
            var obj;
            
            Util.exec.try(function() {
                obj = JSON.parse(str);
            });
            
            return obj;
        };
        
        /**
         * @param pObj
         */
        this.stringifyJSON           = function(obj) {
            var str;
            
            Util.exec.tryLog(function() {
                str = JSON.stringify(obj, null, 4);
            });
            
            return str;
        };
        
        /**
         * function check is strings are equal
         * @param {String} str1
         * @param {String, Array} str2
         */
        this.strCmp                 = function(str1, str2) {
            var isEqual,
                type    = Util.getType(str2);
            
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
        
        this.getStrBigFirst         = function(pStr) {
            var ret;
            
            if (Util.isString(pStr) && pStr.length > 0)
                ret =  pStr[0].toUpperCase() + 
                        pStr.substring(1);
            else
                ret = pStr;
            
            return ret;
        };
        
        /**
         * function returns is str1 contains str2
         * @param str1
         * @param str2
         */
         
        this.isContainStr           = function(str1, str2) {
            var i, n, str, is, index,
                isStr   = Util.isString(str1),
                type    = Util.getType(str2);
            
            if (isStr)
                switch (type) {
                case 'array':
                    n  = str2.length;
                     
                    for (i = 0; i < n; i++) {
                        str    = str2[i];
                        is    = Util.isContainStr(str1, str);
                        
                        if (is)
                            break;
                    }
                    break;
                
                case 'string':
                    index   = str1.indexOf(str2);
                    is      = index >= 0;
                    break;
                }
            
            return is;
        };
        
        /**
         * is pStr1 contains pStr2 at begin
         * @param pStr1
         * @param pStr2
         */
        this.isContainStrAtBegin    = function(pStr1, pStr2) {
            var i, n, length, subStr, ret;
            
            if (Util.isString(pStr1))
                 if (Util.isArray(pStr2)) {
                     n = pStr2.length;
                     
                     for(i = 0; i < n; i++) {
                        ret = Util.isContainStrAtBegin(pStr1, pStr2[i]);
                        
                        if (ret)
                            break;
                     }
                 } else {
                    length = pStr2.length,
                    subStr = pStr1.substring(0, length);
                    
                    ret = subStr === pStr2;
                }
                
            return ret;
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
         * log array of elements
         * @param array
         */
        this.logArray               = function(array) {
            var isArray = Util.isArray(array);
            
            if (isArray)
                array.forEach(function(item) {
                    Util.log(item);
                });
            
            return array;
        };
        
        /**
         * function log pArg if it's not empty
         * @param pArg
         */
        this.logError               = function(pArg) {
            var lConsole    = Scope.console,
                lDate       = '[' + Util.getDate() + '] ';
            
            if (lConsole && pArg) {
                var lMsg = pArg.message;
                if (lMsg)
                    lDate += pArg.message + ' ';
                
                lConsole.error(lDate, pArg);
            }
            
            return pArg;
        };
        
        /**
         * function remove substring from string
         * @param str
         * @param substr
         */
        this.rmStr                  = function(str, substr, isOnce) {
            var replace,
                strArray    = [],
                isString    = Util.isString(str),
                isArray     = Util.isArray(substr),
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
                isStr   = Util.isString(str);
            
            if (isStr && from) {
                if (!notEscape)
                    from = Util.escapeRegExp(from);
                
                regExp  = new RegExp(from, 'g');
                str     = str.replace(regExp, to);
            }
           
            return str;
        };
        
        /**
         * function convert name: rm: '(, ), -, " "'
         * 
         * @name
         * convert 
         */
        this.convertName            = function(name) {
            var conv = name && name.toLowerCase();
            
            conv    = Util.rmStr(conv, ['(', ')']);
            conv    = Util.replaceStr(conv, ' ', '-');
            
            return conv;
        };
        
        this.escapeRegExp = function(str) {
            var isStr   = Util.isString(str);
            
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
         * @templ
         * @view
         * @symbols
         */
        this.ownRender                  = function(templ, view, symbols, notEscape) {
            var str, param, expr,
                ret         = templ,
                firstChar,
                secondChar;
                
            firstChar   = symbols[0];
            secondChar  = symbols[1]  || firstChar;
            
            for (param in view) {
                str     = view[param];
                str     = Util.exec(str) || str;
                expr    = firstChar + param + secondChar;
                ret     = Util.replaceStr(ret, expr, str, notEscape);
            }
            
            expr        = firstChar + '.*' + secondChar;
            ret         = Util.replaceStr(ret, expr, '', notEscape);
            
            return ret;
        };
        
        /**
         * functions check is variable is array
         * @param variable
         */
        this.isArray                = function(variable) {
            return Array.isArray(variable);
        };
        
        /**
         * functions check is variable is arrayBuffer
         * @param variable
         */
        this.isArrayBuffer          = function(variable) {
            var type    = this.getType(variable),
                is      = type === 'arraybuffer';
            
            return is;
        };
        
        /**
         * functions check is variable is boolean
         * @param variable
         */
        this.isBoolean               = function(variable) {
            return Util.isType(variable, 'boolean');
        };
        
        /**
         * functions check is variable is function
         * @param variable
         */
        this.isFunction             = function(variable) {
            return Util.isType(variable, 'function');
        };
        
        /**
         * functions check is variable is number
         * @param variable
         */
        this.isNumber               = function(variable) {
            return Util.isType(variable, 'number');
        };
        
        /**
         * functions check is variable is object
         * @param variable
         */
        this.isObject               = function(variable) {
            var type    = Util.getType(variable),
                is      = type === 'object';
            
            return is;
        };
        
        /**
         * functions check is variable is string
         * @param variable
         */
        this.isString               = function(variable) {
            return Util.isType(variable, 'string');
        };
        
        /**
         * functions check is variable is string
         * @param variable
         */
        this.isUndefined           = function(variable) {
            return Util.isType(variable, 'undefined');
        };
        
        /**
         * functions check is variable is File
         * @param variable
         */
        this.isFile                 = function(variable) {
            var FILE = '[object File]',
                name, is;
            
            name    = Util.exec.ifExist(variable, 'toString');
            
            is      = name === FILE;
            
            return is;
        };
        
        /**
         * functions check is variable is type
         * @param variable
         * @param type
         */    
        this.isType                 = function(variable, type) {
            return typeof variable === type;
        };
        
        /**
         * get type of variable
         * 
         * @param variable
         */
        this.getType                = function(variable) {
            var regExp      = new RegExp('\\s([a-zA-Z]+)'),
                str         = {}.toString.call(variable),
                typeBig     = str.match(regExp)[1],
                type        = typeBig.toLowerCase();
            
            return type;
        };
        
        /**
         * function return false
         */
        this.retFalse               = function() {
            var ret = false;
            
            return ret;
        };
        
        /**
         * function return param
         */
        this.retParam               = function(pParam) {
            return pParam;
        };
        
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
                    isFunc  = Util.isFunction(callback),
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
                
                if (func) {
                    func    = func.bind(obj);
                    ret     = exec(func, arg);
                }
                
                return ret;
            };
            
            exec.parallel   = function(funcs, callback) {
                var keys        = [],
                    callbackWas = false,
                    arr         = [],
                    obj         = {},
                    count       = 0,
                    countFuncs  = 0,
                    type        = Util.getType(funcs);
                
                Util.checkArgs(arguments, ['funcs', 'callback']);
                
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
                    isArray     = Util.isArray(funcs);
                
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
            
            /**
             * function execute param function in
             * try...catch block and log result
             * 
             * @param tryFunc
             */
            exec.tryLog             = function(tryFunc) {
                var ret;
                
                ret = this.try(tryFunc);
                
                return Util.logError(ret);
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
                isStr   = Util.isString(name);
            
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
                isArray = Util.isArray(arr);
            
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
                isArray = Util.isArray(array);
            
            if (isArray) {
                array.some(function(item) {
                    var is = item.name === name,
                        isArray = Util.isArray(item);
                    
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
            
            Util.exec.ifExist(console, 'time', name);
            
            return this;
        };
        
        /**
         * stop timer
         * @param name
         */
        this.timeEnd                   = function(name) {
            var console    = Scope.console;
            
            Util.exec.ifExist(console, 'timeEnd', name);
            
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
