/*!
 * Tez.UI v0.0.0-development
 * UI add-on for amazing Tez.js library
 * 2016, @dalisoft. Licensed under Apache-2.0 license
 * https://github.com/dalisoft/tez-ui, https://github.com/dalisoft/tez
 */

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(['tez.js', 'dom-parser'], factory);
	} else if (typeof module !== "undefined" && module.exports) {
		module.exports = factory(require('tez.js'), require('dom-parser'));
	} else if (typeof window !== "undefined" && window.document) {
		window.UI = factory(window.Tez, DOMParser);
	}
})(function (tez, DOMParser_constructor) {
	return function () {
		function UI() {
			_classCallCheck(this, UI);
		}

		_createClass(UI, null, [{
			key: 'createHTMLString',
			value: function createHTMLString(_ref) {
				var tag = _ref.tag,
				    attrs = _ref.attrs,
				    content = _ref.content;

				return '<' + tag + ' ' + attrs + '>' + content + '</' + tag + '>';
			}
		}, {
			key: 'ui2node',
			value: function ui2node(_ref2) {
				var input = _ref2.input,
				    _ref2$type = _ref2.type,
				    type = _ref2$type === undefined ? 'text/html' : _ref2$type;

				if (Array.isArray(input)) {
					return input;
				} else {
					var node = new DOMParser_constructor().parseFromString(typeof input === "string" ? input : (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === "object" ? UI.createHTMLString(input) : '<div/>', type);
					return Array.from(node.getElementsByTagName('body')[0].childNodes);
				}
			}
		}, {
			key: 'node2apply',
			value: function node2apply(_ref3) {
				var input = _ref3.input,
				    parent = _ref3.parent;

				var appl = input && input.nodeType ? input : typeof input === "string" || (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === "object" ? UI.ui2node({ input: input }) : [];
				if (parent !== undefined) {
					var getChildNodes = Array.from(appl),
					    child = void 0;
					while (child = getChildNodes.shift()) {
						parent.appendChild(child);
					}
					return parent;
				}
				return null;
			}
		}, {
			key: 'createUIElement',
			value: function createUIElement(_ref4) {
				var param = _ref4.param,
				    context = _ref4.context;

				var doneRes = UI.node2apply(param, context);
				return doneRes;
			}
		}, {
			key: 'UIElements',
			get: function get() {
				return {
					Button: UI.ui2node({
						input: {
							tag: 'button',
							attrs: 'class="btn btn-primary"',
							content: 'Button'
						}
					})
				};
			}
		}]);

		return UI;
	}();
});