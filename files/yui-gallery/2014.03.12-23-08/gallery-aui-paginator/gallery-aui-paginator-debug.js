YUI.add('gallery-aui-paginator', function(A) {

/**
 * The Paginator Utility - The Paginator widget provides a set of controls to navigate through paged data.
 *
 * @module aui-paginator
 */

var L = A.Lang,
	isArray = L.isArray,
	isBoolean = L.isBoolean,
	isFunction = L.isFunction,
	isNumber = L.isNumber,
	isObject = L.isObject,
	isString = L.isString,

	ALWAYS_VISIBLE = 'alwaysVisible',
	BOUNDING_BOX = 'boundingBox',
	CIRCULAR = 'circular',
	CONTAINER = 'container',
	CONTAINERS = 'containers',
	CONTENT = 'content',
	CURRENT = 'current',
	DOT = '.',
	FIRST = 'first',
	FIRST_PAGE_LINK = 'firstPageLink',
	FIRST_PAGE_LINK_LABEL = 'firstPageLinkLabel',
	LAST = 'last',
	LAST_PAGE_LINK = 'lastPageLink',
	LAST_PAGE_LINK_LABEL = 'lastPageLinkLabel',
	LINK = 'link',
	MAX_PAGE_LINKS = 'maxPageLinks',
	NEXT = 'next',
	NEXT_PAGE_LINK = 'nextPageLink',
	NEXT_PAGE_LINK_LABEL = 'nextPageLinkLabel',
	PAGE = 'page',
	PAGE_CONTAINER_TEMPLATE = 'pageContainerTemplate',
	PAGE_LINK_CONTENT = 'pageLinkContent',
	PAGE_LINK_TEMPLATE = 'pageLinkTemplate',
	PAGE_REPORT_EL = 'pageReportEl',
	PAGE_REPORT_LABEL_TEMPLATE = 'pageReportLabelTemplate',
	PAGINATOR = 'paginator',
	PER = 'per',
	PREV = 'prev',
	PREV_PAGE_LINK = 'prevPageLink',
	PREV_PAGE_LINK_LABEL = 'prevPageLinkLabel',
	REPORT = 'report',
	ROWS = 'rows',
	ROWS_PER_PAGE = 'rowsPerPage',
	ROWS_PER_PAGE_EL = 'rowsPerPageEl',
	ROWS_PER_PAGE_OPTIONS = 'rowsPerPageOptions',
	SELECT = 'select',
	SPACE = ' ',
	STATE = 'state',
	TEMPLATE = 'template',
	TOTAL = 'total',
	TOTAL_EL = 'totalEl',
	TOTAL_LABEL = 'totalLabel',
	TOTAL_PAGES = 'totalPages',

	concat = function() {
		return Array.prototype.slice.call(arguments).join(SPACE);
	},

	isNodeList = function(v) {
		return (v instanceof A.NodeList);
	},

	num = function(n) {
		return parseInt(n, 10) || 0;
	},

	getCN = A.ClassNameManager.getClassName,

	CSS_PAGINATOR = getCN(PAGINATOR),
	CSS_PAGINATOR_CONTAINER = getCN(PAGINATOR, CONTAINER),
	CSS_PAGINATOR_CONTENT = getCN(PAGINATOR, CONTENT),
	CSS_PAGINATOR_CURRENT_PAGE = getCN(PAGINATOR, CURRENT, PAGE),
	CSS_PAGINATOR_FIRST_LINK = getCN(PAGINATOR, FIRST, LINK),
	CSS_PAGINATOR_LAST_LINK = getCN(PAGINATOR, LAST, LINK),
	CSS_PAGINATOR_LINK = getCN(PAGINATOR, LINK),
	CSS_PAGINATOR_NEXT_LINK = getCN(PAGINATOR, NEXT, LINK),
	CSS_PAGINATOR_PAGE_CONTAINER = getCN(PAGINATOR, PAGE, CONTAINER),
	CSS_PAGINATOR_PAGE_LINK = getCN(PAGINATOR, PAGE, LINK),
	CSS_PAGINATOR_PAGE_REPORT = getCN(PAGINATOR, CURRENT, PAGE, REPORT),
	CSS_PAGINATOR_PREV_LINK = getCN(PAGINATOR, PREV, LINK),
	CSS_PAGINATOR_ROWS_PER_PAGE = getCN(PAGINATOR, ROWS, PER, PAGE),
	CSS_PAGINATOR_TOTAL = getCN(PAGINATOR, TOTAL),

	TOTAL_LABEL_TPL = '(Total {total})',
	PAGE_REPORT_LABEL_TPL = '({page} of {totalPages})',
	DEFAULT_OUTPUT_TPL = '{FirstPageLink} {PrevPageLink} {PageLinks} {NextPageLink} {LastPageLink} {CurrentPageReport} {Total} {RowsPerPageSelect}',

	GT_TPL = '&gt;',
	LT_TPL = '&lt;',
	FIRST_LINK_TPL = '<a href="#" class="'+concat(CSS_PAGINATOR_LINK, CSS_PAGINATOR_FIRST_LINK)+'"></a>',
	LAST_LINK_TPL = '<a href="#" class="'+concat(CSS_PAGINATOR_LINK, CSS_PAGINATOR_LAST_LINK)+'"></a>',
	NEXT_LINK_TPL = '<a href="#" class="'+concat(CSS_PAGINATOR_LINK, CSS_PAGINATOR_NEXT_LINK)+'"></a>',
	PAGE_CONTAINER_TPL = '<span></span>',
	PAGE_LINK_TPL = '<a href="#"></a>',
	PAGE_REPORT_TPL = '<span class="'+concat(CSS_PAGINATOR_PAGE_REPORT)+'"></span>',
	PREV_LINK_TPL = '<a href="#" class="'+concat(CSS_PAGINATOR_LINK, CSS_PAGINATOR_PREV_LINK)+'"></a>',
	ROWS_PER_PAGE_TPL = '<select class="'+CSS_PAGINATOR_ROWS_PER_PAGE+'"></select>',
	TOTAL_TPL = '<span class="'+concat(CSS_PAGINATOR_TOTAL)+'"></span>';

/**
 * <p><img src="assets/images/aui-paginator/main.png"/></p>
 *
 * A base class for Paginator, providing:
 * <ul>
 *    <li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *    <li>Set of controls to navigate through paged data</li>
 * </ul>
 *
 * Quick Example:<br/>
 *
 * <pre><code>var instance = new A.Paginator({
 *	containers: '.paginatorA',
 *	total: 10,
 *	maxPageLinks: 10,
 *	rowsPerPage: 1,
 *	rowsPerPageOptions: [ 1, 3, 5, 7 ]
 * }).render();
 * </code></pre>
 *
 * Check the list of <a href="Paginator.html#configattributes">Configuration Attributes</a> available for
 * Paginator.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class Paginator
 * @constructor
 * @extends Base
 */
var Paginator = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property Paginator.NAME
		 * @type String
		 * @static
		 */
		NAME: PAGINATOR,

		/**
		 * Static property used to define the default attribute
		 * configuration for the Paginator.
		 *
		 * @property Paginator.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			/**
			 * If true the Paginator will be always visible, even when the number
	         * of pages is 0. To hide the paginator controls automatically when
	         * there is no pages to display use <code>false</code>.
			 *
			 * @attribute alwaysVisible
			 * @default true
			 * @type boolean
			 */
			alwaysVisible: {
				value: true,
				validator: isBoolean
			},

			circular: {
				value: false,
				validator: isBoolean
			},

			/**
			 * The Paginator controls UI could be displayed in more than one
	         * container (i.e., in the header and footer of a list). Pass a
	         * <a href="NodeList.html">NodeList</a> or a selector to grab the
	         * containers.
			 *
			 * @attribute containers
			 * @default null
			 * @type Node | String
			 */
			containers: {
				writeOnce: true,
				setter: function(v) {
					var instance = this;

					if (isNodeList(v)) {
						return v;
					}
					else if (isString(v)) {
						return A.all(v);
					}

					return new A.NodeList([v]);
				}
			},

			/**
			 * The <a href="Node.html">Node</a> or template to be used as the
	         * first link element.
			 *
			 * @attribute firstPageLink
			 * @default Generated anchor element.
			 * @type Node | String
			 */
			firstPageLink: {
				setter: A.one,
				valueFn: function() {
					var label = this.get(FIRST_PAGE_LINK_LABEL);

					return A.Node.create(FIRST_LINK_TPL).html(label);
				}
			},

			/**
			 * The label used as content of the
	         * <a href="Paginator.html#config_firstPageLink">firstPageLink</a> element.
			 *
			 * @attribute firstPageLinkLabel
			 * @default 'first'
			 * @type String
			 */
			firstPageLinkLabel: {
				value: FIRST,
				validator: isString
			},

			/**
			 * The <a href="Node.html">Node</a> or template to be used as the
	         * last link element.
			 *
			 * @attribute lastPageLink
			 * @default Generated anchor element.
			 * @type Node | String
			 */
			lastPageLink: {
				setter: A.one,
				valueFn: function() {
					var label = this.get(LAST_PAGE_LINK_LABEL);

					return A.Node.create(LAST_LINK_TPL).html(label);
				}
			},

			/**
			 * The label used as content of the
	         * <a href="Paginator.html#config_lastPageLink">lastPageLink</a> element.
			 *
			 * @attribute lastPageLinkLabel
			 * @default 'last'
			 * @type String
			 */
			lastPageLinkLabel: {
				value: LAST,
				validator: isString
			},

			/**
			 * The max number of page links to be displayed. If lower than the
	         * total number of pages they are still navigable using next and prev
	         * links.
			 *
			 * @attribute maxPageLinks
			 * @default 10
			 * @type Number
			 */
			maxPageLinks: {
				value: 10,
				getter: function(v) {
					var totalPages = this.get(TOTAL_PAGES);

					// maxPageLinks cannot be bigger than totalPages
					return Math.min(totalPages, v);
				},
				validator: isNumber
			},

			/**
			 * The <a href="Node.html">Node</a> or template to be used as the
	         * next link element.
			 *
			 * @attribute nextPageLink
			 * @default Generated anchor element.
			 * @type Node | String
			 */
			nextPageLink: {
				setter: A.one,
				valueFn: function() {
					var label = this.get(NEXT_PAGE_LINK_LABEL);

					return A.Node.create(NEXT_LINK_TPL).html(label);
				}
			},

			/**
			 * The label used as content of the
	         * <a href="Paginator.html#config_nextPageLink">nextPageLink</a> element.
			 *
			 * @attribute nextPageLinkLabel
			 * @default 'next &gt;'
			 * @type String
			 */
			nextPageLinkLabel: {
				value: concat(NEXT, GT_TPL),
				validator: isString
			},

			/**
			 * Page to display on initial paint.
			 *
			 * @attribute page
			 * @default 1
			 * @type Number
			 */
			page: {
				setter: num,
				value: 1
			},

			/**
			 * HTML Template for the page links container.
			 *
			 * @attribute pageContainerTemplate
			 * @default Generated span HTML element.
			 * @type String
			 */
			pageContainerTemplate: {
				getter: function(v) {
					return A.Node.create(v).addClass(CSS_PAGINATOR_PAGE_CONTAINER);
				},
				value: PAGE_CONTAINER_TPL,
				validator: isString
			},

			/**
			 * <p>Function which set the content of the each page element. The passed
	         * function receive as arguments the reference for the page element
	         * node, the page number and the index of the page element.</p>
	         *
	         * Example:
	         *
	         * <pre><code>function(pageEl, pageNumber, index) {
			 *	 pageEl.html(pageNumber);
			 *	}</code></pre>
			 *
			 * @attribute pageLinkContent
			 * @default Basic function to set the html of the page element with the page number.
			 * @type function
			 */
			pageLinkContent: {
				value: function(pageEl, pageNumber, index) {
					pageEl.html(pageNumber);
				},
				validator: isFunction
			},

			/**
			 * HTML Template for the link elements.
			 *
			 * @attribute pageLinkTemplate
			 * @default Generated anchor HTML element.
			 * @type String
			 */
			pageLinkTemplate: {
				getter: function(v) {
					var node = A.Node.create(v);

					return node.addClass(
						concat(CSS_PAGINATOR_LINK, CSS_PAGINATOR_PAGE_LINK)
					);
				},
				value: PAGE_LINK_TPL,
				validator: isString
			},

			/**
			 * Node element to display the page report (i.e., (1 of 100)).
			 *
			 * @attribute pageReportEl
			 * @default Generated span HTML element.
			 * @type String
			 */
			pageReportEl: {
				setter: A.one,
				valueFn: function() {
					var label = this.get(PAGE_REPORT_LABEL_TEMPLATE);

					return A.Node.create(PAGE_REPORT_TPL).html(label);
				}
			},

			/**
			 * Template for the
	         * <a href="Paginator.html#config_pageReportEl">pageReportEl</a> content.
	         * Note the placeholders for the page {page} and the total pages
	         * {totalPages}.
			 *
			 * @attribute pageReportLabelTemplate
			 * @default '({page} of {totalPages})'
			 * @type String
			 */
			pageReportLabelTemplate: {
				getter: function() {
					var instance = this;

					return A.substitute(PAGE_REPORT_LABEL_TPL, {
						page: instance.get(PAGE),
						totalPages: instance.get(TOTAL_PAGES)
					});
				},
				validator: isString
			},

			/**
			 * The <a href="Node.html">Node</a> or template to be used as the
	         * prev link element.
			 *
			 * @attribute prevPageLink
			 * @default Generated anchor element.
			 * @type Node | String
			 */
			prevPageLink: {
				setter: A.one,
				valueFn: function() {
					var label = this.get(PREV_PAGE_LINK_LABEL);

					return A.Node.create(PREV_LINK_TPL).html(label);
				}
			},

			/**
			 * The label used as content of the
	         * <a href="Paginator.html#config_prevPageLink">prevPageLink</a> element.
			 *
			 * @attribute prevPageLinkLabel
			 * @default '&lt; prev'
			 * @type String
			 */
			prevPageLinkLabel: {
				value: concat(LT_TPL, PREV),
				validator: isString
			},

			/**
			 * Array to be displayed on the generated HTML Select element with the
	         * <a href="Paginator.html#config_rowsPerPage">rowsPerPage</a>
	         * information. (i.e., [1,3,5,7], will display these values on the
	         * select)
			 *
			 * @attribute rowsPerPageOptions
			 * @default []
			 * @type Array
			 */
			rowsPerPageOptions: {
				value: {},
				validator: isArray
			},

			/**
			 * Number of records constituting a "page".
			 *
			 * @attribute rowsPerPage
			 * @default 1
			 * @type Number
			 */
			rowsPerPage: {
				setter: num,
				value: 1
			},

			/**
			 * Node element to display the
	         * <a href="Paginator.html#config_rowsPerPage">rowsPerPage</a>.
			 *
			 * @attribute rowsPerPageEl
			 * @default Generated select HTML element.
			 * @type Node | String
			 */
			rowsPerPageEl: {
				setter: A.one,
				valueFn: function() {
					return A.Node.create(ROWS_PER_PAGE_TPL);
				}
			},

			/**
			 * Generates information to the <code>changeRequest</code> event. See
	         * <a href="Paginator.html#method_changeRequest">changeRequest</a>.
			 *
			 * @attribute state
			 * @default {}
			 * @type Object
			 */
			state: {
				setter: '_setState',
				getter: '_getState',
				value: {},
				validator: isObject
			},

			/**
			 * Template used to render controls. The string will be used as
	         * innerHTML on all specified container nodes. Bracketed keys (e.g.
	         * {pageLinks}) in the string will be replaced with an instance of the
	         * so named ui component.
			 *
			 * @attribute template
			 * @default '{FirstPageLink} {PrevPageLink} {PageLinks} {NextPageLink} {LastPageLink} {CurrentPageReport} {Total} {RowsPerPageSelect}'
			 * @type String
			 */
			template: {
				getter: '_getTemplate',
				writeOnce: true,
				value: DEFAULT_OUTPUT_TPL,
				validator: isString
			},

			/**
			 * Total number of records to paginate through.
			 *
			 * @attribute total
			 * @default 0
			 * @type Number
			 */
			total: {
				setter: function(v) {
					return this._setTotal(v);
				},
				value: 0,
				validator: isNumber
			},

			/**
			 * Node element to display the total information.
			 *
			 * @attribute totalEl
			 * @default Generated span HTML element.
			 * @type String
			 */
			totalEl: {
				setter: A.one,
				valueFn: function() {
					var label = this.get(TOTAL_LABEL);

					return A.Node.create(TOTAL_TPL).html(label);
				}
			},

			/**
			 * The label markup to the total information.
			 *
			 * @attribute totalLabel
			 * @default '(Total {total})'
			 * @type String
			 */
			totalLabel: {
				getter: function() {
					var instance = this;

					return A.substitute(TOTAL_LABEL_TPL, {
						total: instance.get(TOTAL)
					});
				},
				validator: isString
			},

			/**
			 * Number of pages. Calculated based on the
	         * <a href="Paginator.html#config_total">total</a> divided by the
	         * <a href="Paginator.html#config_rowsPerPage">rowsPerPage</a>.
			 *
			 * @attribute totalPages
			 * @default 0
			 * @type Number
			 */
			totalPages: {
				readOnly: true,
				getter: function(v) {
					return Math.ceil(
						this.get(TOTAL) / this.get(ROWS_PER_PAGE)
					);
				}
			}
		},

		prototype: {
			/**
			 * Store the last state object used on the <a href="Paginator.html#method_changeRequest">changeRequest</a> event.
			 *
			 * @property lastState
			 * @type Object | null
			 * @protected
			 */
			lastState: null,

			/**
			 * Cached template after <a href="YUI.html#method_substitute">YUI
		     * substitute</a> were applied.
			 *
			 * @property templatesCache
			 * @type String
			 * @protected
			 */
			templatesCache: null,

			/**
			 * Create the DOM structure for the Paginator. Lifecycle.
			 *
			 * @method renderUI
			 * @protected
			 */
			renderUI: function() {
				var instance = this;
				var containers = instance.get(CONTAINERS);

				containers.unselectable();

				instance._renderRowsPerPageOptions();

				instance._renderTemplateUI();

				containers.addClass(CSS_PAGINATOR_CONTAINER);
			},

			/**
			 * Bind the events on the Paginator UI. Lifecycle.
			 *
			 * @method bindUI
			 * @protected
			 */
			bindUI: function() {
				var instance = this;

				instance._delegateDOM();

				instance.publish('changeRequest');
				instance.after('stateChange', A.bind(instance._afterSetState, instance));
				instance.before('stateChange', A.bind(instance._beforeSetState, instance));

				// invoke _renderTemplateUI to recreate the template markup
				instance.after('maxPageLinksChange', A.bind(instance._renderTemplateUI, instance));
				instance.after('rowsPerPageChange', A.bind(instance._renderTemplateUI, instance));
				instance.after('totalChange', A.bind(instance._renderTemplateUI, instance));
			},

			/**
			 * Sync the Paginator UI. Lifecycle.
			 *
			 * @method syncUI
			 * @protected
			 */
			syncUI: function() {
				var instance = this;

				// fire changeRequest to the first state
				instance.changeRequest();
			},

			/**
			 * Descructor lifecycle implementation for the Paginator class.
			 * Purges events attached to the node (and all child nodes).
			 *
			 * @method destructor
			 * @protected
			 */
			destructor: function() {
				var instance = this;

				instance.get(CONTAINERS).remove(true);
			},

			/**
			 * Sync the Paginator links UI.
			 *
			 * @method _syncPageLinksUI
			 * @protected
			 */
			_syncPageLinksUI: function() {
				var instance = this;
				var containers = instance.get(CONTAINERS);
				var page = instance.get(PAGE);

				// creating range to show on the pageLinks, keep the current page on center
				var range = instance.calculateRange(page);

				// loop all containers
				containers.each(function(node) {
					var index = 0;
					var pageNumber = range.start;
					// query all anchor that represents the page links
					var pageLinks = node.all(DOT+CSS_PAGINATOR_PAGE_LINK);

					if (pageLinks) {
						pageLinks.removeClass(CSS_PAGINATOR_CURRENT_PAGE);

						// loop all pages from range.start to range.end
						while (pageNumber <= range.end) {
							// get the anchor pageEl and set the label to be the number of the current page
							var pageEl = pageLinks.item(index);

							// invoke the handler to set the page link content
							instance.get(PAGE_LINK_CONTENT).apply(instance, [pageEl, pageNumber, index]);

							// uset an attribute page on the anchor to retrieve later when _onClickPageLinkEl fires
							pageEl.setAttribute(PAGE, pageNumber);

							if (pageNumber == page) {
								// search for the current page and addClass saying it's the current
								pageEl.addClass(CSS_PAGINATOR_CURRENT_PAGE);
							}

							index++;
							pageNumber++;
						}
					}
				});
			},

			/**
			 * Sync the Paginator page report UI.
			 *
			 * @method _syncPageLinksUI
			 * @protected
			 */
			_syncPageReportUI: function(event) {
				var instance = this;
				var containers = instance.get(CONTAINERS);

				containers.each(function(node) {
					// search for the respective pageReportEl
					var pageReportEl = node.one(DOT+CSS_PAGINATOR_PAGE_REPORT);

					if (pageReportEl) {
						// update its label with the page report template, eg. (1 of 100)
						pageReportEl.html(
							instance.get(PAGE_REPORT_LABEL_TEMPLATE)
						);
					}
				});
			},

			/**
			 * Create a range to display on the pageLinks, keep the current page on
		     * center.
			 *
			 * @method calculateRange
			 * @param {Type} name description
			 * @return {Object} Object containing the start and end information.
			 */
			calculateRange: function(page) {
				var instance = this;
				var totalPages = instance.get(TOTAL_PAGES);
				var maxPageLinks = instance.get(MAX_PAGE_LINKS);
				// calculates the center page link index
				var offset = Math.ceil(maxPageLinks/2);

				// find the start range to show on the page links
				// Math.min pick the minimum value when the page number is near totalPages value
				// this fixes when the offset is small and generates less than [maxPageLinks] page links
				var start = Math.min(
					// Math.max(x, 1) doesn't allow negative or zero values
					Math.max(page - offset, 1), (totalPages - maxPageLinks + 1)
				);

				// find the end range, the range has always maxPageLinks size
				// so, (start + maxPageLinks - 1) try to find the end range
				// Math.min with totalPages doesn't allow values bigger than totalPages
				var end = Math.min(start + maxPageLinks - 1, totalPages);

				return {
					start: start,
					end: end
				};
			},

			/**
			 * Fires <a href="Paginator.html#event_changeRequest">changeRequest</a>
		     * event. This is the most important event because it's responsible to
		     * update the UI, invoked <code>.setState(newState)</code> to update the
		     * UI.
			 *
			 * @method changeRequest
			 */
			changeRequest: function() {
				var instance = this;
				var state = instance.get(STATE);

				if (instance.get(CIRCULAR)) {
					var page = state.page;
					var totalPages = state.totalPages;

					if (state.before && (state.before.page == page)) {
						if (page <= 1) {
							state.page = totalPages;
						}
						else if (page >= totalPages) {
							state.page = 1;
						}

						instance.set(STATE, state);
					}
				}

				instance.fire('changeRequest', { state: state });
			},

			/**
			 * Loop through all
		     * <a href="Paginator.html#config_containers">containers</a> and execute the
		     * passed callback.
			 *
			 * @method eachContainer
			 * @param {function} fn Callback
			 */
			eachContainer: function(fn) {
				var instance = this;

				instance.get(CONTAINERS).each(function(node) {
					if (node) {
						fn.apply(instance, arguments);
					}
				});
			},

			/**
			 * Check if there is a next page.
			 *
			 * @method hasNextPage
			 * @return {boolean}
			 */
			hasNextPage: function() {
				var instance = this;

				return instance.hasPage(
					instance.get(PAGE) + 1
				);
			},

			/**
			 * Check if the <code>page</code> exists.
			 *
			 * @method hasPage
			 * @param {Number} page
			 * @return {boolean}
			 */
			hasPage: function(page) {
				var instance = this;
				var totalPages = instance.get(TOTAL_PAGES);

				return ( (page > 0) && (page <= totalPages) );
			},

			/**
			 * Check if there is a previous page.
			 *
			 * @method hasPrevPage
			 * @return {boolean}
			 */
			hasPrevPage: function() {
				var instance = this;

				return instance.hasPage(
					instance.get(PAGE) - 1
				);
			},

			/**
			 * Render rows per page options.
			 *
			 * @method _renderRowsPerPageOptions
			 * @protected
			 */
			_renderRowsPerPageOptions: function() {
				var instance = this;
				var i = 0;
				var rowsPerPageEl = instance.get(ROWS_PER_PAGE_EL);
				var rowsPerPageOptions = instance.get(ROWS_PER_PAGE_OPTIONS);

				A.each(rowsPerPageOptions, function(value) {
					rowsPerPageEl.getDOM().options[i++] = new Option(value, value);
				});
			},

			/**
			 * Render the UI controls based on the
		     * <a href="Paginator.html#config_template">template</a>.
			 *
			 * @method _renderTemplateUI
			 * @protected
			 */
			_renderTemplateUI: function() {
				var instance = this;
				var containers = instance.get(CONTAINERS);

				instance.templatesCache = null;

				// loading HTML template on the containers
				containers.html(
					instance.get(TEMPLATE)
				);

				// sync pageLinks
				instance._syncPageLinksUI();

				// sync page report, eg. (1 of 100)
				instance._syncPageReportUI();

				// bind the DOM events after _renderTemplateUI
				instance._bindDOMEvents();
			},

			/**
			 * Public setter for <a href="Paginator.html#config_state">state</a>.
			 *
			 * @method setState
			 * @param {Object} v New state object.
			 */
			setState: function(v) {
				var instance = this;

				instance.set(STATE, v);
			},

			/**
			 * Private getter for <a href="Paginator.html#config_state">state</a>.
			 *
			 * @method _getState
			 * @param {Object} v Current state object.
			 * @protected
			 * @return {Object} State object.
			 */
			_getState: function(v) {
				var instance = this;

				return {
					before: instance.lastState,
					paginator: instance,
					page: instance.get(PAGE),
					total: instance.get(TOTAL),
					totalPages: instance.get(TOTAL_PAGES),
					rowsPerPage: instance.get(ROWS_PER_PAGE)
				};
			},

			/**
			 * Getter for <a href="Paginator.html#config_template">template</a>.
			 *
			 * @method _getTemplate
			 * @param {String} v Current template.
			 * @protected
			 * @return {String} Current template.
			 */
			_getTemplate: function(v) {
				var instance = this;

				var outer = function(key) {
					return instance.get(key).outerHTML();
				};

				// if template is not cached...
				if (!instance.templatesCache) {
					var page = 0;
					var totalPages = instance.get(TOTAL_PAGES);
					var maxPageLinks = instance.get(MAX_PAGE_LINKS);
					var pageContainer = instance.get(PAGE_CONTAINER_TEMPLATE);

					// crate the anchor to be the page links
					while (page++ < maxPageLinks) {
						pageContainer.append(
							instance.get(PAGE_LINK_TEMPLATE)
						);
					}

					// substitute the {keys} on the templates with the real outerHTML templates
					instance.templatesCache = A.substitute(v,
						{
							CurrentPageReport: outer(PAGE_REPORT_EL),
							FirstPageLink: outer(FIRST_PAGE_LINK),
							LastPageLink: outer(LAST_PAGE_LINK),
							NextPageLink: outer(NEXT_PAGE_LINK),
							PageLinks: pageContainer.outerHTML(),
							PrevPageLink: outer(PREV_PAGE_LINK),
							RowsPerPageSelect: outer(ROWS_PER_PAGE_EL),
							Total: outer(TOTAL_EL)
						}
					);
				}

				return instance.templatesCache;
			},

			/**
			 * Private setter for <a href="Paginator.html#config_state">state</a>.
			 *
			 * @method _setState
			 * @param {Object} v New state object.
			 * @protected
			 * @return {Object}
			 */
			_setState: function(v) {
				var instance = this;

				A.each(v, function(value, key) {
					instance.set(key, value);
				});

				return v;
			},

			/**
			 * Setter for <a href="Paginator.html#config_total">total</a>.
			 *
			 * @method _setTotal
			 * @param {Number} v
			 * @protected
			 * @return {Number}
			 */
			_setTotal: function(v) {
				var instance = this;
				var alwaysVisible = instance.get(ALWAYS_VISIBLE);
				var containers = instance.get(CONTAINERS);

				// if !alwaysVisible and there is nothing to show, hide it
				if (!alwaysVisible && (v === 0)) {
					containers.hide();
				}
				else {
					containers.show();
				}

				return v;
			},

			/**
			 * Fires after the value of the
		     * <a href="Paginator.html#config_state">state</a> attribute change.
			 *
			 * @method _afterSetState
			 * @param {EventFacade} event
			 * @protected
			 */
			_afterSetState: function(event) {
				var instance = this;

				instance._syncPageLinksUI();
				instance._syncPageReportUI();
			},

			/**
			 * Fires before the value of the
			 * <a href="Paginator.html#config_state">state</a> attribute change.
			 *
			 * @method _beforeSetState
			 * @param {EventFacade} event
			 * @protected
			 */
			_beforeSetState: function(event) {
				var instance = this;

				instance.lastState = event.prevVal;
			},

			/**
			 * Click event handler for the
		     * <a href="Paginator.html#config_firstLinkEl">firstLinkEl</a>.
			 *
			 * @method _onClickFirstLinkEl
		     * @param {EventFacade} event
			 * @protected
			 */
			_onClickFirstLinkEl: function(event) {
				var instance = this;

				instance.set(PAGE, 1);

				instance.changeRequest();

				event.halt();
			},

			/**
			 * Click event handler for the
		     * <a href="Paginator.html#config_prevLinkEl">prevLinkEl</a>.
			 *
			 * @method _onClickPrevLinkEl
		     * @param {EventFacade} event
			 * @protected
			 */
			_onClickPrevLinkEl: function(event) {
				var instance = this;

				var page = instance.get(PAGE);

				instance.set(PAGE, (instance.hasPrevPage() ? page - 1 : page));

				instance.changeRequest();

				event.halt();
			},

			/**
			 * Click event handler for the
		     * <a href="Paginator.html#config_pageLinkEl">pageLinkEl</a>.
			 *
			 * @method _onClickPageLinkEl
		     * @param {EventFacade} event
			 * @protected
			 */
			_onClickPageLinkEl: function(event) {
				var instance = this;
				var pageNumber = event.currentTarget.attr(PAGE);

				instance.set(PAGE, pageNumber);

				instance.changeRequest();

				event.halt();
			},

			/**
			 * Click event handler for the
		     * <a href="Paginator.html#config_nextLinkEl">nextLinkEl</a>.
			 *
			 * @method _onClickNextLinkEl
		     * @param {EventFacade} event
			 * @protected
			 */
			_onClickNextLinkEl: function(event) {
				var instance = this;

				var page = instance.get(PAGE);

				instance.set(PAGE, (instance.hasNextPage() ? page + 1 : page));

				instance.changeRequest();

				event.halt();
			},

			/**
			 * Click event handler for the
		     * <a href="Paginator.html#config_lastLinkEl">lastLinkEl</a>.
			 *
			 * @method _onClickLastLinkEl
		     * @param {EventFacade} event
			 * @protected
			 */
			_onClickLastLinkEl: function(event) {
				var instance = this;
				var totalPages = instance.get(TOTAL_PAGES);

				instance.set(PAGE, totalPages);

				instance.changeRequest();

				event.halt();
			},

			/**
			 * Bind DOM events on the Paginator UI.
			 *
			 * @method _bindDOMEvents
			 * @protected
			 */
			_bindDOMEvents: function() {
				var instance = this;

				// loop all containers...
				instance.eachContainer(function(node) {
					// search for selects rows per page elements
					var rowsPerPageEl = node.one(DOT+CSS_PAGINATOR_ROWS_PER_PAGE);

					if (rowsPerPageEl) {
						// update the value with the current rowsPerPage
						rowsPerPageEl.val(
							instance.get(ROWS_PER_PAGE)
						);

						// detach change event
						rowsPerPageEl.detach('change');

						// bind change event to update the rowsPerPage
						rowsPerPageEl.on('change', function(event) {
							var rowsPerPage = instance.get(ROWS_PER_PAGE);

							try {
								// prevent IE error when first access .val() on A.Node when wraps a SELECT
								rowsPerPage = event.target.val();
							}
							catch(e) {}

							// reset the page before render the pageLinks again
							instance.set(PAGE, 1);

							// set rowsPerPage, this will render the UI again
							instance.set(ROWS_PER_PAGE, rowsPerPage);

							instance.changeRequest();
						});
					}
				});
			},

			/**
			 * Delegate DOM events on the Paginator UI.
			 *
			 * @method _delegateDOM
			 * @protected
			 */
			_delegateDOM: function() {
				var instance = this;

				instance.eachContainer(function(node, i) {
					node.delegate('click', A.bind(instance._onClickFirstLinkEl, instance), DOT+CSS_PAGINATOR_FIRST_LINK);
					node.delegate('click', A.bind(instance._onClickPrevLinkEl, instance), DOT+CSS_PAGINATOR_PREV_LINK);
					node.delegate('click', A.bind(instance._onClickPageLinkEl, instance), DOT+CSS_PAGINATOR_PAGE_LINK);
					node.delegate('click', A.bind(instance._onClickNextLinkEl, instance), DOT+CSS_PAGINATOR_NEXT_LINK);
					node.delegate('click', A.bind(instance._onClickLastLinkEl, instance), DOT+CSS_PAGINATOR_LAST_LINK);
				});
			}
		}
	}
);

A.Paginator = Paginator;


}, 'gallery-2011.02.09-21-32' ,{requires:['gallery-aui-base','substitute'], skinnable:true});
