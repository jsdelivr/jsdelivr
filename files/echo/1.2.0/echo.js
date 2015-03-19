/*!
 *  Echo v1.2.0
 *  Lazy-loading images with data-* attributes
 *  Project: https://github.com/toddmotto/echo
 *  by Todd Motto: http://toddmotto.com
 *  Copyright. MIT licensed.
 */
window.Echo = (function (window, document, undefined) {

  'use strict';

  var store;

  var _inView = function (img) {
    var coords = img.getBoundingClientRect();
    return (coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight);
  };

  var _pollImages = function () {
    for (var i = 0; i < store.length; i++) {
      var self = store[i];
      if (_inView(self)) {
        self.src = self.getAttribute('data-echo');
        if (store.indexOf(self) !== -1) {
          store.splice(i, 1);
        }
      }
    }
  };

  var init = function () {
    store = [].slice.call(document.querySelectorAll('[data-echo]'));
    _pollImages();
    window.onscroll = _pollImages;
  };

  return {
    init: init
  };

})(window, document);
