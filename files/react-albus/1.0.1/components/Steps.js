'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
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

var Steps = function (_Component) {
  _inherits(Steps, _Component);

  function Steps() {
    _classCallCheck(this, Steps);

    return _possibleConstructorReturn(this, (Steps.__proto__ || Object.getPrototypeOf(Steps)).apply(this, arguments));
  }

  _createClass(Steps, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _context = this.context,
          wizard = _context.wizard,
          wizardInit = _context.wizardInit;

      // Register steps with Wizard if they're not already registered

      if (wizard && !wizard.steps.length) {
        var steps = _react2.default.Children.map(this.props.children, function (child) {
          return {
            path: child.props.path,
            name: child.props.name
          };
        });
        wizardInit(steps);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var currentStep = this.props.step || this.context.wizard.step;
      return _react2.default.Children.toArray(this.props.children).filter(function (step) {
        return currentStep && step.props.path === currentStep.path;
      })[0] || null;
    }
  }]);

  return Steps;
}(_react.Component);

Steps.propTypes = {
  children: _propTypes2.default.node.isRequired,
  step: _propTypes2.default.shape({
    path: _propTypes2.default.string,
    name: _propTypes2.default.string
  })
};

Steps.defaultProps = {
  step: null
};

Steps.contextTypes = {
  wizard: _propTypes2.default.object,
  wizardInit: _propTypes2.default.func
};

exports.default = Steps;