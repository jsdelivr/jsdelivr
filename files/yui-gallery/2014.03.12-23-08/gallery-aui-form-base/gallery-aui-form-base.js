YUI.add('gallery-aui-form-base', function(A) {

var Lang = A.Lang,

	getClassName = A.ClassNameManager.getClassName,

	NAME = 'form',

	CSS_FORM = getClassName(NAME),
	CSS_LABELS = getClassName('field', 'labels'),
	CSS_LABELS_INLINE = getClassName('field', 'labels', 'inline'),

	CSS_LABEL_ALIGN = {
		left: [CSS_LABELS, 'left'].join('-'),
		right: [CSS_LABELS, 'right'].join('-'),
		top: [CSS_LABELS, 'top'].join('-')
	};

var Form = A.Component.create(
	{
		NAME: NAME,

		ATTRS: {
			action: {
				value: location.href,
				getter: '_attributeGetter',
				setter: '_attributeSetter'
			},
			id: {},
			method: {
				value: 'POST',
				getter: '_attributeGetter',
				setter: '_attributeSetter'
			},
			monitorChanges: {
				value: false
			},
			nativeSubmit: {
				value: false
			},

			values: {
				getter: function(value) {
					var instance = this;

					var values = A.io._serialize(instance.get('contentBox').getDOM());

					return A.QueryString.parse(values);
				},

				setter: function(value) {
					var instance = this;

					var setFields = instance._setFieldsObject;

					var monitorChanges = instance.get('monitorChanges');

					if (Lang.isArray(value)) {
						setFields = instance._setFieldsArray;
					}

					A.each(value, A.rbind(setFields, instance, monitorChanges));

					return A.Attribute.INVALID_VALUE;
				}
			},

			fieldValues: {
				getter: function(value) {
					var instance = this;

					var obj = {};

					instance.fields.each(
						function(item, index, collection) {
							obj[item.get('name')] = item.get('value');
						}
					);

					return obj;
				}
			},

			labelAlign: {
				value: ''
			}
		},

		HTML_PARSER: {
			action: function(contentBox) {
				var instance = this;

				return instance._attributeGetter(null, 'action');
			},

			method: function(contentBox) {
				var instance = this;

				return instance._attributeGetter(null, 'method');
			}
		},

		prototype: {
			CONTENT_TEMPLATE: '<form></form>',

			initializer: function() {
				var instance = this;

				instance.fields = new A.DataSet(
					{
						getKey: instance._getNodeId
					}
				);
			},

			renderUI: function() {
				var instance = this;

				instance._renderForm();
			},

			bindUI: function() {
				var instance = this;

				var nativeSubmit = instance.get('nativeSubmit');

				if (!nativeSubmit) {
					instance.get('contentBox').on('submit', instance._onSubmit);
				}

				instance.after('disabledChange', instance._afterDisabledChange);
				instance.after('labelAlignChange', instance._afterLabelAlignChange);
				instance.after('nativeSubmitChange', instance._afterNativeSubmitChange);
			},

			syncUI: function() {
				var instance = this;

				var node = instance.get('contentBox');

				instance.set('id', node.guid());

				instance._uiSetLabelAlign(instance.get('labelAlign'));
			},

			add: function(fields, render) {
				var instance = this;

				var args = A.Array(fields);
				var length = args.length;
				var field;

				var fields = instance.fields;

				var contentBox = instance.get('contentBox');

				for (var i = 0; i < args.length; i++) {
					field = args[i];

					field = A.Field.getField(field);

					if (field && fields.indexOf(field) == -1) {
						fields.add(field);

						if (render && !field.get('rendered')) {
							var node = field.get('node');

							var location = null;

							if (!node.inDoc()) {
								location = contentBox;
							}

							field.render(location);
						}
					}
				}
			},

			clearInvalid: function() {
				var instance = this;

				instance.fields.each(
					function(item, index, collection) {
						item.clearInvalid();
					}
				);
			},

			getField: function(id) {
				var instance = this;

				var field;

				if (id) {
					var fields = instance.fields;

					field = fields.item(id);

					if (!Lang.isObject(field)) {
						fields.each(
							function(item, index, collection) {
								if (item.get('id') == id || item.get('name') == id) {
									field = item;

									return false;
								}
							}
						);
					}
				}

				return field;
			},

			invoke: function(method, args) {
				var instance = this;

				return instance.fields.invoke(method, args);
			},

			isDirty: function() {
				var instance = this;

				var dirty = false;

				instance.fields.each(
					function(item, index, collection) {
						if (item.isDirty()) {
							dirty = true;

							return false;
						}
					}
				);

				return dirty;
			},

			isValid: function() {
				var instance = this;

				var valid = true;

				instance.fields.each(
					function(item, index, collection) {
						if (!item.isValid()) {
							valid = false;

							return false;
						}
					}
				);

				return valid;
			},

			markInvalid: function(value) {
				var instance = this;

				var markFields = instance._markInvalidObject;

				if (Lang.isArray(value)) {
					markFields = instance._markInvalidArray;
				}

				A.each(value, markFields, instance);

				return instance;
			},

			remove: function(field, fromMarkup) {
				var instance = this;

				instance.fields.remove(field);

				if (fromMarkup) {
					field = instance.getField(field);

					if (field) {
						field.destroy();
					}
				}

				return instance;
			},

			resetValues: function() {
				var instance = this;

				instance.fields.each(
					function(item, index, collection) {
						item.resetValue();
					}
				);
			},

			submit: function(config) {
				var instance = this;

				var valid = instance.isValid();

				if (valid) {
					if (instance.get('nativeSubmit')) {
						instance.get('contentBox').submit();
					}
					else {
						config = config || {};

						A.mix(
							config,
							{
								id: instance.get('id')
							}
						);

						A.io(
							instance.get('action'),
							{
								form: config,
								method: instance.get('method'),
								on: {
									complete: A.bind(instance._onSubmitComplete, instance),
									end: A.bind(instance._onSubmitEnd, instance),
									failure: A.bind(instance._onSubmitFailure, instance),
									start: A.bind(instance._onSubmitStart, instance),
									success: A.bind(instance._onSubmitSuccess, instance)
								}
							}
						);
					}
				}

				return valid;
			},

			_afterDisabledChange: function(event) {
				var instance = this;

				var action = 'disable';

				if (event.newVal) {
					action = 'enable';
				}

				instance.fields.each(
					function(item, index, collection) {
						item[action];
					}
				);
			},

			_afterLabelAlignChange: function(event) {
				var instance = this;

				instance._uiSetLabelAlign(event.newVal, event.prevVal)
			},

			_afterNativeSubmitChange: function(event) {
				var instance = this;

				var contentBox = instance.get('contentBox');

				var action = 'on';

				if (event.newVal) {
					action = 'detach';
				}

				contentBox[action]('submit', instance._onSubmit);
			},

			_attributeGetter: function(value, key) {
				var instance = this;

				return instance.get('contentBox').attr(key);
			},

			_attributeSetter: function(value, key) {
				var instance = this;

				instance.get('contentBox').attr(key, value);

				return value;
			},

			_getNodeId: function(obj) {
				var node;

				if (obj instanceof A.Field) {
					node = obj.get('node');
				}
				else {
					node = A.one(obj);
				}
				var guid = node && node.guid();

				return guid;
			},

			_onSubmit: function(event) {
				event.halt();
			},

			_onSubmitComplete: function(event) {
				var instance = this;

				instance.fire(
					'complete',
					 {
					 	ioEvent: event
					 }
				);
			},

			_onSubmitEnd: function(event) {
				var instance = this;

				instance.fire(
					'end',
					 {
					 	ioEvent: event
					 }
				);
			},

			_onSubmitFailure: function(event) {
				var instance = this;

				instance.fire(
					'failure',
					 {
					 	ioEvent: event
					 }
				);
			},

			_onSubmitStart: function(event) {
				var instance = this;

				instance.fire(
					'start',
					 {
					 	ioEvent: event
					 }
				);
			},

			_onSubmitSuccess: function(event) {
				var instance = this;

				instance.fire(
					'success',
					 {
					 	ioEvent: event
					 }
				);
			},

			_renderForm: function() {
				var instance = this;

				instance.get('contentBox').removeClass(CSS_FORM);
			},

			_markInvalidArray: function(item, index, collection) {
				var instance = this;

				var field = instance.getField(item.id);

				if (field) {
					field.markInvalid(item.message);
				}
			},

			_markInvalidObject: function(item, index, collection) {
				var instance = this;

				var field = (!Lang.isFunction(item)) && instance.getField(index);

				if (field) {
					field.markInvalid(item);
				}
			},

			_setFieldsArray: function(item, index, collection, monitorChanges) {
				var instance = this;

				var field = instance.getField(item.id);

				if (field) {
					field.set('value', item.value);

					if (monitorChanges) {
						field.set('prevVal', field.get('value'));
					}
				}
			},

			_setFieldsObject: function(item, index, collection, monitorChanges) {
				var instance = this;

				var field = (!Lang.isFunction(item)) && instance.getField(index);

				if (field) {
					field.set('value', item);

					if (monitorChanges) {
						field.set('prevVal', field.get('value'));
					}
				}
			},

			_uiSetLabelAlign: function(newVal, prevVal) {
				var instance = this;

				var contentBox = instance.get('contentBox');

				contentBox.replaceClass(CSS_LABEL_ALIGN[prevVal], CSS_LABEL_ALIGN[newVal]);

				var action = 'removeClass';

				if (/right|left/.test(newVal)) {
					action = 'addClass';
				}

				contentBox[action](CSS_LABELS_INLINE);
			}
		}
	}
);

A.Form = Form;


}, 'gallery-2010.08.18-17-12' ,{requires:['gallery-aui-base','gallery-aui-data-set','gallery-aui-form-field','querystring-parse']});
