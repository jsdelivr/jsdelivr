YUI.add('gallery-aui-form-textfield', function(A) {

var Lang = A.Lang,

	getClassName = A.ClassNameManager.getClassName,

	NAME = 'textfield',

	CSS_TEXTFIELD = getClassName(NAME);

var Textfield = A.Component.create(
	{
		NAME: NAME,

		ATTRS: {
			selectOnFocus: {
				value: false
			},

			allowOnly: {
				value: null,
				validator: function(value) {
					var instance = this;

					return value instanceof RegExp;
				}
			},

			defaultValue: {
				value: ''
			},

			validator: {
				value: null
			}
		},

		EXTENDS: A.Field,

		prototype: {
			bindUI: function() {
				var instance = this;

				Textfield.superclass.bindUI.call(instance);

				var node = instance.get('node');

				if (instance.get('allowOnly')) {
					node.on('keypress', instance._filterInputText, instance);
				}

				if (instance.get('selectOnFocus')) {
					node.on('focus', instance._selectInputText, instance);
				}

				var defaultValue = instance.get('defaultValue');

				if (defaultValue) {
					node.on('blur', instance._checkDefaultValue, instance);
					node.on('focus', instance._checkDefaultValue, instance);
				}
			},

			syncUI: function() {
				var instance = this;

				var currentValue = instance.get('value');

				if (!currentValue) {
					var defaultValue = instance.get('defaultValue');

					instance.set('value', instance.get('defaultValue'));
				}

				Textfield.superclass.syncUI.apply(instance, arguments);
			},

			_filterInputText: function(event) {
				var instance = this;

				var allowOnly = instance.get('allowOnly');

				var inputChar = String.fromCharCode(event.charCode);

				if (!allowOnly.test(inputChar)) {
					event.halt();
				}
			},

			_checkDefaultValue: function(event) {
				var instance = this;

				var defaultValue = instance.get('defaultValue');
				var node = instance.get('node');
				var currentValue = Lang.trim(instance.get('value'));
				var eventType = event.type;

				var focus = (eventType == 'focus' || eventType == 'focusin');

				if (defaultValue) {
					var value = currentValue;

					if (focus && (currentValue == defaultValue)) {
						value = '';
					}
					else if (!focus && !currentValue) {
						value = defaultValue;
					}

					instance.set('value', value);
				}
			},

			_selectInputText: function(event) {
				var instance = this;

				event.currentTarget.select();
			}
		}
	}
);

A.Textfield = Textfield;


}, 'gallery-2010.08.18-17-12' ,{requires:['gallery-aui-form-field']});
