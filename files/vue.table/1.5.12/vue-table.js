(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Vue // late bind
var map = Object.create(null)
var shimmed = false
var isBrowserify = false

/**
 * Determine compatibility and apply patch.
 *
 * @param {Function} vue
 * @param {Boolean} browserify
 */

exports.install = function (vue, browserify) {
  if (shimmed) return
  shimmed = true

  Vue = vue
  isBrowserify = browserify

  exports.compatible = !!Vue.internalDirectives
  if (!exports.compatible) {
    console.warn(
      '[HMR] vue-loader hot reload is only compatible with ' +
      'Vue.js 1.0.0+.'
    )
    return
  }

  // patch view directive
  patchView(Vue.internalDirectives.component)
  console.log('[HMR] Vue component hot reload shim applied.')
  // shim router-view if present
  var routerView = Vue.elementDirective('router-view')
  if (routerView) {
    patchView(routerView)
    console.log('[HMR] vue-router <router-view> hot reload shim applied.')
  }
}

/**
 * Shim the view directive (component or router-view).
 *
 * @param {Object} View
 */

function patchView (View) {
  var unbuild = View.unbuild
  View.unbuild = function (defer) {
    if (!this.hotUpdating) {
      var prevComponent = this.childVM && this.childVM.constructor
      removeView(prevComponent, this)
      // defer = true means we are transitioning to a new
      // Component. Register this new component to the list.
      if (defer) {
        addView(this.Component, this)
      }
    }
    // call original
    return unbuild.call(this, defer)
  }
}

/**
 * Add a component view to a Component's hot list
 *
 * @param {Function} Component
 * @param {Directive} view - view directive instance
 */

function addView (Component, view) {
  var id = Component && Component.options.hotID
  if (id) {
    if (!map[id]) {
      map[id] = {
        Component: Component,
        views: [],
        instances: []
      }
    }
    map[id].views.push(view)
  }
}

/**
 * Remove a component view from a Component's hot list
 *
 * @param {Function} Component
 * @param {Directive} view - view directive instance
 */

function removeView (Component, view) {
  var id = Component && Component.options.hotID
  if (id) {
    map[id].views.$remove(view)
  }
}

/**
 * Create a record for a hot module, which keeps track of its construcotr,
 * instnaces and views (component directives or router-views).
 *
 * @param {String} id
 * @param {Object} options
 */

exports.createRecord = function (id, options) {
  if (typeof options === 'function') {
    options = options.options
  }
  if (typeof options.el !== 'string' && typeof options.data !== 'object') {
    makeOptionsHot(id, options)
    map[id] = {
      Component: null,
      views: [],
      instances: []
    }
  }
}

/**
 * Make a Component options object hot.
 *
 * @param {String} id
 * @param {Object} options
 */

function makeOptionsHot (id, options) {
  options.hotID = id
  injectHook(options, 'created', function () {
    var record = map[id]
    if (!record.Component) {
      record.Component = this.constructor
    }
    record.instances.push(this)
  })
  injectHook(options, 'beforeDestroy', function () {
    map[id].instances.$remove(this)
  })
}

/**
 * Inject a hook to a hot reloadable component so that
 * we can keep track of it.
 *
 * @param {Object} options
 * @param {String} name
 * @param {Function} hook
 */

function injectHook (options, name, hook) {
  var existing = options[name]
  options[name] = existing
    ? Array.isArray(existing)
      ? existing.concat(hook)
      : [existing, hook]
    : [hook]
}

/**
 * Update a hot component.
 *
 * @param {String} id
 * @param {Object|null} newOptions
 * @param {String|null} newTemplate
 */

exports.update = function (id, newOptions, newTemplate) {
  var record = map[id]
  // force full-reload if an instance of the component is active but is not
  // managed by a view
  if (!record || (record.instances.length && !record.views.length)) {
    console.log('[HMR] Root or manually-mounted instance modified. Full reload may be required.')
    if (!isBrowserify) {
      window.location.reload()
    } else {
      // browserify-hmr somehow sends incomplete bundle if we reload here
      return
    }
  }
  if (!isBrowserify) {
    // browserify-hmr already logs this
    console.log('[HMR] Updating component: ' + format(id))
  }
  var Component = record.Component
  // update constructor
  if (newOptions) {
    // in case the user exports a constructor
    Component = record.Component = typeof newOptions === 'function'
      ? newOptions
      : Vue.extend(newOptions)
    makeOptionsHot(id, Component.options)
  }
  if (newTemplate) {
    Component.options.template = newTemplate
  }
  // handle recursive lookup
  if (Component.options.name) {
    Component.options.components[Component.options.name] = Component
  }
  // reset constructor cached linker
  Component.linker = null
  // reload all views
  record.views.forEach(function (view) {
    updateView(view, Component)
  })
  // flush devtools
  if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit('flush')
  }
}

/**
 * Update a component view instance
 *
 * @param {Directive} view
 * @param {Function} Component
 */

function updateView (view, Component) {
  if (!view._bound) {
    return
  }
  view.Component = Component
  view.hotUpdating = true
  // disable transitions
  view.vm._isCompiled = false
  // save state
  var state = extractState(view.childVM)
  // remount, make sure to disable keep-alive
  var keepAlive = view.keepAlive
  view.keepAlive = false
  view.mountComponent()
  view.keepAlive = keepAlive
  // restore state
  restoreState(view.childVM, state, true)
  // re-eanble transitions
  view.vm._isCompiled = true
  view.hotUpdating = false
}

/**
 * Extract state from a Vue instance.
 *
 * @param {Vue} vm
 * @return {Object}
 */

function extractState (vm) {
  return {
    cid: vm.constructor.cid,
    data: vm.$data,
    children: vm.$children.map(extractState)
  }
}

/**
 * Restore state to a reloaded Vue instance.
 *
 * @param {Vue} vm
 * @param {Object} state
 */

function restoreState (vm, state, isRoot) {
  var oldAsyncConfig
  if (isRoot) {
    // set Vue into sync mode during state rehydration
    oldAsyncConfig = Vue.config.async
    Vue.config.async = false
  }
  // actual restore
  if (isRoot || !vm._props) {
    vm.$data = state.data
  } else {
    Object.keys(state.data).forEach(function (key) {
      if (!vm._props[key]) {
        // for non-root, only restore non-props fields
        vm.$data[key] = state.data[key]
      }
    })
  }
  // verify child consistency
  var hasSameChildren = vm.$children.every(function (c, i) {
    return state.children[i] && state.children[i].cid === c.constructor.cid
  })
  if (hasSameChildren) {
    // rehydrate children
    vm.$children.forEach(function (c, i) {
      restoreState(c, state.children[i])
    })
  }
  if (isRoot) {
    Vue.config.async = oldAsyncConfig
  }
}

function format (id) {
  var match = id.match(/[^\/]+\.vue$/)
  return match ? match[0] : id
}

},{}],2:[function(require,module,exports){
var inserted = exports.cache = {}

exports.insert = function (css) {
  if (inserted[css]) return
  inserted[css] = true

  var elem = document.createElement('style')
  elem.setAttribute('type', 'text/css')

  if ('textContent' in elem) {
    elem.textContent = css
  } else {
    elem.styleSheet.cssText = css
  }

  document.getElementsByTagName('head')[0].appendChild(elem)
  return elem
}

},{}],3:[function(require,module,exports){
var __vueify_insert__ = require("vueify/lib/insert-css")
var __vueify_style__ = __vueify_insert__.insert("\n.vuetable th.sortable:hover {\n  color: #2185d0;\n  cursor: pointer;\n}\n.vuetable-actions {\n  width: 15%;\n  padding: 12px 0px;\n  text-align: center;\n}\n.vuetable-pagination {\n  background: #f9fafb !important;\n}\n.vuetable-pagination-info {\n  margin-top: auto;\n  margin-bottom: auto;\n}\n")
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    props: {
        wrapperClass: {
            type: String,
            default: function _default() {
                return null;
            }
        },
        tableWrapper: {
            type: String,
            default: function _default() {
                return null;
            }
        },
        tableClass: {
            type: String,
            default: function _default() {
                return 'ui blue striped selectable celled stackable attached table';
            }
        },
        loadingClass: {
            type: String,
            default: function _default() {
                return 'loading';
            }
        },
        dataPath: {
            type: String,
            default: function _default() {
                return 'data';
            }
        },
        paginationPath: {
            type: String,
            default: function _default() {
                return 'links.pagination';
            }
        },
        fields: {
            type: Array,
            required: true
        },
        apiUrl: {
            type: String,
            required: true
        },
        sortOrder: {
            type: Array,
            default: function _default() {
                return [];
            }
        },
        multiSort: {
            type: Boolean,
            default: function _default() {
                return false;
            }
        },
        /*
         * physical key that will trigger multi-sort option
         * possible values: 'alt', 'ctrl', 'meta', 'shift'
         * 'ctrl' might not work as expected on Mac
         */
        multiSortKey: {
            type: String,
            default: 'alt'
        },
        perPage: {
            type: Number,
            coerce: function coerce(val) {
                return parseInt(val);
            },
            default: function _default() {
                return 10;
            }
        },
        ascendingIcon: {
            type: String,
            default: function _default() {
                return 'blue chevron up icon';
            }
        },
        descendingIcon: {
            type: String,
            default: function _default() {
                return 'blue chevron down icon';
            }
        },
        appendParams: {
            type: Array,
            default: function _default() {
                return [];
            }
        },
        showPagination: {
            type: Boolean,
            default: function _default() {
                return true;
            }
        },
        paginationComponent: {
            type: String,
            default: function _default() {
                return 'vuetable-pagination';
            }
        },
        paginationInfoTemplate: {
            type: String,
            default: function _default() {
                return "Displaying {from} to {to} of {total} items";
            }
        },
        paginationInfoNoDataTemplate: {
            type: String,
            default: function _default() {
                return 'No relevant data';
            }
        },
        paginationClass: {
            type: String,
            default: function _default() {
                return 'ui bottom attached segment grid';
            }
        },
        paginationInfoClass: {
            type: String,
            default: function _default() {
                return 'left floated left aligned six wide column';
            }
        },
        paginationComponentClass: {
            type: String,
            default: function _default() {
                return 'right floated right aligned six wide column';
            }
        },
        paginationConfig: {
            type: String,
            default: function _default() {
                return 'paginationConfig';
            }
        },
        paginationConfigCallback: {
            type: String,
            default: function _default() {
                return 'paginationConfig';
            }
        },
        itemActions: {
            type: Array,
            default: function _default() {
                return [];
            }
        },
        queryParams: {
            type: Object,
            default: function _default() {
                return {
                    sort: 'sort',
                    page: 'page',
                    perPage: 'per_page'
                };
            }
        },
        loadOnStart: {
            type: Boolean,
            default: function _default() {
                return true;
            }
        },
        selectedTo: {
            type: Array,
            default: function _default() {
                return [];
            }
        },
        httpOptions: {
            type: Object,
            default: function _default() {
                return {};
            }
        },
        detailRow: {
            type: String,
            default: ''
        },
        detailRowCallback: {
            type: String,
            default: ''
        },
        detailRowId: {
            type: String,
            default: 'id'
        },
        detailRowTransition: {
            type: String,
            default: ''
        },
        detailRowClass: {
            type: String,
            default: 'vuetable-detail-row'
        },
        detailRowComponent: {
            type: String,
            default: ''
        },
        rowClassCallback: {
            type: String,
            default: ''
        }
    },
    data: function data() {
        return {
            eventPrefix: 'vuetable:',
            tableData: null,
            tablePagination: null,
            currentPage: 1,
            visibleDetailRows: []
        };
    },
    directives: {
        'attr': {
            update: function update(value) {
                for (var i in value) {
                    this.el.setAttribute(i, value[i]);
                }
            }
        }
    },
    computed: {
        paginationInfo: function paginationInfo() {
            if (this.tablePagination == null || this.tablePagination.total == 0) {
                return this.paginationInfoNoDataTemplate;
            }

            return this.paginationInfoTemplate.replace('{from}', this.tablePagination.from || 0).replace('{to}', this.tablePagination.to || 0).replace('{total}', this.tablePagination.total || 0);
        },
        useDetailRow: function useDetailRow() {
            if (this.tableData && typeof this.tableData[0][this.detailRowId] === 'undefined') {
                console.warn('You need to define "detail-row-id" in order for detail-row feature to work!');
                return false;
            }

            return this.detailRowCallback.trim() !== '' || this.detailRowComponent !== '';
        },
        useDetailRowComponent: function useDetailRowComponent() {
            return this.detailRowComponent !== '';
        },
        countVisibleFields: function countVisibleFields() {
            return this.fields.filter(function (field) {
                return field.visible;
            }).length;
        }
    },
    methods: {
        normalizeFields: function normalizeFields() {
            var self = this;
            var obj;
            this.fields.forEach(function (field, i) {
                if (typeof field === 'string') {
                    obj = {
                        name: field,
                        title: self.setTitle(field),
                        titleClass: '',
                        dataClass: '',
                        callback: null,
                        visible: true
                    };
                } else {
                    obj = {
                        name: field.name,
                        title: field.title === undefined ? self.setTitle(field.name) : field.title,
                        sortField: field.sortField,
                        titleClass: field.titleClass === undefined ? '' : field.titleClass,
                        dataClass: field.dataClass === undefined ? '' : field.dataClass,
                        callback: field.callback === undefined ? '' : field.callback,
                        visible: field.visible === undefined ? true : field.visible
                    };
                }
                self.fields.$set(i, obj);
            });
        },
        setTitle: function setTitle(str) {
            if (this.isSpecialField(str)) {
                return '';
            }

            return this.titleCase(str);
        },
        titleCase: function titleCase(str) {
            return str.replace(/\w+/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        },
        notIn: function notIn(str, arr) {
            return arr.indexOf(str) === -1;
        },
        loadData: function loadData() {
            var self = this;

            var wrapper = document.querySelector(this.tableWrapper);
            this.showLoadingAnimation(wrapper);

            var url = this.apiUrl + '?' + this.getAllQueryParams();
            this.$http.get(url, this.httpOptions).then(function (response) {
                var body = this.transform(response.body);
                self.tableData = self.getObjectValue(body, self.dataPath, null);
                self.tablePagination = self.getObjectValue(body, self.paginationPath, null);
                if (self.tablePagination === null) {
                    console.warn('vuetable: pagination-path "' + self.paginationPath + '" not found. ' + 'It looks like the data returned from the sever does not have pagination information ' + 'or you may have set it incorrectly.');
                }

                self.$nextTick(function () {
                    self.dispatchEvent('load-success', response);
                    self.broadcastEvent('load-success', self.tablePagination);

                    self.hideLoadingAnimation(wrapper);
                });
            }, function (response) {
                self.dispatchEvent('load-error', response);
                self.broadcastEvent('load-error', response);

                self.hideLoadingAnimation(wrapper);
            });
        },
        getAllQueryParams: function getAllQueryParams() {
            var params = [this.queryParams.sort + '=' + this.getSortParam(), this.queryParams.page + '=' + this.currentPage, this.queryParams.perPage + '=' + this.perPage].join('&');

            if (this.appendParams.length > 0) {
                params += '&' + this.appendParams.join('&');
            }

            return params;
        },
        showLoadingAnimation: function showLoadingAnimation(wrapper) {
            if (wrapper !== null) {
                this.addClass(wrapper, this.loadingClass);
            }
            this.dispatchEvent('loading');
        },
        hideLoadingAnimation: function hideLoadingAnimation(wrapper) {
            if (wrapper !== null) {
                this.removeClass(wrapper, this.loadingClass);
            }
            this.dispatchEvent('loaded');
        },
        transform: function transform(data) {
            var func = 'transform';

            if (this.parentFunctionExists(func)) {
                return this.$parent[func].call(this.$parent, data);
            }

            return data;
        },
        parentFunctionExists: function parentFunctionExists(func) {
            return func !== '' && typeof this.$parent[func] === 'function';
        },
        getTitle: function getTitle(field) {
            if (typeof field.title === 'undefined') {
                return field.name.replace('.', ' ');
            }
            return field.title;
        },
        getSortParam: function getSortParam() {
            if (!this.sortOrder || this.sortOrder.field == '') {
                return '';
            }

            if (typeof this.$parent['getSortParam'] == 'function') {
                return this.$parent['getSortParam'].call(this.$parent, this.sortOrder);
            }

            return this.getDefaultSortParam();
        },
        getDefaultSortParam: function getDefaultSortParam() {
            var result = '';

            for (var i = 0; i < this.sortOrder.length; i++) {
                var fieldName = typeof this.sortOrder[i].sortField === 'undefined' ? this.sortOrder[i].field : this.sortOrder[i].sortField;

                result += fieldName + '|' + this.sortOrder[i].direction + (i + 1 < this.sortOrder.length ? ',' : '');
            }

            return result;
        },
        addClass: function addClass(el, className) {
            if (el.classList) el.classList.add(className);else el.className += ' ' + className;
        },
        removeClass: function removeClass(el, className) {
            if (el.classList) el.classList.remove(className);else el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        },
        dispatchEvent: function dispatchEvent(eventName, args) {
            this.$dispatch(this.eventPrefix + eventName, args);
        },
        broadcastEvent: function broadcastEvent(eventName, args) {
            this.$broadcast(this.eventPrefix + eventName, args);
        },
        orderBy: function orderBy(field, event) {
            if (!this.isSortable(field)) {
                return;
            }

            var key = this.multiSortKey.toLowerCase() + 'Key';

            if (this.multiSort && event[key]) {
                //adding column to multisort
                var i = this.currentSortOrder(field);

                if (i === false) {
                    //this field is not in the sort array yet
                    this.sortOrder.push({
                        field: field.sortField,
                        direction: 'asc'
                    });
                } else {
                    //this field is in the sort array, now we change its state
                    if (this.sortOrder[i].direction == 'asc') {
                        // switch direction
                        this.sortOrder[i].direction = 'desc';
                    } else {
                        //remove sort condition
                        this.sortOrder.splice(i, 1);
                    }
                }
            } else {
                //no multisort, or resetting sort
                if (this.sortOrder.length == 0) {
                    this.sortOrder.push({
                        field: '',
                        direction: 'asc'
                    });
                }

                this.sortOrder.splice(1); //removes additional columns

                if (this.sortOrder[0].field == field.sortField) {
                    // change sort direction
                    this.sortOrder[0].direction = this.sortOrder[0].direction == 'asc' ? 'desc' : 'asc';
                } else {
                    // reset sort direction
                    this.sortOrder[0].direction = 'asc';
                }
                this.sortOrder[0].field = field.sortField;
            }

            this.currentPage = 1; // reset page index
            this.loadData();
        },
        isSortable: function isSortable(field) {
            return !(typeof field.sortField == 'undefined');
        },
        isCurrentSortField: function isCurrentSortField(field) {
            return this.currentSortOrder(field) !== false;
        },
        currentSortOrder: function currentSortOrder(field) {
            if (!this.isSortable(field)) {
                return false;
            }

            for (var i = 0; i < this.sortOrder.length; i++) {
                if (this.sortOrder[i].field == field.sortField) {
                    return i;
                }
            }

            return false;
        },
        sortIcon: function sortIcon(field) {
            var i = this.currentSortOrder(field);
            if (i !== false) {
                return this.sortOrder[i].direction == 'asc' ? this.ascendingIcon : this.descendingIcon;
            } else {
                return '';
            }
        },
        sortIconOpacity: function sortIconOpacity(field) {
            //fields with stronger precedence have darker color

            //if there are few fields, we go down by 0.3
            //ex. 2 fields are selected: 1.0, 0.7

            //if there are more we go down evenly on the given spectrum
            //ex. 6 fields are selected: 1.0, 0.86, 0.72, 0.58, 0.44, 0.3

            var max = 1.0;
            var min = 0.3;
            var step = 0.3;

            var count = this.sortOrder.length;
            var current = this.currentSortOrder(field);

            if (max - count * step < min) {
                step = (max - min) / (count - 1);
            }

            var opacity = max - current * step;

            return opacity;
        },
        gotoPreviousPage: function gotoPreviousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadData();
            }
        },
        gotoNextPage: function gotoNextPage() {
            if (this.currentPage < this.tablePagination.last_page) {
                this.currentPage++;
                this.loadData();
            }
        },
        gotoPage: function gotoPage(page) {
            if (page != this.currentPage && page > 0 && page <= this.tablePagination.last_page) {
                this.currentPage = page;
                this.loadData();
            }
        },
        isSpecialField: function isSpecialField(fieldName) {
            // return fieldName.startsWith('__')
            return fieldName.slice(0, 2) === '__';
        },
        hasCallback: function hasCallback(item) {
            return item.callback ? true : false;
        },
        callCallback: function callCallback(field, item) {
            if (!this.hasCallback(field)) return;

            var args = field.callback.split('|');
            var func = args.shift();

            if (typeof this.$parent[func] == 'function') {
                return args.length > 0 ? this.$parent[func].apply(this.$parent, [this.getObjectValue(item, field.name)].concat(args)) : this.$parent[func].call(this.$parent, this.getObjectValue(item, field.name));
            }

            return null;
        },
        getObjectValue: function getObjectValue(object, path, defaultValue) {
            defaultValue = typeof defaultValue == 'undefined' ? null : defaultValue;

            var obj = object;
            if (path.trim() != '') {
                var keys = path.split('.');
                keys.forEach(function (key) {
                    if (obj !== null && typeof obj[key] != 'undefined' && obj[key] !== null) {
                        obj = obj[key];
                    } else {
                        obj = defaultValue;
                        return;
                    }
                });
            }
            return obj;
        },
        callAction: function callAction(action, data) {
            this.$dispatch(this.eventPrefix + 'action', action, data);
        },
        addParam: function addParam(param) {
            this.appendParams.push(param);
        },
        toggleCheckbox: function toggleCheckbox(isChecked, dataItem, fieldName) {
            var idColumn = this.extractArgs(fieldName);
            if (idColumn === undefined) {
                console.warn('You did not provide reference id column with "__checkbox:<column_name>" field!');
                return;
            }

            var key = dataItem[idColumn];
            if (isChecked) {
                this.selectId(key);
            } else {
                this.unselectId(key);
            }
        },
        toggleAllCheckboxes: function toggleAllCheckboxes(isChecked, fieldName) {
            var self = this;
            var idColumn = this.extractArgs(fieldName);

            if (isChecked) {
                this.tableData.forEach(function (dataItem) {
                    self.selectId(dataItem[idColumn]);
                });
            } else {
                this.tableData.forEach(function (dataItem) {
                    self.unselectId(dataItem[idColumn]);
                });
            }
        },
        selectId: function selectId(key) {
            if (!this.isSelectedRow(key)) {
                this.selectedTo.push(key);
            }
        },
        unselectId: function unselectId(key) {
            this.selectedTo.$remove(key);
            // this.selectedTo = this.selectedTo.filter(function(item) {
            //     return item !== key
            // })
        },
        isSelectedRow: function isSelectedRow(key) {
            return this.selectedTo.indexOf(key) >= 0;
        },
        rowSelected: function rowSelected(dataItem, fieldName) {
            var idColumn = this.extractArgs(fieldName);
            // var key = dataItem[idColumn]

            return this.isSelectedRow(dataItem[idColumn]);
        },
        checkCheckboxesState: function checkCheckboxesState(fieldName) {
            var self = this;
            var idColumn = this.extractArgs(fieldName);
            var selector = 'th.checkbox_' + idColumn + ' input[type=checkbox]';
            var els = document.querySelectorAll(selector);

            // count how many checkbox row in the current page has been checked
            var selected = this.tableData.filter(function (item) {
                return self.selectedTo.indexOf(item[idColumn]) >= 0;
            });

            // count == 0, clear the checkbox
            if (selected.length <= 0) {
                els.forEach(function (el) {
                    el.indeterminate = false;
                });
                return false;
            }
            // count > 0 and count < perPage, set checkbox state to 'indeterminate'
            else if (selected.length < this.perPage) {
                    els.forEach(function (el) {
                        el.indeterminate = true;
                    });
                    return true;
                }
                // count == perPage, set checkbox state to 'checked'
                else {
                        els.forEach(function (el) {
                            el.indeterminate = false;
                        });
                        return true;
                    }
        },
        extractName: function extractName(string) {
            return string.split(':')[0].trim();
        },
        extractArgs: function extractArgs(string) {
            return string.split(':')[1];
        },
        callDetailRowCallback: function callDetailRowCallback(item) {
            var func = this.detailRowCallback.trim();
            if (func === '') {
                return '';
            }

            if (typeof this.$parent[func] == 'function') {
                return this.$parent[func].call(this.$parent, item);
            } else {
                console.error('Function "' + func + '()" does not exist!');
            }
        },
        isVisibleDetailRow: function isVisibleDetailRow(rowId) {
            return this.visibleDetailRows.indexOf(rowId) >= 0;
        },
        showDetailRow: function showDetailRow(rowId) {
            if (!this.isVisibleDetailRow(rowId)) {
                this.visibleDetailRows.push(rowId);
            }
        },
        hideDetailRow: function hideDetailRow(rowId) {
            if (this.isVisibleDetailRow(rowId)) {
                this.visibleDetailRows.$remove(rowId);
            }
        },
        toggleDetailRow: function toggleDetailRow(rowId) {
            if (this.isVisibleDetailRow(rowId)) {
                this.hideDetailRow(rowId);
            } else {
                this.showDetailRow(rowId);
            }
        },
        onRowClass: function onRowClass(dataItem, index) {
            var func = this.rowClassCallback.trim();

            if (func !== '' && typeof this.$parent[func] === 'function') {
                return this.$parent[func].call(this.$parent, dataItem, index);
            }
            return '';
        },
        onRowChanged: function onRowChanged(dataItem) {
            this.dispatchEvent('row-changed', dataItem);
            return true;
        },
        onRowClicked: function onRowClicked(dataItem, event) {
            this.$dispatch(this.eventPrefix + 'row-clicked', dataItem, event);
            return true;
        },
        onRowDoubleClicked: function onRowDoubleClicked(dataItem, event) {
            this.$dispatch(this.eventPrefix + 'row-dblclicked', dataItem, event);
        },
        onCellClicked: function onCellClicked(dataItem, field, event) {
            this.$dispatch(this.eventPrefix + 'cell-clicked', dataItem, field, event);
        },
        onCellDoubleClicked: function onCellDoubleClicked(dataItem, field, event) {
            this.$dispatch(this.eventPrefix + 'cell-dblclicked', dataItem, field, event);
        },
        onDetailRowClick: function onDetailRowClick(dataItem, event) {
            this.$dispatch(this.eventPrefix + 'detail-row-clicked', dataItem, event);
        },
        callPaginationConfig: function callPaginationConfig() {
            if (typeof this.$parent[this.paginationConfigCallback] === 'function') {
                this.$parent[this.paginationConfigCallback].call(this.$parent, this.$refs.pagination.$options.name);
            }
        },
        logDeprecatedMessage: function logDeprecatedMessage(name, replacer) {
            var msg = '"{name}" prop is being deprecated and will be removed in the future. Please use "{replacer}" instead.';
            console.warn(msg.replace('{name}', name).replace('{replacer}', replacer));
        },
        checkForDeprecatedProps: function checkForDeprecatedProps() {
            if (this.paginationConfig !== 'paginationConfig') {
                this.logDeprecatedMessage('paginationConfig', 'paginationConfigCallback');
            }
            if (this.detailRow !== '') {
                this.logDeprecatedMessage('detail-row', 'detail-row-callback');
            }
            if (this.detailRowCallback !== '') {
                this.logDeprecatedMessage('detail-row-callback', 'detail-row-component');
            }
        }
    },
    watch: {
        'multiSort': function multiSort(newVal, oldVal) {
            if (newVal === false && this.sortOrder.length > 1) {
                this.sortOrder.splice(1);
                this.loadData();
            }
        }
    },
    events: {
        'vuetable-pagination:change-page': function vuetablePaginationChangePage(page) {
            if (page == 'prev') {
                this.gotoPreviousPage();
            } else if (page == 'next') {
                this.gotoNextPage();
            } else {
                this.gotoPage(page);
            }
        },
        'vuetable:reload': function vuetableReload() {
            this.loadData();
        },
        'vuetable:refresh': function vuetableRefresh() {
            this.currentPage = 1;
            this.loadData();
        },
        'vuetable:goto-page': function vuetableGotoPage(page) {
            this.$emit('vuetable-pagination:change-page', page);
        },
        'vuetable:set-options': function vuetableSetOptions(options) {
            for (var n in options) {
                this.$set(n, options[n]);
            }
        },
        'vuetable:toggle-detail': function vuetableToggleDetail(dataItem) {
            this.toggleDetailRow(dataItem);
        },
        'vuetable:show-detail': function vuetableShowDetail(dataItem) {
            this.showDetailRow(dataItem);
        },
        'vuetable:hide-detail': function vuetableHideDetail(dataItem) {
            this.hideDetailRow(dataItem);
        },
        'vuetable:normalize-fields': function vuetableNormalizeFields() {
            this.normalizeFields();
        }
    },
    created: function created() {
        this.checkForDeprecatedProps();
        this.normalizeFields();
        if (this.loadOnStart) {
            this.loadData();
        }
        this.$nextTick(function () {
            this.callPaginationConfig();
        });
    }
};
if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div class=\"{{wrapperClass}}\">\n    <table class=\"vuetable {{tableClass}}\">\n        <thead>\n            <tr>\n                <template v-for=\"field in fields\">\n                    <template v-if=\"field.visible\">\n                        <template v-if=\"isSpecialField(field.name)\">\n                            <th v-if=\"extractName(field.name) == '__checkbox'\" :class=\"[field.titleClass, 'checkbox_'+extractArgs(field.name)]\">\n                                <input type=\"checkbox\" @change=\"toggleAllCheckboxes($event.target.checked, field.name)\" :checked=\"checkCheckboxesState(field.name)\">\n                            </th>\n                            <th v-if=\"extractName(field.name) == '__component'\" @click=\"orderBy(field, $event)\" class=\"{{field.titleClass || ''}} {{isSortable(field) ? 'sortable' : ''}}\">\n                                {{field.title || ''}}\n                                <i v-if=\"isCurrentSortField(field) &amp;&amp; field.title\" class=\"{{ sortIcon(field) }}\" :style=\"{opacity: sortIconOpacity(field)}\"></i>\n                            </th>\n                            <th v-if=\"notIn(extractName(field.name), ['__checkbox', '__component'])\" id=\"{{field.name}}\" class=\"{{field.titleClass || ''}}\">\n                                {{field.title || ''}}\n                            </th>\n                        </template>\n                        <template v-else=\"\">\n                            <th @click=\"orderBy(field, $event)\" id=\"_{{field.name}}\" class=\"{{field.titleClass || ''}} {{isSortable(field) ? 'sortable' : ''}}\">\n                                {{getTitle(field) | capitalize}}&nbsp;\n                                <i v-if=\"isCurrentSortField(field)\" class=\"{{ sortIcon(field) }}\" :style=\"{opacity: sortIconOpacity(field)}\"></i>\n                            </th>\n                        </template>\n                    </template>\n                </template>\n            </tr>\n        </thead>\n        <tbody v-cloak=\"\">\n            <template v-for=\"(itemNumber, item) in tableData\">\n                <tr @dblclick=\"onRowDoubleClicked(item, $event)\" @click=\"onRowClicked(item, $event)\" :render=\"onRowChanged(item)\" :class=\"onRowClass(item, itemNumber)\">\n                    <template v-for=\"field in fields\">\n                        <template v-if=\"field.visible\">\n                            <template v-if=\"isSpecialField(field.name)\">\n                                <td v-if=\"extractName(field.name) == '__sequence'\" class=\"vuetable-sequence {{field.dataClass}}\" v-html=\"tablePagination.from + itemNumber\">\n                                </td>\n                                <td v-if=\"extractName(field.name) == '__checkbox'\" class=\"vuetable-checkboxes {{field.dataClass}}\">\n                                    <input type=\"checkbox\" @change=\"toggleCheckbox($event.target.checked, item, field.name)\" :checked=\"rowSelected(item, field.name)\">\n                                </td>\n                                <td v-if=\"field.name == '__actions'\" class=\"vuetable-actions {{field.dataClass}}\">\n                                    <template v-for=\"action in itemActions\">\n                                        <button class=\"{{ action.class }}\" @click=\"callAction(action.name, item)\" v-attr=\"action.extra\">\n                                            <i class=\"{{ action.icon }}\"></i> {{ action.label }}\n                                        </button>\n                                    </template>\n                                </td>\n                                <td v-if=\"extractName(field.name) == '__component'\" class=\"{{field.dataClass}}\">\n                                    <component :is=\"extractArgs(field.name)\" :row-data=\"item\" :row-index=\"itemNumber\"></component>\n                                </td>\n                            </template>\n                            <template v-else=\"\">\n                                <td v-if=\"hasCallback(field)\" class=\"{{field.dataClass}}\" @click=\"onCellClicked(item, field, $event)\" @dblclick=\"onCellDoubleClicked(item, field, $event)\">\n                                    {{{ callCallback(field, item) }}}\n                                </td>\n                                <td v-else=\"\" class=\"{{field.dataClass}}\" @click=\"onCellClicked(item, field, $event)\" @dblclick=\"onCellDoubleClicked(item, field, $event)\">\n                                    {{{ getObjectValue(item, field.name, \"\") }}}\n                                </td>\n                            </template>\n                        </template>\n                    </template>\n                </tr>\n                <template v-if=\"useDetailRow\">\n                  <template v-if=\"useDetailRowComponent\">\n                    <tr v-if=\"isVisibleDetailRow(item[detailRowId])\" @click=\"onDetailRowClick(item, $event)\" :transition=\"detailRowTransition\" :class=\"[detailRowClass]\">\n                      <td :colspan=\"countVisibleFields\">\n                        <component :is=\"detailRowComponent\" :row-data=\"item\" :row-index=\"itemNumber\"></component>\n                      </td>\n                    </tr>\n                  </template>\n                  <template v-else=\"\">\n                    <tr v-if=\"isVisibleDetailRow(item[detailRowId])\" v-html=\"callDetailRowCallback(item)\" @click=\"onDetailRowClick(item, $event)\" :transition=\"detailRowTransition\" :class=\"[detailRowClass]\"></tr>\n                  </template>\n                </template>\n            </template>\n        </tbody>\n    </table>\n    <div v-if=\"showPagination\" class=\"vuetable-pagination {{paginationClass}}\">\n        <div class=\"vuetable-pagination-info {{paginationInfoClass}}\" v-html=\"paginationInfo\">\n        </div>\n        <div v-show=\"tablePagination &amp;&amp; tablePagination.last_page > 1\" class=\"vuetable-pagination-component {{paginationComponentClass}}\">\n            <component v-ref:pagination=\"\" :is=\"paginationComponent\"></component>\n        </div>\n    </div>\n</div>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.dispose(function () {
    __vueify_insert__.cache["\n.vuetable th.sortable:hover {\n  color: #2185d0;\n  cursor: pointer;\n}\n.vuetable-actions {\n  width: 15%;\n  padding: 12px 0px;\n  text-align: center;\n}\n.vuetable-pagination {\n  background: #f9fafb !important;\n}\n.vuetable-pagination-info {\n  margin-top: auto;\n  margin-bottom: auto;\n}\n"] = false
    document.head.removeChild(__vueify_style__)
  })
  if (!module.hot.data) {
    hotAPI.createRecord("_v-3563622c", module.exports)
  } else {
    hotAPI.update("_v-3563622c", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}
},{"vue":"vue","vue-hot-reload-api":1,"vueify/lib/insert-css":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _VuetablePaginationMixin = require('./VuetablePaginationMixin.vue');

var _VuetablePaginationMixin2 = _interopRequireDefault(_VuetablePaginationMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    mixins: [_VuetablePaginationMixin2.default]
};
if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div class=\"{{wrapperClass}}\">\n    <a @click=\"loadPage(1)\" class=\"btn-nav {{linkClass}} {{isOnFirstPage ? disabledClass : ''}}\">\n            <i v-if=\"icons.first != ''\" class=\"{{icons.first}}\"></i>\n            <span v-else=\"\">«</span>\n    </a>\n    <a @click=\"loadPage('prev')\" class=\"btn-nav {{linkClass}} {{isOnFirstPage ? disabledClass : ''}}\">\n            <i v-if=\"icons.next != ''\" class=\"{{icons.prev}}\"></i>\n            <span v-else=\"\">&nbsp;‹</span>\n    </a>\n    <template v-if=\"notEnoughPages\">\n        <template v-for=\"n in totalPage\">\n            <a @click=\"loadPage(n+1)\" class=\"{{pageClass}} {{isCurrentPage(n+1) ? activeClass : ''}}\">\n                    {{ n+1 }}\n            </a>\n        </template>\n    </template>\n    <template v-else=\"\">\n       <template v-for=\"n in windowSize\">\n           <a @click=\"loadPage(windowStart+n)\" class=\"{{pageClass}} {{isCurrentPage(windowStart+n) ? activeClass : ''}}\">\n                {{ windowStart+n }}\n           </a>\n       </template>\n    </template>\n    <a @click=\"loadPage('next')\" class=\"btn-nav {{linkClass}} {{isOnLastPage ? disabledClass : ''}}\">\n        <i v-if=\"icons.next != ''\" class=\"{{icons.next}}\"></i>\n        <span v-else=\"\">›&nbsp;</span>\n    </a>\n    <a @click=\"loadPage(totalPage)\" class=\"btn-nav {{linkClass}} {{isOnLastPage ? disabledClass : ''}}\">\n        <i v-if=\"icons.last != ''\" class=\"{{icons.last}}\"></i>\n        <span v-else=\"\">»</span>\n    </a>\n</div>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  if (!module.hot.data) {
    hotAPI.createRecord("_v-3d729fe6", module.exports)
  } else {
    hotAPI.update("_v-3d729fe6", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}
},{"./VuetablePaginationMixin.vue":6,"vue":"vue","vue-hot-reload-api":1}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _VuetablePaginationMixin = require('./VuetablePaginationMixin.vue');

var _VuetablePaginationMixin2 = _interopRequireDefault(_VuetablePaginationMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    mixins: [_VuetablePaginationMixin2.default],
    props: {
        'dropdownClass': {
            type: String,
            default: function _default() {
                return 'ui search dropdown';
            }
        },
        'pageText': {
            type: String,
            default: function _default() {
                return 'Page';
            }
        }
    },
    methods: {
        loadPage: function loadPage(page) {
            // update dropdown value
            if (page == 'prev' && !this.isOnFirstPage) {
                this.setDropdownToPage(this.tablePagination.current_page - 1);
            } else if (page == 'next' && !this.isOnLastPage) {
                this.setDropdownToPage(this.tablePagination.current_page + 1);
            }

            this.$dispatch('vuetable-pagination:change-page', page);
        },
        setDropdownToPage: function setDropdownToPage(page) {
            this.$nextTick(function () {
                document.getElementById('vuetable-pagination-dropdown').value = page;
            });
        },
        selectPage: function selectPage(event) {
            this.$dispatch('vuetable-pagination:change-page', event.target.selectedIndex + 1);
        }
    },
    events: {
        'vuetable:load-success': function vuetableLoadSuccess(tablePagination) {
            this.tablePagination = tablePagination;
            this.setDropdownToPage(tablePagination.current_page);
        }
    }
};
if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div class=\"{{wrapperClass}}\">\n    <a @click=\"loadPage('prev')\" class=\"{{linkClass}} {{isOnFirstPage ? disabledClass : ''}}\">\n        <i :class=\"icons.prev\"></i>\n    </a>\n    <select id=\"vuetable-pagination-dropdown\" class=\"{{dropdownClass}}\" @change=\"selectPage($event)\">\n        <template v-for=\"n in totalPage\">\n            <option class=\"{{pageClass}}\" value=\"{{n+1}}\">\n                {{pageText}} {{n+1}}\n            </option>\n        </template>\n    </select>\n    <a @click=\"loadPage('next')\" class=\"{{linkClass}} {{isOnLastPage ? disabledClass : ''}}\">\n        <i :class=\"icons.next\"></i>\n    </a>\n</div>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  if (!module.hot.data) {
    hotAPI.createRecord("_v-9c70ccd2", module.exports)
  } else {
    hotAPI.update("_v-9c70ccd2", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}
},{"./VuetablePaginationMixin.vue":6,"vue":"vue","vue-hot-reload-api":1}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    props: {
        'wrapperClass': {
            type: String,
            default: function _default() {
                return 'ui right floated pagination menu';
            }
        },
        'activeClass': {
            type: String,
            default: function _default() {
                return 'active large';
            }
        },
        'disabledClass': {
            type: String,
            default: function _default() {
                return 'disabled';
            }
        },
        'pageClass': {
            type: String,
            default: function _default() {
                return 'item';
            }
        },
        'linkClass': {
            type: String,
            default: function _default() {
                return 'icon item';
            }
        },
        'icons': {
            type: Object,
            default: function _default() {
                return {
                    first: 'angle double left icon',
                    prev: 'left chevron icon',
                    next: 'right chevron icon',
                    last: 'angle double right icon'
                };
            }
        },
        'onEachSide': {
            type: Number,
            coerce: function coerce(value) {
                return parseInt(value);
            },
            default: function _default() {
                return 2;
            }
        }
    },
    data: function data() {
        return {
            tablePagination: null
        };
    },
    computed: {
        totalPage: function totalPage() {
            return this.tablePagination == null ? 0 : this.tablePagination.last_page;
        },
        isOnFirstPage: function isOnFirstPage() {
            return this.tablePagination == null ? false : this.tablePagination.current_page == 1;
        },
        isOnLastPage: function isOnLastPage() {
            return this.tablePagination == null ? false : this.tablePagination.current_page == this.tablePagination.last_page;
        },
        notEnoughPages: function notEnoughPages() {
            return this.totalPage < this.onEachSide * 2 + 4;
        },
        windowSize: function windowSize() {
            return this.onEachSide * 2 + 1;
        },
        windowStart: function windowStart() {
            if (!this.tablePagination || this.tablePagination.current_page <= this.onEachSide) {
                return 1;
            } else if (this.tablePagination.current_page >= this.totalPage - this.onEachSide) {
                return this.totalPage - this.onEachSide * 2;
            }

            return this.tablePagination.current_page - this.onEachSide;
        }
    },
    methods: {
        loadPage: function loadPage(page) {
            this.$dispatch('vuetable-pagination:change-page', page);
        },
        isCurrentPage: function isCurrentPage(page) {
            return page == this.tablePagination.current_page;
        }
    },
    events: {
        'vuetable:load-success': function vuetableLoadSuccess(tablePagination) {
            this.tablePagination = tablePagination;
        },
        'vuetable-pagination:set-options': function vuetablePaginationSetOptions(options) {
            for (var n in options) {
                this.$set(n, options[n]);
            }
        }
    }
};
if (module.exports.__esModule) module.exports = module.exports.default
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  if (!module.hot.data) {
    hotAPI.createRecord("_v-e34f2c2a", module.exports)
  } else {
    hotAPI.update("_v-e34f2c2a", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}
},{"vue":"vue","vue-hot-reload-api":1}],7:[function(require,module,exports){
Vue.component('vuetable-pagination', require('./components/VuetablePagination.vue'));

Vue.component('vuetable-pagination-dropdown', require('./components/VuetablePaginationDropdown.vue'));

Vue.component('vuetable', require('./components/Vuetable.vue'));
},{"./components/Vuetable.vue":3,"./components/VuetablePagination.vue":4,"./components/VuetablePaginationDropdown.vue":5}]},{},[7]);
