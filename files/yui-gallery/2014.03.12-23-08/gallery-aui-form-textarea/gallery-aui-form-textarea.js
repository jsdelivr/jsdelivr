YUI.add('gallery-aui-form-textarea', function(A) {

var Lang = A.Lang,

	getClassName = A.ClassNameManager.getClassName,

	NAME = 'textarea',

	CSS_TEXTAREA = getClassName(NAME),
	CSS_HEIGHT_MONITOR = [
		getClassName(NAME, 'height', 'monitor'),
		getClassName('field', 'text', 'input'),
		getClassName('helper', 'hidden', 'accessible')
	].join(' '),

	DEFAULT_EMPTY_CONTENT = '&nbsp;&nbsp;',
	DEFAULT_APPEND_CONTENT = '&nbsp;\n&nbsp;',

	TPL_HEIGHT_MONITOR_OPEN = '<pre class="' + CSS_HEIGHT_MONITOR + '">',
	TPL_HEIGHT_MONITOR_CLOSE = '</pre>',
	TPL_INPUT = '<textarea autocomplete="off" class="{cssClass}" name="{name}"></textarea>';

var Textarea = A.Component.create(
	{
		NAME: NAME,

		ATTRS: {
			autoSize: {
				value: true
			},

			height: {
				value: 'auto'
			},

			maxHeight: {
				value: 1000,
				setter: '_setAutoDimension'
			},

			minHeight: {
				value: 45,
				setter: '_setAutoDimension'
			},

			width: {
				value: 'auto',
				setter: '_setAutoDimension'
			}
		},

		HTML_PARSER: {
			node: 'textarea'
		},

		EXTENDS: A.Textfield,

		prototype: {
			FIELD_TEMPLATE: TPL_INPUT,
			renderUI: function() {
				var instance = this;

				Textarea.superclass.renderUI.call(instance);

				if (instance.get('autoSize')) {
					instance._renderHeightMonitor();
				}
			},

			bindUI: function() {
				var instance = this;

				Textarea.superclass.bindUI.call(instance);

				if (instance.get('autoSize')) {
					instance.get('node').on('keyup', instance._onKeyup, instance);
				}

				instance.after('adjustSize', instance._uiAutoSize);

				instance.after('heightChange', instance._afterHeightChange);
				instance.after('widthChange', instance._afterWidthChange);
			},

			syncUI: function() {
				var instance = this;

				Textarea.superclass.syncUI.call(instance);

				instance._setAutoDimension(instance.get('minHeight'), 'minHeight');
				instance._setAutoDimension(instance.get('maxHeight'), 'maxHeight');

				var width = instance.get('width');
				var height = instance.get('minHeight');

				instance._setAutoDimension(width, 'width');

				instance._uiSetDim('height', height);
				instance._uiSetDim('width', width);
			},

			_afterHeightChange: function(event) {
				var instance = this;

				instance._uiSetDim('height', event.newVal, event.prevVal);
			},

			_afterWidthChange: function(event) {
				var instance = this;

				instance._uiSetDim('width', event.newVal, event.prevVal);
			},

			_onKeyup: function(event) {
				var instance = this;

				instance.fire('adjustSize');
			},

			_renderHeightMonitor: function() {
				var instance = this;

				var heightMonitor = A.Node.create(TPL_HEIGHT_MONITOR_OPEN + TPL_HEIGHT_MONITOR_CLOSE);
				var node = instance.get('node');

				A.getBody().append(heightMonitor);

				instance._heightMonitor = heightMonitor;

				var fontFamily = node.getComputedStyle('fontFamily');
				var fontSize = node.getComputedStyle('fontSize');
				var fontWeight = node.getComputedStyle('fontWeight');
				var lineHeight = node.getComputedStyle('fontSize');

				node.setStyle('height', instance.get('minHeight') + 'px');

				heightMonitor.setStyles(
					{
						fontFamily: fontFamily,
						fontSize: fontSize,
						fontWeight: fontWeight
					}
				);

				if ('outerHTML' in heightMonitor.getDOM()) {
					instance._updateContent = instance._updateOuterContent;
				}
				else {
					instance._updateContent = instance._updateInnerContent;
				}
			},

			_setAutoDimension: function(value, key) {
				var instance = this;

				instance['_' + key] = value;
			},

			_uiAutoSize: function() {
				var instance = this;

				var node = instance.get('node');
				var heightMonitor = instance._heightMonitor;

				var minHeight = instance._minHeight;
				var maxHeight = instance._maxHeight;

				var content = node.val();
				var textNode = document.createTextNode(content);

				heightMonitor.set('innerHTML', '');

				heightMonitor.appendChild(textNode);

				heightMonitor.setStyle('width', node.getComputedStyle('width'));

				content = heightMonitor.get('innerHTML');

				if (!content.length) {
					content = DEFAULT_EMPTY_CONTENT;
				}
				else {
					content += DEFAULT_APPEND_CONTENT;
				}

				instance._updateContent(content);

				var height = Math.max(heightMonitor.get('offsetHeight'), minHeight);

				height = Math.min(height, maxHeight);

				if (height != instance._lastHeight) {
					instance._lastHeight = height;

					instance._uiSetDim('height', height);
				}
			},

			_uiSetDim: function(key, newVal) {
				var instance = this;

				var node = instance.get('node');

				if (Lang.isNumber(newVal)) {
					newVal += 'px';
				}

				node.setStyle(key, newVal);
			},

			_updateInnerContent: function(content) {
				var instance = this;

				return instance._heightMonitor.set('innerHTML', content);
			},

			_updateOuterContent: function(content) {
				var instance = this;

				content = content.replace(/\n/g, '<br />');

				return instance._updateInnerContent(content);
			}
		}
	}
);

A.Textarea = Textarea;


}, 'gallery-2010.08.18-17-12' ,{skinnable:true, requires:['gallery-aui-form-textfield']});
