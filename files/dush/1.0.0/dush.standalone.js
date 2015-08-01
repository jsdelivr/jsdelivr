(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Dush = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * dush <https://github.com/tunnckoCore/dush>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var o = 'outerHTML'
var l = 'EventListener'
var p = 'prototype'
var op = Object[p]
var has = op.hasOwnProperty

module.exports = Dush

function Dush ($) {
  if (!(this instanceof Dush)) {
    return new Dush($)
  }
  $ = $ || this
  $._e = $._e || {}
  $._d = function (v) {
    v = op.toString.call(v)
    return /(?:HTML)?(?:.*)Element/gi.test(v)
  }
  $.on = function (n, f, e, i) {
    $._e[n] = $._e[n] || []
    $._e[n].push(f)

    if (e && $._d(e)) {
      f[o] = e[o]
      i = e['add' + l]
      i ? i(n, f, 0) : e.attachEvent('on' + n, f)
    }
    return $
  }
  $.off = function (n, f, e, i) {
    if (!has.call($._e, n)) {return $}
    $._e[n].splice($._e[n].indexOf(f), 1)

    if (e && $._d(e)) {
      i = e['remove' + l]
      i ? i(n, f, 0) : e.detachEvent('on' + n, f)
    }
    return $
  }
  $.once = function (n, f, e) {
    function h () {
      $.off(n, h, e)
      return f.apply(e, arguments)
    }
    return $.on(n, h, e)
  }
  $.emit = function (n, a, e, i, f, d) {
    if (!has.call($._e, n)) {return $}
    a = [].slice.call(arguments, 1)
    e = a[a.length - 1]
    d = $._d(e)
    e = d ? e : $
    a = d ? a.slice(0, -1) : a

    for (i = 0; i < $._e[n].length; i++) {
      f = $._e[n][i]
      if (d && f[o] !== e[o]) {
        continue
      }
      f.apply(e, a)
    }
    return $
  }
  $.mixin = function (r, s, c, k, j) {
    s = s || $
    c = r.constructor
    for (k in s) c[k] = s[k]
    c[p] = Object.create(s[p])
    for (j in r) c[p][j] = r[j]
    c.__super__ = p[p]
    return c
  }
}

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdmVyc2lvbnMvaW8uanMvdjIuNC4wL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIVxuICogZHVzaCA8aHR0cHM6Ly9naXRodWIuY29tL3R1bm5ja29Db3JlL2R1c2g+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1IENoYXJsaWtlIE1pa2UgUmVhZ2VudCA8QHR1bm5ja29Db3JlPiAoaHR0cDovL3d3dy50dW5uY2tvY29yZS50aylcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCdcblxudmFyIG8gPSAnb3V0ZXJIVE1MJ1xudmFyIGwgPSAnRXZlbnRMaXN0ZW5lcidcbnZhciBwID0gJ3Byb3RvdHlwZSdcbnZhciBvcCA9IE9iamVjdFtwXVxudmFyIGhhcyA9IG9wLmhhc093blByb3BlcnR5XG5cbm1vZHVsZS5leHBvcnRzID0gRHVzaFxuXG5mdW5jdGlvbiBEdXNoICgkKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBEdXNoKSkge1xuICAgIHJldHVybiBuZXcgRHVzaCgkKVxuICB9XG4gICQgPSAkIHx8IHRoaXNcbiAgJC5fZSA9ICQuX2UgfHwge31cbiAgJC5fZCA9IGZ1bmN0aW9uICh2KSB7XG4gICAgdiA9IG9wLnRvU3RyaW5nLmNhbGwodilcbiAgICByZXR1cm4gLyg/OkhUTUwpPyg/Oi4qKUVsZW1lbnQvZ2kudGVzdCh2KVxuICB9XG4gICQub24gPSBmdW5jdGlvbiAobiwgZiwgZSwgaSkge1xuICAgICQuX2Vbbl0gPSAkLl9lW25dIHx8IFtdXG4gICAgJC5fZVtuXS5wdXNoKGYpXG5cbiAgICBpZiAoZSAmJiAkLl9kKGUpKSB7XG4gICAgICBmW29dID0gZVtvXVxuICAgICAgaSA9IGVbJ2FkZCcgKyBsXVxuICAgICAgaSA/IGkobiwgZiwgMCkgOiBlLmF0dGFjaEV2ZW50KCdvbicgKyBuLCBmKVxuICAgIH1cbiAgICByZXR1cm4gJFxuICB9XG4gICQub2ZmID0gZnVuY3Rpb24gKG4sIGYsIGUsIGkpIHtcbiAgICBpZiAoIWhhcy5jYWxsKCQuX2UsIG4pKSB7cmV0dXJuICR9XG4gICAgJC5fZVtuXS5zcGxpY2UoJC5fZVtuXS5pbmRleE9mKGYpLCAxKVxuXG4gICAgaWYgKGUgJiYgJC5fZChlKSkge1xuICAgICAgaSA9IGVbJ3JlbW92ZScgKyBsXVxuICAgICAgaSA/IGkobiwgZiwgMCkgOiBlLmRldGFjaEV2ZW50KCdvbicgKyBuLCBmKVxuICAgIH1cbiAgICByZXR1cm4gJFxuICB9XG4gICQub25jZSA9IGZ1bmN0aW9uIChuLCBmLCBlKSB7XG4gICAgZnVuY3Rpb24gaCAoKSB7XG4gICAgICAkLm9mZihuLCBoLCBlKVxuICAgICAgcmV0dXJuIGYuYXBwbHkoZSwgYXJndW1lbnRzKVxuICAgIH1cbiAgICByZXR1cm4gJC5vbihuLCBoLCBlKVxuICB9XG4gICQuZW1pdCA9IGZ1bmN0aW9uIChuLCBhLCBlLCBpLCBmLCBkKSB7XG4gICAgaWYgKCFoYXMuY2FsbCgkLl9lLCBuKSkge3JldHVybiAkfVxuICAgIGEgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICBlID0gYVthLmxlbmd0aCAtIDFdXG4gICAgZCA9ICQuX2QoZSlcbiAgICBlID0gZCA/IGUgOiAkXG4gICAgYSA9IGQgPyBhLnNsaWNlKDAsIC0xKSA6IGFcblxuICAgIGZvciAoaSA9IDA7IGkgPCAkLl9lW25dLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmID0gJC5fZVtuXVtpXVxuICAgICAgaWYgKGQgJiYgZltvXSAhPT0gZVtvXSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgZi5hcHBseShlLCBhKVxuICAgIH1cbiAgICByZXR1cm4gJFxuICB9XG4gICQubWl4aW4gPSBmdW5jdGlvbiAociwgcywgYywgaywgaikge1xuICAgIHMgPSBzIHx8ICRcbiAgICBjID0gci5jb25zdHJ1Y3RvclxuICAgIGZvciAoayBpbiBzKSBjW2tdID0gc1trXVxuICAgIGNbcF0gPSBPYmplY3QuY3JlYXRlKHNbcF0pXG4gICAgZm9yIChqIGluIHIpIGNbcF1bal0gPSByW2pdXG4gICAgYy5fX3N1cGVyX18gPSBwW3BdXG4gICAgcmV0dXJuIGNcbiAgfVxufVxuIl19
