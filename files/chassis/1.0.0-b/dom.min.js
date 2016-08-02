window.DOM = {};

Object.defineProperties(window.DOM, {
  /**
   * @method ready
   * Executes code after the DOM is loaded.
   * @param {function} callback
   * The function to call when the DOM is fully loaded.
   */
  ready: {
    enumerable: true,
    writable: false,
    configurable: false,
    value: function(callback){
      document.addEventListener('DOMContentLoaded',callback);
    }
  },

  /**
   * @method destroy
   * Remove a DOM element.
   * @param {HTMLElement|NodeList|String|Array} node
   * Accepts a single `HTMLElement`, a `NodeList`, a CSS selector, or
   * an array or `HTMLElements`/`NodeList`/CSS Selectors.
   */
  destroy: {
    enumerable: true,
    writable: false,
    configurable: false,
    value: function(el){
      var me = this;
      // Process a CSS selector
      if (typeof el === 'string'){
        var str = el;
        el = document.querySelectorAll(el);
        if (el.length === 0){
          console.warn('The \"'+str+'\" selector did not return any elements.');
          return;
        }
        // Iterate through results and remove each element.
        Array.prototype.slice.call(el).forEach(function(node){
          me.destroy(node);
        });
      } else {
        switch(Object.prototype.toString.call(el).split(' ')[1].replace(/\]|\[/gi,'').toLowerCase()){
          case 'array':
            el.forEach(function(node){
              me.destroy(node);
            });
            return;
          case 'nodelist':
            Array.prototype.slice.call(el).forEach(function(node){
              me.destroy(node);
            });
            return;
          case 'htmlelement':
            el.parentNode.removeChild(el);
            return;
          default:
            console.warn('An unknown error occurred while trying to remove DOM elements.');
            console.log('Unknown Element',el);
        }
      }
    }
  },

  /**
   * @method findParent
   * Find a distant parent of a DOM element. This can be thought
   * of as a reverse CSS selector that traverse UP the DOM chain
   * to find the parent element.
   *
   * For example:
   *
   * Assume the following HTML structure & JS code:
   *
   * ```html
   * <section>
   *   <header class="MyGroup">
   *     <div>
   *       <div>
   *         <button>Delete Entire Group</button>
   *       </div>
   *     </div>
   *   </header>
   * </section>
   * ```
   *
   * ```js
   * ref.find('button.remove').addEventListener('click', function(event){
   *   event.preventDefault();
   *   var removeButton = event.currentTarget;
   *   var group = ref.findParent(removeButton,'header');
   *   ref.destroy(group);
   * });
   * ```
   *
   * The code above listens for a click on the button. When the button
   * is clicked, the `findPerent` method recognizes the "Delete Entire Group"
   * button and traverses UP the DOM chain until it finds a `header` DOM
   * element. The `header` DOM element is returned (as `group` variable). The
   * group is then removed using the `ref.destroy` method.
   *
   * Alternatively, the same effect could have been achieved if line 4
   * of the JS code was:
   * ```js
   * var group = ref.findParent(removeButton, '.MyGroup');
   * ```
   * @param {HTMLElement|String} element
   * The DOM element or a CSS selector string identifying the
   * element whose parent should be found.
   * @param {String} selector
   * A minimal CSS selector used to identify the parent.
   * @param {Number} maxDepth
   * The maximum number of elements to traverse. This can be used to
   * cap a selector and force it to fail before reaching a known limit.
   * By default, there is no limit (i.e. maxDepth=null).
   * @returns {HTMLElement}
   * Responds with the DOM Element, or `null` if none was found.
   */
  findParent: {
    enumerable: true,
    writable: false,
    configurable: false,
    value: function(node,selector,maxDepth){
      if (typeof node === 'string'){
        node = document.querySelectorAll(node);
        if (node.length === 0){
          console.warn('\"'+node+'\" is an invalid CSS selector (Does not identify any DOM elements).');
          return null;
        }
        node = node[0];
      }

      var currentNode = node.parentNode;
      var i = 0;
      maxDepth = typeof maxDepth === 'number' ? maxDepth : -1 ;

      while(currentNode.parentNode.querySelector(selector) === null && currentNode.nodeName !== 'BODY'){
        i++;
        if (maxDepth > 0 && i > maxDepth){
          return null;
        }
        currentNode = currentNode.parentNode;
      }

      return currentNode;
    }
  }
});
