YUI.add('gallery-aui-live-search', function(A) {

/**
 * The LiveSearch Utility allow real-time filtering for DOM elements based on
 * a input query.
 *
 * @module aui-live-search
 */

var L = A.Lang,
	isString = L.isString,
	isObject = L.isObject,
	isFunction = L.isFunction,

	BLANK = '',
	DATA = 'data',
	DELAY = 'delay',
	HIDE = 'hide',
	INDEX = 'index',
	INPUT = 'input',
	LIVE_SEARCH = 'live-search',
	MATCH_REGEX = 'matchRegex',
	NODES = 'nodes',
	SHOW = 'show',
	STAR = '*',

	KEY_ENTER = 13,

	isNodeList = function(v) {
		return (v instanceof A.NodeList);
	};

/**
 * <p><img src="assets/images/aui-live-search/main.png"/></p>
 *
 * A base class for LiveSearch, providing:
 * <ul>
 *    <li>Real-time filtering for DOM elements based on a input query</li>
 * </ul>
 *
 * Quick Example:<br/>
 *
 * <pre><code>var instance = new A.LiveSearch({
 *	input: '#input',
 *	nodes: '#search .entry'
 * });
 * </code></pre>
 *
 * Check the list of <a href="LiveSearch.html#configattributes">Configuration Attributes</a> available for
 * LiveSearch.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class LiveSearch
 * @constructor
 * @extends Base
 */
var LiveSearch = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property LiveSearch.NAME
		 * @type String
		 * @static
		 */
		NAME: LIVE_SEARCH,

		/**
		 * Static property used to define the default attribute
		 * configuration for the LiveSearch.
		 *
		 * @property LiveSearch.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			/**
			 * <p>Function to extract the content from the node for the indexing. The
	         * default uses the <code>node.html()</code>. In case if you need to
	         * index the id of the nodes, here goes one example:</p>
			 *
			 * Example indexing the id of the node instead of the HTML:
			 *
			 * <pre><code>function(node) {
			 *  return node.attr('id');
			 * }
			 * </code></pre>
			 *
			 * @attribute data
			 * @default function(node) { return node.html(); }
			 * @type function
			 */
			data: {
				value: function(node) {
					return node.html();
				},
				validator: isFunction
			},

			/**
			 * Number of milliseconds the filter will be applied to the node list
	         * after the user stop typing.
			 *
			 * @attribute delay
			 * @default 250
			 * @type Number
			 */
			delay: {
				value: 250
			},

			/**
			 * Function to be executed to hide the node when the data of that node
	         * not matches with the filter.
			 *
			 * @attribute hide
			 * @default function(node) { return node.hide(); }
			 * @type function
			 */
			hide: {
				value: function(node) {
					return node.hide();
				},
				validator: isFunction
			},

			/**
			 * Index for the nodes content.
			 *
			 * @attribute index
			 * @default []
			 * @type Array
			 */
			index: {
				value: [],
				validator: isObject
			},

			/**
			 * The <code>value</code> of this input node is used to filter the
	         * results.
			 *
			 * @attribute input
			 * @type Node | String
			 */
			input: {
				setter: A.one
			},

			/**
			 * The input <code>value</code> need to matches with this RegExp to be
	         * accept as a filter (i.e., in order to accept only digits you
	         * could use /\d+/g).
			 *
			 * @attribute matchRegex
			 * @default (.)*
			 * @type RegExp
			 */
			matchRegex: {
				validator: function(v) {
					return (v instanceof RegExp);
				},
				value: /(.)*/g
			},

			/**
			 * Nodes to be indexed for the filtering.
			 *
			 * @attribute nodes
			 * @type Node | NodeList
			 */
			nodes: {
				setter: function(v) {
					return this._setNodes(v);
				}
			},

			/**
			 * Function to be executed to show the node when the data of that node
	         * matches with the filter.
			 *
			 * @attribute show
			 * @default function(node) { return node.show(); }
			 * @type function
			 */
			show: {
				value: function(node) {
					return node.show();
				},
				validator: isFunction
			}
		},

		EXTENDS: A.Base,

		prototype: {
			/**
			 * Stores the normalized query value given from
		     * <a href="LiveSearch.html#config__normalizeQuery">_normalizeQuery</a>.
			 *
			 * @property normalizedQuery
			 * @type String
			 * @protected
			 */
			normalizedQuery: BLANK,

			/**
			 * Stores the query value.
			 *
			 * @property query
			 * @type String
			 * @protected
			 */
			query: BLANK,

			/**
			 * Handles the <a href="YUI.html#method_later">later</a> Object.
			 *
			 * @property timer
			 * @type Object
			 * @protected
			 */
			timer: null,

			/**
			 * Construction logic executed during LiveSearch instantiation. Lifecycle.
			 *
			 * @method initializer
			 * @protected
			 */
			initializer: function() {
				var instance = this;

				instance.refreshIndex();

				instance.bindUI();
			},

			/**
			 * Bind the events on the LiveSearch UI. Lifecycle.
			 *
			 * @method bindUI
			 * @protected
			 */
			bindUI: function() {
				var instance = this;
				var input = instance.get(INPUT);

				input.on('keyup', A.bind(instance._inputKeyUp, instance));

				instance.publish('search', { defaultFn: instance.search });
			},

			/**
			 * Descructor lifecycle implementation for the LiveSearch class.
			 * Purges events attached to the node (and all child nodes).
			 *
			 * @method destroy
			 * @protected
			 */
			destroy: function() {
				var instance = this;
				var input = instance.get(INPUT);

				input.detach('keyup');
			},

			/**
			 * Filter the <a href="LiveSearch.html#config_nodes">nodes</a> based on
		     * the input value.
			 *
			 * @method filter
			 * @param {String} query Query to filter results
			 * @return {Array} Matched results.
			 */
			filter: function(query) {
				var instance = this;
				var results = [];
				var nodes = instance.get(NODES);
				var index = instance.get(INDEX);

				instance.query = query;
				instance.normalizedQuery = instance._normalizeQuery(query);

				var regex = new RegExp(
					instance.normalizedQuery
				);

				A.each(index, function(content, index) {
					var node = nodes.item(index);

					results.push({
						content: content,
						match: regex.test(content),
						node: node
					});
				});

				return results;
			},

			/**
			 * Refreshes the <a href="LiveSearch.html#config_index">index</a>.
			 *
			 * @method refreshIndex
			 */
			refreshIndex: function() {
				var instance = this;
				var index = [];

				var nodes = instance.get(NODES);

				nodes.refresh();

				nodes.each(function(node) {
					var content = L.trim(
						instance.get(DATA).apply(instance, [node]).toLowerCase()
					);

					index.push(content);
				});

				instance.set(INDEX, index);
			},

			/**
			 * Fires the search event.
			 *
			 * @method search
			 * @param {EventFacade} event search event facade
			 * @protected
			 */
			search: function(event) {
				var instance = this;
				var value = instance.get(INPUT).val();

				var results = instance.filter(value);

				A.each(results, function(search) {
					var node = search.node;

					if (search.match) {
						instance.get(SHOW).apply(instance, [node]);
					}
					else {
						instance.get(HIDE).apply(instance, [node]);
					}
				});

				event.liveSearch.results = results;
			},

			/**
			 * Normalize the input query. With <code>trim</code>,
		     * <code>matchRegex</code> and replace '*' to '' (on a regex empty match
		     * with everything like *).
			 *
			 * @method _normalizeQuery
			 * @param {String} query Query to filter results
			 * @protected
			 * @return {String}
			 */
			_normalizeQuery: function(query) {
				var instance = this;
				var matchRegex = instance.get(MATCH_REGEX);

				// trim the user query and lowercase it
				query = L.trim( query.toLowerCase() );

				// match with the matchRegex
				query = query.match(matchRegex).join(BLANK);

				// replace on the query '*' to '', on a regex empty match with everything like *
				query = query.replace(STAR, BLANK);

				query = A.Lang.String.escapeRegEx(query);

				return query;
			},

			/**
			 * Fires the keyup event on
		     * <a href="LiveSearch.html#config_input">input</a>.
			 *
			 * @method _inputKeyUp
			 * @param {EventFacade} event keyup event facade
			 * @protected
			 */
			_inputKeyUp: function(event) {
				var instance = this;
				var delay = instance.get(DELAY);
				var keyCode = event.keyCode;

				if (keyCode = KEY_ENTER) {
					event.halt();
				}

				if (isObject(instance.timer)) {
					instance.timer.cancel();
				}

				instance.timer = A.later(delay, instance, function() {
					instance.fire('search', {
						liveSearch: {
							inputEvent: event
						}
					});
				});
			},

			/**
			 * Setter for <a href="LiveSearch.html#config_nodes">nodes</a>.
			 *
			 * @method _setNodes
			 * @param {Node | NodeList | String} v
			 * @protected
			 * @return {Node | NodeList | String}
			 */
			_setNodes: function(v) {
				var instance = this;

				if (isNodeList(v)) {
					return v;
				}
				else if (isString(v)) {
					return A.all(v);
				}

				return new A.NodeList([v]);
			}
		}
	}
);

A.LiveSearch = LiveSearch;


}, 'gallery-2011.02.09-21-32' ,{requires:['gallery-aui-base'], skinnable:false});
