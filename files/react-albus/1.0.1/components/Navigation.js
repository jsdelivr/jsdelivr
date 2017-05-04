'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _withWizard = require('../withWizard');

var _withWizard2 = _interopRequireDefault(_withWizard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /*
                                                                                                                                                                                                                              * Copyright (c) 2017 American Express Travel Related Services Company, Inc.
                                                                                                                                                                                                                              *
                                                                                                                                                                                                                              * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
                                                                                                                                                                                                                              * in compliance with the License. You may obtain a copy of the License at
                                                                                                                                                                                                                              *
                                                                                                                                                                                                                              * http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                              *
                                                                                                                                                                                                                              * Unless required by applicable law or agreed to in writing, software distributed under the License
                                                                                                                                                                                                                              * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
                                                                                                                                                                                                                              * or implied. See the License for the specific language governing permissions and limitations under
                                                                                                                                                                                                                              * the License.
                                                                                                                                                                                                                              */

var Navigation = function Navigation(_ref) {
  var children = _ref.children,
      render = _ref.render,
      wizard = _objectWithoutProperties(_ref, ['children', 'render']);

  if (render) {
    return render(wizard);
  } else if (typeof children === 'function') {
    return children(wizard);
  }

  return _react2.default.cloneElement(_react2.default.Children.only(children), _extends({}, wizard));
};

Navigation.propTypes = {
  children: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func]),
  render: _propTypes2.default.func,
  wizard: _propTypes2.default.shape({
    setSteps: _propTypes2.default.func,
    step: _propTypes2.default.object,
    steps: _propTypes2.default.array,
    next: _propTypes2.default.func,
    previous: _propTypes2.default.func,
    push: _propTypes2.default.func,
    go: _propTypes2.default.func,
    location: _propTypes2.default.object
  })
};

Navigation.defaultProps = {
  children: null,
  render: null
};

exports.default = (0, _withWizard2.default)(Navigation);