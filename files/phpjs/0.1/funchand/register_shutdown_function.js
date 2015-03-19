function register_shutdown_function (cb) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: register_shutdown_function(function(first, middle, last) {alert('Goodbye '+first+' '+middle+' '+last+'!');}, 'Kevin', 'van', 'Zonneveld');
  // *     returns 1: 'Goodbye Kevin van Zonneveld!'
  var args = [],
    _addEvent = function (el, type, handler, capturing) {
      if (el.addEventListener) { /* W3C */
        el.addEventListener(type, handler, !! capturing);
      } else if (el.attachEvent) { /* IE */
        el.attachEvent('on' + type, handler);
      } else { /* OLDER BROWSERS (DOM0) */
        el['on' + type] = handler;
      }
    };

  args = Array.prototype.slice.call(arguments, 1);
  _addEvent(this.window, 'unload', function () {
    cb.apply(null, args);
  }, false);
}
