YUI.add('gallery-aui-autocomplete', function(A) {

/**
 * The AutoComplete Utility
 *
 * @module aui-autocomplete
 */

var Lang = A.Lang,
isArray = Lang.isArray,
isString = Lang.isString,
isNull = Lang.isNull,
isFunction = Lang.isFunction,

getClassName = A.ClassNameManager.getClassName,

ALERT = 'alert',
CONTENT = 'content',
HELPER = 'helper',
HIDDEN = 'hidden',
ICON = 'icon',
ITEM = 'item',
LIST = 'list',
LOADING = 'loading',
NAME = 'autocomplete',
RESET = 'reset',
RESULTS = 'results',
SELECTED = 'selected',

ICON_DEFAULT = 'circle-triangle-b',
ICON_ERROR = ALERT,
ICON_LOADING = LOADING,

CSS_HIGLIGHT = getClassName(NAME, SELECTED),
CSS_HIDDEN = getClassName(HELPER, HIDDEN),
CSS_LIST_ITEM = getClassName(NAME, LIST, ITEM),
CSS_RESULTS_LIST = getClassName(HELPER, RESET),
CSS_RESULTS_OVERLAY = getClassName(NAME, RESULTS),
CSS_RESULTS_OVERLAY_CONTENT = getClassName(NAME, RESULTS, CONTENT),

KEY_BACKSPACE = 8,
KEY_TAB = 9,
KEY_ENTER = 13,
KEY_SHIFT = 16,
KEY_CTRL = 17,
KEY_ALT = 18,
KEY_CAPS_LOCK = 20,
KEY_ESC = 27,
KEY_PAGEUP = 33,
KEY_END = 35,
KEY_HOME = 36,
KEY_UP = 38,
KEY_DOWN = 40,
KEY_RIGHT = 39,
KEY_LEFT = 37,
KEY_PRINT_SCREEN = 44,
KEY_INSERT = 44,
KEY_KOREAN_IME = 229,

OVERLAY_ALIGN = {
	node: null,
	points: ['tl', 'bl']
},

BOUNDING_BOX = 'boundingBox',
CONTENT_BOX = 'contentBox';

/**
 * <p><img src="assets/images/aui-autocomplete/main.png"/></p>
 *
 * A base class for AutoComplete, providing:
 * <ul>
 *    <li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *    <li>Presenting users choices based on their input</li>
 *    <li>Separating selected items</li>
 *    <li>Keyboard interaction for selecting items</li>
 * </ul>
 *
 * Quick Example:<br/>
 * 
 * <pre><code>var instance = new A.AutoComplete({
 *	dataSource: [['AL', 'Alabama', 'The Heart of Dixie'],
 * 	['AK', 'Alaska', 'The Land of the Midnight Sun'],
 *	['AZ', 'Arizona', 'The Grand Canyon State']],
 *	schema: {
 *		resultFields: ['key', 'name', 'description']
 *	},
 *	matchKey: 'name',
 *	delimChar: ',',
 *	typeAhead: true,
 *	contentBox: '#myAutoComplete'
 * }).render();
 * </code></pre>
 *
 * Check the list of <a href="AutoComplete.html#configattributes">Configuration Attributes</a> available for
 * AutoComplete.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class AutoComplete
 * @constructor
 * @extends Component
 */

var AutoComplete = A.Component.create(
	{

		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property AutoComplete.NAME
		 * @type String
		 * @static
		 */

		NAME: NAME,

		/**
		 * Static property used to define the default attribute
		 * configuration for the AutoComplete.
		 *
		 * @property AutoComplete.ATTRS
		 * @type Object
		 * @static
		 */

		ATTRS: {
			/**
			 * Always show the results container, instead of only showing when the 
			 * user is requesting them.
			 * 
			 * @attribute alwaysShowContainer
			 * @default false
			 * @type Boolean
			 */
			alwaysShowContainer: {
				value: false
			},

			/**
			 * Automatically highlight the first item in the list when the results are
			 * made visible.
			 * 
			 * @attribute autoHighlight
			 * @default true
			 * @type Boolean
			 */
			autoHighlight: {
				value: true
			},

			/**
			 * If set to true, the <a href="AutoComplete.html#method_filterResults">filterResults</a> 
			 * method will be run on the response from the data source.
			 *
			 * @attribute applyLocalFilter
			 * @default true
			 * @type Boolean
			 */
			applyLocalFilter: {
				value: null
			},

			/**
			 * To use a button
			 * 
			 * @attribute button
			 * @default true
			 * @type Boolean
			 * @deprecated
			 */
			button: {
				value: true
			},

			/**
			 * The data source that results will be read from. This can either be
			 * an existing <a href="DataSource.html">DataSource</a> object, or it can be a
			 * value that would be passed to <a href="DataSource.html">DataSource</a>.
			 * 
			 * @attribute dataSource
			 * @default null
			 * @type Object | String | Function | Array
			 */
			dataSource: {
				value: null
			},

			/**
			 * The type of the data source passed into <a href="AutoComplete.html#config_dataSource">dataSource</a>.
			 * This can be used to explicitly declare what kind of <a href="DataSource.html">DataSource</a> object will
			 * be created.
			 * 
			 * @attribute dataSourceType
			 * @default null
			 * @type String
			 */
			dataSourceType: {
				value: null
			},

			/**
			 * The character used to indicate the beginning or ending of a new value. Most commonly used
			 * is a ",".
			 * 
			 * @attribute delimChar
			 * @default null
			 * @type String
			 */
			delimChar: {
				value: null,
				setter: function(value) {
					if (isString(value) && (value.length > 0)) {
						value = [value];
					}
					else if (!isArray(value)) {
						value = A.Attribute.INVALID_VALUE;
					}

					return value;
				}
			},

			/**
			 * If <a href="AutoComplete.html#config_typeAhead">typeAhead</a> is true, this
			 * will clear a selection when the overlay closes unless a user explicitly selects an item.
			 * 
			 * @attribute forceSelection
			 * @default false
			 * @type Boolean
			 */
			forceSelection: {
				value: false
			},

			/**
			 * The input field which will recieve the users input.
			 *
			 * @attribute input
			 * @default null
			 * @type String | Node
			 */
			input: {
				value: null
			},

			/**
			 * The key or numeric index in the schema to match the result against.
			 *
			 * @attribute matchKey
			 * @default 0
			 * @type String | Number
			 */
			matchKey: {
				value: 0
			},

			/**
			 * The maximum number of results to display.
			 *
			 * 
			 * @attribute maxResultsDisplayed
			 * @default 10
			 * @type Number
			 */
			maxResultsDisplayed: {
				value: 10
			},

			/**
			 * The minimum number of characters required to query the data source.
			 *
			 * @attribute minQueryLength
			 * @default 1
			 * @type Number
			 */
			minQueryLength: {
				value: 1
			},

			/**
			 * The amount of time in seconds to delay before submitting the query.
			 *
			 * @attribute queryDelay
			 * @default 0.2
			 * @type Number
			 */
			queryDelay: {
				value: 0.2,
				getter: function(value) {
					return value * 1000;
				}
			},

			/**
			 * When IME usage is detected or interval detection is explicitly enabled,
			 * AutoComplete will detect the input value at the given interval and send a
			 * query if the value has changed.
			 *
			 * @attribute queryInterval
			 * @default 0.5
			 * @type Number
			 */
			queryInterval: {
				value: 0.5,
				getter: function(value) {
					return value * 1000;
				}
			},

			/**
			 * When <a href="AutoComplete.html#config_applyLocalFilter">applyLocalFilter</a> is true,
			 * setting this to true will match only results with the same case.
			 * 
			 * @attribute queryMatchCase
			 * @default false
			 * @type Boolean
			 */
			queryMatchCase: {
				value: false
			},

			/**
			 * When <a href="AutoComplete.html#config_applyLocalFilter">applyLocalFilter</a> is true,
			 * setting this to true will match results which contain the query anywhere in the text,
			 * instead of just matching just items that start with the query.
			 * 
			 * @attribute queryMatchContains
			 * @default false
			 * @type Boolean
			 */
			queryMatchContains: {
				value: false
			},

			/**
			 * For IO DataSources, AutoComplete will automatically insert a "?" between the server URI and 
			 * the encoded query string. To prevent this behavior, you can
			 * set this value to false. If you need to customize this even further, you
			 * can override the <a href="AutoComplete.html#method_generateRequest">generateRequest</a> method.
			 *
			 * @attribute queryQuestionMark
			 * @default true
			 * @type Boolean
			 */
			queryQuestionMark: {
				value: true
			},

			/**
			 * A valid configuration object for any of <a href="module_datasource.html">DataSource</a> schema plugins.
			 *
			 * @attribute schema
			 * @default null
			 * @type Object
			 */
			schema: {
				value: null
			},

			/**
			 * A valid type of <a href="module_datasource.html">DataSource</a> schema plugin, such as array, json, xml, etc.
			 *
			 * @attribute schemaType
			 * @default array
			 * @type String
			 */
			schemaType: {
				value: '',
				validator: isString
			},

			/**
			 * Whether or not the input field should be updated with selections.
			 *
			 * @attribute suppressInputUpdate
			 * @default false
			 * @type Boolean
			 */
			suppressInputUpdate: {
				value: false
			},

			/**
			 * If <a href="AutoComplete.html#config_autoHighlight">autoHighlight</a> is enabled, whether or not the 
			 * input field should be automatically updated with the first result as the user types, 
			 * automatically selecting the portion of the text the user has not typed yet.
			 *
			 * @attribute typeAhead
			 * @default false
			 * @type Boolean
			 */
			typeAhead: {
				value: false
			},

			/**
			 * If <a href="AutoComplete.html#config_typeAhead">typeAhead</a> is true, number of seconds 
			 * to delay before updating the input. In order to prevent certain race conditions, this value must
			 * always be greater than the <a href="AutoComplete.html#config_queryDelay">queryDelay</a>.
			 *
			 * @attribute typeAheadDelay
			 * @default 0.2
			 * @type Number
			 */
			typeAheadDelay: {
				value: 0.2,
				getter: function(value) {
					return value * 1000;
				}
			},

			/**
			 * The unique ID of the input element.
			 *
			 * @attribute uniqueName
			 * @default null
			 * @type String
			 */
			uniqueName: {
				value: null
			}
		},

		prototype: {
			/**
			 * Construction logic executed during AutoComplete instantiation. Lifecycle.
			 *
			 * @method initializer
			 * @protected
			 */
			initializer: function(config) {
				var instance = this;

				instance._overlayAlign = A.mix({}, OVERLAY_ALIGN);

				instance._createDataSource();
			},

			/**
			 * Create the DOM structure for the AutoComplete. Lifecycle.
			 *
			 * @method renderUI
			 * @protected
			 */
			renderUI: function() {
				var instance = this;

				instance._renderInput();
				instance._renderOverlay();
			},

			/**
			 * Bind the events on the AutoComplete UI. Lifecycle.
			 *
			 * @method bindUI
			 * @protected
			 */
			bindUI: function() {
				var instance = this;

				var button = instance.button;
				var inputNode = instance.inputNode;

				instance.dataSource.on('request', A.bind(button.set, button, ICON, ICON_LOADING));

				inputNode.on('blur', instance._onTextboxBlur, instance);
				inputNode.on('focus', instance._onTextboxFocus, instance);
				inputNode.on('keydown', instance._onTextboxKeyDown, instance);
				inputNode.on('keypress', instance._onTextboxKeyPress, instance);
				inputNode.on('keyup', instance._onTextboxKeyUp, instance);

				var overlayBoundingBox = instance.overlay.get(BOUNDING_BOX);

				overlayBoundingBox.on('click', instance._onContainerClick, instance);
				overlayBoundingBox.on('mouseout', instance._onContainerMouseout, instance);
				overlayBoundingBox.on('mouseover', instance._onContainerMouseover, instance);
				overlayBoundingBox.on('scroll', instance._onContainerScroll, instance);

				/**
				 * Handles the containerCollapse event. Fired when the container is hidden.
				 *
				 * @event containerCollapse
				 * @param {Event.Facade} event The containerCollapse event.
				 */
				instance.publish('containerCollapse');

				/**
				 * Handles the containerExpand event. Fired when the container is shown.
				 *
				 * @event containerExpand
				 * @param {Event.Facade} event The containerExpand event.
				 */
				instance.publish('containerExpand');

				/**
				 * Handles the containerPopulate event. Fired when the container is populated.
				 *
				 * @event containerPopulate
				 * @param {Event.Facade} event The containerPopulate event.
				 */
				instance.publish('containerPopulate');

				/**
				 * Handles the dataError event. Fired when there is an error accessing the data.
				 *
				 * @event dataError
				 * @param {Event.Facade} event The dataError event.
				 */
				instance.publish('dataError');

				/**
				 * Handles the dataRequest event. Fired when ever a query is sent to the data source.
				 *
				 * @event dataRequest
				 * @param {Event.Facade} event The dataRequest event.
				 */
				instance.publish('dataRequest');

				/**
				 * Handles the dataReturn event. Fired when data successfully comes back from the data request.
				 *
				 * @event dataReturn
				 * @param {Event.Facade} event The dataReturn event.
				 */
				instance.publish('dataReturn');

				/**
				 * Handles the itemArrowFrom event. Fired when the user navigates via the keyboard away from
				 * a selected item.
				 *
				 * @event itemArrowFrom
				 * @param {Event.Facade} event The itemArrowFrom event.
				 */
				instance.publish('itemArrowFrom');

				/**
				 * Handles the itemArrowTo event. Fired when the user navigates via the keyboard to a selected item.
				 *
				 * @event itemArrowTo
				 * @param {Event.Facade} event The itemArrowTo event.
				 */
				instance.publish('itemArrowTo');

				/**
				 * Handles the itemMouseOut event. Fired when the user mouses away from an item.
				 *
				 * @event itemMouseOut
				 * @param {Event.Facade} event The itemMouseOut event.
				 */
				instance.publish('itemMouseOut');

				/**
				 * Handles the itemMouseOver event. Fired when the user mouses over an item.
				 *
				 * @event itemMouseOver
				 * @param {Event.Facade} event The itemMouseOver event.
				 */
				instance.publish('itemMouseOver');

				/**
				 * Handles the itemSelect event. Fired when an item in the list is selected.
				 *
				 * @event itemSelect
				 * @param {Event.Facade} event The itemSelect event.
				 */
				instance.publish('itemSelect');

				/**
				 * Handles the selectionEnforce event. Fired if <a href="Autocomplete.html#config_forceSelection">forceSelection</a>
				 * is enabled and the users input element has been cleared because it did not match one of the results.
				 *
				 * @event selectionEnforce
				 * @param {Event.Facade} event The selectionEnforce event.
				 */
				instance.publish('selectionEnforce');

				/**
				 * Handles the textboxBlur event. Fired when the user leaves the input element.
				 *
				 * @event textboxBlur
				 * @param {Event.Facade} event The textboxBlur event.
				 */
				instance.publish('textboxBlur');

				/**
				 * Handles the textboxChange event. Fired when the value in the input element is changed.
				 *
				 * @event textboxChange
				 * @param {Event.Facade} event The textboxChange event.
				 */
				instance.publish('textboxChange');

				/**
				 * Handles the textboxFocus event. Fired when user moves focus to the input element.
				 *
				 * @event textboxFocus
				 * @param {Event.Facade} event The textboxFocus event.
				 */
				instance.publish('textboxFocus');

				/**
				 * Handles the textboxKey event. Fired when the input element receives key input.
				 *
				 * @event textboxKey
				 * @param {Event.Facade} event The textboxKey event.
				 */
				instance.publish('textboxKey');

				/**
				 * Handles the typeAhead event. Fired when the input element has been pre-filled by the type-ahead feature.
				 *
				 * @event typeAhead
				 * @param {Event.Facade} event The typeAhead event.
				 */
				instance.publish('typeAhead');

				/**
				 * Handles the unmatchedItemSelect event. Fired when a user selects something that does
				 * not match any of the displayed results.
				 *
				 * @event unmatchedItemSelect
				 * @param {Event.Facade} event The unmatchedItemSelect event.
				 */
				instance.publish('unmatchedItemSelect');

				instance.overlay.after('visibleChange', instance._realignContainer, instance);
			},

			/**
			 * Sync the AutoComplete UI. Lifecycle.
			 *
			 * @method syncUI
			 * @protected
			 */
			syncUI: function() {
				var instance = this;

				instance.inputNode.setAttribute('autocomplete', 'off');
			},

			/**
			 * Descructor lifecycle implementation for the Autocomplete class.
			 * Purges events attached to the node (and all child nodes).
			 *
			 * @method destructor
			 * @protected
			 */
			destructor: function() {
				var instance = this;

				instance.overlay.destroy();
			},

			/**
			 * An overridable method that is executed before the result container is shown.
			 * The method can return false to prevent the container from being shown.
			 *
			 * @method doBeforeExpandContainer
			 * @param {String} query The query that was submitted to the data source
			 * @param {Object} allResults The parsed results
			 * @return {Boolean}
			 */
			doBeforeExpandContainer: function() {
				return true;
			},

			/**
			 * An overridable method that is executed before the result overlay is loaded with results.
			 *
			 * @method doBeforeLoadData
			 * @param {EventFacade} event
			 * @return {Boolean}
			 */
			doBeforeLoadData: function(event) {
				return true;
			},

			/**
			 * Executed by the data source as a mechanism to do simple client-side
			 * filtering of the results.
			 *
			 * @method filterResults
			 * @param {EventFacade} event
			 * @return {Object} Filtered response object
			 */
			filterResults: function(event) {
				var instance = this;

				var callback = event.callback;
				var query = event.request;
				var response = event.response;

				if (callback && callback.argument && callback.argument.query) {
					query = callback.argument.query;
				}

				if (query) {
					var dataSource = instance.dataSource;
					var allResults = response.results;
					var filteredResults = [];
					var matchFound = false;
					var matchKey = instance.get('matchKey');
					var matchCase = instance.get('queryMatchCase');
					var matchContains = instance.get('queryMatchContains');
					var showAll = (query == '*');

					var fields = instance.get('schema.resultFields');

					for (var i = allResults.length - 1; i >= 0; i--){
						var result = allResults[i];

						var strResult = null;

						if (isString(result)) {
							strResult = result;
						}
						else if (isArray(result)) {
							strResult = result[0];
						}
						else if (fields) {
							strResult = result[matchKey || fields[0]];
						}

						if (isString(strResult)) {
							var keyIndex = -1;

							if (matchCase) {
								keyIndex = strResult.indexOf(decodeURIComponent(query));
							}
							else {
								keyIndex = strResult.toLowerCase().indexOf(decodeURIComponent(query).toLowerCase());
							}

							if (
								(showAll) ||
								(!matchContains && (keyIndex === 0)) ||
								(matchContains && (keyIndex > -1)
								)
							) {
								filteredResults.unshift(result);
							}
						}
					}

					response.results = filteredResults;
				}

				return response;
			},

			/**
			 * An overridable method for formatting the result of the query before it's displayed in the overlay.
			 *
			 * @method formatResult
			 * @param {Object} result The result data object
			 * @param {String} request The current query string
			 * @param {String} resultMatch The string from the results that matches the query
			 * @return {String}
			 */
			formatResult: function(result, request, resultMatch) {
				return resultMatch || '';
			},

			/**
			 * An overridable method that creates an object to be passed to the sendRequest
			 * method of the data source object. Useful to overwrite if you wish to create
			 * a custom request object before it's sent.
			 *
			 * @method generateRequest
			 * @param {String} query The string currently being entered
			 * @return {Object}
			 */
			generateRequest: function(query) {
				return {
					request: query
				};
			},

			/**
			 * Handles the response for the display of the results. This is a callback method
			 * that is fired by the sendRequest method so that results are ready to be accessed.
			 *
			 * @method handleResponse
			 * @param {EventFacade} event
			 */
			handleResponse: function(event) {
				var instance = this;

				instance._populateList(event);

				var iconClass = ICON_DEFAULT;

				if (event.error) {
					iconClass = ICON_ERROR;
				}

				instance.button.set(ICON, iconClass);
			},

			/**
			 * Sends a query request to the data source object.
			 *
			 * @method sendQuery
			 * @param {String} query Query string
			 */
			sendQuery: function(query) {
				var instance = this;

				instance.set('focused', null);

				var newQuery = query;

				if (instance.get('delimChar')) {
					query = instance.inputNode.get('value') + query;
				}

				instance._sendQuery(newQuery);
			},

			/**
			 * Clears the query interval
			 *
			 * @method _clearInterval
			 * @private
			 */
			_clearInterval: function() {
				var instance = this;

				if (instance._queryIntervalId) {
					clearInterval(instance._queryIntervalId);

					instance._queryIntervalId = null;
				}
			},

			/**
			 * When <a href="Autocomplete.html#config_forceSelection">forceSelection</a> is true and
			 * the user tries to leave the input element without selecting an item from the results,
			 * the user selection is cleared.
			 *
			 * @method _clearSelection
			 * @protected
			 */
			_clearSelection: function() {
				var instance = this;

				var delimChar = instance.get('delimChar');
				var extraction = {
					previous: '',
					query: instance.inputNode.get('value')
				};

				if (delimChar) {
					extraction = instance._extractQuery(instance.inputNode.get('value'));
				}

				instance.fire('selectionEnforce', extraction.query);
			},

			/**
			 * Creates the data source object using the passed in <a href="Autocomplete.html#config_dataSource">dataSource</a>,
			 * and if it is a string, will use the <a href="Autocomplete.html#config_dataSourceType">dataSourceType</a> to
			 * create a new <a href="module_datasource.html">DataSource</a> object.
			 *
			 * @method _createDataSource
			 * @protected
			 * @return {String}
			 */
			_createDataSource: function() {
				var instance = this;

				instance._queryTask = new A.DelayedTask(instance.sendQuery, instance);

				var dataSource = instance.get('dataSource');
				var data = dataSource;

				var dataSourceType = instance.get('dataSourceType');

				if (!(dataSource instanceof A.DataSource.Local)) {
					if (!dataSourceType) {
						dataSourceType = 'Local';

						if (isFunction(data)) {
							dataSourceType = 'Function';
						}
						else if (isString(data)) {
							dataSourceType = 'IO';
						}
					}

					dataSource = new A.DataSource[dataSourceType](
						{
							source: data
						}
					);
				}

				dataSource.on('error', instance.handleResponse, instance);
				dataSource.after('response', instance.handleResponse, instance);

				dataSourceType = dataSource.name;

				if (dataSourceType == 'dataSourceLocal') {
					instance.set('applyLocalFilter', true);
				}

				instance.set('dataSource', dataSource);
				instance.set('dataSource', dataSourceType);

				instance.dataSource = dataSource;

				var schema = instance.get('schema');

				if (schema) {
					if (schema.fn) {
						instance.dataSource.plug(schema);
					}
					else {
						var schemaType = instance.get('schemaType');

						var schemaTypes = {
							array: A.Plugin.DataSourceArraySchema,
							json: A.Plugin.DataSourceJSONSchema,
							text: A.Plugin.DataSourceTextSchema,
							xml: A.Plugin.DataSourceXMLSchema
						};

						schemaType = schemaType.toLowerCase() || 'array';

						instance.dataSource.plug(
							{
								fn: schemaTypes[schemaType],
								cfg: {
									schema: schema
								}
							}
						);
					}
				}

				instance.set('schema', schema);
			},

			/**
			 * Enables query interval detection for IME support.
			 *
			 * @method _enableIntervalDetection
			 * @protected
			 */
			_enableIntervalDetection: function() {
				var instance = this;

				var queryInterval = instance.get('queryInterval');

				if (!instance._queryIntervalId && queryInterval) {
					instance._queryInterval = setInterval(A.bind(instance._onInterval, instance), queryInterval);
				}
			},

			/**
			 * Extracts the right most query from the delimited string in the input.
			 *
			 * @method _extractQuery
			 * @param {String} query String to parse
			 * @protected
			 * @return {String}
			 */
			_extractQuery: function(query) {
				var instance = this;

				var delimChar = instance.get('delimChar');
				var delimIndex = -1;
				var i = delimChar.length - 1;

				var newIndex, queryStart, previous;

				for (; i >= 0; i--) {
					newIndex = query.lastIndexOf(delimChar[i]);

					if (newIndex > delimIndex) {
						delimIndex = newIndex;
					}
				}

				if (delimChar[i] == ' ') {
					for (var j = delimChar.length - 1; j >= 0; j--){
						if (query[delimIndex - 1] == delimChar[j]) {
							delimIndex--;

							break;
						}
					}
				}

				if (delimIndex > -1) {
					queryStart = delimIndex + 1;

					while (query.charAt(queryStart) == ' ') {
						queryStart += 1;
					}

					previous = query.substring(0, queryStart);

					query = query.substring(queryStart);
				}
				else {
					previous = '';
				}

				return {
					previous: previous,
					query: query
				};
			},

			/**
			 * Focuses the input element.
			 *
			 * @method _focus
			 * @protected
			 */
			_focus: function() {
				var instance = this;

				setTimeout(
					function() {
						instance.inputNode.focus();
					},
					0
				);
			},

			/**
			 * Whether or not the pressed key triggers some functionality or if it should
			 * be ignored.
			 *
			 * @method _isIgnoreKey
			 * @param {keyCode} Number The numeric code of the key pressed
			 * @protected
			 * @return {String}
			 */
			_isIgnoreKey: function(keyCode) {
				var instance = this;

				if (
					(keyCode == KEY_TAB) ||
					(keyCode == KEY_ENTER) ||
					(keyCode == KEY_SHIFT) ||
					(keyCode == KEY_CTRL) ||
					(keyCode >= KEY_ALT && keyCode <= KEY_CAPS_LOCK) ||
					(keyCode == KEY_ESC) ||
					(keyCode >= KEY_PAGEUP && keyCode <= KEY_END) ||
					(keyCode >= KEY_HOME && keyCode <= KEY_DOWN) ||
					(keyCode >= KEY_PRINT_SCREEN && keyCode <= KEY_INSERT) ||
					(keyCode == KEY_KOREAN_IME)
				) {
					return true;
				}

				return false;
			},

			/**
			 * If there is a currently selected item, the right arrow key will select
			 * that item and jump to the end of the input element, otherwise the container is closed.
			 *
			 * @method _jumpSelection
			 * @protected
			 */
			_jumpSelection: function() {
				var instance = this;

				if (instance._elCurListItem) {
					instance._selectItem(instance._elCurListItem);
				}
				else {
					instance._toggleContainer(false);
				}
			},

			/**
			 * Triggered by the up and down arrow keys, changes the currently selected list element item, and scrolls the
			 * container if necessary.
			 *
			 * @method _moveSelection
			 * @param {Number} keyCode The numeric code of the key pressed
			 * @protected
			 */
			_moveSelection: function(keyCode) {
				var instance = this;

				if (instance.overlay.get('visible')) {
					var elCurListItem = instance._elCurListItem;
					var curItemIndex = -1;

					if (elCurListItem) {
						curItemIndex = Number(elCurListItem.getAttribute('data-listItemIndex'));
					}

					var newItemIndex = curItemIndex - 1;

					if (keyCode == KEY_DOWN) {
						newItemIndex = curItemIndex + 1;
					}

					if (newItemIndex == -1) {
						newItemIndex = instance._displayedItems - 1;
					}

					if (newItemIndex >= instance._displayedItems) {
						newItemIndex = 0;
					}

					if (newItemIndex < -2) {
						return;
					}

					if (elCurListItem) {
						instance._toggleHighlight(elCurListItem, 'from');

						instance.fire('itemArrowFrom', elCurListItem);
					}

					if (newItemIndex == -1) {
						if (instance.get('delimChar')) {
							instance.inputNode.set('value', instance._pastSelections + instance._currentQuery);
						}
						else {
							instance.inputNode.set('value', instance._currentQuery);
						}

						return;
					}

					if (newItemIndex == -2) {
						instance._toggleContainer(false);

						return;
					}

					var elNewListItem = instance.resultList.get('childNodes').item(newItemIndex);

					var elContent = instance.overlay.get(CONTENT_BOX);

					var contentOverflow = elContent.getStyle('overflow');
					var contentOverflowY = elContent.getStyle('overflowY');

					var scrollOn = (contentOverflow == 'auto') || (contentOverflow == 'scroll') || (contentOverflowY == 'auto') || (contentOverflowY == 'scroll');

					if (scrollOn &&
						(newItemIndex > -1) &&
						(newItemIndex < instance._displayedItems)) {

						var newScrollTop = -1;
						var liTop = elNewListItem.get('offsetTop');
						var liBottom = liTop + elNewListItem.get('offsetHeight');

						var contentHeight = elContent.get('offsetHeight');
						var contentScrollTop = elContent.get('scrollTop');
						var contentBottom = contentHeight + contentScrollTop;

						if (keyCode == KEY_DOWN) {
							if (liBottom > contentBottom) {
								newScrollTop = (liBottom - contentHeight);
							}
							else if (liBottom < contentScrollTop) {
								newScrollTop = liTop;
							}
						}
						else {
							if (liTop < contentHeight) {
								newScrollTop = liTop;
							}
							else if (liTop > contentBottom) {
								newScrollTop = (liBottom - contentHeight);
							}
						}

						if (newScrollTop > -1) {
							elContent.set('scrollTop', newScrollTop);
						}
					}

					instance._toggleHighlight(elNewListItem, 'to');

					instance.fire('itemArrowTo', elNewListItem);

					if (instance.get('typeAhead')) {
						instance._updateValue(elNewListItem);
					}
				}
			},

			/**
			 * Called when the user mouses down on the button element in the combobox.
			 *
			 * @method _onButtonMouseDown
			 * @param {EventFacade} event
			 * @protected
			 */
			_onButtonMouseDown: function(event) {
				var instance = this;

				event.halt();

				instance._focus();

				instance._sendQuery(instance.inputNode.get('value') + '*');
			},

			/**
			 * Handles when a user clicks on the container.
			 *
			 * @method _onContainerClick
			 * @param {EventFacade} event
			 * @protected
			 */
			_onContainerClick: function(event) {
				var instance = this;

				var target = event.target;
				var tagName = target.get('nodeName').toLowerCase();

				event.halt();

				while (target && (tagName != 'table')) {
					switch (tagName) {
						case 'body':
						return;

						case 'li':
							instance._toggleHighlight(target, 'to');
							instance._selectItem(target);
						return;

						default:
						break;
					}

					target = target.get('parentNode');

					if (target) {
						tagName.get('nodeName').toLowerCase();
					}
				}
			},

			/**
			 * Handles when a user mouses out of the container.
			 *
			 * @method _onContainerMouseout
			 * @param {EventFacade} event
			 * @protected
			 */
			_onContainerMouseout: function(event) {
				var instance = this;

				var target = event.target;
				var tagName = target.get('nodeName').toLowerCase();

				while (target && (tagName != 'table')) {
					switch (tagName) {
						case 'body':
						return;

						case 'li':
							instance._toggleHighlight(target, 'from');
							instance.fire('itemMouseOut', target);
						break;

						case 'ul':
							instance._toggleHighlight(instance._elCurListItem, 'to');
						break;

						case 'div':
							if (target.hasClass(CSS_RESULTS_OVERLAY)) {
								instance._overContainer = false;

								return;
							}
						break;

						default:
						break;
					}

					target = target.get('parentNode');

					if (target) {
						tagName = target.get('nodeName').toLowerCase();
					}
				}
			},

			/**
			 * Handles when a user mouses over the container.
			 *
			 * @method _onContainerMouseover
			 * @param {EventFacade} event
			 * @protected
			 */
			_onContainerMouseover: function(event) {
				var instance = this;

				var target = event.target;
				var tagName = target.get('nodeName').toLowerCase();

				while (target && (tagName != 'table')) {
					switch (tagName) {
						case 'body':
						return;

						case 'li':
							instance._toggleHighlight(target, 'to');
							instance.fire('itemMouseOut', target);
						break;

						case 'div':
							if (target.hasClass(CSS_RESULTS_OVERLAY)) {
								instance._overContainer = true;
								return;
							}
						break;

						default:
						break;
					}

					target = target.get('parentNode');

					if (target) {
						tagName = target.get('nodeName').toLowerCase();
					}
				}
			},

			/**
			 * Handles the container scroll events.
			 *
			 * @method _onContainerScroll
			 * @param {EventFacade} event
			 * @protected
			 */
			_onContainerScroll: function(event) {
				var instance = this;

				instance._focus();
			},

			/**
			 * Enables the query to be triggered based on detecting text input via intervals instead of via
			 * key events.
			 *
			 * @method _onInterval
			 * @protected
			 */
			_onInterval: function() {
				var instance = this;

				var curValue = instance.inputNode.get('value');
				var lastValue = instance._lastValue;

				if (curValue != lastValue) {
					instance._lastValue = curValue;

					instance._sendQuery(curValue);
				}
			},

			/**
			 * Handles the input element losing focus.
			 *
			 * @method _onTextboxBlur
			 * @param {EventFacade} event
			 * @protected
			 */
			_onTextboxBlur: function(event) {
				var instance = this;

				if (!instance._overContainer || (instance._keyCode == KEY_TAB)) {
					if (!instance._itemSelected) {
						var elMatchListItem = instance._textMatchesOption();

						var overlayVisible = instance.overlay.get('visible');

						if (!overlayVisible || (overlayVisible && isNull(elMatchListItem))) {
							if (instance.get('forceSelection')) {
								instance._clearSelection();
							}
							else {
								instance.fire('unmatchedItemSelect', instance._currentQuery);
							}
						}
						else {
							if (instance.get('forceSelection')) {
								instance._selectItem(elMatchListItem);
							}
						}
					}

					instance._clearInterval();

					instance.blur();

					if (instance._initInputValue !== instance.inputNode.get('value')) {
						instance.fire('textboxChange');
					}

					instance.fire('textboxBlur');

					instance._toggleContainer(false);
				}
				else {
					instance._focus();
				}
			},

			/**
			 * Handles the input element gaining focus.
			 *
			 * @method _onTextboxFocus
			 * @param {EventFacade} event
			 * @protected
			 */
			_onTextboxFocus: function(event) {
				var instance = this;

				if (!instance.get('focused')) {
					instance.inputNode.setAttribute('autocomplete', 'off');
					instance.focus();
					instance._initInputValue = instance.inputNode.get('value');

					instance.fire('textboxFocus');
				}
			},

			/**
			 * Handles the keydown events on the input element for functional keys.
			 *
			 * @method _onTextboxKeyDown
			 * @param {EventFacade} event
			 * @protected
			 */
			_onTextboxKeyDown: function(event) {
				var instance = this;

				var keyCode = event.keyCode;

				if (instance._typeAheadDelayId != -1) {
					clearTimeout(instance._typeAheadDelayId);
				}

				switch (keyCode) {
					case KEY_TAB:
						if (instance._elCurListItem) {
							if (instance.get('delimChar') && instance._keyCode != keyCode) {
								if (instance.overlay.get('visible')) {
									event.halt();
								}
							}

							instance._selectItem(instance._elCurListItem);
						}
						else {
							instance._toggleContainer(false);
						}
					break;

					case KEY_ENTER:
						if (instance._elCurListItem) {
							if (instance._keyCode != keyCode) {
								if (instance.overlay.get('visible')) {
									event.halt();
								}
							}

							instance._selectItem(instance._elCurListItem);
						}
						else {
							instance._toggleContainer(false);
						}
					break;

					case KEY_ESC:
						instance._toggleContainer(false);
					return;

					case KEY_UP:
						if (instance.overlay.get('visible')) {
							event.halt();

							instance._moveSelection(keyCode);
						}
					break;

					case KEY_RIGHT:
						instance._jumpSelection();
					break;

					case KEY_DOWN:
						if (instance.overlay.get('visible')) {
							event.halt();

							instance._moveSelection(keyCode);
						}
					break;

					default:
						instance._itemSelected = false;
						instance._toggleHighlight(instance._elCurListItem, 'from');

						instance.fire('textboxKey', keyCode);
					break;
				}

				if (keyCode == KEY_ALT) {
					instance._enableIntervalDetection();
				}

				instance._keyCode = keyCode;
			},

			/**
			 * Handles the key press events of the input element.
			 *
			 * @method _onTextboxKeyPress
			 * @param {EventFacade} event
			 * @protected
			 */
			_onTextboxKeyPress: function(event) {
				var instance = this;

				var keyCode = event.keyCode;

				switch (keyCode) {
					case KEY_TAB:
						if (instance.overlay.get('visible')) {
							if (instance.get('delimChar')) {
								event.halt();
							}

							if (instance._elCurListItem) {
								instance._selectItem(instance._elCurListItem);
							}
							else {
								instance._toggleContainer(false);
							}
						}
					break;

					case 13:
						if (instance.overlay.get('visible')) {
							event.halt();

							if (instance._elCurListItem) {
								instance._selectItem(instance._elCurListItem);
							}
							else {
								instance._toggleContainer(false);
							}
						}
					break;

					default:
					break;
				}

				if (keyCode == KEY_KOREAN_IME) {
					instance._enableIntervalDetection();
				}
			},

			/**
			 * Handles the keyup events of the input element.
			 *
			 * @method _onTextboxKeyUp
			 * @param {EventFacade} event
			 * @protected
			 */
			_onTextboxKeyUp: function(event) {
				var instance = this;

				var input = instance.inputNode;

				var value = input.get('value');
				var keyCode = event.keyCode;

				if (instance._isIgnoreKey(keyCode)) {
					return;
				}

				instance._queryTask.delay(instance.get('queryDelay'), null, null, [value]);
			},

			/**
			 * Populates the container with list items of the query results.
			 *
			 * @method _populateList
			 * @param {EventFacade} event
			 * @protected
			 */
			_populateList: function(event) {
				var instance = this;

				if (instance._typeAheadDelayId != -1) {
					clearTimeout(instance._typeAheadDelayId);
				}

				var query = event.request;
				var response = event.response;
				var callback = event.callback;
				var showAll = (query == '*');

				if (callback && callback.argument && callback.argument.query) {
					event.request = query = callback.argument.query;
				}

				var ok = instance.doBeforeLoadData(event);

				if (ok && !event.error) {
					instance.fire('dataReturn', event);

					var focused = instance.get('focused');

					if (showAll || focused || focused === null) {
						var currentQuery = decodeURIComponent(query);

						instance._currentQuery = currentQuery;
						instance._itemSelected = false;

						var allResults = event.response.results;
						var itemsToShow = Math.min(allResults.length, instance.get('maxResultsDisplayed'));
						var fields = instance.get('schema.resultFields');
						var matchKey = instance.get('matchKey');

						if (!matchKey && fields) {
							matchKey = fields[0];
						}
						else {
							matchKey = matchKey || 0;
						}

						if (itemsToShow > 0) {
							var allListItemEls = instance.resultList.get('childNodes');

							allListItemEls.each(
								function(node, i, nodeList) {
									if (i < itemsToShow) {
										var result = allResults[i];

										var resultMatch = '';

										if (isString(result)) {
											resultMatch = result;
										}
										else if (isArray(result)) {
											resultMatch = result[0];
										}
										else {
											resultMatch = result[matchKey];
										}

										node._resultMatch = resultMatch;

										node._resultData = result;
										node.html(instance.formatResult(result, currentQuery, resultMatch));

										node.removeClass(CSS_HIDDEN);
									}
									else {
										node.addClass(CSS_HIDDEN);
									}
								}
							);

							instance._displayedItems = itemsToShow;

							instance.fire('containerPopulate', query, allResults);

							if (query != '*' && instance.get('autoHighlight')) {
								var elFirstListItem = instance.resultList.get('firstChild');

								instance._toggleHighlight(elFirstListItem, 'to');
								instance.fire('itemArrowTo', elFirstListItem);

								instance._typeAhead(elFirstListItem, query);
							}
							else {
								instance._toggleHighlight(instance._elCurListItem, 'from');
							}

							ok = instance.doBeforeExpandContainer(query, allResults);

							instance._toggleContainer(ok);
						}
						else {
							instance._toggleContainer(false);
						}

						return;
					}

				}
				else {
					instance.fire('dataError', query);
				}
			},

			/**
			 * Realigns the container to the input element.
			 *
			 * @method _realignContainer
			 * @param {EventFacade} event
			 * @protected
			 */
			_realignContainer: function(event) {
				var instance = this;

				var overlayAlign = instance._overlayAlign;

				if (event.newVal) {
					instance.overlay._uiSetAlign(overlayAlign.node, overlayAlign.points);
				}
			},

			/**
			 * Handles the rendering of the input element.
			 *
			 * @method _renderInput
			 * @protected
			 */
			_renderInput: function() {
				var instance = this;

				var contentBox = instance.get(CONTENT_BOX);
				var input = instance.get('input');

				var comboConfig = {
					field: {
						labelText: false
					},
					icons: [
						{
							icon: 'circle-triangle-b',
							id: 'trigger',
							handler: {
								fn: instance._onButtonMouseDown,
								context: instance
							}
						}
					]
				};

				var inputReference = null;
				var inputParent = null;

				if (input) {
					input = A.one(input);

					comboConfig.field.node = input;

					inputReference = input.next();
					inputParent = input.get('parentNode');
				}

				var comboBox = new A.Combobox(comboConfig).render(contentBox);

				if (inputParent) {
					var comboBoundingBox = comboBox.get('boundingBox');

					inputParent.insertBefore(comboBoundingBox, inputReference);
				}

				instance.inputNode = comboBox.get('node');
				instance.button = comboBox.icons.item('trigger');

				instance.set('uniqueName', A.stamp(instance.inputNode));
			},

			/**
			 * Pre-populates the container with the 
			 * <a href="Autocomplete.html#config_maxResultsDisplayed">maxResultsDisplayed</a>
			 * number of list items.
			 *
			 * @method _renderListElements
			 * @protected
			 */
			_renderListElements: function() {
				var instance = this;

				var maxResultsDisplayed = instance.get('maxResultsDisplayed');

				var resultList = instance.resultList;

				var listItems = [];

				while (maxResultsDisplayed--) {
					listItems[maxResultsDisplayed] = '<li class="' + CSS_HIDDEN + ' ' + CSS_LIST_ITEM + '" data-listItemIndex="' + maxResultsDisplayed + '"></li>';
				}

				resultList.html(listItems.join(''));
			},

			/**
			 * Handles the creation of the overlay where the result list will be displayed.
			 *
			 * @method _renderOverlay
			 * @protected
			 */
			_renderOverlay: function() {
				var instance = this;

				var overlayAlign = instance._overlayAlign;

				overlayAlign.node = instance.inputNode;

				var overlay = new A.OverlayBase(
					{
						align: overlayAlign,
						bodyContent: '<ul></ul>',
						visible: false,
						width: instance.inputNode.get('offsetWidth')
					}
				);

				var contentBox = overlay.get(CONTENT_BOX);

				overlay.get(BOUNDING_BOX).addClass(CSS_RESULTS_OVERLAY);

				contentBox.addClass(CSS_RESULTS_OVERLAY_CONTENT);

				overlay.render(document.body);

				overlay.addTarget(instance);

				instance.overlay = overlay;
				instance.resultList = contentBox.one('ul');

				instance.resultList.addClass(CSS_RESULTS_LIST);

				instance._renderListElements();
			},

			/**
			 * Selects a list item from the query results.
			 *
			 * @method _selectItem
			 * @param {Node} elListItem The list item to select
			 * @protected
			 */
			_selectItem: function(elListItem) {
				var instance = this;

				instance._itemSelected = true;

				instance._updateValue(elListItem);

				instance._pastSelections = instance.inputNode.get('value');

				instance._clearInterval();

				instance.fire('itemSelect', elListItem, elListItem._resultData);

				instance._toggleContainer(false);
			},

			/**
			 * Makes a query request to the data source.
			 *
			 * @method _sendQuery
			 * @param {String} query The query string
			 * @protected
			 */
			_sendQuery: function(query) {
				var instance = this;

				if (instance.get('disabled')) {
					instance._toggleContainer(false);

					return;
				}

				var delimChar = instance.get('delimChar');
				var minQueryLength = instance.get('minQueryLength');

				if (delimChar) {
					var extraction = instance._extractQuery(query);

					query = extraction.query;

					instance._pastSelections = extraction.previous;
				}

				if ((query && (query.length < minQueryLength)) || (!query && minQueryLength > 0)) {
					instance._queryTask.cancel();

					instance._toggleContainer(false);

					return;
				}

				query = encodeURIComponent(query);

				if (instance.get('applyLocalFilter')) {
					instance.dataSource.on('response', instance.filterResults, instance);
				}

				var request = instance.generateRequest(query);

				instance.fire('dataRequest', query, request);

				instance.dataSource.sendRequest(request);
			},

			/**
			 * Checks to see if the value typed by the user matches any of the
			 * query results.
			 *
			 * @method _textMatchesOption
			 * @protected
			 */
			_textMatchesOption: function() {
				var instance = this;

				var elMatch = null;
				var displayedItems = instance._displayedItems;
				var listItems = instance.resultList.get('childNodes');

				for (var i=0; i < displayedItems.length; i++) {
					var elListItem = listItems.item(i);

					var match = ('' + elListItem._resultMatch).toLowerCase();

					if (match == instance._currentQuery.toLowerCase()) {
						elMatch = elListItem;

						break;
					}
				}

				return elMatch;
			},

			/**
			 * Toggles the display of the results container.
			 *
			 * @method _toggleContainer
			 * @param {Boolean} show Flag to force the showing or hiding of the container
			 * @protected
			 */
			_toggleContainer: function(show) {
				var instance = this;

				var overlay = instance.overlay;

				if (instance.get('alwaysShowContainer') && overlay.get('visible')) {
					return;
				}

				if (!show) {
					instance._toggleHighlight(instance._elCurListItem, 'from');

					instance._displayedItems = 0;
					instance._currentQuery = null;
				}

				if (show) {
					overlay.show();
					instance.fire('containerExpand');
				}
				else {
					overlay.hide();
					instance.fire('containerCollapse');
				}
			},

			/**
			 * Toggles the highlighting of a list item, and removes the highlighting from the previous item
			 *
			 * @method _toggleHighlight
			 * @param {Node} elNewListItem The item to be highlighted
			 * @param {String} action Whether we are moving to or from an item. Valid values are "to" or "from".
			 * @protected
			 */
			_toggleHighlight: function(elNewListItem, action) {
				var instance = this;

				if (elNewListItem) {
					if (instance._elCurListItem) {
						instance._elCurListItem.removeClass(CSS_HIGLIGHT);
						instance._elCurListItem = null;
					}

					if (action == 'to') {
						elNewListItem.addClass(CSS_HIGLIGHT);

						instance._elCurListItem = elNewListItem;
					}
				}
			},

			/**
			 * Updates in the input element with the first result as the user types,
			 * selecting the text the user has not typed yet.
			 *
			 * @method _typeAhead
			 * @param {Node} elListItem The selected list item
			 * @param {String} query The query string
			 * @protected
			 */
			_typeAhead: function(elListItem, query) {
				var instance = this;

				if (!instance.get('typeAhead') || instance._keyCode == KEY_BACKSPACE) {
					return;
				}

				var inputEl = A.Node.getDOMNode(instance.inputNode);

				if (inputEl.setSelectionRange || inputEl.createTextRange) {
					instance._typeAheadDelayId = setTimeout(
						function() {
							var value = inputEl.value;

							var start = value.length;

							instance._updateValue(elListItem);

							var end = inputEl.value.length;

							instance.inputNode.selectText(start, end);

							var prefill = inputEl.value.substr(start, end);

							instance.fire('typeAhead', query, prefill);
						},
						instance.get('typeAheadDelay')
					);
				}
			},

			/**
			 * Updates the input element with the selected query result. If
			 * <a href="Autocomplete.html#config_delimChar">delimChar</a> has been set,
			 * then the value gets appended with the delimiter.
			 *
			 * @method _updateValue
			 * @param {Node} elListItem The selected list item
			 * @protected
			 */
			_updateValue: function(elListItem) {
				var instance = this;

				if (!instance.get('suppressInputUpdate')) {
					var input = instance.inputNode;
					var resultMatch = elListItem._resultMatch;

					var delimChar = instance.get('delimChar');

					delimChar = (delimChar && delimChar[0]) || delimChar;

					var newValue = '';

					if (delimChar) {
						newValue = instance._pastSelections;

						newValue += resultMatch + delimChar;

						if (delimChar != ' ') {
							newValue += ' ';
						}
					}
					else {
						newValue = resultMatch;
					}

					input.set('value', newValue);

					if (input.get('type') == 'textarea') {
						input.set('scrollTop', input.get('scrollHeight'));
					}

					var end = newValue.length;

					input.selectText(end, end);

					instance._elCurListItem = elListItem;
				}
			},

			_currentQuery: null,
			_displayedItems: 0,
			_elCurListItem: null,
			_initInputValue: null,
			_itemSelected: false,
			_keyCode: null,
			_lastValue: null,
			_overContainer: false,
			_pastSelections: '',
			_typeAheadDelayId: -1
		}
	}
);

A.AutoComplete = AutoComplete;


}, 'gallery-2011.02.09-21-32' ,{requires:['gallery-aui-base','gallery-aui-overlay-base','datasource','dataschema','gallery-aui-form-combobox'], skinnable:true});
