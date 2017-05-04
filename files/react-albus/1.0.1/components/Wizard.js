'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _history = require('history');

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

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

var Wizard = function (_Component) {
  _inherits(Wizard, _Component);

  function Wizard() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Wizard);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Wizard.__proto__ || Object.getPrototypeOf(Wizard)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      step: {
        path: null,
        name: null
      }
    }, _this.init = function (steps) {
      _this.steps = steps;

      if (_this.props.onNext) {
        _this.props.onNext({ path: null, name: null }, _this.steps, _this.replace);
      } else {
        _this.replace();
      }
    }, _this.steps = [], _this.push = function (step) {
      var nextStep = step || _this.paths[_this.paths.indexOf(_this.state.step.path) + 1];
      _this.props.history.push((0, _utils2.default)(_this.props.basename + '/' + nextStep));
    }, _this.replace = function (step) {
      var nextStep = step || _this.paths[0];
      _this.props.history.replace((0, _utils2.default)(_this.props.basename + '/' + nextStep));
    }, _this.next = function () {
      if (_this.props.onNext) {
        _this.props.onNext(_this.state.step, _this.steps, _this.push);
      } else {
        _this.push();
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Wizard, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        wizard: {
          step: this.state.step,
          steps: this.steps,
          next: this.next,
          previous: this.props.history.goBack,
          push: this.push,
          go: this.props.history.go,
          history: this.props.history
        },
        wizardInit: this.init
      };
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      this.unlisten = this.props.history.listen(function (_ref2) {
        var pathname = _ref2.pathname;

        var path = pathname.split('/').pop();
        var step = _this2.steps.filter(function (s) {
          return s.path === path;
        })[0];
        if (step) {
          _this2.setState({
            step: step
          });
        }
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unlisten();
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.props.render) {
        return this.props.render(this.getChildContext().wizard);
      }
      return _react2.default.createElement(
        'div',
        { className: this.props.className },
        this.props.children
      );
    }
  }, {
    key: 'paths',
    get: function get() {
      return this.steps.map(function (s) {
        return s.path;
      });
    }
  }]);

  return Wizard;
}(_react.Component);

Wizard.propTypes = {
  basename: _propTypes2.default.string,
  children: _propTypes2.default.node,
  className: _propTypes2.default.string,
  history: _propTypes2.default.shape({
    entries: _propTypes2.default.array,
    go: _propTypes2.default.func,
    goBack: _propTypes2.default.func,
    listen: _propTypes2.default.func,
    location: _propTypes2.default.object,
    push: _propTypes2.default.func,
    replace: _propTypes2.default.func
  }),
  onNext: _propTypes2.default.func,
  render: _propTypes2.default.func
};

Wizard.defaultProps = {
  basename: '',
  children: null,
  className: '',
  history: (0, _history.createMemoryHistory)(),
  onNext: null,
  render: null
};

Wizard.childContextTypes = {
  wizard: _propTypes2.default.object,
  wizardInit: _propTypes2.default.func
};

exports.default = Wizard;