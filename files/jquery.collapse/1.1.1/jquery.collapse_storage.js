/*
 * Storage for jQuery Collapse
 * --
 * source: http://github.com/danielstocks/jQuery-Collapse/
 * site: http://webcloud.se/jQuery-Collapse
 *
 * @author Daniel Stocks (http://webcloud.se)
 * Copyright 2013, Daniel Stocks
 * Released under the MIT, BSD, and GPL Licenses.
 */

(function($) {

  var STORAGE_KEY = "jQuery-Collapse";

  function Storage(id) {
    var DB;
    try {
      DB = window.localStorage || $.fn.collapse.cookieStorage;
    } catch(e) {
      DB = false;
    }
    return DB ? new _Storage(id, DB) : false;
  }
  function _Storage(id, DB) {
    this.id = id;
    this.db = DB;
    this.data = [];
  }
  _Storage.prototype = {
    write: function(position, state) {
      var _this = this;
      _this.data[position] = state ? 1 : 0;
      // Pad out data array with zero values
      $.each(_this.data, function(i) {
        if(typeof _this.data[i] == 'undefined') {
          _this.data[i] = 0;
        }
      });
      var obj = this._getDataObject();
      obj[this.id] = this.data;
      this.db.setItem(STORAGE_KEY, JSON.stringify(obj));
    },
    read: function() {
      var obj = this._getDataObject();
      return obj[this.id] || [];
    },
    _getDataObject: function() {
      var string = this.db.getItem(STORAGE_KEY);
      return string ? JSON.parse(string) : {};
    }
  };

  jQueryCollapseStorage = Storage;

})(jQuery);
