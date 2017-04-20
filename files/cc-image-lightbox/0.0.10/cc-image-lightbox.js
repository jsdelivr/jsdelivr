/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CCImageLightbox = function () {
    function CCImageLightbox() {
        _classCallCheck(this, CCImageLightbox);

        this.store = {
            current: {
                galleryId: null,
                index: null
            },
            galleries: []
        };
        this.init();
    }

    _createClass(CCImageLightbox, [{
        key: '_setCurrentOpenImage',
        value: function _setCurrentOpenImage(galleryId, index) {
            this.store.current.galleryId = galleryId;
            this.store.current.index = index;
        }
    }, {
        key: '_getCurrentOpenImage',
        value: function _getCurrentOpenImage() {
            return this.store.current;
        }
    }, {
        key: '_clearCurrentOpenImage',
        value: function _clearCurrentOpenImage() {
            this.store.current.galleryId = null;
            this.store.current.index = null;
        }
    }, {
        key: '_isCurrentOpenImage',
        value: function _isCurrentOpenImage() {
            return this.store.current.galleryId !== null;
        }
    }, {
        key: '_getGallery',
        value: function _getGallery(galleryId) {
            if (this.store[galleryId] === undefined || this.store[galleryId] === null) {
                this.store[galleryId] = [];
            }
            return this.store[galleryId];
        }
    }, {
        key: '_getImage',
        value: function _getImage(galleryId, index) {
            var gallery = this._getGallery(galleryId);
            if (gallery[index] === undefined || gallery[index] === null) {
                gallery[index] = {};
            }
            return gallery[index];
        }
    }, {
        key: '_isImage',
        value: function _isImage(galleryId, index) {
            var image = this._getImage(galleryId, index);
            return !(image.src === undefined || image.src === null);
        }
    }, {
        key: '_renderNextOrPreviousButton',
        value: function _renderNextOrPreviousButton(galleryId, index, direction) {
            var self = this;
            var button = document.createElement('div');
            button.setAttribute('class', 'cc-lightbox--' + direction);
            if (self._isImage(galleryId, index)) {
                button.setAttribute('class', direction === 'left' ? 'cc-lightbox--left cc-lightbox--left--has-previous' : 'cc-lightbox--right cc-lightbox--right--has-next');
                button.onclick = function () {
                    return self.open(galleryId, index);
                };
            }
            return button;
        }
    }, {
        key: '_generateId',
        value: function _generateId(galleryId, index) {
            return 'cc-lightbox--' + galleryId + '--' + index;
        }
    }, {
        key: 'closeIfOpen',
        value: function closeIfOpen() {
            var self = this;
            var lightboxWrapper = document.getElementsByClassName('cc-lightbox-wrapper');
            if (lightboxWrapper[0] !== undefined && lightboxWrapper[0] !== null) {
                lightboxWrapper[0].remove();
            }
            self._clearCurrentOpenImage();
        }
    }, {
        key: 'open',
        value: function open(galleryId, index) {
            this.closeIfOpen();
            this._setCurrentOpenImage(galleryId, index);
            this.create(galleryId, index);
        }
    }, {
        key: 'create',
        value: function create(galleryId, index) {
            var self = this;
            var indexInt = parseInt(index, 10);

            // WRAPPER
            var wrapper = document.createElement('div');
            wrapper.setAttribute('class', 'cc-lightbox-wrapper');
            wrapper.setAttribute('data-cc-lightbox-gallery-id', galleryId);
            document.body.appendChild(wrapper);

            // TOPBAR
            var topBar = document.createElement('div');
            topBar.setAttribute('class', 'cc-lightbox--top');
            wrapper.appendChild(topBar);

            // TITLEBAR
            var titleBar = document.createElement('div');
            titleBar.setAttribute('class', 'cc-lightbox--top-title');
            titleBar.innerHTML = self._getImage(galleryId, index).title;
            topBar.appendChild(titleBar);

            // CLOSEBUTTON
            var closeButton = document.createElement('div');
            closeButton.setAttribute('class', 'cc-lightbox--top-close');
            closeButton.onclick = function () {
                return self.closeIfOpen();
            };
            topBar.appendChild(closeButton);

            // PREVIOUS BUTTON
            wrapper.appendChild(self._renderNextOrPreviousButton(galleryId, indexInt - 1, 'left'));

            // IMAGE
            var image = document.createElement('div');
            image.setAttribute('class', 'cc-lightbox--image');
            wrapper.appendChild(image);
            var imageInner = document.createElement('div');
            imageInner.setAttribute('class', 'cc-lightbox--image-inner');
            image.appendChild(imageInner);
            var imageInnerWrap = document.createElement('div');
            imageInnerWrap.setAttribute('class', 'cc-lightbox--image-inner-wrap');
            imageInner.appendChild(imageInnerWrap);
            var img = document.createElement('img');
            img.onload = function () {
                image.setAttribute('class', 'cc-lightbox--image cc-lightbox--image-loaded');
            };
            img.setAttribute('src', self._getImage(galleryId, index).src);
            img.setAttribute('class', 'cc-lightbox--image-img');
            img.setAttribute('id', self._generateId(galleryId, index));
            imageInnerWrap.appendChild(img);

            // NEXT BUTTON
            wrapper.appendChild(self._renderNextOrPreviousButton(galleryId, indexInt + 1, 'right'));

            return false;
        }
    }, {
        key: 'init',
        value: function init() {
            var self = this;
            var lightboxElements = document.querySelectorAll('[data-cc-lightbox]');

            var _loop = function _loop(i) {
                var lightboxElement = lightboxElements[i];
                var galleryId = lightboxElement.getAttribute('data-cc-lightbox');
                var nextIndex = self._getGallery(galleryId).length;
                var nextImage = self._getImage(galleryId, nextIndex);
                nextImage.title = lightboxElement.getAttribute('data-cc-title');
                nextImage.src = lightboxElement.parentNode.getAttribute('href');

                //
                // THUMBNAIL CLICK OPENS LIGHTBOX
                //
                lightboxElement.parentNode.onclick = function () {
                    self.open(galleryId, nextIndex);
                    return false;
                };
            };

            for (var i = 0; i < lightboxElements.length; i++) {
                _loop(i);
            }

            //
            // CLOSE ON ESCAPE KEY PRESS
            //
            document.addEventListener('keydown', function (event) {
                if (event.keyCode === 27) {
                    self.closeIfOpen();
                }
                if (event.keyCode === 37) {
                    // left
                    if (self._isCurrentOpenImage()) {
                        var current = self._getCurrentOpenImage();
                        if (self._isImage(current.galleryId, current.index - 1)) {
                            self.open(current.galleryId, current.index - 1);
                        }
                    }
                }
                if (event.keyCode === 39) {
                    // right
                    if (self._isCurrentOpenImage()) {
                        var _current = self._getCurrentOpenImage();
                        if (self._isImage(_current.galleryId, _current.index + 1)) {
                            self.open(_current.galleryId, _current.index + 1);
                        }
                    }
                }
            }, false);
        }
    }]);

    return CCImageLightbox;
}();

;

exports.default = CCImageLightbox;
module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

var _ccImageLightbox = __webpack_require__(0);

var _ccImageLightbox2 = _interopRequireDefault(_ccImageLightbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * USED TO GENERATE A BROWSER VERSION WITH WEBPACK.
 * SEE build/* FILES
 */
new _ccImageLightbox2.default();

/***/ })
/******/ ]);