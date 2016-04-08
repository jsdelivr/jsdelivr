//exporting code from Handlebarjs
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Dashbars = root.Dashbars || factory();
    }
})(this, function () {
//d.js
var _moment = function(){
    return (typeof window === 'undefined')? require('moment'): window.moment;
};

// jshint unused:false
var d = function d($register, $helper){

    //return string
    $register('d-iso', function(d) {
        return _moment()(d).toISOString();
    });
    //http://momentjs.com/docs/#/parsing/string-format/
    $register('d-format', function(format, d) {
        return _moment()(d).format(format);
    });

    //return date
    $register('d-now', function() {
        return new Date();
    });
    $register('d-date', function(format, s) {
        return _moment()(s, format).toDate();
    });
    $register('d-add', function(n, unit, d) {
        return _moment()(d).add(n, unit).toDate();
    });
    $register('d-subtract', function(n, unit, d) {
        return _moment()(d).subtract(n, unit).toDate();
    });
};

//dash.js
// jshint unused:false
var dash = function dash($register, $helper){
    //List
    $register('-map', function(fn, list) {
        return list.map($helper(fn));
    });
    $register('-sort', function(list, compare, options) {
        return list.slice().sort(options && $helper(compare));
    });
    $register('-take', function(n, list) {
       return list.slice(0, n);
    });
    $register('-drop', function(n, list) {
       return list.slice(n);
    });
    $register('-filter', function(pred, list) {
       return list.filter($helper(pred));
    });
    $register('-take-while', function(pred, list) {
        return _().takeWhile(list, $helper(pred));
    });
    $register('-drop-while', function(pred, list) {
        return _().dropWhile(list, $helper(pred));
    });
    $register('-slice', function(list, begin, end, options) {
        return list.slice(end && begin, options && end);
    });
    $register('-flatten', function(list) {
        return _().flatten(list);
    });
    $register('-deep-flatten', function(list) {
        return _().flatten(list, true);
    });

    //Cons
    $register('-array', function() {
        return Array.prototype.slice.call(arguments, 0, -1);
    });
    $register('-range', function(from, to, step, options) {
        return _().range(to && from, step && to, options && step);
    });
    $register('-object', function(json) {
        return JSON.parse(json);
    });

    //Reductions
    $register('-size', function(list) {
        return list.length;
    });
    $register('-find', function(pred, list) {
        return _().find(list, $helper(pred).bind(this));
    });
    $register('-reduce', function(fn, initial, list) {
        return list.reduce($helper(fn), initial);
    });
    $register('-first', function(list) {
        return _().first(list);
    });
    $register('-last', function(list) {
        return _().last(list);
    });
    $register('-join', function(list, sep, options) {
        return list.join(options? sep:'');
    });
    $register('-sum', function(list) {
        return list.reduce(function(r, e){
                return r+e;
            }, 0);
    });
    $register('-product', function(list) {
        return list.reduce(function(r, e){
                return r*e;
            }, 1);
    });
    $register('-min', function(list) {
        return list.reduce(function(r, e){
                return r<e? r:e;
            }, Number.MAX_VALUE);
    });
    $register('-max', function(list) {
        return list.reduce(function(r, e){
                return r>e? r:e;
            }, Number.MIN_VALUE);
    });

    //Partitioning
    $register('-group-by', function(fn, list) {
        var that = this;
        return list.reduce(function(r, el){
            var key = $helper(fn).call(that, el);

            if( r[key] ){
               r[key].push(el);
            }else{
               r[key] = [el];
            }

            return r;
        }, {});
    });

    //Iteration
    $register('-grouped', function(size, list){
        return _().range(0, list.length, size)
            .map(function(n){ return list.slice(n, n+size);});
    });

    //Predicate
    $register('-every?', function(pred, list){
        return list.every($helper(pred));
    });
    $register('-some?', function(pred, list){
        return list.some($helper(pred));
    });
    $register('-none?', function(pred, list){
        return !list.some($helper(pred));
    });
    $register('-contain?', function(item, list){
        return list.some(function(el){
                return el === item;
            });
    });

    //Set operation
    $register('-union', function() {
        return Array.prototype.concat.apply(arguments[0],
            Array.prototype.slice.call(arguments, 1, -1));
    });
    $register('-difference', function() {
        return _().difference.apply(null,
            Array.prototype.slice.call(arguments, 0, -1));
    });
    $register('-intersection', function() {
        return _().intersection.apply(null,
            Array.prototype.slice.call(arguments, 0, -1));
    });
    $register('-distinct', function(list) {
        return _().unique(list);
    });

    //Dictionary
    $register('-get', function(key, dict) {
        return dict[key];
    });
    $register('-keys', function(dict) {
        return Object.keys(dict);
    });
    $register('-values', function(dict) {
        return Object.keys(dict).map(function(k){
                return dict[k];
            });
    });

    //Object
    $register('-json', function(dict) {
        return JSON.stringify(dict);
    });

    //Function
    $register('-call', function() {
        var fn = arguments[0];
        var args = Array.prototype.slice.call(arguments, 1, -1);

       return fn.apply(this, args);
    });
    $register('-as-is', function(o) {
        return o;
    });
    $register('-partial', function() {
        var fn = arguments[0];
        var applied = Array.prototype.slice.call(arguments, 1, -1);
        var that = this;
        return function(){
            var args = applied.slice();
            var arg = 0;
            for ( var i = 0; i < args.length || arg < arguments.length; i++ ) {
                if ( args[i] === undefined ) {
                    args[i] = arguments[arg++];
                }
            }

            return $helper(fn).apply(that, args);
        };
    });

    //Side Effects
    $register('-let', function(name, value) {
        this[name] = value;
    });
    $register('-log', function() {
        console.log.call(this, Array.prototype.slice.call(arguments, 1, -1));
    });

};

//dashbars.js
var _helper = function(name){
    return _().isFunction(name)? name:
            this._helpable.helper(name) || function(){
                throw Error('not found the helper:' + name);
            };
};

var _emptyHelpable = {
    // jshint unused:false
    registerHelper: function(name, func){
        return this;
    },
    // jshint unused:false
    helper: function(name){
        return function(){};
    }
};

var _wrapHelpable = function(helpable){
    //handlebars
    return {
        registerHelper: function(name, func){
            helpable.registerHelper(name, func);

            return this;
        },
        helper: function(name){
            return helpable.helpers[name];
        }
    };
};

var _help = function(helpable){
    var that = this;
    this._helpable = _wrapHelpable(helpable);

    this._registerers.forEach(function(register){
        register(that._helpable.registerHelper, that.helper, that.predicate);
    });

    return this;
};

var _create = function(){
    return _cons(this._registerers);
};

// jshint latedef:false
var _cons = function (){
    var args = _().flatten(Array.prototype.slice.call(arguments), true);
    var dashbars = {
        _registerers: [],
        _helpable: _emptyHelpable
    };

    args.forEach(function(registerer){
        dashbars._registerers.push(registerer);
    });

    dashbars.help = _help.bind(dashbars);
    dashbars.helper = _helper.bind(dashbars);
    dashbars.create = _create.bind(dashbars);
    dashbars.cons = _cons.bind(dashbars);

    return dashbars;
};

//global.js
// jshint unused:false
var _ = function(){
    return (typeof window === 'undefined')? require('lodash'): window._;
};

//n.js
// jshint unused:false
var n = function n($register, $helper){

    //Predicate
    $register('n-even?', function(n) {
        return n%2 === 0;
    });
    $register('n-odd?', function(n) {
        return n%2 !== 0;
    });

    //Operation
    $register('n-add', function(left, right) {
        return left+right;
    });

    $register('n-subtract', function(left, right) {
        return left-right;
    });

    $register('n-multiply', function(left, right) {
        return left*right;
    });

    $register('n-divide', function(left, right) {
        return left/right;
    });
};

//p.js
var _is = function(o){
    return !!o;
};

// jshint unused:false
var p = function p($register, $helper){

    $register('-is?', _is);
    $register('-and?', function() {
        return Array.prototype.slice.call(arguments, 0, -1)
            .every(_is);
    });
    $register('-or?', function() {
        return Array.prototype.slice.call(arguments, 0, -1)
            .some(_is);
    });
    $register('-not?', function(t) {
        return !t;
    });
    $register('-gt?', function(left, right) {
        return left > right;
    });
    $register('-lt?', function(left, right) {
        return left < right;
    });
    $register('-ge?', function(left, right) {
        return left >= right;
    });
    $register('-le?', function(left, right) {
        return left <= right;
    });
    $register('-ne?', function(left, right) {
        return left !== right;
    });
    $register('-equal?', function(left, right) {
        return left === right;
    });
    $register('-deep-equal?', function(left, right) {
        return _().isEqual(left,right);
    });
    $register('-in?', function(prop, o) {
        return prop in o;
    });
    $register('-has?', function(prop, o) {
        return Object.prototype.hasOwnProperty.call(o, prop);
    });
    $register('-empty?', function(o){
        return _().isEmpty(o);
    });
    $register('-not-empty?', function(o){
        return !_().isEmpty(o);
    });
    $register('-string?', function(o){
        return _().isString(o);
    });
    $register('-array?', function(o){
        return _().isArray(o);
    });
};

//s.js
// jshint unused:false
var s = function s($register, $helper){
    $register('s-size', function(s) {
        return s.length;
    });
    $register('s-trim', function(s) {
        return s.trim();
    });
    $register('s-take', function(n, s) {
        return s.slice(0, n);
    });
    $register('s-drop', function(n, s) {
        return s.slice(n);
    });
    $register('s-repeat', function(n, s) {
        return (new Array(n+1)).join(s);
    });
    $register('s-concat', function() {
        return Array.prototype.slice.call(arguments, 0, -1).join('');
    });
    $register('s-split', function(sep, s) {
        return s.split(sep);
    });
    $register('s-slice', function(s, from, to, options) {
        return s.slice(to && from, options && to);
    });
    $register('s-reverse', function(s) {
        return s.split('').reverse().join('');
    });
    $register('s-replace', function(old, nu, s, regOpts, options) {
        return s.replace(new RegExp(old, options && regOpts), nu);
    });
    $register('s-match', function(regex, s, regOpts, options) {
        return s.match(new RegExp(regex, options && regOpts)) || [];
    });
    $register('s-lowercase', function(s) {
        return s.toLowerCase();
    });
    $register('s-uppercase', function(s) {
        return s.toUpperCase();
    });

    //predicates
    $register('s-lowercase?', function(s) {
        return s.toLowerCase() === s;
    });
    $register('s-uppercase?', function(s) {
        return s.toUpperCase() === s;
    });
    $register('s-match?', function(regex, s, regOpts, options) {
        return (new RegExp(regex, options && regOpts)).test(s);
    });
    $register('s-contain?', function(needle, s, ignoreCase) {
        needle = (ignoreCase) ? needle.toLowerCase(): needle;
        s = (ignoreCase) ? s.toLowerCase(): s;

        return s.indexOf(needle) >= 0;
    });
    $register('s-start-with?', function(prefix, s, ignoreCase) {
        prefix = (ignoreCase) ? prefix.toLowerCase(): prefix;
        s = (ignoreCase) ? s.toLowerCase(): s;

        return s.indexOf(prefix) === 0;
    });
    $register('s-end-with?', function(suffix, s, ignoreCase) {
        suffix = (ignoreCase) ? suffix.toLowerCase(): suffix;
        s = (ignoreCase) ? s.toLowerCase(): s;

        return s.lastIndexOf(suffix) === s.length - suffix.length;
    });
};

    return _cons(dash, p, s, n, d);
});