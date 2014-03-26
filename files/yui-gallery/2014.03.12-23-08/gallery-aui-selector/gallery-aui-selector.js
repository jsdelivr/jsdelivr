YUI.add('gallery-aui-selector', function(A) {

var Lang = A.Lang,
	isString = Lang.isString,

	SELECTOR = A.Selector,

	getClassName = A.ClassNameManager.getClassName,

	CSS_HIDDEN_PREFIX = A.ClassNameManager.getClassName('helper', 'hidden'),
	REGEX_HIDDEN_CLASSNAMES = new RegExp(CSS_HIDDEN_PREFIX);

	SELECTOR._isNodeHidden = function(node) {
		var width = node.offsetWidth;
		var height = node.offsetHeight;
		var ignore = node.nodeName.toLowerCase() == 'tr';
		var className = node.className;
		var nodeStyle = node.style;

		var hidden = false;

		if (!ignore) {
			if (width == 0 && height == 0) {
				hidden = true;
			}
			else if (width > 0 && height > 0) {
				hidden = false;
			}
		}

		hidden = hidden || (nodeStyle.display == 'none' || nodeStyle.visibility == 'hidden') || REGEX_HIDDEN_CLASSNAMES.test(className);

		return hidden;
	};

	var testNodeType = function(type) {
		return function(node) {
			return node.type == type;
		};
	};

	A.mix(
		SELECTOR.pseudos,
		{
			button: function(node) {
				return node.type === 'button' || node.nodeName.toLowerCase() === 'button';
			},

			checkbox: testNodeType('checkbox'),

			checked: function(node) {
				return node.checked === true;
			},

			disabled: function(node) {
				return node.disabled === true;
			},

			empty: function(node) {
				return !node.firstChild;
			},

			enabled: function(node) {
				return node.disabled === false && node.type !== 'hidden';
			},

			file: testNodeType('file'),

			header: function(node) {
				return /h\d/i.test(node.nodeName);
			},

			hidden: function(node) {
				return SELECTOR._isNodeHidden(node);
			},

			image: testNodeType('image'),

			input: function(node) {
				return /input|select|textarea|button/i.test(node.nodeName);
			},

			parent: function(node) {
				return !!node.firstChild;
			},

			password: testNodeType('password'),

			radio: testNodeType('radio'),

			reset: testNodeType('reset'),

			selected: function(node) {
				node.parentNode.selectedIndex;
				return node.selected === true;
			},

			submit: testNodeType('submit'),

			text: testNodeType('text'),

			visible: function(node) {
				return !SELECTOR._isNodeHidden(node);
			}
		}
	);


}, 'gallery-2010.08.18-17-12' ,{requires:['selector'], skinnable:false});
