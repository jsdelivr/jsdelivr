YUI.add('gallery-aui-form-combobox', function(A) {

var Lang = A.Lang,

	getClassName = A.ClassNameManager.getClassName,

	NAME = 'combobox',

	CSS_COMBOBOX = getClassName(NAME);

var Combobox = A.Component.create(
	{
		NAME: NAME,

		ATTRS: {
			field: {
			},

			fieldWidget: {
				value: A.Textfield
			},

			node: {
				getter: function() {
					var instance = this;

					if (instance._field) {
						return instance._field.get('node');
					}
				}
			},

			icons: {
				value: ['circle-triangle-b'],
				validator: Lang.isArray
			}
		},

		prototype: {
			renderUI: function() {
				var instance = this;

				Combobox.superclass.renderUI.call(instance);

				instance._renderField();
				instance._renderIcons();
			},

			_renderField: function() {
				var instance = this;

				var contentBox = instance.get('contentBox');

				var field = instance.get('field');
				var fieldWidget = instance.get('fieldWidget');

				instance._field = new fieldWidget(field).render();

				contentBox.appendChild(instance._field.get('boundingBox'));
			},

			_renderIcons: function() {
				var instance = this;

				var icons = instance.get('icons');

				if (icons.length) {
					var toolbar = new A.Toolbar(
						{
							children: icons
						}
					).render(instance.get('contentBox'));

					instance.icons = toolbar;
				}
			}
		}
	}
);

A.Combobox = Combobox;


}, 'gallery-2010.08.18-17-12' ,{skinnable:true, requires:['gallery-aui-form-textarea','gallery-aui-toolbar']});
