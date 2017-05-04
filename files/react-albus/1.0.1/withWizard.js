'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var withWizard = function withWizard(component) {
  var WithWizard = function WithWizard(props, _ref) {
    var wizard = _ref.wizard;
    return _react2.default.createElement(component, _extends({}, wizard, props));
  };

  WithWizard.contextTypes = {
    wizard: _propTypes2.default.object
  };

  WithWizard.displayName = 'withWizard(' + (component.displayName || component.name) + ')';
  return WithWizard;
};

exports.default = withWizard;