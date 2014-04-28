/*
 * Licensed under MIT License http://www.opensource.org/licenses/mit-license
 * Module contain additional system functional
 */

(function(scope) {
    'use strict';
    
    var Scope = scope.window ? window : global;
    
    if (typeof module === 'object' && module.exports)
        module.exports = new UtilProto();
    else
        Scope.Util = new UtilProto();
    
    function UtilProto() {
        var Util = this;
        
        this.asyncCall              = function(funcs, callback) {
            var i, func,
                funcsCount  = funcs.length,
                count       = 0,
                allData     = [];
                
            for (i = 0; i < funcsCount; i++) {
                func = funcs[i];
                callCheckFunc(i, func);
            }
            
            function checkFunc(num, data) {
                var i, n    = data.length,
                    params  = [];
                
                ++count;
                
                if (n >= 2) {
                    for (i = 0; i < n; i++)
                        params[i] = data[i];
                    
                    allData[num] = params;
                } else
                    allData[num] = data[0];
                
                if (count === funcsCount)
                    Util.retExec(callback).apply(null, allData);
            }
            
            function callCheckFunc(num, func) {
                Util.exec(func, function() {
                    checkFunc(num, arguments);
                });
            }
        },
        
        /*
         * bind function to arguments without context
         */
        
        this.bind           =  function(callback) {
            var result,
                args    = Util.slice(arguments, 1),
                bind    = Function.prototype.bind;
            
            args.unshift(null);
            result      = bind.apply(callback, args);
            
            return result;
        };
        
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
        this.checkExtension         = function(name, ext) {
            var i, extNum, extSub, ret,
                extLength   = ext && ext.length,
                length      = name && name.length;
            
            /* если длина имени больше длинны расширения - имеет смысл продолжать */
            if (Util.isObject(ext) && extLength)
                for (i = 0; i < length; i++) {
                    ret = Util.checkExtension(name, ext[i]);
                    
                    if (ret)
                        break;
                }
            else if (length > extLength) {
                extNum = name.lastIndexOf(ext),  /* последнее вхождение расширения*/
                extSub = length - extNum;        /* длина расширения*/
                
                /* если pExt - расширение pName */
                ret = extSub === extLength;
            
            }
            
            return ret;
        };
        
        
        /**
         * Check is Properties exists and they are true if neaded
         * 
         * @param pObj
         * @param pPropArr
         * @param pTrueArr
         */
        this.checkObj               = function(pObj, pPropArr, pTrueArr) {
            var lRet,
                i, n;
            
            if (pObj) {
                lRet = Util.isArray(pPropArr);
                if (lRet) {
                    n = pPropArr.length;
                    for (i = 0; i < n; i++) {
                        var lProp = pPropArr[i];
                        lRet = pObj.hasOwnProperty( lProp );
                        if (!lRet) {
                            console.trace();
                            Util.logError(lProp + '  not in Obj!');
                            Util.log(pObj);
                            break;
                        }
                    }
                }
                
                if (lRet && Util.isArray(pTrueArr))
                    lRet = Util.checkObjTrue(pObj, pTrueArr);
            }
            
            return lRet;
        };
        
        /**
         * Check is Properties exists and they are true 
         * 
         * @param pObj
         * @param pPropArr
         * @param pTrueArr
         */
        this.checkObjTrue           = function(pObj, pTrueArr) {
            var lRet, lTrueArr,
                i, n;
            if (pObj) {
                lTrueArr = Util.isArray(pTrueArr) ? pTrueArr : [pTrueArr];
                
                n = lTrueArr.length;
                for(i = 0; i < n; i++) {
                    var lProp   = lTrueArr[i];
                    lRet        = pObj[lProp];
                    
                    if (!lRet) {
                        console.trace();
                        Util.logError(lProp + '  not true!');
                        Util.log(pObj);
                        break;
                    }
                }
            }
            
            return lRet;
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
            
            Util.forIn(from, function(name) {
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
            var i, n, lObj, lRet = Util.isObject(pTarget) ? pTarget : {};
            
            if ( Util.isArray(PObj) )
                for(i = 0, n = PObj.length; i < n; i++)
                    lRet = Util.extend(pTarget, PObj[i]);
            
            else if (PObj) {
                lObj = Util.isFunction(PObj)  ? new PObj() : PObj;
                
                for(i in lObj)
                    lRet[i] = lObj[i];
            }
            
            return lRet;
        };
        
        /**
         * copy pObj properties to pTargetObject
         * 
         * @pTarget
         * @pObj
         */
         this.extendProto           = function(pObj) {
            var lRet, F     = function() {};
            F.prototype     = Util.extend({}, pObj);
            lRet = new F();
            
            return lRet;
         };
        
        /** for function
         *  @param pI
         *  @param pN
         *  @param pFunc
         */
        this.for                    = function(pI, pN, pFunc) {
            if (Util.isFunction(pFunc))
                for(var i = pI, n = pN; i < n; i++) {
                    if (pFunc(i))
                        break;
                }
        };
        
         /** for in function
         *  @param pObj
         *  @param pFunc
         */
        this.forIn                    = function(pObj, pFunc) {
            if (Util.isFunction(pFunc))
                for(var lName in pObj)
                    if (pFunc(lName))
                        break;
        };
        
        /** for function with i = 0
         *  @param pN
         *  @param pFunc
         */
        this.fori                   = function(pN, pFunc) {
            var lRet = Util.for(0, pN, pFunc);
            
            return lRet;
        };
        
        /**
         * @param pJSON
         */    
        this.parseJSON               = function(pJSON) {
            var lRet;
            
            Util.tryCatch(function() {
                lRet = JSON.parse(pJSON);
            });
            
            return lRet;
        };
        
        /**
         * @param pObj
         */
        this.stringifyJSON           = function(pObj) {
            var ret;
            
            Util.tryCatchLog(function() {
                ret = JSON.stringify(pObj, null, 4);
            });
            
            return ret;
        };
        
        /**
         * function check is strings are equal
         * @param pStr1
         * @param pStr2
         */
        this.strCmp                 = function(pStr1, pStr2) {
            var i, n,
                lRet = Util.isString(pStr1);
            
            if (lRet)
                if (Util.isArray(pStr2))
                    for (i = 0, n = pStr2.length; i < n; i++) {
                        lRet = Util.strCmp(pStr1, pStr2[i]);
                        
                        if (lRet)
                            break;
                    }
                else if (Util.isString(pStr2))
                    lRet =  Util.isContainStr(pStr1, pStr2) &&
                        pStr1.length === pStr2.length;
            
            return lRet;
            
        };
        
        this.getStrBigFirst         = function(pStr) {
            var lRet;
            
            if (Util.isString(pStr) && pStr.length > 0)
                lRet =  pStr[0].toUpperCase() + 
                        pStr.substring(1);
            else
                lRet = pStr;
            
            return lRet;
        };
        
        /**
         * function returns is pStr1 contains pStr2
         * @param pStr1
         * @param pStr2
         */
         
        this.isContainStr           = function(pStr1, pStr2) {
            var i, n, regExp, str,
                ret     = Util.isString(pStr1);
            
            if (ret)
                if (Util.isArray(pStr2)) {
                     n  = pStr2.length;
                     
                     for(i = 0; i < n; i++) {
                         str    = pStr2[i];
                         ret    = Util.isContainStr(pStr1, str);
                        
                        if (ret)
                            break;
                     }
                } else if (Util.isString(pStr2))
                    ret = pStr1.indexOf(pStr2) >= 0;
            
            return ret;
        };
        
        /**
         * is pStr1 contains pStr2 at begin
         * @param pStr1
         * @param pStr2
         */
        this.isContainStrAtBegin    = function(pStr1, pStr2) {
            var i, n, length, subStr, lRet;
            
            if (Util.isString(pStr1))
                 if (Util.isArray(pStr2)) {
                     n = pStr2.length;
                     
                     for(i = 0; i < n; i++) {
                        lRet = Util.isContainStrAtBegin(pStr1, pStr2[i]);
                        
                        if (lRet)
                            break;
                     }
                 } else {
                    length = pStr2.length,
                    subStr = pStr1.substring(0, length);
                    
                    lRet = subStr === pStr2;
                }
                
            return lRet;
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
         * @param pArray
         */
        this.logArray               = function(pArray) {
            var i, n;
            
            if (pArray)
                for (i = 0, n = pArray.length; i < n; i++)
                    Util.log( pArray[i] );
            
            return pArray;
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
                if ( lMsg )
                    lDate += pArg.message + ' ';
                
                lConsole.error(lDate, pArg);
            }
            
            return pArg;
        };
        
        /**
         * load functions thrue callbacks one-by-one
         * @param funcs {Array} - array of functions
         */
        this.loadOnLoad             = function(funcs) {
            var func, callback;
            
            if (Util.isArray(funcs)) {
                func        = funcs.shift();
                
                callback    = function() {
                    return Util.loadOnLoad(funcs);
                };
                
                Util.exec(func, callback);
            }
        };
        
        /**
         * function remove substring from string
         * @param str
         * @param substr
         */
        this.removeStr              = function(str, substr) {
            var n, isArray,
                isString = Util.isString(str);
            
            if (isString && substr)  {
                n       = substr.length;
                isArray = Util.isArray(substr);
                
                if (!isArray)
                    str = Util.replaceStr(str, substr, '');
                else
                    Util.fori(n, function(i) {
                        str =  Util.replaceStr(str, substr[i], '');
                    });
            }
            
            return str;
        };
        
          /**
         * function remove substring from string one time
         * @param pStr
         * @param pSubStr
         */
        this.removeStrOneTime            = function(str, substr) {
            var n, isArray,
                isString = Util.isString(str);
            
            if (isString && substr) {
                n       = substr.length;
                isArray = Util.isArray(substr);
                
                if (!isArray)
                    str = str.replace(substr, '');
                else
                    Util.fori(n, function(i) {
                        str = str.replace(substr[i], '');
                    });
            }
            
            return str;
        };
        
        /**
         * function replase pFrom to pTo in pStr
         * @pStr
         * @pFrom
         * @pTo
         * @pNotEscape
         */
        this.replaceStr             = function(pStr, pFrom, pTo, pNotEscape) {
            var lRet = pStr;
            
            if (pStr && pFrom) {
                if (!pNotEscape)
                    pFrom = Util.escapeRegExp(pFrom);
                
                lRet = pStr.replace(new RegExp(pFrom, 'g'), pTo);
            }
           
           return lRet;
        };
        
        /**
         * function convert name: rm: '(, ), -, " "'
         * 
         * @name
         * convert 
         */
        this.convertName            = function(name) {
            var conv = name && name.toLowerCase();
            
            conv    = Util.removeStr(conv, ['(', ')']);
            conv    = Util.replaceStr(conv, ' ', '-');
            
            return conv;
        };
        
        this.escapeRegExp = function(pStr) {
            var lRet    = pStr,
                isStr   = Util.isString(pStr);
            
            if (isStr)
                lRet = pStr.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            
            return lRet;
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
         * invoke a couple of functions in paralel
         * 
         * @param {Array} pFuncs
         * @param {function} pCallback
         * 
         * Example:
         * i >=0, pFuncs[i] = function(param, callback) {}
         */
        this.paralelExec            = function(pFuncs, pCallback) {
            var done = [];
            
            /* add items to array done*/
            function addFunc(pNum) {
                done.push(pNum);
            }
            
            /* 
             * improve callback of funcs so
             * we pop number of function and
             * if it's last we call pCallBack
             */
            function doneFunc(pParams) {
                Util.exec(pParams.callback);
                
                var lNum = done.pop (pParams.number);
                if (!lNum) {
                    Util.exec(pCallback);
                }
            }
            
            for(var i = 0, n = pFuncs.length; i < n; i++) {
                addFunc(i);
                
                var lFunc = pFuncs[i].callback;
                
                pFuncs[i].callback = Util.retExec(doneFunc, {
                    number      : i,
                    callback    : lFunc
                });
            }
        };
        
        /**
         * functions check is variable is array
         * @param variable
         */
        this.isArray                = function(variable) {
            return variable instanceof Array;
        };
        
        /**
         * functions check is variable is ArrayBuffer
         * @param variable
         */
        this.isArrayBuffer          = function(variable) {
            return variable instanceof ArrayBuffer;
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
            return Util.isType(variable, 'object');
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
            
            name    = Util.execIfExist(variable, 'toString');
            
            is      = name === FILE;
            
            return is;
        };
        
        /**
         * functions check is variable is pType
         * @param variable
         * @param pType
         */    
        this.isType                 = function(variable, pType) {
            return typeof variable === pType;
        };
        
        
       /**
         * return save exec function
         * @param callback
         */
        this.retExec                = function() {
            var result,
                exec    = Util.exec.bind(Util),
                args    = Util.slice(arguments);
            
            args.unshift(exec);
            result      = Util.bind.apply(null, args);
            
            return result;
        };
        
        /**
         * function return false
         */
        this.retFalse               = function() {
            var lRet = false;
            
            return lRet;
        };
        
        /**
         * function return param
         */
        this.retParam               = function(pParam) {
            return pParam;
        };
        
        /**
         * return load functions thrue callbacks one-by-one
         * @param pFunc_a {Array} - array of functions
         * @param pData - not necessarily
         */
        this.retLoadOnLoad             = function(pFunc_a, pData) {
            return function() {
                Util.loadOnLoad(pFunc_a, pData);
            };
        };
        
        /**
         * function makes new array based on first
         * 
         * @param array
         */
        this.slice                  = function(array, count) {
            var ret;
            
            if (array)
                ret = [].slice.call(array, count);
            
            return ret;
        };
        
        /**
         * function execute param function in
         * try...catch block
         * 
         * @param pCallBack
         */
        this.tryCatch               = function(pCallBack) {
            var lRet;
            try{
                lRet = pCallBack();
            }
            catch(pError) {
                lRet = pError;
            }
            
            return lRet;
        };
        
        /**
         * function execute param function in
         * try...catch block and log result
         * 
         * @param pTryFunc
         */
        this.tryCatchDebug          = function(pTryFunc) {
            var lRet = Util.tryCatch(pTryFunc);
            
            if (lRet)
                Util.debug();
            
            return lRet;
        };
        
        /**
         * function execute param function in
         * try...catch block and log result
         * 
         * @param pTryFunc
         */
        this.tryCatchLog                = function(pTryFunc) {
            var lRet;
            
            lRet = Util.tryCatch(pTryFunc);
            
            return Util.logError(lRet);
        };
        
        /**
         * function execute param function in
         * try...catch block and log result
         * 
         * @param pCallBack
         */
        this.tryCatchCall               = function(pTryFunc, pCallBack) {
            var lRet;
            
            lRet = Util.tryCatch(pTryFunc);
            
            if (lRet)
                Util.exec(pCallBack, lRet);
            
            return lRet;
        };
        
        /**
         * function do save exec of function
         * @param pCallBack
         * @param pArg1
         * ...
         * @param pArgN
         */
        this.exec                       = function(callback) {
            var ret,
                args    = Util.slice(arguments, 1);
           
            if (Util.isFunction(callback))
                ret     = callback.apply(null, args);
            
            return ret;
        };
        
        this.execOnMatch                = function(exp, funcsObj) {
            var name, func, match;
            
            if (funcsObj)
                for (name in funcsObj) {
                    match   = name.match(new RegExp(exp));
                    func    = funcsObj[name];
                    
                    if (match)
                        Util.exec(func, match);
                }
        };
        
        /**
         * exec function if it exist in object
         * @pArg
         */
        this.execIfExist                = function(pObj, pName, pArg) {
            var ret,
                func    = pObj && pObj[pName];
            
            if (func) {
                func    = func.bind(pObj);
                ret     = Util.exec(func, pArg);
            }
            
            return ret;
        };
        
        /**
         * function do conditional save exec of function
         * @param pCondition
         * @param pCallBack
         * @param pFunc
         */
        this.ifExec                       = function(pCondition, pCallBack, pFunc) {
            var lRet;
            
            if (pCondition)
                Util.exec(pCallBack, pCondition);
            else
                Util.exec(pFunc, pCallBack);
            
            return lRet;
        };
        
        /**
         * function gets file extension
         * @param pFileName
         * @return Ext
         */
        this.getExtension               = function(name) {
            var ret, dot,
                isStr = Util.isString(name);
            
            if (isStr) {
                dot = name.lastIndexOf('.');
                ret = name.substr(dot);
            }
            
            return ret;
        };
        
       /**
         * get values from Object Array name properties
         * or 
         * @pObj
         */
        this.getNamesFromObjArray       = function(pArr) {
            var lRet = [];
            
            if (pArr && !Util.isArray(pArr))
                pArr = pArr.data;
            
            if (pArr)
                Util.fori(pArr.length, function(i) {
                    lRet[i] = pArr[i].name || pArr[i];
                });
            
            return lRet;
        };
        
        /**
         * find object by name in arrray
         * or 
         * @pObj
         */
        this.findObjByNameInArr         = function(pArr, pObjName) {
            var lRet;
            
            if (pArr) {
                for(var i = 0, n = pArr.length; i < n; i++ )
                    if (pArr[i].name === pObjName) break;
                
                lRet = pArr[i].data;
            }
            
            return lRet;
        };
        
        /** 
         * Gets current time in format hh:mm:ss
         */
        this.getTime                    = function() {
            var lRet,
                date        = new Date(),
                hours       = date.getHours(),
                minutes     = date.getMinutes(),
                seconds     = date.getSeconds();
                
            minutes         = minutes < 10 ? '0' + minutes : minutes;
            seconds         = seconds < 10 ? '0' + seconds : seconds;
            
            lRet            = hours + ":" + minutes + ":" + seconds;
            
            return lRet;
        };
        
        
        /**
         * start timer
         * @pArg
         */
        this.time                       = function(pArg) {
            var lRet,
                lConsole    = Scope.console;
            
            lRet = Util.execIfExist(lConsole, 'time', pArg);
            
            return lRet;
        };
        
        /**
         * stop timer
         * @pArg
         */
        this.timeEnd                   = function(pArg) {
            var lRet,
                lConsole    = Scope.console;
            
            lRet = Util.execIfExist(lConsole, 'timeEnd', pArg);
            
            return lRet;
        };
        
        /** 
         * Gets current date in format yy.mm.dd hh:mm:ss
         */
        this.getDate                    = function() {
            var date    = new Date(),
                day     = date.getDate(),
                month   = date.getMonth() + 1,
                year    = date.getFullYear(),
                lRet    = year + "-" + month + "-" + day + " " + Util.getTime();
            
            return lRet;
        };
    }
    
})(this);
