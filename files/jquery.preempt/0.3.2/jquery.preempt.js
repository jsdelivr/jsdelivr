/**
 * @namespace preempt
 */

(function ($) {
  'use strict';

  /**
   * @description plugin identifier
   * @type {string}
   * @private
   * @const
   */
  var PLUGIN_NAME = 'preempt',

    /**
     * @description instance_id
     * @type {string}
     * @private
     */
      instance_id = "plugin." + PLUGIN_NAME,

    /**
     * Script URL prefix.  JSHint hates this.
     * @type {string}
     * @private
     * @const
     */
      SCRIPT_URL = 'javascript:',

    /**
     * @description Class representing an instance of the Preempt plugin.
     * @param {jQuery} element jQuery element to preempt
     * @private
     * @constructor
     */
      Preempt = function Preempt(element) {

      /**
       * Name of this plugin
       * @type {string}
       * @protected
       */
      this._name = PLUGIN_NAME;

      /**
       * jQuery element to preempt
       * @type {jQuery}
       * @protected
       */
      this._element = element;

      /**
       * Whether or not to prepend "javascript:" to the attr string when restoring
       * @type {boolean}
       * @protected
       */
      this._prefix = false;
    };

  /**
   * @description Replaces the inlined JS with an event handler which also eval's the inlined JS.
   * @param {Object} cfg Configuration object
   */
  Preempt.prototype.init =
    function init(cfg) {
      var el = this._element,
        preemptor = function preemptor(evt) {
          var exec = function exec() {
              return eval('(function(event){ ' + js +
                '}).call(el[0]);');
            },
            retval;

          if (before.call(el, evt, data.before) === false) {
            return false;
          }
          if (evt.isImmediatePropagationStopped()) {
            return;
          }
          retval = exec();
          if (retval === false && !forcePropagate) {
            return false;
          }
          if (evt.isImmediatePropagationStopped() && !forcePropagate) {
            return;
          }
          return (forcePropagate && retval === false) ? false :
                 after.call(el, evt, data.after);
        },
        attr = cfg.attr,
        event = cfg.event,
        forcePropagate = !!cfg.forcePropagate,
        after = cfg.after || $.noop,
        before = cfg.before || cfg.callback || $.noop,
        data = cfg.data || {},
        js = el.attr(attr) || '';

      if (js.indexOf(SCRIPT_URL) === 0) {
        this._prefix = true;
        js = js.substring(11);
      }

      el.removeAttr(attr)
        .off(event)
        .on(event, preemptor);

      // store it so we can easily restore it
      el.data(cfg.js_id, js);

    };

  /**
   * @method
   * @param {Object} cfg Configuration object
   */
  Preempt.prototype.restore = function restore(cfg) {
    var el = this._element,
      js_id = cfg.js_id,
      attr = cfg.attr,
      event = cfg.event,
      js = el.data(js_id);
    el.attr(attr, this._prefix ? SCRIPT_URL + js : js)
      .off(event);
    el.removeData(js_id);
  };

  /**
   * @description Takes legacy inline JS (i.e. `onclick` and `href="javascript:..."`) and creates event handler(s) to be run around the inlined code.
   * @todo Document more thoroughly.
   * @example
   *
   * // given <button onclick="doSomething()">do something</button>
   * // or <a href="javascript:doSomethingElse()">do something else</a>
   *
   * // Basic usage:
   * $('button').preempt({
   *   attr: 'onclick',
   *   event: 'click',
   * }, function doSomethingBeforeSomething() {
   *   // do something else
   * });
   *
   * // Restoring the inline JS:
   * $('button').preempt({
   *   attr: 'onclick',
   *   event: 'click',
   *   restore: true
   * });
   *
   * // Fancy usage:
   * $('button').preempt({
   *   attr: 'onclick',
   *   event: 'click',
   *   before: function executedBeforeInlineJS(event, data) {
   *     // stuff; return false to halt propagation to inline JS
   *   },
   *   after: function exectedAfterInlineJS(event, data) {
   *     // things; return false to prevent the default action and stop propagation
   *   },
   *   // will execute the after() function even if the inlined JS returned false.
   *   forcePropagation: true,
   *   data: {
   *     before: 'some data to be passed to the before() function',
   *     after: 'some data to be passed to the after() function',
   *   }
   * });
   * @this jQuery
   * @param {{
   *  attr: string,
   *  event: string,
   *  before: ?function(jQuery.Event, *):?boolean,
   *  after: ?function(jQuery.Event, *):?boolean,
   *  forcePropagation: boolean=,
   *  data: Object<string, *>
   * }} options
   * - `attr` is the attribute you want to replace
   * - `event` is the new event to bind
   * - `before` is a function you wish to execute *before* the inline handler.  The second parameter, `callback`, will be overridden by this function.  If this function returns `false` or halts immediate propagation, the inline function will not be called, and further *immediate* propagation of the event will not occur.
   * - `after` is a function you wish to execute *after* the inline handler.  If this function returns `false` or halts immediate propagation, further *immediate* propagation of the event will not occur.
   * - `forcePropagation` causes your `after` function to be executed *regardless* of whether the inline function stopped immediate propagation or returned `false`.  In this case, if the inline function happened to return `false,` the default action for the event (whatever that may be; see {@link http://api.jquery.com/event.preventDefault/}) *will* be prevented and bubbling will not occur.  If `after` is not present, this does nothing.
   * - `data` is an object with keys `before`, and `after`.  The values will be passed, respectively, to the `before` and `after` functions as the *second* parameter (the first will be the Event itself).  A third key, `js`, is automatically added to the objects, and its value is the original contents of the `attr` attribute.  It will have the `javascript:` prefix stripped, if present.  It's worth remembering that the context (the `this`) of an inline function is the DOM element itself.
   * @param {Function=} callback Event handler callback function to be executed *before* the inline handler.  Alias for `options.before`; if both are present then `options.before` will take precedence.
   * @todo support for delegate-style usage
   * @returns {jQuery} A jQuery obj
   * @memberOf preempt
   */
  jQuery.fn.preempt = function preempt(options, callback) {
    return $(this).each(function () {
      var $this = $(this),
        instance = $this.data(instance_id),
        cfg,
        js_id,
        attr = options.attr,
        restore = !!options.restore,
        new_evt = options.event;

      callback = callback || $.noop;

      if (!(attr && new_evt)) {
        throw new Error('jquery.preempt: options.attr and opts.event are required');
      }

      js_id = instance_id + '.' + attr + '.' + new_evt + '.js';

      cfg = $.extend({}, {js_id: js_id, callback: callback}, options);

      if (!instance) {
        // if we don't have an instance, restore() does nothing.
        if (restore) {
          return;
        }
        instance = new Preempt($this);
        $this.data(instance_id, instance);
      }
      if (!$this.data(js_id)) {
        instance.init(cfg);
      } else if (restore) {
        instance.restore(cfg);
      }
    });
  };


})(jQuery);
