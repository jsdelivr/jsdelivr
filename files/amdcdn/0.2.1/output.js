(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.define = factory());
}(this, function () { 'use strict';

  const SEMVER_RX = /^([\^\~])?(\d+)\.(\d+)\.(\d+)(-(\w+)(\.(\d+))?)?$/
  const BASE_SEMVER_RX = /^(\d+).(\d+).(\d+)/
  const MULTIPLIERS = [1000000, 1000, 10, 0, 1]

  const first = (xs) => xs[0]
  const last = (xs) => xs[xs.length - 1]
  const find = (f, xs) => first(xs.filter(f))
  const isNumber = (x) => !isNaN(x)
  const toInt = (x) => +x

  const toValidIntMatches = (x) =>
    x.match(SEMVER_RX)
     .slice(1)
     .map(toInt)
     .filter(isNumber)

  const filterVersion = (filters) => (x) =>
    toValidIntMatches(x)
      .reduce((acc, y, i) =>
        acc && (filters[i] !== undefined ? y >= filters[i] : true), true)

  const isPreRelease = (x) => /(alpha|beta)/.test(x)
  const allowsPreRelease = (x) => x && x.indexOf('-') >= 0
  const getBaseSemVer = (x) => x.match(BASE_SEMVER_RX)[0]

  function semVerToNum (x) {
    const matches = toValidIntMatches(x)
    const reducer = (acc, y, i) => acc + y * MULTIPLIERS[i]
    return matches.reduce(reducer, 0)
  }

  const sort = (xs) => xs.slice().sort(sortSemVer)

  function sortSemVer (a, b) {
    const [valueA, valueB] = [a, b].map(semVerToNum)
    const [baseA, baseB] = [a, b].map(getBaseSemVer)

    // check pre-release precedence when bases are equal
    if (baseA === baseB) {
      if (/beta/.test(a) && /alpha/.test(b)) {
        return 1
      }
      if ((/alpha/.test(a) && /beta/.test(b)) ||
          (isPreRelease(a) && !isPreRelease(b))) {
        return -1
      }
    }

    return valueA - valueB
  }

  function findLatest (xs) {
    const sorted = sort(xs)
    const latest = last(sorted)
    return allowsPreRelease(latest)
      ? find((x) => x === (latest.split('-')[0]), xs) || latest
      : latest
  }

  const findPattern  = (xs, pattern, filters) =>
    findLatest(xs.filter((x) => RegExp(pattern).test(x))
                 .filter(filterVersion(filters)))

  // (range: string, versions: list<string>, pre: boolean) -> string
  function resolve$1 (range, versions, pre) {
    if (range === 'latest') {
      return findLatest(versions)
    }

    const [root, prefix, major, minor, patch, partial, beta] = SEMVER_RX.exec(range)

    if (!prefix) {
      // match exact value
      return find((v) => v === root, versions)
    }

    const pattern = prefix === '^'
      ? `^(${major})\\.(\\d+)\\.(\\d+)`
      : `^(${major})\\.(${minor})\\.(\\d+)`

    const filters = [major, minor, patch, partial, beta]

    return pre
      ? findPattern(versions, pattern + '(-(\\w+)(\\.(\\d+))?)?$', filters)
      : findPattern(versions, pattern + '$', filters)
  }

  /*
  Copyright (c) 2016 Zebulon McCorkle

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  */

  const DEBUG = false;
  function debug(...args) {
      if (DEBUG) {
          debug(...args);
      }
  }

  const modules = new Map();
  const moduleListeners = new Map();
  const donotload = [];
  let lastDefined = null;

  /**
   * @returns {name, range} if local, {url, name, range} if on CDN
   */
  function resolve(module) {
      const split = module.split('@');
      const name = split[0];
      const range = split[1] || 'latest';
      if (localStorage.getItem(`amdcdn:${name}`) != null) {
          return Promise.resolve(JSON.parse(localStorage.getItem(`amdcdn:${name}`)));
      }
      return fetch(`http://api.jsdelivr.com/v1/jsdelivr/libraries?name=${name}`)
          .then(response => response.json())
          .catch(exception => [])
          .then(result => {
              if (result.length === 1) {
                  const library = result[0];
                  let version;
                  try {
                      version = resolve$1(range, library.versions);
                  } catch (exception) {
                      // If the library doesn't use semver
                      version = split[1] || library.versions[0];
                  }
                  const assets = library.assets.filter(x => x.version === version)[0];
                  return { name, range, url: `https://cdn.jsdelivr.net/${name}/${version}/${assets.mainfile}` };
              } else {
                  return { name, range };
              }
          }).then(resolved => {
              localStorage.setItem(`amdcdn:${name}`, JSON.stringify(resolved));
              return resolved;
          });
  }

  function listen(module) {
      if (modules.get(module) != null) {
          return Promise.resolve(modules.get(module));
      }
      if (moduleListeners.get(module) == null) {
          moduleListeners.set(module, []);
      }
      const listeners = moduleListeners.get(module);
      return new Promise(function (resolve, reject) {
          listeners.push(resolve);
      });
  }

  function define(a, b, c) {
      let id = '_module' + modules.size, dependencies = [], factory;
      if (b == null && c == null) {
          if (typeof a !== 'function' && typeof a !== 'object') {
              throw new TypeError('factory must be a function or object');
          } else {
              factory = a;
          }
      } else if (c == null) {
          if (typeof a === 'string') {
              id = a;
          } else if (a instanceof Array) {
              dependencies = a;
          } else {
              throw new TypeError('first argument must be a string or array');
          }
          if (typeof b !== 'function' && typeof b !== 'object') {
              throw new TypeError('factory must be a function or object');
          }
          factory = b;
      } else {
          if (typeof a !== 'string') {
              throw new TypeError('id must be a string');
          } else if (!(b instanceof Array)) {
              throw new TypeError('dependencies must be an array');
          } else if (typeof c !== 'function' && typeof c !== 'object') {
              throw new TypeError('factory must be a function or object');
          }
          id = a;
          dependencies = b;
          factory = c;
      }

      donotload.push(id);
      lastDefined = id;

      /*
      // TODO: CommonJS wrapping
      factory.toString()
          // Function from https://github.com/requirejs/requirejs/blob/9d95c7bf2b0e83e44cf7d0dbce1118f64ee4a302/require.js#L40
          .replace(commentRegex, (_, __, ___, singlePrefix) => singlePrefix || '')
          .replace(requireRegex, (_, dependency) => dependencies.push(dependency));
      */

      Promise.all(dependencies.map(dep => resolve(dep)
          .then(resolved => {
              debug('donotload', donotload, 'id', id);
              if (resolved.url && !donotload.includes(dep)) {
                  const element = document.createElement('script');
                  element.addEventListener('load', function () {
                      debug('lastDefined', lastDefined, 'id', dep);
                      modules.set(resolved.name, modules.get(lastDefined));
                      (moduleListeners.get(resolved.name) || (debug(dep), [])).forEach(x => x(modules.get(dep)));
                  });
                  element.src = resolved.url;
                  element.async = false; // TODO: figure out how to make this not async
                  donotload.push(dep);
                  document.body.appendChild(element);
              }
              return listen(resolved.name);
          })
      )).then(resolved => {
          debug('resolved', resolved, 'id', id);
          debug('dependencies', dependencies, 'id', id);
          debug('a', a, 'b', b, 'c', c, 'id', id);
          if (typeof factory === 'object') {
              modules.set(id, factory);
          } else {
              modules.set(id, factory(...resolved));
          }
          debug(`%cAMDCDN: Loaded ${id}`, 'color: lightgreen;')
          const listeners = moduleListeners.get(id);
          if (listeners instanceof Array) {
              listeners.forEach(x => x(modules.get(id)));
          }
      });
  }
  define.amd = {
      cdn: true,
      commonjs: false
  };

  return define;

}));