/*!
 * uEvent - to make any js object an event emitter
 * Copyright 2011 Jerome Etienne (http://jetienne.com)
 * Copyright 2015-2016 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

(function(root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    }
    else if (typeof define === 'function' && define.amd) {
        define('uevent', [], factory);
    }
    else {
        root.uEvent = factory();
    }
}(this, function() {
    "use strict";

    var returnTrue = function() {
        return true;
    };
    var returnFalse = function() {
        return false;
    };

    var uEvent = function() {
    };

    /**
     * Event object used to stop propagations and prevent default
     */
    uEvent.Event = function(type, args) {
        var typeReadOnly = type;
        var argsReadonly = args;

        Object.defineProperties(this, {
            'type': {
                get: function() {
                    return typeReadOnly;
                },
                set: function(value) {
                },
                enumerable: true
            },
            'args': {
                get: function() {
                    return argsReadonly;
                },
                set: function(value) {
                },
                enumerable: true
            }
        });
    };

    uEvent.Event.prototype = {
        constructor: uEvent.Event,

        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,

        preventDefault: function() {
            this.isDefaultPrevented = returnTrue;
        },
        stopPropagation: function() {
            this.isPropagationStopped = returnTrue;
        }
    };

    uEvent.prototype = {
        constructor: uEvent,

        /**
         * Add one or many event handlers
         *
         *  obj.on('event', callback)
         *  obj.on('event', listener) -- listener has an handleEvent method
         *  obj.on('event1 event2', callback)
         *  obj.on({ event1: callback1, event2: callback2 })
         *
         * @param {String,Object} events
         * @param {Function,optional} callback
         * @return {Object} main object
         */
        on: function(events, callback) {
            this.__events = this.__events || {};

            if (typeof events === 'object') {
                for (var event in events) {
                    if (events.hasOwnProperty(event)) {
                        this.__events[event] = this.__events[event] || [];
                        this.__events[event].push(events[event]);
                    }
                }
            }
            else {
                events.split(' ').forEach(function(event) {
                    this.__events[event] = this.__events[event] || [];
                    this.__events[event].push(callback);
                }, this);
            }

            return this;
        },

        /**
         * Remove one or many or all event handlers
         *
         *  obj.off('event')
         *  obj.off('event', callback)
         *  obj.off('event1 event2')
         *  obj.off({ event1: callback1, event2: callback2 })
         *  obj.off()
         *
         * @param {String|Object,optional} events
         * @param {Function,optional} callback
         * @return {Object} main object
         */
        off: function(events, callback) {
            this.__events = this.__events || {};

            if (typeof events === 'object') {
                for (var event in events) {
                    if (events.hasOwnProperty(event) && (event in this.__events)) {
                        var index = this.__events[event].indexOf(events[event]);
                        if (index !== -1) this.__events[event].splice(index, 1);
                    }
                }
            }
            else if (!!events) {
                events.split(' ').forEach(function(event) {
                    if (event in this.__events) {
                        if (callback) {
                            var index = this.__events[event].indexOf(callback);
                            if (index !== -1) this.__events[event].splice(index, 1);
                        }
                        else {
                            this.__events[event].length = 0;
                        }
                    }
                }, this);
            }
            else {
                this.__events = {};
            }

            return this;
        },

        /**
         * Add one or many event handlers that will be called only once
         * This handlers are only applicable to "trigger", not "change"
         *
         *  obj.once('event', callback)
         *  obj.once('event1 event2', callback)
         *  obj.once({ event1: callback1, event2: callback2 })
         *
         * @param {String|Object} events
         * @param {Function,optional} callback
         * @return {Object} main object
         */
        once: function(events, callback) {
            this.__once = this.__once || {};

            if (typeof events === 'object') {
                for (var event in events) {
                    if (events.hasOwnProperty(event)) {
                        this.__once[event] = this.__once[event] || [];
                        this.__once[event].push(events[event]);
                    }
                }
            }
            else {
                events.split(' ').forEach(function(event) {
                    this.__once[event] = this.__once[event] || [];
                    this.__once[event].push(callback);
                }, this);
            }

            return this;
        },

        /**
         * Trigger all handlers for an event
         *
         * @param {String} event name
         * @param {mixed...,optional} arguments
         * @return {uEvent.Event}
         */
        trigger: function(event /* , args... */) {
            var args = Array.prototype.slice.call(arguments, 1);
            var e = new uEvent.Event(event, args);
            var i, l, f;

            args.push(e);

            if (this.__events && event in this.__events) {
                for (i = 0, l = this.__events[event].length; i < l; i++) {
                    f = this.__events[event][i];
                    if (typeof f === 'object') {
                        f.handleEvent(e);
                    }
                    else {
                        f.apply(this, args);
                    }
                    if (e.isPropagationStopped()) {
                        return e;
                    }
                }
            }

            if (this.__once && event in this.__once) {
                for (i = 0, l = this.__once[event].length; i < l; i++) {
                    f = this.__once[event][i];
                    if (typeof f === 'object') {
                        f.handleEvent(e);
                    }
                    else {
                        f.apply(this, args);
                    }
                    if (e.isPropagationStopped()) {
                        delete this.__once[event];
                        return e;
                    }
                }
                delete this.__once[event];
            }

            return e;
        },

        /**
         * Trigger all modificators for an event, each handler must return a value
         *
         * @param {String} event name
         * @param {mixed} event value
         * @param {mixed...,optional} arguments
         * @return {mixed} modified value
         */
        change: function(event, value /* , args... */) {
            var args = Array.prototype.slice.call(arguments, 1);
            var e = new uEvent.Event(event, args);
            var i, l, f;

            args.push(e);

            if (this.__events && event in this.__events) {
                for (i = 0, l = this.__events[event].length; i < l; i++) {
                    args[0] = value;
                    f = this.__events[event][i];
                    if (typeof f === 'object') {
                        value = f.handleEvent(e);
                    }
                    else {
                        value = f.apply(this, args);
                    }
                    if (e.isPropagationStopped()) {
                        return value;
                    }
                }
            }

            return value;
        }
    };

    /**
     * Copy all uEvent functions in the destination object
     *
     * @param {Object} target, the object which will support uEvent
     * @param {Object,optional} names, strings map to rename methods
     */
    uEvent.mixin = function(target, names) {
        names = names || {};
        target = typeof target === 'function' ? target.prototype : target;

        ['on', 'off', 'once', 'trigger', 'change'].forEach(function(name) {
            var method = names[name] || name;
            target[method] = uEvent.prototype[name];
        });

        Object.defineProperties(target, {
            '__events': {
                value: null,
                writable: true
            },
            '__once': {
                value: null,
                writable: true
            }
        });
    };

    return uEvent;
}));


/*!
 * jQuery.extendext 0.1.1
 *
 * Copyright 2014 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 * 
 * Based on jQuery.extend by jQuery Foundation, Inc. and other contributors
 */


(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('jQuery.extendext', ['jquery'], factory);
    }
    else {
        factory(root.jQuery);
    }
}(this, function($) {
  "use strict";

  $.extendext = function() {
    var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false,
      arrayMode = 'default';

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
      deep = target;

      // Skip the boolean and the target
      target = arguments[ i++ ] || {};
    }

    // Handle array mode parameter
    if ( typeof target === "string" ) {
      arrayMode = $([target.toLowerCase(), 'default']).filter(['default','concat','replace','extend'])[0];

      // Skip the string param
      target = arguments[ i++ ] || {};
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !$.isFunction(target) ) {
      target = {};
    }

    // Extend jQuery itself if only one argument is passed
    if ( i === length ) {
      target = this;
      i--;
    }

    for ( ; i < length; i++ ) {
      // Only deal with non-null/undefined values
      if ( (options = arguments[ i ]) !== null ) {
        // Special operations for arrays
        if ($.isArray(options) && arrayMode !== 'default') {
          clone = target && $.isArray(target) ? target : [];

          switch (arrayMode) {
          case 'concat':
            target = clone.concat( $.extend( deep, [], options ) );
            break;

          case 'replace':
            target = $.extend( deep, [], options );
            break;

          case 'extend':
            options.forEach(function(e, i) {
              if (typeof e === 'object') {
                var type = $.isArray(e) ? [] : {};
                clone[i] = $.extendext( deep, arrayMode, clone[i] || type, e );

              } else if (clone.indexOf(e) === -1) {
                clone.push(e);
              }
            });

            target = clone;
            break;
          }

        } else {
          // Extend the base object
          for ( name in options ) {
            src = target[ name ];
            copy = options[ name ];

            // Prevent never-ending loop
            if ( target === copy ) {
              continue;
            }

            // Recurse if we're merging plain objects or arrays
            if ( deep && copy && ( $.isPlainObject(copy) ||
              (copyIsArray = $.isArray(copy)) ) ) {

              if ( copyIsArray ) {
                copyIsArray = false;
                clone = src && $.isArray(src) ? src : [];

              } else {
                clone = src && $.isPlainObject(src) ? src : {};
              }

              // Never move original objects, clone them
              target[ name ] = $.extendext( deep, arrayMode, clone, copy );

            // Don't bring in undefined values
            } else if ( copy !== undefined ) {
              target[ name ] = copy;
            }
          }
        }
      }
    }

    // Return the modified object
    return target;
  };
}));

/*!
 * jQuery QueryBuilder 1.4.3
 * Copyright 2014-2016 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

// Modules: bt-selectpicker, bt-tooltip-errors, filter-description, loopback-support, mongodb-support, sortable, sql-support
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('query-builder', ['jquery', 'uevent', 'jQuery.extendext'], factory);
    }
    else {
        factory(root.jQuery, root.uEvent);
    }
}(this, function($, uEvent) {
    "use strict";

    var types = [
            'string',
            'integer',
            'double',
            'date',
            'time',
            'datetime',
            'boolean'
        ],
        internalTypes = [
            'string',
            'number',
            'datetime',
            'boolean'
        ],
        inputs = [
            'text',
            'textarea',
            'radio',
            'checkbox',
            'select'
        ];


    var QueryBuilder = function($el, options) {
        this.$el = $el;
        this.init(options);
    };

    uEvent.mixin(QueryBuilder);


    QueryBuilder.DEFAULTS = {
        filters: [],

        plugins: null,

        onValidationError: null,
        onAfterAddGroup: null,
        onAfterAddRule: null,

        display_errors: true,
        allow_groups: -1,
        allow_empty: false,
        conditions: ['AND', 'OR'],
        default_condition: 'AND',

        default_rule_flags: {
            filter_readonly: false,
            operator_readonly: false,
            value_readonly: false,
            no_delete: false
        },

        template: {
            group: null,
            rule: null
        },

        lang: {
            "add_rule": 'Add rule',
            "add_group": 'Add group',
            "delete_rule": 'Delete',
            "delete_group": 'Delete',

            "condition_and": 'AND',
            "condition_or": 'OR',

            "filter_select_placeholder": '------',

            "operators": {
                "equal": "equal",
                "not_equal": "not equal",
                "in": "in",
                "not_in": "not in",
                "less": "less",
                "less_or_equal": "less or equal",
                "greater": "greater",
                "greater_or_equal": "greater or equal",
                "between": "between",
                "begins_with": "begins with",
                "not_begins_with": "doesn't begin with",
                "contains": "contains",
                "not_contains": "doesn't contain",
                "ends_with": "ends with",
                "not_ends_with": "doesn't end with",
                "is_empty": "is empty",
                "is_not_empty": "is not empty",
                "is_null": "is null",
                "is_not_null": "is not null"
            },

            "errors": {
                "no_filter": "No filter selected",
                "empty_group": "The group is empty",
                "radio_empty": "No value selected",
                "checkbox_empty": "No value selected",
                "select_empty": "No value selected",
                "string_empty": "Empty value",
                "string_exceed_min_length": "Must contain at least {0} characters",
                "string_exceed_max_length": "Must not contain more than {0} characters",
                "string_invalid_format": "Invalid format ({0})",
                "number_nan": "Not a number",
                "number_not_integer": "Not an integer",
                "number_not_double": "Not a real number",
                "number_exceed_min": "Must be greater than {0}",
                "number_exceed_max": "Must be lower than {0}",
                "number_wrong_step": "Must be a multiple of {0}",
                "datetime_invalid": "Invalid date format ({0})",
                "datetime_exceed_min": "Must be after {0}",
                "datetime_exceed_max": "Must be before {0}",
                "boolean_not_valid": "Not a boolean"
            }
        },

        operators: [
            {type: 'equal',            accept_values: 1, apply_to: ['string', 'number', 'datetime', 'boolean']},
            {type: 'not_equal',        accept_values: 1, apply_to: ['string', 'number', 'datetime', 'boolean']},
            {type: 'in',               accept_values: 1, apply_to: ['string', 'number', 'datetime']},
            {type: 'not_in',           accept_values: 1, apply_to: ['string', 'number', 'datetime']},
            {type: 'less',             accept_values: 1, apply_to: ['number', 'datetime']},
            {type: 'less_or_equal',    accept_values: 1, apply_to: ['number', 'datetime']},
            {type: 'greater',          accept_values: 1, apply_to: ['number', 'datetime']},
            {type: 'greater_or_equal', accept_values: 1, apply_to: ['number', 'datetime']},
            {type: 'between',          accept_values: 2, apply_to: ['number', 'datetime']},
            {type: 'begins_with',      accept_values: 1, apply_to: ['string']},
            {type: 'not_begins_with',  accept_values: 1, apply_to: ['string']},
            {type: 'contains',         accept_values: 1, apply_to: ['string']},
            {type: 'not_contains',     accept_values: 1, apply_to: ['string']},
            {type: 'ends_with',        accept_values: 1, apply_to: ['string']},
            {type: 'not_ends_with',    accept_values: 1, apply_to: ['string']},
            {type: 'is_empty',         accept_values: 0, apply_to: ['string']},
            {type: 'is_not_empty',     accept_values: 0, apply_to: ['string']},
            {type: 'is_null',          accept_values: 0, apply_to: ['string', 'number', 'datetime', 'boolean']},
            {type: 'is_not_null',      accept_values: 0, apply_to: ['string', 'number', 'datetime', 'boolean']}
        ],

        icons: {
            add_group: 'glyphicon glyphicon-plus-sign',
            add_rule: 'glyphicon glyphicon-plus',
            remove_group: 'glyphicon glyphicon-remove',
            remove_rule: 'glyphicon glyphicon-remove',
            error: 'glyphicon glyphicon-warning-sign'
        }
    };


    QueryBuilder.plugins = {};

    /**
     * Define a new plugin
     * @param {string}
     * @param {function}
     */
    QueryBuilder.define = function(name, fct) {
        QueryBuilder.plugins[name] = fct;
    };

    /**
     * Add new methods
     * @param {object}
     */
    QueryBuilder.extend = function(methods) {
        $.extend(QueryBuilder.prototype, methods);
    };

    /**
     * Init plugins for an instance
     */
    QueryBuilder.prototype.initPlugins = function() {
        if (!this.settings.plugins) {
            return;
        }

        var that = this,
            queue = {};

        if ($.isArray(this.settings.plugins)) {
            $.each(this.settings.plugins, function(i, plugin) {
                queue[plugin] = {};
            });
        }
        else {
            $.each(this.settings.plugins, function(plugin, options) {
                queue[plugin] = options;
            });
        }

        $.each(queue, function(plugin, options) {
            if (plugin in QueryBuilder.plugins) {
                QueryBuilder.plugins[plugin].call(that, options);
            }
            else {
                $.error('Unable to find plugin "' + plugin +'"');
            }
        });
    };


    /**
     * Init the builder
     */
    QueryBuilder.prototype.init = function(options) {
        // PROPERTIES
        this.settings = $.extendext(true, 'replace', {}, QueryBuilder.DEFAULTS, options);
        this.status = {
            group_id: 0,
            rule_id: 0,
            generatedId: false,
            has_optgroup: false
        };

        // "allow_groups" changed in 1.3.1 from boolean to int
        if (this.settings.allow_groups === false) {
            this.settings.allow_groups = 0;
        }
        else if (this.settings.allow_groups === true) {
            this.settings.allow_groups = -1;
        }

        this.filters = this.settings.filters;
        this.lang = this.settings.lang;
        this.icons = this.settings.icons;
        this.operators = this.settings.operators;
        this.template = this.settings.template;

        if (this.template.group === null) {
            this.template.group = this.getGroupTemplate;
        }
        if (this.template.rule === null) {
            this.template.rule = this.getRuleTemplate;
        }

        // CHECK FILTERS
        if (!this.filters || this.filters.length < 1) {
            $.error('Missing filters list');
        }
        this.checkFilters();

        // ensure we have a container id
        if (!this.$el.attr('id')) {
            this.$el.attr('id', 'qb_'+Math.floor(Math.random()*99999));
            this.status.generatedId = true;
        }
        this.$el_id = this.$el.attr('id');

        this.$el.addClass('query-builder');

        // INIT
        this.bindEvents();

        this.initPlugins();

        this.trigger('afterInit');

        if (options.rules) {
            this.setRules(options.rules);
        }
        else {
            this.addGroup(this.$el);
        }
    };

    /**
     * Destroy the plugin
     */
    QueryBuilder.prototype.destroy = function() {
        this.trigger('beforeDestroy');

        if (this.status.generatedId) {
            this.$el.removeAttr('id');
        }

        this.$el.empty()
            .off('click.queryBuilder change.queryBuilder')
            .removeClass('query-builder')
            .removeData('queryBuilder');
    };

    /**
     * Reset the plugin
     */
    QueryBuilder.prototype.reset = function() {
        this.status.group_id = 1;
        this.status.rule_id = 0;

        this.$el.find('>.rules-group-container>.rules-group-body>.rules-list').empty();

        this.addRule(this.$el.find('>.rules-group-container'));

        this.trigger('afterReset');
    };

    /**
     * Clear the plugin
     */
    QueryBuilder.prototype.clear = function() {
        this.status.group_id = 0;
        this.status.rule_id = 0;

        this.$el.empty();

        this.trigger('afterClear');
    };

    /**
     * Get an object representing current rules
     * @return {object}
     */
    QueryBuilder.prototype.getRules = function() {
        this.clearErrors();

        var $group = this.$el.find('>.rules-group-container'),
            that = this;

        var rules = (function parse($group) {
            var out = {},
                $elements = $group.find('>.rules-group-body>.rules-list>*');

            out.condition = that.getGroupCondition($group);
            out.rules = [];

            for (var i=0, l=$elements.length; i<l; i++) {
                var $rule = $elements.eq(i),
                    rule;

                if ($rule.hasClass('rule-container')) {
                    var filterId = that.getRuleFilter($rule);

                    if (filterId == '-1') {
                        that.triggerValidationError(['no_filter'], $rule, null, null, null);
                        return {};
                    }

                    var filter = that.getFilterById(filterId),
                        operator = that.getOperatorByType(that.getRuleOperator($rule)),
                        value = null;

                    if (operator.accept_values !== 0) {
                        value = that.getRuleValue($rule, filter, operator);

                        var valid = that.validateValue($rule, value, filter, operator);
                        if (valid !== true) {
                            that.triggerValidationError(valid, $rule, value, filter, operator);
                            return {};
                        }
                    }

                    rule = {
                        id: filter.id,
                        field: filter.field,
                        type: filter.type,
                        input: filter.input,
                        operator: operator.type,
                        value: value
                    };

                    out.rules.push(rule);
                }
                else {
                    rule = parse($rule);
                    if (!$.isEmptyObject(rule)) {
                        out.rules.push(rule);
                    }
                    else {
                        return {};
                    }
                }
            }

            if (out.rules.length === 0 && (!that.settings.allow_empty || $group.data('queryBuilder').level > 1)) {
                that.triggerValidationError(['empty_group'], $group, null, null, null);
                return {};
            }

            return out;
        }($group));

        return this.change('getRules', rules);
    };

    /**
     * Set rules from object
     * @param data {object}
     */
    QueryBuilder.prototype.setRules = function(data) {
        this.clear();

        if (!data || !data.rules || (data.rules.length===0 && !this.settings.allow_empty)) {
            $.error('Incorrect data object passed');
        }

        data = this.change('setRules', data);

        var $container = this.$el,
            that = this;

        (function add(data, $container){
            var $group = that.addGroup($container, false);
            if ($group === null) {
                return;
            }

            var $buttons = $group.find('>.rules-group-header [name$=_cond]');

            if (data.condition === undefined) {
                data.condition = that.settings.default_condition;
            }

            for (var i=0, l=that.settings.conditions.length; i<l; i++) {
                var cond = that.settings.conditions[i];
                $buttons.filter('[value='+ cond +']').prop('checked', data.condition.toUpperCase() == cond.toUpperCase());
            }
            $buttons.trigger('change');

            $.each(data.rules, function(i, rule) {
                if (rule.rules && rule.rules.length>0) {
                    if (that.settings.allow_groups !== -1 && that.settings.allow_groups < $group.data('queryBuilder').level) {
                        that.reset();
                        $.error(fmt('No more than {0} groups are allowed', that.settings.allow_groups));
                    }
                    else {
                        add(rule, $group);
                    }
                }
                else {
                    if (rule.id === undefined) {
                        $.error('Missing rule field id');
                    }
                    if (rule.value === undefined) {
                        rule.value = '';
                    }
                    if (rule.operator === undefined) {
                        rule.operator = 'equal';
                    }

                    var $rule = that.addRule($group);
                    if ($rule === null) {
                        return;
                    }

                    var filter = that.getFilterById(rule.id),
                        operator = that.getOperatorByType(rule.operator);

                    $rule.find('.rule-filter-container [name$=_filter]').val(rule.id).trigger('change');
                    $rule.find('.rule-operator-container [name$=_operator]').val(rule.operator).trigger('change');

                    if (operator.accept_values !== 0) {
                        that.setRuleValue($rule, rule.value, filter, operator);
                    }

                    that.applyRuleFlags($rule, rule);
                }
            });

        }(data, $container));
    };


    /**
     * Checks the configuration of each filter
     */
    QueryBuilder.prototype.checkFilters = function() {
        var definedFilters = [],
            that = this;

        $.each(this.filters, function(i, filter) {
            if (!filter.id) {
                $.error('Missing filter id: '+ i);
            }
            if (definedFilters.indexOf(filter.id) != -1) {
                $.error('Filter already defined: '+ filter.id);
            }
            definedFilters.push(filter.id);

            if (!filter.type) {
                $.error('Missing filter type: '+ filter.id);
            }
            if (types.indexOf(filter.type) == -1) {
                $.error('Invalid type: '+ filter.type);
            }

            if (!filter.input) {
                filter.input = 'text';
            }
            else if (typeof filter.input != 'function' && inputs.indexOf(filter.input) == -1) {
                $.error('Invalid input: '+ filter.input);
            }

            if (!filter.field) {
                filter.field = filter.id;
            }
            if (!filter.label) {
                filter.label = filter.field;
            }

            that.status.has_optgroup|= !!filter.optgroup;
            if (!filter.optgroup) {
                filter.optgroup = null;
            }

            switch (filter.type) {
                case 'string':
                    filter.internalType = 'string';
                    break;
                case 'integer': case 'double':
                    filter.internalType = 'number';
                    break;
                case 'date': case 'time': case 'datetime':
                    filter.internalType = 'datetime';
                    break;
                case 'boolean':
                    filter.internalType = 'boolean';
                    break;
            }

            switch (filter.input) {
                case 'radio': case 'checkbox':
                    if (!filter.values || filter.values.length < 1) {
                        $.error('Missing values for filter: '+ filter.id);
                    }
                    break;
            }
        });

        // group filters with same optgroup, preserving declaration order when possible
        if (this.status.has_optgroup) {
            var optgroups = [],
                filters = [];

            $.each(this.filters, function(i, filter) {
                var idx;

                if (filter.optgroup) {
                    idx = optgroups.lastIndexOf(filter.optgroup);

                    if (idx == -1) {
                        idx = optgroups.length;
                    }
                }
                else {
                    idx = optgroups.length;
                }

                optgroups.splice(idx, 0, filter.optgroup);
                filters.splice(idx, 0, filter);
            });

            this.filters = filters;
        }

        this.trigger('afterCheckFilters');
    };

    /**
     * Add all events listeners
     */
    QueryBuilder.prototype.bindEvents = function() {
        var that = this;

        // group condition change
        this.$el.on('change.queryBuilder', '.rules-group-header [name$=_cond]', function() {
            var $this = $(this);

            if ($this.is(':checked')) {
                $this.parent().addClass('active').siblings().removeClass('active');
            }
        });

        // rule filter change
        this.$el.on('change.queryBuilder', '.rule-filter-container [name$=_filter]', function() {
            var $this = $(this),
                $rule = $this.closest('.rule-container');

            that.updateRuleFilter($rule, $this.val());
        });

        // rule operator change
        this.$el.on('change.queryBuilder', '.rule-operator-container [name$=_operator]', function() {
            var $this = $(this),
                $rule = $this.closest('.rule-container');

            that.updateRuleOperator($rule, $this.val());
        });

        // add rule button
        this.$el.on('click.queryBuilder', '[data-add=rule]', function() {
            var $this = $(this),
                $group = $this.closest('.rules-group-container');

            that.addRule($group);
        });

        // delete rule button
        this.$el.on('click.queryBuilder', '[data-delete=rule]', function() {
            var $this = $(this),
                $rule = $this.closest('.rule-container');

            that.deleteRule($rule);
        });

        if (this.settings.allow_groups !== 0) {
            // add group button
            this.$el.on('click.queryBuilder', '[data-add=group]', function() {
                var $this = $(this),
                    $group = $this.closest('.rules-group-container');

                that.addGroup($group);
            });

            // delete group button
            this.$el.on('click.queryBuilder', '[data-delete=group]', function() {
                var $this = $(this),
                    $group = $this.closest('.rules-group-container');

                that.deleteGroup($group);
            });
        }
    };

    /**
     * Add a new rules group
     * @param $parent {jQuery}
     * @param addRule {bool} (optional - add a default empty rule)
     * @return $group {jQuery}
     */
    QueryBuilder.prototype.addGroup = function($parent, addRule) {
        var group_id = this.nextGroupId(),
            level = (($parent.data('queryBuilder') || {}).level || 0) + 1,
            $container = level===1 ? $parent : $parent.find('>.rules-group-body>.rules-list'),
            $group = $(this.template.group.call(this, group_id, level));

        $group.data('queryBuilder', {level:level});

        var e = $.Event('addGroup.queryBuilder', {
            group_id: group_id,
            level: level,
            addRule: addRule,
            group: $group,
            parent: $parent,
            builder: this
        });

        this.$el.trigger(e);

        if (e.isDefaultPrevented()) {
            return null;
        }

        $container.append($group);

        if (this.settings.onAfterAddGroup) {
            this.settings.onAfterAddGroup.call(this, $group);
        }

        this.trigger('afterAddGroup', $group);

        if (addRule === undefined || addRule === true) {
            this.addRule($group);
        }

        return $group;
    };

    /**
     * Tries to delete a group. The group is not deleted if at least one rule is no_delete.
     * @param $group {jQuery}
     * @return {boolean} true if the group has been deleted
     */
    QueryBuilder.prototype.deleteGroup = function($group) {
        if ($group[0].id == this.$el_id + '_group_0') {
            return;
        }

        var e = $.Event('deleteGroup.queryBuilder', {
            group_id: $group[0].id,
            group: $group,
            builder: this
        });

        this.$el.trigger(e);

        if (e.isDefaultPrevented()) {
            return false;
        }

        this.trigger('beforeDeleteGroup', $group);

        var that = this,
            keepGroup = false;

        $group.find('>.rules-group-body>.rules-list>*').each(function() {
            var $element = $(this);

            if ($element.hasClass('rule-container')) {
                if ($element.data('queryBuilder').flags.no_delete) {
                    keepGroup = true;
                }
                else {
                    $element.remove();
                }
            }
            else {
                keepGroup|= !that.deleteGroup($element);
            }
        });

        if (!keepGroup) {
            $group.remove();
        }

        return !keepGroup;
    };

    /**
     * Add a new rule
     * @param $parent {jQuery}
     * @return $rule {jQuery}
     */
    QueryBuilder.prototype.addRule = function($parent) {
        var rule_id = this.nextRuleId(),
            $container = $parent.find('>.rules-group-body>.rules-list'),
            $rule = $(this.template.rule.call(this, rule_id)),
            $filterSelect = $(this.getRuleFilterSelect(rule_id));

        $rule.data('queryBuilder', {flags: {}});

        var e = $.Event('addRule.queryBuilder', {
            rule_id: rule_id,
            rule: $rule,
            parent: $parent,
            builder: this
        });

        this.$el.trigger(e);

        if (e.isDefaultPrevented()) {
            return null;
        }

        $container.append($rule);
        $rule.find('.rule-filter-container').append($filterSelect);

        if (this.settings.onAfterAddRule) {
            this.settings.onAfterAddRule.call(this, $rule);
        }

        this.trigger('afterAddRule', $rule);

        return $rule;
    };

    /**
     * Delete a rule.
     * @param $rule {jQuery}
     * @return {boolean} true if the rule has been deleted
     */
    QueryBuilder.prototype.deleteRule = function($rule) {
        var e = $.Event('deleteRule.queryBuilder', {
            rule_id: $rule[0].id,
            rule: $rule,
            builder: this
        });

        this.$el.trigger(e);

        if (e.isDefaultPrevented()) {
            return false;
        }

        this.trigger('beforeDeleteRule', $rule);

        $rule.remove();
        return true;
    };

    /**
     * Create operators <select> for a rule
     * @param $rule {jQuery} (<li> element)
     * @param filter {object}
     */
    QueryBuilder.prototype.createRuleOperators = function($rule, filter) {
        var $operatorContainer = $rule.find('.rule-operator-container').empty();

        if (filter === null) {
            return;
        }

        var operators = this.getOperators(filter),
            $operatorSelect = $(this.getRuleOperatorSelect($rule.attr('id'), operators));

        $operatorContainer.html($operatorSelect);

        $rule.data('queryBuilder').operator = operators[0];

        this.trigger('afterCreateRuleOperators', $rule, filter, operators);
    };

    /**
     * Create main <input> for a rule
     * @param $rule {jQuery} (<li> element)
     * @param filter {object}
     */
    QueryBuilder.prototype.createRuleInput = function($rule, filter) {
        var $valueContainer = $rule.find('.rule-value-container').empty();

        if (filter === null) {
            return;
        }

        var operator = this.getOperatorByType(this.getRuleOperator($rule));

        if (operator.accept_values === 0) {
            return;
        }

        var $inputs = $();

        for (var i=0; i<operator.accept_values; i++) {
            var $ruleInput = $(this.getRuleInput($rule, filter, i));
            if (i > 0) $valueContainer.append(' , ');
            $valueContainer.append($ruleInput);
            $inputs = $inputs.add($ruleInput);
        }

        $valueContainer.show();

        if (filter.onAfterCreateRuleInput) {
            filter.onAfterCreateRuleInput.call(this, $rule, filter);
        }

        if (filter.plugin) {
            $inputs[filter.plugin](filter.plugin_config || {});
        }

        if (filter.default_value !== undefined) {
            this.setRuleValue($rule, filter.default_value, filter, operator);
        }

        this.trigger('afterCreateRuleInput', $rule, filter, operator);
    };

    /**
     * Perform action when rule's filter is changed
     * @param $rule {jQuery} (<li> element)
     * @param filterId {string}
     */
    QueryBuilder.prototype.updateRuleFilter = function($rule, filterId) {
        var filter = filterId != '-1' ? this.getFilterById(filterId) : null;

        this.createRuleOperators($rule, filter);
        this.createRuleInput($rule, filter);

        $rule.data('queryBuilder').filter = filter;

        this.trigger('afterUpdateRuleFilter', $rule, filter);
    };

    /**
     * Update main <input> visibility when rule operator changes
     * @param $rule {jQuery} (<li> element)
     * @param operatorType {string}
     */
    QueryBuilder.prototype.updateRuleOperator = function($rule, operatorType) {
        var $valueContainer = $rule.find('.rule-value-container'),
            filter = this.getFilterById(this.getRuleFilter($rule)),
            operator = this.getOperatorByType(operatorType);

        if (operator.accept_values === 0) {
            $valueContainer.hide();
        }
        else {
            $valueContainer.show();

            var previousOperator = $rule.data('queryBuilder').operator;

            if ($valueContainer.is(':empty') || operator.accept_values != previousOperator.accept_values) {
                this.createRuleInput($rule, filter);
            }
        }

        $rule.data('queryBuilder').operator = operator;

        if (filter.onAfterChangeOperator) {
            filter.onAfterChangeOperator.call(this, $rule, filter, operator);
        }

        this.trigger('afterChangeOperator', $rule, filter, operator);
    };

    /**
     * Check if a value is correct for a filter
     * @param $rule {jQuery} (<li> element)
     * @param value {string|string[]|undefined}
     * @param filter {object}
     * @param operator {object}
     * @return {array|true}
     */
    QueryBuilder.prototype.validateValue = function($rule, value, filter, operator) {
        var validation = filter.validation || {},
            result = true;

        if (operator.accept_values == 1) {
            value = [value];
        }
        else {
            value = value;
        }

        if (validation.callback) {
            result = validation.callback.call(this, value, filter, operator, $rule);
            return this.change('validateValue', result, $rule, value, filter, operator);
        }

        for (var i=0; i<operator.accept_values; i++) {
            switch (filter.input) {
                case 'radio':
                    if (value[i] === undefined) {
                        result = ['radio_empty'];
                        break;
                    }
                    break;

                case 'checkbox':
                    if (value[i].length === 0) {
                        result = ['checkbox_empty'];
                        break;
                    }
                    break;

                case 'select':
                    if (filter.multiple) {
                        if (value[i].length === 0) {
                            result = ['select_empty'];
                            break;
                        }
                    }
                    else {
                        if (value[i] === undefined) {
                            result = ['select_empty'];
                            break;
                        }
                    }
                    break;

                default:
                    switch (filter.internalType) {
                        case 'string':
                            if (validation.min !== undefined) {
                                if (value[i].length < validation.min) {
                                    result = ['string_exceed_min_length', validation.min];
                                    break;
                                }
                            }
                            else if (value[i].length === 0) {
                                result = ['string_empty'];
                                break;
                            }
                            if (validation.max !== undefined) {
                                if (value[i].length > validation.max) {
                                    result = ['string_exceed_max_length', validation.max];
                                    break;
                                }
                            }
                            if (validation.format) {
                                if (!(validation.format.test(value[i]))) {
                                    result = ['string_invalid_format', validation.format];
                                    break;
                                }
                            }
                            break;

                        case 'number':
                            if (isNaN(value[i])) {
                                result = ['number_nan'];
                                break;
                            }
                            if (filter.type == 'integer') {
                                if (parseInt(value[i]) != value[i]) {
                                    result = ['number_not_integer'];
                                    break;
                                }
                            }
                            else {
                                if (parseFloat(value[i]) != value[i]) {
                                    result = ['number_not_double'];
                                    break;
                                }
                            }
                            if (validation.min !== undefined) {
                                if (value[i] < validation.min) {
                                    result = ['number_exceed_min', validation.min];
                                    break;
                                }
                            }
                            if (validation.max !== undefined) {
                                if (value[i] > validation.max) {
                                    result = ['number_exceed_max', validation.max];
                                    break;
                                }
                            }
                            if (validation.step !== undefined) {
                                var v = value[i]/validation.step;
                                if (parseInt(v) != v) {
                                    result = ['number_wrong_step', validation.step];
                                    break;
                                }
                            }
                            break;

                        case 'datetime':
                            // we need MomentJS
                            if (window.moment && validation.format) {
                                var datetime = moment(value[i], validation.format);
                                if (!datetime.isValid()) {
                                    result = ['datetime_invalid'];
                                    break;
                                }
                                else {
                                    if (validation.min) {
                                        if (datetime < moment(validation.min, validation.format)) {
                                            result = ['datetime_exceed_min', validation.min];
                                            break;
                                        }
                                    }
                                    if (validation.max) {
                                        if (datetime > moment(validation.max, validation.format)) {
                                            result = ['datetime_exceed_max', validation.max];
                                            break;
                                        }
                                    }
                                }
                            }
                            break;

                        case 'boolean':
                            if (value[i].trim().toLowerCase() !== 'true' && value[i].trim().toLowerCase() !== 'false' &&
                                value[i].trim() !== '1' && value[i].trim() !== '0' && value[i] !== 1 && value[i] !== 0) {
                                result = ['boolean_not_valid'];
                                break;
                            }
                    }
            }

            if (result !== true) {
                break;
            }
        }

        return this.change('validateValue', result, $rule, value, filter, operator);
    };

    /**
     * Remove 'has-error' from everything
     */
    QueryBuilder.prototype.clearErrors = function() {
        this.$el.find('.has-error').removeClass('has-error');
    };

    /**
     * Trigger a validation error event with custom params
     * @param error {array}
     * @param $target {jQuery}
     * @param value {mixed}
     * @param filter {object}
     * @param operator {object}
     */
    QueryBuilder.prototype.triggerValidationError = function(error, $target, value, filter, operator) {
        if (!$.isArray(error)) {
            error = [error];
        }

        if (filter && filter.onValidationError) {
            filter.onValidationError.call(this, $target, error, value, filter, operator);
        }
        if (this.settings.onValidationError) {
            this.settings.onValidationError.call(this, $target, error, value, filter, operator);
        }

        var e = $.Event('validationError.queryBuilder', {
            error: error,
            filter: filter,
            operator: operator,
            value: value,
            targetRule: $target[0],
            builder: this
        });

        this.$el.trigger(e);

        if (this.settings.display_errors && !e.isDefaultPrevented()) {
            // translate the text without modifying event array
            var errorLoc = $.extend([], error, [
                this.lang.errors[error[0]] || error[0]
            ]);

            $target.addClass('has-error');
            var $error = $target.find('.error-container').eq(0);
            $error.attr('title', fmt.apply(null, errorLoc));
        }

        this.trigger('validationError', $target, error);
    };


    /**
     * Returns an incremented group ID
     * @return {string}
     */
    QueryBuilder.prototype.nextGroupId = function() {
        return this.$el_id + '_group_' + (this.status.group_id++);
    };

    /**
     * Returns an incremented rule ID
     * @return {string}
     */
    QueryBuilder.prototype.nextRuleId = function() {
        return this.$el_id + '_rule_' + (this.status.rule_id++);
    };

    /**
     * Returns the operators for a filter
     * @param filter {string|object} (filter id name or filter object)
     * @return {object[]}
     */
    QueryBuilder.prototype.getOperators = function(filter) {
        if (typeof filter === 'string') {
            filter = this.getFilterById(filter);
        }

        var result = [];

        for (var i=0, l=this.operators.length; i<l; i++) {
            // filter operators check
            if (filter.operators) {
                if (filter.operators.indexOf(this.operators[i].type) == -1) {
                    continue;
                }
            }
            // type check
            else if (this.operators[i].apply_to.indexOf(filter.internalType) == -1) {
                continue;
            }

            result.push(this.operators[i]);
        }

        // keep sort order defined for the filter
        if (filter.operators) {
            result.sort(function(a, b) {
                return filter.operators.indexOf(a.type) - filter.operators.indexOf(b.type);
            });
        }

        return this.change('getOperators', result, filter);
    };

    /**
     * Returns a particular filter by its id
     * @param filterId {string}
     * @return {object}
     */
    QueryBuilder.prototype.getFilterById = function(filterId) {
        for (var i=0, l=this.filters.length; i<l; i++) {
            if (this.filters[i].id == filterId) {
                return this.filters[i];
            }
        }

        $.error('Undefined filter: '+ filterId);
    };

    /**
     * Return a particular operator by its type
     * @param type {string}
     * @return {object}
     */
    QueryBuilder.prototype.getOperatorByType = function(type) {
        for (var i=0, l=this.operators.length; i<l; i++) {
            if (this.operators[i].type == type) {
                return this.operators[i];
            }
        }

        $.error('Undefined operator: '+ type);
    };

    /**
     * Returns the selected condition of a group
     * @param $group {jQuery} (<dl> element)
     * @return {string}
     */
    QueryBuilder.prototype.getGroupCondition = function($group) {
        return $group.find('>.rules-group-header [name$=_cond]:checked').val();
    };

    /**
     * Returns the selected filter of a rule
     * @param $rule {jQuery} (<li> element)
     * @return {string}
     */
    QueryBuilder.prototype.getRuleFilter = function($rule) {
        return $rule.find('.rule-filter-container [name$=_filter]').val();
    };

    /**
     * Returns the selected operator of a rule
     * @param $rule {jQuery} (<li> element)
     * @return {string}
     */
    QueryBuilder.prototype.getRuleOperator = function($rule) {
        return $rule.find('.rule-operator-container [name$=_operator]').val();
    };

    /**
     * Returns rule value
     * @param $rule {jQuery} (<li> element)
     * @param filter {object} (optional - current rule filter)
     * @param operator {object} (optional - current rule operator)
     * @return {string|string[]|undefined}
     */
    QueryBuilder.prototype.getRuleValue = function($rule, filter, operator) {
        filter = filter || this.getFilterById(this.getRuleFilter($rule));
        operator = operator || this.getOperatorByType(this.getRuleOperator($rule));

        var value = [], tmp,
            $value = $rule.find('.rule-value-container');

        for (var i=0; i<operator.accept_values; i++) {
            var name = $rule[0].id + '_value_' + i;

            switch (filter.input) {
                case 'radio':
                    value.push($value.find('[name='+ name +']:checked').val());
                    break;

                case 'checkbox':
                    tmp = [];
                    $value.find('[name='+ name +']:checked').each(function() {
                        tmp.push($(this).val());
                    });
                    value.push(tmp);
                    break;

                case 'select':
                    if (filter.multiple) {
                        tmp = [];
                        $value.find('[name='+ name +'] option:selected').each(function() {
                            tmp.push($(this).val());
                        });
                        value.push(tmp);
                    }
                    else {
                        value.push($value.find('[name='+ name +'] option:selected').val());
                    }
                    break;

                default:
                    value.push($value.find('[name='+ name +']').val());
            }
        }

        if (operator.accept_values == 1) {
            value = value[0];
        }

        if (filter.valueParser) {
            value = filter.valueParser.call(this, $rule, value, filter, operator);
        }

        return this.change('getRuleValue', value, $rule, filter, operator);
    };

    /**
     * Sets the value of a rule.
     * @param $rule {jQuery} (<li> element)
     * @param value {mixed}
     * @param filter {object}
     * @param operator {object}
     */
    QueryBuilder.prototype.setRuleValue = function($rule, value, filter, operator) {
        filter = filter || this.getFilterById(this.getRuleFilter($rule));
        operator = operator || this.getOperatorByType(this.getRuleOperator($rule));

        this.trigger('beforeSetRuleValue', $rule, value, filter, operator);

        if (filter.valueSetter) {
            filter.valueSetter.call(this, $rule, value, filter, operator);
        }
        else {
            var $value = $rule.find('.rule-value-container');

            if (operator.accept_values == 1) {
                value = [value];
            }
            else {
                value = value;
            }

            for (var i=0; i<operator.accept_values; i++) {
                var name = $rule[0].id +'_value_'+ i;

                switch (filter.input) {
                    case 'radio':
                        $value.find('[name='+ name +'][value="'+ value[i] +'"]').prop('checked', true).trigger('change');
                        break;

                    case 'checkbox':
                        if (!$.isArray(value[i])) {
                            value[i] = [value[i]];
                        }
                        $.each(value[i], function(i, value) {
                            $value.find('[name='+ name +'][value="'+ value +'"]').prop('checked', true).trigger('change');
                        });
                        break;

                    default:
                        $value.find('[name='+ name +']').val(value[i]).trigger('change');
                        break;
                }
            }
        }

        this.trigger('afterSetRuleValue', $rule, value, filter, operator);

        if (filter.onAfterSetValue) {
            filter.onAfterSetValue.call(this, $rule, value, filter, operator);
        }
    };

    /**
     * Change rules properties depending on flags.
     * @param $rule {jQuery} (<li> element)
     * @param rule {object}
     */
    QueryBuilder.prototype.applyRuleFlags = function($rule, rule) {
        var flags = this.getRuleFlags(rule);
        $rule.data('queryBuilder').flags = flags;

        if (flags.filter_readonly) {
            $rule.find('[name$=_filter]').prop('disabled', true);
        }
        if (flags.operator_readonly) {
            $rule.find('[name$=_operator]').prop('disabled', true);
        }
        if (flags.value_readonly) {
            $rule.find('[name*=_value_]').prop('disabled', true);
        }
        if (flags.no_delete) {
            $rule.find('[data-delete=rule]').remove();
        }

        this.trigger('afterApplyRuleFlags', $rule, rule, flags);
    };


    /**
     * Returns group HTML
     * @param group_id {string}
     * @param level {int}
     * @return {string}
     */
    QueryBuilder.prototype.getGroupTemplate = function(group_id, level) {
        var h = '\
<dl id="'+ group_id +'" class="rules-group-container"> \
  <dt class="rules-group-header"> \
    <div class="btn-group pull-right group-actions"> \
      <button type="button" class="btn btn-xs btn-success" data-add="rule"> \
        <i class="' + this.icons.add_rule + '"></i> '+ this.lang.add_rule +' \
      </button> \
    '+ (this.settings.allow_groups===-1 || this.settings.allow_groups>=level ?
      '<button type="button" class="btn btn-xs btn-success" data-add="group"> \
        <i class="' + this.icons.add_group + '"></i> '+ this.lang.add_group +' \
      </button>'
    :'') +' \
    '+ (level>1 ?
      '<button type="button" class="btn btn-xs btn-danger" data-delete="group"> \
        <i class="' + this.icons.remove_group + '"></i> '+ this.lang.delete_group +' \
      </button>'
    : '') +' \
    </div> \
    <div class="btn-group group-conditions"> \
      '+ this.getGroupConditions(group_id) +' \
    </div> \
  '+ (this.settings.display_errors ?
    '<div class="error-container" data-toggle="tooltip" data-placement="right"><i class="' + this.icons.error + '"></i></div>'
  :'') +'\
  </dt> \
  <dd class=rules-group-body> \
    <ul class=rules-list></ul> \
  </dd> \
</dl>';

        return this.change('getGroupTemplate', h, level);
    };

    /**
     * Returns group conditions HTML
     * @param group_id {string}
     * @return {string}
     */
    QueryBuilder.prototype.getGroupConditions = function(group_id) {
        var h = '';

        for (var i=0, l=this.settings.conditions.length; i<l; i++) {
            var cond = this.settings.conditions[i],
                active = cond == this.settings.default_condition,
                label = this.lang['condition_'+ cond.toLowerCase()] || cond;

            h+= '\
            <label class="btn btn-xs btn-primary '+ (active?'active':'') +'"> \
              <input type="radio" name="'+ group_id +'_cond" value="'+ cond +'" '+ (active?'checked':'') +'> '+ label +' \
            </label>';
        }

        return this.change('getGroupConditions', h);
    };

    /**
     * Returns rule HTML
     * @param rule_id {string}
     * @return {string}
     */
    QueryBuilder.prototype.getRuleTemplate = function(rule_id) {
        var h = '\
<li id="'+ rule_id +'" class="rule-container"> \
  <div class="rule-header"> \
    <div class="btn-group pull-right rule-actions"> \
      <button type="button" class="btn btn-xs btn-danger" data-delete="rule"> \
        <i class="' + this.icons.remove_rule + '"></i> '+ this.lang.delete_rule +' \
      </button> \
    </div> \
  </div> \
  '+ (this.settings.display_errors ?
    '<div class="error-container"><i class="' + this.icons.error + '"></i></div>'
  :'') +'\
  <div class="rule-filter-container"></div> \
  <div class="rule-operator-container"></div> \
  <div class="rule-value-container"></div> \
</li>';

        return this.change('getRuleTemplate', h);
    };

    /**
     * Returns rule filter <select> HTML
     * @param rule_id {string}
     * @return {string}
     */
    QueryBuilder.prototype.getRuleFilterSelect = function(rule_id) {
        var optgroup = null;

        var h = '<select name="'+ rule_id +'_filter">';
        h+= '<option value="-1">'+ this.lang.filter_select_placeholder +'</option>';

        $.each(this.filters, function(i, filter) {
            if (optgroup != filter.optgroup) {
                if (optgroup !== null) h+= '</optgroup>';
                optgroup = filter.optgroup;
                if (optgroup !== null) h+= '<optgroup label="'+ optgroup +'">';
            }

            h+= '<option value="'+ filter.id +'">'+ filter.label +'</option>';
        });

        if (optgroup !== null) h+= '</optgroup>';
        h+= '</select>';

        return this.change('getRuleFilterSelect', h);
    };

    /**
     * Returns rule operator <select> HTML
     * @param rule_id {string}
     * @param operators {object}
     * @return {string}
     */
    QueryBuilder.prototype.getRuleOperatorSelect = function(rule_id, operators) {
        var h = '<select name="'+ rule_id +'_operator">';

        for (var i=0, l=operators.length; i<l; i++) {
            var label = this.lang.operators[operators[i].type] || operators[i].type;
            h+= '<option value="'+ operators[i].type +'">'+ label +'</option>';
        }

        h+= '</select>';

        return this.change('getRuleOperatorSelect', h);
    };

    /**
     * Return the rule value HTML
     * @param $rule {jQuery}
     * @param filter {object}
     * @param value_id {int}
     * @return {string}
     */
    QueryBuilder.prototype.getRuleInput = function($rule, filter, value_id) {
        var validation = filter.validation || {},
            name = $rule[0].id +'_value_'+ value_id,
            h = '', c;

        if (typeof filter.input === 'function') {
            h = filter.input.call(this, $rule, filter, name);
        }
        else {
            switch (filter.input) {
                case 'radio':
                    c = filter.vertical ? ' class=block' : '';
                    iterateOptions(filter.values, function(key, val) {
                        h+= '<label'+ c +'><input type="radio" name="'+ name +'" value="'+ key +'"> '+ val +'</label> ';
                    });
                    break;

                case 'checkbox':
                    c = filter.vertical ? ' class=block' : '';
                    iterateOptions(filter.values, function(key, val) {
                        h+= '<label'+ c +'><input type="checkbox" name="'+ name +'" value="'+ key +'"> '+ val +'</label> ';
                    });
                    break;

                case 'select':
                    h+= '<select name="'+ name +'"'+ (filter.multiple ? ' multiple' : '') +'>';
                    iterateOptions(filter.values, function(key, val) {
                        h+= '<option value="'+ key +'"> '+ val +'</option> ';
                    });
                    h+= '</select>';
                    break;

                case 'textarea':
                    h+= '<textarea name="'+ name +'"';
                    if (filter.size) h+= ' cols="'+ filter.size +'"';
                    if (filter.rows) h+= ' rows="'+ filter.rows +'"';
                    if (validation.min !== undefined) h+= ' minlength="'+ validation.min +'"';
                    if (validation.max !== undefined) h+= ' maxlength="'+ validation.max +'"';
                    if (filter.placeholder) h+= ' placeholder="'+ filter.placeholder +'"';
                    h+= '></textarea>';
                    break;

                default:
                    switch (filter.internalType) {
                        case 'number':
                            h+= '<input type="number" name="'+ name +'"';
                            if (validation.step !== undefined) h+= ' step="'+ validation.step +'"';
                            if (validation.min !== undefined) h+= ' min="'+ validation.min +'"';
                            if (validation.max !== undefined) h+= ' max="'+ validation.max +'"';
                            if (filter.placeholder) h+= ' placeholder="'+ filter.placeholder +'"';
                            if (filter.size) h+= ' size="'+ filter.size +'"';
                            h+= '>';
                            break;

                        default:
                            h+= '<input type="text" name="'+ name +'"';
                            if (filter.placeholder) h+= ' placeholder="'+ filter.placeholder +'"';
                            if (filter.type === 'string' && validation.min !== undefined) h+= ' minlength="'+ validation.min +'"';
                            if (filter.type === 'string' && validation.max !== undefined) h+= ' maxlength="'+ validation.max +'"';
                            if (filter.size) h+= ' size="'+ filter.size +'"';
                            h+= '>';
                    }
            }
        }

        return this.change('getRuleInput', h, $rule, filter, name);
    };

    /**
     * Clean rule flags.
     * @param rule {object}
     * @return {object}
     */
    QueryBuilder.prototype.getRuleFlags = function(rule) {
        var flags = $.extend({}, this.settings.default_rule_flags);

        if (rule.readonly) {
            $.extend(flags, {
                filter_readonly: true,
                operator_readonly: true,
                value_readonly: true,
                no_delete: true
            });
        }

        if (rule.flags) {
           $.extend(flags, rule.flags);
        }

        return this.change('getRuleFlags', flags, rule);
    };


    $.fn.queryBuilder = function(option) {
        if (this.length > 1) {
            $.error('Unable to initialize on multiple target');
        }

        var data = this.data('queryBuilder'),
            options = (typeof option == 'object' && option) || {};

        if (!data && option == 'destroy') {
            return this;
        }
        if (!data) {
            this.data('queryBuilder', new QueryBuilder(this, options));
        }
        if (typeof option == 'string') {
            return data[option].apply(data, Array.prototype.slice.call(arguments, 1));
        }

        return this;
    };

    $.fn.queryBuilder.defaults = {
        set: function(options) {
            $.extendext(true, 'replace', QueryBuilder.DEFAULTS, options);
        },
        get: function(key) {
            var options = QueryBuilder.DEFAULTS;
            if (key) {
                options = options[key];
            }
            return $.extend(true, {}, options);
        }
    };

    $.fn.queryBuilder.constructor = QueryBuilder;
    $.fn.queryBuilder.extend = QueryBuilder.extend;
    $.fn.queryBuilder.define = QueryBuilder.define;


    /**
     * Utility to iterate over radio/checkbox/selection options.
     * it accept three formats: array of values, map, array of 1-element maps
     *
     * @param options {object|array}
     * @param tpl {callable} (takes key and text)
     */
    function iterateOptions(options, tpl) {
        if (options) {
            if ($.isArray(options)) {
                $.each(options, function(index, entry) {
                    // array of one-element maps
                    if ($.isPlainObject(entry)) {
                        $.each(entry, function(key, val) {
                            tpl(key, val);
                            return false; // break after first entry
                        });
                    }
                    // array of values
                    else {
                        tpl(index, entry);
                    }
                });
            }
            // unordered map
            else {
                $.each(options, function(key, val) {
                    tpl(key, val);
                });
            }
        }
    }

    /**
     * Replaces {0}, {1}, ... in a string
     * @param str {string}
     * @param args,... {string|int|float}
     * @return {string}
     */
    function fmt(str, args) {
        args = Array.prototype.slice.call(arguments);

        return str.replace(/{([0-9]+)}/g, function(m, i) {
            return args[parseInt(i)+1];
        });
    }


$.fn.queryBuilder.define('bt-selectpicker', function(options) {
        if (!$.fn.selectpicker || !$.fn.selectpicker.Constructor) {
            $.error('Bootstrap Select is required to use "bt-selectpicker" plugin. Get it here: http://silviomoreto.github.io/bootstrap-select');
        }
        
        options = $.extend({
            container: 'body',
            style: 'btn-inverse btn-xs',
            width: 'auto',
            showIcon: false
        }, options || {});

        // init selectpicker on filters
        this.on('afterAddRule', function($rule) {
            $rule.find('.rule-filter-container select').selectpicker(options);
        });

        // init selectpicker on operators
        this.on('afterCreateRuleOperators', function($rule) {
            $rule.find('.rule-operator-container select').selectpicker(options);
        });
    });

$.fn.queryBuilder.define('bt-tooltip-errors', function(options) {
        if (!$.fn.tooltip || !$.fn.tooltip.Constructor || !$.fn.tooltip.Constructor.prototype.fixTitle) {
            $.error('Bootstrap Tooltip is required to use "bt-tooltip-errors" plugin. Get it here: http://getbootstrap.com');
        }
    
        options = $.extend({
            placement: 'right'
        }, options || {});

        // add BT Tooltip data
        this.on('getRuleTemplate', function(h) {
            return h.replace('class="error-container"', 'class="error-container" data-toggle="tooltip"');
        });

        // init/refresh tooltip when title changes
        this.on('validationError', function($target) {
            $target.find('.error-container').eq(0)
              .tooltip(options)
              .tooltip('hide')
              .tooltip('fixTitle');
        });
    });

$.fn.queryBuilder.define('filter-description', function(options) {
        options = $.extend({
            icon: 'glyphicon glyphicon-info-sign',
            mode: 'popover'
        }, options || {});

        /**
         * INLINE
         */
        if (options.mode === 'inline') {
            this.on('afterUpdateRuleFilter', function($rule, filter) {
                var $p = $rule.find('p.filter-description');

                if (!filter || !filter.description) {
                    $p.hide();
                }
                else {
                    if ($p.length === 0) {
                        $p = $('<p class="filter-description"></p>');
                        $p.appendTo($rule);
                    }
                    else {
                        $p.show();
                    }

                    $p.html('<i class="' + options.icon + '"></i> ' + filter.description);
                }
            });
        }
        /**
         * POPOVER
         */
        else if (options.mode === 'popover') {
            if (!$.fn.popover || !$.fn.popover.Constructor || !$.fn.popover.Constructor.prototype.fixTitle) {
                $.error('Bootstrap Popover is required to use "filter-description" plugin. Get it here: http://getbootstrap.com');
            }

            this.on('afterUpdateRuleFilter', function($rule, filter) {
                var $b = $rule.find('button.filter-description');

                if (!filter || !filter.description) {
                    $b.hide();

                    if ($b.data('bs.popover')) {
                        $b.popover('hide');
                    }
                }
                else {
                    if ($b.length === 0) {
                        $b = $('<button type="button" class="btn btn-xs btn-info filter-description" data-toggle="popover"><i class="' + options.icon + '"></i></button>');
                        $b.prependTo($rule.find('.rule-actions'));

                        $b.popover({
                            placement: 'left',
                            container: 'body',
                            html: true
                        });

                        $b.on('mouseout', function() {
                            $b.popover('hide');
                        });
                    }
                    else {
                        $b.show();
                    }

                    $b.data('bs.popover').options.content = filter.description;

                    if ($b.attr('aria-describedby')) {
                        $b.popover('show');
                    }
                }
            });
        }
        /**
         * BOOTBOX
         */
        else if (options.mode === 'bootbox') {
            if (!window.bootbox) {
                $.error('Bootbox is required to use "filter-description" plugin. Get it here: http://bootboxjs.com');
            }

            this.on('afterUpdateRuleFilter', function($rule, filter) {
                var $b = $rule.find('button.filter-description');

                if (!filter || !filter.description) {
                    $b.hide();
                }
                else {
                    if ($b.length === 0) {
                        $b = $('<button type="button" class="btn btn-xs btn-info filter-description"><i class="' + options.icon + '"></i></button>');
                        $b.prependTo($rule.find('.rule-actions'));

                        $b.on('click', function() {
                            bootbox.alert($b.data('description'));
                        });
                    }

                    $b.data('description', filter.description);
                }
            });
        }
    });

$.fn.queryBuilder.defaults.set({
        loopbackOperators: {
            equal:            function(v){ return v[0]; },
            not_equal:        function(v){ return {'neq': v[0]}; },
            in:               function(v){ return {'inq': v}; },
            not_in:           function(v){ return {'nin': v}; },
            less:             function(v){ return {'lt': v[0]}; },
            less_or_equal:    function(v){ return {'lte': v[0]}; },
            greater:          function(v){ return {'gt': v[0]}; },
            greater_or_equal: function(v){ return {'gte': v[0]}; },
            between:          function(v){ return {'between': v}; },
            begins_with:      function(v){ return {'like': '^' + escapeRegExp(v[0])}; },
            not_begins_with:  function(v){ return {'nlike': '^' + escapeRegExp(v[0])}; },
            contains:         function(v){ return {'like': escapeRegExp(v[0])}; },
            not_contains:     function(v){ return {'nlike': escapeRegExp(v[0])}; },
            ends_with:        function(v){ return {'like': escapeRegExp(v[0]) + '$'}; },
            not_ends_with:    function(v){ return {'nlike': escapeRegExp(v[0]) + '$'}; },
            is_empty:         function(v){ return ''; },
            is_not_empty:     function(v){ return {'neq': ''}; },
            is_null:          function(v){ return null; },
            is_not_null:      function(v){ return {'neq': null}; }
        }
    });


    $.fn.queryBuilder.extend({
        /**
         * Get rules as Loopback query
         * @param data {object} (optional) rules
         * @return {object}
         */
        getLoopback: function(data) {
            data = (data===undefined) ? this.getRules() : data;

            var that = this;

            return (function parse(data) {
                if (!data.condition) {
                    data.condition = that.settings.default_condition;
                }
                if (['AND', 'OR'].indexOf(data.condition.toUpperCase()) === -1) {
                    $.error('Unable to build Loopback query with '+ data.condition +' condition');
                }

                if (!data.rules) {
                    return {};
                }

                var parts = [];

                $.each(data.rules, function(i, rule) {
                    if (rule.rules && rule.rules.length>0) {
                        parts.push(parse(rule));
                    }
                    else {
                        var mdb = that.settings.loopbackOperators[rule.operator],
                            ope = that.getOperatorByType(rule.operator),
                            values = [];

                        if (mdb === undefined) {
                            $.error('Loopback operation unknown for operator '+ rule.operator);
                        }

                        if (ope.accept_values) {
                            if (!(rule.value instanceof Array)) {
                                rule.value = [rule.value];
                            }

                            rule.value.forEach(function(v, i) {
                                values.push(changeType(v, rule.type));
                            });
                        }

                        var part = {};
                        part[rule.field] = mdb.call(that, values);
                        parts.push(part);
                    }
                });

                var res = {};
                if (parts.length > 0) {
                    res[ data.condition.toLowerCase() ] = parts;
                }
                return res;
            }(data));
        }
    });


    /**
     * Change type of a value to int, float or boolean
     * @param value {mixed}
     * @param type {string}
     * @return {mixed}
     */
    function changeType(value, type, db) {
        switch (type) {
            case 'integer': return parseInt(value);
            case 'double': return parseFloat(value);
            case 'boolean':
                var bool = value.trim().toLowerCase() === 'true' || value.trim() === '1' || value === 1;
                if (db === 'sql') {
                    return bool ? 1 : 0;
                }
                else {
                    return bool;
                }
                break;
            default: return value;
        }
    }

    /**
     * Escape value for use in regex
     * @param value {string}
     * @return {string}
     */
    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

$.fn.queryBuilder.defaults.set({
        mongoOperators: {
            equal:            function(v){ return v[0]; },
            not_equal:        function(v){ return {'$ne': v[0]}; },
            in:               function(v){ return {'$in': v}; },
            not_in:           function(v){ return {'$nin': v}; },
            less:             function(v){ return {'$lt': v[0]}; },
            less_or_equal:    function(v){ return {'$lte': v[0]}; },
            greater:          function(v){ return {'$gt': v[0]}; },
            greater_or_equal: function(v){ return {'$gte': v[0]}; },
            between:          function(v){ return {'$gte': v[0], '$lte': v[1]}; },
            begins_with:      function(v){ return {'$regex': '^' + escapeRegExp(v[0])}; },
            not_begins_with:  function(v){ return {'$regex': '^(?!' + escapeRegExp(v[0]) + ')'}; },
            contains:         function(v){ return {'$regex': escapeRegExp(v[0])}; },
            not_contains:     function(v){ return {'$regex': '^((?!' + escapeRegExp(v[0]) + ').)*$', '$options': 's'}; },
            ends_with:        function(v){ return {'$regex': escapeRegExp(v[0]) + '$'}; },
            not_ends_with:    function(v){ return {'$regex': '(?<!' + escapeRegExp(v[0]) + ')$'}; },
            is_empty:         function(v){ return ''; },
            is_not_empty:     function(v){ return {'$ne': ''}; },
            is_null:          function(v){ return null; },
            is_not_null:      function(v){ return {'$ne': null}; }
        },

        mongoRuleOperators: {
            $ne: function(v) {
                v = v.$ne;
                return {
                    'val': v,
                    'op': v === null ? 'is_not_null' : (v === '' ? 'is_not_empty' : 'not_equal')
                };
            },
            eq: function(v) {
                return {
                    'val': v,
                    'op': v === null ? 'is_null' : (v === '' ? 'is_empty' : 'equal')
                };
            },
            $regex: function(v) {
                v = v.$regex;
                if (v.slice(0,4) == '^(?!' && v.slice(-1) == ')') {
                    return { 'val': v.slice(4,-1), 'op': 'not_begins_with' };
                }
                else if (v.slice(0,5) == '^((?!' && v.slice(-5) == ').)*$') {
                    return { 'val': v.slice(5,-5), 'op': 'not_contains' };
                }
                else if (v.slice(0,4) == '(?<!' && v.slice(-2) == ')$') {
                    return { 'val': v.slice(4,-2), 'op': 'not_ends_with' };
                }
                else if (v.slice(-1) == '$') {
                    return { 'val': v.slice(0,-1), 'op': 'ends_with' };
                }
                else if (v.slice(0,1) == '^') {
                    return { 'val': v.slice(1), 'op': 'begins_with' };
                }
                else {
                    return { 'val': v, 'op': 'contains' };
                }
            },
            between : function(v) { return {'val': [v.$gte, v.$lte], 'op': 'between'}; },
            $in :     function(v) { return {'val': v.$in, 'op': 'in'}; },
            $nin :    function(v) { return {'val': v.$nin, 'op': 'not_in'}; },
            $lt :     function(v) { return {'val': v.$lt, 'op': 'less'}; },
            $lte :    function(v) { return {'val': v.$lte, 'op': 'less_or_equal'}; },
            $gt :     function(v) { return {'val': v.$gt, 'op': 'greater'}; },
            $gte :    function(v) { return {'val': v.$gte, 'op': 'greater_or_equal'}; }
        }
    });


    $.fn.queryBuilder.extend({
        /**
         * Get rules as MongoDB query
         * @param data {object} (optional) rules
         * @return {object}
         */
        getMongo: function(data) {
            data = (data===undefined) ? this.getRules() : data;

            var that = this;

            return (function parse(data) {
                if (!data.condition) {
                    data.condition = that.settings.default_condition;
                }
                if (['AND', 'OR'].indexOf(data.condition.toUpperCase()) === -1) {
                    $.error('Unable to build MongoDB query with '+ data.condition +' condition');
                }

                if (!data.rules) {
                    return {};
                }

                var parts = [];

                $.each(data.rules, function(i, rule) {
                    if (rule.rules && rule.rules.length>0) {
                        parts.push(parse(rule));
                    }
                    else {
                        var mdb = that.settings.mongoOperators[rule.operator],
                            ope = that.getOperatorByType(rule.operator),
                            values = [];

                        if (mdb === undefined) {
                            $.error('MongoDB operation unknown for operator '+ rule.operator);
                        }

                        if (ope.accept_values) {
                            if (!(rule.value instanceof Array)) {
                                rule.value = [rule.value];
                            }

                            rule.value.forEach(function(v, i) {
                                values.push(changeType(v, rule.type, 'mongo'));
                            });
                        }

                        var part = {};
                        part[rule.field] = mdb.call(that, values);
                        parts.push(part);
                    }
                });

                var res = {};
                if (parts.length > 0) {
                    res[ '$'+data.condition.toLowerCase() ] = parts;
                }
                return res;
            }(data));
        },

        /**
         * Convert MongoDB object to rules
         * @param data {object} query object
         * @return {object}
         */
        getRulesFromMongo: function(data) {
            if (data === undefined || data === null) {
                return null;
            }

            var that = this,
                conditions = ['$and','$or'];

            return (function parse(data) {
                var topKeys = Object.keys(data);

                if (topKeys.length > 1) {
                    $.error('Invalid MongoDB query format.');
                }
                if (conditions.indexOf(topKeys[0].toLowerCase()) === -1) {
                    $.error('Unable to build Rule from MongoDB query with '+ topKeys[0] +' condition');
                }

                var condition = topKeys[0].toLowerCase() === conditions[0] ? 'AND' : 'OR',
                    rules = data[topKeys[0]],
                    parts = [];

                $.each(rules, function(i, rule) {
                    var keys = Object.keys(rule);

                    if (conditions.indexOf(keys[0].toLowerCase()) !== -1) {
                        parts.push(parse(rule));
                    }
                    else {
                        var field = keys[0],
                            value = rule[field];

                        var operator = that.determineMongoOperator(value, field);
                        if (operator === undefined) {
                            $.error('Invalid MongoDB query format.');
                        }

                        var mdbrl = that.settings.mongoRuleOperators[operator];
                        if (mdbrl === undefined) {
                            $.error('JSON Rule operation unknown for operator '+ operator);
                        }

                        var opVal = mdbrl.call(that, value);
                        parts.push({
                            id: that.change('getMongoDBFieldID', field, value),
                            field: field,
                            operator: opVal.op,
                            value: opVal.val
                        });
                    }
                });

                var res = {};
                if (parts.length > 0) {
                    res.condition = condition;
                    res.rules = parts;
                }
                return res;
            }(data));
        },

        /**
         * Find which operator is used in a MongoDB sub-object
         * @param {mixed} value
         * @param {string} field
         * @return {string|undefined}
         */
        determineMongoOperator: function(value, field) {
            if (value !== null && typeof value === 'object') {
                var subkeys = Object.keys(value);

                if (subkeys.length === 1) {
                    return subkeys[0];
                }
                else {
                    if (value.$gte !==undefined && value.$lte !==undefined) {
                        return 'between';
                    }
                    else if (value.$regex !==undefined) { // optional $options
                        return '$regex';
                    }
                    else {
                        return;
                    }
                }
            }
            else {
                return 'eq';
            }
        },

        /**
         * Set rules from MongoDB object
         * @param data {object}
         */
        setRulesFromMongo: function(data) {
            this.setRules(this.getRulesFromMongo(data));
        }
    });


    /**
     * Change type of a value to int, float or boolean
     * @param value {mixed}
     * @param type {string}
     * @return {mixed}
     */
    function changeType(value, type, db) {
        switch (type) {
            case 'integer': return parseInt(value);
            case 'double': return parseFloat(value);
            case 'boolean':
                var bool = value.trim().toLowerCase() === "true" || value.trim() === '1' || value === 1;
                if (db === 'sql') {
                    return bool ? 1 : 0;
                }
                else {
                    return bool;
                }
                break;
            default: return value;
        }
    }

    /**
     * Escape value for use in regex
     * @param value {string}
     * @return {string}
     */
    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

$.fn.queryBuilder.define('sortable', function(options) {
        options = $.extend({
            default_no_sortable: false,
            icon: 'glyphicon glyphicon-sort'
        }, options || {});

        /**
         * Init HTML5 drag and drop
         */
        this.on('afterInit', function() {
            // configure jQuery to use dataTransfer
            $.event.props.push('dataTransfer');

            var placeholder, src,
                that = this;

            // only add "draggable" attribute when hovering drag handle
            // preventing text select bug in Firefox
            this.$el.on('mouseover', '.drag-handle', function() {
                that.$el.find('.rule-container, .rules-group-container').attr('draggable', true);
            });
            this.$el.on('mouseout', '.drag-handle', function() {
                that.$el.find('.rule-container, .rules-group-container').removeAttr('draggable');
            });

            // dragstart: create placeholder and hide current element
            this.$el.on('dragstart', '[draggable]', function(e) {
                e.stopPropagation();

                // notify drag and drop (only dummy text)
                e.dataTransfer.setData('text', 'drag');

                src = $(e.target);

                placeholder = $('<div class="rule-placeholder">&nbsp;</div>');
                placeholder.css('min-height', src.height());
                placeholder.insertAfter(src);

                // Chrome glitch (helper invisible if hidden immediately)
                setTimeout(function() {
                    src.hide();
                }, 0);
            });

            // dragenter: move the placeholder
            this.$el.on('dragenter', '[draggable]', function(e) {
                e.preventDefault();
                e.stopPropagation();

                moveSortableToTarget(placeholder, $(e.target));
            });

            // dragover: prevent glitches
            this.$el.on('dragover', '[draggable]', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });

            // drop: move current element
            this.$el.on('drop', function(e) {
                e.preventDefault();
                e.stopPropagation();

                moveSortableToTarget(src, $(e.target));
            });

            // dragend: show current element and delete placeholder
            this.$el.on('dragend', '[draggable]', function(e) {
                e.preventDefault();
                e.stopPropagation();

                src.show();
                placeholder.remove();

                src = placeholder = null;

                that.$el.find('.rule-container, .rules-group-container').removeAttr('draggable');
            });
        });

        /**
         * Remove drag handle from non-sortable rules
         */
        this.on('getRuleFlags', function(flags) {
            if (flags.no_sortable === undefined) {
                flags.no_sortable = options.default_no_sortable;
            }

            return flags;
        });

        this.on('afterApplyRuleFlags', function($rule, rule, flags) {
            if (flags.no_sortable) {
                $rule.find('.drag-handle').remove();
            }
        });

        /**
         * Modify templates
         */
        this.on('getGroupTemplate', function(h, level) {
            if (level>1) {
                var $h = $(h);
                $h.find('.group-conditions').after('<div class="drag-handle"><i class="' + options.icon + '"></i></div>');
                h = $h.prop('outerHTML');
            }

            return h;
        });

        this.on('getRuleTemplate', function(h) {
            var $h = $(h);
            $h.find('.rule-header').after('<div class="drag-handle"><i class="' + options.icon + '"></i></div>');
            return $h.prop('outerHTML');
        });
    });

    /**
     * Move an element (placeholder or actual object) depending on active target
     */
    function moveSortableToTarget(element, target) {
        var parent;

        // on rule
        parent = target.closest('.rule-container');
        if (parent.length) {
            element.detach().insertAfter(parent);
            return;
        }

        // on group header
        parent = target.closest('.rules-group-header');
        if (parent.length) {
            parent = target.closest('.rules-group-container');
            element.detach().prependTo(parent.find('.rules-list').eq(0));
            return;
        }

        // on group
        parent = target.closest('.rules-group-container');
        if (parent.length) {
            element.detach().appendTo(parent.find('.rules-list').eq(0));
            return;
        }
    }

$.fn.queryBuilder.defaults.set({
        sqlOperators: {
            equal:            '= ?',
            not_equal:        '!= ?',
            in:               { op: 'IN(?)',     list: true, sep: ', ' },
            not_in:           { op: 'NOT IN(?)', list: true, sep: ', ' },
            less:             '< ?',
            less_or_equal:    '<= ?',
            greater:          '> ?',
            greater_or_equal: '>= ?',
            between:          { op: 'BETWEEN ?',   list: true, sep: ' AND ' },
            begins_with:      { op: 'LIKE(?)',     fn: function(v){ return v+'%'; } },
            not_begins_with:  { op: 'NOT LIKE(?)', fn: function(v){ return v+'%'; } },
            contains:         { op: 'LIKE(?)',     fn: function(v){ return '%'+v+'%'; } },
            not_contains:     { op: 'NOT LIKE(?)', fn: function(v){ return '%'+v+'%'; } },
            ends_with:        { op: 'LIKE(?)',     fn: function(v){ return '%'+v; } },
            not_ends_with:    { op: 'NOT LIKE(?)', fn: function(v){ return '%'+v; } },
            is_empty:         '== ""',
            is_not_empty:     '!= ""',
            is_null:          'IS NULL',
            is_not_null:      'IS NOT NULL'
        }
    });


    $.fn.queryBuilder.extend({
        /**
         * Get rules as SQL query
         * @param stmt {false|string} use prepared statements - false, 'question_mark' or 'numbered'
         * @param nl {bool} output with new lines
         * @param data {object} (optional) rules
         * @return {object}
         */
        getSQL: function(stmt, nl, data) {
            data = (data===undefined) ? this.getRules() : data;
            stmt = (stmt===true || stmt===undefined) ? 'question_mark' : stmt;
            nl =   (nl || nl===undefined) ? '\n' : ' ';

            var that = this,
                bind_index = 1,
                bind_params = [];

            var sql = (function parse(data) {
                if (!data.condition) {
                    data.condition = that.settings.default_condition;
                }
                if (['AND', 'OR'].indexOf(data.condition.toUpperCase()) === -1) {
                    $.error('Unable to build SQL query with '+ data.condition +' condition');
                }

                if (!data.rules) {
                    return '';
                }

                var parts = [];

                $.each(data.rules, function(i, rule) {
                    if (rule.rules && rule.rules.length>0) {
                        parts.push('('+ nl + parse(rule) + nl +')'+ nl);
                    }
                    else {
                        var sql = that.getSqlOperator(rule.operator),
                            ope = that.getOperatorByType(rule.operator),
                            value = '';

                        if (sql === false) {
                            $.error('SQL operation unknown for operator '+ rule.operator);
                        }

                        if (ope.accept_values) {
                            if (!(rule.value instanceof Array)) {
                                rule.value = [rule.value];
                            }
                            else if (!sql.list && rule.value.length>1) {
                                $.error('Operator '+ rule.operator +' cannot accept multiple values');
                            }

                            rule.value.forEach(function(v, i) {
                                if (i>0) {
                                    value+= sql.sep;
                                }

                                if (rule.type=='integer' || rule.type=='double' || rule.type=='boolean') {
                                    v = changeType(v, rule.type, 'sql');
                                }
                                else if (!stmt) {
                                    v = escapeString(v);
                                }

                                if (sql.fn) {
                                    v = sql.fn(v);
                                }

                                if (stmt) {
                                    if (stmt == 'question_mark') {
                                        value+= '?';
                                    }
                                    else {
                                        value+= '$'+bind_index;
                                    }

                                    bind_params.push(v);
                                    bind_index++;
                                }
                                else {
                                    if (typeof v === 'string') {
                                        v = '\''+ v +'\'';
                                    }

                                    value+= v;
                                }
                            });
                        }

                        parts.push(rule.field +' '+ sql.op.replace(/\?/, value));
                    }
                });

                return parts.join(' '+ data.condition + nl);
            }(data));

            if (stmt) {
                return {
                    sql: sql,
                    params: bind_params
                };
            }
            else {
                return {
                    sql: sql
                };
            }
        },

        /**
         * Sanitize the "sql" field of an operator
         * @param sql {string|object}
         * @return {object}
         */
        getSqlOperator: function(type) {
            var sql = this.settings.sqlOperators[type];

            if (sql === undefined) {
                return false;
            }

            if (typeof sql === 'string') {
                sql = { op: sql };
            }
            if (!sql.list) {
                sql.list = false;
            }
            if (sql.list && !sql.sep) {
                sql.sep = ', ';
            }

            return sql;
        }
    });


    /**
     * Change type of a value to int, float or boolean
     * @param value {mixed}
     * @param type {string}
     * @return {mixed}
     */
    function changeType(value, type, db) {
        switch (type) {
            case 'integer': return parseInt(value);
            case 'double': return parseFloat(value);
            case 'boolean':
                var bool = value.trim().toLowerCase() === "true" || value.trim() === '1' || value === 1;
                if (db === 'sql') {
                    return bool ? 1 : 0;
                }
                else {
                    return bool;
                }
                break;
            default: return value;
        }
    }

    /**
     * Escape SQL value
     * @param value {string}
     * @return {string}
     */
    function escapeString(value) {
        if (typeof value !== 'string') {
            return value;
        }

        return value
          .replace(/[\0\n\r\b\\\'\"]/g, function(s) {
              switch(s) {
                  case '\0': return '\\0';
                  case '\n': return '\\n';
                  case '\r': return '\\r';
                  case '\b': return '\\b';
                  default:   return '\\' + s;
              }
          })
          // uglify compliant
          .replace(/\t/g, '\\t')
          .replace(/\x1a/g, '\\Z');
    }
}));
