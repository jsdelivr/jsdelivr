/*!
 * kimbo v1.0.0 - 2013-02-19
 * http://kimbojs.com
 * Copyright (c) 2013 Denis Ciccale (@tdecs)
 * Released under the MIT license
 * https://github.com/dciccale/kimbo.js/blob/master/LICENSE.txt
 */
(function (window, undefined) {

/*\
 * $
 [ object ]
 * Global namespace for using Kimbo functions
\*/

var _push = Array.prototype.push,
  _slice = Array.prototype.slice,
  _filter = Array.prototype.filter,
  document = window.document,
  rootContext;

/*\
 * $(…)
 * Kimbo object collection.
 * All methods called from a Kimbo collection affects all elements in it.
\*/
function Kimbo(selector, context) {
  var elem, match;

  if (!Kimbo.isKimbo(this)) {
    return new Kimbo(selector, context);
  }

  // no selector, return empty Kimbo object
  if (!selector) {
    return this;
  }

  // asume a css selector, query the dom
  if (typeof selector === 'string') {

    match = r_id.exec(selector);

    // handle $('#id');
    if (match && match[1]) {
      elem = document.getElementById(match[1]);

      if (elem) {
        this[0] = elem;
        this.length = 1;
      }

      return this;
    }

    // if no context find it on document
    // or on the specified Kimbo context
    if (!context || context.kimbo) {
      return (context || rootContext).find(selector);

    // create new Kimbo object with the specified context
    } else if (context) {
      return Kimbo(context).find(selector);
    }

  // already a dom element
  } else if (selector.nodeType) {
    this[0] = selector;
    this.length = 1;
    return this;

  // is a function, call it when DOM is ready
  } else if (Kimbo.isFunction(selector)) {
    return rootContext.ready(selector);
  }

  // handle kimbo object, plain objects or other objects
  return Kimbo.makeArray(selector, this);
}

Kimbo.fn = Kimbo.prototype = {

  /*\
   * $(…).length
   [ property ]
   * The length of the current Kimbo collection.
   = (number) Integer representing the lenght of the current collection.
   > Usage
   * Having these paragraphs:
   | <p>one</p>
   | <p>two</p>
   | <p>three</p>
   * Grab them and check for the length property:
   | $('p').length; // 2
  \*/
  length: 0,

  /*\
   * $(…).ready
   [ method ]
   * Execute a callback after de DOM is completely loaded
   > Parameters
   - callback (function) A function to call after de DOM is ready
   = (object) The original element
   > Usage
   | $(document).ready(function () {
   |   console.log('the DOM is loaded!');
   | });
   * Or using the shortcut
   | $(function () {
   |   console.log('the DOM is loaded!);
   | });
  \*/
  ready: function (callback) {
    // first check if already loaded
    if (/t/.test(document.readyState)) {
      callback.call(document);

    // listen when it loads
    } else {
      document.addEventListener('DOMContentLoaded', callback, false);
    }

    return rootContext;
  },

  /*\
   * $(…).get
   [ method ]
   * Retrieve native DOM elements
   > Parameters
   - index (number) #optional A zero-based integer indicating which element to retrieve, supports going backwards with negative index.
   = (array|object) An array of the native DOM elements or the specified element by index matched by Kimbo.
   > Usage
   | <ul>
   |   <li id="foo"></li>
   |   <li id="bar"></li>
   | </ul>
   * Get standard array of elements
   | $('li').get(); // [<li id="foo">, <li id="bar">]
   * Get the first element
   | $('li').get(0); // <li id="foo">
   * Get the last element
   | $('li').get(-1); // <li id="bar">
  \*/
  get: function (index) {
    return (!arguments.length) ? _slice.call(this) : (index < 0 ? this[this.length + index] : Kimbo(this[index]));
  },

  // needed to have an array-like object
  splice: Array.prototype.splice
};

/*\
 * $.forEach
 [ method ]
 * Iterator function that can be used to seamlessly iterate over both objects and arrays.
 > Parameters
 - obj (object) Object or array to iterate
 - callback (function) Function that will be executed on each iteration
 = (object) The original array or object
 > Usage
 | // iterating array
 | $.forEach(['a', 'b', 'c'], function (index, value) {
 |   alert(index + ': ' + value);
 | });
 |
 | // iterating object
 | $.forEach({name: 'Denis', surname: 'Ciccale'}, function (key, value) {
 |   alert(key + ': ' + value);
 | });
\*/
Kimbo.forEach = function (obj, callback) {
  var i,
    l = obj.length,
    isObj = l === undefined || typeof obj === 'function';

  if (isObj) {
    for (i in obj) {
      if (obj.hasOwnProperty(i) && callback.call(obj[i], i, obj[i], obj) === false) {
        break;
      }
    }
  } else {
    for (i = 0; i < l; i++) {
      if (callback.call(obj[i], obj[i], i, obj) === false) {
        break;
      }
    }
  }

  // return original obj
  return obj;
};


/*\
 * $.extend
 [ method ]
 * Merge the contents of two or more objects together into the first object.
 > Parameters
 - target (object|boolean) Object that will receive the merged properties if objects are passed, or target will extend Kimbo object. If target is `true` the passed objects will be recursively merged.
 - objectN (object) #optional One or more objects with additional properties.
 = (object) The extended target or a new copy if target is an empty object.
 > Usage
 * When passing two or more objects, all properties will be merged into the target object.
 | var obj1 = { msg: 'hi', info: { from: 'Denis' }};
 | var obj2 = { msg: 'Hi!', info: { time: '22:00PM' }};
 |
 | // merge obj1 into obj2
 | $.extend(obj1, obj2);
 |
 | // now obj1 is equal to:
 | { msg: 'Hi!', info: { time: '22:00PM' }}
 * If an empty target object is passed, none of the other objects will be directly modified
 | // pass an empty target
 | var obj3 = $.extend({}, obj1, obj);
 * To do a recursive merge, pass true as first argument, then the objects to merge
 | $.extend(true, obj1, obj2);
 | // obj1 will be:
 | { msg: 'Hi!', info: { from: 'Denis', time: '22:00PM' }}
\*/
Kimbo.extend = Kimbo.fn.extend = function () {
  var objs = arguments,
    target = objs[0] || {},
    deep = (target === true),
    cut = 1;

  // check for deep copy
  if (deep) {
    target = objs[1] || {};
    cut = 2;

  // extend Kimbo itself if only one argument is passed
  } else if (objs.length === 1) {
    target = this;
    cut = 0;
  }

  // make an array from the arguments
  // removing unnecessary objects
  objs = _slice.call(objs, cut);

  // loop through the objects
  Kimbo.forEach(objs, function (source) {
    // populate target from source
    Kimbo.forEach(source, function (key, value) {
      var src;

      if (deep && (Kimbo.isObject(value) || Kimbo.isArray(value))) {
        src = target[key];
        target[key] = Kimbo.extend(deep, src, value);

      } else if (value !== undefined) {
        target[key] = value;
      }
    });
  });

  return target;
};


var r_id = /^#([\w\-]+)$/,
  r_class = /^\.([\w\-]+)$/,
  r_tag = /^[\w\-]+$/,
  r_name = /^\[name=["']?([\w\-]+)["']?\]$/;


// use querySelectoAll but optimize for id, class, tagName and name
// much, much faster than only using querySelectorAll
function _query(element, selector) {
  var els = [], sel;

  // #id
  if (element === document && (sel = r_id.exec(selector))) {
    els = element.getElementById(sel[1]);

  // .class
  } else if ((sel = r_class.exec(selector))) {
    els = element.getElementsByClassName(sel[1]);

  // tag
  } else if (r_tag.test(selector)) {
    els = element.getElementsByTagName(selector);

  // [name=val]
  } else if ((sel = r_name.exec(selector))) {
    els = element.getElementsByName(sel[1]);

  // any other css selector
  } else {
    els = element.querySelectorAll(selector);
  }

  // return NodeList/Node as an array
  return _slice.call(els);
}

// a better DOM Level 4 contains
// http://webdecs.wordpress.com/2012/08/05/mejorando-el-metodo-contains-dom4-javascript/
function _contains(el1, el2) {
  return (el1 === window && (el2 && (el2 === window || el2.nodeType))) || ((el1 && el1.nodeType) && (el2 && el2.nodeType)) ? (el1.contains ? el1.contains(el2) : true) : false;
}


// properties without 'px' at the end
var cssNumber = { fontWeight: true, lineHeight: true, opacity: true, zIndex: true },
  r_space = /\s+/;

// user native classList
function _hasClass(elem, name) {
  return (elem.nodeType === 1 && elem.classList.contains(name));
}

// wrap native to extend behavoiur
function _getComputedStyle(element, property) {
  // support both camelCase and dashed property names
  property = property.replace(/([A-Z])/g, '-$1').toLowerCase();
  return window.getComputedStyle(element, null).getPropertyValue(property);
}

var _data = (function() {
  var cache = {},
    data_id = 1;

  return {
    get: function(dom, name) {
      var dom_cache = cache[dom.__data],
        value;

      // look first in cached data
      if (dom_cache) {
        value = dom_cache[name];
      }

      // if none, try dataset
      if (!value) {
        value = dom.dataset[name];
        this.set(dom, name, value);
      }

      return value;
    },

    set: function (dom, name, value) {
      var dom_data = dom.__data,
        dom_cache;

      if (!dom_data) {
        dom_data = dom.__data = data_id++;
      }

      dom_cache = cache[dom_data];
      if (!dom_cache) {
        dom_cache = cache[dom_data] = {};
      }

      // set data
      dom_cache[name] = value;
    },

    remove: function (dom, name) {
      delete cache[dom.__data][name];
      if (Kimbo.isEmptyObject(cache[dom.__data])) {
        delete cache[dom.__data];
        delete dom.__data;
      }
    }
  };
}());

/*\
 * $(…).text
 [ method ]
 * Get the text of the first element in the set or set the text of all the matched elements.
 > Parameters
 - value (string) #optional A string of text to set as the text content of all matched elements.
 = (string) string value of the text content of the element if no parameter passed.
 = (object) current Kimbo object.
 > Usage
 * Get the text content of an element
 | <p>Demo text</p>
 * without passing any parameter to the function:
 | $('p').text(); // 'Demo text'
 * To replace the text of the paragraph pass a string parameter to the function:
 | $('p').text('Another text');
 * Now the text content was replaced:
 | <p>Another text</p>
 \*/

/*\
 * $(…).html
 [ method ]
 * Get the HTML content of the first element in the set or set the HTML content of all the matched elements.
 > Parameters
 - value (string) #optional A string of HTML to set as the HTML content of all matched elements.
 = (string) a string value of the HTML content of the element if no parameter passed.
 = (object) current Kimbo object.
 > Usage
 * Get the HTML content of an element
 | <p><span>Demo text<span></p>
 * without passing any parameter to the function:
 | $('p').html(); // '<span>Demo tetxt</span>'
 * To replace the HTML content of the paragraph pass a string parameter to the function:
 | $('p').html('<strong>Another content</strong>');
 * Now the text content was replaced:
 | <p><strong>Another content</strong></p>
 \*/

/*\
 * $(…).val
 [ method ]
 * Get the current value of the first element in the set or set the value of all the matched elements.
 > Parameters
 - value (string) #optional A string of text to set as the value of all matched elements.
 = (string) the current value of the first element if no parameter passed
 = (object) current Kimbo object
 > Usage
 * Get the value of a form element:
 | <input type="text" name="color" value="red" />
 * without passing any parameter to the function:
 | $('input').val(); // 'red'
 * To change the value of the input pass a string parameter to the function:
 | $('input').val('blue');
 * Now the value was changed:
 | $('input').val(); // 'blue'
 \*/
Kimbo.forEach({
  text: 'textContent',
  html: 'innerHTML',
  val: 'value'
}, function (method, prop) {
  Kimbo.fn[ method ] = function (value) {

    // no element
    if (!this[0]) {
      return undefined;
    }

    // get
    if (value === undefined) {
      return this[0][prop];

      // set
    } else {
      return this.each(function () {
        this[prop] = value;
      });
    }
  };
});

/*\
 * $(…).addClass
 [ method ]
 * Adds a class to all matched elements.
 > Parameters
 - name (string) Name of the class to add.
 = (object) Original matched collection.
 > Usage
 | <p>I want to be green</p>
 | <script>
 | $('p').addClass('green');
 | </script>
 * Now it's green
 | <p class="green">I want to be green</p>
 * You can add multiple classes separated by a space
 | <p>Add classes to me</p>
 | <script>
 | $('p').addClass('green big width100');
 | </script>
 * All classes added and they won't be repetead if you try to add an existing one
 | <p class="green big width100">Add classes to me</p>
 \*/

/*\
 * $(…).removeClass
 [ method ]
 * Removes a class to all matched elements.
 > Parameters
 - name (string) Name of the class to remove.
 = (object) Original matched collection.
 > Usage
 | <p class="big green title float-rigth">Lorem ipsum</p>
 * Remove a specific class from the paragraph:
 | $('p').removeClass('green');
 * The specified class was removed:
 | <p class="big title float-right">Lorem ipsum</p>
 * You can remove multiple classes separating them by a space when calling the function:
 | $('p').removeClass('big title');
 * Now only one class left:
 | <p class="float-right">Lorem ipsum</p>
 * You can remove all classes just calling .removeClass() without parameters
 | $('p').removeClass();
 * All classes were removed including the class attribute:
 | <p>Lorem ipsum</p>
 \*/

// generate addClass and removeClass methods
// use native classList
// mdn: https://developer.mozilla.org/en-US/docs/DOM/element.classList
// spec: http://www.whatwg.org/specs/web-apps/current-work/multipage/elements.html#dom-classlist
Kimbo.forEach(['add', 'remove'], function (method, i) {
  var isRemove = i > 0;

  Kimbo.fn[method + 'Class'] = function (name) {
    var classNames;

    if (name && Kimbo.isString(name)) {
      classNames = name.split(r_space);
      this.each(function (elem) {
        // skip comments, text, etc
        if (elem.nodeType === 1) {
          // iterate through all class names passed
          Kimbo.forEach(classNames, function (className) {
            elem.classList[method](className);
          });
        }
      });

      // remove all element classes if no classname specified
    } else if (!name && isRemove) {
      this.removeAttr('class');
    }

    return this;
  };
});

/*\
 * $(…).append
 [ method ]
 * Insert content to the end of all elements matched by Kimbo.
 > Parameters
 - value (string|object) HTML string, DOM element, or Kimbo object to insert.
 = (object) Original matched collection.
 > Usage
 | <div class="container">
 |   <p class="lorem">Lorem </p>
 |   <p class="lorem">Lorem </p>
 | </div>
 * Insert content
 | $('.lorem').append('<em>ipsum</em>')
 * Each element gets the content
 | <div class="container">
 |   <p class="lorem">Lorem <em>ipsum</em></p>
 |   <p class="lorem">Lorem <em>ipsum</em></p>
 | </div>
 * You can also get an element and insert it elsewhere
 | $('.container').append($('.ipsum'))
 * The selected element will be moved, not cloned.
 | <div class="container">
 |   <p class="lorem">Lorem</p>
 |   <p class="lorem">Lorem</p>
 |   <p class="ipsum">Ipsum</p>
 | </div>
 \*/

/*\
 * $(…).prepend
 [ method ]
 * Insert content to the beginning of all elements matched by Kimbo.
 > Parameters
 - value (string|object) HTML string, DOM element, or Kimbo object to insert.
 = (object) Original matched collection.
 > Usage
 | <div class="container">
 |   <p class="lorem"> Lorem</p>
 |   <p class="lorem"> Lorem</p>
 | </div>
 * Insert content
 | $('.lorem').prepend('<em>ipsum</em>')
 * Each element gets the content
 | <div class="container">
 |   <p class="lorem"><em>ipsum</em> Lorem</p>
 |   <p class="lorem"><em>ipsum</em> Lorem</p>
 | </div>
 * You can also get an element and insert it elsewhere
 | $('.container').prepend($('.ipsum'))
 * The selected element will be moved, not cloned.
 | <div class="container">
 |   <p class="ipsum">Ipsum</p>
 |   <p class="lorem">Lorem</p>
 |   <p class="lorem">Lorem</p>
 | </div>
 \*/

// generate append and prepend methods
Kimbo.forEach(['append', 'prepend'], function (method, i) {
  var isPrepend = i > 0;

  Kimbo.fn[method] = function (value) {
    var div;

    // exit if no value passed
    if (!this.length || !value) {
      return this;
    }

    // handle html string
    if (Kimbo.isString(value)) {
      // placeholder element
      div = document.createElement('div');
      div.innerHTML = value;
      value = div.firstChild;
    }

    // already a dom node or kimbo collection, just insert it
    if (value.nodeType || Kimbo.isKimbo(value)) {
      return this.each(function (elem) {
        // be sure we can append/prepend to the element
        if (this.nodeType === 1 || this.nodeType === 11) {
          Kimbo(value).each(function () {
            elem.insertBefore(this, isPrepend ? elem.firstChild : null);
          });
        }
      });
    }
  };
});

Kimbo.fn.extend({

  /*\
   * $(…).empty
   [ method ]
   * Remove all child nodes from the DOM of the elements in the collection.
   = (object) Original matched collection.
   > Usage
   | <div class="container">
   |   <p class="lorem">Lorem</p>
   |   <p class="lorem">Lorem</p>
   | </div>
   * Empty .container
   | $('.container').empty();
   * All elements inside ".container" are removed from the DOM
   | <div class="container"></div>
  \*/
  empty: function () {
    return this.each(function () {
      while (this.hasChildNodes()) {
        this.removeChild(this.childNodes[0]);
      }
    });
  },

  /*\
   * $(…).remove
   [ method ]
   * Remove all matched elements from the DOM.
   * Similar to @$(…).empty but .remove() removes the element itself
   = (object) Original matched collection.
   > Usage
   | <div class="container">
   |   <p class="lorem">Lorem</p>
   |   <p>Lorem</p>
   | </div>
   * Remove one element
   | $('.lorem').remove();
   * The result element is:
   | <div class="container">
   |   <p>Lorem</p>
   | </div>
  \*/
  remove: function () {
    return this.each(function () {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    });
  },

  /*\
   * $(…).show
   [ method ]
   * Display all matched elements.
   = (object) Original matched collection.
   > Usage
   | <p style="display: none;">Lorem</p>
   * Show it
   | $('p').show();
   * Now it's visible
   | <p style="display: block;">Lorem</p>
  \*/
  show: function () {
    return this.css('display', 'block');
  },

  /*\
   * $(…).hide
   [ method ]
   * Hide all matched elements.
   = (object) Original matched collection.
   > Usage
   | <p>Lorem</p>
   * Hide it
   | $('p').hide();
   * Now it's hidden
   | <p style="display: none;">Lorem</p>
  \*/
  hide: function () {
    return this.css('display', 'none');
  },

  // TODO: extend to accept objects and functions to set values
  /*\
   * $(…).attr
   [ method ]
   * Get an attribute value from one element or set attributes to all matched elements.
   > Parameters
   - name (string) Name of the attribute.
   - value (string) #optional Value for the attribute.
   = (string) Attribute value, only if name was passed.
   = (object) Original matched collection when setting a value.
   > Usage
   | <a href="http://kimbojs.com">Go to Kimbojs.com</a>
   * Get href attribute
   | $('a').attr('href'); // http://kimbojs.com
   * Set a new attribute
   | $('a').attr('title', 'Go to Kimbojs.com');
   * Now element has a title attribute
   | <a href="http://kimbojs.com" title="Go to Kimbojs.com">Go to Kimbojs.com</a>
  \*/
  attr: function (name, value) {
    // no elements in the collection
    if (!this.length) {
      return this;
    }

    if (Kimbo.isString(name) && value === undefined) {
      return this[0].getAttribute(name);
    } else {
      return this.each(function () {
        this.setAttribute(name, value);
      });
    }
  },

  /*\
   * $(…).removeAttr
   [ method ]
   * Removes an attribute from all matched elements.
   > Parameters
   - name (string) Name of the attribute to remove.
   = (object) Original matched collection.
   > Usage
   | <a href="http://kimbojs.com" title="Go to Kimbojs.com">Go to Kimbojs.com</a>
   * Remove the title attribute
   | $('a').removeAttr('title');
   * Now the element has no title
   | <a href="http://kimbojs.com">Go to Kimbojs.com</a>
  \*/
  removeAttr: function (name) {
    return this.each(function () {
      this.removeAttribute(name);
    });
  },

  /*\
   * $(…).data
   [ method ]
   * Store or retrieve elements dataset.
   > Parameters
   - name (string) Name of the data attribute to to set.
   - value (string) #optional Value to store in dataset.
   = (object) Original matched collection.
   > Usage
   | <div id="panel"></div>
   * Set some data to the panel:
   | $('#panel').data('isOpen', true);
   * No a data-* attribute was added
   | <div id="panel" data-isOpen="true"></div>
   * We can retrieve the data
   | $('#panel').data('isOpen'); // 'true'
  \*/
  data: function (name, value) {
    if (!this.length || !Kimbo.isString(name)) {
      return this;
    }

    name = Kimbo.camelCase(name);

    if (value === undefined) {
      return _data.get(this[0], name);
    } else {
      return this.each(function () {
        _data.set(this, name, value);
      });
    }
  },

  /*\
   * $(…).removeData
   [ method ]
   * Remove data from the element dataset.
   > Parameters
   - name (string) Name of the data attribute to to remove.
   = (object) Original matched collection.
   > Usage
   | <div id="panel" data-isOpen="true"></div>
   * Remove data associated to the panel div:
   | $('#panel').removeData('isOpen');
   * Data attribute and value was removed:
   | <div id="panel"></div>
   * data-isOpen is undefined
   | $('#panel').data('isOpen'); // undefined
  \*/
  removeData: function (name) {
    if (!this.length || !Kimbo.isString(name)) {
      return this;
    }

    name = Kimbo.camelCase(name);

    return this.each(function () {
      _data.remove(this, name);
    });
  },

  /*\
   * $(…).css
   [ method ]
   * Get the css value of a property from one element or set a css property to all matched elements.
   > Parameters
   - property (string|object) Name of the css property.
   - value (string|number) #optional Value for the property.
   = (object) Original matched collection.
   > Usage
   | <p>Hello dude!</p>
   * Modify some styles
   | $('p').css('color', 'red'); // now the text is red
   * The HTML will look like this:
   | <p style="color: red;">Hello dude!</p>
   * You can also pass an object for setting multiple properties at the same time
   | $('p').css({
   |   color: 'red',
   |   'font-size': '30px',
   |   backgroundColor: 'blue'
   | });
   * Properties can be dash-separated (add quotes) or camelCase.
   | <p style="color: red; font-size: 30px; background-color: blue">Hello dude!</p>
  \*/
  css: function (property, value) {
    var properties,
        that = this;

    if (Kimbo.isString(property)) {
      // no value to set, return current
      if (value === undefined) {
        return this.length > 0 ? _getComputedStyle(this[0], property) : undefined;
      } else {
        // set props to aux object
        properties = {};
        properties[property] = value;
      }
    }

    // set properties
    if (properties || Kimbo.isObject(property)) {
      properties = properties || property;
      Kimbo.forEach(properties, function (name, value) {
        // if it's a number add 'px' except for some properties
        if (Kimbo.isNumeric(value) && !cssNumber[Kimbo.camelCase(property)]) {
          value += 'px';
        }

        that.each(function () {
          this.style[name] = value;
        });
      });
    }

    // return collection
    return this;
  },

  /*\
   * $(…).toggleClass
   [ method ]
   * Removes a class to all matched elements.
   > Parameters
   - name (string) Name of the class to toggle.
   - state (boolean) #optional If state is true the class will be added, if false, removed.
   = (object) Original matched collection.
   > Usage
   | <p class="foo">Lorem ipsum.</p>
   | <script>
   | $('p').toggleClass('foo');
   | </script>
   * The `p` element has the class foo soo it will be removed
   | <p>Lorem ipsum.</p>
  \*/
  toggleClass: function (name, state) {
    var classNames;

    if (this.length && name && Kimbo.isString(name)) {
      classNames = name.split(r_space);
      this.each(function (elem) {
        Kimbo.forEach(classNames, function (name) {
          // use custom toggle (anyway it uses classList.add/remove)
          state = Kimbo.isBoolean(state) ? state : !_hasClass(elem, name);
          Kimbo(elem)[state ? 'addClass' : 'removeClass'](name);
        });
      });
    }

    return this;
  },

  /*\
   * $(…).hasClass
   [ method ]
   * Determine whether any matched elements has the given class.
   > Parameters
   - name (string) Name of the class to search for.
   = (object) Original matched collection.
   > Usage
   | <p class="asd foo qwe">Lorem ipsum.</p>
   * Check if the element has the class 'foo'
   | $('p').hasClass('foo'); // true
   * You could also check if it has multiple classes
   | $('p').hasClass('qwe asd'); // true
  \*/
  hasClass: function (name) {
    var has = false,
    classNames;

    if (this.length && name && Kimbo.isString(name)) {
      classNames = name.trim().split(r_space);
      this.each(function (elem) {
        // classList.contains only accepts one class parameter
        Kimbo.forEach(classNames, function (name) {
          has = _hasClass(elem, name);
          // if one doesn't exists break the loop and return false
          if (!has) {
            return false;
          }
        });
      });
    }

    return has;
  },

  clone: function () {
    var res = [];
    this.each(function () {
      res.push(this.cloneNode(true));
    });
    return Kimbo(res);
  }
});

// generate get/set .width() and .height() methods
/*\
 * $(…).width
 [ method ]
 * Get the current width of the first element or set the width of all matched elements.
 > Parameters
 - value (number|string) #optional An integer indicating the width of the element or a string width a unit of measure.
 = (number) the actual width of the element if no parameter passed.
 = (object) Kimbo object.
 > Usage
 | <style>
 |   div { width: 100px; }
 | </style>
 | <div>Actual width is 100px</div>
 * Get the width:
 | $('div').width(); // 100
 * Change the width:
 | $('div').width(200); // now its width is 200
 * Or passing a specific unit:
 | $('div').width('50%'); // now its width is 50%
\*/

/*\
 * $(…).height
 [ method ]
 * Get the current height of the first element or set the height of all matched elements.
 > Parameters
 - value (number|string) #optional An integer indicating the height of the element or a string height a unit of measure.
 = (number) the actual height of the element if no parameter passed.
 = (object) Kimbo object.
 > Usage
 | <style>
 |   div { height: 100px; }
 | </style>
 | <div>Actual height is 100px</div>
 * Get the height:
 | $('div').height(); // 100
 * Change the height:
 | $('div').height(200); // now its height is 200
 * Or passing a specific unit:
 | $('div').height('50%'); // now its height is 50%
\*/
Kimbo.forEach(['width', 'height'], function (dimension) {
  Kimbo.fn[dimension] = function (value) {
    if (!value) {
      return parseInt(this.css(dimension), 10);
    }
    return this.css(dimension, value);
  };
});



var isUnique = {
  children: true,
  contents: true,
  next: true,
  prev: true
};

// wrap native to use correct method and extend behaviour
var _matchesSelector = (function () {
  var elem = document.createElement('div'),
    matchesSelector = elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.oMatchesSelector || elem.matchesSelector;

  return function (elem, selector) {
    if (!elem || elem.nodeType !== 1 || !Kimbo.isString(selector)) {
      return false;
    }
    return matchesSelector.call(elem, selector);
  };
}());

function _unique(array) {
  return array.filter(function (item, index) {
    return array.indexOf(item) === index;
  });
}

function _sibling(node, elem) {
  var result = [];
  for (; node; node = node.nextSibling) {
    if (node.nodeType === 1 && node !== elem ) {
      result.push(node);
    }
  }
  return result;
}

function _singleSibling(node, prop) {
  do {
    node = node[prop];
  } while (node && node.nodeType !== 1);

  return node;
}

Kimbo.fn.extend({

  /*\
   * $(…).filter
   [ method ]
   * Filter element collection by the passed argument.
   > Parameters
   - selector (string|object|function) The argument by which the collection will be filtered.
   = (object) Filtered elements collection.
   > Usage
   | <ul>
   |   <li>One</li>
   |   <li>Two</li>
   |   <li>Three</li>
   |   <li>Four</li>
   | </ul>
   * Get even items.
   | $('li').filter(':nth-child(even)').addClass('even');
   * Only even items were affected.
   | <ul>
   |   <li>One</li>
   |   <li class="even">Two</li>
   |   <li>Three</li>
   |   <li class="even">Four</li>
   | </ul>
   > Using a function(index, element)
   * You can also filter the collection using a function, receiving the current index and element in the collection.
   | $('li').filter(function (index, element) {
   |   return index % 3 == 2;
   | }).addClass('red');
   * This will add a 'red' class to the third, sixth, ninth elements and so on...
   > Filter by DOM or Kimbo object
   * You can also filter by a DOM or Kimbo object.
   | $('li').filter(document.getElementById('id'));
   | // or a Kimbo object
   | $('li').filter($('#id'));
  \*/
  filter: function (selector) {
    var result, ret;

    // filter collection
    result = _filter.call(this, function (elem, i) {
      if (Kimbo.isFunction(selector)) {
        ret = !!selector.call(elem, i, elem);
      } else if (Kimbo.isString(selector)) {
        ret = _matchesSelector(elem, selector);
      } else if (selector.nodeType) {
        ret = elem === selector;
      } else if (Kimbo.isKimbo(selector)) {
        ret = elem === selector[0];
      }
      return ret;
    });

    return Kimbo(result);
  },

  /*\
   * $(…).eq
   [ method ]
   * Reduce the matched elements collection to the one at the specified index.
   > Parameters
   - index (number) An integer indicating the position of the element. Use a negative number to go backwards in the collection.
   = (object) Kimbo object at specified index.
   > Usage
   | <ul>
   |   <li>Item 1</li>
   |   <li>Item 2</li>
   |   <li>Item 3</li>
   |   <li>Item 4</li>
   | </ul>
   * Get 3rd element, index always start at 0, so to get the 3rd we need to pass the number 2.
   | $('li').eq(2); // Item 3
  \*/
  eq: function (i) {
    return i === -1 ? this.slice(i) : this.slice(i, i + 1);
  },

  /*\
   * $(…).first
   [ method ]
   * Reduce the matched elements collection to the first in the set.
   = (object) First Kimbo object of the collection
   > Usage
   | <ul>
   |   <li>Item 1</li>
   |   <li>Item 2</li>
   |   <li>Item 3</li>
   | </ul>
   * Get only the first element
   | $('li').first(); // Item 1
  \*/
  first: function () {
    return this.eq(0);
  },

  /*\
   * $(…).last
   [ method ]
   * Reduce the matched elements collection to the last in the set.
   = (object) Last Kimbo object of the collection
   > Usage
   | <ul>
   |   <li>Item 1</li>
   |   <li>Item 2</li>
   |   <li>Item 3</li>
   | </ul>
   * Get only the last element
   | $('li').last(); // Item 3
  \*/
  last: function () {
    return this.eq(-1);
  },

  /*\
   * $(…).slice
   [ method ]
   * Reduce the matched elements collection to a subset specified by a range of indices
   > Parameters
   - start (number) An integer indicating the position at which the elements begin to be selected. Use a negative number to go backwards in the collection.
   - end (number) #optional An integer indicating the position at which the elements stop being selected. Use a negative number to start at the end of the collection. If ommited, the range continues to the end.
   = (object) Reduced Kimbo object collection in the range specified
   > Usage
   | <ul>
   |   <li>Item 1</li>
   |   <li>Item 2</li>
   |   <li>Item 3</li>
   |   <li>Item 4</li>
   |   <li>Item 5</li>
   | </ul>
   * This will add the class selected to Item 3, 4 and 5, as the index starts at 0
   | $('li').slice(2).addClass('selected');
   * This will select only Items 3 and 4
   | $('li').slice(2, 4).addClass('selected');
   > Negative index
   * Here only Item 4 will be selected since is the only between -2 (Item 3) and -1 (Item 5)
   | $('li').slice(-2, -1).addClass('selected');
  \*/
  slice: function () {
    return Kimbo(_slice.apply(this, arguments));
  },

  /*\
   * $(…).each
   [ method ]
   * Iterate over a Kimbo objct, executing a function for each element.
   > Parameters
   - callback (function) A function to call for each element in the collection.
   = (object) Kimbo object
   > Usage
   * Here we have an unordered list:
   | <ul>
   |   <li>Item 1</li>
   |   <li>Item 2</li>
   |   <li>Item 3</li>
   | </ul>
   * You can iterate over all the list items and execute a function
   | $('li').each(function (el, index, collection) {
   |   console.log('index of ' + $(this).text() + ' is: ' + index);
   | });
   * This will log the following message
   *
   * index of Item 1 is: 0
   *
   * index of Item 2 is: 1
   *
   * index of Item 3 is: 2
  \*/
  each: function (callback) {
    return Kimbo.forEach(this, callback);
  },

  /*\
   * $(…).map
   [ method ]
   * Execute a function for each element in the collection, producing a new Kimbo set with the returned values
   > Parameters
   - callback (function) A function to call for each element in the collection.
   = (object) Kimbo object
   > Usage
   * Here we have an unordered list:
   | <ul>
   |   <li id="item1">Item 1</li>
   |   <li id="item2">Item 2</li>
   |   <li id="item3">Item 3</li>
   | </ul>
   * You can call a function for each element to create a new Kimbo object
   | $('li').map(function (el, index) {
   |   return this.id;
   | }).get().join();
   * This will produce a list of the item ids.
   | "item1,item2,item3"
  \*/
  map: function (callback) {
    return Kimbo(Kimbo.map(this, function (elem, i) {
      return callback.call(elem, elem, i);
    }));
  },

  /*\
   * $(…).find
   [ method ]
   * Find descendant elements for each element in the current collection.
   > Parameters
   - selector (string) A string selector to match elements.
   = (object) Kimbo object
   > Usage
   * Here we have some HTML
   | <div id="container">
   |   <p>Demo</p>
   |   <div class="article">
   |     <p>This is an article</p>
   |     <p>with some paragraphs</p>
   |   </div>
   | </div>
   * You can find all paragraph elements inside the article:
   | $('.article').find('p');
  \*/
  find: function (selector) {
    var i, l, length, n, r, result, elems;

    // make new empty kimbo collection
    result = Kimbo();

    // could use Kimbo.forEach, but this is a bit faster..
    for (i = 0, l = this.length; i < l; i++) {
      length = result.length;
      // get elements
      elems = _query(this[i], selector);
      // push them to current kimbo collection
      _push.apply(result, elems);

      if (i > 0) {
        // make results unique
        for (n = length; n < result.length; n++) {
          for (r = 0; r < length; r++) {
            if (result[r] === result[n]) {
              result.splice(n--, 1);
              break;
            }
          }
        }
      }
    }

    return result;
  },

  /*\
   * $(…).closest
   [ method ]
   * Get a Kimbo collection that matches the closest selector
   > Parameters
   - selector (string) A string selector to match elements.
   - context (string) #optional A DOM element within which matching elements may be found.
   = (object) Kimbo object
   > Usage
   * Here we have a nested unordered lists:
   | <ul>
   |   <li>
   |     Item 1
   |     <ul class="ul-level-2">
   |       <li class="item-1-1">Item 1.1</li>
   |       <li class="item-1-2">Item 1.2</li>
   |     </ul>
   |   </li>
   |   <li>Item 2</li>
   | </ul>
   * You can find the containing ul of the items in the nested ul:
   | $('.item-1-1').closest('ul');
   * This will return `ul.level-2` element
  \*/
  closest: function (selector, context) {
    var result = [];

    // a normal for loop would be faster
    Kimbo.forEach(this, function (node) {

      // check selector match and grab the element
      while (node && !_matchesSelector(node, selector)) {
        node = (node !== context && node !== document && node.parentNode);
      }

      if (node) {
        result.push(node);
      }
    });

    // only unique results
    result = result.length > 1 ? _unique(result) : result;

    return Kimbo(result);
  },

  /*\
   * $(…).contains
   [ method ]
   * Determine whether an element is contained by the current matched element.
   > Parameters
   - element (string|object) Selector of the element or the actual DOM or Kimbo object.
   = (boolean) true if it is contained, false if not.
   > Usage
   | <div id="container">
   |   <p id="inside">Inside paragraph</p>
   | </div>
   | <p id="outside">Outside paragraph</p>
   * The paragraph with id "inside" is actually contained by "#container"
   | $('#container').contains('#inside'); // true
   * The paragraph ourside is not contained
   | var outside_p = $('#outside');
   | $('#container').contains(outside_p); // false
  \*/
  contains: function (element) {
    element = Kimbo.isKimbo(element) ? element[0] : (Kimbo.isString(element) ? this.find(element)[0] : element);
    return _contains(this[0], element);
  },

  /*\
   * $(…).add
   [ method ]
   * Add elements to the current Kimbo collection.
   > Parameters
   - selector (string|object) Selector of the element or the actual DOM or Kimbo object.
   - context (string|object) #optional Selector of the context element or the actual DOM or Kimbo object.
   = (object) The merged Kimbo collection.
   > Usage
   | <ul id="menu1">
   |   <li>Apple</li>
   |   <li>Orange</li>
   | </ul>
   |
   | <ul id="menu2">
   |   <li>Lemon</li>
   |   <li>Banana</li>
   | </ul>
   * Get the items from the #menu1 and add the ones from #menu2, all the following ways will produce the same collection
   | $('#menu1 li').add('#menu2 li');
   * or
   | $('#menu1 li').add('li', '#menu2');
   * or
   | $('#menu1 li').add($('#menu2 li'));
  \*/
  add: function (selector, context) {
    var set = Kimbo.isString(selector) ? Kimbo(selector, context) : Kimbo.makeArray(selector && selector.nodeType ? [selector] : selector),
      all = Kimbo.merge(this, set);

    return Kimbo(all);
  },

  /*\
   * $(…).is
   [ method ]
   * Check the current elements collection against a selector, object or function.
   - selector (string|object|function) The argument by which the collection will be matched against.
   = (boolean)
   > Usage
   | <ul>
   |   <li>Click the <em>Apple</em></li>
   |   <li><span>Click the Orange</span></li>
   |   <li>Or the Banana</li>
   | </ul>
   * Test if the current clicked element is an `<li>` element.
   | $('ul').click(function (event) {
   |   var $target = $(event.target);
   |   if ($target.is('li')) {
   |     $target.css('background-color', 'red');
   |   }
   | });
  \*/
  is: function (selector) {
    return this.length > 0 && this.filter(selector).length > 0;
  }
});

Kimbo.forEach({

  /*\
   * $(…).parent
   [ method ]
   * Get the parent of each element matched in the current collection.
   * If a selector is specified, it will return the parent element only if it matches that selector.
   - selector (string) #optional A string containing a selector expression to match elements against
   = (object) Kimbo object
   > Usage
   * Suppose a page with this HTML:
   | <ul>
   |   <li class="item-a">Item 1</li>
   |   <li class="item-b">Item 2</li>
   | </ul>
   * Get the parent element of `.item-a`
   | $('.item-a').parent(); // ul
  \*/
  parent: function (elem) {
    var parent = elem.parentNode;
    return parent && parent.nodeType !== 11 ? parent : null;
  },

  /*\
   * $(…).next
   [ method ]
   * Get the immedeately following sibling of each element in the current collection.
   * If a selector is specified, it will return the element only if it matches that selector.
   - selector (string) #optional A string containing a selector expression to match elements against
   = (object) Kimbo object
   > Usage
   * Suppose a page with this HTML:
   | <ul>
   |   <li class="item-a">Item 1</li>
   |   <li class="item-b">Item 2</li>
   | </ul>
   * Get the parent element of `.item-a`
   | $('.item-a').next(); // .item-b
  \*/
  next: function (elem) {
    return _singleSibling(elem, 'nextSibling');
  },

  /*\
   * $(…).prev
   [ method ]
   * Get the immedeately previous sibling of each element in the current collection.
   * If a selector is specified, it will return the element only if it matches that selector.
   - selector (string) #optional A string containing a selector expression to match elements against
   = (object) Kimbo object
   > Usage
   * Suppose a page with this HTML:
   | <ul>
   |   <li class="item-a">Item 1</li>
   |   <li class="item-b">Item 2</li>
   | </ul>
   * Get the parent element of `.item-a`
   | $('.item-b').prev(); // .item-a
  \*/
  prev: function (elem) {
    return _singleSibling(elem, 'previousSibling');
  },

  /*\
   * $(…).sibling
   [ method ]
   * Get the immedeately previous sibling of each element in the current collection.
   * If a selector is specified, it will return the element only if it matches that selector.
   - selector (string) #optional A string containing a selector expression to match elements against
   = (object) Kimbo object
   > Usage
   * Suppose a page with this HTML:
   | <ul>
   |   <li class="item-a">Item 1</li>
   |   <li class="item-b">Item 2</li>
   | </ul>
   * Get the parent element of `.item-a`
   | $('.item-b').prev(); // .item-a
  \*/
  siblings: function (elem) {
    return _sibling((elem.parentNode || {}).firstChild, elem);
  },

  /*\
   * $(…).children
   [ method ]
   * Get the children of all matched elements, optionally filtered by a selector.
   - selector (string) #optional A string selector to match elements against.
   = (object) Kimbo object
   > Usage
   * Suppose a page with the following HTML:
   | <div class="demo">
   |   <p>This</p>
   |   <p>is</p>
   |   <p>a</p>
   |   <p>demo.</p>
   | </div>
   * Get all children of `.demo`:
   | $('.demo').children(); // al <p> tags inside .demo div
   * Another example passing an specific selector:
   | <form>
   |   <input type="text" name="name" />
   |   <input type="text" name="last" />
   |   <input type="submit" value="Send" />
   | </form>
   * Get only the children that are text type elements:
   | $('form').children('input[type="text"]'); // only name and last inputs
  \*/
  children: function (elem) {
    return _sibling(elem.firstChild);
  },

  /*\
   * $(…).contents
   [ method ]
   * Get the HTML content of an iframe
   = (object) Kimbo object
   > Usage
   * Suppose an iframe loading an external page:
   | <iframe src="http://api.kimbojs.com"></iframe>
   * Find the body element of the contents of that iframe:
   | $('iframe').contents().find('body');
  \*/
  contents: function (elem) {
    return elem.nodeName.toLowerCase() === 'iframe' ? elem.contentDocument || elem.contentWindow[document] : Kimbo.makeArray(elem.childNodes);
  }
}, function (name, fn) {
  Kimbo.fn[name] = function (selector) {
    var ret = Kimbo.map(this, fn);

    // clean collection
    ret = this.length > 1 && !isUnique[name] ? _unique(ret) : ret;

    if (Kimbo.isString(selector)) {
      ret = Kimbo(ret).filter(selector);
    }

    return Kimbo(ret);
  };
});


var objectTypes = {},
  mobile_os = {
    Android: /(Android)\s+([\d.]+)/,
    Blackberry: /(BlackBerry|BB10|Playbook).*Version\/([\d.]+)/,
    FirefoxOS: /(Mozilla).*Mobile[^\/]*\/([\d\.]*)/,
    ipad: /(iPad).*OS\s([\d_]+)/,
    iphone: /(iPhone\sOS)\s([\d_]+)/,
    webOS: /(web|hpw)OS[\s\/]([\d.]+)/
  },
  isMobile = null;

// map object types
Kimbo.forEach(['Array', 'Boolean', 'Date', 'Function', 'Number', 'Object', 'RegExp', 'String'], function (type) {
  objectTypes['[object ' + type + ']'] = type.toLowerCase();
});

Kimbo.extend({

  /*\
   * $.typeOf
   [ method ]
   * Determine the internal JavaScript [[Class]] of an object.
   > Parameters
   - obj (object) Object to get its [[Class]] type.
   = (string) Type of the object.
   > Usage
   | $.typeOf('i am a string'); // 'string'
   | $.typeOf(/(\.regexp?)/); // 'regexp'
   | $.typeOf(null); // 'null'
   | $.typeOf(undefined); // 'undefined'
   | $.typeOf(window.notDefined); // 'undefined'
   | $.typeOf(function () {}); // 'function'
   | $.typeOf({key: 'value'}); // 'object'
   | $.typeOf(true); // 'boolean'
   | $.typeOf([]); // 'array'
   | $.typeOf(new Date()); // 'date'
   | $.typeOf(3); // 'number'
  \*/
  typeOf: function (obj) {
    return obj === null || obj === undefined ? String(obj) : objectTypes[Object.prototype.toString.call(obj)] || 'object';
  },

  /*\
   * $.isArray
   [ method ]
   * Determine if the parameter passed is an array object.
   > Parameters
   - obj (object) Object to test if its an array.
   = (boolean) According wether or not it is an array object.
   > Usage
   | $.isArray([]); // true
   | $.isArray({}); // false
   | $.isArray('test'); // false
  \*/
  isArray: Array.isArray,

  /*\
   * $.isNumeric
   [ method ]
   * Determine if the parameter passed is an number.
   > Parameters
   - obj (object) Object to test if its a number.
   = (boolean) According wether or not it is a number.
   > Usage
   | $.isNumeric(3); // true
   | $.isNumeric('3'); // false
  \*/
  isNumeric: function (obj) {
    return !isNaN(parseFloat(obj)) && isFinite(obj);
  },

  /*\
   * $.isWindow
   [ method ]
   * Determine if the parameter passed is the window object.
   > Parameters
   - obj (object) Object to test if its the window object.
   = (boolean) According wether or not it is the window object.
   > Usage
   | $.isWindow(window); // true
   | $.isWindow({ window: window }); // false
  \*/
  isWindow: function (obj) {
    return obj && obj === obj.window;
  },

  /*\
   * $.isKimbo
   [ method ]
   * Determine if the parameter passed is a Kimbo object.
   > Parameters
   - obj (object) Object to test if its a Kimbo object.
   = (boolean) According wether or not it is a Kimbo object.
   > Usage
   | $.isKimbo(Kimbo('p')); // true
   | $.isKimbo(jQuery('p')); // false
  \*/
  isKimbo: function (obj) {
    return obj instanceof Kimbo;
  },

  /*\
   * $.isEmptyObject
   [ method ]
   * Determine if the parameter passed is an empty object.
   > Parameters
   - obj (object) Object to test if its an empty object.
   = (boolean) According wether or not it is an empty object.
   > Usage
   | $.isEmptyObject({}); // true
   | $.isEmptyObject([]); // true
   | $.isEmptyObject([1, 2]); // false
  \*/
  isEmptyObject: function (obj) {
    var key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  },

  /*\
   * $.isMobile
   [ method ]
   * Determine if the current platform is a mobile device, (otherwise is a desktop browser).
   > Parameters
   = (boolean) According wether or not is a mobile device.
   > Usage
   | $.isMobile(); // false
  \*/
  isMobile: function () {
    if (isMobile === null) {
      isMobile = false;
      Kimbo.forEach(mobile_os, function (name, regex) {
        if (regex.test(navigator.userAgent)) {
          // set to true and break the loop
          return !(isMobile = true);
        }
      });
    }
    return isMobile;
  },

  /*\
   * $.parseJSON
   [ method ]
   * Parses a well-formed JSON string and returns the resulting JavaScript object.
   > Parameters
   - data (string) The JSON string to parse.
   = (object) A JavaScript object.
   > Usage
   | var obj = $.parseJSON('{"name":"Denis"}');
   | console.log(obj.name === 'Denis'); // true
  \*/
  parseJSON: function (data) {
    // use native JSON parser
    if (data && Kimbo.isString(data)) {
      return window.JSON.parse(data);
    }
  },

  /*\
   * $.parseXML
   [ method ]
   * Parses a string into an XML document.
   > Parameters
   - data (string) The JSON string to parse.
   = (object) A JavaScript object.
   > Usage
   | var xml = "<rss version='2.0'><channel><title>RSS Title</title></channel></rss>"
   | var xmlDoc = $.parseXML(xml);
   | $(xmlDoc).find('title'); // 'RSS Title'
  \*/
  parseXML: function (data) {
    // use native XML (DOM) parser
    var domparser, xml;

    if (data && Kimbo.isString(data)) {
      domparser = new window.DOMParser();
      xml = domparser.parseFromString(data, 'text/xml');

      if (xml.getElementsByTagName('parsererror').length) {
        throw new Error('Invalid XML: ' + data);
      }

      return xml;
    }
  },

  /*\
   * $.map
   [ method ]
   * Translate all items in an array or object to new array of items.
   > Parameters
   - obj (array|object) The Array or Object to translate.
   = (array) A new array.
   > Usage
   | var arr = ['a', 'b', 'c'];
   | arr = $.map(arr, function (element, index) {
   |   return element.toUpperCase() + index;
   | });
   | console.log(arr); // ['A0', 'B1', 'C2']
   * Or wit an object
   | var obj = {a: 'a', b: 'b', c: 'c'};
   | obj = $.map(arr, function (key, value) {
   |   return key + ': ' + value.toUpperCase();
   | });
   | console.log(obj); // ['a: A', 'b: B', 'c: C']
  \*/
  map: function (obj, callback) {
    var values = [], value;

    if (obj) {
      Kimbo.forEach(obj, function (key, val) {
        value = callback(key, val);

        if (value !== null && value !== undefined) {
          values.push(value);
        }
      });
    }

    // flatten any nested arrays
    return values.concat.apply([], values);
  },

  /*\
   * $.makeArray
   [ method ]
   * Create an Array from the given object
   > Parameters
   - obj (array|object) The Array or Object to make an array from.
   = (array) A new array.
   > Usage
   | var lis = $('li'); // Kimbo object
   | var arr = $.makeArray(lis);
   |
   | console.log($.isArray(lis)); // false
   | console.log($.isArray(arr)); // true
  \*/
  makeArray: function (obj, results) {
    results = results || [];

    if (obj) {
      if (Kimbo.isArray(obj) || Kimbo.isKimbo(obj) || obj instanceof NodeList) {
        results = Kimbo.merge(results, obj);
      } else {
        _push.call(results, obj);
      }
    }

    return results;
  },

  /*\
   * $.makeArray
   [ method ]
   * Merge the contents of two arrays into the first array passed.
   > Parameters
   - first (array) The first array to merge the contents of the second.
   - second (array|string) The second array to merge into the first.
   = (array) The first array merged with the second.
   > Usage
   | $.merge(['a', 'b'], ['c', 'd']);
   * Result:
   | ['a', 'b', 'c', 'd']
  \*/
  merge: function (first, second) {

    // concat is very fast, use it if we can
    if (Kimbo.isArray(first)) {
      first = first.concat(second);

    // Kimbo object, just loop merge
    } else {
      _push.apply(first, second);
    }

    return first;
  },

  /*\
   * $.camelCase
   [ method ]
   * Camelize any dashed separated string
   > Parameters
   - str (string) A dashed separated string value to transform into camelCase.
   = (string) camelCase string
   > Usage
   | $.camelCase('background-color');
   * Result:
   | 'backgroundColor'
  \*/
  camelCase: function (str) {
    return str.replace(/-+(.)?/g, function (wholeMatch, character) {
      return character.toUpperCase();
    });
  },

  // unique reference for the current instance of Kimbo
  ref: 'kimbo' + ('1' + Math.random()).replace(/\D/g, '')
});

/*\
 * $.isFunction
 [ method ]
 * Determine if the parameter passed is a Javascript function object.
 > Parameters
 - obj (object) Object to test if its a function.
 = (boolean) According wether or not it is a function.
 > Usage
 | var myFunction = function () {};
 | $.isFunction(myFunction); // true
 | var something = ['lala', 'jojo'];
 | $.isFunction(something); // false
\*/

/*\
 * $.isObject
 [ method ]
 * Determine if the parameter passed is a Javascript plain object.
 > Parameters
 - obj (object) Object to test if its a plain object.
 = (boolean) According wether or not it is a plain object.
 > Usage
 | $.isObject({}); // true
 | $.isObject([]); // false
 | $.isObject('test'); // false
\*/

/*\
 * $.isString
 [ method ]
 * Determine if the parameter passed is a string.
 > Parameters
 - obj (object) Object to test if its a string.
 = (boolean) According wether or not it is a string.
 > Usage
 | $.isString('test'); // true
 | $.isString({ name: 'asd' }); // false
\*/

/*\
 * $.isBoolean
 [ method ]
 * Determine if the parameter passed is boolean.
 > Parameters
 - obj (object) Object to test if its boolean..
 = (boolean) According wether or not it is boolean.
 > Usage
 | $.isBoolean(false); // true
 | $.isBoolean(3); // false
\*/
Kimbo.forEach(['Function', 'Object', 'String', 'Boolean'], function (method) {
  var m = method.toLowerCase();
  Kimbo['is' + method] = function (obj) {
    return Kimbo.typeOf(obj) === m;
  };
});

// save reference to document
rootContext = Kimbo(document);


var _guid = 1,
  handlersHash = {},
  r_key_event = /^key/,
  r_mouse_event = /^(?:mouse|menu)|click/,
  defaultEventProps = ['altKey', 'bubbles', 'cancelable', 'ctrlKey', 'currentTarget', 'defaultPrevented', 'eventPhase', 'metaKey', 'relatedTarget', 'shiftKey', 'target', 'timeStamp', 'type', 'view', 'which'],
  keyEventProps = ['char', 'charCode', 'key', 'keyCode'],
  mouseEventProps = ['button', 'buttons', 'clientX', 'clientY', 'fromElement', 'offsetX', 'offsetY', 'screenX', 'screenY', 'toElement'],
  fixEventProps = {},
  specialEvents = {},
  // gestures fallback for not mobile environment
  gestures_fallback = Kimbo.isMobile() ? {} : {
    touchstart: 'mousedown',
    touchmove: 'mousemove',
    touchend: 'mouseup',
    touch: 'click',
    doubletap: 'dblclick',
    orientationchange: 'resize'
  };

function _fix(event) {
  // already fixed
  if (event[Kimbo.ref]) {
    return event;
  }

  // get event properties
  var originalEvent = event,
    eventProps = fixEventProps[event.type] || [],
    props = defaultEventProps.concat(eventProps);

  // create a new event writable custom event object
  event = new Kimbo.Event(originalEvent);

  // set event props to Kimbo.Event object
  Kimbo.forEach(props, function (prop) {
    event[prop] = originalEvent[prop];
  });

  return event;
}

// return element id
function _getElementId(element) {
  return element._guid || (element._guid = _guid++);
}

// get element handlers for the specified type
function _getHandlers(element_id, type) {
  var events = ((handlersHash[element_id] || {}).events || {});
  return (type ? events[type] : events) || [];
}

// quick is() to check if event target matches when events are delegated
function _is(target, selector, element) {
  return (target.nodeName.toLowerCase() === selector || Kimbo(target).closest(selector, element)[0]);
}

function _returnFalse() {
  return false;
}

function _returnTrue() {
  return true;
}

// helper for creating Event prototype methods
function _eventMethod(event, method, boolMethod) {
  event[boolMethod] = _returnTrue;
  // originalEvent is not present when trigger is called
  if (event.isTrigger) {
    return;
  }
  // call native method
  event.originalEvent[method]();
}

Kimbo.Event = function (event) {
  // is event object
  if (event && event.type) {
    this.originalEvent = event;
    this.type = event.type;

    // the event may have been prevented
    // check dom level 3 new attribute and set proper value
    if (event.defaultPrevented) {
      this.isDefaultPrevented = _returnTrue;
    } else {
      this.isDefaultPrevented = _returnFalse;
    }

  // is event type
  } else {
    this.type = event;
  }

  // create a timestamp if doesn't have one
  this.timeStamp = (event && event.timeStamp) || Date.now();

  // made by kimbo, yeah
  this[Kimbo.ref] = true;
};

// DOM-Level-3-Events compliant
Kimbo.Event.prototype = {
  preventDefault: function () {
    _eventMethod(this, 'preventDefault', 'isDefaultPrevented');
  },

  stopPropagation: function () {
    _eventMethod(this, 'stopPropagation', 'isPropagationStopped');
  },

  stopImmediatePropagation: function () {
    _eventMethod(this, 'stopImmediatePropagation', 'isImmediatePropagationStopped');
  },

  isDefaultPrevented: _returnFalse,
  isPropagationStopped: _returnFalse,
  isImmediatePropagationStopped: _returnFalse
};

// register events to dom elements
function _addEvent(element, type, callback, data, selector) {
  // TODO: element should use Kimbo.ref and the handler the _guid
  var element_id = _getElementId(element),
    elementhandlersHash = handlersHash[element_id],
    origType = type,
    events, handlers, handleObj, handler;

  // could be a special type like mouseenter/mouseleave
  type = specialEvents[type] ? specialEvents[type].origType : type;

  // create hash for this element if first init
  if (!elementhandlersHash) {
    handlersHash[element_id] = elementhandlersHash = {};
  }

  // create events object if first init
  events = elementhandlersHash.events;
  if (!events) {
    elementhandlersHash.events = events = {};
  }

  // create the handler for this element if first init
  handler = elementhandlersHash.handler;
  if (!handler) {
    elementhandlersHash.handler = handler = function () {
      return _dispatchEvent.apply(element, arguments);
    };
  }

  // create handler object
  handleObj = {
    type: type,
    origType: origType,
    data: data,
    callback: callback,
    selector: selector
  };

  // only add an event listener one time
  // for each type of event
  handlers = events[type];
  if (!handlers) {
    // array of events for the current type
    handlers = events[type] = [];
    handlers.delegateCount = 0;
    // add event
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    }
  }

  // add to handlers hash, delegates first
  if (selector) {
    handlers.delegateCount++;
    handlers.unshift(handleObj);
  } else {
    handlers.push(handleObj);
  }
}

// unregister events from dom elements
function _removeEvent(element, type, callback, selector) {
  var element_id = _getElementId(element),
    handleObj, handlers, name, i;

  // noly if this element ever had an event attached
  if (element_id) {
    handlers = _getHandlers(element_id, type);

    // return if no handlers for the current event type
    if (type && !handlers.length) {
      return;
    }

    // remove all handlers if no type provided
    if (!type) {
      for (name in handlers) {
        if (handlers.hasOwnProperty(name)) {
          return _removeEvent(element, name, callback, selector);
        }
      }
    }

    // remove handlers that match
    for (i = 0; i < handlers.length; i++) {
      handleObj = handlers[i];
      if ((!callback || callback === handleObj.callback) && (!selector || selector === handleObj.selector)) {
        // remove current handler from stack
        handlers.splice(i--, 1);
        // decrement delegate count
        if (handleObj.selector) {
          handlers.delegateCount--;
        }
      }
    }

    // if no more events for the current type delete its hash
    if (!handlers.length) {
      // remove event handler
      element.removeEventListener(type, handlersHash[element_id].handler, false);
      delete handlersHash[element_id].events[type];
    }

    // remove kimbo reference if element have no more events
    if (Kimbo.isEmptyObject(handlersHash[element_id].events)) {
      delete handlersHash[element_id];
      delete element._guid;
    }
  }
}

// triggers a provided event type
function _triggerEvent(element, type, data) {
  // don't do events if element is text or comment node
  // or if there is no event type at all or type is not a string
  if ((element && (element.nodeType === 3 || element.nodeType === 8)) || !type || !Kimbo.isString(type)) {
    return this;
  }

  var currentElement, lastElement, eventTree, element_id, event;

  // try triggering native focus and blur events
  if (type === 'focus' || type === 'blur') {
    try {
      return element[type]();
    } catch (e) {}
  }

  // create a new writable custom event object
  event = new Kimbo.Event(type);

  // triggered programatically
  event.isTrigger = true;

  // set the target
  if (!event.target) {
    event.target = element;
  }

  // include data if any
  data = data ? Kimbo.makeArray(data) : [];
  // event goes first
  data.unshift(event);

  // generate a stack of [element, event] to be triggered
  eventTree = [[element, type]];
  if (!Kimbo.isWindow(element)) {
    // get all parent elements to bubble event later
    for (currentElement = element.parentNode; currentElement; currentElement = currentElement.parentNode) {
      eventTree.push([currentElement, type]);
      lastElement = currentElement;
    }

    // only add window object if we got to document (e.g., not plain obj or detached DOM)
    if (lastElement && lastElement === element.ownerDocument) {
      eventTree.push([window, type]);
    }
  }

  // fire handlers up to the document (or the last element)
  Kimbo.forEach(eventTree, function (branch) {
    // element
    currentElement = branch[0];
    // type
    event.type = branch[1];

    // get element id
    element_id = _getElementId(currentElement);

    // if the current element has events of the specified type, dispatch them
    if (element_id && _getHandlers(element_id, type)) {
      handlersHash[element_id].handler.apply(currentElement, data);
    }
  });
}

// own defined dispatchEvent()
function _dispatchEvent(event) {
  // use own event object
  event = _fix(event);

  var element_id = _getElementId(this),
    handlers = _getHandlers(element_id, event.type),
    delegateCount = handlers.delegateCount,
    args = _slice.call(arguments, 0),
    handlerQueue = [],
    currentElement, ret, selMatch, matches, handleObj, selector, i;

  // set the native event to be the fixed event
  args[0] = event;

  // save the delegate target element
  event.delegateTarget = this;

  // get delegated handlers if any
  if (delegateCount) {

    // go up to the dom finding the elements that matches the current selector from delegated event
    for (currentElement = event.target; currentElement !== this; currentElement = currentElement.parentNode || this) {

      // don't do events on disabled elements
      if (currentElement.disabled !== true || event.type !== 'click') {
        selMatch = {};
        matches = [];
        // loop throgh delegated events
        for (i = 0; i < delegateCount; i++) {
          // get its handler
          handleObj = handlers[i];
          // get its selector
          selector = handleObj.selector;

          if (!selMatch[selector]) {
            selMatch[selector] = _is(currentElement, selector, this);
          }

          if (selMatch[selector]) {
            matches.push(handleObj);
          }
        }

        if (matches.length) {
          handlerQueue.push({ elem: currentElement, matches: matches });
        }
      }
    }
  }

  // add the remaining not delegated handlers
  if (handlers.length > delegateCount) {
    handlerQueue.push({ elem: this, matches: handlers.slice(delegateCount) });
  }

  // fire callbacks queue
  Kimbo.forEach(handlerQueue, function (handler) {
    // only fire handler if event wasnt stopped
    if (!event.isPropagationStopped()) {
      event.currentTarget = handler.elem;

      Kimbo.forEach(handler.matches, function (handleObj) {
        // only fire bubble if not stopped
        if (!event.isImmediatePropagationStopped()) {
          event.data = handleObj.data;
          event.handleObj = handleObj;

          // call original callback, check if its an special event first
          ret = ((specialEvents[handleObj.origType] || {}).handle || handleObj.callback).apply(handler.elem, args);

          // if callback returns false, stop the event
          if (ret === false) {
            event.preventDefault();
            event.stopPropagation();
          }
        }
      });
    }
  });
}

Kimbo.fn.extend({

  /*\
   * $(…).on
   [ method ]
   * Add an event handler to the selected elements.
   > Parameters
   - type (string) A string name for the event to register.
   - selector (string) #optional Delegate an event providing a string selector.
   - data (any) #optional Data to be passed to the handler in `event.data` when an event is triggered.
   - callback (function) A callback function to execute when the event is triggered.
   > Usage
   * Suppose a button element:
   | <button id='btn'>click me</button>
   * Register a click event handler
   | $('#btn').on('click', function (event) {
   |   console.log('clicked!', event);
   | });
   * There are shorthands for all events for example:
   | $('#btn').click(function (event) {
   |   console.log('clicked!', event);
   | });
   * Passing some data when registering the handler:
   | $('#btn').on('click', { name: 'denis' }, function (event) {
   |   // data passed is inside event.data
   |   console.log('name:', event.data.name);
   | });
   * Here is a list for all the shorthand methods available:
   | 'blur', 'change', 'click', 'contextmenu', 'dblclick', 'error',
   | 'focus', 'keydown', 'keypress', 'keyup', 'load', 'mousedown', 'mouseenter', 'mouseleave',
   | 'mousemove', 'mouseout', 'mouseup', 'mouseover', 'resize', 'scroll', 'select', 'submit', 'unload'
  \*/
  on: function (type, selector, data, callback) {
    // prepare the arguments

    // (type, callback)
    if (!data && !callback) {
      callback = selector;
      data = selector = undefined;
    } else if (!callback) {
      // (type, selector, callback)
      if (Kimbo.isString(selector)) {
        callback = data;
        data = undefined;
      // (type, data, callback)
      } else {
        callback = data;
        data = selector;
        selector = undefined;
      }
    }

    // don't add events if no callback
    if (!callback) {
      return this;
    }

    type = gestures_fallback[type] || type;

    // add the event
    return this.each(function () {
      _addEvent(this, type, callback, data, selector);
    });
  },

  /*\
   * $(…).off
   [ method ]
   * Remove an event handler to the selected elements for the specified type, or all of them if no type defined.
   > Parameters
   - type (string) #optional A string name for the event to remove, or All if none specified.
   - selector (string) #optional A string selector to undelegate an event from that element.
   - callback (function) #optional A specific callback function if there are multiple registered under the same event type
   > Usage
   * Suppose a button element:
   | <button id='btn'>click me</button>
   * Register a click event handler
   | $('#btn').on('click', function (event) {
   |   console.log('clicked!', event);
   | });
   * Remove the handler
   | $('#btn').off('click');
   * Also you could specify the handler for example:
   | var firstFunction = function () { console.log('first fn'); };
   | var secondFunction = function () { console.log('second fn'); };
   | var btn = $('#btn');
   | btn.click(firstFunction);
   | btn.click(secondFunction);
   * If you want to remove the click event only for the second function, do this:
   | btn.off('click', secondFunction);
   * Or if you want to remove All handlers (click and any other attached):
   | btn.off();
  \*/
  off: function (type, selector, callback) {
    // prepare the arguments

    // (type, callback)
    if (Kimbo.isFunction(selector)) {
      callback = selector;
      selector = undefined;
    }

    // remove the event
    return this.each(function () {
      _removeEvent(this, type, callback, selector);
    });
  },

  /*\
   * $(…).trigger
   [ method ]
   * Execute all handlers attached to the matched elements for the fiven event type.
   > Parameters
   - type (string) #optional A string name for the event to remove, or All if none specified.
   - data (any) #optional Additional parameters to be passed to the handler in `event.data` when an event is triggered.
   > Usage
   * Suppose a button element:
   | <button id='btn'>click me</button>
   * Register a click event handler
   | $('#btn').on('click', function (event, data) {
   |   console.log('name', data.name);
   | });
   * Trigger the event programatically passing some data:
   | $('#btn').trigger('click', { name: 'denis' });
   | // 'name denis'
   * Allow the handler to recieve multiple data:
   | $('#btn').on('click', function (event, name, last) {
   |   console.log('name', name);
   |   console.log('last', last);
   | });
   | $('#btn').trigger('click', ['denis', 'ciccale']);
   | // name denis
   | // last ciccale
  \*/
  trigger: function (type, data) {
    return this.each(function () {
      _triggerEvent(this, type, data);
    });
  },

  /*\
   * $(…).hover
   [ method ]
   * A shortcut method to register moseenter and/or mouseleave event handlers to the matched elements.
   > Parameters
   - fnOver (function) A function to execute when the cursor enters the element.
   - fnOut (function) #optional A function to execute when the cursor leaves the element.
   > Usage
   * Suppose a div element:
   | <div id='box'></div>
   * Register hover event
   | var fnOver = function () { console.log('enter'); };
   | var fnOut = function () { console.log('leave'); };
   |
   | $('.box').hover(fnOver, fnOut);
   * When the cursor enters the `.box` element the console will log:
   | 'enter'
   * When the cursor leaves the `.box` element the console will log:
   | 'leave'
  \*/
  hover: function (fnOver, fnOut) {
    return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
  }
});

// shortcut methods for each event type
Kimbo.forEach(['blur', 'change', 'click', 'contextmenu', 'dblclick', 'error',
  'focus', 'keydown', 'keypress', 'keyup', 'load', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove',
  'mouseout', 'mouseup', 'mouseover', 'resize', 'scroll', 'select', 'submit', 'unload'], function (type) {
  Kimbo.fn[type] = function (data, callback) {
    // prepare arguments
    if (!callback) {
      callback = data;
      data = null;
    }

    // add the event or trigger it if no args passed
    return arguments.length > 0 ? this.on(type, null, data, callback) : this.trigger(type);
  };

  // set event props for the specific type
  fixEventProps[type] = r_key_event.test(type) ? keyEventProps : r_mouse_event.test(type) ? mouseEventProps : null;
});

// fix mouseover and mouseout events
// to use mouseenter mouseleave
Kimbo.forEach({
  mouseenter: 'mouseover',
  mouseleave: 'mouseout'
}, function (orig, fix) {
  specialEvents[orig] = {
    origType: fix,

    handle: function (event) {
      var target = this,
        related = event.relatedTarget,
        handleObj = event.handleObj,
        ret;

      // for mouse(enter/leave) call the handler if 'related' is outside the target
      // no 'related' if the mouse left/entered the browser window
      if (!related || (related !== target && !_contains(target, related))) {
        event.type = handleObj.origType;
        ret = handleObj.callback.apply(this, arguments);
        event.type = fix;
      }

      return ret;
    }
  };
});



var mime_types = {
    xml: 'application/xml, text/xml',
    html: 'text/html',
    text: 'text/plain',
    json: 'application/json',
    script: 'text/javascript, application/javascript, application/ecmascript'
  },
  r_jsonp = /(\=)\?(&|$)|\?\?/i,
  dataParse = {
    json: Kimbo.parseJSON,
    xml: Kimbo.parseXML
  },
  xhrCallbacks = {};


// success and error callbacks
Kimbo.forEach(['success', 'error'], function (type) {
  xhrCallbacks[type] = function (res, msg, xhr, settings) {
    settings = settings || xhr;
    if (Kimbo.isFunction(settings[type])) {
      settings[type].apply(settings.context, arguments);
    }
  };
});

function _getResponse(response, type) {
  return (dataParse[type] ? dataParse[type](response) : response);
}

function _handleResponse(xhr, settings) {
  var response, contentType;

  // set dataType if missing
  if (!settings.dataType) {
    contentType = xhr.getResponseHeader('Content-Type');

    Kimbo.forEach(mime_types, function (name, type) {
      if (type.match(contentType)) {
        settings.dataType = name;
        return false;
      }
    });

    // fix settings headers
    _setHeaders(settings);
  }

  // handle response
  try {
    response = _getResponse(xhr.responseText, settings.dataType);
  } catch (e) {
    response = false;
    xhrCallbacks.error('parseerror', e, xhr, settings);
  }

  return response;
}

function _setHeaders(settings) {
  // must have this headers
  if (!settings.crossDomain && !settings.headers['X-Requested-With']) {
    settings.headers['X-Requested-With'] = 'XMLHttpRequest';
  }

  if (settings.contentType) {
    settings.headers['Content-Type'] = settings.contentType;
  }

  settings.headers.Accept = mime_types[settings.dataType] || '*/*';
}

function _timeout(xhr, settings) {
  xhr.onreadystatechange = null;
  xhr.abort();
  xhrCallbacks.error('error', 'timeout', xhr, settings);
}

function _createAbortTimeout(xhr, settings) {
  return window.setTimeout(function () {
    _timeout(xhr, settings);
  }, settings.timeout);
}

/*\
 * $.ajaxSettings
 [ property ]
 * Default ajax settings object.
 > Usage
 * If you want to change the global and default ajax settings, change this object properties:
 | $.ajaxSettings.error = function () {
 |   // handle any failed ajax request in your app
 | };
 | $.ajaxSettings.timeout = 1000; // 1 second
\*/
Kimbo.ajaxSettings = {
  type: 'GET',
  async: true,
  success: {},
  error: {},
  context: null,
  headers: {},
  data: null,
  xhr: function () {
    return new window.XMLHttpRequest();
  },
  crossDomain: false,
  timeout: 0,
  contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
};


/*\
 * $.ajax
 [ method ]
 * Perform an asynchronous HTTP (Ajax) request.
 > Parameters
 - options (object) #optional An object with options
 o {
 o   url (string) Url to make the request.
 o   type (string) #optional Type of request. Could be `'GET'` or `'POST'`. Default value is `'GET'`.
 o   async (boolean) #optional Default value is `true` if you want synchronous requests set option to `false`.
 o   success (function) #optional A function that will be called if the request succeeds. Recieving (response, responseMessage, xhr, settings).
 o   error (function) #optional A function that will be called if the request fails. Recieving (response, responseMessage, xhr, settings).
 o   context (object) #optional The context in which all ajax request are made. By default the context are the settings object. Could be any DOM element.
 o   headers (object) #optional An object with additional header key/value pairs to send along with the request.
 o   data (string|object) #optional Additional data to send with the request, if it is an object is converted to a query string.
 o   xhr (function) #optional A function that returns a `new XMLHttpRequest()` object by default.
 o   crossDomain (boolean) #optional Indicate wether you want to force crossDomain requests. `false` by defualt.
 o   timeout (number) #optional Set a default timeout in milliseconds for the request.
 o   contentType (string) #optional The default and finest contentType for most cases is `'application/x-www-form-urlencoded; charset=UTF-8'`.
 o }
 = (object) The native xhr object.
 > Usage
 * Get a username passing an id to the /users url
 | $.ajax({
 |   url '/users',
 |   data: {
 |     id: 3
 |   },
 |   success: function (response, responseMessage, xhr, settings) {
 |     // success...
 |   },
 |   error: function (response, responseMessage, xhr, settings) {
 |     // error...
 |   }
 | });
\*/
Kimbo.ajax = function (options) {
  var settings = Kimbo.extend({}, Kimbo.ajaxSettings, options),
    xhr,
    abortTimeout,
    callback;

  // add data to url
  if (settings.data) {
    settings.url += (/\?/.test(settings.url) ? '&' : '?') + Kimbo.param(settings.data);
    delete settings.data;
  }

  // set default context
  if (!settings.context) {
    settings.context = settings;
  }

  // check if its jsonp
  if (r_jsonp.test(settings.url)) {
    return _getJSONP(settings);
  }

  // create new instance
  xhr = settings.xhr();

  // user specified timeout
  if (settings.timeout > 0) {
    abortTimeout = _createAbortTimeout(xhr, settings);
  }

  // on complete callback
  callback = function () {
    var response, status;

    // request complete
    if (xhr.readyState === 4) {
      status = xhr.status;

      // clear timeout
      window.clearTimeout(abortTimeout);

      // scuccess
      if ((status >= 200 && status < 300) || status === 304) {
        if (settings.async) {
          response = _handleResponse(xhr, settings);
          if (response !== false) {
            xhrCallbacks.success(response, xhr, settings);
          }
        }

      // fail
      } else {
        xhrCallbacks.error('error', xhr.statusText, xhr, settings);
      }
    }
  };

  // listen for response
  xhr.onreadystatechange = callback;

  // init request
  xhr.open(settings.type, settings.url, settings.async);

  // set settings headers
  _setHeaders(settings);

  // set xhr headers
  Kimbo.forEach(settings.headers, function (header, value) {
    xhr.setRequestHeader(header, value);
  });

  // try to send request
  xhr.send(settings.data);

  return (settings.async) ? xhr : callback();
};

/*\
 * $.get
 [ method ]
 * Load data from the server using HTTP GET request.
 > Parameters
 - url (string) A string containing the URL to which the request is sent.
 - data (string|object) #optional An option string or object with data params to send to the server.
 - callback (function) A callback function to execute if the request succeeds.
 - type (string) #optional String with the type of the data to send (intelligent guess by default).
 > Usage
 | $.get('url/users.php', { id: '123' }, function (data) {
 |   // success
 |   console.log('response:', data);
 | });
 * This method is a shorthand for the $.ajax
 | $.ajax({
 |   url: url,
 |   data: data,
 |   success: success,
 |   dataType: dataType
 | });
\*/

/*\
 * $.post
 [ method ]
 * Load data from the server using HTTP POST request.
 > Parameters
 - url (string) A string containing the URL to which the request is sent.
 - data (string|object) #optional An option string or object with data params to send to the server.
 - callback (function) A callback function to execute if the request succeeds.
 - type (string) #optional String with the type of the data to send (intelligent guess by default).
 > Usage
 | $.post('url/users.php', { user: 'denis', pass: '123' }, function (data) {
 |   // success
 |   console.log('response:', data);
 | });
 * This method is a shorthand for the $.ajax
 | $.ajax({
 |   type: 'POST',
 |   url: url,
 |   data: data,
 |   success: success,
 |   dataType: dataType
 | });
\*/
Kimbo.forEach(['get', 'post'], function (method) {
  Kimbo[method] = function (url, data, callback, type) {
    // prepare arguments
    if (Kimbo.isFunction(data)) {
      type = type || callback;
      callback = data;
      data = null;
    }

    // call ajax
    return Kimbo.ajax({
      type: method.toUpperCase(),
      url: url,
      data: data,
      success: callback,
      dataType: type
    });
  };
});

Kimbo.extend({
 /*\
  * $.getScript
  [ method ]
  * Load a JavaScript file from the server using a GET HTTP request, then execute it.
  > Parameters
  - url (string) A string containing the URL to which the request is sent.
  - callback (function) A callback function to execute if the request succeeds.
  > Usage
  | $.post('url/script.js', function (data) {
  |   // success
  |   console.log('response:', data);
  | });
  * This method is a shorthand for the $.ajax
  | $.ajax({
  |   url: url,
  |   dataType: 'script',
  |   success: success
  | });
 \*/
  getScript: function (url, callback) {
    return Kimbo.get(url, callback, 'script');
  },

 /*\
  * $.getJSON
  [ method ]
  * Load data from the server using HTTP POST request.
  > Parameters
  - url (string) A string containing the URL to which the request is sent.
  - data (string|object) #optional An option string or object with data params to send to the server.
  - callback (function) A callback function to execute if the request succeeds.
  - type (string) #optional String with the type of the data to send (intelligent guess by default).
  > Usage
  | $.post('url/test.json', { id: '2' }, function (data) {
  |   // success
  |   console.log('response:', data);
  | });
  * This method is a shorthand for the $.ajax
  | $.ajax({
  |   url: url,
  |   dataType: 'json',
  |   success: success
  | });
  * To get json data with jsonp:
  | $.getJSON('http://search.twitter.com/search.json?callback=?', 'q=#javascript', function (data) {
  |   console.log(data);
  | });
 \*/
  getJSON: function (url, data, callback) {
    return Kimbo.get(url, data, callback, 'json');
  }
});

// getJSONP internal use
function _getJSONP(settings) {
  var jsonpCallback = Kimbo.ref + '_' + Date.now(),
    script = document.createElement('script'),
    head = document.head,
    abortTimeout,
    xhr = {
      abort: function () {
        window.clearTimeout(abortTimeout);
        head.removeChild(script);
        delete window[jsonpCallback];
      }
    };

  // user specified timeout
  if (settings.timeout > 0) {
    abortTimeout = _createAbortTimeout(xhr, settings);
  }

  // set url
  script.src = settings.url.replace(r_jsonp, '$1' + jsonpCallback + '$2');

  // JSONP callback
  window[jsonpCallback] = function (response) {
    // remove script
    xhr.abort();

    // fake xhr
    Kimbo.extend(xhr, {
      statusText: 'OK',
      status: 200,
      response: response,
      headers: settings.headers
    });

    // success
    xhrCallbacks.success(response, xhr, settings);
  };

  // set settings headers
  _setHeaders(settings);

  // apend script to head to make the request
  head.appendChild(script);

  // return fake xhr object to abort manually
  return xhr;
}

/*\
 * $.param
 [ method ]
 * Create a serialized representation of an array or object, suitable for use in a URL query string or Ajax request.
 > Parameters
 - data (string|object) A string or object to serialize.
 > Usage
 | var obj = { name: 'Denis', last: 'Ciccale' };
 | var serialized = $.param(obj); // 'name=Denis&last=Ciccale'
\*/
Kimbo.param = function (data) {
  var params = '';

  if (Kimbo.isObject(data)) {
    Kimbo.forEach(data, function (name, value) {
      params += name + '=' + value + '&';
    });
  } else {
    params = data;
  }

  return window.encodeURIComponent(params).replace(/%20/g, '+').replace(/%\d[D6F]/g, window.unescape).replace(/^\?|&$/g, '');
};


// expose Kimbo to global object
window.Kimbo = window.$ = Kimbo;

// expose Kimbo as an AMD module
if (typeof window.define === 'function' && window.define.amd) {
  window.define('kimbo', [], function () {
    return window.Kimbo;
  });
}

}(this));
