module.exports = lazyload;

var inViewport = require('in-viewport');
var lazyAttrs = ['data-src'];

global.lzld = lazyload();
global.inViewport = inViewport;

// Provide libs using getAttribute early to get the good src
// and not the fake data-src
replaceGetAttribute('Image');
replaceGetAttribute('IFrame');

function registerLazyAttr(attr) {
  if (indexOf.call(lazyAttrs, attr) === -1) {
    lazyAttrs.push(attr);
  }
}

function lazyload(opts) {
  opts = merge({
    'offset': 333,
    'src': 'data-src',
    'container': false
  }, opts || {});

  if (typeof opts.src === 'string') {
    registerLazyAttr(opts.src);
  }

  var elts = [];

  function show(elt) {
    var src = findRealSrc(elt);

    if (src) {
      elt.src = src;
    }

    elt.setAttribute('data-lzled', true);
    elts[indexOf.call(elts, elt)] = null;
  }

  function findRealSrc(elt) {
    if (typeof opts.src === 'function') {
      return opts.src(elt);
    }

    return elt.getAttribute(opts.src);
  }

  function register(elt) {
    // unsubscribe onload
    // needed by IE < 9, otherwise we get another onload when changing the src
    elt.onload = null;
    elt.removeAttribute('onload');

    // https://github.com/vvo/lazyload/issues/62
    elt.onerror = null;
    elt.removeAttribute('onerror');

    if (indexOf.call(elts, elt) === -1) {
      inViewport(elt, opts, show);
    }
  }

  return register;
}

function replaceGetAttribute(elementName) {
  var fullname = 'HTML' + elementName + 'Element';
  if (fullname in global === false) {
    return;
  }

  var original = global[fullname].prototype.getAttribute;
  global[fullname].prototype.getAttribute = function(name) {
    if (name === 'src') {
      var realSrc;
      for (var i = 0, max = lazyAttrs.length; i < max; i++) {
        realSrc = original.call(this, lazyAttrs[i]);
        if (realSrc) {
          break;
        }
      }

      return realSrc || original.call(this, name);
    }

    // our own lazyloader will go through theses lines
    // because we use getAttribute(opts.src)
    return original.call(this, name);
  };
}

function merge(defaults, opts) {
  for (var name in defaults) {
    if (opts[name] === undefined) {
      opts[name] = defaults[name];
    }
  }

  return opts;
}

// http://webreflection.blogspot.fr/2011/06/partial-polyfills.html
function indexOf(value) {
  for (var i = this.length; i-- && this[i] !== value;) {}
  return i;
}
