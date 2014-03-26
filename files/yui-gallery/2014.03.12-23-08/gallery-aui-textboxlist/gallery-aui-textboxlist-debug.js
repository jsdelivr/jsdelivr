YUI.add('gallery-aui-textboxlist', function(A) {

/**
 * The Textboxlist Utility - Full documentation coming soon.
 *
 * @module aui-textboxlist
 */

var Lang = A.Lang,

	getClassName = A.ClassNameManager.getClassName,

	ENTRY_NAME = 'textboxlistentry',
	NAME = 'textboxlist',

	BOUNDING_BOX = 'boundingBox',
	CONTENT_BOX = 'contentBox',

	CONFIG_ANIM = {
		from: {
			opacity: 1
		},
		to: {
			opacity: 0.3
		},
		duration: 0.1,
		on: {
			end: function(event) {
				var instance = this;

				var reverse = instance.get('reverse');

				if (!reverse) {
					instance.run();
				}

				instance.set('reverse', !reverse);
			}
		}
	},

	CSS_CLEARFIX = getClassName('helper', 'clearfix'),

	CSS_ICON = getClassName('icon'),
	CSS_ICON_CLOSE = getClassName('icon', 'close'),
	CSS_ICON_CLOSE_HOVER = getClassName(ENTRY_NAME, 'close', 'hover'),
	CSS_ENTRY_CLOSE = getClassName(ENTRY_NAME, 'close'),
	CSS_ENTRY_HOLDER = getClassName(ENTRY_NAME, 'holder'),
	CSS_ENTRY_TEXT = getClassName(ENTRY_NAME, 'text'),
	CSS_ENTRY_ITEM = getClassName(ENTRY_NAME, 'item'),

	CSS_INPUT_CONTAINER = getClassName(NAME, 'input','container'),

	KEY_BACKSPACE = 8,
	KEY_ENTER = 13,
	KEY_LEFT = 37,
	KEY_RIGHT = 39,

	TPL_ENTRY_CLOSE = '<span class="' + [CSS_ICON, CSS_ICON_CLOSE, CSS_ENTRY_CLOSE].join(' ') + '"></span>',
	TPL_ENTRY_TEXT = '<span class="' + CSS_ENTRY_TEXT + '"></span>',
	TPL_ENTRY_HOLDER = '<ul class="' + [CSS_CLEARFIX, CSS_ENTRY_HOLDER].join(' ') + '"></ul>',

	TPL_INPUT_CONTAINER = '<li class="' + CSS_INPUT_CONTAINER + '"></li>';

/**
 * A base class for Textboxlist, providing:
 * <ul>
 *    <li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *    <li>Text box list</li>
 * </ul>
 *
 * Check the list of <a href="Textboxlist.html#configattributes">Configuration Attributes</a> available for
 * Textboxlist.
 *
 * @param config {Object} Object literal specifying widget configuration properties.
 *
 * @class Textboxlist
 * @constructor
 * @extends AutoComplete
 */
var TextboxList = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property Textboxlist.NAME
		 * @type String
		 * @static
		 */
		NAME: NAME,

		/**
		 * Static property used to define the default attribute
		 * configuration for the Textboxlist.
		 *
		 * @property Textboxlist.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			allowAnyEntry: {
				value: false
			},
			delimChar: {
				value: ''
			},
			tabIndex: {
				value: 0
			}
		},

		EXTENDS: A.AutoComplete,

		prototype: {
			/**
			 * Construction logic executed during Textboxlist instantiation. Lifecycle.
			 *
			 * @method initializer
			 * @protected
			 */
			initializer: function(config) {
				var instance = this;

				var matchKey = instance.get('matchKey');

				instance.entries = new A.DataSet(
					{
						getKey: function(obj) {
							var instance = this;

							return obj[matchKey];
						}
					}
				);

				instance._lastSelectedEntry = -1;
			},

			/**
			 * Create the DOM structure for the Textboxlist. Lifecycle.
			 *
			 * @method renderUI
			 * @protected
			 */
			renderUI: function() {
				var instance = this;

				instance._renderEntryHolder();

				TextboxList.superclass.renderUI.apply(instance, arguments);

				instance._overlayAlign.node = instance.get(BOUNDING_BOX);
			},

			/**
			 * Bind the events on the Textboxlist UI. Lifecycle.
			 *
			 * @method bindUI
			 * @protected
			 */
			bindUI: function() {
				var instance = this;

				TextboxList.superclass.bindUI.apply(instance, arguments);

				instance.after('itemSelect', instance._afterItemSelect);
				instance.after('focusedChange', instance._afterTBLFocusedChange);
				instance.on('click', instance._onBoundingBoxClick);

				var entries = instance.entries;
				var entryHolder = instance.entryHolder;
				var closeSelector = '.' + CSS_ICON_CLOSE;

				entries.after('add', instance._updateEntryHolder, instance);
				entries.after('replace', instance._updateEntryHolder, instance);
				entries.after('remove', instance._updateEntryHolder, instance);

				entryHolder.delegate('click', A.bind(instance._removeItem, instance), closeSelector);
				entryHolder.delegate('mouseenter', A.bind(instance._onCloseIconMouseOver, instance), closeSelector);
				entryHolder.delegate('mouseleave', A.bind(instance._onCloseIconMouseOut, instance), closeSelector);

				A.on(
					'key',
					instance._onTBLKeypress,
					instance.get(BOUNDING_BOX),
					'down:39,40,37,38,8,13',
					instance
				);

				instance.inputNode.on('focus', instance._onInputNodeFocus, instance);
			},

			add: function(label) {
				var instance = this;

				var entry = instance._prepareEntry(label);

				instance.entries.add(entry);
			},
									 
			addEntries: function(instance) {
				var instance = this;
				var inputNode = instance.inputNode;
				
				instance.entries.add(inputNode.val(), {});
			},

			insert: function(index, label) {
				var instance = this;

				var entry = instance._prepareEntry(label);

				return instance.entries.insert(index, entry);
			},

			remove: function(label) {
				var instance = this;

				return instance.entries.removeKey(label);
			},

			_afterItemSelect: function(elListItem) {
				var instance = this;

				instance.entries.add(elListItem._resultData);

			},

			_afterTBLFocusedChange: function(event) {
				var instance = this;

				if (event.type.indexOf('textboxlistentry') > -1) {
					if (event.newVal) {
						var entryBoundingBox = event.target.get(BOUNDING_BOX);

						instance._lastSelectedEntry = instance.entryHolder.all('li').indexOf(entryBoundingBox);
					}
				}
			},

			_onBoundingBoxClick: function(event) {
				var instance = this;

				instance.inputNode.focus();
			},

			_onCloseIconMouseOut: function(event) {
				var instance = this;

				event.currentTarget.removeClass(CSS_ICON_CLOSE_HOVER);
			},

			_onCloseIconMouseOver: function(event) {
				var instance = this;

				event.currentTarget.addClass(CSS_ICON_CLOSE_HOVER);
			},

			_onInputNodeFocus: function(event) {
				var instance = this;

				instance._lastSelectedEntry = -1;
			},

			_onTBLKeypress: function(event) {
				var instance = this;

				var keyCode = event.keyCode;
				var inputNode = instance.inputNode;

				if (!inputNode.val()) {
					var lastSelectedEntry = instance._lastSelectedEntry;
					var currentSelectedEntry = -1;

					var unselected = (lastSelectedEntry == -1);

					var deleteEntry = (keyCode == KEY_BACKSPACE);
					var deleteBack = (deleteEntry && unselected);
					var moveBack = keyCode == KEY_LEFT || deleteBack;
					var moveForward = (keyCode == KEY_RIGHT);

					var entries = instance.entries;

					var entriesSize = entries.size();
					var lastEntryIndex = entriesSize - 1;

					if (moveBack) {
						if (unselected) {
							currentSelectedEntry = lastEntryIndex;
						}
						else if (lastSelectedEntry == 0) {
							currentSelectedEntry = lastSelectedEntry;
						}
						else {
							currentSelectedEntry = lastSelectedEntry - 1;
						}
					}
					else if (moveForward) {
						if (unselected || (lastSelectedEntry == lastEntryIndex)) {
							currentSelectedEntry = -1;
						}
						else {
							currentSelectedEntry = lastSelectedEntry + 1;
						}
					}
					else if (deleteEntry) {
						entries.removeAt(lastSelectedEntry);

						entriesSize = entries.size();

						if (lastSelectedEntry == entriesSize) {
							currentSelectedEntry = -1;
						}
						else {
							currentSelectedEntry = lastSelectedEntry;
						}
					}

					if (deleteBack || deleteEntry) {
						event.halt();
					}

					if (currentSelectedEntry != -1) {
						entries.item(currentSelectedEntry).entry.focus();
					}
					else {
						inputNode.focus();
					}

					instance._lastSelectedEntry = currentSelectedEntry;
				}
				else {
					if (keyCode == KEY_ENTER && instance.get('allowAnyEntry')) {
						instance.addEntries();
					}
				}
			},

			_onTextboxKeyPress: function(event) {
				var instance = this;

				TextboxList.superclass._onTextboxKeyPress.apply(instance, arguments);

				if (event.keyCode == KEY_ENTER) {
					event.halt();
				}
			},

			_prepareEntry: function(label) {
				var instance = this;

				var entry = {};
				var matchKey = instance.get('matchKey');

				entry[matchKey] = label;

				return entry;
			},

			_realignContainer: function(event) {
				var instance = this;

				instance.overlay.set('width', instance.get(BOUNDING_BOX).get('offsetWidth'));

				TextboxList.superclass._realignContainer.apply(instance, arguments);
			},

			_removeItem: function(event) {
				var instance = this;

				var entry = A.Widget.getByNode(event.currentTarget);

				entry = entry.get(BOUNDING_BOX);

				var currentIndex = instance.entryHolder.all('li').indexOf(entry);

				instance.entries.removeAt(currentIndex);
			},

			_renderEntryHolder: function() {
				var instance = this;

				var contentBox = instance.get(CONTENT_BOX);
				var entryHolder = A.Node.create(TPL_ENTRY_HOLDER);

				contentBox.prepend(entryHolder);

				instance.entryHolder = entryHolder;
			},

			_renderInput: function() {
				var instance = this;

				var contentBox = instance.get(CONTENT_BOX);
				var input = instance.get('input');

				var fieldConfig = {
					labelText: false
				};

				var inputParent = null;

				if (input) {
					input = A.one(input);

					fieldConfig.node = input;

					inputParent = input.get('parentNode');
				}

				var inputContainer = A.Node.create(TPL_INPUT_CONTAINER);

				instance.entryHolder.append(inputContainer);

				var inputField = new A.Textfield(fieldConfig).render(inputContainer);
				var inputBoundingBox = inputField.get(BOUNDING_BOX);

				if (inputBoundingBox.get('parentNode') != inputContainer) {
					inputContainer.appendChild(inputBoundingBox);
				}

				instance.inputContainer = inputContainer;
				instance.inputField = inputField;
				instance.inputNode = inputField.get('node');
				instance.button = new A.ButtonItem();

				instance.set('uniqueName', A.stamp(instance.inputNode));
			},

			_updateEntryHolder: function(event) {
				var instance = this;

				var eventType = event.type;
				var inputNode = instance.inputNode;
				var entryHolder = instance.entryHolder;
				var item = event.item;
				var index = event.index;

				var matchKey = instance.get('matchKey');

				var key = item[matchKey] || event.attrName;

				if (key) {
					if (eventType == 'dataset:add') {
						var entry = new TextboxListEntry(
							{
								labelText: key
							}
						);

						entry.addTarget(instance);

						var entryNode = entry.get(BOUNDING_BOX);

						entry.render(entryHolder);

						entryHolder.all('li').item(index).placeBefore(entryNode);

						entryNode.plug(A.Plugin.NodeFX, CONFIG_ANIM);

						item.entry = entry;

						inputNode.val('');
					}
					else if (eventType == 'dataset:replace') {
						inputNode.val('');

						var entry = event.prevVal.entry;

						item.entry = entry;

						entry.get(BOUNDING_BOX).fx.run();
					}
					else if (eventType == 'dataset:remove') {
						var entryNodes = entryHolder.all('li');

						if (entryNodes) {
							entryNodes.item(index).remove();
						}
					}
				}
				else {
					instance.entries.removeAt(index);
				}
			}
		}
	}
);

var TextboxListEntry = A.Component.create(
	{
		NAME: ENTRY_NAME,

		ATTRS: {
			labelText: {
				value: ''
			},
			tabIndex: {
				value: 0
			}
		},

		prototype: {
			BOUNDING_TEMPLATE: '<li></li>',
			CONTENT_TEMPLATE: '<span></span>',
			renderUI: function() {
				var instance = this;

				var contentBox = instance.get(CONTENT_BOX);

				var text = A.Node.create(TPL_ENTRY_TEXT);
				var close = A.Node.create(TPL_ENTRY_CLOSE);

				var labelText = instance.get('labelText');

				text.set('innerHTML', labelText);

				contentBox.appendChild(text);
				contentBox.appendChild(close);
			}
		}
	}
);

A.TextboxList = TextboxList;
A.TextboxListEntry = TextboxListEntry;


}, 'gallery-2010.08.18-17-12' ,{skinnable:true, requires:['anim-node-plugin','gallery-aui-autocomplete','node-focusmanager']});
